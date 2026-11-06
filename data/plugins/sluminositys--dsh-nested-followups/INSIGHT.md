# dsh-nested-followups

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[75c2ca3](https://github.com/sluminositys/dsh-nested-followups/tree/75c2ca392b8303f9d57ef15cb951d35e9088eebc)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/sluminositys/dsh-nested-followups) [![npm 30d 1,051](https://img.shields.io/static/v1?label=npm+30d&message=1%2C051&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nested-followups) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-nested-followups)
<!-- END META -->

> **功能**：以真实只读子会话组织递归侧问，提供树导航、继续分支及级联删除或归档。

> **亮点**：把递归独立Session、只读工具执行、路径导航和两阶段清理组合为附着侧问工作流。见 [Q04](#research-q04)。

> **主要限制**：选中中间回答吸附turn尾；只读不等读权限隔离，文件不快照；并发Continue/delete窗口与archive残留需核。见 [Q01](#research-q01)至[Q03](#research-q03)。

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
  - [Q01 · 递归追问怎样真正隔开上下文，所选答案就是准确切点吗？](#detail-section-11)
  - [Q02 · 只读与身份、并发恢复究竟保障到哪一层？](#detail-section-12)
  - [Q03 · 级联删除到底删除数据，还是只是藏起来？](#detail-section-13)
  - [Q04 · 相对原生fork多做什么，缓存、兼容和成本如何理解？](#detail-section-14)
  - [Q05 · 谁可试用，优先验证哪个方向能决定生产价值？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长任务多层侧问与主线分离，原生fork加人工记录是基线。见 [Q01](#research-q01)。

主线追问，或原生fork/新会话并人工记录祖先路径、继续和清理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 递归fork | 保留祖先侧问 | 完成turn尾，非任意中间切点 |
| Continue | 同分支线性追问 | 当前idle尾/owned runtime |
| 执行只读 | 禁未知/写工具 | 依赖Host guard，非读权限隔离 |
| 树导航/恢复 | 附着路径/持久状态 | 文件共享，UI状态浏览器保存 |
| 级联清理 | cancel/标记/cleanup | archive不等物理删除 |
| 重试 | requestId/lineage核对 | 非跨域恰一次事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node^22.19或>=24/DSH精确多段peer范围 | 声明 | Host/构建 | 不推断全范围验收 |
| storageDomain/sessions/persistence | 必需 | 关系与真实日志 | 无完整树 |
| agents/tools.guard/origin保留 | 突变必需 | 独立只读分支 | 禁创建/继续，树可读 |
| sessionDeletion v1或archiveSession | 清理必需 | 删除或归档 | 缺则禁删除 |
| Client slots/Remote/locale/React^18.2 | 必需 | 树导航/动作 | 无Web入口 |
| 模型/provider配置 | 生成所需 | 侧问回复 | 成功提交不等答案 |
| Desktop内置CLI/desktop profile | Desktop所需 | 正确安装位置 | web安装不等桌面 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 隔离profile/非敏感完成回合 | 核Host能力 |
| 创建 | 选答案→安全turn尾→独立Session | 核seed/只读/主线日志 |
| 继续 | 当前分支idle尾单操作 | busy/冲突不新建盲重试 |
| 恢复 | 重启/同requestId | 核关系/状态与真实Session |
| 清理 | 确认→cancel→标记→cleanup | pending不等已删 |
| 退出 | 回Chat/移插件 | Session历史仍管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/环境费用未知 | profile/guard/seed验证 | 作者测试非本次通过 |
| 持续使用 | 模型token/日志/布局资源未知 | 树整理/兼容维护 | 缓存未实测 |
| 失败恢复 | 重试生成/存储未知 | requestId/孤儿/pending核对 | 无跨域事务 |
| 退出 | 分支历史可能保留 | 归档/清理/备份各管 | 不删主线或工作区 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主线分离 | 独立Session+祖先seed | 实际任务探索质量 |
| 只读工具 | 名称guard未知拒绝 | Host嵌套合同/恶意同名 |
| 树恢复 | metadata+真实日志 | 崩溃/并发一致性 |
| 删除 | 两阶段/模式能力 | archive非物理擦除 |
| 缓存 | 尽量保持preset/prompt | 命中率/节约费用 |

> **思考**：选中中间回答吸附turn尾；只读不等读权限隔离，文件不快照；并发Continue/delete窗口与archive残留需核。见 [Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把递归独立Session、只读工具执行、路径导航和两阶段清理组合为附着侧问工作流。见 [Q04](#research-q04)。

边界/适配/持久metadata分层可复用；跨Session事务与同树互斥仍是关键取舍。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

选中中间回答吸附turn尾；只读不等读权限隔离，文件不快照；并发Continue/delete窗口与archive残留需核。见 [Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立profile单树串行操作，核两层seed/只读/恢复与archive；不明保留证据回Chat。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

分支create/Continue/guard/持久恢复和删除/归档关键源码已核；未运行目标或固定Host验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.ts、src/client/projection-controller.ts、src/client/view/ConversationTreeCanvas.tsx、src/client/view/state.ts、src/host/adapter/read-only.ts、src/host/adapter/session-delete.ts、src/host/adapter/visibility.ts、src/host/branch-service.ts、src/host/delete-service.ts、src/host/metadata-service.ts、src/host/safe-boundary.ts、src/host/storage.ts、src/host/tree-service.ts、src/shared/tool-policy.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核Client入口/Remote/投影watch与确认、Host安全切点/create/continue/guard/恢复/metadata/级联cleanup；未全审画布布局/全部测试，未运行固定Host/模型/目标。
- 下一步：隔离profile五并发/故障对照并核真实Session/归档，未执行。

**分析版本**

- **仓库**：[sluminositys/dsh-nested-followups](https://github.com/sluminositys/dsh-nested-followups)
- **版本号**：0.2.3（[固定提交 75c2ca3](https://github.com/sluminositys/dsh-nested-followups/tree/75c2ca392b8303f9d57ef15cb951d35e9088eebc)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

复用requestId/metadata/删除状态给同树revision仲裁，五故障对照；Host已有则组合。见 [Q05](#research-q05)。

隔离profile五并发/故障对照并核真实Session/归档，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 1425 | — | — | 11878 |
| .mjs | source | 1 | 27 | 24 | 0 | — |
| .ts | source | 45 | 7445 | 6571 | 332 | — |
| .tsx | source | 7 | 1966 | 1860 | 30 | — |
| .ts | test | 34 | 6332 | 5706 | 41 | — |
| .ts | example | 4 | 509 | 471 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/sluminositys/dsh-nested-followups/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/sluminositys/dsh-nested-followups/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)

暂未获取：近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：递归分支的上下文、只读执行、继续/删除与持久失败是否符合实际合同？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 递归追问怎样真正隔开上下文，所选答案就是准确切点吗？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向长任务中反复岔开概念/方案问题、又不想污染主线的DSH用户。基线是主线追问或原生fork/新会话后人工管理路径；合格是每个分支只自动继承指定祖先边界、可继续/再分叉且主线日志不被追加分支问题。树画布只是导航，贡献需由独立会话与记录关系支持。

Client挂conversation.view与header切换，create/continue/delete经Remote传ownerSessionId及锚点。Host branch service读真实live或持久Session，resolveTree核锚点属于该树；安全边界要求事件seq从0连续、选中assistant存在且所属turn已有turn/end、最后可见面为有文字assistant。若点的是同turn较早assistant，会吸附到该turn尾部，不是逐字停在所选中间回答；seed还包含turn/end后直到下一turn/start前的稳定事件。选区只有未吸附且UTF16起止/正文严格匹配才有效，否则拒绝。

先持久creating记录并保留tree/parent/seedLength，再Agent.create(seed,origin=subagent,cwd继承,source preset setup)，执行时装readOnly guard，agentOptions从seed中最后request header恢复显式provider/model/maxTokens/reasoning，adapter默认不强写。submit以clientRequestId作durable user message ID，followup后返回messageId，后台whenIdle再按turn/end记ready/failed并dispose handle。返回成功是已提交，不等模型完成或答案正确。Continue仅该分支最新完成assistant尾、lineage一致且idle；冷会话resume同preset+guard，正在原生runtime打开的Agent拒绝接管。

可以在后代同样再fork，未见插件深度上限，但受模型上下文、存储/布局/Host资源限制。没有自动把分支结果回写主线，用户要人工采纳；这与可读文件/会话访问权限隔离是两回事。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:57-109](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/client/index.ts#L57-L109)

真实Remote菜单/视图动作。

<details>
<summary>查看原文（53行）</summary>

```text
  ctx.slots.inject('conversation.view', () => ctx.slots.register({
    name: 'conversation.view',
    id: TREE_VIEW_ID,
    order: 20,
    locale: NS,
    label: () => t('view.tree'),
    inject: (sessionId: SessionId): ConversationTreeViewInjected => {
      const controller = controllerFor(sessionId)
      return {
        hooks: { treeProjection: controller },
        ensure: () => controller.ensure(),
        askFollowUp: async ({ clientRequestId, anchor, question, anchorRange }) => {
          const result = await ctx.remote.nestedFollowups.createBranch({
            ownerSessionId: String(sessionId),
            clientRequestId,
            anchor: {
              sessionId: anchor.sessionId,
              messageId: anchor.messageId,
              seq: anchor.seq,
              ...(anchorRange === undefined ? {} : { range: anchorRange }),
            },
            question,
          })
          if (!result.ok) throw commandError(result.error)
          if (!result.value.ok) throw commandError(result.value.error)
        },
        continueBranch: async ({ clientRequestId, tail, question }) => {
          if (tail.branchId === null) throw new Error('Continue is not available on the main conversation.')
          const result = await ctx.remote.nestedFollowups.continueBranch({
            ownerSessionId: String(sessionId),
            clientRequestId,
            branchId: tail.branchId,
            tail: {
              sessionId: tail.sessionId,
              messageId: tail.messageId,
              seq: tail.seq,
            },
            question,
          })
          if (!result.ok) throw commandError(result.error)
          if (!result.value.ok) throw commandError(result.value.error)
        },
        deleteBranch: async ({ branchId }) => {
          const result = await ctx.remote.nestedFollowups.deleteBranch({
            ownerSessionId: String(sessionId),
            branchId,
          })
          if (!result.ok) throw commandError(result.error)
          if (!result.value.ok) throw commandError(result.value.error)
        },
      }
    },
  }, ConversationTreeView))
```

</details>

**依据 2 · 源码核查**：[src/host/safe-boundary.ts:47-122](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/safe-boundary.ts#L47-L122)

连续事件/完成尾部/稳定事件切点。

<details>
<summary>查看原文（76行）</summary>

```text

function validateContiguous(events: readonly SessionEvent[]): void {
  for (let index = 0; index < events.length; index++) {
    if (events[index]?.seq !== index) {
      throw new BranchBoundaryError(
        'invalid-log',
        `session events must be contiguous from seq 0; expected ${index}, received ${String(events[index]?.seq)}`,
      )
    }
  }
}

/**
 * Resolve an assistant message to the completed turn tail that DSH can safely
 * seed. A later open turn does not affect an earlier completed turn.
 */
export function resolveBranchBoundary(
  events: readonly SessionEvent[],
  selectedMessageId: string,
): ResolvedBranchBoundary {
  validateContiguous(events)
  const selected = events.find((event): event is SessionEvent<'assistant/message'> =>
    event.type === 'assistant/message' && String(event.data.message.id) === selectedMessageId)
  if (selected === undefined) {
    throw new BranchBoundaryError(
      'anchor-not-found',
      `assistant message '${selectedMessageId}' is not present in the session log`,
    )
  }

  const turn = selected.data.turn
  const turnEnd = events.find((event): event is SessionEvent<'turn/end'> =>
    event.type === 'turn/end' && event.data.turn === turn && event.seq > selected.seq)
  if (turnEnd === undefined) {
    throw new BranchBoundaryError(
      'turn-open',
      `turn ${turn} containing assistant message '${selectedMessageId}' has not completed`,
    )
  }

  const turnSurface = events.filter(event =>
    event.seq <= turnEnd.seq
    && isSurfaceMessage(event)
    && (event.type !== 'assistant/message' || event.data.turn === turn))
  const finalSurface = turnSurface.at(-1)
  if (finalSurface?.type !== 'assistant/message'
    || finalSurface.data.turn !== turn
    || !hasVisibleText(finalSurface.data.message.content)) {
    throw new BranchBoundaryError(
      'turn-tail-unavailable',
      `turn ${turn} does not end in a finalized assistant text message`,
    )
  }

  let seedLength = turnEnd.seq + 1
  while (seedLength < events.length && events[seedLength]?.type !== 'turn/start') seedLength++
  const forkBoundarySeq = seedLength - 1
  const seed = selectForkSeedRc7(
    SessionId('branch-boundary-validation'),
    events,
    forkBoundarySeq,
  )
  const anchorMessageId = String(finalSurface.data.message.id)
  return Object.freeze({
    selectedMessageId,
    selectedSeq: selected.seq,
    anchorMessageId,
    anchorSeq: finalSurface.seq,
    turn,
    turnEndSeq: turnEnd.seq,
    forkBoundarySeq,
    seedLength: seed.length,
    seed: Object.freeze(seed),
    snappedToTurnTail: anchorMessageId !== selectedMessageId,
  })
}
```

</details>

**依据 3 · 源码核查**：[src/host/branch-service.ts:201-238](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L201-L238)

锚点/owner与预留。

<details>
<summary>查看原文（38行）</summary>

```text
  private async createBranchChecked(request: CreateBranchRequest): Promise<BranchCommandResult> {
    const source = await this.readSession(request.anchor.sessionId)
    const { tree, parentBranch } = await this.resolveTree(
      request.ownerSessionId,
      request.anchor.sessionId,
      source.header,
    )
    let boundary
    try {
      boundary = resolveBranchBoundary(source.events, request.anchor.messageId)
    } catch (error: unknown) {
      throw new BranchCommandError(
        'anchor-invalid',
        error instanceof Error ? error.message : String(error),
        { cause: error },
      )
    }
    if (boundary.selectedSeq !== request.anchor.seq) {
      throw new BranchCommandError(
        'anchor-invalid',
        `anchor seq ${request.anchor.seq} does not identify message '${request.anchor.messageId}'`,
      )
    }
    const anchorRange = this.validateRange(request.anchor.range, source.events, boundary)
    const prompt = formatAnchoredQuestion(request.question, anchorRange)
    const reservation = await this.withReservationLock(
      [
        tree.treeId,
        parentBranch?.branchId ?? '',
        String(source.header.id),
        boundary.anchorMessageId,
      ].join('\u0000'),
      async (): Promise<BranchReservation> => {
        const existing = this.metadata.repository.getBranchByClientRequest(
          tree.treeId,
          request.clientRequestId,
        )
        if (existing !== undefined) return { kind: 'existing', branch: existing }
```

</details>

**依据 4 · 源码核查**：[src/host/branch-service.ts:278-327](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L278-L327)

create和followup/失败。

<details>
<summary>查看原文（50行）</summary>

```text
    const record = reservation.branch
    const branchId = record.branchId
    const childSessionId = SessionId(record.sessionId)
    this.notify(tree.rootSessionId)
    let handle: AgentHandle | undefined
    try {
      const sourceAgentOptions = this.ctx.agents.get(source.header.id)?.options
      handle = await createReadOnlyForkAgent(this.ctx, this.ctx.agents, {
        sessionId: childSessionId,
        sourceHeader: source.header,
        seed: boundary.seed,
        ...sourceAgentOptions === undefined ? {} : { fallbackAgentOptions: sourceAgentOptions },
      })
      this.rememberHandle(handle)
    } catch (error: unknown) {
      await this.metadata.repository.deleteBranchRecord(branchId)
      this.notify(tree.rootSessionId)
      throw new BranchCommandError(
        'fork-failed',
        `could not create branch session: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }

    await this.metadata.repository.putBranch({ ...record, status: 'running' })
    this.notify(tree.rootSessionId)
    try {
      const activityEpoch = this.beginActivity(handle)
      const messageId = submitBranchTurnRc7(
        handle.agent,
        prompt,
        request.clientRequestId,
      )
      void this.observeSettlement(handle, branchId, tree.rootSessionId, activityEpoch)
      return commandSuccess({
        action: 'create-branch',
        branchId,
        sessionId: String(childSessionId),
        messageId,
      })
    } catch (error: unknown) {
      await this.metadata.repository.putBranch({ ...record, status: 'failed' })
      this.notify(tree.rootSessionId)
      await this.releaseHandle(handle)
      throw new BranchCommandError(
        'prompt-failed',
        `branch was created but the first prompt was not accepted: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }
```

</details>

**依据 5 · 源码核查**：[src/host/adapter/read-only.ts:75-101](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L75-L101)

从seed请求header恢复路由。

<details>
<summary>查看原文（27行）</summary>

```text
  events: readonly SessionEvent[],
  fallback: AgentOptions = {},
): AgentOptions {
  const header = foldRequestHeader(events)
  // reasoningEffort was added to AgentOptions after the original rc contract.
  // Keep explicit choices, but let each provider recompute its own defaults.
  const config = (header?.config ?? fallback) as AgentOptions & { readonly reasoningEffort?: string }
  const defaults = header?.adapterDefaults as { readonly reasoningEffort?: boolean } | undefined
  const reasoning = config.reasoningEffort === undefined || defaults?.reasoningEffort === true
    ? {} : { reasoningEffort: config.reasoningEffort }
  if (header === undefined) {
    return {
      ...reasoning,
      ...fallback.provider === undefined ? {} : { provider: fallback.provider },
      ...fallback.model === undefined ? {} : { model: fallback.model },
      ...fallback.maxTokens === undefined ? {} : { maxTokens: fallback.maxTokens },
    }
  }
  return {
    ...reasoning,
    provider: header.config.provider,
    model: header.config.model,
    ...header.config.maxTokens === undefined || header.adapterDefaults?.maxTokens === true
      ? {}
      : { maxTokens: header.config.maxTokens },
  }
}
```

</details>

**依据 6 · 源码核查**：[src/host/adapter/read-only.ts:165-194](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L165-L194)

同preset/create setup与hidden seed。

<details>
<summary>查看原文（30行）</summary>

```text
export function createReadOnlyBranchSetup(
  ctx: Context,
  presetId: string | undefined,
): (agentCtx: Context) => Promise<void> {
  return async (agentCtx: Context): Promise<void> => {
    const presets = ctx.get('agentPresets')
    if (presets !== undefined) await presets.mount(agentCtx, presetId)
    applyReadOnlyScopeRc7(agentCtx)
  }
}

/** Create one fork-seeded, origin-classified Agent without using apiproxy. */
export function createReadOnlyForkAgent(
  ctx: Context,
  agents: BranchAgentRegistry,
  input: ReadOnlyForkInput,
): Promise<AgentHandle> {
  const presetId = resolveSourcePresetRc7(input.sourceHeader, input.seed)
  const creation = hiddenBranchCreation(input.sourceHeader, input.seed.length, presetId)
  return (agents as unknown as CompatibleBranchAgentRegistry).create({
    sessionId: input.sessionId,
    seed: input.seed,
    meta: creation.meta as unknown as Record<string, unknown>,
    ...(creation.inheritedEventCount === undefined
      ? {}
      : { inheritedEventCount: creation.inheritedEventCount }),
    agentOptions: resolveBranchAgentOptionsRc7(input.seed, input.fallbackAgentOptions),
    setup: createReadOnlyBranchSetup(ctx, presetId),
  })
}
```

</details>

**依据 7 · 源码核查**：[src/host/branch-service.ts:330-417](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L330-L417)

继续分支核尾/lineage/idle。

<details>
<summary>查看原文（88行）</summary>

```text
  private async continueBranchChecked(request: ContinueBranchRequest): Promise<BranchCommandResult> {
    const branch = this.metadata.repository.getBranch(request.branchId)
    if (branch === undefined || branch.status === 'deleted' || branch.deletedAt !== undefined) {
      throw new BranchCommandError('branch-not-found', `branch '${request.branchId}' does not exist`)
    }
    const tree = this.metadata.repository.getTree(branch.treeId)
    if (tree === undefined || !this.ownerBelongsToTree(request.ownerSessionId, tree)) {
      throw new BranchCommandError('tree-mismatch', 'the requested branch is not owned by this conversation tree')
    }
    if (request.tail.sessionId !== branch.sessionId) {
      throw new BranchCommandError('branch-not-tail', 'Continue must target the current branch session')
    }

    const snapshot = await this.readSession(branch.sessionId)
    this.assertBranchLineage(branch, snapshot.header, snapshot.seedLength)
    const duplicate = userMessageById(snapshot.events, request.clientRequestId)
    if (duplicate !== undefined) {
      if (messageText(duplicate.data.content) !== request.question) {
        throw new BranchCommandError(
          'request-conflict',
          `client request '${request.clientRequestId}' was already used with different content`,
        )
      }
      return commandSuccess({
        action: 'continue-branch',
        branchId: branch.branchId,
        sessionId: branch.sessionId,
        messageId: request.clientRequestId,
      })
    }

    const tail = lastVisibleBranchMessage(snapshot.events, branch.seedLength)
    if (tail?.type !== 'assistant/message'
      || String(tail.data.message.id) !== request.tail.messageId
      || tail.seq !== request.tail.seq) {
      throw new BranchCommandError(
        'branch-not-tail',
        'Continue is only available on the latest completed assistant message in a branch',
      )
    }
    try {
      const boundary = resolveBranchBoundary(snapshot.events, request.tail.messageId)
      if (boundary.selectedSeq !== request.tail.seq || boundary.anchorMessageId !== request.tail.messageId) {
        throw new Error('the selected message is not the completed turn tail')
      }
    } catch (error: unknown) {
      throw new BranchCommandError(
        'branch-not-tail',
        error instanceof Error ? error.message : String(error),
        { cause: error },
      )
    }

    const liveAgent = this.ctx.agents.get(SessionId(branch.sessionId))
    let handle: AgentHandle
    if (liveAgent === undefined) {
      handle = await resumeReadOnlyBranchAgentRc7(this.ctx, this.ctx.agents, {
        sessionId: SessionId(branch.sessionId),
        header: snapshot.header,
        events: snapshot.events,
      })
      this.rememberHandle(handle)
    } else {
      this.assertBranchLineage(
        branch,
        liveAgent.session.header,
        sessionSeedLength(liveAgent.session),
      )
      handle = this.requireOwnedHandle(liveAgent)
    }
    const agent = handle.agent
    this.assertBranchLineage(branch, agent.session.header, sessionSeedLength(agent.session))
    if (agent.status !== 'idle') {
      throw new BranchCommandError('branch-busy', 'wait for the current branch turn to finish before continuing')
    }

    await this.metadata.repository.putBranch({ ...branch, status: 'running' })
    this.notify(tree.rootSessionId)
    try {
      const activityEpoch = this.beginActivity(handle)
      const messageId = submitBranchTurnRc7(agent, request.question, request.clientRequestId)
      void this.observeSettlement(handle, branch.branchId, tree.rootSessionId, activityEpoch)
      return commandSuccess({
        action: 'continue-branch',
        branchId: branch.branchId,
        sessionId: branch.sessionId,
        messageId,
      })
```

</details>

**依据 8 · 源码核查**：[src/host/branch-service.ts:653-671](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L653-L671)

选区真实正文验证。

<details>
<summary>查看原文（19行）</summary>

```text
  private validateRange(
    range: CreateBranchRequest['anchor']['range'],
    events: readonly SessionEvent[],
    boundary: ReturnType<typeof resolveBranchBoundary>,
  ): AnchorRange | undefined {
    if (range === undefined) return undefined
    if (boundary.snappedToTurnTail) {
      throw new BranchCommandError('anchor-invalid', 'a text range cannot be retained when the anchor snaps to the turn tail')
    }
    const selected = events.find((event): event is SessionEvent<'assistant/message'> =>
      event.type === 'assistant/message' && String(event.data.message.id) === boundary.anchorMessageId)
    const text = selected === undefined ? undefined : messageText(selected.data.message.content)
    if (text === undefined
      || range.start >= range.end
      || range.end > text.length
      || text.slice(range.start, range.end) !== range.text) {
      throw new BranchCommandError('anchor-invalid', 'the selected text range no longer matches the persisted Markdown source')
    }
    return { start: range.start, end: range.end, text: range.text }
```

</details>

**依据 9 · 源码核查**：[src/host/branch-service.ts:714-738](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L714-L738)

settlement后台状态/释放。

<details>
<summary>查看原文（25行）</summary>

```text
  private async observeSettlement(
    handle: AgentHandle,
    branchId: string,
    rootSessionId: string,
    activityEpoch: number,
  ): Promise<void> {
    const agent = handle.agent
    const sessionId = String(agent.id)
    try {
      await agent.whenIdle()
      if (this.activityEpochs.get(sessionId) !== activityEpoch) return
      const current = this.metadata.repository.getBranch(branchId)
      if (current === undefined || current.status === 'deleted' || current.deletedAt !== undefined) return
      await this.metadata.repository.putBranch({
        ...current,
        status: settledStatus(snapshotSessionEvents(agent.session)),
      })
      this.notify(rootSessionId)
    } catch (error: unknown) {
      this.ctx.logger.warn(`branch '${branchId}' settlement could not be recorded: ${String(error)}`)
    } finally {
      if (this.activityEpochs.get(sessionId) === activityEpoch && agent.status === 'idle') {
        await this.releaseHandle(handle)
      }
    }
```

</details>

**依据 10 · 源码核查**：[src/host/adapter/read-only.ts:214-233](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L214-L233)

实际用户消息followup。

<details>
<summary>查看原文（20行）</summary>

```text
export function submitBranchTurnRc7(
  agent: Agent,
  question: string,
  durableMessageId?: string,
): string {
  if (question.trim().length === 0) throw new TypeError('branch question must not be empty')
  const message = durableMessageId === undefined
    ? createUserMessage({
      content: [{ type: 'text', text: question }],
      source: { kind: 'user' },
    })
    : freezeMessage({
      id: MessageId(durableMessageId),
      role: 'user' as const,
      content: [{ type: 'text' as const, text: question }],
      source: { kind: 'user' as const },
    })
  agent.followup(message)
  return String(message.id)
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 只读与身份、并发恢复究竟保障到哪一层？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

guard按工具名允许明确read/search/session查询/job或terminal读取/list_agents/get_goal，其他未知拒绝；run_code运输层被允许，前提是所有嵌套调用重新进同Agent guarded pipeline。它不删除工具定义/改prompt，且preset先mount再guard，源码可说明保护意图；固定Host guard单调拒绝及CodeMode嵌套归属本次未独立验。名称不是实现来源认证，同名恶意实现仍是边界。分支本身会写Session/插件metadata，故“cannot modify anything”应解释为受管工具不写共享任务资源，不是零写入。

共享cwd未做文件快照，侧问可读主线当前未完成文件，session查询工具也不提供该树专属保密权限；“只祖先上下文”是自动seed，不代表模型永远不能通过允许读取获取其他材料。origin=subagent只负责普通列表隐藏，visibility probe验证prepare保留标记，不证明所有第三方UI都隐藏；Remote owner属于树是对象关系检查，浏览器用户/租户授权由Host承担。

同request pending Promise合并，完成后移除；已有Branch+durable message ID和内容对照支持重试恢复。正在pending的同key不同payload先共享结果而不当场核差异，后续持久重试才检查；不是通用事务幂等平台。ordinal锁只对同anchor预留串行，Agent生成在锁外。持久metadata表与Session不是跨域事务：Agent.create失败删除metadata但不显式补偿可能已部分创建Session，创建后标running写失败也未见统一回滚；恢复路径能重用相同Session并检查seed/origin/parent，但需用户重试触发，不宣称自动扫描所有孤儿修复。

Continue不同request ID之间无分支级互斥：各自在await putBranch前可读到同一tail与idle，后续可能双提交；删除与创建/继续也没有共用锁或删除epoch。两阶段删除snapshot之后若新增后代，或旧continue恢复running覆盖deleted，存在并发一致性窗口；这是控制流条件推断，不称实际复现。应在单操作完成后再动该树，不能据组件内pending断言多窗口安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/tool-policy.ts:12-53](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/shared/tool-policy.ts#L12-L53)

工具白名单与run_code合同。

<details>
<summary>查看原文（42行）</summary>

```text
export const READ_ONLY_TOOL_NAMES: ReadonlySet<string> = Object.freeze(new Set([
  // @deepseek-ai/dsh-tool-fs
  'read',
  'read_image',
  // @deepseek-ai/dsh-tool-fs-search
  'glob',
  'grep',
  // @deepseek-ai/dsh-tool-lsp
  'lsp',
  // @deepseek-ai/dsh-tool-session-query
  'session_event_read',
  'session_event_search',
  'session_event_trace',
  'session_search',
  'session_trace',
  // @deepseek-ai/dsh-tool-jobs — readers only; job_kill mutates
  'job_list',
  'job_output',
  // @deepseek-ai/dsh-tool-terminal — readers only; open/close/send/signal mutate
  'terminal_list',
  'terminal_read',
  // @deepseek-ai/dsh-tool-subagent-control — reader only
  'list_agents',
  // @deepseek-ai/dsh-tool-goal — reader only
  'get_goal',
]))

/**
 * Code Mode's reserved transport.
 *
 * `run_code` mutates nothing itself, and every binding a program calls
 * re-enters the guarded pipeline carrying the same agent, so each nested read
 * stays allowed and each nested mutation is denied by the same guard. Denying
 * the transport would instead remove reads from Code Mode deployments without
 * preventing anything.
 */
export const TRANSPORT_TOOL_NAMES: ReadonlySet<string> = Object.freeze(new Set(['run_code']))

/** Whether a branch may execute this tool. */
export function isBranchExecutableTool(name: string): boolean {
  return TRANSPORT_TOOL_NAMES.has(name) || READ_ONLY_TOOL_NAMES.has(name)
}
```

</details>

**依据 2 · 源码核查**：[src/host/adapter/read-only.ts:59-64](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L59-L64)

实际执行guard。

```text

/** Monotonic denial of every non-read tool, evaluated per call at execution time. */
export function readOnlyBranchGuard(execution: Readonly<ToolExecution>): string | undefined {
  return isBranchExecutableTool(execution.name) ? undefined : DENIAL
}

```

**依据 3 · 源码核查**：[src/host/adapter/read-only.ts:129-174](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L129-L174)

能力探测/同preset后guard。

<details>
<summary>查看原文（46行）</summary>

```text
export function probeReadOnlyCapabilityRc7(ctx: Context): ReadOnlyCapability {
  const agents = ctx.get('agents')
  if (agents === undefined
    || typeof agents.get !== 'function'
    || typeof agents.create !== 'function'
    || typeof agents.resume !== 'function') {
    return { supported: false, reason: 'The DSH Agent registry is unavailable.' }
  }
  const tools = ctx.get('tools')
  if (tools === undefined || typeof tools.guard !== 'function') {
    return { supported: false, reason: 'Agent-scoped tool guards are unavailable.' }
  }
  return { supported: true }
}

/**
 * Install the branch's execution gate.
 *
 * Only a guard is installed. Restricting the visible tool set, overriding the
 * presentation transport, or editing the assembled prompt would all change the
 * request prefix and forfeit the provider's cache of the mainline prefix the
 * branch was forked from — so every limitation lives at execution time
 * instead, where it costs nothing before the first token.
 */
export function applyReadOnlyScopeRc7(agentCtx: Context): void {
  const tools = agentCtx.get('tools')
  if (tools === undefined) throw new ReadOnlyCapabilityError()
  tools.guard(readOnlyBranchGuard)
}

/**
 * Compose a branch scope that matches the mainline byte for byte, then gate it.
 *
 * Joining the source session's preset is what keeps the assembled prefix
 * identical; the guard added afterwards is invisible to prompt assembly.
 */
export function createReadOnlyBranchSetup(
  ctx: Context,
  presetId: string | undefined,
): (agentCtx: Context) => Promise<void> {
  return async (agentCtx: Context): Promise<void> => {
    const presets = ctx.get('agentPresets')
    if (presets !== undefined) await presets.mount(agentCtx, presetId)
    applyReadOnlyScopeRc7(agentCtx)
  }
}
```

</details>

**依据 4 · 源码核查**：[src/host/adapter/visibility.ts:40-84](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/visibility.ts#L40-L84)

origin与cwd/seed继承。

<details>
<summary>查看原文（45行）</summary>

```text
/** Build the immutable rc.7 header fields that keep a branch out of workspace lists. */
export function hiddenBranchMetaRc7(
  sourceHeader: SessionHeader,
  seedLength: number,
  agentPreset?: string,
): HiddenBranchMeta {
  return {
    ...(sourceHeader.cwd === undefined ? {} : { cwd: sourceHeader.cwd }),
    parentSession: sourceHeader.id,
    seedLength,
    origin: HIDDEN_BRANCH_ORIGIN,
    ...(agentPreset === undefined ? {} : { agentPreset }),
  }
}

/**
 * Map one plugin branch cut to the seeded-session contract supported by the
 * running DSH generation. rc keeps `seedLength` in the header; 0.1.2 requires
 * `isSeeded` plus a separately supplied `inheritedEventCount`.
 */
export function hiddenBranchCreation(
  sourceHeader: SessionHeader,
  seedLength: number,
  agentPreset?: string,
): HiddenBranchCreation {
  if (!Number.isSafeInteger(seedLength) || seedLength < 0) {
    throw new TypeError('branch seed length must be a non-negative safe integer')
  }
  if (!usesInheritedEventCount(sourceHeader)) {
    return { meta: hiddenBranchMetaRc7(sourceHeader, seedLength, agentPreset) }
  }
  return {
    meta: {
      ...(sourceHeader.cwd === undefined ? {} : { cwd: sourceHeader.cwd }),
      parentSession: sourceHeader.id,
      isSeeded: true,
      origin: HIDDEN_BRANCH_ORIGIN,
      ...(agentPreset === undefined ? {} : { agentPreset }),
    },
    inheritedEventCount: seedLength,
  }
}

/**
 * Probe origin retention with an unpublished Session. This validates the Host
```

</details>

**依据 5 · 源码核查**：[src/host/branch-service.ts:188-199](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L188-L199)

pending只按key合并。

<details>
<summary>查看原文（12行）</summary>

```text
  private runOnce(
    key: string,
    operation: () => Promise<BranchCommandResult>,
  ): Promise<BranchCommandResult> {
    const current = this.pending.get(key)
    if (current !== undefined) return current
    const pending = operation().finally(() => {
      if (this.pending.get(key) === pending) this.pending.delete(key)
    })
    this.pending.set(key, pending)
    return pending
  }
```

</details>

**依据 6 · 源码核查**：[src/host/branch-service.ts:267-303](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L267-L303)

Agent失败删除记录、后置running写。

<details>
<summary>查看原文（37行）</summary>

```text
    if (reservation.kind === 'existing') {
      this.assertMatchingCreateRetry(reservation.branch, request, boundary, anchorRange)
      return this.recoverExistingCreate(
        reservation.branch,
        source.header,
        boundary.seed,
        prompt,
        tree.rootSessionId,
      )
    }

    const record = reservation.branch
    const branchId = record.branchId
    const childSessionId = SessionId(record.sessionId)
    this.notify(tree.rootSessionId)
    let handle: AgentHandle | undefined
    try {
      const sourceAgentOptions = this.ctx.agents.get(source.header.id)?.options
      handle = await createReadOnlyForkAgent(this.ctx, this.ctx.agents, {
        sessionId: childSessionId,
        sourceHeader: source.header,
        seed: boundary.seed,
        ...sourceAgentOptions === undefined ? {} : { fallbackAgentOptions: sourceAgentOptions },
      })
      this.rememberHandle(handle)
    } catch (error: unknown) {
      await this.metadata.repository.deleteBranchRecord(branchId)
      this.notify(tree.rootSessionId)
      throw new BranchCommandError(
        'fork-failed',
        `could not create branch session: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }

    await this.metadata.repository.putBranch({ ...record, status: 'running' })
    this.notify(tree.rootSessionId)
```

</details>

**依据 7 · 源码核查**：[src/host/branch-service.ts:383-411](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L383-L411)

Continue idle到异步写/submit的窗口。

<details>
<summary>查看原文（29行）</summary>

```text
    const liveAgent = this.ctx.agents.get(SessionId(branch.sessionId))
    let handle: AgentHandle
    if (liveAgent === undefined) {
      handle = await resumeReadOnlyBranchAgentRc7(this.ctx, this.ctx.agents, {
        sessionId: SessionId(branch.sessionId),
        header: snapshot.header,
        events: snapshot.events,
      })
      this.rememberHandle(handle)
    } else {
      this.assertBranchLineage(
        branch,
        liveAgent.session.header,
        sessionSeedLength(liveAgent.session),
      )
      handle = this.requireOwnedHandle(liveAgent)
    }
    const agent = handle.agent
    this.assertBranchLineage(branch, agent.session.header, sessionSeedLength(agent.session))
    if (agent.status !== 'idle') {
      throw new BranchCommandError('branch-busy', 'wait for the current branch turn to finish before continuing')
    }

    await this.metadata.repository.putBranch({ ...branch, status: 'running' })
    this.notify(tree.rootSessionId)
    try {
      const activityEpoch = this.beginActivity(handle)
      const messageId = submitBranchTurnRc7(agent, request.question, request.clientRequestId)
      void this.observeSettlement(handle, branch.branchId, tree.rootSessionId, activityEpoch)
```

</details>

**依据 8 · 源码核查**：[src/host/branch-service.ts:505-595](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L505-L595)

已有记录重试恢复。

<details>
<summary>查看原文（91行）</summary>

```text
  private async recoverExistingCreate(
    branch: BranchRecord,
    sourceHeader: SessionHeader,
    seed: readonly SessionEvent[],
    prompt: string,
    rootSessionId: string,
  ): Promise<BranchCommandResult> {
    let snapshot: SessionSnapshot | undefined
    try {
      snapshot = await this.readSession(branch.sessionId)
    } catch (error: unknown) {
      if (!(error instanceof BranchCommandError) || error.code !== 'session-not-found') throw error
    }

    if (snapshot !== undefined) {
      this.assertBranchLineage(branch, snapshot.header, snapshot.seedLength)
      const duplicate = userMessageById(snapshot.events, branch.clientRequestId)
      if (duplicate !== undefined) {
        if (messageText(duplicate.data.content) !== prompt) {
          throw new BranchCommandError(
            'request-conflict',
            `client request '${branch.clientRequestId}' was already used with different content`,
          )
        }
        return commandSuccess({
          action: 'create-branch',
          branchId: branch.branchId,
          sessionId: branch.sessionId,
          messageId: branch.clientRequestId,
        })
      }
      const otherLocalPrompt = snapshot.events.find(event =>
        event.seq >= branch.seedLength
        && event.type === 'user/message'
        && event.data.source.kind === 'user')
      if (otherLocalPrompt !== undefined) {
        throw new BranchCommandError(
          'request-conflict',
          `branch '${branch.branchId}' already contains another first prompt`,
        )
      }
    }

    const liveAgent = this.ctx.agents.get(SessionId(branch.sessionId))
    let handle: AgentHandle
    if (liveAgent === undefined) {
      const sourceAgentOptions = this.ctx.agents.get(sourceHeader.id)?.options
      handle = snapshot === undefined
        ? await createReadOnlyForkAgent(this.ctx, this.ctx.agents, {
          sessionId: SessionId(branch.sessionId),
          sourceHeader,
          seed,
          ...sourceAgentOptions === undefined ? {} : { fallbackAgentOptions: sourceAgentOptions },
        })
        : await resumeReadOnlyBranchAgentRc7(this.ctx, this.ctx.agents, {
          sessionId: SessionId(branch.sessionId),
          header: snapshot.header,
          events: snapshot.events,
        })
      this.rememberHandle(handle)
    } else {
      handle = this.requireOwnedHandle(liveAgent)
    }
    const agent = handle.agent
    this.assertBranchLineage(branch, agent.session.header, sessionSeedLength(agent.session))
    if (agent.status !== 'idle') {
      throw new BranchCommandError('branch-busy', 'wait for the current branch turn to finish before retrying')
    }

    await this.metadata.repository.putBranch({ ...branch, status: 'running' })
    this.notify(rootSessionId)
    try {
      const activityEpoch = this.beginActivity(handle)
      const messageId = submitBranchTurnRc7(agent, prompt, branch.clientRequestId)
      void this.observeSettlement(handle, branch.branchId, rootSessionId, activityEpoch)
      return commandSuccess({
        action: 'create-branch',
        branchId: branch.branchId,
        sessionId: branch.sessionId,
        messageId,
      })
    } catch (error: unknown) {
      await this.metadata.repository.putBranch({ ...branch, status: 'failed' })
      this.notify(rootSessionId)
      await this.releaseHandle(handle)
      throw new BranchCommandError(
        'prompt-failed',
        `the recovered branch did not accept its first prompt: ${error instanceof Error ? error.message : String(error)}`,
        { cause: error },
      )
    }
```

</details>

**依据 9 · 源码核查**：[src/host/storage.ts:82-116](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/storage.ts#L82-L116)

表关系检查和单条put，非跨Session事务。

<details>
<summary>查看原文（35行）</summary>

```text

  async putBranch(record: BranchRecord): Promise<BranchRecord> {
    const next = freezeBranch(record)
    if (this.getTree(next.treeId) === undefined) {
      throw new Error(`conversation tree '${next.treeId}' does not exist`)
    }
    if (next.parentBranchId === next.branchId) {
      throw new Error(`branch '${next.branchId}' cannot be its own parent`)
    }
    if (next.parentBranchId !== null) {
      const parent = this.branches.get(next.parentBranchId)
      if (parent === undefined || parent.treeId !== next.treeId) {
        throw new Error(`parent branch '${next.parentBranchId}' does not exist in tree '${next.treeId}'`)
      }
      if (parent.sessionId !== next.parentSessionId) {
        throw new Error(`branch '${next.branchId}' source session does not match its parent branch`)
      }
    }
    const existingAtSession = this.getBranchBySession(next.sessionId)
    if (existingAtSession !== undefined && existingAtSession.branchId !== next.branchId) {
      throw new Error(`session '${next.sessionId}' already belongs to another branch`)
    }
    const existingAtRequest = this.getBranchByClientRequest(next.treeId, next.clientRequestId)
    if (existingAtRequest !== undefined && existingAtRequest.branchId !== next.branchId) {
      throw new Error(`client request '${next.clientRequestId}' already created another branch`)
    }
    const existing = this.branches.get(next.branchId)
    if (existing !== undefined
      && (existing.treeId !== next.treeId || existing.sessionId !== next.sessionId)) {
      throw new Error(`branch '${next.branchId}' cannot change tree or session identity`)
    }
    await this.branches.put(next.branchId, next)
    return next
  }

```

</details>

**依据 10 · 源码核查**：[src/host/branch-service.ts:598-650](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L598-L650)

lineage与owner树关系。

<details>
<summary>查看原文（53行）</summary>

```text
  private assertBranchLineage(
    branch: BranchRecord,
    header: SessionHeader,
    seedLength: number | undefined,
  ): void {
    if (String(header.id) !== branch.sessionId
      || header.origin !== 'subagent'
      || String(header.parentSession) !== branch.parentSessionId
      || seedLength !== branch.seedLength) {
      throw new BranchCommandError(
        'tree-mismatch',
        `session '${branch.sessionId}' no longer matches its immutable branch lineage`,
      )
    }
  }

  private async resolveTree(
    ownerSessionId: string,
    anchorSessionId: string,
    anchorHeader: SessionHeader,
  ): Promise<{ tree: TreeRecord; parentBranch: BranchRecord | undefined }> {
    const repository = this.metadata.repository
    const ownerBranch = repository.getBranchBySession(ownerSessionId)
    let tree = ownerBranch === undefined
      ? repository.getTreeByRootSession(ownerSessionId)
      : repository.getTree(ownerBranch.treeId)
    const parentBranch = repository.getBranchBySession(anchorSessionId)

    if (tree === undefined) {
      if (ownerSessionId !== anchorSessionId || anchorHeader.origin === 'subagent') {
        throw new BranchCommandError('tree-mismatch', 'the anchor is not owned by the requested root conversation')
      }
      tree = await repository.putTree({
        treeId: ownerSessionId,
        rootSessionId: ownerSessionId,
        version: 1,
        createdAt: anchorHeader.createdAt,
        updatedAt: Date.now(),
      })
    }

    const anchorBelongs = parentBranch === undefined
      ? anchorSessionId === tree.rootSessionId
      : parentBranch.treeId === tree.treeId
    if (!anchorBelongs) {
      throw new BranchCommandError('tree-mismatch', 'the anchor belongs to another conversation tree')
    }
    return { tree, parentBranch }
  }

  private ownerBelongsToTree(ownerSessionId: string, tree: TreeRecord): boolean {
    if (ownerSessionId === tree.rootSessionId) return true
    return this.metadata.repository.getBranchBySession(ownerSessionId)?.treeId === tree.treeId
```

</details>

#### 缺口

- 固定Host guard/CodeMode执行合同、授权与并发/崩溃窗口未实际验。
  **影响**：不能认证恶意插件隔离、多窗口原子化或无孤儿/双提交。
  **进一步探讨**：隔离profile对嵌套写工具、两个Continue和delete/create竞态、各持久写故障做非敏感验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 级联删除到底删除数据，还是只是藏起来？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

UI先按当前projection计算子树分支/消息数量并确认，archive模式附提示，失败保留错误。Host再次读树计可见消息并核owner/target同tree；不信任UI传计数。但UI确认与执行间不是同revision快照，因此有并发变化时数量是预览/执行各自所见，不能保证绝对无变化。

协调器先对同树记录构造children图并检测cycle，底向上列后代；cancel所有creating/running Agent并等idle，任一取消失败直接返回cancel-failed，尚未开始全树标记。然后逐条metadata标deleted，再逐条cleanup；失败回cleanup-pending且保留tombstone，树投影跳过标记项。重试同branch可继续cleanup，只有全部成功后才删metadata记录。逐条标记或最后删记录自身也会失败，不是单事务；不能把“two phase”当数据库原子提交。

cleanup优先仅在sessionPersistence显式advertise sessionDeletion.version=1且deleteSession存在时物理删除，否则调用workspaceRegistry.archiveSession；没有两者则禁删除。归档成功仅从树和正常列表移除，Session内容可能仍留Host。卸插件关闭domain/Client observers，不主动清树/Session；无法承诺隐私擦除、云模型已接收内容或备份删除。并发新增/继续窗口见Q02，删除前应停生成且逐树单操作，重要分支先备份/导出原会话。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/view/ConversationTreeCanvas.tsx:158-169](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/client/view/ConversationTreeCanvas.tsx#L158-L169)

确认文案含archive语义。

<details>
<summary>查看原文（12行）</summary>

```text

export function deletionConfirmationDescription(
  labels: TreeViewLabels,
  impact: { readonly branchCount: number; readonly messageCount: number },
  mode: 'delete' | 'archive',
): string {
  return [
    labels.deleteDescription(impact.branchCount, impact.messageCount),
    mode === 'archive' ? labels.deleteArchiveNotice : '',
  ].filter(Boolean).join(' ')
}

```

</details>

**依据 2 · 源码核查**：[src/client/view/ConversationTreeCanvas.tsx:724-740](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/client/view/ConversationTreeCanvas.tsx#L724-L740)

确认执行及失败保留。

<details>
<summary>查看原文（17行）</summary>

```text
  const confirmDelete = (): void => {
    if (deleteRequest === null || onDeleteBranch === undefined) return
    setDeletePending(true)
    setDeleteFailure(null)
    void onDeleteBranch(deleteRequest).then(() => {
      setDeletePending(false)
      setDeleteRequest(null)
    }, (error: unknown) => {
      setDeletePending(false)
      setDeleteFailure(errorMessage(error))
    })
  }

  const requestBranchDelete = (branchId: string): void => {
    const impact = branchDeleteImpact(projection, branchId)
    setDeleteRequest({ branchId, ...impact })
  }
```

</details>

**依据 3 · 源码核查**：[src/host/tree-service.ts:249-275](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/tree-service.ts#L249-L275)

Host重读树计数后委派。

<details>
<summary>查看原文（27行）</summary>

```text
  async deleteBranch(request: DeleteBranchRequest): Promise<DeleteBranchResult> {
    const deletion = this.deletion
    if (deletion === undefined) return deletionUnavailable()
    const read = await this.readTree({ sessionId: request.ownerSessionId })
    if (!read.ok) {
      return Object.freeze({
        ok: false,
        error: Object.freeze({
          code: 'tree-mismatch',
          message: `session '${request.ownerSessionId}' does not own an available conversation tree`,
        }),
      })
    }
    const visibleMessagesByBranch = new Map<string, number>()
    for (const node of read.value.projection.nodes) {
      if (node.branchId === null) continue
      visibleMessagesByBranch.set(
        node.branchId,
        (visibleMessagesByBranch.get(node.branchId) ?? 0) + 1,
      )
    }
    return deletion.deleteBranch(request, visibleMessagesByBranch)
  }

  private get metadata(): NestedFollowupsMetadataService {
    return this.ctx.nestedFollowupsMetadata
  }
```

</details>

**依据 4 · 源码核查**：[src/host/delete-service.ts:64-121](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/delete-service.ts#L64-L121)

真实子树图/顺序/cycle。

<details>
<summary>查看原文（58行）</summary>

```text
/** Determine the exact descendant set and bottom-up order before mutating it. */
export function planCascadeDeletion(
  records: readonly BranchRecord[],
  treeId: string,
  targetBranchId: string,
  visibleMessagesByBranch: ReadonlyMap<string, number> = new Map(),
): CascadeDeletionPlan {
  const inTree = records.filter(record => record.treeId === treeId)
  const byId = new Map(inTree.map(record => [record.branchId, record] as const))
  const target = byId.get(targetBranchId)
  if (target === undefined) {
    throw new BranchDeletionError(
      'branch-not-found',
      `branch '${targetBranchId}' does not exist in tree '${treeId}'`,
    )
  }
  const children = new Map<string, BranchRecord[]>()
  for (const record of inTree) {
    if (record.parentBranchId === null) continue
    const bucket = children.get(record.parentBranchId) ?? []
    bucket.push(record)
    children.set(record.parentBranchId, bucket)
  }
  for (const bucket of children.values()) {
    bucket.sort((left, right) => left.createdAt - right.createdAt || left.branchId.localeCompare(right.branchId))
  }

  const visiting = new Set<string>()
  const visited = new Set<string>()
  const ordered: BranchRecord[] = []
  const visit = (record: BranchRecord): void => {
    if (visited.has(record.branchId)) return
    if (visiting.has(record.branchId)) {
      throw new BranchDeletionError(
        'branch-cycle',
        `branch '${record.branchId}' participates in a parent cycle`,
      )
    }
    visiting.add(record.branchId)
    for (const child of children.get(record.branchId) ?? []) visit(child)
    visiting.delete(record.branchId)
    visited.add(record.branchId)
    ordered.push(record)
  }
  visit(target)

  return Object.freeze({
    treeId,
    targetBranchId,
    branches: Object.freeze(ordered),
    branchCount: ordered.length,
    visibleMessageCount: ordered.reduce(
      (total, record) => total + (visibleMessagesByBranch.get(record.branchId) ?? 0),
      0,
    ),
  })
}

```

</details>

**依据 5 · 源码核查**：[src/host/delete-service.ts:133-195](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/delete-service.ts#L133-L195)

先取消/标记/cleanup/最后删记录。

<details>
<summary>查看原文（63行）</summary>

```text
    targetBranchId: string,
    visibleMessagesByBranch: ReadonlyMap<string, number> = new Map(),
  ): Promise<CascadeDeletionResult> {
    const records = this.repository.listBranches(treeId)
    if (!records.some(record => record.branchId === targetBranchId)) {
      return {
        status: 'already-absent',
        branchCount: 0,
        visibleMessageCount: 0,
        cleanupMode: this.sessions.mode,
      }
    }
    const plan = planCascadeDeletion(records, treeId, targetBranchId, visibleMessagesByBranch)

    for (const branch of plan.branches) {
      if (branch.status !== 'creating' && branch.status !== 'running') continue
      try {
        await this.sessions.cancel(branch.sessionId)
      } catch (error: unknown) {
        throw new BranchDeletionError(
          'cancel-failed',
          `failed to cancel branch session '${branch.sessionId}'`,
          { cause: error },
        )
      }
    }

    const deletedAt = this.now()
    for (const branch of plan.branches) {
      await this.repository.putBranch({
        ...branch,
        status: 'deleted',
        deletedAt: branch.deletedAt ?? deletedAt,
      })
    }
    this.onMarked()

    for (const branch of plan.branches) {
      try {
        await this.sessions.cleanup(branch.sessionId)
      } catch (error: unknown) {
        return {
          status: 'cleanup-pending',
          branchCount: plan.branchCount,
          visibleMessageCount: plan.visibleMessageCount,
          cleanupMode: this.sessions.mode,
          failedSessionId: branch.sessionId,
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    for (const branch of plan.branches) {
      await this.repository.deleteBranchRecord(branch.branchId)
    }
    return {
      status: 'deleted',
      branchCount: plan.branchCount,
      visibleMessageCount: plan.visibleMessageCount,
      cleanupMode: this.sessions.mode,
    }
  }
}
```

</details>

**依据 6 · 源码核查**：[src/host/delete-service.ts:234-292](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/delete-service.ts#L234-L292)

归属校验和pending返回。

<details>
<summary>查看原文（59行）</summary>

```text
        capability.supported ? 'Branch cleanup is unavailable.' : capability.reason,
      )
    }
    const repository = this.metadata.repository
    const ownerBranch = repository.getBranchBySession(request.ownerSessionId)
    const tree = ownerBranch === undefined
      ? repository.getTreeByRootSession(request.ownerSessionId)
      : repository.getTree(ownerBranch.treeId)
    if (tree === undefined) {
      return deleteFailure('tree-mismatch', 'the requested conversation does not own a follow-up tree')
    }
    const target = repository.getBranch(request.branchId)
    if (target !== undefined && target.treeId !== tree.treeId) {
      return deleteFailure('tree-mismatch', 'the requested branch belongs to another conversation tree')
    }

    const sessions: BranchSessionCleanupPort = {
      mode: cleanup.mode,
      cancel: async (sessionId) => {
        const agent = this.ctx.agents.get(SessionId(sessionId))
        if (agent === undefined || agent.status === 'idle') return
        agent.cancel({ kind: 'user' })
        await agent.whenIdle()
      },
      cleanup: sessionId => cleanup.cleanup(sessionId),
    }
    const coordinator = new CascadeDeleteCoordinator(
      repository,
      sessions,
      Date.now,
      () => { this.notify(tree.rootSessionId) },
    )
    let result: CascadeDeletionResult
    try {
      result = await coordinator.delete(tree.treeId, request.branchId, visibleMessagesByBranch)
    } catch (error: unknown) {
      if (error instanceof BranchDeletionError && error.code === 'cancel-failed') {
        return deleteFailure('cancel-failed', error.message)
      }
      throw error
    }
    this.notify(tree.rootSessionId)
    if (result.status === 'cleanup-pending') {
      return deleteFailure(
        'cleanup-pending',
        `The branch is hidden, but cleanup of Session '${result.failedSessionId}' failed: ${result.message}`,
      )
    }
    return Object.freeze({
      ok: true,
      value: Object.freeze({
        status: result.status,
        branchCount: result.branchCount,
        visibleMessageCount: result.visibleMessageCount,
        cleanupMode: result.cleanupMode,
      }),
    })
  }

```

</details>

**依据 7 · 源码核查**：[src/host/adapter/session-delete.ts:43-78](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/session-delete.ts#L43-L78)

物理delete显式能力或archive。

<details>
<summary>查看原文（36行）</summary>

```text
export function probeSessionDeletionCapability(ctx: Context): SessionDeletionCapability {
  const persistence = ctx.get('sessionPersistence') as FutureSessionPersistence | undefined
  if (typeof persistence?.[SESSION_DELETE_METHOD] === 'function'
    && persistence.capabilities?.sessionDeletion?.version === 1) {
    return { supported: true, mode: 'delete', method: SESSION_DELETE_METHOD }
  }
  const registry = ctx.get('workspaceRegistry') as Rc7WorkspaceRegistry | undefined
  if (typeof registry?.[SESSION_ARCHIVE_METHOD] === 'function') {
    return { supported: true, mode: 'archive', method: SESSION_ARCHIVE_METHOD }
  }
  return {
    supported: false,
    reason: 'This DSH build exposes neither physical Session deletion nor the official archive operation.',
  }
}

export function createSessionCleanupAdapter(ctx: Context): SessionCleanupAdapter | undefined {
  const capability = probeSessionDeletionCapability(ctx)
  if (!capability.supported) return undefined
  if (capability.mode === 'delete') {
    const persistence = ctx.get('sessionPersistence') as FutureSessionPersistence
    return {
      mode: 'delete',
      cleanup: async (sessionId) => {
        await persistence[SESSION_DELETE_METHOD]!(sessionId)
      },
    }
  }
  const registry = ctx.get('workspaceRegistry') as Rc7WorkspaceRegistry
  return {
    mode: 'archive',
    cleanup: async (sessionId) => {
      await registry[SESSION_ARCHIVE_METHOD]!(SessionId(sessionId))
    },
  }
}
```

</details>

**依据 8 · 源码核查**：[src/host/metadata-service.ts:22-31](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/metadata-service.ts#L22-L31)

退出关闭domain不删除。

<details>
<summary>查看原文（10行）</summary>

```text
  protected async [Service.init](): Promise<void> {
    const domain = await this.ctx.storageDomain.open(nestedFollowupsDomainSpec)
    this.currentRepository = new TreeMetadataRepository(
      domain.table('trees'),
      domain.table('branches'),
    )
    this.ctx.effect(() => async () => {
      this.currentRepository = undefined
      await domain.close()
    }, 'nested-followups.domain-close')
```

</details>

#### 缺口

- 各Host archive/delete真实持久语义、备份清除及崩溃后再重试未运行核验。
  **影响**：树不可见不等物理删除；pending需保留记录排查。
  **进一步探讨**：隔离三层树注入取消/cleanup/metadata失败，重启重试并核真实Session存储。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 相对原生fork多做什么，缓存、兼容和成本如何理解？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

实际增量是把递归侧问与祖先路径关系、只读执行、线性Continue、可视导航和两阶段清理组织成同一工作流。原生fork/新会话已有独立Session与Agent，存储、模型执行、工具guard、可选服务和Web槽均继承；画布本身不等生产功能突破。相比手动fork后记关系，用户将探索任务组织成主线+附属只读侧问，有局部任务组织变化，但未替用户形成新业务交付/验收，未核明确此前被排除的人群，也未改变算力供给/采购/计价/服务责任。

同preset与seed重用尽量不改工具/系统提示，有助provider prefix cache；缓存命中与字节完全相同还依赖Host当前preset版本、组装默认、provider协议和具体请求，不能把README“byte-for-byte”当本次网络实测或费用节省。文件状态仍共享，历史继承增加token/日志，深树需要布局/读取所有相关Session，成本不由无深度限制消失。

0.2.3 MIT，Node^22.19或>=24；engines精确多段DSH范围：rc.7至<0.1.1预发行、0.1.1rc至<0.1.2、0.1.2alpha至<0.2、0.2.0rc.2至<0.3。作者当前目标0.2.1-rc.5，声明范围不等所有版本都通过。需storageDomain/agents/sessions/persistence、tools.guard和隐藏origin能力；缺关键突变能力保留只读树。物理清理另看delete能力，否则archive。Client需slots/Remote/locale与Host渲染，React^18.2；开发版本peer面广，升级需核合同。

首次用独立profile和非敏感完成回合，fork→再fork→Continue→重启读回→取消/归档逐个核验；Web和Desktop profile不同，Desktop作者要求内置CLI且完全退出后装，不能混用web命令。持续费用由用户承担模型token、持久历史/metadata和画布资源，现金与人工未知；潜在缓存/少上下文污染的收益需对照原生fork实测。恢复要保留requestId和cleanup-pending，避免反复新建；退出恢复Chat即可继续主线，移除插件后分支历史/元数据仍需独立管理。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:35-58](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/README.md#L35-L58)

版本安装与精确0.2.3作者要求。

<details>
<summary>查看原文（24行）</summary>

````text
Choose the install path that matches your DeepSeek Harness line:

| DeepSeek Harness | Plugin source | Status |
| --- | --- | --- |
| `0.1.0-rc.7` through `0.1.1-rc.2` | npm `dsh-nested-followups@0.2.3` | Legacy host support retained |
| `0.2.1-rc.5` Web / official Desktop | npm `dsh-nested-followups@0.2.3` | Current development target |
| `0.2.1-alpha.1`, `0.2.2-alpha.2` | Same package | Additional verified preview targets |

**DSH `0.2.1-rc.5`: use the exact plugin version below.** If Plugin Hub reports
that `dsh-nested-followups@0.2.2` is incompatible, it installed the old artifact,
even if its command said `@latest`. A fresh rc.5 profile reproduced that fallback
after `0.2.3` was published; explicitly requesting `@0.2.3` installs successfully.
pnpm 11's default [one-day release-age window](https://pnpm.io/blog/releases/11.0#security--build-defaults)
can cause this immediately after a release. Do not grant a compatibility
exemption to `0.2.2` or disable the profile's release-age protection.

### Web

```sh
dsh plugin --profile web add dsh-nested-followups@0.2.3
```

Restart the DeepSeek Harness web profile if it is already running, open a
conversation, and select **Tree View**.
````

</details>

**依据 2 · 源码核查**：[README.md:84-106](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/README.md#L84-L106)

Desktop profile/内置CLI范围。

<details>
<summary>查看原文（23行）</summary>

````text
### Official Desktop

Desktop uses the same Web UI, so the plugin does not need a separate canvas or
an Electron extension. Its plugins belong to the **`desktop` profile**, not
`web`; installing into one does not enable it in the other.

1. Launch a supported DSH Desktop version once. Use **Manage dsh Command… → Install**
   in its application menu to install the bundled CLI.
2. **Fully quit Desktop** (closing its window may only hide it).
3. Run the following command using Desktop's bundled `dsh`:

   ```sh
   dsh plugin --profile desktop add dsh-nested-followups@0.2.3
   ```

4. Reopen Desktop and select **Tree View** in a conversation. For a built local
   checkout, substitute `.` for the package name and run from that checkout.

Do not use npm's `dsh` or `pnpm dlx` for the `desktop` profile: only the bundled
command can manage it. Existing global installations can shadow that command;
check `dsh --version` and your shell's command path first. npm installation in
Desktop uses its bundled runtime; only source builds need separate Node and pnpm.
See the [official Desktop instructions](https://github.com/deepseek-ai/deepseek-harness/blob/dsh-v0.2.1-rc.5/apps/desktop/README.md#bundled-command-runtime).
````

</details>

**依据 3 · 源码核查**：[README.md:193-211](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/README.md#L193-L211)

只读与缓存作者主张。

<details>
<summary>查看原文（19行）</summary>

```text
### Read-only branch execution

Branches share the main conversation's working directory, so allowing a side
question to write would be unsafe. The plugin therefore checks tools when they
actually run. Read operations are permitted; writes and unknown tools are
refused by default.

Allowed tools are `read`, `read_image`, `glob`, `grep`, `lsp`, the `session_*`
query tools, `job_list`, `job_output`, `terminal_list`, `terminal_read`,
`list_agents`, and `get_goal`. Code Mode's `run_code` remains available because
every tool it invokes is checked individually.

### Provider prefix-cache reuse

A branch joins the same preset as its parent and does not rewrite tool
definitions, prompt sections, or presentation format. Its request therefore
starts with the same bytes as the parent request at the branch point. Providers
that cache request prefixes can reuse that context instead of reading the
inherited conversation again.
```

</details>

**依据 4 · 源码核查**：[package.json:20-34](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/package.json#L20-L34)

许可/Node/DSH实际声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "license": "MIT",
  "type": "module",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/sluminositys/dsh-nested-followups.git"
  },
  "bugs": {
    "url": "https://github.com/sluminositys/dsh-nested-followups/issues"
  },
  "homepage": "https://github.com/sluminositys/dsh-nested-followups#readme",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.0-rc.7 <0.1.1-0 || >=0.1.1-rc.1 <0.1.2-0 || >=0.1.2-alpha.1 <0.2.0-0 || >=0.2.0-rc.2 <0.3.0-0"
  },
```

</details>

**依据 5 · 源码核查**：[src/host/adapter/read-only.ts:146-172](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/adapter/read-only.ts#L146-L172)

不改工具/提示而执行guard的设计。

<details>
<summary>查看原文（27行）</summary>

```text
 *
 * Only a guard is installed. Restricting the visible tool set, overriding the
 * presentation transport, or editing the assembled prompt would all change the
 * request prefix and forfeit the provider's cache of the mainline prefix the
 * branch was forked from — so every limitation lives at execution time
 * instead, where it costs nothing before the first token.
 */
export function applyReadOnlyScopeRc7(agentCtx: Context): void {
  const tools = agentCtx.get('tools')
  if (tools === undefined) throw new ReadOnlyCapabilityError()
  tools.guard(readOnlyBranchGuard)
}

/**
 * Compose a branch scope that matches the mainline byte for byte, then gate it.
 *
 * Joining the source session's preset is what keeps the assembled prefix
 * identical; the guard added afterwards is invisible to prompt assembly.
 */
export function createReadOnlyBranchSetup(
  ctx: Context,
  presetId: string | undefined,
): (agentCtx: Context) => Promise<void> {
  return async (agentCtx: Context): Promise<void> => {
    const presets = ctx.get('agentPresets')
    if (presets !== undefined) await presets.mount(agentCtx, presetId)
    applyReadOnlyScopeRc7(agentCtx)
```

</details>

**依据 6 · 源码核查**：[src/host/tree-service.ts:177-218](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/tree-service.ts#L177-L218)

读取所有分支日志/能力投影。

<details>
<summary>查看原文（42行）</summary>

```text
  /** Read a complete, de-duplicated projection without attaching cold Agents. */
  async readTree(request: TreeReadRequest): Promise<TreeReadResult> {
    const ownership = this.resolveOwnership(request.sessionId)
    const persisted = await listPersistedSessions(this.ctx.sessionPersistence)
    const persistedHeaders = snapshotHeaderMap(persisted)
    const requestedHeader = this.headerFor(request.sessionId, persistedHeaders)
    if (requestedHeader === undefined) return sessionNotFound(request.sessionId)

    const tree = ownership.tree ?? syntheticTree(requestedHeader)
    const revision = this.revisions.get(ownership.rootSessionId) ?? 0
    const branches = ownership.tree === undefined
      ? Object.freeze([]) as readonly BranchRecord[]
      : this.metadata.repository.listBranches(tree.treeId)
    const logs = new Map<string, SessionLogSnapshot>()

    const rootLog = await this.readLog(ownership.rootSessionId, 0, persistedHeaders)
    if (rootLog !== undefined) logs.set(ownership.rootSessionId, rootLog)
    // A marked branch is dropped by the projection, and its session is being
    // archived or is already gone, so reading its log only costs a persistence
    // round trip during cascade deletion.
    await Promise.all(branches.map(async (branch) => {
      if (isDirectlyDeleted(branch)) return
      const log = await this.readLog(branch.sessionId, branch.seedLength, persistedHeaders)
      if (log !== undefined) logs.set(branch.sessionId, log)
    }))

    const mutationCapabilities = this.branches?.capabilities() ?? Object.freeze({
      askFollowUp: false,
      continueBranch: false,
      nativeBranchContinuation: false,
      reason: 'The branch mutation service is unavailable.',
    })
    const deletion = this.deletion?.capabilities() ?? Object.freeze({
      supported: false as const,
      reason: 'The branch deletion service is unavailable.',
    })
    const snapshot: TreeSnapshot = Object.freeze({
      rootSessionId: ownership.rootSessionId,
      revision,
      capabilities: Object.freeze({ ...mutationCapabilities, deletion }),
      projection: projectConversationTree(tree, branches, logs),
    })
```

</details>

**依据 7 · 源码核查**：[src/host/branch-service.ts:135-148](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L135-L148)

突变能力条件。

<details>
<summary>查看原文（14行）</summary>

```text
  capabilities(): TreeMutationCapabilities {
    const readOnly = probeReadOnlyCapabilityRc7(this.ctx)
    const visibility = probeBranchVisibility(this.ctx)
    const native = probeNativeContinuationCapability(this.ctx)
    return Object.freeze({
      askFollowUp: readOnly.supported && visibility.supported,
      continueBranch: readOnly.supported && visibility.supported,
      nativeBranchContinuation: native.supported,
      ...readOnly.reason !== undefined
        ? { reason: readOnly.reason }
        : visibility.reason === undefined
          ? {}
          : { reason: visibility.reason },
    })
```

</details>

**依据 8 · 源码核查**：[src/client/projection-controller.ts:74-107](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/client/projection-controller.ts#L74-L107)

事件watch与generation防旧结果。

<details>
<summary>查看原文（34行）</summary>

```text
  private start(): void {
    const generation = ++this.generation
    void this.watch(generation)
  }

  private async watch(generation: number): Promise<void> {
    if (!(await this.ensure())) return
    while (!this.disposed && this.listeners.size > 0 && generation === this.generation) {
      const snapshot = this.view.snapshot
      if (snapshot === null) return
      let result: Awaited<ReturnType<NestedFollowupsRemoteNamespace['watchTree']>>
      try {
        result = await this.remote.watchTree({
          sessionId: this.sessionId,
          afterRevision: snapshot.revision,
        })
      } catch (error) {
        this.publish({ status: 'error', snapshot, error: String(error) })
        return
      }
      if (generation !== this.generation || this.disposed) return
      if (!result.ok) {
        this.publish({ status: 'error', snapshot, error: failure(result.error) })
        return
      }
      if (!result.value.ok) {
        this.publish({ status: 'error', snapshot, error: result.value.error.code })
        return
      }
      if (result.value.value.changed) {
        this.publish({ status: 'ready', snapshot: result.value.value.snapshot, error: null })
      }
    }
  }
```

</details>

**依据 9 · 源码核查**：[src/client/view/state.ts:243-254](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/client/view/state.ts#L243-L254)

UI状态另存浏览器且失败忽略。

<details>
<summary>查看原文（12行）</summary>

```text
/** Persist only durable Tree View state; composer/search/selection remain ephemeral. */
export function saveTreeViewState(
  viewState: TreeViewState,
  storage: TreeViewStateStorage | undefined = defaultStorage(),
): void {
  if (storage === undefined || viewState.treeId === '') return
  try {
    storage.setItem(stateStorageKey(viewState.treeId), JSON.stringify(viewState))
  } catch {
    // Storage quota and privacy-mode failures must not break Tree View.
  }
}
```

</details>

#### 缺口

- 同版本真实Host安装/guard/删除、缓存命中、探索质量与token/维护对照未执行。
  **影响**：不能给持续安装或性能/经济收益保证；源码检查非作者测试验收。
  **进一步探讨**：固定Host/profile/provider，对同一多岔任务比较原生fork与插件上下文遗漏/误写/恢复及费用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用，优先验证哪个方向能决定生产价值？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可条件试用：经常做多层概念/方案侧问的DSH用户，在独立profile对一个非敏感已完成回合分两层，只在上一操作结束后Continue，并核主线没有新增侧问、branch拒绝写工具、重启关系和归档残留。它比手工fork多了附着关系和受管只读侧问，但不冻结文件，也不限制所有可读材料；需要写操作的工作分支仍用原生会话。出现错继承/越权、重试重复或cleanup-pending无法解释就停变更、回Chat/原生fork并保留Session/metadata排查，不先删证据。

可证伪方向是把分支操作组织为同树revision/epoch上的互斥交接：复用现有requestId、metadata表和两阶段删除状态，提交时重检tail/revision，删除标记前阻止新后代，回执区分已预留/已提交/已完成/已归档。依据是现有幂等与关系校验已能局部恢复，但Continue/delete跨await窗口缺统一协调。最小试验用两Client并发Continue、同request不同正文、delete期间新fork、Session成功metadata失败、archive失败重启五类条件，比当前版与原生fork管理的重复/孤儿/错误删除和恢复时间。若Host已有事务/会话命令仲裁可直接消费，优先组合；若用户只有偶发一次侧问或树管理反而耗时，就保留原生fork，不为画布继续加状态机。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/branch-service.ts:383-411](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L383-L411)

Continue互斥候选依据。

<details>
<summary>查看原文（29行）</summary>

```text
    const liveAgent = this.ctx.agents.get(SessionId(branch.sessionId))
    let handle: AgentHandle
    if (liveAgent === undefined) {
      handle = await resumeReadOnlyBranchAgentRc7(this.ctx, this.ctx.agents, {
        sessionId: SessionId(branch.sessionId),
        header: snapshot.header,
        events: snapshot.events,
      })
      this.rememberHandle(handle)
    } else {
      this.assertBranchLineage(
        branch,
        liveAgent.session.header,
        sessionSeedLength(liveAgent.session),
      )
      handle = this.requireOwnedHandle(liveAgent)
    }
    const agent = handle.agent
    this.assertBranchLineage(branch, agent.session.header, sessionSeedLength(agent.session))
    if (agent.status !== 'idle') {
      throw new BranchCommandError('branch-busy', 'wait for the current branch turn to finish before continuing')
    }

    await this.metadata.repository.putBranch({ ...branch, status: 'running' })
    this.notify(tree.rootSessionId)
    try {
      const activityEpoch = this.beginActivity(handle)
      const messageId = submitBranchTurnRc7(agent, request.question, request.clientRequestId)
      void this.observeSettlement(handle, branch.branchId, tree.rootSessionId, activityEpoch)
```

</details>

**依据 2 · 源码核查**：[src/host/branch-service.ts:188-199](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/branch-service.ts#L188-L199)

request合并边界。

<details>
<summary>查看原文（12行）</summary>

```text
  private runOnce(
    key: string,
    operation: () => Promise<BranchCommandResult>,
  ): Promise<BranchCommandResult> {
    const current = this.pending.get(key)
    if (current !== undefined) return current
    const pending = operation().finally(() => {
      if (this.pending.get(key) === pending) this.pending.delete(key)
    })
    this.pending.set(key, pending)
    return pending
  }
```

</details>

**依据 3 · 源码核查**：[src/host/delete-service.ts:133-195](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/delete-service.ts#L133-L195)

删除状态可复用且有跨步窗口。

<details>
<summary>查看原文（63行）</summary>

```text
    targetBranchId: string,
    visibleMessagesByBranch: ReadonlyMap<string, number> = new Map(),
  ): Promise<CascadeDeletionResult> {
    const records = this.repository.listBranches(treeId)
    if (!records.some(record => record.branchId === targetBranchId)) {
      return {
        status: 'already-absent',
        branchCount: 0,
        visibleMessageCount: 0,
        cleanupMode: this.sessions.mode,
      }
    }
    const plan = planCascadeDeletion(records, treeId, targetBranchId, visibleMessagesByBranch)

    for (const branch of plan.branches) {
      if (branch.status !== 'creating' && branch.status !== 'running') continue
      try {
        await this.sessions.cancel(branch.sessionId)
      } catch (error: unknown) {
        throw new BranchDeletionError(
          'cancel-failed',
          `failed to cancel branch session '${branch.sessionId}'`,
          { cause: error },
        )
      }
    }

    const deletedAt = this.now()
    for (const branch of plan.branches) {
      await this.repository.putBranch({
        ...branch,
        status: 'deleted',
        deletedAt: branch.deletedAt ?? deletedAt,
      })
    }
    this.onMarked()

    for (const branch of plan.branches) {
      try {
        await this.sessions.cleanup(branch.sessionId)
      } catch (error: unknown) {
        return {
          status: 'cleanup-pending',
          branchCount: plan.branchCount,
          visibleMessageCount: plan.visibleMessageCount,
          cleanupMode: this.sessions.mode,
          failedSessionId: branch.sessionId,
          message: error instanceof Error ? error.message : String(error),
        }
      }
    }

    for (const branch of plan.branches) {
      await this.repository.deleteBranchRecord(branch.branchId)
    }
    return {
      status: 'deleted',
      branchCount: plan.branchCount,
      visibleMessageCount: plan.visibleMessageCount,
      cleanupMode: this.sessions.mode,
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[src/host/storage.ts:82-116](https://github.com/sluminositys/dsh-nested-followups/blob/75c2ca392b8303f9d57ef15cb951d35e9088eebc/src/host/storage.ts#L82-L116)

现有metadata身份与单条写。

<details>
<summary>查看原文（35行）</summary>

```text

  async putBranch(record: BranchRecord): Promise<BranchRecord> {
    const next = freezeBranch(record)
    if (this.getTree(next.treeId) === undefined) {
      throw new Error(`conversation tree '${next.treeId}' does not exist`)
    }
    if (next.parentBranchId === next.branchId) {
      throw new Error(`branch '${next.branchId}' cannot be its own parent`)
    }
    if (next.parentBranchId !== null) {
      const parent = this.branches.get(next.parentBranchId)
      if (parent === undefined || parent.treeId !== next.treeId) {
        throw new Error(`parent branch '${next.parentBranchId}' does not exist in tree '${next.treeId}'`)
      }
      if (parent.sessionId !== next.parentSessionId) {
        throw new Error(`branch '${next.branchId}' source session does not match its parent branch`)
      }
    }
    const existingAtSession = this.getBranchBySession(next.sessionId)
    if (existingAtSession !== undefined && existingAtSession.branchId !== next.branchId) {
      throw new Error(`session '${next.sessionId}' already belongs to another branch`)
    }
    const existingAtRequest = this.getBranchByClientRequest(next.treeId, next.clientRequestId)
    if (existingAtRequest !== undefined && existingAtRequest.branchId !== next.branchId) {
      throw new Error(`client request '${next.clientRequestId}' already created another branch`)
    }
    const existing = this.branches.get(next.branchId)
    if (existing !== undefined
      && (existing.treeId !== next.treeId || existing.sessionId !== next.sessionId)) {
      throw new Error(`branch '${next.branchId}' cannot change tree or session identity`)
    }
    await this.branches.put(next.branchId, next)
    return next
  }

```

</details>

#### 缺口

- revision仲裁候选未实现；Host现成事务及用户对照未核。
  **影响**：新方向不计当前创新或保证。
  **进一步探讨**：先核Host仲裁合同，再做五条件与真实侧问任务对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
