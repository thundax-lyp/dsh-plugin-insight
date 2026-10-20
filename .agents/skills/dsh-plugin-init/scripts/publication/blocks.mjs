import { template } from './template.mjs';
// Reader-facing blocks shared by README and the standalone classification page.
const clean = (text) => text.replace(/[\r\n]/g, ' ').replace(/[\[\]<>|]/g, '');
const tableCell = (text) =>
    text
        .replace(/[\r\n]/g, ' ')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\|/g, '&#124;');
const categoryNames = {
    'office-operations': '办公与运营',
    'software-delivery': '软件交付',
    'research-knowledge': '研究与知识',
    'customer-service': '客户服务',
    'content-creation': '内容生产',
    'personal-productivity': '个人效率',
    infrastructure: '基础设施',
    other: '其他'
};
const categoryScopes = {
    'personal-productivity': '输入、会话、快捷操作与个人工作体验',
    'office-operations': '工作记录、日程、团队用量与日常运营',
    'research-knowledge': '信息检索、网页读取、笔记与长期知识',
    infrastructure: '模型接入、认证、运行环境与系统支撑',
    'software-delivery': '代码开发、任务编排、调试与交付流程',
    'content-creation': '写作、语音、图片与视频内容生产',
    'customer-service': '客户沟通、服务响应与支持流程',
    other: '其他尚未归入上述场景的插件'
};
export const categoryScope = (key) => categoryScopes[key] ?? categoryScopes.other;
const nameLink = (e) => template('LINK', { label: clean(e.plugin.name), url: e.href ?? `#${e.anchor}` });
export function renderIssueActivity(metadata, repository) {
    const end = metadata?.captured_at;
    const start = metadata?.window_start;
    const range = start && end ? `${start}..${end}` : null;
    const fields = [
        ['Issue 未关闭', 'open', 'is:issue is:open'],
        ['近30天新建', 'created_30d', `is:issue${range ? ` created:${range}` : ''}`],
        ['近30天关闭', 'closed_30d', `is:issue is:closed${range ? ` closed:${range}` : ''}`]
    ];
    const date = end ? new Date(Date.parse(end) + 8 * 3600000).toISOString().slice(0, 10) : '暂未获取';
    const available = fields.filter(
        ([, field]) => metadata?.issues?.[field] !== null && metadata?.issues?.[field] !== undefined
    );
    if (!available.length)
        return template('ISSUES-UNAVAILABLE', { date, url: `https://github.com/${repository}/issues` });
    const missing = fields.filter(
        ([, field]) => metadata?.issues?.[field] === null || metadata?.issues?.[field] === undefined
    );
    const metrics = available.map(([label, field, query]) => {
        const message = metadata.issues[field].toLocaleString('en-US');
        return template('BADGE', {
            alt: `${label} ${message}`,
            image:
                'https://img.shields.io/static/v1?' +
                new URLSearchParams({ label, message, color: 'grey', logo: 'github', style: 'flat' }).toString(),
            url: `https://github.com/${repository}/issues?` + new URLSearchParams({ q: query }).toString()
        });
    });
    return template('ISSUES', {
        metrics: metrics.join(' · '),
        notice: missing.length
            ? template('ISSUES-MISSING', { fields: missing.map(([label]) => label).join('、') })
            : '',
        date
    });
}
export const renderUpdated = (date) => template('UPDATED', { date });
export function renderWeeklyNew(items, date) {
    const day = new Date(date + 'T00:00:00Z');
    const start = new Date(day);
    start.setUTCDate(start.getUTCDate() - ((start.getUTCDay() + 6) % 7));
    const from = start.toISOString().slice(0, 10);
    const selected = items
        .filter((e) => {
            if (!e.npmFirstPublished) return false;
            const d = new Date(Date.parse(e.npmFirstPublished) + 8 * 3600000).toISOString().slice(0, 10);
            return d >= from && d <= date;
        })
        .sort(
            (a, b) => Date.parse(b.npmFirstPublished) - Date.parse(a.npmFirstPublished) || a.i.id.localeCompare(b.i.id)
        );
    if (!selected.length) return '';
    return template('WEEKLY-NEW', {
        items: selected
            .map((e) => template('LATEST-ITEM', { plugin: nameLink(e), summary: clean(e.summary) }))
            .join('\n')
    });
}
export function renderLatest(items, date, limit = 5) {
    const end = Date.parse(date + 'T23:59:59+08:00');
    const selected = items
        .filter(
            (e) =>
                e.npmFirstPublished &&
                Date.parse(e.npmFirstPublished) <= end &&
                Date.parse(e.npmFirstPublished) > end - 30 * 86400000
        )
        .sort(
            (a, b) => Date.parse(b.npmFirstPublished) - Date.parse(a.npmFirstPublished) || a.i.id.localeCompare(b.i.id)
        )
        .slice(0, limit);
    return template('LATEST', {
        items:
            selected
                .map((e) =>
                    template('LATEST-ITEM', {
                        plugin: nameLink(e),
                        summary: `${clean(e.summary)} · 新发布：${new Date(Date.parse(e.npmFirstPublished) + 8 * 3600000).toISOString().slice(0, 10)}`
                    })
                )
                .join('\n') || '最近30天暂无已核实的新发布记录。'
    });
}
export function renderHot(items, limit = 5) {
    const repositories = new Set();
    const selected = items
        .filter((e) => e.stars !== null && e.stars !== undefined)
        .sort((a, b) => b.stars - a.stars || a.i.id.localeCompare(b.i.id))
        .filter((e) => {
            const id = e.plugin.repository_id;
            if (repositories.has(id)) return false;
            repositories.add(id);
            return true;
        })
        .slice(0, limit);
    return template('HOT', {
        items:
            selected
                .map((e) =>
                    template('HOT-ITEM', {
                        plugin: nameLink(e),
                        summary: clean(e.summary),
                        stars: e.starsBadge
                    })
                )
                .join('\n') || '暂无可比较的关注数据。'
    });
}
export function renderRecommended(recommendations, byId, limit = 5) {
    const selected = recommendations
        .filter((r) => r.kind !== 'observe' && !byId.get(r.plugin_id).needsReview)
        // Within each level preserve the editor's order; innovation scores do not rank adoption value.
        .sort((a, b) => Number(b.kind === 'install') - Number(a.kind === 'install'))
        .slice(0, limit);
    return template('RECOMMENDED', {
        items:
            selected
                .map((r) => {
                    const e = byId.get(r.plugin_id);
                    return template('RECOMMENDED-ITEM', {
                        plugin: nameLink(e),
                        kind: r.kind === 'install' ? ' · 值得安装' : '',
                        summary: `${clean(e.summary)} ${clean(r.summary).replaceAll('条件试用', '试用')}`,
                        review: ''
                    });
                })
                .join('\n') || '暂无符合条件的推荐。'
    });
}
export function categoryGroups(items) {
    const groups = new Map();
    for (const e of items) {
        const key = e.plugin.business_category;
        const category = categoryNames[key] ?? '其他';
        if (!groups.has(key)) groups.set(key, { key, name: category, entries: [] });
        groups.get(key).entries.push(e);
    }
    return [...groups.values()];
}
export const alphabetical = (a, b) =>
    a.plugin.name.localeCompare(b.plugin.name, 'en', { sensitivity: 'base' }) || a.i.id.localeCompare(b.i.id);
