import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine.mp4_exporter import MP4Exporter

def test():
    cuts = [
        {"startSec": 2.0, "endSec": 4.0, "status": "active"},
        {"startSec": 7.0, "endSec": 8.0, "status": "active"}
    ]
    exporter = MP4Exporter("Test", 1280, 720)
    cmd = exporter.build_ffmpeg_command("C:\\Users\\1709\\.gemini\\antigravity-ide\\brain\\869f994c-ac56-492c-be2c-c4b0eb1e9dd3\\dummy.mp4", 10.0, [], cuts, output_file="C:\\Users\\1709\\.gemini\\antigravity-ide\\brain\\869f994c-ac56-492c-be2c-c4b0eb1e9dd3\\dummy_out.mp4")
    print(" ".join(cmd))

if __name__ == "__main__":
    test()
