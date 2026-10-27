# dsh-lsp-go

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：以 gopls 为外部服务器的 Go LSP 配置包，复用 DSH 共享 LSP 基座。

> **核心亮点**：减少 Go LSP 装配；不实现协议，详见[Q01](#research-q01)。

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
  - [Q01 · Go 导航功能由配置包还是 gopls/共享基座提供？](#detail-section-11)
  - [Q02 · 缺服降级是否保留自定义扩展并准确区分故障？](#detail-section-12)
  - [Q03 · 在 Go 工程采用的条件和证据范围是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中对 .go 文件做定义、引用、实现和 hover 查询。

手工向共享 LSP 配置增加 gopls 与 .go 映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 条件 | 边界 |
| --- | --- | --- |
| .go LSP 路由 | gopls 与共享基座 | 本包只配置 |
| 缺服 fallback | 启动异常 | 宽 catch 误归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH LSP service/tool 与 fs/subprocess | 必需 | 模型查询及进程运行 | 薄包独立不可用 |
| gopls/Go 工具链 | Go 查询必需 | 语言分析与 module 索引 | 查询不可用或索引不足 |
| Go module | 真实项目查询时 | 提供依赖/工作区语义 | 单文件之外结果可能受限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员安装 gopls/Go 并配 DSH PATH | gopls 命令可解析 |
| 加载 | 管理员挂 LSP 基座与语言包 | provider 注册 |
| 任务 | 用户在真实 Go module 查询四操作 | 结果定位可复核 |
| 验收/恢复 | 管理员核缺服与索引资源 | 错误分类及工作区资源有记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装 gopls/Go 与共享 LSP 基座，现金/版本成本未知 | 设置 DSH PATH、fs/subprocess 并确认 Go module；耗时未知 | go install 后二进制常需加入 GOPATH/bin |
| 持续使用 | gopls 工作区进程、索引缓存与 CPU/内存；数值未知 | 维护版本、核跨包导航/符号结果；耗时未知 | 大型 module 资源未知 |
| 失败恢复 | 重启 gopls/清理缓存可能增加 CPU/时间；金额未知 | 排查命令/配置与 fallback 误归因；耗时未知 | 真实服务 lane 缺 binary 时跳过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Go 扩展路由 | Q01 源码证实 .go→go | 真实导航准确率 |
| 缺服 fallback | Q02 源码证实结构化错误 | 非缺服错误误归因影响 |
| 四项查询 | Q03 仅测试设计 | 真实 module 结果 |

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少 Go LSP 装配；不实现协议，详见[Q01](#research-q01)。

减少 Go LSP 装配；不实现协议，详见[Q01](#research-q01)。

配置覆盖合并；通过 LspStdio 启动；异常 fallback 用 LSP_UNAVAILABLE。

<a id="detail-section-5"></a>

### 1.4 主要限制

宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先安装/验证 gopls，挂共享基座，再以真实 go.mod 项目试定义、引用、实现、hover；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态源码支持配置与降级设计；实际 gopls 运行和性能未验证。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-go/README.md、dsh-lsp-go/package.json、dsh-lsp-go/src/index.ts、dsh-lsp-go/tests/smoke.e2e.ts、dsh-lsp-go/cordis.yml 及固定范围 inventory；组件：dsh-lsp-go。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 dsh-lsp-go 子组件；未运行服务器或插件。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：分别测缺服/配置错误/自定义扩展 fallback，及真实 Go 工程索引。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在 fallback 保留合并扩展、区分配置/服务器异常可改善诊断；待验证。详见[Q02](#research-q02)。

分别测缺服/配置错误/自定义扩展 fallback，及真实 Go 工程索引。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 123 | — | — | 956 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 187 | 139 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T07%3A10%3A12.168Z..2026-10-22T07%3A10%3A12.168Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A10%3A12.168Z..2026-10-22T07%3A10%3A12.168Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 Go gopls 薄配置包的装配边界、降级路径及测试前提。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Go 导航功能由配置包还是 gopls/共享基座提供？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

本包注册 go provider，.go→go，默认运行外部 gopls（无参数）。实际协议、lsp 模型工具的定义/引用/实现/hover 来自共享基座及 gopls，本包只封装装配配置；不会安装 gopls。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-go/README.md:3-24](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/README.md#L3-L24)

声明薄配置包、gopls 外部安装。

<details>
<summary>查看原文（22行）</summary>

````text
> Go language configuration pack for DeepSeek Harness (DSH). gopls — the official Go language server.
> 中文：DSH 的 Go LSP「即插即用」语言包 —— 装上本包，.go 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Go. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

```bash
go install golang.org/x/tools/gopls@latest
# distro:  brew install gopls   |   apt install gopls   |   choco install gopls
```

`gopls` lands in `$(go env GOPATH)/bin`; make sure that directory (or `~/go/bin`) is on `PATH`.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-go/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/src/index.ts#L28-L46)

provider、注入依赖、默认命令与单扩展表。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-go'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'go'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'gopls'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".go": "go"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-go/src/index.ts:152-160](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/src/index.ts#L152-L160)

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

- 真实Go module中的导航正确性与初次索引负担缺少对照。
  **影响**：不能由gopls启动参数推断结果质量。
  **进一步探讨**：以带已知跨包位置的Go module对照四项导航与索引资源。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺服降级是否保留自定义扩展并准确区分故障？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

resolveServerConfig 合并用户扩展与命令等覆盖。apply 的 catch 包括 LspStdio.Config 与 apply 故障；catch 中统一警告 gopls unavailable，并以 DEFAULT_EXTENSION_TO_LANGUAGE 创建 fallback。由此配置/注册问题也可能被归为缺服，而且用户自定义扩展在 fallback 中失去路由。另一方面 resolveServerConfig 在 try 外，若此处抛错仍可能中断加载，与注释的绝不崩溃说法有边界。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-go/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/src/index.ts#L103-L118)

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

**依据 2 · 源码核查**：[dsh-lsp-go/src/index.ts:120-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/src/index.ts#L120-L169)

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

**依据 3 · 作者声明**：[dsh-lsp-go/README.md:30-54](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/README.md#L30-L54)

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
- id: lsp-go
  name: '@dsh-lsp-packs/dsh-lsp-go'
  config:
    command: /absolute/path/to/gopls
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

#### 缺口

- 未构造配置错误或额外扩展故障
  **影响**：用户可见错误类型待验证
  **进一步探讨**：隔离测试命令缺失、非法配置、.xyz 路由

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 在 Go 工程采用的条件和证据范围是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断、新假设与验证

#### 完整回答

需先挂共享 LSP service/tool 与本地 fs/subprocess，并将 gopls 放入 DSH 的 PATH；README 指出 go install 后常在 GOPATH/bin。测试源码有离线默认/缺服 lane，真实 gopls lane 在 binary 不可用时 skip，构造 go.mod 与 interface 实现测试四操作。这里仅检查测试设计，没有运行测试；建议先试真实 module、工作区缓存与首次索引，再决定持续使用。

成本分期：首次使用涉及安装 gopls/Go 与共享 LSP 基座，现金/版本成本未知，人工需设置 DSH PATH、fs/subprocess 并确认 Go module；耗时未知；持续使用涉及gopls 工作区进程、索引缓存与 CPU/内存；数值未知，人工需维护版本、核跨包导航/符号结果；耗时未知；失败恢复涉及重启 gopls/清理缓存可能增加 CPU/时间；金额未知，人工需排查命令/配置与 fallback 误归因；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 显示宽 catch 将 Config/apply 异常写成 gopls unavailable，fallback 丢自定义扩展；相对当前默认 .go 降级，按错误类别分类并沿用合并扩展表，可能保留路由与故障可辨性。条件是基座错误可分类，额外维护兼容映射。最小证伪：构造缺 gopls、非法配置、.xyz 自定义映射和注册错误，检查每类消息/查询；若非缺服仍报缺服或 .xyz 无路由，假设失败。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-go/README.md:13-24](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/README.md#L13-L24)

gopls 安装路径与外部依赖。

<details>
<summary>查看原文（12行）</summary>

````text
## Installing the language server

```bash
go install golang.org/x/tools/gopls@latest
# distro:  brew install gopls   |   apt install gopls   |   choco install gopls
```

`gopls` lands in `$(go env GOPATH)/bin`; make sure that directory (or `~/go/bin`) is on `PATH`.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 作者声明**：[dsh-lsp-go/README.md:56-92](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/README.md#L56-L92)

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-go    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-go  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-go
      name: '@dsh-lsp-packs/dsh-lsp-go'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-go   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.go`;
  it **auto-skips** when `gopls` is not on PATH.

A `go.mod` keeps gopls happy; the `shape` interface gives `goToImplementation` a real `circle` implementation target (gopls serves implementation per interface), and `findReferences` includes the declaration (the seam guarantees it).

## License

MIT — see `LICENSE`. The server binary is a third-party component with its own license.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-go/tests/smoke.e2e.ts:24-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/tests/smoke.e2e.ts#L24-L41)

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

const installed = probeServer('gopls')
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-go/tests/smoke.e2e.ts:100-180](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-go/tests/smoke.e2e.ts#L100-L180)

Go module 测试与四操作。

<details>
<summary>查看原文（81行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-go real server (gopls)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-go-')))
    ws = join(root, 'proj')
    await mkdir(ws)
    await writeFile(join(ws, "go.mod"), "module sample\n\ngo 1.21\n")
    await writeFile(join(ws, 'sample.go'), [
      'package main',
      '',
      'type shape interface {',
      '	area() int',
      '}',
      '',
      'type circle struct{}',
      '',
      'func (circle) area() int {',
      '	return 42',
      '}',
      '',
      'func main() {',
      '	var s shape = circle{}',
      '	x := s.area()',
      '	_ = x',
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
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.go'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 14, col 9 is the symbol under test in sample.go.
    const result = await ctx.lsp.query(at('goToDefinition', 14, 9))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 4, col 2 is the symbol under test in sample.go.
    const result = await ctx.lsp.query(at('findReferences', 4, 2))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async () => {

    // Line 4, col 2 is the symbol under test in sample.go.
    const result = await ctx.lsp.query(at('goToImplementation', 4, 2))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `area` name (line 4, col 2).
```

</details>

#### 缺口

- 大型Go工程的持续资源与查询正确率未知。
  **影响**：不能承诺低资源或固定响应时间。
  **进一步探讨**：分开量测初次索引和重复查询的时间、内存与位置准确率。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
