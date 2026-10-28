#!/usr/bin/env node
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import {
    existsSync,
    mkdirSync,
    readFileSync,
    writeFileSync,
    appendFileSync,
    openSync,
    closeSync,
    unlinkSync
} from 'node:fs';
import { resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { read, atomicWrite, digest, ROOT } from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory, researchDataDirectory } from '../../_shared/scripts/data-paths.mjs';
import { selectedItems } from './session-state.mjs';
import {
    captureNpmDownloads,
    captureNpmPublication,
    readNpmMetaCache,
    resolveNpmMetadata
} from '../../_shared/scripts/npm-meta.mjs';
import { validateMetadata } from '../../_shared/scripts/metadata-validation.mjs';

import { readGitMetaCache, gitCacheSnapshot } from '../../_shared/scripts/github-meta.mjs';
import { spawn } from 'node:child_process';

// Kill the whole process group: a material subprocess can itself be waiting on Git.
export function runPreparationCommand(command, args, { timeout = 180_000, ...options } = {}) {
    return new Promise((accept, reject) => {
        let timedOut = false,
            overflow = false,
            size = 0;
        const stdout = [],
            stderr = [];
        const child = spawn(command, args, {
            detached: process.platform !== 'win32',
            stdio: ['ignore', 'pipe', 'pipe'],
            ...options
        });
        const stop = () => {
            try {
                if (process.platform !== 'win32') process.kill(-child.pid, 'SIGKILL');
                else child.kill('SIGKILL');
            } catch (error) {
                if (error.code !== 'ESRCH') child.kill('SIGKILL');
            }
        };
        const collect = (chunks) => (chunk) => {
            size += chunk.length;
            if (size > 32 * 1024 * 1024) {
                overflow = true;
                stop();
            } else chunks.push(chunk);
        };
        child.stdout.on('data', collect(stdout));
        child.stderr.on('data', collect(stderr));
        const timer = setTimeout(() => {
            timedOut = true;
            stop();
        }, timeout);
        child.on('error', (error) => {
            clearTimeout(timer);
            reject(error);
        });
        child.on('close', (code, signal) => {
            clearTimeout(timer);
            const out = Buffer.concat(stdout).toString('utf8'),
                err = Buffer.concat(stderr).toString('utf8');
            if (code === 0 && !timedOut && !overflow) accept(out);
            else
                reject(
                    Object.assign(
                        Error(
                            `Command failed: ${command} ${args.join(' ')}${timedOut ? ' (timeout)' : overflow ? ' (output limit)' : ''}\n${err}`
                        ),
                        {
                            code,
                            signal,
                            killed: timedOut || overflow,
                            timed_out: timedOut,
                            stdout: out,
                            stderr: err
                        }
                    )
                );
        });
    });
}

