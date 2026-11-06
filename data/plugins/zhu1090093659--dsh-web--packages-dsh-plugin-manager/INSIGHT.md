# dsh-plugin-manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 10,117](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C117&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,822](https://img.shields.io/static/v1?label=npm+30d&message=94%2C822&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：在 DSH 官方插件页集中检查第三方更新，按通道调用官方写入器并核对落盘版本与重启条件。

> **亮点**：将多通道更新接入官方页面，真实写后核目标版本，并分已落盘/需重启；CLI冲突检查和有限回滚有明确定向路径，见 [Q02](#research-q02)-[Q04](#research-q04)。

> **主要限制**：检查时版本未绑定请求，默认registry响应未透传peer要求；启动自动修复不进常规队列、done/回滚退出码不证明实际加载和恢复，见 [Q02](#research-q02)-[Q04](#research-q04)。

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
  - [Q01 · 这个原生包比官方插件页多做什么？](#detail-section-11)
  - [Q02 · 看到更新后如何真正写入，兼容检查覆盖哪些字段？](#detail-section-12)
  - [Q03 · 网关信谁，串行和回滚能保证什么？](#detail-section-13)
  - [Q04 · 更新、启停、重启与退出什么时候才算生效？](#detail-section-14)
  - [Q05 · 谁值得怎样试，成本和退路是什么？](#detail-section-15)
  - [Q06 · 可迁移贡献与尚未实现方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉profile备份/恢复的本机维护者，在可弃置副本核一个可信非关键包更新，见 [Q01](#research-q01)/[Q05](#research-q05)。

官方插件页与固定版本dsh plugin命令加人工回归；本包集中检查与后验，不替代上游installer/Loader或来源审查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 页内检查/批量 | 第三方registry更新 | 首失败停，非整批事务 |
| 双通道/多writer | 复用官方机制 | 本包门不覆盖官方RPC |
| 后验 | 依赖/版本/选择/组合 | 非import/apply与功能验收 |
| 启停 | 写entry覆盖/官方内置toggle | 需分当前/下次/被覆盖 |
| 重启 | manual/shell/systemd/helper | 202非健康证明 |
| 启动修复 | 修失效row name | 自动写且不在常规队列 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| 匹配DSH/React/Web与成品 | 官方页注入 | DOM/slot随上游变 |
| 正确profile/可写文件/备份 | 安装/启停/修复 | 启动即可能修复写patch |
| registry与CLI/包管理器 | 普通gateway | 非来源安全验证 |
| desktop官方manager | 应用自有profile写入 | 上游事务未全审 |
| 本机可信用户/包来源 | 变更权限 | 无人批token，包可执行代码 |
| 进程所有者/重启方案 | 加载新版本 | manual/需回归 |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 副本备份profile/锁/数据 | 核profile/启动修复差异 |
| 检查 | 一可信非关键包/记精确版本 | 无声明非完整兼容通过 |
| 更新 | 核job→磁盘版本/选择 | 页面timeout不自动取消 |
| 加载 | 按实际restart方案/重读Loader | 测核心功能才算可用 |
| 失败/退出 | 查在飞writer与目标 | 停稳后固定spec/备份恢复 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | 下载/磁盘/registry | 备份/来源/通道/profile核实 |
| 持续 | 网络/包与日志 | 版本审阅/停机回归/DOM兼容 |
| 失败 | 重试/脚本可能已执行 | 查job/依赖/修复/真实进程 |
| 退出 | 保留证据/恢复旧依赖 | 不撤回脚本副作用；工时价格未知 |

#### 效果

| 项目 | 当前支持 | 未验证 |
| --- | --- | --- |
| 检查更新 | registry/Host要求与两通道 | peer-only默认抓取缺字段 |
| 写入后验 | 依赖/精确版本/选择检查 | 插件运行与业务结果 |
| 回滚 | 条件remove/装回旧spec | 全部文件/副作用恢复 |
| 重启 | 按进程形态选择 | 新进程健康/功能通过 |
| 使用收益 | 集中页内管理 | 净省时/需求/总成本 |

> **思考**：检查时版本未绑定请求，默认registry响应未透传peer要求；启动自动修复不进常规队列、done/回滚退出码不证明实际加载和恢复，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多通道更新接入官方页面，真实写后核目标版本，并分已落盘/需重启；CLI冲突检查和有限回滚有明确定向路径，见 [Q02](#research-q02)-[Q04](#research-q04)。

真实writer和后验区分受理/落盘/加载有价值；单实例队列并非全局事务，启动修复、半失败和包脚本需独立核目标，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

检查时版本未绑定请求，默认registry响应未透传peer要求；启动自动修复不进常规队列、done/回滚退出码不证明实际加载和恢复，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先副本备份并核自动修复，只更新一个可信非关键包，逐层核job/磁盘/加载/功能；后台或恢复未知时停操作查writer，再退固定CLI和人工回归，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生Host/Web子包0.4.15/source。定向审client双通道/页面挂载、gateway普通更新与安装失败后验、native替换、loopback/队列/启动修复/写盘/重启；未运行或全审全部迁移、平台shim、上游writer/Loader、HMR/进程树与遥测云端。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx、packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx、packages/dsh-plugin-manager/src/client/index.ts、packages/dsh-plugin-manager/src/client/telemetry.ts、packages/dsh-plugin-manager/src/core/updates.ts、packages/dsh-plugin-manager/src/core/version.ts、packages/dsh-plugin-manager/src/host/dsh-compat.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/host/loopback.ts、packages/dsh-plugin-manager/src/host/profile.ts、packages/dsh-plugin-manager/src/host/restart.ts、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/rows.ts、packages/dsh-plugin-manager/src/index.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本组件package、Host/client apply/face、工具条/内置toggle代表路径；registry/compat/更新route到CLI/native/后验与done；新install冲突回滚/预检；队列、启动修复、patch/manifest写盘和restart计划执行。未运行/全审所有迁移、平台shim、全部profile选择、上游writer/Loader/HMR、进程树、供应链/云端。
- 下一步：- 下一步副本备份后单包四层验收：请求/job、磁盘、重启后Loader、核心功能。
- 对照latest漂移/peer-only要求与固定spec，失败先查在飞writer不盲重试。
- 未运行/安装/重启，净收益与恢复真实性未知。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.15（[固定提交 1f14856](https://github.com/zhu1090093659/dsh-web/tree/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

绑定expectedVersion/来源差异再审并独立核重启后加载，对照现有固定spec与人工清单；若无意外版本/误信下降或总维护更重即否定，见 [Q06](#research-q06)。

- 下一步副本备份后单包四层验收：请求/job、磁盘、重启后Loader、核心功能。
- 对照latest漂移/peer-only要求与固定spec，失败先查在飞writer不盲重试。
- 未运行/安装/重启，净收益与恢复真实性未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 342 | — | — | 11462 |
| .ts | source | 30 | 7756 | 4286 | 3066 | — |
| .tsx | source | 5 | 1348 | 898 | 354 | — |
| .ts | test | 29 | 8463 | 6019 | 1460 | — |
| .tsx | test | 4 | 1778 | 1165 | 336 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分官方页增量与上游writer，核更新到真实写入/失败/重启，不把done当功能验收。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这个原生包比官方插件页多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定0.4.15 @linxin666/dsh-client-ui-plugin-manager 是原生Host/Web bundle，不是独立市场或所有插件安装器的重新实现。面向熟悉profile、能备份恢复的本机维护者，在官方Plugins页加更新区块、批量第三方更新工具条与内置行分组；安装/卸载主体仍归官方页。本包Host注册本机gateway，client共享face按官方RPC或gateway选通道，不能将上游installer、loader与npm自身能力都归为本包创新。

实际slot注册plugins.detail.section，列表工具条和内置组则由DOM挂载，因为这些位置没有官方slot，随页面/语言观察维护，有随上游结构漂移的成本。批量只挑非@deepseek-ai/且compatible不为false的行，逐个更新遇首失败停止，已成功不回滚整批。内置行toggle调用可选remote.pluginManager.setPluginEnabled再重读，仍由官方writer决定是否可写/需重启/被覆盖；缺官方服务会呈不可用，不凭README本部署8/230行数字当所有实例数量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:1-40](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/package.json#L1-L40)

原生Host/Web包与0.4.15。

<details>
<summary>查看原文（40行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-plugin-manager",
  "description": "Update checking for the dsh web GUI's official Plugins page: compares installed plugins against the version their registry source serves, gates the update on the DSH runtime minimum the release declares, and drives the update through the official installer channel or this package's loopback CLI gateway.",
  "version": "0.4.15",
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
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
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
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:71-100](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/index.ts#L71-L100)

真实gateway初始化与注册。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:388-460](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L388-L460)

真实工具条/内置组DOM挂载和官方slot贡献。

<details>
<summary>查看原文（73行）</summary>

```text

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

  // The built-in group sits at the list's bottom the way the toolbar sits beside
  // its heading: the page declares no seat there, so it is inserted after the
  // page's own installed panel and follows the page through the shared mutation
  // hub. The official faces are sampled per render and the subscription below
  // covers both a language switch and a host-side change event, so the mounted
  // copy never holds a stale answer.
  ctx.effect(() => {
    try {
      return mountBuiltinPluginGroup({
        props: () => ({
          remote: getRemoteSnapshot(),
          resolveText: text => ctx.locale.resolveText(text),
          t: ctx.locale.bind(NS),
        }),
        subscribe: listener => {
          const offLocale = ctx.locale.subscribe(listener)
          const offRemote = subscribeRemote(listener)
          return () => {
            offLocale()
            offRemote()
          }
        },
      })
    } catch (error) {
      // The group is chrome on someone else's page: a failed mount must not take
      // the page down, but it must not disappear without a trace either.
      console.warn('plugin-manager: mounting the built-in plugin group failed', error)
      return () => {}
    }
  }, 'plugin-manager: built-in plugin group')

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
    } catch {
      return () => {}
    }
  })
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/core/updates.ts:24-44](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/core/updates.ts#L24-L44)

第三方/兼容行筛选。

<details>
<summary>查看原文（21行）</summary>

```text
export const OFFICIAL_SCOPE = '@deepseek-ai/'

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

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:152-183](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L152-L183)

实际逐行更新和首失败停止。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx:291-325](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx#L291-L325)

官方setPluginEnabled真实调用、失败/重启提示与重读。

<details>
<summary>查看原文（35行）</summary>

```text
    const manager = remote.manager
    if (manager === null || row.write !== 'writable' || writingRef.current) return
    writingRef.current = true
    setPending({ entryId: row.entryId, enabled: next })
    setNotice(undefined)
    void (async () => {
      let outcome
      try {
        outcome = readChangeResult(await manager.setPluginEnabled(row.entryId, next))
      } catch (error) {
        warnFailure('built-in group write failed', error)
        outcome = { ok: false as const, code: FALLBACK_CODE }
      }
      writingRef.current = false
      setPending(undefined)
      if (!outcome.ok) {
        setNotice({
          tone: 'error',
          text: t(next ? 'builtinFailedEnable' : 'builtinFailedDisable', { reason: refusalText(outcome.code, t) }),
        })
        return
      }
      // A resolved write is not always a state the page will keep: the next start
      // loads a restart-required change, and a higher profile layer wins over an
      // overridden one. The re-read below is what makes the switch show the Loader
      // either way; this line is what tells the reader which of the two happened.
      // A restart-required write is not a success: the change is on disk and the
      // running process still serves the old state, so it is said in the same
      // passing tone as an overridden one.
      setNotice(outcome.application === 'restart-required'
        ? { tone: 'note', text: t('builtinRestartRequired', { reason: restartReason(outcome.restartReason, t) }) }
        : outcome.application === 'overridden'
          ? { tone: 'note', text: t('builtinOverridden', { name: rowTitle(row, resolveText) }) }
          : undefined)
      setReload(token => token + 1)
```

</details>

#### 缺口

- 未运行官方页面/DOM兼容或完整内置行来源算法，未审所有官方服务。
  **影响**：可判断本包增量，不保证全平台展示/内置数量与运行收益。
  **进一步探讨**：副本先核页面挂载/真实profile和一条非关键行，官方服务缺失就保留官方页/CLI退路。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 看到更新后如何真正写入，兼容检查覆盖哪些字段？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

client先/mode，未知或Host缺失再探官方installer LIST；官方通道所有操作直接RPC，本包gateway检查不覆盖该通道。gateway更新浏览器只发id，Host单进程mutation lock内重读profile、核target和direct npm source、重新抓registry latest，声明要求不满足或无法核验均412，然后把本次解析的精确版本交gateway.update。用户前次看到的版本没有expectedVersion绑定；同版本且本进程最近未记失败返回409，失败版本允许再预检。check-updates普通路径只判断latest != installed，不能称只列semver更高版本；registry dist-tag可能比本地新版本低。

dshRequirementOf函数优先dsh.engines.dsh、顶层engines.dsh、peer @deepseek-ai/dsh；但实际默认fetchRegistryManifest仅返回version/dsh/engines，丢peerDependencies，因此只声明peer的远端release不经这一兼容检查。无声明放行，非法range或未知Host阻止有声明更新；semver含prerelease比较并非完整兼容/供应链验证。Host版本优先真实install anchor清单，fallback dsh --version；未全审所有profile选择/版本探测平台。

update创建running内存job入队；普通profile实际spawn dsh plugin --profile <name> add <id>@<version>，应用自有desktop且提供nativeManager才用其installBundle。HTTP返回jobId只是受理；client轮询status到done/error，超时或job消失报错，不证明后台已取消。CLI读取before/after并验证目标依赖/精确版本和bundle选择，再dump-config及清理orphan，才done。native路径同样真调用writer、识别refusal、重读目标版本并可带restartRequired；上游内部事务/安装脚本未审，done表示落盘判据，非真实插件功能通过。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:138-167](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L138-L167)

实际official RPC操作。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:188-237](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L188-L237)

gateway发id/轮询job与restart事实。

<details>
<summary>查看原文（50行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:273-295](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L273-L295)

实际mode探测。

<details>
<summary>查看原文（23行）</summary>

```text
  let modePromise: Promise<'official' | 'gateway'> | undefined
  const ensureMode = (): Promise<'official' | 'gateway'> => {
    if (modePromise === undefined) {
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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:334-410](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L334-L410)

更新锁内读取target/重新latest、compat与精确update。

<details>
<summary>查看原文（77行）</summary>

```text
    if (typeof id !== 'string' || id.trim() === '') {
      writeJson(res, 400, { error: 'plugin-manager: update needs an id' })
      return
    }
    const target = id.trim()
    const unsafe = unsafeSpecReason(target)
    if (unsafe !== undefined) {
      writeJson(res, 400, { error: unsafe })
      return
    }
    if (!deps.cliAvailable() && !gateway.usesNativeWriter()) {
      writeJson(res, 500, { error: 'plugin-manager: dsh CLI not found on PATH' })
      return
    }
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
      // A run that wrote this version and then failed its boot preflight left
      // the profile at the target with the update itself unsettled (see
      // gateway.ts verifyBoot). Answering that retry with "already at latest" is
      // a dead end the panel cannot leave: the row already carries the newest
      // version, so the only way out was a reinstall run by hand. Only a
      // recorded failure of this plugin's newest update at this exact version
      // re-runs the install — the same job, preflight included — so a plugin
      // that is genuinely up to date keeps its 409 and writes nothing.
      if (row.version === latest && !gateway.lastUpdateFailed(target, latest)) {
        return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      }
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

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:601-618](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L601-L618)

check普通行只过滤相等而非semver更高。

<details>
<summary>查看原文（18行）</summary>

```text
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
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:106-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L106-L114)

真实默认registry返回字段不含peer。

```text
async function fetchRegistryManifest(name: string): Promise<RegistryVersionManifest | undefined> {
  const encoded = name.startsWith('@') ? name.replace('/', '%2F') : name
  const response = await fetch(`https://registry.npmjs.org/${encoded}/latest`, withIdentityEncoding({
    signal: AbortSignal.timeout(REGISTRY_TIMEOUT_MS),
  }))
  if (!response.ok) return undefined
  const body = await response.json() as { version?: unknown; dsh?: unknown; engines?: unknown }
  if (typeof body.version !== 'string') return undefined
  return { version: body.version, dsh: body.dsh, engines: body.engines }
```

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/core/version.ts:123-133](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/core/version.ts#L123-L133)

helper有peer fallback，与默认fetch不同。

<details>
<summary>查看原文（11行）</summary>

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
}
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/dsh-compat.ts:48-61](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/dsh-compat.ts#L48-L61)

真实semver合法性/满足与无法核验。

<details>
<summary>查看原文（14行）</summary>

```text
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

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:263-269](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L263-L269)

未知Host/非法range统一拒绝但保留原因层次。

```text
  const compatibleVerdict = async (requiresDsh: string): Promise<{ hostVersion?: string; compatible: boolean }> => {
    const hostVersion = await resolveDshVersion()
    if (hostVersion === undefined) return { compatible: false }
    const compatibility = evaluateDshCompatibility(hostVersion, requiresDsh)
    if (compatibility.verdict === 'unverifiable') return { compatible: false }
    return { hostVersion, compatible: compatibility.verdict === 'satisfied' }
  }
```

**依据 10 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1281-1307](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1281-L1307)

真实精确update job与writer选择。

<details>
<summary>查看原文（27行）</summary>

```text
  update(id: string, version: string): { jobId: string } {
    const spec = `${id}@${version}`
    const job: GatewayJob = {
      id: `job-${++this.counter}`,
      action: 'update',
      spec,
      targetId: id,
      targetVersion: version,
      phase: 'running',
    }
    this.jobs.set(job.id, job)
    const unsafe = unsafeSpecReason(spec)
    if (unsafe !== undefined) {
      job.phase = 'error'
      job.error = unsafe
      this.retainFinished(job.id)
      return { jobId: job.id }
    }
    // An application-owned profile takes the official writer; everything else
    // keeps the CLI, whose reconciliation guards this gateway compensates for.
    const native = this.nativeManager()
    if (native !== undefined) {
      this.enqueueNativeUpdate(job, native)
      return { jobId: job.id }
    }
    this.enqueue(() => this.run(job, ['plugin', '--profile', this.facts.profileName, 'add', spec], ADD_TIMEOUT_MS))
    return { jobId: job.id }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1860-1890](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1860-L1890)

真实spawnCli与退出判定。

<details>
<summary>查看原文（31行）</summary>

```text
  /** The mutation body of {@link run}. */
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
    const tail = output.read().trim()
    // A non-zero exit is normally the whole verdict, and every other pnpm
    // condition keeps that meaning. The skipped-build-script exit is the one
    // exception: pnpm prints it after the profile has been written, so the
    // exit is re-read from the profile instead of being trusted — and only the
    // profile can say whether this run landed. The post-checks below are those
    // reads, so a tolerated exit that landed nothing still fails, with pnpm's
    // own tail as the reason.
    const tolerated: TolerableExit | undefined =
      code !== 0 && reportsIgnoredBuilds(tail) ? { code, output: tail } : undefined
    if (code !== 0 && tolerated === undefined) {
      job.phase = 'error'
      job.error = tail === '' ? `plugin-manager: dsh plugin ${job.action} exited with code ${String(code)}` : tail
      return
    }
    let after = await this.capture()
    // The selection the CLI's own run left behind. Read here, before the
```

</details>

**依据 12 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1940-1991](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1940-L1991)

CLI精确目标版本/选择与预检后结算。

<details>
<summary>查看原文（52行）</summary>

```text
    } else if (job.action === 'update') {
      const targetId = job.targetId
      const targetVersion = job.targetVersion
      if (targetId === undefined || targetVersion === undefined || !after.dependencies.includes(targetId)) {
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin add 报告成功，但目标插件未保留在 profile 中（更新未生效）'
        return
      }
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
      if (updated.version !== targetVersion) {
        job.phase = 'error'
        job.error = tolerated?.output ?? `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
        return
      }
      // B10 (update): the replacement must not drop the selection it found. A
      // package the profile mounts through a patch row was never selected, so
      // its absence is the state the run found, not a loss.
      if (await this.bundleSelectionMissing(targetId, reconciledBundles, before.bundles.includes(targetId))) {
        job.phase = 'error'
        job.error = this.halfMountError(targetId, 'dsh plugin add 更新了版本，但 ', tolerated)
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
      // B8 (remove): an exit code — success or tolerated — must mean the
      // dependency is gone.
      const removed = before.dependencies.find(candidate => !after.dependencies.includes(candidate))
      if (removed === undefined) {
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin remove 报告成功，但依赖仍在 profile 中（卸载未生效）'
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
    if (tolerated !== undefined) this.recordToleratedExit(job, tolerated)
    job.phase = 'done'
```

</details>

**依据 13 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1400-1453](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1400-L1453)

native真调用与精确版本/重启事实。

<details>
<summary>查看原文（54行）</summary>

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
  }
```

</details>

#### 缺口

- 未运行registry变化/peer-only release/当前Host和所有writer，未验证上游install/apply。
  **影响**：更新检查/受理/done/已加载四种状态不可混用，兼容门不完整。
  **进一步探讨**：副本测试peer-only要求、latest漂移/低tag及精确目标，核HTTP→job→磁盘→重启后实际加载功能四层。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 网关信谁，串行和回滚能保证什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

每条gateway路由真实guard同一isLoopbackRequest：socket loopback、拒CF/x-forwarded-for、loopback Host、拒cross-site、Origin若存在需同host。没有逐用户token或人批，缺Origin的本机程序可调用；这是本机权限模型，不是多租户隔离。安装可执行第三方包生命周期脚本，即使spec拒一组shell元字符也不是不可信包沙箱；任何已信任的本机代理也必须保持原始边界，不能只凭名字loopback断言所有部署不可远达。

本gateway mutation队列串行，拒绝后恢复tail，避免本实例常规写交错；不是跨进程/外部CLI全局锁。Host启动1.5秒后会自动repairProfileRowNames，直接read/repair/write不进withMutationLock，未点更新也可能改patch；卸载清未触发timer，不保证已开始修复取消。首次试用必须先备份，不能叫整个插件只读检查器。

普通CLI install写后做重复entry owner检查/不可解析insert/组合预检；有冲突通过官方remove回滚新包，不对共享id写disabled。rollbackInstall以remove退出码0声称已回滚，没有再核依赖/运行外部副作用，失败明确手动移除；不能推成全盘恢复。普通update预检失败因为无newDependency只记error，可能目标已落盘，非自动恢复旧版。写patch/manifest备份失败忽略、0600 tmp→rename，无fsync/多文件事务；不能给断电无损保证。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:272-285](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L272-L285)

真实guard非loopback拒绝。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:662-672](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L662-L672)

每条gateway路由都guard。

<details>
<summary>查看原文（11行）</summary>

```text
  return [
    { kind: 'exact', path: `${GATEWAY_PREFIX}/list`, handler: guard(listHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/install`, handler: guard(installHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/update`, handler: guard(updateHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/remove`, handler: guard(removeHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/status`, handler: guard(statusHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/set-enabled`, handler: guard(setEnabledHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/failures`, handler: guard(failuresHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/mode`, handler: guard(modeHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/check-updates`, handler: guard(checkUpdatesHandler) },
    { kind: 'exact', path: `${GATEWAY_PREFIX}/restart`, handler: guard(restartHandler) },
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/loopback.ts:72-94](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/loopback.ts#L72-L94)

真实socket/forwarded/Host/site/Origin门。

<details>
<summary>查看原文（23行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}

/**
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:45-55](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L45-L55)

spec字符拒绝仅语法门。

<details>
<summary>查看原文（11行）</summary>

```text
const UNSAFE_SPEC_CHARS = /[&|<>"'`%!\n\r\0]/

/**
 * Validate an install spec or package id against shell metacharacters.
 * @param spec - the user-supplied spec or id.
 * @returns the rejection message, or undefined when the spec is safe.
 */
export function unsafeSpecReason(spec: string): string | undefined {
  return UNSAFE_SPEC_CHARS.test(spec)
    ? 'plugin-manager: spec 含有危险的 shell 元字符或控制字符，已拒绝'
    : undefined
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:935-944](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L935-L944)

真实mutation队列和失败tail恢复。

<details>
<summary>查看原文（10行）</summary>

```text
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  /** Chain one fire-and-forget CLI mutation onto the shared queue. */
  private enqueue(task: () => Promise<void>): void {
    void this.withMutationLock(task).catch(() => {})
  }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:106-119](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/index.ts#L106-L119)

启动自动修复定时器与清理。

<details>
<summary>查看原文（14行）</summary>

```text
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
}
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2208-2228](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L2208-L2228)

修复直接读取/写patch未进队列。

<details>
<summary>查看原文（21行）</summary>

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
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1905-1940](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1905-L1940)

新install真实后验和回滚调用。

<details>
<summary>查看原文（36行）</summary>

```text
    }
    const conflicts = significantChanges(diffLayer(before.layer, after.layer))
    if (job.action === 'install') {
      const name = this.newDependency(before, after)
      if (name === undefined) {
        // B8: neither a success exit code nor a tolerated one is proof the
        // install landed.
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin add 报告成功，但 profile 未新增任何依赖（安装未生效）'
        return
      }
      // B10: a dependency written without its bundle selection is a half mount,
      // and the tolerance for pnpm's exit changes nothing about that.
      if (await this.bundleSelectionMissing(name, reconciledBundles)) {
        job.phase = 'error'
        job.error = this.halfMountError(name, 'dsh plugin add 只写入了依赖，', tolerated)
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
```

</details>

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2309-2329](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L2309-L2329)

rollback以退出码结算且失败给手动退路。

<details>
<summary>查看原文（21行）</summary>

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
  }

```

</details>

**依据 10 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2440-2470](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L2440-L2470)

预检非newDependency失败不回滚旧版。

<details>
<summary>查看原文（31行）</summary>

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
  }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-manager/src/host/rows.ts:17-26](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/rows.ts#L17-L26)

patch备份尽力/tmp/rename。

<details>
<summary>查看原文（10行）</summary>

```text
 * Persist one patch file conservatively: a timestamped-free single backup,
 * then a tmp write and an atomic-ish rename over the target.
 * @param patchPath - absolute cordis.patch.yml path.
 * @param text - the new file text.
 */
export async function writePatchAtomic(patchPath: string, text: string): Promise<void> {
  await copyFile(patchPath, `${patchPath}.bak-plugin-manager`).catch(() => {})
  await writeFile(`${patchPath}.tmp`, text, { mode: 0o600 })
  await rename(`${patchPath}.tmp`, patchPath)
}
```

</details>

**依据 12 · 源码核查**：[packages/dsh-plugin-manager/src/host/profile.ts:355-364](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/profile.ts#L355-L364)

manifest备份尽力/tmp/rename。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

#### 缺口

- 未测外部writer/启动修复竞争、掉电、多进程、恶意包与回滚真实残留。
  **影响**：串行/rename/退出码不能保证全事务或安全执行未知包。
  **进一步探讨**：只副本并发修复/更新和外部CLI，故障后核磁盘/进程/目标；未知影响不重复install，恢复备份须停所有writer。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 更新、启停、重启与退出什么时候才算生效？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

gateway set-enabled锁内重读安装归属，未知目标404，按实际entry id/name写disabled覆盖并保留本管理器锁定行；写工作脱离HMR事务但await真实写入，再回读snapshot。它报告配置值，不是所有运行时已经热加载；内置行官方manager可另回restart-required/overridden，界面会分别说明并重读Loader。不能把包级启停和内置行官方热更新混成一个写入器。

native update先原地install，若already-installed才remove再install精确spec，失败尝试装回previousSpec并恢复bundle顺序；装回失败明确人工重装，顺序恢复失败只日志warn，不能保证完全恢复。CLI ignored-builds非零退出若命中诊断且后验都过可done，并带warnings提示构建未执行；不是原生模块已能用。client update结果只提取plugin/restartRequired，warnings未在这个返回对象透传，用户还需查job/Host日志，不保证界面看到全部警告。

restart GET/HEAD只读方案，POST执行202；desktop无shell重启承诺与不明supervisor走manual，user systemd请求受控unit，终端才detached helper重放自身命令。performRestart先安排后退出，202只代表请求，不验证新进程健康/插件可用；helper/命令错误日志不能用旧页面成功提示替代回归。本包dispose注销路由/页面和待修复timer，没有gateway job取消接口；CLI计时器仅child.kill，等待函数以close或error结算，没有此处SIGKILL升级，不能把标注deadline当强制终止全部进程树。关闭页面轮询超时也不取消后台安装，退出需查真实job/CLI/包管理器后再处理profile。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:453-530](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L453-L530)

真实归属/locked行/await写入/回读。

<details>
<summary>查看原文（78行）</summary>

```text
  const setEnabledHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const body = (await readJsonBody(req, { maxBytes: 64 * 1024, objectOnly: true }) ?? {}) as Record<string, unknown>
    const id = body['id']
    const enabled = body['enabled']
    if (typeof id !== 'string' || id.trim() === '' || typeof enabled !== 'boolean') {
      writeJson(res, 400, { error: 'plugin-manager: set-enabled needs an id and a boolean enabled' })
      return
    }
    const target = id.trim()
    const unsafeTarget = unsafeSpecReason(target)
    if (unsafeTarget !== undefined) {
      writeJson(res, 400, { error: unsafeTarget })
      return
    }
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
      const plugin = snapshot.plugins.find(item => item.id === ownerName)
      return plugin === undefined
        ? { error: `plugin-manager: plugin ${ownerName} is not installed` } as const
        : { plugin } as const
    })
    if ('error' in outcome) {
      writeJson(res, 404, { error: outcome.error })
      return
    }
    writeJson(res, 200, { plugin: outcome.plugin })
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx:296-325](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx#L296-L325)

官方内置toggle和重启/覆盖提示。

<details>
<summary>查看原文（30行）</summary>

```text
    void (async () => {
      let outcome
      try {
        outcome = readChangeResult(await manager.setPluginEnabled(row.entryId, next))
      } catch (error) {
        warnFailure('built-in group write failed', error)
        outcome = { ok: false as const, code: FALLBACK_CODE }
      }
      writingRef.current = false
      setPending(undefined)
      if (!outcome.ok) {
        setNotice({
          tone: 'error',
          text: t(next ? 'builtinFailedEnable' : 'builtinFailedDisable', { reason: refusalText(outcome.code, t) }),
        })
        return
      }
      // A resolved write is not always a state the page will keep: the next start
      // loads a restart-required change, and a higher profile layer wins over an
      // overridden one. The re-read below is what makes the switch show the Loader
      // either way; this line is what tells the reader which of the two happened.
      // A restart-required write is not a success: the change is on disk and the
      // running process still serves the old state, so it is said in the same
      // passing tone as an overridden one.
      setNotice(outcome.application === 'restart-required'
        ? { tone: 'note', text: t('builtinRestartRequired', { reason: restartReason(outcome.restartReason, t) }) }
        : outcome.application === 'overridden'
          ? { tone: 'note', text: t('builtinOverridden', { name: rowTitle(row, resolveText) }) }
          : undefined)
      setReload(token => token + 1)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1491-1530](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1491-L1530)

真实native两阶段替换/失败装回。

<details>
<summary>查看原文（40行）</summary>

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
  }

  /**
   * Where a bundle sits in the layer order, read before the removal drops it.
   * @param name - the installed bundle name.
   * @returns the index in `dsh.profile.bundles`, or undefined when the profile
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1557-1567](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1557-L1567)

顺序恢复失败仅warn。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1983-2008](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1983-L2008)

真实done后warnings记录。

<details>
<summary>查看原文（26行）</summary>

```text
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    if (job.action === 'install' || job.action === 'remove') {
      job.plugin = await this.rowFor(job.action, job.spec, before, after)
    }
    if (tolerated !== undefined) this.recordToleratedExit(job, tolerated)
    job.phase = 'done'
  }

  /**
   * Carry an accepted non-zero exit to the caller and to the host log.
   *
   * Every post-check passed, so the change landed and the job settles `done`;
   * the pnpm output is kept anyway, because it is the only record that a
   * dependency was installed without its build script — a fact the next boot
   * reports as a missing native module, with nothing left to attribute it to.
   * @param job - the job the run settles.
   * @param tolerated - the exit the profile overruled.
   */
  private recordToleratedExit(job: GatewayJob, tolerated: TolerableExit): void {
    job.warnings = [...(job.warnings ?? []), tolerated.output]
    console.warn(
      `[plugin-manager] 退出码 ${String(tolerated.code)} 已按完成处理：profile 变更已落地，pnpm 只是跳过了构建脚本（可用 pnpm approve-builds 复核）：\n${tolerated.output}`,
    )
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:218-237](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L218-L237)

