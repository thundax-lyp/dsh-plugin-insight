import test from 'node:test';
import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdtempSync, readFileSync, rmSync, writeFileSync, existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve, join } from 'node:path';
import { ROOT, read, digest, plan, apply, validate, validateObservations, atomicWrite } from '../scripts/plugin-data.mjs';

const fixture = () => {
  const empty = { schema_version: 1, plugins: [], runs: [] };
  const observations = read(resolve(ROOT, 'examples/observations.json'));
  const base = plan(empty, observations, 'init').result;
  const update = structuredClone(observations);
  update.run_id = 'next-check';
  update.checked_at = '2026-10-17T06:00:00Z';
  update.plugins[0].last_checked_at = update.checked_at;
  update.plugins[0].findings = [];
  return { empty, observations, base, update };
};
const temporary = (callback) => {
  const directory = mkdtempSync(join(tmpdir(), 'dsh-data-'));
  try { return callback(directory); } finally { rmSync(directory, { recursive: true, force: true }); }
};

test('initialization establishes baseline and rejects reinitialization', () => {
  const { base, update } = fixture();
  assert.equal(base.plugins.length, 1);
  assert.throws(() => plan(base, update, 'init'), /empty catalog/);
});
test('unchanged check preserves commentary and records checkpoint', () => {
  const { base, update } = fixture();
  const prepared = plan(base, update, 'update');
  assert.deepEqual(prepared.summary, []);
  assert.deepEqual(prepared.result.plugins[0].findings, base.plugins[0].findings);
  assert.equal(prepared.result.runs.length, 2);
});
test('replaying applied run id cannot duplicate data', () => {
  const { base, observations } = fixture();
  assert.throws(() => plan(base, observations, 'update'), /already applied/);
});
test('failed fetch records error without deleting or changing plugin', () => {
  const { base, update } = fixture();
  update.plugins = [];
  update.errors = [{ target: 'example/plugin', message: '403 rate limited' }];
  const prepared = plan(base, update, 'update');
  assert.deepEqual(prepared.result.plugins, base.plugins);
  assert.equal(prepared.errors.length, 1);
});
test('partial batches preserve missing records', () => {
  const { base, update } = fixture();
  update.plugins = [];
  assert.deepEqual(plan(base, update, 'update').result.plugins, base.plugins);
});
test('changed dependency marks finding stale without rewriting text', () => {
  const { base, update } = fixture();
  update.plugins[0].fingerprints.directory = 'new-entry';
  const prepared = plan(base, update, 'update');
  const finding = prepared.result.plugins[0].findings[0];
  assert.equal(finding.status, 'needs_review');
  assert.equal(finding.text, base.plugins[0].findings[0].text);
  assert.ok(prepared.summary.some((change) => change.kind === 'review_invalidated'));
});
test('changes invalidate dependent comparisons in other plugins', () => {
  const { base, observations, update } = fixture();
  const second = structuredClone(observations.plugins[0]);
  Object.assign(second, { id: 'github:2:root', repository_id: 2, repository: 'example/second', evidence: [] });
  second.findings[0].id = 'comparison';
  base.plugins.push(second);
  update.plugins[0].fingerprints.directory = 'new-entry';
  assert.equal(plan(base, update, 'update').result.plugins[1].findings[0].status, 'needs_review');
});
test('explicit refreshed review restores validity', () => {
  const { base, observations, update } = fixture();
  update.plugins[0].fingerprints.directory = 'new-entry';
  const staleCatalog = plan(base, update, 'update').result;
  update.run_id = 'review';
  const finding = structuredClone(observations.plugins[0].findings[0]);
  finding.dependencies[0].fingerprint = 'new-entry';
  finding.reviewed_at = update.checked_at;
  update.plugins[0].findings = [finding];
  assert.equal(plan(staleCatalog, update, 'update').result.plugins[0].findings[0].status, 'current');
});
test('rename and path move preserve identity and aliases', () => {
  const { base, update } = fixture();
  update.plugins[0].repository = 'example/renamed';
  update.plugins[0].path = 'plugins/memory';
  const plugin = plan(base, update, 'update').result.plugins[0];
  assert.equal(plugin.id, base.plugins[0].id);
  assert.ok(plugin.aliases.includes('example/synthetic-plugin/'));
});
test('uninspected fingerprint areas retain prior values', () => {
  const { base, update } = fixture();
  delete update.plugins[0].fingerprints.code;
  assert.equal(plan(base, update, 'update').result.plugins[0].fingerprints.code, 'synthetic-tree-v1');
});
test('immutable evidence cannot be overwritten', () => {
  const { base, update } = fixture();
  update.plugins[0].evidence[0].summary = 'Changed claim';
  assert.throws(() => plan(base, update, 'update'), /immutable/);
});
test('unknown evidence and unsupported research depth are rejected', () => {
  const { base } = fixture();
  const invalid = structuredClone(base);
  invalid.plugins[0].findings[0].evidence_ids = ['missing'];
  assert.throws(() => validate(invalid), /unknown evidence/);
  base.plugins[0].research_depth = 'host_verified';
  assert.throws(() => validate(base), /depth lacks evidence/);
});
test('duplicate identities and obsolete current findings are rejected', () => {
  const { base } = fixture();
  const duplicate = structuredClone(base);
  duplicate.plugins.push(structuredClone(duplicate.plugins[0]));
  assert.throws(() => validate(duplicate), /duplicate plugin/);
  base.plugins[0].fingerprints.directory = 'different';
  assert.throws(() => validate(base), /obsolete dependency/);
});
test('atomic apply rejects an outdated base and releases its lock', () => temporary((directory) => {
  const { empty, observations, base } = fixture();
  const path = join(directory, 'catalog.json');
  atomicWrite(path, empty);
  const prepared = plan(empty, observations, 'init');
  apply(path, prepared);
  assert.deepEqual(read(path), base);
  const before = readFileSync(path, 'utf8');
  assert.throws(() => apply(path, prepared), /changed since planning/);
  assert.equal(readFileSync(path, 'utf8'), before);
  assert.equal(existsSync(`${path}.lock`), false);
}));
test('corrupt plan cannot write catalog', () => temporary((directory) => {
  const { empty, observations } = fixture();
  const path = join(directory, 'catalog.json');
  atomicWrite(path, empty);
  const prepared = plan(empty, observations, 'init');
  prepared.result.plugins[0].id = 'corrupt';
  const before = readFileSync(path, 'utf8');
  assert.throws(() => apply(path, prepared), /digest mismatch/);
  assert.equal(readFileSync(path, 'utf8'), before);
}));
test('duplicate JSON keys and invalid dates are rejected', () => temporary((directory) => {
  const path = join(directory, 'bad.json');
  writeFileSync(path, '{"schema_version":1,"schema_version":2}');
  assert.throws(() => read(path), /duplicate JSON key/);
  const { base } = fixture();
  base.plugins[0].last_checked_at = 'yesterday';
  assert.throws(() => validate(base), /date-time/);
}));
test('existing writer lock is never stolen or removed', () => temporary((directory) => {
  const { empty, observations } = fixture();
  const path = join(directory, 'catalog.json');
  atomicWrite(path, empty);
  writeFileSync(`${path}.lock`, 'another writer');
  assert.throws(() => apply(path, plan(empty, observations, 'init')), /catalog is locked/);
  assert.deepEqual(read(path), empty);
  assert.equal(readFileSync(`${path}.lock`, 'utf8'), 'another writer');
}));
test('strict JSON rejects comments, trailing commas and escaped duplicate keys', () => temporary((directory) => {
  const path = join(directory, 'bad.json');
  for (const source of ['{/* comment */"a":1}', '{"a":1,}', '{"a":1,"\\u0061":2}']) {
    writeFileSync(path, source);
    assert.throws(() => read(path));
  }
}));
test('timestamp comparison respects timezone offsets and batch cutoff', () => {
  const { base, update } = fixture();
  update.plugins[0].last_checked_at = '2026-10-16T13:00:00+08:00';
  assert.throws(() => plan(base, update, 'update'), /older than/);
  update.plugins[0].last_checked_at = '2026-10-18T00:00:00Z';
  assert.throws(() => validateObservations(update), /later than batch cutoff/);
});
test('canonical digests are independent of object insertion order', () => {
  assert.equal(digest({ z: 1, a: { y: '中文', x: 2 } }), digest({ a: { x: 2, y: '中文' }, z: 1 }));
});
test('CLI can plan, apply and validate a temporary catalog', () => temporary((directory) => {
  const { empty } = fixture();
  const path = join(directory, 'catalog.json');
  const prepared = join(directory, 'plan.json');
  atomicWrite(path, empty);
  const cli = (...args) => execFileSync(process.execPath, [resolve(ROOT, 'scripts/plugin-data.mjs'), ...args], { encoding: 'utf8' });
  cli('plan', '--catalog', path, '--observations', resolve(ROOT, 'examples/observations.json'), '--mode', 'init', '--out', prepared);
  cli('apply', '--catalog', path, '--plan', prepared);
  assert.match(cli('validate', '--catalog', path), /passed/);
  assert.equal(read(path).plugins.length, 1);
}));
test('execution runtime matches the declared Codex-aligned Node version', () => {
  const version = readFileSync(resolve(ROOT, '.node-version'), 'utf8').trim();
  assert.equal(read(resolve(ROOT, 'package.json')).engines.node, version);
  assert.equal(process.versions.node, version, 'Switch to the project Node version before running checks');
});
