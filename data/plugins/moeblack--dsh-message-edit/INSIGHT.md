# dsh-message-edit

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b78a167](https://github.com/Moeblack/dsh-message-edit/tree/b78a167064ca612f1c400060d2bfc1dc9bc46436)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Moeblack/dsh-message-edit) [![npm 30d 2,491](https://img.shields.io/static/v1?label=npm+30d&message=2%2C491&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-edit) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-message-edit)
<!-- END META -->

> **功能**：为 DSH 对话提供基于新会话分支的消息编辑、重生成、历史重试和版本导航。

> **亮点**：把回合边界、分支重放与值级版本导航接成用户操作，Host仍提供Agent/历史执行。见 [Q03](#research-q03)。

> **主要限制**：版本恢复不撤外部效果；HTTP回创建/排队不等重放完成，参数非目标回合全快照，重复请求可建多支且Host恢复合同待核。见 [Q02](#research-q02)。

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
  - [Q01 · 编辑、重抽和重试怎样从UI变成真实会话分支？](#detail-section-11)
  - [Q02 · 版本可逆是否代表外部效果可逆，失败、权限和并发边界是什么？](#detail-section-12)
  - [Q03 · 比原生fork多什么，依赖和成本如何独立判断？](#detail-section-13)
  - [Q04 · 谁值得试用，什么验证能推翻进一步方向？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：纯文本改稿和提示比较用户需要保留原版并导航新分支。见 [Q01](#research-q01)。

原UI手工fork和复制输入，涉及工具副作用时人工复核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 用户文本编辑 | 新支重放改后输入 | 闭合回合 |
| 助手/思考编辑 | 人工构造替代回合 | 非真实模型验证 |
| reroll/retry | 重新排入用户输入 | 可能重复工具效果 |
| cascade | 截断或保后续用户输入 | 不复制旧工具链 |
| Timeline/undo/redo | 导航保留版本 | 非删除或文件回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Host agents/sessions/query/persistence | 必需 | seed创建/读谱系/flush | 无法完整操作 |
| workspaceRegistry/webServer | 必需 | 分支归属/路由 | 挂接/访问失败 |
| Web slots/conversation/connection/sessions | 必需 | UI与列表导航 | 控件/打开不可用 |
| DSH ^0.1.0-rc.6开发类型链 | 编译依据 | 公共API接线 | 非所有版本运行保证 |
| 可重复的纯文本任务 | trial前提 | 限重放副作用 | 工具历史先另评 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份会话/工作区并选闭合回合 | 先truncate纯文本 |
| 操作 | UI提交编辑/重试/重抽 | Host验证目标及策略 |
| 建版 | create seed→flush→attach | 失败核逆恢复和残留 |
| 重放 | followup排用户输入 | 另核模型终态 |
| 导航/退出 | 列表发布后打开/撤销切版 | 原会话保留，外部效果不撤 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Host/文本测试未知 | 备份、核版本/人工改稿区别 | 不运行目标 |
| 持续使用 | 新支存储/模型/工具未知 | 分支比较与清理 | preserve多次重算 |
| 失败恢复 | 重试模型费用未知 | 核会话/挂接/排队状态 | 避免盲目重复 |
| 退出 | 版本与元数据保留 | 回原UI导航 | 不回滚文件/命令 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 保留原版 | 新seed分支 | Host失败残留合同 |
| 编辑助手 | 人工闭合回合 | 不证明模型/工具结论 |
| 重生成 | 原输入排队 | 模型成功与同参数复现 |
| 版本导航 | 效果/逆链验证 | 大谱系和断连体验 |
| 总收益 | 手工步骤组合 | 净费用/比较效率 |

> **思考**：版本恢复不撤外部效果；HTTP回创建/排队不等重放完成，参数非目标回合全快照，重复请求可建多支且Host恢复合同待核。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把回合边界、分支重放与值级版本导航接成用户操作，Host仍提供Agent/历史执行。见 [Q03](#research-q03)。

闭合回合seed与谱系逆链可借鉴，结构恢复不应称外部事务或队列完成。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

版本恢复不撤外部效果；HTTP回创建/排队不等重放完成，参数非目标回合全快照，重复请求可建多支且Host恢复合同待核。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立profile先纯文本truncate，核原版/新支/终态/撤销；不对不可重复工具历史直接preserve，异常回原UI。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码及发行入口关键链已核；未运行Host、模型、队列恢复或外部副作用。

- 已检查：作者 README、包清单、源码路径 README.md、index.mjs、package.json、src/client/controller.ts、src/client/index.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核TS Host/Client槽位/控制器、编辑计划/seed/flush/挂接/恢复/timeline和发行index.mjs关键路径；未全审CSS/React组件或固定Host公共API实现，未运行目标。
- 下一步：纯文本/可丢弃工具的断连、重复请求、排队失败对照，核阶段回执/参数/持久状态；未执行。

**分析版本**

- **仓库**：[Moeblack/dsh-message-edit](https://github.com/Moeblack/dsh-message-edit)
- **版本号**：0.2.3（[固定提交 b78a167](https://github.com/Moeblack/dsh-message-edit/tree/b78a167064ca612f1c400060d2bfc1dc9bc46436)）
- **版本日期**：2026-08-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

分seed持久化/排队/终态回执并附参数与副作用范围，三故障对照；已有Host合同足够则直接复用。见 [Q04](#research-q04)。

纯文本/可丢弃工具的断连、重复请求、排队失败对照，核阶段回执/参数/持久状态；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1255 | 1204 | 126 | — |
| .mjs | source | 2 | 689 | 670 | 19 | — |
| .md | source | 1 | 128 | — | — | 1601 |
| .ts | source | 6 | 1747 | 1493 | 117 | — |
| .tsx | source | 3 | 740 | 680 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/Moeblack/dsh-message-edit/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：编辑和重抽如何保留原会话形成可追踪分支，执行/失败边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 编辑、重抽和重试怎样从UI变成真实会话分支？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向想改写已落定对话、比较不同回复的DSH Web用户。基线是手工fork旧会话再复制输入；合格结果是原会话仍可回看，新分支边界明确，用户知道哪些内容重新生成、哪些由自己手改。不是原地修补历史，也不撤销先前工具对外部世界的影响。

Client注册Timeline和标题操作两个槽，按sessionId共享controller；POST操作成功后等待runtime会话列表发布新ID，再open。Host exact路由解析edit/reroll/retry，取得或resume来源Agent，在runMaintenance里处理闭合回合。用户编辑和retry/reroll都切到目标turn/start之前；truncate仅重放目标输入，preserve还把后续用户输入依次followup。助手文本/思考编辑则只保留文本/思考块，构造用户输入加人工助手消息的完整闭合回合，旧工具链不复制，也不重新验证编辑后的推理。

版本seed带message-edit/version及父会话逆目标，AgentRegistry.create一次接受seed/meta，随后flush；workspace有归属则attach，最后把待重放输入排入child Agent。GET timeline读谱系与事件，验证效果/父版本匹配、重复和循环，给撤销链与直接子分支；撤销/重施加是切换仍存在的会话版本，不是删除事件。已检查发布入口index.mjs也存在同样create/flush/followup路径，避免只凭未发布TS判断。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:13-42](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/client/index.ts#L13-L42)

两个槽真实注册。

<details>
<summary>查看原文（30行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const controllers = new Map<SessionId, MessageEditController>()
  const controllerFor = (sessionId: SessionId): MessageEditController => {
    let controller = controllers.get(sessionId)
    if (controller === undefined) {
      controller = new MessageEditController(ctx, sessionId)
      controllers.set(sessionId, controller)
    }
    return controller
  }

  ctx.on('connection/reset', () => {
    for (const controller of controllers.values()) controller.refreshIfLoaded()
  })

  ctx.slots.register({
    name: 'conversation.view',
    id: 'message-edit-timeline',
    order: MESSAGE_EDIT_VIEW_ORDER,
    label: 'Timeline',
    inject: (sessionId: SessionId) => controllerFor(sessionId).face,
  }, MessageEditTimelineView)

  ctx.slots.register({
    name: 'conversation.session.header.actions',
    id: 'message-edit-controls',
    order: MESSAGE_EDIT_VIEW_ORDER,
    inject: (sessionId: SessionId) => controllerFor(sessionId).face,
  }, MessageEditHeader)
}
```

</details>

**依据 2 · 源码核查**：[src/client/controller.ts:427-482](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/client/controller.ts#L427-L482)

POST与等待列表导航。

<details>
<summary>查看原文（56行）</summary>

```text
  private async mutate(operation: MessageEditOperation): Promise<boolean> {
    const current = this.store.getSnapshot()
    if (current.pending !== null || current.status !== 'ready') return false
    this.store.update((state) => {
      state.pending = operation.action
      state.error = null
    })
    try {
      const response = await fetch(MESSAGE_EDIT_PATH, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(operation),
      })
      const result = decodeOperationResult(await responseValue(response))
      if (this.disposed) return true
      this.store.update((state) => { state.pending = null })
      await this.openWhenListed(result.sessionId as SessionId)
      return true
    } catch (error) {
      if (this.disposed) return false
      this.store.update((state) => {
        state.pending = null
        state.error = messageOf(error)
      })
      return false
    }
  }

  /** Session-list publication is the reactive dependency for navigation. */
  private openWhenListed(sessionId: SessionId): Promise<void> {
    if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) {
      this.sessions.open(sessionId)
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      let settled = false
      let dispose = (): void => {}
      const finish = (open: boolean): void => {
        if (settled) return
        settled = true
        dispose()
        this.navigationWaits.delete(cancel)
        if (open) this.sessions.open(sessionId)
        resolve()
      }
      const cancel = (): void => { finish(false) }
      this.navigationWaits.add(cancel)
      dispose = this.sessions.list.subscribe(() => {
        if (this.sessions.list.getSnapshot().byId[sessionId] === undefined) return
        finish(true)
      })
      if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) finish(true)
    })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:279-335](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L279-L335)

用户/助手编辑差异。

<details>
<summary>查看原文（57行）</summary>

```text
function editPlan(operation: EditOperation, turns: readonly ClosedTurn[]): OperationPlan {
  const turnIndex = turns.findIndex(turn => operation.eventSeq > turn.startSeq && operation.eventSeq < turn.endSeq)
  const turn = turns[turnIndex]
  if (turn === undefined) throw new Error('所选消息不属于已落定回合。')
  const event = turn.user?.seq === operation.eventSeq
    ? turn.user
    : turn.assistants.find(candidate => candidate.seq === operation.eventSeq)
  if (event === undefined) throw new Error('所选消息不存在或不可编辑。')

  if (event.type === 'user/message') {
    const before = event.data.content[operation.blockIndex]
    if (before?.type !== 'text') throw new Error('所选用户消息块不是文本。')
    const edited = cloneUser(event.data, replaceTextBlock(event.data.content, operation.blockIndex, operation.text))
    const later = operation.cascade === 'preserve' ? downstreamUsers(turns, turnIndex + 1) : []
    return {
      boundary: turn.startSeq - 1,
      version: pairVersionEffect(operation.sessionId, {
        operation: 'edit',
        cascade: operation.cascade,
        targetTurn: turn.turn,
        targetEventSeq: event.seq,
        targetBlockIndex: operation.blockIndex,
        blockKind: 'user',
        before: before.text,
        after: operation.text,
      }),
      queuedUsers: [edited, ...later],
    }
  }

  const before = event.data.message.content[operation.blockIndex]
  if (!isTextualBlock(before)) throw new Error('所选助手消息块不是文本或思考。')
  const blockKind: EditableBlockKind = before.type === 'reasoning'
    ? 'assistant.reasoning'
    : 'assistant.response'
  if (turn.user === undefined) throw new Error('所选助手消息没有可重建的用户输入。')
  return {
    boundary: turn.startSeq - 1,
    version: pairVersionEffect(operation.sessionId, {
      operation: 'edit',
      cascade: operation.cascade,
      targetTurn: turn.turn,
      targetEventSeq: event.seq,
      targetBlockIndex: operation.blockIndex,
      blockKind,
      before: before.text,
      after: operation.text,
    }),
    manualTurn: {
      turn: turn.turn,
      user: cloneUser(turn.user.data),
      assistant: assistantReplacement(event, operation.blockIndex, operation.text),
    },
    queuedUsers: operation.cascade === 'preserve'
      ? downstreamUsers(turns, turnIndex + 1)
      : [],
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:338-378](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L338-L378)

重试/重抽闭合边界。

<details>
<summary>查看原文（41行）</summary>

```text
function retryPlan(
  sessionId: string,
  turnNumber: number,
  cascade: CascadePolicy,
  turns: readonly ClosedTurn[],
): OperationPlan {
  const turnIndex = turns.findIndex(turn => turn.turn === turnNumber)
  const turn = turns[turnIndex]
  if (turn?.user === undefined) throw new Error('所选回合没有可重放的用户输入。')
  return {
    boundary: turn.startSeq - 1,
    version: pairVersionEffect(sessionId, {
      operation: 'retry',
      cascade,
      targetTurn: turn.turn,
      targetEventSeq: turn.user.seq,
    }),
    queuedUsers: cascade === 'preserve'
      ? downstreamUsers(turns, turnIndex)
      : [cloneUser(turn.user.data)],
  }
}

function rerollPlan(sessionId: string, turns: readonly ClosedTurn[]): OperationPlan {
  for (let index = turns.length - 1; index >= 0; index -= 1) {
    const turn = turns[index]
    if (turn?.user === undefined) continue
    const target = turn.assistants.findLast(event => event.data.message.content.some(isTextualBlock))
    if (target === undefined) continue
    return {
      boundary: turn.startSeq - 1,
      version: pairVersionEffect(sessionId, {
        operation: 'reroll',
        cascade: 'truncate',
        targetTurn: turn.turn,
        targetEventSeq: target.seq,
      }),
      queuedUsers: [cloneUser(turn.user.data)],
    }
  }
  throw new Error('当前会话没有可重生成的已落定助手回复。')
```

</details>

**依据 5 · 源码核查**：[src/index.ts:408-427](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L408-L427)

来源Agent维护区。

<details>
<summary>查看原文（20行）</summary>

```text
async function withSourceAgent<T>(
  ctx: Context,
  sessionId: SessionId,
  operation: (agent: Agent) => Promise<T>,
): Promise<T> {
  let handle: AgentHandle | undefined
  let agent = ctx.agents.get(sessionId)
  if (agent === undefined) {
    const snapshot = await ctx.sessionQuery.readSession(sessionId)
    handle = await ctx.agents.resume({
      resumeSessionId: sessionId,
      agentOptions: agentOptions(snapshot.events),
    })
    agent = handle.agent
  }
  try {
    return await agent.runMaintenance(async () => operation(agent))
  } finally {
    await handle?.dispose()
  }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:464-485](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L464-L485)

人工助手闭合回合。

<details>
<summary>查看原文（22行）</summary>

```text
function appendManualTurn(events: SessionEvent[], manual: ManualAssistantTurn): void {
  const { turn, user, assistant } = manual
  appendLogSeedEvent(events, 'turn/start', { turn })
  appendSurfaceSeedEvent(events, 'user/message', user, { surfaceOp: 'append' })
  appendLogSeedEvent(events, 'step/start', { turn, step: 1 })
  appendSurfaceSeedEvent(events, 'assistant/message', { turn, step: 1, message: assistant }, {
    surfaceOp: 'append',
    sourceEventSeqs: [],
  })
  appendLogSeedEvent(events, 'step/end', { turn, step: 1 })
  appendLogSeedEvent(events, 'turn/end', { turn, reason: { kind: 'completed' } })
}

function versionSeed(source: Session, plan: OperationPlan): {
  events: SessionEvent[]
  inheritedLength: number
} {
  const events = inheritedSeed(source, plan.boundary)
  const inheritedLength = events.length
  appendLogSeedEvent(events, 'message-edit/version', plan.version)
  if (plan.manualTurn !== undefined) appendManualTurn(events, plan.manualTurn)
  return { events, inheritedLength }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:496-531](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L496-L531)

seed创建与flush。

<details>
<summary>查看原文（36行）</summary>

```text
async function createVersionAgent(
  ctx: Context,
  source: Session,
  childId: SessionId,
  plan: OperationPlan,
  options: AgentOptions,
): Promise<AgentHandle> {
  const seed = versionSeed(source, plan)
  const presets = ctx.get('agentPresets')
  const presetId = sessionPreset(source)
  let agentPreset: string | undefined
  let setup: AgentSetup | undefined
  if (presets !== undefined && presetId !== undefined) {
    const resolved = (await presets.resolve(presetId)).id
    agentPreset = resolved
    setup = async (agentCtx) => { await presets.mount(agentCtx, resolved) }
  }
  const child = await ctx.agents.create({
    sessionId: childId,
    seed: seed.events,
    meta: {
      ...source.header.cwd === undefined ? {} : { cwd: source.header.cwd },
      parentSession: source.id,
      seedLength: seed.inheritedLength,
      ...agentPreset === undefined ? {} : { agentPreset },
    },
    agentOptions: options,
    ...setup === undefined ? {} : { setup },
  })
  try {
    await ctx.sessions.flush(child.agent.session)
    return child
  } catch (error: unknown) {
    await child.dispose()
    throw error
  }
```

</details>

**依据 8 · 源码核查**：[src/index.ts:552-581](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L552-L581)

工作区挂接/排队/恢复。

<details>
<summary>查看原文（30行）</summary>

```text
async function runOperation(ctx: Context, operation: MessageEditOperation): Promise<MessageEditOperationResult> {
  const sourceId = sessionIdOf(operation.sessionId)
  return withSourceAgent(ctx, sourceId, async (source) => {
    const childId = sessionIdOf(`session-${crypto.randomUUID()}`)
    const inverses: OperationInverse[] = []
    try {
      const events = source.session.events
      const plan = planOperation(operation, events)
      const options = agentOptions(events, source.options)
      const child = await createVersionAgent(ctx, source.session, childId, plan, options)
      inverses.push(() => child.dispose())

      const workspace = sourceWorkspace(ctx, sourceId)
      if (workspace !== undefined) {
        await workspace.attachSession(childId)
        inverses.push(() => workspace.detachSession(childId))
      }
      for (const message of plan.queuedUsers) child.agent.followup(message)

      inverses.length = 0
      return { sessionId: childId, queuedTurns: plan.queuedUsers.length }
    } catch (error: unknown) {
      try {
        await recoverOperation(inverses)
      } catch (recoveryError: unknown) {
        throw new AggregateError([error, recoveryError], '版本操作及其恢复均失败。')
      }
      throw error
    }
  })
```

</details>

**依据 9 · 源码核查**：[src/index.ts:747-776](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L747-L776)

撤销链与直接子分支。

<details>
<summary>查看原文（30行）</summary>

```text
    if (effectIds.has(version.effectId)) throw new Error(`版本效果 ${version.effectId} 重复。`)
    effectIds.add(version.effectId)
  }

  const versionsById = new Map(versions.map(version => [version.sessionId, version]))
  const undoStack: string[] = []
  let undoCursor = versionsById.get(sessionId)
  while (undoCursor?.inverseSessionId !== undefined) {
    const inverseId = undoCursor.inverseSessionId
    if (undoStack.includes(inverseId)) throw new Error('版本效果逆链包含循环。')
    if (!versionsById.has(inverseId)) throw new Error(`恢复目标 ${inverseId} 不在可见版本树中。`)
    undoStack.push(inverseId)
    undoCursor = versionsById.get(inverseId)
  }
  const redoSessionIds = versions
    .filter(version => version.inverseSessionId === sessionId)
    .map(version => version.sessionId)

  const currentIndex = versions.findIndex(version => version.current)
  const currentLog = logs[currentIndex]
  if (currentIndex < 0 || currentLog === undefined) throw new Error('当前版本不在版本树中。')
  const turns = closedTurns(currentLog)
  return {
    sessionId,
    messages: editableMessages(turns),
    retryableTurns: retryableTurns(turns),
    versions,
    undoStack,
    redoSessionIds,
  }
```

</details>

**依据 10 · 源码核查**：[index.mjs:343-397](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/index.mjs#L343-L397)

实际发行入口关键路径。

<details>
<summary>查看原文（55行）</summary>

```text
	const child = await ctx.agents.create({
		sessionId: childId,
		seed: seed.events,
		meta: {
			...source.header.cwd === void 0 ? {} : { cwd: source.header.cwd },
			parentSession: source.id,
			seedLength: seed.inheritedLength,
			...agentPreset === void 0 ? {} : { agentPreset }
		},
		agentOptions: options,
		...setup === void 0 ? {} : { setup }
	});
	try {
		await ctx.sessions.flush(child.agent.session);
		return child;
	} catch (error) {
		await child.dispose();
		throw error;
	}
}
function sourceWorkspace(ctx, sessionId) {
	return ctx.workspaceRegistry.list().find((workspace) => workspace.sessionIds.includes(sessionId));
}
async function recoverOperation(inverses) {
	const failures = [];
	for (const inverse of inverses.reverse()) try {
		await inverse();
	} catch (error) {
		failures.push(error);
	}
	if (failures.length > 0) throw new AggregateError(failures, "版本操作恢复失败。");
}
async function runOperation(ctx, operation) {
	const sourceId = sessionIdOf(operation.sessionId);
	return withSourceAgent(ctx, sourceId, async (source) => {
		const childId = sessionIdOf(`session-${crypto.randomUUID()}`);
		const inverses = [];
		try {
			const events = source.session.events;
			const plan = planOperation(operation, events);
			const options = agentOptions(events, source.options);
			const child = await createVersionAgent(ctx, source.session, childId, plan, options);
			inverses.push(() => child.dispose());
			const workspace = sourceWorkspace(ctx, sourceId);
			if (workspace !== void 0) {
				await workspace.attachSession(childId);
				inverses.push(() => workspace.detachSession(childId));
			}
			for (const message of plan.queuedUsers) child.agent.followup(message);
			inverses.length = 0;
			return {
				sessionId: childId,
				queuedTurns: plan.queuedUsers.length
			};
		} catch (error) {
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 版本可逆是否代表外部效果可逆，失败、权限和并发边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

可逆只针对会话版本。preserve会再次执行后续输入和新工具链，旧文件/命令/外发结果不会回滚，可能重复副作用；因此有发送、支付、部署等不可重放动作的历史不应直接级联。手改助手回合标completed只是人工构造的日志，不证明模型得出该推理或工具验证过结果，比较时必须保留版本元数据。

create成功后flush建立的是当时seed耐久屏障，followup在其后、未await，也没有等重放任务完成再回HTTP。返回sessionId和queuedTurns说明创建/排队数量，不说明模型成功或后续队列持久化保证。同步失败会逆序detach/dispose，逆失败抛AggregateError；child.dispose是否也删除已flush的持久会话由Host合同决定，本插件源码不足以承诺绝无残留。

同一controller以pending防重复提交，但不是跨窗口幂等键；每个请求随机childId，重复请求可建两支。runMaintenance应串行维护来源Agent，具体与运行中turn的相容语义需固定Host核。分支模型路由从来源整个历史最后request/header取provider/model/maxTokens，preset也取最新选择，不复原目标回合所有temperature/reasoningEffort等设置，因此不能当严格同配置实验。

HTTP处理器只校验字符串/整数/cascade等形状，无插件自有principal绑定、请求体大小限制或幂等令牌，注册在既有webServer；真实认证/Origin围栏依赖Host而未验证。sessionId是寻址不是身份凭据。源Agent不在线会resume且最终dispose临时handle；是否在目标Host保留所需工具/权限范围需验。导航等待列表没有固定超时，断连/列表不发布时可能等待，controller卸载会取消本地等待但不会撤销已创建分支。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:124-128](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/README.md#L124-L128)

作者明确外部效果不恢复。

```text
## 范围边界

- 不原地改写 Session 事件；历史是 append-only、deep-frozen。
- 不联动恢复或修改工作区文件、命令外部效果与既有产物。
- 不修改 DSH 引擎、apiproxy 或官方 UI 包。
```

**依据 2 · 源码核查**：[src/index.ts:264-276](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L264-L276)

助手替换只文本/思考。

<details>
<summary>查看原文（13行）</summary>

```text
function assistantReplacement(event: AssistantEvent, blockIndex: number, text: string): AssistantMessage {
  const replaced = replaceTextBlock(event.data.message.content, blockIndex, text)
    .filter(block => block.type === 'text' || block.type === 'reasoning')
  return Object.freeze({
    id: crypto.randomUUID(),
    role: 'assistant' as const,
    content: Object.freeze(replaced),
    source: Object.freeze({
      kind: 'model' as const,
      provider: event.data.message.source.provider,
      model: event.data.message.source.model,
    }),
  }) as AssistantMessage
```

</details>

**依据 3 · 源码核查**：[src/index.ts:393-427](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L393-L427)

模型路由选择和resume。

<details>
<summary>查看原文（35行）</summary>

```text
function agentOptions(events: readonly SessionEvent[], fallback?: AgentOptions): AgentOptions {
  const config = events.findLast(event => event.type === 'request/header')?.data.header.config
  const provider = config?.provider ?? fallback?.provider
  const model = config?.model ?? fallback?.model
  if (provider === undefined || provider.length === 0 || model === undefined || model.length === 0) {
    throw new Error('无法从会话历史解析模型路由。')
  }
  const maxTokens = config?.maxTokens ?? fallback?.maxTokens
  return {
    provider,
    model,
    ...maxTokens === undefined ? {} : { maxTokens },
  }
}

async function withSourceAgent<T>(
  ctx: Context,
  sessionId: SessionId,
  operation: (agent: Agent) => Promise<T>,
): Promise<T> {
  let handle: AgentHandle | undefined
  let agent = ctx.agents.get(sessionId)
  if (agent === undefined) {
    const snapshot = await ctx.sessionQuery.readSession(sessionId)
    handle = await ctx.agents.resume({
      resumeSessionId: sessionId,
      agentOptions: agentOptions(snapshot.events),
    })
    agent = handle.agent
  }
  try {
    return await agent.runMaintenance(async () => operation(agent))
  } finally {
    await handle?.dispose()
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:488-531](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L488-L531)

最新preset与flush边界。

<details>
<summary>查看原文（44行）</summary>

```text
function sessionPreset(session: PresetBearingSession): string | undefined {
  for (let index = session.events.length - 1; index >= 0; index -= 1) {
    const event = session.events[index]
    if (event?.type === 'agent-preset/selected') return event.data.agentPreset
  }
  return session.header.agentPreset
}

async function createVersionAgent(
  ctx: Context,
  source: Session,
  childId: SessionId,
  plan: OperationPlan,
  options: AgentOptions,
): Promise<AgentHandle> {
  const seed = versionSeed(source, plan)
  const presets = ctx.get('agentPresets')
  const presetId = sessionPreset(source)
  let agentPreset: string | undefined
  let setup: AgentSetup | undefined
  if (presets !== undefined && presetId !== undefined) {
    const resolved = (await presets.resolve(presetId)).id
    agentPreset = resolved
    setup = async (agentCtx) => { await presets.mount(agentCtx, resolved) }
  }
  const child = await ctx.agents.create({
    sessionId: childId,
    seed: seed.events,
    meta: {
      ...source.header.cwd === undefined ? {} : { cwd: source.header.cwd },
      parentSession: source.id,
      seedLength: seed.inheritedLength,
      ...agentPreset === undefined ? {} : { agentPreset },
    },
    agentOptions: options,
    ...setup === undefined ? {} : { setup },
  })
  try {
    await ctx.sessions.flush(child.agent.session)
    return child
  } catch (error: unknown) {
    await child.dispose()
    throw error
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:540-581](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L540-L581)

逆恢复及followup后回数量。

<details>
<summary>查看原文（42行）</summary>

```text
async function recoverOperation(inverses: OperationInverse[]): Promise<void> {
  const failures: unknown[] = []
  for (const inverse of inverses.reverse()) {
    try {
      await inverse()
    } catch (error: unknown) {
      failures.push(error)
    }
  }
  if (failures.length > 0) throw new AggregateError(failures, '版本操作恢复失败。')
}

async function runOperation(ctx: Context, operation: MessageEditOperation): Promise<MessageEditOperationResult> {
  const sourceId = sessionIdOf(operation.sessionId)
  return withSourceAgent(ctx, sourceId, async (source) => {
    const childId = sessionIdOf(`session-${crypto.randomUUID()}`)
    const inverses: OperationInverse[] = []
    try {
      const events = source.session.events
      const plan = planOperation(operation, events)
      const options = agentOptions(events, source.options)
      const child = await createVersionAgent(ctx, source.session, childId, plan, options)
      inverses.push(() => child.dispose())

      const workspace = sourceWorkspace(ctx, sourceId)
      if (workspace !== undefined) {
        await workspace.attachSession(childId)
        inverses.push(() => workspace.detachSession(childId))
      }
      for (const message of plan.queuedUsers) child.agent.followup(message)

      inverses.length = 0
      return { sessionId: childId, queuedTurns: plan.queuedUsers.length }
    } catch (error: unknown) {
      try {
        await recoverOperation(inverses)
      } catch (recoveryError: unknown) {
        throw new AggregateError([error, recoveryError], '版本操作及其恢复均失败。')
      }
      throw error
    }
  })
```

</details>

**依据 6 · 源码核查**：[src/index.ts:831-885](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L831-L885)

请求读取和Host路由。

<details>
<summary>查看原文（55行）</summary>

```text
function requestJson(request: HttpRequestLike): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const decoder = new TextDecoder()
    let text = ''
    request.on('data', (chunk) => {
      text += typeof chunk === 'string' ? chunk : decoder.decode(chunk, { stream: true })
    })
    request.on('end', () => {
      try {
        text += decoder.decode()
        resolve(JSON.parse(text) as unknown)
      } catch (error) {
        reject(error)
      }
    })
    request.on('error', reject)
  })
}

function respondJson(response: HttpResponseLike, status: number, value: unknown): void {
  response.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  response.end(JSON.stringify(value))
}

async function handleRoute(ctx: Context, request: HttpRequestLike, response: HttpResponseLike): Promise<void> {
  try {
    if (request.method === 'GET') {
      const url = new URL(request.url ?? MESSAGE_EDIT_PATH, 'http://message-edit.local')
      const sessionId = sessionIdOf(url.searchParams.get('sessionId'))
      respondJson(response, 200, await timeline(ctx, sessionId))
      return
    }
    if (request.method === 'POST') {
      respondJson(response, 200, await runOperation(ctx, decodeOperation(await requestJson(request))))
      return
    }
    response.writeHead(405)
    response.end()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)
    respondJson(response, error instanceof TypeError ? 400 : 409, { error: message })
  }
}

/** Register the reversible route contribution. */
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: MESSAGE_EDIT_PATH,
    handler: (request, response) => handleRoute(ctx, request, response),
  }), 'message-edit: HTTP route')
}
```

</details>

**依据 7 · 源码核查**：[src/client/controller.ts:427-482](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/client/controller.ts#L427-L482)

本地pending和无超时列表等待。

<details>
<summary>查看原文（56行）</summary>

```text
  private async mutate(operation: MessageEditOperation): Promise<boolean> {
    const current = this.store.getSnapshot()
    if (current.pending !== null || current.status !== 'ready') return false
    this.store.update((state) => {
      state.pending = operation.action
      state.error = null
    })
    try {
      const response = await fetch(MESSAGE_EDIT_PATH, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(operation),
      })
      const result = decodeOperationResult(await responseValue(response))
      if (this.disposed) return true
      this.store.update((state) => { state.pending = null })
      await this.openWhenListed(result.sessionId as SessionId)
      return true
    } catch (error) {
      if (this.disposed) return false
      this.store.update((state) => {
        state.pending = null
        state.error = messageOf(error)
      })
      return false
    }
  }

  /** Session-list publication is the reactive dependency for navigation. */
  private openWhenListed(sessionId: SessionId): Promise<void> {
    if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) {
      this.sessions.open(sessionId)
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      let settled = false
      let dispose = (): void => {}
      const finish = (open: boolean): void => {
        if (settled) return
        settled = true
        dispose()
        this.navigationWaits.delete(cancel)
        if (open) this.sessions.open(sessionId)
        resolve()
      }
      const cancel = (): void => { finish(false) }
      this.navigationWaits.add(cancel)
      dispose = this.sessions.list.subscribe(() => {
        if (this.sessions.list.getSnapshot().byId[sessionId] === undefined) return
        finish(true)
      })
      if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) finish(true)
    })
```

</details>

#### 缺口

- 固定Host create/dispose/maintenance/followup的事务、权限及队列持久化合同未核运行。
  **影响**：不能承诺失败无持久残留、正在运行时任意编辑安全或所有工具复用相同权限。
  **进一步探讨**：固定支持Host，用纯文本和可丢弃工具分别做flush失败/挂接失败/断连/重复提交，核日志、Agent和workspace一致性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 比原生fork多什么，依赖和成本如何独立判断？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

新增价值是把“目标闭合回合之前fork、编辑/重放输入、版本树与撤销导航”组合成可见操作，减少用户自己对齐事件边界和管理多会话。历史/Agent/工作区/模型执行能力都继承Host；源码不改DSH引擎，不意味着跨版本公共API合同永远兼容。手工fork和复制输入是更简单且有意识的替代，尤其工具任务需人工复核副作用时。

包0.2.3，Host依赖sessions、agents、sessionPersistence、sessionQuery、workspaceRegistry和webServer，Client要slots/conversation/connection/sessions。开发依赖基于DSH ^0.1.0-rc.6、Cordis ^4.0.1、React18，属于编译依据不是当前所有版本运行承诺；未声明Node engines，不能补造最低Node版本。MIT来自package48。发行main与Client为已带构建产物。

首次应备份会话/工作区，在纯文本测试回合检查前后版本、编辑助手标记、truncate/preserve以及停插件后原会话仍可从原UI打开。持续成本包括每支完整继承历史和谱系读取、重复模型与工具调用、存储与人工比较；preserve后续越多成本越高但未测费用。失败要从Host会话列表核是否已创建，避免盲目重试再建分支。退出只卸UI/路由，不删除版本/撤外部效果，历史元数据仍留文件。

经济对象相对原Agent的fork/重试未改变模型供给、计价、资源池或服务责任，只让相同计算更易重复和比较；未识别经济结构创新。节省操作步骤的可能收益与实际token/人工净成本应另测，不用未知ROI补零现金成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:99-111](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L99-L111)

Host依赖。

<details>
<summary>查看原文（13行）</summary>

```text
export const name = 'message-edit'

/** Public services used by the branch transaction and timeline projection. */
export const inject = [
  'sessions',
  'agents',
  'sessionPersistence',
  'sessionQuery',
  'workspaceRegistry',
  'webServer',
]

type UserEvent = SessionEvent<'user/message'>
```

</details>

**依据 2 · 源码核查**：[package.json:1-30](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/package.json#L1-L30)

版本与发行入口。

<details>
<summary>查看原文（30行）</summary>

```text
{
  "name": "dsh-message-edit",
  "description": "Branch-based editing, rerolling, retrying, and version navigation for DeepSeek Harness conversations",
  "version": "0.2.3",
  "type": "module",
  "main": "./index.mjs",
  "exports": {
    ".": "./index.mjs",
    "./client": "./client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "index.mjs",
    "client.js",
    "client.js.map",
    "cordis.patch.yml",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
```

</details>

**依据 3 · 源码核查**：[package.json:48-65](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/package.json#L48-L65)

MIT及开发依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  "license": "MIT",
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-agent-presets": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session-query": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-workspace": "^0.1.0-rc.6",
    "@types/react": "^18.3.0",
    "@types/react-dom": "^18.3.0",
    "lightningcss": "^1.32.0",
    "react": "^18.2.0",
    "tsdown": "^0.22.2",
    "typescript": "^6.0.3"
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:9-12](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/client/index.ts#L9-L12)

Client服务注入。

```text
/** Explicit value sources and slot declaration-order edges. */
export const inject = ['slots', 'conversation', 'connection', 'sessions']

/** Register both UI contributions over one per-session controller identity. */
```

**依据 5 · 源码核查**：[README.md:124-128](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/README.md#L124-L128)

退出与外部效果边界依据。

```text
## 范围边界

- 不原地改写 Session 事件；历史是 append-only、deep-frozen。
- 不联动恢复或修改工作区文件、命令外部效果与既有产物。
- 不修改 DSH 引擎、apiproxy 或官方 UI 包。
```

#### 缺口

- 支持Host完整版本范围、谱系规模与真实任务净成本未测。
  **影响**：不能普遍宣称更快、更便宜或无兼容负担。
  **进一步探讨**：同任务比较手工fork与插件的边界错误、重复操作、模型费用和人工比较时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，什么验证能推翻进一步方向？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合纯文本回答改稿/提示比较的用户在独立profile试用，先保留原会话并只用truncate；确认手改助手与模型重生成区别，再看undo/redo和刷新。当前可条件试用，不把编辑推理当真实模型推理证据，不对有不可重复工具操作的历史直接preserve。若列表导航卡住、重复建分支或权限/模型参数不符，回原UI手工fork并核Host新会话，不盲目重试。

值得验证的方向是把分支回执拆为“seed已持久化、输入已排队、重放终态”，附来源参数快照与副作用重放提示；不先增加更多编辑入口。依据是当前一次HTTP结果混合创建成功与未完成重放，目标回合参数未完整冻结。最小实验对文本任务与可丢弃工具任务分别注入断连、重复请求、排队后失败，比较手工fork、现实现和回执原型的重复分支、错误完成判断及恢复时间。若Host已有可观察队列/操作ID可组合，应直接复用；若用户只需手改文本且无需自动重放，就保持轻量导航而不增加事务层。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:552-581](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L552-L581)

创建与排队结果边界。

<details>
<summary>查看原文（30行）</summary>

```text
async function runOperation(ctx: Context, operation: MessageEditOperation): Promise<MessageEditOperationResult> {
  const sourceId = sessionIdOf(operation.sessionId)
  return withSourceAgent(ctx, sourceId, async (source) => {
    const childId = sessionIdOf(`session-${crypto.randomUUID()}`)
    const inverses: OperationInverse[] = []
    try {
      const events = source.session.events
      const plan = planOperation(operation, events)
      const options = agentOptions(events, source.options)
      const child = await createVersionAgent(ctx, source.session, childId, plan, options)
      inverses.push(() => child.dispose())

      const workspace = sourceWorkspace(ctx, sourceId)
      if (workspace !== undefined) {
        await workspace.attachSession(childId)
        inverses.push(() => workspace.detachSession(childId))
      }
      for (const message of plan.queuedUsers) child.agent.followup(message)

      inverses.length = 0
      return { sessionId: childId, queuedTurns: plan.queuedUsers.length }
    } catch (error: unknown) {
      try {
        await recoverOperation(inverses)
      } catch (recoveryError: unknown) {
        throw new AggregateError([error, recoveryError], '版本操作及其恢复均失败。')
      }
      throw error
    }
  })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:393-406](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/index.ts#L393-L406)

参数快照仅部分。

<details>
<summary>查看原文（14行）</summary>

```text
function agentOptions(events: readonly SessionEvent[], fallback?: AgentOptions): AgentOptions {
  const config = events.findLast(event => event.type === 'request/header')?.data.header.config
  const provider = config?.provider ?? fallback?.provider
  const model = config?.model ?? fallback?.model
  if (provider === undefined || provider.length === 0 || model === undefined || model.length === 0) {
    throw new Error('无法从会话历史解析模型路由。')
  }
  const maxTokens = config?.maxTokens ?? fallback?.maxTokens
  return {
    provider,
    model,
    ...maxTokens === undefined ? {} : { maxTokens },
  }
}
```

</details>

**依据 3 · 源码核查**：[src/client/controller.ts:427-482](https://github.com/Moeblack/dsh-message-edit/blob/b78a167064ca612f1c400060d2bfc1dc9bc46436/src/client/controller.ts#L427-L482)

导航/错误退路。

<details>
<summary>查看原文（56行）</summary>

```text
  private async mutate(operation: MessageEditOperation): Promise<boolean> {
    const current = this.store.getSnapshot()
    if (current.pending !== null || current.status !== 'ready') return false
    this.store.update((state) => {
      state.pending = operation.action
      state.error = null
    })
    try {
      const response = await fetch(MESSAGE_EDIT_PATH, {
        method: 'POST',
        headers: {
          accept: 'application/json',
          'content-type': 'application/json',
        },
        body: JSON.stringify(operation),
      })
      const result = decodeOperationResult(await responseValue(response))
      if (this.disposed) return true
      this.store.update((state) => { state.pending = null })
      await this.openWhenListed(result.sessionId as SessionId)
      return true
    } catch (error) {
      if (this.disposed) return false
      this.store.update((state) => {
        state.pending = null
        state.error = messageOf(error)
      })
      return false
    }
  }

  /** Session-list publication is the reactive dependency for navigation. */
  private openWhenListed(sessionId: SessionId): Promise<void> {
    if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) {
      this.sessions.open(sessionId)
      return Promise.resolve()
    }
    return new Promise((resolve) => {
      let settled = false
      let dispose = (): void => {}
      const finish = (open: boolean): void => {
        if (settled) return
        settled = true
        dispose()
        this.navigationWaits.delete(cancel)
        if (open) this.sessions.open(sessionId)
        resolve()
      }
      const cancel = (): void => { finish(false) }
      this.navigationWaits.add(cancel)
      dispose = this.sessions.list.subscribe(() => {
        if (this.sessions.list.getSnapshot().byId[sessionId] === undefined) return
        finish(true)
      })
      if (this.sessions.list.getSnapshot().byId[sessionId] !== undefined) finish(true)
    })
```

</details>

#### 缺口

- 分阶段回执原型与比较未执行，真实需求强度未知。
  **影响**：新方向不计既有能力，trial限纯文本可回退范围。
  **进一步探讨**：先观察实际误认/重复请求，再以三种故障决定是否需额外回执。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
