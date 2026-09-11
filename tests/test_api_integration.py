import json
import tempfile
import threading
import unittest
from pathlib import Path
from urllib.error import HTTPError
from urllib.request import Request, urlopen

import engine.api_server as api_server
from engine.project_store import ProjectStore


class TestApiIntegration(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp_dir = tempfile.TemporaryDirectory()
        api_server._project_store = ProjectStore(Path(cls.temp_dir.name) / "integration.db")
        cls.server = api_server.create_server("127.0.0.1", 0)
        cls.thread = threading.Thread(target=cls.server.serve_forever, daemon=True)
        cls.thread.start()
        cls.base_url = f"http://127.0.0.1:{cls.server.server_port}"

    @classmethod
    def tearDownClass(cls):
        cls.server.shutdown()
        cls.server.server_close()
        cls.thread.join(timeout=3)
        cls.temp_dir.cleanup()

    def request_json(self, path, method="GET", payload=None):
        body = None if payload is None else json.dumps(payload).encode("utf-8")
        request = Request(
            self.base_url + path,
            data=body,
            method=method,
            headers={"Content-Type": "application/json"},
        )
        with urlopen(request, timeout=5) as response:
            return response.status, json.loads(response.read().decode("utf-8"))

    def test_health_endpoint_starts_and_reports_contract(self):
        status, payload = self.request_json("/api/health")
        self.assertEqual(status, 200)
        self.assertTrue(payload["ok"])
        self.assertIn("apiVersion", payload)
        self.assertIn("huggingFaceReady", payload)
        self.assertIn("ffmpegReady", payload)
        self.assertIn("semantic-broll", payload["features"])

    def test_settings_round_trip_and_validation(self):
        status, payload = self.request_json("/api/settings", "POST", {
            "language": "en",
            "manualGainDb": 50,
            "unknown": "ignored",
        })
        self.assertEqual(status, 200)
        self.assertEqual(payload["settings"]["language"], "en")
        self.assertEqual(payload["settings"]["manualGainDb"], 24)
        self.assertNotIn("unknown", payload["settings"])

        with self.assertRaises(HTTPError) as context:
            self.request_json("/api/settings", "POST", {"whisperModel": "invalid"})
        self.assertEqual(context.exception.code, 400)

    def test_projects_endpoint_returns_empty_collection(self):
        status, payload = self.request_json("/api/projects")
        self.assertEqual(status, 200)
        self.assertEqual(payload["projects"], [])

    def test_export_endpoint_is_the_canonical_xml_serializer(self):
        status, payload = self.request_json("/api/export", "POST", {
            "format": "fcpxml",
            "projectName": "Dự án & test",
            "arollName": "main & voice.mp4",
            "totalDurationSec": 15,
            "fps": 30,
            "cuts": [{"startSec": 5, "endSec": 8}],
            "placements": [{
                "clipId": "B1", "clipName": "detail & macro.mp4",
                "startSec": 10, "endSec": 13, "durationSec": 3,
                "sourceInSec": 4, "sourceOutSec": 7, "sourceDurationSec": 20,
            }],
        })
        self.assertEqual(status, 200)
        self.assertEqual(payload["format"], "fcpxml")
        self.assertTrue(payload["filename"].endswith(".fcpxml"))
        root = __import__("xml.etree.ElementTree", fromlist=["ElementTree"]).fromstring(payload["content"])
        self.assertEqual(root.tag, "fcpxml")
        self.assertEqual(root.find(".//sequence").attrib["duration"], "360/30s")

    def test_export_endpoint_rejects_unknown_format(self):
        with self.assertRaises(HTTPError) as context:
            self.request_json("/api/export", "POST", {
                "format": "unknown", "totalDurationSec": 10,
            })
        self.assertEqual(context.exception.code, 400)
