import copy
import importlib.util
from pathlib import Path
import sys
import unittest
from unittest.mock import patch

ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(ROOT / 'scripts'))
spec = importlib.util.spec_from_file_location('capture_github', ROOT / 'scripts/capture_github.py')
capture = importlib.util.module_from_spec(spec)
spec.loader.exec_module(capture)


class CaptureTests(unittest.TestCase):
    def test_download_counts_do_not_change_release_fingerprint(self):
        releases = [{'id': 1, 'tag_name': 'v1', 'published_at': '2026-10-16T00:00:00Z',
                     'body': 'notes', 'prerelease': False, 'draft': False,
                     'assets': [{'id': 1, 'name': 'plugin.tgz', 'size': 10,
                                 'updated_at': '2026-10-16T00:00:00Z', 'download_count': 1}]}]
        changed = copy.deepcopy(releases)
        changed[0]['assets'][0]['download_count'] += 10
        self.assertEqual(capture.release_fingerprint(releases), capture.release_fingerprint(changed))
        changed[0]['assets'][0]['size'] += 1
        self.assertNotEqual(capture.release_fingerprint(releases), capture.release_fingerprint(changed))

    def test_invalid_repository_never_calls_api(self):
        with patch.object(capture, 'api') as api:
            with self.assertRaises(ValueError):
                capture.capture('owner/repo;echo x')
            api.assert_not_called()

    def test_truncated_tree_is_disclosed_and_metadata_is_filtered(self):
        responses = [
            {'id': 1, 'full_name': 'example/repo', 'default_branch': 'main',
             'archived': False, 'disabled': False, 'pushed_at': '2026-10-16T00:00:00Z',
             'temp_clone_token': 'not-for-storage'},
            {'sha': 'pinned', 'commit': {'tree': {'sha': 'tree-id'}}},
            {'truncated': True, 'tree': []}, []
        ]
        with patch.object(capture, 'api', side_effect=responses):
            result = capture.capture('example/repo')
        self.assertEqual(result['commit'], 'pinned')
        self.assertNotIn('temp_clone_token', result['metadata'])
        self.assertTrue(any('truncated' in limit for limit in result['limitations']))


if __name__ == '__main__':
    unittest.main()
