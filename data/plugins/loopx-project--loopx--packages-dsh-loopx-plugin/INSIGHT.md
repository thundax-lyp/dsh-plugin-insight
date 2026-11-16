# LoopX DSH Plugin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f38fae0](https://github.com/loopx-project/loopx/tree/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin)

<!-- BEGIN META -->
[![GitHub ★ 6,586](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C586&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/loopx-project/loopx)
<!-- END META -->

> **功能**：将 LoopX 初始化、同会话续轮和 GoalBar 接到 DeepSeek Harness。

> **亮点**：[Q02](#research-q02) 将 Goal、Agent、轮次和宿主当前会话绑定到同一预约。[Q03](#research-q03) 提供分离的目标暂停和待处理队列撤销路径。业务状态与执行责任仍分属 LoopX 与 DSH。

> **主要限制**：排队消息还要通过下游竞争、确定配额回执和绑定复核，缺项或不兼容 CLI 都能影响一次合格的续轮。[Q02](#research-q02) [Q03](#research-q03)

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

> **思考**：排队消息还要通过下游竞争、确定配额回执和绑定复核，缺项或不兼容 CLI 都能影响一次合格的续轮。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将 Goal、Agent、轮次和宿主当前会话绑定到同一预约。[Q03](#research-q03) 提供分离的目标暂停和待处理队列撤销路径。业务状态与执行责任仍分属 LoopX 与 DSH。

[Q02](#research-q02) 的可复用设计是匹配 typed 事件、绑定与确切消息，然后在真实步骤再次确认。取舍是跨系统准入仍存在阶段间隔，[Q03](#research-q03) 展示暂停后保留预约所带来的使用语义。

<a id="detail-section-5"></a>

### 1.4 主要限制

排队消息还要通过下游竞争、确定配额回执和绑定复核，缺项或不兼容 CLI 都能影响一次合格的续轮。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

按 [Q05](#research-q05) 在无外部副作用的项目试一轮。核对绑定和实际收到的任务，按 [Q03](#research-q03) 回读暂停后的当前 Agent 状态。若结果未知或绑定不符，停止下一轮并回人工推进。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

typed 激活、当前轮次准入、状态回读和暂停分支有静态证据。实际交付收益、跨系统竞态与拟议提示仍待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-loopx-plugin/README.md、packages/dsh-loopx-plugin/src/index.ts、packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts、packages/dsh-loopx-plugin/src/driver.ts、packages/dsh-loopx-plugin/src/goalbar/service.ts、packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx、packages/dsh-loopx-plugin/src/cli.ts、packages/dsh-loopx-plugin/src/init-command.ts、packages/dsh-loopx-plugin/src/observer.ts 及固定范围 inventory；组件：packages/dsh-loopx-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅统计子包指定 Markdown 和 JS/TS。读实际启动、Driver 及 GoalBar 代表路径、安装和诊断接线。未执行宿主、LoopX、Python 或测试，未审全量 LoopX 业务引擎和传输鉴权。 本轮当前版本复核：71190b6b..f38fae05（固定提交 f38fae05bb9a1c2cc54a2641359224cc253d32ac）；比较目标组件差异并补充其影响。
- 下一步：在固定 DSH 和 LoopX 版本中用隔离小任务比较手工和自动交接，分别检查竞争消息、暂停和错误结果。拟议提示按 [Q06](#research-q06) 的盲测验证。 当前源码固定于 f38fae05bb9a1c2cc54a2641359224cc253d32ac；未运行插件或做生产验证。

**分析版本**

- **仓库**：[loopx-project/loopx](https://github.com/loopx-project/loopx)
- **版本号**：0.1.1-beta.6（[固定提交 f38fae0](https://github.com/loopx-project/loopx/tree/f38fae05bb9a1c2cc54a2641359224cc253d32ac)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把新轮停止、当前轮保留和效果未知分开显示，以误判率和恢复耗时比较是否值得。

在固定 DSH 和 LoopX 版本中用隔离小任务比较手工和自动交接，分别检查竞争消息、暂停和错误结果。拟议提示按 [Q06](#research-q06) 的盲测验证。 当前源码固定于 f38fae05bb9a1c2cc54a2641359224cc253d32ac；未运行插件或做生产验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 22 | 7987 | 7263 | 201 | — |
| .md | source | 2 | 835 | — | — | 6532 |
| .mjs | source | 11 | 2843 | 2654 | 75 | — |
| .tsx | source | 3 | 373 | 312 | 34 | — |
| .ts | test | 13 | 7849 | 7286 | 35 | — |
| .tsx | test | 2 | 1207 | 1112 | 7 | — |

</details>

**活跃度**

[![Issue 未关闭 138](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=138&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 89](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=89&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 63](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=63&color=737b86&logo=github)](https://github.com/loopx-project/loopx/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

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

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:3-22](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/README.md#L3-L22)

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

**依据 2 · 作者声明**：[packages/dsh-loopx-plugin/README.md:24-38](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/README.md#L24-L38)

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

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/index.ts:10-27](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/index.ts#L10-L27)

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

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts:134-153](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/connection-rpc.ts#L134-L153)

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

CLI 达到 2.3.0 时，额度门支持原始决策或分页导航凭据，旧 CLI 则以 LOOPX_CONTEXT_DELIVERY=off 要求原始格式。初次判断先读字段索引，再选共同必需字段、当前可用的调度及记忆提示和心跳凭据；排队后重查只取共同字段及心跳凭据。分页限制单页字节，逐页核对 schema、偏移、总长、游标目录与选项；内联模式还校验选取字段和摘要。缺项、重复、字节摘要或绑定 Goal 不符会拒绝，不能把残缺回执当作放行；分页读取失败不在额度命令的传输重试内。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:216-237](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L216-L237)

人类 typed 调用与模型 skill 调用形状。

<details>
<summary>查看原文（22行）</summary>

```text

function exactRecord(
  value: unknown,
  expectedKeys: readonly string[],
): Record<string, unknown> | undefined {
  const candidate = record(value)
  if (candidate === undefined) return undefined
  const keys = Reflect.ownKeys(candidate)
  if (keys.some(key => typeof key !== 'string') || keys.length !== expectedKeys.length) {
    return undefined
  }
  const allowed = new Set(expectedKeys)
  return keys.every(key => typeof key === 'string' && allowed.has(key))
    ? candidate
    : undefined
}

function eventCallId(value: unknown): string | undefined {
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function exactUserActivation(event: SessionEvent): boolean {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:240-280](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L240-L280)

模型调用需匹配无错的 tool-result 才激活。

<details>
<summary>查看原文（41行）</summary>

```text
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
}

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:786-799](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L786-L799)

评估的当前 Agent、会话、命令、队列和忙闲条件。

<details>
<summary>查看原文（14行）</summary>

```text
    if (!wasActivated && state.activation.activated
      && agent.status === 'idle' && !state.pauseAfterTurnError) {
      this.requestEvaluation(state)
    }
    if (event.type === 'command/run') {
      state.commands.add(String(event.data.commandId))
      state.competing = true
      this.cancelPending(state)
      return
    }
    if (event.type === 'command/done') {
      state.commands.delete(String(event.data.commandId))
      if (state.commands.size === 0) {
        state.competing = inboxHasPending(agent.inbox)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:307-326](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L307-L326)

绑定必须唯一且线程与字段一致。

<details>
<summary>查看原文（20行）</summary>

```text
    pendingModelCalls: new Set(),
    activated: false,
  }
  try {
    for (const event of session.snapshotEvents()) foldActivationEvent(projection, event)
  } catch {
    projection.pendingModelCalls.clear()
    projection.activated = false
  }
  return projection
}

/**
 * Whether an Agent still holds input it has not consumed. The 0.1.5 Inbox
 * exposes the two pending queues instead of the retired `hasPending` flag.
 */
function inboxHasPending(inbox: Agent['inbox']): boolean {
  return inbox.nextTurn.length > 0 || inbox.nextStep.length > 0
}

```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:916-950](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L916-L950)

解析绑定并按同一轮次验证 quota。

<details>
<summary>查看原文（35行）</summary>

```text
  private stateFor(agent: Agent): DriverState {
    const existing = this.states.get(agent)
    if (existing !== undefined) {
      if (existing.activation.session !== agent.session) {
        this.resolveEvaluationWaiters(existing, false)
        this.cancelPending(existing)
        this.retireReservation(existing)
        existing.competing = inboxHasPending(agent.inbox)
        existing.pauseAfterTurnError = false
        existing.schedulerToken = ''
        existing.unchangedPolls = 0
        existing.commands.clear()
        existing.activation = foldSessionActivation(agent.session)
      }
      return existing
    }
    const state: DriverState = {
      agent,
      activation: foldSessionActivation(agent.session),
      requested: false,
      stopping: false,
      competing: inboxHasPending(agent.inbox),
      pauseAfterTurnError: false,
      schedulerToken: '',
      unchangedPolls: 0,
      commands: new Set(),
      evaluationWaiters: new Set(),
    }
    this.states.set(agent, state)
    return state
  }

  private captureIsLive(capture: GoalBarSessionCapture): boolean {
    return !this.disposed
      && capture.agent.session === capture.session
```

</details>

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:951-979](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L951-L979)

heartbeat 身份通过后才构造排队计划。

<details>
<summary>查看原文（29行）</summary>

```text
      && this.isLiveAgent(capture.agent)
      && capture.agent.id === capture.session.id
      && capture.agent.id === capture.session.header.id
  }

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
      && typeof state.agent.session.header.cwd === 'string'
      && state.agent.session.header.cwd.length > 0
  }

  private requestEvaluation(state: DriverState): void {
    if (state.stopping || this.disposed
      || state.activation.session !== state.agent.session
      || !state.activation.activated) return
    state.requested = true
    if (state.run !== undefined) return
```

</details>

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:875-893](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L875-L893)

原会话建立预约和实际 followup。

<details>
<summary>查看原文（19行）</summary>

```text
    }
    const admitted = decision.messages.find(message => message.id === reservation.messageId)
    if (decision.messages.filter(message => !isHostContextMessage(message)).length !== 1
      || admitted === undefined
      || !sameReservation(admitted, reservation)) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('downstream-batch', decision.messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
      return { kind: 'reject' }
    }
    if (!(await this.authorityStillAllows(state, reservation, signal))) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('authority-after-next', decision.messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
      return { kind: 'reject' }
    }
    return decision
  }

```

</details>

**依据 8 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:668-687](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L668-L687)

拒绝混合消息和权威失效。

<details>
<summary>查看原文（20行）</summary>

```text
    if (state === undefined) return
    this.stopState(state)
    this.states.delete(agent)
  }

  onSessionStart(agent: Agent): void {
    const state = this.stateFor(agent)
    this.cancelPending(state)
    this.retireReservation(state)
    state.competing = inboxHasPending(agent.inbox)
    state.pauseAfterTurnError = false
    state.schedulerToken = ''
    state.unchangedPolls = 0
    state.commands.clear()
    state.activation = foldSessionActivation(agent.session)
    this.requestEvaluation(state)
  }

  onAgentStatus(agent: Agent, status: AgentStatus): void {
    if (status !== 'idle') return
```

</details>

**依据 9 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:708-721](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L708-L721)

下游判定后再次检查消息与权威。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 10 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1253-1262](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L1253-L1262)

pre-step 和 exact Session 事件接线。

<details>
<summary>查看原文（10行）</summary>

```text
        '--format', 'json',
        'resolve-agent-thread',
        '--host-surface', HOST_SURFACE,
        '--thread-id', String(agent.id),
      ],
      {
        runner: this.runner,
        cwd: agent.session.header.cwd,
        signal,
        attempts: 3,
```

</details>

**依据 11 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:350-439](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L350-L439)

分页导航、选择哈希、偏移、总量和继续页约束。

<details>
<summary>查看原文（90行）</summary>

```text
const QUOTA_NAVIGATION_SCHEMA = 'context_capture_navigation_v1'
const QUOTA_SELECTION_PAGE_SCHEMA = 'context_capture_selection_page_v1'
const QUOTA_INLINE_PAGE_SCHEMA = 'context_capture_page_v1'
const QUOTA_INDEX_SCHEMA = 'context_capture_index_v1'
const QUOTA_SELECTION_SCHEMA = 'context_capture_selection_v1'
const QUOTA_REQUIRED_POINTERS = ['/ok', '/mode', '/goal_id', '/should_run', '/agent_identity']
const QUOTA_RECEIPT_POINTER = '/heartbeat_receipt'
const QUOTA_OPTIONAL_POINTERS = [QUOTA_RECEIPT_POINTER, '/scheduler_hint', '/reward_memory_recall']

type QuotaReadOptions = Pick<JsonCommandOptions, 'runner' | 'cwd' | 'signal'>

function quotaNavigationReference(payload: Record<string, unknown>): string | undefined {
  if (payload.schema_version !== QUOTA_NAVIGATION_SCHEMA || payload.ok !== true) return undefined
  const path = record(payload.recovery)?.reference_file
  return typeof path === 'string' && isAbsolute(path) && !path.includes('\0') ? path : undefined
}

async function readQuotaSelections(
  command: LoopXCommand,
  reference: string,
  selectionArgs: readonly string[],
  schema: string,
  options: QuotaReadOptions,
): Promise<unknown[]> {
  let cursor = reference
  let offset = 0
  let total: number | undefined
  let inlineDigests: { source: string; selection: string } | undefined
  const parts: string[] = []
  const isListing = schema === QUOTA_INDEX_SCHEMA
  const pointers = isListing ? [''] : selectionArgs.filter((_, index) => index % 2 === 1)
  for (;;) {
    const page = await runJsonCommand(command, [
      '--format', 'json', 'quota', 'context-read', '--reference-file', cursor,
      '--offset', String(offset), '--page-bytes', '64000', '--max-page-output-bytes', '64000',
      ...(offset === 0 || inlineDigests !== undefined ? selectionArgs : []),
      ...(inlineDigests === undefined ? [] : ['--selection-sha256', inlineDigests.selection]),
    ], options)
    if (page.ok !== true
      || (page.schema_version !== QUOTA_SELECTION_PAGE_SCHEMA && page.schema_version !== QUOTA_INLINE_PAGE_SCHEMA)
      || typeof page.content !== 'string' || page.offset !== offset
      || typeof page.total_bytes !== 'number' || !Number.isSafeInteger(page.total_bytes)
      || page.total_bytes <= 0
      || (total !== undefined && page.total_bytes !== total)) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an invalid page', false)
    }
    if (page.schema_version === QUOTA_INLINE_PAGE_SCHEMA) {
      const { sha256: source, selection_sha256: selection, selected_pointers: selected } = page
      if (typeof source !== 'string' || !/^[a-f0-9]{64}$/u.test(source)
        || typeof selection !== 'string' || !/^[a-f0-9]{64}$/u.test(selection)
        || (page.list_fields === true) !== isListing
        || !Array.isArray(selected) || selected.length !== pointers.length
        || !pointers.every(pointer => selected.includes(pointer))
        || (inlineDigests === undefined && offset !== 0)
        || (inlineDigests !== undefined && (source !== inlineDigests.source || selection !== inlineDigests.selection))) {
        throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an invalid inline selection', false)
      }
      // A read-only capture may have no derived reader descriptor. Continue
      // through the original reference with the same selector and view hash.
      inlineDigests = { source, selection }
    }
    total = page.total_bytes
    const next = offset + Buffer.byteLength(page.content, 'utf8')
    parts.push(page.content)
    if (page.eof === true && next === total && page.next_offset === null) break
    const nextReference = inlineDigests === undefined ? page.reference_file : reference
    if (page.eof !== false || next <= offset || next >= total || page.next_offset !== next
      || typeof nextReference !== 'string' || !isAbsolute(nextReference)
      || nextReference.includes('\0') || dirname(nextReference) !== dirname(reference)
      || (offset !== 0 && nextReference !== cursor)) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an invalid continuation', false)
    }
    cursor = nextReference
    offset = next
  }
  const selectedBody = parts.join('')
  if (inlineDigests !== undefined
    && createHash('sha256').update(selectedBody, 'utf8').digest('hex') !== inlineDigests.selection) {
    throw new LoopXCliError('invalid_schema', 'LoopX quota capture selection digest did not match its bytes', false)
  }
  let body: Record<string, unknown> | undefined
  try {
    body = record(JSON.parse(selectedBody))
  } catch {
    throw new LoopXCliError('invalid_json', 'LoopX quota capture returned invalid selection JSON', false)
  }
  if (body?.schema_version !== schema || !Array.isArray(body.selections)) {
    throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an incompatible selection', false)
  }
  return body.selections
```

</details>

**依据 12 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:442-480](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L442-L480)

首次与预执行复核字段范围及缺项拒绝。

<details>
<summary>查看原文（39行）</summary>

```text
async function readQuotaCapture(
  command: LoopXCommand,
  reference: string,
  options: QuotaReadOptions,
  revalidateOnly: boolean,
): Promise<Record<string, unknown>> {
  // Entering a queued step requires the original Turn receipt. The scheduler
  // and reward memory are only used when first deciding whether to queue work.
  let pointers = [...QUOTA_REQUIRED_POINTERS, QUOTA_RECEIPT_POINTER]
  if (!revalidateOnly) {
    // The ordinary selector rejects missing paths. Discover which optional
    // fields exist on the same verified capture before preparing the step.
    const index = await readQuotaSelections(command, reference, ['--list'], QUOTA_INDEX_SCHEMA, options)
    const root = record(index[0])
    if (index.length !== 1 || root?.pointer !== '' || !Array.isArray(root.fields)) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an invalid field index', false)
    }
    const present = new Set(root.fields.map(field => record(field)?.pointer))
    if (!QUOTA_REQUIRED_POINTERS.every(pointer => present.has(pointer))) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture lacks admission fields', false)
    }
    pointers = [...QUOTA_REQUIRED_POINTERS, ...QUOTA_OPTIONAL_POINTERS.filter(pointer => present.has(pointer))]
  }
  const selected = await readQuotaSelections(
    command, reference, pointers.flatMap(pointer => ['--select', pointer]), QUOTA_SELECTION_SCHEMA, options,
  )
  const result: Record<string, unknown> = {}
  const remaining = new Set(pointers)
  for (const item of selected) {
    const field = record(item)
    if (typeof field?.pointer !== 'string' || !remaining.delete(field.pointer) || !Object.hasOwn(field, 'value')) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture returned an unexpected admission field', false)
    }
    result[field.pointer.slice(1)] = field.value
  }
  if (remaining.size !== 0) {
    throw new LoopXCliError('invalid_schema', 'LoopX quota capture omitted requested admission fields', false)
  }
  return result
```

</details>

**依据 13 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1279-1312](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L1279-L1312)

CLI 代际分流和配额凭据对当前绑定的核验。

<details>
<summary>查看原文（34行）</summary>

```text
    // supported CLIs continue to answer this Host-only call with raw JSON.
    const progressive = supportedLoopXVersion(command.version, '2.3.0') !== undefined
    const options = { runner: this.runner, cwd: agent.session.header.cwd, signal }
    const rawAdmission = (payload: Record<string, unknown>) => payload.goal_id === binding.goalId
      && typeof payload.ok === 'boolean' && typeof payload.should_run === 'boolean'
    const quota = await runJsonCommand(
      command,
      [
        '--registry', '.loopx/registry.json',
        '--format', 'json',
        'quota', 'should-run',
        '--goal-id', binding.goalId,
        '--agent-id', binding.agentId,
        '--runtime-profile', 'generic_cli',
        ...(progressive && revalidateOnly ? [] : ['--include-detail', 'scheduler']),
        '--turn-instance-id', turnInstanceId,
      ],
      {
        ...options,
        attempts: 3,
        retryDelaysMs: this.retryDelaysMs,
        ...(progressive ? {} : { env: { ...process.env, LOOPX_CONTEXT_DELIVERY: 'off' } }),
        validate: payload => rawAdmission(payload) || (progressive && quotaNavigationReference(payload) !== undefined),
      },
    )
    const reference = progressive ? quotaNavigationReference(quota) : undefined
    if (reference === undefined) return quota
    // Reading a saved capture is outside the guard's transport retry.
    const decision = await readQuotaCapture(command, reference, options, revalidateOnly)
    if (!rawAdmission(decision)) {
      throw new LoopXCliError('invalid_schema', 'LoopX quota capture did not match the bound Goal', false)
    }
    return decision
  }
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

在 pre-step 交接时，仅 runtime-context、time-context 和 skill-catalog 这三类宿主来源可与续轮消息并存；插件的类似快照或目录形式不能靠外形获准。队列含其他竞争消息时撤回预约并交还其他消息；下游处理后还要求只剩一个非宿主上下文消息，且 ID 和 reservation 一致。授权在 next 前后各重查一次，下游拒绝或抛错会撤回或标暂停。入口检查证明竞争时的代码分流，真实宿主其他钩子的相互作用未实测。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:651-683](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/service.ts#L651-L683)

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

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:695-711](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/service.ts#L695-L711)

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

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:594-614](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L594-L614)

