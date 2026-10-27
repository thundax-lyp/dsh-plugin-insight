# 书童 Pagekin 桌面写作应用

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[62880d6](https://github.com/EthanYoQ/AI-Novel-Writer/tree/62880d629af7bbfaf968c0cda5ae76816e917915)

<!-- BEGIN META -->
[![GitHub ★ 1,859](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C859&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/EthanYoQ/AI-Novel-Writer)
<!-- END META -->

> **实现功能**：本地优先小说桌面软件，将设定、蓝图、写稿、审改与定稿组织成逐章流程。

> **核心亮点**：[Q02](#research-q02)、[Q03](#research-q03) 用版本绑定和committed/pending分离把聊天起草转为可追溯、可恢复的章节交付；不把流程完整当文学质量保证。

> **风险与缺陷**：[Q03](#research-q03) 上下文快照固定了选择但不保证充分，早期设定被省略时生成与自审可共同漏检，需原定稿对照而非只信摘要。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 启动与依赖](#detail-section-4)
  - [1.4 启动步骤](#detail-section-5)
  - [1.5 成本](#detail-section-6)
  - [1.6 效果](#detail-section-7)
  - [1.7 工程亮点](#detail-section-8)
  - [1.8 主要限制](#detail-section-9)
  - [1.9 使用建议](#detail-section-10)
  - [1.10 核查说明与分析版本](#detail-section-11)
- [2 未来设计假设（未验证）](#detail-section-12)
- [3 辅助信息](#detail-section-13)
- [4 研究问题与完整回答](#detail-section-14)
  - [Q01 · 根应用是什么，合格小说交付与原办法是什么？](#detail-section-15)
  - [Q02 · 定稿与审稿结果如何绑定版本并恢复未知结果？](#detail-section-16)
  - [Q03 · 有限上下文与版本契约能否保证长篇一致？](#detail-section-17)
  - [Q04 · 模型、审核和恢复的全周期成本是否值得？](#detail-section-18)
  - [Q05 · 设定冲突基准能否决定上下文与审稿策略？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长篇与连载作者在本地作品中组织章节、资料和人工审改，模型由自己配置。

聊天生成加设定文档、手工章节版本是简单基线；没有独立比较写作质量和单位合格稿成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 章节工作流 | 组织生成与作者接受 | 不证明长篇一致性 |
| 上下文快照 | 追溯选择和省略材料 | 哈希不保证充分性 |
| 定稿恢复 | 已提交快照发布到实体稿 | 需区分committed与published |

**流程与依赖**

<a id="detail-section-4"></a>

### 1.3 启动与依赖

| 条件 | 用途 | 退路 |
|---|---|---|
| 桌面环境与本地作品 | 运行和持久写作 | 副本先验 |
| 自配API或Ollama | 生成审改 | 核对费用与外发范围 |
| 作者验收和独立备份 | 质量与退出 | 保存导出不只信状态 |

<a id="detail-section-5"></a>

### 1.4 启动步骤

| 步骤 | 执行者与判据 | 失败处理 |
|---|---|---|
| 副本建设定蓝图 | 作者确认关键约束 | 不直接导唯一原稿 |
| 写一章审改 | 作者核对内容与差异 | 重要设定回原文 |
| 定稿并重开/导出 | 作者核对DB与实体稿 | pending按ID恢复 |

**效果与成本**

<a id="detail-section-6"></a>

### 1.5 成本

| 阶段 | 现金／资源 | 人工／时间 |
|---|---|---|
| 首次 | 桌面/模型/可选检索资源，未知 | 建作品、配模型与设定，未知 |
| 持续 | 规划写稿审改多轮调用，未知 | 逐章检查和版本选择，未知 |
| 失败恢复 | 重试/重建投影资源，未知 | ID对账、备份恢复和原文复查，未知 |

<a id="detail-section-7"></a>

### 1.6 效果

| 任务 | 支持 | 缺口 |
|---|---|---|
| 逐章交接 | 版本、artifact和来源快照 | 文学质量与节时 |
| 定稿恢复 | 同draft复用与按ID发布 | 故障注入/桌面呈现未验 |

> **思考**：[Q03](#research-q03) 上下文快照固定了选择但不保证充分，早期设定被省略时生成与自审可共同漏检，需原定稿对照而非只信摘要。

<a id="detail-section-8"></a>

### 1.7 工程亮点

> **亮点**：[Q02](#research-q02)、[Q03](#research-q03) 用版本绑定和committed/pending分离把聊天起草转为可追溯、可恢复的章节交付；不把流程完整当文学质量保证。

[Q02](#research-q02)、[Q03](#research-q03) 用版本绑定和committed/pending分离把聊天起草转为可追溯、可恢复的章节交付；不把流程完整当文学质量保证。

可借鉴未知结果复用ID、数据库事实源与实体稿投影分离，以及included/omissions共同摘要；迁移需保留提交/发布两态，不能把文件失败误说未提交。

<a id="detail-section-9"></a>

### 1.8 主要限制

[Q03](#research-q03) 上下文快照固定了选择但不保证充分，早期设定被省略时生成与自审可共同漏检，需原定稿对照而非只信摘要。

<a id="detail-section-10"></a>

### 1.9 使用建议

[Q04](#research-q04) 用短篇副本试一章，先明确合格稿标准、费用和人工预算；定稿响应未知先查committed及finalizationId，不重新创建提交。

<a id="detail-section-11"></a>

### 1.10 核查说明与分析版本

**核查状态**：已检查源码。

已检查上下文、审改artifact与定稿恢复核心；未运行，目标回查是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、electron/services/finalization-service.ts、src/services/workflows/context-snapshot.ts、electron/services/review-revision-generation.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根Electron桌面应用；核心上下文/定稿与审稿产物链抽读，不代表全UI、备份、安全或模型质量验收；DSH冻结插件另研究。
- 下一步：隔离作品注入实体稿发布失败和响应丢失，再以跨章冲突案例比较目标回查，记录费用和修订分钟；未执行。

**分析版本**

- **仓库**：[EthanYoQ/AI-Novel-Writer](https://github.com/EthanYoQ/AI-Novel-Writer)
- **版本号**：1.3.2（[固定提交 62880d6](https://github.com/EthanYoQ/AI-Novel-Writer/tree/62880d629af7bbfaf968c0cda5ae76816e917915)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-12"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是将高影响省略约束变为审稿定向回查，以跨章冲突案例对照漏检、误报和作者时间；无改善或成本过高就停止。

隔离作品注入实体稿发布失败和响应丢失，再以跨章冲突案例比较目标回查，记录费用和修订分钟；未执行。

<a id="detail-section-13"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 205 | 13773 | — | — | 389795 |
| .cjs | source | 4 | 138 | 118 | 16 | — |
| .mjs | source | 120 | 47030 | 43274 | 1629 | — |
| .mjs | test | 25 | 11948 | 11269 | 324 | — |
| .ts | source | 521 | 121541 | 106373 | 7134 | — |
| .tsx | source | 138 | 23141 | 20888 | 1036 | — |
| .js | source | 3 | 267 | 250 | 5 | — |
| .ts | test | 471 | 133524 | 122070 | 1230 | — |
| .tsx | test | 88 | 26101 | 23592 | 281 | — |
| .mjs | example | 5 | 3703 | 3575 | 87 | — |
| .ts | example | 2 | 85 | 65 | 15 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 118](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=118&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+created%3A2026-09-27T02%3A11%3A50.268Z..2026-10-27T02%3A11%3A50.268Z) [![近30天关闭 127](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=127&color=737b86&logo=github)](https://github.com/EthanYoQ/AI-Novel-Writer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A11%3A50.268Z..2026-10-27T02%3A11%3A50.268Z)



统计日期：2026-10-27。

<a id="detail-section-14"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查本地小说桌面应用的章节交付、版本恢复与长篇一致性边界。

<a id="research-q01"></a>

<a id="detail-section-15"></a>

### Q01 · 根应用是什么，合格小说交付与原办法是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

根是Pagekin（原AI Novel Writer）的Electron本地优先桌面应用，根package主入口dist-electron/main.js且private，不是DSH插件。面向长篇/连载作者，围绕设定、架构、蓝图、正文、审稿、修稿与定稿推进，用户自配远程API或本地Ollama。合格结果是作者接受、可重开编辑并可导出的章节与作品资料，不能按生成字数或流程阶段数计成功。原办法是聊天起草、手工维护设定文档与章节版本，此应用集中资料与逐章交接；作者仍承担风格、事实、角色和情节验收。README特别注明32秒演示是片长而非生成耗时，不能据视频长度估效率。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/package.json#L1-L12)

根桌面身份与入口。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "ai-novel-writer",
  "version": "1.3.2",
  "description": "AI Novel Writer - a local-first production workspace for long-form fiction",
  "author": "AI Novel Writer Maintainers",
  "private": true,
  "type": "module",
  "packageManager": "pnpm@11.11.0",
  "engines": {
    "node": ">=20"
  },
  "main": "dist-electron/main.js",
```

</details>

**依据 2 · 作者声明**：[README.md:14-24](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/README.md#L14-L24)

作者自配模型、本地作品及演示时长边界。

<details>
<summary>查看原文（11行）</summary>

```text

<p align="center">
  <strong>开源免费的 AI 小说写作桌面软件，为长篇小说和网文连载设计。</strong><br />
  从设定、架构、章节蓝图到正文、审稿、修稿、定稿，一章一章把书写完；也能拆解参考小说来仿写、导入原稿接着续写，或按你的要求改写。<br />
  本地优先：作品存在你自己的电脑上。软件不带模型：接你自己的 API Key，或用 Ollama 跑本地模型。
</p>

<p align="center">
  <a href="https://github.com/EthanYoQ/AI-Novel-Writer/releases/latest"><img src="https://img.shields.io/badge/%E4%B8%8B%E8%BD%BD-Windows%20%7C%20macOS-2b4c8c?style=for-the-badge" alt="下载 Windows 与 macOS 安装包" /></a><br />
  <a href="https://www.orz.md/ai-novel-writer/demo/">观看 32 秒中文实录：选段续写与改成对话</a><br />
  <sub>1.3.0 实录，模型等待段已剪短，AI 配音；32 秒是片长，不是生成耗时。</sub>
```

</details>

**依据 3 · 作者声明**：[README.md:84-105](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/README.md#L84-L105)

逐章审核/恢复/版本与导出声明。

<details>
<summary>查看原文（22行）</summary>

```text
### 正文：写稿、审稿、修稿、定稿

正文单章视图把一章从待写带到定稿。AI 写出草稿后，你可以直接改，也可以让 AI 审稿。审稿报告列出每条意见，你逐条勾选或忽略，也可以加上自己的意见。修稿结果以差异给你逐段确认，不会直接覆盖原稿。确认无误后定稿。

![正文单章视图：左侧是设定、架构、蓝图、正文四步流程，中间是第 3 章正文，右侧是审稿报告](docs/assets/readme/v130-zh-chapter.webp)

写作时，AI 拿到的是这一章的蓝图、相关角色、世界观、前文摘要和上一章全文，而不是整本书的聊天记录。

正文编辑器支持 Tab 插入两个全角空格作为段首缩进。写一章的全过程可以只用键盘完成。

### 运行侧页：看清 AI 正在做什么

所有生成任务都在运行侧页里，分进行中、历史、诊断三页。写作时可以实时看到输出，随时取消。批量创作可以暂停。生成失败时，已经写出的文字会留成恢复候选，可以复制或放弃。

![运行侧页：正在写第 3 章，实时输出逐句出现](docs/assets/readme/v130-zh-run.webp)

### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-16"></a>

### Q02 · 定稿与审稿结果如何绑定版本并恢复未知结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主进程FinalizationService以draftId查既有提交，已有记录但冻结请求不一致即FINALIZATION_COMMIT_CONFLICT，同一请求则复用finalizationId与目标文件名继续发布，避免响应丢失后新UUID造成二次提交。先由repository提交正文快照、内容hash/revision和目标文件，再发布实体稿；失败保留committed=true与pending，retry只接受finalizationId并检查快照完整性，从已提交内容恢复。审稿服务proveArtifact核对artifact所属run、revision、textHash、失败码和finishReason，防止拿别次生成直接作当前报告。源码呈现的是可恢复交付契约，不是全流程运行成功；部分UI与合并应用分支未全量审计。

#### 证据与依据

**依据 1 · 源码核查**：[electron/services/finalization-service.ts:101-134](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/electron/services/finalization-service.ts#L101-L134)

draftId、冻结请求冲突和复用已有提交。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[electron/services/finalization-service.ts:149-200](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/electron/services/finalization-service.ts#L149-L200)

按ID重试、完整性与实体稿发布pending。

<details>
<summary>查看原文（52行）</summary>

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
  }

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
```

</details>

**依据 3 · 源码核查**：[electron/services/review-revision-generation.ts:59-74](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/electron/services/review-revision-generation.ts#L59-L74)

审稿artifact和生成run、revision、hash绑定。

<details>
<summary>查看原文（16行）</summary>

```text
  private requireRun(handle: MainGenerationRunHandle): DurableGenerationRun {
    this.assertCurrent()
    const run = this.runs.get(handle.runId)
    if (run.binding.projectId !== this.scope.projectId || !isDeepStrictEqual(handle, handleOf(run))) throw new Error('GENERATION_RUN_IDENTITY_MISMATCH')
    this.context(run)
    return run
  }
  private proveArtifact(run: DurableGenerationRun, reference: ArtifactRef) {
    if (!reference || Object.keys(reference).some(key => !['artifactId', 'revision', 'textHash'].includes(key))) throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
    const row = this.db.prepare('SELECT attempt_id,run_id,status FROM generation_artifacts WHERE artifact_id=?').get(reference.artifactId) as { attempt_id: string; run_id: string; status: string } | undefined
    if (!row || row.run_id !== run.runId || row.status === 'discarded') throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
    const receipt = this.runs.receipt(row.attempt_id), artifact = receipt.artifact
    if (!artifact || artifact.revision !== reference.revision || artifact.textHash !== reference.textHash
      || textHash(artifact.text) !== reference.textHash || receipt.failureCode || receipt.result?.finishReason !== 'stop'
      || !['settled', 'unknown'].includes(receipt.attempt.status)) throw new Error('GENERATION_REVIEW_ARTIFACT_INVALID')
    return { row, receipt, artifact }
```

</details>

#### 缺口

- 没有响应丢失、文件写失败与重开恢复实验
  **影响**：不能确认实际桌面所有入口正确呈现committed/pending
  **进一步探讨**：隔离作品注入发布失败，回读DB与文件并用相同ID恢复，检查不重复定稿

<a id="research-q03"></a>

<a id="detail-section-17"></a>

### Q03 · 有限上下文与版本契约能否保证长篇一致？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把章节交付和审改产物绑定版本、把定稿数据库提交与实体稿投影分开，相对聊天加文件复制多了恢复与来源追溯。上下文快照把included内容与omissions裁决一起哈希，区分作者约束、定稿事实和参考/未来计划，使“模型实际看到什么”可追问。但哈希只固定选择，不保证选择充分；前文摘要遗漏一条早期伏笔，模型和自审可能都不知道，流程完整仍可写出设定冲突。README也说明不是整本聊天记录。不能把多轮自审当独立质量验证，也不把参考小说“仿写”流程直接等同创作成果的独立性。关键处需回查原始设定和较早定稿。

#### 证据与依据

**依据 1 · 源码核查**：[src/services/workflows/context-snapshot.ts:19-31](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/src/services/workflows/context-snapshot.ts#L19-L31)

不同来源类别和事实/约束区分。

<details>
<summary>查看原文（13行）</summary>

```text
 * S01 的槽位只有三种，比类别粗，所以类别另写在 reason 前缀里（`<category>: ...`），
 * 下游必须按 reason 前缀取类别，slot 只作粗归类。
 *
 * `derived-locator` 映射成 `finalized-fact`：stale 定位唯一能进入 included 的东西
 * 是从同一可读定稿回读到的原文，那已是定稿事实，不是「未确认衔接」。
 * `future-plan` 与 `reference` 只作规划性约束，不构成事实。
 */
const SLOT_BY_CATEGORY = {
  author: 'author-constraint',
  'finalized-history': 'finalized-fact',
  'future-plan': 'author-constraint',
  'derived-locator': 'finalized-fact',
  reference: 'author-constraint',
```

</details>

**依据 2 · 源码核查**：[src/services/workflows/context-snapshot.ts:38-78](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/src/services/workflows/context-snapshot.ts#L38-L78)

实际内容与省略裁决纳入快照摘要。

<details>
<summary>查看原文（41行）</summary>

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
 */
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
```

</details>

**依据 3 · 作者声明**：[README.md:86-90](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/README.md#L86-L90)

人工审改与有限章节上下文。

```text
正文单章视图把一章从待写带到定稿。AI 写出草稿后，你可以直接改，也可以让 AI 审稿。审稿报告列出每条意见，你逐条勾选或忽略，也可以加上自己的意见。修稿结果以差异给你逐段确认，不会直接覆盖原稿。确认无误后定稿。

![正文单章视图：左侧是设定、架构、蓝图、正文四步流程，中间是第 3 章正文，右侧是审稿报告](docs/assets/readme/v130-zh-chapter.webp)

写作时，AI 拿到的是这一章的蓝图、相关角色、世界观、前文摘要和上一章全文，而不是整本书的聊天记录。
```

#### 缺口

- 没有长程伏笔/角色一致性与模型自审漏检对照
  **影响**：不能证明比聊天写作更连贯
  **进一步探讨**：固定同模型预算的早期约束任务，对比摘要策略与人工回查原文

<a id="research-q04"></a>

<a id="detail-section-18"></a>

### Q04 · 模型、审核和恢复的全周期成本是否值得？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次需桌面环境、独立作品和模型/检索配置，根不提供额度；持续成本包括规划、起草、审稿、修稿、复查多轮模型调用和作者时间，本地模型也有硬件与等待资源。所查服务对失败实体稿有可定位ID恢复，但内容已提交与实体文件待发布须分开看，不能未知结果时重新写一份定稿。作者声明有本地备份/WebDAV与恢复新副本，本轮没有独立执行，且远端模型会收到所选写作上下文，作品落本地不等于所有内容不出机。可以在短篇副本试一章，衡量合格稿所需人工修改、调用费及恢复；质量不达标、上下文漏重要设定或成本超预算时保留导出回原编辑器。金额、耗时和质量提升均未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:16-18](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/README.md#L16-L18)

不带模型、自配API或本地模型。

```text
  <strong>开源免费的 AI 小说写作桌面软件，为长篇小说和网文连载设计。</strong><br />
  从设定、架构、章节蓝图到正文、审稿、修稿、定稿，一章一章把书写完；也能拆解参考小说来仿写、导入原稿接着续写，或按你的要求改写。<br />
  本地优先：作品存在你自己的电脑上。软件不带模型：接你自己的 API Key，或用 Ollama 跑本地模型。
```

**依据 2 · 作者声明**：[README.md:96-105](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/README.md#L96-L105)

恢复候选、导出和备份路径为作者声明。

<details>
<summary>查看原文（10行）</summary>

```text
所有生成任务都在运行侧页里，分进行中、历史、诊断三页。写作时可以实时看到输出，随时取消。批量创作可以暂停。生成失败时，已经写出的文字会留成恢复候选，可以复制或放弃。

![运行侧页：正在写第 3 章，实时输出逐句出现](docs/assets/readme/v130-zh-run.webp)

### 作品资料与版本：写长篇不丢线索

- **剧情与伏笔**：按章节看主线、支线和伏笔的进度，记下每条线索在哪一章埋设、推进或解决。
- **知识库**：导入参考资料（.txt、.md）。没有配置检索模型时，也能用本地全文检索。
- **版本历史**：每章的历次稿件都留着，可以和当前稿对比，也可以回退成一份新草稿。
- **导出与备份**：导出为合并 Markdown、分章 Markdown 或 TXT。可以把作品打包存到本机，或备份到你绑定的 WebDAV 云端。恢复时总是另存为一份新副本。
```

</details>

**依据 3 · 源码核查**：[electron/services/finalization-service.ts:168-200](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/electron/services/finalization-service.ts#L168-L200)

已提交后失败的恢复边界。

<details>
<summary>查看原文（33行）</summary>

```text
    if (record.publicationStatus === 'published') {
      return toResult(record, true)
    }
    return this.publishCommitted(request.projectRoot, record)
  }

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
```

</details>

<a id="research-q05"></a>

<a id="detail-section-19"></a>

### Q05 · 设定冲突基准能否决定上下文与审稿策略？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把被省略的高影响约束自动列为待回查项，审稿时针对它们读取原定稿而非只依赖同一摘要，可以减少长程设定漏检。推导来自Q03实际omissions可追溯但不证明充分；新增负担是更多检索、token与人工裁决，不能无限全书塞入。最小验证五个含跨十章伏笔或角色限制的固定案例，同模型同预算比较当前上下文与目标回查，测冲突漏检、误报和作者修订分钟。无漏检改善或总体成本高于人工核查则停止；该假设尚未实现/测试，不计已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/services/workflows/context-snapshot.ts:56-77](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/src/services/workflows/context-snapshot.ts#L56-L77)

省略来源、revision、hash和required标记是回查的具体材料基础。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[electron/services/review-revision-generation.ts:76-90](https://github.com/EthanYoQ/AI-Novel-Writer/blob/62880d629af7bbfaf968c0cda5ae76816e917915/electron/services/review-revision-generation.ts#L76-L90)

审稿构造路径可接入针对性回查，但目前不证明该策略存在。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
