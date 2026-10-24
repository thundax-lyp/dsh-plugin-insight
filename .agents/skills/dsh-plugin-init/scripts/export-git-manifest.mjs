import { validatePackages } from './export-package-manifest.mjs';

const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;
const sorted = (values) => [...new Set(values)].sort();

export function validateGitManifest(records) {
    let previousId = 0;
    const nodes = new Set();
    const aliases = new Set();
    for (const row of records) {
        if (
            !row ||
            Object.keys(row).sort().join(',') !== 'node_id,npm_packages,repository,repository_id,source_repositories'
        )
            throw Error('invalid Git manifest fields');
        if (!Number.isSafeInteger(row.repository_id) || row.repository_id <= previousId)
            throw Error('Git repository IDs must be positive, unique and numerically sorted');
        if (typeof row.node_id !== 'string' || !row.node_id || nodes.has(row.node_id))
            throw Error('invalid or duplicate Git node ID');
        if (!repositoryPattern.test(row.repository)) throw Error('invalid Git repository name');
        validatePackages(row.npm_packages);
        if (
            !Array.isArray(row.source_repositories) ||
            !row.source_repositories.length ||
            JSON.stringify(sorted(row.source_repositories)) !== JSON.stringify(row.source_repositories)
        )
            throw Error('invalid Git source repositories');
        for (const alias of row.source_repositories) {
            if (!repositoryPattern.test(alias) || alias !== alias.toLowerCase() || aliases.has(alias))
                throw Error('invalid or conflicting Git repository alias');
            aliases.add(alias);
        }
        nodes.add(row.node_id);
        previousId = row.repository_id;
    }
    return records;
}
export function renderGitManifest(records) {
    validateGitManifest(records);
    return (
        records
            .map((row) =>
                JSON.stringify({
                    repository_id: row.repository_id,
                    node_id: row.node_id,
                    repository: row.repository,
                    npm_packages: row.npm_packages,
                    source_repositories: row.source_repositories
                })
            )
            .join('\n') + (records.length ? '\n' : '')
    );
}
export function parseGitManifest(text) {
    const records = text === '' ? [] : text.trimEnd().split('\n').map(JSON.parse);
    validateGitManifest(records);
    if (renderGitManifest(records) !== text) throw Error('Git manifest must be canonical JSONL');
    return records;
}
export function buildGitCandidates(work, snapshot) {
    const rows = new Map();
    for (const plugin of work.input.plugins) {
        const id = Number(/^github:([1-9]\d*):/.exec(plugin.id)?.[1]);
        if (!Number.isSafeInteger(id) || !repositoryPattern.test(plugin.repository))
            throw Error(`invalid repository identity: ${plugin.id}`);
        if (plugin.metadata?.repository_id != null && plugin.metadata.repository_id !== id)
            throw Error(`repository ID mismatch: ${plugin.id}`);
        const name = snapshot.metadata[plugin.id]?.npm?.package_name;
        if (name) validatePackages([name]);
        const row = rows.get(id) ?? {
            repository_id: id,
            repository: plugin.repository,
            npm_packages: [],
            source_repositories: []
        };
        row.npm_packages = sorted([...row.npm_packages, ...(name ? [name] : [])]);
        row.source_repositories = sorted([...row.source_repositories, plugin.repository.toLowerCase()]);
        rows.set(id, row);
    }
    return [...rows.values()].sort((a, b) => a.repository_id - b.repository_id);
}
export async function mergeGitManifest(remote, candidates, resolveIdentity) {
    validateGitManifest(remote);
    const rows = new Map(remote.map((row) => [row.repository_id, structuredClone(row)]));
    let added = 0;
    for (const candidate of candidates) {
        let row = rows.get(candidate.repository_id);
        if (!row) {
            const identity = await resolveIdentity(candidate.repository_id);
            if (
                identity.id !== candidate.repository_id ||
                typeof identity.node_id !== 'string' ||
                !identity.node_id ||
                !repositoryPattern.test(identity.full_name)
            )
                throw Error(`cannot verify Git repository ${candidate.repository_id}`);
            row = {
                repository_id: identity.id,
                node_id: identity.node_id,
                repository: identity.full_name,
                npm_packages: [],
                source_repositories: []
            };
            added += 1;
        }
        row.npm_packages = sorted([...row.npm_packages, ...candidate.npm_packages]);
        row.source_repositories = sorted([...row.source_repositories, ...candidate.source_repositories]);
        rows.set(row.repository_id, row);
    }
    const output = validateGitManifest([...rows.values()].sort((a, b) => a.repository_id - b.repository_id));
    return {
        records: output,
        added,
        already_present: candidates.length - added,
        retained: remote.length - (candidates.length - added),
        removed: 0
    };
}