client update仅提取plugin和restartRequired。

<details>
<summary>查看原文（20行）</summary>

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
        }
      } finally {
        gatewayInflight = false
      }
    },
    uninstall: async (id: string): Promise<InstalledPluginItem[]> => {
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:645-660](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L645-L660)

GET/HEAD读方案、POST执行202。

<details>
<summary>查看原文（16行）</summary>

```text
  const restartHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const plan = planRestart((deps.restartFacts ?? liveRestartFacts)())
    // Reading the plan is side-effect free. The toolbar asks for it before it
    // tells the user what a restart will do, and no GET-shaped request (a
    // prefetch, a typed URL, a link scanner) may ever stop a running host.
    if (req.method === 'GET' || req.method === 'HEAD') {
      writeJson(res, 200, { restart: { mode: plan.mode, ...plan.unit === undefined ? {} : { unit: plan.unit } } })
      return
    }
    if (req.method !== 'POST') {
      writeJson(res, 405, { error: 'plugin-manager: restart needs GET (plan) or POST (execute)' })
      return
    }
    const mode = performRestart(plan, deps.restartRuntime ?? {})
    writeJson(res, 202, { restart: { mode } })
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:236-270](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/restart.ts#L236-L270)

按desktop/systemd/terminal选择方案。

<details>
<summary>查看原文（35行）</summary>

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
  // A systemd service has a manager that owns the process tree and restarts the
  // unit on request, so re-executing in place would fight it. Only the user
  // manager is used: the system manager needs privileges this process does not
  // have, and a request it would refuse is worse than the honest manual answer.
  if (facts.systemd?.scope === 'user') return { mode: 'systemd', unit: facts.systemd.unit }
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
      execPath: facts.execPath,
      argv: [...(facts.execArgv ?? []).filter(isReusableExecArg), script, ...facts.argv.slice(1)],
      cwd: facts.cwd,
      env: facts.env,
    },
  }
}

```

