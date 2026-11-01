# LoopX for DSH

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ec91c4d](https://github.com/loopx-project/loopx/tree/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,516](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C516&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)
<!-- END META -->

> **功能**：为 DSH 接入 LoopX 同会话续轮与 GoalBar。

> **亮点**：把 LoopX 权威准入接到 DSH 会话和 GoalBar，不把整仓目标引擎归于桥接包。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：Pause 撤销待处理工作，但保留已 claimed/admitted 预约；界面停止状态不能证明当前轮或外部副作用停止。[Q03](#research-q03)

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
  - [Q01 · 谁需要该插件，目标状态由谁管理？](#detail-section-11)
  - [Q02 · Driver 如何确认激活、绑定与续轮？](#detail-section-12)
  - [Q03 · Pause 是否停止已经开始的工作？](#detail-section-13)
  - [Q04 · 初始化、重试和使用有什么成本与边界？](#detail-section-14)
  - [Q05 · 如何降低用户对暂停与当前轮状态的误解？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 LoopX 目标且希望在同一 DSH 会话持续推进的用户；原办法为人工查询 heartbeat 并复制任务。[Q01](#research-q01)

人工查 quota 和 heartbeat、将下一步粘贴进会话；更费操作但容易逐轮检查。 [Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 初始化 | 准备 CLI 和技能 | 需兼容环境，可能产生模型调用 |
| Driver | 同会话继续 | 精确激活、绑定及 quota |
| GoalBar | 查看与暂停未来续轮 | 已认领轮不等于被中止 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 宿主 | 必需 | 会话与 UI | 无法接入 |
| LoopX CLI 及 Python | 初始化与续轮必需 | 权威状态及技能 | 初始化失败 |
| 唯一绑定与 quota | 自动续轮必需 | 目标与 Agent 准入 | 不继续 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 初始化 | 安装 CLI 和技能 | 核对 CommandResult |
| 激活 | 当前 Session 调用 LoopX skill | 核对唯一绑定 |
| 继续 | 核对 quota 和每轮结果 | Pause 后仍检查当前轮 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与模型调用 | 环境及绑定配置 | 初始化可能产生两个模型 followup |
| 持续 | 模型与工具费用未知 | 检查每轮结果 | 质量及节约未测 |
| 恢复 | 当前轮及外部调用可能继续 | 人工核查与处置 | Pause 非回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话准入 | typed 激活与唯一绑定 | 跨系统恰好一次 |
| 操作可见性 | GoalBar 和 Pause 机制 | 用户理解和实际效果 |

> **思考**：Pause 撤销待处理工作，但保留已 claimed/admitted 预约；界面停止状态不能证明当前轮或外部副作用停止。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 LoopX 权威准入接到 DSH 会话和 GoalBar，不把整仓目标引擎归于桥接包。[Q01](#research-q01) [Q02](#research-q02)

精确解析会话激活、单个匹配与回执身份；重试沿用 turn id，已认领预约跨 Pause 保留。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

Pause 撤销待处理工作，但保留已 claimed/admitted 预约；界面停止状态不能证明当前轮或外部副作用停止。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

以独立项目核验绑定与 quota，用非敏感任务试验暂停前后状态；异常时检查当前轮并回退手工。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持精确激活、唯一绑定、quota/heartbeat 校验和暂停边界；未运行宿主、CLI 或模型。

- 已检查：作者 README、包清单、源码路径 packages/dsh-loopx-plugin/README.md、packages/dsh-loopx-plugin/package.json、packages/dsh-loopx-plugin/cordis.patch.yml、packages/dsh-loopx-plugin/src/index.ts、packages/dsh-loopx-plugin/src/driver.ts、packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx 及固定范围 inventory；组件：packages/dsh-loopx-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 51 个指定扩展名文件、排除 1、解析错误 0；静态检查主要接线和反证，不执行宿主、CLI、模型或对照实验。
- 下一步：固定 DSH 和 LoopX 版本，隔离项目检验匹配失败、quota、重试、人工竞争及 Pause 后当前轮。

**分析版本**

- **仓库**：[loopx-project/loopx](https://github.com/loopx-project/loopx)
- **版本号**：0.1.1-beta.6（[固定提交 ec91c4d](https://github.com/loopx-project/loopx/tree/ec91c4dbbb9aecf0abd0395455fc52466506f2b2)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在 Pause 后明确显示剩余当前轮与已撤销的预约，可能减少用户误判；须对照已有 UI 验证延迟和错误。[Q05](#research-q05)

固定 DSH 和 LoopX 版本，隔离项目检验匹配失败、quota、重试、人工竞争及 Pause 后当前轮。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 22 | 7677 | 6985 | 186 | — |
| .md | source | 2 | 784 | — | — | 6076 |
| .mjs | source | 11 | 2799 | 2610 | 74 | — |
| .tsx | source | 2 | 184 | 160 | 9 | — |
| .ts | test | 13 | 6949 | 6443 | 30 | — |
| .tsx | test | 1 | 1078 | 1005 | 1 | — |

</details>

**活跃度**

[![近30天新建 159](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=159&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 111](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=111&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 插件如何将 LoopX 的权威目标接入同会话续轮，其暂停和成本边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该插件，目标状态由谁管理？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

该组件服务于已使用 LoopX 长期目标、希望在同一 DSH 会话自动继续任务的用户。人工替代是查 quota 和 heartbeat、手动贴入会话；插件连接 GoalBar、显式激活和 Driver。Goal、Todo、quota、线程绑定仍由 LoopX 所有，包是桥接，不能将整个 LoopX 引擎归于插件。安装不等于激活，自动续轮也不证明任务产物正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/cordis.patch.yml:1-16](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/cordis.patch.yml#L1-L16)

分别挂载 GoalBar、初始化、Driver 和默认关闭 observer。

<details>
<summary>查看原文（16行）</summary>

```text
# LoopX owns Goal, Todo, quota, and thread-binding authority.
- insert:
    # The package-root Host row is also the discovery anchor for dsh.client.
    - id: loopx-goalbar
      name: dsh-loopx-plugin

    - id: loopx-init-command
      name: dsh-loopx-plugin/init-command

    - id: loopx-driver
      name: dsh-loopx-plugin/driver

    # Loaded as its own default-off Cordis row. It has no Driver or Agent
    # injection and registers only session publication hooks when fully pinned.
    - id: loopx-shadow-observer
      name: dsh-loopx-plugin/observer
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/README.md:482-507](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L482-L507)

按 Session 的激活条件和权威边界。

<details>
<summary>查看原文（26行）</summary>

```text
## Driver activation boundary

Activation is per Session, not per plugin, process, Agent, Goal, or project.
The Driver accepts only either of these durable typed Session facts:

- a `user/message` whose source is exactly `skill-invocation`, whose name is
  exactly `loopx`, and whose form is exactly `instructions`;
- a model `tool/call` named exactly `skill`, with JSON object arguments whose
  `name` is exactly `loopx`, paired by call id with a subsequent successful
  `tool/result`.

A skill catalog, ordinary prose, shell text, `/loopx-init`, plugin-authored
init or heartbeat messages, a failed, malformed, unmatched, or superseded
model call, and the presence of a CLI, registry, Goal, binding, or project file
do not activate the Driver. Recovery folds only the current Session's existing
typed event history in memory and performs no external probe. Replacing or
clearing a Session recomputes from the replacement history; activation never
inherits across that boundary and has no plugin-owned durable store.

Existing Sessions upgraded from an older plugin version remain inactive when
their retained history has no recognizable invocation evidence. Invoke the
installed `loopx` skill once in every Session that should continue
automatically. Activation records intent only: it does not create a binding,
select a Goal or Agent, spend quota, or grant tool authority. After activation,
the existing exact binding, fresh quota, scheduler/heartbeat, reservation, and
pre-step revalidation order remains authoritative.
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/index.ts:10-26](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/index.ts#L10-L26)

Host 挂载 GoalBar 服务。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = 'dsh-loopx-plugin'
export const inject = ['agents', 'connection', 'loopxBootstrap']

/** Package-root Host plugin: one GoalBar service, never a second Driver. */
export function apply(ctx: Context): void {
  ctx.effect(() => {
    const service = createGoalBarService({
      getAgent: sessionId => ctx.agents.get(sessionId as Agent['id']),
      coordinator: goalBarCoordinator,
      resolveCommand: signal => resolvePluginLoopXCommand({ signal }),
      warn: message => { ctx.logger.warn(message) },
    })
    const disposeRpc = registerGoalBarConnectionTransport(ctx.connection, service)
    return async () => {
      await service.dispose()
      await disposeRpc()
    }
```

</details>

#### 缺口

- 固定版本的 DSH 宿主、LoopX CLI 和模型未在本轮运行
  **影响**：不能据静态接线证明实际续轮、任务质量或工具副作用
  **进一步探讨**：隔离工作区验证绑定、quota、暂停和任务产物

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Driver 如何确认激活、绑定与续轮？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Driver 只接受精确的用户 skill-invocation 或匹配成功结果的模型 skill 调用；普通文本和初始化不算激活。它要求 binding 为当前线程且恰好一个 Goal/Agent，检查 quota 的身份和 turn_instance_id 回执，heartbeat 也必须有同一目标、Agent、turn id 与唯一任务标记。然后处理预约和宿主监听器前后重查；这些是静态准入机制，非跨进程及外部业务效果的原子性证明。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:216-237](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L216-L237)

识别精确用户或模型调用。

<details>
<summary>查看原文（22行）</summary>

```text
function exactUserActivation(event: SessionEvent): boolean {
  if (event.type !== 'user/message') return false
  const data = record(event.data)
  const source = record(data?.source)
  return source?.kind === 'skill-invocation'
    && source.name === 'loopx'
    && source.form === 'instructions'
}

function exactModelActivationCall(event: SessionEvent): string | undefined {
  if (event.type !== 'tool/call') return undefined
  const data = record(event.data)
  const callId = eventCallId(data?.callId)
  if (callId === undefined || data?.name !== 'skill'
    || typeof data.arguments !== 'string') return undefined
  let parsed: unknown
  try {
    parsed = JSON.parse(data.arguments)
  } catch {
    return undefined
  }
  return record(parsed)?.name === 'loopx' ? callId : undefined
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:240-278](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L240-L278)

模型调用需匹配成功结果。

<details>
<summary>查看原文（39行）</summary>

```text
function foldActivationEvent(
  projection: ActivationProjection,
  event: SessionEvent,
): void {
  if (projection.activated) return
  if (exactUserActivation(event)) {
    projection.activated = true
    projection.pendingModelCalls.clear()
    return
  }
  if (event.type === 'tool/call') {
    const data = record(event.data)
    const callId = eventCallId(data?.callId)
    if (callId === undefined) return
    projection.pendingModelCalls.delete(callId)
    if (exactModelActivationCall(event) !== undefined) {
      projection.pendingModelCalls.add(callId)
    }
    return
  }
  if (event.type !== 'tool/result') return
  const data = record(event.data)
  const message = record(data?.message)
  const source = record(message?.source)
  const callId = eventCallId(source?.callId)
  if (callId === undefined) return
  const matched = projection.pendingModelCalls.delete(callId)
  const content = message?.content
  const block = Array.isArray(content) && content.length === 1
    ? record(content[0])
    : undefined
  const successful = source?.kind === 'tool'
    && message?.role === 'user'
    && block?.type === 'tool-result'
    && block.toolCallId === callId
    && (block.isError === undefined || block.isError === false)
    && data?.error === undefined
  if (matched && successful) {
    projection.activated = true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:306-355](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L306-L355)

唯一绑定与 quota 回执校验。

<details>
<summary>查看原文（50行）</summary>

```text
function exactBinding(
  payload: Record<string, unknown>,
  threadId: string,
): Binding | undefined {
  if (payload.schema_version !== RESOLUTION_SCHEMA
    || payload.ok !== true
    || payload.status !== 'bound'
    || payload.host_surface !== HOST_SURFACE
    || payload.thread_id !== threadId) return undefined
  const goalId = typeof payload.goal_id === 'string' ? payload.goal_id : ''
  const agentId = typeof payload.agent_id === 'string' ? payload.agent_id : ''
  const matches = Array.isArray(payload.matches) ? payload.matches : []
  const match = matches.length === 1 ? record(matches[0]) : undefined
  return goalId.length > 0
    && goalId.trim() === goalId
    && agentId.length > 0
    && agentId.trim() === agentId
    && match?.goal_id === goalId
    && match.agent_id === agentId
    ? { goalId, agentId }
    : undefined
}

function exactQuotaContext(
  payload: Record<string, unknown>,
  binding: Binding,
): boolean {
  const identity = record(payload.agent_identity)
  return payload.mode === 'should-run'
    && payload.goal_id === binding.goalId
    && identity?.agent_id === binding.agentId
    && identity.registered === true
}

function exactQuotaReceipt(
  payload: Record<string, unknown>,
  turnInstanceId: string,
): boolean {
  return record(payload.heartbeat_receipt)?.turn_instance_id === turnInstanceId
}

function exactQuota(
  payload: Record<string, unknown>,
  binding: Binding,
  turnInstanceId: string,
): boolean {
  return exactQuotaContext(payload, binding)
    && payload.ok === true
    && payload.should_run === true
    && exactQuotaReceipt(payload, turnInstanceId)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:405-423](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L405-L423)

heartbeat 身份与任务标记校验。

<details>
<summary>查看原文（19行）</summary>

```text
function exactHeartbeat(
  payload: Record<string, unknown>,
  binding: Binding,
  turnInstanceId: string,
): string | undefined {
  if (payload.schema_version !== HEARTBEAT_SCHEMA
    || payload.ok !== true
    || payload.goal_id !== binding.goalId
    || payload.agent_id !== binding.agentId
    || payload.turn_instance_id !== turnInstanceId) return undefined
  const taskBody = typeof payload.task_body === 'string' ? payload.task_body : ''
  const assignments = [...taskBody.matchAll(/\bLOOPX_TURN=([^\s`'";]+)/gu)]
    .map(match => match[1])
  return taskBody.length > 0
    && taskBody.length <= 32_000
    && assignments.length === 1
    && assignments[0] === turnInstanceId
    ? taskBody
    : undefined
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/README.md:533-539](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L533-L539)

绑定和 pre-step 重查及人工优先。

```text
The Driver resolves the current project registry with
`resolve-agent-thread`, requires one exact Goal/Agent match for the live DSH
session, and rechecks binding plus quota before and after downstream pre-step
listeners. A human message removes an unclaimed automatic reservation; a
mixed batch rejects the automatic message and restores the human work.
The Driver queues at most one Driver-owned followup per automatic admission.
Initialization messages use the distinct `dsh-loopx-plugin/init-command`
```

#### 缺口

- 固定版本的 DSH 宿主、LoopX CLI 和模型未在本轮运行
  **影响**：不能据静态接线证明实际续轮、任务质量或工具副作用
  **进一步探讨**：隔离工作区验证绑定、quota、暂停和任务产物

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Pause 是否停止已经开始的工作？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Driver 的 cancelQueued 对已 claimed 或 admitted 的预约设置 preserveAcrossPause，然后取消待处理工作；因此 Pause 不等于取消已经认领或正在执行的模型轮次，更不能回滚外部工具动作。人类消息会标记竞争并取消待处理续轮；错误暂停本次自动评估，人工消息可清除该标记。现场应监测当前轮和副作用，不以按钮状态推断全部工作已经停止。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:533-560](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L533-L560)

人工消息与错误影响待处理续轮。

<details>
<summary>查看原文（28行）</summary>

```text
  onInboxInserted(agent: Agent, message: UserMessage): void {
    const state = this.stateFor(agent)
    if (state.reservation !== undefined && sameReservation(message, state.reservation)) return
    state.competing = true
    if (message.source.kind === 'user') state.pauseAfterTurnError = false
    this.cancelPending(state)
  }

  onInboxClaimed(agent: Agent, message: UserMessage): void {
    const state = this.stateFor(agent)
    if (state.reservation !== undefined && sameReservation(message, state.reservation)) {
      state.reservation.phase = 'claimed'
      return
    }
    state.competing = true
  }

  onInboxDiscarded(agent: Agent, message: UserMessage): void {
    const state = this.states.get(agent)
    if (state?.reservation !== undefined && sameReservation(message, state.reservation)) {
      this.retireReservation(state)
    }
  }

  onAgentError(agent: Agent): void {
    const state = this.stateFor(agent)
    state.pauseAfterTurnError = true
    this.cancelPending(state)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:594-614](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L594-L614)

Pause 保留 claimed 或 admitted 的预约。

<details>
<summary>查看原文（21行）</summary>

```text
  async cancelQueued(
    capture: GoalBarSessionCapture,
  ): Promise<GoalBarDriverActionReceipt> {
    if (!this.captureIsLive(capture)) {
      return { kind: 'unavailable', reason: 'session_unavailable' }
    }
    const state = this.states.get(capture.agent)
    if (state === undefined) return { kind: 'applied' }
    if (state.stopping || state.activation.session !== capture.session) {
      return { kind: 'unavailable', reason: 'session_unavailable' }
    }

    const reservation = state.reservation
    if (reservation?.phase === 'claimed' || reservation?.phase === 'admitted') {
      reservation.preserveAcrossPause = true
    }
    this.cancelPending(state)
    return this.captureIsLive(capture)
      && state.activation.session === capture.session
      ? { kind: 'applied' }
      : { kind: 'unavailable', reason: 'session_unavailable' }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/README.md:523-531](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L523-L531)

开始前取消与结算边界。

```text
For an admitted automatic continuation, that exact turn id is also carried in
the LoopX-owned canonical heartbeat body and the typed DSH continuation source.
The source is attribution for reservation matching, not authority. Before work
enters a model step, the Driver replays the same receipt and the LoopX guard
returns the typed settlement plan for that exact id. Accountable work writes
back and spends through that plan's single deterministic effect identity; it
does not fall back to an unbound generic spend command. Human priority, Pause,
dispose, or a failed pre-step check before work begins does not fabricate a
writeback, spend, or void receipt.
```

#### 缺口

- 固定版本的 DSH 宿主、LoopX CLI 和模型未在本轮运行
  **影响**：不能据静态接线证明实际续轮、任务质量或工具副作用
  **进一步探讨**：隔离工作区验证绑定、quota、暂停和任务产物

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 初始化、重试和使用有什么成本与边界？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

初始化需要兼容 DSH、Python 和 LoopX CLI；README 描述私有 target 的固定 argv 安装，普通有效且未取消的初始化通常产生两个模型 followup，结果以原生 CommandResult 为准。Driver 只重试安全读取和幂等 quota 回执，最多初次后两次，使用同一 turn id；拒绝、取消和人工输入不重试。模型、执行与供应商成本和任务收益未测；先用独立项目、非敏感任务和预算验证，出现错绑、持续运行或异常副作用时停用并核查当前轮，回退手工推进。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/README.md:448-470](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L448-L470)

初始化安装和两次 followup 成本。

<details>
<summary>查看原文（23行）</summary>

```text
Published beta.6 still adds the shared Web dependency and can disconnect DSH
during hot uninstall, including with Hub 1.6.4. For that published package,
close DSH, remove it with the native plugin CLI, then restart DSH.

The repair command has no arguments. Extra input returns a usage error before any
model work or CLI probe. A valid invocation queues a bounded start followup on
the exact receiving Agent, then probes the current LoopX installation. When the
CLI is missing or lacks the DSH-native skill contract, it runs exactly one
fixed-argv `pip install --upgrade --target <plugin-runtime> 'loopx>=1.2.4'`, writes a
small managed Python launcher beside that target, then uses that same
interpreter and launcher to install and read back the skills. Driver and
GoalBar resolve this same managed runtime, including after an explicit repair.
It never constructs a shell command, mutates the system Python environment,
edits a registry, or retries the install mutation.

Unless the command is cancelled, it queues a second bounded followup for the
typed success or failure result. These are ordinary Agent turns, so a valid,
uncancelled invocation normally adds two model calls; cancellation leaves only
the already queued start turn, while invalid input adds none. The prompts do
not authorize tools, commands, or another installation. Followup delivery is
best effort and is not retried. The native `CommandResult` rendered by the
command UI remains authoritative: a followup failure or model reply cannot
change the installation result or repeat its mutation.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/README.md:509-521](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L509-L521)

Driver 重试范围和终止。

<details>
<summary>查看原文（13行）</summary>

```text
## Driver retry boundary

DSH's LLM retry plugin owns provider-request retries. This Driver retries only
safe fixed-argv LoopX reads and an idempotent `quota should-run` receipt, at
most twice beyond the first attempt. Every retry uses the same
`--turn-instance-id`. Typed authority denials, incompatible schemas,
cancellation, and human input are never retried. There is no cumulative
eight-failure breaker or plugin-owned durable activation state. The small
process-local activation projection is bound to one exact Session and is
reconstructed only from its typed event history. Exhausting the three attempts
stops that evaluation; it does not create a periodic error-retry loop. Only a
typed LoopX local-scheduler plan can schedule another wakeup, and its limit on
unchanged polls is enforced.
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/package.json:1-7](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/package.json#L1-L7)

包身份与版本。

```text
{
  "name": "dsh-loopx-plugin",
  "version": "0.1.1-beta.6",
  "description": "One-step LoopX bootstrap, same-session driver, and local GoalBar for DeepSeek Harness",
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
```

#### 缺口

- 固定版本的 DSH 宿主、LoopX CLI 和模型未在本轮运行
  **影响**：不能据静态接线证明实际续轮、任务质量或工具副作用
  **进一步探讨**：隔离工作区验证绑定、quota、暂停和任务产物

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低用户对暂停与当前轮状态的误解？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：GoalBar 在 Pause 成功时同时展示已撤销的未来预约与仍可能运行的当前轮及其确认时间，可减少用户误以为停止了所有工作。现有 GoalBar 已展示激活和活跃 Agent 状态、Driver 也保留 claimed/admitted，不能把状态显示视为全新发明；跨读取和 UI 投影可能过时，状态文案不能声称外部动作已回滚。对照现有 UI，以 queued、claimed、running 和迟到的状态事件测误判、刷新延迟、用户操作时间及敏感信息暴露；若效果未改善或状态不可信则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:594-614](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/driver.ts#L594-L614)

已认领预约跨 Pause 保留。

<details>
<summary>查看原文（21行）</summary>

```text
  async cancelQueued(
    capture: GoalBarSessionCapture,
  ): Promise<GoalBarDriverActionReceipt> {
    if (!this.captureIsLive(capture)) {
      return { kind: 'unavailable', reason: 'session_unavailable' }
    }
    const state = this.states.get(capture.agent)
    if (state === undefined) return { kind: 'applied' }
    if (state.stopping || state.activation.session !== capture.session) {
      return { kind: 'unavailable', reason: 'session_unavailable' }
    }

    const reservation = state.reservation
    if (reservation?.phase === 'claimed' || reservation?.phase === 'admitted') {
      reservation.preserveAcrossPause = true
    }
    this.cancelPending(state)
    return this.captureIsLive(capture)
      && state.activation.session === capture.session
      ? { kind: 'applied' }
      : { kind: 'unavailable', reason: 'session_unavailable' }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx:16-30](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx#L16-L30)

已有 activation 与运行状态显示。

<details>
<summary>查看原文（15行）</summary>

```text
  /** Exact identity supplied only by conversation.input.dock inject(sessionId). */
  readonly rpcSessionId: string
  readonly rpc: GoalBarRpc
  readonly t: GoalBarTranslate
  readonly subscribeConnectionReset?: GoalBarConnectionResetSubscriber | undefined
}

function visibleStatus(
  snapshot: GoalBarSnapshotV1,
): 'active' | 'running' | 'paused' {
  if (snapshot.goalActivation === 'stopped') return 'paused'
  return snapshot.agentStatus === 'running' ? 'running' : 'active'
}

function classes(...values: Array<string | undefined | false>): string {
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/README.md:413-430](https://github.com/loopx-project/loopx/blob/ec91c4dbbb9aecf0abd0395455fc52466506f2b2/packages/dsh-loopx-plugin/README.md#L413-L430)

GoalBar 权威及隐私边界。

<details>
<summary>查看原文（18行）</summary>

```text
## GoalBar authority and privacy boundary

The GoalBar carrier uses Connection's authenticated `/api/loopx.goalbar`
Fetch route. Explicit callers of the deprecated RPC registration can still
register `/loopx`; plugin startup does not select it automatically. Both pass
Connection's Host/Origin trust fence and browser authentication, and this
package adds no second credential of its own. The deployment's reachability
policy — loopback by default, or declared `trustedHosts` — decides which
browsers can reach the host at all; Phase 1 does not support LAN or remote
browsers. The browser supplies only its injected DSH Session id and, for an
action, the last validated Goal/Agent pair. The Host re-derives cwd and thread
identity from the live DSH Agent, freshly resolves the binding, and executes
only fixed LoopX argv.

The wire allowlist contains ids, activation, live Agent status, full-lane
counts, cursors, opaque source revisions, and fixed error codes. It excludes
Todo text, Goal objective, quota, evidence, CLI output, exception messages,
registry paths, credentials, and binding candidates. A source revision is only
```

</details>

#### 缺口

- 固定版本的 DSH 宿主、LoopX CLI 和模型未在本轮运行
  **影响**：不能据静态接线证明实际续轮、任务质量或工具副作用
  **进一步探讨**：隔离工作区验证绑定、quota、暂停和任务产物

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
