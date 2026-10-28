#!/usr/bin/env node
import {
    realpathSync,
    readFileSync,
    existsSync,
    mkdirSync,
    openSync,
    writeFileSync,
    closeSync,
    unlinkSync
} from 'node:fs';
import { basename, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT, read, digest, atomicWrite } from '../../_shared/scripts/plugin-data.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { captureHeat } from '../../_shared/scripts/research-metrics.mjs';
import { buildResearchInput } from './build-research-input.mjs';
import { readSnapshot, validateWork } from './snapshot-state.mjs';
import { startWork } from './research-work.mjs';
import { selectedItems } from './session-state.mjs';
import { prepareSelected } from './prepare-selected.mjs';
import { pluginDirectory } from '../../_shared/scripts/data-paths.mjs';

export async function prepareResearch(input, context = {}) {
    const root = context.root ?? ROOT;
    if (typeof input.workPath !== 'string') throw Error('workPath required');
    const work = resolve(root, input.workPath);
    if (!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/WORK\.json$/.test(relative(root, work).split('\\').join('/')))
        throw Error('work must be data/runs/<round>/WORK.json');
    mkdirSync(dirname(work), { recursive: true });
    const lock = resolve(dirname(work), 'ROUND-PREPARATION.lock');
    const fd = openSync(lock, 'wx');
    try {
        writeFileSync(fd, JSON.stringify({ pid: process.pid }));
        return await prepareResearchUnlocked(input, context);
    } finally {
        closeSync(fd);
        unlinkSync(lock);
    }
}

async function prepareResearchUnlocked(
    { workPath, inputPath, sources, id, checkedAt, limit, retryIds = [], pluginIds = null, materialsOnly = false },
    { root = ROOT, buildInput = buildResearchInput, metrics = captureHeat, prepare = prepareSelected } = {}
) {
    const workFile = resolve(root, workPath);
    if (!/^data\/runs\/\d{4}-\d{2}-\d{2}-\d{2,}\/WORK\.json$/.test(relative(root, workFile).split('\\').join('/')))
        throw Error('work must be data/runs/<round>/WORK.json');
    const resume = existsSync(workFile),
        folder = dirname(workFile);
    if (!resume && (materialsOnly || pluginIds)) throw Error('materials require an existing fixed WORK');
    if (resume && (inputPath || sources || id || checkedAt || limit !== undefined || retryIds.length))
        throw Error('resume accepts the fixed WORK only; do not replace its input or selection');
    const inputFile = resolve(folder, 'INPUT.json'),
        problemsFile = resolve(folder, 'INPUT-PROBLEMS.json');
    let work;
    if (resume) {
        work = validateWork(readWork(workFile), root);
        const snapshot = readSnapshot(root);
        if (snapshot.transaction?.id === work.session.id) throw Error('round already merged; create a new round');
        if (work.base_digest !== digest(snapshot)) throw Error('snapshot baseline changed; resolve before resuming');
    } else {
        if (inputPath && (sources || id || checkedAt)) throw Error('INPUT already binds sources, id and checked-at');
        if (limit !== undefined && (!Number.isSafeInteger(limit) || limit <= 0))
            throw Error('limit must be a positive integer');
        const snapshot = readSnapshot(root);
        let input;
        if (inputPath) input = read(resolve(root, inputPath));
        else {
            if (!sources?.awesome || !sources?.harness || !id || !checkedAt)
                throw Error('new round requires fixed sources, id and checked-at, or --input');
            if (existsSync(inputFile) || existsSync(problemsFile))
                throw Error('round input exists; use --input to reuse it instead of overwriting');
            const result = await buildInput({
                id,
                checkedAt,
                awesome: sources.awesome,
                harness: sources.harness,
                completeAwesome: sources.completeAwesome,
                completeHarness: sources.completeHarness,
                catalog: snapshot.catalog
            });
            input = result.input;
            atomicWrite(problemsFile, result.problems);
        }
        if (existsSync(inputFile) && digest(read(inputFile)) !== digest(input)) throw Error('fixed INPUT differs');
        if (!existsSync(inputFile)) atomicWrite(inputFile, input);
        const items = [
            ...new Map([...snapshot.catalog.plugins, ...input.plugins].map((item) => [item.id, item])).values()
        ];
        const heat = {
            ...(await metrics({ items, metadata: snapshot.metadata, checked_at: input.checked_at })),
            base_digest: digest(snapshot)
        };
        work = startWork(input, workFile, limit ?? 40, root, retryIds, heat);
    }
    const requested = selectedItems(work.session).filter((item) => !pluginIds || pluginIds.includes(item.id));
    if (
        pluginIds &&
        (!pluginIds.length || new Set(pluginIds).size !== pluginIds.length || requested.length !== pluginIds.length)
    )
        throw Error('materials require distinct selected plugin IDs');
    const errors = [...(await prepare(workFile, { pluginIds }))];
    const stateFile = resolve(folder, 'PREPARATION-STATE.json');
    const state = existsSync(stateFile) ? read(stateFile) : { completed: {} };
    const materials = [];
    for (const item of requested.filter((item) => item.status === 'pending')) {
        if (errors.some((error) => error.plugin_id === item.id || error.repository === item.repository)) continue;
        const directory = resolve(
            folder,
            basename(pluginDirectory({ ...item, component_id: item.id.split(':')[2] }, root))
        );
        const outputs = ['INVENTORY.json', 'MATERIALS.json', 'META.json', 'SOURCE.json'];
        if (
            !state.completed[item.id] ||
            !outputs.every(
                (name) =>
                    existsSync(resolve(directory, name)) &&
                    digest(readFileSync(resolve(directory, name), 'utf8')) === state.completed[item.id][name]
            )
        ) {
            errors.push({ plugin_id: item.id, phase: 'materials', message: 'material package incomplete or changed' });
            continue;
        }
        materials.push({
            id: item.id,
            files: Object.fromEntries(outputs.map((name) => [name, relative(root, resolve(directory, name))]))
        });
    }
    const heat = work.session.selection?.heat;
    const rows = heat ? Object.values(heat.rows) : null;
    const resultFile = resolve(folder, 'RESEARCH-PREPARATION.json');
    const result = {
        result: relative(root, resultFile),
        selection_summary: {
            listed: work.session.items.length,
            selected: work.session.selected_ids.length,
            suppressed: work.session.selection?.suppressed_ids?.length ?? 0,
            cooldown_skipped:
                work.session.selection?.cooldown_ids?.filter(
                    (id) =>
                        !work.session.selected_ids.includes(id) && !work.session.selection?.suppressed_ids?.includes(id)
                ).length ?? 0,
            coverage: rows
                ? {
                      candidates: rows.length,
                      stars: rows.filter((row) => row.stars !== null).length,
                      downloads: rows.filter((row) => row.downloads_30d !== null).length,
                      both: rows.filter((row) => row.stars !== null && row.downloads_30d !== null).length
                  }
                : null,
            metric_errors: heat?.sources.errors ?? null
        },
        status: errors.length ? 'preparation_failed' : 'prepared',
        resumed: resume,
        work: relative(root, workFile),
        input: relative(root, inputFile),
        problems: existsSync(problemsFile) ? relative(root, problemsFile) : null,
        preparation: relative(root, resolve(folder, 'PREPARATION.json')),
        selected_ids: [...work.session.selected_ids],
        requested_ids: requested.map((item) => item.id),
        materials,
        pending_ids: selectedItems(work.session)
            .filter((item) => item.status === 'pending')
            .map((item) => item.id),
        errors
    };
    atomicWrite(resultFile, result);
    return result;
}

