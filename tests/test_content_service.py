import json
import unittest
from types import SimpleNamespace

from engine.services.content_service import ContentService


class FakeGemini:
    def __init__(self, responses):
        self.responses = iter(responses)
        self.prompts = []
        self.models = []
        self.required = 0

    def require_key(self):
        self.required += 1

    def generate(self, prompt, model=None):
        self.prompts.append(prompt)
        self.models.append(model)
        return SimpleNamespace(text=next(self.responses))


class TestContentService(unittest.TestCase):
    def service(self, *responses):
        gemini = FakeGemini(responses)
        return ContentService(gemini, lambda: {"geminiModel": "test-model"}), gemini

    def test_segment_normalizes_chapter_contract(self):
        service, gemini = self.service(json.dumps([{
            "title": "Mở đầu", "startSec": 0, "endSec": 4.5,
            "summary": "Giới thiệu", "tags": ["intro"],
        }]))
        result = service.segment({"transcripts": [{"startSec": 0, "endSec": 5, "text": "Xin chào"}]})
        self.assertEqual(result["chapters"][0]["durationSec"], 4.5)
        self.assertEqual(result["chapters"][0]["startTime"], "00:00")
        self.assertEqual(gemini.required, 1)

    def test_summary_rejects_unknown_options_before_generation(self):
        service, gemini = self.service("unused")
        with self.assertRaisesRegex(ValueError, "Kiểu tóm tắt"):
            service.summarize({"transcripts": [{"text": "Nội dung"}], "type": "invalid"})
        self.assertEqual(gemini.prompts, [])

    def test_metadata_normalizes_hashtags(self):
        service, _ = self.service(json.dumps({
            "title": "Tiêu đề",
            "description": "Mô tả",
            "hashtags": ["AI video", "#Creator"],
        }))
        result = service.metadata({"transcripts": [{"text": "Nội dung video"}]})
        self.assertEqual(result["hashtags"], ["#AIvideo", "#Creator"])
        self.assertEqual(result["model"], "test-model")

    def test_ad_report_has_all_required_checks(self):
        service, _ = self.service(json.dumps({
            "summary": "Cần xem lại",
            "checks": [{"id": "claims", "status": "warning", "explanation": "Có cam kết"}],
            "recommendations": ["Bổ sung nguồn"],
        }))
        result = service.ad_compliance({"transcripts": [{"startSec": 3, "text": "Hiệu quả tuyệt đối"}]})
        report = result["report"]
        self.assertEqual(report["overallStatus"], "review")
        self.assertEqual(len(report["checks"]), 5)
        self.assertEqual(report["checks"][3]["id"], "claims")


if __name__ == "__main__":
    unittest.main()