</details>

**依据 9 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:493-516](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/restart.ts#L493-L516)

真实调度systemd/helper与退出。

<details>
<summary>查看原文（24行）</summary>

```text
export function performRestart(plan: RestartPlan, runtime: RestartRuntime = {}): RestartMode {
  if (plan.mode === 'manual') return 'manual'
  const schedule = runtime.schedule ?? ((run: () => void, delayMs: number) => { setTimeout(run, delayMs) })
  if (plan.mode === 'systemd') {
    // A plan that cannot name its unit is not a systemd restart; asking for
    // one anyway would stop nothing and report a restart that never happens.
    const unit = plan.unit
    if (unit === undefined) return 'manual'
    const requestUnit = runtime.requestUnit ?? ((target: string) => { requestUnitRestart(target) })
    // Answer first, request second. systemd's stop job begins the moment the
    // request reaches the manager, so issuing it before the response is written
    // leaves the browser with a dropped connection instead of the 202 — and a
    // restart that looks like a crash is one the user cannot tell from failure.
    schedule(() => { requestUnit(unit) }, RESTART_EXIT_DELAY_MS)
    return 'systemd'
  }
  const startHelper = runtime.startHelper ?? ((command: RelaunchCommand) => startRelaunchHelper(command))
  const exit = runtime.exit ?? (() => { process.exit(0) })
  if (plan.mode === 'relaunch') {
    if (plan.command === undefined || !startHelper(plan.command)) return 'manual'
  }
  // The response must reach the browser before this process disappears.
  schedule(exit, RESTART_EXIT_DELAY_MS)
  return plan.mode
```

</details>

**依据 10 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:600-638](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L600-L638)

