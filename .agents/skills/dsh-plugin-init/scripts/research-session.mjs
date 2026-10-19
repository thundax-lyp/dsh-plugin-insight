#!/usr/bin/env node
import { existsSync, readFileSync, openSync, closeSync, unlinkSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, relative, isAbsolute, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read, digest, atomicWrite, validate as validateCatalog, validateObservations } from '../../_shared/scripts/plugin-data.mjs';
const ajv = new Ajv({ allErrors: true, strict: true });
addFormats(ajv);
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/research-session.schema.json'));
const check = ajv.compile(schema);
export function validateSession(session, root = ROOT) {
  if (!check(session)) throw new Error(ajv.errorsText(check.errors));
  if (session.research_limit !== undefined && (session.selected_ids.length !== Math.min(session.research_limit, session.items.length) || session.selected_ids.some((id, index) => session.items[index]?.id !== id))) throw new Error("invalid research selection");
  const ids = new Set();
  const urls = new Set(session.sources.map(s => s.url));
  if (urls.size !== session.sources.length) throw new Error('duplicate source');
  for (const item of session.items) {
    if (ids.has(item.id)) throw new Error('duplicate plugin');
    ids.add(item.id);
    if (item.path.startsWith('/') || item.path.split('/').includes('..')) throw new Error('unsafe component path');
    if (item.source_urls.some(url => !urls.has(url))) throw new Error('unknown source');
    if (item.status === 'complete') {
      const obs = read(artifact(root, item.checkpoint.observations));
      validateObservations(obs);
      if (digest(obs) !== item.checkpoint.observations_digest || obs.run_id !== item.checkpoint.run_id) throw new Error('checkpoint observations changed');
      const plugin = obs.plugins.find(p => p.id === item.id);
      if (!plugin || plugin.repository !== item.repository || plugin.path !== item.path || !plugin.evidence.some(e => e.kind === 'source_inspection' && e.revision === item.revision)) throw new Error('checkpoint identity or revision differs');
      const report = readFileSync(artifact(root, item.checkpoint.report), 'utf8');
      if (!report.trim() || digest(report) !== item.checkpoint.report_digest) throw new Error('checkpoint report changed');
    }
  }
  return session;
}
function artifact(root, name) {
  const path = resolve(root, name);
  if (isAbsolute(name) || relative(root, path).startsWith('..')) throw new Error('artifact must be inside project');
  if (!existsSync(path)) throw new Error(`missing artifact: ${name}`);
  return path;
}
export function startSession(input, previous = null, limit = undefined) {
  if (limit !== undefined && (!Number.isSafeInteger(limit) || limit < 1)) throw new Error("limit must be a positive safe integer");
  const session = { schema_version: 1, id: input.id, checked_at: input.checked_at, sources: input.sources, previous_digest: previous ? digest(previous) : null, items: input.plugins.map(p => ({ ...p, changes: ['unknown'], status: 'pending' })) };
  // Validate before comparing; no duplicate identity may be silently collapsed.
  validateSession(session);
  if (previous) {
    validateSession(previous);
    if (previous.id === session.id || Date.parse(previous.checked_at) >= Date.parse(session.checked_at)) throw new Error('new round needs a new id and later cutoff');
  }
  const old = new Map((previous?.items ?? []).map(p => [p.id, p]));
  const compareFields = ['repository', 'path', 'revision', 'fingerprints', 'source_urls'];
  for (const item of session.items) {
    item.changes = [];
    const before = old.get(item.id);
    if (!before) item.changes = ['added'];
    else {
      if (before.repository !== item.repository || before.path !== item.path) item.changes.push('moved');
      if (!item.revision || !before.revision) item.changes.push('unknown');
      else if (before.revision !== item.revision || digest(before.fingerprints) !== digest(item.fingerprints)) item.changes.push('content_changed');
      if (digest([...before.source_urls].sort()) !== digest([...item.source_urls].sort())) item.changes.push('sources_changed');
      if (!item.changes.length) item.changes.push('unchanged');
    }
    old.delete(item.id);
  }
  const sources = new Map(session.sources.map(s => [s.url, s]));
  for (const before of old.values()) {
    const removed = before.source_urls.every(url => sources.get(url)?.complete === true);
    // Keep provenance for absent candidates, without claiming an unqueried source was checked.
    for (const url of before.source_urls) if (!sources.has(url)) {
      const source = { url, revision: null, complete: false };
      session.sources.push(source); sources.set(url, source);
    }
    session.items.push({ ...Object.fromEntries(['id', ...compareFields].map(key => [key, before[key]])), changes: [removed ? 'removed_from_source' : 'unknown'], status: 'pending' });
  }
  if (limit !== undefined) {
    session.research_limit = limit;
    session.selected_ids = session.items.slice(0, limit).map(item => item.id);
  }
  return validateSession(session);
}
export function selectedItems(session) {
  return session.items.filter(item => !session.selected_ids || session.selected_ids.includes(item.id));
}
export function completeItem(session, id, obsPath, reportPath, catalog, root = ROOT) {
  validateSession(session, root); validateCatalog(catalog);
  const item = session.items.find(p => p.id === id);
  if (!item || !selectedItems(session).includes(item) || item.status === 'complete') throw new Error('item missing or already complete');
  const obs = read(artifact(root, obsPath)); validateObservations(obs);
  const plugin = obs.plugins.find(p => p.id === id);
  const run = catalog.runs.find(r => r.id === obs.run_id);
  if (!plugin || !run || !catalog.plugins.some(p => p.id === id)) throw new Error('apply observations before checkpoint');
  // A run ID alone is not proof that this exact batch was applied.
  if (run.checked_at !== obs.checked_at || digest(run.errors) !== digest(obs.errors)) throw new Error('applied run differs');
  const current = catalog.plugins.find(p => p.id === id);
  if (plugin.repository !== item.repository || plugin.path !== item.path || ['sources', 'evidence'].some(key => plugin[key].some(value => !current[key].some(saved => digest(saved) === digest(value))))) throw new Error('applied artifacts or component differ');
  if (plugin.last_checked_at !== current.last_checked_at || Object.entries(plugin.fingerprints).some(([k,v]) => current.fingerprints[k] !== v)) throw new Error('catalog does not match observations');
  if (Date.parse(plugin.last_checked_at) < Date.parse(session.checked_at) || !plugin.findings.length || plugin.findings.some(f => Date.parse(f.reviewed_at) < Date.parse(session.checked_at) || !current.findings.some(c => digest(c) === digest(f)))) throw new Error('fresh analysis required for every round');
  if (!item.revision || !plugin.evidence.some(e => e.kind === 'source_inspection' && e.revision === item.revision)) throw new Error('analysis must match pinned revision');
  for (const e of plugin.evidence) if (e.artifact) artifact(root, e.artifact);
  const report = readFileSync(artifact(root, reportPath), 'utf8');
  if (!report.trim()) throw new Error('report is empty');
  item.status = 'complete'; delete item.reason;
  item.checkpoint = { observations: obsPath, observations_digest: digest(obs), report: reportPath, report_digest: digest(report), run_id: obs.run_id };
  return validateSession(session, root);
}
export function saveSession(path, action) {
  mkdirSync(dirname(path), { recursive: true });
  const lock = `${path}.lock`;
  const fd = openSync(lock, 'wx', 0o600);
  try { writeFileSync(fd, JSON.stringify({ pid: process.pid })); const value = action(); atomicWrite(path, value); return value; }
  finally { closeSync(fd); unlinkSync(lock); }
}
export function main(args = process.argv.slice(2)) {
  const [command, ...rest] = args;
  const { values: v } = parseArgs({ args: rest, options: Object.fromEntries(['input','previous','session','plugin','observations','report','catalog','out','reason','limit'].map(k => [k,{type:'string'}])) });
  const need = key => { if (!v[key]) throw new Error(`--${key} required`); return v[key]; };
  if (command === 'start') {
    const path = need('out');
    saveSession(path, () => { if (existsSync(path)) throw new Error('session exists; resume it or choose new id'); return startSession(read(need('input')), v.previous ? read(v.previous) : null, v.limit === undefined ? undefined : (/^[1-9][0-9]*$/.test(v.limit) ? Number(v.limit) : NaN)); });
  } else if (['next','validate'].includes(command)) {
    const s = validateSession(read(need('session')));
    const selected = selectedItems(s);
    console.log(JSON.stringify(command === 'next' ? { next: selected.find(p => p.status === 'pending') ?? null, complete: selected.filter(p => p.status === 'complete').length, blocked: selected.filter(p => p.status === 'blocked').length, total: selected.length, listed: s.items.length, deferred: s.items.length - selected.length } : { valid: true }));
  } else if (command === 'checkpoint' || command === 'block' || command === 'retry') {
    saveSession(need('session'), () => {
      const s = validateSession(read(v.session));
      if (command === 'checkpoint') return completeItem(s, need('plugin'), need('observations'), need('report'), read(v.catalog ?? resolve(ROOT,'data/catalog.json')));
      const item = s.items.find(p => p.id === need('plugin'));
      if (!item || !selectedItems(s).includes(item) || item.status === 'complete') throw new Error('item missing or already complete');
      item.status = command === 'block' ? 'blocked' : 'pending';
      if (command === 'block') item.reason = need('reason'); else delete item.reason;
      return validateSession(s);
    });
  } else throw new Error('Usage: research-session.mjs start|next|checkpoint|block|retry|validate');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { main(); } catch(e) { console.error(e.message); process.exitCode = 1; }
}