保留已认领或已接纳的预约，再取消未来工作。

<details>
<summary>查看原文（21行）</summary>

```text
    const candidateRef = typeof value?.candidate_ref === 'string'
      ? value.candidate_ref : ''
    const targetClass = typeof value?.target_class === 'string'
      ? value.target_class : ''
    const contentSummary = typeof value?.content_summary === 'string'
      ? value.content_summary : ''
    return candidateRef.length > 0
      && candidateRef.length <= 160
      && targetClass.length > 0
      && targetClass.length <= 80
      && contentSummary.length > 0
      && contentSummary.length <= 500
      ? [{ candidate_ref: candidateRef, target_class: targetClass,
        content_summary: contentSummary }]
      : []
  }).slice(0, 4)
  if (guidance.length === 0) return taskBody
  const packet = JSON.stringify({
    schema_version: 'loopx_turn_reward_memory_context_v0',
    authority: 'guidance_only',
    instruction: 'Use only when consistent with current evidence; this grants no action authority.',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1177-1189](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L1177-L1189)

取消待评估和定时器，只移除 queued。

<details>
<summary>查看原文（13行）</summary>

```text
    }
  }

  private async authorityStillAllows(
    state: DriverState,
    reservation: Reservation,
    signal: AbortSignal,
  ): Promise<boolean> {
    if (!this.reservationIsCurrent(state, reservation, signal)) return false
    const startedAt = performance.now()
    try {
      const command = await this.loopXCommand(signal)
      const bindingPayload = await this.resolveBinding(command, state.agent, signal)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:983-1008](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L983-L1008)

保留预约仍需精确绑定，但可不再要求新的 quota。

<details>
<summary>查看原文（26行）</summary>

```text
        while (state.requested && !state.stopping) {
          state.requested = false
          const waiters = [...state.evaluationWaiters]
          for (const waiter of waiters) state.evaluationWaiters.delete(waiter)
          let evaluated = false
          try {
            evaluated = await this.evaluate(state)
          } finally {
            this.resolveEvaluationWaiterBatch(state, waiters, evaluated)
          }
        }
      })
    } catch (error: unknown) {
      state.requested = false
      this.resolveEvaluationWaiters(state, false)
      this.warn(`dsh-loopx-driver: could not start evaluation: ${renderThrown(error)}`)
      return
    }
    state.run = run
    const retire = (): void => {
      state.run = undefined
      if (state.requested && !state.stopping) this.requestEvaluation(state)
    }
    void run.then(retire, error => {
      this.warn(`dsh-loopx-driver: evaluation failed: ${renderThrown(error)}`)
      retire()
```

</details>

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:714-737](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/service.ts#L714-L737)

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

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx:23-28](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx#L23-L28)

界面停状态优先于 Agent running。

```text
function visibleStatus(
  snapshot: GoalBarSnapshotV1,
): 'active' | 'running' | 'paused' {
  if (snapshot.goalActivation === 'stopped') return 'paused'
  return snapshot.agentStatus === 'running' ? 'running' : 'active'
}
```

**依据 8 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:173-184](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L173-L184)

