# dsh-lsp-swift

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为 DSH 接入 Swift 的 sourcekit-lsp，配置 .swift 文件导航所需的服务器命令和语言映射。

> **核心亮点**：相对手工接入 SourceKit-LSP，本包提供 DSH 中的命令、映射与组合行，减少配置重复；Swift 编译索引和 LSP 语义不属于本包实现。详见[Q01](#research-q01)。

> **风险与缺陷**：SourceKit 可启动不代表引用和实现可用：作者测试在 swift build 失败时跳过这两项，PATH 选错工具链也可能影响索引；不能按定义/hover 成功推断四操作完成。详见[Q03](#research-q03)。

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
  - [Q01 · 对已有 Swift 工程的开发者，本包相对既有工具提供什么？](#detail-section-11)
  - [Q02 · provider 怎样注册，异常时怎样影响 Swift 查询？](#detail-section-12)
  - [Q03 · SourceKit 可启动为何仍不能证明四类导航都可用？](#detail-section-13)
  - [Q04 · 首次使用、持续索引和失败恢复需要哪些外部条件？](#detail-section-14)
  - [Q05 · 什么工程取舍可借鉴，并可推导怎样的未验证改进？](#detail-section-15)
  - [Q06 · 现有证据支撑何种采用结论？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 SwiftPM 项目、Xcode 或 Swift 工具链的 DSH 开发者，可借本包少写 SourceKit 接线；项目索引仍由工具链承担。详见[Q01](#research-q01)。

Xcode/Swift 工具链可直接提供 SourceKit-LSP，或人工组合 DSH 官方 stdio 底座。本包只减少 Swift 默认项接线，不替代 SwiftPM build 和索引。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Swift provider 配置 | 将 .swift 查询导向共享 LSP | 需兼容底座与 SourceKit；结果未实测 |
| 服务器参数覆盖 | 指定二进制、环境和资源边界 | 实际由共享 stdio 底座执行 |
| 不可用回退 | apply 异常时保留默认 .swift 不可用响应 | catch 过宽且自定义扩展映射未带入回退 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH/Node 与共享 LSP 基座 | 必需 | lsp、fs、subprocess 与模型工具 | provider 不能正常接入 |
| Xcode/Swift 工具链中的 sourcekit-lsp | 查询必需 | 外部语义服务 | 不可解析时可能回退；错误分类待核 |
| SwiftPM 项目构建与索引 | 引用/实现尤其重要 | 符号索引 | 作者测试会 skip 两项，运行效果未知 |
| npm 包或本地路径 | 安装必需其一 | 取得组件 | 前次 npm 404，需复核当下状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者固定 Swift 工具链和兼容宿主 | sourcekit-lsp 与项目工具链一致 |
| 组合 | 部署者先挂共享底座，再插入本包 | Swift provider 注册 |
| 构建 | 开发者构建小 SwiftPM 项目 | 索引产物就绪；失败不算全能力可用 |
| 验收 | 分别测定义、悬停、引用、实现 | 四操作各有正确结果并记录失败恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Swift/Xcode 工具链、宿主和构建资源；金额未知 | 核版本、PATH、SwiftPM 构建和四操作；耗时未知 | 包可取得性仍待查 |
| 持续使用 | build/索引的 CPU、磁盘和时间；数值未知 | 升级工具链、复核查询；频率未知 | 不能以 server 启动替代索引验收 |
| 失败恢复 | 重新构建/索引资源；金额未知 | 区分可执行、构建与索引故障；耗时未知 | 回退 catch 不能直接判根因 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| .swift 路由 | 默认映射到 swift provider | 目标项目查询正确率 |
| 引用和实现 | 测试源码要求 build 后才执行 | 用户工程索引就绪率及等待时间 |
| 简化配置 | 语言默认项和组合行已封装 | 相对 IDE/手工配置的总负担 |

> **思考**：SourceKit 可启动不代表引用和实现可用：作者测试在 swift build 失败时跳过这两项，PATH 选错工具链也可能影响索引；不能按定义/hover 成功推断四操作完成。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工接入 SourceKit-LSP，本包提供 DSH 中的命令、映射与组合行，减少配置重复；Swift 编译索引和 LSP 语义不属于本包实现。详见[Q01](#research-q01)。

相对手工接入 SourceKit-LSP，本包提供 DSH 中的命令、映射与组合行，减少配置重复；Swift 编译索引和 LSP 语义不属于本包实现。详见[Q01](#research-q01)。

薄配置层复用共享底座，测试将预构建失败显式转成 skip；但运行期没有索引状态接线，广泛 catch 与默认映射回退还会模糊异常。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

SourceKit 可启动不代表引用和实现可用：作者测试在 swift build 失败时跳过这两项，PATH 选错工具链也可能影响索引；不能按定义/hover 成功推断四操作完成。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先核包与工具链来源，在小 SwiftPM 工程构建后分别验四操作；失败构建时只记部分可用。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Swift 配置和回退可由固定源码核对；引用/实现依赖构建索引的测试条件明确。真实项目四操作和宿主效果未运行。分层索引状态是假设，未实现。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-lsp-swift/README.md、dsh-lsp-swift/package.json、dsh-lsp-swift/cordis.yml、dsh-lsp-swift/src/index.ts、dsh-lsp-swift/tests/smoke.e2e.ts 及固定范围 inventory；组件：dsh-lsp-swift。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查固定提交的 Swift 子组件 README、package、cordis、入口和 smoke 测试源码；未执行构建、server、插件或真实宿主。复用前次 META，不当作本轮采集；不把共享底座和 SourceKit 算入本包代码。
- 下一步：在固定宿主与工具链上比较成功构建、失败构建和多个 Swift 工具链，逐一记录四操作、索引就绪、首次可用时间、错误提示和人工恢复；同时复核实际包取得方式。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是分开展示服务器启动、项目构建、索引就绪和各操作可用状态；用构建成败及双工具链场景比较误报和排障成本。详见[Q05](#research-q05)。

在固定宿主与工具链上比较成功构建、失败构建和多个 Swift 工具链，逐一记录四操作、索引就绪、首次可用时间、错误提示和人工恢复；同时复核实际包取得方式。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 124 | — | — | 967 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 194 | 146 | 28 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Swift LSP 配置包怎样接入 DSH 的 Swift 导航，构建索引和工具链选择怎样限制实际交付？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对已有 Swift 工程的开发者，本包相对既有工具提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对象是已在 DSH 处理 SwiftPM 项目、希望模型侧 lsp 查询 Swift 符号的开发者。合格结果至少要在同一项目对定义、引用、实现和悬停给出对应符号，不能只看到 provider 注册。Xcode/Swift 工具链本身已有 SourceKit-LSP，手工组合官方 DSH LSP 底座也是替代。此包把 sourcekit-lsp 命令、空参数和 .swift 映射包装成 Cordis 配置行，从而减少语言特定接线；解析、编译索引、进程托管和模型工具仍由 SourceKit/SwiftPM 及共享底座承担。README 的即插即用措辞隐含工具链和索引条件，不能作为实际四操作已通过的证据。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-swift/README.md:3-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md#L3-L25)

作者给出语言包用途、共享底座和 SourceKit 前提。

<details>
<summary>查看原文（23行）</summary>

````text
> Swift language configuration pack for DeepSeek Harness (DSH). sourcekit-lsp — the Swift language server shipping with the toolchain.
> 中文：DSH 的 Swift LSP「即插即用」语言包 —— 装上本包，.swift 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Swift. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

`sourcekit-lsp` ships with Xcode and with the Swift.org toolchains, for example:

```text
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/sourcekit-lsp
```

Add that directory to `PATH` (or run `xcrun --find sourcekit-lsp` to locate it). No separate install step exists for Xcode users.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-swift/src/index.ts:28-45](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts#L28-L45)

默认 provider、命令、参数及扩展仅是配置。

<details>
<summary>查看原文（18行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-swift'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'swift'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'sourcekit-lsp'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".swift": "swift"
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-swift/cordis.yml:3-14](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/cordis.yml#L3-L14)

补丁只插入 Swift 行，底座需另行组合。

<details>
<summary>查看原文（12行）</summary>

```text
# This file is the package’s `dsh.bundle.patch`: when the package is installed with
# `dsh plugin add @dsh-lsp-packs/dsh-lsp-swift` (or a local path to this directory), the row below is inserted into the profile
# composition. The shared LSP base (`@deepseek-ai/dsh-lsp` service + `@deepseek-ai/dsh-tool-lsp`
# tool + fs/subprocess for the same execution world) is composed ONCE by the deployment —
# every language pack reuses that base unchanged; see examples/base-composition.cordis.yml in
# the dsh-lsp-packs repository.
#
# The pack’s apply() assembles the configured `@deepseek-ai/dsh-lsp-stdio` instance for
# `ctx.lsp`, so adding a language never touches the base rows.
- insert:
    - id: lsp-swift
      name: '@dsh-lsp-packs/dsh-lsp-swift'
```

</details>

#### 缺口

- 没有目标 Swift 项目与 IDE/手工接线的同条件对照
  **影响**：不能量化减少配置时间或导航收益
  **进一步探讨**：在同一 SwiftPM 工程比较配置时长和四操作正确性

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · provider 怎样注册，异常时怎样影响 Swift 查询？

**研究主题**：功能与机制

#### 完整回答

组件要求 fs、lsp、subprocess 注入，resolveServerConfig 合并命令、参数、.swift 映射及可覆盖的环境/资源边界，交由官方 LspStdio.Config 补齐默认配置并调用 apply。若 apply 抛错，组件注册 UnavailableProvider，查询返回 LSP_UNAVAILABLE。真实进程何时懒启动、每工作区如何复用由共享底座决定，不是这 171 行组件独立实现。源码 catch 没有区分找不到 sourcekit-lsp、配置拒绝和 provider 注册错误，却统一记录 unavailable；回退还采用默认扩展表而非合并后的用户映射。自定义扩展和非服务器故障在错误态可能表现不同于用户配置预期。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-swift/src/index.ts:31-45](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts#L31-L45)

声明注入与 Swift 默认映射。

<details>
<summary>查看原文（15行）</summary>

```text
/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'swift'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'sourcekit-lsp'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".swift": "swift"
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-swift/src/index.ts:102-117](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts#L102-L117)

覆盖配置合并。

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

**依据 3 · 源码核查**：[dsh-lsp-swift/src/index.ts:120-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts#L120-L170)

广泛 catch 与默认映射回退。

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

#### 缺口

- 未核固定共享底座的真实启动、取消与错误传播
  **影响**：不能确认目标宿主中的进程复用、故障隔离和限制效果
  **进一步探讨**：固定共享底座版本，逐阶段注入缺命令、配置失败和 server 初始化错误

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · SourceKit 可启动为何仍不能证明四类导航都可用？

**研究主题**：缺陷与关键质疑

#### 完整回答

Swift 的引用和实现查询往往需要构建产生的索引。作者 smoke 源码先创建 SwiftPM 样例，再运行 swift build；若构建失败，引用与实现用 skip 返回，而定义和 hover 继续运行。因而看到服务器存在或两类查询成功，不能推断四操作都通过。默认 sourcekit-lsp 从 PATH 解析，而开发者机器可能同时有 Xcode 与另一 Swift 工具链；服务可启动但与项目编译环境不一致，仍可能产生不完整或误导性结果。插件本身没有自动为用户项目构建和验证 IndexStore。README 的示例路径与 xcrun 只帮助定位二进制，不证明用户项目完成索引。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-swift/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md#L13-L25)

外部 SourceKit 与工具链路径前提。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

`sourcekit-lsp` ships with Xcode and with the Swift.org toolchains, for example:

```text
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/sourcekit-lsp
```

Add that directory to `PATH` (or run `xcrun --find sourcekit-lsp` to locate it). No separate install step exists for Xcode users.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:100-136](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L100-L136)

测试为 SwiftPM 样例运行预构建并标记 built。

<details>
<summary>查看原文（37行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-swift real server (sourcekit-lsp)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-swift-')))
    ws = join(root, 'proj')
    await mkdir(ws)
    await writeFile(join(ws, "Package.swift"), "// swift-tools-version: 5.9\nimport PackageDescription\n\nlet package = Package(\n    name: \"sample\",\n    targets: [.target(name: \"sample\")]\n)\n")
    await mkdir(join(ws, "Sources/sample"), { recursive: true })
    await writeFile(join(ws, 'Sources/sample/sample.swift'), [
      'protocol Shape {',
      '    func area() -> Int',
      '}',
      '',
      'struct Circle: Shape {',
      '    func area() -> Int {',
      '        return 42',
      '    }',
      '}',
      '',
      'let c = Circle()',
      'let x = c.area()',
    ].join('\n'))

    // Some servers (sourcekit-lsp) index through a built IndexStore; compile
    // the sample package first and skip build-dependent operations on failure.
    if (prebuild !== null) {
      const build = spawnSync(prebuild.command, prebuild.args, {
        cwd: ws,
        timeout: prebuild.timeoutMs,
        shell: process.platform === 'win32',
      })
      built = build.status === 0
      if (!built) console.warn('skip guard: ' + prebuild.command + ' ' + prebuild.args.join(' ') + ' failed — build-dependent operations will be skipped')
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:156-193](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L156-L193)

引用与实现仅在 built 时执行，其他两项不以此条件跳过。

<details>
<summary>查看原文（38行）</summary>

```text
  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 12, col 11 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('goToDefinition', 12, 11))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 6, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('findReferences', 6, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 2, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('goToImplementation', 2, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `area` name (line 2, col 10).
    const result = await ctx.lsp.query(at('hover', 2, 10))
    expect(result.kind).toBe('hover')
    if (result.kind === 'hover') {
      if (result.hover !== null) expect(result.hover.contents).toContain('area')
    }
  }, 60_000)
```

</details>

#### 缺口

- 没有固定工具链和真实 SwiftPM 项目的运行结果
  **影响**：无法给出四操作命中率或索引准备时间
  **进一步探讨**：分别在成功构建、构建失败和工具链不一致三组项目中记录四操作及 skip 原因

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次使用、持续索引和失败恢复需要哪些外部条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 Node >=22.18 和 DSH 0.1.2 alpha 至 0.2.0 前的兼容范围，并依赖官方 LSP、fs、subprocess 等 peer。部署需先组合共享 LSP 底座，再确保 Xcode 或 Swift.org 工具链中的 sourcekit-lsp 可由目标环境解析；项目应有正确 SwiftPM 配置和构建索引。首次人工工作包括版本、PATH、项目构建和四操作核查；持续负担是 SwiftPM build、索引的时间/磁盘/CPU、工具链升级和查询复核；失败时还要辨别服务不可执行、构建失败或索引未完成。金额、资源量和人工时长未由固定材料提供。此前 npm 元数据查询此包 404，与 README 中“published name”不能同时直接采信；当前注册表状态仍需重新确认，允许本地路径安装的作者命令也尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-swift/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/package.json#L41-L78)

兼容性与 peer 依赖。

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
      "summary": "Swift language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "sourcekit-lsp (fixed argv, no shell)"
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

**依据 2 · 作者声明**：[dsh-lsp-swift/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md#L13-L25)

SourceKit 工具链前提。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

`sourcekit-lsp` ships with Xcode and with the Swift.org toolchains, for example:

```text
/Applications/Xcode.app/Contents/Developer/Toolchains/XcodeDefault.xctoolchain/usr/bin/sourcekit-lsp
```

Add that directory to `PATH` (or run `xcrun --find sourcekit-lsp` to locate it). No separate install step exists for Xcode users.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 3 · 作者声明**：[dsh-lsp-swift/README.md:57-76](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md#L57-L76)

共享底座和语言包挂载顺序。

<details>
<summary>查看原文（20行）</summary>

````text
## Mounting

1. Mount the shared base **once** (the `lsp` service, the `lsp` tool, and a
   filesystem/subprocess pair for the same execution world) — ready-made snippet in
   `examples/base-composition.cordis.yml` of the dsh-lsp-packs repo.
2. Install the pack (its `cordis.yml` is the `dsh.bundle.patch`, so the row inserts
   itself):

```bash
dsh plugin add @dsh-lsp-packs/dsh-lsp-swift    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-swift  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-swift
      name: '@dsh-lsp-packs/dsh-lsp-swift'
```
````

</details>

**依据 4 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:127-136](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L127-L136)

作者测试使用 swift build 才将 built 视为真。

<details>
<summary>查看原文（10行）</summary>

```text
    // Some servers (sourcekit-lsp) index through a built IndexStore; compile
    // the sample package first and skip build-dependent operations on failure.
    if (prebuild !== null) {
      const build = spawnSync(prebuild.command, prebuild.args, {
        cwd: ws,
        timeout: prebuild.timeoutMs,
        shell: process.platform === 'win32',
      })
      built = build.status === 0
      if (!built) console.warn('skip guard: ' + prebuild.command + ' ' + prebuild.args.join(' ') + ' failed — build-dependent operations will be skipped')
```

</details>

#### 缺口

- 未验证当下包可取得性和目标项目的构建/索引成本
  **影响**：不能承诺安装成功或估算单位查询负担
  **进一步探讨**：先核实际 registry/本地包方式，再在固定机器记录构建、索引、查询及失败恢复时间和资源

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么工程取舍可借鉴，并可推导怎样的未验证改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

共享底座一次组合、各语言包只写命令和映射，有利于避免复制 LSP 协议与进程管理代码。Swift smoke 明确把 build 成功设为引用/实现查询的前提，比一律声称四操作可用更诚实；但它也表明组件运行期没有为真实项目建立索引状态提示。可推演一个未验证的分层可用性设计：将“SourceKit 可启动”“项目构建成功”“IndexStore 就绪”“各操作可用”分开展示，且对工具链来源和项目构建配置给出定位，而不是单一绿色状态。用成功/失败 build、双工具链机器及未建索引项目比较误报率、首次可用时间和人工排障负担；若无法可靠感知索引或提示带来更多误报，此方向应撤回。这个假设不计入当前组件已实现贡献。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-swift/src/index.ts:103-117](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/src/index.ts#L103-L117)

薄配置层和可覆盖入口。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:127-136](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L127-L136)

预构建决定 built 状态，是假设的来源。

<details>
<summary>查看原文（10行）</summary>

```text
    // Some servers (sourcekit-lsp) index through a built IndexStore; compile
    // the sample package first and skip build-dependent operations on failure.
    if (prebuild !== null) {
      const build = spawnSync(prebuild.command, prebuild.args, {
        cwd: ws,
        timeout: prebuild.timeoutMs,
        shell: process.platform === 'win32',
      })
      built = build.status === 0
      if (!built) console.warn('skip guard: ' + prebuild.command + ' ' + prebuild.args.join(' ') + ' failed — build-dependent operations will be skipped')
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:166-182](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L166-L182)

引用与实现因缺索引被跳过。

<details>
<summary>查看原文（17行）</summary>

```text
  it('findReferences finds references to the symbol including its declaration', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 6, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('findReferences', 6, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 2, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('goToImplementation', 2, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
```

</details>

#### 缺口

- 索引就绪信号与分层提示均未在此版本实现或验证
  **影响**：不能声称新提示已经减少排障
  **进一步探讨**：在固定 SwiftPM 环境原型化四级状态，测真实原因、提示误报及人工恢复时间

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现有证据支撑何种采用结论？

**研究主题**：采用判断

#### 完整回答

对已经维护 Swift/Xcode 工具链、宿主恰在声明兼容范围内的开发者，配置包提供可理解的本地试验入口，但当前仍适合观察而非直接持续安装。先核包来源、PATH 与目标工具链一致，再在小 SwiftPM 项目构建并分别验定义、hover、引用、实现；若构建失败，只报告部分能力而非四项通过。已有 Xcode/Swift 工具仍可作为稳定替代。没有本轮包安装、真实 server、宿主验收和退出恢复证据，也没有索引成本对照，不能以作者测试源码或仓库热度升级 recommendation。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-swift/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/package.json#L41-L78)

兼容声明与多项外部依赖。

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
      "summary": "Swift language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "sourcekit-lsp (fixed argv, no shell)"
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

**依据 2 · 作者声明**：[dsh-lsp-swift/README.md:78-89](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/README.md#L78-L89)

作者说明真实 server lane 可跳过。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-swift   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `Sources/sample/sample.swift`;
  it **auto-skips** when `sourcekit-lsp` is not on PATH.

The smoke test writes a minimal SwiftPM package (`Package.swift` + `Sources/sample/`) so sourcekit-lsp can serve references and protocol implementations; the protocol `area()` gives `goToImplementation` a real `struct Circle` target.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-swift/tests/smoke.e2e.ts:166-193](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-swift/tests/smoke.e2e.ts#L166-L193)

四操作中两项受构建成功条件限制。

<details>
<summary>查看原文（28行）</summary>

```text
  it('findReferences finds references to the symbol including its declaration', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 6, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('findReferences', 6, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async ({ skip }) => {
    if (!built) return skip('prebuild produced no index for references/implementation — skipped')
    // Line 2, col 10 is the symbol under test in Sources/sample/sample.swift.
    const result = await ctx.lsp.query(at('goToImplementation', 2, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `area` name (line 2, col 10).
    const result = await ctx.lsp.query(at('hover', 2, 10))
    expect(result.kind).toBe('hover')
    if (result.kind === 'hover') {
      if (result.hover !== null) expect(result.hover.contents).toContain('area')
    }
  }, 60_000)
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
