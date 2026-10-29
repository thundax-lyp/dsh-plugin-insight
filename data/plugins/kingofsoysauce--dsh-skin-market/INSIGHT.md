# Skin Market

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5267ef6](https://github.com/kingOfSoySauce/dsh-skin-market/tree/5267ef61d48114ca59345c76ad7d50fd6349aa79)

<!-- BEGIN META -->
[![GitHub ★ 276](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=276&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingOfSoySauce/dsh-skin-market) [![npm 30d 10,185](https://img.shields.io/static/v1?label=npm+30d&message=10%2C185&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market)
<!-- END META -->

> **功能**：在 DSH 内集中浏览社区皮肤，并区分包安装、启用、常驻、生效与待重启状态管理生命周期。

> **亮点**：目录结构与目标一致性校验、明确Desktop管理归属、包与启用分离以及未知管理结果的等待策略是可借鉴控制面，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

> **主要限制**：收录与固定target不证明皮肤安全或兼容；安装包、保存选择、loader和真实界面是不同层，reset也只作用目录内管理目标，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

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
  - [Q01 · 皮肤市场相对原生插件管理改变什么，目录可信到哪一层？](#detail-section-11)
  - [Q02 · 安装、启用及未知结果如何接线？](#detail-section-12)
  - [Q03 · 采用与退出恢复要付什么成本，下一步何时值得做？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常换DSH皮肤的用户可集中找固定目标和管理启用集合；好看与兼容仍需实际界面核对，见 [Q01](#research-q01)。

原生插件管理加手工搜索皮肤仓库和配置。市场继承原生安装/启停，增量是固定目标目录、皮肤选择组合、冲突/覆盖与生效反馈。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 目录 | 固定目标浏览与搜索 | 无通用安全/兼容保证 |
| 安装/使用 | 包与启用分步管理 | 宿主负责执行，可能待重启 |
| 未知处理 | 等待并核结果 | 不可重放未知写操作 |
| reset | Web目录内已装皮肤停用 | 非完整profile或Desktop修复 |

**流程与依赖**

| 条件 | 用途 | 不满足时 |
|---|---|---|
| 正确Host/profile | Desktop原生管理或Web CLI | 不以Desktop未知路径退Web |
| 目录与固定target | 包/commit/子目录定位 | 结构通过不等于安全/兼容 |
| 网络、包管理与伴生依赖 | 下载及生命周期执行 | 失败需分类，不盲重装 |
| 配置写权/loader与客户端 | 选择、启停与生效 | 可能被覆盖或需重启 |
| 原状态记录/副本 | 恢复与退出 | reset不是完整profile备份 |

| 阶段 | 动作 | 判据 |
|---|---|---|
| 选择 | 固定Host/profile和目录目标 | 核包/版本/commit/子路径 |
| 安装 | 原生管理器或CLI | 包已装与结果已确认 |
| 使用 | 确认目标和保留皮肤 | 查选择、loader、实际客户端 |
| 等待 | 未知/待重启单独处理 | 不重放安装或启停 |
| 恢复 | 按具体覆盖/包/入口原因处理 | Web reset仅停目录管理目标 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与时间 |
|---|---|---|
| 首次 | 包下载/存储成本未知 | 来源、profile、冲突和重启核对 |
| 持续 | 网络/包缓存未知 | 目录、Host及皮肤版本适配 |
| 故障 | 包与配置遗留未知 | 区分持久选择/loader/界面恢复 |
| 退出 | 不自动撤外部包 | 还原选择、核配置并保留副本 |

| 效果项 | 支持 | 未知 |
|---|---|---|
| 找目标 | 固定目录和安装来源校验 | 外部包安全与兼容 |
| 生效管理 | 包/启用/重启/未知分层 | 全部Host与皮肤实机结果 |
| 排查 | 具体恢复分类 | 误重装减少与人工节时 |

> **思考**：收录与固定target不证明皮肤安全或兼容；安装包、保存选择、loader和真实界面是不同层，reset也只作用目录内管理目标，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：目录结构与目标一致性校验、明确Desktop管理归属、包与启用分离以及未知管理结果的等待策略是可借鉴控制面，见 [Q01](#research-q01) 和 [Q02](#research-q02)。

[Q02](#research-q02) unknown不重放和精确批准比宽泛重试可靠；[Q01](#research-q01) Desktop归属避免错profile。移植需保留宿主真值与配置覆盖限制，不能靠市场自报成功。

<a id="detail-section-5"></a>

### 1.4 主要限制

收录与固定target不证明皮肤安全或兼容；安装包、保存选择、loader和真实界面是不同层，reset也只作用目录内管理目标，见 [Q02](#research-q02) 和 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可恢复profile先试浏览和单皮肤，先记录原集合；安装/启用/重启分别核，结果未知不重放，重要profile不直接reset，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

代表目录及生命周期状态链静态核查，试用单皮肤隔离profile；未运行安装、Desktop、reset或外部目录请求。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/catalog.ts、src/index.ts、src/lifecycle.ts、src/reset.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整根统计，抽读Host/profile分支、目录目标/刷新校验、代表安装/激活、原生管理结果、未知等待和Web reset；未全审下载/媒体/在线更新与每个适配器或皮肤。
- 下一步：在隔离profile比较手动原生流程与市场单皮肤生命周期，注入丢响应、覆盖、伴生失败和重启，逐层核状态及恢复耗时。本轮无运行。

**分析版本**

- **仓库**：[kingOfSoySauce/dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)
- **版本号**：0.1.71（[固定提交 5267ef6](https://github.com/kingOfSoySauce/dsh-skin-market/tree/5267ef61d48114ca59345c76ad7d50fd6349aa79)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

统一呈现换肤跨包/配置/loader/客户端/重启的证据收据，验证能否减少误重装与排查时间；未实现需求未知，见 [Q03](#research-q03)。

在隔离profile比较手动原生流程与市场单皮肤生命周期，注入丢响应、覆盖、伴生失败和重启，逐层核状态及恢复耗时。本轮无运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 43 | 16780 | 16121 | 1104 | — |
| .md | source | 3 | 4099 | — | — | 37312 |
| .mjs | source | 17 | 1456 | 1201 | 146 | — |
| .tsx | source | 3 | 3663 | 3407 | 63 | — |
| .ts | source | 55 | 12139 | 10627 | 697 | — |
| .ts | test | 63 | 16678 | 15227 | 316 | — |
| .tsx | test | 3 | 5243 | 4894 | 36 | — |

</details>

**活跃度**

[![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)

暂未获取：Issue 未关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：皮肤目录到宿主包安装/启用是否可核，结果不明与配置覆盖如何恢复。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 皮肤市场相对原生插件管理改变什么，目录可信到哪一层？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

dsh-skin-market 0.1.71是嵌入DSH设置页的原生插件和皮肤生命周期管理器，另有Web重置CLI，不是皮肤本身。用户原本要找仓库、确认目标、安装并处理入口冲突；此组件集中浏览/搜索与安装、使用、停用、常驻、更新/卸载。底层包管理和Host启停仍继承原生插件管理，增量在面向皮肤的目录目标、单选/常驻组合和生效/待重启反馈，收录、星数和在线截图不能当兼容验收。

目录用schema校验条目、Desktop包名/版本与GitHub完整commit/子目录target一致，远端刷新拒旧时间戳或同时间戳变内容，失败保留当前快照。它保证结构和固定目标一致，不证明维护者代码安全、外部包内容或每个皮肤实际效果；目录更新时间也不是签名审计。依赖正确profile和Host服务，入口明确将官方Desktop交pluginManager而非CLI desktop，未知Desktop路径不退Web，避免修改错目标。Web/Desktop的安装成功与启用成功必须分别核对。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-15](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/package.json#L2-L15)

版本、原生入口和重置CLI。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "dsh-skin-market",
  "version": "0.1.71",
  "description": "Native skin marketplace and lifecycle manager for DeepSeek Harness",
  "homepage": "https://kingofsoysauce.github.io/dsh-skin-market/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/kingOfSoySauce/dsh-skin-market.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "bin": {
    "dsh-skin-market-reset": "lib/reset-cli.js"
  },
```

</details>

**依据 2 · 源码核查**：[README.md:77-96](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/README.md#L77-L96)

安装/使用与固定目标区分。

<details>
<summary>查看原文（20行）</summary>

```text
## 使用皮肤

打开「设置 → 皮肤市场」或 「插件 → dsh-skin-market」

### 从市场安装具体皮肤

可直接安装的 npm 皮肤会使用「安装」或「安装并使用」流程。官方 Desktop 默认先安装，再进入使用确认；取消使用确认时，皮肤包会保留，但不会启用。

标为「需手动安装」的 GitHub 或 monorepo 子目录皮肤，需要把市场提供的完整固定目标交给 Agent，并由你在 Desktop 的「插件 → 添加插件」中确认。不要把完整 commit 或 `&path:/子目录` 改成 `latest`、仓库主分支或另一个包名。

<details>
<summary><strong>点击展开手动皮肤安装流程</strong></summary>

Agent 先只读确认当前 Desktop 版本和其他已启用的皮肤；发现冲突时列出名称，指导你在应用中停用，并核对停用结果后再继续。拿不到启用状态时，应请你提供插件列表或界面状态，不能把“无法确认”当成“没有冲突”。

安装目标使用面板给出的完整固定 spec。GitHub 目标保留完整 commit；monorepo 子包还要保留 `&path:/子目录`，例如 `github:owner/repo#<完整 commit>&path:/packages/skin`。没有 npm 包时，不要把该目标换成包名、`latest` 或仓库主分支。

Agent 每次只指导一项操作，等你反馈后继续：打开「插件 → 添加插件」、粘贴完整目标、确认安装结果、按提示启用，最后按当前版本要求完全退出并重新打开应用。Agent 不代点安装或启用，不执行 Desktop 安装命令，也不修改 profile。界面不支持该目标或安装失败时，先核对原始报错和维护者说明，再决定下一步；依赖伴生包的皮肤须核对完整安装要求。

这些说明不改变市场的 npm 一键安装流程，也不代表所有 GitHub 或子目录皮肤都已完成官方 Desktop 实机验收。
```

</details>

**依据 3 · 源码核查**：[src/catalog.ts:22-55](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/catalog.ts#L22-L55)

结构、版本与完整target校验。

<details>
<summary>查看原文（34行）</summary>

```text
export function validateCatalog(value: unknown): CatalogFile {
  const candidate = decodeCatalogWire(value)

  const ids = new Set<string>()
  const packages = new Set<string>()
  const rows = new Set<string>()
  for (const skin of candidate.skins) {
    if (!validateSkin(skin)) {
      const details = (validateSkin.errors ?? []).map(error => `${error.instancePath || '/'} ${error.message}`).join('; ')
      throw new Error(`invalid skin entry: ${details}`)
    }
    const entry = skin as SkinEntry
    if (entry.install.desktop?.mode === 'managed') {
      if (entry.install.desktop.packageName !== entry.package) {
        throw new Error(`invalid Desktop package name for ${entry.id}: expected ${entry.package}`)
      }
      if (entry.install.desktop.packageVersion !== entry.install.version) {
        throw new Error(`invalid Desktop package version for ${entry.id}: expected ${entry.install.version}`)
      }
    }
    if (!isVersionRange(entry.compatibility.dsh)) throw new Error(`invalid DSH compatibility range for ${entry.id}`)
    for (const adapter of entry.compatibility.adapters ?? []) {
      if (!isVersionRange(adapter.when)) throw new Error(`invalid compatibility adapter range for ${entry.id}: ${adapter.id}`)
    }
    const repo = entry.repo.replace(/^https:\/\/github\.com\//, '').replace(/\/$/, '')
    const expected = githubInstallTarget(repo, entry.install.commit, entry.subpath)
    if (entry.install.target !== expected) throw new Error(`invalid pinned install target for ${entry.id}`)
    for (const companion of entry.install.companions ?? []) {
      const parts = parseGithubTarget(companion.target)
      if (parts === null) throw new Error(`invalid companion target for ${entry.id}: ${companion.package}`)
      if (parts.commit !== companion.commit) throw new Error(`invalid companion commit for ${entry.id}: ${companion.package}`)
      if (companion.target !== githubInstallTarget(parts.repository, companion.commit, parts.subpath)) {
        throw new Error(`invalid companion path for ${entry.id}: ${companion.package}`)
      }
```

</details>

**依据 4 · 源码核查**：[src/catalog.ts:156-177](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/catalog.ts#L156-L177)

远端单调刷新和失败保留。

<details>
<summary>查看原文（22行）</summary>

```text
  private async fetchRemote(): Promise<CatalogSnapshot> {
    this.checkedAt = this.now()
    try {
      const response = await this.fetcher(this.remoteUrl, {
        headers: { accept: 'application/json', 'user-agent': 'dsh-skin-market/remote-catalog' },
        signal: AbortSignal.timeout(12_000),
      })
      if (!response.ok) throw new Error(`remote catalog returned HTTP ${response.status}`)
      const remote = validateCatalog(await response.json())
      const remoteTime = Date.parse(remote.generatedAt)
      const currentTime = Date.parse(this.current.generatedAt)
      if (remoteTime < currentTime) throw new Error('remote catalog is older than the accepted catalog')
      if (remoteTime === currentTime && JSON.stringify(remote.skins) !== JSON.stringify(this.current.skins)) {
        throw new Error('remote catalog changed without a new generatedAt timestamp')
      }
      this.current = remote
      this.source = 'remote'
      this.error = undefined
      atomicWriteJson(cacheFile(this.profileDir), encodeCatalogWire(remote))
    } catch (error) {
      this.error = errorMessage(error)
    }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:64-87](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/index.ts#L64-L87)

官方Desktop归属与Web分支。

<details>
<summary>查看原文（24行）</summary>

```text
    const officialDesktop = desktopProfiles === undefined && (configuredProfile?.toLowerCase() === 'desktop'
      || (configuredProfile === undefined && launchedProfile?.toLowerCase() === 'desktop'))
    // Official Electron Desktop owns its profile through profileContext and
    // pluginManager; its CLI rejects `--profile desktop`. Resolve this branch
    // before the ordinary CLI fallback so actions mutate the visible profile.
    if (officialDesktop) {
      const profile = 'desktop'
      // An official Desktop generation may not expose profileContext.dir until
      // after startup. Never fall back to the Web profile in that case: the
      // canonical Desktop directory is the explicit profile name's directory.
      const profileDir = contextDir !== '' ? contextDir : resolveProfileDir(profile)
      const runner = officialDesktopRunner(() => (readService('pluginManager') as OfficialPluginManagerLike | undefined), runtime, hostContext as unknown as OfficialManagementEvents)
      host.effect(
        () => mountRoutes(host, { profile, profileDir, runner, hostKind: 'desktop', runtime, agents: undefined, connection, configurationOverride }),
        'dsh-skin-market: official Desktop routes',
      )
      return
    }
    if (desktopProfiles === undefined) {
      const profile = configuredProfile ?? launchedProfile ?? 'web'
      const profileDir = configuredProfile === undefined && contextDir !== '' ? contextDir : resolveProfileDir(profile)
      const appExit = readService('appExit') as ((code: number) => void) | undefined
      const restart = appExit === undefined ? undefined : createCliRestartScheduler(appExit)
      host.effect(() => mountRoutes(host, { profile, profileDir, runner: createPluginCliRunner(registryPlan), hostKind: 'dsh', runtime, restart, agents, connection, configurationOverride }), 'dsh-skin-market: routes')
```

</details>

#### 缺口

- 未验证远端目录、全部皮肤与当前Desktop实机。
  **影响**：目录和静态状态机不能替代真实宿主安装与生效验收。
  **进一步探讨**：固定目录和一个测试皮肤，核其目标、包内容、Host/profile及实际界面，不以市场存在判可用。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装、启用及未知结果如何接线？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host选择对应runner挂routes，生命周期操作围绕profile队列；官方Desktop经原生管理器，普通Web走插件CLI。安装包和选择皮肤是两步，取消使用可留下已安装包。代表activate先计算目标与常驻集合、校验保留项批准，再停用未选皮肤、注册/启用所选皮肤及伴生、更新市场状态和restart标记，不把已安装直接等同生效。多皮肤保留是用户确认的组合，不是保证CSS无冲突。

acceptManagement区分applied、restart-required、overridden和indeterminate，未知结果设unresolved并等待；awaitLifecycle十秒后提示waiting仍等原promise，结束再核，不把等待当取消。包请求只有明确failed且未取消/超时才可能修复并重试，源码明确禁止重放unknown结果。精确新包保护放行绑定原失败及包版本，构建批准绑定具体key，不能推导为关闭全局保护或审计所有安装脚本。代码复杂且涉及配置/包/运行态多层，尚未运行不能声称全局事务或重启后一定正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:75-87](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/index.ts#L75-L87)

实际runner入口。

<details>
<summary>查看原文（13行）</summary>

```text
      const runner = officialDesktopRunner(() => (readService('pluginManager') as OfficialPluginManagerLike | undefined), runtime, hostContext as unknown as OfficialManagementEvents)
      host.effect(
        () => mountRoutes(host, { profile, profileDir, runner, hostKind: 'desktop', runtime, agents: undefined, connection, configurationOverride }),
        'dsh-skin-market: official Desktop routes',
      )
      return
    }
    if (desktopProfiles === undefined) {
      const profile = configuredProfile ?? launchedProfile ?? 'web'
      const profileDir = configuredProfile === undefined && contextDir !== '' ? contextDir : resolveProfileDir(profile)
      const appExit = readService('appExit') as ((code: number) => void) | undefined
      const restart = appExit === undefined ? undefined : createCliRestartScheduler(appExit)
      host.effect(() => mountRoutes(host, { profile, profileDir, runner: createPluginCliRunner(registryPlan), hostKind: 'dsh', runtime, restart, agents, connection, configurationOverride }), 'dsh-skin-market: routes')
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:591-601](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/lifecycle.ts#L591-L601)

精确版本放行。

<details>
<summary>查看原文（11行）</summary>

```text
  private applyReleaseAgeApproval(operation: Operation): void {
    const approval = this.pendingReleaseAgeApprovals.get(operation.id)
    if (approval !== undefined) {
      const failed = approval.failedId === undefined ? undefined : this.operations.get(approval.failedId)
      if (approval.context !== this.releaseAgeContext(operation) || failed?.phase !== 'failed'
        || failed.failure?.action !== 'approve-release-age'
        || failed.failure.releaseAgeTarget?.packageName !== approval.target.packageName
        || failed.failure.releaseAgeTarget.version !== approval.target.version) throw new Error('皮肤安装目标或需要放行的版本已变化，请重新操作后确认')
      allowReleaseAgeVersion(this.options.profileDir, approval.target)
      this.pendingReleaseAgeApprovals.delete(operation.id)
      logEvent('info', 'release-age-approved', `已允许 ${approval.target.packageName}@${approval.target.version}`, operation.id)
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:605-616](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/lifecycle.ts#L605-L616)

明确失败才考虑恢复，未知不重放。

<details>
<summary>查看原文（12行）</summary>

```text
  /** Called only for package transactions while holding the profile queue. */
  private async managedPackageCall(attempt: () => Promise<CommandResult>, operation?: Operation, packageName?: string, completePartialInstall = false): Promise<CommandResult> {
    this.checkDeadline(operation)
    this.repairReleaseAgePolicy(operation)
    const baselineName = packageName ?? (operation === undefined ? undefined : this.skin(operation.skinId).package)
    const baseline = baselineName === undefined ? undefined : snapshotInstalledArtifact(this.options.profileDir, baselineName)
    const result = await attempt()
    // A confirmed failed request can have appended a new, shadowed rule.
    // Never repeat a request whose outcome is unknown or was cancelled.
    if (result.management?.application === 'failed'
      && !result.aborted && !result.timedOut && !this.disposed
      && (operation === undefined || this.abortControllers.get(operation.id)?.signal.aborted !== true)) {
```

</details>

**依据 4 · 源码核查**：[src/lifecycle.ts:686-720](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/lifecycle.ts#L686-L720)

原生管理结果及等待状态。

<details>
<summary>查看原文（35行）</summary>

```text
  private acceptManagement(result: CommandResult, operation?: Operation, subject?: SkinEntry): void {
    const managed = result.management
    if (managed?.indeterminate === true) {
      this.unresolvedManager = true
      if (operation !== undefined) this.update(operation, 'waiting', this.waitingReason)
      throw new Error(this.waitingReason)
    }
    if (managed?.application !== undefined && operation !== undefined) {
      // A selection change can involve several native calls. A later applied
      // toggle does not make an earlier restart requirement disappear.
      if (managed.application !== 'applied' || operation.application !== 'restart-required') operation.application = managed.application
      if (managed.application === 'restart-required') operation.restartRequired = true
      if (managed.pendingBuilds !== undefined) this.pendingBuildKeys.set(operation.id, managed.pendingBuilds)
    }
    if (result.exitCode !== 0 || managed?.application === 'overridden') {
      throw new ManagedOperationError(result, officialOperationFailure(result)?.message || result.stderr || result.stdout || '官方插件管理操作未完成', subject?.id)
    }
  }

  private async awaitLifecycle<T>(promise: Promise<T>, operation = this.profileOperation): Promise<T> {
    let delayed = false
    const timer = setTimeout(() => {
      delayed = true
      this.pendingLifecycle.add(promise)
      if (operation !== undefined) this.update(operation, 'waiting', this.waitingReason)
    }, this.options.lifecycleWaitMs ?? 10_000)
    timer.unref?.()
    try {
      const result = await promise
      if (this.disposed) throw new Error('皮肤市场宿主已停止')
      return result
    } finally {
      clearTimeout(timer)
      this.pendingLifecycle.delete(promise)
      if (delayed && operation?.phase === 'waiting' && !this.unresolvedManager && !this.disposed) this.update(operation, 'activating', '宿主启停已结束，正在核对结果')
```

</details>

**依据 5 · 源码核查**：[src/lifecycle.ts:2640-2679](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/lifecycle.ts#L2640-L2679)

保留确认、先停后启及restart记录。

<details>
<summary>查看原文（40行）</summary>

```text
      const invalid = preserved.find(id => id === skin.id || !this.skinById.has(id) || dependencies[this.skin(id).package] === undefined)
      if (invalid !== undefined) throw new Error(`无法保留未安装或不存在的皮肤：${invalid}`)
      const approvals = operation.preservedSkinApprovals ?? {}
      if (preserved.length !== Object.keys(approvals).length || preserved.some(id => approvals[id] === undefined)) throw new Error('保留选择已变化，请重新确认')
      for (const id of preserved) this.assertPreservedSkinApproved(operation, this.skin(id))
    }
    const persistentPinned = pinnedSkinIds(previous)
    const nextPinned = requestedPreserved === undefined ? persistentPinned : persistentPinned.filter(id => preserved.includes(id))
    const next: PersistedMarketState = { ...previous, version: 1, activeSkinId: skin.id, pinnedSkinIds: nextPinned }
    recordActivity(next, skin.id, 'usedAt', operation.startedAt)
    this.reconcileDisabledSkinIds(next, new Set([skin.id, ...preserved]))
    const enabled = this.enabledSkinIds(next)
    const dependencies = readDependencies(this.options.profileDir)
    const installed = this.catalog.filter(item => dependencies[item.package] !== undefined)
    try {
      // Disable the previous ordinary skin before enabling the target. Pinned
      // skins remain part of the enabled union throughout this transition.
      for (const item of installed) {
        if (!enabled.has(item.id)) await this.registerSkin(item, true)
      }
      for (const item of installed) {
        if (enabled.has(item.id)) await this.registerSkin(item, false)
      }
      await this.syncInstalledCompanions(next, true)
      let active: { found: boolean; live: boolean } | undefined
      for (const item of installed) {
        if (!enabled.has(item.id)) await this.setEntryDisabled(item, true)
      }
      for (const item of installed) {
        if (enabled.has(item.id)) {
          await this.setEntryDisabled(item, false)
        }
      }
      active = await this.setEntryDisabled(skin, false)
      await this.syncManagedLoaders(next, true)
      this.recordSelectionRestart(previous, next, skin, operation)
      writeMarketState(this.options.profileDir, next)
      if (next.pendingRestart?.inferredInstalls?.[skin.id] !== undefined) {
        await this.inspectRuntimeStates(true)
        operation.restartRequired = readMarketState(this.options.profileDir).pendingRestart?.skinIds.includes(skin.id) === true
```

</details>

**依据 6 · 源码核查**：[README.md:81-85](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/README.md#L81-L85)

包安装与使用确认分步。

```text
### 从市场安装具体皮肤

可直接安装的 npm 皮肤会使用「安装」或「安装并使用」流程。官方 Desktop 默认先安装，再进入使用确认；取消使用确认时，皮肤包会保留，但不会启用。

标为「需手动安装」的 GitHub 或 monorepo 子目录皮肤，需要把市场提供的完整固定目标交给 Agent，并由你在 Desktop 的「插件 → 添加插件」中确认。不要把完整 commit 或 `&path:/子目录` 改成 `latest`、仓库主分支或另一个包名。
```

#### 缺口

- 真实CLI/Desktop安装、配置覆盖和迟到管理结果未运行验证。
  **影响**：目录和静态状态机不能替代真实宿主安装与生效验收。
  **进一步探讨**：隔离profile模拟包已装但响应丢失、启用被覆盖、待重启和伴生失败，核包/配置/loader/客户端状态，禁止按异常直接再装。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用与退出恢复要付什么成本，下一步何时值得做？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议在可恢复profile先试浏览及一个目标皮肤的安装/使用，记录原启用集合与配置副本；不要以换肤为由批量安装或卸载不相关插件。首次有profile辨别、包来源、版本、冲突和重启核对成本，持续有目录/网络/包缓存、皮肤与Host升级兼容成本，现金和耗时未知。故障可能跨包、持久配置、loader和客户端，等待中不重复提交；先查原生插件页与诊断，再进行明确覆盖修复。

Web reset源码快照manifest/patch/市场状态、仅把目录内已装皮肤注册停用并清active/pinned，失败还原文件；它不卸载包、不是全profile恢复，也不保证不在目录内的第三方皮肤停用。README要求页面坏掉时先停止Web进程再reset，并不能把该CLI当Desktop通用修复。退出可以停用或卸载市场，但外部安装包和其他配置需要分别核，不许把市场状态当唯一真值。

可证伪方向是对一次换肤展示包、配置、运行loader、客户端与重启后的同一证据收据，给出具体缺层而非笼统“未生效”。当前已有多层状态可复用，增量应测是否减少误重复安装和人工排查时间；在丢响应/配置覆盖/重启场景对比当前诊断，若无改善或维护成本更高就停止。尚无真实用户需求或收益证据，不把这个假设计入既有市场能力。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:104-113](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/README.md#L104-L113)

故障先分类，结果确认不重复。

<details>
<summary>查看原文（10行）</summary>

```text
先按市场弹窗或横幅中的具体原因处理。不要因为“已安装”就重复安装，也不要因为某次启用失败就直接卸载整个 profile。

| 情况 | 先做什么 |
| --- | --- |
| 网络或下载超时 | 重试一次；持续失败时复制市场诊断日志，检查 DSH 实际使用的网络和安装源 |
| 已安装但没有生效 | 进入皮肤详情点击「使用」，检查是否显示「待重启」或「未生效」及其原因 |
| 启用/停用被其他配置覆盖 | 按弹窗指出的组件处理；不要反复重装。市场能安全定位覆盖时，会给出明确的修复入口 |
| 安装被新包保护阻止 | 只允许报错中明确指出的那个精确版本，或等待保护期结束；不要关闭全局保护 |
| 操作结果正在确认 | 等待市场核对宿主结果，不要再次点击安装、启用或卸载 |
| 页面因皮肤冲突无法操作 | 停止对应的 DSH Web 进程后，使用下面的 Web 重置命令 |
```

</details>

**依据 2 · 源码核查**：[src/reset.ts:21-26](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/reset.ts#L21-L26)

重置只识别目录已装目标和文件快照。

```text
export function resetManagedSkins(profileDir: string, catalog: SkinEntry[] = loadCatalog().skins): ResetResult {
  const manifestSnapshot = snapshotFile(manifestFile(profileDir))
  const patchSnapshot = snapshotFile(profilePatchFile(profileDir))
  const stateSnapshot = snapshotFile(marketStateFile(profileDir))
  const dependencies = readDependencies(profileDir)
  const installed = catalog.filter(skin => dependencies[skin.package] !== undefined)
```

**依据 3 · 源码核查**：[src/reset.ts:29-62](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/reset.ts#L29-L62)

清市场选择并停用、失败恢复文件。

<details>
<summary>查看原文（34行）</summary>

```text
    const state = readMarketState(profileDir)
    for (const skin of installed) ensureSkinRegistration(profileDir, skin, true)
    const seenCompanions = new Set<string>()
    for (const skin of catalog) {
      for (const companion of skin.install.companions ?? []) {
        if (dependencies[skin.package] !== undefined && dependencies[companion.package] !== undefined) {
          const linked = state.managedCompanions?.[companion.package]
          if (linked === undefined) {
            state.managedCompanions = {
              ...state.managedCompanions,
              [companion.package]: { ownerSkinIds: [skin.id], installedByMarket: false },
            }
          } else if (!linked.ownerSkinIds.includes(skin.id)) {
            linked.ownerSkinIds.push(skin.id)
          }
        }
        if (seenCompanions.has(companion.package) || dependencies[companion.package] === undefined || state.managedCompanions?.[companion.package] === undefined) continue
        seenCompanions.add(companion.package)
        ensureSkinRegistration(profileDir, companionAsSkin(skin, companion), true)
      }
    }
    state.activeSkinId = null
    state.pinnedSkinIds = []
    state.disabledSkinIds = [...new Set([...state.disabledSkinIds, ...installed.map(skin => skin.id)])]
    writeMarketState(profileDir, state)
    return {
      disabledSkinIds: installed.map(skin => skin.id),
      disabledPackages: installed.map(skin => skin.package),
    }
  } catch (error) {
    restoreFile(manifestFile(profileDir), manifestSnapshot)
    restoreFile(profilePatchFile(profileDir), patchSnapshot)
    restoreFile(marketStateFile(profileDir), stateSnapshot)
    throw error
```

</details>

**依据 4 · 源码核查**：[src/lifecycle.ts:686-720](https://github.com/kingOfSoySauce/dsh-skin-market/blob/5267ef61d48114ca59345c76ad7d50fd6349aa79/src/lifecycle.ts#L686-L720)

结果分层可支撑证据收据。

<details>
<summary>查看原文（35行）</summary>

```text
  private acceptManagement(result: CommandResult, operation?: Operation, subject?: SkinEntry): void {
    const managed = result.management
    if (managed?.indeterminate === true) {
      this.unresolvedManager = true
      if (operation !== undefined) this.update(operation, 'waiting', this.waitingReason)
      throw new Error(this.waitingReason)
    }
    if (managed?.application !== undefined && operation !== undefined) {
      // A selection change can involve several native calls. A later applied
      // toggle does not make an earlier restart requirement disappear.
      if (managed.application !== 'applied' || operation.application !== 'restart-required') operation.application = managed.application
      if (managed.application === 'restart-required') operation.restartRequired = true
      if (managed.pendingBuilds !== undefined) this.pendingBuildKeys.set(operation.id, managed.pendingBuilds)
    }
    if (result.exitCode !== 0 || managed?.application === 'overridden') {
      throw new ManagedOperationError(result, officialOperationFailure(result)?.message || result.stderr || result.stdout || '官方插件管理操作未完成', subject?.id)
    }
  }

  private async awaitLifecycle<T>(promise: Promise<T>, operation = this.profileOperation): Promise<T> {
    let delayed = false
    const timer = setTimeout(() => {
      delayed = true
      this.pendingLifecycle.add(promise)
      if (operation !== undefined) this.update(operation, 'waiting', this.waitingReason)
    }, this.options.lifecycleWaitMs ?? 10_000)
    timer.unref?.()
    try {
      const result = await promise
      if (this.disposed) throw new Error('皮肤市场宿主已停止')
      return result
    } finally {
      clearTimeout(timer)
      this.pendingLifecycle.delete(promise)
      if (delayed && operation?.phase === 'waiting' && !this.unresolvedManager && !this.disposed) this.update(operation, 'activating', '宿主启停已结束，正在核对结果')
```

</details>

#### 缺口

- 恢复CLI和多层状态收据未实机对照，兼容维护成本未知。
  **影响**：目录和静态状态机不能替代真实宿主安装与生效验收。
  **进一步探讨**：在备份隔离profile做单皮肤装/启停/重启/重置与故障注入，量化错误重装、恢复时间及遗留配置。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
