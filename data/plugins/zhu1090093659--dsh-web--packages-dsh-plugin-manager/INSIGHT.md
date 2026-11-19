# DSH Plugin Manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 10,524](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C524&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,503](https://img.shields.io/static/v1?label=npm+30d&message=94%2C503&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：在 DSH 官方插件页集中检查版本与宿主兼容，执行更新并管理插件开关。

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，本包把版本要求、逐行批次结果和重启提示放进同一维护任务，并复用宿主单项writer。失败行继续与落地待重启区分使部分完成可见，但没有把包更新变成业务功能验收。

> **主要限制**：[Q03](#research-q03) 的父job done不表示全项成功，实时游标回调也未接到实际face；[Q06](#research-q06) 的轮询超时不会取消host写入。[Q04](#research-q04) 的预检失败可能已写入目标，因此恢复必须对账而不能只看提示重试。

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
  - [Q01 · 相比原生页与CLI，多包维护增加什么？](#detail-section-11)
  - [Q02 · 候选版本和DSH兼容怎样判定？](#detail-section-12)
  - [Q03 · 批量更新由谁排序，如何表达部分完成？](#detail-section-13)
  - [Q04 · CLI与应用内writer怎样判断落地、启动与恢复？](#detail-section-14)
  - [Q05 · 开关、内置搜索和分页会改变什么状态？](#detail-section-15)
  - [Q06 · 本机围栏、超时和重启分别保证到哪一步？](#detail-section-16)
  - [Q07 · 怎样计一次合格维护任务的成本并决定试用？](#detail-section-17)
  - [Q08 · 哪种逐行结果回执值得进一步验证？](#detail-section-18)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常维护多个社区包的本机用户可在官方页集中检查和执行，合格结果包含版本、profile与运行加载核对。[Q01](#research-q01) 解释相对原生管理的有限增量。

原生页面及dsh plugin CLI本来负责包管理。少量已知目标可直接用原生路径，避免新增DOM适配、轮询及网关排查。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 更新检查 | 汇总源版本和DSH要求 | 网关仅覆盖识别的直接npm源和特定迁移 |
| 单项安装/更新/移除 | 委托适用writer修改profile | 落地需后验，外部副作用不全回滚 |
| 批量更新 | 顺序处理并保留失败行 | 网关单job；官方RPC仍逐项，done不代表全成功 |
| 行级启停 | 写有效entry覆盖并回读 | 上层覆盖或待重启可使当前状态不变 |
| 内置搜索分页 | 按标题/模块/行/拥有者查看 | 每页20项，本地视图不改启用 |
| 重启计划 | 说明如何使更改生效 | 取决于桌面壳、systemd或交互环境 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.3及Web客户端服务 | 必需 | host/client挂载与官方页 | 无法保证界面和API兼容 |
| 可解析当前profile和webServer | 网关所需 | 管理路由与盘面对账 | host入口返回，不挂网关 |
| 官方RPC、CLI或应用内manager | 对应渠道必需 | 唯一单项writer | 无可用渠道时拒绝或失败 |
| npm注册表及可验证要求 | 直接npm更新所需 | 精确目标和兼容判断 | 查询未知或412，不代表包本身无效 |
| 本机围栏与profile备份 | 试用所需 | 限权和恢复 | 不应扩大使用范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户固定包版本与profile备份 | 能还原原始状态 |
| 检查 | 页面读包源和宿主要求 | 分清无更新、不兼容与无法核验 |
| 执行 | 对应writer串行更新 | 每行看落地、失败与待重启 |
| 验收 | 重启后运行代表能力 | 配置预检不代替业务可用 |
| 恢复 | 停批次并回读盘面 | 不凭轮询超时直接重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装与下载资源未知 | 识别profile、渠道及备份 | 耗时未测 |
| 持续 | 注册表请求和下载成本未知 | 查看兼容、逐行结果及重启 | 净节时未知 |
| 失败恢复 | 重装与排障资源未知 | 对账已落地版本、层与进程 | 外部脚本副作用不保证回滚 |
| 退出 | 原生管理资源未知 | 移除增强并保留配置备份 | 已更新包不自动退回旧版 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 目标检查 | 源版本及宿主要求重新解析 | 所有来源和实际API兼容 |
| 批量维护 | 串行继续、逐行结果 | 真实成功率和净节时 |
| 状态后验 | 版本/profile/组合核对 | 目标业务任务可用性 |
| 失败恢复 | 限定重试与部分补偿 | 中断、子进程和全副作用恢复 |

> **思考**：[Q03](#research-q03) 的父job done不表示全项成功，实时游标回调也未接到实际face；[Q06](#research-q06) 的轮询超时不会取消host写入。[Q04](#research-q04) 的预检失败可能已写入目标，因此恢复必须对账而不能只看提示重试。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，本包把版本要求、逐行批次结果和重启提示放进同一维护任务，并复用宿主单项writer。失败行继续与落地待重启区分使部分完成可见，但没有把包更新变成业务功能验收。

[Q03](#research-q03) 分项结果与串行writer复用、[Q04](#research-q04) 返回值加盘面后验值得借鉴。实施时应保留请求集覆盖和结果未知，避免宽容解析吞掉证据；[Q05](#research-q05) 视图操作与真正profile写入分离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的父job done不表示全项成功，实时游标回调也未接到实际face；[Q06](#research-q06) 的轮询超时不会取消host写入。[Q04](#research-q04) 的预检失败可能已写入目标，因此恢复必须对账而不能只看提示重试。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q07](#research-q07) 建议本机可重建profile中的非关键包试用，先用允许与拒绝目标核对逐行结果。轮询失联先对账，异常停止新批次并回原生管理；不把批次done当完成验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持集中检查、分渠道写入及部分结果显示；未运行真实宿主和包操作。实时进度回调存在未转发接线，持久结果回执是待验证设计。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/README.md、packages/dsh-plugin-manager/cordis.patch.yml、packages/dsh-plugin-manager/tsdown.config.ts、packages/dsh-plugin-manager/src/index.ts、packages/dsh-plugin-manager/src/client/index.ts、packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx、packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx、packages/dsh-plugin-manager/src/core/protocol.ts、packages/dsh-plugin-manager/src/core/version.ts、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/dsh-compat.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/host/loopback.ts、packages/dsh-plugin-manager/src/host/restart.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定0.4.19，复核旧判断和批次/协议/native更新/搜索分页变化；重点核对更新、启停、信任、超时及重启。未穷尽全部平台、迁移回退及宿主内实现。
- 下一步：未执行目标代码、插件测试、包操作或真实宿主。源码能证明调用和状态分支，不能证明外部安装、重启与净收益；下一步在可重建profile回读包、层、进程和代表任务。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.19（[固定提交 5d4bf78](https://github.com/zhu1090093659/dsh-web/tree/5d4bf78e319393ac20d9f5acecc7a0e43f970bee)）
- **版本日期**：2026-11-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q08](#research-q08) 提议绑定请求集合的可回读逐行回执，显式保留结果未知及待重启，比较其能否减少失联后的盲目重试。若缺host状态或人工成本不降，就不推广。

未执行目标代码、插件测试、包操作或真实宿主。源码能证明调用和状态分支，不能证明外部安装、重启与净收益；下一步在可重建profile回读包、层、进程和代表任务。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 350 | — | — | 12094 |
| .ts | source | 30 | 8164 | 4518 | 3224 | — |
| .tsx | source | 5 | 1463 | 989 | 375 | — |
| .ts | test | 29 | 8540 | 6038 | 1495 | — |
| .tsx | test | 4 | 1912 | 1258 | 353 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 141](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=141&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z) [![近30天关闭 143](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=143&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-20T03%3A16%3A38.300Z..2026-11-19T03%3A16%3A38.300Z)



统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护一组社区插件时，集中页如何决定目标、选择writer并核对部分落地、重启和失败？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比原生页与CLI，多包维护增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组件给经常维护多个第三方插件的本机操作者，在官方插件页集中检查包源版本、查看宿主要求、批量执行和读逐行结果。原生管理页与CLI本来能安装、卸载和启停；本包的增量是把查源、比较、执行及重启提示聚成一次维护任务，而不是替代包管理器。合格交付须同时核对目标版本、profile选择、当前加载和失败清单，不能以点击了Update all或网关done作为全部可用。

patch给自己独立的行ID，保留原生插件页；host只在能定位存在的profile时注册网关。客户端提供统一管理face并把工具条插入官方页面的Installed标题，另桥接可选原生远程命名空间。如果页面DOM或宿主服务不存在，源码中的回退和捕获不保证用户仍看到相同界面。只维护一个已知包、能直接运行原生管理命令时，额外DOM与网关排查可能没有价值。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-manager/README.md:18-24](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/README.md#L18-L24)

作者给出集中检查、渠道与批量任务定位。

```text
An update and lifecycle manager for DeepSeek Harness (DSH) Web GUI and official desktop client: adds real-time registry version comparisons with DSH runtime compatibility checks directly into the official Plugins page, providing list-level batch updates, safe rollback mechanisms, and restart-to-apply workflows.

## What it does

- Contributes a check-for-updates block into the official Plugins page (the `plugins.detail.section` seat that page declares), rendered on an installed bundle's page and nowhere else. There is no tab of its own in the Plugins settings section.
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows in one host job, in order, with per-row progress — a row the host refuses is named in place with its own reason and the run carries on with the rows behind it; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
```

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/cordis.patch.yml:6-20](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/cordis.patch.yml#L6-L20)

独立行避免覆盖原生插件页面。

<details>
<summary>查看原文（15行）</summary>

```text
# The row id lives in the loader's GLOBAL id space, one entry per id with
# later-wins and no diagnostic. The official @deepseek-ai/dsh-web-app bundle
# already claims `ui-plugin-manager` for its own plugin page (the half that
# registers the sidebar "Plugins" entry), so this package claims its own id
# instead; sharing the official id dropped the official row silently and the
# sidebar entry disappeared with the whole plugin management page.
#
# The row `name` must stay exactly the package name: the official
# @deepseek-ai/dsh-client-modules mounts a package's browser half on the loader
# row whose specifier resolves to that package's own manifest, so a subpath
# name (the aggregate's `@linxin666/dsh-web-all/plugin-manager` shape) would
# mount the host half only.
- insert:
    - id: ui-plugin-manager-update-check
      name: '@linxin666/dsh-client-ui-plugin-manager'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:71-100](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/index.ts#L71-L100)

profile缺失时返回，实际注册网关。

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

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:438-480](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L438-L480)

统一face、可选桥接和DOM工具条挂载。

<details>
<summary>查看原文（43行）</summary>

```text
  // face, so consumers observe exactly the mutations the patch performs.
  const face = createPluginManagerFace(ctx)
  try {
    if (!ctx.get(PLUGIN_MANAGER_SERVICE)) {
      ctx.provide(PLUGIN_MANAGER_SERVICE, face)
    }
  } catch {
    // ignore duplicate provide
  }

  // The official remote namespaces the built-in group reads are OPTIONAL faces:
  // injecting each one keeps its arrival and withdrawal observable, so the
  // group shows what this deployment publishes instead of assuming it.
  try {
    bridgeRemoteNamespaces(ctx)
  } catch (error) {
    // A carrier without them keeps the group's own unavailable state; the
    // failure is logged so it is not mistaken for a deployment that has them.
    console.warn('plugin-manager: bridging the official plugin faces failed', error)
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
          updateAll: face.updateAll,
          restartPlan: face.restartPlan,
          restart: face.restart,
          t: ctx.locale.bind(NS),
        }),
        subscribe: listener => ctx.locale.subscribe(listener),
      })
    } catch {
      return () => {}
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 候选版本和DSH兼容怎样判定？

**研究主题**：依赖、兼容与流程、功能与机制

#### 完整回答

网关check-updates只对识别出的直接npm源读注册表清单，取manifest.version与已装值不同就列为候选；这不是通用的语义版本“更高”判断，也不覆盖Git/link源的全部更新。执行时planUpdate重新读取实时profile，检查已安装、源类型、清单与版本是否可解析，再把精确目标交给writer。相同版本通常409；只有该插件在该目标版本存在已记录更新失败时，允许重走后验，避免“写到最新版但启动预检失败”再也不能重试。

宿主要求依次取dsh.engines.dsh、engines.dsh、peerDependencies[@deepseek-ai/dsh]。兼容模块验证范围与宿主版本，再用semver.satisfies且includePrerelease=true判断；不可验证与已比较不满足均不放行，但含义不同。缺少要求不等于已验证兼容，源码不会检查未声明的实际API契约。旧聚合迁移另把旧源映射到新包精确版本。这里是网关执行规则，不能据此断言官方RPC的每个内部检查都相同；官方writer仍属宿主职责。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:648-703](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L648-L703)

源过滤、清单差异及兼容候选。

<details>
<summary>查看原文（56行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:379-411](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L379-L411)

执行时重读并处理同版本失败重试与412。

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
    return { status: 200, kind: 'update', version: latest }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/core/version.ts:113-132](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/core/version.ts#L113-L132)

三层要求优先级含peer。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Read the declared DSH minimum from a published registry manifest:
 * `dsh.engines.dsh` first, top-level `engines.dsh` next, and
 * `peerDependencies["@deepseek-ai/dsh"]` last, which is where a package that
 * only declares the host as a peer still gets gated at boot.
 * Defensive against malformed or untrusted metadata: anything that is not a
 * non-empty string reads as absent.
 * @param manifest - the decoded registry version manifest.
 * @returns the declared minimum, or undefined when not declared.
 */
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

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/dsh-compat.ts:48-61](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/dsh-compat.ts#L48-L61)

实际范围和宿主校验及includePrerelease。

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

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:350-377](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L350-L377)

旧聚合迁移解析精确目标和要求。

<details>
<summary>查看原文（28行）</summary>

```text
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
      return { status: 200, kind: 'migrate', targetId: migration.to, targetVersion: targetManifest.version, targetSpec }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 批量更新由谁排序，如何表达部分完成？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

网关批量入口接受非空最多50个ID，验证并去重，逐项用planUpdate解析目标或拒绝原因，再交给updateAll。网关在自己的串行mutation队列里为每个可执行项建立子job，逐项等待；某项失败记error继续下一项，全部回答后父job统一done。因此done只代表批次结束，即使每行都失败也一样；应读取每行phase、landed和restartRequired。这个队列只序列化该网关的写入，不能当作跨进程或所有外部CLI的全局锁。

官方RPC模式没有批量端点，客户端在official.updateAll里顺序调用单项update并收集失败；网关模式才是一轮启动加一个job轮询。界面把applied行移出候选，失败行保留并展示原因，落地但需重启的行仍属applied，不是已经在当前进程生效。结果解析对不合法行选择丢弃，pending/running也不进入applied/failed，所以缺失或畸形结果不能被理解成请求集合已完整结算。

另有一个实际接线限制：工具条传入onRow以更新游标，但挂载者传的是face.updateAll；该函数只接收ids，继续调用official/gateway时也不传回调，两个实现均未调用onRow。当前源码不能兑现README所说的工具条逐行实时进度；它能读取最终逐行结果，不能因此否定批量更新本身。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:445-502](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L445-L502)

网关输入上限、去重、逐项计划和提交。

<details>
<summary>查看原文（58行）</summary>

```text
  /**
   * Apply every listed plugin update in one run.
   *
   * The official manager updates one bundle at a time and the CLI adds one spec
   * at a time, so the batch is this gateway's sequence over that single-plugin
   * primitive: one job, one mutation-lock slot, one poll, and one ledger of rows.
   * Each id is resolved here first, exactly as a single update is, and a row that
   * cannot be resolved is carried into the job as its own answer rather than
   * failing the request — one plugin already at its newest version must not stop
   * the eight behind it.
   */
  const updatesHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const body = (await readJsonBody(req, { maxBytes: 64 * 1024, objectOnly: true }) ?? {}) as Record<string, unknown>
    const listed = body['ids']
    if (!Array.isArray(listed) || listed.length === 0) {
      writeJson(res, 400, { error: 'plugin-manager: updates needs a non-empty ids array' })
      return
    }
    if (listed.length > MAX_BATCH_UPDATES) {
      writeJson(res, 400, { error: `plugin-manager: updates accepts at most ${String(MAX_BATCH_UPDATES)} ids` })
      return
    }
    const targets: string[] = []
    for (const value of listed) {
      if (typeof value !== 'string' || value.trim() === '') {
        writeJson(res, 400, { error: 'plugin-manager: updates needs string ids' })
        return
      }
      const target = value.trim()
      const unsafe = unsafeSpecReason(target)
      if (unsafe !== undefined) {
        writeJson(res, 400, { error: unsafe })
        return
      }
      if (!targets.includes(target)) targets.push(target)
    }
    if (!deps.cliAvailable() && !gateway.usesNativeWriter()) {
      writeJson(res, 500, { error: 'plugin-manager: dsh CLI not found on PATH' })
      return
    }
    const entries = await gateway.withMutationLock(async () => {
      const plan: GatewayUpdateEntry[] = []
      for (const target of targets) {
        const row = await planUpdate(target)
        if ('error' in row) plan.push({ kind: 'refused', id: target, error: row.error })
        else if (row.kind === 'migrate') {
          plan.push({
            kind: 'migrate',
            id: target,
            targetId: row.targetId,
            targetVersion: row.targetVersion,
            targetSpec: row.targetSpec,
          })
        } else plan.push({ kind: 'apply', id: target, version: row.version })
      }
      return plan
    })
    writeJson(res, 200, gateway.updateAll(entries))
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1457-1501](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1457-L1501)

串行子任务、失败继续及父done。

<details>
<summary>查看原文（45行）</summary>

```text
  updateAll(entries: readonly GatewayUpdateEntry[]): { jobId: string } {
    const job: GatewayJob = {
      id: `job-${++this.counter}`,
      action: 'update-all',
      spec: '',
      phase: 'running',
      results: entries.map(entry => {
        if (entry.kind === 'refused') return { id: entry.id, phase: 'error', error: entry.error }
        const unsafe = entry.kind === 'migrate'
          ? unsafeSpecReason(entry.id) ?? unsafeSpecReason(entry.targetId) ?? unsafeSpecReason(entry.targetSpec)
          : unsafeSpecReason(`${entry.id}@${entry.version}`)
        if (unsafe !== undefined) return { id: entry.id, phase: 'error', error: unsafe }
        const targetVersion = entry.kind === 'migrate' ? entry.targetVersion : entry.version
        return { id: entry.id, targetVersion, phase: 'pending' }
      }),
    }
    this.jobs.set(job.id, job)
    this.enqueue(async () => {
      const native = this.nativeManager()
      const results = job.results ?? []
      for (const [index, entry] of entries.entries()) {
        const row = results[index]
        if (row === undefined || row.phase === 'error' || entry.kind === 'refused') continue
        job.current = entry.id
        row.phase = 'running'
        const child = entry.kind === 'migrate'
          ? this.newMigrationJob(entry.id, entry.targetId, entry.targetVersion, entry.targetSpec)
          : this.newUpdateJob(entry.id, entry.version)
        this.jobs.set(child.id, child)
        if (entry.kind === 'migrate') await this.settleMigrationJob(child)
        else await this.settleUpdateJob(child, native)
        if (child.phase === 'done') {
          row.phase = 'done'
          row.landed = child.plugin?.version ?? (entry.kind === 'migrate' ? entry.targetVersion : entry.version)
          if (child.restartRequired !== undefined && child.restartRequired.length > 0) row.restartRequired = true
        } else {
          row.phase = 'error'
          row.error = child.error ?? 'plugin-manager: 更新失败'
        }
      }
      job.current = undefined
      job.phase = 'done'
      this.retainFinished(job.id)
    })
    return { jobId: job.id }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:193-213](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L193-L213)

官方通道仍客户端逐项。

<details>
<summary>查看原文（21行）</summary>

```text
    // One official update per id: this channel publishes no batch endpoint, and
    // its single call is the only writer it accepts. A refused row is collected
    // rather than thrown, so one plugin cannot discard the rest of the run.
    updateAll: async (ids: readonly string[]): Promise<PluginBatchUpdateResult> => {
      const applied: PluginUpdateOutcome[] = []
      const failed: PluginUpdateOutcome[] = []
      for (const id of ids) {
        try {
          const result = await official.update(id)
          applied.push({
            id,
            phase: 'done',
            landed: result.plugin.version,
            ...result.restartRequired.length > 0 ? { restartRequired: true } : {},
          })
        } catch (error) {
          failed.push({ id, phase: 'error', error: failureText(error) })
        }
      }
      return { applied, failed }
    },
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:286-300](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L286-L300)

网关批量启动、等待、解析。

<details>
<summary>查看原文（15行）</summary>

```text
    updateAll: async (ids: readonly string[]): Promise<PluginBatchUpdateResult> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/${UPDATES_ENDPOINT}`, {
          method: 'POST',
          body: JSON.stringify({ ids: [...ids] }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway updates returned no job')
        const job = await waitJob(started.jobId)
        return batchUpdateResult(parseUpdateOutcomes(job.results))
      } finally {
        gatewayInflight = false
      }
    },
    uninstall: async (id: string): Promise<InstalledPluginItem[]> => {
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/core/protocol.ts:377-408](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/core/protocol.ts#L377-L408)

宽容解析与两类最终结果。

<details>
<summary>查看原文（32行）</summary>

```text
export function parseUpdateOutcomes(value: unknown): PluginUpdateOutcome[] {
  if (!Array.isArray(value)) return []
  const rows: PluginUpdateOutcome[] = []
  for (const item of value) {
    if (!isRecord(item) || !isString(item.id) || item.id === '') continue
    const phase = item.phase
    if (phase !== 'pending' && phase !== 'running' && phase !== 'done' && phase !== 'error') continue
    const row: PluginUpdateOutcome = { id: item.id, phase }
    if (isString(item.targetVersion) && item.targetVersion !== '') row.targetVersion = item.targetVersion
    if (isString(item.landed) && item.landed !== '') row.landed = item.landed
    if (isString(item.error) && item.error !== '') row.error = item.error
    if (item.restartRequired === true) row.restartRequired = true
    rows.push(row)
  }
  return rows
}

/**
 * Split a finished batch's rows by outcome, the shape the toolbar renders.
 * A row still in flight is neither: it is simply not in either half.
 * @param rows - the rows the host reported.
 * @returns the applied and failed rows.
 */
export function batchUpdateResult(rows: readonly PluginUpdateOutcome[]): PluginBatchUpdateResult {
  const applied: PluginUpdateOutcome[] = []
  const failed: PluginUpdateOutcome[] = []
  for (const row of rows) {
    if (row.phase === 'done') applied.push(row)
    else if (row.phase === 'error') failed.push(row)
  }
  return { applied, failed }
}
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:171-201](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L171-L201)

工具条onRow和applied/failed/restart渲染状态。

<details>
<summary>查看原文（31行）</summary>

```text
  const onUpdateAll = (): void => {
    if (busyRef.current) return
    const queue = applicableUpdates(rows)
    if (queue.length === 0) return
    busyRef.current = true
    setPhase('updating')
    setError(undefined)
    setFailures([])
    void updateAll(queue.map(row => row.id), row => {
      setCursor({ name: row.id, index: row.index, total: row.total })
    }).then(result => {
      // Every landed row leaves the list, including the ones this process cannot
      // load yet: those are applied (and name their restart), not failures.
      const landed = new Set(result.applied.map(row => row.id))
      const restart = result.applied
        .filter(row => row.restartRequired === true)
        .map(row => ({ id: row.id, version: row.landed ?? '' }))
      setApplied(current => [...current, ...result.applied.map(row => row.id)])
      setRestartRequired(current => [...current, ...restart])
      // A refused row stays listed with the reason the host gave, so the run's
      // partial result is visible row by row instead of as one alert line.
      setFailures(result.failed.map(row => ({ id: row.id, error: row.error ?? t('updateFailedUnknown') })))
      setRows(current => current.filter(item => !landed.has(item.id)))
    }).catch(reason => {
      // The request itself failed (route refused, transport, no writer): nothing
      // ran, so the list stays exactly as it was and the alert explains why.
      setError(t('failed', { reason: messageOf(reason) }))
    }).finally(() => {
      setCursor(undefined)
      busyRef.current = false
      setPhase('idle')
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:394-399](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L394-L399)

face只转发ids不使用onRow。

```text
    updateAll: async ids => {
      const result = await ((await ensureMode()) === 'official' ? official.updateAll(ids) : gateway.updateAll(ids))
      // Only a landed row is a change a consumer has to react to; a run whose
      // every row was refused leaves the installed set exactly as it was.
      if (result.applied.length > 0) notifyChange()
      return result
```

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:464-475](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L464-L475)

实际工具条得到face.updateAll。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.effect(() => {
    try {
      return mountPluginListToolbar({
        props: () => ({
          isLoopback: face.isLoopback,
          checkUpdates: face.checkUpdates,
          update: face.update,
          updateAll: face.updateAll,
          restartPlan: face.restartPlan,
          restart: face.restart,
          t: ctx.locale.bind(NS),
        }),
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · CLI与应用内writer怎样判断落地、启动与恢复？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

网关只在facts.desktop=true且取得原生pluginManager时选应用内writer，否则用CLI。应用内更新实际调用updateBundle，不自行模拟完整删装；bundle-in-use只重试一次，第二次仍拒绝则提示重启。调用返回后先读拒绝结果，再核对依赖仍在及版本等于目标，保留restart-required，并尝试恢复bundle层位置、清理失效覆盖。真实替换和回退的原子性仍取决于宿主updateBundle，本包注释不是上游运行证据。

CLI路径先capture，再运行官方dsh plugin add。一般非零直接失败；仅识别到ignored-builds输出时容忍非零并继续核对盘面。新装会检查新依赖、bundle选择、重复ID和不可解析insert，再做dump-config预检；更新核对目标依赖、精确版本和原本选择，并做组合预检及孤儿覆盖清理。dump-config只是配置组合检查，不执行每个插件完整业务任务。更新预检失败可能目标版本已经写入；verifyBoot找不到新依赖时直接记错，不保证自动退到原版本。

旧聚合迁移走专用CLI流程：读原spec和层位置、移除旧包、安装目标、核对选择与精确版本、恢复位置并预检，相关失败尝试rollbackMigration。不能把“迁移有补偿”扩大成批次原子或外部安装脚本副作用已撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1084-1106](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1084-L1106)

只有应用拥有profile选择原生writer。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * The official in-process manager to write through, or undefined when the CLI
   * is the writer. Only an application-owned profile (a packaged Desktop launch)
   * takes this path: there the CLI refuses the profile outright, while the
   * official manager — which the launcher configures with its bundled
   * package-manager invocation — owns the same files this gateway reads. On
   * every other runtime the CLI stays the single writer, exactly as before.
   * @returns the manager, or undefined when the CLI should run.
   */
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

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1616-1667](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1616-L1667)

原生updateBundle、拒绝和落地后验。

<details>
<summary>查看原文（52行）</summary>

```text
  private async runNativeUpdate(job: GatewayJob, native: NativePluginManager): Promise<void> {
    const targetId = job.targetId
    const targetVersion = job.targetVersion
    if (targetId === undefined || targetVersion === undefined) {
      job.phase = 'error'
      job.error = 'plugin-manager: update job is missing the target id or version'
      return
    }
    const updateBundle = native.updateBundle?.bind(native)
    if (updateBundle === undefined) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器没有提供 updateBundle（需要 DSH >= 0.2.2-rc.1），无法在该 profile 上更新 ${targetId}`
      return
    }
    const before = await this.capture()
    const carried = await readProfileManifest(this.facts.packageJsonPath)
    const previousSpec = carried.dependencies[targetId]
    // Read while the bundle is still listed: the official removal is what drops it.
    const index = await this.bundleIndexOf(targetId)
    const attempt = await this.applyNativeUpdate(updateBundle, targetId, targetVersion, job.id)
    const refusal = nativeUpdateFailure(attempt.outcome)
    if (refusal !== undefined) {
      // A refused removal can leave the bundle deselected on disk; put the
      // profile back the way it was found before reporting the refusal.
      if (await this.bundleSelectionLost(targetId)) await this.restoreBundleSelection(native, targetId)
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器更新失败：${refusal}${attempt.remedy}${nativeUpdateRestoreNote(attempt.outcome)}`
      return
    }
    const after = await this.capture()
    if (!after.dependencies.includes(targetId)) {
      job.phase = 'error'
      job.error = 'plugin-manager: 官方插件管理器报告成功，但目标插件未保留在 profile 中（更新未生效）'
      return
    }
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
    if (updated.version !== targetVersion) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
      return
    }
    // Landing is not the same as being loadable in this process: the official
    // manager answers `restart-required` when its removal applied while the rows
    // were already gone, and that is a fact to carry, never a failure.
    if (nativeUpdateRestartRequired(attempt.outcome)) job.restartRequired = [targetId]
    if (previousSpec !== undefined) await this.restoreBundleIndex(targetId, previousSpec, index)
    // An application-owned profile composes through the same read-only probe,
    // so orphaned overrides are pruned here too; a runtime that cannot compose
    // leaves the patch file exactly as it is (see {@link pruneOrphanOverrides}).
    if (await this.pruneOrphanOverrides(job) === undefined) return
    job.plugin = updated
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1694-1707](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1694-L1707)

bundle-in-use最多重试一次。

<details>
<summary>查看原文（14行）</summary>

```text
  private async applyNativeUpdate(
    updateBundle: NonNullable<NativePluginManager['updateBundle']>,
    targetId: string,
    targetVersion: string,
    requestId: string,
  ): Promise<{ outcome: unknown, remedy: string }> {
    const first = await updateBundle(targetId, targetVersion, { requestId })
    if (nativeUpdateRefusalCode(first) !== 'bundle-in-use') return { outcome: first, remedy: '' }
    const second = await updateBundle(targetId, targetVersion, { requestId })
    if (nativeUpdateRefusalCode(second) !== 'bundle-in-use') return { outcome: second, remedy: '' }
    return {
      outcome: second,
      remedy: '；该插件仍由当前 DSH 进程加载，重启 DSH 后再执行本次更新即可',
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2013-2038](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L2013-L2038)

CLI退出与容忍条件。

<details>
<summary>查看原文（26行）</summary>

```text
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
    // duplicate-mount strip below removes any of its entries back out: that
    // strip is this gateway's correction, not evidence of what the run landed.
    const reconciledBundles = after.bundles
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2051-2115](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L2051-L2115)

安装与更新不同后验。

<details>
<summary>查看原文（65行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2585-2614](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L2585-L2614)

预检失败与选择性回退，不是全更新回滚。

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

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1193-1257](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1193-L1257)

迁移目标后验、层位置、预检和补偿。

<details>
<summary>查看原文（65行）</summary>

```text
      after = await this.capture()
    }
    if (!after.dependencies.includes(targetId)) {
      const rolledBack = await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      if (rolledBack) {
        job.error = tolerated === undefined
          ? `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 未出现在 profile 中`
          : `plugin-manager: 迁移安装 ${targetSpec} 失败${tolerated.output === '' ? '' : `：\n${tolerated.output}`}`
      }
      return
    }
    // The migration's install step is the same pnpm call and the same
    // reconcile, so a target it wrote without selecting mounts nothing.
    if (shouldAddTarget && await this.bundleSelectionMissing(
      targetId,
      after.bundles,
      !targetPreviouslyInstalled || before.bundles.includes(targetId),
    )) {
      if (await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)) {
        job.error = this.halfMountError(targetId, '迁移安装只写入了依赖，', tolerated)
      }
      return
    }
    const stripped = await this.stripDuplicateMounts(job, before, after)
    if (stripped === undefined) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      return
    }
    if (stripped.length > 0) {
      job.notices = stripped.map(name => ({ id: name, name, from: 'enabled', to: 'uninstalled' }))
      after = await this.capture()
    }
    if (oldIndex >= 0) await reorderProfileBundle(this.facts.packageJsonPath, targetId, oldIndex)
    after = await this.capture()

    const verify = await this.runCli(
      binary,
      ['--profile', this.facts.profileName, '--dump-config'],
      90_000,
    )
    if (verify.code !== 0) {
      if (await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)) {
        job.error = `plugin-manager: 迁移后的启动预检失败${verify.output === '' ? '' : `：\n${verify.output}`}`
      }
      return
    }
    // The migration replaces the row-id universe the same way an update does:
    // an override for a row only the retired aggregate declared is an orphan
    // from here on.
    if (await this.pruneOrphanOverrides(job, verify.output) === undefined) return
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(
      this.facts,
      targetId,
      manifest.dependencies[targetId] ?? targetSpec,
      after.layer.rows,
    )
    // A local repository link is the developer checkout source: its version is
    // whatever the checked-out tree contains, not the registry release, so the
    // exact-version gate applies only to npm registry migrations.
    if (!/^(?:link:|file:)/.test(targetSpec) && updated.version !== targetVersion) {
      if (await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)) {
        job.error = `plugin-manager: 迁移后 ${targetId} 版本为 ${updated.version}，预期 ${targetVersion}`
      }
      return
```

</details>

#### 缺口

- 宿主updateBundle在取消、进程中断与原生恢复时的实际结果未验证
  **影响**：不能把应用内单项结果或代码注释当作跨故障原子保证
  **进一步探讨**：在固定宿主的可重建profile对拒绝、取消和重启分别回读依赖、版本、层位置与实际加载。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 开关、内置搜索和分页会改变什么状态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

内置列表先从当前已读的默认/全部集合取rows，搜索匹配本地化标题、模块包、entryId和拥有者，再按每页20项切片；重名计数在完整过滤结果里计算，避免分页隐藏另一条同名行。搜索、展开和分页改变的是本地视图，不重装包，也不改变启用状态。

真正的开关先检查官方manager与row.write可写，使用setPluginEnabled(entryId,next)，失败返回原因；成功后重新读取Loader集合。restart-required和被上层覆盖分别展示，不能把开关点击或写盘成功当作运行状态已改变。只读条件由宿主返回而非插件擅自绕过。网关的启停是另一条路径：按包或聚合行找到真实entry，串行写disabled覆盖；保护管理界面所需行，写入通过脱离HMR上下文的异步资源再原子替换并等待结果。两类路径都需核对实际profile层与加载状态，不能把搜索过滤后的条目数当运行模块总数。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx:265-301](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx#L265-L301)

搜索、20项分页和过滤全集重名处理。

<details>
<summary>查看原文（37行）</summary>

```text
  const ready = state.kind === 'ready' ? state : undefined
  const rows = ready === undefined ? [] : scope === 'all' ? ready.allRows : ready.rows
  /** Rows the default scope leaves out: what the scope control would add. */
  const ownedCount = ready === undefined ? 0 : ready.allRows.length - ready.rows.length
  const presets = ready === undefined ? [] : ready.presets
  const normalizedQuery = query.trim().toLowerCase()
  const filteredRows = normalizedQuery === ''
    ? rows
    : rows.filter(row => [
      rowTitle(row, resolveText),
      row.moduleName,
      row.entryId,
      row.ownedBy ?? '',
    ].some(text => text.toLowerCase().includes(normalizedQuery)))
  const pageCount = Math.max(1, Math.ceil(filteredRows.length / BUILTIN_PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const pageStart = (currentPage - 1) * BUILTIN_PAGE_SIZE
  const visibleRows = filteredRows.slice(pageStart, pageStart + BUILTIN_PAGE_SIZE)

  /**
   * The visible label of each row: its name, and the line under it — the module, or
   * the entry id when the name already is that module. Two rows carrying the same
   * pair read identically, which is the only case where the row has to say which
   * entry it is; a title two rows share is exactly that case, and so is a module
   * several rows name. Counted over the filtered result, so paging cannot hide
   * the other half of a collision; each scope still answers for itself.
   */
  const labels = new Map<string, string>()
  const labelCounts = new Map<string, number>()
  for (const row of filteredRows) {
    const title = rowTitle(row, resolveText)
    const label = `${title}\u0000${title === row.moduleName ? row.entryId : row.moduleName}`
    labels.set(row.entryId, label)
    labelCounts.set(label, (labelCounts.get(label) ?? 0) + 1)
  }
  /** Whether this row's visible labels are shared with another row on screen. */
  const collides = (entryId: string): boolean => (labelCounts.get(labels.get(entryId) ?? '') ?? 0) > 1
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx:303-344](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/BuiltinPlugins.tsx#L303-L344)

真实toggle调用官方manager及回读。

<details>
<summary>查看原文（42行）</summary>

```text
  /**
   * Ask the official manager to enable or disable one row, then re-read. The
   * switch moves first and comes back on a refusal, so what it shows afterwards
   * is the answer this deployment gave rather than the click that produced it.
   */
  const toggle = (row: BuiltinRow, next: boolean): void => {
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
    })()
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:553-586](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L553-L586)

网关查真实行、聚合行与保护行。

<details>
<summary>查看原文（34行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:588-615](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L588-L615)

脱离HMR上下文写入并回读。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 本机围栏、超时和重启分别保证到哪一步？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

网关guard要求socket和Host回环，拒绝可识别代理与cross-site；没有Origin的合格本机请求允许通过。因此其信任边界是本机进程，不是每位用户独立身份。外部代理若抹去身份并伪装回环，不能指望本包自动辨认；界面isLoopback也不是替代服务端围栏的安全凭据。

客户端waitJob遇job丢失、error或等待截止会抛错，没有在截止分支取消host job。服务端的CLI超时只向记录的child发送kill，再等close；不证明全部子进程树、安装脚本或此前写入已回滚。job表在内存且完结后按上限淘汰，因此失联和重启后须回读盘面，不把界面catch分支注释“nothing ran”当事实。批次可能已有若干项落地，直接重试会混淆状态。

重启先GET读取计划再POST执行，桌面只有壳明确支持才选择shell，否则manual；用户systemd、交互CLI与受监管启动各有分支。显示restart-required表示落地但当前加载待变，不能承诺点重启后所有包即已验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/loopback.ts:72-92](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/loopback.ts#L72-L92)

无Origin合格本地请求可通过。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:274-286](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/routes.ts#L274-L286)

服务端guard实际围栏。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:233-244](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L233-L244)

等待截止没有cancel。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:663-677](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L663-L677)

超时向child发kill并等待退出。

<details>
<summary>查看原文（15行）</summary>

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

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1070-1076](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1070-L1076)

内存任务的完结淘汰。

```text
  /** Register a settled job and evict the oldest finished one beyond the ring cap. */
  private retainFinished(jobId: string): void {
    this.finishedOrder.push(jobId)
    while (this.finishedOrder.length > MAX_FINISHED_JOBS) {
      const evicted = this.finishedOrder.shift()
      if (evicted !== undefined) this.jobs.delete(evicted)
    }
```

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:236-259](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/restart.ts#L236-L259)

重启根据启动环境选择，含manual。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:325-331](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L325-L331)

先读计划、再POST重启。

```text
    // Restart has no official-channel counterpart, so this route is the one
    // call that is always the gateway's, whichever mode the face runs in. The
    // GET-shaped call is the plan read: no state changes, no process exits.
    restartPlan: async (): Promise<RestartPlanWire> =>
      parseRestartPlan(await gatewayJson(`${GATEWAY_PREFIX}/${RESTART_ENDPOINT}`)),
    restart: async (): Promise<RestartMode> =>
      parseRestartMode(await gatewayJson(`${GATEWAY_PREFIX}/${RESTART_ENDPOINT}`, { method: 'POST' })),
```

#### 缺口

- 传输中断后、子进程树及不同重启器的实际收尾未知
  **影响**：不能凭失败提示断言未写入或已完整恢复
  **进一步探讨**：在隔离profile阻断轮询并回读host job、包版本与子进程，恢复前先对账。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 怎样计一次合格维护任务的成本并决定试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合能限制网关为本机使用、确实维护一组社区包并保留profile备份的操作者。先固定一个可更新包和一个会被拒绝的包，记录当前版本、目标、有效profile和启用行，执行后逐行核对applied/failed，必要时重启，再检查代表能力。这个任务单位包含拒绝项、重启和失败恢复，不只计成功按钮次数。

与原生管理或手工CLI同一目标比较，首次计安装与profile确认，持续计注册表查询、逐行结果复核及重启，失败计对账、重新安装和配置恢复。现金、下载资源与人工分钟分别记录，没有实测就不输出节省百分比。当前源码支持可控试用，但没有证据支持持续安装推荐。

若出现轮询超时、结果缺行、目标版本不符或重启后功能不可用，先停止新批次并用本机管理和备份恢复；不要让“批次done”或可重试按钮遮住已部分落地。只需偶尔更新一个包时，原生路径可能更省解释与维护成本。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1488-1499](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L1488-L1499)

批次以逐行结果表达部分完成。

<details>
<summary>查看原文（12行）</summary>

```text
        if (child.phase === 'done') {
          row.phase = 'done'
          row.landed = child.plugin?.version ?? (entry.kind === 'migrate' ? entry.targetVersion : entry.version)
          if (child.restartRequired !== undefined && child.restartRequired.length > 0) row.restartRequired = true
        } else {
          row.phase = 'error'
          row.error = child.error ?? 'plugin-manager: 更新失败'
        }
      }
      job.current = undefined
      job.phase = 'done'
      this.retainFinished(job.id)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:179-201](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L179-L201)

落地、失败、重启与整请求失败分开。

<details>
<summary>查看原文（23行）</summary>

```text
    void updateAll(queue.map(row => row.id), row => {
      setCursor({ name: row.id, index: row.index, total: row.total })
    }).then(result => {
      // Every landed row leaves the list, including the ones this process cannot
      // load yet: those are applied (and name their restart), not failures.
      const landed = new Set(result.applied.map(row => row.id))
      const restart = result.applied
        .filter(row => row.restartRequired === true)
        .map(row => ({ id: row.id, version: row.landed ?? '' }))
      setApplied(current => [...current, ...result.applied.map(row => row.id)])
      setRestartRequired(current => [...current, ...restart])
      // A refused row stays listed with the reason the host gave, so the run's
      // partial result is visible row by row instead of as one alert line.
      setFailures(result.failed.map(row => ({ id: row.id, error: row.error ?? t('updateFailedUnknown') })))
      setRows(current => current.filter(item => !landed.has(item.id)))
    }).catch(reason => {
      // The request itself failed (route refused, transport, no writer): nothing
      // ran, so the list stays exactly as it was and the alert explains why.
      setError(t('failed', { reason: messageOf(reason) }))
    }).finally(() => {
      setCursor(undefined)
      busyRef.current = false
      setPhase('idle')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2085-2115](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/gateway.ts#L2085-L2115)

CLI更新后的精确版本和选择核查。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:236-259](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/host/restart.ts#L236-L259)

恢复与重启有环境条件。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

#### 缺口

- 同等维护任务的成功率、人工用时和恢复成本未测
  **影响**：不能证明集中页比原生管理有净收益
  **进一步探讨**：对同一组固定包分别用本插件和原生路径完成，计入拒绝、重启及对账，保留失败样本。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 哪种逐行结果回执值得进一步验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可研究的假设是，在批次完成或客户端失联后，按原始请求集合显示每行“未开始、执行中、落地待重启、失败、结果未知”并可回读，能减少盲目重试和漏验。现有协议已有分项结果，但宽容解析会丢弃畸形行，客户端不核对请求集合覆盖，实时游标回调也没有接到真实face，构成该假设的直接动机。这不是插件已经具备的恢复保证。

最小试验固定三个包和一种writer，包含兼容拒绝、成功但待重启及执行中断，分别用现有界面与持久结果回执恢复。观察是否把所有请求归类、重复更新次数、错误宣告成功次数与人工恢复分钟。若没有host持久记录，页面必须写未知并引导回读profile；不能由缺行推断失败或成功。若额外回执不能减少对账时间，或者造成对盘面状态的错误信心，就否定方案。试用仍按Q07单个可重建profile开始，不能由此升级推荐。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/core/protocol.ts:377-408](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/core/protocol.ts#L377-L408)

解析丢无效行且只分done/error。

<details>
<summary>查看原文（32行）</summary>

```text
export function parseUpdateOutcomes(value: unknown): PluginUpdateOutcome[] {
  if (!Array.isArray(value)) return []
  const rows: PluginUpdateOutcome[] = []
  for (const item of value) {
    if (!isRecord(item) || !isString(item.id) || item.id === '') continue
    const phase = item.phase
    if (phase !== 'pending' && phase !== 'running' && phase !== 'done' && phase !== 'error') continue
    const row: PluginUpdateOutcome = { id: item.id, phase }
    if (isString(item.targetVersion) && item.targetVersion !== '') row.targetVersion = item.targetVersion
    if (isString(item.landed) && item.landed !== '') row.landed = item.landed
    if (isString(item.error) && item.error !== '') row.error = item.error
    if (item.restartRequired === true) row.restartRequired = true
    rows.push(row)
  }
  return rows
}

/**
 * Split a finished batch's rows by outcome, the shape the toolbar renders.
 * A row still in flight is neither: it is simply not in either half.
 * @param rows - the rows the host reported.
 * @returns the applied and failed rows.
 */
export function batchUpdateResult(rows: readonly PluginUpdateOutcome[]): PluginBatchUpdateResult {
  const applied: PluginUpdateOutcome[] = []
  const failed: PluginUpdateOutcome[] = []
  for (const row of rows) {
    if (row.phase === 'done') applied.push(row)
    else if (row.phase === 'error') failed.push(row)
  }
  return { applied, failed }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:233-244](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L233-L244)

失联或超时没有取消回执。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:179-201](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L179-L201)

界面期望进度和分项结果。

<details>
<summary>查看原文（23行）</summary>

```text
    void updateAll(queue.map(row => row.id), row => {
      setCursor({ name: row.id, index: row.index, total: row.total })
    }).then(result => {
      // Every landed row leaves the list, including the ones this process cannot
      // load yet: those are applied (and name their restart), not failures.
      const landed = new Set(result.applied.map(row => row.id))
      const restart = result.applied
        .filter(row => row.restartRequired === true)
        .map(row => ({ id: row.id, version: row.landed ?? '' }))
      setApplied(current => [...current, ...result.applied.map(row => row.id)])
      setRestartRequired(current => [...current, ...restart])
      // A refused row stays listed with the reason the host gave, so the run's
      // partial result is visible row by row instead of as one alert line.
      setFailures(result.failed.map(row => ({ id: row.id, error: row.error ?? t('updateFailedUnknown') })))
      setRows(current => current.filter(item => !landed.has(item.id)))
    }).catch(reason => {
      // The request itself failed (route refused, transport, no writer): nothing
      // ran, so the list stays exactly as it was and the alert explains why.
      setError(t('failed', { reason: messageOf(reason) }))
    }).finally(() => {
      setCursor(undefined)
      busyRef.current = false
      setPhase('idle')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:394-399](https://github.com/zhu1090093659/dsh-web/blob/5d4bf78e319393ac20d9f5acecc7a0e43f970bee/packages/dsh-plugin-manager/src/client/index.ts#L394-L399)

face未传递实时游标回调。

```text
    updateAll: async ids => {
      const result = await ((await ensureMode()) === 'official' ? official.updateAll(ids) : gateway.updateAll(ids))
      // Only a landed row is a change a consumer has to react to; a run whose
      // every row was refused leaves the installed set exactly as it was.
      if (result.applied.length > 0) notifyChange()
      return result
```

#### 缺口

- 持久逐行回执能否可靠关联盘面与运行状态尚未实现验证
  **影响**：不能宣称解决中断恢复或减少重试
  **进一步探讨**：先比较固定三包失败集的对账完整性与人工用时，缺状态必须保留unknown。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
