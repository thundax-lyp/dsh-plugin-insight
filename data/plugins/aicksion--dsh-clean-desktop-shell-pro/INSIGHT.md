# dsh-clean-desktop-shell-pro

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[03fdf5d](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/tree/03fdf5d8b0959c3738cdb3d887baa6d017443fe6)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Aicksion/dsh-clean-desktop-shell-pro)
<!-- END META -->

> **实现功能**：将 DSH web profile 包装为 Electron 桌面壳，并增加后端自动启动、托盘退出选择与运行时准备。

> **核心亮点**：相对原版增加自动后端生命周期、无浏览器启动和退出选择，源码路径可核。详见[Q01](#research-q01)。

> **风险与缺陷**：远程配置的本地隔离宣称与 earlyBackend 无条件 start 不一致；运行时下载校验为尽力而为。详见[Q03](#research-q03)和[Q04](#research-q04)。

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
  - [Q01 · 增强版桌面壳相对原版增加哪些实际能力？](#detail-section-11)
  - [Q02 · 窗口与后端生命周期怎样协调？](#detail-section-12)
  - [Q03 · 配置远程目标时是否真的不触碰本地后端？](#detail-section-13)
  - [Q04 · 运行时下载的完整性和清理机制有什么边界？](#detail-section-14)
  - [Q05 · 怎样分阶段验收再替换现有桌面壳？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：桌面用户管理本地 DSH web 服务与窗口；替换原壳前需避免双实例。详见[Q01](#research-q01)。

原版桌面壳需要手动启动后端；增强版减少步骤，但目标实际时间和稳定性未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 自动启动 | 少手工步骤 | 远程模式仍可能本地启动 |
| 认证 URL | 避免本地401 | 依赖宿主服务 |
| runtime 准备 | 桌面壳可启动 | 校验文件缺失时跳过 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH web/connection | 必需 | 后端/BrowserAuth | 无本地窗口 |
| Electron runtime | 必需 | 原生桌面窗口 | 下载/启动失败 |
| 网络或本地 dist | 首次必需 | runtime 准备 | 无窗口 |
| 平台快捷方式/托盘 | 可选 | 桌面操作 | 功能不全 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 准备 | 卸旧壳、隔离 profile | 无双实例 |
| 启动 | 检 runtime/URL/后端 | 窗口可用 |
| 退出 | 测三选 | 服务符合选择 |
| 扩用 | 远程/升级/离线测试 | 无误启/可恢复 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 卸旧壳/安装/准备 Electron runtime | 下载与磁盘可能达数百 MB；网络/电费/包价未见，金额未知 | 配 profile、快捷方式、核认证 URL 和校验，工时未知 | 下载/SHASUMS 失败需隔离包并重试/回滚 |
| 持续 | 桌面窗口、托盘与本地 dsh web 生命周期 | Electron+后端 CPU/内存/端口；持续现金未知 | 检端口/多实例/远程误启，工时未知 | 实际冷启动节省与资源增量未知 |
| 失败恢复 | 处理误启、后端退出、运行时损坏或升级失败 | 重下载/旧版本并存占网络磁盘，现金未知 | 查日志、校验包、停错进程、重装旧版，工时未知 | 自动清理旧 runtime 可能增加回滚难度 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 自动启动 | earlyBackend + --no-open | 冷启动提速 |
| 退出选择 | 三选对话框 | 全平台一致 |
| 远程模式 | bootstrap 跳过 | 零本地后端 |

> **思考**：远程配置的本地隔离宣称与 earlyBackend 无条件 start 不一致；运行时下载校验为尽力而为。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对原版增加自动后端生命周期、无浏览器启动和退出选择，源码路径可核。详见[Q01](#research-q01)。

相对原版增加自动后端生命周期、无浏览器启动和退出选择，源码路径可核。详见[Q01](#research-q01)。

认证 URL 传递与生命周期 cause 区分有借鉴价值；远程目标早启及完整性降级需要修正。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

远程配置的本地隔离宣称与 earlyBackend 无条件 start 不一致；运行时下载校验为尽力而为。详见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离桌面 profile 分别验本地/远程、离线下载、托盘退出与升级后再替换原版。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持作者主张的主要流程；远程目标仍可能先启本地后端，SHASUMS 不可得时跳过校验；目标平台未测。

- 已检查：作者 README、包清单、源码路径 README.md、src/host/index.js、src/host/runtime.js、electron/main.js、electron/service.js、electron/update.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、src/host/index.js、src/host/runtime.js、electron/main.js、electron/service.js、package.json；未执行桌面壳/下载。旧 META 仅复用。
- 下一步：目标 Windows/macOS 分别测本地/远程目标、首启下载校验失败、后端已有实例、退出与升级回滚。

**分析版本**

- **仓库**：[Aicksion/dsh-clean-desktop-shell-pro](https://github.com/Aicksion/dsh-clean-desktop-shell-pro)
- **版本号**：0.1.0（[固定提交 03fdf5d](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/tree/03fdf5d8b0959c3738cdb3d887baa6d017443fe6)）
- **版本日期**：2026-09-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是远程目标判别先于 start、强制完整性校验或显式放行、保留旧运行时回滚。详见[Q05](#research-q05)。

目标 Windows/macOS 分别测本地/远程目标、首启下载校验失败、后端已有实例、退出与升级回滚。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 101 | — | — | 789 |
| .js | source | 23 | 4350 | 2825 | 1241 | — |
| .mjs | source | 5 | 378 | 278 | 70 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**增强桌面壳的后端生命周期、远程目标隔离和运行时下载是否符合其交付主张？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 增强版桌面壳相对原版增加哪些实际能力？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

作者明确这是 dsh-clean-desktop-shell fork，主张自动启动本地 dsh web、--no-open 避免浏览器、退出时询问关闭后端，并与 Electron 并行启动。源码 Electron main 的 earlyBackend 在模块初始化就 start，托盘退出有三选项；host half 负责准备 Electron runtime、在 connection 服务准备后 mint 浏览器认证 URL 并 spawn 窗口。适合希望桌面托盘管理本地 web profile 的用户，收益如冷启动提速尚未实测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-12](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/README.md#L5-L12)

作者增量主张

```text
`dsh-clean-desktop-shell` 的增强版（fork）：在原有「把 web profile 包装成原生桌面窗口」的基础上，补齐了桌面应用应有的后端生命周期管理。

## 相比原版的增强

1. **启动自动启动后端** — 双击窗口后无需再手动点「启动后端」，本地 `dsh web` 后端会自动拉起。
2. **不打开浏览器** — 后端以 `--no-open` 启动，只弹出原生窗口，不再弹出浏览器网页。
3. **退出时询问是否关闭后端** — 托盘「退出」会弹出「关闭后端并退出 / 仅退出 / 取消」三选项。
4. **后端与窗口并行启动** — 后端在 Electron 初始化阶段就提前启动，冷启动更快。
```

**依据 2 · 源码核查**：[electron/main.js:64-69](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L64-L69)

提前启动后端

```text
  // Kick off the local backend as early as possible — in parallel with
  // Electron's own startup and window creation — so the perceived wait is
  // max(electron, backend) instead of electron + backend. start() locates dsh
  // via DSH_BACKEND_DIR / npm global bin / PATH (none of which need app to be
  // ready), and its internal detect() reuses a backend already on the port.
  const earlyBackend = start().catch(() => {})
```

**依据 3 · 源码核查**：[electron/main.js:183-205](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L183-L205)

退出选择

<details>
<summary>查看原文（23行）</summary>

```text
      onQuit: async () => {
        const st = getStatus().status
        if (st === 'running' || st === 'starting') {
          const choice = dialog.showMessageBoxSync({
            type: 'question',
            title: '退出 DeepSeek Harness',
            message: '是否同时关闭后端？',
            detail: '关闭后端会停止本机 dsh web 服务；下次启动会自动重新启动。',
            buttons: ['关闭后端并退出', '仅退出', '取消'],
            defaultId: 0,
            cancelId: 2,
          })
          if (choice === 2) return
          if (choice === 0) {
            try {
              await stop()
            } catch {
              // best-effort
            }
          }
        }
        app.isQuitting = true
        app.quit()
```

</details>

**依据 4 · 源码核查**：[src/host/index.js:54-115](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/index.js#L54-L115)

runtime 与认证 URL 启动

<details>
<summary>查看原文（62行）</summary>

```text
export function apply(ctx) {
  ctx.logger.info('[clean-desktop-shell] mounted (host half)')
  if (!AUTO_LAUNCH) return

  // Runtime preparation is independent of authentication — start it now, but
  // defer the Electron spawn until the launch URL is minted below.
  let runtimeExe = null
  // Kick the (tiny) rcedit fetch off alongside the (large) Electron runtime so
  // the two never serialise; patchExeIcon reuses this same memoised promise.
  void ensureRcedit(ctx)
  const runtimeReady = ensureRuntime(ctx)
    .then(async (exe) => {
      runtimeExe = exe
      await withDeadline(ctx, patchExeIcon(ctx, exe), ICON_PATCH_DEADLINE_MS)
    })
    .catch((err) => {
      reportLaunchFailure(ctx, err)
    })

  // DSH 0.1.2 BrowserAuth: the shell must not start on bare "/" (401). It
  // needs this process's launch URL (?token=…), which the Connection service
  // alone can mint. The service is only reachable from a deferred inject
  // scope — reading ctx.connection in apply() throws "cannot get property
  // without inject" — and the URL is a readiness signal: mint it only after
  // the Loader tree settles, because the port answers 4xx before settlement.
  // Mirror @deepseek-ai/dsh-web-app's announce pattern.
  ctx.inject(['connection'], (connectionCtx) => {
    const launch = () => {
      if (launched) return
      // Only injected services are directly reachable in this scope; the
      // webServer sibling is read through get() (see web-app: it may declare
      // webServer in its row inject, this host does not).
      const webServer = connectionCtx.get('webServer')
      if (!webServer) return
      try {
        const webUrl = `http://127.0.0.1:${String(webServer.port)}`
        // dsh 0.1.2+ mints this process's launch URL through BrowserAuth.
        // Older versions have no BrowserAuth at all — they serve the web root
        // unauthenticated — so a missing mint must NOT stop the launch: the
        // shell just starts with no bootstrap URL, which is exactly the
        // pre-0.1.2 behaviour.
        const mint = connectionCtx.connection.authenticatedUrl
        const launchUrl = typeof mint === 'function' ? mint.call(connectionCtx.connection, webUrl) : null
        void runtimeReady.then(() => {
          if (runtimeExe) launchShell(runtimeExe, connectionCtx, launchUrl)
        })
      } catch (err) {
        reportLaunchFailure(connectionCtx, err)
      }
    }
    // This row's own activation can precede a sibling failure. The tree owns
    // readiness: await the Loader, then re-check that the services still
    // exist — an early shutdown must not spawn a shell for a dead server.
    const settled = connectionCtx.get('loader')?.await()
    if (settled === undefined) launch()
    else {
      void settled.then(() => {
        if (connectionCtx.get('webServer') !== undefined
          && connectionCtx.get('connection') !== undefined) launch()
      }, () => {})
    }
  })
```

</details>

#### 缺口

- 原版功能/目标冷启动耗时未独立对照
  **影响：**不能将作者速度主张当实测收益
  **进一步探讨：**同机同配置原版/增强版冷启动及退出对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 窗口与后端生命周期怎样协调？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

host half 先 ensureRuntime/图标，再等 Loader/connection 和 webServer，使用 authenticatedUrl mint 一次性启动 URL；Electron Shell 以 DSH_WEB_LAUNCH_URL 传递 bootstrap，仅对本地默认目标使用。Electron service 区分 probe 观察状态与 child exit/stop 确认生命周期，start 复用现有端口或 spawn dsh web --no-open，读取 ready URL，输出尾保留64KiB。托盘退出若后端运行可选择关闭、仅退出或取消。机制多层异步，真实跨版本/平台可靠性未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.js:58-115](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/index.js#L58-L115)

runtime/Loader/认证 URL

<details>
<summary>查看原文（58行）</summary>

```text
  // Runtime preparation is independent of authentication — start it now, but
  // defer the Electron spawn until the launch URL is minted below.
  let runtimeExe = null
  // Kick the (tiny) rcedit fetch off alongside the (large) Electron runtime so
  // the two never serialise; patchExeIcon reuses this same memoised promise.
  void ensureRcedit(ctx)
  const runtimeReady = ensureRuntime(ctx)
    .then(async (exe) => {
      runtimeExe = exe
      await withDeadline(ctx, patchExeIcon(ctx, exe), ICON_PATCH_DEADLINE_MS)
    })
    .catch((err) => {
      reportLaunchFailure(ctx, err)
    })

  // DSH 0.1.2 BrowserAuth: the shell must not start on bare "/" (401). It
  // needs this process's launch URL (?token=…), which the Connection service
  // alone can mint. The service is only reachable from a deferred inject
  // scope — reading ctx.connection in apply() throws "cannot get property
  // without inject" — and the URL is a readiness signal: mint it only after
  // the Loader tree settles, because the port answers 4xx before settlement.
  // Mirror @deepseek-ai/dsh-web-app's announce pattern.
  ctx.inject(['connection'], (connectionCtx) => {
    const launch = () => {
      if (launched) return
      // Only injected services are directly reachable in this scope; the
      // webServer sibling is read through get() (see web-app: it may declare
      // webServer in its row inject, this host does not).
      const webServer = connectionCtx.get('webServer')
      if (!webServer) return
      try {
        const webUrl = `http://127.0.0.1:${String(webServer.port)}`
        // dsh 0.1.2+ mints this process's launch URL through BrowserAuth.
        // Older versions have no BrowserAuth at all — they serve the web root
        // unauthenticated — so a missing mint must NOT stop the launch: the
        // shell just starts with no bootstrap URL, which is exactly the
        // pre-0.1.2 behaviour.
        const mint = connectionCtx.connection.authenticatedUrl
        const launchUrl = typeof mint === 'function' ? mint.call(connectionCtx.connection, webUrl) : null
        void runtimeReady.then(() => {
          if (runtimeExe) launchShell(runtimeExe, connectionCtx, launchUrl)
        })
      } catch (err) {
        reportLaunchFailure(connectionCtx, err)
      }
    }
    // This row's own activation can precede a sibling failure. The tree owns
    // readiness: await the Loader, then re-check that the services still
    // exist — an early shutdown must not spawn a shell for a dead server.
    const settled = connectionCtx.get('loader')?.await()
    if (settled === undefined) launch()
    else {
      void settled.then(() => {
        if (connectionCtx.get('webServer') !== undefined
          && connectionCtx.get('connection') !== undefined) launch()
      }, () => {})
    }
  })
```

</details>

**依据 2 · 源码核查**：[src/host/index.js:157-175](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/index.js#L157-L175)

Electron spawn

<details>
<summary>查看原文（19行）</summary>

```text
function launchShell(exe, ctx, launchUrl) {
  if (launched) return
  const env = { ...process.env, ELECTRON_RUN_AS_NODE: undefined }
  if (launchUrl) env.DSH_WEB_LAUNCH_URL = launchUrl
  const child = spawn(exe, [MAIN_JS], {
    cwd: PKG_ROOT,
    env,
    stdio: 'ignore',
    windowsHide: false,
  })
  launched = true
  child.on('error', (err) => {
    launched = false
    ctx.logger.warn(`[clean-desktop-shell] shell spawn error: ${err.message}`)
  })
  child.on('exit', (code) => {
    launched = false
    ctx.logger.info(`[clean-desktop-shell] shell exited (${code})`)
  })
```

</details>

**依据 3 · 源码核查**：[electron/service.js:9-20](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/service.js#L9-L20)

生命周期语义

<details>
<summary>查看原文（12行）</summary>

```text
 * Lifecycle vs responsiveness: every status carries a `cause` so consumers
 * can tell a CONFIRMED lifecycle event from an OBSERVED state:
 *  - cause 'exit'  — the managed child process really exited (or died while
 *    starting);
 *  - cause 'stop'  — an explicit tray stop terminated the backend;
 *  - cause 'probe' — detect() found nothing answering on the port (an
 *    observation; the backend may merely be slow or external).
 * Only 'exit'/'stop' mean the backend that owns a loaded page is gone; a
 * 'probe'-derived 'stopped' must never be treated as a process exit.
 *
 * Shell/core decoupling: when a remote target URL is configured, no local
 * backend is ever touched — this module only manages the local dsh CLI.
```

</details>

**依据 4 · 源码核查**：[electron/service.js:137-165](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/service.js#L137-L165)

probe 状态

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * Detect a reachable local dsh web service.
 * Returns the URL when something already listens on the port,
 * or null when the backend is down.
 *
 * Never demotes a shell-managed child: while one is alive, reachability is
 * the liveness watch's job (window.js probes), so a transient probe failure
 * here cannot corrupt lifecycle state. The status is likewise never
 * promoted here — during 'starting' the launch URL is not minted yet, and
 * only the ready line (or the start-timeout probe) may flip 'starting' →
 * 'running'. Unmanaged results are observations and are reported with
 * cause 'probe' — not confirmed exits.
 */
export async function detect() {
  if (child && child.exitCode === null) {
    // Managed child alive — lifecycle state owns itself; no probe, no
    // status change (in particular: no promotion out of 'starting').
    return LOCAL_URL
  }
  const state = await probeState(LOCAL_URL)
  if (state.alive) {
    setStatus('running', null, 'probe')
    return LOCAL_URL
  }
  // The old process token (if any) belongs to a backend that is no longer
  // listening. Keep it out of the next backend's bootstrap.
  currentLaunchUrl = null
  setStatus('stopped', null, 'probe')
  return null
```

</details>

**依据 5 · 源码核查**：[electron/service.js:190-205](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/service.js#L190-L205)

--no-open spawn

<details>
<summary>查看原文（16行）</summary>

```text
  setStatus('starting')

  // Windows: .cmd/.bat cannot be spawned directly — EINVAL. Route them
  // through the shell so `dsh.cmd web` behaves like a normal terminal.
  const isCmd = process.platform === 'win32' && /\.(cmd|bat)$/i.test(resolved.command)
  const command = isCmd ? `"${resolved.command}"` : resolved.command

  let spawned = null
  try {
    spawned = spawn(command, [...resolved.args, 'web', '--no-open'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      shell: isCmd,
      env: { ...process.env, ...(resolved.env || {}) },
    })
  } catch (err) {
```

</details>

**依据 6 · 源码核查**：[electron/main.js:183-205](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L183-L205)

退出分支

<details>
<summary>查看原文（23行）</summary>

```text
      onQuit: async () => {
        const st = getStatus().status
        if (st === 'running' || st === 'starting') {
          const choice = dialog.showMessageBoxSync({
            type: 'question',
            title: '退出 DeepSeek Harness',
            message: '是否同时关闭后端？',
            detail: '关闭后端会停止本机 dsh web 服务；下次启动会自动重新启动。',
            buttons: ['关闭后端并退出', '仅退出', '取消'],
            defaultId: 0,
            cancelId: 2,
          })
          if (choice === 2) return
          if (choice === 0) {
            try {
              await stop()
            } catch {
              // best-effort
            }
          }
        }
        app.isQuitting = true
        app.quit()
```

</details>

#### 缺口

- 目标 BrowserAuth/Loader 版本及多实例竞态未测
  **影响：**可能出现窗口先出、后端未就绪的暂态
  **进一步探讨：**目标各平台冷启动、重启/退出/端口冲突矩阵

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置远程目标时是否真的不触碰本地后端？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

electron/service.js 注释宣称远程 target 不碰本地，但 electron/main.js 在读取配置 target 前就在模块作用域执行 const earlyBackend=start().catch(...)；start() 本身先 detect 本地端口，若无服务则解析 dsh CLI 并 spawn dsh web --no-open，没有按 targetUrl 提前门控。bootstrapBackend 后续才因远程目标 return，因此远程壳仍可能已拉起本地后端并消耗资源。若 start 未找到 CLI则早期失败被吞；此结论是源码路径推断，目标远程配置需实测。

#### 证据与依据

**依据 1 · 源码核查**：[electron/service.js:19-20](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/service.js#L19-L20)

注释声明远程不碰本地

```text
 * Shell/core decoupling: when a remote target URL is configured, no local
 * backend is ever touched — this module only manages the local dsh CLI.
```

**依据 2 · 源码核查**：[electron/main.js:64-69](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L64-L69)

配置加载前启动

```text
  // Kick off the local backend as early as possible — in parallel with
  // Electron's own startup and window creation — so the perceived wait is
  // max(electron, backend) instead of electron + backend. start() locates dsh
  // via DSH_BACKEND_DIR / npm global bin / PATH (none of which need app to be
  // ready), and its internal detect() reuses a backend already on the port.
  const earlyBackend = start().catch(() => {})
```

**依据 3 · 源码核查**：[electron/main.js:117-126](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L117-L126)

远程目标后期 return

<details>
<summary>查看原文（10行）</summary>

```text
  async function bootstrapBackend() {
    const config = loadConfig()
    const target = config.targetUrl || DEFAULT_TARGET_URL
    // Remote targets are the user's own business — never probe local.
    // Origin comparison (not string equality) tolerates trailing slashes
    // and an explicitly written default.
    if (new URL(target).origin !== new URL(DEFAULT_TARGET_URL).origin) return
    // The backend was already kicked off at module scope (see earlyBackend);
    // wait for it (or its failure) and reflect the settled state in the tray.
    await earlyBackend
```

</details>

**依据 4 · 源码核查**：[electron/service.js:172-205](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/service.js#L172-L205)

start 探测并启动本地

<details>
<summary>查看原文（34行）</summary>

```text
export async function start({ backendPath } = {}) {
  // Already up? Two very different situations hide behind this:
  //  - plugin mode: the DSH host half started this very backend and handed us
  //    its launch URL through DSH_WEB_LAUNCH_URL — that credential is still
  //    valid, so it must survive here (only detect() clears it, and only when
  //    nothing answers on the port at all).
  //  - a backend started outside the shell: its banner went to someone else's
  //    terminal, so we simply have no token for it.
  const up = await detect()
  if (up) return up

  // Backend path: explicit config → common locations → PATH.
  const resolved = await resolveDshCommand(backendPath)
  if (!resolved) {
    setStatus('error', '未找到 dsh 后端。请在托盘「设置后端文件夹」中指定 dsh CLI 所在目录。')
    throw new Error(lastError)
  }

  setStatus('starting')

  // Windows: .cmd/.bat cannot be spawned directly — EINVAL. Route them
  // through the shell so `dsh.cmd web` behaves like a normal terminal.
  const isCmd = process.platform === 'win32' && /\.(cmd|bat)$/i.test(resolved.command)
  const command = isCmd ? `"${resolved.command}"` : resolved.command

  let spawned = null
  try {
    spawned = spawn(command, [...resolved.args, 'web', '--no-open'], {
      stdio: ['ignore', 'pipe', 'pipe'],
      windowsHide: true,
      shell: isCmd,
      env: { ...process.env, ...(resolved.env || {}) },
    })
  } catch (err) {
```

</details>

#### 缺口

- 目标 Electron 执行顺序与远程配置运行未测
  **影响：**远程模式可能意外占端口/后台资源
  **进一步探讨：**配置远程 URL 且无本地服务观察进程/端口

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行时下载的完整性和清理机制有什么边界？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

host 首次启动可复用本地 Electron dist，否则从 GitHub/npmmirror 下载压缩包并尝试 SHASUMS256 校验；若校验文件不可得或未找到条目，verifySha256 返回 true 并继续解压，故校验是尽力而为，不是强制失败关闭。更新版本时 cleanupOldVersions 会删除 runtimeRoot 下以 electron-v 或 .extract-/.electron- 开头的其他项，包括旧版本/临时文件；这在插件专用目录中减小占用，但需核目录归属与备份。下载量可达数百 MB，真实耗时/磁盘未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime.js:59-101](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/runtime.js#L59-L101)

复用/下载顺序

<details>
<summary>查看原文（43行）</summary>

```text
/** Resolve (or provision) the runtime and return the electron exe path. */
export async function ensureRuntime(ctx) {
  const version = electronVersion()
  if (!version) throw new Error('desktopShell.electronVersion missing in package.json')
  const root = runtimeRoot()
  const dir = versionDir(root, version)
  const exe = join(dir, EXE_RELPATH)

  // 1) Already provisioned for this version?
  if (existsSync(exe)) {
    cleanupOldVersions(root, dir)
    if (!isWin) await ensureExecutable(ctx, exe)
    return exe
  }

  // 2) Local reuse: DSH_SHELL_ELECTRON_DIR → link/copy its dist/ (fast).
  const localSrc = process.env.DSH_SHELL_ELECTRON_DIR
  if (localSrc) {
    const srcExe = join(localSrc, 'dist', EXE_RELPATH)
    if (existsSync(srcExe) && provisionLocalDist(localSrc, dir)) {
      ctx.logger.info(`[clean-desktop-shell] reused electron runtime from ${localSrc}`)
    }
  }

  // 3) Download + extract the official zip from a network-appropriate source.
  if (!existsSync(exe)) {
    mkdirSync(root, { recursive: true })
    await downloadRuntime(ctx, version, root, dir)
  }

  if (!existsSync(exe)) {
    // Name the exact path we expected. Without it a user on an untested
    // platform has nothing to report back (this failure used to be silent).
    throw new Error(
      `electron runtime provisioning failed — expected binary at ${exe} ` +
        `(platform=${PLATFORM} arch=${ARCH}, layout differs per platform); ` +
        'check network, or point DSH_SHELL_ELECTRON_DIR at an electron package',
    )
  }
  cleanupOldVersions(root, dir)
  if (!isWin) await ensureExecutable(ctx, exe)
  ctx.logger.info(`[clean-desktop-shell] electron runtime ${version} ready at ${dir}`)
  return exe
```

</details>

**依据 2 · 源码核查**：[src/host/runtime.js:128-182](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/runtime.js#L128-L182)

下载/解压过程

<details>
<summary>查看原文（55行）</summary>

```text
async function downloadRuntime(ctx, version, root, dir) {
  const tmpZip = join(root, `.electron-${version}.zip.tmp`)
  rmSync(tmpZip, { force: true })
  const candidates = await runtimeCandidates(version)
  const zip = zipName(version)
  const innerName = zip.replace(/\.zip$/, '')

  for (const c of candidates) {
    ctx.logger.info(`[clean-desktop-shell] downloading electron ${version} from ${c.url}`)
    if (!(await fetchFile(c.url, tmpZip))) {
      // Failed download — drop the partial file so a later run starts clean.
      rmSync(tmpZip, { force: true })
      continue
    }

    // Integrity check against the source's own SHASUMS256.txt (same check
    // the `electron` package's installer performs). A mismatch means the
    // bytes are corrupt or tampered — the source is skipped entirely.
    if (!(await verifySha256(ctx, tmpZip, c.shasums, zip))) {
      rmSync(tmpZip, { force: true })
      continue
    }

    // Extract into a scratch dir, never into the shared runtime root: a
    // half-extracted zip there would be indistinguishable from a real
    // runtime, and the sibling electron-v* dirs must not be disturbed.
    const scratch = join(root, `.extract-${version}-${Date.now()}`)
    const ok = await extractZip(ctx, tmpZip, scratch)
    rmSync(tmpZip, { force: true })
    if (!ok) {
      ctx.logger.warn(`[clean-desktop-shell] no extractor succeeded for ${c.url}`)
      rmSync(scratch, { recursive: true, force: true })
      continue
    }

    // Both archive layouts exist in the wild: some Electron zips wrap
    // everything in a dir named after the zip, others (notably darwin, whose
    // payload is Electron.app/) unpack flat into the destination. Detect
    // rather than assume — the old code assumed the wrapper and silently
    // produced nothing on macOS.
    const payload = findPayload(scratch, join(scratch, innerName))
    if (!payload) {
      ctx.logger.warn(
        `[clean-desktop-shell] unexpected archive layout: no ${EXE_TOP} under ${scratch}`,
      )
      rmSync(scratch, { recursive: true, force: true })
      continue
    }

    movePayloadInto(dir, payload)
    rmSync(scratch, { recursive: true, force: true })
    if (isMac) await clearQuarantine(ctx, join(dir, EXE_TOP))
    return
  }
  throw new Error('electron download failed from all sources')
```

</details>

**依据 3 · 源码核查**：[src/host/runtime.js:185-230](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/runtime.js#L185-L230)

缺校验文件跳过校验

<details>
<summary>查看原文（46行）</summary>

```text
/**
 * Verify a downloaded zip against the source's SHASUMS256.txt — the same
 * integrity check the `electron` package's own installer performs. Returns
 * false on a checksum mismatch (fatal for that source); a temporarily
 * unreachable SHASUMS file only warns, so a reachable zip is not wasted
 * over an unrelated blocker.
 */
async function verifySha256(ctx, file, shasumsUrl, name) {
  let expected = null
  let reason = ''
  try {
    const res = await fetch(shasumsUrl, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      reason = `HTTP ${res.status}`
    } else {
      const text = await res.text()
      for (const line of text.split('\n')) {
        const m = line.trim().match(/^([0-9a-f]{64})\s+\*?(.+)$/i)
        if (m && m[2].trim() === name) {
          expected = m[1].toLowerCase()
          break
        }
      }
      if (!expected) reason = 'entry not found'
    }
  } catch (err) {
    reason = err?.message || 'fetch failed'
  }
  if (!expected) {
    ctx.logger.warn(
      `[clean-desktop-shell] SHASUMS256.txt unavailable from ${shasumsUrl} (${reason}) — skipping integrity check`,
    )
    return true
  }
  // Stream the hash — the zip can be ~270 MB and must not be read whole
  // into memory.
  const hash = createHash('sha256')
  await pipeline(createReadStream(file), hash)
  const actual = hash.digest('hex')
  if (actual !== expected) {
    ctx.logger.warn(
      `[clean-desktop-shell] checksum mismatch for ${name}: expected ${expected}, got ${actual}`,
    )
    return false
  }
  return true
```

</details>

**依据 4 · 源码核查**：[src/host/runtime.js:376-392](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/runtime.js#L376-L392)

旧版本清理

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Drop version dirs older than the current one (dead weight), plus any
 * scratch dir a crashed extraction left behind.
 */
function cleanupOldVersions(root, currentDir) {
  try {
    for (const entry of readdirSync(root)) {
      const isStaleRuntime = entry.startsWith('electron-v')
      const isScratch = entry.startsWith('.extract-') || entry.startsWith('.electron-')
      if (!isStaleRuntime && !isScratch) continue
      const full = join(root, entry)
      if (full === currentDir) continue
      rmSync(full, { recursive: true, force: true })
    }
  } catch {
    // best-effort
  }
```

</details>

#### 缺口

- 目标镜像可用性、下载包大小/权限未核
  **影响：**供给链完整性与旧 runtime 保留受影响
  **进一步探讨：**隔离目录验证下载源/SHASUMS 失败及回滚需求

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样分阶段验收再替换现有桌面壳？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

先在隔离 web profile/桌面账户卸载原版避免双壳，核 runtime 目录、下载/校验日志和启动 URL；分别测本地/远程目标、启动失败、托盘三选退出、后端已有进程与插件升级。不要在未验证远程门控前假设远程模式零本地资源。可改进把 earlyBackend 移到读取 target 后且仅本地执行、校验缺失时失败关闭或要求显式放行、清理旧 runtime 需留回滚；均为未验证设计。成本含 Electron 下载/磁盘、冷启动和恢复时间，本轮未测。 创新假设的依据是当前 earlyBackend 在读取 target 前无条件 start，远程配置后期才 return；另一事实是缺 SHASUMS 时校验放行。相对固定版，先解析 target 再仅本地 start、并对下载校验缺失失败关闭或要求显式人工放行，可减少远程误启与未验证运行时风险。条件是启动配置可在 Electron 初始化前可靠取得，原版 runtime 可回滚；代价是本地首启可能因网络/校验服务故障被阻断，也可能失去并行启动提速。以同机同配置原版/固定版/原型做本地与远程、已有/无后端、校验文件可用/不可用、离线升级矩阵；测窗口可用时间、本地进程/端口、下载完整性拒绝率及回滚耗时。若远程仍启动本地进程、未校验包仍被执行，或本地启动延迟/失败率超过可接受收益，假设被推翻；不能把设计建议直接当成已实现创新。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-38](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/README.md#L14-L38)

安装/原版卸载/作者待办

<details>
<summary>查看原文（25行）</summary>

````text
## 安装

```sh
dsh plugin --profile web add dsh-clean-desktop-shell-pro
```

安装后重启 `dsh web`。它会复用现有的 web profile 与 Electron 运行时（`$DSH_HOME/desktop-shell-runtime`）。

> 若已安装原版 `dsh-clean-desktop-shell`，请先卸载以避免两个桌面外壳同时启动：
>
> ```sh
> dsh plugin --profile web remove dsh-clean-desktop-shell
> ```

## 桌面快捷方式

首次启动后，可从托盘右键菜单「创建桌面快捷方式」生成桌面图标；或使用窗口首次运行时弹出的提示创建。

## 许可与来源

本包是 [dsh-clean-desktop-shell](https://github.com/Icather/dsh-clean-desktop-shell)（MIT）的 fork，保留其 LICENSE 与贡献者名单。

## 发布前待办（仅作者）

发布前请在 `electron/update.js` 中把 `YOUR_NAME` 替换为你的 GitHub 用户名，并建好对应仓库。
````

</details>

**依据 2 · 源码核查**：[electron/main.js:64-69](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L64-L69)

earlyBackend

```text
  // Kick off the local backend as early as possible — in parallel with
  // Electron's own startup and window creation — so the perceived wait is
  // max(electron, backend) instead of electron + backend. start() locates dsh
  // via DSH_BACKEND_DIR / npm global bin / PATH (none of which need app to be
  // ready), and its internal detect() reuses a backend already on the port.
  const earlyBackend = start().catch(() => {})
```

**依据 3 · 源码核查**：[electron/main.js:117-139](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L117-L139)

目标判别

<details>
<summary>查看原文（23行）</summary>

```text
  async function bootstrapBackend() {
    const config = loadConfig()
    const target = config.targetUrl || DEFAULT_TARGET_URL
    // Remote targets are the user's own business — never probe local.
    // Origin comparison (not string equality) tolerates trailing slashes
    // and an explicitly written default.
    if (new URL(target).origin !== new URL(DEFAULT_TARGET_URL).origin) return
    // The backend was already kicked off at module scope (see earlyBackend);
    // wait for it (or its failure) and reflect the settled state in the tray.
    await earlyBackend
    // If the early start failed (e.g. dsh was not found on the early PATH),
    // retry once with the configured backend path now that config is ready.
    const st = getStatus().status
    if (st !== 'running' && st !== 'starting') {
      try {
        await start({ backendPath: loadConfig().backendPath })
      } catch {
        // The offline screen still offers the manual start button.
      }
    }
    // Reflect the post-detect state in the tray menu.
    refreshTrayMenu()
  }
```

</details>

**依据 4 · 源码核查**：[src/host/runtime.js:185-230](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/src/host/runtime.js#L185-L230)

校验边界

<details>
<summary>查看原文（46行）</summary>

```text
/**
 * Verify a downloaded zip against the source's SHASUMS256.txt — the same
 * integrity check the `electron` package's own installer performs. Returns
 * false on a checksum mismatch (fatal for that source); a temporarily
 * unreachable SHASUMS file only warns, so a reachable zip is not wasted
 * over an unrelated blocker.
 */
async function verifySha256(ctx, file, shasumsUrl, name) {
  let expected = null
  let reason = ''
  try {
    const res = await fetch(shasumsUrl, { signal: AbortSignal.timeout(10000) })
    if (!res.ok) {
      reason = `HTTP ${res.status}`
    } else {
      const text = await res.text()
      for (const line of text.split('\n')) {
        const m = line.trim().match(/^([0-9a-f]{64})\s+\*?(.+)$/i)
        if (m && m[2].trim() === name) {
          expected = m[1].toLowerCase()
          break
        }
      }
      if (!expected) reason = 'entry not found'
    }
  } catch (err) {
    reason = err?.message || 'fetch failed'
  }
  if (!expected) {
    ctx.logger.warn(
      `[clean-desktop-shell] SHASUMS256.txt unavailable from ${shasumsUrl} (${reason}) — skipping integrity check`,
    )
    return true
  }
  // Stream the hash — the zip can be ~270 MB and must not be read whole
  // into memory.
  const hash = createHash('sha256')
  await pipeline(createReadStream(file), hash)
  const actual = hash.digest('hex')
  if (actual !== expected) {
    ctx.logger.warn(
      `[clean-desktop-shell] checksum mismatch for ${name}: expected ${expected}, got ${actual}`,
    )
    return false
  }
  return true
```

</details>

**依据 5 · 源码核查**：[electron/main.js:183-205](https://github.com/Aicksion/dsh-clean-desktop-shell-pro/blob/03fdf5d8b0959c3738cdb3d887baa6d017443fe6/electron/main.js#L183-L205)

退出选择

<details>
<summary>查看原文（23行）</summary>

```text
      onQuit: async () => {
        const st = getStatus().status
        if (st === 'running' || st === 'starting') {
          const choice = dialog.showMessageBoxSync({
            type: 'question',
            title: '退出 DeepSeek Harness',
            message: '是否同时关闭后端？',
            detail: '关闭后端会停止本机 dsh web 服务；下次启动会自动重新启动。',
            buttons: ['关闭后端并退出', '仅退出', '取消'],
            defaultId: 0,
            cancelId: 2,
          })
          if (choice === 2) return
          if (choice === 0) {
            try {
              await stop()
            } catch {
              // best-effort
            }
          }
        }
        app.isQuitting = true
        app.quit()
```

</details>

#### 缺口

- 目标平台的兼容性和速度未实测
  **影响：**不能直接替换生产桌面入口
  **进一步探讨：**隔离 profile 本地/远程/离线/旧版对照

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
