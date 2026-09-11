"""Whisper model lifecycle, Hugging Face cache và chuẩn hóa audio."""

from __future__ import annotations

import os
import shutil
import subprocess
import tempfile
import threading
from pathlib import Path
from typing import Any, Callable

from engine.config import WHISPER_MODELS


class WhisperService:
    def __init__(self, get_settings: Callable[[], dict[str, Any]]):
        self._get_settings = get_settings
        self._model = None
        self._model_config: tuple[str, str, str] | None = None
        self._lock = threading.Lock()

    def model_config(self) -> tuple[str, str, str]:
        settings = self._get_settings()
        return (
            os.environ.get("WHISPER_MODEL", str(settings["whisperModel"])),
            os.environ.get("WHISPER_DEVICE", "cpu"),
            os.environ.get("WHISPER_COMPUTE_TYPE", "int8"),
        )

    def get_model(self):
        from faster_whisper import WhisperModel

        config = self.model_config()
        with self._lock:
            if self._model is None or self._model_config != config:
                self._model = WhisperModel(config[0], device=config[1], compute_type=config[2])
                self._model_config = config
        return self._model

    def reset_model(self) -> None:
        with self._lock:
            self._model = None
            self._model_config = None

    @staticmethod
    def ffmpeg_path() -> str | None:
        configured = os.environ.get("CREATORUTILS_FFMPEG_PATH", "").strip()
        if configured and Path(configured).is_file():
            return configured
        return shutil.which("ffmpeg")

    def ffmpeg_ready(self) -> bool:
        return self.ffmpeg_path() is not None

    def prepare_audio(self, source_path: str) -> str:
        settings = self._get_settings()
        normalize = bool(settings.get("normalizeAudio", True))
        gain_db = int(settings.get("manualGainDb", 0) or 0)
        if not normalize and gain_db == 0:
            return source_path
        ffmpeg = self.ffmpeg_path()
        if not ffmpeg:
            raise ValueError("Cần FFmpeg để chuẩn hóa âm thanh. Hãy cài FFmpeg hoặc tắt tùy chọn này trong Cài đặt.")
        filters = []
        if normalize:
            filters.append("loudnorm=I=-16:TP=-1.5:LRA=11")
        if gain_db:
            filters.append(f"volume={gain_db}dB")
        with tempfile.NamedTemporaryFile(delete=False, suffix=".wav") as handle:
            output_path = handle.name
        process = subprocess.run(
            [ffmpeg, "-y", "-i", source_path, "-vn", "-ac", "1", "-ar", "16000", "-af", ",".join(filters), output_path],
            stdout=subprocess.DEVNULL,
            stderr=subprocess.PIPE,
            text=True,
            check=False,
        )
        if process.returncode != 0:
            Path(output_path).unlink(missing_ok=True)
            detail = (process.stderr or "").strip().splitlines()
            suffix = f" Chi tiết: {detail[-1]}" if detail else ""
            raise ValueError(f"Không thể chuẩn hóa track âm thanh bằng FFmpeg.{suffix}")
        return output_path

    @staticmethod
    def installed_repositories() -> set[str]:
        try:
            from huggingface_hub import scan_cache_dir

            return {repo.repo_id for repo in scan_cache_dir().repos}
        except ImportError as exc:
            raise RuntimeError("Thiếu dependency 'huggingface-hub'. Hãy chạy: python -m pip install -r requirements.txt") from exc
        except Exception:
            # Cache chưa tồn tại hoặc bị hỏng không được làm trang settings sập.
            return set()

    def list_models(self) -> list[dict[str, Any]]:
        installed = self.installed_repositories()
        active = str(self._get_settings()["whisperModel"])
        return [
            {
                "id": model_id,
                "name": spec[0],
                "repo": spec[1],
                "size": spec[2],
                "installed": spec[1] in installed,
                "active": model_id == active,
            }
            for model_id, spec in WHISPER_MODELS.items()
        ]

    def download_model(self, model_id: str) -> None:
        if model_id not in WHISPER_MODELS:
            raise ValueError("Mô hình Whisper không được hỗ trợ.")
        try:
            from huggingface_hub import snapshot_download
        except ImportError as exc:
            raise RuntimeError("Thiếu dependency 'huggingface-hub'. Hãy chạy: python -m pip install -r requirements.txt") from exc
        snapshot_download(repo_id=WHISPER_MODELS[model_id][1])

    def delete_model(self, model_id: str) -> None:
        if model_id not in WHISPER_MODELS:
            raise ValueError("Mô hình Whisper không được hỗ trợ.")
        if str(self._get_settings()["whisperModel"]) == model_id:
            raise ValueError("Không thể xóa model đang được chọn. Hãy chọn model khác trước.")
        repo_id = WHISPER_MODELS[model_id][1]
        try:
            from huggingface_hub import scan_cache_dir

            cache = scan_cache_dir()
            repo = next((item for item in cache.repos if item.repo_id == repo_id), None)
            if repo:
                revisions = [revision.commit_hash for revision in repo.revisions]
                if revisions:
                    cache.delete_revisions(*revisions).execute()
        except ImportError as exc:
            raise RuntimeError("Thiếu dependency 'huggingface-hub'. Hãy chạy: python -m pip install -r requirements.txt") from exc
        except Exception as exc:
            raise ValueError(f"Không thể xóa model khỏi bộ nhớ đệm: {exc}") from exc
        if self._model_config and self._model_config[0] == model_id:
            self.reset_model()
