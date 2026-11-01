# Archify

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a406594](https://github.com/tt-a1i/archify/tree/a4065941f12be7967436261d9934784e381d423c)

<!-- BEGIN META -->
[![GitHub ★ 92,198](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92%2C198&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)
<!-- END META -->

> **功能**：将结构化图形与说明页渲染为可交互 HTML，并提供交付与证据检查。

> **亮点**：相对手工组织图形与检查，Skill 将结构化候选、交互 HTML 和绑定实际字节的阶段收据组合；不将模型、源码事实或浏览器本身算作其原创。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：有效来源位置和通过收据能否避免错误关系及误导视觉？关系无独立 sources，自动浏览器检查也不是人眼审阅，explainer 默认不运行该检查。[Q03](#research-q03)

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
  - [Q01 · 根项目提供什么、面向谁，与 DSH 子适配器和简单图有何区别？](#detail-section-11)
  - [Q02 · finalize 如何执行门禁并将候选、交付与浏览器证据绑定？](#detail-section-12)
  - [Q03 · 来源、关系和视觉质量在自动通过后仍有哪些盲区？](#detail-section-13)
  - [Q04 · 安装、执行和恢复需要哪些条件、费用和停止规则？](#detail-section-14)
  - [Q05 · 有什么未验证的增量假设，如何以原能力为基线对照？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要把系统或问题解释给他人的开发者与知识工作者，可以构造图表或说明页并逐项核对来源；根仓是 Skill 而非 DSH 原生插件。[Q01](#research-q01)

直接使用 Mermaid 或手写 HTML 配合人工事实清单可交付简单图；多类型交互、自动检查是否值得额外成本需同任务对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 结构化图形 | 将关系输出为交互 HTML | 事实需要人工核查 |
| finalize | 绑定候选、产物与检查收据 | explainer 默认不含浏览器检查 |
| 来源定位 | 检查固定提交、文件与行号 | 不证明关系蕴含或语义正确 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| Node >=18 与 Skill 文件 | 必需 | 运行 CLI 和渲染 | 无法运行对应命令 |
| 浏览器 | native 图检查必需；explainer 可选 | 自动浏览器检查 | 缺少相应证据 |
| 源仓和事实 | 仓库图需要 | 固定提交、路径和行号 | 无法证明来源 |
| 模型与人工 | Agent 工作流需要 | 创作与审阅 | 回退手写图和人工清单 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 确定 | 用户限定问题、事实和输出 | 不将猜测写成源码事实 |
| 创作 | Agent 固定候选及出处 | 核查调用、方向和范围 |
| 交付 | 运行对应 finalize 路径 | 失败按阶段处理，分清浏览器是否运行 |
| 审阅 | 用户核对语义与视觉 | 必要时人工查看，错误退回原稿 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node、模型、浏览器成本未知 | 安装与确认版本 | 目标环境未测 |
| 持续 | 模型与渲染资源未知 | 事实、关系与版面审核 | 净节时未知 |
| 恢复 | 重跑及存储成本未知 | 查看收据、锁与诊断 | 网络文件系统不在锁保证范围 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 产物身份 | 跨阶段比较摘要、字节和收据 | 真实故障恢复率 |
| 来源定位 | 提交、blob 和行号检查 | 引文是否支持关系和读者理解 |

> **思考**：有效来源位置和通过收据能否避免错误关系及误导视觉？关系无独立 sources，自动浏览器检查也不是人眼审阅，explainer 默认不运行该检查。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工组织图形与检查，Skill 将结构化候选、交互 HTML 和绑定实际字节的阶段收据组合；不将模型、源码事实或浏览器本身算作其原创。[Q01](#research-q01) [Q02](#research-q02)

deliver 内嵌验证，后续检查绑定同一产物和收据，失败停止；explainer 浏览器门禁是可选分支，目录锁不能推广为跨机器分布式事务。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

有效来源位置和通过收据能否避免错误关系及误导视觉？关系无独立 sources，自动浏览器检查也不是人眼审阅，explainer 默认不运行该检查。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用一条可核查请求链和隔离目录试用，按实际类型确认浏览器门禁，再由人核查每条关系与视觉；材料或环境不足时回到简单图。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持交付和证据绑定的代表路径；未运行 Skill、浏览器、模型或读者实验，关系级方案未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、archify/package.json、integrations/deepseek-harness/package.json、archify/SKILL.md、archify/bin/archify.mjs、archify/bin/finalize.mjs、archify/renderers/shared/repository-evidence.mjs、archify/references/repository-authoring.md、archify/references/delivery-contract.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根仓库固定提交的完整范围 inventory 按指定 Markdown 和 JS/TS 扩展名统计；抽读 Skill、CLI、finalize、来源检查及交付契约，未全面审计各 renderer、viewer、网络或执行目标。
- 下一步：对固定候选注入假关系和来源错配，比较 Mermaid 及现有节点来源；分别验证 native 和 explainer 门禁、浏览器缺失与文件替换，记录人工与模型成本。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：未声明（[固定提交 a406594](https://github.com/tt-a1i/archify/tree/a4065941f12be7967436261d9934784e381d423c)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设对关键关系独立记录调用位置、事实性质和人工核对状态，可减少图中假边；与现有节点引用和人工核对比较误报、漏检及耗时，不能改善时放弃。[Q05](#research-q05)

对固定候选注入假关系和来源错配，比较 Mermaid 及现有节点来源；分别验证 native 和 explainer 门禁、浏览器缺失与文件替换，记录人工与模型成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 169 | 28655 | — | — | 307233 |
| .mjs | source | 140 | 60753 | 55006 | 3134 | — |
| .js | source | 25 | 12042 | 11231 | 462 | — |
| .md | example | 8 | 197 | — | — | 2093 |
| .mjs | test | 287 | 88939 | 81793 | 1858 | — |
| .tsx | source | 1 | 4 | 3 | 1 | — |
| .ts | source | 3 | 76 | 64 | 7 | — |
| .md | test | 1 | 58 | — | — | 714 |

</details>

**活跃度**

[![Issue 未关闭 137](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=137&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 144](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=144&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 116](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=116&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构化图形与说明页如何从来源进入交付，自动证据与人工语义、视觉验收的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目提供什么、面向谁，与 DSH 子适配器和简单图有何区别？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

Archify 根仓库提供面向 Agent 的 Skill、图表和说明页渲染工具，而不是根包即 DSH 原生插件；仓内 integrations/deepseek-harness 是单独的宿主适配包。熟悉系统或需要解释问题的人可给 Agent 事实、代码范围或文字描述，获得可交互 HTML 并交给读者核对；没有仓库也可做说明性图。相对手写 Mermaid 或 HTML，它把多种结构化图形、来源和交付检查组织为工作流；模型、浏览器和事实本身不是它原创。固定仓内 archify 包为私有 3.2.0，Node 要求至少 18，不代表根仓就是可安装的 DSH 插件。实际理解提升、合格率和总耗时未对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-13](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/README.md#L11-L13)

作者描述交互 HTML 和适用内容。

```text
<p align="center"><strong>Official channels：</strong> <a href="https://archify.si">archify.si</a> · <a href="https://github.com/tt-a1i/archify">GitHub</a><br/>Archify is free and open source. Third-party online services and paid plans are operated by their respective providers and do not represent Archify. <a href="#official-services">Service details →</a></p>

<p align="center">Start with an idea, a question, or a plan. Describe it to your AI agent, and Archify turns it into an interactive HTML you can explore, customize, and share. From travel itineraries and learning maps to complex systems—make it your own.</p>
```

**依据 2 · 作者声明**：[README.md:59-76](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/README.md#L59-L76)

文字输入与仓库依据是两种使用路径。

<details>
<summary>查看原文（18行）</summary>

````text
### Install, then describe your idea

Works with Cursor, Claude Code, Codex CLI, and OpenCode. See installation options below for additional integrations.

```text
Install Archify for me by reading https://raw.githubusercontent.com/tt-a1i/archify/main/llms.txt
```

Send this to your agent:

```text
Use Archify to diagram a web request: Browser calls the API,
the API checks Redis, and a cache miss queries PostgreSQL and fills the cache.
```

Then continue: “Add authentication”, “Highlight the cache-miss path”, or “Switch to the light theme”.

**No repository is required:** start with a description, or ask your agent to read a repository for a source-backed architecture diagram.
````

</details>

**依据 3 · 作者声明**：[README.md:80-89](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/README.md#L80-L89)

作者描述说明页与引用。

<details>
<summary>查看原文（10行）</summary>

```text
## Ask a question, get a one-page answer

Not every answer is one diagram. Ask your agent to answer as a page and Archify builds an **explainer**: the conclusion first, then one panel per question, with tables, steps, charts, code and validated diagrams.

[![An explainer page: the answer first, then steps beside the sequence diagram they walk through](docs/assets/explainer-tls-en.png)](https://archify.si/cases/explainer/tls-first-visit.html)

- **Conclusion first.** The answer and its reasons lead; every panel takes one question.
- **Diagrams that explain.** Steps sit beside the diagram they walk through and light its parts as you read. Click any node to open the full interactive view.
- **Easy to check.** Claims cite numbered sources; repository excerpts are pinned to a commit and open in a source card.
- **Easy to share.** One HTML file with four styles and light or dark themes. Export a PNG, WebP or JPG long image, or print to PDF. Ask about any panel to get a follow-up your agent can use to revise just that panel.
```

</details>

**依据 4 · 源码核查**：[package.json:1-8](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/package.json#L1-L8)

私有根包及 Node 条件。

```text
{
  "name": "archify-repository",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
```

**依据 5 · 源码核查**：[archify/package.json:1-13](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/package.json#L1-L13)

Skill 包版本及 CLI。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "archify",
  "version": "3.2.0",
  "private": true,
  "type": "module",
  "description": "JSON-IR diagram renderers (architecture / workflow / sequence / dataflow / lifecycle / erd / class / tree / timeline / waterfall).",
  "license": "Apache-2.0",
  "bin": {
    "archify": "./bin/archify.mjs"
  },
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 6 · 源码核查**：[integrations/deepseek-harness/package.json:1-5](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/integrations/deepseek-harness/package.json#L1-L5)

DSH 是仓内单独适配包。

```text
{
  "name": "@tt-a1i/archify-dsh",
  "version": "1.1.0",
  "description": "Opt-in DeepSeek Harness Skill-only bundle for the Archify architecture-diagram skill.",
  "license": "MIT",
```

#### 缺口

- 没有同样内容、读者和作者的效果对照
  **影响**：不能推断比简单图更准确或更快
  **进一步探讨**：固定一条真实请求链，与 Mermaid 加人工清单比较

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · finalize 如何执行门禁并将候选、交付与浏览器证据绑定？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 解析类型、输入、输出、质量和可选 --browser-check 后调用 runFinalize。实现先计算候选实际字节的 SHA-256 与长度；deliver 内嵌 validate，随后运行严格 provenance check。对 native 图，接着运行 browser-check；explainer 默认只执行 deliver 和 check，显式 --browser-check 才追加浏览器门禁。各阶段的通过收据须符合类型、结果与身份契约；交付阶段核对冻结候选与落盘产物，后续阶段比对同一产物摘要、字节和 deliveryReceiptId，最终再检查产物及输入是否改变。首个非通过阶段停止，后续不作成功声明。这里是固定源码支持的机制，未在本轮执行候选或浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[archify/bin/archify.mjs:5888-5909](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/archify.mjs#L5888-L5909)

CLI 解析参数及显式浏览器选项。

<details>
<summary>查看原文（22行）</summary>

```text
async function commandFinalize(rawArgs) {
  const qualityArgs = extractQualityArgs(rawArgs);
  const repoArgs = extractRepoRootArgs(qualityArgs.rest);
  const outDirArgs = extractOutDirArgs(repoArgs.rest);
  const receiptArgs = extractFinalizeReceiptArgs(outDirArgs.rest);
  const candidateArgs = extractCandidateSha256Args(receiptArgs.rest);
  const writingArgs = extractExplainerWritingArgs(candidateArgs.rest);
  candidateArgs.rest = writingArgs.rest;
  const json = candidateArgs.rest.includes('--json');
  const knownOptions = new Set(['--json','--browser-check']);
  const unknown = candidateArgs.rest.filter((arg) => arg.startsWith('--') && !knownOptions.has(arg));
  if (unknown.length) rejectCliArgument(`Unknown finalize option "${unknown[0]}".`, {
    code: 'cli/unknown-option',
    subject: { option: unknown[0] },
    supportedFixes: ['remove the unknown option and retry'],
  });
  const positional = candidateArgs.rest.filter((arg) => !knownOptions.has(arg));
  const [type, input, output] = positional;
  if (!type || !input || !output || positional.length !== 3) rejectCliArgument(usage(), {
    code: 'cli/usage',
    supportedFixes: ['use: archify finalize <type> <input.json> <output.html> [options]'],
  });
```

</details>

**依据 2 · 源码核查**：[archify/bin/archify.mjs:5931-5954](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/archify.mjs#L5931-L5954)

调用 runFinalize 并设置浏览器门禁。

<details>
<summary>查看原文（24行）</summary>

```text
    const pathIdentityRuntime = await loadPathIdentityRuntime();
    result = await runFinalize({
      ...(preparedExplainer ? { preparedExplainer, env: { ...process.env, ARCHIFY_EXPLAINER_PREPARED: preparedBundlePath } } : {}),
      cliPath: fileURLToPath(import.meta.url),
      type,
      input,
      output,
      quality: qualityArgs.quality || 'showcase',
      repoRoot: repoArgs.repoRoot,
      writingMode: writingArgs.writingMode,
      browserCheck: candidateArgs.rest.includes('--browser-check'),
      candidateSha256: candidateArgs.candidateSha256,
      outDir: outDirArgs.outDir,
      receiptPath: receiptArgs.receiptPath,
      inspectDelivery: artifact => inspectArtifactDeliveryProvenance(artifact, true, pathIdentityRuntime),
      deliveryPaths: artifact => ({
        provenance: deliveryProvenancePath(artifact),
        pending: deliveryPendingPath(artifact),
        lock: deliverySidecarPath(artifact, '.delivery-lock.json'),
        directoryLock: path.join(path.dirname(deliveryProvenancePath(artifact)), DELIVERY_DIRECTORY_LOCK),
      }),
      runBrowserCheck: options => executeBrowserEvidence({
        ...options, command: 'browser-check', capture: false, requireProvenance: true,
      }),
```

</details>

**依据 3 · 源码核查**：[archify/bin/finalize.mjs:722-753](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L722-L753)

根据类型选择浏览器并读取候选身份。

<details>
<summary>查看原文（32行）</summary>

```text
export async function runFinalize({
  cliPath,
  type,
  input,
  output,
  quality = 'showcase',
  repoRoot,
  writingMode,
  candidateSha256,
  preparedExplainer,
  browserCheck = false,
  outDir,
  receiptPath,
  deliveryPaths = defaultDeliveryPaths,
  inspectDelivery,
  cwd = process.cwd(),
  env = process.env,
  runCommand = defaultRunner,
  runBrowserCheck,
  startUpdateCheck = startDeliveryUpdateCheck,
  resolveChrome = findChrome,
  createBrowser = (chromePath, options) => new ChromeVisualBrowser(chromePath, options),
} = {}) {
  if (!cliPath || !type || !input || !output) throw new Error('finalize requires cliPath, type, input, and output.');
  const needsBrowser = type !== 'explainer' || browserCheck;
  const started = process.hrtime.bigint();
  const startedAt = new Date().toISOString();
  const resolvedInput = path.resolve(input);
  const resolvedOutput = resolveOutputPath({ requestedOutput: output, inputPaths: [resolvedInput] }).outputPath;
  const resolvedOutDir = outDir === undefined ? undefined : resolveNativeOutputDirectory(outDir);
  const specification = identity(resolvedInput);
  if (candidateSha256 && specification.sha256 !== candidateSha256) {
```

</details>

**依据 4 · 源码核查**：[archify/bin/finalize.mjs:188-215](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L188-L215)

各阶段收据形状与 provenance 条件。

<details>
<summary>查看原文（28行）</summary>

```text
function validStageReceipt(stage, receipt, quality, options) {
  if (!isReceiptObject(receipt) || receipt.ok !== true) return false;
  if (receipt.status && receipt.status !== 'pass') return false;
  if (stage === 'validate') return receipt.command === 'validate' && Array.isArray(receipt.checks);
  if (stage === 'deliver') {
    return receipt.command === 'deliver'
      && receipt.schemaVersion === 1
      && validReceiptId(receipt.receiptId)
      && isReceiptObject(receipt.specification)
      && validIdentity(receipt.specification)
      && validIdentity(receipt.artifact)
      && validDeliveryValidation(receipt, quality, options);
  }
  if (stage === 'check') {
    return validIdentity(receipt.artifact)
      && allChecksPassed(receipt.checks)
      && receipt.provenance === 'current'
      && validReceiptId(receipt.deliveryReceiptId)
      && validCheckComposition(receipt, quality);
  }
  return receipt.command === 'browser-check'
    && receipt.schemaVersion === 1
    && receipt.status === 'pass'
    && receipt.evidenceKind === 'automated-browser'
    && validIdentity(receipt.artifact)
    && receipt.provenance === 'current'
    && validReceiptId(receipt.deliveryReceiptId)
    && receipt.containment?.status === 'pass'
```

</details>

**依据 5 · 源码核查**：[archify/bin/finalize.mjs:267-299](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L267-L299)

交付收据匹配候选和产物。

<details>
<summary>查看原文（33行）</summary>

```text
function stageBindingDiagnostic({ stage, receipt, expectedArtifact, expectedReceiptId, output, specification, type, deliveryValidation }) {
  if (stage === 'deliver') {
    if (receipt.type !== type) {
      return {
        code: 'finalize/delivery-type-mismatch',
        severity: 'error',
        message: 'The delivery command reported a different diagram type than finalize requested.',
        subject: { stage: 'deliver', artifact: output },
        evidence: { expectedType: type, actualType: receipt.type },
        supportedFixes: ['rerun finalize with a delivery command for the requested diagram type'],
      };
    }
    if (!identitiesMatch(receipt.specification, specification)) {
      return {
        code: 'finalize/candidate-changed-during-delivery',
        severity: 'error',
        message: 'The delivery command froze a different candidate than finalize started with.',
        subject: { stage: 'validate', candidate: specification.path },
        evidence: {
          expectedSha256: specification.sha256,
          actualSha256: receipt.specification?.sha256,
          expectedBytes: specification.bytes,
          actualBytes: receipt.specification?.bytes,
        },
        supportedFixes: ['restore the frozen candidate and rerun finalize'],
      };
    }
    if ((!receipt.output || !pathsAlias(receipt.output, output)) || !identitiesMatch(receipt.artifact, identity(output))) {
      return identityMismatchDiagnostic({
        stage,
        expected: receipt.artifact,
        actual: identity(output),
        expectedReceiptId: receipt.receiptId,
```

</details>

**依据 6 · 源码核查**：[archify/bin/finalize.mjs:309-337](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L309-L337)

后续证据与产物和收据 ID 绑定。

<details>
<summary>查看原文（29行）</summary>

```text
  if (stage === 'check' && deliveryValidation?.checkCount !== receipt.checks.length) {
    return {
      code: 'finalize/delivery-validation-mismatch',
      severity: 'error',
      message: 'The delivery validation count does not match the complete checker receipt for the delivered artifact.',
      subject: { stage: 'check', artifact: output },
      evidence: {
        deliveryCheckCount: deliveryValidation?.checkCount,
        checkerCheckCount: receipt.checks.length,
      },
      supportedFixes: ['restore the complete delivery validation receipt and rerun finalize from the frozen candidate'],
    };
  }
  const receiptArtifactPath = receipt.artifact?.path;
  const receiptFile = receipt.file;
  const pathMatchesOutput = stage === 'check'
    ? typeof receiptFile === 'string' && pathsAlias(receiptFile, output)
    : typeof receiptArtifactPath === 'string' && pathsAlias(receiptArtifactPath, output);
  if (!pathMatchesOutput
      || !identitiesMatch(receipt.artifact, expectedArtifact)
      || receipt.deliveryReceiptId !== expectedReceiptId) {
    return identityMismatchDiagnostic({
      stage,
      expected: expectedArtifact,
      actual: receipt.artifact,
      expectedReceiptId,
      actualReceiptId: receipt.deliveryReceiptId,
      output,
    });
```

</details>

**依据 7 · 源码核查**：[archify/bin/finalize.mjs:833-846](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L833-L846)

选择实际执行阶段。

<details>
<summary>查看原文（14行）</summary>

```text
  try {
    let exitCode = 0;
    for (const stage of (needsBrowser ? ['deliver', 'check', 'browser-check'] : ['deliver','check'])) {
      const stageStarted = process.hrtime.bigint();
      const args = stageArguments({
        stage,
        type,
        input: resolvedInput,
        output: resolvedOutput,
        quality,
        repoRoot,
        writingMode,
        outDir: resolvedOutDir,
      });
```

</details>

**依据 8 · 源码核查**：[archify/bin/finalize.mjs:950-979](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L950-L979)

validate 记录为 deliver 内嵌阶段。

<details>
<summary>查看原文（30行）</summary>

```text
      if (stage === 'deliver' && status === 'pass') {
        // Non-blocking warnings (for example locale fallbacks) stay visible in
        // a passing receipt; a later failing gate replaces them.
        receipt.diagnostics = (stageReceipt.diagnostics || []).filter((entry) => entry?.severity === 'warning');
        receipt.stages.validate = {
          status: 'pass',
          exitCode: 0,
          durationMs: null,
          execution: 'embedded-in-deliver',
          command,
          receipt: {
            schemaVersion: 1,
            ok: true,
            command: 'validate',
            specification: stageReceipt.specification,
            validation: stageReceipt.validation,
          },
        };
        receipt.stages.deliver = stageEntry;
      } else if (stage === 'deliver') {
        const validationFailed = stageDiagnostics?.some((diagnostic) => diagnostic.code === 'finalize/candidate-changed-during-delivery')
          || ['input', 'render', 'check'].includes(stageReceipt?.stage);
        receipt.stages.validate = validationFailed ? {
          ...stageEntry,
          status: 'fail',
          durationMs: null,
          execution: 'embedded-in-deliver',
        } : { status: 'not-run', execution: 'embedded-in-deliver' };
        receipt.stages.deliver = validationFailed
          ? { status: 'not-run', execution: 'blocked-by-validate' }
```

</details>

**依据 9 · 源码核查**：[archify/bin/finalize.mjs:997-1007](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L997-L1007)

首个失败时终止后续阶段。

<details>
<summary>查看原文（11行）</summary>

```text
      if (status !== 'pass') {
        exitCode = status === 'skipped' ? 2 : (code || 1);
        receipt.status = status;
        receipt.diagnostics = consolidateDiagnostics(
          stageDiagnostics || failureDiagnostics(stage, result, stageReceipt, quality),
        );
        receipt.failedStage = stage === 'deliver'
          && receipt.stages.validate.status === 'fail' ? 'validate' : stage;
        break;
      }
      persistReceipts();
```

</details>

**依据 10 · 源码核查**：[archify/bin/finalize.mjs:1010-1043](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L1010-L1043)

最终复核交付和冻结候选。

<details>
<summary>查看原文（34行）</summary>

```text
    receipt.ok = exitCode === 0;
    receipt.status = receipt.ok ? 'pass' : receipt.status === 'running' ? 'fail' : receipt.status;
    if (receipt.ok) {
      const deliveryReceipt = receipt.stages.deliver?.receipt;
      const diagnostic = finalArtifactDiagnostic({
        output: resolvedOutput,
        expectedArtifact: deliveryReceipt?.artifact,
        expectedReceiptId: deliveryReceipt?.receiptId,
        type,
        deliveryPath: deliveryPaths(resolvedOutput).provenance,
        inspectDelivery,
      });
      if (diagnostic) {
        exitCode = 1;
        receipt.ok = false;
        receipt.status = 'fail';
        receipt.failedStage = 'finalize';
        receipt.diagnostics = [diagnostic];
      }
    }
    if (receipt.ok && !identitiesMatch(specification, identity(resolvedInput))) {
      exitCode = 1;
      receipt.ok = false;
      receipt.status = 'fail';
      receipt.failedStage = 'finalize';
      receipt.diagnostics = [{
        code: 'finalize/candidate-changed', severity: 'error',
        message: 'The frozen candidate changed before the final handoff.',
        subject: { candidate: resolvedInput },
        evidence: { expected: specification, actual: identity(resolvedInput) },
        supportedFixes: ['restore the frozen candidate, or finalize the edited candidate as a new attempt'],
      }];
    }
    receipt.artifact = receipt.ok
```

</details>

#### 缺口

- 真实宿主、文件系统故障及浏览器未执行
  **影响**：不能声称本轮交付通过或异常恢复已验证
  **进一步探讨**：隔离目录使用固定候选注入更换文件、失败阶段和浏览器缺失

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源、关系和视觉质量在自动通过后仍有哪些盲区？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

仓库创作规范要求追实际调用、状态及副作用，并标注未知；源码校验使用固定提交检查引用路径为 blob、读取内容并检查行号范围，但这只能证明引文位置可解析，不自动证明引文蕴含所画关系。规范将 sources 赋给组件、节点、参与者等主要元素，关系与消息没有独立 sources，相关证据需放在负责节点或卡片，因此节点有出处并不意味着每条箭头的语义被机械验证。普通通过不等于人工视觉验收：native browser-check 是自动检查，Skill 明确通过不自动截图，感知审阅按需进行；explainer 默认甚至不执行 browser-check。没有真实任务或读者实验，不能推断图的准确性、可读性和视觉质量。

#### 证据与依据

**依据 1 · 作者声明**：[archify/references/repository-authoring.md:27-60](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/repository-authoring.md#L27-L60)

作者要求追踪实际入口、所有权与未知。

<details>
<summary>查看原文（34行）</summary>

```text
2. **Map the slice.** Use project instructions, manifests, entry points,
   registrations, and deployment configuration to locate candidate runtime
   units. Read the entry, configuration, and modules relevant to the request.
   Follow imports and call sites
   until the requested responsibility reaches its actual input, output, or
   side effect. Read a small connected slice instead of scanning the repository
   for a convenient label.

3. **Trace ownership.** Derive runtime and I/O relationships from the observed
   actor, operation, and target at their call sites; deployment and trust
   relationships use the corresponding configuration or enforcement evidence. Distinguish the controller requesting
   an operation from the runtime that executes it and the store receiving bytes.
   For a file or database edge, the source must identify its actual reader or
   writer; a responsibility statement such as “maintains tasks” does not prove
   direct I/O. Keep these facts with the source locations while reading, without
   a separate planning artifact. Choose which distinctions need separate
   nodes using [Composition and meaning](authoring-defaults.md#composition-and-meaning);
   discovering an implementation role does not automatically add it to the overview.
   A configured provider, an injected adapter, a local stub, and a durable
   service are different claims; label the one the source supports.

4. **Record evidence while reading.** Keep exact repository-relative paths and
   inclusive line ranges for each component and meaningful relationship. Follow
   actual branches, retries, fallbacks, and error handling. A function that is
   exported or configured but never called by the normal path is an optional
   capability, not a required runtime edge. For a claim about authoritative
   state change or control ownership, trace to the actual write or execution
   site and the conditions that permit it; an upstream caller alone does not
   establish those conditions.

5. **Name uncertainty.** Write unresolved questions beside the claim they
   affect: for example, “`writeFile` is called here; durability is unknown.”
   Resolve a question by reading the next relevant source range or preserve it
   as an explicit unknown. Never turn a label, package description, or config
```

</details>

**依据 2 · 作者声明**：[archify/references/repository-authoring.md:76-83](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/repository-authoring.md#L76-L83)

仅主要元素携带 sources，关系证据需附在节点。

```text
## Evidence by diagram type

Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
```

**依据 3 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:149-169](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/renderers/shared/repository-evidence.mjs#L149-L169)

仓库证据需固定完整提交。

<details>
<summary>查看原文（21行）</summary>

```text
export function hasRepositoryEvidence(diagramType, diagram) {
  const authored = evidenceNodes(diagramType, diagram);
  if (!authored) return false;
  return Boolean(diagram?.meta?.repository) || authored.nodes.some((node) => Array.isArray(node?.sources) && node.sources.length);
}

export function verifyRepositoryEvidence(diagramType, diagram, repoRootInput) {
  if (!hasRepositoryEvidence(diagramType, diagram)) return null;
  const { collection, nodes: authoredNodes } = evidenceNodes(diagramType, diagram);

  const repository = diagram.meta?.repository;
  if (!repository) evidenceFailure('repository-evidence/repository-required', 'Repository evidence requires /meta/repository.', {
    subject: { path: '/meta/repository', diagramType, collection },
    supportedFixes: [`add the pinned repository metadata or remove /${collection} sources`],
  });
  if (!FULL_SHA_RE.test(repository.revision || '')) {
    evidenceFailure('repository-evidence/revision-invalid', '/meta/repository/revision must be a full 40-character commit SHA.', {
      subject: { path: '/meta/repository/revision' },
      evidence: { revision: repository.revision },
      supportedFixes: ['pin one full 40-character commit SHA'],
    });
```

</details>

**依据 4 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:305-313](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/renderers/shared/repository-evidence.mjs#L305-L313)

验证固定对象为 blob。

```text
        }
        const object = `${revision}:${source.path}`;
        const prefetched = prefetchedBlobs ? prefetchedBlobs.get(object) : undefined;
        const objectIsBlob = prefetched
          ? !prefetched.missing && prefetched.type === 'blob'
          : (() => {
            const type = runGit(realRoot, ['cat-file', '-t', object]);
            return type.status === 0 && type.stdout.trim() === 'blob';
          })();
```

**依据 5 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:336-355](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/renderers/shared/repository-evidence.mjs#L336-L355)

读取固定对象并核查行号范围。

<details>
<summary>查看原文（20行）</summary>

```text
        if (source.line) {
          const content = prefetched && Object.hasOwn(prefetched, 'content')
            ? { status: 0, stdout: prefetched.content }
            : runGit(realRoot, ['show', object]);
          if (content.status !== 0) evidenceFailure('repository-evidence/file-unreadable', `${where} could not be read at revision ${revision}.`, {
            subject: { path: where, ...nodeSubject },
            evidence: { sourcePath: source.path, revision },
            supportedFixes: ['verify the pinned blob is readable in the local checkout'],
          });
          const lineCount = sourceLineCount(content.stdout);
          const requestedLine = source.endLine || source.line;
          if (requestedLine > lineCount) {
            evidenceFailure('repository-evidence/line-out-of-range', `${at} requests line ${requestedLine}, but ${source.path} has ${lineCount} lines at revision ${revision}.`, {
              subject: { path: at, ...nodeSubject },
              evidence: { sourcePath: source.path, requestedLine, lineCount, revision },
              supportedFixes: ['use a line range that exists at the pinned revision'],
            });
          }
        }
        verified.push({ ...source, ...(linkMode === 'web' ? { href: repositorySourceHref(location.provider, location.url, revision, source) } : {}) });
```

</details>

**依据 6 · 作者声明**：[archify/SKILL.md:89-99](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/SKILL.md#L89-L99)

自动浏览器证据与可选感知审阅不同。

<details>
<summary>查看原文（11行）</summary>

```text
Use the `finalize` command above for the first candidate and after a repair.

`finalize` stops at the first non-passing gate. Its compact stdout and `<output-stem>.finalize-summary.json` are ordinary evidence. A passing run creates no screenshots and reports `visualReview: "not-requested"`.

When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.

Read [Delivery contract](references/delivery-contract.md) for failed gates, standalone commands, provenance/recovery, repeated delivery, exports, or opening. Native diagram recovery follows `deliver` → strict provenance `check` → `browser-check`; captures require strict provenance. Explainer delivery uses validate, deliver and check as described in its authoring guide.
```

</details>

**依据 7 · 源码核查**：[archify/bin/finalize.mjs:722-746](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L722-L746)

explainer 默认不启浏览器检查。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runFinalize({
  cliPath,
  type,
  input,
  output,
  quality = 'showcase',
  repoRoot,
  writingMode,
  candidateSha256,
  preparedExplainer,
  browserCheck = false,
  outDir,
  receiptPath,
  deliveryPaths = defaultDeliveryPaths,
  inspectDelivery,
  cwd = process.cwd(),
  env = process.env,
  runCommand = defaultRunner,
  runBrowserCheck,
  startUpdateCheck = startDeliveryUpdateCheck,
  resolveChrome = findChrome,
  createBrowser = (chromePath, options) => new ChromeVisualBrowser(chromePath, options),
} = {}) {
  if (!cliPath || !type || !input || !output) throw new Error('finalize requires cliPath, type, input, and output.');
  const needsBrowser = type !== 'explainer' || browserCheck;
```

</details>

#### 缺口

- 未做语义错误注入、视觉审阅或读者研究
  **影响**：无法证明每条关系和解释正确
  **进一步探讨**：对固定源代码图注入假边、错方向和视觉缺陷并独立复核

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、执行和恢复需要哪些条件、费用和停止规则？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 Node 的 Skill 和文件系统；native 图的标准 finalize 路径还需要可用 Chromium，explainer 是否检查浏览器取决于显式参数。代码分析需要被许可读取且可固定提交的材料，模型和人工核验另有费用与工时。交付协议描述同一物理目录串行锁、独占创建、待处理日志与明确 stale-lock 恢复；源码对活跃和已失效锁分别拒绝，不能把存在锁当自动清除许可。文档明确其面向本地协作进程，不声称网络文件系统上的分布式锁正确。建议熟悉源系统者先以一条请求链、无敏感数据和独立目录试用；若关键关系无依据、浏览器缺失或修复成本超过简单图，保留原稿并退回 Mermaid/人工审阅。总费用、工时和恢复可靠性未实测。

#### 证据与依据

**依据 1 · 源码核查**：[archify/package.json:1-13](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/package.json#L1-L13)

Node 版本与 Skill 包。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "archify",
  "version": "3.2.0",
  "private": true,
  "type": "module",
  "description": "JSON-IR diagram renderers (architecture / workflow / sequence / dataflow / lifecycle / erd / class / tree / timeline / waterfall).",
  "license": "Apache-2.0",
  "bin": {
    "archify": "./bin/archify.mjs"
  },
  "engines": {
    "node": ">=18"
  },
```

</details>

**依据 2 · 源码核查**：[archify/bin/finalize.mjs:722-746](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/finalize.mjs#L722-L746)

native 与 explainer 浏览器条件。

<details>
<summary>查看原文（25行）</summary>

```text
export async function runFinalize({
  cliPath,
  type,
  input,
  output,
  quality = 'showcase',
  repoRoot,
  writingMode,
  candidateSha256,
  preparedExplainer,
  browserCheck = false,
  outDir,
  receiptPath,
  deliveryPaths = defaultDeliveryPaths,
  inspectDelivery,
  cwd = process.cwd(),
  env = process.env,
  runCommand = defaultRunner,
  runBrowserCheck,
  startUpdateCheck = startDeliveryUpdateCheck,
  resolveChrome = findChrome,
  createBrowser = (chromePath, options) => new ChromeVisualBrowser(chromePath, options),
} = {}) {
  if (!cliPath || !type || !input || !output) throw new Error('finalize requires cliPath, type, input, and output.');
  const needsBrowser = type !== 'explainer' || browserCheck;
```

</details>

**依据 3 · 源码核查**：[archify/bin/archify.mjs:136-155](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/archify.mjs#L136-L155)

物理目录锁路径。

<details>
<summary>查看原文（20行）</summary>

```text
function deliveryLockPath(artifactPath) {
  // A directory-wide mutex is deliberately conservative. Future 8.3, case,
  // and Unicode aliases cannot be assigned a sound canonical filename before
  // the artifact exists, so a per-artifact lock can split one delivery into
  // multiple owners. Provenance and pending journals remain artifact-specific.
  const artifact = path.resolve(artifactPath);
  let directory;
  try {
    directory = path.dirname(fs.realpathSync.native(artifact));
  } catch (error) {
    if (error?.code !== 'ENOENT' && error?.code !== 'ENOTDIR') throw error;
    const authoredDirectory = path.dirname(artifact);
    try {
      directory = fs.realpathSync.native(authoredDirectory);
    } catch (directoryError) {
      if (directoryError?.code !== 'ENOENT' && directoryError?.code !== 'ENOTDIR') throw directoryError;
      directory = authoredDirectory;
    }
  }
  return path.join(directory, DELIVERY_DIRECTORY_LOCK);
```

</details>

**依据 4 · 源码核查**：[archify/bin/archify.mjs:194-214](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/bin/archify.mjs#L194-L214)

活跃和失效锁分别拒绝。

<details>
<summary>查看原文（21行）</summary>

```text
    lock = JSON.parse(captured.content.buffer.toString('utf8'));
    if (lock?.schemaVersion !== 1 || !Number.isSafeInteger(lock.pid) || lock.pid <= 0
      || typeof lock.receiptId !== 'string'
      || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(lock.receiptId)) {
      throw new Error('Unrecognized delivery lock.');
    }
  } catch {
    throw deliveryLockInvalid(lockPath);
  } finally {
    if (captured?.binding) releaseRegularFileBinding(captured.binding);
  }
  if (processIsRunning(lock.pid)) {
    throw Object.assign(new Error(`Another delivery attempt owns "${output}" through lock "${lockPath}".`), {
      deliveryLockCode: 'delivery/concurrent-attempt',
      deliveryLockPath: lockPath,
    });
  }
  throw Object.assign(new Error(`A stale delivery lock remains at "${lockPath}"; recover it serially before retrying.`), {
    deliveryLockCode: 'delivery/lock-stale',
    deliveryLockPath: lockPath,
    deliveryLockOwner: { pid: lock.pid, receiptId: lock.receiptId },
```

</details>

**依据 5 · 作者声明**：[archify/references/delivery-contract.md:59-83](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/delivery-contract.md#L59-L83)

独占锁和显式恢复契约。

<details>
<summary>查看原文（25行）</summary>

```text
`deliver` acquires the lock by exclusive `open(..., "wx")` before creating or
replacing the recovery journal. A successful exclusive create yields an
internal opaque ownership capability bound to that attempt. Journal creation,
failed-provenance recording, pair commit, rollback, journal finalization, and
lock release each verify the current capability inside the operation that
would mutate shared state. A rejected contender does not create a journal or
write failed provenance.

An existing directory or legacy lock is handled without automatic recovery:

| Observed lock state | Required `deliver` result |
| --- | --- |
| No directory entry | Attempt exclusive creation; only its success grants ownership. |
| Valid schema-v1 lock whose PID is running, or whose death cannot be established | Exit 1 with `delivery/concurrent-attempt`; preserve every shared path. |
| Valid schema-v1 lock whose PID is known to have exited | Exit 1 with `delivery/lock-stale`; preserve the lock, artifact, journal, and current provenance exactly. |
| Unreadable, malformed, symlink, dangling symlink, directory, or other non-regular lock entry | Exit 1 with `delivery/lock-invalid`; preserve the entry and every other shared path. |
| An acquired capability no longer matches the current lock or journal | Exit 1 with `delivery/ownership-lost`; stop all shared-path mutation. |
| The matching owner cannot remove its lock | Exit 1 with `delivery/lock-release`; preserve the lock. |

A `delivery/lock-stale` diagnostic identifies the absolute output and lock
paths plus the original PID and receipt ID. Recovery is deliberately explicit
and serial: stop all delivery attempts for that physical output directory,
confirm that no active delivery owns it and that the reported stale entry has
not been replaced, remove only the reported lock, then rerun `deliver`. Do not
remove an artifact, current provenance, or pending journal as part of
```

</details>

**依据 6 · 作者声明**：[archify/references/delivery-contract.md:86-94](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/delivery-contract.md#L86-L94)

本地协作范围及网络文件系统限制。

```text
The lock protocol targets Node.js 18 or later on a local filesystem with
cooperating Archify processes. PID, receipt, and file-identity comparisons are
defensive checks, not an atomic compare-and-swap. Compatibility fences cover
the requested spelling and an existing physical-target spelling; they cannot
enumerate arbitrary hard-link names or previously unknown filesystem aliases,
so mixed-version delivery through such aliases remains out of scope. This
contract does not claim distributed-lock correctness on NFS, SMB, or other
network filesystems, and it cannot prevent an external process that ignores
the protocol from replacing shared paths.
```

#### 缺口

- 目标机器、浏览器、模型费用及恢复结果未测
  **影响**：不能估算单位合格图成本或断言跨文件系统可靠
  **进一步探讨**：在可丢弃目录记录真实依赖、失败与审阅时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 有什么未验证的增量假设，如何以原能力为基线对照？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有仓库证据检查已经核验固定提交、路径与行号，创作指南也要求人工追踪关系；关系并无独立 sources 字段，相关位置附着在节点或卡片。未验证假设：在创作阶段为每条关键关系提供独立的调用位置、事实类型及作者核对状态，并在审阅界面标识缺口，或可让人工更早发现方向和所有权错误。该提议不是代码自动理解或现有能力，不能保证事实正确，也可能增加噪声和标注负担。对相同仓库切片注入伪调用、颠倒方向和不相关有效行，对照现有节点引用加人工检查，记录假边漏检、误报和作者时间；若漏检无改善、误报过多或额外成本超过收益即否定。

#### 证据与依据

**依据 1 · 作者声明**：[archify/references/repository-authoring.md:35-55](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/repository-authoring.md#L35-L55)

作者要求追踪调用、I/O 与状态所有权。

<details>
<summary>查看原文（21行）</summary>

```text
3. **Trace ownership.** Derive runtime and I/O relationships from the observed
   actor, operation, and target at their call sites; deployment and trust
   relationships use the corresponding configuration or enforcement evidence. Distinguish the controller requesting
   an operation from the runtime that executes it and the store receiving bytes.
   For a file or database edge, the source must identify its actual reader or
   writer; a responsibility statement such as “maintains tasks” does not prove
   direct I/O. Keep these facts with the source locations while reading, without
   a separate planning artifact. Choose which distinctions need separate
   nodes using [Composition and meaning](authoring-defaults.md#composition-and-meaning);
   discovering an implementation role does not automatically add it to the overview.
   A configured provider, an injected adapter, a local stub, and a durable
   service are different claims; label the one the source supports.

4. **Record evidence while reading.** Keep exact repository-relative paths and
   inclusive line ranges for each component and meaningful relationship. Follow
   actual branches, retries, fallbacks, and error handling. A function that is
   exported or configured but never called by the normal path is an optional
   capability, not a required runtime edge. For a claim about authoritative
   state change or control ownership, trace to the actual write or execution
   site and the conditions that permit it; an upstream caller alone does not
   establish those conditions.
```

</details>

**依据 2 · 作者声明**：[archify/references/repository-authoring.md:76-83](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/references/repository-authoring.md#L76-L83)

已有节点来源和关系没有独立 sources。

```text
## Evidence by diagram type

Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
```

**依据 3 · 源码核查**：[archify/renderers/shared/repository-evidence.mjs:336-355](https://github.com/tt-a1i/archify/blob/a4065941f12be7967436261d9934784e381d423c/archify/renderers/shared/repository-evidence.mjs#L336-L355)

现有引用验证路径和行号范围。

<details>
<summary>查看原文（20行）</summary>

```text
        if (source.line) {
          const content = prefetched && Object.hasOwn(prefetched, 'content')
            ? { status: 0, stdout: prefetched.content }
            : runGit(realRoot, ['show', object]);
          if (content.status !== 0) evidenceFailure('repository-evidence/file-unreadable', `${where} could not be read at revision ${revision}.`, {
            subject: { path: where, ...nodeSubject },
            evidence: { sourcePath: source.path, revision },
            supportedFixes: ['verify the pinned blob is readable in the local checkout'],
          });
          const lineCount = sourceLineCount(content.stdout);
          const requestedLine = source.endLine || source.line;
          if (requestedLine > lineCount) {
            evidenceFailure('repository-evidence/line-out-of-range', `${at} requests line ${requestedLine}, but ${source.path} has ${lineCount} lines at revision ${revision}.`, {
              subject: { path: at, ...nodeSubject },
              evidence: { sourcePath: source.path, requestedLine, lineCount, revision },
              supportedFixes: ['use a line range that exists at the pinned revision'],
            });
          }
        }
        verified.push({ ...source, ...(linkMode === 'web' ? { href: repositorySourceHref(location.provider, location.url, revision, source) } : {}) });
```

</details>

#### 缺口

- 无关系级标注原型或同任务误差实验
  **影响**：不能声称该方法改善语义质量
  **进一步探讨**：隔离数据比较现状与原型的漏检、误报和人工分钟

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
