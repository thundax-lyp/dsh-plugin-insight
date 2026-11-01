# OpenPencil

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[68d0123](https://github.com/ZSeven-W/openpencil/tree/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf)

<!-- BEGIN META -->
[![GitHub ★ 6,991](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6%2C991&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/openpencil)
<!-- END META -->

> **功能**：支持 AI Agent 和 MCP 的开源矢量设计工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示 Agent 工具可操作可序列化编辑状态，较平面图保留节点级编辑的潜力；任务效果仍需验收。

> **主要限制**：[Q03](#research-q03) 的主路径先修改内存再保存，失败后该片段未显示回滚；[Q04](#research-q04) 的 DSH 配置位于 home 层，真实宿主配置生效范围尚待核实。

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
  - [Q01 · 哪些人需要 Agent 辅助可编辑设计，相比图片与人工编辑有何增量？](#detail-section-11)
  - [Q02 · MCP 调用如何改变文件、保存与输出？](#detail-section-12)
  - [Q03 · 写入失败、并发和文件切换有哪些边界？](#detail-section-13)
  - [Q04 · DSH 如何接入，范围与权限是什么？](#detail-section-14)
  - [Q05 · 采用、成本和退路如何判断？](#detail-section-15)
  - [Q06 · 能否用可比较的修订及保存确认减少误覆盖？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要生成后继续编辑和导出设计稿的设计者及开发者。

人工矢量编辑器或生成图片后重画均能完成设计；结构化编辑提供另一条路径，实际任务收益未比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 结构化编辑 | 在画布上组织设计并保存 .op | 设计准确性和任务效率未验证 |
| MCP 接入 | 将工具命令应用到编辑状态 | 宿主连接和访问 profile 需核验 |
| 代码导出 | 从目标节点生成代码 | 生成效果及视觉一致性未验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 OpenPencil 运行环境 | 客户端使用必需 | 打开、编辑和保存文档 | 无法进行对应操作 |
| Rust 1.94 与构建依赖 | 源码构建需要 | 编译 workspace | 构建不可用；发布包不必据此推断 |
| Agent/模型与网络 | AI 生成按配置需要 | 产生设计或后续修改 | 可视具体客户端回退人工编辑 |
| DSH MCP 客户端与可达服务 | 仅 DSH 接入需要 | 宿主调用设计工具 | 该接入不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份 .op 并核对宿主及权限 | 保留可恢复副本 |
| 创建 | 用户或 Agent 提交设计命令 | 节点及结构可检查 |
| 保存与导出 | 用户检查保存结果并重开、导出 | 对照页面及视觉结果 |
| 恢复 | 保存失败时暂停写入并核对磁盘与内存 | 保留备份，确认后再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载、构建和模型费用未知 | 配置宿主、备份文档 | 源码构建与发布包条件不同 |
| 持续 | 模型调用、存储资源未知 | 校正设计并验收导出 | 节省时间未测 |
| 恢复 | 备份及重试资源未知 | 核查磁盘、状态和误覆盖 | 并发和故障未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 可编辑文档 | 保存 EditorState 到 .op | 与图片重画的时间差 |
| MCP 设计命令 | 解析并应用工具命令 | 真实宿主、模型和并发效果 |
| 安全保存 | 临时文件替换及失败错误 | 全部故障和多进程一致性 |

> **思考**：[Q03](#research-q03) 的主路径先修改内存再保存，失败后该片段未显示回滚；[Q04](#research-q04) 的 DSH 配置位于 home 层，真实宿主配置生效范围尚待核实。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示 Agent 工具可操作可序列化编辑状态，较平面图保留节点级编辑的潜力；任务效果仍需验收。

[Q02](#research-q02) 在命令应用失败时返回工具错误并用临时文件保存；[Q03](#research-q03) 的内存先变更窗口仍需故障实验，不能据源码断言端到端事务。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的主路径先修改内存再保存，失败后该片段未显示回滚；[Q04](#research-q04) 的 DSH 配置位于 home 层，真实宿主配置生效范围尚待核实。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在隔离副本上试一项可验收设计，核对保存与导出；无法确认状态或权限时停止写入并回退备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本客户端与 MCP 保存、配置源码已检查；宿主运行、设计质量、导出效果和新方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、Cargo.toml、crates/op-host-desktop/src/mcp_serve.rs、crates/op-host-desktop/src/mcp_integrations.rs、crates/op-host-desktop/src/mcp_integrations_dsh.rs、crates/op-host-services/src/mcp_serve.rs、crates/op-host-services/src/mcp_serve/file_path.rs、crates/op-host-services/src/mcp_serve/auto_finalize.rs、crates/op-host-services/src/doc_io.rs、crates/op-editor-core/src/state.rs、crates/op-mcp/src/lib.rs、crates/op-mcp/src/codegen_export_tool.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交 README、构建声明、桌面 MCP 入口、文件模式、保存与 DSH 配置；未运行程序、宿主、模型或导出，也未审计全部工具和并发协议。工程统计未列 Rust 源码，且有一处 JS 测试夹具解析错误，不能当作完整代码统计或目标构建失败证明。
- 下一步：在固定宿主及隔离文档上验证 MCP 连接、结构化编辑、保存重开和导出，再按 [Q06](#research-q06) 注入并发与保存故障并比较状态。

**分析版本**

- **仓库**：[ZSeven-W/openpencil](https://github.com/ZSeven-W/openpencil)
- **版本号**：未声明（[固定提交 68d0123](https://github.com/ZSeven-W/openpencil/tree/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设持久文件摘要比对、跨进程互斥与暂存发布可降低误覆盖和失败分叉；已有 revision 和临时替换并非新增，方案未验证。

在固定宿主及隔离文档上验证 MCP 连接、结构化编辑、保存重开和导出，再按 [Q06](#research-q06) 注入并发与保存故障并比较状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 212 | 38057 | — | — | 279096 |
| .js | source | 34 | 12910 | 10220 | 2047 | — |
| .mjs | test | 2 | 734 | 544 | 137 | — |
| .js | example | 28 | 1197 | 1009 | 35 | — |
| .md | example | 1 | 15 | — | — | 199 |
| .ts | source | 43 | 6129 | 3495 | 2068 | — |
| .mjs | source | 6 | 1393 | 1157 | 117 | — |
| .ts | test | 29 | 2516 | 2155 | 208 | — |
| .mjs | example | 1 | 92 | 51 | 34 | — |
| .tsx | source | 1 | 62 | 39 | 17 | — |
| .tsx | test | 4 | 64 | 60 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=18&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=10&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查独立设计客户端的编辑、保存、MCP 与 DSH 采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些人需要 Agent 辅助可编辑设计，相比图片与人工编辑有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是希望让 Agent 提出界面或视觉草稿、再由人继续选择和修改的设计者或开发者。README.md:42-51 描述自然语言到画布和多 Agent 并行，81-83 描述 JSON 格式设计文档及代码导出；其中首次和效率主张没有独立对照。doc_io.rs:1-13、89-96 的保存路径将 EditorState 文档序列化为 .op；MCP 调用的命令也作用于该编辑状态。相比仅返回平面图片，结构化文档可支持节点级编辑；相比人工矢量工具，是否节省时间取决于设计质量、修正和验收，尚未测量。不能把存在导出当成视觉一致或生产可用证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-51](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/README.md#L42-L51)

作者描述对话画布与并发设计。

<details>
<summary>查看原文（10行）</summary>

```text
### 🎨 Prompt → Canvas

Describe any UI in natural language. Watch it appear on the infinite canvas in real-time with streaming animation. Modify existing designs by selecting elements and chatting.

</td>
<td width="50%">

### 🤖 Concurrent Agent Teams

The orchestrator decomposes complex pages into spatial sub-tasks. Multiple AI agents work on different sections simultaneously — hero, features, footer — all streaming in parallel with per-member canvas indicators.
```

</details>

**依据 2 · 作者声明**：[README.md:81-83](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/README.md#L81-L83)

作者描述 .op 与代码导出。

```text
### 📦 Design-as-Code

`.op` files are JSON — human-readable, Git-friendly, diffable. Design variables generate CSS custom properties. Code export to React + Tailwind or HTML + CSS.
```

**依据 3 · 源码核查**：[crates/op-host-services/src/doc_io.rs:1-13](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L1-L13)

文档保存为规范 JSON，加载回编辑状态。

<details>
<summary>查看原文（13行）</summary>

```text
//! Headless `.pen` / `.op` document load / save — the host-free core
//! carved out of `op-host-desktop`'s `persistence.rs` (Phase 2, Task
//! 2.3). The rfd / winit dialog flow (`handle_open` / `handle_save` /
//! `run_action` / `show_error_dialog`) stays desktop-side and imports
//! these functions back; the web daemon and any other headless caller
//! reach the same serializer the GUI uses.
//!
//! Save serializes `EditorState::doc` straight to canonical `.op` JSON
//! (the same schema the TS editor / Jian apps emit); Open parses the
//! canonical schema and re-seeds `EditorState` via
//! `EditorState::from_document`. There is no `Document → PenDocument`
//! reverse path, so the desktop's old private `DocPayload` format is no
//! longer written — every save is canonical.
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/doc_io.rs:89-96](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L89-L96)

保存当前编辑器文档。

```text
pub fn save_to_path(state: &EditorState, path: &std::path::Path) -> Result<(), DocIoError> {
    let thumbnails = jian_ops_schema::image_thumbs::capture_snapshot();
    save_document_with_thumbnails_to_path(
        &state.doc,
        op_pen_loader::EditorMeta::from_state(state),
        &thumbnails,
        path,
    )
```

#### 缺口

- 没有同任务设计者和图片重画对照
  **影响**：设计质量、返工及时间收益未知
  **进一步探讨**：用固定设计任务比较可编辑性、缺陷与人工作业时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · MCP 调用如何改变文件、保存与输出？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

桌面 mcp_serve.rs:1-8、14-26 把 --mcp 和 --mcp-http 转交共享 headless 模式；host-services/mcp_serve.rs:293-304 处理握手与工具发现，318-340 在 dispatch 前按访问 profile 拒绝不允许的调用，再把命令交给 applier。209-233 的文件模式先 state.apply，拒绝则不保存；通过后执行修复并调用 save_editor_state，成功才记自动收尾状态。op-mcp/lib.rs:610-636 在 applier 返回 false 时把成功结果降为工具错误。doc_io.rs:174-192 使用同目录临时文件、flush 与替换，并在失败时清理临时文件；这减少半写文件风险，不证明每种系统故障都可恢复。codegen_export_tool.rs:61-88 按请求选择目标节点生成导出，输出正确性仍未验收。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/mcp_serve.rs:1-8](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_serve.rs#L1-L8)

桌面 headless 模式入口。

```text
//! Argv dispatcher for the headless CLI server modes.
//!
//! The `--mcp` / `--mcp-http` / `--serve-web` dispatch itself is shared
//! with the `op-host-web-server` binary via
//! [`op_host_services::cli_modes::run_cli_mode`]; this residual only
//! decides the desktop policy around it: an unknown / missing leading
//! arg falls through to GUI mode instead of being a usage error.
//! `main` calls it before opening the GUI window.
```

**依据 2 · 源码核查**：[crates/op-host-desktop/src/mcp_serve.rs:14-26](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_serve.rs#L14-L26)

stdio 和 HTTP 模式委派共享入口。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:318-340](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve.rs#L318-L340)

profile 拒绝及注册表派发。

<details>
<summary>查看原文（23行）</summary>

```text
    let call = op_mcp::parse_tool_call(trimmed);
    // Enforcement, ahead of the registry build and therefore ahead of the
    // tool's own argument parsing: a denied tool never sees the path it was
    // asked to open.
    if let Some(call) = call.as_ref() {
        if let Some(refusal) = profile.refuse_call(&call.tool, &call.arguments) {
            // The ordinary tools/call error envelope (`isError:true`) with
            // the originating id, so a client sees a refusal it can read
            // rather than a transport failure that would drop the session.
            return Ok(Some(op_mcp::tool_response_to_json(
                &op_mcp::ToolResponse::Err {
                    id: call.id.clone(),
                    code: op_mcp::ToolErrorCode::ToolFailed,
                    message: refusal.message(&call.tool),
                },
            )));
        }
    }
    let requested_tool = call.map(|call| call.tool);
    let registry = rebuild_registry(state, requested_tool.as_deref(), profile);
    process_tool_message_with_registry(&registry, line, |tool_name, cmd| {
        apply(tool_name, state, cmd)
    })
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-233](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve.rs#L209-L233)

应用命令、修复、保存和自动收尾状态。

<details>
<summary>查看原文（25行）</summary>

```text
    let response = process_message_with_applier_profiled(state, line, profile, |_, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        if !annotation_only {
            run_write_repairs_after_apply(state);
        }
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
        }
        if annotation_only {
            if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
                auto_finalize.note_scoped_annotation(state.document_revision());
            }
        } else {
            if let Some(auto_finalize) = auto_finalize.as_deref_mut() {
                auto_finalize.note_write(Instant::now());
            }
        }
        true
```

</details>

**依据 5 · 源码核查**：[crates/op-mcp/src/lib.rs:610-636](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-mcp/src/lib.rs#L610-L636)

applier 失败转换为工具错误。

<details>
<summary>查看原文（27行）</summary>

```text
        // Captured BEFORE `dispatch(call)` moves `call` — the only way to
        // still name the tool once the command is ready to apply.
        let tool_name = call.tool.clone();
        let mut response = registry.dispatch(call);
        // Apply any queued command before reporting success. If
        // application fails (applier returns false), demote the
        // ToolResponse::Ok to a typed Err so the client sees the
        // mutation didn't land.
        if let ToolResponse::Ok {
            id,
            command: Some(cmd),
            ..
        } = &response
        {
            if !apply(&tool_name, cmd) {
                let id = id.clone();
                response = ToolResponse::Err {
                    id,
                    code: ToolErrorCode::Internal,
                    message: format!("host rejected command: {cmd:?}"),
                };
            }
        }
        // Tool results use the MCP-spec `content[]` envelope (with
        // `isError` for tool-level failures); only transport/parse errors
        // above use the JSON-RPC `error` shape.
        writeln!(writer, "{}", tool_response_to_json(&response))?;
```

</details>

**依据 6 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-192](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L174-L192)

临时文件、flush 和替换。

<details>
<summary>查看原文（19行）</summary>

```text
    // Write through a sibling temp file so a crash mid-write doesn't
    // leave a half-written file on disk.
    let (tmp, file) = create_sibling_temp(path)?;
    let write_result = (|| {
        let mut writer = std::io::BufWriter::with_capacity(1024 * 1024, file);
        canonical_save::write_serializable_document_with_thumbnails(
            &mut writer,
            document,
            meta,
            thumbnails,
        )?;
        std::io::Write::flush(&mut writer).map_err(|e| DocIoError::Io(e.to_string()))?;
        drop(writer);
        commit_staged_document(&tmp, path)
    })();
    if write_result.is_err() {
        let _ = std::fs::remove_file(&tmp);
    }
    write_result
```

</details>

**依据 7 · 源码核查**：[crates/op-mcp/src/codegen_export_tool.rs:61-88](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-mcp/src/codegen_export_tool.rs#L61-L88)

导出目标及输入校验。

<details>
<summary>查看原文（28行）</summary>

```text
impl McpTool for CodegenExport {
    fn name(&self) -> &str {
        "codegen_export"
    }

    fn call(&self, args: &BTreeMap<String, String>) -> ToolOutcome {
        let target = args
            .get("framework")
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .unwrap_or(DEFAULT_TARGET);
        let framework = Framework::from_wire(target);
        if framework.is_none() && target != CSS_VARIABLES {
            return ToolOutcome::Err(
                ToolErrorCode::InvalidArgument,
                format!(
                    "unknown framework {target:?}; expected one of: {}",
                    codegen_export_targets().join(", ")
                ),
            );
        }
        let roots = match self.target_nodes(args) {
            Ok(roots) => roots,
            Err(message) => return ToolOutcome::Err(ToolErrorCode::ToolFailed, message),
        };
        let mut scoped = self.doc.clone();
        scoped.pages = None;
        scoped.children = roots.iter().map(|node| (*node).clone()).collect();
```

</details>

#### 缺口

- 未执行 MCP、.op 往返或导出渲染
  **影响**：不能证明目标宿主兼容或导出视觉正确
  **进一步探讨**：隔离临时文档驱动工具并比对保存、重开与输出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写入失败、并发和文件切换有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

在 file-backed 主路径中，mcp_serve.rs:209-222 先改变内存 EditorState，再尝试保存；这段保存失败分支返回 false 并记录错误，未见回滚已应用状态。op-mcp/lib.rs:613-630 则把失败回复为错误，故客户端看到错误并不能仅凭此片段推定同进程内存已恢复到磁盘版本。反证是 doc_io.rs:174-192 用临时文件替换，旨在防止半写；file_path.rs:29-46 对显式其他文件先加载独立 target_state，再应用与保存。两者不能单独证明跨进程覆盖、崩溃恢复或重试一致性。此处是一项源码级待验证窗口，不是已经复现数据损坏；临时目标状态与长期主状态的影响也不同。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-222](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve.rs#L209-L222)

主状态先变更后保存，失败直接返回。

<details>
<summary>查看原文（14行）</summary>

```text
    let response = process_message_with_applier_profiled(state, line, profile, |_, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        if !annotation_only {
            run_write_repairs_after_apply(state);
        }
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
```

</details>

**依据 2 · 源码核查**：[crates/op-mcp/src/lib.rs:613-630](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-mcp/src/lib.rs#L613-L630)

applier 失败转成错误。

<details>
<summary>查看原文（18行）</summary>

```text
        let mut response = registry.dispatch(call);
        // Apply any queued command before reporting success. If
        // application fails (applier returns false), demote the
        // ToolResponse::Ok to a typed Err so the client sees the
        // mutation didn't land.
        if let ToolResponse::Ok {
            id,
            command: Some(cmd),
            ..
        } = &response
        {
            if !apply(&tool_name, cmd) {
                let id = id.clone();
                response = ToolResponse::Err {
                    id,
                    code: ToolErrorCode::Internal,
                    message: format!("host rejected command: {cmd:?}"),
                };
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-192](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L174-L192)

临时文件与替换是半写风险的反证。

<details>
<summary>查看原文（19行）</summary>

```text
    // Write through a sibling temp file so a crash mid-write doesn't
    // leave a half-written file on disk.
    let (tmp, file) = create_sibling_temp(path)?;
    let write_result = (|| {
        let mut writer = std::io::BufWriter::with_capacity(1024 * 1024, file);
        canonical_save::write_serializable_document_with_thumbnails(
            &mut writer,
            document,
            meta,
            thumbnails,
        )?;
        std::io::Write::flush(&mut writer).map_err(|e| DocIoError::Io(e.to_string()))?;
        drop(writer);
        commit_staged_document(&tmp, path)
    })();
    if write_result.is_err() {
        let _ = std::fs::remove_file(&tmp);
    }
    write_result
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/mcp_serve/file_path.rs:29-46](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve/file_path.rs#L29-L46)

显式其他文件单独加载并应用。

<details>
<summary>查看原文（18行）</summary>

```text
    if target.tool == "open_document" && !target.path.exists() {
        create_empty_document(&target.path)?;
    }
    let mut target_state = super::load_editor_state(&target.path)?;
    let mut applier_failed: Option<String> = None;
    let response = super::process_message_with_applier_profiled(
        &mut target_state,
        line,
        profile,
        |_tool_name, state, cmd| {
            if !state.apply(cmd.clone()) {
                return false;
            }
            super::run_write_repairs_after_apply(state);
            if let Err(e) = super::save_editor_state(state, &target.path) {
                applier_failed = Some(format!("save {} failed: {e}", target.path.display()));
                return false;
            }
```

</details>

#### 缺口

- 缺少保存故障、进程并发和重试实验
  **影响**：不能判定实际覆盖或状态分叉发生率
  **进一步探讨**：对隔离临时文件注入保存故障并比较同进程状态、磁盘与重开结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · DSH 如何接入，范围与权限是什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

根项目是独立客户端与 MCP 服务，并非 DSH bundle。mcp_integrations.rs:98-111 将 DSH 配置操作分派到 update_dsh_patch_config；186-197 选择 $DSH_HOME 或 ~/.dsh 下的 cordis.patch.yml。mcp_integrations_dsh.rs:29-35 写入 dsh-mcp-client、streamable-http 与给定 URL 的管理块；118-140 对孤立标记或手写条目拒绝静默删除。其源码注释称 home 层影响全部 profile，但本次未读取或运行固定 DSH 宿主核实配置合并次序，因此是项目实现/声明而非跨宿主验收；HTTP 文件模式 auto_finalize.rs:200-213 绑定 127.0.0.1，不应由回环地址单独推断完整身份认证。配置变更有影响其他 profile 的潜在范围，使用前应备份并检查实际配置。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations.rs:98-111](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_integrations.rs#L98-L111)

DSH 操作分派给 patch 编辑器。

<details>
<summary>查看原文（14行）</summary>

```text
    enabled: bool,
    url: &str,
    path: PathBuf,
) -> Result<PathBuf, McpConfigError> {
    match cli {
        McpCli::Codex => update_codex_config(&path, enabled, url)?,
        McpCli::GrokBuild => update_grok_config(&path, enabled, url)?,
        McpCli::Antigravity => return Err(McpConfigError::AntigravityNeedsHome),
        McpCli::OpenCode => update_opencode_config(&path, enabled, url)?,
        McpCli::QwenCode => update_mcp_servers_json(&path, enabled, qwen_server(url))?,
        McpCli::Kiro => update_mcp_servers_json(&path, enabled, kiro_server(url))?,
        McpCli::Kimi => update_mcp_servers_json(&path, enabled, kimi_server(url))?,
        McpCli::ZCode => update_zcode_config(&path, enabled, url)?,
        McpCli::Dsh => update_dsh_patch_config(&path, enabled, url)?,
```

</details>

**依据 2 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations.rs:186-197](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_integrations.rs#L186-L197)

选择 DSH_HOME 或默认 home 层路径。

<details>
<summary>查看原文（12行）</summary>

```text
        // DeepSeek Harness reads its home-level patch layer — one file
        // that applies across all profiles, so a single write covers every
        // profile. `DSH_HOME` overrides the data root, mirroring Codex's
        // `CODEX_HOME` handling.
        McpCli::Dsh => {
            if use_env {
                std::env::var_os("DSH_HOME")
                    .map(PathBuf::from)
                    .unwrap_or_else(|| home.join(".dsh"))
                    .join("cordis.patch.yml")
            } else {
                home.join(".dsh").join("cordis.patch.yml")
```

</details>

**依据 3 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:29-35](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L29-L35)

管理块连接 dsh MCP 客户端与 URL。

```text
/// The exact nine-line managed block, markers included. In the
/// top-level-array context this is valid YAML on its own. `url` is the
/// live server endpoint (`mcp_integrations::endpoint_url`).
fn dsh_patch_block(url: &str) -> String {
    format!(
        "{DSH_PATCH_BEGIN}\n- insert:\n    - id: mcp-openpencil\n      name: '@deepseek-ai/dsh-mcp-client'\n      config:\n        serverName: openpencil\n        transport: streamable-http\n        url: {url}\n{DSH_PATCH_END}\n"
    )
```

**依据 4 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:118-140](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L118-L140)

删除时保守处理手写条目与损坏标记。

<details>
<summary>查看原文（23行）</summary>

```text
    if !enabled {
        match marker_pair(&lines) {
            Some((begin, end)) => {
                let mut out = String::new();
                for (i, line) in lines.iter().enumerate() {
                    if i < begin || i > end {
                        out.push_str(line);
                    }
                }
                atomic_write(path, out.as_bytes())
            }
            None => {
                if lone_marker(&lines) {
                    return Err(McpConfigError::DshPatchMarkersMismatched {
                        path: path.to_path_buf(),
                    });
                }
                if dsh_text_has_openpencil(&existing) {
                    return Err(McpConfigError::DshManualEntry {
                        path: path.to_path_buf(),
                    });
                }
                Ok(())
```

</details>

**依据 5 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:200-213](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L200-L213)

文件模式 HTTP 绑定回环。

<details>
<summary>查看原文（14行）</summary>

```text
    path: PathBuf,
    port: u16,
    profile: McpAccessProfile,
) -> Result<(), McpServeError> {
    const HTTP_IO_TIMEOUT: Duration = Duration::from_secs(30);
    let mut state = super::load_editor_state(&path)?;
    let signals = install_shutdown_signals()?;
    let mut auto_finalize = AutoFinalize::from_env();
    let listener = std::net::TcpListener::bind(("127.0.0.1", port))
        .map_err(|e| McpServeError::Config(format!("bind 127.0.0.1:{port}: {e}")))?;
    listener
        .set_nonblocking(true)
        .map_err(|e| McpServeError::Config(format!("set nonblocking listener: {e}")))?;
    eprintln!("openpencil-desktop --mcp-http: listening on 127.0.0.1:{port}");
```

</details>

#### 缺口

- 没有独立固定 DSH 宿主对配置层及连接的验证
  **影响**：实际跨 profile 生效、鉴权与兼容仍未知
  **进一步探讨**：隔离 DSH_HOME 核对合并后的配置并测试双方固定版本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用、成本和退路如何判断？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

Cargo.toml:24-31 将桌面、CLI、Web server 列为默认构建成员并声明 Rust 1.94；构建依赖与最终发布包运行条件不能混同。DSH 集成还需目标 MCP 服务、宿主客户端及配置，Agent 模型和网络费用依实际使用而定。建议有设计审阅能力的用户先备份 .op 文档，在隔离环境生成一张小界面并检查节点、文本、交互与导出，再由人验收；来源、保存状态或权限无法确认时停止自动写入并回到人工编辑和备份。模型、人工修改、部署、文件恢复和导出检验的时间与费用均未知，源码不支持推算 ROI。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:16-31](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/Cargo.toml#L16-L31)

默认构建成员和 Rust 构建版本。

<details>
<summary>查看原文（16行）</summary>

```text
# A bare `cargo build` / `cargo test` (no `-p`, no `--workspace`) operates on
# this set only — the native shippable artifacts (the desktop app + the `op`
# CLI), exactly what `rust-release.yml` builds via `-p op-host-desktop -p op-cli`.
# This stops a plain `cargo build` from also compiling the wasm host
# (`op-host-web`) on the native target — a wasted compile, since its real build
# is always `cargo build -p op-host-web --target wasm32-unknown-unknown`. CI and
# the `package.json` cargo:* scripts are unaffected: they all pass `--workspace`
# explicitly, which overrides `default-members`.
default-members = ["crates/op-host-desktop", "crates/op-cli", "crates/op-host-web-server"]

[workspace.package]
version = "0.8.5"
edition = "2021"
# 1.94 floor: the official github-copilot-sdk (including its former 0.1
# release) requires Rust 1.94. Release builders and CI already use it.
rust-version = "1.94"
```

</details>

**依据 2 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:29-35](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L29-L35)

DSH MCP 连接配置。

```text
/// The exact nine-line managed block, markers included. In the
/// top-level-array context this is valid YAML on its own. `url` is the
/// live server endpoint (`mcp_integrations::endpoint_url`).
fn dsh_patch_block(url: &str) -> String {
    format!(
        "{DSH_PATCH_BEGIN}\n- insert:\n    - id: mcp-openpencil\n      name: '@deepseek-ai/dsh-mcp-client'\n      config:\n        serverName: openpencil\n        transport: streamable-http\n        url: {url}\n{DSH_PATCH_END}\n"
    )
```

**依据 3 · 源码核查**：[crates/op-host-services/src/doc_io.rs:89-96](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L89-L96)

保存编辑文档。

```text
pub fn save_to_path(state: &EditorState, path: &std::path::Path) -> Result<(), DocIoError> {
    let thumbnails = jian_ops_schema::image_thumbs::capture_snapshot();
    save_document_with_thumbnails_to_path(
        &state.doc,
        op_pen_loader::EditorMeta::from_state(state),
        &thumbnails,
        path,
    )
```

#### 缺口

- 没有任务级模型费用、人工工时与恢复实验
  **影响**：无法确定净收益及兼容开销
  **进一步探讨**：比较同设计任务、变更和导出验收的费用与时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用可比较的修订及保存确认减少误覆盖？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有机制是强反证：state.rs:254-270 已有内存 document_revision 和 saved_revision，auto_finalize.rs:65-75 也以当前 revision 避免重复收尾；doc_io.rs:174-192 已用临时文件替换。新增假设不是再加计数或原子替换，而是在文件模式打开时记录持久文件内容摘要，写入时在同一跨进程互斥范围内重新比对基线；不匹配则拒绝覆盖并返回冲突，匹配后将改动应用于临时状态、成功提交磁盘后才发布内存修订，失败保留旧状态。需处理锁不可用、外部编辑、文件身份和冲突重试，不能把当前内存 revision 当全局唯一版本。以现有实现、只靠临时文件替换、拟议方案在同一隔离文档上测试两进程交叉编辑、保存失败和重启，比较误覆盖、错误确认、恢复时间和额外内存/延迟；若仍出现未提示覆盖、失败后内存错误发布、冲突误报不可接受或成本超过实际收益，则否定方案。尚未实现、运行或证明市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-editor-core/src/state.rs:254-270](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-editor-core/src/state.rs#L254-L270)

现有内存 revision、saved revision 和 dirty 状态。

<details>
<summary>查看原文（17行）</summary>

```text
    pub fn document_revision(&self) -> u64 {
        self.revision
    }

    /// Revision captured at the last successful save/load baseline.
    pub fn saved_revision(&self) -> u64 {
        self.saved_revision
    }

    /// Generation of the live document.
    pub fn document_generation(&self) -> u64 {
        self.document_generation
    }

    /// True when document content changed since the last saved baseline.
    pub fn is_dirty(&self) -> bool {
        self.revision != self.saved_revision
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:65-75](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L65-L75)

现有按 revision 抑制重复收尾。

<details>
<summary>查看原文（11行）</summary>

```text
    pub fn note_write(&mut self, now: Instant) {
        self.last_write_at = Some(now);
    }

    pub fn due(&self, now: Instant, current_revision: u64) -> bool {
        self.enabled()
            && self.last_write_at.is_some_and(|written| {
                now.checked_duration_since(written)
                    .is_some_and(|idle| idle >= self.idle_after)
            })
            && self.finalized_at_revision != Some(current_revision)
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-192](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/doc_io.rs#L174-L192)

现有临时文件替换。

<details>
<summary>查看原文（19行）</summary>

```text
    // Write through a sibling temp file so a crash mid-write doesn't
    // leave a half-written file on disk.
    let (tmp, file) = create_sibling_temp(path)?;
    let write_result = (|| {
        let mut writer = std::io::BufWriter::with_capacity(1024 * 1024, file);
        canonical_save::write_serializable_document_with_thumbnails(
            &mut writer,
            document,
            meta,
            thumbnails,
        )?;
        std::io::Write::flush(&mut writer).map_err(|e| DocIoError::Io(e.to_string()))?;
        drop(writer);
        commit_staged_document(&tmp, path)
    })();
    if write_result.is_err() {
        let _ = std::fs::remove_file(&tmp);
    }
    write_result
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-222](https://github.com/ZSeven-W/openpencil/blob/68d0123586bbbdc6ec8338d0b7d96e4e756e14bf/crates/op-host-services/src/mcp_serve.rs#L209-L222)

当前文件模式先应用后保存。

<details>
<summary>查看原文（14行）</summary>

```text
    let response = process_message_with_applier_profiled(state, line, profile, |_, state, cmd| {
        // `EditorState::apply` runs the pre-validate-then-mutate
        // discipline; `false` means the command rejected and the
        // document was NOT changed.
        if !state.apply(cmd.clone()) {
            apply_rejected = true;
            return false;
        }
        if !annotation_only {
            run_write_repairs_after_apply(state);
        }
        if let Err(e) = save_editor_state(state, path) {
            applier_failed = Some(format!("save failed: {e}"));
            return false;
```

</details>

#### 缺口

- 没有跨进程互斥和暂存状态原型及对照实验
  **影响**：不能证明冲突检测的成本或收益
  **进一步探讨**：在隔离文件中实现最小原型，对照当前及仅临时替换，注入并发和故障。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
