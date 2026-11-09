# OpenPencil

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[2bbc658](https://github.com/ZSeven-W/openpencil/tree/2bbc658caba5139cdfeb768b65da7f6f0080a703)

<!-- BEGIN META -->
[![GitHub ★ 7,134](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7%2C134&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ZSeven-W/openpencil)
<!-- END META -->

> **功能**：独立桌面与 Web 设计应用，支持通过 MCP 读写可编辑 .op 文档和导出代码。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 的增量是将 MCP 调用接到编辑器节点命令和可重新打开的 .op 文档。导出代码走独立工具，DSH 配置项指向 HTTP MCP 客户端。

> **主要限制**：[Q03](#research-q03) 保存报错前内存可能已修改，单个进程的文档修订记录也无法证明多个进程之间有协调。文件路径参数允许另开文档，启动时选定副本本身不能限制进程可访问的文件范围。

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
  - [Q01 · 何种设计任务需要可编辑文档，根应用与 DSH 入口有什么区别？](#detail-section-11)
  - [Q02 · 一次写工具调用如何变成文档节点和落盘结果？](#detail-section-12)
  - [Q03 · 出错、并发或不同模式下的成功结果能证明什么？](#detail-section-13)
  - [Q04 · 客户端、构建、模型和恢复分别承担什么？](#detail-section-14)
  - [Q05 · 如何用可销毁副本检验防误覆盖及设计收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要将生成的界面稿继续交给设计者修改节点的团队，可在可销毁的 .op 副本里试用本机 MCP。交付要能重新打开、修改并核对所选节点。[Q01](#research-q01)

静态图生成可以快速交付预览，交给设计者继续改节点时通常要重画。已有可编辑文档也可直接用设计编辑器人工操作。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 桌面及 Web 设计编辑 | 打开并编辑 .op 节点 | 试用链只核对桌面 stdio 文件模式 |
| MCP 文件读写 | 读取文档、应用节点命令并保存 | 使用隔离单写者副本，逐次复核落盘 |
| 代码导出 | 从文档快照生成输出 | 实际渲染和交付质量待验收 |
| DSH HTTP 配置 | 接入本机 MCP 服务 | 需要宿主客户端和显式配置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| OpenPencil 桌面二进制与 stdio MCP 客户端 | 文件模式需要 | 启动编辑工具 | 改用独立编辑器手动编辑 |
| 可写 .op 副本、备份和受限文件权限 | 写入试用需要 | 验证持久化与限制访问 | 停止写入 |
| Rust 1.94 | 按工作区从源码构建时需要 | 编译工作区 | 先核对已有发行件 |
| 模型或 DSH HTTP 客户端 | 选择对应入口才需 | 提示驱动或宿主连接 | 可用已有本地 MCP 客户端验证 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 隔离样本 | 设计者创建副本，保留备份并限制目录权限 | 副本与正式文件独立，只有一个写者 |
| 发起编辑 | 操作人以文件模式调用一个 insert_node | 保存工具结果和目标页、节点 ID |
| 复核交付 | 关闭并重新打开副本，检查目标节点 | 工具错误或落盘不符时停止并人工从备份恢复 |
| 检查代码输出 | 如有需要，单独导出并审查 | 核对结构和样式，记录未验证项 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本地工具及备份存储 | 准备副本、配置客户端和文件权限 | 未测安装时间 |
| 持续 | 选用模型时可能付费，另需存储 | 查看节点和导出、核对协作变化 | 用量与净收益未知 |
| 失败恢复 | 备份与差异记录 | 停止写入、重开、对比并恢复 | 工具错误不保证内存回滚 |
| 退出 | 保留或移除副本 | 断开宿主配置，交回文件编辑者 | 转换到其他格式的保真未测 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 可编辑交付 | MCP 可生成并保存编辑器节点 | 实际设计修改速度和质量 |
| 导出 | 工具可读取快照生成代码输出 | 导出后渲染保真及可维护性 |
| 持久化 | 正常路径写临时文件后替换，保存错误向外返回 | 跨进程协调和错误后的状态恢复 |

> **思考**：[Q03](#research-q03) 保存报错前内存可能已修改，单个进程的文档修订记录也无法证明多个进程之间有协调。文件路径参数允许另开文档，启动时选定副本本身不能限制进程可访问的文件范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 的增量是将 MCP 调用接到编辑器节点命令和可重新打开的 .op 文档。导出代码走独立工具，DSH 配置项指向 HTTP MCP 客户端。

[Q02](#research-q02) 节点请求经工具注册进入编辑器命令，宿主先应用再保存。保存错误向客户端回传，当前路径没有回滚；替换文件处没有校验旧摘要，跨进程效果需单独测。[Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 保存报错前内存可能已修改，单个进程的文档修订记录也无法证明多个进程之间有协调。文件路径参数允许另开文档，启动时选定副本本身不能限制进程可访问的文件范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 单写者在可销毁文件副本上试一个节点。限制可读写目录，重开文件核对节点位置和属性。失败后停止写入并人工用备份核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本机文件模式的注册、应用和保存路径有固定源码证据。可编辑交付效率、代码还原效果和实际并行覆盖率待测。文件提交假设尚未运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、crates/op-mcp/src/write_tools.rs、crates/op-mcp/src/codegen_export_tool.rs、crates/op-host-desktop/src/mcp_integrations_dsh.rs、crates/op-host-desktop/src/main.rs、crates/op-host-desktop/src/mcp_serve.rs、crates/op-host-services/src/cli_modes.rs、crates/op-host-services/src/mcp_serve/auto_finalize.rs、crates/op-host-services/src/mcp_serve.rs、crates/op-host-services/src/mcp_serve/registry.rs、crates/op-editor-core/src/command_apply.rs、crates/op-host-services/src/doc_io.rs、crates/op-mcp/src/lib.rs、crates/op-editor-core/src/state.rs、crates/op-host-services/src/mcp_serve/file_path.rs、Cargo.toml、crates/op-host-desktop/src/mcp_integrations.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：按固定提交核对独立客户端的本机 stdio 文件模式与 DSH HTTP 配置入口。Rust 工作区 Cargo 声明版本 0.8.5，根目录未声明 npm 包版本。没有运行应用、MCP、Web 或生成代码。
- 下一步：[Q05](#research-q05) 在隔离副本复现一次正常写入、一次保存失败和两个独立客户端争用，分别检查工具返回、内存视图与重开后的文件摘要和节点。

**分析版本**

- **仓库**：[ZSeven-W/openpencil](https://github.com/ZSeven-W/openpencil)
- **版本号**：未声明（[固定提交 2bbc658](https://github.com/ZSeven-W/openpencil/tree/2bbc658caba5139cdfeb768b65da7f6f0080a703)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 先在副本应用命令，再用文件协调和预期摘要提交，可能减少失败后的内存与文件分歧和并行覆盖。以有意触发的写入失败和双客户端争用对照验证。

[Q05](#research-q05) 在隔离副本复现一次正常写入、一次保存失败和两个独立客户端争用，分别检查工具返回、内存视图与重开后的文件摘要和节点。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 214 | 38253 | — | — | 282327 |
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

[![Issue 未关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/ZSeven-W/openpencil/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：设计者如何让 MCP 客户端修改可编辑的 OpenPencil 文档并检查交付，哪些授权、保存和并发条件会改变试用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何种设计任务需要可编辑文档，根应用与 DSH 入口有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要反复修改界面稿并交给设计者或开发者接手的团队，可用 OpenPencil 将 MCP 操作落到可编辑文档。以给测试页面加一个可修改的文本或容器为例，合格交付包含正确目标页面、节点和属性，设计者重开后还能改。生成平面图再重画缺同一节点结构，纯手工编辑已有结构但要逐项操作。OpenPencil 的实际增量是外部客户端能通过 MCP 命令写入文档模型，再由同一文件交给编辑器。导出工具能从选定节点生成目标框架代码，最终样式和运行仍需验收。根项目有独立桌面、Web 和文件模式 MCP，DSH 集成源码只写入宿主的 MCP 客户端配置，作者另列独立 DSH 插件。不能将它们都当作根包直接注册的 DSH 能力。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-92](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/README.md#L81-L92)

作者描述 JSON 文件与独立客户端。

<details>
<summary>查看原文（12行）</summary>

```text
### 📦 Design-as-Code

`.op` files are JSON — human-readable, Git-friendly, diffable. Design variables generate CSS custom properties. Code export to React + Tailwind or HTML + CSS.

</td>
</tr>
<tr>
<td width="50%">

### 🖥️ Runs Everywhere

Web app + native desktop on macOS, Windows, and Linux — one Rust core, a single self-contained binary, no browser engine. `.op` file association — double-click to open.
```

</details>

**依据 2 · 作者声明**：[README.md:331-339](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/README.md#L331-L339)

作者描述本机 stdio 与应用内 HTTP 等入口。

```text
**MCP Server**

- Built-in MCP server (`op-mcp` crate) — one-click install into Claude Code / Codex / OpenCode / Kiro / Copilot CLIs
- No Node.js required — stdio transport via the desktop binary (`--mcp <path>`), plus a live HTTP endpoint (`127.0.0.1:<port>/mcp`) from the running app
- Design automation from terminal: read, create, and modify `.op` files via any MCP-compatible agent
- **Layered design workflow** — `design_skeleton` → `design_content` → `design_refine` for higher-fidelity multi-section designs
- **Segmented prompt retrieval** — load only the design knowledge you need (schema, layout, roles, icons, planning, etc.)
- **Style guide tools** — `get_style_guide_tags` and `get_style_guide` for applying visual styles via MCP
- Multi-page support — create, rename, reorder, and duplicate pages via MCP tools
```

**依据 3 · 源码核查**：[crates/op-mcp/src/write_tools.rs:106-134](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-mcp/src/write_tools.rs#L106-L134)

工具产生能写入具体父节点与页面的编辑命令。

<details>
<summary>查看原文（29行）</summary>

```text
        let target_parent = args
            .get("parent")
            .or_else(|| args.get("parent_id"))
            .or_else(|| args.get("target_parent_id"))
            .map(|s| root_or_node_id(s))
            .unwrap_or(NodeId::NONE);
        let page_id = args
            .get("pageId")
            .or_else(|| args.get("page_id"))
            .or_else(|| args.get("page"))
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(str::to_string);
        let mut out = BTreeMap::new();
        out.insert("wrote".into(), "true".into());
        ToolOutcome::OkWithCommand(
            out,
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
            },
        )
```

</details>

**依据 4 · 源码核查**：[crates/op-mcp/src/codegen_export_tool.rs:82-121](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-mcp/src/codegen_export_tool.rs#L82-L121)

从选定节点构建导出的代码与文件。

<details>
<summary>查看原文（40行）</summary>

```text
        let roots = match self.target_nodes(args) {
            Ok(roots) => roots,
            Err(message) => return ToolOutcome::Err(ToolErrorCode::ToolFailed, message),
        };
        let mut scoped = self.doc.clone();
        scoped.pages = None;
        scoped.children = roots.iter().map(|node| (*node).clone()).collect();

        let mut files = Map::new();
        let code = match framework {
            Some(Framework::ReactTailwind) => {
                let components = referenced_components(&roots, &self.doc);
                let generated = ReactTailwind.generate_files_with_components(&scoped, &components);
                files.insert("component.tsx".into(), json!(generated.component));
                files.insert("app/globals.css".into(), json!(generated.globals_css));
                files.insert(
                    "tailwind.config.ts".into(),
                    json!(generated.tailwind_config),
                );
                generated.to_single_file()
            }
            Some(Framework::React) => React.generate(&scoped),
            Some(Framework::Vue) => Vue.generate(&scoped),
            Some(Framework::Svelte) => Svelte.generate(&scoped),
            Some(Framework::Html) => Html.generate(&scoped),
            Some(Framework::Flutter) => Flutter.generate(&scoped),
            Some(Framework::SwiftUi) => SwiftUi.generate(&scoped),
            Some(Framework::Compose) => Compose.generate(&scoped),
            Some(Framework::ReactNative) => ReactNative.generate(&scoped),
            None => CssVariables.generate(&scoped),
        };
        if files.is_empty() {
            files.insert(format!("component.{}", extension(framework)), json!(code));
        }
        let out = json!({
            "framework": target,
            "nodeCount": roots.len(),
            "code": code,
            "files": Value::Object(files),
        });
```

</details>

**依据 5 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:29-35](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L29-L35)

DSH 集成生成宿主的 streamable-http 配置。

```text
/// The exact nine-line managed block, markers included. In the
/// top-level-array context this is valid YAML on its own. `url` is the
/// live server endpoint (`mcp_integrations::endpoint_url`).
fn dsh_patch_block(url: &str) -> String {
    format!(
        "{DSH_PATCH_BEGIN}\n- insert:\n    - id: mcp-openpencil\n      name: '@deepseek-ai/dsh-mcp-client'\n      config:\n        serverName: openpencil\n        transport: streamable-http\n        url: {url}\n{DSH_PATCH_END}\n"
    )
```

**依据 6 · 作者声明**：[README.md:477-484](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/README.md#L477-L484)

作者区分根产品和独立 DSH 插件。

```text
## Ecosystem

OpenPencil is part of a family of pure-Rust, AI-native tools from **[ZSeven-W](https://github.com/ZSeven-W)**. They compose: `jian` renders OpenPencil, `agent-rs` runs its agents, `noema` remembers, and `zode` designs from the terminal.

| Project | What it is |
| ------- | ---------- |
| <img src="./screenshot/logo-dsh-openpencil.png" alt="DSH OpenPencil" width="40" /> **[DSH OpenPencil](https://github.com/ZSeven-W/dsh-openpencil)** | DeepSeek Harness plugin for OpenPencil — exact multi-frame `.op` previews, an interactive canvas, and a managed editor with agent-native design tools, right inside a conversation. |
| <img src="./screenshot/logo-zode.png" alt="Zode logo" width="40" /> **[Zode](https://github.com/ZSeven-W/zode)** | Open-source, AI-native coding assistant for your terminal — a fast Rust TUI (`ratatui`) that reads your code, runs commands, searches files, and manages git. Drives OpenPencil over MCP. |
```

#### 缺口

- 没有同一设计任务的人工与 MCP 用时及改稿记录。
  **影响**：不能判断是否减少交接或返工。
  **进一步探讨**：在同一草图、字号和布局要求下比较新建后重开、二次编辑和导出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次写工具调用如何变成文档节点和落盘结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

`openpencil-desktop --mcp <path>` 走共享命令分派，打开指定文档和 stdio 会话。以未另外指定文件的 `insert_node` 为例，host 解析工具请求，先执行所选访问配置的拒绝判断，再构建工具注册表。注册的工具校验参数并返回 InsertNode 命令。编辑器解析目标页，不存在时拒绝；正常路径在目标页处理节点插入。文件模式的 applier 在内存应用命令后执行写入修正，再保存状态。保存把文档序列化到同目录临时文件，缓冲写完后替换目标；系统错误会尝试移除临时文件。host 应用或保存返回 false 时，MCP 把原成功转成工具错误，而非只在 stderr 留下一条消息。拿到成功答复后仍可重读指定文件，核对实际页面、节点、布局及导出。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-desktop/src/main.rs:655-659](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/main.rs#L655-L659)

桌面入口先检查是否应进入 headless 模式。

```text
    // `--mcp` / `--mcp-http` swap the GUI for an MCP server mode;
    // when one of those ran, exit instead of opening a window.
    if mcp_serve::run_cli_if_requested() {
        return;
    }
```

**依据 2 · 源码核查**：[crates/op-host-desktop/src/mcp_serve.rs:21-31](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/mcp_serve.rs#L21-L31)

桌面实际转到共享命令分派。

<details>
<summary>查看原文（11行）</summary>

```text
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
    }
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/cli_modes.rs:68-82](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/cli_modes.rs#L68-L82)

stdio 入口要求文件路径并调用服务。

<details>
<summary>查看原文（15行）</summary>

```text
fn run_mcp_stdio(
    prog: &str,
    mut args: impl Iterator<Item = String>,
    catalog: McpToolCatalog,
) -> Option<i32> {
    let Some(path) = args.next() else {
        eprintln!("{prog} --mcp: missing <path> arg");
        return Some(2);
    };
    crate::user_scene_template_store::initialize_user_scene_templates_once();
    if let Err(e) = crate::mcp_serve::run(PathBuf::from(path), catalog) {
        eprintln!("{prog} --mcp: {e}");
        return Some(1);
    }
    Some(0)
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:133-149](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L133-L149)

加载文档并建立 stdin/stdout 循环。

<details>
<summary>查看原文（17行）</summary>

```text
pub(super) fn run(path: PathBuf, profile: McpAccessProfile) -> Result<(), McpServeError> {
    let mut state = super::load_editor_state(&path)?;
    let signals = install_shutdown_signals()?;
    let mut auto_finalize = AutoFinalize::from_env();
    let stdin = std::io::stdin();
    let stdout = std::io::stdout();
    let mut reader = BufReader::new(stdin.lock());
    let mut writer = BufWriter::new(stdout.lock());
    run_stdio_session(
        &mut reader,
        &mut writer,
        &mut state,
        &path,
        &mut auto_finalize,
        &signals.flag,
        profile,
    )
```

</details>

**依据 5 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:318-340](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve.rs#L318-L340)

解析请求、拒绝检查和真实调度。

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

**依据 6 · 源码核查**：[crates/op-host-services/src/mcp_serve/registry.rs:170-184](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/registry.rs#L170-L184)

插入与其他工具实际加入注册表。

<details>
<summary>查看原文（15行）</summary>

```text
    register_tool!("paste_clipboard", paste_clipboard_snapshot());
    register_tool!("set_variable_color", set_variable_color_snapshot(doc));
    register_tool!("set_active_axis_value", set_active_axis_value_snapshot(doc));
    register_tool!("insert_node", insert_node_snapshot());
    register_tool!("import_svg", import_svg_snapshot());
    register_tool!("import_html", import_html_snapshot());
    register_tool!("import_html_url", import_html_url_snapshot());
    register_tool!("brand_extract", brand_extract_snapshot(doc));
    register_tool!("import_web_snapshot", import_web_snapshot_tool());
    register_tool!("update_node", update_node_snapshot());
    register_tool!("delete_node", delete_node_snapshot());
    register_tool!("move_node", move_node_snapshot());
    register_tool!("copy_node", copy_node_snapshot());
    register_tool!("replace_node", replace_node_snapshot());
    register_tool!("batch_design", batch_design_snapshot(doc));
```

</details>

**依据 7 · 源码核查**：[crates/op-mcp/src/write_tools.rs:106-134](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-mcp/src/write_tools.rs#L106-L134)

工具构造节点插入命令。

<details>
<summary>查看原文（29行）</summary>

```text
        let target_parent = args
            .get("parent")
            .or_else(|| args.get("parent_id"))
            .or_else(|| args.get("target_parent_id"))
            .map(|s| root_or_node_id(s))
            .unwrap_or(NodeId::NONE);
        let page_id = args
            .get("pageId")
            .or_else(|| args.get("page_id"))
            .or_else(|| args.get("page"))
            .map(|s| s.trim())
            .filter(|s| !s.is_empty())
            .map(str::to_string);
        let mut out = BTreeMap::new();
        out.insert("wrote".into(), "true".into());
        ToolOutcome::OkWithCommand(
            out,
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
            },
        )
```

</details>

**依据 8 · 源码核查**：[crates/op-editor-core/src/command_apply.rs:64-97](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-editor-core/src/command_apply.rs#L64-L97)

执行前找目标页面再应用插入。

<details>
<summary>查看原文（34行）</summary>

```text
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

**依据 9 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-234](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve.rs#L209-L234)

应用、修正、保存和失败转布尔。

<details>
<summary>查看原文（26行）</summary>

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
    })?;
```

</details>

**依据 10 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-192](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/doc_io.rs#L174-L192)

写入同目录临时文件，完成后发布。

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

**依据 11 · 源码核查**：[crates/op-mcp/src/lib.rs:612-637](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-mcp/src/lib.rs#L612-L637)

命令或保存拒绝时响应转为工具错误。

<details>
<summary>查看原文（26行）</summary>

```text
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
        writer.flush()?;
```

</details>

#### 缺口

- 未运行 MCP 客户端、实际渲染或导出。
  **影响**：无法判断复杂文档视觉和多工具编排的真实结果。
  **进一步探讨**：在副本上写入已知节点并由编辑器重开，核对节点位置、字体、布局及导出文件。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 出错、并发或不同模式下的成功结果能证明什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

同目录临时文件替换防止直接覆盖时留下半份写入。当前 stdio 主文档路径先变更内存，保存失败时记录错误并向工具返回失败，已读片段没有恢复先前内存状态。若会话此前有成功写入且开启自动整理，退出或 EOF 还可尝试整理并再次保存当前内存状态，因此工具报错后也要另查磁盘最终内容。文档 revision 和 generation 追踪当前进程保存基线及编辑变化，检查到的文件保存入口没有以预期磁盘摘要为条件。两个进程各加载一份快照后写同一文件存在覆盖风险，属于依据代码顺序的推断，未做并发实测。成功工具响应只说明所走路径返回成功，不能保证随后未被其他写入替换。

本机 file 模式的 profile 为 unrestricted 加所选工具目录。支持 `filePath` 等参数的调用可进入另一个文件路径；启动参数固定主文件，仍需按操作者的权限边界限制进程可访问的目录。这里的顺序和授权不外推至在线或共享编辑。失败或误目标时先停写，分别核对内存、磁盘与可用备份。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-237](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve.rs#L209-L237)

主文档先应用再保存，保存失败后只报错。

<details>
<summary>查看原文（29行）</summary>

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
    })?;
    if let Some(ref msg) = applier_failed {
        eprintln!("openpencil-desktop mcp: {msg}");
    }
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:101-125](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L101-L125)

开启自动整理且已有写入活动等条件时可替换当前内存状态。

<details>
<summary>查看原文（25行）</summary>

```text
    pub fn run(&mut self, state: &mut EditorState, reason: &'static str) -> Option<RepairSummary> {
        let revision = state.document_revision();
        if !self.enabled()
            || self.last_write_at.is_none()
            || state.active_children().is_empty()
            || self.finalized_at_revision == Some(revision)
        {
            return None;
        }
        let recorded = match op_orchestrator::record_loop_finalize_counted(state) {
            Ok(recorded) => recorded,
            Err(error) => {
                eprintln!("openpencil-desktop mcp: auto-finalize ({reason}) failed: {error}");
                return None;
            }
        };
        let summary = recorded.summary;
        *state = recorded.state;
        let finalized_revision = state.document_revision();
        self.finalized_at_revision = Some(finalized_revision);
        eprintln!(
            "openpencil-desktop mcp: auto-finalize ({reason}) repairs={} revision={finalized_revision}",
            summary.total_repairs()
        );
        Some(summary)
```

</details>

**依据 3 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:161-190](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L161-L190)

退出与 EOF 会尝试自动整理保存。

<details>
<summary>查看原文（30行）</summary>

```text
    let mut line = String::new();
    loop {
        line.clear();
        if shutdown_flag.load(Ordering::Acquire) {
            run_auto_finalize_and_save(auto_finalize, state, path, "shutdown")?;
            return Ok(());
        }
        let n = match reader.read_line(&mut line) {
            Ok(n) => n,
            Err(error)
                if error.kind() == std::io::ErrorKind::Interrupted
                    && shutdown_flag.load(Ordering::Acquire) =>
            {
                run_auto_finalize_and_save(auto_finalize, state, path, "shutdown")?;
                return Ok(());
            }
            Err(e) => return Err(McpServeError::Io(format!("stdin read: {e}"))),
        };
        if n == 0 {
            run_auto_finalize_and_save(auto_finalize, state, path, "stdin-eof")?;
            return Ok(());
        }
        if let Some(resp) = super::process_message_with_auto_finalize(
            state,
            path,
            &line,
            Some(auto_finalize),
            profile,
        )? {
            writeln!(writer, "{resp}")
```

</details>

**依据 4 · 源码核查**：[crates/op-host-services/src/mcp_serve/auto_finalize.rs:299-308](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/auto_finalize.rs#L299-L308)

整理有变动后走保存。

<details>
<summary>查看原文（10行）</summary>

```text
fn run_auto_finalize_and_save(
    auto_finalize: &mut AutoFinalize,
    state: &mut EditorState,
    path: &Path,
    reason: &'static str,
) -> Result<(), McpServeError> {
    if auto_finalize.run(state, reason).is_some() {
        super::save_editor_state(state, path)?;
    }
    Ok(())
```

</details>

**依据 5 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-205](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/doc_io.rs#L174-L205)

相邻临时文件替换目标，未比较预期磁盘版本。

<details>
<summary>查看原文（32行）</summary>

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
}

/// Atomically install a completed sibling `.op` file at its fixed destination.
///
/// Figma import writes the large document to a hidden sibling first so it can
/// still observe cancellation before publication. Reusing the save path's
/// replace primitive keeps re-imports crash-safe while allowing the existing
/// `<source-stem>.op` to be replaced instead of creating numbered copies.
pub fn commit_staged_document(
    staging_path: &std::path::Path,
    destination: &std::path::Path,
) -> Result<(), DocIoError> {
    replace_file(staging_path, destination)?;
```

</details>

**依据 6 · 源码核查**：[crates/op-editor-core/src/state.rs:254-286](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-editor-core/src/state.rs#L254-L286)

进程内 revision 与 generation 用于保存确认。

<details>
<summary>查看原文（33行）</summary>

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
    }

    /// Mark `revision` saved iff `generation` still names the live document.
    pub fn mark_saved_revision_at(&mut self, generation: u64, revision: u64) -> bool {
        if generation != self.document_generation {
            return false;
        }
        self.saved_revision = revision;
        self.editor_ui.document_dirty = self.is_dirty();
        true
    }

    /// Mark the current document revision as saved.
    pub fn mark_saved_revision(&mut self) {
        let (g, r) = (self.document_generation, self.revision);
        let _ = self.mark_saved_revision_at(g, r);
```

</details>

**依据 7 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:387-389](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve.rs#L387-L389)

本机文件 profile 是 unrestricted 加目录。

```text
/// The local operator's profile (full authority) over `catalog`.
fn local_profile(catalog: tool_catalog::McpToolCatalog) -> tool_profile::McpAccessProfile {
    tool_profile::McpAccessProfile::UNRESTRICTED.with_catalog(catalog)
```

**依据 8 · 源码核查**：[crates/op-host-services/src/mcp_serve/file_path.rs:26-49](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/file_path.rs#L26-L49)

其他文件路径会载入并单独保存目标。

<details>
<summary>查看原文（24行）</summary>

```text
    let Some(target) = target_file_call(line, current_path)? else {
        return Ok(None);
    };
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
            true
        },
    )?;
```

</details>

**依据 9 · 源码核查**：[crates/op-host-services/src/mcp_serve/file_path.rs:63-85](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve/file_path.rs#L63-L85)

参数可指定不同文件。

<details>
<summary>查看原文（23行）</summary>

```text
    let source_arg = if call.tool == "save_document" {
        "sourceFilePath"
    } else {
        "filePath"
    };
    let Some(raw) = call
        .arguments
        .get(source_arg)
        .map(|value| value.trim())
        .filter(|value| !value.is_empty())
    else {
        return Ok(None);
    };
    if LIVE_CANVAS_SENTINELS.contains(&raw) {
        return Ok(None);
    }
    let target = PathBuf::from(raw);
    if current_path.is_some_and(|current| same_path(&target, current)) {
        return Ok(None);
    }
    Ok(Some(TargetFileCall {
        tool: call.tool,
        path: target,
```

</details>

#### 缺口

- 缺权限和磁盘故障、两个进程交错写入及重启对照。
  **影响**：不能断言发生了覆盖或恢复一定可行。
  **进一步探讨**：对可销毁文档先制造写失败，再恢复权限或让另一进程先保存，逐步比较磁盘、读取状态和失败回执。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 客户端、构建、模型和恢复分别承担什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

使用已构建客户端做文件操作需能执行目标二进制、有 MCP 客户端及文档读写权。源码构建的 workspace 声明 Rust 1.94，下游平台与构建依赖要单独核对。已经明确的一条编辑命令可直接走 MCP，宿主用模型解释自然语言时仍要考虑模型配置、权限和调用资源。DSH 桌面集成会写 DSH_HOME 或默认 home 下的 `cordis.patch.yml`，而且配的是 streamable-http，需要实际启动可达服务；这与本次代表路径的 stdio 不同。禁用分支可删除项目管理块，无法据此推断用户原有的其他 MCP 设置都被移除。

首次成本包括选择客户端、配置宿主、准备文件副本和验收；持续成本来自模型调用、人工设计审阅、文件和导出维护。错误后需要重开文件、对照备份和检查是否有额外自动保存，不能从返回码推出费用或状态。适用计量单位是一页可重开、可改、可核对导出的界面稿，现金和人工时长分开，当前未知。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:24-34](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/Cargo.toml#L24-L34)

源码 workspace 的版本、可构建目标和 Rust 下限。

<details>
<summary>查看原文（11行）</summary>

```text
default-members = ["crates/op-host-desktop", "crates/op-cli", "crates/op-host-web-server"]

[workspace.package]
version = "0.8.5"
edition = "2021"
# 1.94 floor: the official github-copilot-sdk (including its former 0.1
# release) requires Rust 1.94. Release builders and CI already use it.
rust-version = "1.94"
license = "MIT"
authors = ["ZSeven-W <fini.yang@gmail.com>"]
repository = "https://github.com/ZSeven-W/openpencil"
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/cli_modes.rs:68-82](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/cli_modes.rs#L68-L82)

本机文件服务的调用入口。

<details>
<summary>查看原文（15行）</summary>

```text
fn run_mcp_stdio(
    prog: &str,
    mut args: impl Iterator<Item = String>,
    catalog: McpToolCatalog,
) -> Option<i32> {
    let Some(path) = args.next() else {
        eprintln!("{prog} --mcp: missing <path> arg");
        return Some(2);
    };
    crate::user_scene_template_store::initialize_user_scene_templates_once();
    if let Err(e) = crate::mcp_serve::run(PathBuf::from(path), catalog) {
        eprintln!("{prog} --mcp: {e}");
        return Some(1);
    }
    Some(0)
```

</details>

**依据 3 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations.rs:185-198](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/mcp_integrations.rs#L185-L198)

实际 DSH 配置选择 home 路径。

<details>
<summary>查看原文（14行）</summary>

```text
        McpCli::ZCode => home.join(".zcode").join("cli").join("config.json"),
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
            }
```

</details>

**依据 4 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:29-35](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L29-L35)

配置的连接方式和宿主包。

```text
/// The exact nine-line managed block, markers included. In the
/// top-level-array context this is valid YAML on its own. `url` is the
/// live server endpoint (`mcp_integrations::endpoint_url`).
fn dsh_patch_block(url: &str) -> String {
    format!(
        "{DSH_PATCH_BEGIN}\n- insert:\n    - id: mcp-openpencil\n      name: '@deepseek-ai/dsh-mcp-client'\n      config:\n        serverName: openpencil\n        transport: streamable-http\n        url: {url}\n{DSH_PATCH_END}\n"
    )
```

**依据 5 · 源码核查**：[crates/op-host-desktop/src/mcp_integrations_dsh.rs:118-127](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-desktop/src/mcp_integrations_dsh.rs#L118-L127)

停用时移除由本项目管理的配置块。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 6 · 作者声明**：[README.md:333-336](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/README.md#L333-L336)

作者区分 stdio 与 live HTTP。

```text
- Built-in MCP server (`op-mcp` crate) — one-click install into Claude Code / Codex / OpenCode / Kiro / Copilot CLIs
- No Node.js required — stdio transport via the desktop binary (`--mcp <path>`), plus a live HTTP endpoint (`127.0.0.1:<port>/mcp`) from the running app
- Design automation from terminal: read, create, and modify `.op` files via any MCP-compatible agent
- **Layered design workflow** — `design_skeleton` → `design_content` → `design_refine` for higher-fidelity multi-section designs
```

#### 缺口

- 未获得已安装客户端、模型调用耗时和可接受的导出结果。
  **影响**：不能给出不同构建或接入路线的总成本。
  **进一步探讨**：按同一设计的编辑、重开与导出逐项记录配置时间、生成资源、人工修正及恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何用可销毁副本检验防误覆盖及设计收益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

设计者可先在单写入者、授权范围明确的可销毁副本中交给 MCP 一次可核对修改。检查节点层级、重新打开后能否继续编辑，再用现有编辑器核对导出。需多人同时维护的主要设计文件应先走隔离副本，避免未经验证的并发写入。

待验证假设是在现有临时文件发布之前，校验接入时记录的文件内容摘要，并用限定目录的写入协调把检查与替换连起来。应用到暂存状态，发布成功后再替换主内存状态。它在现有逐次保存上增加版本冲突提示和失败内存处理，需要额外 I/O 和锁管理。用同一副本对照现有实现和方案，让另一写入者抢先保存，另注入不可写目录和保存中断，测漏报覆盖、误报、失败后文件分叉和恢复时间。若仍有丢改动或开销影响正常协作，则放弃方案。试用发现文件路径、内存或磁盘结果对不上时立即停写，用备份恢复并由设计者人工完成。

#### 证据与依据

**依据 1 · 源码核查**：[crates/op-host-services/src/mcp_serve.rs:209-234](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/mcp_serve.rs#L209-L234)

内存先变更、保存后返回，界定对照点。

<details>
<summary>查看原文（26行）</summary>

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
    })?;
```

</details>

**依据 2 · 源码核查**：[crates/op-host-services/src/doc_io.rs:174-205](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-host-services/src/doc_io.rs#L174-L205)

已有暂存与替换，假设新增期望内容校验。

<details>
<summary>查看原文（32行）</summary>

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
}

/// Atomically install a completed sibling `.op` file at its fixed destination.
///
/// Figma import writes the large document to a hidden sibling first so it can
/// still observe cancellation before publication. Reusing the save path's
/// replace primitive keeps re-imports crash-safe while allowing the existing
/// `<source-stem>.op` to be replaced instead of creating numbered copies.
pub fn commit_staged_document(
    staging_path: &std::path::Path,
    destination: &std::path::Path,
) -> Result<(), DocIoError> {
    replace_file(staging_path, destination)?;
```

</details>

**依据 3 · 源码核查**：[crates/op-editor-core/src/state.rs:273-286](https://github.com/ZSeven-W/openpencil/blob/2bbc658caba5139cdfeb768b65da7f6f0080a703/crates/op-editor-core/src/state.rs#L273-L286)

现有内存保存基线不能直接提供跨进程的期望文件。

<details>
<summary>查看原文（14行）</summary>

```text
    /// Mark `revision` saved iff `generation` still names the live document.
    pub fn mark_saved_revision_at(&mut self, generation: u64, revision: u64) -> bool {
        if generation != self.document_generation {
            return false;
        }
        self.saved_revision = revision;
        self.editor_ui.document_dirty = self.is_dirty();
        true
    }

    /// Mark the current document revision as saved.
    pub fn mark_saved_revision(&mut self) {
        let (g, r) = (self.document_generation, self.revision);
        let _ = self.mark_saved_revision_at(g, r);
```

</details>

#### 缺口

- 无并发和失败注入对照，也没有真实设计交接数据。
  **影响**：无法判断方案是否减少误覆盖与返工。
  **进一步探讨**：固定单页草图和两个写入顺序，分别记录变更一致性、拒绝结果、恢复时长与视觉验收。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
