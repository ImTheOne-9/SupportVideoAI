"""Local HTTP API nối giao diện Vite với Whisper và Gemini.

Chạy bằng: python -m engine.api_server
"""

from __future__ import annotations

import base64
import json
import os
import re
import shutil
import sys
import tempfile
import warnings
import threading
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from typing import Any

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")
from urllib.parse import unquote, urlparse

from engine.api.security import is_allowed_origin
from engine.config import DEFAULT_SETTINGS, ServerConfig, normalize_settings
from engine.gemini_indexer import GeminiBrollIndexer
from engine.project_store import ProjectStore
from engine.semantic_matcher import create_placements, local_embedding, scene_text, search_scenes
from engine.services.content_service import ContentService
from engine.services.gemini_service import GeminiService
from engine.services.whisper_service import WhisperService
from engine.xml_exporter import TimelineXMLExporter
from engine.mp4_exporter import MP4Exporter

with warnings.catch_warnings():
    warnings.simplefilter("ignore", DeprecationWarning)
    try:
        import cgi
    except ImportError:
        cgi = None


SERVER_CONFIG = ServerConfig.from_environment()
HOST = SERVER_CONFIG.host
PORT = SERVER_CONFIG.port
MAX_UPLOAD_BYTES = SERVER_CONFIG.max_upload_bytes
_project_store = None
_project_store_lock = threading.Lock()

def _app_settings() -> dict[str, Any]:
    return {**DEFAULT_SETTINGS, **_get_project_store().get_settings()}


def _get_project_store() -> ProjectStore:
    global _project_store
    with _project_store_lock:
        if _project_store is None:
            _project_store = ProjectStore()
    return _project_store


_whisper_service = WhisperService(_app_settings)
_gemini_service = GeminiService(os.environ.get("GEMINI_API_KEY", ""), _app_settings)
_content_service = ContentService(_gemini_service, _app_settings)


def _get_whisper_model():
    return _whisper_service.get_model()


