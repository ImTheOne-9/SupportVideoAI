"""Cấu hình tập trung cho CreatorUtils AI engine.

Module này không khởi tạo tài nguyên nặng. Mọi giá trị môi trường được đọc một
lần khi tiến trình khởi động, giúp API, service và test dùng chung một contract.
"""

from __future__ import annotations

import os
from dataclasses import dataclass
from typing import Any


DEFAULT_SETTINGS: dict[str, Any] = {
    "language": "vi",
    "normalizeAudio": True,
    "manualGainDb": 0,
    "requestTimeoutSec": 300,
    "whisperModel": "small",
    "geminiModel": "gemini-3.6-flash",
    "maxOutputTokens": 8192,
    "batchDurationSec": 600,
}

WHISPER_MODELS: dict[str, tuple[str, str, str]] = {
    "tiny": ("Tiny", "Systran/faster-whisper-tiny", "75 MB"),
    "base": ("Base", "Systran/faster-whisper-base", "145 MB"),
    "small": ("Small", "Systran/faster-whisper-small", "490 MB"),
    "medium": ("Medium", "Systran/faster-whisper-medium", "1.5 GB"),
    "large-v3": ("Large v3", "Systran/faster-whisper-large-v3", "3.1 GB"),
}


@dataclass(frozen=True)
class ServerConfig:
    host: str = "127.0.0.1"
    port: int = 8765
    max_upload_bytes: int = 4096 * 1024 * 1024

    @classmethod
    def from_environment(cls) -> "ServerConfig":
        max_upload_mb = max(1, int(os.environ.get("CREATORUTILS_MAX_UPLOAD_MB", "4096")))
        port = int(os.environ.get("CREATORUTILS_API_PORT", "8765"))
        if not 1 <= port <= 65535:
            raise ValueError("CREATORUTILS_API_PORT phải nằm trong khoảng 1-65535.")
        return cls(
            host=os.environ.get("CREATORUTILS_API_HOST", "127.0.0.1"),
            port=port,
            max_upload_bytes=max_upload_mb * 1024 * 1024,
        )


def normalize_settings(values: dict[str, Any]) -> dict[str, Any]:
    """Lọc và chuẩn hóa patch settings nhận từ HTTP API."""
    allowed = set(DEFAULT_SETTINGS)
    clean = {key: value for key, value in values.items() if key in allowed}
    if "whisperModel" in clean and clean["whisperModel"] not in WHISPER_MODELS:
        raise ValueError("Mô hình Whisper không được hỗ trợ.")
    if "language" in clean and clean["language"] not in {"vi", "en", "auto"}:
        raise ValueError("Ngôn ngữ không được hỗ trợ.")
    if "requestTimeoutSec" in clean:
        clean["requestTimeoutSec"] = max(30, min(1800, int(clean["requestTimeoutSec"])))
    if "manualGainDb" in clean:
        clean["manualGainDb"] = max(-12, min(24, int(clean["manualGainDb"])))
    if "maxOutputTokens" in clean:
        clean["maxOutputTokens"] = max(1024, min(65536, int(clean["maxOutputTokens"])))
    if "batchDurationSec" in clean:
        clean["batchDurationSec"] = max(60, min(3600, int(clean["batchDurationSec"])))
    if "normalizeAudio" in clean:
        clean["normalizeAudio"] = bool(clean["normalizeAudio"])
    return clean
