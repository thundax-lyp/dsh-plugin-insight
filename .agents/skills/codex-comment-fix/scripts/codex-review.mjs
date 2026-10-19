#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync, renameSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const DEFAULT_CODEX_LOGINS = ['chatgpt-codex-connector[bot]', 'chatgpt-codex-connector', 'codex[bot]', 'codex'];
const DISPOSITION_RE =
    /<!--\s*codex-comment-fix review=(\d+) finding=(\d+) disposition=(fixed|rejected|deferred)\s*-->/g;
const OPERATION_RE = (key) => `<!-- codex-comment-fix operation=${key} -->`;
const QUOTA_SENTENCE = 'You have reached your Codex usage limits for code reviews.';

function fail(message) {
    throw new Error(message);
}
function sha256(text) {
    return createHash('sha256').update(text).digest('hex');
}
function json(value) {
    return JSON.stringify(value, null, 2) + '\n';
}
function normalizeText(value = '') {
    return value.replace(/\r/g, '').replace(/\s+/g, ' ').trim().toLowerCase();
}
function escapeRegExp(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function gh(args, { jsonOutput = true } = {}) {
    const result = spawnSync('gh', args, { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024 });
    if (result.error) fail(`cannot run gh: ${result.error.message}`);
    if (result.status !== 0)
        fail(`gh ${args.slice(0, 3).join(' ')} failed: ${(result.stderr || result.stdout).trim()}`);
    if (!jsonOutput) return result.stdout;
    try {
        return JSON.parse(result.stdout || 'null');
    } catch {
        fail(`gh returned invalid JSON for ${args.slice(0, 3).join(' ')}`);
    }
}

function parseArgs(argv) {
    const [command, ...rest] = argv;
    const options = { apply: false, codexLogins: [] };
    for (let i = 0; i < rest.length; i++) {
        const arg = rest[i];
        if (arg === '--apply') {
            options.apply = true;
            continue;
        }
        if (['--pr', '--out', '--plan', '--codex-login'].includes(arg)) {
            const value = rest[++i];
            if (!value || value.startsWith('--')) fail(`${arg} requires a value`);
            if (arg === '--codex-login')
                options.codexLogins.push(
                    ...value
                        .split(',')
                        .map((v) => v.trim())
                        .filter(Boolean)
                );
            else options[arg.slice(2)] = value;
            continue;
        }
        fail(`unknown argument: ${arg}`);
    }
    return { command, options };
}

function currentRepository() {
    const data = gh(['repo', 'view', '--json', 'nameWithOwner']);
    if (!data?.nameWithOwner) fail('cannot resolve current GitHub repository');
    return data.nameWithOwner;
}

function resolvePrNumber(value) {
    if (value !== undefined) {
        if (!/^#?\d+$/.test(value)) fail(`invalid PR number: ${value}`);
        return Number(value.replace('#', ''));
    }
    const data = gh(['pr', 'view', '--json', 'number']);
    if (!Number.isInteger(data?.number)) fail('current branch has no pull request; pass --pr explicitly');
    return data.number;
}

function readPr(repository, number) {
    const pr = gh(['api', `repos/${repository}/pulls/${number}`]);
    if (pr.base?.ref !== 'main') fail(`PR #${number} targets ${pr.base?.ref || 'unknown'}, expected main`);
    if (pr.state === 'closed' && !pr.merged_at) fail(`PR #${number} is closed without merge`);
    return pr;
}

function paged(repository, endpoint) {
    const rows = [];
    for (let page = 1; ; page++) {
        const separator = endpoint.includes('?') ? '&' : '?';
        const batch = gh(['api', `repos/${repository}/${endpoint}${separator}per_page=100&page=${page}`]);
        if (!Array.isArray(batch)) fail(`expected a list from ${endpoint}`);
        rows.push(...batch);
        if (batch.length < 100) break;
    }
    return rows;
}

const THREAD_QUERY = `query($owner:String!,$name:String!,$number:Int!,$cursor:String){
 repository(owner:$owner,name:$name){pullRequest(number:$number){reviewThreads(first:100,after:$cursor){
  nodes{id isResolved comments(first:100){nodes{id databaseId body url path line originalLine createdAt author{login} pullRequestReview{databaseId}} pageInfo{hasNextPage endCursor}}}
  pageInfo{hasNextPage endCursor}
 }}}
}`;

const THREAD_COMMENTS_QUERY = `query($threadId:ID!,$cursor:String){
 node(id:$threadId){... on PullRequestReviewThread{comments(first:100,after:$cursor){
  nodes{id databaseId body url path line originalLine createdAt author{login} pullRequestReview{databaseId}}
  pageInfo{hasNextPage endCursor}
 }}}
}`;

function readRemainingThreadComments(thread) {
    const comments = [...thread.comments.nodes];
    let pageInfo = thread.comments.pageInfo;
    while (pageInfo.hasNextPage) {
        if (!pageInfo.endCursor) fail(`review thread ${thread.id} comment pagination returned no cursor`);
        const data = gh([
            'api',
            'graphql',
            '-f',
            `query=${THREAD_COMMENTS_QUERY}`,
            '-F',
            `threadId=${thread.id}`,
            '-F',
            `cursor=${pageInfo.endCursor}`
        ]);
        const connection = data?.data?.node?.comments;
        if (!connection) fail(`cannot read comments for review thread ${thread.id}`);
        comments.push(...connection.nodes);
        pageInfo = connection.pageInfo;
    }
    return comments;
}

function readThreads(repository, number) {
    const [owner, name] = repository.split('/');
    let cursor;
    const nodes = [];
    for (;;) {
        const args = [
            'api',
            'graphql',
            '-f',
            `query=${THREAD_QUERY}`,
            '-F',
            `owner=${owner}`,
            '-F',
            `name=${name}`,
            '-F',
            `number=${number}`
        ];
        if (cursor) args.push('-F', `cursor=${cursor}`);
        const data = gh(args);
        const connection = data?.data?.repository?.pullRequest?.reviewThreads;
        if (!connection) fail(`cannot read review threads for PR #${number}`);
        nodes.push(
            ...connection.nodes.map((thread) => ({
                ...thread,
                comments: { nodes: readRemainingThreadComments(thread) }
            }))
        );
        if (!connection.pageInfo.hasNextPage) break;
        cursor = connection.pageInfo.endCursor;
        if (!cursor) fail('review thread pagination returned no cursor');
    }
    return nodes;
}

export function isPureQuotaNotice(body) {
    if (typeof body !== 'string') return false;
    const trimmed = body.trim();
    if (!trimmed.startsWith(QUOTA_SENTENCE)) return false;
    let rest = trimmed.slice(QUOTA_SENTENCE.length).trim();
    if (!rest) return true;
    rest = rest
        .replace(
            /\[[^\]]*(?:usage|dashboard|settings?)[^\]]*\]\(https:\/\/(?:chatgpt\.com|platform\.openai\.com)\/[^)]+\)/gi,
            ''
        )
        .replace(/[\s|·•-]+/g, '');
    return rest.length === 0;
}