def _timecode(seconds: float) -> str:
    minutes = int(seconds // 60)
    secs = int(seconds % 60)
    return f"{minutes:02d}:{secs:02d}"


def _embed_texts(texts: list[str]) -> tuple[list[list[float]], str]:
    return _gemini_service.embed_texts(texts, local_embedding)


def _prepare_whisper_audio(source_path: str) -> str:
    return _whisper_service.prepare_audio(source_path)


class ApiHandler(BaseHTTPRequestHandler):
    server_version = "CreatorUtilsAPI/1.0"

    def _cors(self) -> None:
        origin = self.headers.get("Origin", "")
        if is_allowed_origin(origin):
            self.send_header("Access-Control-Allow-Origin", origin)
            self.send_header("Vary", "Origin")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")

    def _json(self, status: int, payload: Any) -> None:
        body = json.dumps(payload, ensure_ascii=False).encode("utf-8")
        self.send_response(status)
        self._cors()
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _read_body(self) -> bytes:
        length = int(self.headers.get("Content-Length", "0"))
        if length > MAX_UPLOAD_BYTES:
            raise ValueError("File vượt quá giới hạn upload của AI engine.")
        return self.rfile.read(length)

    def _read_json(self) -> dict[str, Any]:
        return json.loads(self._read_body().decode("utf-8"))

    def do_OPTIONS(self) -> None:  # noqa: N802
        self.send_response(204)
        self._cors()
        self.end_headers()

    def do_GET(self) -> None:  # noqa: N802
        path = urlparse(self.path).path
        if path == "/api/health":
            try:
                import faster_whisper  # noqa: F401
                whisper_ready = True
            except ImportError:
                whisper_ready = False
            try:
                import huggingface_hub  # noqa: F401
                huggingface_ready = True
            except ImportError:
                huggingface_ready = False
            self._json(200, {
                "ok": True,
                "apiVersion": 7,
                "geminiConfigured": _gemini_service.configured,
                "whisperReady": whisper_ready,
                "huggingFaceReady": huggingface_ready,
                "ffmpegReady": _whisper_service.ffmpeg_ready(),
                "storagePath": str(_get_project_store().db_path),
                "features": ["scene-index", "semantic-broll", "semantic-search", "edl-export"],
            })
            return
        if path == "/api/settings":
            self._json(200, {"settings": _app_settings(), "geminiConfigured": _gemini_service.configured})
            return
        if path == "/api/models/whisper":
            self._json(200, {"models": self._whisper_models()})
            return
        if path == "/api/broll-index":
            self._json(200, {"scenes": _get_project_store().get_broll_index()})
            return
        if path == "/api/projects":
            self._json(200, {"projects": _get_project_store().list()})
            return
        if path.startswith("/api/projects/"):
            project_id = unquote(path.rsplit("/", 1)[-1])
            project = _get_project_store().get(project_id)
            if project is None:
                self._json(404, {"error": "Không tìm thấy dự án đã lưu."})
            else:
                self._json(200, {"project": project})
            return
        self._json(404, {"error": "Không tìm thấy endpoint."})

    def do_POST(self) -> None:  # noqa: N802
        try:
            if self.path == "/api/config/gemini":
                self._configure_gemini()
            elif self.path == "/api/settings":
                self._save_settings()
            elif self.path == "/api/models/whisper/download":
                self._download_whisper_model()
            elif self.path == "/api/index-broll":
                self._index_broll()
            elif self.path == "/api/index-broll-scenes":
                self._index_broll_scenes()
            elif self.path == "/api/match-broll":
                self._match_broll()
            elif self.path == "/api/search-broll":
                self._search_broll()
            elif self.path == "/api/transcribe":
                self._transcribe()
            elif self.path == "/api/transcribe-stream":
                self._transcribe_stream()
            elif self.path == "/api/segment":
                self._segment()
            elif self.path == "/api/summarize":
                self._summarize()
            elif self.path == "/api/metadata":
                self._metadata()
            elif self.path == "/api/ad-compliance":
                self._ad_compliance()
            elif self.path == "/api/export":
                self._export_timeline()
            elif self.path == "/api/projects":
                self._save_project()
            else:
                self._json(404, {"error": "Không tìm thấy endpoint."})
        except (ValueError, json.JSONDecodeError) as exc:
            self._json(400, {"error": str(exc)})
        except ImportError as exc:
            self._json(503, {"error": f"Thiếu dependency: {exc}. Hãy cài requirements.txt."})
        except Exception as exc:  # API boundary: return a useful error to the local UI
            self._json(500, {"error": f"AI engine gặp lỗi: {exc}"})

    def do_DELETE(self) -> None:  # noqa: N802
        try:
            path = urlparse(self.path).path
            if path.startswith("/api/projects/"):
                project_id = unquote(path.rsplit("/", 1)[-1])
                deleted = _get_project_store().delete(project_id)
                self._json(200 if deleted else 404, {"ok": deleted, "error": None if deleted else "Không tìm thấy dự án."})
                return
            if path.startswith("/api/models/whisper/"):
                model_id = unquote(path.rsplit("/", 1)[-1])
                self._delete_whisper_model(model_id)
                return
            if path.startswith("/api/broll-index/"):
                clip_id = unquote(path.rsplit("/", 1)[-1])
                deleted = _get_project_store().delete_broll_index(clip_id)
                self._json(200 if deleted else 404, {"ok": deleted})
                return
            self._json(404, {"error": "Không tìm thấy endpoint."})
        except Exception as exc:
            self._json(500, {"error": f"Không thể xóa dự án: {exc}"})

    def _save_project(self) -> None:
        data = self._read_json()
        if not data.get("transcripts"):
            raise ValueError("Bản ghi lời đang trống, không có dữ liệu để lưu.")
        saved = _get_project_store().save(data)
        self._json(200, {"ok": True, **saved})

    def _export_timeline(self) -> None:
        data = self._read_json()
        export_format = str(data.get("format", "fcpxml")).lower()
        if export_format not in {"fcpxml", "premiere", "davinci", "ffmpeg"}:
            raise ValueError("Định dạng timeline không được hỗ trợ.")
        total_duration = float(data.get("totalDurationSec", 0) or 0)
        if total_duration <= 0:
            raise ValueError("Thời lượng A-Roll phải lớn hơn 0.")
        project_name = str(data.get("projectName") or "CreatorUtils Project").strip()[:160]
        aroll_name = Path(str(data.get("arollName") or "A-Roll.mov")).name
        fps = float(data.get("fps", 30) or 30)
        if fps not in {23.976, 24.0, 25.0, 29.97, 30.0, 50.0, 59.94, 60.0}:
            raise ValueError("Frame rate không được hỗ trợ.")
        width = max(16, min(16384, int(data.get("width", 3840) or 3840)))
        height = max(16, min(16384, int(data.get("height", 2160) or 2160)))
        placements = data.get("placements") or []
        cuts = data.get("cuts") or []
        if not isinstance(placements, list) or not isinstance(cuts, list):
            raise ValueError("Placements và cuts phải là danh sách.")
        safe_name = re.sub(r"[^\w.-]+", "_", project_name, flags=re.UNICODE).strip("._") or "CreatorUtils_Project"

        if export_format == "ffmpeg":
            exporter = MP4Exporter(project_name, width, height)
            content = exporter.generate_bat_script(aroll_name, total_duration, placements, cuts)
            extension = "bat"
        else:
            exporter = TimelineXMLExporter(project_name, fps, width, height)
            if export_format == "fcpxml":
                content = exporter.export_fcpxml(aroll_name, total_duration, placements, cuts)
                extension = "fcpxml"
            else:
                content = exporter.export_premiere_xml(aroll_name, total_duration, placements, cuts)
                extension = "xml"

        self._json(200, {
            "content": content,
            "filename": f"{safe_name}_{export_format}.{extension}",
            "format": export_format,
        })

    def _configure_gemini(self) -> None:
        api_key = str(self._read_json().get("apiKey", "")).strip()
        _gemini_service.configure(api_key)
        self._json(200, {"ok": True, "geminiConfigured": bool(api_key)})

    def _save_settings(self) -> None:
        data = self._read_json()
        clean = normalize_settings(data)
        old_model = _app_settings()["whisperModel"]
        saved = _get_project_store().save_settings(clean)
        if clean.get("whisperModel") and clean["whisperModel"] != old_model:
            _whisper_service.reset_model()
        self._json(200, {"ok": True, "settings": {**DEFAULT_SETTINGS, **saved}})

    def _installed_whisper_repos(self) -> set[str]:
        return _whisper_service.installed_repositories()

    def _whisper_models(self) -> list[dict[str, Any]]:
        return _whisper_service.list_models()

    def _download_whisper_model(self) -> None:
        data = self._read_json()
        model_id = str(data.get("modelId", ""))
        _whisper_service.download_model(model_id)
        self._json(200, {"ok": True, "models": self._whisper_models()})

    def _delete_whisper_model(self, model_id: str) -> None:
        _whisper_service.delete_model(model_id)
        self._json(200, {"ok": True, "models": self._whisper_models()})

    def _index_broll(self) -> None:
        data = self._read_json()
        image_data = str(data.get("imageDataUrl", ""))
        if not image_data or "," not in image_data:
            raise ValueError("Không có keyframe hợp lệ để Gemini phân tích.")
        encoded = image_data.split(",", 1)[1]
        image_bytes = base64.b64decode(encoded, validate=True)
        indexer = GeminiBrollIndexer(_gemini_service.api_key, str(_app_settings()["geminiModel"]))
        result = indexer.index_image_bytes(
            image_bytes,
            str(data.get("clipId", "BROLL")),
            str(data.get("filename", "broll.mp4")),
            float(data.get("durationSec", 0)),
            str(data.get("guidance", "")),
        )
        self._json(200, result)

    def _index_broll_scenes(self) -> None:
        _gemini_service.require_key()
        data = self._read_json()
        clip_id = str(data.get("clipId", "")).strip()
        fingerprint = str(data.get("fingerprint", "")).strip()
        raw_scenes = data.get("scenes") or []
        if not clip_id or not fingerprint:
            raise ValueError("Thiếu clipId hoặc fingerprint của B-Roll.")
        if not raw_scenes or len(raw_scenes) > 12:
            raise ValueError("Mỗi B-Roll phải có từ 1 đến 12 keyframe.")
        store = _get_project_store()
        cached = store.get_broll_index(clip_id)
        if cached and cached[0]["fingerprint"] == fingerprint:
            self._json(200, {"cached": True, "scenes": cached})
            return
        indexer = GeminiBrollIndexer(_gemini_service.api_key, str(_app_settings()["geminiModel"]))
        analyzed = []
        for index, scene in enumerate(raw_scenes, start=1):
            image_data = str(scene.get("imageDataUrl", ""))
            if "," not in image_data:
                raise ValueError(f"Keyframe {index} không hợp lệ.")
            image_bytes = base64.b64decode(image_data.split(",", 1)[1], validate=True)
            result = indexer.index_image_bytes(
                image_bytes, clip_id, str(data.get("clipName", clip_id)),
                float(scene.get("endSec", 0)) - float(scene.get("startSec", 0)), str(data.get("guidance", "")),
            )
            analyzed.append({
                "sceneId": f"{clip_id}:scene-{index}", "startSec": float(scene.get("startSec", 0)),
                "endSec": float(scene.get("endSec", 0)), "keyframeSec": float(scene.get("keyframeSec", 0)),
                "description": str(result.get("description", "")), "cameraAngle": result.get("camera_angle", ""),
                "subjects": result.get("subjects") or [], "techFeatures": result.get("tech_features") or [],
                "tags": result.get("tags") or [], "localEmbedding": local_embedding(scene_text(result)),
            })
        embeddings, embedding_model = _embed_texts([scene_text(scene) for scene in analyzed])
        for scene, embedding in zip(analyzed, embeddings):
            scene["embedding"] = embedding
            scene["embeddingModel"] = embedding_model
        saved = store.save_broll_index({
            "clipId": clip_id, "clipName": str(data.get("clipName", clip_id)), "fingerprint": fingerprint,
            "durationSec": float(data.get("durationSec", 0)), "aspectRatio": str(data.get("aspectRatio", "")),
        }, analyzed)
        self._json(200, saved)

    def _match_broll(self) -> None:
        data = self._read_json()
        transcripts = data.get("transcripts") or []
        if not transcripts:
            raise ValueError("Chưa có transcript để ghép B-Roll.")
        scenes = _get_project_store().get_broll_index()
        clip_ids = {str(value) for value in (data.get("clipIds") or [])}
        if clip_ids:
            scenes = [scene for scene in scenes if str(scene.get("clipId")) in clip_ids]
        if not scenes:
            raise ValueError("Chưa có scene B-Roll đã index.")
        guidance = str(data.get("guidance", "")).strip()
        texts = [" ".join(part for part in (str(item.get("text", "")), guidance) if part) for item in transcripts]
        query_embeddings, query_model = _embed_texts(texts)
        scene_models = {str(scene.get("embeddingModel", "local-hash-v1")) for scene in scenes}
        if len(scene_models) != 1 or query_model not in scene_models:
            query_embeddings = [local_embedding(text) for text in texts]
            scenes = [{**scene, "embedding": scene.get("localEmbedding") or local_embedding(scene_text(scene))} for scene in scenes]
            query_model = "local-hash-v1"
        placements = create_placements(
            transcripts, scenes, query_embeddings,
            total_duration_sec=float(data.get("totalDurationSec", 0)),
            min_duration=float(data.get("minDuration", 3)), max_duration=float(data.get("maxDuration", 10)),
            coverage_ratio=float(data.get("coverageRatio", .7)), intro_hold_sec=float(data.get("introHoldSec", 3)),
            only_16_9=bool(data.get("only16_9", True)),
        )
        self._json(200, {"placements": placements, "embeddingModel": query_model, "sceneCount": len(scenes)})

    def _search_broll(self) -> None:
        data = self._read_json()
        query = str(data.get("query", "")).strip()
        if not query:
            self._json(200, {"results": []})
            return
        scenes = _get_project_store().get_broll_index()
        clip_ids = {str(value) for value in (data.get("clipIds") or [])}
        if clip_ids:
            scenes = [scene for scene in scenes if str(scene.get("clipId")) in clip_ids]
        embeddings, model = _embed_texts([query])
        scene_models = {str(scene.get("embeddingModel", "local-hash-v1")) for scene in scenes}
        query_embedding = embeddings[0] if embeddings else []
        if len(scene_models) != 1 or model not in scene_models:
            query_embedding = local_embedding(query)
            scenes = [{**scene, "embedding": scene.get("localEmbedding") or local_embedding(scene_text(scene))} for scene in scenes]
            model = "local-hash-v1"
        self._json(200, {"results": search_scenes(query, scenes, query_embedding, int(data.get("limit", 30))), "embeddingModel": model})

    def _multipart_to_temp(self) -> tuple[str, str, str]:
        content_type = self.headers.get("Content-Type", "")
        if "multipart/form-data" not in content_type:
            raise ValueError("Yêu cầu upload multipart/form-data.")
        content_length = int(self.headers.get("Content-Length", "0"))
        if content_length <= 0:
            raise ValueError("Request upload không có dữ liệu.")
        if content_length > MAX_UPLOAD_BYTES:
            raise ValueError(f"File vượt quá giới hạn {MAX_UPLOAD_BYTES // (1024 * 1024)} MB.")
        if cgi is None:
            raise RuntimeError("Thiếu thư viện 'legacy-cgi'. Vui lòng chạy: pip install legacy-cgi")
        form = cgi.FieldStorage(
            fp=self.rfile,
            headers=self.headers,
            environ={
                "REQUEST_METHOD": "POST",
                "CONTENT_TYPE": content_type,
                "CONTENT_LENGTH": str(content_length),
            },
            keep_blank_values=True,
        )
        file_item = form["file"] if "file" in form else None
        if file_item is None or getattr(file_item, "file", None) is None:
            raise ValueError("Không nhận được file video/audio.")
        filename = Path(getattr(file_item, "filename", "") or "upload.mp4").name
        language = str(form.getfirst("language", "vi")).strip()
        suffix = Path(filename).suffix or ".mp4"
        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as handle:
            shutil.copyfileobj(file_item.file, handle, length=1024 * 1024)
            temp_path = handle.name
        if Path(temp_path).stat().st_size == 0:
            Path(temp_path).unlink(missing_ok=True)
            raise ValueError("File upload rỗng.")
        return temp_path, filename, language

    def _transcribe(self) -> None:
        temp_path = ""
        audio_path = ""
        try:
            temp_path, filename, language = self._multipart_to_temp()
            audio_path = _prepare_whisper_audio(temp_path)
            model = _get_whisper_model()
            segments, info = model.transcribe(audio_path, language=language or None, vad_filter=True)
            result = []
            try:
                for index, segment in enumerate(segments, start=1):
                    result.append({
                        "id": f"ts-{index}",
                        "startSec": round(segment.start, 2),
                        "endSec": round(segment.end, 2),
                        "startTime": _timecode(segment.start),
                        "endTime": _timecode(segment.end),
                        "speaker": "Người nói",
                        "text": segment.text.strip(),
                    })
            except IndexError as exc:
                raise ValueError("Video không có track âm thanh để Whisper chép lời.") from exc
            self._json(200, {"transcripts": result, "language": info.language})
        finally:
            if audio_path and audio_path != temp_path:
                Path(audio_path).unlink(missing_ok=True)
            if temp_path:
                Path(temp_path).unlink(missing_ok=True)

    def _stream_event(self, payload: dict[str, Any]) -> None:
        line = (json.dumps(payload, ensure_ascii=False) + "\n").encode("utf-8")
        self.wfile.write(line)
        self.wfile.flush()

    def _transcribe_stream(self) -> None:
        temp_path = ""
        audio_path = ""
        try:
            temp_path, filename, language = self._multipart_to_temp()
            audio_path = _prepare_whisper_audio(temp_path)
            model = _get_whisper_model()
            segments, info = model.transcribe(audio_path, language=language or None, vad_filter=True)
            self.send_response(200)
            self._cors()
            self.send_header("Content-Type", "application/x-ndjson; charset=utf-8")
            self.send_header("Cache-Control", "no-cache")
            self.send_header("X-Content-Type-Options", "nosniff")
            self.end_headers()
            count = 0
            try:
                for count, segment in enumerate(segments, start=1):
                    item = {
                        "id": f"ts-{count}",
                        "startSec": round(segment.start, 2),
                        "endSec": round(segment.end, 2),
                        "startTime": _timecode(segment.start),
                        "endTime": _timecode(segment.end),
                        "speaker": "Người nói",
                        "text": segment.text.strip(),
                    }
                    self._stream_event({"type": "segment", "segment": item, "count": count})
                self._stream_event({"type": "done", "count": count, "language": info.language})
            except IndexError:
                self._stream_event({"type": "error", "error": "Video không có track âm thanh để Whisper chép lời."})
            except Exception as exc:
                self._stream_event({"type": "error", "error": f"Whisper gặp lỗi: {exc}"})
        except (BrokenPipeError, ConnectionResetError):
            pass
        finally:
            if audio_path and audio_path != temp_path:
                Path(audio_path).unlink(missing_ok=True)
            if temp_path:
                Path(temp_path).unlink(missing_ok=True)

    def _segment(self) -> None:
        self._json(200, _content_service.segment(self._read_json()))

    def _summarize(self) -> None:
        self._json(200, _content_service.summarize(self._read_json()))

    def _metadata(self) -> None:
        self._json(200, _content_service.metadata(self._read_json()))

    def _ad_compliance(self) -> None:
        self._json(200, _content_service.ad_compliance(self._read_json()))

    def log_message(self, fmt: str, *args: Any) -> None:
        print(f"[CreatorUtils API] {self.address_string()} - {fmt % args}")


class CreatorUtilsHTTPServer(ThreadingHTTPServer):
    """HTTP server cục bộ; worker không giữ tiến trình khi ứng dụng thoát."""

    daemon_threads = True
    allow_reuse_address = True


def create_server(host: str = HOST, port: int = PORT) -> CreatorUtilsHTTPServer:
    """Factory tách biệt để integration test có thể bind vào cổng ngẫu nhiên."""
    return CreatorUtilsHTTPServer((host, port), ApiHandler)


def main() -> None:
    server = create_server()
    print(f"CreatorUtils AI engine đang chạy tại http://{HOST}:{PORT}", flush=True)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()


if __name__ == "__main__":
    main()
