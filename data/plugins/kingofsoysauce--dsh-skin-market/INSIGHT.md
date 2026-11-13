# DSH 皮肤市场

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[76ac3c8](https://github.com/kingOfSoySauce/dsh-skin-market/tree/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73)

<!-- BEGIN META -->
[![GitHub ★ 328](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=328&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingOfSoySauce/dsh-skin-market) [![npm 30d 18,604](https://img.shields.io/static/v1?label=npm+30d&message=18%2C604&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market)
<!-- END META -->

> **功能**：在 DSH 设置中浏览和管理皮肤，提供安装、启停、更新及故障诊断入口。

> **亮点**：把目录的固定目标与相应宿主的安装及启用操作接起来。无法确认的变更保留请求状态，配置覆盖和失效旧依赖各有明确诊断路径。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

> **主要限制**：固定版本只限定包来源。外部皮肤代码、实际渲染和回退仍需分别核对，共享补丁修改还可能影响其他 profile。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

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
  - [Q01 · 市场如何把找皮肤变成可核对的安装目标？](#detail-section-11)
  - [Q02 · 为什么管理器的结果不等同于皮肤已显示？](#detail-section-12)
  - [Q03 · 共享开关覆盖为何需要与 profile 修复分开确认？](#detail-section-13)
  - [Q04 · 市场自更新与失效依赖修复分别改什么？](#detail-section-14)
  - [Q05 · 用户应以什么试用，收据如何降低误重装？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想换用 DSH 皮肤并核对来源、实际启用与回退的用户，可从宿主设置进入同一管理流程。见 [Q01](#research-q01)。

手动安装要先核对来源、profile 与版本，再到对应宿主管理页面确认启用。市场集中目录和状态，仍由宿主完成实际加载。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 固定来源目录 | 找到可核对的皮肤版本 | 目录校验不验证外部代码行为 |
| 安装和启停 | 按宿主 profile 管理皮肤 | 未决或需重启时继续核对 |
| 共享配置修复 | 定向移除遮蔽启停的开关 | 唯一可信目标且重新确认计划 |
| 失效依赖诊断 | 找出阻止安装的旧 Git 依赖 | 写入前停用宿主，恢复须核实际启动 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH WebServer、Loader 和客户端原语 | 对应市场入口需要 | 注册宿主及设置能力 | 缺失能力时入口无法加载 |
| 实际 profile 和宿主管理器 | 安装启用需要 | 在用户当前环境操作 | 核对宿主及可用安装计划 |
| 精确 npm 版本或固定 Git 目标 | 安装目标需要 | 约束外部产物 | 校验失败时停止，必要时转手工 |
| 可识别的共享补丁 | 共享覆盖修复时需要 | 明确跨 profile 开关 | 层级或目标有歧义时拒绝修复 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 找目标 | 用户在隔离 profile 选择已审阅皮肤 | 包名、精确版本与宿主相符 |
| 安装 | 由市场选择相应宿主管理路径 | 核回执及实际安装来源 |
| 启用 | 用户确认并按需要重启 | 同时核 loader 和实际视觉 |
| 回退 | 停用皮肤或恢复原主题 | 有未知结果时先等回读，再决定是否调整 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包下载和测试 profile | 核包身份、外观及键盘焦点 | 用量和时间未测 |
| 持续使用 | 更新、浏览器渲染及可能的重启 | 排查兼容与皮肤叠加 | 性能与视觉收益未测 |
| 失败恢复 | 本地备份及 pnpm 重新解析 | 核未决回执、包状态和实际界面 | 恢复成本取决于外部依赖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 安装目标 | 精确版本、提交及子路径校验 | 外部包行为和实际可用性 |
| 生命周期 | 区分已应用、待重启、失败及未知 | 真实界面是否生效 |
| 恢复 | 共享配置和失效旧依赖可定向诊断 | 各宿主上的完整恢复率 |

单位任务按一次完成安装、启用及回退验收的换肤计算，人工时间和运行资源分开记录。

> **思考**：固定版本只限定包来源。外部皮肤代码、实际渲染和回退仍需分别核对，共享补丁修改还可能影响其他 profile。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把目录的固定目标与相应宿主的安装及启用操作接起来。无法确认的变更保留请求状态，配置覆盖和失效旧依赖各有明确诊断路径。见 [Q01](#research-q01)、[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

宿主结果与本地恢复策略独立。共享配置修复重查文件身份，并保留有权限限制的备份。旧依赖修复先诊断，失败时恢复包清单和锁文件。

<a id="detail-section-5"></a>

### 1.4 主要限制

固定版本只限定包来源。外部皮肤代码、实际渲染和回退仍需分别核对，共享补丁修改还可能影响其他 profile。见 [Q02](#research-q02)、[Q03](#research-q03)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在隔离 DSH profile 试用已审阅的固定 npm 皮肤，确认版本、可读性、重启和停用。出现结果未决、界面异常或包身份不符时退回原主题。见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持市场挂载、精确目标校验、变更收据、共享配置和依赖诊断。外部皮肤效果需宿主验证，逐层收据仍是待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、src/client/index.ts、src/catalog.ts、src/desktop-install.ts、src/official-desktop.ts、src/lifecycle.ts、src/routes.ts、src/configuration-override.ts、src/self-update.ts、src/repair.ts、src/repair-cli.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码核查 DSH 入口、目录、官方管理器状态、共享补丁和恢复。未执行插件或外部皮肤，未审计全部注册表、适配器、网络路径或视觉细节。
- 下一步：用隔离 profile 核对一次固定皮肤的安装、启用和恢复。另检查丢失宿主回执、共享覆盖与失败重装的状态是否可独立观察。

**分析版本**

- **仓库**：[kingOfSoySauce/dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)
- **版本号**：0.1.83（[固定提交 76ac3c8](https://github.com/kingOfSoySauce/dsh-skin-market/tree/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将固定目标、实际安装、宿主收据、loader 和视觉验收放入逐层检查。若试验仍出现误重装或确认成本高于手工，缩减到人工检查表。见 [Q05](#research-q05)。

用隔离 profile 核对一次固定皮肤的安装、启用和恢复。另检查丢失宿主回执、共享覆盖与失败重装的状态是否可独立观察。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 49 | 22803 | 21966 | 1312 | — |
| .md | source | 4 | 9122 | — | — | 70207 |
| .tsx | source | 4 | 4820 | 4424 | 146 | — |
| .mjs | source | 20 | 2193 | 1777 | 266 | — |
| .ts | source | 65 | 16340 | 14432 | 910 | — |
| .ts | test | 75 | 18563 | 16886 | 400 | — |
| .tsx | test | 13 | 5694 | 5403 | 64 | — |
| .ts | example | 4 | 134 | 81 | 33 | — |
| .tsx | example | 1 | 128 | 109 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：皮肤市场怎样把目录目标、宿主管理收据与实际启用分开，并处理外部包和配置层造成的失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场如何把找皮肤变成可核对的安装目标？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要切换 DSH 外观的用户原本要找仓库和版本，再到对应 profile 安装。市场的 Web 页面把发现、安装及启用汇集，缺少宿主前端原语时不注册页面。宿主路由分别适配官方 Desktop、普通 CLI 和其他 Desktop profile。官方桌面优先使用宿主给出的实际 profile 路径，缺少时用明确的 desktop 名称解析，避免落入 Web profile。

目录校验包名、固定版本、宿主版本范围、Git 提交及子路径，并核伴随插件的固定目标。远端目录无效或较旧会保留已有目录，时间相同而正文变更也拒收。桌面策略优先使用精确 npm 版本。Git 安装需额外检查固定来源，伴随插件、构建批准或未获准的未核实来源转手工。相对仅链接仓库，新增的是可核对安装目标和按宿主分流。目录格式核对并不能证明外部包安全或实际页面可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:170-197](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/client/index.ts#L170-L197)

前端能力门槛及两个宿主页面。

<details>
<summary>查看原文（28行）</summary>

```text
export function apply(ctx: ClientContext): void {
  const missing = missingPrimitives(primitives as unknown as Record<string, unknown>)
  if (missing.length > 0) {
    console.warn(`[dsh-skin-market] missing DSH primitives: ${missing.join(', ')}`)
    return
  }
  ctx.effect(() => ctx.locale.register(namespace, hostDictionaries), 'dsh-skin-market: locale')
  const hostLocale = () => {
    try {
      const active = ctx.locale.getSnapshot?.().active?.toLowerCase()
      return active?.startsWith('en') === true ? 'en' : 'zh'
    } catch {
      return 'zh'
    }
  }
  const t: Translator = createTranslator(ctx.locale.bind(namespace), 'zh', hostLocale)
  const hostT = (key: string): string => t(key as MessageKey)
  const clientRuntime = createClientSkinRuntime(ctx.loader, ctx)
  const desktopPluginPanel = createDesktopPluginPanel(ctx)
  ctx.effect(() => () => desktopPluginPanel.dispose?.(), 'dsh-skin-market: native install tracking')
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section', id: 'skin-market', order: 45, label: () => t('nav.market'), locale: namespace, inject: () => ({ t: hostT }),
  }, () => h(SkinMarketSection, { t, clientRuntime, desktopPluginPanel, layout: 'fill' })))
  // The injection stays dormant on older hosts and registers when the new
  // Plugins page owns this slot. Both entry points use the same market UI.
  ctx.slots.inject('plugins.bundle.config', () => ctx.slots.register({
    name: 'plugins.bundle.config', key: namespace, locale: namespace, inject: () => ({ t: hostT }),
  }, () => h(SkinMarketSection, { t, clientRuntime, desktopPluginPanel, layout: 'embedded' })))
```

</details>

**依据 2 · 源码核查**：[lib/index.js:82-113](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/lib/index.js#L82-L113)

路由和 profile 分流。

<details>
<summary>查看原文（32行）</summary>

```text
        const officialDesktop = desktopProfiles === undefined && (configuredProfile?.toLowerCase() === 'desktop'
            || (configuredProfile === undefined && launchedProfile?.toLowerCase() === 'desktop'));
        // Official Electron Desktop owns its profile through profileContext and
        // pluginManager; its CLI rejects `--profile desktop`. Resolve this branch
        // before the ordinary CLI fallback so actions mutate the visible profile.
        if (officialDesktop) {
            const profile = 'desktop';
            // An official Desktop generation may not expose profileContext.dir until
            // after startup. Never fall back to the Web profile in that case: the
            // canonical Desktop directory is the explicit profile name's directory.
            const profileDir = contextDir !== '' ? contextDir : resolveProfileDir(profile);
            const runner = officialDesktopRunner(() => readService('pluginManager'), runtime, hostContext, {
                profileDir,
                packageManager: () => hostPnpmInvocationOf(profileContext),
            });
            host.effect(() => mountRoutes(host, { profile, profileDir, runner, hostKind: 'desktop', runtime, agents: undefined, connection, configurationOverride }), 'dsh-skin-market: official Desktop routes');
            return;
        }
        if (desktopProfiles === undefined) {
            const profile = configuredProfile ?? launchedProfile ?? 'web';
            const profileDir = configuredProfile === undefined && contextDir !== '' ? contextDir : resolveProfileDir(profile);
            const appExit = readService('appExit');
            const restart = appExit === undefined ? undefined : createCliRestartScheduler(appExit);
            host.effect(() => mountRoutes(host, { profile, profileDir, runner: createPluginCliRunner(registryPlan), hostKind: 'dsh', runtime, restart, agents, connection, configurationOverride }), 'dsh-skin-market: routes');
            return;
        }
        hostContext.inject(['desktopPnpm'], desktopContext => {
            const current = desktopProfiles.current;
            const service = desktopContext.desktopPnpm;
            const desktopHost = desktopContext;
            desktopHost.effect(() => mountRoutes(host, { profile: current.name, profileDir: current.dir, runner: desktopRunner(service, current.dir), hostKind: 'desktop', runtime, agents, connection }), 'dsh-skin-market: desktop routes');
        });
```

</details>

**依据 3 · 源码核查**：[src/catalog.ts:23-63](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/catalog.ts#L23-L63)

目录包身份、固定源和伴随约束。

<details>
<summary>查看原文（41行）</summary>

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
    }
    if ((entry.install.companions?.length ?? 0) > 0 && entry.install.desktop?.mode === 'managed') {
      throw new Error(`desktop managed install cannot install companions for ${entry.id}`)
    }
    if (entry.subpath !== undefined && entry.install.allowBuild !== undefined && !entry.install.allowBuild.endsWith(`#path:${entry.subpath}`)) {
      throw new Error(`invalid allowBuild path for ${entry.id}; expected #path:${entry.subpath}`)
    }
```

</details>

**依据 4 · 源码核查**：[src/catalog.ts:157-179](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/catalog.ts#L157-L179)

远端新鲜度检查及错误时返回现有目录。

<details>
<summary>查看原文（23行）</summary>

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
    return this.snapshot()
```

</details>

**依据 5 · 源码核查**：[src/desktop-install.ts:32-60](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/desktop-install.ts#L32-L60)

精确 npm 或 Git 以及转手工条件。

<details>
<summary>查看原文（29行）</summary>

```text
export function desktopInstallPlan(skin: DesktopInstallSkin, official: boolean, allowUnverified = false): DesktopInstallPlan {
  const capability = skin.install.desktop
  if (capability?.mode === 'managed') {
    if (capability.packageName !== skin.package || capability.packageVersion !== skin.install.version) {
      return { kind: 'manual', reason: 'Desktop 安装元数据与皮肤固定版本不一致' }
    }
    return { kind: 'npm', target: `${capability.packageName}@${capability.packageVersion}` }
  }
  if (!official) return { kind: 'manual', reason: capability?.reason ?? '当前桌面宿主仅支持已验证的 npm 安装包' }
  return desktopGithubInstallPlan(skin, allowUnverified)
}

/** Also used when updating an existing GitHub source, even if npm is now available. */
export function desktopGithubInstallPlan(skin: DesktopInstallSkin, allowUnverified = false): DesktopInstallPlan {
  if (skin.review?.installation !== 'verified' && (!allowUnverified || !allowsGithubFallback(skin))) {
    return { kind: 'manual', reason: 'GitHub 安装来源尚未通过市场核验' }
  }
  if ((skin.install.companions?.length ?? 0) > 0) return { kind: 'manual', reason: '此皮肤需要一起安装伴随插件' }
  if (skin.install.allowBuild !== undefined) return { kind: 'manual', reason: '此皮肤需要按仓库说明批准 GitHub 构建项' }
  const repository = /^https:\/\/github\.com\/([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)$/.exec(skin.repo)?.[1]
  const { commit } = skin.install
  const path = skin.subpath
  if (repository === undefined || repository.split('/').some(part => part === '.' || part === '..') || !/^[0-9a-f]{40}$/.test(commit)
    || path !== undefined && (!/^[A-Za-z0-9_./-]+$/.test(path) || path.split('/').some(part => part === '' || part === '.' || part === '..'))) {
    return { kind: 'manual', reason: 'GitHub 安装目标缺少有效的固定 commit 或子目录' }
  }
  const target = `github:${repository}#${commit}${path === undefined ? '' : `&path:/${path}`}`
  if (skin.install.target !== target) return { kind: 'manual', reason: 'GitHub 安装目标与市场固定仓库、commit 或子目录不一致' }
  return { kind: 'github', target }
```

</details>

#### 缺口

- 固定目录中的真实皮肤与所用宿主兼容情况尚未逐项测试。
  **影响**：可核对安装计划，仍需确认实际包和界面。
  **进一步探讨**：在隔离 profile 用同一固定皮肤核包身份、安装去向及目录回退。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 为什么管理器的结果不等同于皮肤已显示？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

官方管理器结果区分已应用、需重启、配置覆盖、失败和取消。严格分支缺少可信 application 时记录带请求 ID 的 unknown，阻止把普通 pnpm 恢复用于重复变更。只有明确失败且未取消或超时，符合现有年龄规则修复和包状态条件时才重试。切换 registry 也排除超时、已取消及不可判定结果。某些宿主只保存选择但未热加载，启用收据应继续保留重启要求。回退原选择后，没有热加载回执仍不能断言当前界面已恢复。

重启路线拒绝尚未结束的皮肤操作和市场更新，并在有 Agent 注册服务时等待空闲及检查新启动任务。无该服务时检查能力受限。用户应分别核已安装文件、选择状态和实际渲染。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-desktop.ts:147-190](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/official-desktop.ts#L147-L190)

严格结果归类和无法确认回执。

<details>
<summary>查看原文（44行）</summary>

```text
function managerResult(value: unknown, requestId?: string, strict = false): CommandResult {
  value = unwrapResult(value)
  const record = asRecord(value)
  const application = record?.application
  if (strict && (record === undefined || application === undefined && record.ok !== false)) {
    return unknownResult(new Error('官方宿主未返回可确认的管理结果'), requestId)
  }
  const normalized: RecordLike = { ...record, ...(requestId === undefined ? {} : { requestId }) }
  delete normalized.indeterminate
  if (typeof normalized.error === 'string') normalized.error = { message: normalized.error }
  if (application !== undefined && !['applied', 'restart-required', 'overridden', 'failed', 'cancelled'].includes(String(application))) {
    normalized.reportedApplication = application
    normalized.application = 'failed'
  }
  const management = normalized as OfficialManagementResult
  // The independently observed Host result outranks package-manager diagnostics.
  const failed = application !== undefined
    ? application !== 'applied' && application !== 'restart-required' && application !== 'overridden'
    : record?.ok === false || record?.success === false || record?.changed === 'failed'
      || asRecord(record?.packageResult)?.exitCode !== undefined && asRecord(record?.packageResult)?.exitCode !== 0
  const output = resultText(value)
  const result: CommandResult = {
    exitCode: failed ? 1 : 0, stdout: failed ? '' : output, stderr: failed ? output : '',
    timedOut: false, aborted: application === 'cancelled', management,
  }
  const failure = officialOperationFailure(result)
  if (failed && failure !== undefined) result.stderr = failure.message
  return result
}
function managerError(error: unknown, _options?: CommandOptions): CommandResult {
  return {
    exitCode: null, stdout: '', stderr: error instanceof Error ? error.message : String(error),
    timedOut: false, aborted: false,
  }
}
function unknownResult(error: unknown, requestId?: string, cancellationStatus?: string): CommandResult {
  // Keep carrier diagnostics structured: generic pnpm recovery must not repeat an unconfirmed mutation.
  return {
    exitCode: 1, stdout: '', stderr: '官方管理结果未确认；请刷新状态后核对，不能自动重复操作', timedOut: false, aborted: false,
    management: {
      application: 'unknown', indeterminate: true, ...(requestId === undefined ? {} : { requestId }),
      error: { code: 'result-unconfirmed', diagnostic: error instanceof Error ? error.message : String(error) },
      ...(cancellationStatus === undefined ? {} : { cancellationStatus }),
    },
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:619-651](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/lifecycle.ts#L619-L651)

明确失败条件下受控重试，未知不进入重试。

<details>
<summary>查看原文（33行）</summary>

```text
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
      const repaired = this.repairReleaseAgePolicy(operation)
      const failure = officialOperationFailure(result)
      const repairedRefusal = completePartialInstall && failure?.kind === 'release-age' && failure.releaseAgeTarget !== undefined
        && repaired.includes(failure.releaseAgeTarget.packageName)
      // pnpm can materialize the new build before its final policy check
      // fails. Completing that same exact install fixes the known split
      // state; it does not require pretending the old build was restored.
      if (repaired.length > 0 && (repairedRefusal || baseline !== undefined && managedArtifactUnchanged(this.options.profileDir, baseline))) {
        this.checkDeadline(operation)
        if (operation !== undefined) writeOperationMessage(operation, '已修复版本放行规则，正在重试', 'common.recoveryReleaseAgeRepair')
        return await attempt()
      }
    }
    return result
  }

  private shouldTryNextRegistry(result: CommandResult): boolean {
    if (result.aborted === true || result.timedOut || result.management?.indeterminate === true) return false
    if (result.management?.application !== undefined && result.management.application !== 'failed') return false
    const failure = officialOperationFailure(result) ?? classifyPnpmFailure(result)
    return failure.kind === 'network' || failure.kind === 'fetch-timeout' || failure.kind === 'fetch-404'
      || failure.kind === 'integrity' || failure.kind === 'no-matching-version'
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:2660-2669](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/lifecycle.ts#L2660-L2669)

保存状态恢复后仍保留重启要求。

<details>
<summary>查看原文（10行）</summary>

```text
      writeMarketState(this.options.profileDir, previous)
      if (this.management === undefined) await this.replayLocked(false)
      if (this.management !== undefined && operation?.restartRequired === true) {
        // Rollback restores the saved selection, but a native no-HMR result
        // cannot confirm that the currently loaded appearance was restored.
        const restored = readMarketState(this.options.profileDir)
        for (const skinId of new Set([...this.enabledSkinIds(restored), operation.skinId])) this.recordRestart(restored, skinId, true)
        writeMarketState(this.options.profileDir, restored)
      }
    } catch (error) {
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:42-78](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/routes.ts#L42-L78)

重启前检查安装事务和 Agent 状态。

<details>
<summary>查看原文（37行）</summary>

```text
export function runningAgentCount(host: Pick<SkinMarketHost, 'agents'>): number {
  return host.agents?.list().filter(agent => agent.status === 'running').length ?? 0
}

export function restartBlockingOperations(operations: readonly Operation[]): Operation[] {
  return operations.filter(operation =>
    operation.phase !== 'done'
    && operation.phase !== 'failed'
    && operation.phase !== 'cancelled'
  )
}

export function assertRestartClearOfSkinOperations(
  operations: readonly Operation[],
  marketUpdate?: { phase: string } | null,
): void {
  const blocking = restartBlockingOperations(operations)
  if (blocking.length > 0) {
    throw new Error(`还有 ${blocking.length} 个皮肤操作未完成，现在不能重启。请等待完成或先取消，避免中断安装或启停`)
  }
  if (marketUpdate !== undefined && marketUpdate !== null
    && marketUpdate.phase !== 'done' && marketUpdate.phase !== 'failed' && marketUpdate.phase !== 'cancelled') {
    throw new Error('皮肤市场正在更新，现在不能重启。请等待完成或先取消')
  }
}

export async function waitForRestartSafety(host: Pick<SkinMarketHost, 'agents'>): Promise<void> {
  const agents = host.agents?.list() ?? []
  const running = agents.filter(agent => agent.status === 'running').length
  if (running > 0) throw new Error(`检测到 ${running} 个 Agent 正在运行，请等待任务完全结束后再重启`)

  // An Agent can still be finishing maintenance while its public status is
  // idle. whenIdle() includes that maintenance and the turn checkpoint.
  await Promise.all(agents.map(agent => agent.whenIdle()))
  const startedDuringCheck = runningAgentCount(host)
  if (startedDuringCheck > 0) throw new Error(`检测到 ${startedDuringCheck} 个 Agent 刚刚开始运行，请稍后再重启`)
}
```

</details>

#### 缺口

- 不同 Desktop 代际丢失回执时如何最终回读未独立验证。
  **影响**：不能保证恢复结束或重启后界面正确。
  **进一步探讨**：用隔离宿主记录一次正常启用、一次响应丢失以及重启后的真实样式。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 共享开关覆盖为何需要与 profile 修复分开确认？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

HOME 的共享补丁可能盖过 profile 的启停选择，重装同一包不能消除该覆盖。修复只在可信绝对 home、层级可分且无额外覆盖时继续。只接受唯一顶层目标行及字面布尔 disabled，拒绝重复、嵌套和不一致的模块名。计划用目标、文件身份和正文摘要绑定确认，并提示同一 HOME 下多个 profile 共用。写入前重算计划，核启用版本和实际产物，避免移除共享禁用后立即唤起未授权的代码。

提交前检查原文件一致，备份以 0600 创建，写临时文件并刷盘，重查后替换，最后验证正文和权限。替换后如果并发变化令校验失败会保留备份。这个机制收窄编辑范围和误写风险，不能为外部编辑器提供跨应用锁，也不能代表所有 profile 已重新渲染。

#### 证据与依据

**依据 1 · 源码核查**：[src/configuration-override.ts:217-250](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/configuration-override.ts#L217-L250)

可信 home、单目标和摘要限制。

<details>
<summary>查看原文（34行）</summary>

```text
function trustedSource(options: ConfigurationOverrideOptions): SourceResult {
  if (options.overlays !== undefined && (!Array.isArray(options.overlays) || options.overlays.length > 0)) return { status: 'blocked', reason: '当前宿主含启动覆盖，无法只通过共享配置确认修复结果。' }
  if (typeof options.home !== 'string' || options.home.trim() === '' || !isAbsolute(options.home)) return { status: 'blocked', reason: '宿主未提供可信的共享配置位置。' }
  const home = resolve(options.home)
  const file = join(home, 'cordis.patch.yml')
  if (options.patchPath !== undefined && resolve(options.patchPath) === file) return { status: 'blocked', reason: '宿主的共享配置与当前配置位置重合，无法确认配置层级。' }
  try { return readSource(file, home) } catch (error) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
      try { homeIdentity(home) } catch { throw new ConfigurationOverrideError('unavailable') }
      return { status: 'none', file, reason: '共享配置中未找到目标开关覆盖。' }
    }
    throw error
  }
}

function prepareTarget(options: ConfigurationOverrideOptions, target: ConfigurationOverrideTarget, source: Source, rows = parseSafe(source.contents).sequence.items as YAMLMap[]): Prepared | ConfigurationOverridePlan {
  const base = basePlan(target)
  const file = source.file
  const matches = rows.filter(row => literal(row, 'id') === target.rowId)
  let nestedTarget = false
  for (const row of rows) if (structuralRows(row).some(node => node !== row && literal(node, 'id') === target.rowId)) nestedTarget = true
  if (matches.length > 1 || nestedTarget) throw new ConfigurationOverrideError('unsafe')
  const row = matches[0]
  if (row === undefined) return { ...base, status: 'none', source: 'home', file, reason: '共享配置中未找到目标开关覆盖。' }
  const name = keyValue(row, 'name')
  if (keyValue(row, 'insert') !== undefined || keyValue(row, 'group') !== undefined
    || name !== undefined && (!isScalar(name) || name.value !== target.packageName)) throw new ConfigurationOverrideError('unsafe')
  const disabled = keyValue(row, 'disabled')
  if (disabled === undefined) return { ...base, status: 'none', source: 'home', file, reason: '共享配置未覆盖目标的启停开关。' }
  if (!isScalar(disabled) || typeof disabled.value !== 'boolean') throw new ConfigurationOverrideError('unsafe')
  if (disabled.value === !target.enabled) return { ...base, status: 'none', source: 'home', file, previousDisabled: disabled.value, reason: '共享配置中的目标开关与本次操作一致。' }
  const contents = removeDisabled(source.contents, row, rows.length === 1)
  const context = createHash('sha256').update(JSON.stringify({ target, file, patchPath: options.patchPath, homeIdentity: source.homeIdentity, identity: source.identity.value, contents: source.contents })).digest('hex')
  return { source, contents, plan: { ...base, status: 'repairable', context, source: 'home', file, previousDisabled: disabled.value, reason: '可移除目标组件的共享开关覆盖；这项设置由同一 DSH home 下的所有配置共用。' } }
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:1743-1762](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/lifecycle.ts#L1743-L1762)

再次绑定计划并核兼容和产物授权。

<details>
<summary>查看原文（20行）</summary>

```text
      if (selectionContext !== undefined) {
        if (!isSelectionOperation(operation.kind)) throw new Error('invalid selection operation')
        const prepared = await this.selectionPlanLocked(operation.kind, operation.skinId, operation.preservedSkinIds)
        if (this.disposed) throw new Error('皮肤市场宿主已停止，配置未修改')
        if (this.waitingReason !== undefined) throw new Error(this.waitingReason)
        this.checkDeadline(operation)
        if (prepared.plan.status !== 'repairable' || prepared.plan.context !== selectionContext || prepared.editorContext === undefined) throw new Error('启停目标或配置已变化，请重新检查后确认')
        for (const change of prepared.plan.changes) {
          const skin = this.skin(change.skinId)
          if (change.desiredEnabled) {
            if (skin.id === operation.skinId) {
              this.assertCompatibilityContext(operation, skin)
              this.assertArtifactUseApproved(operation, skin)
            } else {
              this.assertPreservedSkinApproved(operation, skin)
            }
          }
        }
        repair = applyConfigurationOverrides(this.options.configurationOverride ?? {}, prepared.targets, prepared.editorContext)
        logEvent('info', 'configuration-override-repair', `已移除 ${prepared.plan.changes.length} 项共享启停覆盖；备份 ${repair.receipt.backupPath}`, operation.id)
```

</details>

**依据 3 · 源码核查**：[src/configuration-override.ts:325-381](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/configuration-override.ts#L325-L381)

写前与替换后检查，保留可恢复备份。

<details>
<summary>查看原文（57行）</summary>

```text
function save(source: Source, contents: string, onReplaced?: () => void): Source {
  const temporary = `${source.file}.${process.pid}.${randomUUID()}.tmp`
  let descriptor: number | undefined
  try {
    unchanged(source)
    descriptor = openSync(temporary, 'wx', source.identity.mode)
    fchmodSync(descriptor, source.identity.mode)
    writeFileSync(descriptor, contents, 'utf8')
    fsyncSync(descriptor)
    closeSync(descriptor)
    descriptor = undefined
    unchanged(source)
    renameSync(temporary, source.file)
    onReplaced?.()
    const after = readSource(source.file, source.home)
    if (after.contents !== contents || after.identity.mode !== source.identity.mode) throw new ConfigurationOverrideError('changed')
    return after
  } catch (error) {
    if (error instanceof ConfigurationOverrideError) throw error
    throw new ConfigurationOverrideError('write-failed')
  } finally {
    if (descriptor !== undefined) { try { closeSync(descriptor) } catch {} }
    try { unlinkSync(temporary) } catch {}
  }
}

/** Only a fresh, explicitly approved plan may edit the one trusted home file. */
function applyPrepared<Plan extends ConfigurationOverridePlan | ConfigurationOverrideBatchPlan>(prepared: { source: Source; contents: string; plan: Plan }): { plan: Plan; receipt: ConfigurationOverrideReceipt } {
  const backupPath = join(dirname(prepared.source.file), `.dsh-skin-market-configuration-override-${randomUUID()}.backup`)
  let descriptor: number | undefined
  let backup: Source | undefined
  let saved = false
  let replaced = false
  try {
    unchanged(prepared.source)
    descriptor = openSync(backupPath, 'wx', 0o600)
    fchmodSync(descriptor, 0o600)
    writeFileSync(descriptor, prepared.source.contents, 'utf8')
    fsyncSync(descriptor)
    closeSync(descriptor)
    descriptor = undefined
    backup = readSource(backupPath, prepared.source.home)
    unchanged(prepared.source)
    const after = save(prepared.source, prepared.contents, () => { replaced = true })
    saved = true
    const receipt = Object.freeze({ backupPath })
    receipts.set(receipt, { before: prepared.source, after, backup, rolledBack: false })
    return { plan: prepared.plan, receipt }
  } catch (error) {
    if (error instanceof ConfigurationOverrideError) throw error
    throw new ConfigurationOverrideError('write-failed')
  } finally {
    if (descriptor !== undefined) { try { closeSync(descriptor) } catch {} }
    if (!saved) {
      // Keep a durable backup if replacement happened but a concurrent edit prevented verification.
      if (!replaced) { try { unlinkSync(backupPath) } catch {} }
    }
```

</details>

#### 缺口

- 共享配置重载及并发编辑的真实结果尚未复现。
  **影响**：不能把文件替换当作多 profile 的界面效果。
  **进一步探讨**：用两个临时 profile 测试共享覆盖、计划后改文件及回退。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 市场自更新与失效依赖修复分别改什么？

**研究主题**：工程质量与复用、依赖、兼容与流程、效果与总成本

#### 完整回答

官方管理器可能明确拒绝重复安装已存在的市场包。先卸载会撤掉负责执行后续安装的市场模块，因此在已知目标版本且能取得宿主 pnpm 时走同一 profile 的就地覆盖。缺少前提则停止并给出退出宿主后人工更新的路径。就地替换完成仍需宿主加载新代码。

另一个故障是 profile 里的旧 Git 依赖失效。修复工具用 HEAD 响应区分明确 404/410 与其他无法确认的状态。命令默认诊断，应用需显式参数确认已经停用该宿主。备份包清单和锁文件后才按计划移除或迁移精确依赖，再跑 pnpm 和结果校验。校验失败恢复备份，并尽力重装已有依赖。文件恢复和重装成功是两种状态，需检查原 profile 能否启动。人工需确认实际目录、哪些包应保留及固定迁移目标，网络和重装耗时未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/self-update.ts:600-627](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/self-update.ts#L600-L627)

明确重复安装拒绝时选择宿主 pnpm 就地覆盖。

<details>
<summary>查看原文（28行）</summary>

```text
          const managed = lastResult.management
          const manualSpec = targetRelease === undefined ? MARKET_NPM_PACKAGE : `${MARKET_NPM_PACKAGE}@${targetRelease.version}`
          // HMR Desktop refuses installBundle for a dependency that already
          // exists, and the only managed update is remove-then-install.
          // Removing this package unloads the module that would run the
          // install, so the replacement never lands and the profile is left
          // without the market. Overlay the new build with the host's own
          // pnpm instead: `pnpm add` on an existing dependency replaces it in
          // place, so this code stays loaded and can report the result.
          if (managed?.application === 'failed' && managed.error?.code === 'already-installed') {
            if (runner.hostPnpm === undefined || targetRelease === undefined) {
              throw new Error(`当前 DSH 拒绝覆盖已安装的皮肤市场，也没有提供宿主 pnpm；市场没有被卸载。请完全退出 DSH，在 profile 目录执行 pnpm add ${manualSpec}，然后重新启动。`)
            }
            logEvent('info', 'market-update-overlay', '宿主拒绝重复安装，改用宿主 pnpm 就地覆盖新版本，不卸载市场', operation.id)
            // pnpm 11 reads only the first matching exact-version rule, so a
            // duplicated row would silently ignore a valid exemption. Merge
            // them before the overlay reads the profile policy.
            repairReleaseAgeExcludes(profileDir)
            overlaidInPlace = true
            await runPnpmWithRecovery(['add', `${MARKET_NPM_PACKAGE}@${targetRelease.version}`, '--reporter=ndjson'], {
              profileDir,
              attempt: async (attemptArgs, attemptOptions) => {
                lastResult = await runner.hostPnpm!(attemptArgs, {
                  signal: controller.signal,
                  env: { pnpm_config_fetch_timeout: String(PNPM_FETCH_TIMEOUT_MS), ...attemptOptions?.env },
                  onStdout: report,
                  onStderr: report,
                })
```

</details>

**依据 2 · 源码核查**：[src/repair.ts:218-226](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/repair.ts#L218-L226)

探测状态区分明确缺失与错误。

```text
async function probe(url: string, fetchImpl: ProbeFetch, timeoutMs: number): Promise<SourceProbe> {
  try {
    const response = await fetchImpl(url, { method: 'HEAD', signal: AbortSignal.timeout(timeoutMs) })
    if (response.status === 200 || response.status === 204 || response.status === 302) return { status: 'reachable', httpStatus: response.status }
    if (response.status === 404 || response.status === 410) return { status: 'missing', httpStatus: response.status }
    return { status: 'unknown', httpStatus: response.status }
  } catch (error) {
    return {
      status: 'unknown',
```

**依据 3 · 源码核查**：[src/repair-cli.ts:136-149](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/repair-cli.ts#L136-L149)

默认诊断及修改的显式条件。

<details>
<summary>查看原文（14行）</summary>

```text
    if (plan.runInstall) {
      console.error('')
      console.error('Read-only diagnosis. To repair: fully stop the DSH instance that uses this profile, then rerun with --apply --yes --i-have-stopped-dsh.')
    }
    return
  }

  if (!flag('--yes') || !flag('--i-have-stopped-dsh')) {
    fail('Refusing to edit the profile: --apply requires --yes and --i-have-stopped-dsh. Fully stop DSH first.', 2)
  }
  if (!plan.runInstall) {
    console.log('nothing to repair; no files were changed.')
    return
  }
```

</details>

**依据 4 · 源码核查**：[src/repair.ts:459-503](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/repair.ts#L459-L503)

先备份，再修改、安装、校验与恢复。

<details>
<summary>查看原文（45行）</summary>

```text
  const removed = plan.remove.map(dependency => dependency.packageName)
  const migrated = plan.migrate.map(migration => ({ ...migration }))
  if (!plan.runInstall) return { status: 'noop', removed: [], migrated: [], kept: plan.keep }
  const runner = options.runner ?? defaultRepairRunner()
  const timeoutMs = options.timeoutMs ?? DEFAULT_INSTALL_TIMEOUT_MS
  let backup: BackupState
  try {
    backup = writeBackup(profileDir, inspection, plan, options)
  } catch (error) {
    return { status: 'failed', removed, migrated, kept: plan.keep, stage: 'backup', error: error instanceof Error ? error.message : String(error) }
  }
  try {
    if (plan.remove.length > 0 || plan.migrate.length > 0) {
      const dependencies = readDependencies(profileDir)
      for (const dependency of plan.remove) delete dependencies[dependency.packageName]
      for (const migration of plan.migrate) dependencies[migration.packageName] = migrationManifestSpec(migration.packageName, migration.target)
      writeManifest(profileDir, dependencies)
    }
  } catch (error) {
    restoreBackup(profileDir, backup)
    return { status: 'failed', backupDir: backup.dir, removed, migrated, kept: plan.keep, stage: 'manifest', error: error instanceof Error ? error.message : String(error) }
  }
  const result = await runner(INSTALL_ARGS, { cwd: profileDir, timeoutMs })
  if (result.exitCode !== 0) {
    restoreBackup(profileDir, backup)
    await runner(['install', '--frozen-lockfile', '--prefer-offline'], { cwd: profileDir, timeoutMs }).catch(() => undefined)
    return {
      status: 'failed',
      backupDir: backup.dir,
      removed,
      migrated,
      kept: plan.keep,
      stage: 'install',
      error: result.timedOut === true
        ? 'pnpm install timed out; the pre-repair package.json and pnpm-lock.yaml were restored'
        : `pnpm install exited ${String(result.exitCode)}; the pre-repair package.json and pnpm-lock.yaml were restored`,
    }
  }
  const verify = verifyRepair(profileDir, inspection, plan)
  if (!verify.ok) {
    restoreBackup(profileDir, backup)
    await runner(['install', '--frozen-lockfile', '--prefer-offline'], { cwd: profileDir, timeoutMs }).catch(() => undefined)
    return { status: 'failed', backupDir: backup.dir, removed, migrated, kept: plan.keep, stage: 'verify', verify, error: verify.problems.join('; ') }
  }
  return { status: 'applied', backupDir: backup.dir, removed, migrated, kept: plan.keep, verify }
```

</details>

#### 缺口

- 未验证安装器进程中断或部分依赖物化时的真实恢复。
  **影响**：不能保证恢复文件后旧皮肤全部可用。
  **进一步探讨**：用模拟失效依赖隔离 profile 分别注入安装失败与结果校验失败，核实际模块和启动状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 用户应以什么条件试用，收据如何降低误重装？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

建议试用范围是想从市场选已审阅皮肤、能创建独立 DSH profile 并愿意确认实际界面的用户。先选一个精确 npm 版本，从安装及启用分开的操作开始。只有包正确、界面可读、重启后状态一致且停用恢复，才计为合格任务。颜色或键盘焦点异常、来源不符、加载未决时保留诊断并停用，恢复原主题后再继续。首轮成本是审查外部包及做兼容验证，日常需要复核皮肤叠加和升级，失败时需要等待或重启。没有可用性或节时数据，适合观察相较人工流程究竟省去多少。

可验证的假设是把目录目标、实际产物、管理结果、loader 与视觉验收放进逐层收据，并给每个未知态可执行回读。与现有提示对照重复安装、错误放行、成功恢复和人工时间。若收据未减少重复操作，或用户仍容易把安装当渲染成功，就缩短为人工检查表。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:81-100](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/README.md#L81-L100)

作者给出安装、启用及手工固定目标的区别。

<details>
<summary>查看原文（20行）</summary>

```text
## 使用皮肤

打开「设置 → 皮肤市场」或 「插件 → dsh-skin-market」

### 从市场安装具体皮肤

可直接安装的 npm 皮肤会使用「安装」或「安装并使用」流程。官方 Desktop 默认先安装，再进入使用确认；取消使用确认时，皮肤包会保留，但不会启用。

标为「需手动安装」的皮肤，需要把市场提供的完整固定目标交给 Agent。有已发布 npm 包时用 `name@version`（预构建）；没有 npm 包时才用 GitHub 完整 commit 和 `&path:/子目录`。不要用未构建的 GitHub 源码代替 npm 包，也不要把 commit 或子目录改成 `latest`、仓库主分支或另一个包名。

<details>
<summary><strong>点击展开手动皮肤安装流程</strong></summary>

Agent 先只读确认当前 Desktop 版本和其他已启用的皮肤；发现冲突时列出名称，指导你在应用中停用，并核对停用结果后再继续。拿不到启用状态时，应请你提供插件列表或界面状态，不能把“无法确认”当成“没有冲突”。

安装目标使用面板给出的完整固定 spec。有 npm 包的皮肤优先 `name@version`；没有 npm 包时用 GitHub 完整 commit，monorepo 子包还要保留 `&path:/子目录`，例如 `github:owner/repo#<完整 commit>&path:/packages/skin`。不要把该目标换成 `latest` 或仓库主分支。

如果当前宿主提供插件管理工具（plugin_manager），Agent 把最终精确目标和会修改的 profile 发给你确认后，可直接安装（默认不启用）；需要启用时先查冲突并再次确认。工具不可用、宿主拒绝或需要你在应用内处理构建授权时，Agent 指导你打开「插件 → 添加插件」、粘贴完整目标、确认安装结果、按提示启用，最后按当前版本要求完全退出并重新打开应用。Agent 不执行 `dsh plugin --profile desktop`，不手改 profile；构建授权只按宿主返回的精确项逐项确认；重启由你完成。界面不支持该目标或安装失败时，先核对原始报错和维护者说明，再决定下一步；依赖伴生包的皮肤须核对完整安装要求。

这些说明不改变市场的 npm 一键安装流程，也不代表所有 GitHub 或子目录皮肤都已完成官方 Desktop 实机验收。
```

</details>

**依据 2 · 作者声明**：[README.md:108-119](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/README.md#L108-L119)

常见未生效、结果不明和回退。

<details>
<summary>查看原文（12行）</summary>

```text
先按市场弹窗或横幅中的具体原因处理。不要因为“已安装”就重复安装，也不要因为某次启用失败就直接卸载整个 profile。

| 情况 | 先做什么 |
| --- | --- |
| 网络或下载超时 | 重试一次；持续失败时复制市场诊断日志，检查 DSH 实际使用的网络和安装源 |
| 已安装但没有生效 | 进入皮肤详情点击「使用」，检查是否显示「待重启」或「未生效」及其原因 |
| 启用/停用被其他配置覆盖 | 按弹窗指出的组件处理；不要反复重装。市场能安全定位覆盖时，会给出明确的修复入口 |
| 安装被新包保护阻止 | 只允许报错中明确指出的那个精确版本，或等待保护期结束；不要关闭全局保护 |
| 操作结果正在确认 | 等待市场核对宿主结果，不要再次点击安装、启用或卸载 |
| 安装/更新/卸载被另一个已安装插件的失效仓库挡住 | 按失败弹窗里默认折叠的三步处理：手动去掉该依赖、退出 DSH 后执行修复命令，或把提示词交给当前 DSH 以外的 Agent。不要在市场里卸载那个失效插件 |
| 页面因皮肤冲突无法操作 | 停止对应的 DSH Web 进程后，使用下面的 Web 重置命令 |
| 点击更新后市场从插件列表消失 | 旧版的 Desktop 自更新会先卸载市场再补装，补装可能没有执行。到「插件 → 添加插件」重新安装 `dsh-skin-market@latest` 并启用 |
```

</details>

**依据 3 · 源码核查**：[src/official-desktop.ts:147-170](https://github.com/kingOfSoySauce/dsh-skin-market/blob/76ac3c85ea878554c0831cf9f6df1dc9a75f6f73/src/official-desktop.ts#L147-L170)

管理结果本身按应用状态分类。

<details>
<summary>查看原文（24行）</summary>

```text
function managerResult(value: unknown, requestId?: string, strict = false): CommandResult {
  value = unwrapResult(value)
  const record = asRecord(value)
  const application = record?.application
  if (strict && (record === undefined || application === undefined && record.ok !== false)) {
    return unknownResult(new Error('官方宿主未返回可确认的管理结果'), requestId)
  }
  const normalized: RecordLike = { ...record, ...(requestId === undefined ? {} : { requestId }) }
  delete normalized.indeterminate
  if (typeof normalized.error === 'string') normalized.error = { message: normalized.error }
  if (application !== undefined && !['applied', 'restart-required', 'overridden', 'failed', 'cancelled'].includes(String(application))) {
    normalized.reportedApplication = application
    normalized.application = 'failed'
  }
  const management = normalized as OfficialManagementResult
  // The independently observed Host result outranks package-manager diagnostics.
  const failed = application !== undefined
    ? application !== 'applied' && application !== 'restart-required' && application !== 'overridden'
    : record?.ok === false || record?.success === false || record?.changed === 'failed'
      || asRecord(record?.packageResult)?.exitCode !== undefined && asRecord(record?.packageResult)?.exitCode !== 0
  const output = resultText(value)
  const result: CommandResult = {
    exitCode: failed ? 1 : 0, stdout: failed ? '' : output, stderr: failed ? output : '',
    timedOut: false, aborted: application === 'cancelled', management,
```

</details>

#### 缺口

- 未测实际 DSH 版本的皮肤兼容、无障碍表现及单位换肤成本。
  **影响**：仅支持受控试用，不支持长期安装建议。
  **进一步探讨**：在相同宿主和样式上比较手工安装与市场安装的时间、真实可读性和可回退结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