export function renderCategoryIndex(groups) {
    return template('CATEGORY-INDEX', {
        items: groups
            .map((g) => template('CATEGORY-INDEX-ITEM', { name: g.name, count: g.entries.length, url: g.href }))
            .join('\n')
    });
}
export function renderHomeCategories(groups, href, limit = 5) {
    const sections = groups.map((g) => {
        const selected = [...g.entries]
            .sort((a, b) => (b.stars ?? -Infinity) - (a.stars ?? -Infinity) || alphabetical(a, b))
            .slice(0, limit);
        const plugins = selected
            .map((e) =>
                template('HOME-PLUGIN', {
                    anchor: e.anchor,
                    name: clean(e.plugin.name),
                    summary: clean(e.summary),
                    meta: e.starsBadge,
                    review: e.needsReview ? ' · **脚本有更新，待重新洞察**' : '',
                    detail: href(e)
                })
            )
            .join('\n\n');
        return template('HOME-CATEGORY', { key: g.key, name: g.name, count: g.entries.length, plugins, more: g.href });
    });
    return template('CATEGORIES', { groups: sections.join('\n\n') });
}
export function renderHomeNavigation(groups) {
    return template('HOME-NAVIGATION', {
        items: groups
            .map((g) =>
                template('HOME-NAVIGATION-ITEM', {
                    name: g.name,
                    url: g.href,
                    scope: categoryScope(g.key),
                    count: g.entries.length
                })
            )
            .join('\n')
    });
}
export function renderCategories(items, href) {
    const groups = new Map();
    for (const e of items) {
        const category = categoryNames[e.plugin.business_category] ?? '其他';
        if (!groups.has(category)) groups.set(category, []);
        groups.get(category).push(e);
    }
    const ordered = [...items].sort(alphabetical);
    const navigation = ordered
        .map((e) =>
            template('CATEGORY-COMPARISON-ITEM', {
                plugin: nameLink(e),
                purpose: tableCell(e.summary),
                conditions: tableCell(
                    e.usageConditions.match(/^[\s\S]*?[。！？](?=\s|$|[^。！？])/u)?.[0] ?? e.usageConditions
                )
            })
        )
        .join('\n');
    const sections = [];
    for (const [category, entries] of groups) {
        const plugins = [...entries]
            .sort(alphabetical)
            .map((e) =>
                template('PLUGIN', {
                    anchor: e.anchor,
                    name: clean(e.plugin.name),
                    meta: e.meta,
                    short: e.short,
                    detail: href(e)
                })
            )
            .join('\n\n');
        sections.push(plugins);
    }
    return template('CATEGORY-COMPARISON', { navigation, groups: sections.join('\n\n') });
}
export const renderSources = (sources) =>
    template('SOURCES', {
        items: sources.map((url) => template('SOURCE-ITEM', { name: url.split('github.com/')[1], url })).join('\n')
    });
