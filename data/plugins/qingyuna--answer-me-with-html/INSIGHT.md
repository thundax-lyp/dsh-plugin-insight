# Answer me with HTML

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[aab9ea1](https://github.com/QingYunA/answer-me-with-html/tree/aab9ea19f50f038054eeb60475bbb7ea26f149e3)

<!-- BEGIN META -->
[![GitHub ★ 4,962](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C962&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)
<!-- END META -->

> **功能**：将模型生成的扩展 Markdown 草稿排版为单页 HTML，并支持图形组件与写作检查。

> **亮点**：[Q02](#research-q02) 将语义草稿与页面布局分离，提供图形和写作检查；不是发明 HTML、Markdown 或可视化。作者小样本效果不代表所有任务。

> **主要限制**：[Q03](#research-q03) 中写作检查、原始 HTML 清理与 CSP 不能验证图关系或事实；页面可读性、跨浏览器防护和完整离线性尚未证实。

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
  - [Q01 · 谁需要可交付页面，与直接 Markdown 和 HTML 相比变化是什么？](#detail-section-11)
  - [Q02 · DSH 加载什么，草稿如何变成页面？](#detail-section-12)
  - [Q03 · 渲染成功、内容检查和安全策略分别覆盖什么？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复的成本是什么？](#detail-section-14)
  - [Q05 · 什么任务值得试用，何时回退？](#detail-section-15)
  - [Q06 · 能否用来源绑定检验图的语义关系？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要解释流程、架构或多维比较并交付单页的读者及 Agent。

原生 Markdown 能表达文字和表格，Agent 手写 HTML 也能做页面；本项目减少重复页面结构与图坐标，但引入语法与文件管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill | 指导 Agent 起草和交付 | 内部委派报告默认不生成页面 |
| CLI | 渲染、警告、管理页面 | 需 Node；警告不等于事实校验 |
| 图形组件 | 将结构文字布局成图 | 关系事实需人工复核 |
| 写作检查 | 提示风格问题 | 默认警告，strict 可拒绝 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node 20+ | 必需 | 执行打包 CLI | 无法生成页面 |
| DSH filesystem Skill provider | DSH 路径必需 | 注册 Skill 根 | 宿主不发现 Skill |
| Agent 与可复核内容 | 必需 | 起草和审核 | 页面内容不可信 |
| 浏览器 | 查看 HTML 时必需 | 阅读交付页面 | 可保留原 Markdown |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择适合图示的问题 | 安装并确认 Node 与 Skill |
| 草拟 | Agent 写扩展 Markdown | 保留来源、符合组件语法 |
| 渲染 | CLI 解析、检查并写出页面 | 修复错误和警告 |
| 验收 | 用户核对事实和图关系 | 无法验证时退回文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | Node 和本地存储 | 安装、宿主发现 | 兼容未测 |
| 持续 | 模型 token、本地 CPU 和磁盘 | 草稿、修错与复核 | 总费用未知 |
| 失败 | 重试资源未知 | 修复格式与旧页管理 | 旧页在新页写出前保留 |
| 退出 | 文件整理成本未知 | 用户选择清理或回 Markdown | 更新检查可能联网 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图布局 | 组件解析后调用布局 | 图关系真实性 |
| 输出 token | 作者小样本声称减少 | 全轮费用和本任务效果 |
| 文风检查 | 默认警告或严格拒绝 | 内容事实与读者理解 |

> **思考**：[Q03](#research-q03) 中写作检查、原始 HTML 清理与 CSP 不能验证图关系或事实；页面可读性、跨浏览器防护和完整离线性尚未证实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将语义草稿与页面布局分离，提供图形和写作检查；不是发明 HTML、Markdown 或可视化。作者小样本效果不代表所有任务。

[Q02](#research-q02) 通过 Skill provider、打包 CLI 和模板分离内容与布局；[Q03](#research-q03) 中 CSP 和清理有明确范围，不能视作通用隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 中写作检查、原始 HTML 清理与 CSP 不能验证图关系或事实；页面可读性、跨浏览器防护和完整离线性尚未证实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 将复杂结构化说明用于隔离试用，核对箭头与事实；文本足够或无法核实就退回 Markdown。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定源码；未安装、运行目标、打开页面或重做作者基准。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、cordis.patch.yml、skills/answer-me-with-html/SKILL.md、src/cli.js、src/render.js、src/components/flow.js、src/raw-html.js、src/csp.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态检查根包的 DSH patch、Skill、CLI、渲染器及代表性 flow 组件，未穷尽全部视频、图表、浏览器或安全边界。
- 下一步：以固定任务对照 Markdown、直接 HTML 与本工具，记录事实错误、读者理解、总费用及可访问性；隔离浏览器检验 CSP。

**分析版本**

- **仓库**：[QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- **版本号**：0.5.10（[固定提交 aab9ea1](https://github.com/QingYunA/answer-me-with-html/tree/aab9ea19f50f038054eeb60475bbb7ea26f149e3)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出图关系附来源或人工推断标记的未验证方案，须与现有代码行引用和语法检查对照并衡量错误发现率及成本。

以固定任务对照 Markdown、直接 HTML 与本工具，记录事实错误、读者理解、总费用及可访问性；隔离浏览器检验 CSP。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 76 | 3887 | — | — | 56873 |
| .mjs | source | 15 | 14905 | 14144 | 577 | — |
| .js | source | 121 | 16693 | 13829 | 1848 | — |
| .md | example | 6 | 341 | — | — | 2286 |
| .js | test | 84 | 19097 | 16595 | 909 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 125](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=125&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 120](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=120&color=737b86&logo=github)](https://github.com/QingYunA/answer-me-with-html/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根 Skill 的 DSH 入口、页面渲染、成本及事实与安全边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要可交付页面，与直接 Markdown 和 HTML 相比变化是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要解释流程、架构或比较并交付单页的读者；直接 Markdown 已能交付文字与表格，模型手写 HTML 已能做网页。此项目的贡献是让模型写带结构的 Markdown 草稿，由 CLI 决定页面、样式与图布局；代价是新增草稿语法、Node 和本地文件。作者用 9 页统计输出 token，3 题各 3 次对照声称更快、省输出，且明示总账单降幅小于输出 token，不能将此推为所有任务的总成本或阅读效果。本轮未复跑，也无读者理解度对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-71](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L49-L71)

作者小样本、结果和总账单条件。

<details>
<summary>查看原文（23行）</summary>

```text
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

<p align="center">
  <img src="docs/images/plain-vs-skill.png" alt="The same TCP question answered both ways" width="100%">
</p>

<p align="center"><sub>The same question, the same model, answered both ways. Both pages are usable.</sub></p>

The token counts are saved in [bench/corpus/tokens.json](bench/corpus/tokens.json), so `node bench/corpus.mjs` gives the same numbers every time. The pages themselves are a [download](https://github.com/QingYunA/answer-me-with-html/releases/download/v0.4.14/bench-corpus-2026-10-07.zip). The bill drops less than the writing, about 15% here, because every turn also reads the system prompt, your question and the conversation, with or without the skill. See [where the cost goes](bench/README.md#where-the-cost-goes).
```

</details>

**依据 2 · 作者声明**：[README.md:194-200](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L194-L200)

作者解释模型写内容、CLI 负责呈现的设计。

```text
## Background

Andrej Karpathy [posted](https://x.com/karpathy/status/2105819303471976479) that as LLMs do more of the work, keeping up with their output becomes the hard part. A diagram or a web page is far easier to take in than a long block of text.

I tried asking agents to answer in HTML directly. The pages were good, but slow: a decent page took a minute or two, mostly hundreds of lines of CSS that were nearly the same every time. Diagrams were worse. The model had to compute SVG coordinates by hand, and arrows often pointed at nothing.

So Answer me with HTML takes that work away from the model. The model writes content. The CLI handles layout, color and drawing.
```

**依据 3 · 源码核查**：[skills/answer-me-with-html/SKILL.md:18-22](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L18-L22)

Skill 将内容草稿与版式分离。

```text
# Answer me with HTML: answer a complex question with one HTML page

You write only the **content draft** (extended Markdown). The `am` CLI does all layout, colours, dark mode and diagram coordinates. **Do not hand-write HTML / CSS / SVG.**

Reply to the user, and write the draft, in the user's language.
```

#### 缺口

- 没有当前任务和读者对照
  **影响**：无法证明所有回答更易理解或更便宜
  **进一步探讨**：同一任务比较原生 Markdown、手写 HTML 和本工具的准确率、读者时间及费用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 加载什么，草稿如何变成页面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package.json 将 dsh.bundle.patch 指向 cordis.patch.yml；patch 插入 filesystem skill provider、禁用默认根并定位打包 skills，index.js 自身导入无操作。被加载的 Skill 指导 Agent 写扩展 Markdown，用 Node 执行随 Skill 打包的脚本；CLI 的 render 路径读取配置并调用 renderDoc，渲染器解析、应用主题、进行写作检查、渲染块与组件并生成 HTML，CLI 写出页面。flow 组件把边和节点文本解析为模型并调用布局器，布局正确只说明渲染步骤完成，不能证明关系事实正确。无实际宿主加载或浏览器运行证据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-27](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/package.json#L1-L27)

包入口、二进制、DSH patch 和 Node 版本。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "answer-me-with-html",
  "version": "0.5.10",
  "description": "Answer hard questions with a one-page HTML: the model writes a short Markdown draft; the bundled CLI handles templates, SVG auto-layout and an STE controlled-writing check.",
  "icon": "./docs/logo.svg",
  "type": "module",
  "main": "index.js",
  "bin": {
    "am": "bin/am.js",
    "answer-me-with-html": "bin/am.js"
  },
  "files": [
    "index.js",
    "bin",
    "src",
    "skills",
    "examples",
    "cordis.patch.yml",
    "docs/logo.svg",
    "locale"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
```

</details>

**依据 2 · 源码核查**：[index.js:1-4](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/index.js#L1-L4)

模块本身不提供运行时行为。

```text
// Package entry for installers that require one: dsh-plugin-hub 1.6.6 and older block a git install
// whose package.json entry (index.js by default) is missing. DSH itself loads this package only through
// dsh.bundle.patch (cordis.patch.yml), and the CLI is bin/am.js. Importing this module does nothing.
export {};
```

**依据 3 · 源码核查**：[cordis.patch.yml:13-19](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/cordis.patch.yml#L13-L19)

通过包解析定位并注册 filesystem Skill。

```text
- insert:
    - id: answer-me-with-html-skill
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: answer-me-with-html
        includeDefaultRoots: false
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('answer-me-with-html/package.json')), 'skills')
```

**依据 4 · 源码核查**：[skills/answer-me-with-html/SKILL.md:59-65](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L59-L65)

Skill 指向打包脚本及 Node 需求。

````text
## 2. Workflow (one Bash call)

The CLI is bundled in this skill's directory: `scripts/am.mjs`, a single file with no dependencies to install; it needs only Node.js 20+. If `node` is not found or is older than v20, tell the user, show them the exact command to install the Node.js LTS (macOS `brew install node`, Windows `winget install OpenJS.NodeJS.LTS`, otherwise nvm, which adds lines to the shell profile), and run it only after they agree, then check `node --version` again. If they say no or it still fails, stop and tell them. Below, `am` always means:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/am.mjs"
```
````

**依据 5 · 源码核查**：[src/cli.js:330-354](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/cli.js#L330-L354)

CLI renderDoc 调用、写出与警告处理。

<details>
<summary>查看原文（25行）</summary>

```text
  if (replaced === false) {
    fail(`✗ --replace takes a page that am render wrote (a .html file in ${join(amHome(ctx.env), 'pages')} or ${join(tempHome(), 'pages')})`);
    return 2;
  }
  const config = loadConfig(ctx);
  const { theme, mode, style } = config.values;
  await loadMath(src);
  let result;
  try {
    result = renderDoc(src, { theme: opts.theme, template: opts.template, style: opts.style, mode: opts.mode }, { theme, mode, style }, { themes: ctx.themes, baseDir, codeDir: ctx.io.cwd ?? process.cwd(), update: updateFor(config, ctx), closeAfter: config.values.close_after_reply, scale: config.values.scale });
  } catch (e) {
    return reportDraftError(e, src, from, ctx);
  }
  const file = outputPath('pages', result.meta.title, opts, ctx);
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

**依据 6 · 源码核查**：[src/render.js:48-80](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/render.js#L48-L80)

解析、检查、组件、模板和 HTML 生成。

<details>
<summary>查看原文（33行）</summary>

```text
export function renderDoc(source, overrides = {}, defaults = {}, { themes = BUILTIN, previousLanguage, baseDir, codeDir, knownImages, knownCode, update, closeAfter = false, scale = 1 } = {}) {
  const choices = { theme: themes.choices('page') };
  const { doc: parsed, errors } = parseDocLoose(source, { defaults, choices });
  const meta = applyOverrides(parsed.meta, overrides, { ...CHOICES, ...choices });
  if (meta.template === 'video') throw new ParseError('template: video is a video draft; render it with am video', 0);
  const problem = themes.problem(meta.theme, 'page');
  if (problem) throw new ParseError(problem, 0);
  // theme: auto becomes a real theme here, so the page, the summary and later patches name the theme that was used.
  const doc = { ...parsed, meta: meta.theme === AUTO ? { ...meta, theme: pickTheme({ scope: 'page', template: meta.template, visuals: hasVisuals(parsed) }) } : meta };

  const language = resolveLanguage({ declared: doc.meta.lang, previous: previousLanguage, text: source });
  const warnings = doc.meta.style === 'off' ? [] : lintDoc(doc, language);
  if (doc.meta.style === 'strict' && warnings.length) {
    raiseAll(errors); // the draft errors come first: they have to be fixed anyway
    throw new LintError(warnings);
  }

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
  const html = shell({ meta: doc.meta, language, body, source, embedded: themes.embedFor(doc.meta.theme, 'page'), update, closeAfter, scale });
  return { html, warnings, stats, meta: doc.meta, language };
```

</details>

**依据 7 · 源码核查**：[src/components/flow.js:77-88](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/components/flow.js#L77-L88)

结构描述经解析与布局成为图。

<details>
<summary>查看原文（12行）</summary>

```text
  render(text, { args, uid, ui, warn, video, dir: pageDir = 'ltr' }) {
    const model = parseFlow(text);
    model.warnings.forEach((w) => warn?.(w));
    const flowDir = (args.match(/\b(TB|LR|BT|RL)\b/i)?.[1] ?? 'TB').toUpperCase();
    const html = `<figure class="am-diagram am-flow">${layout(model, DIRS.has(flowDir) ? flowDir : 'TB', uid(), ui, pageDir)}</figure>`;
    return withDelta(html, [...model.nodes.values(), ...model.edges, ...model.groups].map((x) => x.state ?? null), { ui, video });
  },
};

export function parseFlow(text) {
  const nodes = new Map();
  const edges = [];
```

</details>

#### 缺口

- 未在 DSH 加载、执行 CLI 或打开页面
  **影响**：无法保证宿主兼容和目标环境效果
  **进一步探讨**：固定版本在隔离 profile 验证安装、选 Skill、生成和打开页面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 渲染成功、内容检查和安全策略分别覆盖什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

renderDoc 的 style=off 跳过写作检查，strict 存在警告时拒绝；默认风格只警告而非验证事实或图的语义，且 CLI 出现 STE、代码或数学警告时默认阻止自动打开而不是必然不写页面。Markdown 原始标签会清理部分事件处理器和危险 URL，但显式 html/svg fence 会原样进入页面；CSP 为脚本固定哈希、限制资源，并允许内联样式及 self 连接，形成浏览器端的防护层而非通用隔离或事实校验。页面封装的数据资源不意味着安装、更新、视频和所有 CLI 操作均离线。

#### 证据与依据

**依据 1 · 源码核查**：[src/render.js:58-80](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/render.js#L58-L80)

严格模式警告拒绝；渲染块后装配页面。

<details>
<summary>查看原文（23行）</summary>

```text
  const language = resolveLanguage({ declared: doc.meta.lang, previous: previousLanguage, text: source });
  const warnings = doc.meta.style === 'off' ? [] : lintDoc(doc, language);
  if (doc.meta.style === 'strict' && warnings.length) {
    raiseAll(errors); // the draft errors come first: they have to be fixed anyway
    throw new LintError(warnings);
  }

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
  const html = shell({ meta: doc.meta, language, body, source, embedded: themes.embedFor(doc.meta.theme, 'page'), update, closeAfter, scale });
  return { html, warnings, stats, meta: doc.meta, language };
```

</details>

**依据 2 · 源码核查**：[src/cli.js:343-354](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/cli.js#L343-L354)

已写页面及警告时自动打开处理。

<details>
<summary>查看原文（12行）</summary>

```text
  const file = outputPath('pages', result.meta.title, opts, ctx);
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

**依据 3 · 源码核查**：[src/raw-html.js:110-133](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/raw-html.js#L110-L133)

过滤事件属性与不安全 URL。

<details>
<summary>查看原文（24行）</summary>

```text
// A link a browser would run or open as a document. An image may carry data:image/ in src.
function unsafeUrl(element, attr, value) {
  const url = decode(value.replace(/^["']|["']$/g, '')).replace(/[\x00-\x20\x7f]/g, '').toLowerCase();
  if (/^(javascript|vbscript):/.test(url)) return true;
  return url.startsWith('data:') && !(element === 'img' && attr === 'src' && url.startsWith('data:image/'));
}

function unsafe(element, attr, value) {
  if (/^on|^(srcdoc|formaction)$/.test(attr)) return true;
  return URL_ATTRS.has(attr) && unsafeUrl(element, attr, value);
}

// A tag that stays loses its event handlers and unsafe links. A clean tag comes back byte for byte.
function cleanTag(tag, note) {
  if (tag.close) return tag.text;
  const head = 1 + tag.name.length;
  const removed = [];
  const attrs = tag.text.slice(head).replace(ATTR, (attr, name, value = '') => {
    if (!unsafe(tag.name, name.toLowerCase(), value)) return attr;
    removed.push(name);
    return '';
  });
  if (removed.length) note(tag.text, `removed ${removed.join(', ')} from <${tag.name}>${removed.some((n) => URL_ATTRS.has(n.toLowerCase())) ? ' (unsafe URL)' : ''}`);
  return tag.text.slice(0, head) + attrs;
```

</details>

**依据 4 · 源码核查**：[src/csp.js:1-5](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/csp.js#L1-L5)

原始 html/svg fence 原样进入页面的背景。

```text
// The Content-Security-Policy every page carries as a <meta> tag. A raw html / svg fence reaches the page unchanged, so without a policy an
// injected <script> or onerror= would run when the page opens, and an <img src="https://…"> or css url(https://…) would send data out
// with no script at all. The policy allows only the page's own inline scripts, each pinned by the hash of its exact text, and no remote
// content: images, fonts and media are data: URIs, which is how the page embeds them. Inline style stays allowed (the themes and
// the diagrams set style attributes).
```

**依据 5 · 源码核查**：[src/csp.js:21-35](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/csp.js#L21-L35)

CSP 指令与例外。

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

**依据 6 · 作者声明**：[README.md:277-281](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L277-L281)

作者说明写作检查范围及默认警告。

```text
## The STE writing check

[ASD-STE100](https://www.asd-ste100.org/) is a controlled form of English first used for aircraft maintenance manuals. Its rules are concrete: keep sentences short, give each word one meaning, write steps as commands. Karpathy noted that asking an LLM to follow these rules makes its writing much easier to read.

Every render checks the parts a machine can check: sentence length, plain words, passive voice, and common Chinese typos and vague words. It only warns by default. Set `/answer-me-with-html:config style strict` to refuse drafts that fail, or `style:` in one draft. The full rule list: [reference](docs/reference.md#writing-check).
```

#### 缺口

- 未测多浏览器和恶意输入，也未核查所有边界
  **影响**：不能断言无 XSS、零联网或结果可信
  **进一步探讨**：隔离浏览器用正反例审计 CSP、导航、网络请求和内容正确性。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复的成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 Node 20+，DSH 入口需要对应 Skill provider；Skill 自述 CLI 已打包、无须另装 npm 依赖，而包形式包含依赖。首次要安装并确认宿主发现 Skill；持续要写草稿、修复语法与写作警告、复核事实、保存和打开页面。默认警告不等于失败，strict 可失败；CLI 在新页面成功写出后才移除 --replace 指定的旧尝试，失败可保留旧页。作者说明更新检查可能后台联网，页面累积需用户决定清理；真实 token、模型费用、人工审核及浏览器成本未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-27](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/package.json#L23-L27)

DSH patch 与 Node 要求。

```text
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "engines": {
```

**依据 2 · 源码核查**：[skills/answer-me-with-html/SKILL.md:59-65](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L59-L65)

打包 CLI 与 Node 要求。

````text
## 2. Workflow (one Bash call)

The CLI is bundled in this skill's directory: `scripts/am.mjs`, a single file with no dependencies to install; it needs only Node.js 20+. If `node` is not found or is older than v20, tell the user, show them the exact command to install the Node.js LTS (macOS `brew install node`, Windows `winget install OpenJS.NodeJS.LTS`, otherwise nvm, which adds lines to the shell profile), and run it only after they agree, then check `node --version` again. If they say no or it still fails, stop and tell them. Below, `am` always means:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/am.mjs"
```
````

**依据 3 · 源码核查**：[skills/answer-me-with-html/SKILL.md:90-97](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L90-L97)

错误、重试、替换及清理授权。

```text
4. Read the output:
   - `✓ <path>`: success. Whether the browser opens automatically depends on the user's settings (`am config`); `--no-open` affects only this run. A page with STE or code warnings never opens automatically.
   - `✗ L<line> …` + `Correct example:`: no page was written. The CLI lists every error of the draft at once, in line order (`✗ n errors in the draft`). Read all of them, fix each flagged line following its example, then render again.
   - `  draft: <path>`: the CLI saved your stdin draft there, and every `L<line>` in the output matches that file. Change only the flagged lines in that file with your file-edit tool; do not send a new heredoc. Then run `am render <path>`; when a page was written, add `--replace` or reuse `-o` as the rule on rendering again below says. The CLI deletes the saved draft once it renders with no warnings. A draft you passed as a file path is not copied: edit that file.
   - `code n warnings`: a code block is longer than 40 lines, or a diff hunk has a different number of lines than its `@@` header says. Cut the block or fix the header to the lines that make the point and render again, or keep it if every line matters.
   - `STE n warnings`: rewrite the flagged lines as suggested, then render again. Retry at most 2 rounds; if warnings remain, keep the last page and say so.
   - When rendering again after a `✓`, add `--replace <path from the last ✓ line>` for a page in the data directory's `pages/` or the temporary folder's `pages/`; the CLI deletes that page once the new one is written. For a page written with `-o`, reuse the same quoted `-o` HTML file path to overwrite it in place.
   - `! Cleanup hint: …` or `! Update hint: …`: pass it on to the user in one sentence at the end of the reply, and ask whether to clean up / update. **Do not run am clean or the update command yourself**; wait until the user agrees. The CLI throttles these: the cleanup hint appears at most once every 7 days, the update hint at most once every 3 days.
```

**依据 4 · 源码核查**：[src/cli.js:337-354](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/cli.js#L337-L354)

失败处理、写出后替换旧页面。

<details>
<summary>查看原文（18行）</summary>

```text
  let result;
  try {
    result = renderDoc(src, { theme: opts.theme, template: opts.template, style: opts.style, mode: opts.mode }, { theme, mode, style }, { themes: ctx.themes, baseDir, codeDir: ctx.io.cwd ?? process.cwd(), update: updateFor(config, ctx), closeAfter: config.values.close_after_reply, scale: config.values.scale });
  } catch (e) {
    return reportDraftError(e, src, from, ctx);
  }
  const file = outputPath('pages', result.meta.title, opts, ctx);
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

**依据 5 · 作者声明**：[README.md:190-192](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L190-L192)

作者说明更新与清理。

```text
## Updating and cleaning up

Updates are manual. When used, the CLI checks GitHub for a new version in the background at most once a day. If one is available, it prompts the agent at most once every three days; nothing about you is sent. To update, tell your agent "update answer-me-with-html". Pages pile up in `~/.answer-me-with-html/`. Say "clean up the pages", and the agent asks before it deletes anything. Other install methods and every option: [reference](docs/reference.md#updating-and-cleaning-up).
```

#### 缺口

- 没有测量安装耗时、任务总账单和额外人工
  **影响**：无法断言净省时、省钱
  **进一步探讨**：对照同一任务记录总模型费用、失败重试和阅读复核时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么任务值得试用，何时回退？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

当流程、架构或多维比较确实需要图形且可以复核来源时，可对一份不敏感样本先用 --no-open 生成页面，核对关键箭头、表格与原文后再交付。对于纯文本足以理解、用户要求纯文本、对准确性无法复核或本机不能运行 Node 的情况，直接 Markdown 和原生 Agent 更合适。Skill 主张广泛主动使用，但同一份 Skill 对受委派内部报告明确要求原样汇报、默认不渲染页面，因此不能把描述中的主动触发写为每次任务必生成页面。若检查失败或内容不可信，保留草稿并回退，不把结构合法当成事实合格。

#### 证据与依据

**依据 1 · 源码核查**：[skills/answer-me-with-html/SKILL.md:5-15](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L5-L15)

广泛触发与纯文本例外。

<details>
<summary>查看原文（11行）</summary>

```text
  Turns an answer into a one-page visual HTML explainer: the model writes a short Markdown draft and
  the bundled CLI builds one page. Use it proactively and liberally in replies to the user, without being asked, whenever a
  page would help the reader more than plain text, even if plain text would also work: any explanation
  of how something works or how parts relate (flow, request path, architecture, code or folder
  structure, state machine, lifecycle, history); any comparison, trade-off or decision with pros and
  cons; any diagnosis, review or investigation, especially with several causes or findings to rank;
  any answer with a table, a numbered or ranked list, steps, branches or several sections; or when the
  user says "I don't get it / draw it / explain visually / 讲讲原理 / 没看懂 / 画个图". When in doubt, use it: a
  page is quick and cheap to make. Also for explainer videos ("make a video", "做个视频") and for changing
  its settings. Skip only for small talk, a trivial one-line answer, or when the user asks for plain
  text.
```

</details>

**依据 2 · 源码核查**：[skills/answer-me-with-html/SKILL.md:30-44](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L30-L44)

页面判据及委派内部报告例外。

<details>
<summary>查看原文（15行）</summary>

```text
## 1. Decide: produce a page or not

Produce a page if any of these is true:
- There are ≥3 interrelated concepts, and the reader needs to see how they relate.
- There is a flow, protocol, call chain or state transition (especially with branches or several actors).
- There is a comparison across ≥3 dimensions, a trade-off between options, or a "can / cannot" list.
- There is a hierarchy or an evolution over time.

Otherwise answer in plain text. When unsure: the more the question "needs a picture to understand", the more it calls for a page.

Automatic pages are for replies to the user. An internal report returned to another agent is not one:

- If a parent agent or a coordinator delegated research, implementation, a review or a progress report, return the text or structure it asked for, with the findings and the evidence. Render no page.
- The parent consolidates the reports. Its reply to the user follows the normal rules of this section.
- If the delegated task explicitly asks for a page, render it, and return the page path together with the verification details the parent asked for. A video needs an explicit video request; delegation alone never authorizes one.
```

</details>

**依据 3 · 源码核查**：[skills/answer-me-with-html/SKILL.md:90-96](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/skills/answer-me-with-html/SKILL.md#L90-L96)

警告和渲染重试。

```text
4. Read the output:
   - `✓ <path>`: success. Whether the browser opens automatically depends on the user's settings (`am config`); `--no-open` affects only this run. A page with STE or code warnings never opens automatically.
   - `✗ L<line> …` + `Correct example:`: no page was written. The CLI lists every error of the draft at once, in line order (`✗ n errors in the draft`). Read all of them, fix each flagged line following its example, then render again.
   - `  draft: <path>`: the CLI saved your stdin draft there, and every `L<line>` in the output matches that file. Change only the flagged lines in that file with your file-edit tool; do not send a new heredoc. Then run `am render <path>`; when a page was written, add `--replace` or reuse `-o` as the rule on rendering again below says. The CLI deletes the saved draft once it renders with no warnings. A draft you passed as a file path is not copied: edit that file.
   - `code n warnings`: a code block is longer than 40 lines, or a diff hunk has a different number of lines than its `@@` header says. Cut the block or fix the header to the lines that make the point and render again, or keep it if every line matters.
   - `STE n warnings`: rewrite the flagged lines as suggested, then render again. Retry at most 2 rounds; if warnings remain, keep the last page and say so.
   - When rendering again after a `✓`, add `--replace <path from the last ✓ line>` for a page in the data directory's `pages/` or the temporary folder's `pages/`; the CLI deletes that page once the new one is written. For a page written with `-o`, reuse the same quoted `-o` HTML file path to overwrite it in place.
```

**依据 4 · 作者声明**：[README.md:49-71](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L49-L71)

作者对照样本和适用范围。

<details>
<summary>查看原文（23行）</summary>

```text
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

<p align="center">
  <img src="docs/images/plain-vs-skill.png" alt="The same TCP question answered both ways" width="100%">
</p>

<p align="center"><sub>The same question, the same model, answered both ways. Both pages are usable.</sub></p>

The token counts are saved in [bench/corpus/tokens.json](bench/corpus/tokens.json), so `node bench/corpus.mjs` gives the same numbers every time. The pages themselves are a [download](https://github.com/QingYunA/answer-me-with-html/releases/download/v0.4.14/bench-corpus-2026-10-07.zip). The bill drops less than the writing, about 15% here, because every turn also reads the system prompt, your question and the conversation, with or without the skill. See [where the cost goes](bench/README.md#where-the-cost-goes).
```

</details>

#### 缺口

- 未测特定人群的可读性和辅助技术体验
  **影响**：不能证明页面总比 Markdown 易懂
  **进一步探讨**：让目标读者完成固定理解任务并记录错误、时间及可访问性问题。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用来源绑定检验图的语义关系？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

项目已有引用代码文件和行的能力，也已有组件语法检查，因此新增“显示来源链接”或“校验草稿语法”不能当作新的贡献。未验证假设是在图的每条关键箭头上附来源位置或标记人工推断，并允许读者从关系跳转回上下文；这提高可审阅性，但不能自动保证引用支持箭头、证据完整或推断正确。对同一组架构问题比较原始页面和带关系出处页面，盲审错误箭头发现率、每项审核时间、来源正确率与额外 token；如果来源链接大多无关、发现率不提升或成本超出收益，则否定。此假设未实现、未计入现有创新分。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:265-275](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/README.md#L265-L275)

已有组件和带 src/lines 的代码引用。

<details>
<summary>查看原文（11行）</summary>

```text
| `timeline` | History, releases, phases |
| `limits` | A value against its limit |
| `chart` | Bars, lines or a pie from a table of numbers: several series, negative values, a highlighted row |
| `annot` | Word-by-word notes on a sentence |
| `kv` | Metadata, a drawing's title block |
| `callout` | A conclusion, a tip, a warning |
| `ask` | A decision you make on the page; the agent's suggestion has a tag; nothing starts selected |
| Code block | Real code quoted from a file (`src=` `lines=`), or a sketch |
| Table | Multi-way comparison. Write `ok` / `no` / `warn` in a cell to get ✓ ✗ ! |

The draft format (frontmatter, `span`, `rows`, raw `html` / `svg` blocks) and how to call the CLI without an agent are in the [reference](docs/reference.md). Full syntax for a component: `am help <component>`.
```

</details>

**依据 2 · 源码核查**：[src/components/flow.js:77-88](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/components/flow.js#L77-L88)

当前 flow 从文本解析关系并布局。

<details>
<summary>查看原文（12行）</summary>

```text
  render(text, { args, uid, ui, warn, video, dir: pageDir = 'ltr' }) {
    const model = parseFlow(text);
    model.warnings.forEach((w) => warn?.(w));
    const flowDir = (args.match(/\b(TB|LR|BT|RL)\b/i)?.[1] ?? 'TB').toUpperCase();
    const html = `<figure class="am-diagram am-flow">${layout(model, DIRS.has(flowDir) ? flowDir : 'TB', uid(), ui, pageDir)}</figure>`;
    return withDelta(html, [...model.nodes.values(), ...model.edges, ...model.groups].map((x) => x.state ?? null), { ui, video });
  },
};

export function parseFlow(text) {
  const nodes = new Map();
  const edges = [];
```

</details>

**依据 3 · 源码核查**：[src/render.js:65-80](https://github.com/QingYunA/answer-me-with-html/blob/aab9ea19f50f038054eeb60475bbb7ea26f149e3/src/render.js#L65-L80)

渲染检查和页面装配路径。

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
  const html = shell({ meta: doc.meta, language, body, source, embedded: themes.embedFor(doc.meta.theme, 'page'), update, closeAfter, scale });
  return { html, warnings, stats, meta: doc.meta, language };
```

</details>

#### 缺口

- 没有关系出处方案或对照实验
  **影响**：无法证明来源绑定减少错误
  **进一步探讨**：在小型固定题集人工标注来源和错误，比较盲审结果与额外成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
