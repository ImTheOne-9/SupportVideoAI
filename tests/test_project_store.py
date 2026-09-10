import tempfile
import unittest
from pathlib import Path

from engine.project_store import ProjectStore


class TestProjectStore(unittest.TestCase):
    def test_save_list_reopen_update_and_delete(self):
        with tempfile.TemporaryDirectory() as directory:
            store = ProjectStore(Path(directory) / "creatorutils.db")
            saved = store.save({
                "name": "Review Robot",
                "mediaName": "a-roll.mp4",
                "durationSec": 42,
                "transcripts": [{"startSec": 0, "endSec": 2, "text": "Xin chào"}],
            })
            project_id = saved["id"]
            self.assertEqual(store.list()[0]["transcriptCount"], 1)
            reopened = ProjectStore(Path(directory) / "creatorutils.db").get(project_id)
            self.assertEqual(reopened["mediaName"], "a-roll.mp4")

            reopened["transcripts"].append({"startSec": 2, "endSec": 4, "text": "Tiếp theo"})
            store.save(reopened)
            self.assertEqual(store.list()[0]["transcriptCount"], 2)
            self.assertTrue(store.delete(project_id))
            self.assertEqual(store.list(), [])

    def test_broll_scene_index_cache_replace_and_delete(self):
        with tempfile.TemporaryDirectory() as directory:
            store = ProjectStore(Path(directory) / "creatorutils.db")
            clip = {"clipId": "B001", "clipName": "con-lan.mp4", "fingerprint": "fp-1", "durationSec": 12, "aspectRatio": "16:9"}
            scenes = [{
                "sceneId": "B001:scene-1", "startSec": 0, "endSec": 6, "keyframeSec": 3,
                "description": "Cảnh rửa con lăn", "tags": ["con lăn", "rửa"], "embedding": [0.1, 0.2, 0.3]
            }]
            first = store.save_broll_index(clip, scenes)
            self.assertFalse(first["cached"])
            self.assertEqual(first["scenes"][0]["description"], "Cảnh rửa con lăn")
            self.assertEqual(first["scenes"][0]["embedding"], [0.1, 0.2, 0.3])

            cached = store.save_broll_index(clip, [{**scenes[0], "description": "Không được ghi đè"}])
            self.assertTrue(cached["cached"])
            self.assertEqual(cached["scenes"][0]["description"], "Cảnh rửa con lăn")

            replaced = store.save_broll_index({**clip, "fingerprint": "fp-2"}, [{**scenes[0], "description": "Cảnh mới"}])
            self.assertFalse(replaced["cached"])
            self.assertEqual(store.get_broll_index("B001")[0]["description"], "Cảnh mới")
            self.assertTrue(store.delete_broll_index("B001"))
            self.assertEqual(store.get_broll_index("B001"), [])


if __name__ == "__main__":
    unittest.main()
