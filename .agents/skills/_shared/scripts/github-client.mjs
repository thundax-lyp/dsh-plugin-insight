import { execFile, execFileSync } from 'node:child_process';
import { promisify } from 'node:util';

// GitHub 访问：REST、批量身份解析与文件读写。

export const api = (endpoint) => {
    try {
        return JSON.parse(
            execFileSync('gh', ['api', endpoint], {
                encoding: 'utf8',
                timeout: 90_000,
                maxBuffer: 64 * 1024 * 1024,
                stdio: ['ignore', 'pipe', 'pipe']
            })
        );
    } catch (error) {
        throw new Error(`GitHub request failed for ${endpoint}: ${error.stderr?.toString().trim() || error.message}`);
    }
};

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
            let payload;
            for (let attempt = 0; attempt < 3; attempt++) {
                try {
                    payload = await request(buildRepositoryQuery(batch));
                    break;
                } catch (error) {
                    if (attempt === 2) {
                        console.error(`Repository batch failed after retries: ${error.message}`);
                        payload = { data: {} };
                    }
                }
            }
            readBatch(batch, payload, results);
        }
    };
    await Promise.all(Array.from({ length: Math.min(concurrency, batches.length) }, worker));
    return results;
}

export const META_REPOSITORY = 'thundax-lyp/dsh-plugin-meta';
export const META_BRANCH = 'main';
export const META_PATH = 'data/NPM-META.jsonl';
export const MANIFEST_PATH = 'data/NPM-MANIFEST.jsonl';
export const GIT_MANIFEST_PATH = 'data/GIT-MANIFEST.jsonl';

export function githubToken() {
    const environmentToken = process.env.GH_TOKEN ?? process.env.GITHUB_TOKEN;
    if (environmentToken) return environmentToken;
    try {
        const token = execFileSync('gh', ['auth', 'token'], {
            encoding: 'utf8',
            stdio: ['ignore', 'pipe', 'ignore']
        }).trim();
        if (token) return token;
    } catch {}
    throw Error('GitHub authentication required: set GH_TOKEN/GITHUB_TOKEN or run gh auth login');
}

export async function githubRequest(endpoint, token, options = {}) {
    const response = await fetch(`https://api.github.com${endpoint}`, {
        ...options,
        headers: {
            accept: 'application/vnd.github+json',
            authorization: `Bearer ${token}`,
            'x-github-api-version': '2022-11-28',
            ...options.headers
        },
        signal: AbortSignal.timeout(30000)
    });
    const value = await response.json().catch(() => ({}));
    if (!response.ok) throw Error(`GitHub API ${response.status}: ${value.message ?? response.statusText}`);
    return value;
}

export function contentEndpoint(repository, path, branch) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw Error('invalid GitHub repository');
    if (!path || path.startsWith('/') || path.split('/').some((part) => !part || part === '..'))
        throw Error('invalid repository path');
    if (!branch) throw Error('GitHub branch is required');
    const encodedPath = path.split('/').map(encodeURIComponent).join('/');
    return `/repos/${repository}/contents/${encodedPath}?ref=${encodeURIComponent(branch)}`;
}

export async function readGitHubFile(repository, path, branch, token = githubToken()) {
    const value = await githubRequest(contentEndpoint(repository, path, branch), token);
    if (value.type !== 'file' || !value.sha) throw Error('GitHub response is not a file');
    let content = value.content;
    let encoding = value.encoding;
    if (encoding !== 'base64' || typeof content !== 'string') {
        const blob = await githubRequest(`/repos/${repository}/git/blobs/${value.sha}`, token);
        content = blob.content;
        encoding = blob.encoding;
    }
    if (encoding !== 'base64' || typeof content !== 'string') throw Error('GitHub file is not base64 encoded');
    return {
        blob_sha: value.sha,
        text: Buffer.from(content.replaceAll('\n', ''), 'base64').toString('utf8'),
        token
    };
}

export async function writeGitHubFile({ repository, path, branch, token, blobSha, text, message }) {
    const endpoint = contentEndpoint(repository, path, branch).replace(/\?ref=.*$/, '');
    return githubRequest(endpoint, token, {
        method: 'PUT',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
            message,
            content: Buffer.from(text).toString('base64'),
            sha: blobSha,
            branch
        })
    });
}

// Publish both manifests against one fixed branch head. A concurrent branch update
// makes this commit non-fast-forward, so the ref update fails instead of overwriting it.
export async function writeGitHubFiles({
    repository,
    branch,
    token,
    baseCommit,
    files,
    message,
    request = githubRequest
}) {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository) || !branch) throw Error('invalid GitHub target');
    for (const file of files) contentEndpoint(repository, file.path, branch);
    const base = await request(`/repos/${repository}/git/commits/${baseCommit}`, token);
    const tree = [];
    for (const file of files) {
        const blob = await request(`/repos/${repository}/git/blobs`, token, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ content: file.text, encoding: 'utf-8' })
        });
        tree.push({ path: file.path, mode: '100644', type: 'blob', sha: blob.sha });
    }
    const createdTree = await request(`/repos/${repository}/git/trees`, token, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ base_tree: base.tree.sha, tree })
    });
    const commit = await request(`/repos/${repository}/git/commits`, token, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ message, tree: createdTree.sha, parents: [baseCommit] })
    });
    const encodedBranch = branch.split('/').map(encodeURIComponent).join('/');
    await request(`/repos/${repository}/git/refs/heads/${encodedBranch}`, token, {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ sha: commit.sha, force: false })
    });
    return commit;
}
