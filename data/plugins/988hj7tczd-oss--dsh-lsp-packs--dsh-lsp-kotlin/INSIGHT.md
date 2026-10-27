# dsh-lsp-kotlin

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **功能**：为 DSH 接入 Kotlin 语言服务，配置 .kt/.kts 导航路由及外部 kotlin-language-server 启动参数。

> **亮点**：相对手动组合官方 LSP 底座，本包把 Kotlin 命令、扩展映射和注册行封装为配置；语言解析与进程管理归外部 server 和共享底座。详见[Q01](#research-q01)。

> **主要限制**：.kts 有路由不等于 Gradle 脚本语义准确；广泛 catch 会把多种 apply 错误写成 server unavailable，回退还丢自定义扩展映射。详见[Q03](#research-q03)。

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
  - [Q01 · 这个包解决了 Kotlin 开发者的哪段配置工作，贡献归谁？](#detail-section-11)
  - [Q02 · 配置如何注册 provider，失败时怎样表现？](#detail-section-12)
  - [Q03 · .kts 路由、服务器缺失回退与作者测试能证明哪些结果？](#detail-section-13)
  - [Q04 · 安装、索引与失败恢复的真实责任在哪里？](#detail-section-14)
  - [Q05 · 配置包架构有哪些可复用之处与维护风险？](#detail-section-15)
  - [Q06 · 如何从脚本路由与回退缺口提出可证伪的改进？](#detail-section-16)
  - [Q07 · 当前适合观察、试用还是安装？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合已有 Kotlin/Gradle 工程且愿意管理外部语言服务器的 DSH 开发者，减少重复配置而不提供 Kotlin 解析器。详见[Q01](#research-q01)。

替代办法是 Kotlin IDE 或手动配置官方 DSH LSP stdio 底座。该包减少语言默认项接线，不替代编译器、Gradle 项目导入或外部 language server。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Kotlin provider 配置 | 将 .kt/.kts 导向共享 LSP 服务 | 需兼容底座、JDK 和外部 server；导航效果未验 |
| 命令与资源参数覆盖 | 指定服务器路径、环境和边界 | 由共享 stdio 底座执行，实际兼容需核查 |
| 不可用回退 | 在 apply 异常时返回 LSP_UNAVAILABLE | catch 过宽且回退仅保留默认扩展 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容的 DSH/Node 与共享 LSP 底座 | 必需 | 提供 lsp、fs、subprocess 与模型工具 | 配置无法正常组合或启动 |
| JDK17+ 与 kotlin-language-server | 查询必需 | 外部语言解析进程 | 可能返回 LSP_UNAVAILABLE；具体异常须辨别 |
| Kotlin/Gradle 工程和索引 | 高质量项目导航需要 | 提供依赖与符号上下文 | .kts 可路由但结果可能不完整 |
| npm 包取得性 | 使用 registry 安装时必需 | 获取组件 | 前次查询 404，需核当前状态；本地路径是另一途径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 部署者固定宿主、JDK、server 与共享底座 | 命令可解析且版本条件符合 |
| 加载 | 部署者组合基础服务并插入 Kotlin 行 | provider 注册；失败检查错误而非只看包加载 |
| 查询 | 开发者分别在 .kt/.kts 运行四操作 | 定义/引用等对应正确符号，记录首次索引时间 |
| 验收 | 开发者核对异常与退出 | 缺 server、索引慢、配置错误被正确区分 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | JDK、外部服务器和宿主资源；金额未知 | 固定版本、安装/配置底座和 server、核对 Gradle 工程；耗时未知 | 包可取得性与兼容性需复查 |
| 持续使用 | JVM、索引与工作区资源；用量未知 | 检查 .kt/.kts 查询和维护版本；频率未知 | 首次索引可能慢，未实测 |
| 失败恢复 | 重试与重启消耗资源；金额未知 | 排查 PATH/JDK/配置/索引和回退映射；耗时未知 | broad catch 可能误导根因 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Kotlin 扩展路由 | .kt 与 .kts 映射到 kotlin provider | 真实脚本语义与查询命中率 |
| 缺服务回退 | 源码注册 LSP_UNAVAILABLE provider | 其他 apply 异常是否正确归类、覆盖映射是否保持 |
| 减少手工配置 | 命令、参数、扩展和补丁行已封装 | 同条件节时、索引资源与维护成本 |

> **思考**：.kts 有路由不等于 Gradle 脚本语义准确；广泛 catch 会把多种 apply 错误写成 server unavailable，回退还丢自定义扩展映射。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手动组合官方 LSP 底座，本包把 Kotlin 命令、扩展映射和注册行封装为配置；语言解析与进程管理归外部 server 和共享底座。详见[Q01](#research-q01)。

薄配置包复用共享 LSP 底座，扩展和资源限制可覆盖；但 catch 覆盖所有 apply 错误，fallback 仅用默认扩展，需维护错误语义与覆盖配置一致。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

.kts 有路由不等于 Gradle 脚本语义准确；广泛 catch 会把多种 apply 错误写成 server unavailable，回退还丢自定义扩展映射。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先核对包可取得性、宿主版本与外部 server，再在小 Kotlin/Gradle 工程分别验 .kt 和 .kts，避免仅按包加载判断成功。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置映射与回退接线获固定版本源码支持；Kotlin/Gradle 实际导航、首次索引和宿主兼容未由本轮运行验证。诊断契约为未实现、未验证的设计假设。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-lsp-kotlin/README.md、dsh-lsp-kotlin/package.json、dsh-lsp-kotlin/cordis.yml、dsh-lsp-kotlin/src/index.ts、dsh-lsp-kotlin/tests/smoke.e2e.ts 及固定范围 inventory；组件：dsh-lsp-kotlin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交只核 Kotlin 子组件 README、package、cordis、入口及 smoke 测试源码；没有执行插件、测试、语言服务器或宿主。复用此前 META，不称为本轮采集；外部官方底座未纳入本组件代码统计。
- 下一步：先复查 registry 可取得性；在声明兼容的隔离宿主中固定 JDK/server/Gradle 版本，对 .kt、.kts 运行四操作和缺命令、错误 JDK、错误配置、自定义扩展故障矩阵，记录正确率、首次可用时间和恢复成本。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的改进方向是按命令/JDK、索引、脚本语义和配置错误区分诊断，并让回退沿用覆盖映射；用故障矩阵测根因命中与排障时间。详见[Q06](#research-q06)。

先复查 registry 可取得性；在声明兼容的隔离宿主中固定 JDK/server/Gradle 版本，对 .kt、.kts 运行四操作和缺命令、错误 JDK、错误配置、自定义扩展故障矩阵，记录正确率、首次可用时间和恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 125 | — | — | 939 |
| .ts | source | 1 | 172 | 96 | 60 | — |
| .ts | test | 1 | 176 | 127 | 25 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Kotlin LSP 配置包在固定版本中实际负责什么、依赖什么，失败回退和脚本导航是否足以支撑采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个包解决了 Kotlin 开发者的哪段配置工作，贡献归谁？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已在 DSH 中处理 Kotlin 或 Gradle Kotlin 脚本、希望用模型侧 lsp 工具进行定义、引用、实现和悬停查询的开发者。合格结果应在选定工作区内分别对 .kt、.kts 命中正确符号，并可区分服务器未启动、构建索引未完成与查询本身不支持。现有办法是在 Kotlin IDE 中导航，或手工把语言服务器接入 DSH 的 stdio/LSP 底座。该包将 kotlin-language-server 命令、空启动参数和两种扩展映射包装为独立配置项，减少重复接线；语言解析、LSP 协议、模型工具与进程生命周期归外部服务器及共享底座，而非本包原创。README 的“即插即用”要同时满足外部服务器、JDK、宿主底座和项目条件，不能按单包安装即得能力理解。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-kotlin/README.md:3-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L3-L25)

作者说明用途、共享底座和外部服务器前提。

<details>
<summary>查看原文（23行）</summary>

````text
> Kotlin language configuration pack for DeepSeek Harness (DSH). kotlin-language-server — the community Kotlin language server.
> 中文：DSH 的 Kotlin LSP「即插即用」语言包 —— 装上本包，.kt / .kts 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Kotlin. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

```bash
# Homebrew:
brew install kotlin-language-server
# or download a release from github.com/fwcd/kotlin-language-server and add bin/ to PATH
```

Requires a **JDK (17+)** on PATH. `kotlin-language-server` starts in stdio mode by default.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:28-47](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L28-L47)

入口只定义 provider id、命令、参数与扩展映射。

<details>
<summary>查看原文（20行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-kotlin'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'kotlin'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'kotlin-language-server'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = []

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".kt": "kotlin",
    ".kts": "kotlin"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-kotlin/cordis.yml:3-14](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/cordis.yml#L3-L14)

安装补丁只插入语言包一行，共享基础设施须另行组合。

<details>
<summary>查看原文（12行）</summary>

```text
# This file is the package’s `dsh.bundle.patch`: when the package is installed with
# `dsh plugin add @dsh-lsp-packs/dsh-lsp-kotlin` (or a local path to this directory), the row below is inserted into the profile
# composition. The shared LSP base (`@deepseek-ai/dsh-lsp` service + `@deepseek-ai/dsh-tool-lsp`
# tool + fs/subprocess for the same execution world) is composed ONCE by the deployment —
# every language pack reuses that base unchanged; see examples/base-composition.cordis.yml in
# the dsh-lsp-packs repository.
#
# The pack’s apply() assembles the configured `@deepseek-ai/dsh-lsp-stdio` instance for
# `ctx.lsp`, so adding a language never touches the base rows.
- insert:
    - id: lsp-kotlin
      name: '@dsh-lsp-packs/dsh-lsp-kotlin'
```

</details>

#### 缺口

- 未取得目标 Kotlin 工程中的导航质量与原有 IDE/手工配置对照
  **影响**：无法断言本包提升查询准确率或完成速度
  **进一步探讨**：在相同 Gradle 工程记录四类查询的正确命中与首次可用时间，并对照 IDE 或手工底座

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置如何注册 provider，失败时怎样表现？

**研究主题**：功能与机制

#### 完整回答

入口声明 fs、lsp、subprocess 三项注入，resolveServerConfig 将默认命令 kotlin-language-server、空 args 和 .kt/.kts 对应 kotlin 的映射与用户覆盖合并，并转交官方 dsh-lsp-stdio.Config 使上游填默认时间和字节限制。apply 调用 stdio 底座注册 provider；若该调用抛错，则注册 UnavailableProvider，查询会以 LSP_UNAVAILABLE 失败而非让加载中断。源码注释称服务懒启动和每工作区复用，但这部分由未纳入本组件的官方底座实现；本轮能直接确认的是本包配置和回退接线。回退 catch 覆盖所有 apply 异常，日志却写为命令 unavailable，因而配置或初始化异常也可能被误归因为缺服务器；回退 provider 使用 DEFAULT_EXTENSION_TO_LANGUAGE，而非用户覆盖后的映射，非默认扩展在失败时可能失去明确的不可用路由。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:79-119](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L79-L119)

覆盖配置由本包合并并交给共享 stdio Config。

<details>
<summary>查看原文（41行）</summary>

```text
export const Config: z<Config> = z.object({
  command: z.string(),
  args: z.array(String),
  env: z.dict(String),
  extensionToLanguage: z.dict(String),
  initializationOptions: z.any(),
  configuration: z.any(),
  maxMessageBytes: z.number(),
  maxStderrBytes: z.number(),
  maxDocumentBytes: z.number(),
  shutdownTimeoutMs: z.number(),
  killGraceMs: z.number(),
})

/**
 * The server entry this pack always fills completely: `command`, `args`, and
 * `extensionToLanguage` are guaranteed present (defaults or user overrides).
 */
export type ResolvedServerConfig = LspLocalServerConfig & {
  command: string
  args: string[]
  extensionToLanguage: Record<string, string>
}

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

**依据 2 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:121-171](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L121-L171)

异常回退注册默认映射，并将所有异常描述为服务器 unavailable。

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

**依据 3 · 作者声明**：[dsh-lsp-kotlin/README.md:32-56](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L32-L56)

作者陈述懒启动、未安装回退及可覆盖项，运行行为须由底座和宿主验证。

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
- id: lsp-kotlin
  name: '@dsh-lsp-packs/dsh-lsp-kotlin'
  config:
    command: /absolute/path/to/kotlin-language-server
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

- 未检查当前部署的共享 stdio 底座源码和真实 apply 异常分类
  **影响**：不能保证所有异常均只影响 Kotlin，也不能确认实际懒启动时序
  **进一步探讨**：固定底座版本，核对进程解析、启动、超时、provider 冲突与错误分类，并在隔离宿主观测

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · .kts 路由、服务器缺失回退与作者测试能证明哪些结果？

**研究主题**：缺陷与关键质疑

#### 完整回答

源码能证明 .kt 与 .kts 都被路由到语言 id kotlin，但不能由扩展表推断 Gradle Kotlin DSL 脚本的符号解析质量。作者指出 kotlin-language-server 偏好 Gradle 工程、首次工作区遍历慢；JDK17+ 与外部可执行文件也是前提。测试源码覆盖默认值、强制缺命令回退，并有真实服务器的四操作 lane；该 lane 在检测不到可执行文件时自动 skip，测试存在不代表本轮执行或目标环境通过。此外配置允许自定义 extensionToLanguage，回退却使用默认映射，用户自定义扩展在故障时可能无法得到预期的结构化错误。这一细节让“失败不影响其他会话能力”仍需在真实底座和配置下核查，不能仅凭作者文字保证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:43-47](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L43-L47)

扩展路由的静态事实。

```text
/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".kt": "kotlin",
    ".kts": "kotlin"
}
```

**依据 2 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:153-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L153-L170)

广泛 catch 和默认映射回退的限制。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[dsh-lsp-kotlin/README.md:79-90](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L79-L90)

作者说明测试 lane 可自动跳过与 Gradle 首次遍历限制。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-kotlin   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.kt`;
  it **auto-skips** when `kotlin-language-server` is not on PATH.

kotlin-language-server prefers a Gradle project; single-file queries work after its first (slow) workspace pass.
````

</details>

**依据 4 · 源码核查**：[dsh-lsp-kotlin/tests/smoke.e2e.ts:48-102](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/tests/smoke.e2e.ts#L48-L102)

测试源码覆盖默认配置、缺服务回退，真实服务器 lane 条件执行。

<details>
<summary>查看原文（55行）</summary>

```text
// Lane 1: pack defaults ------------------------------------------------
describe('dsh-lsp-kotlin pack defaults', () => {
  it('declares the README-default command, args, provider id, and extension table', () => {
    expect(Pack.name).toBe('lsp-kotlin')
    expect(Pack.PROVIDER_ID).toBe('kotlin')
    expect(Pack.inject).toEqual(['fs', 'lsp', 'subprocess'])
    expect(Pack.DEFAULT_COMMAND).toBe('kotlin-language-server')
    expect([...Pack.DEFAULT_ARGS]).toEqual([])
    expect({ ...Pack.DEFAULT_EXTENSION_TO_LANGUAGE }).toEqual({".kt":"kotlin",".kts":"kotlin"})
  })

  it('keeps defaults when no override is given and merges user overrides on top', () => {
    const defaults = Pack.resolveServerConfig({})
    expect(defaults.command).toBe('kotlin-language-server')
    expect([...defaults.args]).toEqual([])
    expect(defaults.extensionToLanguage).toEqual({".kt":"kotlin",".kts":"kotlin"})
    const overridden = Pack.resolveServerConfig({ command: '/custom/server', args: ['-x'] })
    expect(overridden.command).toBe('/custom/server')
    expect([...overridden.args]).toEqual(['-x'])
    expect(overridden.extensionToLanguage).toEqual({".kt":"kotlin",".kts":"kotlin"})
  })
})

// Lane 2: missing-server fallback (offline) ---------------------------
describe('dsh-lsp-kotlin missing-server fallback', () => {
  let ctx: Context

  beforeAll(async () => {
    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack, { command: 'definitely-missing-kotlin-server-xyz' })
  }, 20_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
  })

  it('loads without throwing and fails queries with a structured LSP_UNAVAILABLE error', async () => {
    const request: LspQueryRequest = {
      operation: 'goToDefinition',
      filePath: 'sample.kt',
      position: { line: 0, character: 0 },
      workspaceRoot: process.cwd(),
    }
    await expect(ctx.lsp.query(request)).rejects.toThrow(
      expect.objectContaining({ code: 'LSP_UNAVAILABLE' }),
    )
  })
})

// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-kotlin real server (kotlin-language-server)', () => {
  let ctx: Context
```

</details>

#### 缺口

- 没有 .kt 与 .kts 的真实 Gradle 工程查询结果及故障注入记录
  **影响**：不能估计脚本导航命中率、首次延迟与回退隔离程度
  **进一步探讨**：用固定 JDK/Gradle/服务器版本对源文件和脚本分别测四操作，同时注入缺命令、错误配置与初始化异常

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、索引与失败恢复的真实责任在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首先要组合一次共享 LSP service、模型侧 lsp 工具、同一执行世界的 fs 与 subprocess；本包只是新增语言配置行。包清单声明 Node >=22.18.0、DSH >=0.1.2-alpha.3 且低于 0.2.0-0，以及多项官方 peer；README 要求 JDK17+ 和另行安装 kotlin-language-server。首次成本是固定版本、下载和配置外部服务器、准备 JDK/Gradle 工程及安装后核查路由；持续成本包括 JVM 与索引资源、版本匹配和脚本查询复核；故障时需分辨 PATH/JDK/配置/索引问题并重载。项目没有可据以填写的金额、内存、索引时长和人工工时。包发布说明与此前 npm 元数据采集不一致，2026-10-21 的 registry 查询为 404；因此安装命令应在当下重新核查确切包可取得性，不能把 README 中的“published name”直接当已可安装。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-kotlin/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L13-L25)

外部服务与 JDK 前提。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
# Homebrew:
brew install kotlin-language-server
# or download a release from github.com/fwcd/kotlin-language-server and add bin/ to PATH
```

Requires a **JDK (17+)** on PATH. `kotlin-language-server` starts in stdio mode by default.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 作者声明**：[dsh-lsp-kotlin/README.md:58-77](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L58-L77)

基础组合与本包挂载顺序。

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-kotlin    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-kotlin  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-kotlin
      name: '@dsh-lsp-packs/dsh-lsp-kotlin'
```
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-kotlin/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/package.json#L41-L78)

版本声明、权限和依赖。

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
      "summary": "Kotlin language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "kotlin-language-server (fixed argv, no shell)"
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

**依据 4 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:28-38](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L28-L38)

fs/lsp/subprocess 注入和外部命令。

<details>
<summary>查看原文（11行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-kotlin'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'kotlin'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'kotlin-language-server'
```

</details>

#### 缺口

- 没有当下 npm 可取得性、宿主兼容和实际索引资源记录
  **影响**：不能估算首次/持续成本，亦不能承诺包安装成功
  **进一步探讨**：在目标日期核对 registry 与包名，在隔离配置中测首次索引、资源和错误恢复；现金/人工成本分开记录

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 配置包架构有哪些可复用之处与维护风险？

**研究主题**：工程质量与复用

#### 完整回答

把共享 LSP 底座只挂一次、每语言包只声明命令和扩展的分工，减少跨语言复制协议和进程管理代码。resolveServerConfig 留出命令、环境、文档大小、消息长度与取消时限等覆盖口；固定 server defaults 较容易人工检查。工程风险在于本包既依赖多个 peer 的兼容区间，也把全部 apply 异常折叠成一个 fallback：正常挂载失败后仅报 Kotlin unavailable，可能遮蔽底座配置错误；fallback 固定扩展表与覆盖配置不一致。测试源码说明作者有离线和有条件真实服务 lane，但本轮不运行，不能代替持续集成或真实工程性能。代码统计只属于本组件，不能把底座或 server 的算法算成本包贡献。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:49-119](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L49-L119)

可覆盖项和默认合并机制。

<details>
<summary>查看原文（71行）</summary>

```text
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

export const Config: z<Config> = z.object({
  command: z.string(),
  args: z.array(String),
  env: z.dict(String),
  extensionToLanguage: z.dict(String),
  initializationOptions: z.any(),
  configuration: z.any(),
  maxMessageBytes: z.number(),
  maxStderrBytes: z.number(),
  maxDocumentBytes: z.number(),
  shutdownTimeoutMs: z.number(),
  killGraceMs: z.number(),
})

/**
 * The server entry this pack always fills completely: `command`, `args`, and
 * `extensionToLanguage` are guaranteed present (defaults or user overrides).
 */
export type ResolvedServerConfig = LspLocalServerConfig & {
  command: string
  args: string[]
  extensionToLanguage: Record<string, string>
}

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

**依据 2 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:144-171](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L144-L171)

apply 与错误折叠接线。

<details>
<summary>查看原文（28行）</summary>

```text
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

**依据 3 · 源码核查**：[dsh-lsp-kotlin/package.json:69-94](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/package.json#L69-L94)

多个官方 peer 与版本范围。

<details>
<summary>查看原文（26行）</summary>

```text
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
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.2",
    "@deepseek-ai/dsh-brand": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-fs": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-fs-local": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-invariants": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-llm": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-lsp": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-lsp-stdio": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-subprocess": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-subprocess-local": "0.1.2-alpha.3",
    "@deepseek-ai/dsh-timeout": "0.1.2-alpha.3",
    "@types/node": "^24.0.0",
    "typescript": "^6.0.3",
    "vitest": "^3.2.4"
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-kotlin/tests/smoke.e2e.ts:48-102](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/tests/smoke.e2e.ts#L48-L102)

测试设计存在且真实 lane 条件执行，本轮没有执行。

<details>
<summary>查看原文（55行）</summary>

```text
// Lane 1: pack defaults ------------------------------------------------
describe('dsh-lsp-kotlin pack defaults', () => {
  it('declares the README-default command, args, provider id, and extension table', () => {
    expect(Pack.name).toBe('lsp-kotlin')
    expect(Pack.PROVIDER_ID).toBe('kotlin')
    expect(Pack.inject).toEqual(['fs', 'lsp', 'subprocess'])
    expect(Pack.DEFAULT_COMMAND).toBe('kotlin-language-server')
    expect([...Pack.DEFAULT_ARGS]).toEqual([])
    expect({ ...Pack.DEFAULT_EXTENSION_TO_LANGUAGE }).toEqual({".kt":"kotlin",".kts":"kotlin"})
  })

  it('keeps defaults when no override is given and merges user overrides on top', () => {
    const defaults = Pack.resolveServerConfig({})
    expect(defaults.command).toBe('kotlin-language-server')
    expect([...defaults.args]).toEqual([])
    expect(defaults.extensionToLanguage).toEqual({".kt":"kotlin",".kts":"kotlin"})
    const overridden = Pack.resolveServerConfig({ command: '/custom/server', args: ['-x'] })
    expect(overridden.command).toBe('/custom/server')
    expect([...overridden.args]).toEqual(['-x'])
    expect(overridden.extensionToLanguage).toEqual({".kt":"kotlin",".kts":"kotlin"})
  })
})

// Lane 2: missing-server fallback (offline) ---------------------------
describe('dsh-lsp-kotlin missing-server fallback', () => {
  let ctx: Context

  beforeAll(async () => {
    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack, { command: 'definitely-missing-kotlin-server-xyz' })
  }, 20_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
  })

  it('loads without throwing and fails queries with a structured LSP_UNAVAILABLE error', async () => {
    const request: LspQueryRequest = {
      operation: 'goToDefinition',
      filePath: 'sample.kt',
      position: { line: 0, character: 0 },
      workspaceRoot: process.cwd(),
    }
    await expect(ctx.lsp.query(request)).rejects.toThrow(
      expect.objectContaining({ code: 'LSP_UNAVAILABLE' }),
    )
  })
})

// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-kotlin real server (kotlin-language-server)', () => {
  let ctx: Context
```

</details>

#### 缺口

- 共享底座版本变化对配置契约与故障隔离的影响未跨版本核查
  **影响**：不能称该配置方法已在声明范围内普遍可靠
  **进一步探讨**：按声明上下界建立最小版本矩阵，比较 provider 注册和错误分类

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何从脚本路由与回退缺口提出可证伪的改进？

**研究主题**：新假设与验证

#### 完整回答

可提出未验证的诊断契约假设：将服务器可执行文件/JDK、Gradle 索引准备、脚本语义支持和 provider 配置错误分成不同状态，同时使回退沿用用户覆盖后的扩展表。这样 .kts 查询失败时可以区分“没有路由”“服务器没启动”“索引未完成”“语义无法解析”，避免把所有失败都导向重装可执行文件。最小验证用固定 Kotlin/Gradle 项目和独立 .kts 脚本，分别注入无 server、错误 JDK、错误配置、慢索引和自定义扩展，检查诊断是否命中根因，记录四操作成功率、误导性错误率、首次可用时间及新增维护成本。若这些状态无法可靠区分或诊断成本超过节省的排障时间，该假设不成立。它是研究者推演，不是本版本已经实现的能力。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:103-119](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L103-L119)

用户覆盖配置是推导所需前提。

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

**依据 2 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:153-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L153-L170)

广泛 catch 与默认映射回退提供反例。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[dsh-lsp-kotlin/README.md:79-90](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L79-L90)

作者说明真实服务测试可跳过及首次索引慢。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-kotlin   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.kt`;
  it **auto-skips** when `kotlin-language-server` is not on PATH.

kotlin-language-server prefers a Gradle project; single-file queries work after its first (slow) workspace pass.
````

</details>

#### 缺口

- 诊断契约与继承覆盖映射的方案尚未实现和实验
  **影响**：不能把更少排障或更高脚本命中率写作现有效果
  **进一步探讨**：按预设故障矩阵制作最小原型，记录真实根因、错误标签与人工恢复时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前适合观察、试用还是安装？

**研究主题**：采用判断

#### 完整回答

包作为薄配置层有明确场景，但外部服务器、JDK、Gradle 索引和宿主版本都是必要条件；旧元数据还显示 npm 包获取失败。对已经固定兼容旧 DSH 宿主、能控制 JDK 与语言服务器安装的团队，可先观察本包并考虑本地路径试用；若当前只需稳定 Kotlin 导航，既有 IDE 是更确定的替代。只有在确切包可获取、共享底座运行、.kt/.kts 四操作及失败恢复均有同版本记录后，才可将其升为持续安装建议。现阶段 recommendation 为 observe；不能用测试源码或作者“即插即用”宣称验证通过。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-kotlin/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/package.json#L41-L78)

宿主版本范围与依赖约束。

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
      "summary": "Kotlin language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "kotlin-language-server (fixed argv, no shell)"
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

**依据 2 · 作者声明**：[dsh-lsp-kotlin/README.md:58-90](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/README.md#L58-L90)

挂载步骤、条件测试和实际服务前提。

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-kotlin    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-kotlin  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-kotlin
      name: '@dsh-lsp-packs/dsh-lsp-kotlin'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-kotlin   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.kt`;
  it **auto-skips** when `kotlin-language-server` is not on PATH.

kotlin-language-server prefers a Gradle project; single-file queries work after its first (slow) workspace pass.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-kotlin/src/index.ts:153-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-kotlin/src/index.ts#L153-L170)

回退能保留部分路由，但错误分类广泛。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