CLI超时只kill，等待以close/error结算。

<details>
<summary>查看原文（39行）</summary>

```text
export async function awaitChildExit(child: ChildProcess): Promise<ChildExit> {
  return new Promise<ChildExit>(resolve => {
    let settled = false
    const finish = (code: number | null): void => {
      if (settled) return
      settled = true
      const spawnError = SPAWN_FAILURE.get(child)
      resolve(spawnError === undefined ? { code } : { code, spawnError })
    }
    child.on('close', (code: number | null) => { finish(code) })
    child.on('error', () => { finish(SPAWN_FAILURE_EXIT_CODE) })
  })
}

/**
 * Wait for one spawned CLI child, folding a spawn failure into its output.
 *
 * Every caller already reports a non-zero exit through the captured output, so
 * a process that never started is reported the same readable way instead of as
 * a silent failure or a hang.
 * @param child - the spawned child.
 * @param output - the bounded capture the failure text is appended to.
 * @param timeoutMs - kill the child after this long; omitted for no deadline.
 * @returns the exit code, or null when a signal ended the child.
 */
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
}
```

</details>

**依据 11 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:94-100](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/index.ts#L94-L100)

卸载仅注销路由。

```text
  ctx.effect(() => {
    const disposers = makeGatewayRoutes({ facts, gateway, cliAvailable, installAnchor })
      .map(route => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
  }, 'plugin-manager: gateway routes')
```

#### 缺口

- 未执行重启helper、所有Windows/系统服务/HMR/官方writer、包脚本和浏览器警告完整呈现。
  **影响**：已落盘/已接受重启非健康回归，也不承诺卸载取消在飞变更。
  **进一步探讨**：副本单包核版本/Loader/核心功能，保留日志与warnings；取消浏览器后核后台子进程，安全停稳才恢复profile。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得怎样试，成本和退路是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

熟悉profile恢复的本机维护者，可在可弃置副本备份manifest、patch、锁文件和必要数据后，检查通道/profile与启动修复差异，再选一可信非关键第三方包做单次更新；先记当前精确版本、registry目标和DSH要求，不首试全部更新/迁移/本体升级/陌生git包。受理后核job、磁盘版本与选择，按实际restart plan执行，重新打开后核Loader/插件核心操作；首次真正安装会执行第三方代码，不能说只读。无CLI/无nativewriter/compat未知按错误停，不盲升级DSH。

持续成本包括registry请求/下载/磁盘和上游CLI/包管理器资源，实际价格/流量/人工工时未知；本包没有直接模型调用证据，不把未见调用填现金0。版本审阅、每次重启停机/回归、DOM和Host API变化、构建脚本审批都需人工。浏览器apply还有独立每日心跳；本项未核云端数据保留，应在副本加载前按telemetry抑制机制设置DNT/opt-out，不能把本机网关视为没有外联。

失败保留job/CLI/Host日志和文件差异，确认没有在飞writer，再用可信固定spec或停Host恢复备份并回归；rollback文字不是恢复验收。退出先停更新任务/查真实包管理进程和新旧依赖，再卸本管理器；注销路由不撤回已执行安装脚本或自动修复。收益以同样一包对照官方页/固定CLI的操作错误、恢复总工时与停机衡量，未测净节时。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:1-40](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/package.json#L1-L40)

实际Host/Web/版本声明。

<details>
<summary>查看原文（40行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-plugin-manager",
  "description": "Update checking for the dsh web GUI's official Plugins page: compares installed plugins against the version their registry source serves, gates the update on the DSH runtime minimum the release declares, and drives the update through the official installer channel or this package's loopback CLI gateway.",
  "version": "0.4.15",
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
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
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
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:138-167](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L138-L167)

