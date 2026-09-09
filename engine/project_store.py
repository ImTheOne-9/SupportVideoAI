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