宿主上下文按来源 kind 识别。

<details>
<summary>查看原文（12行）</summary>

```text
function isDriverMessage(message: UserMessage): boolean {
  return continuationSource(message) !== undefined
}

function isHostContextMessage(message: UserMessage): boolean {
  // DSH kind identifies the producer; snapshot/catalog forms also describe plugin messages.
  const kind: string = message.source.kind
  return kind === 'runtime-context' || kind === 'time-context' || kind === 'skill-catalog'
}

function sameReservation(message: UserMessage, reservation: Reservation): boolean {
  const source = continuationSource(message)
```

</details>

**依据 9 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:833-888](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L833-L888)

并行消息、授权变化和下游判决的失败分支。

<details>
<summary>查看原文（56行）</summary>

```text
    if (reservation === undefined || !sameReservation(submitted, reservation)
      || reservation.phase !== 'claimed') {
      this.warn(`dsh-loopx-driver: ${preStepRejection(reservation === undefined ? 'missing-reservation' : !sameReservation(submitted, reservation) ? 'reservation-mismatch' : 'reservation-not-claimed', messages, submitted, startedAt)}`)
      if (reservation !== undefined && submitted.id === reservation.messageId) {
        this.retireReservation(state)
      }
      this.restoreOtherMessages(agent, messages, submitted)
      return { kind: 'reject' }
    }
    if (messages.some(message => message.id !== submitted.id && !isHostContextMessage(message))) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('competing-messages', messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, messages, submitted)
      return { kind: 'reject' }
    }

    if (!(await this.authorityStillAllows(state, reservation, signal))) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('authority-before-next', messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, messages, submitted)
      this.requestEvaluation(state)
      return { kind: 'reject' }
    }

    let decision: PreStepDecision
    try {
      decision = await next()
    } catch (error: unknown) {
      state.pauseAfterTurnError = true
      this.retireReservation(state)
      throw error
    }
    if (signal.aborted) {
      state.pauseAfterTurnError = true
      this.retireReservation(state)
      return decision
    }
    if (decision.kind === 'reject') {
      this.warn(`dsh-loopx-driver: ${preStepRejection('downstream-reject', messages, submitted, startedAt)}`)
      state.pauseAfterTurnError = true
      this.retireReservation(state)
      return decision
    }
    const admitted = decision.messages.find(message => message.id === reservation.messageId)
    if (decision.messages.filter(message => !isHostContextMessage(message)).length !== 1
      || admitted === undefined
      || !sameReservation(admitted, reservation)) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('downstream-batch', decision.messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
      return { kind: 'reject' }
    }
    if (!(await this.authorityStillAllows(state, reservation, signal))) {
      this.warn(`dsh-loopx-driver: ${preStepRejection('authority-after-next', decision.messages, submitted, startedAt)}`)
      this.retireReservation(state)
      this.restoreOtherMessages(agent, decision.messages, submitted)
```

