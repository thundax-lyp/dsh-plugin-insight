#!/usr/bin/env node
import { execFileSync } from 'node:child_process';
import { appendFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { digest } from '../../_shared/scripts/plugin-data.mjs';
import { inspectPullRequest } from '../../codex-comment-fix/scripts/codex-review.mjs';

// REST bot logins include [bot]; do not trust ordinary accounts with similar names.
const CODEX = new Set(['chatgpt-codex-connector[bot]']);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
function api(repository, path, method = 'GET', body) {
    const args = ['api', `repos/${repository}/${path}`, '--method', method, '-H', 'X-GitHub-Api-Version: 2026-03-10'];
    if (body !== undefined) args.push('--input', '-');
    return JSON.parse(
        execFileSync('gh', args, {
            input: body === undefined ? undefined : JSON.stringify(body),
            encoding: 'utf8',
            maxBuffer: 64 * 1024 * 1024
        }) || 'null'
    );
}
function pages(repository, path, field) {
    const result = [];
    for (let page = 1; ; page++) {
        const value = api(repository, `${path}${path.includes('?') ? '&' : '?'}per_page=100&page=${page}`);
        const items = field ? value[field] : value;
        if (!Array.isArray(items)) throw Error(`invalid paginated response: ${path}`);
        result.push(...items);
        if (items.length < 100) return result;
    }
}
function isMetaIdentity(pr, repository) {
    return (
        pr.user?.login === 'github-actions[bot]' &&
        pr.base?.ref === 'main' &&
        pr.base.repo.full_name === repository &&
        pr.head?.repo?.full_name === repository &&
        /^codex\/daily-meta-[0-9]+$/.test(pr.head.ref)
    );
}
export function isMetaPullRequest(pr, repository) {
    return pr.state === 'open' && !pr.draft && isMetaIdentity(pr, repository);
}
export function validateMetaScope(before, after, files) {
    const stable = (value) => {
        const { metadata, publication, ...rest } = value;
        const { metadata: mapping, ...display } = publication;
        return { ...rest, publication: display };
    };
    if (digest(stable(before)) !== digest(stable(after))) throw Error('META PR changes research or discovery');
    if (
        digest(Object.keys(before.metadata).sort()) !== digest(Object.keys(after.metadata).sort()) ||
        digest(before.publication.metadata) !== digest(after.publication.metadata)
    )
        throw Error('META PR changes identity mappings');
    const allowed = new Set(['README.md', 'data/catalog/SNAPSHOT.json']);
    for (const directory of Object.values(before.registry)) {
        allowed.add(`${directory}/META.json`);
        allowed.add(`${directory}/INSIGHT.md`);
    }
    if (
        !files.length ||
        files.some(
            (file) =>
                file.status !== 'modified' ||
                (!allowed.has(file.filename) && !/^data\/views\/categories\/[A-Z][A-Z-]*\.md$/.test(file.filename))
        )
    )
        throw Error('META PR contains files outside metadata and generated pages');
}
export function codexState(review) {
    const receipts = review.issue_comments
        .filter((comment) => CODEX.has(comment.author))
        .map((comment) => {
            const match = /<!-- codex-review-state:v1 (.*?) -->/s.exec(comment.body);
            if (!match) return null;
            try {
                return JSON.parse(match[1]).code_review;
            } catch {
                return null;
            }
        })
        .filter(Boolean);
    return receipts.at(-1);
}
export function reviewReady(review, sha, currentReviewIds = []) {
    if (review.threads.some((thread) => !thread.is_resolved)) return false;
    // Deferred summary findings also block; only fixed/rejected markers dispose them.
    if (
        review.summary_findings.some(
            (finding) =>
                !finding.duplicate_of_comment_id && !['fixed', 'rejected'].includes(finding.disposition?.disposition)
        )
    )
        return false;
    const current = codexState(review);
    // isResolved plus explicit summary dispositions are authoritative after a finding is handled.
    if (
        current?.commit_sha !== sha ||
        current.status !== 'completed' ||
        typeof current.has_any_findings !== 'boolean' ||
        typeof current.has_unresolved_findings !== 'boolean'
    )
        return false;
    if (!current.has_any_findings) return !current.has_unresolved_findings;
    // Unknown current-head finding formats must not be cleared by resolved threads from an older head.
    return (
        review.threads.some((thread) =>
            thread.comments.some((comment) => currentReviewIds.includes(comment.review_id))
        ) || review.summary_findings.some((finding) => currentReviewIds.includes(finding.review_id))
    );
}
function report(number, state, detail = '') {
    const text = `META PR #${number}: ${state}${detail ? ` (${detail})` : ''}`;
    console.log(text);
    if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `- ${text}\n`);
}
export function validateMainCIRun(run, workflowId) {
    if (
        run.workflow_id !== workflowId ||
        run.head_branch !== 'main' ||
        !['push', 'workflow_dispatch'].includes(run.event) ||
        !/^[a-f0-9]{40,64}$/.test(run.head_sha ?? '')
    )
        throw Error('main CI run identity mismatch');
}
function ensureMainCI(repository, workflow, mergeSha, number, apply) {
    const exact = pages(repository, `actions/workflows/${workflow.id}/runs?head_sha=${mergeSha}`, 'workflow_runs')
        .filter((run) => run.head_branch === 'main' && ['push', 'workflow_dispatch'].includes(run.event))
        .sort((a, b) => b.id - a.id)[0];
    let run = exact ? api(repository, `actions/runs/${exact.id}`) : null;
    const mainSha = api(repository, 'git/ref/heads/main').object.sha;
    if (run?.status === 'completed' && run.conclusion !== 'success' && mainSha !== mergeSha) run = null;
    if (!run) {
        const existing = pages(repository, `actions/workflows/${workflow.id}/runs?head_sha=${mainSha}`, 'workflow_runs')
            .filter((item) => item.head_branch === 'main' && ['push', 'workflow_dispatch'].includes(item.event))
            .sort((a, b) => b.id - a.id)[0];
        if (existing) run = api(repository, `actions/runs/${existing.id}`);
    }

    if (!run) {
        if (!apply) {
            report(number, 'would dispatch main CI', mergeSha);
            return;
        }
        const dispatched = api(repository, `actions/workflows/${workflow.id}/dispatches`, 'POST', { ref: 'main' });
        if (!Number.isSafeInteger(dispatched?.workflow_run_id))
            throw Error('main CI dispatch returned no workflow run ID');
        run = api(repository, `actions/runs/${dispatched.workflow_run_id}`);
    }
    validateMainCIRun(run, workflow.id);
    git('fetch', '--no-tags', 'origin', mergeSha, run.head_sha);
    if (git('merge-base', mergeSha, run.head_sha).trim() !== mergeSha)
        throw Error('main CI does not include merged META commit');
    if (run.status === 'completed' && run.conclusion !== 'success') throw Error(`main CI failed: ${run.html_url}`);
    report(number, 'main CI verified', `${run.status}/${run.conclusion ?? 'pending'} ${run.html_url}`);
}
export function maintainMetaPullRequests({ repository, apply = false } = {}) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository ?? '')) throw Error('valid GH_REPO required');
    const dailyWorkflow = api(repository, 'actions/workflows/daily-meta.yml');
    const ciWorkflow = api(repository, 'actions/workflows/repository-checks.yml');
    const candidates = pages(repository, 'pulls?state=open').filter((pr) => isMetaPullRequest(pr, repository));
    if (!candidates.length) console.log('No eligible META PRs');
    // A failed dispatch after a successful merge must be recoverable on the next maintenance run.
    const recentMerged = pages(repository, 'pulls?state=closed&sort=updated&direction=desc').filter(
        (pr) =>
            isMetaIdentity(pr, repository) &&
            pr.merged_at &&
            Date.parse(pr.merged_at) >= Date.now() - 24 * 60 * 60 * 1000
    );
    for (const pr of recentMerged) {
        const origin = api(repository, `actions/runs/${pr.head.ref.match(/[0-9]+$/)[0]}`);
        if (origin.workflow_id === dailyWorkflow.id && origin.head_branch === 'main' && origin.conclusion === 'success')
            ensureMainCI(repository, ciWorkflow, pr.merge_commit_sha, pr.number, apply);
    }

    candidateLoop: for (const candidate of candidates) {
        let pr = api(repository, `pulls/${candidate.number}`);
        if (!isMetaPullRequest(pr, repository)) continue;
        const runId = pr.head.ref.match(/[0-9]+$/)[0];
        const origin = api(repository, `actions/runs/${runId}`);
        if (
            origin.workflow_id !== dailyWorkflow.id ||
            origin.head_branch !== 'main' ||
            !['schedule', 'workflow_dispatch'].includes(origin.event) ||
            origin.conclusion !== 'success'
        ) {
            report(pr.number, 'waiting', 'daily META provenance not yet successful');
            continue;
        }
        git('fetch', '--no-tags', 'origin', pr.base.sha, pr.head.sha);
        const mergeBase = git('merge-base', pr.base.sha, pr.head.sha).trim();
        const before = JSON.parse(git('show', `${mergeBase}:data/catalog/SNAPSHOT.json`));
        const after = JSON.parse(git('show', `${pr.head.sha}:data/catalog/SNAPSHOT.json`));
        validateMetaScope(before, after, pages(repository, `pulls/${pr.number}/files`));
        if (mergeBase !== pr.base.sha) {
            report(pr.number, apply ? 'requesting branch update' : 'would update branch');
            if (apply) {
                api(repository, `pulls/${pr.number}/update-branch`, 'PUT', { expected_head_sha: pr.head.sha });
                const updated = api(repository, `pulls/${pr.number}`);
                report(
                    pr.number,
                    'waiting',
                    updated.head.sha === pr.head.sha ? 'branch update pending' : 'new head requires fresh CI and review'
                );
            }
            continue;
        }
        const runs = pages(
            repository,
            `actions/workflows/${ciWorkflow.id}/runs?branch=${encodeURIComponent(pr.head.ref)}&head_sha=${pr.head.sha}`,
            'workflow_runs'
        );
        const blockedRuns = runs.filter((run) => run.event === 'pull_request' && run.conclusion === 'action_required');
        for (const run of blockedRuns) {
            report(pr.number, apply ? 'approving CI execution' : 'would approve CI execution', String(run.id));
            if (apply) {
                api(repository, `actions/runs/${run.id}/approve`, 'POST');
                const approved = api(repository, `actions/runs/${run.id}`);
                if (approved.conclusion === 'action_required')
                    report(pr.number, 'waiting', 'CI approval readback pending');
            }
        }
        const review = inspectPullRequest({ repository, prNumber: pr.number, codexLogins: [...CODEX] });
        const receipt = codexState(review)?.commit_sha === pr.head.sha;
        const key = `<!-- meta-auto-review head=${pr.head.sha} -->`;
        const requested = review.issue_comments.some(
            (comment) => comment.author === 'github-actions[bot]' && comment.body.includes(key)
        );
        if (!receipt && !requested) {
            report(pr.number, apply ? 'requesting Codex review' : 'would request Codex review');
            if (apply) {
                const created = api(repository, `issues/${pr.number}/comments`, 'POST', {
                    body: `@codex review\n\n请用中文评审此 META PR；仅在当前提交检查通过、评审完成且讨论解决后自动普通合并。\n\n${key}`
                });
                if (!api(repository, `issues/comments/${created.id}`).body.includes(key))
                    throw Error('review request readback failed');
            }
            continue;
        }
        const currentReviewIds = pages(repository, `pulls/${pr.number}/reviews`)
            .filter((item) => CODEX.has(item.user?.login) && item.commit_id === pr.head.sha)
            .map((item) => item.id);
        const currentCI = runs.filter((run) => run.event === 'pull_request').sort((a, b) => b.id - a.id)[0];
        if (
            blockedRuns.length ||
            currentCI?.conclusion !== 'success' ||
            !reviewReady(review, pr.head.sha, currentReviewIds)
        ) {
            report(pr.number, 'waiting', 'current PR CI, completed Codex review and resolved findings required');
            continue;
        }
        for (const finding of review.summary_findings.filter((item) => !item.duplicate_of_comment_id)) {
            const comment = api(repository, `issues/comments/${finding.disposition.comment_id}`);
            const permission = api(repository, `collaborators/${encodeURIComponent(comment.user.login)}/permission`);
            if (!['admin', 'maintain', 'write'].includes(permission.permission)) {
                report(pr.number, 'waiting', 'summary disposition requires repository write permission');
                continue candidateLoop;
            }
        }
        const expectedHead = pr.head.sha,
            expectedBase = pr.base.sha;
        pr = api(repository, `pulls/${pr.number}`);
        if (
            !isMetaPullRequest(pr, repository) ||
            pr.head.sha !== expectedHead ||
            pr.base.sha !== expectedBase ||
            pr.mergeable_state !== 'clean'
        ) {
            report(pr.number, 'waiting', 'head/base changed or protected merge gates not clean');
            continue;
        }
        report(pr.number, apply ? 'merging with merge commit' : 'would merge with merge commit');
        if (apply) {
            const result = api(repository, `pulls/${pr.number}/merge`, 'PUT', {
                sha: expectedHead,
                merge_method: 'merge'
            });
            if (!result.merged || !api(repository, `pulls/${pr.number}`).merged) throw Error('merge readback failed');
            // GITHUB_TOKEN merges do not produce an ordinary push-triggered workflow run.
            ensureMainCI(repository, ciWorkflow, result.sha, pr.number, apply);
            report(pr.number, 'merged', result.sha);
        }
    }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const args = process.argv.slice(2);
    if (args.some((arg) => arg !== '--apply')) throw Error('Usage: maintain-meta-pr [--apply]');
    maintainMetaPullRequests({
        repository: process.env.GH_REPO ?? process.env.GITHUB_REPOSITORY,
        apply: args.includes('--apply')
    });
}
