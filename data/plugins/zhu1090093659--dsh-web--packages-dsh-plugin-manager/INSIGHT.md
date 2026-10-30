# Plugin Manager 更新补丁

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 9,728](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C728&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 89,375](https://img.shields.io/static/v1?label=npm+30d&message=89%2C375&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：DSH插件管理扩展，在官方Plugins页面检查来源版本、逐项更新第三方包并安排重启，按宿主提供官方通道或本机网关。

> **亮点**：把多通道、兼容声明判定、逐项维护、实际版本回读和重启交接接入官方GUI；新增owner保护与有条件补偿真实存在。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：预览版本未绑定新latest，启动修复不入队，回滚/超时/查询完整性和运行加载都有条件；done、回滚日志和helper started不等功能恢复。见[Q03](#research-q03)。

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
  - [Q01 · 本子包管理什么，增量属于谁，怎样才算一次更新完成？](#detail-section-11)
  - [Q02 · 请求怎样到正确profile及官方写入器，返回和状态如何核实？](#detail-section-12)
  - [Q03 · 哪些成功、回滚、查询和并发结论不能扩大？](#detail-section-13)
  - [Q04 · 采用前提、执行者、成本与效果应如何拆开核？](#detail-section-14)
  - [Q05 · 什么增量值得验证，什么时候应只修原组件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为维护多个DSH扩展的本机用户集中版本/兼容检查和逐项更新；验收正确profile、加载版本与核心功能。见[Q01](#research-q01)。

对照官方CLI固定spec、外部备份及人工重启回归；写入器/包管理器与共享SDK/helper不全归本组件创新。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 版本/兼容检查 | 对照registry版本和DSH声明 | 查询失败可遗漏；不保证只升更高/每包已核 |
| 单项/批量更新 | 逐项官方writer维护 | 首错停后项；非整批事务、预览版本未绑定 |
| 配置启停/整理 | entry ID override、条件修复行名 | 当前加载另核；加载就可能写，修复未入队 |
| 状态/重启 | job与条件化重启交接 | 内存记录、请求/日志不等实例功能ready |

**流程与依赖**

需兼容宿主、正确profile/本机权限与对应官方writer、registry和可恢复旧来源；Node随宿主，本子包未单列engine。表见[Q04](#research-q04)。

加载前外部备份→核真实模式/profile→只做一项可信非关键更新→回读并按plan重启/功能验收；错误先对账、不重放。步骤见[Q04](#research-q04)。

**效果与成本**

包/registry/磁盘/重启、维护适配和异常恢复人工未知，串行批次有资源安排机制但不证明净节时/费用下降；表见[Q04](#research-q04)。

入口集中、版本/局部组合检查及条件重启有源码；查询覆盖、预览绑定、完整恢复与真实加载/业务成功未证。效果表见[Q04](#research-q04)。

> **思考**：预览版本未绑定新latest，启动修复不入队，回滚/超时/查询完整性和运行加载都有条件；done、回滚日志和helper started不等功能恢复。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多通道、兼容声明判定、逐项维护、实际版本回读和重启交接接入官方GUI；新增owner保护与有条件补偿真实存在。见[Q01](#research-q01)、[Q02](#research-q02)。

可借鉴通道适配、profile一致性、排队任务串行、精确更新读回与owner-aware局部恢复；启动修复/外部writer、回滚异常和加载验证不被这些保护自动覆盖。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

预览版本未绑定新latest，启动修复不入队，回滚/超时/查询完整性和运行加载都有条件；done、回滚日志和helper started不等功能恢复。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉profile且能安排重启回归的用户，可在加载前外部备份的独立可弃置home和普通CLI测试profile，单项试用一个可信非关键direct npm包，确保没有其他writer。发现错profile、版本漂移、超时或恢复状态不明就停止后续任务并人工核磁盘/实例/功能，不把错误当未执行，也不以done/重启日志代替生效。精确版本审批、不可中断生产、桌面native替换或legacy迁移先观察，保留官方固定spec和人工回归办法。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包核心GUI/RPC/网关、profile/CLI/native更新与重要失败/恢复、启停配置和重启支路源码已核，非完整官方安装器/供应链/宿主HMR审计，未运行。仅建议先外部备份的独立可弃置home/普通CLI测试profile单个可信非关键包有监督试用，排除生产批量、native替换/legacy迁移；真实加载/功能仍须验收。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/cordis.patch.yml、packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx、packages/dsh-plugin-manager/src/client/index.ts、packages/dsh-plugin-manager/src/client/plugin-toolbar-mount.tsx、packages/dsh-plugin-manager/src/client/telemetry.ts、packages/dsh-plugin-manager/src/core/updates.ts、packages/dsh-plugin-manager/src/core/version.ts、packages/dsh-plugin-manager/src/host/detached-work.ts、packages/dsh-plugin-manager/src/host/dsh-compat.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/host/loopback.ts、packages/dsh-plugin-manager/src/host/profile.ts、packages/dsh-plugin-manager/src/host/restart.ts、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/rows.ts、packages/dsh-plugin-manager/src/index.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：独立子包manifest/bundle、GUI mount/详情/工具条与face真实RPC/HTTP、profile身份、兼容声明/更新查询、CLI/native主安装更新移除、配置enablement、启动修复与关键补偿/超时、重启计划/helper、共享围栏/遥测。未全审官方writer/CLI解析/所有包scripts与供应链、完整HMR/OS进程树、全部DOM和迁移布局，不执行目标。
- 下一步：后续固定可信包/宿主在可弃置环境对照CLI，注入预览tag变化、修复/外部writer并发、调用异常/exit0不变、import/apply失败与重启旧模块；量错版/误报ready/恢复人工和中断，未知状态不重放。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.12（[固定提交 de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先验证expectedVersion绑定、所有写入含启动修复入队及跨重启实际加载/功能回执；小补丁/人工清单够用就否定独立插件。见[Q05](#research-q05)。

后续固定可信包/宿主在可弃置环境对照CLI，注入预览tag变化、修复/外部writer并发、调用异常/exit0不变、import/apply失败与重启旧模块；量错版/误报ready/恢复人工和中断，未知状态不重放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 315 | — | — | 9701 |
| .ts | source | 28 | 6570 | 3733 | 2492 | — |
| .tsx | source | 3 | 756 | 518 | 183 | — |
| .ts | test | 27 | 6588 | 4828 | 1029 | — |
| .tsx | test | 3 | 914 | 582 | 192 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定插件管理子包的真实写入/回读/恢复与重启边界能否支持可回退维护？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本子包管理什么，增量属于谁，怎样才算一次更新完成？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是@linxin666/dsh-client-ui-plugin-manager 0.4.12，BSD-3-Clause，manifest声明DSH>=0.2.1-rc.3、host/client和bundle；子包没有单独Node engines字段，不套用同repo其他子包的Node版本声明。它为维护多个DSH扩展的本机用户，在官方Plugins页面增加版本检查、第三方批量更新与重启计划，并提供兼容旧运行时的loopback网关和供兄弟client插件复用的管理服务。它不是官方@deepseek-ai/dsh-plugin-manager本身，也不是另一套包管理器、Agent或MCP。

基线是逐个查registry、用官方CLI/安装器更新、核profile再重启验证；本包减少入口/通道切换，把目标版本、组合变化和重启待办放在同一工作流。完整验收至少是正确profile中实际版本、运行实例加载版本及目标插件核心功能，不能以按钮、CLI exit0或job done代替。批量过滤@deepseek-ai/官方scope和compatible=false条目，逐项await，首项失败就停后续；此前已成功项仍保留，不是整批原子回滚。

实际client apply构造一次createPluginManagerFace，provide('pluginManager')给兄弟插件，挂官方plugins.detail.section的更新区；列表工具条另用createRoot挂进[data-plugin-panel]下bundles组首子元素，并随body变动重新定位。找不到座时不出现工具条，注册catch也可降级，不把GUI页面存在当跨版本兼容验收。工具条回调真实调用face.update；face根据模式走官方RPC或本包HTTP，而不是展示静态版本清单。

host按启动线索解析profile、构造CliGateway并注册路由；官方安装/加载、pnpm以及SDK/共享loopback、异步上下文与遥测基础都不是本子包原创。特别是加载后1.5秒会调repairProfileRowNames，可能自动写修复后的profile patch，因此本包不是纯只读检查器，应在加载前备份。源码已读旧正式6b984b10950f78f1f4a5b5adf4c16636b5e6113d五题、findings和自代码依赖，当前独立重核包括最新native replacement/restartRequired与启动修复例外，不直接沿用旧“全部变更串行/安全回滚”措辞。没有运行安装、更新、重启或用户比较，持续使用频率和净收益未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:1-35](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/package.json#L1-L35)

0.4.12、双入口/bundle和DSH声明；完整JSON未单列Node engines。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-plugin-manager",
  "description": "Update checking for the dsh web GUI's official Plugins page: compares installed plugins against the version their registry source serves, gates the update on the DSH runtime minimum the release declares, and drives the update through the official installer channel or this package's loopback CLI gateway.",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-renderer"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/package.json:82-82](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/package.json#L82-L82)

BSD-3-Clause。

```text
  "license": "BSD-3-Clause",
```

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:71-118](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/index.ts#L71-L118)

host实际路由与启动1.5秒自动修复caller。

<details>
<summary>查看原文（48行）</summary>

```text
function applyImpl(ctx: Context): void {
  // Gateway mode needs the boot profile; the launched profile the Host
  // publishes is authoritative when the launcher passed no flag and no
  // environment override (the packaged Desktop client). Without either fact
  // the official installer channels serve the browser half instead.
  let facts
  const launched = launchedProfile(ctx)
  try {
    facts = resolveProfile(process.argv, process.env, launched)
  } catch (error) {
    console.error('[plugin-manager]', error instanceof Error ? error.message : String(error))
    return
  }
  if (!profileExists(facts.profileDir)) return

  const gateway = new CliGateway(facts, process.env, { nativeManager: () => officialManager(ctx) })
  const cliAvailable = (): boolean => findDshBinary() !== null
  // The running installation's own manifest is the version source the
  // compatibility gate prefers: it needs no CLI, which is the only way a
  // packaged Desktop host can answer at all (issue #1819). The anchor is read
  // from the same published profile facts the profile resolution already used.
  const installAnchor = launchedInstallAnchor(launched)

  ctx.effect(() => {
    const disposers = makeGatewayRoutes({ facts, gateway, cliAvailable, installAnchor })
      .map(route => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'plugin-manager: gateway routes')

  // A bundle that renamed a row's package leaves every profile row that named
  // the old one dead (issue #1901 moved the aggregate's family rows from the
  // `@linxin666/dsh-web-all/<family>` subpath to the real package, and the
  // loader skips a row whose name does not match the inserted row). The repair
  // runs once the boot settled, so the rewrite cannot race the composition,
  // and it writes only when a row actually changed.
  ctx.effect(() => {
    const timer = setTimeout(() => {
      void gateway.repairProfileRowNames().then((repaired) => {
        if (repaired.length === 0) return
        console.warn('[plugin-manager] 已修复 profile 中失效的行名：' + repaired.map(row => `${row.id}（${row.from} → ${row.to}）`).join('、'))
      }).catch((error: unknown) => {
        console.error('[plugin-manager] profile 行名修复失败：' + (error instanceof Error ? error.message : String(error)))
      })
    }, 1500)
    return () => { clearTimeout(timer) }
  }, 'plugin-manager: stale row name repair')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:348-407](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L348-L407)

真实face提供、工具条与详情slot注册。

<details>
<summary>查看原文（60行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-plugin-manager' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'plugin-manager: dictionaries')

  // Built once: the patch and the 'pluginManager' cordis service share one
  // face, so consumers observe exactly the mutations the patch performs.
  const face = createPluginManagerFace(ctx)
  try {
    if (!ctx.get(PLUGIN_MANAGER_SERVICE)) {
      ctx.provide(PLUGIN_MANAGER_SERVICE, face)
    }
  } catch {
    // ignore duplicate provide
  }

  // The list-level toolbar rides the page's own "Installed" heading: the
  // official page declares no seat beside it, so the entry is inserted into
  // the heading element itself and tracks the page through the shared body
  // mutation hub. Its translate function is rebuilt on every render so a
  // language switch reaches copy that no slot outlet owns.
  ctx.effect(() => {
    try {
      return mountPluginListToolbar({
        props: () => ({
          isLoopback: face.isLoopback,
          checkUpdates: face.checkUpdates,
          update: face.update,
          restartPlan: face.restartPlan,
          restart: face.restart,
          t: ctx.locale.bind(NS),
        }),
        subscribe: listener => ctx.locale.subscribe(listener),
      })
    } catch {
      return () => {}
    }
  }, 'plugin-manager: update toolbar')

  // The official Plugins page declares this seat on its main-panel entry and
  // renders one section per contribution on each bundle / row / plugin page;
  // `inject` waits for that declaration, exactly like the family plugin cards
  // that register into `plugins.bundle.config`.
  ctx.slots.inject('plugins.detail.section', () => {
    try {
      return ctx.slots.register({
        name: 'plugins.detail.section',
        id: 'family-update-check',
        order: 30,
        locale: NS,
        inject: () => face,
      }, PluginUpdatePatch)
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/client/plugin-toolbar-mount.tsx:50-95](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/plugin-toolbar-mount.tsx#L50-L95)

DOM seat、React render、重新定位和释放。

<details>
<summary>查看原文（46行）</summary>

```text
export function toolbarSeat(): HTMLElement | undefined {
  const page = document.querySelector('[data-plugin-panel]')
  const group = page?.querySelector('[data-plugin-group="bundles"]')
  const head = group?.firstElementChild
  return head instanceof HTMLElement ? head : undefined
}

/**
 * Mount the toolbar into the Installed heading.
 * @param options - props factory and the optional locale subscription.
 * @returns disposer removing the container, its observers and its React root.
 */
export function mountPluginListToolbar(options: PluginToolbarMountOptions): () => void {
  if (typeof document === 'undefined') return () => {}
  // DOM-level idempotency: whatever path mounted a toolbar before this call
  // (a duplicated apply, an HMR re-injection), never mount a second one.
  if (document.querySelector(TOOLBAR_MOUNT_SELECTOR) !== null) return () => {}

  const container = document.createElement('div')
  container.setAttribute('data-dsh-plugin-manager-toolbar', '')
  container.className = css.mount
  const root: Root = createRoot(container)
  const render = (): void => {
    root.render(createElement(PluginListToolbar, options.props()))
  }
  render()

  /** Keep the container inside the heading; detach while the list is away. */
  const place = (): void => {
    const seat = toolbarSeat()
    if (seat === undefined) {
      container.remove()
      return
    }
    if (container.parentElement !== seat) seat.append(container)
  }
  place()

  const unsubscribeBody = subscribeBodyInvalidations(place)
  const unsubscribeLocale = options.subscribe === undefined ? ((): void => {}) : options.subscribe(render)

  return () => {
    unsubscribeBody()
    unsubscribeLocale()
    root.unmount()
    container.remove()
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:134-166](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L134-L166)

逐项更新、首错停止而非回滚前项。

<details>
<summary>查看原文（33行）</summary>

```text
  const onUpdateAll = (): void => {
    if (busyRef.current) return
    const queue = applicableUpdates(rows)
    if (queue.length === 0) return
    busyRef.current = true
    setPhase('updating')
    setError(undefined)
    void (async () => {
      const done: string[] = []
      for (const [index, row] of queue.entries()) {
        setCursor({ name: row.id, index: index + 1, total: queue.length })
        try {
          const result = await update(row.id)
          // The update landed; when this process cannot load it, the run still
          // counts as applied and continues, and the panel names the restart.
          if (result.restartRequired.length > 0) {
            setRestartRequired(current => [...current, { id: row.id, version: result.plugin.version }])
          }
        } catch (reason) {
          // Stop at the first failure: the remaining rows stay listed with their
          // versions, so the user sees exactly what did not go through.
          setError(t('failed', { reason: messageOf(reason) }))
          break
        }
        done.push(row.id)
        setApplied([...done])
        setRows(current => current.filter(item => item.id !== row.id))
      }
      setCursor(undefined)
    })().finally(() => {
      busyRef.current = false
      setPhase('idle')
    })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/core/updates.ts:26-44](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/core/updates.ts#L26-L44)

官方scope/兼容性过滤。

<details>
<summary>查看原文（19行）</summary>

```text
/** Whether a package id is a third-party plugin rather than a DSH-shipped one. */
export function isThirdPartyPlugin(id: string): boolean {
  return !id.startsWith(OFFICIAL_SCOPE)
}

/** The third-party update rows, in host order. */
export function thirdPartyUpdates(items: readonly PluginUpdateItem[]): PluginUpdateItem[] {
  return items.filter(item => isThirdPartyPlugin(item.id))
}

/** Whether the running DSH host satisfies the row's declared minimum. */
export function isUpdateApplicable(item: PluginUpdateItem): boolean {
  return item.compatible !== false
}

/** The third-party rows this runtime can actually apply. */
export function applicableUpdates(items: readonly PluginUpdateItem[]): PluginUpdateItem[] {
  return thirdPartyUpdates(items).filter(isUpdateApplicable)
}
```

</details>

#### 缺口

- 实际宿主界面/通道/安装兼容及多包维护频次、净节时未实测
  **影响**：只能认定接线和条件内维护便利，不能用包数或源码复杂度证明值得持续采用
  **进一步探讨**：后续独立可弃置home/profile、可信非关键包，比较官方CLI同任务的真实加载/回归、误判和人工分钟，先备份再加载。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求怎样到正确profile及官方写入器，返回和状态如何核实？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

profile优先读显式独立--profile参数，再读运行宿主发布的profileContext、桌面argv目录、DSH_PROFILE及web/桌面选择后备；显式name拒绝空/点/分隔符，published目录要求安全绝对路径、name与目录basename一致，published patch只能是该profile自有文件。它按这些线索选择读写对象，不是所有启动形式/运行宿主身份的独立验证；首次小样用唯一清晰的启动配置并对照真实路径。

client模式先读网关/mode，true选官方RPC，false选gateway；无定论才以官方list RPC探测，模式结果缓存。官方路径connection.rpc.call('/plugin-installer', endpoint, payload)，检查result.ok并解析返回；update适配器直接给restartRequired=[]，这是通道没提供restart事实的表示，不是本组件读到了已加载的新版本。gateway路径真实fetch文档相对api/plugin-manager端点，install/update/remove先拿jobId再500ms轮询done/error；update读job.plugin与restartRequired。两个路径不在一次不确定写入失败后自动互相重放。

网关所有路由经直接loopback/浏览器标记围栏，不是远程paired-cookie授权。应用自有desktop profile且能取到nativeManager时调用其installBundle/removeBundle；其他路径用官方dsh CLI。普通spawn分离argv、处理Node解释器与PATH，Windows.cmd另用专门cmd shim；有危险元字符过滤，不宣称已全审CLI选项语义、Windows转义或包供应链。CLI add/remove进入同实例Promise队列，直接setEnabled也用withMutationLock；失败恢复队尾，不能把它扩大成全部本实例/外部进程写入锁，启动修复例外见Q03。

update路由在锁内读当前profile中的目标，仅普通direct npm源可常规更新，重新取registry manifest的version；取得非空字符串DSH要求时，用安装anchor版本或CLI --version与node-semver includePrerelease:true比较。不能核实host/不可解析字符串要求均阻断，未声明、空或非字符串reader返回undefined则不加这层门禁；不是所有包兼容都已获保证。官方RPC不经过这层网关比较，仍由宿主通道负责，未在本项全审其实现。

CLI exit0后capture before/after、剥本次新增且原组合已行挂载的重复bundle，install检查新增依赖、重复entry认领及不可解析insert，update检查目标仍在且实际包清单版本等于路由解析版本，执行--dump-config组合预检；remove检查前后有依赖消失。setEnabled针对bundle声明的真实entry ID/name写disabled override，保护管理入口的locked rows，备份/tmp/rename后回读；这是配置状态，不等当前实例立即停用。

native update先installBundle；若明确already-installed拒绝，走remove再install，针对bundle-in-use只额外重试一次移除，并尝试恢复bundle层位置。目标拒绝时尝试装回原dependency spec，若返回restart-required保留具体待重启ID，落盘版本正确可done同时仍待重启。这里只核到实际调用/返回处理，不据注释替官方writer内部加载/回滚背书。已有这些条件化恢复，不能说没有任何补偿；完整性边界见Q03。

重启先GET/HEAD读无副作用plan，再POST实际执行。桌面/Electron仅环境明确DSH_SHELL_RESTARTS_HOST=1选shell，否则manual；普通无TTY监督启动也manual，有合适交互启动命令才relaunch。relaunch先起独立helper，失败留manual；成功响应后延时退出，由helper等父进程/30秒deadline再拉起并写日志。重启动作与新实例可用、目标插件功能成功是不同状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/profile.ts:184-222](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/profile.ts#L184-L222)

profile线索真实优先级。

<details>
<summary>查看原文（39行）</summary>

```text
export function resolveProfile(
  argv: readonly string[] = process.argv,
  env: NodeJS.ProcessEnv = process.env,
  launched?: LaunchedProfile,
  desktopLauncher: boolean = isPackagedDesktopArgv(argv),
): ProfileFacts {
  const flagIndex = argv.indexOf('--profile')
  if (flagIndex !== -1 && argv[flagIndex + 1] !== undefined && argv[flagIndex + 1] !== '') {
    return factsFor(argv[flagIndex + 1], env, desktopLauncher)
  }
  // The published profile outranks the environment: a Desktop workaround may
  // set DSH_PROFILE globally while the running host boots another profile, and
  // following the variable there would mount the gateway (and write patch
  // rows) into a profile this host never reads. The service is the runtime's
  // own answer about the profile it actually launched.
  const published = launchedFacts(launched, desktopLauncher, env)
  if (published !== undefined) return published
  // No service (an older runtime): the packaged Desktop launcher still names
  // its profile directory positionally in argv, which outranks the
  // environment for the same reason the published service does.
  const desktopDir = desktopProfileDirFromArgv(argv)
  if (desktopDir !== undefined) {
    // Built through the same validated path as a published directory so the
    // argv fact cannot skip a guard the service fact must pass.
    const argvFacts = launchedFacts({ name: basename(desktopDir), dir: desktopDir }, desktopLauncher, env)
    if (argvFacts !== undefined) return argvFacts
  }
  if (env.DSH_PROFILE !== undefined && env.DSH_PROFILE.trim() !== '') {
    // A Desktop workaround may set DSH_PROFILE globally. Its in-process boot
    // still has only the executable in argv; keep desktop channel probing in
    // that shape, while ordinary CLI invocations remain non-desktop.
    const name = env.DSH_PROFILE.trim()
    const desktop = desktopLauncher || (argv.length <= 1 && desktopSelectedProfile(env) === name)
    return factsFor(name, env, desktop)
  }
  if (argv.includes('web')) return factsFor('web', env, desktopLauncher)
  const selected = desktopSelectedProfile(env)
  if (selected !== undefined) return factsFor(selected, env, true)
  throw new Error('plugin-manager: cannot determine the boot profile; pass --profile <name> or set DSH_PROFILE')
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/profile.ts:251-311](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/profile.ts#L251-L311)

目录/name/patch一致性及name校验。

<details>
<summary>查看原文（61行）</summary>

```text
  // because `normalize` would silently collapse a `..` away, hiding an escape
  // instead of rejecting it.
  if (!isAbsolute(profileDir) || profileDir.split(/[\/\\]/).includes('..')) {
    throw new Error(`plugin-manager: published profile directory is not a safe absolute path ${JSON.stringify(launched.dir ?? '')}`)
  }
  // The published name and directory must describe the SAME profile: the name
  // drives every CLI `--profile <name>` spawn while the directory drives the
  // files this gateway reads and writes, so a mismatch would split the two
  // write paths across different profiles. The official runtime publishes
  // exactly `basename(dir)` as the name, so this holds for every real host.
  const dirBase = profileDir.split(/[\/\\]/).filter(Boolean).pop() ?? basename(profileDir)
  if (name !== '' && name !== dirBase) {
    throw new Error(`plugin-manager: published profile name and directory disagree ${JSON.stringify(name)} vs ${JSON.stringify(profileDir)}`)
  }
  const isPosixLiteral = profileDir.includes('/') && !profileDir.includes('\\')
  const ownPatchPath = isPosixLiteral ? `${profileDir}/cordis.patch.yml` : join(profileDir, 'cordis.patch.yml')
  const publishedPatchPath = typeof launched.patchPath === 'string' ? launched.patchPath.trim() : ''
  // The patch path is a WRITE target (row enablement). Accept only the
  // profile's own patch file; anything else would let the published value
  // redirect a write outside the profile this gateway mounts.
  if (publishedPatchPath !== '' && publishedPatchPath !== ownPatchPath && normalize(publishedPatchPath) !== normalize(ownPatchPath)) {
    throw new Error(`plugin-manager: published patch path is not the launched profile's own patch file ${JSON.stringify(launched.patchPath)}`)
  }
  return {
    profileName: name !== '' ? name : dirBase,
    profileDir,
    patchPath: ownPatchPath,
    packageJsonPath: isPosixLiteral ? `${profileDir}/package.json` : join(profileDir, 'package.json'),
    // Strictly a launcher fact: only argv naming the packaged Desktop host (or
    // the persisted desktop selection, in the fallback branch below) marks the
    // run as desktop. A profile that merely happens to be *named* "desktop" is
    // not evidence about the host, and /mode's installer-service probe keys on
    // the real host shape.
    desktop: desktopLauncher,
  }
}

/** Facts for one explicitly named profile, resolved under `$DSH_HOME/profiles`. */
function factsFor(name: string, env: NodeJS.ProcessEnv, desktop: boolean): ProfileFacts {
  const trimmed = name.trim()
  assertSafeProfileName(trimmed)
  const profileDir = join(resolveDshHome(env), 'profiles', trimmed)
  return {
    profileName: trimmed,
    profileDir,
    patchPath: join(profileDir, 'cordis.patch.yml'),
    packageJsonPath: join(profileDir, 'package.json'),
    desktop,
  }
}

/**
 * Reject a profile name that is not exactly one directory segment under
 * `profiles/`. `.` is rejected alongside separators and `..`: `join` normalizes
 * it away, so accepting it would silently resolve to the `profiles` directory
 * itself rather than to a profile.
 */
function assertSafeProfileName(name: string): void {
  if (name === '' || name === '.' || name === '..' || name.includes('/') || name.includes('\\')) {
    throw new Error(`plugin-manager: invalid profile name ${JSON.stringify(name)}`)
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:132-175](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L132-L175)

官方RPC和HTTP真实调用。

<details>
<summary>查看原文（44行）</summary>

```text
export function createPluginManagerFace(ctx: ClientContext): PluginManagerFace {
  const connection = ctx.get('connection') as ConnectionHandle

  // Official channel implementations.

  const call = async (endpoint: string, payload: unknown): Promise<unknown> => {
    const result = await connection.rpc.call(CHANNEL, endpoint, payload)
    if (!result.ok) {
      throw new Error(`plugin-installer ${endpoint} failed: ${result.error.code}: ${result.error.message}`)
    }
    return result.value
  }
  const official = {
    list: async (): Promise<InstalledPluginItem[]> => parsePluginList(await call(LIST_ENDPOINT, {})),
    install: async (spec: string): Promise<InstalledPluginItem> => parseInstalledPlugin(await call(INSTALL_ENDPOINT, { spec })),
    update: async (id: string): Promise<PluginUpdateResult> => ({
      plugin: parseInstalledPlugin(await call(UPDATE_ENDPOINT, { id })),
      // The official installer channel reports no restart fact: it owns the
      // load itself, so an applied update there is one this process serves.
      restartRequired: [],
    }),
    uninstall: async (id: string): Promise<InstalledPluginItem[]> => parsePluginList(await call(UNINSTALL_ENDPOINT, { id })),
    setEnabled: async (id: string, enabled: boolean): Promise<InstalledPluginItem> =>
      parseInstalledPlugin(await call(SET_ENABLED_ENDPOINT, { id, enabled })),
    checkUpdates: async (): Promise<PluginUpdateItem[]> => parseUpdateList(await call(CHECK_UPDATES_ENDPOINT, {})),
    status: async (): Promise<InstallProgressItem> => parseInstallStatus(await call(STATUS_ENDPOINT, {})),
    failures: async (): Promise<PluginFailuresSnapshot> => parseFailuresSnapshot(await call(FAILURES_ENDPOINT, {})),
  }

  // Gateway channel implementations.

  const gatewayJson = async (path: string, init?: RequestInit): Promise<unknown> => {
    const response = await fetch(path, {
      ...init,
      headers: { 'content-type': 'application/json', ...init?.headers },
    })
    if (response.status === 403) {
      throw new Error('plugin-manager: plugin management is only available from a local browser')
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({})) as { error?: string }
      throw new Error(body.error ?? `plugin-manager: gateway ${path} failed: HTTP ${String(response.status)}`)
    }
    return response.json()
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:178-249](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L178-L249)

job状态轮询、版本与restart事实。

<details>
<summary>查看原文（72行）</summary>

```text
  /** Wait for one gateway job to settle, returning its wire state. */
  const waitJob = async (jobId: string): Promise<GatewayJobWire> => {
    const deadline = Date.now() + JOB_WAIT_MS
    for (;;) {
      const body = await gatewayJson(`${GATEWAY_PREFIX}/status?job=${encodeURIComponent(jobId)}`) as { job?: GatewayJobWire }
      const job = body.job
      if (job === undefined) throw new Error('plugin-manager: gateway job vanished')
      if (job.phase === 'done') return job
      if (job.phase === 'error') throw new Error(job.error ?? 'plugin-manager: gateway job failed')
      if (Date.now() > deadline) throw new Error('plugin-manager: gateway job timed out')
      await new Promise(resolve => { setTimeout(resolve, JOB_POLL_MS) })
    }
  }

  /** Whether a gateway install/remove is in flight (drives the progress row). */
  let gatewayInflight = false

  const gateway = {
    list: async (): Promise<InstalledPluginItem[]> =>
      parsePluginList(await gatewayJson(`${GATEWAY_PREFIX}/list`)),
    install: async (spec: string): Promise<InstalledPluginItem> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/install`, {
          method: 'POST',
          body: JSON.stringify({ spec }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway install returned no job')
        const job = await waitJob(started.jobId)
        return parseInstalledPlugin({ plugin: job.plugin })
      } finally {
        gatewayInflight = false
      }
    },
    update: async (id: string): Promise<PluginUpdateResult> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/update`, {
          method: 'POST',
          body: JSON.stringify({ id }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway update returned no job')
        const job = await waitJob(started.jobId)
        return {
          plugin: parseInstalledPlugin({ plugin: job.plugin }),
          // The job is done either way; this is the difference between an
          // update this process serves and one only a restart loads.
          restartRequired: parseRestartRequired(job.restartRequired),
        }
      } finally {
        gatewayInflight = false
      }
    },
    uninstall: async (id: string): Promise<InstalledPluginItem[]> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/remove`, {
          method: 'POST',
          body: JSON.stringify({ id }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway remove returned no job')
        await waitJob(started.jobId)
        return gateway.list()
      } finally {
        gatewayInflight = false
      }
    },
    setEnabled: async (id: string, enabled: boolean): Promise<InstalledPluginItem> =>
      parseInstalledPlugin(await gatewayJson(`${GATEWAY_PREFIX}/set-enabled`, {
        method: 'POST',
        body: JSON.stringify({ id, enabled }),
      })),
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:270-292](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L270-L292)

模式探测和缓存。

<details>
<summary>查看原文（23行）</summary>

```text
      modePromise = (async () => {
        // Prefer the host verdict: the gateway's /mode route reports whether
        // the official installer channels exist, so the direct channel probe
        // below (which 405s into the browser console on the npm web runtime)
        // only runs when the host half is absent or explicitly returns null
        // for a desktop runtime whose services are registered in-process.
        try {
          const mode = await gatewayJson(`${GATEWAY_PREFIX}/mode`) as { official?: boolean | null }
          if (mode.official === true) return 'official' as const
          if (mode.official === false) return 'gateway' as const
        } catch {
          // Host half absent (an official runtime without a boot profile):
          // fall back to the direct channel probe.
        }
        try {
          const result = await connection.rpc.call(CHANNEL, LIST_ENDPOINT, {})
          return result.ok ? 'official' as const : 'gateway' as const
        } catch {
          return 'gateway' as const
        }
      })()
    }
    return modePromise
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:271-288](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L271-L288)

网关loopback实际guard。

<details>
<summary>查看原文（18行）</summary>

```text
  /** Wrap a handler with the loopback fence and JSON error reporting. */
  const guard = (handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>) =>
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (!isLoopbackRequest(req)) {
        writeJson(res, 403, { ok: false, error: 'forbidden: loopback-only' })
        return
      }
      try {
        await handler(req, res)
      } catch (error) {
        writeJson(res, 500, { error: messageOf(error) })
      }
    }

  const listHandler = async (_req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const patchText = await readPatchText(facts.patchPath)
    const snapshot = await snapshotGateway(facts, patchText)
    writeJson(res, 200, { plugins: snapshot.plugins })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:849-862](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L849-L862)

native只针对desktop且服务存在。

<details>
<summary>查看原文（14行）</summary>

```text
  private nativeManager(): NativePluginManager | undefined {
    if (this.facts.desktop !== true) return undefined
    return this.deps.nativeManager?.()
  }

  /**
   * Whether this gateway will write through the official in-process manager
   * instead of the CLI (an application-owned profile, see
   * {@link nativeManager}). The HTTP layer reads it so its CLI-availability
   * guard never rejects a job the CLI is not going to run.
   * @returns true when the native writer serves installs, updates and removals.
   */
  usesNativeWriter(): boolean {
    return this.nativeManager() !== undefined
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:552-568](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L552-L568)

真实CLI spawn与Windows cmd分支。

<details>
<summary>查看原文（17行）</summary>

```text
export function spawnDsh(binary: string, args: string[], env: NodeJS.ProcessEnv) {
  const { command, argsPrefix } = dshSpawnCommand(binary)
  const pathApi = process.platform === 'win32' ? win32 : posix
  const childEnv = withPrependedPath(env, pathApi.dirname(binary))
  if (process.platform === 'win32' && command.toLowerCase().endsWith('.cmd')) {
    // cmd.exe by bare name resolves through the host PATH, which a GUI-launched
    // host need not carry the system directories in (issue #1857).
    return guardSpawnFailure(spawn(windowsCmdPath(env), windowsCmdShimArgs(command, args), {
      env: childEnv,
      windowsVerbatimArguments: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    }))
  }
  return guardSpawnFailure(spawn(command, [...argsPrefix, ...args], {
    env: command === process.execPath ? { ...childEnv, ELECTRON_RUN_AS_NODE: '1' } : childEnv,
    stdio: ['ignore', 'pipe', 'pipe'],
  }))
```

</details>

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:815-823](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L815-L823)

同实例队列及失败恢复。

```text
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  /** Chain one fire-and-forget CLI mutation onto the shared queue. */
  private enqueue(task: () => Promise<void>): void {
    void this.withMutationLock(task).catch(() => {})
```

**依据 10 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:348-400](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L348-L400)

源/新registry版本/兼容性门禁/实际enqueue。

<details>
<summary>查看原文（53行）</summary>

```text
    const outcome = await gateway.withMutationLock(async () => {
      const patchText = await readPatchText(facts.patchPath)
      const row = (await snapshotGateway(facts, patchText)).plugins.find(plugin => plugin.id === target)
      if (row === undefined) return { status: 404, error: `plugin-manager: plugin ${target} is not installed` }
      const migration = legacyMigrationFor(target)
      if (migration !== undefined) {
        const targetManifest = await fetchManifest(migration.to).catch(() => undefined)
        if (targetManifest === undefined || targetManifest.version === '') {
          return { status: 502, error: `plugin-manager: cannot resolve the migration target ${migration.to}` }
        }
        const targetSpec = targetSpecForLegacy(row.source.spec, targetManifest.version)
        if (targetSpec === undefined) {
          return { status: 400, error: `plugin-manager: cannot derive the migration target spec for ${target}` }
        }
        const unsafeTarget = unsafeSpecReason(targetSpec)
        if (unsafeTarget !== undefined) return { status: 400, error: unsafeTarget }
        const requiresDsh = dshRequirementOf(targetManifest)
        if (requiresDsh !== undefined) {
          const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
          if (!compatible) {
            return {
              status: 412,
              error: hostVersion === undefined
                ? `plugin-manager: cannot verify the running DSH version for ${migration.to} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before migrating`
                : `plugin-manager: ${migration.to} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before migrating`,
            }
          }
        }
        return { status: 200, job: gateway.migrate(target, migration.to, targetManifest.version, targetSpec) }
      }
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
        if (!compatible) {
          return {
            status: 412,
            error: hostVersion === undefined
              ? `plugin-manager: cannot verify the running DSH version for ${target} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before updating`
              : `plugin-manager: ${target} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before updating`,
          }
        }
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-manager/src/host/dsh-compat.ts:44-61](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/dsh-compat.ts#L44-L61)

真实semver判定含无法核实。

<details>
<summary>查看原文（18行）</summary>

```text
 * `host-too-low` when it was compared and does not, and `unverifiable` when
 * no comparison could be made. Callers fail closed on the last two (issue
 * #754) but must not describe them with the same words.
 */
export function evaluateDshCompatibility(host: string, range: string): DshCompatibility {
  // `semver.validRange('')` answers `'*'`, so an absent declaration would
  // otherwise read as an unconstrained range and become a satisfied verdict.
  // The official gate keeps the same `range.trim() !== ''` guard for the
  // same reason.
  if (range.trim() === '') return { verdict: 'unverifiable' }
  if (semver.validRange(range) === null) return { verdict: 'unverifiable' }
  // A host string that is not a single valid version is "cannot verify", not
  // "too old": `semver.satisfies` would silently answer false for it.
  if (semver.valid(host) === null) return { verdict: 'unverifiable' }
  return semver.satisfies(host, range, { includePrerelease: true })
    ? { verdict: 'satisfied' }
    : { verdict: 'host-too-low' }
}
```

</details>

**依据 12 · 源码核查**：[packages/dsh-plugin-manager/src/core/version.ts:123-132](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/core/version.ts#L123-L132)

声明来源优先级和有效字符串门槛。

<details>
<summary>查看原文（10行）</summary>

```text
export function dshRequirementOf(manifest: { dsh?: unknown; engines?: unknown; peerDependencies?: unknown }): string | undefined {
  const dshEngines = (manifest.dsh as { engines?: unknown } | undefined)?.engines as { dsh?: unknown } | undefined
  const engines = (manifest.engines as { dsh?: unknown } | undefined)?.dsh
  const peers = (manifest.peerDependencies as Record<string, unknown> | undefined)?.['@deepseek-ai/dsh']
  // The host's own peer gate is the LAST word: a package that declares the
  // host only under peerDependencies still gets that row skipped at boot when
  // the floor is not met, so a requirement we display must come from the same
  // place the gate reads, or the user is told nothing and then loses the row.
  const value = dshEngines?.dsh ?? engines ?? peers
  return typeof value === 'string' && value.trim() !== '' ? value.trim() : undefined
```

</details>

**依据 13 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1626-1725](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1626-L1725)

CLI真实执行、前后核对和阶段分支。

<details>
<summary>查看原文（100行）</summary>

```text
  private async runInner(job: GatewayJob, args: string[], timeoutMs: number): Promise<void> {
    const binary = this.binary()
    if (binary === null) {
      job.phase = 'error'
      job.error = 'plugin-manager: dsh CLI not found on PATH'
      return
    }
    const before = await this.capture()
    const output = createOutputCapture(MAX_OUTPUT_BYTES)
    const child = this.spawnCli(binary, args)
    child.stdout?.on('data', (chunk: Buffer) => { capture(chunk, output) })
    child.stderr?.on('data', (chunk: Buffer) => { capture(chunk, output) })
    const code = await awaitCliExit(child, output, timeoutMs)
    if (code !== 0) {
      job.phase = 'error'
      const tail = output.read().trim()
      job.error = tail === '' ? `plugin-manager: dsh plugin ${job.action} exited with code ${String(code)}` : tail
      return
    }
    let after = await this.capture()
    // B9: the CLI's bundle reconciliation re-adds every bundle-declaring
    // dependency to dsh.profile.bundles — including packages the composition
    // already mounts through a patch row (the aggregate's better-sidebar
    // row), which double-mounts and kills the next boot. Strip exactly the
    // newly added, already-row-mounted entries back out before anything else
    // validates or preflights the result.
    const stripped = await this.stripDuplicateMounts(job, before, after)
    if (stripped === undefined) return
    if (stripped.length > 0) {
      job.notices = stripped.map(name => ({ id: name, name, from: 'enabled', to: 'uninstalled' }))
      after = await this.capture()
    }
    const conflicts = significantChanges(diffLayer(before.layer, after.layer))
    if (job.action === 'install') {
      const name = this.newDependency(before, after)
      if (name === undefined) {
        // B8: a success exit code is not proof the install landed.
        job.phase = 'error'
        job.error = 'plugin-manager: dsh plugin add 报告成功，但 profile 未新增任何依赖（安装未生效）'
        return
      }
      // B5: a duplicate entry id is boot-blocking. Never write disabled rows
      // for a shared id (they cannot stop the loader's duplicate check and
      // they flag the existing owner) — roll the NEW package back instead.
      const duplicate = await this.detectDuplicateClaims(before, after)
      if (duplicate !== undefined) {
        await this.rollbackInstall(job, name, `与现有插件的入口 id 冲突（${duplicate.ids.join(', ')}）`, conflicts)
        return
      }
      // B6 (static part): an insert entry naming an unresolvable package fails
      // the next boot's import; --dump-config cannot see it (composition only).
      const missing = await this.unresolvableInsertNames(name)
      if (missing.length > 0) {
        await this.rollbackInstall(job, name, `入口引用了不可解析的包（${missing.join(', ')}）`, conflicts)
        return
      }
      await this.verifyBoot(job, before, after, conflicts)
      if (job.phase === 'error') return
    } else if (job.action === 'update') {
      const targetId = job.targetId
      const targetVersion = job.targetVersion
      if (targetId === undefined || targetVersion === undefined || !after.dependencies.includes(targetId)) {
        job.phase = 'error'
        job.error = 'plugin-manager: dsh plugin add 报告成功，但目标插件未保留在 profile 中（更新未生效）'
        return
      }
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
      if (updated.version !== targetVersion) {
        job.phase = 'error'
        job.error = `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
        return
      }
      job.plugin = updated
      const dump = await this.verifyBoot(job, before, after, conflicts)
      if (job.phase === 'error') return
      // The composed target profile — not the profile patch and not the
      // source profile — is the authority for which row ids still exist: an
      // update that retires a row leaves the user's old override pointing at
      // nothing, which the loader warns about on every boot.
      if (await this.pruneOrphanOverrides(job, dump) === undefined) return
    } else {
      // B8 (remove): a success exit code must mean the dependency is gone.
      const removed = before.dependencies.find(candidate => !after.dependencies.includes(candidate))
      if (removed === undefined) {
        job.phase = 'error'
        job.error = 'plugin-manager: dsh plugin remove 报告成功，但依赖仍在 profile 中（卸载未生效）'
        return
      }
    }
    job.conflicts = conflicts.map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    if (job.action === 'install' || job.action === 'remove') {
      job.plugin = await this.rowFor(job.action, job.spec, before, after)
    }
    job.phase = 'done'
```

</details>

**依据 14 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:457-509](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L457-L509)

真实entry enablement、locked行与写回。

<details>
<summary>查看原文（53行）</summary>

```text
    const outcome = await gateway.withMutationLock(async () => {
      const patchText = await readPatchText(facts.patchPath)
      // Write and read the same id space: the entry ids the package's bundle
      // patch claims (falling back to the package name), not the package name
      // itself. Package-name rows never matched the loader entries. The row
      // carries the entry's own name: the include semantics skip a bare row
      // whose name mismatches the inserted entry.
      const manifest = await readProfileManifest(facts.packageJsonPath)
      let ownerName = target
      let entries: Array<{ id: string; name: string; baseEnabled: boolean }>
      if (manifest.dependencies[target] !== undefined) {
        entries = await claimedEntryRowsOf(facts, target)
      } else {
        // Row-level toggle: the id is one entry row claimed by an aggregate's
        // bundle patch (e.g. web-ui-pet), not a dependency name. Only that
        // row gets the override; its siblings keep their state.
        const owner = await findRowOwner(facts, Object.keys(manifest.dependencies), target)
        if (owner === undefined) {
          return { error: `plugin-manager: plugin ${target} is not installed` } as const
        }
        if (!enabled && LOCKED_ENTRY_IDS.has(target)) {
          // Never persist a disabled override that would take down the manager
          // tab itself, its settings surface, or the aggregate compat face —
          // the UI performing these writes must stay reachable to undo them.
          return { error: `plugin-manager: row ${target} is required by this manager and cannot be disabled` } as const
        }
        ownerName = owner.packageName
        entries = [owner.row]
      }
      let next = patchText
      for (const entry of entries) {
        // A whole-package disable still force-keeps the locked rows mounted.
        const entryEnabled = enabled || LOCKED_ENTRY_IDS.has(entry.id)
        next = setRowEnabled(next, facts.patchPath, entry.id, entry.name, entryEnabled, entry.baseEnabled)
      }
      if (next !== patchText) {
        // The write must leave this handler's async context. The toggle can
        // arrive inside the Host's hmr.runExclusive transaction, and
        // cordis.patch.yml is exactly the file the HMR config watcher refreshes
        // from: a write issued on the transaction's context makes the watcher's
        // refresh re-enter runExclusive, which rejects with "HMR transactions
        // cannot be nested" and fails the toggle (#1816). A bare deferral would
        // NOT help - setImmediate inherits the transaction mark (measured; see
        // shared/host/detached-work.ts) - so the write is scheduled through the
        // module-scope AsyncResource. It is still awaited, so the response
        // reports the real write outcome and the snapshot below stays ordered.
        await runDetached(() => new Promise<void>((resolve, reject) => {
          setImmediate(() => {
            writePatchAtomic(facts.patchPath, next).then(resolve, reject)
          })
        }))
      }
      const snapshot = await snapshotGateway(facts, next)
```

</details>

**依据 15 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1203-1255](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1203-L1255)

native目标版本/readback与restartRequired。

<details>
<summary>查看原文（53行）</summary>

```text
  private async runNativeUpdate(job: GatewayJob, native: NativePluginManager): Promise<void> {
    const targetId = job.targetId
    const targetVersion = job.targetVersion
    if (targetId === undefined || targetVersion === undefined) {
      job.phase = 'error'
      job.error = 'plugin-manager: update job is missing the target id or version'
      return
    }
    const before = await this.capture()
    const carried = await readProfileManifest(this.facts.packageJsonPath)
    const first = await native.installBundle(job.spec, { enabled: true, requestId: job.id })
    let refusal = nativeManagerFailure(first)
    // A landed run that answered `restart-required` is still a landed run; the
    // fact is carried to the caller instead of being folded into a failure.
    let restartRequired = nativeManagerRestartRequired(first)
    if (refusal !== undefined && nativeManagerRefusalCode(first) === 'already-installed') {
      const replacement = await this.replaceInstalled(job, native, targetId, carried.dependencies[targetId])
      refusal = replacement.failure
      restartRequired = replacement.restartRequired
    }
    if (refusal !== undefined) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器更新失败：${refusal}`
      return
    }
    const after = await this.capture()
    if (!after.dependencies.includes(targetId)) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但目标插件未保留在 profile 中（更新未生效）`
      return
    }
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
    if (updated.version !== targetVersion) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
      return
    }
    // An application-owned profile composes through the same read-only probe,
    // so orphaned overrides are pruned here too; a runtime that cannot compose
    // leaves the patch file exactly as it is (see {@link pruneOrphanOverrides}).
    if (await this.pruneOrphanOverrides(job) === undefined) return
    job.plugin = updated
    job.conflicts = significantChanges(diffLayer(before.layer, after.layer)).map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    // The version landed, so the job is `done`; this names what only a restart
    // can load, which is exactly the fact an in-place success does not carry.
    if (restartRequired) job.restartRequired = [targetId]
    job.phase = 'done'
```

</details>

**依据 16 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1294-1327](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1294-L1327)

两阶段替换/原spec恢复。

<details>
<summary>查看原文（34行）</summary>

```text
  private async replaceInstalled(
    job: GatewayJob,
    native: NativePluginManager,
    targetId: string,
    previousSpec: string | undefined,
  ): Promise<ReplacementResult> {
    if (previousSpec === undefined) {
      return { failure: `${targetId} 不在 profile 依赖中，无法替换已安装版本`, restartRequired: false }
    }
    // Read while the bundle is still in the list: the removal is what drops it.
    const index = await this.bundleIndexOf(targetId)
    const removal = await this.removeForReplacement(native, targetId)
    if (removal.failure !== undefined) {
      if (removal.deselected) await this.restoreBundleSelection(native, targetId)
      return { failure: `已安装版本无法移除（${removal.failure}），本次更新未做改动${removal.remedy}`, restartRequired: false }
    }
    const installVerdict = await native.installBundle(job.spec, { enabled: true, requestId: job.id })
    const refusal = nativeManagerFailure(installVerdict)
    // Either phase can report it: the removal because the old rows are already
    // gone, the reinstall because the new ones cannot be loaded in place.
    const restartRequired = removal.restartRequired || nativeManagerRestartRequired(installVerdict)
    if (refusal === undefined) {
      await this.restoreBundleIndex(targetId, previousSpec, index)
      return { restartRequired }
    }
    const restoreSpec = `${targetId}@${previousSpec}`
    const restoreFailure = nativeManagerFailure(await native.installBundle(restoreSpec, { enabled: true, requestId: job.id }))
    if (restoreFailure !== undefined) {
      return { failure: `${refusal}；装回 ${restoreSpec} 也失败：${restoreFailure}，请手动重新安装`, restartRequired: false }
    }
    // The rollback reinstalls the previous version at the end of the list too,
    // so the same index has to be restored for a failed update as for a landed one.
    await this.restoreBundleIndex(targetId, previousSpec, index)
    return { failure: `${refusal}；已装回 ${restoreSpec}`, restartRequired: false }
```

</details>

**依据 17 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:113-134](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/restart.ts#L113-L134)

三个重启模式的真实条件。

<details>
<summary>查看原文（22行）</summary>

```text
export function planRestart(facts: RestartFacts): RestartPlan {
  // The Desktop shell owns this process tree: it is the only party that can
  // relaunch the application, and it already offers that action when the host
  // stops. ELECTRON_RUN_AS_NODE is the second, launcher-independent signal for
  // a host started by an Electron shell (the packaged Desktop sets it; a
  // command-line launch never does). Owning the tree is not the same as
  // replacing it, though: without the shell's restart guarantee, exiting here
  // leaves the user with a stopped host and an error page, so keep serving.
  if (facts.desktop === true || facts.env.ELECTRON_RUN_AS_NODE === '1') {
    return shellRestartIsSupported(facts.env) ? { mode: 'shell' } : { mode: 'manual' }
  }
  // Without a terminal this process was started by something that watches it
  // (a supervisor, an editor task, another app's child process). Re-executing
  // ourselves there would duplicate a server the watcher believes it owns.
  if (!facts.interactive) return { mode: 'manual' }
  // argv[0] is the script the interpreter runs (the dsh CLI entry); without it
  // there is no command line worth re-executing.
  const script = facts.argv[0]
  if (script === undefined || script === '') return { mode: 'manual' }
  return {
    mode: 'relaunch',
    command: {
```

</details>

**依据 18 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:258-268](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/restart.ts#L258-L268)

真正起helper/退出动作与manual回退。

<details>
<summary>查看原文（11行）</summary>

```text
export function performRestart(plan: RestartPlan, runtime: RestartRuntime = {}): RestartMode {
  if (plan.mode === 'manual') return 'manual'
  const startHelper = runtime.startHelper ?? ((command: RelaunchCommand) => startRelaunchHelper(command))
  const schedule = runtime.schedule ?? ((run: () => void, delayMs: number) => { setTimeout(run, delayMs) })
  const exit = runtime.exit ?? (() => { process.exit(0) })
  if (plan.mode === 'relaunch') {
    if (plan.command === undefined || !startHelper(plan.command)) return 'manual'
  }
  // The response must reach the browser before this process disappears.
  schedule(exit, RESTART_EXIT_DELAY_MS)
  return plan.mode
```

</details>

#### 缺口

- 官方RPC/native writer内部行为、实际启动形式、HMR和跨平台进程行为未完整审/运行
  **影响**：不能把接口适配器与参数线索推成宿主执行/加载和全局锁的独立证明
  **进一步探讨**：未来先识别实际模式、profile/旧版本与写入通道；只在普通CLI网关测试一个可信包，其他宿主通道按本项边界另验。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些成功、回滚、查询和并发结论不能扩大？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前预检比单看exit0强，但--dump-config是组合检查，代码还另查insert包可解析，仍没有执行每个目标插件import/apply或核心功能。CLI update预检失败若没有新增依赖，会报error而不把原版本装回；安装回滚则直接spawn remove并仅凭exit0写“已自动回滚”，没有同等依赖消失回读。remove正常路径也仅检查任意before依赖在after消失，非专门断言请求ID已消失；若外部写入同时变化，不能当目标撤除证明。capture部分文件读取/解析失败退空集合，亦不是一致性快照。

native replacement只在明确返回拒绝值的第二阶段尝试恢复，若remove已完成而install调用抛异常，外层catch只标job error，不在该异常分支装回。成功返回后目标不在/版本不符也只是error；原spec恢复本身还可失败、原spec若为range也不是原实装精确版本证明，恢复层位置/selection也有可选服务与失败分支；restoreBundleIndex写回异常只warn，更新仍可继续done，层序未还原可能改变patch覆盖顺序。已经有refusal补偿、层序保留和restartRequired的增量应保留，但不能把“失败后必留可用旧插件”注释当事实。legacy迁移另有移旧/加新/组合/版本核对与rollback，rollback移新包退出码未核、层序恢复错误可吞，部分caller随后重写job.error可遮住回滚失败细节；本轮试用排除迁移。

队列只约束走withMutationLock的任务。启动1.5秒timer直接调用repairProfileRowNames；该方法读live names和patch后writePatchAtomic，没有入队或内容版本CAS。已知ID且name不同才修复，未知ID/解析不了保留，这是必要保护；仍可能与同实例enablement或CLI写回并发。外部CLI/另一个host不受本队列约束。patch/manifest用固定.tmp和单个.bak-plugin-manager，备份copy失败被吞后仍写入；rename并非跨文件事务/保留用户并发修改的保证，加载前应另做可核的外部备份，而不是等安装后点更新才备份。

预览与目标未绑定：UI批量保存已查rows，却每项只update(row.id)；HTTP也只交id，路由再次fetchManifest并选择当时latest。因此若registry在预览后改变，实际targetVersion可不是刚看到的版本；精确落盘检查保证“路由新解析的版本”，不保证“用户预览的版本”。这是静态条件窗口，未复现registry竞态，也不声称默认已安装错版。check-updates对获取失败/不支持源直接continue，且普通源只判断version与current不相等，不先证明semver更高；空列表不证明所有查询成功或所有包无更新，预发布/固定回滚版本也可能被列为对齐registry版本。真正update再fetch失败会502拒绝，不能把查询遗漏说成未核版本仍会安装。

浏览器等job最多名义7分钟，但只在每次fetch返回后检查deadline；等待超时/断连没有取消后台写入的链，重试可能排另一作业。服务器add/remove名义6/2分钟在awaitCliExit里只是到时child.kill，然后仍等退出，没有此helper的SIGKILL升级或强制settle；不能推广版本探针另有升级的保护到安装作业，也不能当子进程树/总恢复时间上限。jobs仅内存、完成环保100个，重启丢记录且job计数重置；此前成功的批次项、失败残留不会因工具条销毁而事务撤销。

native restartRequired是有用事实；相反官方RPC适配器固定空数组，不是独立加载验收。setEnabled的profile override、包清单version、job done、重启已请求、helper日志“started”各不等于目标运行实例已加载并通过功能。helper以短时进程存活/退出决定重试，不查询插件ready/业务信号；shell模式退出依赖环境标记所宣称的宿主重拉能力，未在本项核实每种shell。敏感会话/不可中断生产实例不适合据此一键重启。

未执行安装/目标包脚本、修改profile或重启，没有复现丢更新/错版/误回滚；这是源码可达条件和验收缺口，不是已发生事故或完整供应链/宿主审计。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1684-1714](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1684-L1714)

update错误未回原版、remove任意依赖消失判据。

<details>
<summary>查看原文（31行）</summary>

```text
    } else if (job.action === 'update') {
      const targetId = job.targetId
      const targetVersion = job.targetVersion
      if (targetId === undefined || targetVersion === undefined || !after.dependencies.includes(targetId)) {
        job.phase = 'error'
        job.error = 'plugin-manager: dsh plugin add 报告成功，但目标插件未保留在 profile 中（更新未生效）'
        return
      }
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
      if (updated.version !== targetVersion) {
        job.phase = 'error'
        job.error = `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
        return
      }
      job.plugin = updated
      const dump = await this.verifyBoot(job, before, after, conflicts)
      if (job.phase === 'error') return
      // The composed target profile — not the profile patch and not the
      // source profile — is the authority for which row ids still exist: an
      // update that retires a row leaves the user's old override pointing at
      // nothing, which the loader warns about on every boot.
      if (await this.pruneOrphanOverrides(job, dump) === undefined) return
    } else {
      // B8 (remove): a success exit code must mean the dependency is gone.
      const removed = before.dependencies.find(candidate => !after.dependencies.includes(candidate))
      if (removed === undefined) {
        job.phase = 'error'
        job.error = 'plugin-manager: dsh plugin remove 报告成功，但依赖仍在 profile 中（卸载未生效）'
        return
      }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2075-2104](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L2075-L2104)

仅dump-config与按新增owner回滚条件。

<details>
<summary>查看原文（30行）</summary>

```text
  private async verifyBoot(job: GatewayJob, before: CapturedState, after: CapturedState, conflicts: LayerChange[]): Promise<string | undefined> {
    const binary = this.binary()
    if (binary === null) return undefined
    const name = this.newDependency(before, after)
    const verifyOutput = createOutputCapture(MAX_OUTPUT_BYTES)
    const child = this.spawnCli(binary, ['--profile', this.facts.profileName, '--dump-config'])
    child.stdout?.on('data', (chunk: Buffer) => { capture(chunk, verifyOutput) })
    child.stderr?.on('data', (chunk: Buffer) => { capture(chunk, verifyOutput) })
    const code = await awaitCliExit(child, verifyOutput, 90_000)
    const dump = verifyOutput.read()
    if (code === 0) return dump
    const tail = dump.trim()
    if (name === undefined) {
      job.phase = 'error'
      job.error = tail === '' ? 'plugin-manager: boot preflight failed' : tail
      return undefined
    }
    const claimed = await this.claimedEntriesOf(name)
    const implicated = tail.includes(name) || claimed.some(id => tail.includes(id))
    if (implicated) {
      // Owner-aware: roll the new package back rather than disabling shared
      // rows, which cannot reach every failure shape anyway.
      await this.rollbackInstall(job, name, `启动预检失败${tail === '' ? '' : `：\n${tail}`}`, conflicts)
    } else {
      job.phase = 'error'
      job.error = tail === ''
        ? 'plugin-manager: 启动预检失败（与本次安装无关）'
        : `plugin-manager: 启动预检失败（与本次安装无关）：\n${tail}`
    }
    return undefined
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1990-2008](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1990-L2008)

安装回滚只看remove退出码。

<details>
<summary>查看原文（19行）</summary>

```text
  private async rollbackInstall(job: GatewayJob, name: string, reason: string, conflicts: LayerChange[]): Promise<void> {
    let rolledBack = false
    let tail = ''
    const binary = this.binary()
    if (binary !== null) {
      const output = createOutputCapture(MAX_OUTPUT_BYTES)
      const child = this.spawnCli(binary, ['plugin', '--profile', this.facts.profileName, 'remove', name])
      child.stdout?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      child.stderr?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      const code = await awaitCliExit(child, output, REMOVE_TIMEOUT_MS)
      rolledBack = code === 0
      tail = output.read().trim()
    }
    job.phase = 'error'
    job.error = rolledBack
      ? `plugin-manager: ${reason}，已自动回滚 ${name}`
      : `plugin-manager: ${reason}；自动回滚失败，请手动执行 dsh plugin --profile ${this.facts.profileName} remove ${name}${tail === '' ? '' : `：\n${tail}`}`
    conflicts.push({ id: name, from: 'enabled', to: 'uninstalled' })
    job.conflicts = conflicts.map(change => ({ id: change.id, name: change.id, from: change.from, to: change.to }))
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1568-1596](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1568-L1596)

读取/解析失败退空的capture。

<details>
<summary>查看原文（29行）</summary>

```text
  private async capture(): Promise<CapturedState> {
    const rows = new Map<string, boolean>()
    let patchText = '[]\n'
    try {
      patchText = await readFile(this.facts.patchPath, 'utf8')
    } catch {
      patchText = '[]\n'
    }
    try {
      const { root } = parsePatch(patchText, this.facts.patchPath)
      for (const item of root.items) {
        const id = bareRowId(item)
        if (id !== undefined) rows.set(id, bareRowEnabled(item))
      }
    } catch {
      // A broken patch file must not block an install: the CLI owns the write
      // and the error surfaces through its output.
    }
    let bundles: string[] = []
    let dependencies: string[] = []
    try {
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      bundles = manifest.bundles
      dependencies = Object.keys(manifest.dependencies)
    } catch {
      bundles = []
      dependencies = []
    }
    return { layer: { rows, bundles }, bundles, patchText, dependencies }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1294-1327](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1294-L1327)

native按返回拒绝恢复原spec，非所有异常补偿。

<details>
<summary>查看原文（34行）</summary>

```text
  private async replaceInstalled(
    job: GatewayJob,
    native: NativePluginManager,
    targetId: string,
    previousSpec: string | undefined,
  ): Promise<ReplacementResult> {
    if (previousSpec === undefined) {
      return { failure: `${targetId} 不在 profile 依赖中，无法替换已安装版本`, restartRequired: false }
    }
    // Read while the bundle is still in the list: the removal is what drops it.
    const index = await this.bundleIndexOf(targetId)
    const removal = await this.removeForReplacement(native, targetId)
    if (removal.failure !== undefined) {
      if (removal.deselected) await this.restoreBundleSelection(native, targetId)
      return { failure: `已安装版本无法移除（${removal.failure}），本次更新未做改动${removal.remedy}`, restartRequired: false }
    }
    const installVerdict = await native.installBundle(job.spec, { enabled: true, requestId: job.id })
    const refusal = nativeManagerFailure(installVerdict)
    // Either phase can report it: the removal because the old rows are already
    // gone, the reinstall because the new ones cannot be loaded in place.
    const restartRequired = removal.restartRequired || nativeManagerRestartRequired(installVerdict)
    if (refusal === undefined) {
      await this.restoreBundleIndex(targetId, previousSpec, index)
      return { restartRequired }
    }
    const restoreSpec = `${targetId}@${previousSpec}`
    const restoreFailure = nativeManagerFailure(await native.installBundle(restoreSpec, { enabled: true, requestId: job.id }))
    if (restoreFailure !== undefined) {
      return { failure: `${refusal}；装回 ${restoreSpec} 也失败：${restoreFailure}，请手动重新安装`, restartRequired: false }
    }
    // The rollback reinstalls the previous version at the end of the list too,
    // so the same index has to be restored for a failed update as for a landed one.
    await this.restoreBundleIndex(targetId, previousSpec, index)
    return { failure: `${refusal}；已装回 ${restoreSpec}`, restartRequired: false }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1170-1178](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1170-L1178)

native外层catch仅报错。

```text
  private enqueueNativeUpdate(job: GatewayJob, native: NativePluginManager): void {
    this.enqueue(async () => {
      try {
        await this.runNativeUpdate(job, native)
      } catch (error) {
        job.phase = 'error'
        job.error = `plugin-manager: 官方插件管理器更新失败：${error instanceof Error ? error.message : String(error)}`
      }
      this.retainFinished(job.id)
```

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1228-1239](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1228-L1239)

native读回不符仅error。

<details>
<summary>查看原文（12行）</summary>

```text
    const after = await this.capture()
    if (!after.dependencies.includes(targetId)) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但目标插件未保留在 profile 中（更新未生效）`
      return
    }
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
    if (updated.version !== targetVersion) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
      return
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1002-1043](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1002-L1043)

迁移rollback各条件与退出码/层序限制。

<details>
<summary>查看原文（42行）</summary>

```text
  private async rollbackMigration(
    job: GatewayJob,
    sourceId: string,
    targetId: string,
    oldSpec: string,
    oldIndex: number,
    targetPreviouslyInstalled: boolean,
  ): Promise<void> {
    const binary = this.binary()
    if (binary === null) {
      job.phase = 'error'
      job.error = 'plugin-manager: 迁移失败且无法回滚：dsh CLI not found on PATH'
      return
    }
    const current = await this.capture()
    if (!targetPreviouslyInstalled && current.dependencies.includes(targetId)) {
      await this.runCli(binary, ['plugin', '--profile', this.facts.profileName, 'remove', targetId], REMOVE_TIMEOUT_MS)
    }
    // If the current aggregate already existed before this migration, the
    // profile already had both bundles and was unusable. Keep the single
    // current aggregate on rollback instead of re-adding the legacy duplicate.
    if (targetPreviouslyInstalled) {
      job.phase = 'error'
      job.error = 'plugin-manager: 聚合包迁移失败，已保留当前聚合包并移除旧包'
      return
    }
    const restoreOld = this.restoreSpec(sourceId, oldSpec)
    const restored = await this.runCli(
      binary,
      ['plugin', '--profile', this.facts.profileName, 'add', restoreOld],
      ADD_TIMEOUT_MS,
    )
    if (restored.code !== 0) {
      job.phase = 'error'
      job.error = `plugin-manager: 迁移失败且回滚到 ${restoreOld} 失败${restored.output === '' ? '' : `：\n${restored.output}`}`
      return
    }
    if (oldIndex >= 0) {
      await reorderProfileBundle(this.facts.packageJsonPath, sourceId, oldIndex).catch(() => undefined)
    }
    job.phase = 'error'
    job.error = 'plugin-manager: 聚合包迁移失败，已回滚到旧包'
```

</details>

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:933-948](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L933-L948)

caller回滚后重写job.error。

<details>
<summary>查看原文（16行）</summary>

```text
      const add = await this.runCli(
        binary,
        ['plugin', '--profile', this.facts.profileName, 'add', targetSpec],
        ADD_TIMEOUT_MS,
      )
      if (add.code !== 0) {
        await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
        job.error = `plugin-manager: 迁移安装 ${targetSpec} 失败${add.output === '' ? '' : `：\n${add.output}`}`
        return
      }
      after = await this.capture()
    }
    if (!after.dependencies.includes(targetId)) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 未出现在 profile 中`
      return
```

</details>

**依据 10 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:108-118](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/index.ts#L108-L118)

启动修复直调而非队列入口。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => {
    const timer = setTimeout(() => {
      void gateway.repairProfileRowNames().then((repaired) => {
        if (repaired.length === 0) return
        console.warn('[plugin-manager] 已修复 profile 中失效的行名：' + repaired.map(row => `${row.id}（${row.from} → ${row.to}）`).join('、'))
      }).catch((error: unknown) => {
        console.error('[plugin-manager] profile 行名修复失败：' + (error instanceof Error ? error.message : String(error)))
      })
    }, 1500)
    return () => { clearTimeout(timer) }
  }, 'plugin-manager: stale row name repair')
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1888-1907](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1888-L1907)

修复读写无withMutationLock/CAS。

<details>
<summary>查看原文（20行）</summary>

```text
  async repairProfileRowNames(): Promise<Array<{ id: string; from: string; to: string }>> {
    const names = await this.liveEntryNames()
    if (names === undefined || names.size === 0) return []
    let text: string
    try {
      text = await readFile(this.facts.patchPath, 'utf8')
    } catch {
      return []
    }
    let repaired: RepairedRowNames
    try {
      repaired = repairStaleRowNames(text, this.facts.patchPath, names)
    } catch {
      // A patch file this gateway cannot parse is not its to repair: the CLI
      // owns that file and reports its own parse error.
      return []
    }
    if (repaired.repaired.length === 0) return []
    await writePatchAtomic(this.facts.patchPath, repaired.text)
    return repaired.repaired
```

</details>

**依据 12 · 源码核查**：[packages/dsh-plugin-manager/src/host/rows.ts:444-460](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/rows.ts#L444-L460)

仅已知id/name修复，未知保留。

<details>
<summary>查看原文（17行）</summary>

```text
export function repairStaleRowNames(text: string, filename: string, liveNames: ReadonlyMap<string, string>): RepairedRowNames {
  const { document, root } = parsePatch(text, filename)
  const repaired: Array<{ id: string; from: string; to: string }> = []
  for (const item of root.items) {
    if (!isBareRow(item)) continue
    const id = bareRowId(item)
    const from = bareRowName(item)
    if (id === undefined || from === undefined) continue
    const to = liveNames.get(id)
    if (to === undefined || to === from) continue
    item.set('name', document.createNode(to))
    repaired.push({ id, from, to })
  }
  if (repaired.length === 0) return { text, repaired }
  const serialized = document.toString({ lineWidth: 0 })
  const body = serialized.endsWith('\n') ? serialized.slice(0, -1) : serialized
  return { text: `${body}${text.endsWith('\n') ? '\n' : ''}`, repaired }
```

</details>

**依据 13 · 源码核查**：[packages/dsh-plugin-manager/src/host/rows.ts:22-25](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/rows.ts#L22-L25)

固定tmp/backup和备份失败吞掉。

```text
export async function writePatchAtomic(patchPath: string, text: string): Promise<void> {
  await copyFile(patchPath, `${patchPath}.bak-plugin-manager`).catch(() => {})
  await writeFile(`${patchPath}.tmp`, text, { mode: 0o600 })
  await rename(`${patchPath}.tmp`, patchPath)
```

**依据 14 · 源码核查**：[packages/dsh-plugin-manager/src/host/profile.ts:355-389](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/profile.ts#L355-L389)

manifest同类备份与写回。

<details>
<summary>查看原文（35行）</summary>

```text
export async function stripProfileBundles(packageJsonPath: string, names: readonly string[]): Promise<void> {
  const text = await readFile(packageJsonPath, 'utf8')
  const parsed = JSON.parse(stripBom(text)) as { dsh?: { profile?: { bundles?: unknown } } }
  const profile = parsed.dsh?.profile
  if (profile === undefined || !Array.isArray(profile.bundles)) return
  profile.bundles = profile.bundles.filter(entry => !(typeof entry === 'string' && names.includes(entry)))
  await copyFile(packageJsonPath, `${packageJsonPath}.bak-plugin-manager`).catch(() => {})
  await writeFile(`${packageJsonPath}.tmp`, `${JSON.stringify(parsed, null, 2)}\n`, { mode: 0o600 })
  await rename(`${packageJsonPath}.tmp`, packageJsonPath)
}

/**
 * Move one bundle entry to a position in `dsh.profile.bundles`, preserving
 * every unrelated entry. The plugin-manager migration uses this to keep the
 * renamed aggregate at the same layer position it occupied before the
 * remove/update cycle instead of leaving the CLI append at the end.
 * @param packageJsonPath - absolute path of the profile manifest.
 * @param name - bundle entry to move.
 * @param index - desired zero-based position.
 */
export async function reorderProfileBundle(packageJsonPath: string, name: string, index: number): Promise<void> {
  const text = await readFile(packageJsonPath, 'utf8')
  const parsed = JSON.parse(stripBom(text)) as { dsh?: { profile?: { bundles?: unknown } } }
  const profile = parsed.dsh?.profile
  if (profile === undefined || !Array.isArray(profile.bundles)) return
  const bundles = profile.bundles.filter((entry): entry is string => typeof entry === 'string')
  const current = bundles.indexOf(name)
  if (current >= 0) bundles.splice(current, 1)
  const target = Math.max(0, Math.min(index, bundles.length))
  bundles.splice(target, 0, name)
  profile.bundles = bundles
  await copyFile(packageJsonPath, `${packageJsonPath}.bak-plugin-manager`).catch(() => {})
  await writeFile(`${packageJsonPath}.tmp`, `${JSON.stringify(parsed, null, 2)}
`, { mode: 0o600 })
  await rename(`${packageJsonPath}.tmp`, packageJsonPath)
```

</details>

**依据 15 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:134-166](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L134-L166)

只传id、先成功项保留、首错停止。

<details>
<summary>查看原文（33行）</summary>

```text
  const onUpdateAll = (): void => {
    if (busyRef.current) return
    const queue = applicableUpdates(rows)
    if (queue.length === 0) return
    busyRef.current = true
    setPhase('updating')
    setError(undefined)
    void (async () => {
      const done: string[] = []
      for (const [index, row] of queue.entries()) {
        setCursor({ name: row.id, index: index + 1, total: queue.length })
        try {
          const result = await update(row.id)
          // The update landed; when this process cannot load it, the run still
          // counts as applied and continues, and the panel names the restart.
          if (result.restartRequired.length > 0) {
            setRestartRequired(current => [...current, { id: row.id, version: result.plugin.version }])
          }
        } catch (reason) {
          // Stop at the first failure: the remaining rows stay listed with their
          // versions, so the user sees exactly what did not go through.
          setError(t('failed', { reason: messageOf(reason) }))
          break
        }
        done.push(row.id)
        setApplied([...done])
        setRows(current => current.filter(item => item.id !== row.id))
      }
      setCursor(undefined)
    })().finally(() => {
      busyRef.current = false
      setPhase('idle')
    })
```

</details>

**依据 16 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:212-225](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L212-L225)

客户端update只送id。

<details>
<summary>查看原文（14行）</summary>

```text
    update: async (id: string): Promise<PluginUpdateResult> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/update`, {
          method: 'POST',
          body: JSON.stringify({ id }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway update returned no job')
        const job = await waitJob(started.jobId)
        return {
          plugin: parseInstalledPlugin({ plugin: job.plugin }),
          // The job is done either way; this is the difference between an
          // update this process serves and one only a restart loads.
          restartRequired: parseRestartRequired(job.restartRequired),
```

</details>

**依据 17 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-400](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L378-L400)

重新解析latest并精确绑定新解析值。

<details>
<summary>查看原文（23行）</summary>

```text
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
        if (!compatible) {
          return {
            status: 412,
            error: hostVersion === undefined
              ? `plugin-manager: cannot verify the running DSH version for ${target} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before updating`
              : `plugin-manager: ${target} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before updating`,
          }
        }
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 18 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:551-607](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L551-L607)

查询遗漏及版本不等非仅更高。

<details>
<summary>查看原文（57行）</summary>

```text
  const checkUpdatesHandler = async (_req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const patchText = await readPatchText(facts.patchPath)
    const snapshot = await snapshotGateway(facts, patchText)
    const updates: Array<{ id: string; current: string; latest: string; kind?: 'update' | 'migrate'; target?: string; targetVersion?: string; requiresDsh?: string; compatible?: boolean; hostVersion?: string }> = []
    for (const plugin of snapshot.plugins) {
      const migration = legacyMigrationFor(plugin.id)
      if (migration !== undefined) {
        const targetManifest = await fetchManifest(migration.to).catch(() => undefined)
        if (targetManifest === undefined || targetManifest.version === '') continue
        const update: {
          id: string
          current: string
          latest: string
          kind: 'migrate'
          target: string
          targetVersion: string
          requiresDsh?: string
          compatible?: boolean
          hostVersion?: string
        } = {
          id: plugin.id,
          current: plugin.version,
          latest: targetManifest.version,
          kind: 'migrate',
          target: migration.to,
          targetVersion: targetManifest.version,
        }
        const requiresDsh = dshRequirementOf(targetManifest)
        if (requiresDsh !== undefined) {
          update.requiresDsh = requiresDsh
          const verdict = await compatibleVerdict(requiresDsh)
          update.compatible = verdict.compatible
          // A verdict that could not be made — no readable host version, or a
          // declaration semver rejects — is reported as such instead of being
          // flattened into "below the minimum": the row is equally blocked, but
          // the user is told the declaration could not be checked rather than
          // to upgrade a DSH that may already satisfy it (issues #1819, #1899).
          if (verdict.hostVersion !== undefined) update.hostVersion = verdict.hostVersion
        }
        updates.push(update)
        continue
      }
      if (plugin.source.kind !== 'npm' || !isDirectRegistrySpec(plugin.source.spec)) continue
      const manifest = await fetchManifest(plugin.id).catch(() => undefined)
      if (manifest === undefined || manifest.version === plugin.version) continue
      const update: { id: string; current: string; latest: string; requiresDsh?: string; compatible?: boolean; hostVersion?: string } =
        { id: plugin.id, current: plugin.version, latest: manifest.version }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        update.requiresDsh = requiresDsh
        const verdict = await compatibleVerdict(requiresDsh)
        update.compatible = verdict.compatible
        if (verdict.hostVersion !== undefined) update.hostVersion = verdict.hostVersion
      }
      updates.push(update)
    }
    writeJson(res, 200, { updates })
```

</details>

**依据 19 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:178-188](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L178-L188)

等待超时不是后台取消。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Wait for one gateway job to settle, returning its wire state. */
  const waitJob = async (jobId: string): Promise<GatewayJobWire> => {
    const deadline = Date.now() + JOB_WAIT_MS
    for (;;) {
      const body = await gatewayJson(`${GATEWAY_PREFIX}/status?job=${encodeURIComponent(jobId)}`) as { job?: GatewayJobWire }
      const job = body.job
      if (job === undefined) throw new Error('plugin-manager: gateway job vanished')
      if (job.phase === 'done') return job
      if (job.phase === 'error') throw new Error(job.error ?? 'plugin-manager: gateway job failed')
      if (Date.now() > deadline) throw new Error('plugin-manager: gateway job timed out')
      await new Promise(resolve => { setTimeout(resolve, JOB_POLL_MS) })
```

</details>

**依据 20 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:519-531](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L519-L531)

安装等待helper只child.kill并等exit。

<details>
<summary>查看原文（13行）</summary>

```text
export async function awaitCliExit(
  child: ChildProcess,
  output: OutputCapture,
  timeoutMs?: number,
): Promise<number | null> {
  const timer = timeoutMs === undefined ? undefined : setTimeout(() => { child.kill() }, timeoutMs)
  try {
    const exit = await awaitChildExit(child)
    if (exit.spawnError !== undefined) capture(Buffer.from(exit.spawnError + '\n'), output)
    return exit.code
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
```

</details>

**依据 21 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:784-832](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L784-L832)

内存jobs/计数与完成100环。

<details>
<summary>查看原文（49行）</summary>

```text
export class CliGateway {
  private readonly jobs = new Map<string, GatewayJob>()
  /** Settlement order of finished jobs: the eviction ring keeps the newest {@link MAX_FINISHED_JOBS}. */
  private readonly finishedOrder: string[] = []
  private counter = 0
  /** Mutation queue: two CLI runs must never interleave their before/after captures. */
  private queue: Promise<void> = Promise.resolve()

  /**
   * @param facts - resolved profile locations.
   * @param env - process environment.
   * @param deps - spawn/binary seams (tests only; production uses the real CLI).
   */
  constructor(
    private readonly facts: ProfileFacts,
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly deps: {
      spawnImpl?: typeof spawnDsh
      findBinary?: (env: NodeJS.ProcessEnv) => string | null
      /** The official in-process manager, when the runtime publishes one. */
      nativeManager?: () => NativePluginManager | undefined
    } = {},
  ) {}

  /**
   * Run one profile mutation after every mutation already queued. The returned
   * promise keeps the task's own result or rejection, while the queue tail is
   * always recovered so one failed write cannot block later work. Routes that
   * edit profile files directly must use this seam so they cannot overlap the
   * CLI install/remove writer.
   */
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  /** Chain one fire-and-forget CLI mutation onto the shared queue. */
  private enqueue(task: () => Promise<void>): void {
    void this.withMutationLock(task).catch(() => {})
  }

  /** Register a settled job and evict the oldest finished one beyond the ring cap. */
  private retainFinished(jobId: string): void {
    this.finishedOrder.push(jobId)
    while (this.finishedOrder.length > MAX_FINISHED_JOBS) {
      const evicted = this.finishedOrder.shift()
      if (evicted !== undefined) this.jobs.delete(evicted)
    }
```

</details>

**依据 22 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:153-191](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/restart.ts#L153-L191)

重拉helper的日志/存活重试非功能ready。

<details>
<summary>查看原文（39行）</summary>

```text
const RELAUNCH_HELPER = `
const fs = require('node:fs');
const cp = require('node:child_process');
const job = JSON.parse(process.argv[1]);
fs.mkdirSync(job.logDir, { recursive: true });
const log = (line) => { try { fs.appendFileSync(job.logPath, new Date().toISOString() + ' ' + line + '\\n'); } catch {} };
const fd = fs.openSync(job.logPath, 'a');
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const launch = (attempt) => {
  if (attempt > 0) log('relaunch attempt ' + (attempt + 1));
  const child = cp.spawn(job.execPath, job.argv, { cwd: job.cwd, env: process.env, detached: true, stdio: ['ignore', fd, fd] });
  child.unref();
  let code = null;
  let spawnError = null;
  child.on('exit', (value) => { code = value; });
  child.on('error', (err) => { spawnError = err; log('relaunch spawn error: ' + err.message); });
  setTimeout(() => {
    if (code === null && spawnError === null) { log('relaunch started (pid ' + child.pid + ')'); fs.closeSync(fd); return; }
    if (attempt < 4) { log('relaunch failed (' + (spawnError === null ? 'exit ' + code : spawnError.message) + '); retrying'); launch(attempt + 1); return; }
    log('relaunch gave up after ' + (spawnError === null ? 'exit ' + code : spawnError.message));
    fs.closeSync(fd);
  }, 3000);
};
const waitFor = (deadline) => {
  if (!alive(job.parentPid) || Date.now() >= deadline) { setTimeout(() => launch(0), 300); return; }
  setTimeout(() => waitFor(deadline), 200);
};
waitFor(Date.now() + job.waitMs);
`

/** The job the helper receives; deliberately small (environment is inherited). */
interface RelaunchJob {
  parentPid: number
  execPath: string
  argv: string[]
  cwd: string
  logDir: string
  logPath: string
  waitMs: number
```

</details>

**依据 23 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1359-1370](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1359-L1370)

层序恢复写失败只warn，不使已落盘更新失败。

<details>
<summary>查看原文（12行）</summary>

```text
  private async restoreBundleIndex(name: string, spec: string, index: number | undefined): Promise<void> {
    if (index === undefined) return
    try {
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      if (!Object.hasOwn(manifest.dependencies, name)) return
      if (manifest.bundles.indexOf(name) === index) return
      await reorderProfileBundle(this.facts.packageJsonPath, name, index)
    } catch (error) {
      // The plugin did land; a layer order this write could not correct is
      // reported rather than turned into a failed update.
      console.warn(`[plugin-manager] 未能恢复 ${name} 的 bundle 顺序（${spec}）：${error instanceof Error ? error.message : String(error)}`)
    }
```

</details>

#### 缺口

- 跨写入竞态、目标漂移/回滚残留和真实重启功能恢复均未实测
  **影响**：只支持独立可弃置profile的单包有监督小样，不能推荐自动批量生产更新或“safe rollback”保证
  **进一步探讨**：后续以固定可信包/受控registry测试预览后版本变化、外部/启动修复并发、安装返回异常/退出0不变、import失败和重启后加载；先对账当前状态，不重放不明作业。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前提、执行者、成本与效果应如何拆开核？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

建议仅在独立可弃置DSH_HOME及普通CLI启动的测试profile、可信非关键direct npm扩展、没有其他CLI/用户/实例写入的条件下，先在加载本包前做外部备份，再检查模式/真实路径，单包更新并重启回归；排除本轮native桌面替换、legacy迁移与自动批量生产使用。必须精确审批预览版本者不要依赖现有只传ID的update，保留可固定spec的既有CLI办法。没有合适可弃置环境或不能接受重启的场景先观察。本轮没有实际执行这些步骤。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH/Node和双半区 | 启动必需 | manifest DSH>=0.2.1-rc.3；Node跟随兼容宿主，本子包未单列engine；client slots/locale/connection及host webServer | 声明非已验兼容，座/通道缺失可不显示或切fallback；版本/服务不可确认先观察 |
| 正确profile与本机权限 | 写操作必需 | 无歧义启动线索、可读写manifest/patch、独立home和外部备份 | 新profile不等新home；无备份/路径不清先停，加载已有自动修复写入 |
| 官方写入通道/CLI工具链 | 对应操作必需 | 普通profile可用dsh/pnpm/网络；应用自有profile需官方native writer，官方RPC由宿主提供 | 不用伪装profile绕桌面写入器；找不到通道即不可写，实际兼容未验 |
| registry/可信包与版本 | 查版本/安装更新必需 | 可重取原spec/包、核目标来源和DSH字符串声明；可信非关键包 | 查询失败可未列出；要求无法核实则阻断；包没声明则没有本层兼容保护 |
| 维护窗口/恢复手段 | 本试用必需 | 无其他writer、可中断重启、人工核磁盘/实例/功能 | 不满足则不做生产批量更新；库回滚日志不等恢复 |
| 遥测网络/浏览器偏好 | 心跳非核心操作必需 | client apply调用共享helper，随机visitor/包名/可选版本发dsh-market.com | DNT/opt-out/storage等门槛及成功日标记，失败静默/可重试；未核服务端IP存储 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 先准备再加载 | 用户/管理员备份独立home/profile与旧包可取来源，记录精确实装版、依赖spec和运行实例 | 自动修复前已有可核外部备份；路径/旧来源不明或真实生产配置混入就停 |
| 识别真实模式/只查版本 | 用户对照启动profile、实际文件、gateway/official模式和元数据，确认启动修复影响 | 没有更新条目不能当全查询成功；无法确认写入对象或仍有写入冲突则停 |
| 单包有监督更新 | 用户选择可信非关键包，插件用官方writer提交并回读；管理员不同时运行外部CLI | 核真实target与预览、manifest/包清单；错误/超时先读实际状态，不重复提交 |
| 重启与功能验收 | 用户先读重启plan再决定，管理员按manual/shell/relaunch安排窗口 | 新实例/实际加载版本和该插件核心功能通过才算采用结果，helper started/请求成功不够 |
| 失败/退出 | 管理员停后续任务并保存变更与日志，对账作业、profile和加载态，必要时用旧固定来源/外部备份恢复 | 恢复后再核同一功能；卸载管理组件不撤目标包、配置及此前副作用 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/包下载、测试home磁盘与环境；费用/许可适配金额未知 | 识别写入通道、profile、外部备份和旧来源；工时未知 | 未安装/运行；加载可能自动修复，不是零副作用只读 |
| 持续使用 | registry查询、每包下载/写入、串行作业和重启资源；金额/峰值未知 | 逐包审版本/兼容、维护窗口与真实功能回归，频次/节时未知 | 批次首错停止、同实例排队可安排资源，非整批原子或所有writer互斥 |
| 失败恢复 | 重取旧spec/包、残留作业/重复写入/再重启资源，金额未知 | 目标漂移、异常/回滚与外部并发对账，恢复分钟未知 | 原spec可能range，backup可覆盖/复制失败，未证明精确旧版和运行态恢复 |
| 升级/退出 | 未来宿主/通道变化、组件卸载和人工恢复成本未知 | 维护DOM座、协议及启动facts适配；停用后核任务/目标包状态 | 组件本身无模型请求链，被安装扩展/宿主资源另算，不假定token/现金节省 |

| 效果 | 已检查材料支持 | 未证明/验收条件 |
|---|---|---|
| 集中管理 | 官方页面工具条、详情区与共享face真实调用 | 相比CLI净工时下降/用户持续需求未测 |
| 比退出码更严 | 精确更新版本回读、条件内entry/组合预检 | 不等import/apply、已加载版或功能通过 |
| 局部恢复与资源安排 | 队列/首错停止、owner-aware补偿、native restartRequired | 自动修复例外/外部writer、返回或异常差异不支持全事务 |
| 重启交接 | 先plan后POST、条件化manual/shell/relaunch及日志 | 不等新实例ready/实际插件健康，须人工功能验收 |

发生错profile、目标版本漂移、状态/恢复不明或维护中断超出可接受范围就停用扩展方案，保留官方CLI固定spec/人工回归工作流；不以点击数或done条数计收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:1-35](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/package.json#L1-L35)

本项基本运行/DSH声明。

<details>
<summary>查看原文（35行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-plugin-manager",
  "description": "Update checking for the dsh web GUI's official Plugins page: compares installed plugins against the version their registry source serves, gates the update on the DSH runtime minimum the release declares, and drives the update through the official installer channel or this package's loopback CLI gateway.",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-renderer"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:108-118](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/index.ts#L108-L118)

加载自动修复使外部备份须先行。

<details>
<summary>查看原文（11行）</summary>

```text
  ctx.effect(() => {
    const timer = setTimeout(() => {
      void gateway.repairProfileRowNames().then((repaired) => {
        if (repaired.length === 0) return
        console.warn('[plugin-manager] 已修复 profile 中失效的行名：' + repaired.map(row => `${row.id}（${row.from} → ${row.to}）`).join('、'))
      }).catch((error: unknown) => {
        console.error('[plugin-manager] profile 行名修复失败：' + (error instanceof Error ? error.message : String(error)))
      })
    }, 1500)
    return () => { clearTimeout(timer) }
  }, 'plugin-manager: stale row name repair')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/profile.ts:184-222](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/profile.ts#L184-L222)

启动profile识别条件。

<details>
<summary>查看原文（39行）</summary>

```text
export function resolveProfile(
  argv: readonly string[] = process.argv,
  env: NodeJS.ProcessEnv = process.env,
  launched?: LaunchedProfile,
  desktopLauncher: boolean = isPackagedDesktopArgv(argv),
): ProfileFacts {
  const flagIndex = argv.indexOf('--profile')
  if (flagIndex !== -1 && argv[flagIndex + 1] !== undefined && argv[flagIndex + 1] !== '') {
    return factsFor(argv[flagIndex + 1], env, desktopLauncher)
  }
  // The published profile outranks the environment: a Desktop workaround may
  // set DSH_PROFILE globally while the running host boots another profile, and
  // following the variable there would mount the gateway (and write patch
  // rows) into a profile this host never reads. The service is the runtime's
  // own answer about the profile it actually launched.
  const published = launchedFacts(launched, desktopLauncher, env)
  if (published !== undefined) return published
  // No service (an older runtime): the packaged Desktop launcher still names
  // its profile directory positionally in argv, which outranks the
  // environment for the same reason the published service does.
  const desktopDir = desktopProfileDirFromArgv(argv)
  if (desktopDir !== undefined) {
    // Built through the same validated path as a published directory so the
    // argv fact cannot skip a guard the service fact must pass.
    const argvFacts = launchedFacts({ name: basename(desktopDir), dir: desktopDir }, desktopLauncher, env)
    if (argvFacts !== undefined) return argvFacts
  }
  if (env.DSH_PROFILE !== undefined && env.DSH_PROFILE.trim() !== '') {
    // A Desktop workaround may set DSH_PROFILE globally. Its in-process boot
    // still has only the executable in argv; keep desktop channel probing in
    // that shape, while ordinary CLI invocations remain non-desktop.
    const name = env.DSH_PROFILE.trim()
    const desktop = desktopLauncher || (argv.length <= 1 && desktopSelectedProfile(env) === name)
    return factsFor(name, env, desktop)
  }
  if (argv.includes('web')) return factsFor('web', env, desktopLauncher)
  const selected = desktopSelectedProfile(env)
  if (selected !== undefined) return factsFor(selected, env, true)
  throw new Error('plugin-manager: cannot determine the boot profile; pass --profile <name> or set DSH_PROFILE')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:849-862](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L849-L862)

native/CLI写入通道条件。

<details>
<summary>查看原文（14行）</summary>

```text
  private nativeManager(): NativePluginManager | undefined {
    if (this.facts.desktop !== true) return undefined
    return this.deps.nativeManager?.()
  }

  /**
   * Whether this gateway will write through the official in-process manager
   * instead of the CLI (an application-owned profile, see
   * {@link nativeManager}). The HTTP layer reads it so its CLI-availability
   * guard never rejects a job the CLI is not going to run.
   * @returns true when the native writer serves installs, updates and removals.
   */
  usesNativeWriter(): boolean {
    return this.nativeManager() !== undefined
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-400](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L378-L400)

registry与声明门禁条件。

<details>
<summary>查看原文（23行）</summary>

```text
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
        if (!compatible) {
          return {
            status: 412,
            error: hostVersion === undefined
              ? `plugin-manager: cannot verify the running DSH version for ${target} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before updating`
              : `plugin-manager: ${target} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before updating`,
          }
        }
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:134-197](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L134-L197)

批次/首错和先重启计划后执行。

<details>
<summary>查看原文（64行）</summary>

```text
  const onUpdateAll = (): void => {
    if (busyRef.current) return
    const queue = applicableUpdates(rows)
    if (queue.length === 0) return
    busyRef.current = true
    setPhase('updating')
    setError(undefined)
    void (async () => {
      const done: string[] = []
      for (const [index, row] of queue.entries()) {
        setCursor({ name: row.id, index: index + 1, total: queue.length })
        try {
          const result = await update(row.id)
          // The update landed; when this process cannot load it, the run still
          // counts as applied and continues, and the panel names the restart.
          if (result.restartRequired.length > 0) {
            setRestartRequired(current => [...current, { id: row.id, version: result.plugin.version }])
          }
        } catch (reason) {
          // Stop at the first failure: the remaining rows stay listed with their
          // versions, so the user sees exactly what did not go through.
          setError(t('failed', { reason: messageOf(reason) }))
          break
        }
        done.push(row.id)
        setApplied([...done])
        setRows(current => current.filter(item => item.id !== row.id))
      }
      setCursor(undefined)
    })().finally(() => {
      busyRef.current = false
      setPhase('idle')
    })
  }

  /** Ask the host how it would restart, then show the confirmation that matches. */
  const onAskRestart = (): void => {
    if (busyRef.current) return
    busyRef.current = true
    setError(undefined)
    void restartPlan().then(mode => {
      setPlan(mode)
      setPanel('restart')
    }).catch(reason => {
      setError(t('failed', { reason: messageOf(reason) }))
      setPanel('list')
    }).finally(() => {
      busyRef.current = false
    })
  }

  const onRestart = (): void => {
    if (busyRef.current) return
    busyRef.current = true
    setError(undefined)
    void restart().then(mode => {
      setRestartMode(mode)
      setPlan(undefined)
      setPanel('none')
    }).catch(reason => {
      setError(t('failed', { reason: messageOf(reason) }))
    }).finally(() => {
      busyRef.current = false
    })
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:113-134](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/restart.ts#L113-L134)

重启模式实际边界。

<details>
<summary>查看原文（22行）</summary>

```text
export function planRestart(facts: RestartFacts): RestartPlan {
  // The Desktop shell owns this process tree: it is the only party that can
  // relaunch the application, and it already offers that action when the host
  // stops. ELECTRON_RUN_AS_NODE is the second, launcher-independent signal for
  // a host started by an Electron shell (the packaged Desktop sets it; a
  // command-line launch never does). Owning the tree is not the same as
  // replacing it, though: without the shell's restart guarantee, exiting here
  // leaves the user with a stopped host and an error page, so keep serving.
  if (facts.desktop === true || facts.env.ELECTRON_RUN_AS_NODE === '1') {
    return shellRestartIsSupported(facts.env) ? { mode: 'shell' } : { mode: 'manual' }
  }
  // Without a terminal this process was started by something that watches it
  // (a supervisor, an editor task, another app's child process). Re-executing
  // ourselves there would duplicate a server the watcher believes it owns.
  if (!facts.interactive) return { mode: 'manual' }
  // argv[0] is the script the interpreter runs (the dsh CLI entry); without it
  // there is no command line worth re-executing.
  const script = facts.argv[0]
  if (script === undefined || script === '') return { mode: 'manual' }
  return {
    mode: 'relaunch',
    command: {
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:348-351](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/index.ts#L348-L351)

本包遥测caller。

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-plugin-manager' }])
```

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/client/telemetry.ts:117-150](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/telemetry.ts#L117-L150)

共享helper抑制、payload及日标记。

<details>
<summary>查看原文（34行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

#### 缺口

- 实际价格、维护工时/中断、峰值资源和恢复/持续需求未知
  **影响**：建议可回退实验而非生产批量或低成本保证
  **进一步探讨**：独立环境同包任务对照CLI，测误判成功、错版、回归/恢复分钟和不必要重启；收益不足或窗口不可控就停止。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么增量值得验证，什么时候应只修原组件？

**研究主题**：新假设与验证

#### 完整回答

候选是把用户确认目标与跨重启功能验收接为同一可回读操作账本，而不是再造安装器。当前已经有jobId、版本回读、部分补偿、native restartRequired、重启plan/helper日志；不能称没有任何进度或重启记录。缺口是预览只传ID后重新解析latest、jobs仅内存、配置/磁盘/运行实例事实不同，以及错误返回不证明原状态恢复。

先做小补丁：用户确认时携带registry/source、expectedVersion/目标摘要和old精确实装版/依赖spec；服务端若解析结果漂移就拒绝并重新预览，不把新latest默认为已同意。把本次profile/patch内容版本和操作阶段持久化，所有包括启动修复的本组件写入进入同一队列并在写前复核；外部writer无法锁住时保留冲突/未知，不盲目覆盖。作业经过written、composed、restart-requested后，下一实例读实际加载版本及一个具体核心功能信号才ready；非幂等安装未知时不重复提交。恢复分别核依赖、层序/override与运行实例，不能只看remove exit0或原spec恢复提示。

后续在可弃置环境对比当前GUI、官方CLI固定spec+外部备份/人工回归清单、小补丁三组：正常单包、预览后tag变化、启动修复与用户toggle并发、安装调用抛异常/exit0无目标变化、组合通过却import/apply失败、重启后旧模块仍在/功能失败。统计错目标/误报ready、丢更新、保留未知准确率、人工恢复分钟、正常路径开销与不必要重启，实际被测源码/宿主版本需固定；本轮没有做这些实验。

若expectedVersion检查、启动修复入队和一份人工重启清单已足够，应在原插件/官方管理器修补。没有用户频繁遭遇跨重启状态/恢复摩擦，或账本维护/探针误判比现有流程更贵，就否定独立插件。只有真实任务稳定减少错版与返工且有持续使用需求，才继续生产方向；源码复杂和潜在风险都不替代需求、付费或ROI证据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:134-166](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L134-L166)

预览后仅按ID逐项提交。

<details>
<summary>查看原文（33行）</summary>

```text
  const onUpdateAll = (): void => {
    if (busyRef.current) return
    const queue = applicableUpdates(rows)
    if (queue.length === 0) return
    busyRef.current = true
    setPhase('updating')
    setError(undefined)
    void (async () => {
      const done: string[] = []
      for (const [index, row] of queue.entries()) {
        setCursor({ name: row.id, index: index + 1, total: queue.length })
        try {
          const result = await update(row.id)
          // The update landed; when this process cannot load it, the run still
          // counts as applied and continues, and the panel names the restart.
          if (result.restartRequired.length > 0) {
            setRestartRequired(current => [...current, { id: row.id, version: result.plugin.version }])
          }
        } catch (reason) {
          // Stop at the first failure: the remaining rows stay listed with their
          // versions, so the user sees exactly what did not go through.
          setError(t('failed', { reason: messageOf(reason) }))
          break
        }
        done.push(row.id)
        setApplied([...done])
        setRows(current => current.filter(item => item.id !== row.id))
      }
      setCursor(undefined)
    })().finally(() => {
      busyRef.current = false
      setPhase('idle')
    })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-400](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/routes.ts#L378-L400)

提交时重新解析target。

<details>
<summary>查看原文（23行）</summary>

```text
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
        if (!compatible) {
          return {
            status: 412,
            error: hostVersion === undefined
              ? `plugin-manager: cannot verify the running DSH version for ${target} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before updating`
              : `plugin-manager: ${target} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before updating`,
          }
        }
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:784-832](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L784-L832)

内存job与队列。

<details>
<summary>查看原文（49行）</summary>

```text
export class CliGateway {
  private readonly jobs = new Map<string, GatewayJob>()
  /** Settlement order of finished jobs: the eviction ring keeps the newest {@link MAX_FINISHED_JOBS}. */
  private readonly finishedOrder: string[] = []
  private counter = 0
  /** Mutation queue: two CLI runs must never interleave their before/after captures. */
  private queue: Promise<void> = Promise.resolve()

  /**
   * @param facts - resolved profile locations.
   * @param env - process environment.
   * @param deps - spawn/binary seams (tests only; production uses the real CLI).
   */
  constructor(
    private readonly facts: ProfileFacts,
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly deps: {
      spawnImpl?: typeof spawnDsh
      findBinary?: (env: NodeJS.ProcessEnv) => string | null
      /** The official in-process manager, when the runtime publishes one. */
      nativeManager?: () => NativePluginManager | undefined
    } = {},
  ) {}

  /**
   * Run one profile mutation after every mutation already queued. The returned
   * promise keeps the task's own result or rejection, while the queue tail is
   * always recovered so one failed write cannot block later work. Routes that
   * edit profile files directly must use this seam so they cannot overlap the
   * CLI install/remove writer.
   */
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  /** Chain one fire-and-forget CLI mutation onto the shared queue. */
  private enqueue(task: () => Promise<void>): void {
    void this.withMutationLock(task).catch(() => {})
  }

  /** Register a settled job and evict the oldest finished one beyond the ring cap. */
  private retainFinished(jobId: string): void {
    this.finishedOrder.push(jobId)
    while (this.finishedOrder.length > MAX_FINISHED_JOBS) {
      const evicted = this.finishedOrder.shift()
      if (evicted !== undefined) this.jobs.delete(evicted)
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1888-1907](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1888-L1907)

启动修复未入队/CAS。

<details>
<summary>查看原文（20行）</summary>

```text
  async repairProfileRowNames(): Promise<Array<{ id: string; from: string; to: string }>> {
    const names = await this.liveEntryNames()
    if (names === undefined || names.size === 0) return []
    let text: string
    try {
      text = await readFile(this.facts.patchPath, 'utf8')
    } catch {
      return []
    }
    let repaired: RepairedRowNames
    try {
      repaired = repairStaleRowNames(text, this.facts.patchPath, names)
    } catch {
      // A patch file this gateway cannot parse is not its to repair: the CLI
      // owns that file and reports its own parse error.
      return []
    }
    if (repaired.repaired.length === 0) return []
    await writePatchAtomic(this.facts.patchPath, repaired.text)
    return repaired.repaired
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1203-1255](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1203-L1255)

已有目标版回读和restartRequired。

<details>
<summary>查看原文（53行）</summary>

```text
  private async runNativeUpdate(job: GatewayJob, native: NativePluginManager): Promise<void> {
    const targetId = job.targetId
    const targetVersion = job.targetVersion
    if (targetId === undefined || targetVersion === undefined) {
      job.phase = 'error'
      job.error = 'plugin-manager: update job is missing the target id or version'
      return
    }
    const before = await this.capture()
    const carried = await readProfileManifest(this.facts.packageJsonPath)
    const first = await native.installBundle(job.spec, { enabled: true, requestId: job.id })
    let refusal = nativeManagerFailure(first)
    // A landed run that answered `restart-required` is still a landed run; the
    // fact is carried to the caller instead of being folded into a failure.
    let restartRequired = nativeManagerRestartRequired(first)
    if (refusal !== undefined && nativeManagerRefusalCode(first) === 'already-installed') {
      const replacement = await this.replaceInstalled(job, native, targetId, carried.dependencies[targetId])
      refusal = replacement.failure
      restartRequired = replacement.restartRequired
    }
    if (refusal !== undefined) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器更新失败：${refusal}`
      return
    }
    const after = await this.capture()
    if (!after.dependencies.includes(targetId)) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但目标插件未保留在 profile 中（更新未生效）`
      return
    }
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
    if (updated.version !== targetVersion) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
      return
    }
    // An application-owned profile composes through the same read-only probe,
    // so orphaned overrides are pruned here too; a runtime that cannot compose
    // leaves the patch file exactly as it is (see {@link pruneOrphanOverrides}).
    if (await this.pruneOrphanOverrides(job) === undefined) return
    job.plugin = updated
    job.conflicts = significantChanges(diffLayer(before.layer, after.layer)).map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    // The version landed, so the job is `done`; this names what only a restart
    // can load, which is exactly the fact an in-place success does not carry.
    if (restartRequired) job.restartRequired = [targetId]
    job.phase = 'done'
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1990-2008](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/gateway.ts#L1990-L2008)

回滚仅exit码判据。

<details>
<summary>查看原文（19行）</summary>

```text
  private async rollbackInstall(job: GatewayJob, name: string, reason: string, conflicts: LayerChange[]): Promise<void> {
    let rolledBack = false
    let tail = ''
    const binary = this.binary()
    if (binary !== null) {
      const output = createOutputCapture(MAX_OUTPUT_BYTES)
      const child = this.spawnCli(binary, ['plugin', '--profile', this.facts.profileName, 'remove', name])
      child.stdout?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      child.stderr?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      const code = await awaitCliExit(child, output, REMOVE_TIMEOUT_MS)
      rolledBack = code === 0
      tail = output.read().trim()
    }
    job.phase = 'error'
    job.error = rolledBack
      ? `plugin-manager: ${reason}，已自动回滚 ${name}`
      : `plugin-manager: ${reason}；自动回滚失败，请手动执行 dsh plugin --profile ${this.facts.profileName} remove ${name}${tail === '' ? '' : `：\n${tail}`}`
    conflicts.push({ id: name, from: 'enabled', to: 'uninstalled' })
    job.conflicts = conflicts.map(change => ({ id: change.id, name: change.id, from: change.from, to: change.to }))
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:153-191](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-plugin-manager/src/host/restart.ts#L153-L191)

已有helper日志但未核心功能验收。

<details>
<summary>查看原文（39行）</summary>

```text
const RELAUNCH_HELPER = `
const fs = require('node:fs');
const cp = require('node:child_process');
const job = JSON.parse(process.argv[1]);
fs.mkdirSync(job.logDir, { recursive: true });
const log = (line) => { try { fs.appendFileSync(job.logPath, new Date().toISOString() + ' ' + line + '\\n'); } catch {} };
const fd = fs.openSync(job.logPath, 'a');
const alive = (pid) => { try { process.kill(pid, 0); return true; } catch { return false; } };
const launch = (attempt) => {
  if (attempt > 0) log('relaunch attempt ' + (attempt + 1));
  const child = cp.spawn(job.execPath, job.argv, { cwd: job.cwd, env: process.env, detached: true, stdio: ['ignore', fd, fd] });
  child.unref();
  let code = null;
  let spawnError = null;
  child.on('exit', (value) => { code = value; });
  child.on('error', (err) => { spawnError = err; log('relaunch spawn error: ' + err.message); });
  setTimeout(() => {
    if (code === null && spawnError === null) { log('relaunch started (pid ' + child.pid + ')'); fs.closeSync(fd); return; }
    if (attempt < 4) { log('relaunch failed (' + (spawnError === null ? 'exit ' + code : spawnError.message) + '); retrying'); launch(attempt + 1); return; }
    log('relaunch gave up after ' + (spawnError === null ? 'exit ' + code : spawnError.message));
    fs.closeSync(fd);
  }, 3000);
};
const waitFor = (deadline) => {
  if (!alive(job.parentPid) || Date.now() >= deadline) { setTimeout(() => launch(0), 300); return; }
  setTimeout(() => waitFor(deadline), 200);
};
waitFor(Date.now() + job.waitMs);
`

/** The job the helper receives; deliberately small (environment is inherited). */
interface RelaunchJob {
  parentPid: number
  execPath: string
  argv: string[]
  cwd: string
  logDir: string
  logPath: string
  waitMs: number
```

</details>

#### 缺口

- 操作账本/expectedVersion增量未实现，也无真实用户对照/商业数据
  **影响**：仅是可证伪的改进方向，不宣称已防错版/降成本或值得另建产品
  **进一步探讨**：先补最小目标绑定和修复队列、比较人工清单；若没有可重复收益或额外状态增加恢复负担则否定。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
