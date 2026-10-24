#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT } from '../../_shared/scripts/plugin-data.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { SNAPSHOT, validateWork } from './snapshot-data.mjs';
import {
    buildManifest,
    defaultWorkPath,
    parseManifest,
    renderManifest,
    mergePackages
} from './export-package-manifest.mjs';
import { buildGitCandidates, parseGitManifest, renderGitManifest, mergeGitManifest } from './export-git-manifest.mjs';
import {
    githubToken,
    githubRequest,
    readGitHubFile,
    writeGitHubFiles,
    META_REPOSITORY,
    META_BRANCH,
    MANIFEST_PATH,
    GIT_MANIFEST_PATH
} from './github-file.mjs';

export async function syncManifests({
    workPath,
    repository = META_REPOSITORY,
    branch = META_BRANCH,
    apply = false,
    token = githubToken(),
    request = githubRequest,
    readFile = readGitHubFile,
    writeFiles = writeGitHubFiles
}) {
    const work = validateWork(readWork(workPath));
    const snapshot = readSnapshotStorage(resolve(ROOT, SNAPSHOT));
    const npm = buildManifest(workPath, { work, snapshot });
    const candidates = buildGitCandidates(work, snapshot);
    const head = await request(`/repos/${repository}/commits/${encodeURIComponent(branch)}`, token);
    if (!/^[a-f0-9]{40}$/.test(head.sha)) throw Error('invalid remote commit SHA');
    // Pin both files to exactly one commit rather than following a moving branch.
    const [remoteNpm, remoteGit] = await Promise.all([
        readFile(repository, MANIFEST_PATH, head.sha, token),
        readFile(repository, GIT_MANIFEST_PATH, head.sha, token)
    ]);
    const previousPackages = parseManifest(remoteNpm.text);
    const previousRepositories = parseGitManifest(remoteGit.text);
    const mergedNpm = mergePackages(previousPackages, npm.packages);
    const mergedGit = await mergeGitManifest(previousRepositories, candidates, (id) =>
        request(`/repositories/${id}`, token)
    );
    const files = [
        { path: MANIFEST_PATH, text: renderManifest(mergedNpm.packages), previous: remoteNpm.text },
        { path: GIT_MANIFEST_PATH, text: renderGitManifest(mergedGit.records), previous: remoteGit.text }
    ];
    const changed = files.filter((file) => file.text !== file.previous);
    let commit = null;
    let verified = false;
    if (apply && changed.length) {
        commit = await writeFiles({
            repository,
            branch,
            token,
            baseCommit: head.sha,
            files: changed,
            message: 'Data(repo/manifest): 同步 npm 与 Git 仓库清单'
        });
        const afterHead = await request(`/repos/${repository}/commits/${encodeURIComponent(branch)}`, token);
        const after = await Promise.all(files.map((file) => readFile(repository, file.path, afterHead.sha, token)));
        for (let index = 0; index < files.length; index += 1) {
            if (after[index].text !== files[index].text)
                throw Error(`manifest readback mismatch: ${files[index].path}; retain WORK and rerun preview`);
        }
        verified = true;
    } else if (apply) verified = true;
    return {
        ...npm.summary,
        repository,
        branch,
        remote_commit_sha: head.sha,
        npm: {
            path: MANIFEST_PATH,
            remote: previousPackages.length,
            verified: npm.packages.length,
            added: mergedNpm.added,
            already_present: mergedNpm.already_present,
            retained: mergedNpm.retained,
            removed: 0,
            output: mergedNpm.packages.length,
            changed: files[0].text !== files[0].previous
        },
        git: {
            path: GIT_MANIFEST_PATH,
            input_repositories: candidates.length,
            remote: previousRepositories.length,
            added: mergedGit.added,
            already_present: mergedGit.already_present,
            retained: mergedGit.retained,
            removed: 0,
            output: mergedGit.records.length,
            changed: files[1].text !== files[1].previous
        },
        changed: changed.length > 0,
        applied: Boolean(commit),
        verified,
        output_sha256: Object.fromEntries(
            files.map((file) => [file.path, createHash('sha256').update(file.text).digest('hex')])
        ),
        commit_sha: commit?.sha ?? null
    };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const { values } = parseArgs({
        options: {
            work: { type: 'string' },
            repo: { type: 'string', default: META_REPOSITORY },
            branch: { type: 'string', default: META_BRANCH },
            apply: { type: 'boolean', default: false }
        }
    });
    console.log(
        JSON.stringify(
            await syncManifests({
                workPath: resolve(ROOT, values.work ?? defaultWorkPath()),
                repository: values.repo,
                branch: values.branch,
                apply: values.apply
            }),
            null,
            2
        )
    );
}
