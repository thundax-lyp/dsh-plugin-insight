# OpenPencil

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

分析版本：[9a618ce](https://github.com/ZSeven-W/openpencil/tree/9a618ce90bf2b308217a43d763de0970fe7b3b77)

<!-- BEGIN META -->
[![GitHub ★ 6,654](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C654&color=yellow&logo=github&style=flat)](https://github.com/ZSeven-W/openpencil)
<!-- END META -->

> **实现功能**：提供可编辑矢量画布，并通过MCP让Agent读取、创建和修改设计文档。

> **核心亮点**：[Q02](#research-q02)Agent工具直接修改编辑器文档模型，较生成平面图片保留结构化编辑增量；根项目是独立应用和MCP服务，DSH只是接入端之一。

> **风险与缺陷**：[Q03](#research-q03)DSH配置改动跨profile，且修改内存后保存失败存在需核对的状态窗口；可编辑草稿不等于生产设计合格。

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
  - [Q01 · 可编辑矢量设计相对生成图片或代码片段的增量是什么？](#detail-section-11)
  - [Q02 · MCP修改怎样到达编辑模型并落盘？](#detail-section-12)
  - [Q03 · 一键接入DSH和修改文档各有哪些状态风险？](#detail-section-13)
  - [Q04 · 独立设计工具与MCP桥是否值得接入？](#detail-section-14)
  - [Q05 · 能否让生成后的可编辑性成为验收条件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合希望Agent生成界面草稿后继续选择、修改和导出设计的开发者/设计者。合格结果是结构化可编辑.op文档且节点、页面和布局可核对，不是只得到一张截图。原办法是人工矢量编辑器、图片生成后重画或在代码中修改UI；编辑文档与Agent工具共享状态有机会减少重做。根项目是独立设计应用与MCP服务，不是DSH bundle，DSH通过MCP桥连接。作者“first”和多Agent更快不作为独立效果证据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 矢量文档编辑 | 保持节点与页面可编辑 | 需独立应用/服务 |
| MCP读写 | Agent修改同一模型 | 保存与并发需核对 |
| DSH接入 | 管理MCP配置块 | home级影响跨profile |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| OpenPencil应用或headless服务 | 必需 | 编辑文档 | 无画布后端 |
| MCP兼容客户端 | Agent操作必需 | 工具调用 | 只能人工编辑 |
| DSH MCP桥及home补丁 | DSH接入必需 | 服务连接 | 核对跨profile作用域 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 装应用并建可丢弃.op副本 | 文件可打开 |
| 2 | 配MCP并确认home补丁 | 读写小节点并回读 |
| 3 | 保存、重开和移除连接 | 版本不一致则停改 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 桌面/MCP服务 | 模型和连接配置 | 安装时间未知 |
| 持续 | 模型/图片调用 | 设计复核 | 费用与合格率未知 |
| 失败恢复 | 文档副本 | 核对磁盘与内存、恢复配置 | 并发恢复未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可编辑操作 | 工具→EditorCommand→落盘 | 设计质量与保真 |
| 配置恢复 | managed block和原子写 | 所有损坏配置的恢复 |

> **思考**：[Q03](#research-q03)DSH配置改动跨profile，且修改内存后保存失败存在需核对的状态窗口；可编辑草稿不等于生产设计合格。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02)Agent工具直接修改编辑器文档模型，较生成平面图片保留结构化编辑增量；根项目是独立应用和MCP服务，DSH只是接入端之一。

[Q02](#research-q02)Agent工具直接修改编辑器文档模型，较生成平面图片保留结构化编辑增量；根项目是独立应用和MCP服务，DSH只是接入端之一。

命令前验证、节点ID分配与managed配置块所有权有借鉴价值。Rust编辑核心不在JS/TS统计内；本轮抽读MCP编辑/保存链，不将作者多Agent并发主张当实际性能验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)DSH配置改动跨profile，且修改内存后保存失败存在需核对的状态窗口；可编辑草稿不等于生产设计合格。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要继续编辑AI设计草稿的开发者可先用可丢弃.op文档试用MCP。相比生成图片再重画，它直接修改结构化画布，但设计质量与导出保真未实测。若保存失败或跨profile配置范围不清，就停止改生产稿并恢复副本或原编辑器。 依据 [Q01](#research-q01)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有实现为固定源码检查支持；用户收益未实测；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、crates/op-host-desktop/src/mcp_integrations_dsh.rs、crates/op-host-desktop/src/mcp_config_io.rs、crates/op-host-desktop/src/mcp_serve.rs、crates/op-host-services/src/mcp_serve.rs、crates/op-editor-core/src/command_apply.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮只读固定提交，未执行目标代码或宿主验收；效果、人工耗时及持续采用情况未知。
- 下一步：以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

**分析版本**

- **仓库**：[ZSeven-W/openpencil](https://github.com/ZSeven-W/openpencil)
- **版本号**：未声明（[固定提交 9a618ce](https://github.com/ZSeven-W/openpencil/tree/9a618ce90bf2b308217a43d763de0970fe7b3b77)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出小批revision与快照验收的未验证假设，用并发和保存故障比较误覆盖与恢复。

以原办法为对照执行同一合格任务，记录错误、人工干预和退出恢复；涉及真实副作用前先在可丢弃数据上验证。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 206 | 37805 | — | — | 276105 |
| .js | source | 22 | 12168 | 9631 | 1981 | — |
| .mjs | test | 2 | 734 | 544 | 137 | — |
| .ts | source | 43 | 6129 | 3495 | 2068 | — |
| .mjs | source | 6 | 1393 | 1157 | 117 | — |
| .ts | test | 29 | 2516 | 2155 | 208 | — |
| .mjs | example | 1 | 92 | 51 | 34 | — |
| .tsx | source | 1 | 62 | 39 | 17 | — |
| .tsx | test | 4 | 64 | 60 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=grey&logo=github&style=flat)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=grey&logo=github&style=flat)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+created%3A2026-09-26T09%3A32%3A52.339Z..2026-10-26T09%3A32%3A52.339Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T09%3A32%3A52.339Z..2026-10-26T09%3A32%3A52.339Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查OpenPencil的具体任务增量、关键失败条件与可控采用路径。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 可编辑矢量设计相对生成图片或代码片段的增量是什么？

**研究主题**：场景与需求、采用判断

#### 完整回答

适合希望Agent生成界面草稿后继续选择、修改和导出设计的开发者/设计者。合格结果是结构化可编辑.op文档且节点、页面和布局可核对，不是只得到一张截图。原办法是人工矢量编辑器、图片生成后重画或在代码中修改UI；编辑文档与Agent工具共享状态有机会减少重做。根项目是独立设计应用与MCP服务，不是DSH bundle，DSH通过MCP桥连接。作者“first”和多Agent更快不作为独立效果证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:77-102](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/README.md#L77-L102)

作者画布、团队与MCP场景

<details>
<summary>查看原文（26行）</summary>

```text
### 🎨 Prompt → Canvas

Describe any UI in natural language. Watch it appear on the infinite canvas in real-time with streaming animation. Modify existing designs by selecting elements and chatting.

</td>
<td width="50%">

### 🤖 Concurrent Agent Teams

The orchestrator decomposes complex pages into spatial sub-tasks. Multiple AI agents work on different sections simultaneously — hero, features, footer — all streaming in parallel with per-member canvas indicators.

</td>
</tr>
<tr>
<td width="50%">

### 🧠 Multi-Model Intelligence

Automatically adapts to each model's capabilities. Claude gets full prompts with thinking; GPT-4o/Gemini disable thinking; smaller models (MiniMax, Qwen, Llama) get simplified prompts for reliable output.

</td>
<td width="50%">

### 🔌 MCP Server

One-click install into Claude Code, Codex, OpenCode, Kiro, or Copilot CLIs. Design from your terminal — read, create, and modify `.op` files through any MCP-compatible agent.
```

</details>

#### 缺口

- 专业设计任务的需求强度、编辑保真和节时收益未独立测量。
  **影响**：无法将可编辑结构增量换算为设计者的真实采用收益。
  **进一步探讨**：让设计者在同一简单页面任务比较图片重画、原编辑器与MCP草稿，核对编辑时间与质量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP修改怎样到达编辑模型并落盘？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

桌面argv可进入stdio或HTTP MCP模式而不打开GUI；共享host服务把工具命令转成EditorCommand。file-backed路径先state.apply，拒绝则不继续写，成功后修复并save_editor_state，再标记auto_finalize。EditorState按节点/页面解析命令，分配器支持协作ID。对照只生成SVG/图片，直接修改同一编辑模型是实质增量；不从函数名推断布局质量或多Agent并发无冲突。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/mcp_serve.rs:10-30](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-desktop/src/mcp_serve.rs#L10-L30)

桌面无界面模式转交共享服务

<details>
<summary>查看原文（21行）</summary>

```text
/// If argv requests a headless server mode, run it and return `true` —
/// the caller (`main`) should then exit. Returns `false` for normal
/// GUI mode. Exits the process on a malformed invocation.
///
/// - `--mcp <path>` — JSON-RPC stdio MCP server backed by `<path>`.
/// - `--mcp-http <port> <path>` — Streamable-HTTP MCP server.
/// - `--serve-web <port> [doc] [--host <addr>]` — headless web-canvas daemon.
///
/// External CLIs (Claude Code / Codex / OpenCode / Kiro / Copilot /
/// Antigravity / Grok Build) spawn the binary in these modes to drive
/// the Rust editor.
pub fn run_cli_if_requested() -> bool {
    let mut args = std::env::args().skip(1);
    let Some(first) = args.next() else {
        return false;
    };
    match op_host_services::cli_modes::run_cli_mode("openpencil-desktop", &first, args) {
        Some(0) => true,
        Some(code) => std::process::exit(code),
        // Unknown leading arg → fall through to GUI mode for now.
        None => false,
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:182-215](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-services/src/mcp_serve.rs#L182-L215)

修改、修复、落盘、finalize链

<details>
<summary>查看原文（34行）</summary>

```text
fn process_message_with_auto_finalize(
    state: &mut EditorState,
    path: &Path,
    line: &str,
    mut auto_finalize: Option<&mut auto_finalize::AutoFinalize>,
) -> Result<Option<String>, McpServeError> {
    if let Some(response) = file_path::process_message_for_file_path_arg(Some(path), line)? {
        return Ok(Some(response));
    }
    let explicit_finalize =
        op_mcp::parse_tool_call(line.trim()).is_some_and(|call| call.tool == "finalize_design");
    let mut applier_failed: Option<String> = None;
    let mut apply_rejected = false;
    // File-backed mode has no live canvas for any tool call to animate —
    // the tool name is accepted (shared signature with the live-MCP path)
    // and deliberately ignored here.
    let response = process_message_with_applier(state, line, |_tool_name, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        run_write_repairs_after_apply(state);
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
        }
        if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
            auto_finalize.note_write(Instant::now());
        }
        true
    })?;
```

</details>

**依据 3 · 源码核查**：[crates/op-editor-core/src/command_apply.rs:49-97](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-editor-core/src/command_apply.rs#L49-L97)

命令应用与页面/分配器处理

<details>
<summary>查看原文（49行）</summary>

```text
impl EditorState {
    /// Apply a command using the caller's document-wide id policy.
    ///
    /// Collaboration hosts pass their session-owned namespaced allocator.
    /// Validation failures remain `Ok(false)`; allocator exhaustion is typed
    /// so the host can roll back the surrounding local edit transaction.
    pub fn apply_with_allocator(
        &mut self,
        cmd: EditorCommand,
        allocator: &mut dyn IdAllocator,
    ) -> Result<bool, IdAllocError> {
        let marks_document_dirty = command_marks_document_dirty(&cmd);
        let revision_before = self.revision;
        let changed = match cmd {
            // --- Raw node CRUD -------------------------------------
            EditorCommand::InsertNode {
                kind,
                name,
                x,
                y,
                width,
                height,
                fill_hex,
                target_parent,
                page_id,
            } => {
                let Some(target_page_index) = command_page_index(self, page_id.as_deref()) else {
                    return Ok(false);
                };
                let original_page_index = self.ui.active_page_index;
                if page_id.is_some() {
                    self.ui.active_page_index = target_page_index;
                }
                let changed = apply_insert_node_on_active_page(
                    self,
                    &kind,
                    &name,
                    x,
                    y,
                    width,
                    height,
                    &fill_hex,
                    &target_parent,
                    allocator,
                );
                if page_id.is_some() && target_page_index != original_page_index {
                    self.ui.active_page_index = original_page_index;
                }
                changed?
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 一键接入DSH和修改文档各有哪些状态风险？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

DSH安装写home级cordis.patch.yml而不是单个profile，因此作用范围跨profile；managed block有独占标记，孤立标记或手写条目删除时拒绝猜测，以免损伤用户配置。配置写入使用临时文件和原子替换，但设计模型先修改后保存，save失败会返回false并记录applier_failed，本段没有看到自动还原此前内存state，需区分内存与磁盘状态。并发Agent、live canvas和file-backed不同路径也不能由单一路径成功互相担保。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:1-14](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L1-L14)

home级全profile作用范围

<details>
<summary>查看原文（14行）</summary>

```text
//! DeepSeek Harness (dsh) MCP patch-file editing.
//!
//! dsh's MCP bridge plugin (`@deepseek-ai/dsh-mcp-client`) is configured
//! through the home-level patch layer `$DSH_HOME/cordis.patch.yml` (default
//! `~/.dsh/cordis.patch.yml`), which applies after every profile's own patch
//! and before `--patch` — one file, effective across all profiles. The file
//! is a top-level YAML array of patches; a new plugin instance is an
//! `insert` entry WITHOUT an `id` (verified against dsh's
//! `applyEntryPatches`, which pushes id-less inserts onto the top level).
//!
//! The writer is line-based on purpose — like `update_codex_config` it edits
//! only the marker block it owns and never re-serializes the file, so no
//! YAML dependency and no comment/formatting loss in the user's own
//! entries.
```

</details>

**依据 2 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:83-104](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L83-L104)

managed block边界

<details>
<summary>查看原文（22行）</summary>

```text
/// Install / update / remove the OpenPencil managed block in a dsh
/// `cordis.patch.yml`.
///
/// Enable:
/// - managed block present → rewrite the block in place (the port may have
///   changed, nothing else is touched);
/// - lone marker → error ([`McpConfigError::DshPatchMarkersMismatched`]);
/// - file missing → create it with the block alone (valid YAML at the
///   top-level-array position);
/// - a `[]` line exists (the default patch file shape, comments allowed
///   around it) → replace that line with the block, keeping the comments;
/// - otherwise (user entries present, or comments only) → append the block
///   at the end after one blank line.
///
/// Disable:
/// - managed block present → remove the block including both markers,
///   leaving everything else byte-identical;
/// - lone marker or a marker-less `mcp-openpencil` / `serverName: openpencil`
///   entry → error ([`McpConfigError::DshPatchMarkersMismatched`] /
///   [`McpConfigError::DshManualEntry`]) — never delete hand-written or
///   hand-edited content silently;
/// - nothing OpenPencil-related → no-op.
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:198-218](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-services/src/mcp_serve.rs#L198-L218)

保存失败的内存磁盘边界

<details>
<summary>查看原文（21行）</summary>

```text
    let response = process_message_with_applier(state, line, |_tool_name, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        run_write_repairs_after_apply(state);
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
        }
        if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
            auto_finalize.note_write(Instant::now());
        }
        true
    })?;
    if let Some(ref msg) = applier_failed {
        eprintln!("openpencil-desktop mcp: {msg}");
    }
```

</details>

**依据 4 · 源码核查**：[crates/op-host-desktop/src/mcp_config_io.rs:60-76](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-desktop/src/mcp_config_io.rs#L60-L76)

配置原子写接口

<details>
<summary>查看原文（17行）</summary>

```text
pub(crate) fn atomic_write(path: &Path, bytes: &[u8]) -> Result<(), McpConfigError> {
    let permissions = fs::metadata(path)
        .ok()
        .map(|metadata| metadata.permissions());
    atomic_write_with_permissions(path, bytes, permissions)
}

/// Crash-safe write: sibling temp + fsync + atomic replace. The temp
/// creation and the (Windows FFI) destination swap delegate to
/// `op_host_services::doc_io::atomic_file` — the desktop crate no longer
/// keeps its own ReplaceFileW/MoveFileExW copy.
fn atomic_write_with_permissions(
    path: &Path,
    bytes: &[u8],
    permissions: Option<Permissions>,
) -> Result<(), McpConfigError> {
    use op_host_services::doc_io::atomic_file;
```

</details>

#### 缺口

- save失败后是否在上层回滚、live MCP并发和服务访问控制未完整核查。
  **影响**：保存失败可能使内存/磁盘不一致，服务访问控制未核清影响部署范围。
  **进一步探讨**：沿doc_io和上层事务检查save失败回滚，核对MCP监听认证，并注入并发同节点与磁盘不可写故障。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 独立设计工具与MCP桥是否值得接入？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次要装桌面或无界面服务、配置模型和MCP，DSH home补丁还需确认影响的profile；持续可能有模型/图片生成费用和设计人工复核，实际金额未知。失败先保留.op副本并核对磁盘版本，退出时只移除自己管理的MCP块，手写内容需人工处理。对可丢弃小草稿存在可控试用路径，生产设计稿应先确认保存、恢复和导出保真，不把AI草稿当已合格设计。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:83-104](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L83-L104)

可控移除范围

<details>
<summary>查看原文（22行）</summary>

```text
/// Install / update / remove the OpenPencil managed block in a dsh
/// `cordis.patch.yml`.
///
/// Enable:
/// - managed block present → rewrite the block in place (the port may have
///   changed, nothing else is touched);
/// - lone marker → error ([`McpConfigError::DshPatchMarkersMismatched`]);
/// - file missing → create it with the block alone (valid YAML at the
///   top-level-array position);
/// - a `[]` line exists (the default patch file shape, comments allowed
///   around it) → replace that line with the block, keeping the comments;
/// - otherwise (user entries present, or comments only) → append the block
///   at the end after one blank line.
///
/// Disable:
/// - managed block present → remove the block including both markers,
///   leaving everything else byte-identical;
/// - lone marker or a marker-less `mcp-openpencil` / `serverName: openpencil`
///   entry → error ([`McpConfigError::DshPatchMarkersMismatched`] /
///   [`McpConfigError::DshManualEntry`]) — never delete hand-written or
///   hand-edited content silently;
/// - nothing OpenPencil-related → no-op.
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:198-218](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-services/src/mcp_serve.rs#L198-L218)

修改后保存与失败提示

<details>
<summary>查看原文（21行）</summary>

```text
    let response = process_message_with_applier(state, line, |_tool_name, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        run_write_repairs_after_apply(state);
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
        }
        if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
            auto_finalize.note_write(Instant::now());
        }
        true
    })?;
    if let Some(ref msg) = applier_failed {
        eprintln!("openpencil-desktop mcp: {msg}");
    }
```

</details>

#### 缺口

- 模型调用成本、导出保真和实际恢复时间未测。
  **影响**：设计稿导出与恢复保真未知，不能直接替换生产设计流程。
  **进一步探讨**：在副本执行保存重开、导出再导入和managed block移除，记录丢失属性及修复时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让生成后的可编辑性成为验收条件？

**研究主题**：新假设与验证

#### 完整回答

由工具直改EditorState和save失败窗口推导未验证假设：每批Agent编辑绑定预期文档revision、保存前快照和编辑后结构核对，可把“看起来完成”提升为可恢复文档变更。对照当前逐命令落盘与小批revision事务，注入坏节点、并发改同节点及磁盘不可写，核对是否保留上次合格文档、误覆盖和人工修正时间；若事务阻塞明显且不改善恢复，则只对高影响替换启用。该设想未在本次源码中被确认为完整机制。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-editor-core/src/command_apply.rs:49-62](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-editor-core/src/command_apply.rs#L49-L62)

revision和命令入口可作约束基础

<details>
<summary>查看原文（14行）</summary>

```text
impl EditorState {
    /// Apply a command using the caller's document-wide id policy.
    ///
    /// Collaboration hosts pass their session-owned namespaced allocator.
    /// Validation failures remain `Ok(false)`; allocator exhaustion is typed
    /// so the host can roll back the surrounding local edit transaction.
    pub fn apply_with_allocator(
        &mut self,
        cmd: EditorCommand,
        allocator: &mut dyn IdAllocator,
    ) -> Result<bool, IdAllocError> {
        let marks_document_dirty = command_marks_document_dirty(&cmd);
        let revision_before = self.revision;
        let changed = match cmd {
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:198-218](https://github.com/ZSeven-W/openpencil/blob/9a618ce90bf2b308217a43d763de0970fe7b3b77/crates/op-host-services/src/mcp_serve.rs#L198-L218)

修改保存窗口提供故障验证对象

<details>
<summary>查看原文（21行）</summary>

```text
    let response = process_message_with_applier(state, line, |_tool_name, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        run_write_repairs_after_apply(state);
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
        }
        if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
            auto_finalize.note_write(Instant::now());
        }
        true
    })?;
    if let Some(ref msg) = applier_failed {
        eprintln!("openpencil-desktop mcp: {msg}");
    }
```

</details>

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
