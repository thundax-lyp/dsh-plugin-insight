import { template } from './template.mjs';

// Carry explicit anchors with their section, and ignore headings inside code fences.
export function splitSections(markdown, level = 2) {
    const sections = [];
    let current = { title: '', lines: [] },
        fence = null;
    for (const line of markdown.split('\n')) {
        const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (marker) {
            if (!fence) fence = marker[1];
            else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
        }
        const heading = !fence && line.match(new RegExp(`^#{${level}} (.+)$`));
        if (!heading) {
            current.lines.push(line);
            continue;
        }
        const anchors = [];
        while (current.lines.length && !current.lines.at(-1).trim()) current.lines.pop();
        while (/^<a id="[^"]+"><\/a>$/.test(current.lines.at(-1) ?? '')) {
            anchors.unshift(current.lines.pop());
            while (current.lines.length && !current.lines.at(-1).trim()) current.lines.pop();
        }
        sections.push(current);
        current = { title: heading[1], lines: anchors };
    }
    sections.push(current);
    return sections.map(({ title, lines }) => ({ title, body: lines.join('\n').trim() }));
}
const section = (heading, body) => (body.trim() ? template('DETAIL-SECTION', { heading, body: body.trim() }) : '');
const fragment = (label, body) => (body.trim() ? template('DETAIL-FRAGMENT', { label, body: body.trim() }) : '');
const join = (parts) => parts.filter(Boolean).join('\n\n');
const shortLinks = (text) =>
    text.replace(/\[([^\]\n]*)([a-f0-9]{40})\]\(/g, (_, label, sha) => `[${label}${sha.slice(0, 7)}](`);