官方writer继承边界。

<details>
<summary>查看原文（30行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:106-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L106-L114)

registry请求真实外联。

```text
async function fetchRegistryManifest(name: string): Promise<RegistryVersionManifest | undefined> {
  const encoded = name.startsWith('@') ? name.replace('/', '%2F') : name
  const response = await fetch(`https://registry.npmjs.org/${encoded}/latest`, withIdentityEncoding({
    signal: AbortSignal.timeout(REGISTRY_TIMEOUT_MS),
  }))
  if (!response.ok) return undefined
  const body = await response.json() as { version?: unknown; dsh?: unknown; engines?: unknown }
  if (typeof body.version !== 'string') return undefined
  return { version: body.version, dsh: body.dsh, engines: body.engines }
```

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:106-119](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/index.ts#L106-L119)

首次加载可能自动改patch。

<details>
<summary>查看原文（14行）</summary>

```text
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
}
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:152-183](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L152-L183)

批量首失败即停非整批事务。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:354-358](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L354-L358)

实际浏览器心跳调用。

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-plugin-manager' }])

```

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/client/telemetry.ts:117-150](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/telemetry.ts#L117-L150)

心跳抑制和真实fetch。

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

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:625-638](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L625-L638)

后台kill/等待边界。

<details>
<summary>查看原文（14行）</summary>

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
}
```

