# Answer me with HTML

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[f82dd6d](https://github.com/QingYunA/answer-me-with-html/tree/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f)

<!-- BEGIN META -->
[![GitHub ★ 4,422](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C422&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/QingYunA/answer-me-with-html)
<!-- END META -->

> **功能**：将Agent撰写的扩展Markdown转换为含图表的单文件HTML页面，并提供可选视频输出。

> **亮点**：[Q03](#research-q03)识别出内容草稿与布局编译分离的组合贡献，相比模型手写HTML减少重复结构输出；成立条件是任务确需图表页面且内容完整，作者小样本不证明普遍节费。

> **主要限制**：[Q04](#research-q04)说明结构渲染与CSP都不校验解释是否正确，1/8输出token也非1/8全轮成本；内容核对仍由作者承担。

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
  - [Q01 · 复杂解释怎样变成可交付的单页，谁会反复使用？](#detail-section-11)
  - [Q02 · DSH到底加载了什么，Markdown怎样成为页面？](#detail-section-12)
  - [Q03 · 相对直接生成HTML，哪些成本被转移而非消失？](#detail-section-13)
  - [Q04 · 渲染成功、离线和安全各自证明到哪里？](#detail-section-14)
  - [Q05 · 哪些安装和使用条件应由用户承担？](#detail-section-15)
  - [Q06 · 是否能以较低采用负担获得合格输出？](#detail-section-16)
  - [Q07 · 可复用的工程设计与维护条件是什么？](#detail-section-17)
  - [Q08 · 能否让图形解释绑定原文证据而非仅优化外观？](#detail-section-18)
  - [Q09 · 什么任务值得可控试用，什么时候退回Markdown？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向让Agent解释协议、架构或多维比较的读者，目标是得到可打开、可携带的含文本和图表页面。原办法是直接读Markdown或让模型手写HTML；前者简单而可读性未必差，后者要生成重复布局代码。作者称由短草稿生成单文件能减少模型输出，但复杂内容是否更易理解需读者任务对照，不由漂亮页面证明。

贡献是将模型负责的语义草稿与确定布局/图坐标分离，再由CLI完成单文件装配。相比直接HTML，减少重复CSS、标签与SVG生成；README9页样本和3题多次测量是作者结果，未在当前提交复跑，也未匹配所有任务。相对纯Markdown，增加了渲染、校验与文件管理负担；只有结构化内容和可携带展示确有需求才有额外价值，不是通用回答升级。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 草稿渲染 | 将内容与图形组件编译为单页 | Node20+；语义正确性需核对 |
| 局部修改 | 保留主题并改指定面板 | 需保留可解析页面草稿 |
| 离线单文件 | 携带页面和内联资源 | 不证明所有CLI步骤免联网 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node20+与捆绑CLI | 页面必需 | 编译草稿 | 退回Markdown |
| Agent文件/shell权限 | 必需 | 写稿与运行CLI | 无法自动页面化 |
| 本地可写目录 | 必需 | 保存页面 | 临时目录需保留 |
| ffmpeg/语音 | 视频特定模式 | 可选视频导出 | 不影响普通页面 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确认页面适用 | 内容确需结构或图形 |
| 2 | Agent写稿调用CLI | 解析及lint通过，失败按行修稿 |
| 3 | 用户核对语义 | 错误图退回草稿 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Node与本地资源 | 安装和路径确认 | 耗时未知 |
| 持续 | 模型输入输出与渲染文件 | 草稿、纠错、语义复核 | 不外推作者节费 |
| 失败恢复 | 保留草稿与旧页面 | 按行修复或退回Markdown | 总纠错耗时未知 |
| 退出 | 页面目录占用 | 关自动附页并按需保留文件 | 视频另计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 结构输出 | 确定渲染与行号错误存在 | 浏览器及布局效果 |
| 输出token减少 | 作者给小样本对照 | 当前任务幅度与全轮费用 |
| 理解提升 | 提供图表可视表达 | 读者正确率与阅读时间 |

> **思考**：[Q04](#research-q04)说明结构渲染与CSP都不校验解释是否正确，1/8输出token也非1/8全轮成本；内容核对仍由作者承担。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q03](#research-q03)识别出内容草稿与布局编译分离的组合贡献，相比模型手写HTML减少重复结构输出；成立条件是任务确需图表页面且内容完整，作者小样本不证明普遍节费。

解析、lint、组件渲染、主题和CSP分层清楚，错误带行号并集中raiseAll，适合借鉴为模型只写内容的编译管线。脚本hash与live脚本共享常量避免漂移；移植需要重做组件语法、资源内联和浏览器兼容，不能仅搬模板。源码与大量测试定义提供可检查接口，本轮未执行其测试，不称跨浏览器通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04)说明结构渲染与CSP都不校验解释是否正确，1/8输出token也非1/8全轮成本；内容核对仍由作者承担。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。若组件错误、图形误导或纠错时间超过直接Markdown，停止自动附页并回到原草稿；敏感文件不因可内联就自动加入输出。视频仅在明确请求且成本可接受时另试。 依据 [Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

当前贡献由固定源码支持并含解释判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、index.js、src/render.js、src/csp.js、skills/answer-me-with-html/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅固定提交源码、README、配置与相关测试定义；未安装或执行目标代码，未进行真实宿主验收。
- 下一步：未验证假设是为图中节点/箭头附来源句子与可核对引用，使语义草稿和图形关系有可追溯约束。由确定渲染只保证结构、不保证事实推导，这可能比增加模板更能减少错误解释。取同一组架构问题，比较原版与带关系依据版的错误箭头发现率、额外token和审核时间；若发现率不改善或总负担超出收益则否定。当前未实现，不计入本版创新。

**分析版本**

- **仓库**：[QingYunA/answer-me-with-html](https://github.com/QingYunA/answer-me-with-html)
- **版本号**：0.5.10（[固定提交 f82dd6d](https://github.com/QingYunA/answer-me-with-html/tree/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08)提出未验证的图关系来源绑定，按错误关系发现率与审核负担对照，而非继续增加模板数量。

未验证假设是为图中节点/箭头附来源句子与可核对引用，使语义草稿和图形关系有可追溯约束。由确定渲染只保证结构、不保证事实推导，这可能比增加模板更能减少错误解释。取同一组架构问题，比较原版与带关系依据版的错误箭头发现率、额外token和审核时间；若发现率不改善或总负担超出收益则否定。当前未实现，不计入本版创新。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 76 | 3839 | — | — | 55177 |
| .mjs | source | 15 | 14470 | 13723 | 567 | — |
| .js | source | 119 | 16083 | 13332 | 1761 | — |
| .md | example | 6 | 341 | — | — | 2286 |
| .js | test | 82 | 18206 | 15801 | 876 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/QingYunA/answer-me-with-html/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定版本判断Answer me with HTML的贡献、关键质疑与可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 复杂解释怎样变成可交付的单页，谁会反复使用？

**研究主题**：场景与需求

#### 完整回答

面向让Agent解释协议、架构或多维比较的读者，目标是得到可打开、可携带的含文本和图表页面。原办法是直接读Markdown或让模型手写HTML；前者简单而可读性未必差，后者要生成重复布局代码。作者称由短草稿生成单文件能减少模型输出，但复杂内容是否更易理解需读者任务对照，不由漂亮页面证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-71](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L33-L71)

任务示例和作者token/耗时结果

<details>
<summary>查看原文（39行）</summary>

````text
Once installed, ask questions the way you always do:

```
> Explain the TCP three-way handshake
> Map out how the modules in this repo fit together
> Redis or Memcached for our cache?
```

The agent writes a short Markdown draft and hands it to the CLI that ships with the skill. About 50 ms later you have a page:

https://github.com/user-attachments/assets/d3063a28-5dfd-4c44-a562-be901c49b249

<p align="center"><sub>24-second demo. Turn the sound on for the music.</sub></p>

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

<p align="center">
  <img src="docs/images/plain-vs-skill.png" alt="The same TCP question answered both ways" width="100%">
</p>

<p align="center"><sub>The same question, the same model, answered both ways. Both pages are usable.</sub></p>

The token counts are saved in [bench/corpus/tokens.json](bench/corpus/tokens.json), so `node bench/corpus.mjs` gives the same numbers every time. The pages themselves are a [download](https://github.com/QingYunA/answer-me-with-html/releases/download/v0.4.14/bench-corpus-2026-10-07.zip). The bill drops less than the writing, about 15% here, because every turn also reads the system prompt, your question and the conversation, with or without the skill. See [where the cost goes](bench/README.md#where-the-cost-goes).
````

</details>

#### 缺口

- 同等信息完整度的读者理解效果未知
  **影响**：无法证明视觉页比Markdown更有效
  **进一步探讨**：对照同题Markdown与页面的任务正确率和阅读时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH到底加载了什么，Markdown怎样成为页面？

**研究主题**：功能与机制

#### 完整回答

DSH bundle只插入filesystem Skill提供者，限定bundled skills根目录；根index.js为空导出，并无自定义宿主工具。Skill让Agent写扩展Markdown并调用捆绑CLI，renderDoc解析草稿、应用元数据、STE检查、渲染面板和组件，再注入主题与脚本。严谨区分Skill指引和运行实现，后者只保证可解析结构，不保证解释内容正确。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:13-19](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/cordis.patch.yml#L13-L19)

唯一Skill provider挂载

```text
- insert:
    - id: answer-me-with-html-skill
      name: '@deepseek-ai/dsh-skill-filesystem'
      config:
        providerName: answer-me-with-html
        includeDefaultRoots: false
        bundledSkillDir: !!js process.getBuiltinModule('node:path').join(process.getBuiltinModule('node:path').dirname(process.getBuiltinModule('node:module').createRequire(baseUrl).resolve('answer-me-with-html/package.json')), 'skills')
```

**依据 2 · 源码核查**：[index.js:1-4](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/index.js#L1-L4)

根入口无自定义功能

```text
// Package entry for installers that require one: dsh-plugin-hub 1.6.6 and older block a git install
// whose package.json entry (index.js by default) is missing. DSH itself loads this package only through
// dsh.bundle.patch (cordis.patch.yml), and the CLI is bin/am.js. Importing this module does nothing.
export {};
```

**依据 3 · 源码核查**：[src/render.js:48-80](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L48-L80)

草稿到HTML调用链

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对直接生成HTML，哪些成本被转移而非消失？

**研究主题**：贡献与相对优势

#### 完整回答

贡献是将模型负责的语义草稿与确定布局/图坐标分离，再由CLI完成单文件装配。相比直接HTML，减少重复CSS、标签与SVG生成；README9页样本和3题多次测量是作者结果，未在当前提交复跑，也未匹配所有任务。相对纯Markdown，增加了渲染、校验与文件管理负担；只有结构化内容和可携带展示确有需求才有额外价值，不是通用回答升级。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-73](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L47-L73)

作者对照与费用降幅小于token降幅的说明

<details>
<summary>查看原文（27行）</summary>

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

<p align="center">
  <img src="docs/images/plain-vs-skill.png" alt="The same TCP question answered both ways" width="100%">
</p>

<p align="center"><sub>The same question, the same model, answered both ways. Both pages are usable.</sub></p>

The token counts are saved in [bench/corpus/tokens.json](bench/corpus/tokens.json), so `node bench/corpus.mjs` gives the same numbers every time. The pages themselves are a [download](https://github.com/QingYunA/answer-me-with-html/releases/download/v0.4.14/bench-corpus-2026-10-07.zip). The bill drops less than the writing, about 15% here, because every turn also reads the system prompt, your question and the conversation, with or without the skill. See [where the cost goes](bench/README.md#where-the-cost-goes).

Explainer videos save even more: about 18× fewer output tokens and 12× faster in [a small test](bench/README.md#explainer-videos).
```

</details>

**依据 2 · 源码核查**：[src/render.js:48-80](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L48-L80)

内容与布局分离实现

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

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 渲染成功、离线和安全各自证明到哪里？

**研究主题**：缺陷与关键质疑

#### 完整回答

页面可包含raw HTML/SVG，因此CSP以脚本哈希限制可执行内容，禁远端图片字体媒体并限制form和base；这收窄输出页联网/执行，但不证明浏览器兼容或插件整个CLI不联网。结构正确的图也可能表达错误关系。README宣传1/8 token不能转写为成本降低八倍，作者自己说明全轮账单约15%降幅且样本有限。

#### 证据与依据

**依据 1 · 源码核查**：[src/csp.js:21-35](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/csp.js#L21-L35)

脚本哈希和资源限制

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

**依据 2 · 作者声明**：[README.md:58-73](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L58-L73)

token与钱款口径区分

<details>
<summary>查看原文（16行）</summary>

```text
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

Explainer videos save even more: about 18× fewer output tokens and 12× faster in [a small test](bench/README.md#explainer-videos).
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些安装和使用条件应由用户承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node20+是CLI运行前提；DSH需要Skill filesystem provider及当前模型能读取Skill、写草稿和执行shell。默认页面存用户目录，沙箱不可写时落临时目录，需注意保留；图片代码嵌入可能读取本地路径，模型应只引用任务需要的材料。普通页面不需视频工具链，视频的语音与可选ffmpeg是另一条依赖，不应算入基础页免依赖承诺。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:75-85](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L75-L85)

Node及安装声明

<details>
<summary>查看原文（11行）</summary>

```text
## Install

You need [Node.js](https://nodejs.org/) 20 or newer. There is no `npm install` step. The CLI is bundled inside the skill. No Node.js yet? With the recommended install below, your agent asks you and then installs it.

### Let your agent install it (recommended)

Paste this into Claude Code, Codex, Cursor, OpenCode or any other agent:

> Install Answer me with HTML: read https://raw.githubusercontent.com/QingYunA/answer-me-with-html/main/INSTALL.md and follow it.

[INSTALL.md](INSTALL.md) is written for agents. It installs the plugin in Claude Code and the skill in other agents, keeps an existing install, asks you nothing unless Node.js is missing or older than 20, and ends with one report after checking the result with the TCP three-way handshake page. If your agent cannot open links, use `npx -y skills add QingYunA/answer-me-with-html -g -y -a <your agent name>` (for Claude Code, `-a claude-code`).
```

</details>

**依据 2 · 作者声明**：[skills/answer-me-with-html/SKILL.md:59-69](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/skills/answer-me-with-html/SKILL.md#L59-L69)

捆绑CLI及路径退路

<details>
<summary>查看原文（11行）</summary>

````text
## 2. Workflow (one Bash call)

The CLI is bundled in this skill's directory: `scripts/am.mjs`, a single file with no dependencies to install; it needs only Node.js 20+. If `node` is not found or is older than v20, tell the user, show them the exact command to install the Node.js LTS (macOS `brew install node`, Windows `winget install OpenJS.NodeJS.LTS`, otherwise nvm, which adds lines to the shell profile), and run it only after they agree, then check `node --version` again. If they say no or it still fails, stop and tell them. Below, `am` always means:

```bash
node "${CLAUDE_SKILL_DIR}/scripts/am.mjs"
```

In Claude Code, the path above is replaced with this skill's directory automatically. If you see the variable unreplaced (other agents), replace it with the absolute path of the directory that contains this SKILL.md. When the skill was loaded with a "Base directory for this skill" line (DeepSeek Harness), that path is this directory. If the user installed the `am` command globally, you can also use `am` directly.

Keep the default output; it needs no flag. If the session cannot write to `~/.answer-me-with-html/pages` (a sandbox that allows writes only in the workspace), the CLI saves the page in a private folder in the system temporary folder and says so on a `!` line; the system may clear that folder. Add `-o "<absolute-workspace-path>/.tmp/answers/topic.html"` to `render -` before the heredoc only when the user wants the page in the workspace or the render fails with `Cannot write the page`. `-o` names an HTML file, not a folder; the CLI creates missing parent directories. Use `AM_HOME` only when the whole data directory must move.
````

</details>

**依据 3 · 源码核查**：[src/render.js:43-67](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L43-L67)

图片和代码baseDir接口

<details>
<summary>查看原文（25行）</summary>

```text
// baseDir: where relative image paths are read from; codeDir: where relative code paths are read from (the folder the agent works in).
// knownImages / knownCode: what the page already embeds, the fallback when a file is gone.
// update: { latest, current, command, highlights } from pageUpdate in src/update.js when a newer version is known; the page then has a new-version button.
// closeAfter: the close_after_reply setting; the page then closes its tab a few seconds after the reply is copied (src/runtime/close-after-reply.js).
// scale: the reader's text size (src/themes/type-scale.js); 1 is the default, so it adds nothing to the page.
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 是否能以较低采用负担获得合格输出？

**研究主题**：效果与总成本

#### 完整回答

首次需安装Skill并核对Node，持续需写草稿、纠正组件/STE错误及保存页面，模型输入token仍存在。失败不会因一次渲染成功而免人工审核，原草稿与Markdown可作为退路。页面/语音等文件需清理，耗时与资源未知；常规页面与视频应分开估算，不能从作者小样本推算每次节约。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-77](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L58-L77)

测量与运行条件

<details>
<summary>查看原文（20行）</summary>

```text
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

Explainer videos save even more: about 18× fewer output tokens and 12× faster in [a small test](bench/README.md#explainer-videos).

## Install

You need [Node.js](https://nodejs.org/) 20 or newer. There is no `npm install` step. The CLI is bundled inside the skill. No Node.js yet? With the recommended install below, your agent asks you and then installs it.
```

</details>

**依据 2 · 作者声明**：[skills/answer-me-with-html/SKILL.md:88-95](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/skills/answer-me-with-html/SKILL.md#L88-L95)

纠错、替换与清理行为说明

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

#### 缺口

- 本任务的生成、纠错和审核总耗时未知
  **影响**：不能确认端到端更便宜
  **进一步探讨**：按等信息量草稿记录渲染重试和人工核对时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可复用的工程设计与维护条件是什么？

**研究主题**：工程质量与复用

#### 完整回答

解析、lint、组件渲染、主题和CSP分层清楚，错误带行号并集中raiseAll，适合借鉴为模型只写内容的编译管线。脚本hash与live脚本共享常量避免漂移；移植需要重做组件语法、资源内联和浏览器兼容，不能仅搬模板。源码与大量测试定义提供可检查接口，本轮未执行其测试，不称跨浏览器通过。

#### 证据与依据

**依据 1 · 源码核查**：[src/render.js:23-38](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L23-L38)

带位置错误

<details>
<summary>查看原文（16行）</summary>

```text
export class RenderError extends Error {
  constructor(message, { line, component, example } = {}) {
    super(message);
    this.name = 'RenderError';
    this.line = line;
    this.component = component;
    this.example = example;
  }
}

export class LintError extends Error {
  constructor(warnings) {
    super(`STE check failed (style: strict): ${warnings.length} warning${warnings.length === 1 ? '' : 's'}`);
    this.name = 'LintError';
    this.warnings = warnings;
  }
```

</details>

**依据 2 · 源码核查**：[src/render.js:48-80](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L48-L80)

先收集错误再生成页面

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

**依据 3 · 源码核查**：[src/csp.js:10-35](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/csp.js#L10-L35)

共享live脚本与hash策略

<details>
<summary>查看原文（26行）</summary>

```text
// The text between <script data-live> and </script> that `am serve` adds (src/serve.js). The page cannot know whether it will be
// served, and a meta policy applies on top of the server's headers, so every page pins this exact text. One constant for both sides
// keeps the hash from drifting from what the server sends.
export const LIVE_SCRIPT_BODY = `\n${LIVE_JS}`;

// CSP source expression for a script's text: base64 of the SHA-256 of its UTF-8 bytes (src/sha256.js, so the site's browser bundle can render pages too).
export const scriptHash = (text) => `'sha256-${sha256Base64(text)}'`;

// The page with one more inline script allowed, for a caller that adds a script of its own to a rendered page (the site's preview frames).
export const pinScript = (html, text) => html.replace(/(<meta http-equiv="Content-Security-Policy" content="[^"]*?script-src )/, `$1${scriptHash(text)} `);

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

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否让图形解释绑定原文证据而非仅优化外观？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是为图中节点/箭头附来源句子与可核对引用，使语义草稿和图形关系有可追溯约束。由确定渲染只保证结构、不保证事实推导，这可能比增加模板更能减少错误解释。取同一组架构问题，比较原版与带关系依据版的错误箭头发现率、额外token和审核时间；若发现率不改善或总负担超出收益则否定。当前未实现，不计入本版创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/render.js:65-80](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/src/render.js#L65-L80)

结构到输出的边界

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

**依据 2 · 作者声明**：[README.md:130-146](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/README.md#L130-L146)

解释与图形任务范围

<details>
<summary>查看原文（17行）</summary>

```text
| You ask | You get |
| :--- | :--- |
| "Explain the TCP three-way handshake" | A sequence diagram, a state diagram and a flag table |
| "How are the modules in this repo organized?" | A folder tree plus a call graph |
| "Redis or Memcached?" | A comparison table with ✓ and ✗, then a verdict |
| "What's wrong with this paragraph?" | Each sentence annotated, with the problem words and fixes |
| "How did Kubernetes come about?" | A timeline with the key moments highlighted |
| "Plan the cache change" | The real code from your files, and the open decisions as options you answer on the page |
| "How do I show hidden files with `ls`?" | No page. A one-line question gets a one-line answer |

The agent decides when a page is worth it: related concepts, multi-step flows, multi-way comparisons. You can also just say "explain it in HTML".

Pages are saved in `~/.answer-me-with-html/pages/`. The buttons in the top-right corner switch the theme and light/dark mode, collect your reply, and copy the Markdown that produced the page.

## How is this different from Archify or GenUI plugins?

[Archify](https://github.com/tt-a1i/archify) makes one interactive diagram from a JSON spec. GenUI plugins such as [dsh-genui](https://github.com/omdsh-dev/dsh-genui) show components inside one chat app. This skill answers the whole question as one page: text, tables, code and diagrams, from a Markdown draft, in any agent that can run a shell command. See the [full comparison](docs/compare.md).
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 什么任务值得可控试用，什么时候退回Markdown？

**研究主题**：采用判断

#### 完整回答

需要在协议或方案比较中交付单页材料的用户，可先选一份已有答案的短稿试渲染，并逐个核对图形关系与原文。若组件错误、图形误导或纠错时间超过直接Markdown，停止自动附页并回到原草稿；敏感文件不因可内联就自动加入输出。视频仅在明确请求且成本可接受时另试。

#### 证据与依据

**依据 1 · 作者声明**：[skills/answer-me-with-html/SKILL.md:30-45](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/skills/answer-me-with-html/SKILL.md#L30-L45)

适用与内部报告排除

<details>
<summary>查看原文（16行）</summary>

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
- Judge this by who receives the reply and what was asked for, not by the host or agent name.
```

</details>

**依据 2 · 作者声明**：[skills/answer-me-with-html/SKILL.md:88-94](https://github.com/QingYunA/answer-me-with-html/blob/f82dd6dce3ca95b0e565f8cffaf5eba23f4c995f/skills/answer-me-with-html/SKILL.md#L88-L94)

错误和替换退路

```text
4. Read the output:
   - `✓ <path>`: success. Whether the browser opens automatically depends on the user's settings (`am config`); `--no-open` affects only this run. A page with STE or code warnings never opens automatically.
   - `✗ L<line> …` + `Correct example:`: no page was written. The CLI lists every error of the draft at once, in line order (`✗ n errors in the draft`). Read all of them, fix each flagged line following its example, then render again.
   - `  draft: <path>`: the CLI saved your stdin draft there, and every `L<line>` in the output matches that file. Change only the flagged lines in that file with your file-edit tool; do not send a new heredoc. Then run `am render <path>`; when a page was written, add `--replace` or reuse `-o` as the rule on rendering again below says. The CLI deletes the saved draft once it renders with no warnings. A draft you passed as a file path is not copied: edit that file.
   - `code n warnings`: a code block is longer than 40 lines, or a diff hunk has a different number of lines than its `@@` header says. Cut the block or fix the header to the lines that make the point and render again, or keep it if every line matters.
   - `STE n warnings`: rewrite the flagged lines as suggested, then render again. Retry at most 2 rounds; if warnings remain, keep the last page and say so.
   - When rendering again after a `✓`, add `--replace <path from the last ✓ line>` for a page in the data directory's `pages/` or the temporary folder's `pages/`; the CLI deletes that page once the new one is written. For a page written with `-o`, reuse the same quoted `-o` HTML file path to overwrite it in place.
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
