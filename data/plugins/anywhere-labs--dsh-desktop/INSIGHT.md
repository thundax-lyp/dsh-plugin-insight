# DSH Desktop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[092e2ec](https://github.com/anywhere-labs/dsh-desktop/tree/092e2ecef750d10db43cedbab8e81fd48c8de38e)

<!-- BEGIN META -->
[![GitHub ★ 33,082](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33%2C082&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anywhere-labs/dsh-desktop)
<!-- END META -->

> **功能**：独立社区Windows/macOS桌面客户端，将固定DeepSeek Harness运行时与窗口、配置及更新组合。

> **亮点**：相对上游dsh web，组织安装运行环境、窗口/托盘、profile与恢复/更新；核心Agent与Web归上游，不能将fork规模计为桌面原创。[Q01](#research-q01)

> **主要限制**：generation局部安全边界和恢复按钮不保证所有路由、启动故障与插件组合；模式替换frame存在DOM兼容成本，真实安装/更新需单独验收。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 它与上游是什么关系，桌面增量是什么？](#detail-section-11)
  - [Q02 · profile与generation怎样避免状态串用？](#detail-section-12)
  - [Q03 · 插件兼容、恢复和更新的承诺到哪里？](#detail-section-13)
  - [Q04 · 怎样可控采用，如何验证桌面价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向不想手管Node/Host启动的Windows/macOS用户；独立社区客户端，根不是普通第三方插件。[Q01](#research-q01)

同一上游版本的dsh web加浏览器/系统终端；保持模型、插件和任务一致比较配置、资源与恢复总负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

|能力|主要用途|使用条件与边界|
|---|---|---|
|桌面封装|固定运行时与窗口|社区项目，无官方背书|
|profile与包管理|目标身份与环境一致|generation引用不能跨切换|
|恢复/更新|故障入口及生命周期|完整签名/回滚未运行验收|

#### 启动与依赖

|依赖或条件|是否必需|用途|缺失或不满足时|
|---|---|---|---|
|Windows/macOS对应发行|桌面必需|安装运行壳|核签名/架构及channel|
|固定runtime兼容插件|插件任务必需|Host/客户端接线|Recovery停用或新profile|
|模型服务/凭据|模型任务必需|推理与工具调用|先隔离配置|
|备份及可恢复数据目录|试用必需|更新迁移恢复|不接入主数据|

#### 启动步骤

|步骤|执行者与成功判据|失败处理|
|---|---|---|
|核发行与新数据目录|用户确认channel/runtime|保留原环境|
|配模型并跑小任务|用户确认profile和结果|查启动/插件状态|
|切换/取消/禁用并恢复|用户检查数据身份与资源|Recovery停用，核副作用后回滚|

**效果与成本**

#### 成本

|阶段|现金与资源|人工与时间|未知|
|---|---|---|---|
|首次|桌面安装包和模型环境|核channel、数据目录、权限|安装与配置时间|
|持续|Electron、本地Host和模型调用|插件适配和备份|资源峰值及净节时|
|失败恢复|更新/迁移及数据锁|核generation、回滚与恢复|恢复成功率和分钟|

#### 效果

|效果项|抽读支持|未知|
|---|---|---|
|环境封装|固定runtime和profile接线|开箱成功及时间|
|状态所有权|generation与数据锁|全调用覆盖及中断恢复|
|生态兼容|公开服务和DOM锚点|真实插件组合表现|

> **思考**：generation局部安全边界和恢复按钮不保证所有路由、启动故障与插件组合；模式替换frame存在DOM兼容成本，真实安装/更新需单独验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对上游dsh web，组织安装运行环境、窗口/托盘、profile与恢复/更新；核心Agent与Web归上游，不能将fork规模计为桌面原创。[Q01](#research-q01)

将profile/包管理身份核对、renderer capability和数据owner锁显式化值得借鉴；复用需保证每个调用边都遵循生命周期，不只是拷贝接口。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

generation局部安全边界和恢复按钮不保证所有路由、启动故障与插件组合；模式替换frame存在DOM兼容成本，真实安装/更新需单独验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在新用户数据目录/可恢复profile试用社区包，核channel/runtime及访问开关，验证启动/切换/禁用恢复后再接主数据。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

抽读支持桌面所有权和访问边界机制；真实安装/平台/更新与生态兼容未验证；诊断收据假设未验证。

- 已检查：作者 README、包清单、源码路径 upstream.json、dsh-plugin-desktop/docs/plugin-services.zh.md、dsh-plugin-desktop/src/desktop-browser-access.ts、dsh-plugin-desktop/src/profile-context.ts、dsh-plugin-desktop/src/desktop-data-operation-lock.ts、dsh-plugin-desktop/src/update-lifecycle.ts、dsh-plugin-desktop/src/desktop-boot-recovery.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：partial clone固定版本抽读上游pin、公开服务、profile context、浏览器gate、data lock、更新与早期恢复脚本；inventory仅子集，未审计完整Electron/安装/签名/vendor/远程功能，未执行。
- 下一步：隔离数据目录测试Windows/macOS安装、切profile、Host退出、插件不兼容、并发数据操作和更新回滚，记录所有权与恢复成本。

**分析版本**

- **仓库**：[anywhere-labs/dsh-desktop](https://github.com/anywhere-labs/dsh-desktop)
- **版本号**：未声明（[固定提交 092e2ec](https://github.com/anywhere-labs/dsh-desktop/tree/092e2ecef750d10db43cedbab8e81fd48c8de38e)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把profile/generation身份及恢复检查点变成用户诊断收据，减少串配置和更新故障排查；对照Web固定故障恢复时间与资源，无改善则否定。[Q04](#research-q04)

隔离数据目录测试Windows/macOS安装、切profile、Host退出、插件不兼容、并发数据操作和更新回滚，记录所有权与恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：根；内容摘要：e7beab16ef0460e50b2da9cf1c5b2afd4ae5fe802cc0aa4c372ca117170bb80b。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 599 | — | — | 8578 |
| .ts | source | 5 | 938 | 824 | 50 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/anywhere-labs/dsh-desktop/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌面封装如何降低运行负担并约束profile、访问与恢复所有权，证据支持到哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它与上游是什么关系，桌面增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是独立社区桌面客户端，主要用户是不想手工管理Node、本地Host窗口和启动命令的Windows/macOS使用者。README明确无官方隶属/背书，继承贡献者历史不能视为上游参与。合格结果是启动固定运行时、选择正确工作配置并可恢复，而不是有窗口就完成Agent任务。upstream.json固定stable/beta的源提交和0.2.1-rc.3运行包，active beta；相对直接浏览器dsh web，贡献是窗口/托盘、运行环境、profile及更新/恢复的桌面组织。核心模型、Agent、会话与Web UI来自上游，不能把fork全仓规模算原创桌面贡献。README“原样运行上游”是作者声明，本项没有独立diff全部vendor和overlay，保留归属边界。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-32](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/README.md#L8-L32)

作者社区身份和封装定位

<details>
<summary>查看原文（25行）</summary>

```text
  <strong>基于 DeepSeek Harness 构建的 Windows 和 macOS 开源桌面客户端。</strong>
</p>

<h3 align="center"><a href="https://dshdesktop.cn">一键下载，开箱即用。</a></h3>

<p align="center">
  万物皆「插件」，桌面本身也是「插件」。
</p>

<p align="center"><sub>独立的社区开源项目，与深度求索不存在隶属、合作、授权或背书关系。<br>本仓库目前无深度求索员工或 DeepSeek Harness 上游官方团队成员参与；GitHub Contributors 中显示的上游贡献者来自 fork 继承和同步的提交历史。<br>中文 · <a href="README.en.md">English</a></sub></p>

<p align="center">
  <img src="assets/desktop-chat-zh.png" alt="DSH Desktop 中文对话界面" width="100%">
</p>

<p align="center">
  <a href="https://github.com/anywhere-labs/deepseek-harness-desktop/releases/latest"><img src="https://img.shields.io/github/v/release/anywhere-labs/deepseek-harness-desktop?style=flat&amp;label=release&amp;color=4D6BFE" alt="Latest release"></a>
  <a href="https://github.com/anywhere-labs/deepseek-harness-desktop/releases"><img src="https://img.shields.io/github/downloads/anywhere-labs/deepseek-harness-desktop/total?style=flat&amp;label=downloads&amp;color=4D6BFE" alt="Total downloads"></a>
  <a href="https://github.com/anywhere-labs/deepseek-harness-desktop"><img src="https://img.shields.io/github/stars/anywhere-labs/deepseek-harness-desktop?style=flat&amp;label=%E2%98%85&amp;color=08C" alt="GitHub stars"></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-2EA44F?style=flat" alt="MIT License"></a>
  <a href="https://discord.gg/TJeGqKRNM"><img src="https://img.shields.io/badge/Discord-5865F2?style=flat&amp;logo=discord&amp;logoColor=white" alt="Join Discord"></a>
  <img src="https://img.shields.io/badge/macOS%20%7C%20Windows-4493F8?style=flat-square" alt="Supported platforms: macOS and Windows">
</p>

DSH Desktop 将 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 的本地 Web UI、Host 服务和插件系统集成到原生桌面应用中。项目固定并原样运行特定上游版本；DSH Desktop 提供窗口、托盘、终端、更新和工作配置，并通过 DeepSeek Harness 提供的插件机制与上游能力组合。
```

</details>

**依据 2 · 作者声明**：[README.md:135-155](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/README.md#L135-L155)

上游能力与社区增量归属

<details>
<summary>查看原文（21行）</summary>

```text
## 与 DeepSeek Harness 的关系

DSH Desktop 是基于 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 和 Cordis 插件思想构建的独立社区项目，旨在提供开放、可组合的 DSH 桌面体验。

本仓库由社区独立维护，目前不存在深度求索员工或 DeepSeek Harness 上游官方团队成员参与本项目开发、维护或治理的情形。GitHub Contributors 页面中可能出现的上游贡献者，来自本仓库 fork 时继承及后续同步的上游提交历史；该署名仅反映提交来源，不代表相关人员参与本仓库，也不构成任何隶属、合作、授权或背书关系。

上游项目提供核心的智能体能力、插件系统和 Web UI；DSH Desktop 主要负责：

- 桌面应用封装
- 本地服务的启动、停止与恢复
- 桌面窗口和系统托盘集成
- macOS、Windows 安装包构建与发布
- 更适合桌面使用的界面体验

如果你希望通过命令行运行 DeepSeek Harness，或者参与其核心功能开发，请优先查看上游仓库。

## 特别感谢

特别感谢 [DeepSeek Harness 原始仓库](https://github.com/deepseek-ai/deepseek-harness) 和 DeepSeek AI 团队。DSH Desktop 基于固定版本的上游源码构建，核心的智能体、模型、工具、会话、Web UI 和插件生态都来自这个项目。

同时感谢 [Cordis](https://github.com/cordiverse/cordis) 项目提供的插件化基础。没有这些开源项目，就不会有 DSH Desktop。
```

</details>

**依据 3 · 源码核查**：[upstream.json:1-20](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/upstream.json#L1-L20)

固定上游commit、运行版本和channel

<details>
<summary>查看原文（20行）</summary>

```text
{
  "repository": "https://github.com/deepseek-ai/deepseek-harness.git",
  "activeChannel": "beta",
  "channels": {
    "stable": {
      "commit": "1f81c047fc48fa190a683e469daa699857e9afe8",
      "sourceVersion": "0.2.1-rc.3",
      "runtimePackageVersion": "0.2.1-rc.3",
      "runtimeSource": "vendor/dsh-runtime/0.2.1-rc.3/manifest.json",
      "package": "dsh-plugin-desktop"
    },
    "beta": {
      "commit": "1f81c047fc48fa190a683e469daa699857e9afe8",
      "sourceVersion": "0.2.1-rc.3",
      "runtimePackageVersion": "0.2.1-rc.3",
      "runtimeSource": "vendor/dsh-runtime/0.2.1-rc.3/manifest.json",
      "package": "dsh-plugin-desktop-beta"
    }
  }
}
```

</details>

#### 缺口

- 安装启动与维护收益没有同条件对照
  **影响**：不能确认开箱体验、插件兼容或恢复收益
  **进一步探讨**：隔离用户数据安装同版本，按Windows/macOS固定任务和故障演练对照上游Web启动，记录失败和总人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · profile与generation怎样避免状态串用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

profile-context在创建boot时检查pnpm activeProfileName/dir/home与prepared一致，不符即抛错；兼容检查解析同一个overlay manifest，包管理配置绑定Electron ABI和实际profile，防加载器/安装器操作不同对象。desktop-browser-access为每Host generation生成32字节随机base64url capability，精确长度及timingSafeEqual校验，renderer token存main/Host内存；普通浏览器只有在启用且无desktop marker时放行。这是区分桌面请求与普通浏览器的机制，不等同所有路由或多用户授权已审计。data-operation-lock用独占创建、owner id/PID及安全文件检查，对已退出owner可恢复，属于跨进程数据变更互斥；只证明此锁的设计，未核查所有写操作都取得lease。值得复用的是明确generation与操作对象所有权，迁移需保留宿主具体生命周期。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop/src/profile-context.ts:28-76](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/profile-context.ts#L28-L76)

profile与安装器身份及ABI接线

<details>
<summary>查看原文（49行）</summary>

```text
/** Keep package operations and subsequent HMR on the launcher's actual Profile. */
export function createDesktopProfileBoot(
  prepared: PreparedDesktopProfile,
  pnpm: DesktopPnpmBootstrap,
  hooks?: DesktopProfileBootHooks,
) {
  const options = prepared.reloadOptions
  if (pnpm.activeProfileName !== options.profileName || pnpm.activeProfileDir !== prepared.profile.dir
    || pnpm.homeDir !== prepared.homeDir) {
    throw new Error('Desktop Profile context and package-manager identity disagree')
  }
  syncDesktopManagedProfileBundles(prepared.profile.dir, {
    market: prepared.market.effective,
    aaEnabled: prepared.aaEnabled,
  })
  const inheritedPath = Object.entries(process.env).find(([key]) => key.toUpperCase() === 'PATH')?.[1]
  const context: ProfileContext = {
    name: options.profileName,
    dir: prepared.profile.dir,
    patchPath: prepared.profile.patchPath,
    installAnchor: desktopInstallAnchor(),
    // Compatibility checks must inspect the same artifact as the module loader,
    // even before pluginPackages exists. Never inspect stale ancestor copies.
    resolvePackageManifest: packageName => findOverlayPackage(packageName, {
      installPackageUrl: pathToFileURL(desktopInstallAnchor()).href,
      profilePackageUrl: pathToFileURL(join(prepared.profile.dir, 'package.json')).href,
    })?.selected.manifestPath,
    cwd: process.cwd(),
    home: prepared.homeDir,
    startedBundles: prepared.profile.layers.map(layer => layer.packageName),
    overlays: structuredClone(prepared.overlays ?? []),
    telemetryDisabledEnv: options.telemetryDisabled,
    packageManager: {
      command: pnpm.appExecutable,
      args: ['--import', pathToFileURL(pnpm.clearEnvironmentPath).href, pnpm.pnpmBinPath,
        ...withDesktopPnpmPolicy([])],
      env: {
        PATH: [pnpm.nodeBinDir, inheritedPath].filter(Boolean).join(delimiter),
        NODE: pnpm.nodeShimPath,
        ELECTRON_RUN_AS_NODE: '1',
        DSH_HOME: prepared.homeDir,
        CI: 'true',
        npm_config_runtime: 'electron',
        npm_config_target: pnpm.electronVersion,
        npm_config_disturl: 'https://electronjs.org/headers',
      },
    },
    // The pinned app-boot patch delegates both manager operations and HMR here.
    // CLI reconstruction would drop Desktop shell/platform overrides and bypass
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop/src/desktop-browser-access.ts:31-57](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/desktop-browser-access.ts#L31-L57)

generation随机capability

<details>
<summary>查看原文（27行）</summary>

```text

/** Create one unpredictable renderer capability for a Desktop Host generation. */
export function createDesktopBrowserAccess(
  ordinaryBrowserEnabled: boolean,
  token: string = randomBytes(ACCESS_TOKEN_BYTES).toString('base64url'),
): DesktopBrowserAccess {
  if (typeof ordinaryBrowserEnabled !== 'boolean') {
    throw new TypeError('dsh-plugin-desktop: ordinary browser access must be a boolean')
  }
  if (!ACCESS_TOKEN_PATTERN.test(token)) {
    throw new TypeError('dsh-plugin-desktop: renderer access token must be 32 base64url bytes')
  }
  let enabled = ordinaryBrowserEnabled
  return Object.freeze({
    get ordinaryBrowserEnabled() { return enabled },
    rendererHeader: Object.freeze({
      name: DESKTOP_RENDERER_ACCESS_HEADER,
      value: token,
    }),
    setOrdinaryBrowserEnabled(next: boolean) {
      if (typeof next !== 'boolean') {
        throw new TypeError('dsh-plugin-desktop: ordinary browser access must be a boolean')
      }
      enabled = next
    },
  })
}
```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/desktop-browser-access.ts:65-92](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/desktop-browser-access.ts#L65-L92)

恒时比较与普通浏览器门

<details>
<summary>查看原文（28行）</summary>

```text
  if (actual === undefined || !ACCESS_TOKEN_PATTERN.test(actual) || actual.length !== expected.length) return false
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected))
}

/** Whether an uncredentialed URL is attempting to activate Desktop-only client effects. */
export function desktopBrowserUrlHasRendererMarkers(rawUrl: string | undefined): boolean {
  let url: URL
  try {
    url = new URL(rawUrl ?? '/', 'http://dsh.invalid')
  } catch {
    return true
  }
  return [...url.searchParams.keys()].some(key => key.startsWith(DESKTOP_MARKER_PREFIX))
}

/** Classify one HTTP or upgrade request without exposing the renderer token. */
export function decideDesktopBrowserAccess(
  access: DesktopBrowserAccess,
  request: { readonly headers: IncomingHttpHeaders; readonly url?: string | undefined },
): DesktopBrowserAccessDecision {
  if (sameToken(exactHeaderValue(request.headers), access.rendererHeader.value)) return 'renderer'
  if (!access.ordinaryBrowserEnabled || desktopBrowserUrlHasRendererMarkers(request.url)) return 'denied'
  return 'browser'
}

declare module '@deepseek-ai/cordis' {
  interface Context {
    /** Launcher-owned request gate present only in a Desktop Host generation. */
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop/src/desktop-data-operation-lock.ts:52-118](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/desktop-data-operation-lock.ts#L52-L118)

安全owner锁和死进程恢复

<details>
<summary>查看原文（67行）</summary>

```text
  const info = lstatSync(path)
  if (!info.isFile() || info.isSymbolicLink() || info.size > MAX_LOCK_BYTES) {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation lock is unsafe')
  }
  let value: unknown
  try {
    value = JSON.parse(readFileSync(path, 'utf8')) as unknown
  } catch {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation lock is invalid')
  }
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation lock is invalid')
  }
  const row = value as Record<string, unknown>
  if (Object.keys(row).sort().join(',') !== 'createdAt,id,operation,pid'
    || typeof row.id !== 'string' || typeof row.operation !== 'string'
    || !Number.isSafeInteger(row.pid) || (row.pid as number) <= 0
    || typeof row.createdAt !== 'string') {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation lock is invalid')
  }
  return {
    id: row.id,
    pid: row.pid as number,
    operation: row.operation,
    createdAt: row.createdAt,
  }
}

function prepareDirectory(path: string): void {
  mkdirSync(path, { recursive: true, mode: DIRECTORY_MODE })
  const info = lstatSync(path)
  if (!info.isDirectory() || info.isSymbolicLink()) {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation lock directory is unsafe')
  }
  if (process.platform !== 'win32') chmodSync(path, DIRECTORY_MODE)
}

/** Acquire one owner-record lock, recovering a record whose process no longer exists. */
export function acquireDesktopDataOperationLock(
  userDataDir: string,
  operation: string,
): DesktopDataOperationLease {
  if (operation.length === 0 || operation.length > 128 || operation.includes('\0')) {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation name is invalid')
  }
  const path = desktopDataOperationLockPath(userDataDir)
  prepareDirectory(dirname(path))
  const id = randomUUID()
  const record: LockRecord = {
    id,
    pid: process.pid,
    operation,
    createdAt: new Date().toISOString(),
  }
  const bytes = Buffer.from(`${JSON.stringify(record)}\n`, 'utf8')
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let descriptor: number
    try {
      descriptor = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, FILE_MODE)
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code !== 'EEXIST') throw cause
      const owner = readRecord(path)
      if (attempt === 0 && !processExists(owner.pid)) {
        unlinkSync(path)
        continue
      }
      throw new DesktopDataDirectoryError('busy', `Desktop data is busy with ${owner.operation}`)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件兼容、恢复和更新的承诺到哪里？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

服务文档将desktopProfiles.current固定在generation，切换profile/模式dispose旧generation，引用不能跨界；renderer只拿不可变desktopWindow几何，不开放原始Electron/IPC。extended/advanced替换上游frame，旧插件依赖CSS类可能静默失效，必须按稳定锚点与公开slot适配；“可组合”不等于所有插件无干扰。boot recovery辅助脚本识别Failed to load plugins并提供同源POST进入Recovery Mode，靠DOM标题匹配，不能保证所有启动失败都有入口。update lifecycle持有poll/request/download controller与disposeTask，体现生命周期收束，但本项未核验签名下载、完整回滚和平台安装链。模型/网络/凭据仍由上游任务及第三方插件使用，桌面包装不能证明更安全或完全离线。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugin-desktop/docs/plugin-services.zh.md:42-46](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/docs/plugin-services.zh.md#L42-L46)

generation与renderer边界

```text

Launcher 会在 Loader tree 挂载前解析一个 profile。`desktopProfiles.current` 在整个 Cordis generation dispose 前保持不变。`desktop-pnpm` Host row 会根据 launcher 私有 fact 与上游 subprocess service 构造 `desktopPnpm`。切换 profile 或模式会 dispose 当前 generation 并启动新 generation；service reference 不能跨越该边界。

Renderer 通过现有 loopback carrier 接收普通 Web Client module，无法直接读取这些 Host service；DSH Desktop 也不会为它们增加 preload 或 Electron IPC bridge。Desktop Client 会改为在自己的 Cordis fiber 生命周期内，通过 `desktopWindow` 提供不可变的原生布局信息。包含浏览器 UI 的插件继续使用普通 DSH Host route、RPC、client metadata、service 与 slot。

```

**依据 2 · 作者声明**：[dsh-plugin-desktop/docs/plugin-services.zh.md:99-114](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/docs/plugin-services.zh.md#L99-L114)

外壳DOM兼容限制

<details>
<summary>查看原文（16行）</summary>

```text

extended 与 advanced 模式用 Desktop 自有 root 替换上游 Web frame，因此这两种模式下 `@deepseek-ai/dsh-client-ui-layout` **不在**客户端 boot 图中，它的 CSS module 类名一个都不会出现在 DOM 里。若插件靠查询上游列的类名来定位外壳区域，就会既查不到、也挂不上，而且没有任何可观测的报错。为此 Desktop 在每个外壳区域上都带一个稳定锚点；受支持的契约是这些锚点，而不是类名：

| 区域 | 锚点 | 上游 Web frame 是否也发出 |
| --- | --- | --- |
| 侧边栏列 | `[data-pane="sidebar"]` | 否 |
| 侧边栏列，兼容别名 | `.dshDesktop_sidebarCol` | `<hash>_sidebarCol` |
| 右栏列 | `[data-rightbar-col]` | 是 |
| 外壳 overlay 层 | `[data-shell-overlay]` | 是 |

侧边栏锚点位于直接包裹 `sidebar` slot 的那个元素上，与上游列所处的位置一致，因此从锚点出发的 `element.querySelector` 在两套外壳里会到达同一批后代。`dshDesktop_sidebarCol` 不挂任何样式，它存在的唯一目的是让按上游 Web 列编写的选择器——通常是 `[data-pane="sidebar"], [class*="sidebarCol"]`——在 Desktop 下原样生效。对主题而言这有一个连带后果：针对 `[class*="sidebarCol"]` 的样式表现在会同时作用于 Desktop 和 Web。

锚点名称是稳定的，其周围的结构不是。请先查询锚点，再在其内部检索。不要依赖 Desktop 的表现类（`dshDesktopSidebarSurface`、`dshDesktopUpstreamSidebar` 及其同级）、元素标签名或嵌套深度——它们都会随模式、平台和版本变化。compatibility 模式原样运行上游客户端并保留上游 frame，包括上游自己的锚点。

## 公开 Host Cordis service

```

</details>

**依据 3 · 源码核查**：[dsh-plugin-desktop/src/desktop-boot-recovery.ts:86-124](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/desktop-boot-recovery.ts#L86-L124)

错误页识别与恢复请求

<details>
<summary>查看原文（39行）</summary>

```text
  const element = (tag, attributes, content) => {
    const node = document.createElement(tag);
    for (const [name, value] of Object.entries(attributes || {})) {
      if (name === 'dataset') Object.assign(node.dataset, value);
      else node.setAttribute(name, value);
    }
    if (content !== undefined) node.textContent = content;
    return node;
  };
  const attach = () => {
    const root = document.querySelector('[data-dsh-boot]');
    if (!root || root.querySelector('[data-dsh-desktop-recovery]')) return;
    const title = [...root.querySelectorAll('div')].find((node) =>
      node.childElementCount === 0 && node.textContent?.trim() === 'Failed to load plugins'
    );
    const report = title?.parentElement;
    if (!report) return;
    const panel = element('section', {
      'aria-label': label,
      dataset: { dshDesktopRecovery: '' },
    });
    const button = element('button', { type: 'button', 'aria-label': label }, label);
    button.addEventListener('click', async () => {
      button.disabled = true;
      try {
        const response = await fetch(endpoint, request);
        if (!response.ok) throw new Error('Desktop recovery request failed');
      } catch {
        button.disabled = false;
      }
    });
    panel.append(element('p', {}, description), button);
    report.append(panel);
  };
  new MutationObserver(attach).observe(document.documentElement, { childList: true, subtree: true });
  attach();
})();`

/** Backwards-compatible names retained for downstream tests and embedders. */
```

</details>

**依据 4 · 源码核查**：[dsh-plugin-desktop/src/update-lifecycle.ts:65-110](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/update-lifecycle.ts#L65-L110)

更新generation owner及释放入口

<details>
<summary>查看原文（46行）</summary>

```text
class DesktopUpdateLifecycleOwner implements DesktopUpdateLifecycle {
  private disposed = false
  private disposeTask: Promise<void> | undefined
  private checking = false
  private availableVersion: string | undefined
  private downloadingVersion: string | undefined
  private state: UpdateStateV3 = EMPTY_STATE
  private pollTimer: ReturnType<typeof setTimeout> | undefined
  private requestTimer: ReturnType<typeof setTimeout> | undefined
  private requestController: AbortController | undefined
  private downloadController: AbortController | undefined
  private checkTask: Promise<UpdateCheckResult | null> | undefined
  private checkChannel: DesktopReleaseChannel | undefined
  private manualTask: Promise<void> | undefined
  private downloadTask: Promise<void> | undefined
  private readonly stateReady: Promise<void>
  private readonly registration: DesktopTrayItemRegistration
  private readonly stableRegistration: DesktopTrayItemRegistration | undefined

  constructor(private readonly options: DesktopUpdateLifecycleOptions) {
    this.stateReady = this.loadState()
    this.registration = options.registerTrayItem({
      id: 'check-for-updates',
      group: 'status',
      order: 10,
      label: () => this.trayLabel(),
      invoke: () => this.checkNow(),
    })
    this.stableRegistration = options.adapter.releaseChannel === 'beta'
      ? options.registerTrayItem({
          group: 'status',
          order: 11,
          label: () => desktopTrayLabel(options.locale(), 'installStable'),
          invoke: () => this.installStable(),
        })
      : undefined
    if (options.adapter.isPackaged && options.policy.enabled) {
      this.scheduleBackgroundCheck(options.policy.initialDelayMs)
    }
  }

  dispose(): Promise<void> {
    if (this.disposeTask !== undefined) return this.disposeTask
    this.disposed = true
    if (this.pollTimer !== undefined) clearTimeout(this.pollTimer)
    if (this.requestTimer !== undefined) clearTimeout(this.requestTimer)
```

</details>

#### 缺口

- 完整插件加载/失败恢复、更新签名及平台迁移未验收
  **影响**：不能确认开箱体验、插件兼容或恢复收益
  **进一步探讨**：隔离用户数据安装同版本，按Windows/macOS固定任务和故障演练对照上游Web启动，记录失败和总人工时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样可控采用，如何验证桌面价值？

**研究主题**：效果与总成本、依赖、兼容与流程、采用判断、新假设与验证

#### 完整回答

建议在新用户数据目录或可恢复profile中试用该社区项目的发布包，先核对channel、固定runtime、模型连接和普通浏览器开关；不要直接把主profile交给未经验证的迁移。首次减少手工环境操作的路径明确，但仍有安装包信任、模型/权限配置与学习成本；持续承担Electron资源、模型调用和插件适配，失败恢复包含退出旧generation、备份和更新/数据目录互斥，实际内存、节时与恢复率未知。未验证假设是把profile/generation身份和恢复检查点作为用户可见诊断收据，可减少“切错profile、旧引用、更新后不知状态”的排查时间。最小对照用上游Web与桌面相同模型/插件任务，加入包不兼容、Host退出、双进程数据操作和切profile中断，测正确启动率、泄漏/串profile、恢复分钟和资源占用。若只是换窗口而恢复/配置时间不降，否定净减负主张；不把未来诊断收据计为现有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugin-desktop/src/profile-context.ts:28-76](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/profile-context.ts#L28-L76)

对象身份核对构成诊断假设依据

<details>
<summary>查看原文（49行）</summary>

```text
/** Keep package operations and subsequent HMR on the launcher's actual Profile. */
export function createDesktopProfileBoot(
  prepared: PreparedDesktopProfile,
  pnpm: DesktopPnpmBootstrap,
  hooks?: DesktopProfileBootHooks,
) {
  const options = prepared.reloadOptions
  if (pnpm.activeProfileName !== options.profileName || pnpm.activeProfileDir !== prepared.profile.dir
    || pnpm.homeDir !== prepared.homeDir) {
    throw new Error('Desktop Profile context and package-manager identity disagree')
  }
  syncDesktopManagedProfileBundles(prepared.profile.dir, {
    market: prepared.market.effective,
    aaEnabled: prepared.aaEnabled,
  })
  const inheritedPath = Object.entries(process.env).find(([key]) => key.toUpperCase() === 'PATH')?.[1]
  const context: ProfileContext = {
    name: options.profileName,
    dir: prepared.profile.dir,
    patchPath: prepared.profile.patchPath,
    installAnchor: desktopInstallAnchor(),
    // Compatibility checks must inspect the same artifact as the module loader,
    // even before pluginPackages exists. Never inspect stale ancestor copies.
    resolvePackageManifest: packageName => findOverlayPackage(packageName, {
      installPackageUrl: pathToFileURL(desktopInstallAnchor()).href,
      profilePackageUrl: pathToFileURL(join(prepared.profile.dir, 'package.json')).href,
    })?.selected.manifestPath,
    cwd: process.cwd(),
    home: prepared.homeDir,
    startedBundles: prepared.profile.layers.map(layer => layer.packageName),
    overlays: structuredClone(prepared.overlays ?? []),
    telemetryDisabledEnv: options.telemetryDisabled,
    packageManager: {
      command: pnpm.appExecutable,
      args: ['--import', pathToFileURL(pnpm.clearEnvironmentPath).href, pnpm.pnpmBinPath,
        ...withDesktopPnpmPolicy([])],
      env: {
        PATH: [pnpm.nodeBinDir, inheritedPath].filter(Boolean).join(delimiter),
        NODE: pnpm.nodeShimPath,
        ELECTRON_RUN_AS_NODE: '1',
        DSH_HOME: prepared.homeDir,
        CI: 'true',
        npm_config_runtime: 'electron',
        npm_config_target: pnpm.electronVersion,
        npm_config_disturl: 'https://electronjs.org/headers',
      },
    },
    // The pinned app-boot patch delegates both manager operations and HMR here.
    // CLI reconstruction would drop Desktop shell/platform overrides and bypass
```

</details>

**依据 2 · 源码核查**：[dsh-plugin-desktop/src/desktop-data-operation-lock.ts:90-118](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/dsh-plugin-desktop/src/desktop-data-operation-lock.ts#L90-L118)

互斥和恢复需可观察

<details>
<summary>查看原文（29行）</summary>

```text
export function acquireDesktopDataOperationLock(
  userDataDir: string,
  operation: string,
): DesktopDataOperationLease {
  if (operation.length === 0 || operation.length > 128 || operation.includes('\0')) {
    throw new DesktopDataDirectoryError('busy', 'Desktop data operation name is invalid')
  }
  const path = desktopDataOperationLockPath(userDataDir)
  prepareDirectory(dirname(path))
  const id = randomUUID()
  const record: LockRecord = {
    id,
    pid: process.pid,
    operation,
    createdAt: new Date().toISOString(),
  }
  const bytes = Buffer.from(`${JSON.stringify(record)}\n`, 'utf8')
  for (let attempt = 0; attempt < 2; attempt += 1) {
    let descriptor: number
    try {
      descriptor = openSync(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL, FILE_MODE)
    } catch (cause) {
      if ((cause as NodeJS.ErrnoException).code !== 'EEXIST') throw cause
      const owner = readRecord(path)
      if (attempt === 0 && !processExists(owner.pid)) {
        unlinkSync(path)
        continue
      }
      throw new DesktopDataDirectoryError('busy', `Desktop data is busy with ${owner.operation}`)
```

</details>

**依据 3 · 作者声明**：[README.md:32-43](https://github.com/anywhere-labs/dsh-desktop/blob/092e2ecef750d10db43cedbab8e81fd48c8de38e/README.md#L32-L43)

作者用户安装路径

<details>
<summary>查看原文（12行）</summary>

```text
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

#### 缺口

- 诊断收据和桌面/Web总成本对照尚无结果
  **影响**：不能确认开箱体验、插件兼容或恢复收益
  **进一步探讨**：隔离用户数据安装同版本，按Windows/macOS固定任务和故障演练对照上游Web启动，记录失败和总人工时间

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
