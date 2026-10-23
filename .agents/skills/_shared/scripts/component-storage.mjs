import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    renameSync,
    rmSync,
    realpathSync,
    openSync,
    closeSync,
    fsyncSync,
    readdirSync,
    rmdirSync
} from 'node:fs';
import { dirname, resolve, relative, basename } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { ROOT, read, digest } from './plugin-data.mjs';
import Ajv from 'ajv/dist/2020.js';
import { readSnapshotStorage as readLegacy } from './legacy-snapshot-storage.mjs';
import {
    hydrateComponentStorage as hydrateV3,
    componentIndex as indexV3,
    componentId,
    componentFile as fileV3
} from './component-storage-v3.mjs';
export { componentId };
const sha = (text) => createHash('sha256').update(text).digest('hex');
const json = (value) => JSON.stringify(value, null, 4) + '\n';
const sections = {
    'catalog.plugins': 'array',
    'publication.records': 'array',
    'publication.metadata': 'map',
    'publication.summaries': 'map',
    'publication.capabilities': 'map',
    'publication.advice': 'map',
    registry: 'map',
    reports: 'map',
    retained_documents: 'map'
};
const get = (obj, path) => path.split('.').reduce((v, k) => v?.[k], obj);
const set = (obj, path, value) => {
    const keys = path.split('.');
    keys.slice(0, -1).reduce((v, k) => v[k], obj)[keys.at(-1)] = value;
};
export function componentFile(slug) {
    if (!/^[a-z0-9][a-z0-9._-]*$/.test(slug) || slug.includes('..')) throw Error('invalid component slug');
    return `${slug}/research.json`;
}
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/component-storage.schema.json'));
const ajv = new Ajv({ strict: true, allErrors: true });
const validators = Object.fromEntries(
    ['index', 'detail', 'state'].map((key) => [key, ajv.compile({ ...schema, $ref: `#/$defs/${key}` })])
);
function checked(key, value) {
    if (!validators[key](value)) throw Error(ajv.errorsText(validators[key].errors));
    return value;
}
// The logical compatibility view contains only completed research baselines.
// New directory scans belong to INPUT/WORK, never to a current research record.
export function normalizeCatalogSnapshot(value) {
    const snapshot = structuredClone(value);
    const records = new Map(snapshot.publication.records.map((r) => [r.id, r]));
    snapshot.discovery = {
        sources: structuredClone(snapshot.discovery.sources),
        complete_baseline: false,
        plugins: snapshot.catalog.plugins
            .filter((plugin) => records.has(plugin.id))
            .map((plugin) => {
                const record = records.get(plugin.id);
                return {
                    id: plugin.id,
                    repository: plugin.repository,
                    path: plugin.path,
                    revision: plugin.fingerprints.code ?? null,
                    fingerprints: structuredClone(plugin.fingerprints),
                    source_urls: record?.source_urls ?? [
                        ...new Set(
                            plugin.sources
                                .map((s) => s.url)
                                .filter((url) => snapshot.discovery.sources.some((s) => s.url === url))
                        )
                    ]
                };
            })
    };
    for (const [id] of Object.entries(snapshot.publication.metadata))
        snapshot.publication.metadata[id] = `data/catalog/${basename(snapshot.registry[id])}/meta.json`;
    return snapshot;
}
export function componentIndex(detail, checksum, metaChecksum) {
    return { ...indexV3(detail, checksum), slug: detail.slug, meta_sha256: metaChecksum };
}
export function hydrateComponentStorage(indexText, load) {
    const state = load('state.json');
    if (state.schema_version === 3) return hydrateV3(indexText, load);
    checked('state', state);
    if (state.index_sha256 !== sha(indexText) || !indexText.endsWith('\n')) throw Error('catalog state/index mismatch');
    const rows = (indexText === '\n' ? [] : indexText.slice(0, -1).split('\n')).map((line) => {
        const row = checked('index', JSON.parse(line));
        if (JSON.stringify(row) !== line) throw Error('index row must be compact JSON');
        return row;
    });
    const snapshot = structuredClone(state.head),
        details = new Map(),
        artifacts = new Map(),
        unavailable = new Set();
    for (const [name, kind] of Object.entries(sections)) {
        const value = get(snapshot, name);
        if (value === undefined) continue;
        if (kind === 'array' ? !Array.isArray(value) || value.length : !value || Object.keys(value).length)
            throw Error(`state must not duplicate component data: ${name}`);
    }
    if (
        Object.keys(snapshot.metadata).length ||
        Object.keys(snapshot.artifacts).length ||
        snapshot.discovery.plugins.length
    )
        throw Error('state must not duplicate META, evidence or scan candidates');
    let previous = '';
    const slugs = new Set();
    for (const row of rows) {
        if (row.id <= previous || componentId(row.identity) !== row.id || slugs.has(row.slug))
            throw Error('catalog identity/order/slug mismatch');
        previous = row.id;
        slugs.add(row.slug);
        const text = load(componentFile(row.slug), true),
            metaText = load(`${row.slug}/meta.json`, true);
        if (sha(text) !== row.sha256 || sha(metaText) !== row.meta_sha256)
            throw Error(`component checksum mismatch: ${row.slug}`);
        const detail = checked('detail', JSON.parse(text)),
            meta = JSON.parse(metaText);
        if (json(detail) !== text || json(meta) !== metaText) throw Error(`component formatting mismatch: ${row.slug}`);
        if (
            detail.id !== row.id ||
            detail.identity !== row.identity ||
            detail.slug !== row.slug ||
            detail.data.registry !== `data/plugins/${row.slug}` ||
            digest(componentIndex(detail, row.sha256, row.meta_sha256)) !== digest(row)
        )
            throw Error(`component index differs: ${row.slug}`);
        if (detail.data['catalog.plugins'].id !== row.identity) throw Error('component payload identity mismatch');
        details.set(row.identity, detail);
        if (meta !== null) snapshot.metadata[row.identity] = meta;
        const required = new Set(detail.data['catalog.plugins'].evidence.map((e) => e.artifact).filter(Boolean));
        for (const name of required) {
            if (!detail.artifacts[name] && !detail.unavailable_artifacts.includes(name))
                throw Error(`component is not self-contained: ${row.slug}/${name}`);
        }
        for (const name of detail.unavailable_artifacts) {
            if (!required.has(name) || Object.hasOwn(detail.artifacts, name))
                throw Error('invalid missing evidence declaration');
            unavailable.add(name);
        }
        for (const [name, artifact] of Object.entries(detail.artifacts)) {
            if (!required.has(name) || sha(artifact.content) !== artifact.sha256)
                throw Error('invalid embedded evidence');
            if (artifacts.has(name) && digest(artifacts.get(name)) !== digest(artifact))
                throw Error('conflicting evidence label');
            artifacts.set(name, artifact);
        }
    }
    const used = new Set();
    for (const [name, order] of Object.entries(state.orders)) {
        if (!Object.hasOwn(sections, name) || new Set(order).size !== order.length)
            throw Error('invalid section order');
        const entries = order.map((id) => {
            const detail = details.get(id);
            if (!detail || !Object.hasOwn(detail.data, name)) throw Error(`missing component section: ${id}/${name}`);
            if (sections[name] === 'array' && detail.data[name].id !== id) throw Error('section identity differs');
            used.add(`${id}\n${name}`);
            return [id, detail.data[name]];
        });
        set(snapshot, name, sections[name] === 'array' ? entries.map(([, v]) => v) : Object.fromEntries(entries));
    }
    for (const [id, detail] of details)
        for (const name of Object.keys(detail.data))
            if (!used.has(`${id}\n${name}`)) throw Error('unreferenced component section');
    if (state.metadata_order.length !== Object.keys(snapshot.metadata).length)
        throw Error('unreferenced component META');
    if (digest([...unavailable].sort()) !== digest([...snapshot.unavailable_artifacts].sort()))
        throw Error('missing evidence declarations differ');
    snapshot.metadata = Object.fromEntries(
        state.metadata_order.map((id) => {
            if (!Object.hasOwn(snapshot.metadata, id)) throw Error('missing component META');
            return [id, snapshot.metadata[id]];
        })
    );
    if (state.artifact_order.length !== artifacts.size) throw Error('evidence order differs');
    snapshot.artifacts = Object.fromEntries(
        state.artifact_order.map((name) => {
            if (!artifacts.has(name)) throw Error(`missing embedded evidence: ${name}`);
            return [name, artifacts.get(name)];
        })
    );
    const result = normalizeCatalogSnapshot(snapshot);
    if (digest(result) !== state.snapshot_digest) throw Error('catalog semantic digest mismatch');
    return result;
}
function safePath(folder, name) {
    const full = resolve(folder, name),
        rel = relative(folder, full);
    if (!rel || rel.startsWith('..') || rel.startsWith('/')) throw Error('catalog path escapes root');
    let parent = full;
    while (!existsSync(parent)) parent = dirname(parent);
    const actual = relative(realpathSync(folder), realpathSync(parent));
    if (actual.startsWith('..') || actual.startsWith('/')) throw Error('catalog symlink escapes root');
    return full;
}
export function readSnapshotStorage(path) {
    if (!path.endsWith('.jsonl')) return readLegacy(path);
    const folder = dirname(resolve(path)),
        journal = resolve(folder, '.transaction');
    if (existsSync(journal))
        throw Error('catalog transaction interrupted or active; recover-storage after checking writer');
    const text = readFileSync(path, 'utf8');
    const result = hydrateComponentStorage(text, (name, raw) =>
        raw ? readFileSync(safePath(folder, name), 'utf8') : read(safePath(folder, name))
    );
    if (existsSync(journal) || readFileSync(path, 'utf8') !== text) throw Error('catalog changed while reading; retry');
    return result;
}
function syncedWrite(path, text) {
    const fd = openSync(path, 'wx', 0o600);
    try {
        writeFileSync(fd, text);
        fsyncSync(fd);
    } finally {
        closeSync(fd);
    }
}
function replace(path, text) {
    mkdirSync(dirname(path), { recursive: true });
    const temp = path + `.${randomUUID()}.tmp`;
    try {
        syncedWrite(temp, text);
        renameSync(temp, path);
    } finally {
        rmSync(temp, { force: true });
    }
}
// Caller holds index.jsonl.lock. Every file change/deletion has a durable preimage.
export function writeSnapshotStorage(path, snapshot) {
    if (!path.endsWith('/index.jsonl') || snapshot.schema_version !== 1)
        throw Error('expected catalog/index.jsonl and logical snapshot');
    if (!existsSync(path + '.lock')) throw Error('catalog writer requires index.jsonl.lock');
    if (digest(snapshot) !== digest(normalizeCatalogSnapshot(snapshot)))
        throw Error('scan candidates cannot enter formal catalog; normalize first');
    const folder = dirname(resolve(path)),
        transaction = resolve(folder, '.transaction');
    if (existsSync(transaction)) throw Error('catalog transaction requires recovery');
    const head = structuredClone(snapshot),
        orders = {},
        details = new Map(),
        files = new Map();
    for (const [name, kind] of Object.entries(sections)) {
        const value = get(snapshot, name);
        if (value === undefined) continue;
        const entries = kind === 'array' ? value.map((v) => [v.id, v]) : Object.entries(value);
        orders[name] = entries.map(([id]) => id);
        for (const [identity, data] of entries) {
            if (!details.has(identity)) {
                const slug = basename(snapshot.registry[identity] ?? '');
                componentFile(slug);
                details.set(identity, {
                    schema_version: 4,
                    id: componentId(identity),
                    identity,
                    slug,
                    data: {},
                    artifacts: {},
                    unavailable_artifacts: []
                });
            }
            details.get(identity).data[name] = data;
        }
        set(head, name, kind === 'array' ? [] : {});
    }
    const owned = new Set();
    const rows = [...details.values()]
        .map((detail) => {
            const plugin = detail.data['catalog.plugins'];
            if (!plugin) throw Error('only researched components belong in catalog');
            for (const name of new Set(plugin.evidence.map((e) => e.artifact).filter(Boolean))) {
                if (snapshot.artifacts[name]) {
                    detail.artifacts[name] = snapshot.artifacts[name];
                    owned.add(name);
                } else if (snapshot.unavailable_artifacts.includes(name)) detail.unavailable_artifacts.push(name);
                else throw Error(`missing evidence: ${name}`);
            }
            checked('detail', detail);
            const text = json(detail),
                metaText = json(snapshot.metadata[detail.identity] ?? null);
            files.set(componentFile(detail.slug), text);
            files.set(`${detail.slug}/meta.json`, metaText);
            return checked('index', componentIndex(detail, sha(text), sha(metaText)));
        })
        .sort((a, b) => a.id.localeCompare(b.id));
    if (owned.size !== Object.keys(snapshot.artifacts).length) throw Error('unowned evidence cannot be discarded');
    if (new Set(rows.map((r) => r.slug)).size !== rows.length) throw Error('component slug collision');
    head.metadata = {};
    head.artifacts = {};
    head.discovery.plugins = [];
    const index = rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
    files.set(
        'state.json',
        json({
            schema_version: 4,
            snapshot_digest: digest(snapshot),
            index_sha256: sha(index),
            head,
            orders,
            metadata_order: Object.keys(snapshot.metadata),
            artifact_order: Object.keys(snapshot.artifacts)
        })
    );
    files.set('index.jsonl', index);
    hydrateComponentStorage(index, (name, raw) => (raw ? files.get(name) : JSON.parse(files.get(name))));
    const obsolete = new Set();
    if (existsSync(path)) {
        const previousState = read(resolve(folder, 'state.json'));
        for (const line of readFileSync(path, 'utf8').trimEnd().split('\n').filter(Boolean)) {
            const row = JSON.parse(line);
            if (previousState.schema_version === 3) obsolete.add(fileV3(row.id));
            else {
                obsolete.add(componentFile(row.slug));
                obsolete.add(`${row.slug}/meta.json`);
            }
        }
        if (previousState.schema_version === 3)
            for (const ref of Object.values(previousState.artifacts)) obsolete.add(ref.path);
    }
    const changed = [...files].filter(
        ([name, text]) => !existsSync(safePath(folder, name)) || readFileSync(safePath(folder, name), 'utf8') !== text
    );
    changed.push(...[...obsolete].filter((name) => !files.has(name)).map((name) => [name, null]));
    if (!changed.length) return { status: 'unchanged', components: rows.length };
    mkdirSync(transaction);
    try {
        const entries = changed.map(([name], i) => {
            const full = safePath(folder, name),
                existed = existsSync(full);
            if (existed) syncedWrite(resolve(transaction, String(i)), readFileSync(full));
            return { name, existed, backup: String(i) };
        });
        replace(resolve(transaction, 'UNDO.json'), json(entries));
        for (const [name, text] of changed) {
            if (text === null) rmSync(safePath(folder, name));
            else replace(safePath(folder, name), text);
        }
        const result = hydrateComponentStorage(readFileSync(path, 'utf8'), (name, raw) =>
            raw ? readFileSync(safePath(folder, name), 'utf8') : read(safePath(folder, name))
        );
        if (digest(result) !== digest(snapshot)) throw Error('catalog write readback mismatch');
        rmSync(transaction, { recursive: true });
    } catch (error) {
        recoverSnapshotStorage(path);
        throw error;
    }
    return { status: 'written', components: rows.length };
}
export function recoverSnapshotStorage(path) {
    const folder = dirname(resolve(path)),
        transaction = resolve(folder, '.transaction');
    if (!existsSync(transaction)) return 'no_transaction';
    const manifest = resolve(transaction, 'UNDO.json');
    if (existsSync(manifest))
        for (const entry of read(manifest)) {
            if (!/^[0-9]+$/.test(entry.backup) || typeof entry.existed !== 'boolean')
                throw Error('invalid catalog undo entry');
            const full = safePath(folder, entry.name);
            if (entry.existed) replace(full, readFileSync(resolve(transaction, entry.backup)));
            else rmSync(full, { force: true });
        }
    rmSync(transaction, { recursive: true });
    return 'rolled_back';
}
export function migrateSnapshotStorage(path, backup) {
    if (read(resolve(dirname(path), 'state.json')).schema_version === 4)
        return { status: 'already_migrated', digest: digest(readSnapshotStorage(path)) };
    if (!backup || existsSync(backup)) throw Error('migration requires a new backup directory');
    const folder = dirname(resolve(path)),
        destination = resolve(backup);
    const backupRelative = relative(folder, destination);
    if (backupRelative !== '..' && !backupRelative.startsWith('../'))
        throw Error('backup must be outside formal catalog');
    // Save original physical bytes, including uncommitted current records, before replacing v3.
    mkdirSync(destination, { recursive: true });
    const originals = new Set(['index.jsonl', 'state.json']);
    const oldState = read(resolve(folder, 'state.json'));
    for (const line of readFileSync(path, 'utf8').trimEnd().split('\n').filter(Boolean))
        originals.add(fileV3(JSON.parse(line).id));
    for (const ref of Object.values(oldState.artifacts)) originals.add(ref.path);
    for (const name of originals) {
        const target = resolve(destination, name);
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, readFileSync(safePath(folder, name)), { flag: 'wx' });
    }
    const before = readSnapshotStorage(path),
        after = normalizeCatalogSnapshot(before);
    for (const plugin of after.catalog.plugins) {
        const identity = plugin.id;
        if (after.reports[identity] || after.publication.records.some((r) => r.id === identity)) continue;
        const publishedPath = `${after.registry[identity]}/INSIGHT.md`;
        const source = resolve(folder, '../..', publishedPath);
        if (!existsSync(source)) continue;
        const content = readFileSync(source, 'utf8');
        (after.retained_documents ??= {})[identity] = {
            path: publishedPath,
            content,
            sha256: sha(content),
            reason: '迁移原样保留已有稿件；缺少当前原稿与有效发布记录，不恢复研究有效性或推荐。'
        };
        const target = resolve(destination, 'retained-documents', basename(after.registry[identity]), 'INSIGHT.md');
        mkdirSync(dirname(target), { recursive: true });
        writeFileSync(target, readFileSync(source), { flag: 'wx' });
    }
    writeSnapshotStorage(path, after);
    const result = readSnapshotStorage(path);
    for (const name of [
        'catalog',
        'reports',
        'metadata',
        'artifacts',
        'unavailable_artifacts',
        'registry',
        'research_blocks'
    ])
        if (digest(before[name]) !== digest(result[name])) throw Error(`migration changed research: ${name}`);
    // Remove only empty retired directories; preserve every unknown file.
    const removeEmpty = (directory) => {
        if (!existsSync(directory)) return;
        for (const entry of readdirSync(directory, { withFileTypes: true }))
            if (entry.isDirectory()) removeEmpty(resolve(directory, entry.name));
        if (!readdirSync(directory).length) rmdirSync(directory);
    };
    for (const name of ['components', 'evidence']) removeEmpty(resolve(folder, name));
    return {
        status: 'migrated',
        backup,
        components: result.catalog.plugins.length,
        before_digest: digest(before),
        digest: digest(result),
        scan_candidates_removed: before.discovery.plugins.length,
        preserved: [
            'catalog',
            'reports',
            'metadata',
            'artifacts',
            'unavailable_artifacts',
            'registry',
            'research_blocks'
        ]
    };
}

