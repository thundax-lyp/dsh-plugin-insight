# dsh-lsp-ruby

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为 DSH 的 .rb 文件预设 ruby-lsp 路由和语言服务配置。

> **核心亮点**：把 Ruby LSP 默认命令、参数和扩展映射做成独立可覆盖的 DSH 组合包，节省重复接线；语义分析与协议仍归 ruby-lsp 和官方底座。详见[Q02](#research-q02)。

> **风险与缺陷**：默认全局 ruby-lsp 未自动匹配项目 Bundler 或 rbenv/asdf 选中的解释器；catch 折叠加载异常，测试的 real-server lane 可能跳过。单文件成功不能证明项目导航。详见[Q03](#research-q03)。

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
  - [Q01 · 哪些 Ruby 用户有 DSH 导航需求，合格结果是什么？](#detail-section-11)
  - [Q02 · Ruby 路由怎样注册，技术贡献与可复用边界是什么？](#detail-section-12)
  - [Q03 · Ruby 环境如何影响启动与结果，代价在哪里？](#detail-section-13)
  - [Q04 · 谁应先试用，怎样证伪环境匹配提示的价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 Ruby/Bundler 项目的 DSH 开发者可查询 .rb 符号；合格结果需目标解释器与项目依赖一致并核对跨文件位置。

替代是 IDE Ruby LSP 或手工把 ruby-lsp --stdio 接入 DSH 官方底座；本包没有新协议或项目依赖管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Ruby provider | 将 .rb 请求路由到 ruby-lsp | 当前 Ruby 环境和项目依赖需匹配 |
| 命令与资源配置 | 覆盖启动参数、环境和上限 | args 替换默认 --stdio，需自行保留正确模式 |
| 不可用占位 | 加载错误时返回 LSP_UNAVAILABLE | 无细分环境错配，失败时覆盖扩展表可能丢失 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18、声明 DSH/Cordis 范围 | 包声明必需 | 加载配置包 | 范围外兼容未知 |
| fs/lsp/subprocess 与官方底座 | 注入必需 | 路由与进程 | Ruby 查询无法完成 |
| 当前 Ruby 环境中的 ruby-lsp gem | 查询必需 | 语言服务 | 缺命令或错 Ruby 可能不可用 |
| Bundler/Gemfile 与项目依赖 | 项目导航通常需要 | 解析跨文件符号 | 单文件 smoke 不代表项目结果 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定 Ruby 环境并安装 ruby-lsp | 命令来自目标解释器/项目 |
| 配置 | 用户装共享底座和语言包，必要时改 command/args | .rb 路由存在，参数与 Bundler 策略一致 |
| 查询 | DSH 对固定项目运行四项 LSP 查询 | 核对跨文件位置，不以单文件成功外推 |
| 恢复 | 用户排查 PATH、Ruby 版本、Gemfile 和日志 | 不把所有 unavailable 都当缺 gem |
| 退出 | 停用语言包并保留项目自身依赖管理 | 避免影响其他 Ruby 工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Ruby、gem、底座与项目资源；金额未知 | 选择全局或 Bundler 安装并核对解释器 | 安装与首次查询耗时未知 |
| 持续使用 | ruby-lsp 进程和项目索引资源；实测未知 | Ruby/Gemfile 升级后复核路径与结果 | 多版本维护成本未知 |
| 失败恢复 | 重启/重装可能消耗资源；金额未知 | 排查 PATH、rbenv/asdf、Gemfile 和启动参数 | 错配率与恢复工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Ruby 路由 | 默认 ruby-lsp --stdio 与 .rb→ruby | 项目跨文件导航的正确性 |
| 配置复用 | 独立薄包接共享 LSP 底座 | 相比手工配置的净节时 |
| 不可用占位 | 加载失败返回结构化错误 | 是否准确区分环境错配 |

源码与作者测试说明不能代表本轮实际运行效果。

> **思考**：默认全局 ruby-lsp 未自动匹配项目 Bundler 或 rbenv/asdf 选中的解释器；catch 折叠加载异常，测试的 real-server lane 可能跳过。单文件成功不能证明项目导航。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 Ruby LSP 默认命令、参数和扩展映射做成独立可覆盖的 DSH 组合包，节省重复接线；语义分析与协议仍归 ruby-lsp 和官方底座。详见[Q02](#research-q02)。

把 Ruby LSP 默认命令、参数和扩展映射做成独立可覆盖的 DSH 组合包，节省重复接线；语义分析与协议仍归 ruby-lsp 和官方底座。详见[Q02](#research-q02)。

入口为薄配置，默认和覆盖值集中并委托官方底座；失败时仍注册 provider 是可复用的降级结构。其 catch 将多种异常统一解释成 unavailable，fallback 丢用户覆盖扩展，项目 Bundler 选择未自动处理；这些是诊断与路由边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认全局 ruby-lsp 未自动匹配项目 Bundler 或 rbenv/asdf 选中的解释器；catch 折叠加载异常，测试的 real-server lane 可能跳过。单文件成功不能证明项目导航。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先选定解释器与 Gemfile，明确全局或 bundle 启动，再对真实项目的跨文件查询试用；不把单文件 smoke 外推。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持 Ruby 路由配置与故障占位；真实 Bundler 项目导航未执行；环境匹配提示是未实现假设。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-ruby/README.md、dsh-lsp-ruby/package.json、dsh-lsp-ruby/src/index.ts、dsh-lsp-ruby/tests/smoke.e2e.ts 及固定范围 inventory；组件：dsh-lsp-ruby。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交 Ruby 子目录 README、package、入口和测试意图，inventory 不含全仓其他包；未执行目标代码、语言服务或测试。
- 下一步：进一步探讨用两个 Ruby 版本、锁定 Gemfile 和单文件样本对照启动、四项导航与恢复时间；本轮未执行。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在启动前报告 Ruby、Gemfile、命令来源与参数的一致性，比较两版本锁定项目中的误报、归因与恢复分钟；未实现。详见[Q04](#research-q04)。

进一步探讨用两个 Ruby 版本、锁定 Gemfile 和单文件样本对照启动、四项导航与恢复时间；本轮未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 124 | — | — | 960 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 175 | 126 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T05%3A13%3A14.887Z..2026-10-22T05%3A13%3A14.887Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A13%3A14.887Z..2026-10-22T05%3A13%3A14.887Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 Ruby 配置包的接线增量、环境错配风险和试用价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些 Ruby 用户有 DSH 导航需求，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

适用对象是已在 DSH 中阅读 Ruby 项目、希望对 .rb 文件查询定义、引用、实现或悬停信息的开发者。合格结果应在真实 Bundler 项目中定位跨文件符号，确认目标与当前 Gemfile、Ruby 版本一致。README 的单文件 smoke 只能说明较窄样本；无 Bundler 时作者也承认服务降级。替代方案是 IDE 内现有 Ruby LSP，或自行给 DSH 官方 LSP 底座写 ruby-lsp 命令与扩展映射。本包针对手工接线提供预置，不解决 Ruby 项目本身的依赖管理。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-ruby/README.md:3-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L3-L11)

作者定义四项 LSP 操作与共享底座。

```text
> Ruby language configuration pack for DeepSeek Harness (DSH). ruby-lsp — the official Shopify Ruby language server.
> 中文：DSH 的 Ruby LSP「即插即用」语言包 —— 装上本包，.rb 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Ruby. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

**依据 2 · 作者声明**：[dsh-lsp-ruby/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L13-L25)

gem、Bundler 和当前 Ruby 环境是不同安装条件。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
gem install ruby-lsp
# inside a project: bundle add ruby-lsp   and run `bundle exec ruby-lsp --stdio`
# rbenv / asdf: install the ruby-lsp gem into the active Ruby (do NOT rely on a global gem)
```

`ruby-lsp` must be on `PATH`. Best results in a Bundler project (the server reads the Gemfile); single-file smoke queries run without one.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 3 · 作者声明**：[dsh-lsp-ruby/README.md:78-89](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L78-L89)

单文件 smoke 与无 Bundler 降级的作者说明。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-ruby   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.rb`;
  it **auto-skips** when `ruby-lsp` is not on PATH.

ruby-lsp without a Bundler project runs in a degraded mode; same-file symbols still resolve.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Ruby 路由怎样注册，技术贡献与可复用边界是什么？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

入口注入 fs、lsp、subprocess，默认 provider ruby、命令 ruby-lsp、参数 --stdio、扩展 .rb→ruby；用户可覆写命令、参数、环境和资源上限。resolveServerConfig 合成配置后交给官方 LspStdio.Config/apply，本包没有实现协议、索引或模型工具。薄配置包的贡献是给 Ruby 一个独立、可组合的默认接线，以及加载异常时保留 unavailable provider。相对手写同一行配置，降低重复；相对 Ruby LSP 自身不增加符号算法。工程局限是 catch 包住全部 apply 异常并统一说 unavailable，且占位 provider 用默认扩展表，失败时自定义扩展可能无法收到清晰错误。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ruby/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L28-L46)

Ruby provider、默认命令和 --stdio 参数。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-ruby'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'ruby'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'ruby-lsp'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".rb": "ruby"
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-ruby/src/index.ts:102-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L102-L118)

覆盖项合成与 stdio 配置交接。

<details>
<summary>查看原文（17行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-ruby/src/index.ts:120-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L120-L170)

失败占位及异常处理范围。

<details>
<summary>查看原文（51行）</summary>

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
  }
```

</details>

**依据 4 · 作者声明**：[dsh-lsp-ruby/README.md:6-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L6-L11)

作者承认协议由共享底座实现。

```text
This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Ruby. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Ruby 环境如何影响启动与结果，代价在哪里？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

包声明 Node>=22.18、DSH alpha 范围和多项底座 peer；实际查询还需 ruby-lsp gem 处在当前 Ruby 解释器的 PATH 上。项目若用 Bundler，默认直接启动 ruby-lsp 未自动变成 bundle exec ruby-lsp --stdio，用户需显式覆盖 command/args 或执行环境；rbenv/asdf 切换可能让全局命令指向不符合 Gemfile 的版本。命令可解析、进程可启动、项目依赖正确、LSP 初始化和跨文件导航正确是不同条件。首次需装 gem 并选全局或项目级启动，持续升级 Ruby/Gemfile 后要复核；失败恢复需比对 Ruby、Gemfile、PATH、命令和错误。现金、启动等待、内存和恢复工时没有本轮实测。测试文件的 real-server lane 会在 ruby-lsp 不可用时跳过，因此总测试通过不能证明项目模式。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ruby/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/package.json#L41-L78)

宿主版本与 peer 声明。

<details>
<summary>查看原文（38行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "compatibility": {
      "node": ">=22.18.0",
      "dsh": ">=0.1.2-alpha.3 <0.2.0-0"
    },
    "permissions": {
      "summary": "Ruby language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "ruby-lsp --stdio (fixed argv, no shell)"
      ],
      "writePaths": [],
      "externalServices": [],
      "failureBoundaries": [
        "missing language server -> structured LSP_UNAVAILABLE error; the rest of the session remains available",
        "language-server startup and message limits are bounded by the shared stdio host"
      ],
      "lifecycleEvidence": [
        "offline defaults and missing-server fallback smoke lanes",
        "package build and repository-wide structural verification"
      ]
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "3.18.2"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.2 <5.0.0-0",
    "@deepseek-ai/dsh-brand": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-fs": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-invariants": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-lsp": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-lsp-stdio": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-subprocess": ">=0.1.2-alpha.3 <0.2.0-0",
    "@deepseek-ai/dsh-timeout": ">=0.1.2-alpha.3 <0.2.0-0"
```

</details>

**依据 2 · 作者声明**：[dsh-lsp-ruby/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L13-L25)

gem 安装、Bundler 和版本管理器条件。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
gem install ruby-lsp
# inside a project: bundle add ruby-lsp   and run `bundle exec ruby-lsp --stdio`
# rbenv / asdf: install the ruby-lsp gem into the active Ruby (do NOT rely on a global gem)
```

`ruby-lsp` must be on `PATH`. Best results in a Bundler project (the server reads the Gemfile); single-file smoke queries run without one.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-ruby/src/index.ts:152-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L152-L170)

加载异常统一交 unavailable fallback。

<details>
<summary>查看原文（19行）</summary>

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
  } catch (error) {
    const reason = failureMessage(error)
    console.warn('[' + name + '] ' + DEFAULT_COMMAND + ' unavailable at load: ' + reason)
    ctx.effect(() => {
      const dispose = ctx.lsp.registerProvider(
        new UnavailableProvider(DEFAULT_EXTENSION_TO_LANGUAGE, reason),
      )
      return () => dispose()
    }, name + '.unavailableFallback')
  }
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-ruby/tests/smoke.e2e.ts:24-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/tests/smoke.e2e.ts#L24-L41)

真实 server lane 取决于本机探测，不是本轮执行证据。

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

const installed = probeServer('ruby-lsp')
```

</details>

#### 缺口

- 没有两个 Ruby 版本及锁定 Gemfile 项目的实测对照。
  **影响**：无法知道默认命令错配率、跨文件导航正确性和恢复成本。
  **进一步探讨**：在两种 Ruby 环境分别核对命令路径、Bundler 加载与跨文件符号结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁应先试用，怎样证伪环境匹配提示的价值？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有 Ruby/Bundler 项目、主要在 DSH 阅读代码的用户可以先试用；应选定当前 Ruby 解释器，明确使用全局 gem 还是项目 Gemfile 的 ruby-lsp，并对跨文件定义和引用核对结果。若已用 IDE 满足任务，或只能以不确定的全局 gem 查询项目，新增语言进程和环境维护负担可能超过接线便利。当前建议试用，不把测试脚本和 README 的即插即用当宿主验收。可设计未验证的启动前匹配检查，显式报告 Ruby 解释器、Gemfile/lock、ruby-lsp 命令来源与启动参数，并在不匹配时建议 bundle exec 路径。用两 Ruby 版本、项目锁定依赖、单文件样本比较错误定位与恢复分钟；若提示不能减少错配或误报太多，则否定。此检查目前未实现，也不计入创新分。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-ruby/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/README.md#L13-L25)

Ruby gem 与 Bundler 启动选择。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
gem install ruby-lsp
# inside a project: bundle add ruby-lsp   and run `bundle exec ruby-lsp --stdio`
# rbenv / asdf: install the ruby-lsp gem into the active Ruby (do NOT rely on a global gem)
```

`ruby-lsp` must be on `PATH`. Best results in a Bundler project (the server reads the Gemfile); single-file smoke queries run without one.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-ruby/src/index.ts:102-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L102-L118)

当前只合成静态命令和参数，无环境匹配检查。

<details>
<summary>查看原文（17行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-ruby/src/index.ts:152-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/src/index.ts#L152-L170)

异常占位不是环境分类。

<details>
<summary>查看原文（19行）</summary>

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
  } catch (error) {
    const reason = failureMessage(error)
    console.warn('[' + name + '] ' + DEFAULT_COMMAND + ' unavailable at load: ' + reason)
    ctx.effect(() => {
      const dispose = ctx.lsp.registerProvider(
        new UnavailableProvider(DEFAULT_EXTENSION_TO_LANGUAGE, reason),
      )
      return () => dispose()
    }, name + '.unavailableFallback')
  }
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-ruby/tests/smoke.e2e.ts:1-10](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ruby/tests/smoke.e2e.ts#L1-L10)

三 lane 意图及 real-server 条件。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * dsh-lsp-ruby smoke e2e. Three lanes:
 *
 *  1. `pack defaults` — offline config assertions (always run).
 *  2. `missing server` — offline fallback assertion (always run): with an
 *     unresolvable command the pack still loads and queries fail with the
 *     structured LSP_UNAVAILABLE error, so other tools keep working.
 *  3. `real server` — the lsp tool’s four operations against a sample file;
 *     skipped automatically when the language server is not installed.
 */
```

</details>

#### 缺口

- 环境匹配提示尚未实现和比较。
  **影响**：不能称其为当前故障恢复能力。
  **进一步探讨**：以两版本与锁定 Gemfile 的故障样本比较误报、归因和恢复时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
