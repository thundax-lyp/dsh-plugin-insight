# Unity Plugin for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1cfcc6c](https://github.com/opdsh/unity-plugin/tree/1cfcc6c33962152c8db22ada853179957d69c43b)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/opdsh/unity-plugin) [![npm 30d 2,230](https://img.shields.io/static/v1?label=npm+30d&message=2%2C230&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opdsh/unity-plugin) [![最新发布 2026-09-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@opdsh/unity-plugin)
<!-- END META -->

> **功能**：把 Unity CLI 和正在运行的 Editor 接成 DSH 工具，支持状态、命令、C# 和配置。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 用结构工具、配置与暖会话减少反复启动和手工转接，真实命令和执行仍由 Unity CLI 和 Editor 提供。

> **主要限制**：[Q03](#research-q03) cwd 复用与目标 projectPath 是不同边界。工具允许 C# 和原始 argv，取消只在本地终止暖会话，Editor 是否已执行须重读。暖 stdout 限制覆盖残余缓冲。

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
  - [Q01 · 什么 Unity 工作会从插件接入受益？](#detail-section-11)
  - [Q02 · status 与编辑命令怎样到达 Editor？](#detail-section-12)
  - [Q03 · 取消、超时、项目范围及代码执行怎样约束？](#detail-section-13)
  - [Q04 · Unity、许可证、配置与技能缓存由谁管理？](#detail-section-14)
  - [Q05 · 怎样在可销毁项目验收观察与修改边界？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 DSH 的 Unity 开发者需要在一个会话确认项目、发现 Editor 命令并回读结果，合格结果应能核对真实项目和状态。[Q01](#research-q01)

原生 Unity CLI 可直接执行同样的 Editor 操作，作者也列出宿主 MCP 直连。需要自行处理命令发现、结构输出和工作目录。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态和命令发现 | 核对 Editor 并读取可用命令 | 需 CLI 和项目 Pipeline |
| Editor 命令与 C# | 操作项目和执行代码 | 权限由真实宿主控制，当前插件未限制为只读 |
| 暖/冷子进程 | 不同执行通路及可控等待 | 取消后须核对 Editor 状态 |
| 技能与配置 | 辅助命令和项目操作 | 外部下载与缓存需核对来源 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容的 DSH tools/subprocess | 插件运行必需 | 注册并执行工具 | 核对宿主入口 |
| 授权的 Unity CLI、Unity 6 与 Pipeline | 代表 Editor 调用必需 | 连接实际 Editor | 使用原生状态查错 |
| 限制工具的宿主及可销毁项目 | 首轮试用需要 | 隔离读写和目标 | 停止试用 |
| git、网络、Python | 技能下载或 Asset Store 需要 | 取技能及处理资产 | 首轮可不选对应能力 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 固定环境 | 开发者核对 CLI、宿主、项目和工具许可 | 仅开放状态和命令发现 |
| 读取状态 | 在原生 CLI 和插件读取同一目标 | 核对项目身份、就绪与字段 |
| 查失败 | 使用不在运行的测试实例或仿真延迟 | 区分拒绝和已发后的结果未知 |
| 退出 | 停止调用，在原生 Editor 对账 | 回退项目副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 编辑器、许可和测试项目 | 配置工具、项目和可选技能 | 实际费用与安装未测 |
| 持续 | 模型及常驻进程 | 查看目标、结果和权限 | 时延收益未复现 |
| 失败恢复 | 项目副本及重试资源 | 核对实际状态后决定是否重发 | 退出码与 Editor 可能不同步 |
| 退出 | 保留必要项目或成果 | 卸载并检查已有变更、缓存 | 实际清理未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 状态和命令发现 | DSH 工具及结构调用 | 真实 CLI 和 Editor 兼容 |
| 暖调用 | 按 cwd 复用并序列化 | 真实时延及跨项目行为 |
| 取消 | 清理本地请求和进程 | 已发命令的 Editor 效果 |

> **思考**：[Q03](#research-q03) cwd 复用与目标 projectPath 是不同边界。工具允许 C# 和原始 argv，取消只在本地终止暖会话，Editor 是否已执行须重读。暖 stdout 限制覆盖残余缓冲。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 用结构工具、配置与暖会话减少反复启动和手工转接，真实命令和执行仍由 Unity CLI 和 Editor 提供。

[Q02](#research-q02) 工具以 cwd 选暖池、projectPath 选目标，配对响应 id。[Q03](#research-q03) 取消已发请求会拒绝同池等待者并终止本地 CLI。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) cwd 复用与目标 projectPath 是不同边界。工具允许 C# 和原始 argv，取消只在本地终止暖会话，Editor 是否已执行须重读。暖 stdout 限制覆盖残余缓冲。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在可销毁项目和最低权限宿主只验收 status/list。需要执行能力、目标不符或效果未知时停止并人工核对。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实 DSH 注册、暖/冷子进程、队列与取消。真实 Unity 效果、兼容和性能未验收，目标回读设计有待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client/index.ts、src/tools.ts、src/unity-shell.ts、src/unity-cli.ts、src/skill.ts、src/unity-skills-fetch.ts、src/live-config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：首次源码研究，固定根 DSH 工具、暖会话与配置。未运行目标或验证 Unity Editor、Asset Store、许可及实际技能内容。
- 下一步：[Q05](#research-q05) 固定测试项目和 CLI，比较原生与暖冷调用的状态；注入取消再回读 Editor，记录待核结果。

**分析版本**

- **仓库**：[opdsh/unity-plugin](https://github.com/opdsh/unity-plugin)
- **版本号**：0.1.7（[固定提交 1cfcc6c](https://github.com/opdsh/unity-plugin/tree/1cfcc6c33962152c8db22ada853179957d69c43b)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将目标 Editor 标识、写后回读与效果未知记录带入调度，可能减少误操作与重复修改。用故障注入比较用户的重试决定。

[Q05](#research-q05) 固定测试项目和 CLI，比较原生与暖冷调用的状态；注入取消再回读 Editor，记录待核结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 658 | — | — | 7311 |
| .ts | source | 10 | 1487 | 975 | 411 | — |
| .tsx | source | 1 | 208 | 162 | 34 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/opdsh/unity-plugin/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Unity 开发者怎样通过 DSH 读取并操作测试项目，哪些宿主、项目选择、取消和可执行能力会改变试用决定？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么 Unity 工作会从插件接入受益？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 对话里反复核对 Unity 项目编辑器是否可达、有哪些命令并检查调用返回的开发者，可用该包组织项目和编辑器控制。验收应确认真实项目、Editor 就绪和可审阅结果。直接 Unity CLI 仍可执行同一操作；作者另给 `unity mcp` 接官方 DSH MCP client 的基线。插件增量在于五个有描述的模型工具、结构输出、配置卡、可选技能和暖会话。真实编辑、构建、测试及 Asset Store 能力还取决于 Unity CLI、Editor 和账号。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:148-164](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/README.md#L148-L164)

作者列工具、编辑行为和技能。

<details>
<summary>查看原文（17行）</summary>

```text
## What's included

**Agent tools**

| Tool | Purpose |
| --- | --- |
| `unity_status` | List running Editors the plugin can talk to. |
| `unity_list_commands` | Discover the connected Editor's commands and their parameters. |
| `unity_command` | Run one live Editor command, such as `create_gameobject`, `get_scene_hierarchy`, or `save_scene`. |
| `unity_eval` | Run C# inside the Editor with full `UnityEngine` and `UnityEditor` access. |
| `unity_cli` | Everything else the CLI offers: `projects create`, `open`, `pipeline install`, `templates list`, `editors`, `test`, `build`, `auth`, `license`, `logs`. |

**Skills**

- **Unity's official skill collection**, downloaded from [Unity-Technologies/skills](https://github.com/Unity-Technologies/skills): unity-cli, new-unity-project, build-live-game, the UI family, package management, physics, optimization, multiplayer, and more.
- **unity-workflow**: how to drive the Editor safely with the tools above (check status first, bootstrap a project, the scene loop, tests and builds).
- **unity-asset-store**: search, download, and import assets you own from the Unity Asset Store.
```

</details>

**依据 2 · 作者声明**：[README.md:198-206](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/README.md#L198-L206)

作者描述暖会话和官方 MCP 替代。

```text
<summary>Design notes</summary>

- Tools spawn the CLI through the harness `subprocess` service: `argv` only, never shell-interpreted; bounded collected output; tree-scoped termination; the abort signal is forwarded so tool timeouts kill the whole process tree.
- The four live-Editor tools (`unity_status`, `unity_list_commands`, `unity_command`, `unity_eval`) share a warm `unity shell --protocol ndjson` session per working directory, cutting per-call latency from roughly 600 ms of CLI start-up to single-digit milliseconds. Requests serialize per session; a timeout or cancellation mid-request kills the session and the next call respawns it; idle sessions are disposed after `shellIdleMs`. Set `warmShell: false` to fall back to one process per call. `unity_cli` always spawns per call because builds and tests run long and want raw streams.
- Every invocation passes `--non-interactive`, so a command that needs interactive input fails loudly instead of hanging the agent.
- The subprocess service scrubs credential-shaped environment variables from the child; CI service-account credentials must be passed explicitly via the `env` config field.
- `commandTimeoutMs`, `cliTimeoutMs`, `shellIdleMs`, and `outputMaxBytes` must be greater than zero, `graceMs` at least zero, and every duration at most 2147483647 ms (the longest delay a Node timer honours). The settings form refuses to save invalid values, and the Loader keeps the running values when an edited config fails validation.
- Live-Editor tools return the CLI's uniform JSON envelope (`{ success, command, data, errors, warnings }`) as structured output, so they compose with Code Mode.
- Alternative integration: the CLI ships an MCP stdio server (`unity mcp`). Pointing `@deepseek-ai/dsh-mcp-client` at it works with zero code but forfeits render cards, config validation, and curated tool descriptions. This plugin exists to provide those.
```

**依据 3 · 源码核查**：[package.json:14-39](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/package.json#L14-L39)

DSH Host、Web 和补丁声明。

<details>
<summary>查看原文（26行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "type": "module",
  "main": "lib/index.mjs",
  "types": "lib/index.d.mts",
  "exports": {
    ".": {
      "types": "./lib/index.d.mts",
      "import": "./lib/index.mjs"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-plugin-manager"
      ]
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/cordis.patch.yml#L1-L6)

根包实际加载。

```text
# Bundle layer applied when a profile lists @opdsh/unity-plugin. Override this row's
# config from your profile's cordis.patch.yml (a patch replaces the whole
# config value, so restate every key you need).
- insert:
    - id: unity
      name: '@opdsh/unity-plugin'
```

**依据 5 · 源码核查**：[src/index.ts:84-94](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/index.ts#L84-L94)

实际挂工具及可选技能。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  const watch = watchConfig(ctx)
  registerUnityTools(ctx, config, watch)
  // This package ships its own settings page, so Settings clients that build
  // pages from the schema skip this entry.
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.effect(() => settingsCtx.settings.configure({ auto: false }, ctx.fiber), 'unity settings page policy')
  })
  ctx.inject(['skills'], (skillsCtx) => {
    registerUnitySkills(skillsCtx, config, watch)
  })
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:36-45](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/client/index.ts#L36-L45)

Web 配置卡实际注册。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const controller = new UnityCardController(ctx.configForms.get<UnityTunablesSection>(UNITY_NS))
  ctx.effect(() => () => { controller.dispose() }, 'unity-plugin: form subscription')
  // The slot is declared by the Plugins page; inject() registers for each
  // declaration lifetime and re-registers after the declarer restarts.
  ctx.effect(() => ctx.configForms.whileServed([UNITY_NS], () => ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config',
    key: PACKAGE_NAME,
    inject: () => controller.inject(),
  }, UnityCard))), 'unity-plugin: settings card')
```

</details>

#### 缺口

- 实际 Unity 操作时长和可达性未测。
  **影响**：已有 CLI 或 MCP 的开发者可能只得到较小增量。
  **进一步探讨**：固定项目比较状态、命令发现和结果回读次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · status 与编辑命令怎样到达 Editor？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主 apply 调用 registerUnityTools，配置变动会释放上一次工具及暖池并重挂。`unity_status` 走 `runJson(['status'])`，`unity_list_commands` 走 `command` 加目标旗标。实际编辑工具把命令名、原始 argv、所选项目路径及统一 JSON/non-interactive 旗标一起传入。默认暖池通过调用 Agent 的 cwd（无则宿主 cwd）复用 NDJSON 子进程，串行写包含 id 和 argv 的请求，按 id、exitCode 和 envelope 解响应。不启用暖池时经 DSH subprocess 单独执行。`unity_cli` 总是按次执行并返回有截断标志的原始流。一个合法外层 envelope 仍需检查 exitCode、success、errors 和真实 Editor 效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:27-28](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/index.ts#L27-L28)

依赖 tools 与 subprocess。

```text
export const name = 'unity'
export const inject = ['tools', 'subprocess']
```

**依据 2 · 源码核查**：[src/tools.ts:113-134](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L113-L134)

注册配置监听及卸载。

<details>
<summary>查看原文（22行）</summary>

```text
export function registerUnityTools(ctx: Context, config: UnityToolsConfig, watch: ConfigWatch): void {
  let dispose: (() => void) | undefined
  const mount = (): void => {
    dispose?.()
    dispose = mountUnityTools(ctx, {
      unityBin: config.unityBin.get(),
      projectPath: config.projectPath.get(),
      commandTimeoutMs: config.commandTimeoutMs.get(),
      cliTimeoutMs: config.cliTimeoutMs.get(),
      graceMs: config.graceMs.get(),
      outputMaxBytes: config.outputMaxBytes.get(),
      env: config.env,
      warmShell: config.warmShell.get(),
      shellIdleMs: config.shellIdleMs.get(),
    })
  }
  ctx.effect(() => () => {
    dispose?.()
    dispose = undefined
  }, 'unity tools')
  mount()
  ctx.effect(() => watch(TOOL_CONFIG_KEYS, mount), 'unity tools: live config')
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:143-184](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L143-L184)

cwd、项目参数与暖/冷路由选择。

<details>
<summary>查看原文（42行）</summary>

```text
function mountUnityTools(ctx: Context, settings: UnityToolsSettings): () => void {
  const disposers: (() => void)[] = []
  /** The calling agent's session cwd, else the harness process cwd. */
  const cwdOf = (exec: ToolRunContext): string => exec.agent?.session.header.cwd ?? process.cwd()

  /** `--project-path` flags for the effective target project, empty when none is known. */
  const projectFlags = (override: string | undefined): string[] => {
    const path = override ?? settings.projectPath
    return path === undefined ? [] : ['--project-path', path]
  }

  /** One fully-resolved spec for a JSON-envelope invocation. */
  const jsonSpec = (exec: ToolRunContext, args: readonly string[]): UnityRunSpec => ({
    bin: settings.unityBin,
    args: [...args, '--format', 'json', '--non-interactive'],
    cwd: cwdOf(exec),
    env: settings.env,
    graceMs: settings.graceMs,
    outputMaxBytes: settings.outputMaxBytes,
    signal: exec.signal,
  })

  /** Warm-session pool behind the live-Editor tools; absent when `warmShell` is off. */
  const pool = settings.warmShell
    ? new UnityShellPool(ctx, {
        bin: settings.unityBin,
        env: settings.env,
        graceMs: settings.graceMs,
        outputMaxBytes: settings.outputMaxBytes,
        idleMs: settings.shellIdleMs,
      })
    : undefined
  if (pool !== undefined) {
    disposers.push(() => { pool.disposeAll() })
  }

  /** Run one envelope invocation through the warm session, or per-call when `warmShell` is off. */
  const runJson = async (exec: ToolRunContext, args: readonly string[]): Promise<UnityJsonResult> => {
    const spec = jsonSpec(exec, args)
    if (pool === undefined) return await runUnityJson(ctx, spec)
    return await pool.runJson(spec.cwd, spec.args, spec.signal)
  }
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:186-204](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L186-L204)

status 真实注册和执行。

<details>
<summary>查看原文（19行）</summary>

```text
  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_status',
    description:
      'Report the Unity Editor instances currently reachable by the unity CLI. '
      + 'success=false with a STATUS_NO_INSTANCES error means no running Editor has the Pipeline package loaded '
      + '(open one with unity_cli ["open", "<project>", "--args", "-automated"], then poll this until state is "ready"). '
      + 'Run this before live-Editor operations and BEFORE editing scene or asset files directly — '
      + 'never hand-edit .unity/.prefab/.asset files while a live Editor is reachable.',
    parameters: {},
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => true,
    async execute(_args, exec) {
      return await runJson(exec, ['status'])
    },
    presentCall: () => ({ card: 'generic', title: 'Check Unity Editor status', kind: 'read' }),
```

</details>

**依据 5 · 源码核查**：[src/tools.ts:207-223](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L207-L223)

列表真实执行和项目参数。

<details>
<summary>查看原文（17行）</summary>

```text
  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_list_commands',
    description:
      'List every command the connected Unity Editor exposes, with full parameter schemas. '
      + 'The command set is Editor- and project-defined (projects register custom [CliCommand] tools), '
      + 'so discover names here rather than assuming a command exists before calling unity_command.',
    parameters: { projectPath: PROJECT_PATH_PARAMETER },
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      return await runJson(exec, ['command', ...projectFlags(args.projectPath)])
    },
    presentCall: () => ({ card: 'generic', title: 'List Unity Editor commands', kind: 'read' }),
```

</details>

**依据 6 · 源码核查**：[src/tools.ts:226-252](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L226-L252)

编辑命令接受原始 argv。

<details>
<summary>查看原文（27行）</summary>

```text
  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_command',
    description:
      'Run one named command on a running Unity Editor — e.g. create_gameobject, find_gameobjects, '
      + 'get_scene_hierarchy, set_transform, add_component, save_scene, editor_play, screenshot. '
      + 'Discover available names and their parameters with unity_list_commands first. '
      + 'Round-trips complete in under a second with no domain reload. '
      + 'Pass command parameters as raw CLI flag/value elements in `args`, e.g. ["--name", "Player", "--x", "1.5"].',
    parameters: {
      command: { type: 'string', required: true, description: 'The Editor command name, exactly as unity_list_commands reports it.' },
      args: {
        type: 'array',
        items: { type: 'string' },
        description: 'Raw CLI arguments appended verbatim after the command name (argv elements, never shell-quoted). Omit for a command with no parameters.',
      },
      projectPath: PROJECT_PATH_PARAMETER,
    },
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      return await runJson(exec, ['command', args.command, ...(args.args ?? []), ...projectFlags(args.projectPath)])
    },
    presentCall: args => ({ card: 'generic', title: `Unity: ${args.command}`, kind: 'execute', rawInput: args.args }),
```

</details>

**依据 7 · 源码核查**：[src/unity-shell.ts:76-88](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L76-L88)

真正启动 NDJSON shell。

<details>
<summary>查看原文（13行）</summary>

```text
  constructor(ctx: Context, spec: UnityShellPoolSpec, cwd: string) {
    this.spec = spec
    this.handle = ctx.subprocess.spawn({
      argv: [spec.bin, 'shell', '--protocol', 'ndjson', '--non-interactive', '--no-banner', '--quiet'],
      cwd,
      stdio: {
        stdin: 'pipe',
        stdout: 'pipe',
        stderr: { maxBytes: spec.outputMaxBytes },
      },
      graceMs: spec.graceMs,
      env: spec.env,
    })
```

</details>

**依据 8 · 源码核查**：[src/unity-shell.ts:170-185](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L170-L185)

实际发送带 id 的串行请求。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Write the next queued request when none is in flight. */
  private pump(): void {
    if (this.deadError !== undefined || this.inflight !== undefined) return
    const next = this.queue.shift()
    if (next === undefined) return
    this.inflight = next
    try {
      this.stdin.write(`${JSON.stringify({ id: next.id, argv: next.argv })}\n`, () => {
        // A write error means the child is gone or dying; handle.done settles
        // next with the authoritative spawn/exit error, which fails the
        // session. Failing here first would mask that error (e.g. reporting
        // EPIPE for a missing binary).
      })
    } catch {
      // A destroyed stdin stream throws synchronously; same deferral as above.
    }
```

</details>

**依据 9 · 源码核查**：[src/unity-shell.ts:210-229](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L210-L229)

验证相符的响应封装。

<details>
<summary>查看原文（20行）</summary>

```text
    try {
      parsed = JSON.parse(line) as UnityJson
    } catch {
      this.fail(new Error(`unity shell wrote a non-JSON line: ${diagnosticTail(line)}`))
      return
    }
    const inflight = this.inflight
    if (
      typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)
      || inflight === undefined || parsed.id !== inflight.id
      || typeof parsed.exitCode !== 'number' || !('envelope' in parsed)
    ) {
      this.fail(new Error(`unity shell wrote an unexpected response line: ${diagnosticTail(line)}`))
      return
    }
    this.inflight = undefined
    inflight.unlisten()
    inflight.resolve({ exitCode: parsed.exitCode, envelope: parsed.envelope })
    this.pump()
    if (this.idle) this.onIdle?.()
```

</details>

**依据 10 · 源码核查**：[src/unity-shell.ts:299-312](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L299-L312)

复用和按需重建以 cwd 为键。

<details>
<summary>查看原文（14行）</summary>

```text
  async runJson(cwd: string, argv: readonly string[], signal: AbortSignal): Promise<UnityJsonResult> {
    let entry = this.sessions.get(cwd)
    if (entry === undefined || entry.session.dead) {
      if (entry !== undefined) this.drop(cwd)
      const session = new UnityShellSession(this.ctx, this.spec, cwd)
      entry = { session, idleTimer: undefined }
      session.onIdle = () => { this.onSessionIdle(cwd) }
      this.sessions.set(cwd, entry)
    }
    if (entry.idleTimer !== undefined) {
      clearTimeout(entry.idleTimer)
      entry.idleTimer = undefined
    }
    return await entry.session.request(argv, signal)
```

</details>

**依据 11 · 源码核查**：[src/unity-cli.ts:64-83](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-cli.ts#L64-L83)

冷启动 subprocess 的 argv、输出限额和信号。

<details>
<summary>查看原文（20行）</summary>

```text
export async function runUnity(ctx: Context, spec: UnityRunSpec): Promise<UnityRunResult> {
  if (spec.signal.aborted) {
    throw new Error('unity CLI run was aborted before start (tool timeout or caller cancellation)')
  }
  let handle: SubprocessHandle
  try {
    handle = ctx.subprocess.spawn({
      argv: [spec.bin, ...spec.args],
      cwd: spec.cwd,
      stdio: {
        stdin: 'ignore',
        stdout: { maxBytes: spec.outputMaxBytes },
        stderr: { maxBytes: spec.outputMaxBytes },
      },
      graceMs: spec.graceMs,
      signal: spec.signal,
      env: spec.env,
    } satisfies SubprocessSpawnSpec)
  } catch (error: unknown) {
    throw new Error(`unity CLI failed to start — is ${JSON.stringify(spec.bin)} installed and on PATH?`, { cause: error })
```

</details>

**依据 12 · 源码核查**：[src/unity-cli.ts:127-145](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-cli.ts#L127-L145)

JSON 解码并保留进程退出码。

<details>
<summary>查看原文（19行）</summary>

```text
export async function runUnityJson(ctx: Context, spec: UnityRunSpec): Promise<UnityJsonResult> {
  const result = await runUnity(ctx, spec)
  if (result.exitCode === null) {
    throw new Error(`unity CLI was killed by signal ${result.signal ?? '(unknown)'}; stderr tail:\n${diagnosticTail(result.stderr)}`)
  }
  if (result.stdoutTruncated) {
    throw new Error('unity CLI JSON output exceeded the configured outputMaxBytes cap; raise it in the plugin config')
  }
  let envelope: UnityJson
  try {
    envelope = JSON.parse(result.stdout) as UnityJson
  } catch {
    throw new Error(
      `unity CLI did not return JSON (exit code ${result.exitCode}).\n`
      + `stdout tail:\n${diagnosticTail(result.stdout)}\nstderr tail:\n${diagnosticTail(result.stderr)}`,
    )
  }
  return { exitCode: result.exitCode, envelope }
}
```

</details>

**依据 13 · 源码核查**：[src/tools.ts:297-321](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L297-L321)

原始 CLI 输出与执行路径。

<details>
<summary>查看原文（25行）</summary>

```text
    output: {
      schema: RAW_OUTPUT_SCHEMA,
      render: (_args, value) => {
        const status = value.exitCode === null ? `killed by ${value.signal ?? 'signal'}` : `exit code ${value.exitCode}`
        const parts = [`${status}`]
        if (value.stdout.length > 0) parts.push(`stdout${value.stdoutTruncated ? ' (truncated to tail)' : ''}:\n${value.stdout}`)
        if (value.stderr.length > 0) parts.push(`stderr${value.stderrTruncated ? ' (truncated to tail)' : ''}:\n${value.stderr}`)
        return [{ type: 'text', text: parts.join('\n') }]
      },
    },
    timeoutMs: settings.cliTimeoutMs,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      const argv = args.args.includes('--non-interactive') ? args.args : [...args.args, '--non-interactive']
      return await runUnity(ctx, {
        bin: settings.unityBin,
        args: argv,
        cwd: cwdOf(exec),
        env: settings.env,
        graceMs: settings.graceMs,
        outputMaxBytes: settings.outputMaxBytes,
        signal: exec.signal,
      })
    },
    presentCall: args => ({ card: 'terminal', title: `unity ${args.args.join(' ')}` }),
```

</details>

#### 缺口

- 未运行真实 Editor 或宿主。
  **影响**：实际命令、协议兼容和节时未知。
  **进一步探讨**：在固定 CLI 与 Editor 对照暖/冷状态和命令列表结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 取消、超时、项目范围及代码执行怎样约束？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认 projectPath 只是首选，调用可覆盖；暖进程按 Agent cwd 而非目标 Editor 分组，多个 cwd 仍可能指定同一项目。命令工具直接传名字和 argv，`unity_eval` 把 C# 送往 Editor，原始 CLI 可传任意该 CLI 的子命令。插件不据此提供项目沙箱、只读白名单或每条参数限制，需要实际宿主权限配置。取消排队请求仅出队，取消已发请求则失败并终止暖进程，等待中的同池请求一起拒绝，后续才重开。未见 Editor 内已接受操作的撤销或结果协调，不能盲重试。暖 stdout 在抽出完整行之后只检测残余 buffer.length，完整行本身未做同样字节上限，配置上限不能当作所有暖响应的严格字节约束。响应只检查外层结构并返回上游 envelope。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:145-162](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L145-L162)

调用时可覆盖项目，工作目录与目标路径分开。

<details>
<summary>查看原文（18行）</summary>

```text
  /** The calling agent's session cwd, else the harness process cwd. */
  const cwdOf = (exec: ToolRunContext): string => exec.agent?.session.header.cwd ?? process.cwd()

  /** `--project-path` flags for the effective target project, empty when none is known. */
  const projectFlags = (override: string | undefined): string[] => {
    const path = override ?? settings.projectPath
    return path === undefined ? [] : ['--project-path', path]
  }

  /** One fully-resolved spec for a JSON-envelope invocation. */
  const jsonSpec = (exec: ToolRunContext, args: readonly string[]): UnityRunSpec => ({
    bin: settings.unityBin,
    args: [...args, '--format', 'json', '--non-interactive'],
    cwd: cwdOf(exec),
    env: settings.env,
    graceMs: settings.graceMs,
    outputMaxBytes: settings.outputMaxBytes,
    signal: exec.signal,
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:234-251](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L234-L251)

原始编辑参数未按 Editor 命令模式验证。

<details>
<summary>查看原文（18行）</summary>

```text
    parameters: {
      command: { type: 'string', required: true, description: 'The Editor command name, exactly as unity_list_commands reports it.' },
      args: {
        type: 'array',
        items: { type: 'string' },
        description: 'Raw CLI arguments appended verbatim after the command name (argv elements, never shell-quoted). Omit for a command with no parameters.',
      },
      projectPath: PROJECT_PATH_PARAMETER,
    },
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      return await runJson(exec, ['command', args.command, ...(args.args ?? []), ...projectFlags(args.projectPath)])
    },
```

</details>

**依据 3 · 源码核查**：[src/tools.ts:255-275](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L255-L275)

C# 路径真实交给 Editor。

<details>
<summary>查看原文（21行）</summary>

```text
  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_eval',
    description:
      'Execute C# in a running Unity Editor and return the result. The code runs inside the Editor process '
      + 'with full UnityEngine/UnityEditor API access and no domain reload; end with a `return` statement to '
      + 'produce a value (e.g. `return Application.unityVersion;`). '
      + 'Requires an Editor whose Pipeline package exposes the eval command (verify with unity_list_commands).',
    parameters: {
      code: { type: 'string', required: true, description: 'C# statements to run in the Editor; end with `return <expr>;` to produce output.' },
      projectPath: PROJECT_PATH_PARAMETER,
    },
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      return await runJson(exec, ['command', 'eval', args.code, ...projectFlags(args.projectPath)])
    },
    presentCall: args => ({ card: 'generic', title: 'Run C# in the Unity Editor', kind: 'execute', rawInput: args.code }),
```

</details>

**依据 4 · 源码核查**：[src/tools.ts:307-319](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L307-L319)

任意 CLI argv 走独立子进程。

<details>
<summary>查看原文（13行）</summary>

```text
    timeoutMs: settings.cliTimeoutMs,
    isConcurrencySafe: () => false,
    async execute(args, exec) {
      const argv = args.args.includes('--non-interactive') ? args.args : [...args.args, '--non-interactive']
      return await runUnity(ctx, {
        bin: settings.unityBin,
        args: argv,
        cwd: cwdOf(exec),
        env: settings.env,
        graceMs: settings.graceMs,
        outputMaxBytes: settings.outputMaxBytes,
        signal: exec.signal,
      })
```

</details>

**依据 5 · 源码核查**：[src/unity-shell.ts:188-204](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L188-L204)

完整行先解码，限制只比较剩余缓冲。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Decode complete response lines from a stdout chunk. */
  private onStdout(chunk: string): void {
    if (this.deadError !== undefined) return
    this.buffer += chunk
    let newline = this.buffer.indexOf('\n')
    while (newline !== -1) {
      const line = this.buffer.slice(0, newline)
      this.buffer = this.buffer.slice(newline + 1)
      if (line.trim().length > 0) this.onLine(line)
      if (this.deadError !== undefined) return
      newline = this.buffer.indexOf('\n')
    }
    if (this.buffer.length > this.spec.outputMaxBytes) {
      this.fail(new Error(
        `unity shell response exceeded the configured outputMaxBytes cap (${this.spec.outputMaxBytes}); raise it in the plugin config`,
      ))
    }
```

</details>

**依据 6 · 源码核查**：[src/unity-shell.ts:210-229](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L210-L229)

检查响应配对和 envelope 存在。

<details>
<summary>查看原文（20行）</summary>

```text
    try {
      parsed = JSON.parse(line) as UnityJson
    } catch {
      this.fail(new Error(`unity shell wrote a non-JSON line: ${diagnosticTail(line)}`))
      return
    }
    const inflight = this.inflight
    if (
      typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)
      || inflight === undefined || parsed.id !== inflight.id
      || typeof parsed.exitCode !== 'number' || !('envelope' in parsed)
    ) {
      this.fail(new Error(`unity shell wrote an unexpected response line: ${diagnosticTail(line)}`))
      return
    }
    this.inflight = undefined
    inflight.unlisten()
    inflight.resolve({ exitCode: parsed.exitCode, envelope: parsed.envelope })
    this.pump()
    if (this.idle) this.onIdle?.()
```

</details>

**依据 7 · 源码核查**：[src/unity-shell.ts:232-259](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L232-L259)

排队取消、在途终止和同池拒绝。

<details>
<summary>查看原文（28行）</summary>

```text
  /** Settle one request's abort: dequeue a waiting request, kill the session for an in-flight one. */
  private abort(pending: PendingRequest): void {
    const queued = this.queue.indexOf(pending)
    if (queued !== -1) {
      this.queue.splice(queued, 1)
      pending.unlisten()
      pending.reject(new Error('unity shell request was aborted (tool timeout or caller cancellation)'))
      if (this.idle) this.onIdle?.()
      return
    }
    if (this.inflight === pending) {
      this.fail(new Error('unity shell request was aborted (tool timeout or caller cancellation); the warm session was killed and will respawn on the next call'))
    }
  }

  /** Mark the session dead, reject everything outstanding, and terminate the tree. */
  private fail(error: Error): void {
    if (this.deadError !== undefined) return
    this.deadError = error
    const outstanding = [...(this.inflight === undefined ? [] : [this.inflight]), ...this.queue]
    this.inflight = undefined
    this.queue.length = 0
    for (const pending of outstanding) {
      pending.unlisten()
      pending.reject(error)
    }
    this.handle.terminate()
    this.onIdle?.()
```

</details>

**依据 8 · 源码核查**：[src/unity-shell.ts:299-312](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L299-L312)

后续重建以 cwd 为单位。

<details>
<summary>查看原文（14行）</summary>

```text
  async runJson(cwd: string, argv: readonly string[], signal: AbortSignal): Promise<UnityJsonResult> {
    let entry = this.sessions.get(cwd)
    if (entry === undefined || entry.session.dead) {
      if (entry !== undefined) this.drop(cwd)
      const session = new UnityShellSession(this.ctx, this.spec, cwd)
      entry = { session, idleTimer: undefined }
      session.onIdle = () => { this.onSessionIdle(cwd) }
      this.sessions.set(cwd, entry)
    }
    if (entry.idleTimer !== undefined) {
      clearTimeout(entry.idleTimer)
      entry.idleTimer = undefined
    }
    return await entry.session.request(argv, signal)
```

</details>

#### 缺口

- 实际权限、Editor 对取消的行为与输出边界未测。
  **影响**：取消不能证明没有副作用，跨调用项目和权限可能与期望不同。
  **进一步探讨**：在可恢复项目故障注入延迟，只允许读取路径，另以仿真 CLI 观察暖长行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Unity、许可证、配置与技能缓存由谁管理？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包版本 0.1.7，声明 Node ^22.19.0 或 >=24，Host 需 tools/subprocess，设置卡需 Web 服务，技能需要 skills。作者要求相容 DSH、装好登录并授权的 Unity CLI、Unity 6 和项目 Pipeline；Python 3.9 是 Asset Store 用途。默认技能下载会用 git 浅抓固定 ref，带独立 cache。缓存标记只存 ref，改 repo 却保留同 ref 可能复用旧目录，抓失败可回退到旧标记。配置重挂可终止在途暖调用，退出要保留代码、项目备份和已产生的资源。许可、安装、项目占用、模型与人工验收成本未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/package.json#L2-L4)

固定包与版本。

```text
  "name": "@opdsh/unity-plugin",
  "version": "0.1.7",
  "description": "DeepSeek Harness plugin: control the Unity Editor through the unity CLI — project management, live-editor pipeline commands, and C# eval as agent tools.",
```

**依据 2 · 源码核查**：[package.json:14-24](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/package.json#L14-L24)

Node 和实际宿主出口。

<details>
<summary>查看原文（11行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "type": "module",
  "main": "lib/index.mjs",
  "types": "lib/index.d.mts",
  "exports": {
    ".": {
      "types": "./lib/index.d.mts",
      "import": "./lib/index.mjs"
    },
```

</details>

**依据 3 · 作者声明**：[README.md:19-38](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/README.md#L19-L38)

作者列版本、许可证、Pipeline 和 Python。

<details>
<summary>查看原文（20行）</summary>

````text
## Prerequisites

Before installing, make sure you have:

1. **DeepSeek Harness 0.1.7 or newer.** Older versions are not supported.
2. **The `unity` command-line tool**, installed, signed in, and with an activated license. Check with:

   ```sh
   unity auth status
   unity license status
   ```

3. **Unity 6.0 or newer** installed through the Unity Hub. Live control of the Editor requires Unity 6.
4. **Python 3.9 or newer** (only needed for the Asset Store feature; no extra packages required).

Each project you want the agent to drive needs the `com.unity.pipeline` package. You do not have to add it by hand: the agent can install it for you, or you can run it once yourself:

```sh
unity pipeline install --project-path /path/to/MyGame
```
````

</details>

**依据 4 · 源码核查**：[src/index.ts:49-74](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/index.ts#L49-L74)

可配置超时、输出、暖池与技能。

<details>
<summary>查看原文（26行）</summary>

```text
export const Config: Schema<ConfigInput, Config> = Schema.object({
  unityBin: Schema.string().default('unity').description(
    'The unity executable: a name resolved through PATH, or an absolute path.').volatile(),
  projectPath: Schema.string().description(
    'Default Unity project the live-Editor tools target; a tool call may name another.').volatile(),
  commandTimeoutMs: Schema.number().min(1).max(MAX_TIMER_MS).default(120_000).description(
    'Timeout for live-Editor tools (unity_status, unity_command, unity_eval), in milliseconds.').volatile(),
  cliTimeoutMs: Schema.number().min(1).max(MAX_TIMER_MS).default(600_000).description(
    'Timeout for unity_cli (installs, tests, and builds run long), in milliseconds.').volatile(),
  graceMs: Schema.number().min(0).max(MAX_TIMER_MS).default(5_000).description(
    'Grace between asking a unity process tree to stop and killing it, in milliseconds.').volatile(),
  outputMaxBytes: Schema.number().min(1).default(512_000).description(
    'In-memory cap per collected CLI output stream, in bytes.').volatile(),
  env: Schema.dict(Schema.string()).default({}),
  warmShell: Schema.boolean().default(true).description(
    'Keep a warm unity shell session per project for the live-Editor tools.').volatile(),
  shellIdleMs: Schema.number().min(1).max(MAX_TIMER_MS).default(300_000).description(
    'Idle time after which a warm unity shell session is closed, in milliseconds.').volatile(),
  unitySkillsDownload: Schema.boolean().default(true).description(
    'Download Unity\'s official skill collection and offer it to the agent.').volatile(),
  unitySkillsRepo: Schema.string().default(UNITY_SKILLS_DEFAULT_REPO).description(
    'Git URL of the Unity skill collection; set empty to disable the download.').volatile(),
  unitySkillsRef: Schema.string().default(UNITY_SKILLS_DEFAULT_REF).description(
    'Commit, tag, or branch of the Unity skills to fetch; fetched once per value, changing it re-fetches.').volatile(),
  unitySkillsCacheDir: Schema.string().description(
    'Cache directory for the downloaded collection; defaults to <dshHome>/cache/unity-plugin/unity-skills.').volatile(),
```

</details>

**依据 5 · 源码核查**：[src/skill.ts:53-82](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/skill.ts#L53-L82)

挂内置技能并编排外部缓存。

<details>
<summary>查看原文（30行）</summary>

```text
export function registerUnitySkills(ctx: Context, config: UnitySkillsConfig, watch: ConfigWatch): void {
  ctx.plugin(skillFilesystem, {
    providerName: 'unity-plugin',
    includeDefaultRoots: false,
    bundledSkillDir: BUNDLED_SKILL_DIR,
    watch: false,
  })

  let dispose: (() => void) | undefined
  // Fetches share the cache and its staging path, and an abort stops only the
  // git steps, so each fetch starts after the one it replaces has settled.
  let settled: Promise<void> = Promise.resolve()
  const mount = (): void => {
    dispose?.()
    const upstream = mountUpstreamSkills(ctx, {
      // An empty repo is the switch cordis.patch.yml has always offered.
      repo: config.unitySkillsDownload.get() ? config.unitySkillsRepo.get() : '',
      ref: config.unitySkillsRef.get(),
      cacheDir: config.unitySkillsCacheDir.get(),
      graceMs: config.graceMs.get(),
    }, settled)
    dispose = upstream.dispose
    settled = upstream.settled
  }
  ctx.effect(() => () => {
    dispose?.()
    dispose = undefined
  }, 'unity-plugin: upstream skills')
  mount()
  ctx.effect(() => watch(SKILLS_CONFIG_KEYS, mount), 'unity-plugin: skills live config')
```

</details>

**依据 6 · 源码核查**：[src/unity-skills-fetch.ts:17-21](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-skills-fetch.ts#L17-L21)

固定技能仓库与 ref。

```text
/** Pinned upstream commit fetched by default; known good under dsh's strict frontmatter parser (with {@link fixKnownFrontmatter}). */
export const UNITY_SKILLS_DEFAULT_REF = '87fac23d66a1f44f5e06c2935eccce0b40b9715a'

/** Upstream repository fetched by default. */
export const UNITY_SKILLS_DEFAULT_REPO = 'https://github.com/Unity-Technologies/skills'
```

**依据 7 · 源码核查**：[src/unity-skills-fetch.ts:107-130](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-skills-fetch.ts#L107-L130)

命中与失败回退按 ref 标记。

<details>
<summary>查看原文（24行）</summary>

```text
export async function ensureUnitySkills(ctx: Context, spec: UnitySkillsFetchSpec): Promise<string | undefined> {
  if (spec.repo === '') return undefined
  const cacheDir = unitySkillsCacheDir(spec)
  let cachedRef: string | undefined
  try {
    cachedRef = (await readFile(refMarkerPath(cacheDir), 'utf8')).trim()
  } catch {
    cachedRef = undefined
  }
  if (cachedRef === spec.ref) return cacheDir
  try {
    await fetchInto(ctx, spec, cacheDir)
    return cacheDir
  } catch (error: unknown) {
    if (cachedRef !== undefined) {
      ctx.logger.warn(`unity-plugin: fetching Unity skills ${spec.ref} failed; keeping the cached ${cachedRef}`, error)
      return cacheDir
    }
    ctx.logger.warn(
      'unity-plugin: fetching the Unity skill collection failed and no cache exists; '
      + 'continuing with only the plugin\'s own bundled skills (is git installed and the network reachable?)',
      error,
    )
    return undefined
```

</details>

**依据 8 · 源码核查**：[src/unity-skills-fetch.ts:141-163](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-skills-fetch.ts#L141-L163)

实际浅抓、换目录、写标记。

<details>
<summary>查看原文（23行）</summary>

```text
async function fetchInto(ctx: Context, spec: UnitySkillsFetchSpec, cacheDir: string): Promise<void> {
  await mkdir(join(cacheDir, '..'), { recursive: true })
  const clone = await mkdtemp(join(tmpdir(), 'unity-plugin-skills-'))
  const stage = `${cacheDir}.stage-${process.pid}`
  // One deadline over the whole fetch, composed with the plugin-teardown abort.
  const deadline = AbortSignal.any([spec.signal, AbortSignal.timeout(FETCH_TIMEOUT_MS)])
  try {
    await runGit(ctx, spec, deadline, ['init', '--quiet', clone], clone)
    await runGit(ctx, spec, deadline, ['remote', 'add', 'origin', spec.repo], clone)
    await runGit(ctx, spec, deadline, ['fetch', '--quiet', '--depth', '1', 'origin', spec.ref], clone)
    await runGit(ctx, spec, deadline, ['checkout', '--quiet', '--detach', 'FETCH_HEAD'], clone)
    const skillsDir = join(clone, 'skills')
    const entries = await readdir(skillsDir).catch(() => [])
    if (entries.length === 0) {
      throw new Error(`ref ${spec.ref} of ${spec.repo} has no skills/ directory`)
    }
    await fixKnownFrontmatter(skillsDir)
    await rm(stage, { recursive: true, force: true })
    await cp(skillsDir, stage, { recursive: true })
    await rm(refMarkerPath(cacheDir), { force: true })
    await rm(cacheDir, { recursive: true, force: true })
    await rename(stage, cacheDir)
    await writeFile(refMarkerPath(cacheDir), `${spec.ref}\n`)
```

</details>

**依据 9 · 源码核查**：[src/tools.ts:113-134](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L113-L134)

配置变更先卸载旧注册。

<details>
<summary>查看原文（22行）</summary>

```text
export function registerUnityTools(ctx: Context, config: UnityToolsConfig, watch: ConfigWatch): void {
  let dispose: (() => void) | undefined
  const mount = (): void => {
    dispose?.()
    dispose = mountUnityTools(ctx, {
      unityBin: config.unityBin.get(),
      projectPath: config.projectPath.get(),
      commandTimeoutMs: config.commandTimeoutMs.get(),
      cliTimeoutMs: config.cliTimeoutMs.get(),
      graceMs: config.graceMs.get(),
      outputMaxBytes: config.outputMaxBytes.get(),
      env: config.env,
      warmShell: config.warmShell.get(),
      shellIdleMs: config.shellIdleMs.get(),
    })
  }
  ctx.effect(() => () => {
    dispose?.()
    dispose = undefined
  }, 'unity tools')
  mount()
  ctx.effect(() => watch(TOOL_CONFIG_KEYS, mount), 'unity tools: live config')
```

</details>

#### 缺口

- 没有真实 Unity 许可证、版本或网络缓存测试。
  **影响**：环境兼容与成本需现场验证。
  **进一步探讨**：锁定 CLI/Pipeline 及技能来源，记录首次启动、失败恢复和退回原生的投入。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样在可销毁项目验收观察与修改边界？

**研究主题**：新假设与验证、采用判断

#### 完整回答

使用专门测试项目和低权限宿主，仅开放 status 和 list，先核对原生 CLI 输出、实际项目与 DSH 输出的一致性。分别记录冷/暖首轮、重复调用与未知状态。修改与取消对照放到恢复点明确的单独实验，确认失败后重新读取 Editor 状态再决定是否发送。假设给写入加入显式项目标识、变更回读和未知终态，可减少重发导致的重复变更。若宿主不能限制工具、连接到错误项目或状态未知，则停止调用并从原生 Editor 人工核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools.ts:186-223](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L186-L223)

两个观察工具的定义与运行方式。

<details>
<summary>查看原文（38行）</summary>

```text
  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_status',
    description:
      'Report the Unity Editor instances currently reachable by the unity CLI. '
      + 'success=false with a STATUS_NO_INSTANCES error means no running Editor has the Pipeline package loaded '
      + '(open one with unity_cli ["open", "<project>", "--args", "-automated"], then poll this until state is "ready"). '
      + 'Run this before live-Editor operations and BEFORE editing scene or asset files directly — '
      + 'never hand-edit .unity/.prefab/.asset files while a live Editor is reachable.',
    parameters: {},
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => true,
    async execute(_args, exec) {
      return await runJson(exec, ['status'])
    },
    presentCall: () => ({ card: 'generic', title: 'Check Unity Editor status', kind: 'read' }),
  })))

  disposers.push(ctx.tools.register(defineTool({
    name: 'unity_list_commands',
    description:
      'List every command the connected Unity Editor exposes, with full parameter schemas. '
      + 'The command set is Editor- and project-defined (projects register custom [CliCommand] tools), '
      + 'so discover names here rather than assuming a command exists before calling unity_command.',
    parameters: { projectPath: PROJECT_PATH_PARAMETER },
    output: {
      schema: ENVELOPE_OUTPUT_SCHEMA,
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value.envelope, null, 2) }],
    },
    timeoutMs: settings.commandTimeoutMs,
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      return await runJson(exec, ['command', ...projectFlags(args.projectPath)])
    },
    presentCall: () => ({ card: 'generic', title: 'List Unity Editor commands', kind: 'read' }),
```

</details>

**依据 2 · 源码核查**：[src/tools.ts:145-162](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/tools.ts#L145-L162)

工作目录与显式项目字段可分别记录。

<details>
<summary>查看原文（18行）</summary>

```text
  /** The calling agent's session cwd, else the harness process cwd. */
  const cwdOf = (exec: ToolRunContext): string => exec.agent?.session.header.cwd ?? process.cwd()

  /** `--project-path` flags for the effective target project, empty when none is known. */
  const projectFlags = (override: string | undefined): string[] => {
    const path = override ?? settings.projectPath
    return path === undefined ? [] : ['--project-path', path]
  }

  /** One fully-resolved spec for a JSON-envelope invocation. */
  const jsonSpec = (exec: ToolRunContext, args: readonly string[]): UnityRunSpec => ({
    bin: settings.unityBin,
    args: [...args, '--format', 'json', '--non-interactive'],
    cwd: cwdOf(exec),
    env: settings.env,
    graceMs: settings.graceMs,
    outputMaxBytes: settings.outputMaxBytes,
    signal: exec.signal,
```

</details>

**依据 3 · 源码核查**：[src/unity-shell.ts:232-259](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-shell.ts#L232-L259)

可构造排队与已发的取消对照。

<details>
<summary>查看原文（28行）</summary>

```text
  /** Settle one request's abort: dequeue a waiting request, kill the session for an in-flight one. */
  private abort(pending: PendingRequest): void {
    const queued = this.queue.indexOf(pending)
    if (queued !== -1) {
      this.queue.splice(queued, 1)
      pending.unlisten()
      pending.reject(new Error('unity shell request was aborted (tool timeout or caller cancellation)'))
      if (this.idle) this.onIdle?.()
      return
    }
    if (this.inflight === pending) {
      this.fail(new Error('unity shell request was aborted (tool timeout or caller cancellation); the warm session was killed and will respawn on the next call'))
    }
  }

  /** Mark the session dead, reject everything outstanding, and terminate the tree. */
  private fail(error: Error): void {
    if (this.deadError !== undefined) return
    this.deadError = error
    const outstanding = [...(this.inflight === undefined ? [] : [this.inflight]), ...this.queue]
    this.inflight = undefined
    this.queue.length = 0
    for (const pending of outstanding) {
      pending.unlisten()
      pending.reject(error)
    }
    this.handle.terminate()
    this.onIdle?.()
```

</details>

**依据 4 · 源码核查**：[src/unity-cli.ts:127-145](https://github.com/opdsh/unity-plugin/blob/1cfcc6c33962152c8db22ada853179957d69c43b/src/unity-cli.ts#L127-L145)

进程返回和项目效果需要分别核对。

<details>
<summary>查看原文（19行）</summary>

```text
export async function runUnityJson(ctx: Context, spec: UnityRunSpec): Promise<UnityJsonResult> {
  const result = await runUnity(ctx, spec)
  if (result.exitCode === null) {
    throw new Error(`unity CLI was killed by signal ${result.signal ?? '(unknown)'}; stderr tail:\n${diagnosticTail(result.stderr)}`)
  }
  if (result.stdoutTruncated) {
    throw new Error('unity CLI JSON output exceeded the configured outputMaxBytes cap; raise it in the plugin config')
  }
  let envelope: UnityJson
  try {
    envelope = JSON.parse(result.stdout) as UnityJson
  } catch {
    throw new Error(
      `unity CLI did not return JSON (exit code ${result.exitCode}).\n`
      + `stdout tail:\n${diagnosticTail(result.stdout)}\nstderr tail:\n${diagnosticTail(result.stderr)}`,
    )
  }
  return { exitCode: result.exitCode, envelope }
}
```

</details>

#### 缺口

- 未实际执行 Unity 或对照项目。
  **影响**：无法确认流程收益或操作安全。
  **进一步探讨**：用同一可销毁项目在原生 CLI 与插件核对状态、时延和错误后效果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
