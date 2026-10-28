#!/usr/bin/env node
import { api } from './github-client.mjs';
export { api } from './github-client.mjs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import { atomicWrite, digest } from './plugin-data.mjs';

export const releaseFingerprint = (releases) =>
    digest(
        releases
            .map((release) => ({
                id: release.id,
                tag: release.tag_name,
                published_at: release.published_at,
                body: release.body ?? null,
                prerelease: release.prerelease,
                draft: release.draft,
                assets: release.assets
                    .map((asset) =>
                        Object.fromEntries(
                            ['id', 'name', 'size', 'updated_at', 'digest'].map((key) => [key, asset[key] ?? null])
                        )
                    )
                    .sort((a, b) => a.id - b.id)
            }))
            .sort((a, b) => a.id - b.id)
    );

export const capture = (repository, request = api) => {
    if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(repository)) throw new Error('expected owner/repository');
    const metadata = request(`repos/${repository}`);
    const canonical = metadata.full_name;
    const head = request(`repos/${canonical}/commits/${encodeURIComponent(metadata.default_branch)}`);
    const sha = head.sha;
    const tree = request(`repos/${canonical}/git/trees/${head.commit.tree.sha}?recursive=1`);
    const releases = request(`repos/${canonical}/releases?per_page=100`);
    const paths = new Set(tree.tree.filter((entry) => entry.type === 'blob').map((entry) => entry.path));
    const files = {};
    for (const name of ['README.md', 'readme.md', 'CATALOG.md', 'package.json', 'dsh.bundle.json']) {
        if (!paths.has(name)) continue;
        const content = request(`repos/${canonical}/contents/${name}?ref=${sha}`);
        if (content.encoding !== 'base64')
            throw new Error(`content too large or unsupported: ${name}; retrieve separately at ${sha}`);
        files[name] = new TextDecoder('utf-8', { fatal: true }).decode(Buffer.from(content.content, 'base64'));
    }
    return {
        captured_at: new Date().toISOString(),
        repository_id: metadata.id,
        repository: canonical,
        commit: sha,
        metadata: Object.fromEntries(
            [
                'id',
                'full_name',
                'description',
                'default_branch',
                'archived',
                'disabled',
                'created_at',
                'pushed_at',
                'license',
                'topics',
                'html_url'
            ].map((key) => [key, metadata[key] ?? null])
        ),
        tree,
        releases,
        files,
        fingerprints: {
            code: head.commit.tree.sha,
            release: releaseFingerprint(releases),
            maintenance: digest(
                Object.fromEntries(['archived', 'disabled', 'pushed_at'].map((key) => [key, metadata[key]]))
            )
        },
        limitations: [
            '默认分支快照不证明发布包或运行时行为。',
            '发布接口最多采集 100 条，不声称完整发布历史。',
            '文件树指纹包括文档和生成文件，判断有效工程量前须检查差异。',
            ...(tree.truncated ? ['递归文件树被截断，分析前须补充相关子树。'] : [])
        ]
    };
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    try {
        const { values, positionals } = parseArgs({ options: { out: { type: 'string' } }, allowPositionals: true });
        if (positionals.length !== 1 || !values.out) throw new Error('Usage: capture-github.mjs OWNER/REPO --out FILE');
        const result = capture(positionals[0]);
        atomicWrite(values.out, result);
        console.log(`Captured ${result.repository} at ${result.commit}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exitCode = 1;
    }
}
