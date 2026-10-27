#!/usr/bin/env node
import { existsSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { createHash } from 'node:crypto';
import Ajv from 'ajv/dist/2020.js';
import { ROOT, read, digest, atomicWrite, validateObservations } from '../../_shared/scripts/plugin-data.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { validateDisplay } from '../../_shared/scripts/publication-validation.mjs';
import { validateResearchQuestionArtifact } from '../../dsh-plugin-insight/scripts/research-questions.mjs';
import { validateWork, stageRecords } from './snapshot-data.mjs';
import { selectedItems } from './research-session.mjs';

const sha = (bytes) => createHash('sha256').update(bytes).digest('hex');
const ajv = new Ajv({ strict: true, allErrors: true });
const schema = read(resolve(ROOT, '.agents/skills/_shared/schemas/research-acceptance.schema.json'));
const validators = Object.fromEntries(
    ['bundle', 'reviews', 'submission'].map((name) => [name, ajv.compile({ ...schema, $ref: `#/$defs/${name}` })])
);
function shape(name, value) {
    if (!validators[name](value)) throw Error(`${name}: ${ajv.errorsText(validators[name].errors)}`);
    return value;
}
function inside(root, name, folder = false) {
    const file = resolve(root, name),
        rel = relative(realpathSync(root), realpathSync(file));
    if (isAbsolute(rel) || rel === '..' || rel.startsWith('../')) throw Error('acceptance path escapes project');
    if (folder ? !statSync(file).isDirectory() : !statSync(file).isFile())
        throw Error('unexpected acceptance path type');
    return file;
}
const reference = (root, name) => {
    const file = inside(root, name);
    return { path: relative(root, file).split('\\').join('/'), sha256: sha(readFileSync(file)) };
};
const sameSet = (a, b) => a.length === new Set(a).size && digest([...a].sort()) === digest([...b].sort());
function currentWork(path, root) {
    const work = validateWork(readWork(inside(root, path)), root);
    return { work, workPath: relative(root, resolve(root, path)).split('\\').join('/') };
}
function inspect(work, entry, root) {
    const item = work.session.items.find((p) => p.id === entry.id);
    if (!item || !selectedItems(work.session).some((p) => p.id === entry.id))
        throw Error('acceptance requires a selected item');
    if (!['pending', 'complete'].includes(item.status)) throw Error('item is not available for acceptance');
    const observations = read(inside(root, entry.observations)),
        report = readFileSync(inside(root, entry.report), 'utf8'),
        display = read(inside(root, entry.display));
    validateObservations(observations);
    validateDisplay(display);
    const plugin = observations.plugins[0];
    if (
        observations.plugins.length !== 1 ||
        observations.errors.length ||
        !report.trim() ||
        plugin.id !== item.id ||
        plugin.repository !== item.repository ||
        plugin.path !== item.path ||
        plugin.fingerprints.code !== item.revision ||
        digest(plugin.fingerprints) !== digest(item.fingerprints) ||
        Date.parse(plugin.last_checked_at) < Date.parse(work.session.checked_at)
    )
        throw Error('delivery differs from fixed research item');
    if (
        (display.metadata.repository_id !== null && display.metadata.repository_id !== plugin.repository_id) ||
        ['summaries', 'capabilities', 'advice'].some((key) => display[key].revision !== item.revision)
    )
        throw Error('display identity or revision differs from fixed research item');
    const artifacts = {},
        sources = [],
        localArtifacts = [];
    let savedArtifacts;
    for (const evidence of plugin.evidence) {
        if (!evidence.artifact || Object.hasOwn(artifacts, evidence.artifact)) continue;
        const name = evidence.artifact;
        if (isAbsolute(name) || name.split(/[\\/]/).some((part) => part === '..' || !part))
            throw Error('invalid evidence label');
        let content;
        if (existsSync(resolve(root, name))) {
            content = readFileSync(inside(root, name), 'utf8');
            localArtifacts.push(name);
        } else {
            savedArtifacts ??= readSnapshotStorage(resolve(root, 'data/catalog/index.jsonl')).artifacts;
            const saved = savedArtifacts[name];
            if (!saved || sha(saved.content) !== saved.sha256) throw Error(`evidence unavailable: ${name}`);
            content = saved.content;
        }
        artifacts[evidence.artifact] = { content, sha256: sha(content) };
        if (evidence.artifact.endsWith('/REVIEWED-SOURCE.json')) {
            const material = localArtifacts.includes(name) ? read(inside(root, name)) : JSON.parse(content);
            validateResearchQuestionArtifact(material);
            if (
                material.repository !== item.repository ||
                material.revision !== item.revision ||
                material.component !== item.path ||
                !material.research_questions
            )
                throw Error('question material differs from fixed identity');
            sources.push({ path: evidence.artifact, material });
        }
    }
    if (sources.length !== 1) throw Error('one complete REVIEWED-SOURCE question artifact is required');
    const source = sources[0],
        questions = source.material.research_questions.questions;
    for (const question of questions) {
        if (!report.includes(`research-${question.id.toLowerCase()}`))
            throw Error(`report question missing: ${question.id}`);
        if (!report.includes(question.answer) || question.evidence.some((e) => !report.includes(e.observation)))
            throw Error(`report does not preserve question answer or evidence explanation: ${question.id}`);
    }
    const paths = [entry.observations, entry.report, entry.display, ...localArtifacts];
    const plan = resolve(dirname(inside(root, entry.observations)), 'PLAN.md');
    if (existsSync(plan)) paths.push(plan);
    const files = [
        ...new Map(
            paths.map((name) => {
                const ref = reference(root, name);
                return [ref.path, ref];
            })
        ).values()
    ].sort((a, b) => a.path.localeCompare(b.path));
    const payload = { observations, report, ...display, artifacts };
    const delivery = {
        id: item.id,
        revision: item.revision,
        observations: reference(root, entry.observations).path,
        report: reference(root, entry.report).path,
        display: reference(root, entry.display).path,
        question_artifact: source.path,
        questions: questions.map((q) => q.id),
        supplements: Object.keys(artifacts)
            .filter((p) => p !== source.path)
            .sort(),
        files,
        record_digest: digest(payload)
    };
    return { delivery: { ...delivery, delivery_digest: digest(delivery) }, source: source.material, payload, plugin };
}
export function prepareAcceptance(workPath, entries, root = ROOT) {
    if (!Array.isArray(entries) || !entries.length || new Set(entries.map((e) => e.id)).size !== entries.length)
        throw Error('nonempty unique delivery entries required');
    const { work, workPath: local } = currentWork(workPath, root);
    const deliveries = entries.map((entry) => inspect(work, entry, root).delivery);
    return shape('bundle', {
        schema_version: 1,
        work: local,
        base_digest: work.base_digest,
        input_digest: work.input_digest,
        deliveries
    });
}
function recheck(bundle, root) {
    shape('bundle', bundle);
    const { work } = currentWork(bundle.work, root);
    if (bundle.base_digest !== work.base_digest || bundle.input_digest !== work.input_digest)
        throw Error('acceptance baseline or fixed input changed');
    if (new Set(bundle.deliveries.map((d) => d.id)).size !== bundle.deliveries.length)
        throw Error('duplicate delivery');
    const inspected = bundle.deliveries.map((entry) => {
        const actual = inspect(work, entry, root);
        if (digest(actual.delivery) !== digest(entry))
            throw Error(`delivery changed; prepare and review again: ${entry.id}`);
        return actual;
    });
    return { work, inspected };
}
export function readAcceptance(bundle, id, questionId = null, root = ROOT) {
    const { inspected } = recheck(bundle, root),
        entry = inspected.find((e) => e.delivery.id === id);
    if (!entry) throw Error('plugin is not in acceptance bundle');
    if (!questionId)
        return {
            id,
            revision: entry.delivery.revision,
            delivery_digest: entry.delivery.delivery_digest,
            questions: entry.source.research_questions.questions.map(({ id, question, topics, status }) => ({
                id,
                question,
                topics,
                status
            })),
            plan: entry.delivery.files.find((f) => f.path.endsWith('/PLAN.md')) ?? null,
            goal: entry.source.research_questions.goal,
            findings: entry.plugin.findings,
            recommendation: entry.plugin.recommendation,
            innovation_scores: entry.plugin.innovation_scores,
            report: entry.delivery.report,
            supplements: entry.delivery.supplements,
            boundary: '结构通过不证明语义正确。逐题读取后检查关键依赖、反证和补充材料。'
        };
    const question = entry.source.research_questions.questions.find((q) => q.id === questionId);
    if (!question) throw Error('question is not in delivery');
    return {
        id,
        revision: entry.delivery.revision,
        delivery_digest: entry.delivery.delivery_digest,
        ...question,
        evidence: question.evidence.map((e) => ({
            ...e,
            excerpt: entry.source.files
                .find((f) => f.path === e.source_path)
                .content.replace(/\n$/, '')
                .split('\n')
                .slice(e.line_start - 1, e.line_end)
                .join('\n')
        }))
    };
}
export function readAcceptanceArtifact(bundle, id, label, root = ROOT) {
    const { inspected } = recheck(bundle, root),
        entry = inspected.find((e) => e.delivery.id === id);
    if (!entry || !Object.hasOwn(entry.payload.artifacts, label)) throw Error('artifact is not in delivery');
    return { id, revision: entry.delivery.revision, label, ...entry.payload.artifacts[label] };
}
function validateReviews(bundle, reviews) {
    shape('reviews', reviews);
    if (
        !sameSet(
            reviews.items.map((r) => r.id),
            bundle.deliveries.map((e) => e.id)
        )
    )
        throw Error('review items must exactly match bundle');
    for (const review of reviews.items) {
        const entry = bundle.deliveries.find((e) => e.id === review.id);
        if (review.delivery_digest !== entry.delivery_digest) throw Error('review delivery binding differs');
        if (
            !sameSet(
                review.questions.map((q) => q.id),
                entry.questions
            )
        )
            throw Error('every question requires explicit review');
        if (
            !sameSet(
                review.dependencies.supplements.map((s) => s.path),
                entry.supplements
            )
        )
            throw Error('every supplementary artifact requires explicit review');
        const reasons = [
            review.reason,
            review.dependencies.reason,
            ...review.questions.map((q) => q.reason),
            ...review.dependencies.supplements.map((s) => s.reason),
            ...review.dependencies.checks.flatMap((c) => [c.target, c.evidence, c.conclusion])
        ];
        if (reasons.some((reason) => !reason.trim())) throw Error('authored review reasons must not be blank');
        if (
            review.decision === 'accept' &&
            (review.questions.some((q) => q.decision !== 'accept') ||
                review.dependencies.decision !== 'sufficient' ||
                review.dependencies.supplements.some((s) => s.decision !== 'accept'))
        )
            throw Error('accept cannot override a question or dependency requiring revision');
    }
    if (!reviews.reviewer.trim()) throw Error('explicit reviewer required');
}
export function submitAcceptance(bundle, reviews, root = ROOT) {
    recheck(bundle, root);
    validateReviews(bundle, reviews);
    return shape('submission', { schema_version: 1, bundle_digest: digest(bundle), reviews });
}
const payloadOf = (record) =>
    Object.fromEntries(
        ['observations', 'report', 'metadata', 'summaries', 'capabilities', 'advice', 'artifacts'].map((k) => [
            k,
            record[k]
        ])
    );
export function stageAcceptance(bundle, submission, root = ROOT) {
    shape('submission', submission);
    if (submission.bundle_digest !== digest(bundle)) throw Error('submission is bound to a different bundle');
    validateReviews(bundle, submission.reviews);
    const { work } = recheck(bundle, root);
    if (submission.reviews.items.some((r) => r.decision !== 'accept')) throw Error('revise decision cannot be staged');
    const expected = new Map(bundle.deliveries.map((e) => [e.id, e.record_digest]));
    const verify = (id, record, lockedWork = work) => {
        if (lockedWork.base_digest !== bundle.base_digest || lockedWork.input_digest !== bundle.input_digest)
            throw Error('acceptance context changed before staging');
        for (const file of bundle.deliveries.find((e) => e.id === id).files)
            if (sha(readFileSync(inside(root, file.path))) !== file.sha256)
                throw Error(`reviewed file changed before staging: ${file.path}`);
        if (digest(payloadOf(record)) !== expected.get(id))
            throw Error(`staged bytes differ from reviewed delivery: ${id}`);
    };
    const completed = bundle.deliveries.filter((e) => work.records[e.id]);
    if (completed.length) {
        if (completed.length !== bundle.deliveries.length)
            throw Error('partially staged bundle; prepare remaining entries');
        for (const entry of completed) verify(entry.id, work.records[entry.id]);
        return { status: 'already_staged', ids: completed.map((e) => e.id) };
    }
    stageRecords(
        resolve(root, bundle.work),
        bundle.deliveries.map(({ id, observations, report, display }) => ({
            id,
            observations: resolve(root, observations),
            report: resolve(root, report),
            display: resolve(root, display)
        })),
        root,
        verify
    );
    return { status: 'staged', ids: bundle.deliveries.map((e) => e.id) };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { positionals, values } = parseArgs({
            allowPositionals: true,
            options: Object.fromEntries(
                ['work', 'input', 'out', 'bundle', 'plugin', 'question', 'artifact', 'decisions'].map((key) => [
                    key,
                    { type: 'string' }
                ])
            )
        });
        const need = (key) => {
            if (!values[key]) throw Error(`--${key} required`);
            return values[key];
        };
        const command = positionals[0];
        if (values.question && values.artifact) throw Error('choose --question or --artifact');
        if (command === 'prepare' || command === 'submit') need('out');
        let dest;
        if (values.out) {
            dest = resolve(values.out);
            const bundle = command === 'prepare' ? { work: need('work') } : read(need('bundle'));
            const round = dirname(inside(ROOT, bundle.work)),
                folder = realpathSync(dirname(dest));
            if (relative(round, folder).startsWith('..') || isAbsolute(relative(round, folder)))
                throw Error('output must remain in round');
            if (existsSync(dest)) throw Error('output exists; use a new acceptance filename');
        }
        let result;
        if (command === 'prepare') result = prepareAcceptance(need('work'), read(need('input')));
        else if (command === 'read')
            result = values.artifact
                ? readAcceptanceArtifact(read(need('bundle')), need('plugin'), values.artifact)
                : readAcceptance(read(need('bundle')), need('plugin'), values.question);
        else if (command === 'submit') result = submitAcceptance(read(need('bundle')), read(need('input')));
        else if (command === 'stage') result = stageAcceptance(read(need('bundle')), read(need('decisions')));
        else throw Error('expected prepare, read, submit or stage');
        if (dest) {
            atomicWrite(dest, result);
            console.log(JSON.stringify({ command, output: dest, digest: digest(result) }));
        } else console.log(JSON.stringify(result, null, 2));
    } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
    }
}
