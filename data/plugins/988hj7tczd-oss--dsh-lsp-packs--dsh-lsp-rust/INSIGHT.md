# dsh-lsp-rust

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：以 rust-analyzer 为外部服务器的 Rust LSP 配置包，复用 DSH 共享基座。

> **核心亮点**：减少 Rust LSP 装配；不实现协议，详见[Q01](#research-q01)。

> **风险与缺陷**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

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
  - [Q01 · Rust 导航功能由配置包还是 rust-analyzer/共享基座提供？](#detail-section-11)
  - [Q02 · 缺服降级是否保留自定义扩展并准确区分故障？](#detail-section-12)
  - [Q03 · 在 Rust 工程采用的条件和证据范围是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中对 .rs 文件执行定义、引用、实现、hover 查询。

手工向共享 LSP 配置增加 rust-analyzer 与 .rs 映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 条件 | 边界 |
| --- | --- | --- |
| .rs LSP 路由 | rust-analyzer 与共享基座 | 本包只配置 |
| 缺服 fallback | 启动异常 | 宽 catch 误归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH LSP service/tool 与 fs/subprocess | 必需 | 模型查询及进程运行 | 薄包独立不可用 |
| rust-analyzer 与 Rust 工具链 | Rust 查询必需 | 语言分析和 Cargo 索引 | 缺服或索引不足 |
| Cargo workspace | 真实项目查询时 | 依赖与 crate 语义 | 跨 crate 结果待核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员安装 rust-analyzer/toolchain 并配 PATH | 组件可解析 |
| 加载 | 管理员挂 LSP 基座与语言包 | provider 注册 |
| 任务 | 用户在 Cargo workspace 查询四操作 | 结果定位可复核 |
| 验收/恢复 | 管理员核索引和故障类型 | 记录资源与错误边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装 rust-analyzer、rustup/rustc 与 DSH LSP 基座；版本/现金未知 | 确保 ~/.cargo/bin 在 PATH 并准备 Cargo workspace；工时未知 | server 组件缺失会降级 |
| 持续使用 | rust-analyzer 索引宏/依赖可占 CPU、内存与磁盘缓存；量值未知 | 维护 toolchain 与核跨 crate 查询；耗时未知 | 大型 workspace 未测 |
| 失败恢复 | 服务重启/重索引追加资源；金额未知 | 区分命令缺失、配置异常及 fallback 误归因；耗时未知 | 真实 lane 缺组件时自动 skip |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Rust 扩展路由 | Q01 源码证实 .rs→rust | 宏/跨 crate 结果 |
| 缺服 fallback | Q02 源码证实结构化错误 | 非缺服错误误归因影响 |
| 四项查询 | Q03 仅测试设计 | 真实 workspace 结果 |

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少 Rust LSP 装配；不实现协议，详见[Q01](#research-q01)。

减少 Rust LSP 装配；不实现协议，详见[Q01](#research-q01)。

配置覆盖合并；通过 LspStdio 启动；异常 fallback 用 LSP_UNAVAILABLE。

<a id="detail-section-5"></a>

### 1.4 主要限制

宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

确认 rustup 组件、rustc 与 DSH PATH；用真实 Cargo workspace 试四操作、首次索引；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态源码支持配置与降级设计；实际 rust-analyzer 运行和性能未验证。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-rust/README.md、dsh-lsp-rust/package.json、dsh-lsp-rust/src/index.ts、dsh-lsp-rust/tests/smoke.e2e.ts、dsh-lsp-rust/cordis.yml 及固定范围 inventory；组件：dsh-lsp-rust。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 dsh-lsp-rust 子组件；未运行服务器或插件。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：测缺服/错误配置/自定义扩展 fallback，及 Cargo workspace 索引。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](#research-q02)。

测缺服/错误配置/自定义扩展 fallback，及 Cargo workspace 索引。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 124 | — | — | 962 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 187 | 139 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T07%3A16%3A49.999Z..2026-10-22T07%3A16%3A49.999Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A16%3A49.999Z..2026-10-22T07%3A16%3A49.999Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Rust rust-analyzer 薄包的装配边界、工具链依赖与降级。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Rust 导航功能由配置包还是 rust-analyzer/共享基座提供？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

本包注册 rust provider，.rs→rust，默认运行外部 rust-analyzer（无参数）。协议、四项模型工具依赖共享基座及 rust-analyzer；包自身仅提供命令和扩展配置，绝不安装服务器。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-rust/README.md:3-24](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/README.md#L3-L24)

声明薄配置包、rust-analyzer 外部安装。

<details>
<summary>查看原文（22行）</summary>

````text
> rust-analyzer language configuration pack for DeepSeek Harness (DSH). Rust language server with definitions, references, and hover.
> 中文：DSH 的 rust-analyzer LSP「即插即用」语言包 —— 装上本包，.rs 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for rust-analyzer. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

```bash
rustup component add rust-analyzer   # via rustup (recommended)
# or: download the release binary from github.com/rust-lang/rust-analyzer
# or: cargo install rust-analyzer    # builds from source
```

`rust-analyzer` must be on `PATH`. `rustup component add rust-analyzer` makes rustup proxy it, so `PATH` must include `~/.cargo/bin`.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-rust/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/src/index.ts#L28-L46)

provider、注入依赖、默认命令与单扩展表。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-rust'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'rust'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'rust-analyzer'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".rs": "rust"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-rust/src/index.ts:152-160](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/src/index.ts#L152-L160)

委托 LspStdio。

```text
export async function apply(ctx: Context, config: Config): Promise<void> {
  const server = resolveServerConfig(config)
  try {
    // Resolve through lsp-stdio’s own Config schema so every documented default
    // (timer budgets, byte caps, env, ...) is filled before apply() — calling the
    // stdio apply directly bypasses the Cordis loader’s schema pass.
    const stdioConfig = LspStdio.Config({ servers: { [PROVIDER_ID]: server } })
    await LspStdio.apply(ctx, stdioConfig)
    return
```

#### 缺口

- Cargo workspace中的真实导航正确性与首次索引负担缺少对照。
  **影响**：不能从rust-analyzer启动链推断宏或跨crate查询质量。
  **进一步探讨**：以带已知定义位置的Cargo夹具比较四项导航和首次索引资源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺服降级是否保留自定义扩展并准确区分故障？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

resolveServerConfig 合并用户扩展及命令覆盖；apply 对 LspStdio.Config 与 apply 宽 catch，统一归因为 rust-analyzer unavailable，并只用默认 .rs 映射注册 fallback。因此非缺服错误可能被误报，自定义扩展在故障时不保留。resolveServerConfig 在 try 外，若其抛错仍可能中断加载。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-rust/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/src/index.ts#L103-L118)

默认与用户覆盖合并。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveServerConfig(config: Config): ResolvedServerConfig {
  const server: ResolvedServerConfig = {
    command: config.command ?? DEFAULT_COMMAND,
    args: config.args ?? [...DEFAULT_ARGS],
    extensionToLanguage: { ...DEFAULT_EXTENSION_TO_LANGUAGE, ...(config.extensionToLanguage ?? {}) },
  }
  if (config.env !== undefined) server.env = config.env
  if (config.initializationOptions !== undefined) server.initializationOptions = config.initializationOptions
  if (config.configuration !== undefined) server.configuration = config.configuration
  if (config.maxMessageBytes !== undefined) server.maxMessageBytes = config.maxMessageBytes
  if (config.maxStderrBytes !== undefined) server.maxStderrBytes = config.maxStderrBytes
  if (config.maxDocumentBytes !== undefined) server.maxDocumentBytes = config.maxDocumentBytes
  if (config.shutdownTimeoutMs !== undefined) server.shutdownTimeoutMs = config.shutdownTimeoutMs
  if (config.killGraceMs !== undefined) server.killGraceMs = config.killGraceMs
  return server
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-rust/src/index.ts:120-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/src/index.ts#L120-L169)

宽 catch 和默认扩展 fallback。

<details>
<summary>查看原文（50行）</summary>

```text
/** A provider that keeps extension routing alive while the server is missing. */
class UnavailableProvider implements LspProvider {
  readonly id = LspProviderId(PROVIDER_ID)
  readonly extensionToLanguage: Readonly<Record<string, string>>

  constructor(extensions: Readonly<Record<string, string>>, private readonly reason: string) {
    this.extensionToLanguage = { ...extensions }
  }

  query(_request: LspProviderQuery): Promise<LspQueryResult> {
    const message =
      'language server for ' + PROVIDER_ID + ' is unavailable: ' + this.reason + '. '
      + 'Install the language server (see the pack README) and reload the profile or session.'
    return Promise.reject(new LspError(message, 'LSP_UNAVAILABLE'))
  }
}

/** Extract a stable message from an unknown load-time failure. */
function failureMessage(error: unknown): string {
  if (error instanceof Error) return error.message
  return String(error)
}

/**
 * Register the configured stdio provider for the language, or a structured
 * no-server fallback when the executable cannot be resolved at load.
 *
 * The pack never crashes the session: an unresolvable server only disables
 * this language routing and surfaces `LSP_UNAVAILABLE` on queries.
 * @param ctx - the plugin context (must inject `fs`, `lsp`, `subprocess`).
 * @param config - the resolved pack configuration.
 */
export async function apply(ctx: Context, config: Config): Promise<void> {
  const server = resolveServerConfig(config)
  try {
    // Resolve through lsp-stdio’s own Config schema so every documented default
    // (timer budgets, byte caps, env, ...) is filled before apply() — calling the
    // stdio apply directly bypasses the Cordis loader’s schema pass.
    const stdioConfig = LspStdio.Config({ servers: { [PROVIDER_ID]: server } })
    await LspStdio.apply(ctx, stdioConfig)
    return
  } catch (error) {
    const reason = failureMessage(error)
    console.warn('[' + name + '] ' + DEFAULT_COMMAND + ' unavailable at load: ' + reason)
    ctx.effect(() => {
      const dispose = ctx.lsp.registerProvider(
        new UnavailableProvider(DEFAULT_EXTENSION_TO_LANGUAGE, reason),
      )
      return () => dispose()
    }, name + '.unavailableFallback')
```

</details>

**依据 3 · 作者声明**：[dsh-lsp-rust/README.md:30-54](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/README.md#L30-L54)

作者声明 lazy start/缺服降级/覆盖。

<details>
<summary>查看原文（25行）</summary>

````text

## How the pack works

- **Lazy start**: the server process is **not** started at load. `lsp-stdio` launches it
  lazily on the first matching query and keeps one process per workspace.
- **No-server fallback**: if the executable cannot be resolved, the pack still loads;
  every `lsp` query for these extensions fails with a structured `LSP_UNAVAILABLE` error
  naming the command — the rest of the session is unaffected.
- **Config overrides**: every default below can be overridden from the composition row,
  e.g. a server installed at a non-standard path:

```yaml
- id: lsp-rust
  name: '@dsh-lsp-packs/dsh-lsp-rust'
  config:
    command: /absolute/path/to/rust-analyzer
    args:
      - --stdio
    extensionToLanguage:
      '.xyz': custom-language-id
    maxDocumentBytes: 8000000
```

All fields of the `servers` table documented in the `@deepseek-ai/dsh-lsp-stdio` README are
accepted (`command`, `args`, `env`, `extensionToLanguage`, `initializationOptions`,
````

</details>

#### 缺口

- 未构造配置错误或额外扩展故障
  **影响**：用户可见错误类型待验证
  **进一步探讨**：隔离测试命令缺失、非法配置、.xyz 路由

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 在 Rust 工程采用的条件和证据范围是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

先挂共享 LSP service/tool 与 fs/subprocess，另用 rustup component add rust-analyzer 并确保 ~/.cargo/bin 在 DSH PATH；有效索引还依赖 rustc/rustup 工具链。测试含离线默认、缺服与有真实服务时的四操作 lane，服务缺失自动 skip；测试构造 Cargo.toml 与 trait 实现。本轮未运行，真实 Rust workspace 的宏、依赖索引及内存/时间待试。

成本分期：首次使用涉及安装 rust-analyzer、rustup/rustc 与 DSH LSP 基座；版本/现金未知，人工需确保 ~/.cargo/bin 在 PATH 并准备 Cargo workspace；工时未知；持续使用涉及rust-analyzer 索引宏/依赖可占 CPU、内存与磁盘缓存；量值未知，人工需维护 toolchain 与核跨 crate 查询；耗时未知；失败恢复涉及服务重启/重索引追加资源；金额未知，人工需区分命令缺失、配置异常及 fallback 误归因；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 已见 Config/apply 宽 catch 与默认扩展 fallback；若保留 resolved 映射并分类缺 server/配置错误，可改善 Rust 自定义扩展与诊断。条件是共享基座能暴露可区分的异常且需维护版本兼容。最小证伪：分别模拟缺 rust-analyzer、非法参数、注册失败和自定义 .xyz，若任一非缺服被标为缺服或 .xyz 查询失去结构化失败，假设失败；不推断 rust-analyzer 导航准确率。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-rust/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/README.md#L13-L25)

rust-analyzer 安装路径与外部依赖。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
rustup component add rust-analyzer   # via rustup (recommended)
# or: download the release binary from github.com/rust-lang/rust-analyzer
# or: cargo install rust-analyzer    # builds from source
```

`rust-analyzer` must be on `PATH`. `rustup component add rust-analyzer` makes rustup proxy it, so `PATH` must include `~/.cargo/bin`.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 作者声明**：[dsh-lsp-rust/README.md:57-93](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/README.md#L57-L93)

挂载/测试/许可声明。

<details>
<summary>查看原文（37行）</summary>

````text
## Mounting

1. Mount the shared base **once** (the `lsp` service, the `lsp` tool, and a
   filesystem/subprocess pair for the same execution world) — ready-made snippet in
   `examples/base-composition.cordis.yml` of the dsh-lsp-packs repo.
2. Install the pack (its `cordis.yml` is the `dsh.bundle.patch`, so the row inserts
   itself):

```bash
dsh plugin add @dsh-lsp-packs/dsh-lsp-rust    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-rust  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-rust
      name: '@dsh-lsp-packs/dsh-lsp-rust'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-rust   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.rs`;
  it **auto-skips** when `rust-analyzer` is not on PATH.

The test writes a minimal `Cargo.toml`; rust-analyzer needs a rust toolchain (`rustc`/`rustup`) to index the sysroot. The trait `Shape.area` gives `goToImplementation` a real `Circle` impl target.

## License

MIT — see `LICENSE`. The server binary is a third-party component with its own license.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-rust/tests/smoke.e2e.ts:24-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/tests/smoke.e2e.ts#L24-L41)

实际服务器探测与 skip 前提。

<details>
<summary>查看原文（18行）</summary>

```text
/** Probe whether the language server binary truly runs. */
function probeServer(command: string): boolean {
  const probe = spawnSync(command, ['--version'], {
    encoding: 'utf8',
    timeout: 10_000,
    shell: process.platform === 'win32',
  })
  // Spawn failure or timeout (ENOENT / killed) never counts as installed.
  if (probe.error !== undefined || probe.status === null) return false
  if (probe.status === 0) return true
  // Some servers (e.g. sourcekit-lsp) reject `--version` with a usage error while
  // running fine; only output saying the binary itself is missing skips the lane
  // (this also skips a rustup shim whose component is not installed).
  const output = String(probe.stdout ?? '') + String(probe.stderr ?? '')
  return !/(no such file|not found|unknown binary|command not found|ENOENT)/i.test(output)
}

const installed = probeServer('rust-analyzer')
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-rust/tests/smoke.e2e.ts:100-180](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-rust/tests/smoke.e2e.ts#L100-L180)

Rust crate 测试与四操作。

<details>
<summary>查看原文（81行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-rust real server (rust-analyzer)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-rust-')))
    ws = join(root, 'proj')
    await mkdir(ws)
    await writeFile(join(ws, "Cargo.toml"), "[package]\nname = \"sample\"\nversion = \"0.1.0\"\nedition = \"2021\"\n")
    await writeFile(join(ws, 'sample.rs'), [
      'trait Shape {',
      '    fn area(&self) -> i32;',
      '}',
      '',
      'struct Circle;',
      '',
      'impl Shape for Circle {',
      '    fn area(&self) -> i32 {',
      '        42',
      '    }',
      '}',
      '',
      'fn main() {',
      '    let c = Circle;',
      '    let x = c.area();',
      '    println!("{}", x);',
      '}',
    ].join('\n'))


    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack)
  }, 60_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
    if (root) await rm(root, { recursive: true, force: true })
  })

/** One-based helper mirroring the model contract; converted to zero-based positions here. */
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.rs'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 15, col 15 is the symbol under test in sample.rs.
    const result = await ctx.lsp.query(at('goToDefinition', 15, 15))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 2, col 8 is the symbol under test in sample.rs.
    const result = await ctx.lsp.query(at('findReferences', 2, 8))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async () => {

    // Line 2, col 8 is the symbol under test in sample.rs.
    const result = await ctx.lsp.query(at('goToImplementation', 2, 8))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `area` name (line 2, col 8).
```

</details>

#### 缺口

- 宏、跨crate依赖和工程规模下的导航适用范围与资源曲线未知。
  **影响**：不能承诺复杂工程的准确率和资源上限。
  **进一步探讨**：固定工具链与服务版本，按宏/跨crate/规模分组比较查询位置、索引时间和内存。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
