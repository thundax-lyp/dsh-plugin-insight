# dsh-turn-delete

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4716bcb](https://github.com/hanshenmesen/dsh-turn-delete/tree/4716bcbdee27b110ceea9df21f027c6dfe5888b8)

<!-- BEGIN META -->
[![GitHub ★ 110](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=110&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hanshenmesen/dsh-turn-delete) [![npm 30d 359](https://img.shields.io/static/v1?label=npm+30d&message=359&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-turn-delete)
<!-- END META -->

> **功能**：将活动会话的一个完整已关闭回合从模型上下文移除，保留原始事件。

> **亮点**：[Q01](#research-q01) 保留会话和后续轮次，缩小上下文更改范围。

> **主要限制**：[Q02](#research-q02) 压缩跨度可能被拒绝，flush 失败后的重试需验证。

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
  - [Q01 · 一次删除实际改变哪部分会话？](#detail-section-11)
  - [Q02 · 什么情况下拒绝删除或出现未知持久化？](#detail-section-12)
  - [Q03 · 什么时候值得用此功能处理误导上下文？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望去掉一个错误回合并保留同一会话的后续进展。

创建新会话并人工重建所需上下文。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 局部上下文编辑 | 从当前模型输入移除回合 | 原始事件仍保留 |
| 跨度检查 | 拒绝非独立回合 | 依赖当前 surface 状态 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容的 DSH Host 与 Web | 必需 | 使用活动 Agent 和 surface | 升级后需复验 |
| 已关闭且独立的回合 | 操作必需 | 作为替换跨度 | 共享压缩节点时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 定位 | 选择已关闭回合 | 检查是否依赖该回合 |
| 操作 | 确认删除 | 核对可见结果 |
| 复验 | 再次对话及重开 | 核对上下文和日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 在可弃用会话验证 | 确认兼容版本 |
| 持续 | 工时未知 | 判断回合与依赖 | 压缩后可能拒绝 |
| 失败 | 恢复成本未知 | 保留日志并建立新会话 | 检查落盘状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话修正 | 跳过已知错误轮次 | 后续任务效果和节时 |

> **思考**：[Q02](#research-q02) 压缩跨度可能被拒绝，flush 失败后的重试需验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 保留会话和后续轮次，缩小上下文更改范围。

[Q02](#research-q02) 维护租约保护修改，重试短路需核对实际持久化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 压缩跨度可能被拒绝，flush 失败后的重试需验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先删除测试会话中间轮次，再验证重开。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认替换和拒绝条件，未独立运行。

- 已检查：作者 README、包清单、源码路径 src/http.ts、src/turn-delete.ts、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 HTTP、Host 替换及作者演示说明。未执行目标或宿主。
- 下一步：确认压缩拒绝、flush 故障重试和重开，以及原始日志保留。

**分析版本**

- **仓库**：[hanshenmesen/dsh-turn-delete](https://github.com/hanshenmesen/dsh-turn-delete)
- **版本号**：0.1.0（[固定提交 4716bcb](https://github.com/hanshenmesen/dsh-turn-delete/tree/4716bcbdee27b110ceea9df21f027c6dfe5888b8)）
- **版本日期**：2026-08-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照新建会话测上下文保留与错误恢复。

确认压缩拒绝、flush 故障重试和重开，以及原始日志保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 556 | 520 | 37 | — |
| .md | source | 2 | 160 | — | — | 1210 |
| .mjs | source | 2 | 39 | 33 | 0 | — |
| .tsx | source | 3 | 237 | 218 | 0 | — |
| .ts | source | 7 | 478 | 436 | 1 | — |
| .tsx | test | 1 | 127 | 111 | 1 | — |
| .ts | test | 1 | 134 | 121 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/hanshenmesen/dsh-turn-delete/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/hanshenmesen/dsh-turn-delete/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hanshenmesen/dsh-turn-delete/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：怎样让已关闭回合退出模型上下文并保留其余会话？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 一次删除实际改变哪部分会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Web 请求以活动会话 ID 和助手消息 ID 定位目标，取得维护租约后追加空内容替换，并等待 flush。原始日志、会话 ID 和后续回合保留，所以该功能适合去掉当前模型上下文中的错误回合。与重新建会话相比，可保持剩余上下文；已经发生的外部工具副作用不会被此替换撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/http.ts:95-124](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/http.ts#L95-L124)

POST 接收和定位。

<details>
<summary>查看原文（30行）</summary>

```text
export async function handleTurnDelete(
  ctx: Context,
  request: HttpRequestLike,
  response: HttpResponseLike,
): Promise<void> {
  if (request.method !== 'POST') {
    response.writeHead(405, { allow: 'POST' })
    response.end()
    return
  }
  const contentType = request.headers?.['content-type']
  if (typeof contentType !== 'string' || !contentType.toLowerCase().startsWith('application/json')) {
    respondJson(response, 415, { ok: false, error: { code: 'INVALID_REQUEST', message: 'application/json required' } })
    return
  }
  try {
    const input = decodeRequest(await requestJson(request))
    const sessionId = SessionId(input.sessionId)
    const agent = ctx.agents.get(sessionId)
    if (agent === undefined) {
      throw new TurnDeleteError('TARGET_NOT_FOUND', `session "${input.sessionId}" is not active`)
    }
    const value = await deleteTurn(ctx, agent, MessageId(input.assistantMessageId))
    respondJson(response, 200, { ok: true, value })
  } catch (error: unknown) {
    if (error instanceof TurnDeleteError) {
      respondJson(response, error.code === 'AGENT_BUSY' ? 423 : 409, {
        ok: false,
        error: { code: error.code, message: error.message },
      })
```

</details>

**依据 2 · 源码核查**：[src/turn-delete.ts:151-177](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/turn-delete.ts#L151-L177)

空内容替换与维护租约。

<details>
<summary>查看原文（27行）</summary>

```text
  signal.throwIfAborted()
  const tombstone = session.append('assistant/message', {
    turn,
    step: target.data.step,
    message: createAssistantMessage({
      content: [],
      source: { provider: TOMBSTONE_PROVIDER, model: TOMBSTONE_MODEL },
    }),
  }, {
    surfaceOp: { op: 'replace', start: selected[0] as number, end: selected.at(-1) as number },
    sourceEventSeqs: selected,
  })
  await ctx.sessions.flush(session)
  return { turn, seq: tombstone.seq }
}

export async function deleteTurn(
  ctx: Context,
  agent: Agent,
  assistantMessageId: MessageId,
): Promise<TurnDeleteReceipt> {
  try {
    return await agent.runMaintenance(signal =>
      deleteUnderMaintenance(ctx, agent, assistantMessageId, signal))
  } catch (error: unknown) {
    if (error instanceof TurnDeleteError) throw error
    throw new TurnDeleteError('AGENT_BUSY', error instanceof Error ? error.message : String(error))
```

</details>

**依据 3 · 作者声明**：[README.md:41-52](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/README.md#L41-L52)

作者描述上下文及日志区别。

<details>
<summary>查看原文（12行）</summary>

```text
- A trash action appears only on completed ordinary Session turns. Subagent transcripts do not expose it.
- Deletion requires confirmation and is disabled while the Session is running.
- The prompt, assistant messages, and tool records for the selected turn are removed from the Session's current model surface.
- The Session id, title, workspace association, later turns, and original append-only event log remain intact.
- A durable zero-content replacement event records the deletion. Reloading the page or restarting the profile preserves it.
- Repeating the same request is idempotent.

The plugin refuses deletion when the target turn is still open or has already been merged into a compaction replacement with other history. This prevents deleting only part of model-visible context.

## Design

The Host half registers `POST /dsh-turn-delete`, claims the target Agent's maintenance lease, validates the complete closed-turn surface span, appends a zero-content replacement, and waits for `sessions.flush()` before acknowledging success.
```

</details>

#### 缺口

- 真实持久化和下次请求未独立复验
  **影响**：无法证明宿主升级后仍保持行为
  **进一步探讨**：准备三回合会话，删除中间项并比较模型输入与历史日志

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 什么情况下拒绝删除或出现未知持久化？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

缺目标、回合未结束、与压缩节点共享或目标跨度不连续时拒绝。已写入 tombstone 的同回合重复请求直接返回既有序号；若首调用 append 后 flush 抛错，重试可能命中内存事件并直接返回，而没有在这个分支重新 flush。这是源码显示的故障窗口，需确认宿主是否随后另行落盘。

#### 证据与依据

**依据 1 · 源码核查**：[src/turn-delete.ts:95-121](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/turn-delete.ts#L95-L121)

活动会话、幂等与已关闭边界。

<details>
<summary>查看原文（27行）</summary>

```text
  const session = agent.session
  if (ctx.sessions.get(session.id) !== session) {
    throw new TurnDeleteError('TARGET_NOT_FOUND', `session "${session.id}" is no longer live`)
  }
  const events = session.events
  const target = events.find((event): event is SessionEvent<'assistant/message'> =>
    event.type === 'assistant/message'
    && isAppendSurfaceEvent(event)
    && event.data.message.id === assistantMessageId)
  if (target === undefined) {
    throw new TurnDeleteError('TARGET_NOT_FOUND', `assistant message "${assistantMessageId}" was not found`)
  }
  const turn = target.data.turn
  const existing = events.find(event => isTurnDeleteEvent(event) && event.data.turn === turn)
  if (existing !== undefined) return { turn, seq: existing.seq }

  const bracket = turnBracket(events, turn, target.seq)
  if (bracket === undefined) {
    throw new TurnDeleteError('TURN_NOT_CLOSED', `turn ${String(turn)} is not closed`)
  }

  const originSeqs = new Set(events
    .filter(event => isAppendSurfaceEvent(event) && originBelongsToTurn(event, turn, bracket))
    .map(event => event.seq))
  const currentNodes = session.surface.nodes
  if (!currentNodes.includes(target.seq)) {
    throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} is no longer independently deletable`)
```

</details>

**依据 2 · 源码核查**：[src/turn-delete.ts:124-148](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/turn-delete.ts#L124-L148)

压缩和跨度条件。

<details>
<summary>查看原文（25行）</summary>

```text
  const memo = new Map<number, ReadonlySet<number>>()
  const selected: number[] = []
  const covered = new Set<number>()
  for (const seq of currentNodes) {
    const origins = surfaceOrigins(seq, events, memo)
    const targetOrigins = [...origins].filter(origin => originSeqs.has(origin))
    if (targetOrigins.length === 0) continue
    if ([...origins].some(origin => !originSeqs.has(origin))) {
      throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} shares a compacted surface node`)
    }
    const current = events[seq]
    if (current !== undefined && !originSeqs.has(seq)
      && !(current.type === 'tool/result' && current.data.turn === turn)) {
      throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} contains a non-local replacement`)
    }
    selected.push(seq)
    for (const origin of targetOrigins) covered.add(origin)
  }
  if ([...originSeqs].some(origin => !covered.has(origin)) || selected.length === 0) {
    throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} is partially compacted`)
  }
  const positions = selected.map(seq => currentNodes.indexOf(seq))
  const first = positions[0]
  if (first === undefined || positions.some((position, index) => position !== first + index)) {
    throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} is not a contiguous surface span`)
```

</details>

**依据 3 · 源码核查**：[src/turn-delete.ts:151-177](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/turn-delete.ts#L151-L177)

追加后等待持久化。

<details>
<summary>查看原文（27行）</summary>

```text
  signal.throwIfAborted()
  const tombstone = session.append('assistant/message', {
    turn,
    step: target.data.step,
    message: createAssistantMessage({
      content: [],
      source: { provider: TOMBSTONE_PROVIDER, model: TOMBSTONE_MODEL },
    }),
  }, {
    surfaceOp: { op: 'replace', start: selected[0] as number, end: selected.at(-1) as number },
    sourceEventSeqs: selected,
  })
  await ctx.sessions.flush(session)
  return { turn, seq: tombstone.seq }
}

export async function deleteTurn(
  ctx: Context,
  agent: Agent,
  assistantMessageId: MessageId,
): Promise<TurnDeleteReceipt> {
  try {
    return await agent.runMaintenance(signal =>
      deleteUnderMaintenance(ctx, agent, assistantMessageId, signal))
  } catch (error: unknown) {
    if (error instanceof TurnDeleteError) throw error
    throw new TurnDeleteError('AGENT_BUSY', error instanceof Error ? error.message : String(error))
```

</details>

#### 缺口

- 未注入 flush 错误或服务重启
  **影响**：重复成功响应与落盘是否一致未知
  **进一步探讨**：让 flush 失败后同进程重试并重开读取日志

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候值得用此功能处理误导上下文？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

在可弃用会话对照新开会话和回合删减，先记录工具副作用与保留的后续任务信息。验收删除中间回合后的新请求、压缩拒绝和进程重启。若目的是删除敏感日志或撤销工具操作，当前行为不满足，应沿独立日志和恢复流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:43-62](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/README.md#L43-L62)

作者的保留范围及三回合复核建议。

<details>
<summary>查看原文（20行）</summary>

```text
- The prompt, assistant messages, and tool records for the selected turn are removed from the Session's current model surface.
- The Session id, title, workspace association, later turns, and original append-only event log remain intact.
- A durable zero-content replacement event records the deletion. Reloading the page or restarting the profile preserves it.
- Repeating the same request is idempotent.

The plugin refuses deletion when the target turn is still open or has already been merged into a compaction replacement with other history. This prevents deleting only part of model-visible context.

## Design

The Host half registers `POST /dsh-turn-delete`, claims the target Agent's maintenance lease, validates the complete closed-turn surface span, appends a zero-content replacement, and waits for `sessions.flush()` before acknowledging success.

The browser half contributes to the public `conversation.chat.assistant-actions` and `conversation.chat.turnTail` slots. A Conversation definition projects the durable tombstone onto the target Turn. DeepSeek Harness does not yet expose a public whole-Turn visibility hook, so the tail contribution applies a narrow presentation compatibility layer to the Chat rows between adjacent Turn tails. Model context deletion does not depend on that compatibility layer.

## Compatibility

- DeepSeek Harness `0.1.0-rc.6` and `0.1.0-rc.7`
- Node.js 22.19 or newer
- Web profile and Web-based desktop shells

DeepSeek Harness is in developer preview. After upgrading Harness, verify the plugin once with a disposable Session containing three short turns and delete the middle one.
```

</details>

**依据 2 · 源码核查**：[src/turn-delete.ts:145-164](https://github.com/hanshenmesen/dsh-turn-delete/blob/4716bcbdee27b110ceea9df21f027c6dfe5888b8/src/turn-delete.ts#L145-L164)

有界替换和 flush。

<details>
<summary>查看原文（20行）</summary>

```text
  const positions = selected.map(seq => currentNodes.indexOf(seq))
  const first = positions[0]
  if (first === undefined || positions.some((position, index) => position !== first + index)) {
    throw new TurnDeleteError('TURN_COMPACTED', `turn ${String(turn)} is not a contiguous surface span`)
  }

  signal.throwIfAborted()
  const tombstone = session.append('assistant/message', {
    turn,
    step: target.data.step,
    message: createAssistantMessage({
      content: [],
      source: { provider: TOMBSTONE_PROVIDER, model: TOMBSTONE_MODEL },
    }),
  }, {
    surfaceOp: { op: 'replace', start: selected[0] as number, end: selected.at(-1) as number },
    sourceEventSeqs: selected,
  })
  await ctx.sessions.flush(session)
  return { turn, seq: tombstone.seq }
```

</details>

#### 缺口

- 无真实用户任务效果
  **影响**：无法判断后续回合依赖是否破坏
  **进一步探讨**：对照有无依赖于被删轮次的后续问答

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
