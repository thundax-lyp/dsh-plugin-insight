#!/usr/bin/env node
import { createHash } from 'node:crypto';
import { existsSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { ROOT } from '../../_shared/scripts/plugin-data.mjs';
import { readSnapshotStorage } from '../../_shared/scripts/snapshot-storage.mjs';
import { readWork } from '../../_shared/scripts/work-storage.mjs';
import { validateMetadata } from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import { SNAPSHOT, validateWork } from './snapshot-data.mjs';
import {
    githubToken,
    MANIFEST_PATH,
    META_BRANCH,
    META_REPOSITORY,
    readGitHubFile,
    writeGitHubFile
} from './github-file.mjs';

const RUNS = resolve(ROOT, 'data/runs');
const PACKAGE_NAME = /^(?:@[a-z0-9][a-z0-9._~-]*\/)?[a-z0-9][a-z0-9._~-]*$/;
const bytewise = (left, right) => Buffer.compare(Buffer.from(left), Buffer.from(right));
const sha256 = (text) => createHash('sha256').update(text).digest('hex');

function defaultWorkPath() {
    const candidates = readdirSync(RUNS, { withFileTypes: true })
        .filter((entry) => entry.isDirectory())
        .map((entry) => resolve(RUNS, entry.name, 'WORK.json'))
        .filter(existsSync);
    if (candidates.length !== 1)
        throw Error(`expected exactly one active WORK.json, found ${candidates.length}; pass --work explicitly`);
    return candidates[0];
}

function validatePackages(packages) {
    if (!Array.isArray(packages)) throw Error('package manifest must be an array');
    for (let index = 0; index < packages.length; index += 1) {
        const name = packages[index];
        if (typeof name !== 'string' || name.length > 214 || !PACKAGE_NAME.test(name))
            throw Error(`invalid npm package name: ${name}`);
        if (index > 0 && bytewise(packages[index - 1], name) >= 0)
            throw Error('package manifest must be unique and bytewise sorted');
    }
    return packages;
}

function renderManifest(packages) {
    validatePackages(packages);
    return packages.map((packageName) => JSON.stringify({ package: packageName })).join('\n') + '\n';
}

function parseManifest(text) {
    if (text === '') return [];
    if (!text.endsWith('\n')) throw Error('remote package manifest must end with a newline');
    const packages = text
        .slice(0, -1)
        .split('\n')
        .map((line, index) => {
            if (!line) throw Error(`blank package manifest line: ${index + 1}`);
            let record;
            try {
                record = JSON.parse(line);
            } catch (error) {
                throw Error(`invalid package manifest JSON at line ${index + 1}: ${error.message}`);
            }
            if (
                !record ||
                typeof record !== 'object' ||
                Array.isArray(record) ||
                Object.keys(record).length !== 1 ||
                !Object.hasOwn(record, 'package')
            )
                throw Error(`package manifest line ${index + 1} must contain only package`);
            return record.package;
        });
    validatePackages(packages);
    if (renderManifest(packages) !== text) throw Error('remote package manifest is not canonical JSONL');
    return packages;
}

export function mergePackages(remotePackages, verifiedPackages) {
    const remote = new Set(validatePackages(remotePackages));
    const verified = new Set(validatePackages(verifiedPackages));
    return {
        packages: validatePackages([...new Set([...remote, ...verified])].sort(bytewise)),
        already_present: verifiedPackages.filter((packageName) => remote.has(packageName)).length,
        added: verifiedPackages.filter((packageName) => !remote.has(packageName)).length,
        retained: remotePackages.filter((packageName) => !verified.has(packageName)).length
    };
}

function buildManifest(workPath) {
    const work = validateWork(readWork(workPath));
    const snapshot = readSnapshotStorage(resolve(ROOT, SNAPSHOT));
    const names = new Set();
    let componentsWithSourcePackageField = 0;
    let componentsWithVerifiedPackageName = 0;
    let missingWithoutFormalMeta = 0;
    let missingFormalMetaWithoutVerifiedPackage = 0;

    for (const plugin of work.input.plugins) {
        if (['package_name', 'npm_package', 'npm'].some((key) => Object.hasOwn(plugin, key)))
            componentsWithSourcePackageField += 1;
        const metadata = snapshot.metadata[plugin.id];
        if (!metadata) {
            missingWithoutFormalMeta += 1;
            continue;
        }
        validateMetadata(metadata);
        const packageName = metadata.npm?.package_name;
        if (!packageName) {
            missingFormalMetaWithoutVerifiedPackage += 1;
            continue;
        }
        if (!PACKAGE_NAME.test(packageName)) throw Error(`invalid verified npm package name for ${plugin.id}`);
        componentsWithVerifiedPackageName += 1;
        names.add(packageName);
    }

    const packages = validatePackages([...names].sort(bytewise));
    return {
        packages,
        summary: {
            work_file: workPath,
            run_id: work.input.id,
            total_components: work.input.plugins.length,
            components_with_source_package_field: componentsWithSourcePackageField,
            components_with_verified_package_name: componentsWithVerifiedPackageName,
            unique_package_names: packages.length,
            missing_package_names: work.input.plugins.length - componentsWithVerifiedPackageName,
            missing_without_formal_meta: missingWithoutFormalMeta,
            missing_formal_meta_without_verified_package: missingFormalMetaWithoutVerifiedPackage
        }
    };
}

async function readRemoteManifest(repository, path, branch, token) {
    const value = await readGitHubFile(repository, path, branch, token);
    return { ...value, packages: parseManifest(value.text) };
}

async function writeRemoteManifest(repository, path, branch, token, blobSha, text) {
    return writeGitHubFile({
        repository,
        path,
        branch,
        token,
        blobSha,
        text,
        message: 'Data(repo/manifest): 追加已核实 npm 包名'
    });
}

async function main() {
    const { values } = parseArgs({
        options: {
            work: { type: 'string' },
            repo: { type: 'string', default: META_REPOSITORY },
            path: { type: 'string', default: MANIFEST_PATH },
            branch: { type: 'string', default: META_BRANCH },
            apply: { type: 'boolean', default: false }
        }
    });
    const workPath = resolve(ROOT, values.work ?? defaultWorkPath());
    const { packages: verifiedPackages, summary } = buildManifest(workPath);
    const token = githubToken();
    const remote = await readRemoteManifest(values.repo, values.path, values.branch, token);
    const merged = mergePackages(remote.packages, verifiedPackages);
    const text = renderManifest(merged.packages);
    const changed = remote.text !== text;
    let commit = null;
    if (values.apply && changed)
        commit = await writeRemoteManifest(values.repo, values.path, values.branch, token, remote.blob_sha, text);
    console.log(
        JSON.stringify(
            {
                ...summary,
                repository: values.repo,
                branch: values.branch,
                path: values.path,
                remote_package_names: remote.packages.length,
                already_present_package_names: merged.already_present,
                added_package_names: merged.added,
                retained_remote_package_names: merged.retained,
                removed_package_names: 0,
                output_package_names: merged.packages.length,
                remote_blob_sha: remote.blob_sha,
                output_sha256: sha256(text),
                changed,
                applied: Boolean(commit),
                commit_sha: commit?.commit?.sha ?? null,
                commit_url: commit?.commit?.html_url ?? null
            },
            null,
            2
        )
    );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
