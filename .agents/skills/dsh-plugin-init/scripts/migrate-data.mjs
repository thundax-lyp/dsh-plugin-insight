#!/usr/bin/env node
import { fileURLToPath } from 'node:url';
import { existsSync, readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { resolve, dirname, relative, basename, extname } from 'node:path';
import { createHash } from 'node:crypto';
import { ROOT, read, digest, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { validateSession } from './session-state.mjs';
import { CATALOG, PUBLICATION, REGISTRY, MIGRATION, slug } from '../../_shared/scripts/data-paths.mjs';
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { verifyCleanup } from './maintain-runs.mjs';
const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
        e.isDirectory() ? walk(resolve(dir, e.name)) : [resolve(dir, e.name)]
    );
const readBytes = (p) => readFileSync(resolve(ROOT, p));
export function verifyMigration() {
    const audit = read(resolve(ROOT, MIGRATION));
    const retired = verifyCleanup();
    const storageRetired = new Set(audit.component_storage?.retired ?? []);
    if (storageRetired.size) {
        if (
            audit.component_storage.schema_version !== 3 ||
            [...storageRetired].some(
                (path) =>
                    ![
                        'data/catalog/SNAPSHOT.json',
                        'data/catalog/PLUGINS.json',
                        'data/catalog/PUBLICATION.json',
                        'data/catalog/PLUGIN-PATHS.json'
                    ].includes(path)
            )
        )
            throw Error('invalid component storage retirement audit');
        readSnapshotStorage(resolve(ROOT, 'data/catalog/index.jsonl'));
    }
    for (const record of audit.files) {
        if (!retired.has(record.to) && !storageRetired.has(record.to) && !existsSync(resolve(ROOT, record.to)))
            throw Error(`missing migrated file: ${record.to}`);
        if (sha(readBytes(record.original_copy ?? record.to)) !== record.original_sha256)
            throw Error(`original evidence changed: ${record.from}`);
    }
    console.log(`Migration originals verified: ${audit.files.length}`);
}
export function migrate(apply = false) {
    if (existsSync(resolve(ROOT, MIGRATION))) {
        verifyMigration();
        return;
    }
    const catalog = read(resolve(ROOT, 'data/catalog.json'));
    const registry = Object.fromEntries(
        catalog.plugins.map((p) => [
            p.id,
            `data/plugins/${p.repository.split('/').map(slug).join('--')}${p.component_id === 'root' ? '' : '--' + slug(p.component_id)}`
        ])
    );
    const rounds = {
        '20261019T065545Z-init': '2026-10-19-01',
        '20261019T074011Z-smoke': '2026-10-19-02',
        '20261019T091725Z-init10': '2026-10-19-03'
    };
    const roundOf = (p) => Object.entries(rounds).find(([id]) => p.includes(id))?.[1] ?? '2026-10-19-02';
    const snapshots = resolve(ROOT, 'data/snapshots');
    const temporary = ['20261019-catalog-meta', '20261019-inventory-smoke', '20261019-npm-meta'];
    const files = walk(resolve(ROOT, 'data'))
        .map((p) => relative(ROOT, p).split('\\').join('/'))
        .filter((p) => !temporary.some((d) => p.startsWith('data/snapshots/' + d + '/')));
    const original = new Map(files.map((p) => [p, readBytes(p)]));
    const mapping = {};
    const sessions = [...original].filter(([p]) => p.startsWith('data/sessions/')).map(([p, b]) => [p, JSON.parse(b)]);
    const aliases = {
        invoice: registry['github:1170373459:dsh-invoice-downloader'],
        taskswarm: registry['github:1333800488:root'],
        memory: registry['github:1339316901:root']
    };
    const pluginForName = (name) => {
        for (const p of catalog.plugins) {
            if (name.includes(p.repository.replace('/', '__')) || name.includes(String(p.repository_id)))
                return registry[p.id];
        }
        return (
            Object.entries(aliases).find(([alias]) => new RegExp('(?:^|-)' + alias + '(?:-|\\.|$)').test(name))?.[1] ??
            null
        );
    };
    const latest = new Map();
    for (const [path, s] of sessions.sort((a, b) => a[1].checked_at.localeCompare(b[1].checked_at)))
        for (const i of s.items.filter((x) => x.status === 'complete')) latest.set(i.id, s.id);
    for (const path of files) {
        const name = basename(path),
            run = `data/runs/${roundOf(path)}`;
        let to;
        if (path === 'data/catalog.json') to = CATALOG;
        else if (path === 'data/publications/current.json') to = PUBLICATION;
        else if (path.startsWith('data/sessions/')) to = run + '/SESSION.json';
        else if (path.startsWith('data/observations/'))
            to = run + '/observations/' + (pluginForName(name)?.split('/').at(-1) ?? 'MULTI-PLUGIN') + '.json';
        else if (path.startsWith('data/reports/')) {
            const n = name.replace(/\.md$/, '');
            const directory = pluginForName(n);
            if (n.includes('-category-'))
                to = run + '/views/categories/' + n.split('-category-')[1].toUpperCase() + '.md';
            else if (n.endsWith('-recommendations')) to = run + '/RECOMMENDATIONS.md';
            else if (n.endsWith('-catalog'))
                to =
                    run +
                    '/views/' +
                    (n === '20261019-readme-smoke-catalog' ? 'PUBLICATION-CATALOG' : 'CATALOG') +
                    '.md';
            else if (n.endsWith('-detail') && directory) {
                const plugin = catalog.plugins.find((p) => registry[p.id] === directory);
                to =
                    latest.get(plugin.id) && path.includes(latest.get(plugin.id))
                        ? directory + '/INSIGHT.md'
                        : run + '/views/' + directory.split('/').at(-1) + '.md';
            } else if (directory) to = run + '/insights/' + directory.split('/').at(-1) + '.md';
            else to = run + '/' + (n === '20261019-readme-smoke' ? 'PUBLICATION-REPORT' : 'REPORT') + '.md';
        } else if (path.startsWith('data/snapshots/')) {
            const parts = path.split('/'),
                batch = parts[2];
            const directory = pluginForName(name);
            let leaf = name.replace(/\.json$/, '');
            if (directory) {
                const repo = catalog.plugins.find((p) => registry[p.id] === directory).repository;
                leaf = leaf
                    .replace(repo.replace('/', '__') + '-', '')
                    .replace(/^github-[0-9]+-[a-z0-9-]+$/, 'META')
                    .replace(/^(invoice|taskswarm|memory)-/, '');
            }
            const special = {
                'primary-directory': 'AWESOME-DSH-PLUGIN',
                'secondary-directory': 'AWESOME-DEEPSEEK-HARNESS',
                discovery: 'PLUGIN-CANDIDATES',
                identities: 'REPOSITORY-IDENTITIES'
            };
            leaf = (special[leaf] ?? leaf.toUpperCase()) + '.json';
            const sub = batch.includes('daily-meta')
                ? 'meta-refresh/2026-10-19-01/'
                : batch === '20261019-readme-smoke'
                  ? 'publication/'
                  : '';
            to = run + '/snapshots/' + sub + (directory ? directory.split('/').at(-1) + '/' : '') + leaf;
        } else throw Error(`unclassified file: ${path}`);
        if (Object.values(mapping).includes(to)) throw Error(`path collision: ${path} -> ${to}`);
        mapping[path] = to;
    }
    const bytes = new Map();
    const objects = new Map();
    const mapText = (text) => {
        for (const [from, to] of Object.entries(mapping).sort((a, b) => b[0].length - a[0].length))
            text = text.replaceAll(from, to);
        return text;
    };
    const mapObject = (value) =>
        typeof value === 'string'
            ? (mapping[value] ?? value)
            : Array.isArray(value)
              ? value.map(mapObject)
              : value && typeof value === 'object'
                ? Object.fromEntries(Object.entries(value).map(([k, v]) => [k, k === 'files' ? v : mapObject(v)]))
                : value;
    for (const [path, b] of original) {
        if (extname(path) === '.json') {
            const value = mapObject(JSON.parse(b));
            objects.set(path, value);
            bytes.set(path, Buffer.from(JSON.stringify(value, null, 2) + '\n'));
        } else {
            let text = b.toString('utf8');
            const to = mapping[path];
            text = text.replace(/\]\(([^)]+)\)/g, (all, href) => {
                if (/^(?:[a-z]+:|#|\/)/i.test(href)) return all;
                const [part, ...hash] = href.split('#');
                const target = relative(ROOT, resolve(ROOT, dirname(path), part))
                    .split('\\')
                    .join('/');
                const destination = mapping[target] ?? target;
                return (
                    '](' +
                    relative(dirname(to), destination).split('\\').join('/') +
                    (hash.length ? '#' + hash.join('#') : '') +
                    ')'
                );
            });
            bytes.set(path, Buffer.from(mapText(text)));
        }
    }
    // Rebind checkpoint digests and previous-session chains after path-only rebasing.
    for (let pass = 0; pass < 6; pass++) {
        const hashes = new Map([...objects].map(([p, value]) => [digest(JSON.parse(original.get(p))), digest(value)]));
        let changed = false;
        for (const [path, value] of objects) {
            if (value.items && value.sources) {
                for (const item of value.items) {
                    const cp = item.checkpoint;
                    if (!cp) continue;
                    const op = Object.keys(mapping).find((p) => mapping[p] === cp.observations),
                        rp = Object.keys(mapping).find((p) => mapping[p] === cp.report);
                    if (!op || !rp) throw Error('checkpoint target missing');
                    cp.observations_digest = digest(objects.get(op));
                    cp.report_digest = digest(bytes.get(rp).toString('utf8'));
                }
                const before = JSON.parse(original.get(path)).previous_digest;
                if (before && hashes.has(before)) value.previous_digest = hashes.get(before);
            }
            const next = Buffer.from(JSON.stringify(value, null, 2) + '\n');
            if (!next.equals(bytes.get(path))) {
                bytes.set(path, next);
                changed = true;
            }
        }
        if (!changed) break;
    }
    const pub = objects.get('data/publications/current.json');
    pub.catalog_page = 'data/views/categories/INDEX.md';
    bytes.set('data/publications/current.json', Buffer.from(JSON.stringify(pub, null, 2) + '\n'));
    console.log(
        JSON.stringify({
            files: files.length,
            rounds: Object.values(rounds),
            plugins: Object.keys(registry).length,
            apply
        })
    );
    if (!apply) return;
    const archive = 'data/runs/2026-10-19-03/snapshots/migration-originals';
    const records = [];
    for (const [from, b] of original) {
        const to = mapping[from],
            next = bytes.get(from),
            generated = to.endsWith('/INSIGHT.md');
        const changed = !b.equals(next) || generated;
        const copy = changed ? archive + '/' + from : null;
        if (copy) {
            mkdirSync(dirname(resolve(ROOT, copy)), { recursive: true });
            writeFileSync(resolve(ROOT, copy), b);
        }
        mkdirSync(dirname(resolve(ROOT, to)), { recursive: true });
        writeFileSync(resolve(ROOT, to), next);
        records.push({
            from,
            to,
            original_sha256: sha(b),
            migrated_sha256: sha(next),
            ...(copy ? { original_copy: copy } : {})
        });
    }
    atomicWrite(resolve(ROOT, REGISTRY), registry);
    atomicWrite(resolve(ROOT, MIGRATION), {
        schema_version: 1,
        created_at: new Date().toISOString(),
        kind: 'path-only-rebase',
        rounds,
        files: records
    });
    for (const record of records) rmSync(resolve(ROOT, record.from));
    for (const dir of temporary) {
        const from = resolve(snapshots, dir);
        if (existsSync(from)) {
            const to = resolve(ROOT, 'data/tmp/legacy-experiments', dir);
            mkdirSync(dirname(to), { recursive: true });
            renameSync(from, to);
        }
    }
    for (const dir of ['observations', 'sessions', 'reports', 'publications', 'snapshots']) {
        const path = resolve(ROOT, 'data', dir);
        if (existsSync(path) && !readdirSync(path).length) rmSync(path, { recursive: true });
    }
    for (const [path, value] of objects) if (value.items && value.sources) validateSession(value);
    verifyMigration();
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    if (process.argv.includes('--verify')) verifyMigration();
    else migrate(process.argv.includes('--apply'));
}