</details>

#### 缺口

- 未运行/安装/账号/计价、实际备份恢复和同条件维护收益，也未审云端遥测服务。
  **影响**：只有有恢复能力者适合受控试用，不能承诺省钱或无外联。
  **进一步探讨**：先副本比对启动修复/目标版本，单包四层验收后再决定长期用；额外负担超过官方页/CLI即退出。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 可迁移贡献与尚未实现方向是什么？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

可迁移贡献是将多通道更新接入官方页，先校当前Host要求、写后核依赖/精确版本，再明确restart-required与普通done；不是市场来源可信验证或完整运行验收。当前已有latest失败可重试、warnings与restartRequired、启动行名修复和orphan清理，不能把泛泛“增加状态提示/修复旧行”再称新增。

剩余候选是把用户检查时的expectedVersion/目标来源摘要绑定更新请求，在Host重新解析latest不同就先返回差异待用户重审，而不是直接更新新版本；随后单独记录重启后实际加载版本/关键功能，避免磁盘done误当服务通过。先不造新安装器，与现有官方固定spec+人工清单对照：检查后latest变化、peer-only最低要求、done但需重启三个脱敏样本，测意外版本写入、误信可用与总维护工时。若用户本来接受总取最新、固定spec已充分且更简单，或增加确认反而使恢复变慢，则推翻；未实现/实验，不计本版创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:218-237](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/client/index.ts#L218-L237)

update只发送id，返回已落盘与restart事实。

<details>
<summary>查看原文（20行）</summary>

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
        }
      } finally {
        gatewayInflight = false
      }
    },
    uninstall: async (id: string): Promise<InstalledPluginItem[]> => {
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-410](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L378-L410)

