# Browser4

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[d80c3a0](https://github.com/platonai/Browser4/tree/d80c3a01722bd33d812964888cbd4e48c1259723)

<!-- BEGIN META -->
[![GitHub ★ 1,169](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C169&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/platonai/Browser4)
<!-- END META -->

> **功能**：以 Rust CLI、MCP 与 Kotlin/CDP 后端提供浏览器交互、确定性提取和批量网页自动化。

> **亮点**：把会话交互、确定性字段提取和批量作业整合进统一CLI/MCP引擎；避免每任务重写接线，但不等所有任务优于简单脚本。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：zero-token不等总成本为零，DNS/Host保护不等身份鉴权；会话状态落盘与缓存不证明断线后不会重复有副作用动作。[Q03](#research-q03)

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
  - [Q01 · 哪类网页任务值得使用Browser4而非简单浏览脚本？](#detail-section-11)
  - [Q02 · CLI、MCP和浏览器如何保持会话与执行一致？](#detail-section-12)
  - [Q03 · 高吞吐、远程MCP与状态持久化各有什么代价？](#detail-section-13)
  - [Q04 · 如何限定试用并验证会话恢复不重复副作用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：批量交互后取字段的自动化开发者；静态单页可保留简单fetch或浏览脚本。[Q01](#research-q01)

Playwright/CDP单脚本、静态HTML选择器或人工浏览；完整引擎适合多任务统一管理但额外栈更重。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| CLI/MCP浏览器 | 交互与会话管理 | 实际运行时和Chrome |
| 确定性提取 | 选择器/X-SQL字段 | 规则维护，非总成本零 |
| 批量任务 | crawl/swarm入口 | 吞吐未独立验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 平台CLI/后端运行时与Chrome | 必需 | 浏览器执行 | 核版本和实际连接 |
| JDK25等构建工具 | 源码构建需 | 构建运行时 | 使用审定发行物或补依赖 |
| 站点权限/网络 | 访问必需 | 页面操作 | 受限任务停止 |
| 模型key | 自然语言提取需 | 推理 | 确定性路径不必用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定运行时与公开站 | 实际浏览器对应会话 |
| 提取 | Agent按snapshot/selector操作 | 字段对应页面 |
| 验收 | 用户对照原脚本 | 缓存/错位不当成功 |
| 退出 | 用户关闭自有会话或分离外部浏览器 | 不误杀外部浏览器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 浏览器与运行时，源码需JDK等 | 配会话/工具/站点 | 启动耗时未知 |
| 持续使用 | 浏览器、网络、存储与可选模型 | 校字段和维护选择器 | zero-token不等零成本 |
| 失败恢复 | 重启/重抓与备份 | 核cookie、会话和重复动作 | 断线恢复未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话管理 | 显式SessionKind | 实际重连一致性 |
| 统一工具 | MCP执行/校验/缓存 | 站点任务成功率 |
| 确定性提取 | 作者X-SQL路径 | 准确率、吞吐及总成本 |

> **思考**：zero-token不等总成本为零，DNS/Host保护不等身份鉴权；会话状态落盘与缓存不证明断线后不会重复有副作用动作。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把会话交互、确定性字段提取和批量作业整合进统一CLI/MCP引擎；避免每任务重写接线，但不等所有任务优于简单脚本。[Q01](#research-q01) [Q02](#research-q02)

显式所有权和统一工具执行链可借鉴；迁移要验证真实浏览器/目标解析及缓存语义，不能以复杂度作质量保证。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

zero-token不等总成本为零，DNS/Host保护不等身份鉴权；会话状态落盘与缓存不证明断线后不会重复有副作用动作。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议有自动化经验者在公开测试站用CLI限定试用，先确定性只读提取并与脚本对照；会话错位或重复副作用立即停并回原流程。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

会话分类与统一工具执行有固定源码支持；高吞吐、站点准确率、远程认证及断线恢复未独立执行。动作账本为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、cli/browser4-cli/src/state.rs、browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt、browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/McpHttpServer.kt 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定README、Rust状态、Kotlin MCP执行和HTTP服务；未审全部CDP、X-SQL、swarm及认证，未运行浏览器/测试/站点。Rust/Kotlin不计JS/TS LOC。
- 下一步：公开测试站固定提交动作与断线点，核会话、缓存、重复次数和全部资源；本轮未执行。[Q04](#research-q04)

**分析版本**

- **仓库**：[platonai/Browser4](https://github.com/platonai/Browser4)
- **版本号**：未声明（[固定提交 d80c3a0](https://github.com/platonai/Browser4/tree/d80c3a01722bd33d812964888cbd4e48c1259723)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是动作绑定会话/页面版本和结果，断线先核状态再重发，用提交前后断线比较重复与恢复时间。[Q04](#research-q04)

公开测试站固定提交动作与断线点，核会话、缓存、重复次数和全部资源；本轮未执行。[Q04](#research-q04)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1181 | 306167 | — | — | 2634172 |
| .mjs | source | 7 | 2402 | 1902 | 324 | — |
| .md | test | 2 | 269 | — | — | 1666 |
| .js | source | 82 | 155168 | 106040 | 32512 | — |
| .ts | test | 6 | 1174 | 850 | 124 | — |
| .ts | source | 8 | 1277 | 829 | 345 | — |
| .tsx | source | 10 | 1126 | 857 | 197 | — |
| .mts | source | 2 | 78 | 55 | 19 | — |
| .js | test | 5 | 1884 | 1432 | 130 | — |
| .md | example | 8 | 1677 | — | — | 12792 |
| .js | example | 5 | 469 | 405 | 35 | — |

</details>

**活跃度**

[![Issue 未关闭 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=28&color=737b86&logo=github)](https://github.com/platonai/Browser4/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/platonai/Browser4/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/platonai/Browser4/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器引擎的统一会话与提取能力增加什么，规模、远程接口和恢复有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类网页任务值得使用Browser4而非简单浏览脚本？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是需交互后提取字段、批量网页或长期会话管理的自动化开发者。Browser4整合Rust CLI、Kotlin浏览器后端、MCP工具与选择器/X-SQL提取；合格结果是字段对应当前页面且交互副作用符合预期。相对单脚本Playwright/浏览器操作，它增加统一会话、批处理与确定性提取入口；简单单页或静态HTML任务未必需要完整栈。README高吞吐、zero-token和演示都是作者主张：确定性路径不调用LLM不等浏览器、网络和人工成本为零，也不证明提取正确。DSH支持另在platonai/dsh-browser4仓库，不能把引擎根当该插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-66](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/README.md#L52-L66)

作者能力与吞吐主张。

<details>
<summary>查看原文（15行）</summary>

```text

💖 **Browser4 — an AI-native browser engine for autonomous agents, intelligent extraction, and large-scale web automation.** 💖

### ✨ Key Capabilities

* 🤖 **Agent Browser** — AI agents and humans drive real browsers via a Rust CLI, MCP, and an agentic backend: navigate, click, fill, snapshot, batch, and loop.
* 🧬 **Zero-Token Extraction** — X-SQL + CSS selectors for deterministic extraction from live pages or stored HTML snapshots; WebMiner ML clustering turns HTML corpora into spreadsheet and report views with no LLM tokens.
* 🧠 **Hybrid Intelligence** — Combine LLM extraction, ML clustering, X-SQL, and a progressive experience store that reuses learned selectors and blockers.
* ⚡ **High-Performance Runtime** — Coroutine-safe, CDP-native engine designed for 100k–200k complex page visits per machine per day via swarm/crawl scale-out.
* 📦 **Enterprise-Scale Automation** — Swarm crawling, batch/loop jobs, stateful sessions, plugins, runtime skills, browser extension, and an opt-in MCP-over-HTTP endpoint.
* 🛠️ **Programming-Agent Kernel** — 50+ `coding.*` tools (sandboxed shell/fs, scaffolding, validation, self-development) for agents building Browser4 artifacts — or Browser4 itself.

## Quick Start

Paste the following instruction to your favorite AI agent like dsh, claude, codex, workbuddy or openclaw and run it:
```

</details>

**依据 2 · 作者声明**：[README.md:83-91](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/README.md#L83-L91)

DSH集成为独立仓库。

````text
dsh plugin --profile web add dsh-browser4                  # npm registry
dsh plugin --profile web add github:platonai/dsh-browser4  # GitHub
```

## 🧭 Tool Selection Guide

Choosing the right tool for your task:

### How to Interact with a Page
````

**依据 3 · 作者声明**：[README.md:125-139](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/README.md#L125-L139)

确定性和LLM提取路径区分。

<details>
<summary>查看原文（15行）</summary>

````text
├─ A screenshot or a PDF as a *file* on this machine?
│  → scrape --formats "screenshot,pdf" --output ./out
├─ Natural language ("find the product price")? → extract (needs LLM key)
└─ High volume, many pages? → crawl or swarm with --sql
```

### How to Process at Scale

```
Need to process multiple pages?
├─ Single list page (search results)? → htmlsnapshot query with LOAD_AND_SELECT
├─ List of known URLs (in a file)? → crawl --seed-file urls.txt --depth 0 --sql @query.sql
├─ Crawl from a start URL (follow links)? → crawl <url> --out-link-selector "..." --depth N
├─ Need parallel execution (high throughput)? → swarm create → swarm query --seed-file ...
├─ Repeated monitoring (check every hour)? → loop -i 3600 -- eval "..."
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · CLI、MCP和浏览器如何保持会话与执行一致？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Rust CLI持久状态把Browser4自建、CDP接入、扩展接入与swarm分为不同SessionKind，生命周期不能用一个isAttached布尔概括。Kotlin MCP从内建管理器和插件注册表发现工具，统一路由AgentToolManager执行，并共享验证、限流和缓存。实际执行先查缓存再manager.execute，缓存标年龄；工具结果验证可配置为error，不能只因有Schema就称所有结果严格拒绝。值得借鉴的是显式会话所有权和统一执行链，移植需CDP、MCP协议、驱动及插件目标解析，复杂度远大于一个wrapper。没有执行浏览器，无法证明断线恢复一致。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:27-60](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/cli/browser4-cli/src/state.rs#L27-L60)

会话kind区分所有权和生命周期。

<details>
<summary>查看原文（34行）</summary>

```text
/// Explicit taxonomy of how a Browser4 session relates to its browser.
///
/// Previously this was implicit — derived from `is_attached` and `attach_type`
/// flags.  Making it explicit lets lifecycle decisions (close vs detach,
/// health-check recreation) be driven by the kind rather than by scattered
/// boolean checks.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum SessionKind {
    /// Browser4 launched and owns the browser process lifecycle.  Created by `open`.
    Browser4Launched,
    /// Attached to an externally-managed browser via CDP.  Created by `attach --cdp`.
    CdpAttached,
    /// Attached via the Browser4 Chrome Extension WebSocket relay.  Created by `attach --extension`.
    ExtensionAttached,
    /// Shared swarm session for parallel scraping.  Created by `swarm create`.
    Swarm,
}

impl SessionKind {
    /// Derive the legacy `is_attached` flag from this kind.
    pub fn is_attached(self) -> bool {
        matches!(
            self,
            SessionKind::CdpAttached | SessionKind::ExtensionAttached
        )
    }

    /// Derive the legacy `attach_type` string from this kind.
    pub fn attach_type_str(self) -> Option<&'static str> {
        match self {
            SessionKind::CdpAttached => Some("cdp"),
            SessionKind::ExtensionAttached => Some("extension"),
            _ => None,
```

</details>

**依据 2 · 源码核查**：[browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt:65-95](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt#L65-L95)

统一工具服务和共享限制。

<details>
<summary>查看原文（31行）</summary>

```text
class Browser4MCPServer(
    private val toolManager: AgentToolManager,
    serverInfo: Implementation = Implementation(name = "browser4-mcp-server", version = "1.0.0"),
    private val customExecutors: () -> List<ToolExecutor> = { CustomToolRegistry.instance.getAllExecutors() },
    private val toolManagerResolver: ToolManagerResolver = ToolManagerResolver.single(toolManager),
    private val frontendAliases: List<McpToolAlias> = McpToolNames.frontendAliases,
    private val toolTargetResolver: ToolTargetResolver = ToolTargetResolver.NONE,
    /** Shared with the private dispatcher so both channels spend the same tokens. */
    private val toolRateLimiter: ToolRateLimiter = ToolRateLimiter.shared,
    /** Shared with the private dispatcher so a cached read never reaches the browser. */
    private val toolResultCache: ToolResultCache = ToolResultCache.shared,
) {
    private val logger = getLogger(this)

    /** Shared with the private dispatcher so both channels reject the same calls. */
    private val validator = ToolSpecValidator.fromSystemProperties()

    /** Advertised tools by MCP name; kept so calls can be routed after registration. */
    private val registrations = linkedMapOf<String, ToolRegistration>()

    val server: Server = Server(
        serverInfo = serverInfo,
        options = ServerOptions(
            capabilities = ServerCapabilities(
                tools = ServerCapabilities.Tools(listChanged = false)
            )
        ),
        instructions = serverInstructions(),
    ) {
        registerToolsFromManager(toolManager)
    }
```

</details>

**依据 3 · 源码核查**：[browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt:529-552](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt#L529-L552)

缓存与真实执行链。

<details>
<summary>查看原文（24行）</summary>

```text
        toolResultCache.get(registration.spec, sessionId, args, cacheBypass)?.let { cached ->
            return cachedResult(registration, cached.text, cached.ageMs)
        }

        val toolCall = ToolCall(
            domain = registration.domain,
            method = registration.method,
            arguments = args.toMutableMap(),
        )

        return runCatching { resolvedManager.execute(toolCall) }
            .fold(
                onSuccess = { result ->
                    val evaluate = result.evaluate
                    val exception = evaluate.exception
                    if (exception != null) {
                        toolResultCache.put(registration.spec, sessionId, args, "", false, cacheBypass)
                        errorResult(
                            "$toolName failed: ${exception.cause?.message ?: exception.expression}",
                            ToolErrorMapper.classify(exception.cause),
                        )
                    } else {
                        val text = ToolResultTextRenderer.render(evaluate)
                        toolResultCache.put(registration.spec, sessionId, args, text, true, cacheBypass)
```

</details>

**依据 4 · 源码核查**：[browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt:599-608](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt#L599-L608)

结果校验error模式有配置条件。

<details>
<summary>查看原文（10行）</summary>

```text
     * The result is then validated against the tool's declared `outputSchema`
     * (see [ToolResultValidator]); a violation is logged and counted, and fails
     * the call only when `-Dmcp.validateResults=error`.
     */
    private fun successResult(registration: ToolRegistration, text: String): CallToolResult {
        val structured = structuredResult(registration.spec, text)
        if (structured != null) {
            val issues = ToolResultValidator.validate(registration.spec, structured)
            if (ToolResultValidator.report(registration.spec, issues) && issues.isNotEmpty()) {
                return errorResult(
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 高吞吐、远程MCP与状态持久化各有什么代价？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

高吞吐取决于页面复杂性、站点限流、浏览器资源、模型路径与恢复，不可据设计吞吐推本机能力。HTTP MCP可配置外部bind，SDK DNS重绑定保护与allowedHosts不是用户认证；本轮未全审鉴权与网络部署，因此仅建议本地或受控网络，不把主机头白名单当多用户安全。首次安装运行时/Chrome，源码构建另需JDK25等；持续浏览器、抓取、存储和可能模型调用都需资源。会话cookies/localStorage可导出，文件必须保护；恢复要核实际浏览器、工作区与缓存是否对应，不能把落盘会话名当活连接。金额、延迟、故障重放和总吞吐未测。

#### 证据与依据

**依据 1 · 源码核查**：[browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/McpHttpServer.kt:55-75](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/McpHttpServer.kt#L55-L75)

bind和DNS/Host保护配置，不等身份认证。

<details>
<summary>查看原文（21行）</summary>

```text
 * @param host The hostname to bind to (default "0.0.0.0").
 * @param serverInfo MCP server identification for the initialize handshake.
 * @param toolManagerResolver Resolves which session a tool call runs against.
 *   Defaults to the single [toolManager] this server was started with.
 * @param customExecutors Supplies the plugin/business executors to advertise.
 * @param frontendAliases The extra `browser_*` spellings to advertise.
 * @param dnsRebindingProtection Whether to validate the `Host` header. Defaults
 *   to `true`; a client whose `Host` is neither loopback nor listed in
 *   [allowedHosts] is rejected with `403 Forbidden`.
 * @param allowedHosts Hostnames accepted in the `Host` header. `null` keeps the
 *   SDK default of `localhost`, `127.0.0.1` and `[::1]`.
 */
class McpHttpServer(
    private val toolManager: AgentToolManager,
    private val port: Int = DEFAULT_MCP_HTTP_PORT,
    private val host: String = "0.0.0.0",
    serverInfo: Implementation = Implementation(name = "browser4-mcp-server", version = "1.0.0"),
    toolManagerResolver: ToolManagerResolver = ToolManagerResolver.single(toolManager),
    customExecutors: () -> List<ToolExecutor> = { CustomToolRegistry.instance.getAllExecutors() },
    frontendAliases: List<McpToolAlias> = McpToolNames.frontendAliases,
    toolTargetResolver: ToolTargetResolver = ToolTargetResolver.NONE,
```

</details>

**依据 2 · 源码核查**：[cli/browser4-cli/src/state.rs:1-9](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/cli/browser4-cli/src/state.rs#L1-L9)

状态和运行时目录分离。

```text
//! Persistent state management for the Browser4 CLI.
//!
//! CLI session state is stored under `~/.browser4` by default. The unnamed
//! session uses `cli-state.json`, while named sessions use `sessions/<name>.json`.
//!
//! The Browser4 runtime bundle (JRE, JARs, launchers) lives separately in a
//! platform-conventional data directory (`~/.local/share/browser4/` on Linux,
//! `~/Library/Application Support/browser4/` on macOS, `%APPDATA%/browser4/`
//! on Windows).  See [`resolve_runtime_data_dir`].
```

**依据 3 · 作者声明**：[README.md:491-492](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/README.md#L491-L492)

状态导出包含cookies和localStorage。

```text
| `state-save [filename]` | Save cookies and localStorage to a JSON file. |
| `state-load <filename>` | Restore cookies and localStorage from a JSON file. |
```

**依据 4 · 作者声明**：[README.md:715-729](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/README.md#L715-L729)

状态目录及源码构建依赖。

<details>
<summary>查看原文（15行）</summary>

```text
### State persistence

CLI state lives under `~/.browser4` unless overridden.

- default session: `~/.browser4/cli-state.json`
- named sessions: `~/.browser4/sessions/<name>.json`
- loops: `~/.browser4/loops/<name>.json`

The runtime bundle is stored separately in a platform-conventional application-data directory, so clearing session state does not force a re-download of Browser4 itself.

---

## 🚀 Build from Source

**Prerequisites:** Git, JDK 25+ (Eclipse Temurin), Chrome/Chromium, and PowerShell 7 (Linux/macOS only). For the full prerequisites table, platform-specific tools, and Chrome auto-detection paths, see [Build from Source](docs/build-from-source.md).
```

</details>

#### 缺口

- 远程认证全链、断线重放、实际站点吞吐和字段准确率未验收。
  **影响**：不能给生产规模或共享用户部署保证。
  **进一步探讨**：固定公开测试站与有副作用页面，核网络权限、断线后状态和重复动作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何限定试用并验证会话恢复不重复副作用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有浏览器自动化经验且确需批量交互提取的开发者，可先在公开测试站试CLI会话与确定性字段提取，保留原脚本对照，暂不接入敏感登录或生产写操作。若提取字段错位、缓存过期、会话指向错误浏览器或重连重复动作，应停并回单脚本/人工核对。未验证假设是把每个有副作用动作绑定会话所有权、页面版本和可核查结果，重连后先读状态再决定是否重发；由Q02显式SessionKind和Q03未知重放推导。最小实验在点击提交前后、响应丢失时断线，比较当前实现和动作账本原型的重复提交、未知状态与恢复时间。若仍重复或额外标识无法覆盖页面更新，则否定。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:27-60](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/cli/browser4-cli/src/state.rs#L27-L60)

会话所有权是动作归属的基础。

<details>
<summary>查看原文（34行）</summary>

```text
/// Explicit taxonomy of how a Browser4 session relates to its browser.
///
/// Previously this was implicit — derived from `is_attached` and `attach_type`
/// flags.  Making it explicit lets lifecycle decisions (close vs detach,
/// health-check recreation) be driven by the kind rather than by scattered
/// boolean checks.
#[derive(Debug, Clone, Copy, Serialize, Deserialize, PartialEq, Eq)]
#[serde(rename_all = "camelCase")]
pub enum SessionKind {
    /// Browser4 launched and owns the browser process lifecycle.  Created by `open`.
    Browser4Launched,
    /// Attached to an externally-managed browser via CDP.  Created by `attach --cdp`.
    CdpAttached,
    /// Attached via the Browser4 Chrome Extension WebSocket relay.  Created by `attach --extension`.
    ExtensionAttached,
    /// Shared swarm session for parallel scraping.  Created by `swarm create`.
    Swarm,
}

impl SessionKind {
    /// Derive the legacy `is_attached` flag from this kind.
    pub fn is_attached(self) -> bool {
        matches!(
            self,
            SessionKind::CdpAttached | SessionKind::ExtensionAttached
        )
    }

    /// Derive the legacy `attach_type` string from this kind.
    pub fn attach_type_str(self) -> Option<&'static str> {
        match self {
            SessionKind::CdpAttached => Some("cdp"),
            SessionKind::ExtensionAttached => Some("extension"),
            _ => None,
```

</details>

**依据 2 · 源码核查**：[browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt:529-552](https://github.com/platonai/Browser4/blob/d80c3a01722bd33d812964888cbd4e48c1259723/browser4-agentic/src/main/kotlin/ai/platon/pulsar/agentic/mcp/server/Browser4MCPServer.kt#L529-L552)

缓存与执行区分构成核状态问题。

<details>
<summary>查看原文（24行）</summary>

```text
        toolResultCache.get(registration.spec, sessionId, args, cacheBypass)?.let { cached ->
            return cachedResult(registration, cached.text, cached.ageMs)
        }

        val toolCall = ToolCall(
            domain = registration.domain,
            method = registration.method,
            arguments = args.toMutableMap(),
        )

        return runCatching { resolvedManager.execute(toolCall) }
            .fold(
                onSuccess = { result ->
                    val evaluate = result.evaluate
                    val exception = evaluate.exception
                    if (exception != null) {
                        toolResultCache.put(registration.spec, sessionId, args, "", false, cacheBypass)
                        errorResult(
                            "$toolName failed: ${exception.cause?.message ?: exception.expression}",
                            ToolErrorMapper.classify(exception.cause),
                        )
                    } else {
                        val text = ToolResultTextRenderer.render(evaluate)
                        toolResultCache.put(registration.spec, sessionId, args, text, true, cacheBypass)
```

</details>

#### 缺口

- 动作账本能否改善断线恢复无结果。
  **影响**：仅设计假设，未实现或验证。
  **进一步探讨**：在可丢弃测试站固定断线点计副作用次数和恢复时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
