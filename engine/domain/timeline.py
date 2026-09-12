"""Các invariant dùng chung cho placement trên timeline."""

from __future__ import annotations

from typing import Any


def validate_placement(placement: dict[str, Any], total_duration_sec: float | None = None) -> None:
    start = float(placement.get("startSec", placement.get("start_sec", 0)))
    end = float(placement.get("endSec", placement.get("end_sec", 0)))
    source_in = float(placement.get("sourceInSec", placement.get("source_in_sec", 0)))
    source_out = float(placement.get("sourceOutSec", placement.get("source_out_sec", source_in + end - start)))
    if start < 0 or end <= start:
        raise ValueError("Placement phải có timeline start/end hợp lệ.")
    if total_duration_sec is not None and end > total_duration_sec + 1e-6:
        raise ValueError("Placement vượt quá thời lượng timeline.")
    if source_in < 0 or source_out <= source_in:
        raise ValueError("Placement phải có source in/out hợp lệ.")
    source_duration = placement.get("sourceDurationSec", placement.get("source_duration_sec"))
    if source_duration is not None and source_out > float(source_duration) + 1e-6:
        raise ValueError("Placement vượt quá thời lượng source clip.")


def validate_non_overlapping(placements: list[dict[str, Any]], total_duration_sec: float | None = None) -> None:
    ordered = sorted(placements, key=lambda item: float(item.get("startSec", item.get("start_sec", 0))))
    previous_end = -1.0
    for placement in ordered:
        validate_placement(placement, total_duration_sec)
        start = float(placement.get("startSec", placement.get("start_sec", 0)))
        if start < previous_end - 1e-6:
            raise ValueError("Các placement B-Roll không được chồng nhau.")
        previous_end = float(placement.get("endSec", placement.get("end_sec", 0)))
