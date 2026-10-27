# dsh-lsp-ts

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：以外部 TypeScript language server 为 TS/JS 文件提供四扩展路由的 DSH LSP 配置包。

> **核心亮点**：减少 TS/JS LSP 命令和语言 id 装配；协议由共享基座实现，详见[Q01](#research-q01)。

> **风险与缺陷**：宽 catch 可能误判配置故障，fallback 丢失自定义扩展；详见[Q02](#research-q02)。

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
  - [Q01 · TypeScript/JavaScript 导航由语言包还是共享基座提供？](#detail-section-11)
  - [Q02 · 缺服 fallback 是否覆盖自定义映射并能区分故障？](#detail-section-12)
  - [Q03 · 采用前提和已有测试证据到哪里？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复怎样核算成本与效果？](#detail-section-14)
  - [Q05 · 怎样证伪故障分层与保留映射能改善扩展恢复？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中查询 TS、TSX、JS、JSX 文件的定义、引用、实现、hover。

手工在共享 LSP 配置注册 typescript-language-server 和四扩展映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 条件 | 边界 |
| --- | --- | --- |
| 四扩展 LSP 路由 | 外部 server 与共享基座 | 真实项目未验证 |
| 缺服 fallback | 初始化异常 | 宽 catch 误归因及自定义路由丢失 |

**流程与依赖**

DSH LSP service/tool、fs/subprocess、typescript-language-server 和建议的 TypeScript。

安装服务器与 TypeScript→挂共享基座→安装包→测试四扩展导航。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部typescript-language-server/建议typescript与共享基座下载/磁盘，价格未知 | 核PATH、DSH执行世界、四language id和项目配置，工时未知 | 包不装server，单sample.ts无tsconfig不等所有项目适配 |
| 持续使用 | 共享stdio按需起server，tsserver工作区索引/文档/内存，量未知 | 核TS/TSX/JS/JSX导航及tsconfig边界，工时未知 | 延迟启动/进程预算是基座职责；不推项目资源零成本 |
| 失败恢复 | server重启/重索引或依赖重装资源，金额未知 | 区分缺命令、配置/注册故障，恢复自定义扩展路由，工时未知 | fallback保默认四扩展但丢自定义，真实恢复率未知 |

减少手工配置四种扩展；导航质量取决于外部服务器。

> **思考**：宽 catch 可能误判配置故障，fallback 丢失自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少 TS/JS LSP 命令和语言 id 装配；协议由共享基座实现，详见[Q01](#research-q01)。

减少 TS/JS LSP 命令和语言 id 装配；协议由共享基座实现，详见[Q01](#research-q01)。

配置覆盖合并；LspStdio 延迟启动；缺服异常由 fallback 返回 LSP_UNAVAILABLE。

<a id="detail-section-5"></a>

### 1.4 主要限制

宽 catch 可能误判配置故障，fallback 丢失自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核主机 server、共享基座，再在真实 TS/TSX/JS/JSX 项目试四操作；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持路由和缺服 fallback；真实服务及四扩展项目导航未验证。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-ts/README.md、dsh-lsp-ts/package.json、dsh-lsp-ts/src/index.ts、dsh-lsp-ts/tests/smoke.e2e.ts、dsh-lsp-ts/cordis.yml 及固定范围 inventory；组件：dsh-lsp-ts。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 dsh-lsp-ts 子组件；未运行语言服务器或插件。
- 下一步：测缺服/非法配置/自定义扩展，以及真实多文件 TS/JS 四操作。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

故障分类并让fallback保留合并映射，可证伪对照及代价见[Q05](#research-q05)。

测缺服/非法配置/自定义扩展，以及真实多文件 TS/JS 四操作。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 127 | — | — | 947 |
| .ts | source | 1 | 174 | 98 | 60 | — |
| .ts | test | 1 | 175 | 126 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T07%3A59%3A37.158Z..2026-10-22T07%3A59%3A37.158Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A59%3A37.158Z..2026-10-22T07%3A59%3A37.158Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 TypeScript/JavaScript LSP 薄包的四扩展映射、外部服务器要求及缺服降级。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · TypeScript/JavaScript 导航由语言包还是共享基座提供？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

包仅把 .ts/.tsx/.js/.jsx 映射至四个 LSP language id，并以 typescript-language-server --stdio 注册 ts provider；协议、进程托管与模型侧 lsp 工具依赖共享基座。README 指引另行安装 typescript-language-server 和 typescript，包不下载服务器。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ts/src/index.ts:21-49](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L21-L49)

注入依赖、provider、命令、参数和四扩展映射。

<details>
<summary>查看原文（29行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { LspError, LspProviderId } from '@deepseek-ai/dsh-lsp'
import type { LspProvider, LspProviderQuery, LspQueryResult } from '@deepseek-ai/dsh-lsp'
import * as LspStdio from '@deepseek-ai/dsh-lsp-stdio'
import type { LspLocalServerConfig } from '@deepseek-ai/dsh-lsp-stdio'

/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-ts'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'ts'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'typescript-language-server'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".ts": "typescript",
    ".tsx": "typescriptreact",
    ".js": "javascript",
    ".jsx": "javascriptreact"
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-ts/src/index.ts:155-163](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L155-L163)

把解析后的服务器配置交给共享 LspStdio。

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

**依据 3 · 作者声明**：[dsh-lsp-ts/README.md:6-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/README.md#L6-L25)

声明薄包和外部服务器安装前提。

<details>
<summary>查看原文（20行）</summary>

````text
This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for TypeScript / JavaScript. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

```bash
npm install -g typescript-language-server typescript
# or: yarn global add typescript-language-server typescript
# or: pnpm add -g typescript-language-server typescript
```

The server embeds its own `tsserver`; installing `typescript` next to it is still recommended.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

#### 缺口

- 未启动真实 TypeScript language server
  **影响**：跨文件定义、引用与项目配置下表现未知
  **进一步探讨**：在真实 TS/JS 项目试四操作和跨文件导航

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺服 fallback 是否覆盖自定义映射并能区分故障？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

正常配置合并自定义 extensionToLanguage；但 Config 和 apply 的全部异常被同一个 catch 归因为默认命令不可用，fallback 只用默认四扩展注册。若自定义 .xyz，降级时该路由丢失。resolveServerConfig 在 try 之前，也并非所有加载错误都可降级。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ts/src/index.ts:105-120](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L105-L120)

用户扩展覆盖合并与配置生成。

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

**依据 2 · 源码核查**：[dsh-lsp-ts/src/index.ts:123-173](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L123-L173)

LSP_UNAVAILABLE fallback、宽 catch 与默认映射。

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

**依据 3 · 作者声明**：[dsh-lsp-ts/README.md:34-58](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/README.md#L34-L58)

声明 lazy start、缺服降级和自定义覆盖。

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
- id: lsp-ts
  name: '@dsh-lsp-packs/dsh-lsp-ts'
  config:
    command: /absolute/path/to/typescript-language-server
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

- 未模拟配置/注册错误和自定义扩展缺服
  **影响**：用户可见错误与路由范围需实测
  **进一步探讨**：隔离分别测试缺 binary、配置异常和自定义扩展

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用前提和已有测试证据到哪里？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

需 DSH LSP service/tool 与同执行世界的 fs/subprocess，主机需有 typescript-language-server（推荐另装 typescript）。源码包含默认值、缺服两条离线测试及有 server 才运行的四操作单文件 sample.ts 测试；存在测试代码不代表本研究运行通过，也未覆盖 TS/JS 多文件项目或四扩展各自行为。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-ts/README.md:13-25](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/README.md#L13-L25)

外部安装及 TypeScript 依赖说明。

<details>
<summary>查看原文（13行）</summary>

````text
## Installing the language server

```bash
npm install -g typescript-language-server typescript
# or: yarn global add typescript-language-server typescript
# or: pnpm add -g typescript-language-server typescript
```

The server embeds its own `tsserver`; installing `typescript` next to it is still recommended.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 作者声明**：[dsh-lsp-ts/README.md:60-92](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/README.md#L60-L92)

共享基座挂载、测试 lane 和单文件范围。

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-ts    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-ts  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-ts
      name: '@dsh-lsp-packs/dsh-lsp-ts'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-ts   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.ts`;
  it **auto-skips** when `typescript-language-server` is not on PATH.

No `tsconfig.json` is required for single-file queries; this mirrors the pinned upstream TS e2e.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-ts/tests/smoke.e2e.ts:24-101](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/tests/smoke.e2e.ts#L24-L101)

binary 探测、离线默认和缺服测试、真实 lane 自动 skip。

<details>
<summary>查看原文（78行）</summary>

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

const installed = probeServer('typescript-language-server')

const prebuild = null
// `built` flips in beforeAll when a pack declares a prebuild (e.g. `swift build`);
// build-dependent operations skip when it fails.
let built = prebuild === null

// Lane 1: pack defaults ------------------------------------------------
describe('dsh-lsp-ts pack defaults', () => {
  it('declares the README-default command, args, provider id, and extension table', () => {
    expect(Pack.name).toBe('lsp-ts')
    expect(Pack.PROVIDER_ID).toBe('ts')
    expect(Pack.inject).toEqual(['fs', 'lsp', 'subprocess'])
    expect(Pack.DEFAULT_COMMAND).toBe('typescript-language-server')
    expect([...Pack.DEFAULT_ARGS]).toEqual(["--stdio"])
    expect({ ...Pack.DEFAULT_EXTENSION_TO_LANGUAGE }).toEqual({".ts":"typescript",".tsx":"typescriptreact",".js":"javascript",".jsx":"javascriptreact"})
  })

  it('keeps defaults when no override is given and merges user overrides on top', () => {
    const defaults = Pack.resolveServerConfig({})
    expect(defaults.command).toBe('typescript-language-server')
    expect([...defaults.args]).toEqual(["--stdio"])
    expect(defaults.extensionToLanguage).toEqual({".ts":"typescript",".tsx":"typescriptreact",".js":"javascript",".jsx":"javascriptreact"})
    const overridden = Pack.resolveServerConfig({ command: '/custom/server', args: ['-x'] })
    expect(overridden.command).toBe('/custom/server')
    expect([...overridden.args]).toEqual(['-x'])
    expect(overridden.extensionToLanguage).toEqual({".ts":"typescript",".tsx":"typescriptreact",".js":"javascript",".jsx":"javascriptreact"})
  })
})

// Lane 2: missing-server fallback (offline) ---------------------------
describe('dsh-lsp-ts missing-server fallback', () => {
  let ctx: Context

  beforeAll(async () => {
    ctx = new Context()
    await ctx.plugin(Lsp)
    await ctx.plugin(LocalSubprocessRuntime)
    await ctx.plugin(LocalFileSystem, { cwd: process.cwd() })
    await ctx.plugin(Pack, { command: 'definitely-missing-ts-server-xyz' })
  }, 20_000)

  afterAll(async () => {
    if (ctx) await ctx.fiber.dispose()
  })

  it('loads without throwing and fails queries with a structured LSP_UNAVAILABLE error', async () => {
    const request: LspQueryRequest = {
      operation: 'goToDefinition',
      filePath: 'sample.ts',
      position: { line: 0, character: 0 },
      workspaceRoot: process.cwd(),
    }
    await expect(ctx.lsp.query(request)).rejects.toThrow(
      expect.objectContaining({ code: 'LSP_UNAVAILABLE' }),
    )
  })
})

// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-ts real server (typescript-language-server)', () => {
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-ts/tests/smoke.e2e.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/tests/smoke.e2e.ts#L100-L175)

仅 sample.ts 的四操作测试。

<details>
<summary>查看原文（76行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-ts real server (typescript-language-server)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-ts-')))
    ws = join(root, 'proj')
    await mkdir(ws)

    await writeFile(join(ws, 'sample.ts'), [
      'export function add(a: number, b: number): number {',
      '  return a + b',
      '}',
      '',
      'export const result = add(1, 2)',
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
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.ts'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 5, col 23 is the symbol under test in sample.ts.
    const result = await ctx.lsp.query(at('goToDefinition', 5, 23))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 1, col 17 is the symbol under test in sample.ts.
    const result = await ctx.lsp.query(at('findReferences', 1, 17))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async () => {

    // Line 5, col 23 is the symbol under test in sample.ts.
    const result = await ctx.lsp.query(at('goToImplementation', 5, 23))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `add` name (line 1, col 17).
    const result = await ctx.lsp.query(at('hover', 1, 17))
    expect(result.kind).toBe('hover')
    if (result.kind === 'hover') {
      if (result.hover !== null) expect(result.hover.contents).toContain('number')
    }
  }, 60_000)
})
```

</details>

#### 缺口

- 未运行真实服务器或 TS/JS 项目矩阵
  **影响**：四扩展和项目索引的实际适配未知
  **进一步探讨**：在 TS/TSX/JS/JSX 多文件项目与不同 tsconfig 下试用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复怎样核算成本与效果？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部typescript-language-server/建议typescript与共享基座下载/磁盘，价格未知 | 核PATH、DSH执行世界、四language id和项目配置，工时未知 | 包不装server，单sample.ts无tsconfig不等所有项目适配 |
| 持续使用 | 共享stdio按需起server，tsserver工作区索引/文档/内存，量未知 | 核TS/TSX/JS/JSX导航及tsconfig边界，工时未知 | 延迟启动/进程预算是基座职责；不推项目资源零成本 |
| 失败恢复 | server重启/重索引或依赖重装资源，金额未知 | 区分缺命令、配置/注册故障，恢复自定义扩展路由，工时未知 | fallback保默认四扩展但丢自定义，真实恢复率未知 |

以同一多文件TS/JS项目可核对的四操作结果为验收单位，人工配置同一server作为基线。此包省命令/映射接线，不新增类型检查器或资源调度；项目索引资源、四扩展差异、安装和恢复工时未知。源码测试只设计sample.ts四操作，不能用其存在替代矩阵表现或推净省费。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ts/src/index.ts:28-49](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L28-L49)

命令和四扩展

<details>
<summary>查看原文（22行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-ts'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'ts'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'typescript-language-server'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".ts": "typescript",
    ".tsx": "typescriptreact",
    ".js": "javascript",
    ".jsx": "javascriptreact"
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-ts/src/index.ts:105-120](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L105-L120)

预算/配置转交

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

**依据 3 · 源码核查**：[dsh-lsp-ts/src/index.ts:155-173](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L155-L173)

stdio调用与fallback

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

- 实际项目大小、tsconfig/混合JS配置和资源耗量未知
  **影响**：无法给出项目级总拥有成本或导航收益幅度
  **进一步探讨**：从相同项目人工配置与包配置的资源/正确结果记录入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪故障分层与保留映射能改善扩展恢复？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定配置正常合并扩展但catch把Config/apply异常统一说成默认命令不可用，fallback回到默认四扩展，resolve仍在try外。相对当前统一fallback，设计假设是分开配置解析/命令定位/provider注册错误，并让降级路由复用已合并映射，能减少自定义.xyz路由丢失和错误归因。条件是共享基座提供可区分错误阶段、失败注册可清理；代价是错误契约、状态及兼容维护。最小对照在同一配置样本覆盖四默认扩展和.xyz、缺binary、非法配置、重复provider和正常注册，比较原版与隔离原型的路由、错误归因、其他语言可用性及恢复步骤。若扩展仍丢、配置失败仍称缺binary或残留注册阻断恢复，假设被证伪；即便分层正确也不代表真实TS/JS导航质量提高。方案未实现或执行，项目矩阵需独立核对。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-ts/src/index.ts:105-120](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L105-L120)

合并扩展

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

**依据 2 · 源码核查**：[dsh-lsp-ts/src/index.ts:123-173](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-ts/src/index.ts#L123-L173)

fallback与try边界

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

- 共享基座的错误分类/失败清理契约未知，方案未实现
  **影响**：不能声称所有初始化错误可安全降级
  **进一步探讨**：从固定基座错误原文及隔离状态差异入手

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
