# dsh-plugin-education

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[2d880f8](https://github.com/863683348/dsh-plugin-education/tree/2d880f86c9160652e27c1f4702265822e0e726e9)

<!-- BEGIN META -->
[![npm 30d 940](https://img.shields.io/static/v1?label=npm+30d&message=940&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-education) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-education)
<!-- END META -->

> **实现功能**：用edu_kit提供教案与题目骨架、测验结构检查、格式转换和成绩/计划统计，不替代教学内容审阅。

> **核心亮点**：把模板、格式和统计接入模型工具减少手排手算。详见[Q01](#research-q01)。

> **风险与缺陷**：重复items覆盖quiz schema，超满分/零阈值与分箱可能误导，题目和难度标签需人工复核。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 教育工具包负责什么，是否自动完成教学评价？](#detail-section-11)
  - [Q02 · 宿主工具怎样接入，边界是否一致？](#detail-section-12)
  - [Q03 · 哪些数值或标签容易被误读为保证？](#detail-section-13)
  - [Q04 · 测试和分阶段成本能证明什么？](#detail-section-14)
  - [Q05 · 如何采用以及继续探讨？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：教师/助教准备材料与常规算表，模型创作而插件做结构和计算。详见[Q01](#research-q01)。

手工教案模板、表格和脚本计算；工具不是自动评阅或心理测量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 骨架/转换 | 材料起稿 | 占位须审阅 |
| 测验校验 | 结构检查 | 不验知识正确 |
| 统计/计划 | 算表与分配 | 域/余量需复核 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| tools/systemPrompt | 分派与引导 | 宿主ABI需匹配 |
| 教师内容和规则 | 知识/得分输入 | 错输入仍可能输出PASS |
| 人工复核 | 正式使用 | 标签不等测量认证 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 选action规则 | 用户/模型 | 课程/阈值明确 |
| 生成或计算 | edu_kit | 无占位误用 |
| 复核内容数值 | 教师 | 分箱/预算/答案一致 |
| 导出使用 | 用户 | 敏感数据按宿主流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配DSH宿主 | 选课程规则和模板 | 课程规则/内容由教师确定；准备工时未知 |
| 持续使用 | 本地计算/模型上下文 | 审题复算与改骨架 | 本地计算不新增独立服务费；宿主模型上下文与审题工时未知 |
| 失败恢复 | 无插件持久状态，重算占用本地/宿主资源 | 复核并更正已导出/外发成绩 | 无插件持久状态；已外发成绩更正代价未知 |


#### 效果

| 目标 | 支持 | 边界 |
| --- | --- | --- |
| 备课起稿 | 模板/题型 | 知识内容需补 |
| 常规检查 | 索引/算表 | 域校验不完整 |
| 文本难度 | 句长/Flesch启发 | 非学习者能力认证 |

> **思考**：重复items覆盖quiz schema，超满分/零阈值与分箱可能误导，题目和难度标签需人工复核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把模板、格式和统计接入模型工具减少手排手算。详见[Q01](#research-q01)。

把模板、格式和统计接入模型工具减少手排手算。详见[Q01](#research-q01)。

生产纯逻辑可复核，需补工具壳分action契约与域守恒反例。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

重复items覆盖quiz schema，超满分/零阈值与分箱可能误导，题目和难度标签需人工复核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

教师审阅下试用模板/转换，数值与答案复核后使用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定工具/纯逻辑可查；数值域、重复items及启发难度效度限制正式自动评价。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/index.js、lib/education.js、test/education.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整读取工具壳/357行纯逻辑/全184行生产测试与中文说明、package；不执行目标代码，不以测试存在证明测量效度。
- 下一步：从数值域与结构/知识/教学适用三层契约继续对照。

**分析版本**

- **仓库**：[863683348/dsh-plugin-education](https://github.com/863683348/dsh-plugin-education)
- **版本号**：0.3.2（[固定提交 2d880f8](https://github.com/863683348/dsh-plugin-education/tree/2d880f86c9160652e27c1f4702265822e0e726e9)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按action契约/域校验/剩余需求形成可解释结果，比较教师校正与误算，当前未验证。详见[Q05](#research-q05)。

从数值域与结构/知识/教学适用三层契约继续对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 536 | 478 | 34 | — |
| .md | source | 4 | 158 | — | — | 1363 |
| .mjs | test | 1 | 184 | 161 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-education/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-education/issues?q=is%3Aissue+created%3A2026-09-22T07%3A00%3A22.651Z..2026-10-22T07%3A00%3A22.651Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-education/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A00%3A22.651Z..2026-10-22T07%3A00%3A22.651Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：教学结构与确定性计算能支持哪些工作，输入/测量/正式评价的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 教育工具包负责什么，是否自动完成教学评价？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

给教师、助教和学习者提供九类确定性结构帮助——教案/题目骨架、测验结构检查、量规表、闪卡、可读性、成绩汇总、周计划和班级统计。模型或人提供知识与原始得分，插件排版/计算；grade不读取作业给分，quiz不验证答案知识正误。成功标准应是结构完整、数值和规则符合本校教学要求，再由专业读者审阅，不是工具显示PASS就完成教学验收。

贡献是将分散模板和算表接进一个DSH工具，让模型少手算/手排；没有新教学法或经校准的测量模型。教案内置学段结构，但分钟不是按模板原权重分配，而对环节均分并分配余数，短课可能有0分钟环节。读者需把骨架当起稿材料。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:3-3](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/README.zh.md#L3-L3)

作者明确模型创作/插件结构。

```text
面向 [DeepSeek Harness](https://github.com/deepseek-ai/dsh) agent 的**教育工具包**：教案骨架、测验校验、评分量规、闪卡转换与文本难度分级。模型负责内容创作，插件负责结构与校验。
```

**依据 2 · 源码核查**：[lib/index.js:51-57](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L51-L57)

九action。

```text
  ctx.tools.register(defineTool({
    name: "edu_kit",
    description: "Education helper: `lesson` (lesson-plan skeleton by grade band: primary/secondary/tertiary/adult, with a minute budget), `quiz` (validate a quiz item set: stem, >=2 unique options, answer index in range, explanation), `rubric` (analytic rubric table from criteria), `flashcard` (convert Q/A pairs to Anki TSV or markdown), `level` (readability: Flesch for English, CJK heuristics for Chinese), `grade` (grading sheet from scored items with totals and letter grade), `studyplan` (weekly study plan from a date range), `question` (question skeletons by type/difficulty with a TSV-ready item list), `classstats` (mean/median/stdev, pass rate and score bands). Use it for teaching, tutoring, course design, or study materials.",
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["lesson", "quiz", "rubric", "flashcard", "level", "grade", "studyplan", "question", "classstats"],
```

**依据 3 · 源码核查**：[lib/education.js:49-87](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L49-L87)

均分分钟和占位目标。

<details>
<summary>查看原文（39行）</summary>

```text

function distribute(total, parts) {
  const n = Math.max(1, Math.floor(parts));
  const base = Math.floor(total / n);
  const rem = total % n;
  return Array.from({ length: n }, (_, i) => base + (i < rem ? 1 : 0));
}

/** Lesson-plan skeleton by grade band with minute budget. */
export function lessonPlan({ topic = "", subject = "", grade = "secondary", minutes = 50 } = {}) {
  const band = pickBand(grade);
  const blocks = LESSON_BLOCKS[band];
  const total = Math.max(1, Math.floor(minutes));
  const allocs = distribute(total, blocks.length);
  const lines = [
    "# Lesson Plan" + (topic ? ": " + topic : ""),
    "",
    "- Subject: " + (subject || "(to fill)"),
    "- Grade band: " + band + " (" + grade + ")",
    "- Duration: " + total + " minutes",
    "",
    "## Learning objectives",
    "- Students will be able to ... (observable, measurable)",
    "",
    "## Materials & preparation",
    "- ...",
    "",
    "## Lesson flow",
    "",
  ];
  for (let i = 0; i < blocks.length; i++) {
    const [name, , hint] = blocks[i];
    lines.push("### " + (i + 1) + ". " + name + " (" + allocs[i] + " min)");
    lines.push("- " + hint);
    lines.push("");
  }
  lines.push("## Assessment & homework", "- ...");
  return lines.join("\n");
}
```

</details>

**依据 4 · 源码核查**：[lib/education.js:196-229](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L196-L229)

既有得分汇总而非评阅。

<details>
<summary>查看原文（34行）</summary>

```text
/** Build a grading sheet from scored items. */
export function buildGradeSheet({ items = [], passPct = 60 } = {}) {
  const list = Array.isArray(items) ? items.filter((x) => x) : [];
  if (list.length === 0) throw new Error("education: at least one graded item is required");
  const rows = list.map((it, i) => {
    const score = Number(it.score);
    const max = Number(it.max);
    if (!Number.isFinite(score) || score < 0) throw new Error("education: score must be a non-negative number");
    if (!Number.isFinite(max) || max <= 0) throw new Error("education: max must be a positive number");
    return {
      no: i + 1,
      name: it.name || "Item " + (i + 1),
      score: Number(score.toFixed(2)),
      max: Number(max.toFixed(2)),
      pct: Number(((score / max) * 100).toFixed(1)),
      comment: it.comment || "",
    };
  });
  const totalScore = rows.reduce((s, r) => s + r.score, 0);
  const totalMax = rows.reduce((s, r) => s + r.max, 0);
  const totalPct = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
  const grade = letterGrade(totalPct);
  const pass = totalPct >= Number(passPct || 0);
  const text = [
    "# Grading sheet",
    "",
    "| # | Item | Score | Max | % | Comment |",
    "|---|------|-------|-----|---|---------|",
    ...rows.map((r) => "| " + r.no + " | " + r.name + " | " + r.score + " | " + r.max + " | " + r.pct + "% | " + r.comment + " |"),
    "| **Total** | | **" + totalScore + "** | " + totalMax + " | " + totalPct.toFixed(1) + "% | " + grade + " |",
    "",
    "Result: " + (pass ? "PASS" : "FAIL") + " (" + totalPct.toFixed(1) + "%, grade " + grade + ")",
  ].join("\n");
  return { rows, totalScore: Number(totalScore.toFixed(2)), totalMax, totalPct: Number(totalPct.toFixed(1)), grade, pass, text };
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主工具怎样接入，边界是否一致？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

注册edu_kit并可选写systemPrompt引导，依赖tools/systemPrompt服务及Cordis4/DSH rc6 peer。纯逻辑无文件、网络、模型调用，输出Markdown和统计对象；工具壳grade/studyplan/question/classstats只返回text，详细rows等结构在纯模块可用而没有透传工具结果。提示词段不等Skill。

parameters对象出现两次items，前一份quiz的stem/options/answer具体schema被后来的grade通用object定义覆盖。JavaScript对象实际只保后一项，所以模型看到的items说明偏grade，quiz约束改由运行逻辑承担，影响可发现性/参数准确性。纯逻辑又缺一些类型防护，例如validateQuiz遇null仍继续读取item.options会抛异常，不能把“返回issues”当所有坏输入保证。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:27-47](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L27-L47)

注入/配置/引导。

<details>
<summary>查看原文（21行）</summary>

```text
const name = "education";

/** Services this plugin must resolve before it applies. */
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration for the plugin entry. */
const Config = z.object({
  /** Register the education prompt-guidance section. */
  personaSection: z.boolean().default(true),
  /** Order of the section (ascending; persona is 0). */
  sectionOrder: z.number().default(6),
});

const SECTION_TEXT = [
  "Education guidance:",
  "- Draft lessons with `edu_kit` action `lesson` (grade-band templates with a minute budget), then adapt objectives and activities.",
  "- For quizzes, scaffold items yourself and validate the answer keys with `quiz` before delivery.",
  "- Use `rubric` for analytic grading tables, `flashcard` to convert Q/A pairs into Anki TSV or markdown.",
  "- Gauge text difficulty with `level` (Flesch for English, CJK length heuristics for Chinese) and match it to the audience.",
  "- Grade submitted work with `grade` (rubric-driven grading sheet) and plan coverage with `studyplan` (weekly schedule from a date range).",
  "- Draft assessments with `question` (type/difficulty-aware skeletons) and summarise results with `classstats` (distribution + pass rate).",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:64-90](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L64-L90)

重复items键。

<details>
<summary>查看原文（27行）</summary>

```text
      items: {
        type: "array",
        items: { type: "object", additionalProperties: false,
          properties: {
            stem: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            answer: { type: "integer" },
            explanation: { type: "string" },
          },
        },
        description: "Quiz items [{stem, options[], answer, explanation}] (quiz).",
      },
      criteria: { type: "array", items: { type: "string" }, description: "Rubric criteria (rubric)." },
      levels: { type: "integer", description: "Number of rubric levels (rubric)." },
      pairs: {
        type: "array",
        items: { type: "object", additionalProperties: false, properties: { q: { type: "string" }, a: { type: "string" } } },
        description: "Q/A pairs for flashcards (flashcard).",
      },
      format: { type: "string", description: "tsv | markdown (flashcard)." },
      text: { type: "string", description: "Text to grade (level)." },
      items: { type: "array", items: { type: "object", additionalProperties: true }, description: "Graded items [{name, score, max, comment}] (grade)." },
      passPct: { type: "number", description: "Pass threshold percent (grade)." },
      start: { type: "string", description: "Plan start date YYYY-MM-DD (studyplan)." },
      end: { type: "string", description: "Plan end date YYYY-MM-DD (studyplan)." },
      hoursPerWeek: { type: "number", description: "Weekly study hours (studyplan)." },
      topics: { type: "array", items: { type: "object", additionalProperties: true }, description: "Topics [{name, hours}] (studyplan)." },
```

</details>

**依据 3 · 源码核查**：[lib/index.js:120-157](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L120-L157)

分派与结构透传边界。

<details>
<summary>查看原文（38行）</summary>

```text
      let valid;
      let count;
      let label;
      let metrics;
      switch (action) {
        case "lesson":
          text = lessonPlan({ topic: args.topic, subject: args.subject, grade: args.grade, minutes: args.minutes });
          break;
        case "quiz":
          ({ issues, valid, itemCount: count } = validateQuiz({ items: args.items }));
          text = valid
            ? "Quiz valid: " + count + " item(s) OK."
            : "Quiz issues found:\n- " + issues.join("\n- ");
          break;
        case "rubric":
          text = buildRubric({ criteria: args.criteria, levels: args.levels });
          break;
        case "flashcard":
          ({ text, count } = toFlashcards({ pairs: args.pairs, format: args.format }));
          break;
        case "level":
          ({ label, metrics } = readability({ text: args.text, lang: args.lang }));
          text = "Readability: " + label + " — " + JSON.stringify(metrics);
          break;
        case "grade":
          text = buildGradeSheet({ items: args.items, passPct: args.passPct }).text;
          break;
        case "studyplan":
          text = buildStudyPlan({ start: args.start, end: args.end, hoursPerWeek: args.hoursPerWeek, topics: args.topics }).text;
          break;
        case "question":
          text = buildQuestions({ topic: args.topic, count: args.count, types: args.types, difficulty: args.difficulty, points: args.points }).text;
          break;
        case "classstats":
          text = classStats({ scores: args.scores, full: args.full, passPct: args.passPct, bands: args.bands }).text;
          break;
        default:
          throw new Error("edu_kit: unknown action '" + action + "'");
```

</details>

**依据 4 · 源码核查**：[lib/education.js:90-106](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L90-L106)

null检查后仍解引用。

<details>
<summary>查看原文（17行）</summary>

```text
export function validateQuiz({ items = [] } = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    return { issues: ["At least one item is required."], valid: false, itemCount: 0 };
  }
  const issues = [];
  items.forEach((item, idx) => {
    const label = "item " + (idx + 1);
    if (!item || typeof item.stem !== "string" || item.stem.trim().length === 0) issues.push(label + ": missing stem.");
    const opts = Array.isArray(item.options) ? item.options : [];
    if (opts.length < 2) issues.push(label + ": needs at least 2 options.");
    if (opts.length !== new Set(opts.map((o) => String(o).trim())).size) issues.push(label + ": duplicate options.");
    const answer = Number(item.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= opts.length) {
      issues.push(label + ": answer index " + item.answer + " out of range [0, " + (opts.length - 1) + "].");
    }
    if (item.explanation != null && String(item.explanation).trim().length === 0) issues.push(label + ": empty explanation.");
  });
```

</details>

**依据 5 · 源码核查**：[package.json:49-56](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/package.json#L49-L56)

宿主peer。

```text
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/863683348/dsh-plugin-education.git"
  },
  "homepage": "https://github.com/863683348/dsh-plugin-education#readme",
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些数值或标签容易被误读为保证？

**研究主题**：缺陷与关键质疑

#### 完整回答

quiz仅检查题干、选项个数/去重、数字转换后索引及显式空解析，缺解析本身不报错；Number转换也容许null/空串变0，不能当严谨答案schema。question输出固定占位答案A或A、C，不是真实知识答案，多选字符串也不能直接拿给quiz整数索引字段。rubric每格都是Descriptor占位，没有实际评分锚点。

grade允许score大于max，也把各行分/满分先四舍五入再汇总；极小正max可能被舍成0。classStats仅过滤非有限数，负分/超满分仍进均值/及格率，却不入0到full分箱，分箱人数可少于n；passPct=0被||60回退为60。这些规则若用于正式成绩必须先校验与复算。

level的英文音节计数与Flesch转A1-C2为启发，非CEFR测试；中文只看句长、字符数，混合文本自动路由也可能受四个英文字母串影响。lang=en不强制英文分支，因为条件前半仍可命中中文。studyplan预算不足时截到日期内，返回总需求小时却无未排剩余警告；日期解析非严格日历校验，按毫秒加周还需注意本地时区。

#### 证据与依据

**依据 1 · 源码核查**：[lib/education.js:90-128](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L90-L128)

结构校验与量规占位。

<details>
<summary>查看原文（39行）</summary>

```text
export function validateQuiz({ items = [] } = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    return { issues: ["At least one item is required."], valid: false, itemCount: 0 };
  }
  const issues = [];
  items.forEach((item, idx) => {
    const label = "item " + (idx + 1);
    if (!item || typeof item.stem !== "string" || item.stem.trim().length === 0) issues.push(label + ": missing stem.");
    const opts = Array.isArray(item.options) ? item.options : [];
    if (opts.length < 2) issues.push(label + ": needs at least 2 options.");
    if (opts.length !== new Set(opts.map((o) => String(o).trim())).size) issues.push(label + ": duplicate options.");
    const answer = Number(item.answer);
    if (!Number.isInteger(answer) || answer < 0 || answer >= opts.length) {
      issues.push(label + ": answer index " + item.answer + " out of range [0, " + (opts.length - 1) + "].");
    }
    if (item.explanation != null && String(item.explanation).trim().length === 0) issues.push(label + ": empty explanation.");
  });
  return { issues, valid: issues.length === 0, itemCount: items.length };
}

/** Analytic rubric as a markdown table. */
export function buildRubric({ criteria = [], levels = 4 } = {}) {
  const cs = Array.isArray(criteria) ? criteria.filter((c) => String(c).trim().length > 0) : [];
  const n = Math.max(2, Math.floor(levels));
  if (cs.length === 0) {
    return "# Rubric\n\n(no criteria provided — add criteria as a list, e.g. [\"Accuracy\", \"Clarity\"])";
  }
  const lines = ["# Analytic Rubric", ""];
  lines.push("| Criteria | " + Array.from({ length: n }, (_, i) => "Level " + (i + 1)).join(" | ") + " |");
  lines.push("| --- | " + Array.from({ length: n }, () => "---").join(" | ") + " |");
  for (const c of cs) {
    lines.push("| " + c + " | " + Array.from({ length: n }, () => "Descriptor (" + c + ")").join(" | ") + " |");
  }
  return lines.join("\n");
}

function escapeTsv(v) {
  return String(v).replace(/\t/g, " ").replace(/\n/g, " ").replace(/\r/g, "").trim();
}
```

</details>

**依据 2 · 源码核查**：[lib/education.js:148-184](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L148-L184)

可读性启发/路由。

<details>
<summary>查看原文（37行）</summary>

```text
  if (w.length === 0) return 0;
  const groups = w.match(/[aeiouy]+/g) || [];
  let n = groups.length;
  if (w.endsWith("e") && n > 1) n -= 1;
  if (w.endsWith("le") && n === 1) n += 1;
  return Math.max(1, n);
}

/** Readability estimate: Flesch reading ease (en) or CJK length heuristics. */
export function readability({ text = "", lang = "auto" } = {}) {
  const t = String(text);
  if (t.trim().length === 0) return { label: "empty", metrics: {} };
  const cjk = /[\u4e00-\u9fff\u3000-\u303f]/.test(t) && !/[a-zA-Z]{4,}/.test(t) || (lang === "zh");
  if (cjk) {
    const sentences = t.split(/[。！？.!?]+/).filter((s) => s.trim().length > 0);
    const chars = t.replace(/\s/g, "").replace(/[。！？，、；：""''（）《》.?!,;:()]/g, "").length;
    const avg = sentences.length > 0 ? chars / sentences.length : 0;
    const longSentences = sentences.filter((s) => s.length > 60).length;
    const label = avg > 40 ? "dense" : avg > 20 ? "moderate" : "light";
    return { label, metrics: { sentences: sentences.length, chars, avgCharsPerSentence: Number(avg.toFixed(1)), longSentences } };
  }
  const sentences = t.split(/[.!?]+/).filter((s) => s.trim().length > 0);
  const words = t.split(/\s+/).filter((w) => w.length > 0);
  if (sentences.length === 0 || words.length === 0) return { label: "empty", metrics: {} };
  const syllables = words.reduce((a, w) => a + countSyllables(w), 0);
  const score = 206.835 - 1.015 * (words.length / sentences.length) - 84.6 * (syllables / words.length);
  const label = score > 80 ? "A1-A2" : score > 60 ? "B1" : score > 40 ? "B2" : score > 30 ? "C1" : "C2";
  return {
    label,
    metrics: {
      sentences: sentences.length,
      words: words.length,
      syllables,
      flesch: Number(score.toFixed(1)),
      avgWordsPerSentence: Number((words.length / sentences.length).toFixed(1)),
    },
  };
```

</details>

**依据 3 · 源码核查**：[lib/education.js:197-218](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L197-L218)

评分边界和舍入。

<details>
<summary>查看原文（22行）</summary>

```text
export function buildGradeSheet({ items = [], passPct = 60 } = {}) {
  const list = Array.isArray(items) ? items.filter((x) => x) : [];
  if (list.length === 0) throw new Error("education: at least one graded item is required");
  const rows = list.map((it, i) => {
    const score = Number(it.score);
    const max = Number(it.max);
    if (!Number.isFinite(score) || score < 0) throw new Error("education: score must be a non-negative number");
    if (!Number.isFinite(max) || max <= 0) throw new Error("education: max must be a positive number");
    return {
      no: i + 1,
      name: it.name || "Item " + (i + 1),
      score: Number(score.toFixed(2)),
      max: Number(max.toFixed(2)),
      pct: Number(((score / max) * 100).toFixed(1)),
      comment: it.comment || "",
    };
  });
  const totalScore = rows.reduce((s, r) => s + r.score, 0);
  const totalMax = rows.reduce((s, r) => s + r.max, 0);
  const totalPct = totalMax > 0 ? (totalScore / totalMax) * 100 : 0;
  const grade = letterGrade(totalPct);
  const pass = totalPct >= Number(passPct || 0);
```

</details>

**依据 4 · 源码核查**：[lib/education.js:237-278](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L237-L278)

预算裁剪/未排未返回。

<details>
<summary>查看原文（42行）</summary>

```text
export function buildStudyPlan({ start = "", end = "", hoursPerWeek = 10, topics = [] } = {}) {
  const from = new Date(start + "T00:00:00");
  const to = new Date(end + "T00:00:00");
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) throw new Error("education: start and end dates are required (YYYY-MM-DD)");
  if (to < from) throw new Error("education: end must not be before start");
  const totalDays = Math.round((to - from) / 86400000) + 1;
  const weeks = Math.max(1, Math.ceil(totalDays / 7));
  const list = (Array.isArray(topics) ? topics : []).filter((t) => t && t.name);
  if (list.length === 0) throw new Error("education: at least one topic is required");
  const hpw = Math.max(0, Number(hoursPerWeek) || 0);
  const remaining = list.map((t) => ({ name: t.name, hours: Math.max(0, Number(t.hours) || 0) }));
  const totalHours = remaining.reduce((s, t) => s + t.hours, 0);
  const weeksNeeded = hpw > 0 ? Math.max(1, Math.ceil(totalHours / hpw)) : weeks;
  const planWeeks = Math.min(weeks, weeksNeeded);
  const rows = [];
  let ti = 0;
  for (let w = 1; w <= planWeeks; w++) {
    const ws = new Date(from.getTime() + (w - 1) * 7 * 86400000);
    const we = new Date(Math.min(ws.getTime() + 6 * 86400000, to.getTime()));
    const items = [];
    let budget = hpw;
    while (budget > 0 && ti < remaining.length) {
      const t = remaining[ti];
      if (t.hours <= 0) { ti++; continue; }
      const take = Math.min(t.hours, budget);
      items.push({ name: t.name, hours: take });
      t.hours -= take;
      budget -= take;
    }
    rows.push({ week: w, range: fmtDate(ws) + " ~ " + fmtDate(we), items, hours: items.reduce((s, x) => s + x.hours, 0) });
    if (ti >= remaining.length) break;
  }
  const text = [
    "# Study plan",
    "",
    "Period: " + fmtDate(from) + " ~ " + fmtDate(to) + " (" + planWeeks + " week(s), " + hpw + "h/week)",
    "",
    "| Week | Date range | Topic(s) | Hours |",
    "|------|-----------|----------|-------|",
    ...rows.map((r) => "| " + r.week + " | " + r.range + " | " + (r.items.map((x) => x.name + " (" + x.hours + "h)").join(", ") || "-") + " | " + r.hours + " |"),
  ].join("\n");
  return { weeks: planWeeks, rows, totalHours, text };
```

</details>

**依据 5 · 源码核查**：[lib/education.js:284-356](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L284-L356)

题目占位与分箱。

<details>
<summary>查看原文（73行）</summary>

```text
/** Generate question skeletons by type, difficulty and topic. */
export function buildQuestions({ topic = "", count = 5, types = ["single"], difficulty = "medium", points = 5 } = {}) {
  const label = String(topic || "").trim();
  if (!label) throw new Error("education: topic is required");
  const n = Math.max(1, Math.min(50, Math.floor(Number(count) || 5)));
  const allowed = ["single", "multiple", "fill", "short"];
  const list = (Array.isArray(types) && types.length > 0 ? types : ["single"]).filter((t) => allowed.includes(t));
  if (list.length === 0) throw new Error("education: types must be single|multiple|fill|short");
  const levels = { easy: "识记/理解", medium: "应用/分析", hard: "评价/创造" };
  if (!levels[difficulty]) throw new Error("education: difficulty must be easy|medium|hard");
  const pts = Number(points) || 5;
  const items = [];
  for (let i = 0; i < n; i++) {
    const type = list[i % list.length];
    const no = i + 1;
    let stem = "";
    let options = [];
    let answer = "";
    if (type === "single" || type === "multiple") {
      const isMulti = type === "multiple";
      options = ["A", "B", "C", "D"].map((L, j) => L + ". (待填写选项 " + (j + 1) + ")");
      stem = no + ". [" + (isMulti ? "多选" : "单选") + "] 关于「" + label + "」，下列说法正确的是（　）";
      answer = isMulti ? "A、C" : "A";
    } else if (type === "fill") {
      stem = no + ". [填空] 「" + label + "」的核心是 ______。";
      answer = "(参考答案待补充)";
    } else {
      stem = no + ". [简答] 请简述「" + label + "」的基本原理与应用场景。";
      answer = "(评分要点待补充：原理、应用、表述)";
    }
    items.push({ no, type, difficulty, level: levels[difficulty], points: pts, stem, options, answer });
  }
  const text = [
    "# 试题骨架：" + label + "（" + difficulty + " / " + levels[difficulty] + "）",
    "",
    ...items.map((it) => [it.stem, ...it.options, "答案：" + it.answer + "（" + it.points + " 分）", ""].join("\n")),
  ].join("\n").trimEnd();
  return { items, count: items.length, difficulty, text };
}

/** Class score statistics: mean, median, stdev, pass rate, score bands. */
export function classStats({ scores = [], full = 100, passPct = 60, bands = 5 } = {}) {
  const list = (Array.isArray(scores) ? scores : []).map(Number).filter((x) => Number.isFinite(x));
  if (list.length === 0) throw new Error("education: at least one numeric score is required");
  const fullNum = Number(full);
  if (!Number.isFinite(fullNum) || fullNum <= 0) throw new Error("education: full score must be positive");
  const maxScore = fullNum;
  const sorted = [...list].sort((a, b) => a - b);
  const mean = list.reduce((a, b) => a + b, 0) / list.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const stdev = Math.sqrt(list.reduce((a, b) => a + (b - mean) ** 2, 0) / list.length);
  const passLine = ((Number(passPct) || 60) / 100) * maxScore;
  const passed = list.filter((s) => s >= passLine).length;
  const nb = Math.max(2, Math.min(10, Math.floor(Number(bands) || 5)));
  const width = maxScore / nb;
  const distribution = [];
  for (let i = 0; i < nb; i++) {
    const lo = i * width;
    const hi = (i + 1) * width;
    const c = list.filter((s) => (i === nb - 1 ? s >= lo && s <= hi : s >= lo && s < hi)).length;
    distribution.push({ band: round1(lo) + "-" + round1(hi), count: c, pct: round1((c / list.length) * 100) });
  }
  const text = [
    "# Class statistics",
    "",
    "n=" + list.length + " | mean=" + round1(mean) + " | median=" + round1(median) + " | stdev=" + round1(stdev),
    "max=" + round1(Math.max(...list)) + " | min=" + round1(Math.min(...list)) + " | pass line=" + round1(passLine) + " | pass rate=" + round1((passed / list.length) * 100) + "%",
    "",
    "| Score band | Count | % |",
    "|------------|-------|---|",
    ...distribution.map((d) => "| " + d.band + " | " + d.count + " | " + d.pct + " |"),
  ].join("\n");
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 测试和分阶段成本能证明什么？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

测试直接导入生产纯逻辑，覆盖分钟和、典型坏索引/重复选项、TSV转义、正常评分、计划、题型计数上限及基本统计。分离纯模块利于复核和复用，输入错误有部分显式拒绝；但测试以正常取值居多，未覆盖重复schema工具壳、null题、超满分/零阈值/分箱不守恒、计划容量不足或可读性测量效度，本次只读不执行。

首次只需匹配宿主和选择学校规则，插件不自己留存学生数据，也无网络外发，但调用参数/结果仍经过宿主模型和会话，敏感成绩需按宿主数据流程处理。持续成本为本地计算和模型调用上下文，没有插件独立服务费；人工审题、改模板、复算成绩可能超过格式节时，未提供量化对照。失败恢复可重算文本，无插件持久状态要回滚；若结果已经导入成绩册或发给学生，外部纠正由使用者承担。

#### 证据与依据

**依据 1 · 源码核查**：[test/education.test.mjs:1-184](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/test/education.test.mjs#L1-L184)

生产模块测试覆盖。

<details>
<summary>查看原文（184行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  buildGradeSheet,
  buildQuestions,
  buildRubric,
  buildStudyPlan,
  classStats,
  lessonPlan,
  readability,
  toFlashcards,
  validateQuiz,
} from "../lib/education.js";

test("lessonPlan picks grade band and budgets minutes", () => {
  const out = lessonPlan({ topic: "Fractions", grade: "secondary", minutes: 50 });
  assert.ok(out.startsWith("# Lesson Plan: Fractions"));
  assert.ok(out.includes("Grade band: secondary"));
  const mins = [...out.matchAll(/\((\d+) min\)/g)].map((m) => Number(m[1]));
  assert.equal(mins.reduce((a, b) => a + b, 0), 50);
  assert.ok(out.includes("## Learning objectives"));
});

test("lessonPlan falls back for unknown grade", () => {
  const out = lessonPlan({ grade: "whatever", minutes: 30 });
  assert.ok(out.includes("Grade band: secondary"));
});

test("validateQuiz flags bad answer index and duplicate options", () => {
  const res = validateQuiz({
    items: [
      { stem: "Q", options: ["a", "a", "b"], answer: 5 },
    ],
  });
  assert.equal(res.valid, false);
  assert.ok(res.issues.some((i) => /duplicate/.test(i)));
  assert.ok(res.issues.some((i) => /out of range/.test(i)));
});

test("validateQuiz passes a good item", () => {
  const res = validateQuiz({
    items: [{ stem: "What is 2+2?", options: ["3", "4", "5"], answer: 1, explanation: "2+2=4" }],
  });
  assert.equal(res.valid, true);
  assert.equal(res.itemCount, 1);
});

test("buildRubric renders criteria x levels table", () => {
  const out = buildRubric({ criteria: ["Accuracy", "Clarity"], levels: 4 });
  assert.ok(out.includes("| Criteria | Level 1 | Level 2 | Level 3 | Level 4 |"));
  assert.ok(out.includes("| Accuracy |"));
  assert.ok(out.includes("| Clarity |"));
});

test("toFlashcards tsv escapes and counts", () => {
  const { text, count } = toFlashcards({ pairs: [{ q: "Q1\t", a: "A1" }, { q: "Q2", a: "A2" }], format: "tsv" });
  assert.equal(count, 2);
  assert.equal(text, "Q1\tA1\nQ2\tA2");
  assert.ok(!text.includes("\n\n"));
});

test("toFlashcards markdown", () => {
  const { text } = toFlashcards({ pairs: [{ q: "Q", a: "A" }], format: "markdown" });
  assert.ok(text.includes("Q: Q"));
  assert.ok(text.includes("A: A"));
});

test("readability English Flesch labels easy text", () => {
  const res = readability({ text: "The cat sat on the mat. It was very happy.", lang: "en" });
  assert.ok(["A1-A2", "B1"].includes(res.label));
  assert.ok(res.metrics.words >= 10);
  assert.ok(typeof res.metrics.flesch === "number");
});

test("readability CJK heuristics", () => {
  const res = readability({ text: "这是一个很长的句子，用来测试可读性。它包含多个分句。", lang: "zh" });
  assert.ok(res.metrics.sentences >= 2);
  assert.ok(["light", "moderate", "dense"].includes(res.label));
});


test("buildGradeSheet computes totals and letter grade", () => {
  const sheet = buildGradeSheet({
    items: [
      { name: "Q1", score: 8, max: 10, comment: "good" },
      { name: "Q2", score: 5, max: 10 },
      { name: "Essay", score: 30, max: 40 },
    ],
  });
  assert.equal(sheet.totalScore, 43);
  assert.equal(sheet.totalMax, 60);
  assert.ok(sheet.totalPct > 70);
  assert.equal(sheet.grade, "C");
  assert.equal(sheet.pass, true);
  assert.ok(sheet.text.includes("| **Total** | | **43** | 60 |"));
});

test("buildGradeSheet fails below pass threshold", () => {
  const sheet = buildGradeSheet({ items: [{ name: "Q1", score: 1, max: 10 }], passPct: 60 });
  assert.equal(sheet.pass, false);
  assert.equal(sheet.grade, "F");
  assert.ok(sheet.text.includes("FAIL"));
});

test("buildGradeSheet rejects bad input", () => {
  assert.throws(() => buildGradeSheet({ items: [] }));
  assert.throws(() => buildGradeSheet({ items: [{ name: "x", score: -1, max: 10 }] }));
  assert.throws(() => buildGradeSheet({ items: [{ name: "x", score: 1, max: 0 }] }));
});

test("buildStudyPlan builds weekly rows within the date range", () => {
  const plan = buildStudyPlan({
    start: "2026-09-01", end: "2026-09-21", hoursPerWeek: 10,
    topics: [{ name: "Algebra", hours: 12 }, { name: "Geometry", hours: 12 }],
  });
  assert.ok(plan.weeks >= 3, "at least 3 weeks");
  assert.ok(plan.rows.length <= 3);
  assert.equal(plan.totalHours, 24);
  assert.ok(plan.text.startsWith("# Study plan"));
  const hoursSum = plan.rows.reduce((s, r) => s + r.hours, 0);
  assert.equal(hoursSum, 24);
});

test("buildStudyPlan handles zero-hour topics without looping", () => {
  const plan = buildStudyPlan({
    start: "2026-09-01", end: "2026-09-07", hoursPerWeek: 5,
    topics: [{ name: "Optional", hours: 0 }],
  });
  assert.ok(plan.rows.length >= 1);
  assert.equal(plan.totalHours, 0);
});

test("buildStudyPlan rejects bad dates and empty topics", () => {
  assert.throws(() => buildStudyPlan({ start: "2026-01-01", end: "2025-01-01", topics: [{ name: "x", hours: 1 }] }));
  assert.throws(() => buildStudyPlan({ start: "bad", end: "2026-01-01", topics: [{ name: "x", hours: 1 }] }));
  assert.throws(() => buildStudyPlan({ start: "2026-01-01", end: "2026-01-08", topics: [] }));
});


test("buildQuestions scaffolds items across requested types", () => {
  const q = buildQuestions({ topic: "分数", count: 4, types: ["single", "fill"], difficulty: "easy" });
  assert.equal(q.count, 4);
  assert.equal(q.items[0].type, "single");
  assert.equal(q.items[1].type, "fill");
  assert.ok(q.items[0].stem.includes("分数"));
  assert.equal(q.items[0].level, "识记/理解");
  assert.ok(q.text.startsWith("# 试题骨架"));
});

test("buildQuestions validates topic, types and difficulty", () => {
  assert.throws(() => buildQuestions({ topic: "" }));
  assert.throws(() => buildQuestions({ topic: "x", types: ["bogus"] }));
  assert.throws(() => buildQuestions({ topic: "x", difficulty: "impossible" }));
});

test("buildQuestions caps count", () => {
  const q = buildQuestions({ topic: "x", count: 999 });
  assert.ok(q.count <= 50);
});

test("classStats computes mean, median and pass rate", () => {
  const s = classStats({ scores: [95, 88, 72, 60, 45, 30], full: 100, passPct: 60 });
  assert.equal(s.n, 6);
  assert.equal(s.mean, 65);
  assert.equal(s.median, 66);
  assert.equal(s.max, 95);
  assert.equal(s.min, 30);
  assert.equal(s.passLine, 60);
  assert.equal(s.passRate, 66.7);
  assert.ok(s.stdev > 0);
});

test("classStats builds score bands covering all students", () => {
  const s = classStats({ scores: [100, 80, 60, 40, 20, 0], full: 100, bands: 5 });
  assert.equal(s.distribution.length, 5);
  const total = s.distribution.reduce((a, b) => a + b.count, 0);
  assert.equal(total, 6, "all students counted");
});

test("classStats rejects empty or invalid input", () => {
  assert.throws(() => classStats({ scores: [] }));
  assert.throws(() => classStats({ scores: ["a", "b"] }));
  assert.throws(() => classStats({ scores: [1], full: 0 }));
});
```

</details>

**依据 2 · 源码核查**：[lib/index.js:120-157](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L120-L157)

纯计算分派。

<details>
<summary>查看原文（38行）</summary>

```text
      let valid;
      let count;
      let label;
      let metrics;
      switch (action) {
        case "lesson":
          text = lessonPlan({ topic: args.topic, subject: args.subject, grade: args.grade, minutes: args.minutes });
          break;
        case "quiz":
          ({ issues, valid, itemCount: count } = validateQuiz({ items: args.items }));
          text = valid
            ? "Quiz valid: " + count + " item(s) OK."
            : "Quiz issues found:\n- " + issues.join("\n- ");
          break;
        case "rubric":
          text = buildRubric({ criteria: args.criteria, levels: args.levels });
          break;
        case "flashcard":
          ({ text, count } = toFlashcards({ pairs: args.pairs, format: args.format }));
          break;
        case "level":
          ({ label, metrics } = readability({ text: args.text, lang: args.lang }));
          text = "Readability: " + label + " — " + JSON.stringify(metrics);
          break;
        case "grade":
          text = buildGradeSheet({ items: args.items, passPct: args.passPct }).text;
          break;
        case "studyplan":
          text = buildStudyPlan({ start: args.start, end: args.end, hoursPerWeek: args.hoursPerWeek, topics: args.topics }).text;
          break;
        case "question":
          text = buildQuestions({ topic: args.topic, count: args.count, types: args.types, difficulty: args.difficulty, points: args.points }).text;
          break;
        case "classstats":
          text = classStats({ scores: args.scores, full: args.full, passPct: args.passPct, bands: args.bands }).text;
          break;
        default:
          throw new Error("edu_kit: unknown action '" + action + "'");
```

</details>

**依据 3 · 源码核查**：[lib/education.js:129-145](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L129-L145)

TSV清理。

<details>
<summary>查看原文（17行）</summary>

```text

/** Convert Q/A pairs to Anki TSV or markdown cards. */
export function toFlashcards({ pairs = [], format = "tsv" } = {}) {
  if (!Array.isArray(pairs) || pairs.length === 0) {
    return { text: "(no pairs provided — use [{q: ..., a: ...}])", count: 0 };
  }
  const rows = pairs.map((p) => {
    const q = p && typeof p.q === "string" ? p.q : "";
    const a = p && typeof p.a === "string" ? p.a : "";
    return { q, a };
  });
  if (format === "markdown") {
    return { text: rows.map((r) => "Q: " + r.q + "\nA: " + r.a).join("\n\n"), count: rows.length };
  }
  return { text: rows.map((r) => escapeTsv(r.q) + "\t" + escapeTsv(r.a)).join("\n"), count: rows.length };
}

```

</details>

#### 缺口

- 启发式难度标签与目标学习者/课程标准的对应效度没有校准材料
  **影响**：不能按A1-C2或light标签自动分流/定级学生
  **进一步探讨**：用有教师标注的固定文本集比较标签和误分，保留原指标而非只报等级

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何采用以及继续探讨？

**研究主题**：新假设与验证、采用判断

#### 完整回答

教案骨架、格式转换和常规算表可在教师审阅下试用；成绩先限制0到full并显式设阈值、对比分箱人数与n，计划对照总需求与已排工时，题目占位答案必须替换并人工核知识。正式成绩自动发布、以可读性标签判能力或依赖工具PASS作教学验收时应暂缓。

进一步可研究按action分离输入schema、返回具体结构与规则版本、校验数值域并显式剩余需求，建立“结构有效/知识正确/教学适用”三层说明。基线是当前宽items和文本输出；最小反例为null题、两种题型答案格式、超满分和0阈值、分箱人数不守恒、日期容量不足及同句长不同知识难度。比较参数错误率、复算差异、漏排工时与教师校正时间，尚未验证真实效果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:64-90](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L64-L90)

schema基线。

<details>
<summary>查看原文（27行）</summary>

```text
      items: {
        type: "array",
        items: { type: "object", additionalProperties: false,
          properties: {
            stem: { type: "string" },
            options: { type: "array", items: { type: "string" } },
            answer: { type: "integer" },
            explanation: { type: "string" },
          },
        },
        description: "Quiz items [{stem, options[], answer, explanation}] (quiz).",
      },
      criteria: { type: "array", items: { type: "string" }, description: "Rubric criteria (rubric)." },
      levels: { type: "integer", description: "Number of rubric levels (rubric)." },
      pairs: {
        type: "array",
        items: { type: "object", additionalProperties: false, properties: { q: { type: "string" }, a: { type: "string" } } },
        description: "Q/A pairs for flashcards (flashcard).",
      },
      format: { type: "string", description: "tsv | markdown (flashcard)." },
      text: { type: "string", description: "Text to grade (level)." },
      items: { type: "array", items: { type: "object", additionalProperties: true }, description: "Graded items [{name, score, max, comment}] (grade)." },
      passPct: { type: "number", description: "Pass threshold percent (grade)." },
      start: { type: "string", description: "Plan start date YYYY-MM-DD (studyplan)." },
      end: { type: "string", description: "Plan end date YYYY-MM-DD (studyplan)." },
      hoursPerWeek: { type: "number", description: "Weekly study hours (studyplan)." },
      topics: { type: "array", items: { type: "object", additionalProperties: true }, description: "Topics [{name, hours}] (studyplan)." },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:142-157](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/index.js#L142-L157)

text输出基线。

<details>
<summary>查看原文（16行）</summary>

```text
          text = "Readability: " + label + " — " + JSON.stringify(metrics);
          break;
        case "grade":
          text = buildGradeSheet({ items: args.items, passPct: args.passPct }).text;
          break;
        case "studyplan":
          text = buildStudyPlan({ start: args.start, end: args.end, hoursPerWeek: args.hoursPerWeek, topics: args.topics }).text;
          break;
        case "question":
          text = buildQuestions({ topic: args.topic, count: args.count, types: args.types, difficulty: args.difficulty, points: args.points }).text;
          break;
        case "classstats":
          text = classStats({ scores: args.scores, full: args.full, passPct: args.passPct, bands: args.bands }).text;
          break;
        default:
          throw new Error("edu_kit: unknown action '" + action + "'");
```

</details>

**依据 3 · 源码核查**：[lib/education.js:237-278](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L237-L278)

计划基线。

<details>
<summary>查看原文（42行）</summary>

```text
export function buildStudyPlan({ start = "", end = "", hoursPerWeek = 10, topics = [] } = {}) {
  const from = new Date(start + "T00:00:00");
  const to = new Date(end + "T00:00:00");
  if (Number.isNaN(from.getTime()) || Number.isNaN(to.getTime())) throw new Error("education: start and end dates are required (YYYY-MM-DD)");
  if (to < from) throw new Error("education: end must not be before start");
  const totalDays = Math.round((to - from) / 86400000) + 1;
  const weeks = Math.max(1, Math.ceil(totalDays / 7));
  const list = (Array.isArray(topics) ? topics : []).filter((t) => t && t.name);
  if (list.length === 0) throw new Error("education: at least one topic is required");
  const hpw = Math.max(0, Number(hoursPerWeek) || 0);
  const remaining = list.map((t) => ({ name: t.name, hours: Math.max(0, Number(t.hours) || 0) }));
  const totalHours = remaining.reduce((s, t) => s + t.hours, 0);
  const weeksNeeded = hpw > 0 ? Math.max(1, Math.ceil(totalHours / hpw)) : weeks;
  const planWeeks = Math.min(weeks, weeksNeeded);
  const rows = [];
  let ti = 0;
  for (let w = 1; w <= planWeeks; w++) {
    const ws = new Date(from.getTime() + (w - 1) * 7 * 86400000);
    const we = new Date(Math.min(ws.getTime() + 6 * 86400000, to.getTime()));
    const items = [];
    let budget = hpw;
    while (budget > 0 && ti < remaining.length) {
      const t = remaining[ti];
      if (t.hours <= 0) { ti++; continue; }
      const take = Math.min(t.hours, budget);
      items.push({ name: t.name, hours: take });
      t.hours -= take;
      budget -= take;
    }
    rows.push({ week: w, range: fmtDate(ws) + " ~ " + fmtDate(we), items, hours: items.reduce((s, x) => s + x.hours, 0) });
    if (ti >= remaining.length) break;
  }
  const text = [
    "# Study plan",
    "",
    "Period: " + fmtDate(from) + " ~ " + fmtDate(to) + " (" + planWeeks + " week(s), " + hpw + "h/week)",
    "",
    "| Week | Date range | Topic(s) | Hours |",
    "|------|-----------|----------|-------|",
    ...rows.map((r) => "| " + r.week + " | " + r.range + " | " + (r.items.map((x) => x.name + " (" + x.hours + "h)").join(", ") || "-") + " | " + r.hours + " |"),
  ].join("\n");
  return { weeks: planWeeks, rows, totalHours, text };
```

</details>

**依据 4 · 源码核查**：[lib/education.js:324-356](https://github.com/863683348/dsh-plugin-education/blob/2d880f86c9160652e27c1f4702265822e0e726e9/lib/education.js#L324-L356)

统计域基线。

<details>
<summary>查看原文（33行）</summary>

```text
/** Class score statistics: mean, median, stdev, pass rate, score bands. */
export function classStats({ scores = [], full = 100, passPct = 60, bands = 5 } = {}) {
  const list = (Array.isArray(scores) ? scores : []).map(Number).filter((x) => Number.isFinite(x));
  if (list.length === 0) throw new Error("education: at least one numeric score is required");
  const fullNum = Number(full);
  if (!Number.isFinite(fullNum) || fullNum <= 0) throw new Error("education: full score must be positive");
  const maxScore = fullNum;
  const sorted = [...list].sort((a, b) => a - b);
  const mean = list.reduce((a, b) => a + b, 0) / list.length;
  const mid = Math.floor(sorted.length / 2);
  const median = sorted.length % 2 === 1 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
  const stdev = Math.sqrt(list.reduce((a, b) => a + (b - mean) ** 2, 0) / list.length);
  const passLine = ((Number(passPct) || 60) / 100) * maxScore;
  const passed = list.filter((s) => s >= passLine).length;
  const nb = Math.max(2, Math.min(10, Math.floor(Number(bands) || 5)));
  const width = maxScore / nb;
  const distribution = [];
  for (let i = 0; i < nb; i++) {
    const lo = i * width;
    const hi = (i + 1) * width;
    const c = list.filter((s) => (i === nb - 1 ? s >= lo && s <= hi : s >= lo && s < hi)).length;
    distribution.push({ band: round1(lo) + "-" + round1(hi), count: c, pct: round1((c / list.length) * 100) });
  }
  const text = [
    "# Class statistics",
    "",
    "n=" + list.length + " | mean=" + round1(mean) + " | median=" + round1(median) + " | stdev=" + round1(stdev),
    "max=" + round1(Math.max(...list)) + " | min=" + round1(Math.min(...list)) + " | pass line=" + round1(passLine) + " | pass rate=" + round1((passed / list.length) * 100) + "%",
    "",
    "| Score band | Count | % |",
    "|------------|-------|---|",
    ...distribution.map((d) => "| " + d.band + " | " + d.count + " | " + d.pct + " |"),
  ].join("\n");
```

</details>

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
