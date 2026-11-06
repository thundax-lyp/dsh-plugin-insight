# DSH with ChatGPT

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[48fbfb3](https://github.com/BeforeWave/dsh-with-chatgpt/tree/48fbfb36c765c9ba50c11fda93667f4446f61572)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/BeforeWave/dsh-with-chatgpt) [![npm 30d 949](https://img.shields.io/static/v1?label=npm+30d&message=949&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@beforewave/dsh-with-chatgpt) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@beforewave/dsh-with-chatgpt)
<!-- END META -->

> **功能**：通过 Agent Helm 集成把 ChatGPT 本地工程入口与 DSH 原生会话、工作区和工具桥接。

> **亮点**：DSH会话/工作区适配、状态/历史面板及本地MCP生命周期是集成贡献，远程认证/工程工具核心在Agent Helm。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：approval:false与Core源码边界使远程写授权尚未闭环；accepted/idle/cancelled不是独立任务验收或副作用回滚，省DSH token不能替代总成本对照。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · ChatGPT 到本地工程与 DSH Session 的链路实际由谁执行？](#detail-section-11)
  - [Q02 · 运行时不可用、审批、取消与恢复有哪些关键边界？](#detail-section-12)
  - [Q03 · “省 Token”以及统一 MCP 入口的实际代价与增量是什么？](#detail-section-13)
  - [Q04 · 当前应怎样推进采用，什么方向有可证伪增量？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：作者面向希望从网页分析/小改动切到本地DSH持续执行并回查结果的开发者。见 [Q01](#research-q01)。

手工把计划复制到DSH并回网页复核；未测其他远程工程Agent。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 原生会话适配 | 委派DSH持续执行 | 接受非任务验收 |
| 持久历史 | 回看与恢复 | idle不能证明完成 |
| Core管理 | 附着或受管启动 | 外部进程生命周期不同 |
| 本地MCP | DSH调用Core工具 | 依赖核心权限 |
| 网页本地工程入口 | 作者定位的远程工作流 | Core/Connector边界未闭环 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| Agent Helm Core0.1.6 | RPC/本地工具/隧道核心 | 必需 | 本次无固定核心材料 |
| DSH | 原生Agent/工作区/历史 | 委派必需 | peer兼容范围需核对 |
| ChatGPT Connector | 网页入口 | 远程使用必需 | 工具Schema独立刷新 |
| Node / 网络 | 启动与隧道 | 必需 | Node>=24，费用未测 |


| 阶段 | 操作 | 结果与边界 |
|---|---|---|
| 准备 | 先审Core/宿主权限及版本 | 未核前不开放生产项目 |
| 正常 | 解析工作区、创建或恢复DSH会话 | followup返回接受非完成 |
| 复核 | 按会话id查历史、diff和测试 | idle非验收 |
| 失败 | 查历史后决定是否重发 | 取消不回滚，Core不可用UI仍在 |

**效果与成本**

| 阶段 | 现金 | 人工 | 未知与控制 |
|---|---|---|---|
| 首次 | 服务/隧道未测 | Core、Connector、权限配置 | 先补审 |
| 持续 | ChatGPT与DSH等总费用未知 | 多组件升级、刷新Schema | 不以单边token估收益 |
| 失败恢复 | 重试未知 | 分层排错、真实修改核查 | 防重复委派 |
| 退出 | 外部服务独立 | 关闭隧道、Core和授权分开 | 持久会话保留 |


| 结果 | 源码支持 | 未验证 |
|---|---|---|
| DSH委派 | 真实Agent及持久历史 | 网页到Core端到端 |
| 本地MCP | Bearer挂载Core | 核心工具权限 |
| 状态恢复 | 不可用仍保留UI | 实际重连可靠性 |
| 成本 | 改变单边任务分配 | 合格结果及全部费用 |

> **思考**：approval:false与Core源码边界使远程写授权尚未闭环；accepted/idle/cancelled不是独立任务验收或副作用回滚，省DSH token不能替代总成本对照。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：DSH会话/工作区适配、状态/历史面板及本地MCP生命周期是集成贡献，远程认证/工程工具核心在Agent Helm。见 [Q01](#research-q01)、[Q03](#research-q03)。

保留故障状态入口、区分Core生命周期所有者、等待完整ready标记可借鉴；accepted/idle必须与独立交付验收分开。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

approval:false与Core源码边界使远程写授权尚未闭环；accepted/idle/cancelled不是独立任务验收或副作用回滚，省DSH token不能替代总成本对照。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先补固定Core与宿主认证核验，再在项目副本只读起步；响应不明先查会话，权限不明关隧道回DSH。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定集成源码；未核Agent Helm Core端到端权限，也未运行真实Connector。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、scripts/prepare-shared.mjs、src/dsh/adapter.ts、src/dsh/local-mcp.ts、src/hosts/dsh.ts、src/index.ts、src/runtime/daemon.ts、src/runtime/runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查插件→Core启动/RPC适配、原生会话创建恢复发送取消、本地MCP和UI故障状态。未审依赖Core、完整隧道/Connector身份链、宿主外围认证及所有UI/独立宿主模式；未安装运行。
- 下一步：先固定审Core0.1.6及Connector身份权限，再项目副本做断线/重发/取消与独立diff测试并记总成本；均未执行。

**分析版本**

- **仓库**：[BeforeWave/dsh-with-chatgpt](https://github.com/BeforeWave/dsh-with-chatgpt)
- **版本号**：0.1.6（[固定提交 48fbfb3](https://github.com/BeforeWave/dsh-with-chatgpt/tree/48fbfb36c765c9ba50c11fda93667f4446f61572)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证稳定操作id的跨端委派回执能否减少断线重复与结果误判；Core已有等效机制即推翻新增必要性。见 [Q04](#research-q04)。

先固定审Core0.1.6及Connector身份权限，再项目副本做断线/重发/取消与独立diff测试并记总成本；均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 6 | 269 | 235 | 9 | — |
| .md | source | 2 | 479 | — | — | 2885 |
| .tsx | source | 9 | 2461 | 2309 | 16 | — |
| .ts | source | 28 | 4417 | 4065 | 62 | — |
| .mjs | test | 13 | 959 | 878 | 9 | — |

</details>

**活跃度**

[![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/BeforeWave/dsh-with-chatgpt/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/BeforeWave/dsh-with-chatgpt/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：界定集成端可证机制和缺失Core边界，独立判断远程委派价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · ChatGPT 到本地工程与 DSH Session 的链路实际由谁执行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它定位为 DSH 与 Agent Helm 的集成入口：作者希望网页版 ChatGPT 直接处理小型本地工程任务，把长任务交原生 DSH，完成后回查代码。原办法是复制计划到 DSH、再复制结果回网页。当前仓库可以证明 DSH 适配端创建、恢复、发送与读取原生会话，但 ChatGPT Connector、隧道以及本地命令真正执行的 Core 由依赖 @beforewave/agent-helm 提供，不能把整条远程控制能力归为此插件原创或已完整核验。

插件apply注册DSH runtime，按daemonMode附着或启动外部Core，AdapterRpcClient注册DshAdapter。startSession解析工作区，创建真实Agent，设置cwd/preset，等待初始化空闲再followup首条消息，返回会话详情并挂到工作区；send恢复需要的Agent后followup并立即返回accepted。getSession从真实事件提取消息与最后assistant文本，未运行Agent的持久历史也可读。该链路具备真实持续Agent承接点，不是只生成待办文本，但accepted和idle都不等于任务验收成功。

本地MCP桥接从Core取URL/token，用DSH mcp-client挂载Streamable HTTP，并在启用后注入使用说明；它是DSH调用Core工具的另一方向，不能与ChatGPT经隧道调用本地工具混成一个已审入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:20-35](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/index.ts#L20-L35)

真实插件入口和注入服务。

<details>
<summary>查看原文（16行）</summary>

```text
export const name = 'dsh-with-chatgpt'
export const inject = [
  'agents',
  'agentDefaultModel',
  'agentPresets',
  'sessions',
  'sessionPersistence',
  'workspaceRegistry',
  'webServer',
  'systemPrompt',
  'tools',
]

export async function apply(ctx: Context, config: DshConfig): Promise<void> {
  await registerDshPlugin(ctx, config)
}
```

</details>

**依据 2 · 源码核查**：[src/runtime/runtime.ts:69-91](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/runtime/runtime.ts#L69-L91)

Core RPC注册adapter并同步本地MCP。

<details>
<summary>查看原文（23行）</summary>

```text

  async #attachRpc(): Promise<void> {
    if (this.#rpc?.connected) return
    if (!this.#coreSocket) throw new Error('dsh-with-chatgpt Core socket is not initialized')
    const rpc = new AdapterRpcClient({
      socket: this.#coreSocket,
      adapter: this.options.host.adapter,
      controlClientId: `dsh-ui:${this.options.host.adapter.id}:${randomUUID()}`,
      onWorkHistoryChanged: () => { for (const listener of [...this.#workHistorySubscribers]) listener() },
    })
    try {
      await rpc.start()
      this.#rpc = rpc
      this.#localMcp = this.options.host.createLocalMcp?.(rpc)
      await this.#localMcp?.syncFromCore().catch(() => {})
      this.options.logger?.info(`dsh-with-chatgpt: UI control connected to Core`)
    } catch (error) {
      await this.#localMcp?.disable().catch(() => {})
      this.#localMcp = undefined
      await rpc.stop().catch(() => {})
      this.#rpc = undefined
      const message = error instanceof Error ? error.message : String(error)
      throw error
```

</details>

**依据 3 · 源码核查**：[src/runtime/runtime.ts:151-176](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/runtime/runtime.ts#L151-L176)

Core启动/附着到RPC。

<details>
<summary>查看原文（26行）</summary>

```text
  async start(): Promise<void> {
    if (this.#started) return
    try {
      const socket = this.#ensureCoreSocket()
      const plan = resolveDaemonLaunchPlan(this.options.daemonMode, await probeDaemon(socket))
      if (plan === 'spawn') {
        const loaded = await this.#loadManagedConfig()
        await this.#spawnManaged(coreRuntimeEnvironment(loaded))
      } else {
        this.options.logger?.info(`dsh-with-chatgpt: attached to external Core daemon at ${socket}`)
      }
      await this.#attachRpc()
      if (plan === 'spawn') {
        await this.rpc.setCoreEnabled(true)
        await this.#localMcp?.syncFromCore().catch(() => {})
      }
      this.#startupError = undefined
      this.#started = true
    } catch (error) {
      this.#startupError = error instanceof Error ? error.message : String(error)
      await this.#detachRpc()
      await this.options.host.dispose?.().catch(() => {})
      await this.#managed?.stop().catch(() => {})
      this.#managed = undefined
      throw error
    }
```

</details>

**依据 4 · 源码核查**：[src/dsh/adapter.ts:258-291](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L258-L291)

创建真实DSH Agent及首消息。

<details>
<summary>查看原文（34行）</summary>

```text
  async startSession(input: StartSessionInput, signal?: AbortSignal): Promise<SessionDetail> {
    const workspace = await this.#resolveWorkspaceForCreate(input.workspace, signal)
    const sessionId = `session-${randomUUID()}`
    const composition = await this.#composeSetup(undefined, signal)
    const handle = await this.ctx.agents.create({
      sessionId: SessionId(sessionId),
      agentOptions: this.#agentOptions(),
      meta: {
        cwd: workspace.path,
        ...(composition.agentPreset ? { agentPreset: composition.agentPreset } : {}),
      },
      setup: composition.setup,
    })
    if (signal?.aborted) {
      await handle.dispose().catch(() => {})
      signal.throwIfAborted()
    }
    this.#owned.set(sessionId, handle)
    try {
      await waitWithSignal(handle.agent.whenIdle(), signal)
      signal?.throwIfAborted()
      if (input.title) this.ctx.get('sessionTitle')?.rename(handle.agent.session, input.title)
      signal?.throwIfAborted()
      if (input.initialMessage?.trim()) {
        handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: input.initialMessage }], source: { kind: 'user' } }))
      }
      const detail = await this.getSession(sessionId, 20, signal)
      signal?.throwIfAborted()
      await workspace.attachSession(SessionId(sessionId))
      return detail
    } catch (error) {
      this.#owned.delete(sessionId)
      await handle.dispose().catch(() => {})
      throw error
```

</details>

**依据 5 · 源码核查**：[src/dsh/adapter.ts:354-386](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L354-L386)

读事件及accepted发送语义。

<details>
<summary>查看原文（33行）</summary>

```text
  async getSession(sessionId: string, maxMessages = 20, signal?: AbortSignal): Promise<SessionDetail> {
    const loaded = await this.#load(sessionId, signal)
    const messages = summarizeMessages(loaded.events, maxMessages)
    const h = record(loaded.header)
    const meta = record(h.meta)
    const title = foldSessionTitle(loaded.events)?.title
    const workspace = typeof h.cwd === 'string' ? h.cwd : typeof meta.cwd === 'string' ? meta.cwd : undefined
    const updatedAt = lastEventTime(loaded.events)
    const assistantText = lastAssistantText(loaded.events)
    return {
      id: sessionId,
      agent: this.id,
      status: loaded.agent ? (loaded.agent.status === 'running' ? 'running' : 'idle') : 'idle',
      ...(workspace ? { workspace } : {}),
      ...(title ? { title } : {}),
      ...(updatedAt ? { updatedAt } : {}),
      messages,
      ...(assistantText ? { lastAssistantText: assistantText } : {}),
      native: { live: Boolean(loaded.agent), sessionId },
    }
  }

  async attachSession(sessionId: string, signal?: AbortSignal): Promise<SessionDetail> {
    await this.#ensureAgent(sessionId, signal)
    return await this.getSession(sessionId, 20, signal)
  }

  async send(sessionId: string, message: string, signal?: AbortSignal): Promise<{ accepted: true; sessionId: string }> {
    if (!message.trim()) throw new Error('message must not be empty')
    const agent = await this.#ensureAgent(sessionId, signal)
    signal?.throwIfAborted()
    agent.followup(createUserMessage({ content: [{ type: 'text', text: message }], source: { kind: 'user' } }))
    return { accepted: true, sessionId }
```

</details>

**依据 6 · 源码核查**：[src/dsh/local-mcp.ts:23-36](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/local-mcp.ts#L23-L36)

MCP鉴权与连接配置。

<details>
<summary>查看原文（14行）</summary>

```text
export function localMcpClientConfig(connection: LocalMcpConnection): LocalMcpClientConfig {
  return {
    transport: 'streamable-http',
    serverName: LOCAL_MCP_SERVER_NAME,
    url: connection.url,
    headers: { Authorization: `Bearer ${connection.token}` },
    toolCallTimeoutMs: 60_000,
    failOnStartupError: true,
    reconnect: {
      enabled: true,
      initialDelayMs: 500,
      maxDelayMs: 30_000,
      maxAttempts: 10,
    },
```

</details>

**依据 7 · 源码核查**：[src/dsh/local-mcp.ts:59-77](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/local-mcp.ts#L59-L77)

实际挂载与说明注入。

<details>
<summary>查看原文（19行）</summary>

```text
  async enable(): Promise<void> {
    if (this.#fiber) return
    const connection = await this.rpc.getLocalMcpConnection()
    const fiber = this.ctx.plugin(
      dshMcpClient as unknown as Plugin,
      localMcpClientConfig(connection),
    )
    try {
      await fiber
      const disposeAgentInstructions = installDshLocalMcpAgentInstructions(this.ctx)
      this.#fiber = fiber
      this.#disposeAgentInstructions = disposeAgentInstructions
      this.#error = undefined
    } catch (error) {
      this.#disposeAgentInstructions?.()
      this.#disposeAgentInstructions = undefined
      await fiber?.dispose().catch(() => {})
      this.#error = error instanceof Error ? error.message : String(error)
      throw error
```

</details>

#### 缺口

- 没有该固定依赖Core的源码材料，未验证ChatGPT Connector到Core的认证、工具执行和回传。
  **影响**：不能确认端到端权限及结果，更不能宣称网页已安全控制项目。
  **进一步探讨**：固定agent-helm0.1.6及Connector版本，先审身份与工具授权，再做无外部副作用已知任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 运行时不可用、审批、取消与恢复有哪些关键边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Core不可用时插件保留状态/控制路由，记录警告，面板仍可显示可恢复不可用状态；因此看见侧栏不代表Core、隧道或工具可用。managed模式拒绝替换已有daemon，external模式要求已有daemon，auto可附着已有服务。受管启动不只探socket，还等Core完整启动标记；退出前则解除本地MCP、RPC、已拥有Agent句柄和受管子进程。附着外部进程不等同插件拥有其生命周期。

DshAdapter声明approval:false，插件没有把DSH审批请求转给网页的可核查链路。实际策略依赖宿主及Core权限，不可从“原生Session可接管”推出远程每次写入都有人批准。本仓库Host路由直接由webServer.register挂接，处理函数未单独验证身份；是否有宿主外围授权需另核，当前不能报告已发现可利用未授权漏洞，也不能当它已验证安全。

cancel只查live Agent、调用cancel后返回cancelled；没有等待底层命令全部退出，更不撤销已改文件或外部副作用。恢复持久会话重装preset并resume，历史读取把非live状态表示idle，用户仍需检查真实diff和测试。启动/发送每次都是新的用户消息，未见跨网络重试的幂等操作标识，响应不明时应先查会话历史，不能盲目重复委派。

#### 证据与依据

**依据 1 · 源码核查**：[src/hosts/dsh.ts:124-170](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/hosts/dsh.ts#L124-L170)

路由挂接、不可用警告与卸载。

<details>
<summary>查看原文（47行）</summary>

```text
export function registerDshRuntimeRoutes(ctx: Context, runtime: ChatGPTHelmRuntime): () => void {
  const disposeStatus = ctx.webServer.register({
    kind: 'exact',
    path: HELM_UI_STATUS_PATH,
    handler: async (req, res) => await handleHelmStatusRequest(runtime, req, res),
  })
  const disposeMcp = ctx.webServer.register({
    kind: 'exact',
    path: HELM_MCP_SERVERS_PATH,
    handler: async (req, res) => await handleHelmMcpServersRequest(runtime, req, res),
  })
  const disposeSessions = ctx.webServer.register({
    kind: 'prefix',
    path: HELM_SESSION_API_PATH,
    handler: async (req, res) => await handleHelmSessionRequest(runtime, req, res),
  })
  return () => {
    disposeSessions()
    disposeMcp()
    disposeStatus()
  }
}

export async function registerDshPlugin(ctx: Context, config: Config): Promise<void> {
  await ctx.effect(async function* () {
    const runtime = createDshRuntime(ctx, config)
    let disposeRoutes: (() => void) | undefined
    try {
      // Keep the control/status surface alive even when Core is unavailable so the
      // browser UI can open and present a recoverable unavailable state.
      disposeRoutes = registerDshRuntimeRoutes(ctx, runtime)
      try {
        await runtime.start()
      } catch (error) {
        const detail = error instanceof Error ? error.message : String(error)
        ctx.logger.warn(`dsh-with-chatgpt: Agent Helm Core is unavailable during startup: ${detail}`)
      }
    } catch (error) {
      disposeRoutes?.()
      await runtime.stop()
      throw error
    }
    yield async () => {
      disposeRoutes?.()
      await runtime.stop()
    }
  }, 'dsh-with-chatgpt.runtime')
```

</details>

**依据 2 · 源码核查**：[src/runtime/daemon.ts:8-18](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/runtime/daemon.ts#L8-L18)

三种模式边界。

<details>
<summary>查看原文（11行）</summary>

```text
export function resolveDaemonLaunchPlan(mode: DaemonMode, available: boolean): DaemonLaunchPlan {
  if (mode === 'external') {
    if (!available) throw new Error('daemonMode=external requires an existing Agent Helm daemon')
    return 'attach'
  }
  if (mode === 'managed') {
    if (available) throw new Error('daemonMode=managed cannot replace an existing Agent Helm daemon')
    return 'spawn'
  }
  return available ? 'attach' : 'spawn'
}
```

</details>

**依据 3 · 源码核查**：[src/runtime/daemon.ts:60-92](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/runtime/daemon.ts#L60-L92)

socket加完整启动标记。

<details>
<summary>查看原文（33行）</summary>

```text
    child.stdout?.on('data', (chunk: Buffer) => this.options.onStdout?.(chunk.toString('utf8')))
    // A live control socket is NOT proof that Core has finished booting:
    // Core creates its RPC socket before starting the HTTP listener. If that
    // listener fails (for example, EADDRINUSE at 3457), an early RPC client
    // connects and is immediately disconnected. The CLI prints this exact
    // marker only after CoreRuntime.start() succeeds completely.
    const readyMarker = `agent-helm: adapter socket ${this.options.socket}`
    let stderrTail = ''
    let bootCompleted = false
    child.stderr?.on('data', (chunk: Buffer) => {
      const text = chunk.toString('utf8')
      stderrTail = (stderrTail + text).slice(-Math.max(8192, readyMarker.length + 100))
      if (stderrTail.includes(readyMarker + '\n')) bootCompleted = true
      this.options.onStderr?.(text)
    })

    const deadline = Date.now() + (this.options.startupTimeoutMs ?? 20_000)
    while (Date.now() < deadline) {
      const childError = this.#currentChildError()
      if (childError) {
        this.#child = undefined
        throw new Error(`managed Agent Helm daemon process failed: ${childError.message}`)
      }
      if (bootCompleted && await probeDaemon(this.options.socket)) return
      if (child.exitCode !== null || child.signalCode !== null) {
        this.#child = undefined
        throw new Error(`managed Agent Helm daemon exited before full startup (code=${String(child.exitCode)}, signal=${String(child.signalCode)})`)
      }
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
    await this.stop()
    throw new Error(`managed Agent Helm daemon did not become ready at ${this.options.socket}`)
  }
```

</details>

**依据 4 · 源码核查**：[src/runtime/runtime.ts:179-194](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/runtime/runtime.ts#L179-L194)

停止只释放拥有的服务。

<details>
<summary>查看原文（16行）</summary>

```text
  async stop(): Promise<void> {
    this.#timelineSubscriptions.dispose()
    if (!this.#rpc && !this.#managed && !this.#started) return
    this.#started = false
    this.#tunnelClientReady = false
    const localMcp = this.#localMcp
    const rpc = this.#rpc
    const managed = this.#managed
    this.#localMcp = undefined
    this.#rpc = undefined
    this.#managed = undefined
    await localMcp?.disable().catch(() => {})
    await rpc?.stop().catch(() => {})
    await this.options.host.dispose?.().catch(() => {})
    await managed?.stop().catch(() => {})
  }
```

</details>

**依据 5 · 源码核查**：[src/dsh/adapter.ts:61-68](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L61-L68)

approval能力声明false。

```text
  readonly capabilities = {
    persistentSession: true,
    nativeUi: true,
    history: true,
    cancel: true,
    steer: true,
    approval: false,
  } as const
```

**依据 6 · 源码核查**：[src/dsh/adapter.ts:188-206](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L188-L206)

持久会话resume。

<details>
<summary>查看原文（19行）</summary>

```text
  async #ensureAgent(sessionId: string, signal?: AbortSignal): Promise<Agent> {
    const live = this.ctx.agents.get(SessionId(sessionId))
    if (live) return live
    const persistence = this.ctx.get('sessionPersistence')
    if (!persistence) throw new Error(`cannot resume ${sessionId}: session persistence unavailable`)
    const inspected = await waitWithSignal(persistence.inspect(SessionId(sessionId)), signal)
    const presetId = resolveSessionPreset({ header: inspected.meta, events: inspected.events })
    const composition = await this.#composeSetup(presetId, signal)
    const handle = await this.ctx.agents.resume({
      resumeSessionId: SessionId(sessionId),
      agentOptions: this.#agentOptions(),
      setup: composition.setup,
    })
    if (signal?.aborted) {
      await handle.dispose().catch(() => {})
      signal.throwIfAborted()
    }
    this.#owned.set(sessionId, handle)
    return handle.agent
```

</details>

**依据 7 · 源码核查**：[src/dsh/adapter.ts:381-401](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L381-L401)

发送与取消的即时返回。

<details>
<summary>查看原文（21行）</summary>

```text
  async send(sessionId: string, message: string, signal?: AbortSignal): Promise<{ accepted: true; sessionId: string }> {
    if (!message.trim()) throw new Error('message must not be empty')
    const agent = await this.#ensureAgent(sessionId, signal)
    signal?.throwIfAborted()
    agent.followup(createUserMessage({ content: [{ type: 'text', text: message }], source: { kind: 'user' } }))
    return { accepted: true, sessionId }
  }

  async disposeOwned(): Promise<void> {
    while (this.#workspaceMutationRestorers.length) this.#workspaceMutationRestorers.pop()?.()
    const handles = [...this.#owned.values()]
    this.#owned.clear()
    await Promise.allSettled(handles.map((handle) => handle.dispose()))
  }

  async cancel(sessionId: string, signal?: AbortSignal): Promise<{ cancelled: true; sessionId: string }> {
    signal?.throwIfAborted()
    const agent = this.ctx.agents.get(SessionId(sessionId))
    if (!agent) throw new Error(`session is not live: ${sessionId}`)
    agent.cancel({ kind: 'user' })
    return { cancelled: true, sessionId }
```

</details>

#### 缺口

- 宿主外围授权、Core策略、真实取消和重试状态未核验。
  **影响**：当前无法给生产项目开放隧道的建议。
  **进一步探讨**：先追Core身份到操作，再验证拒绝、断线重连、重复提交及取消后实际副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “省 Token”以及统一 MCP 入口的实际代价与增量是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、贡献与相对优势

#### 完整回答

可归因的贡献是把DSH原生会话/工作区接入Core RPC、提供状态和工作历史UI、本地MCP挂载及生命周期管理。模型能力和原生Agent循环来自DSH，本地工程工具、外部MCP治理及ChatGPT tunnel来自Agent Helm；README对省Token的描述是作者目标，没有同任务测量。把分析搬去另一个模型可能减少DSH计量，却不能据此说明总费用、合格结果或人工复核更低。

包版本0.1.6依赖固定Agent Helm0.1.6、MCP SDK1.30.0和sandbox-runtime，要求Node>=24，DSH peer范围还有明确RC兼容点。构建也检查导出的共享UI源码；运行环境、Core、Connector Schema和插件都要一致。README明确升级Core工具Schema后需Refresh Tools，这说明界面已安装不等于远端工具契约同步。

首次负担包括DSH、Core、工作区、ChatGPT Connector/隧道与权限配置；持续有ChatGPT服务额度、DSH模型token、隧道和Core维护，具体金额未知。失败时要辨别侧栏、RPC、Core、隧道和Agent层，再查已发生的文件修改；卸载插件会释放自有运行资源，但外部Core/Connector授权与持久会话应分别处理。没有完整结果成本数据，不计算单位任务成本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:74-95](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/package.json#L74-L95)

Core、SDK、sandbox及宿主peer依赖。

<details>
<summary>查看原文（22行）</summary>

```text
  },
  "dependencies": {
    "@beforewave/agent-helm": "0.1.6",
    "@anthropic-ai/sandbox-runtime": "^0.0.79",
    "@modelcontextprotocol/sdk": "1.30.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1 <5",
    "@deepseek-ai/dsh-agent": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-agent-default-model": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-session": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-session-title": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-workspace": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/schemastery": ">=3.18.1 <4",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-mcp-client": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-client-locale": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": ">=0.1.1-rc.2 <0.2.0 || 0.2.1-rc.2"
```

</details>

**依据 2 · 源码核查**：[package.json:125-130](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/package.json#L125-L130)

Node运行要求与集成所有权。

```text
  "engines": {
    "node": ">=24"
  },
  "agentHelm": {
    "ownership": "integration"
  },
```

**依据 3 · 源码核查**：[scripts/prepare-shared.mjs:9-33](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/scripts/prepare-shared.mjs#L9-L33)

共享源码构建约束。

<details>
<summary>查看原文（25行）</summary>

```text
// Only the actual monorepo package may link canonical shared sources.
// An OSS checkout or standalone scratch may be nested anywhere below the
// monorepo: walking ancestor directories would leak private shared sources
// and can resolve a second React instance outside its isolated node_modules.
const repoRoot = resolve(packageRoot, '../..')
const canonicalRoot = packageRoot === join(repoRoot, 'packages', 'dsh-with-chatgpt')
  && sharedNames.every((name) => existsSync(join(repoRoot, 'shared', name)))
  ? join(repoRoot, 'shared')
  : undefined

if (canonicalRoot) {
  mkdirSync(targetRoot, { recursive: true })
  for (const name of sharedNames) {
    const target = join(targetRoot, name)
    const source = join(canonicalRoot, name)
    let current = false
    try { current = realpathSync(target) === realpathSync(source) } catch {}
    if (current) continue
    rmSync(target, { recursive: true, force: true })
    symlinkSync(source, target, process.platform === 'win32' ? 'junction' : 'dir')
  }
} else {
  for (const name of sharedNames) {
    if (!existsSync(join(targetRoot, name))) throw new Error(`Missing shared source: ${name}`)
  }
```

</details>

**依据 4 · 源码核查**：[README.md:38-48](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/README.md#L38-L48)

省Token为作者定位。

<details>
<summary>查看原文（11行）</summary>

```text
网页版 ChatGPT 有很强的模型能力，但原本无法直接访问你的本地项目、文件和终端。

DSH 能真正操作工程，但大量 Token 往往消耗在读取项目、理解上下文、分析问题和反复确认上。

**DSH with ChatGPT** 把两者连接起来：

* **ChatGPT 直接动手 Coding：** 读取和修改本地文件、运行终端命令、检查 Diagnostics、Git、构建和测试结果。
* **减少 DSH Token 消耗：** 项目理解、问题分析、小型修改和结果 Review 可以直接由 ChatGPT 完成，把 DSH 的 Token 留给真正需要持续执行的任务。
* **复杂任务直接交给 DSH：** ChatGPT 把已经理解清楚的任务直接交给原生 DSH Session，无需让 DSH 再从头理解整个项目。
* **完成后继续 Review：** DSH 执行完成后，ChatGPT 可以重新检查真实代码、Diff 和测试结果。
* **原生 Session，随时接管：** ChatGPT 创建的任务就是正常的 DSH Session，可以直接在 DSH Web 中查看、继续操作或人工接管。
```

</details>

**依据 5 · 源码核查**：[README.md:105-111](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/README.md#L105-L111)

Connector Schema需要独立刷新。

```text
---

### 升级后刷新 ChatGPT Connector Tools

本次 **MCP Server Integration** 对应的 Agent Helm Core 修改了 MCP Tool Schema，将 `external_mcp_search_tools` 替换为 `external_mcp_list_tools`。**升级并重启 Core 后，必须在 ChatGPT 自定义 Connector 中执行 Refresh Tools。**

如果出现工具不存在、参数 Schema 或 Contract 不匹配，请先核对 Core 版本并刷新。详情见 [Agent Helm 升级说明](https://github.com/BeforeWave/agent-helm#refresh-chatgpt-connector-tools-after-upgrading)。刷新不会删除已导入的 Server 或撤销授权。
```

#### 缺口

- 没有Core材料、真实Connector配置和完整账单/任务对照。
  **影响**：无法验证节省总成本或所有平台兼容。
  **进一步探讨**：固定全部组件比较手工复制与委派的正确率、总调用、复核和恢复工时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 当前应怎样推进采用，什么方向有可证伪增量？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前先观察，优先补Core与宿主认证边界，再考虑在无敏感信息的项目副本做单人已知任务。进入试用前应记录Core/插件/Connector版本、有效工作区、权限与模型；先只读，再做可恢复修改，按会话id回看工具结果、diff和独立测试。RPC返回accepted不算完成，断线后先查历史再决定是否重发；权限或结果不明时关隧道并回DSH原界面处理。

可验证的新方向是跨端委派回执：一个稳定操作id绑定请求、原生会话id、工作区/模型、已接受/执行中/结果未知/已验证状态，并让断线重试查询该操作而非新建任务。依据是当前可见send/cancel即时返回与持久会话能力；增量是跨端恢复语义，不是多加一个远程入口。最小实验在创建与接受后丢响应、重连和取消时比较重复任务数、未知结果处理与复核工时；若Core已有同等幂等回执，或不能减少重复/误判，则方向不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh/adapter.ts:258-291](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L258-L291)

创建会话标识与非事务流程。

<details>
<summary>查看原文（34行）</summary>

```text
  async startSession(input: StartSessionInput, signal?: AbortSignal): Promise<SessionDetail> {
    const workspace = await this.#resolveWorkspaceForCreate(input.workspace, signal)
    const sessionId = `session-${randomUUID()}`
    const composition = await this.#composeSetup(undefined, signal)
    const handle = await this.ctx.agents.create({
      sessionId: SessionId(sessionId),
      agentOptions: this.#agentOptions(),
      meta: {
        cwd: workspace.path,
        ...(composition.agentPreset ? { agentPreset: composition.agentPreset } : {}),
      },
      setup: composition.setup,
    })
    if (signal?.aborted) {
      await handle.dispose().catch(() => {})
      signal.throwIfAborted()
    }
    this.#owned.set(sessionId, handle)
    try {
      await waitWithSignal(handle.agent.whenIdle(), signal)
      signal?.throwIfAborted()
      if (input.title) this.ctx.get('sessionTitle')?.rename(handle.agent.session, input.title)
      signal?.throwIfAborted()
      if (input.initialMessage?.trim()) {
        handle.agent.followup(createUserMessage({ content: [{ type: 'text', text: input.initialMessage }], source: { kind: 'user' } }))
      }
      const detail = await this.getSession(sessionId, 20, signal)
      signal?.throwIfAborted()
      await workspace.attachSession(SessionId(sessionId))
      return detail
    } catch (error) {
      this.#owned.delete(sessionId)
      await handle.dispose().catch(() => {})
      throw error
```

</details>

**依据 2 · 源码核查**：[src/dsh/adapter.ts:354-401](https://github.com/BeforeWave/dsh-with-chatgpt/blob/48fbfb36c765c9ba50c11fda93667f4446f61572/src/dsh/adapter.ts#L354-L401)

历史/accepted/cancelled的界限。

<details>
<summary>查看原文（48行）</summary>

```text
  async getSession(sessionId: string, maxMessages = 20, signal?: AbortSignal): Promise<SessionDetail> {
    const loaded = await this.#load(sessionId, signal)
    const messages = summarizeMessages(loaded.events, maxMessages)
    const h = record(loaded.header)
    const meta = record(h.meta)
    const title = foldSessionTitle(loaded.events)?.title
    const workspace = typeof h.cwd === 'string' ? h.cwd : typeof meta.cwd === 'string' ? meta.cwd : undefined
    const updatedAt = lastEventTime(loaded.events)
    const assistantText = lastAssistantText(loaded.events)
    return {
      id: sessionId,
      agent: this.id,
      status: loaded.agent ? (loaded.agent.status === 'running' ? 'running' : 'idle') : 'idle',
      ...(workspace ? { workspace } : {}),
      ...(title ? { title } : {}),
      ...(updatedAt ? { updatedAt } : {}),
      messages,
      ...(assistantText ? { lastAssistantText: assistantText } : {}),
      native: { live: Boolean(loaded.agent), sessionId },
    }
  }

  async attachSession(sessionId: string, signal?: AbortSignal): Promise<SessionDetail> {
    await this.#ensureAgent(sessionId, signal)
    return await this.getSession(sessionId, 20, signal)
  }

  async send(sessionId: string, message: string, signal?: AbortSignal): Promise<{ accepted: true; sessionId: string }> {
    if (!message.trim()) throw new Error('message must not be empty')
    const agent = await this.#ensureAgent(sessionId, signal)
    signal?.throwIfAborted()
    agent.followup(createUserMessage({ content: [{ type: 'text', text: message }], source: { kind: 'user' } }))
    return { accepted: true, sessionId }
  }

  async disposeOwned(): Promise<void> {
    while (this.#workspaceMutationRestorers.length) this.#workspaceMutationRestorers.pop()?.()
    const handles = [...this.#owned.values()]
    this.#owned.clear()
    await Promise.allSettled(handles.map((handle) => handle.dispose()))
  }

  async cancel(sessionId: string, signal?: AbortSignal): Promise<{ cancelled: true; sessionId: string }> {
    signal?.throwIfAborted()
    const agent = this.ctx.agents.get(SessionId(sessionId))
    if (!agent) throw new Error(`session is not live: ${sessionId}`)
    agent.cancel({ kind: 'user' })
    return { cancelled: true, sessionId }
```

</details>

#### 缺口

- Core是否已有操作回执与幂等未知，试用和方案未运行。
  **影响**：新方向不能当已有贡献，采用缺口仍存在。
  **进一步探讨**：先审Core契约，再决定是否需要新增并做受控断线实验。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
