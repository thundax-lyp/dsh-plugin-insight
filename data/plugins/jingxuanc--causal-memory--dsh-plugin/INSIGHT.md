# causal-memory DSH plugin

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[b05d671](https://github.com/JingxuanC/causal-memory/tree/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 104](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=104&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/JingxuanC/causal-memory)
<!-- END META -->

> **功能**：通过 stdio MCP 将 causal-memory 工具和服务接入 DSH。

> **亮点**：[Q01](#research-q01) 将因果记忆能力暴露给模型和其他宿主插件。

> **主要限制**：[Q02](#research-q02) 超时不决定写入结果，子进程环境需要隔离。

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
  - [Q01 · 子插件怎样让 DSH 使用因果记忆？](#detail-section-11)
  - [Q02 · 取消或超时能说明写入已停止吗？](#detail-section-12)
  - [Q03 · 怎样隔离试用与退出？](#detail-section-13)
  - [Q04 · 怎样减少超时重试造成的重复记忆？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要复查历史决策、事实和结果的 DSH 用户。

手工回查旧会话或单独使用记忆客户端。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 工具 | 记忆记录与查回 | 二进制实际能力 |
| 服务 | 向其他插件提供调用 | 握手后可用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 必需 | 注册工具和服务 | 使用独立客户端 |
| 固定二进制及数据库 | 必需 | 提供记忆 | 停止试用 |
| LLM 与 Embedding | 按需 | 启用模型路径 | 规则回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 清洁环境和测试库 | 记录二进制 |
| 验证 | 写入、查询和超时 | 核对数据库 |
| 退出 | 停用并检查子进程 | 清理测试库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地资源未知 | 准备二进制与测试库 | 未测 |
| 持续 | 可选模型费用未知 | 复核来源和重复 | 按配置 |
| 退出 | 备份成本未知 | 检查数据库保留 | 实际验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 决策复查 | 工具与服务入口 | 真实因果质量 |
| 持久化 | 数据库配置 | 超时提交状态 |

> **思考**：[Q02](#research-q02) 超时不决定写入结果，子进程环境需要隔离。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将因果记忆能力暴露给模型和其他宿主插件。

[Q02](#research-q02) 将超时标为结果未知。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 超时不决定写入结果，子进程环境需要隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 用临时数据库。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包代表代码，未执行。

- 已检查：作者 README、包清单、源码路径 dsh-plugin/README.md、dsh-plugin/index.js 及固定范围 inventory；组件：dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 dsh-plugin 子包。
- 下一步：验证握手、工具读写、超时和停用。

**分析版本**

- **仓库**：[JingxuanC/causal-memory](https://github.com/JingxuanC/causal-memory)
- **版本号**：1.0.0（[固定提交 b05d671](https://github.com/JingxuanC/causal-memory/tree/b05d671fc45d1f73c99c36a58f05c0bdd673cb88)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 操作 ID 与结果读回可改善超时恢复。

验证握手、工具读写、超时和停用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 425 | 285 | 116 | — |
| .md | source | 1 | 103 | — | — | 896 |
| .js | test | 1 | 15 | 1 | 13 | — |
| .mjs | test | 1 | 322 | 259 | 23 | — |

</details>

**活跃度**

[![Issue 未关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+created%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/JingxuanC/causal-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T04%3A31%3A11.152Z..2026-11-05T04%3A31%3A11.152Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：因果记忆子插件如何接入工具及处理超时？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 子插件怎样让 DSH 使用因果记忆？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

希望在后续任务回看决策和结果的用户，可由插件启动二进制，经 stdio MCP 握手、动态发现并注册工具。插件还在握手后提供 ctx.causalMemory 给其他插件。与手工翻阅旧会话相比，宿主可统一调用已记录的事实和决策；因果质量依赖服务端与记录质量。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:74-96](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L74-L96)

启动并解析 stdio

<details>
<summary>查看原文（23行）</summary>

```text
 * Minimal newline-delimited JSON-RPC client over a child's stdio.
 * Handles requests (id) and ignores notifications. Resolves on `result`,
 * rejects on `error` or timeout.
 */
function createMcpClient(command, env, timeoutMs) {
  const child = spawn(command, [], {
    stdio: ['pipe', 'pipe', 'pipe'],
    env,
  })

  let buf = ''
  const pending = new Map()
  let seq = 0

  child.stdout.on('data', (d) => {
    buf += d.toString()
    let idx
    while ((idx = buf.indexOf('\n')) >= 0) {
      const line = buf.slice(0, idx).trim()
      buf = buf.slice(idx + 1)
      if (!line) continue
      let msg
      try { msg = JSON.parse(line) } catch { continue }
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/index.js:124-139](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L124-L139)

握手及动态发现

<details>
<summary>查看原文（16行）</summary>

```text
  return {
    child,
    /** Resolve the MCP handshake and return the discovered tool list. */
    async connect() {
      await rpc('initialize', {
        protocolVersion: '2025-03-26',
        capabilities: {},
        clientInfo: { name: 'dsh-causal-memory-plugin', version: '1.0.0' },
      })
      notify('notifications/initialized')
      const list = await rpc('tools/list', {})
      return list.tools ?? []
    },
    async call(toolName, args, signal) {
      if (signal?.aborted) throw new Error(`causal-memory: ${toolName} aborted before call`)
      const result = await rpc('tools/call', { name: toolName, arguments: args ?? {} })
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/index.js:363-383](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L363-L383)

工具过滤和注册

<details>
<summary>查看原文（21行）</summary>

```text
  // Discover tools; activation blocks until this settles.
  let tools
  try {
    tools = await client.connect()
  } catch (error) {
    ctx.logger.error(`causal-memory: connection or tool discovery failed: ${error.message}`
      + ' — install the binary with `pip install causal-memory` (or `cargo build --release`'
      + ' in the causal-memory repo), or point config.command / CAUSAL_MEMORY_BIN at it')
    if (failOnStartupError) throw error
    return // failOnStartupError: false — activated with the prompt section but no tools
  }

  const selected = tools.filter((tool) => !exclude.has(tool.name))
  ctx.logger.info(`causal-memory: discovered ${tools.length} tools, registering ${selected.length} (${toolNames(selected)})`)

  for (const tool of selected) {
    const definition = {
      name: tool.name,
      description: tool.description ?? '',
      parameters: tool.inputSchema ?? { type: 'object', properties: {} },
      // Current dsh tool API: a mandatory canonical output contract. The
```

</details>

**依据 4 · 源码核查**：[dsh-plugin/index.js:402-423](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L402-L423)

执行与服务接口

<details>
<summary>查看原文（22行）</summary>

```text
      execute: async (args, exec) => {
        const text = await client.call(tool.name, args, exec?.signal)
        return { content: [{ type: 'text', text }] }
      },
    }
    disposers.push(ctx.tools.register(definition))
  }

  // Programmatic seam: publish `ctx.causalMemory` for other plugins (goal-guard
  // recalls on compaction completion). Three deliberate properties:
  //   - only after the handshake above succeeded, so a dead child is never
  //     advertised (failOnStartupError:false returned long before this line);
  //   - inside `ctx.effect`, i.e. the same fiber scope as the tools, so unload
  //     unregisters the service together with them (ctx.provide is itself
  //     fiber-scoped; the explicit effect keeps the owner unambiguous);
  //   - failure to publish is logged, never thrown — a duplicate name must not
  //     take the whole plugin (and therefore the session) down.
  try {
    const service = createCausalMemoryService((tool, args, signal) => client.call(tool, args, signal))
    ctx.effect(() => ctx.provide(SERVICE_NAME, service), `ctx.provide(${JSON.stringify(SERVICE_NAME)})`)
  } catch (error) {
    ctx.logger.warn(`causal-memory: could not publish ctx.${SERVICE_NAME}: ${error.message}`)
```

</details>

**依据 5 · 作者声明**：[dsh-plugin/README.md:78-86](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/README.md#L78-L86)

作者列出能力

```text
## 工具清单（17 个）

`record_decision` · `record_fact` · `remember` · `search_causal` ·
`search_facts` · `search_memory` · `search_patterns` · `causal_directory` ·
`trace_cause` · `trace_cause_chain` · `intervention_query` ·
`counterfactual_query` · `prediction_report` · `invalidate_decision` ·
`invalidate_pattern` · `resolve_updates` · `reconstruct_lesson`

（工具列表运行时从服务端动态发现，服务端升级后无需改插件。）
```

#### 缺口

- 未运行固定二进制
  **影响**：不能确认工具兼容或实际因果质量
  **进一步探讨**：用独立数据库写合成决策再查回

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 取消或超时能说明写入已停止吗？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

超时仅从 pending 删除并拒绝当前 Promise，调用只检查传入信号是否已经 aborted，没有等待期间的取消转发。因此客户端超时或后续取消时，服务端写入状态可能未知。子进程继承整个环境并以配置字符串覆盖，必须单独审查启动环境及模型凭据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:104-117](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L104-L117)

等待超时不发送取消

<details>
<summary>查看原文（14行）</summary>

```text
  const rpc = (method, params = {}) => {
    const id = ++seq
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`causal-memory: timeout on ${method}`))
      }, timeoutMs)
      pending.set(id, (msg) => {
        clearTimeout(timer)
        if (msg.error) reject(new Error(msg.error.message ?? 'causal-memory rpc error'))
        else resolve(msg.result)
      })
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
    })
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/index.js:137-149](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L137-L149)

仅发送前检查信号和卸载 kill

<details>
<summary>查看原文（13行）</summary>

```text
    async call(toolName, args, signal) {
      if (signal?.aborted) throw new Error(`causal-memory: ${toolName} aborted before call`)
      const result = await rpc('tools/call', { name: toolName, arguments: args ?? {} })
      const text = (result.content ?? [])
        .filter((block) => block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n')
      if (result.isError === true) throw new Error(text || `causal-memory tool ${toolName} failed`)
      return text
    },
    dispose() {
      try { child.kill() } catch { /* already gone */ }
    },
```

</details>

**依据 3 · 源码核查**：[dsh-plugin/index.js:284-308](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L284-L308)

环境合并与释放

<details>
<summary>查看原文（25行）</summary>

```text
  const configEnv = config.env && typeof config.env === 'object' && !Array.isArray(config.env)
    ? config.env
    : {}
  const envFromConfig = Object.fromEntries(
    Object.entries(configEnv)
      .filter(([, value]) => typeof value === 'string' && value.length > 0),
  )
  const droppedEnvKeys = Object.keys(configEnv).filter((key) => !(key in envFromConfig))
  if (droppedEnvKeys.length > 0) {
    ctx.logger.warn(`causal-memory: ignored non-string config.env value(s): ${droppedEnvKeys.join(', ')}`)
  }
  const childEnv = { ...process.env, ...envFromConfig, CAUSAL_MEMORY_DB: dbPath }

  // Test seam: `createClient` lets a unit test run `apply` against a fake
  // child. It has no YAML representation, so production callers never set it.
  const makeClient = typeof config.createClient === 'function' ? config.createClient : createMcpClient
  const client = makeClient(command, childEnv, timeoutMs)

  // Cleanup: kill the child and unregister tools when this plugin unloads.
  const disposers = []
  ctx.effect(() => {
    return () => {
      for (const dispose of disposers) dispose()
      client.dispose()
    }
```

</details>

#### 缺口

- 未验证服务端写入事务或去重
  **影响**：不能确认超时后是否写入
  **进一步探讨**：用会在客户端超时后落库的测试端验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样隔离试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

配置固定来源的 causal-memory 二进制和临时数据库，使用清洁测试环境先验证规则路径。模型能力可选且作者称部分功能会静默回退，评估时记录实际请求与输出差异。禁用插件后核对进程和数据库保留，独立处理数据。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin/README.md:7-24](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/README.md#L7-L24)

作者列出二进制来源

<details>
<summary>查看原文（18行）</summary>

````text
## 前置：causal-memory 二进制

插件按 DSH 惯例解析服务端二进制（不写死路径），四选一：

1. **pip 安装（推荐，无需 Rust 工具链）**：
   ```bash
   pip install causal-memory
   ```
   会把 `causal-memory` 命令装到 PATH 上，插件自动解析到它。
2. **下载预编译二进制**：从 [GitHub Releases](https://github.com/JingxuanC/causal-memory/releases)
   下载对应平台（Windows / macOS / Linux × x64 / arm64）的压缩包，解压后把
   `causal-memory` 放到 PATH 上（如 `~/bin` 或 `/usr/local/bin`）。
3. **本仓库开发构建**（克隆到任意位置即可）：
   ```bash
   cargo build --release --bin causal-memory
   ```
   插件会自动找到 `<仓库>/target/release/causal-memory`。
4. **显式指定**：`config.command` 配置项或 `CAUSAL_MEMORY_BIN` 环境变量。
````

</details>

**依据 2 · 作者声明**：[dsh-plugin/README.md:50-76](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/README.md#L50-L76)

数据库、超时与回退

<details>
<summary>查看原文（27行）</summary>

````text
## 配置（可选，均省略时有合理默认）

| 字段 | 默认 | 说明 |
|---|---|---|
| `command` | 自动解析 | 二进制路径：`config.command` → `CAUSAL_MEMORY_BIN` → 仓库 `target/release` → PATH 裸名 |
| `dbPath` | `~/.local/share/causal-memory/causal.db` | SQLite 路径（或 `CAUSAL_MEMORY_DB`） |
| `toolCallTimeoutMs` | `60000` | 单次工具调用超时 |
| `exclude` | `[]` | 不挂载的工具名数组 |
| `failOnStartupError` | `true` | 启动连接失败时是否让插件激活失败（默认失败并附安装提示；显式设 `false` 则降级为仅记日志） |
| `env` | `{}` | 透传给服务端子进程的额外环境变量（优先级高于当前环境）。非字符串值会被丢弃并记一条 warn，因此 `!!js` 表达式算出 `undefined` 不会毒死子进程 |

### 用 `env` 打开 LLM 能力（可选）

服务端从环境变量读 LLM / Embed 配置。缺了它，依赖 LLM 的工具会**静默降级**成规则回退——`resolve_updates`、`reconstruct_lesson` 的叙事与 calibrate、以及 `remember` 的自动抽取都会被影响：

```yaml
    - id: causal-memory-plugin
      name: causal-memory-dsh-plugin
      config:
        env:
          # 注意：此值是 base URL，源码会自行追加 /chat/completions
          CAUSAL_MEMORY_LLM_API: https://api.deepseek.com/v1
          CAUSAL_MEMORY_LLM_KEY: !!js process.env.DEEPSEEK_API_KEY || ''
          CAUSAL_MEMORY_LLM_MODEL: deepseek-chat
```

⚠️ `CAUSAL_MEMORY_LLM_API` 必须填 **base**（`https://api.deepseek.com/v1`）。填成完整路径 `.../v1/chat/completions` 会被再拼一次，得到 `.../chat/completions/chat/completions` → 404，而工具**不会报错**，只会悄悄退回规则路径。密钥建议走环境变量或 vault，不要明文写进本文件。
````

</details>

**依据 3 · 源码核查**：[dsh-plugin/index.js:295-309](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L295-L309)

连接释放

<details>
<summary>查看原文（15行）</summary>

```text
  const childEnv = { ...process.env, ...envFromConfig, CAUSAL_MEMORY_DB: dbPath }

  // Test seam: `createClient` lets a unit test run `apply` against a fake
  // child. It has no YAML representation, so production callers never set it.
  const makeClient = typeof config.createClient === 'function' ? config.createClient : createMcpClient
  const client = makeClient(command, childEnv, timeoutMs)

  // Cleanup: kill the child and unregister tools when this plugin unloads.
  const disposers = []
  ctx.effect(() => {
    return () => {
      for (const dispose of disposers) dispose()
      client.dispose()
    }
  }, 'causal-memory.connection')
```

</details>

#### 缺口

- 未试安装、推理和卸载
  **影响**：性能与外部模型费用未知
  **进一步探讨**：临时库核对写入和只读，隔离模型配置

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样减少超时重试造成的重复记忆？

**研究主题**：新假设与验证

#### 完整回答

对照当前客户端仅报告超时，可在服务端支持时试验持久操作 ID 和按 ID 核对结果。模拟已提交但响应丢失、未提交和延迟提交，比较重复条目与恢复时长。若重复不降或无法可靠读回则调整方案。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin/index.js:104-117](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L104-L117)

现有超时边界

<details>
<summary>查看原文（14行）</summary>

```text
  const rpc = (method, params = {}) => {
    const id = ++seq
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id)
        reject(new Error(`causal-memory: timeout on ${method}`))
      }, timeoutMs)
      pending.set(id, (msg) => {
        clearTimeout(timer)
        if (msg.error) reject(new Error(msg.error.message ?? 'causal-memory rpc error'))
        else resolve(msg.result)
      })
      child.stdin.write(JSON.stringify({ jsonrpc: '2.0', id, method, params }) + '\n')
    })
```

</details>

**依据 2 · 源码核查**：[dsh-plugin/index.js:137-144](https://github.com/JingxuanC/causal-memory/blob/b05d671fc45d1f73c99c36a58f05c0bdd673cb88/dsh-plugin/index.js#L137-L144)

当前工具请求结构

```text
    async call(toolName, args, signal) {
      if (signal?.aborted) throw new Error(`causal-memory: ${toolName} aborted before call`)
      const result = await rpc('tools/call', { name: toolName, arguments: args ?? {} })
      const text = (result.content ?? [])
        .filter((block) => block.type === 'text' && typeof block.text === 'string')
        .map((block) => block.text)
        .join('\n')
      if (result.isError === true) throw new Error(text || `causal-memory tool ${toolName} failed`)
```

#### 缺口

- 服务端是否支持幂等 ID 待查
  **影响**：方案可能要求协议变更
  **进一步探讨**：先验证接口及延迟写入

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
