# dsh-butler-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0f64e0c](https://github.com/AndyYang12345/dsh-butler-memory/tree/0f64e0cf0420d0461fef2d49c2d6752faebc0562)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：历史 DSH Bundle：接 Butler Memory MCP agent 工具及 Web 用户记忆审阅面板，作者已停止维护。

> **核心亮点**：相对仅模型工具示例，增加 DSH Web 记忆/候选可视界面和 RPC 桥；记忆存储与策略归上游。详见[Q02](#research-q02)。

> **风险与缺陷**：桥 Promise.race 超时不清 pending，dispose 回调未绑定 this，候选操作无显式 owner/revision；真实影响需宿主验证。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 这个已停维护插件当初要交付什么？](#detail-section-11)
  - [Q02 · Agent、Web 面板、MCP 桥和技能如何连接？](#detail-section-12)
  - [Q03 · 桥进程、超时及审核边界有哪些缺口？](#detail-section-13)
  - [Q04 · 部署和保持兼容需要哪些组件？](#detail-section-14)
  - [Q05 · 当下怎样使用或迁移这份历史参考？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：让 agent 跨会话记忆，并让用户查看/决定候选及修订。

官方 MCP 记忆示例、独立 Butler 服务界面；本包给 DSH Web 增加可视入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| MCP agent | 写读记忆 | 上游服务依赖 |
| Web 面板 | 用户看/审 | 旧 DSH 契约 |
| Host bridge | RPC 转发 | 超时和清理问题 |
| Skill | 操作指引 | 运行时复制有副作用 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| 当前 DSH MCP/Client RPC | 集成 | 工具/面板不可用 |
| butler-memory-mcp 与数据库 | 数据源 | 离线/无召回 |
| 凭据与身份策略 | 候选审核 | 权限风险 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 核版本 | 固定 DSH/服务 | 插件可加载 |
| 核数据 | A 写 B 读及修订 | owner/revision 正确 |
| 核故障 | 杀桥、超时、重开 | 无僵进程/重复写 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 部署 | pip MCP、数据库、凭据、Node/DSH | 现行兼容 |
| 运行 | Agent 与面板双 stdio 桥 | 内存与恢复 |
| 迁移 | 审身份、revision/audit 与备份 | 数据一致性 |

| 结果 | 当前材料 | 未证实 |
| --- | --- | --- |
| Agent 工具 | patch 启 MCP client | 当前 DSH 可用 |
| 面板 | Client 与 RPC 路由 | 强审核保证 |
| 降级 | 错误分支及作者描述 | 故障实测 |

> **思考**：桥 Promise.race 超时不清 pending，dispose 回调未绑定 this，候选操作无显式 owner/revision；真实影响需宿主验证。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对仅模型工具示例，增加 DSH Web 记忆/候选可视界面和 RPC 桥；记忆存储与策略归上游。详见[Q02](#research-q02)。

相对仅模型工具示例，增加 DSH Web 记忆/候选可视界面和 RPC 桥；记忆存储与策略归上游。详见[Q02](#research-q02)。

Host 双通道与懒启动桥；Promise.race 超时未删 pending；生命周期 effect 返回未绑定 dispose。候选接受/拒绝仅传 ID，约束委托上游。

<a id="detail-section-5"></a>

### 1.4 主要限制

桥 Promise.race 超时不清 pending，dispose 回调未绑定 this，候选操作无显式 owner/revision；真实影响需宿主验证。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

只作为历史参考；存量实例先隔离验权限、修订、崩溃/超时恢复和当前 DSH 契约。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代码支持历史接入形态；上游审核保障未在插件内实现，当前 DSH 兼容未验证且作者弃维护。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、host/index.js、client/src/MemoryPanel.tsx、client/src/hostClient.ts、skills/butler-memory/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交 README、Bundle patch、Host、Client、包及技能路径；未执行宿主、MCP 或 DB。
- 下一步：隔离版本矩阵和数据库样本验证写读/候选/审计、RPC 权限、桥超时/崩溃恢复；不把旧报告当现行验收。

**分析版本**

- **仓库**：[AndyYang12345/dsh-butler-memory](https://github.com/AndyYang12345/dsh-butler-memory)
- **版本号**：0.1.5（[固定提交 0f64e0c](https://github.com/AndyYang12345/dsh-butler-memory/tree/0f64e0cf0420d0461fef2d49c2d6752faebc0562)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

共享受监督桥、超时清理和带版本候选决策可改善生命周期及审核闭环；未实现。详见[Q05](#research-q05)。

隔离版本矩阵和数据库样本验证写读/候选/审计、RPC 权限、桥超时/崩溃恢复；不把旧报告当现行验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 65 | 36 | 24 | — |
| .ts | source | 1 | 30 | 22 | 5 | — |
| .tsx | source | 2 | 566 | 516 | 29 | — |
| .md | source | 4 | 309 | — | — | 3198 |
| .js | source | 1 | 362 | 302 | 33 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AndyYang12345/dsh-butler-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AndyYang12345/dsh-butler-memory/issues?q=is%3Aissue+created%3A2026-09-22T05%3A45%3A09.540Z..2026-10-22T05%3A45%3A09.540Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AndyYang12345/dsh-butler-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A45%3A09.540Z..2026-10-22T05%3A45%3A09.540Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**将弃维护 DSH 记忆接入插件的现存机制与上游语义、生命周期风险分开。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个已停维护插件当初要交付什么？

**研究主题：**场景与需求

#### 完整回答

作者明确标记 DSH 接入插件已停止维护，保留作历史参考。它原意同时提供 agent 的 Butler Memory MCP 工具和 Web 中用户可查、可审的记忆面板。合格结果是跨会话写入/召回、显示真实记忆与修订、候选接受/拒绝有上游 owner/revision/audit 保护；但这些语义主要由独立 butler-memory-mcp 服务实现，插件只负责连接与 UI。现在不宜将旧兼容性当现行可用承诺。基线是官方 MCP 记忆示例/独立服务界面。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L3-L12)

作者停止维护声明。

<details>
<summary>查看原文（10行）</summary>

```text
> [!WARNING]
> **Deprecated — this DSH integration plugin is no longer maintained.**
> DSH changes rapidly, and this plugin is not being updated to follow newer
> releases. The compatibility notes below describe the versions that were tested
> at the time; they are not a promise of compatibility with current DSH. This
> repository remains available as a historical reference.
>
> **已停止维护：仅限这个 DSH 接入插件。** 由于 DSH 上游更新较快，本插件不再跟进新版；
> 下文的安装与兼容性记录仅代表当时的测试结果。此声明**不适用于**独立的
> `ai-butler-framework` 或 `butler-memory-mcp` 项目。
```

</details>

**依据 2 · 作者声明**：[README.md:17-42](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L17-L42)

原目标与双通道。

<details>
<summary>查看原文（26行）</summary>

````text
> **DeepSeek Harness 的长期记忆：agent 能用，你也能看见。** 一个组合包同时打通
> 两条通道：模型获得 `mcp__butler__memory_*` 工具；Web 会话头部出现"记忆"按钮，
> 面板可查看记忆、敏感度徽章、修订历史与待决候选——写入依然绑定 owner/revision/
> audit，绝不静默入库。

DSH 组合包：把 [butler-memory-mcp](https://github.com/AndyYang12345/butler-memory-mcp) 的记忆能力接进 DeepSeek
Harness 的两条通道——

1. **给 agent**：声明一个 `dsh-mcp-client` 实例，spawn `ai-butler-memory-mcp`，
   模型获得 `mcp__butler__memory_*` 工具；
2. **给用户**：一个 Web 端"记忆"面板（会话头部按钮 + 对话框），可查看长期
   记忆、敏感度/类别徽章、修订时间线、推断候选并接受/拒绝，含**服务健康
   状态**与离线时的**分步安装指引**——语义移植自
   ai-butler-framework 的 `web/index.html` 记忆面板。

```text
DSH agent ──mcp__butler__memory_*──► butler-memory-mcp (stdio, DSH 托管)
DSH web 面板 ──host.call──► host 半部 ──JSON-RPC──► butler-memory-mcp (stdio, 插件托管)
```

**零手动运行**：两条通道都由 DSH/插件自动 spawn 子进程（崩溃后自动重启），
不需要你手动启动任何服务。

**优雅降级**：记忆桥缺失或未配置时（未装 pip 包、env 未配、数据库不可达），
`dsh web` 照常启动、普通对话不受影响——记忆工具暂时缺席，面板显示离线
状态与安装指引，修复后即恢复。
````

</details>

**依据 3 · 作者声明**：[README.md:98-113](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L98-L113)

作者兼容记录和对照。

<details>
<summary>查看原文（16行）</summary>

```text
## 与官方示例的差异（本插件卖点）

官方 `examples/mcp-memory` 只提供模型工具，**没有用户可视界面**。本组合包把
butler 的"用户可看、可审、可撤销"面板带到 DSH，且写入依然绑定框架的
owner/revision/audit 语义。

## 兼容性验证记录（dsh 0.1.0-rc.6 实测）

- `ctx.inject(['connection'])` + `ctx.connection.rpc.handle` 静态插件 RPC
  契约（对齐官方 dsh-api-gateway 用法）；
- Slot 注册：`ctx.slots.inject(key, () => ctx.slots.register({name, id,
  order}, Component))`，与官方 dsh-client-ui-jobs 同槽位实测；
- 客户端 bundle 采用模块表契约（`__ModuleLoader__` + CJS 工厂，React 由
  页面提供）；
- MCP 协议 2025-11-25 握手、headless agent 工具调用、面板 RPC 通道、
  桥崩溃自动重启均已在真实实例验证。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Agent、Web 面板、MCP 桥和技能如何连接？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

cordis.patch.yml 声明 dsh-mcp-client 来 spawn 外部 ai-butler-memory-mcp 给 agent，并再装本包 host。Host 为面板另起一个 stdio MCP 子进程，接 /butler-memory RPC 并把 memory/list/search/revisions/candidates/accept/reject 映射到 tools/call；设置 BUTLER_MEMORY_PANEL_URL 切到 HTTP。Client 通过 RPC 展示列表、敏感度、修订与候选按钮。激活时还把技能文件复制到 DSH_HOME。相对只有 agent 工具的示例，增量是把用户可视审阅界面接进 DSH，但记忆存储、审核约束与语义属于上游服务。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:14-24](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/cordis.patch.yml#L14-L24)

双实例注入。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: mcp-butler-memory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: butler
        transport: stdio
        command: ai-butler-memory-mcp
        args: [--transport, stdio]

    - id: butler-memory-panel
      name: dsh-butler-memory
```

</details>

**依据 2 · 源码核查**：[host/index.js:34-58](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L34-L58)

技能复制。

<details>
<summary>查看原文（25行）</summary>

```text
function ensureSkillInstalled() {
  try {
    const source = fileURLToPath(
      new URL('../skills/butler-memory/SKILL.md', import.meta.url),
    )
    const skillDir = join(
      process.env.DSH_HOME || join(homedir(), '.dsh'),
      'skills',
      'butler-memory',
    )
    const target = join(skillDir, 'SKILL.md')
    const upToDate =
      existsSync(target) && readFileSync(target).equals(readFileSync(source))
    if (!upToDate) {
      mkdirSync(skillDir, { recursive: true })
      copyFileSync(source, target)
    }
  } catch (cause) {
    // Skill installation is an enhancement: never break the plugin over it.
    console.warn(
      '[dsh-butler-memory] could not install the butler-memory skill:',
      cause instanceof Error ? cause.message : cause,
    )
  }
}
```

</details>

**依据 3 · 源码核查**：[host/index.js:150-209](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L150-L209)

stdio 桥启动与调用。

<details>
<summary>查看原文（60行）</summary>

```text
  async _start() {
    this._failAll('bridge restarting')
    const child = spawn(this.command, ['--transport', 'stdio'], {
      stdio: ['pipe', 'pipe', 'pipe'],
      env: process.env,
    })
    this.child = child
    child.stderr.on('data', (chunk) => {
      process.stderr.write(`[dsh-butler-memory bridge] ${chunk}`)
    })
    child.on('error', (error) => {
      this.healthy = false
      this._failAll(`bridge spawn failed: ${error.message}`)
    })
    child.on('exit', () => {
      this.healthy = false
      this.child = null
      this._failAll('bridge exited; it will restart on the next call')
    })
    const lines = createInterface({ input: child.stdout })
    lines.on('line', (line) => this._handleLine(line))

    const init = new Promise((resolve, reject) => {
      this.pending.set(INIT_ID, { resolve, reject })
      this._write({
        jsonrpc: '2.0',
        id: INIT_ID,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'dsh-butler-memory', version: '0.1.2' },
        },
      })
    })
    const timeout = new Promise((_, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              'bridge handshake timed out; is ai-butler-memory-mcp on PATH?',
            ),
          ),
        HANDSHAKE_TIMEOUT_MS,
      )
    })
    return Promise.race([init, timeout])
  }

  async call(tool, payload, timeoutMs = CALL_TIMEOUT_MS) {
    await this.ensureStarted()
    const id = String(this.nextId++)
    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this._write({
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name: tool, arguments: payload ?? {} },
      })
```

</details>

**依据 4 · 源码核查**：[host/index.js:286-356](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L286-L356)

RPC 到 MCP/HTTP 路由。

<details>
<summary>查看原文（71行）</summary>

```text
function stdioEndpoints(bridge) {
  return {
    'memory/health': async () => {
      try {
        await bridge.ensureStarted()
        return { ok: bridge.healthy }
      } catch {
        return { ok: false }
      }
    },
    'memory/list': (payload = {}) => bridge.call('memory_list', payload),
    'memory/search': (payload = {}) => bridge.call('memory_search', payload),
    // The panel speaks camelCase (memoryId, candidateId) while the MCP
    // tools take snake_case (memory_id, candidate_id): map explicitly.
    'memory/revisions': (payload = {}) =>
      bridge.call('memory_revisions', { memory_id: payload.memoryId }),
    'memory/candidates': (payload = {}) =>
      bridge.call('memory_candidates', payload),
    'memory/candidates/accept': (payload = {}) =>
      bridge.call('memory_candidate_accept', { candidate_id: payload.candidateId }),
    'memory/candidates/reject': (payload = {}) =>
      bridge.call('memory_candidate_reject', { candidate_id: payload.candidateId }),
  }
}

// ── plugin body ───────────────────────────────────────────────────────────

export function apply(ctx) {
  ensureSkillInstalled()

  const panelUrl = process.env.BUTLER_MEMORY_PANEL_URL
  const bridge =
    panelUrl === undefined
      ? new StdioBridge(
          process.env.AI_BUTLER_MEMORY_MCP_COMMAND || 'ai-butler-memory-mcp',
        )
      : null
  const endpoints = bridge !== null ? stdioEndpoints(bridge) : HTTP_ENDPOINTS

  // Official pattern (verified in dsh-api-gateway): declare the dependency
  // with ctx.inject so the callback receives a context that resolves both
  // `connection` and the `webServer` the route registration needs. In
  // profiles without the web stack the callback simply never runs.
  ctx.inject(['connection'], (connectionCtx) => {
    connectionCtx.connection.rpc.handle(
      '/butler-memory',
      async (endpoint, payload) => {
        const handler = endpoints[endpoint]
        if (handler === undefined) {
          return {
            ok: false,
            error: {
              code: 'internal',
              message: `unknown butler-memory endpoint: ${endpoint}`,
              details: {},
            },
          }
        }
        try {
          return { ok: true, value: await handler(payload ?? {}) }
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : String(cause ?? 'panel error')
          return {
            ok: false,
            error: { code: 'internal', message, details: {} },
          }
        }
      },
      { authority: 'loopback' },
    )
```

</details>

**依据 5 · 源码核查**：[client/src/MemoryPanel.tsx:137-199](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/client/src/MemoryPanel.tsx#L137-L199)

Web 列表/候选操作。

<details>
<summary>查看原文（63行）</summary>

```text
export function MemoryPanel({ onClose }: MemoryPanelProps) {
  const [view, setView] = useState<'memories' | 'candidates'>('memories')
  const [memories, setMemories] = useState<MemoryRecord[]>([])
  const [candidates, setCandidates] = useState<CandidateRecord[]>([])
  const [includeArchived, setIncludeArchived] = useState(false)
  const [expanded, setExpanded] = useState<MemoryRecord | null>(null)
  const [revisions, setRevisions] = useState<RevisionRecord[] | null>(null)
  const [healthy, setHealthy] = useState<boolean | null>(null)
  const [showGuide, setShowGuide] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const load = useMemo(
    () => () => {
      setError(null)
      Promise.all([
        hostCall('memory/health', {}).catch(() => ({ ok: false })),
        hostCall('memory/list', { limit: 50, include_archived: includeArchived }).catch(
          (cause) => {
            throw cause
          },
        ),
        hostCall('memory/candidates', { status: 'pending', limit: 50 }).catch(
          () => ({ candidates: [] }),
        ),
      ])
        .then(([healthResult, memoryResult, candidateResult]) => {
          setHealthy((healthResult as { ok: boolean }).ok)
          setMemories((memoryResult as { memories: MemoryRecord[] }).memories ?? [])
          setCandidates((candidateResult as { candidates: CandidateRecord[] }).candidates ?? [])
        })
        .catch((cause: unknown) => {
          setHealthy(false)
          setShowGuide(true)
          setError(cause instanceof Error ? cause.message : String(cause))
        })
    },
    [includeArchived],
  )

  useEffect(() => {
    load()
  }, [load])

  function openDetail(memory: MemoryRecord) {
    setExpanded(memory)
    setRevisions(null)
    hostCall('memory/revisions', { memoryId: memory.memory_id })
      .then((result) => {
        setRevisions((result as { revisions: RevisionRecord[] }).revisions ?? [])
      })
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : String(cause))
      })
  }

  function decide(candidateId: string, accept: boolean) {
    const endpoint = accept ? 'memory/candidates/accept' : 'memory/candidates/reject'
    hostCall(endpoint, { candidateId })
      .then(() => load())
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : String(cause))
      })
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 桥进程、超时及审核边界有哪些缺口？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

每个面板和 agent 有不同 MCP 子进程，状态一致性依赖它们连接同一上游数据库/身份。Host 的 call 用 Promise.race 做 10 秒超时，但超时请求仍留在 pending Map，若底层以后返回会被消耗；长期反复超时可能累积 pending。初始化超时亦未清 pending/终止子进程。ctx.effect(() => bridge.dispose) 返回未绑定的方法，按一般 JS 回调调用会丢 this，清理可能失败；未运行宿主确认生命周期。面板端 accept/reject 只传 candidateId，没有显式 owner/revision；上游能否拒绝越权/过期操作须核，不应把 UI 按钮等同审核闭环。RPC authority 为 loopback，但具体身份边界取决宿主。

#### 证据与依据

**依据 1 · 源码核查**：[host/index.js:172-225](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L172-L225)

握手/调用超时与 dispose。

<details>
<summary>查看原文（54行）</summary>

```text
    const init = new Promise((resolve, reject) => {
      this.pending.set(INIT_ID, { resolve, reject })
      this._write({
        jsonrpc: '2.0',
        id: INIT_ID,
        method: 'initialize',
        params: {
          protocolVersion: '2025-11-25',
          capabilities: {},
          clientInfo: { name: 'dsh-butler-memory', version: '0.1.2' },
        },
      })
    })
    const timeout = new Promise((_, reject) => {
      setTimeout(
        () =>
          reject(
            new Error(
              'bridge handshake timed out; is ai-butler-memory-mcp on PATH?',
            ),
          ),
        HANDSHAKE_TIMEOUT_MS,
      )
    })
    return Promise.race([init, timeout])
  }

  async call(tool, payload, timeoutMs = CALL_TIMEOUT_MS) {
    await this.ensureStarted()
    const id = String(this.nextId++)
    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this._write({
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name: tool, arguments: payload ?? {} },
      })
    })
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`bridge call ${tool} timed out`)), timeoutMs)
    })
    return Promise.race([response, timeout])
  }

  dispose() {
    this.disposed = true
    this._failAll('bridge disposed')
    if (this.child !== null) {
      this.child.kill()
      this.child = null
    }
    this.healthy = false
  }
```

</details>

**依据 2 · 源码核查**：[host/index.js:286-307](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L286-L307)

候选操作只传 ID。

<details>
<summary>查看原文（22行）</summary>

```text
function stdioEndpoints(bridge) {
  return {
    'memory/health': async () => {
      try {
        await bridge.ensureStarted()
        return { ok: bridge.healthy }
      } catch {
        return { ok: false }
      }
    },
    'memory/list': (payload = {}) => bridge.call('memory_list', payload),
    'memory/search': (payload = {}) => bridge.call('memory_search', payload),
    // The panel speaks camelCase (memoryId, candidateId) while the MCP
    // tools take snake_case (memory_id, candidate_id): map explicitly.
    'memory/revisions': (payload = {}) =>
      bridge.call('memory_revisions', { memory_id: payload.memoryId }),
    'memory/candidates': (payload = {}) =>
      bridge.call('memory_candidates', payload),
    'memory/candidates/accept': (payload = {}) =>
      bridge.call('memory_candidate_accept', { candidate_id: payload.candidateId }),
    'memory/candidates/reject': (payload = {}) =>
      bridge.call('memory_candidate_reject', { candidate_id: payload.candidateId }),
```

</details>

**依据 3 · 源码核查**：[host/index.js:329-360](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L329-L360)

loopback RPC 和 effect 清理。

<details>
<summary>查看原文（32行）</summary>

```text
  ctx.inject(['connection'], (connectionCtx) => {
    connectionCtx.connection.rpc.handle(
      '/butler-memory',
      async (endpoint, payload) => {
        const handler = endpoints[endpoint]
        if (handler === undefined) {
          return {
            ok: false,
            error: {
              code: 'internal',
              message: `unknown butler-memory endpoint: ${endpoint}`,
              details: {},
            },
          }
        }
        try {
          return { ok: true, value: await handler(payload ?? {}) }
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : String(cause ?? 'panel error')
          return {
            ok: false,
            error: { code: 'internal', message, details: {} },
          }
        }
      },
      { authority: 'loopback' },
    )
  })

  if (bridge !== null) {
    ctx.effect(() => bridge.dispose, 'butler-memory: stdio panel bridge')
```

</details>

**依据 4 · 源码核查**：[client/src/MemoryPanel.tsx:192-199](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/client/src/MemoryPanel.tsx#L192-L199)

候选按钮请求。

```text
  function decide(candidateId: string, accept: boolean) {
    const endpoint = accept ? 'memory/candidates/accept' : 'memory/candidates/reject'
    hostCall(endpoint, { candidateId })
      .then(() => load())
      .catch((cause: unknown) => {
        setError(cause instanceof Error ? cause.message : String(cause))
      })
  }
```

#### 缺口

- 未运行宿主与上游服务。
  **影响：**超时泄漏、权限和清理故障未实际触发验证。
  **进一步探讨：**隔离 mock 故意不响应、重复点击和错误身份，观察 pending/进程/审计。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和保持兼容需要哪些组件？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

包 0.1.5 Apache-2.0，依赖 React、特定 DSH rc peer。需要外部 pip 包 ai-butler-memory-mcp、数据库与凭据，作者推荐 Docker 初始化、Node22+ 与 DSH；双 MCP 子进程增加启动和内存成本。README 的兼容实测为 dsh 0.1.0-rc.6 历史记录，且开头明确停止追新。离线降级是作者主张：MCP 缺失时普通会话仍可用，面板提示安装；本轮只见代码分支，没有在当前 DSH 上验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-43](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/package.json#L1-L43)

包、依赖与 peer。

<details>
<summary>查看原文（43行）</summary>

```text
{
  "name": "dsh-butler-memory",
  "version": "0.1.5",
  "description": "DSH bundle: wire the Butler Memory MCP server (agent tools) and add a Web memory panel (view/search/candidates)",
  "license": "Apache-2.0",
  "type": "module",
  "main": "host/index.js",
  "exports": {
    ".": "./host/index.js",
    "./client": {
      "default": "./client/dist/client.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "cordis.patch.yml",
    "host",
    "client/dist",
    "skills",
    "install-skill.mjs",
    "README.md"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true
    }
  },
  "scripts": {
    "build": "node build.mjs",
    "install-skill": "node install-skill.mjs"
  },
  "dependencies": {
    "react": "^18.2.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-runtime": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-slots": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.1.0-rc.6"
```

</details>

**依据 2 · 作者声明**：[README.md:3-12](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L3-L12)

维护状态。

<details>
<summary>查看原文（10行）</summary>

```text
> [!WARNING]
> **Deprecated — this DSH integration plugin is no longer maintained.**
> DSH changes rapidly, and this plugin is not being updated to follow newer
> releases. The compatibility notes below describe the versions that were tested
> at the time; they are not a promise of compatibility with current DSH. This
> repository remains available as a historical reference.
>
> **已停止维护：仅限这个 DSH 接入插件。** 由于 DSH 上游更新较快，本插件不再跟进新版；
> 下文的安装与兼容性记录仅代表当时的测试结果。此声明**不适用于**独立的
> `ai-butler-framework` 或 `butler-memory-mcp` 项目。
```

</details>

**依据 3 · 作者声明**：[README.md:44-51](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L44-L51)

外部服务/数据库/Node 条件。

```text
## 前置条件

1. 已安装 [butler-memory-mcp](https://github.com/AndyYang12345/butler-memory-mcp)
   （`pip install butler-memory-mcp`，确保 `ai-butler-memory-mcp` 在 PATH 上）；
2. 已按 butler-memory-mcp README 配置 `~/.config/butler-memory-mcp/.env`
   （数据库与桥设备凭据）。新机器/无数据库时一条命令完成全部初始化：
   `ai-butler-memory-mcp setup-docker`（需 Docker Desktop）；
3. Node 22+；`dsh` CLI 已安装。
```

**依据 4 · 作者声明**：[README.md:104-113](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L104-L113)

历史兼容说法。

<details>
<summary>查看原文（10行）</summary>

```text
## 兼容性验证记录（dsh 0.1.0-rc.6 实测）

- `ctx.inject(['connection'])` + `ctx.connection.rpc.handle` 静态插件 RPC
  契约（对齐官方 dsh-api-gateway 用法）；
- Slot 注册：`ctx.slots.inject(key, () => ctx.slots.register({name, id,
  order}, Component))`，与官方 dsh-client-ui-jobs 同槽位实测；
- 客户端 bundle 采用模块表契约（`__ModuleLoader__` + CJS 工厂，React 由
  页面提供）；
- MCP 协议 2025-11-25 握手、headless agent 工具调用、面板 RPC 通道、
  桥崩溃自动重启均已在真实实例验证。
```

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:14-24](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/cordis.patch.yml#L14-L24)

双实例配置。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: mcp-butler-memory
      name: '@deepseek-ai/dsh-mcp-client'
      config:
        serverName: butler
        transport: stdio
        command: ai-butler-memory-mcp
        args: [--transport, stdio]

    - id: butler-memory-panel
      name: dsh-butler-memory
```

</details>

#### 缺口

- 未测当前 DSH、DB 和上游 MCP 版本。
  **影响：**安装成功率和真实资源成本未知。
  **进一步探讨：**用隔离环境固定版本组合做安装/升级矩阵。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当下怎样使用或迁移这份历史参考？

**研究主题：**新假设与验证、采用判断

#### 完整回答

现阶段将其当集成样本，不直接推荐新生产环境采用。若已有部署，先核真实上游身份/审计、列表与候选写入、桥重启及当前 DSH 插件契约，备份记忆库再更新。未实现的改进是假设共享一个受监督的 MCP 桥、对请求超时彻底清 pending、把 dispose 显式绑定，并要求候选操作带期望 revision/owner；迁移前以旧版本作为基线测跨会话正确率、过期候选拒绝、崩溃恢复、内存/进程数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-12](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L3-L12)

作者弃维护声明。

<details>
<summary>查看原文（10行）</summary>

```text
> [!WARNING]
> **Deprecated — this DSH integration plugin is no longer maintained.**
> DSH changes rapidly, and this plugin is not being updated to follow newer
> releases. The compatibility notes below describe the versions that were tested
> at the time; they are not a promise of compatibility with current DSH. This
> repository remains available as a historical reference.
>
> **已停止维护：仅限这个 DSH 接入插件。** 由于 DSH 上游更新较快，本插件不再跟进新版；
> 下文的安装与兼容性记录仅代表当时的测试结果。此声明**不适用于**独立的
> `ai-butler-framework` 或 `butler-memory-mcp` 项目。
```

</details>

**依据 2 · 源码核查**：[host/index.js:199-225](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L199-L225)

现行超时与进程清理。

<details>
<summary>查看原文（27行）</summary>

```text
  async call(tool, payload, timeoutMs = CALL_TIMEOUT_MS) {
    await this.ensureStarted()
    const id = String(this.nextId++)
    const response = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject })
      this._write({
        jsonrpc: '2.0',
        id,
        method: 'tools/call',
        params: { name: tool, arguments: payload ?? {} },
      })
    })
    const timeout = new Promise((_, reject) => {
      setTimeout(() => reject(new Error(`bridge call ${tool} timed out`)), timeoutMs)
    })
    return Promise.race([response, timeout])
  }

  dispose() {
    this.disposed = true
    this._failAll('bridge disposed')
    if (this.child !== null) {
      this.child.kill()
      this.child = null
    }
    this.healthy = false
  }
```

</details>

**依据 3 · 源码核查**：[host/index.js:286-360](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/host/index.js#L286-L360)

候选/RPC 路由。

<details>
<summary>查看原文（75行）</summary>

```text
function stdioEndpoints(bridge) {
  return {
    'memory/health': async () => {
      try {
        await bridge.ensureStarted()
        return { ok: bridge.healthy }
      } catch {
        return { ok: false }
      }
    },
    'memory/list': (payload = {}) => bridge.call('memory_list', payload),
    'memory/search': (payload = {}) => bridge.call('memory_search', payload),
    // The panel speaks camelCase (memoryId, candidateId) while the MCP
    // tools take snake_case (memory_id, candidate_id): map explicitly.
    'memory/revisions': (payload = {}) =>
      bridge.call('memory_revisions', { memory_id: payload.memoryId }),
    'memory/candidates': (payload = {}) =>
      bridge.call('memory_candidates', payload),
    'memory/candidates/accept': (payload = {}) =>
      bridge.call('memory_candidate_accept', { candidate_id: payload.candidateId }),
    'memory/candidates/reject': (payload = {}) =>
      bridge.call('memory_candidate_reject', { candidate_id: payload.candidateId }),
  }
}

// ── plugin body ───────────────────────────────────────────────────────────

export function apply(ctx) {
  ensureSkillInstalled()

  const panelUrl = process.env.BUTLER_MEMORY_PANEL_URL
  const bridge =
    panelUrl === undefined
      ? new StdioBridge(
          process.env.AI_BUTLER_MEMORY_MCP_COMMAND || 'ai-butler-memory-mcp',
        )
      : null
  const endpoints = bridge !== null ? stdioEndpoints(bridge) : HTTP_ENDPOINTS

  // Official pattern (verified in dsh-api-gateway): declare the dependency
  // with ctx.inject so the callback receives a context that resolves both
  // `connection` and the `webServer` the route registration needs. In
  // profiles without the web stack the callback simply never runs.
  ctx.inject(['connection'], (connectionCtx) => {
    connectionCtx.connection.rpc.handle(
      '/butler-memory',
      async (endpoint, payload) => {
        const handler = endpoints[endpoint]
        if (handler === undefined) {
          return {
            ok: false,
            error: {
              code: 'internal',
              message: `unknown butler-memory endpoint: ${endpoint}`,
              details: {},
            },
          }
        }
        try {
          return { ok: true, value: await handler(payload ?? {}) }
        } catch (cause) {
          const message =
            cause instanceof Error ? cause.message : String(cause ?? 'panel error')
          return {
            ok: false,
            error: { code: 'internal', message, details: {} },
          }
        }
      },
      { authority: 'loopback' },
    )
  })

  if (bridge !== null) {
    ctx.effect(() => bridge.dispose, 'butler-memory: stdio panel bridge')
```

</details>

**依据 4 · 作者声明**：[README.md:90-96](https://github.com/AndyYang12345/dsh-butler-memory/blob/0f64e0cf0420d0461fef2d49c2d6752faebc0562/README.md#L90-L96)

作者验收流程。

```text
## 验证（照搬官方 examples/mcp-memory 流程）

1. 会话 A：`记住我的验证饮品是 lapsang-<唯一后缀>。` → 确认调用写入工具成功；
2. 新会话 B：`我的验证饮品是什么？查一下记忆。` → 确认召回；
3. 会话 B：`用这个偏好为会议建议一款饮品。` → 确认回答使用了记忆；
4. 点击会话头部"记忆"按钮：面板显示该条记忆（含类别/敏感度徽章）；
   面板中接受/拒绝候选后，记忆服务状态即时变化。
```

#### 缺口

- 单桥、强修订门槛及清理修复未实现。
  **影响：**不能算现有功能。
  **进一步探讨：**独立修复后做故障/权限矩阵。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
