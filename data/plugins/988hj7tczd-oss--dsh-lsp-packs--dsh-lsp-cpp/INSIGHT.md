# @dsh-lsp-packs/dsh-lsp-cpp

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：把 clangd 配置为 DSH 的 C/C++ LSP 后端，为共享 lsp 工具提供导航、引用、实现和 hover。

> **核心亮点**：相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。 详见[Q03](#research-q03)。

> **风险与缺陷**：核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。 详见[Q04](#research-q04)。

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
  - [Q01 · 谁在何种重复场景需要 @dsh-lsp-packs/dsh-lsp-cpp，合格交付与简单替代是什么？](#detail-section-11)
  - [Q02 · @dsh-lsp-packs/dsh-lsp-cpp 的入口、调用链、状态变化与副作用如何实现？](#detail-section-12)
  - [Q03 · 相对宿主原生能力或简单替代，@dsh-lsp-packs/dsh-lsp-cpp 的具体增量是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使 @dsh-lsp-packs/dsh-lsp-cpp 的核心价值不成立？](#detail-section-14)
  - [Q05 · @dsh-lsp-packs/dsh-lsp-cpp 启动、持续生效与失败降级依赖什么？](#detail-section-15)
  - [Q06 · @dsh-lsp-packs/dsh-lsp-cpp 完成一个合格任务的首次、持续与失败恢复成本是什么？](#detail-section-16)
  - [Q07 · @dsh-lsp-packs/dsh-lsp-cpp 的工程可靠性和可迁移设计如何？](#detail-section-17)
  - [Q08 · 由贡献与限制可推导什么可证伪的新设计假设？](#detail-section-18)
  - [Q09 · 哪些人应观察、试用或拒绝采用 @dsh-lsp-packs/dsh-lsp-cpp？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：C/C++ 仓库中的代理需要跨文件定义、引用、实现和 hover；基线是 grep/rg、编译器诊断或手工启动 clangd。合格结果是.c/.h/.cpp/.hpp/.cc映射正确、首次查询惰性启动每工作区进程、缺 server 返回结构化错误，跨文件精度可由 compile_commands.json 复现。 详见[Q01](#research-q01)。

C/C++ 仓库中的代理需要跨文件定义、引用、实现和 hover；基线是 grep/rg、编译器诊断或手工启动 clangd。合格结果是.c/.h/.cpp/.hpp/.cc映射正确、首次查询惰性启动每工作区进程、缺 server 返回结构化错误，跨文件精度可由 compile_commands.json 复现。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| C/C++ LSP配置 | 把五类扩展映射到clangd | 协议能力来自共享base，不是本包实现 |
| 惰性server | 首次查询启动每工作区clangd | 持续占索引资源 |
| 结构化降级 | 缺clangd返回LSP_UNAVAILABLE | 不自动安装server |
| 配置覆盖 | 自定义command/env/初始化和边界 | 错误配置会降低或阻断导航 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 共享 dsh-lsp base/tool | 必需 | 提供服务、模型工具和协议 | 未挂载则pack无可用工具 |
| clangd 可执行文件 | 必需 | 实际语言服务器 | 缺失查询返回LSP_UNAVAILABLE |
| filesystem/subprocess/timeout同execution world | 必需 | 读文件、启动与约束server | 接线不一致会访问错误环境 |
| compile_commands.json | 复杂项目效果必需 | 提供真实编译参数 | 缺失时宏/头文件导航不可靠 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装基础 | 管理员挂共享base和执行服务 | lsp工具可见且只挂一次 |
| 安装pack | 添加@dsh-lsp-packs/dsh-lsp-cpp | 扩展映射注册 |
| 准备项目 | 装clangd并生成compile_commands | clangd --version和数据库可读 |
| 查询/验收 | 模型调用四种只读操作 | 与rg/编译器交叉核对；失败回退文本搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | clangd/工具链磁盘与安装资源 | 挂base、装server、生成compile DB | 跨平台配置时长未知 |
| 持续使用 | 每工作区clangd CPU/内存/索引磁盘 | 等待索引并核对关键跳转 | 按正确回答的导航查询计量 |
| 失败恢复 | 重启server/重建索引和compile DB资源 | 修PATH/env/参数并回退rg | 复杂工程排障时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 代码导航 | 共享工具支持definition/reference/implementation/hover | 目标工程正确率 |
| 安装简化 | pack提供默认command/args/extensions | 共享base接线仍较多 |
| 缺server隔离 | 结构化错误且会话其他能力不受影响 | 真实Host错误呈现 |

> **思考**：核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。 详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。 详见[Q03](#research-q03)。

相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。 详见[Q03](#research-q03)。

语言包保持175行配置层，协议、进程和工具放共享基座，职责边界清晰；缺server结构化失败比插件加载失败更可用。可复用到其他语言；代价是对多个peer精确版本范围和共享execution world接线的维护。 详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。 详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。没有共享 base、依赖重型交叉编译或无法限制 server资源的环境先观察，保留 rg/编译器作为基线。 详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认该包只注册 clangd 命令、参数和 C/C++ 扩展映射，并把协议、工具与进程生命周期交给共享 LSP 基座；本轮没有启动 clangd 或查询项目，故不能确认目标 Host 接线、资源占用及缺失或过期 compile_commands.json 时的导航正确率。

- 已检查：作者 README、包清单、源码路径 README.md、dsh-lsp-cpp/src/index.ts 及固定范围 inventory；组件：dsh-lsp-cpp。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 258bb6409c504fa1eed20b6f70d13009522ca0ce 的作者材料、入口与关键源码；不运行插件、测试、外部服务或真实 Host；检查时间不早于 2026-10-22T15:49:47Z。
- 下一步：在只读C++样本中先验证缺clangd返回LSP_UNAVAILABLE，再用固定clangd版本与compile_commands跑四种操作；对宏、重载、虚函数实现和生成头各留金标，记录正确定位、无结果、延迟与进程资源。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是由 pack 自动检测 compile_commands 缺失/过期并向模型标记“导航置信度”，可减少错误跳转被当事实。最小实验在20个含宏/生成头/多配置的C++查询上比较有无提示组的正确定位率、无结果率和错误引用率；提示不能降低错误采纳即否定。 详见[Q08](#research-q08)。

在只读C++样本中先验证缺clangd返回LSP_UNAVAILABLE，再用固定clangd版本与compile_commands跑四种操作；对宏、重载、虚函数实现和生成头各留金标，记录正确定位、无结果、延迟与进程资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 132 | — | — | 982 |
| .ts | source | 1 | 175 | 99 | 60 | — |
| .ts | test | 1 | 185 | 136 | 25 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：@dsh-lsp-packs/dsh-lsp-cpp 在固定版本下是否以可控依赖和总成本交付其核心能力，并值得目标用户采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种重复场景需要 @dsh-lsp-packs/dsh-lsp-cpp，合格交付与简单替代是什么？

**研究主题**：场景与需求

#### 完整回答

C/C++ 仓库中的代理需要跨文件定义、引用、实现和 hover；基线是 grep/rg、编译器诊断或手工启动 clangd。合格结果是.c/.h/.cpp/.hpp/.cc映射正确、首次查询惰性启动每工作区进程、缺 server 返回结构化错误，跨文件精度可由 compile_commands.json 复现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-29](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/README.md#L1-L29)

固定版本作者材料支持 Q01 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（29行）</summary>

```text
# dsh-lsp-packs

> **独立安装说明**
> 每个 `dsh-lsp-<lang>/` 都是可独立安装的 DSH 插件包，依赖通过 npm registry 获取，不要求用户预先检出相邻的 `dsh-src`。本仓库的 `pnpm-workspace.yaml` 仅用于本地一次性构建和测试全部 12 个语言包。
> 本地开发/验证可直接执行 `pnpm install && pnpm build`；语言 server 二进制仍需按各包 README 单独安装。


按语言开箱即用的 **LSP 语言配置包** 插件系列（DeepSeek Harness / DSH）。

> 装上一个包，该语言就有原生代码导航：`lsp` 工具（`goToDefinition` / `findReferences` / `goToImplementation` / `hover`）无需自行实现任何 LSP 协议。每个语言一个 Cordis 配置插件，复用官方通用底座 `@deepseek-ai/dsh-lsp-stdio` + `@deepseek-ai/dsh-tool-lsp`，共 12 个语言包，**底座零改动、零重复**。

Out-of-the-box, per-language LSP configuration packs for DeepSeek Harness: one Cordis plugin per language, all reusing the same shared base (`@deepseek-ai/dsh-lsp` seam + `@deepseek-ai/dsh-lsp-stdio` stdio host + `@deepseek-ai/dsh-tool-lsp` model tool).

## 语言包一览（12 个）

| 语言包 | 默认 server | extensionToLanguage |
|---|---|---|
| `dsh-lsp-pyright` | `pyright-langserver --stdio` | `.py` / `.pyi` → `python` |
| `dsh-lsp-rust` | `rust-analyzer` | `.rs` → `rust` |
| `dsh-lsp-go` | `gopls` | `.go` → `go` |
| `dsh-lsp-cpp` | `clangd` | `.c`/`.h` → `c`；`.cpp`/`.hpp`/`.cc` → `cpp` |
| `dsh-lsp-java` | `jdtls` | `.java` → `java` |
| `dsh-lsp-ts` | `typescript-language-server --stdio` | `.ts`→`typescript`、`.tsx`→`typescriptreact`、`.js`→`javascript`、`.jsx`→`javascriptreact` |
| `dsh-lsp-ruby` | `ruby-lsp --stdio` | `.rb` → `ruby` |
| `dsh-lsp-php` | `intelephense --stdio`（可切 `phpactor`） | `.php` → `php` |
| `dsh-lsp-lua` | `lua-language-server --stdio` | `.lua` → `lua` |
| `dsh-lsp-kotlin` | `kotlin-language-server` | `.kt` / `.kts` → `kotlin` |
| `dsh-lsp-swift` | `sourcekit-lsp` | `.swift` → `swift` |
| `dsh-lsp-csharp` | `omnisharp --stdio`（可切 Roslyn/`dotnet` 方案） | `.cs` → `csharp` |
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · @dsh-lsp-packs/dsh-lsp-cpp 的入口、调用链、状态变化与副作用如何实现？

**研究主题**：功能与机制

#### 完整回答

该子包只注册一个配置好的 @deepseek-ai/dsh-lsp-stdio provider，默认 command=clangd、args=--stdio 和扩展到语言映射；共享 dsh-lsp/dsh-tool-lsp 实现协议与模型面对的 lsp 工具。可覆盖 command/env/initializationOptions/大小和超时，二进制首个匹配查询才启动。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-cpp/src/index.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts#L100-L175)

固定版本源码用于核对 Q02 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（76行）</summary>

```text
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
}
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对宿主原生能力或简单替代，@dsh-lsp-packs/dsh-lsp-cpp 的具体增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工配置，它把 clangd 默认值、扩展映射、依赖约束和缺 server 降级封装为可安装 pack；十二语言包复用同一基座，增量是 C/C++ 配置而非实现 LSP。没有 compile database 时只能做有限单文件导航，价值取决于项目构建信息。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-29](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/README.md#L1-L29)

固定版本作者材料支持 Q03 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（29行）</summary>

```text
# dsh-lsp-packs

> **独立安装说明**
> 每个 `dsh-lsp-<lang>/` 都是可独立安装的 DSH 插件包，依赖通过 npm registry 获取，不要求用户预先检出相邻的 `dsh-src`。本仓库的 `pnpm-workspace.yaml` 仅用于本地一次性构建和测试全部 12 个语言包。
> 本地开发/验证可直接执行 `pnpm install && pnpm build`；语言 server 二进制仍需按各包 README 单独安装。


按语言开箱即用的 **LSP 语言配置包** 插件系列（DeepSeek Harness / DSH）。

> 装上一个包，该语言就有原生代码导航：`lsp` 工具（`goToDefinition` / `findReferences` / `goToImplementation` / `hover`）无需自行实现任何 LSP 协议。每个语言一个 Cordis 配置插件，复用官方通用底座 `@deepseek-ai/dsh-lsp-stdio` + `@deepseek-ai/dsh-tool-lsp`，共 12 个语言包，**底座零改动、零重复**。

Out-of-the-box, per-language LSP configuration packs for DeepSeek Harness: one Cordis plugin per language, all reusing the same shared base (`@deepseek-ai/dsh-lsp` seam + `@deepseek-ai/dsh-lsp-stdio` stdio host + `@deepseek-ai/dsh-tool-lsp` model tool).

## 语言包一览（12 个）

| 语言包 | 默认 server | extensionToLanguage |
|---|---|---|
| `dsh-lsp-pyright` | `pyright-langserver --stdio` | `.py` / `.pyi` → `python` |
| `dsh-lsp-rust` | `rust-analyzer` | `.rs` → `rust` |
| `dsh-lsp-go` | `gopls` | `.go` → `go` |
| `dsh-lsp-cpp` | `clangd` | `.c`/`.h` → `c`；`.cpp`/`.hpp`/`.cc` → `cpp` |
| `dsh-lsp-java` | `jdtls` | `.java` → `java` |
| `dsh-lsp-ts` | `typescript-language-server --stdio` | `.ts`→`typescript`、`.tsx`→`typescriptreact`、`.js`→`javascript`、`.jsx`→`javascriptreact` |
| `dsh-lsp-ruby` | `ruby-lsp --stdio` | `.rb` → `ruby` |
| `dsh-lsp-php` | `intelephense --stdio`（可切 `phpactor`） | `.php` → `php` |
| `dsh-lsp-lua` | `lua-language-server --stdio` | `.lua` → `lua` |
| `dsh-lsp-kotlin` | `kotlin-language-server` | `.kt` / `.kts` → `kotlin` |
| `dsh-lsp-swift` | `sourcekit-lsp` | `.swift` → `swift` |
| `dsh-lsp-csharp` | `omnisharp --stdio`（可切 Roslyn/`dotnet` 方案） | `.cs` → `csharp` |
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使 @dsh-lsp-packs/dsh-lsp-cpp 的核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

核心质疑是“即插即用”是否会被误解为无需工具链/编译数据库。插件不下载 clangd，复杂宏、生成头、交叉编译和多配置项目若缺 compile_commands.json 会给错误或不完整结果；长期 clangd 进程占资源，server版本与参数兼容未固定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-cpp/src/index.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts#L100-L175)

固定版本源码用于核对 Q04 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（76行）</summary>

```text
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
}
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · @dsh-lsp-packs/dsh-lsp-cpp 启动、持续生效与失败降级依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

必须先挂一次共享 lsp service/tool、filesystem/subprocess/timeout并安装 clangd 到PATH或显式command；精确跨文件导航还需C/C++工具链和compile_commands.json。缺二进制时 pack本身加载但查询返回LSP_UNAVAILABLE，不应阻断其他语言。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-29](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/README.md#L1-L29)

固定版本作者材料支持 Q05 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（29行）</summary>

```text
# dsh-lsp-packs

> **独立安装说明**
> 每个 `dsh-lsp-<lang>/` 都是可独立安装的 DSH 插件包，依赖通过 npm registry 获取，不要求用户预先检出相邻的 `dsh-src`。本仓库的 `pnpm-workspace.yaml` 仅用于本地一次性构建和测试全部 12 个语言包。
> 本地开发/验证可直接执行 `pnpm install && pnpm build`；语言 server 二进制仍需按各包 README 单独安装。


按语言开箱即用的 **LSP 语言配置包** 插件系列（DeepSeek Harness / DSH）。

> 装上一个包，该语言就有原生代码导航：`lsp` 工具（`goToDefinition` / `findReferences` / `goToImplementation` / `hover`）无需自行实现任何 LSP 协议。每个语言一个 Cordis 配置插件，复用官方通用底座 `@deepseek-ai/dsh-lsp-stdio` + `@deepseek-ai/dsh-tool-lsp`，共 12 个语言包，**底座零改动、零重复**。

Out-of-the-box, per-language LSP configuration packs for DeepSeek Harness: one Cordis plugin per language, all reusing the same shared base (`@deepseek-ai/dsh-lsp` seam + `@deepseek-ai/dsh-lsp-stdio` stdio host + `@deepseek-ai/dsh-tool-lsp` model tool).

## 语言包一览（12 个）

| 语言包 | 默认 server | extensionToLanguage |
|---|---|---|
| `dsh-lsp-pyright` | `pyright-langserver --stdio` | `.py` / `.pyi` → `python` |
| `dsh-lsp-rust` | `rust-analyzer` | `.rs` → `rust` |
| `dsh-lsp-go` | `gopls` | `.go` → `go` |
| `dsh-lsp-cpp` | `clangd` | `.c`/`.h` → `c`；`.cpp`/`.hpp`/`.cc` → `cpp` |
| `dsh-lsp-java` | `jdtls` | `.java` → `java` |
| `dsh-lsp-ts` | `typescript-language-server --stdio` | `.ts`→`typescript`、`.tsx`→`typescriptreact`、`.js`→`javascript`、`.jsx`→`javascriptreact` |
| `dsh-lsp-ruby` | `ruby-lsp --stdio` | `.rb` → `ruby` |
| `dsh-lsp-php` | `intelephense --stdio`（可切 `phpactor`） | `.php` → `php` |
| `dsh-lsp-lua` | `lua-language-server --stdio` | `.lua` → `lua` |
| `dsh-lsp-kotlin` | `kotlin-language-server` | `.kt` / `.kts` → `kotlin` |
| `dsh-lsp-swift` | `sourcekit-lsp` | `.swift` → `swift` |
| `dsh-lsp-csharp` | `omnisharp --stdio`（可切 Roslyn/`dotnet` 方案） | `.cs` → `csharp` |
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · @dsh-lsp-packs/dsh-lsp-cpp 完成一个合格任务的首次、持续与失败恢复成本是什么？

**研究主题**：效果与总成本

#### 完整回答

首次要安装 clangd、挂共享 base、配置 compile_commands 和必要 env；持续每工作区保留一个 clangd 进程，消耗索引CPU/内存/磁盘与等待时间；失败恢复先读 LSP_UNAVAILABLE/日志，修PATH或重建 compile database并重启该server，普通文本搜索仍可降级。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-cpp/src/index.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts#L100-L175)

固定版本源码用于核对 Q06 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（76行）</summary>

```text
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
}
```

</details>

#### 缺口

- 无/过期compile_commands时导航错误率未知
  **影响**：决定模型能否安全依赖结果修改C++
  **进一步探讨**：在20个宏/生成头/多配置查询上分别用正确、缺失、过期数据库，和编译器/人工金标比较

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · @dsh-lsp-packs/dsh-lsp-cpp 的工程可靠性和可迁移设计如何？

**研究主题**：工程质量与复用

#### 完整回答

语言包保持175行配置层，协议、进程和工具放共享基座，职责边界清晰；缺server结构化失败比插件加载失败更可用。可复用到其他语言；代价是对多个peer精确版本范围和共享execution world接线的维护。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-cpp/src/index.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts#L100-L175)

固定版本源码用于核对 Q07 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（76行）</summary>

```text
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
}
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与限制可推导什么可证伪的新设计假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是由 pack 自动检测 compile_commands 缺失/过期并向模型标记“导航置信度”，可减少错误跳转被当事实。最小实验在20个含宏/生成头/多配置的C++查询上比较有无提示组的正确定位率、无结果率和错误引用率；提示不能降低错误采纳即否定。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-cpp/src/index.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-cpp/src/index.ts#L100-L175)

固定版本源码用于核对 Q08 的接线、状态或失败路径；这是静态检查。

<details>
<summary>查看原文（76行）</summary>

```text
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
}
```

</details>

#### 缺口

- 无/过期compile_commands时导航错误率未知
  **影响**：决定模型能否安全依赖结果修改C++
  **进一步探讨**：在20个宏/生成头/多配置查询上分别用正确、缺失、过期数据库，和编译器/人工金标比较

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人应观察、试用或拒绝采用 @dsh-lsp-packs/dsh-lsp-cpp？

**研究主题**：采用判断

#### 完整回答

有稳定 clangd 与 compile_commands 的 C/C++ 项目可在只读导航任务中试用；先核四个操作对 sample 和本项目代表文件的结果，再允许模型依赖它改代码。没有共享 base、依赖重型交叉编译或无法限制 server资源的环境先观察，保留 rg/编译器作为基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-29](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/README.md#L1-L29)

固定版本作者材料支持 Q09 的功能范围或边界；本轮未把声明当运行结果。

<details>
<summary>查看原文（29行）</summary>

```text
# dsh-lsp-packs

> **独立安装说明**
> 每个 `dsh-lsp-<lang>/` 都是可独立安装的 DSH 插件包，依赖通过 npm registry 获取，不要求用户预先检出相邻的 `dsh-src`。本仓库的 `pnpm-workspace.yaml` 仅用于本地一次性构建和测试全部 12 个语言包。
> 本地开发/验证可直接执行 `pnpm install && pnpm build`；语言 server 二进制仍需按各包 README 单独安装。


按语言开箱即用的 **LSP 语言配置包** 插件系列（DeepSeek Harness / DSH）。

> 装上一个包，该语言就有原生代码导航：`lsp` 工具（`goToDefinition` / `findReferences` / `goToImplementation` / `hover`）无需自行实现任何 LSP 协议。每个语言一个 Cordis 配置插件，复用官方通用底座 `@deepseek-ai/dsh-lsp-stdio` + `@deepseek-ai/dsh-tool-lsp`，共 12 个语言包，**底座零改动、零重复**。

Out-of-the-box, per-language LSP configuration packs for DeepSeek Harness: one Cordis plugin per language, all reusing the same shared base (`@deepseek-ai/dsh-lsp` seam + `@deepseek-ai/dsh-lsp-stdio` stdio host + `@deepseek-ai/dsh-tool-lsp` model tool).

## 语言包一览（12 个）

| 语言包 | 默认 server | extensionToLanguage |
|---|---|---|
| `dsh-lsp-pyright` | `pyright-langserver --stdio` | `.py` / `.pyi` → `python` |
| `dsh-lsp-rust` | `rust-analyzer` | `.rs` → `rust` |
| `dsh-lsp-go` | `gopls` | `.go` → `go` |
| `dsh-lsp-cpp` | `clangd` | `.c`/`.h` → `c`；`.cpp`/`.hpp`/`.cc` → `cpp` |
| `dsh-lsp-java` | `jdtls` | `.java` → `java` |
| `dsh-lsp-ts` | `typescript-language-server --stdio` | `.ts`→`typescript`、`.tsx`→`typescriptreact`、`.js`→`javascript`、`.jsx`→`javascriptreact` |
| `dsh-lsp-ruby` | `ruby-lsp --stdio` | `.rb` → `ruby` |
| `dsh-lsp-php` | `intelephense --stdio`（可切 `phpactor`） | `.php` → `php` |
| `dsh-lsp-lua` | `lua-language-server --stdio` | `.lua` → `lua` |
| `dsh-lsp-kotlin` | `kotlin-language-server` | `.kt` / `.kts` → `kotlin` |
| `dsh-lsp-swift` | `sourcekit-lsp` | `.swift` → `swift` |
| `dsh-lsp-csharp` | `omnisharp --stdio`（可切 Roslyn/`dotnet` 方案） | `.cs` → `csharp` |
```

</details>

#### 缺口

- 无/过期compile_commands时导航错误率未知
  **影响**：决定模型能否安全依赖结果修改C++
  **进一步探讨**：在20个宏/生成头/多配置查询上分别用正确、缺失、过期数据库，和编译器/人工金标比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
