# DSH Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[88de957](https://github.com/dsh-market/dsh-market/tree/88de9575946485c1dac5e1a5fbe57fa1f3c3988c)

<!-- BEGIN META -->
[![GitHub ★ 12,571](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C571&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 1,289,262](https://img.shields.io/static/v1?label=npm+30d&message=1%2C289%2C262&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览、搜索、安装和管理社区插件。

> **亮点**：市场把候选包声明、当前宿主和安装后的激活结果带入同一个交互。候选筛选只隐藏明确冲突，安装回执再区分已落盘、已激活和需要后续处置。后台提醒只把已装包的具体更新带到用户面前，由用户决定是否变更。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

> **主要限制**：安装成功回执、管理器状态和插件实际功能可能在不同时间生效。Desktop 拆换更新仍可能先移除旧包，补偿日志依赖下次启动、正确 profile 和可用来源，配置快照的恢复范围也有限。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 原生 Discover 可浏览同一目录时，市场在检查哪些候选可装上仍增加哪一步？](#detail-section-11)
  - [Q02 · 点击安装时，来源、目标 profile 和激活回执怎样收敛到同一个任务？](#detail-section-12)
  - [Q03 · 热挂载失败或 Desktop 更新在卸载后中断时，可以恢复什么？](#detail-section-13)
  - [Q04 · 后台更新检查如何产生可消除的提醒，网络出错或切换来源后有何边界？](#detail-section-14)
  - [Q05 · 怎样以可逆试用比较多个插件的更新摩擦，哪些证据足以继续采用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：常驻 DSH Web 且维护多个社区包的用户，可以从市场页核对候选兼容范围、安装来源和更新状态。

原生 Discover 可订阅同一目录的格式一索引（项目自述）。按名称偶尔找包可用原生入口，熟悉 CLI 的用户可指定 profile 并手工检查插件功能。市场增加了候选声明筛选、同页操作回执和可选的未读更新提醒。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 市场页签 | 看候选声明、来源和安装状态 | 宿主支持 Web 原语；未知兼容仍可见 |
| 安装与激活 | 把包写入正确的 profile 并核对启动状态 | 依赖可信目录、可达产物和相应包管理服务 |
| 更新通知 | 让常驻宿主在用户启用后提示新版本 | 红点表示待看更新，后台没有自动安装 |
| 中断补偿 | 在官方桌面启动后尝试补装缺失包 | 需日志、可用来源和管理器，配置与数据保全范围有限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis、webServer、loader 与适配的 Web 客户端插槽 | 启动必需 | 挂载服务与市场页面 | 缺必需 UI 原语时市场页不挂载 |
| 活动 profile 的包管理命令，或 Desktop 提供的相应服务 | 包操作必需 | 将包变更落到当前 profile | 服务不可用则从宿主管理入口诊断 |
| 可达目录及安装物来源、与宿主匹配的目标包 | 发现和安装必需 | 加载目录、核对兼容及执行下载 | 无法核实的兼容保持未知，无法取包时无合格安装 |
| 可用浏览器存储与可装饰的组件插槽 | 持久未读提醒使用 | 保存目标指纹并显示红点 | 退回临时状态或宿主原入口 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户复制 profile 并确认客户端分支 | 识别当前 profile 与恢复路径 |
| 加载 | 宿主加载补丁及市场界面 | 能打开市场页并识别来源 |
| 操作 | 用户确认候选，后台交给相应包管理器 | 回执指向预定包、来源和目标版 |
| 验收 | 用户实际试用一项功能并退出试验 | 功能有效且可恢复，告警与功能异常先停查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载目录及安装物，支出未知 | 复制 profile、确认入口与来源，耗时未知 | 包构建与网络情况会改变负担 |
| 持续使用 | 检查请求、下载与缓存占用未测 | 人工决定是否升级并验证，耗时未知 | 定时检查可关，失败可能退避 |
| 失败恢复 | 重新取包、维护快照或完整副本，支出未知 | 检查实际状态、恢复数据与重测，耗时未知 | 快照不含第三方插件自写数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 候选选择 | 排除声明不符并保留未知项 | 判断速度、误筛和未知占比 |
| 安装复核 | 区分目标 profile、包落盘与插件激活 | 核心功能成功率、跨宿主兼容 |
| 更新提醒 | 从已装目标指纹生成可消除提示 | 用户节时和提醒误扰 |
| 恢复 | 对特定配置文件和中断路径执行补偿 | 实际数据完整率与人工恢复成本 |

> **思考**：安装成功回执、管理器状态和插件实际功能可能在不同时间生效。Desktop 拆换更新仍可能先移除旧包，补偿日志依赖下次启动、正确 profile 和可用来源，配置快照的恢复范围也有限。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：市场把候选包声明、当前宿主和安装后的激活结果带入同一个交互。候选筛选只隐藏明确冲突，安装回执再区分已落盘、已激活和需要后续处置。后台提醒只把已装包的具体更新带到用户面前，由用户决定是否变更。[Q01](#research-q01) [Q02](#research-q02) [Q04](#research-q04)

作用域用活动 profile 锚定。桌面 manager 与 Web 命令具有不同职责，安装操作围绕变更锁、激活判断和限时补偿组织；可复用部分是把已装身份、变更执行和可观察结果拆开持久化。新宿主需提供稳定的 profile 与组合状态，受限设置中图标和热挂载会退化。

<a id="detail-section-5"></a>

### 1.4 主要限制

安装成功回执、管理器状态和插件实际功能可能在不同时间生效。Desktop 拆换更新仍可能先移除旧包，补偿日志依赖下次启动、正确 profile 和可用来源，配置快照的恢复范围也有限。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在复制的 Web profile 装一个已知来源的非关键插件，对照目标包和实际激活，确认能恢复副本。来源、包版本或功能无法对上时停止；仅需发现目录可沿用宿主 Discover。 [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持市场注册、profile 路由、后台检查和有条件的恢复机制。更新后的功能验收和提醒带来的节时尚无结果数据。合并来源、兼容与功能探针是待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/MarketSection.tsx、src/client/PluginsUpdateIndicator.tsx、src/client/index.ts、src/client/update-notifications.ts、src/discovery-compatibility.ts、src/hot.ts、src/index.ts、src/official-desktop.ts、src/pending-updates.ts、src/routes.ts、src/snapshot.ts、src/update-notifications.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库根代码，按宿主接线、兼容、更新通知和恢复关键路径抽查。副本中的兼容、进程中断和端到端操作耗时留待验证。
- 下一步：用同一包、目标版本与宿主版本进行原生入口和市场的配对试用。记录每次来源确认、落盘、激活、功能检查和退出结果，中断场景以副本中的复位结果为准。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.73.20（[固定提交 88de957](https://github.com/dsh-market/dsh-market/tree/88de9575946485c1dac5e1a5fbe57fa1f3c3988c)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在待更新项上同时保留来源、宿主声明和实际功能探针，可能缩短更新后排障时间。以已装包和相同任务做对照，测量首次安装、受控失败和退回原状态的总时间；若误报增加或合格率与排障时间持平，则不支持该设计。[Q05](#research-q05)

用同一包、目标版本与宿主版本进行原生入口和市场的配对试用。记录每次来源确认、落盘、激活、功能检查和退出结果，中断场景以副本中的复位结果为准。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1216 | — | — | 20304 |
| .js | source | 1 | 20726 | 18294 | 3798 | — |
| .mjs | source | 15 | 2214 | 1560 | 531 | — |
| .ts | source | 85 | 44779 | 27634 | 15383 | — |
| .tsx | source | 15 | 14020 | 10897 | 2832 | — |
| .ts | test | 120 | 54447 | 41161 | 9663 | — |
| .tsx | test | 14 | 15244 | 12576 | 1696 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 6 | 252 | 80 | 155 | — |

</details>

**活跃度**

[![Issue 未关闭 115](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=115&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 175](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=175&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 92](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=92&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在有多个插件的 DSH profile 中，用户如何从候选仓库或当前安装记录走到可核实的安装和更新结果，什么失败会让图形工作流失去优势？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生 Discover 可浏览同一目录时，市场在检查哪些候选可装上仍增加哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

市场让维护多个第三方插件的 Web 用户在同一页先筛掉声明明确不兼容的候选，再进入安装和本地状态核对。README 给出了原生 Discover 使用同一索引的做法，已经满足按目录找名字的用户可以继续用它。市场的可核查增量在候选包和本机版本的比对。GitHub 的目录兼容事实须匹配同仓库的精确 Release tarball，清单不足或绑定不符由查清单路径补充。兼容计算读取 engines.dsh、已知 DSH 锁步包的 peer 和普通依赖声明，普通依赖同样可能把冲突版本装进 profile。

市场先固定分页范围，再按当前结果隐藏明确不兼容的卡片。未查、没有声明、无法获取清单或无法解析的候选仍显示，用户可避免一部分明显失败的下载，仍需自己确认未知项。卡片兼容也不能覆盖浏览器 slot、构建产物或主题与当前其他插件的交互。清单缓存可复用包事实，具体判断仍依赖当前宿主，也不会替换实际激活回执。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:11-14](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/README.md#L11-L14)

作者提供同源 Discover 索引，支持把原生市场作为查找基线。

```text

The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 2 · 源码核查**：[src/discovery-compatibility.ts:70-104](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/discovery-compatibility.ts#L70-L104)

目录事实绑定同仓库和精确归档，同时版本提示参与身份。

<details>
<summary>查看原文（35行）</summary>

```text
/** Only the selected artifact and its declarations determine a discovery verdict. */
export function githubCompatibilityRevision(source: GitHubManifestSource): string {
  const facts = catalogReleaseManifest(source)
  return createHash('sha256').update(JSON.stringify([
    source.url,
    source.tarball ?? null,
    range(source.version),
    facts === null ? null : [facts.version, facts.enginesDsh,
      Object.entries(facts.peerDependencies).sort(), Object.entries(facts.dependencies ?? {}).sort()],
  ])).digest('hex')
}

/** Reuse catalog facts only for this repository's exact pinned install asset. */
export function catalogReleaseManifest(source: GitHubManifestSource): NpmManifestFacts | null {
  const facts = record(source.releaseManifest)
  const repository = parseSourceUrl(source.url)?.repo
  const release = /^https:\/\/github\.com\/([^/]+\/[^/]+)\/releases\/download\/[^/]+\/[^/?#]+\.(?:tgz|tar\.gz)$/.exec(source.tarball ?? '')
  if (facts === null || !repository || !release || release[1]!.toLowerCase() !== repository.toLowerCase()
    || facts.tarball !== source.tarball || !validFacts(facts)) return null
  return {
    version: facts.version,
    enginesDsh: facts.enginesDsh,
    peerDependencies: facts.peerDependencies,
    dependencies: facts.dependencies ?? {},
  }
}

function npmDiscoveryKey(name: string, registry: string, version: string | undefined): string {
  return version === undefined ? name : `npm:${registry}\u0000${name}\u0000${version}`
}

function githubDiscoveryKey(source: GitHubManifestSource): string {
  const key = `github:${source.url}\u0000${source.tarball ?? ''}`
  const version = range(source.version)
  return version === null ? key : `${key}\u0000${version}`
```

</details>

**依据 3 · 源码核查**：[src/discovery-compatibility.ts:292-339](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/discovery-compatibility.ts#L292-L339)

锁步依赖和引擎范围参与判断，声明或宿主缺失回到未知。

<details>
<summary>查看原文（48行）</summary>

```text
export function deriveHostCompatibility(
  facts: NpmManifestFacts | null,
  hostVersion: string | null,
  hostPackages: ReadonlySet<string>,
): HostCompatibility {
  if (facts === null) {
    return { status: 'unknown', basis: 'unavailable', requirement: null, declarations: [] }
  }
  const declarations: HostRequirementDeclaration[] = []
  if (facts.enginesDsh !== null) {
    declarations.push({ kind: 'engine', range: facts.enginesDsh })
  }
  for (const [name, declared] of Object.entries(facts.peerDependencies)) {
    // Cordis (4.x) and schemastery (3.x) are host packages, but are not on
    // DSH's lockstep 0.x release line and therefore say nothing about the
    // DSH version. `hostPackages` is the local install inventory plus its
    // curated fallback, so future lockstep DSH packages are picked up too.
    if (!hostPackages.has(name) || !/^@deepseek-ai\/dsh(?:-|$)/.test(name)) continue
    declarations.push({ kind: 'peer', package: name, range: declared })
  }
  for (const [name, declared] of Object.entries(facts.dependencies ?? {})) {
    // The peer filter above restricts itself to DSH's lockstep line because a
    // peer range on cordis or schemastery says nothing about the DSH version.
    // A dependency is different: it names a package the host itself provides,
    // and pnpm will install the declared copy and hoist it over the host's.
    // That is the dsh-qqbot failure — @deepseek-ai/dsh-settings and
    // dsh-credentials as ordinary dependencies at `^0.1.0-rc.5` over a
    // 0.2.2-rc.1 runtime — which the peer-only check could not see.
    // Still only the lockstep line: the range is judged against the DSH
    // version, and cordis (4.x) / schemastery (3.x) are not on it — a plugin
    // that depends on `@deepseek-ai/cordis@^4` would otherwise read as
    // incompatible with every host.
    if (!hostPackages.has(name) || !/^@deepseek-ai\/dsh(?:-|$)/.test(name)) continue
    declarations.push({ kind: 'dependency', package: name, range: declared })
  }
  const requirement = displayRequirement(declarations)
  if (declarations.length === 0) {
    return { status: 'unknown', basis: 'undeclared', requirement: null, declarations: [] }
  }
  if (hostVersion === null) {
    return { status: 'unknown', basis: 'manifest', requirement, declarations }
  }
  const outcomes = declarations.map(item => declarationResult(item, hostVersion))
  const status: HostCompatibilityStatus = outcomes.some(item => item === false)
    ? 'incompatible'
    : outcomes.every(item => item === true)
      ? 'compatible'
      : 'unknown'
```

</details>

**依据 4 · 源码核查**：[src/discovery-compatibility.ts:407-424](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/discovery-compatibility.ts#L407-L424)

缓存复用的是仍在 TTL 内且匹配预期版本的包事实，查询另有冷却。

<details>
<summary>查看原文（18行）</summary>

```text
  private async fetchOne(
    cacheKey: string,
    record: boolean,
    readManifest: () => Promise<NpmManifestFacts>,
    expectedVersion?: string,
  ): Promise<NpmManifestFacts | null> {
    const cached = await this.cache.get(cacheKey)
    const now = this.now()
    if (cached !== undefined && now - cached.checkedAt < this.ttlMs
      && (expectedVersion === undefined || cached.facts.version === expectedVersion)) return cached.facts
    if (this.retryDelay(cacheKey, now) > 0) return null
    // Advisory and recording lookups keep separate in-flight slots: an
    // advisory call must not be answered by — or hand its answer to — a
    // recording one, or `record` would stop meaning anything when the two
    // overlap on the same package.
    const key = record ? cacheKey : `${cacheKey}\u0000advisory`
    const pending = this.inflight.get(key)
    if (pending !== undefined) return await pending
```

</details>

**依据 5 · 源码核查**：[src/client/MarketSection.tsx:4471-4487](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/MarketSection.tsx#L4471-L4487)

先固定页面片段，明确不兼容才过滤。

<details>
<summary>查看原文（17行）</summary>

```text
  // Fix the slice before compatibility resolves. Hiding a card must not
  // pull in an unchecked replacement and start another batch.
  const discoverResetDeps = [q, cat, sortField, sortDir, timeRange]
  const { currentPage, totalPages, pageSize, goToPage, changePageSize } =
    usePagination(pluginsUnblocked.length, discoverResetDeps, scrollToTop)
  const discoverMore = useShownCount(pluginsUnblocked.length, discoverResetDeps, DEFAULT_PAGE_SIZE)
  const basePage = surface === 'plugins'
    ? pluginsUnblocked.slice(0, discoverMore.shown)
    : pluginsUnblocked.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  const baseRecent = recentlyAdded.slice(0, RECENT_STRIP_LIMIT)
  const hostVerdict = (plugin: RegistryPlugin) => {
    const key = hostCompatibilityKey(plugin)
    return key === null ? undefined : hostCompatibility[key]
  }
  const compatible = (plugin: RegistryPlugin): boolean =>
    !compatibleWithHost || hostVerdict(plugin)?.status !== 'incompatible'
  const pagePlugins = basePage.filter(compatible)
```

</details>

#### 缺口

- 进入用户实际候选结果的未知比例及误筛数尚无对照。
  **影响**：决定它是否比逐一检查清单省力。
  **进一步探讨**：选相同已声明、未声明、子包和不可达候选，在同一宿主人工核对所选安装物的清单及最终激活状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 点击安装时，来源、目标 profile 和激活回执怎样收敛到同一个任务？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

市场服务端要求同源 POST，并在并发变更锁内用目录条目约束下载来源，未知 URL 直接返回错误。来源检查是操作允许范围，无法代替审核第三方代码。普通 Web 选择显式 profile、启动器 profile、启动参数或 web 默认值，并使用启动器给出的包管理器信息（存在时）。官方 Desktop 的 desktop profile 调用 pluginManager，按请求时查找服务。提供 desktopProfiles 的第三方宿主走 desktopPnpm，可另外提供重放桥。这个分支选择决定用户从哪里看到包、由哪个进程卸载和重启；用户应先核对活动 profile，别把 CLI 写进另一个 profile 的结果当成市场故障。

落盘与生效分别处理。普通路径优先等宿主重放，按运行条目或补丁插入 ID 识别已有激活，避免重复挂载，再按是否有宿主半部检查 peer 门槛并尝试热挂载。客户端用回执分别提示 live、不兼容和等待重启，不兼容时不承诺重启可解决。安装命令碰到宿主端口占用但确有落盘时仍可能被视为安装成功，最终使用动作仍需在对应 profile 里确认。客户端缺少必需原语时会退出挂载，因此服务可达也不能代替页面出现。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:7910-7965](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L7910-L7965)

同源、锁和目录条目校验限制安装请求。

<details>
<summary>查看原文（56行）</summary>

```text
    registerRoute(captureLegacy('/dsh-market/install', {
      kind: 'exact',
      path: '/dsh-market/install',
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }
        // Set once the package is on disk, so a failure after that point is not reported as a failed install.
        let installLanded = false
        try {
          const body = (await readJsonBody(request)) as {
            url?: unknown
            force?: unknown
            version?: unknown
            busyPolicy?: unknown
          }
          const drainCall = drainCallOf(request)
          if (drainCall === undefined && body.busyPolicy === 'drain') {
            const requestedUrl = typeof body.url === 'string' ? body.url : ''
            await handleDrainRequest(
              response,
              request,
              'install',
              body as Record<string, unknown>,
              requestedUrl === '' ? 'install' : requestedUrl,
              requestedUrl === '' ? undefined : requestedUrl,
            )
            return
          }
          await withMutationLock(response, 'install', async () => {
            const force = body.force === true
            const url = typeof body.url === 'string' ? body.url : ''
            // A release the user picked from the refusal dialog's own search
            // (#581): it was confirmed compatible by /dsh-market/find-compatible,
            // so it is pinned below instead of resolving `latest` again.
            const requestedVersion = typeof body.version === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(body.version)
              ? body.version
              : null
            const registry = await loadRegistry()
            const entry = registry.plugins.find(p => p.url.toLowerCase() === url.toLowerCase())
            if (entry === undefined) {
              logEvent('warn', 'install-rejected', `not in curated registry: ${url.slice(0, 120)}`)
              sendJson(response, 400, { error: 'plugin is not in the curated registry' })
              return
            }
            const plainTarget = installTargetFor(entry)
            if (plainTarget === null) {
              sendJson(response, 400, { error: 'unsupported source url' })
              return
            }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:321-346](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/index.ts#L321-L346)

官方 desktop profile 选择实时查询的 manager。

<details>
<summary>查看原文（26行）</summary>

```text
      const configured = config?.profile
      const configuredDesktop = configured !== undefined && configured.toLowerCase() === 'desktop'
      const officialElectron = launched !== undefined && launched.name.toLowerCase() === 'desktop'
      // An explicitly configured `profile: desktop` takes this branch too. The
      // CLI refuses that profile by NAME (see above — from inside the running
      // app on every version), so routing it there — which is what
      // an operator's own workaround for a host that hides `profileContext`
      // does (#744) — makes every install fail for certain. The configuration
      // still wins over the launcher for the name; it just cannot win a branch
      // that is guaranteed to fail.
      if (configuredDesktop || (configured === undefined && officialElectron)) {
        const profileName = configured ?? launched!.name
        // The launcher owns where a profile lives — and its directory rides
        // along only when the launcher is the one that named this profile.
        const profileDirectory = launched !== undefined && launched.name.toLowerCase() === profileName.toLowerCase()
          ? launched.dir
          : undefined
        const runtime = createOfficialDesktopRuntime(
          () => hostCtx.get('pluginManager') as OfficialPluginManagerLike | undefined,
          profileName,
          profileDirectory,
          // Hand the invocation to the runtime only. Do not register it
          // globally: other official-desktop installs still go through the
          // manager (#702). The market itself is the one exception (#982).
          hostPackageManagerOf(profileContext),
        )
```

</details>

**依据 3 · 源码核查**：[src/index.ts:389-404](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/index.ts#L389-L404)

普通 Web 路径解析 profile 与启动器包管理器。

<details>
<summary>查看原文（16行）</summary>

```text
      // The launcher's own package manager, when it publishes one. Registering
      // it here covers both the pnpm probe and every install spawn, since the
      // invocation's environment reaches both through spawnEnv (#653).
      setHostPackageManager(hostPackageManagerOf(profileContext))
      const useLaunchedDir = config?.profile === undefined && launched !== undefined
      const resolved: MarketConfig = {
        profile: config?.profile ?? launched?.name ?? argvProfile() ?? 'web',
        ...(useLaunchedDir ? { profileDirectory: launched.dir } : {}),
        origin: {
          profileSource: config?.profile !== undefined ? 'configured (cordis.yml)'
            : launched !== undefined ? 'launcher profileContext'
            : argvProfile() !== undefined ? '--profile flag'
            : 'default (no configured profile, no launcher profileContext, no --profile flag)',
          launcherAtStart: describeProfileContext(profileContext),
          launcherNow: () => describeProfileContext(ctx.get('profileContext')),
        },
```

</details>

**依据 4 · 源码核查**：[src/index.ts:435-456](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/index.ts#L435-L456)

第三方桌面使用 desktopPnpm 与启动器 profile，重启交给宿主。

<details>
<summary>查看原文（22行）</summary>

```text
    hostCtx.inject(['desktopPnpm'], (desktopCtx: Context) => {
      const current = desktopProfiles.current
      const service = (desktopCtx as unknown as { desktopPnpm: DesktopPnpmLike }).desktopPnpm
      const runtime = createDesktopPluginRuntime(service, current.dir)
      const resolved: MarketConfig = {
        profile: current.name,
        profileDirectory: current.dir,
        origin: {
          profileSource: 'desktop shell (desktopProfiles)',
          launcherAtStart: describeProfileContext(ctx.get('profileContext')),
          launcherNow: () => describeProfileContext(ctx.get('profileContext')),
        },
        // The shell owns the window and the process lifecycle here; the
        // capability bits report that, and an explicit profile directory no
        // longer implies it (#639).
        desktopHost: true,
        // A shell that cannot be asked to replay still replays on its own,
        // shortly after the install lands (#814): wait for it and adopt.
        ...(desktopProfiles.pluginActivation === undefined ? { hostReplayWaitMs: 8000 } : {}),
        // Relaunching a raw Electron process would bypass Desktop's launcher
        // lifecycle. The shell remains responsible for restart in this mode.
        allowRestart: false,
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:128-141](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/index.ts#L128-L141)

缺少必需界面原语时停止前端挂载。

<details>
<summary>查看原文（14行）</summary>

```text
  // settings list) rather than throwing mid-render and blanking the dialog.
  // Icons are different (#671): 0.1.7 renamed …14/…16 to weight names with no
  // alias. icons.ts accepts either spelling and skips a missing glyph so the
  // next rename costs one icon, not the whole page — do not fold icon gaps
  // into this hard disable.
  const mod = primitives as unknown as Record<string, unknown>
  const gaps = missingPrimitives(mod)
  if (gaps.length > 0) {
    console.warn('[dsh-market] host ui-primitives missing ' + gaps.join(', ') + ' — market section disabled (dsh web >= 0.1.0-rc.6 required)')
    return
  }
  const iconGaps = missingIcons(mod)
  if (iconGaps.length > 0) {
    console.warn('[dsh-market] host ui-primitives missing icons ' + iconGaps.join(', ') + ' — rendering without them')
```

</details>

**依据 6 · 源码核查**：[src/routes.ts:8370-8428](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L8370-L8428)

识别宿主重放，兼容门控后热挂载，再核对激活结果。

<details>
<summary>查看原文（59行）</summary>

```text
                    const isAdopted = (): boolean => {
                      const names = liveNames()
                      return names.has(name)
                        || names.has(`#${name}`)
                        || bundlePatchInsertedIds(join(activeProfileDir, 'node_modules', name))
                          .some(id => names.has(`#${id}`))
                    }
                    let adopted = isAdopted()
                    // The replay lands after pnpm returns, not before (#814):
                    // give a host that replays on its own the time to do it.
                    // The profile watcher replays only what the manifest lists
                    // as a bundle, so a client-only package is not waited for.
                    const replayWaitMs = config.hostReplayWaitMs
                      ?? (declaresBundle(activeProfileDir, name) && liveNames().has(PROFILE_HMR_ENTRY) ? PROFILE_HMR_REPLAY_WAIT_MS : 0)
                    const waitUntil = Date.now() + replayWaitMs
                    while (!adopted && Date.now() < waitUntil) {
                      await new Promise(resolve => setTimeout(resolve, 250))
                      adopted = isAdopted()
                    }
                    if (adopted && replayWaitMs > 0) {
                      logEvent('info', 'install', `${name}: the host's own replay activated it; adopted instead of mounting a second copy (#814, #827)`)
                    }
                    let live = adopted
                    if (!adopted && !pluginCategories(entry).includes('theme')) {
                      // #758: this fallback hot-mount bypasses the host's own
                      // boot gate, which would skip a peer-incompatible
                      // plugin on every boot. Check the same gate first and
                      // leave it unmounted when it would bite; the activation
                      // report below then reads incompatible. Client-only
                      // plugins never load in the host process, so the cap
                      // cannot bite — skip the gate for them (#758 review),
                      // matching what verifyActivation does outside bundles.
                      const gate = hasHostHalf(config.profile, name, activeProfileDir)
                        ? hostPeerGate(activeProfileDir, name, defaultHostRuntimeFacts(activeProfileDir))
                        : null
                      if (gate !== null) {
                        logEvent('warn', 'install', `${name}: ${gate.peer} ${gate.range} excludes runtime ${gate.runtimeVersion}; leaving it unmounted for the next boot to skip (#757)`)
                        live = false
                      } else {
                        live = (await hotMount(host, activeProfileDir, name)).ok
                      }
                    } else if (!adopted) {
                      const result = await themes.activateTheme(name)
                      live = result.ok
                      if (result.reason !== undefined) themeFailures.set(name, result.reason)
                    }
                    if (!live) hot = false
                  }
                }
                activation = {}
                const live = liveNames()
                // Same facts the mount decision above used, so the verdict
                // cannot disagree with it within one request.
                const hostFacts = defaultHostRuntimeFacts(activeProfileDir)
                for (const name of added) {
                  const result = verifyActivation(config.profile, name, live, activeProfileDir, disabled.has(name), hostFacts)
                  const failure = themeFailures.get(name)
                  activation[name] = failure === undefined
                    ? result
```

</details>

**依据 7 · 源码核查**：[src/client/MarketSection.tsx:4711-4731](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/MarketSection.tsx#L4711-L4731)

界面区分已热挂载、未生效与不兼容。

<details>
<summary>查看原文（21行）</summary>

```text
        if (status === 200 && body.ok) {
          if (body.activation && typeof body.activation === 'object') {
            setActivations(prev => ({ ...prev, ...body.activation }))
            const warns = Object.entries(body.activation as Record<string, ActivationInfo>)
              .filter(([, info]) => info.state !== 'live' && info.state !== 'missing' && info.loadedByProfile !== true && info.library !== true)
              .map(([name, info]) => ({ name, info }))
            setActivationWarnings(warns)
          }
          if (body.hot) {
            // The status-poll recovery path may have already counted this URL
            // as pending-restart before the install response confirmed a hot
            // mount; a hot plugin must not stay in doneUrls (#73).
            setDoneUrls(urls => urls.filter(url => url !== plugin.url))
            setHotUrls(urls => urls.includes(plugin.url) ? urls : urls.concat(plugin.url))
            setHotNames(names => names.includes(plugin.name) ? names : names.concat(plugin.name))
          } else if (body.activation?.[plugin.name]?.state !== 'incompatible' && body.activation?.[plugin.name]?.library !== true) {
            // An incompatible plugin stays incompatible across restarts, so
            // "restart to apply" would promise a fix no restart can deliver;
            // the activation warning on the installed card already says what
            // to do instead.
            setDoneUrls(urls => urls.includes(plugin.url) ? urls : urls.concat(plugin.url))
```

</details>

#### 缺口

- 不同桌面构建中的服务出现顺序、代理同源头和插件实际起动未对照。
  **影响**：源码分支存在不能保证用户机器有该入口或能安装。
  **进一步探讨**：在可丢弃 Web 与有代表性的 Desktop profile 分别装一个非关键包，核对服务分支、路径、回执与实际功能。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 热挂载失败或 Desktop 更新在卸载后中断时，可以恢复什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

热挂载超时首先解除请求对慢激活的等待，后台尽力释放挂载子树、删除临时重放文件，调用方返回需要重启的结果。释放本身不阻塞回复，重启也不能治愈不兼容或包缺产物。即便宿主对挂载作出成功判断，尚在等服务的入口仍可能没有提供实际功能，所以市场捕获该时段的宿主日志。安装失败路径会尝试恢复 manifest 和已捕获的 lockfile，日志能够指出恢复失败，不能据此推断包目录及插件自写数据恢复。

官方 Desktop manager 对同名安装返回 already-installed 时，市场先写带来源与目标版本的记录再拆旧包。移除失败或取消时按其回执清理记录，替换失败后把记录留给后续启动。启动修复要求落盘与组合同时满足才结清记录，已组合的无关版本不被自动覆盖，缺失包在达到三次自动尝试上限后交回用户。市场自身通过原位更新避免卸载正在运行的修复代码。配置快照只有 package.json、cordis.patch.yml 和市场 state，第三方插件数据与包内容没有进入这个工件。路由提供的操作回滚还取决于操作后 profile 校验和实际恢复来源，用户应另保留关键数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/hot.ts:1380-1424](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/hot.ts#L1380-L1424)

超时释放、失败返回与宿主待服务日志是不同结果。

<details>
<summary>查看原文（45行）</summary>

```text
    try {
      await raceActivationTimeout(handle.await())
    } catch (error) {
      mountLog.stop()
      // A failed or wedged mount must leave NOTHING behind: the disposed
      // subtree stops retrying the import, and the input file is removed so
      // it cannot be re-imported by a later boot or replay (a leftover file
      // re-throwing the same resolve error on every composition replay
      // produced unbounded error-log growth on a closure-hosted loader).
      try { Promise.resolve(handle.dispose()).catch(() => {}) } catch { /* best effort */ }
      try { rmSync(file, { force: true }) } catch { /* best effort */ }
      hotTrees.delete(pathToFileURL(file).href)
      if (error instanceof ActivationTimeout) {
        // A wedged activation would otherwise hold this request open forever:
        // the route's `finally { installing = false }` never runs, so every
        // later install/update/uninstall gets 409'd until a host restart.
        // Unwind the half-mounted subtree best-effort; disposal never blocks
        // the reply, and the caller falls back to restart activation.
      }
      throw error
    }
    hotHandles.set(packageName, handle)
    hotTreeOf.set(packageName, pathToFileURL(file).href)
    const failure = hotMountFailure(packageName, profileDir)
    const lines = mountLog.finish()
    if (failure === null) {
      ctx.logger?.info?.(`[dsh-market] hot-mounted ${packageName}`)
      logEvent('info', 'hot-mount', `${packageName}: live${shimNames.has(packageName) ? ' (client-only shim)' : ''}`)
    } else {
      ctx.logger?.warn(`[dsh-market] ${packageName}: ${failure}`)
      logEvent('warn', 'hot-mount', `${packageName}: ${failure}`)
    }
    // A mount that resolves while an entry is still waiting on a service is
    // "live" by the host's own verdict, so the verdict stands — but the lines
    // the host logged meanwhile are the only record of why the entry never
    // started serving (#1197).
    for (const line of lines) {
      logEvent('warn', 'hot-mount', `${packageName}: the host logged this while mounting — ${line}`)
    }
    return mountResult(failure)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    ctx.logger?.warn(`[dsh-market] hot mount of ${packageName} failed, restart required: ${message}`)
    logEvent('warn', 'hot-mount', `${packageName}: fell back to restart — ${message}`)
    return { ok: false, reason: `热挂载失败,重启后生效 — ${message} / hot-mount failed — restart required: ${message}` }
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:8263-8280](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L8263-L8280)

安装失败尝试恢复 manifest 和已记录 lockfile，端口冲突例外依赖实际落盘。

<details>
<summary>查看原文（18行）</summary>

```text
            drainPhaseOf(request)?.('verifying')
            const cancelled = result.cancelled
            const portCollisionLanded = !cancelled
              && isHostPortCollision(result)
              && installApplied(config.profile, before, activeProfileDir)
            if ((result.exitCode !== 0 || result.timedOut) && !cancelled && !portCollisionLanded) {
              const rolledBack = restoreProfileManifest(config.profile, manifestBefore, activeProfileDir)
              if (rolledBack.length > 0) logEvent('warn', 'install', `${target}: rolled back manifest residue of the failed run: ${rolledBack.join(', ')}`)
              if (lockfileBefore.ok) {
                const lock = restoreProfileLockfile(lockfileBefore.snapshot)
                if (!lock.ok) logEvent('warn', 'install', `${target}: could not restore pnpm-lock.yaml after the failed run: ${lock.detail ?? 'unknown'}`)
              }
            }
            let ok = (result.exitCode === 0 && !result.timedOut && !cancelled) || portCollisionLanded
            if (portCollisionLanded && result.exitCode !== 0) {
              logEvent('info', 'install', `${target}: command exited after the host port was already in use; the new plugin is on disk, treating as success (#975)`)
            }
            const cancelDiff = cancelled ? changedSince(beforeSpecs) : null
```

</details>

**依据 3 · 源码核查**：[src/official-desktop.ts:389-433](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/official-desktop.ts#L389-L433)

官方桌面拆装更新前写 journal，失败留修复记录，自身采用原位分支。

<details>
<summary>查看原文（45行）</summary>

```text
  if (first.application !== 'failed' || managementCode(first.error) !== 'already-installed') return first
  const name = registryNameOf(spec)
  // A refusal we cannot turn into a name is the manager's answer to give.
  if (name === undefined) return first
  // Removing the market would unload this very code before the reinstall runs
  // (#900). Overlay the version with the host's own pnpm instead — no remove.
  if (SELF_NAMES.has(name)) {
    return updateMarketInPlace(spec, name, options, context)
  }
  const record = context === undefined
    ? undefined
    : context.journal.begin({
      profile: context.profile,
      name,
      from: readInstalledVersion(context.profile, name, context.profileDirectory) ?? '',
      to: targetVersionOf(spec),
      spec,
    })
  progress.lastLine = '先移除旧版本，桌面端才能装新版本 / Removing the old version so the desktop app can install the new one'
  let removed: ManagedResult
  try {
    removed = await withDeadline(manager.removeBundle(name), REMOVE_DEADLINE_MS, `remove ${name}`)
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
    if (record !== undefined) context?.journal.finish(record.id)
    throw error
  }
  if (removed.application === 'failed' || removed.application === 'cancelled') {
    // Nothing was unloaded, so there is nothing for a later start to repair.
    if (record !== undefined) context?.journal.finish(record.id)
    return removed
  }
  if (record !== undefined) context?.journal.mark(record.id, 'installing')
  progress.lastLine = '正在安装新版本 / Installing the new version'
  try {
    const installed = await withDeadline(install(), INSTALL_DEADLINE_MS, `install ${spec}`)
    if (installed.application === 'failed' || installed.application === 'cancelled') {
      // The replacement did not land; the record stays so the next start can
      // put it back rather than leaving the package gone.
      return installed
    }
    if (record !== undefined) context?.journal.finish(record.id)
    return installed
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
```

</details>

**依据 4 · 源码核查**：[src/pending-updates.ts:230-244](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/pending-updates.ts#L230-L244)

自动恢复有启动次数和每次安装时间上限。

<details>
<summary>查看原文（15行）</summary>

```text
export const REPAIR_INSTALL_TIMEOUT_MS = 300_000

/**
 * How many starts may each spend up to REPAIR_INSTALL_TIMEOUT_MS trying to put
 * one package back before the market stops trying by itself.
 *
 * Retrying is right while the cause might be transient (offline, a registry
 * briefly down, the host still shutting down). It stops being right when every
 * start pays the full timeout for a spec that will never install — the shape a
 * reporter lived through on the Desktop host (#1061: five days of failing
 * reinstalls on every boot, all of it invisible). The record is kept, so the
 * package is not forgotten; only the automatic attempt stops, and the user is
 * told where to act.
 */
export const MAX_AUTO_REPAIR_ATTEMPTS = 3
```

</details>

**依据 5 · 源码核查**：[src/pending-updates.ts:329-373](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/pending-updates.ts#L329-L373)

结清需要安装及组合吻合，其他版本或重试上限有明确分支。

<details>
<summary>查看原文（45行）</summary>

```text
export async function repairInterruptedUpdates(options: RepairOptions): Promise<RepairReport> {
  const journal = options.journal ?? PendingUpdateJournal.forProfile(options.profileDirectory)
  const report: RepairReport = { reinstalled: [], finished: [], failed: [], abandoned: [] }
  const pending = journal.list().filter(entry => entry.profile === options.profile)
  for (const entry of pending) {
    const installed = readInstalledVersion(options.profile, entry.name, options.profileDirectory)
    const settled = composed(options.profile, options.profileDirectory, entry.name)
    // Settled means every half agrees: the build is on disk, the profile
    // declares it, and a bundle-layer package is listed as one. "On disk but
    // no longer composed" is the interrupted removal itself, so it falls
    // through to the reinstall.
    if (installed !== null && settled && (entry.to === '' || installed === entry.to || installed === entry.from)) {
      journal.finish(entry.id)
      report.finished.push(entry.name)
      continue
    }
    if (installed !== null && settled) {
      journal.bump(entry.id)
      report.failed.push({
        name: entry.name,
        reason: `installed version ${installed} is neither ${entry.from || 'the previous build'} nor ${entry.to || 'the requested build'}`,
      })
      continue
    }
    if (entry.attempts >= MAX_AUTO_REPAIR_ATTEMPTS) {
      // Not bumped: the count is already the reason this start does nothing,
      // and growing it would re-log the same sentence on every boot.
      if (entry.attempts === MAX_AUTO_REPAIR_ATTEMPTS) {
        logEvent('error', 'update-repair', gaveUpCopy(entry.name, entry.attempts))
      }
      report.failed.push({ name: entry.name, reason: gaveUpCopy(entry.name, entry.attempts) })
      report.abandoned.push(entry.name)
      continue
    }
    const spec = entry.to === '' ? entry.spec : `${entry.name}@${entry.to}`
    try {
      // The interrupted update may have died holding the profile lock; its
      // owner is gone by now, and without this the install below waits out
      // the whole timeout on every start.
      clearStaleProfileLock(options.profileDirectory)
      const result = await withDeadline(
        options.manager.installBundle(spec, { requestId: randomUUID() }),
        options.timeoutMs ?? REPAIR_INSTALL_TIMEOUT_MS,
        `reinstall ${spec}`,
      )
```

</details>

**依据 6 · 源码核查**：[src/snapshot.ts:37-52](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/snapshot.ts#L37-L52)

配置快照文件白名单明确保存范围。

<details>
<summary>查看原文（16行）</summary>

```text
function validSnapshotId(id: string): boolean {
  return SNAPSHOT_ID_RE.test(id)
}

/** The files a snapshot captures, relative to the profile directory. */
const SNAPSHOT_FILES = ['package.json', 'cordis.patch.yml', '.dsh-market/state.json'] as const

interface SnapshotFile {
  path: string
  /** JSON documents keep their parsed form (re-serialized on restore). */
  json?: unknown
  /** Line-oriented text files (cordis.patch.yml) keep their lines. */
  lines?: string[]
  /** V2 records absence explicitly so restore can remove a later file. */
  absent?: true
}
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:7843-7876](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L7843-L7876)

操作级回滚在失效或 profile 漂移时拒绝，依赖留存的来源。

<details>
<summary>查看原文（34行）</summary>

```text
        }
        try {
          await withMutationLock(response, 'install', async () => {
            const body = (await readJsonBody(request)) as { rollbackId?: unknown }
            const id = typeof body.rollbackId === 'string' ? body.rollbackId : ''
            const pending = pendingRollbacks.get(id)
            if (pending === undefined) {
              sendJson(response, 400, { error: 'rollback is not available (it may have been superseded by another operation) / 回滚已不可用（可能已被后续操作覆盖）' })
              return
            }
            // The token captures whole-profile manifest and lock state. A
            // terminal-side pnpm/dsh command is outside this route's mutation
            // lock, so internal invalidation alone cannot prevent an old token
            // from overwriting a newer external edit. Refuse unless the exact
            // post-operation state that the user was shown is still current.
            if (!profileStateMatches(pending.expectedState)) {
              pendingRollbacks.delete(id)
              sendJson(response, 400, {
                error: 'rollback is not available because the profile changed after this operation / 操作后配置已发生变化，回滚不可用',
              })
              return
            }
            let ok = true
            let hot = false
            let detail: string | null = null
            if (pending.kind === 'update') {
              const name = pending.names[0]!
              const result = pending.updateSource === undefined
                ? { ok: false, detail: 'the saved update rollback source is unavailable' }
                : await executeUpdateRollback(name, pending.manifestBefore!, pending.updateSource, pending.preserveProfilePolicy)
              ok = result.ok
              detail = result.detail
            } else {
              for (const name of pending.names) {
```

</details>

#### 缺口

- 桌面进程终止在移除和写入的不同位置时，包配置是否完整留下尚不清楚。
  **影响**：中断恢复效果与隔离试用的退出代价取决于此。
  **进一步探讨**：复制 profile，以四个阶段分别终止进程，比较日志、包目录、补丁、配置及第三方插件数据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 后台更新检查如何产生可消除的提醒，网络出错或切换来源后有何边界？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

服务器为活动 profile 启一个检查监视器，只有显式把开关置为 true 才调度。启用后首次等待 30 秒，间隔可选 6、12、72、168 小时，失败退避受上限约束。只读 GET 返回检查快照，设置或立即检查的 POST 先校验同源和参数。有进行中检查时合并请求，手工更新在必要时跟一次强制检查。状态用 profile、渠道、区域、代理及当前安装身份对照，检查返回时身份变了就丢弃对应结果。网络失败保留最近已知状态并标为 stale，所以红点后的条目还要人确认来源和目标，后台本身只读。

客户端只在支持插槽装饰、能安全定位原生 Plugins 图标时注册提示，退出或 slot 冲突会撤销装饰。通知筛掉禁用、排除、已忽略和本轮处理过的更新。打开 Plugins 后已读指纹仅影响提醒，更新条目仍在列表。指纹以 profile 及实际目标版本为条件，持久存储不可用时保真退回当前客户端可保存的范围，无法承诺不同浏览器共享。常驻用户因此可少打开市场查一遍，频繁切源或网络失败也可能让检查变成新摩擦。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:2697-2717](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L2697-L2717)

活动 profile 与安装来源、已装版本和锁定引用绑定监视器。

<details>
<summary>查看原文（21行）</summary>

```text
  const updateNotifications = createUpdateNotificationMonitor({
    boot: BOOT_ID,
    // Keep read receipts scoped across restarts without sending local paths.
    profileKey: createHash('sha256').update(activeProfileDir).digest('hex'),
    enabled: marketState.backgroundUpdateChecks === true,
    intervalHours: marketState.backgroundUpdateIntervalHours,
    inventory: () => {
      const installed = readInstalled(config.profile, activeProfileDir)
      const commits = readLockCommits(config.profile, activeProfileDir)
      return {
        context: JSON.stringify([activeProfileDir, activeChannel(), config.region, marketState.githubProxy]),
        packages: Object.fromEntries(Object.entries(installed).map(([name, spec]) => [name, JSON.stringify([
          spec, readInstalledVersion(config.profile, name, activeProfileDir),
          readGitResolutionCommit(config.profile, spec, activeProfileDir),
          commits.get(hostedRepoKey(spec) ?? '') ?? null,
          // A local package can switch forks at the same path and version.
          // Reuse its manifest/checkout evidence, without scanning a directory
          // tree or changing the authority of explicit git/npm sources.
          /^(?:file|link):/i.test(spec)
            ? readInstalledRepoEvidence(config.profile, name, spec, activeProfileDir) : null,
        ])])),
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:2855-2896](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L2855-L2896)

只读快照和变更设置的 POST 分开，间隔调整保留独立开关。

<details>
<summary>查看原文（42行）</summary>

```text
  const disposers = [
    registerRoute({
      kind: 'exact',
      path: '/dsh-market/update-notifications',
      handler: async (request, response) => {
        if (request.method === 'GET') {
          sendJson(response, 200, updateNotifications.snapshot())
          return
        }
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'GET, POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }
        try {
          const body = await readJsonBody(request)
          if (body === null || typeof body !== 'object' || Array.isArray(body)) {
            sendJson(response, 400, { error: 'expected an update-check setting or check request' })
            return
          }
          const { enabled, intervalHours, check } = body as { enabled?: unknown; intervalHours?: unknown; check?: unknown }
          if ((enabled !== undefined && typeof enabled !== 'boolean') || (check !== undefined && check !== true)
            || (intervalHours !== undefined && !isUpdateCheckIntervalHours(intervalHours))
            || (enabled === undefined && intervalHours === undefined && check === undefined)) {
            sendJson(response, 400, { error: 'enabled must be a boolean; intervalHours must be 6, 12, 72 or 168; check must be true' })
            return
          }
          if (typeof enabled === 'boolean' || isUpdateCheckIntervalHours(intervalHours)) {
            const state = readMarketState(activeProfileDir)
            if (typeof enabled === 'boolean') state.backgroundUpdateChecks = enabled
            if (isUpdateCheckIntervalHours(intervalHours)) state.backgroundUpdateIntervalHours = intervalHours
            // Validate the complete request, then persist both choices before
            // changing the live timer. Partial preference writes keep the other.
            writeMarketState(activeProfileDir, state)
            marketState.backgroundUpdateChecks = state.backgroundUpdateChecks
            marketState.backgroundUpdateIntervalHours = state.backgroundUpdateIntervalHours
            if (isUpdateCheckIntervalHours(intervalHours)) updateNotifications.setIntervalHours(intervalHours)
            if (typeof enabled === 'boolean') updateNotifications.setEnabled(enabled)
```

</details>

**依据 3 · 源码核查**：[src/update-notifications.ts:93-122](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/update-notifications.ts#L93-L122)

开关控制首次调度，检查合并且失败有退避。

<details>
<summary>查看原文（30行）</summary>

```text
  const stopTimer = (): void => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    nextCheckAt = null
  }

  const schedule = (delay: number): void => {
    stopTimer()
    if (disposed || !enabled) return
    nextCheckAt = Date.now() + delay
    timer = setTimeout(() => { void check(stale) }, delay)
    timer.unref?.()
  }

  const nextDelay = (): number => failures > 0
    ? Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** Math.min(failures - 1, 5))
    : intervalHours * 60 * 60_000

  const check = (force = false): Promise<Record<string, UpdateStatus>> => {
    if (disposed) return Promise.resolve({ ...updates })
    if (pending !== null) {
      if (!force || pendingForced) return pending
      // A manual refresh arriving during a cache-eligible read must still
      // bypass that cache, once. Several such callers share the follow-up.
      queuedForce ??= pending.then(() => check(true)).finally(() => { queuedForce = null })
      return queuedForce
    }
    stopTimer()
    const started = reconcile()
    pendingForced = force || stale
```

</details>

**依据 4 · 源码核查**：[src/update-notifications.ts:125-171](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/update-notifications.ts#L125-L171)

身份变化与网络错误不以旧结果替代当前确认，保留 stale 边界。

<details>
<summary>查看原文（47行）</summary>

```text
    pending = Promise.resolve().then(async () => {
      try {
        const result = await deps.check(pendingForced)
        if (disposed) return { ...updates }
        const current = reconcile()
        const next = { ...updates }
        let incomplete = result.error !== undefined
        for (const [name, status] of Object.entries(result.updates)) {
          if (current.context !== started.context || current.packages[name] === undefined
            || current.packages[name] !== started.packages[name]) {
            incomplete = true
            continue
          }
          if (status.checkFailed === true || status.checkError !== undefined) {
            incomplete = true
            next[name] = { ...(updates[name] ?? status), checkFailed: true, checkError: 'unavailable',
              ...(status.sourceMigration === undefined ? {} : { sourceMigration: status.sourceMigration }) }
          } else {
            next[name] = status
          }
        }
        if (Object.keys(current.packages).some(name => result.updates[name] === undefined
          || current.context !== started.context || current.packages[name] !== started.packages[name])) incomplete = true
        updates = next
        checkedAt = Date.now()
        stale = incomplete
        error = incomplete ? result.error ?? 'Some plugin updates could not be checked. Try again later.' : null
        if (!incomplete) lastSuccessAt = checkedAt
        failures = incomplete ? failures + 1 : 0
      } catch {
        if (disposed) return { ...updates }
        reconcile()
        updates = Object.fromEntries(Object.entries(updates).map(([name, status]) => [name, { ...status, checkFailed: true as const, checkError: 'unavailable' as const }]))
        checkedAt = Date.now()
        stale = true
        error = 'Plugin updates could not be checked. Try again later.'
        failures += 1
      } finally {
        pending = null
        if (!disposed) schedule(nextDelay())
      }
      return { ...updates }
    })
    return pending
  }

  schedule(UPDATE_CHECK_START_DELAY_MS)
```

</details>

**依据 5 · 源码核查**：[src/client/update-notifications.ts:50-86](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/update-notifications.ts#L50-L86)

提醒排除用户禁用、免更新等项，按匿名 profile 或启动域保存。

<details>
<summary>查看原文（37行）</summary>

```text
/** The attention count excludes dismissed, disabled and already-completed updates. */
export function notificationNames(snapshot: UpdateNotificationSnapshot): string[] {
  const restart = readSession(RESTART_SESSION_KEY)
  const updated: string[] = restart?.boot === snapshot.boot && Array.isArray(restart.updated)
    ? restart.updated.filter((name: unknown): name is string => typeof name === 'string') : []
  const quiet = new Set([
    ...snapshot.updateExempt, ...snapshot.disabled, ...snapshot.blocked,
    // A cached sidebar snapshot can lag behind the page's newer boot. Reading
    // its count must never erase a dismissal already saved for that new boot.
    ...readIgnoredUpdates(snapshot.boot, false), ...updated,
  ])
  return Object.entries(snapshot.updates).filter(([name, status]) => !quiet.has(name)
    && status.notAPlugin !== true
    && (status.updateAvailable === true || (status.kind === 'generation' && status.latest != null)))
    .map(([name]) => name).sort()
}

interface SeenScope { key: string; persistent: boolean }
// Storage can be unavailable in a restricted webview. Keep acknowledgements
// effective for this client lifetime; readable invalid records still fail open.
const seenInMemory = new Map<string, Set<string>>()
const unpersistedSeen = new Set<string>()

function seenScope(snapshot: UpdateNotificationSnapshot): SeenScope | null {
  const persistent = typeof snapshot.profileKey === 'string' && snapshot.profileKey !== ''
  if (!persistent && snapshot.boot === '') return null
  // The endpoint separates reverse-proxy deployments on the same origin;
  // profileKey is opaque and never stores the host's filesystem path here.
  return {
    key: SEEN_UPDATES_KEY_PREFIX + JSON.stringify([api('/dsh-market/update-notifications'),
      persistent ? 'profile' : 'boot', persistent ? snapshot.profileKey : snapshot.boot]),
    persistent,
  }
}

function seenStorage(scope: SeenScope): Storage {
  return scope.persistent ? localStorage : sessionStorage
```

</details>

**依据 6 · 源码核查**：[src/client/update-notifications.ts:116-151](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/update-notifications.ts#L116-L151)

读取确认绑定更新身份，保存失败使用内存回执。

<details>
<summary>查看原文（36行）</summary>

```text
function updateFingerprint(snapshot: UpdateNotificationSnapshot, name: string): string {
  const status = snapshot.updates[name]!
  const migration = status.sourceMigration
  return JSON.stringify([
    name, status.kind ?? null, status.current ?? null, status.version ?? null,
    status.eligibleVersion ?? status.latest ?? null, status.restoreRequired === true,
    migration?.kind === 'git-to-npm'
      ? [migration.kind, migration.repo, migration.target]
      : migration?.kind === 'npm-rename' ? [migration.kind, migration.from, migration.target] : null,
  ])
}

/** Sidebar attention is unread state; the pending update list stays intact. */
export function unseenNotificationNames(snapshot: UpdateNotificationSnapshot): string[] {
  const names = notificationNames(snapshot)
  const scope = seenScope(snapshot)
  if (scope === null) return names
  const seen = readSeen(scope)
  return names.filter(name => !seen.has(updateFingerprint(snapshot, name)))
}

/** Returns true only when the visit acknowledged at least one new update. */
function acknowledgeSnapshot(snapshot: UpdateNotificationSnapshot): boolean {
  const scope = seenScope(snapshot)
  if (scope === null) return false
  const saved = readSeen(scope)
  const seen = new Set(saved)
  for (const name of notificationNames(snapshot)) seen.add(updateFingerprint(snapshot, name))
  if (seen.size === saved.size) return false
  seenInMemory.set(scope.key, seen)
  try {
    seenStorage(scope).setItem(scope.key, JSON.stringify({ version: 1, fingerprints: [...seen] }))
    unpersistedSeen.delete(scope.key)
  } catch {
    // A full quota can block writes while reads still work. Remember that
    // the in-memory receipt is newer than the unchanged stored record.
```

</details>

**依据 7 · 源码核查**：[src/client/PluginsUpdateIndicator.tsx:157-191](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/PluginsUpdateIndicator.tsx#L157-L191)

只有兼容且归属明确的宿主入口被包装，移除装饰有反向清理。

<details>
<summary>查看原文（35行）</summary>

```text
      const reconcile = (): void => {
        if (closed || disposed) return
        if (reconciling) { changedWhileReconciling = true; return }
        reconciling = true
        try {
          const entries = slots.entries('sidebar.panellist').filter(entry => entry.options.id === 'plugins' && entry.component !== Decoration)
          const next = entries.length === 1 && (entries[0].options.priority ?? 0) === 0 && canWrap(entries[0]) ? entries[0] : undefined
          if (next === original) return
          remove()
          if (next === undefined) return
          const active = slots.entriesOfSlot('sidebar.panellist').find(entry => entry.options.id === 'plugins')
          if (active !== next) return
          const Original = next.component as ComponentType<IconOwnerProps>
          Decoration = owner => createElement(PluginsUpdateIcon, { original: Original, owner, activity })
          const off = slots.register({
            name: 'sidebar.panellist', id: 'plugins', priority: -1,
            ...(next.options.order === undefined ? {} : { order: next.options.order }),
            ...(next.options.label === undefined ? {} : { label: next.options.label }),
            ...(next.locale === undefined ? {} : { locale: next.locale }),
          }, Decoration)
          original = next
          stopDecoration = typeof off === 'function' ? off as () => void : undefined
        } catch {
          dispose()
        } finally {
          reconciling = false
          if (changedWhileReconciling) {
            changedWhileReconciling = false
            queueMicrotask(reconcile)
          }
        }
      }
      const unsubscribe = slots.subscribe('sidebar.panellist', reconcile)
      stopIcon = () => { closed = true; quietly(unsubscribe); remove() }
      reconcile()
```

</details>

#### 缺口

- 粘滞提醒在代理、页面重载和失败退避后出现的实际频率未知。
  **影响**：影响用户常驻后台功能以及是否仍需手工更新列表。
  **进一步探讨**：固定一组 npm 与 GitHub 已装包，分别制造新版本、离线、换渠道与第二个 profile，比较提醒、来源、时间和已读。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样以可逆试用比较多个插件的更新摩擦，哪些证据足以继续采用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合先试的是常驻 Web 且有几个社区包待维护、能复制 profile 的使用者。用同一非关键包和固定目标做两条任务，原生界面或 CLI 加手工记录为基线，市场则从查看候选或更新提醒进入来源确认、下载、激活与功能检查。计时从找包开始，计入查路径、网络重试、重启、复核和恢复。合格结果须写入指定 profile、目标版本和来源可追溯、功能实际执行成功，并能回到预定状态。只看进度显示或提醒消失会把通知已读和安装成功混在一起。无合格结果时不报单位成本。

可以检验的假设是，给待更新项附上同屏的来源、宿主兼容状态和更新后激活探针，可减少「装上了却没工作」后的排障。当前界面分别有兼容结果和激活告警，后台提醒也追踪具体目标身份，但这些证据尚未形成同一份验收记录。用首次安装、需要重启、目标不可达和看似兼容但无法激活四类任务比较，若探针无法覆盖主要功能、误报增加或排障计时与基线持平，便没有采用这一设计的依据。第一次试用只改可恢复配置和非关键包，确认来源不明、激活状态与真实功能矛盾或回滚不再可用时停止，按副本恢复并回到宿主管理入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:8377-8428](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L8377-L8428)

活跃状态回执与包已经下载分开，可用来设计显式验收。

<details>
<summary>查看原文（52行）</summary>

```text
                    let adopted = isAdopted()
                    // The replay lands after pnpm returns, not before (#814):
                    // give a host that replays on its own the time to do it.
                    // The profile watcher replays only what the manifest lists
                    // as a bundle, so a client-only package is not waited for.
                    const replayWaitMs = config.hostReplayWaitMs
                      ?? (declaresBundle(activeProfileDir, name) && liveNames().has(PROFILE_HMR_ENTRY) ? PROFILE_HMR_REPLAY_WAIT_MS : 0)
                    const waitUntil = Date.now() + replayWaitMs
                    while (!adopted && Date.now() < waitUntil) {
                      await new Promise(resolve => setTimeout(resolve, 250))
                      adopted = isAdopted()
                    }
                    if (adopted && replayWaitMs > 0) {
                      logEvent('info', 'install', `${name}: the host's own replay activated it; adopted instead of mounting a second copy (#814, #827)`)
                    }
                    let live = adopted
                    if (!adopted && !pluginCategories(entry).includes('theme')) {
                      // #758: this fallback hot-mount bypasses the host's own
                      // boot gate, which would skip a peer-incompatible
                      // plugin on every boot. Check the same gate first and
                      // leave it unmounted when it would bite; the activation
                      // report below then reads incompatible. Client-only
                      // plugins never load in the host process, so the cap
                      // cannot bite — skip the gate for them (#758 review),
                      // matching what verifyActivation does outside bundles.
                      const gate = hasHostHalf(config.profile, name, activeProfileDir)
                        ? hostPeerGate(activeProfileDir, name, defaultHostRuntimeFacts(activeProfileDir))
                        : null
                      if (gate !== null) {
                        logEvent('warn', 'install', `${name}: ${gate.peer} ${gate.range} excludes runtime ${gate.runtimeVersion}; leaving it unmounted for the next boot to skip (#757)`)
                        live = false
                      } else {
                        live = (await hotMount(host, activeProfileDir, name)).ok
                      }
                    } else if (!adopted) {
                      const result = await themes.activateTheme(name)
                      live = result.ok
                      if (result.reason !== undefined) themeFailures.set(name, result.reason)
                    }
                    if (!live) hot = false
                  }
                }
                activation = {}
                const live = liveNames()
                // Same facts the mount decision above used, so the verdict
                // cannot disagree with it within one request.
                const hostFacts = defaultHostRuntimeFacts(activeProfileDir)
                for (const name of added) {
                  const result = verifyActivation(config.profile, name, live, activeProfileDir, disabled.has(name), hostFacts)
                  const failure = themeFailures.get(name)
                  activation[name] = failure === undefined
                    ? result
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7843-7876](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/routes.ts#L7843-L7876)

回滚令牌和恢复来源有失效条件，任务必须验证退出。

<details>
<summary>查看原文（34行）</summary>

```text
        }
        try {
          await withMutationLock(response, 'install', async () => {
            const body = (await readJsonBody(request)) as { rollbackId?: unknown }
            const id = typeof body.rollbackId === 'string' ? body.rollbackId : ''
            const pending = pendingRollbacks.get(id)
            if (pending === undefined) {
              sendJson(response, 400, { error: 'rollback is not available (it may have been superseded by another operation) / 回滚已不可用（可能已被后续操作覆盖）' })
              return
            }
            // The token captures whole-profile manifest and lock state. A
            // terminal-side pnpm/dsh command is outside this route's mutation
            // lock, so internal invalidation alone cannot prevent an old token
            // from overwriting a newer external edit. Refuse unless the exact
            // post-operation state that the user was shown is still current.
            if (!profileStateMatches(pending.expectedState)) {
              pendingRollbacks.delete(id)
              sendJson(response, 400, {
                error: 'rollback is not available because the profile changed after this operation / 操作后配置已发生变化，回滚不可用',
              })
              return
            }
            let ok = true
            let hot = false
            let detail: string | null = null
            if (pending.kind === 'update') {
              const name = pending.names[0]!
              const result = pending.updateSource === undefined
                ? { ok: false, detail: 'the saved update rollback source is unavailable' }
                : await executeUpdateRollback(name, pending.manifestBefore!, pending.updateSource, pending.preserveProfilePolicy)
              ok = result.ok
              detail = result.detail
            } else {
              for (const name of pending.names) {
```

</details>

**依据 3 · 源码核查**：[src/client/update-notifications.ts:116-134](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/client/update-notifications.ts#L116-L134)

通知区分具体目标，出现和消失都可与实际安装操作独立观察。

<details>
<summary>查看原文（19行）</summary>

```text
function updateFingerprint(snapshot: UpdateNotificationSnapshot, name: string): string {
  const status = snapshot.updates[name]!
  const migration = status.sourceMigration
  return JSON.stringify([
    name, status.kind ?? null, status.current ?? null, status.version ?? null,
    status.eligibleVersion ?? status.latest ?? null, status.restoreRequired === true,
    migration?.kind === 'git-to-npm'
      ? [migration.kind, migration.repo, migration.target]
      : migration?.kind === 'npm-rename' ? [migration.kind, migration.from, migration.target] : null,
  ])
}

/** Sidebar attention is unread state; the pending update list stays intact. */
export function unseenNotificationNames(snapshot: UpdateNotificationSnapshot): string[] {
  const names = notificationNames(snapshot)
  const scope = seenScope(snapshot)
  if (scope === null) return names
  const seen = readSeen(scope)
  return names.filter(name => !seen.has(updateFingerprint(snapshot, name)))
```

</details>

**依据 4 · 源码核查**：[src/snapshot.ts:37-52](https://github.com/dsh-market/dsh-market/blob/88de9575946485c1dac5e1a5fbe57fa1f3c3988c/src/snapshot.ts#L37-L52)

试用退出须考虑快照白名单外的数据。

<details>
<summary>查看原文（16行）</summary>

```text
function validSnapshotId(id: string): boolean {
  return SNAPSHOT_ID_RE.test(id)
}

/** The files a snapshot captures, relative to the profile directory. */
const SNAPSHOT_FILES = ['package.json', 'cordis.patch.yml', '.dsh-market/state.json'] as const

interface SnapshotFile {
  path: string
  /** JSON documents keep their parsed form (re-serialized on restore). */
  json?: unknown
  /** Line-oriented text files (cordis.patch.yml) keep their lines. */
  lines?: string[]
  /** V2 records absence explicitly so restore can remove a later file. */
  absent?: true
}
```

</details>

#### 缺口

- 同条件任务的合格率、人工时间和资源支出均未测量。
  **影响**：源码只支持低风险探索，无法支持节时或长期迁移的结论。
  **进一步探讨**：用复制的 profile 做配对，记录每阶段起止、全部尝试数、有效合格数及最终文件与功能差异。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
