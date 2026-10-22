#!/usr/bin/env node
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { read, atomicWrite, ROOT } from '../../_shared/scripts/plugin-data.mjs';
import { pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { selectedItems } from './research-session.mjs';
const execute = promisify(execFile);
const run = async (command, args, options = {}) =>
    (await execute(command, args, { encoding: 'utf8', timeout: 180_000, maxBuffer: 32 * 1024 * 1024, ...options }))
        .stdout;
const node = (script, args) => run(process.execPath, [resolve(ROOT, script), ...args]);
const pool = async (items, fn) => {
    let cursor = 0;
    await Promise.all(
        Array.from({ length: Math.min(4, items.length) }, async () => {
            while (cursor < items.length) await fn(items[cursor++]);
        })
    );
};
export async function prepareSelected(workPath) {
    const work = readWork(resolve(workPath)),
        folder = resolve(workPath, '..');
    const items = selectedItems(work.session).filter((i) => i.status === 'pending');
    const checkouts = new Map(),
        errors = [];
    for (const item of items)
        checkouts.set(item.repository, {
            item,
            path: resolve(ROOT, `data/checkouts/${item.id.split(':')[1]}-${item.revision}`)
        });
    await pool([...checkouts.values()], async ({ item, path }) => {
        try {
            if (!item.revision) throw Error('no pinned revision');
            if (!existsSync(resolve(path, '.git'))) {
                mkdirSync(path, { recursive: true });
                await run('git', ['init', path]);
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
            if (head !== item.revision) {
                await run('git', ['-C', path, 'fetch', '--depth', '1', 'origin', item.revision]);
                await run('git', ['-C', path, 'checkout', '--detach', item.revision]);
            }
            if ((await run('git', ['-C', path, 'status', '--porcelain'])).trim()) throw Error('checkout is dirty');
        } catch (e) {
            errors.push({ repository: item.repository, phase: 'checkout', message: e.message });
        }
    });
    await pool(items, async (item) => {
        const checkout = checkouts.get(item.repository).path;
        const slug = basename(pluginDirectory({ ...item, component_id: item.id.split(':')[2] }, ROOT));
        const directory = resolve(folder, 'snapshots', slug);
        mkdirSync(directory, { recursive: true });
        try {
            if (errors.some((e) => e.repository === item.repository && e.phase === 'checkout')) return;
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
            await node('.agents/skills/dsh-plugin-insight/scripts/capture-plugin-meta.mjs', [
                item.repository,
                '--out',
                resolve(directory, 'META.json'),
                ...(typeof packageName === 'string' ? ['--npm', packageName] : [])
            ]);
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
            console.log(`Prepared ${item.id} ${item.repository} ${item.path}`);
        } catch (e) {
            errors.push({ plugin_id: item.id, repository: item.repository, phase: 'materials', message: e.message });
            console.error(`Preparation failed ${item.id}: ${e.message}`);
        }
    });
    atomicWrite(resolve(folder, 'PREPARATION.json'), {
        checked_at: new Date().toISOString(),
        selected: items.length,
        errors
    });
    return errors;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    try {
        const { values } = parseArgs({ options: { work: { type: 'string' } } });
        if (!values.work) throw Error('--work required');
        const errors = await prepareSelected(values.work);
        if (errors.length) process.exitCode = 1;
    } catch (e) {
        console.error(e.message);
        process.exitCode = 1;
    }
