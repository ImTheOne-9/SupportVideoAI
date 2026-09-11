"""Chính sách origin cho API chạy trên máy người dùng."""

from __future__ import annotations

import os
from urllib.parse import urlparse


def allowed_origins() -> set[str]:
    defaults = {
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://127.0.0.1:4173",
    }
    configured = {
        item.strip().rstrip("/")
        for item in os.environ.get("CREATORUTILS_ALLOWED_ORIGINS", "").split(",")
        if item.strip()
    }
    return defaults | configured


def is_allowed_origin(origin: str) -> bool:
    if not origin:
        return False
    parsed = urlparse(origin)
    if parsed.scheme not in {"http", "https"} or not parsed.hostname or parsed.port is None:
        return False
    normalized = f"{parsed.scheme}://{parsed.hostname}:{parsed.port}"
    return normalized in allowed_origins()
