# dsh-lsp-lua

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
<!-- END META -->

> **实现功能**：以 lua-language-server 为外部服务器的 Lua LSP 配置包，默认 --stdio 与 .lua→lua。

> **核心亮点**：减少 Lua LSP 装配；不实现协议，详见[Q01](#research-q01)。

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
  - [Q01 · Lua 导航功能由配置包还是 lua-language-server/共享基座提供？](#detail-section-11)
  - [Q02 · 缺服降级是否保留自定义扩展并准确区分故障？](#detail-section-12)
  - [Q03 · 在 Lua 工程采用的条件和证据范围是什么？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复分别消耗什么？](#detail-section-14)
  - [Q05 · 怎样证伪保留扩展并区分失败原因能改善降级诊断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中查询 Lua 文件定义、引用、实现、hover。

手工在共享 LSP 配置增加 lua-language-server 与 .lua 映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 条件 | 边界 |
| --- | --- | --- |
| .lua LSP 路由 | LuaLS 与共享基座 | 单文件测试仅设计 |
| 缺服 fallback | 初始化异常 | 宽 catch 误归因 |

**流程与依赖**

DSH LSP service/tool、fs/subprocess 与 LuaLS。

安装 LuaLS→挂共享基座→安装包→测 Lua 文件/模块导航。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部LuaLS与共享LSP基座安装磁盘/下载，价格未知 | 配PATH/命令/工作区及扩展表，核版本，工时未知 | 包不附服务器，单文件lane不是项目兼容证明 |
| 持续使用 | 基座按需启动LuaLS，项目索引/文档与协议进程资源，实际耗量未知 | 核导航语义及扩展路由，工时未知 | 默认预算由共享stdio实现填充，不把此包当新索引算法 |
| 失败恢复 | 重装/重启服务器与重新索引资源，金额未知 | 区分配置/命令/注册失败，恢复自定义扩展，工时未知 | 宽catch可能误报缺服；fallback只保默认.lua，真实恢复率未知 |

减少手工维护 LuaLS 命令与路由；实际导航待测。

> **思考**：宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：减少 Lua LSP 装配；不实现协议，详见[Q01](#research-q01)。

减少 Lua LSP 装配；不实现协议，详见[Q01](#research-q01)。

配置覆盖合并；通过 LspStdio 启动；异常 fallback 用 LSP_UNAVAILABLE。

<a id="detail-section-5"></a>

### 1.4 主要限制

宽 catch 可能误判故障，fallback 不保留自定义扩展；详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先核 lua-language-server --stdio 和共享基座，再以真实 Lua 模块试四操作；详见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持命令/路由及降级；真实 LuaLS 运行未验证。

- 已检查：作者 README、包清单、源码路径 dsh-lsp-lua/README.md、dsh-lsp-lua/package.json、dsh-lsp-lua/src/index.ts、dsh-lsp-lua/tests/smoke.e2e.ts、dsh-lsp-lua/cordis.yml 及固定范围 inventory；组件：dsh-lsp-lua。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅固定提交的 dsh-lsp-lua 子组件；未运行服务器或插件。
- 下一步：隔离测缺服/配置失败/自定义扩展，真实 Lua 模块和 implementation。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-lsp-packs](https://github.com/988hj7tczd-oss/dsh-lsp-packs)
- **版本号**：0.1.0（[固定提交 258bb64](https://github.com/988hj7tczd-oss/dsh-lsp-packs/tree/258bb6409c504fa1eed20b6f70d13009522ca0ce)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

保留合并扩展并区分配置、服务器和注册错误，反证条件与代价见[Q05](#research-q05)。

隔离测缺服/配置失败/自定义扩展，真实 Lua 模块和 implementation。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 126 | — | — | 932 |
| .ts | source | 1 | 171 | 95 | 60 | — |
| .ts | test | 1 | 175 | 126 | 25 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+created%3A2026-09-22T07%3A46%3A46.346Z..2026-10-22T07%3A46%3A46.346Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/988hj7tczd-oss/dsh-lsp-packs/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T07%3A46%3A46.346Z..2026-10-22T07%3A46%3A46.346Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 LuaLS 配置包的 --stdio、单文件前提和故障降级。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Lua 导航功能由配置包还是 lua-language-server/共享基座提供？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

该薄包注册 lua provider，.lua→lua，以 lua-language-server --stdio 启动外部服务器；LSP 协议和模型工具来自共享基座。包不安装 LuaLS，README 给出 brew/scoop/release 安装方式。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-lua/README.md:3-27](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/README.md#L3-L27)

声明薄配置包、lua-language-server 外部安装。

<details>
<summary>查看原文（25行）</summary>

````text
> Lua language configuration pack for DeepSeek Harness (DSH). lua-language-server — LuaLS, the reference Lua language server.
> 中文：DSH 的 Lua LSP「即插即用」语言包 —— 装上本包，.lua 文件即可用 `lsp` 工具做代码导航。

This pack is one Cordis configuration plugin: it registers a configured
`@deepseek-ai/dsh-lsp-stdio` instance on `ctx.lsp` with the server command, launch
arguments, and extension mapping for Lua. It implements **no LSP protocol** —
the shared base does: `@deepseek-ai/dsh-lsp` (the seam) + `@deepseek-ai/dsh-tool-lsp` (the
model-facing `lsp` tool with `goToDefinition` / `findReferences` / `goToImplementation` /
`hover`). Twelve packs reuse one unchanged base.

## Installing the language server

```bash
# Homebrew:
brew install lua-language-server
# scoop:
scoop install lua-language-server
# or download a release binary from github.com/LuaLS/lua-language-server
```

`lua-language-server` must be on `PATH`; stdio mode is requested with `--stdio`, which this pack passes by default.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 源码核查**：[dsh-lsp-lua/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L28-L46)

provider、注入依赖、默认命令与单扩展表。

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-lua'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'lua'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'lua-language-server'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".lua": "lua"
}
```

</details>

**依据 3 · 源码核查**：[dsh-lsp-lua/src/index.ts:152-160](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L152-L160)

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

- 未启动 LuaLS
  **影响**：真实 Lua 模块导航/诊断未知
  **进一步探讨**：在真实 Lua 项目试四项导航

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 缺服降级是否保留自定义扩展并准确区分故障？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

正常配置会合并自定义扩展；LspStdio.Config/apply 被一个 catch 包住，错误一律描述为 lua-language-server 不可用，并用 DEFAULT_EXTENSION_TO_LANGUAGE 注册 fallback。因此配置/注册问题可被误归因，自定义扩展在降级时消失。resolveServerConfig 在 try 外，仍可向外抛。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-lua/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L103-L118)

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

**依据 2 · 源码核查**：[dsh-lsp-lua/src/index.ts:120-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L120-L169)

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

**依据 3 · 作者声明**：[dsh-lsp-lua/README.md:33-57](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/README.md#L33-L57)

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
- id: lsp-lua
  name: '@dsh-lsp-packs/dsh-lsp-lua'
  config:
    command: /absolute/path/to/lua-language-server
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

### Q03 · 在 Lua 工程采用的条件和证据范围是什么？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

需已有共享 LSP service/tool 和 fs/subprocess，且 lua-language-server 在 DSH PATH。测试源码有默认值、缺服两条离线 lane；真实 LuaLS lane 在 binary 缺失时 skip，以单文件 sample.lua 测四项工具，未要求项目 manifest。由于 goToImplementation 对简单函数的结果取决于 LuaLS 语义，测试存在不等于已通过。实际工作区索引/诊断和 --stdio 支持需宿主验证。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-lsp-lua/README.md:13-27](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/README.md#L13-L27)

lua-language-server 安装路径与外部依赖。

<details>
<summary>查看原文（15行）</summary>

````text
## Installing the language server

```bash
# Homebrew:
brew install lua-language-server
# scoop:
scoop install lua-language-server
# or download a release binary from github.com/LuaLS/lua-language-server
```

`lua-language-server` must be on `PATH`; stdio mode is requested with `--stdio`, which this pack passes by default.

> ⚠️ The plugin itself **never downloads or installs the server binary** — matching the
> upstream anthropics LSP plugins, the server is an external prerequisite. The plugin only
> resolves and launches it.
````

</details>

**依据 2 · 作者声明**：[dsh-lsp-lua/README.md:59-95](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/README.md#L59-L95)

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
dsh plugin add @dsh-lsp-packs/dsh-lsp-lua    # published name
dsh plugin add /path/to/dsh-lsp-packs/dsh-lsp-lua  # or a local checkout
```

or compose the row directly (name resolved from the installed package):

```yaml
- insert:
    - id: lsp-lua
      name: '@dsh-lsp-packs/dsh-lsp-lua'
```

## Smoke test

```bash
pnpm vitest run --dir dsh-lsp-lua   # or from the repo root: pnpm test
```

- Lane 1 (offline): asserts the defaults (command / args / extension table / provider id).
- Lane 2 (offline): asserts the missing-server fallback returns `LSP_UNAVAILABLE`.
- Lane 3 (needs the server): runs the four `lsp` operations against `sample.lua`;
  it **auto-skips** when `lua-language-server` is not on PATH.

LuaLS indexes single files without a project manifest.

## License

MIT — see `LICENSE`. The server binary is a third-party component with its own license.
````

</details>

**依据 3 · 源码核查**：[dsh-lsp-lua/tests/smoke.e2e.ts:24-41](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/tests/smoke.e2e.ts#L24-L41)

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

const installed = probeServer('lua-language-server')
```

</details>

**依据 4 · 源码核查**：[dsh-lsp-lua/tests/smoke.e2e.ts:100-175](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/tests/smoke.e2e.ts#L100-L175)

Lua 单文件测试与四操作。

<details>
<summary>查看原文（76行）</summary>

```text
// Lane 3: real server (auto-skip when not installed) ------------------
describe.skipIf(!installed)('dsh-lsp-lua real server (lua-language-server)', () => {
  let ctx: Context
  let ws: string
  let root: string

  beforeAll(async () => {
    root = await realpath(await mkdtemp(join(tmpdir(), 'dsh-lsp-lua-')))
    ws = join(root, 'proj')
    await mkdir(ws)

    await writeFile(join(ws, 'sample.lua'), [
      'local function add(a, b)',
      '    return a + b',
      'end',
      '',
      'local result = add(1, 2)',
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
  function at(operation: LspQueryRequest['operation'], line1: number, char1: number, filePath = 'sample.lua'): LspQueryRequest {
    return { operation, filePath, position: { line: line1 - 1, character: char1 - 1 }, workspaceRoot: ws }
  }

  it('goToDefinition resolves the definition at a call site', async () => {

    // Line 5, col 16 is the symbol under test in sample.lua.
    const result = await ctx.lsp.query(at('goToDefinition', 5, 16))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('findReferences finds references to the symbol including its declaration', async () => {

    // Line 1, col 16 is the symbol under test in sample.lua.
    const result = await ctx.lsp.query(at('findReferences', 1, 16))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('goToImplementation resolves the implementation of the symbol', async () => {

    // Line 5, col 16 is the symbol under test in sample.lua.
    const result = await ctx.lsp.query(at('goToImplementation', 5, 16))
    expect(result.kind).toBe('locations')
    if (result.kind === 'locations') {
      expect(result.locations.length).toBeGreaterThanOrEqual(1)
    }
  }, 60_000)

  it('returns hover information for a typed symbol', async () => {
    // Hover on the declaring `add` name (line 1, col 16).
    const result = await ctx.lsp.query(at('hover', 1, 16))
    expect(result.kind).toBe('hover')
    if (result.kind === 'hover') {
      if (result.hover !== null) expect(result.hover.contents).toContain('add')
    }
  }, 60_000)
})
```

</details>

#### 缺口

- 未运行真实 LuaLS lane
  **影响**：四操作尤其 implementation 的结果未知
  **进一步探讨**：在真实 Lua 文件及模块间引用中试四操作

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复分别消耗什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 外部LuaLS与共享LSP基座安装磁盘/下载，价格未知 | 配PATH/命令/工作区及扩展表，核版本，工时未知 | 包不附服务器，单文件lane不是项目兼容证明 |
| 持续使用 | 基座按需启动LuaLS，项目索引/文档与协议进程资源，实际耗量未知 | 核导航语义及扩展路由，工时未知 | 默认预算由共享stdio实现填充，不把此包当新索引算法 |
| 失败恢复 | 重装/重启服务器与重新索引资源，金额未知 | 区分配置/命令/注册失败，恢复自定义扩展，工时未知 | 宽catch可能误报缺服；fallback只保默认.lua，真实恢复率未知 |

以同一Lua项目能得到可核对的导航结果为成本单位；相比手配同一LuaLS和基座，本包减少配置接线，不减少外部服务器的索引职责，也没有本地测量支持净CPU/模型费节约。安装时间、大项目资源、implementation语义和失败恢复耗时未知。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-lua/src/index.ts:28-46](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L28-L46)

外部命令与共享服务

<details>
<summary>查看原文（19行）</summary>

```text
/** Cordis plugin name for loader diagnostics. */
export const name = 'lsp-lua'

/** Services required by the shared LSP base this pack assembles. */
export const inject = ['fs', 'lsp', 'subprocess']

/** Stable provider id reserved on `ctx.lsp` by this pack. */
export const PROVIDER_ID = 'lua'

/** Default server command (absolute path or PATH-resolved executable, no shell). */
export const DEFAULT_COMMAND = 'lua-language-server'

/** Default launch arguments. */
export const DEFAULT_ARGS: readonly string[] = ["--stdio"]

/** Default lowercase leading-dot extension → LSP language id table. */
export const DEFAULT_EXTENSION_TO_LANGUAGE: Readonly<Record<string, string>> = {
    ".lua": "lua"
}
```

</details>

**依据 2 · 源码核查**：[dsh-lsp-lua/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L103-L118)

配置覆盖和预算转交

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

**依据 3 · 源码核查**：[dsh-lsp-lua/src/index.ts:152-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L152-L169)

共享stdio与fallback

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

#### 缺口

- 实际项目规模、LuaLS资源和配置恢复工时未知
  **影响**：不能估算总成本或效果提升幅度
  **进一步探讨**：从相同项目的人工配置记录、服务器资源与导航真值入手

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪保留扩展并区分失败原因能改善降级诊断？

**研究主题**：新假设与验证、工程质量与复用、采用判断

#### 完整回答

固定源码正常合并自定义扩展，随后stdio配置/注册置于宽catch，而fallback仅用默认.lua，resolveServerConfig仍在try外。相对当前缺服统一文案，设计假设是按配置解析、服务器解析和provider注册分类记录错误，fallback复用已合并扩展，可减少自定义文件失去路由和错误归因。条件是共享基座能区分阶段且provider无部分注册残留，代价是错误契约/清理与额外配置状态维护。最小对照用默认.lua和自定义.xyz映射，分别构造命令缺失、配置非法、provider重复注册及正常启动，对照原版与隔离原型的路由命中、错误阶段、会话可用性和恢复操作数。若自定义扩展仍丢失、配置错误仍报告为缺服或残留注册阻断恢复，假设被证伪。保留路由不等于服务器可用，不能将降级提示当导航成功。本轮未实现或执行对照。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-lsp-lua/src/index.ts:103-118](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L103-L118)

合并扩展

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

**依据 2 · 源码核查**：[dsh-lsp-lua/src/index.ts:120-169](https://github.com/988hj7tczd-oss/dsh-lsp-packs/blob/258bb6409c504fa1eed20b6f70d13009522ca0ce/dsh-lsp-lua/src/index.ts#L120-L169)

fallback及catch边界

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

- 共享基座错误类型与部分注册清理语义未核实
  **影响**：分层恢复方案可行性未知
  **进一步探讨**：从固定基座错误契约及各阶段失败状态记录入手

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
