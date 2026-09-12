"""
Unit Tests cho Thuật Toán So Khớp B-Roll (BrollMatcher)
"""

import unittest
from engine.broll_matcher import BrollMatcher

class TestBrollMatcher(unittest.TestCase):
    def setUp(self):
        self.matcher = BrollMatcher({
            "intro_hold_sec": 3.0,
            "min_duration": 3.0,
            "max_duration": 10.0,
            "coverage_ratio": 0.70,
            "only_16_9": True
        })

        self.mock_aroll = [
            {"start_sec": 0.0, "end_sec": 3.0, "text": "Xin chào các bạn đã quay trở lại với kênh công nghệ"},
            {"start_sec": 3.5, "end_sec": 12.0, "text": "Hôm nay mình trên tay robot Deebot T80 Max Omni với trạm sạc tự giặt sấy"},
            {"start_sec": 13.0, "end_sec": 22.0, "text": "Dưới đáy máy là cụm con lăn lau nhà và chổi quét chống rối rất thông minh"},
            {"start_sec": 23.0, "end_sec": 35.0, "text": "Robot tự di chuyển trên nền sàn gỗ và điều hướng hút bụi cực êm"}
        ]

        self.mock_brolls = [
            {
                "clip_id": "C4139",
                "description": "Góc máy lia đặc toàn cảnh trạm sạc và robot Deebot T80 Max Omni",
                "subjects": ["trạm sạc", "robot"],
                "tech_features": ["trạm sạc tự giặt sấy"],
                "tags": ["trạm sạc", "omni"],
                "aspect_ratio": "16:9",
                "duration_sec": 15.0
            },
            {
                "clip_id": "C4184",
                "description": "Cận cảnh con lăn lau nhà và cụm chổi quét dưới gầm máy",
                "subjects": ["con lăn", "chổi quét"],
                "tech_features": ["chống rối", "lau nhà"],
                "tags": ["con lăn", "chổi"],
                "aspect_ratio": "16:9",
                "duration_sec": 12.0
            },
            {
                "clip_id": "C9999_VERTICAL",
                "description": "Video Shorts dọc 9:16 quay cận cảnh nút bấm",
                "subjects": ["nút bấm"],
                "tech_features": [],
                "tags": ["shorts"],
                "aspect_ratio": "9:16",
                "duration_sec": 10.0
            }
        ]

    def test_intro_hold_preservation(self):
        """Kiểm tra: Không được chèn B-roll vào khoảng intro giữ mặt người nói (0s -> 3s)"""
        placements = self.matcher.match(self.mock_aroll, self.mock_brolls)
        self.assertGreater(len(placements), 0)
        for p in placements:
            self.assertGreaterEqual(p["start_sec"], 3.0, "B-roll không được chèn trước 3.0s")

    def test_filter_aspect_ratio(self):
        """Kiểm tra: Bỏ qua video dọc 9:16 khi bật tùy chọn chỉ dùng 16:9"""
        placements = self.matcher.match(self.mock_aroll, self.mock_brolls)
        used_ids = [p["clip_id"] for p in placements]
        self.assertNotIn("C9999_VERTICAL", used_ids, "Không được chứa clip 9:16 khi bật chỉ dùng 16:9")

    def test_clip_duration_bounds(self):
        """Kiểm tra: Thời lượng B-roll phải nằm trong khoảng min_duration và max_duration"""
        placements = self.matcher.match(self.mock_aroll, self.mock_brolls)
        for p in placements:
            dur = p["duration_sec"]
            self.assertGreaterEqual(dur, 3.0, "Thời lượng phải >= min_duration")
            self.assertLessEqual(dur, 10.0, "Thời lượng phải <= max_duration")

    def test_semantic_relevance(self):
        """Kiểm tra: Đoạn nói về trạm sạc phải khớp với C4139, con lăn khớp với C4184"""
        placements = self.matcher.match(self.mock_aroll, self.mock_brolls)
        first_placement = placements[0]
        self.assertEqual(first_placement["clip_id"], "C4139")
        self.assertGreaterEqual(first_placement["match_percentage"], 80)

if __name__ == "__main__":
    unittest.main()