Host重取latest和同版本失败重试已有。

<details>
<summary>查看原文（33行）</summary>

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
      // A run that wrote this version and then failed its boot preflight left
      // the profile at the target with the update itself unsettled (see
      // gateway.ts verifyBoot). Answering that retry with "already at latest" is
      // a dead end the panel cannot leave: the row already carries the newest
      // version, so the only way out was a reinstall run by hand. Only a
      // recorded failure of this plugin's newest update at this exact version
      // re-runs the install — the same job, preflight included — so a plugin
      // that is genuinely up to date keeps its 409 and writes nothing.
      if (row.version === latest && !gateway.lastUpdateFailed(target, latest)) {
        return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      }
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

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:106-114](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/routes.ts#L106-L114)

默认清单缺peer字段为具体反证。

```text
async function fetchRegistryManifest(name: string): Promise<RegistryVersionManifest | undefined> {
  const encoded = name.startsWith('@') ? name.replace('/', '%2F') : name
  const response = await fetch(`https://registry.npmjs.org/${encoded}/latest`, withIdentityEncoding({
    signal: AbortSignal.timeout(REGISTRY_TIMEOUT_MS),
  }))
  if (!response.ok) return undefined
  const body = await response.json() as { version?: unknown; dsh?: unknown; engines?: unknown }
  if (typeof body.version !== 'string') return undefined
  return { version: body.version, dsh: body.dsh, engines: body.engines }