</details>

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

CLI 探测预先验证候选的版本，失败记录阶段、候选类型、有限 OS 错误码、退出码和 cwd 是否存在等字段；配置命令、托管启动器、PATH 和 Python 模块候选仍需按现场逐个核对。受限诊断缓解了仅见 missing 的问题，不证明任意安装环境可用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-loopx-plugin/README.md:44-68](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/README.md#L44-L68)

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

**依据 2 · 作者声明**：[packages/dsh-loopx-plugin/README.md:69-85](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/README.md#L69-L85)

作者分开已发包和源候选的宿主覆盖。

<details>
<summary>查看原文（17行）</summary>

````text
The continuation driver follows LoopX's context delivery setting on CLI 2.3
and later. When the guard returns a capture reference, the driver reads the
admission fields from that same capture. The driver requests raw admission
JSON from older supported CLIs.
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
````

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/cli.ts:1-5](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/cli.ts#L1-L5)

最低 LoopX 版本。

```text
import { spawn } from 'node:child_process'
import { statSync } from 'node:fs'

// 1.2.4 includes the released Windows peer-file fix. Bootstrap and every
// runtime consumer must use the same floor, including an existing global CLI.
```

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:256-281](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L256-L281)

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

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:315-339](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L315-L339)

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

**依据 6 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:368-401](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L368-L401)

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

