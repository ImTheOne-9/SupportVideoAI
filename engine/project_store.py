"""SQLite persistence cho dự án CreatorUtils trên máy người dùng."""

from __future__ import annotations

import json
import os
import sqlite3
import sys
import uuid
from contextlib import contextmanager
from datetime import datetime, timezone
from pathlib import Path
from typing import Any, Optional


def default_data_dir() -> Path:
    override = os.environ.get("CREATORUTILS_DATA_DIR")
    if override:
        return Path(override).expanduser().resolve()
    if sys.platform == "win32":
        root = Path(os.environ.get("LOCALAPPDATA", Path.home() / "AppData" / "Local"))
        return root / "CreatorUtils"
    if sys.platform == "darwin":
        return Path.home() / "Library" / "Application Support" / "CreatorUtils"
    return Path(os.environ.get("XDG_DATA_HOME", Path.home() / ".local" / "share")) / "CreatorUtils"


class ProjectStore:
    def __init__(self, db_path: Optional[Path] = None):
        self.db_path = Path(db_path) if db_path else default_data_dir() / "creatorutils.db"
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._initialize()

    def _connect(self) -> sqlite3.Connection:
        connection = sqlite3.connect(self.db_path, timeout=15)
        connection.row_factory = sqlite3.Row
        return connection

    @contextmanager
    def _session(self):
        connection = self._connect()
        try:
            yield connection
            connection.commit()
        except Exception:
            connection.rollback()
            raise
        finally:
            connection.close()

    def _initialize(self) -> None:
        with self._session() as connection:
            connection.execute("""
                CREATE TABLE IF NOT EXISTS projects (
                    id TEXT PRIMARY KEY,
                    name TEXT NOT NULL,
                    media_name TEXT,
                    duration_sec REAL NOT NULL DEFAULT 0,
                    transcript_count INTEGER NOT NULL DEFAULT 0,
                    payload_json TEXT NOT NULL,
                    created_at TEXT NOT NULL,
                    updated_at TEXT NOT NULL
                )
            """)
            connection.execute("""
                CREATE TABLE IF NOT EXISTS app_settings (
                    key TEXT PRIMARY KEY,
                    value_json TEXT NOT NULL
                )
            """)
            connection.execute("""
                CREATE TABLE IF NOT EXISTS broll_clips (
                    id TEXT PRIMARY KEY,
                    fingerprint TEXT NOT NULL,
                    name TEXT NOT NULL,
                    duration_sec REAL NOT NULL DEFAULT 0,
                    aspect_ratio TEXT,
                    updated_at TEXT NOT NULL
                )
            """)
            connection.execute("""
                CREATE TABLE IF NOT EXISTS broll_scenes (
                    id TEXT PRIMARY KEY,
                    clip_id TEXT NOT NULL,
                    start_sec REAL NOT NULL,
                    end_sec REAL NOT NULL,
                    keyframe_sec REAL NOT NULL,
                    description TEXT NOT NULL,
                    metadata_json TEXT NOT NULL,
                    embedding_json TEXT NOT NULL,
                    FOREIGN KEY(clip_id) REFERENCES broll_clips(id) ON DELETE CASCADE
                )
            """)
            connection.execute("CREATE INDEX IF NOT EXISTS idx_broll_scenes_clip ON broll_scenes(clip_id)")

    def get_settings(self) -> dict[str, Any]:
        with self._session() as connection:
            rows = connection.execute("SELECT key, value_json FROM app_settings").fetchall()
        result: dict[str, Any] = {}
        for row in rows:
            try:
                result[row["key"]] = json.loads(row["value_json"])
            except json.JSONDecodeError:
                continue
        return result

    def save_settings(self, settings: dict[str, Any]) -> dict[str, Any]:
        with self._session() as connection:
            for key, value in settings.items():
                connection.execute("""
                    INSERT INTO app_settings (key, value_json) VALUES (?, ?)
                    ON CONFLICT(key) DO UPDATE SET value_json=excluded.value_json
                """, (str(key), json.dumps(value, ensure_ascii=False)))
        return self.get_settings()

    def get_broll_index(self, clip_id: Optional[str] = None) -> list[dict[str, Any]]:
        query = """
            SELECT c.id clip_id, c.fingerprint, c.name, c.duration_sec, c.aspect_ratio,
                   s.id scene_id, s.start_sec, s.end_sec, s.keyframe_sec,
                   s.description, s.metadata_json, s.embedding_json
            FROM broll_clips c JOIN broll_scenes s ON s.clip_id = c.id
        """
        params: tuple[Any, ...] = ()
        if clip_id is not None:
            query += " WHERE c.id = ?"
            params = (clip_id,)
        query += " ORDER BY c.updated_at DESC, s.start_sec ASC"
        with self._session() as connection:
            rows = connection.execute(query, params).fetchall()
        return [{
            "clipId": row["clip_id"], "fingerprint": row["fingerprint"], "clipName": row["name"],
            "durationSec": row["duration_sec"], "aspectRatio": row["aspect_ratio"],
            "sceneId": row["scene_id"], "startSec": row["start_sec"], "endSec": row["end_sec"],
            "keyframeSec": row["keyframe_sec"], "description": row["description"],
            **json.loads(row["metadata_json"]), "embedding": json.loads(row["embedding_json"]),
        } for row in rows]

    def save_broll_index(self, clip: dict[str, Any], scenes: list[dict[str, Any]]) -> dict[str, Any]:
        clip_id = str(clip["clipId"])
        fingerprint = str(clip["fingerprint"])
        existing = self.get_broll_index(clip_id)
        if existing and existing[0]["fingerprint"] == fingerprint:
            return {"cached": True, "scenes": existing}
        now = datetime.now(timezone.utc).isoformat()
        with self._session() as connection:
            connection.execute("PRAGMA foreign_keys = ON")
            connection.execute("DELETE FROM broll_clips WHERE id = ?", (clip_id,))
            connection.execute("""
                INSERT INTO broll_clips (id, fingerprint, name, duration_sec, aspect_ratio, updated_at)
                VALUES (?, ?, ?, ?, ?, ?)
            """, (clip_id, fingerprint, str(clip.get("clipName", clip_id)), float(clip.get("durationSec", 0)), str(clip.get("aspectRatio", "")), now))
            for index, scene in enumerate(scenes, start=1):
                scene_id = str(scene.get("sceneId") or f"{clip_id}:scene-{index}")
                metadata = {key: value for key, value in scene.items() if key not in {"sceneId", "startSec", "endSec", "keyframeSec", "description", "embedding"}}
                connection.execute("""
                    INSERT INTO broll_scenes (id, clip_id, start_sec, end_sec, keyframe_sec, description, metadata_json, embedding_json)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                """, (scene_id, clip_id, float(scene.get("startSec", 0)), float(scene.get("endSec", 0)),
                      float(scene.get("keyframeSec", 0)), str(scene.get("description", "")),
                      json.dumps(metadata, ensure_ascii=False), json.dumps(scene.get("embedding") or [])))
        return {"cached": False, "scenes": self.get_broll_index(clip_id)}

    def delete_broll_index(self, clip_id: str) -> bool:
        with self._session() as connection:
            connection.execute("PRAGMA foreign_keys = ON")
            cursor = connection.execute("DELETE FROM broll_clips WHERE id = ?", (clip_id,))
        return cursor.rowcount > 0

    def save(self, payload: dict[str, Any]) -> dict[str, Any]:
        project_id = str(payload.get("id") or uuid.uuid4())
        name = str(payload.get("name") or "Dự án chưa đặt tên").strip()
        media_name = str(payload.get("mediaName") or "")
        duration_sec = float(payload.get("durationSec") or 0)
        transcript_count = len(payload.get("transcripts") or [])
        now = datetime.now(timezone.utc).isoformat()
        payload = {**payload, "id": project_id}
        encoded = json.dumps(payload, ensure_ascii=False)
        with self._session() as connection:
            existing = connection.execute("SELECT created_at FROM projects WHERE id = ?", (project_id,)).fetchone()
            created_at = existing["created_at"] if existing else now
            connection.execute("""
                INSERT INTO projects (id, name, media_name, duration_sec, transcript_count, payload_json, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ON CONFLICT(id) DO UPDATE SET
                    name=excluded.name, media_name=excluded.media_name,
                    duration_sec=excluded.duration_sec, transcript_count=excluded.transcript_count,
                    payload_json=excluded.payload_json, updated_at=excluded.updated_at
            """, (project_id, name, media_name, duration_sec, transcript_count, encoded, created_at, now))
        return {"id": project_id, "createdAt": created_at, "updatedAt": now}

    def list(self) -> list[dict[str, Any]]:
        with self._session() as connection:
            rows = connection.execute("""
                SELECT id, name, media_name, duration_sec, transcript_count, created_at, updated_at
                FROM projects ORDER BY updated_at DESC
            """).fetchall()
        return [{
            "id": row["id"], "name": row["name"], "mediaName": row["media_name"],
            "durationSec": row["duration_sec"], "transcriptCount": row["transcript_count"],
            "createdAt": row["created_at"], "updatedAt": row["updated_at"],
        } for row in rows]

    def get(self, project_id: str) -> Optional[dict[str, Any]]:
        with self._session() as connection:
            row = connection.execute("SELECT payload_json FROM projects WHERE id = ?", (project_id,)).fetchone()
        return json.loads(row["payload_json"]) if row else None

    def delete(self, project_id: str) -> bool:
        with self._session() as connection:
            cursor = connection.execute("DELETE FROM projects WHERE id = ?", (project_id,))
        return cursor.rowcount > 0