function statistics(body) {
    return body
        .split(/\n\s*\n/)
        .filter(
            (p) =>
                !p.startsWith('统计范围：git tracked files at exact commit; component scope only；') &&
                !/^排除 \d+ 项，解析错误 \d+ 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。$/.test(
                    p
                )
        )
        .join('\n\n');
}
// Table groups retain one real subheading; quoted source remains untouched.
export function tableSections(body, fallback) {
    const titles = new Map([
        ['能力|主要用途|使用条件与边界', '能力'],
        ['依赖或条件|是否必需|用途|缺失或不满足时', '启动与依赖'],
        ['步骤|执行者与动作|成功判据或失败处理', '启动步骤'],
        ['阶段|现金与资源成本|人工与时间投入|已知条件与未知项', '成本'],
        ['效果项|当前证据支持|尚不能确定', '效果']
    ]);
    let fence = null,
        found = false;
    const lines = [];
    for (const line of body.split('\n')) {
        const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
        if (marker) {
            if (!fence) fence = marker[1];
            else if (marker[1][0] === fence[0] && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
        }
        const key =
            !fence && line.trim().startsWith('|')
                ? line
                      .trim()
                      .replace(/^\||\|$/g, '')
                      .split('|')
                      .map((cell) => cell.trim())
                      .join('|')
                : '';
        const title = titles.get(key);
        if (title) {
            found = true;
            let previous = lines.length - 1;
            while (previous >= 0 && !lines[previous].trim()) previous -= 1;
            if (
                previous >= 0 &&
                (lines[previous].trim() === `**${title}**` || lines[previous].trim() === `#### ${title}`)
            ) {
                lines[previous] = `#### ${title}`;
            } else lines.push(`#### ${title}`, '');
        }
        lines.push(line);
    }
    return found ? lines.join('\n') : fragment(fallback, body);
}
export function renderDetailLayout(report, item, { meta, issues, advice, capabilities, evidence, longRead }) {
    const parts = splitSections(report.replace(/\n<!-- BEGIN META -->\n[\s\S]*?\n<!-- END META -->\n*/g, '\n'));
    const intro = parts.shift().body;
    const title = intro.match(/^# [^\n]+/)?.[0];
    const summary = intro.match(/^> (.+)$/m)?.[1];
    if (!title || !summary) throw Error(`detail introduction missing: ${item.id}`);
    let preface = intro
        .replace(/^# [^\n]+\n*/, '')
        .replace(/^> [^\n]+\n*/m, '')
        .trim();
    const take = (pattern) => {
        const selected = parts.filter((p) => pattern.test(p.title));
        for (const p of selected) parts.splice(parts.indexOf(p), 1);
        return join(selected.map((p) => p.body));
    };
    const short = take(/^(用途与采用点评|洞察短评|使用建议)$/);
    const label = (name) =>
        short.match(new RegExp(`^- \\*\\*${name}(?:：\\*\\*|\\*\\*：)(.+)$`, 'm'))?.[1].trim() ?? '';
    const review = label('思考') || label('关键质疑');
    const suggestion = label('建议');
    const openingQuotes = [
        template('SHORT-ITEM', { label: '核心亮点', text: label('亮点') }).trim(),
        template('SHORT-ITEM', { label: '风险与缺陷', text: review }).trim()
    ];
    preface = preface
        .split(/\n\s*\n/)
        .filter((paragraph) => !openingQuotes.includes(paragraph.trim()))
        .join('\n\n');
    const version = take(/^(版本|研究范围|分析版本)$/);
    const status = take(/^结论状态$/)
        .split(/\n\s*\n/)
        .filter((p) => p.trim() !== '[重点创新推演与最小验证](#innovation)')
        .join('\n\n');
    let scene = take(/场景与替代办法|它试图解决什么问题|用途与适用场景/);
    let canonicalCurrent = take(/^(当前插件分析|插件分析)$/);
    const currentParts = splitSections(canonicalCurrent, 3);
    const currentScene = currentParts.filter((part) => part.title === '用途与适用场景');
    if (currentScene.length) {
        scene = join([...currentScene.map((part) => part.body), scene]);
        canonicalCurrent = join(
            currentParts
                .filter((part) => part.title !== '用途与适用场景')
                .map((part) => (part.title ? section(`### ${part.title}`, part.body) : part.body))
        );
    }
    const canonicalAbilities = take(/^能力与限制$/);
    const canonicalTechnical = take(/^工程分析$/);
    const flow = take(/依赖与流程|依赖、流程与成本|能力与流程/);
    const cost = take(/^成本与效果$/);
    const compatibility = take(/^分发与兼容$/);
    const capabilityBody = take(/^能力清单$/);
    const questionAnswers = take(/^研究问题与完整回答$/);
    const contribution = take(/核心贡献/);
    const questions = take(/关键质疑/);
    const hypothesis = take(/创新推演|未来设计假设/);
    const engineering = take(/^工程亮点$/);
    const verification = take(/^(核查说明|验证与边界)$/);
    const stats = take(/^工程统计$/);
    const materials = take(/工程材料能证明到哪里/);
    take(/^(历史对照|(?:Issue )?活跃度)$/);
    const materialParts = splitSections(materials, 3);
    const materialIntro = materialParts.shift()?.body ?? '';
    const materialEngineering = join(materialParts.filter((p) => /工程评价|可借鉴/.test(p.title)).map((p) => p.body));
    const materialStats = join(
        materialParts.filter((p) => !/工程评价|可借鉴/.test(p.title)).map((p) => fragment(p.title, p.body))
    );
    const fullCapabilities =
        capabilityBody ||
        Object.entries(capabilities.items)
            .map(([name, text]) => template('CAPABILITY-ITEM', { name, value: text }))
            .join('\n');
    const knownEvidence = evidence.filter((e) => e.revision === item.revision);
    const verified = knownEvidence.some((e) => e.kind === 'host_acceptance');
    const inspected = knownEvidence.some((e) => e.kind === 'source_inspection');
    const validation = template(verified ? 'DETAIL-VERIFIED' : inspected ? 'DETAIL-SOURCE-ONLY' : 'DETAIL-UNVERIFIED');
    const opening = template('DETAIL-OPENING', {
        title,
        summary,
        meta,
        highlight: label('亮点'),
        risk: review,
        version: item.revision.slice(0, 7),
        version_url: `https://github.com/${item.repository}/tree/${item.revision}${item.path ? `/${item.path}` : ''}`
    });
    const extraShort = short
        .split('\n')
        .filter((line) => !/^- \*\*(用途|亮点|思考|关键质疑|建议)(?:：\*\*|\*\*：)/.test(line))
        .join('\n')
        .trim()
        .split(/\n\s*\n/)
        .filter((p) => ![advice, `采用建议：${advice}`].includes(p.trim()))
        .join('\n\n');
    const use = join([
        preface,
        label('用途') ? template('SHORT-ITEM', { label: '用途', text: label('用途') }) : '',
        scene
    ]);
    const adoption = join([
        advice,
        extraShort,
        suggestion && suggestion !== advice && !hypothesis.includes(suggestion) ? fragment('补充建议', suggestion) : ''
    ]);
    const abilities = join([
        canonicalAbilities,
        tableSections(fullCapabilities, '能力'),
        tableSections(flow, '流程与依赖'),
        fragment('兼容条件', compatibility),
        tableSections(cost, '效果与成本'),
        review ? template('SHORT-ITEM', { label: '思考', text: review }) : ''
    ]);
    const technical = join([
        canonicalTechnical,
        label('亮点') ? template('SHORT-ITEM', { label: '亮点', text: label('亮点') }) : '',
        contribution,
        engineering,
        materialEngineering
    ]);
    const checks = join([validation, status, verification, materialIntro, fragment('分析版本', version)]);
    const supplemental = join([
        stats || materialStats ? template('DETAIL-STATISTICS', { body: join([statistics(stats), materialStats]) }) : '',
        fragment('活跃度', issues)
    ]);
    const remainder = join(parts.map((p) => section(`### ${p.title}`, p.body)));
    const long = longRead || Boolean(hypothesis);
    const output = long
        ? template('DETAIL-LONG', {
              opening,
              current: join([
                  canonicalCurrent,
                  section('### 用途与适用场景', use),
                  section('### 能力、流程与成本', abilities),
                  section('### 工程贡献', technical.replace(/^### /gm, '#### ')),
                  section('### 主要限制', questions.replace(/^### /gm, '#### ')),
                  section('### 使用建议', adoption),
                  section('### 核查说明与分析版本', checks),
                  remainder
              ]),
              hypothesis: hypothesis ? section('## 未来设计假设（未验证）', hypothesis) : '',
              supplemental
          })
        : template('DETAIL-SHORT', {
              opening,
              use,
              adoption,
              abilities,
              technical: join([technical, questions, remainder]),
              checks: join([checks, supplemental])
          });
    return join([shortLinks(output), section('## 研究问题与完整回答', questionAnswers)]) + '\n';
}
