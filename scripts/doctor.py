"""Kiểm tra môi trường cục bộ mà không tải model hoặc gọi dịch vụ ngoài."""

from __future__ import annotations

import importlib.util
import shutil
import socket
import sys
from pathlib import Path


def module_ready(name: str) -> bool:
    try:
        return importlib.util.find_spec(name) is not None
    except (ImportError, ModuleNotFoundError, AttributeError):
        return False


def port_in_use(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as connection:
        connection.settimeout(0.25)
        return connection.connect_ex(("127.0.0.1", port)) == 0


def main() -> int:
    bundled_ffmpeg = Path("node_modules/ffmpeg-static/ffmpeg.exe")
    checks = {
        "Python 3.11-3.13": (3, 11) <= sys.version_info[:2] < (3, 14),
        "faster-whisper": module_ready("faster_whisper"),
        "huggingface-hub": module_ready("huggingface_hub"),
        "google-genai": module_ready("google.genai"),
        "numpy": module_ready("numpy"),
        "scikit-learn": module_ready("sklearn"),
        "legacy-cgi (Python 3.13)": sys.version_info < (3, 13) or module_ready("cgi"),
        "FFmpeg": shutil.which("ffmpeg") is not None or bundled_ffmpeg.is_file(),
        "node_modules": Path("node_modules").is_dir(),
    }
    print("CreatorUtils environment doctor")
    print(f"Python: {sys.executable} ({sys.version.split()[0]})")
    for label, ready in checks.items():
        print(f"[{'OK' if ready else 'MISSING'}] {label}")
    print(f"[INFO] Port 5173: {'in use' if port_in_use(5173) else 'available'}")
    print(f"[INFO] Port 8765: {'in use' if port_in_use(8765) else 'available'}")
    missing = [label for label, ready in checks.items() if not ready]
    if missing:
        print("\nFix: python -m pip install -r requirements.txt && npm install")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
