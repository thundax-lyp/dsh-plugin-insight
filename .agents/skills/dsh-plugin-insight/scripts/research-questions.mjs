import { createGitReference, gitReferenceUrl } from '../../_shared/scripts/git-reference.mjs';
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
export function validateResearchQuestions(value, { sourcePaths, readSource, repository, revision }) {
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
            createGitReference(`https://github.com/${repository}`, revision, e.source_path, {
                line_start: e.line_start,
                line_end: e.line_end
            });
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
// Validate durable answers using embedded source bytes, without depending on local runs or checkouts.
export function validateResearchQuestionArtifact(material) {
    if (!Object.hasOwn(material, 'research_questions')) return;
    return validateResearchQuestions(material.research_questions, {
        repository: material.repository,
        revision: material.revision,
        sourcePaths: material.inspected_paths,
        readSource: (name) => material.files.find((file) => file.path === name)?.content
    });
}
function quoteSource(text) {
    const runs = [...text.matchAll(/`+/g)].map((m) => m[0].length);
    const fence = '`'.repeat(Math.max(3, ...runs.map((n) => n + 1)));
    const quoted = `${fence}text\n${text}\n${fence}`;
    const lines = text.split('\n').length;
    return lines >= 10 ? `<details>\n<summary>查看原文（${lines}行）</summary>\n\n${quoted}\n\n</details>` : quoted;
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
                    const ref = createGitReference(`https://github.com/${repository}`, revision, e.source_path, {
                        content: readSource(e.source_path),
                        line_start: e.line_start,
                        line_end: e.line_end
                    });
                    const url = gitReferenceUrl(ref);
                    return `**依据 ${i + 1} · ${e.kind === 'author_claim' ? '作者声明' : '源码核查'}**：[${e.source_path}:${e.line_start}-${e.line_end}](${url})\n\n${e.observation}\n\n${quoteSource(excerpt)}`;
                })
                .join('\n\n') || '本题未列出证据，适用边界见完整回答。';
        const unknowns = q.unknowns
            .filter((u) => u.kind !== 'scope_boundary')
            .map((u) => `- ${u.issue}\n  **影响：**${u.impact}\n  **进一步探讨：**${u.next_step}`)
            .join('\n');
        return `<a id="research-${q.id.toLowerCase()}"></a>\n\n### ${q.id} · ${q.question}\n\n**研究主题：**${q.topics.map((t) => researchTopics[t]).join('、')}\n\n#### 完整回答\n\n${q.answer}\n\n#### 证据与依据\n\n${evidence}${unknowns ? `\n\n#### 缺口\n\n${unknowns}` : ''}`;
    });
    return `## 研究问题与完整回答\n\n**插件研究总目标：**${value.goal}\n\n${sections.join('\n\n')}`;
}
