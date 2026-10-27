# dsh-lsp-pyright

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：Python/Python stub 的 Pyright LSP 配置包，委托 DSH 共享基座启动外部 pyright-langserver。

> **核心亮点**：减少 Python/Pyright LSP 命令与扩展配置工作；详见[Q01](#research-q01)。

> **风险与缺陷**：缺服 fallback 捕获所有初始化异常且仅保留默认映射，配置故障可误归因，自定义扩展在故障时失去路由。详见[Q02](#research-q02)。

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
  - [Q01 · Python 导航和类型分析从哪里来？](#detail-section-11)
  - [Q02 · 缺少服务器和自定义扩展时会发生什么？](#detail-section-12)
  - [Q03 · 测试和采用条件有哪些？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Agent 中查询 Python .py 与 .pyi 的定义、引用、实现和悬浮信息。

手工在共享 DSH LSP 配置表加入 Pyright 与双扩展路由。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Pyright 配置 | .py/.pyi 路由 | 需共享基座 |
| 缺服 fallback | 结构化错误 | 宽 catch 误归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH LSP service/tool 与 fs/subprocess | 必需 | 模型查询及服务器托管 | 薄包独立不可用 |
| pyright-langserver | Python 查询必需 | 语言分析 | 缺服时 LSP_UNAVAILABLE |
| Python venv/配置 | 项目精度相关 | 解释器/依赖解析 | 结果精度待核 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装 | 命令可执行 | PATH 可见 |
| 项目 | .py/.pyi 与 venv | 映射正确 |
| 查询 | 四项操作 | 结果可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 另装 Pyright、共享 LSP 基座；许可证/现金未知 | 确保 pyright-langserver 在 PATH、配置 Python 环境与双扩展路由；耗时未知 | npm/pip/pipx 安装形态待环境核 |
| 持续使用 | 每工作区 Pyright 索引/进程资源；量值未知 | 维护 venv/type 配置、核 .pyi 与跨文件结果；工时未知 | 真实项目准确度与资源未知 |
| 失败恢复 | 重启/重索引及诊断可能追加资源；现金未知 | 区分缺服、配置错误和自定义扩展路由消失；耗时未知 | 真实 lane 无 server 时跳过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 双扩展路由 | .py/.pyi | 跨文件正确性 |
| 结构化降级 | LSP_UNAVAILABLE | 配置错误分类 |
| 四项导航 | 基座提供 | 真实表现 |

> **思考**：缺服 fallback 捕获所有初始化异常且仅保留默认映射，配置故障可误归因，自定义扩展在故障时失去路由。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少 Python/Pyright LSP 命令与扩展配置工作；详见[Q01](#research-q01)。

减少 Python/Pyright LSP 命令与扩展配置工作；详见[Q01](#research-q01)。

配置包将默认命令/argv/扩展映射交给 LspStdio；错误时注册 unavailable provider。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺服 fallback 捕获所有初始化异常且仅保留默认映射，配置故障可误归因，自定义扩展在故障时失去路由。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认 pyright-langserver 在 DSH 执行环境 PATH，使用实际 .py/.pyi 与 venv 项目测试；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持双扩展映射及缺服 fallback；实际 Pyright/虚拟环境表现未测，catch-all 可能误报。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-pyright/README.md、dsh-lsp-pyright/package.json、dsh-lsp-pyright/src/index.ts、dsh-lsp-pyright/tests/smoke.e2e.ts、dsh-lsp-pyright/cordis.yml 及固定范围 inventory；组件：dsh-lsp-pyright。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 dsh-lsp-pyright 子组件和测试代码；未启动语言服务器。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：隔离测试无服务器/错误配置/自定义扩展 fallback，以及真实虚拟环境项目导航。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

保留解析后的扩展表并区分缺服/配置/注册异常，可提高诊断准确度；待验证。详见[Q02](#research-q02)。

隔离测试无服务器/错误配置/自定义扩展 fallback，以及真实虚拟环境项目导航。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 125 | — | — | 952 |
| .ts | source | 1 | 172 | 96 | 60 | — |
| .ts | test | 1 | 177 | 128 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T06%3A37%3A40.359Z..2026-10-22T06%3A37%3A40.359Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A37%3A40.359Z..2026-10-22T06%3A37%3A40.359Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Pyright 包的双扩展路由、语言服务器前提及 fallback 的配置保真度。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Python 导航和类型分析从哪里来？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

该子包把 .py 与 .pyi 都映射到 python language id，默认以 pyright-langserver --stdio 启动外部服务器。它只将配置交给 DSH LspStdio 注册 provider，LSP 协议及面向模型的四项 lsp 查询由共享基座提供；“静态类型检查”来自 Pyright 服务器，不是包内算法。包不自动下载 server，用户可用 npm、pip 或 pipx 安装并确保命令在 PATH。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-pyright/README.md:3-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/README.md#L3-L25)

作者说明配置包与外部 Pyright 安装。

<details>
<summary>查看原文（23行）</summary>

````text
> Pyright language configuration pack for DeepSeek Harness (DSH). Static type checking and code intelligence for Python files.
> 中文：DSH 的 Pyright LSP「即插即用」语言包 —— 装上本包，.py / .pyi 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Pyright. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server (three ways)

```bash
npm install -g pyright        # npm
pip install pyright           # pip
pipx install pyright          # pipx (isolated)
```

After install, `pyright-langserver` must be on `PATH` (npm/pipx put it there automatically).

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-pyright/src/index.ts:28-47](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/src/index.ts#L28-L47)

默认命令、provider 和双扩展表。

<details>
<summary>查看原文（20行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-pyright'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'pyright'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'pyright-langserver'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".py": "python",
    ".pyi": "python"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-pyright/src/index.ts:153-161](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/src/index.ts#L153-L161)

委托 LspStdio apply。

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

- .py/.pyi及不同环境配置下四项导航和类型信息的实际适用范围缺少对照。
  **影响**：不能从Pyright注册推断所有项目的导航或诊断能力。
  **进一步探讨**：用含.py/.pyi与已知定义位置的项目区分导航结果和类型诊断。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺少服务器和自定义扩展时会发生什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

包的 fallback 设计使启动阶段无法解析服务器时 profile 仍可加载，受默认扩展匹配的查询返回 LSP_UNAVAILABLE。但 apply 用一个 catch 捕获 Config 和 apply 全部异常，配置错误与服务注册异常也可能被描述为服务器不可用；fallback 又只注册 DEFAULT_EXTENSION_TO_LANGUAGE，虽然正常 resolveServerConfig 会合并用户自定义扩展，故故障时自定义扩展路由消失。README 对缺服情形的说明成立于特定错误，并不能涵盖所有 catch 路径。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-pyright/README.md:32-56](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/README.md#L32-L56)

作者描述 lazy start/fallback/覆盖。

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
- id: lsp-pyright
  name: '@dsh-lsp-packs/dsh-lsp-pyright'
  config:
    command: /absolute/path/to/pyright-langserver
    args:
      - --stdio
    extensionToLanguage:
      '.xyz': custom-language-id
    maxDocumentBytes: 8000000
```

All fields of the `servers` table documented in the `@deepseek-ai/dsh-lsp-stdio` README are
accepted (`command`, `args`, `env`, `extensionToLanguage`, `initializationOptions`,
`configuration`, byte/time bounds).
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-pyright/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/src/index.ts#L103-L118)

配置覆盖合并。

<details>
<summary>查看原文（16行）</summary>

```text
/** Merge the pack defaults with the user overrides into one stdio server entry. */
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
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-pyright/src/index.ts:121-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/src/index.ts#L121-L169)

宽捕获与默认映射 fallback。

<details>
<summary>查看原文（49行）</summary>

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
```

</details>

#### 缺口

- 未在宿主构造配置失败或自定义扩展查询。
  **影响**：错误分类和路由丢失的用户可见症状待验证。
  **进一步探讨**：以无 server、非法配置和 .xyz 自定义扩展隔离加载对比。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 测试和采用条件有哪些？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

仓库含离线默认值与缺服 fallback lane、以及需要实际 pyright-langserver 的四操作 smoke lane；真实 lane 在命令不在 PATH 时自动 skip。因此测试源码证明作者设计了验证路径，本轮未运行不能宣称功能通过。该包适合已有 DSH LSP base、Python 项目且愿意安装 Pyright 的用户；Pyright 的解释器/虚拟环境选择、类型检查配置和大型项目索引会影响结果与资源，均不由这个薄包证明。建议在实际虚拟环境中先测定义/引用和 .pyi 路由，再测初次索引时间。

成本分期：首次使用涉及另装 Pyright、共享 LSP 基座；许可证/现金未知，人工需确保 pyright-langserver 在 PATH、配置 Python 环境与双扩展路由；耗时未知；持续使用涉及每工作区 Pyright 索引/进程资源；量值未知，人工需维护 venv/type 配置、核 .pyi 与跨文件结果；工时未知；失败恢复涉及重启/重索引及诊断可能追加资源；现金未知，人工需区分缺服、配置错误和自定义扩展路由消失；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 正常配置合并 .py/.pyi 与自定义扩展，但异常 fallback 只保默认映射并统称 Pyright 不可用；若按错误类型区分且沿用已解析映射，可减少误诊并让自定义扩展获得结构化错误。代价是基座错误分类与配置迁移。最小证伪：隔离测试缺 pyright-langserver、非法配置、.xyz 扩展及注册失败；若非缺服仍被标缺服或自定义查询失路由，假设失败。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-pyright/README.md:58-90](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/README.md#L58-L90)

基座挂载与三条测试 lane。

<details>
<summary>查看原文（33行）</summary>

````text
## Mounting

1. Mount the shared base **once** (the `lsp` service, the `lsp` tool, and a
   filesystem/subprocess pair for the same execution world) — ready-made snippet in
   `examples/base-composition.cordis.yml` of the dsh-lsp-packs repo.
2. Install the pack (its `cordis.yml` is the `dsh.bundle.patch`, so the row inserts
   itself):

```bash
dsh plugin add @dsh-lsp-packs/dsh-lsp-pyright    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-pyright  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-pyright
      name: '@dsh-lsp-packs/dsh-lsp-pyright'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-pyright   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.py`;
  it **auto-skips** when `pyright-langserver` is not on PATH.

Pyright answers every query entirely within the opened document, so the smoke test needs no project scaffolding. The hover lane asserts the docstring (`Add two numbers`).
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-pyright/tests/smoke.e2e.ts:24-56](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/tests/smoke.e2e.ts#L24-L56)

探测 pyright-langserver 与默认值测试。

<details>
<summary>查看原文（33行）</summary>

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

const installed = probeServer('pyright-langserver')

const prebuild = null
// `built` flips in beforeAll when a pack declares a prebuild (e.g. `swift build`);
// build-dependent operations skip when it fails.
let built = prebuild === null

// Lane 1: pack defaults ------------------------------------------------
describe('dsh-lsp-pyright pack defaults', () => {
  it('declares the README-default command, args, provider id, and extension table', () => {
    expect(Pack.name).toBe('lsp-pyright')
    expect(Pack.PROVIDER_ID).toBe('pyright')
    expect(Pack.inject).toEqual(['fs', 'lsp', 'subprocess'])
    expect(Pack.DEFAULT_COMMAND).toBe('pyright-langserver')
    expect([...Pack.DEFAULT_ARGS]).toEqual(["--stdio"])
    expect({ ...Pack.DEFAULT_EXTENSION_TO_LANGUAGE }).toEqual({".py":"python",".pyi":"python"})
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-pyright/tests/smoke.e2e.ts:100-150](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-pyright/tests/smoke.e2e.ts#L100-L150)

真实服务器 lane 的条件。

<details>
<summary>查看原文（51行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-pyright real server (pyright-langserver)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-pyright-')))
    ws = join(root, 'proj')
    await mkdir(ws)

    await writeFile(join(ws, 'sample.py'), [
      'def add(a: int, b: int) -> int:',
      '    """Add two numbers."""',
      '    return a + b',
      '',
      '',
      'result = add(1, 2)',
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
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.py'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 6, col 10 is the symbol under test in sample.py.
    const result = await ctx.lsp.query(at('goToDefinition', 6, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 1, col 5 is the symbol under test in sample.py.
```

</details>

#### 缺口

- venv和pyrightconfig差异、项目规模对资源与查询质量的影响未知。
  **影响**：无法给出跨环境兼容与性能上限。
  **进一步探讨**：固定配置与服务版本，分层比较索引资源和查询结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
