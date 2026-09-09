"""
Unit Tests cho Pipeline Xử Lý Video Thật (Real Video Ingestion & Custom Matching)
"""

import unittest
import xml.etree.ElementTree as ET
from engine.broll_matcher import BrollMatcher
from engine.xml_exporter import TimelineXMLExporter

class TestRealVideoPipeline(unittest.TestCase):
    def test_aspect_ratio_classification(self):
        """Kiểm tra: Thuật toán nhận diện đúng tỷ lệ 16:9 và 9:16"""
        test_cases = [
            (3840, 2160, "16:9"),
            (1920, 1080, "16:9"),
            (1080, 1920, "9:16"),
            (720, 1280, "9:16")
        ]
        for w, h, expected in test_cases:
            ratio = w / h
            is_16_9 = abs(ratio - (16 / 9)) < 0.25
            is_9_16 = abs(ratio - (9 / 16)) < 0.25
            detected = "16:9" if is_16_9 else ("9:16" if is_9_16 else "other")
            self.assertEqual(detected, expected, f"Lỗi nhận diện kích thước {w}x{h}")

    def test_custom_video_duration_bounds(self):
        """Kiểm tra: Khi nạp video thật ngắn (ví dụ 45.0s), B-roll không được vượt quá 45.0s"""
        matcher = BrollMatcher({
            "intro_hold_sec": 3.0,
            "min_duration": 3.0,
            "max_duration": 8.0,
            "coverage_ratio": 0.60,
            "only_16_9": True
        })

        custom_aroll = [
            {"start_sec": 0.0, "end_sec": 5.0, "text": "Đoạn mở đầu chào mừng"},
            {"start_sec": 5.5, "end_sec": 20.0, "text": "Đánh giá chi tiết thiết kế sản phẩm"},
            {"start_sec": 21.0, "end_sec": 45.0, "text": "Tổng kết và đánh giá hiệu năng thực tế"}
        ]

        custom_brolls = [
            {
                "clip_id": "Custom_B1",
                "description": "Cận cảnh chi tiết thiết kế sản phẩm",
                "subjects": ["thiết kế", "sản phẩm"],
                "tech_features": [],
                "tags": ["thiết kế"],
                "aspect_ratio": "16:9",
                "duration_sec": 10.0
            },
            {
                "clip_id": "Custom_B2",
                "description": "Cảnh quay đánh giá hiệu năng thực tế",
                "subjects": ["hiệu năng"],
                "tech_features": [],
                "tags": ["hiệu năng"],
                "aspect_ratio": "16:9",
                "duration_sec": 12.0
            }
        ]

        placements = matcher.match(custom_aroll, custom_brolls)
        self.assertGreater(len(placements), 0)

        for p in placements:
            self.assertGreaterEqual(p["start_sec"], 3.0, "Không được chèn trước intro 3s")
            self.assertLessEqual(p["end_sec"], 45.0, "Không được vượt quá độ dài video 45s")

    def test_xml_export_with_custom_filenames(self):
        """Kiểm tra: File XML xuất ra phải chứa đúng tên file thật của người dùng"""
        exporter = TimelineXMLExporter(project_name="Du_An_Review_Cua_Ban", fps=30.0)
        custom_aroll_name = "My_Custom_Review_4K.mov"
        custom_placements = [
            {
                "clip_id": "B001_Closeup",
                "start_sec": 5.0,
                "end_sec": 11.0,
                "duration_sec": 6.0
            }
        ]

        # 1. Test FCPXML
        fcpxml_str = exporter.export_fcpxml(custom_aroll_name, 45.0, custom_placements)
        self.assertIn(custom_aroll_name, fcpxml_str)
        self.assertIn("B001_Closeup", fcpxml_str)
        
        root_fcpxml = ET.fromstring(fcpxml_str)
        aroll_asset = root_fcpxml.find(".//asset[@id='r_aroll']")
        self.assertEqual(aroll_asset.attrib["name"], custom_aroll_name)

        # 2. Test Premiere XML
        prem_xml_str = exporter.export_premiere_xml(custom_aroll_name, 45.0, custom_placements)
        self.assertIn(custom_aroll_name, prem_xml_str)
        self.assertIn("B001_Closeup.mov", prem_xml_str)
        
        root_prem = ET.fromstring(prem_xml_str)
        clipitem = root_prem.find(".//clipitem[@id='clipitem-aroll-1']")
        self.assertEqual(clipitem.find("name").text, custom_aroll_name)

if __name__ == "__main__":
    unittest.main()
