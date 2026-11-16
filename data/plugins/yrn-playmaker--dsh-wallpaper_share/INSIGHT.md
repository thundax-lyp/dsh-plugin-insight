# wallpaper_share

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b40f03d](https://github.com/YRN-playmaker/dsh-wallpaper_share/tree/b40f03dbe69a464429ef7f93084d05ff866ed276)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/YRN-playmaker/dsh-wallpaper_share) [![npm 30d 2,104](https://img.shields.io/static/v1?label=npm+30d&message=2%2C104&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wallpaper_share) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-wallpaper_share)
<!-- END META -->

> **功能**：将 Wallpaper Engine 壁纸同步为 DSH Web/桌面背景并管理壁纸包。

> **亮点**：把已存在的本地壁纸状态转成 DSH 内的背景与展示选择。可选应用库支持下载、校验、寻址和启动，独立于只同步现有可信壁纸的路径。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：本地同步与下载后执行的边界不同。启动器可拒绝缺失或越界入口，哈希也无法替代发布者信任。分离进程的退出需另行核对。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 插件同步什么内容，能解决什么界面任务？](#detail-section-11)
  - [Q02 · 如何发现壁纸并向客户端供给画面/资源？依赖有哪些？](#detail-section-12)
  - [Q03 · 插件、市场包、下载器和可选本机推理有哪些风险？](#detail-section-13)
  - [Q04 · 何种用户值得试用，成本/退出条件如何设定？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向使用 Wallpaper Engine 且偏好个性化 DSH 背景的用户。它读取 WE 当前桌面壁纸状态，把画面/场景呈现在 DSH Web 或桌面界面，并提供渲染模式、透明度、模糊、阴影和壁纸库；代码注释表明该同步不修改桌面壁纸。相较静态主题，它接入实时壁纸源和资源市场，但主要收益是视觉偏好而非对话能力提升。

手工处理或宿主原生能力；没有同条件用户/效果验证，作者比较仅作为项目主张。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 本地壁纸同步 | 在 DSH 显示桌面的现有壁纸 | 依赖可发现的 Windows 壁纸状态和客户端 |
| 显示配置 | 调整模式、分辨率和帧率 | 实际可读性与资源占用需在对应屏幕验证 |
| 应用安装和启动 | 下载解压后识别可执行入口 | 需确认来源，独立进程不随插件退出 |

**流程与依赖**

| 依赖 | 用途 | 缺失或错误时 |
| --- | --- | --- |
| DSH 的 webServer 与客户端 | 供给壁纸状态及设置入口 | 宿主服务缺席时不能沿正常路径使用 |
| Windows 与 Wallpaper Engine | 同步已有桌面壁纸状态 | 未发现 WE 时不保证同步，本地应用另有路径 |
| 目标壁纸的本地资源 | 提供可信静态背景 | 渲染依类型和画面来源而异 |
| 应用下载目录及可选解压器 | 仅限使用扩展启动器 | 留意空间、完整性、入口及来源；纯静态试用不需要 |

| 阶段 | 动作 | 成功或退出条件 |
| --- | --- | --- |
| 准备 | 在测试 profile 只选现有可信静态壁纸 | 先比较默认界面的可读性和空载指标 |
| 同步 | 在 WE 换到测试壁纸并查看 DSH | 确认当前背景和显示器映射 |
| 停用 | 切回默认主题，重载并核对残留 | 若曾启动应用，另确认 detached 进程结束 |

**效果与成本**

| 阶段 | 现金与资源 | 人员工作 |
| --- | --- | --- |
| 首次 | 需要当前机器的 DSH 与本地壁纸 | 检查宿主服务、特定显示器和画面来源 |
| 持续 | 帧率、画布尺寸、前端渲染及可选资源，占用未实测 | 核对文字可读性与监视资源变化 |
| 失败与退出 | 可选下载和解包占用磁盘，后台进程另需管理 | 核对应用和暂存状态，必要时结束进程 |

| 结果 | 固定源码支持 | 仍需验证 |
| --- | --- | --- |
| 桌面壁纸随 DSH 显示 | Host 状态和客户端设置对接 | 各壁纸类型、屏幕与宿主组合的可接受性能 |
| 可选应用库下载安装 | 暂存、检查入口和条件式 SHA-512 校验 | 来源信任、外部程序行为和进程退出 |
| 复原默认主题 | 试用采用回退路径 | 停用后 GPU、进程和各资源是否释放 |

> **思考**：本地同步与下载后执行的边界不同。启动器可拒绝缺失或越界入口，哈希也无法替代发布者信任。分离进程的退出需另行核对。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把已存在的本地壁纸状态转成 DSH 内的背景与展示选择。可选应用库支持下载、校验、寻址和启动，独立于只同步现有可信壁纸的路径。[Q01](#research-q01) [Q02](#research-q02) [Q03](#research-q03)

下载流的长度与状态检查发生在正式目录替换之前，校验失败有暂存清理路径。启动入口再次核对目录与类型，随后把处理交给独立进程，脱离后需要另行核验生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地同步与下载后执行的边界不同。启动器可拒绝缺失或越界入口，哈希也无法替代发布者信任。分离进程的退出需另行核对。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

只在隔离 DSH profile 同步一个可信本地静态壁纸，先限帧率和分辨率，再看文字对比度与资源。若可读性下降或停用后仍有资源活动，切回默认背景并核对相关进程。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交支持入口和核心机制的源码判断；目标宿主、外部服务、用户效果与全周期成本未在本轮运行验证。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、src/client/WallpaperSharePanel.tsx、src/index.ts、src/launcher/installer.ts、src/launcher/routes.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 YRN-playmaker/dsh-wallpaper_share (root) 的固定提交、README/manifest、入口和直接调用的关键模块；未安装或执行目标插件、宿主、浏览器、模型/API或第三方服务。
- 下一步：同一屏幕、同一阅读任务对照默认背景与低帧率同步，记录换图、字迹遮挡、CPU/GPU 及停用后的资源状态。应用启动和下载使用单独测试。

**分析版本**

- **仓库**：[YRN-playmaker/dsh-wallpaper_share](https://github.com/YRN-playmaker/dsh-wallpaper_share)
- **版本号**：26.10.13-D（[固定提交 b40f03d](https://github.com/YRN-playmaker/dsh-wallpaper_share/tree/b40f03dbe69a464429ef7f93084d05ff866ed276)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把画面更新与可读性、CPU/GPU 开销一起采样，以已知场景判断静态降级是否可减少波动并保持用户认可。需要与默认背景进行同一任务对照。[Q04](#research-q04)

同一屏幕、同一阅读任务对照默认背景与低帧率同步，记录换图、字迹遮挡、CPU/GPU 及停用后的资源状态。应用启动和下载使用单独测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 366 | 26245 | 24022 | 1601 | — |
| .ts | source | 98 | 23873 | 19203 | 3680 | — |
| .md | source | 30 | 3091 | — | — | 59171 |
| .js | source | 6 | 38102 | 35064 | 3543 | — |
| .tsx | source | 2 | 2354 | 2084 | 251 | — |
| .ts | test | 31 | 3652 | 3225 | 241 | — |
| .mjs | test | 1 | 96 | 87 | 5 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/YRN-playmaker/dsh-wallpaper_share/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/YRN-playmaker/dsh-wallpaper_share/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/YRN-playmaker/dsh-wallpaper_share/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Wallpaper Engine 当前壁纸和可下载 DWP 包能否在 DSH 界面中可控呈现，并在资源、性能和退出条件下带来可接受的个性化价值？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件同步什么内容，能解决什么界面任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向使用 Wallpaper Engine 且偏好个性化 DSH 背景的用户。它读取 WE 当前桌面壁纸状态，把画面/场景呈现在 DSH Web 或桌面界面，并提供渲染模式、透明度、模糊、阴影和壁纸库；代码注释表明该同步不修改桌面壁纸。相较静态主题，它接入实时壁纸源和资源市场，但主要收益是视觉偏好而非对话能力提升。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:20-22](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/README.zh-CN.md#L20-L22)

作者说明同步用途与不改桌面壁纸的边界。

```text
把 Wallpaper Engine（WE）当前壁纸同步为 DeepSeek Harness（DSH）Web / 桌面端界面的背景，在 `wallpaper_share` 标签页调整渲染模式、透明度、模糊、阴影、专注透镜与壁纸库。本次在独立 Harness `0.1.0-rc.6` 环境完成实际安装与浏览器验证。

同步功能读取 WE 状态，不更改桌面壁纸。安装目录会自动检测；眼动追踪在本机推理，摄像头画面不上传。
```

**依据 2 · 源码核查**：[src/client/WallpaperSharePanel.tsx:4-16](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/client/WallpaperSharePanel.tsx#L4-L16)

客户端面板暴露壁纸状态/开关、显示器、渲染模式与市场/启动器。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * wallpaper_share 会话视图标签页：当前壁纸信息、同步开关、显示器选择、
 * 专注模式、渲染模式，以及透明度 / 模糊 / 阴影三个滑块（即时生效）。
 * 样式类名由 PANEL_CSS 在 apply 阶段注入，不依赖 CSS Modules。
 */
import { useEffect, useRef, useState, type ClipboardEvent } from 'react'
import { store, effectiveVisuals, PLUGIN_VERSION, PLUGIN_REPO_URL, type WeSyncInfo } from './index'
import { startGaze, stopGaze, calibrate, onGazeStatus, hasCalibrationData, type GazeStatus } from './GazeLens.ts'
import { fetchCatalog, fetchInstalled, buildCards, searchCards, collectTags, install, uninstall, type MarketEntry, type MarketCard } from './market-api.ts'
import { fetchInstalled as fetchLauncherInstalled, installApp, uninstallApp, launchApp, isValidHttpUrl, get139Auth, set139Auth, getLauncherRoot, setLauncherRoot, type InstalledApp } from './launcher-api.ts'
import { appsForSub, formatInstalledAt, launcherAppDir, matchLauncherRecord, partitionApps, type AppSub } from './library-model.ts'
import { CONFIDENCE_AUTO, CONFIDENCE_LOW, parseInstallShareText } from './share-parser.ts'
import { bindingFromEvent } from './hotkeys.ts'
```

</details>

**依据 3 · 源码核查**：[src/index.ts:108-123](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L108-L123)

宿主状态包含显示器、预览和 scene 锁定。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: CordisCtx): void {
  const webServer = ctx.get('webServer') as unknown as WebServer | undefined
  if (webServer === undefined) return

  const state = {
    version: 0,
    snapshot: null as Record<string, { file: string }> | null,
    latestMonitor: '',
    monitors: [] as MonitorInfo[],
    previews: {} as Record<string, PreviewInfo>,
    lastError: '',
    weDir: '',
    /** 客户端经 WS ?monitor= 锁定的 scene 显示器 key（'' = 自动跟随最新变化）。
     *  刷新/换壁纸时 syncSceneTarget 必须尊重它，不能悄悄重置为 auto。 */
    sceneLock: '',
  }
```

</details>

#### 缺口

- 没有用户偏好、视觉可读性、CPU/GPU 使用或使用频率测量。
  **影响**：不能证明提升体验
  **进一步探讨**：在目标硬件比较静态主题与壁纸模式的可读性、帧率和负载。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何发现壁纸并向客户端供给画面/资源？依赖有哪些？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host apply 检查 webServer 后发现 Wallpaper Engine 安装目录，维护显示器/壁纸快照并管理预览；客户端控制显示/渲染配置及 DWP 市场。配置含渲染宽高、帧率、质量、渲染模式和市场源；系统依赖 Windows/WE 状态检测、DSH webServer、桌面捕获/场景渲染模块和本地磁盘。不同壁纸类型可能仅支持静态预览或依赖外部渲染器。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:60-90](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L60-L90)

固定渲染参数、市场 catalog、本地 market 目录和工作区配置。

<details>
<summary>查看原文（31行）</summary>

```text
   *  若在 4K 等高刷屏想省 CPU 可下调（会把高分辨率桌面降采样到该尺寸）。参考 renderer 会自行 clamp。 */
  sceneRenderWidth: 1920,
  sceneRenderHeight: 1080,
  /** scene renderer 目标帧率 */
  sceneRenderFps: 30,
  /** JPEG/WebP 帧质量（0..100） */
  sceneRenderQuality: 80,
  /** scene 渲染模式：'auto'（默认：浏览器子集渲染器为主；显式配置 sceneRendererPath 则 external）| 'browser'（强制浏览器子集渲染器）| 'external'（强制外部 renderer 子进程） */
  sceneRenderMode: 'auto',
  /** 粒子发射率缩放（视觉校准项；WE rate 为每秒粒子数，稳态 ≈ rate × lifetime，默认 1） */
  particleRateScale: 1,
  /** 粒子尺寸缩放（视觉校准项，默认 1） */
  particleSizeScale: 1,
  /** 图层效果强度缩放（waterwaves/shake 幅度全局系数；原版参数普遍偏强，默认 0.6） */
  effectStrengthScale: 0.6,
  /** puppet 网格蒙皮渲染（部件按顶点网格渲染；buildMeshCanvas 已与参考 v2 渲染逐像素一致） */
  puppetMeshRender: true,
  /** DWP market 注册表 catalog.json 地址（dwp-registry 构建产物；可换镜像源） */
  dwpMarketCatalogUrl: 'https://raw.githubusercontent.com/YRN-playmaker/dwp-registry/main/data/catalog.json',
  /** DWP market 本地存储目录（installed.json + packages/）；留空 = ~/.dsh-dwp-market */
  dwpMarketDir: '',
  /** 工作区脉搏（workspace-pulse DWP）扫描根目录；留空 = 插件进程工作目录（即当前工作区） */
  workspaceDir: '',
  /** 工作区脉搏改动保留窗口（毫秒；更早的改动从气泡流里淘汰） */
  workspacePulseWindowMs: 90_000,
  /** 工作区脉搏内置包自动入库（首次启动写入市场库，出现在 壁纸库→本地→dwp壁纸；卸载后重启会重装） */
  workspacePulseAutoInstall: true,
  /** 应用启动器安装根（类 WE app 目录：project.json + preview + 软件本体）；留空 = ~/.dsh/storages/we-sync-apps */
  launcherDir: '',
  /** 7z/7za.exe 路径（.7z 包含加密包的解压）；留空 = 自动探测（插件 bin/ → Program Files） */
  launcherSevenZipPath: '',
```

</details>

**依据 2 · 源码核查**：[src/index.ts:108-150](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L108-L150)

Host 依赖 webServer 并检测 WE 安装目录。

<details>
<summary>查看原文（43行）</summary>

```text
export function apply(ctx: CordisCtx): void {
  const webServer = ctx.get('webServer') as unknown as WebServer | undefined
  if (webServer === undefined) return

  const state = {
    version: 0,
    snapshot: null as Record<string, { file: string }> | null,
    latestMonitor: '',
    monitors: [] as MonitorInfo[],
    previews: {} as Record<string, PreviewInfo>,
    lastError: '',
    weDir: '',
    /** 客户端经 WS ?monitor= 锁定的 scene 显示器 key（'' = 自动跟随最新变化）。
     *  刷新/换壁纸时 syncSceneTarget 必须尊重它，不能悄悄重置为 auto。 */
    sceneLock: '',
  }

  /** Scene renderer 编排器（在 detectWeDir 成功后实例化） */
  let sceneAdapter: SceneAdapter | null = null

  /** SceneModel 缓存（key=指纹；避免每次轮询重新解析 scene.pkg） */
  let sceneModelCache: { fp: string; model: SceneModel | null } | null = null

  const disposers: Array<() => void> = []
  ctx.effect(() => () => { for (const d of disposers) d() })

  function normalize(path: string): string {
    return path.replace(/\\/g, '/')
  }

  function detectWeDir(): string | null {
    if (CONFIG.wallpaperEngineDir.trim() !== '') return normalize(CONFIG.wallpaperEngineDir.trim())
    try {
      const out = execFileSync('reg', ['query', 'HKCU\\Software\\WallpaperEngine', '/v', 'installPath'], {
        encoding: 'utf8', windowsHide: true, timeout: 5000,
      })
      const match = /REG_SZ\s+(.+)/.exec(out)
      if (match !== null) {
        const installPath = match[1]
        if (installPath !== undefined) return normalize(installPath.trim()).replace(/\/wallpaper(64|32)\.exe$/i, '')
      }
    } catch { /* 注册表不可用 */ }
    const defaults = [
```

</details>

**依据 3 · 源码核查**：[src/client/WallpaperSharePanel.tsx:4-16](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/client/WallpaperSharePanel.tsx#L4-L16)

UI连接显示器选择、渲染控制及市场/应用管理 API。

<details>
<summary>查看原文（13行）</summary>

```text
/**
 * wallpaper_share 会话视图标签页：当前壁纸信息、同步开关、显示器选择、
 * 专注模式、渲染模式，以及透明度 / 模糊 / 阴影三个滑块（即时生效）。
 * 样式类名由 PANEL_CSS 在 apply 阶段注入，不依赖 CSS Modules。
 */
import { useEffect, useRef, useState, type ClipboardEvent } from 'react'
import { store, effectiveVisuals, PLUGIN_VERSION, PLUGIN_REPO_URL, type WeSyncInfo } from './index'
import { startGaze, stopGaze, calibrate, onGazeStatus, hasCalibrationData, type GazeStatus } from './GazeLens.ts'
import { fetchCatalog, fetchInstalled, buildCards, searchCards, collectTags, install, uninstall, type MarketEntry, type MarketCard } from './market-api.ts'
import { fetchInstalled as fetchLauncherInstalled, installApp, uninstallApp, launchApp, isValidHttpUrl, get139Auth, set139Auth, getLauncherRoot, setLauncherRoot, type InstalledApp } from './launcher-api.ts'
import { appsForSub, formatInstalledAt, launcherAppDir, matchLauncherRecord, partitionApps, type AppSub } from './library-model.ts'
import { CONFIDENCE_AUTO, CONFIDENCE_LOW, parseInstallShareText } from './share-parser.ts'
import { bindingFromEvent } from './hotkeys.ts'
```

</details>

#### 缺口

- 没有真实 WE 实例、桌面捕获设备和不同壁纸类型运行验证。
  **影响**：兼容性和资源开销未知
  **进一步探讨**：逐类检查静态/场景/视频壁纸及断开设备时的降级。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件、市场包、下载器和可选本机推理有哪些风险？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

本地壁纸同步与可选应用安装不是同条路径。启动器将下载流写入同盘暂存目录；非成功状态、非完整 206、缺流、超限、空文件或可比长度不符时拒绝。此路径流式上限 4096 MiB。失败会尝试删临时件；SHA-512 只有调用方提供指纹时才比较。随后在另一暂存目录解压和发现入口，密码或入口错误返回 422，校验后才替换并写索引，最后尽力清除暂存。日志可能记下载 URL，所以不可把带私人参数的链接视为从未落盘。

执行路由按已知应用 ID 查记录，拒绝不存在、非应用或不支持的入口。解析用相对路径、词法目录边界以及可取得时的 realpath 复核；入口可被启动并不证明文件可信。exe 或批处理以 detached 方式启动并 unref，成功响应表示创建过进程路径，不能保证程序完成初始化。停用插件也不能据此推断已启动的 GUI 程序随之退出。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:35-45](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/README.zh-CN.md#L35-L45)

作者说明大文件下载、解压限制以及 DWP 包发布/更新。

<details>
<summary>查看原文（11行）</summary>

```text
### 26.10.13-D 更新 · 日夜壁纸 1.3.2

1. **突破大文件下载限制**：启动器现在支持通过直链、网盘下载超过 4 GB 的大型软件。下载逐块写入磁盘、同步校验，不再把整个文件装进内存；支持 ZIP64 和大压缩包的磁盘解压。当前下载上限为 64 GiB，单层展开上限为 128 GiB，需为下载包和解压文件预留磁盘空间。[详细说明](docs/launcher-large-download.md)。
2. **优化背景与主题冲突**：重新调整壁纸、侧边栏和页面的主题衔接，减少叠加遮罩；浅色主题下文字更清晰，进入、退出及切回对话时保持平滑过渡。
3. **一并更新 DeepSeek 日夜主题**：DWP 1.3.2 带来更丰富的入水、滚轮下潜、水面焦散和二维气泡动画，并细分预览与完整模式。预览模式下，`wallpaper_share` 页面固定使用白天蓝色背景，不随本地时间切换，并采用开销更低的普通气泡；完整模式保留昼夜切换、夜间暖红水体与完整剪影、橙金水花及珊瑚红按钮。上浮气泡经过剪影时显露人物细节并放大至 1.35 倍，常驻气泡最多 12 个，入场临时小泡泡除外。

![DeepSeek 日夜：白天完整模式](docs/images/deepseek-daynight-day.png)

![DeepSeek 日夜：夜间完整模式](docs/images/deepseek-daynight-night.png)

从 [插件 26.10.13-D Release](https://github.com/YRN-playmaker/dsh-wallpaper_share/releases/tag/v26.10.13-D) 安装 `dsh-wallpaper_share-26.10.13-D.tgz`，重启 Harness 后，在壁纸库更新或导入 [日夜 1.3.2](https://github.com/YRN-playmaker/dwp-releases/releases/tag/deepseek-day-night-1.3.2) 并重新挂载。人物、水花素材及声明式效果参数均随 DWP 分发；插件提供通用渲染器。截图由作者提供，界面显示的旧插件版本仅为演示。此次更新 GitHub 发布，不变更 npm 渠道。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:77-90](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L77-L90)

市场 catalog、workspace pulse 和 launcher 目录等可配置路径。

<details>
<summary>查看原文（14行）</summary>

```text
  /** DWP market 注册表 catalog.json 地址（dwp-registry 构建产物；可换镜像源） */
  dwpMarketCatalogUrl: 'https://raw.githubusercontent.com/YRN-playmaker/dwp-registry/main/data/catalog.json',
  /** DWP market 本地存储目录（installed.json + packages/）；留空 = ~/.dsh-dwp-market */
  dwpMarketDir: '',
  /** 工作区脉搏（workspace-pulse DWP）扫描根目录；留空 = 插件进程工作目录（即当前工作区） */
  workspaceDir: '',
  /** 工作区脉搏改动保留窗口（毫秒；更早的改动从气泡流里淘汰） */
  workspacePulseWindowMs: 90_000,
  /** 工作区脉搏内置包自动入库（首次启动写入市场库，出现在 壁纸库→本地→dwp壁纸；卸载后重启会重装） */
  workspacePulseAutoInstall: true,
  /** 应用启动器安装根（类 WE app 目录：project.json + preview + 软件本体）；留空 = ~/.dsh/storages/we-sync-apps */
  launcherDir: '',
  /** 7z/7za.exe 路径（.7z 包含加密包的解压）；留空 = 自动探测（插件 bin/ → Program Files） */
  launcherSevenZipPath: '',
```

</details>

**依据 3 · 源码核查**：[src/client/WallpaperSharePanel.tsx:9-16](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/client/WallpaperSharePanel.tsx#L9-L16)

面板导入眼动和市场/应用启动功能。

```text
import { useEffect, useRef, useState, type ClipboardEvent } from 'react'
import { store, effectiveVisuals, PLUGIN_VERSION, PLUGIN_REPO_URL, type WeSyncInfo } from './index'
import { startGaze, stopGaze, calibrate, onGazeStatus, hasCalibrationData, type GazeStatus } from './GazeLens.ts'
import { fetchCatalog, fetchInstalled, buildCards, searchCards, collectTags, install, uninstall, type MarketEntry, type MarketCard } from './market-api.ts'
import { fetchInstalled as fetchLauncherInstalled, installApp, uninstallApp, launchApp, isValidHttpUrl, get139Auth, set139Auth, getLauncherRoot, setLauncherRoot, type InstalledApp } from './launcher-api.ts'
import { appsForSub, formatInstalledAt, launcherAppDir, matchLauncherRecord, partitionApps, type AppSub } from './library-model.ts'
import { CONFIDENCE_AUTO, CONFIDENCE_LOW, parseInstallShareText } from './share-parser.ts'
import { bindingFromEvent } from './hotkeys.ts'
```

**依据 4 · 源码核查**：[src/launcher/installer.ts:193-208](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/launcher/installer.ts#L193-L208)

入口词法与真实路径包含检查。

<details>
<summary>查看原文（16行）</summary>

```text
export function resolveEntryInside(dir: string, file: string): string {
  const rel = assertSafeRelPath(file)
  if (rel === '' || rel === '.') throw new LauncherError(`入口路径非法: ${file}`)
  const target = join(dir, ...rel.split('/'))
  assertInside(dir, target)
  try {
    const realDir = pathNormalize(realpathSync.native(dir))
    const realTarget = pathNormalize(realpathSync.native(target))
    assertInside(realDir, realTarget)
  } catch (e) {
    // realpath 失败通常意味着入口不存在 —— 交给调用方按"文件不存在"处理；
    // 但"越界"这类判据错误必须原样抛出，不能被吞掉。
    if (e instanceof LauncherError) throw e
  }
  return target.replace(/\\/g, '/')
}
```

</details>

**依据 5 · 源码核查**：[src/launcher/installer.ts:391-453](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/launcher/installer.ts#L391-L453)

拒绝不全、空或超限流并处理暂存失败。

<details>
<summary>查看原文（63行）</summary>

```text
    const cancelBody = async (): Promise<void> => {
      if (res.body && 'cancel' in res.body) await res.body.cancel().catch(() => {})
    }
    if (!res.ok) {
      await cancelBody()
      throw new LauncherError(`下载失败: HTTP ${res.status}`)
    }
    // Range 头解析重试也必须得到完整文件，不能把某一段误装成整个包。
    const contentRange = res.headers.get('content-range')
    if (res.status === 206) {
      const match = /^bytes 0-(\d+)\/(\d+)$/.exec(contentRange ?? '')
      if (!match || Number(match[1]) + 1 !== Number(match[2])) {
        await cancelBody()
        throw new LauncherError('下载响应仅包含部分文件，拒绝安装')
      }
    }
    const cl = res.headers.get('content-length')
    if (cl !== null && cl !== '') {
      const declared = Number(cl)
      if (Number.isFinite(declared) && declared > MAX_DOWNLOAD_BYTES) {
        await cancelBody()
        throw new LauncherError(`文件超过大小上限 (${Math.round(MAX_DOWNLOAD_BYTES / 1048576)} MiB): ${declared}`)
      }
    }
    if (!res.body) throw new LauncherError('下载响应缺少数据流')
    // 放在安装盘上：同盘移动单文件无需再复制 GB 级数据。
    const temp = this.createStagingDir()
    const target = join(temp, 'download.part')
    let size = 0
    const hash = createHash('sha512')
    const source = 'getReader' in res.body
      ? Readable.fromWeb(res.body as import('node:stream/web').ReadableStream<Uint8Array>)
      : Readable.from(res.body)
    const meter = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        size += chunk.length
        if (size > MAX_DOWNLOAD_BYTES) {
          callback(new LauncherError(`文件超过大小上限 (4096 MiB): ${size}`))
          return
        }
        hash.update(chunk)
        callback(null, chunk)
      },
    })
    try {
      await pipeline(source, meter, createWriteStream(target, { flags: 'wx' }))
      if (size === 0) throw new LauncherError('下载内容为空')
      // fetch 自动解压传输编码，压缩传输不能拿压缩长度与解压后字节比较。
      const declared = Number(cl)
      const encoding = res.headers.get('content-encoding')
      if ((!encoding || encoding === 'identity') && cl && Number.isFinite(declared) && size !== declared) {
        throw new LauncherError(`下载不完整: 预期 ${declared} 字节，实际 ${size} 字节`)
      }
      if (res.status === 206 && size !== Number(contentRange!.split('/')[1])) {
        throw new LauncherError('下载不完整: 实收大小与 Content-Range 不符')
      }
    } catch (e) {
      rmSync(temp, { recursive: true, force: true })
      if (e instanceof LauncherError) throw e
      throw new LauncherError(`下载中断: ${fetchCauseText(e)}`)
    }
    const fileName = fileNameFromUrl(url, res.headers.get('content-disposition'))
    return { path: target, fileName, size, sha512: 'sha512-' + hash.digest('base64'),
```

</details>

**依据 6 · 源码核查**：[src/launcher/routes.ts:169-226](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/launcher/routes.ts#L169-L226)

可选校验、暂存提交、错误和清理。

<details>
<summary>查看原文（58行）</summary>

```text
      downloaded = dl
      const fileName = shareFileName ?? dl.fileName
      // 2) 可选完整性校验
      if (integrity !== undefined && dl.sha512 !== integrity) {
        return json(res, 400, { error: '完整性校验失败: sha512 不匹配（包被篡改或损坏）' })
      }
      // 3) 落位：**先在暂存目录里解压 + 校验，全部通过后才原子替换正式目录**
      //    （旧实现是"同 slug 先删旧目录再解压"，于是新包损坏 / 密码错 / 没有入口时，
      //      旧应用连同它目录里的存档一起没了，而索引还留着记录 —— 2026-09-10 复核确认）
      //    标题默认取文件名去扩展名（CoolTool.zip → CoolTool）
      const baseName = fileName.replace(/\.(zip|exe|bat|cmd|7z|rar|tar|gz)$/i, '')
      const name = title ?? baseName
      const slug = installer.slugify(name)
      const dir = installer.appDir(slug)   // slug 越界/非法（如 `..`）在这里就抛错，绝不拼出安装根之外的路径
      const staging = installer.createStagingDir()
      stagingToClean = staging
      // zip 识别：扩展名 / PK 头魔数 / 尾部 EOCD（视频+zip 复合文件，头部是媒体数据）
      // 7z 识别：头部魔数 + 「视频垫底+7z 追加」复合文件的中部签名（返回段偏移，解压只喂 7z 段）
      let files: string[]
      try {
        files = await installer.unpackFile(dl.path, staging, fileName, password)
        // 嵌套包：外层是媒体复合 zip、内层还有 .7z/.zip 安装包 → 逐层解到出现可执行入口
        files = await installer.settleNested(staging, files, password)
      } catch (e) {
        try { rmSync(staging, { recursive: true, force: true }) } catch { /* ignore */ }
        if (e instanceof CryptZipError) {
          // 密码语义错误统一 422 + code，客户端据 code 给针对性提示
          return json(res, 422, { error: e.message, code: e.code })
        }
        throw e
      }
      // 4) 入口探测（仍在暂存目录里）
      const candidates = installer.detectEntryCandidates(files)
      if (candidates.length === 0) {
        try { rmSync(staging, { recursive: true, force: true }) } catch { /* ignore */ }
        return json(res, 422, { error: '包内未找到可执行入口（.exe/.bat/.cmd）', files: files.slice(0, 50) })
      }
      // 5) 封装入库：project.json / 预览写进暂存目录，随后原子替换到正式目录，
      //    **索引在替换成功之后**才写 —— 失败时盘上与索引都保持旧状态
      const rec = installer.finalize({
        url: opts.url, fileName, slug, title: name, dir: staging, commitTo: dir,
        entry: candidates[0]!, size: dl.size, sha512: dl.sha512, previewBytes, previewMime,
      })
      json(res, 200, { ok: true, record: rec, candidates })
    } catch (e) {
      const err = e as Error
      // 安装失败永久落日志（无密码/凭据，只有错误名+消息+栈），供事后诊断——
      // 面板错误条会超时消失，用户常常来不及抄，这里是唯一的完整现场
      try {
        appendFileSync(join(installer.root, '..', 'we-sync-install-errors.log'),
          `[${new Date().toISOString()}] url=${opts.url as string ?? '?'}\n${err.name}: ${err.message}\n${err.stack ?? ''}\n\n`, 'utf8')
      } catch { /* 日志写不进不阻断主流程 */ }
      const msg = e instanceof LauncherError ? e.message : `${err.name}: ${err.message}`
      json(res, e instanceof LauncherError ? 400 : 500, { error: msg })
    } finally {
      // 杀软短暂占用暂存时，清理失败不能覆盖原错误或影响已发出的成功响应。
      try { downloaded?.cleanup() } catch { /* 暂存目录隐藏，不影响已安装应用 */ }
      try { if (stagingToClean) rmSync(stagingToClean, { recursive: true, force: true }) } catch { /* 同上 */ }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:1134-1179](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L1134-L1179)

启动入口校验、分离进程和错误分支。

<details>
<summary>查看原文（46行）</summary>

```text
      if (app === undefined) {
        res.statusCode = 404
        sendJson(res, { error: 'app not found' })
        return
      }
      if (app.type !== 'application' || app.file.trim() === '') {
        res.statusCode = 400
        sendJson(res, { error: '该壁纸没有可启动的可执行文件' })
        return
      }
      // 入口解析 + 防逃逸：交给 installer 的同一套判据（词法解析 `..` + 目录包含 + realpath 复核）。
      // 旧实现是 `normalize(dir + '/' + file).startsWith(dir + '/')` —— 只做字符串前缀比较，
      // project.json 里写 `../outside.exe` 就能通过，用户点"启动"会执行应用目录之外的程序。
      let exe = ''
      try {
        exe = resolveEntryInside(app.dir, app.file)
      } catch (e) {
        res.statusCode = 404
        sendJson(res, { error: e instanceof Error ? e.message : String(e) })
        return
      }
      if (!exists(exe)) {
        res.statusCode = 404
        sendJson(res, { error: '可执行文件不存在: ' + app.file })
        return
      }
      const lower = exe.toLowerCase()
      // 工作目录取 exe 所在文件夹（便携软件常按 cwd 找资源；exe 在根时等价于 app.dir）
      const exeDir = exe.slice(0, exe.lastIndexOf('/'))
      try {
        if (lower.endsWith('.exe')) {
          const child = spawn(exe, [], { cwd: exeDir, detached: true, stdio: 'ignore' })
          child.unref()
        } else if (lower.endsWith('.bat') || lower.endsWith('.cmd')) {
          const child = spawn('cmd.exe', ['/c', exe], { cwd: exeDir, detached: true, stdio: 'ignore', windowsHide: true })
          child.unref()
        } else {
          res.statusCode = 400
          sendJson(res, { error: '不支持的入口类型: ' + app.file })
          return
        }
        sendJson(res, { launched: true, file: app.file, dir: app.dir })
      } catch (e) {
        res.statusCode = 500
        sendJson(res, { error: '启动失败: ' + ((e as Error).message ?? e) })
      }
```

</details>

#### 缺口

- 本轮未审计下载校验、第三方 DWP 包代码/素材和摄像头实际数据流。
  **影响**：使用来源可信的包并限制下载/目录权限
  **进一步探讨**：检查哈希、许可、网络流量和资源占用后再开放市场安装。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种用户值得试用，成本/退出条件如何设定？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

在测试 profile 只同步一个可信的轻量本地静态壁纸，暂不下载市场包、执行应用或启用摄像头功能。与默认静态背景对照文字可读性、浏览器开销与切换延迟。若文字难读、资源大幅升高，或关闭后壁纸仍残留，就停用并重载默认主题。若此前另行启动了任何应用，先用系统进程和该应用的退出方式确认结束，再处理暂存及安装目录，不能将卸载等同于结束进程。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:20-22](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/README.zh-CN.md#L20-L22)

功能边界：同步壁纸但不改桌面设置。

```text
把 Wallpaper Engine（WE）当前壁纸同步为 DeepSeek Harness（DSH）Web / 桌面端界面的背景，在 `wallpaper_share` 标签页调整渲染模式、透明度、模糊、阴影、专注透镜与壁纸库。本次在独立 Harness `0.1.0-rc.6` 环境完成实际安装与浏览器验证。

同步功能读取 WE 状态，不更改桌面壁纸。安装目录会自动检测；眼动追踪在本机推理，摄像头画面不上传。
```

**依据 2 · 源码核查**：[src/index.ts:60-90](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L60-L90)

可配置渲染开销、市场和本地目录。

<details>
<summary>查看原文（31行）</summary>

```text
   *  若在 4K 等高刷屏想省 CPU 可下调（会把高分辨率桌面降采样到该尺寸）。参考 renderer 会自行 clamp。 */
  sceneRenderWidth: 1920,
  sceneRenderHeight: 1080,
  /** scene renderer 目标帧率 */
  sceneRenderFps: 30,
  /** JPEG/WebP 帧质量（0..100） */
  sceneRenderQuality: 80,
  /** scene 渲染模式：'auto'（默认：浏览器子集渲染器为主；显式配置 sceneRendererPath 则 external）| 'browser'（强制浏览器子集渲染器）| 'external'（强制外部 renderer 子进程） */
  sceneRenderMode: 'auto',
  /** 粒子发射率缩放（视觉校准项；WE rate 为每秒粒子数，稳态 ≈ rate × lifetime，默认 1） */
  particleRateScale: 1,
  /** 粒子尺寸缩放（视觉校准项，默认 1） */
  particleSizeScale: 1,
  /** 图层效果强度缩放（waterwaves/shake 幅度全局系数；原版参数普遍偏强，默认 0.6） */
  effectStrengthScale: 0.6,
  /** puppet 网格蒙皮渲染（部件按顶点网格渲染；buildMeshCanvas 已与参考 v2 渲染逐像素一致） */
  puppetMeshRender: true,
  /** DWP market 注册表 catalog.json 地址（dwp-registry 构建产物；可换镜像源） */
  dwpMarketCatalogUrl: 'https://raw.githubusercontent.com/YRN-playmaker/dwp-registry/main/data/catalog.json',
  /** DWP market 本地存储目录（installed.json + packages/）；留空 = ~/.dsh-dwp-market */
  dwpMarketDir: '',
  /** 工作区脉搏（workspace-pulse DWP）扫描根目录；留空 = 插件进程工作目录（即当前工作区） */
  workspaceDir: '',
  /** 工作区脉搏改动保留窗口（毫秒；更早的改动从气泡流里淘汰） */
  workspacePulseWindowMs: 90_000,
  /** 工作区脉搏内置包自动入库（首次启动写入市场库，出现在 壁纸库→本地→dwp壁纸；卸载后重启会重装） */
  workspacePulseAutoInstall: true,
  /** 应用启动器安装根（类 WE app 目录：project.json + preview + 软件本体）；留空 = ~/.dsh/storages/we-sync-apps */
  launcherDir: '',
  /** 7z/7za.exe 路径（.7z 包含加密包的解压）；留空 = 自动探测（插件 bin/ → Program Files） */
  launcherSevenZipPath: '',
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:35-45](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/README.zh-CN.md#L35-L45)

大型 DWP 包下载与磁盘需求说明。

<details>
<summary>查看原文（11行）</summary>

```text
### 26.10.13-D 更新 · 日夜壁纸 1.3.2

1. **突破大文件下载限制**：启动器现在支持通过直链、网盘下载超过 4 GB 的大型软件。下载逐块写入磁盘、同步校验，不再把整个文件装进内存；支持 ZIP64 和大压缩包的磁盘解压。当前下载上限为 64 GiB，单层展开上限为 128 GiB，需为下载包和解压文件预留磁盘空间。[详细说明](docs/launcher-large-download.md)。
2. **优化背景与主题冲突**：重新调整壁纸、侧边栏和页面的主题衔接，减少叠加遮罩；浅色主题下文字更清晰，进入、退出及切回对话时保持平滑过渡。
3. **一并更新 DeepSeek 日夜主题**：DWP 1.3.2 带来更丰富的入水、滚轮下潜、水面焦散和二维气泡动画，并细分预览与完整模式。预览模式下，`wallpaper_share` 页面固定使用白天蓝色背景，不随本地时间切换，并采用开销更低的普通气泡；完整模式保留昼夜切换、夜间暖红水体与完整剪影、橙金水花及珊瑚红按钮。上浮气泡经过剪影时显露人物细节并放大至 1.35 倍，常驻气泡最多 12 个，入场临时小泡泡除外。

![DeepSeek 日夜：白天完整模式](docs/images/deepseek-daynight-day.png)

![DeepSeek 日夜：夜间完整模式](docs/images/deepseek-daynight-night.png)

从 [插件 26.10.13-D Release](https://github.com/YRN-playmaker/dsh-wallpaper_share/releases/tag/v26.10.13-D) 安装 `dsh-wallpaper_share-26.10.13-D.tgz`，重启 Harness 后，在壁纸库更新或导入 [日夜 1.3.2](https://github.com/YRN-playmaker/dwp-releases/releases/tag/deepseek-day-night-1.3.2) 并重新挂载。人物、水花素材及声明式效果参数均随 DWP 分发；插件提供通用渲染器。截图由作者提供，界面显示的旧插件版本仅为演示。此次更新 GitHub 发布，不变更 npm 渠道。
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1160-1179](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/index.ts#L1160-L1179)

已启动应用是独立进程。

<details>
<summary>查看原文（20行）</summary>

```text
      const lower = exe.toLowerCase()
      // 工作目录取 exe 所在文件夹（便携软件常按 cwd 找资源；exe 在根时等价于 app.dir）
      const exeDir = exe.slice(0, exe.lastIndexOf('/'))
      try {
        if (lower.endsWith('.exe')) {
          const child = spawn(exe, [], { cwd: exeDir, detached: true, stdio: 'ignore' })
          child.unref()
        } else if (lower.endsWith('.bat') || lower.endsWith('.cmd')) {
          const child = spawn('cmd.exe', ['/c', exe], { cwd: exeDir, detached: true, stdio: 'ignore', windowsHide: true })
          child.unref()
        } else {
          res.statusCode = 400
          sendJson(res, { error: '不支持的入口类型: ' + app.file })
          return
        }
        sendJson(res, { launched: true, file: app.file, dir: app.dir })
      } catch (e) {
        res.statusCode = 500
        sendJson(res, { error: '启动失败: ' + ((e as Error).message ?? e) })
      }
```

</details>

**依据 5 · 源码核查**：[src/launcher/routes.ts:223-226](https://github.com/YRN-playmaker/dsh-wallpaper_share/blob/b40f03dbe69a464429ef7f93084d05ff866ed276/src/launcher/routes.ts#L223-L226)

暂存清理为尽力执行。

```text
    } finally {
      // 杀软短暂占用暂存时，清理失败不能覆盖原错误或影响已发出的成功响应。
      try { downloaded?.cleanup() } catch { /* 暂存目录隐藏，不影响已安装应用 */ }
      try { if (stagingToClean) rmSync(stagingToClean, { recursive: true, force: true }) } catch { /* 同上 */ }
```

#### 缺口

- 没有目标显卡/显示器下的功耗、帧率和可读性数据。
  **影响**：进行静态/轻量/高分辨率对照，测 CPU/GPU、内存、亮度对比和关闭后资源清理
  **进一步探讨**：超过预设负载即停用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
