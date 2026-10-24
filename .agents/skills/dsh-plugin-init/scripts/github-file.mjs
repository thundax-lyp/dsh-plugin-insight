import { execFileSync } from 'node:child_process';

export const META_REPOSITORY = 'thundax-lyp/dsh-plugin-meta';
export const META_BRANCH = 'main';
export const META_PATH = 'data/META.jsonl';
export const MANIFEST_PATH = 'data/PACKAGE-MANIFEST.jsonl';

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
