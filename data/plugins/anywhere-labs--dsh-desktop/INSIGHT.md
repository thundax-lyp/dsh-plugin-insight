# DSH Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[31a96e1](https://github.com/anywhere-labs/dsh-desktop/tree/31a96e1750aab260cee87a501e39d78482db3218)

<!-- BEGIN META -->
[![GitHub ★ 34,234](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34%2C234&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)
<!-- END META -->

> **功能**：将 DeepSeek Harness 的本地 Web 界面、Host 和插件系统集成到原生桌面应用。

> **亮点**：[Q02](#research-q02) 把上游 DSH Host、Web 界面与桌面进程生命周期组合，并在 renderer 健康后再交付工作区；核心 Agent 能力属于上游，未证明运行收益。

> **主要限制**：[Q03](#research-q03) 的 Host 停止和 checkpoint 分支显示应用有恢复保护，但失败或超时会限制操作；健康回调不证明用户数据完整可恢复。

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
  - [Q01 · 它是什么，面向谁及需要什么？](#detail-section-11)
  - [Q02 · 从启动到可用窗口怎样接线？](#detail-section-12)
  - [Q03 · 失败恢复、安全和配置边界是什么？](#detail-section-13)
  - [Q04 · 成本、效果与可证伪假设是什么？](#detail-section-14)
  - [Q05 · 谁值得试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向希望在桌面管理 DSH 工作区的用户，合格结果包括完成任务及安全退出。

直接使用官方 DSH CLI 或 Web 需要自行管理相应启动和配置；本轮没有测量两者全周期成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 桌面窗口与托盘 | 承载 DSH Web 并提供桌面入口 | 依赖 Host 和 renderer 健康，未做平台验收 |
| 独立 Host 管理 | 启动、停止并监控本地服务 | 退出无法确认时会报错 |
| profile 组合 | 选择 Host 配置及插件 | 数据根可受自定义配置影响 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 目标平台安装包 | 安装方式必需 | 提供 Electron 和 DSH 运行时 | 不能以本次源码检查证明发行包可运行 |
| profile 与本地 Host | 必需 | 组合 DSH 服务和插件 | 启动失败进入恢复路径 |
| 模型服务与授权 | 模型任务必需 | 执行实际任务 | 未配置时无法完成模型任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份并核查安装来源、数据根 | 原数据可单独恢复 |
| 启动 | 应用准备 profile、启动 Host 和窗口 | renderer 健康且可打开预期工作区 |
| 任务 | 用户配置模型并执行小任务 | 核对真实任务输出 |
| 退出 | 用户从托盘退出 | 确认 Host 停止和原数据可读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装包、桌面运行时及模型服务资源 | 下载、备份和配置 | 时间和金额未知 |
| 持续使用 | Host、Electron 内存及模型费用 | 更新、配置和任务复核 | 资源与费用未知 |
| 失败恢复 | 重试、备份存储与可能重复任务费用 | 排障及恢复 | 恢复成功率未知 |
| 退出 | 保留备份空间 | 停止进程并核对数据 | 可恢复性未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 启动和窗口 | 存在 Host、桌面调度和健康门 | 平台实际启动成功率 |
| 工作流程 | 桌面管理配置和上游 Web | 端到端节时和任务质量 |

> **思考**：[Q03](#research-q03) 的 Host 停止和 checkpoint 分支显示应用有恢复保护，但失败或超时会限制操作；健康回调不证明用户数据完整可恢复。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把上游 DSH Host、Web 界面与桌面进程生命周期组合，并在 renderer 健康后再交付工作区；核心 Agent 能力属于上游，未证明运行收益。

[Q02](#research-q02) 将 Host 进程、窗口调度和健康门串联；[Q03](#research-q03) 以有界等待与安全停止限制恢复写操作，仍需按平台验证故障后果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的 Host 停止和 checkpoint 分支显示应用有恢复保护，但失败或超时会限制操作；健康回调不证明用户数据完整可恢复。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议使用隔离账户与数据根试单项任务，检查网络范围和退出；数据归属或恢复不明确时保留原备份并回到现有 CLI 或 Web。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查的实现支持受管理 Host 和窗口；安装、数据恢复及用户任务效果未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、dsh-plugin-desktop/package.json、docs/user-guide.en.md、dsh-plugin-desktop/src/main.ts、dsh-plugin-desktop/src/host-process.ts、dsh-plugin-desktop/src/host-process-entry.ts、dsh-plugin-desktop/src/host-bootstrap.ts、dsh-plugin-desktop/src/index.ts、dsh-plugin-desktop/src/electron-runtime.ts、dsh-plugin-desktop/src/electron-shell-generation.ts、dsh-plugin-desktop/src/startup-generation.ts、dsh-plugin-desktop/src/local-window-policy.ts、dsh-plugin-desktop/src/webserver.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查稳定桌面包的启动、Host、窗口及局部安全和恢复路径；未审计其他模块、发行包、全部插件或平台。
- 下一步：固定发行包、宿主版本及数据根，在隔离账户执行安装、任务、异常停止、恢复和卸载；与原 CLI 或 Web 比较结果、时间和资源。

**分析版本**

- **仓库**：[anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)
- **版本号**：未声明（[固定提交 31a96e1](https://github.com/anywhere-labs/dsh-desktop/tree/31a96e1750aab260cee87a501e39d78482db3218)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设切换前展示实际数据根供用户核对可减少错误归属，须在同任务记录识别正确率、耗时和可还原性；尚未验证。

固定发行包、宿主版本及数据根，在隔离账户执行安装、任务、异常停止、恢复和卸载；与原 CLI 或 Web 比较结果、时间和资源。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | test | 391 | 79079 | 70628 | 2938 | — |
| .ts | source | 535 | 88304 | 71769 | 11220 | — |
| .md | source | 143 | 19592 | — | — | 285703 |
| .mjs | source | 69 | 10202 | 9250 | 709 | — |
| .tsx | source | 64 | 13696 | 12744 | 348 | — |
| .tsx | test | 3 | 2208 | 2016 | 43 | — |
| .ts | example | 1 | 158 | 122 | 17 | — |
| .mjs | example | 5 | 144 | 128 | 12 | — |
| .mjs | test | 15 | 1325 | 1139 | 89 | — |
| .js | example | 1 | 20 | 14 | 3 | — |

</details>

**活跃度**

[![Issue 未关闭 316](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=316&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 124](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=124&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 66](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=66&color=737b86&logo=github)](https://github.com/anywhere-labs/dsh-desktop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定该桌面应用如何启动并承载 DSH 用户工作区，其安装、连接、退出和平台条件如何影响使用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它是什么，面向谁及需要什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

它是独立社区构建的桌面客户端和产品工作区，使用 DeepSeek Harness 的 Host、Web UI 与插件机制，桌面包本身还提供 Cordis 插件入口。对象是希望在本地桌面管理工作区和 profile 的 DSH 用户；合格结果是能启动预期 profile、完成任务并安全退出，而不是窗口出现即成功。根包是私有多包工作区，稳定桌面包单独声明命令和插件导出，因此目录收录不应把整个根组件当成一般 DSH 插件。作者提供 Windows 和 macOS 安装包并称用户无需另装 Node；模型授权、具体平台兼容及真实安装结果仍取决于运行环境，本轮未验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-17](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/README.md#L8-L17)

独立桌面客户端和社区身份。

<details>
<summary>查看原文（10行）</summary>

```text
  <strong>基于 DeepSeek Harness 构建的 Windows 和 macOS 开源桌面客户端。</strong>
</p>

<h3 align="center"><a href="https://dshdesktop.cn">一键下载，开箱即用。</a></h3>

<p align="center">
  万物皆「插件」，桌面本身也是「插件」。
</p>

<p align="center"><sub>独立的社区开源项目，与深度求索不存在隶属、合作、授权或背书关系。<br>本仓库目前无深度求索员工或 DeepSeek Harness 上游官方团队成员参与；GitHub Contributors 中显示的上游贡献者来自 fork 继承和同步的提交历史。<br>中文 · <a href="README.en.md">English</a></sub></p>
```

</details>

**依据 2 · 作者声明**：[README.md:29-43](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/README.md#L29-L43)

上游组件归属和安装渠道。

<details>
<summary>查看原文（15行）</summary>

```text
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows-4493F8?style=flat-square" alt="Supported platforms: macOS and Windows">
</p>

DSH Desktop 将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的本地 Web UI、Host 服务和插件系统集成到原生桌面应用中。项目固定并原样运行特定上游版本；DSH Desktop 提供窗口、托盘、终端、更新和工作配置，并通过 DeepSeek Harness 提供的插件机制与上游能力组合。

<a id="run"></a>

## 下载与安装

当前正式安装包支持 Windows x64 和 macOS Universal。无需额外环境，下载安装，一键使用。

| 平台 | 下载 | 安装方式 |
| --- | --- | --- |
| Windows x64 | [下载安装程序](https://www.dshdesktop.cn/api/downloads/windows) | 运行 NSIS 安装程序并按提示完成安装 |
| macOS Universal | [下载 DMG](https://www.dshdesktop.cn/api/downloads/mac) | 打开 DMG，将 DSH Desktop 拖入 Applications |
```

</details>

**依据 3 · 源码核查**：[package.json:1-15](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/package.json#L1-L15)

根是私有多包产品工作区。

<details>
<summary>查看原文（15行）</summary>

```text
{
  "name": "deepseek-harness-desktop",
  "private": true,
  "description": "DSH Desktop product workspace",
  "license": "MIT",
  "packageManager": "yarn@4.18.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "workspaces": [
    "dsh-plugin-desktop",
    "dsh-plugin-desktop-beta",
    "dsh-desktop-next",
    "dsh-community-fabric",
    "dsh-community-market"
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop/package.json:1-27](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/package.json#L1-L27)

稳定包声明桌面命令和插件导出。

<details>
<summary>查看原文（27行）</summary>

```text
{
  "name": "dsh-plugin-desktop",
  "version": "2.0.18",
  "description": "DSH Desktop: an Electron shell composed as a DeepSeek Harness Cordis plugin",
  "desktopName": "dsh-desktop.desktop",
  "license": "MIT",
  "publishConfig": {
    "registry": "https://registry.npmjs.org"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/anywhere-labs/deepseek-harness-desktop.git",
    "directory": "dsh-plugin-desktop"
  },
  "type": "module",
  "main": "lib/main.js",
  "types": "lib/types/index.d.ts",
  "bin": {
    "dsh-desktop": "lib/bin.js",
    "dsh-plugin-desktop": "lib/bin.js"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./profile": {
```

</details>

#### 缺口

- 固定版本安装包和平台实际运行兼容性
  **影响**：决定是否能安全使用桌面交付
  **进一步探讨**：在隔离账户核对发行产物、安装及退出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从启动到可用窗口怎样接线？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

稳定版 main 首先取得单实例锁；默认路径通过 Electron utilityProcess 启动独立 Host 并经 RPC 发 boot。子进程入口安装网络代理策略，调用 bootDesktopHost；该函数将 profile 根配置和补丁交给上游 boot 并绑定生命周期。Desktop shell 的 apply 从宿主取得桌面运行时与已绑定 Web 服务，构造认证 URL 并 schedule 窗口；主进程调用 mountScheduled，创建 ElectronShellGeneration，后者认证 renderer、加载 URL 并创建托盘。主进程还等待 renderer 健康结果后才将启动标记完成和交付待打开工作区。相对手动启动 DSH Web，这增加受管理的本地桌面生命周期和原生入口，而 Agent 和 Web 核心能力属于上游。此链是固定源码，未启动 Host 或验证窗口。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop/src/main.ts:468-475](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L468-L475)

主进程单实例保护。

```text
async function start(): Promise<void> {
  if (!app.requestSingleInstanceLock()) {
    app.quit()
    return
  }
  if (isDesktopInstallerQuitRequest(process.argv, process.platform)) {
    app.quit()
    return
```

**依据 2 · 源码核查**：[dsh-plugin-desktop/src/main.ts:1637-1647](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L1637-L1647)

默认启动独立 Host 并绑定生命周期。

<details>
<summary>查看原文（11行）</summary>

```text
    if (process.env.DSH_DESKTOP_ISOLATED_HOST !== '0') {
      startupStage = 'host-boot'
      lifecycleRecorder.transitionStartupStage(startupStage)
      await startIsolatedDesktopHost({
        host: { prepared, profilePreferences, homeDir, activeProfileName, pluginManagementStatePath,
          selectionStatePath, marketUserDataDir, releaseUserDataLocations, desktopLaunchEnvironment,
          desktopProxyOverlay: proxyResolution.overlay,
          desktopPnpmBootstrap, primaryRuntime, diagnosticRunId: diagnosticRunId(), logDirectory: join(desktopUserDataDir, 'logs', 'host') },
        runtime, rendererToken: browserAccess.rendererHeader.value,
        prepareCertificate: prepareHostCertificate,
        bindHost: host => generation.bindHost(host), requestQuit,
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/host-process.ts:47-50](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process.ts#L47-L50)

fork 独立 Host 进程。

```text
export async function startIsolatedDesktopHost(options: IsolatedHostOptions): Promise<void> {
  const forkedAt = performance.now()
  const child = utilityProcess.fork(fileURLToPath(new URL('./host-process-entry.js', import.meta.url)), [], {
    serviceName: 'DSH Host', stdio: 'pipe', cwd: process.cwd(), env: { ...process.env },
```

**依据 4 · 源码核查**：[dsh-plugin-desktop/src/host-process.ts:104-114](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process.ts#L104-L114)

通过 RPC boot，失败时 stop。

<details>
<summary>查看原文（11行）</summary>

```text
    await releaseNative()
    rpc.close()
  })()
  options.bindHost({ fiber: { dispose: stop } })
  try {
    const { desktopLaunchEnvironment, ...host } = options.host
    await rpc.call('boot', [{ ...host, launchEnvironmentLayers: serializeHostEnvironment(desktopLaunchEnvironment) }, runtimeSnapshot(options.runtime), options.rendererToken])
    booted = true
  } catch (cause) {
    await stop()
    throw cause
```

</details>

**依据 5 · 源码核查**：[dsh-plugin-desktop/src/host-process-entry.ts:50-75](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process-entry.ts#L50-L75)

子进程执行 Host 启动和窗口调度。

<details>
<summary>查看原文（26行）</summary>

```text
rpc.handle('boot', async args => {
  const [wire, snapshot, token] = args as [Omit<DesktopHostOptions, 'desktopLaunchEnvironment'> & { launchEnvironmentLayers: LaunchEnvironmentLayerInput[] }, RuntimeSnapshot, string]
  const options: DesktopHostOptions = { ...wire, desktopLaunchEnvironment: createLaunchEnvironmentSnapshot(wire.launchEnvironmentLayers) }
  if (starting || stopping) throw new Error('DSH Host generation already started or stopped')
  starting = true
  // The supervisor's installation does not reach here: the global dispatcher, `proxyRouteFor`'s
  // backing state, and the child-process environment are all module-private per process. This must
  // land before `bootDesktopHost`, because plugins mount during boot and may request immediately.
  // The supervisor already logged which route this is and why; repeating the URL here would only
  // add a second place for it to appear in a log a user pastes into an issue.
  releaseProxy = await installProxyFromEnvironment(
    desktopProxyEnvLookup(options.desktopLaunchEnvironment, options.desktopProxyOverlay),
    message => process.stderr.write(`dsh-plugin-desktop: ${message}\n`),
  )
  process.stderr.write('dsh-plugin-desktop: host outbound proxy policy installed\n')
  try {
    const runtime = createHostRuntime(rpc, snapshot)
    const browser = createDesktopBrowserAccess(options.prepared.mode === 'compatibility' && options.prepared.openBrowser, token)
    lan = new DesktopLanHttpsRuntime({
      addresses: options.prepared.lanAddresses, requestedPort: 0,
      prepareCertificate: () => rpc.call('certificate'),
    })
    inspectServices = await bootDesktopHost(options, runtime, browser, lan,
      value => { host = value }, code => { void rpc.call('quit', [code]).catch(() => {}) })
    if (stopping) { await host?.fiber.dispose(); throw new Error('DSH Host stopped during startup') }
    await runtime.mountScheduled()
```

</details>

**依据 6 · 源码核查**：[dsh-plugin-desktop/src/host-bootstrap.ts:135-144](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-bootstrap.ts#L135-L144)

使用 profile 配置和补丁启动上游 Host。

<details>
<summary>查看原文（10行）</summary>

```text
    const ctx = await boot(
      BIN_NAME,
      prepared.rootConfig,
      prepared.patches,
      async (hostCtx) => {
        profileBoot.prepare(hostCtx)
        // Keep Host imports and browser bundle discovery on the same public
        // profile-overlay resolver used by packaged Electron.
        hostCtx.loader.internal = undefined
        bindHost(hostCtx)
```

</details>

**依据 7 · 源码核查**：[dsh-plugin-desktop/src/index.ts:149-177](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/index.ts#L149-L177)

桌面运行时和已绑定 Web 服务是前提。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: Context, config: DesktopShellConfig): void {
  const runtime = ctx.get('desktopRuntime')
  if (runtime === undefined) {
    process.stderr.write(
      'dsh-plugin-desktop: this profile is composed with the DSH Desktop shell, which requires the desktop launcher (desktopRuntime).\n'
      + 'Start it with `dsh-desktop`, or select this profile inside the packaged DSH Desktop application.\n'
      + 'The desktop terminal, profile, and update rows stay inactive in an ordinary DSH boot.\n',
    )
    return
  }
  const appExit = ctx.get('appExit')
  if (appExit === undefined) {
    throw new Error('dsh-plugin-desktop: the launcher did not provide ctx.appExit')
  }
  const browserAccess = ctx.get('desktopBrowserAccess')
  if (browserAccess === undefined) {
    throw new Error('dsh-plugin-desktop: the launcher did not provide ctx.desktopBrowserAccess')
  }
  const lanHttps = ctx.get('desktopLanHttps')
  if (lanHttps === undefined) {
    throw new Error('dsh-plugin-desktop: the launcher did not provide ctx.desktopLanHttps')
  }
  const resolved = resolveDesktopConfig(config)
  if (ctx.webServer.host !== desktopWebServerHost(resolved.networkExposure)) {
    throw new Error('dsh-plugin-desktop: desktop shell WebServer host does not match networkExposure')
  }
  const webServerPort = ctx.webServer.port
  if (webServerPort === undefined) {
    throw new Error('dsh-plugin-desktop: the WebServer has not bound a port')
```

</details>

**依据 8 · 源码核查**：[dsh-plugin-desktop/src/index.ts:421-442](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/index.ts#L421-L442)

计算 URL 并调度桌面窗口。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.effect(
    () => {
      const material = effectiveDesktopWindowMaterial(
        resolved.mode,
        runtime.platform,
        resolved.macosMaterial,
        resolved.linuxMaterial,
      )
      const url = desktopRendererUrl(
        webServerPort,
        resolved.mode,
        runtime.platform,
        runtime.updates.currentVersion,
        material,
      )
      return runtime.schedule({
        ...resolved,
        material,
        url,
        authenticationUrl: ctx.connection.authenticatedUrl(new URL(url).origin),
        rendererAccessHeader: browserAccess.rendererHeader,
        productName: DESKTOP_PRODUCT_NAME,
```

</details>

**依据 9 · 源码核查**：[dsh-plugin-desktop/src/electron-runtime.ts:319-325](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/electron-runtime.ts#L319-L325)

主进程挂载已调度窗口。

```text
  mountScheduled(beforeInteractive?: () => void): Promise<void> {
    const spec = this.scheduled
    if (spec === undefined) {
      return Promise.reject(new Error('dsh-plugin-desktop: the Cordis shell plugin did not register a window'))
    }
    if (this.mountTask === undefined) {
      this.setLocalePreference(spec.readLocalePreference())
```

**依据 10 · 源码核查**：[dsh-plugin-desktop/src/electron-runtime.ts:334-339](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/electron-runtime.ts#L334-L339)

创建原生窗口代际对象。

```text
        reportError: cause => this.logError(`Remote control notice: ${String(cause)}`),
      }) : undefined
      const generation = new ElectronShellGeneration({
        platform: this.platformStrategy,
        spec,
        preloadPath: desktopPreloadPath(),
```

**依据 11 · 源码核查**：[dsh-plugin-desktop/src/electron-runtime.ts:380-390](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/electron-runtime.ts#L380-L390)

挂载并向健康门报告。

<details>
<summary>查看原文（11行）</summary>

```text
      })
      this.generation = generation
      this.mountTask = generation.mount(beforeInteractive).then(() => {
        this.rendererHealthGate?.acceptNativeMount()
        void this.nextTransitionNotice.open(this.locale, DESKTOP_RELEASE_CHANNEL,
          () => this.generation === generation && !this.quitting).then(() => this.offerUpdateArtifactCleanup()).catch((cause: unknown) => {
          this.logError(`dsh-plugin-desktop: failed to resolve update installer cleanup: ${cause instanceof Error ? cause.message : String(cause)}`)
        })
      }).catch((cause: unknown) => {
        if (this.generation === generation) this.generation = undefined
        throw cause
```

</details>

**依据 12 · 源码核查**：[dsh-plugin-desktop/src/electron-shell-generation.ts:674-689](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/electron-shell-generation.ts#L674-L689)

认证、加载 URL 与创建托盘。

<details>
<summary>查看原文（16行）</summary>

```text
    try {
      await traceRendererBootStage('shell-load', async () => { await this.compatibilityShell?.load() })
      await traceRendererBootStage('authenticate', () => authenticateRendererSession(renderer, spec))
      removeRendererAccessHeader = installRendererAccessHeader(
        renderer,
        origin,
        spec.rendererAccessHeader,
      )
      revealStartupSurface()
      await traceRendererBootStage('page-load', async () => {
        if (isolated) await renderer.loadURL(spec.url)
        else await window.loadURL(spec.url)
      })
      if (isolated) renderer.focus()
      tray = new Tray(prepareTrayIcon(spec.trayIcons, platform.platform))
      this.tray = tray
```

</details>

**依据 13 · 源码核查**：[dsh-plugin-desktop/src/main.ts:1904-1939](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L1904-L1939)

健康门、checkpoint 和 workspace 交付。

<details>
<summary>查看原文（36行）</summary>

```text
    startupStage = 'renderer-startup'
    lifecycleRecorder.transitionStartupStage(startupStage)
    lifecycleRecorder.startRendererBoot()
    const rendererBoot = runtime.beginRendererBootMonitoring({
      commitHealthy: async () => {
        lifecycleRecorder.finishRendererBoot({ status: 'healthy' }, 'renderer-failed')
        startupStage = 'health-commit'
        lifecycleRecorder.transitionStartupStage(startupStage)
        try {
          profileCheckpoint?.captureHealthy()
        } catch (cause) {
          electronLogger.error(
            `${BIN_NAME}: failed to checkpoint the healthy profile configuration: ${cause instanceof Error ? cause.message : String(cause)}`,
          )
        }
      },
    })
    const [, rendererVerdict] = await Promise.all([
      runtime.mountScheduled(),
      rendererBoot,
    ])
    const rendererReport = rendererVerdict.report
    if ('failureReason' in rendererVerdict) {
      throw new RendererStartupFailure(
        rendererVerdict.failureReason,
        rendererVerdict.report,
      )
    }
    lifecycleRecorder.completeStartup(startupStage, rendererReport)
    // Only a renderer that reached a healthy boot can take a workspace, so the
    // hand-off is released here rather than beside the mount: a startup that
    // ended in the recovery route must not also try to open a folder.
    launchWorkspaceReady = true
    const requestedWorkspacePath = pendingLaunchWorkspacePath
    pendingLaunchWorkspacePath = undefined
    if (requestedWorkspacePath !== undefined) void openLaunchWorkspace(requestedWorkspacePath)
```

</details>

#### 缺口

- 具体版本 Host、认证及窗口能否在目标平台完成一项真实任务
  **影响**：源码存在链路不等于桌面可用
  **进一步探讨**：隔离 profile 记录宿主、窗口、任务结果和完整退出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败恢复、安全和配置边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 未响应停止请求时，管理器在超时后尝试杀进程，并等待退出，无法确认会抛错；启动失败路径先尝试停止 Host，停止不安全时不给恢复助手可写操作。健康 checkpoint 只在 renderer 健康回调尝试捕获且捕获失败被记录，不能视为全部用户数据可恢复。桌面本地 HTML 窗口禁 Node 集成、启用隔离与沙箱，拒绝弹窗和 webview；这一范围不证明全部 Web 页面或插件安全。Desktop WebServer 要求回环绑定，局域网入口另经 HTTPS 和设置控制。版本、插件、数据迁移以及安全设置的组合仍须真实验证。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop/src/host-process.ts:89-114](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process.ts#L89-L114)

停止 RPC、终止及无法确认退出的处理。

<details>
<summary>查看原文（26行）</summary>

```text
  let stopTask: Promise<void> | undefined
  const stop = (): Promise<void> => stopTask ??= (async () => {
    stopping = true
    if (!exited) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3_000)
      try { await rpc.call('stop', [], controller.signal) } catch { /* terminate an unresponsive Host */ }
      finally { clearTimeout(timeout) }
      if (!exited) child.kill()
      const timeoutExit = new Promise<never>((_resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('DSH Host termination was not confirmed')), 1_000)
        void exit.then(() => clearTimeout(timer))
      })
      await Promise.race([exit, timeoutExit])
    }
    await releaseNative()
    rpc.close()
  })()
  options.bindHost({ fiber: { dispose: stop } })
  try {
    const { desktopLaunchEnvironment, ...host } = options.host
    await rpc.call('boot', [{ ...host, launchEnvironmentLayers: serializeHostEnvironment(desktopLaunchEnvironment) }, runtimeSnapshot(options.runtime), options.rendererToken])
    booted = true
  } catch (cause) {
    await stop()
    throw cause
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop/src/startup-generation.ts:69-85](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/startup-generation.ts#L69-L85)

恢复前等待 Host 停止，超时返回 false。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Stop the Host and its effects before a recovery mutation. */
  async quiesceForRecovery(): Promise<boolean> {
    if (this.released) return false
    if (this.host === undefined) return true
    this.hostDisposeTask ??= this.disposeHostForRecovery()
    let timeout: ReturnType<typeof setTimeout> | undefined
    const timedOut = new Promise<false>(resolve => {
      timeout = setTimeout(() => {
        this.options.logger.error(
          `${BIN_NAME}: plugin Host did not stop in time; mutating recovery actions are unavailable`,
        )
        resolve(false)
      }, this.quiesceTimeoutMs)
    })
    const result = await Promise.race([this.hostDisposeTask, timedOut])
    if (timeout !== undefined) clearTimeout(timeout)
    return result
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/main.ts:1948-1974](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L1948-L1974)

恢复操作按安全停止结果受限。

<details>
<summary>查看原文（27行）</summary>

```text
  } catch (cause) {
    runtime.stopRendererBootMonitoring()
    lifecycleRecorder.failRendererBootIfPending(lifecycleRendererFailureReason(runtime.rendererBootFailureReason))
    lifecycleRecorder.failStartup(startupStage, lifecycleStartupFailureReason(cause, runtime))
    electronLogger.errorCause(cause)
    let exitCode = 1
    const failureRoute = routeDesktopStartupFailure({
      appReady: app.isReady(),
      stage: startupStage,
    })
    const recoveryActionsSafe = await generation.quiesceForRecovery()
    if (failureRoute === 'startup-recovery') {
      const detail = cause instanceof Error ? cause.message : String(cause)
      const recoveryResult = await openStartupRecoveryWindow(
        detail,
        recoveryActionsSafe ? startupRecoveryController : undefined,
      )
      if (recoveryResult === 'restart') {
        nativeExit.requestRelaunch()
        exitCode = 0
      } else if (recoveryResult === 'safe-mode') {
        nativeExit.requestRelaunch(desktopSafeModeRelaunchArguments())
        exitCode = 0
      }
    }
    startupRecoveryController?.dispose()
    await shutdown.request(exitCode)
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop/src/main.ts:1904-1917](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L1904-L1917)

renderer 健康后尝试 checkpoint，失败记录。

<details>
<summary>查看原文（14行）</summary>

```text
    startupStage = 'renderer-startup'
    lifecycleRecorder.transitionStartupStage(startupStage)
    lifecycleRecorder.startRendererBoot()
    const rendererBoot = runtime.beginRendererBootMonitoring({
      commitHealthy: async () => {
        lifecycleRecorder.finishRendererBoot({ status: 'healthy' }, 'renderer-failed')
        startupStage = 'health-commit'
        lifecycleRecorder.transitionStartupStage(startupStage)
        try {
          profileCheckpoint?.captureHealthy()
        } catch (cause) {
          electronLogger.error(
            `${BIN_NAME}: failed to checkpoint the healthy profile configuration: ${cause instanceof Error ? cause.message : String(cause)}`,
          )
```

</details>

**依据 5 · 源码核查**：[dsh-plugin-desktop/src/local-window-policy.ts:17-39](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/local-window-policy.ts#L17-L39)

本地窗口安全参数与弹窗拒绝。

<details>
<summary>查看原文（23行）</summary>

```text
/** Construct a local-file window with no Node, preload, popup, or WebView path. */
export function createDesktopLocalWindow(options: DesktopLocalWindowOptions): BrowserWindow {
  const { partition, preferredSizeMode, locale, ...windowOptions } = options
  if (!/^dsh-[a-z0-9-]+$/u.test(partition)) {
    throw new TypeError('dsh-plugin-desktop: local window partition must be a dedicated in-memory dsh-* partition')
  }
  const window = new BrowserWindow({
    ...windowOptions,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      nodeIntegrationInSubFrames: false,
      sandbox: true,
      webSecurity: true,
      webviewTag: false,
      spellcheck: false,
      ...(preferredSizeMode === undefined ? {} : { enablePreferredSizeMode: preferredSizeMode }),
      partition,
    },
  })
  observeDesktopRenderer(window.webContents, partition)
  window.webContents.setWindowOpenHandler(() => ({ action: 'deny' }))
  window.webContents.on('will-attach-webview', event => { event.preventDefault() })
```

</details>

**依据 6 · 源码核查**：[dsh-plugin-desktop/src/webserver.ts:55-73](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/webserver.ts#L55-L73)

上游 WebServer 包装强制回环及访问判断。

<details>
<summary>查看原文（19行）</summary>

```text
/** Reuse the upstream WebServer while retrying only real bind collisions. */
export class DesktopWebServer extends WebServer {
  static override Config = WebServer.Config

  private readonly desktopConfig: Config

  constructor(ctx: ConstructorParameters<typeof WebServer>[0], config: Config) {
    if (config.host !== '127.0.0.1') {
      throw new Error('dsh-plugin-desktop: Desktop WebServer requires loopback until LAN HTTPS is available')
    }
    super(ctx, config)
    this.desktopConfig = config
  }

  private permits(request: Parameters<WebRoute['handler']>[0]): boolean {
    const access = this.ctx.get('desktopBrowserAccess')
    // The Desktop-owned server remains usable in an ordinary `dsh` launch,
    // where the Electron launcher capability is intentionally absent.
    return access === undefined || decideDesktopBrowserAccess(access, request) !== 'denied'
```

</details>

#### 缺口

- 更新、备份恢复、退出及所有插件数据在目标系统的实际结果
  **影响**：影响是否能迁移真实工作区
  **进一步探讨**：先备份并在隔离数据根演练恢复和异常退出

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、效果与可证伪假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

安装包打包桌面环境，可能减少手工组合 Host、Web 与桌面启动步骤；这只是架构上的便利，不等于已证实节省。初次成本含下载安装、授权和 profile 设置；持续成本包括 Electron 与 Host 资源、模型费用、版本适配和配置维护；失败时还需要备份、排错与恢复。各金额、耗时和成功率未知。可提出未验证假设：在 profile 切换完成前展示将保留或改变的实际数据根，并要求用户核对，可减少错误归属；相对现有切换增加一步确认与路径显示负担。以相同任务比较现有流程和预览流程，记录用户识别正确率、耗时、可还原性；正确率不升或造成不可接受摩擦即否定。

#### 证据与依据

**依据 1 · 作者声明**：[docs/user-guide.en.md:3-7](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/docs/user-guide.en.md#L3-L7)

作者描述打包依赖和启动及退出方式。

```text
## Installation and first launch

Download the macOS or Windows installer from the product download page. DSH Desktop includes Electron, Node, and its pinned DSH dependencies, so normal users do not need to install Node.js or pnpm separately.

On first launch, the application prepares the default profile and starts the official DSH Web surface locally. Closing the window normally hides it; use **Quit** from the tray when you want to stop the application and Host process.
```

**依据 2 · 作者声明**：[docs/user-guide.en.md:20-26](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/docs/user-guide.en.md#L20-L26)

作者说明 profile 及数据根可能由自定义配置改变。

```text
## Profiles

A profile is a composition of DSH bundles, dependencies, and patches. The tray **Profile** menu lists existing profiles and the lazy `desktop` and `web` defaults.

Selecting a profile performs an orderly restart. The new profile becomes the last-known-good choice only after the Host, window, and browser client all start successfully; a failed startup returns to the previous working choice. Official profiles normally use the same DSH home, so sessions, settings, and storage do not need to be migrated. A custom configuration (patch) can deliberately redirect a persistence root, in which case that profile's configuration wins.

Switching profiles does not silently copy plugins from the old profile into the new one. Use an explicit profile in the terminal when preparing another profile, or use the default commands after switching.
```

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/host-process.ts:89-102](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process.ts#L89-L102)

停止和故障恢复需要确认进程退出。

<details>
<summary>查看原文（14行）</summary>

```text
  let stopTask: Promise<void> | undefined
  const stop = (): Promise<void> => stopTask ??= (async () => {
    stopping = true
    if (!exited) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3_000)
      try { await rpc.call('stop', [], controller.signal) } catch { /* terminate an unresponsive Host */ }
      finally { clearTimeout(timeout) }
      if (!exited) child.kill()
      const timeoutExit = new Promise<never>((_resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('DSH Host termination was not confirmed')), 1_000)
        void exit.then(() => clearTimeout(timer))
      })
      await Promise.race([exit, timeoutExit])
```

</details>

#### 缺口

- 同任务完整资源开销、安装时间和恢复成功率
  **影响**：无法比较单位合格任务成本
  **进一步探讨**：用同版本桌面与官方 Web 对照完整任务与恢复成本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得试用、何时退出？

**研究主题**：采用判断

#### 完整回答

已有本地 DSH 经验、愿意先备份且希望减少手动启动步骤的人，可在独立账户和数据根试一项无敏感内容的任务。先核查安装来源、profile、模型授权、网络范围与目录，再核对实际任务结果、退出进程与原数据是否可读。它提供原生窗口、托盘和受管理 Host，实际省时和恢复可靠性尚未测；若 profile 数据归属、备份恢复、Host 退出或权限状态不清，应停止迁移并回到已有 CLI 或官方 Web，保留原备份。局域网访问和更新应仅在明确需要及另行验证时启用。

#### 证据与依据

**依据 1 · 作者声明**：[docs/user-guide.en.md:20-26](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/docs/user-guide.en.md#L20-L26)

profile 切换及自定义数据路径边界。

```text
## Profiles

A profile is a composition of DSH bundles, dependencies, and patches. The tray **Profile** menu lists existing profiles and the lazy `desktop` and `web` defaults.

Selecting a profile performs an orderly restart. The new profile becomes the last-known-good choice only after the Host, window, and browser client all start successfully; a failed startup returns to the previous working choice. Official profiles normally use the same DSH home, so sessions, settings, and storage do not need to be migrated. A custom configuration (patch) can deliberately redirect a persistence root, in which case that profile's configuration wins.

Switching profiles does not silently copy plugins from the old profile into the new one. Use an explicit profile in the terminal when preparing another profile, or use the default commands after switching.
```

**依据 2 · 作者声明**：[docs/user-guide.en.md:36-45](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/docs/user-guide.en.md#L36-L45)

作者描述端口和局域网选项。

<details>
<summary>查看原文（10行）</summary>

````text
## Local Web port

Desktop lets the operating system choose a random local Web port by default (`dsh-desktop.port: 0`), which avoids collisions with other services. Browser `localStorage` is isolated by origin, so UI plugins that store settings there need a fixed port to read the same settings after Desktop restarts:

```yaml
dsh-desktop:
  port: 43189
```

The port must be an integer from `0` through `65535`. Changing it performs an orderly restart. The service binds only to `127.0.0.1` by default; it listens on all network interfaces only after you acknowledge the danger prompt and explicitly allow LAN access in Desktop settings. If another program already uses a fixed port, Desktop cannot start; release that port or change the setting back to `0` or another available port.
````

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/host-process.ts:89-102](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/host-process.ts#L89-L102)

Host 退出需实际确认。

<details>
<summary>查看原文（14行）</summary>

```text
  let stopTask: Promise<void> | undefined
  const stop = (): Promise<void> => stopTask ??= (async () => {
    stopping = true
    if (!exited) {
      const controller = new AbortController()
      const timeout = setTimeout(() => controller.abort(), 3_000)
      try { await rpc.call('stop', [], controller.signal) } catch { /* terminate an unresponsive Host */ }
      finally { clearTimeout(timeout) }
      if (!exited) child.kill()
      const timeoutExit = new Promise<never>((_resolve, reject) => {
        const timer = setTimeout(() => reject(new Error('DSH Host termination was not confirmed')), 1_000)
        void exit.then(() => clearTimeout(timer))
      })
      await Promise.race([exit, timeoutExit])
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop/src/main.ts:1904-1917](https://github.com/anywhere-labs/dsh-desktop/blob/31a96e1750aab260cee87a501e39d78482db3218/dsh-plugin-desktop/src/main.ts#L1904-L1917)

checkpoint 条件及错误处理。

<details>
<summary>查看原文（14行）</summary>

```text
    startupStage = 'renderer-startup'
    lifecycleRecorder.transitionStartupStage(startupStage)
    lifecycleRecorder.startRendererBoot()
    const rendererBoot = runtime.beginRendererBootMonitoring({
      commitHealthy: async () => {
        lifecycleRecorder.finishRendererBoot({ status: 'healthy' }, 'renderer-failed')
        startupStage = 'health-commit'
        lifecycleRecorder.transitionStartupStage(startupStage)
        try {
          profileCheckpoint?.captureHealthy()
        } catch (cause) {
          electronLogger.error(
            `${BIN_NAME}: failed to checkpoint the healthy profile configuration: ${cause instanceof Error ? cause.message : String(cause)}`,
          )
```

</details>

#### 缺口

- 目标平台完整安装、任务、卸载和数据恢复结果
  **影响**：影响是否能持续采用
  **进一步探讨**：使用独立数据根完成可重复验证后再决定迁移

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
