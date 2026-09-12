"""Embedding fallback và hybrid semantic matcher cho transcript ↔ B-Roll scene."""

from __future__ import annotations

import hashlib
import math
import re
from typing import Any

from engine.domain.timeline import validate_non_overlapping


def tokenize(text: str) -> list[str]:
    return re.findall(r"[\wÀ-ỹ]+", str(text).lower(), flags=re.UNICODE)


def local_embedding(text: str, dimensions: int = 128) -> list[float]:
    """Feature hashing embedding ổn định, chạy offline và không lưu nội dung ra ngoài."""
    vector = [0.0] * dimensions
    tokens = tokenize(text)
    for token in tokens:
        digest = hashlib.sha256(token.encode("utf-8")).digest()
        for offset in (0, 4, 8):
            index = int.from_bytes(digest[offset:offset + 4], "big") % dimensions
            vector[index] += 1.0 if digest[offset + 12] % 2 == 0 else -1.0
    magnitude = math.sqrt(sum(value * value for value in vector)) or 1.0
    return [round(value / magnitude, 8) for value in vector]


def cosine_similarity(left: list[float], right: list[float]) -> float:
    if not left or len(left) != len(right):
        return 0.0
    left_norm = math.sqrt(sum(value * value for value in left))
    right_norm = math.sqrt(sum(value * value for value in right))
    if not left_norm or not right_norm:
        return 0.0
    return sum(a * b for a, b in zip(left, right)) / (left_norm * right_norm)


def scene_text(scene: dict[str, Any]) -> str:
    parts: list[str] = [str(scene.get("description", "")), str(scene.get("cameraAngle", ""))]
    for key in ("tags", "subjects", "techFeatures"):
        value = scene.get(key) or []
        parts.extend(str(item) for item in value if item)
    return " ".join(parts).strip()


def keyword_similarity(query: str, candidate: str) -> float:
    query_tokens = set(tokenize(query))
    candidate_tokens = set(tokenize(candidate))
    if not query_tokens or not candidate_tokens:
        return 0.0
    return len(query_tokens & candidate_tokens) / math.sqrt(len(query_tokens) * len(candidate_tokens))


def search_scenes(query: str, scenes: list[dict[str, Any]], query_embedding: list[float], limit: int = 20) -> list[dict[str, Any]]:
    ranked = []
    for scene in scenes:
        semantic = max(0.0, cosine_similarity(query_embedding, scene.get("embedding") or []))
        keyword = keyword_similarity(query, scene_text(scene))
        score = semantic * 0.8 + keyword * 0.2
        ranked.append({**scene, "searchScore": round(score, 4), "semanticScore": round(semantic, 4), "keywordScore": round(keyword, 4)})
    return sorted(ranked, key=lambda item: item["searchScore"], reverse=True)[:max(1, min(100, int(limit)))]


def create_placements(
    transcripts: list[dict[str, Any]], scenes: list[dict[str, Any]], query_embeddings: list[list[float]],
    *, total_duration_sec: float, min_duration: float = 3.0, max_duration: float = 10.0,
    coverage_ratio: float = 0.7, intro_hold_sec: float = 3.0, only_16_9: bool = True,
) -> list[dict[str, Any]]:
    candidates = [scene for scene in scenes if not only_16_9 or scene.get("aspectRatio") == "16:9"]
    if not candidates:
        return []
    placements: list[dict[str, Any]] = []
    usage: dict[str, int] = {}
    target_duration = max(0.0, total_duration_sec - intro_hold_sec) * max(0.0, min(1.0, coverage_ratio))
    accumulated = 0.0
    last_end = intro_hold_sec
    for index, transcript in enumerate(transcripts):
        if accumulated >= target_duration:
            break
        timeline_start = max(last_end, intro_hold_sec, float(transcript.get("startSec", 0) or 0))
        transcript_end = min(total_duration_sec, float(transcript.get("endSec", total_duration_sec) or total_duration_sec))
        available = transcript_end - timeline_start
        if available < min_duration:
            continue
        query = str(transcript.get("text", ""))
        query_embedding = query_embeddings[index] if index < len(query_embeddings) else []
        ranked = []
        for scene in candidates:
            semantic = max(0.0, cosine_similarity(query_embedding, scene.get("embedding") or []))
            keyword = keyword_similarity(query, scene_text(scene))
            reuse_penalty = usage.get(str(scene.get("clipId")), 0) * 0.08
            score = semantic * 0.78 + keyword * 0.22 - reuse_penalty
            ranked.append((score, semantic, keyword, scene))
        score, semantic, keyword, selected = max(ranked, key=lambda item: item[0])
        source_start = float(selected.get("startSec", 0) or 0)
        source_end = float(selected.get("endSec", source_start) or source_start)
        duration = min(max_duration, source_end - source_start, available, target_duration - accumulated)
        if duration < min_duration:
            continue
        timeline_end = timeline_start + duration
        clip_id = str(selected.get("clipId", ""))
        placements.append({
            "id": f"pos-{len(placements) + 1}", "clipId": clip_id,
            "clipName": selected.get("clipName") or f"{clip_id}.mov", "sceneId": selected.get("sceneId"),
            "startSec": round(timeline_start, 3), "endSec": round(timeline_end, 3), "durationSec": round(duration, 3),
            "sourceInSec": round(source_start, 3), "sourceOutSec": round(source_start + duration, 3),
            "sourceDurationSec": float(selected.get("durationSec", source_end) or source_end),
            "matchPercentage": max(0, min(99, round(max(0.0, score) * 100))),
            "semanticScore": round(semantic, 4), "keywordScore": round(keyword, 4),
            "description": selected.get("description", ""), "matchedSpeech": query,
            "reason": f"Ngữ nghĩa {semantic:.0%}, từ khóa {keyword:.0%}", "status": "suggested",
        })
        usage[clip_id] = usage.get(clip_id, 0) + 1
        accumulated += duration
        last_end = timeline_end + 0.5
    validate_non_overlapping(placements, total_duration_sec)
    return placements
