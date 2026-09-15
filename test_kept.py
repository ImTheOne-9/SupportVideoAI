import sys
import os
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from engine.domain.edit_decision import kept_segments

def test():
    # A single cut from 2.0 to 4.0
    cuts = [
        {"startSec": 2.0, "endSec": 4.0, "status": "active"}
    ]
    duration_sec = 10.0
    segments = kept_segments(cuts, duration_sec)
    print("OUTPUT:", segments)

if __name__ == "__main__":
    test()
