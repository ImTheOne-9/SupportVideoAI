"""Pure edit-decision logic shared by exporters and future render jobs."""

from __future__ import annotations

from typing import Any


def _number(item: dict[str, Any], camel: str, snake: str, default: float = 0.0) -> float:
    return float(item.get(camel, item.get(snake, default)) or default)


def normalize_cuts(cuts: list[dict[str, Any]], duration_sec: float) -> list[dict[str, float]]:
    active = []
    for cut in cuts:
        if cut.get("status") in {"ignored", "disabled"}:
            continue
        start = max(0.0, _number(cut, "startSec", "start_sec"))
        end = min(duration_sec, _number(cut, "endSec", "end_sec"))
        if end > start:
            active.append({"startSec": start, "endSec": end})
    active.sort(key=lambda item: item["startSec"])
    merged: list[dict[str, float]] = []
    for cut in active:
        if merged and cut["startSec"] <= merged[-1]["endSec"]:
            merged[-1]["endSec"] = max(merged[-1]["endSec"], cut["endSec"])
        else:
            merged.append(dict(cut))
    return merged


def kept_segments(cuts: list[dict[str, Any]], duration_sec: float) -> list[dict[str, float]]:
    kept = []
    source_cursor = 0.0
    timeline_cursor = 0.0
    for cut in normalize_cuts(cuts, duration_sec):
        if cut["startSec"] > source_cursor:
            segment_duration = cut["startSec"] - source_cursor
            kept.append({
                "sourceStartSec": source_cursor,
                "sourceEndSec": cut["startSec"],
                "timelineStartSec": timeline_cursor,
                "timelineEndSec": timeline_cursor + segment_duration,
                "durationSec": segment_duration,
            })
            timeline_cursor += segment_duration
        source_cursor = max(source_cursor, cut["endSec"])
    if source_cursor < duration_sec:
        segment_duration = duration_sec - source_cursor
        kept.append({
            "sourceStartSec": source_cursor,
            "sourceEndSec": duration_sec,
            "timelineStartSec": timeline_cursor,
            "timelineEndSec": timeline_cursor + segment_duration,
            "durationSec": segment_duration,
        })
    return kept


def remap_placements(placements: list[dict[str, Any]], segments: list[dict[str, float]]) -> list[dict[str, Any]]:
    remapped = []
    for placement in placements:
        original_start = _number(placement, "startSec", "start_sec")
        source_segment = next((
            item for item in segments
            if item["sourceStartSec"] <= original_start < item["sourceEndSec"]
        ), None)
        if source_segment is None:
            continue
        duration = min(
            _number(placement, "durationSec", "duration_sec"),
            source_segment["sourceEndSec"] - original_start,
        )
        if duration <= 0:
            continue
        timeline_start = source_segment["timelineStartSec"] + original_start - source_segment["sourceStartSec"]
        remapped.append({
            **placement,
            "originalStartSec": original_start,
            "originalEndSec": _number(placement, "endSec", "end_sec"),
            "start_sec": timeline_start,
            "end_sec": timeline_start + duration,
            "duration_sec": duration,
        })
    return remapped
