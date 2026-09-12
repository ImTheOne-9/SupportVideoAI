import unittest
from engine.mp4_exporter import MP4Exporter

class TestMP4Exporter(unittest.TestCase):
    def test_generate_bat_script_no_broll(self):
        exporter = MP4Exporter("Test_Project", 1920, 1080)
        script = exporter.generate_bat_script("aroll.mp4", 10.0, [], [])
        self.assertIn('ffmpeg -y -i "aroll.mp4"', script)
        self.assertIn('[0:v]scale=1920:1080:force_original_aspect_ratio=decrease', script)
        self.assertIn('Test_Project_export.mp4', script)

    def test_generate_bat_script_with_broll(self):
        exporter = MP4Exporter("Test_Project", 1920, 1080)
        placements = [
            {
                "clipId": "b1",
                "clipName": "broll1.mp4",
                "startSec": 2.0,
                "endSec": 5.0,
                "sourceInSec": 0.0,
                "durationSec": 3.0
            }
        ]
        script = exporter.generate_bat_script("aroll.mp4", 10.0, placements, [])
        self.assertIn('-i "aroll.mp4"', script)
        self.assertIn('-ss 2.0 -t 3.0 -i "aroll.mp4"', script)
        self.assertIn('-ss 0.0 -t 3.0 -i "broll1.mp4"', script)
        self.assertIn('[a_base_0][b_pip_0]overlay=', script)
        self.assertIn('concat=n=3:v=1:a=0[outv]', script)
        self.assertIn('-map "[outv]"', script)
        self.assertIn('-map 0:a', script)

if __name__ == '__main__':
    unittest.main()
