# pi2dsh

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6a04f6f](https://github.com/weijiafu14/pi2dsh/tree/6a04f6f852c064bc80acd9df83d4c9479178611c)

<!-- BEGIN META -->
[![GitHub ★ 217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/weijiafu14/pi2dsh) [![npm 30d 3,875](https://img.shields.io/static/v1?label=npm+30d&message=3%2C875&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi2dsh) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/pi2dsh)
<!-- END META -->

> **功能**：在 DSH 中提供 Pi 扩展兼容层，发现已安装 Pi 包并映射工具、命令、会话和界面能力。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 集中实现Pi ABI到DSH服务的翻译和按Agent生命周期归属，让扩展作者不必为每包写第二份接线。贡献限定为映射机制，作者样例/挂载探测不是本次复现或全生态兼容证明。

> **主要限制**：[Q03](#research-q03) inspect只筛查，mount失败可降级继续普通DSH；自绘卡片和project_trust等仍有语义差异。扩展factory在宿主进程执行，兼容层不是不可信包隔离；[Q02](#research-q02) 同名工具行为更新与参数schema生效也不同步。

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
  - [Q01 · 已有Pi用户和作者的迁移增量是什么？](#detail-section-11)
  - [Q02 · 发现、按Agent挂载和工具执行怎样接到DSH？](#detail-section-12)
  - [Q03 · 不改包运行有哪些兼容和信任限制？](#detail-section-13)
  - [Q04 · 采用和全周期成本怎样收口？](#detail-section-14)
  - [Q05 · 兼容诊断如何与具体任务失配更可核对？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Pi扩展工具链的用户可在DSH探索同包迁移，合格结果是固定版本关键任务和退出语义等价，不只是工具挂载。

逐包重写为DSH原生插件是迁移基线；没有Pi存量需求时直接使用原生DSH工具可能更省维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| profile包发现 | 找已安装Pi扩展 | suite一层、直接依赖优先 |
| Agent作用域挂载 | 注册与释放包贡献 | 失败可能降级普通DSH |
| Pi工具映射 | 参数验证、信号、进度与结果 | 外部副作用由扩展实现决定 |
| 原生子Agent服务 | 可选给子作用域扩展 | 默认关闭、来源去重 |
| 静态inspect | 标出API/资源差异 | 不认证真实任务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配版本DSH与Node22.19+ | 必需，作者范围 | 宿主服务与引擎 | 未测试版本不扩兼容声明 |
| Web/headless/TUI surface | profile必需 | 驱动任务/交互 | 空profile可能无入口 |
| 明确安装的可信Pi扩展 | 扩展任务必需 | 运行原包factory | 非隔离执行，先核依赖与副作用 |
| Pi0.84.1语义匹配 | 兼容前提 | ABI参照 | 新包API可能缺失 |
| 模型/凭据/外部服务 | 随扩展需要 | 业务效果 | 登录成功不等任务成功 |
| serveNativeSubagents | 原生子Agent需显式开启 | 给子作用域挂载 | 默认off，不能假定子Agent有Pi工具 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 独立profile固定宿主、surface和一个可信包 | 不一口气迁全部工具链 |
| 筛查 | inspect并读实际差异/依赖 | ready仍需任务验证 |
| 挂载 | 安装引擎/扩展后重启 | 检查逐包诊断与所需工具 |
| 任务 | 同原Pi关键任务比较参数/结果/界面/退出 | 降级不可接受或缺口即停 |
| 退出 | 先移扩展后移引擎，查副作用 | 回原Pi流程，不当卸载为回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 模型/API、扩展依赖资源未知 | 版本/surface、构建策略、登录与对照 | 耗时未知 |
| 持续 | 扩展进程/模型/网络未知 | 三套版本和凭据维护 | 无全周期节省数据 |
| 失败恢复 | 重试/回退资源未知 | 查mount/capability、重启schema、核副作用 | 宿主继续不等能力就绪 |
| 退出 | 原工具链保留成本 | 先移包后移引擎，恢复原流程 | 不回滚扩展已做操作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| ABI映射 | 工具注册、参数/信号/结果接线 | 任意包完整任务兼容 |
| 生命周期归属 | Agent作用域activation/去重 | 全平台/重启组合结果 |
| 兼容筛查 | 静态ready/review与capability诊断 | 不等运行认证 |
| 迁移收益 | 有减少逐包适配的机制 | 工时、可靠性与费用 |

> **思考**：[Q03](#research-q03) inspect只筛查，mount失败可降级继续普通DSH；自绘卡片和project_trust等仍有语义差异。扩展factory在宿主进程执行，兼容层不是不可信包隔离；[Q02](#research-q02) 同名工具行为更新与参数schema生效也不同步。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 集中实现Pi ABI到DSH服务的翻译和按Agent生命周期归属，让扩展作者不必为每包写第二份接线。贡献限定为映射机制，作者样例/挂载探测不是本次复现或全生态兼容证明。

[Q02](#research-q02) 以Agent作用域activation承担注册/释放、按来源分工避免重复挂载、把静态分析依赖从engine加载路径分离值得借鉴。ABI和宿主服务维护面积大，不能把vendored Pi逻辑或社区审计脚本全部计原创/业务收益。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) inspect只筛查，mount失败可降级继续普通DSH；自绘卡片和project_trust等仍有语义差异。扩展factory在宿主进程执行，兼容层不是不可信包隔离；[Q02](#research-q02) 同名工具行为更新与参数schema生效也不同步。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 已有Pi任务的用户可在独立profile逐包试用，固定宿主/surface/扩展，先inspect再对照真实关键任务。能力缺口、schema失配、不可接受UI降级或取消后状态未知时停止扩范围，核副作用后退回原Pi流程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查发现/挂载/工具执行代表链及作者明确边界；未运行Pi扩展、宿主或作者测试。作者验收与本次源码分开，任务记录是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/engine.ts、src/host.ts、src/runtime.ts、src/analyzer.ts、docs/capabilities/environment.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定引擎发现/根子Agent挂载、host activation、runtime工具与factory、analyzer和明确能力文档；未穷尽模型/OAuth/MCP/全ABI和社区包，无目标执行。
- 下一步：按 [Q05](#research-q05) 先核现有诊断，再对一个支持包与未支持API样本比较任务误判、定位和维护负担。

**分析版本**

- **仓库**：[weijiafu14/pi2dsh](https://github.com/weijiafu14/pi2dsh)
- **版本号**：0.27.1（[固定提交 6a04f6f](https://github.com/weijiafu14/pi2dsh/tree/6a04f6f852c064bc80acd9df83d4c9479178611c)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是把静态诊断、实际挂载和任务结果绑定到相同扩展/宿主/surface版本，减少把片段支持当完整迁移。先排现有诊断等价功能，以误判/定位时间和维护成本证伪。

按 [Q05](#research-q05) 先核现有诊断，再对一个支持包与未支持API样本比较任务误判、定位和维护负担。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 94 | 15922 | — | — | 276648 |
| .mjs | source | 89 | 18254 | 14751 | 2537 | — |
| .js | source | 1 | 2603 | 2398 | 215 | — |
| .ts | source | 39 | 19993 | 14748 | 4259 | — |
| .mjs | example | 7 | 449 | 350 | 87 | — |
| .md | example | 26 | 1752 | — | — | 10961 |
| .ts | example | 7 | 411 | 360 | 23 | — |
| .ts | test | 38 | 11497 | 9380 | 1340 | — |
| .mjs | test | 2 | 115 | 106 | 1 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/weijiafu14/pi2dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Pi兼容层怎样保留任务和生命周期，哪些兼容/信任条件决定迁移价值？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有Pi用户和作者的迁移增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是已有Pi扩展工具链、希望换到DSH宿主的人，以及不愿为第二宿主单独维护移植的扩展作者。合格结果须在固定扩展/宿主/界面版本完成原扩展的关键任务，保留参数、生命周期和退出语义，而不是扩展出现在工具表。相对手工把每个扩展重写为DSH插件，本包把Pi公共ABI映射到宿主服务，迁移成本有减少的机制依据，但没有本次同任务工时对照。

项目已区分作者端到端样例与只挂载/探测的两级证据；README里的47/50、具体MCP或子Agent案例是作者报告，不是本次独立运行结果，且历史日期和包版本各有范围。不能把一组包成功外推整个Pi生态或当前任意包。已有DSH原生能力能满足任务、或必须用未映射Pi界面/基础设施API的人，可能无需引入兼容层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:49-64](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L49-L64)

作者说明ABI与迁移目标，不当已证架构普适成功。

<details>
<summary>查看原文（16行）</summary>

```text
pi2dsh is one compatibility layer that implements Pi's public extension ABI on
top of DSH's native services, so a Pi package runs on DSH **as published** —
no fork, no patch, no per-package adapter. For a Pi user or team that means
switching hosts without rebuilding the toolchain; for a Pi plugin author it
means a second host with no port to maintain. To the user everything looks
like DSH; to the plugin everything looks like Pi.

At the same time, pi2dsh is an ongoing, full-surface, real-world test of DSH's
architecture. Instead of patching individual plugins, it asks whether the
models, tools, sessions, interaction, resources and client capabilities that Pi
plugins rely on can preserve their logic and lifecycle using only DSH's public
services and extension seams. If they can, that is strong evidence that DSH's
architectural goals for building agents and an agent-plugin ecosystem have been
achieved, at least along this dimension. Wherever the bridge must bypass,
degrade or cannot express a capability, it pinpoints an architectural gap that
remains.
```

</details>

**依据 2 · 作者声明**：[README.md:206-243](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L206-L243)

作者明确区分端到端与挂载探测，范围不能混同。

<details>
<summary>查看原文（38行）</summary>

```text
## What actually works today

Two levels, and they are not the same claim.

### Level 1 — verified end to end, with a runnable example

Someone sat down, used the plugin's real feature on a real DSH loop, and saw
it work. **This is the list to trust.**

| Plugin | What was exercised | Where | Example |
|---|---|---|---|
| [`@kassing/pi-vision`](https://www.npmjs.com/package/@kassing/pi-vision) | Image analysis delegated to a vision model; image-admission companion route; analysis injected into a text-only model's turn | CLI + web | [`vision-bridge`](examples/vision-bridge/) |
| [`@crazygit/pi-codex-image-gen`](https://www.npmjs.com/package/@crazygit/pi-codex-image-gen) | ChatGPT/Codex OAuth → `gpt-image-2` generation; local reference-image upload through DSH approval; image edit; native attachment storage and inline Web rendering | CLI + web | [`codex-image-gen`](examples/codex-image-gen/) |
| [`pi-btw`](https://www.npmjs.com/package/pi-btw) | `/btw <question>` as a real child session in DSH's subagent UI; `/btw-inject`; `/btw --save`; main thread stays clean | CLI + web | [`side-conversation`](examples/side-conversation/) |
| [`pi-powerline-footer`](https://www.npmjs.com/package/pi-powerline-footer) | A terminal status line — model, thinking level, project, context usage — drawn as a floating status pill in DSH web, colour included | web | [`presentation-surfaces`](examples/presentation-surfaces/) |
| [`pi-mcp-adapter`](https://www.npmjs.com/package/pi-mcp-adapter) | Original full-screen manager; stdio/Streamable HTTP/SSE; discovery, direct/proxy/scripted calls, resources, prompts, images, structured content, MCP Apps, approval, elicitation, sampling, cancellation and restart through DSH runtimes | CLI + web + dsh-TUI | [`tui-mcp`](examples/tui-mcp/) · [`mcp-at-scale`](examples/mcp-at-scale/) · [`pi-tui-ecosystem`](examples/pi-tui-ecosystem/) · [evidence matrix](docs/mcp-compatibility.md) |
| [`@tintinweb/pi-subagents`](https://www.npmjs.com/package/@tintinweb/pi-subagents) | The model delegates to autonomous subagents: spawn (with real host-native tools), background + completion notify, mid-run steer, wait-for-result, resume with memory, stop that stays stopped, interactive manager, and cross-restart reopen by archive identity — every child a native DSH session | CLI + dsh-TUI | [`subagents`](examples/subagents/) · [`pi-tui-ecosystem`](examples/pi-tui-ecosystem/) · [acceptance report](community/subagents-acceptance-report.md) |
| [`pi-provider-alibaba`](https://www.npmjs.com/package/pi-provider-alibaba) | Alibaba Token Plan (CN) with its plan-specific key: live catalog, cold-start dynamic model, complete tool loop and restart. The package also declares Coding/API routes, but each requires its own non-interchangeable credential | CLI + web | [`alibaba-token-plan`](examples/alibaba-token-plan/) |
| [`@ff-labs/pi-fff`](https://www.npmjs.com/package/@ff-labs/pi-fff) + [`pi-lens`](https://www.npmjs.com/package/pi-lens) | Code navigation for the model: `ffgrep` content search finds a marker that exists in exactly one file, and `lsp_diagnostics` reports a planted TS2322 through a real local `typescript-language-server` — both asserted from the tools’ own results in the session log | CLI + web | [`code-navigation`](examples/code-navigation/) |
| [`pi-vision-tool`](https://www.npmjs.com/package/pi-vision-tool) | Tool registration through a JSON-Schema shape DSH had to convert (`anyOf` → `oneOf`) | CLI + web | — |
| [`pi-approval-guardian`](https://www.npmjs.com/package/pi-approval-guardian) | Every tool call reviewed by a second model before execution; allow and deny both observed | CLI (bare env) | — |
| [`pi-code`](https://www.npmjs.com/package/pi-code) | A repository's Claude Code configuration on DSH, unmodified: `settings.json` `env` and `PreToolUse` hooks, `CLAUDE.md` `@import` (text lands in the request's system prompt, not read by the model), `.claude/skills`, `.claude/rules` (always-on and `paths:`-scoped), output styles, `.mcp.json` servers through pi-code's own MCP client, `.claude/commands` as `/name` and via the `slash_command` tool; the first session answers "Trust this project?" in DSH's native question card. `Task` subagents from `.claude/agents` do not work (pi-code spawns the Pi CLI) | CLI + Web | [`claude-code-config`](examples/claude-code-config/) |
| [`pi-hermes-memory`](https://www.npmjs.com/package/pi-hermes-memory) | Cross-session memory end to end: `memory_add` in one session, recalled in a second, fresh one (the codeword existed nowhere else); five tools, ten `/memory-*` commands, system-prompt memory injection | CLI | [`persistent-memory`](examples/persistent-memory/) |
| [`pi-background-tasks`](https://www.npmjs.com/package/pi-background-tasks) | Background shell job started with `bg_run`, output read **mid-run** with `bg_logs`: the log result carries early ticks of a still-running 60-second job, with the final tick provably absent | CLI | [`background-tasks`](examples/background-tasks/) |

Examples for the two remaining rows are still to be written; per this
project's own rule they get re-verified from scratch before an example lands,
so the table says plainly which have one today.

### Level 2 — mounts and its surface answers a probe

The Pi catalog's **top 50 packages by monthly downloads**, each mounted in a
real DSH runtime and then called through a black-box probe. Status as of
2026-08-14; per-package machine-readable evidence in
[`community/`](community/).

**47 of 50 exercised successfully · 1 with no probeable surface · 2 pending a
re-run.**
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1-19](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/index.ts#L1-L19)

原生插件入口与inspect分析分离。

<details>
<summary>查看原文（19行）</summary>

```text
// Engine surface: `dsh plugin add pi2dsh` resolves this entry as a cordis
// plugin (named exports, no default — a default export would make the
// loader discard the function-plugin namespace).
export { apply, inject, name, discoverProfilePiPackages, findProfileRoot, installAgentScopedMounts, type EngineConfig } from './engine.js'

// The CLI-only analysis surface loads lazily: its static-analysis dependency
// (the 23 MB typescript compiler, an optional peer) must never be pulled
// into a profile that installs the ENGINE. The dynamic import below keeps
// the analyzer in its own chunk, off the engine's load path.
import type { CompatibilityReport, ResolvedPiPackage } from './types.js'

/**
 * Static compatibility analysis of one resolved Pi package (CLI `inspect`).
 * @param pkg - the resolved package.
 * @returns the compatibility report.
 */
export async function analyzePackage(pkg: ResolvedPiPackage): Promise<CompatibilityReport> {
  const { analyzePackage: run } = await import('./analyzer.js')
  return run(pkg)
```

</details>

#### 缺口

- 没有拟用扩展/宿主的独立关键任务与迁移工时对照
  **影响**：不能承诺任意Pi包不改即完整迁移
  **进一步探讨**：选一项已有Pi任务，固定两宿主与包版本，对比结果、生命周期和维护投入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 发现、按Agent挂载和工具执行怎样接到DSH？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

engine从profile直接dependencies扫描，跳过自身/exclude和声明DSH bundle的包；识别pi字段或Pi扩展目录约定，suite只展开一层并按名称去重，直接依赖优先。准备阶段解析已安装包并形成manifest；挂载时每包以ctx.plugin创建真实Cordis activation，挂到ownerAgent作用域，给予注册与释放正确归属。

根Agent通过WeakMap只创建一次mount promise，并等待created处理；原生子Agent挂载默认关闭，开启后按subagent origin及pi2dsh-sub-会话前缀排除已有Pi子桥，再排除由根路径服务的runtime roots，以防重复挂载。没有检测服务时的fallback也存在，不能把所有精简宿主都等同标准环境。

registerTool把Pi定义转成DSH工具：规范化schema，执行前确保session启动，准备并校验参数，再传callId、AbortSignal、进度回调与上下文给Pi函数；结果isError抛错，工具dispose归state保存。相同工具名重注册只换行为账本，参数schema变化要重启后才生效，代码会警告。这个边界使“无需改包”仍要以具体运行语义验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine.ts:106-179](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/engine.ts#L106-L179)

发现、suite一层与去重条件。

<details>
<summary>查看原文（74行）</summary>

```text
export async function discoverProfilePiPackages(
  profileRoot: string,
  options: { exclude?: string[], warn?: (message: string) => void } = {},
): Promise<DiscoveredPackage[]> {
  const warn = options.warn ?? (() => {})
  const excluded = new Set(options.exclude ?? [])
  const manifest = await readProfileManifest(profileRoot)
  const discovered: DiscoveredPackage[] = []
  for (const name of Object.keys(manifest.dependencies ?? {})) {
    if (name === 'pi2dsh' || excluded.has(name)) continue
    const dir = resolveDependencyDir(profileRoot, name)
    if (dir === undefined) {
      warn(`[pi2dsh engine] dependency ${JSON.stringify(name)} is not installed under the profile; skipping`)
      continue
    }
    let packageJson: Record<string, unknown>
    try {
      packageJson = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8')) as Record<string, unknown>
    } catch (error) {
      warn(`[pi2dsh engine] cannot read ${name}/package.json (${error instanceof Error ? error.message : String(error)}); skipping`)
      continue
    }
    // A suite: `pi2dsh: { suite: [names...] }` mounts the listed Pi packages
    // as if the user had added each one. The list is an explicit manifest —
    // the same discovery covenant as the profile dependency list, one hop
    // deeper — and the members are the suite's own dependencies, so each
    // resolves anchored at the suite package (pnpm keeps transitive
    // dependencies out of the profile root). One level only, no recursion.
    const suite = (packageJson.pi2dsh as { suite?: unknown } | undefined)?.suite
    if (Array.isArray(suite)) {
      // The anchor must be the suite's REAL directory: the profile's
      // node_modules entry is a pnpm symlink into .pnpm, and Node resolution
      // walks up from the anchor's literal path — only the realpath has the
      // suite's own dependencies as .pnpm neighbours.
      let anchorDir = dir
      try {
        anchorDir = realpathSync(dir)
      } catch { /* an unreadable dir keeps the literal path and fails loud in prepare */ }
      for (const member of suite) {
        if (typeof member !== 'string' || member.length === 0) continue
        if (member === 'pi2dsh' || excluded.has(member)) continue
        discovered.push({ name: member, dir, anchor: join(anchorDir, 'package.json') })
      }
      continue
    }
    // A dsh.bundle-declaring package is a DSH plugin layer, never a Pi package.
    if ((packageJson.dsh as { bundle?: unknown } | undefined)?.bundle !== undefined) continue
    if (packageJson.pi !== undefined && typeof packageJson.pi === 'object') {
      discovered.push({ name, dir })
      continue
    }
    // No `pi` field: fall back to Pi's directory conventions via the same
    // resolver every other mount path uses (a package with zero extension
    // sources is a plain library and stays unmounted).
    try {
      const pkg = await resolvePiPackage(dir)
      try {
        if (pkg.resources.extensions.length > 0) discovered.push({ name, dir })
      } finally {
        await pkg.dispose()
      }
    } catch {
      // Not resolvable as a Pi package — a plain library.
    }
  }
  // One mount per name. A package that is both a direct dependency and a
  // suite member mounts as the DIRECT dependency (the user's own explicit
  // add, resolved from the profile root) — the suite copy yields.
  const byName = new Map<string, DiscoveredPackage>()
  for (const pkg of discovered) {
    const existing = byName.get(pkg.name)
    if (existing === undefined || (existing.anchor !== undefined && pkg.anchor === undefined)) {
      byName.set(pkg.name, pkg)
    }
```

</details>

**依据 2 · 源码核查**：[src/host.ts:178-209](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/host.ts#L178-L209)

每包真实Cordis activation与Agent owner。

<details>
<summary>查看原文（32行）</summary>

```text
export async function applyPreparedPiHost(
  ctx: Context,
  prepared: readonly PreparedPiHostPackage[],
  ownerAgent?: UnknownRecord,
  mode: { hostAnchor?: boolean } = {},
): Promise<Array<{ name: string, error: string }>> {
  const errors: Array<{ name: string; error: string }> = []
  for (const pkg of prepared) {
    try {
      // One real Cordis activation per Pi package, owned by this Agent scope.
      // Besides giving teardown the correct owner, dsh-TUI's contribution
      // services bind registration and later use to this activation identity;
      // calling applyPiPackage() naked from the setup event has no live plugin
      // caller and cannot register or open a scene correctly.
      await ctx.plugin(Object.assign(
        async (packageCtx: Context) => {
          await applyPiPackage(packageCtx, {
            rootUrl: pkg.rootUrl,
            manifest: pkg.manifest,
            // The engine/host registers companion routes once on the host
            // before mounting prepared packages. Suppress applyPiPackage's
            // standalone default here so one package cannot undo an explicit
            // host-level `visionCompanions: false` or duplicate the catalog.
            config: { ...(pkg.config ?? {}), visionCompanions: false },
            ...(ownerAgent === undefined ? {} : { ownerAgent }),
            ...(mode.hostAnchor === true ? { hostAnchor: true } : {}),
          })
        },
        { inject: ['tools', 'systemPrompt', 'commands'] },
      ))
    } catch (error) {
      errors.push({ name: pkg.name, error: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 3 · 源码核查**：[src/engine.ts:254-278](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/engine.ts#L254-L278)

根Agent去重与等待。

<details>
<summary>查看原文（25行）</summary>

```text
  const ensureMount = (agent: AgentLike): AgentScopedMount => {
    let mount = mounts.get(agent)
    if (mount === undefined) {
      const started: AgentScopedMount = { ready: Promise.resolve() }
      started.ready = preparedPackages.then(async prepared => {
        if (prepared.length === 0) return
        try {
          await applyPreparedPiHost(agent.ctx, prepared, agent as unknown as Record<string, unknown>)
        } catch (error) {
          // Loud, once per agent; initialization settles so the plain DSH agent
          // keeps working. Faking success is forbidden — the message names
          // what is missing.
          started.failure = error instanceof Error ? error.message : String(error)
          report.warn(`[pi2dsh engine] Pi packages failed to mount for this agent; it continues without them: ${started.failure}`)
        }
      })
      mounts.set(agent, started)
      mount = started
    }
    return mount
  }

  host.on('agent/created', (async (payload: { agent: AgentLike }) => {
    if (isRootAgent(payload.agent)) await ensureMount(payload.agent).ready
  }) as never)
```

</details>

**依据 4 · 源码核查**：[src/engine.ts:372-410](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/engine.ts#L372-L410)

子Agent范围、前缀排除和根/子挂载分工。

<details>
<summary>查看原文（39行）</summary>

```text
  const ensureMount = (agent: AgentLike): Promise<void> => {
    const scope = agent.ctx
    let ready = mounts.get(scope)
    if (ready === undefined) {
      ready = preparedPackages.then(async () => {
        const catalog = getSharedChildExtensionCatalog(ctx)
        if (catalog === undefined) return
        // Native children have no creator loader: the full discovered set is
        // Pi's default discovery (the no-loader path of
        // resolveChildExtensionPackages).
        const names = [...new Set(catalog.packageByEntryPath.values())]
        if (names.length === 0) return
        try {
          const failures = await catalog.mount(agent as unknown as Record<string, unknown>, names)
          for (const failure of failures) {
            // Same message shape the bridge's own mount path uses.
            report.warn(`[pi2dsh] child extension ${failure.name} did not mount: ${failure.error}`)
          }
        } catch (error) {
          report.warn(`[pi2dsh] child extension mount failed: ${error instanceof Error ? error.message : String(error)}`)
        }
      })
      mounts.set(scope, ready)
    }
    return ready
  }

  const handle = async (agent: AgentLike): Promise<void> => {
    // The single lineage check: DSH-native subagents only. Pi-origin
    // (bridge) children are already served by the creator's per-spawn loader
    // mount; the `pi2dsh-sub-` prefix identifies them on creation AND on a
    // persisted resume, where the original session id survives.
    if (!runtimeInternals.isSubagentOrigin(agent as unknown as Record<string, unknown>)) return
    const session = (agent as { session?: { id?: unknown } }).session ?? agent
    if (String((session as { id?: unknown }).id ?? '').startsWith(BRIDGE_CHILD_SESSION_ID_PREFIX)) return
    // Runtime roots are the root-mount path's territory; serving them here
    // would race a second mount onto the same scope.
    if (isRootAgent(agent)) return
    await ensureMount(agent)
```

</details>

**依据 5 · 源码核查**：[src/runtime.ts:4134-4159](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L4134-L4159)

同名重注册账本与schema需重启警告。

<details>
<summary>查看原文（26行）</summary>

```text
function registerTool(ctx: Context, state: RuntimeState, tool: PiTool): void {
  // Pi's runner stores tools in a name-keyed Map (set + refreshTools):
  // re-registering a name replaces the previous definition. Mirror that —
  // catalog packages (pi-fabric) re-register wrapped variants at runtime,
  // and the reload remount re-registers every tool. The DSH-side
  // registration STAYS on a replacement: its execute() resolves the live
  // ledger entry, so swapping the ledger swaps the behavior. (Re-registering
  // on the DSH side from an execution stack would attach the effect to the
  // wrong fiber scope and hide the tool from registered agents.)
  if (state.tools.has(tool.name)) {
    const previous = state.tools.get(tool.name)!
    state.tools.set(tool.name, tool)
    if (JSON.stringify(previous.parameters ?? null) !== JSON.stringify(tool.parameters ?? null)) {
      logger(ctx).warn(`[pi2dsh] tool ${tool.name} was re-registered with a different parameter schema; the new schema takes effect when dsh restarts (behavior is already live)`)
    }
    return
  }
  const normalized = normalizeToolSchema(tool.parameters)
  for (const warning of normalized.warnings) logger(ctx).warn(`[pi2dsh] tool ${tool.name}: ${warning}`)
  state.tools.set(tool.name, tool)
  if (state.hostAnchor) {
    // The anchor keeps the package's own Pi-side ledger (getActiveTools,
    // re-registration and unregister semantics stay exact) but projects no
    // DSH tool: every executable session belongs to a per-Agent instance,
    // and a host-level twin would put duplicate names in front of the model.
    state.toolDisposers.set(tool.name, () => {})
```

</details>

**依据 6 · 源码核查**：[src/runtime.ts:4171-4218](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L4171-L4218)

实际DSH工具到Pi执行/参数/信号/结果接线。

<details>
<summary>查看原文（48行）</summary>

```text
    isConcurrencySafe: () => tool.executionMode === 'parallel',
    async execute(args, exec) {
      // Live ledger resolution (see the re-registration note above).
      const live = state.tools.get(tool.name) ?? tool
      const agent = exec.agent as unknown as UnknownRecord | undefined
      // Engine-managed Agents are already initialized by agent/created.
      // Keep this idempotent check for direct runtime callers and reloads;
      // Pi requires session_start before a session-owned tool can execute.
      await ensurePiSessionStarted(ctx, state, agent, exec.signal)
      const mutated = state.argMutations.get(exec as unknown as object)
      if (mutated !== undefined) state.argMutations.delete(exec as unknown as object)
      const effective = mutated ?? args
      // Pi's order, unchanged: the tool's own `prepareArguments` shim first,
      // then the argument gate its agent loop runs before EVERY execution —
      // coerce against the schema, then check. Without it a model that emits
      // "3" for a number parameter hands the tool a string (Pi hands it 3),
      // and malformed arguments reach the tool instead of coming back to the
      // model as the violation text it can retry against.
      const prepared = validateToolArguments(
        { name: live.name, parameters: live.parameters },
        { name: live.name, arguments: live.prepareArguments?.(cloneJson(effective)) ?? effective },
      )
      const result = await normalizeToolResultForDsh(ctx, await runInPiRuntime(state, agent, () => live.execute(
          String(exec.callId),
          prepared,
          exec.signal,
          update => {
            void dispatch(state, 'tool_execution_update', {
              type: 'tool_execution_update',
              toolCallId: String(exec.callId),
              toolName: tool.name,
              args: prepared,
              partialResult: jsonValue(update),
            }, contextFor(ctx, state, agent, exec.signal))
              .catch(error => logger(ctx).warn(`[pi2dsh] tool_execution_update handler failed: ${String(error)}`))
          },
          contextFor(ctx, state, agent, exec.signal),
        )))
      if (result.terminate === true) exec.concludeTurn()
      if (result.isError === true) {
        const message = textBlocks(result.content).map(block => block.text).filter(Boolean).join('\n')
        throw new Error(message || `Pi tool ${tool.name} failed`)
      }
      return result
    },
  }
  const dispose = (ctx as unknown as { tools: { register(toolDefinition: ToolDefinition): () => void } }).tools.register(definition)
  state.toolDisposers.set(tool.name, dispose)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 不改包运行有哪些兼容和信任限制？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

兼容需要匹配固定Pi扩展语义、宿主版本、surface以及扩展本身依赖。README固定Pi0.84.1并列出0.27.1对DSH0.2.1-rc.2/rc.3的作者验收，未测试宿主不纳入声明；自定义profile还须有Web/headless/TUI等surface。inspect只是静态筛查，代码明确不认证真实行为，ready不能当已运行。

Pi与DSH并非每个能力等价。项目承认插件自绘卡片注册但未调用，内容落普通宿主行；project_trust处理器被接受但不咨询，信任由DSH决定，动态资源的prompt/theme也可能只报告而不挂载。这些是设计边界，不能因工具注册成功就声称原插件全部呈现不变。

扩展通过jiti.import加载并调用factory，属于在宿主进程执行所安装代码；ABI桥不是隔离不可信npm包的边界。取消信号会传给工具，但扩展是否遵守以及外部副作用是否停止仍是各包责任。某包mount失败会日志告警，Agent可继续普通DSH执行，因此任务仍有输出不代表所需Pi能力已就绪。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-39](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L22-L39)

固定版本/语义与作者验收矩阵。

<details>
<summary>查看原文（18行）</summary>

```text
Version support is explicit:

| pi2dsh | DSH host | Maintenance |
|---|---|---|
| 0.27.1 | 0.2.1-rc.2 / 0.2.1-rc.3 | [Acceptance and release status](community/release-0.27.1/README.md) |
| 0.27.0 | 0.2.1-rc.2 | [Acceptance and release status](community/release-0.27.0/README.md) |
| 0.26.0 | 0.2.0-rc.2 | [Release verification](community/release-0.26.0/README.md) |
| 0.25.2 | 0.1.5-rc.2 | Frozen checkpoint: [release evidence](community/release-0.25.2/README.md) |

Pi extension semantics remain pinned to 0.84.1. New engine releases target the
validated current DSH line; historical fixes start from their release tag when
needed. DSH owns stored-session format migration. An untested host version is
not included in the compatibility declaration.

For either supported DSH version, the validated terminal packages are
`@deepseek-harness-tui/dsh-tui@0.17.0` and `@xmoon76/dsh-pi-tui@0.5.3`.
The older dsh-pi-tui 0.5.1 still references removed host components; upgrade
that terminal rather than bypassing compatibility checks with `allow-version`.
```

</details>

**依据 2 · 作者声明**：[README.md:75-87](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L75-L87)

profile需要surface并启动发现。

<details>
<summary>查看原文（13行）</summary>

```text
Then **restart `dsh`** — plugins mount at startup.

> **A profile needs a surface bundle.** DSH's built-in templates are `web` and
> `headless`. A custom profile is valid when its product installs a surface —
> for example `@deepseek-harness-tui/dsh-tui` in the `dsh-tui` profile. A bare
> arbitrary profile has no surface and can start with nothing to drive it, so
> add the intended surface to `dsh.profile.bundles` first.

That is the whole model. There is no conversion step, no generated bundle, no
build. The engine discovers the Pi packages in your profile (every one is
something you explicitly added) and mounts them through a single bridge
instance: one model directory, one login, one credential store, one upgrade
unit.
```

</details>

**依据 3 · 源码核查**：[src/analyzer.ts:505-510](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/analyzer.ts#L505-L510)

静态analysis不认证运行。

```text
  const summary: Record<CompatibilityLevel, number> = { full: 0, partial: 0, unsupported: 0, fatal: 0 }
  for (const finding of findings) summary[finding.level] += 1
  // Static analysis screens; it does not certify. Only fatal findings block a
  // bundle (it cannot be built or trusted). Everything else installs: verify
  // real behavior with the black-box run instead of trusting this verdict.
  const verdict = summary.fatal > 0 ? 'blocked' : summary.partial > 0 || summary.unsupported > 0 ? 'review' : 'ready'
```

**依据 4 · 作者声明**：[README.md:458-469](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L458-L469)

基础设施/信任归属和自绘卡片边界。

<details>
<summary>查看原文（12行）</summary>

```text
**What is deliberately not available**, and why: runtime package installation
and standalone model runtimes stay with the host and its security gates;
provider payload/header/response interception belongs in a DSH llm adapter;
project trust is a host decision. See
[models](docs/capabilities/models.md) and
[environment](docs/capabilities/environment.md).

**The one gap we own:** plugin-drawn cards. Pi plugins can ship their own
renderers; today those registrations are accepted but not invoked, so such a
note appears as a native context-injection row — the content reaches you and
the model, without the plugin's styling. The client half exists and takes four
seats (side-conversation panel, header, floating widgets, working chrome) — the card
```

</details>

**依据 5 · 作者声明**：[docs/capabilities/environment.md:14-19](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/docs/capabilities/environment.md#L14-L19)

作者列明project_trust不调用与动态资源差异。

```text
| Pi surface | Kind | Status | What it does on DSH |
|---|---|---|---|
| [`events`](#events-pi) | `pi.*` | Same semantics | Pi's cross-extension event bus: one shared bus per agent, so every Pi package mounted for the same agent hears every other package's emits — matching Pi's one-bus-per-session loader contract. Different agents have different buses. |
| [`project_trust`](#project_trust-event) | `event` | Not available | Project trust must remain owned by the DSH host; the handler is accepted but never consulted. |
| [`resources_discover`](#resources_discover-event) | `event` | Mapped, difference stated | Fires right after session_start with the session cwd, as in Pi. Returned skillPaths that are directories are mounted into DSH's skills registry through the official filesystem provider (dsh-skill-filesystem), once per root per package, so dynamically discovered skills (a project's .claude/skills) list and load like static package skills. promptPaths and themePaths have no DSH seat and are reported rather than mounted; a single SKILL.md file path (no root) is reported too. |
| [`isProjectTrusted`](#isprojecttrusted-ctx) | `ctx.*` | Same semantics | Reports the DSH host's own trust decision: true for an agent session's working directory, false for the host anchor and detached contexts. |
```

**依据 6 · 源码核查**：[src/runtime.ts:5385-5408](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L5385-L5408)

实际导入factory、错误隔离与capability gap。

<details>
<summary>查看原文（24行）</summary>

```text
    try {
      const loaded: unknown = await jiti.import(join(rootDir, extension))
      const candidate = typeof loaded === 'object' && loaded !== null && 'default' in loaded
        ? (loaded as { default: unknown }).default
        : loaded
      if (typeof candidate !== 'function') throw new TypeError(`Pi extension ${extension} has no default factory function`)
      await candidate(api)
      mounted += 1
    } catch (error) {
      // A capability gap during entry setup means this package cannot start
      // at all — the user gets the unusable verdict, not just a skip line.
      // Matched by name: the shim chunk carries its own compiled copy of the
      // class, so instanceof does not hold across that bundle boundary.
      if (error instanceof PiCapabilityError
        || (error instanceof Error && error.name === 'PiCapabilityError')) {
        onCapabilityGap?.(error as PiCapabilityError, extension)
      }
      failures.push(`${extension}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (failures.length > 0 && mounted === 0 && manifest.extensions.length > 0) {
    throw new Error(`every Pi extension entry failed to load:\n${failures.map(item => `- ${item}`).join('\n')}`)
  }
  for (const failure of failures) onExtensionError?.(failure)
```

</details>

**依据 7 · 源码核查**：[src/engine.ts:254-268](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/engine.ts#L254-L268)

mount失败降级仍可运行普通Agent。

<details>
<summary>查看原文（15行）</summary>

```text
  const ensureMount = (agent: AgentLike): AgentScopedMount => {
    let mount = mounts.get(agent)
    if (mount === undefined) {
      const started: AgentScopedMount = { ready: Promise.resolve() }
      started.ready = preparedPackages.then(async prepared => {
        if (prepared.length === 0) return
        try {
          await applyPreparedPiHost(agent.ctx, prepared, agent as unknown as Record<string, unknown>)
        } catch (error) {
          // Loud, once per agent; initialization settles so the plain DSH agent
          // keeps working. Faking success is forbidden — the message names
          // what is missing.
          started.failure = error instanceof Error ? error.message : String(error)
          report.warn(`[pi2dsh engine] Pi packages failed to mount for this agent; it continues without them: ${started.failure}`)
        }
```

</details>

#### 缺口

- 未穷尽所有ABI映射、扩展副作用和拟用surface端到端语义
  **影响**：不能确认任意包完整兼容或取消已停止外部任务
  **进一步探讨**：固定拟用包，核查其关键API/依赖与失败退出，再在隔离任务对照原Pi行为。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用和全周期成本怎样收口？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可对已有Pi工作流的用户提供有条件试用：在独立profile固定受支持宿主、一个可信扩展与surface，先inspect再完成该扩展最小真实任务，检查mount诊断、参数、进度/结果、审批和退出。没有Pi存量需求时先用原生DSH工具更简单；多包一次装齐难以定位失配。

首次要核对版本、依赖构建策略、登录/模型及surface；持续要维护兼容层、扩展与宿主三套更新和凭据，不把单引擎升级单元当零维护。模型/API、网络、扩展进程和人工时间金额均未知，没有同任务迁移工时、成功率和成本数据。依赖构建脚本是否允许由用户决定，桥不绕过包管理门槛。

若关键能力capability gap、参数schema重注册告警、结果不等价、界面降级无法接受或取消后外部状态未知，应停止扩范围，先移除扩展再移除引擎并退回原Pi流程；先核对已发生文件/服务副作用，卸载兼容层不是业务回滚。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-110](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/README.md#L89-L110)

独立升级/移除顺序、inspect、依赖构建与Node要求。

<details>
<summary>查看原文（22行）</summary>

```text
Day-to-day:

| Task | Command |
|---|---|
| Add a plugin | `dsh plugin add <pkg>` (then restart dsh) |
| Remove a plugin | `dsh plugin remove <pkg>` — remove plugins before removing the engine |
| Upgrade a plugin | `dsh plugin add <pkg>@latest` — the engine is untouched |
| Upgrade the engine | `dsh plugin add pi2dsh@latest` — your plugins are untouched |
| Check a plugin before upgrading | `npx pi2dsh inspect <pkg>@<version>` |

Two installer messages worth knowing:

- **`ERR_PNPM_IGNORED_BUILDS`** — pnpm blocks dependency build scripts by
  default. Run `pnpm approve-builds` inside
  `$DSH_HOME/profiles/web`, or set the listed packages to `true`
  under `allowBuilds` in that profile's `pnpm-workspace.yaml`. Then re-run the
  add. (This is your call to make, so the bridge does not work around it.)
- **An add silently installs an older version** right after a release —
  pnpm's `minimumReleaseAge` skips versions published very recently. Pin it:
  `dsh plugin add pi2dsh@<version>`.

Requires Node.js 22.19+ and DeepSeek Harness.
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:4143-4148](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L4143-L4148)

行为与schema更新不同步需重启。

```text
  if (state.tools.has(tool.name)) {
    const previous = state.tools.get(tool.name)!
    state.tools.set(tool.name, tool)
    if (JSON.stringify(previous.parameters ?? null) !== JSON.stringify(tool.parameters ?? null)) {
      logger(ctx).warn(`[pi2dsh] tool ${tool.name} was re-registered with a different parameter schema; the new schema takes effect when dsh restarts (behavior is already live)`)
    }
```

**依据 3 · 源码核查**：[src/runtime.ts:5385-5408](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L5385-L5408)

能力缺口与扩展失败的真实诊断路径。

<details>
<summary>查看原文（24行）</summary>

```text
    try {
      const loaded: unknown = await jiti.import(join(rootDir, extension))
      const candidate = typeof loaded === 'object' && loaded !== null && 'default' in loaded
        ? (loaded as { default: unknown }).default
        : loaded
      if (typeof candidate !== 'function') throw new TypeError(`Pi extension ${extension} has no default factory function`)
      await candidate(api)
      mounted += 1
    } catch (error) {
      // A capability gap during entry setup means this package cannot start
      // at all — the user gets the unusable verdict, not just a skip line.
      // Matched by name: the shim chunk carries its own compiled copy of the
      // class, so instanceof does not hold across that bundle boundary.
      if (error instanceof PiCapabilityError
        || (error instanceof Error && error.name === 'PiCapabilityError')) {
        onCapabilityGap?.(error as PiCapabilityError, extension)
      }
      failures.push(`${extension}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (failures.length > 0 && mounted === 0 && manifest.extensions.length > 0) {
    throw new Error(`every Pi extension entry failed to load:\n${failures.map(item => `- ${item}`).join('\n')}`)
  }
  for (const failure of failures) onExtensionError?.(failure)
```

</details>

**依据 4 · 源码核查**：[src/host.ts:155-170](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/host.ts#L155-L170)

准备失败逐项记录，不能只看宿主仍能启动。

<details>
<summary>查看原文（16行）</summary>

```text
    } catch (error) {
      errors.push({ name: spec.name, error: error instanceof Error ? error.message : String(error) })
    }
  }
  for (const failure of errors) {
    // Console AND logger, the same rule the engine states for its own mount
    // line: a profile's logger level must never be able to hide which packages
    // did not mount. It could, and it did — a package failed to mount and the
    // only symptom was its absence from a list nobody was diffing.
    const message = `[pi2dsh host] failed to mount ${failure.name}: ${failure.error}`
    console.warn(message)
  }
  if (errors.length > 0 && errors.length === normalizeSpecs(config).length) {
    throw new Error(`pi2dsh host mounted no packages; first failure: ${errors[0]!.name}: ${errors[0]!.error}`)
  }
  return prepared
```

</details>

#### 缺口

- 没有拟用包的真实任务、退出副作用和全部迁移成本结果
  **影响**：不能支持持续采用或普适省工承诺
  **进一步探讨**：在隔离profile逐包完成关键任务与取消/退出对照，计入所有复核和恢复，再决定扩大。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 兼容诊断如何与具体任务失配更可核对？

**研究主题**：新假设与验证

#### 完整回答

已有inspect、capability ledger和mount错误，不能把“加诊断”本身当新方向。可检验的假设是把静态ready/review、实际挂载、任务关键调用和用户可见结果绑定到同一扩展/宿主/surface版本记录，让用户区分ABI片段支持与任务真正迁移。推导来自静态筛查非认证、mount失败可降级、工具行为/schema更新时点不同。

先检查现有诊断页和作者验收记录是否已等价；若没有，在同一个支持包和一个故意使用未支持API的隔离包上，对照当前提示与任务绑定记录。记录错误判断可用、定位失配时间、重复调试及维护成本。若原诊断已足够、新记录未减少误判或增加大量版本维护，就否定。此研究未运行实验，未把作者大规模报告当本方案验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/analyzer.ts:505-510](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/analyzer.ts#L505-L510)

静态筛查与黑盒验证边界。

```text
  const summary: Record<CompatibilityLevel, number> = { full: 0, partial: 0, unsupported: 0, fatal: 0 }
  for (const finding of findings) summary[finding.level] += 1
  // Static analysis screens; it does not certify. Only fatal findings block a
  // bundle (it cannot be built or trusted). Everything else installs: verify
  // real behavior with the black-box run instead of trusting this verdict.
  const verdict = summary.fatal > 0 ? 'blocked' : summary.partial > 0 || summary.unsupported > 0 ? 'review' : 'ready'
```

**依据 2 · 源码核查**：[src/engine.ts:254-268](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/engine.ts#L254-L268)

挂载失败后普通Agent继续是误解可用性的推导。

<details>
<summary>查看原文（15行）</summary>

```text
  const ensureMount = (agent: AgentLike): AgentScopedMount => {
    let mount = mounts.get(agent)
    if (mount === undefined) {
      const started: AgentScopedMount = { ready: Promise.resolve() }
      started.ready = preparedPackages.then(async prepared => {
        if (prepared.length === 0) return
        try {
          await applyPreparedPiHost(agent.ctx, prepared, agent as unknown as Record<string, unknown>)
        } catch (error) {
          // Loud, once per agent; initialization settles so the plain DSH agent
          // keeps working. Faking success is forbidden — the message names
          // what is missing.
          started.failure = error instanceof Error ? error.message : String(error)
          report.warn(`[pi2dsh engine] Pi packages failed to mount for this agent; it continues without them: ${started.failure}`)
        }
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:4143-4148](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L4143-L4148)

schema/行为不同步的具体失配线索。

```text
  if (state.tools.has(tool.name)) {
    const previous = state.tools.get(tool.name)!
    state.tools.set(tool.name, tool)
    if (JSON.stringify(previous.parameters ?? null) !== JSON.stringify(tool.parameters ?? null)) {
      logger(ctx).warn(`[pi2dsh] tool ${tool.name} was re-registered with a different parameter schema; the new schema takes effect when dsh restarts (behavior is already live)`)
    }
```

**依据 4 · 源码核查**：[src/runtime.ts:5393-5408](https://github.com/weijiafu14/pi2dsh/blob/6a04f6f852c064bc80acd9df83d4c9479178611c/src/runtime.ts#L5393-L5408)

已有capability诊断反证，不重复发明。

<details>
<summary>查看原文（16行）</summary>

```text
    } catch (error) {
      // A capability gap during entry setup means this package cannot start
      // at all — the user gets the unusable verdict, not just a skip line.
      // Matched by name: the shim chunk carries its own compiled copy of the
      // class, so instanceof does not hold across that bundle boundary.
      if (error instanceof PiCapabilityError
        || (error instanceof Error && error.name === 'PiCapabilityError')) {
        onCapabilityGap?.(error as PiCapabilityError, extension)
      }
      failures.push(`${extension}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
  if (failures.length > 0 && mounted === 0 && manifest.extensions.length > 0) {
    throw new Error(`every Pi extension entry failed to load:\n${failures.map(item => `- ${item}`).join('\n')}`)
  }
  for (const failure of failures) onExtensionError?.(failure)
```

</details>

#### 缺口

- 诊断页现状未全量审阅且无用户定位实验
  **影响**：不能认定新记录有价值
  **进一步探讨**：先核对等价能力，再比较误判/定位时间与维护投入，无改善就不新增。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
