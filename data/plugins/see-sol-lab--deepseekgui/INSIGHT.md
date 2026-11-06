# DeepSeekGUI

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1385e07](https://github.com/See-Sol-Lab/DeepSeekGUI/tree/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd)

<!-- BEGIN META -->
[![GitHub ★ 274](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=274&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/See-Sol-Lab/DeepSeekGUI)
<!-- END META -->

> **功能**：基于 DSH 的本地桌面工作台，组合项目会话、Git、记忆、浏览器及数据管理。

> **亮点**：桌面客户端与发行整合、Home/Profile 的可恢复切换、更新安装和迁移核验是可见增量；Agent、Git 能力和许多 UI 继承 DSH，不以全仓数量认定原创。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：启动配置可恢复不等于任务正确；Full access 的 Git 写入并非一律逐次审批，已加载会话也不实时重读记忆。发布包稳定性与迁移外部竞争未实测。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 桌面工作台怎样实际启动 DSH 并呈现用户任务？](#detail-section-11)
  - [Q02 · 启动失败、切换、更新和搬家如何恢复，哪些成功不能提前宣称？](#detail-section-12)
  - [Q03 · 相对原 DSH 新增什么使用与维护成本，记忆是否实时生效？](#detail-section-13)
  - [Q04 · 何时适合试用，什么新增方向值得小规模验证？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户在本地项目中让 Agent 读改文件并核对改动，同时管理运行环境。见 [Q01](#research-q01)。

原 DSH Web/TUI 加浏览器、终端和 Git 工具；未做与其他桌面 Agent 的效果比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面发行 | 启动本地 DSH 工作台 | 实际 client，非普通插件 |
| Home/Profile 管理 | 选择环境与恢复 | LKG 只证明启动成功 |
| Git 工具 | 读状态与受控写操作 | Full access 非红色危险可免审批 |
| 两层记忆 | 全局/项目上下文 | 加载后缓存，不实时重读 |
| 更新 | 校验下载及安装确认 | Linux 手动替换；发行包未运行 |
| 数据迁移 | 复制后切换、重启核验 | 外部写入竞争未验证 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| Electron / 内嵌 DSH | 桌面与真实 Agent | 必需 | 包含继承上游，不等于独创 |
| 模型账号或 API | 推理和工具决策 | 必需 | 上下文发至所选服务 |
| 项目目录及 Git | 本地任务与核对 | 项目任务所需 | 权限模式控制；Full access 例外 |
| 插件/网络服务 | 可选扩展、更新 | 按需 | 未全审全部第三方 |


| 阶段 | 操作 | 结果与边界 |
|---|---|---|
| 首次 | 校验包、独立 Home、配置模型 | 记录真实环境 |
| 正常 | 选项目、提交已知任务、检查 diff | 自主循环继承 DSH |
| 切换 | pending 后停旧服务、启动并晋升 | 失败单次回退，不证明任务正确 |
| 恢复 | 看退出日志、重启或切回旧 Home | 检查真实副作用 |
| 迁移 | 停服务、复制核验、重启再核验 | 旧副本清理有独立门槛 |

**效果与成本**

| 阶段 | 现金 | 人工 | 条件及未知 |
|---|---|---|---|
| 首次 | 模型资金需求未测 | 下载校验、配置权限 | 平台与版本需核对 |
| 持续 | 模型、工具费用未测 | 升级和检查交付 | 不推算节省 |
| 失败恢复 | 重试费用未测 | 日志、diff、Home 恢复 | 取消或重启不回滚文件 |
| 退出 | 未测 | 卸载与数据分开处理 | 保留副本再决定清理 |


| 结果 | 源码支持 | 未验证 |
|---|---|---|
| 统一入口 | 启动服务与产品 overlay | 真实用户使用收益 |
| 配置恢复 | pending/LKG 和失败记录 | 全平台故障可靠性 |
| 更新/搬家 | 摘要、确认、重启核验 | 发布信任链与外部写竞争 |
| 任务交付 | 复用 Agent/Git 能力 | 正确率、人工时间及总费用 |

> **思考**：启动配置可恢复不等于任务正确；Full access 的 Git 写入并非一律逐次审批，已加载会话也不实时重读记忆。发布包稳定性与迁移外部竞争未实测。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：桌面客户端与发行整合、Home/Profile 的可恢复切换、更新安装和迁移核验是可见增量；Agent、Git 能力和许多 UI 继承 DSH，不以全仓数量认定原创。见 [Q01](#research-q01)、[Q03](#research-q03)。

阶段化就绪、配置晋升、单次回退及重启后清理门槛可借鉴；源码注释中的稳定和无丢失不能替代发行包/并发验证。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

启动配置可恢复不等于任务正确；Full access 的 Git 写入并非一律逐次审批，已加载会话也不实时重读记忆。发布包稳定性与迁移外部竞争未实测。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在项目副本和独立托管 Home 先读文件再小改动，核对实际模型、审批与 diff；迁移保留旧副本，异常回到原 DSH。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码定向核查完成；桌面发行包、真实任务与恢复故障尚未运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、apps/deepseekgui/coding-tools-plugin/src/index.ts、apps/deepseekgui/package.json、apps/deepseekgui/src/dsh-service.ts、apps/deepseekgui/src/harness-controller.ts、apps/deepseekgui/src/main.ts、apps/deepseekgui/src/migration-control.ts、apps/deepseekgui/src/update-runner.ts、apps/deepseekgui/workbench-plugin/src/session-memory.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查桌面主入口、内嵌DSH启动认证、overlay、配置切换/崩溃、更新安装、托管Home迁移、Git审批及记忆注入。未全审万余文件、全部浏览器/账号/插件/终端/程序搬迁与上游改动；未运行目标或发布包。
- 下一步：固定发布包与原 DSH 在相同项目副本做读改任务和启动/切换/迁移故障对照，记录独立结果、恢复、时间与费用；交付核验另做对照，均未执行。

**分析版本**

- **仓库**：[See-Sol-Lab/DeepSeekGUI](https://github.com/See-Sol-Lab/DeepSeekGUI)
- **版本号**：桌面客户端 1.2.1；根 Harness 0.2.1-rc.2（[固定提交 1385e07](https://github.com/See-Sol-Lab/DeepSeekGUI/tree/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证工作区绑定的任务交付核验能否提高错误 diff、漏测和错误目录的检出率；若只复述自评或现有视图同样有效即推翻。见 [Q04](#research-q04)。

固定发布包与原 DSH 在相同项目副本做读改任务和启动/切换/迁移故障对照，记录独立结果、恢复、时间与费用；交付核验另做对照，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4369 | 423398 | — | — | 6138375 |
| .mjs | source | 59 | 5515 | 4501 | 640 | — |
| .mjs | test | 12 | 3125 | 2951 | 74 | — |
| .ts | source | 2698 | 483605 | 338194 | 115339 | — |
| .ts | test | 2259 | 621098 | 542663 | 32337 | — |
| .mjs | example | 32 | 1737 | 1481 | 132 | — |
| .ts | example | 104 | 4914 | 3949 | 542 | — |
| .md | test | 230 | 4764 | — | — | 30671 |
| .js | source | 11 | 1287 | 969 | 267 | — |
| .tsx | source | 376 | 63116 | 49666 | 10489 | — |
| .tsx | test | 316 | 104395 | 91552 | 5306 | — |
| .cts | source | 5 | 304 | 197 | 82 | — |
| .cjs | source | 6 | 209 | 130 | 54 | — |
| .cjs | example | 3 | 69 | 64 | 5 | — |
| .js | example | 26 | 546 | 443 | 82 | — |
| .md | example | 17 | 416 | — | — | 5353 |
| .js | test | 5 | 977 | 851 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/See-Sol-Lab/DeepSeekGUI/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：识别桌面发行与恢复机制的真实增量，避免把继承能力、启动成功和业务效果混同。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面工作台怎样实际启动 DSH 并呈现用户任务？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它是基于 DSH 源码树的桌面客户端与发行包，服务于希望选项目、查看改动并让 Agent 操作本地文件的个人开发者。替代办法是启动原 DSH Web/TUI，再配浏览器、终端和 Git 客户端。不能把整个仓库当一个独立工具插件，或把继承的模型循环算成桌面原创。

Electron 主进程检查固定本机端口占用，再按选中的 Home/Profile 组装真实 dsh 入口及桌面 overlays，以管道启动子进程。打包态由 Electron 的 Node 模式运行发行内 dsh/lib/bin.js，显式注入 DSH_HOME；开发态经 tsx 运行仓库 CLI。读取子进程输出中的一次性 launch token，等待 HTTP 就绪，再交换会话 cookie，加载本机页面并等待官方 UI 和桌面 client settle；只有这些完成才视为启动成功。并不是打开任意已有端口就认领一个服务。

Agent、会话和工具执行继承 DSH。桌面层的可核查增量包括进程管理、Home/Profile 切换、安装和迁移控制、桌面控制桥与产品 overlays。额外 Git 工具使用 ctx.git/ctx.pullRequest，写入按会话目录及沙箱策略检查；普通 workspace-write 请求审批，但 Full access 在没有红色危险标记时跳过审批，不能照模块开头注释承诺所有写操作都必经逐次确认。

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/src/main.ts:932-991](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/main.ts#L932-L991)

实际启动、环境、管道和 token。

<details>
<summary>查看原文（60行）</summary>

```text
function createRuntimeAdapter(packaged: boolean, root: string): HarnessRuntimeAdapter {
  return {
    async spawnProcess(selection) {
      if (await portInUse(DEFAULT_HOST, APP_PORT)) {
        throw new Error(desktopLocaleZh()
          ? `本机端口 ${APP_PORT} 已被其他程序占用（例如已运行的 pnpm dsh web）。请先关闭占用该端口的程序，再重新启动 DeepSeekGUI。`
          : `Local port ${APP_PORT} is already in use by another program (for example a running pnpm dsh web). Close the program occupying the port, then start DeepSeekGUI again.`)
      }
      const launch = resolveDshLaunch({
        packaged,
        root,
        profile: selection.profile,
        dshHome: selection.dshHome,
        // Managed Home 下不把宿主的 DEEPSEEK_API_KEY 透传下去，官方设置里的
        // 密钥输入框才不会被锁成只读（P8-D23）。
        managedHome: selection.managedHome === true,
        elevated: HOST_ELEVATED,
        // 开发者模式：官方上报跟随它（见 dsh-service 的 uploadEnv）。
        developerMode,
        // Compatibility View（B3-P2）：不带 Workbench 产品插件的官方界面。
        compatibility: workbenchViewMode === 'compatibility',
        // P9-4：测试实例的显式端口（生产 = DEFAULT_PORT，不传也一样）。
        port: APP_PORT,
        ...packaged ? {
          resourcesPath: process.resourcesPath,
          packagedCwd: app.getPath('home'),
        } : {},
      })
      // B5-P2：服务输出一律 pipe——dsh 0.1.2 的 launch token 只出现在服务
      // stdout 的 launch URL 行，主进程必须读到才能拼窗口 URL 与交换 API
      // cookie；开发态由 data 处理器把输出转发回宿主控制台（等价旧继承），
      // 打包态写本地诊断日志。windowsHide：打包 GUI（无控制台）下若 Windows
      // 为该子进程分配新控制台，必须隐藏——DSH 进程树里随后 spawn 的
      // sandbox runner/pwsh 会共享这个隐藏控制台，整条链都不闪黑框（P6-J）。
      // 每个新 spawn 都换新的一次性 token：旧 token/cookie 立即失效。
      service.launchToken = null
      harnessSessionCookie = null
      const spawned = spawn(launch.command, launch.args, {
        cwd: launch.cwd,
        env: { ...launch.env, DEEPSEEKGUI_SESSION_DELETE_PUBLIC_KEY: sessionDeletionKeys.publicKey.export({ type: 'spki', format: 'pem' }).toString() },
        stdio: 'pipe',
        windowsHide: true,
      })
      // spawn 失败（如 PATH 无 node）只走 error 事件；once() 在目标发出
      // 'error' 时自动拒绝，两个监听器的互相解绑也由它负责。
      await once(spawned, 'spawn')
      service.child = spawned
      service.bootSettled = false
      service.logPath = join(app.getPath('userData'), 'dsh-service.log')
      const log = createServiceLogWriter(service.logPath)
      service.log = log
      // Credentials are extracted from complete lines before logs or console output.
      readHarnessOutput(spawned.stdout, (token) => {
        if (service.child === spawned && service.launchToken === null) {
          service.launchToken = token
        }
      }, (line) => {
        log.write(line)
        if (!packaged) process.stdout.write(line)
      })
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/src/main.ts:1034-1093](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/main.ts#L1034-L1093)

HTTP、认证、页面和 client settle。

<details>
<summary>查看原文（60行）</summary>

```text
    async waitReady() {
      const child = service.child
      if (child === undefined) throw new Error(desktopLocaleZh() ? 'DSH 子进程不存在，无法等待就绪' : 'The DSH child process does not exist, so readiness cannot be checked')
      if (child.exitCode !== null || child.signalCode !== null) throw new Error('The DSH process exited before readiness')
      // 就绪前子进程退出：立即以明确的 readiness 失败进入 recovery，
      // 而不是等满 60 秒超时。
      await new Promise<void>((resolvePromise, reject) => {
        let settled = false
        const settle = (outcome: () => void): void => {
          if (settled) return
          settled = true
          child.off('exit', onExit)
          outcome()
        }
        const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
          settle(() => {
            reject(new Error(desktopLocaleZh()
              ? `DSH 服务在就绪前退出（code=${String(code)} signal=${String(signal)}）`
              : `The DSH service exited before it became ready (code=${String(code)} signal=${String(signal)})`))
          })
        }
        child.once('exit', onExit)
        void waitForServer(DEFAULT_HOST, APP_PORT, READY_TIMEOUT_MS, desktopLocaleZh()).then(
          () =>{  settle(resolvePromise) },
          (error: unknown) =>{  settle(() => { reject(error instanceof Error ? error : new Error(String(error))) }) },
        )
      })
    },
    async loadPage() {
      const view = compatView
      if (view === undefined) throw new Error(desktopLocaleZh() ? 'Compatibility View 不存在，无法加载页面' : 'The Compatibility View does not exist, so the page cannot be loaded')
      // Install the official cookie before navigation; the launch redirect
      // removes query parameters, including the desktop control bridge.
      const tokenDeadline = Date.now() + 10_000
      while (service.launchToken === null && Date.now() < tokenDeadline) await delay(100)
      if (service.launchToken === null) throw new Error('Harness launch credential was not received')
      const baseUrl = `http://${DEFAULT_HOST}:${APP_PORT}`
      const cookie = await exchangeSessionCookie(baseUrl, service.launchToken, (url, init) => fetch(url, init))
      if (cookie === null) throw new Error('Harness authentication failed')
      const separator = cookie.indexOf('=')
      await view.webContents.session.cookies.set({
        url: baseUrl,
        name: cookie.slice(0, separator),
        value: cookie.slice(separator + 1),
        httpOnly: true,
        sameSite: 'strict',
      })
      harnessSessionCookie = cookie
      const params = new URLSearchParams()
      // D39：控制桥参数只随 DeepSeekGUI 自己加载的页面下发（见 controlBridgeParam）。
      if (controlBridgeParam !== undefined) params.set('deepseekgui-control', controlBridgeParam)
      const query = params.size === 0 ? '' : `?${params.toString()}`
      await view.webContents.loadURL(`${baseUrl}/${query}`)
      // 下一代健康不能只看 HTTP：官方 UI 挂载 + DeepSeekGUI client 插件
      // settle（theme plugin 的 apply 成功标记）都必须成立。第三方坏插件
      // 会让 loader 拒绝整轮 composition 或卡在 boot——这条失败链正是
      // Plugin Mutation Recovery 要兜住的（P6 6.8）。
      await waitForClientSettle(view, workbenchViewMode === 'workbench')
      // boot 全部完成：此后的子进程退出才是运行中的意外崩溃。
      service.bootSettled = true
```

</details>

**依据 3 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:188-250](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/dsh-service.ts#L188-L250)

发行态真实 DSH 入口与 Home。

<details>
<summary>查看原文（63行）</summary>

```text
export function resolveDshCommand(options: {
  /** 打包态（发行目录）还是开发态（源码仓库）。 */
  packaged: boolean
  /** 开发态仓库根目录；打包态忽略。 */
  root?: string
  /** 打包态 Electron 可执行文件路径（`process.execPath`）。 */
  packagedExecutable?: string
  /** 打包态 `process.resourcesPath`，DSH 运行时位于其 `dsh/node_modules` 下。 */
  resourcesPath?: string
  /** 打包态工作区（用户主目录）；开发态忽略。 */
  packagedCwd?: string
  /** 运行用的 DSH_HOME，来自 launcher state 的 home 解析；两种形态都显式注入。 */
  dshHome: string
  /** 追加在 DSH 入口之后的参数。 */
  args: string[]
  /** 开发态 Node 可执行文件；默认取 pnpm 注入的 `npm_node_execpath`，否则用 PATH 中的 `node`。 */
  nodeExecutable?: string
  /** 是否托管 Home：true 时不向 DSH 透传宿主的模型密钥（见 {@link inheritedEnv}）。 */
  managedHome?: boolean
  /** 桌面是否以管理员身份运行（见 {@link safetyEnv}）。 */
  elevated?: boolean
  /** 开发者模式：true 时官方上报与官方默认一致（见 {@link uploadEnv}）。 */
  developerMode?: boolean
}): { command: string; args: string[]; cwd: string; env: NodeJS.ProcessEnv } {
  if (options.packaged) {
    const entry = join(
      options.resourcesPath ?? '',
      'dsh', 'node_modules', '@deepseek-ai', 'dsh', 'lib', 'bin.js',
    )
    return {
      command: options.packagedExecutable ?? process.execPath,
      // --expose-internals: the Cordis loader's HMR helper needs Node's
      // internal modules; the node-addon-require-builtin fallback does not
      // work inside Electron's Node realm.
      args: ['--expose-internals', entry, ...options.args],
      cwd: options.packagedCwd ?? process.cwd(),
      env: {
        ...inheritedEnv(options.managedHome === true, process.env),
        ELECTRON_RUN_AS_NODE: '1',
        // 应用专属数据目录：凭据、设置与会话全部落在 launcher selection
        // 决定的 DSH_HOME，不触碰全局 ~/.dsh。
        DSH_HOME: options.dshHome,
        ...safetyEnv(options.elevated === true, dirname(options.packagedExecutable ?? process.execPath)),
        ...DESKTOP_ENV,
        ...uploadEnv(options.developerMode === true),
        // 内嵌 pnpm 的自我升级提示对用户毫无意义：那份 pnpm 是我们打包进
        // 去的，用户既升不了也不该管它的版本。而它会把「Update available!
        // 11.7.0 → 11.22.0」直接插进插件安装的输出里，让人以为那是插件操作
        // 的一部分（实测污染过 Plugin Manager 的输出区）。
        npm_config_update_notifier: 'false',
        // 官方 `dsh plugin` 在 Windows 上经 shell 调 pnpm（PATH 里的 pnpm
        // 是 .cmd shim，CVE-2024-27980 之后 spawn 拒绝无 shell 执行它）。
        // shell 意味着 cmd.exe，而 cmd.exe 要继承 stdio；我们的 broker 用
        // windowsHide 起进程，没有控制台可继承，Windows 就另开一个——用户
        // 看见一个没人要的终端窗口，它的管道又回不到宿主：没有输出、没有
        // 退出码，插件操作永远等下去，而 pnpm 在那个窗口里已经干完了活。
        // 把内嵌 pnpm 的入口直接交出去，CLI 就能用 node 跑它，不再有 shell。
        DSH_PNPM_ENTRY: join(
          options.resourcesPath ?? '',
          'dsh', 'node_modules', 'pnpm', 'bin', 'pnpm.cjs',
        ),
      },
    }
```

</details>

**依据 4 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:624-653](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/dsh-service.ts#L624-L653)

Profile 与多个产品 overlay。

<details>
<summary>查看原文（30行）</summary>

```text
  return resolveDshCommand({
    packaged: options.packaged,
    ...options.root === undefined ? {} : { root: options.root },
    ...options.packagedExecutable === undefined ? {} : { packagedExecutable: options.packagedExecutable },
    ...options.resourcesPath === undefined ? {} : { resourcesPath: options.resourcesPath },
    ...options.packagedCwd === undefined ? {} : { packagedCwd: options.packagedCwd },
    ...options.nodeExecutable === undefined ? {} : { nodeExecutable: options.nodeExecutable },
    managedHome: options.managedHome === true,
    elevated: options.elevated === true,
    developerMode: options.developerMode === true,
    dshHome: options.dshHome,
    args: [
      '--profile', options.profile,
      // 皮肤 overlay 必须留在 dsh 自己的选项区内，紧跟 --profile。
      // dsh 的用法是 `dsh [options] [command] [args...]`：它把自身选项之后
      // 的一切**原样转交给 profile 的 app**，所以放到 --host/--port 后面
      // 会被当成给 web app 的参数转走，启动时报 unknown option（实机抓获）。
      ...themePatch === undefined ? [] : ['--patch', themePatch],
      // 目录选择器 overlay 与皮肤并列，同样留在 dsh 自己的选项区内。
      // `--patch` 按 argv 顺序叠加，两条 overlay 互不相干：皮肤只改 token，
      // 这条只换 picker 那一行。
      ...pickerPatch === undefined ? [] : ['--patch', pickerPatch],
      // 设置分区 overlay（P8-D39）：只注册 settings.section，别的不碰。
      ...settingsPatch === undefined ? [] : ['--patch', settingsPatch],
      // 内置浏览器 overlay（B3-11）：注册 browser_* 工具族。
      ...browserPatch === undefined ? [] : ['--patch', browserPatch],
      // Workbench overlay（B3-P1）：注册 DeepSeekGUI 品牌与 Workbench 标识。
      ...workbenchPatch === undefined ? [] : ['--patch', workbenchPatch],
      // 技能管理器 overlay（B7-P4）：只注册 settings.section 一个分区。
      ...skillsPatch === undefined ? [] : ['--patch', skillsPatch],
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/coding-tools-plugin/src/index.ts:46-61](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/coding-tools-plugin/src/index.ts#L46-L61)

真实可写仓库根检查。

<details>
<summary>查看原文（16行）</summary>

```text
export async function writableCwd(ctx: Context, exec: ToolExec, explicitCwd: string | undefined, toolName: string): Promise<string> {
  exec.signal.throwIfAborted()
  let policy = ctx.sandboxPolicy?.resolve(exec.agent === undefined ? {} : { session: exec.agent.session })
  if (policy === undefined || policy.mode === 'read-only') {
    throw new Error(`${toolName} refused: this session is read-only`)
  }
  const repo = await ctx.git.repoIdentity(cwdOf(explicitCwd, exec))
  policy = ctx.sandboxPolicy?.resolve(exec.agent === undefined ? {} : { session: exec.agent.session })
  if (policy === undefined || policy.mode === 'read-only') throw new Error(`${toolName} refused: this session is read-only`)
  const root = canonicalPath(repo.root)
  if (policy.mode === 'workspace-write' && !writableRoots(policy).some((grant) => {
    const suffix = relative(grant, root)
    return suffix === '' || (!isAbsolute(suffix) && suffix !== '..' && !suffix.startsWith(`..${sep}`))
  })) throw new Error(`${toolName} refused: repository ${root} is outside the writable workspace`)
  exec.signal.throwIfAborted()
  return root
```

</details>

**依据 6 · 源码核查**：[apps/deepseekgui/coding-tools-plugin/src/index.ts:144-170](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/coding-tools-plugin/src/index.ts#L144-L170)

Full access 与红色危险例外、审批后重验。

<details>
<summary>查看原文（27行）</summary>

```text
export async function requireApproval(
  ctx: Context, exec: ToolExec, toolName: string, reason: string, cwd: string,
  danger: readonly ApprovalDanger[] = [],
): Promise<void> {
  exec.signal.throwIfAborted()
  if (!hasRedDanger(danger) && ctx.sandboxPolicy?.resolve(exec.agent === undefined ? {} : { session: exec.agent.session }).mode === 'danger-full-access') return
  const approval = ctx.approval
  if (approval === undefined || exec.agent === undefined) {
    throw new Error(`${toolName} refused: no approval channel is available (fail closed)`)
  }
  const outcome = await approval.request({
    agent: exec.agent,
    toolName,
    callId: exec.callId,
    reason,
    ...danger.length > 0 ? { danger } : {},
    signal: exec.signal,
  })
  if (outcome !== 'allowed-once') {
    throw new Error(`${toolName} refused: the user did not approve this action`)
  }
  exec.signal.throwIfAborted()
  if (await writableCwd(ctx, exec, cwd, toolName) !== canonicalPath(cwd)) {
    throw new Error(`${toolName} refused: the repository changed while approval was pending`)
  }
}

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 启动失败、切换、更新和搬家如何恢复，哪些成功不能提前宣称？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

运行中子进程退出不会把整个桌面窗口一并杀掉：主进程记录退出事实，通知控制器进入失败，留重启入口。Home/Profile 切换先持久化 pending，再停旧进程，完整启动后才晋升 active 和 lastKnownGood；失败只尝试一次旧配置回退，并保留失败证据。重启发现遗留 pending 会标记中断切换，使用 LKG 或 active，而不是盲目继续未完成的新配置。LKG 证明的是该配置能启动，不证明任务语义正确或数据可恢复。

更新下载核对实际大小和 SHA256，不一致删除半成品。安装前再核对，Windows 向用户展示运行中任务并确认，安装器成功 spawn 后才走退出清理；spawn 失败保留当前应用。Linux 交给用户手动替换文件，不能宣传同等自动安装体验。摘要校验是与清单一致性校验，本次未审完整发布信任链，也没有验证发布二进制就是该提交构建。

托管 Home 迁移先停 Harness，再收集文件、复制校验并切换；清单仍保持 awaiting-restart。重新启动后核验通过并能写回状态，才允许清理旧副本；核验失败保留旧目录供切回。它降低桌面进程自己继续写旧目录的问题，但没有证据证明其他外部进程永远不写共享 Home，因此不能把注释中的“没有任何写入丢失”当普遍并发保证。本次未全审程序整体搬迁、磁盘突然丢失和所有外部写入竞争。

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/src/main.ts:995-1031](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/main.ts#L995-L1031)

意外退出保留桌面并记录失败。

<details>
<summary>查看原文（37行）</summary>

```text
      // 每个新 child spawn 后都挂一次监视：boot 三步未完成前退出由
      // recovery 路径处理（waitReady 的 race / loadURL 失败），完成后
      // 退出才是运行中的意外崩溃；主动停止（stopped）不误报。
      // P2 常驻语义：意外退出不再杀死整个应用——Chrome 与 Tray 保持
      // 存活，controller 经 notifyUnexpectedExit 成为唯一 failed 来源
      // （main 不维护第二份 failed 状态），用户可 Restart Harness。
      spawned.once('exit', (code, signal) => {
        if (service.child !== spawned || service.stopped || !service.bootSettled) return
        const zh = desktopLocaleZh()
        const exit = `code=${String(code)} signal=${String(signal)}`
        // 运行中退出也记一条事件，状态里直接给出文件路径：用户不用自己找，
        // Profile 里的 DS 也读得到（启动失败那条早就有，这里补齐）。
        const eventFile = appendDesktopEvent(selection.dshHome, {
          at: formatStampLocal(new Date().toISOString()),
          title: zh ? 'Harness 运行中意外退出' : 'The harness exited unexpectedly',
          sections: [
            [
              zh ? '发生了什么' : 'What happened',
              zh
                ? `DeepSeekGUI 的内部服务在运行中退出了（${exit}）。${diagnosticsHint()}`
                : `DeepSeekGUI's internal service exited while running (${exit}). ${diagnosticsHint()}`,
            ],
            [
              zh ? '如果用户问起' : 'If the user asks',
              zh
                ? '照上面的事实说明就好。服务的完整输出在诊断日志里；在状态区选「重启 Harness」可以重新启动它。'
                : 'State the facts above. The service\'s full output is in the diagnostics log; choosing "Restart Harness" in the status area starts it again.',
            ],
          ],
        }, zh)
        const record = eventFile === null ? '' : (zh ? `\n完整记录：${eventFile}` : `\nFull record: ${eventFile}`)
        const message = redactSecrets(
          zh
            ? `本地 DSH 服务已退出（${exit}）。${diagnosticsHint()}${record}`
            : `Local DSH service exited (${exit}). ${diagnosticsHint()}${record}`,
        )
        void controller?.notifyUnexpectedExit(message)
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/src/harness-controller.ts:188-205](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/harness-controller.ts#L188-L205)

中断切换的启动规则。

<details>
<summary>查看原文（18行）</summary>

```text
  start(): Promise<void> {
    if (this.shutdownRequested) return Promise.resolve()
    return this.queue(async () => {
      if (this.shutdownRequested) return
      const state = this.options.store.read()
      let boot: HarnessSelection
      if (state.pending !== null) {
        boot = state.lastKnownGood ?? state.active
        this.options.store.write({
          ...state,
          pending: null,
          interruptedSwitch: state.pending,
        })
      } else {
        boot = state.active
      }
      await this.bootActive(boot)
    })
```

</details>

**依据 3 · 源码核查**：[apps/deepseekgui/src/harness-controller.ts:213-276](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/harness-controller.ts#L213-L276)

pending、单次回退和晋升。

<details>
<summary>查看原文（64行）</summary>

```text
  switchTo(selection: HarnessSelection): Promise<void> {
    if (this.shutdownRequested) return Promise.resolve()
    return this.queue(async () => {
      if (this.shutdownRequested) return
      const before = this.options.store.read()
      // 1. pending 原子持久化：active 与 LKG 原样保留。
      this.options.store.write({ ...before, pending: selection })
      // 2. 完整停止当前进程树。
      await this.options.runtime.stopProcess()
      // 3. 以 pending 启动（phase switching）。
      const resolved = resolve(selection, this.options.resolveHome)
      try {
        await this.bootSteps(resolved, 'switching', selection)
      } catch (error) {
        // 关窗打断：pending 保留给下次启动的 interrupted-switch 规则，
        // 不记 failure、不 fallback、不晋升。
        if (error instanceof ShutdownAbort) return
        if (!(error instanceof BootAttemptError)) throw error
        const failure = error.failure
        this.setStatus({ phase: 'failed', failure })
        this.options.store.write({ ...before, pending: null, lastBootFailure: failure })
        this.options.log?.(this.zh()
          ? `[deepseekgui] 切换失败（${failure.stage}）: ${failure.message}`
          : `[deepseekgui] Switch failed (${failure.stage}): ${failure.message}`)
        // 4. 单次 lastKnownGood 回退；为空则停在 failed。
        const fallback = before.lastKnownGood
        if (fallback === null) return
        const fallbackResolved = resolve(fallback, this.options.resolveHome)
        try {
          await this.bootSteps(fallbackResolved, 'recovering', fallback)
          await this.publishRunning({
            ...before,
            active: fallback,
            lastKnownGood: fallback,
            pending: null,
            // 保留本次切换失败的持久化证据：普通应用重启也不清它，
            // 只有下一次完整成功的 switchTo/restart 才清。
            lastBootFailure: failure,
          }, fallbackResolved, true)
          this.options.log?.(this.zh()
            ? '[deepseekgui] 已回退到 lastKnownGood（recovered）'
            : '[deepseekgui] Recovered by returning to lastKnownGood')
        } catch (fallbackError) {
          if (fallbackError instanceof ShutdownAbort) return
          if (!(fallbackError instanceof BootAttemptError)) throw fallbackError
          const fallbackFailure = fallbackError.failure
          this.setStatus({ phase: 'failed', failure: fallbackFailure })
          this.options.store.write({ ...before, pending: null, lastBootFailure: fallbackFailure })
          this.options.log?.(this.zh()
            ? `[deepseekgui] 回退失败（${fallbackFailure.stage}）: ${fallbackFailure.message}`
            : `[deepseekgui] Recovery fallback failed (${fallbackFailure.stage}): ${fallbackFailure.message}`)
        }
        return
      }
      // 5. 全部成功：pending 同时晋升 active 与 LKG，清空 pending 与旧失败
      // 记录；"上次切换未完成"的事实随本次完整成功的切换消解。
      await this.publishRunning({
        ...before,
        active: selection,
        lastKnownGood: selection,
        pending: null,
        lastBootFailure: null,
        interruptedSwitch: null,
      }, resolved, false)
```

</details>

**依据 4 · 源码核查**：[apps/deepseekgui/src/update-runner.ts:179-221](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/update-runner.ts#L179-L221)

下载大小与摘要校验。

<details>
<summary>查看原文（43行）</summary>

```text
export async function runUpdateDownload(
  deps: UpdateRunnerDeps,
  manifest: UpdateManifest,
  asset: UpdateAsset,
  destPath: string,
  signal: AbortSignal,
  onProgress: (bytes: number) => void,
  zh = true,
): Promise<DownloadOutcome> {
  try {
    const { bytes, sha256 } = await deps.downloadAsset(asset, destPath, signal, onProgress, zh)
    signal.throwIfAborted()
    if (bytes !== asset.size) {
      cleanupPartial(destPath)
      return {
        kind: 'failed',
        message: zh
          ? `下载字节数与 manifest 不符（expected ${String(asset.size)}, got ${String(bytes)}）——绝不执行`
          : `The downloaded byte count does not match the manifest (expected ${String(asset.size)}, got ${String(bytes)}); the installer will not run`,
      }
    }
    const verdict = verifyDigest(asset.sha256, sha256)
    if (!verdict.ok) {
      cleanupPartial(destPath)
      return {
        kind: 'failed',
        message: zh
          ? `SHA-256 不匹配（expected ${verdict.expected.slice(0, 12)}…）——绝不执行`
          : `The SHA-256 digest does not match (expected ${verdict.expected.slice(0, 12)}…); the installer will not run`,
      }
    }
    return {
      kind: 'verified',
      path: destPath,
      sha256: asset.sha256,
      version: manifest.latestVersion,
      bytes,
      total: asset.size,
    }
  } catch (error) {
    cleanupPartial(destPath)
    if (signal.aborted) return { kind: 'cancelled' }
    return { kind: 'failed', message: String(error instanceof Error ? error.message : error) }
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/src/main.ts:2803-2867](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/main.ts#L2803-L2867)

重校验、用户确认、安装器spawn及Linux交接。

<details>
<summary>查看原文（65行）</summary>

```text
    const recheck = await updates.recheckInstaller()
    if (!recheck.ok) {
      if (recheck.reason === 'mismatch') {
        // 落盘记录恢复的文件可能在会话间被改动，绝不执行与记录不符的安装包。
        const failed = stringsFor(localeOf())
        void dialog.showMessageBox({
          type: 'error',
          noLink: true,
          buttons: [dictText(failed, 'dialog.ok')],
          message: dictText(failed, 'dialog.install-verify-failed.title'),
          detail: dictText(failed, 'dialog.install-verify-failed.detail'),
        }).catch(() => undefined)
      }
      return
    }
    const file = recheck.file
    const dict = stringsFor(localeOf())
    // Linux 只做与当前 AppImage 发行事实相符的提示交接——绝不调用 Windows
    // 安装器。已校验的文件交给用户手动替换。
    if (process.platform !== 'win32') {
      shell.showItemInFolder(file.path)
      updates.noteMessage(dictText(dict, 'msg.update-linux-manual'))
      broadcast()
      return
    }
    // 运行中的任务必须先让用户看见：安装会停掉 Harness，正在执行的工作会
    // 被中断，绝不在后台强退。
    const runningCount = await queryRunningSessionCount(rpc)
    const choice = await dialog.showMessageBox({
      type: 'info',
      noLink: true,
      buttons: [dictText(dict, 'dialog.install-confirm.button'), dictText(dict, 'dialog.cancel')],
      defaultId: 0,
      cancelId: 1,
      message: dictText(dict, 'dialog.install-confirm.title'),
      detail: installConfirmDetail(runningCount, dict, file.version),
    })
    if (choice.response !== 0) {
      updates.noteInstallCancelled()
      broadcast()
      return
    }
    const confirmed = await updates.recheckInstaller()
    if (!confirmed.ok || confirmed.file !== file || quitting) {
      updates.noteMessage(dictText(dict, 'msg.update-install-state-changed'))
      broadcast()
      return
    }
    // 先 spawn installer（once('spawn') 确认成功）再停止一切——spawn 失败时
    // 当前应用保持可用，不删除当前安装、不伪造成功。
    const outcome = await runUpdateHandoff(updateRunnerDeps, file.path)
    if (outcome === 'spawn-failed') {
      void dialog.showMessageBox({
        type: 'error',
        noLink: true,
        buttons: [dictText(dict, 'dialog.ok')],
        message: dictText(dict, 'dialog.install-spawn-failed.title'),
        detail: dictText(dict, 'dialog.install-spawn-failed.detail'),
      }).catch(() => undefined)
      broadcast()
      return
    }
    // 安装程序已确认启动：走与 Quit 完全相同的 orderly cleanup，只把最后
    // 一步换成 app.exit(0)（不再经 quit 事件链）。
    await proceedQuit(() => { app.exit(0) })
```

</details>

**依据 6 · 源码核查**：[apps/deepseekgui/src/migration-control.ts:174-205](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/migration-control.ts#L174-L205)

停止、复制校验、状态及失败恢复。

<details>
<summary>查看原文（32行）</summary>

```text
    // 1. 停掉会写这些数据的服务，**然后**才收集清单：Harness 活着的时候会话
    // 日志还在追加、投影缓存还在落盘，先算的摘要复制完必然对不上（假失败）；
    // 收集之后新建的文件更是根本不在清单里——不复制，还会随旧副本一起清掉。
    await deps.stopHarness()
    let items: MigrationItem[]
    let targetHome: string | undefined
    try {
      const current = deps.home()
      if (current.homeKind !== homeKind || current.homePath !== sourceHome || current.profile !== profile) {
        throw new Error(deps.text('error.migration-selection-changed'))
      }
      items = collectMigrationItems(sourceHome)
      targetHome = check(totalBytesOf(items))
      copyAndVerifyItems(items, sourceHome, targetHome)
      writeMigrationManifest(targetHome, {
        schemaVersion: 1, completedAt: new Date().toISOString(), sourceHome, targetHome, items,
        verification: { status: 'awaiting-restart', checkedAt: null, failures: [] },
        cleanup: { status: 'pending', remaining: [] },
      })
      deps.markLastKnownGood()
      if (!await deps.switchHome(targetHome, profile)) {
        throw new Error(deps.text('error.migration-switch-failed', { path: targetHome }))
      }
    } catch (error) {
      // Keep a target which has become active; never erase a live Home after a late switch error.
      const failures: unknown[] = [error]
      try {
        if (targetHome !== undefined && deps.home().homePath !== targetHome) removeTargetCopy(targetHome)
      } catch (cleanupError) { failures.push(cleanupError) }
      try { await deps.startHarness() } catch (restartError) { failures.push(restartError) }
      if (failures.length === 1) throw error
      throw new AggregateError(failures, failures.map(value => String(value instanceof Error ? value.message : value)).join('; '))
```

</details>

**依据 7 · 源码核查**：[apps/deepseekgui/src/migration-control.ts:240-300](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/migration-control.ts#L240-L300)

重启核验后才开放清理。

<details>
<summary>查看原文（61行）</summary>

```text
    const homePath = deps.home().homePath
    const { manifest } = readMigrationManifest(homePath)
    if (manifest === null || manifest.verification.status !== 'awaiting-restart') return
    const result = verifyMigratedHome(homePath, manifest.items)
    if (!result.ok) {
      const zh = deps.zh()
      note(homePath, zh ? '迁移后的核对没有通过' : 'The post-migration check failed', [
        [
          zh ? '发生了什么' : 'What happened',
          zh
            ? `重启后逐项核对新位置 ${homePath}，有 ${String(result.failures.length)} 项缺失或读不到：${result.failures.slice(0, 5).join('、')}${result.failures.length > 5 ? '…' : ''}。`
            : `After the restart, ${String(result.failures.length)} item(s) at ${homePath} were missing or unreadable: ${result.failures.slice(0, 5).join(', ')}${result.failures.length > 5 ? '…' : ''}.`,
        ],
        [
          zh ? '现在的状态' : 'Current state',
          zh
            ? `旧副本仍完整保留在 ${manifest.sourceHome}，不会提示删除。用户可以在设置里切回旧位置。`
            : `The old copy is kept intact at ${manifest.sourceHome} and deletion will not be offered. The user can switch back to the old location in Settings.`,
        ],
        [
          zh ? '如果用户问起' : 'If the user asks',
          zh
            ? '不要建议删除旧副本；先确认新位置的磁盘还在、路径可读，再考虑重新迁移。'
            : 'Do not suggest deleting the old copy; first confirm the disk of the new location is present and readable, then consider migrating again.',
        ],
      ])
    }
    try {
      writeMigrationManifest(homePath, manifestAfterVerification(manifest, result))
    } catch (error) {
      // 写不回去就保持 awaiting-restart：下次启动再核对一次。绝不因为写
      // 失败而放行删除入口。
      console.error(`[deepseekgui] 迁移核对结果写回失败: ${String(error instanceof Error ? error.message : error)}`)
      return
    }
    invalidate()
    deps.broadcast()
  }

  const cleanup = (): void => {
    if (migrating) throw new Error(deps.text('error.migration-busy'))
    const homePath = deps.home().homePath
    const { manifest, error } = readMigrationManifest(homePath)
    if (manifest === null) {
      // fail closed：清单缺失/损坏时不提示、不删除。
      if (error !== null) console.error(`[deepseekgui] 迁移清单不可读，已跳过清理: ${error}`)
      return
    }
    // 没经过重启核对就不许删：面板在这个状态下本就不给入口，这里是第二道
    // 闸——命令可以从别处进来，而删除是不可逆的。
    if (manifest.cleanup.status === 'done') return
    if (manifest.verification.status !== 'verified') {
      throw new Error(deps.text('error.migration-not-verified'))
    }
    if (!existsSync(manifest.sourceHome)) {
      invalidate()
      deps.broadcast()
      return
    }
    const outcome = deleteOldCopy(manifest)
    writeMigrationManifest(homePath, manifestAfterCleanup(manifest, outcome))
```

</details>

#### 缺口

- 没有运行跨平台发布包、崩溃和断电迁移实验，也未审完整发布信任链。
  **影响**：源码恢复机制不能证明发行包稳定性、外部并发写入安全或全部数据完整。
  **进一步探讨**：隔离备份 Home 下做启动失败、切换中断、摘要错误与重启迁移故障注入，保留原副本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原 DSH 新增什么使用与维护成本，记忆是否实时生效？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

它组合现有 DSH 的 Agent/Web/工具能力和本地桌面设施，把进入项目、观察执行、配置与恢复放在一个产品里。全仓包含大量上游代码和测试，统计不是原创量或投入工时；本次也没有对上游做完整差分，不能把所有 Git、浏览器或沙箱能力归给此项目。

托管 Home 会过滤宿主 DEEPSEEK_API_KEY、DSH_*、NODE_OPTIONS/NODE_PATH，之后显式注入自身 Home；Existing Home 原样继承，接管旧配置的兼容负担不同。默认 uploadEnv 关闭相关开发者模式上报，开启则恢复对应上报设置；这只描述检查过的环境开关，模型请求本身仍须发送上下文，不能据此称完全离线或无网络外发。账号服务和第三方插件细节未全审。

两层 Markdown 记忆也有具体时效边界：按 session 对象首次装配后缓存，并记录注入内容，后续步骤复用，到重新加载 Session 才重新读取；文件有体积上限和 unreadable/truncated 状态。编辑磁盘文件不会立刻更新已加载会话，更不能证明模型采纳了每条记忆。

首次成本是下载验证、账号/API 凭据、项目权限和数据目录选择；持续有模型和外部工具现金费用，以及桌面包/宿主/plugin 版本维护。失败恢复需核对日志、实际文件修改、旧 Home 与安装包，退出需区分卸载程序和保留的数据。README 说明 Windows 为主要分发、Linux 实验性，产品层与上游许可分开；这些是作者分发声明，不作进一步法律解释。没有真实用户对照、费用和修复工时，不能报告稳定、省钱或单位合格任务收益。

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:97-125](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/dsh-service.ts#L97-L125)

Managed/Existing Home 环境继承不同。

<details>
<summary>查看原文（29行）</summary>

```text
function isHostDshEnv(name: string): boolean {
  const upper = name.toUpperCase()
  return upper === MANAGED_HOME_BLOCKED_ENV
    || upper.startsWith('DSH_')
    || upper === 'NODE_OPTIONS'
    || upper === 'NODE_PATH'
}

/**
 * 构造要透传给 DSH 的环境。
 *
 * Managed Home 是「DeepSeekGUI 自己管的干净目录」，宿主的模型密钥不该漏进去；拦掉
 * 之后官方 UI 检测不到环境凭据，密钥输入框恢复可编辑，用户在界面上就能填、能换
 * ——**不必开命令行**。Existing Home 是接管用户自己的 DSH Home，行为必须和他自己
 * 跑 `dsh web` 一致，因此原样透传。
 *
 * 拦的范围见 {@link isHostDshEnv}：模型密钥 + 宿主的 `DSH_*` 族 + NODE_OPTIONS /
 * NODE_PATH。`EXA_API_KEY` / `PERPLEXITY_API_KEY` 那些不会锁住任何输入框，
 * 拦掉反而会悄悄弄坏用户既有的搜索配置，所以照旧透传。
 * @param managedHome - 本次启动是否托管 Home。
 * @param base - 宿主环境（调用方传 `process.env`）。
 * @returns 透传给子进程的环境副本。
 */
export function inheritedEnv(managedHome: boolean, base: NodeJS.ProcessEnv): NodeJS.ProcessEnv {
  if (!managedHome) return { ...base }
  // 过滤重建而不是 `delete env[KEY]`：动态键的 delete 被 lint 规则挡下。
  return Object.fromEntries(
    Object.entries(base).filter(([name]) => !isHostDshEnv(name)),
  )
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/src/dsh-service.ts:172-176](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/dsh-service.ts#L172-L176)

开发者模式上报环境开关。

```text
export function uploadEnv(developerMode: boolean): Record<string, string> {
  // 关时显式写 '0'：宿主环境里若碰巧有同名变量，不能让它把会话日志悄悄打开。
  return developerMode
    ? { DEEPSEEKGUI_DEVELOPER_MODE: '1' }
    : { DEEPSEEKGUI_DEVELOPER_MODE: '0', DSH_TELEMETRY_DISABLED: '1' }
```

**依据 3 · 源码核查**：[apps/deepseekgui/workbench-plugin/src/session-memory.ts:103-143](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/workbench-plugin/src/session-memory.ts#L103-L143)

记忆读取上限和状态。

<details>
<summary>查看原文（41行）</summary>

```text
export function readProjectMemoryFile(path: string, cap = MEMORY_FILE_CAP): MemoryFileView {
  const whole = readMemoryFile(path, PROJECT_READ_LIMIT)
  if (whole.status === 'absent' || whole.status === 'empty' || whole.status === 'unreadable') return whole
  const begin = whole.text.indexOf(AREA_BEGIN)
  const end = whole.text.indexOf(AREA_END)
  const area = begin >= 0 && end > begin ? whole.text.slice(begin, end + AREA_END.length) : ''
  if (Buffer.byteLength(whole.text, 'utf8') <= cap && whole.status === 'present') {
    return { ...whole, autoArea: area === '' ? 'absent' : 'included' }
  }
  if (area === '') return { path, status: 'truncated', text: headBytes(whole.text, cap), autoArea: 'absent' }
  const human = whole.text.slice(0, begin) + whole.text.slice(end + AREA_END.length)
  const marker = '\n…（以上为节选 / excerpt above）…\n'
  const room = cap - Buffer.byteLength(area, 'utf8') - Buffer.byteLength(marker, 'utf8')
  return { path, status: 'truncated', text: `${headBytes(human, room)}${marker}${area}`, autoArea: 'included' }
}

/** Read one memory file within the cap; never throws. */
export function readMemoryFile(path: string, cap = MEMORY_FILE_CAP): MemoryFileView {
  let text = ''
  let truncated = false
  try {
    const fd = openSync(path, 'r')
    try {
      const buffer = Buffer.alloc(cap + 1)
      let size = 0
      while (size < buffer.length) {
        const read = readSync(fd, buffer, size, buffer.length - size, null)
        if (read === 0) break
        size += read
      }
      truncated = size > cap
      text = new TextDecoder().decode(buffer.subarray(0, Math.min(size, cap)), { stream: truncated })
    } finally { closeSync(fd) }
  } catch (error) {
    return { path, status: (error as NodeJS.ErrnoException).code === 'ENOENT' ? 'absent' : 'unreadable', text: '' }
  }
  if (text.trim() === '') return { path, status: 'empty', text: '' }
  if (truncated) {
    return { path, status: 'truncated', text }
  }
  return { path, status: 'present', text }
```

</details>

**依据 4 · 源码核查**：[apps/deepseekgui/workbench-plugin/src/session-memory.ts:310-345](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/workbench-plugin/src/session-memory.ts#L310-L345)

每会话缓存和注入记录。

<details>
<summary>查看原文（36行）</summary>

```text
export function registerMemoryContext(ctx: Context): void {
  const systemPrompt = (ctx as unknown as { systemPrompt: SystemPromptSeam }).systemPrompt
  const captured = new WeakMap<object, string>()
  const guide: Parameters<SystemPromptSeam['context']>[0] = {
    name: GUIDE_SECTION_NAME,
    order: GUIDE_SECTION_ORDER,
    text: productGuide(),
  }
  const provider: Parameters<SystemPromptSeam['context']>[0] = {
    name: MEMORY_SECTION_NAME,
    order: MEMORY_SECTION_ORDER,
    text: '{{deepseekgui_memory}}',
  }
  ctx.effect(() => {
    const disposeVariable = systemPrompt.variable('deepseekgui_memory', (context) => {
      // A bare assemble (tests/diagnostics) has no agent; and without a home
      // or a session cwd there is nothing to anchor memory to.
      const home = dshHomeOf()
      const session = context.agent?.session
      const cwd = session?.header?.cwd
      if (home === undefined || cwd === undefined || session === undefined) return ''
      let text = captured.get(session)
      if (text === undefined) {
        const capture = captureMemorySection(memoryFilesOf(home, cwd))
        text = capture.text
        captured.set(session, text)
        const id = session.header?.id
        if (id !== undefined) recordMemoryInjection(home, id, capture)
      }
      return text
    })
    const disposeGuide = systemPrompt.context(guide)
    const dispose = systemPrompt.context(provider)
    return () => { dispose(); disposeGuide(); disposeVariable() }
  }, 'deepseekgui: guide and memory contexts')
}
```

</details>

**依据 5 · 源码核查**：[apps/deepseekgui/package.json:1-22](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/package.json#L1-L22)

私有桌面包版本与入口。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "@see-sol-lab/deepseekgui",
  "description": "DeepSeek-native Harness-first desktop host and Workbench foundation",
  "version": "1.2.1",
  "private": true,
  "repository": {
    "type": "git",
    "url": "git+https://github.com/See-Sol-Lab/DeepSeekGUI.git",
    "directory": "apps/deepseekgui"
  },
  "type": "module",
  "main": "lib/main.js",
  "license": "SEE LICENSE IN LICENSE",
  "devDependencies": {
    "@types/node": "^22.20.0",
    "@types/ws": "8.18.1",
    "@xterm/addon-fit": "^0.11.0",
    "@xterm/xterm": "^6.0.0",
    "node-pty": "^1.1.0",
    "ws": "8.21.0"
  }
}
```

</details>

**依据 6 · 源码核查**：[README.md:158-170](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/README.md#L158-L170)

数据、模型上下文及分发操作说明。

<details>
<summary>查看原文（13行）</summary>

```text
| [桌面工具](docs/user/deepseekgui/desktop-tools.zh.md) | 内置浏览器、终端、自动更新、诊断反馈 |
| [数据与故障排查](docs/user/deepseekgui/data-troubleshooting.zh.md) | 数据目录迁移、卸载保留、隐私、故障排查 |

文档里也保留了上游 Harness 的开发教程和插件开发参考。

## 数据与隐私

托管环境中的凭据、设置、会话与全局记忆保存在应用本地数据目录；Windows 默认为 `%APPDATA%\DeepSeekGUI\dsh`。项目记忆保存在所选工作区的 `<文件夹名>.memory.md` 中。模型请求会将当前任务所需的上下文发送到你配置的模型服务；浏览网页、Git / PR、插件管理和更新检查也会访问相应网络服务。

日志对凭据类内容进行脱敏，诊断文件保存在本地。Windows 卸载程序会询问是否删除应用数据；覆盖升级保留数据。分享诊断或提交项目记忆文件前，请检查其中是否包含私密内容。

## 从源码构建

```

</details>

#### 缺口

- 未做完整上游差分、所有账号/插件外发核查及真实费用对照。
  **影响**：不能量化原创、所有隐私边界或净效率收益。
  **进一步探讨**：固定发行包和原 DSH，做相同项目任务并记录模型、调用、审批、修复和全部费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时适合试用，什么新增方向值得小规模验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合已有 DSH 使用需求、希望把本地 Agent 与项目检查放在桌面上的个人用户，在独立托管 Home 和项目副本试用。先做已知文件读取，确认实际模型与审批模式；再完成一个可恢复的小改动，用工作台差异和外部 Git 核对；最后在备份数据上测试重启和配置切换。不要用默认关闭开发者模式推导模型无需出网；不要假定所有 Git 写入模式都逐次审批。发布包校验失败、项目权限不符、迁移核验失败或实际变更不可解释时停用，保留旧 Home 和项目副本，回到原 DSH 与独立 Git 工具。

可验证的方向是“项目交付核验”：把一次任务的预期改动、实际 diff、测试结果和未解决事项形成可阅读交付，并与当前工作区身份绑定。推导来自桌面已把 Agent、Git 和恢复信息放在相邻界面，但启动成功/有改动都不能证明任务完成；新增不是再造 Agent，而是降低用户核对合格结果的遗漏。最小实验比较现有视图与该交付视图对故意混入的错误文件、漏测及错误工作区的检出率、人工时间和全部调用成本。若原视图已同样容易检出，或新增视图只重述 Agent 自评、不能提高独立检出率，则不做此方向。

#### 证据与依据

**依据 1 · 源码核查**：[apps/deepseekgui/coding-tools-plugin/src/index.ts:46-61](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/coding-tools-plugin/src/index.ts#L46-L61)

工作区身份核验基础。

<details>
<summary>查看原文（16行）</summary>

```text
export async function writableCwd(ctx: Context, exec: ToolExec, explicitCwd: string | undefined, toolName: string): Promise<string> {
  exec.signal.throwIfAborted()
  let policy = ctx.sandboxPolicy?.resolve(exec.agent === undefined ? {} : { session: exec.agent.session })
  if (policy === undefined || policy.mode === 'read-only') {
    throw new Error(`${toolName} refused: this session is read-only`)
  }
  const repo = await ctx.git.repoIdentity(cwdOf(explicitCwd, exec))
  policy = ctx.sandboxPolicy?.resolve(exec.agent === undefined ? {} : { session: exec.agent.session })
  if (policy === undefined || policy.mode === 'read-only') throw new Error(`${toolName} refused: this session is read-only`)
  const root = canonicalPath(repo.root)
  if (policy.mode === 'workspace-write' && !writableRoots(policy).some((grant) => {
    const suffix = relative(grant, root)
    return suffix === '' || (!isAbsolute(suffix) && suffix !== '..' && !suffix.startsWith(`..${sep}`))
  })) throw new Error(`${toolName} refused: repository ${root} is outside the writable workspace`)
  exec.signal.throwIfAborted()
  return root
```

</details>

**依据 2 · 源码核查**：[apps/deepseekgui/src/harness-controller.ts:213-276](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/apps/deepseekgui/src/harness-controller.ts#L213-L276)

启动成功只代表运行配置。

<details>
<summary>查看原文（64行）</summary>

```text
  switchTo(selection: HarnessSelection): Promise<void> {
    if (this.shutdownRequested) return Promise.resolve()
    return this.queue(async () => {
      if (this.shutdownRequested) return
      const before = this.options.store.read()
      // 1. pending 原子持久化：active 与 LKG 原样保留。
      this.options.store.write({ ...before, pending: selection })
      // 2. 完整停止当前进程树。
      await this.options.runtime.stopProcess()
      // 3. 以 pending 启动（phase switching）。
      const resolved = resolve(selection, this.options.resolveHome)
      try {
        await this.bootSteps(resolved, 'switching', selection)
      } catch (error) {
        // 关窗打断：pending 保留给下次启动的 interrupted-switch 规则，
        // 不记 failure、不 fallback、不晋升。
        if (error instanceof ShutdownAbort) return
        if (!(error instanceof BootAttemptError)) throw error
        const failure = error.failure
        this.setStatus({ phase: 'failed', failure })
        this.options.store.write({ ...before, pending: null, lastBootFailure: failure })
        this.options.log?.(this.zh()
          ? `[deepseekgui] 切换失败（${failure.stage}）: ${failure.message}`
          : `[deepseekgui] Switch failed (${failure.stage}): ${failure.message}`)
        // 4. 单次 lastKnownGood 回退；为空则停在 failed。
        const fallback = before.lastKnownGood
        if (fallback === null) return
        const fallbackResolved = resolve(fallback, this.options.resolveHome)
        try {
          await this.bootSteps(fallbackResolved, 'recovering', fallback)
          await this.publishRunning({
            ...before,
            active: fallback,
            lastKnownGood: fallback,
            pending: null,
            // 保留本次切换失败的持久化证据：普通应用重启也不清它，
            // 只有下一次完整成功的 switchTo/restart 才清。
            lastBootFailure: failure,
          }, fallbackResolved, true)
          this.options.log?.(this.zh()
            ? '[deepseekgui] 已回退到 lastKnownGood（recovered）'
            : '[deepseekgui] Recovered by returning to lastKnownGood')
        } catch (fallbackError) {
          if (fallbackError instanceof ShutdownAbort) return
          if (!(fallbackError instanceof BootAttemptError)) throw fallbackError
          const fallbackFailure = fallbackError.failure
          this.setStatus({ phase: 'failed', failure: fallbackFailure })
          this.options.store.write({ ...before, pending: null, lastBootFailure: fallbackFailure })
          this.options.log?.(this.zh()
            ? `[deepseekgui] 回退失败（${fallbackFailure.stage}）: ${fallbackFailure.message}`
            : `[deepseekgui] Recovery fallback failed (${fallbackFailure.stage}): ${fallbackFailure.message}`)
        }
        return
      }
      // 5. 全部成功：pending 同时晋升 active 与 LKG，清空 pending 与旧失败
      // 记录；"上次切换未完成"的事实随本次完整成功的切换消解。
      await this.publishRunning({
        ...before,
        active: selection,
        lastKnownGood: selection,
        pending: null,
        lastBootFailure: null,
        interruptedSwitch: null,
      }, resolved, false)
```

</details>

**依据 3 · 源码核查**：[README.md:120-124](https://github.com/See-Sol-Lab/DeepSeekGUI/blob/1385e07f7fe30e28bbdf1e975adfd40c24c06fcd/README.md#L120-L124)

作者描述的改动/Git视图及操作入口。

```text
- **改动视图** — 按将提交、已改动、新文件和冲突分组查看文件，打开单文件差异、复制路径或在文件管理器中定位。
- **Git 视图** — 查看分支、远端同步状态、最近提交，以及已加载会话记录中的提交、推送和 PR 结果。
- **并行工作区** — 集成在 Git 视图上方，查看已注册 worktree 的分支与改动，标出共同修改的路径，方便检查潜在冲突。
- **Git / PR 工具** — 通过会话查询差异、暂存、取消暂存、撤销已跟踪文件的未暂存改动、提交、预览推送、推送和创建 PR；结果以专用卡片展示。
- **本地状态检查** — 视图按需读取工作区状态，无需模型请求；工作区文件路径可点击定位，内置终端可跟随当前会话目录。
```

#### 缺口

- 没有真实用户试用或交付核验对照。
  **影响**：采用收益和新增需求仍未证实。
  **进一步探讨**：先让个人用户在项目副本做相同任务，再测试错误检出及全部成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
