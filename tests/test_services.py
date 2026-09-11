import os
import tempfile
import unittest
from unittest.mock import patch

from engine.services.gemini_service import GeminiService
from engine.services.whisper_service import WhisperService


class TestGeminiService(unittest.TestCase):
    def test_key_is_runtime_only_and_can_be_cleared(self):
        service = GeminiService("initial", lambda: {"geminiModel": "model", "maxOutputTokens": 1024})
        self.assertTrue(service.configured)
        service.configure("")
        self.assertFalse(service.configured)
        with self.assertRaises(ValueError):
            service.require_key()

    def test_embeddings_use_offline_fallback_without_key(self):
        service = GeminiService("", lambda: {"geminiModel": "model", "maxOutputTokens": 1024})
        vectors, model = service.embed_texts(["xin chào"], lambda _: [1.0, 0.0])
        self.assertEqual(vectors, [[1.0, 0.0]])
        self.assertEqual(model, "local-hash-v1")


class TestWhisperService(unittest.TestCase):
    def settings(self):
        return {"whisperModel": "small", "normalizeAudio": False, "manualGainDb": 0}

    def test_audio_is_not_rewritten_when_filters_are_disabled(self):
        service = WhisperService(self.settings)
        self.assertEqual(service.prepare_audio("source.mp4"), "source.mp4")

    def test_model_configuration_can_be_overridden_by_environment(self):
        service = WhisperService(self.settings)
        with patch.dict(os.environ, {"WHISPER_MODEL": "tiny", "WHISPER_DEVICE": "cpu", "WHISPER_COMPUTE_TYPE": "int8"}):
            self.assertEqual(service.model_config(), ("tiny", "cpu", "int8"))

    def test_unknown_download_model_is_rejected_before_network(self):
        service = WhisperService(self.settings)
        with self.assertRaises(ValueError):
            service.download_model("unknown")

    def test_packaged_ffmpeg_path_can_be_supplied_by_environment(self):
        service = WhisperService(self.settings)
        with tempfile.NamedTemporaryFile() as executable:
            with patch.dict(os.environ, {"CREATORUTILS_FFMPEG_PATH": executable.name}):
                self.assertEqual(service.ffmpeg_path(), executable.name)
