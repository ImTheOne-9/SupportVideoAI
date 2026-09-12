import unittest

from engine.semantic_matcher import cosine_similarity, create_placements, local_embedding, search_scenes


class TestSemanticMatcher(unittest.TestCase):
    def test_local_embedding_is_stable_and_cosine_prefers_same_meaning_tokens(self):
        query = local_embedding("rửa con lăn lau nhà")
        relevant = local_embedding("cảnh rửa con lăn của robot lau nhà")
        unrelated = local_embedding("người cầm điện thoại ngoài đường")
        self.assertEqual(query, local_embedding("rửa con lăn lau nhà"))
        self.assertGreater(cosine_similarity(query, relevant), cosine_similarity(query, unrelated))

    def test_placement_has_source_bounds_and_does_not_overlap(self):
        transcripts = [
            {"startSec": 0, "endSec": 6, "text": "mở đầu"},
            {"startSec": 6, "endSec": 14, "text": "rửa con lăn"},
            {"startSec": 15, "endSec": 24, "text": "điện thoại"},
        ]
        scenes = [
            {"clipId": "B1", "clipName": "roller.mp4", "sceneId": "B1:s1", "startSec": 4, "endSec": 11,
             "description": "rửa con lăn", "tags": ["con lăn"], "aspectRatio": "16:9", "embedding": local_embedding("rửa con lăn")},
            {"clipId": "B2", "clipName": "phone.mp4", "sceneId": "B2:s1", "startSec": 2, "endSec": 9,
             "description": "điện thoại", "tags": ["điện thoại"], "aspectRatio": "16:9", "embedding": local_embedding("điện thoại")},
        ]
        embeddings = [local_embedding(item["text"]) for item in transcripts]
        placements = create_placements(transcripts, scenes, embeddings, total_duration_sec=24, intro_hold_sec=3, coverage_ratio=.8)
        self.assertGreaterEqual(len(placements), 2)
        self.assertEqual(placements[0]["clipId"], "B1")
        for index, placement in enumerate(placements):
            self.assertGreaterEqual(placement["startSec"], 3)
            self.assertLessEqual(placement["sourceOutSec"], next(scene["endSec"] for scene in scenes if scene["sceneId"] == placement["sceneId"]))
            if index:
                self.assertGreaterEqual(placement["startSec"], placements[index - 1]["endSec"])

    def test_vertical_scene_is_filtered(self):
        transcript = [{"startSec": 3, "endSec": 10, "text": "sản phẩm"}]
        vertical = [{"clipId": "V", "startSec": 0, "endSec": 7, "description": "sản phẩm", "aspectRatio": "9:16", "embedding": local_embedding("sản phẩm")}]
        self.assertEqual(create_placements(transcript, vertical, [local_embedding("sản phẩm")], total_duration_sec=10, only_16_9=True), [])

    def test_semantic_search_returns_relevant_scene_first(self):
        scenes = [
            {"clipId": "B1", "description": "cảnh rửa con lăn robot", "embedding": local_embedding("rửa con lăn robot")},
            {"clipId": "B2", "description": "người đi bộ ngoài phố", "embedding": local_embedding("người đi bộ ngoài phố")},
        ]
        results = search_scenes("rửa con lăn", scenes, local_embedding("rửa con lăn"), 2)
        self.assertEqual(results[0]["clipId"], "B1")
        self.assertGreater(results[0]["searchScore"], results[1]["searchScore"])


if __name__ == "__main__":
    unittest.main()
