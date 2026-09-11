"""Gateway duy nhất quản lý Gemini API key, generation và embeddings."""

from __future__ import annotations

import os
import threading
from typing import Any, Callable


class GeminiService:
    def __init__(self, api_key: str, get_settings: Callable[[], dict[str, Any]]):
        self._api_key = api_key.strip()
        self._get_settings = get_settings
        self._lock = threading.Lock()

    @property
    def api_key(self) -> str:
        with self._lock:
            return self._api_key

    @property
    def configured(self) -> bool:
        return bool(self.api_key)

    def configure(self, api_key: str) -> None:
        with self._lock:
            self._api_key = api_key.strip()

    def require_key(self) -> str:
        key = self.api_key
        if not key:
            raise ValueError("Chưa cấu hình Gemini API key trong AI engine.")
        return key

    def model_name(self) -> str:
        return os.environ.get("GEMINI_MODEL", str(self._get_settings()["geminiModel"]))

    def generate(self, prompt: str, model: str | None = None):
        from google import genai
        from google.genai import types

        config = types.GenerateContentConfig(max_output_tokens=int(self._get_settings()["maxOutputTokens"]))
        client = genai.Client(api_key=self.require_key())
        return client.models.generate_content(model=model or self.model_name(), contents=prompt, config=config)

    def embed_texts(
        self,
        texts: list[str],
        fallback: Callable[[str], list[float]],
    ) -> tuple[list[list[float]], str]:
        if not texts:
            return [], "local-hash-v1"
        if self.configured:
            try:
                from google import genai
                from google.genai import types

                model = os.environ.get("GEMINI_EMBEDDING_MODEL", "gemini-embedding-001")
                config = types.EmbedContentConfig(task_type="SEMANTIC_SIMILARITY", output_dimensionality=768)
                response = genai.Client(api_key=self.api_key).models.embed_content(
                    model=model,
                    contents=texts,
                    config=config,
                )
                return [[float(value) for value in item.values] for item in response.embeddings], model
            except Exception as exc:
                print(f"[CreatorUtils] Gemini embedding fallback: {exc}")
        return [fallback(text) for text in texts], "local-hash-v1"
