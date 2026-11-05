# Cordis Rust

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[cd54003](https://github.com/dshbox/cordis-rs/tree/cd540033487f62c1b574bffd39befb717afb8a35)

<!-- BEGIN META -->
[![GitHub ★ 68](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=68&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshbox/cordis-rs)
<!-- END META -->

> **功能**：为长期运行的 Rust 应用提供插件生命周期、服务依赖、类型化事件及资源清理框架。

> **亮点**：相对手工异步装配，它把配置准备、生命周期准入、精确服务放置及资源清理绑定到有类型的运行时契约，并明确交付与终态屏障。概念继承Cordis体系，已有增量是Rust环境中的语义组织，不是新的Agent能力或已验证性能优势，见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：显式清理不等于自动关闭应用。丢弃Handle不会dispose，创建future仍存活但不poll会停住，真正drop才交接未交付创建的清理；已登记cleanup失败也不证明外部资源关闭。realm与Scope更不是恶意插件或租户安全边界，见 [Q03](#research-q03)。

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
  - [Q01 · 哪种长期运行程序需要这个库，相对手写 Tokio 状态机及 TypeScript Cordis 增加什么？](#detail-section-11)
  - [Q02 · prepare 到 spawn、服务依赖与事件路由如何实际实现？](#detail-section-12)
  - [Q03 · generation 清理和隔离究竟保证什么，何时仍需应用兜底？](#detail-section-13)
  - [Q04 · 从集成到迁移、运行和关闭的成本与试用条件是什么？](#detail-section-14)
  - [Q05 · 能否用故障轨迹验证生命周期交接证书假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向需要动态插件、依赖变化与确定性清理的 Rust 应用开发者，提供运行时基础设施；它不是现有 DSH 可直接加载的插件。

参照是手写Tokio任务、共享状态和回调，以及作者记录的TS Cordis概念来源。本轮核查Rust实现的组合契约，不主张TS完全等价、全球原创或DSH互操作，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Rust插件准入与句柄 | typed准备后创建并管理长期组件 | 需应用编译集成；不是DSH插件入口，Pending不代表可用 |
| 精确服务realm | 按服务名选择实例放置与查找 | 无缺失回退，不是权限白名单或恶意代码隔离 |
| 类型化事件 | 显式Routing下派发组件通信 | Scope与服务realm独立，Unscoped不做Scope筛选 |
| generation资源清理 | 一次性领取已登记cleanup并显式dispose | 仅已登记义务，应用持有Handle且处理外部副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Rust >=1.88及2024 Edition | 集成必需，Cargo声明 | 类型化框架编译 | 本轮未编译，不能把声明当兼容通过 |
| Tokio及core基础依赖 | 运行必需 | 异步执行、同步和错误处理 | 阻塞poll仍会拖延生命周期与cleanup |
| cordis-rs0.11.1与core0.6.1 | facade使用需配套 | 保留cordis导入名并重导出core | 跨0.5/0.6类型不能混用 |
| timer、loader | 对应功能可选 | 时间操作或声明式加载 | core不自带这些叶子能力；本轮未核查全部实现 |
| 应用持有句柄和业务补偿策略 | 正确关闭必需 | dispose与外部副作用恢复 | Drop不自动关Fiber，无全Runtime shutdown |

开发诊断工具链固定为1.98.1，与最低支持版本含义不同；依赖和版本边界见 [Q04](#research-q04)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 应用开发者定义Config/Input/Plugin及Service/Event | prepare在准入前完成，错误不假作已启动 |
| 接纳 | 应用封装PreparedPlugin并await spawn | 明确返回Active或Pending，保存已交付Handle |
| 运行 | 应用显式选择服务realm和事件Routing | 按实际依赖和资源探针确认工作，不把Pending当可用 |
| 关闭与恢复 | 应用对roster安排dispose并逐项尝试 | 等终态屏障且读清理诊断，业务状态另行恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次集成 | 编译、依赖及运行资源，金额未知 | 学习typed契约、改写组件、资源登记和句柄管理 | 无集成人时实测 |
| 持续运行 | 运行时内存、任务与依赖变化开销未知 | 版本配套和诊断处理 | 不能以Rust类型约束推断更快或更省资源 |
| 失败恢复 | 重试与外部补偿资源未知 | 区分Pending、apply失败、cleanup失败和进度停滞 | 框架清理不回滚数据库或远端业务写入 |
| 升级与退出 | 重编译及应用资源，金额未知 | 非穷尽枚举/版本迁移，关闭roster及退回原路径 | 当前为预冻结破坏性版本线，不能只换依赖号 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 准入与交付 | prepare分离、驻留提交和Active/Pending交付实现 | 所有并发交错和真实应用可靠性 |
| 服务放置 | 指定realm的精确查询及publication撤回 | 应用是否正确分配所有服务，非租户安全认证 |
| 清理所有权 | 一次性领取、LIFO和终态屏障 | 失败cleanup是否关闭外部资源、永不完成清理的时限 |
| 开发与运行收益 | 无同条件应用结果 | 节时、性能、维护成本及ROI |

> **思考**：显式清理不等于自动关闭应用。丢弃Handle不会dispose，创建future仍存活但不poll会停住，真正drop才交接未交付创建的清理；已登记cleanup失败也不证明外部资源关闭。realm与Scope更不是恶意插件或租户安全边界，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工异步装配，它把配置准备、生命周期准入、精确服务放置及资源清理绑定到有类型的运行时契约，并明确交付与终态屏障。概念继承Cordis体系，已有增量是Rust环境中的语义组织，不是新的Agent能力或已验证性能优势，见 [Q01](#research-q01)、[Q02](#research-q02)。

可借鉴的是准入提交点与CreationGuard、服务publication的精确身份撤回及generation一次性清理journal。这些机制将所有权放在显式位置，而不是依赖隐含Drop。代价是创建future进度条件、异步清理与应用关闭策略必须一起理解；观察记录只作诊断，不能当业务回放和授权系统，见 [Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

显式清理不等于自动关闭应用。丢弃Handle不会dispose，创建future仍存活但不poll会停住，真正drop才交接未交付创建的清理；已登记cleanup失败也不证明外部资源关闭。realm与Scope更不是恶意插件或租户安全边界，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离Rust应用里选一个确需动态依赖的组件，显式保存FiberHandle并安排关闭；检查缺依赖Pending、服务realm、apply失败和清理诊断。不要将realm当沙箱，也不要直接用于DSH安装。遇到错误回退、重复清理或关闭卡住就停止扩展，保留原有应用路径及最小复现；先确认配套版本和维护支持范围，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查Rust core代表准入、服务、事件与清理链，确定其基础设施类型；未执行编译、测试或真实应用。完整并发正确性、性能、TS等价及诊断轨迹假设均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、Cargo.toml、rust-toolchain.toml、SECURITY.md、crates/cordis/Cargo.toml、crates/cordis/src/lib.rs、crates/cordis-core/src/plugin.rs、crates/cordis-core/src/context.rs、crates/cordis-core/src/fiber/spawn.rs、crates/cordis-core/src/fiber/mod.rs、crates/cordis-core/src/service.rs、crates/cordis-core/src/events/dispatch.rs、crates/cordis-core/src/effect.rs、docs/application-teardown.md、docs/upstream-facts.md、examples/hello_plugin/src/main.rs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整统计仅覆盖本工程工具支持的Markdown和JS/TS，本库主要Rust源码不在统计口径，不能据空代码分组推断规模为零。研究抽读Rust core准入、服务、事件和清理及示例，未执行编译、测试或应用；未全面检查update/era/timer/loader或独立验证TS等价。
- 下一步：后续在授权Rust环境对缺依赖、apply失败、两种drop时点、保留future不poll和cleanup失败记录句柄/资源轨迹，比较手工Tokio与框架的合格关闭及诊断成本；本轮未执行。

**分析版本**

- **仓库**：[dshbox/cordis-rs](https://github.com/dshbox/cordis-rs)
- **版本号**：未声明（[固定提交 cd54003](https://github.com/dshbox/cordis-rs/tree/cd540033487f62c1b574bffd39befb717afb8a35)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

应用层可尝试关联创建、交付及终态unlink轨迹，并以实际资源探针核验退出。用不poll、不同阶段drop、cleanup失败和依赖撤回样本比较错误终态解释与定位耗时；任何把Pending当Active或错误证明资源已关闭的轨迹都削弱假设。该方向未验证，见 [Q05](#research-q05)。

后续在授权Rust环境对缺依赖、apply失败、两种drop时点、保留future不poll和cleanup失败记录句柄/资源轨迹，比较手工Tokio与框架的合格关闭及诊断成本；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 55 | 11622 | — | — | 118285 |
| .md | example | 1 | 41 | — | — | 292 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/dshbox/cordis-rs/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Rust插件运行时如何显式约束生命周期、服务放置和清理，哪些边界仍由应用承担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种长期运行程序需要这个库，相对手写 Tokio 状态机及 TypeScript Cordis 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是供 Rust 应用开发者集成的插件运行时基础设施，不是能装进 DSH 的原生插件。应用侧 cordis-rs facade 以 cordis 导入名重导出 cordis-core 的Context、Plugin、Service与Event等；仓库是Cargo workspace，未提供DSH的JavaScript入口或bundle接线。本轮的建议对象是构建长期运行、插件可启停、服务会变化的Rust程序的开发者，不是只想给现有DSH加功能的普通用户。

原有办法可以用Tokio任务、共享状态和手工清理回调自行组织。这个库把配置准备、生命周期准入、服务依赖、事件路由及一代资源清理统一为有类型的API，给应用一套可组合契约，减少每个插件自行约定状态和清理责任的空间。合格结果应是依赖未满足时不错误执行apply、同名服务放在指定realm、停止后已登记资源按约定收回；不是仅能编译示例。

作者文档明确记录TypeScript Cordis上游、固定版本和移植差异，概念模型有继承关系，不能将Context、事件和插件依赖本身声称为原创。本轮检查Rust实现相对手工异步装配的具体增量，未独立重放TS上游或证明完全兼容。对于短命令或插件固定不变的服务，这套动态生命周期可能增加不必要的状态与迁移负担。没有真实应用对照，不能推断更快或更省维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-14](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/README.md#L7-L14)

作者界定长期运行、动态插件和服务变化的目标。

```text
Cordis is a typed runtime for long-lived, plugin-oriented Rust applications.
It gives application components one model for lifecycle, service dependencies,
typed events, resource cleanup, and explicit isolation boundaries.

Cordis is useful when your program is more than a collection of short-lived
function calls: plugins can appear and disappear, services can become available
or unavailable, configuration can change, and runtime resources must still be
cleaned up deterministically.
```

**依据 2 · 源码核查**：[crates/cordis/Cargo.toml:1-24](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis/Cargo.toml#L1-L24)

Rust facade的包身份和core依赖。

<details>
<summary>查看原文（24行）</summary>

```text
[package]
name = "cordis-rs"
version = "0.11.1"
description = "Application-facing facade for the Cordis v3 runtime"
keywords = ["cordis", "plugin", "events", "lifecycle", "framework"]
categories = ["asynchronous", "rust-patterns"]
edition.workspace = true
rust-version.workspace = true
license.workspace = true
repository.workspace = true
readme = "../../README.md"

[lib]
name = "cordis"
path = "src/lib.rs"

[features]
default = []

[dependencies]
cordis-core.workspace = true

[dev-dependencies]
trybuild.workspace = true
```

</details>

**依据 3 · 源码核查**：[crates/cordis/src/lib.rs:1-12](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis/src/lib.rs#L1-L12)

应用入口直接重导出Rust core，不是DSH入口。

<details>
<summary>查看原文（12行）</summary>

```text
//! Application-facing entry point for the Cordis v3 runtime.
//!
//! `cordis-rs` preserves the historical `cordis` import name while the
//! canonical runtime contract lives in `cordis-core`. Framework and plugin
//! authors may depend on `cordis-core` directly; applications can depend on
//! this facade to keep `use cordis::...` imports.

pub use cordis_core::{
    BoxError, ConfigurableService, Context, Event, FiberHandle, FiberId, FiberState, InjectSpec,
    Level, Logger, Plugin, PreparedChange, PreparedPlugin, QueryOutcome, Routing, Scope, Service,
    ServiceRealm, UpdateOutcome, effect, event, lifecycle, logger, observation, plugin, service,
};
```

</details>

**依据 4 · 作者声明**：[docs/upstream-facts.md:1-30](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/docs/upstream-facts.md#L1-L30)

作者给出TS Cordis移植来源及历史版本；本轮不将作者核查当独立重放。

<details>
<summary>查看原文（30行）</summary>

```text
# cordis (TS) upstream fact base — core parity

> Reference index for every core-v2 parity assertion. Every factual claim
> cites the upstream source as `path:line` relative to the clone root
> `/tmp/opencode/cordis` at pinned rev
> **`8cc9e33fab69e2d0476d126baaf2acb24e6a6ab4`**
> (2026-08-13 21:48:18 +0800, "chore: update readme (#45)"; zero drift
> since v1's port — re-verified 2026-08-31).
> Verify: `cd /tmp/opencode/cordis && git rev-parse HEAD` (must print the
> hash above; `git status --porcelain` empty). Re-clone:
> `git clone https://github.com/cordiverse/cordis`.
> Scope: **core only** — facts about `/tmp/opencode/deepseek-harness` belong
> to the harness effort, not here. Format model: v1's
> `docs/harness/upstream-facts.md` (pinned-rev + `path:line`), content
> re-derived from source.

> **Current Cordis terminology:** this historical fact base predates ADR 0039. Where it says `Fork`, read that as the former Cordis spelling for the current `FiberHandle`; upstream itself still has no `Fork` symbol. Historical API names such as `Fork::update` are left unchanged as evidence.

How to use this file:

- Every entry carries a `Parity:` mark. Ticket 07 (upstream
  parity inventory) ratified these into the three-way ledger:
  **carried-verbatim / port-freedom / deliberately-omitted** (plus
  deliberately-diverged, tracked separately from plain omissions) —
  see ADR 0006. The marks below stand as ratified except where ADR 0006
  says otherwise (§1.3 emit is fail-fast, not v1's log sketch).
- v1's lesson (fifth-pass #9/#13, sixth-pass #13): an upstream-parity claim
  without a `path:line` against the pinned rev is worthless. Nothing in this
  file is cited from memory; every line range below was re-read at the pinned
  rev. Where v1's `DESIGN.zh-CN.md` disagrees with upstream, the discrepancy
```

</details>

**依据 5 · 源码核查**：[crates/cordis-core/src/plugin.rs:116-161](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/plugin.rs#L116-L161)

typed prepare与apply构成相对手工装配的契约增量。

<details>
<summary>查看原文（46行）</summary>

```text
    type Config;
    /// Semantically complete apply input retained by Cordis.
    type Input: Send + 'static;
    /// Synchronous source-preparation failure.
    type PrepareError: Error;
    /// Failure returned by one apply attempt.
    type ApplyError: Error;

    /// Return the diagnostic Plugin name.
    fn name(&self) -> Cow<'_, str> {
        Cow::Borrowed(std::any::type_name::<Self>())
    }

    /// Return this Plugin's required-Service declarations.
    fn inject(&self) -> InjectSpec {
        InjectSpec::none()
    }

    /// Synchronously validate and prepare source configuration.
    ///
    /// Runs before any lifecycle admission: an `Err` is the caller's own
    /// typed value and a panic is an ordinary unwind — nothing is
    /// normalized and no Runtime state exists yet.
    fn prepare(&self, config: Self::Config) -> Result<Self::Input, Self::PrepareError>;

    /// Apply one Plugin input to `ctx`.
    ///
    /// Keep each poll non-blocking. Move synchronous blocking sections to
    /// `tokio::task::spawn_blocking` and await its JoinHandle asynchronously.
    /// Do not assume affinity to the spawning runtime: apply may be polled on
    /// a Cordis-owned runtime, and `tokio::spawn`, `Handle::current()` and
    /// [`Context::run`](crate::Context::run) inside apply use whichever runtime
    /// polls it. A blocked poll can stall unrelated Fibers' lifecycle work and
    /// async cleanup.
    ///
    /// A returned error or a panic is normalized exactly once into the
    /// opaque [`PluginFailure`](crate::lifecycle::PluginFailure) (kind plus owned
    /// diagnostic text) at the framework boundary: for the initial apply
    /// it becomes [`SpawnError::InitialApply`](crate::lifecycle::SpawnError) with
    /// the attempted Fiber fully rolled back and unlinked; for later
    /// applies it parks the Fiber `Failed` with its generation rolled
    /// back.
    fn apply(
        &self,
        ctx: Context,
        input: &Self::Input,
```

</details>

#### 缺口

- 缺少实际Rust应用与手工Tokio实现的同条件维护成本和可靠性比较。
  **影响**：无法断言业务收益或该抽象对所有服务必要。
  **进一步探讨**：用一个会动态增减依赖的守护进程比较故障恢复步骤、资源残留及总维护投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · prepare 到 spawn、服务依赖与事件路由如何实际实现？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Plugin把Config与Input分开，prepare同步运行在生命周期准入前；PreparedPlugin封装实例、Input和InjectSpec后才交给Context::spawn。spawn_prepared_inner先检查发起上下文是否可注册，再按每个服务名解析其realm，建立依赖边，attach_fiber作为驻留提交点，装上CreationGuard；创建自己的子Scope并安装固定spawn状态，最后进行初次settle。Active或稳定Pending时重新核对存活再交付FiberHandle，失败则走已清理的错误分支。这里的Pending代表依赖缺失而未运行apply，不等于插件已可用。

服务发布和查询使用同一isolate_key(S::NAME)。provide将publication与当前generation的清理义务一起提交，撤回按精确occurrence身份进行；try_service只查询选定realm的可见值，不用InjectSpec作访问白名单，也没有缺失时自动回退到默认realm。with_isolated_service只改变指定服务名的放置，其他服务仍继承映射；批量映射先验证重复名称与Runtime成员身份，避免外部Runtime的realm被误用。

事件采用类型化Args/Output和显式Routing。emit调用emit_inner后发布DispatchCompleted观察记录，Scoped预检拒绝不属于同Runtime的Scope；文档规定Scoped触达目标及祖先与global监听，而Unscoped不做这项Scope筛选。因此事件作用域和服务realm是两条独立轴，选对一个不意味着另一个自动隔离。hello_plugin示例把声明事件、prepare、spawn、emit和显式teardown串通，但本轮只读它，没有运行。

#### 证据与依据

**依据 1 · 源码核查**：[crates/cordis-core/src/plugin.rs:116-161](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/plugin.rs#L116-L161)

准备与异步apply的类型和失败边界。

<details>
<summary>查看原文（46行）</summary>

```text
    type Config;
    /// Semantically complete apply input retained by Cordis.
    type Input: Send + 'static;
    /// Synchronous source-preparation failure.
    type PrepareError: Error;
    /// Failure returned by one apply attempt.
    type ApplyError: Error;

    /// Return the diagnostic Plugin name.
    fn name(&self) -> Cow<'_, str> {
        Cow::Borrowed(std::any::type_name::<Self>())
    }

    /// Return this Plugin's required-Service declarations.
    fn inject(&self) -> InjectSpec {
        InjectSpec::none()
    }

    /// Synchronously validate and prepare source configuration.
    ///
    /// Runs before any lifecycle admission: an `Err` is the caller's own
    /// typed value and a panic is an ordinary unwind — nothing is
    /// normalized and no Runtime state exists yet.
    fn prepare(&self, config: Self::Config) -> Result<Self::Input, Self::PrepareError>;

    /// Apply one Plugin input to `ctx`.
    ///
    /// Keep each poll non-blocking. Move synchronous blocking sections to
    /// `tokio::task::spawn_blocking` and await its JoinHandle asynchronously.
    /// Do not assume affinity to the spawning runtime: apply may be polled on
    /// a Cordis-owned runtime, and `tokio::spawn`, `Handle::current()` and
    /// [`Context::run`](crate::Context::run) inside apply use whichever runtime
    /// polls it. A blocked poll can stall unrelated Fibers' lifecycle work and
    /// async cleanup.
    ///
    /// A returned error or a panic is normalized exactly once into the
    /// opaque [`PluginFailure`](crate::lifecycle::PluginFailure) (kind plus owned
    /// diagnostic text) at the framework boundary: for the initial apply
    /// it becomes [`SpawnError::InitialApply`](crate::lifecycle::SpawnError) with
    /// the attempted Fiber fully rolled back and unlinked; for later
    /// applies it parks the Fiber `Failed` with its generation rolled
    /// back.
    fn apply(
        &self,
        ctx: Context,
        input: &Self::Input,
```

</details>

**依据 2 · 源码核查**：[crates/cordis-core/src/fiber/spawn.rs:252-329](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/spawn.rs#L252-L329)

准入、驻留提交、guard和依赖接线。

<details>
<summary>查看原文（78行）</summary>

```text
    ctx: &Context,
    prepared: PreparedPlugin,
    require_origin_open: bool,
) -> std::result::Result<FiberHandle, SpawnError> {
    // Ordinary consumer spawn is gated by the calling Context's current
    // generation. Era replay is different: the captured origin is provenance
    // plus view axes, never lifecycle ownership of the replacement.
    if require_origin_open {
        ctx.fiber()
            .assert_can_register()
            .map_err(|_| SpawnError::InactiveContext)?;
    }
    let PreparedPlugin {
        plugin,
        name,
        inject,
        contract,
    } = prepared;
    let plugin_key = PluginKey::Typed(contract);
    let root = &ctx.root;
    let dependency_edges = inject
        .entries()
        .map(|entry| {
            crate::fiber::DependencyEdge::new(entry.name.clone(), ctx.isolate_key(&entry.name))
        })
        .collect::<Vec<_>>();

    let fiber = Fiber::new_with_edges(name.clone(), dependency_edges);
    // the spawn transaction's window: from allocation until handoff (or a
    // teardown), only the initial pass may run the first apply
    fiber.creation_pending.store(true, Ordering::SeqCst);
    // attach under one registry critical section: linearizes against
    // typed group detach (see attach_fiber) — removal racing the spawn
    // either disposes this fiber or leaves it visible, never detached.
    // This is the commit point: from here the creation guard owns the
    // fiber's cleanup if the caller abandons the spawn.
    root.registry.attach_fiber(plugin_key, fiber.clone());
    let mut guard = CreationGuard::armed(fiber.clone());

    // resolve declared injects against this scope now — later audits and
    // SemanticTarget reconstruction must not depend on the spawning context
    // (spawn-time snapshot principle). The stored scope derives the
    // fiber's own scope node (ADR 0003 overturn row 5): every apply —
    // first, restart, dependency reload — derives its context from it, so a
    // fiber's registrations (including typed update-control registrations) stay on
    // its own subtree instead of sharing the spawning scope's pipeline
    // with sibling fibers.
    // Each configured inject row becomes one prepared Service layer on the
    // fiber Context. `resolve_config` composes it after inherited outer layers;
    // restarts retain the same immutable Context view.
    let mut scope = ctx.with_child_scope();
    for entry in inject.entries() {
        if let Some(configured) = &entry.configured {
            scope = scope.with_configured_intercept(entry.name.clone(), configured.clone());
        }
    }
    // capture spawn state for restart and dependency reloads; the era swap's
    // successor re-enters this path with `spawning_ctx` and `plugin_key`,
    // so every era derives its scope from the same captured spawn-origin Scope.
    // Installation is one-shot and nothing installed this fresh fiber
    // before, so a refusal is a framework bug, not a spawn outcome
    // (fail-fast, ADR 0003 §2.4).
    fiber
        .spawn_state
        .install(plugin, name, inject, scope, plugin_key, ctx.clone())
        .expect("a fresh fiber has no spawn state installed");
    // publish the declared edges to the dependency index — both
    // directions, atomically, at the single site where the resolved
    // keys exist (ADR 0016). This line IS the "edges installed =
    // visible to fan-out acceleration. Correctness does not depend on this
    // projection: an unavailable projection falls back to resident Fiber edges.
    root.deps.register(&fiber);
    root.observations
        .publish(crate::observation::RuntimeObservation::FiberResidency {
            change: crate::observation::ResidencyChange::Admitted,
            fiber: crate::observation::fiber_snapshot(root, &fiber),
        });

```

</details>

**依据 3 · 源码核查**：[crates/cordis-core/src/fiber/spawn.rs:346-376](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/spawn.rs#L346-L376)

交付前复核以及失败错误分支。

<details>
<summary>查看原文（31行）</summary>

```text
            #[cfg(test)]
            probe_handoff(HandoffPhase::BeforeRecheck, contract).await;
            fiber.slot.claim().await;
            let alive = fiber.is_alive();
            fiber.slot.abandon();
            if alive {
                fiber.creation_pending.store(false, Ordering::SeqCst);
                #[cfg(test)]
                probe_handoff(HandoffPhase::AfterRecheck, contract).await;
                guard.disarm();
                Ok(fiber_handle)
            } else {
                fiber.force_unlink();
                guard.disarm();
                Err(SpawnError::Interrupted)
            }
        }
        InitialOutcome::Failed(failure) => {
            // the pass already ran the complete teardown — drain, death
            // mark, edge unregister, unlink — so nothing rides the guard
            guard.disarm();
            Err(SpawnError::InitialApply(failure))
        }
        InitialOutcome::Interrupted => {
            // framework invalidation fully disposed the fiber; the pass
            // made the unlink deterministic before reporting
            guard.disarm();
            Err(SpawnError::Interrupted)
        }
    }
}
```

</details>

**依据 4 · 源码核查**：[crates/cordis-core/src/fiber/mod.rs:903-932](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/mod.rs#L903-L932)

settle在目标缺少依赖时转Pending并return，不进入apply。

<details>
<summary>查看原文（30行）</summary>

```text
        if !self.is_alive() {
            return; // disposed: never re-apply
        }
        match self.state() {
            FiberState::Active | FiberState::Failed | FiberState::Loading => {
                self.transition(FiberState::Unloading).await;
                self.drain_disposables().await;
            }
            // Pending: never applied, no effects to drain. Unloading: the
            // drain is already owned by whoever set that state (reload or
            // dispose) — running a second one here would double-dispose.
            // Disposed: unreachable through the liveness guard above, kept
            // explicit so the match stays exhaustive. Every arm is spelled
            // out so a future FiberState variant breaks this match at
            // compile time instead of silently landing in a no-op
            // (fail-fast, STATE_TABLE posture).
            FiberState::Pending | FiberState::Unloading | FiberState::Disposed => {}
        }
        if target.has_missing() {
            // Pending attests no apply outcome. Clear any stale parked failure
            // before publishing the state so state/error meaning is already
            // coherent when observers see Pending.
            self.store_error(None);
            self.transition(FiberState::Pending).await;
            return;
        }
        // First-apply ownership (LF-01): while the spawn transaction is
        // pending, only its initial pass may run the first apply. A
        // convergence pass that won the slot in that window leaves the
        // fiber Pending — the durable committed recheck keeps drift visible,
```

</details>

**依据 5 · 源码核查**：[crates/cordis-core/src/service.rs:774-817](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/service.rs#L774-L817)

服务publication与精确撤回清理一起提交。

<details>
<summary>查看原文（44行）</summary>

```text
    pub fn provide<S: Service>(
        &self,
        value: Arc<S>,
    ) -> std::result::Result<ServicePublication<S>, ServicePublishError> {
        let fiber = self.fiber().clone();
        fiber
            .assert_can_register()
            .map_err(|_| ServicePublishError::InactiveContext)?;
        let key = self.isolate_key(S::NAME);
        let occurrence = ServiceOccurrenceId::fresh();
        let cleanup_root = self.root.clone();
        let cleanup_occurrence = occurrence.clone();
        let mut step = ServiceSlotPublish {
            root: &self.root,
            owner: &fiber,
            store: &self.root.services,
            key,
            name: S::NAME,
            slot: Some(ServiceSlot {
                occurrence: occurrence.clone(),
                value,
                contract: std::any::TypeId::of::<S>(),
                fiber: Arc::downgrade(&fiber),
            }),
            evicted: None,
            drift: None,
            refusal: None,
        };
        let committed = crate::gated::push_gated(
            &fiber,
            crate::effect::sync_cleanup(move || {
                // Gate close already made an Active occurrence invisible and
                // emitted its drift. Physical stale cleanup is identity-checked
                // and semantically inert.
                cleanup_root
                    .services
                    .withdraw_exact(key, S::NAME, &cleanup_occurrence);
            }),
            &mut step,
        );
        let cleanup = match committed {
            Ok(cleanup) => cleanup,
            Err(_) => {
                return Err(step
```

</details>

**依据 6 · 源码核查**：[crates/cordis-core/src/service.rs:860-868](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/service.rs#L860-L868)

实际查询选定slot，无fallback。

```text

    /// Resolve only the exact Service slot selected by this Context's isolate
    /// axis. InjectSpec membership is irrelevant and no fallback/provider
    /// predicate is consulted.
    pub fn try_service<S: Service>(&self) -> std::result::Result<Arc<S>, ServiceLookupError> {
        let key = self.isolate_key(S::NAME);
        self.root.services.visible_value::<S>(key)
    }
}
```

**依据 7 · 源码核查**：[crates/cordis-core/src/context.rs:350-394](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/context.rs#L350-L394)

单服务新realm与批量映射身份验证。

<details>
<summary>查看原文（45行）</summary>

```text
    pub fn with_isolated_service(&self, name: &str) -> Self {
        let mut map = HashMap::new();
        map.insert(name.to_owned(), self.root.sn.next_realm_key());
        self.derive_isolate(map)
    }

    /// Derive a Context mapping several Service names into exact realms in
    /// one atomic isolate layer; lookup shadows nearest-layer-first exactly like
    /// [`Context::with_isolated_service`], and names absent from `realms`
    /// retain the source view's mapping or the Runtime default.
    ///
    /// The complete batch is validated before a Context is derived. Duplicate
    /// Service names are rejected before foreign-Runtime membership is checked;
    /// either failure leaves the source Context unchanged.
    #[must_use = "a derived context that is dropped has no effect"]
    pub fn with_service_realms<I, K>(
        &self,
        realms: I,
    ) -> std::result::Result<Self, crate::service::RealmMappingError>
    where
        I: IntoIterator<Item = (K, crate::ServiceRealm)>,
        K: Into<String>,
    {
        // Conversion is user code. Complete it before validation so a panic or
        // reentrant call cannot leave a partial layer behind.
        let pairs: Vec<(String, crate::ServiceRealm)> = realms
            .into_iter()
            .map(|(name, realm)| (name.into(), realm))
            .collect();

        let mut names = HashSet::with_capacity(pairs.len());
        for (name, _) in &pairs {
            if !names.insert(name.clone()) {
                return Err(crate::service::RealmMappingError::DuplicateService {
                    service: name.clone(),
                });
            }
        }

        for (name, realm) in &pairs {
            if !realm.belongs_to(&self.root.realm_membership) {
                return Err(crate::service::RealmMappingError::ForeignRealm {
                    service: name.clone(),
                });
            }
```

</details>

**依据 8 · 源码核查**：[crates/cordis-core/src/events/dispatch.rs:220-233](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/events/dispatch.rs#L220-L233)

Scoped事件预检Runtime归属。

<details>
<summary>查看原文（14行）</summary>

```text

    fn preflight<E: Event>(
        &self,
        routing: &Routing,
        operation: EventOperation,
    ) -> Result<Vec<HookSnap>, DispatchError> {
        if let Routing::Scoped(scope) = routing
            && !scope.belongs_to(&self.root.scope_membership)
        {
            return Err(DispatchError::ForeignScope);
        }
        self.root.events.preflight::<E>(routing, operation)
    }

```

</details>

**依据 9 · 源码核查**：[crates/cordis-core/src/events/dispatch.rs:548-568](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/events/dispatch.rs#L548-L568)

emit实际派发并发布结果观察记录。

<details>
<summary>查看原文（21行）</summary>

```text
    pub async fn emit<E>(&self, routing: Routing, args: E::Args) -> Result<(), DispatchError>
    where
        E: Event,
        E::Args: Clone,
    {
        let observed_routing = crate::observation::ObservationRouting::from_routing(&routing);
        let result = self.emit_inner::<E>(routing, args).await;
        self.root
            .observations
            .publish(crate::observation::RuntimeObservation::DispatchCompleted {
                operation: EventOperation::Emit,
                event: E::NAME,
                routing: observed_routing,
                outcome: if result.is_ok() {
                    super::DispatchOutcomeKind::Completed
                } else {
                    super::DispatchOutcomeKind::Failed
                },
            });
        result
    }
```

</details>

**依据 10 · 作者声明**：[README.md:285-327](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/README.md#L285-L327)

作者解释事件路由与服务放置相互独立。

<details>
<summary>查看原文（43行）</summary>

````text

`Routing::Scoped(scope)` reaches scoped registrations on the target Scope itself
and its ancestors, plus global registrations. Siblings and descendants are not
reached. `Routing::Unscoped` does not apply Scope eligibility filtering.

This makes Scope useful for questions such as:

> Which behavior should be able to hear this Event?

Typical Scope boundaries are a tenant, request, workflow, session, or
plugin-local event pipeline.

## Scope and Service isolation are independent

A `Context` carries independent axes:

```text
Context
  ├─ current Fiber
  ├─ isolate   → which exact Service realm each Service resolves from
  ├─ Scope     → which listeners are eligible for scoped Event dispatch
  └─ intercept → ordered ConfigurableService configuration layers
```

Use **Scope** for Event reachability. Use **Service isolation** for Service
placement.

| Question | Use |
|---|---|
| Which listeners may receive this Event? | `Scope` |
| Keep tenant A events out of tenant B's event subtree? | `Scope` |
| Which Database should this Plugin resolve? | Service isolation |
| Give two tenants different Caches? | Service isolation |
| Share Metrics while isolating Database? | explicit `ServiceRealm` mappings |

The axes do not imply one another. Two Contexts may share the same Service realm
while living in different Scopes, or share the same Scope while resolving a
Service from different realms.

When a Plugin is spawned, its Service dependency edges are resolved against the
spawning Context's isolate mapping, while the new Fiber receives its own child
Scope. This lets sibling Plugins share exact Services without accidentally
sharing one Event seat.
````

</details>

**依据 11 · 源码核查**：[examples/hello_plugin/src/main.rs:49-82](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/examples/hello_plugin/src/main.rs#L49-L82)

示例实际组合准备、spawn、事件与teardown。

<details>
<summary>查看原文（34行）</summary>

```text
            Ok::<_, Infallible>(())
        }))?;
        Ok(())
    }
}

#[tokio::main]
async fn main() -> Result<(), BoxError> {
    let ctx = Context::new();
    let mut roster = Roster::new();

    // 4. Prepare explicitly, seal the exact Plugin/input association, then
    //    perform complete spawn. A successful handoff is already live and
    //    quiescent; the Harness records the delivered FiberHandle for teardown.
    section("boot: one echo plugin");
    let plugin = Echo;
    let input = plugin.prepare(())?;
    let sealed = PreparedPlugin::from_input(plugin, input);
    roster.push(ctx.spawn(sealed).await?);
    roster.report().await;

    // 5. Dispatch is typed and routing is explicit. The Plugin behavior is
    //    observable as "hello, world".
    section("run: emit Ping");
    ctx.emit::<Ping>(Routing::Unscoped, "world".into()).await?;

    // 6. Consumer-owned teardown deterministically disposes the delivered FiberHandle.
    section("teardown: dispose the FiberHandle");
    roster.teardown().await;

    // The listener was generation-owned: after disposal there is no callback.
    ctx.emit::<Ping>(Routing::Unscoped, "nobody listens anymore".into())
        .await?;
    println!("  (the second Ping printed nothing — the listener died with the FiberHandle)");
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · generation 清理和隔离究竟保证什么，何时仍需应用兜底？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

generation提供的是已登记资源的生命周期所有权，不是对任意外部副作用的事务回滚。清理journal按提交顺序编号，用remove领取某个occurrence的唯一义务；drain按逆序领取并逐项await，错误或panic被规范化并报告后继续。Fiber dispose先取得终态所有权，交给CallerDriven完成清理、Disposed发布和精确驻留unlink；并发调用等待相同终态屏障。这是比“Drop就当结束”更明确的完成契约。

应用仍必须保存需要结束的FiberHandle并显式dispose；仓库没有全Runtime shutdown，丢Context或Handle不构成生命周期teardown。spawn出的Fiber没有隐含父子销毁关系，可以活得比发起者久。另一个关键区别是创建future：提交后仍存活但不再被poll会停在创建中，依赖它的删除也会等；真正drop该future才把未交付Fiber的清理交给框架。不能笼统宣称所有postcommit操作都自动前进。dispose自己的已提交owner则有独立前进的实现。

apply或cleanup若阻塞执行线程、外部服务永不响应，依然会影响进度；Plugin契约要求每次poll不阻塞，用户应把同步阻塞移出异步工作线程。attempt-all只表示前一项返回失败后继续，不能保证永不完成的清理有时间上限。清理失败被消费并形成诊断，不等于外部资源已成功关闭。

realm和Scope约束同一进程内的服务放置及事件可达性，不是恶意插件隔离、租户认证或OS沙箱。try_service并不要求先声明inject，拿到更广Context的可信代码仍能使用相应服务；Unscoped事件也绕过Scope筛选。若应用需要多租户授权、资源配额或远端命令撤销，必须在应用和执行边界另行实现。

#### 证据与依据

**依据 1 · 源码核查**：[crates/cordis-core/src/effect.rs:130-177](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/effect.rs#L130-L177)

journal按顺序记录并remove领取唯一清理义务。

<details>
<summary>查看原文（48行）</summary>

```text
/// The per-generation cleanup journal: a keyed list of cleanup obligations
/// preserving insertion (commit) order. `tokens()` returns keys in forward
/// order and the owning fiber's drain runs cleanups LIFO by reversing it;
/// `remove` is the exact one-time claim both manual control and the drain
/// compete on. The journal holds no labels and answers no introspection —
/// presence of a resource is observed through that resource's own semantic
/// interface, never through cleanup bookkeeping.
#[derive(Default)]
pub(crate) struct DisposableList {
    sn: u64,
    map: BTreeMap<u64, Cleanup>,
}

impl DisposableList {
    /// An empty journal.
    pub(crate) fn new() -> Self {
        Self::default()
    }

    /// Commit one cleanup obligation; returns its exact claim token.
    pub(crate) fn push(&mut self, cleanup: Cleanup) -> DisposableToken {
        self.sn += 1;
        let sn = self.sn;
        self.map.insert(sn, cleanup);
        DisposableToken(sn)
    }

    /// Claim a previously pushed occurrence, returning its cleanup if it
    /// was still owned by the generation — the remove-returns-ownership
    /// two-phase shape (ADR 0010): the caller runs or drops the cleanup
    /// *after* releasing the lock, so user-controlled destruction never
    /// executes inside the critical section.
    pub(crate) fn remove(&mut self, token: DisposableToken) -> Option<Cleanup> {
        self.map.remove(&token.0)
    }

    /// Snapshot of every still-owned token, in commit order — the drain's
    /// worklist (it reverses this for LIFO).
    pub(crate) fn tokens(&self) -> Vec<DisposableToken> {
        self.map.keys().map(|k| DisposableToken(*k)).collect()
    }
}

mod sealed {
    pub trait Sealed {}
    impl Sealed for () {}
    impl<E: std::error::Error> Sealed for Result<(), E> {}

```

</details>

**依据 2 · 源码核查**：[crates/cordis-core/src/fiber/mod.rs:810-825](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/mod.rs#L810-L825)

逆序逐项领取清理并等待完成。

<details>
<summary>查看原文（16行）</summary>

```text
    /// Run the cleanups the given tokens resolve to, **LIFO**, each
    /// exactly once (claimed before it runs) and contained: a failing or
    /// panicking cleanup is normalized, reported, and the sequence
    /// continues, so one broken cleanup never strands the rest. Tokens
    /// that no longer resolve (early manual claims) are skipped.
    pub(crate) async fn run_tokens_contained(
        self: &Arc<Self>,
        tokens: Vec<crate::effect::DisposableToken>,
    ) {
        for token in tokens.into_iter().rev() {
            if let Some(cleanup) = self.remove_disposable(token) {
                self.run_cleanup_contained(cleanup).await;
            }
        }
    }

```

</details>

**依据 3 · 源码核查**：[crates/cordis-core/src/fiber/mod.rs:1001-1064](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/mod.rs#L1001-L1064)

dispose所有权、CallerDriven完成与驻留屏障。

<details>
<summary>查看原文（64行）</summary>

```text
    }

    /// Complete the terminal disposal transaction. The first caller commits
    /// Open-to-Closing while holding the lifecycle slot, then drives the
    /// owner's synchronous prefix inline; at the owner's first `Pending` it is
    /// handed to framework completion and the caller only awaits its outcome.
    /// Every racing/later caller waits for the same full cleanup + Disposed +
    /// exact-unlink barrier.
    pub(crate) async fn dispose(self: &Arc<Self>) {
        if self.dispose_complete.load(Ordering::SeqCst) {
            return;
        }

        // Cancellation while waiting here is precommit and therefore inert.
        self.slot.claim().await;
        if self.dispose_complete.load(Ordering::SeqCst) {
            self.slot.abandon();
            return;
        }

        if self.claim_terminal() {
            // The committed owner may have released the settle slot before its
            // exact Registry unlink completed. Give the slot back, then join
            // the owner's stronger terminal barrier rather than returning early.
            self.slot.abandon();
            self.wait_dispose_complete().await;
            return;
        }

        // Open-to-Closing is committed. No await occurs between the claim and
        // the caller-driven owner, and the owner leaves the caller at its first
        // `Pending`, so neither caller cancellation nor a caller that stops
        // polling can stop it.
        let report = self
            .spawn_state
            .root()
            .map(|root| crate::framework_task::PanicReport {
                logger: root.logger.logger_for_fiber(&self.name),
                operation: "fiber dispose",
                context: format!("fiber={:?}", self.name),
            });
        let fiber = self.clone();
        crate::effect::CallerDriven::new(report, async move {
            fiber.complete_claimed_dispose().await;
        })
        .await;
    }

    /// Finish a terminal disposal after the caller has won `disposing` and
    /// owns the lifecycle slot. This is the single implementation of the full
    /// terminal barrier shared by ordinary disposal and era replacement.
    pub(crate) async fn complete_claimed_dispose(self: &Arc<Self>) {
        settle_ctx::bracket(self.clone(), async {
            self.teardown_body().await;
            self.slot.abandon();
        })
        .await;
        // Completion includes exact residency release/prune; publish only after
        // the Registry barrier is complete.
        self.release_residency();
        self.publish_dispose_complete();
    }

    async fn wait_dispose_complete(&self) {
```

</details>

**依据 4 · 源码核查**：[crates/cordis-core/src/fiber/spawn.rs:408-426](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/spawn.rs#L408-L426)

创建future保持不poll与drop的进度差异。

<details>
<summary>查看原文（19行）</summary>

```text
    /// Before the allocation/publication commit, dropping this future
    /// has no lifecycle effect (the pre-commit section is synchronous).
    /// After it, the creation up to FiberHandle delivery is driven by polling
    /// this future. While the future is alive, the creation advances only as
    /// it is polled: a future kept but no longer polled, such as the
    /// unfinished half of a `select`, holds the new Fiber in its creation, and
    /// work that waits on that Fiber, such as
    /// [`remove_plugins`](Context::remove_plugins) of its allocation, waits
    /// too. Dropping the future hands the committed creation to framework
    /// completion, which fully disposes and unlinks the undelivered Fiber
    /// independently of caller polling. Caller cancellation is never
    /// reported as [`SpawnError::Interrupted`].
    pub async fn spawn(
        &self,
        prepared: PreparedPlugin,
    ) -> std::result::Result<FiberHandle, SpawnError> {
        spawn_prepared(self, prepared).await
    }
}
```

</details>

**依据 5 · 源码核查**：[crates/cordis-core/src/plugin.rs:143-150](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/plugin.rs#L143-L150)

apply明确要求非阻塞poll，框架不能替代此条件。

```text
    /// Keep each poll non-blocking. Move synchronous blocking sections to
    /// `tokio::task::spawn_blocking` and await its JoinHandle asynchronously.
    /// Do not assume affinity to the spawning runtime: apply may be polled on
    /// a Cordis-owned runtime, and `tokio::spawn`, `Handle::current()` and
    /// [`Context::run`](crate::Context::run) inside apply use whichever runtime
    /// polls it. A blocked poll can stall unrelated Fibers' lifecycle work and
    /// async cleanup.
    ///
```

**依据 6 · 作者声明**：[docs/application-teardown.md:9-49](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/docs/application-teardown.md#L9-L49)

应用拥有关闭策略，无Runtime shutdown或隐含父子关系。

<details>
<summary>查看原文（41行）</summary>

````text

Cordis deliberately has no Runtime-wide shutdown operation. An application owns
its teardown policy:

1. retain every delivered `FiberHandle` whose Fiber the application intends to
   end;
2. on normal shutdown, call `dispose().await` for those handles;
3. when order matters, compose that order in the application; the demonstrated
   Harness/Roster policy is reverse spawn order; and
4. attempt every planned disposal instead of stopping after the first refusal.

`FiberHandle::dispose().await` is the deterministic lifecycle end for one
non-root Fiber. Return means its terminal barrier has completed: the current
generation is closed and drained, `Disposed` has been published, and the exact
Registry residency occurrence has been unlinked.

There is no equivalent `Runtime::shutdown()`, and dropping a `Context`,
`LoadOutcome`, or `FiberHandle` is not a substitute for lifecycle teardown.

## A demonstrated application policy

The repository's consumer-of-record Harness records delivered handles in spawn
order and tears them down in reverse order:

```rust
use cordis::{FiberHandle, FiberState};

async fn teardown(fibers: &[FiberHandle]) {
    for fiber in fibers.iter().rev() {
        if fiber.state() == FiberState::Disposed {
            continue;
        }
        if let Err(error) = fiber.dispose().await {
            eprintln!("teardown refused for {}: {error}", fiber.name());
            // Attempt the remaining Fibers.
        }
    }
}
```

That order is **consumer composition policy**, not hidden parenthood in core.
````

</details>

**依据 7 · 源码核查**：[crates/cordis-core/src/service.rs:860-868](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/service.rs#L860-L868)

查询不以inject声明为授权表。

```text

    /// Resolve only the exact Service slot selected by this Context's isolate
    /// axis. InjectSpec membership is irrelevant and no fallback/provider
    /// predicate is consulted.
    pub fn try_service<S: Service>(&self) -> std::result::Result<Arc<S>, ServiceLookupError> {
        let key = self.isolate_key(S::NAME);
        self.root.services.visible_value::<S>(key)
    }
}
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 从集成到迁移、运行和关闭的成本与试用条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合有真实动态插件需求的Rust应用开发者在新建或隔离分支上小范围试用，不适合把它直接当作DSH插件安装。固定版本facade为0.11.1，core/timer/loader为0.6.1，Cargo声明Rust1.88和2024 edition。开发工具链另钉住1.98.1用于编译器诊断快照；不能把最低支持版和开发固定版混为一谈，也不能由源码声明推断本机已通过构建。

首次需把业务组件改写成typed Config/Input/Plugin，声明服务与事件契约，明确资源注册和应用关闭roster。持续使用需维护句柄、控制版本组合，并检查清理诊断。README要求语义crate与facade配套升级，混用0.5和0.6会导致类型不兼容；0.6为预冻结破坏性版本，非穷尽枚举要求通配匹配。迁移成本由开发者承担，不是换一个依赖版本号即可。

失败恢复应按业务状态区分重启插件、替换输入和新identity的era替换；本轮未逐分支审查update或loader全部实现，不提供其自动恢复保证。关闭先拒绝新任务，再按应用选择的顺序对所有已交付句柄dispose，留存清理诊断；业务数据库或远端写入需要应用自有补偿。若试用出现依赖缺失仍执行、realm错误回退、清理重复或关闭永不结束，应停止扩大范围并退回原应用路径与最小复现。

固定SECURITY仍列facade0.8/core0.3支持行，与README的0.11/0.6不一致，支持范围需向维护者确认，不能据旧文档断言当前版本不修复安全问题。现金、性能开销、迁移人时和故障恢复时间均无本次实测；没有合格任务对照，不计算单位任务成本或宣称低成本。

#### 证据与依据

**依据 1 · 源码核查**：[Cargo.toml:17-39](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/Cargo.toml#L17-L39)

版本配套、Rust和基础依赖的固定声明。

<details>
<summary>查看原文（23行）</summary>

```text
[workspace.package]
version = "0.6.1"
edition = "2024"
rust-version = "1.88"
license = "MIT"
repository = "https://github.com/dshbox/cordis-rs"

[workspace.dependencies]
cordis-core = { path = "crates/cordis-core", version = "0.6.1" }
cordis-timer = { path = "crates/cordis-timer", version = "0.6.1" }
cordis-loader = { path = "crates/cordis-loader", version = "0.6.1" }
cordis-rs = { path = "crates/cordis", version = "0.11.1" }
examples-common = { path = "examples/common" }
# Core intentionally omits Tokio's `time` feature; time operations belong to
# cordis-timer, while serde-backed loading belongs to cordis-loader (ADR 0036).
tokio = { version = "1", default-features = false, features = ["rt", "rt-multi-thread", "sync", "macros"] }
parking_lot = "0.12"
thiserror = "2"
futures = "0.3"
serde = { version = "1", features = ["derive"] }
serde_json = "1"
trybuild = "1"
loom = "0.7.2"
```

</details>

**依据 2 · 源码核查**：[crates/cordis/Cargo.toml:1-24](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis/Cargo.toml#L1-L24)

facade版本0.11.1与core依赖。

<details>
<summary>查看原文（24行）</summary>

```text
[package]
name = "cordis-rs"
version = "0.11.1"
description = "Application-facing facade for the Cordis v3 runtime"
keywords = ["cordis", "plugin", "events", "lifecycle", "framework"]
categories = ["asynchronous", "rust-patterns"]
edition.workspace = true
rust-version.workspace = true
license.workspace = true
repository.workspace = true
readme = "../../README.md"

[lib]
name = "cordis"
path = "src/lib.rs"

[features]
default = []

[dependencies]
cordis-core.workspace = true

[dev-dependencies]
trybuild.workspace = true
```

</details>

**依据 3 · 源码核查**：[rust-toolchain.toml:1-10](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/rust-toolchain.toml#L1-L10)

开发诊断工具链钉住1.98.1，不是MSRV。

<details>
<summary>查看原文（10行）</summary>

```text
# Canonical development and UI-diagnostic toolchain.
#
# trybuild snapshots are compiler UI contracts, so this version is intentionally
# pinned to an exact Rust patch release. Bump it deliberately together with any
# required `.stderr` refreshes. CI has a separate floating-stable compatibility
# lane that never compares trybuild golden diagnostics.
[toolchain]
channel = "1.98.1"
profile = "minimal"
components = ["clippy", "rustfmt", "rust-src"]
```

</details>

**依据 4 · 作者声明**：[README.md:45-61](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/README.md#L45-L61)

作者给出版本混用与破坏性升级条件。

<details>
<summary>查看原文（17行）</summary>

```text
Cordis v3 requires Rust **1.88** or newer and uses Rust 2024 Edition.

When upgrading from semantic `0.5` / facade `0.10`, update core, timer and loader
requirements together to `0.6` and the facade to `0.11`. The facade re-exports
core types; mixing `0.5` and `0.6` core types causes type mismatches. `0.6` is a
breaking pre-freeze line: public vocabularies expected to grow are now
`#[non_exhaustive]` (add wildcard arms and `..` patterns), Loader source rows are
extensible and built with `PluginEntry::new` and `EntryGroup::new`, and two
documented promises are narrowed (creation progress after its commit, and the
meaning of lifecycle admission order;
[ADR 0029](docs/adr/0029-lifecycle-commits-complete-and-critical-sections-are-closed.md)).
The compatible-evolution rules, enum openness and auto-trait and operation-future
`Send` promises are recorded in
[ADR 0042](docs/adr/0042-public-evolution-declares-openness-and-auto-traits.md).
For step-by-step edits and earlier
upgrades, see [MIGRATION.md](MIGRATION.md), the
[core release notes](crates/cordis-core/CHANGELOG.md) and the
```

</details>

**依据 5 · 作者声明**：[docs/application-teardown.md:9-26](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/docs/application-teardown.md#L9-L26)

应用须保留句柄并安排关闭。

<details>
<summary>查看原文（18行）</summary>

```text

Cordis deliberately has no Runtime-wide shutdown operation. An application owns
its teardown policy:

1. retain every delivered `FiberHandle` whose Fiber the application intends to
   end;
2. on normal shutdown, call `dispose().await` for those handles;
3. when order matters, compose that order in the application; the demonstrated
   Harness/Roster policy is reverse spawn order; and
4. attempt every planned disposal instead of stopping after the first refusal.

`FiberHandle::dispose().await` is the deterministic lifecycle end for one
non-root Fiber. Return means its terminal barrier has completed: the current
generation is closed and drained, `Disposed` has been published, and the exact
Registry residency occurrence has been unlinked.

There is no equivalent `Runtime::shutdown()`, and dropping a `Context`,
`LoadOutcome`, or `FiberHandle` is not a substitute for lifecycle teardown.
```

</details>

**依据 6 · 作者声明**：[SECURITY.md:3-11](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/SECURITY.md#L3-L11)

支持名单仍为较早版本，仅支持文档不一致判断。

```text
## Supported versions

Cordis is still pre-1.0. Security fixes target the currently published v3 lines:

* `cordis-rs` `0.8.x`;
* `cordis-core`, `cordis-loader`, and `cordis-timer` `0.3.x`.

The legacy `0.6.x` implementation lives on the `legacy/0.6` branch and receives only critical bug and security fixes. Older lines are not actively supported.

```

#### 缺口

- 没有目标应用的性能、迁移人时或真实恢复结果，维护支持版本声明亦未确认。
  **影响**：不能推荐直接替换生产运行时或量化维护收益。
  **进一步探讨**：先把一个带动态依赖和cleanup的最小组件接入隔离应用，检查版本配套、关闭轨迹和维护者支持声明。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否用故障轨迹验证生命周期交接证书假设？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可借鉴的已有机制是把唯一清理义务、精确服务publication与驻留提交点分开，再把完成屏障显式交给句柄。它让调用方能区分已接纳、可用、依赖Pending和已完成dispose；这类边界比把所有事情放进Drop更容易解释。现有RuntimeObservation用于诊断，并非持久事件回放或业务事务日志。

由Q03的“创建future仍存活但不poll”与“drop后交接清理”，以及应用自己保存句柄的责任，推导未验证假设：应用层把每次创建、交付和终态unlink的观察记录关联成只读生命周期轨迹，并在关闭验收时对照实际资源探针，能更早识别无人持有但仍存活的Fiber或等待不前进的创建。它不改变core语义，也不把诊断事件当成业务副作用证明；额外代价是关联ID、记录保存、探针与隐私审查。

最小实验用一个有延迟apply和两个清理义务的测试应用，对比正常完成、提交前drop、提交后drop、保持future不poll、一个cleanup返回错误及停止一个依赖服务。对照只有日志与带关联轨迹的应用，记录可解释终态比例、重复清理、资源残留和定位耗时。成功条件是轨迹不把Pending当Active、不把drop当正常交付，也不把cleanup失败当外部资源关闭；出现错误证书或新增记录反而阻塞退出即削弱假设。实验未执行，不计入本版本创新评分。

#### 证据与依据

**依据 1 · 源码核查**：[crates/cordis-core/src/fiber/spawn.rs:285-297](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/spawn.rs#L285-L297)

attach驻留提交与CreationGuard构成交接边界。

<details>
<summary>查看原文（13行）</summary>

```text
    // either disposes this fiber or leaves it visible, never detached.
    // This is the commit point: from here the creation guard owns the
    // fiber's cleanup if the caller abandons the spawn.
    root.registry.attach_fiber(plugin_key, fiber.clone());
    let mut guard = CreationGuard::armed(fiber.clone());

    // resolve declared injects against this scope now — later audits and
    // SemanticTarget reconstruction must not depend on the spawning context
    // (spawn-time snapshot principle). The stored scope derives the
    // fiber's own scope node (ADR 0003 overturn row 5): every apply —
    // first, restart, dependency reload — derives its context from it, so a
    // fiber's registrations (including typed update-control registrations) stay on
    // its own subtree instead of sharing the spawning scope's pipeline
```

</details>

**依据 2 · 源码核查**：[crates/cordis-core/src/fiber/spawn.rs:408-426](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/spawn.rs#L408-L426)

不poll与drop的不同结局提供可检验样本。

<details>
<summary>查看原文（19行）</summary>

```text
    /// Before the allocation/publication commit, dropping this future
    /// has no lifecycle effect (the pre-commit section is synchronous).
    /// After it, the creation up to FiberHandle delivery is driven by polling
    /// this future. While the future is alive, the creation advances only as
    /// it is polled: a future kept but no longer polled, such as the
    /// unfinished half of a `select`, holds the new Fiber in its creation, and
    /// work that waits on that Fiber, such as
    /// [`remove_plugins`](Context::remove_plugins) of its allocation, waits
    /// too. Dropping the future hands the committed creation to framework
    /// completion, which fully disposes and unlinks the undelivered Fiber
    /// independently of caller polling. Caller cancellation is never
    /// reported as [`SpawnError::Interrupted`].
    pub async fn spawn(
        &self,
        prepared: PreparedPlugin,
    ) -> std::result::Result<FiberHandle, SpawnError> {
        spawn_prepared(self, prepared).await
    }
}
```

</details>

**依据 3 · 源码核查**：[crates/cordis-core/src/fiber/mod.rs:1052-1065](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/fiber/mod.rs#L1052-L1065)

终态unlink与完成发布可以作为观察锚点。

<details>
<summary>查看原文（14行）</summary>

```text
    pub(crate) async fn complete_claimed_dispose(self: &Arc<Self>) {
        settle_ctx::bracket(self.clone(), async {
            self.teardown_body().await;
            self.slot.abandon();
        })
        .await;
        // Completion includes exact residency release/prune; publish only after
        // the Registry barrier is complete.
        self.release_residency();
        self.publish_dispose_complete();
    }

    async fn wait_dispose_complete(&self) {
        loop {
```

</details>

**依据 4 · 源码核查**：[crates/cordis-core/src/context.rs:229-242](https://github.com/dshbox/cordis-rs/blob/cd540033487f62c1b574bffd39befb717afb8a35/crates/cordis-core/src/context.rs#L229-L242)

观察入口注明只用于诊断，不提供历史回放或控制。

<details>
<summary>查看原文（14行）</summary>

```text
        self.root.observations.register(self, observer)
    }

    /// Capture a flat read-only projection of this Runtime's current state.
    ///
    /// Records are individually self-consistent, but the Fiber and Service
    /// collections are unordered, are not one globally linearizable instant,
    /// and need not be referentially closed. The snapshot is current-state
    /// diagnostics only: it provides no history, replay, lookup, or control.
    pub fn runtime_snapshot(&self) -> crate::observation::RuntimeSnapshot {
        use crate::fiber::{FiberRole, FiberState};
        use crate::observation::{FiberSnapshot, RuntimeSnapshot, ServiceSnapshot};

        let mut fibers = Vec::new();
```

</details>

#### 缺口

- 关联轨迹是否降低诊断耗时以及资源探针是否覆盖真实业务尚未知。
  **影响**：只能作为应用层研究假设，不升级为core已有恢复或观测能力。
  **进一步探讨**：在相同故障样本比较错误终态解释、残留资源与定位耗时，并检查记录开销。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
