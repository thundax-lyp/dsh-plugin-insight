# dsh-lsp-csharp

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：C# LSP 配置包，将 .cs 文件路由给外部 OmniSharp stdio 服务器和 DSH 共享 LSP 基座。

> **核心亮点**：将 C# 扩展映射和 OmniSharp 启动参数打包为 Cordis 组件。详见[Q01](#research-q01)。

> **风险与缺陷**：只有 DLL 的环境默认命令失败；catch-all fallback 把非缺服异常也视为 unavailable，并丢弃自定义扩展映射。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · C# 导航能力由哪里提供？](#detail-section-11)
  - [Q02 · 默认启动与缺服降级有什么陷阱？](#detail-section-12)
  - [Q03 · 何时值得采用，现有测试证明什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Agent 中查询 C# 定义、引用、实现和 hover。

手工在 DSH shared LSP base 配置 OmniSharp server；组件主要提供默认映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| C# 配置 | .cs 映射和进程参数 | 需共享基座 |
| 失败回退 | 结构化错误 | 异常可能误归因 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH LSP service/tool 与 fs/subprocess | 必需 | 协议、查询和进程宿主 | 薄包独立不可用 |
| OmniSharp/Roslyn | C# 查询必需 | 语言分析 | 查询返回 LSP_UNAVAILABLE |
| .NET/Mono | DLL 发行形态必需 | 启动对应服务器 | 需改命令或安装运行时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 对齐 binary/args | 进程可启动 |
| 项目 | 打开 .sln/.csproj | 索引就绪 |
| 查询 | 四种 LSP 操作 | 定位准确 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | OmniSharp/Roslyn、可能 .NET/Mono 与 DSH LSP 基座；版本/现金未知 | 确认 binary 或 dotnet DLL argv，挂载同执行世界 fs/subprocess；工时未知 | 不同发行形态需要不同 command |
| 持续使用 | 每工作区语言服务器进程与索引内存；量值未知 | 维护 .sln/.csproj、查导航结果与升级兼容；耗时未知 | 真实大型解决方案性能未测 |
| 失败恢复 | 重启/重索引可能追加 CPU/内存；现金未知 | 定位缺服、配置错误与 fallback 误归因，修命令；耗时未知 | 真实服务器 lane 在缺 binary 时跳过 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| C# 路由 | .cs→csharp | 大工程效果 |
| 缺服降级 | LSP_UNAVAILABLE | 错误诊断准确度 |
| 四项导航 | 上游基座宣称 | 本轮未运行 |

> **思考**：只有 DLL 的环境默认命令失败；catch-all fallback 把非缺服异常也视为 unavailable，并丢弃自定义扩展映射。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将 C# 扩展映射和 OmniSharp 启动参数打包为 Cordis 组件。详见[Q01](#research-q01)。

将 C# 扩展映射和 OmniSharp 启动参数打包为 Cordis 组件。详见[Q01](#research-q01)。

C# 薄包注入 fs/lsp/subprocess、合并命令参数，委托 LspStdio；异常时注册 unavailable provider。

<a id="detail-section-5"></a>

### 1.4 主要限制

只有 DLL 的环境默认命令失败；catch-all fallback 把非缺服异常也视为 unavailable，并丢弃自定义扩展映射。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

确认安装形态：若仅有 OmniSharp.dll，配置 command=dotnet 和 DLL 绝对路径；在真实 .sln/.csproj 测四操作。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核默认配置和降级；导航能力依赖基座/服务器且未实测，catch-all fallback 可能掩盖配置错误。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-csharp/README.md、dsh-lsp-csharp/package.json、dsh-lsp-csharp/src/index.ts、dsh-lsp-csharp/tests/smoke.e2e.ts、dsh-lsp-csharp/cordis.yml 及固定范围 inventory；组件：dsh-lsp-csharp。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交中的 dsh-lsp-csharp 子组件及测试源码；未运行目标测试或语言服务器。 普通安装、宿主加载及目标测试属本轮范围边界，具体机制/效果未知仍在逐题缺口保留。
- 下一步：在有/无服务器及错误配置环境测试 fallback 与自定义扩展；真实 C# 项目测导航和资源。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

按异常类型区分配置/缺服，并让 fallback 沿用 resolved extension 映射，可改善诊断；待验证。详见[Q02](#research-q02)。

在有/无服务器及错误配置环境测试 fallback 与自定义扩展；真实 C# 项目测导航和资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 1009 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 183 | 134 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T06%3A35%3A59.124Z..2026-10-22T06%3A35%3A59.124Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A35%3A59.124Z..2026-10-22T06%3A35%3A59.124Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**核实 C# 包对共享 LSP 基座的配置、外部 OmniSharp 依赖与失败降级的真实性。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · C# 导航能力由哪里提供？

**研究主题：**场景与需求、贡献与相对优势、功能与机制

#### 完整回答

组件只注册一个 csharp provider 配置，默认用 PATH 中的 omnisharp --stdio 处理 .cs→csharp；真正 LSP 协议、工具暴露和进程复用由另装的 DSH LSP 基座与 stdio 服务提供。代码把配置交给 LspStdio.Config 后 apply，没有自写导航算法，也不包含 OmniSharp 二进制。README 所列 goToDefinition/findReferences/goToImplementation/hover 是组合后的上游能力，不是此包独立实现。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-csharp/README.md:3-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/README.md#L3-L11)

作者说明组件仅配置共享基座。

```text
> C# language configuration pack for DeepSeek Harness (DSH). OmniSharp (default) — the C# language server; Roslyn-based server as an alternative.
> 中文：DSH 的 C# LSP「即插即用」语言包 —— 装上本包，.cs 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for C#. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

**依据 2 · 源码核查**：[dsh-lsp-csharp/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts#L28-L46)

provider、命令、扩展映射。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-csharp'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'csharp'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'omnisharp'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".cs": "csharp"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-csharp/src/index.ts:152-160](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts#L152-L160)

委托 LspStdio 注册。

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

**依据 4 · 源码核查**：[dsh-lsp-csharp/package.json:41-78](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/package.json#L41-L78)

bundle patch/宿主 peer 依赖。

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
      "summary": "C# language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "omnisharp --stdio (fixed argv, no shell)"
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

#### 缺口

- 四项导航在不同C#工程形态中的返回正确性与适用范围未知。
  **影响：**不能将注册成功等同导航结果有效。
  **进一步探讨：**固定OmniSharp版本与带已知位置的.sln/.csproj夹具，对照四种导航结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 默认启动与缺服降级有什么陷阱？

**研究主题：**依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

默认 command 是 omnisharp、argv 是 --stdio；README 另说明某些安装只有 OmniSharp.dll，必须配置 dotnet 加 DLL 绝对路径，否则默认命令找不到。apply 捕获 LspStdio.Config/apply 的所有异常，不只可执行文件缺失，随后注册返回 LSP_UNAVAILABLE 的 fallback；因此配置错误、服务异常也可能被包装成“服务器不可用”。更具体地，fallback 总以 DEFAULT_EXTENSION_TO_LANGUAGE 注册，即用户扩展配置在错误时丢失，新增扩展的查询可能连预期 LSP_UNAVAILABLE 都到不了。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-csharp/README.md:13-40](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/README.md#L13-L40)

dll/执行文件安装差异及配置方式。

<details>
<summary>查看原文（28行）</summary>

````text
## Installing the language server

OmniSharp ships as an `OmniSharp.dll` (the omnisharp-roslyn build); some package managers expose an `omnisharp`
executable. Either way it is launched with stdio, for example:

```bash
dotnet /absolute/path/to/OmniSharp.dll --stdio
```

Override the pack config to match your install:

```yaml
- id: lsp-csharp
  name: '@dsh-lsp-packs/dsh-lsp-csharp'
  config:
    command: dotnet
    args:
      - /absolute/path/to/OmniSharp.dll
      - --stdio
```

Requires the **.NET SDK (or Mono)**. The modern Roslyn-based server
(`Microsoft.CodeAnalysis.LanguageServer`) is a drop-in alternative with the same `command`/`args` shape.
See the upstream `anthropics/claude-plugins-official` `csharp-lsp` README for the same guidance.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-csharp/src/index.ts:37-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts#L37-L46)

默认启动命令/参数。

<details>
<summary>查看原文（10行）</summary>

```text
/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'omnisharp'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".cs": "csharp"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-csharp/src/index.ts:102-117](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts#L102-L117)

配置覆盖与扩展合并。

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

**依据 4 · 源码核查**：[dsh-lsp-csharp/src/index.ts:120-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/src/index.ts#L120-L169)

catch-all fallback 与默认扩展表。

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

#### 缺口

- 没有真实安装形态与宿主错误案例。
  **影响：**不同平台的启动成功率、误归因比例未知。
  **进一步探讨：**分别配置 PATH exe、dotnet DLL、错误参数及自定义扩展观察报错。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时值得采用，现有测试证明什么？

**研究主题：**效果与总成本、采用判断、新假设与验证

#### 完整回答

若团队 C# 代码导航已经有 DSH 共享 LSP 基座并可提供 OmniSharp/Roslyn，组件省去手写服务配置。需要额外安装服务器、确保 .NET/Mono 和相同执行环境的 fs/subprocess，成本主要在运行进程与版本适配。仓库 smoke 测试源码包含离线默认值、缺服 fallback 和真实服务器 lane，但真实 lane 在 omnisharp 不在 PATH 时自动跳过；仅看到测试代码不代表本轮运行通过，也不证明 .sln/.csproj 中大型解决方案表现。试用应先确认 binary 命令与实际 C# 工程导航，再量测初次启动和跨工作区内存占用。

成本分期：首次使用涉及OmniSharp/Roslyn、可能 .NET/Mono 与 DSH LSP 基座；版本/现金未知，人工需确认 binary 或 dotnet DLL argv，挂载同执行世界 fs/subprocess；工时未知；持续使用涉及每工作区语言服务器进程与索引内存；量值未知，人工需维护 .sln/.csproj、查导航结果与升级兼容；耗时未知；失败恢复涉及重启/重索引可能追加 CPU/内存；现金未知，人工需定位缺服、配置错误与 fallback 误归因，修命令；耗时未知。金额、频次、实际耗时均未有同条件证据，不能填0或推算单位收益。

创新假设推导：Q02 代码把 Config/apply 的所有异常归为 OmniSharp 不可用，且 fallback 用默认扩展；相对当前降级，按异常类型区分并使用 resolved 扩展表，可让配置错误保留诊断、自定义扩展仍得到结构化失败。条件是共享 LspStdio 提供可判别错误与扩展注册语义，需维护错误映射。最小证伪：在隔离构造缺 binary、非法配置、注册异常和自定义扩展，逐项核错误码与路由；若仍误报缺服或丢映射，假设失败。此为工程修复而非新 LSP 算法。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-csharp/README.md:34-40](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/README.md#L34-L40)

外部 .NET 和二进制前提。

```text
Requires the **.NET SDK (or Mono)**. The modern Roslyn-based server
(`Microsoft.CodeAnalysis.LanguageServer`) is a drop-in alternative with the same `command`/`args` shape.
See the upstream `anthropics/claude-plugins-official` `csharp-lsp` README for the same guidance.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
```

**依据 2 · 作者声明**：[dsh-lsp-csharp/README.md:93-104](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/README.md#L93-L104)

作者描述测试 lane 与 auto-skip。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-csharp   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `Sample.cs`;
  it **auto-skips** when `omnisharp` is not on PATH.

OmniSharp works best inside a `.sln`/`.csproj`; the smoke test writes a bare file and the same-file definition still resolves in most configurations.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-csharp/tests/smoke.e2e.ts:24-42](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/tests/smoke.e2e.ts#L24-L42)

按 omnisharp 探测 real lane。

<details>
<summary>查看原文（19行）</summary>

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

const installed = probeServer('omnisharp')

```

</details>

**依据 4 · 源码核查**：[dsh-lsp-csharp/tests/smoke.e2e.ts:71-101](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-csharp/tests/smoke.e2e.ts#L71-L101)

缺服检查与 real lane skip。

<details>
<summary>查看原文（31行）</summary>

```text
// Lane 2: missing-server fallback (offline) ---------------------------
describe('dsh-lsp-csharp missing-server fallback', () => {
  let ctx: Context

  beforeAll(async () => {
    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack, { command: 'definitely-missing-csharp-server-xyz' })
  }, 20_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
  })

  it('loads without throwing and fails queries with a structured LSP_UNAVAILABLE error', async () => {
    const request: LspQueryRequest = {
      operation: 'goToDefinition',
      filePath: 'Sample.cs',
      position: { line: 0, character: 0 },
      workspaceRoot: process.cwd(),
    }
    await expect(ctx.lsp.query(request)).rejects.toThrow(
      expect.objectContaining({ code: 'LSP_UNAVAILABLE' }),
    )
  })
})

// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-csharp real server (omnisharp)', () => {
```

</details>

#### 缺口

- 大型C#工程中的导航正确性、首次索引时间与内存峰值缺少对照。
  **影响：**无法给出工程规模和持续资源上限。
  **进一步探讨：**按工程规模记录索引与查询的资源曲线及答案位置。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
