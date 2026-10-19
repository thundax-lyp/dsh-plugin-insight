#!/usr/bin/env node
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { load as loadYaml } from 'js-yaml';
import { CATALOG, slug } from '../../_shared/scripts/data-paths.mjs';
import { resolveRepositoriesAsync } from '../../_shared/scripts/github-batch.mjs';
import { ROOT, atomicWrite, digest, read } from '../../_shared/scripts/plugin-data.mjs';

export const AWESOME_URL = 'https://github.com/awesome-dsh-plugin/awesome-dsh-plugin';
export const HARNESS_URL = 'https://github.com/0xsline/awesome-deepseek-harness';
const sha256 = (value) => createHash('sha256').update(value).digest('hex');

const safePath = (path) => {
    const normalized = path.replace(/^\/+|\/+$/g, '');
    if (normalized.split('/').includes('..') || normalized.includes('\\'))
        throw new Error(`unsafe component path: ${path}`);
    return normalized;
};

export function parseRepositoryUrl(raw) {
    let url;
    try {
        url = new URL(raw);
    } catch {
        return null;
    }
    if (url.protocol !== 'https:' || url.hostname.toLowerCase() !== 'github.com') return null;
    const parts = url.pathname.split('/').filter(Boolean);
    if (parts.length < 2 || !/^[A-Za-z0-9_.-]+$/.test(parts[0]) || !/^[A-Za-z0-9_.-]+(?:\.git)?$/.test(parts[1]))
        return null;
    let path = '';
    if (parts.length > 2) {
        if (parts[2] !== 'tree' || parts.length < 5) return null;
        path = safePath(parts.slice(4).map(decodeURIComponent).join('/'));
    }
    return { repository: `${parts[0]}/${parts[1].replace(/\.git$/i, '')}`, path };
}

const addCandidate = (state, candidate) => {
    const key = `${candidate.repository.toLowerCase()}#${candidate.path}`;
    const current = state.candidates.get(key);
    if (current) {
        current.source_urls = [...new Set([...current.source_urls, ...candidate.source_urls])];
        current.evidence.push(...candidate.evidence);
        return;
    }
    state.candidates.set(key, candidate);
};

export function parseAwesomeSource(root) {
    const state = { candidates: new Map(), problems: [] };
    const directory = resolve(root, 'data/plugins');
    for (const file of readdirSync(directory)
        .filter((name) => name.endsWith('.yml'))
        .sort()) {
        const path = resolve(directory, file);
        const text = readFileSync(path, 'utf8');
        let document;
        try {
            document = loadYaml(text);
        } catch (error) {
            state.problems.push({
                source: AWESOME_URL,
                path: `data/plugins/${file}`,
                reason: `invalid YAML: ${error.message}`
            });
            continue;
        }
        const parsed = parseRepositoryUrl(document?.url);
        if (!parsed) {
            state.problems.push({
                source: AWESOME_URL,
                path: `data/plugins/${file}`,
                reason: 'missing or unsupported url'
            });
            continue;
        }
        addCandidate(state, {
            ...parsed,
            display_name:
                typeof document.name === 'string' && document.name.trim()
                    ? document.name.trim()
                    : basename(file, '.yml'),
            source_urls: [AWESOME_URL],
            evidence: [{ source: AWESOME_URL, path: `data/plugins/${file}`, sha256: sha256(text) }]
        });
    }
    return state;
}

const markdownCandidate = (state, url, displayName, file, line, text, path = undefined) => {
    const parsed = parseRepositoryUrl(url);
    if (!parsed) {
        state.problems.push({ source: HARNESS_URL, path: `${file}:${line}`, reason: 'unsupported GitHub entry URL' });
        return;
    }
    if (path !== undefined) parsed.path = safePath(path);
    addCandidate(state, {
        ...parsed,
        display_name: displayName,
        source_urls: [HARNESS_URL],
        evidence: [{ source: HARNESS_URL, path: `${file}:${line}`, sha256: sha256(text) }]
    });
};

export function parseHarnessSource(root) {
    const state = { candidates: new Map(), problems: [] };
    for (const file of ['README.md', 'CATALOG.md']) {
        const lines = readFileSync(resolve(root, file), 'utf8').split(/\r?\n/);
        let readmeEntries = file !== 'README.md';
        lines.forEach((line, index) => {
            if (file === 'README.md' && /^##\s+Core & Bundles\s*$/.test(line)) readmeEntries = true;
            if (file === 'README.md' && /^##\s+Related\s*$/.test(line)) readmeEntries = false;
            const row =
                file === 'CATALOG.md'
                    ? line.match(/^\|\s*\[([^\]]+)\]\((https:\/\/github\.com\/[^)]+)\)\s*\|/)
                    : readmeEntries
                      ? line.match(/^-\s+\[([^\]]+)\]\((https:\/\/github\.com\/[^)]+)\)\s+[—-]\s+/)
                      : null;
            if (row) markdownCandidate(state, row[2], row[1], file, index + 1, line);
            for (const match of line.matchAll(/github:([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+)#HEAD&path:\/([^`\s]+)/g)) {
                const label = line.match(/^\|\s*`([^`]+)`/)?.[1] ?? match[3].split('/').filter(Boolean).at(-1);
                markdownCandidate(
                    state,
                    `https://github.com/${match[1]}/${match[2]}`,
                    label,
                    file,
                    index + 1,
                    line,
                    match[3]
                );
            }
        });
    }
    return state;
}

