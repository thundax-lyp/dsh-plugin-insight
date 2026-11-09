# Answer me with HTML

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[053619b](https://github.com/QingYunA/answer-me-with-html/tree/053619b917c6bf2e17eae5496d05eb08e10fe889)

<!-- BEGIN META -->
[![GitHub ★ 6,062](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C062&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)
<!-- END META -->

> **功能**：将 Agent 的短 Markdown 草稿与图关系渲染为单页 HTML，DSH bundle 安装文件系统 Skill。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把坐标与页面框架交给可复用 CLI，量化收益仍只有作者样本。

> **主要限制**：[Q03](#research-q03) 解析与 CSP 各约束局部行为，事实正确性、文件嵌入和交付后的暴露仍需分别验收。

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
  - [Q01 · 哪类解释值得做成 HTML，原办法和收益证据是什么？](#detail-section-11)
  - [Q02 · 从 DSH 加载到解释页面，真实入口与渲染如何接线？](#detail-section-12)
  - [Q03 · 文风与网页安全检查覆盖什么？](#detail-section-13)
  - [Q04 · 试用依赖、文件与退出成本怎样核对？](#detail-section-14)
  - [Q05 · 给关键图关系单独核对是否有收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 架构与因果解释可按面板阅读，原办法是 Markdown 或直接生成 HTML。

[Q01](#research-q01) 比较纯 Markdown 和直接生成 HTML。作者 Claude Code 三话题各三次，DSH 对照应控制模型、预期事实、核验标准，并另计实际账单。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| DSH Skill | 提供草稿及调用流程 | 由 bundle 单独挂载 |
| Markdown 与 flow | 输出解释页和关系图 | 事实与边由草稿作者提供 |
| 检查与替换 | 定位错误和更新文件 | 警告级别与写入范围不同 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20+ | 是 | 执行包内 CLI | 先核对 Node 运行时 |
| DSH profile 与文件系统 provider | 仅 DSH 路径 | 注册并读取已装 Skill | 该 profile 无此入口，CLI 可独立使用 |
| 输出目录写权限 | 是 | 保存 HTML 与可修订草稿 | 默认目录可尝试私有临时目录，或明确指定获准位置 |
| 可用的浏览器 | 读者验收需要 | 确认页面、图和链接 | 交付文字或另行查看 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者核对 Node 和 profile | DSH 可找到专用 Skill |
| 生成 | Agent 写面板草稿并调用 render | 解析或组件错误按行修改 |
| 验收 | 读者打开 HTML 并对照关系与文件范围 | 检查输出位置和内容，失败时保留旧页或恢复文字 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node 与 DSH profile 环境，实际支出未知 | 检查安装、权限及首次浏览器打开 | 有 Node 20+ 约束，宿主兼容未实测 |
| 持续使用 | 每题模型输入与输出 token、本地文件占用，DSH 账单未知 | 写草稿、核对图与内容，计合格交付分钟 | 作者仅报告 Claude Code 小样本 |
| 失败恢复 | 重渲染及重复保留文件，增量未知 | 定位警告、检查实际路径、确认旧页及复核 | 默认目录可退到临时位置，外部输出就地写入 |
| 退出 | 已生成页面和草稿的留存空间未知 | 移除一直生成页面规则，盘点和处理产物 | 页面内带源稿，dry-run 可预览清理范围 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 生产解释页 | 源码把布局与页面框架交给 CLI | 同条件的首次合格与交付时间 |
| 输出 token 与等待 | 作者 Claude Code 三话题各三次对照 | DSH 端总 token、真实账单与重试负担 |
| 读者复核 | 按面板和关系图组织材料 | 错误边发现率、定位时长及可分享性 |

> **思考**：[Q03](#research-q03) 解析与 CSP 各约束局部行为，事实正确性、文件嵌入和交付后的暴露仍需分别验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把坐标与页面框架交给可复用 CLI，量化收益仍只有作者样本。

[Q02](#research-q02) 先校验后写入。[Q03](#research-q03) 区分正文过滤、显式围栏和 CSP。[Q04](#research-q04) 新页写入成功后才处理旧页。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 解析与 CSP 各约束局部行为，事实正确性、文件嵌入和交付后的暴露仍需分别验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用非敏感项目对比原流程，按合格交付计事实差错、用时、输入及输出 token。若中断，核对旧页及临时输出，恢复文字并盘点现有页面和草稿。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

DSH bundle、页面生成、错误拒绝与网页约束有固定源码依据。作者对照、宿主兼容、语义正确性与增量实验未复现。

- 已检查：作者 README、包清单、源码路径 README.md、skills/answer-me-with-html/SKILL.md、package.json、index.js、cordis.patch.yml、src/cli.js、src/render.js、src/components/flow.js、src/markdown.js、src/csp.js、src/code.js、src/images.js、src/update.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：研究根组件的 DSH 注册、解释草稿、渲染和输出。未审全部组件、服务器、导出及视频功能，未执行目标、安装包或打开页面。
- 下一步：用相同模型和问题比较 Markdown、直接 HTML、现有 DSL 与 [Q05](#research-q05) 假设，统计首次合格、关系定位和总成本。

**分析版本**

- **仓库**：[QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- **版本号**：0.5.11（[固定提交 053619b](https://github.com/QingYunA/answer-me-with-html/tree/053619b917c6bf2e17eae5496d05eb08e10fe889)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在重要边旁显示证据位置和人工核对状态，可能降低方向误写及审阅定位时间。以当前分离的图和代码块作对照。

用相同模型和问题比较 Markdown、直接 HTML、现有 DSL 与 [Q05](#research-q05) 假设，统计首次合格、关系定位和总成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 79 | 4022 | — | — | 60682 |
| .mjs | source | 15 | 15424 | 14654 | 586 | — |
| .js | source | 124 | 17290 | 14343 | 1899 | — |
| .md | example | 6 | 341 | — | — | 2286 |
| .js | test | 88 | 20599 | 17913 | 960 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 76](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=76&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 74](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=74&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让 Agent 用短草稿交付一页解释时，CLI 自动布局、检查和内容边界分别可验证到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类解释值得做成 HTML，原办法和收益证据是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

交接复杂方案、比较分支或解释因果链时，读者可按面板和箭头逐项核对。直接写 Markdown 便于随处阅读，直接写 HTML 排版自由但模型还要输出页面代码。本工具移出页面框架和布局，模型仍写草稿、节点和边。作者在 Claude Code 用 Claude Sonnet 5.5 比较三话题各三次，文中报告 4,893 对 612 个生成 token，用时对照为 31 对 12 秒的中位数，账单下降约 15% 也是作者样本口径。报告未据此核定合格率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-63](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/README.md#L47-L63)

手写 HTML 对照及作者 token、时间统计。

<details>
<summary>查看原文（17行）</summary>

```text
## Why not just ask for HTML?

You can. Models write decent HTML now. But most of what they write is not content. We counted the tokens in 9 pages the model wrote by hand, 4,893 tokens on average:

| Part of the page | Share | With this skill |
| :--- | ---: | :--- |
| SVG diagrams: coordinates and paths | 47% | The CLI writes it |
| CSS | 15% | The CLI writes it |
| HTML tags | 17% | The CLI writes it |
| Text | 21% | The model writes it, as Markdown |

With this skill the model writes only a Markdown draft. For the same questions that was 612 tokens on average, **about 1/8 of the hand-written HTML**. Less to write means less to wait for (3 topics × 3 runs, medians, Claude Sonnet 5.5, a plain Claude Code setup):

| | Ask for HTML directly | Answer me with HTML | |
| :--- | ---: | ---: | :--- |
| Tokens the model writes | 4,893 | **612** | **8× fewer** |
| Time | 31 s | **12 s** | **2.6× faster** |
```

</details>

**依据 2 · 作者声明**：[README.md:69-71](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/README.md#L69-L71)

区分作者账单估计和输出 token。

```text
<p align="center"><sub>The same question, the same model, answered both ways. Both pages are usable.</sub></p>

The token counts are saved in [bench/corpus/tokens.json](bench/corpus/tokens.json), so `node bench/corpus.mjs` gives the same numbers every time. The pages themselves are a [download](https://github.com/QingYunA/answer-me-with-html/releases/download/v0.4.14/bench-corpus-2026-10-07.zip). The bill drops less than the writing, about 15% here, because every turn also reads the system prompt, your question and the conversation, with or without the skill. See [where the cost goes](bench/README.md#where-the-cost-goes).
```

**依据 3 · 作者声明**：[skills/answer-me-with-html/SKILL.md:73-76](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/skills/answer-me-with-html/SKILL.md#L73-L76)

作者描述按问题组织面板的正常步骤。

```text
1. First list 3–8 panels in your head. Each panel answers one sub-question only.
   The draft language follows the language of the user's question: an English question gets an English draft, a Chinese question a Chinese draft, a Japanese question a Japanese draft. The page button labels, `<html lang>` and the STE check rules switch automatically by the draft language (a draft containing kana counts as Japanese); STE applies the English or Chinese rules to each sentence by its language (Japanese sentences get only the sentence-length and paragraph-length checks, with the same character limits as Chinese; any other language gets only those two checks, counted in words). To set the language yourself, write `lang:` in the frontmatter: `en`, `zh` (Simplified Chinese), `zh-Hant` or `zh-TW` (Traditional Chinese), `ja`, or any other language tag such as `fr` or `ko`. Detection reads Chinese (Simplified, or Traditional when the text has characters written in only one form), Japanese, Korean, and Cyrillic, Arabic, Hebrew, Thai and Greek text, and reads all Latin-script text as English. Declare the language when the user writes a Latin-script language other than English, when a Chinese text is too short or too plain to show Traditional characters, or when an exact tag matters (Arabic script also writes Persian, Cyrillic also Ukrainian). A language without its own labels still gets the right `<html lang>`, with English page labels.
2. Choose components by the shape of the information (see section 4).
3. Render in one go with a heredoc:
```

#### 缺口

- 作者小样本未复测，缺独立质量标注和 DSH 对照。
  **影响**：不能从生成 token 或作者时间推出相同质量下的收益。
  **进一步探讨**：控制同一模型、问题和核验规则，分别记录合格交付时间、首次合格数、输入与输出 token、实际账单和核对人时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 DSH 加载到解释页面，真实入口与渲染如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根 manifest 声明 bundle。补丁插入专用文件系统 Skill provider，从宿主 profile 解析包路径，includeDefaultRoots 只约束该 provider。根 index 为空导出。Skill 文档调用内置 am 脚本，另有 npm bin。CLI 先调用 renderDoc，后计算输出路径并写入。解析与组件错误在构造页面前抛出。flow 解析作者关系，传给 Dagre 计算坐标。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-29](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/package.json#L22-L29)

DSH bundle 和 Node 引擎约束。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
    "node": ">=20"
  },
```

**依据 2 · 源码核查**：[index.js:1-4](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/index.js#L1-L4)

根入口是空导出。

```text
// Package entry for installers that require one: dsh-plugin-hub 1.6.6 and older block a git install
// whose package.json entry (index.js by default) is missing. DSH itself loads this package only through
// dsh.bundle.patch (cordis.patch.yml), and the CLI is bin/am.js. Importing this module does nothing.
export {};
```

**依据 3 · 源码核查**：[cordis.patch.yml:13-19](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/cordis.patch.yml#L13-L19)

插入 provider，profile 解析安装包。

```text
- insert:
    - id: answer-me-with-html-skill
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: answer-me-with-html
        includeDefaultRoots: false
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('answer-me-with-html/package.json')), 'skills')
```

**依据 4 · 作者声明**：[skills/answer-me-with-html/SKILL.md:59-65](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/skills/answer-me-with-html/SKILL.md#L59-L65)

Skill 的单文件 CLI 调用入口。

````text
## 2. Workflow (one Bash call)

The CLI is bundled in this skill's directory: `scripts/am.mjs`, a single file with no dependencies to install; it needs only Node.js 20+. If `node` is not found or is older than v20, tell the user, show them the exact command to install the Node.js LTS (macOS `brew install node`, Windows `winget install OpenJS.NodeJS.LTS`, otherwise nvm, which adds lines to the shell profile), and run it only after they agree, then check `node --version` again. If they say no or it still fails, stop and tell them. Below, `am` always means:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/am.mjs"
```
````

**依据 5 · 源码核查**：[src/cli.js:343-355](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L343-L355)

CLI 先渲染再写文件。

<details>
<summary>查看原文（13行）</summary>

```text
  const config = loadConfig(ctx);
  const { theme, mode, style } = config.values;
  await loadMath(src);
  let result;
  try {
    result = renderDoc(src, { theme: opts.theme, template: opts.template, style: opts.style, mode: opts.mode }, { theme, mode, style }, { themes: ctx.themes, baseDir, codeDir: ctx.io.cwd ?? process.cwd(), update: updateFor(config, ctx), closeAfter: config.values.close_after_reply, colophon: config.values.colophon, scale: config.values.scale });
  } catch (e) {
    return reportDraftError(e, src, from, ctx);
  }
  const file = outputPath('pages', nameSource(result.meta), opts, ctx);
  if (!file) return 2;
  const written = emit(result, file, ctx, { fallback: opts.out ? undefined : 'pages' });
  if (!written) return 1;
```

</details>

**依据 6 · 源码核查**：[src/render.js:66-81](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L66-L81)

渲染汇总错误后构造页面。

<details>
<summary>查看原文（16行）</summary>

```text
  const stats = { panels: doc.panels.length, components: {}, code: [], codeWarnings: [], componentWarnings: [], htmlWarnings: [], mathWarnings: [] };
  const ui = language.ui;
  const ctx = { seq: 0, stats, errors, ui, dir: language.dir, scale, images: { baseDir, known: knownImages }, code: { baseDir: codeDir, known: knownCode } };
  // A panel-only component in the intro is an error of its own, and the block renders nothing.
  const loose = doc.intro.filter((b) => b.type === 'fence' && COMPONENTS.get(b.lang)?.panelOnly);
  for (const b of loose) {
    errors.push(new RenderError(`${b.lang} belongs in a panel: put it under the ## heading of the panel the answer changes`, { line: b.line, component: b.lang, example: COMPONENTS.get(b.lang).example }));
  }
  const introHtml = renderBlocks(doc.intro.filter((b) => !loose.includes(b)), ctx);
  const panels = doc.panels.map((p) => ({ ...p, html: renderBlocks(p.blocks, ctx) }));
  raiseAll(errors);
  const page = TEMPLATES[doc.meta.template]({ meta: doc.meta, introHtml, panels, ui, language });
  // A right-to-left page isolates each run of text with no right-to-left letter as left to right (src/bidi.js).
  const body = language.dir === 'rtl' ? isolateLtrRuns(page) : page;
  const html = shell({ meta: doc.meta, language, body, source, embedded: themes.embedFor(doc.meta.theme, 'page'), update, closeAfter, colophon, scale });
  return { html, warnings, stats, meta: doc.meta, language };
```

</details>

**依据 7 · 源码核查**：[src/components/flow.js:79-85](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/components/flow.js#L79-L85)

将关系交给 flow 渲染。

````text
  example: '```flow LR\n(User) -> Gateway: HTTPS\nGateway -> Auth & *Service\nService -> [(Database)]\ngroup Backend: Auth, Service\n```',
  render(text, { args, uid, ui, warn, video, dir: pageDir = 'ltr' }) {
    const model = parseFlow(text);
    model.warnings.forEach((w) => warn?.(w));
    const flowDir = (args.match(/\b(TB|LR|BT|RL)\b/i)?.[1] ?? 'TB').toUpperCase();
    const html = `<figure class="am-diagram am-flow">${layout(model, DIRS.has(flowDir) ? flowDir : 'TB', uid(), ui, pageDir, video ? undefined : warn)}</figure>`;
    return withDelta(html, [...model.nodes.values(), ...model.edges, ...model.groups].map((x) => x.state ?? null), { ui, video });
````

**依据 8 · 源码核查**：[src/components/flow.js:327-334](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/components/flow.js#L327-L334)

把模型的边写入 Dagre 图并调用布局。

```text
  const labels = edges.map((e) => (e.label ? edgeText(e.label) : null));
  edges.forEach((e, i) => {
    const size = labels[i];
    // Dagre reserves 2px more than the drawn label box, as it always did.
    const label = size ? { label: e.label, width: size.width + 2, height: size.height, labelpos: 'c' } : {};
    g.setEdge(key.get(e.from), key.get(e.to), label, `e${i}`);
  });
  dagre.layout(g, { customOrder: orderRanks });
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文风与网页安全检查覆盖什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

STE 可关闭，strict 会因 STE 警告拒绝渲染。Markdown 正文接 HTML token 过滤，显式 HTML 或 SVG 围栏则先原样返回并记录脚本提示，之后仍走通用图片嵌入。页面 shell 插入 CSP，允许指定脚本哈希，图片用 data URI，同源连接用于重载路径。HTML 或图形提示与 STE 的阻断规则分开。引用源代码会限制工作目录并筛查敏感模式，图片实现明确可读目录外路径，再以类型、大小与敏感目录规则约束。

#### 证据与依据

**依据 1 · 源码核查**：[src/render.js:59-64](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L59-L64)

strict 拒绝 STE 警告。

```text
  const language = resolveLanguage({ declared: doc.meta.lang, previous: previousLanguage, text: source });
  const warnings = doc.meta.style === 'off' ? [] : lintDoc(doc, language);
  if (doc.meta.style === 'strict' && warnings.length) {
    raiseAll(errors); // the draft errors come first: they have to be fixed anyway
    throw new LintError(warnings);
  }
```

**依据 2 · 源码核查**：[src/markdown.js:77-78](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/markdown.js#L77-L78)

Markdown 配置过滤 hook。

```text
marked.use({ hooks: { processAllTokens: (tokens) => filterBlocks(tableOptions(tokens), { lex: (source) => tableOptions(marked.lexer(source)), note }) } });
inline.use({ hooks: { processAllTokens: (tokens) => filterInline(tokens, note) } });
```

**依据 3 · 源码核查**：[src/render.js:104-110](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L104-L110)

围栏结果继续经过图片嵌入。

```text
function renderBlock(b, ctx) {
  const { result, notes } = collectHtmlNotes(() => (b.type === 'md' ? `<div class="am-md">${md(b.text, { ui: ctx.ui, interactive: !ctx.video })}</div>` : renderFence(b, ctx)), { math: !ctx.video });
  noteHtml(b, notes.filter((n) => !n.math), ctx);
  noteMath(b, notes.filter((n) => n.math), ctx);
  const out = embedImages(b, result, ctx);
  noteRemoteImages(b, out, ctx);
  return out;
```

**依据 4 · 源码核查**：[src/render.js:171-182](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L171-L182)

显式围栏返回原文并记录脚本提示。

<details>
<summary>查看原文（12行）</summary>

```text
function renderFence(block, ctx) {
  const { lang, args, text, line } = block;
  if (RAW_LANGS.has(lang)) {
    if (lang === 'html' || lang === 'svg') {
      // Comments and <textarea> are skipped; so is <style> in html, whose content is raw text (in svg its children are parsed).
      const style = lang === 'html' ? '|<style\\b[^>]*>[\\s\\S]*?(?:<\\/style\\s*>|$)' : '';
      for (const match of text.matchAll(new RegExp(`<!--[\\s\\S]*?(?:-->|$)|<textarea\\b[^>]*>[\\s\\S]*?(?:<\\/textarea\\s*>|$)${style}|<script\\b`, 'gi'))) {
        if (match[0].toLowerCase() !== '<script') continue;
        ctx.stats.htmlWarnings?.push({ line: line + 1 + text.slice(0, match.index).split('\n').length - 1, message: 'this script will not run: the page allows only am\'s own scripts' });
      }
    }
    return text;
```

</details>

**依据 5 · 源码核查**：[src/render.js:323-333](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L323-L333)

页面 shell 真实嵌入 CSP。

<details>
<summary>查看原文（11行）</summary>

```text
  // The one inline script, as the browser reads it: the policy pins a hash of exactly this text.
  const interactiveTable = body.includes('<table data-am-table=');
  const script = `\n${RUNTIME_JS}${interactiveTable ? TABLE_JS : ''}${hasDelta(body) ? DELTA_JS : ''}${update ? UPDATE_JS : ''}${closeAfter ? CLOSE_AFTER_JS : ''}`;
  return `<!doctype html>
${rootTag(root)}
<head>
<meta charset="utf-8">
${cspMeta([script], { live: true })}
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="generator" content="Answer me with HTML ${VERSION}">
<title>${esc(meta.title || 'Answer me with HTML')}</title>
```

</details>

**依据 6 · 源码核查**：[src/csp.js:21-35](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/csp.js#L21-L35)

规定脚本哈希、图片和资源策略。

<details>
<summary>查看原文（15行）</summary>

```text
// `scripts`: the exact text of each executable inline <script> in the page. connect-src 'self' is for the live-reload EventSource.
export function cspMeta(scripts, { live = false } = {}) {
  const hashes = [...scripts, ...(live ? [LIVE_SCRIPT_BODY] : [])].map(scriptHash);
  const policy = [
    "default-src 'none'",
    `script-src ${hashes.join(' ')}`,
    "style-src 'unsafe-inline'",
    'img-src data:',
    'font-src data:',
    'media-src data:',
    "connect-src 'self'",
    "form-action 'none'",
    "base-uri 'none'",
  ].join('; ');
  return `<meta http-equiv="Content-Security-Policy" content="${policy}">`;
```

</details>

**依据 7 · 源码核查**：[src/cli.js:908-914](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L908-L914)

HTML 警告另有报告。

```text
// Raw HTML the render changed (a placeholder shown as text, a tag or attribute removed). Not STE warnings: they never fail style: strict.
function printHtmlWarnings(notes = [], print) {
  const lines = [...new Set([...notes].sort((a, b) => a.line - b.line).map((w) => `L${w.line} [html] ${w.message}`))];
  if (!lines.length) return;
  print(`  html ${count(lines.length, 'warning')} (the page differs from the draft here; fix the draft if that is not what you meant):`);
  lines.slice(0, MAX_LISTED_WARNINGS).forEach((l) => print(`  ${l}`));
  if (lines.length > MAX_LISTED_WARNINGS) print(`  … ${lines.length - MAX_LISTED_WARNINGS} more`);
```

**依据 8 · 源码核查**：[src/code.js:89-103](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/code.js#L89-L103)

代码文件边界和真实路径检查。

<details>
<summary>查看原文（15行）</summary>

```text
// The lines the block quotes, from the file. null when the file does not exist or is outside baseDir.
// A link is followed first, so the checks run on the file that is read and not on the name the draft gives it.
function readSlice(ref, range, baseDir) {
  const written = localPath(ref, baseDir);
  if (!written) return null;
  assertNotSecret(ref, relative(baseDir, written), false);
  let path;
  try {
    path = realpathSync(written);
    const root = realpathSync(baseDir);
    if (!localPath(path, root)) throw new CodeError(`Code file "${ref}" is a link to a file outside the current folder ${baseDir}; only files inside it are quoted`);
    assertNotSecret(ref, relative(root, path), true);
  } catch (err) {
    if (err instanceof CodeError) throw err;
    return null;
```

</details>

**依据 9 · 源码核查**：[src/code.js:114-117](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/code.js#L114-L117)

代码文件做内容模式检查。

```text
  if (size > MAX_FILE_BYTES) throw new CodeError(`"${ref}" is ${(size / 1048576).toFixed(1)} MB; code files up to ${MAX_FILE_BYTES / 1048576} MB are read`);
  const buf = readFileSync(path);
  if (buf.includes(0)) throw new CodeError(`"${ref}" is a binary file, not code`);
  if (SECRET_TEXT.test(buf.toString('utf8'))) throw new CodeError(`"${ref}" looks like it holds a key or a token somewhere in the file; no part of it is embedded. Write a sketch instead`);
```

**依据 10 · 源码核查**：[src/images.js:68-96](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/images.js#L68-L96)

允许根外图片并验证文件类型、尺寸等。

<details>
<summary>查看原文（29行）</summary>

```text
// True when a folder on the path holds keys or logins (.ssh, .aws, ...); nothing inside it is embedded.
const inSecretDir = (path) => path.split(sep).some((part) => SECRET_DIR.has(part));

// The data URI of the file, or null when the file does not exist.
// Absolute paths outside the project are fine (screenshots live anywhere); what is checked is the real file behind the path.
function readImage(ref, baseDir) {
  const path = localPath(ref, baseDir);
  const ext = extname(path).toLowerCase();
  const type = TYPES[ext];
  if (!type) throw new ImageError(`"${ref}" is not an image file; use ${Object.keys(TYPES).join(' ')}`, ref);
  let real;
  let stat;
  try {
    real = realpathSync(path);
    stat = statSync(real);
  } catch {
    return null;
  }
  if (inSecretDir(path) || inSecretDir(real)) {
    throw new ImageError(`"${ref}" is in a folder that holds keys or logins (${[...SECRET_DIR].join(' ')}); it is not embedded. Copy the image somewhere else first`, ref);
  }
  if (!stat.isFile()) throw new ImageError(`"${ref}" is not a file`, ref);
  const size = stat.size;
  if (size > MAX_IMAGE_BYTES) {
    throw new ImageError(`"${ref}" is ${(size / 1048576).toFixed(1)} MB; the limit is ${MAX_IMAGE_BYTES / 1048576} MB. Shrink or crop the image first`, ref);
  }
  const buf = readFileSync(real);
  if (!MAGIC[type](buf)) throw new ImageError(`"${ref}" is named ${ext} but its content is not ${type === 'image/svg+xml' ? 'SVG' : type.slice(6).toUpperCase()} data; it is not embedded`, ref);
  if (type === 'image/svg+xml' && SECRET_TEXT.test(buf.toString('utf8'))) {
```

</details>

#### 缺口

- 排版正确、CSP 限制及可解析箭头均无法核对事实。浏览器执行行为、输出被复制或分享后的内容保密性和不可信文稿的覆盖均未实测。
  **影响**：语义与数据暴露无法据静态检查推断。
  **进一步探讨**：用可解析错误边、远程资源和样本路径做对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 试用依赖、文件与退出成本怎样核对？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

源码要求 Node 20+，Skill 说明内含独立脚本。首次试用记录安装与权限核对人时、Node 及 profile 变更。持续记录每题输入与输出 token、渲染和人工核对分钟、页面及草稿占用字节，工具保留可修订草稿。render 失败发生在写入前，旧页仍可用。默认目录权限失败可退到经检查的私有临时目录，目录可能被系统清理；旧页清理权限不足会提示留下，外部 -o 是就地写入，覆盖前需另存。退出可先移除一直生成页面的规则并恢复文字交付，清理前可用 dry-run 盘点受影响页面、视频和草稿；页面内仍带草稿，须按分享和留存要求处理。后台版本查询可关闭，更新另行发起。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:22-29](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/package.json#L22-L29)

manifest 声明 Node 版本和 bundle。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
    "node": ">=20"
  },
```

**依据 2 · 作者声明**：[skills/answer-me-with-html/SKILL.md:59-71](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/skills/answer-me-with-html/SKILL.md#L59-L71)

独立脚本、输出目录和 fallback 的作者说明。

<details>
<summary>查看原文（13行）</summary>

````text
## 2. Workflow (one Bash call)

The CLI is bundled in this skill's directory: `scripts/am.mjs`, a single file with no dependencies to install; it needs only Node.js 20+. If `node` is not found or is older than v20, tell the user, show them the exact command to install the Node.js LTS (macOS `brew install node`, Windows `winget install OpenJS.NodeJS.LTS`, otherwise nvm, which adds lines to the shell profile), and run it only after they agree, then check `node --version` again. If they say no or it still fails, stop and tell them. Below, `am` always means:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/am.mjs"
```

In Claude Code, `${CLAUDE_SKILL_DIR}` is replaced with this skill's directory before you read this file, so that command and every path in this file already carry it; run them as written.

On every other host the token is left as it stands or comes out empty. There, before your first command of the turn, write the absolute path of the directory that holds this `SKILL.md` in place of `${CLAUDE_SKILL_DIR}` in every command you run and in every path you read, in this file and in the files under `references/`, and check the path once with `test -f "<that directory>/scripts/am.mjs"`. Do not put the path in a shell variable and use it in a later call: the Bash tool keeps no variable from one call to the next and a file-read tool never expands one, so a `SKILL_DIR` set in one call is empty in the next and the command becomes `/scripts/am.mjs`. The directory is the one holding `SKILL.md` and `scripts/`: `~/.agents/skills/answer-me-with-html` after `npx skills add`, `~/.claude/skills/answer-me-with-html` for a Claude Code skill install, `skills/answer-me-with-html` in the plugin checkout for a plugin install, and the path printed on the host's "Base directory for this skill" line (DeepSeek Harness). If `test -f` fails, that path is not this skill's directory: find the right one before you run anything. If the user installed the `am` command globally, you can also use `am` directly.

Keep the default output; it needs no flag. If the session cannot write to `~/.answer-me-with-html/pages` (a sandbox that allows writes only in the workspace), the CLI saves the page in a private folder in the system temporary folder and says so on a `!` line; the system may clear that folder. Add `-o "<absolute-workspace-path>/.tmp/answers/topic.html"` to `render -` before the heredoc only when the user wants the page in the workspace or the render fails with `Cannot write the page`. `-o` names an HTML file, not a folder; the CLI creates missing parent directories. Use `AM_HOME` only when the whole data directory must move.
````

</details>

**依据 3 · 源码核查**：[src/cli.js:352-363](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L352-L363)

新页写入成功才处理旧路径，按警告决定自动打开。

<details>
<summary>查看原文（12行）</summary>

```text
  const file = outputPath('pages', nameSource(result.meta), opts, ctx);
  if (!file) return 2;
  const written = emit(result, file, ctx, { fallback: opts.out ? undefined : 'pages' });
  if (!written) return 1;
  if (opts.out && !extname(file)) print('! -o names a file without an extension; use .html for an HTML page');
  // Delete the earlier attempt only now: a render that fails above keeps it.
  if (replaced && replaced !== resolve(written)) removeEarlier(replaced, ctx);
  keepDraft(result, src, from, ctx);
  // A page with STE, code or math warnings is likely to be rendered again, so it opens only when --open asks for it.
  const held = !opts.open && hasRetryWarnings(result) && shouldOpen(opts, ctx.env, config.values);
  if (held) print(`  Not opened because of the warnings; to render again, add --replace ${written}`);
  return finish(written, held ? { ...opts, 'no-open': true } : opts, config, ctx);
```

</details>

**依据 4 · 源码核查**：[src/cli.js:811-825](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L811-L825)

pages 下临时写入再改名，其他路径就地写。

<details>
<summary>查看原文（15行）</summary>

```text
// Write a page. A page inside the data directory makes it private first; a page saved elsewhere (-o) leaves its folder alone.
// A page in pages/ is written to a temp file and renamed over the old one, so am serve (src/serve.js) never reloads a half-written
// page. Elsewhere it is written in place: a rename would replace a symlink with a plain file and drop the file's mode and hard links.
function writePage(file, html, env) {
  const home = resolve(amHome(env));
  const path = resolve(file);
  if (path.startsWith(home + sep)) ensureHome(home);
  mkdirSync(dirname(file), { recursive: true });
  if (!path.startsWith(join(home, 'pages') + sep)) return writeFileSync(file, html);
  const tmp = join(dirname(file), `.${basename(file)}.${process.pid}.tmp`);
  try {
    writeFileSync(tmp, html);
    renameOver(tmp, file);
  } finally {
    rmSync(tmp, { force: true });
```

</details>

**依据 5 · 作者声明**：[README.md:190-192](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/README.md#L190-L192)

作者说明更新和清理边界。

```text
## Updating and cleaning up

Updates are manual. When used, the CLI checks GitHub for a new version in the background at most once a day. If one is available, it prompts the agent at most once every three days; nothing about you is sent. To update, tell your agent "update answer-me-with-html". Pages pile up in `~/.answer-me-with-html/`. Say "clean up the pages", and the agent asks before it deletes anything. Other install methods and every option: [reference](docs/reference.md#updating-and-cleaning-up).
```

**依据 6 · 源码核查**：[src/update.js:78-79](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/update.js#L78-L79)

版本检查配置及环境开关。

```text
// update_check off, CI and AM_NO_UPDATE_CHECK each turn off both the background check and the update notice.
export const updateEnabled = (env, config) => !(config.update_check === false || env.CI || env.AM_NO_UPDATE_CHECK);
```

**依据 7 · 源码核查**：[src/update.js:96-108](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/update.js#L96-L108)

版本检查频率和进程异常分支。

<details>
<summary>查看原文（13行）</summary>

```text
export function shouldCheckUpdate(state, env, config, now = Date.now()) {
  if (!updateEnabled(env, config)) return false;
  return !state.lastUpdateCheck || now - state.lastUpdateCheck >= UPDATE.checkEveryDays * DAY;
}

export function spawnUpdateCheck(home, scriptPath) {
  writeState(home, { lastUpdateCheck: Date.now() });
  try {
    spawn(process.execPath, [scriptPath, '__update-check'], { detached: true, stdio: 'ignore', env: { ...process.env, AM_HOME: home } })
      .on('error', () => {})
      .unref();
  } catch {
    // A failed background check does not affect normal use.
```

</details>

**依据 8 · 源码核查**：[src/update.js:114-131](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/update.js#L114-L131)

实际 fetch、超时与失败。

<details>
<summary>查看原文（18行）</summary>

```text
export async function runUpdateCheck(home, fetchImpl = fetch) {
  try {
    const { version } = await fetchJson(fetchImpl, UPDATE.url);
    if (!parseVersion(version)) return null;
    const latest = version.trim();
    // The highlights are optional: a missing or malformed file leaves the version check as it was.
    const highlights = parseHighlights(await fetchJson(fetchImpl, UPDATE.highlightsUrl).catch(() => null), latest);
    writeState(home, { latestVersion: latest, latestHighlights: highlights, lastUpdateCheck: Date.now() });
    return latest;
  } catch {
    return null;
  }
}

async function fetchJson(fetchImpl, url) {
  const res = await fetchImpl(url, { signal: AbortSignal.timeout(UPDATE.timeoutMs) });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
```

</details>

**依据 9 · 源码核查**：[src/cli.js:422-435](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L422-L435)

警告时留存 stdin 草稿，修正后删除临时草稿，页面仍带源稿。

<details>
<summary>查看原文（14行）</summary>

```text
// After a render that wrote a page: a stdin draft with warnings is saved for the fix-and-render-again round; a draft file in drafts/
// that renders clean is deleted (the page keeps the source in #am-source).
function keepDraft(result, src, from, ctx) {
  const warned = hasWarnings(result);
  if (from?.stdin && warned) {
    const saved = saveDraft(src, ctx);
    if (saved) ctx.print(`  draft: ${saved}`);
  } else if (from?.file && !warned && isKeptDraft(from.file, ctx)) {
    try {
      rmSync(from.file, { force: true });
    } catch (e) {
      ctx.fail(`! Kept the draft ${from.file} (${e.code ?? e.message})`);
    }
  }
```

</details>

**依据 10 · 源码核查**：[src/cli.js:844-870](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L844-L870)

默认目录权限退让和旧页删除失败的提示。

<details>
<summary>查看原文（27行）</summary>

```text
  try {
    writePage(file, html, env);
    return { file };
  } catch (e) {
    if (!isDenied(e)) throw e;
    if (!(fallback && inHome)) return refuse(file, e), null;
    const spare = join(tempHome(), fallback, basename(file));
    try {
      checkedTempHome({ create: true });
      writePage(spare, html, env);
      return { file: spare, notice: `  ! ${home} is not writable (${e.code}): saved in the temporary folder, which the system may clear` };
    } catch (t) {
      if (t instanceof UnsafeTempHome) fail(`✗ Cannot write the page: ${home} is not writable (${e.code}) and ${t.dir} is not a private folder of this user. Give -o a file in a folder this session can write to`);
      else if (isDenied(t)) refuse(spare, t);
      else throw t;
      return null;
    }
  }
}

// The earlier page of --replace goes away once the new one is written. A folder that cannot be changed keeps it, with one line.
function removeEarlier(file, { fail }) {
  try {
    rmSync(file, { force: true });
  } catch (e) {
    if (!isDenied(e)) throw e;
    fail(`! Kept the earlier page ${file} (permission denied, ${e.code})`);
```

</details>

**依据 11 · 源码核查**：[src/cli.js:957-975](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/cli.js#L957-L975)

清理支持 dry-run，报告占用和删除范围。

<details>
<summary>查看原文（19行）</summary>

```text
function cmdClean(opts, { print, fail, env }) {
  if (opts.days !== undefined && !/^\d+$/.test(opts.days.trim())) {
    fail('✗ --days needs a non-negative integer');
    return 2;
  }
  const days = opts.days === undefined ? CLEAN.days : Number(opts.days);
  const home = amHome(env);
  const before = usage(home);
  // The temporary folder holds pages written while the data directory was not writable. Only a folder that exists and is private.
  const temp = existingTempHome();
  const tempBefore = temp && usage(temp);
  const dry = Boolean(opts['dry-run']);
  const r = clean(home, { days, all: Boolean(opts.all), dryRun: dry, temp });
  const scope = opts.all ? 'all pages, videos and drafts' : `pages, videos and drafts older than ${count(days, 'day')}`;
  print(`Data directory: ${home} (${mb(before.total)} in total: ${count(before.pages.count, 'page')}, ${count(before.videos.count, 'video')}, ${mb(before.cache.bytes)} voice-over cache)`);
  if (temp) print(`Temporary folder: ${temp} (${mb(tempBefore.total)} in total: ${count(tempBefore.pages.count, 'page')}, ${count(tempBefore.videos.count, 'video')})`);
  print(dry
    ? `Would delete ${count(r.files, 'file')}, freeing ${mb(r.bytes)} (${scope} + voice-over cache). Run without --dry-run to delete.`
    : `✓ Deleted ${count(r.files, 'file')}, freeing ${mb(r.bytes)} (${scope} + voice-over cache). Settings were kept.`);
```

</details>

**依据 12 · 源码核查**：[src/render.js:347-349](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/render.js#L347-L349)

页面写入源草稿。

```text
${notice.popover}${colophon ? withColophon(body, language) : body}
${lightboxShell(ui, body.includes('class="am-diagram'))}${sourceTag(source)}
<script>${script}</script>
```

**依据 13 · 作者声明**：[README.md:182-192](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/README.md#L182-L192)

一直生成页面的规则可移除，清理与更新由用户发起。

<details>
<summary>查看原文（11行）</summary>

```text
With always-on mode, **every conclusion comes with a page**: whenever the agent gives a conclusion, summary, plan or comparison, even a short one, it adds a small page with 2 to 4 panels and puts the path at the end of the reply. These pages never pop open, so they don't interrupt you. Casual chat and replies with no conclusion stay as they are. Claude Code makes no pages in plan mode.

It is off by default. We recommend it: you stop asking for pages, and short answers read as well as long ones. Pages pile up in `~/.answer-me-with-html/`; clear them with `am clean`. To turn it on, paste this to your agent so it writes the rule into its rules file, such as `~/.claude/CLAUDE.md` or `AGENTS.md`:

> Turn on always-on mode for Answer me with HTML: add a global rule — "[answer-me-with-html always-on] Whenever a reply gives a conclusion, summary, plan, comparison, review or explanation, even a short one, also make a page with the answer-me-with-html skill (2 to 4 panels for routine answers), render it with --no-open before you write the reply, and end the reply with the page link in the format SKILL.md specifies for your host. Skip casual chat, one- or two-sentence replies with no conclusion, pure command output, and requests for plain text. An internal report to another agent is not a user reply: return the findings and evidence the parent asked for, and make no page unless the task explicitly asks for one."

To turn it off, delete that rule. Want fewer pages instead? See [less proactive](docs/reference.md#less-proactive).

## Updating and cleaning up

Updates are manual. When used, the CLI checks GitHub for a new version in the background at most once a day. If one is available, it prompts the agent at most once every three days; nothing about you is sent. To update, tell your agent "update answer-me-with-html". Pages pile up in `~/.answer-me-with-html/`. Say "clean up the pages", and the agent asks before it deletes anything. Other install methods and every option: [reference](docs/reference.md#updating-and-cleaning-up).
```

</details>

#### 缺口

- 本轮无 DSH 实际加载、文件写入、浏览器与恢复试用，缺各阶段人时、空间、账单及失败频率。
  **影响**：无法量化日常和退出负担，临时路径与留下的旧页可能造成阅读版本混淆。
  **进一步探讨**：用同题保存渲染前后的文件清单及字节，记录首次设置、日常核对和人为制造一次写入或清理失败的恢复时间，再按实际留存需要盘点退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 给关键图关系单独核对是否有收益？

**研究主题**：新假设与验证

#### 完整回答

已有 flow 的图数据含起点、终点和标签，代码围栏可读取指定文件和行，二者可分别显示。可试验在高风险箭头旁增加可展开的证据定位和人工核对状态，并区分未核对和核对失败。用同一批解释页分别计数错误方向、无来源箭头和定位所需时间，兼计草稿增长。

#### 证据与依据

**依据 1 · 源码核查**：[src/components/flow.js:79-85](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/components/flow.js#L79-L85)

实际组件解析与绘制顺序。

````text
  example: '```flow LR\n(User) -> Gateway: HTTPS\nGateway -> Auth & *Service\nService -> [(Database)]\ngroup Backend: Auth, Service\n```',
  render(text, { args, uid, ui, warn, video, dir: pageDir = 'ltr' }) {
    const model = parseFlow(text);
    model.warnings.forEach((w) => warn?.(w));
    const flowDir = (args.match(/\b(TB|LR|BT|RL)\b/i)?.[1] ?? 'TB').toUpperCase();
    const html = `<figure class="am-diagram am-flow">${layout(model, DIRS.has(flowDir) ? flowDir : 'TB', uid(), ui, pageDir, video ? undefined : warn)}</figure>`;
    return withDelta(html, [...model.nodes.values(), ...model.edges, ...model.groups].map((x) => x.state ?? null), { ui, video });
````

**依据 2 · 源码核查**：[src/components/flow.js:327-334](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/components/flow.js#L327-L334)

边数据传给布局，不核验边事实。

```text
  const labels = edges.map((e) => (e.label ? edgeText(e.label) : null));
  edges.forEach((e, i) => {
    const size = labels[i];
    // Dagre reserves 2px more than the drawn label box, as it always did.
    const label = size ? { label: e.label, width: size.width + 2, height: size.height, labelpos: 'c' } : {};
    g.setEdge(key.get(e.from), key.get(e.to), label, `e${i}`);
  });
  dagre.layout(g, { customOrder: orderRanks });
```

**依据 3 · 源码核查**：[src/code.js:64-71](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/code.js#L64-L71)

接受代码文件与行范围参数。

```text
export function parseCodeArgs(args, diff = false) {
  const attrs = parseAttrs(args);
  const keys = diff ? DIFF_KEYS : KEYS;
  for (const [key, value] of Object.entries(attrs)) {
    if (value !== true && !keys.has(key)) throw new CodeError(`unknown code block setting "${key}"; use ${[...keys].join(', ')}`, 0, diff ? DIFF_EXAMPLE : CODE_EXAMPLE);
  }
  const text = (key) => (typeof attrs[key] === 'string' || typeof attrs[key] === 'number' ? String(attrs[key]) : undefined);
  return { src: text('src'), lines: text('lines'), hl: text('hl'), title: text('title'), start: text('start'), file: text('file') };
```

**依据 4 · 源码核查**：[src/code.js:89-103](https://github.com/QingYunA/answer-me-with-html/blob/053619b917c6bf2e17eae5496d05eb08e10fe889/src/code.js#L89-L103)

文件约束与真实路径检查。

<details>
<summary>查看原文（15行）</summary>

```text
// The lines the block quotes, from the file. null when the file does not exist or is outside baseDir.
// A link is followed first, so the checks run on the file that is read and not on the name the draft gives it.
function readSlice(ref, range, baseDir) {
  const written = localPath(ref, baseDir);
  if (!written) return null;
  assertNotSecret(ref, relative(baseDir, written), false);
  let path;
  try {
    path = realpathSync(written);
    const root = realpathSync(baseDir);
    if (!localPath(path, root)) throw new CodeError(`Code file "${ref}" is a link to a file outside the current folder ${baseDir}; only files inside it are quoted`);
    assertNotSecret(ref, relative(root, path), true);
  } catch (err) {
    if (err instanceof CodeError) throw err;
    return null;
```

</details>

#### 缺口

- 这是增量假设。如果审阅者在现有图和代码块之间同样快地发现错误，或维护引用耗时抵消收益，收据不应推广。
  **影响**：审核增量收益未知。
  **进一步探讨**：盲测发现错误边的时间和引用开销。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
