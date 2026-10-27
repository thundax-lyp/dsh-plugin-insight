# dsh-lsp-php

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：为 DSH 预置 PHP LSP 的服务器命令与扩展名映射，并复用共享 stdio 底座。

> **核心亮点**：独立 PHP 包将固定服务器启动参数及语言映射接到共享 LSP 底座，减少逐项目重复接线；语言分析与协议能力归外部 server 和底座。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：apply 任意异常都被归为命令不可用，fallback 用默认扩展映射和默认命令日志，覆盖配置后可能误导诊断或丢失自定义后缀路由；这是源码风险，未在本轮复现。详见[Q02](#research-q02)。

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
  - [Q01 · PHP 开发者得到什么，合格结果是什么？](#detail-section-11)
  - [Q02 · 配置合并和缺 server 后的路由如何工作，有什么边界？](#detail-section-12)
  - [Q03 · 安装、持续使用和失败恢复需要哪些条件？](#detail-section-13)
  - [Q04 · 四操作效果和完整成本由哪些材料支持？](#detail-section-14)
  - [Q05 · 应如何评价增量、提出改进假设并决定采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已配置 DSH LSP 底座、在本地 PHP 工作区需要模型辅助代码导航的开发者。

手工将 PHP server 命令和 .php 映射接到通用 stdio，或在编辑器独立使用相同语言服务器；本包把接线封装为 DSH 组件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| PHP provider | 把 .php 查询交给语言服务器 | 共享底座和 server 已安装，版本匹配 |
| 命令与配置覆写 | 改用 phpactor 或自定义路径 | argv、env 与后缀需正确设置 |
| 缺 server 回退 | 查询时给结构化不可用错误 | catch 覆盖所有 apply 异常，诊断可能误指 |
| 四类导航入口 | 定义、引用、实现、hover | 实际效果由外部 server 决定 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH LSP 底座与 tool | 必需 | 提供服务和模型查询接口 | 本包不实现协议/工具 |
| 同执行环境 fs/subprocess | 必需 | 共享 stdio 访问工作区并启动进程 | 注入不满足无法正常组装 |
| PHP language server | 查询必需 | 实际语义分析 | fallback 返回 LSP_UNAVAILABLE |
| Node/DSH peer 范围 | 包清单声明 | 版本兼容 | 未匹配版本未验证 |
| npm 或本地 checkout | 获取方式 | 安装包 | 旧 META 404，registry 发布未知 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备底座 | 用户配置 LSP service、tool 与 fs/subprocess | 服务位于相同执行环境 |
| 准备 server | 用户按许可安装 intelephense 或 phpactor | PATH 中可启动；phpactor 需覆写 argv |
| 装入包 | 用户经已核实来源安装并配置 composition | php provider 与 .php 路由加载 |
| 查询与退出 | 在隔离 PHP 项目查四操作，失败看日志；退出移除包并重载 | 返回有用结果，移除后路由/进程恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部 server 许可及索引资源未知 | 配齐共享底座、server 与 PATH，调 composition | npm 可得性与首查耗时未核实 |
| 持续使用 | server 进程、索引 CPU/内存/磁盘未测 | 检查导航结果和依赖兼容 | 本包不实现 server 资源上限 |
| 失败恢复 | 重载与重新索引资源未知 | 区分命令、配置和底座故障，必要时移除 | fallback 日志与自定义映射有源码边界 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| PHP provider 注册 | 固定源码有命令、argv、映射和共享 stdio 组装 | 实际宿主加载及版本兼容 |
| 缺 server 回退 | fallback 源码和测试断言可查 | 本轮未运行；配置故障是否误诊 |
| 四类导航 | 测试脚本逐项断言且真实 server lane 可跳过 | 实际正确率、速度与资源成本 |

> **思考**：apply 任意异常都被归为命令不可用，fallback 用默认扩展映射和默认命令日志，覆盖配置后可能误导诊断或丢失自定义后缀路由；这是源码风险，未在本轮复现。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：独立 PHP 包将固定服务器启动参数及语言映射接到共享 LSP 底座，减少逐项目重复接线；语言分析与协议能力归外部 server 和底座。详见[Q01](#research-q01)、[Q02](#research-q02)。

独立 PHP 包将固定服务器启动参数及语言映射接到共享 LSP 底座，减少逐项目重复接线；语言分析与协议能力归外部 server 和底座。详见[Q01](#research-q01)、[Q02](#research-q02)。

配置解析与共享底座默认 schema 接合，避免直接 apply 遗漏底座默认值；结构化 fallback 保留缺 server 时的 PHP 错误入口。catch 对所有 apply 错误一概命令不可用，且 fallback 未沿用自定义扩展映射与命令名，是具体可修订边界。权限自述不覆盖第三方 server 的文件和网络行为。

<a id="detail-section-5"></a>

### 1.4 主要限制

apply 任意异常都被归为命令不可用，fallback 用默认扩展映射和默认命令日志，覆盖配置后可能误导诊断或丢失自定义后缀路由；这是源码风险，未在本轮复现。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前建议观察；若能获得包并已配置底座，可先在隔离工作区检验四操作、故障提示和移除行为，再决定是否小范围试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置和 fallback 源码可核查；四操作真实效果、故障发生率与新诊断方案均未在本轮验证。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-php/README.md、dsh-lsp-php/package.json、dsh-lsp-php/src/index.ts、dsh-lsp-php/PERMISSIONS.md、dsh-lsp-php/tests/smoke.e2e.ts 及固定范围 inventory；组件：dsh-lsp-php。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中读取 PHP 组件 README、包清单、入口、权限自述与测试源码；未安装 server、执行测试或进行宿主验收。
- 下一步：用固定版本和隔离工作区分别核四操作、资源与缺 server/非法配置行为，再检查移除后的路由和进程；本轮只做静态阅读。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可让 fallback 保留解析后的路由，并按错误来源区分诊断；以默认/覆写命令、后缀与非法配置故障对照检验收益和新冲突。尚未实现。详见[Q05](#research-q05)。

用固定版本和隔离工作区分别核四操作、资源与缺 server/非法配置行为，再检查移除后的路由和进程；本轮只做静态阅读。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 139 | — | — | 971 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 177 | 128 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T05%3A09%3A16.325Z..2026-10-22T05%3A09%3A16.325Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A09%3A16.325Z..2026-10-22T05%3A09%3A16.325Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定提交的 PHP LSP 配置包增加的能力、依赖和失败边界，及个人开发者是否值得试用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · PHP 开发者得到什么，合格结果是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本包面向已在 DSH 工作区写 PHP、想让模型经 lsp 工具查定义、引用、实现和悬停信息的开发者。合格结果应是选中 .php 文件里的符号后，四种查询返回同一工作区的有用信息；仅安装包或注册 provider 不等于查询成功。README 明确它是配置包，本身没有实现 LSP 协议；服务接口、面向模型的工具、文件系统与子进程执行环境来自共享底座。

相对手工配置通用 stdio 适配器，本包预置 php provider、.php 到 php 的映射、intelephense --stdio 的命令和可覆写配置。这降低同一类 PHP 接线的重复步骤，但没有新增 PHP 语言分析算法。作者还给出 phpactor 替代命令；其效果同样由外部 server 决定。README 的即插即用说法必须附带已安装 server、底座装载和版本匹配条件。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-php/README.md:3-11](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/README.md#L3-L11)

作者把本包定义为配置包，明确四操作和共享底座归属。

```text
> PHP language configuration pack for DeepSeek Harness (DSH). Intelephense (default) or phpactor — PHP language servers.
> 中文：DSH 的 PHP LSP「即插即用」语言包 —— 装上本包，.php 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for PHP. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.
```

**依据 2 · 源码核查**：[dsh-lsp-php/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L28-L46)

源码预置 php provider、命令、argv 和扩展名映射。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-php'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'php'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'intelephense'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".php": "php"
}
```

</details>

**依据 3 · 作者声明**：[dsh-lsp-php/README.md:13-40](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/README.md#L13-L40)

作者给出两个外部语言服务器的安装和切换方式。

<details>
<summary>查看原文（28行）</summary>

````text
## Installing the language server (pick one)

**intelephense** (default; commercial license — premium features need a key):

```bash
npm install -g intelephense
```

**phpactor** (open source, MIT — recommended FOSS alternative):

```bash
composer global require phpactor/phpactor
# PATH must include $(composer config global home)/vendor/bin (default ~/.composer/vendor/bin)
```

To switch this pack to phpactor, override the command/args:

```yaml
- id: lsp-php
  name: '@dsh-lsp-packs/dsh-lsp-php'
  config:
    command: phpactor
    args: [language-server, --stdio]
```

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置合并和缺 server 后的路由如何工作，有什么边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

resolveServerConfig 用空值合并保留默认命令与 argv，把额外扩展名并入 .php 映射，再传递 env、初始化配置、消息和文档字节上限、关闭超时。apply 先用共享 stdio 的 Config schema 补全底座默认值，再调用其 apply。若这个调用抛错，它注册一个保留 .php 路由的 UnavailableProvider，查询时抛结构化 LSP_UNAVAILABLE，提示安装 server 并重载。这样错误仍留在语言查询入口，避免包加载失败就完全失去诊断。

边界很关键：catch 覆盖的是 LspStdio.apply 的任意异常，日志却都说命令 unavailable，可能把配置或底座故障误诊为可执行文件缺失。fallback 使用 DEFAULT_EXTENSION_TO_LANGUAGE 而非已解析的 server.extensionToLanguage，用户自定义后缀在失败状态不会保留路由。日志也固定写 DEFAULT_COMMAND，即使用户设置 phpactor 或绝对路径，也可能给出错误命令名。源码注释说缺命令时不会影响其余会话，但实际会话隔离与子进程资源边界依赖未在本组件实现的共享底座；本轮没有执行它。测试源码含默认值、缺 server 和真实 server 三类 lane，真实 server 不在 PATH 时自动跳过，所以存在测试脚本不等于四操作已在本次版本实际通过。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-php/src/index.ts:102-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L102-L118)

确认默认配置与覆写字段的具体合并。

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

**依据 2 · 源码核查**：[dsh-lsp-php/src/index.ts:120-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L120-L170)

确认 catch 范围、默认路由 fallback 和固定命令日志。

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

**依据 3 · 源码核查**：[dsh-lsp-php/tests/smoke.e2e.ts:48-101](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/tests/smoke.e2e.ts#L48-L101)

离线断言源码及真 server 的跳过条件。

<details>
<summary>查看原文（54行）</summary>

```text
// Lane 1: pack defaults ------------------------------------------------
describe('dsh-lsp-php pack defaults', () => {
  it('declares the README-default command, args, provider id, and extension table', () => {
    expect(Pack.name).toBe('lsp-php')
    expect(Pack.PROVIDER_ID).toBe('php')
    expect(Pack.inject).toEqual(['fs', 'lsp', 'subprocess'])
    expect(Pack.DEFAULT_COMMAND).toBe('intelephense')
    expect([...Pack.DEFAULT_ARGS]).toEqual(["--stdio"])
    expect({ ...Pack.DEFAULT_EXTENSION_TO_LANGUAGE }).toEqual({".php":"php"})
  })

  it('keeps defaults when no override is given and merges user overrides on top', () => {
    const defaults = Pack.resolveServerConfig({})
    expect(defaults.command).toBe('intelephense')
    expect([...defaults.args]).toEqual(["--stdio"])
    expect(defaults.extensionToLanguage).toEqual({".php":"php"})
    const overridden = Pack.resolveServerConfig({ command: '/custom/server', args: ['-x'] })
    expect(overridden.command).toBe('/custom/server')
    expect([...overridden.args]).toEqual(['-x'])
    expect(overridden.extensionToLanguage).toEqual({".php":"php"})
  })
})

// Lane 2: missing-server fallback (offline) ---------------------------
describe('dsh-lsp-php missing-server fallback', () => {
  let ctx: Context

  beforeAll(async () => {
    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack, { command: 'definitely-missing-php-server-xyz' })
  }, 20_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
  })

  it('loads without throwing and fails queries with a structured LSP_UNAVAILABLE error', async () => {
    const request: LspQueryRequest = {
      operation: 'goToDefinition',
      filePath: 'sample.php',
      position: { line: 0, character: 0 },
      workspaceRoot: process.cwd(),
    }
    await expect(ctx.lsp.query(request)).rejects.toThrow(
      expect.objectContaining({ code: 'LSP_UNAVAILABLE' }),
    )
  })
})

// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-php real server (intelephense)', () => {
```

</details>

#### 缺口

- 没有在本轮运行配置故障、自定义后缀和自定义命令失败场景。
  **影响**：不能量化误诊或失败后路由丢失的实际频率。
  **进一步探讨**：在隔离配置中分别注入不存在命令、非法 stdio 配置和自定义后缀，检查错误代码、日志与路由。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装、持续使用和失败恢复需要哪些条件？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

使用前须装入 DSH 的共享 LSP service、model-facing tool，以及同一执行环境的 fs/subprocess 配对，再安装本包和本机 PHP 语言服务器。包清单声明 Node >=22.18 与 DSH alpha 版本范围、Cordis 和多项 peer 依赖；npm 包名出现在 README 和 package，不能据此保证 registry 已发布，旧 META 请求为 404。若默认 intelephense 不适合，README 给出 phpactor command 与 args 覆写。server 的许可、安装、更新和工作区读取行为不由本包包内源码控制。

首次成本是配齐底座和外部 server、确认 PATH 与工作区匹配；现金费用取决于具体 server 许可或服务，未测，不填零。持续成本是本机 server 进程和文件索引资源、依赖升级兼容性及结果人工核对。故障时应先查 server 是否可执行、配置是否正确，再重载；fallback 在同一查询上报不可用。独立退出需要从 composition 移除本包并确认外部 server 进程与安装包是否还需保留，材料没有本轮卸载验收。PERMISSIONS.md 写该包不直接写文件或访问网络，这不覆盖它启动的第三方 server 的行为；其表中 server 命令与示例混用其他语言名称，须以 package 与 src/index.ts 的 PHP 默认值为准。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-php/README.md:72-91](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/README.md#L72-L91)

作者列出共享底座、安装与直接组合两种路径。

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-php    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-php  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-php
      name: '@dsh-lsp-packs/dsh-lsp-php'
```
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-php/package.json:1-73](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/package.json#L1-L73)

包清单标出兼容范围、分发入口和依赖。

<details>
<summary>查看原文（73行）</summary>

```text
{
  "name": "@dsh-lsp-packs/dsh-lsp-php",
  "version": "0.1.0",
  "description": "PHP LSP language configuration pack for DeepSeek Harness — Intelephense (default) or phpactor — PHP language servers.",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "cordis.yml",
    "README.md",
    "tests",
    "LICENSE",
    "PERMISSIONS.md"
  ],
  "keywords": [
    "deepseek-harness",
    "cordis",
    "lsp",
    "language-server",
    "php"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/988hj7tczd-oss/dsh-lsp-packs.git",
    "directory": "dsh-lsp-php"
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "prepare": "tsc -p tsconfig.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.yml"
    },
    "compatibility": {
      "node": ">=22.18.0",
      "dsh": ">=0.1.2-alpha.3 <0.2.0-0"
    },
    "permissions": {
      "summary": "PHP language pack: launches the configured language server with fixed argv and delegates the four LSP operations to the shared DSH LSP base.",
      "commands": [
        "intelephense --stdio (fixed argv, no shell)"
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
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-php/src/index.ts:31-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L31-L41)

运行依赖注入及默认命令由源码确认。

<details>
<summary>查看原文（11行）</summary>

```text
/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'php'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'intelephense'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]
```

</details>

**依据 4 · 作者声明**：[dsh-lsp-php/PERMISSIONS.md:6-30](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/PERMISSIONS.md#L6-L30)

权限自述限于本包；与 PHP 源码不一致的示例不当作已核实命令。

<details>
<summary>查看原文（25行）</summary>

```text
## 运行时行为
- **目的**：为 DeepSeek Harness 提供 `php` 语言的 LSP 四操作（goToDefinition / findReferences / goToImplementation / hover）。本包是**配置包**：复用官方 `@deepseek-ai/dsh-lsp-stdio` + `@deepseek-ai/dsh-tool-lsp` 底座，自身只组装/配置底座。
- **读取**：无直接文件读取；LSP 请求经底座 stdio 通道发给语言 server（对用户工作区文件的访问由语言 server 按其协议进行，受 DSH 宿主对进程的工作区约束）。
- **写入**：无。本包不写任何文件。
- **命令执行**：经底座以**固定 argv（非 shell）**启动语言 server 子进程：
  - `php-language-server（Intelephense 兼容） --stdio`（具体 argv 由包内配置的 command/args 定义）
  命令行任何位置不拼接用户/模型输入。
- **网络**：无。语言 server 为本地进程；本包不发起任何网络请求。
- **凭据/密钥**：不读取、不写、不转发。
- **外部服务**：无。
- **全局资源**：不安装全局包、不改宿主配置之外的内容。

## 依赖
| 依赖 | 用途 | 提供方 |
|---|---|---|
| Node.js ≥ 22.18 | 插件加载 | DSH 宿主 |
| @deepseek-ai/cordis / @deepseek-ai/dsh-lsp / @deepseek-ai/dsh-lsp-stdio / @deepseek-ai/dsh-tool-lsp / schemastery | DSH 宿主提供的运行时服务（peer/底座） | DSH 宿主 |
| php 语言 server | LSP 服务进程 | 主机预装（如 clangd、rust-analyzer） |

## 文件权限信号说明
- 运行时**不**执行 `chmod`/`chown`；不创建可执行文件。
- 不依赖可执行位（server 以固定命令调用）；仓库文件均以 644 提交，无 setuid/setgid/sticky 信号。

## 失败边界（结构化，绝不静默）
- 语言 server 缺失/不可用 → 结构化 `LSP_UNAVAILABLE` 错误（带提示），**其他工具不受影响**（fallback 断言覆盖）。
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 四操作效果和完整成本由哪些材料支持？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

可直接核实的是本包配置、provider 注册和已有测试断言，而非 PHP 导航效果。测试第三 lane 用临时 sample.php 分别断言定义、引用、实现和 hover，但当 intelephense 探测不可运行会跳过；本轮只读脚本，没有运行它。作者说缺 server 时其他工具继续工作，测试只具体断言本查询收到 LSP_UNAVAILABLE，并未在同一 lane 实测其他工具。因此效果表中的四操作属于设计与作者测试目标，实际正确率、跨项目索引延迟和故障恢复都未知。

首次投入是底座、server、配置和首次索引；持续投入含进程内存、索引 CPU/磁盘和人工判断导航结果；失败恢复还要定位到底是 server、配置还是底座，并可能重载。源码允许消息、文档和关停上限覆写，但这些上限由共享底座执行，不能把配置字段存在等同于此组件已验证的资源上界。现金与人工时间没有本轮计量，不能把可配置或 auto-skip 测试写成已验证收益。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-php/tests/smoke.e2e.ts:24-47](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/tests/smoke.e2e.ts#L24-L47)

语言服务器探测决定真实 lane 是否运行。

<details>
<summary>查看原文（24行）</summary>

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

const installed = probeServer('intelephense')

const prebuild = null
// `built` flips in beforeAll when a pack declares a prebuild (e.g. `swift build`);
// build-dependent operations skip when it fails.
let built = prebuild === null

```

</details>

**依据 2 · 源码核查**：[dsh-lsp-php/tests/smoke.e2e.ts:100-176](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/tests/smoke.e2e.ts#L100-L176)

四操作仅是可执行测试源码，并非本轮执行证据。

<details>
<summary>查看原文（77行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-php real server (intelephense)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-php-')))
    ws = join(root, 'proj')
    await mkdir(ws)

    await writeFile(join(ws, 'sample.php'), [
      '<?php',
      'function add(int $a, int $b): int {',
      '    return $a + $b;',
      '}',
      '',
      '$x = add(1, 2);',
      'echo $x;',
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
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.php'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 6, col 6 is the symbol under test in sample.php.
    const result = await ctx.lsp.query(at('goToDefinition', 6, 6))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 2, col 10 is the symbol under test in sample.php.
    const result = await ctx.lsp.query(at('findReferences', 2, 10))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async () => {

    // Line 6, col 6 is the symbol under test in sample.php.
    const result = await ctx.lsp.query(at('goToImplementation', 6, 6))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `add` name (line 2, col 10).
    const result = await ctx.lsp.query(at('hover', 2, 10))
    expect(result.kind).toBe('hover')
    if (result.kind === 'hover') {
      if (result.hover !== null) expect(result.hover.contents).toContain('add')
    }
  }, 60_000)
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-php/src/index.ts:53-90](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L53-L90)

可覆写的资源边界字段确实暴露，但实现位于共享底座。

<details>
<summary>查看原文（38行）</summary>

```text
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
```

</details>

#### 缺口

- 没有本版本真实 PHP 工作区任务的正确率和资源对照。
  **影响**：不能声称有净效率收益，也无法比较 intelephense 与 phpactor。
  **进一步探讨**：在相同项目和符号集合中测四操作有效返回、首查时间、索引资源以及误结果人工复核量。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何评价增量、提出改进假设并决定采用？

**研究主题**：新假设与验证、采用判断、贡献与相对优势

#### 完整回答

现有增量是把 PHP 的 server 命令和语言映射以独立包接到共享 stdio 底座，便于同一个底座复用到多个语言；共享 LSP 协议和查询能力归底座及 server，不计为此包原创。对有现成 DSH LSP 底座、愿意自管 server 的 PHP 开发者，可在隔离工作区观察或小范围试用；但此提交的诊断误指、自定义后缀 fallback 缺失和 npm 发布状态不明，当前建议观察，先核材料与取得安装/功能/移除证据。源码级缺陷是静态风险，本轮未复现。

可探索把 fallback 和诊断绑定到解析后的 server 配置，并区分缺可执行文件、配置验证与底座 apply 故障。这样有望减少错误恢复成本，同时保留自定义后缀的错误入口；这仍是未实现的设计假设。最小验证在同一固定版本构造默认/覆写命令、自定义扩展名、无命令、非法配置四组故障，对照修改前后 query 错误代码、诊断准确率和其余工具可用性。若新机制导致额外路由冲突或隐藏真正底座故障，则不成立。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-php/src/index.ts:102-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L102-L118)

基于已解析配置提出诊断与路由假设。

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

**依据 2 · 源码核查**：[dsh-lsp-php/src/index.ts:152-170](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/src/index.ts#L152-L170)

现有 catch 与默认 fallback 是可核查比较基线。

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

**依据 3 · 作者声明**：[dsh-lsp-php/README.md:93-104](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-php/README.md#L93-L104)

作者测试说明真实 server lane 可能跳过，不作为本轮验收。

<details>
<summary>查看原文（12行）</summary>

````text
## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-php   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.php`;
  it **auto-skips** when `intelephense` is not on PATH.

Both servers resolve same-file symbols without a composer project; phpactor needs a PHP runtime on PATH.
````

</details>

#### 缺口

- 诊断分流和解析后路由能否减少排错时间尚未实现或对照。
  **影响**：假设不能算现有创新，也不能据此提高推荐。
  **进一步探讨**：按四组故障输入对比错误可解释性、路由完整性和新冲突。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