if (
    process.argv[1] &&
    existsSync(process.argv[1]) &&
    realpathSync(process.argv[1]) === realpathSync(fileURLToPath(import.meta.url))
) {
    try {
        const { values: v } = parseArgs({
            options: {
                work: { type: 'string' },
                input: { type: 'string' },
                id: { type: 'string' },
                plugin: { type: 'string', multiple: true },
                'materials-only': { type: 'boolean', default: false },
                'checked-at': { type: 'string' },
                limit: { type: 'string' },
                'source-awesome': { type: 'string' },
                'source-harness': { type: 'string' },
                'complete-awesome': { type: 'boolean', default: false },
                'complete-harness': { type: 'boolean', default: false },
                'retry-plugin': { type: 'string', multiple: true }
            }
        });
        if (!v.work) throw Error('--work required');
        if ((v['complete-awesome'] || v['complete-harness']) && (!v['source-awesome'] || !v['source-harness']))
            throw Error('source completeness requires both fixed sources');
        const result = await prepareResearch({
            workPath: v.work,
            inputPath: v.input,
            id: v.id,
            checkedAt: v['checked-at'],
            limit: v.limit === undefined ? undefined : Number(v.limit),
            retryIds: v['retry-plugin'] ?? [],
            pluginIds: v.plugin ?? null,
            materialsOnly: v['materials-only'],
            sources:
                v['source-awesome'] || v['source-harness']
                    ? {
                          awesome: v['source-awesome'] && resolve(v['source-awesome']),
                          harness: v['source-harness'] && resolve(v['source-harness']),
                          completeAwesome: v['complete-awesome'],
                          completeHarness: v['complete-harness']
                      }
                    : undefined
        });
        console.log(JSON.stringify(result));
        if (result.errors.length) process.exitCode = 1;
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
