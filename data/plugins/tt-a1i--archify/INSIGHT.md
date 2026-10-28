# Archify

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[d605933](https://github.com/tt-a1i/archify/tree/d6059331abbddb49bca380ff46dca8ce33158b04)

<!-- BEGIN META -->
[![GitHub ★ 90,283](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=90%2C283&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tt-a1i/archify)
<!-- END META -->

> **功能**：通过结构化规格生成可交互图形与独立 HTML 说明页的 Agent Skill

> **亮点**：将结构化创作、交互 HTML 和绑定实际字节的阶段验收串联，使“文件曾通过”和“当前文件被检验”有可检查区别；图形语义仍需人工。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：自动验收约束产物和展示机制，不能保证引用解释、关系方向或读者理解；节点引用并不独立约束每一条关系。感知视觉复核也不包含在普通通过中。[Q03](#research-q03)

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
  - [Q01 · 根项目是否为 DSH 插件，提供什么增量？](#detail-section-11)
  - [Q02 · finalize 怎样绑定候选、HTML 与阶段证据？](#detail-section-12)
  - [Q03 · 文件与收据一致能保证关系和视觉质量吗？](#detail-section-13)
  - [Q04 · 流程集中后，用户还承担哪些依赖和恢复负担？](#detail-section-14)
  - [Q05 · 何种试用成立，什么改进值得检验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉系统的开发者与知识工作者将复杂关系交给协作者理解。

模型直接写 Mermaid/HTML，用户用人工清单核查事实；本次未运行同任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 结构化图形 Skill | 将系统、流程或结构变成独立 HTML | 要完整候选与来源核查 |
| finalize 交付协议 | 将实际产物与多阶段证据绑定 | 自动通过不能代替语义和感知检查 |
| explainer 页面 | 结论先行的说明页 | 必须真实 renderer 和交付门禁 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=18 与 Skill 文件 | 启动必需 | CLI/renderer | 环境须先核实，根包不可当 DSH 插件安装 |
| 模型、shell、filesystem | 通常必需 | 读证据、写候选和 HTML | 原生图可手工 SVG，explainer 不可伪称已交付 |
| 真实浏览器环境 | 门禁必需 | browser-check | 失败需按阶段修复 |
| 系统知识和源码权限 | 事实图必需 | 核实 actor/写入/分支 | 无材料只能标说明性范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户确定图类型、事实范围与输出目录 | 不为数量删关系 |
| 2 | Agent 读 schema/来源并写完整候选 | 事实与推断区分 |
| 3 | CLI finalize 执行完整门禁 | 非零退出不是成功；按诊断修复 |
| 4 | 用户核对关系和可读性 | 新 review 单独目录；失败退回简单图 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node、浏览器与模型资源；金额未知 | 安装 Skill、确认工具和 schema | 环境就绪时间未测 |
| 持续使用 | 模型上下文与浏览器资源未知 | 源码抽象、关系与布局复核 | 合格图单位成本未知 |
| 失败恢复 | 修订重跑资源未知 | 读阶段诊断、保护旧证据 | 不能把非零退出当成功 |
| 退出 | 存储资源未知 | 保留 HTML 和来源、停止 Skill | 交付归档仍需用户管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 文件证据一致 | SHA、字节、收据身份及 provenance 门禁 | 全故障条件下实测可靠性 |
| 交互图和说明页 | Skill 路由与 CLI 交付机制 | 真实语义准确和理解提升 |
| 总流程 | 统一 finalize 和失败阶段诊断 | 相对简单图的成本收益 |

> **思考**：自动验收约束产物和展示机制，不能保证引用解释、关系方向或读者理解；节点引用并不独立约束每一条关系。感知视觉复核也不包含在普通通过中。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将结构化创作、交互 HTML 和绑定实际字节的阶段验收串联，使“文件曾通过”和“当前文件被检验”有可检查区别；图形语义仍需人工。[Q01](#research-q01) [Q02](#research-q02)

真实 CLI 动态 import finalize 后传入 input、output、quality、repoRoot、候选 SHA 和 provenance 检查器；browser-check 调用明确 capture=false、requireProvenance=true。阶段不是一个 ok 布尔值：deliver 要规格/产物身份、receiptId 和 validation，check 要当前 provenance、同一 delivery receipt 及 composition，browser 要当前产物、来源和视口检查。收据写入先独占临时文件，绑定 inode、SHA、字节数，再提交，清理警告也不冒充干净完成。stage 非 pass 时记录诊断并 break，避免后续阶段被当已运行。可借鉴的是实际字节身份与阶段证据绑定，而非把某次成功状态永久贴到文件路径上。此范围支持机制判断，不等于本轮证明所有竞态或渲染器可靠。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动验收约束产物和展示机制，不能保证引用解释、关系方向或读者理解；节点引用并不独立约束每一条关系。感知视觉复核也不包含在普通通过中。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉系统的人先对一条请求链做受控试用，以关系正确、读者理解和总人工分钟为验收；关键边无事实支持或修复负担更高时退回简单图。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

创作与阶段收据机制为固定源码支持；相对工作流收益为有条件解释，语义和读者效果未验证；逐关系门禁是未来假设。

- 已检查：作者 README、包清单、源码路径 package.json、archify/package.json、archify/SKILL.md、archify/bin/archify.mjs、archify/bin/finalize.mjs、archify/references/repository-authoring.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮 inventory 为完整 tracked 范围；源码深入 Skill、CLI finalize、阶段收据和 repository-authoring，未审全部图种 renderer 与 viewer，未执行目标。根项目不是 DSH 插件，子适配器固定旧 Skill 来源。
- 下一步：相同模型和请求链，对照 Mermaid/人工清单做关系错误注入、产物串线和读者理解检查；记录总尝试及人工分钟，不能只看 gate pass。

**分析版本**

- **仓库**：[tt-a1i/archify](https://github.com/tt-a1i/archify)
- **版本号**：未声明（[固定提交 d605933](https://github.com/tt-a1i/archify/tree/d6059331abbddb49bca380ff46dca8ce33158b04)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是增加逐关系事实性质与调用位置映射，和现有节点引用作错误注入对照，检验是否减少假边而不过度增加作者负担；无改善即停止。[Q05](#research-q05)

相同模型和请求链，对照 Mermaid/人工清单做关系错误注入、产物串线和读者理解检查；记录总尝试及人工分钟，不能只看 gate pass。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 169 | 28585 | — | — | 306281 |
| .mjs | source | 139 | 60657 | 54923 | 3123 | — |
| .js | source | 25 | 12037 | 11226 | 459 | — |
| .md | example | 8 | 197 | — | — | 2093 |
| .mjs | test | 285 | 88835 | 81697 | 1851 | — |
| .tsx | source | 1 | 4 | 3 | 1 | — |
| .ts | source | 3 | 76 | 64 | 7 | — |
| .md | test | 1 | 58 | — | — | 714 |

</details>

**活跃度**

[![Issue 未关闭 132](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=132&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 152](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=152&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 127](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=127&color=737b86&logo=github)](https://github.com/tt-a1i/archify/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：结构化图形创作和字节绑定验收能提供什么价值，哪些事实与视觉责任仍需人工？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 根项目是否为 DSH 插件，提供什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是 private 的 Archify Skill/图形工具源码仓库，不是可直接 dsh plugin add 的根插件。内层 archify/package.json 声明 CLI 和 3.2.0；Skill 将架构、流程、时序、数据流、状态、ERD、类、树、时间线和瀑布图路由到结构化候选，另有 explainer 页面。目标人群是需要把代码或复杂关系交给他人理解的开发者和知识工作者，合格交付要求事实关系成立、页面可打开且证据可回查。相对直接让模型输出 Mermaid 或 HTML，增量是 schema 与样例约束、完整候选和统一 finalize 交付门禁；自动化没有代替正确选取架构边界与事实。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-7](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/package.json#L1-L7)

根 private 与 Node 要求，不是根 DSH bundle。

```text
{
  "name": "archify-repository",
  "private": true,
  "type": "module",
  "engines": {
    "node": ">=18"
  },
```

**依据 2 · 源码核查**：[archify/package.json:1-13](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/package.json#L1-L13)

内层 private CLI 身份与版本。

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

**依据 3 · 源码核查**：[archify/SKILL.md:32-47](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L32-L47)

从图类型到候选再 finalize 的完整入口。

<details>
<summary>查看原文（16行）</summary>

````text
## Native diagram authoring

Use this path for ordinary generation. Read branch references only when their stated trigger applies.

1. Choose `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `class`, `tree`, `timeline`, or `waterfall` from the question.
2. Use the exact schema and example paths in the Type router without listing their directories. Read [Authoring defaults](references/authoring-defaults.md) and the mode's example in a bounded batch separate from project documents and complete schemas so neither is truncated; recover any missing section before writing. For Architecture, use the matching showcase example. For every mode except Architecture, also read the mode and common schemas. Read the relevant schema definition before choosing any new field, enum, or constrained text, especially boundary kinds. Examples teach shape, not facts. Use fresh IDs, wording, and layout. Go directly to the candidate without preliminary help, doctor, starter validation, temporary diagrams, or output-path listing. Query brands only for an explicitly requested mark; read [Brand marks](references/brand-marks.md) for an unknown mark with a user-provided URL.
3. Once the requested scope and, for a real codebase, [source evidence](references/repository-authoring.md) are covered, write the complete candidate directly without planning coordinates in prose. Choose Architecture abstraction and connected placement using Authoring defaults before coordinates: show the main user journey and necessary branches, preserve control roles and behavior-changing conditions, and leave enough room for actual relationship labels. No node, relationship, source, view, card, or boundary count is a target or ceiling. Use automatic routes first; add explicit routing only for necessary branch, return, supplied geometry, or measured repair. Set `meta.quality_profile` to `"showcase"` unless the user requests dense `standard`. For ERD, use a table-first layout: show every physical column in `entities[].attributes`, keep its SQL type and source comment, state every key role a column carries (`key` takes a role or a list, so a junction column is `["pk", "fk"]`, and every `fk` column also needs `references` like `"orders.id"`), and never move columns into cards as a substitute for the table. Classify tables into functional domains before placement, give each domain a concise `tag`, and place its members in one solid rectangle of grid cells — a single row, a single column, or a filled rectangular block, not an L or diagonal. A tagged table always needs `row`/`col`, because absolute coordinates have no grid cells and a domain whose tables do not fill one rectangle cannot be drawn as a band: the renderer reports `erd/domain-not-drawn` instead of publishing a diagram that cannot name the domain. A multi-domain schema reads best as one domain per column — each `tag` a vertical run — because the reader scales a wide canvas up to the reader width and shrinks a tall one until the page fits, so the wide arrangement is the one that stays complete and legible inside a laptop viewport. A schema-first ERD over roughly 8 tables or 50 fields is itself a dense map: author its first complete-field pass at `standard` and upgrade only once the layout still reads.
4. Once the complete first candidate is written, run `finalize` directly. Its first gate is showcase validation; successful first drafts need no separate pre-validation. Keep the candidate unchanged while the command runs:

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   For a repository-backed candidate, include evidence on the first draft and use the complete first command: `node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`. Pass the `--quality` that matches `meta.quality_profile`, such as `standard` for a dense first ERD pass.

   A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed. Use its compact summary; run standalone commands only for a separate request or focused failure diagnosis.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · finalize 怎样绑定候选、HTML 与阶段证据？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

真实 CLI 动态 import finalize 后传入 input、output、quality、repoRoot、候选 SHA 和 provenance 检查器；browser-check 调用明确 capture=false、requireProvenance=true。阶段不是一个 ok 布尔值：deliver 要规格/产物身份、receiptId 和 validation，check 要当前 provenance、同一 delivery receipt 及 composition，browser 要当前产物、来源和视口检查。收据写入先独占临时文件，绑定 inode、SHA、字节数，再提交，清理警告也不冒充干净完成。stage 非 pass 时记录诊断并 break，避免后续阶段被当已运行。可借鉴的是实际字节身份与阶段证据绑定，而非把某次成功状态永久贴到文件路径上。此范围支持机制判断，不等于本轮证明所有竞态或渲染器可靠。

#### 证据与依据

**依据 1 · 源码核查**：[archify/bin/archify.mjs:5912-5955](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/bin/archify.mjs#L5912-L5955)

CLI 确实调用 runFinalize 并提供 provenance/browser 实现。

<details>
<summary>查看原文（44行）</summary>

```text
  let runFinalize;
  try {
    ({ runFinalize } = await import('./finalize.mjs'));
  } catch (error) {
    fail(`Could not load finalize: ${error.message}`, 1);
  }

  let result;
  let explainerTemporary;
  try {
    let preparedExplainer;
    let preparedBundlePath;
    if (type === 'explainer') {
      preparedExplainer = await prepareExplainerInput(fs.readFileSync(path.resolve(input)), path.resolve(input), { repoRoot: repoArgs.repoRoot, quality: qualityArgs.quality || 'showcase', writingMode: writingArgs.writingMode });
      const { createOwnedTempDirectory } = await import('../renderers/shared/owned-temp-directory.mjs');
      const { writePreparedBundle } = await import('../explainer/prepare.mjs');
      explainerTemporary = createOwnedTempDirectory('archify-explainer-finalize-');
      preparedBundlePath = writePreparedBundle(explainerTemporary.path, preparedExplainer);
    }
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
    });
```

</details>

**依据 2 · 源码核查**：[archify/bin/finalize.mjs:56-85](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/bin/finalize.mjs#L56-L85)

独占临时文件、普通文件绑定与发布清理语义。

<details>
<summary>查看原文（30行）</summary>

```text
function writeJsonAtomic(file, value, capture, beforeCommit) {
  const serialized = Buffer.from(`${JSON.stringify(value, null, 2)}\n`);
  const temporary = path.join(path.dirname(capture.commitPath), `.archify-finalize-${randomUUID()}.json`);
  let binding;
  let stagedIdentity;
  try {
    fs.writeFileSync(temporary, serialized, { flag: 'wx' });
    const metadata = fs.lstatSync(temporary, { bigint: true });
    stagedIdentity = { device: metadata.dev, inode: metadata.ino };
    if (capture.mode !== null) fs.chmodSync(temporary, capture.mode);
    const staged = captureRegularFileBinding(temporary, {
      subject: 'finalize-receipt', expectedIdentity: stagedIdentity,
      expectedSha256: sha256(serialized), expectedBytes: serialized.byteLength,
      ...(capture.mode === null ? {} : { expectedMode: capture.mode }),
    });
    if (staged.status !== 'captured') throw receiptWriteError(file, staged);
    binding = staged.binding;
    beforeCommit();
    const publication = publishRegularFileBinding(binding, temporary, capture.snapshot, { subject: 'finalize-receipt' });
    if (!['committed', 'committed-with-warning'].includes(publication.status)) throw receiptWriteError(file, publication);
    // Preserve recovery evidence instead of reporting a clean completion when cleanup failed.
    if (publication.status === 'committed-with-warning') throw receiptWriteError(file, publication);
    const next = captureReceipt(file);
    if (!pathsAlias(next.commitPath, capture.commitPath)) {
      throw receiptWriteError(file, { status: 'different', reason: { code: 'receipt-slot-changed' } });
    }
    return next;
  } finally {
    if (binding) releaseRegularFileBinding(binding);
    if (stagedIdentity) removeOwnedRegularFile(temporary, stagedIdentity, { subject: 'finalize-receipt' });
```

</details>

**依据 3 · 源码核查**：[archify/bin/finalize.mjs:188-219](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/bin/finalize.mjs#L188-L219)

各阶段收据具体要求。

<details>
<summary>查看原文（32行）</summary>

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
    && receipt.themeStates?.status === 'pass'
    && receipt.readability?.status === 'pass'
    && receipt.viewerChrome?.status === 'pass'
    && validBrowserEvidence(receipt);
```

</details>

**依据 4 · 源码核查**：[archify/bin/finalize.mjs:997-1007](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/bin/finalize.mjs#L997-L1007)

失败停止后续阶段。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 文件与收据一致能保证关系和视觉质量吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能。repository-authoring 要求沿真实输入输出和调用、写入跟踪，禁止把 label 或未调用函数当事实；但 sources 仅挂主要元素，关系本身没有专属 source，作者要在所有者节点或卡片保留额外证据。自动字节/行号一致只能减少串线，不能证明抽象和来源解释正确。Skill 明示普通 passing run 无 screenshots 且 visualReview=not-requested，视觉检查是另行感知复核；不能将 real-browser 门禁直接称为人类阅读体验验收。最强反例是每个节点都有合法引用却画出错误控制方向，这仍可能结构正确。采用时必须逐关系检查实际 actor/operation/target，并抽查布局，不能只看通过收据。

#### 证据与依据

**依据 1 · 源码核查**：[archify/references/repository-authoring.md:35-61](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/references/repository-authoring.md#L35-L61)

所有权与调用事实的具体推导要求。

<details>
<summary>查看原文（27行）</summary>

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

5. **Name uncertainty.** Write unresolved questions beside the claim they
   affect: for example, “`writeFile` is called here; durability is unknown.”
   Resolve a question by reading the next relevant source range or preserve it
   as an explicit unknown. Never turn a label, package description, or config
   value into an unobserved service or behavior.
```

</details>

**依据 2 · 源码核查**：[archify/references/repository-authoring.md:76-90](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/references/repository-authoring.md#L76-L90)

主要元素而非关系绑定 sources，示意时间需标 illustrative。

<details>
<summary>查看原文（15行）</summary>

```text
## Evidence by diagram type

Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
folder node cites its own README or entry file, or else the file that defines
or runs it. A Timeline event cites a file at the pinned revision that records
it, such as a changelog entry, and takes its time from a tag or commit in that
history, or noon local time for a date-only record. A tag or commit outside
that history is not citable. Say either in a card. A Waterfall without a
recorded trace uses `meta.evidence: "illustrative"` and keeps its durations
labelled as such; do not run the project only to time it.
```

</details>

**依据 3 · 源码核查**：[archify/SKILL.md:87-103](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L87-L103)

自动门禁、无截图与感知检查界限。

<details>
<summary>查看原文（17行）</summary>

```text
## Delivery

Use the `finalize` command above for the first candidate and after a repair.

`finalize` stops at the first non-passing gate. Its compact stdout and `<output-stem>.finalize-summary.json` are ordinary evidence. A passing run creates no screenshots and reports `visualReview: "not-requested"`.

When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.

Read [Delivery contract](references/delivery-contract.md) for failed gates, standalone commands, provenance/recovery, repeated delivery, exports, or opening. Native diagram recovery follows `deliver` → strict provenance `check` → `browser-check`; captures require strict provenance. Explainer delivery uses validate, deliver and check as described in its authoring guide.

For workflow viewport overflow, read [Workflow viewport repair](references/authoring-contract.md#workflow-viewport-repair) before the next layout edit.

When reporting verification details, distinguish artifact checks, browser evidence, captures, and actual perceptual review. For an explicitly requested immediate preview or active desktop loop, see [Optional opening](references/delivery-contract.md#optional-opening).
```

</details>

#### 缺口

- 没有本轮同任务语义错误检出率、普通读者理解或视觉复核结果。
  **影响**：不能量化准确率与沟通收益，也不能将自动门禁升级为人类验收。
  **进一步探讨**：用熟悉系统的错误边注入和读者复述实验，与简单 Mermaid 对照记录漏检关系和理解时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 流程集中后，用户还承担哪些依赖和恢复负担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需要兼容 Node、能读写工作区的 agent 和真实浏览器门禁环境；无 shell 时原生图允许手工 SVG fallback，但 explainer 必须 renderer 与真实 delivery gates，不可假称交付。用户按任务读取 schema/reference、完整写 candidate、运行一次 finalize；失败必须读 failed gate、保持语义再修复。browser 阶段后同输出路径拥有证据，后续 review 使用独立 out-dir，避免覆盖旧证据。模型上下文、完整源码阅读、浏览器资源、布局修订和人工关系复核都是成本；命令减少不代表端到端便宜。开源许可不代表模型和人工免费，未测任务不能输出单位合格图成本。

#### 证据与依据

**依据 1 · 源码核查**：[archify/SKILL.md:36-49](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L36-L49)

schema/候选/交付/失败修复负担。

<details>
<summary>查看原文（14行）</summary>

````text
1. Choose `architecture`, `workflow`, `sequence`, `dataflow`, `lifecycle`, `erd`, `class`, `tree`, `timeline`, or `waterfall` from the question.
2. Use the exact schema and example paths in the Type router without listing their directories. Read [Authoring defaults](references/authoring-defaults.md) and the mode's example in a bounded batch separate from project documents and complete schemas so neither is truncated; recover any missing section before writing. For Architecture, use the matching showcase example. For every mode except Architecture, also read the mode and common schemas. Read the relevant schema definition before choosing any new field, enum, or constrained text, especially boundary kinds. Examples teach shape, not facts. Use fresh IDs, wording, and layout. Go directly to the candidate without preliminary help, doctor, starter validation, temporary diagrams, or output-path listing. Query brands only for an explicitly requested mark; read [Brand marks](references/brand-marks.md) for an unknown mark with a user-provided URL.
3. Once the requested scope and, for a real codebase, [source evidence](references/repository-authoring.md) are covered, write the complete candidate directly without planning coordinates in prose. Choose Architecture abstraction and connected placement using Authoring defaults before coordinates: show the main user journey and necessary branches, preserve control roles and behavior-changing conditions, and leave enough room for actual relationship labels. No node, relationship, source, view, card, or boundary count is a target or ceiling. Use automatic routes first; add explicit routing only for necessary branch, return, supplied geometry, or measured repair. Set `meta.quality_profile` to `"showcase"` unless the user requests dense `standard`. For ERD, use a table-first layout: show every physical column in `entities[].attributes`, keep its SQL type and source comment, state every key role a column carries (`key` takes a role or a list, so a junction column is `["pk", "fk"]`, and every `fk` column also needs `references` like `"orders.id"`), and never move columns into cards as a substitute for the table. Classify tables into functional domains before placement, give each domain a concise `tag`, and place its members in one solid rectangle of grid cells — a single row, a single column, or a filled rectangular block, not an L or diagonal. A tagged table always needs `row`/`col`, because absolute coordinates have no grid cells and a domain whose tables do not fill one rectangle cannot be drawn as a band: the renderer reports `erd/domain-not-drawn` instead of publishing a diagram that cannot name the domain. A multi-domain schema reads best as one domain per column — each `tag` a vertical run — because the reader scales a wide canvas up to the reader width and shrinks a tall one until the page fits, so the wide arrangement is the one that stays complete and legible inside a laptop viewport. A schema-first ERD over roughly 8 tables or 50 fields is itself a dense map: author its first complete-field pass at `standard` and upgrade only once the layout still reads.
4. Once the complete first candidate is written, run `finalize` directly. Its first gate is showcase validation; successful first drafts need no separate pre-validation. Keep the candidate unchanged while the command runs:

   ```bash
   node bin/archify.mjs finalize <type> <candidate.json> <output.html> --quality showcase --json
   ```

   For a repository-backed candidate, include evidence on the first draft and use the complete first command: `node bin/archify.mjs finalize <type> <candidate.json> <output.html> --repo-root <repo-root> --quality showcase --json`. Pass the `--quality` that matches `meta.quality_profile`, such as `standard` for a dense first ERD pass.

   A passing receipt proves the included `validate`, `deliver`, strict `check`, and real-browser `browser-check` gates passed. Use its compact summary; run standalone commands only for a separate request or focused failure diagnosis.

5. A non-zero exit is never success. Read compact stdout or `evidence.summaryReceipt`, then [repair the failed gate](references/delivery-contract.md#failed-finalize-and-candidate-repair), including its repair limit. Preserve requested meaning and source evidence. For several tangled Architecture routes, read [Architecture layout repair](references/architecture-layout-repair.md); for measured field or geometry failures, read [Authoring contract](references/authoring-contract.md). Edit the connected neighborhood and rerun the complete `finalize` command from step 4. Once a run has reached `browser-check`, the output path owns that evidence: give every later run its own `--out-dir <folder>/review-<n>`.
````

</details>

**依据 2 · 源码核查**：[archify/SKILL.md:91-99](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L91-L99)

新 review 证据目录与视觉复核条件。

```text
`finalize` stops at the first non-passing gate. Its compact stdout and `<output-stem>.finalize-summary.json` are ordinary evidence. A passing run creates no screenshots and reports `visualReview: "not-requested"`.

When a passing Architecture receipt reports `visualReviewRecommendation.signals.resolvedCrossovers`, copy the candidate aside and apply the hints in one edit that changes only node positions and sizes: every node, relationship (including its `from` and `to`), label, and source stays as it was. Rerun the complete `finalize` once with `--out-dir <folder>/review-2`, because the previous HTML already owns its browser evidence. `--out-dir` relocates the new browser-check and default finalize receipts, not the HTML or its delivery receipt. Successful delivery rewrites that pair at the requested output path; earlier review evidence remains bound to its original artifact bytes. See [review evidence paths](references/delivery-contract.md#a-new-candidate-at-an-existing-output-path). If that run fails, reports more crossings, or reports the same crossings with more `signals.routesOverSuggestedBends`, restore the copy and finalize it with `--out-dir <folder>/review-3`. Do not start a second placement round. Hints about extra bends alone are optional.

When `layoutReviewRecommendation.action` is `inspect-sequence-width`, follow [Sequence width review](references/delivery-contract.md#sequence-width-review) before handing off a newly authored Sequence.

Perceptual review is optional for ordinary generation, including a newly positioned Architecture. Use [Optional capture evidence](references/delivery-contract.md#optional-capture-evidence), with `--out-dir <folder>/visual-check`, when the user requests visual review, during development audits, or for a concrete route/browser concern. `visualReviewRecommendation` is advisory. Inspect captures before claiming visual quality; qualify any check claim as automated when perceptual review has not occurred.

Read [Delivery contract](references/delivery-contract.md) for failed gates, standalone commands, provenance/recovery, repeated delivery, exports, or opening. Native diagram recovery follows `deliver` → strict provenance `check` → `browser-check`; captures require strict provenance. Explainer delivery uses validate, deliver and check as described in its authoring guide.
```

**依据 3 · 源码核查**：[archify/SKILL.md:111-120](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L111-L120)

setup 与 fallback 的具体边界。

<details>
<summary>查看原文（10行）</summary>

````text
## Setup and fallback

No install is required inside the skill package. For setup diagnosis, verify with:

```bash
node bin/archify.mjs doctor
node bin/archify.mjs demo <output-directory>
```

For native diagrams, when shell access is unavailable, hand-place architecture SVG into `assets/template.html`, use CSS semantic classes rather than inline colors, and follow the visual review contract in `references/delivery-contract.md`. Explainers require their renderer and real delivery gates; if those are unavailable, report the limitation and give a text answer when useful, without claiming HTML delivery.
````

</details>

#### 缺口

- 目标浏览器环境就绪率和每轮修复时间未测。
  **影响**：难以估计首次接入与失败恢复代价。
  **进一步探讨**：隔离环境记录 doctor/finalize 的依赖、首错与人工分钟，再决定团队接入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何种试用成立，什么改进值得检验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合已经熟悉被解释系统、能核查源码事实的开发者先用一条端到端请求链试用；希望只要文字便自动保证正确架构的人不适合。试用要保留相同模型、事实范围与预算，以简单 Mermaid 加人工清单作基线，比较正确关系比例、读者复述、总尝试、人工分钟和文件一致性。出现合法引用支撑不了关键边、门禁失败无可解释修复或总复核负担更高时退回简单图。由 sources 不直接挂关系和强文件绑定之间的差距，推导出未验证假设：增加逐关系“观察/推断/未知”及调用位置映射，可以减少假边而不限制有效抽象。最小验证注入方向、状态所有者与分支条件错误，比较现有节点引用和逐关系映射；若仅增文书而漏检不降，否定扩展。此假设不能计入已实现创新。

#### 证据与依据

**依据 1 · 源码核查**：[archify/references/repository-authoring.md:35-61](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/references/repository-authoring.md#L35-L61)

关系语义与所有权核查为改进推导基础。

<details>
<summary>查看原文（27行）</summary>

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

5. **Name uncertainty.** Write unresolved questions beside the claim they
   affect: for example, “`writeFile` is called here; durability is unknown.”
   Resolve a question by reading the next relevant source range or preserve it
   as an explicit unknown. Never turn a label, package description, or config
   value into an unobserved service or behavior.
```

</details>

**依据 2 · 源码核查**：[archify/references/repository-authoring.md:78-83](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/references/repository-authoring.md#L78-L83)

关系没有独立 sources 的当前边界。

```text
Only the primary elements carry `sources`, at most three ranges each:
Architecture components, Workflow, Dataflow and Tree nodes, Sequence
participants, Lifecycle states, ERD entities, Class types, Timeline events and
Waterfall spans. Relationships, messages, flows and transitions have none: cite
the call, write or transition site on the element that owns it (the caller, the
writer, the state being left) and keep further evidence in a note or card. A
```

**依据 3 · 源码核查**：[archify/SKILL.md:126-131](https://github.com/tt-a1i/archify/blob/d6059331abbddb49bca380ff46dca8ce33158b04/archify/SKILL.md#L126-L131)

用户应知道遗漏和自动/感知复核差异。

```text
- Lead with a clickable Markdown link to the HTML: a descriptive title, not the file name, and its absolute path, wrapped in `<...>` when it contains spaces.
- When the user wants to understand a system or codebase rather than draw a described subject, add one or two sentences with the key takeaway. Skip sentences that only restate what the diagram obviously shows.
- State anything that changes how the diagram should be read: the abstraction level or deliberately omitted parts when a reader might expect them, illustrative rather than measured values, missing source evidence, or requested content dropped or merged during repair.
- For several diagrams, report completion once with a link to an existing overview or compact per-diagram links, not a directory path.

Do not recap commands, repair rounds, hashes, quality profiles, or check lists; they stay in the receipts. If asked whether the diagram was verified, answer in one line, such as “Automated checks passed; not visually reviewed.” Give receipt links and details only for reproducibility or troubleshooting. Disclose requested visual review that could not run, and claim visual inspection only when performed. Keep the required update notice under Update awareness.
```

#### 缺口

- 逐关系映射是否增加复核负担、真实用户是否持续使用未知。
  **影响**：不能宣称独立产品机会或已获收益。
  **进一步探讨**：同任务小样本对照记录漏检、作者时间、读者理解；没有收益则保留现有方案。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
