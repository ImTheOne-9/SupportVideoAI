import unittest

from engine.domain.edit_decision import kept_segments, normalize_cuts, remap_placements


class TestEditDecision(unittest.TestCase):
    def test_overlapping_cuts_are_merged(self):
        self.assertEqual(normalize_cuts([
            {"startSec": 2, "endSec": 5},
            {"startSec": 4, "endSec": 7},
        ], 10), [{"startSec": 2.0, "endSec": 7.0}])

    def test_kept_segments_have_source_and_timeline_coordinates(self):
        self.assertEqual(kept_segments([{"startSec": 2, "endSec": 4}], 6), [
            {"sourceStartSec": 0.0, "sourceEndSec": 2.0, "timelineStartSec": 0.0, "timelineEndSec": 2.0, "durationSec": 2.0},
            {"sourceStartSec": 4.0, "sourceEndSec": 6, "timelineStartSec": 2.0, "timelineEndSec": 4.0, "durationSec": 2.0},
        ])

    def test_placement_inside_cut_is_removed_and_later_placement_is_shifted(self):
        segments = kept_segments([{"startSec": 5, "endSec": 8}], 15)
        placements = remap_placements([
            {"clip_id": "inside", "start_sec": 6, "end_sec": 7, "duration_sec": 1},
            {"clip_id": "later", "start_sec": 10, "end_sec": 13, "duration_sec": 3},
        ], segments)
        self.assertEqual(len(placements), 1)
        self.assertEqual(placements[0]["clip_id"], "later")
        self.assertEqual(placements[0]["start_sec"], 7)
