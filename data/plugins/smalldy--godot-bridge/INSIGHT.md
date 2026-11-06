# Godot Bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[bb1fe82](https://github.com/Smalldy/godot-bridge/tree/bb1fe822ab29473b9a57503985f58dd34422bd82)

<!-- BEGIN META -->
[![GitHub ★ 49](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=49&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Smalldy/godot-bridge) [![npm 30d 150](https://img.shields.io/static/v1?label=npm+30d&message=150&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/godot-bridge) [![最新发布 2021-03-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2021-03-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/godot-bridge)
<!-- END META -->

> **功能**：以原生DSH工具启动/接管Godot实例，经游戏内TCP服务器执行运行态命令、截图和脚本。

> **亮点**：[Q01](#research-q01)原生替代MCP并整合运行/headless/项目操作；[Q02](#research-q02)真实运行态反馈；[Q03](#research-q03)实例归属/调试trap边界。

> **主要限制**：[Q03](#research-q03)token非认证、eval真代码/共享实例，超时stop不保证回滚；[Q04](#research-q04)export success判据不足、autoload会改项目，运行态不等持久修复。

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
  - [Q01 · 原生Godot运行态桥解决什么，相对MCP/引擎贡献在哪？](#detail-section-11)
  - [Q02 · 工具怎样真正进入游戏执行并返回？](#detail-section-12)
  - [Q03 · 归属、调试和超时如何保护，哪里仍不保证？](#detail-section-13)
  - [Q04 · 如何使用headless/导出结果，成本和恢复边界怎样？](#detail-section-14)
  - [Q05 · 从原生命令适配还能形成什么差异方向？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：godot-bridge0.2.1是原生DSH工具/客户端配置插件，让Agent启动Godot4项目、查询场景/UI、操作运行态、截图/eval和执行headless/项目文件操作。目标是开发时从改代码到实际游戏观察的短反馈回路，不是仅生成GDScript；成功仍需目标场景状态/交互与导出产物被核验。

godot-mcp协议桥、人工编辑器测试与DSH通用文件工具，Godot引擎/游戏协议为已有能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| runtime | 场景/属性/eval | 本机真实代码/非鉴权token |
| screenshot | viewport PNG | 非视觉/逻辑验收 |
| 启停/接管 | 控制实例 | 单共享目标/外部不杀 |
| headless/导出 | 批处理产物 | 退出码/文件须独立核 |
| autoload | 自动接线 | 覆脚本/改项目配置 |

**流程与依赖**

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失/边界 |
|---|---|---|---|
| DSH tools/subprocess/fs/策略/Node | 必需 | 原生工具与短桥 | 原始进程不等沙箱 |
| Godot4真实引擎路径/可信项目 | 必需 | 游戏执行 | 非版本shim/不可信脚本禁试 |
| vendored autoload/回环TCP | runtime必需 | 游戏命令接收 | 启动会覆脚本/改project.godot |
| 导出模板/显示/人工验收 | 按任务 | 渲染与最终产物 | 返回success不等可运行 |

#### 启动步骤

| 步骤 | 动作 | 判据/失败处理 |
|---|---|---|
| 备份 | 可信项目副本/VCS | 核autoload与配置diff |
| 配置 | 真引擎/目标project/端口 | 单操作者、核归属 |
| 运行 | 无debug先小命令/属性/截图 | game_ready非功能验收 |
| 产物 | 核exit_code/输出文件/重启状态 | 不只看success |
| 退出 | 托管停进程、外部F8、还项目diff | stop标志/超时不回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 引擎/机器/显示金额未知 | 配置版本/副本/策略 | 去MCP非总成本0 |
| 持续 | GPU/CPU/token/日志未知 | 状态/截图/资源验收 | 净节时未测 |
| 故障 | 部分脚本/导出/日志未知 | 查进程/实例/项目diff | 超时不撤游戏效果 |
| 退出 | autoload/user://留存未知 | 停归属进程/恢复文件 | 不自动卸autoload/回滚 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 原生运行态 | 游戏端真eval/set/截图 | 游戏功能正确/安全 |
| 归属 | 外部adopt/拒stop | 多Agent竞争/退出真实成功 |
| 调试 | debug env拒eval/trap建议 | 真实平台恢复效果 |
| headless/导出 | 进程与结果返回 | 可运行产物/逻辑测试 |

> **思考**：[Q03](#research-q03)token非认证、eval真代码/共享实例，超时stop不保证回滚；[Q04](#research-q04)export success判据不足、autoload会改项目，运行态不等持久修复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)原生替代MCP并整合运行/headless/项目操作；[Q02](#research-q02)真实运行态反馈；[Q03](#research-q03)实例归属/调试trap边界。

[Q03](#research-q03)外部归属拒杀与debug env防trap可借鉴；必须区分token归属/鉴权、进程超时/效果撤销和运行态/落盘/导出。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)token非认证、eval真代码/共享实例，超时stop不保证回滚；[Q04](#research-q04)export success判据不足、autoload会改项目，运行态不等持久修复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05)可信副本/单操作者受限试用；核项目diff/实例/最终产物，不信stop或success字段替代验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核到真实Godot端eval/属性/截图；可信项目副本单操作者受限试用，未运行/验导出或全审游戏命令。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin/debug-guard.mjs、plugin/godot-bridge.mjs、plugin/mcp_interaction_server.gd 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、原生注册/依赖、项目写与autoload安装、实例探测/接管/启动、短桥/游戏端监听match/eval/set/截图/identity、headless/导出/stop及debug helpers；.gd从固定Git对象读取并由装配器绑定；未全审全部游戏命令/headless静态脚本/客户端和测试。
- 下一步：只读固定Git对象/源码，未运行Godot/Host/插件测试、游戏命令或导出；游戏端执行存在非独立运行效果。

**分析版本**

- **仓库**：[Smalldy/godot-bridge](https://github.com/Smalldy/godot-bridge)
- **版本号**：0.2.1（[固定提交 bb1fe82](https://github.com/Smalldy/godot-bridge/tree/bb1fe822ab29473b9a57503985f58dd34422bd82)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)项目/实例/前后状态/保存/可运行导出回执，故障与人工对照验返工，不把未实现算创新。

只读固定Git对象/源码，未运行Godot/Host/插件测试、游戏命令或导出；游戏端执行存在非独立运行效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 1981 | — | — | 30891 |
| .js | source | 1 | 311 | 210 | 89 | — |
| .mjs | source | 5 | 2814 | 2295 | 429 | — |
| .mjs | test | 1 | 174 | 153 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Smalldy/godot-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核原生工具→真实引擎/游戏端执行、副作用/归属和结果验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生Godot运行态桥解决什么，相对MCP/引擎贡献在哪？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

godot-bridge0.2.1是原生DSH工具/客户端配置插件，让Agent启动Godot4项目、查询场景/UI、操作运行态、截图/eval和执行headless/项目文件操作。目标是开发时从改代码到实际游戏观察的短反馈回路，不是仅生成GDScript；成功仍需目标场景状态/交互与导出产物被核验。

基线是godot-mcp Node/Python/MCP接入、人工编辑器测试及DSH通用文件工具。插件用宿主原生工具/子进程替代协议转接，复用既有游戏内换行JSON服务器并附带autoload/操作脚本；引擎渲染/脚本执行仍是Godot，不能按105命令数量推原创或产品效果。README“游戏侧零改动”只对已有兼容autoload项目成立，当前启动会自动安装/覆盖脚本并注册project.godot，不是绝不改项目。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-14](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/README.md#L8-L14)

作者原生替代MCP/默认debug定位。

```text
Native **DeepSeek Harness (DSH)** plugin that launches and drives a running **Godot 4.x** game through its in-game TCP interaction server — replacing the [`godot-mcp`](https://github.com/tugcantopaloglu/godot-mcp) MCP server with first-class agent tools.

No MCP protocol, no Python server, no editor addon. The game side is untouched: `McpInteractionServer` (the `mcp_interaction_server.gd` autoload) already listens on `127.0.0.1:9090` and speaks newline-delimited JSON — godot-bridge speaks the same protocol natively from inside the DSH host.

## Tools

`godot_run_project` starts **without** the local debugger (`-d`) by default, so `godot_command eval` works normally. `debug:true` is **diagnostic mode**: the instance runs with the local debugger, the interaction server **refuses `eval`** (it learns this from the `GODOT_BRIDGE_DEBUGGER=1` environment variable the bridge sets at spawn — Godot consumes `-d` before `OS.get_cmdline_args()` can see it, measured on 4.7.2, so an argv check alone never fires) (a syntax error would otherwise enter the interactive `debug>` prompt and deadlock, issue #13), and a script error returns a `debuggerTrace` (break reason, `*Frame N` stack frames with `file:line`, ≤4 KB raw tail) plus a `next` step and ends that run. In diagnostic mode the bridge watches stdout for the debugger and writes exactly one `quit` (never `continue`), then classifies the outcome **by exit code**: exit 0 → `diagnosis: "debugger-quit"`; any non-zero code → `diagnosis: "debugger-trap"` with `exitCode` and `crash: true`; still running after 3 s → `debugger-trap` with `killed: true`. The classification is deliberately honest: on Godot 4.7.2-stable win64 writing `quit` exits in ~38 ms with **3221225477 (0xC0000005, ACCESS_VIOLATION)** and a C++ backtrace, so that run is reported as a crash trap, not as a graceful exit. Measured regression baseline (minimal project + syntax-error script): without `-d` the process exits in ~372 ms with `SCRIPT ERROR … at: GDScript::reload`; with `-d` and stdin at EOF it prints **12089** `Debugger Break`/`debug>` lines in 3 s (1.78 MB, ~590 KB/s) and must be killed — the issue #13 loop; with `-d` and a stdin pipe only one break/prompt appears (2.4 KB) because the debugger waits for input. To run code under the debugger, use `godot_run_headless --script`.
```

**依据 2 · 作者声明**：[README.md:55-59](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/README.md#L55-L59)

作者Godot/autoload/Node/引擎依赖。

```text

- DeepSeek Harness (a session with a host runtime)
- A Godot 4.x project with the `McpInteractionServer` autoload registered. If your project does not have it yet, copy `plugin/mcp_interaction_server.gd` to the project root and register it as an autoload named `McpInteractionServer` (godot-mcp projects already have this). **`godot_run_project` also auto-installs it when missing** (copies the vendored file into `autoload/` and registers it in `project.godot`), so no manual setup is needed — and non-Godot projects are completely unaffected.
- `node` on PATH
- Godot executable — resolved in this order: the `godot_path` tool argument → the **`godotPath` plugin setting** (the config of the `tool-godot-bridge` row: the `Godot engine path` field on the godot-bridge card's Plugins page on DSH 0.2.x, the `godot_set_engine_path` tool, or the plugin settings section on 0.1.x) → the `godot` command on PATH. Nothing to configure when `godot` is on PATH; otherwise set your engine path (the plugin author does not preset it — Godot is a portable exe that can live anywhere). Use the **real exe full path**, never a version-manager shim (see Pitfalls).
```

**依据 3 · 源码核查**：[package.json:1-17](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/package.json#L1-L17)

原生入口/版本。

<details>
<summary>查看原文（17行）</summary>

```text
{
  "name": "godot-bridge",
  "version": "0.2.1",
  "description": "DSH (DeepSeek Harness) plugin: launch and drive a running Godot 4.x game through its in-game TCP interaction server — replaces the godot-mcp MCP server with native agent tools.",
  "type": "module",
  "main": "plugin/godot-bridge.mjs",
  "exports": {
    ".": "./plugin/godot-bridge.mjs",
    "./client": "./client/client.js"
  },
  "files": [
    "plugin/",
    "client/",
    "cordis.patch.yml",
    "CHANGELOG.md",
    "CHANGELOG.zh-CN.md"
  ],
```

</details>

**依据 4 · 源码核查**：[package.json:32-49](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/package.json#L32-L49)

peer和MIT许可。

<details>
<summary>查看原文（18行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-tools": ">=0.1.6-0",
    "@deepseek-ai/schemastery": "^3.18.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-tools": {
      "optional": true
    },
    "@deepseek-ai/schemastery": {
      "optional": true
    }
  },
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/Smalldy/godot-bridge.git"
  },
  "dsh": {
```

</details>

**依据 5 · 源码核查**：[plugin/godot-bridge.mjs:751-787](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L751-L787)

实际安装/覆盖autoload和注册项目配置。

<details>
<summary>查看原文（37行）</summary>

```text
  async function ensureInteractionAutoload(projectPath) {
    try {
      const content = await readProjectFile(projectPath, 'project.godot')
      if (content === null) return { status: 'error', reason: 'project.godot not found at ' + projectPath }
      const source = fileURLToPath(new URL('./mcp_interaction_server.gd', import.meta.url))
      let text = null
      try {
        text = readFileSync(source, 'utf8')
      } catch (e) {}
      if (text === null) {
        return { status: 'error', reason: 'vendored mcp_interaction_server.gd unreadable at ' + source }
      }
      await ensureDir(projectPath + '/autoload')
      const existing = await readProjectFile(projectPath, 'autoload/mcp_interaction_server.gd')
      let outcome = 'ok'
      if (existing === null) {
        outcome = 'fixed'
      } else if (existing !== text) {
        outcome = 'upgraded'
      }
      if (existing === null || existing !== text) {
        await writeProjectFile(projectPath, 'autoload/mcp_interaction_server.gd', text)
      }
      // Make sure the autoload is registered regardless of the file state.
      const block = getSection(content, 'autoload')
      if (!(block && /(^|\n)\s*McpInteractionServer\s*=/.test(block))) {
        const next = setSectionKey(content, 'autoload', 'McpInteractionServer', '"*res://autoload/mcp_interaction_server.gd"')
        await writeProjectFile(projectPath, 'project.godot', next)
      }
      return {
        status: outcome,
        present: true,
        registered: true,
        path: 'res://autoload/mcp_interaction_server.gd',
        ...(outcome === 'upgraded' ? { note: 'mcp_interaction_server.gd was stale and has been overwritten with the current vendored version (plugin-managed file).' } : {}),
      }
    } catch (e) {
```

</details>

#### 缺口

- 真实游戏任务、版本/平台兼容及调试效率未测。
  **影响**：不能把可调用/截图返回当游戏正确或普遍节时。
  **进一步探讨**：同项目比较人工/MCP与原生工具，核场景交互/产物和净返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具怎样真正进入游戏执行并返回？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

插件注入subprocess/timer/tools/fs/sandboxPolicy/systemPrompt，注册官方工具。run_project先解析项目与引擎路径、确保vendored autoload；项目文件写使用以显式目标projectPath为root的workspace-write策略，不只会话cwd。运行态工具共用preflight，服务无回应时可推导项目、自动安装并启动，所以查询式工具也可能触发进程/文件副作用。

启动用原始subprocess.spawn Godot --path，传端口、ownership token和debug环境，collect输出并带exec.signal。每命令再起node -e短桥，TCP连127.0.0.1端口，发{command,params,id:1}一行JSON，取第一可解析行响应并退出。游戏端真实listen回环、JSON解析后match；set_property实际node.set并回读，eval构建GDScript.reload后临时Node.execute，截图等一帧后get_texture/image转PNG/base64。这是可产生真实游戏/本机代码效果的执行通道，不是schema宣称。

目标游戏进程在插件服务闭包单一godot变量，默认用最近启动/接管端口，非每Agent独立进程；TCP本地边界和token归属并不构成指令认证，server处理命令无token检查且get_instance_info公开回token。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/godot-bridge.mjs:47-50](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L47-L50)

真实原生依赖。

```text

export const name = 'godot-bridge'

export const inject = ['subprocess', 'timer', 'tools', 'fs', 'sandboxPolicy', 'systemPrompt']
```

**依据 2 · 源码核查**：[plugin/godot-bridge.mjs:724-738](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L724-L738)

目标项目root写策略。

<details>
<summary>查看原文（15行）</summary>

```text
  async function writeProjectFile(projectPath, filename, content) {
    const fs = ctx.fs
    const target = await fs.resolve(filename, { cwd: projectPath })
    // The fs service applies the DEPLOYMENT default policy unless one is
    // passed. The project being edited (not the session workspace) is the
    // correct write scope: godot_run_project legitimately touches
    // <project>/autoload/mcp_interaction_server.gd and project.godot inside
    // the target project, which sits outside the session workspace (they are
    // often siblings under the same parent). Rooting the policy at the project
    // keeps those writes legal while still confining them to that project tree.
    const policy = projectPath
      ? { mode: 'workspace-write', workspaceRoot: projectPath }
      : undefined
    await fs.writeText(target, content, undefined, undefined, policy)
    return true
```

</details>

**依据 3 · 源码核查**：[plugin/godot-bridge.mjs:1309-1327](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1309-L1327)

runtime preflight真实包装。

<details>
<summary>查看原文（19行）</summary>

```text
    }
    if (opt.timeoutMs) def.timeoutMs = opt.timeoutMs
    if (opt.runtime) {
      // Runtime tools (godot_command / godot_screenshot) share a common
      // pre-flight: ensure a game answers on 9090, self-healing by starting
      // the derivable project when none is running. Static/headless tools do
      // not opt in — they never need the game.
      def.execute = async function (args, exec) {
        try {
          const guard = await ensureGameService(args, exec)
          if (guard && guard.error) return sanitizeLossless(guard)
          return sanitizeLossless(await opt.execute(args, exec))
        } catch (e) {
          return { error: String((e && e.message) || e) }
        }
      }
    } else {
      def.execute = async function (args, exec) {
        try {
```

</details>

**依据 4 · 源码核查**：[plugin/godot-bridge.mjs:1131-1170](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1131-L1170)

无服务时自动推导/安装/启动。

<details>
<summary>查看原文（40行）</summary>

```text
  // is running it self-heals by starting the project IF a Godot project is
  // derivable (explicit project_path, or the session workspace holding
  // project.godot) — otherwise it returns actionable guidance instead of a
  // bare ECONNREFUSED. Read-only probing, no cross-session side effects.
  async function ensureGameService(args, exec) {
    try {
      const resp = await runGameCommand('get_performance', {}, 1500, exec.signal)
      if (resp && !resp.error) return null
    } catch (e) {}
    // The plugin owns a process: give it boot grace, then diagnose.
    if (godot) {
      for (let i = 0; i < 5; i++) {
        await ctx.timeout(1000)
        if (exec.signal && exec.signal.aborted) return { error: 'cancelled while waiting for the game server' }
        try {
          const r = await runGameCommand('get_performance', {}, 1500, exec.signal)
          if (r && !r.error) return null
        } catch (e) {}
      }
      return { error: 'The Godot process is running but the interaction server (127.0.0.1:' + (godot.port || PORT) + ') is not answering; it may have crashed or the McpInteractionServer autoload is missing. Call godot_get_debug_output to diagnose, or godot_run_project to restart (it auto-installs the autoload).' }
    }
    // No game: derive a Godot project and self-heal by starting it.
    let project = args.project_path || null
    if (!project) {
      const root = await getWorkspaceRoot(exec)
      if (root) {
        const pg = await readProjectFile(root, 'project.godot')
        if (pg !== null) project = root
      }
    }
    if (!project) {
      return { error: 'No Godot game is answering on 127.0.0.1:' + PORT + ' and no Godot project is derivable here. Call godot_run_project with the project path to start it (it auto-installs the McpInteractionServer autoload), or pass project_path to this tool.' }
    }
    const autoload = await ensureInteractionAutoload(project)
    if (autoload.status === 'error') return { error: 'autoload setup failed: ' + autoload.reason }
    const launched = await launchProject(project, { autoload: autoload }, exec)
    if (launched.error) return launched
    if (!launched.game_ready) {
      return { error: 'Started the game but the interaction server did not answer in time; call godot_get_debug_output to diagnose.' }
    }
```

</details>

**依据 5 · 源码核查**：[plugin/godot-bridge.mjs:1021-1064](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1021-L1064)

实际Godot spawn/env/输出/signal。

<details>
<summary>查看原文（44行）</summary>

```text
  }

  // Spawn one Godot process on a concrete port (managed, owned by us).
  async function spawnOwnInstance(gp, projectPath, port, opts, exec, extra) {
    const token = newToken()
    const debugMode = opts.debug === true
    const argv = buildLaunchArgv(gp, projectPath, { debug: debugMode, scene: opts.scene })
    let handle
    try {
      handle = subprocess.spawn({
        argv: argv,
        cwd: projectPath,
        env: {
          GODOT_BRIDGE_PORT: String(port),
          GODOT_BRIDGE_TOKEN: token,
          ...launchEnv(opts.debug === true),
        },
        stdio: {
          // Diagnostic mode keeps a stdin pipe so the watchdog can write "quit";
          // the default instance has no debugger and needs no stdin at all.
          stdin: debugMode ? 'pipe' : 'ignore',
          stdout: { collect: { maxBytes: 4 * 1024 * 1024, spill: { maxBytes: 32 * 1024 * 1024 } } },
          stderr: { collect: { maxBytes: 4 * 1024 * 1024, spill: { maxBytes: 32 * 1024 * 1024 } } },
        },
        graceMs: 3000,
        signal: exec.signal,
      })
    } catch (e) {
      return { error: 'failed to spawn Godot: ' + (e && e.message) }
    }
    godot = {
      handle: handle,
      outOffset: 0,
      errOffset: 0,
      projectPath: projectPath,
      scene: opts.scene || null,
      port: port,
      token: token,
      external: false,
      externalPid: null,
    }
    const ready = await waitForGame(exec.signal, opts.wait_ms || 20000, port)
    let debuggerWatch = null
    if (debugMode) debuggerWatch = await watchForDebugger(handle, exec, opts.wait_ms || 20000)
```

</details>

**依据 6 · 源码核查**：[plugin/godot-bridge.mjs:522-565](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L522-L565)

node短桥真实TCP发/收和subprocess。

<details>
<summary>查看原文（44行）</summary>

```text
  const BRIDGE = [
    "var NL=String.fromCharCode(10);",
    "var net=require('net');",
    "var cmd=process.argv[1]||'';",
    "var params={};",
    "try{params=JSON.parse(process.argv[2]||'{}');}catch(e){}",
    "var to=parseInt(process.argv[3]||'20000',10);if(!(to>0)){to=20000;}",
    "var prt=parseInt(process.argv[4]||'9090',10);if(!(prt>0&&prt<=65535)){prt=9090;}",
    "var sock=net.connect(prt,'127.0.0.1');",
    "var buf='',done=false;",
    "function fin(obj){if(done){return;}done=true;clearTimeout(t);try{sock.destroy();}catch(e){}process.stdout.write(JSON.stringify(obj));}",
    "var t=setTimeout(function(){fin({error:'bridge timeout'});},to);",
    "sock.on('connect',function(){sock.write(JSON.stringify({command:cmd,params:params,id:1})+NL);});",
    "sock.on('data',function(d){buf+=d.toString();for(;;){var i=buf.indexOf(NL);if(i<0){break;}var line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!line){continue;}try{fin(JSON.parse(line));return;}catch(e){}}});",
    "sock.on('error',function(e){fin({error:'tcp:'+e.message});});",
    "sock.on('close',function(){fin({error:'connection closed'});});",
  ].join('')

  async function runGameCommand(command, params, timeoutMs, signal, port) {
    const node = await getNodePath()
    const root = await getWorkspaceRoot()
    const targetPort = Number.isInteger(port) && port > 0 && port <= 65535 ? port : ((godot && Number.isInteger(godot.port)) ? godot.port : PORT)
    let handle
    try {
      handle = subprocess.spawn({
        argv: [node, '-e', BRIDGE, String(command), JSON.stringify(params || {}), String(timeoutMs || 20000), String(targetPort)],
        cwd: root || '.',
        stdio: {
          stdin: 'ignore',
          stdout: { collect: { maxBytes: 8 * 1024 * 1024 } },
          stderr: 'inherit',
        },
        graceMs: 3000,
        signal: signal,
      })
    } catch (e) {
      return { error: 'bridge spawn failed: ' + (e && e.message) }
    }
    let outcome
    try {
      outcome = await handle.done
    } catch (e) {
      return { error: 'bridge spawn failed: ' + (e && e.message) }
    }
```

</details>

**依据 7 · 源码核查**：[plugin/mcp_interaction_server.gd:43-65](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L43-L65)

游戏端实际监听与env token。

<details>
<summary>查看原文（23行）</summary>

```text
func _ready() -> void:
	# Ensure MCP server keeps processing even when game is paused
	process_mode = Node.PROCESS_MODE_ALWAYS
	_init_key_map()
	# Detect the local debugger from the process command line. Godot accepts
	# both the short and the long form; either one enables the debugger.
	_local_debugger = is_local_debugger(OS.get_cmdline_args())
	# Port and ownership token are injected by the godot-bridge plugin when it
	# spawns this process (GODOT_BRIDGE_PORT / GODOT_BRIDGE_TOKEN). A plain
	# editor-launched run gets neither and stays on 9090 with an empty token,
	# which is how the plugin tells its own instances apart from user-started
	# ones (see get_instance_info).
	var env_port: String = OS.get_environment("GODOT_BRIDGE_PORT")
	if env_port != "":
		var parsed: int = int(env_port)
		if parsed > 0 and parsed <= 65535:
			_port = parsed
	_token = OS.get_environment("GODOT_BRIDGE_TOKEN")
	_server = TCPServer.new()
	var err: int = _server.listen(_port, "127.0.0.1")
	if err != OK:
		push_error("McpInteractionServer: Failed to listen on port %d, error: %d" % [_port, err])
		return
```

</details>

**依据 8 · 源码核查**：[plugin/mcp_interaction_server.gd:126-159](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L126-L159)

游戏端解析和命令match无凭据门禁。

<details>
<summary>查看原文（34行）</summary>

```text
func _handle_command(json_str: String) -> void:
	var json: JSON = JSON.new()
	var parse_err: int = json.parse(json_str)
	if parse_err != OK:
		_send_response_raw({"error": "Invalid JSON: %s" % json.get_error_message()})
		return

	var data: Variant = json.data
	if not data is Dictionary:
		_send_response_raw({"error": "Expected JSON object"})
		return

	var req_id: Variant = data.get("id", null)

	if _busy:
		_send_response_raw({"error": "Server busy processing another command. Try again.", "id": req_id})
		return
	_busy = true
	_busy_since = Time.get_ticks_msec() / 1000.0
	_current_id = req_id

	var command: String = data.get("command", "")
	var params: Dictionary = data.get("params", {})

	match command:
		# Async commands (use await)
		"screenshot":
			await _cmd_screenshot()
		"click":
			await _cmd_click(params)
		"key_press":
			await _cmd_key_press(params)
		"eval":
			await _cmd_eval(params)
```

</details>

**依据 9 · 源码核查**：[plugin/mcp_interaction_server.gd:595-634](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L595-L634)

实际编译执行GDScript。

<details>
<summary>查看原文（40行）</summary>

```text
func _cmd_eval(params: Dictionary) -> void:
	if _local_debugger:
		_send_response({"error": EVAL_DEBUGGER_REFUSAL, "diagnosis": "debugger-trap", "next": "run the code with godot_run_headless --script, or restart the instance without debug:true"})
		return
	var code: String = params.get("code", "")
	if code.is_empty():
		_send_response({"error": "No code provided"})
		return

	# Wrap user code in a function so we can capture the return value
	var script_source: String = """extends Node

func execute():
	var __result = null
	__result = await _run()
	return __result

func _run():
%s
""" % [_indent_code(code)]

	var script: GDScript = GDScript.new()
	script.source_code = script_source
	var err: int = script.reload()
	if err != OK:
		_send_response({"error": "Failed to compile GDScript (error %d). Check syntax." % err})
		return

	var temp_node: Node = Node.new()
	temp_node.set_script(script)
	# Allow eval to work even when game is paused
	temp_node.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(temp_node)

	var result: Variant = null
	if temp_node.has_method("execute"):
		result = await temp_node.execute()

	temp_node.queue_free()
	_send_response({"success": true, "result": _variant_to_json(result)})
```

</details>

**依据 10 · 源码核查**：[plugin/mcp_interaction_server.gd:663-683](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L663-L683)

实际node.set及回读。

<details>
<summary>查看原文（21行）</summary>

```text
func _cmd_set_property(params: Dictionary) -> void:
	var node_path: String = params.get("node_path", "")
	var property: String = params.get("property", "")
	if node_path.is_empty() or property.is_empty():
		_send_response({"error": "node_path and property are required"})
		return

	var node: Node = get_tree().root.get_node_or_null(node_path)
	if node == null:
		_send_response({"error": "Node not found: %s" % node_path})
		return

	var raw_value: Variant = params.get("value", null)
	var type_hint: String = params.get("type_hint", "")
	var value: Variant
	if type_hint.is_empty():
		value = _json_to_variant_for_property(node, property, raw_value)
	else:
		value = _json_to_variant(raw_value, type_hint)
	node.set(property, value)
	_send_response({"success": true, "node_path": node_path, "property": property, "value": _variant_to_json(node.get(property))})
```

</details>

**依据 11 · 源码核查**：[plugin/mcp_interaction_server.gd:400-414](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L400-L414)

真实viewport截图/PNG/base64。

<details>
<summary>查看原文（15行）</summary>

```text
func _cmd_screenshot() -> void:
	# Wait one frame so the viewport is fully rendered
	await get_tree().process_frame
	var image: Image = get_viewport().get_texture().get_image()
	if image == null:
		_send_response({"error": "Failed to capture screenshot"})
		return
	var png_buffer: PackedByteArray = image.save_png_to_buffer()
	var base64_str: String = Marshalls.raw_to_base64(png_buffer)
	_send_response({
		"success": true,
		"data": base64_str,
		"width": image.get_width(),
		"height": image.get_height()
	})
```

</details>

**依据 12 · 源码核查**：[plugin/mcp_interaction_server.gd:841-856](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L841-L856)

instance_info实际返回token/project/pid。

<details>
<summary>查看原文（16行）</summary>

```text
func _cmd_get_instance_info() -> void:
	# Identity the running process so the godot-bridge plugin can tell its own
	# spawned instances (injected GODOT_BRIDGE_TOKEN, non-default port) from
	# user-started ones (editor-launched, empty token, default port). This is
	# what lets the plugin adopt an already-running instance instead of
	# spawning a duplicate that would fail to bind the port.
	_send_response({
		"success": true,
		"pid": OS.get_process_id(),
		"port": _port,
		"token": _token,
		"project_abs": ProjectSettings.globalize_path("res://").replace("\\", "/"),
		"engine": Engine.get_version_info().get("string", ""),
	})


```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 归属、调试和超时如何保护，哪里仍不保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

launchProject探测instance_info和项目绝对路径：同项目外部实例可adopt，非同项目/无身份活服务不盲起重复，选其它端口；token只帮助识别自己spawn的进程。stop_project拒绝external，托管则terminate/wait但catch忽略后清引用并返回stopped:true，不能据此当OS退出已证实。卸载只尝试终止托管实例、外部保留，不恢复autoload/project.godot或运行态/脚本副作用。

默认debug=false，debug=true经env使服务器拒eval，这是避免脚本错误陷debug>的具体防线，不是eval沙箱。普通模式eval任意GDScript可触及引擎/文件/网络权限；本机同用户可连回环端口，不能给不可信项目或多人共享Host安全隔离结论。

客户端超时销毁短桥并返回error；游戏端异步eval/动作不因客户端断连自动事务撤销。server _busy可120秒强制重置、断连也清忙状态，新连接还会替掉旧client，故并发/迟到结果需避免盲重发。调试trap路径仅托管实例写quit/terminate并返堆栈建议，非所有停机和游戏状态恢复保证。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/godot-bridge.mjs:583-605](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L583-L605)

真实实例探测/旧服务活性判断。

<details>
<summary>查看原文（23行）</summary>

```text
  // { unknown: true } marker when something answers but does not report
  // identity (e.g. an instance running the OLD autoload without
  // get_instance_info). Unknown occupancy must never be treated as empty —
  // spawning would create the duplicate that fails to bind.
  async function probeInstance(port, signal) {
    const resp = await runGameCommand('get_instance_info', {}, 3000, signal, port)
    if (!resp) return null
    if (resp.error || !resp.success) {
      // Something answered but doesn't speak get_instance_info. Liveness check:
      // if get_performance works, it's an unidentified live server → unknown.
      const perf = await runGameCommand('get_performance', {}, 3000, signal, port)
      if (perf && !perf.error) return { unknown: true, port: port }
      return null
    }
    return {
      pid: resp.pid,
      port: resp.port,
      token: String(resp.token || ''),
      projectAbs: normalizeAbs(resp.project_abs),
      engine: resp.engine,
    }
  }

```

</details>

**依据 2 · 源码核查**：[plugin/godot-bridge.mjs:809-879](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L809-L879)

有身份同项目接管/未知占用错误与外部归属。

<details>
<summary>查看原文（71行）</summary>

```text

    // ── Step 1: what is already on the requested port? ──
    const existing = await probeInstance(wantPort, exec.signal)
    if (existing && existing.unknown) {
      // Something live answers but reports no identity (old autoload). Never
      // spawn a duplicate over it — that is exactly the crash scenario. Try an
      // alternate port, or explain.
      if (opts.allowAltPort !== false) {
        for (let alt = wantPort + 1; alt <= wantPort + 5; alt++) {
          const other = await probeInstance(alt, exec.signal)
          if (other) continue
          return await spawnOwnInstance(gp, projectPath, alt, opts, exec, {
            adopted: false,
            conflictNote: 'port ' + wantPort + ' is occupied by an unidentified instance; this instance listens on ' + alt,
          })
        }
      }
      return {
        error: 'Port ' + wantPort + ' is occupied by a live Godot instance that does not report identity (it is running an older McpInteractionServer autoload). The plugin will not spawn a duplicate over it. Restart that instance with the current autoload, pass godot_run_project(port=<free>) to use another port, or stop the other project first.',
      }
    }
    if (existing && existing.token !== '' && godot && godot.token === existing.token) {
      // Our own previously-spawned process is still up: reuse it.
      godot.port = existing.port || wantPort
      return {
        pid: existing.pid,
        project_path: projectPath,
        godot_path: gp,
        scene: opts.scene || null,
        autoload: opts.autoload,
        game_ready: true,
        managed: true,
        port: godot.port,
        note: 'Reusing the game instance this plugin already started (pid ' + existing.pid + ').',
      }
    }
    if (existing) {
      const sameProject = existing.projectAbs !== '' && wantAbs !== '' && existing.projectAbs === wantAbs
      if (sameProject) {
        // A user-launched (or foreign-session) instance of OUR project is
        // already running. Adopt it: drive it, never spawn a duplicate, and
        // never let godot_stop_project terminate what we didn't start.
        godot = {
          handle: null,
          outOffset: 0,
          errOffset: 0,
          projectPath: projectPath,
          scene: opts.scene || null,
          port: existing.port || wantPort,
          token: existing.token,
          external: true,
          externalPid: existing.pid,
        }
        return {
          pid: existing.pid,
          project_path: projectPath,
          godot_path: gp,
          scene: opts.scene || null,
          autoload: opts.autoload,
          game_ready: true,
          managed: false,
          external: true,
          port: godot.port,
          note: 'A Godot instance of this project is already running (pid ' + existing.pid
            + ', launched by you in the editor or by another session). The plugin ADOPTED it instead of'
            + ' starting a duplicate — you can drive it with godot_command now. The plugin will NOT terminate'
            + ' this instance (godot_stop_project refuses external processes); to stop it, press F8 in the'
            + ' Godot editor or quit the game in-game.',
        }
      }
      // Different project on the port: not ours, not our target. Try a fresh
```

</details>

**依据 3 · 源码核查**：[plugin/godot-bridge.mjs:1469-1494](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1469-L1494)

外部拒停与托管terminate/wait忽略异常后stopped。

<details>
<summary>查看原文（26行）</summary>

```text
    defineTool({
      name: 'godot_stop_project',
      description: 'Terminate the Godot process started by godot_run_project (tree-scoped kill, like MCP stop_project). Only terminates plugin-managed instances; for user/editor-launched (external) instances it refuses and explains how to stop safely (F8 in the editor / quit in-game) — the plugin never kills processes it did not start.',
      properties: {},
      async execute(args, exec) {
        if (!godot) return { stopped: false, reason: 'no Godot process was started by this plugin' }
        if (godot.external) {
          return {
            stopped: false,
            external: true,
            pid: godot.externalPid,
            reason: 'This instance was launched by you (in the editor) or by another session — the plugin did NOT start it and will NOT terminate it; killing it could take down your Godot editor. To stop the running project, press F8 in the Godot editor, or quit the game in-game. If you want a plugin-managed instance instead, use godot_run_project with a different port.',
          }
        }
        const pid = godot.handle ? godot.handle.pid : godot.externalPid
        const projectPath = godot.projectPath
        try {
          if (godot.handle) {
            godot.handle.terminate()
            await godot.handle.waitForExit(exec.signal)
          }
        } catch (e) {}
        godot = null
        return { stopped: true, pid: pid, project_path: projectPath, managed: true }
      },
    }),
```

</details>

**依据 4 · 源码核查**：[plugin/godot-bridge.mjs:2098-2108](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L2098-L2108)

卸载只尝试终止托管不动外部。

<details>
<summary>查看原文（11行）</summary>

```text
  // Clean up the Godot child on plugin stop (matches MCP server cleanup).
  // Only a plugin-managed process is terminated; adopted external instances
  // are left alone (they belong to the user/editor or another session).
  ctx.effect(function () {
    return function () {
      if (godot && !godot.external && godot.handle) {
        try { godot.handle.terminate() } catch (e) {}
      }
      godot = null
    }
  })
```

</details>

**依据 5 · 源码核查**：[plugin/debug-guard.mjs:10-30](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/debug-guard.mjs#L10-L30)

真实debug argv/env约定。

<details>
<summary>查看原文（21行）</summary>

```text
/** Build the godot_run_project argv. -d is opt-in (diagnostic mode) only. */
export function buildLaunchArgv(godotPath, projectPath, opts) {
  const options = opts === undefined || opts === null ? {} : opts
  const argv = [String(godotPath)]
  if (options.debug === true) argv.push('-d')
  argv.push('--path', String(projectPath))
  if (options.scene) argv.push(String(options.scene))
  return argv
}

/**
 * Environment the bridge must pass to a spawned Godot so the in-game server can
 * tell it runs under the local debugger.
 *
 * The argv heuristic inside the server cannot work on a real spawn: Godot
 * consumes -d/--debug itself, so OS.get_cmdline_args() never contains them
 * (measured on 4.7.2: both launches report ["--script","args.gd"]). The
 * environment variable is the reliable channel.
 */
export function launchEnv(debug) {
  return { GODOT_BRIDGE_DEBUGGER: debug === true ? '1' : '0' }
```

</details>

**依据 6 · 源码核查**：[plugin/mcp_interaction_server.gd:595-634](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L595-L634)

debug拒eval及普通实际执行，无沙箱。

<details>
<summary>查看原文（40行）</summary>

```text
func _cmd_eval(params: Dictionary) -> void:
	if _local_debugger:
		_send_response({"error": EVAL_DEBUGGER_REFUSAL, "diagnosis": "debugger-trap", "next": "run the code with godot_run_headless --script, or restart the instance without debug:true"})
		return
	var code: String = params.get("code", "")
	if code.is_empty():
		_send_response({"error": "No code provided"})
		return

	# Wrap user code in a function so we can capture the return value
	var script_source: String = """extends Node

func execute():
	var __result = null
	__result = await _run()
	return __result

func _run():
%s
""" % [_indent_code(code)]

	var script: GDScript = GDScript.new()
	script.source_code = script_source
	var err: int = script.reload()
	if err != OK:
		_send_response({"error": "Failed to compile GDScript (error %d). Check syntax." % err})
		return

	var temp_node: Node = Node.new()
	temp_node.set_script(script)
	# Allow eval to work even when game is paused
	temp_node.process_mode = Node.PROCESS_MODE_ALWAYS
	add_child(temp_node)

	var result: Variant = null
	if temp_node.has_method("execute"):
		result = await temp_node.execute()

	temp_node.queue_free()
	_send_response({"success": true, "result": _variant_to_json(result)})
```

</details>

**依据 7 · 源码核查**：[plugin/mcp_interaction_server.gd:73-105](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L73-L105)

忙超时/新client替换/断连清busy。

<details>
<summary>查看原文（33行）</summary>

```text
	# Safety timeout: force-reset _busy if it's been stuck too long
	if _busy and _busy_since > 0.0:
		var elapsed: float = Time.get_ticks_msec() / 1000.0 - _busy_since
		if elapsed > BUSY_TIMEOUT:
			push_warning("McpInteractionServer: _busy flag stuck for %.1fs, force-resetting" % elapsed)
			_busy = false
			_busy_since = 0.0
			_current_id = null

	# Accept new connections
	if _server.is_connection_available():
		var new_client: StreamPeerTCP = _server.take_connection()
		if new_client != null:
			if _client != null:
				_client.disconnect_from_host()
			_client = new_client
			_buffer = ""
			print("McpInteractionServer: Client connected")

	# Read data from client
	if _client == null:
		return

	_client.poll()
	var status: int = _client.get_status()
	if status == StreamPeerTCP.STATUS_ERROR or status == StreamPeerTCP.STATUS_NONE:
		print("McpInteractionServer: Client disconnected")
		_client = null
		_buffer = ""
		_busy = false
		_busy_since = 0.0
		_current_id = null
		return
```

</details>

**依据 8 · 源码核查**：[plugin/godot-bridge.mjs:985-1002](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L985-L1002)

托管debug trap检测/quit/terminate。

<details>
<summary>查看原文（18行）</summary>

```text
  function debuggerTrapResult(command) {
    if (!godot || godot.external || !godot.handle) return null
    let text = ''
    try {
      if (godot.handle.collected && godot.handle.collected.stdout) text = godot.handle.collected.stdout.readFrom(0).text || ''
    } catch (e) {
      return null
    }
    if (text === '' || !detectDebuggerTrap(text)) return null
    const plan = debuggerRecoveryPlan()
    const wroteQuit = writeStdinTo(godot.handle, plan.input)
    try { godot.handle.terminate() } catch (e) {}
    return {
      error: 'bridge timeout',
      diagnosis: 'debugger-trap',
      command: String(command),
      debuggerTrace: parseDebuggerTrace(text),
      quit_written: wroteQuit,
```

</details>

**依据 9 · 源码核查**：[plugin/godot-bridge.mjs:522-537](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L522-L537)

短桥超时仅销毁socket并返回。

<details>
<summary>查看原文（16行）</summary>

```text
  const BRIDGE = [
    "var NL=String.fromCharCode(10);",
    "var net=require('net');",
    "var cmd=process.argv[1]||'';",
    "var params={};",
    "try{params=JSON.parse(process.argv[2]||'{}');}catch(e){}",
    "var to=parseInt(process.argv[3]||'20000',10);if(!(to>0)){to=20000;}",
    "var prt=parseInt(process.argv[4]||'9090',10);if(!(prt>0&&prt<=65535)){prt=9090;}",
    "var sock=net.connect(prt,'127.0.0.1');",
    "var buf='',done=false;",
    "function fin(obj){if(done){return;}done=true;clearTimeout(t);try{sock.destroy();}catch(e){}process.stdout.write(JSON.stringify(obj));}",
    "var t=setTimeout(function(){fin({error:'bridge timeout'});},to);",
    "sock.on('connect',function(){sock.write(JSON.stringify({command:cmd,params:params,id:1})+NL);});",
    "sock.on('data',function(d){buf+=d.toString();for(;;){var i=buf.indexOf(NL);if(i<0){break;}var line=buf.slice(0,i).trim();buf=buf.slice(i+1);if(!line){continue;}try{fin(JSON.parse(line));return;}catch(e){}}});",
    "sock.on('error',function(e){fin({error:'tcp:'+e.message});});",
    "sock.on('close',function(){fin({error:'connection closed'});});",
```

</details>

#### 缺口

- 并发命令/断连后eval/停进程和不可信项目行为未测试。
  **影响**：不能把本地端口/ownership/stop标志当隔离或回滚。
  **进一步探讨**：一次一项在副本测迟到结果/双Agent/外部接管和stop失败，核OS进程与项目状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何使用headless/导出结果，成本和恢复边界怎样？

**研究主题**：采用判断、效果与总成本

#### 完整回答

采用应先可丢弃项目/VCS备份，核引擎真实路径、目标端口/归属、autoload差异和会话/项目写范围。编辑器外部实例可被驱动但无插件stdout，需人工F8停；托管运行核输出、场景/属性和截图，运行态变化不等已保存资源。

run_headless真实spawn带exec.signal、timeout定时terminate，要求quit_after或脚本自己退出；它返回exitCode/stdout/stderr而非游戏逻辑质量。export_project成功判断为“stderr包含ERROR且exit_code非0”才failed，因此有非0但stderr无ERROR时仍可success:true，采用必须看exit_code并核输出文件/可运行性，不能只信success。headless脚本/项目也能写user://，原始子进程路径不是无副作用沙箱。

Godot/Node/宿主版本、导出模板/平台工具链、GPU/显示、模型token和人验成本未知；去掉MCP中间层只减少接线，不证明现金或总体人工下降。退出需明确停止托管、外部人停、恢复项目diff和清user://等输出，不自动还原。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/godot-bridge.mjs:1567-1635](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1567-L1635)

实际headless spawn/timeout与结果采集。

<details>
<summary>查看原文（69行）</summary>

```text
      },
    }),

    defineTool({
      name: 'godot_run_headless',
      description: 'Run the Godot project (or a scene, or a test script) headlessly as a NON-INTERACTIVE batch run, through the unconfined subprocess service: `godot --headless --path <project> [--quit-after N] [--script <script.gd>]`. This is the safe tool for "headlessly run scenes / main-loop logic / tests and hand back stdout-stderr" — it SOLELY spawns Godot via the unconfined subprocess service, so Godot\'s user:// log writes never hit the file sandbox (unlike launching godot --headless through pwsh/bash, which crashes it with signal 11). IMPORTANT: pass --quit-after (Godot-bundled arg that quits after N frames) or use a script that calls get_tree().quit(), otherwise a headless scene loops forever and this tool kills it on timeout. Returns stdout, stderr, exit code, and a sandbox-crash diagnosis when applicable.',
      properties: {
        project_path: { type: 'string', description: 'Godot project path (default: current session workspace)' },
        scene: { type: 'string', description: 'Optional scene to run relative to the project, e.g. scenes/main/main_menu.tscn' },
        script: { type: 'string', description: 'Optional GDScript (project-relative; with or without res:// prefix) to run instead of the project, e.g. tests/run_logic.gd. The script must call get_tree().quit() when done.' },
        quit_after: { type: 'number', description: 'Forward `--quit-after N` to Godot: quit after N frames (Godot 4.x). Use this for a bounded main-loop smoke test.' },
        timeout_ms: { type: 'number', description: 'How long to wait for the run before killing it (default 30000).' },
        godot_path: { type: 'string', description: 'Godot executable. Default: the godotPath setting, then the godot command on PATH.' },
      },
      timeoutMs: 130000,
      async execute(args, exec) {
        const root = await getWorkspaceRoot(exec)
        const projectPath = args.project_path || root
        if (!projectPath) return { error: 'project_path is required (workspace root unavailable)' }
        const gp = await resolveGodotPath(args.godot_path)
        if (!gp) return { error: GODOT_PATH_GUIDANCE }
        const argv = [gp, '--headless', '--path', projectPath]
        if (args.quit_after && Number(args.quit_after) > 0) argv.push('--quit-after', String(Math.floor(Number(args.quit_after))))
        if (args.scene) argv.push(String(args.scene))
        if (args.script) {
          const script = String(args.script)
          if (args.scene) return { error: 'pass either scene or script, not both' }
          argv.push('--script', script.startsWith('res://') ? script : 'res://' + script.replace(/^res:\/\//, ''))
        }
        let handle
        try {
          handle = subprocess.spawn({
            argv: argv,
            cwd: projectPath,
            stdio: {
              stdin: 'ignore',
              stdout: { collect: { maxBytes: 8 * 1024 * 1024 } },
              stderr: { collect: { maxBytes: 8 * 1024 * 1024 } },
            },
            graceMs: 1000,
            signal: exec.signal,
          })
        } catch (e) {
          return { error: 'headless spawn failed: ' + (e && e.message) }
        }
        // Bounded run: a headless scene with no quit mechanism loops forever.
        // Race the process against a deadline and terminate on timeout so the
        // tool always returns instead of hanging the model.
        const timeoutMs = Math.max(1, Number(args.timeout_ms) || 30000)
        let timedOut = false
        const killer = setTimeout(function () {
          timedOut = true
          try { handle.terminate() } catch (e) {}
        }, timeoutMs)
        let outcome
        try {
          outcome = await handle.done
        } catch (e) {
          outcome = { exitCode: -1, error: String((e && e.message) || e) }
        }
        clearTimeout(killer)
        let out = ''
        let err = ''
        try {
          if (handle.collected && handle.collected.stdout) out = handle.collected.stdout.readFrom(0).text || ''
          if (handle.collected && handle.collected.stderr) err = handle.collected.stderr.readFrom(0).text || ''
        } catch (e) {}
        const diagnosis = diagnoseCrash(out, err)
        // Lossless-JSON hardening: the DSH tool layer snapshots the returned
```

</details>

**依据 2 · 源码核查**：[plugin/godot-bridge.mjs:1636-1656](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1636-L1656)

headless实际成功/超时输出判据。

<details>
<summary>查看原文（21行）</summary>

```text
        // object property-by-property and rejects ANY `undefined` property
        // ("value is not lossless JSON") — unlike JSON.stringify, which would
        // silently drop it. It also rejects non-finite numbers and -0. Never
        // leave a field as undefined / NaN / -0 here.
        let exitCode = null
        if (typeof outcome.exitCode === 'number' && Number.isFinite(outcome.exitCode)) {
          exitCode = Object.is(outcome.exitCode, -0) ? 0 : outcome.exitCode
        }
        const result = {
          success: !timedOut && exitCode === 0,
          timed_out: timedOut,
          project_path: projectPath,
          exit_code: exitCode,
          argv: argv,
          stdout: out,
          stderr: err,
          ...(diagnosis || {}),
        }
        if (timedOut) {
          result.note = 'The headless run did not exit within the timeout and was killed. Add --quit-after to bound a scene/main-loop run, or make the script call get_tree().quit().'
        }
```

</details>

**依据 3 · 源码核查**：[plugin/godot-bridge.mjs:2080-2095](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L2080-L2095)

导出success具体条件与exit_code。

<details>
<summary>查看原文（16行）</summary>

```text
        const flag = args.debug ? '--export-debug' : '--export-release'
        const res = await runGodotHeadless(gp, projectPath, [flag, String(args.preset_name), String(args.output_path)], exec.signal)
        if (res.spawnError) return { error: 'export spawn failed: ' + res.spawnError }
        const failed = res.err.indexOf('ERROR') >= 0 && res.exitCode !== 0
        const diagnosis = diagnoseCrash(res.out, res.err)
        return {
          success: !failed,
          preset: args.preset_name,
          output: args.output_path,
          exit_code: res.exitCode,
          stdout: res.out,
          stderr: res.err,
          ...(diagnosis || {}),
        }
      },
    }),
```

</details>

**依据 4 · 源码核查**：[plugin/godot-bridge.mjs:1501-1523](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L1501-L1523)

外部无捕获输出/托管增量日志。

<details>
<summary>查看原文（23行）</summary>

```text
        if (!godot) return { running: false, reason: 'no Godot process started by this plugin' }
        if (godot.external || !godot.handle) {
          return {
            running: true,
            external: true,
            pid: godot.externalPid,
            reason: 'This instance was adopted (user/editor-launched), so the plugin has no captured stdout/stderr for it; drive it with godot_command.',
          }
        }
        let out = ''
        let err = ''
        const collected = godot.handle.collected
        if (collected && collected.stdout) {
          const r = collected.stdout.readFrom(godot.outOffset)
          out = r.text
          godot.outOffset = r.nextOffset
        }
        if (collected && collected.stderr) {
          const r = collected.stderr.readFrom(godot.errOffset)
          err = r.text
          godot.errOffset = r.nextOffset
        }
        return { running: true, pid: godot.handle.pid, stdout: out, stderr: err, ...(diagnoseCrash(out, err) || {}) }
```

</details>

**依据 5 · 源码核查**：[plugin/godot-bridge.mjs:751-787](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L751-L787)

autoload项目修改需备份。

<details>
<summary>查看原文（37行）</summary>

```text
  async function ensureInteractionAutoload(projectPath) {
    try {
      const content = await readProjectFile(projectPath, 'project.godot')
      if (content === null) return { status: 'error', reason: 'project.godot not found at ' + projectPath }
      const source = fileURLToPath(new URL('./mcp_interaction_server.gd', import.meta.url))
      let text = null
      try {
        text = readFileSync(source, 'utf8')
      } catch (e) {}
      if (text === null) {
        return { status: 'error', reason: 'vendored mcp_interaction_server.gd unreadable at ' + source }
      }
      await ensureDir(projectPath + '/autoload')
      const existing = await readProjectFile(projectPath, 'autoload/mcp_interaction_server.gd')
      let outcome = 'ok'
      if (existing === null) {
        outcome = 'fixed'
      } else if (existing !== text) {
        outcome = 'upgraded'
      }
      if (existing === null || existing !== text) {
        await writeProjectFile(projectPath, 'autoload/mcp_interaction_server.gd', text)
      }
      // Make sure the autoload is registered regardless of the file state.
      const block = getSection(content, 'autoload')
      if (!(block && /(^|\n)\s*McpInteractionServer\s*=/.test(block))) {
        const next = setSectionKey(content, 'autoload', 'McpInteractionServer', '"*res://autoload/mcp_interaction_server.gd"')
        await writeProjectFile(projectPath, 'project.godot', next)
      }
      return {
        status: outcome,
        present: true,
        registered: true,
        path: 'res://autoload/mcp_interaction_server.gd',
        ...(outcome === 'upgraded' ? { note: 'mcp_interaction_server.gd was stale and has been overwritten with the current vendored version (plugin-managed file).' } : {}),
      }
    } catch (e) {
```

</details>

#### 缺口

- 导出模板/真实产物、GPU/显示和总费用未验。
  **影响**：工具返回不替代实际可运行导出及人工验收。
  **进一步探讨**：固定小项目跑场景/导出/恢复对照，核文件与退出码及全部成本。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 从原生命令适配还能形成什么差异方向？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

独立假设：给游戏操作绑定项目/实例/场景身份和前后状态/截图/资源diff，并将“运行态变化、落盘、导出可运行”分别出验收回执，可能比继续堆命令更能减少错实例、临时效果被误当持久修复和假导出成功。这不是当前已实现验证产品，不能计入现有创新分。

用菜单点击/属性调整/脚本修复/导出小项目对照人工编辑器与当前桥，注入双实例、断连eval、导出非0无ERROR和重启后状态丢失；测错目标、重复效果、真实修复/可运行产物、验证人工和token费用。若回执不降低错误/返工或验证成本超过收益则停止。当前受限试用只限可信副本单操作者，本机共享/不可信项目先观察。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/godot-bridge.mjs:2080-2095](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L2080-L2095)

导出判据提供具体误验收测试起点。

<details>
<summary>查看原文（16行）</summary>

```text
        const flag = args.debug ? '--export-debug' : '--export-release'
        const res = await runGodotHeadless(gp, projectPath, [flag, String(args.preset_name), String(args.output_path)], exec.signal)
        if (res.spawnError) return { error: 'export spawn failed: ' + res.spawnError }
        const failed = res.err.indexOf('ERROR') >= 0 && res.exitCode !== 0
        const diagnosis = diagnoseCrash(res.out, res.err)
        return {
          success: !failed,
          preset: args.preset_name,
          output: args.output_path,
          exit_code: res.exitCode,
          stdout: res.out,
          stderr: res.err,
          ...(diagnosis || {}),
        }
      },
    }),
```

</details>

**依据 2 · 源码核查**：[plugin/mcp_interaction_server.gd:663-683](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/mcp_interaction_server.gd#L663-L683)

运行态set回读不证明落盘。

<details>
<summary>查看原文（21行）</summary>

```text
func _cmd_set_property(params: Dictionary) -> void:
	var node_path: String = params.get("node_path", "")
	var property: String = params.get("property", "")
	if node_path.is_empty() or property.is_empty():
		_send_response({"error": "node_path and property are required"})
		return

	var node: Node = get_tree().root.get_node_or_null(node_path)
	if node == null:
		_send_response({"error": "Node not found: %s" % node_path})
		return

	var raw_value: Variant = params.get("value", null)
	var type_hint: String = params.get("type_hint", "")
	var value: Variant
	if type_hint.is_empty():
		value = _json_to_variant_for_property(node, property, raw_value)
	else:
		value = _json_to_variant(raw_value, type_hint)
	node.set(property, value)
	_send_response({"success": true, "node_path": node_path, "property": property, "value": _variant_to_json(node.get(property))})
```

</details>

**依据 3 · 源码核查**：[plugin/godot-bridge.mjs:809-879](https://github.com/Smalldy/godot-bridge/blob/bb1fe822ab29473b9a57503985f58dd34422bd82/plugin/godot-bridge.mjs#L809-L879)

实例归属与同项目接管是目标核验起点。

<details>
<summary>查看原文（71行）</summary>

```text

    // ── Step 1: what is already on the requested port? ──
    const existing = await probeInstance(wantPort, exec.signal)
    if (existing && existing.unknown) {
      // Something live answers but reports no identity (old autoload). Never
      // spawn a duplicate over it — that is exactly the crash scenario. Try an
      // alternate port, or explain.
      if (opts.allowAltPort !== false) {
        for (let alt = wantPort + 1; alt <= wantPort + 5; alt++) {
          const other = await probeInstance(alt, exec.signal)
          if (other) continue
          return await spawnOwnInstance(gp, projectPath, alt, opts, exec, {
            adopted: false,
            conflictNote: 'port ' + wantPort + ' is occupied by an unidentified instance; this instance listens on ' + alt,
          })
        }
      }
      return {
        error: 'Port ' + wantPort + ' is occupied by a live Godot instance that does not report identity (it is running an older McpInteractionServer autoload). The plugin will not spawn a duplicate over it. Restart that instance with the current autoload, pass godot_run_project(port=<free>) to use another port, or stop the other project first.',
      }
    }
    if (existing && existing.token !== '' && godot && godot.token === existing.token) {
      // Our own previously-spawned process is still up: reuse it.
      godot.port = existing.port || wantPort
      return {
        pid: existing.pid,
        project_path: projectPath,
        godot_path: gp,
        scene: opts.scene || null,
        autoload: opts.autoload,
        game_ready: true,
        managed: true,
        port: godot.port,
        note: 'Reusing the game instance this plugin already started (pid ' + existing.pid + ').',
      }
    }
    if (existing) {
      const sameProject = existing.projectAbs !== '' && wantAbs !== '' && existing.projectAbs === wantAbs
      if (sameProject) {
        // A user-launched (or foreign-session) instance of OUR project is
        // already running. Adopt it: drive it, never spawn a duplicate, and
        // never let godot_stop_project terminate what we didn't start.
        godot = {
          handle: null,
          outOffset: 0,
          errOffset: 0,
          projectPath: projectPath,
          scene: opts.scene || null,
          port: existing.port || wantPort,
          token: existing.token,
          external: true,
          externalPid: existing.pid,
        }
        return {
          pid: existing.pid,
          project_path: projectPath,
          godot_path: gp,
          scene: opts.scene || null,
          autoload: opts.autoload,
          game_ready: true,
          managed: false,
          external: true,
          port: godot.port,
          note: 'A Godot instance of this project is already running (pid ' + existing.pid
            + ', launched by you in the editor or by another session). The plugin ADOPTED it instead of'
            + ' starting a duplicate — you can drive it with godot_command now. The plugin will NOT terminate'
            + ' this instance (godot_stop_project refuses external processes); to stop it, press F8 in the'
            + ' Godot editor or quit the game in-game.',
        }
      }
      // Different project on the port: not ours, not our target. Try a fresh
```

</details>

#### 缺口

- 状态/产物回执是否降低返工未验证。
  **影响**：不把设想作为已有游戏测试覆盖/业务交付创新。
  **进一步探讨**：按上述故障和人工对照验证并设停止阈值。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
