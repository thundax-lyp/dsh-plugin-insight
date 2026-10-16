import test from 'node:test';
import assert from 'node:assert/strict';
import { capture, releaseFingerprint } from '../scripts/capture-github.mjs';

test('download counters do not change release fingerprint but asset changes do', () => {
  const releases = [{ id: 1, tag_name: 'v1', published_at: '2026-10-16T00:00:00Z', body: 'notes',
    prerelease: false, draft: false,
    assets: [{ id: 1, name: 'plugin.tgz', size: 10, updated_at: '2026-10-16T00:00:00Z', download_count: 1 }] }];
  const changed = structuredClone(releases);
  changed[0].assets[0].download_count += 10;
  assert.equal(releaseFingerprint(releases), releaseFingerprint(changed));
  changed[0].assets[0].size += 1;
  assert.notEqual(releaseFingerprint(releases), releaseFingerprint(changed));
});
test('invalid repository never calls API', () => {
  let calls = 0;
  assert.throws(() => capture('owner/repo;echo x', () => { calls++; }), /owner\/repository/);
  assert.equal(calls, 0);
});
test('capture discloses truncated tree and filters sensitive metadata', () => {
  const responses = [
    { id: 1, full_name: 'example/repo', default_branch: 'main', archived: false, disabled: false,
      pushed_at: '2026-10-16T00:00:00Z', temp_clone_token: 'not-for-storage' },
    { sha: 'pinned', commit: { tree: { sha: 'tree-id' } } },
    { truncated: true, tree: [] }, [],
  ];
  const result = capture('example/repo', () => responses.shift());
  assert.equal(result.commit, 'pinned');
  assert.equal('temp_clone_token' in result.metadata, false);
  assert.ok(result.limitations.some((limit) => limit.includes('截断')));
});
test('captured files are fetched at pinned commit and decoded without execution', () => {
  const endpoints = [];
  const responses = [
    { id: 1, full_name: 'example/repo', default_branch: 'main', archived: false, disabled: false, pushed_at: '2026-10-16T00:00:00Z' },
    { sha: 'pinned', commit: { tree: { sha: 'tree-id' } } },
    { truncated: false, tree: [{ type: 'blob', path: 'README.md' }] }, [],
    { encoding: 'base64', content: Buffer.from('# 合成数据').toString('base64') },
  ];
  const result = capture('example/repo', (endpoint) => { endpoints.push(endpoint); return responses.shift(); });
  assert.equal(result.files['README.md'], '# 合成数据');
  assert.equal(endpoints.at(-1), 'repos/example/repo/contents/README.md?ref=pinned');
});
