# dsh-lsp-java

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **功能**：在 DSH 中为 .java 文件配置 Eclipse JDT 语言服务导航。

> **亮点**：本包把 Java 命令、参数和扩展映射做成可覆盖的独立语言配置，复用官方 LSP 底座；贡献在接线和配置复用，不是 Java 索引或 LSP 协议。详见[Q02](#research-q02)。

> **主要限制**：JDK、jdtls、项目 workspace 缺一都可能影响结果；源码 catch 所有加载异常并用默认命令和扩展表建立 unavailable 占位，错误归因与覆盖项会失真，加载也不等于索引完成。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要 Java LSP 包，合格的导航与替代办法是什么？](#detail-section-11)
  - [Q02 · 组件怎样注册 Java provider，哪些能力属于本包？](#detail-section-12)
  - [Q03 · 启动到结果需要哪些条件、错误和成本在哪里？](#detail-section-13)
  - [Q04 · 谁适合试用，如何验证更可诊断的失败设计？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 JDK 与 jdtls 的 Java 开发者在 DSH 中查询定义、引用、实现和悬停信息；合格结果需真实项目完成索引并核对位置。

参照是 IDE 的 JDT 导航或手工配置 DSH 官方 LSP stdio。该包只减少 DSH 接线，不替换 JDT 和项目索引。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Java provider | 将 .java 查询交给 jdtls | 需官方 LSP 底座、JDK/jdtls 和已索引项目 |
| 命令及资源配置 | 覆盖 command/args/env/上限 | 覆盖 args 会替换默认列表，参数责任由用户承担 |
| 不可用占位 | 加载失败时返回 LSP_UNAVAILABLE | catch 范围宽，未精确区分故障种类 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node>=22.18、声明范围的 DSH/Cordis | 包声明必需 | 加载配置包 | 范围外兼容未知 |
| fs/lsp/subprocess 与官方 LSP 底座 | 注入必需 | 文件、服务、子进程与模型工具 | 语言 provider 不能完成查询 |
| JDK17+、jdtls | Java 查询必需 | 运行 Eclipse Java server | 缺命令时 unavailable，参数错误也可能落同一占位 |
| Java 项目和独立工作区 data | 有效导航需要 | 初始化与索引 | 加载成功仍可能无可用结果 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户装 JDK/jdtls 并确认同一执行世界的底座 | JDK 与命令可解析 |
| 配置 | 用户装本包，必要时写 command/args 与 -data | provider 注册，未把加载成功当索引完成 |
| 查询 | DSH 对 .java 文件发四类 LSP 请求 | 等待初始化/索引后核对位置与内容 |
| 恢复 | 用户按命令、jar、配置目录、workspace 和日志逐项定位 | 避免把所有 unavailable 都判断为缺 server |
| 退出 | 用户卸载语言包或停用 profile，并清理自行建立的 server 数据 | 不误删共享项目数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | JDK、jdtls、宿主与项目磁盘；金额未知 | 获取 server、设 PATH 或 jar/configuration/data、等索引 | 安装及冷启动耗时未知 |
| 持续使用 | JVM 内存、索引磁盘与进程；实测未知 | 维护 Java 环境、核对导航位置 | 每项目工作区和资源占用未测 |
| 失败恢复 | 重启/重索引可能增加资源；金额未知 | 区分命令、参数、工作区与索引错误 | fallback 目前折叠加载错误，恢复耗时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Java 路由 | 默认 jdtls 与 .java→java，配置可覆盖 | 真实项目四操作的正确性 |
| 配置复用 | 薄语言包接官方 stdio 底座 | 相比手工配置的净节时 |
| 故障占位 | 加载异常注册 LSP_UNAVAILABLE provider | 错误归因准确率与恢复工时 |

作者测试说明不能替代本轮执行或独立宿主验收。

> **思考**：JDK、jdtls、项目 workspace 缺一都可能影响结果；源码 catch 所有加载异常并用默认命令和扩展表建立 unavailable 占位，错误归因与覆盖项会失真，加载也不等于索引完成。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：本包把 Java 命令、参数和扩展映射做成可覆盖的独立语言配置，复用官方 LSP 底座；贡献在接线和配置复用，不是 Java 索引或 LSP 协议。详见[Q02](#research-q02)。

入口薄而清楚，配置默认值和覆盖项集中，官方底座承接协议与生命周期。加载 catch 覆盖所有异常却统一报告 unavailable，fallback 使用默认扩展映射，导致自定义扩展在失败时可能不能路由。PERMISSIONS 对本包不直接写文件的说明不等于 jdtls 子进程无工作区副作用；上游行为须单独核验。

<a id="detail-section-5"></a>

### 1.4 主要限制

JDK、jdtls、项目 workspace 缺一都可能影响结果；源码 catch 所有加载异常并用默认命令和扩展表建立 unavailable 占位，错误归因与覆盖项会失真，加载也不等于索引完成。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有 Java 环境者可对小项目试用，等索引完成并核对四项结果；若主要在成熟 IDE 中工作或无法维护独立 workspace，暂不增加此依赖。详见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持薄配置与故障占位贡献；JDT 启动、索引与真实导航未执行；分层启动诊断是未实现假设。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-java/README.md、dsh-lsp-java/package.json、dsh-lsp-java/PERMISSIONS.md、dsh-lsp-java/src/index.ts、dsh-lsp-java/tests/smoke.e2e.ts 及固定范围 inventory；组件：dsh-lsp-java。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交内核查本组件 README、package、权限声明、入口及测试意图；inventory 限于 Java 子目录，未执行 server、插件或测试。
- 下一步：进一步探讨可固定 Java 项目，测 JDK/jdtls 缺失、错误 jar、复用 data、冷索引与四类导航的结果和恢复时间；本轮不执行。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可区分命令、JVM、工作区锁、初始化与索引状态，并保留覆盖映射；以故障矩阵比较归因与恢复时间。未实现，也不能把分层诊断算作现有能力。详见[Q04](#research-q04)。

进一步探讨可固定 Java 项目，测 JDK/jdtls 缺失、错误 jar、复用 data、冷索引与四类导航的结果和恢复时间；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 140 | — | — | 1039 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 180 | 131 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T05%3A11%3A13.593Z..2026-10-22T05%3A11%3A13.593Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A11%3A13.593Z..2026-10-22T05%3A11%3A13.593Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 Java 配置包的真实增量、启动边界及采用价值。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要 Java LSP 包，合格的导航与替代办法是什么？

**研究主题**：场景与需求

#### 完整回答

适合已经在 DSH 中处理 Java 源码、愿意安装 Eclipse jdtls 的开发者。合格结果是对真实项目的 .java 文件完成定义、引用、实现或悬停查询，并确认跳转位置和索引状态；仅插件加载或命令可找到不算合格。作者称“即插即用”，但 README 同时要求 JDK17+、单独获取 jdtls 和项目工作区。现有替代是 IDE 自带 JDT 导航，或手工把同一 jdtls 的命令、参数与扩展名映射装到 DSH 的官方 LSP 底座。本包针对后者减少配置重复，不改变 Java 语言服务本身。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-java/README.md:3-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L3-L11)

作者定位、四项 LSP 操作及复用官方底座的说明。

```text
> Java language configuration pack for DeepSeek Harness (DSH). Eclipse JDT Language Server (jdtls) — the Eclipse Java language server.
> 中文：DSH 的 Java LSP「即插即用」语言包 —— 装上本包，.java 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Java. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

**依据 2 · 作者声明**：[dsh-lsp-java/README.md:13-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L13-L41)

JDK、jdtls 与安装条件，限定即插即用的范围。

<details>
<summary>查看原文（29行）</summary>

````text
## Installing the language server

Download the Eclipse JDT Language Server (`jdtls`) bundle from the Eclipse Marketplace / 
[project downloads](https://www.eclipse.org/jdt/ls/), unzip it, and run its launcher. The bundle ships a
`bin/jdtls` script (and a Windows batch) — put that directory on `PATH`. Requirements:

- **JDK 17 or newer** must be installed (`java` on `PATH`).

If only `java -jar …/plugins/org.eclipse.equinox.launcher_*.jar` is available, override the pack config:

```yaml
- id: lsp-java
  name: '@dsh-lsp-packs/dsh-lsp-java'
  config:
    command: java
    args:
      - -jar
      - /absolute/path/to/org.eclipse.equinox.launcher_1.6.400.v20210924-0641.jar
      - -configuration
      - /absolute/path/to/config_linux
      - -data
      - /absolute/path/to/workspace
```

The launcher defaults to stdio mode. See the upstream `anthropics/claude-plugins-official` `jdtls-lsp` README for the same guidance.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-java/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L28-L46)

provider ID 与 .java→java 默认映射。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-java'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'java'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'jdtls'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".java": "java"
}
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 组件怎样注册 Java provider，哪些能力属于本包？

**研究主题**：功能与机制、贡献与相对优势、工程质量与复用

#### 完整回答

入口声明 fs、lsp、subprocess 三个注入服务，默认命令 jdtls、空参数与 .java→java；配置允许替换命令和参数、扩展表及 stdio 的资源上限。apply 先把服务器配置交给官方 LspStdio.Config，再委托 LspStdio.apply。自身不实现 LSP 协议、进程生命周期或模型工具；这两层由 dsh-lsp-stdio、dsh-lsp/tool-lsp 与 Eclipse jdtls 负责。本包的技术增量是独立、可覆盖的 Java 配置和故障占位 provider，让配置包在语言服务缺失时仍可加载。复用价值在“每语言一个薄配置包、共用底座”的模块边界。源码中的异常捕获却把所有加载异常都转成同一种 unavailable 占位，且使用默认扩展表和默认命令名构造说明，覆盖项可能丢失；因此错误隔离与可诊断性不能混为一谈。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-java/src/index.ts:28-76](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L28-L76)

注入、默认参数和可覆盖配置项。

<details>
<summary>查看原文（49行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-java'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'java'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'jdtls'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".java": "java"
}

/**
 * Pack configuration. Every field is optional and overrides the pack default;
 * leaving a field unset keeps the README-documented default. This is how a
 * user points the pack at a server installed at a non-standard path.
 */
export interface Config {
  /** Override the server command (absolute path or PATH name). */
  command?: string
  /** Override the launch arguments (replaces the default list entirely). */
  args?: string[]
  /** Extra environment variables merged on top of the scrubbed ambient env. */
  env?: Record<string, string>
  /** Extra extension → language-id entries merged on top of the defaults. */
  extensionToLanguage?: Record<string, string>
  /** Static `initialize` options forwarded to the server. */
  initializationOptions?: unknown
  /** Static answer to every `workspace/configuration` item. */
  configuration?: unknown
  /** Largest single framed message accepted from the server (bytes). */
  maxMessageBytes?: number
  /** Largest stderr tail retained for diagnostics (bytes). */
  maxStderrBytes?: number
  /** Largest source file this host will open (bytes). */
  maxDocumentBytes?: number
  /** Graceful shutdown/exit budget before escalation (ms). */
  shutdownTimeoutMs?: number
  /** Request-cancel and SIGTERM→SIGKILL grace (ms). */
  killGraceMs?: number
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-java/src/index.ts:102-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L102-L118)

默认与用户覆盖值合成 stdio 配置。

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

**依据 3 · 源码核查**：[dsh-lsp-java/src/index.ts:120-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L120-L170)

委托官方底座与失败占位 provider。

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

**依据 4 · 作者声明**：[dsh-lsp-java/README.md:6-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L6-L11)

作者明确协议及工具来自共享底座。

```text
This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Java. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动到结果需要哪些条件、错误和成本在哪里？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

包声明 Node>=22.18、DSH alpha 范围和多项 peer；运行还需要同一执行世界的 fs/lsp/subprocess、JDK17+、jdtls 安装及可用的 Java 项目。默认空参数假定 jdtls 启动脚本能完成配置；仅有 launcher jar 时需用户填写 -configuration 与 -data 路径。README 说语言服务首次匹配查询才懒启动，冷初始化可能慢；进程启动、LSP 初始化、Java 项目索引和查询成功是不同状态。缺命令时占位 provider 给 LSP_UNAVAILABLE，但源码 catch 范围覆盖所有 LspStdio.apply 错误，不能将该错误必然解释成没有安装 server。首次成本为获取 JDK/jdtls、配置工作区、确认底座；持续成本为 JVM 内存、索引时间/磁盘与路径维护；失败恢复要核对命令、jar/configuration/data、项目布局和日志。金额、等待时间及每次成功导航成本都缺少同条件测量。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-java/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/package.json#L41-L78)

宿主版本、权限声明及 peer 条件。

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
      "summary": "Java language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "jdtls (fixed argv, no shell)"
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

**依据 2 · 作者声明**：[dsh-lsp-java/README.md:13-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L13-L41)

JDK 与 jdtls 获取及覆盖参数。

<details>
<summary>查看原文（29行）</summary>

````text
## Installing the language server

Download the Eclipse JDT Language Server (`jdtls`) bundle from the Eclipse Marketplace / 
[project downloads](https://www.eclipse.org/jdt/ls/), unzip it, and run its launcher. The bundle ships a
`bin/jdtls` script (and a Windows batch) — put that directory on `PATH`. Requirements:

- **JDK 17 or newer** must be installed (`java` on `PATH`).

If only `java -jar …/plugins/org.eclipse.equinox.launcher_*.jar` is available, override the pack config:

```yaml
- id: lsp-java
  name: '@dsh-lsp-packs/dsh-lsp-java'
  config:
    command: java
    args:
      - -jar
      - /absolute/path/to/org.eclipse.equinox.launcher_1.6.400.v20210924-0641.jar
      - -configuration
      - /absolute/path/to/config_linux
      - -data
      - /absolute/path/to/workspace
```

The launcher defaults to stdio mode. See the upstream `anthropics/claude-plugins-official` `jdtls-lsp` README for the same guidance.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 3 · 作者声明**：[dsh-lsp-java/README.md:73-105](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L73-L105)

组合、懒启动与冷初始化说明；本轮未执行。

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-java    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-java  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-java
      name: '@dsh-lsp-packs/dsh-lsp-java'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-java   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `Sample.java`;
  it **auto-skips** when `jdtls` is not on PATH.

jdtls initializes a full Eclipse workspace on first launch (visible startup latency) and prefers a project layout; the first query may take tens of seconds.
````

</details>

**依据 4 · 源码核查**：[dsh-lsp-java/src/index.ts:152-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L152-L170)

加载异常被同一 fallback 捕获。

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

#### 缺口

- 没有固定项目中启动、索引和四项导航的时间与结果记录。
  **影响**：无法估算稳定性、冷启动成本或恢复效率。
  **进一步探讨**：用含多模块与依赖的固定 Java 项目记录启动、索引就绪和导航正确性。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合试用，如何验证更可诊断的失败设计？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有 JDK 与 jdtls、主要在 DSH 内查询 Java 定义和引用的开发者可以受控试用。先用小项目确认底座和配置，再等索引完成并核对四种操作的结果；命令存在却导航空白时检查项目布局和工作区，不能盲目重试。对于仅偶尔看 Java 或已经依赖成熟 IDE 的用户，新增进程和索引成本未必合算。当前建议试用，冷初始化、工作区配置与统一异常提示仍给使用者带来维护负担。未验证的新设计是把命令缺失、JVM 参数错误、工作区锁、初始化超时、索引未就绪区分为可操作状态，同时在 fallback 保留用户覆盖的扩展映射。以缺命令、坏 jar、复用 -data、冷索引与正常项目的故障矩阵比较归因准确率、误报和恢复时间；如果更细状态未减少盲重试，就不应增加复杂度。该设计未实现，不计入本包现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-java/src/index.ts:120-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/src/index.ts#L120-L170)

当前 fallback 将不同加载异常合并为 unavailable。

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

**依据 2 · 作者声明**：[dsh-lsp-java/README.md:94-105](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/README.md#L94-L105)

作者描述 smoke lane 与启动延迟，但不是本轮运行结果。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-java   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `Sample.java`;
  it **auto-skips** when `jdtls` is not on PATH.

jdtls initializes a full Eclipse workspace on first launch (visible startup latency) and prefers a project layout; the first query may take tens of seconds.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-java/tests/smoke.e2e.ts:1-40](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-java/tests/smoke.e2e.ts#L1-L40)

测试文件存在；仅作为覆盖意图，不等于已执行。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * dsh-lsp-java smoke e2e. Three lanes:
 *
 *  1. `pack defaults` — offline config assertions (always run).
 *  2. `missing server` — offline fallback assertion (always run): with an
 *     unresolvable command the pack still loads and queries fail with the
 *     structured LSP_UNAVAILABLE error, so other tools keep working.
 *  3. `real server` — the lsp tool’s four operations against a sample file;
 *     skipped automatically when the language server is not installed.
 */

import { afterAll, beforeAll, describe, expect, it } from 'vitest'
import { mkdtemp, mkdir, realpath, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { Context } from '@deepseek-ai/cordis'
import Lsp from '@deepseek-ai/dsh-lsp'
import type { LspQueryRequest, LspQueryResult } from '@deepseek-ai/dsh-lsp'
import LocalSubprocessRuntime from '@deepseek-ai/dsh-subprocess-local'
import LocalFileSystem from '@deepseek-ai/dsh-fs-local'
import * as Pack from '../src/index.ts'

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

```

</details>

#### 缺口

- 细分诊断及保留自定义映射的设计未实现。
  **影响**：不能声称当前故障恢复更快。
  **进一步探讨**：以固定故障矩阵对照现有反馈和新设计反馈，记录定位与恢复时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
