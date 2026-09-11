"""
Unit Tests cho Bộ Xuất XML Timeline (Final Cut Pro FCPXML & Premiere Pro XML)
"""

import unittest
import xml.etree.ElementTree as ET
from engine.xml_exporter import TimelineXMLExporter

class TestXMLExporter(unittest.TestCase):
    def setUp(self):
        self.exporter = TimelineXMLExporter(project_name="Deebot T80 Max Omni Test", fps=30.0)
        self.aroll_file = "C4095.mov"
        self.total_duration_sec = 60.0
        self.mock_placements = [
            {
                "clip_id": "C4139",
                "start_sec": 7.0,
                "end_sec": 10.0,
                "duration_sec": 3.0
            },
            {
                "clip_id": "C4184",
                "start_sec": 37.0,
                "end_sec": 42.0,
                "duration_sec": 5.0
            }
        ]

    def test_fcpxml_validity(self):
        """Kiểm tra: FCPXML sinh ra phải là XML hợp lệ và có cấu trúc Final Cut Pro chuẩn"""
        xml_str = self.exporter.export_fcpxml(self.aroll_file, self.total_duration_sec, self.mock_placements)
        self.assertIn("<fcpxml", xml_str)
        self.assertIn("r_broll_C4139", xml_str)
        
        # Parse XML bằng ElementTree
        root = ET.fromstring(xml_str)
        self.assertEqual(root.tag, "fcpxml")
        self.assertEqual(root.attrib["version"], "1.9")
        
        # Kiểm tra tài nguyên và asset
        resources = root.find("resources")
        self.assertIsNotNone(resources)
        assets = resources.findall("asset")
        self.assertEqual(len(assets), 3) # 1 A-roll + 2 B-rolls

    def test_premiere_xml_validity(self):
        """Kiểm tra: Premiere XML sinh ra phải đúng chuẩn xmeml version 4"""
        xml_str = self.exporter.export_premiere_xml(self.aroll_file, self.total_duration_sec, self.mock_placements)
        self.assertIn("<xmeml", xml_str)
        
        root = ET.fromstring(xml_str)
        self.assertEqual(root.tag, "xmeml")
        self.assertEqual(root.attrib["version"], "4")
        
        # Kiểm tra các track video
        sequence = root.find(".//sequence")
        self.assertIsNotNone(sequence)
        tracks = sequence.findall(".//video/track")
        self.assertEqual(len(tracks), 2) # Track 1 (A-roll) và Track 2 (B-roll)

    def test_fcpxml_deduplicates_assets_and_preserves_real_name(self):
        placements = [
            {"clip_id": "B001", "clip_name": "camera & dock.mp4", "start_sec": 3, "end_sec": 6, "duration_sec": 3},
            {"clip_id": "B001", "clip_name": "camera & dock.mp4", "start_sec": 8, "end_sec": 11, "duration_sec": 3},
        ]
        xml_str = self.exporter.export_fcpxml("main & voice.mp4", 20, placements)
        root = ET.fromstring(xml_str)
        assets = root.findall("./resources/asset[@id='r_broll_B001']")
        clips = root.findall(".//asset-clip[@ref='r_broll_B001']")
        self.assertEqual(len(assets), 1)
        self.assertEqual(len(clips), 2)
        self.assertEqual(assets[0].attrib["name"], "camera & dock.mp4")

    def test_export_applies_aroll_cuts_and_broll_source_range(self):
        placement = {
            "clip_id": "B001", "clip_name": "detail.mov",
            "start_sec": 10, "end_sec": 13, "duration_sec": 3,
            "source_in_sec": 4, "source_out_sec": 7, "source_duration_sec": 20,
        }
        cuts = [{"startSec": 5, "endSec": 8}]
        fcpxml = ET.fromstring(self.exporter.export_fcpxml("main.mov", 15, [placement], cuts))
        sequence = fcpxml.find(".//sequence")
        self.assertEqual(sequence.attrib["duration"], "360/30s")
        broll = fcpxml.find(".//asset-clip[@ref='r_broll_B001']")
        self.assertEqual(broll.attrib["offset"], "210/30s")
        self.assertEqual(broll.attrib["start"], "120/30s")

        premiere = ET.fromstring(self.exporter.export_premiere_xml("main.mov", 15, [placement], cuts))
        clip = premiere.find(".//clipitem[@id='clipitem-broll-1']")
        self.assertEqual(clip.find("start").text, "210")
        self.assertEqual(clip.find("in").text, "120")
        self.assertEqual(clip.find("out").text, "210")

    def test_ntsc_frame_duration_is_rational(self):
        exporter = TimelineXMLExporter(fps=29.97)
        root = ET.fromstring(exporter.export_fcpxml("main.mov", 1, []))
        self.assertEqual(root.find(".//format").attrib["frameDuration"], "1001/30000s")

if __name__ == "__main__":
    unittest.main()
