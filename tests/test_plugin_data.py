import copy
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('plugin_data', ROOT / 'scripts/plugin_data.py')
data = importlib.util.module_from_spec(spec)
spec.loader.exec_module(data)


class CatalogTests(unittest.TestCase):
    def setUp(self):
        self.empty = {'schema_version': 1, 'plugins': [], 'runs': []}
        self.obs = data.read(ROOT / 'examples/observations.json')
        self.base = data.plan(self.empty, self.obs, 'init')['result']

    def update(self):
        obs = copy.deepcopy(self.obs)
        obs['run_id'] = 'next-check'
        obs['checked_at'] = '2026-10-17T06:00:00Z'
        obs['plugins'][0]['last_checked_at'] = obs['checked_at']
        obs['plugins'][0]['findings'] = []
        return obs

    def test_initialization_and_reinitialization_guard(self):
        self.assertEqual(len(self.base['plugins']), 1)
        obs = self.update()
        with self.assertRaisesRegex(ValueError, 'empty catalog'):
            data.plan(self.base, obs, 'init')

    def test_unchanged_check_preserves_commentary(self):
        prepared = data.plan(self.base, self.update(), 'update')
        self.assertEqual(prepared['summary'], [])
        self.assertEqual(prepared['result']['plugins'][0]['findings'], self.base['plugins'][0]['findings'])
        self.assertEqual(len(prepared['result']['runs']), 2)

    def test_replay_cannot_duplicate(self):
        with self.assertRaisesRegex(ValueError, 'already applied'):
            data.plan(self.base, self.obs, 'update')

    def test_failed_fetch_does_not_delete_or_change_record(self):
        obs = self.update()
        obs['plugins'] = []
        obs['errors'] = [{'target': 'example/synthetic-plugin', 'message': '403 rate limited'}]
        prepared = data.plan(self.base, obs, 'update')
        self.assertEqual(prepared['result']['plugins'], self.base['plugins'])
        self.assertEqual(len(prepared['errors']), 1)

    def test_missing_record_from_partial_batch_is_preserved(self):
        obs = self.update()
        obs['plugins'] = []
        self.assertEqual(data.plan(self.base, obs, 'update')['result']['plugins'], self.base['plugins'])

    def test_changed_dependency_marks_review_stale_without_rewriting(self):
        obs = self.update()
        obs['plugins'][0]['fingerprints']['directory'] = 'new-entry'
        prepared = data.plan(self.base, obs, 'update')
        finding = prepared['result']['plugins'][0]['findings'][0]
        self.assertEqual(finding['status'], 'needs_review')
        self.assertEqual(finding['text'], self.base['plugins'][0]['findings'][0]['text'])
        self.assertTrue(any(c['kind'] == 'review_invalidated' for c in prepared['summary']))

    def test_cross_plugin_comparison_invalidation(self):
        second = copy.deepcopy(self.obs['plugins'][0])
        second.update(id='github:2:root', repository_id=2, repository='example/second', evidence=[])
        second['findings'][0]['id'] = 'comparison'
        self.base['plugins'].append(second)
        obs = self.update()
        obs['plugins'][0]['fingerprints']['directory'] = 'new-entry'
        result = data.plan(self.base, obs, 'update')['result']
        self.assertEqual(result['plugins'][1]['findings'][0]['status'], 'needs_review')

    def test_review_can_be_explicitly_refreshed(self):
        obs = self.update()
        obs['plugins'][0]['fingerprints']['directory'] = 'new-entry'
        stale_catalog = data.plan(self.base, obs, 'update')['result']
        obs['run_id'] = 'review'
        finding = copy.deepcopy(self.obs['plugins'][0]['findings'][0])
        finding['dependencies'][0]['fingerprint'] = 'new-entry'
        finding['reviewed_at'] = obs['checked_at']
        obs['plugins'][0]['findings'] = [finding]
        result = data.plan(stale_catalog, obs, 'update')['result']
        self.assertEqual(result['plugins'][0]['findings'][0]['status'], 'current')

    def test_rename_keeps_identity_and_adds_alias(self):
        obs = self.update()
        obs['plugins'][0]['repository'] = 'example/renamed'
        obs['plugins'][0]['path'] = 'plugins/memory'
        plugin = data.plan(self.base, obs, 'update')['result']['plugins'][0]
        self.assertEqual(plugin['id'], self.base['plugins'][0]['id'])
        self.assertIn('example/synthetic-plugin/', plugin['aliases'])

    def test_uninspected_fingerprints_preserved(self):
        obs = self.update()
        del obs['plugins'][0]['fingerprints']['code']
        p = data.plan(self.base, obs, 'update')['result']['plugins'][0]
        self.assertEqual(p['fingerprints']['code'], 'synthetic-tree-v1')

    def test_evidence_cannot_be_overwritten(self):
        obs = self.update()
        obs['plugins'][0]['evidence'][0]['summary'] = 'Changed claim'
        with self.assertRaisesRegex(ValueError, 'immutable'):
            data.plan(self.base, obs, 'update')

    def test_unknown_evidence_and_invalid_depth_rejected(self):
        invalid = copy.deepcopy(self.base)
        invalid['plugins'][0]['findings'][0]['evidence_ids'] = ['missing']
        with self.assertRaisesRegex(ValueError, 'unknown evidence'):
            data.validate(invalid)
        invalid = copy.deepcopy(self.base)
        invalid['plugins'][0]['research_depth'] = 'host_verified'
        with self.assertRaisesRegex(ValueError, 'depth lacks evidence'):
            data.validate(invalid)

    def test_duplicate_identity_and_stale_current_are_rejected(self):
        invalid = copy.deepcopy(self.base)
        invalid['plugins'].append(copy.deepcopy(invalid['plugins'][0]))
        with self.assertRaisesRegex(ValueError, 'duplicate plugin'):
            data.validate(invalid)
        invalid = copy.deepcopy(self.base)
        invalid['plugins'][0]['fingerprints']['directory'] = 'different'
        with self.assertRaisesRegex(ValueError, 'obsolete dependency'):
            data.validate(invalid)

    def test_atomic_apply_and_concurrent_base_protection(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'catalog.json'
            data.atomic_write(path, self.empty)
            prepared = data.plan(self.empty, self.obs, 'init')
            data.apply(path, prepared)
            self.assertEqual(data.read(path), self.base)
            prior_bytes = path.read_bytes()
            with self.assertRaisesRegex(ValueError, 'changed since planning'):
                data.apply(path, prepared)
            self.assertEqual(path.read_bytes(), prior_bytes)

    def test_invalid_plan_does_not_write(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'catalog.json'
            data.atomic_write(path, self.empty)
            prepared = data.plan(self.empty, self.obs, 'init')
            prepared['result']['plugins'][0]['id'] = 'corrupt'
            before = path.read_bytes()
            with self.assertRaisesRegex(ValueError, 'digest mismatch'):
                data.apply(path, prepared)
            self.assertEqual(path.read_bytes(), before)

    def test_duplicate_json_keys_and_bad_dates_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'bad.json'
            path.write_text('{"schema_version":1,"schema_version":2}')
            with self.assertRaisesRegex(ValueError, 'duplicate JSON key'):
                data.read(path)
        invalid = copy.deepcopy(self.base)
        invalid['plugins'][0]['last_checked_at'] = 'yesterday'
        with self.assertRaises(ValueError):
            data.validate(invalid)


if __name__ == '__main__':
    unittest.main()