const run = runPreparationCommand;
const succeeds = async (command, args, options = {}) => {
    try {
        await run(command, args, options);
        return true;
    } catch {
        return false;
    }
};
const pool = async (items, fn) => {
    let cursor = 0;
    await Promise.all(
        Array.from({ length: Math.min(4, items.length) }, async () => {
            while (cursor < items.length) await fn(items[cursor++]);
        })
    );
};
export async function restoreEolOnlyCheckout(path) {
    const status = (await run('git', ['-C', path, 'status', '--porcelain'])).trimEnd();
    if (
        !status ||
        !status.split('\n').every((line) => line.startsWith(' M ')) ||
        !(await succeeds('git', ['-C', path, 'diff', '--quiet', '--ignore-cr-at-eol', '--']))
    )
        return false;
    await run('git', ['-C', path, 'restore', '--source', 'HEAD', '--worktree', '--', '.']);
    return true;
}
export async function prepareSelected(workPath, options = {}) {
    const lock = resolve(workPath, '..', 'PREPARATION.lock');
    const fd = openSync(lock, 'wx');
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid, started_at: new Date().toISOString() }));
        return await prepareSelectedUnlocked(workPath, options);
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}
async function prepareSelectedUnlocked(
    workPath,
    {
        executeCommand = runPreparationCommand,
        downloads = captureNpmDownloads,
        publication = captureNpmPublication,
        metaCache = readNpmMetaCache,
        gitMetaCache = readGitMetaCache,
        at = new Date().toISOString(),
        pluginIds = null
    } = {}
) {
    const run = executeCommand;
    const work = readWork(resolve(workPath)),
        folder = resolve(workPath, '..');
    const selected = selectedItems(work.session);
    if (
        pluginIds &&
        (!pluginIds.length ||
            new Set(pluginIds).size !== pluginIds.length ||
            pluginIds.some((id) => !selected.some((item) => item.id === id)))
    )
        throw Error('materials require distinct selected plugin IDs');
    const binding = digest({
        session: work.session.id,
        checked_at: work.session.checked_at,
        input_digest: work.input_digest,
        selected: selected.map(({ id, revision, repository, path }) => ({ id, revision, repository, path }))
    });
    const statePath = resolve(folder, 'PREPARATION-STATE.json');
    const state = existsSync(statePath) ? read(statePath) : { binding, completed: {}, meta_sources: {} };
    if (state.binding !== binding) throw Error('preparation selection changed; use the original WORK');
    const items = selected.filter((i) => i.status === 'pending' && (!pluginIds || pluginIds.includes(i.id)));
    const checkouts = new Map(),
        errors = [];
    const logPath = resolve(folder, 'PREPARATION-ATTEMPTS.jsonl');
    const log = (entry) => appendFileSync(logPath, JSON.stringify({ at: new Date().toISOString(), ...entry }) + '\n');
    const previousSummary = resolve(folder, 'PREPARATION.json');
    if (!existsSync(logPath) && existsSync(previousSummary))
        log({ event: 'legacy_summary', summary: read(previousSummary) });
    const save = () => atomicWrite(statePath, state);
    const command = async (repository, phase, executable, args) => {
        const started = Date.now();
        log({ repository, phase, event: 'started', command: executable, args });
        try {
            const output = await run(executable, args, { env: { ...process.env, GIT_TERMINAL_PROMPT: '0' } });
            log({ repository, phase, event: 'completed', elapsed_ms: Date.now() - started });
            return output;
        } catch (e) {
            log({
                repository,
                phase,
                event: 'failed',
                elapsed_ms: Date.now() - started,
                command: executable,
                args,
                message: e.message,
                code: e.code ?? null,
                signal: e.signal ?? null,
                killed: e.killed ?? false,
                timed_out: e.timed_out ?? false,
                stdout: e.stdout ?? '',
                stderr: e.stderr ?? ''
            });
            throw e;
        }
    };
    const cachesPath = resolve(folder, 'PREPARATION-CACHES.json');
    const frozen = existsSync(cachesPath) ? read(cachesPath) : null;
    if (frozen && frozen.binding !== binding) throw Error('preparation cache selection changed');
    const thaw = (entry) =>
        entry
            ? { ...entry, records: new Map(entry.records), ...(entry.errors ? { errors: new Map(entry.errors) } : {}) }
            : null;
    const [npmResult, gitResult] = await Promise.allSettled([
        frozen
            ? frozen.npm_error
                ? Promise.reject(Error(frozen.npm_error))
                : Promise.resolve(thaw(frozen.npm))
            : Promise.resolve().then(metaCache),
        frozen
            ? frozen.git_error
                ? Promise.reject(Error(frozen.git_error))
                : Promise.resolve(thaw(frozen.git))
            : Promise.resolve().then(gitMetaCache)
    ]);
    const metaCacheError = npmResult.status === 'rejected' ? npmResult.reason.message : null;
    const cache =
        npmResult.status === 'fulfilled'
            ? npmResult.value
            : { records: new Map(), repository: null, branch: null, path: null, blob_sha: null };
    const gitCacheError = gitResult.status === 'rejected' ? gitResult.reason.message : null;
    const gitCache = gitResult.status === 'fulfilled' ? gitResult.value : null;
    const freeze = (entry) =>
        entry
            ? {
                  ...entry,
                  records: [...entry.records],
                  ...(entry.errors instanceof Map ? { errors: [...entry.errors] } : {})
              }
            : null;
    if (!frozen)
        atomicWrite(cachesPath, {
            binding,
            at,
            npm: freeze(cache),
            git: freeze(gitCache),
            npm_error: metaCacheError,
            git_error: gitCacheError
        });
    at = frozen?.at ?? at;
    const gitCacheFile = resolve(folder, 'GIT-META-CACHE.json');
    if (gitCache) atomicWrite(gitCacheFile, gitCacheSnapshot(gitCache));
    const metaSources = [];
    for (const item of items)
        checkouts.set(`${item.repository}@${item.revision}`, {
            item,
            path: resolve(researchDataDirectory(ROOT), `checkouts/${item.id.split(':')[1]}-${item.revision}`)
        });
    const prepareCheckout = async ({ item, path }) => {
        const git = (args) => command(item.repository, 'checkout', 'git', ['-C', path, ...args]);
        try {
            if (!item.revision) throw Error('no pinned revision');
            if (!existsSync(resolve(path, '.git'))) {
                mkdirSync(path, { recursive: true });
                await command(item.repository, 'init', 'git', ['init', path]);
                await run('git', ['-C', path, 'remote', 'add', 'origin', `https://github.com/${item.repository}.git`]);
            }
            // Material checkouts must expose the exact committed bytes. Repository attributes such as
            // `text eol=crlf` can otherwise make a mixed-EOL blob dirty immediately after checkout.
            mkdirSync(resolve(path, '.git/info'), { recursive: true });
            writeFileSync(resolve(path, '.git/info/attributes'), '* -text\n');
            await run('git', ['-C', path, 'config', 'core.autocrlf', 'false']);
            let head = '';
            try {
                head = (await run('git', ['-C', path, 'rev-parse', 'HEAD'])).trim();
            } catch {}
            if (head && (await run('git', ['-C', path, 'status', '--porcelain'])).trim()) {
                if (!(await restoreEolOnlyCheckout(path))) throw Error('checkout is dirty; refusing to overwrite');
            }
            await git(['config', 'http.version', 'HTTP/1.1']);
            await git(['config', 'http.lowSpeedLimit', '1024']);
            await git(['config', 'http.lowSpeedTime', '30']);
            if (head !== item.revision) {
                let failure;
                for (let attempt = 1; attempt <= 2; attempt++) {
                    try {
                        await git(['fetch', '--filter=blob:none', '--depth', '1', 'origin', item.revision]);
                        await git([
                            'sparse-checkout',
                            'set',
                            '--no-cone',
                            '*.md',
                            '*.json',
                            '*.js',
                            '*.mjs',
                            '*.cjs',
                            '*.ts',
                            '*.mts',
                            '*.cts',
                            '*.tsx',
                            '*.jsx',
                            '*.vue',
                            '*.css',
                            '*.html',
                            '*.yml',
                            '*.yaml',
                            '*.toml',
                            '*.sh',
                            '*.py',
                            '*.rs',
                            'LICENSE*'
                        ]);
                        await git(['checkout', '--detach', item.revision]);
                        failure = null;
                        break;
                    } catch (e) {
                        failure = e;
                    }
                }
                if (failure) throw failure;
            } else await restoreEolOnlyCheckout(path);
            if ((await git(['rev-parse', 'HEAD'])).trim() !== item.revision) throw Error('checkout revision mismatch');
            if ((await run('git', ['-C', path, 'status', '--porcelain'])).trim()) throw Error('checkout is dirty');
        } catch (e) {
            errors.push({
                repository: item.repository,
                revision: item.revision,
                phase: 'checkout',
                message: e.message
            });
            log({
                repository: item.repository,
                phase: 'checkout',
                event: 'failed',
                message: e.message,
                code: e.code ?? null,
                signal: e.signal ?? null,
                timed_out: e.timed_out ?? false,
                stdout: e.stdout ?? '',
                stderr: e.stderr ?? ''
            });
            return false;
        }
        return true;
    };
    const prepareItem = async (item, checkout) => {
        const slug = basename(pluginDirectory({ ...item, component_id: item.id.split(':')[2] }, ROOT));
        const directory = resolve(folder, slug);
        mkdirSync(directory, { recursive: true });
        try {
            const outputs = ['INVENTORY.json', 'MATERIALS.json', 'META.json', 'SOURCE.json'];
            const hashes = () =>
                Object.fromEntries(
                    outputs.map((name) => [name, digest(readFileSync(resolve(directory, name), 'utf8'))])
                );
            if (
                state.completed[item.id] &&
                outputs.every((name) => existsSync(resolve(directory, name))) &&
                digest(hashes()) === digest(state.completed[item.id])
            ) {
                if (state.meta_sources[item.id]) metaSources.push(state.meta_sources[item.id]);
                console.log(`Reused ${item.id}`);
                return;
            }
            const node = (script, args) =>
                command(item.repository, 'materials', process.execPath, [resolve(ROOT, script), ...args]);
            const inventoryPath = resolve(directory, 'INVENTORY.json');
            await node('.agents/skills/dsh-plugin-insight/scripts/plugin-inventory.mjs', [
                '--root',
                checkout,
                '--ref',
                item.revision,
                ...(item.path ? ['--component', item.path] : []),
                '--out',
                inventoryPath
            ]);
            await node('.agents/skills/dsh-plugin-insight/scripts/prepare-plugin-materials.mjs', [
                '--session',
                resolve(folder, 'SESSION.json'),
                '--plugin',
                item.id,
                '--checkout',
                checkout,
                '--inventory',
                inventoryPath,
                '--out',
                resolve(directory, 'MATERIALS.json')
            ]);
            const packagePath = resolve(checkout, item.path, 'package.json');
            let packageName;
            if (existsSync(packagePath))
                try {
                    const pkg = JSON.parse(readFileSync(packagePath, 'utf8'));
                    packageName =
                        !pkg.private &&
                        typeof pkg.name === 'string' &&
                        /^(?:@[a-z0-9._-]+\/)?[a-z0-9._-]+$/.test(pkg.name)
                            ? pkg.name
                            : undefined;
                } catch {}
            const metadataPath = resolve(directory, 'META.json');
            await node('.agents/skills/dsh-plugin-insight/scripts/capture-plugin-meta.mjs', [
                item.repository,
                '--out',
                metadataPath,
                '--repository-id',
                item.id.split(':')[1],
                '--at',
                at,
                ...(gitCache ? ['--git-cache-file', gitCacheFile] : ['--skip-git-cache'])
            ]);
            const pluginMetadata = validateMetadata(read(metadataPath));
            const sources = {
                plugin_id: item.id,
                github: 'repository',
                git_stars: pluginMetadata.git_cache
                    ? 'github-meta'
                    : pluginMetadata.stars === null
                      ? null
                      : 'github-api',
                git_archived: pluginMetadata.git_cache
                    ? 'github-meta'
                    : pluginMetadata.archived === undefined
                      ? null
                      : 'github-api',
                npm_downloads: null,
                npm_publication: null
            };
            if (typeof packageName === 'string') {
                const resolved = await resolveNpmMetadata(packageName, cache.records.get(packageName), {
                    downloads,
                    publication,
                    at
                });
                pluginMetadata.npm = resolved.npm;
                sources.npm_downloads = resolved.downloads_source;
                sources.npm_publication = resolved.publication_source;
            }
            validateMetadata(pluginMetadata);
            atomicWrite(metadataPath, pluginMetadata);
            state.meta_sources[item.id] = sources;
            metaSources.push(sources);
            const inventory = read(inventoryPath);
            const files = [];
            let bytes = 0;
            // Mechanical source material only: no findings, scores or reports are generated here.
            const paths = [
                ...new Set([
                    'README.md',
                    'package.json',
                    ...inventory.files.filter((f) => f.role === 'source').map((f) => f.path)
                ])
            ];
            for (const name of paths) {
                const file = resolve(checkout, name);
                if (!file.startsWith(checkout + '/') || !existsSync(file)) continue;
                let content;
                try {
                    content = readFileSync(file, 'utf8');
                } catch {
                    continue;
                }
                if (
                    content.includes('\0') ||
                    Buffer.byteLength(content) > 256 * 1024 ||
                    bytes + Buffer.byteLength(content) > 2 * 1024 * 1024
                )
                    continue;
                files.push({ path: name, content });
                bytes += Buffer.byteLength(content);
            }
            atomicWrite(resolve(directory, 'SOURCE.json'), {
                repository: item.repository,
                revision: item.revision,
                component: item.path,
                coverage: 'bounded source material; see included paths and INVENTORY.json for full static scope',
                files
            });
            state.completed[item.id] = hashes();
            save();
            console.log(`Prepared ${item.id} ${item.repository} ${item.path}`);
        } catch (e) {
            errors.push({ plugin_id: item.id, repository: item.repository, phase: 'materials', message: e.message });
            delete state.completed[item.id];
            save();
            log({
                plugin_id: item.id,
                repository: item.repository,
                phase: 'materials',
                event: 'failed',
                message: e.message,
                code: e.code ?? null,
                signal: e.signal ?? null,
                timed_out: e.timed_out ?? false,
                stdout: e.stdout ?? '',
                stderr: e.stderr ?? ''
            });
            console.error(`Preparation failed ${item.id}: ${e.message}`);
        }
    };
    // A ready repository produces materials immediately, without a round-wide download barrier.
    await pool([...checkouts.values()], async (entry) => {
        if (!(await prepareCheckout(entry))) return;
        for (const item of items.filter(
            (i) => i.repository === entry.item.repository && i.revision === entry.item.revision
        ))
            await prepareItem(item, entry.path);
    });
    atomicWrite(resolve(folder, 'PREPARATION.json'), {
        checked_at: at,
        selected: items.length,
        attempts_log: relative(folder, logPath),
        checkpoint: relative(folder, statePath),
        meta_cache: {
            repository: cache.repository,
            branch: cache.branch,
            path: cache.path,
            blob_sha: cache.blob_sha,
            records: cache.records.size,
            error: metaCacheError
        },
        git_meta_cache: {
            repository: gitCache?.repository ?? null,
            path: gitCache?.path ?? null,
            commit_sha: gitCache?.commit_sha ?? null,
            blob_sha: gitCache?.blob_sha ?? null,
            errors_blob_sha: gitCache?.errors_blob_sha ?? null,
            records: gitCache?.records.size ?? 0,
            error: gitCacheError
        },
        meta_sources: metaSources.sort((left, right) => left.plugin_id.localeCompare(right.plugin_id)),
        errors
    });
    return errors;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        const { values } = parseArgs({
            options: { work: { type: 'string' }, plugin: { type: 'string', multiple: true } }
        });
        if (!values.work) throw Error('--work required');
        const errors = await prepareSelected(values.work, { pluginIds: values.plugin ?? null });
        if (errors.length) process.exitCode = 1;
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
