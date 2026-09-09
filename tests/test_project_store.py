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


if __name__ == "__main__":
    unittest.main()
