# dsh-run2skill

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[40e7fb7](https://github.com/qkycir-123/dsh-run2skill/tree/40e7fb7c39d2f69fee9becf694ad8e12290229d3)

<!-- BEGIN META -->
[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/qkycir-123/dsh-run2skill) [![npm 30d 1,898](https://img.shields.io/static/v1?label=npm+30d&message=1%2C898&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-run2skill) [![最新发布 2026-10-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-run2skill)
<!-- END META -->

> **功能**：从 DSH 会话提炼可审查的 Skill 提案，确认后按作用域发布。

> **亮点**：[Q01](#research-q01) 连接会话经验和有来源的待审草稿。

> **主要限制**：[Q02](#research-q02) 发布绑定当前项目和审查版本，实际异常恢复与数据边界待验。

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
  - [Q01 · 会话里教给 Agent 的经验如何进入 Skill？](#detail-section-11)
  - [Q02 · 怎样防止过期或错工作区的提案落盘？](#detail-section-12)
  - [Q03 · 怎样判断复用收益高于模型和审核成本？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户反复向 Agent 解释团队工作流，希望将纠正保存为可复用指令。

手写 Skill 并在新会话独立验证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提案 | 将会话纠正转草稿 | 模型处理与人工审核 |
| 发布 | 写入对应 Skill 范围 | 需当前项目绑定与可写目录 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配的 DSH Host 与 Skill 目录 | 必需 | 关联会话和发布文件 | 候选与发布版需分开 |
| 可用模型和可写文件系统 | 提案与发布需要 | 生成和保存 | 不可用或错域时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 捕捉 | 显式标记可复用经验 | 核对项目和对话来源 |
| 审查 | 查看草稿并提出修改 | 确认内容和作用域 |
| 发布 | 核对保存和下次任务触发 | 遇冲突保留记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 配置匹配宿主并准备隔离项目 | 固定候选未走 npm 发布版 |
| 持续 | 模型调用未知 | 人工审查和维护 Skill | 按需关闭自动学习 |
| 失败 | 工时未知 | 检查日志和实际目录 | 错域时用手写流程 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 经验复用 | 从会话生成可审查资产 | 下一次实际收益与污染率 |

> **思考**：[Q02](#research-q02) 发布绑定当前项目和审查版本，实际异常恢复与数据边界待验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 连接会话经验和有来源的待审草稿。

[Q02](#research-q02) 发布重验项目绑定和日志状态，真实异常边界待验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 发布绑定当前项目和审查版本，实际异常恢复与数据边界待验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先显式生成项目草稿，核对下次用法后再扩展。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定 alpha 源码支持核心审批与发布边界，未运行。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/v2-production-runtime.ts、src/adapters/dsh-connection/v2-proposal-rpc.ts、src/adapters/dsh-publication/v2-stock-publication-binding.ts、src/application/publication/v2-proposal-publication.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 alpha 源码的入口、审批、作用域和恢复，未执行 Host 或模型。
- 下一步：对照手写、错项目、目标改写、重启恢复和数据筛选。

**分析版本**

- **仓库**：[qkycir-123/dsh-run2skill](https://github.com/qkycir-123/dsh-run2skill)
- **版本号**：0.5.0-alpha.5（[固定提交 40e7fb7](https://github.com/qkycir-123/dsh-run2skill/tree/40e7fb7c39d2f69fee9becf694ad8e12290229d3)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照手写的用时、审查负担与次轮命中。

对照手写、错项目、目标改写、重启恢复和数据筛选。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 25 | 3932 | — | — | 64419 |
| .mjs | source | 13 | 4083 | 3828 | 28 | — |
| .ts | source | 176 | 40992 | 38425 | 193 | — |
| .ts | test | 135 | 36280 | 33747 | 52 | — |
| .js | example | 4 | 38 | 34 | 0 | — |
| .mjs | test | 2 | 862 | 802 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/qkycir-123/dsh-run2skill/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/qkycir-123/dsh-run2skill/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：怎样把会话纠正变成经审查可复用的 Skill？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话里教给 Agent 的经验如何进入 Skill？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户从会话纠正或显式保存得到候选，可检查来源并审批。生产 runtime 即使关闭自动学习仍允许 EXPLICIT 批次；提案 RPC 先校验当前授权的工作项和版本，再执行批准或拒绝。相较手写文件，减少整理工作并提供审批环节。固定源码为 alpha.5，README 把它与已发布的安装路径分开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-29](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/README.md#L18-L29)

作者描述提案流程。

<details>
<summary>查看原文（12行）</summary>

```text
Run2Skill 把你在 DeepSeek Harness（DSH）里教给 Agent 的纠正、约束和工作流，整理成可复用的 Skill。你查看草稿、提出修改意见，确认后保存。

## 看一遍完整流程

![Run2Skill：打开插件、审核草稿、确认保存](docs/assets/run2skill-demo.gif)

*main 分支界面 · 示例草稿演示*

1. 打开 **左侧栏 → 插件 → Run2Skill**。
2. 查看草稿的用途、适用范围、对话来源和完整内容。
3. 按需提出修改意见，或直接**确认并保存**。
4. 在**最近活动**中查看结果，下次相关任务即可使用这个 Skill。
```

</details>

**依据 2 · 作者声明**：[README.md:42-60](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/README.md#L42-L60)

源码候选与发布版本。

<details>
<summary>查看原文（19行）</summary>

````text
## 安装

源码候选 `0.5.0-alpha.5` 已适配 DSH `0.2.1-rc.2` Web，尚未发布 npm。下面的安装说明对应已发布版本；验证范围见[兼容性](docs/compatibility.md)。

适用于 DSH **0.2.0-rc.2** 的 Windows Desktop 和 Web。

**Desktop**：在应用中通过 **Manage dsh Command…** 配置命令，完成首次启动后退出应用，再运行：

```bash
dsh plugin --profile desktop add dsh-run2skill
```

**Web**：准备好 Node.js `^22.19.0 || >=24.0.0`、`pnpm` 和 `dsh` 命令，再运行：

```bash
dsh plugin --profile web add dsh-run2skill
```

安装后重启 DSH。Run2Skill 使用当前会话选择的模型。版本信息见 [兼容性](docs/compatibility.md)。
````

</details>

**依据 3 · 源码核查**：[src/host/v2-production-runtime.ts:143-173](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/host/v2-production-runtime.ts#L143-L173)

触发条件与提案服务接线。

<details>
<summary>查看原文（31行）</summary>

```text
    this.pipeline = createDshV2PipelineRuntime(domain, {
      llm: options.llm,
      baseline: manifest,
      activity,
      ownership,
      catalog,
      permitBatchDetection: batch => options.automaticLearning?.() !== false
        || batch.triggerReasons.includes('EXPLICIT'),
      onError: () => options.notices.record({ healthCode: 'V2_PIPELINE_FAILED', sessionId: 'global' }),
      ...(options.now === undefined ? {} : { now: options.now }),
    })
    this.scanner = new DshV2GapScanner(
      new DshSessionGapReader(options.persistence),
      domain,
      this.pipeline,
      options.workspace,
      options.notices,
      options.now === undefined ? {} : { now: options.now },
    )
    this.proposals = new V2ProposalHostServices(domain, {
      llm: options.llm,
      registry: options.skills,
      resolveSession: lifecycleKey => {
        const session = options.resolveSession(lifecycleKey)
        return session === undefined
          ? undefined
          : {
              sessionId: session.header.id,
              view: session.view,
              configuration: session.configuration,
              ...(session.workspaceBinding === undefined ? {} : { workspaceBinding: session.workspaceBinding }),
```

</details>

**依据 4 · 源码核查**：[src/adapters/dsh-connection/v2-proposal-rpc.ts:460-506](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/adapters/dsh-connection/v2-proposal-rpc.ts#L460-L506)

引用校验和决定分支。

<details>
<summary>查看原文（47行）</summary>

```text
        }) }
      }
      if (
        authorized.action.subjectId !== parsed.data.workItemId
        || authorized.lineage.revision !== parsed.data.workItemRevision
        || !sameRef(deriveV2ProposalRef(authorized.lineage), parsed.data.proposalRef)
      ) return error('conflict')
      let lineage = authorized.lineage
      let changed = false
      if (revisionData !== undefined) {
        const revisions = options.revisions?.(domain)
        if (revisions === undefined) return error('internal')
        const result = await revisions.revise({
          lineageId: lineage.lineageId,
          expectedLineageRevision: lineage.revision,
          proposalRef: deriveV2ProposalRef(lineage),
          actionId: revisionData.actionId,
          feedback: revisionData.feedback,
        })
        lineage = result.lineage
        changed = result.changed
      }
      if (endpoint === PROPOSALS_REFRESH_ENDPOINT) {
        const refreshes = options.refreshes(domain)
        if (refreshes === undefined) return error('internal')
        const result = await refreshes.refresh({
          lineageId: lineage.lineageId,
          expectedLineageRevision: lineage.revision,
          proposalRef: deriveV2ProposalRef(lineage),
        })
        lineage = result.lineage
        changed = result.changed
      }
      if (endpoint === PROPOSALS_APPROVE_ENDPOINT || endpoint === PROPOSALS_REJECT_ENDPOINT) {
        const reviews = options.reviews(domain)
        if (reviews === undefined) return error('internal')
        const result = endpoint === PROPOSALS_APPROVE_ENDPOINT
          ? await reviews.approve({
              lineageId: lineage.lineageId,
              expectedLineageRevision: lineage.revision,
              proposalRef: deriveV2ProposalRef(lineage),
            })
          : await reviews.reject({
              lineageId: lineage.lineageId,
              expectedLineageRevision: lineage.revision,
              proposalRef: deriveV2ProposalRef(lineage),
            })
```

</details>

#### 缺口

- 无真实会话的提案产出证据
  **影响**：不知道触发召回和审查负担
  **进一步探讨**：在隔离环境录入显式纠正，对照手写 Skill

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样防止过期或错工作区的提案落盘？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

发布重查会话和工作区身份，批准时记录的 workspace ID 或路径摘要不匹配就标陈旧；上下文文件系统不可写或根不可解析则拒绝。发布器在日志恢复中验证匹配并处理外部结果，存在冲突时不能宣告成功。作者称会筛选脱敏后把必要片段交当前模型，真实敏感输入覆盖与异常恢复还需测试。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapters/dsh-publication/v2-stock-publication-binding.ts:183-219](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/adapters/dsh-publication/v2-stock-publication-binding.ts#L183-L219)

当前会话、路径摘要与根核对。

<details>
<summary>查看原文（37行）</summary>

```text
      input.intent.sessionLifecycleKey !== input.batch.sessionLifecycleKey
      || input.batch.sessionLifecycleKey.length === 0
    ) return { status: 'STALE' }
    const session = this.options.resolveSession(input.batch.sessionLifecycleKey)
    if (session === undefined) return { status: 'UNAVAILABLE' }
    const usesContextFileSystem = session.configuration.usesContextFileSystem === true
    const contextFileSystem = usesContextFileSystem
      ? parseWritableDshContextFileSystem(session.filesystem)
      : undefined
    if (usesContextFileSystem && contextFileSystem === undefined) return { status: 'UNAVAILABLE' }
    const scope = input.lineage.persistenceScope
    let workspaceBinding = session.workspaceBinding
    if (scope === 'PROJECT') {
      if (workspaceBinding === undefined) return { status: 'STALE' }
      const approved = input.proposal.projectScopeBinding
      if (
        approved === undefined
        || approved.workspaceId !== workspaceBinding.workspaceId
        || approved.scopeIdentityDigest !== deriveProjectScopeIdentityDigest(workspaceBinding.canonicalPath)
      ) return { status: 'STALE' }
      try {
        workspaceBinding = {
          ...workspaceBinding,
          canonicalPath: contextFileSystem === undefined
            ? await findStockProjectRoot(workspaceBinding.canonicalPath)
            : await findContextProjectRoot(contextFileSystem, workspaceBinding.canonicalPath),
        }
      } catch {
        return { status: 'UNAVAILABLE' }
      }
    }
    const resolution = this.#rootResolver.resolve({
      scope,
      configuration: session.configuration,
      ...(scope === 'PROJECT' ? { workspaceBinding } : {}),
    })
    if (resolution.status !== 'SUPPORTED') return { status: 'STALE' }
```

</details>

**依据 2 · 源码核查**：[src/application/publication/v2-proposal-publication.ts:512-546](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/application/publication/v2-proposal-publication.ts#L512-L546)

发布日志恢复和匹配冲突。

<details>
<summary>查看原文（35行）</summary>

```text
  async #recoverPublicationJournal(): Promise<'IDLE' | 'RECOVERED'> {
    const journal = this.#global.get().proposalCatalogMutationJournal
    if (journal?.kind !== 'PUBLICATION') return 'IDLE'
    const matches = [...this.#lineages.entries()].flatMap(([, raw]) => {
      const parsed = ProposalLineageV2Schema.safeParse(raw)
      if (!parsed.success || parsed.data.origin !== 'RUN2SKILL_V2') return []
      return parsed.data.proposalRevisions.at(-1)?.proposalId === journal.ownerId ? [parsed.data] : []
    })
    if (matches.length !== 1) throw new V2ProposalPublicationError('PUBLICATION_RECOVERY_CONFLICT')
    const lineage = matches[0]!
    const proposal = lineage.proposalRevisions.at(-1)!
    if (lineage.state === 'PUBLISHED' && proposal.publicationReceiptDigest !== undefined) {
      await this.#finalize(journal.ownerId, journal.mutationId)
      return 'RECOVERED'
    }
    if (journal.phase === 'NEEDS_REFRESH') {
      if (journal.failureCode === undefined) {
        throw new V2ProposalPublicationError('PUBLICATION_RECOVERY_CONFLICT')
      }
      await this.#recordFailureIfNeeded(lineage, journal.failureCode)
      await this.#clearJournal(journal.ownerId, journal.mutationId)
      return 'RECOVERED'
    }
    this.#assertPublishable(lineage, journal.phase === 'EXECUTING')
    const input = this.#input(lineage, deriveV2ProposalRef(lineage))
    if (journal.phase === 'EXECUTING') {
      const recovered = publicationRecoveryOutcome(await this.options.recover?.({
        ...input,
        attemptId: journal.mutationId,
      }))
      if (recovered.status !== 'ABSENT') {
        await this.#completeExternalOutcome(input, journal.mutationId, recovered)
        return 'RECOVERED'
      }
      await this.#markPrepared(journal.ownerId, journal.mutationId)
```

</details>

**依据 3 · 作者声明**：[README.md:75-81](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/README.md#L75-L81)

作者的数据存放与模型输入边界。

```text
## 设置

- **自动学习**：自动从对话中整理经验；关闭后仍可明确请求“保存为 Skill”。
- **最近活动**：查看最近 7 天新建或更新的 Skill。
- **清理所有缓存**：预览并清理待处理草稿与中间缓存，保留已保存的 Skill、会话记录和 DSH 设置。

Run2Skill 在本地管理草稿，并将经过筛选和脱敏的必要对话片段交给当前模型分析。详见 [数据存储与升级](docs/storage-and-upgrades.md)。
```

#### 缺口

- 未运行换工作区、外部改写和故障恢复
  **影响**：真实授权及泄露边界未知
  **进一步探讨**：模拟批准后工作区变化、目标冲突、ACK 丢失和重启

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断复用收益高于模型和审核成本？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在固定候选支持的隔离 Host 中关闭自动学习，只用显式项目提案。对照手写 Skill，记录修改次数、下次真实命中、模型开销及错误持久化。若来源无法解释、偏好泛化错误或发布冲突无法恢复，回到手写及人工审阅流程。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/v2-production-runtime.ts:143-151](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/host/v2-production-runtime.ts#L143-L151)

可限制为显式触发。

```text
    this.pipeline = createDshV2PipelineRuntime(domain, {
      llm: options.llm,
      baseline: manifest,
      activity,
      ownership,
      catalog,
      permitBatchDetection: batch => options.automaticLearning?.() !== false
        || batch.triggerReasons.includes('EXPLICIT'),
      onError: () => options.notices.record({ healthCode: 'V2_PIPELINE_FAILED', sessionId: 'global' }),
```

**依据 2 · 作者声明**：[README.md:62-81](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/README.md#L62-L81)

用途、审核和数据开销来源。

<details>
<summary>查看原文（20行）</summary>

```text
## 使用

照常与 Agent 工作，把值得复用的做法说清楚：

- **纠正**：“先写失败测试，再修实现。”
- **约束**：“这个项目的 GitHub 文案统一用中文。”
- **工作流**：“先核对上游版本，再运行兼容性检查。”
- **保存请求**：“把这个流程保存成 Skill，以后复用。”

Run2Skill 在会话空闲或收到保存请求时整理经验。有草稿需要审核时，DSH 会通知你。也可以打开插件页，点击**立即整理本次经验**。

每份草稿都附有对话来源。你可以确认保存、要求修改，或放弃草稿。Skill 支持保存到**当前项目**或**所有项目**，使用 DSH 默认的 Skill 目录。

## 设置

- **自动学习**：自动从对话中整理经验；关闭后仍可明确请求“保存为 Skill”。
- **最近活动**：查看最近 7 天新建或更新的 Skill。
- **清理所有缓存**：预览并清理待处理草稿与中间缓存，保留已保存的 Skill、会话记录和 DSH 设置。

Run2Skill 在本地管理草稿，并将经过筛选和脱敏的必要对话片段交给当前模型分析。详见 [数据存储与升级](docs/storage-and-upgrades.md)。
```

</details>

**依据 3 · 源码核查**：[src/application/publication/v2-proposal-publication.ts:512-546](https://github.com/qkycir-123/dsh-run2skill/blob/40e7fb7c39d2f69fee9becf694ad8e12290229d3/src/application/publication/v2-proposal-publication.ts#L512-L546)

恢复验证需要的异常入口。

<details>
<summary>查看原文（35行）</summary>

```text
  async #recoverPublicationJournal(): Promise<'IDLE' | 'RECOVERED'> {
    const journal = this.#global.get().proposalCatalogMutationJournal
    if (journal?.kind !== 'PUBLICATION') return 'IDLE'
    const matches = [...this.#lineages.entries()].flatMap(([, raw]) => {
      const parsed = ProposalLineageV2Schema.safeParse(raw)
      if (!parsed.success || parsed.data.origin !== 'RUN2SKILL_V2') return []
      return parsed.data.proposalRevisions.at(-1)?.proposalId === journal.ownerId ? [parsed.data] : []
    })
    if (matches.length !== 1) throw new V2ProposalPublicationError('PUBLICATION_RECOVERY_CONFLICT')
    const lineage = matches[0]!
    const proposal = lineage.proposalRevisions.at(-1)!
    if (lineage.state === 'PUBLISHED' && proposal.publicationReceiptDigest !== undefined) {
      await this.#finalize(journal.ownerId, journal.mutationId)
      return 'RECOVERED'
    }
    if (journal.phase === 'NEEDS_REFRESH') {
      if (journal.failureCode === undefined) {
        throw new V2ProposalPublicationError('PUBLICATION_RECOVERY_CONFLICT')
      }
      await this.#recordFailureIfNeeded(lineage, journal.failureCode)
      await this.#clearJournal(journal.ownerId, journal.mutationId)
      return 'RECOVERED'
    }
    this.#assertPublishable(lineage, journal.phase === 'EXECUTING')
    const input = this.#input(lineage, deriveV2ProposalRef(lineage))
    if (journal.phase === 'EXECUTING') {
      const recovered = publicationRecoveryOutcome(await this.options.recover?.({
        ...input,
        attemptId: journal.mutationId,
      }))
      if (recovered.status !== 'ABSENT') {
        await this.#completeExternalOutcome(input, journal.mutationId, recovered)
        return 'RECOVERED'
      }
      await this.#markPrepared(journal.ownerId, journal.mutationId)
```

</details>

#### 缺口

- 未独立核验作者的宿主支持或实际成本
  **影响**：是否值得自动学习未知
  **进一步探讨**：固定任务对照两个流程，比较草稿和下一次执行

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
