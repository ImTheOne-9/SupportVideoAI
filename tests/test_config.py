import os
import unittest
from unittest.mock import patch

from engine.config import ServerConfig, normalize_settings


class TestConfiguration(unittest.TestCase):
    def test_server_config_reads_and_validates_environment(self):
        with patch.dict(os.environ, {
            "CREATORUTILS_API_HOST": "127.0.0.1",
            "CREATORUTILS_API_PORT": "9123",
            "CREATORUTILS_MAX_UPLOAD_MB": "32",
        }):
            config = ServerConfig.from_environment()
        self.assertEqual(config.port, 9123)
        self.assertEqual(config.max_upload_bytes, 32 * 1024 * 1024)

    def test_settings_are_filtered_and_bounded(self):
        result = normalize_settings({
            "whisperModel": "small",
            "manualGainDb": 999,
            "requestTimeoutSec": 1,
            "unknown": "ignored",
        })
        self.assertEqual(result["manualGainDb"], 24)
        self.assertEqual(result["requestTimeoutSec"], 30)
        self.assertNotIn("unknown", result)

    def test_unknown_whisper_model_is_rejected(self):
        with self.assertRaises(ValueError):
            normalize_settings({"whisperModel": "made-up"})
