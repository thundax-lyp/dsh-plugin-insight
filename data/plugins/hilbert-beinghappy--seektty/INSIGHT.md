# SeekTTY

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[42a2a7f](https://github.com/Hilbert-beinghappy/seektty/tree/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5)

<!-- BEGIN META -->
[![GitHub ★ 194](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=194&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Hilbert-beinghappy/seektty) [![npm 30d 1,248](https://img.shields.io/static/v1?label=npm+30d&message=1%2C248&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/seektty) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/seektty)
<!-- END META -->

> **功能**：复用DeepSeek Harness原生服务的终端工作区，提供会话、设置及审批交互。

> **亮点**：[Q01](#research-q01)终端surface与启动/生命周期桥复用Host状态，避免另立会话权威；可选Bundle不归其贡献。

> **主要限制**：[Q02](#research-q02)同进程与有界退出不等权限隔离或任务取消，PTY恢复/跨版本契约仍需最低验收。

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
  - [Q01 · 终端workspace的增量属于谁，适合什么任务？](#detail-section-11)
  - [Q02 · launcher到同进程Host和终端退出怎样实际接线？](#detail-section-12)
  - [Q03 · 什么依赖和更新策略能支持有限试用？](#detail-section-13)
  - [Q04 · 如何验证终端表面没有因契约漂移误导操作？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：SeekTTY面向在终端项目目录内使用DSH的开发者，把Session、审批、设置和会话投影放在同一终端表面。基线是官方终端入口或Web界面配合终端切换；成功应是同一Host会话的状态和交互可被正确展示/响应，不是另造一套Agent。根包有deepseek命令和Cordis patch，是以Bundle安装的终端客户端，真实类别取client。

README明确Harness拥有Agent、Session、模型、权限和持久化，SeekTTY贡献是终端surface/启动桥和显示交互；Clarify、Creator、Browser、Computer及语音等属于可选上游/第三方，不能把它们算内置任务能力。patch不挂Web server，而通过同进程连接复用Host。原生能力覆盖和长会话体验主要是作者发布声称，本轮不对全部功能逐一验收，亦未比较实际输入效率。

官方DSH终端或Web入口；模型与持久化来自同一Host，本轮未复现效率对比。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 终端surface | 会话和审批交互 | 原Host提供状态/权限 |
| launcher | profile reconciliation/启动 | 可能改变profile依赖 |
| 清理 | 终端恢复与订阅释放 | 超时不证明任务取消 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Host0.2.0-rc.2/SeekTTY1.3.0 | 本轮配对 | 原生会话与API | 不兼容报错/新版本提示 |
| Node^22.19或>=24/终端 | 需 | 启动与PTY | 不保证其他环境 |
| dsh与pnpm布局 | 安装相关 | profile reconciliation | 失败返回并给恢复提示 |
| 可选Bundle | 按需 | Clarify/语音等 | 不算默认能力 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 复制profile与固定spec | 保留原入口 |
| 配置 | 禁自动更新/按文档布局 | 不改全局pnpm策略 |
| 使用 | launcher→Host→surface | 会话与审批receipt一致 |
| 异常 | 核Host实际任务/终端恢复 | 超时非取消 |
| 退出 | 移除试用Bundle并核副本 | 不删会话库 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 依赖/网络/终端 | 配对和profile核验 | 金额工时未知 |
| 持续 | Host/模型/工具 | 契约升级核查 | 不是零费用 |
| 失败恢复 | 副本/日志 | 审批与任务状态核对 | PTY未复现 |
| 退出 | 保留会话与配置 | 原入口回退/卸载核验 | 卸载未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态复用 | 同进程桥与原Host | 全交互覆盖 |
| 审批 | 相关ID与receipt拒绝 | 真实展示和可用性 |
| 退出 | 恢复/fence/有界等待 | 底层工作是否已停 |
| 效率 | 操作集中结构 | 节时/费用/成功率 |

> **思考**：[Q02](#research-q02)同进程与有界退出不等权限隔离或任务取消，PTY恢复/跨版本契约仍需最低验收。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)终端surface与启动/生命周期桥复用Host状态，避免另立会话权威；可选Bundle不归其贡献。

[Q02](#research-q02)原Host权威、receipt和清理fence明确；Promise.race只界定等待，不能证明底层任务停止。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)同进程与有界退出不等权限隔离或任务取消，PTY恢复/跨版本契约仍需最低验收。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03)复制profile固定Host/spec并禁自动更新，先核审批/恢复/退出，失败退原入口。

README明确Harness拥有Agent、Session、模型、权限和持久化，SeekTTY贡献是终端surface/启动桥和显示交互；Clarify、Creator、Browser、Computer及语音等属于可选上游/第三方，不能把它们算内置任务能力。patch不挂Web server，而通过同进程连接复用Host。原生能力覆盖和长会话体验主要是作者发布声称，本轮不对全部功能逐一验收，亦未比较实际输入效率。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

partial

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/bin.ts、src/client/capabilities.ts、src/client/client-runtime.ts、src/client/surface.ts、src/host/in-process.ts、src/host/index.ts、src/process-guards.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：source定向launcher、Host bridge、in-process carrier、Client Runtime、approval响应与surface退出；未全审可选provider/marketplace/文件和所有渲染功能，不执行目标。
- 下一步：[Q04](#research-q04)单固定组合对照关键交互矩阵；作者发布验证不充作本轮复现。

**分析版本**

- **仓库**：[Hilbert-beinghappy/seektty](https://github.com/Hilbert-beinghappy/seektty)
- **版本号**：1.3.0（[固定提交 42a2a7f](https://github.com/Hilbert-beinghappy/seektty/tree/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)版本化关键交互清单可能约束表面与Host状态漂移，尚未实施和比较。

[Q04](#research-q04)单固定组合对照关键交互矩阵；作者发布验证不充作本轮复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 75 | 8849 | — | — | 156322 |
| .js | source | 23 | 66815 | 60409 | 6524 | — |
| .mjs | source | 33 | 4408 | 4045 | 226 | — |
| .ts | source | 189 | 48870 | 42959 | 3227 | — |
| .ts | test | 207 | 35100 | 32712 | 273 | — |
| .js | test | 39 | 3219 | 3126 | 36 | — |
| .js | example | 7 | 366 | 342 | 20 | — |
| .ts | example | 7 | 188 | 172 | 15 | — |
| .mjs | example | 3 | 107 | 103 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/Hilbert-beinghappy/seektty/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Hilbert-beinghappy/seektty/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Hilbert-beinghappy/seektty/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核终端客户端对Host状态的真实接线及有限采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 终端workspace的增量属于谁，适合什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

SeekTTY面向在终端项目目录内使用DSH的开发者，把Session、审批、设置和会话投影放在同一终端表面。基线是官方终端入口或Web界面配合终端切换；成功应是同一Host会话的状态和交互可被正确展示/响应，不是另造一套Agent。根包有deepseek命令和Cordis patch，是以Bundle安装的终端客户端，真实类别取client。

README明确Harness拥有Agent、Session、模型、权限和持久化，SeekTTY贡献是终端surface/启动桥和显示交互；Clarify、Creator、Browser、Computer及语音等属于可选上游/第三方，不能把它们算内置任务能力。patch不挂Web server，而通过同进程连接复用Host。原生能力覆盖和长会话体验主要是作者发布声称，本轮不对全部功能逐一验收，亦未比较实际输入效率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-45](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/README.md#L39-L45)

作者定位与可选Clarify。

```text
Run `deepseek` from a project directory to use the native Agent, Session, model, permission, Settings, Profile, plugin, and persistence services of [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) in one terminal workspace. SeekTTY is the terminal surface; Harness remains the owner of runtime state.

Models, Providers, Agent Presets, permissions, commands, tools, Settings, Skills, MCP servers, and marketplace sources are discovered from the running Harness. Capabilities added by upstream or third-party Bundles therefore appear without being hard-coded into SeekTTY.

For requirements that still need definition, the optional [Clarify Host plugin](https://github.com/Hilbert-beinghappy/dsh-plugin-clarify) adds a guided `/clarify` workflow. It asks focused questions, updates a reviewable Draft after each answer, and returns the accepted Draft to the composer. Harness-native `/plan` can then turn the submitted requirement into an implementation plan.

## Development checkout
```

**依据 2 · 源码核查**：[package.json:25-50](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/package.json#L25-L50)

真实Node条件、客户端命令与exports。

<details>
<summary>查看原文（26行）</summary>

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "os": [
    "darwin",
    "linux",
    "win32"
  ],
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./startup": "./lib/startup.js",
    "./marketplace-provider": "./lib/marketplace-provider.js",
    "./in-process": "./lib/in-process.js",
    "./attachment-compat": "./lib/attachment-compat.js",
    "./package.json": "./package.json",
    "./settings/appearance": "./lib/settings-appearance.js",
    "./settings/behavior": "./lib/settings-behavior.js",
    "./settings/composer-history": "./lib/settings-composer-history.js",
    "./settings/welcome": "./lib/settings-welcome.js",
    "./settings/marketplace": "./lib/settings-marketplace.js"
  },
  "bin": {
    "deepseek": "./lib/bin.js"
  },
```

</details>

**依据 3 · 源码核查**：[package.json:70-77](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/package.json#L70-L77)

DSH bundle与固定Host配对。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "minimum": "0.2.0-rc.2",
      "tested": "0.2.0-rc.2"
    }
```

**依据 4 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/cordis.patch.yml#L1-L3)

无Web server的终端层。

```text
# DeepSeek Harness TUI profile layer. It adds the Host capabilities shared
# with Web, a network-free Connection carrier, and the terminal startup bridge.
# No Web server, browser loader, or React package is mounted.
```

#### 缺口

- 原生TUI与Web的真实操作效率、平台体验未比较。
  **影响**：不能以界面数量断言更好。
  **进一步探讨**：固定同一Host任务和profile，比较审批、恢复会话、文件操作与退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · launcher到同进程Host和终端退出怎样实际接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

deepseek读取profile manifest，先移除旧包、缺依赖时调用dsh plugin add，失败即返回；随后执行dsh --profile，不是自行生成模型运行时。Host apply等待loader、核startup/sessionController/connection/appExit，创建NativeTerminalApi和RPC/management桥启动surface，注册stop清理，并消费closed的退出或受控重启结果。Client Runtime建立isLoopback连接，读取Host版本，硬不兼容抛错，较新提示后继续，打开目标会话且显式处理binding缺失或openError；失败dispose并解释错误。

in-process fetch按路径/方法注册路由并传原Request，入口先检查abort，未路由404；这避免监听socket，不等限制同进程插件权限。审批响应以sessionId/approvalId回传原wait，receipt拒绝会抛错，授权的最终裁决仍由Host拥有。清理使用一次性stopping，终端同步恢复、取消输出与订阅、dispose Client Runtime，失败使退出code1并报告；withCleanupTimeout只是Promise.race有界等待，不取消底层工作，不能证明服务/远程任务已经停止。终端恢复/晚到输出的fence可定位，但跨平台PTY与长会话真实正确性尚无本轮运行证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/bin.ts:322-357](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/bin.ts#L322-L357)

launcher真实profile安装及dsh启动。

<details>
<summary>查看原文（36行）</summary>

```text
  const { profile, inner } = launcherArgs(args, environment)
  const dsh = environment.DSH_BIN?.trim() || 'dsh'
  const stderr = writeError
  let manifest = measureStartupSync('launcher-manifest', () => profileManifest(profile, environment), environment, stderr)
  const recoverySpec = environment.SEEKTTY_SPEC?.trim()
    || environment.DEEPSEEK_TUI_SPEC?.trim()
    || manifest?.dependencies?.[PACKAGE_NAME]
    || DEFAULT_SPEC
  let compatibilityHintWritten = false
  const finish = (status: number): number => {
    if (status === 0 || compatibilityHintWritten || !launcherUsesPnpmGvsLayout(dsh, environment)) return status
    compatibilityHintWritten = true
    writeError(`${pnpmGvsRecoveryAdvice({
      english: launcherPrefersEnglish(environment),
      profile,
      dshSpec: DSH_INSTALL_SPEC,
      pluginSpec: recoverySpec,
    })}\n`)
    return status
  }
  if (hasDependency(manifest, LEGACY_PACKAGE_NAME)) {
    const status = execute(dsh, dshPluginArgs(profile, ['remove', LEGACY_PACKAGE_NAME]))
    if (status !== 0) return finish(status)
    manifest = measureStartupSync('launcher-manifest', () => profileManifest(profile, environment), environment, stderr)
  }
  if (!hasDependency(manifest, PACKAGE_NAME)) {
    const spec = environment.SEEKTTY_SPEC?.trim() || environment.DEEPSEEK_TUI_SPEC?.trim() || DEFAULT_SPEC
    const status = measureStartupSync(
      'plugin-add',
      () => execute(dsh, dshPluginArgs(profile, ['add', spec])),
      environment,
      stderr,
    )
    if (status !== 0) return finish(status)
  }
  return finish(execute(dsh, ['--profile', profile, ...inner]))
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:51-98](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/host/index.ts#L51-L98)

loader桥到surface和关闭/重启。

<details>
<summary>查看原文（48行）</summary>

```text
async function run(ctx: Context): Promise<void> {
  resetUnknownFiberWarnings()
  await ctx.get('loader')?.await()
  if (!isActive(ctx)) return
  const startup = ctx.get(TUI_STARTUP_SERVICE) as TuiStartupValues | undefined
  const sessionController = ctx.get('sessionController')
  const connection = ctx.get('connection') as InProcessConnectionHandle | undefined
  const exit = ctx.get('appExit')
  if (startup === undefined || sessionController === undefined || connection === undefined || exit === undefined) {
    throw new Error('tui-runner: Harness startup services are incomplete')
  }
  const surface = await startTui({
    ...startup,
    api: new NativeTerminalApi(ctx),
    rpc: connection.clientRpc,
    management: createTuiManagementBridge(ctx, startup.cwd),
  })
  if (!isActive(ctx)) {
    await surface.stop()
    return
  }
  ctx.effect(() => () => surface.stop(), 'tui-runner: terminal and Client Runtime')
  const outcome = await surface.closed
  if (!isActive(ctx)) return
  if (outcome.kind === 'exit') {
    exit(outcome.code)
    return
  }
  const restart = ctx.get('appRestart')
  if (restart === undefined) {
    throw new Error(ui('tui-runner: launcher 未提供受控重启能力', 'tui-runner: launcher did not provide controlled restart'))
  }
  try {
    await restart({
      profile: outcome.request.profile,
      args: [
        '--cwd', outcome.request.cwd,
        ...(outcome.request.resume === undefined ? [] : ['--resume', outcome.request.resume]),
      ],
      handoff: { channel: 'seektty-v1', payload: outcome.request },
    })
  } catch (error) {
    internals.stderr.write(`deepseek: ${ui(
      `重启失败：${error instanceof Error ? error.message : String(error)}`,
      `Restart failed: ${error instanceof Error ? error.message : String(error)}`,
    )}\n`)
    process.exitCode = 1
  }
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:105-114](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/host/index.ts#L105-L114)

真实apply与失败退出。

<details>
<summary>查看原文（10行）</summary>

```text
export function apply(ctx: Context): void {
  // Publish before loader.await(): explicitly installed plugins can inject this
  // service and register effects without depending on private Client modules.
  new TerminalExtensionRegistry(ctx)
  void run(ctx).catch((error: unknown) => {
    if (!isActive(ctx)) return
    internals.stderr.write(`deepseek: ${translateUiText(error instanceof Error ? error.message : String(error))}\n`)
    ctx.get('appExit')?.(1)
  })
}
```

</details>

**依据 4 · 源码核查**：[src/host/in-process.ts:57-82](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/host/in-process.ts#L57-L82)

同进程fetch路由/abort/404。

<details>
<summary>查看原文（26行）</summary>

```text
  createSharedFetchHandler(channel: '/api') {
    if (channel !== '/api') throw new Error('Unsupported shared Fetch channel')
    const routeFor = (method: string, url: URL) => {
      const route = this.fetchRoutes.get(url.pathname)
      return route?.methods.some(candidate => candidate === method) ? route : undefined
    }
    return {
      requestBodyMode: (request: { method: string; url: URL }) => routeFor(request.method, request.url)?.requestBody ?? 'buffered',
      fetch: async (request: Request): Promise<Response> => {
        request.signal.throwIfAborted()
        const route = routeFor(request.method, new URL(request.url))
        return route === undefined ? new Response('Not found', { status: 404 }) : route.fetch(request)
      },
    }
  }

  /** Client caller paired with this service's registry. */
  readonly clientRpc: ClientConnectionRpc = {
    call: (channel, endpoint, payload, signal) =>
      this.call(channel, endpoint, payload, signal),
  }

  /**
   * Provide the Host half without a Web server or listening socket.
   * @param ctx - owning Host Cordis context.
   */
```

</details>

**依据 5 · 源码核查**：[src/client/client-runtime.ts:162-238](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/client/client-runtime.ts#L162-L238)

Host兼容、会话错误与dispose。

<details>
<summary>查看原文（77行）</summary>

```text
export async function startTuiClient(
  options: TuiStartOptions,
): Promise<TuiClient> {
  const ctx = new Context()
  try {
    ctx.provide('connection', createConnectionHandle({ api: options.api, rpc: options.rpc, isLoopback: true }))
    await measureStartup('plugins', async () => {
      await Promise.all([
        ctx.plugin(registryPlugin).await(),
        ctx.plugin(gatewayPlugin).await(),
        ctx.plugin(remotesPlugin).await(),
      ])
      await ctx.plugin(runtimePlugin, { initialSelection: false }).await()
    })
    const connection = (ctx as unknown as { readonly connection: ConnectionHandle }).connection
    const description = await waitForSnapshot(
      connection.hostDescription,
      snapshot => snapshot !== undefined,
      ui('读取 Harness 版本', 'Reading the Harness version'),
    )
    const mismatch = dshCompatibilityError(
      description?.version,
      DSH_COMPATIBILITY,
      launcherPrefersEnglish(process.env),
    )
    if (mismatch !== undefined) throw new Error(mismatch)
    const newerNotice = dshCompatibilityNotice(
      description?.version,
      DSH_COMPATIBILITY,
      launcherPrefersEnglish(process.env),
    )
    if (newerNotice !== undefined) process.stderr.write(`${newerNotice}\n`)
    registerConversationNodes(ctx)
    registerGoalProjection(ctx)
    registerWorkflowRunProjection(ctx)
    registerDeliverablesProjection(ctx)
    registerTrajectoryProjection(ctx)

    const clientCtx = ctx as unknown as TuiClientContext
    const target = await targetSession(clientCtx, options)
    const binding = clientCtx.sessions.binding(target.sessionId)
    if (binding === undefined) {
      throw new Error(ui(
        `会话 ${target.sessionId} 未进入 Harness Runtime`,
        `Session ${target.sessionId} did not enter the Harness Runtime`,
      ))
    }
    const snapshot = await waitForSnapshot(
      binding.session,
      candidate => candidate.openState === 'open' || candidate.openState === 'error',
      ui('打开会话', 'Opening the session'),
    )
    if (snapshot.openState === 'error') {
      throw new Error(ui(
        `打开会话失败：${snapshot.openError?.message ?? ui('未知错误', 'unknown error')}`,
        `Failed to open the session: ${snapshot.openError?.message ?? ui('未知错误', 'unknown error')}`,
      ))
    }
    return {
      ctx: clientCtx,
      session: binding.session,
      sessionId: target.sessionId,
      workspacePath: target.workspacePath,
      capabilities: new HarnessTuiCapabilities(
        clientCtx,
        options.api,
        options.profile ?? 'tui',
        target.workspacePath,
        options.management,
      ),
    }
  } catch (error) {
    await ctx.fiber.dispose()
    if (error instanceof Error) throw new Error(explainFailure(error.message), { cause: error })
    throw error
  }
}
```

</details>

**依据 6 · 源码核查**：[src/client/capabilities.ts:2180-2193](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/client/capabilities.ts#L2180-L2193)

相关审批响应及拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
  /**
   * Answer a Runtime-owned approval wait with the Host protocol's correlated value.
   * @param wait - correlated Runtime approval interaction.
   * @param outcome - Host-supported one-shot allow or rejection.
   */
  async answerApproval(wait: PendingWait<'approval'>, outcome: 'allowed-once' | 'rejected'): Promise<void> {
    const receipt = await wait.respond({
      ok: true,
      value: { sessionId: wait.sessionId, approvalId: wait.payload.approvalId, outcome },
    })
    if (!receipt.accepted) {
      throw new Error(ui(`审批响应被拒绝：${receipt.reason}`, `Approval response was rejected: ${receipt.reason}`))
    }
  }
```

</details>

**依据 7 · 源码核查**：[src/client/surface.ts:1070-1155](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/client/surface.ts#L1070-L1155)

清理门闩/取消fence/恢复与失败。

<details>
<summary>查看原文（86行）</summary>

```text
      urlLifetime.abort()
      const closingEpoch = nativeOutput?.epoch()
      const failures: unknown[] = []
      let drainingNative = closingNative
      // Publish the one-shot latch before restoration or other synchronous
      // callbacks can re-enter stop(). Fatal guards remain until cleanup ends.
      stopping = Promise.resolve().then(async () => {
        if (nativeOutput && closingNative) {
          try {
            const completed = await withCleanupTimeout(async () => {
              const current = (): boolean => drainingNative && nativeOutput.epoch() === closingEpoch
              await nativeOutput.drain()
              if (!current() || (outcome.kind === 'exit' && outcome.code !== 0)) return true
              if (liveBehavior.get().mouseMode !== 'native') return true
              transcript.finishNativeHistory()
              const finalCanvas = new CanvasLineCache(false)
              while (current()) {
                transcript.render(terminal.columns)
                const batch = transcript.takeNativeHistoryBatch()
                if (!batch) {
                  const prepared = await transcript.waitNativePreparation()
                  if (!current()) return true
                  if (prepared) continue
                  break
                }
                const success = await nativeOutput.frame(finalCanvas.render(batch.lines, terminal.columns), [], terminal.columns, terminal.rows, null)
                if (!current() || !success) break
                batch.acknowledge()
                await new Promise<void>(resolve => setImmediate(resolve))
              }
              if (current()) await nativeOutput.drain()
              return true
            })
            if (completed !== true) failures.push(new Error('Native history cleanup deadline exceeded'))
          } catch (error) { failures.push(error) }
        }
        // Cancellation fences late output acknowledgements before disposing
        // preparations wakes the abandoned drain loop.
        drainingNative = false
        nativeOutput?.dispose()
        try {
          restoreSurfaceTerminalSync(terminalSession, process.stdin, chunk => { process.stdout.write(chunk) }, terminal)
        } catch (error) { failures.push(error) }
        if (elapsedTimer !== undefined) {
          clearInterval(elapsedTimer)
          elapsedTimer = undefined
        }
        for (const dispose of [
          () => notices.dispose(), () => contextMenu.close(), () => overlays.dispose(),
          () => mouseController.dispose(), () => welcome.dispose(), () => transcript.dispose(),
          () => agentTree.dispose(), () => setCodeHighlighter(undefined), () => syntax?.dispose(),
        ]) {
          try { dispose() } catch (error) { failures.push(error) }
        }
        try { unsubscribeActive() } catch (error) { failures.push(error) } finally {
          performanceProbe.changeSubscriptions(-1)
        }
        try {
          await withCleanupTimeout(() => terminal.drainInput(250, 30))
        } catch (error) {
          failures.push(error)
        }
        try {
          tui.stop()
        } catch (error) {
          failures.push(error)
        }
        try {
          await withCleanupTimeout(() => client.ctx.fiber.dispose())
        } catch (error) {
          failures.push(error)
        }
        try { reportPerformance() } catch { /* optional diagnostics must not break cleanup */ }
        detachFatalGuards()
        detachFatalGuards = () => undefined
        resolveClosed(failures.length === 0 ? outcome : { kind: 'exit', code: 1 })
        if (failures.length > 0) {
          const error = failures.length === 1 && failures[0] instanceof Error
            ? failures[0]
            : new AggregateError(failures, 'multiple terminal cleanup operations failed')
          try { internals.reportCleanupError(error) } catch { /* diagnostics must not break cleanup */ }
        }
      })
      historyLoadController?.abort()
      detachSuspendGuards()
      detachSuspendGuards = () => undefined
```

</details>

**依据 8 · 源码核查**：[src/process-guards.ts:52-70](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/process-guards.ts#L52-L70)

清理超时非取消。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Bound a teardown step so a hung drain or dispose cannot trap the process.
 */
export async function withCleanupTimeout<T>(
  work: () => Promise<T>,
  ms: number = CLEANUP_TIMEOUT_MS,
): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      work(),
      new Promise<undefined>((resolve) => {
        timer = setTimeout(() => resolve(undefined), ms)
      }),
    ])
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}
```

</details>

#### 缺口

- 真实PTY、同进程插件权限与晚到任务/流的恢复未运行。
  **影响**：不能把终端恢复当任务已停或全兼容。
  **进一步探讨**：丢弃profile测拒批、重启草稿、进程信号、挂起dispose和长输出，核Host任务实际状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么依赖和更新策略能支持有限试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

固定包1.3.0配对官方Host0.2.0-rc.2，Node要求^22.19.0或>=24；package peers绑定大量Host模块。README给出pnpm11逐命令禁Global Virtual Store的安装路径，不能视为任意现行DSH即插即用。裸deepseek还需PATH上的dsh或DSH_BIN，profile安装/旧包移除会改变真实配置，所以试用应在复制的profile而非唯一工作环境。

自动更新在auto模式扫描并应用计划，catch静默不挡启动；它提供可关闭和check模式，但失败不挡启动不是成功更新，也不能证明原配置未发生部分变化。本轮没有全审版本扫描/安装回退/marketplace及可选provider。应先固定Host与SeekTTY spec，禁自动更新，做审批/会话恢复/退出的最低验收；不满足则回原Web或终端入口。模型费用、第三方服务和工具权限仍来自Host配置，MIT与不挂Web不等零成本或沙箱。退出先从试用profile移除Bundle并保留会话数据副本，卸载/迁移未实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:25-50](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/package.json#L25-L50)

Node与入口。

<details>
<summary>查看原文（26行）</summary>

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24"
  },
  "os": [
    "darwin",
    "linux",
    "win32"
  ],
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./startup": "./lib/startup.js",
    "./marketplace-provider": "./lib/marketplace-provider.js",
    "./in-process": "./lib/in-process.js",
    "./attachment-compat": "./lib/attachment-compat.js",
    "./package.json": "./package.json",
    "./settings/appearance": "./lib/settings-appearance.js",
    "./settings/behavior": "./lib/settings-behavior.js",
    "./settings/composer-history": "./lib/settings-composer-history.js",
    "./settings/welcome": "./lib/settings-welcome.js",
    "./settings/marketplace": "./lib/settings-marketplace.js"
  },
  "bin": {
    "deepseek": "./lib/bin.js"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:70-77](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/package.json#L70-L77)

固定Host兼容声明。

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "compatibility": {
      "minimum": "0.2.0-rc.2",
      "tested": "0.2.0-rc.2"
    }
```

**依据 3 · 作者声明**：[README.md:62-113](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/README.md#L62-L113)

固定安装、pnpm布局与launcher条件。

<details>
<summary>查看原文（52行）</summary>

````text
Install the published SeekTTY release on its verified official DeepSeek Harness `0.2.0-rc.2`:

```sh
pnpm add --global --config.enable-global-virtual-store=false @deepseek-ai/dsh@0.2.0-rc.2

dsh plugin --profile tui add --config.enable-global-virtual-store=false seektty@1.3.0

dsh --profile tui
```

These commands install the prebuilt Bundle through native `dsh plugin` reconciliation. The per-command pnpm option avoids the pnpm 11 Global Virtual Store layout that the Cordis loader in the currently tested dsh releases cannot reliably load. SeekTTY never changes global pnpm configuration. Clarify and Auxiliary Runtime are optional, not default dependencies; their historical joint acceptance is listed under [Compatibility](#compatibility-and-verification).

The exact `seektty@1.3.0` npm package is documented in the [release notes](docs/release-v1.3.0.md), [PR audit](docs/release-v1.3.0-pr-audit.md), and [verification record](docs/release-v1.3.0-verification.md).

### Bare `deepseek` launcher

After installing `dsh`, install the same SeekTTY release globally and pin Profile reconciliation to its exact npm version:

```sh
pnpm add --global --config.enable-global-virtual-store=false seektty@1.3.0
export SEEKTTY_SPEC=seektty@1.3.0
deepseek
```

PowerShell uses the same exact npm spec:

```powershell
pnpm add --global --config.enable-global-virtual-store=false 'seektty@1.3.0'
$env:SEEKTTY_SPEC='seektty@1.3.0'
deepseek
```

`deepseek` requires `dsh` on `PATH`, or `DSH_BIN` pointing to its executable. Common launch forms include:

```sh
deepseek "check this project"
deepseek --cwd ../project
deepseek --resume
deepseek --resume <sessionId>
deepseek --profile team-tui
deepseek --version
deepseek --update
```

`deepseek --update` is self-first: it checks SeekTTY before dsh, installs at most one compatible component per run, and never installs an untested gap or future Host. `DSH_BIN`, local installs, and `SEEKTTY_SPEC` overrides are left unchanged. Update failures do not block startup. Set `SEEKTTY_UPDATE=check` for a post-session notice or `SEEKTTY_UPDATE=0` to disable checks.

SeekTTY `1.3.0` supports official dsh `0.2.0-rc.2` and brings more native workflows into the terminal. See the bilingual [release notes](docs/release-v1.3.0.md), [complete PR audit](docs/release-v1.3.0-pr-audit.md), and [verification record](docs/release-v1.3.0-verification.md).

### What's new in 1.3.0

- Access native Session actions, plans and artifacts, MCP resources, Team information, schedules, timed/continued questions, and account/model information from the terminal.
- Browse Host workspace files with text/binary views and available file watching. Plugins can add terminal Session actions and guarded draft input activities with undo.
````

</details>

**依据 4 · 源码核查**：[src/bin.ts:455-477](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/bin.ts#L455-L477)

自动更新模式及吞失败。

<details>
<summary>查看原文（23行）</summary>

```text
export async function maybeAutoUpdate(
  args: readonly string[],
  environment: NodeJS.ProcessEnv = process.env,
  execute: (command: string, args: readonly string[]) => number = run,
  write: (chunk: string) => void = chunk => { process.stderr.write(chunk) },
  scan: typeof scanLatestVersions = scanLatestVersions,
): Promise<void> {
  if (updateMode(environment) !== 'auto') return
  if (isVersionRequest(args) || isUpdateRequest(args)) return
  try {
    const english = launcherPrefersEnglish(environment)
    const { profile } = launcherArgs(args, environment)
    const facts = installedFacts(environment, profile)
    const result = await scan()
    const plan = updatePlan(result, facts)
    if (plan.dshSpec === undefined && plan.seekttySpec === undefined) return
    await applyUpdatePlan(plan, profile, facts, english, environment, execute, write, {
      announcePinnedDsh: false,
      announceCurrentSeektty: false,
    })
  } catch {
    // 静默：自动更新绝不能挡住启动。
  }
```

</details>

#### 缺口

- 发布包与当前终端/Host组合、更新回滚和数据退出未实测。
  **影响**：有限试用必须保留原入口与副本。
  **进一步探讨**：固定版本/关闭更新，在独立profile完成最低任务矩阵后决定是否继续。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证终端表面没有因契约漂移误导操作？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把关键Host交互做成版本化兼容验收清单：审批的相关ID、会话切换后迟到结果、断开/退出后的任务状态、草稿恢复和原始工具参数可审阅性应作为交付门槛。其依据是当前同进程复用Host、receipt拒绝与版本门控；这不是本轮新写的测试或现有全功能认证。

最小验证在固定官方Host/SeekTTY与复制profile中与Web对照，同一会话逐个执行批准/拒绝、切换、信号退出和重启，记录Host状态、终端显示与副作用是否一致。若出现拒绝显示成功、旧会话结果落新目标、退出仍误报任务已取消或草稿丢失，就否定该版本可替代主入口的假设，退回原Host界面；未测时间和费用不计创新收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/client-runtime.ts:177-193](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/client/client-runtime.ts#L177-L193)

版本门控与提示。

<details>
<summary>查看原文（17行）</summary>

```text
    const description = await waitForSnapshot(
      connection.hostDescription,
      snapshot => snapshot !== undefined,
      ui('读取 Harness 版本', 'Reading the Harness version'),
    )
    const mismatch = dshCompatibilityError(
      description?.version,
      DSH_COMPATIBILITY,
      launcherPrefersEnglish(process.env),
    )
    if (mismatch !== undefined) throw new Error(mismatch)
    const newerNotice = dshCompatibilityNotice(
      description?.version,
      DSH_COMPATIBILITY,
      launcherPrefersEnglish(process.env),
    )
    if (newerNotice !== undefined) process.stderr.write(`${newerNotice}\n`)
```

</details>

**依据 2 · 源码核查**：[src/client/capabilities.ts:2180-2193](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/client/capabilities.ts#L2180-L2193)

相关交互receipt。

<details>
<summary>查看原文（14行）</summary>

```text
  /**
   * Answer a Runtime-owned approval wait with the Host protocol's correlated value.
   * @param wait - correlated Runtime approval interaction.
   * @param outcome - Host-supported one-shot allow or rejection.
   */
  async answerApproval(wait: PendingWait<'approval'>, outcome: 'allowed-once' | 'rejected'): Promise<void> {
    const receipt = await wait.respond({
      ok: true,
      value: { sessionId: wait.sessionId, approvalId: wait.payload.approvalId, outcome },
    })
    if (!receipt.accepted) {
      throw new Error(ui(`审批响应被拒绝：${receipt.reason}`, `Approval response was rejected: ${receipt.reason}`))
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/process-guards.ts:52-70](https://github.com/Hilbert-beinghappy/seektty/blob/42a2a7fa2a01b5a10a2e2ce368c151c8e0fdafc5/src/process-guards.ts#L52-L70)

超时不保证工作终止。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Bound a teardown step so a hung drain or dispose cannot trap the process.
 */
export async function withCleanupTimeout<T>(
  work: () => Promise<T>,
  ms: number = CLEANUP_TIMEOUT_MS,
): Promise<T | undefined> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      work(),
      new Promise<undefined>((resolve) => {
        timer = setTimeout(() => resolve(undefined), ms)
      }),
    ])
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
}
```

</details>

#### 缺口

- 兼容清单的跨Host验收与实际收益未完成。
  **影响**：假设不算已有能力或创新。
  **进一步探讨**：先在单一固定组合做可证伪矩阵，出现状态不一致即退回原入口。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