```

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1400-1453](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1400-L1453)

native真写后版本与restartRequired已有。

<details>
<summary>查看原文（54行）</summary>

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
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1983-2008](https://github.com/zhu1090093659/dsh-web/blob/1f148567c2f2c2a7ee84b8cef2d3c5fa959d2f1a/packages/dsh-plugin-manager/src/host/gateway.ts#L1983-L2008)

warnings已有不重复发明。

<details>
<summary>查看原文（26行）</summary>

```text
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    if (job.action === 'install' || job.action === 'remove') {
      job.plugin = await this.rowFor(job.action, job.spec, before, after)
    }
    if (tolerated !== undefined) this.recordToleratedExit(job, tolerated)
    job.phase = 'done'
  }

  /**
   * Carry an accepted non-zero exit to the caller and to the host log.
   *
   * Every post-check passed, so the change landed and the job settles `done`;
   * the pnpm output is kept anyway, because it is the only record that a
   * dependency was installed without its build script — a fact the next boot
   * reports as a missing native module, with nothing left to attribute it to.
   * @param job - the job the run settles.
   * @param tolerated - the exit the profile overruled.
   */
  private recordToleratedExit(job: GatewayJob, tolerated: TolerableExit): void {
    job.warnings = [...(job.warnings ?? []), tolerated.output]
    console.warn(
      `[plugin-manager] 退出码 ${String(tolerated.code)} 已按完成处理：profile 变更已落地，pnpm 只是跳过了构建脚本（可用 pnpm approve-builds 复核）：\n${tolerated.output}`,
    )
```

</details>

#### 缺口

- 未确认用户对latest漂移的容忍、原生writer可否绑定目标和现UI是否充分解释。
  **影响**：方向可证伪而非已确认缺陷/必需新增模块。
  **进一步探讨**：先三样本观察当前理解与固定spec基线；只有错误下降且总负担不过界才做绑定小原型。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
