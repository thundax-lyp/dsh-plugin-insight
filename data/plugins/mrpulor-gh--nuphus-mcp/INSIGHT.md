# nuphus-mcp

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[18caf18](https://github.com/mrpulor-gh/nuphus-mcp/tree/18caf18a2cb0f1bdba1137405dc93dacae92f7a2)

<!-- BEGIN META -->
[![GitHub ★ 333](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=333&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mrpulor-gh/nuphus-mcp)
<!-- END META -->

> **功能**：通过 stdio MCP 提供桌面、浏览器和视觉辅助操作。

> **亮点**：[Q01](#research-q01) 整合桌面及浏览器入口，[Q02](#research-q02) 对浏览器中断结果表达 unknown；效果未对照。

> **主要限制**：[Q03](#research-q03) 默认无严格确认，即使启用也只是检查客户端布尔参数，不保证用户授权。

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
  - [Q01 · 面向谁，相比手工或普通浏览器自动化增加什么？](#detail-section-11)
  - [Q02 · stdio 调用与不确定浏览器动作如何处理？](#detail-section-12)
  - [Q03 · 确认和桌面权限能否确保用户授权？](#detail-section-13)
  - [Q04 · 怎样限定平台、凭据和失败后的操作？](#detail-section-14)
  - [Q05 · 如何降低 unknown 后重复执行的风险？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要让 MCP 代理观察并操作本机桌面和浏览器的使用者。

手工桌面操作、独立浏览器自动化或其他 MCP 服务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 桌面工具 | 读取屏幕及发送输入 | 平台与权限不同 |
| 浏览器工具 | 通过 CDP 操作网页 | 已发送动作可能不可逆 |
| 严格确认 | 检查客户端 confirm 字段 | 默认关闭，不证明用户审批 |
| 视觉与 OCR | 解读截图 | 视觉服务可能外发内容 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| MCP 宿主或 DSH 桥 | 工具调用需要 | 启动 stdio 进程 | 无法调用 |
| 有权限的桌面环境 | 桌面操作需要 | 读取与控制 | 功能受限 |
| Chrome 或 Edge | 浏览器操作需要 | CDP | 相关工具失败 |
| 模型和凭据 | 视觉工具需要 | 图像理解 | 不可调用视觉服务 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 配置 | 用户检查平台、权限及桥接 | 使用隔离环境 |
| 观察 | Agent 获取屏幕或页面 | 确认目标 |
| 操作 | 通过客户端提交工具请求 | 需要授权并检查实际状态 |
| 复核 | 用户检查副作用 | unknown 时先观察再决定是否重试 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 桌面、宿主与浏览器 | 授权及配置 | 平台兼容未知 |
| 持续 | 模型、OCR 与网络 | 监督权限及复核结果 | 费用和成功率未知 |
| 故障 | 隔离账号和记录 | 观察副作用并恢复 | 操作可能不可逆 |

| 效果 | 材料 | 未知 |
|---|---|---|
| 桌面和浏览器工具 | 作者说明及服务接线 | 实际兼容 |
| 写入字段检查 | security 源码 | 用户授权是否实现 |
| unknown 状态 | 浏览器超时分支 | 重试效果 |

> **思考**：[Q03](#research-q03) 默认无严格确认，即使启用也只是检查客户端布尔参数，不保证用户授权。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 整合桌面及浏览器入口，[Q02](#research-q02) 对浏览器中断结果表达 unknown；效果未对照。

[Q02](#research-q02) 对执行上下文丢失返回 unknown；[Q03](#research-q03) 严格模式仍依赖客户端正确获取并传递授权。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认无严格确认，即使启用也只是检查客户端布尔参数，不保证用户授权。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离桌面用可撤销任务核对权限和结果；无法接受敏感内容或输入风险时停用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本局部静态检查；未运行目标、DSH、浏览器或视觉服务。

- 已检查：作者 README、包清单、源码路径 README.md、crates/nuphus-mcp/Cargo.toml、crates/nuphus-mcp/src/main.rs、crates/nuphus-mcp/src/server.rs、crates/nuphus-mcp/src/security.rs、crates/nuphus-browser/src/client.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 stdio 服务、调用安全策略、浏览器结果不确定分支与作者 DSH 接入说明；未审计所有工具分类与独立 DSH 桥。
- 下一步：在隔离宿主测试分类、审批、未知结果、浏览器断连与恢复；本轮未执行。

**分析版本**

- **仓库**：[mrpulor-gh/nuphus-mcp](https://github.com/mrpulor-gh/nuphus-mcp)
- **版本号**：未声明（[固定提交 18caf18](https://github.com/mrpulor-gh/nuphus-mcp/tree/18caf18a2cb0f1bdba1137405dc93dacae92f7a2)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对未知结果设置重试前观察，需验证重复动作和误阻断。

在隔离宿主测试分类、审批、未知结果、浏览器断连与恢复；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 4297 | — | — | 29299 |
| .js | source | 11 | 936 | 675 | 172 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/mrpulor-gh/nuphus-mcp/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/mrpulor-gh/nuphus-mcp/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mrpulor-gh/nuphus-mcp/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌面 MCP 调用、确认和结果不确定性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，相比手工或普通浏览器自动化增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者提供跨平台 stdio MCP 服务，让支持 MCP 的代理操作屏幕、窗口和 Chrome。相比手工操作，代理可调用统一工具；相比单一浏览器自动化，它还提供桌面和辅助功能能力，但具体平台能力不同。仓库明确本体不是 DSH 插件，DSH 需要独立桥或手工 MCP 配置；真实任务效率和成功率未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-22](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L5-L22)

服务器用途及 DSH 身份边界。

<details>
<summary>查看原文（18行）</summary>

```text
**Desktop automation MCP server — computer use for any AI agent. See the screen, control windows/mouse/keyboard, and drive Chrome over the Model Context Protocol (stdio). Desktop & browser automation need no API key; OCR runs locally; vision plugs into your own vision LLM (OpenAI-compatible or Anthropic native, BYOK).**

`nuphus-mcp` is a lightweight, cross-platform **desktop automation MCP server**
that exposes desktop + browser automation as standard MCP tools. It speaks
JSON-RPC 2.0 over stdio — no daemon, no network service, one binary. Claude
Desktop, Cursor, VS Code, Copilot, or any MCP client can connect and
immediately control the screen, windows, keyboard/mouse, and Chrome —
**computer use for any AI agent** — desktop & browser automation need no API
key; local OCR is built in; vision works with your own vision LLM
(OpenAI-compatible, BYOK).

> **🇨🇳 Mainland China mirror**: this repo is mirrored on
> [Gitee](https://gitee.com/nuphus/nuphus-mcp) for fast in-China access
> (Chinese docs served by default there). [中文文档](README.zh-CN.md)
>
> **Part of the Nuphus ecosystem**: [Nuphus](https://github.com/mrpulor-gh/nuphus) — a local-first AI agent with real desktop execution and dual-device (phone-as-second-screen) sync. nuphus-mcp exposes the same desktop + browser automation to any MCP client.
>
> **Using DeepSeek Harness (DSH)?** nuphus-mcp itself is a plain stdio MCP server — **not** a DSH/Cordis plugin. Install the dedicated [dsh-nuphus-mcp](https://github.com/mrpulor-gh/dsh-nuphus-mcp) plugin instead (see [DeepSeek Harness (DSH)](#deepseek-harness-dsh)).
```

</details>

**依据 2 · 作者声明**：[README.md:32-65](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L32-L65)

桌面、浏览器和视觉能力说明。

<details>
<summary>查看原文（34行）</summary>

```text
## Features

- **45 MCP tools** (22 desktop + 23 browser) — screenshots, window control,
  mouse/keyboard, Chrome CDP automation, and more — see [TOOLS.md](TOOLS.md) /
  [TOOLS.zh-CN.md](TOOLS.zh-CN.md) for the full reference.
- **Desktop automation**: screen size, screenshot (PNG/base64), window list,
  window activate/screenshot/move/resize/info, mouse click/drag/scroll/position,
  keyboard input/hotkey, clipboard write/clean — implemented on the
  `desktop-api` crate (xcap + Win32, no Tauri dependency).
- **Semantic desktop (Accessibility/UIA)** — 7 tools that drive native UI through
  the platform accessibility tree instead of pixel coordinates:
  `desktop_targets_list`, `desktop_target_bind`, `desktop_semantic_observe`,
  `desktop_semantic_candidate`, `desktop_semantic_execute`,
  `desktop_semantic_action`, `desktop_verify_state`. One contract —
  **observe → pick a candidate → execute → verify** — where native window
  handles, coordinates and platform locators never cross the MCP boundary; the
  caller only sees opaque ids and stable semantic locators. Backed by Windows UIA
  and the macOS Accessibility (AX) API.
- **Computer vision pair**: `desktop_vision` (BYOK — send a screenshot to your
  own vision model via an OpenAI-compatible or Anthropic native API) +
  `desktop_perceive` (local OCR with PaddleOCR, models auto-downloaded on first
  run; optional YOLO icon detection). Used together they give AI agents **both
  semantic understanding
  and pixel-precise coordinates** — the battle-tested vision→perceive flow from
  the Nuphus desktop app. See [TOOLS.md](TOOLS.md) for BYOK env vars, model
  setup, and the recommended flow.
- **Browser automation**: navigate, snapshot (accessibility tree with `@N`
  refs), click, type, exec, scroll, extract, screenshot, evaluate,
  back/forward, wait_for, cookies get/set/import, upload, tabs, downloads —
  implemented on `nuphus-browser` (chromiumoxide CDP).
- **Zero-cost stdio**: no HTTP server, no daemon. The process reads
  single-line JSON from stdin and writes responses to stdout.
- **Safety-first**: destructive tools are annotated per the MCP spec; optional
  strict-confirm mode; path validation for screenshots, uploads, and file drags.
```

</details>

**依据 3 · 作者声明**：[README.md:80-93](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L80-L93)

平台能力范围。

<details>
<summary>查看原文（14行）</summary>

```text
## Prerequisites

- **Rust toolchain** (stable) — build from source with Cargo.
- **Chrome or Edge** — required for browser tools. The server auto-detects an
  installed browser; if none is found, `browser_*` tools return a clear error.
- **Windows recommended** for full desktop control — see Platform Support below.

## Platform Support

| Platform | Browser tools | Desktop tools |
|----------|---------------|---------------|
| Windows  | Full          | Full (Win32 API) |
| macOS    | Full          | Semantic (AX) + mouse/keyboard (Accessibility permission required) |
| Linux    | Available     | Partial — window/input capabilities are limited |
```

</details>

#### 缺口

- 没有真实任务的对照和成功率
  **影响**：不能量化工作量节省
  **进一步探讨**：在各平台以隔离任务比较手工与 MCP 的成功率和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · stdio 调用与不确定浏览器动作如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

进程使用 stdin/stdout JSON-RPC，日志走 stderr，创建安全策略后进入服务循环；tools/call 校验参数与策略后分发执行。浏览器批处理在导航造成上下文丢失或内部 10 秒超时时返回 success unknown，超时后尝试取回已完成步骤；unknown 并不意味着没有副作用，调用者应观察后再决定是否重试。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/main.rs:50-81](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-mcp/src/main.rs#L50-L81)

安全策略、stdio 和循环。

<details>
<summary>查看原文（32行）</summary>

```text
async fn serve() -> Result<(), Box<dyn std::error::Error>> {
    tracing_subscriber::fmt()
        .with_env_filter(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "nuphus_mcp=info,warn".into()),
        )
        .with_writer(std::io::stderr) // stdout is reserved for the JSON-RPC protocol
        .init();

    // --confirm-write CLI flag overrides the environment variable
    let cli_confirm = std::env::args().any(|a| a == "--confirm-write");
    let policy = if cli_confirm {
        SecurityPolicy {
            strict_confirm: true,
        }
    } else {
        SecurityPolicy::from_env()
    };
    if policy.strict_confirm {
        tracing::warn!("[nuphus-mcp] STRICT CONFIRM MODE: write tools require \"confirm\": true");
    }

    let mut server = McpServer::with_policy(policy);
    let stdin = tokio::io::stdin();
    let mut reader = BufReader::new(stdin);
    let stdout = tokio::io::stdout();
    let mut writer = BufWriter::new(stdout);

    let mut line: Vec<u8> = Vec::new();
    loop {
        line.clear();
        let n = match read_line_capped(&mut reader, &mut line, MAX_LINE_BYTES).await {
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/server.rs:195-227](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-mcp/src/server.rs#L195-L227)

调用校验和执行路径。

<details>
<summary>查看原文（33行）</summary>

```text
    async fn tools_call(&self, params: Value) -> Dispatched {
        let name = match params.get("name").and_then(Value::as_str) {
            Some(n) if !n.is_empty() => n,
            _ => {
                return Dispatched::Err(RpcError::new(
                    codes::INVALID_PARAMS,
                    "tools/call: 'name' is required",
                ));
            }
        };
        let args = match params.get("arguments") {
            // Absent (or explicit null) arguments default to an empty object —
            // MCP clients commonly omit `arguments` for parameterless tools.
            None | Some(Value::Null) => json!({}),
            Some(v) if v.is_object() => v.clone(),
            Some(_) => {
                return Dispatched::Err(RpcError::new(
                    codes::INVALID_PARAMS,
                    "tools/call: 'arguments' must be an object",
                ));
            }
        };

        // Security boundary: in strict confirmation mode, write operations must carry confirm:true
        if let Err(msg) = self.policy.check_write_confirmation(name, &args) {
            let mut result = json!({
                "content": [ { "type": "text", "text": msg } ],
            });
            result["isError"] = json!(true);
            return Dispatched::Ok(result);
        }

        match execute_tool_isolated(name.to_owned(), args).await {
```

</details>

**依据 3 · 源码核查**：[crates/nuphus-browser/src/client.rs:2960-3023](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-browser/src/client.rs#L2960-L3023)

导航和超时的不确定完成状态。

<details>
<summary>查看原文（64行）</summary>

```text
        // ── Evaluate with internal timeout (10s) ──
        // page.evaluate() with awaitPromise can hang indefinitely if the page
        // navigates during execution (e.g. form submit click). We wrap it with
        // a 10s timeout and gracefully degrade on timeout / context-destroyed errors.
        let eval_result = tokio::time::timeout(
            std::time::Duration::from_secs(10),
            page_guard.evaluate(wrapped),
        )
        .await;

        match eval_result {
            Ok(Ok(result)) => {
                let value: String = result.into_value().unwrap_or_else(|_| "[]".to_string());
                Ok(value)
            }
            Ok(Err(e)) => {
                let err_str = e.to_string();
                // If the page navigated away (context destroyed), the completion
                // state is UNKNOWN — the script may or may not have finished, and
                // its _results died with the old context. Report that honestly
                // instead of claiming success.
                if err_str.contains("context was destroyed")
                    || err_str.contains("detached from frame")
                    || err_str.contains("Cannot find context")
                    || err_str.contains("execution context")
                {
                    tracing::warn!(
                        "[batch_exec] Execution context lost (page navigated): {}",
                        err_str
                    );
                    Ok(r#"[{"op":"batch_truncated","success":"unknown","detail":"Page navigated during execution; completion state unknown (results lost with the old page context)"}]"#.to_string())
                } else {
                    Err(BrowserError::Execution(err_str))
                }
            }
            Err(_elapsed) => {
                // Timeout: evaluate() hung, almost certainly because the page
                // navigated mid-execution and the JS promise never resolved. If the
                // page is still alive, salvage the steps that completed before the
                // hang (window.__nuphus._results) and report success:"unknown".
                tracing::warn!("[batch_exec] Timed out after 10s — page likely navigated");
                let salvaged = tokio::time::timeout(
                    std::time::Duration::from_secs(2),
                    page_guard.evaluate(
                        "JSON.stringify((window.__nuphus && window.__nuphus._results) || [])",
                    ),
                )
                .await;
                let done: String = match salvaged {
                    Ok(Ok(r)) => r.into_value().unwrap_or_else(|_| "[]".to_string()),
                    _ => "[]".to_string(),
                };
                let items = done
                    .trim()
                    .strip_prefix('[')
                    .and_then(|s| s.strip_suffix(']'))
                    .unwrap_or("")
                    .trim();
                let truncated = r#"{"op":"batch_truncated","success":"unknown","detail":"Execution timed out (page likely navigated); completion state unknown — any completed steps are appended after this entry"}"#;
                if items.is_empty() {
                    Ok(format!("[{truncated}]"))
                } else {
                    Ok(format!("[{truncated},{items}]"))
                }
```

</details>

#### 缺口

- 未运行 MCP 与浏览器进行实际故障注入
  **影响**：无法保证当前宿主可处理不确定结果
  **进一步探讨**：隔离网页模拟导航、超时与重复动作，核查返回及副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 确认和桌面权限能否确保用户授权？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

服务器默认 strict_confirm 为 false，开启后对被识别为写操作的请求要求客户端提供 confirm=true；这是调用参数检查，不自行验证真实用户是否看过或同意。作者说 DSH 专用桥默认启用，但桥属于另一个仓库，本项未核验；标准服务读取屏幕和操纵输入，外接浏览器或视觉模型引入额外数据与权限边界。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-mcp/src/security.rs:114-149](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-mcp/src/security.rs#L114-L149)

严格模式默认及布尔字段门控。

<details>
<summary>查看原文（36行）</summary>

```text
/// Security policy (determined at server startup, injectable for tests).
#[derive(Debug, Clone, Copy, PartialEq, Eq, Default)]
pub struct SecurityPolicy {
    /// Strict confirmation mode: write tools require explicit `"confirm": true`
    pub strict_confirm: bool,
}

impl SecurityPolicy {
    /// Read from environment variable (`NUPHUS_MCP_CONFIRM_WRITE=1`).
    pub fn from_env() -> Self {
        Self {
            strict_confirm: std::env::var("NUPHUS_MCP_CONFIRM_WRITE")
                .map(|v| v == "1" || v.eq_ignore_ascii_case("true"))
                .unwrap_or(false),
        }
    }

    /// Write confirmation check: in strict mode write tools must carry `"confirm": true`.
    /// Returns Err(msg) when execution should be rejected.
    pub fn check_write_confirmation(&self, name: &str, args: &Value) -> Result<(), String> {
        if !self.strict_confirm {
            return Ok(());
        }
        if !is_write_tool(name, args) {
            return Ok(());
        }
        let confirmed = args
            .get("confirm")
            .and_then(Value::as_bool)
            .unwrap_or(false);
        if confirmed {
            return Ok(());
        }
        Err(format!(
            "write operation '{}' requires explicit confirmation: set \"confirm\": true in arguments (strict confirm mode)",
            name
```

</details>

**依据 2 · 源码核查**：[crates/nuphus-mcp/src/server.rs:218-227](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-mcp/src/server.rs#L218-L227)

调用前检查。

<details>
<summary>查看原文（10行）</summary>

```text
        // Security boundary: in strict confirmation mode, write operations must carry confirm:true
        if let Err(msg) = self.policy.check_write_confirmation(name, &args) {
            let mut result = json!({
                "content": [ { "type": "text", "text": msg } ],
            });
            result["isError"] = json!(true);
            return Dispatched::Ok(result);
        }

        match execute_tool_isolated(name.to_owned(), args).await {
```

</details>

**依据 3 · 作者声明**：[README.md:269-274](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L269-L274)

默认写入与可选严格模式。

```text
### 🔒 Recommended: enable strict confirmation

This server can physically control the machine it runs on. By default write
tools run **without** confirmation; we strongly recommend enabling strict
confirmation so destructive operations require an explicit `"confirm": true`
argument from the client (otherwise the tool is rejected with `isError`).
```

**依据 4 · 作者声明**：[README.md:343-368](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L343-L368)

单独 DSH 桥和手工配置说明。

<details>
<summary>查看原文（26行）</summary>

````text
## DeepSeek Harness (DSH)

**Recommended — install the official
[dsh-nuphus-mcp](https://github.com/mrpulor-gh/dsh-nuphus-mcp) plugin** (Gitee
mirror: [gitee.com/nuphus/dsh-nuphus-mcp](https://gitee.com/nuphus/dsh-nuphus-mcp)).
It mounts nuphus-mcp into DSH as native tools with zero config —
`--confirm-write` on by default, no code change needed:

```sh
npx -p @deepseek-ai/dsh dsh plugin --profile web add github:mrpulor-gh/dsh-nuphus-mcp
```

**Manual alternative** — plug into
[DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) as a plain
stdio MCP server via its built-in MCP client (`@deepseek-ai/dsh-mcp-client`).
Mount in DSH's `cordis.yml` / patch:

```yaml
- id: nuphus-mcp
  name: '@deepseek-ai/dsh-mcp-client'
  config:
    serverName: nuphus-mcp
    transport: stdio
    command: nuphus-mcp
    args: ["--confirm-write"]
    toolCallTimeoutMs: 120000   # DSH default 60000 is too low for screenshots/OCR
````

</details>

#### 缺口

- 未审计所有工具的写分类及外部桥实现
  **影响**：不能保证所有动作受到门控或真实用户审批
  **进一步探讨**：逐项对照分类，隔离宿主检查用户确认与输入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定平台、凭据和失败后的操作？

**研究主题**：效果与总成本、采用判断

#### 完整回答

服务需要支持的桌面环境，浏览器工具依赖 Chrome/Edge，macOS 控制需要辅助功能权限，Linux 桌面功能部分受限；视觉工具按作者说明可将截图发送到用户配置的模型，OCR 模型可能下载。安装和模型服务、数据外发、错误动作及恢复成本需用户承担。优先以隔离桌面和可撤销操作验证，确认权限和目标，不能接受截图或输入风险则停止相关工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:80-93](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L80-L93)

平台与浏览器前提。

<details>
<summary>查看原文（14行）</summary>

```text
## Prerequisites

- **Rust toolchain** (stable) — build from source with Cargo.
- **Chrome or Edge** — required for browser tools. The server auto-detects an
  installed browser; if none is found, `browser_*` tools return a clear error.
- **Windows recommended** for full desktop control — see Platform Support below.

## Platform Support

| Platform | Browser tools | Desktop tools |
|----------|---------------|---------------|
| Windows  | Full          | Full (Win32 API) |
| macOS    | Full          | Semantic (AX) + mouse/keyboard (Accessibility permission required) |
| Linux    | Available     | Partial — window/input capabilities are limited |
```

</details>

**依据 2 · 作者声明**：[README.md:97-108](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L97-L108)

视觉模型与凭据条件。

<details>
<summary>查看原文（12行）</summary>

```text
## API Keys & Local Models

### Vision — BYOK, OpenAI-compatible or Anthropic native

`desktop_vision` uses **your own** vision model. It speaks two protocols:
- **OpenAI-compatible** Chat Completions (default) — works with OpenAI, MiniMax, Qwen, Ollama, vLLM, …
- **Anthropic native** Messages API — point `NUPHUS_MCP_VISION_BASE_URL` at
  `https://api.anthropic.com/v1` and the protocol is auto-detected from the host;
  or force it with `NUPHUS_MCP_VISION_PROVIDER=anthropic`.

Nothing is required unless you call this tool — and when it is not configured
the tool returns a clear error instead of silently failing.
```

</details>

**依据 3 · 作者声明**：[README.md:118-140](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L118-L140)

外部浏览器附着边界。

<details>
<summary>查看原文（23行）</summary>

````text
### External browser (anti-detect / fingerprint browsers)

By default `browser_*` tools launch and manage their own Chrome instance. To
drive an **external browser** instead — e.g. an anti-detect / fingerprint
browser — start it with a debugging port and point the server at it:

| Environment variable | Required | Default | Description |
|----------------------|----------|---------|-------------|
| `NUPHUS_MCP_BROWSER_CDP_URL` | — | — | External CDP endpoint, e.g. `http://127.0.0.1:9222` |

```sh
# Example: start your fingerprint browser with a debugging port
chrome --remote-debugging-port=9222 --user-data-dir=...
```

```jsonc
// MCP client config
"env": { "NUPHUS_MCP_BROWSER_CDP_URL": "http://127.0.0.1:9222" }
```

When set, `browser_*` tools attach to that endpoint and never launch a managed
Chrome; attach failures are hard errors (no silent fallback into the wrong
browser). The external browser belongs to you — the server never kills it on
````

</details>

**依据 4 · 作者声明**：[README.md:269-274](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/README.md#L269-L274)

严格确认默认关闭。

```text
### 🔒 Recommended: enable strict confirmation

This server can physically control the machine it runs on. By default write
tools run **without** confirmation; we strongly recommend enabling strict
confirmation so destructive operations require an explicit `"confirm": true`
argument from the client (otherwise the tool is rejected with `isError`).
```

#### 缺口

- 未验证平台权限、费用及退出恢复
  **影响**：无法确认净收益或取消成功
  **进一步探讨**：使用测试账户和无敏感桌面测超时、断连及撤销。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何降低 unknown 后重复执行的风险？

**研究主题**：新假设与验证

#### 完整回答

源码在批处理结果不明时明确返回 unknown；可探索在客户端强制先观察页面状态，再允许重试有副作用的动作。与现有返回 unknown 的机制相比，额外增量是把复核作为重试门槛，并非已经实现。对照模拟网络延迟和导航的相同任务，测重复提交率、误阻止及耗时；若没有改善或造成无法恢复则否定。

#### 证据与依据

**依据 1 · 源码核查**：[crates/nuphus-browser/src/client.rs:2975-3023](https://github.com/mrpulor-gh/nuphus-mcp/blob/18caf18a2cb0f1bdba1137405dc93dacae92f7a2/crates/nuphus-browser/src/client.rs#L2975-L3023)

未知结果与已完成步骤回收。

<details>
<summary>查看原文（49行）</summary>

```text
            Ok(Err(e)) => {
                let err_str = e.to_string();
                // If the page navigated away (context destroyed), the completion
                // state is UNKNOWN — the script may or may not have finished, and
                // its _results died with the old context. Report that honestly
                // instead of claiming success.
                if err_str.contains("context was destroyed")
                    || err_str.contains("detached from frame")
                    || err_str.contains("Cannot find context")
                    || err_str.contains("execution context")
                {
                    tracing::warn!(
                        "[batch_exec] Execution context lost (page navigated): {}",
                        err_str
                    );
                    Ok(r#"[{"op":"batch_truncated","success":"unknown","detail":"Page navigated during execution; completion state unknown (results lost with the old page context)"}]"#.to_string())
                } else {
                    Err(BrowserError::Execution(err_str))
                }
            }
            Err(_elapsed) => {
                // Timeout: evaluate() hung, almost certainly because the page
                // navigated mid-execution and the JS promise never resolved. If the
                // page is still alive, salvage the steps that completed before the
                // hang (window.__nuphus._results) and report success:"unknown".
                tracing::warn!("[batch_exec] Timed out after 10s — page likely navigated");
                let salvaged = tokio::time::timeout(
                    std::time::Duration::from_secs(2),
                    page_guard.evaluate(
                        "JSON.stringify((window.__nuphus && window.__nuphus._results) || [])",
                    ),
                )
                .await;
                let done: String = match salvaged {
                    Ok(Ok(r)) => r.into_value().unwrap_or_else(|_| "[]".to_string()),
                    _ => "[]".to_string(),
                };
                let items = done
                    .trim()
                    .strip_prefix('[')
                    .and_then(|s| s.strip_suffix(']'))
                    .unwrap_or("")
                    .trim();
                let truncated = r#"{"op":"batch_truncated","success":"unknown","detail":"Execution timed out (page likely navigated); completion state unknown — any completed steps are appended after this entry"}"#;
                if items.is_empty() {
                    Ok(format!("[{truncated}]"))
                } else {
                    Ok(format!("[{truncated},{items}]"))
                }
```

</details>

#### 缺口

- 客户端复核策略尚未实现或测试
  **影响**：不能声称可防重复动作
  **进一步探讨**：对照状态检查与直接重试的故障注入实验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