const knownComponents = (catalog) =>
    new Map(catalog.plugins.map((plugin) => [`${plugin.repository_id}:${plugin.path}`, plugin.component_id]));

const newComponentId = (path) => {
    if (!path) return 'root';
    return slug(
        path
            .split('/')
            .filter((part) => part !== '.dsh-plugin')
            .join('-')
    );
};

export async function buildResearchInput({
    id,
    checkedAt,
    awesome,
    harness,
    catalog,
    completeAwesome,
    completeHarness,
    resolveRepositories = resolveRepositoriesAsync
}) {
    if (!/^[A-Za-z0-9_-]+$/.test(id)) throw new Error('id must contain only letters, numbers, underscore or hyphen');
    if (!Number.isFinite(Date.parse(checkedAt))) throw new Error('checked-at must be an ISO date-time');
    const parsed = [
        { source: AWESOME_URL, complete: completeAwesome, ...parseAwesomeSource(awesome) },
        { source: HARNESS_URL, complete: completeHarness, ...parseHarnessSource(harness) }
    ];
    const combined = new Map();
    for (const source of parsed)
        for (const candidate of source.candidates.values()) addCandidate({ candidates: combined }, candidate);
    const repositories = [...new Set([...combined.values()].map((candidate) => candidate.repository))];
    const metadata = await resolveRepositories(repositories);
    const identities = knownComponents(catalog);
    const problems = parsed.flatMap((source) => source.problems);
    const items = new Map();
    for (const candidate of combined.values()) {
        const meta = metadata.get(candidate.repository.toLowerCase());
        if (!meta) {
            problems.push({
                sources: candidate.source_urls,
                repository: candidate.repository,
                path: candidate.path,
                reason: 'repository identity or default branch unavailable'
            });
            continue;
        }
        const componentId = identities.get(`${meta.repository_id}:${candidate.path}`) ?? newComponentId(candidate.path);
        if (!componentId) {
            problems.push({
                sources: candidate.source_urls,
                repository: meta.repository,
                path: candidate.path,
                reason: 'empty component id'
            });
            continue;
        }
        const pluginId = `github:${meta.repository_id}:${componentId}`;
        const existing = items.get(pluginId);
        const next = {
            id: pluginId,
            repository: meta.repository,
            path: candidate.path,
            revision: meta.revision,
            source_urls: [...new Set(candidate.source_urls)],
            evidence: [...candidate.evidence],
            metadata: meta
        };
        if (existing) {
            if (existing.path !== next.path) {
                problems.push({
                    sources: next.source_urls,
                    repository: meta.repository,
                    path: next.path,
                    id: pluginId,
                    reason: 'component id collision'
                });
                continue;
            }
            existing.source_urls = [...new Set([...existing.source_urls, ...next.source_urls])];
            existing.evidence.push(...candidate.evidence);
        } else items.set(pluginId, next);
    }
    const plugins = [...items.values()].map(({ evidence, metadata: meta, ...item }) => ({
        ...item,
        fingerprints: {
            directory: digest(evidence.sort((a, b) => `${a.source}:${a.path}`.localeCompare(`${b.source}:${b.path}`))),
            code: meta.revision,
            maintenance: digest({ archived: meta.archived, disabled: meta.disabled, pushed_at: meta.pushed_at })
        }
    }));
    const sources = parsed.map((source) => ({
        url: source.source,
        revision: source.source === AWESOME_URL ? gitRevision(awesome) : gitRevision(harness),
        complete:
            source.complete &&
            !problems.some((problem) => problem.source === source.source || problem.sources?.includes(source.source))
    }));
    return {
        input: { id, checked_at: checkedAt, sources, plugins },
        problems: {
            generated_at: checkedAt,
            candidates: combined.size,
            verified_components: items.size,
            problems
        }
    };
}

function gitRevision(path) {
    if (!existsSync(resolve(path, '.git'))) throw new Error(`source is not a Git checkout: ${path}`);
    return execFileSync('git', ['-C', path, 'rev-parse', 'HEAD'], { encoding: 'utf8', timeout: 30_000 }).trim();
}

export async function main(args = process.argv.slice(2)) {
    const { values } = parseArgs({
        args,
        options: {
            'source-awesome': { type: 'string' },
            'source-harness': { type: 'string' },
            id: { type: 'string' },
            'checked-at': { type: 'string' },
            catalog: { type: 'string' },
            out: { type: 'string' },
            problems: { type: 'string' },
            'complete-awesome': { type: 'boolean', default: false },
            'complete-harness': { type: 'boolean', default: false }
        }
    });
    const required = (key) => {
        if (!values[key]) throw new Error(`--${key} is required`);
        return values[key];
    };
    const awesome = resolve(required('source-awesome'));
    const harness = resolve(required('source-harness'));
    const catalogPath = resolve(values.catalog ?? resolve(ROOT, CATALOG));
    const result = await buildResearchInput({
        id: required('id'),
        checkedAt: required('checked-at'),
        awesome,
        harness,
        catalog: read(catalogPath),
        completeAwesome: values['complete-awesome'],
        completeHarness: values['complete-harness']
    });
    atomicWrite(resolve(required('out')), result.input);
    atomicWrite(resolve(required('problems')), result.problems);
    console.log(
        JSON.stringify({
            candidates: result.problems.candidates,
            verified_components: result.problems.verified_components,
            problems: result.problems.problems.length,
            sources: result.input.sources
        })
    );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        await main();
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}
