# Browser4

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[267cefb](https://github.com/platonai/Browser4/tree/267cefb2b8af9f07d1f3877c10c84ec571857ce8)

<!-- BEGIN META -->
[![GitHub ★ 1,171](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C171&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/platonai/Browser4)
<!-- END META -->

> **功能**：通过 Rust CLI 和浏览器后端提供网页交互与批量提取。

> **亮点**：[Q02](#research-q02) 组合 CLI、后端工具和不同会话所有权；不把底层浏览器或 CDP 视为原创。

> **主要限制**：[Q03](#research-q03) 本地会话状态不能证明网站操作未发生或自动幂等；[Q04](#research-q04) 远端和数据范围未测。

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
  - [Q01 · 谁需要 Browser4，与简单脚本有什么不同？](#detail-section-11)
  - [Q02 · 导航、点击和会话状态怎样接线？](#detail-section-12)
  - [Q03 · 恢复会话是否保证动作恰好一次？](#detail-section-13)
  - [Q04 · 安装、网络和退出要付出什么？](#detail-section-14)
  - [Q05 · 如何降低恢复后重复提交？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要多页面交互和结构提取的自动化开发者。

人工浏览、HTTP 抓取与 Playwright 脚本已能执行网页任务；平台统一会话和批量接口，也增加运行时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 导航与点击 | 操作网页 | 外部作用需授权 |
| 会话状态 | 记录启动或附着 | 不保证网页事务 |
| 批量提取 | 多页处理 | 吞吐未测 |
| 工具接口 | 客户端调用后端 | 真实部署未验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| CLI、后端和浏览器 | 必需 | 页面操作 | 无法执行 |
| 授权目标与网络 | 必需 | 访问网页 | 停止任务 |
| 模型服务 | AI 任务可选 | 智能步骤 | 使用确定性查询 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选隔离测试站点 | 核对授权 |
| 连接 | CLI 创建或附着会话 | 核对类型和目标 |
| 提取 | Agent 调用工具 | 验证来源与结果 |
| 中断 | 核查站点后置状态 | 不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 安装 | CLI、JRE/后端与浏览器 | 环境配置 | 未运行 |
| 持续 | 网络、计算与可选模型 | 数据审核 | 性能未知 |
| 失败 | 重试和状态 | 核对站点副作用 | 非共同事务 |
| 退出 | 持久状态 | 按类型 stop/detach | 清理未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话 | 分类和本地状态 | 故障恢复完整 |
| 操作 | 导航和点击调用 | 实际任务正确 |
| 批量 | 作者描述入口 | 吞吐及成本 |

> **思考**：[Q03](#research-q03) 本地会话状态不能证明网站操作未发生或自动幂等；[Q04](#research-q04) 远端和数据范围未测。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 组合 CLI、后端工具和不同会话所有权；不把底层浏览器或 CDP 视为原创。

[Q02](#research-q02) 依据会话类型区分所有权；[Q03](#research-q03) 本地 state 与网站并非事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本地会话状态不能证明网站操作未发生或自动幂等；[Q04](#research-q04) 远端和数据范围未测。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从隔离只读站点开始，写操作状态不明时人工核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码静态核查代表 CLI 调用和 state；未运行浏览器、后端或网站。

- 已检查：作者 README、包清单、源码路径 README.md、cli/browser4-cli/src/main.rs、cli/browser4-cli/src/http.rs、cli/browser4-cli/src/state.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态核查代表 Rust CLI、HTTP 调用和会话状态，未运行浏览器、Kotlin 后端或站点。
- 下一步：隔离站点对照导航、点击、服务重启和目标状态，统计准确率与成本。

**分析版本**

- **仓库**：[platonai/Browser4](https://github.com/platonai/Browser4)
- **版本号**：未声明（[固定提交 267cefb](https://github.com/platonai/Browser4/tree/267cefb2b8af9f07d1f3877c10c84ec571857ce8)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议持久操作意图并在恢复前核对站点，需对照现有 stale 和 URL 检查。

隔离站点对照导航、点击、服务重启和目标状态，统计准确率与成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1197 | 313198 | — | — | 2736902 |
| .mjs | source | 7 | 2402 | 1902 | 324 | — |
| .md | test | 2 | 269 | — | — | 1666 |
| .js | source | 77 | 154372 | 105328 | 32474 | — |
| .ts | test | 6 | 1174 | 850 | 124 | — |
| .ts | source | 8 | 1277 | 829 | 345 | — |
| .tsx | source | 10 | 1126 | 857 | 197 | — |
| .mts | source | 2 | 78 | 55 | 19 | — |
| .js | test | 5 | 1884 | 1432 | 130 | — |
| .md | example | 8 | 1677 | — | — | 12792 |
| .js | example | 5 | 469 | 405 | 35 | — |

</details>

**活跃度**

[![近30天新建 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=11&color=737b86&logo=github)](https://github.com/platonai/Browser4/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/platonai/Browser4/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查根平台 CLI、浏览器会话和外部动作边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Browser4，与简单脚本有什么不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要多页面交互、结构提取和任务管理的自动化开发者。人工浏览、HTTP 抓取或 Playwright 脚本已可处理网页；Browser4 将 Rust CLI、MCP 调用和浏览器后端组织成平台，增量是统一会话与批量入口，不是 CDP 或浏览器渲染原创。批处理适合可复用操作，但高吞吐和零模型 token 的作者主张不等于当前任务质量或总成本。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:55-61](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/README.md#L55-L61)

作者描述浏览器、批量和服务能力。

```text
### ✨ Key Capabilities

* 🤖 **Agent Browser** — AI agents and humans drive real browsers via a Rust CLI, MCP, and an agentic backend: navigate, click, fill, snapshot, batch, and loop.
* 🧬 **Zero-Token Extraction** — X-SQL + CSS selectors for deterministic extraction from live pages or stored HTML snapshots; WebMiner ML clustering turns HTML corpora into spreadsheet and report views with no LLM tokens.
* 🧠 **Hybrid Intelligence** — Combine LLM extraction, ML clustering, X-SQL, and a progressive experience store that reuses learned selectors and blockers.
* ⚡ **High-Performance Runtime** — Coroutine-safe, CDP-native engine designed for 100k–200k complex page visits per machine per day via swarm/crawl scale-out.
* 📦 **Enterprise-Scale Automation** — Swarm crawling, batch/loop jobs, stateful sessions, plugins, runtime skills, browser extension, and an opt-in MCP-over-HTTP endpoint.
```

**依据 2 · 源码核查**：[README.md:800-806](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/README.md#L800-L806)

作者描述 CLI、后端和工具分层。

````text
browser4-cli (Rust) ──MCP over HTTP──▶ browser4-rest (Kotlin/Spring) ──▶ PulsarWebDriver (Kotlin/CDP)
```

- **CLI** (`cli/browser4-cli`) — native Rust binary, talks to the backend via MCP tool calls
- **Backend** (`browser4-rest`) — Spring Boot server, dispatches MCP tools to browser drivers
- **Browser driver** (`browser4-core/browser4-browser`) — wraps Chrome DevTools Protocol
- **Agent tools** (`browser4-agentic`) — maps MCP tool names to browser automation methods
````

**依据 3 · 源码核查**：[cli/browser4-cli/src/main.rs:3418-3446](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3418-L3446)

代表导航到工具调用。

<details>
<summary>查看原文（29行）</summary>

```text
async fn handle_goto(
    client: &Client,
    base_url: &str,
    tool_name: &str,
    tool_params: &Value,
    session_name: Option<&str>,
) -> Result<(), String> {
    let (state, session_id, reused_existing_session) =
        get_or_create_navigation_session(client, base_url, tool_params, session_name, false)
            .await?;
    let target_url = tool_params
        .get("url")
        .and_then(|value| value.as_str())
        .unwrap_or("<unknown>");

    // Check whether the browser is already at the target URL before
    // navigating, so we can tell the user whether a navigation occurred.
    let was_already_at_url = if reused_existing_session {
        current_session_url(client, base_url, session_name)
            .await
            .map(|current| urls_match_for_display(&current, target_url))
            .unwrap_or(false)
    } else {
        false
    };

    let mut params = tool_params.clone();
    params["sessionId"] = json!(session_id.clone());
    let navigate_result = call_tool(client, base_url, tool_name, params.clone()).await;
```

</details>

#### 缺口

- 无真实站点和简单脚本对照
  **影响**：不能证明准确率、速度或费用
  **进一步探讨**：在授权测试站点比较抽取准确率、吞吐及故障恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 导航、点击和会话状态怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

CLI 读取或创建 session，将 sessionId 加入导航参数后调用后端工具；点击路径也通过 handle_tool_command 发送，并可检查标签变化。state 区分 Browser4 启动、CDP 附着、扩展附着和 swarm，不同类型的进程所有权不同；本地 state 只是保存的会话线索，不是页面或网站状态的完整事务快照。真实后端和浏览器未运行。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:27-44](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L27-L44)

四种会话所有权。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[cli/browser4-cli/src/main.rs:3418-3446](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3418-L3446)

导航调用与 sessionId。

<details>
<summary>查看原文（29行）</summary>

```text
async fn handle_goto(
    client: &Client,
    base_url: &str,
    tool_name: &str,
    tool_params: &Value,
    session_name: Option<&str>,
) -> Result<(), String> {
    let (state, session_id, reused_existing_session) =
        get_or_create_navigation_session(client, base_url, tool_params, session_name, false)
            .await?;
    let target_url = tool_params
        .get("url")
        .and_then(|value| value.as_str())
        .unwrap_or("<unknown>");

    // Check whether the browser is already at the target URL before
    // navigating, so we can tell the user whether a navigation occurred.
    let was_already_at_url = if reused_existing_session {
        current_session_url(client, base_url, session_name)
            .await
            .map(|current| urls_match_for_display(&current, target_url))
            .unwrap_or(false)
    } else {
        false
    };

    let mut params = tool_params.clone();
    params["sessionId"] = json!(session_id.clone());
    let navigate_result = call_tool(client, base_url, tool_name, params.clone()).await;
```

</details>

**依据 3 · 源码核查**：[cli/browser4-cli/src/main.rs:3800-3820](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3800-L3820)

点击工具调用和后续检查。

<details>
<summary>查看原文（21行）</summary>

```text
    .await
    .map(|resp| parse_tab_list(&resp).into_iter().map(|t| t.index).collect())
    .unwrap_or_default();

    // 3. Perform the click (backend handles same-tab navigation detection).
    Box::pin(handle_tool_command(
        client,
        base_url,
        tool_name,
        tool_params,
        false,
        session_name,
    ))
    .await?;

    // 4. Check for new tabs.
    let tabs_after: Vec<TabInfo> = Box::pin(call_tool(
        client,
        base_url,
        "browser_tabs",
        json!({ "sessionId": &sid, "action": "list" }),
```

</details>

**依据 4 · 源码核查**：[cli/browser4-cli/src/http.rs:458-480](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/http.rs#L458-L480)

通用工具调用接口。

<details>
<summary>查看原文（23行）</summary>

```text
pub async fn call_tool(
    client: &Client,
    base_url: &str,
    tool: &str,
    args: Value,
) -> Result<String, String> {
    call_tool_with_result(client, base_url, tool, args)
        .await
        .map(|r| r.text)
}

/// Like [call_tool] but allows overriding the default HTTP timeout.
/// Pass [None] to use the tool-specific default timeout.
pub async fn call_tool_with_timeout_override(
    client: &Client,
    base_url: &str,
    tool: &str,
    args: Value,
    timeout_override_secs: Option<u64>,
) -> Result<String, String> {
    let timeout = match timeout_override_secs {
        Some(secs) => std::time::Duration::from_secs(secs),
        None => effective_timeout(tool, &args),
```

</details>

#### 缺口

- 未测试实际浏览器和调用
  **影响**：无法证明网页动作、CDP 或扩展兼容
  **进一步探讨**：隔离后端运行导航与点击并核查页面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 恢复会话是否保证动作恰好一次？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

state 记录 session 类型、标识和 stale；CLI 处理没有显式 session 时查找默认或 swarm 的规则。状态重建或浏览器重新附着不能证明网页未提交，也不能把超时当作没有动作；网站后台与本地 state 不构成共同事务。不同 attach 类型所有权不同，不能假定关闭工具必定关闭外部浏览器。任何支付、发送或提交都要基于用户明确授权及目标站点后置条件核对。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:27-44](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L27-L44)

启动与附着类型。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[cli/browser4-cli/src/state.rs:149-156](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L149-L156)

stale 标记与后端重启。

```text
    /// Whether `stop` marked this record stale (see [`mark_all_sessions_stale`]).
    ///
    /// `stop` shuts the backend down, which drops every session it knew about;
    /// the records are kept so `list` can show the documented Stale/Refresh rows
    /// instead of the sessions vanishing.  The marker records that the session
    /// outlived its server: the next write clears it, because a write means the
    /// session was just validated against a (new) backend.
    #[serde(rename = "stale", default, skip_serializing_if = "is_false")]
```

**依据 3 · 源码核查**：[cli/browser4-cli/src/main.rs:605-621](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L605-L621)

默认与 swarm 会话解析。

<details>
<summary>查看原文（17行）</summary>

```text
// Session helpers
// ---------------------------------------------------------------------------

fn require_session(session_name: Option<&str>) -> Result<CliState, String> {
    let state = read_state(None, session_name);
    if state.session_id.is_none() {
        // When no explicit session name is given and the default slot is
        // empty, check whether a SWARM session exists.  Commands like
        // extract / summarize / agent run that follow `swarm create` should
        // automatically target the active swarm session.
        if session_name.is_none() {
            let swarm_state = read_state(None, Some(SWARM_SESSION_ID));
            if swarm_state.session_id.is_some() {
                return Ok(swarm_state);
            }
        }
        return Err(no_active_session_message());
```

</details>

**依据 4 · 源码核查**：[cli/browser4-cli/src/main.rs:3804-3813](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3804-L3813)

点击通过后端执行。

<details>
<summary>查看原文（10行）</summary>

```text
    // 3. Perform the click (backend handles same-tab navigation detection).
    Box::pin(handle_tool_command(
        client,
        base_url,
        tool_name,
        tool_params,
        false,
        session_name,
    ))
    .await?;
```

</details>

#### 缺口

- 未做断网、服务重启和真实页面测试
  **影响**：不能保证 exactly-once 或完整恢复
  **进一步探讨**：测试站点计数器对照点击提交和中断后状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、网络和退出要付出什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要 CLI、浏览器和后端运行时；可使用本地或远端架构，模型辅助功能另有 provider 依赖。首次安装、浏览器配置和会话状态，持续的计算、目标站点访问及人工核对都会消耗资源；高并发可能放大站点和故障影响。先在可控站点只读试用，数据敏感或外部操作状态不明时暂停；退出要按会话类型分别 detach/stop 并核对本地状态与网站结果。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:1-9](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L1-L9)

状态与运行时目录。

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

**依据 2 · 源码核查**：[cli/browser4-cli/src/state.rs:27-44](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L27-L44)

不同浏览器所有权。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[README.md:800-806](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/README.md#L800-L806)

作者描述本地服务分层。

````text
browser4-cli (Rust) ──MCP over HTTP──▶ browser4-rest (Kotlin/Spring) ──▶ PulsarWebDriver (Kotlin/CDP)
```

- **CLI** (`cli/browser4-cli`) — native Rust binary, talks to the backend via MCP tool calls
- **Backend** (`browser4-rest`) — Spring Boot server, dispatches MCP tools to browser drivers
- **Browser driver** (`browser4-core/browser4-browser`) — wraps Chrome DevTools Protocol
- **Agent tools** (`browser4-agentic`) — maps MCP tool names to browser automation methods
````

#### 缺口

- 未测资源、费用、远端鉴权和退出
  **影响**：无法证明低成本或全部资源清除
  **进一步探讨**：隔离环境记录运行时间、存储、服务和站点副作用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低恢复后重复提交？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 session 类型和 stale 标记以及导航前 URL 检查，新增一个恢复按钮或会话 ID 不是新机制。未验证方案是为有副作用的操作保存非敏感操作意图与目标状态，重启后先核对目标页面或服务结果并标未知，再由用户选择重试；不得把本地票据当网站确认。用测试站点比较中断前后重复次数、误判、延迟和人工工作，若无法改善或误报过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[cli/browser4-cli/src/state.rs:149-156](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/state.rs#L149-L156)

已有 stale 标记。

```text
    /// Whether `stop` marked this record stale (see [`mark_all_sessions_stale`]).
    ///
    /// `stop` shuts the backend down, which drops every session it knew about;
    /// the records are kept so `list` can show the documented Stale/Refresh rows
    /// instead of the sessions vanishing.  The marker records that the session
    /// outlived its server: the next write clears it, because a write means the
    /// session was just validated against a (new) backend.
    #[serde(rename = "stale", default, skip_serializing_if = "is_false")]
```

**依据 2 · 源码核查**：[cli/browser4-cli/src/main.rs:3433-3446](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3433-L3446)

已有导航前 URL 比较。

<details>
<summary>查看原文（14行）</summary>

```text
    // Check whether the browser is already at the target URL before
    // navigating, so we can tell the user whether a navigation occurred.
    let was_already_at_url = if reused_existing_session {
        current_session_url(client, base_url, session_name)
            .await
            .map(|current| urls_match_for_display(&current, target_url))
            .unwrap_or(false)
    } else {
        false
    };

    let mut params = tool_params.clone();
    params["sessionId"] = json!(session_id.clone());
    let navigate_result = call_tool(client, base_url, tool_name, params.clone()).await;
```

</details>

**依据 3 · 源码核查**：[cli/browser4-cli/src/main.rs:3804-3813](https://github.com/platonai/Browser4/blob/267cefb2b8af9f07d1f3877c10c84ec571857ce8/cli/browser4-cli/src/main.rs#L3804-L3813)

操作通过后端执行。

<details>
<summary>查看原文（10行）</summary>

```text
    // 3. Perform the click (backend handles same-tab navigation detection).
    Box::pin(handle_tool_command(
        client,
        base_url,
        tool_name,
        tool_params,
        false,
        session_name,
    ))
    .await?;
```

</details>

#### 缺口

- 方案未实现、站点状态不可通用识别
  **影响**：不能承诺幂等或无副作用
  **进一步探讨**：构造可计数测试服务并注入请求中断和重启。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
