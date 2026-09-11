import sqlite3
import tempfile
import unittest
from pathlib import Path
from unittest.mock import patch

from engine.api.security import is_allowed_origin
from engine.domain.timeline import validate_non_overlapping, validate_placement
from engine.project_store import ProjectStore


class TestApiSecurity(unittest.TestCase):
    def test_only_known_local_frontends_are_allowed_by_default(self):
        self.assertTrue(is_allowed_origin("http://127.0.0.1:5173"))
        self.assertTrue(is_allowed_origin("http://localhost:4173"))
        self.assertFalse(is_allowed_origin("http://192.168.1.25:5173"))
        self.assertFalse(is_allowed_origin("https://evil.example:443"))

    def test_lan_origin_requires_explicit_configuration(self):
        with patch.dict("os.environ", {"CREATORUTILS_ALLOWED_ORIGINS": "http://192.168.1.25:5173"}):
            self.assertTrue(is_allowed_origin("http://192.168.1.25:5173"))


class TestTimelineDomain(unittest.TestCase):
    def test_valid_placement_respects_source_and_timeline_bounds(self):
        validate_placement({
            "startSec": 2,
            "endSec": 5,
            "sourceInSec": 4,
            "sourceOutSec": 7,
            "sourceDurationSec": 10,
        }, 20)

    def test_overlap_is_rejected(self):
        with self.assertRaises(ValueError):
            validate_non_overlapping([
                {"startSec": 2, "endSec": 5, "sourceInSec": 0, "sourceOutSec": 3},
                {"startSec": 4, "endSec": 7, "sourceInSec": 0, "sourceOutSec": 3},
            ])


class TestPersistenceConfiguration(unittest.TestCase):
    def test_schema_version_and_foreign_keys_are_enabled(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "project.db"
            store = ProjectStore(path)
            connection = store._connect()
            try:
                self.assertEqual(connection.execute("PRAGMA user_version").fetchone()[0], 1)
                self.assertEqual(connection.execute("PRAGMA foreign_keys").fetchone()[0], 1)
            finally:
                connection.close()

    def test_newer_schema_is_not_silently_downgraded(self):
        with tempfile.TemporaryDirectory() as folder:
            path = Path(folder) / "future.db"
            connection = sqlite3.connect(path)
            connection.execute("PRAGMA user_version = 99")
            connection.close()
            with self.assertRaises(RuntimeError):
                ProjectStore(path)


class TestFrontendArchitecture(unittest.TestCase):
    def test_application_shell_no_longer_contains_legacy_implementations(self):
        root = Path(__file__).resolve().parents[1]
        app_source = (root / "src" / "app.js").read_text(encoding="utf-8")
        self.assertNotIn("class Kt", app_source)
        self.assertNotIn("class zt", app_source)
        self.assertLess(len(app_source.splitlines()), 500)

    def test_feature_modules_cover_runtime_behaviors(self):
        root = Path(__file__).resolve().parents[1]
        expected = {"workflow", "projects", "transcript", "summary", "metadata", "settings",
                    "compliance", "cut", "segment", "export", "media", "playback", "timeline"}
        actual = {path.parent.name for path in (root / "src" / "features").glob("*/creator_utils_feature.js")}
        self.assertEqual(actual, expected)
