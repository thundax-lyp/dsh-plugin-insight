# dsh-plugin-academic-writing

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cbeb4db](https://github.com/863683348/dsh-plugin-academic-writing/tree/cbeb4db61d11cc327092f5e7f56d333693e52bde)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/863683348/dsh-plugin-academic-writing) [![npm 30d 1,733](https://img.shields.io/static/v1?label=npm+30d&message=1%2C733&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-academic-writing) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-academic-writing)
<!-- END META -->

> **功能**：为DSH提供论文骨架、题目摘要模板、引用和LaTeX片段，以及词法表达、Markdown结构、术语和投稿清单辅助。

> **亮点**：用一个模型工具提供可重复模板/格式和机械检查，纯逻辑不另发网络或写文件，帮助起草而非学术验收。详见[Q02](#research-q02)。

> **主要限制**：非global捕获regex的match.length不是出现次数；缺作者APA类型分支、引用去重/style覆盖、LaTeX列数/转义有缺口，passed/清单不证明质量。详见[Q03](#research-q03)、[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 服务什么学术任务，合格结果是什么？](#detail-section-11)
  - [Q02 · 如何实现写作/检查并接入模型？](#detail-section-12)
  - [Q03 · 表达/结构/清单结果可当准确计数或质量闸门吗？](#detail-section-13)
  - [Q04 · 引用和LaTeX产物是否完整可靠？](#detail-section-14)
  - [Q05 · 启动和长期使用成本效果如何？](#detail-section-15)
  - [Q06 · 是否推荐，继续探讨从何入手？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：服务已经有真实研究材料、需要论文骨架/引用初稿/格式片段和机械文本检查的DSH用户。单工具十种action提供outline/title/abstract/citation/check/checklist/references/latex/structure/glossary；模型或作者写正文，插件不检索文献、不核事实/引用真伪，也不生成真实研究结果。

合格结果应是模板不冒充论证、格式输出可核、机械提示有范围，不把passed当学术质量或伦理通过。基线是手用写作模板、文献管理器/期刊模板和普通lint。增量是统一模型工具入口与可重复小检查，不替代学术方法/引用管理器/同行评议。

人工模板/文献管理器/期刊规范与常规lint，插件省统一入口但未证明纠错更少。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 骨架/标题/摘要 | 论文初稿结构 | 固定替换不生成研究事实 |
| 引用/列表 | 字段拼接/去重排序 | 非真伪验证/规范认证 |
| check/structure | 词法与Markdown规则 | 计数/范围限制，不评论证 |
| glossary/checklist | 术语候选/自报清单 | 非全局首定义/伦理验收 |
| LaTeX | 代码片段 | 未编译，列宽/转义需核 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt与value-schema DSL | 注册/指导段 | 0.1系peer/作者schema修复记录不等全代际兼容 |
| Cordis/Schemastery | 配置和bundle | package还声明dsh-fs但本实现无文件API |
| 真实研究与题录字段 | 模板/引用输入 | 不自动核事实/来源/标准 |
| 外部期刊/TeX/文献管理流程 | 最终格式交付 | 输出片段不是已验证文档 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主DSL/peer与工具注册 | 不运行投稿/真实修改 |
| 准备材料 | 明确文章类型/真实结果/题录 | 空模板不补造研究 |
| 生成初稿 | 只将工具当模板与机械提示 | 核引用姓名/类型/DOI、LaTeX列 |
| 人工审阅 | 对照原始证据/期刊规范 | passed/勾选均不作验收 |
| 维护 | 修模板/regex/格式样例 | 不把路线图当现有能力 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地工具包，无新增检索/模型API | 核DSL、模板与目标期刊 | 金额与配置时间未知 |
| 持续使用 | 字符串/regex CPU，schema/原稿/结果进入模型上下文 | 审提示与核题录/格式 | 无独立LLM调用不等总token费用0，长稿耗时未知 |
| 失败恢复 | 重新格式化/改TeX/再次模型上下文 | 修错误计数/引用/结构与手工复核 | 不写文件故无自动文件回滚，编辑恢复时间未知 |



#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 统一写作骨架 | 四模板/摘要/标题 | 非内容论证 |
| 机械提示 | regex/标题/术语 | 计数与语言覆盖有缺口 |
| 引用/TeX初稿 | 纯字段格式输出 | 有类型/列宽/转义缺陷，非认证 |
| 投稿准备 | 五项清单 | 只复述输入布尔，不核证据 |

没有与成熟文献管理器/手工模板的总纠错时间、正确率对照，不能因为确定函数就称结果正确。

> **思考**：非global捕获regex的match.length不是出现次数；缺作者APA类型分支、引用去重/style覆盖、LaTeX列数/转义有缺口，passed/清单不证明质量。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用一个模型工具提供可重复模板/格式和机械检查，纯逻辑不另发网络或写文件，帮助起草而非学术验收。详见[Q02](#research-q02)。

不能。HEDGING/PASSIVE/FIRST_PERSON正则只有i无g，text.match只返回首命中及捕获项，.length并非出现次数。FIRST_PERSON有一个捕获组，匹配一次通常长度2，所以“2 pronouns”不代表两处。PASSIVE/HEDGING也有捕获项，不可解释成全篇数量；源码语义足以指出计数实现问题，本轮不运行目标函数。

check的passed只表示这些有限regex/长句/结尾标点没有issue。中文代词/被动、论证事实、引用与学术合规不在检测范围；hedging可合理表达不确定，却会产生issue，不能直接把“有issue”当不合格论文。structure只识行首H1-H3，代码围栏内同形标题可误收、H4忽略，wordBudget实际去空白字符数，coverage只查标题子串，不读段落内容。

glossary只把大写/驼峰词当候选，中文定义即使找到也未必进候选列表；各pattern依次扫描再first-set，不保证跨不同pattern的全局第一次定义。checklist只是根据传入五布尔值打勾，不检查伦理批文/冲突声明/数据可得或期刊要求，勾全不是合规证明。

引用格式器只按字段拼接，GB/APA/MLA名称是作者目标，未包含规范条文/全类型测试矩阵，不视为标准认证。APA缺作者时names被设为字符串“(n.d.)”，其length>1使第132行先进入names.slice(0,-1).join分支；slice结果仍为字符串且没有join方法，静态可推出TypeError，而不是走到names[0]输出左括号。index的citation分支没有捕获此异常，会向工具调用传播，这是具体类型分支缺陷；有作者按空白最后词作姓也不适合所有姓名/机构。APA路径不追加doi，GB/MLA追加，但不能由单条输出断言所有格式完整达标。

references去重按title+首作者+year的小写键，不用DOI/版本/全作者，可能合并本应独立版本或留下标题变体重复。map调用formatCitation({style,...e})使条目自带style可覆盖列表style，列表标题与实际条目可能不同。没有查验题录真伪/链接/DOI解析。

latexTable算n为最大列/行宽，但tabular声明只按columns个数，若某行更宽或columns空，单元格与列规格不一致。texEscape仅转义&%_#$，花括号/反斜线等未处理；数学/代码字符串本就允许原样LaTeX，不能把“生成片段”当已编译安全文档，正文含结束环境/特殊字符需核。插件不调用TeX、不执行输出；后续编译器权限是另一个边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

非global捕获regex的match.length不是出现次数；缺作者APA类型分支、引用去重/style覆盖、LaTeX列数/转义有缺口，passed/清单不证明质量。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，先修计数/无作者引用/TeX列等基础分支，只当草稿工具，不作学术或投稿验收。详见[Q06](#research-q06)。

合格结果应是模板不冒充论证、格式输出可核、机械提示有范围，不把passed当学术质量或伦理通过。基线是手用写作模板、文献管理器/期刊模板和普通lint。增量是统一模型工具入口与可重复小检查，不替代学术方法/引用管理器/同行评议。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。模板/纯函数范围清楚，但机械计数与格式基础分支需修，不能把确定输出当正确/合规。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/academic.js、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：两lib完整和package/README/patch；不运行目标测试/编译TeX/修改稿件/投稿，不作官方规范完整认证。
- 下一步：可继续用人工标准样例核重复匹配/语言范围/缺字段/引用版本与TeX列，比较总错误与人工修正，不运行真实投稿。

**分析版本**

- **仓库**：[863683348/dsh-plugin-academic-writing](https://github.com/863683348/dsh-plugin-academic-writing)
- **版本号**：0.3.2（[固定提交 cbeb4db](https://github.com/863683348/dsh-plugin-academic-writing/tree/cbeb4db61d11cc327092f5e7f56d333693e52bde)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索带位置/范围/未知的规则收据和有版本规范样例/格式前置校验，比较错误与人工纠错；未实现。详见[Q06](#research-q06)。

可继续用人工标准样例核重复匹配/语言范围/缺字段/引用版本与TeX列，比较总错误与人工修正，不运行真实投稿。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 548 | 484 | 40 | — |
| .md | source | 4 | 158 | — | — | 1476 |
| .mjs | test | 1 | 193 | 170 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/863683348/dsh-plugin-academic-writing/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/863683348/dsh-plugin-academic-writing/issues?q=is%3Aissue+created%3A2026-09-22T09%3A08%3A49.898Z..2026-10-22T09%3A08%3A49.898Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/863683348/dsh-plugin-academic-writing/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A08%3A49.898Z..2026-10-22T09%3A08%3A49.898Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核模板/机械检查与学术质量区别、真实regex/格式/TeX分支、宿主依赖、总成本与采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 服务什么学术任务，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

服务已经有真实研究材料、需要论文骨架/引用初稿/格式片段和机械文本检查的DSH用户。单工具十种action提供outline/title/abstract/citation/check/checklist/references/latex/structure/glossary；模型或作者写正文，插件不检索文献、不核事实/引用真伪，也不生成真实研究结果。

合格结果应是模板不冒充论证、格式输出可核、机械提示有范围，不把passed当学术质量或伦理通过。基线是手用写作模板、文献管理器/期刊模板和普通lint。增量是统一模型工具入口与可重复小检查，不替代学术方法/引用管理器/同行评议。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-3](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/README.md#L3-L3)

作者模型写正文/插件供模板定位。

```text
An **academic writing toolkit** for [DeepSeek Harness](https://github.com/deepseek-ai/dsh) agents. The model composes the prose; the plugin supplies structure, formats, and deterministic checks.
```

**依据 2 · 源码核查**：[lib/index.js:56-64](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js#L56-L64)

十action入口。

```text
  ctx.tools.register(defineTool({
    name: "academic_writing",
    description: "Academic-writing helper: `outline` (paper outline skeleton by type: research/review/proposal/essay), `title` (title variants), `abstract` (structured abstract skeleton), `citation` (reference entry formatted as GB/T 7714, APA 7, or MLA 9), `check` (phrasing QA on a passage), `checklist` (pre-submission checklist), `references` (sorted/deduplicated reference list), `latex` (LaTeX snippets: table/equation/code/bibliography), `structure` (manuscript structure check against an outline), `glossary` (term/abbreviation glossary with definitions). Use it whenever the task involves drafting or reviewing an academic paper, thesis, or report.",
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: ["outline", "title", "abstract", "citation", "check", "checklist", "references", "latex", "structure", "glossary"],
        description: "Which academic-writing helper to run.",
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何实现写作/检查并接入模型？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

host依tools/systemPrompt注册academic_writing；execute按action把参数传给纯academic函数，输出text与部分issues/passed/items。可关闭personaSection，但静态inject仍含systemPrompt，不能当完全不依赖该服务的模式。默认指导段让模型先结构后检查/清单，未增加自动执行流程。

outline是按research/review/proposal/essay固定模板截前N节，title依固定顺序替换topic/outcome/subtitle，abstract把提供的四段填到标题下，缺段标待写；都不是理解研究后的创造/质量评价。check是英文regex和平均字符长，structure是Markdown标题/段落字符预算/标题子串覆盖；glossary从括号/大写与camelCase候选取定义频次。

贡献在本地确定逻辑与宿主入口统一、少反复输出模板，不含新学术写作算法。没有文件/网络访问或额外模型调用，原稿仍作为tool参数/结果进入宿主上下文，隐私/总token不因纯函数而归零。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:34-52](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js#L34-L52)

服务/默认指导段。

<details>
<summary>查看原文（19行）</summary>

```text
const inject = ["tools", "systemPrompt"];

/** Composition-row configuration for the plugin entry. */
const Config = z.object({
  /** Register the academic prompt-guidance section. */
  personaSection: z.boolean().default(true),
  /** Order of the section (ascending; persona is 0). */
  sectionOrder: z.number().default(6),
});

const SECTION_TEXT = [
  "Academic writing guidance:",
  "- Structure first: use the `academic_writing` tool with action `outline` to draft the paper skeleton, then fill each section.",
  "- Use `title` for title variants, `abstract` for a structured abstract skeleton, and `citation` to format references (GB/T 7714, APA 7, MLA 9) consistently.",
  "- Before delivering a passage, run `check` for phrasing issues (passive voice, first-person pronouns, hedging, sentence length).",
  "- Finish with `checklist` before submission; every item must be resolved.",
  "- For the final manuscript, build the reference list with `references` and generate LaTeX snippets (`latex`: table/equation/code/bibliography) as needed.",
  "- Before submitting, run `structure` (heading levels, paragraph budget, outline coverage) and `glossary` (terms/abbreviations with definitions).",
].join("\n");
```

</details>

**依据 2 · 源码核查**：[lib/index.js:125-185](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js#L125-L185)

参数分发/返回。

<details>
<summary>查看原文（61行）</summary>

```text
    execute: async (args) => {
      const action = args.action;
      let text = "";
      let issues;
      let passed;
      let items;
      switch (action) {
        case "outline":
          text = buildOutline({ topic: args.topic, type: args.type, sections: args.sections });
          break;
        case "title":
          items = suggestTitles({ topic: args.topic, outcome: args.outcome, subtitle: args.subtitle, variants: args.variants });
          text = items.map((t) => "- **" + t.style + ":** " + t.title).join("\n");
          break;
        case "abstract":
          text = buildAbstract({ background: args.background, methods: args.methods, results: args.results, conclusion: args.conclusion });
          break;
        case "citation":
          text = formatCitation({
            style: args.style, authors: args.authors, year: args.year, title: args.title,
            kind: args.kind, journal: args.journal, volume: args.volume, issue: args.issue,
            pages: args.pages, doi: args.doi, url: args.url, publisher: args.publisher,
            city: args.city, accessed: args.accessed,
          });
          break;
        case "check":
          ({ issues, passed } = academicCheck(args.text ?? ""));
          text = (issues.length === 0 ? "No issues found — passage looks clean." : "Issues found:\n- " + issues.join("\n- "));
          break;
        case "checklist":
          text = submissionChecklist({
            ethics: args.ethics, conflict: args.conflict, data: args.data,
            funding: args.funding, formatting: args.formatting,
          });
          break;
        case "references":
          text = buildReferenceList({ style: args.style, entries: args.entries });
          break;
        case "latex":
          if (args.snippet === "table") {
            text = latexTable({ columns: args.columns, rows: args.rows, caption: args.caption, label: args.label });
          } else if (args.snippet === "equation") {
            text = latexEquation({ kind: args.latexKind, latex: args.latex });
          } else if (args.snippet === "code") {
            text = latexCode({ language: args.language, code: args.code });
          } else if (args.snippet === "bibliography") {
            text = latexBibliography({ entries: args.entries });
          } else {
            throw new Error("academic_writing: latex needs snippet in table|equation|code|bibliography");
          }
          break;
        case "structure":
          ({ report: text, issues } = analyzeStructure({ text: args.text, outlineSections: args.outlineSections, wordBudget: args.wordBudget }));
          break;
        case "glossary":
          text = buildGlossary({ text: args.text, minCount: args.minTermCount, maxTerms: args.maxTerms }).report;
          break;
        default:
          throw new Error("academic_writing: unknown action '" + action + "'");
      }
      return { action, text, issues, passed, items };
```

</details>

**依据 3 · 源码核查**：[lib/academic.js:67-107](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L67-L107)

模板替换。

<details>
<summary>查看原文（41行）</summary>

```text
export function buildOutline({ topic = "", type = "research", sections } = {}) {
  const tpl = OUTLINE_TEMPLATES[type] ?? OUTLINE_TEMPLATES.research;
  const rows = sections != null ? tpl.slice(0, clamp(Math.floor(sections), 1, tpl.length)) : tpl;
  const lines = ["# Outline" + (topic ? ": " + topic : ""), ""];
  for (const [no, title, hint] of rows) {
    lines.push("## " + no + ". " + title, "", "- " + hint, "");
  }
  return lines.join("\n").trimEnd();
}

/** Propose title variants for a paper topic. */
export function suggestTitles({ topic = "", outcome = "the outcome", subtitle = "a closer look", variants = 3 } = {}) {
  const n = clamp(Math.floor(variants), 1, Object.keys(TITLE_TEMPLATES).length);
  const entries = Object.entries(TITLE_TEMPLATES);
  const out = [];
  for (let i = 0; i < n; i++) {
    const [style, tpl] = entries[i % entries.length];
    out.push({
      style,
      title: tpl
        .replaceAll("{topic}", topic || "the research topic")
        .replaceAll("{outcome}", outcome)
        .replaceAll("{subtitle}", subtitle),
    });
  }
  return out;
}

/** Build a structured abstract skeleton from the four standard moves. */
export function buildAbstract({ background = "", methods = "", results = "", conclusion = "" } = {}) {
  const moves = [
    ["Background", background],
    ["Methods", methods],
    ["Results", results],
    ["Conclusion", conclusion],
  ];
  const lines = ["Abstract (structured):", ""];
  for (const [label, text] of moves) {
    lines.push("**" + label + ".** " + (text || "(to be drafted)")); // placeholder; fixed below
  }
  return lines.join("\n").trimEnd();
```

</details>

**依据 4 · 源码核查**：[lib/academic.js:255-300](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L255-L300)

机械结构。

<details>
<summary>查看原文（46行）</summary>

```text
/** Analyze manuscript structure: heading levels, paragraph budget, outline coverage. */
export function analyzeStructure({ text = "", outlineSections = [], wordBudget = 0 } = {}) {
  const src = String(text);
  const headings = [];
  for (const line of src.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+?)\s*$/);
    if (m) headings.push({ level: m[1].length, title: m[2].trim() });
  }
  const issues = [];
  if (headings.length === 0) issues.push("未检测到任何标题（H1-H3）");
  let prev = 0;
  for (const h of headings) {
    if (prev !== 0 && h.level > prev + 1) issues.push("标题层级跳级：" + h.title + "（H" + prev + " -> H" + h.level + "）");
    prev = h.level;
  }
  const h1 = headings.filter((h) => h.level === 1);
  if (h1.length > 1) issues.push("发现 " + h1.length + " 个 H1 标题，通常应只保留一个（论文标题）");
  const paragraphs = src.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#"));
  const counts = paragraphs.map((p) => p.replace(/\s+/g, "").length);
  const avgWords = counts.length > 0 ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 0;
  const budget = Number(wordBudget) || 0;
  if (budget > 0) {
    counts.forEach((c, i) => {
      if (c > budget) issues.push("第 " + (i + 1) + " 段 " + c + " 字，超出预算 " + budget);
    });
  }
  const missing = [];
  for (const s of (Array.isArray(outlineSections) ? outlineSections : [])) {
    const label = String(s || "").trim();
    if (!label) continue;
    const found = headings.some((h) => h.title.toLowerCase().includes(label.toLowerCase()));
    if (!found) missing.push(label);
  }
  if (missing.length > 0) issues.push("大纲章节缺失：" + missing.join("、"));
  const report = [
    "# Structure check",
    "",
    "Headings: " + headings.length + " | paragraphs: " + counts.length + " | avg length: " + avgWords + " chars",
    "",
    headings.length > 0 ? "## Heading tree" : "",
    ...headings.map((h) => "  ".repeat(h.level - 1) + "- H" + h.level + " " + h.title),
    "",
    "## Issues",
    issues.length === 0 ? "- 无结构问题" : issues.map((i) => "- " + i).join("\n"),
  ].filter((l) => l !== "").join("\n");
  return { headings, paragraphs: counts.length, avgWords, missing, issues, passed: issues.length === 0, report };
```

</details>

**依据 5 · 源码核查**：[lib/academic.js:304-343](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L304-L343)

术语提取。

<details>
<summary>查看原文（40行）</summary>

```text
export function buildGlossary({ text = "", minCount = 1, maxTerms = 40 } = {}) {
  const src = String(text);
  const defs = new Map();
  const patterns = [
    { re: /([A-Za-z][A-Za-z0-9-]*(?:\s+[A-Za-z][A-Za-z0-9-]*){0,4})\s*\(([A-Z][A-Za-z0-9-]{1,8})\)/g, term: 2, def: 1 },
    { re: /([A-Z][A-Za-z0-9-]{1,8})\s*\(([A-Za-z][A-Za-z0-9-]*(?:\s+[A-Za-z][A-Za-z0-9-]*){0,4})\)/g, term: 1, def: 2 },
    { re: /([\u4e00-\u9fff]{2,12})[（(]([A-Za-z][A-Za-z0-9\s-]{1,40})[)）]/g, term: 1, def: 2 },
  ];
  for (const p of patterns) {
    let m;
    while ((m = p.re.exec(src)) !== null) {
      const term = String(m[p.term] || "").trim();
      const def = String(m[p.def] || "").trim();
      if (!term || !def || term === def) continue;
      if (!defs.has(term)) defs.set(term, def);
    }
  }
  const counts = new Map();
  const candRe = /\b([A-Z]{2,6}|[a-z]+[A-Z][A-Za-z]*)\b/g;
  const stop = /^(?:THE|AND|OR|OF|IN|TO|IS|ARE|IT|AS|AT|BY|FOR|ON|WE|BE|ALL|NOT)$/;
  let m2;
  while ((m2 = candRe.exec(src)) !== null) {
    const t = m2[1];
    if (stop.test(t)) continue;
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  const min = Math.max(1, Number(minCount) || 1);
  const entries = [...counts.entries()]
    .filter(([, c]) => c >= min)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.max(1, Number(maxTerms) || 40))
    .map(([term, count]) => ({ term, count, definition: defs.get(term) || "" }));
  const report = [
    "# Glossary",
    "",
    "| Term | Definition | Count |",
    "|------|------------|-------|",
    ...entries.map((e) => "| " + e.term + " | " + (e.definition || "-") + " | " + e.count + " |"),
  ].join("\n");
  return { entries, defined: entries.filter((e) => e.definition).length, report };
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 表达/结构/清单结果可当准确计数或质量闸门吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能。HEDGING/PASSIVE/FIRST_PERSON正则只有i无g，text.match只返回首命中及捕获项，.length并非出现次数。FIRST_PERSON有一个捕获组，匹配一次通常长度2，所以“2 pronouns”不代表两处。PASSIVE/HEDGING也有捕获项，不可解释成全篇数量；源码语义足以指出计数实现问题，本轮不运行目标函数。

check的passed只表示这些有限regex/长句/结尾标点没有issue。中文代词/被动、论证事实、引用与学术合规不在检测范围；hedging可合理表达不确定，却会产生issue，不能直接把“有issue”当不合格论文。structure只识行首H1-H3，代码围栏内同形标题可误收、H4忽略，wordBudget实际去空白字符数，coverage只查标题子串，不读段落内容。

glossary只把大写/驼峰词当候选，中文定义即使找到也未必进候选列表；各pattern依次扫描再first-set，不保证跨不同pattern的全局第一次定义。checklist只是根据传入五布尔值打勾，不检查伦理批文/冲突声明/数据可得或期刊要求，勾全不是合规证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/academic.js:58-60](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L58-L60)

非global且有捕获组。

```text
const HEDGING = /\b(may|might|could|perhaps|possibly|suggests?|seems?|likely|unlikely|tends?|appears?)\b/i;
const PASSIVE = /\b(was|were|is|are)\s+(conducted|performed|analyzed|analysed|measured|observed|reported|found|shown|collected|carried\s+out|designed|evaluated|examined|tested)\b/i;
const FIRST_PERSON = /\b(I|we|my|our|you|your)\b/i;
```

**依据 2 · 源码核查**：[lib/academic.js:149-177](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L149-L177)

match.length/局部passed/布尔清单。

<details>
<summary>查看原文（29行）</summary>

```text
/** Deterministic academic-phrasing QA on a passage. */
export function academicCheck(text = "") {
  const issues = [];
  const passiveCount = (text.match(PASSIVE) || []).length;
  const firstPersonCount = (text.match(FIRST_PERSON) || []).length;
  const hedgingCount = (text.match(HEDGING) || []).length;
  const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim().length > 0).length;
  if (passiveCount > 0) issues.push(passiveCount + " passive-voice construction(s) found — consider whether the agent voice is intended.");
  if (firstPersonCount > 0) issues.push(firstPersonCount + " first/second-person pronoun(s) found — most academic registers avoid them (check the target venue).");
  if (hedgingCount > 0) issues.push(hedgingCount + " hedging word(s) found — fine for cautious claims; avoid over-hedging.");
  if (sentences > 0 && text.length / sentences > 160) issues.push("Average sentence length exceeds ~160 characters — consider splitting long sentences.");
  if (!/[.!?。！？]$/.test(text.trim())) issues.push("The passage does not end with sentence-final punctuation.");
  return { issues, passiveCount, firstPersonCount, hedgingCount, sentences, passed: issues.length === 0 };
}

/** Pre-submission checklist with completed items marked. */
export function submissionChecklist({ ethics = false, conflict = false, data = false, funding = false, formatting = false } = {}) {
  const items = [
    ["Ethics approval / consent statement is included", ethics],
    ["Conflict-of-interest declaration is present", conflict],
    ["Data availability statement covers reproducibility", data],
    ["Funding sources are acknowledged", funding],
    ["Formatting (template, references, figures) matches the venue guide", formatting],
  ];
  const lines = ["Pre-submission checklist:", ""];
  for (const [label, done] of items) {
    lines.push("- [" + (done ? "x" : " ") + "] " + label);
  }
  lines.push("", "Unchecked items must be resolved before submission.");
```

</details>

**依据 3 · 源码核查**：[lib/academic.js:255-300](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L255-L300)

标题/字符/子串判断。

<details>
<summary>查看原文（46行）</summary>

```text
/** Analyze manuscript structure: heading levels, paragraph budget, outline coverage. */
export function analyzeStructure({ text = "", outlineSections = [], wordBudget = 0 } = {}) {
  const src = String(text);
  const headings = [];
  for (const line of src.split("\n")) {
    const m = line.match(/^(#{1,3})\s+(.+?)\s*$/);
    if (m) headings.push({ level: m[1].length, title: m[2].trim() });
  }
  const issues = [];
  if (headings.length === 0) issues.push("未检测到任何标题（H1-H3）");
  let prev = 0;
  for (const h of headings) {
    if (prev !== 0 && h.level > prev + 1) issues.push("标题层级跳级：" + h.title + "（H" + prev + " -> H" + h.level + "）");
    prev = h.level;
  }
  const h1 = headings.filter((h) => h.level === 1);
  if (h1.length > 1) issues.push("发现 " + h1.length + " 个 H1 标题，通常应只保留一个（论文标题）");
  const paragraphs = src.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p && !p.startsWith("#"));
  const counts = paragraphs.map((p) => p.replace(/\s+/g, "").length);
  const avgWords = counts.length > 0 ? Math.round(counts.reduce((a, b) => a + b, 0) / counts.length) : 0;
  const budget = Number(wordBudget) || 0;
  if (budget > 0) {
    counts.forEach((c, i) => {
      if (c > budget) issues.push("第 " + (i + 1) + " 段 " + c + " 字，超出预算 " + budget);
    });
  }
  const missing = [];
  for (const s of (Array.isArray(outlineSections) ? outlineSections : [])) {
    const label = String(s || "").trim();
    if (!label) continue;
    const found = headings.some((h) => h.title.toLowerCase().includes(label.toLowerCase()));
    if (!found) missing.push(label);
  }
  if (missing.length > 0) issues.push("大纲章节缺失：" + missing.join("、"));
  const report = [
    "# Structure check",
    "",
    "Headings: " + headings.length + " | paragraphs: " + counts.length + " | avg length: " + avgWords + " chars",
    "",
    headings.length > 0 ? "## Heading tree" : "",
    ...headings.map((h) => "  ".repeat(h.level - 1) + "- H" + h.level + " " + h.title),
    "",
    "## Issues",
    issues.length === 0 ? "- 无结构问题" : issues.map((i) => "- " + i).join("\n"),
  ].filter((l) => l !== "").join("\n");
  return { headings, paragraphs: counts.length, avgWords, missing, issues, passed: issues.length === 0, report };
```

</details>

**依据 4 · 源码核查**：[lib/academic.js:304-335](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L304-L335)

pattern遍历与候选范围。

<details>
<summary>查看原文（32行）</summary>

```text
export function buildGlossary({ text = "", minCount = 1, maxTerms = 40 } = {}) {
  const src = String(text);
  const defs = new Map();
  const patterns = [
    { re: /([A-Za-z][A-Za-z0-9-]*(?:\s+[A-Za-z][A-Za-z0-9-]*){0,4})\s*\(([A-Z][A-Za-z0-9-]{1,8})\)/g, term: 2, def: 1 },
    { re: /([A-Z][A-Za-z0-9-]{1,8})\s*\(([A-Za-z][A-Za-z0-9-]*(?:\s+[A-Za-z][A-Za-z0-9-]*){0,4})\)/g, term: 1, def: 2 },
    { re: /([\u4e00-\u9fff]{2,12})[（(]([A-Za-z][A-Za-z0-9\s-]{1,40})[)）]/g, term: 1, def: 2 },
  ];
  for (const p of patterns) {
    let m;
    while ((m = p.re.exec(src)) !== null) {
      const term = String(m[p.term] || "").trim();
      const def = String(m[p.def] || "").trim();
      if (!term || !def || term === def) continue;
      if (!defs.has(term)) defs.set(term, def);
    }
  }
  const counts = new Map();
  const candRe = /\b([A-Z]{2,6}|[a-z]+[A-Z][A-Za-z]*)\b/g;
  const stop = /^(?:THE|AND|OR|OF|IN|TO|IS|ARE|IT|AS|AT|BY|FOR|ON|WE|BE|ALL|NOT)$/;
  let m2;
  while ((m2 = candRe.exec(src)) !== null) {
    const t = m2[1];
    if (stop.test(t)) continue;
    counts.set(t, (counts.get(t) || 0) + 1);
  }
  const min = Math.max(1, Number(minCount) || 1);
  const entries = [...counts.entries()]
    .filter(([, c]) => c >= min)
    .sort((a, b) => b[1] - a[1])
    .slice(0, Math.max(1, Number(maxTerms) || 40))
    .map(([term, count]) => ({ term, count, definition: defs.get(term) || "" }));
```

</details>

#### 缺口

- 不同语言/领域文章的提示误报漏报与计数修复效果无标注对照。
  **影响**：不能量化检测准确率或作论文质量门禁。
  **进一步探讨**：以合成重复代词/被动/hedging、中文/H4/代码围栏、同术语多定义核计数与位置，再用人工标注语料测提示价值。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 引用和LaTeX产物是否完整可靠？

**研究主题**：缺陷与关键质疑

#### 完整回答

引用格式器只按字段拼接，GB/APA/MLA名称是作者目标，未包含规范条文/全类型测试矩阵，不视为标准认证。APA缺作者时names被设为字符串“(n.d.)”，其length>1使第132行先进入names.slice(0,-1).join分支；slice结果仍为字符串且没有join方法，静态可推出TypeError，而不是走到names[0]输出左括号。index的citation分支没有捕获此异常，会向工具调用传播，这是具体类型分支缺陷；有作者按空白最后词作姓也不适合所有姓名/机构。APA路径不追加doi，GB/MLA追加，但不能由单条输出断言所有格式完整达标。

references去重按title+首作者+year的小写键，不用DOI/版本/全作者，可能合并本应独立版本或留下标题变体重复。map调用formatCitation({style,...e})使条目自带style可覆盖列表style，列表标题与实际条目可能不同。没有查验题录真伪/链接/DOI解析。

latexTable算n为最大列/行宽，但tabular声明只按columns个数，若某行更宽或columns空，单元格与列规格不一致。texEscape仅转义&%_#$，花括号/反斜线等未处理；数学/代码字符串本就允许原样LaTeX，不能把“生成片段”当已编译安全文档，正文含结束环境/特殊字符需核。插件不调用TeX、不执行输出；后续编译器权限是另一个边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/academic.js:110-146](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L110-L146)

引用各分支/无作者类型。

<details>
<summary>查看原文（37行）</summary>

```text
/** Format a reference entry in GB/T 7714, APA 7, or MLA 9. */
export function formatCitation({ style = "gb7714", authors = [], year = "", title = "", kind = "journal", journal = "", volume = "", issue = "", pages = "", doi = "", url = "", publisher = "", city = "", edition = "", accessed = "" } = {}) {
  const auth = Array.isArray(authors) ? authors.filter(Boolean) : [];
  const first = auth[0] ?? "";
  const rest = auth.slice(1);
  if (style === "gb7714") {
    const name = (auth.length > 3 ? [first, ...rest.slice(0, 2)].join(", ") + ", et al." : auth.join(", ")) || "(no author)";
    const tag = kind === "book" ? "M" : kind === "conference" ? "C" : kind === "web" ? "EB/OL" : "J";
    let out = name + " " + title + "[" + tag + "]. ";
    if (kind === "book") out += (city ? city + ": " : "") + (publisher || "") + (year ? ", " + year : "") + ".";
    else if (kind === "web") out += (journal || publisher ? journal || publisher + ", " : "") + (year ? year + ". " : "") + (url ? url + "." : "");
    else out += (journal || "") + (year ? ", " + year : "") + (volume ? ", " + volume : "") + (issue ? "(" + issue + ")" : "") + (pages ? ": " + pages + "." : ".");
    if (doi) out += " DOI: " + doi + ".";
    if (kind === "web" && accessed) out += " Accessed " + accessed + ".";
    return out;
  }
  if (style === "apa") {
    const names = auth.length === 0 ? "(n.d.)" : auth.map((a) => {
      const parts = a.trim().split(/\s+/);
      if (parts.length >= 2) return parts[parts.length - 1] + ", " + parts.slice(0, parts.length - 1).map((p) => p[0] + ".").join(" ");
      return a;
    });
    const joined = names.length > 1 ? names.slice(0, -1).join(", ") + ", & " + names[names.length - 1] : names[0];
    let out = joined + " (" + (year || "n.d.") + "). " + title + ". ";
    if (kind === "book") out += (city ? city + ": " : "") + (publisher || "");
    else if (kind === "web") out += (journal || publisher || "") + (url ? " Retrieved from " + url : "");
    else out += (journal || "") + (volume ? ", " + volume : "") + (issue ? "(" + issue + ")" : "") + (pages ? ", " + pages : "");
    return out.trimEnd() + ".";
  }
  // mla
  const names = auth.length === 0 ? "" : auth[0] + (auth.length > 1 ? ", et al." : "") + ".";
  let out = names + ' "' + title + '." ';
  if (kind === "book") out += (publisher || "") + ", " + (year || "") + ".";
  else if (kind === "web") out += (journal || publisher || "") + ", " + (year || "") + (url ? ", " + url : "") + ".";
  else out += (journal || "") + ", vol. " + (volume || "") + ", no. " + (issue || "") + ", " + (year || "") + ", pp. " + (pages || "") + ".";
  if (doi) out += " DOI: " + doi + ".";
  return out;
```

</details>

**依据 2 · 源码核查**：[lib/academic.js:182-202](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L182-L202)

去重/条目style覆盖。

<details>
<summary>查看原文（21行）</summary>

```text
export function buildReferenceList({ style = "gb7714", entries = [] } = {}) {
  const list = (Array.isArray(entries) ? entries : []).filter((e) => e && (e.title || (Array.isArray(e.authors) ? e.authors.length : 0) > 0));
  const seen = new Set();
  const unique = [];
  for (const e of list) {
    const key = String(e.title || "") + "|" + String(Array.isArray(e.authors) ? e.authors[0] : e.authors || "") + "|" + String(e.year || "");
    if (seen.has(key.toLowerCase())) continue;
    seen.add(key.toLowerCase());
    unique.push(e);
  }
  unique.sort((a, b) => {
    const fa = String(Array.isArray(a.authors) ? a.authors[0] : a.authors || "").toLowerCase();
    const fb = String(Array.isArray(b.authors) ? b.authors[0] : b.authors || "").toLowerCase();
    if (fa !== fb) return fa < fb ? -1 : 1;
    const ya = String(a.year || "");
    const yb = String(b.year || "");
    if (ya !== yb) return ya < yb ? -1 : 1;
    return String(a.title || "") < String(b.title || "") ? -1 : 1;
  });
  const lines = unique.map((e, i) => (i + 1) + ". " + formatCitation({ style, ...e }));
  return "References (" + style + "):\n\n" + lines.join("\n") + (lines.length === 0 ? "\n(no entries)" : "");
```

</details>

**依据 3 · 源码核查**：[lib/academic.js:205-253](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L205-L253)

TeX列/有限转义/原样片段。

<details>
<summary>查看原文（49行）</summary>

```text
function texEscape(s) {
  return String(s ?? "").replace(/([&%_#$])/g, "\\$1");
}

/** LaTeX table snippet (booktabs). */
export function latexTable({ columns = [], rows = [], caption = "", label = "" } = {}) {
  const cols = (Array.isArray(columns) ? columns : []).map((c) => String(c));
  const body = Array.isArray(rows) ? rows : [];
  const n = Math.max(cols.length, ...body.map((r) => (Array.isArray(r) ? r.length : 1)), 1);
  const lines = [
    "\\begin{table}[htbp]",
    "  \\centering",
    "  \\caption{" + texEscape(caption) + "}" + (label ? " \\label{" + texEscape(label) + "}" : ""),
    "  \\begin{tabular}{" + cols.map(() => "c").join("") + "}",
    "    \\toprule",
  ];
  if (cols.length > 0) lines.push("    " + cols.map(texEscape).join(" & ") + " \\\\");
  lines.push("    \\midrule");
  for (const r of body) {
    const cells = (Array.isArray(r) ? r : [r]).slice(0, n).map(texEscape);
    while (cells.length < n) cells.push("");
    lines.push("    " + cells.join(" & ") + " \\\\");
  }
  lines.push("    \\bottomrule", "  \\end{tabular}", "\\end{table}");
  return lines.join("\n");
}

/** LaTeX equation snippet (inline / display / align). */
export function latexEquation({ kind = "display", latex = "" } = {}) {
  const body = String(latex ?? "");
  if (kind === "inline") return "$" + body + "$";
  if (kind === "align") return "\\begin{align}\n" + body + "\n\\end{align}";
  return "\\begin{equation}\n" + body + "\n\\end{equation}";
}

/** LaTeX code listing snippet. */
export function latexCode({ language = "python", code = "" } = {}) {
  const body = String(code ?? "").replace(/\n+$/, "");
  return "\\begin{lstlisting}[language=" + String(language) + "]\n" + body + "\n\\end{lstlisting}";
}

/** LaTeX thebibliography snippet from citation entries. */
export function latexBibliography({ entries = [] } = {}) {
  const items = (Array.isArray(entries) ? entries : []).map((e, i) => {
    const key = "ref" + (i + 1);
    return "\\bibitem{" + key + "} " + formatCitation({ style: "gb7714", ...e });
  });
  if (items.length === 0) return "% (no bibliography entries)";
  return "\\begin{thebibliography}{99}\n" + items.join("\n") + "\n\\end{thebibliography}";
```

</details>

#### 缺口

- 引用各类型与目标期刊/标准的完整一致性及特殊LaTeX输入编译结果未核。
  **影响**：仅当格式初稿，不能保证可投/可编译。
  **进一步探讨**：离线使用权威样例矩阵逐字段对照、静态核列宽和转义；必要时由读者在安全TeX配置下核无秘密最小文档。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和长期使用成本效果如何？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| DSH tools/systemPrompt与value-schema DSL | 注册/指导段 | 0.1系peer/作者schema修复记录不等全代际兼容 |
| Cordis/Schemastery | 配置和bundle | package还声明dsh-fs但本实现无文件API |
| 真实研究与题录字段 | 模板/引用输入 | 不自动核事实/来源/标准 |
| 外部期刊/TeX/文献管理流程 | 最终格式交付 | 输出片段不是已验证文档 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 核宿主DSL/peer与工具注册 | 不运行投稿/真实修改 |
| 准备材料 | 明确文章类型/真实结果/题录 | 空模板不补造研究 |
| 生成初稿 | 只将工具当模板与机械提示 | 核引用姓名/类型/DOI、LaTeX列 |
| 人工审阅 | 对照原始证据/期刊规范 | passed/勾选均不作验收 |
| 维护 | 修模板/regex/格式样例 | 不把路线图当现有能力 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地工具包，无新增检索/模型API | 核DSL、模板与目标期刊 | 金额与配置时间未知 |
| 持续使用 | 字符串/regex CPU，schema/原稿/结果进入模型上下文 | 审提示与核题录/格式 | 无独立LLM调用不等总token费用0，长稿耗时未知 |
| 失败恢复 | 重新格式化/改TeX/再次模型上下文 | 修错误计数/引用/结构与手工复核 | 不写文件故无自动文件回滚，编辑恢复时间未知 |

#### 效果

| 目标 | 源码增量 | 限制 |
| --- | --- | --- |
| 统一写作骨架 | 四模板/摘要/标题 | 非内容论证 |
| 机械提示 | regex/标题/术语 | 计数与语言覆盖有缺口 |
| 引用/TeX初稿 | 纯字段格式输出 | 有类型/列宽/转义缺陷，非认证 |
| 投稿准备 | 五项清单 | 只复述输入布尔，不核证据 |

没有与成熟文献管理器/手工模板的总纠错时间、正确率对照，不能因为确定函数就称结果正确。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:47-53](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/package.json#L47-L53)

宿主peer。

```text
    "@deepseek-ai/dsh-fs": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "repository": {
    "type": "git",
```

**依据 2 · 源码核查**：[lib/index.js:12-28](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js#L12-L28)

真实仅配置/tools/纯逻辑import。

<details>
<summary>查看原文（17行）</summary>

```text
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import {
  academicCheck,
  analyzeStructure,
  buildGlossary,
  buildAbstract,
  buildOutline,
  formatCitation,
  buildReferenceList,
  latexBibliography,
  latexCode,
  latexEquation,
  latexTable,
  submissionChecklist,
  suggestTitles,
} from "./academic.js";
```

</details>

**依据 3 · 源码核查**：[lib/index.js:195-200](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js#L195-L200)

可选指导段。

```text
  if (config.personaSection) {
    ctx.effect(() => ctx.systemPrompt.section({
      name: "academic-writing:instructions",
      order: config.sectionOrder,
      text: SECTION_TEXT,
    }), "academic-writing.section()");
```

**依据 4 · 源码核查**：[lib/academic.js:149-177](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L149-L177)

机械/清单边界。

<details>
<summary>查看原文（29行）</summary>

```text
/** Deterministic academic-phrasing QA on a passage. */
export function academicCheck(text = "") {
  const issues = [];
  const passiveCount = (text.match(PASSIVE) || []).length;
  const firstPersonCount = (text.match(FIRST_PERSON) || []).length;
  const hedgingCount = (text.match(HEDGING) || []).length;
  const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim().length > 0).length;
  if (passiveCount > 0) issues.push(passiveCount + " passive-voice construction(s) found — consider whether the agent voice is intended.");
  if (firstPersonCount > 0) issues.push(firstPersonCount + " first/second-person pronoun(s) found — most academic registers avoid them (check the target venue).");
  if (hedgingCount > 0) issues.push(hedgingCount + " hedging word(s) found — fine for cautious claims; avoid over-hedging.");
  if (sentences > 0 && text.length / sentences > 160) issues.push("Average sentence length exceeds ~160 characters — consider splitting long sentences.");
  if (!/[.!?。！？]$/.test(text.trim())) issues.push("The passage does not end with sentence-final punctuation.");
  return { issues, passiveCount, firstPersonCount, hedgingCount, sentences, passed: issues.length === 0 };
}

/** Pre-submission checklist with completed items marked. */
export function submissionChecklist({ ethics = false, conflict = false, data = false, funding = false, formatting = false } = {}) {
  const items = [
    ["Ethics approval / consent statement is included", ethics],
    ["Conflict-of-interest declaration is present", conflict],
    ["Data availability statement covers reproducibility", data],
    ["Funding sources are acknowledged", funding],
    ["Formatting (template, references, figures) matches the venue guide", formatting],
  ];
  const lines = ["Pre-submission checklist:", ""];
  for (const [label, done] of items) {
    lines.push("- [" + (done ? "x" : " ") + "] " + label);
  }
  lines.push("", "Unchecked items must be resolved before submission.");
```

</details>

#### 缺口

- 同文章与文献管理器/人工模板的总纠错时间、上下文成本和格式错误率未对照。
  **影响**：不量化省时或提高投稿通过率。
  **进一步探讨**：固定无秘密稿件/题录样例，记录输出错误、人工修正和总上下文，不用真实投稿验收。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 是否推荐，继续探讨从何入手？

**研究主题**：采用判断、新假设与验证

#### 完整回答

观察。骨架与小型确定工具可作为演示/草稿辅具，但regex计数、无作者引用、LaTeX列规格等基础输出缺陷影响可信交付。先修这些明确分支并补规范样例；不推荐将check passed/清单全勾/格式器名称用于学术质量或正式投稿判断。

由“机械确定≠语义正确”推导“带规则范围/位置和未知项的检查收据”。按规则返回匹配位置与真正次数、语言/文本范围和不能回答的事项，格式器按样例版本/字段缺失先拒绝或标草稿；引用按DOI/规范键区分版本，TeX先核列宽/上下文转义。相较当前一段issues/passed，读者能重定位并判断是否适用。

未实现。反例是合理hedging/第一人称被过度改写，或者规范允许多种格式但工具硬拒绝；新方案不能以消灭所有提示为目标。最小对照含重复匹配/中文/H4/代码、无作者/机构名/同题不同版本、条目style覆盖、空columns/超宽row/特殊TeX。若计数仍不是位置数、格式缺失仍被当合规，或人工纠错不降反增，方案核心被反证；测总时间/误报/缺陷而非仅测试通过数。

#### 证据与依据

**依据 1 · 源码核查**：[lib/academic.js:149-161](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L149-L161)

位置/次数收据基线。

<details>
<summary>查看原文（13行）</summary>

```text
/** Deterministic academic-phrasing QA on a passage. */
export function academicCheck(text = "") {
  const issues = [];
  const passiveCount = (text.match(PASSIVE) || []).length;
  const firstPersonCount = (text.match(FIRST_PERSON) || []).length;
  const hedgingCount = (text.match(HEDGING) || []).length;
  const sentences = text.split(/[.!?。！？]+/).filter((s) => s.trim().length > 0).length;
  if (passiveCount > 0) issues.push(passiveCount + " passive-voice construction(s) found — consider whether the agent voice is intended.");
  if (firstPersonCount > 0) issues.push(firstPersonCount + " first/second-person pronoun(s) found — most academic registers avoid them (check the target venue).");
  if (hedgingCount > 0) issues.push(hedgingCount + " hedging word(s) found — fine for cautious claims; avoid over-hedging.");
  if (sentences > 0 && text.length / sentences > 160) issues.push("Average sentence length exceeds ~160 characters — consider splitting long sentences.");
  if (!/[.!?。！？]$/.test(text.trim())) issues.push("The passage does not end with sentence-final punctuation.");
  return { issues, passiveCount, firstPersonCount, hedgingCount, sentences, passed: issues.length === 0 };
```

</details>

**依据 2 · 源码核查**：[lib/academic.js:126-137](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L126-L137)

字段缺失基线。

<details>
<summary>查看原文（12行）</summary>

```text
  if (style === "apa") {
    const names = auth.length === 0 ? "(n.d.)" : auth.map((a) => {
      const parts = a.trim().split(/\s+/);
      if (parts.length >= 2) return parts[parts.length - 1] + ", " + parts.slice(0, parts.length - 1).map((p) => p[0] + ".").join(" ");
      return a;
    });
    const joined = names.length > 1 ? names.slice(0, -1).join(", ") + ", & " + names[names.length - 1] : names[0];
    let out = joined + " (" + (year || "n.d.") + "). " + title + ". ";
    if (kind === "book") out += (city ? city + ": " : "") + (publisher || "");
    else if (kind === "web") out += (journal || publisher || "") + (url ? " Retrieved from " + url : "");
    else out += (journal || "") + (volume ? ", " + volume : "") + (issue ? "(" + issue + ")" : "") + (pages ? ", " + pages : "");
    return out.trimEnd() + ".";
```

</details>

**依据 3 · 源码核查**：[lib/academic.js:182-228](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js#L182-L228)

引用键/列宽基线。

<details>
<summary>查看原文（47行）</summary>

```text
export function buildReferenceList({ style = "gb7714", entries = [] } = {}) {
  const list = (Array.isArray(entries) ? entries : []).filter((e) => e && (e.title || (Array.isArray(e.authors) ? e.authors.length : 0) > 0));
  const seen = new Set();
  const unique = [];
  for (const e of list) {
    const key = String(e.title || "") + "|" + String(Array.isArray(e.authors) ? e.authors[0] : e.authors || "") + "|" + String(e.year || "");
    if (seen.has(key.toLowerCase())) continue;
    seen.add(key.toLowerCase());
    unique.push(e);
  }
  unique.sort((a, b) => {
    const fa = String(Array.isArray(a.authors) ? a.authors[0] : a.authors || "").toLowerCase();
    const fb = String(Array.isArray(b.authors) ? b.authors[0] : b.authors || "").toLowerCase();
    if (fa !== fb) return fa < fb ? -1 : 1;
    const ya = String(a.year || "");
    const yb = String(b.year || "");
    if (ya !== yb) return ya < yb ? -1 : 1;
    return String(a.title || "") < String(b.title || "") ? -1 : 1;
  });
  const lines = unique.map((e, i) => (i + 1) + ". " + formatCitation({ style, ...e }));
  return "References (" + style + "):\n\n" + lines.join("\n") + (lines.length === 0 ? "\n(no entries)" : "");
}

function texEscape(s) {
  return String(s ?? "").replace(/([&%_#$])/g, "\\$1");
}

/** LaTeX table snippet (booktabs). */
export function latexTable({ columns = [], rows = [], caption = "", label = "" } = {}) {
  const cols = (Array.isArray(columns) ? columns : []).map((c) => String(c));
  const body = Array.isArray(rows) ? rows : [];
  const n = Math.max(cols.length, ...body.map((r) => (Array.isArray(r) ? r.length : 1)), 1);
  const lines = [
    "\\begin{table}[htbp]",
    "  \\centering",
    "  \\caption{" + texEscape(caption) + "}" + (label ? " \\label{" + texEscape(label) + "}" : ""),
    "  \\begin{tabular}{" + cols.map(() => "c").join("") + "}",
    "    \\toprule",
  ];
  if (cols.length > 0) lines.push("    " + cols.map(texEscape).join(" & ") + " \\\\");
  lines.push("    \\midrule");
  for (const r of body) {
    const cells = (Array.isArray(r) ? r : [r]).slice(0, n).map(texEscape);
    while (cells.length < n) cells.push("");
    lines.push("    " + cells.join(" & ") + " \\\\");
  }
  lines.push("    \\bottomrule", "  \\end{tabular}", "\\end{table}");
```

</details>

#### 缺口

- 规则范围收据/规范样例与格式前置校验方案未实现。
  **影响**：不计现有准确或创新优势。
  **进一步探讨**：用人工已知样例核位置/字段/列数并比较纠错负担，不以工具自评作真值。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