export function parseDispositionMarkers(body) {
    const markers = [];
    for (const match of (body || '').matchAll(DISPOSITION_RE))
        markers.push({ review_id: Number(match[1]), finding: Number(match[2]), disposition: match[3] });
    return markers;
}

function codexPredicate(logins) {
    const allowed = new Set(logins.map((v) => v.toLowerCase()));
    return (login) => allowed.has((login || '').toLowerCase());
}
function locationOverlaps(aStart, aEnd, bStart, bEnd) {
    if (!aStart || !bStart) return false;
    return Math.max(aStart, bStart) <= Math.min(aEnd || aStart, bEnd || bStart);
}

export function parseSummaryFindings(review, repository, reviewComments = []) {
    const body = review.body || '';
    const urlRe = new RegExp(
        `https://github\\.com/${escapeRegExp(repository)}/blob/([^/]+)/([^#\\s]+)#L(\\d+)(?:-L(\\d+))?`,
        'i'
    );
    const findings = [];
    for (const segment of body.split(/^\s*---\s*$/m)) {
        const match = segment.match(urlRe);
        if (!match) continue;
        const after = segment.slice((match.index || 0) + match[0].length).trim();
        const lines = after
            .split('\n')
            .map((v) => v.trim())
            .filter(Boolean);
        if (lines.length < 2) continue;
        const title = lines[0].replace(/^#+\s*/, '');
        const detail = lines.slice(1).join('\n').trim();
        if (!detail || isPureQuotaNotice(detail)) continue;
        const path = decodeURIComponent(match[2]);
        const start = Number(match[3]);
        const end = Number(match[4] || match[3]);
        const duplicate = reviewComments.find((comment) => {
            const commentBody = normalizeText(comment.body);
            if (!commentBody) return false;
            return (
                Number(comment.pull_request_review_id) === Number(review.id) &&
                comment.path === path &&
                locationOverlaps(
                    start,
                    end,
                    comment.line || comment.original_line,
                    comment.line || comment.original_line
                ) &&
                (commentBody.includes(normalizeText(title)) ||
                    normalizeText(detail).includes(commentBody) ||
                    commentBody.includes(normalizeText(detail)))
            );
        });
        findings.push({
            source_key: `review:${review.id}:finding:${findings.length + 1}`,
            review_id: review.id,
            finding: findings.length + 1,
            path,
            line_start: start,
            line_end: end,
            title,
            body: detail,
            url: match[0],
            duplicate_of_comment_id: duplicate?.id ?? null
        });
    }
    return findings;
}

function normalizeComment(comment) {
    return {
        id: comment.id,
        database_id: comment.databaseId ?? comment.id,
        graphql_id: comment.node_id ?? comment.id,
        author: comment.user?.login ?? comment.author?.login ?? null,
        body: comment.body ?? '',
        url: comment.html_url ?? comment.url ?? null,
        path: comment.path ?? null,
        line: comment.line ?? null,
        original_line: comment.original_line ?? comment.originalLine ?? null,
        review_id: comment.pull_request_review_id ?? comment.pullRequestReview?.databaseId ?? null,
        created_at: comment.created_at ?? comment.createdAt ?? null
    };
}

function latestDispositions(issueComments) {
    const latest = new Map();
    for (const comment of issueComments) {
        for (const marker of parseDispositionMarkers(comment.body)) {
            const key = `review:${marker.review_id}:finding:${marker.finding}`;
            latest.set(key, { ...marker, comment_id: comment.id, created_at: comment.created_at });
        }
    }
    return latest;
}

export function inspectPullRequest({
    repository = currentRepository(),
    prNumber,
    codexLogins = DEFAULT_CODEX_LOGINS
} = {}) {
    const number = resolvePrNumber(prNumber);
    const pr = readPr(repository, number);
    const isCodex = codexPredicate(codexLogins);
    const reviews = paged(repository, `pulls/${number}/reviews`);
    const reviewComments = paged(repository, `pulls/${number}/comments`);
    const issueComments = paged(repository, `issues/${number}/comments`);
    const threads = readThreads(repository, number);
    const dispositions = latestDispositions(issueComments);
    const summaryFindings = reviews
        .filter((r) => isCodex(r.user?.login))
        .flatMap((r) => parseSummaryFindings(r, repository, reviewComments))
        .map((f) => {
            const disposition = dispositions.get(f.source_key) ?? null;
            return { ...f, disposition, actionable: !f.duplicate_of_comment_id && !disposition };
        });
    const quota = [];
    for (const [resource, items] of [
        ['review', reviews],
        ['review_comment', reviewComments],
        ['issue_comment', issueComments]
    ])
        for (const item of items) {
            if (isCodex(item.user?.login) && isPureQuotaNotice(item.body))
                quota.push({
                    resource,
                    id: item.id,
                    author: item.user.login,
                    body_sha256: sha256(item.body),
                    url: item.html_url ?? null
                });
        }
    return {
        schema_version: 1,
        repository,
        inspected_at: new Date().toISOString(),
        codex_logins: codexLogins,
        pr: {
            number,
            state: pr.state,
            merged: Boolean(pr.merged_at),
            base: pr.base.ref,
            head: pr.head.ref,
            url: pr.html_url
        },
        threads: threads.map((t) => ({
            id: t.id,
            is_resolved: t.isResolved,
            comments: t.comments.nodes.map(normalizeComment)
        })),
        review_comments: reviewComments.map(normalizeComment),
        reviews: reviews.map((r) => ({
            id: r.id,
            author: r.user?.login ?? null,
            state: r.state,
            body: r.body ?? '',
            submitted_at: r.submitted_at,
            url: r.html_url
        })),
        issue_comments: issueComments.map(normalizeComment),
        summary_findings: summaryFindings,
        unresolved_thread_findings: threads
            .filter((t) => !t.isResolved && isCodex(t.comments.nodes[0]?.author?.login))
            .map((t) => ({ thread_id: t.id, comments: t.comments.nodes.map(normalizeComment) })),
        quota_notices: quota
    };
}

function atomicWrite(path, value) {
    const target = resolve(path);
    const temporary = resolve(dirname(target), `.${target.split('/').pop()}.${process.pid}.tmp`);
    writeFileSync(temporary, json(value));
    renameSync(temporary, target);
}
function operationKey(operation) {
    if (!/^[A-Za-z0-9._:-]{1,160}$/.test(operation.key || '')) fail(`${operation.op} requires a stable key`);
    return operation.key;
}
function endpointForResource(repository, pr, resource, id) {
    if (resource === 'review_comment') return `repos/${repository}/pulls/comments/${id}`;
    if (resource === 'issue_comment') return `repos/${repository}/issues/comments/${id}`;
    if (resource === 'review') return `repos/${repository}/pulls/${pr}/reviews/${id}`;
    fail(`unsupported resource: ${resource}`);
}
function getResource(repository, pr, resource, id) {
    return gh(['api', endpointForResource(repository, pr, resource, id)]);
}
function threadById(repository, pr, id) {
    const thread = readThreads(repository, pr).find((t) => t.id === id);
    if (!thread) fail(`review thread not found: ${id}`);
    return thread;
}
function ensureCodexResource(resource, isCodex, operation) {
    const login = resource.user?.login;
    if (!isCodex(login)) fail(`${operation.op} target author is not an allowed Codex login: ${login || 'unknown'}`);
}
function addOperationMarker(body, key) {
    const marker = OPERATION_RE(key);
    return body.includes(marker) ? body : `${body.trim()}\n\n${marker}`;
}

const REPLY_MUTATION = `mutation($threadId:ID!,$body:String!){addPullRequestReviewThreadReply(input:{pullRequestReviewThreadId:$threadId,body:$body}){comment{id databaseId body url}}}`;
const RESOLVE_MUTATION = `mutation($threadId:ID!){resolveReviewThread(input:{threadId:$threadId}){thread{id isResolved}}}`;

function graphqlMutation(query, fields) {
    const args = ['api', 'graphql', '-f', `query=${query}`];
    for (const [name, value] of Object.entries(fields))
        args.push(typeof value === 'number' ? '-F' : '-f', `${name}=${value}`);
    return gh(args);
}

function readPlan(path) {
    const text = path === '-' ? readFileSync(0, 'utf8') : readFileSync(resolve(path), 'utf8');
    try {
        return JSON.parse(text);
    } catch {
        fail(`invalid plan JSON: ${path}`);
    }
}

export function applyPlan(plan, { apply = false, currentRepo = currentRepository() } = {}) {
    if (
        plan?.schema_version !== 1 ||
        typeof plan.repository !== 'string' ||
        !Number.isInteger(plan.pr) ||
        !Array.isArray(plan.operations)
    )
        fail('plan must contain schema_version=1, repository, integer pr, and operations');
    if (plan.repository !== currentRepo)
        fail(`plan repository ${plan.repository} does not match current repository ${currentRepo}`);
    readPr(plan.repository, plan.pr);
    const logins = plan.codex_logins?.length ? plan.codex_logins : DEFAULT_CODEX_LOGINS;
    const isCodex = codexPredicate(logins);
    const results = [];
    const plannedReplies = new Map();
    const rememberReply = (key, threadId) => {
        const existing = plannedReplies.get(key);
        if (existing && existing !== threadId) fail(`reply key ${key} is already bound to thread ${existing}`);
        plannedReplies.set(key, threadId);
    };
    for (const operation of plan.operations) {
        if (!operation || typeof operation.op !== 'string') fail('each operation requires op');
        if (operation.op === 'reaction') {
            if (
                operation.resource !== 'review_comment' ||
                !Number.isInteger(operation.id) ||
                !['+1', '-1'].includes(operation.content)
            )
                fail('reaction requires review_comment, integer id, and +1 or -1');
            const target = getResource(plan.repository, plan.pr, operation.resource, operation.id);
            ensureCodexResource(target, isCodex, operation);
            const viewer = gh(['api', 'user']).login;
            const reactions = paged(plan.repository, `pulls/comments/${operation.id}/reactions`);
            if (reactions.some((r) => r.user?.login === viewer && r.content === operation.content)) {
                results.push({ ...operation, status: 'already_applied' });
                continue;
            }
            if (!apply) {
                results.push({ ...operation, status: 'planned' });
                continue;
            }
            gh([
                'api',
                `repos/${plan.repository}/pulls/comments/${operation.id}/reactions`,
                '-H',
                'Accept: application/vnd.github+json',
                '-f',
                `content=${operation.content}`
            ]);
            const after = paged(plan.repository, `pulls/comments/${operation.id}/reactions`);
            if (!after.some((r) => r.user?.login === viewer && r.content === operation.content))
                fail(`reaction readback failed for comment ${operation.id}`);
            results.push({ ...operation, status: 'applied' });
            continue;
        }
        if (operation.op === 'delete_quota') {
            if (!Number.isInteger(operation.id) || !operation.expected_login || !operation.expected_body_sha256)
                fail('delete_quota requires integer id, expected_login, and expected_body_sha256');
            const target = getResource(plan.repository, plan.pr, operation.resource, operation.id);
            ensureCodexResource(target, isCodex, operation);
            if (
                target.user?.login !== operation.expected_login ||
                sha256(target.body || '') !== operation.expected_body_sha256 ||
                !isPureQuotaNotice(target.body)
            )
                fail(`delete_quota precondition failed for ${operation.resource} ${operation.id}`);
            if (!apply) {
                results.push({ ...operation, status: 'planned' });
                continue;
            }
            gh(
                [
                    'api',
                    '--method',
                    'DELETE',
                    endpointForResource(plan.repository, plan.pr, operation.resource, operation.id)
                ],
                { jsonOutput: false }
            );
            const probe = spawnSync(
                'gh',
                ['api', endpointForResource(plan.repository, plan.pr, operation.resource, operation.id)],
                { encoding: 'utf8' }
            );
            if (probe.status === 0 || !/HTTP 404/i.test(`${probe.stderr}\n${probe.stdout}`))
                fail(`delete readback did not confirm HTTP 404 for ${operation.resource} ${operation.id}`);
            results.push({ ...operation, status: 'applied' });
            continue;
        }
        if (operation.op === 'reply') {
            const key = operationKey(operation);
            if (!operation.thread_id || typeof operation.body !== 'string' || !operation.body.trim())
                fail('reply requires thread_id and body');
            const marker = OPERATION_RE(key);
            const thread = threadById(plan.repository, plan.pr, operation.thread_id);
            if (thread.comments.nodes.some((c) => (c.body || '').includes(marker))) {
                results.push({ ...operation, status: 'already_applied' });
                rememberReply(key, operation.thread_id);
                continue;
            }
            const body = addOperationMarker(operation.body, key);
            if (!apply) {
                results.push({ ...operation, status: 'planned' });
                rememberReply(key, operation.thread_id);
                continue;
            }
            graphqlMutation(REPLY_MUTATION, { threadId: operation.thread_id, body });
            const after = threadById(plan.repository, plan.pr, operation.thread_id);
            if (!after.comments.nodes.some((c) => (c.body || '').includes(marker)))
                fail(`reply readback failed for thread ${operation.thread_id}`);
            results.push({ ...operation, status: 'applied' });
            rememberReply(key, operation.thread_id);
            continue;
        }
        if (operation.op === 'summary_comment') {
            const key = operationKey(operation);
            if (typeof operation.body !== 'string' || !parseDispositionMarkers(operation.body).length)
                fail('summary_comment requires body with at least one disposition marker');
            const marker = OPERATION_RE(key);
            const comments = paged(plan.repository, `issues/${plan.pr}/comments`);
            if (comments.some((c) => (c.body || '').includes(marker))) {
                results.push({ ...operation, status: 'already_applied' });
                continue;
            }
            const body = addOperationMarker(operation.body, key);
            if (!apply) {
                results.push({ ...operation, status: 'planned' });
                continue;
            }
            const created = gh(['api', `repos/${plan.repository}/issues/${plan.pr}/comments`, '-f', `body=${body}`]);
            const after = getResource(plan.repository, plan.pr, 'issue_comment', created.id);
            if (!(after.body || '').includes(marker)) fail(`summary comment readback failed for ${created.id}`);
            results.push({ ...operation, status: 'applied', comment_id: created.id });
            continue;
        }
        if (operation.op === 'resolve') {
            if (!operation.thread_id || !operation.reply_key) fail('resolve requires thread_id and reply_key');
            let thread = threadById(plan.repository, plan.pr, operation.thread_id);
            if (thread.isResolved) {
                results.push({ ...operation, status: 'already_applied' });
                continue;
            }
            const hasReply =
                plannedReplies.get(operation.reply_key) === operation.thread_id ||
                thread.comments.nodes.some((c) => (c.body || '').includes(OPERATION_RE(operation.reply_key)));
            if (!hasReply) fail(`resolve requires a successful reply with key ${operation.reply_key}`);
            if (!apply) {
                results.push({ ...operation, status: 'planned' });
                continue;
            }
            graphqlMutation(RESOLVE_MUTATION, { threadId: operation.thread_id });
            thread = threadById(plan.repository, plan.pr, operation.thread_id);
            if (!thread.isResolved) fail(`resolve readback failed for thread ${operation.thread_id}`);
            results.push({ ...operation, status: 'applied' });
            continue;
        }
        fail(`unsupported operation: ${operation.op}`);
    }
    return { schema_version: 1, repository: plan.repository, pr: plan.pr, mode: apply ? 'apply' : 'dry-run', results };
}

function usage() {
    return `Usage:
  npm run codex-review -- inspect [--pr <number>] [--out <path>] [--codex-login <login[,login]>]
  npm run codex-review -- apply --plan <path|-> [--apply]

inspect is read-only. apply is a dry-run unless --apply is present.`;
}

async function main() {
    const { command, options } = parseArgs(process.argv.slice(2));
    if (!command || command === 'help' || command === '--help') {
        console.log(usage());
        return;
    }
    if (command === 'inspect') {
        const result = inspectPullRequest({
            prNumber: options.pr,
            codexLogins: options.codexLogins.length ? options.codexLogins : DEFAULT_CODEX_LOGINS
        });
        if (options.out) {
            atomicWrite(options.out, result);
            console.log(`Wrote ${resolve(options.out)}`);
        } else process.stdout.write(json(result));
        return;
    }
    if (command === 'apply') {
        if (!options.plan) fail('apply requires --plan <path|->');
        process.stdout.write(json(applyPlan(readPlan(options.plan), { apply: options.apply })));
        return;
    }
    fail(`unknown command: ${command}`);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url))
    main().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
