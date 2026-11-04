# Matt Skills Deck

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[72e2834](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/tree/72e2834254644a71d33ecbf80661c5c2574076c4)

<!-- BEGIN META -->
[![GitHub ★ 285](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=285&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)
<!-- END META -->

> **功能**：在 DSH 中提供内置工程 Skill、工作区任务面板和工单交接，支持不同 Tracker 后端。

> **亮点**：将工作区选择、票详情与会话交接组织为同一个宿主入口。权限和后端能力仍按具体 Tracker 返回。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：统一界面不能把所有后端的操作和权限视为相同。GitHub 权限未知时还要回到原 Tracker 核对，写入不会因卸载自动撤销。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 面板把哪些原本分离的工作接进会话？](#detail-section-11)
  - [Q02 · 不同 Tracker 的统一入口能否保证相同权限与动作？](#detail-section-12)
  - [Q03 · 怎样控制安装、数据变更和退出的负担？](#detail-section-13)
  - [Q04 · 面板交接是否减少漏上下文和重复认领？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 里接续工单的开发者可从当前工作区浏览票和详情，并从会话交接入口继续处理。

对照在 Tracker 原生页面查看后手工复制票号和上下文到 DSH。只有少量任务或已有可靠交接脚本时，额外面板的价值有限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 侧栏面板 | 浏览任务与上下文 | 依赖 slots 和活动工作区 |
| 票详情与交接 | 从工单进入会话 | 需确认后端权限和引用 |
| 权限读取 | 显示可读写边界 | GitHub 数据来自本机 gh |

**流程与依赖**

| 依赖 | 用途 | 限制 |
| --- | --- | --- |
| DSH Profile 和 slots | 挂载 Host 与侧栏 | 版本与真机需要回读 |
| subprocess 与 timer | Host 引导和后台处理 | 未就绪时可能延后 |
| GitHub gh 账号 | 票和权限读取 | 写入要独立授权 |

| 步骤 | 操作 | 退出 |
| --- | --- | --- |
| 隔离 | 新 Profile 绑定一个测试工作区 | 发现错误 Profile 就停止 |
| 只读试用 | 选票并核对会话引用 | 无法回源则改用原 Tracker |
| 退回 | 移除并回读挂载 | 独立核对已有数据 |

**效果与成本**

| 阶段 | 负担 | 计量 |
| --- | --- | --- |
| 首次 | 配置工作区和账号 | 搭建时间未测 |
| 持续 | 刷新和核对工单状态 | 按工单记人时 |
| 恢复 | 退回原 Tracker | 核对会话和工单副作用 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 从同一工作区接票 | 会话引用与原票匹配 | 宿主路径未跑 |
| 保留权限未知 | 读失败不会伪装成功 | 实际账号矩阵未查 |

> **思考**：统一界面不能把所有后端的操作和权限视为相同。GitHub 权限未知时还要回到原 Tracker 核对，写入不会因卸载自动撤销。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将工作区选择、票详情与会话交接组织为同一个宿主入口。权限和后端能力仍按具体 Tracker 返回。见 [Q01](#research-q01)、[Q02](#research-q02)。

挂载拆分 Host 与 Agent 工具行。GitHub 权限读取用批内共享承诺，对缺字段与失败保留未知。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一界面不能把所有后端的操作和权限视为相同。GitHub 权限未知时还要回到原 Tracker 核对，写入不会因卸载自动撤销。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用隔离 Profile 和只读测试仓库验证一个工单交接，发现引用或权限不一致就回到原 Tracker。见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核对固定接线、GitHub 权限读取及部分分发条件。多后端兼容、真实接续与收益尚待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package/package.json、package/cordis.patch.yml、src/client/index.ts、src/host/index.ts、docs/adr/20261014-tracker-capability-ceiling.md、src/tracker/rooms/github/read/repo-permissions.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查根及分发清单、双挂载、Client/Host 入口和 GitHub 权限读取；未审计整个 Tracker、版本管理原型或全部 Skills。
- 下一步：在隔离环境确认面板、真实工单及只读权限后，再对比两种交接路径。未执行安装或测试。

**分析版本**

- **仓库**：[FeatherHunter/dsh-mattpocock-skills-deck](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck)
- **版本号**：1.9.0-beta.34（[固定提交 72e2834](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/tree/72e2834254644a71d33ecbf80661c5c2574076c4)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以同一组工单比较手工复制与面板交接，检验是否减少遗漏或重复认领，并同时记录人工排障。见 [Q04](#research-q04)。

在隔离环境确认面板、真实工单及只读权限后，再对比两种交接路径。未执行安装或测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 918 | 201748 | 140167 | 52858 | — |
| .md | source | 609 | 100000 | — | — | 2599131 |
| .mts | source | 75 | 23590 | 16816 | 5612 | — |
| .js | source | 6 | 18220 | 17934 | 251 | — |
| .mjs | source | 6 | 712 | 523 | 156 | — |
| .ts | example | 12 | 1437 | 1148 | 211 | — |
| .md | example | 11 | 353 | — | — | 3389 |
| .ts | test | 603 | 188669 | 147280 | 31418 | — |
| .js | example | 3 | 21 | 10 | 11 | — |
| .mts | example | 3 | 763 | 651 | 52 | — |
| .md | test | 4 | 375 | — | — | 4371 |
| .mts | test | 1 | 174 | 114 | 45 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Matt Skills Deck 在固定版本中如何把任务跟踪与会话交接带入 DSH，试用者需要核查哪些状态与权限？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面板把哪些原本分离的工作接进会话？

**研究主题**：场景与需求、功能与机制、工程质量与复用

#### 完整回答

对在 DSH 中跟进多个工单的开发者，目标是从工作区选择下一张可处理的票，并把上下文交给会话。README 展示探索地图、实施地图和普通 issue 的侧栏入口，说明可注入提示。包导出 Host、Client 和独立 tools 行，patch 同时插入宿主与工具条目。客户端在 slots 缺失时提前返回，Host 通过统一通道注册工作区选择、标签、票详情、评论和交接。相较从 GitHub 页面复制票号再手动开会话，用户可在同一个工作区把选票与交接放到相邻操作。源码中的注册只支持接线结论，不能推出全部卡片在任一宿主生效，或并发开发效率提升。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-49](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/README.md#L40-L49)

面板与上下文注入的自述

<details>
<summary>查看原文（10行）</summary>

```text
<h2 align="center"><sub>BOARD</sub><br>任务板</h2>

<div align="center">

DSH侧边栏-总览任务面板全貌。通过插件内置SKILLS的任务拆分，可以做到session并发处理。效率加倍省心。

<table width="100%">
  <tr>
    <td valign="top" width="50%">👇 列表中展示：探索地图、实施地图、普通ISSUE。并且提供便捷按钮一键注入prompt。<br><img src="assets/readme/中文-深色-右侧面板-列表-列表.png" width="100%" alt="任务板列表：可接阻塞已关闭归位" style="border:1px solid #30363d;border-radius:6px"></td>
    <td valign="top" width="50%">👇 实战案例：任务经过拆分，可以大量同时执行任务。<br><img src="assets/readme/中文-深色-工作区-多ISSUE并发.png" width="100%" alt="多工作区多会话并发" style="border:1px solid #30363d;border-radius:6px"></td>
```

</details>

**依据 2 · 源码核查**：[package/package.json:9-22](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/package/package.json#L9-L22)

独立 Host、Client 和 tools 导出

<details>
<summary>查看原文（14行）</summary>

```text
  "engines": {
    "dsh": ">=0.2.0-rc.2"
  },
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "prepublishOnly": "node ../scripts/build.mts --pkg-only"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./tools": "./deck/registration/agent-row.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 3 · 源码核查**：[package/cordis.patch.yml:8-14](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/package/cordis.patch.yml#L8-L14)

插件与工具行一起挂载

```text
- insert:
    - id: dsh-mattpocock-skills-deck
      name: 'dsh-mattpocock-skills-deck'
      config: {}
    - id: dsh-mattpocock-skills-deck-tools
      name: 'dsh-mattpocock-skills-deck/tools'
      config: {}
```

**依据 4 · 源码核查**：[src/client/index.ts:94-108](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/client/index.ts#L94-L108)

Client 对 slots 和构建信息的依赖

<details>
<summary>查看原文（15行）</summary>

```text
export default {
  apply(ctx: any) {
    const slots = ctx.get('slots')
    if (slots === undefined) return
    // ==== leaf:hostShim (spliced by build) ====
    // ==== shared:timeConfig (spliced by build) ==== // #1215：中央时间参数先于闭包里所有读者声明（const 有暂时性死区）
    // ==== kernel:portal (spliced by build) ====
    // v1.3.3：面板版本号（tabs 行最右侧显示，便于核对已更新）
    const DSW_VERSION = __DSW_VERSION__
    // #repo-link：版本号可点，新窗打开插件仓库主页；URL 构建期从 package/package.json 的 repository 字段
    // 注入（客户端源码零 URL 字面量，过硬编码门禁 F2；产物字面量已在门禁 RE_LICENSED 登记）。
    const DSW_REPO_URL = __DSW_REPO_URL__
    // #1766：构建提交。取不到 git 提交的构建（例如从没有 .git 的源码包直接构建）写 'unknown'，
    //   任何情况下都不要把它当成候选身份——真机验证冻结候选时会要求它是 40 位提交号。
    const DSW_BUILD_COMMIT = __DSW_BUILD_COMMIT__
```

</details>

**依据 5 · 源码核查**：[src/host/index.ts:295-306](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L295-L306)

工作区、标签、详情与评论 handlers

<details>
<summary>查看原文（12行）</summary>

```text
    async function normCwd(...args: any[]): Promise<any> { const h = await _workspace(); return h.normCwd.apply(h, args) }
    harness.handle('wf.bind', async function () { const h = await _workspace(); return h.handleBind.apply(h, arguments) })
    harness.handle('wf.bindings', async function () { const h = await _workspace(); return h.handleBindings.apply(h, arguments) })
    harness.handle('wf.registry', async function () { const h = await _workspace(); return h.handleRegistry.apply(h, arguments) })
    harness.handle('wf.selection', async function () { const h = await _workspace(); return h.handleSelection.apply(h, arguments) })
    harness.handle('wf.setupLayout', async function (args: WfArgs) { const h = await _workspace(); return h.handleSetupLayout(args) }) // #683（F1 · ADR 的 R6）：布局答案按工作区记（H 与 C 各一份），卡片确认同时写两处。
    // #627 标签配色两条电话：端点名与契约操作名一致（listLabels / setLabelColors）， 界面经客户端到宿主那条既有接口（/api/dsws 通道按端点名分发）就能调到它们。
    harness.handle('wf.listLabels', async function (args: WfArgs) { const h = await _workspace(); return h.handleListLabels(args) })
    harness.handle('wf.setLabelColors', async function (args: WfArgs) { const h = await _workspace(); return h.handleSetLabelColors(args) })
    harness.handle('wf.issueDetail', async function () { const h = await _comments(); return h.handleIssueDetail.apply(h, arguments) })
    harness.handle('wf.issueComments', async function () { const h = await _comments(); return h.handleIssueComments.apply(h, arguments) })
    harness.handle('wf.commentIssue', async function () { const h = await _comments(); return h.handleCommentIssue.apply(h, arguments) })
```

</details>

**依据 6 · 源码核查**：[src/host/index.ts:309-324](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L309-L324)

交接和会话命名处理入口

<details>
<summary>查看原文（16行）</summary>

```text
    // ---- H6 #450 接线：5 新文件动态 import 加载（D7 禁止静态 import），依赖全显式传入；新文件之间不互引用 ---- 第 5 件 ticketGrouping 为压线追加（用户定夺）：computeLevels/groupTickets 纯函数搬出，H2/H4 loader 取值后转供给。 这一组的拆分缘由见账本 §7。
    let _handoffP: Promise<any> | null = null
    function _handoff(): Promise<any> { if (!_handoffP) _handoffP = (async function(){ const mod = await import('./handoffClaim.js'); return mod.createHandoffClaim({ fs: fs, DEFAULT_CWD: DEFAULT_CWD, normCwd: function(...args: any[]){ return normCwd.apply(null, args) }, setCache: setCache, logCtx: logCtx, openSession: openSessionFor }) })(); return _handoffP }
    let _namingP: Promise<any> | null = null
    function _naming(): Promise<any> { if (!_namingP) _namingP = (async function(){ const mod = await import('./namingGuardian.js'); return mod.createNamingGuardian({ fs: fs, timer: timer, DEFAULT_CWD: DEFAULT_CWD, getCacheDir: function(...args: any[]){ return getCacheDir.apply(null, args) }, getPlatform: function(...args: any[]){ return getPlatform.apply(null, args) }, getRepoKey: function(...args: any[]){ return getRepoKey.apply(null, args) }, logCtx: logCtx, openSession: openSessionFor, getFirstText: function (sid: string) { try { return _refreshWiringP!.then(function (w: any) { try { return w.firstTextOf(sid) } catch (eW) { return null } }).catch(function () { return null }) } catch (eG) { return Promise.resolve(null) } }, getTitleFact: function (sid: string) { try { return _refreshWiringP!.then(function (w: any) { try { return w.titleFactOf(sid) } catch (eW) { return null } }).catch(function () { return null }) } catch (eG) { return Promise.resolve(null) } } }) })(); return _namingP }
    let _publishP: Promise<any> | null = null
    function _publish(): Promise<any> { if (!_publishP) _publishP = (async function(){ const mod = await import('./publishFlow.js'); const builtinsMod = await import('../tracker/registry/builtins.js'); const ghExtras = await builtinsMod.loadGithubHostExtras(); return mod.createPublishFlow({ DEFAULT_CWD: DEFAULT_CWD, resolveGit: function(...args: any[]){ return resolveGit.apply(null, args) }, execProc: function(...args: any[]){ return execProc.apply(null, args) }, canonicalKey: function(...args: any[]){ return canonicalKey.apply(null, args) }, repoKeys: repoKeys, repoRoots: repoRoots, setCache: setCache, logCtx: logCtx, openSession: openSessionFor, makeCreateErrorClassifier: ghExtras.makeCreateErrorClassifier as unknown as (deps: { isOwnership: (text: string) => boolean }) => (errText: unknown, kind?: unknown) => string, KIND_UNKNOWN: ghExtras.KIND_UNKNOWN }) })(); return _publishP }
    let _pickerP: Promise<any> | null = null
    function _picker(): Promise<any> { if (!_pickerP) _pickerP = (async function(){ const mod = await import('./pickerShell.js'); return mod.createPickerShell({ DEFAULT_CWD: DEFAULT_CWD, getPlatform: function(...args: any[]){ return getPlatform.apply(null, args) }, subprocess: subprocess, timer: timer, logCtx: logCtx }) })(); return _pickerP }
    let _groupP: Promise<any> | null = null
    function _group(): Promise<any> { if (!_groupP) _groupP = import('./ticketGrouping.js').then(function (m: any){ return m.createTicketGrouping() }); return _groupP }
    // H6 同步外形保持：_repo 接线经此同步函数取即时推进（原命名块内同步定义；现为加载后防火即发，无返回值、永不抛，调用方 try 包裹语义不变）。
    function namingSweepSoon(delayMs: number) { _naming().then(function (h: any){ try { h.namingSweepSoon(delayMs) } catch (eSw) {} }).catch(function(){}) }
    harness.handle('wf.handoffLatest', async function () { const h = await _handoff(); return h.handleHandoffLatest.apply(h, arguments) }); harness.handle('wf.handoffResolve', async function () { const h = await _handoff(); return h.handleHandoffResolve.apply(h, arguments) }) // 两句合一行：本文件已顶四百行上限，腾出的一行留给本机设置两条电话
    // #498 退役：wf.claim 删注册（全仓零调用点、零日志行；认领取走 wf.handoffResolve）。handleClaim 实现留守（删注册不断链）。
    harness.handle('wf.namingRegister', async function () { const h = await _naming(); return h.namingRegisterHandler.apply(h, arguments) }); harness.handle('wf.registerNewSessionWatcher', async function () { const h = await _naming(); return h.namingRegisterHandler.apply(h, arguments) }) // 两句合一行：本文件已顶四百行上限
```

</details>

**依据 7 · 源码核查**：[src/host/index.ts:376-387](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L376-L387)

注册 Host RPC 通道及延迟引导

<details>
<summary>查看原文（12行）</summary>

```text
    function _rpcChannel(): Promise<any> { if (!_rpcChannelP) _rpcChannelP = import('./rpcChannel.js'); return _rpcChannelP }
    _rpcChannel().then(function (ch: any) {
      ch.createRpcChannel({ ctx: ctx, handlers: __DSW_HANDLERS__, fireLog: fireLog, dispatchMeta: function () { return _dispatchMeta() } })
    }).catch(function (eLoad: any) {
      try { fireLog('error', 'host.dispatch.error', { method: '/api/dsws 通道注册', argsHash: '', errorKind: 'internal' }) } catch (eR2) {}
    })
    return true
    }
    if (bootBody()) return
    let booted = false
    const bootOnce = () => { if (booted) return; booted = true; try { bootBody() } catch (eBoot) {} }
    try { ctx.inject(['subprocess', 'timer'], bootOnce) } catch (eInj) { bootOnce() }
```

</details>

#### 缺口

- 未执行固定包在真实 DSH 的侧栏与会话
  **影响**：不能确认交接 UI 与远程通道从端到端可用
  **进一步探讨**：在隔离 Profile 用测试仓库确认面板加载、定位票并打开带上下文的会话

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 不同 Tracker 的统一入口能否保证相同权限与动作？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

统一入口的价值是让工作区和面板围绕同一任务对象发起请求，调用者可分辨后端不支持与读取失败。ADR 把 Tracker 操作与同步定位口分开，未实现操作声明 unsupported，定位口允许空值。以 GitHub 的权限读口为例，代码严格读取 push/triage 两个布尔值，读不到就返回 null，调用方可复用同一批承诺。这样可以区别已知权限与网络错误造成的未知，减少把通用 HTTP 错误解释成不存在。权限仍来自本机 gh 所用身份，读取字段也不等于所有写操作真实可用。Markdown 或 GitLab 能力不可由 GitHub 实现外推。对已有固定原生 Tracker 的团队，这种统一接缝价值主要在 Agent 交接，原生入口仍是权威核对点。

#### 证据与依据

**依据 1 · 作者声明**：[docs/adr/20261014-tracker-capability-ceiling.md:15-32](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/docs/adr/20261014-tracker-capability-ceiling.md#L15-L32)

契约设计说明和不支持路径

<details>
<summary>查看原文（18行）</summary>

```text
## 2. 决定：契约层定义能力的上限，后端只回答“实现”或“不支持”

从 2026-10-14 起，**全部能力都写在契约层**：

- **操作 23 条**：`preflight`、`list`、`get`、`getDependencies`、`create`、`close`、`reopen`、`comment`、`update`、`setLabels`、`setAssignees`、`setParent`、`setBlockedBy`、`getCurrentUser`、`initProject`、`listLabels`、`setLabelColors`、`counts`、`listPage`、`getRepoPermissions`、`listSubIssues`、`ensureLabelColorsFile`、`readBudget`。
- **定位口 3 条**：`getRepoKey`、`describe`、`issueAddress`。

> 2026-10-23 修订（规格 #1439）：第 26 条能力 `readBudget` 加入契约，回答“这个后端还剩多少额度”，三种诚实结果见 `src/tracker/contract/budget-model.ts`；其余 25 条不动。

规矩只有三条：

1. **后端不许有独有的对外方法**：实例上能叫到名字的东西，必须先在契约名录里出现。
2. **后端对每条只有两种回法**：操作回“我实现”或“我不支持”（`error.kind === 'unsupported'`）；定位口回名字或空值（空也是答案，不是失败）。
3. **缺操作由注册表补桩，定位口不补桩**：`describe` 是同步取值，补异步失败对象会把它用坏；所以定位口缺席就按空值走，调用方不抛、不拦。

## 3. 为什么分成“操作”和“定位口”两段

因为“没有答案”的含义不一样：操作没有实现是一种合法回答，可以补一个如实说“不支持”的桩；定位口没有答案就是空值，空值本身已经是答案，不需要也不应该再补一个失败对象。
```

</details>

**依据 2 · 源码核查**：[src/tracker/rooms/github/read/repo-permissions.ts:39-82](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/tracker/rooms/github/read/repo-permissions.ts#L39-L82)

权限字段与批内承诺复用

<details>
<summary>查看原文（44行）</summary>

```text
/** 批内复用位：键是 `owner/name`，值是正在问的那份承诺（并行的几条同时撞上也只真问一次）。 */
type PermissionsCache = Map<string, Promise<RepoPermissions | null>>;

function pickPermissions(raw: unknown): RepoPermissions | null {
  if (!raw || typeof raw !== 'object') return null
  // 为什么转成键值袋再读：回包是 gh 吐的原始形状，本函数只认 permissions 下 push/triage 两格是否为布尔值。
  const bag = raw as Record<string, unknown>;
  const p = (bag.permissions && typeof bag.permissions === 'object' ? bag.permissions : null) as Record<string, unknown> | null;
  if (!p || typeof p !== 'object') {
    // --jq .permissions 在仓库不存在时 gh 直接报错走失败分支；能到这里却没字段，视为问不出来
    return null
  }
  if (typeof p.push !== 'boolean' || typeof p.triage !== 'boolean') return null
  return { push: p.push, triage: p.triage }
}

/**
 * 问一次「当前账号在这个仓库上的写权限」（只读命令，无副作用）。
 * @param {Object} c ghClient 的产物（execGh）
 * @param {string} spec `owner/name`
 * @param {Object} ctx OpContext（含 cwd）
 * @param {Map} [cache] 批内复用位（同批调用方共用一个；不传则这次单独问一次）
 * @returns {Promise<{push:boolean,triage:boolean}|null>} 问不出来返回 null（调用方按「分不清」处理）
 */
export async function readRepoPermissions(c: GhClient, spec: string, ctx: OpContext, cache?: PermissionsCache): Promise<RepoPermissions | null> {
  const key = String(spec || '').trim()
  if (!key || key.indexOf('/') <= 0) return null
  if (cache && typeof cache.get === 'function' && typeof cache.set === 'function') {
    if (cache.has(key)) {
      try {
        const hit = await cache.get(key)
        return hit === undefined ? null : hit
      } catch {
        return null
      }
    }
    const pending = queryPermissions(c, key, ctx)
    cache.set(key, pending)
    try {
      return await pending
    } catch {
      return null
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/tracker/rooms/github/read/repo-permissions.ts:90-100](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/tracker/rooms/github/read/repo-permissions.ts#L90-L100)

实际 gh 调用与 API 失败

<details>
<summary>查看原文（11行）</summary>

```text
async function queryPermissions(c: GhClient, spec: string, ctx: OpContext): Promise<RepoPermissions | null> {
  const cwd = ctx && typeof ctx.cwd === 'string' ? ctx.cwd : undefined
  // 这一笔的起点：下面每一行降级日志带的是「从本函数入口到这里花掉的毫秒数」。
  const t0 = Date.now()
  // 读来源记录也从这里起算（#1686）：问成时把来源与权限字段组完整度挂到返回对象上。
  const clock = beginRead()
  const r = await c.execGh(['api', 'repos/' + spec, '--jq', '.permissions'], { cwd: cwd, via: 'permissions.api' })
  if (!r || !r.ok) {
    // 命令没跑成这一路，gh.exec 那行已经写了退出码；这里再补一行，好让「权限问不出来」整条链在日志里是一条线。
    emitReadDegraded(ctx, 'permissions', 'permissions:api', Date.now() - t0)
    return null
```

</details>

**依据 4 · 作者声明**：[README.md:27-38](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/README.md#L27-L38)

作者声明 Profile 和本机权限要求

<details>
<summary>查看原文（12行）</summary>

````text
# ② 安装 MattSkillsDeck —— --profile 必填：装进你实际使用的 DSH 入口对应的 profile
#    （装错 profile 等于没装，重启多少次都不会加载）
dsh plugin --profile web add dsh-mattpocock-skills-deck     # 用自启 web 服务（dsh web）
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck   # 用 DSH Desktop 桌面应用
# 锁定最新版更稳（当前 1.9.0-beta.34）：
dsh plugin --profile web add dsh-mattpocock-skills-deck@1.9.0-beta.34 --registry https://registry.npmjs.org
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck@1.9.0-beta.34 --registry https://registry.npmjs.org
```

> **用 GitHub 后端前的权限前提**：插件替你改 ISSUE，用的是本机 `gh` 已登录账号的权限——建标签、改票需要仓库的 `push` 权限；改指派、流转标签需要 `triage` 权限。账号在该仓库只有 `只读` 权限时，插件会把仓库如实标成只读：改票、打标签与标签流转不可用，浏览与刷新照常。
````

</details>

#### 缺口

- 未实测具体账号在不同后端的可读写矩阵
  **影响**：不能承诺 UI 会对每种后端权限正确降级
  **进一步探讨**：用只读、triage 和可写测试账号检查同一任务的浏览、加标与关闭

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样控制安装、数据变更和退出的负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先在隔离 Profile 固定分发版本，只绑定一个测试工作区，以只读 GitHub 身份确认工单读取、刷新和上下文交接。分发清单声明 DSH >=0.2.0-rc.2，README 区分 Web 与 Desktop Profile；Host 引导在 subprocess 和 timer 尚未就绪时可延后并记录提示。首次成本是匹配 Profile、验证本机 gh 身份与选择工作区；持续成本是票据刷新、权限变动和交接核对；误写成本来自写权限和实际仓库副作用。先只读能缩小验证面，确需写入再换测试仓库和受限身份。patch 注释描述卸载移除挂载行，已写 issue、评论和会话不会由此推定撤销。退出时卸载后回读挂载、回到原 Tracker 和会话，逐项核对数据。单位为一张工单交接合格所需人时，未测现金和人时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-38](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/README.md#L21-L38)

安装、分发版本与账号前提

<details>
<summary>查看原文（18行）</summary>

````text
<h2 align="center"><sub>INSTALL</sub><br>安装</h2>

```bash
# ① 安装 DSH CLI（已装跳过）
npm install -g @deepseek-ai/dsh

# ② 安装 MattSkillsDeck —— --profile 必填：装进你实际使用的 DSH 入口对应的 profile
#    （装错 profile 等于没装，重启多少次都不会加载）
dsh plugin --profile web add dsh-mattpocock-skills-deck     # 用自启 web 服务（dsh web）
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck   # 用 DSH Desktop 桌面应用
# 锁定最新版更稳（当前 1.9.0-beta.34）：
dsh plugin --profile web add dsh-mattpocock-skills-deck@1.9.0-beta.34 --registry https://registry.npmjs.org
#     或者
dsh plugin --profile desktop add dsh-mattpocock-skills-deck@1.9.0-beta.34 --registry https://registry.npmjs.org
```

> **用 GitHub 后端前的权限前提**：插件替你改 ISSUE，用的是本机 `gh` 已登录账号的权限——建标签、改票需要仓库的 `push` 权限；改指派、流转标签需要 `triage` 权限。账号在该仓库只有 `只读` 权限时，插件会把仓库如实标成只读：改票、打标签与标签流转不可用，浏览与刷新照常。
````

</details>

**依据 2 · 源码核查**：[package/package.json:2-27](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/package/package.json#L2-L27)

独立分发清单和 DSH 版本条件

<details>
<summary>查看原文（26行）</summary>

```text
  "name": "dsh-mattpocock-skills-deck",
  "version": "1.9.0-beta.34",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/FeatherHunter/dsh-mattpocock-skills-deck.git"
  },
  "description": "🌹安装即自带mattpocock/skills v1.3.2的27个工程与效率技能，无需手动装技能。520亿token打造本插件，在原始技能之上提供10倍的开发效率，也能帮助新手更快上手该技能套件。支持 GitHub 与 GitLab 的 issue；本地 Markdown 为预览版。感谢您的使用和支持💗",
  "engines": {
    "dsh": ">=0.2.0-rc.2"
  },
  "type": "module",
  "main": "lib/index.js",
  "scripts": {
    "prepublishOnly": "node ../scripts/build.mts --pkg-only"
  },
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./tools": "./deck/registration/agent-row.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dependencies": {
    "dsh-log": "0.4.1",
    "dsh-plugin-update": "^0.18.39",
    "yaml": "^2.9.1"
```

</details>

**依据 3 · 源码核查**：[package/cordis.patch.yml:1-14](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/package/cordis.patch.yml#L1-L14)

挂载及移除的声明

<details>
<summary>查看原文（14行）</summary>

```text
# dsh-mattpocock-skills-deck bundle 层：插入 Matt Skills Deck 控制面板插件条目
# 与 agent 层工具行（#741：九个 deck 工具向 agent 注册走行模块，与宿主行互不干扰）。
# 行模块零框架引用（不引用工具包，只交纯数据对象），装机时不再多装一份工具包，
# 真机上全部工具调用一起失败的那次（Cannot read properties of undefined (reading 'prepare')）
# 不会重演；宿主侧兼容钩子留着（别的产品可能是同一容器）。
# 由 dsh plugin --profile <name> add 自动装配（包声明 dsh.bundle.patch），
# 无需手动编辑任何文件；dsh plugin remove 时自动移除。
- insert:
    - id: dsh-mattpocock-skills-deck
      name: 'dsh-mattpocock-skills-deck'
      config: {}
    - id: dsh-mattpocock-skills-deck-tools
      name: 'dsh-mattpocock-skills-deck/tools'
      config: {}
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:383-397](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L383-L397)

Host 依赖未就绪时的分支

<details>
<summary>查看原文（15行）</summary>

```text
    }
    if (bootBody()) return
    let booted = false
    const bootOnce = () => { if (booted) return; booted = true; try { bootBody() } catch (eBoot) {} }
    try { ctx.inject(['subprocess', 'timer'], bootOnce) } catch (eInj) { bootOnce() }
    // 这个延时是「等 subprocess/timer 就绪最多等多久」，值来自中央 YAML 的 hostBootDeferMs 键
    // （生成常量 HOST_BOOT_DEFER_MS）；本文件是插件入口、不许加静态 import，所以这里同样动态 import。
    // 这段只是诊断警告（到点只记一条日志，不触发启动），import 失败就静默跳过，不影响上面的注入路径。
    // 注意：上面第 46 行的 _timeCfg 住在另一个函数里，这里够不着，所以把动态 import 直接写在这里。
    import('../shared/time-config/src/values.js').then(function (tc: any) {
      setTimeout(() => {
        if (booted) return
        try { console.warn('[dsh-mattpocock-skills-deck] host boot deferred: subprocess/timer not ready after ' + tc.HOST_BOOT_DEFER_MS + 'ms, deck tools not registered') } catch (eW) {}
      }, tc.HOST_BOOT_DEFER_MS)
    }).catch(function () {})
```

</details>

**依据 5 · 源码核查**：[src/host/index.ts:301-306](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L301-L306)

存在标签与评论写入入口

```text
    // #627 标签配色两条电话：端点名与契约操作名一致（listLabels / setLabelColors）， 界面经客户端到宿主那条既有接口（/api/dsws 通道按端点名分发）就能调到它们。
    harness.handle('wf.listLabels', async function (args: WfArgs) { const h = await _workspace(); return h.handleListLabels(args) })
    harness.handle('wf.setLabelColors', async function (args: WfArgs) { const h = await _workspace(); return h.handleSetLabelColors(args) })
    harness.handle('wf.issueDetail', async function () { const h = await _comments(); return h.handleIssueDetail.apply(h, arguments) })
    harness.handle('wf.issueComments', async function () { const h = await _comments(); return h.handleIssueComments.apply(h, arguments) })
    harness.handle('wf.commentIssue', async function () { const h = await _comments(); return h.handleCommentIssue.apply(h, arguments) })
```

#### 缺口

- 未实际安装、授权或卸载
  **影响**：无法确定 Profile 清理范围和权限探测端到端准确性
  **进一步探讨**：先读后写验证并记录每个持久副作用，再卸载和回读

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 面板交接是否减少漏上下文和重复认领？

**研究主题**：新假设与验证

#### 完整回答

待验证假设：同一工作区同时提供票详情、选择与会话交接，可能减少手工从 Tracker 复制时漏票号或丢失前置依赖的问题。将同一批可在测试仓库复放的任务随机分给手动 Tracker 加会话组和面板组，固定账号权限与任务粒度。记录工单引用正确率、遗漏依赖、重复认领、回滚时间和总人时。用只读组检验看板价值，再用专用可写仓库测试多人同时点击。若错误数未降，或刷新与排障时间抵消步骤减少，退回原 Tracker。没有把源码已有的注册或作者截图算成测量。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:295-306](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L295-L306)

任务选择及详情可作为可复查输入

<details>
<summary>查看原文（12行）</summary>

```text
    async function normCwd(...args: any[]): Promise<any> { const h = await _workspace(); return h.normCwd.apply(h, args) }
    harness.handle('wf.bind', async function () { const h = await _workspace(); return h.handleBind.apply(h, arguments) })
    harness.handle('wf.bindings', async function () { const h = await _workspace(); return h.handleBindings.apply(h, arguments) })
    harness.handle('wf.registry', async function () { const h = await _workspace(); return h.handleRegistry.apply(h, arguments) })
    harness.handle('wf.selection', async function () { const h = await _workspace(); return h.handleSelection.apply(h, arguments) })
    harness.handle('wf.setupLayout', async function (args: WfArgs) { const h = await _workspace(); return h.handleSetupLayout(args) }) // #683（F1 · ADR 的 R6）：布局答案按工作区记（H 与 C 各一份），卡片确认同时写两处。
    // #627 标签配色两条电话：端点名与契约操作名一致（listLabels / setLabelColors）， 界面经客户端到宿主那条既有接口（/api/dsws 通道按端点名分发）就能调到它们。
    harness.handle('wf.listLabels', async function (args: WfArgs) { const h = await _workspace(); return h.handleListLabels(args) })
    harness.handle('wf.setLabelColors', async function (args: WfArgs) { const h = await _workspace(); return h.handleSetLabelColors(args) })
    harness.handle('wf.issueDetail', async function () { const h = await _comments(); return h.handleIssueDetail.apply(h, arguments) })
    harness.handle('wf.issueComments', async function () { const h = await _comments(); return h.handleIssueComments.apply(h, arguments) })
    harness.handle('wf.commentIssue', async function () { const h = await _comments(); return h.handleCommentIssue.apply(h, arguments) })
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:309-324](https://github.com/FeatherHunter/dsh-mattpocock-skills-deck/blob/72e2834254644a71d33ecbf80661c5c2574076c4/src/host/index.ts#L309-L324)

交接与会话登记可构成可测路径

<details>
<summary>查看原文（16行）</summary>

```text
    // ---- H6 #450 接线：5 新文件动态 import 加载（D7 禁止静态 import），依赖全显式传入；新文件之间不互引用 ---- 第 5 件 ticketGrouping 为压线追加（用户定夺）：computeLevels/groupTickets 纯函数搬出，H2/H4 loader 取值后转供给。 这一组的拆分缘由见账本 §7。
    let _handoffP: Promise<any> | null = null
    function _handoff(): Promise<any> { if (!_handoffP) _handoffP = (async function(){ const mod = await import('./handoffClaim.js'); return mod.createHandoffClaim({ fs: fs, DEFAULT_CWD: DEFAULT_CWD, normCwd: function(...args: any[]){ return normCwd.apply(null, args) }, setCache: setCache, logCtx: logCtx, openSession: openSessionFor }) })(); return _handoffP }
    let _namingP: Promise<any> | null = null
    function _naming(): Promise<any> { if (!_namingP) _namingP = (async function(){ const mod = await import('./namingGuardian.js'); return mod.createNamingGuardian({ fs: fs, timer: timer, DEFAULT_CWD: DEFAULT_CWD, getCacheDir: function(...args: any[]){ return getCacheDir.apply(null, args) }, getPlatform: function(...args: any[]){ return getPlatform.apply(null, args) }, getRepoKey: function(...args: any[]){ return getRepoKey.apply(null, args) }, logCtx: logCtx, openSession: openSessionFor, getFirstText: function (sid: string) { try { return _refreshWiringP!.then(function (w: any) { try { return w.firstTextOf(sid) } catch (eW) { return null } }).catch(function () { return null }) } catch (eG) { return Promise.resolve(null) } }, getTitleFact: function (sid: string) { try { return _refreshWiringP!.then(function (w: any) { try { return w.titleFactOf(sid) } catch (eW) { return null } }).catch(function () { return null }) } catch (eG) { return Promise.resolve(null) } } }) })(); return _namingP }
    let _publishP: Promise<any> | null = null
    function _publish(): Promise<any> { if (!_publishP) _publishP = (async function(){ const mod = await import('./publishFlow.js'); const builtinsMod = await import('../tracker/registry/builtins.js'); const ghExtras = await builtinsMod.loadGithubHostExtras(); return mod.createPublishFlow({ DEFAULT_CWD: DEFAULT_CWD, resolveGit: function(...args: any[]){ return resolveGit.apply(null, args) }, execProc: function(...args: any[]){ return execProc.apply(null, args) }, canonicalKey: function(...args: any[]){ return canonicalKey.apply(null, args) }, repoKeys: repoKeys, repoRoots: repoRoots, setCache: setCache, logCtx: logCtx, openSession: openSessionFor, makeCreateErrorClassifier: ghExtras.makeCreateErrorClassifier as unknown as (deps: { isOwnership: (text: string) => boolean }) => (errText: unknown, kind?: unknown) => string, KIND_UNKNOWN: ghExtras.KIND_UNKNOWN }) })(); return _publishP }
    let _pickerP: Promise<any> | null = null
    function _picker(): Promise<any> { if (!_pickerP) _pickerP = (async function(){ const mod = await import('./pickerShell.js'); return mod.createPickerShell({ DEFAULT_CWD: DEFAULT_CWD, getPlatform: function(...args: any[]){ return getPlatform.apply(null, args) }, subprocess: subprocess, timer: timer, logCtx: logCtx }) })(); return _pickerP }
    let _groupP: Promise<any> | null = null
    function _group(): Promise<any> { if (!_groupP) _groupP = import('./ticketGrouping.js').then(function (m: any){ return m.createTicketGrouping() }); return _groupP }
    // H6 同步外形保持：_repo 接线经此同步函数取即时推进（原命名块内同步定义；现为加载后防火即发，无返回值、永不抛，调用方 try 包裹语义不变）。
    function namingSweepSoon(delayMs: number) { _naming().then(function (h: any){ try { h.namingSweepSoon(delayMs) } catch (eSw) {} }).catch(function(){}) }
    harness.handle('wf.handoffLatest', async function () { const h = await _handoff(); return h.handleHandoffLatest.apply(h, arguments) }); harness.handle('wf.handoffResolve', async function () { const h = await _handoff(); return h.handleHandoffResolve.apply(h, arguments) }) // 两句合一行：本文件已顶四百行上限，腾出的一行留给本机设置两条电话
    // #498 退役：wf.claim 删注册（全仓零调用点、零日志行；认领取走 wf.handoffResolve）。handleClaim 实现留守（删注册不断链）。
    harness.handle('wf.namingRegister', async function () { const h = await _naming(); return h.namingRegisterHandler.apply(h, arguments) }); harness.handle('wf.registerNewSessionWatcher', async function () { const h = await _naming(); return h.namingRegisterHandler.apply(h, arguments) }) // 两句合一行：本文件已顶四百行上限
```

</details>

#### 缺口

- 未做同任务双组对照或同时认领实验
  **影响**：没有净节约和并发正确性的证明
  **进一步探讨**：固定样本后检查原始工单及会话记录，按上述失败指标判断

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
