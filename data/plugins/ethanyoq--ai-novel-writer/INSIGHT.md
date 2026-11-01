# 书童 Pagekin（AI Novel Writer）

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[59153ce](https://github.com/EthanYoQ/AI-Novel-Writer/tree/59153ceb1174b20339e205b801f4e694e5ad5507)

<!-- BEGIN META -->
[![GitHub ★ 2,172](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C172&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/AI-Novel-Writer)
<!-- END META -->

> **功能**：本地优先的长篇小说写作桌面工作区。

> **亮点**：[Q02](#research-q02) 与 [Q03](#research-q03) 为章节选择和定稿提供可追溯边界；模型文学质量及净收益未知。

> **主要限制**：[Q02](#research-q02) 可选材料仍可能省略，审稿与起草可能共同漏掉设定；[Q03](#research-q03) 已提交不等于文件已发布。

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
  - [Q01 · 长篇作者需要怎样的写作流程，普通编辑器与聊天模型能否替代？](#detail-section-11)
  - [Q02 · 章节上下文如何选择、冻结和暴露缺口？](#detail-section-12)
  - [Q03 · 审修和定稿怎样绑定版本并处理发布失败？](#detail-section-13)
  - [Q04 · 本地优先是否意味着所有正文和凭据都不离开电脑？](#detail-section-14)
  - [Q05 · 迁移、模型成本与作者验收有什么限制？](#detail-section-15)
  - [Q06 · 能否针对可选材料省略定向回查原文以减少跨章冲突？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要组织长篇设定、分章起草和审改的小说作者。

普通编辑器加聊天模型可完成写作，需自行维护上下文与版本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 章节资料 | 必需覆盖和可选筛选 | 可选内容可能省略 |
| 审修改稿 | 绑定生成 run、文本与版本 | 不证明语义正确 |
| 定稿 | 事务提交与文件投影 | pending 需恢复，旧定稿可被取代 |

**流程与依赖**

| 条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 桌面应用和本地作品目录 | 工作区需要 | 存储项目与编辑 | 无法打开对应作品 |
| 配置模型与协议 | 生成或审稿需要 | 处理作者提示和上下文 | 无模型调用或不兼容 |
| 云模型或本地推理服务 | 按用户选择 | 实际推理 | 云服务涉及外发与费用 |
| WebDAV | 仅可选云备份 | 存放备份 | 仍可用本地备份 |

| 步骤 | 动作 | 检查或退路 |
|---|---|---|
| 准备 | 备份隔离副本，配置模型目的地 | 不允许外发时先核实本地服务 |
| 起稿 | 选择章节资料与模型 | 检查来源、预算与覆盖缺口 |
| 审修 | 作者核对意见、差异与原定稿 | 不一致时回查原文手工修订 |
| 定稿 | 查看提交与实体稿发布状态 | pending 时核验文件和记录再恢复 |

**效果与成本**

| 阶段 | 资源与现金 | 人工时间 | 未知 |
|---|---|---|---|
| 首次 | 设备、存储、模型或本地推理 | 配置与备份 | 迁移成功率未知 |
| 持续 | 云模型按服务商收费或本地算力 | 资料整理、审稿与核实 | 节时和质量未对照 |
| 恢复 | 备份空间与修复资源 | 核对提交、文件及版本 | 故障恢复时间未测 |

| 效果 | 证据支持 | 未验证 |
|---|---|---|
| 上下文选择 | 必需覆盖、省略与快照 | 发现所有关键设定 |
| 审修定稿 | 版本绑定和已提交/待发布区分 | 语义质量与所有故障恢复 |
| 可选备份 | 文档描述本地和 WebDAV | 实际备份恢复可靠性 |

> **思考**：[Q02](#research-q02) 可选材料仍可能省略，审稿与起草可能共同漏掉设定；[Q03](#research-q03) 已提交不等于文件已发布。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 与 [Q03](#research-q03) 为章节选择和定稿提供可追溯边界；模型文学质量及净收益未知。

[Q02](#research-q02) 只有必需材料覆盖不全明确阻断，[Q03](#research-q03) 区分数据库提交、权威性与文件发布。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 可选材料仍可能省略，审稿与起草可能共同漏掉设定；[Q03](#research-q03) 已提交不等于文件已发布。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离副本试用非敏感章节，验证备份并由作者核对原稿；外发目标或定稿状态不清时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本代表源码和文档已查；未运行桌面应用、模型、备份或作者任务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/services/workflows/source-selection.ts、src/services/workflows/chapter-materials.ts、src/services/workflows/context-snapshot.ts、electron/services/review-revision-generation.ts、electron/services/finalization-service.ts、electron/repositories/finalization-repository.ts、electron/llm/gemini-provider.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定版本根桌面应用说明、章节选择与快照、审修版本校验、定稿发布、Gemini 代表请求；未运行目标、模型和网络，未审计所有格式、备份、安全或文学质量。独立 DSH 子组件另行研究，不引用其实现。
- 下一步：在人工标注的长篇上比较资料缺口、审修、定稿与手工工作流；注入重复提交、磁盘失败和取代定稿并按 [Q06](#research-q06) 盲评冲突。

**分析版本**

- **仓库**：[EthanYoQ/AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer)
- **版本号**：1.4.0（[固定提交 59153ce](https://github.com/EthanYoQ/AI-Novel-Writer/tree/59153ceb1174b20339e205b801f4e694e5ad5507)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设作者选择的高影响遗漏材料可定向回查定稿原文以减少跨章冲突；尚未实现或验证。

在人工标注的长篇上比较资料缺口、审修、定稿与手工工作流；注入重复提交、磁盘失败和取代定稿并按 [Q06](#research-q06) 盲评冲突。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 207 | 13930 | — | — | 395140 |
| .cjs | source | 5 | 170 | 149 | 16 | — |
| .mjs | source | 122 | 47954 | 44110 | 1635 | — |
| .mjs | test | 25 | 11987 | 11303 | 325 | — |
| .ts | source | 529 | 122626 | 107286 | 7232 | — |
| .tsx | source | 140 | 23585 | 21300 | 1043 | — |
| .js | source | 3 | 267 | 250 | 5 | — |
| .ts | test | 497 | 137860 | 125873 | 1256 | — |
| .tsx | test | 89 | 27229 | 24579 | 290 | — |
| .mjs | example | 5 | 3703 | 3575 | 87 | — |
| .ts | example | 2 | 85 | 65 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 111](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=111&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 122](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=122&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对章节资料选择、审修定稿、数据流和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长篇作者需要怎样的写作流程，普通编辑器与聊天模型能否替代？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:11-18 将书童 Pagekin 定义为本地优先的长篇小说桌面工作区，作者说明从设定、章节到起草、审稿和定稿，并自行提供 API Key 或本地模型；84-86 说明审稿意见和修订差异由作者选择确认。普通文档编辑器加聊天模型也可完成写作，但需要作者自己维护资料版本和回填。固定版本代码可归因的是资料筛选、审修绑定和定稿路径，而不是模型文学能力；未做同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-18](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L11-L18)

作者描述作品和模型边界。

```text
<h1 align="center">书童 Pagekin</h1>

<p align="center"><sub>原名「AI 小说作家 / AI Novel Writer」</sub></p>

<p align="center">
  <strong>开源免费的 AI 小说写作桌面软件，为长篇小说和网文连载设计。</strong><br />
  从设定、架构、章节蓝图到正文、审稿、修稿、定稿，一章一章把书写完；也能拆解参考小说来仿写、导入原稿接着续写，或按你的要求改写。<br />
  本地优先：作品存在你自己的电脑上。软件不带模型：接你自己的 API Key，或用 Ollama 跑本地模型。
```

**依据 2 · 作者声明**：[README.md:84-86](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L84-L86)

作者描述审修的人工作用。

```text
### 正文：写稿、审稿、修稿、定稿

正文单章视图把一章从待写带到定稿。AI 写出草稿后，你可以直接改，也可以让 AI 审稿。审稿报告列出每条意见，你逐条勾选或忽略，也可以加上自己的意见。修稿结果以差异给你逐段确认，不会直接覆盖原稿。确认无误后定稿。
```

**依据 3 · 源码核查**：[package.json:1-11](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/package.json#L1-L11)

独立桌面应用包名和版本。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "ai-novel-writer",
  "version": "1.4.0",
  "description": "AI Novel Writer - a local-first production workspace for long-form fiction",
  "author": "AI Novel Writer Maintainers",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.11.0",
  "engines": {
    "node": ">=22.14.0"
  },
```

</details>

#### 缺口

- 无作者任务、普通编辑器与模型的同任务对照
  **影响**：不能量化节时、完成率或文学质量
  **进一步探讨**：固定长篇样本对照人工整理与本应用并盲评。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 章节上下文如何选择、冻结和暴露缺口？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

source-selection.ts:167-189 过滤来源身份、未知来源和未准入候选，必需先于可选，可选按相关词排序；214-245 超预算记录省略，必需覆盖不完整会返回 capacity-conflict 或 split-required。chapter-materials.ts:678-704、716-733 调用选择并在非 ready 时抛出容量错误；746-754 会渲染可选材料覆盖缺口。context-snapshot.ts:38-49、51-94 对纳入内容和完整省略裁决建立确定性哈希，标注来源与估算单位。快照固定已有选择，不等于识别了所有相关设定；可选内容仍可能因预算被省略，也不能把字节估算当精确 token。

#### 证据与依据

**依据 1 · 源码核查**：[src/services/workflows/source-selection.ts:167-189](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/source-selection.ts#L167-L189)

来源准入与必需优先。

<details>
<summary>查看原文（23行）</summary>

```text
  for (const candidate of ordered) {
    const omit = (reason: SourceOmissionReason) => block(candidate, reason)
    if (!sameProjectEpoch(candidate.ref, input.current) || !candidate.ref.sourceId.trim()
      || !Number.isSafeInteger(candidate.ref.revision) || candidate.ref.revision < 0) { omit('invalid-source-ref'); continue }
    if (candidate.ref.sourceId.startsWith(PLOT_TREE_PREFIX)) { omit('plot-tree-not-manuscript'); continue }
    if (candidate.provenance === 'unknown') { omit('unknown-provenance'); continue }
    if (candidate.candidate && !mayUseCandidate(candidate.candidate.source, candidate.candidate.admission)) {
      omit('candidate-not-admitted'); continue
    }
    const identity = sourceIdentity(candidate)
    if (seenIdentity.has(identity)) { omit('duplicate-source-ref'); continue }
    seenIdentity.add(identity)
    admissible.push(candidate)
  }

  const requiredFirst = [...admissible].sort((left, right) => {
    if (left.required !== right.required) return Number(right.required) - Number(left.required)
    // 先必需后可选；可选材料之间按本章相关词命中数排序，再按稳定全序收口。
    if (!left.required) {
      const delta = relevanceOf(right.text, input.relevanceTerms) - relevanceOf(left.text, input.relevanceTerms)
      if (delta !== 0) return delta
    }
    return compareCandidate(left, right)
```

</details>

**依据 2 · 源码核查**：[src/services/workflows/source-selection.ts:214-245](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/source-selection.ts#L214-L245)

预算、省略和必需覆盖判定。

<details>
<summary>查看原文（32行）</summary>

```text
    const cost = blocks.reduce((sum, piece) => sum + unitOf(piece.text), 0)
    if (cost > remaining || !candidate.required && input.optionalMaterialCeiling !== undefined
      && input.capacity.maxInputUnits - remaining + cost > input.optionalMaterialCeiling) {
      block(candidate, 'budget')
      continue
    }
    remaining -= cost
    for (const piece of blocks) {
      included.push({ ref: candidate.ref, category: candidate.category, text: piece.text,
        required: candidate.required, reason: piece.reason })
    }
    coveredContent.add(candidate.ref.contentHash)
  }

  const coverage = coverageOf(requiredContent, coveredContent)
  if (coverage.complete) return { decision: 'ready', included, omissions, coverage }

  // 结算：按稳定顺序挑出第一个未被覆盖的必需来源作为阻断点。
  const blocking = ordered.find(item => item.required && !coveredContent.has(item.ref.contentHash))!
  // blocking 取自 ordered，是同一个对象引用，因此这里取到的就是它自己的原因。
  const reason = reasonByCandidate.get(blocking) ?? 'budget'
  if (UNUSABLE_SOURCE_REASONS.includes(reason)) {
    // 来源本身不可用：拆小范围也解决不了。
    return { decision: 'capacity-conflict', blockingSourceId: blocking.ref.sourceId,
      blockingReason: reason, omissions, coverage }
  }
  return coverage.included === 0
    ? { decision: 'capacity-conflict', blockingSourceId: blocking.ref.sourceId,
        blockingReason: reason, omissions, coverage }
    : { decision: 'split-required', remainingRequired: ordered
        .filter(item => item.required && !coveredContent.has(item.ref.contentHash))
        .map(item => item.ref.sourceId), omissions, coverage }
```

</details>

**依据 3 · 源码核查**：[src/services/workflows/chapter-materials.ts:678-704](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/chapter-materials.ts#L678-L704)

章节材料调用选择与去重。

<details>
<summary>查看原文（27行）</summary>

```text
  const select = () => {
    const choose = (dropped: Set<MaterialCandidate>) => selectChapterSources({
      current: input.identity,
      capacity,
      optionalMaterialCeiling,
      relevanceTerms: input.relevanceTerms,
      candidates: candidates.filter(item => !dropped.has(item)),
    })
    const covered = (selection: SourceSelection) => {
      const passages: string[] = []
      if (selection.decision === 'ready') for (const material of selection.included) {
        const family = familyBySourceId.get(material.ref.sourceId)
        if (family?.family === 'finalized') passages.push(...family.passages)
      }
      return new Set(referenceCandidates.filter(({ reference }) => reference.deduplicateAgainstFinalized
        && reference.text.length > 0 && passages.some(passage => passage.includes(reference.text))).map(({ candidate }) => candidate))
    }
    const droppedReferences = covered(choose(new Set()))
    let selection = choose(droppedReferences)
    while (droppedReferences.size > 0) {
      const stillCovered = covered(selection)
      const restored = [...droppedReferences].filter(candidate => !stillCovered.has(candidate))
      if (!restored.length) break
      for (const candidate of restored) droppedReferences.delete(candidate)
      selection = choose(droppedReferences)
    }
    return { droppedReferences, selection }
```

</details>

**依据 4 · 源码核查**：[src/services/workflows/chapter-materials.ts:716-733](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/chapter-materials.ts#L716-L733)

必需材料不足时阻断。

<details>
<summary>查看原文（18行）</summary>

```text
  if (selection.decision !== 'ready') {
    const omission = selection.omissions.find(item => (
      [requiredCandidate, requiredPredecessorMaterial].some(material => material
        && item.sourceId === material.ref.sourceId
        && item.revision === material.ref.revision
        && item.contentHash === material.ref.contentHash)
    ))
    if (omission) {
      throw new ChapterMaterialCapacityError({
        decision: 'capacity-conflict',
        blockingSourceId: omission.sourceId,
        blockingReason: omission.reason,
        omissions: selection.omissions,
        coverage: selection.coverage,
      }, writingLanguage)
    }
  }
  if (selection.decision !== 'ready') throw new ChapterMaterialCapacityError(selection, writingLanguage)
```

</details>

**依据 5 · 源码核查**：[src/services/workflows/chapter-materials.ts:746-754](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/chapter-materials.ts#L746-L754)

把可选覆盖缺口呈现为上下文文本。

```text
  const selectedOmissions = selection.omissions
    .map(omission => describeSelectionOmission(omission, familyBySourceId))
    .filter((omission): omission is ChapterMaterialOmission => omission !== null)
  const allOmissions = [...omissions, ...selectedOmissions]
  const gap = allOmissions.length > 0
    ? promptLanguageText(
        writingLanguage,
        `【可选材料覆盖缺口】${allOmissions.map(item => `${item.source}${item.chapterNumber ? `#${item.chapterNumber}` : ''}:${item.reason}`).join('；')}`,
        `[Optional material coverage gaps] ${allOmissions.map(item => `${item.source}${item.chapterNumber ? `#${item.chapterNumber}` : ''}:${item.reason}`).join('; ')}`,
```

**依据 6 · 源码核查**：[src/services/workflows/context-snapshot.ts:38-49](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/context-snapshot.ts#L38-L49)

快照冻结范围与不执行 IO。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * 冻结选择结果 -> 可重放快照。
 *
 * 指纹覆盖真正进入上下文的内容与完整的省略裁决，所以「同一 ref、不同正文」或
 * 「同一来源集、不同省略」都不会撞成同一个 id。会话 epoch 只记不哈希：同一章
 * 跨会话重放得到同一个快照 id。
 *
 * 边界：S01 的 `ContextSnapshot` 是被冻结的共享 DTO，只承载投影结果。必需的
 * coverage、decision 以及候选 state/lineage 留在调用方的 `SourceSelection` 上，
 * 由 S10B 的 receipt 与快照一起持久化，本函数不扩展共享类型。
 *
 * 本函数不读数据库、不写文件、不发请求。
```

</details>

**依据 7 · 源码核查**：[src/services/workflows/context-snapshot.ts:51-94](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/context-snapshot.ts#L51-L94)

快照哈希、来源、省略和估算。

<details>
<summary>查看原文（44行）</summary>

```text
export async function buildChapterContextSnapshot(input: ChapterContextSnapshotInput): Promise<ContextSnapshot> {
  const ordered = [...input.selection.included].sort((left, right) =>
    compareCodeUnit(left.ref.sourceId, right.ref.sourceId)
    || compareCodeUnit(left.ref.contentHash, right.ref.contentHash)
    || compareCodeUnit(left.text, right.text))
  const omissions = [...input.selection.omissions].sort((left, right) =>
    compareCodeUnit(left.sourceId, right.sourceId)
    || left.revision - right.revision
    || compareCodeUnit(left.contentHash, right.contentHash)
    || compareCodeUnit(left.reason, right.reason)
    || Number(left.required) - Number(right.required))
  const hash = await hashAuthorText(JSON.stringify({
    included: ordered.map(entry => ({
      sourceId: entry.ref.sourceId,
      revision: entry.ref.revision,
      contentHash: entry.ref.contentHash,
      category: entry.category,
      required: entry.required,
      text: entry.text,
    })),
    omissions: omissions.map(omission => ({
      sourceId: omission.sourceId,
      revision: omission.revision,
      contentHash: omission.contentHash,
      reason: omission.reason,
      required: omission.required,
    })),
  }))
  return {
    projectId: input.current.projectId,
    epoch: input.current.epoch,
    id: `context:${hash}`,
    hash,
    sources: ordered.map(entry => ({
      ref: entry.ref,
      slot: SLOT_BY_CATEGORY[entry.category],
      reason: `${entry.category}: ${entry.reason}`,
    })),
    omissions: omissions.map(omission => ({
      sourceId: omission.sourceId,
      reason: omission.reason,
      required: omission.required,
    })),
    estimate: { methodVersion: CONTEXT_ESTIMATOR_VERSION, inputUnits: contextSnapshotUnits(ordered) },
```

</details>

#### 缺口

- 未端到端验证大纲、历史定稿和真实模型窗口
  **影响**：无法量化遗漏率与生成一致性
  **进一步探讨**：用含隐蔽跨章约束的手工标注语料比较筛选与原文。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审修和定稿怎样绑定版本并处理发布失败？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

review-revision-generation.ts:40-47 校验审修上下文和源文本哈希，66-73 校验 artifact 所属 run、revision、textHash、finishReason 等。finalization-service.ts:101-146 若 draft 已有相同冻结请求则重用已有提交，不同则冲突；149-171 从 finalizationId 重试并先校验快照哈希。174-207 区分已提交和实体稿发布，当前 authoritative 检查失败返回 FINALIZATION_SUPERSEDED；发布异常标记 pending。对比旧提交 62880d629af7bbfaf968c0cda5ae76816e917915，本次新增 isAuthoritative 检查。已提交不等于文件已发布；版本绑定不证明评审语义正确，也不能推断所有并发或崩溃路径均无误。

#### 证据与依据

**依据 1 · 源码核查**：[electron/services/review-revision-generation.ts:40-47](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/review-revision-generation.ts#L40-L47)

审修上下文与源文本哈希。

```text
  private context(run: DurableGenerationRun): ReviewRevisionContext {
    const context = run.binding.sourceManifest.reviewRevisionContext as ReviewRevisionContext | undefined
    if (!context || context.version !== 1 || context.operation !== run.binding.sourceManifest.operation
      || !REVIEW_REVISION_OPERATIONS.includes(context.operation)
      || run.binding.sourceManifest.reviewRevisionContextHash !== contextHash(context)
      || context.sourceHash !== textHash(context.source.content)
      || !isDeepStrictEqual(run.binding.sourceManifest.authorInputs, [{ id: 'review-revision-context', text: JSON.stringify(context) }]))
      throw new Error('GENERATION_REVIEW_CONTEXT_UNPROVEN')
```

**依据 2 · 源码核查**：[electron/services/review-revision-generation.ts:66-73](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/review-revision-generation.ts#L66-L73)

run、artifact、revision 和完成条件检查。

```text
  private proveArtifact(run: DurableGenerationRun, reference: ArtifactRef) {
    if (!reference || Object.keys(reference).some(key => !['artifactId', 'revision', 'textHash'].includes(key))) throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
    const row = this.db.prepare('SELECT attempt_id,run_id,status FROM generation_artifacts WHERE artifact_id=?').get(reference.artifactId) as { attempt_id: string; run_id: string; status: string } | undefined
    if (!row || row.run_id !== run.runId || row.status === 'discarded') throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
    const receipt = this.runs.receipt(row.attempt_id), artifact = receipt.artifact
    if (!artifact || artifact.revision !== reference.revision || artifact.textHash !== reference.textHash
      || textHash(artifact.text) !== reference.textHash || receipt.failureCode || receipt.result?.finishReason !== 'stop'
      || !['settled', 'unknown'].includes(receipt.attempt.status)) throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
```

**依据 3 · 源码核查**：[electron/services/finalization-service.ts:101-146](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/finalization-service.ts#L101-L146)

冻结请求去重、冲突与定稿提交。

<details>
<summary>查看原文（46行）</summary>

```text
  async finalize(request: FinalizationRequest): Promise<FinalizationResult> {
    const finalizationId = this.createFinalizationId()
    const contentHash = snapshotHash(request.content)
    let record: FinalizationRecord
    try {
      const existing = FinalizationRepository.getByDraftId(request.draftId)
      if (existing) {
        if (!hasSameFrozenRequest(existing, request, contentHash)) {
          return {
            success: false,
            committed: false,
            error: 'FINALIZATION_COMMIT_CONFLICT',
          }
        }
        // 上次响应可能在客户端收到前丢失。复用既有 finalizationId 与目标文件名，
        // 而不是因新的 UUID 或文件碰撞创建第二次提交。
        return this.publishCommitted(request.projectRoot, existing)
      }
      const target = resolveManuscriptTarget({
        projectRoot: request.projectRoot,
        chapterNumber: request.chapterNumber,
        chapterTitle: request.chapterTitle,
        finalizationId,
      })
      record = FinalizationRepository.commit({
        finalizationId,
        draftId: request.draftId,
        chapterNumber: request.chapterNumber,
        chapterTitle: request.chapterTitle,
        content: request.content,
        contentHash,
        contentRevision: request.contentRevision,
        targetFileName: target.fileName,
      })
    } catch (error) {
      return {
        success: false,
        committed: false,
        finalizationId,
        contentHash,
        contentRevision: request.contentRevision,
        draftId: request.draftId,
        error: String(error),
      }
    }
    return this.publishCommitted(request.projectRoot, record)
```

</details>

**依据 4 · 源码核查**：[electron/services/finalization-service.ts:149-171](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/finalization-service.ts#L149-L171)

重试读已提交记录并校验快照。

<details>
<summary>查看原文（23行）</summary>

```text
  async retry(request: FinalizationRetryRequest): Promise<FinalizationResult> {
    let record: FinalizationRecord | null
    try {
      record = FinalizationRepository.get(request.finalizationId)
    } catch (error) {
      return { success: false, committed: false, error: String(error) }
    }
    if (!record) {
      return {
        success: false,
        committed: false,
        finalizationId: request.finalizationId,
        error: 'FINALIZATION_COMMIT_NOT_FOUND',
      }
    }
    const integrityError = snapshotIntegrityError(record)
    if (integrityError) {
      return toResult(record, false, integrityError)
    }
    if (record.publicationStatus === 'published') {
      return toResult(record, true)
    }
    return this.publishCommitted(request.projectRoot, record)
```

</details>

**依据 5 · 源码核查**：[electron/services/finalization-service.ts:174-207](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/finalization-service.ts#L174-L207)

权威性、发布和 pending 分支。

<details>
<summary>查看原文（34行）</summary>

```text
  private async publishCommitted(projectRoot: string, record: FinalizationRecord): Promise<FinalizationResult> {
    try {
      readPortableRuntimeFreeze(projectRoot).assertMutable('finalization_outbox', record.finalizationId)
    } catch (error) {
      const message = error instanceof PortableRuntimeFreezeError ? error.code : String(error)
      return toResult(record, false, message)
    }
    try {
      const integrityError = snapshotIntegrityError(record)
      if (integrityError) throw new Error(integrityError)
      if (record.publicationStatus === 'published') {
        return toResult(record, true)
      }
      if (!FinalizationRepository.isAuthoritative(record.draftId)) {
        return toResult(record, false, 'FINALIZATION_SUPERSEDED')
      }
      await this.publisher.publish({
        projectRoot,
        targetFileName: record.targetFileName,
        chapterNumber: record.chapterNumber,
        chapterTitle: record.chapterTitle,
        content: record.contentSnapshot,
      })
      return toResult(FinalizationRepository.markPublished(record.finalizationId), true)
    } catch (error) {
      // committed: true 已表明定稿已提交、实体稿待发布，各显示处自己写这句；error 只带原因（错误码或系统报错）。
      const message = String(error)
      try {
        const pending = FinalizationRepository.markPublicationPending(record.finalizationId, message)
        return toResult(pending, false, message)
      } catch (markError) {
        // outbox 在事务内已经以 pending 创建；即使补记错误失败，也不能把已提交事实伪装为回滚。
        console.error('[finalization] 实体稿待发布状态记录失败:', markError)
        return toResult(record, false, message)
```

</details>

**依据 6 · 源码核查**：[electron/repositories/finalization-repository.ts:372-379](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/repositories/finalization-repository.ts#L372-L379)

选出当前权威定稿。

```text
  static isAuthoritative(draftId: number): boolean {
    return requireDatabase().prepare(`
      SELECT drafts.id FROM drafts
      WHERE drafts.status = 'finalized'
        AND drafts.chapter_number = (SELECT chapter_number FROM drafts WHERE id = ?)
      ORDER BY ${AUTHORITATIVE_FINALIZED_ORDER}
      LIMIT 1
    `).pluck().get(draftId) === draftId
```

#### 缺口

- 未运行并发定稿、崩溃恢复或磁盘故障
  **影响**：不能确认实际文件恢复及一致性
  **进一步探讨**：隔离作品注入写入失败、重复提交和定稿被取代。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地优先是否意味着所有正文和凭据都不离开电脑？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README:183-192 称作品和 SQLite 存本地，云端模型请求会把提示和上下文发到选择的服务商，本机配置包含 API Key；103-105 还描述可选 WebDAV 备份。gemini-provider.ts:92-124 构造模型 URL、序列化消息体并 POST，含 API Key 请求头，支持云端输出路径的源码例证；是否本机或远端由用户选的 baseUrl 决定。数据存储本地不意味着云调用、局域网推理或备份无外发；未核查全部厂商协议、凭据保护或网络。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:183-192](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L183-L192)

作者披露作品、模型请求和凭据位置。

<details>
<summary>查看原文（10行）</summary>

```text
## 数据与隐私

| 数据或行为 | 存放位置或去向 |
| --- | --- |
| 作品、角色、蓝图、草稿和定稿 | 你的作品文件夹和本地 SQLite 数据库。 |
| 生成失败的恢复候选 | 只存在当前作品的本地数据库里，不会自动变成草稿或定稿。 |
| 导入的参考资料 | 留在本地作品里，除非你把它发给云端模型。 |
| 本地模型请求 | 发给你配置的本机或局域网推理服务。 |
| 云端模型请求 | 提示词和上下文发给你选择的服务商。 |
| 模型配置与 API Key | 保存在本机应用数据目录的 `ai-novel-writer` 文件夹里（Windows 为 `%APPDATA%\ai-novel-writer`，macOS 为 `~/Library/Application Support/ai-novel-writer`）。请保护好系统账户，不要分享这个文件夹。 |
```

</details>

**依据 2 · 作者声明**：[README.md:100-105](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L100-L105)

作者描述本地与 WebDAV 备份。

```text
### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。
```

**依据 3 · 源码核查**：[electron/llm/gemini-provider.ts:92-124](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/llm/gemini-provider.ts#L92-L124)

Gemini 请求地址、正文与鉴权。

<details>
<summary>查看原文（33行）</summary>

```text
  async generate(model: ModelProfile, messages: Array<{ role: string; content: string }>, opts: LLMGenerateOptions): Promise<LLMResponse> {
    try {
      const baseUrl = model.baseUrl.replace(/\/$/, '')
      const url = `${baseUrl}/v1beta/models/${model.modelName}:generateContent`

      const { contents, systemInstruction } = this.toGeminiContents(messages)

      const generationConfig: Record<string, unknown> = {
        maxOutputTokens: opts.maxTokens ?? model.maxTokens,
      }
      if (opts.temperature !== undefined) {
        generationConfig.temperature = opts.temperature
      }
      if (opts.responseFormat?.type === 'json_object') {
        generationConfig.responseMimeType = 'application/json'
      }
      this.applyReasoning(generationConfig, opts)

      const body: Record<string, unknown> = {
        contents,
        generationConfig,
      }
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction }] }
      }

      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': model.apiKey,
        },
        body: JSON.stringify(body),
```

</details>

**依据 4 · 作者声明**：[README.md:119-124](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L119-L124)

模型需要用户配置。

```text
## 支持的模型与服务

书童不提供模型，也不代管额度。你在设置里填上自己的服务地址、模型名和 API Key。软件支持两种调用协议：

- **OpenAI 兼容协议**：Chat Completions 接口兼容的服务都可以用。
- **Gemini 原生协议**：Google Gemini。
```

#### 缺口

- 未审计所有网络入口、凭据存储加密和本地服务
  **影响**：不能证明完全离线或隐私合规
  **进一步探讨**：隔离作品验证云端和本地模型目的地并检查备份。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 迁移、模型成本与作者验收有什么限制？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-11 给出根应用 1.4.0、Node >=22.14 和 pnpm 11.11；README:119-142 指出需自配模型，支持 OpenAI 兼容 Chat Completions 或 Gemini，任意 URL 不保证兼容；103-105 描述本地或 WebDAV 备份与另存恢复，201-205 说明云模型费用由用户承担。当前 README 的演示是 1.3.0 并压缩模型等待时长，不能当作本次 1.4.0 的用时或质量测量；不能仅凭源码推断发布包、全部 UI、迁移与恢复成功。建议非敏感小样本先备份，人工验收再复制回正式稿。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-11](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/package.json#L1-L11)

包版本、构建运行条件。

<details>
<summary>查看原文（11行）</summary>

```text
{
  "name": "ai-novel-writer",
  "version": "1.4.0",
  "description": "AI Novel Writer - a local-first production workspace for long-form fiction",
  "author": "AI Novel Writer Maintainers",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.11.0",
  "engines": {
    "node": ">=22.14.0"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:119-142](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L119-L142)

作者列明模型协议与兼容限制。

<details>
<summary>查看原文（24行）</summary>

```text
## 支持的模型与服务

书童不提供模型，也不代管额度。你在设置里填上自己的服务地址、模型名和 API Key。软件支持两种调用协议：

- **OpenAI 兼容协议**：Chat Completions 接口兼容的服务都可以用。
- **Gemini 原生协议**：Google Gemini。

设置里内置了这些服务商的预设：

| 服务商 | 协议 | 说明 |
| --- | --- | --- |
| DeepSeek | OpenAI 兼容 | 预设地址 `https://api.deepseek.com` |
| SiliconFlow（硅基流动） | OpenAI 兼容 | 预设地址 `https://api.siliconflow.cn/v1` |
| BigModel（智谱） | OpenAI 兼容 | 预设地址 `https://open.bigmodel.cn/api/paas/v4` |
| OpenAI | OpenAI 兼容 | 预设地址 `https://api.openai.com` |
| xAI（Grok） | OpenAI 兼容 | 预设地址 `https://api.x.ai/v1` |
| Google Gemini | Gemini 原生 | 预设地址 `https://generativelanguage.googleapis.com` |
| Ollama（本地） | OpenAI 兼容 | 模型跑在你自己的电脑上 |
| NovelAI | OpenAI 兼容 | 最小兼容支持，未用真实账号完整验证 |
| 自定义 | OpenAI 兼容 | 填任意兼容服务的地址 |

「自定义」只是在上面两种协议里换地址、模型名和凭据，不是任意 HTTP 接口。Anthropic、Azure、KoboldAI 原生接口等需要单独的适配器，换个 URL 不能保证能用。

知识库的语义检索另需一个向量模型，在设置的「检索模型」里配置。
```

</details>

**依据 3 · 作者声明**：[README.md:100-105](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L100-L105)

作者描述备份和恢复。

```text
### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。
```

**依据 4 · 作者声明**：[README.md:201-205](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L201-L205)

作者描述费用和质量边界。

```text
**书童免费吗？**
免费。软件以 GPL-3.0 协议开源。调用云端模型产生的费用由你和模型服务商结算，与本软件无关。用 Ollama 跑本地模型则不需要付费给任何服务商。

**需要什么模型？**
任何兼容 OpenAI Chat Completions 接口的模型都可以接，Google Gemini 走原生协议。设置里有 DeepSeek、SiliconFlow、智谱、OpenAI、xAI、Gemini、Ollama 和 NovelAI 的预设。生成质量取决于你选的模型，软件不对模型输出质量作保证。
```

**依据 5 · 作者声明**：[README.md:21-24](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/README.md#L21-L24)

历史演示版本与等待剪辑。

```text
<p align="center">
  <a href="https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest"><img src="https://img.shields.io/badge/%E4%B8%8B%E8%BD%BD-Windows%20%7C%20macOS-2b4c8c?style=for-the-badge" alt="下载 Windows 与 macOS 安装包" /></a><br />
  <a href="https://www.orz.md/ai-novel-writer/demo/">观看 32 秒中文实录：选段续写与改成对话</a><br />
  <sub>1.3.0 实录，模型等待段已剪短，AI 配音；32 秒是片长，不是生成耗时。</sub>
```

#### 缺口

- 未测打包、备份恢复、付费和作品质量
  **影响**：无法证明升级安全、净费用或节时
  **进一步探讨**：先备份并在隔离副本用非敏感章节试写。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否针对可选材料省略定向回查原文以减少跨章冲突？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有选择器已经强制必需覆盖，并把可选材料缺口渲染出来；审修还已有生成报告与 recheck 分支，所以再加省略列表、模型审稿或通用重审不是新方案。未验证假设：对作者选择的高影响可选省略来源，单独定位对应已定稿原文段落，提供版本与上下文引用并和当前草稿并排展示，要求作者确认是否需要追加受控审查；查不到或来源过期标 unknown、不自动补写正文。用同一冻结章节集对照现有缺口提示加普通审稿与定向原文回查，混入真实跨章冲突、无冲突和未检索到的陷阱；记录人工盲标漏检/误报、回查与模型成本、作者时间、隐私和过时引用。若没有降低漏检、过时报错被当事实、误报/成本过高或引用泄露，则否定；这是待验证方案，不保证作品一致或模型能发现全部冲突。

#### 证据与依据

**依据 1 · 源码核查**：[src/services/workflows/source-selection.ts:214-245](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/source-selection.ts#L214-L245)

现有必需覆盖及可选预算省略。

<details>
<summary>查看原文（32行）</summary>

```text
    const cost = blocks.reduce((sum, piece) => sum + unitOf(piece.text), 0)
    if (cost > remaining || !candidate.required && input.optionalMaterialCeiling !== undefined
      && input.capacity.maxInputUnits - remaining + cost > input.optionalMaterialCeiling) {
      block(candidate, 'budget')
      continue
    }
    remaining -= cost
    for (const piece of blocks) {
      included.push({ ref: candidate.ref, category: candidate.category, text: piece.text,
        required: candidate.required, reason: piece.reason })
    }
    coveredContent.add(candidate.ref.contentHash)
  }

  const coverage = coverageOf(requiredContent, coveredContent)
  if (coverage.complete) return { decision: 'ready', included, omissions, coverage }

  // 结算：按稳定顺序挑出第一个未被覆盖的必需来源作为阻断点。
  const blocking = ordered.find(item => item.required && !coveredContent.has(item.ref.contentHash))!
  // blocking 取自 ordered，是同一个对象引用，因此这里取到的就是它自己的原因。
  const reason = reasonByCandidate.get(blocking) ?? 'budget'
  if (UNUSABLE_SOURCE_REASONS.includes(reason)) {
    // 来源本身不可用：拆小范围也解决不了。
    return { decision: 'capacity-conflict', blockingSourceId: blocking.ref.sourceId,
      blockingReason: reason, omissions, coverage }
  }
  return coverage.included === 0
    ? { decision: 'capacity-conflict', blockingSourceId: blocking.ref.sourceId,
        blockingReason: reason, omissions, coverage }
    : { decision: 'split-required', remainingRequired: ordered
        .filter(item => item.required && !coveredContent.has(item.ref.contentHash))
        .map(item => item.ref.sourceId), omissions, coverage }
```

</details>

**依据 2 · 源码核查**：[src/services/workflows/chapter-materials.ts:746-754](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/chapter-materials.ts#L746-L754)

现有可选缺口提示。

```text
  const selectedOmissions = selection.omissions
    .map(omission => describeSelectionOmission(omission, familyBySourceId))
    .filter((omission): omission is ChapterMaterialOmission => omission !== null)
  const allOmissions = [...omissions, ...selectedOmissions]
  const gap = allOmissions.length > 0
    ? promptLanguageText(
        writingLanguage,
        `【可选材料覆盖缺口】${allOmissions.map(item => `${item.source}${item.chapterNumber ? `#${item.chapterNumber}` : ''}:${item.reason}`).join('；')}`,
        `[Optional material coverage gaps] ${allOmissions.map(item => `${item.source}${item.chapterNumber ? `#${item.chapterNumber}` : ''}:${item.reason}`).join('; ')}`,
```

**依据 3 · 源码核查**：[src/services/workflows/context-snapshot.ts:71-94](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/src/services/workflows/context-snapshot.ts#L71-L94)

现有省略来源与快照元数据。

<details>
<summary>查看原文（24行）</summary>

```text
    omissions: omissions.map(omission => ({
      sourceId: omission.sourceId,
      revision: omission.revision,
      contentHash: omission.contentHash,
      reason: omission.reason,
      required: omission.required,
    })),
  }))
  return {
    projectId: input.current.projectId,
    epoch: input.current.epoch,
    id: `context:${hash}`,
    hash,
    sources: ordered.map(entry => ({
      ref: entry.ref,
      slot: SLOT_BY_CATEGORY[entry.category],
      reason: `${entry.category}: ${entry.reason}`,
    })),
    omissions: omissions.map(omission => ({
      sourceId: omission.sourceId,
      reason: omission.reason,
      required: omission.required,
    })),
    estimate: { methodVersion: CONTEXT_ESTIMATOR_VERSION, inputUnits: contextSnapshotUnits(ordered) },
```

</details>

**依据 4 · 源码核查**：[electron/services/review-revision-generation.ts:76-91](https://github.com/EthanYoQ/AI-Novel-Writer/blob/59153ceb1174b20339e205b801f4e694e5ad5507/electron/services/review-revision-generation.ts#L76-L91)

现有审稿报告和重审分支。

<details>
<summary>查看原文（16行）</summary>

```text
  private reviewBody(run: DurableGenerationRun, reference: ArtifactRef, reportVersion: ReviewReportVersion = 2): string {
    const context = this.context(run), { row, artifact } = this.proveArtifact(run, reference)
    if (context.recheck) {
      const attempt = this.attempts(run.runId).find(candidate => candidate.attempt_id === row.attempt_id)
      let persistedVersion: 1 | 2 | undefined
      try {
        const receipt = attempt && JSON.parse(attempt.usage_receipt_json).reviewCycleRecheck
        if (receipt?.version === 1 || receipt?.version === 2) persistedVersion = receipt.version
      } catch { /* Invalid persisted receipts fail later proof checks; do not downgrade current policy. */ }
      const policy = persistedVersion ? { ...context.recheck, version: persistedVersion } : recheckCommitPolicy(context.recheck)
      const built = buildReviewCycleRecheckReport(artifact.text, context.source.content, policy, context.uiLocale, reportVersion)
      return JSON.stringify({ summary: built.summary, items: built.items }, null, 2)
    }
    return JSON.stringify(buildReviewGenerationReport({ content: artifact.text, sourceContent: context.source.content,
      frozenGoals: context.frozenGoals, writingLanguage: context.writingLanguage, uiLocale: context.uiLocale,
      preflightFindings: context.preflightFindings, reportVersion }), null, 2)
```

</details>

#### 缺口

- 没有定向原文回查原型和带真值的长篇冲突数据集
  **影响**：无法证明方案减少漏检或值得额外成本
  **进一步探讨**：构造有真值的跨章冲突与无冲突样本进行盲评。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
