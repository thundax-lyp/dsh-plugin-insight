# LoopX DSH Plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[71190b6](https://github.com/loopx-project/loopx/tree/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)
<!-- END META -->

> **功能**：将 LoopX 初始化、同会话续轮和 GoalBar 接到 DeepSeek Harness。

> **亮点**：[Q02](#research-q02) 将 Goal、Agent、轮次和宿主当前会话绑定到同一预约。[Q03](#research-q03) 提供分离的目标暂停和待处理队列撤销路径。业务状态与执行责任仍分属 LoopX 与 DSH。

> **主要限制**：[Q03](#research-q03) 显示暂停后已认领预约可能保留，GoalBar 的 paused 不能说明当前执行或外部副作用停止。

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
  - [Q01 · 哪个任务适合续轮，和手工推进相比增加什么？](#detail-section-11)
  - [Q02 · 何时从被动观察变成有权续轮？](#detail-section-12)
  - [Q03 · 暂停、失败或竞争时当前轮和预约会怎样？](#detail-section-13)
  - [Q04 · 安装及配置会带来哪些依赖和副作用？](#detail-section-14)
  - [Q05 · 怎样衡量采用价值与失败退出？](#detail-section-15)
  - [Q06 · 更细的暂停状态能否减少误判？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 LoopX 目标并想连续推进可逐轮验收的小任务的 DSH 用户，可在原会话核对绑定和续轮。[Q01](#research-q01)

人工可查 LoopX 状态、复制下一步并在 DSH 续接。自动化增量是减少切换并在实际准入时再次核对目标。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 初始化和 Skill 回读 | 准备 LoopX 命令和工作流 | 可安装隔离运行时和写入 Skill |
| 同会话 Driver | 自动接入权威给出的下一轮 | 必须有 typed 激活、唯一绑定、配额和实际准入 |
| GoalBar | 查看目标并暂停未来续轮 | 已认领工作仍可继续，需回读 |
| 可选事件诊断 | 记录配好的目标会话信息 | 完整配置才启用，会写诊断账本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相符的 DSH、Node 与发布包 | 装配需要 | 提供会话事件、运行和连接接口 | 回读具体版本后再试 |
| 兼容的 LoopX CLI，或安装所需 Python 和 pip | 初始化及运行需要 | 准入、Skill 安装和读回 | 显式 CLI 不匹配时由用户处理 |
| 当前会话已调用 Skill 且有唯一绑定 | 自动续轮需要 | 归属目标、Agent 和配额 | 不排入自动任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对版本、隔离目标和已有配置 | 初始化和 Skill 回读可核实 |
| 激活 | 用户或 Agent 调用对应 Skill | 权威绑定唯一且当前 Agent 可执行 |
| 续轮 | Driver 核对配额并排队，宿主作步骤准入 | 仅本轮原会话接纳，结果可核查 |
| 退出 | 暂停未来工作，复核当前轮 | 若运行或效果未知先检查，必要时回人工 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装网络和运行时写盘，未量化 | 核对版本、Skill 和绑定 | 启动可能安装依赖 |
| 持续 | CLI 和模型使用未知 | 每轮确认结果和边界 | 未知实际收益 |
| 失败恢复 | 当前轮或外部操作可能仍消耗资源 | 查当前轮、回读目标和文件 | Pause 不撤销外部副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 自动交接 | 当前会话、目标、Agent 和轮次有身份约束 | 真实宿主并发及恰好一次 |
| 暂停与回读 | 未来队列与已认领预约处理不同 | 用户如何理解 UI 停状态 |
| 工作投入 | 可减少手工搬运任务 | 合格任务净节时和成本 |

> **思考**：[Q03](#research-q03) 显示暂停后已认领预约可能保留，GoalBar 的 paused 不能说明当前执行或外部副作用停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将 Goal、Agent、轮次和宿主当前会话绑定到同一预约。[Q03](#research-q03) 提供分离的目标暂停和待处理队列撤销路径。业务状态与执行责任仍分属 LoopX 与 DSH。

[Q02](#research-q02) 的可复用设计是匹配 typed 事件、绑定与确切消息，然后在真实步骤再次确认。取舍是跨系统准入仍存在阶段间隔，[Q03](#research-q03) 展示暂停后保留预约所带来的使用语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示暂停后已认领预约可能保留，GoalBar 的 paused 不能说明当前执行或外部副作用停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 在无外部副作用的项目试一轮。核对绑定和实际收到的任务，按 [Q03](#research-q03) 回读暂停后的当前 Agent 状态。若结果未知或绑定不符，停止下一轮并回人工推进。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

typed 激活、当前轮次准入、状态回读和暂停分支有静态证据。实际交付收益、跨系统竞态与拟议提示仍待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-loopx-plugin/README.md、packages/dsh-loopx-plugin/cordis.patch.yml、packages/dsh-loopx-plugin/src/index.ts、packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts、packages/dsh-loopx-plugin/src/driver.ts、packages/dsh-loopx-plugin/src/goalbar/service.ts、packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx、packages/dsh-loopx-plugin/package.json、packages/dsh-loopx-plugin/src/cli.ts、packages/dsh-loopx-plugin/src/init-command.ts、packages/dsh-loopx-plugin/src/observer.ts 及固定范围 inventory；组件：packages/dsh-loopx-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅统计子包指定 Markdown 和 JS/TS。读实际启动、Driver 及 GoalBar 代表路径、安装和诊断接线。未执行宿主、LoopX、Python 或测试，未审全量 LoopX 业务引擎和传输鉴权。
- 下一步：在固定 DSH 和 LoopX 版本中用隔离小任务比较手工和自动交接，分别检查竞争消息、暂停和错误结果。拟议提示按 [Q06](#research-q06) 的盲测验证。

**分析版本**

- **仓库**：[loopx-project/loopx](https://github.com/loopx-project/loopx)
- **版本号**：0.1.1-beta.6（[固定提交 71190b6](https://github.com/loopx-project/loopx/tree/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把新轮停止、当前轮保留和效果未知分开显示，以误判率和恢复耗时比较是否值得。

在固定 DSH 和 LoopX 版本中用隔离小任务比较手工和自动交接，分别检查竞争消息、暂停和错误结果。拟议提示按 [Q06](#research-q06) 的盲测验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 22 | 7705 | 7004 | 189 | — |
| .md | source | 2 | 818 | — | — | 6366 |
| .mjs | source | 11 | 2843 | 2654 | 75 | — |
| .tsx | source | 3 | 373 | 312 | 34 | — |
| .ts | test | 13 | 6953 | 6447 | 30 | — |
| .tsx | test | 2 | 1207 | 1112 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 128](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=128&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 130](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=130&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 108](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=108&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 LoopX 目标的 DSH 用户在原会话自动续轮时，绑定、配额、暂停和副作用由谁负责？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪个任务适合续轮，和手工推进相比增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已有 LoopX 目标与 DSH 会话、要连续推进几个可逐轮验收的小任务的人。手工办法是查询 LoopX 的绑定、当前是否可运行和下一步，再将任务送回同一会话。这个包将这段交接放入 Driver 和会话 UI。它能把权威返回的任务排到同一 Agent，并用 GoalBar 展示和操作匹配的目标。合格一轮需绑定正确、经准入、被 DSH 接受且实际产生符合要求的结果。Goal、Todo、配额与持久绑定仍由 LoopX 管，队列与执行由 DSH 管。包根实际启动的是 Host shared API，并非另起第二个 Driver；旧 RPC 注册只是另行导出的入口。README 用语与启动接线不完全一致时以固定代码为准。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:3-22](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/README.md#L3-L22)

作者陈述初始化、续轮、GoalBar 和工作区面板的用途。

<details>
<summary>查看原文（20行）</summary>

```text
`dsh-loopx-plugin` is one independently versioned DSH package with four
cooperating surfaces (three Loader rows and one Client panel):

- the init row automatically installs or upgrades the LoopX CLI, installs the
  packaged workflow skills into `$DSH_AGENTS_HOME/skills` (default
  `~/.agents/skills`), and verifies the DSH-native `loopx` entry before DSH
  finishes loading it. `/loopx-init` remains the explicit repair command.
- a passive same-session Driver becomes eligible only after the exact current
  Session successfully invokes the exact `loopx` skill. It then asks LoopX
  whether another turn may run and queues the authoritative heartbeat task
  into that live DSH Agent.
- the package-root Host registers GoalBar at the authenticated
  `/api/loopx.goalbar` route required by DSH 0.1.5. Its web Client adds a compact
  GoalBar between DSH's native GoalBar and Queue dock rows, visible only for one
  exact live `(goalId, loopxAgentId)` binding.
- the web Client also adds one global sidebar entry, **LoopX**, whose central
  panel embeds the already-running personal workspace from
  `loopx dashboard` on loopback. The panel is presentation only: it starts no
  service, reads no LoopX state itself, and renders a recovery notice plus
  retry when that loopback service is absent.
```

</details>

**依据 2 · 作者声明**：[packages/dsh-loopx-plugin/README.md:24-38](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/README.md#L24-L38)

安装、激活与 LoopX 权威边界。

<details>
<summary>查看原文（15行）</summary>

```text
Installing the plugin and starting DSH load and prepare these capabilities;
neither creates a binding nor activates the Driver. The GoalBar
does one bounded read when a browser row mounts, then watches exact-Session
`step/end` and `turn/end` boundaries. It rereads LoopX only when the opaque
revision of the authoritative binding or active Goal state changes; a watch
lease also detects changes written outside that Session. DSH Agent-status
events update an existing row without a LoopX business read. Until one exact
Session contains valid typed `loopx` invocation evidence, its Driver makes no
LoopX CLI, binding, quota, or heartbeat call, creates no timer, and queues no
followup.

The package does not expose LoopX model tools, a binding sidecar, or its own
Goal/Todo state. Models use the installed LoopX skills and call the LoopX CLI
directly. LoopX remains the only authority for Goal, Agent, Todo, quota,
activation, and durable thread-binding data. The GoalBar protocol and its
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/cordis.patch.yml:1-16](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/cordis.patch.yml#L1-L16)

各 Loader 行分别挂载。

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

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/index.ts:10-27](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/index.ts#L10-L27)

包根启动一套 GoalBar 服务并注册共享传输。

<details>
<summary>查看原文（18行）</summary>

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
  }, 'dsh-loopx GoalBar Host service')
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts:134-153](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts#L134-L153)

旧 RPC 导出与实际启动采用的 POST shared API 分开。

<details>
<summary>查看原文（20行）</summary>

```text
/** @deprecated Explicit legacy registration; the plugin uses the shared API. */
export function registerGoalBarConnectionRpc(
  connection: Pick<HostConnectionHandle, 'rpc'>,
  service: GoalBarServiceHandle,
): () => Promise<void> {
  return connection.rpc.handle(GOALBAR_RPC_CHANNEL, createGoalBarConnectionHandler(service))
}

/** Register on the authenticated shared API required by the DSH peer floor. */
export function registerGoalBarConnectionTransport(
  connection: Pick<HostConnectionHandle, 'fetch'>,
  service: GoalBarServiceHandle,
): () => Promise<void> {
  const handler = createGoalBarConnectionHandler(service)
  return connection.fetch.register({
    path: `${GOALBAR_SHARED_API_CHANNEL}/${GOALBAR_SHARED_API_ENDPOINT}`,
    methods: ['POST'],
    requestBody: 'buffered',
    fetch: request => handleSharedApiRequest(request, handler),
  })
```

</details>

#### 缺口

- 没有同任务手工推进与自动续轮的效果比较
  **影响**：无法判断整体交付质量或减少了多少人工交接
  **进一步探讨**：在一个隔离目标的同类 Todo 上记录交接和任务验收结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 何时从被动观察变成有权续轮？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Driver 的会话事件处理只接受当前 Agent 的同一 Session 对象。激活来自宿主 typed skill-invocation 的 loopx instructions 消息，或工具名 skill、参数指定 loopx 且 callId 匹配成功结果的模型调用，普通文本提到 LoopX 不触发。实际评估还要求 Agent 活着且 idle、无竞争、无在途预约和待输入。随后用当前会话查唯一绑定，以同一 turnInstanceId 核对 Goal、LoopX Agent、should-run 与 heartbeat 回执。不允许运行时等待调度，模糊或无绑定不排队。通过后保留完整消息与预约身份并 followup 到原 Agent。pre-step 拒绝过期预约、竞争消息或权威不再匹配，并在后续处理返回后重查。这个分阶段设计减少错会话，不代表跨宿主事务恰好一次。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:216-237](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L216-L237)

人类 typed 调用与模型 skill 调用形状。

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

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:240-280](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L240-L280)

模型调用需匹配无错的 tool-result 才激活。

<details>
<summary>查看原文（41行）</summary>

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
    projection.pendingModelCalls.clear()
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:786-799](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L786-L799)

评估的当前 Agent、会话、命令、队列和忙闲条件。

<details>
<summary>查看原文（14行）</summary>

```text
  private ready(state: DriverState): boolean {
    return !this.disposed
      && !state.stopping
      && state.activation.session === state.agent.session
      && state.activation.activated
      && !state.pauseAfterTurnError
      && !state.competing
      && state.commands.size === 0
      && state.reservation === undefined
      && this.isLiveAgent(state.agent)
      && state.agent.status === 'idle'
      && !inboxHasPending(state.agent.inbox)
      && state.agent.id === state.agent.session.id
      && state.agent.id === state.agent.session.header.id
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:307-326](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L307-L326)

绑定必须唯一且线程与字段一致。

<details>
<summary>查看原文（20行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:916-950](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L916-L950)

解析绑定并按同一轮次验证 quota。

<details>
<summary>查看原文（35行）</summary>

```text
    const bindingPayload = await this.resolveBinding(command, state.agent, signal)
    this.ensureReady(state, signal, session)
    if (bindingPayload.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX binding authority rejected automatic continuation',
        false,
      )
    }
    const binding = exactBinding(bindingPayload, String(state.agent.id))
    if (binding === undefined) {
      return { kind: 'wait', schedulerToken: '', unchangedPolls: 0 }
    }

    const turnInstanceId = this.makeTurnInstanceId()
    const quota = await this.readQuota(command, state.agent, binding, turnInstanceId, signal)
    this.ensureReady(state, signal, session)
    if (quota.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX quota authority rejected automatic continuation',
        false,
      )
    }
    if (!exactQuotaContext(quota, binding)
      || (quota.should_run === true && !exactQuotaReceipt(quota, turnInstanceId))) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX quota response did not match the bound Goal and Agent',
        false,
      )
    }
    if (quota.should_run !== true) {
      return schedulerWait(quota, state.schedulerToken, state.unchangedPolls)
    }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:951-979](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L951-L979)

heartbeat 身份通过后才构造排队计划。

<details>
<summary>查看原文（29行）</summary>

```text
    const heartbeat = await this.readHeartbeat(
      command,
      state.agent,
      binding,
      turnInstanceId,
      signal,
    )
    this.ensureReady(state, signal, session)
    if (heartbeat.ok !== true) {
      throw new LoopXCliError(
        'typed_failure',
        'LoopX heartbeat authority rejected automatic continuation',
        false,
      )
    }
    const taskBody = exactHeartbeat(heartbeat, binding, turnInstanceId)
    if (taskBody === undefined) {
      throw new LoopXCliError(
        'invalid_schema',
        'LoopX heartbeat response did not match the bound Goal and Agent',
        false,
      )
    }
    return {
      kind: 'queue',
      ...binding,
      session,
      turnInstanceId,
      taskBody: taskBodyWithRewardMemory(taskBody, quota),
```

</details>

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:875-893](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L875-L893)

原会话建立预约和实际 followup。

<details>
<summary>查看原文（19行）</summary>

```text
    if (!this.ready(state) || state.agent.session !== plan.session) return true
    const message = automaticMessage(plan)
    const reservation: Reservation = {
      messageId: message.id,
      content: message.content,
      source: message.source,
      session: plan.session,
      goalId: plan.goalId,
      agentId: plan.agentId,
      turnInstanceId: plan.turnInstanceId,
      phase: 'queued',
      preserveAcrossPause: false,
    }
    state.reservation = reservation
    try {
      state.agent.followup(message)
    } catch (error: unknown) {
      this.retireReservation(state)
      this.warn(`dsh-loopx-driver: could not queue same-session work: ${renderThrown(error)}`)
```

</details>

**依据 8 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:668-687](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L668-L687)

拒绝混合消息和权威失效。

<details>
<summary>查看原文（20行）</summary>

```text
    if (submitted === undefined) return next()
    if (reservation === undefined || !sameReservation(submitted, reservation)
      || reservation.phase !== 'claimed') {
      if (reservation !== undefined && submitted.id === reservation.messageId) {
        this.retireReservation(state)
      }
      this.restoreOtherMessages(agent, messages, submitted)
      return { kind: 'reject' }
    }
    if (messages.some(message => message.id !== submitted.id)) {
      this.retireReservation(state)
      this.restoreOtherMessages(agent, messages, submitted)
      return { kind: 'reject' }
    }

    if (!(await this.authorityStillAllows(state, reservation, signal))) {
      this.retireReservation(state)
      this.restoreOtherMessages(agent, messages, submitted)
      this.requestEvaluation(state)
      return { kind: 'reject' }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:708-721](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L708-L721)

下游判定后再次检查消息与权威。

<details>
<summary>查看原文（14行）</summary>

```text
    const admitted = decision.messages.find(message => message.id === reservation.messageId)
    if (decision.messages.length !== 1
      || admitted === undefined
      || !sameReservation(admitted, reservation)) {
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
      return { kind: 'reject' }
    }
    if (!(await this.authorityStillAllows(state, reservation, signal))) {
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
      return { kind: 'reject' }
    }
    return decision
```

</details>

**依据 10 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1253-1262](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L1253-L1262)

pre-step 和 exact Session 事件接线。

<details>
<summary>查看原文（10行）</summary>

```text
    ctx.on('agent/pre-step', ({ agent, messages, signal }, next) => (
      driver.onPreStep(agent, messages, signal, next)
    ))
    ctx.on('session/event', (session, event) => {
      if (event.type === 'step/end' || event.type === 'turn/end') {
        goalBarCoordinator.publishSessionCandidate(session, event)
      }
      const agent = ctx.agents.get(session.id)
      if (agent?.session === session) driver.onSessionEvent(agent, event)
    })
```

</details>

#### 缺口

- 未在真实宿主触发重放、重新绑定或多个并行请求
  **影响**：不能证明所有竞态均被拦住
  **进一步探讨**：在隔离会话同时插入用户消息和变更绑定，核对实际接受的轮次。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 暂停、失败或竞争时当前轮和预约会怎样？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

GoalBar 的 Pause 先核对当前绑定和目标状态，再执行 LoopX goal-lifecycle stop。若 CLI 执行未产生可核对回执，返回 operation_result_unknown。确认后才让 Driver 取消待评估与定时器，移除仍为 queued 的预约。claimed 或 admitted 预约会置 preserveAcrossPause，保留当前这一轮。对处于该状态的预约，pre-step 权威检查仍要求原绑定匹配，但允许绕过已停止目标的再次配额检查。后续回读失败或 Driver 未同步会返回带警告的应用结果。界面在目标 stopped 时显示 paused，即使 DSH Agent 仍 running。故用户需要分别检查 Goal、预约与当轮可见副作用，不能用一次 Pause 恢复已发工具效果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:651-683](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/service.ts#L651-L683)

先核对预期绑定、目标状态及身份，再实际发 stop 或 resume。

<details>
<summary>查看原文（33行）</summary>

```text
    if (binding.goalId !== request.expected.goalId
      || binding.loopxAgentId !== request.expected.loopxAgentId) {
      return { kind: 'rejected', code: 'binding_mismatch' }
    }

    const activation = await readGoalBarActivation(cliOptions, binding.goalId)
    if (validationSignal.aborted || !this.captureIsCurrent(capture)) {
      return { kind: 'rejected', code: 'binding_validation_failed' }
    }
    const actionable = activation.kind === 'value'
      && (request.op === 'start'
        ? activation.goalActivation === 'stopped' && capture.agent.status === 'idle'
        : activation.goalActivation === 'active')
    if (!actionable) return { kind: 'rejected', code: 'not_actionable' }

    // Last identity/status fence before the child is synchronously launched.
    if (validationSignal.aborted
      || !this.captureIsCurrent(capture)
      || (request.op === 'start' && capture.agent.status !== 'idle')) {
      return { kind: 'rejected', code: 'binding_validation_failed' }
    }
    const targetState = request.op === 'start' ? 'active' : 'stopped'
    const operation = request.op === 'start' ? 'resume' : 'stop'
    let verified = false
    try {
      await runJsonMutationCommand(command, [
        '--registry', GOALBAR_PROJECT_REGISTRY,
        '--format', 'json',
        'goal-lifecycle',
        '--goal-id', binding.goalId,
        '--operation', operation,
        '--actor-kind', 'owner',
        '--execute',
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:695-711](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/service.ts#L695-L711)

执行失败结果未知，确认后才通知 Driver。

<details>
<summary>查看原文（17行）</summary>

```text
      })
      verified = true
    } catch {
      return { kind: 'unknown', code: 'operation_result_unknown' }
    } finally {
      // The runner promise settles only after child close, including forced kill.
      admission.resolveMutation()
    }
    if (!verified) return { kind: 'unknown', code: 'operation_result_unknown' }

    let driverReceipt: GoalBarDriverActionReceipt
    try {
      driverReceipt = request.op === 'start'
        ? await this.coordinator.evaluateActivatedSession(capture)
        : await this.coordinator.cancelQueued(capture)
    } catch {
      driverReceipt = { kind: 'unavailable', reason: 'driver_unavailable' }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:594-614](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L594-L614)

保留已认领或已接纳的预约，再取消未来工作。

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

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1177-1189](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L1177-L1189)

取消待评估和定时器，只移除 queued。

<details>
<summary>查看原文（13行）</summary>

```text
  private cancelPending(state: DriverState): void {
    state.requested = false
    state.controller?.abort()
    state.controller = undefined
    if (state.timer !== undefined) {
      this.clock.clearTimeout(state.timer)
      state.timer = undefined
    }
    const reservation = state.reservation
    if (reservation === undefined || reservation.phase !== 'queued') return
    state.agent.inbox.remove(reservation.messageId)
    this.retireReservation(state)
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:983-1008](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L983-L1008)

保留预约仍需精确绑定，但可不再要求新的 quota。

<details>
<summary>查看原文（26行）</summary>

```text
  private async authorityStillAllows(
    state: DriverState,
    reservation: Reservation,
    signal: AbortSignal,
  ): Promise<boolean> {
    if (!this.reservationIsCurrent(state, reservation, signal)) return false
    try {
      const command = await this.loopXCommand(signal)
      const bindingPayload = await this.resolveBinding(command, state.agent, signal)
      const binding = exactBinding(bindingPayload, String(state.agent.id))
      if (binding?.goalId !== reservation.goalId || binding.agentId !== reservation.agentId) {
        return false
      }
      if (reservation.preserveAcrossPause) {
        return this.reservationIsCurrent(state, reservation, signal)
      }
      const quota = await this.readQuota(
        command,
        state.agent,
        reservation,
        reservation.turnInstanceId,
        signal,
      )
      return this.reservationIsCurrent(state, reservation, signal)
        && (reservation.preserveAcrossPause
          || exactQuota(quota, reservation, reservation.turnInstanceId))
```

</details>

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:714-737](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/service.ts#L714-L737)

权威回读与 Driver 同步失败分开。

<details>
<summary>查看原文（24行）</summary>

```text
    // Browser disconnect after launch does not cancel authoritative readback.
    const postRead = await this.readResult(
      request.sessionId,
      this.disposal.signal,
    )
    if (postRead.kind !== 'present'
      || postRead.snapshot.goalId !== request.expected.goalId
      || postRead.snapshot.loopxAgentId !== request.expected.loopxAgentId) {
      return { kind: 'applied_with_warning', code: 'post_read_failed' }
    }
    if (driverReceipt.kind !== 'applied') {
      return {
        kind: 'applied_with_warning',
        code: 'driver_sync_failed',
        snapshot: postRead.snapshot,
        baseSessionEventSeq: postRead.baseSessionEventSeq,
        sourceRevision: postRead.sourceRevision,
      }
    }
    return {
      kind: 'succeeded',
      snapshot: postRead.snapshot,
      baseSessionEventSeq: postRead.baseSessionEventSeq,
      sourceRevision: postRead.sourceRevision,
```

</details>

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx:23-28](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx#L23-L28)

界面停状态优先于 Agent running。

```text
function visibleStatus(
  snapshot: GoalBarSnapshotV1,
): 'active' | 'running' | 'paused' {
  if (snapshot.goalActivation === 'stopped') return 'paused'
  return snapshot.agentStatus === 'running' ? 'running' : 'active'
}
```

#### 缺口

- 未验证暂停与已触发外部工具的实际竞态
  **影响**：不能说暂停时所有副作用被阻止或回滚
  **进一步探讨**：在非敏感隔离任务分别于未认领、已认领和运行中暂停，观察后续文件和消息。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装及配置会带来哪些依赖和副作用？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

固定包版本为 0.1.1-beta.6。清单列 Node ^22.22.3 或 >=24.0.0，宿主 peer 为若干具体范围。README 区分已发包的作者资格与本源候选额外声明，本轮未确认发行物等于该提交。启动初始化行自动尝试复用兼容 LoopX，显式 LOOPX_BIN 不兼容时停止，不能自动改用户指定程序。需要安装时，启动代码调用 Python 的 pip --target 把依赖写入 managed runtime，再执行 workflow skills install 并 inspect 回读。作者说明 Python 3.11+ 与 pip，缺兼容 CLI 时需要网络，最低 LoopX 版本为 1.2.4。初始化异常记状态并保留命令，不能把该处理写成全部桥接能力已可用。显式 /loopx-init 还会排队开始和完成或失败提示。观察器虽然有 Loader 行，只有 Goal、Session 和完整运行身份都有效才注册事件，并向单独的按目标哈希分账本追加诊断数据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/package.json:48-50](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/package.json#L48-L50)

固定 Node 版本范围。

```text
  "engines": {
    "node": "^22.22.3 || >=24.0.0"
  },
```

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/package.json:67-85](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/package.json#L67-L85)

DSH bundle、Web 注入与 peer 约束。

<details>
<summary>查看原文（19行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-renderer"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh": ">=0.1.5-rc.1 <0.2.0-0 || >=0.1.7-rc.2 <0.1.7 || >=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.2.1",
    "@deepseek-ai/dsh-client-connection": ">=0.1.5-rc.1 <0.2.0-0 || >=0.1.7-rc.2 <0.1.7 || >=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.2.1",
    "@deepseek-ai/dsh-client-locale": ">=0.1.5-rc.1 <0.2.0-0 || >=0.1.7-rc.2 <0.1.7 || >=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.2.1",
```

</details>

**依据 3 · 作者声明**：[packages/dsh-loopx-plugin/README.md:44-68](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/README.md#L44-L68)

作者描述 Python、pip、网络和独立运行时。

<details>
<summary>查看原文（25行）</summary>

```text
Requirements are stable Node.js 22.22.3+ (excluding Node.js 23), `pnpm`,
Python 3.11+ with `pip`, and network access for the first DSH start when no
compatible LoopX CLI is already installed. LoopX itself is deliberately not a
prerequisite. The initializer
honors an explicit `PYTHON_BIN`; otherwise it tries `python3`, then discovers
`python3.<minor>` executables on the supplied `PATH` in descending numeric
order, then tries the bare name `python`. The last name is what a python.org
Windows install registers, so it keeps that host reachable when `python3` is
absent or is the `WindowsApps` App Execution Alias that never starts Python.
Unlike the versioned names it is not a `PATH` scan result; it is resolved when
the candidate runs. Installation still checks the Python version and pip;
reopening the managed runtime uses the same discovery and validates the LoopX
CLI. No hard-coded minor-version list is maintained. When selecting Python for
installation, an invalid explicit interpreter fails instead of falling back.
Managed-runtime readback keeps the existing CLI fallback behavior. If the
plugin must install or upgrade LoopX, it writes an isolated
copy under `$DSH_AGENTS_HOME/runtime/dsh-loopx-plugin` (default
`~/.agents/runtime/dsh-loopx-plugin`) and never mutates the system Python
environment. This works with externally managed Python distributions that
enforce PEP 668; the plugin does not use `--break-system-packages`.
This version requires LoopX 1.2.4 or newer, the published release that
includes the Windows peer-file fix. Bootstrap, Driver and GoalBar use the same
version floor; an older global or managed CLI is upgraded or rejected before
business commands run. An explicit outdated `LOOPX_BIN` must be upgraded by its
owner. Older plugin releases retain their original CLI requirements.
```

</details>

**依据 4 · 作者声明**：[packages/dsh-loopx-plugin/README.md:69-85](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/README.md#L69-L85)

作者分开已发包和源候选的宿主覆盖。

<details>
<summary>查看原文（17行）</summary>

````text
Install the prebuilt release into the web profile:

```bash
dsh plugin --profile web add \
  "https://github.com/loopx-project/loopx/releases/download/dsh-loopx-plugin-v0.1.1-beta.6/dsh-loopx-plugin-0.1.1-beta.6.tgz"
```

The beta.6 package targets the qualified DSH 0.2.0-rc.2 API and retains the
qualified frozen 0.1.5 and 0.1.7-rc.2 compatibility ranges. The exported legacy
RPC registration remains available to explicit callers, but plugin startup
always uses the shared API.

The source candidate additionally qualifies DSH 0.2.1-rc.2. Its frozen source
host uses MCP client 2.3.0 and SDK 1.32.0 to address
[GHSA-6prh-2h8m-c8cw](https://github.com/advisories/GHSA-6prh-2h8m-c8cw).
These dependency overrides do not patch an independently installed DSH binary;
that host's owner must update its affected MCP dependencies separately.
````

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/cli.ts:1-5](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/cli.ts#L1-L5)

最低 LoopX 版本。

```text
import { spawn } from 'node:child_process'

// 1.2.4 includes the released Windows peer-file fix. Bootstrap and every
// runtime consumer must use the same floor, including an existing global CLI.
export const MINIMUM_LOOPX_VERSION = '1.2.4'
```

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:256-281](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L256-L281)

实际执行 Python pip --target，有超时和输出上限。

<details>
<summary>查看原文（26行）</summary>

```text
async function installCli(
  options: LoopXInitOptions,
  runtimeDir: string,
): Promise<ManagedLoopXRuntime> {
  const runner = options.runner ?? runFile
  const python = await resolveInstallPython(options)
  const sitePackages = join(runtimeDir, MANAGED_SITE_PACKAGES_NAME)
  const launcherPath = join(runtimeDir, MANAGED_LAUNCHER_NAME)
  let installResult
  try {
    installResult = await runner(
      python,
      [
        '-m', 'pip', 'install',
        '--disable-pip-version-check',
        '--no-input',
        '--upgrade',
        '--target', sitePackages,
        LOOPX_REQUIREMENT,
      ],
      {
        env: options.env,
        signal: options.signal,
        timeoutMs: 120_000,
        maxOutputBytes: 1024 * 1024,
      },
```

</details>

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:315-339](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L315-L339)

先找已有 CLI，拒绝不兼容的显式 override。

<details>
<summary>查看原文（25行）</summary>

```text
export async function initializeLoopX(options: LoopXInitOptions = {}): Promise<LoopXInitSummary> {
  const resolvedAgentsHome = pluginAgentsHome(options)
  const skillsDir = resolve(options.skillsDir ?? join(resolvedAgentsHome, 'skills'))
  const runtimeDir = pluginRuntimeDir(options)
  const initialPython = configuredPython(options)
  let effectiveOptions = initialPython === undefined
    ? options
    : withPython(options, initialPython)
  let command: LoopXCommand | undefined
  try {
    command = await resolvePluginLoopXCommand(effectiveOptions)
  } catch (error: unknown) {
    if (error instanceof LoopXCliError && error.kind === 'aborted') throw error
  }

  const configuredCli = effectiveOptions.env?.LOOPX_BIN ?? process.env.LOOPX_BIN
  if (command === undefined && configuredCli) {
    throw new LoopXInitError('probe',
      `LOOPX_BIN must resolve LoopX ${MINIMUM_LOOPX_VERSION} or newer; upgrade it or remove the explicit override`,
      'incompatible')
  }

  let cliInstalled = false
  if (command === undefined || !(await compatible(command, skillsDir, effectiveOptions))) {
    const managedRuntime = await installCli(effectiveOptions, runtimeDir)
```

</details>

**依据 8 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:368-401](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L368-L401)

安装 Skill 后核对响应。

<details>
<summary>查看原文（34行）</summary>

```text
  let installed: Record<string, unknown>
  try {
    installed = await runJsonCommand(
      command,
      workflowArgs(command, skillsDir, 'install'),
      {
        runner: effectiveOptions.runner,
        signal: effectiveOptions.signal,
        env: effectiveOptions.env,
        attempts: 1,
        timeoutMs: 60_000,
        validate: workflowPayload,
      },
    )
  } catch (error: unknown) {
    if (error instanceof LoopXCliError && error.kind === 'aborted') throw error
    const kind = error instanceof LoopXCliError ? error.kind : 'transport'
    throw new LoopXInitError('install_skills', 'LoopX skill installation failed', kind)
  }
  if (installed.ok !== true || installed.operation !== 'install'
    || installed.host_surface !== HOST_SURFACE) {
    throw new LoopXInitError(
      'install_skills',
      'LoopX did not confirm the DSH-native skill installation',
      'typed_failure',
    )
  }
  const skillsChanged = installedSkillsChanged(installed)
  if (skillsChanged === undefined) {
    throw new LoopXInitError(
      'install_skills',
      'LoopX returned incomplete DSH-native skill mutation status',
      'typed_failure',
    )
```

</details>

**依据 9 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:404-429](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L404-L429)

执行 inspect 确认不需要再装。

<details>
<summary>查看原文（26行）</summary>

```text
  let readback: Record<string, unknown>
  try {
    readback = await runJsonCommand(
      command,
      workflowArgs(command, skillsDir, 'inspect'),
      {
        runner: effectiveOptions.runner,
        signal: effectiveOptions.signal,
        env: effectiveOptions.env,
        attempts: 1,
        validate: workflowPayload,
      },
    )
  } catch (error: unknown) {
    if (error instanceof LoopXCliError && error.kind === 'aborted') throw error
    const kind = error instanceof LoopXCliError ? error.kind : 'transport'
    throw new LoopXInitError('readback', 'LoopX skill readback failed', kind)
  }
  if (readback.ok !== true || readback.operation !== 'inspect'
    || readback.host_surface !== HOST_SURFACE
    || readback.install_required !== false) {
    throw new LoopXInitError(
      'readback',
      'LoopX skills were not verified after installation',
      'readback_mismatch',
    )
```

</details>

**依据 10 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:570-588](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L570-L588)

显式初始化可能送入两阶段 followup。

<details>
<summary>查看原文（19行）</summary>

```text
    async handler(invocation): Promise<CommandResult> {
      if (invocation.rawInput.trim().length > 0) {
        return { kind: 'error', text: 'Usage: /loopx-init' }
      }
      const warn = (message: string): void => { ctx.logger.warn(message) }
      queueFollowup(invocation.agent, startFollowup(), 'start', warn)
      try {
        const result = await initializeLoopX({ ...options, signal: invocation.signal })
        const commandResult = successResult(result)
        if (!invocation.signal.aborted) {
          queueFollowup(invocation.agent, successFollowup(result), 'complete', warn)
        }
        return commandResult
      } catch (error: unknown) {
        const commandResult = commandFailure(error)
        if (!cancelled(error, invocation.signal)) {
          queueFollowup(invocation.agent, failureFollowup(error), 'complete', warn)
        }
        return commandResult
```

</details>

**依据 11 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:633-647](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/init-command.ts#L633-L647)

自动初始化、错误日志和 bootstrap 状态。

<details>
<summary>查看原文（15行）</summary>

```text
export async function apply(ctx: Context, options: LoopXInitOptions = {}): Promise<void> {
  registerLoopXInitCommand(ctx, options)
  let status: LoopXBootstrapStatus
  try {
    await initializeLoopX(options)
    status = Object.freeze({ state: 'ready' })
  } catch (error: unknown) {
    status = bootstrapFailureStatus(error)
    try {
      ctx.logger.warn(automaticFailure(error))
    } catch {
      // Diagnostics must never turn an isolated LoopX bootstrap failure into a DSH startup failure.
    }
  }
  ctx.reflect.provide('loopxBootstrap', status)
```

</details>

**依据 12 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:264-279](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/observer.ts#L264-L279)

诊断必须提供完整匹配配置。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveShadowObserverConfig(
  env: NodeJS.ProcessEnv = process.env,
): ShadowObserverConfig | undefined {
  const goalId = env[ENV_GOAL_ID]?.trim()
  const sessionId = env[ENV_SESSION_ID]?.trim()
  const runIdentity = parseRunIdentity(env[ENV_RUN_IDENTITY])
  if (!goalId || !IDENTITY_TOKEN.test(goalId)
    || !isPublicSafeText(goalId)
    || !sessionId || !IDENTITY_TOKEN.test(sessionId)
    || !isPublicSafeText(sessionId)
    || runIdentity === undefined) return undefined
  const rawBound = Number.parseInt(env[ENV_BUFFER_BOUND] ?? '', 10)
  const bufferBound = Number.isInteger(rawBound) && rawBound >= 1 && rawBound <= MAX_BUFFER_BOUND
    ? rawBound
    : DEFAULT_BUFFER_BOUND
  return { goalId, sessionId, runIdentity, ledgerDir: defaultLedgerDir(env), bufferBound }
```

</details>

**依据 13 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:315-327](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/observer.ts#L315-L327)

账本追加的本地写盘路径。

<details>
<summary>查看原文（13行）</summary>

```text
export async function appendLedgerLines(config: ShadowObserverConfig, lines: readonly string[]): Promise<void> {
  if (lines.length === 0) return
  const legacy = join(config.ledgerDir, `${config.goalId.replaceAll(':', '_')}.ndjson`)
  if (lstatSync(legacy, { throwIfNoEntry: false })) {
    // The flush boundary counts this failure without exposing a local path or stopping the worker.
    const error = new Error('legacy diagnostic ledger requires offline reconciliation')
    error.name = 'LegacyDiagnosticLedgerError'
    throw error
  }
  const path = ledgerPath(config)
  await mkdir(dirname(path), { recursive: true })
  await appendFile(path, `${lines.join('\n')}\n`, 'utf8')
}
```

</details>

**依据 14 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:653-674](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/observer.ts#L653-L674)

配置缺失时不会注册观察器。

<details>
<summary>查看原文（22行）</summary>

```text
export function registerShadowObserver(ctx: Context, config: ShadowObserverConfig): ShadowObserver {
  const observer = new ShadowObserver({
    config,
    warn: message => { ctx.logger.warn(message) },
  })
  ctx.effect(function* () {
    ctx.on('session/created', session => { observer.observeSessionCreated(session) })
    ctx.on('session/event', (session, event) => { observer.observeSessionEvent(session, event) })
    ctx.on('session/disposed', session => { observer.observeSessionDisposed(session) })
    yield async () => {
      await observer.dispose()
    }
  }, 'dsh-loopx shadow observer lifecycle')
  return observer
}

/** Cordis entrypoint. Partial configuration is the exact feature-off path. */
export function apply(ctx: Context): void {
  const config = resolveShadowObserverConfig()
  if (config === undefined) return
  registerShadowObserver(ctx, config)
}
```

</details>

#### 缺口

- 没有验收实际发行包、首次网络安装和卸载残留
  **影响**：不能确定某个机器的开箱路径和清理成本
  **进一步探讨**：单独盘点目标版本、已有 CLI、隔离目录及 skills，回读首次启动和退出后的文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样衡量采用价值与失败退出？

**研究主题**：效果与总成本、采用判断

#### 完整回答

先用无外部副作用的隔离目标比较手工与自动续轮。一次合格任务是匹配正确 Goal 和 Agent，收到且完成一轮可核查任务，Pause 后能解释已认领与待执行。首次投入为安装与 Skill 写盘、配置与核对身份；持续包括 LoopX 调用、模型 token 和人工复核；失败恢复包括查消息、实际文件与目标状态并退回人工。源码没有提供这些用量。Driver 发现其他用户输入会停止当前待处理评估，出错、被中止或超 token 时不会正常继续。若绑定有歧义、Pause 返回未知或任务无法解释，先停止后续自动工作，在 DSH 核对当前是否仍运行并读实际结果，再手工推进。仅移除 UI 或关闭页面不会撤销已生效的操作。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:523-539](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L523-L539)

会话恢复闲置才重评，竞争消息取消待评估。

<details>
<summary>查看原文（17行）</summary>

```text
  onAgentStatus(agent: Agent, status: AgentStatus): void {
    if (status !== 'idle') return
    const state = this.stateFor(agent)
    if (state.reservation?.phase === 'claimed' || state.reservation?.phase === 'admitted') {
      this.retireReservation(state)
    }
    state.competing = inboxHasPending(agent.inbox)
    if (!state.pauseAfterTurnError) this.requestEvaluation(state)
  }

  onInboxInserted(agent: Agent, message: UserMessage): void {
    const state = this.stateFor(agent)
    if (state.reservation !== undefined && sameReservation(message, state.reservation)) return
    state.competing = true
    if (message.source.kind === 'user') state.pauseAfterTurnError = false
    this.cancelPending(state)
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:557-561](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L557-L561)

Agent 出错停下待处理。

```text
  onAgentError(agent: Agent): void {
    const state = this.stateFor(agent)
    state.pauseAfterTurnError = true
    this.cancelPending(state)
  }
```

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:643-653](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L643-L653)

精确消息被接纳及异常结束停续轮的分支。

<details>
<summary>查看原文（11行）</summary>

```text
    if (event.type === 'user/message'
      && state.reservation !== undefined
      && event.data.id === state.reservation.messageId) {
      state.reservation.phase = 'admitted'
      return
    }
    if (event.type === 'turn/end'
      && (event.data.reason.kind === 'max-tokens' || event.data.reason.kind === 'aborted')) {
      state.pauseAfterTurnError = true
      this.cancelPending(state)
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:695-737](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/service.ts#L695-L737)

CLI 不确定、回读和同步警告结果分开。

<details>
<summary>查看原文（43行）</summary>

```text
      })
      verified = true
    } catch {
      return { kind: 'unknown', code: 'operation_result_unknown' }
    } finally {
      // The runner promise settles only after child close, including forced kill.
      admission.resolveMutation()
    }
    if (!verified) return { kind: 'unknown', code: 'operation_result_unknown' }

    let driverReceipt: GoalBarDriverActionReceipt
    try {
      driverReceipt = request.op === 'start'
        ? await this.coordinator.evaluateActivatedSession(capture)
        : await this.coordinator.cancelQueued(capture)
    } catch {
      driverReceipt = { kind: 'unavailable', reason: 'driver_unavailable' }
    }

    // Browser disconnect after launch does not cancel authoritative readback.
    const postRead = await this.readResult(
      request.sessionId,
      this.disposal.signal,
    )
    if (postRead.kind !== 'present'
      || postRead.snapshot.goalId !== request.expected.goalId
      || postRead.snapshot.loopxAgentId !== request.expected.loopxAgentId) {
      return { kind: 'applied_with_warning', code: 'post_read_failed' }
    }
    if (driverReceipt.kind !== 'applied') {
      return {
        kind: 'applied_with_warning',
        code: 'driver_sync_failed',
        snapshot: postRead.snapshot,
        baseSessionEventSeq: postRead.baseSessionEventSeq,
        sourceRevision: postRead.sourceRevision,
      }
    }
    return {
      kind: 'succeeded',
      snapshot: postRead.snapshot,
      baseSessionEventSeq: postRead.baseSessionEventSeq,
      sourceRevision: postRead.sourceRevision,
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1080-1104](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L1080-L1104)

配额调用有固定轮次及有界重试。

<details>
<summary>查看原文（25行）</summary>

```text
    return runJsonCommand(
      command,
      [
        '--registry', '.loopx/registry.json',
        '--format', 'json',
        'quota', 'should-run',
        '--goal-id', binding.goalId,
        '--agent-id', binding.agentId,
        '--runtime-profile', 'generic_cli',
        '--include-detail', 'scheduler',
        '--turn-instance-id', turnInstanceId,
      ],
      {
        runner: this.runner,
        cwd: agent.session.header.cwd,
        signal,
        attempts: 3,
        retryDelaysMs: this.retryDelaysMs,
        // The Driver reads the raw admission contract. The child-local opt-out
        // also works with supported LoopX releases that predate the CLI flag.
        env: { ...process.env, LOOPX_CONTEXT_DELIVERY: 'off' },
        validate: payload => payload.goal_id === binding.goalId
          && typeof payload.ok === 'boolean'
          && typeof payload.should_run === 'boolean',
      },
```

</details>

#### 缺口

- 无同条件模型成本和故障恢复数据
  **影响**：无法衡量自动推进的净增益和误续风险
  **进一步探讨**：同类小任务记录合格率、模型与 CLI 使用、人工分钟和异常状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 更细的暂停状态能否减少误判？

**研究主题**：新假设与验证

#### 完整回答

可测试的做法是把 Goal 已停止接纳新轮、预约仍被认领、当轮副作用待查分开呈现。现有组件已有 Goal 激活状态、Agent 忙闲和 Driver 预约，问题在于当前 UI 把 stopped 优先映射为 paused。新增提示只用可核对预约阶段，若握手或回读未知就显示待确认，不猜测是否已停止。对照现有 paused，在测试中随机给用户观察 queued、claimed、admitted 及 readback 失败几种场景，测误以为当轮已停止的比例、正确采取检查动作的时间和误报。若提示没有改善辨别或增加错误恢复，保留原布局。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx:23-28](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx#L23-L28)

当前显示优先目标暂停。

```text
function visibleStatus(
  snapshot: GoalBarSnapshotV1,
): 'active' | 'running' | 'paused' {
  if (snapshot.goalActivation === 'stopped') return 'paused'
  return snapshot.agentStatus === 'running' ? 'running' : 'active'
}
```

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:603-614](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/driver.ts#L603-L614)

Driver 有保留当前预约的状态。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:714-731](https://github.com/loopx-project/loopx/blob/71190b6b4ef4e146f3bf4a10d31ce61ac42fd021/packages/dsh-loopx-plugin/src/goalbar/service.ts#L714-L731)

可区分回读失败和 Driver 不可用。

<details>
<summary>查看原文（18行）</summary>

```text
    // Browser disconnect after launch does not cancel authoritative readback.
    const postRead = await this.readResult(
      request.sessionId,
      this.disposal.signal,
    )
    if (postRead.kind !== 'present'
      || postRead.snapshot.goalId !== request.expected.goalId
      || postRead.snapshot.loopxAgentId !== request.expected.loopxAgentId) {
      return { kind: 'applied_with_warning', code: 'post_read_failed' }
    }
    if (driverReceipt.kind !== 'applied') {
      return {
        kind: 'applied_with_warning',
        code: 'driver_sync_failed',
        snapshot: postRead.snapshot,
        baseSessionEventSeq: postRead.baseSessionEventSeq,
        sourceRevision: postRead.sourceRevision,
      }
```

</details>

#### 缺口

- 拟议提示未实现，也无用户对照
  **影响**：无法判断它是否减少误解或只是增加术语
  **进一步探讨**：先以现有状态生成四种可控模拟并盲评。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
