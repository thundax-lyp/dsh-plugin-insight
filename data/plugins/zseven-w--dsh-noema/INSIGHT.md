# DSH Noema

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[07d2fec](https://github.com/ZSeven-W/dsh-noema/tree/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a)

<!-- BEGIN META -->
[![GitHub ★ 136](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=136&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/dsh-noema) [![npm 30d 1,976](https://img.shields.io/static/v1?label=npm+30d&message=1%2C976&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-noema) [![最新发布 2026-10-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zseven-w/dsh-noema)
<!-- END META -->

> **功能**：将本地 Noema 记忆服务接入 DSH，支持检索与跨工具导入。

> **亮点**：[Q01](#research-q01) 统一接入记忆工具与生命周期。

> **主要限制**：[Q02](#research-q02) 已接受的记忆与去重账本不是同一提交。

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
  - [Q01 · 记忆如何接进宿主？](#detail-section-11)
  - [Q02 · 导入失败可留下什么？](#detail-section-12)
  - [Q03 · 如何隔离验证和退出？](#detail-section-13)
  - [Q04 · 如何减少意外导入？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 复用长期开发笔记的用户。

手工检索并粘贴各工具笔记。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 记忆检索 | 复用笔记 | 依赖固定 Noema 服务 |
| 导入 | 跨工具保存片段 | 注意来源与账本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与 Noema | 必需 | 加载工具与服务 | 手工笔记 |
| 临时记忆根 | 隔离验证需要 | 限定写入 | 不试真实内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户设临时记忆根并关闭自动导入 | 限定来源 |
| 验证 | 操作者导入合成资料 | 核对重复与读取 |
| 退出 | 关闭工具并读回进程和文件 | 按需保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 二进制和存储未知 | 配置独立路径 | 未实测 |
| 持续 | 服务和索引资源未知 | 维护来源 | 资料风险需核对 |
| 恢复 | 重导成本未知 | 读取账本与记忆 | 不盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 宿主检索 | 工具与 MCP 接线 | 实际召回 |
| 导入 | 来源选择和内容键 | 幂等与隔离 |

> **思考**：[Q02](#research-q02) 已接受的记忆与去重账本不是同一提交。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 统一接入记忆工具与生命周期。

[Q02](#research-q02) 区分服务写入与账本提交。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 已接受的记忆与去重账本不是同一提交。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先隔离验证。[Q02](#research-q02) 导入失败先读回。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定宿主桥和导入代码，未执行 MCP 或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、src/import-service.ts、src/index.ts、src/server-manager.ts、src/status-route.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定宿主桥代表路径，未执行目标。
- 下一步：检查启动、查询、导入失败及退出。

**分析版本**

- **仓库**：[ZSeven-W/dsh-noema](https://github.com/ZSeven-W/dsh-noema)
- **版本号**：0.1.0-rc.6（[固定提交 07d2fec](https://github.com/ZSeven-W/dsh-noema/tree/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a)）
- **版本日期**：2026-10-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 在提交前显示待导入范围。

检查启动、查询、导入失败及退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3151 | — | — | 29730 |
| .mjs | source | 10 | 512 | 458 | 10 | — |
| .ts | source | 13 | 2564 | 2048 | 341 | — |
| .tsx | source | 1 | 960 | 899 | 19 | — |
| .mjs | test | 8 | 1224 | 1098 | 31 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-noema/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-noema/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/ZSeven-W/dsh-noema/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Noema 的宿主接线、导入和状态边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 记忆如何接进宿主？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在 DSH 持续开发的用户通常手工引用其他工具的笔记。插件注册记忆工具、可选系统引导和 Web 管理。工具调用时管理器共享启动 promise，等待 MCP 运行并按超时调用；可配置启动即拉起。贡献是把跨会话记忆检索变成宿主工具，而存储和相关性仍由实际 Noema 服务决定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-50](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/README.md#L33-L50)

作者的持久记忆场景

<details>
<summary>查看原文（18行）</summary>

```text
## Why DSH Noema

DSH Noema connects [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) with [Noema](https://github.com/ZSeven-W/noema) — a local-first, non-vector memory system for coding agents — so an Agent keeps durable knowledge across sessions instead of starting every conversation from zero.

<table>
<tr>
<td width="50%">

### 🧠 Durable Recall

Memories persist as inspectable Markdown files under `NOEMA_ROOT` (default `~/.agent-memory/`). `noema_recall` loads relevant context at the start of a session; `noema_search`, `noema_browse`, `noema_catalog`, and `noema_recall_graph` cover lookup, exploration, and auditing.

</td>
<td width="50%">

### 📥 Import From Other Tools

`noema_import` reads the memory files of ten other AI coding tools — Codex, Claude Code, opencode, Cursor, Grok, WorkBuddy, Antigravity, Trae, Qoder, Hermes — splits them into sections, and saves each as a durable memory. A content-keyed ledger deduplicates across runs and across tools that share files.
```

</details>

**依据 2 · 源码核查**：[src/index.ts:89-129](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/index.ts#L89-L129)

宿主注册和启动

<details>
<summary>查看原文（41行）</summary>

```text
  const manager = new NoemaServerManager(() => settingsSource(), ctx.logger)
  const importService = new MemoryImportService(manager, () => settingsSource(), ctx.logger)
  const disposers: Array<() => void | Promise<void>> = []

  for (const tool of createNoemaTools(manager, () => settingsSource(), importService)) {
    disposers.push(ctx.effect(
      () => hostCtx.tools.register(tool),
      'dsh-noema: ' + tool.name + ' tool',
    ))
  }

  // Guidance section: only mounted when a systemPrompt service exists.
  ctx.inject(['systemPrompt'], (promptCtx) => {
    const systemPrompt = (promptCtx as SystemPromptContext).systemPrompt
    systemPrompt.section({
      name: NOEMA_GUIDANCE_SECTION.name,
      order: NOEMA_GUIDANCE_SECTION.order,
      text: () => noemaGuidanceText(settingsSource()),
    })
  })

  // Status route: only mounted when a webServer service exists (headless
  // profiles never attach; the settings panel then hides the status card).
  ctx.inject(['webServer'], (webCtx) => {
    const webServer = (webCtx as WebServerContext).webServer
    return registerNoemaStatusRoute(
      webServer,
      manager,
      () => settingsSource(),
      () => settingsWriter,
      importService,
    )
  })

  const initial = settingsSource()
  if (initial.enabled && initial.autoStart) {
    manager.ensureRunning().catch((error: unknown) => {
      ctx.logger.warn('dsh-noema: ' + (error instanceof Error ? error.message : String(error)))
    })
  }
  manager.startKeepAlive()
```

</details>

**依据 3 · 源码核查**：[src/server-manager.ts:147-176](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/server-manager.ts#L147-L176)

MCP 启动与调用

<details>
<summary>查看原文（30行）</summary>

```text
  /** Bring the server up if it is down; concurrent callers share one spawn. */
  async ensureRunning(): Promise<void> {
    if (this.disposed) throw new Error('Noema memory plugin is disposed')
    const state = this.client?.state
    if (state === 'running') return
    if (this.starting !== undefined) {
      await this.starting
      return
    }
    this.starting = this.start()
    try {
      await this.starting
    } finally {
      this.starting = undefined
    }
  }

  /** Call one Noema MCP tool, starting the server on demand. */
  async call(name: string, args: Record<string, unknown>, options: NoemaServerCallOptions = {}): Promise<McpToolResult> {
    if (options.signal?.aborted === true) throw new McpStdioError('call aborted', { cause: options.signal.reason })
    await this.ensureRunning()
    const client = this.client
    if (client === undefined || client.state !== 'running') {
      throw new McpStdioError('Noema memory server is not running')
    }
    const config = this.resolveConfig()
    try {
      const result = await client.callTool(name, args, { timeoutMs: config.callTimeoutMs, signal: options.signal })
      this.armIdle(config)
      return result
```

</details>

#### 缺口

- 未执行实际二进制或检索
  **影响**：不能证明相关性和宿主兼容
  **进一步探讨**：以合成笔记和固定二进制核对调用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导入失败可留下什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

导入选择已启用来源，先枚举全局候选，工作区候选另受开关。成功记忆调用使用 accept:true 并记录内容键，末尾统一保存账本；账本写失败前已接收的内容不会在该路径撤销。重试可能再提交同内容，实际重复取决于 Noema 服务。管理路由还要求回环及 POST 同源，不能据此判断所有 Agent 工具的调用权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/import-service.ts:240-277](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/import-service.ts#L240-L277)

来源、路径与大小范围

<details>
<summary>查看原文（38行）</summary>

```text
  async run(options: ImportOptions = {}): Promise<ImportSummary> {
    const config = this.resolveConfig()
    if (!config.importEnabled) {
      const summary: ImportSummary = {
        ok: false, at: Date.now(), sources: [], totalFiles: 0, totalItems: 0,
        imported: 0, skipped: 0, errors: ['memory import is disabled in settings'],
      }
      this.lastImport = summary
      return summary
    }
    const sources = options.sources ?? config.importSources
    const importers = resolveImporters(sources)
    const ledgerPath = importLedgerPath()
    const ledger = await loadLedger(ledgerPath)
    const summaries: ImportSourceSummary[] = []
    let imported = 0
    let skipped = 0
    let totalFiles = 0
    let totalItems = 0
    const allErrors: string[] = []
    const at = Date.now()

    for (const importer of importers) {
      const sourceSummary: ImportSourceSummary = {
        source: importer.id, files: 0, items: 0, imported: 0, skipped: 0, errors: [],
      }
      const candidates = [
        ...importer.globalCandidates(),
        ...(config.importWorkspaceFiles && options.workspaceRoot !== undefined && options.workspaceRoot !== ''
          ? importer.workspaceCandidates(options.workspaceRoot)
          : []),
      ]
      const seen = new Set<string>()
      for (const candidate of candidates) {
        if (!existsSync(candidate.path)) continue
        if (seen.has(candidate.path)) continue
        seen.add(candidate.path)
        const items = await collectItems(importer, candidate.path, candidate.kind, candidate.label, config.importMaxBytes, sourceSummary.errors)
```

</details>

**依据 2 · 源码核查**：[src/import-service.ts:281-315](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/import-service.ts#L281-L315)

直接接受、去重和账本顺序

<details>
<summary>查看原文（35行）</summary>

```text
        for (const item of items) {
          sourceSummary.items += 1
          totalItems += 1
          const key = itemKey(item)
          if (!options.force && ledger.keys[key] !== undefined) {
            // The section is already represented (possibly claimed by another
            // source sharing this file); record the key so later runs stay quiet.
            ledger.keys[key] = at
            skipped += 1
            sourceSummary.skipped += 1
            continue
          }
          try {
            await this.manager.call('noema_remember', {
              text: item.text,
              tags: ['imported', 'source:' + importer.id],
              accept: true,
            }, {})
            ledger.keys[key] = at
            imported += 1
            sourceSummary.imported += 1
          } catch (error) {
            const message = importer.id + ' ' + item.path + ': ' + (error instanceof Error ? error.message : String(error))
            sourceSummary.errors.push(message)
            allErrors.push(message)
          }
        }
      }
      summaries.push(sourceSummary)
    }

    try {
      await saveLedger(ledgerPath, ledger)
    } catch (error) {
      allErrors.push('ledger: ' + (error instanceof Error ? error.message : String(error)))
```

</details>

**依据 3 · 源码核查**：[src/status-route.ts:155-172](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/status-route.ts#L155-L172)

管理路由检查

<details>
<summary>查看原文（18行）</summary>

```text
    }
  }
  return webServer.register({
    kind: 'exact',
    path: NOEMA_STATUS_ROUTE,
    handler: async (req, res) => {
      if (!isLoopbackRequest(req)) {
        sendJson(res, 403, { ok: false, error: 'the Noema status route is loopback-only' })
        return
      }
      if (!isTrustedBrowserRequest(req, req.method === 'POST')) {
        sendJson(res, 403, { ok: false, error: 'the Noema status route requires a same-origin DSH browser context' })
        return
      }
      if (req.method === 'GET') {
        sendJson(res, 200, await snapshot())
        return
      }
```

</details>

#### 缺口

- 未验证服务幂等和并行导入
  **影响**：不能保证失败后不重复或不保留
  **进一步探讨**：用合成文件模拟账本失败并读回

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何隔离验证和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者以平台可选 npm 包分发 noema-mcp，支持自定义路径。用独立 DSH 和 NOEMA_ROOT，仅导入单一合成来源，先关闭自动导入再测读取。维护成本包括后台进程、索引和长期存储；禁用后单独检查进程、记忆根与账本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:88-104](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/README.md#L88-L104)

安装和二进制方式

<details>
<summary>查看原文（17行）</summary>

````text
## Install into DSH

```sh
dsh plugin --profile web add @zseven-w/dsh-noema@latest
dsh web
```

Or, for local development straight from the source tree:

```sh
dsh plugin --profile web add link:/path/to/dsh-noema
dsh web
```

The `link:` protocol symlinks the profile dependency to this repository, so rebuilds are visible immediately and Cordis HMR can watch the compiled output.

The plugin bundles the `noema-mcp` binary through per-platform optional npm packages. To build it yourself instead, run `cargo build --release -p noema-mcp` inside the bundled `noema` submodule, or point the Server command setting at any `noema-mcp` build.
````

</details>

**依据 2 · 作者声明**：[README.md:149-167](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/README.md#L149-L167)

可配置启动、记忆根和预算

<details>
<summary>查看原文（19行）</summary>

```text
## Settings

Open **Settings → Noema Memory**:

| Setting | Default | Meaning |
| --- | --- | --- |
| Enable memory | on | Master switch for the `noema_*` tools. |
| Memory guidance | on | System-prompt section teaching memory usage. |
| Start server at boot | on | Spawn at DSH start instead of first use. |
| Auto-accept new memories | on | `noema_remember` persists immediately. |
| Server command | `bundled` | Bundled `noema-mcp` binary or a custom executable path/command. |
| Working directory | — | cwd for the server (needed for `cargo run`). |
| Memory root (NOEMA_ROOT) | — | Where memories are stored; empty = `~/.agent-memory`. |
| Recall token budget | 1200 | Default `budget_tokens` for `noema_recall`. |
| Idle timeout (ms) | 0 | Stop the server after idle; 0 = never. |
| Keep alive | on | Restart the server in the background when it crashes or exits. |
| Keep-alive interval (ms) | 5000 | Minimum delay between background health checks. |
| Call timeout (ms) | 30000 | Per-tool-call deadline. |
| Restart delay (ms) | 1000 | Backoff between a stop/crash and the next start. |
```

</details>

**依据 3 · 源码核查**：[src/index.ts:123-135](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/index.ts#L123-L135)

后台及启动导入

<details>
<summary>查看原文（13行）</summary>

```text
  const initial = settingsSource()
  if (initial.enabled && initial.autoStart) {
    manager.ensureRunning().catch((error: unknown) => {
      ctx.logger.warn('dsh-noema: ' + (error instanceof Error ? error.message : String(error)))
    })
  }
  manager.startKeepAlive()

  // Startup import pass: best-effort, ledger-deduplicated, never blocks boot.
  if (initial.enabled && initial.importEnabled && initial.importOnStartup) {
    importService.run({}).catch((error: unknown) => {
      ctx.logger.warn('dsh-noema startup import: ' + (error instanceof Error ? error.message : String(error)))
    })
```

</details>

#### 缺口

- 未验证本机二进制或卸载残留
  **影响**：资源和恢复成本未知
  **进一步探讨**：测试临时 profile 启停与清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何减少意外导入？

**研究主题**：新假设与验证

#### 完整回答

在现有按来源勾选之上先列文件与预计段落数，仅经用户确认后提交。对照含多个工具共享文件及私有资料的虚拟 home，测误导入、重复和审查时间，若误导入不降或时间代价明显则撤回。

#### 证据与依据

**依据 1 · 源码核查**：[src/import-service.ts:250-299](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/src/import-service.ts#L250-L299)

现有枚举和提交

<details>
<summary>查看原文（50行）</summary>

```text
    const sources = options.sources ?? config.importSources
    const importers = resolveImporters(sources)
    const ledgerPath = importLedgerPath()
    const ledger = await loadLedger(ledgerPath)
    const summaries: ImportSourceSummary[] = []
    let imported = 0
    let skipped = 0
    let totalFiles = 0
    let totalItems = 0
    const allErrors: string[] = []
    const at = Date.now()

    for (const importer of importers) {
      const sourceSummary: ImportSourceSummary = {
        source: importer.id, files: 0, items: 0, imported: 0, skipped: 0, errors: [],
      }
      const candidates = [
        ...importer.globalCandidates(),
        ...(config.importWorkspaceFiles && options.workspaceRoot !== undefined && options.workspaceRoot !== ''
          ? importer.workspaceCandidates(options.workspaceRoot)
          : []),
      ]
      const seen = new Set<string>()
      for (const candidate of candidates) {
        if (!existsSync(candidate.path)) continue
        if (seen.has(candidate.path)) continue
        seen.add(candidate.path)
        const items = await collectItems(importer, candidate.path, candidate.kind, candidate.label, config.importMaxBytes, sourceSummary.errors)
        if (items.length === 0) continue
        sourceSummary.files += 1
        totalFiles += 1
        for (const item of items) {
          sourceSummary.items += 1
          totalItems += 1
          const key = itemKey(item)
          if (!options.force && ledger.keys[key] !== undefined) {
            // The section is already represented (possibly claimed by another
            // source sharing this file); record the key so later runs stay quiet.
            ledger.keys[key] = at
            skipped += 1
            sourceSummary.skipped += 1
            continue
          }
          try {
            await this.manager.call('noema_remember', {
              text: item.text,
              tags: ['imported', 'source:' + importer.id],
              accept: true,
            }, {})
            ledger.keys[key] = at
```

</details>

**依据 2 · 作者声明**：[README.md:144-147](https://github.com/ZSeven-W/dsh-noema/blob/07d2fece531d11dbd5c420c5d44eaea12e6a9d7a/README.md#L144-L147)

已有选择与摘要

```text
- The `source` argument selects one tool, or omit it to run every source enabled in settings.
- The `path` argument selects the workspace root for project-scoped files (defaults to the session workspace; workspace files only load when the Import workspace files setting is on).
- Imports are deduplicated through a ledger at `$DSH_HOME/storages/dsh-noema-imports.json`, keyed by file path + section content — when several tools share one project `AGENTS.md`, each section is imported exactly once. `force: true` re-imports everything.
- The settings page exposes per-source checkboxes, an import-on-startup toggle, a file-size cap, and an Import now button with a last-run summary.
```

#### 缺口

- 未检查所有前端预览
  **影响**：增量待核实
  **进一步探讨**：先走查界面再对照

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
