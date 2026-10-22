import Ajv from 'ajv/dist/2020.js';
import { readFileSync } from 'node:fs';

export const researchTopics = {
    scenario: '场景与需求',
    mechanism: '功能与机制',
    contribution: '贡献与相对优势',
    limitations: '缺陷与关键质疑',
    dependencies: '依赖、兼容与流程',
    cost: '效果与总成本',
    engineering: '工程质量与复用',
    hypothesis: '新假设与验证',
    adoption: '采用判断'
};
const ajv = new Ajv({ strict: true, allErrors: true });
const check = ajv.compile(
    JSON.parse(readFileSync(new URL('../../_shared/schemas/research-questions.schema.json', import.meta.url), 'utf8'))
);
// Authored answers may contain nested sections, but cannot escape their question's heading.
function checkHeadings(text) {
    let fence = null;
    for (const line of text.split('\n')) {
        const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (marker) {
            if (!fence) fence = marker[1];
            else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
            continue;
        }
        if (!fence && (/^ {0,3}#{1,3}\s/.test(line) || /^ {0,3}(?:=+|-+)\s*$/.test(line)))
            throw Error('question text must not introduce level 1-3 or Setext headings');
    }
    if (fence) throw Error('question text has an unclosed code fence');
}
export function validateResearchQuestions(value, { sourcePaths, readSource }) {
    if (!check(value)) throw Error('invalid research questions: ' + ajv.errorsText(check.errors));
    const ids = new Set(),
        questions = new Set(),
        topics = new Set(),
        cache = new Map();
    const text = (value) => {
        if (!value.trim()) throw Error('research question text must not be blank');
    };
    text(value.goal);
    checkHeadings(value.goal);
    for (const q of value.questions) {
        if (ids.has(q.id) || questions.has(q.question.trim()))
            throw Error('duplicate research question ID or question');
        ids.add(q.id);
        questions.add(q.question.trim());
        q.topics.forEach((topic) => topics.add(topic));
        text(q.question);
        text(q.answer);
        checkHeadings(q.answer);
        if (/[\r\n]/.test(q.question)) throw Error('research question title must be one line');
        if (['answered', 'partial'].includes(q.status) && !q.evidence.length)
            throw Error('answered research question requires evidence');
        if (['partial', 'unknown'].includes(q.status) && !q.unknowns.length)
            throw Error('incomplete research question requires explicit unknowns');
        for (const u of q.unknowns)
            for (const field of Object.values(u)) {
                text(field);
                checkHeadings(field);
            }
        for (const e of q.evidence) {
            text(e.observation);
            checkHeadings(e.observation);
            if (!sourcePaths.includes(e.source_path))
                throw Error(`question cites an uninspected source: ${e.source_path}`);
            if (!cache.has(e.source_path)) cache.set(e.source_path, readSource(e.source_path));
            const source = cache.get(e.source_path);
            if (typeof source !== 'string') throw Error(`question source missing: ${e.source_path}`);
            const lines = source.replace(/\n$/, '').split('\n');
            if (
                e.line_end < e.line_start ||
                e.line_end > lines.length ||
                !lines
                    .slice(e.line_start - 1, e.line_end)
                    .join('\n')
                    .trim()
            )
                throw Error(`question source line range invalid: ${q.id}/${e.source_path}`);
        }
    }
    const missing = Object.keys(researchTopics).filter((topic) => !topics.has(topic));
    if (missing.length) throw Error(`research question coverage missing: ${missing.join(', ')}`);
    return value;
}
const statusNames = {
    answered: '已回答',
    partial: '部分回答，仍有缺口',
    unknown: '材料不足，尚不能判断',
    not_applicable: '本题不适用，原因见回答'
};
function quoteSource(text) {
    const runs = [...text.matchAll(/`+/g)].map((m) => m[0].length);
    const fence = '`'.repeat(Math.max(3, ...runs.map((n) => n + 1)));
    return `${fence}text\n${text}\n${fence}`;
}
export function renderResearchQuestions(value, { repository, revision, readSource }) {
    const sections = value.questions.map((q) => {
        const evidence =
            q.evidence
                .map((e, i) => {
                    const excerpt = readSource(e.source_path)
                        .replace(/\n$/, '')
                        .split('\n')
                        .slice(e.line_start - 1, e.line_end)
                        .join('\n');
                    const path = e.source_path.split('/').map(encodeURIComponent).join('/');
                    const url = `https://github.com/${repository}/blob/${revision}/${path}#L${e.line_start}-L${e.line_end}`;
                    return `**依据 ${i + 1} · ${e.kind === 'author_claim' ? '作者声明' : '源码核查'}**：[${e.source_path}:${e.line_start}-${e.line_end}](${url})\n\n${e.observation}\n\n${quoteSource(excerpt)}`;
                })
                .join('\n\n') || '本题未列出证据；回答状态与未知项见本题说明。';
        const unknowns =
            q.unknowns
                .map((u) => `- **未知：**${u.issue}\n  **影响：**${u.impact}\n  **下一步：**${u.next_step}`)
                .join('\n') || '本题未记录额外未知项。';
        return `<a id="research-${q.id.toLowerCase()}"></a>\n\n### ${q.id} · ${q.question}\n\n**研究主题：**${q.topics.map((t) => researchTopics[t]).join('、')}\n\n**回答状态：**${statusNames[q.status]}\n\n#### 完整回答\n\n${q.answer}\n\n#### 证据与依据\n\n${evidence}\n\n#### 未知项\n\n${unknowns}`;
    });
    return `## 研究问题与完整回答\n\n**插件研究总目标：**${value.goal}\n\n${sections.join('\n\n')}`;
}
