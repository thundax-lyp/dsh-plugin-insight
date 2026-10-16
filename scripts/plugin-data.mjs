#!/usr/bin/env node
import { createHash, randomUUID } from 'node:crypto';
import { closeSync, existsSync, fsyncSync, mkdirSync, openSync, readFileSync, renameSync, unlinkSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { isDeepStrictEqual } from 'node:util';
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { parseTree, printParseErrorCode } from 'jsonc-parser';

export const ROOT = fileURLToPath(new URL('../', import.meta.url));

export const read = (path) => {
  const source = readFileSync(path, 'utf8');
  const errors = [];
  const tree = parseTree(source, errors, { disallowComments: true, allowTrailingComma: false });
  if (errors.length || !tree) throw new Error(`Invalid JSON: ${errors.map((e) => printParseErrorCode(e.error)).join(', ')}`);
  const visit = (node) => {
    if (node.type === 'object') {
      const keys = new Set();
      for (const property of node.children) {
        const key = property.children[0].value;
        if (keys.has(key)) throw new Error(`duplicate JSON key: ${key}`);
        keys.add(key);
      }
    }
    for (const child of node.children ?? []) visit(child);
  };
  visit(tree);
  return JSON.parse(source);
};

const canonical = (value) => {
  if (Array.isArray(value)) return value.map(canonical);
  if (value !== null && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
};
export const digest = (value) => createHash('sha256').update(JSON.stringify(canonical(value))).digest('hex');

const ajv = new Ajv2020({ allErrors: true, strict: true });
addFormats(ajv);
const catalogSchema = read(resolve(ROOT, 'schemas/catalog.schema.json'));
const observationsSchema = read(resolve(ROOT, 'schemas/observations.schema.json'));
ajv.addSchema(catalogSchema, 'catalog.schema.json');
const catalogCheck = ajv.getSchema('catalog.schema.json');
const observationsCheck = ajv.compile(observationsSchema);
const schemaCheck = (value, check) => {
  if (!check(value)) throw new Error(ajv.errorsText(check.errors, { separator: '; ' }));
};
const indexed = (items, label) => {
  const result = new Map();
  for (const item of items) {
    if (result.has(item.id)) throw new Error(`duplicate ${label} id: ${item.id}`);
    result.set(item.id, item);
  }
  return result;
};
const stale = (finding, plugins) => finding.dependencies.some(
  (d) => plugins.get(d.plugin_id)?.fingerprints[d.area] !== d.fingerprint,
);
const identity = (plugin) => {
  const expected = `github:${plugin.repository_id}:${plugin.component_id}`;
  if (plugin.id !== expected) throw new Error(`identity must be ${expected}`);
  if (plugin.path.startsWith('/') || plugin.path.split('/').includes('..')) {
    throw new Error(`unsafe component path: ${plugin.path}`);
  }
};

export const validate = (catalog) => {
  schemaCheck(catalog, catalogCheck);
  const plugins = indexed(catalog.plugins, 'plugin');
  indexed(catalog.runs, 'run');
  const evidence = new Map();
  for (const plugin of plugins.values()) {
    identity(plugin);
    indexed(plugin.sources, 'source');
    indexed(plugin.findings, 'finding');
    for (const item of plugin.evidence) {
      if (evidence.has(item.id)) throw new Error(`duplicate evidence id: ${item.id}`);
      evidence.set(item.id, item);
      if (['local_test', 'host_acceptance'].includes(item.kind) && !(item.artifact && item.environment)) {
        throw new Error(`execution evidence needs artifact and environment: ${item.id}`);
      }
    }
    const required = { source: 'source_inspection', tested: 'local_test', host_verified: 'host_acceptance' };
    if (required[plugin.research_depth] && !plugin.evidence.some((e) => e.kind === required[plugin.research_depth])) {
      throw new Error(`research depth lacks evidence: ${plugin.id}`);
    }
  }
  for (const plugin of plugins.values()) {
    for (const finding of plugin.findings) {
      if (finding.evidence_ids.some((id) => !evidence.has(id))) throw new Error(`unknown evidence reference: ${finding.id}`);
      if (finding.basis !== 'unverified' && !finding.evidence_ids.length) throw new Error(`finding needs evidence: ${finding.id}`);
      for (const dependency of finding.dependencies) {
        if (!plugins.get(dependency.plugin_id)?.fingerprints[dependency.area]) {
          throw new Error(`unknown finding dependency: ${finding.id}`);
        }
      }
      if (finding.status === 'current' && stale(finding, plugins)) throw new Error(`current finding has obsolete dependency: ${finding.id}`);
    }
  }
  for (const run of catalog.runs) {
    for (const change of run.changes) {
      if (!plugins.has(change.plugin_id)) throw new Error(`unknown change target: ${change.plugin_id}`);
    }
  }
};

export const validateObservations = (observations) => {
  schemaCheck(observations, observationsCheck);
  const incoming = indexed(observations.plugins, 'observation');
  for (const plugin of incoming.values()) {
    identity(plugin);
    indexed(plugin.sources, 'source');
    indexed(plugin.evidence, 'evidence');
    indexed(plugin.findings, 'finding');
    if (Date.parse(plugin.last_checked_at) > Date.parse(observations.checked_at)) {
      throw new Error('plugin check is later than batch cutoff');
    }
  }
  return incoming;
};
const mergeImmutable = (oldItems, newItems, label) => {
  const result = indexed(structuredClone(oldItems), label);
  for (const item of newItems) {
    if (result.has(item.id) && !isDeepStrictEqual(result.get(item.id), item)) {
      throw new Error(`${label} is immutable; use a new id: ${item.id}`);
    }
    result.set(item.id, structuredClone(item));
  }
  return [...result.values()];
};
const comparable = (plugin) => Object.fromEntries(
  Object.entries(plugin).filter(([key]) => !['last_checked_at', 'sources', 'findings'].includes(key)),
);

export const plan = (catalog, observations, mode) => {
  if (!['init', 'update'].includes(mode)) throw new Error('mode must be init or update');
  validate(catalog);
  const incoming = validateObservations(observations);
  if (catalog.runs.some((run) => run.id === observations.run_id)) throw new Error('run_id already applied; use a new run id for a new check');
  if (mode === 'init' && (catalog.plugins.length || catalog.runs.length)) throw new Error('init requires an empty catalog; use update for an existing baseline');
  const result = structuredClone(catalog);
  const plugins = indexed(result.plugins, 'plugin');
  const changes = [];
  for (const [key, fresh] of incoming) {
    const old = plugins.get(key);
    if (old && Date.parse(fresh.last_checked_at) < Date.parse(old.last_checked_at)) throw new Error(`observation older than existing check: ${key}`);
    if (old) {
      const merged = structuredClone(fresh);
      merged.sources = mergeImmutable(old.sources, fresh.sources, 'source');
      merged.evidence = mergeImmutable(old.evidence, fresh.evidence, 'evidence');
      const findings = indexed(structuredClone(old.findings), 'finding');
      for (const [id, finding] of indexed(structuredClone(fresh.findings), 'finding')) findings.set(id, finding);
      merged.findings = [...findings.values()];
      const moved = old.repository !== fresh.repository || old.path !== fresh.path;
      merged.aliases = [...new Set([...old.aliases, ...fresh.aliases, ...(moved ? [`${old.repository}/${old.path}`] : [])])].sort();
      merged.fingerprints = { ...old.fingerprints, ...fresh.fingerprints };
      const areas = Object.keys(fresh.fingerprints).filter((area) => old.fingerprints[area] !== fresh.fingerprints[area]).sort();
      if (!isDeepStrictEqual(comparable(old), comparable(merged))) changes.push({ plugin_id: key, kind: 'changed', areas });
      if (!isDeepStrictEqual(old.findings, merged.findings)) changes.push({ plugin_id: key, kind: 'reviewed', areas: [] });
      plugins.set(key, merged);
    } else {
      plugins.set(key, structuredClone(fresh));
      changes.push({ plugin_id: key, kind: 'added', areas: Object.keys(fresh.fingerprints).sort() });
    }
  }
  for (const [key, plugin] of plugins) {
    let invalidated = false;
    for (const finding of plugin.findings) {
      if (stale(finding, plugins)) {
        invalidated ||= finding.status === 'current';
        finding.status = 'needs_review';
      }
    }
    if (invalidated) changes.push({ plugin_id: key, kind: 'review_invalidated', areas: [] });
  }
  result.plugins = [...plugins.values()].sort((a, b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
  result.runs.push({ id: observations.run_id, checked_at: observations.checked_at, mode, changes, errors: observations.errors });
  validate(result);
  return { plan_version: 1, base_digest: digest(catalog), result_digest: digest(result), summary: changes, errors: observations.errors, result };
};

export const atomicWrite = (path, value) => {
  mkdirSync(dirname(path), { recursive: true });
  const temporary = `${path}.${randomUUID()}.tmp`;
  let fd;
  try {
    fd = openSync(temporary, 'wx', 0o600);
    writeFileSync(fd, `${JSON.stringify(value, null, 2)}\n`);
    fsyncSync(fd);
    closeSync(fd);
    fd = undefined;
    renameSync(temporary, path);
  } finally {
    if (fd !== undefined) closeSync(fd);
    if (existsSync(temporary)) unlinkSync(temporary);
  }
};

export const apply = (catalogPath, prepared) => {
  if (prepared?.plan_version !== 1) throw new Error('unsupported plan version');
  const lockPath = `${catalogPath}.lock`;
  // Exclusive creation serializes writers without a native addon. Never steal a lock.
  let lock;
  try {
    lock = openSync(lockPath, 'wx', 0o600);
  } catch (error) {
    if (error.code === 'EEXIST') throw new Error(`catalog is locked: ${lockPath}; verify no writer is active before manual recovery`);
    throw error;
  }
  try {
    writeFileSync(lock, JSON.stringify({ pid: process.pid, created_at: new Date().toISOString() }));
    const current = read(catalogPath);
    if (digest(current) !== prepared.base_digest) throw new Error('catalog changed since planning; regenerate the plan');
    if (digest(prepared.result) !== prepared.result_digest) throw new Error('plan result digest mismatch');
    validate(prepared.result);
    atomicWrite(catalogPath, prepared.result);
  } finally {
    closeSync(lock);
    unlinkSync(lockPath);
  }
};

export const main = (args = process.argv.slice(2)) => {
  const [command, ...rest] = args;
  const allowed = {
    validate: ['catalog', 'observations'],
    plan: ['catalog', 'observations', 'mode', 'out'],
    apply: ['catalog', 'plan'],
  };
  if (!allowed[command]) throw new Error('Usage: plugin-data.mjs validate|plan|apply [options]');
  const { values } = parseArgs({ args: rest, options: Object.fromEntries(allowed[command].map((key) => [key, { type: 'string' }])) });
  const catalogPath = values.catalog ?? resolve(ROOT, 'data/catalog.json');
  const requireOption = (key) => {
    if (!values[key]) throw new Error(`--${key} is required`);
    return values[key];
  };
  if (command === 'validate') {
    validate(read(catalogPath));
    if (values.observations) validateObservations(read(values.observations));
    console.log('Data validation passed');
  } else if (command === 'plan') {
    const prepared = plan(read(catalogPath), read(requireOption('observations')), requireOption('mode'));
    atomicWrite(requireOption('out'), prepared);
    console.log(JSON.stringify({ changes: prepared.summary, errors: prepared.errors }));
  } else {
    apply(catalogPath, read(requireOption('plan')));
    console.log('Plan applied');
  }
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch (error) { console.error(`Error: ${error.message}`); process.exitCode = 1; }
}
