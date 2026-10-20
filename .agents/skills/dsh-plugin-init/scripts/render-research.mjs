#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, relative, dirname, isAbsolute } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';
import Ajv from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';
import { ROOT, read, validate as validateCatalog } from '../../_shared/scripts/plugin-data.mjs';
import { validateMetadata } from '../../dsh-plugin-insight/scripts/capture-plugin-meta.mjs';
import { template } from './publication/template.mjs';
import {
    categoryGroups,
    renderCategoryIndex,
    renderHomeCategories,
    renderUpdated,
    renderIssueActivity,
    renderWeeklyNew,
    renderLatest,
    renderHot,
    renderRecommended,
    renderCategories,
    renderSources
} from './publication/blocks.mjs';
import { REGISTRY, pluginDirectory } from '../../_shared/scripts/data-paths.mjs';
import { validateManifest } from './research-session.mjs';
import { validateManifestPlugin } from './publication-data.mjs';
const ajv = new Ajv({ strict: true, allErrors: true });
addFormats(ajv);
const check = ajv.compile(read(resolve(ROOT, '.agents/skills/_shared/schemas/publication.schema.json')));
const sources = [
    'https://github.com/awesome-dsh-plugin/awesome-dsh-plugin',
    'https://github.com/0xsline/awesome-deepseek-harness'
];
const clean = (text) => text.replace(/[\r\n]/g, ' ').replace(/[\[\]<>|]/g, '');
function local(root, path) {
    const full = resolve(root, path);
    if (isAbsolute(path) || relative(root, full).startsWith('..')) throw Error('path must be inside project');
    return full;
}
export function relativeTime(date, at) {
    const a = Date.parse(at),
        d = Date.parse(date);
    if (!Number.isFinite(a) || !Number.isFinite(d) || d > a) return '暂未获取';
    const days = Math.floor((a + 8 * 3600000) / 86400000) - Math.floor((d + 8 * 3600000) / 86400000);
    if (days < 3) return ['今天', '昨天', '前天'][days];
    return days < 30 ? `${days}天前` : days < 365 ? `${Math.floor(days / 30)}个月前` : `${Math.floor(days / 365)}年前`;
}
export function renderDetailReport(report, item) {
    const versionUrl = `https://github.com/${item.repository}/tree/${item.revision}${item.path ? `/${item.path}` : ''}`;
    return report
        .replace(/\n## 固定范围与依据\n[\s\S]*?(?=\n## )/, `\n## 版本\n\n固定提交 [${item.revision}](${versionUrl})\n`)
        .replace(/\n## 代码评价\n\n([\s\S]*?)\n## 可借鉴处\n\n/, '\n## 工程亮点\n\n$1\n\n')
        .replace(/\n## 验证与边界\n/, '\n## 核查说明\n');
}
export function latestManifestItems(manifests) {
    const latest = new Map();
    for (const manifest of manifests)
        for (const item of manifest.items) latest.set(item.id, { item, checked_at: manifest.checked_at });
    return [...latest.values()];
}
export function renderPublication(input, root = ROOT, context = null) {
    if (!check(input)) throw Error(ajv.errorsText(check.errors));
    const text = (path) => readFileSync(local(root, path), 'utf8');
    const manifests = input.records
        ? [{ checked_at: input.checked_at, sources: [], items: input.records }]
        : [...new Set([...(input.manifests ?? []), input.manifest])].map((path) =>
              validateManifest(read(local(root, path)))
          );
    const manifest = manifests.at(-1);
    if (manifests.some((saved) => !saved.sources.every((s) => sources.includes(s.url))))
        throw Error('unexpected discovery source');
    const catalog = context?.catalog ?? read(local(root, input.catalog));
    validateCatalog(catalog);
    const metadataDates = new Set();
    const items = latestManifestItems(manifests)
        .filter(({ item }) => item.status === 'complete')
        .map(({ item: i, checked_at: manifestCheckedAt }) => {
            const plugin = catalog.plugins.find((p) => p.id === i.id);
            validateManifestPlugin(i, plugin, catalog, i.checked_at ?? manifestCheckedAt);
            const detailPath = (context?.registry?.[plugin.id] ?? pluginDirectory(plugin, root)) + '/INSIGHT.md';
            const report = context?.reports[i.id] ?? text(detailPath);
            const summary = input.summaries?.[i.id];
            if (
                !summary ||
                summary.revision !== i.revision ||
                !summary.source_url.startsWith(`https://github.com/${i.repository}/blob/${i.revision}/`)
            )
                throw Error(`pinned author summary required: ${i.id}`);
            if (!report.includes(`> ${summary.text}`)) throw Error(`detail summary differs: ${i.id}`);
            const labels = ['用途', '亮点', '思考', '建议'];
            const shortItems = labels.map((label) => {
                const sourceLabel = label === '思考' ? '(?:思考|关键质疑)' : label;
                const matches = [
                    ...report.matchAll(new RegExp(`^- \\*\\*${sourceLabel}(?:：\\*\\*|\\*\\*：)(.+)$`, 'gm'))
                ];
                if (matches.length !== 1) throw Error(`detail needs one ${label}: ${i.id}`);
                return template('SHORT-ITEM', { label, text: matches[0][1] });
            });
            const short = shortItems.join('\n');
            const homeShort = [shortItems[0], template('SHORT-ITEM', { label: '亮点', text: summary.text })].join('\n');
            const title = report.match(/^# [^\n]+/)?.[0];
            if (!title) throw Error('detail needs a title');
            const capabilities = input.capabilities?.[i.id];
            if (!capabilities || capabilities.revision !== i.revision)
                throw Error(`pinned capability inventory required: ${i.id}`);
            for (const [name, value] of Object.entries(capabilities.items))
                if (!report.includes(`- **${name}**：${value}`))
                    throw Error(`detail capability differs: ${i.id}/${name}`);
            const advice = input.advice?.[i.id];
            if (advice && advice.revision !== i.revision) throw Error(`advice revision differs: ${i.id}`);
            if (advice && !report.includes(advice.text)) throw Error(`detail advice differs: ${i.id}`);
            const description = report.match(/^- \*\*用途(?:：\*\*|\*\*：)(.+)$/m)[1].split(/[。！？]/)[0];
            const anchor = `plugin-${plugin.repository_id}-${plugin.component_id}`;
            const path = input.metadata?.[i.id];
            let npmFirstPublished = null,
                needsReview = false,
                stars = null,
                pushedAt = null,
                pushedLabel = null,
                issues = renderIssueActivity(null, plugin.repository);
            let starsBadge = template('BADGE', {
                alt: 'GitHub ★ 暂未获取',
                image:
                    'https://img.shields.io/static/v1?' +
                    new URLSearchParams({
                        label: 'GitHub ★',
                        message: '暂未获取',
                        color: 'lightgrey',
                        logo: 'github',
                        style: 'flat'
                    }).toString(),
                url: `https://github.com/${plugin.repository}`
            });
            let pushedBadge = template('BADGE', {
                alt: '最后更新 暂未获取',
                image:
                    'https://img.shields.io/static/v1?' +
                    new URLSearchParams({
                        label: '最后更新',
                        message: '暂未获取',
                        color: 'lightgrey',
                        logo: 'github',
                        style: 'flat'
                    }).toString(),
                url: `https://github.com/${plugin.repository}/commits`
            });
            let meta = template('META', { stars: starsBadge, downloads: '', updated: pushedBadge, review: '' });
            if (path) {
                const m = validateMetadata(context?.metadata[i.id] ?? read(local(root, path)));
                if (m.repository_id !== null && m.repository_id !== plugin.repository_id)
                    throw Error('metadata repository identity differs');
                if (m.repository.toLowerCase() !== plugin.repository.toLowerCase())
                    throw Error('metadata repository differs');
                const n = (v) => (v === null ? '暂未获取' : v);
                issues = renderIssueActivity(m, m.repository);
                // A declared package name with two 404 responses is not a confirmed npm publication.
                // Retain the failed capture in metadata without advertising an unverified package.
                const npmAvailable = m.npm && !(m.npm.error === 'HTTP 404' && m.npm.publication?.error === 'HTTP 404');
                const badge = npmAvailable
                    ? 'https://img.shields.io/static/v1?' +
                      new URLSearchParams({
                          label: 'npm 30d',
                          message:
                              m.npm.downloads_30d === null ? '暂未获取' : m.npm.downloads_30d.toLocaleString('en-US'),
                          color: m.npm.downloads_30d === null ? 'lightgrey' : 'blue',
                          logo: 'npm',
                          style: 'flat'
                      }).toString()
                    : null;
                const downloads = npmAvailable
                    ? ' · ' +
                      template('BADGE', {
                          alt: `npm 30d ${n(m.npm.downloads_30d)}`,
                          image: badge,
                          url: `https://www.npmjs.com/package/${m.npm.package_name}`
                      })
                    : '';
                npmFirstPublished = m.npm?.publication?.error ? null : (m.npm?.publication?.first_published_at ?? null);
                for (const at of [m.captured_at, m.npm?.captured_at, m.npm?.publication?.captured_at].filter(Boolean))
                    metadataDates.add(new Date(Date.parse(at) + 8 * 3600000).toISOString().slice(0, 10));
                const starImage =
                    'https://img.shields.io/static/v1?' +
                    new URLSearchParams({
                        label: 'GitHub ★',
                        message: String(n(m.stars)),
                        color: 'yellow',
                        logo: 'github',
                        style: 'flat'
                    }).toString();
                needsReview = m.code_update?.script_changed === true;
                const update = needsReview
                    ? ' · **脚本有更新，待重新洞察**'
                    : m.code_update?.script_changed === null
                      ? ' · 脚本更新状态暂未确认'
                      : '';
                stars = m.stars;
                pushedAt = m.pushed_at;
                pushedLabel = m.pushed_at ? relativeTime(m.pushed_at, m.captured_at) : null;
                starsBadge = template('BADGE', {
                    alt: `GitHub ★ ${n(m.stars)}`,
                    image: starImage,
                    url: `https://github.com/${m.repository}`
                });
                const updatedLabel = pushedLabel ?? '暂未获取';
                const updatedImage =
                    'https://img.shields.io/static/v1?' +
                    new URLSearchParams({
                        label: '最后更新',
                        message: updatedLabel,
                        color: pushedLabel ? 'blue' : 'lightgrey',
                        logo: 'github',
                        style: 'flat'
                    }).toString();
                pushedBadge = template('BADGE', {
                    alt: `最后更新 ${updatedLabel}`,
                    image: updatedImage,
                    url: `https://github.com/${m.repository}/commits`
                });
                meta = template('META', { stars: starsBadge, downloads, updated: pushedBadge, review: update });
            }
            const issueBlock = `## 活跃度\n\n${issues}\n`;
            const reportWithoutMeta = renderDetailReport(report, i).replace(
                /\n<!-- BEGIN META -->\n[\s\S]*?\n<!-- END META -->\n*/,
                '\n'
            );
            const detailMeta = template('DETAIL-META', { meta });
            const reportWithMeta = reportWithoutMeta.replace(/^(# [^\n]+\n\n> [^\n]+)\n+/, `$1\n\n${detailMeta}\n\n`);
            if (reportWithMeta === reportWithoutMeta) throw Error(`detail needs a title and summary: ${i.id}`);
            const detail = /\n## (?:Issue )?活跃度\n/.test(reportWithMeta)
                ? reportWithMeta.replace(/## (?:Issue )?活跃度\n[\s\S]*$/, issueBlock)
                : reportWithMeta.trimEnd() + '\n\n' + issueBlock;
            return {
                i,
                plugin,
                short,
                homeShort,
                summary: summary.text,
                description,
                anchor,
                meta,
                pushedBadge,
                needsReview,
                stars,
                starsBadge,
                pushedAt,
                pushedLabel,
                npmFirstPublished,
                detailPath,
                detail
            };
        });
    const byId = new Map(items.map((p) => [p.i.id, p]));
    if (input.recommendations.length !== new Set(input.recommendations.map((r) => r.plugin_id)).size)
        throw Error('duplicate recommendation');
    const link = (from, to) =>
        relative(dirname(local(root, from)), local(root, to))
            .split('\\')
            .join('/');
    for (const rec of input.recommendations) {
        const entry = byId.get(rec.plugin_id);
        if (!entry) throw Error('recommendation must reference completed analysis');
        if (
            rec.kind === 'install' &&
            !entry.plugin.evidence.some(
                (e) => e.kind === 'host_acceptance' && e.revision === entry.i.revision && e.environment && e.artifact
            )
        )
            throw Error('install recommendation needs pinned host acceptance');
    }
    const dates = [...metadataDates].sort();
    const updated = dates.at(-1) ?? new Date(Date.parse(manifest.checked_at) + 8 * 3600000).toISOString().slice(0, 10);
    const directory = dirname(input.catalog_page);
    const groups = categoryGroups(items).map((g) => ({ ...g, path: `${directory}/${g.key.toUpperCase()}.md` }));
    const categoryPages = groups.map((g) => ({
        path: g.path,
        content:
            template('CATEGORY-PAGE', {
                name: g.name,
                home: link(g.path, 'README.md'),
                categories: renderCategories(g.entries, (e) => link(g.path, e.detailPath)),
                updated: renderUpdated(updated)
            }) + '\n'
    }));
    const catalogPage =
        template('CATALOG', {
            updated: renderUpdated(updated),
            categories: renderCategoryIndex(groups.map((g) => ({ ...g, href: link(input.catalog_page, g.path) })))
        }) + '\n';
    const homeGroups = groups.map((g) => ({ ...g, href: link('README.md', g.path) }));
    const homeItems = items.map((e) => ({ ...e, href: e.detailPath }));
    const homeById = new Map(homeItems.map((e) => [e.i.id, e]));
    const readme =
        template('README', {
            updated: renderUpdated(updated),
            weekly_new: renderWeeklyNew(homeItems, updated),
            latest: renderLatest(homeItems),
            hot: renderHot(homeItems),
            recommended: renderRecommended(input.recommendations, homeById),
            categories: renderHomeCategories(homeGroups, (e) => e.detailPath),
            sources: renderSources(sources)
        }) + '\n';
    const registry = context?.registry
        ? structuredClone(context.registry)
        : existsSync(local(root, REGISTRY))
          ? read(local(root, REGISTRY))
          : {};
    for (const plugin of catalog.plugins) registry[plugin.id] ??= pluginDirectory(plugin, root);
    return {
        readme,
        catalog: catalogPage,
        categoryPages,
        details: items.map((e) => ({ path: e.detailPath, content: e.detail })),
        registry
    };
}
export async function main(args = process.argv.slice(2)) {
    const { values: v } = parseArgs({
        args,
        options: { input: { type: 'string' }, check: { type: 'boolean', default: false } }
    });
    if (!v.input) throw Error('--input is required');
    if (existsSync(resolve(ROOT, 'data/catalog/SNAPSHOT.json'))) {
        const { renderSnapshot } = await import('./snapshot-data.mjs');
        renderSnapshot(ROOT, v.check);
        return;
    }
    const input = read(resolve(v.input));
    const result = renderPublication(input);
    // Validate all output before writing either artifact.
    for (const [path, content] of [
        ['README.md', result.readme],
        [input.catalog_page, result.catalog],
        ...result.details.map((d) => [d.path, d.content]),
        ...result.categoryPages.map((d) => [d.path, d.content]),
        [REGISTRY, JSON.stringify(result.registry, null, 2) + '\n']
    ]) {
        const target = local(ROOT, path);
        if (v.check) {
            if (!existsSync(target) || readFileSync(target, 'utf8') !== content)
                throw Error(`generated output differs: ${path}`);
        } else {
            mkdirSync(dirname(target), { recursive: true });
            writeFileSync(target, content);
        }
    }
    console.log(v.check ? 'Research navigation matches inputs' : 'Research navigation generated');
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    main().catch((error) => {
        console.error(error.message);
        process.exitCode = 1;
    });
}
