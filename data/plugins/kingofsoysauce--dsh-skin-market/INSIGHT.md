# DSH Skin Market

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4b73f2f](https://github.com/kingOfSoySauce/dsh-skin-market/tree/4b73f2f290d883dcebed49be92e8434315ac8537)

<!-- BEGIN META -->
[![GitHub ★ 290](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=290&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/kingOfSoySauce/dsh-skin-market) [![npm 30d 10,815](https://img.shields.io/static/v1?label=npm+30d&message=10%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-skin-market)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览、安装和管理社区皮肤。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 集中皮肤发现及生命周期操作；皮肤质量和安全由其自身决定。

> **主要限制**：[Q03](#research-q03) 未知结果与重启不能当已生效，[Q04](#research-q04) 固定目标不证明包安全或视觉兼容。

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
  - [Q01 · 用户为何需要皮肤市场，与手动配置相比多做什么？](#detail-section-11)
  - [Q02 · 目录目标如何解析校验，安装和选择由谁执行？](#detail-section-12)
  - [Q03 · 结果未知、重启与重置的安全边界是什么？](#detail-section-13)
  - [Q04 · 外部包、宿主兼容、费用及退出条件是什么？](#detail-section-14)
  - [Q05 · 能否通过统一收据减少用户误判和重复安装？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户需要发现、切换和管理皮肤。

用户可手动查仓并管理 profile 中的皮肤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录校验 | 校验包与固定目标 | 不证明包安全 |
| 安装与启用 | 管理皮肤及选择 | 宿主和 profile 分支不同 |
| 等待与重启 | 显示未确认和重启状态 | 不证明 UI 已渲染 |
| 重置 | 管理目录内皮肤 | 不覆盖目录外所有插件 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH Host 与 Web 客户端 | 市场需要 | 安装与设置入口 | 无法使用对应界面 |
| 目录与固定目标 | 安装皮肤需要 | 确认包及版本 | 格式不符时拒绝 |
| 管理器或 Web CLI | 按宿主需要 | 安装和启用 | 结果失败或未知 |
| 外部皮肤包 | 换肤需要 | 提供实际界面 | 不可用或不兼容需回退 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核实宿主、profile 和目标 | 不明来源停止安装 |
| 安装 | 审查固定目标并安装一款 | 检查包状态 |
| 启用 | 保存选择并确认 loader | 等待或重启不能当已显示 |
| 恢复 | 退回原主题并检查重启 | 未知状态先等结果，不盲目重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网络及安装资源未知 | 核包来源和宿主 | 兼容未知 |
| 持续 | 渲染性能开销未知 | 核视觉和无障碍 | 效果未测 |
| 恢复 | 重启和包存储成本未知 | 核加载和回退 | 外部操作可能仍在运行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目标校验 | schema 和固定 Git 目标一致性 | 安全或视觉兼容 |
| 生命周期 | 宿主管理及等待提示 | 所有结果及时可知 |
| 停用 | 更新选择并视情况重启 | 真实界面完全恢复 |

> **思考**：[Q03](#research-q03) 未知结果与重启不能当已生效，[Q04](#research-q04) 固定目标不证明包安全或视觉兼容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 集中皮肤发现及生命周期操作；皮肤质量和安全由其自身决定。

[Q02](#research-q02) 区分固定目标、包和启用，[Q03](#research-q03) 在外部管理未决时保留等待状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 未知结果与重启不能当已生效，[Q04](#research-q04) 固定目标不证明包安全或视觉兼容。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离 profile 试一款已审查皮肤，确认真实界面；加载未知或视觉异常时停用并回原主题。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的目录、宿主和生命周期代表路径已查；未运行界面或宿主。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/catalog.ts、src/lifecycle.ts、src/reset.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读 README、包清单、目录校验、宿主管理、生命周期及重置代表路径；未执行目标、宿主、皮肤或网络，未审计所有适配器和 UI。
- 下一步：用假宿主和隔离 profile 检查延迟完成、重启与失败，再按 [Q05](#research-q05) 比较逐层收据。

**分析版本**

- **仓库**：[kingOfSoySauce/dsh-skin-market](https://github.com/kingOfSoySauce/dsh-skin-market)
- **版本号**：0.1.72（[固定提交 4b73f2f](https://github.com/kingOfSoySauce/dsh-skin-market/tree/4b73f2f290d883dcebed49be92e8434315ac8537)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设按安装、选择、loader 和界面逐层展示证据可减少误重装；尚未验证。

用假宿主和隔离 profile 检查延迟完成、重启与失败，再按 [Q05](#research-q05) 比较逐层收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 43 | 16949 | 16283 | 1113 | — |
| .md | source | 3 | 4410 | — | — | 39853 |
| .mjs | source | 17 | 1456 | 1201 | 146 | — |
| .tsx | source | 3 | 3752 | 3484 | 76 | — |
| .ts | source | 55 | 12207 | 10686 | 704 | — |
| .ts | test | 64 | 16755 | 15287 | 328 | — |
| .tsx | test | 3 | 5295 | 4942 | 36 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/kingOfSoySauce/dsh-skin-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查皮肤目录、宿主管理、加载状态及恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户为何需要皮肤市场，与手动配置相比多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:1-3 描述嵌入 DSH 设置页的社区皮肤市场，面向想浏览、安装及切换外观的用户；手动查仓和编辑 profile 是基线。具体增量是将目录、安装和启用状态集中，不是皮肤本身、主题设计或宿主渲染的新实现。是否省时、好看或无障碍须实际 UI 对照，不能从收录数量或源码推导。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-3](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/README.md#L1-L3)

作者描述皮肤市场功能。

```text
# DSH 皮肤市场

一个嵌入 DSH 设置页的社区皮肤市场：浏览、搜索、安装、使用、停用、常驻、更新和卸载 DSH 皮肤。
```

**依据 2 · 源码核查**：[package.json:1-5](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/package.json#L1-L5)

包名称版本及功能。

```text
{
  "name": "dsh-skin-market",
  "version": "0.1.72",
  "description": "Native skin marketplace and lifecycle manager for DeepSeek Harness",
  "homepage": "https://kingofsoysauce.github.io/dsh-skin-market/",
```

**依据 3 · 源码核查**：[src/index.ts:47-98](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/index.ts#L47-L98)

服务按宿主选择管理路径。

<details>
<summary>查看原文（52行）</summary>

```text
      // Unknown overlay metadata is deliberately unsupported by automatic repair.
      overlays: Array.isArray(profileContext?.overlays) && profileContext.overlays.every(value => typeof value === 'string')
        ? profileContext.overlays as string[] : ['unknown-host-overlays'],
    }
    const configuredProfile = typeof config?.profile === 'string' ? config.profile.trim() : undefined
    const launchedProfile = contextName !== '' ? contextName : argvProfile()
    const agents = readService('agents') as SkinMarketHost['agents']
    const runtime = detectDshRuntime()
    const connection = (): HostConnectionLike | undefined => readService('connection') as HostConnectionLike | undefined
    const initialPluginManager = readService('pluginManager') as OfficialPluginManagerLike | undefined
    const registryPlan = typeof initialPluginManager?.registries === 'function'
      ? async () => {
        const manager = readService('pluginManager') as OfficialPluginManagerLike | undefined
        if (typeof manager?.registries !== 'function') return undefined
        try { return normalizeOfficialRegistryPlan(await manager.registries()) } catch { return undefined }
      }
      : undefined
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
      return
    }
    hostContext.inject(['desktopPnpm'], desktopContext => {
      const current = desktopProfiles.current
      const service = (desktopContext as unknown as { desktopPnpm: DesktopPnpmLike }).desktopPnpm
      const desktopHost = desktopContext as unknown as EffectHost
      desktopHost.effect(
        () => mountRoutes(host, { profile: current.name, profileDir: current.dir, runner: desktopRunner(service, current.dir), hostKind: 'desktop', runtime, agents, connection }),
        'dsh-skin-market: desktop routes',
      )
    })
```

</details>

#### 缺口

- 没有实际换肤和无障碍对照
  **影响**：无法推断审美、兼容或节时
  **进一步探讨**：固定宿主比较手动配置与市场换肤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录目标如何解析校验，安装和选择由谁执行？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

catalog.ts:22-48 校验条目 schema、Desktop 管理包名和版本、宿主范围，并将仓库、commit 和子路径导出预期目标后与安装目标比较；这支持目录内目标一致性，不证明仓库可信或皮肤安全。index.ts:47-98 区分宿主与 profile 的管理服务；lifecycle.ts:2680-2707 保存选择并根据实际 loader 或 pendingRestart 返回已启用、待重启或尚未运行。安装包、启用选择、loader 状态与最终视觉效果是不同层次，真实 Desktop/Web 适配和线上目标未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.ts:22-48](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/catalog.ts#L22-L48)

目录 schema 和固定目标一致性。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:47-98](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/index.ts#L47-L98)

不同宿主管理接线。

<details>
<summary>查看原文（52行）</summary>

```text
      // Unknown overlay metadata is deliberately unsupported by automatic repair.
      overlays: Array.isArray(profileContext?.overlays) && profileContext.overlays.every(value => typeof value === 'string')
        ? profileContext.overlays as string[] : ['unknown-host-overlays'],
    }
    const configuredProfile = typeof config?.profile === 'string' ? config.profile.trim() : undefined
    const launchedProfile = contextName !== '' ? contextName : argvProfile()
    const agents = readService('agents') as SkinMarketHost['agents']
    const runtime = detectDshRuntime()
    const connection = (): HostConnectionLike | undefined => readService('connection') as HostConnectionLike | undefined
    const initialPluginManager = readService('pluginManager') as OfficialPluginManagerLike | undefined
    const registryPlan = typeof initialPluginManager?.registries === 'function'
      ? async () => {
        const manager = readService('pluginManager') as OfficialPluginManagerLike | undefined
        if (typeof manager?.registries !== 'function') return undefined
        try { return normalizeOfficialRegistryPlan(await manager.registries()) } catch { return undefined }
      }
      : undefined
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
      return
    }
    hostContext.inject(['desktopPnpm'], desktopContext => {
      const current = desktopProfiles.current
      const service = (desktopContext as unknown as { desktopPnpm: DesktopPnpmLike }).desktopPnpm
      const desktopHost = desktopContext as unknown as EffectHost
      desktopHost.effect(
        () => mountRoutes(host, { profile: current.name, profileDir: current.dir, runner: desktopRunner(service, current.dir), hostKind: 'desktop', runtime, agents, connection }),
        'dsh-skin-market: desktop routes',
      )
    })
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:2680-2707](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L2680-L2707)

启用选择与运行/重启状态。

<details>
<summary>查看原文（28行）</summary>

```text
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
      }
      if (operation.restartRequired === true) {
        operation.message = 'activation saved; restart DSH to load this skin'
      } else {
        operation.message = active?.found && active.live ? 'skin is active' : '启用设置已保存，但皮肤组件尚未运行；请在官方插件页检查加载状态'
```

</details>

#### 缺口

- 未执行安装、加载或在线目录检查
  **影响**：不能证明皮肤兼容或来源安全
  **进一步探讨**：隔离 profile 对照包、选择、loader 和实际 UI。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 结果未知、重启与重置的安全边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

lifecycle.ts:286-300 为未完成生命周期操作保留 waitingReason；705-714 将未完成 promise 纳入等待状态，避免把结果未知当作立即可再次变更。2720-2743 的停用处理会更新启用集合，按需提示重启，失败尝试回滚选择；reset.ts:21-32 从目录筛选已安装的皮肤并处理，作用对象受当前目录与配置限制。等待不证明外部操作已完成，失败回滚不保证包、配置、loader 和 UI 同时恢复；需核实际状态再决定是否重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/lifecycle.ts:286-300](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L286-L300)

未决生命周期动作的等待原因。

<details>
<summary>查看原文（15行）</summary>

```text
  private readonly pendingLifecycle = new Set<Promise<unknown>>()
  private startupReplay?: Promise<void>
  private unresolvedManager = false
  private readonly unverifiedRestartSkinIds = new Set<string>()
  private readonly componentUndo = new Map<string, Map<string, { skin: SkinEntry; entryId: string; enabled: boolean }>>()
  private readonly bundleUndo = new Map<string, Map<string, { skin: SkinEntry; enabled: boolean; binding: string }>>()
  private readonly legacyBundleUndo = new Map<string, Map<string, { skin: SkinEntry; packages: string[]; binding: string }>>()
  private readonly pendingConfigurationRepairs = new Map<string, ConfigurationRepairApproval>()
  private readonly failedConfigurationBindings = new Map<string, string>()
  private readonly pendingSelectionConfigurations = new Map<string, string>()
  private readonly registryPlanCache = new Map<string, string[] | undefined>()

  get waitingReason(): string | undefined {
    if (this.unresolvedManager) return '宿主未返回可确认的操作结果，请重新打开宿主后核对插件状态'
    if (this.pendingLifecycle.size > 0) return '插件仍在完成启停，结果尚未确认；暂时不能继续修改此 profile'
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:705-714](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L705-L714)

保存未完成操作的等待状态。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:2720-2743](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L2720-L2743)

停用、重启与选择回滚。

<details>
<summary>查看原文（24行）</summary>

```text
  private async deactivateLocked(operation: Operation): Promise<void> {
    const skin = this.skin(operation.skinId)
    this.update(operation, 'activating')
    const previous = readMarketState(this.options.profileDir)
    const selection = this.selectionSnapshot()
    const state = { ...previous, pinnedSkinIds: pinnedSkinIds(previous) }
    state.activeSkinId = state.activeSkinId === skin.id ? null : state.activeSkinId
    state.pinnedSkinIds = state.pinnedSkinIds.filter(id => id !== skin.id)
    const enabled = this.enabledSkinIds(previous)
    enabled.delete(skin.id)
    this.reconcileDisabledSkinIds(state, enabled)
    try {
      await this.registerSkin( skin, true)
      await this.setEntryDisabled(skin, true)
      await this.syncInstalledCompanions(state, true)
      await this.syncManagedLoaders(state, true)
      this.recordSelectionRestart(previous, state, skin, operation)
      writeMarketState(this.options.profileDir, state)
      operation.message = operation.restartRequired === true
        ? 'skin disabled; restart DSH to apply the change'
        : this.enabledSkinIds(state).size === 0 ? 'DSH default appearance restored; package kept installed' : 'skin disabled; other enabled skins were kept active'
    } catch (error) {
      await this.rollbackSelection(previous, selection)
      throw error
```

</details>

**依据 4 · 源码核查**：[src/reset.ts:21-32](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/reset.ts#L21-L32)

重置按目录内已安装目标处理。

<details>
<summary>查看原文（12行）</summary>

```text
export function resetManagedSkins(profileDir: string, catalog: SkinEntry[] = loadCatalog().skins): ResetResult {
  const manifestSnapshot = snapshotFile(manifestFile(profileDir))
  const patchSnapshot = snapshotFile(profilePatchFile(profileDir))
  const stateSnapshot = snapshotFile(marketStateFile(profileDir))
  const dependencies = readDependencies(profileDir)
  const installed = catalog.filter(skin => dependencies[skin.package] !== undefined)

  try {
    const state = readMarketState(profileDir)
    for (const skin of installed) ensureSkinRegistration(profileDir, skin, true)
    const seenCompanions = new Set<string>()
    for (const skin of catalog) {
```

</details>

#### 缺口

- 未测试进程超时、异步完成与重启
  **影响**：不能保证恰好一次或完全恢复
  **进一步探讨**：用假管理器延迟响应并核对配置与真实加载。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 外部包、宿主兼容、费用及退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:1-4、37-50 描述皮肤市场及 Web 客户端依赖；README:53-61 将 Web 和官方 Desktop 的安装与启用流程分开。目录目标固定和格式校验不是代码安全或宿主兼容证明；视觉性能、可访问性和不同皮肤冲突须实测。用户可先用已审查目标在隔离 profile 试一款，确认安装、保存选择及真实界面；来源不明、界面异常或加载状态未知时暂停，退回原主题并核对重启状态。安装资源、人工排障与恢复时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/package.json#L1-L4)

插件版本及功能说明。

```text
{
  "name": "dsh-skin-market",
  "version": "0.1.72",
  "description": "Native skin marketplace and lifecycle manager for DeepSeek Harness",
```

**依据 2 · 源码核查**：[package.json:37-50](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/package.json#L37-L50)

宿主 peer 与 Web 接入。

<details>
<summary>查看原文（14行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
```

</details>

**依据 3 · 作者声明**：[README.md:53-61](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/README.md#L53-L61)

作者区分 Web 与 Desktop 流程。

````text
**安装提示词**

```text
请帮我安装 dsh-skin-market。先只读确认当前是 Web 版还是官方 Desktop，以及当前宿主和实际 profile。Web 查看 dsh --version；官方 Desktop 以应用“关于”中的版本为准，不把系统终端的 npm dsh 版本当作桌面版本。无法读取应用信息时，请让我提供该版本；无法判断宿主就先问我。

- Web 版：执行 dsh plugin --profile web add "dsh-skin-market@latest"，然后核对同一 web profile 中的依赖和 bundle。
- 官方 Desktop：你负责只读核查和操作指导，安装、启用及重启由我在应用界面完成。不要代我点击安装或启用，不要执行 dsh plugin --profile desktop、pnpm 或其他安装命令，也不要修改 Desktop profile。每次只给下一项操作，等我反馈后继续：打开「插件 → 添加插件」，输入 dsh-skin-market@latest，确认安装结果，再按应用提示启用；需要重启时指导我完全退出并重新打开应用。

这次只安装皮肤市场，不做其他皮肤的冲突检查，也不要求停用它们。不要替我安装其他皮肤。安装后告诉我从哪里打开「皮肤市场」；Desktop 以插件页状态和我的实际操作反馈核对结果，没有核实就不要声称安装或启用成功。不要读取 .env、凭据或聊天记录。
````

**依据 4 · 源码核查**：[src/catalog.ts:22-48](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/catalog.ts#L22-L48)

目标一致性而非安全审计。

<details>
<summary>查看原文（27行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/lifecycle.ts:2720-2743](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L2720-L2743)

停用与重启状态。

<details>
<summary>查看原文（24行）</summary>

```text
  private async deactivateLocked(operation: Operation): Promise<void> {
    const skin = this.skin(operation.skinId)
    this.update(operation, 'activating')
    const previous = readMarketState(this.options.profileDir)
    const selection = this.selectionSnapshot()
    const state = { ...previous, pinnedSkinIds: pinnedSkinIds(previous) }
    state.activeSkinId = state.activeSkinId === skin.id ? null : state.activeSkinId
    state.pinnedSkinIds = state.pinnedSkinIds.filter(id => id !== skin.id)
    const enabled = this.enabledSkinIds(previous)
    enabled.delete(skin.id)
    this.reconcileDisabledSkinIds(state, enabled)
    try {
      await this.registerSkin( skin, true)
      await this.setEntryDisabled(skin, true)
      await this.syncInstalledCompanions(state, true)
      await this.syncManagedLoaders(state, true)
      this.recordSelectionRestart(previous, state, skin, operation)
      writeMarketState(this.options.profileDir, state)
      operation.message = operation.restartRequired === true
        ? 'skin disabled; restart DSH to apply the change'
        : this.enabledSkinIds(state).size === 0 ? 'DSH default appearance restored; package kept installed' : 'skin disabled; other enabled skins were kept active'
    } catch (error) {
      await this.rollbackSelection(previous, selection)
      throw error
```

</details>

#### 缺口

- 未实测宿主、皮肤安全和视觉效果
  **影响**：无法保证兼容、性能或无障碍
  **进一步探讨**：先审查固定包，在隔离 profile 试用并恢复默认。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否通过统一收据减少用户误判和重复安装？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有生命周期状态、waitingReason、选择回滚和重启提示；仅加进度条或错误日志不构成增量。未验证设想是按一次换肤展示包安装、选择保存、loader 确认、客户端渲染和重启需求的逐层收据，每层有证据来源和 unknown，允许用户停止，不能把保存选择或超时当作皮肤已生效。依赖宿主公开可核验 loader 与客户端状态，不记录凭据。以现有状态和日志为对照，模拟安装成功未加载、延迟完成、重启、客户端渲染失败和包冲突，比较误重装、误判完成、排查时间与负担；未知被当成功、重复副作用不降或负担过高则否定。先核现有 UI 是否已有等价聚合。

#### 证据与依据

**依据 1 · 源码核查**：[src/lifecycle.ts:286-300](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L286-L300)

现有等待状态。

<details>
<summary>查看原文（15行）</summary>

```text
  private readonly pendingLifecycle = new Set<Promise<unknown>>()
  private startupReplay?: Promise<void>
  private unresolvedManager = false
  private readonly unverifiedRestartSkinIds = new Set<string>()
  private readonly componentUndo = new Map<string, Map<string, { skin: SkinEntry; entryId: string; enabled: boolean }>>()
  private readonly bundleUndo = new Map<string, Map<string, { skin: SkinEntry; enabled: boolean; binding: string }>>()
  private readonly legacyBundleUndo = new Map<string, Map<string, { skin: SkinEntry; packages: string[]; binding: string }>>()
  private readonly pendingConfigurationRepairs = new Map<string, ConfigurationRepairApproval>()
  private readonly failedConfigurationBindings = new Map<string, string>()
  private readonly pendingSelectionConfigurations = new Map<string, string>()
  private readonly registryPlanCache = new Map<string, string[] | undefined>()

  get waitingReason(): string | undefined {
    if (this.unresolvedManager) return '宿主未返回可确认的操作结果，请重新打开宿主后核对插件状态'
    if (this.pendingLifecycle.size > 0) return '插件仍在完成启停，结果尚未确认；暂时不能继续修改此 profile'
```

</details>

**依据 2 · 源码核查**：[src/lifecycle.ts:705-714](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L705-L714)

未完成生命周期操作跟踪。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/lifecycle.ts:2680-2707](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/lifecycle.ts#L2680-L2707)

现有加载与重启提示。

<details>
<summary>查看原文（28行）</summary>

```text
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
      }
      if (operation.restartRequired === true) {
        operation.message = 'activation saved; restart DSH to load this skin'
      } else {
        operation.message = active?.found && active.live ? 'skin is active' : '启用设置已保存，但皮肤组件尚未运行；请在官方插件页检查加载状态'
```

</details>

**依据 4 · 源码核查**：[src/reset.ts:21-32](https://github.com/kingOfSoySauce/dsh-skin-market/blob/4b73f2f290d883dcebed49be92e8434315ac8537/src/reset.ts#L21-L32)

重置目标范围。

<details>
<summary>查看原文（12行）</summary>

```text
export function resetManagedSkins(profileDir: string, catalog: SkinEntry[] = loadCatalog().skins): ResetResult {
  const manifestSnapshot = snapshotFile(manifestFile(profileDir))
  const patchSnapshot = snapshotFile(profilePatchFile(profileDir))
  const stateSnapshot = snapshotFile(marketStateFile(profileDir))
  const dependencies = readDependencies(profileDir)
  const installed = catalog.filter(skin => dependencies[skin.package] !== undefined)

  try {
    const state = readMarketState(profileDir)
    for (const skin of installed) ensureSkinRegistration(profileDir, skin, true)
    const seenCompanions = new Set<string>()
    for (const skin of catalog) {
```

</details>

#### 缺口

- 未穷尽 UI 是否已有等价收据，也没有原型
  **影响**：无法证明增量和收益
  **进一步探讨**：先核现有界面，再在假宿主上做故障对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
