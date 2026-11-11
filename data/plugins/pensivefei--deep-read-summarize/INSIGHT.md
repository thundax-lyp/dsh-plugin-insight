# Deep Read Summarize

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[51ce66b](https://github.com/PensiveFei/deep-read-summarize/tree/51ce66b585837d3bcd4489c0a5279317ac809a2e)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PensiveFei/deep-read-summarize) [![npm 30d 7,632](https://img.shields.io/static/v1?label=npm+30d&message=7%2C632&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deep-read-summarize) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/deep-read-summarize)
<!-- END META -->

> **功能**：对书籍、论文、网页和视频做分块精读，返回 Markdown 笔记、建议路径及质量核验。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把长文分块、核验和候选笔记组织在一次工作流里。

> **主要限制**：[Q03](#research-q03) 质量门能检查结构与报告，关键事实仍依赖实际原文和核验判断。

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
  - [Q01 · 精读流程解决什么反复工作？](#detail-section-11)
  - [Q02 · 工具如何运行和复用精读？](#detail-section-12)
  - [Q03 · 质量通过能证明笔记事实正确吗？](#detail-section-13)
  - [Q04 · 怎样限制第一次试用？](#detail-section-14)
  - [Q05 · 对摘录做独立位置比对能否降低误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长资料读者需要可回查的笔记与已知内容缺口。

人工分段阅读、摘录、检查原文及保存。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 精读工作流 | 整理长资料并生成候选笔记 | 主 Agent 负责实际保存 |
| 质量报告 | 定位缺块与核验结果 | 关键事实须回原文 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工作流与模型 | 必需 | 运行精读与核验 | 转回人工 |
| 原文可访问 | 必需 | 分块与核验 | 报告缺口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选公开可提取材料 | 原文可回读 |
| 运行 | 工具返回笔记与质量，主 Agent 保存 | 确认文件和引文 |
| 退出 | 缺口时改人工核对 | 保留原件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型和提取环境 | 准备来源与输出 | 耗时未知 |
| 持续 | 分块和核验模型用量 | 核对原文与保存 | 单份费用未知 |
| 失败 | 可能重复调用与缓存 | 定位失败块并重读 | 恢复成本未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 笔记组织 | 工具返回正文与核验 | 事实准确性 |
| 缺口识别 | 结构化覆盖失败 | 漏判和净节时 |

> **思考**：[Q03](#research-q03) 质量门能检查结构与报告，关键事实仍依赖实际原文和核验判断。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把长文分块、核验和候选笔记组织在一次工作流里。

[Q02](#research-q02) 工作流显式释放，缓存后检查文件哈希。[Q03](#research-q03) 缺块会降低质量状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 质量门能检查结构与报告，关键事实仍依赖实际原文和核验判断。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用公开材料并保持缓存关闭，核对实际文件和关键引文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定工具、缓存和质量源码，实际阅读质量与费用未测。

- 已检查：作者 README、包清单、源码路径 index.js、lib/quality.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查工具入口、跨次缓存及质量门，未运行模型或全量媒体解析。
- 下一步：在相同公开来源注入错引和缺页，比较报告、人工查证和费用。

**分析版本**

- **仓库**：[PensiveFei/deep-read-summarize](https://github.com/PensiveFei/deep-read-summarize)
- **版本号**：0.6.1（[固定提交 51ce66b](https://github.com/PensiveFei/deep-read-summarize/tree/51ce66b585837d3bcd4489c0a5279317ac809a2e)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对摘录做独立定位，可测量错引率是否下降。

在相同公开来源注入错引和缺页，比较报告、人工查证和费用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1978 | — | — | 33317 |
| .md | example | 4 | 558 | — | — | 16831 |
| .js | source | 20 | 3035 | 2490 | 383 | — |
| .js | test | 20 | 4160 | 3728 | 182 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/PensiveFei/deep-read-summarize/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/PensiveFei/deep-read-summarize/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PensiveFei/deep-read-summarize/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否用分块精读生成可保存、可核对的长文笔记，并识别质量门的证据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 精读流程解决什么反复工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要把长论文或转写材料整理成 Markdown 笔记的用户，通常手工分段、再核对引文和缺页。插件把工作流调用和质量结果放进同一工具返回，并把实际保存交给主 Agent。合格产物应有已保存文件、关键原文定位和已知缺口；仅看到工具成功还不够。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:55-66](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/README.md#L55-L66)

作者说明任务、保存责任和核对。

<details>
<summary>查看原文（12行）</summary>

````text
### 2. 发起一次精读

在 DSH 对话中输入，例如：

```text
请帮我精读这篇论文，并生成一份 Markdown 阅读笔记：
https://arxiv.org/abs/2307.09042
```

你也可以提供本地文件路径、网页或视频链接。如果需要，可以在请求中说明输出位置、希望保留的章节或是否需要时间戳。

支持插件工具的宿主会注册 `deep_read_summarize`；旧宿主使用插件提供的技能和 workflow 入口。精读工具返回笔记正文及建议路径，**实际写入文件需要由主代理完成**。生成后请确认文件已保存，并检查结果中是否报告内容缺口或质量问题。
````

</details>

**依据 2 · 源码核查**：[index.js:98-113](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/index.js#L98-L113)

工具输出正文和路径建议。

<details>
<summary>查看原文（16行）</summary>

```text
function readingTool(engine, defaults, registry) {
  return {
    name: 'deep_read_summarize',
    description: '深度精读书籍、论文、视频或网页，返回完整 Markdown 笔记、建议保存路径及原文质量核验结果。拿到结果后必须检查同名文件并保存 note；质量未通过或有内容缺口时必须报告。',
    parameters: {
      type: 'object', additionalProperties: false,
      properties: {
        input: { type: 'string', description: '内容链接或本地文件路径' },
        type: { type: 'string', description: 'auto 或已注册的解析器类型，默认 auto' },
        options: { type: 'object', additionalProperties: true, description: '覆盖当前 profile 的精读选项' }
      }, required: ['input']
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      // Never clip the note: the main agent needs its complete value to save it.
      render: function (args, value) { return [{ type: 'text', text: JSON.stringify(value) }]; }
```

</details>

#### 缺口

- 节时和人工审阅负担未测。
  **影响**：无法证明比短文直接读更有效。
  **进一步探讨**：比较同一长文的人工分段与工具笔记。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具如何运行和复用精读？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主就绪后注册模型工具，调用时启动工作流并在 finally 释放。打开可选跨次缓存时，先准备分块及文件哈希，根据来源、调用者提供的模型身份和提示词查缓存。恢复执行后再次检查来源哈希，变化则重新运行；只在通过质量检查时保存合适的未命中结果。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:177-199](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/index.js#L177-L199)

依赖就绪后注册工具。

<details>
<summary>查看原文（23行）</summary>

```text
function applyWithServiceLifecycle(ctx, config, registry) {
  let stopped = false;
  let releaseSkill = ctx.skills.register(skillDefinition(config, { registry: registry }));
  function replaceSkill(toolName) {
    if (typeof releaseSkill === 'function') releaseSkill();
    releaseSkill = undefined;
    releaseSkill = ctx.skills.register(skillDefinition(config, { registry: registry, toolName: toolName }));
  }
  function parentCanRegister() {
    // Public Cordis FiberState: LOADING=1, ACTIVE=2; never restore while unloading.
    return !stopped && (!ctx.fiber || ctx.fiber.state === 1 || ctx.fiber.state === 2);
  }
  // Cordis treats callbacks with a prototype as constructors. An arrow keeps
  // the returned cleanup function in its effect lifecycle.
  const child = ctx.inject(['tools', 'workflowEngine'], (ready) => {
    const tools = optionalService(ready, 'tools');
    const engine = optionalService(ready, 'workflowEngine');
    const releaseTool = tools.register(readingTool(engine, normalizeOptions(config), registry));
    try { replaceSkill('deep_read_summarize'); }
    catch (error) {
      if (typeof releaseTool === 'function') releaseTool();
      if (parentCanRegister()) replaceSkill();
      throw error;
```

</details>

**依据 2 · 源码核查**：[index.js:115-151](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/index.js#L115-L151)

生命周期、缓存键、变更复查与保存条件。

<details>
<summary>查看原文（37行）</summary>

```text
    async execute(args, exec) {
      if (!args || typeof args !== 'object' || Array.isArray(args)) throw new Error('[FATAL] expected an input object');
      if (Object.keys(args).some(function (key) { return ['input', 'type', 'options'].indexOf(key) < 0; })) throw new Error('[FATAL] unknown deep_read_summarize argument');
      if (typeof args.input !== 'string' || !args.input.trim()) throw new Error('[FATAL] args.input 必须是非空字符串');
      if (args.type !== undefined && typeof args.type !== 'string') throw new Error('[FATAL] args.type 必须是字符串');
      if (args.options !== undefined && (!args.options || typeof args.options !== 'object' || Array.isArray(args.options))) throw new Error('[FATAL] options 必须是对象');
      const options = normalizeWorkflowOptions(Object.assign({}, defaults, args.options));
      if (!exec || !exec.agent) throw new Error('deep_read_summarize requires a calling agent');
      if (exec.signal && exec.signal.aborted) throw new Error('deep_read_summarize was cancelled before start');
      const startArgs = { input: args.input, type: args.type || 'auto', options: options };
      const script = workflow.buildSelfContainedScript(registry);
      async function runWorkflow(runArgs) {
        const run = engine.start({ script: script, meta: workflow.meta,
          args: runArgs, parent: exec.agent, signal: exec.signal });
        try {
          const result = await run.result;
          if (result.stopReason !== 'completed') throw new Error('deep_read_summarize ' + result.stopReason + ': ' + (result.error || 'workflow did not complete'));
          if (!result.value || typeof result.value !== 'object' || Array.isArray(result.value)) throw new Error('deep_read_summarize returned an invalid workflow result');
          return result.value;
        } finally { await run.dispose(); }
      }
      if (!options.readCache) return runWorkflow(startArgs);
      const started = Date.now();
      const prepared = await runWorkflow(Object.assign({}, startArgs, { __cachePrepare: true }));
      if (!prepared.__cachePrepared) return prepared;
      if (!Array.isArray(prepared.chunkPrompts) || !Array.isArray(prepared.chunkPlan) || prepared.chunkPrompts.length !== prepared.chunkPlan.length || prepared.chunkPrompts.length > 12 || typeof prepared.tempFile !== 'string' || typeof prepared.tempDir !== 'string' || typeof prepared.selectedType !== 'string' || !prepared.fetched || typeof prepared.fetched !== 'object') throw new Error('deep_read_summarize returned invalid cache preparation');
      const digest = readCache.sourceHash(options.tempDir, prepared.tempDir, prepared.tempFile);
      const keys = prepared.chunkPrompts.map(function (prompt) { return readCache.keyFor(digest, options.readCacheIdentity, prompt, prepared.tempFile); });
      const hits = keys.map(function (key) { return key ? readCache.read(options.tempDir, key) : null; });
      const resume = { tempDir: prepared.tempDir, selectedType: prepared.selectedType, fetched: prepared.fetched, prompts: prepared.chunkPrompts, hits: hits };
      if (exec.signal && exec.signal.aborted) throw new Error('deep_read_summarize was cancelled before cache resume');
      const result = await runWorkflow(Object.assign({}, startArgs, { __cacheResume: resume }));
      // Never use notes matched against a source that changed during the run.
      if (digest && readCache.sourceHash(options.tempDir, prepared.tempDir, prepared.tempFile) !== digest) return runWorkflow(startArgs);
      if (!(exec.signal && exec.signal.aborted) && digest && result.qualityPassed && Array.isArray(result.__cacheReads)) {
        for (let i = 0; i < keys.length; i++) if (keys[i] && !hits[i] && readCache.portable(result.__cacheReads[i], prepared.tempDir)) readCache.write(options.tempDir, keys[i], result.__cacheReads[i]);
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 质量通过能证明笔记事实正确吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

代码要求核验者给出若干通过标志并提供每块 ID、范围和非空摘录。缺块、重复或不完整来源会使覆盖失败。这些规则可定位结构缺口，核验者对内容、引用和完整来源的判断仍需要用户回查。抓取或转写本身有偏差时，通过并不能证明最初材料准确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/quality.js:156-189](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/lib/quality.js#L156-L189)

结构化核验和缺块、缺尾处理。

<details>
<summary>查看原文（34行）</summary>

```text
  const ctx = context || {};
  const issues = [];
  const gates = ['sourceChecked', 'coverage', 'citationsReal', 'terminologyConsistent', 'languageConsistent'];
  const results = {};
  for (const gate of gates) {
    results[gate] = !!check && check[gate] === true;
    if (!results[gate]) issues.push('原文核验未通过或缺失：' + gate);
  }
  if (check && Array.isArray(check.issues)) {
    issues.push(...check.issues.filter(issue => typeof issue === 'string' && issue.trim()));
  }
  const plan = ctx.chunkPlan || [];
  const chunkChecks = check && Array.isArray(check.chunkChecks) ? check.chunkChecks : [];
  const seen = new Set();
  for (const evidence of chunkChecks) {
    const chunk = evidence && plan.find(item => item.id === evidence.chunkId);
    if (!chunk || seen.has(evidence.chunkId) || evidence.startLine !== chunk.startLine || evidence.endLine !== chunk.endLine ||
        typeof evidence.sourceExcerpt !== 'string' || !evidence.sourceExcerpt.trim() || evidence.covered !== true) {
      results.coverage = false;
      issues.push('分块核验证据无效、重复或未覆盖');
    } else seen.add(evidence.chunkId);
  }
  if (plan.some(chunk => !seen.has(chunk.id))) {
    results.coverage = false; issues.push('原文核验未逐一覆盖全部分块');
  }
  if (ctx.coverageComplete !== true) {
    results.coverage = false; issues.push('获取结果缺少有效 totalLines，无法确认原文尾部是否完整覆盖');
  }
  if (ctx.sourceComplete === false) {
    results.coverage = false;
    issues.push('来源不完整：' + (ctx.textSource === 'desc' ? '仅有视频简介，不能代替完整字幕或逐字稿' : '视频来源未经确认为完整字幕或逐字稿'));
  }
  if (ctx.failedChunkIds && ctx.failedChunkIds.length) {
    results.coverage = false; issues.push('精读仍有缺口，失败块：' + ctx.failedChunkIds.join(', '));
```

</details>

**依据 2 · 作者声明**：[README.md:86-95](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/README.md#L86-L95)

作者给出核验和来源限制。

<details>
<summary>查看原文（10行）</summary>

```text
## 结果能信到什么程度？

工作流会规范化分块范围，检查已知原文行号的覆盖情况；成稿后，程序检查格式和篇幅，并由独立核验代理读取取得的文本，检查分块覆盖与关键引文。核验结果可通过 `qualityPassed`、`qualityChecks` 和 `qualityEvidence` 查看。

这些检查有边界：

- **`qualityPassed` 不是事实正确性的证明。**覆盖和原文真实性判断仍依赖核验代理实际读取与判断；重要结论、数字和引用请自行复核。
- **取得全文不等于理解了全文。**复杂表格、公式、图片以及提取错误可能影响结果；来源不完整或分块失败时，结果会报告缺口。
- **字幕或转写不等于音频原文。**自动字幕和语音识别可能漏句、听错数字或否定词；核验笔记与逐字稿不能证明逐字稿本身准确。
- **视频时间戳不能凭空推算。**可定位性取决于取得的字幕或转写是否包含时间信息。
```

</details>

#### 缺口

- 真实错误报告的漏判率未知。
  **影响**：不能自动发布高影响笔记。
  **进一步探讨**：注入错引、缺段及误转写，统计检出和人工对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限制第一次试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用公开短论文和可恢复的输出目录试一次，确认宿主工作流可用、模型数据处理许可和笔记已实际保存。时间及费用随提取、分块和调用变化，明文缓存默认可保持关闭。发现错引、缺页或未经允许的数据流就停止，按原文手工整理。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:121-136](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/index.js#L121-L136)

需调用 Agent 和宿主引擎。

<details>
<summary>查看原文（16行）</summary>

```text
      const options = normalizeWorkflowOptions(Object.assign({}, defaults, args.options));
      if (!exec || !exec.agent) throw new Error('deep_read_summarize requires a calling agent');
      if (exec.signal && exec.signal.aborted) throw new Error('deep_read_summarize was cancelled before start');
      const startArgs = { input: args.input, type: args.type || 'auto', options: options };
      const script = workflow.buildSelfContainedScript(registry);
      async function runWorkflow(runArgs) {
        const run = engine.start({ script: script, meta: workflow.meta,
          args: runArgs, parent: exec.agent, signal: exec.signal });
        try {
          const result = await run.result;
          if (result.stopReason !== 'completed') throw new Error('deep_read_summarize ' + result.stopReason + ': ' + (result.error || 'workflow did not complete'));
          if (!result.value || typeof result.value !== 'object' || Array.isArray(result.value)) throw new Error('deep_read_summarize returned an invalid workflow result');
          return result.value;
        } finally { await run.dispose(); }
      }
      if (!options.readCache) return runWorkflow(startArgs);
```

</details>

**依据 2 · 作者声明**：[README.md:114-125](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/README.md#L114-L125)

缓存和模型数据流。

<details>
<summary>查看原文（12行）</summary>

```text
| `readCache` | `false` | 可选的跨次精读缓存；仅插件工具入口支持 |

开启 `readCache` 时，还必须提供 `readCacheIdentity`，写明供应商、固定模型版本及影响输出的设置；这些信息变化时需更换身份。该身份由调用者提供，宿主无法自动验证。缓存为本地明文，可能包含原文摘录；命中后仍会执行独立原文核验。

其他选项包括 `frontmatter`（`obsidian`、`generic`、`minimal`）和 `tempDir`。高级选项、取值范围、转写缓存和自定义解析器可参考[完整配置与技术参考](https://github.com/PensiveFei/deep-read-summarize/blob/main/docs/README-reference.zh.md)。

## 时间、费用与隐私

- **时间**取决于内容长度、获取方式、分块数量、模型和宿主并发。没有字幕的视频需要额外转写，首次使用还可能下载转写模型。
- **费用**取决于你配置的模型、输入与输出量；本项目不能保证固定的耗时或费用。
- **隐私**：本地语音转写在本机运行，但后续精读使用你在 DSH 中配置的模型。若使用云端模型，原文、字幕、笔记或相关上下文可能发送给对应服务商；请先确认其数据处理条款。
- **本地文件**：临时原文、转写和可选缓存可能保存在设备上；处理敏感资料前请确认目录权限与清理方式。
```

</details>

#### 缺口

- 资源用量与宿主实测缺失。
  **影响**：不能预测长文任务总成本。
  **进一步探讨**：在公开同长材料比较调用、存储和人工复核。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 对摘录做独立位置比对能否降低误判？

**研究主题**：新假设与验证

#### 完整回答

可增加每块摘录与已取得原文的字面匹配及原文件定位。它只能验证摘录来源，不能解释转写或事实本身。以错引和正确改写构造对照，若错误未减少或合理改写大量误拒，则需缩小匹配适用范围。

#### 证据与依据

**依据 1 · 源码核查**：[lib/quality.js:167-195](https://github.com/PensiveFei/deep-read-summarize/blob/51ce66b585837d3bcd4489c0a5279317ac809a2e/lib/quality.js#L167-L195)

已有块身份及核验结构可作定位输入。

<details>
<summary>查看原文（29行）</summary>

```text
  const plan = ctx.chunkPlan || [];
  const chunkChecks = check && Array.isArray(check.chunkChecks) ? check.chunkChecks : [];
  const seen = new Set();
  for (const evidence of chunkChecks) {
    const chunk = evidence && plan.find(item => item.id === evidence.chunkId);
    if (!chunk || seen.has(evidence.chunkId) || evidence.startLine !== chunk.startLine || evidence.endLine !== chunk.endLine ||
        typeof evidence.sourceExcerpt !== 'string' || !evidence.sourceExcerpt.trim() || evidence.covered !== true) {
      results.coverage = false;
      issues.push('分块核验证据无效、重复或未覆盖');
    } else seen.add(evidence.chunkId);
  }
  if (plan.some(chunk => !seen.has(chunk.id))) {
    results.coverage = false; issues.push('原文核验未逐一覆盖全部分块');
  }
  if (ctx.coverageComplete !== true) {
    results.coverage = false; issues.push('获取结果缺少有效 totalLines，无法确认原文尾部是否完整覆盖');
  }
  if (ctx.sourceComplete === false) {
    results.coverage = false;
    issues.push('来源不完整：' + (ctx.textSource === 'desc' ? '仅有视频简介，不能代替完整字幕或逐字稿' : '视频来源未经确认为完整字幕或逐字稿'));
  }
  if (ctx.failedChunkIds && ctx.failedChunkIds.length) {
    results.coverage = false; issues.push('精读仍有缺口，失败块：' + ctx.failedChunkIds.join(', '));
  }
  function normalize(value) { return typeof value === 'string' ? value.replace(/\s+/g, ' ').trim() : ''; }
  const citationChecks = check && Array.isArray(check.citationChecks) ? check.citationChecks : [];
  const requiredQuotes = (ctx.quotes || []).map(normalize);
  const verifiedQuotes = [];
  for (const citation of citationChecks) {
```

</details>

#### 缺口

- 附加匹配策略未试。
  **影响**：收益与误拒未知。
  **进一步探讨**：对同一注入题集做配对测量。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
