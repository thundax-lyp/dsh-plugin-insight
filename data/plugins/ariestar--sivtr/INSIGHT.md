# sivtr

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[15ca543](https://github.com/Ariestar/sivtr/tree/15ca543a042231a3301cc2ae37b2d60b187190c1)

<!-- BEGIN META -->
[![GitHub ★ 253](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=253&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ariestar/sivtr)
<!-- END META -->

> **功能**：独立Rust记忆工具将终端与Agent日志统一归档并以MCP检索；已核Dsh链与完整WorkSet保存，但本地裸whole-ref的MCP默认全文缺补载。

> **亮点**：跨来源记录/派生归档、标准MCP查询和已物化WorkSet形成可复用材料组织；已核检索链不等自主工作闭环，也不等不可变裸ref或已验正确答案，见[Q01](#research-q01)/[Q02](#research-q02)。

> **主要限制**：MCP本地裸whole-ref以Light加载后默认full直接读空parts，条件性报No content found；@last/命名完整变量、part与CLI路径需分开。可选embedding发送内容，分享脱敏/价目不等安全与账单真值，见[Q02](#research-q02)/[Q03](#research-q03)。

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
  - [Q01 · sivtr是什么对象，DSH历史如何成为可检索材料？](#detail-section-11)
  - [Q02 · 引用与全文加载是否闭合，所谓精确证据有什么边界？](#detail-section-12)
  - [Q03 · 本地记忆、语义请求、分享与token成本各信任到哪里？](#detail-section-13)
  - [Q04 · 采用步骤和全生命周期成本如何分开？](#detail-section-14)
  - [Q05 · 应先采用什么，未来插件方向如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为需要找回既往失败输出/会话的开发者提供本地统一查找，场景明确而频率/净收益未验证，见[Q01](#research-q01)。

对照直接grep/打开源日志及宿主已有历史搜索，原件支持统一记录/引用增量，未证真实检索质量/净成本。完整@name已存在，不以新增快照虚构差异，见[Q02](#research-q02)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| sivtr_search | 按条件查询统一记忆 | 来源/同步/过滤有效，persist会写完整@last |
| sivtr_show | 展开引用/变量内容 | 裸本地whole默认full缺补载；part/完整变量/CLI有不同路径 |
| sivtr_zoom | 从锚点扩上下文并保存 | 共享workset/context，非当前事实验收 |
| sivtr_filter | 重新筛选WorkSet并保存 | 默认结果/正文依过滤，保存可写本地 |
| sivtr_status | 看环境/provider/mount/变量状态 | 状态不代表每个源/平台已验 |
| sivtr_usage | 汇总token及价目估价 | transcript完整度/内嵌价格，保留unpriced |
| sivtr_stats | 聚合活动/结果/隐私/usage | 归档统计，不是工作质量/账单 |
| 命名WorkSet/@last | 物化保存材料供复用 | 已有parts保留；裸逻辑ref不等不可变内容 |
| semantic/hybrid模式 | 可选向量/混合检索 | endpoint/模型/Key与内容出站，已有text_hash失效 |
| share查询投影 | 可选跨peer读取分享材料 | 显式授权/默认高信号脱敏，可关闭，未全审协议 |
| CLI run捕获 | 真执行指定程序后归档输出 | 真实副作用；stdout后stderr合并，非已核实时交错透传 |

**流程与依赖**

| 依赖 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 可运行sivtr二进制 | 核心必需 | 运行独立工具；自编译声明Rust1.95；包版本0.8.2 | 需另行准备；本轮未验发行物/全部平台，不当已能安装 |
| 允许读取的会话/捕获 | 该记忆链必需 | Dsh格式0，DSH_HOME或默认目录供检索 | 核源目录/格式和权限；失败单列，不把空结果当无历史 |
| 本地可写数据目录 | 归档/变量必需 | 写cache/archive.db与WorkSet；读历史也写派生数据 | 查磁盘/权限并处理失败，不当材料已保存 |
| MCP宿主 | MCP模式必需，CLI不需 | 以stdio进程/工具配置调用查询 | 未配可用CLI；裸whole全文先修并核原文，其他路径须区分 |
| embedding服务/Key | 语义/混合可选 | 配置端点/model，Key按服务可选；发送查询/内容 | 缺配置时语义模式报错，可主动改本地文本检索；费用/数据处理另核 |
| share daemon/授权peer | 分享可选 | 按share root/邀请与redact开关查询投影 | 不可用则不分享，已有本地读取不依赖它；协议/ACL未全审，脱敏best effort |
| shell hooks/编辑器 | 额外捕获/编辑可选 | 可改配置/调用外部程序 | 不装也可读已有Dsh；额外捕获/编辑按配置另核，未验完整撤装 |

| 步骤 | 操作者与动作 | 完成/失败判据 |
|---|---|---|
| 选源 | 用户选允许的匿名历史并核目录/格式，sivtr同步源 | 失败源单列，不把部分结果当全扫 |
| 查找 | 用户/外部宿主给窄query和范围，sivtr同步归档并检索 | 用户核原文/上下文，不以相似度当正确 |
| 展开 | MCP宿主调用sivtr读取已物化@last/命名变量或part，用户也可用CLI全文 | 裸whole MCP默认full需修后核 |
| 使用 | 用户/外部宿主对照当前文件/测试后决定取用旧证据 | 旧成功不能代表当前通过，不是sivtr已自动完成现状验证 |
| 可选扩展 | 用户分别授权embedding/share/capture，sivtr执行对应请求/捕获 | 核出站/内容/副作用，再考虑启用 |

**效果与成本**

| 阶段 | 钱/机器资源 | 人工与时间 | 失败/退出边界 |
|---|---|---|---|
| 首次 | 二进制/编译、派生SQLite/索引/快照磁盘；金额未知 | 核源/宿主配置/首轮扫描，耗时未知 | 先匿名少量，备份被改配置 |
| 持续 | 扫描/查询CPU/IO，语义可选API费/向量存储 | 核召回/原文与当前状态、处理格式升级 | usage估价不等账单/节省 |
| 失败恢复 | 重同步/重建派生archive、可选重嵌入成本 | 定位缺源/全文入口/失效ref、恢复配置 | 不把源移除后的派生归档当永久备份 |
| 退出 | 导出/保留原件/快照占用资源 | 撤宿主/可选hooks/daemon配置、核残留 | 未验全撤装，不承诺零残留/数据可恢复 |

| 层次 | 材料支持的效果 | 未知/判据 |
|---|---|---|
| 已有 | 统一源/查询/完整WorkSet/usage分类 | 源码活动存在，非任务效果 |
| 作者/接口说明 | 多provider、exact costs、共享隐私 | 覆盖需逐源核，估价/正则边界见Q03 |
| 独立用户结果 | 尚无本轮运行/任务对照 | 误引、完成率、净总投入三组验证 |

> **思考**：MCP本地裸whole-ref以Light加载后默认full直接读空parts，条件性报No content found；@last/命名完整变量、part与CLI路径需分开。可选embedding发送内容，分享脱敏/价目不等安全与账单真值，见[Q02](#research-q02)/[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：跨来源记录/派生归档、标准MCP查询和已物化WorkSet形成可复用材料组织；已核检索链不等自主工作闭环，也不等不可变裸ref或已验正确答案，见[Q01](#research-q01)/[Q02](#research-q02)。

逐session事务与共享模型/查询、物化快照是现有工程贡献；Light优化和MCP全文契约未一致。整数估价/脱敏边界需如实保留，见[Q01](#research-q01)至[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

MCP本地裸whole-ref以Light加载后默认full直接读空parts，条件性报No content found；@last/命名完整变量、part与CLI路径需分开。可选embedding发送内容，分享脱敏/价目不等安全与账单真值，见[Q02](#research-q02)/[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先修MCP裸whole-ref全文，谨慎核已有@last/CLI路径；不强制开embedding/share/hooks，避免把未知平台/需求当已验证安装推荐，见[Q04](#research-q04)/[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码闭合Dsh同步/归档/MCP与保存快照，发现MCP裸whole全文分叉；未执行目标/宿主/网络/安装/测试。宜观察并先修入口，有限人工核原文路径不当全面采用。

- 已检查：作者 README、包清单、源码路径 Cargo.toml、crates/sivtr-core/src/agents/dsh.rs、crates/sivtr-core/src/agents/mod.rs、crates/sivtr-core/src/archive/schema.rs、crates/sivtr-core/src/archive/stats.rs、crates/sivtr-core/src/archive/store.rs、crates/sivtr-core/src/archive/sync.rs、crates/sivtr-core/src/capture/subprocess.rs、crates/sivtr-core/src/privacy.rs、crates/sivtr-core/src/query/mod.rs、crates/sivtr-core/src/record/model.rs、crates/sivtr-core/src/record/refs.rs、crates/sivtr-core/src/search/filter.rs、crates/sivtr-core/src/usage/mod.rs、crates/sivtr-core/src/usage/pricing.rs、crates/sivtr-core/src/workset.rs、src/commands/memory/filter.rs、src/commands/memory/search.rs、src/commands/memory/semantic.rs、src/commands/memory/show.rs、src/commands/memory/workset/mod.rs、src/commands/memory/workset/source.rs、src/commands/memory/workset/store.rs、src/commands/memory/zoom.rs、src/commands/remote/share.rs、src/commands/system/mcp.rs、src/commands/terminal/run.rs、src/lib.rs、src/main.rs、src/mcp/server.rs、src/mcp/types.rs、src/remote/daemon.rs、src/remote/redact.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计器只列MD/CJS/MJS/TS等表列文件，未计核心Rust；候选含文档/测试/示例，非整个工程代码量/原创投入。只读Dsh代表源→archive→MCP/search/show与相关filter/变量、可选embedding/分享投影/usage、run采集代表；未全审40+provider、TUI/VSCode/hooks、所有输出/平台/远端协议/生命周期，未运行目标或网络。
- 下一步：先核裸whole/part/@last/CLI原文一致和源重写，再比直接搜索、修复原工具、当前任务验证交接；看误引/独立任务通过、返工与全成本，见[Q02](#research-q02)/[Q05](#research-q05)。

**分析版本**

- **仓库**：[Ariestar/sivtr](https://github.com/Ariestar/sivtr)
- **版本号**：0.8.2（Cargo workspace声明）（[固定提交 15ca543](https://github.com/Ariestar/sivtr/tree/15ca543a042231a3301cc2ae37b2d60b187190c1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先修现有全文入口；再检验历史证据与当前任务适用性的可核交接，区别于已有快照/hash/口头核文件要求。三组对照若无误引/投入改善即否定，见[Q05](#research-q05)。

先核裸whole/part/@last/CLI原文一致和源重写，再比直接搜索、修复原工具、当前任务验证交接；看误引/独立任务通过、返工与全成本，见[Q02](#research-q02)/[Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计器覆盖下表列出的MD/CJS/MJS/TS等文件，未计核心Rust；不代表全工程代码量或原创投入。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 100 | 13878 | — | — | 95513 |
| .cjs | example | 1 | 43 | 29 | 11 | — |
| .mjs | source | 2 | 488 | 450 | 4 | — |
| .ts | source | 8 | 877 | 779 | 8 | — |
| .ts | test | 3 | 275 | 251 | 6 | — |
| .mjs | test | 1 | 109 | 91 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 30](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=30&color=737b86&logo=github)](https://github.com/Ariestar/sivtr/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Ariestar/sivtr/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Ariestar/sivtr/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分统一历史检索/快照的实际贡献、全文加载反例和当前任务适用性的生产插件假说。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · sivtr是什么对象，DSH历史如何成为可检索材料？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

sivtr是独立Rust终端/会话记忆工具，根对象归tool，不是根DSH插件；本次已核核心是历史检索，不把它当自行规划/执行新任务的生成循环。Cargo workspace声明0.8.2、Rust1.95；VSCode扩展是旁支，不能用其包版本代表根工具。用户可把散落的终端输出和Agent会话放进统一归档，再由外部MCP宿主检索历史；模型仍决定如何使用材料。40+ provider是作者/注册表覆盖口径，本轮只闭合Dsh代表源，不据此验收所有格式/平台。

正常main→cli_main→Mcp分发→Tokio运行stdio server；七个工具通过ToolRouter实际注册，search真实调用共享search::run而非只声明工具名。Dsh注册项的factory返回DshProvider，AgentProvider的SessionSource实现将list/parse送到该provider；读取DSH_HOME或~/.dsh的sessions，接受JSONL/压缩日志，检查format version=0，再按user/message、assistant/message、tool/call/result等事件组装记录。调用事件只是历史消息，不会因此重执行旧工具。

本地查询打开archive并ensure_fresh；同步列源文件、比时间戳/大小，变更文件经SessionSource.parse_file和usage提取后upsert进SQLite。每个session用事务替换记录/隐私发现/usage；不是跨所有源的大事务。失败源保留报告且不会推进整批last_sync_at，查询可以有部分材料，不能把有结果当所有provider都扫完。provider源缺失会触发remove_missing_sessions，因此归档是派生状态；直接捕获和已物化WorkSet要分别判断，不当永不变的备份。

主能力逐项表见[能力清单](#capabilities)；本轮最有用的贡献是统一记录/检索/引用与已有快照，不是以工具数或provider数证明节时。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:1-18](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/Cargo.toml#L1-L18)

根workspace0.8.2/Rust1.95。

<details>
<summary>查看原文（18行）</summary>

```text
[workspace]
members = ["crates/sivtr-core", "."]
resolver = "2"

[workspace.package]
version = "0.8.2"
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
```

</details>

**依据 2 · 源码核查**：[src/main.rs:1-5](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/main.rs#L1-L5)

真实binary入口调用cli_main。

```text
//! CLI entry point.

fn main() -> std::process::ExitCode {
    sivtr::cli_main()
}
```

**依据 3 · 源码核查**：[src/lib.rs:34-56](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/lib.rs#L34-L56)

CLI入口和显式run分发。

<details>
<summary>查看原文（23行）</summary>

```text
pub fn cli_main() -> ExitCode {
    output::install_diagnostics_listener();
    tui::panic::install();
    match run() {
        Ok(()) => ExitCode::SUCCESS,
        Err(error) if commands::browse::is_pick_cancelled(&error) => ExitCode::SUCCESS,
        Err(error) => {
            output::error(format!("{error:#}"));
            ExitCode::FAILURE
        }
    }
}

fn run() -> Result<()> {
    let cli = cli::parse();
    output::set_color_choice(cli.color.into());
    let select_remotes = cli.all;

    match cli.command {
        Some(Commands::Run { command, args }) => {
            commands::terminal::run::execute(&command, &args)?;
        }
        Some(Commands::Pipe) => {
```

</details>

**依据 4 · 源码核查**：[src/lib.rs:90-96](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/lib.rs#L90-L96)

Mcp命令接system执行。

```text
            commands::publish::execute(command)?;
        }
        Some(Commands::Mcp(cmd)) => {
            commands::system::mcp::execute(cmd)?;
        }
        Some(Commands::Serve(args)) => {
            commands::remote::serve::execute(&args)?;
```

**依据 5 · 源码核查**：[src/commands/system/mcp.rs:213-224](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/system/mcp.rs#L213-L224)

正常serve启动Tokio并serve_stdio。

<details>
<summary>查看原文（12行）</summary>

```text
pub fn execute(command: McpCommand) -> Result<()> {
    match command.action {
        McpAction::Serve(args) => {
            // CLI `--idle-exit` wins over `[mcp] idle_exit_secs`. 0 = never.
            let idle_secs = resolve_idle_exit_secs(
                args.idle_exit,
                Some(SivtrConfig::load()?.mcp.idle_exit_secs),
            );
            let runtime = tokio::runtime::Builder::new_multi_thread()
                .enable_all()
                .build()?;
            runtime.block_on(mcp::serve_stdio(idle_secs.map(Duration::from_secs)))
```

</details>

**依据 6 · 源码核查**：[src/mcp/server.rs:30-50](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L30-L50)

tool_router/search实际调用。

<details>
<summary>查看原文（21行）</summary>

```text
#[tool_router]
impl SivtrMcp {
    pub fn new() -> Self {
        Self {
            tool_router: Self::tool_router(),
        }
    }

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
```

</details>

**依据 7 · 源码核查**：[src/mcp/server.rs:185-198](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L185-L198)

stdio服务真实接线。

<details>
<summary>查看原文（14行）</summary>

```text
pub async fn serve_stdio(idle_exit: Option<Duration>) -> anyhow::Result<()> {
    let server = Arc::new(SivtrMcp::new());
    let service = server.serve(stdio()).await?;
    let Some(idle) = idle_exit else {
        service.waiting().await?;
        return Ok(());
    };

    // Standard idle-exit: the clock starts at spawn, so any server that stays
    // idle for `idle` is killed — whether or not a tool was ever called —
    // and unused servers never linger. Every tool call resets the clock.
    // MCP stdio hosts respawn the server on the next tool use.
    //
    // This uses a hard `process::exit`: returning instead would drop the tokio
```

</details>

**依据 8 · 源码核查**：[crates/sivtr-core/src/agents/mod.rs:76-82](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/mod.rs#L76-L82)

Dsh registry指factory。

```text
        provider: AgentProvider::Dsh,
        name: "Dsh",
        command_name: "dsh",
        current_transcript_env: None,
        current_session_id_env: None,
        factory: dsh_provider,
    },
```

**依据 9 · 源码核查**：[crates/sivtr-core/src/agents/mod.rs:437-439](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/mod.rs#L437-L439)

factory实际构造DshProvider。

```text
fn dsh_provider() -> Box<dyn AgentSessionProvider> {
    Box::new(crate::agents::dsh::DshProvider)
}
```

**依据 10 · 源码核查**：[crates/sivtr-core/src/agents/mod.rs:585-606](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/mod.rs#L585-L606)

SessionSource真正委派list/parse。

<details>
<summary>查看原文（22行）</summary>

```text
impl SessionSource for AgentProvider {
    fn namespace(&self) -> &'static str {
        self.command_name()
    }

    fn list_sessions(&self, cwd: Option<&Path>) -> Result<Vec<SessionInfo>> {
        self.session_provider()
            .list_recent_sessions(cwd)
            .with_context(|| format!("Failed to list {} sessions", self.name()))
    }

    fn parse_file(&self, path: &Path) -> Result<Vec<WorkRecord>> {
        let session = self
            .session_provider()
            .parse_session_file(path)
            .with_context(|| {
                format!("Failed to parse {} session {}", self.name(), path.display())
            })?;
        Ok(WorkRecord::chat_turns(*self, &session))
    }
}

```

</details>

**依据 11 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:66-99](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/dsh.rs#L66-L99)

Dsh日志列出/读取及环境目录。

<details>
<summary>查看原文（34行）</summary>

```text
    fn list_recent_sessions(&self, cwd: Option<&Path>) -> Result<Vec<SessionInfo>> {
        let root = sessions_root();
        list_sessions_matching(
            PROVIDER_NAME,
            &root,
            cwd,
            |path, is_dir| !is_dir && is_dsh_log(path),
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
```

</details>

**依据 12 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:102-122](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/dsh.rs#L102-L122)

JSONL/zstd读取，不执行历史。

<details>
<summary>查看原文（21行）</summary>

```text
/// Whether the file is a dsh session log artifact (`session.jsonl` /
/// `session.jsonl.zstd`), whichever encoding the deployment uses.
fn is_dsh_log(path: &Path) -> bool {
    matches!(
        path.file_name().and_then(|name| name.to_str()),
        Some("session.jsonl") | Some("session.jsonl.zstd")
    )
}

/// Read a whole session log as text, decompressing `.jsonl.zstd` artifacts.
fn read_log(path: &Path) -> Result<Vec<u8>> {
    let bytes = fs::read(path)
        .with_context(|| format!("Failed to read {PROVIDER_NAME} session: {}", path.display()))?;
    if is_zstd(path) {
        decode_zstd(&bytes, None).with_context(|| {
            format!(
                "Failed to decompress {PROVIDER_NAME} session: {}",
                path.display()
            )
        })
    } else {
```

</details>

**依据 13 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:267-274](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/dsh.rs#L267-L274)

格式版本校验。

```text
fn check_format_version(value: &Value) -> Result<()> {
    let version = value.get("version").and_then(Value::as_u64);
    if version != Some(SESSION_FORMAT_VERSION) {
        bail!(
            "unsupported {PROVIDER_NAME} session log version {version:?} (this build reads version {SESSION_FORMAT_VERSION})"
        );
    }
    Ok(())
```

**依据 14 · 源码核查**：[crates/sivtr-core/src/agents/dsh.rs:349-399](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/agents/dsh.rs#L349-L399)

实际user/assistant/tool事件分派。

<details>
<summary>查看原文（51行）</summary>

```text
fn apply_event(
    session: &mut AgentSession,
    tool_names: &mut HashMap<String, String>,
    first_user: &mut Option<String>,
    value: &Value,
) {
    let timestamp = value
        .get("time")
        .and_then(Value::as_i64)
        .map(|ms| ms.to_string());
    match value.get("type").and_then(Value::as_str) {
        Some("session/title") => {
            // dsh titles are latest-wins snapshots; keep the last one seen.
            if let Some(title) = event_title(value) {
                session.title = Some(title);
            }
        }
        Some("user/message") => {
            if !is_user_message(value) {
                return;
            }
            let Some(text) = user_message_text(value) else {
                return;
            };
            if first_user.is_none() {
                *first_user = Some(text.clone());
            }
            push_block(session, AgentBlockKind::User, timestamp, None, text);
        }
        Some("assistant/message") => {
            let Some(message) = value.pointer("/data/message") else {
                return;
            };
            apply_assistant_message(session, tool_names, timestamp, message);
        }
        Some("tool/call") => {
            if let (Some(call_id), Some(name)) = (
                value.pointer("/data/callId").and_then(Value::as_str),
                value.pointer("/data/name").and_then(Value::as_str),
            ) {
                tool_names.insert(call_id.to_string(), name.to_string());
            }
        }
        Some("tool/result") => {
            let Some(message) = value.pointer("/data/message") else {
                return;
            };
            apply_tool_result_message(session, tool_names, timestamp, message);
        }
        _ => {}
    }
```

</details>

**依据 15 · 源码核查**：[crates/sivtr-core/src/query/mod.rs:79-112](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/query/mod.rs#L79-L112)

查询打开归档/同步/按LoadMode解码。

<details>
<summary>查看原文（34行）</summary>

```text
/// Build the record index for a workspace: read every archived session of
/// the given sources (terminal, agent providers, …), deduplicate records,
/// and sort newest-first.
///
/// The archive is the single read surface: a stamp-gated freshness pass
/// brings it up to date first, then sessions are listed and decoded from
/// `archive.db` — native session files are only parsed by the sync engine.
///
/// `recent_sessions` truncates how many recent sessions each source
/// contributes.
pub fn load_workspace_records(
    sources: &[Box<dyn SessionSource>],
    cwd: &Path,
    recent_sessions: Option<usize>,
    mode: LoadMode,
) -> Result<QueryResult> {
    let namespaces: Vec<&str> = sources.iter().map(|source| source.namespace()).collect();
    let conn = crate::archive::open()?;
    let sync_skipped = crate::archive::sync::ensure_fresh_with_conn(&conn)?;
    let listed = crate::archive::store::list_workspace_sessions(
        &conn,
        &namespaces,
        Some(cwd),
        recent_sessions,
    )?;

    let mut result = QueryResult::default();
    result.records = decode_archived_sessions(&conn, &listed, mode, &mut result.skipped)?;
    result.skipped.extend(sync_skipped);
    dedup_records(&mut result.records);
    normalize_session_display_ids(&mut result.records);
    result
        .records
        .sort_by(|a, b| b.time.primary_at().cmp(&a.time.primary_at()));
```

</details>

**依据 16 · 源码核查**：[crates/sivtr-core/src/archive/sync.rs:153-184](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/sync.rs#L153-L184)

按源同步及失败时不推进last_sync_at。

<details>
<summary>查看原文（32行）</summary>

```text
fn sync_sources(
    conn: &Connection,
    full: bool,
    providers: &[AgentProvider],
    include_terminals: bool,
) -> Result<SyncReport> {
    let started = std::time::Instant::now();

    let mut sources = Vec::new();
    for provider in providers {
        sources.push(sync_provider(conn, *provider, full));
    }
    if include_terminals {
        sources.push(sync_terminals(conn, full));
    }

    let report = SyncReport {
        sources,
        duration_ms: started.elapsed().as_millis() as u64,
    };
    // The freshness stamp advances only on a clean pass: a source that
    // failed listing or parsing leaves it stale, so the next query re-syncs
    // and re-reports the failure instead of reading a stale archive for a
    // full `max_age_secs` window.
    let clean = report
        .sources
        .iter()
        .all(|source| source.error.is_none() && source.failures.is_empty());
    if clean {
        store::meta_set(
            conn,
            "last_sync_at",
```

</details>

**依据 17 · 源码核查**：[crates/sivtr-core/src/archive/sync.rs:227-268](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/sync.rs#L227-L268)

文件stamp跳过/同步/源缺失移除。

<details>
<summary>查看原文（42行）</summary>

```text
    for info in sessions {
        source_paths.push(info.path.to_string_lossy().into_owned());
        let physical_path = info.physical_path.as_deref().unwrap_or(&info.path);
        let Some(stamp) = crate::cache::file_stamp(physical_path) else {
            counts.failed += 1;
            failures.push((
                info.path.clone(),
                format!(
                    "source disappeared before sync: {}",
                    physical_path.display()
                ),
            ));
            continue;
        };
        if !full && stamps.get(info.path.to_string_lossy().as_ref()) == Some(&stamp) {
            counts.unchanged += 1;
            continue;
        }
        match sync_session(
            conn,
            &provider,
            &info.path,
            info.id.as_deref(),
            info.title.as_deref(),
            info.cwd.as_deref(),
            stamp,
        ) {
            Ok(was_new) => {
                if was_new {
                    counts.added += 1;
                } else {
                    counts.updated += 1;
                }
            }
            Err(error) => {
                counts.failed += 1;
                failures.push((info.path.clone(), format!("{error:#}")));
            }
        }
    }
    match store::remove_missing_sessions(conn, provider.command_name(), &source_paths) {
        Ok(removed) => counts.removed = removed,
```

</details>

**依据 18 · 源码核查**：[crates/sivtr-core/src/archive/sync.rs:394-430](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/sync.rs#L394-L430)

真实parse→usage→upsert。

<details>
<summary>查看原文（37行）</summary>

```text
pub fn sync_session(
    conn: &Connection,
    source: &dyn SessionSource,
    path: &Path,
    listing_id: Option<&str>,
    listing_title: Option<&str>,
    listing_cwd: Option<&str>,
    stamp: Stamp,
) -> Result<bool> {
    let records = SessionSource::parse_file(source, path)?;
    let provider = source.namespace();
    let session_id = derive_session_id(&records, listing_id)?;
    let usage_events = crate::usage::extract::extract(provider, path)?;
    let cwd = records
        .iter()
        .find_map(|record| record.cwd.clone())
        .or_else(|| listing_cwd.map(str::to_string));
    let workspace_key = cwd
        .as_deref()
        .map(Path::new)
        .and_then(workspace::repo_identity)
        .unwrap_or_default();

    let inserted = store::upsert_session(
        conn,
        &SessionUpsert {
            provider,
            session_id: &session_id,
            source_path: path,
            cwd: cwd.as_deref(),
            workspace_key: &workspace_key,
            title: listing_title,
            stamp,
            records: &records,
            usage_events: &usage_events,
        },
    )?;
```

</details>

**依据 19 · 源码核查**：[crates/sivtr-core/src/archive/store.rs:154-168](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/store.rs#L154-L168)

同session事务中替换records/privacy/usage。

<details>
<summary>查看原文（15行）</summary>

```text
                    up.stamp.1 as i64,
                    up.stamp.2 as i64,
                ],
            )
            .with_context(|| format!("Failed to insert archived session {}", up.session_id))?;
            tx.last_insert_rowid()
        }
    };
    let inserted = existing_row.is_none();

    replace_records(&tx, session_row, up.records)?;
    replace_secret_findings(&tx, session_row, up.records)?;
    replace_usage_events(&tx, session_row, up.usage_events)?;
    tx.commit().context("Failed to commit archived session")?;
    Ok(inserted)
```

</details>

#### 缺口

- 未运行二进制、当前DSH样本、其他provider和平台；未独立观察用户检索任务。
  **影响**：不能据注册覆盖推所有会话可解析、现机可用或普遍节时；代表Dsh格式升级可能直接拒绝。
  **进一步探讨**：以匿名固定会话逐个核解析/查询/原文，并与用户直接查会话文件的任务对照；失败源单独报告。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 引用与全文加载是否闭合，所谓精确证据有什么边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

WorkRef以source/session/index及可选part定位，逻辑路径未携内容版本。session upsert会删旧records再插入当前记录，故裸ref指向当前归档位置，不能单凭相同字符串证明历史内容不变。已有@last和命名WorkSet不是只有裸引用：persist先save_last，save_last克隆后materialize_parts再写JSON，save_as也先补正文；完整存储的parts可保留当次材料。因此不应把所有变量说成漂移，也不应另把“保存快照”算尚不存在的新方向。

关键静态缺口是本地裸whole-record ref的MCP默认全文：sivtr_show取show::run结果后直接show_result；run传Filter::none，默认filter不需parts；local_load_mode只在需正文或part-ref时选Full，whole-ref选Light。query按该mode读取blob_light，而encode_record(light)清parts。apply_loaded→filter::apply只选/克隆内存records，轻记录仍可匹配无限制filter；没有隐式回读。show_result默认full→render_full_items→content_for_at(Whole)→combined_text→write_combined_text只拼parts，空串被过滤后报“No content found for ref”。这是已闭合源码条件推断，未运行复现。

CLI路径不同：execute把可变set交print_workset，非refs时materialize_parts后才render；part-ref强制Full，已物化@last/命名变量也不同，远端share查询还显式Full。故不能扩大成所有show/MCP检索都坏，但正常裸whole引用到全文的承诺尚不闭合。需要修的首先是该入口共享加载契约，不是补一个README精确性口号。

其他现有工具已接线：zoom从来源取锚点/上下文再保存，filter重新筛选再persist；status汇集环境，usage/stats从归档计算。它们未因此获得业务事实验收。

#### 证据与依据

**依据 1 · 源码核查**：[crates/sivtr-core/src/record/refs.rs:33-44](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/record/refs.rs#L33-L44)

逻辑source/session/index定位。

<details>
<summary>查看原文（12行）</summary>

```text
/// Scope-local logical path: `source/session/index` (not a filesystem path).
#[derive(Debug, Clone, PartialEq, Eq, Hash)]
pub enum WorkPath {
    Terminal {
        session: String,
        index: usize,
    },
    Agent {
        provider: AgentProvider,
        session: String,
        index: usize,
    },
```

</details>

**依据 2 · 源码核查**：[crates/sivtr-core/src/archive/store.rs:227-249](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/store.rs#L227-L249)

更新session会替换records。

<details>
<summary>查看原文（23行）</summary>

```text
fn replace_records(tx: &Transaction<'_>, session_row: i64, records: &[WorkRecord]) -> Result<()> {
    tx.execute("DELETE FROM records WHERE session_row = ?1", [session_row])
        .context("Failed to clear archived records")?;
    for record in records {
        let (outcome, exit_code) = record
            .status
            .as_ref()
            .map(|status| (Some(status.outcome), status.exit_code))
            .unwrap_or((None, None));
        tx.execute(
            "INSERT INTO records (session_row, idx, title, started_at, ended_at,
             outcome, exit_code, blob, blob_light)
             VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
            params![
                session_row,
                record.work_ref.index() as i64,
                record.title,
                record.time.started_at,
                record.time.ended_at,
                outcome.map(outcome_label),
                exit_code,
                encode_record(record, false)?,
                encode_record(record, true)?,
```

</details>

**依据 3 · 源码核查**：[src/commands/memory/workset/mod.rs:40-61](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/mod.rs#L40-L61)

命名和@last保存前真正materialize。

<details>
<summary>查看原文（22行）</summary>

```text
pub(crate) fn save_as(set: &mut WorkSet, name: &str) -> Result<()> {
    store::validate_name(name)?;
    set.materialize_parts()?;
    set.validate()?;
    set.name = Some(name.to_string());
    save_named(name, set).with_context(|| format!("save WorkSet @{name}"))
}

/// Persist the `@last` WorkSet.
pub(crate) fn save_last(set: &WorkSet) -> Result<()> {
    let mut set = set.clone();
    set.materialize_parts()?;
    set.validate()?;
    save_named("last", &set).context("save @last WorkSet")
}

pub(crate) fn persist(set: &mut WorkSet, name: Option<&str>) -> Result<()> {
    save_last(set)?;
    if let Some(name) = name {
        save_as(set, name)?;
    }
    Ok(())
```

</details>

**依据 4 · 源码核查**：[src/commands/memory/workset/store.rs:7-25](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/store.rs#L7-L25)

WorkSet写/读JSON并validate。

<details>
<summary>查看原文（19行）</summary>

```text
pub fn save_named(name: &str, set: &WorkSet) -> Result<()> {
    let path = set_path(name)?;
    if let Some(parent) = path.parent() {
        fs::create_dir_all(parent)
            .with_context(|| format!("Failed to create WorkSet directory {}", parent.display()))?;
    }
    fs::write(&path, serde_json::to_string_pretty(set)?)
        .with_context(|| format!("Failed to write WorkSet @{} to {}", name, path.display()))
}

pub fn load_saved(name: &str) -> Result<WorkSet> {
    validate_name(name)?;
    let path = set_path(name)?;
    let content = fs::read_to_string(&path)
        .with_context(|| format!("Failed to read WorkSet @{name} from {}", path.display()))?;
    let set: WorkSet = serde_json::from_str(&content)
        .with_context(|| format!("Failed to parse WorkSet @{name} from {}", path.display()))?;
    set.validate()
        .with_context(|| format!("Invalid WorkSet @{name}"))?;
```

</details>

**依据 5 · 源码核查**：[crates/sivtr-core/src/workset.rs:397-427](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/workset.rs#L397-L427)

缺parts时按当前session Full补载；已有parts跳过。

<details>
<summary>查看原文（31行）</summary>

```text
    pub fn materialize_parts(&mut self) -> Result<()> {
        // Group light records by their session file path, then load each
        // session's full records once and patch matching parts back.
        let mut needed: HashMap<String, Vec<usize>> = HashMap::new();
        for (index, record) in self.records().iter().enumerate() {
            if !record.parts.is_empty() {
                continue;
            }
            let Some(path) = record.session.path.as_deref() else {
                continue;
            };
            needed.entry(path.to_string()).or_default().push(index);
        }

        for (path, indices) in &needed {
            // Any record in the group gives us the namespace; pick the first.
            let namespace = self.records()[indices[0]].work_ref.path.namespace();
            let full = load_session_records(namespace, Path::new(path), LoadMode::Full)
                .with_context(|| format!("Failed to load full session {path} for {namespace}"))?;
            for index in indices {
                if let Some(record) = self.records_mut().get_mut(*index) {
                    if let Some(full_record) = full
                        .iter()
                        .find(|r| r.work_ref.path.index() == record.work_ref.path.index())
                    {
                        record.parts = full_record.parts.clone();
                    }
                }
            }
        }
        Ok(())
```

</details>

**依据 6 · 源码核查**：[src/mcp/server.rs:54-64](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L54-L64)

MCP show直接run→show_result无补载。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 7 · 源码核查**：[src/mcp/types.rs:309-331](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/types.rs#L309-L331)

defaultfull输出转换且source直传。

<details>
<summary>查看原文（23行）</summary>

```text
pub fn to_show_args(params: &ShowParams) -> Result<ShowArgs, String> {
    let mode = params.mode.as_deref().unwrap_or("full");
    let format = match mode {
        "full" => Some(WorkSetOutputFormat::Full),
        "timeline" => Some(WorkSetOutputFormat::Timeline),
        "compact" => Some(WorkSetOutputFormat::Compact),
        "md" | "markdown" => Some(WorkSetOutputFormat::Md),
        "refs" => Some(WorkSetOutputFormat::Refs),
        "workset" | "json" => Some(WorkSetOutputFormat::WorkSet),
        other => {
            return Err(format!(
            "unknown show mode `{other}`; expected full, timeline, compact, md, refs, or workset"
        ))
        }
    };
    Ok(ShowArgs {
        source: params.source.clone(),
        cwd: params.cwd.as_deref().map(PathBuf::from),
        format,
        full: false,
        refs: false,
        json: false,
    })
```

</details>

**依据 8 · 源码核查**：[src/commands/memory/show.rs:86-118](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/show.rs#L86-L118)

run无正文filter，CLI print补parts。

<details>
<summary>查看原文（33行）</summary>

```text
pub fn execute(args: &ShowArgs) -> Result<()> {
    let mut set = run(args)?;
    print_workset(
        &mut set,
        resolve_output_format(args.format, args.full, args.refs, args.json),
    )
}

/// Resolve a show source into a WorkSet without printing.
pub fn run(args: &ShowArgs) -> Result<workset::WorkSet> {
    workset::query(
        &args.source,
        crate::commands::memory::filter::Filter::none(),
        args.cwd.as_deref(),
    )
}

/// Render a WorkSet. Content formats (everything but bare refs) materialize
/// part text first, so a light-loaded set renders fully.
pub fn print_workset(set: &mut workset::WorkSet, format: WorkSetOutputFormat) -> Result<()> {
    if format != WorkSetOutputFormat::Refs {
        set.materialize_parts()?;
    }
    match format {
        WorkSetOutputFormat::Full => print_full(set)?,
        WorkSetOutputFormat::WorkSet => {
            println!("{}", serde_json::to_string_pretty(set)?);
        }
        WorkSetOutputFormat::Compact => print_compact(set)?,
        WorkSetOutputFormat::Timeline => print_timeline(set)?,
        WorkSetOutputFormat::Md => print_markdown(set)?,
        WorkSetOutputFormat::Refs => print_refs(set),
    }
```

</details>

**依据 9 · 源码核查**：[crates/sivtr-core/src/search/filter.rs:47-60](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/search/filter.rs#L47-L60)

Filter derive Default、pattern/rank可空。

<details>
<summary>查看原文（14行）</summary>

```text
/// Unified filter for local and remote query. One type for CLI, wire, eval.
#[derive(Clone, Debug, Default, PartialEq, Eq, Serialize, Deserialize)]
pub struct Filter {
    #[serde(default)]
    pub mode: FilterMode,
    /// Uncompiled boolean pattern; applied case-insensitively per line.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pattern: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub exclude_regex: Option<String>,
    /// BM25 query used when `sort` is Relevance.
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rank: Option<String>,
    #[serde(default)]
```

</details>

**依据 10 · 源码核查**：[crates/sivtr-core/src/search/filter.rs:88-107](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/search/filter.rs#L88-L107)

none/default与needs_parts实际判据。

<details>
<summary>查看原文（20行）</summary>

```text
impl Filter {
    /// Keep every loaded anchor (show/nav/zoom).
    pub fn none() -> Self {
        Self::default()
    }

    /// Whether applying this filter reads part text: per-line pattern and
    /// exclude matching scan `parts`, BM25 ranking is built from part text,
    /// parts-mode emits per-part hits, kind and field bounds match on
    /// `part.kind()`, and input/output/command fields inspect part kinds.
    /// Title/session bounds and the default content field with no pattern
    /// stay metadata-only.
    pub fn needs_parts(&self) -> bool {
        self.pattern.is_some()
            || self.exclude_regex.is_some()
            || self.rank.is_some()
            || self.mode == FilterMode::Parts
            || self.kind.is_some()
            || matches!(self.in_field, Field::Input | Field::Output | Field::Command)
    }
```

</details>

**依据 11 · 源码核查**：[src/commands/memory/workset/source.rs:414-443](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/source.rs#L414-L443)

whole默认Light/part或正文Full，run_local与apply_loaded。

<details>
<summary>查看原文（30行）</summary>

```text
/// exclude, BM25 ranking) need a full load; metadata-only filters stay light
/// and callers materialize part text on demand.
///
/// A part ref (`claude/abc/2/p1`) also needs a full load: the filter resolves
/// the part inside the record, and a light record has no parts, so the ref
/// would match nothing.
fn local_load_mode(selector: &str, filter: &Filter) -> LoadMode {
    let addresses_part = selector
        .parse::<WorkRef>()
        .is_ok_and(|reference| reference.part().is_some());
    if filter.needs_parts() || addresses_part {
        LoadMode::Full
    } else {
        LoadMode::Light
    }
}

fn run_local(source: &str, root: &Path, filter: Filter, mode: LoadMode) -> Result<WorkSet> {
    let result = load_workspace_source(root, source, mode)?;
    warn_skipped(&result.skipped);
    apply_loaded(
        WorkSet::from_parts(root.display().to_string(), result.records, result.anchors),
        filter,
    )
}

fn apply_loaded(set: WorkSet, filter: Filter) -> Result<WorkSet> {
    let cwd = PathBuf::from(&set.cwd);
    let (records, anchors) = set.into_parts();
    filter::apply(cwd, records, anchors, filter)
```

</details>

**依据 12 · 源码核查**：[crates/sivtr-core/src/query/mod.rs:118-135](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/query/mod.rs#L118-L135)

LoadMode转换并真实加载该blob。

<details>
<summary>查看原文（18行）</summary>

```text
fn decode_archived_sessions(
    conn: &rusqlite::Connection,
    listed: &[crate::archive::store::ListedSession],
    mode: LoadMode,
    skipped: &mut Vec<SkippedSession>,
) -> Result<Vec<WorkRecord>> {
    let blob_mode = crate::archive::store::BlobMode::from(mode);
    let mut records = Vec::new();
    for session in listed {
        match crate::archive::store::load_records_by_row(conn, session.row_id, blob_mode) {
            Ok(session_records) => records.extend(session_records),
            Err(error) => skipped.push(SkippedSession {
                namespace: session.provider.clone(),
                path: PathBuf::from(&session.source_path),
                error: format!("{error:#}"),
            }),
        }
    }
```

</details>

**依据 13 · 源码核查**：[crates/sivtr-core/src/query/mod.rs:143-167](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/query/mod.rs#L143-L167)

裸ref经workspace按给定mode加载再resolve。

<details>
<summary>查看原文（25行）</summary>

```text
pub fn load_workspace_source(
    cwd: &Path,
    source: &str,
    mode: LoadMode,
) -> Result<SourceQueryResult> {
    if let Ok(reference) = source.parse::<WorkRef>() {
        if !reference.is_local() {
            anyhow::bail!("remote aliases are not valid inside a served source");
        }
        let providers = reference
            .provider()
            .map(|provider| vec![provider])
            .unwrap_or_else(all_agent_providers);
        let sources = workspace_sources(&providers);
        let result = load_workspace_records(&sources, cwd, None, mode)?;
        let index = WorkRecordIndex::new(result.records);
        let record = index
            .resolve(&reference)
            .cloned()
            .with_context(|| format!("No record found for ref `{source}`"))?;
        return Ok(SourceQueryResult {
            records: vec![record],
            anchors: vec![reference],
            skipped: result.skipped,
        });
```

</details>

**依据 14 · 源码核查**：[crates/sivtr-core/src/archive/store.rs:265-282](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/store.rs#L265-L282)

light编码实际清meta.parts。

<details>
<summary>查看原文（18行）</summary>

```text
fn encode_record(record: &WorkRecord, light: bool) -> Result<Vec<u8>> {
    let payload = if light {
        without_parts(record)
    } else {
        record.clone()
    };
    let mut serializer = rmp_serde::encode::Serializer::new(Vec::new()).with_struct_map();
    payload
        .serialize(&mut serializer)
        .context("Failed to encode record blob")?;
    Ok(serializer.into_inner())
}

/// Metadata view of a record: light fields only, part text emptied.
pub fn without_parts(record: &WorkRecord) -> WorkRecord {
    let mut meta = record.clone();
    meta.parts.clear();
    meta
```

</details>

**依据 15 · 源码核查**：[crates/sivtr-core/src/archive/store.rs:386-405](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/store.rs#L386-L405)

按BlobMode选择blob或blob_light。

<details>
<summary>查看原文（20行）</summary>

```text
/// Load one session's records by archive row.
pub fn load_records_by_row(
    conn: &Connection,
    session_row: i64,
    mode: BlobMode,
) -> Result<Vec<WorkRecord>> {
    let column = match mode {
        BlobMode::Full => "blob",
        BlobMode::Light => "blob_light",
    };
    let statement = format!("SELECT {column} FROM records WHERE session_row = ?1 ORDER BY idx ASC");
    let mut stmt = conn
        .prepare(&statement)
        .with_context(|| "Failed to prepare archived record load")?;
    let blobs: Vec<Vec<u8>> = stmt
        .query_map([session_row], |row| row.get(0))
        .context("Failed to read archived record blobs")?
        .collect::<std::result::Result<_, _>>()
        .context("Failed to read archived record blobs")?;

```

</details>

**依据 16 · 源码核查**：[src/commands/memory/filter.rs:169-183](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/filter.rs#L169-L183)

filter只search/clone，不物化。

<details>
<summary>查看原文（15行）</summary>

```text
pub(crate) fn apply(
    cwd: PathBuf,
    records: Vec<WorkRecord>,
    anchors: Vec<WorkRef>,
    filter: Filter,
) -> Result<WorkSet> {
    let searcher = Searcher::new(&records);
    let hits = searcher.search(&filter, &anchors, &cwd)?;
    let anchors: Vec<WorkRef> = hits.into_iter().map(|hit| hit.anchor).collect();
    let selected_records = workset::records_for_anchors(&records, &anchors);
    Ok(WorkSet::from_parts(
        cwd.display().to_string(),
        selected_records,
        anchors,
    ))
```

</details>

**依据 17 · 源码核查**：[crates/sivtr-core/src/search/filter.rs:496-503](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/search/filter.rs#L496-L503)

空parts元数据记录可匹配无限制内容filter。

```text
    // A metadata-only record (light view with empty `parts`, as browse
    // session lists load) matches an unrestricted content query — one that
    // reads no part text (no pattern, exclude, rank, or kind bound).
    // Without this, empty parts can never match, so session lists come back
    // empty once the meta cache is warm.
    if record.parts.is_empty() && !filter.needs_parts() && filter.in_field == Field::Content {
        return vec![hit(anchor.clone())];
    }
```

**依据 18 · 源码核查**：[crates/sivtr-core/src/workset.rs:431-443](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/workset.rs#L431-L443)

records_for_anchors仅克隆现有记录。

<details>
<summary>查看原文（13行）</summary>

```text
pub fn records_for_anchors(records: &[WorkRecord], anchors: &[WorkRef]) -> Vec<WorkRecord> {
    let mut selected = Vec::new();
    let mut seen = HashSet::new();
    for anchor in anchors {
        let record_ref = anchor.whole();
        if !seen.insert(record_ref.clone()) {
            continue;
        }
        if let Some(record) = find_record([records], anchor) {
            selected.push(record.clone());
        }
    }
    selected
```

</details>

**依据 19 · 源码核查**：[src/mcp/types.rs:392-441](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/types.rs#L392-L441)

MCP结果default分支直接render_full_items。

<details>
<summary>查看原文（50行）</summary>

```text
pub fn show_result(set: &WorkSet, mode: Option<&str>) -> anyhow::Result<ShowResult> {
    let mode = mode.unwrap_or("full");
    let anchors = set
        .anchors()
        .iter()
        .map(|anchor| anchor.to_string())
        .collect::<Vec<_>>();
    let count = anchors.len();

    match mode {
        "refs" => Ok(ShowResult {
            count,
            anchors,
            items: None,
            contents: None,
        }),
        "timeline" | "compact" | "md" => {
            let items = show::render_summary_items(set)?
                .into_iter()
                .map(|item| MemoryHit {
                    reference: item.reference,
                    title: item.title,
                    time: item.time,
                    source: item.source,
                    status: item.status,
                    snippet: item.snippet,
                })
                .collect();
            Ok(ShowResult {
                count,
                anchors,
                items: Some(items),
                contents: None,
            })
        }
        _ => {
            let contents = show::render_full_items(set)?
                .into_iter()
                .map(|(reference, content)| ShowContent {
                    reference: reference.to_string(),
                    content,
                })
                .collect();
            Ok(ShowResult {
                count,
                anchors,
                items: None,
                contents: Some(contents),
            })
        }
```

</details>

**依据 20 · 源码核查**：[src/commands/memory/show.rs:122-156](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/show.rs#L122-L156)

全文render无补载，空content明确报错。

<details>
<summary>查看原文（35行）</summary>

```text
fn anchor_items(set: &workset::WorkSet) -> Result<Vec<AnchorItem<'_>>> {
    set.anchors()
        .iter()
        .map(|anchor| {
            let record = workset::find_record([set.records()], anchor)
                .with_context(|| format!("No record found for anchor `{anchor}`"))?;
            Ok(AnchorItem {
                anchor: anchor.clone(),
                record,
            })
        })
        .collect()
}

fn print_full(set: &workset::WorkSet) -> Result<()> {
    let items = render_full_items(set)?
        .into_iter()
        .map(|(ref_, content)| ShowItem { ref_, content })
        .collect();
    print_show_items(items);
    Ok(())
}

/// Collect full content for each anchor without printing.
pub fn render_full_items(set: &workset::WorkSet) -> Result<Vec<(WorkRef, String)>> {
    anchor_items(set)?
        .into_iter()
        .map(|item| {
            let content = item
                .record
                .content_for_at(item.anchor.at)
                .with_context(|| format!("No content found for ref `{}`", item.anchor))?;
            Ok((item.anchor, content))
        })
        .collect()
```

</details>

**依据 21 · 源码核查**：[crates/sivtr-core/src/record/model.rs:669-711](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/record/model.rs#L669-L711)

combined_text仅拼parts，Whole空串为None。

<details>
<summary>查看原文（43行）</summary>

```text
    pub fn combined_text(&self) -> String {
        let mut text = String::new();
        self.write_combined_text(&mut text);
        text
    }

    pub fn input_text(&self) -> Option<String> {
        non_empty(self.projected_text(Projection::Input))
    }

    pub fn output_text(&self) -> Option<String> {
        non_empty(self.projected_text(Projection::Output))
    }

    /// The copy text of one projection: whole parts render in their display
    /// format, the sliced side of an action renders just that side.
    fn projected_text(&self, projection: Projection) -> String {
        let mut text = String::new();
        for part in self.project(projection) {
            append_text_segment(&mut text, &projected_part_text(part, projection));
        }
        text
    }

    pub fn content_for_at(&self, at: WorkAt) -> Option<String> {
        match at {
            WorkAt::Whole => Some(self.combined_text()).filter(|text| !text.is_empty()),
            WorkAt::Part(_) => self.part_for_at(at).map(|part| part.text().into_owned()),
        }
    }

    fn write_combined_text(&self, text: &mut String) {
        for part in &self.parts {
            append_text_segment(text, &format_work_part(part));
        }
    }

    pub fn part_for_at(&self, at: WorkAt) -> Option<&WorkPart> {
        let seq = match at {
            WorkAt::Part(seq) => seq,
            WorkAt::Whole => return None,
        };
        self.parts.iter().find(|part| part.seq == seq)
```

</details>

**依据 22 · 源码核查**：[src/commands/memory/zoom.rs:20-42](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/zoom.rs#L20-L42)

zoom真加载上下文/保存入口。

<details>
<summary>查看原文（23行）</summary>

```text
pub fn run(args: &ZoomArgs) -> Result<WorkSet> {
    let source = workset::query(
        &args.source,
        crate::commands::memory::filter::Filter::none(),
        args.cwd.as_deref(),
    )?;
    let cwd = std::path::PathBuf::from(&source.cwd);

    let base_context = args.context.unwrap_or(3);
    let before = args.before.unwrap_or(base_context);
    let after = args.after.unwrap_or(base_context);

    let anchors = source.anchors().to_vec();
    let expanded = if source.records().is_empty() || anchors.is_empty() {
        Vec::new()
    } else {
        let all_records = workset::load_context_records(source.records(), &anchors, &cwd)?;
        expand_around(source.records(), &anchors, &all_records, before, after)?
    };

    let mut set = WorkSet::new(source.cwd, expanded);
    workset::persist(&mut set, args.save.as_deref()).context("保存 zoom WorkSet")?;
    Ok(set)
```

</details>

**依据 23 · 源码核查**：[src/commands/memory/filter.rs:160-164](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/filter.rs#L160-L164)

filter实际query/persist。

```text
/// Load, filter, and optionally save a WorkSet without printing.
pub fn run(args: &FilterArgs) -> Result<WorkSet> {
    let mut set = workset::query(&args.source, from_filter_args(args)?, args.cwd.as_deref())?;
    workset::persist(&mut set, args.save.as_deref()).context("persist filter WorkSet")?;
    Ok(set)
```

**依据 24 · 源码核查**：[src/mcp/server.rs:97-106](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L97-L106)

status实际collect。

<details>
<summary>查看原文（10行）</summary>

```text
    #[tool(
        description = "Environment and origin status: version, hooks, providers, daemon, unified origins (local workspaces + remote mounts), and saved WorkSet vars."
    )]
    fn sivtr_status(
        &self,
        Parameters(params): Parameters<StatusParams>,
    ) -> Result<CallToolResult, McpError> {
        let result = collect_status(params.cwd.as_deref()).map_err(tool_error)?;
        ok_json(result)
    }
```

</details>

**依据 25 · 源码核查**：[src/mcp/server.rs:132-152](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L132-L152)

stats真实归档计算与warnings。

<details>
<summary>查看原文（21行）</summary>

```text
    #[tool(
        description = "Read activity, outcome, project, privacy, and token-cost statistics from the unified archive."
    )]
    fn sivtr_stats(
        &self,
        Parameters(params): Parameters<StatsParams>,
    ) -> Result<CallToolResult, McpError> {
        let query = sivtr_core::archive::stats::StatsQuery {
            provider: params.provider,
            since: params.since,
            until: params.until,
        };
        query.validate().map_err(invalid_params)?;
        let conn = sivtr_core::archive::open().map_err(tool_error)?;
        let skipped =
            sivtr_core::archive::sync::ensure_fresh_with_conn(&conn).map_err(tool_error)?;
        let report = sivtr_core::archive::stats::compute(&conn, &query).map_err(tool_error)?;
        ok_json(serde_json::json!({
            "stats": report,
            "warnings": sivtr_core::usage::warnings_from_sync(&skipped),
        }))
```

</details>

#### 缺口

- 未运行该MCP静态反例/补载修复；未验证所有输出mode、远端/变量并发与历史源重写情形。
  **影响**：裸whole-ref取全文可阻正常宿主展开证据；有效@last不能替代对该入口的修复或证明引用永远对应旧内容。
  **进一步探讨**：在固定匿名记录分别核裸whole/part/@last/命名变量/CLI全文，比较实际正文与原件和重同步前后；先修补载再决定采用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地记忆、语义请求、分享与token成本各信任到哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

默认已核Dsh检索链读源日志、写本地派生archive/WorkSet，不重执行历史；但“本地”不能覆盖可选网络功能。semantic/hybrid要求embedding配置，查询先embed，缺失或text_hash变化的记录也会embed；embedding_text按字段取历史内容，embed实际POST model/input到配置endpoint并可带Bearer Key。text_hash失效已实现，不能把重嵌入或一般向量缓存当新方向；未见此调用链使用share redactor，不能以分享默认脱敏保证发给embedding服务的文本同样脱敏。

分享开关默认传!no_redact，daemon处理RemoteRequest::Query先authorize再把share.root/redact带入run_on_share；后者Full加载并在redact=true时改投影的title/parts，返回records/anchors。privacy正则覆盖部分高信号凭据，注释明确best effort而非安全边界；路径/email等还可只是warning。它不证明所有PII/秘密被消除，也不证明本地原日志/归档擦除。本轮未审整套邀请/传输/所有ACL，不将依赖声明的加密当独立密码审计。

usage工具实际同步→load_usage_events→summarize：token来自各provider transcript提取，Money用整数微美元做算术，按内嵌价目/别名匹配估价，未知价格保unpriced。它不是账单、当前实时官方价格或所有provider均完整的证明；模型费用节省也无独立对照。stats聚合归档的活动/结果/隐私/usage，不是学习/工作质量评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/commands/memory/semantic.rs:21-81](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/semantic.rs#L21-L81)

语义模式/查询嵌入、正文text_hash及缺失批嵌入。

<details>
<summary>查看原文（61行）</summary>

```text
pub fn run(args: &SearchArgs) -> Result<WorkSet> {
    if args.semantic && args.hybrid {
        bail!("semantic and hybrid search are mutually exclusive");
    }
    let query = args
        .query
        .as_deref()
        .map(str::trim)
        .filter(|query| !query.is_empty())
        .context("semantic and hybrid search require a non-empty QUERY")?;

    let mut corpus_filter = filter::from_search_args(args)?;
    let result_limit = corpus_filter.limit.or(corpus_filter.latest).unwrap_or(5);
    let field = corpus_filter.in_field;
    corpus_filter.rank = None;
    corpus_filter.sort = Sort::Newest;
    corpus_filter.latest = None;
    corpus_filter.limit = None;

    let set = workset::query(&args.source, corpus_filter.clone(), args.cwd.as_deref())?;
    let cwd_string = set.cwd().to_string();
    let cwd = Path::new(&cwd_string);
    let (records, anchors) = set.into_parts();
    if anchors.iter().any(|anchor| !anchor.is_local()) {
        bail!("semantic and hybrid search require a local source");
    }

    let client = EmbeddingClient::from_config()?;
    let mut query_vectors = client.embed(&[query.to_string()])?;
    let query_vector = query_vectors
        .pop()
        .context("embedding service returned no query vector")?;
    let conn = sivtr_core::archive::open()?;
    embedding_store::ensure_index(&conn, &client.model, query_vector.len())?;
    let mut embeddings = embedding_store::load_embeddings(&conn)?;

    let mut missing = Vec::new();
    for record in &records {
        let reference = record.work_ref.whole().to_string();
        let text = embedding_text(record, field);
        if text.trim().is_empty() {
            continue;
        }
        let hash = embedding_store::text_hash(&text);
        if embeddings
            .get(&reference)
            .is_some_and(|(stored_hash, _)| stored_hash == &hash)
        {
            continue;
        }
        missing.push((reference, hash, text));
    }

    if !missing.is_empty() {
        let texts: Vec<String> = missing.iter().map(|(_, _, text)| text.clone()).collect();
        let vectors = client.embed(&texts)?;
        if vectors.len() != missing.len() {
            bail!(
                "embedding service returned {} vectors for {} records",
                vectors.len(),
                missing.len()
```

</details>

**依据 2 · 源码核查**：[src/commands/memory/semantic.rs:170-184](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/semantic.rs#L170-L184)

embedding实际选择标题/正文等字段。

<details>
<summary>查看原文（15行）</summary>

```text
fn embedding_text(record: &WorkRecord, field: Field) -> String {
    match field {
        Field::Content => record.combined_text(),
        Field::Title => record.title.clone(),
        Field::Session => record.session.id.clone(),
        Field::Input | Field::Command => record.input_text().unwrap_or_default(),
        Field::Output => record.output_text().unwrap_or_default(),
        Field::All => format!(
            "{}\n{}\n{}\n{}",
            record.title,
            record.session.id,
            record.input_text().unwrap_or_default(),
            record.output_text().unwrap_or_default()
        ),
    }
```

</details>

**依据 3 · 源码核查**：[src/commands/memory/semantic.rs:288-312](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/semantic.rs#L288-L312)

真实HTTP embedding请求带input及可选Key。

<details>
<summary>查看原文（25行）</summary>

```text
    fn embed(&self, inputs: &[String]) -> Result<Vec<Vec<f32>>> {
        let mut all = Vec::with_capacity(inputs.len());
        for chunk in inputs.chunks(self.batch_size) {
            let body = serde_json::to_vec(&serde_json::json!({
                "model": self.model,
                "input": chunk,
            }))?;
            let mut request = self
                .agent
                .post(&self.endpoint)
                .header("Content-Type", "application/json");
            if let Some(api_key) = &self.api_key {
                request = request.header("Authorization", &format!("Bearer {api_key}"));
            }
            let mut response = request
                .send(body)
                .with_context(|| format!("embedding request failed: {}", self.endpoint))?;
            if !response.status().is_success() {
                bail!("embedding service returned HTTP {}", response.status());
            }
            let text = response
                .body_mut()
                .with_config()
                .limit(EMBEDDING_RESPONSE_LIMIT)
                .read_to_string()
```

</details>

**依据 4 · 源码核查**：[src/commands/remote/share.rs:15-24](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/remote/share.rs#L15-L24)

分享redact默认true，可显式关闭。

<details>
<summary>查看原文（10行）</summary>

```text
pub fn execute(command: ShareCommand) -> Result<()> {
    match command.action {
        None => interactive_share(command.path, command.name, !command.no_redact),
        Some(ShareAction::Add {
            path,
            name,
            no_redact,
        }) => {
            serve::ensure_running()?;
            add(path, name, !no_redact).map(|_| ())
```

</details>

**依据 5 · 源码核查**：[src/remote/daemon.rs:469-485](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/remote/daemon.rs#L469-L485)

真实网络Query caller authorize→run_on_share。

<details>
<summary>查看原文（17行）</summary>

```text
        RemoteRequest::Query {
            share_id,
            source,
            filter,
        } => {
            let share = context.store.authorize(peer_id, &share_id, "query")?;
            let response = tokio::task::spawn_blocking(move || {
                let (records, anchors) = crate::commands::memory::workset::run_on_share(
                    std::path::Path::new(&share.root),
                    &source,
                    filter,
                    share.redact,
                )?;
                Ok::<_, anyhow::Error>(QueryResponse { records, anchors })
            })
            .await??;
            Ok(RemoteResponse::Query(response))
```

</details>

**依据 6 · 源码核查**：[src/commands/memory/workset/source.rs:390-404](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/source.rs#L390-L404)

共享实际Full读取并按flag脱敏返回。

<details>
<summary>查看原文（15行）</summary>

```text
pub fn run_on_share(
    root: &Path,
    source: &str,
    filter: Filter,
    redact: bool,
) -> Result<(Vec<WorkRecord>, Vec<WorkRef>)> {
    match run_local(source, root, filter.for_remote_peer(), LoadMode::Full) {
        Ok(mut set) => {
            if redact {
                for record in set.records_mut() {
                    *record = crate::remote::redact::redact_record(record)
                        .context("redact shared record")?;
                }
            }
            Ok(set.into_parts())
```

</details>

**依据 7 · 源码核查**：[src/remote/redact.rs:10-27](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/remote/redact.rs#L10-L27)

修改clone的title/parts投影。

<details>
<summary>查看原文（18行）</summary>

```text
pub fn redact_record(record: &WorkRecord) -> Result<WorkRecord> {
    let mut out = record.clone();
    out.title = privacy::redact_text(&out.title)?;
    out.parts = out
        .parts
        .into_iter()
        .map(redact_part)
        .collect::<Result<Vec<_>>>()?;
    Ok(out)
}

pub fn redact_part(mut part: WorkPart) -> Result<WorkPart> {
    match &mut part.body {
        WorkPartBody::Message { label, content, .. } => {
            if let Some(label) = label {
                *label = privacy::redact_text(label)?;
            }
            redact_content(content)?;
```

</details>

**依据 8 · 源码核查**：[crates/sivtr-core/src/privacy.rs:1-5](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/privacy.rs#L1-L5)

原件明确best effort/非安全边界。

```text
//! Shared, best-effort privacy helpers.
//!
//! This module deliberately only removes high-signal credential formats.  It
//! is a reduction in accidental disclosure, not a security boundary: callers
//! must still ask the user to review the resulting snapshot before publishing.
```

**依据 9 · 源码核查**：[crates/sivtr-core/src/privacy.rs:14-48](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/privacy.rs#L14-L48)

实际凭据正则范围。

<details>
<summary>查看原文（35行）</summary>

```text
static PATTERNS: LazyLock<Result<Vec<(&'static str, Regex)>, regex::Error>> = LazyLock::new(|| {
    Ok(vec![
        (
            "github_pat",
            Regex::new(r"(?:gh[pousr]_[A-Za-z0-9]{16,}|github_pat_[A-Za-z0-9_]{20,})")?,
        ),
        ("openai_key", Regex::new(r"sk-[A-Za-z0-9_-]{16,}")?),
        ("sivtr_token", Regex::new(r"s-[A-Za-z0-9]{16,}")?),
        ("slack_token", Regex::new(r"xox[abprs]-[A-Za-z0-9-]{10,}")?),
        ("aws_id", Regex::new(r"AKIA[0-9A-Z]{16}")?),
        (
            "aws_secret",
            Regex::new(r#"(?i)aws_secret_access_key['"\s:=]+[A-Za-z0-9/+=]{40}"#)?,
        ),
        (
            "assigned_secret",
            Regex::new(
                r#"(?i)(api[_-]?key|token|password|secret|bearer)\s*[:=]\s*['"]?[A-Za-z0-9_\-./+=]{12,}['"]?"#,
            )?,
        ),
        (
            "jwt",
            Regex::new(r"\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b")?,
        ),
        (
            "cookie",
            Regex::new(r"(?i)(?:cookie|set-cookie)\s*[:=]\s*[^\r\n]{12,}")?,
        ),
        ("bearer", Regex::new(r"(?i)bearer\s+[A-Za-z0-9_\-.=]{16,}")?),
        (
            "pem_key",
            Regex::new(
                r"-----BEGIN [A-Z ]+PRIVATE KEY-----[\s\S]*?-----END [A-Z ]+PRIVATE KEY-----",
            )?,
        ),
```

</details>

**依据 10 · 源码核查**：[crates/sivtr-core/src/privacy.rs:52-70](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/privacy.rs#L52-L70)

路径/email等warning与凭据redaction区分。

<details>
<summary>查看原文（19行）</summary>

```text
static WARNING_PATTERNS: LazyLock<Result<Vec<(&'static str, Regex)>, regex::Error>> = LazyLock::new(
    || {
        Ok(vec![
            (
                "absolute_path",
                Regex::new(
                    r#"(?i)(?:[A-Z]:[\\/]|/(?:Users|home|root|tmp|var|etc|opt|srv|usr|mnt|media|data|workspace)/|\\\\)[^\s`]+"#,
                )?,
            ),
            (
                "email",
                Regex::new(r"(?i)\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b")?,
            ),
            (
                "internal_url",
                Regex::new(
                    r"(?i)https?://(?:localhost|127\.0\.0\.1|10\.(?:[0-9]{1,3}\.){2}[0-9]{1,3}|192\.168\.(?:[0-9]{1,3}\.)[0-9]{1,3}|[A-Za-z0-9-]+\.local)(?::\d+)?(?:/[^\s]*)?",
                )?,
            ),
```

</details>

**依据 11 · 源码核查**：[src/mcp/server.rs:109-129](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L109-L129)

usage入口真实同步/汇总/warnings。

<details>
<summary>查看原文（21行）</summary>

```text
        description = "Read token usage and exact model costs from the unified archive. Supports optional provider, session_id, and inclusive UTC day bounds; unknown model prices are reported as unpriced instead of guessed."
    )]
    fn sivtr_usage(
        &self,
        Parameters(params): Parameters<UsageParams>,
    ) -> Result<CallToolResult, McpError> {
        let query = sivtr_core::usage::UsageQuery {
            provider: params.provider,
            session_id: params.session_id,
            since: params.since,
            until: params.until,
        };
        query.validate().map_err(invalid_params)?;
        let conn = sivtr_core::archive::open().map_err(tool_error)?;
        let skipped =
            sivtr_core::archive::sync::ensure_fresh_with_conn(&conn).map_err(tool_error)?;
        let summary = sivtr_core::usage::summarize(&conn, &query).map_err(tool_error)?;
        ok_json(sivtr_core::usage::UsageResult {
            summary,
            warnings: sivtr_core::usage::warnings_from_sync(&skipped),
        })
```

</details>

**依据 12 · 源码核查**：[crates/sivtr-core/src/usage/mod.rs:1-25](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/usage/mod.rs#L1-L25)

transcript token/读时价目和整数微美元。

<details>
<summary>查看原文（25行）</summary>

```text
//! Token usage and cost tracking over the unified archive.
//!
//! Providers whose transcripts carry per-message usage (Claude, Codex)
//! are walked at sync time and folded into the archive's `usage_events`
//! table (raw token counts only — costs are computed at read time from
//! the embedded pricing snapshot, so a pricing refresh re-prices history
//! without touching stored events).

pub mod extract;
pub mod pricing;

use std::collections::BTreeMap;

use anyhow::Result;
use rusqlite::Connection;
use serde::ser::SerializeStruct;
use serde::{Deserialize, Serialize};

/// Integer cost in microdollars (µ$): 1_000_000 µ$ = $1. All arithmetic is
/// exact integer math on µ$/token rates, so totals never accumulate float
/// error.
#[derive(Debug, Clone, Copy, PartialEq, Eq, PartialOrd, Ord, Serialize, Deserialize, Default)]
pub struct Money {
    pub microdollars: i64,
}
```

</details>

**依据 13 · 源码核查**：[crates/sivtr-core/src/usage/mod.rs:183-206](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/usage/mod.rs#L183-L206)

未知价格独立累计，不猜零费用。

<details>
<summary>查看原文（24行）</summary>

```text
impl UsageTotals {
    pub fn add_event(&mut self, event: &UsageEvent, cost: Option<Money>) {
        self.input_tokens = self.input_tokens.saturating_add(event.input_tokens);
        self.output_tokens = self.output_tokens.saturating_add(event.output_tokens);
        self.cache_read_tokens = self
            .cache_read_tokens
            .saturating_add(event.cache_read_tokens);
        self.cache_creation_tokens = self
            .cache_creation_tokens
            .saturating_add(event.cache_creation_tokens);
        self.requests = self.requests.saturating_add(1);
        match cost {
            Some(cost) => {
                self.priced_requests = self.priced_requests.saturating_add(1);
                self.cost.add(cost);
            }
            None => {
                self.unpriced_requests = self.unpriced_requests.saturating_add(1);
                self.unpriced_input_tokens = self
                    .unpriced_input_tokens
                    .saturating_add(event.input_tokens);
                self.unpriced_output_tokens = self
                    .unpriced_output_tokens
                    .saturating_add(event.output_tokens);
```

</details>

**依据 14 · 源码核查**：[crates/sivtr-core/src/usage/mod.rs:273-301](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/usage/mod.rs#L273-L301)

真实加载events并按模型价目算术。

<details>
<summary>查看原文（29行）</summary>

```text
pub fn summarize(conn: &Connection, query: &UsageQuery) -> Result<UsageSummary> {
    let events = crate::archive::store::load_usage_events(
        conn,
        query.provider.as_deref(),
        query.session_id.as_deref(),
        query.since.as_deref(),
        query.until.as_deref(),
    )?;
    Ok(summarize_events(&events))
}

fn summarize_events(events: &[crate::archive::store::StoredUsageEvent]) -> UsageSummary {
    let mut totals = UsageTotals::default();
    let mut groups: BTreeMap<(String, String, String), UsageGroup> = BTreeMap::new();

    for stored in events {
        let event = UsageEvent {
            model: stored.model.clone(),
            input_tokens: stored.input_tokens,
            output_tokens: stored.output_tokens,
            cache_read_tokens: stored.cache_read_tokens,
            cache_creation_tokens: stored.cache_creation_tokens,
            occurred_at: stored.occurred_at.clone(),
            dedup_key: stored.dedup_key.clone(),
        };
        let cost = pricing::catalog()
            .lookup(&event.model)
            .and_then(|pricing| pricing::cost(&event, pricing.rate()));
        totals.add_event(&event, cost);
```

</details>

**依据 15 · 源码核查**：[crates/sivtr-core/src/usage/pricing.rs:47-57](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/usage/pricing.rs#L47-L57)

内嵌pricing snapshot。

<details>
<summary>查看原文（11行）</summary>

```text
pub fn catalog() -> &'static Catalog {
    static CATALOG: OnceLock<Catalog> = OnceLock::new();
    CATALOG.get_or_init(|| {
        let bytes = EmbeddedSnapshot::get("pricing_snapshot.json.gz")
            .expect("pricing snapshot is embedded at build time");
        let cursor = std::io::Cursor::new(bytes.data.as_ref());
        let decoder = flate2::read::GzDecoder::new(cursor);
        let snapshot: Snapshot =
            serde_json::from_reader(decoder).expect("embedded pricing snapshot must deserialize");
        Catalog {
            models: snapshot
```

</details>

**依据 16 · 源码核查**：[crates/sivtr-core/src/usage/pricing.rs:111-140](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/usage/pricing.rs#L111-L140)

模型/别名匹配边界。

<details>
<summary>查看原文（30行）</summary>

```text
    pub fn lookup(&self, model: &str) -> Option<ModelPricing> {
        let name = model.trim().to_ascii_lowercase();
        if name.is_empty() {
            return None;
        }
        if let Some(found) = self.models.get(&name) {
            return Some(*found);
        }
        if let Some(pricing) = self.unique_segment_match(&name) {
            return Some(pricing);
        }
        let stripped = strip_date_suffix(&name);
        if stripped != name {
            if let Some(found) = self.models.get(&stripped) {
                return Some(*found);
            }
            if let Some(pricing) = self.unique_segment_match(&stripped) {
                return Some(pricing);
            }
        }
        None
    }

    fn unique_segment_match(&self, model: &str) -> Option<ModelPricing> {
        let mut matches = self
            .models
            .iter()
            .filter(|(key, _)| key.rsplit('/').next() == Some(model))
            .map(|(_, pricing)| *pricing);
        let first = matches.next()?;
```

</details>

**依据 17 · 源码核查**：[crates/sivtr-core/src/archive/stats.rs:140-158](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/stats.rs#L140-L158)

stats消费usage及归档聚合。

<details>
<summary>查看原文（19行）</summary>

```text
        provider: query.provider.clone(),
        session_id: None,
        since: query.since.clone(),
        until: query.until.clone(),
    };
    Ok(StatsSummary {
        sessions,
        records,
        starred_sessions,
        active_days,
        total_duration_ms,
        providers,
        projects,
        days,
        hourly_records,
        outcomes,
        secret_findings,
        usage: crate::usage::summarize(conn, &usage_query)?,
    })
```

</details>

#### 缺口

- 未调用embedding/分享，不知服务保留策略、真实账单偏差、脱敏漏检率及所有provider token提取完整性。
  **影响**：不能将可选语义模式承诺完全离线、默认脱敏当内容可公开，或价目算术当可兑现净节省。
  **进一步探讨**：先只用允许的本地日志；单独授权端点与分享内容，检查实际出站文本/投影，用脱敏合成秘密和账单小样量误差。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用步骤和全生命周期成本如何分开？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先满足可运行二进制/若自编译Rust1.95及可读本地会话、可写数据目录，再用CLI核源和检索。MCP要宿主配置并验证工具结果；不需要为了读已有Dsh日志先装所有shell hooks、开分享或embedding。setup/MCP install是额外配置动作，本轮不执行；已有捕获/编辑器/TUI/VSCode全模式也不当本轮兼容验收。

显式sivtr run会真的执行给定程序：调用Command::new(program).args(...).output收集stdout/stderr，再按stdout后stderr拼接，不因注释称real-time就当已核实时穿透/原始交错顺序。执行结果非空才写terminal capture，随后按编辑器配置打开；命令自身权限/副作用仍由用户负责，不是仅查看旧记录。

完整依赖、步骤和首次/持续/失败/退出成本表在综合相应段落；成本现金/机器资源与人工分列。未使用量/平台样本就不编造分钟数、磁盘膨胀和embedding单价。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:1-18](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/Cargo.toml#L1-L18)

编译工具链声明。

<details>
<summary>查看原文（18行）</summary>

```text
[workspace]
members = ["crates/sivtr-core", "."]
resolver = "2"

[workspace.package]
version = "0.8.2"
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
```

</details>

**依据 2 · 源码核查**：[crates/sivtr-core/src/archive/schema.rs:13-28](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/archive/schema.rs#L13-L28)

真实archive目录及写创建条件。

<details>
<summary>查看原文（16行）</summary>

```text
/// Path of the archive database (`<home>/cache/archive.db`).
pub fn db_path() -> PathBuf {
    crate::workspace::home_dir()
        .join("cache")
        .join("archive.db")
}

/// Open (creating if needed) the archive database with WAL, foreign keys,
/// and a busy timeout — multiple sivtr processes (CLI, MCP server, daemon)
/// share one archive file.
pub fn open() -> Result<Connection> {
    let path = db_path();
    if let Some(parent) = path.parent() {
        std::fs::create_dir_all(parent)
            .with_context(|| format!("Failed to create archive directory {}", parent.display()))?;
    }
```

</details>

**依据 3 · 源码核查**：[src/commands/memory/search.rs:15-27](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/search.rs#L15-L27)

实际查询后保存副作用。

<details>
<summary>查看原文（13行）</summary>

```text
/// Unified query for search: local and remote both run load+filter at the data owner.
pub fn run(args: &SearchArgs) -> Result<WorkSet> {
    let mut set = if args.semantic || args.hybrid {
        super::semantic::run(args)?
    } else {
        workset::query(
            &args.source,
            filter::from_search_args(args)?,
            args.cwd.as_deref(),
        )?
    };
    workset::persist(&mut set, args.save.as_deref()).context("persist search WorkSet")?;
    Ok(set)
```

</details>

**依据 4 · 源码核查**：[src/commands/memory/workset/mod.rs:40-61](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/mod.rs#L40-L61)

变量实际物化/文件保存。

<details>
<summary>查看原文（22行）</summary>

```text
pub(crate) fn save_as(set: &mut WorkSet, name: &str) -> Result<()> {
    store::validate_name(name)?;
    set.materialize_parts()?;
    set.validate()?;
    set.name = Some(name.to_string());
    save_named(name, set).with_context(|| format!("save WorkSet @{name}"))
}

/// Persist the `@last` WorkSet.
pub(crate) fn save_last(set: &WorkSet) -> Result<()> {
    let mut set = set.clone();
    set.materialize_parts()?;
    set.validate()?;
    save_named("last", &set).context("save @last WorkSet")
}

pub(crate) fn persist(set: &mut WorkSet, name: Option<&str>) -> Result<()> {
    save_last(set)?;
    if let Some(name) = name {
        save_as(set, name)?;
    }
    Ok(())
```

</details>

**依据 5 · 源码核查**：[src/commands/system/mcp.rs:213-226](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/system/mcp.rs#L213-L226)

stdio宿主入口与install分支分开。

<details>
<summary>查看原文（14行）</summary>

```text
pub fn execute(command: McpCommand) -> Result<()> {
    match command.action {
        McpAction::Serve(args) => {
            // CLI `--idle-exit` wins over `[mcp] idle_exit_secs`. 0 = never.
            let idle_secs = resolve_idle_exit_secs(
                args.idle_exit,
                Some(SivtrConfig::load()?.mcp.idle_exit_secs),
            );
            let runtime = tokio::runtime::Builder::new_multi_thread()
                .enable_all()
                .build()?;
            runtime.block_on(mcp::serve_stdio(idle_secs.map(Duration::from_secs)))
        }
        McpAction::Install(args) => install(&args),
```

</details>

**依据 6 · 源码核查**：[src/commands/terminal/run.rs:8-35](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/terminal/run.rs#L8-L35)

显式run执行/空输出不入库/写capture及编辑器。

<details>
<summary>查看原文（28行）</summary>

```text
pub fn execute(command: &str, args: &[String]) -> Result<()> {
    let command_line = render_command_line(command, args);
    eprintln!("sivtr: running `{command_line}`");

    let result = subprocess::run_and_capture(command, args)?;

    match result.exit_code {
        Some(0) => eprintln!("sivtr: command exited successfully"),
        Some(code) => eprintln!("sivtr: command exited with code {code}"),
        None => eprintln!("sivtr: command was terminated by signal"),
    }

    if result.combined.is_empty() {
        eprintln!("sivtr: no output captured");
        return Ok(());
    }

    let config = SivtrConfig::load()?;
    sivtr_core::archive::store::insert_terminal_capture(
        Some(command_line.as_str()),
        &result.combined,
        &std::env::current_dir()?,
        result.exit_code,
    )?;

    let ed = editor::resolve_editor_with_config(&config)?;
    eprintln!("sivtr: opening in {ed}");
    editor::open_in_editor(&result.combined)?;
```

</details>

**依据 7 · 源码核查**：[crates/sivtr-core/src/capture/subprocess.rs:8-29](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/crates/sivtr-core/src/capture/subprocess.rs#L8-L29)

真实output采集和stdout后stderr合并，不采信实时注释。

<details>
<summary>查看原文（22行）</summary>

```text
pub fn run_and_capture(program: &str, args: &[String]) -> Result<CaptureResult> {
    let output = Command::new(program)
        .args(args)
        .stdout(Stdio::piped())
        .stderr(Stdio::piped())
        .output()?;

    let stdout = String::from_utf8_lossy(&output.stdout).into_owned();
    let stderr = String::from_utf8_lossy(&output.stderr).into_owned();

    // Combine stdout and stderr
    let mut combined = stdout;
    if !stderr.is_empty() {
        if !combined.is_empty() && !combined.ends_with('\n') {
            combined.push('\n');
        }
        combined.push_str(&stderr);
    }

    Ok(CaptureResult {
        combined,
        exit_code: output.status.code(),
```

</details>

#### 缺口

- 未安装发行物、核设备性能/首轮归档时间、所有hooks与编辑器撤装、数据保留/恢复演练。
  **影响**：首次引入/持续扫描和失败恢复投入不明，退出后原始源、派生archive和WorkSet需分别保留，不能承诺一键零残留。
  **进一步探讨**：限匿名少量已有日志、隔离数据目录/允许宿主配置，记录CPU/磁盘/人工纠错；备份配置/原始材料后再考虑可选捕获功能。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应先采用什么，未来插件方向如何证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前宜观察并先修MCP裸whole-ref全文补载，允许具备本地材料/人工核原文条件者只检验已物化@last或CLI路径，不把此替代宣称整个MCP交付已可靠。相对直接grep源文件，统一记录/过滤/引用/现有完整WorkSet可降低组织动作，但尚无真实任务误引、完成率、总投入对照；相对宿主自带history/搜索也未证独立工具净增量。

已有机制包括BM25、可选语义/RRF、text_hash、保存完整WorkSet、分享脱敏、usage价目以及server明确要求验证当前文件/测试。这些均不再包装成新插件方向。可证伪增量是窄范围“历史命中对当前任务仍适用”的验证交接：在现有WorkSet上保留原文，给出当前仓库/分支/文件与实际测试的可核关联和未核状态，由宿主或人决定是否纳入上下文；不让旧成功/类似报错直接覆盖现状。它还未实现，也不许把一次文件hash相同当业务条件完全相同。

最小对照用同组匿名维护任务比直接历史搜索、修复后的原工具、加上述验证交接三组；包含改文件/换依赖/旧成功但当前失败/相似不同原因/正常历史可复用和秘密文本。量错误旧证据采纳、遗漏、任务独立测试通过、返工/人工与token/现金/磁盘总投入；若现有@name+人工当前测试已等效，或验证成本抵消收益，就否定独立生产插件方向。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp/server.rs:157-168](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L157-L168)

已存在先检索再核当前文件/测试指令，不算未来新增。

<details>
<summary>查看原文（12行）</summary>

```text
impl ServerHandler for SivtrMcp {
    fn get_info(&self) -> InitializeResult {
        let mut info = InitializeResult::default();
        info.instructions = Some(
            "sivtr is local workspace memory for terminal output and AI sessions. \
Search narrowly, expand with show/zoom, and treat results as evidence—verify current files and tests before claiming present state. \
Search defaults to latest=5 when neither latest nor limit is set (same as CLI). \
Use origin-prefixed sources like desk:terminal only after mounts exist (see sivtr_status)."
                .into(),
        );
        info.capabilities = ServerCapabilities::builder().enable_tools().build();
        info
```

</details>

**依据 2 · 源码核查**：[src/commands/memory/workset/mod.rs:40-61](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/workset/mod.rs#L40-L61)

已有物化完整变量，未来不重复快照。

<details>
<summary>查看原文（22行）</summary>

```text
pub(crate) fn save_as(set: &mut WorkSet, name: &str) -> Result<()> {
    store::validate_name(name)?;
    set.materialize_parts()?;
    set.validate()?;
    set.name = Some(name.to_string());
    save_named(name, set).with_context(|| format!("save WorkSet @{name}"))
}

/// Persist the `@last` WorkSet.
pub(crate) fn save_last(set: &WorkSet) -> Result<()> {
    let mut set = set.clone();
    set.materialize_parts()?;
    set.validate()?;
    save_named("last", &set).context("save @last WorkSet")
}

pub(crate) fn persist(set: &mut WorkSet, name: Option<&str>) -> Result<()> {
    save_last(set)?;
    if let Some(name) = name {
        save_as(set, name)?;
    }
    Ok(())
```

</details>

**依据 3 · 源码核查**：[src/commands/memory/semantic.rs:48-81](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/commands/memory/semantic.rs#L48-L81)

已有hash失效/批嵌入。

<details>
<summary>查看原文（34行）</summary>

```text
    let client = EmbeddingClient::from_config()?;
    let mut query_vectors = client.embed(&[query.to_string()])?;
    let query_vector = query_vectors
        .pop()
        .context("embedding service returned no query vector")?;
    let conn = sivtr_core::archive::open()?;
    embedding_store::ensure_index(&conn, &client.model, query_vector.len())?;
    let mut embeddings = embedding_store::load_embeddings(&conn)?;

    let mut missing = Vec::new();
    for record in &records {
        let reference = record.work_ref.whole().to_string();
        let text = embedding_text(record, field);
        if text.trim().is_empty() {
            continue;
        }
        let hash = embedding_store::text_hash(&text);
        if embeddings
            .get(&reference)
            .is_some_and(|(stored_hash, _)| stored_hash == &hash)
        {
            continue;
        }
        missing.push((reference, hash, text));
    }

    if !missing.is_empty() {
        let texts: Vec<String> = missing.iter().map(|(_, _, text)| text.clone()).collect();
        let vectors = client.embed(&texts)?;
        if vectors.len() != missing.len() {
            bail!(
                "embedding service returned {} vectors for {} records",
                vectors.len(),
                missing.len()
```

</details>

**依据 4 · 源码核查**：[src/mcp/server.rs:54-64](https://github.com/Ariestar/sivtr/blob/15ca543a042231a3301cc2ae37b2d60b187190c1/src/mcp/server.rs#L54-L64)

采用前需修的MCP真实show入口。

<details>
<summary>查看原文（11行）</summary>

```text
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

- 缺真实维护者任务、宿主原生替代对照和验证交接原型/独立结果。
  **影响**：不能把记忆管理便利直接当提高代码正确率、净省token或可销售需求；尚不能据此投入完整新平台。
  **进一步探讨**：先修已知入口并在小样核全文一致，再做三组任务对照；设误引/返工不得变差与总投入下降门槛，失败即用现有搜索+人工核验。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
