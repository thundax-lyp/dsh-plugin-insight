# sivtr

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ef81cc0](https://github.com/Ariestar/sivtr/tree/ef81cc056b8ec38ef38c27d114c22dcea1e37953)

<!-- BEGIN META -->
[![GitHub ★ 255](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=255&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ariestar/sivtr)
<!-- END META -->

> **功能**：采集并搜索终端输出与 Agent 会话，提供 CLI 和 MCP 访问。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 统一工作记录并对 DSH 提供格式解析；效果未对照。

> **主要限制**：[Q03](#research-q03) DSH 不受 MCP 自动安装管理，日志采集和远程脱敏仍需核查权限与覆盖。

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
  - [Q01 · 谁需要跨终端和 Agent 会话查找工作记录，相比手工搜索增加什么？](#detail-section-11)
  - [Q02 · DSH 会话如何发现、读取并提供检索入口？](#detail-section-12)
  - [Q03 · DSH 安装路径与隐私边界是什么？](#detail-section-13)
  - [Q04 · 何时值得试用，如何控制数据与配置负担？](#detail-section-14)
  - [Q05 · 如何使 DSH 读取范围与缺失更易被用户判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要跨终端和 Agent 工作记录查找错误及上下文的开发者。

手工搜索本地日志或复制终端输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| DSH 解析 | 读取会话表面事件 | 仅格式版本 0 |
| MCP 查询 | 搜索并展开 ref | DSH 需自行配置连接 |
| shell 采集 | 记录终端工作 | 涉及本地敏感信息 |
| 远程共享 | 跨设备读取 | 脱敏不能保证覆盖全部秘密 |

**流程与依赖**

| 依赖 | 条件 | 作用 | 缺失影响 |
|---|---|---|---|
| sivtr CLI 与系统权限 | 采集和查询需要 | 读取、存储记录 | 无法查询 |
| 可读 DSH 日志 | DSH 来源需要 | 发现与解析会话 | 无该来源数据 |
| DSH MCP 配置 | DSH 内调用需要 | 连接工具 | 不会自动配置 |
| embedding 服务 | 仅语义搜索 | 生成向量 | 结构化搜索仍可用 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 配置 | 用户选采集范围并连接 MCP | 验证权限和数据位置 |
| 同步 | CLI 读取目标来源 | 核对来源状态 |
| 查找 | Agent 调用搜索和展开 | 验证 ref 与原文 |
| 退出 | 用户停用 hook 和连接 | 检查历史数据残留 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | CLI、权限和存储 | 配置 shell 与 DSH MCP | 宿主兼容未知 |
| 持续 | 索引存储和可选模型服务 | 核对来源及敏感数据 | 费用和检索质量未知 |
| 退出 | 配置与 archive | 停采集、清理残留 | 清理效果未测 |

| 效果 | 材料 | 未知 |
|---|---|---|
| DSH 日志解析 | provider 及事件投影源码 | 新版本兼容 |
| 引用查询 | MCP 调用 | 命中率和效果 |
| 远程脱敏 | 记录字段调用 privacy | 规则覆盖 |

> **思考**：[Q03](#research-q03) DSH 不受 MCP 自动安装管理，日志采集和远程脱敏仍需核查权限与覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 统一工作记录并对 DSH 提供格式解析；效果未对照。

[Q02](#research-q02) 针对 DSH 会话格式和 zstd 尾部提供边界；[Q03](#research-q03) 不应将特定路径脱敏等同全部数据安全。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) DSH 不受 MCP 自动安装管理，日志采集和远程脱敏仍需核查权限与覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用隔离记录检查采集、权限与查询；不接受数据边界时停用相应采集或共享。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本局部源码检查；未运行 CLI、DSH 或远程服务。

- 已检查：作者 README、包清单、源码路径 README.md、Cargo.toml、crates/sivtr-core/src/agents/dsh.rs、src/mcp/server.rs、src/commands/system/mcp.rs、src/remote/redact.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 DSH provider、MCP 工具与安装管理边界和远程脱敏入口；未审计所有 provider、完整索引和远程权限路径。
- 下一步：隔离数据测试 DSH 日志读取、MCP 配置、远程权限和删除恢复；本轮未执行。

**分析版本**

- **仓库**：[Ariestar/sivtr](https://github.com/Ariestar/sivtr)
- **版本号**：未声明（[固定提交 ef81cc0](https://github.com/Ariestar/sivtr/tree/ef81cc056b8ec38ef38c27d114c22dcea1e37953)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出显示解析覆盖和截断信息，需对照现有界面与用户误判。

隔离数据测试 DSH 日志读取、MCP 配置、远程权限和删除恢复；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 100 | 13996 | — | — | 97186 |
| .cjs | example | 1 | 43 | 29 | 11 | — |
| .mjs | source | 2 | 488 | 450 | 4 | — |
| .ts | source | 8 | 877 | 779 | 8 | — |
| .ts | test | 3 | 275 | 251 | 6 | — |
| .mjs | test | 1 | 109 | 91 | 3 | — |

</details>

**活跃度**

[![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Ariestar/sivtr/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)

暂未获取：Issue 未关闭、近30天新建。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 会话解析、MCP 连接与隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要跨终端和 Agent 会话查找工作记录，相比手工搜索增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向需要回看终端错误或先前 Agent 对话的开发者，作者描述将不同来源合入可搜索 archive，并通过 ref 展开证据。手工搜索日志或复制终端输出同样可完成部分工作；统一查询与定位可减少跨格式切换，但效率和搜索质量未经同任务对照。它是独立 Rust CLI/MCP 工具及 Skill，不是原生 DSH 插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-63](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/README.md#L40-L63)

场景、统一 archive 与搜索功能。

<details>
<summary>查看原文（24行）</summary>

```text
## 为什么需要 sivtr？

开发者和 Agent 经常浪费时间重建已经存在的上下文：终端报错、测试输出、工具日志、之前的 AI 会话。`sivtr` 把这些本地工作变成可搜索的记忆，但不要求你引入一套很重的知识系统。

有了 `sivtr`，你可以：

- 让 Agent 修复最近一次失败，而不用自己粘贴日志；
- 几秒钟找回昨天的测试输出、构建报错或关键决策；
- 从摘要跳回当时那条命令输出或 Agent 回复；
- 把一组有用结果保存成 `@failures` 这样的变量，在下一条命令里继续用。

> [!IMPORTANT]
> Agent 工作流建议安装 `sivtr` CLI，用 `sivtr mcp install` 注册 MCP，并可选用内置 `sivtr-memory` skill。MCP 是 Agent 读取本地证据的主路径；skill 负责教它何时、如何调用。

## 特性

- **MCP 优先的 Agent 记忆**：一次 `sivtr mcp install`，Agent 直接调用 search/show/zoom/filter/status/usage/stats 工具，不用你粘贴日志。
- **保留输出的终端捕获**：记录 Bash、Zsh、PowerShell、Nushell 里的命令、stdout/stderr、退出码、目录和耗时；`pipe` 和 `run` 直接写入同一个 archive。
- **统一本地 archive**：所有终端和 Agent session 先同步到一个 `archive.db`；provider 只负责发现和解析，搜索、筛选、导出、TUI、MCP、Web API 共用同一份记录模型。
- **40+ Agent provider**：Codex / Claude Code / Cursor / Dsh / Gemini / Goose / Hermes / OpenCode / OpenClaw / Grok / Pi / Qoder / Qoder-CN / Qwen，以及更多 JSONL、SQLite、目录和容器格式——同一个 registry 和查询面。
- **精确证据，而不是摘要**：每个命中都落到稳定 ref，可 show / zoom / filter，或交给下一个 Agent。
- **命名记忆变量**：把结果保存成 `@failures`，复用 `@last`，管道用 `@`，也可 `@failures[1,3..5]` 取子集。
- **用量与成本**：从 transcript 提取 token usage，用精确微美元整数和内置 pricing snapshot 计算成本；未知价格明确显示为 unpriced，不猜价格。
- **可选 semantic / hybrid search**：配置一个 OpenAI-compatible embedding endpoint 后，用向量排序或 RRF 融合 BM25；不配置时结构化搜索仍完整可用。
```

</details>

**依据 2 · 源码核查**：[Cargo.toml:1-30](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/Cargo.toml#L1-L30)

工作区和 Rust CLI 入口。

<details>
<summary>查看原文（30行）</summary>

```text
[workspace]
members = ["crates/sivtr-core", "."]
resolver = "2"

[workspace.package]
version = "0.8.3"
edition = "2021"
license = "Apache-2.0"
rust-version = "1.95"
repository = "https://github.com/Ariestar/sivtr"

[package]
name = "sivtr"
version.workspace = true
edition.workspace = true
license.workspace = true
rust-version.workspace = true
repository.workspace = true
description = "Terminal output workspace for the AI era - capture, browse, search, select, and reuse terminal output and AI coding sessions"
keywords = ["terminal", "cli", "tui", "agents", "ai"]
categories = ["command-line-utilities", "development-tools"]
exclude = [
    "/docs-site/public/demo/**",
    "/docs-site/dist/**",
    "/docs-site/node_modules/**",
    "/editors/vscode/node_modules/**",
    "/editors/vscode/out/**",
    "/editors/vscode/*.vsix",
    "/docs/**",
]
```

</details>

#### 缺口

- 缺少手工及替代方案的同任务对照
  **影响**：无法量化检索收益
  **进一步探讨**：用固定历史记录比较命中率、定位准确性和人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 会话如何发现、读取并提供检索入口？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DshProvider 从 DSH_HOME 或默认 ~/.dsh 的 sessions 下发现 session.jsonl 及 .zstd，按配置读取和解压后解析可见 user、assistant、tool result 事件；它只接受会话格式版本 0，坏的尾部帧被丢弃。MCP 暴露 search、show、zoom，调用相应查询模块；这不证明当前 DSH 版本的全部事件语义已覆盖，也不是逐字重放。

#### 证据与依据

**依据 1 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:36-109](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/crates/sivtr-core/src/agents/dsh.rs#L36-L109)

版本、provider、发现和文件类型。

<details>
<summary>查看原文（74行）</summary>

```text
const PROVIDER_NAME: &str = "Dsh";

/// On-disk session log format version this build understands. dsh refuses
/// logs with any other version ("upgrade the harness"), so sivtr does too.
const SESSION_FORMAT_VERSION: u64 = 0;

/// Decompressed byte cap for listing metadata reads (covers the header frame
/// and the first flush batch, where the title normally lands).
const META_READ_CAP: usize = 4 * 1024 * 1024;

/// Compressed byte cap for the same metadata read. The header is always the
/// first line of the first frame, so a torn first frame still yields id/cwd.
const META_COMPRESSED_READ_CAP: u64 = 8 * 1024 * 1024;

/// Maximum lines scanned from a metadata read.
const META_MAX_LINES: usize = 1000;

/// Maximum accepted zstd window. Node's built-in zstd (what dsh uses) stays
/// far below this; the generous cap avoids truncating sessions re-encoded
/// with a high-level zstd CLI. Decoding is local, trusted input.
const MAX_ZSTD_WINDOW: u64 = 256 * 1024 * 1024;

#[derive(Debug, Clone, Copy, Default)]
pub struct DshProvider;

impl AgentSessionProvider for DshProvider {
    fn provider(&self) -> AgentProvider {
        AgentProvider::Dsh
    }

    fn list_recent_sessions(&self, cwd: Option<&Path>) -> Result<Vec<SessionInfo>> {
        let root = sessions_root();
        list_sessions_matching(
            PROVIDER_NAME,
            &root,
            cwd,
            |path, is_dir| !is_dir && is_dsh_log(path),
            |_| Vec::new(),
            parse_session_meta,
        )
    }

    fn parse_session_file(&self, path: &Path) -> Result<AgentSession> {
        let bytes = read_log(path).with_context(|| {
            format!("Failed to read {PROVIDER_NAME} session: {}", path.display())
        })?;
        let text = std::str::from_utf8(&bytes)
            .with_context(|| format!("{PROVIDER_NAME} session is not UTF-8: {}", path.display()))?;
        parse_log_text(path, text)
    }
}

/// Harness home: `$DSH_HOME`, else `~/.dsh`.
pub fn dsh_home() -> PathBuf {
    if let Ok(path) = std::env::var("DSH_HOME") {
        return PathBuf::from(path);
    }
    dirs::home_dir()
        .unwrap_or_else(|| PathBuf::from("."))
        .join(".dsh")
}

/// Default session-log root of the JSONL persistence backend.
fn sessions_root() -> PathBuf {
    dsh_home().join("sessions")
}

/// Whether the file is a dsh session log artifact (`session.jsonl` /
/// `session.jsonl.zstd`), whichever encoding the deployment uses.
fn is_dsh_log(path: &Path) -> bool {
    matches!(
        path.file_name().and_then(|name| name.to_str()),
        Some("session.jsonl") | Some("session.jsonl.zstd")
    )
```

</details>

**依据 2 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:161-199](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/crates/sivtr-core/src/agents/dsh.rs#L161-L199)

多帧解压及尾部损坏处理。

<details>
<summary>查看原文（39行）</summary>

```text
/// Decompress a concatenation of independent Zstandard frames (dsh's layout:
/// one checksummed frame for the header line, then one frame per flush
/// batch). A torn or unreadable trailing frame is dropped, mirroring the
/// JSONL backend's crash-recovery truncation; `cap` bounds decompressed
/// output for head reads.
fn decode_zstd(bytes: &[u8], cap: Option<usize>) -> Result<Vec<u8>> {
    use ruzstd::decoding::StreamingDecoder;

    let mut out = Vec::new();
    let mut rest = bytes;
    while !rest.is_empty() && cap.is_none_or(|cap| out.len() < cap) {
        let mut cursor = std::io::Cursor::new(rest);
        let mut decoder =
            match StreamingDecoder::new_with_max_window_size(&mut cursor, MAX_ZSTD_WINDOW) {
                // Not a readable frame header: torn tail or trailing bytes. Keep
                // the complete frames decoded so far.
                Err(_) => break,
                Ok(decoder) => decoder,
            };
        let mut frame = Vec::new();
        let limit = cap.map(|cap| cap.saturating_sub(out.len()));
        let result = match limit {
            Some(limit) => decoder.by_ref().take(limit as u64).read_to_end(&mut frame),
            None => decoder.read_to_end(&mut frame),
        };
        let consumed = decoder.get_ref().position() as usize;
        match result {
            Ok(_) => {
                out.extend_from_slice(&frame);
                if consumed == 0 {
                    break;
                }
                rest = &rest[consumed..];
            }
            // Torn frame body: keep only the frames completed before it.
            Err(_) => break,
        }
    }
    Ok(out)
```

</details>

**依据 3 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:278-325](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/crates/sivtr-core/src/agents/dsh.rs#L278-L325)

可见事件投影与 JSON 错误处理。

<details>
<summary>查看原文（48行）</summary>

```text
/// Full parse of one session log into blocks, following dsh's derived-history
/// projection: `user/message` (non-plugin), `assistant/message` parts, and
/// `tool/result` contents. `tool/call` events only supply the callId → tool
/// name map used to label tool results.
fn parse_log_text(path: &Path, text: &str) -> Result<AgentSession> {
    let mut session = AgentSession {
        path: path.to_path_buf(),
        id: None,
        cwd: None,
        title: None,
        blocks: Vec::new(),
    };
    let mut tool_names: HashMap<String, String> = HashMap::new();
    let mut first_user: Option<String> = None;
    let mut header_seen = false;

    for (idx, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        let value: Value = match serde_json::from_str(line) {
            Ok(value) => value,
            // Torn tail line without a newline: dsh keeps a torn tail only
            // for the in-progress batch, so treat it as the end of the log.
            Err(error) if header_seen && error.classify() == serde_json::error::Category::Eof => {
                break;
            }
            Err(error) => {
                return Err(error).with_context(|| {
                    format!(
                        "Failed to parse {PROVIDER_NAME} session line {} as JSON: {}",
                        idx + 1,
                        path.display()
                    )
                });
            }
        };
        if !header_seen {
            if value.get("type").and_then(Value::as_str) != Some("session") {
                return Err(missing_session_header(path));
            }
            check_format_version(&value)?;
            session.id = value.get("id").and_then(Value::as_str).map(str::to_string);
            session.cwd = value.get("cwd").and_then(Value::as_str).map(str::to_string);
            header_seen = true;
            continue;
        }
        apply_event(&mut session, &mut tool_names, &mut first_user, &value);
```

</details>

**依据 4 · 源码核查**：[src/mcp/server.rs:38-79](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/mcp/server.rs#L38-L79)

查询工具调用。

<details>
<summary>查看原文（42行）</summary>

```text
    #[tool(
        description = "Search local or mounted remote workspace memory (terminal + AI sessions). Uses the same bounds as CLI search: defaults to latest=5 when neither latest nor limit is set. Prefer narrow queries. Returns refs and compact summaries by default."
    )]
    fn sivtr_search(
        &self,
        Parameters(params): Parameters<SearchParams>,
    ) -> Result<CallToolResult, McpError> {
        let detail = params.detail.clone();
        let save = params.save.clone();
        let args = to_search_args(&params).map_err(invalid_params)?;
        let set = search::run(&args).map_err(tool_error)?;
        let result = memory_result(&set, detail.as_deref(), save).map_err(tool_error)?;
        ok_json(result)
    }

    #[tool(
        description = "Show exact content for a WorkRef or WorkSet handle (@last, @name, desk:terminal/...). Use after search to expand evidence."
    )]
    fn sivtr_show(
        &self,
        Parameters(params): Parameters<ShowParams>,
    ) -> Result<CallToolResult, McpError> {
        let mode = params.mode.clone();
        let args = to_show_args(&params).map_err(invalid_params)?;
        let set = show::run(&args).map_err(tool_error)?;
        let result = show_result(&set, mode.as_deref()).map_err(tool_error)?;
        ok_json(result)
    }

    #[tool(
        description = "Expand neighboring records around search hits (default source @last). Useful for handoff context."
    )]
    fn sivtr_zoom(
        &self,
        Parameters(params): Parameters<ZoomParams>,
    ) -> Result<CallToolResult, McpError> {
        let detail = params.detail.clone();
        let save = params.save.clone();
        let args = to_zoom_args(&params);
        let set = zoom::run(&args).map_err(tool_error)?;
        let result = memory_result(&set, detail.as_deref(), save).map_err(tool_error)?;
        ok_json(result)
```

</details>

#### 缺口

- 未执行实际 DSH 会话及查询
  **影响**：不能证明宿主兼容和检索结果完整
  **进一步探讨**：用隔离 DSH 数据验证未完成尾部、surface 操作及结果引用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · DSH 安装路径与隐私边界是什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

虽然 README 建议运行 MCP install，源码明确 DSH 不在自动管理的 MCP 宿主列表，要求在 DSH 自身配置中设置；不能把通用自动安装说明视作 DSH 已注册。工具读取历史内容，远程共享代码对标题、消息、工具输入输出调用 secret redaction，但模式匹配并不证明所有敏感内容可识别；本轮未审计本地存储或全部外发路径。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-58](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/README.md#L51-L58)

作者的通用 MCP 建议。

```text
> [!IMPORTANT]
> Agent 工作流建议安装 `sivtr` CLI，用 `sivtr mcp install` 注册 MCP，并可选用内置 `sivtr-memory` skill。MCP 是 Agent 读取本地证据的主路径；skill 负责教它何时、如何调用。

## 特性

- **MCP 优先的 Agent 记忆**：一次 `sivtr mcp install`，Agent 直接调用 search/show/zoom/filter/status/usage/stats 工具，不用你粘贴日志。
- **保留输出的终端捕获**：记录 Bash、Zsh、PowerShell、Nushell 里的命令、stdout/stderr、退出码、目录和耗时；`pipe` 和 `run` 直接写入同一个 archive。
- **统一本地 archive**：所有终端和 Agent session 先同步到一个 `archive.db`；provider 只负责发现和解析，搜索、筛选、导出、TUI、MCP、Web API 共用同一份记录模型。
```

**依据 2 · 源码核查**：[src/commands/system/mcp.rs:196-209](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/commands/system/mcp.rs#L196-L209)

DSH 不受自动管理的 MCP 注册边界。

<details>
<summary>查看原文（14行）</summary>

```text
/// Look up the managed MCP host entry for a provider, or explain why there is
/// none. Hosts without an entry (e.g. dsh, whose MCP clients are configured as
/// plugin rows in the harness profile's `cordis.patch.yml`) fail loudly
/// instead of panicking on the user-facing paths.
fn mcp_host(provider: AgentProvider) -> Result<&'static McpHostSpec> {
    MCP_HOSTS
        .iter()
        .find(|host| host.provider == provider)
        .ok_or_else(|| {
            anyhow::anyhow!(
                "sivtr does not manage MCP server configuration for `{}`; \
                 configure the host's MCP clients in its own config instead",
                provider.command_name()
            )
```

</details>

**依据 3 · 源码核查**：[src/remote/redact.rs:1-18](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/remote/redact.rs#L1-L18)

远程记录标题和片段的脱敏。

<details>
<summary>查看原文（18行）</summary>

```text
//! Shared secret redaction for the live remote-sharing transport.
//!
//! The implementation lives in `sivtr-core::privacy` so public publication
//! and device-to-device sharing cannot silently drift apart.

use anyhow::Result;
use sivtr_core::privacy;
use sivtr_core::record::{WorkContent, WorkPart, WorkPartBody, WorkRecord, WorkTarget};

pub fn redact_record(record: &WorkRecord) -> Result<WorkRecord> {
    let mut out = record.clone();
    out.title = privacy::redact_text(&out.title)?;
    out.parts = out
        .parts
        .into_iter()
        .map(redact_part)
        .collect::<Result<Vec<_>>>()?;
    Ok(out)
```

</details>

**依据 4 · 源码核查**：[src/remote/redact.rs:21-47](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/remote/redact.rs#L21-L47)

消息及工具输入输出脱敏。

<details>
<summary>查看原文（27行）</summary>

```text
pub fn redact_part(mut part: WorkPart) -> Result<WorkPart> {
    match &mut part.body {
        WorkPartBody::Message { label, content, .. } => {
            if let Some(label) = label {
                *label = privacy::redact_text(label)?;
            }
            redact_content(content)?;
        }
        WorkPartBody::Action {
            title,
            target,
            input,
            output,
            ..
        } => {
            if let Some(title) = title {
                *title = privacy::redact_text(title)?;
            }
            redact_target(target)?;
            if let Some(input) = input {
                redact_content(input)?;
            }
            for block in output {
                redact_content(&mut block.content)?;
            }
        }
    }
```

</details>

#### 缺口

- 未审计脱敏规则覆盖和远程访问控制
  **影响**：不能保证数据不会泄露
  **进一步探讨**：在隔离实例检查授权并以合成凭据测试分享和导出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得试用，如何控制数据与配置负担？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要运行 CLI、为采集配置 shell 或同步来源；DSH MCP 连接需手工处理，可能存储命令和会话敏感内容。读取与索引占本地空间、同步和可选 embedding 有计算和服务成本，实际金额未知。先用测试数据、限定工作目录并检查 archive 权限；若无法接受日志采集、远程共享或外部 embedding 的数据边界，停止相关功能并移除相应配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:99-111](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/README.md#L99-L111)

setup、shell 采集与停用说明。

<details>
<summary>查看原文（13行）</summary>

````text
首次安装（采集 + MCP 宿主）：

```bash
sivtr setup                  # 采集 + MCP 宿主 + sivtr-memory skill（缺失时安装）
# 或分步：
sivtr init all              # 或单个 shell：bash、zsh、nushell、powershell
sivtr mcp install            # 检测已装宿主；或 -p claude,cursor,codex,opencode,openclaw,grok,hermes,pi,qoder,qodercn,gemini,qwen,goose
npx skills add Ariestar/sivtr --skill sivtr-memory -g -y
sivtr doctor
```

> [!NOTE]
> `sivtr setup` 或 `sivtr init` 安装 shell 集成后，**新开一个 shell** 即可捕获命令输出，无需额外启用。升级后重新运行 `init` 会原位更新旧 hook。要暂停捕获，用 `sivtr config edit` 设置 `[pty_proxy] enabled = false` 并重启 shell；安装和升级都会保留这个显式关闭设置。
````

</details>

**依据 2 · 作者声明**：[README.md:54-65](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/README.md#L54-L65)

多来源、可选 embedding 与远程共享。

<details>
<summary>查看原文（12行）</summary>

```text
## 特性

- **MCP 优先的 Agent 记忆**：一次 `sivtr mcp install`，Agent 直接调用 search/show/zoom/filter/status/usage/stats 工具，不用你粘贴日志。
- **保留输出的终端捕获**：记录 Bash、Zsh、PowerShell、Nushell 里的命令、stdout/stderr、退出码、目录和耗时；`pipe` 和 `run` 直接写入同一个 archive。
- **统一本地 archive**：所有终端和 Agent session 先同步到一个 `archive.db`；provider 只负责发现和解析，搜索、筛选、导出、TUI、MCP、Web API 共用同一份记录模型。
- **40+ Agent provider**：Codex / Claude Code / Cursor / Dsh / Gemini / Goose / Hermes / OpenCode / OpenClaw / Grok / Pi / Qoder / Qoder-CN / Qwen，以及更多 JSONL、SQLite、目录和容器格式——同一个 registry 和查询面。
- **精确证据，而不是摘要**：每个命中都落到稳定 ref，可 show / zoom / filter，或交给下一个 Agent。
- **命名记忆变量**：把结果保存成 `@failures`，复用 `@last`，管道用 `@`，也可 `@failures[1,3..5]` 取子集。
- **用量与成本**：从 transcript 提取 token usage，用精确微美元整数和内置 pricing snapshot 计算成本；未知价格明确显示为 unpriced，不猜价格。
- **可选 semantic / hybrid search**：配置一个 OpenAI-compatible embedding endpoint 后，用向量排序或 RRF 融合 BM25；不配置时结构化搜索仍完整可用。
- **统计、质量和可移植导入导出**：`stats`、secret findings、starred sessions、Claude.ai/ChatGPT JSON/ZIP 导入，以及 JSON/JSONL/Markdown/HTML 导出。
- **跨设备访问**：只读分享 workspace，用 `desk:...` ref 像读本地一样浏览另一台设备；多设备还能组成 `group`，成员间自动同步、一次 `sync` 拉齐。
```

</details>

**依据 3 · 源码核查**：[src/commands/system/mcp.rs:196-209](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/commands/system/mcp.rs#L196-L209)

DSH 需自行配置 MCP。

<details>
<summary>查看原文（14行）</summary>

```text
/// Look up the managed MCP host entry for a provider, or explain why there is
/// none. Hosts without an entry (e.g. dsh, whose MCP clients are configured as
/// plugin rows in the harness profile's `cordis.patch.yml`) fail loudly
/// instead of panicking on the user-facing paths.
fn mcp_host(provider: AgentProvider) -> Result<&'static McpHostSpec> {
    MCP_HOSTS
        .iter()
        .find(|host| host.provider == provider)
        .ok_or_else(|| {
            anyhow::anyhow!(
                "sivtr does not manage MCP server configuration for `{}`; \
                 configure the host's MCP clients in its own config instead",
                provider.command_name()
            )
```

</details>

#### 缺口

- 未测试禁用、卸载和已采集数据清理
  **影响**：不能确认退出后状态和残留
  **进一步探讨**：以隔离数据核对停用 hook、移除 MCP 和清理 archive。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何使 DSH 读取范围与缺失更易被用户判断？

**研究主题**：新假设与验证

#### 完整回答

当前 parser 限于版本 0 和选定表面事件，MCP 查询可按 ref 展开。可假设在 DSH 搜索结果中增加解析版本、跳过类型和截断提示，能帮助用户区分无记录与未覆盖；需先核对现有界面是否已有等价状态。与现有显示对照，测用户识别缺失事件、查找耗时及误判；若无提升或噪声过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:36-56](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/crates/sivtr-core/src/agents/dsh.rs#L36-L56)

版本和读取上限。

<details>
<summary>查看原文（21行）</summary>

```text
const PROVIDER_NAME: &str = "Dsh";

/// On-disk session log format version this build understands. dsh refuses
/// logs with any other version ("upgrade the harness"), so sivtr does too.
const SESSION_FORMAT_VERSION: u64 = 0;

/// Decompressed byte cap for listing metadata reads (covers the header frame
/// and the first flush batch, where the title normally lands).
const META_READ_CAP: usize = 4 * 1024 * 1024;

/// Compressed byte cap for the same metadata read. The header is always the
/// first line of the first frame, so a torn first frame still yields id/cwd.
const META_COMPRESSED_READ_CAP: u64 = 8 * 1024 * 1024;

/// Maximum lines scanned from a metadata read.
const META_MAX_LINES: usize = 1000;

/// Maximum accepted zstd window. Node's built-in zstd (what dsh uses) stays
/// far below this; the generous cap avoids truncating sessions re-encoded
/// with a high-level zstd CLI. Decoding is local, trusted input.
const MAX_ZSTD_WINDOW: u64 = 256 * 1024 * 1024;
```

</details>

**依据 2 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:278-303](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/crates/sivtr-core/src/agents/dsh.rs#L278-L303)

事件投影和尾部处理。

<details>
<summary>查看原文（26行）</summary>

```text
/// Full parse of one session log into blocks, following dsh's derived-history
/// projection: `user/message` (non-plugin), `assistant/message` parts, and
/// `tool/result` contents. `tool/call` events only supply the callId → tool
/// name map used to label tool results.
fn parse_log_text(path: &Path, text: &str) -> Result<AgentSession> {
    let mut session = AgentSession {
        path: path.to_path_buf(),
        id: None,
        cwd: None,
        title: None,
        blocks: Vec::new(),
    };
    let mut tool_names: HashMap<String, String> = HashMap::new();
    let mut first_user: Option<String> = None;
    let mut header_seen = false;

    for (idx, line) in text.lines().enumerate() {
        if line.trim().is_empty() {
            continue;
        }
        let value: Value = match serde_json::from_str(line) {
            Ok(value) => value,
            // Torn tail line without a newline: dsh keeps a torn tail only
            // for the in-progress batch, so treat it as the end of the log.
            Err(error) if header_seen && error.classify() == serde_json::error::Category::Eof => {
                break;
```

</details>

**依据 3 · 源码核查**：[src/mcp/server.rs:38-64](https://github.com/Ariestar/sivtr/blob/ef81cc056b8ec38ef38c27d114c22dcea1e37953/src/mcp/server.rs#L38-L64)

搜索与按 ref 展开。

<details>
<summary>查看原文（27行）</summary>

```text
    #[tool(
        description = "Search local or mounted remote workspace memory (terminal + AI sessions). Uses the same bounds as CLI search: defaults to latest=5 when neither latest nor limit is set. Prefer narrow queries. Returns refs and compact summaries by default."
    )]
    fn sivtr_search(
        &self,
        Parameters(params): Parameters<SearchParams>,
    ) -> Result<CallToolResult, McpError> {
        let detail = params.detail.clone();
        let save = params.save.clone();
        let args = to_search_args(&params).map_err(invalid_params)?;
        let set = search::run(&args).map_err(tool_error)?;
        let result = memory_result(&set, detail.as_deref(), save).map_err(tool_error)?;
        ok_json(result)
    }

    #[tool(
        description = "Show exact content for a WorkRef or WorkSet handle (@last, @name, desk:terminal/...). Use after search to expand evidence."
    )]
    fn sivtr_show(
        &self,
        Parameters(params): Parameters<ShowParams>,
    ) -> Result<CallToolResult, McpError> {
        let mode = params.mode.clone();
        let args = to_show_args(&params).map_err(invalid_params)?;
        let set = show::run(&args).map_err(tool_error)?;
        let result = show_result(&set, mode.as_deref()).map_err(tool_error)?;
        ok_json(result)
```

</details>

#### 缺口

- 现有 UI 是否显示等价覆盖状态未穷尽
  **影响**：不能断定提案新颖或有效
  **进一步探讨**：完整核查输出后以损坏与新版本日志进行对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
