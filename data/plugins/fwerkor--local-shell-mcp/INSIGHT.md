# Local Shell MCP for DSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[cd29a63](https://github.com/fwerkor/local-shell-mcp/tree/cd29a63d15826b17edfd55352e5237e0612a3fb8)

<!-- BEGIN META -->
[![GitHub ★ 106](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=106&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/fwerkor/local-shell-mcp) [![npm 30d 1,446](https://img.shields.io/static/v1?label=npm+30d&message=1%2C446&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/local-shell-mcp-dsh) [![最新发布 2026-10-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/local-shell-mcp-dsh)
<!-- END META -->

> **功能**：将 Local Shell MCP 服务的执行工具和会话工作区接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 将执行连接和工作区按会话组织，减少从 DSH 找到运行记录的跳转。

> **主要限制**：[Q02](#research-q02) 亲和头与格式检查不等于访问控制。凭据路由、共享 fallback 和首次并发需独立验证。

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
  - [Q01 · DSH 用户为什么用专用 bridge，而非通用 MCP？](#detail-section-11)
  - [Q02 · 会话亲和与浏览器凭据如何隔离？](#detail-section-12)
  - [Q03 · 如何受控评估、退出和验证附加价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个 DSH 会话的操作者希望使用已部署的 LSM 执行环境并查看活动。

通用 Streamable HTTP MCP 客户端加独立 LSM UI 可以完成基础工具调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 动态工具 | 注册上游工具 | 排除仅 App 项并拒 task required |
| 会话连接 | 转发到 LSM | 依赖上游亲和语义 |
| 工作区 | 查看会话活动 | 需真实凭据和授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22+ 与相容 DSH | 必需 | Host/client 加载 | 退回独立 LSM |
| LSM 服务与授权 | 必需 | 执行工具和工作区 | 检查 endpoint 和 token |
| 权限与网络隔离 | 试用必需 | 限制高权限执行 | 不开放工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员部署隔离 controller 和 profile | 先限测试目录 |
| 核对 | 用户测试工具与两会话归属 | 串线则禁用 |
| 退出 | 管理员移除 bridge 并清理远端状态 | 独立确认资源 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务资源未知 | 配置认证和目录 | 无需生产 worker |
| 持续 | 服务和网络费用未知 | 维护凭据和权限 | 按实际规模 |
| 失败 | 远端任务资源未知 | 处理重连与清理 | 不能只关 UI |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话组织 | 有亲和头与独立连接 | 真实隔离和恢复 |
| 执行可见 | 会话内工作区 | 远端 worker 成功率 |

> **思考**：[Q02](#research-q02) 亲和头与格式检查不等于访问控制。凭据路由、共享 fallback 和首次并发需独立验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将执行连接和工作区按会话组织，减少从 DSH 找到运行记录的跳转。

[Q02](#research-q02) 会话连接独立并可回收，注意非会话调用和凭据路由。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 亲和头与格式检查不等于访问控制。凭据路由、共享 fallback 和首次并发需独立验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先检查隔离会话归属与远端认证，再决定是否引入工具。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核 DSH bridge 接线。外层鉴权、真实宿主和远端 worker 尚未验收。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、dsh/index.js、dsh/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 DSH 包、Host 和 client 的代表路径；未审完整 Python controller、worker 或生产授权。
- 下一步：用隔离服务分别测试工具列表、两个会话、重连、权限、卸载和远端资源清理。

**分析版本**

- **仓库**：[fwerkor/local-shell-mcp](https://github.com/fwerkor/local-shell-mcp)
- **版本号**：6.0.0（[固定提交 cd29a63](https://github.com/fwerkor/local-shell-mcp/tree/cd29a63d15826b17edfd55352e5237e0612a3fb8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照通用 bridge 测重连找回与跨会话串线；没有改善则退出。

用隔离服务分别测试工具列表、两个会话、重连、权限、卸载和远端资源清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 487 | 57737 | — | — | 406250 |
| .js | source | 4 | 1460 | 1282 | 88 | — |
| .md | example | 1 | 34 | — | — | 307 |
| .mjs | test | 1 | 17 | 15 | 0 | — |
| .ts | source | 42 | 9960 | 9176 | 43 | — |
| .ts | test | 37 | 3812 | 3458 | 17 | — |
| .tsx | test | 5 | 630 | 578 | 6 | — |
| .tsx | source | 12 | 4831 | 4606 | 8 | — |
| .cjs | source | 1 | 20 | 18 | 0 | — |
| .cjs | test | 1 | 133 | 124 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/fwerkor/local-shell-mcp/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：专用 LSM bridge 相对通用 MCP 接入如何处理会话与执行工作区？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 用户为什么用专用 bridge，而非通用 MCP？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要共享 shell、文件和远程工作区的操作者，可在 DSH 会话中直接使用独立 LSM 服务。根 npm manifest 确实有 DSH Host/client 出口；补丁默认连接本机 HTTP 8765 端口，也可从环境提供 URL、Authorization 和浏览器入口。Host 分页收集 tools/list，以前缀规范化注册，排除仅 App 工具；转发时为 DSH session 选择独立 MCP client，任务型 required 工具在调用时拒绝，故“完整工具面”有例外。相对通用 MCP 的实质增量是会话亲和头和对话中的 Live Workspace，而 shell、浏览器和 worker 执行来自独立 LSM 服务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:163-169](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/README.md#L163-L169)

作者定位独立服务和 DSH npm bridge。

````text
The DSH bridge is published separately as `local-shell-mcp-dsh`. With a normal LSM HTTP/MCP service running on the same host, install the plugin into a DSH profile:

```bash
dsh plugin --profile web add local-shell-mcp-dsh
```

The bundle uses an LSM-aware Streamable HTTP bridge and keeps the complete LSM tool surface, including `remote_manage`, `remote_transfer`, browser tools, and Dynamic MCP tools. Each DSH Session receives a stable v4 logical-session identity, so its Logical Session, active run, Activity, and native **Live Workspace** view stay isolated from other DSH conversations and survive DSH-side MCP transport recreation. DSH sees model tools under the normal `mcp__lsm__*` namespace. The DSH npm package follows the same release version as LSM. Repository installs remain useful for development from a checkout.
````

**依据 2 · 源码核查**：[package.json:2-28](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/package.json#L2-L28)

Host/client 和 bundle manifest。

<details>
<summary>查看原文（27行）</summary>

```text
  "name": "local-shell-mcp-dsh",
  "version": "6.0.0",
  "description": "DeepSeek Harness bridge for the full local-shell-mcp tool surface and per-session Live Workspace.",
  "type": "module",
  "main": "./dsh/index.js",
  "exports": {
    ".": "./dsh/index.js",
    "./client": "./dsh/client.js",
    "./package.json": "./package.json"
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/fwerkor/local-shell-mcp.git"
  },
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "dsh-plugin",
    "mcp",
    "remote-worker"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:5-16](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/cordis.patch.yml#L5-L16)

实际服务与凭据配置。

<details>
<summary>查看原文（12行）</summary>

```text
-
  insert:
    - id: local-shell-mcp
      name: local-shell-mcp-dsh
      config:
        url: !!js process.env.DSH_LSM_MCP_URL ?? 'http://127.0.0.1:8765/mcp'
        browserUrl: !!js process.env.DSH_LSM_BROWSER_URL
        headers: !!js "process.env.DSH_LSM_AUTHORIZATION ? { Authorization: process.env.DSH_LSM_AUTHORIZATION } : {}"
        toolCallTimeoutMs: !!js Number(process.env.DSH_LSM_TOOL_CALL_TIMEOUT_MS ?? 120000)
        keepAliveIntervalMs: !!js Number(process.env.DSH_LSM_KEEPALIVE_INTERVAL_MS ?? 30000)
        reconnectInitialDelayMs: 500
        reconnectMaxDelayMs: 30000
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:153-164](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L153-L164)

分页发现。

<details>
<summary>查看原文（12行）</summary>

```text
async function listTools(client) {
  const tools = []
  let cursor
  do {
    const response = await client.request(
      { method: 'tools/list', ...(cursor === undefined ? {} : { params: { cursor } }) },
      ListToolsResultSchema,
    )
    tools.push(...response.tools)
    cursor = response.nextCursor
  } while (cursor)
  return tools
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:314-357](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L314-L357)

筛选、注册和按会话转发。

<details>
<summary>查看原文（44行）</summary>

```text
  async function syncTools(client) {
    const remoteTools = await listTools(client)
    const definitions = new Map()
    for (const tool of remoteTools) {
      if (appOnlyTool(tool)) continue
      const rawName = String(tool.name)
      const publicName = publicToolName(rawName)
      if (definitions.has(publicName)) {
        throw new Error(`local-shell-mcp-dsh: duplicate normalized tool name ${publicName}`)
      }
      definitions.set(publicName, {
        name: publicName,
        description: tool.description || '',
        parameters: tool.inputSchema,
        output: outputFor(rawName),
        execute: async (args, exec) => {
          if (tool.execution?.taskSupport === 'required') {
            throw new Error(`Tool "${rawName}" requires task-based execution, which this bridge does not support`)
          }
          const sessionId = exec.agent?.session?.id ? String(exec.agent.session.id) : '__unscoped__'
          const clientForSession = await sessionClient(sessionId)
          const result = await callRaw(clientForSession, rawName, args, {
            signal: exec.signal,
            timeout: config.toolCallTimeoutMs,
          })
          return normalizeToolResult(result, rawName)
        },
      })
    }

    for (const dispose of toolDisposers.values()) dispose()
    const next = new Map()
    try {
      for (const [publicName, definition] of definitions) {
        next.set(publicName, ctx.tools.register(definition))
      }
    } catch (error) {
      for (const dispose of next.values()) dispose()
      toolDisposers = new Map()
      throw error
    }
    toolDisposers = next
    updateInstructions(client)
    ctx.logger.info(`local-shell-mcp-dsh: synchronized ${next.size} LSM tools`)
```

</details>

#### 缺口

- 未发现真实服务工具及兼容清单
  **影响**：不能把注册规则当成远程工作流已运行
  **进一步探讨**：用单个测试服务核发现结果和 task-required 拒绝

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话亲和与浏览器凭据如何隔离？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

每个 DSH session ID 经 SHA-256 派生 affinity header，连接关闭或 session dispose 清理记录。没有 Agent session 时走共享 __unscoped__，因此不能把所有调用都描述成隔离。连接缓存先查询、await makeRoom 再写入，静态上不能保证同一 ID 的并发首次请求只建一条传输。Live Workspace 嵌入当前会话的 iframe，消息侧检查 event.source、同源和 session ID。凭据路由只在本处理器检查 session ID 形状，再调用上游重连并把 token 放入响应，未在此处理器看到请求人会话归属核对；是否由外层 Host 授权和远端 ownership 弥补需要独立验证，不能据此断言部署可越权。CSP、无缓存和源检查均不代替授权。

#### 证据与依据

**依据 1 · 源码核查**：[dsh/index.js:197-205](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L197-L205)

transport 和 affinity 头。

```text
  function transport(extraHeaders = {}) {
    return new StreamableHTTPClientTransport(new URL(config.url), {
      requestInit: { headers: { ...config.headers, ...extraHeaders } },
    })
  }

  function sessionAffinity(sessionId) {
    return `dsh-${createHash('sha256').update(`session\0${sessionId}`).digest('hex')}`
  }
```

**依据 2 · 源码核查**：[dsh/index.js:246-297](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L246-L297)

连接回收、并发入口及 dispose。

<details>
<summary>查看原文（52行）</summary>

```text
  async function closeSessionRecord(sessionId, record) {
    if (sessionRecordInUse(sessionId, record)) sessionConnections.delete(sessionId)
    let client = record.client
    if (!client && record.promise) {
      try { client = await record.promise } catch { return }
    }
    if (!client) return
    try { await client.close() } catch { /* already closed */ }
  }

  async function makeRoomForSession() {
    if (sessionConnections.size < MAX_SESSION_CONNECTIONS) return
    const candidates = [...sessionConnections.entries()]
      .filter(([sessionId]) => ctx.agents.get(sessionId) === undefined)
      .sort((a, b) => a[1].lastUsed - b[1].lastUsed)
    const victim = candidates[0]
    if (!victim) {
      throw new Error(`local-shell-mcp-dsh: ${MAX_SESSION_CONNECTIONS} live DSH sessions already own LSM connections`)
    }
    await closeSessionRecord(victim[0], victim[1])
  }

  async function sessionClient(sessionId) {
    if (!validSessionId(sessionId)) throw new Error('local-shell-mcp-dsh: invalid DSH session id')
    const existing = sessionConnections.get(sessionId)
    if (existing) {
      existing.lastUsed = Date.now()
      return await existing.promise
    }
    await makeRoomForSession()
    const record = { client: null, promise: null, lastUsed: Date.now() }
    const promise = connectClient(`session:${sessionId}`, () => {
      if (sessionRecordInUse(sessionId, record)) sessionConnections.delete(sessionId)
    }, undefined, {
      [SESSION_AFFINITY_HEADER]: sessionAffinity(sessionId),
    }).then((client) => {
      record.client = client
      return client
    }).catch((error) => {
      if (sessionRecordInUse(sessionId, record)) sessionConnections.delete(sessionId)
      throw error
    })
    record.promise = promise
    sessionConnections.set(sessionId, record)
    return await promise
  }

  ctx.on('session/disposed', (session) => {
    const sessionId = String(session.id)
    const record = sessionConnections.get(sessionId)
    if (record) void closeSessionRecord(sessionId, record)
  }, { global: true })
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:329-339](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L329-L339)

无 session 共享 fallback。

<details>
<summary>查看原文（11行）</summary>

```text
        execute: async (args, exec) => {
          if (tool.execution?.taskSupport === 'required') {
            throw new Error(`Tool "${rawName}" requires task-based execution, which this bridge does not support`)
          }
          const sessionId = exec.agent?.session?.id ? String(exec.agent.session.id) : '__unscoped__'
          const clientForSession = await sessionClient(sessionId)
          const result = await callRaw(clientForSession, rawName, args, {
            signal: exec.signal,
            timeout: config.toolCallTimeoutMs,
          })
          return normalizeToolResult(result, rawName)
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:414-440](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L414-L440)

凭据来源和返回数据。

<details>
<summary>查看原文（27行）</summary>

```text
  async function liveConfig(sessionId, query) {
    const client = await sessionClient(sessionId)
    const args = {
      machine: query.get('machine') || 'local',
      cwd: query.get('cwd') || '.',
      ...(query.get('live_id') ? { live_id: query.get('live_id') } : {}),
      ...(query.get('session_id') ? { session_id: query.get('session_id') } : {}),
    }
    const result = await callRaw(client, 'live_workspace_reconnect', args, {
      signal: AbortSignal.timeout(config.toolCallTimeoutMs),
      timeout: config.toolCallTimeoutMs,
    })
    if (result.isError === true) throw new Error(extractText(Array.isArray(result.content) ? result.content : [], 'live_workspace_reconnect'))
    const structured = result.structuredContent && typeof result.structuredContent === 'object'
      ? result.structuredContent
      : {}
    const hidden = result._meta?.['local-shell-mcp/live'] || {}
    const token = String(hidden.token || '')
    const apiBase = String(hidden.apiBase || structured.api_base || '')
    if (!token || !apiBase) throw new Error('local-shell-mcp-dsh: LSM did not return Live Workspace credentials')
    return {
      token,
      apiBase: config.browserUrl || apiBase,
      uiPath: String(hidden.uiPath || structured.ui_path || '/ui'),
      liveId: String(hidden.liveId || structured.live_id || ''),
      sessionId: String(structured.session_id || ''),
      machine: String(structured.machine || args.machine),
```

</details>

**依据 5 · 源码核查**：[dsh/index.js:475-497](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L475-L497)

凭据路由核 ID 格式但本处理器未核访问主体。

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: LIVE_CONFIG_PATH,
    handler: async (req, res) => {
      if (req.method !== 'GET') {
        res.writeHead(405, { allow: 'GET' })
        res.end()
        return
      }
      try {
        const requestUrl = new URL(req.url || LIVE_CONFIG_PATH, 'http://dsh.local')
        const sessionId = requestUrl.searchParams.get('session') || ''
        if (!validSessionId(sessionId)) {
          sendJson(res, 400, { ok: false, message: 'Invalid DSH session id' })
          return
        }
        const data = await liveConfig(sessionId, requestUrl.searchParams)
        sendJson(res, 200, { ok: true, data })
      } catch (error) {
        sendJson(res, 502, { ok: false, message: error instanceof Error ? error.message : String(error) })
      }
    },
  }), 'local-shell-mcp-dsh: Live Workspace credentials')
```

</details>

**依据 6 · 源码核查**：[dsh/client.js:14-38](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/client.js#L14-L38)

浏览器 prompt 消息约束。

<details>
<summary>查看原文（25行）</summary>

```text
      React.useEffect(() => {
        const onMessage = async (event) => {
          const frame = frameRef.current
          if (!frame || event.source !== frame.contentWindow || event.origin !== window.location.origin) return
          const data = event.data
          if (!data || data.type !== 'local-shell-mcp:dsh:prompt' || String(data.sessionId || '') !== String(sessionId)) return
          const requestId = String(data.requestId || '')
          try {
            await sendPrompt(String(data.text || ''))
            frame.contentWindow?.postMessage({
              type: 'local-shell-mcp:dsh:prompt-result',
              requestId,
              ok: true,
            }, window.location.origin)
          } catch (error) {
            frame.contentWindow?.postMessage({
              type: 'local-shell-mcp:dsh:prompt-result',
              requestId,
              ok: false,
              message: error instanceof Error ? error.message : String(error),
            }, window.location.origin)
          }
        }
        window.addEventListener('message', onMessage)
        return () => window.removeEventListener('message', onMessage)
```

</details>

#### 缺口

- 未查宿主路由外层或远端对不同账户的认证结果
  **影响**：不能确定多用户部署的隔离保障
  **进一步探讨**：在隔离 Host 用两个账号、同名和伪造 session ID 回放并核远端拒绝

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何受控评估、退出和验证附加价值？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

建议隔离本机 controller 和 DSH profile，限定无生产凭据目录与工具，先核工具列表和两个会话切换。桥需要 Node 22+、可达的 LSM 服务和运行授权，远程 worker、浏览器以及历史状态分别需独立核对。卸载/卸载时 effect 会清本地连接和工具；远端会话和资源是否删除不能由断开推出，应按服务策略处理。首次准备环境与权限，持续运维凭据、远端环境和工具目录，失败复查权限与 reconnect。可在同一测试服务对照通用 MCP 和专用 bridge，测会话串线、重连后状态找回与处置工时；若结果不改善或多用户权限核验不能通过，退回独立 LSM 界面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:143-169](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/README.md#L143-L169)

作者区分执行与工作区视图。

<details>
<summary>查看原文（27行）</summary>

````text
For full shell, filesystem, remote-worker, and Playwright tools, use ChatGPT Developer Mode or another full MCP client. ChatGPT is a client connection; choose and start a runtime first.

`session_manage` provides one durable logical task context for agent work. A Session is deliberately independent of machine and working directory: it stores the task objective, semantic progress reports, recent execution Activity, and an optional Plan. `session_id` is the only durable task identity. To continue work in another ChatGPT conversation, the user explicitly passes the existing `session_id`, and the new agent calls `session_manage(action="resume", session_id=...)`. Agents do not list or auto-select Sessions from other conversations. They should report the active `session_id` after start/resume, at meaningful progress checkpoints, and before ending a turn, while using `session_manage(action="report", session_id=...)` for semantic progress rather than copying every tool result into the summary. Ordinary tools receive the same task identity as `logical_session_id`.

When the client supports MCP Apps, `workspace_open(session_id=...)` opens the execution view for the explicitly selected Session as a floating MCP App and can expand to fullscreen. The v3 name `open_live_workspace` remains a hidden, non-enumerated compatibility alias for ChatGPT clients with a cached recipient; new integrations see and use only `workspace_open`. The Live Workspace is a reconnectable viewer and collaboration surface, not the owner of task state: closing it or reconnecting MCP does not discard Session progress, Activity, or its Plan. Ordinary MCP tools remain the execution API, while the app adds live operational activity, persistent terminals, file/diff inspection, jobs, remotes, audit data, and the active Session id. Clients that do not render MCP Apps continue to use the normal tool surface unchanged.

`plan_manage(session_id=...)` optionally enables **Goal mode** on that explicit Session for substantial multi-step work. An active Plan is the goal: its steps can be revised as execution changes and, while a Live Workspace is attached, the app can request continuation after 15 minutes without agent tool activity. Automatic continuation is capped at 10 continuation attempts (accepted or rejected) and resumes the same Session before continuing. Blocked, completed, and cancelled Plan statuses are never nudged; an active Plan whose steps are all completed or skipped remains eligible for cleanup continuation so a resumed agent can call `plan_manage(action="finish")`. A Session does not require a Plan.

1. Expose the server through HTTPS.
2. Keep OAuth enabled.
3. Add the MCP endpoint: `https://your-public-host.example.com/mcp`.
4. Complete the OAuth authorization flow.
5. Start with a bounded task and inspect the audit log when needed.

Read the dedicated [ChatGPT connector guide](https://fwerkor.github.io/local-shell-mcp/getting-started/chatgpt-connector/).

## DeepSeek Harness plugin

[![dsh.so install](https://www.dsh.so/badge/install/local-shell-mcp.svg)](https://www.dsh.so/artifact/local-shell-mcp)

The DSH bridge is published separately as `local-shell-mcp-dsh`. With a normal LSM HTTP/MCP service running on the same host, install the plugin into a DSH profile:

```bash
dsh plugin --profile web add local-shell-mcp-dsh
```

The bundle uses an LSM-aware Streamable HTTP bridge and keeps the complete LSM tool surface, including `remote_manage`, `remote_transfer`, browser tools, and Dynamic MCP tools. Each DSH Session receives a stable v4 logical-session identity, so its Logical Session, active run, Activity, and native **Live Workspace** view stay isolated from other DSH conversations and survive DSH-side MCP transport recreation. DSH sees model tools under the normal `mcp__lsm__*` namespace. The DSH npm package follows the same release version as LSM. Repository installs remain useful for development from a checkout.
````

</details>

**依据 2 · 源码核查**：[package.json:33-48](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/package.json#L33-L48)

运行及包文件边界。

<details>
<summary>查看原文（16行）</summary>

```text
      ],
      "platform": "web"
    },
    "category": "extension",
    "displayName": "Local Shell MCP",
    "image": "https://raw.githubusercontent.com/fwerkor/local-shell-mcp/main/docs/assets/logo.svg"
  },
  "dependencies": {
    "@modelcontextprotocol/sdk": "^1.30.0",
    "zod": "^4.4.3"
  },
  "engines": {
    "node": ">=22"
  },
  "files": [
    "cordis.patch.yml",
```

</details>

**依据 3 · 源码核查**：[dsh/index.js:222-239](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L222-L239)

ping 失败关连接。

<details>
<summary>查看原文（18行）</summary>

```text
    client.onclose = () => {
      stopKeepAlive()
      if (!disposed) onClose?.()
    }
    await client.connect(transport(extraHeaders))
    keepAliveTimer = setInterval(() => {
      if (disposed || keepAliveRunning) return
      keepAliveRunning = true
      void client.ping().catch((error) => {
        if (!disposed) ctx.logger.warn(`local-shell-mcp-dsh(${label}): keepalive failed: ${String(error)}`)
        stopKeepAlive()
        void client.close().catch(() => {})
      }).finally(() => {
        keepAliveRunning = false
      })
    }, config.keepAliveIntervalMs)
    keepAliveTimer.unref?.()
    return client
```

</details>

**依据 4 · 源码核查**：[dsh/index.js:499-516](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/index.js#L499-L516)

本地 effect 清理。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => async () => {
    disposed = true
    if (catalogReconnectTimer) clearTimeout(catalogReconnectTimer)
    catalogReconnectTimer = null
    promptDisposer?.()
    promptDisposer = null
    for (const dispose of toolDisposers.values()) dispose()
    toolDisposers = new Map()
    const currentCatalog = catalog
    catalog = null
    if (currentCatalog) {
      try { await currentCatalog.close() } catch { /* already closed */ }
    }
    const records = [...sessionConnections.entries()]
    sessionConnections.clear()
    await Promise.allSettled(records.map(async ([, record]) => {
      let client = record.client
      if (!client) {
```

</details>

**依据 5 · 源码核查**：[dsh/client.js:78-92](https://github.com/fwerkor/local-shell-mcp/blob/cd29a63d15826b17edfd55352e5237e0612a3fb8/dsh/client.js#L78-L92)

对话视图和会话 scope。

<details>
<summary>查看原文（15行）</summary>

```text
    function apply(ctx) {
      ctx.slots.inject('conversation.view', () => ctx.slots.register({
        name: 'conversation.view',
        id: 'lsm-live-workspace',
        order: 20,
        label: 'Live Workspace',
        inject: (sessionId) => ({
          sendPrompt: async (text) => {
            if (!text.trim()) return
            const scoped = ctx.sessions.scope(sessionId)
            if (!scoped) throw new Error(`DSH session "${String(sessionId)}" is unavailable`)
            await scoped.conversation.send(text)
          },
        }),
      }, LiveWorkspaceView))
```

</details>

#### 缺口

- 没有 DSH/LSM 运行、耗时和远端清理结果
  **影响**：无法确认恢复与持续运维成本
  **进一步探讨**：在隔离环境断开、重连、卸载并检查 UI 与服务端资源

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