**依据 7 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:404-429](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L404-L429)

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

**依据 8 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:570-588](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L570-L588)

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

**依据 9 · 源码核查**：[packages/dsh-loopx-plugin/src/init-command.ts:633-647](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/init-command.ts#L633-L647)

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

**依据 10 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:264-279](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/observer.ts#L264-L279)

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

**依据 11 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:315-327](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/observer.ts#L315-L327)

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

**依据 12 · 源码核查**：[packages/dsh-loopx-plugin/src/observer.ts:653-674](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/observer.ts#L653-L674)

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

**依据 13 · 源码核查**：[packages/dsh-loopx-plugin/src/cli.ts:32-65](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/cli.ts#L32-L65)

诊断只接收受限类型及标量。

<details>
<summary>查看原文（34行）</summary>

```text
export interface LoopXCliDiagnostics {
  osCode?: string | undefined
  candidate?: 'configured-command' | 'managed-launcher' | 'path-loopx' | 'python-module' | undefined
  cwdExists?: boolean | undefined
  causeKind?: LoopXCliErrorKind | undefined
  probes?: readonly LoopXCliError[] | undefined
}

export function spawnCwdExists(cwd?: string): boolean | undefined {
  try {
    return statSync(cwd ?? process.cwd(), { throwIfNoEntry: false })?.isDirectory() ?? false
  } catch {
    return undefined
  }
}

/** Only closed labels and scalars belong in the driver's diagnostic record. */
function cliFailureFields(error: unknown): string {
  const failure = error instanceof LoopXCliError ? error : undefined
  const details = failure?.diagnostics
  const kind = (value: unknown): string => [
    'aborted', 'missing', 'timeout', 'transport', 'output_limit', 'exit',
    'typed_failure', 'invalid_json', 'invalid_schema',
  ].includes(value as string) ? String(value) : 'internal'
  const code = [
    'ENOENT', 'EPERM', 'EACCES', 'ETIMEDOUT', 'EAGAIN', 'EBUSY', 'EMFILE',
    'ENFILE', 'ENOMEM', 'ENOTDIR', 'E2BIG', 'ENOEXEC', 'EINVAL', 'ECANCELED', 'EIO',
  ].includes(details?.osCode ?? '') ? details!.osCode : 'none'
  const candidate = [
    'configured-command', 'managed-launcher', 'path-loopx', 'python-module',
  ].includes(details?.candidate ?? '') ? details!.candidate : 'unknown'
  const exitCode = Number.isSafeInteger(failure?.exitCode) ? failure!.exitCode : 'none'
  const cwd = typeof details?.cwdExists === 'boolean' ? details.cwdExists : 'unknown'
  return `kind=${kind(failure?.kind)} cause_kind=${kind(details?.causeKind ?? failure?.kind)} code=${code} exit_code=${exitCode} candidate=${candidate} cwd_exists=${cwd}`
```

</details>

**依据 14 · 源码核查**：[packages/dsh-loopx-plugin/src/cli.ts:432-461](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/cli.ts#L432-L461)

版本探测失败后合并标签和原因。

<details>
<summary>查看原文（30行）</summary>

```text
          signal: options.signal,
          timeoutMs: 5_000,
          maxOutputBytes: 16 * 1024,
        },
      )
      if (options.signal?.aborted) {
        throw new LoopXCliError('aborted', 'operation was cancelled', false)
      }
      const version = result.exitCode === 0 ? supportedLoopXVersion(result.stdout) : undefined
      if (version) return { ...candidate, version, candidate: label }
      throw new LoopXCliError(
        result.exitCode === 0 ? 'invalid_schema' : 'exit',
        'LoopX version probe did not verify', false, result.exitCode,
      )
    } catch (error: unknown) {
      if (options.signal?.aborted) {
        throw new LoopXCliError('aborted', 'operation was cancelled', false)
      }
      if (error instanceof LoopXCliError && error.kind === 'aborted') throw error
      const failure = error instanceof LoopXCliError ? error
        : new LoopXCliError('transport', 'LoopX version probe failed to execute', false)
      probes.push(new LoopXCliError(failure.kind, 'version probe failed', false, failure.exitCode, {
        osCode: failure.diagnostics.osCode, candidate: label, cwdExists,
      }))
    }
  }
  const last = probes.at(-1)
  throw new LoopXCliError('missing', `LoopX CLI ${MINIMUM_LOOPX_VERSION} or newer is unavailable`, false, last?.exitCode, {
    ...last?.diagnostics, causeKind: last?.kind, probes,
  })
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

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:523-539](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L523-L539)

会话恢复闲置才重评，竞争消息取消待评估。

<details>
<summary>查看原文（17行）</summary>

```text
  const token = typeof reset?.reset_token === 'string' ? reset.reset_token : ''
  const unchangedPolls = token.length > 0 && token === currentToken
    ? currentPolls
    : 0
  const rawLimit = record(unchanged?.limits)?.local_scheduler
  const limit = typeof rawLimit === 'number'
    && Number.isSafeInteger(rawLimit)
    && rawLimit >= 0
    ? rawLimit
    : undefined
  if (limit !== undefined && unchangedPolls >= limit) {
    return { kind: 'wait', schedulerToken: token, unchangedPolls }
  }

  const progression = Array.isArray(local.example_progression_minutes)
    ? local.example_progression_minutes.filter((value): value is number => (
        typeof value === 'number' && Number.isFinite(value) && value > 0
```

</details>

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:557-561](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L557-L561)

Agent 出错停下待处理。

```text
    kind: 'wait',
    delayMs: Math.min(Math.round(delayMs), MAX_WAIT_MS),
    schedulerToken: token,
    unchangedPolls: unchangedPolls + 1,
  }
```

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:643-653](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L643-L653)

精确消息被接纳及异常结束停续轮的分支。

<details>
<summary>查看原文（11行）</summary>

```text
  constructor(options: LoopXDriverOptions) {
    this.isLiveAgent = options.isLiveAgent
    this.runner = options.runner
    this.commandResolver = options.resolveCommand
      ?? (signal => resolveLoopXCommand({ runner: this.runner, signal }))
    this.clock = options.clock ?? systemClock
    this.makeTurnInstanceId = options.makeTurnInstanceId
      ?? (() => `dsh-loopx-${randomUUID()}`)
    this.retryDelaysMs = options.retryDelaysMs ?? [200, 750]
    this.runDetached = options.runDetached ?? (operation => operation())
    this.warn = message => {
```

</details>

**依据 4 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:695-737](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/service.ts#L695-L737)

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

**依据 5 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:1080-1104](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L1080-L1104)

配额调用有固定轮次及有界重试。

<details>
<summary>查看原文（25行）</summary>

```text
    state.reservation = reservation
    try {
      state.agent.followup(message)
    } catch (error: unknown) {
      this.retireReservation(state)
      this.warn(`dsh-loopx-driver: could not queue same-session work: ${renderThrown(error)}`)
    }
    return true
  }

  private ensureReady(
    state: DriverState,
    signal: AbortSignal,
    session: Agent['session'],
  ): void {
    if (signal.aborted || !this.ready(state) || state.agent.session !== session) {
      throw new LoopXCliError('aborted', 'automatic admission was fenced', false)
    }
  }

  private async buildPlan(
    state: DriverState,
    signal: AbortSignal,
    setStage: (stage: AdmissionStage) => void,
  ): Promise<EvaluationPlan> {
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

**依据 1 · 源码核查**：[packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx:23-28](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/client/LoopXGoalBar.tsx#L23-L28)

当前显示优先目标暂停。

```text
function visibleStatus(
  snapshot: GoalBarSnapshotV1,
): 'active' | 'running' | 'paused' {
  if (snapshot.goalActivation === 'stopped') return 'paused'
  return snapshot.agentStatus === 'running' ? 'running' : 'active'
}
```

**依据 2 · 源码核查**：[packages/dsh-loopx-plugin/src/driver.ts:603-614](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/driver.ts#L603-L614)

Driver 有保留当前预约的状态。

<details>
<summary>查看原文（12行）</summary>

```text
      && targetClass.length <= 80
      && contentSummary.length > 0
      && contentSummary.length <= 500
      ? [{ candidate_ref: candidateRef, target_class: targetClass,
        content_summary: contentSummary }]
      : []
  }).slice(0, 4)
  if (guidance.length === 0) return taskBody
  const packet = JSON.stringify({
    schema_version: 'loopx_turn_reward_memory_context_v0',
    authority: 'guidance_only',
    instruction: 'Use only when consistent with current evidence; this grants no action authority.',
```

</details>

**依据 3 · 源码核查**：[packages/dsh-loopx-plugin/src/goalbar/service.ts:714-731](https://github.com/loopx-project/loopx/blob/f38fae05bb9a1c2cc54a2641359224cc253d32ac/packages/dsh-loopx-plugin/src/goalbar/service.ts#L714-L731)

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