// Rebuild the derived index from authoritative slug directories; keep state ordering.
export function reindexSnapshotStorage(path) {
    if (!existsSync(path + '.lock')) throw Error('catalog writer requires index.jsonl.lock');
    const folder = dirname(resolve(path)),
        transaction = resolve(folder, '.transaction');
    if (existsSync(transaction)) throw Error('catalog transaction requires recovery');
    const state = checked('state', read(resolve(folder, 'state.json')));
    const rows = [];
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
        if (!entry.isDirectory() || !existsSync(resolve(folder, entry.name, 'research.json'))) continue;
        const name = componentFile(entry.name),
            text = readFileSync(safePath(folder, name), 'utf8');
        const detail = checked('detail', JSON.parse(text));
        const meta = readFileSync(safePath(folder, `${entry.name}/meta.json`), 'utf8');
        rows.push(componentIndex(detail, sha(text), sha(meta)));
    }
    rows.sort((a, b) => a.id.localeCompare(b.id));
    const index = rows.map((r) => JSON.stringify(r)).join('\n') + '\n';
    state.index_sha256 = sha(index);
    const stateText = json(state);
    const load = (name, raw) => {
        if (name === 'state.json') return state;
        return raw ? readFileSync(safePath(folder, name), 'utf8') : read(safePath(folder, name));
    };
    hydrateComponentStorage(index, load);
    const changed = [
        ['state.json', stateText],
        ['index.jsonl', index]
    ].filter(
        ([name, text]) => !existsSync(resolve(folder, name)) || readFileSync(resolve(folder, name), 'utf8') !== text
    );
    if (!changed.length) return { status: 'unchanged', components: rows.length };
    mkdirSync(transaction);
    try {
        const entries = changed.map(([name], i) => {
            const full = safePath(folder, name),
                existed = existsSync(full);
            if (existed) syncedWrite(resolve(transaction, String(i)), readFileSync(full));
            return { name, existed, backup: String(i) };
        });
        replace(resolve(transaction, 'UNDO.json'), json(entries));
        for (const [name, text] of changed) replace(safePath(folder, name), text);
        hydrateComponentStorage(readFileSync(path, 'utf8'), load);
        rmSync(transaction, { recursive: true });
    } catch (error) {
        recoverSnapshotStorage(path);
        throw error;
    }
    return { status: 'rebuilt', components: rows.length };
}
