import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';

export const REPOSITORIES_PER_QUERY = 50;
const execFileAsync = promisify(execFile);

const repositoryPattern = /^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/;

export function buildRepositoryQuery(repositories) {
    if (!Array.isArray(repositories) || !repositories.length || repositories.length > REPOSITORIES_PER_QUERY)
        throw new Error(`expected 1-${REPOSITORIES_PER_QUERY} repositories`);
    return `query {\n${repositories
        .map((repository, index) => {
            if (!repositoryPattern.test(repository)) throw new Error(`invalid repository: ${repository}`);
            const [owner, name] = repository.split('/');
            return `  r${index}: repository(owner: ${JSON.stringify(owner)}, name: ${JSON.stringify(name)}) { databaseId nameWithOwner isArchived isDisabled pushedAt defaultBranchRef { target { oid } } }`;
        })
        .join('\n')}\n}`;
}

export function githubGraphql(query) {
    try {
        return JSON.parse(
            execFileSync('gh', ['api', 'graphql', '-f', `query=${query}`], {
                encoding: 'utf8',
                timeout: 90_000,
                maxBuffer: 64 * 1024 * 1024,
                stdio: ['ignore', 'pipe', 'pipe']
            })
        );
    } catch (error) {
        const output = error.stdout?.toString().trim();
        if (output) {
            try {
                const partial = JSON.parse(output);
                if (partial?.data) return partial;
            } catch {
                // Report the original GitHub error below when stdout is not usable JSON.
            }
        }
        throw new Error(`GitHub GraphQL request failed: ${error.stderr?.toString().trim() || error.message}`);
    }
}

export async function githubGraphqlAsync(query) {
    try {
        const { stdout } = await execFileAsync('gh', ['api', 'graphql', '-f', `query=${query}`], {
            encoding: 'utf8',
            timeout: 90_000,
            maxBuffer: 64 * 1024 * 1024
        });
        return JSON.parse(stdout);
    } catch (error) {
        const output = error.stdout?.toString().trim();
        if (output) {
            try {
                const partial = JSON.parse(output);
                if (partial?.data) return partial;
            } catch {
                // Report the original GitHub error below when stdout is not usable JSON.
            }
        }
        throw new Error(`GitHub GraphQL request failed: ${error.stderr?.toString().trim() || error.message}`);
    }
}

const readBatch = (batch, payload, results) => {
    if (!payload || typeof payload !== 'object' || !payload.data) throw new Error('GitHub GraphQL returned no data');
    batch.forEach((repository, index) => {
        const value = payload.data[`r${index}`] ?? null;
        const valid =
            Number.isSafeInteger(value?.databaseId) &&
            repositoryPattern.test(value?.nameWithOwner ?? '') &&
            typeof value?.defaultBranchRef?.target?.oid === 'string';
        results.set(
            repository,
            valid
                ? {
                      repository_id: value.databaseId,
                      repository: value.nameWithOwner,
                      revision: value.defaultBranchRef.target.oid,
                      archived: value.isArchived === true,
                      disabled: value.isDisabled === true,
                      pushed_at: value.pushedAt ?? null
                  }
                : null
        );
    });
};

export function resolveRepositories(repositories, request = githubGraphql) {
    const unique = [...new Set(repositories.map((repository) => repository.toLowerCase()))].sort();
    const results = new Map();
    for (let offset = 0; offset < unique.length; offset += REPOSITORIES_PER_QUERY) {
        const batch = unique.slice(offset, offset + REPOSITORIES_PER_QUERY);
        readBatch(batch, request(buildRepositoryQuery(batch)), results);
    }
    return results;
}

export async function resolveRepositoriesAsync(repositories, request = githubGraphqlAsync, concurrency = 4) {
    if (!Number.isSafeInteger(concurrency) || concurrency < 1 || concurrency > 8)
        throw new Error('concurrency must be between 1 and 8');
    const unique = [...new Set(repositories.map((repository) => repository.toLowerCase()))].sort();
    const batches = [];
    for (let offset = 0; offset < unique.length; offset += REPOSITORIES_PER_QUERY)
        batches.push(unique.slice(offset, offset + REPOSITORIES_PER_QUERY));
    const results = new Map();
    let cursor = 0;
    const worker = async () => {
        while (cursor < batches.length) {
            const batch = batches[cursor++];
            readBatch(batch, await request(buildRepositoryQuery(batch)), results);
        }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, batches.length) }, worker));
    return results;
}
