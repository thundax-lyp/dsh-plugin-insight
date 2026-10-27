# dock-base

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8535f6e](https://github.com/AKS1st/dock/tree/8535f6e24670931d9e93fb087ab474e38aa01856)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock) [![npm 30d 1,532](https://img.shields.io/static/v1?label=npm+30d&message=1%2C532&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-base)
<!-- END META -->

> **功能**：为DSH web提供统一布局、视图实例、命令和设置注册服务，供功能插件按需组合。

> **亮点**：统一多插件重复的布局、实例、命令与设置接线，具体文件/Git业务由扩展实现；未证明优于所有工作台。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：异步beforeClose允许结果未绑定内容版本且未见reject处理，无hook默认允许；seed/dirty持久不等业务缓冲恢复。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要基座，注册到显示怎样运行？](#detail-section-11)
  - [Q02 · 增量贡献和关闭/恢复边界是什么？](#detail-section-12)
  - [Q03 · 依赖、三阶段成本和效果怎样判断？](#detail-section-13)
  - [Q04 · 哪些工程可复用，版本绑定关闭假设如何证伪？](#detail-section-14)
  - [Q05 · 谁适合试用，什么情况停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多个功能面板需共享布局与实例/设置接线的开发者及组合使用者。

各插件独立面板或原生slot可替代；基座复用布局与状态管理，也增加共同版本与本地恢复维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 布局与实例 | 停靠/浮窗/标签 | 不内置文件/Git业务 |
| 注册服务 | 视图/活动/命令 | ID唯一、各方自己清理 |
| beforeClose | 功能方阻止关闭 | 可选hook，异步内容版本待核 |
| 本地恢复 | 布局/seed/设置 | 不等完整编辑缓冲持久化 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH>=0.1.3-alpha.2及Cordis | 基础必需 | Host/Client装载及uiSession | 不能用包能安装推断UI契约匹配 |
| React/ReactDOM18、浏览器DOM | UI必需 | portal与组件渲染 | peer标optional不等UI无需React |
| 功能插件注册workbench | 实际业务按需 | 文件/编辑/Git等 | 只装基座是空壳，不提供文件操作 |
| localStorage | 刷新恢复必需 | 布局/seed/设置和几何 | 配额或禁用时仅本次内存有效 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定兼容宿主和dock-base | 明确只选真正需要的功能插件 |
| 加载 | 安装到web profile并重启刷新 | uiSession就绪、workbench先提供再显示 |
| 扩展 | 功能插件按effect注册并处理beforeClose | 标识唯一、实例上下文与关闭一致 |
| 退出/恢复 | 停用各注册方和基座，单独处理localStorage | 清理UI不等保存未提交编辑内容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 基座/功能插件与UI资源，金额未知 | 宿主兼容、插件组合和位置设置 | 无强制模型服务 |
| 持续使用 | React渲染、布局/seed整体本地写入 | 管理视图、设置与上游更新 | 多实例/大seed的性能未测 |
| 失败恢复 | 布局重置、注册方重载和版本回退 | 判断持久状态与未保存业务数据 | localStorage恢复不等编辑缓冲恢复 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 复用布局 | 统一视图/活动/命令/设置注册接口 | 接入插件实际维护人时 |
| 连续工作 | 布局与设置可恢复，关闭有可选hook | 多步异步确认下内容保护 |
| 工作台体验 | 浮窗/停靠和单portal结构 | 与独立面板在任务完成率/干扰上的差异 |

> **思考**：异步beforeClose允许结果未绑定内容版本且未见reject处理，无hook默认允许；seed/dirty持久不等业务缓冲恢复。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一多插件重复的布局、实例、命令与设置接线，具体文件/Git业务由扩展实现；未证明优于所有工作台。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是服务先提供、挂载失败也幂等清理、注册ID唯一与反注册、设置输入JSON-safe克隆/validate，以及布局/设置分离。设置排序按order再ID稳定，反注册保留值改善热更新体验。localStorage失败继续内存状态便于降级，但应让读者知道无法跨刷新恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

异步beforeClose允许结果未绑定内容版本且未见reject处理，无hook默认允许；seed/dirty持久不等业务缓冲恢复。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有多视图组合需求可试用，先核对上下文与异步关闭；逐个研究功能插件而非默认全装。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持workbench注册服务、布局和单portal工作台集成；延迟关闭确认缺实例版本绑定，旧确认可能作用新内容，dirty元数据不等草稿恢复。版本绑定关闭协议尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client/index.ts、src/client/service.ts、src/client/settings.ts、package.json、src/client/layout.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定空Host、Client提供/挂载、注册服务、layout/settings与beforeClose关键链；未运行UI或审计功能插件。
- 下一步：进一步探讨可用无I/O异步view夹具检查pending改seed、重复关闭、注销与reject，比较旧确认和恢复完整性。

**分析版本**

- **仓库**：[AKS1st/dock](https://github.com/AKS1st/dock)
- **版本号**：0.2.4（[固定提交 8535f6e](https://github.com/AKS1st/dock/tree/8535f6e24670931d9e93fb087ab474e38aa01856)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨实例版本绑定关闭协议，旧确认不得作用于新内容并可见处理reject；增加状态与重入成本，未验证。详见[Q04](#research-q04)。

进一步探讨可用无I/O异步view夹具检查pending改seed、重复关闭、注销与reject，比较旧确认和恢复完整性。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2814 | 2500 | 313 | — |
| .md | source | 2 | 248 | — | — | 3267 |
| .tsx | source | 3 | 999 | 823 | 120 | — |
| .ts | source | 12 | 2437 | 1826 | 472 | — |
| .ts | test | 2 | 406 | 363 | 9 | — |
| .mjs | source | 1 | 53 | 38 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+created%3A2026-09-22T05%3A32%3A09.414Z..2026-10-22T05%3A32%3A09.414Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AKS1st/dock/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A32%3A09.414Z..2026-10-22T05%3A32%3A09.414Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH工作台基座的注册/实例/持久化、关闭保护与组合成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要基座，注册到显示怎样运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向给DSH web开发多面板扩展的作者，以及要组合多个功能视图的读者。输入是活动项、面板、编辑器、命令、设置注册与活动uiSession，输出是统一布局壳和实例显示。合格任务需各注册方正确取得会话、清理自己的资源并保持实例状态。仅装dock不会获得文件浏览、Git或编辑能力，作者README“最好”的话没有比较证据。

Host目前为空，无文件/网络路由；Client等uiSession注入后创建layout/settings/service，先provide workbench，再在document.body挂单个React root。功能方按ID注册，重复ID抛错，反注册函数配合effect释放。openView生成或复用实例，保存seed；布局和设置各自使用localStorage。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-24](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/README.md#L7-L24)

作者基座分工与功能项。

<details>
<summary>查看原文（18行）</summary>

```text
DSH Web 工作台基础插件：提供 VSCode 风格布局外壳（活动栏 / 侧边栏 / 编辑器区 / 面板 / 状态栏），并通过注册表服务 `ctx.workbench` 让功能插件挂载面板、编辑器视图、活动项、状态项与命令。本插件是 **dock 系列**的基础：`dock-files`、`dock-editor`、`dock-images`、`dock-markdown`、`dock-git` 都依赖它提供的工作台外壳。

## 功能

- **活动栏**：左侧垂直条带，可注册图标项，点击切换侧边栏面板。
- **侧边栏**：承载功能面板（文件浏览、Git 启动器等）。
- **编辑器区**：多标签编辑器视图（文件查看器、Git 提交图等）。
- **停靠模式**：整个工作台可停靠在屏幕四边，支持悬浮窗口（独立浮窗，可拖动/缩放）。
- **状态栏**：底部状态项注册。
- **命令系统**：`executeCommand` 命令注册与调用。
- **布局持久化**：面板/悬浮窗口布局保存在 localStorage，刷新后恢复。
- **设置窗口**：内置设置对话框展示各插件注册的设置项；支持校验、排序、键盘焦点管理与跨刷新持久化。
- **开放注册表**：`registerActivityBarItem` / `registerPanel` / `registerEditorView` / `registerStatusBarItem` / `registerCommand` / `registerSetting`，全部返回反注册函数，配合 `ctx.effect` 使用可随插件停用自动清理。

## 推荐搭配插件（可组合，按需安装）

dock 基座只提供工作台外壳，不附带文件浏览、编辑等具体能力——这些交给功能插件。下面的推荐**一条一条列清楚：全部可选、可自由组合，完全按你的场景按需安装，不需要全部装齐**。

```

</details>

**依据 2 · 源码核查**：[src/index.ts:1-14](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/index.ts#L1-L14)

空Host不提供业务路由。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Host half of dock — currently an empty shell.
 *
 * The base owns the *window* (client layout shell + registry service); all
 * feature domains (fs / git / terminal / ...) live in feature plugins with
 * their own host routes. Layout persistence happens on the client
 * (localStorage), so the host half has no routes yet.
 */
export const name = 'dock-base'

/** No host-side services required yet. */
export function apply(): void {
  // Intentionally empty: all behavior lives in the client half.
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:18-32](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts#L18-L32)

uiSession与服务先provide。

<details>
<summary>查看原文（15行）</summary>

```text
 * The shell resolves the active Session from `uiSession`, whose scope adapter
 * is the view owner's selection source; waiting for it keeps every view's
 * sessionId correct on its first render instead of racing boot order.
 */
export const inject: string[] = ['uiSession']

/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  // Publish the registry BEFORE the shell mounts so feature plugins
  // injecting 'workbench' are ready by the time the shell renders.
  const store = createLayoutStore()
  const settings = createSettingsStore()
  const service = createWorkbenchService(store, settings)
  ctx.provide('workbench', service)

```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:34-65](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts#L34-L65)

单portal与挂载失败清理。

<details>
<summary>查看原文（32行）</summary>

```text
    let root: Root | undefined
    let host: HTMLDivElement | undefined
    let unstyle: (() => void) | undefined
    let cleaned = false
    const cleanup = (): void => {
      if (cleaned) return
      cleaned = true
      root?.unmount()
      root = undefined
      host?.remove()
      host = undefined
      unstyle?.()
      unstyle = undefined
      service.dispose()
    }
    try {
      unstyle = mountStyles()
      host = document.createElement('div')
      host.setAttribute('data-dock', '')
      document.body.appendChild(host)
      root = createRoot(host)
      root.render(createElement(WorkbenchRoot, { ctx, service, store }))
      return cleanup
    } catch (error) {
      console.error('[dock] mount error:', error)
      // The effect callback may never be disposed after a failed mount, so
      // release every resource immediately as well as returning an idempotent
      // disposer for Cordis.
      cleanup()
      return cleanup
    }
  }, 'dock: shell mount')
```

</details>

**依据 5 · 源码核查**：[src/client/service.ts:174-210](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L174-L210)

视图/命令注册及唯一ID。

<details>
<summary>查看原文（37行）</summary>

```text
  const registerPanel = (def: ViewDefinition & { region: 'sideBar' }): (() => void) => {
    if (panels.has(def.id)) throw new Error(`[dock] panel "${def.id}" already registered`)
    panels.set(def.id, def)
    notify()
    return () => { if (panels.get(def.id) === def) { panels.delete(def.id); notify() } }
  }

  const registerEditorView = (def: ViewDefinition): (() => void) => {
    if (editorViews.has(def.id)) throw new Error(`[dock] editor view "${def.id}" already registered`)
    editorViews.set(def.id, def)
    notify()
    return () => { if (editorViews.get(def.id) === def) { editorViews.delete(def.id); notify() } }
  }

  const registerStatusBarItem = (def: StatusBarItemDefinition): (() => void) => {
    if (statusItems.has(def.id)) throw new Error(`[dock] status item "${def.id}" already registered`)
    statusItems.set(def.id, def)
    notify()
    return () => { if (statusItems.get(def.id) === def) { statusItems.delete(def.id); notify() } }
  }

  const registerCommand = (def: CommandDefinition): (() => void) => {
    if (commands.has(def.id)) throw new Error(`[dock] command "${def.id}" already registered`)
    commands.set(def.id, def)
    notify()
    return () => { if (commands.get(def.id) === def) { commands.delete(def.id); notify() } }
  }

  const executeCommand = async (id: string, ...args: unknown[]): Promise<unknown> => {
    const command = commands.get(id)
    if (command === undefined) {
      console.warn(`[dock] unknown command "${id}"`)
      return undefined
    }
    return command.run(...args)
  }

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量贡献和关闭/恢复边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是把每个插件重复维护的布局、实例、设置与命令接线抽成workbench服务，并由基座统一持久偏好和浮窗位置；成熟IDE式布局是参照，不能称新布局算法。功能插件仍拥有真实业务I/O和权限，基座没有把它们变成隔离插件。

最关键限制在异步beforeClose只是一次判定，没有实例内容版本绑定。evaluateBeforeClose对Promise resolve后直接执行回调，close再按instanceId移除当前实例，open复用也可在旧确认稍后返回时替换seed；未见拒绝Promise的catch或确认期间内容变动重检。故不能承诺任何异步交互下都不会丢未保存状态，这是一条静态失效假设而非已复现丢失。无hook的视图默认允许，实际保护依赖功能插件正确注册。

布局会保存seed/meta，但保存dirty标志不等保存完整编辑缓冲；设置反注册还保留值以便HMR恢复，停用并不清浏览器数据。相同origin localStorage跨会话共享，不能当跨用户权限隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/service.ts:225-243](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L225-L243)

异步gate只等结果，无拒绝/版本重检。

<details>
<summary>查看原文（19行）</summary>

```text
   * Evaluate the instance's view-defined `beforeClose` gate. No hook → the
   * gate is trivially allowed; a synchronous `false` cancels; a synchronous
   * `true`/`undefined` allows; a promise defers the decision to its
   * resolution (any non-`false` value allows). Shared by `closeViewInstance`
   * and `openView` so replacing an instance's content (switching files) is
   * gated exactly like closing it — a dirty editor must confirm before its
   * content is discarded.
   */
  const evaluateBeforeClose = (entry: CloseRequest): BeforeCloseResult => {
    const beforeClose = editorViews.get(entry.viewId)?.beforeClose
    if (beforeClose === undefined) return { kind: 'allowed' }
    const verdict = beforeClose(entry)
    if (typeof verdict === 'object' && verdict !== null && typeof (verdict as Promise<boolean>).then === 'function') {
      return {
        kind: 'pending',
        then(onAllow) {
          void (verdict as Promise<boolean>).then((allow) => { if (allow !== false) onAllow() })
        },
      }
```

</details>

**依据 2 · 源码核查**：[src/client/service.ts:251-266](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L251-L266)

延迟确认后替换浮窗seed。

<details>
<summary>查看原文（16行）</summary>

```text
      // One floating instance per view (Phase F1; multi-instance lands later).
      const existingEntry = Object.entries(current.floatingWindows).find(([, win]) => win.viewId === viewId)
      if (existingEntry !== undefined) {
        const [instanceId, win] = existingEntry
        if (seed !== undefined) {
          // Reusing the window replaces the old content: switching files is
          // like closing the old one, so a dirty instance must confirm first
          // (the view's beforeClose gate). A cancelled gate keeps the old
          // seed — no silent discard — and the open resolves to the existing
          // window either way.
          const gate = evaluateBeforeClose(win)
          if (gate.kind === 'cancelled') return instanceId
          if (gate.kind === 'pending') {
            gate.then(() => replaceFloatingSeed(instanceId, seed))
            return instanceId
          }
```

</details>

**依据 3 · 源码核查**：[src/client/service.ts:338-372](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L338-L372)

延迟允许后按当前instanceId关闭。

<details>
<summary>查看原文（35行）</summary>

```text

  /**
   * Close one view instance (tab or floating window). Before touching the
   * layout the instance's view definition is consulted: a registered
   * `beforeClose` hook receives `{ viewId, instanceId, seed }` and may
   * cancel the close by returning `false` (or a promise resolving to
   * `false`). The call is fire-and-forget — with an async hook the layout
   * stays open until the verdict resolves, then the close is performed on
   * approval. Unknown instance ids are a no-op.
   */
  const closeViewInstance = (instanceId: string): void => {
    const current = store.getLayout()
    // Resolve the instance (tab or floating window) and its view definition.
    const tab = current.editorTabs.find((entry) => entry.instanceId === instanceId)
    const win = current.floatingWindows[instanceId]
    const entry = tab ?? win
    if (entry === undefined) return
    const gate = evaluateBeforeClose(entry)
    if (gate.kind === 'cancelled') return
    if (gate.kind === 'pending') { gate.then(() => performClose(instanceId)); return }
    performClose(instanceId)
  }

  const performClose = (instanceId: string): void => {
    const current = store.getLayout()
    const editorTabs = current.editorTabs.filter((tab) => tab.instanceId !== instanceId)
    let activeEditorTab = current.activeEditorTab
    if (activeEditorTab === instanceId) {
      activeEditorTab = editorTabs.length > 0 ? editorTabs[editorTabs.length - 1]!.instanceId : null
    }
    const floatingWindows = { ...current.floatingWindows }
    delete floatingWindows[instanceId]
    store.update({ editorTabs, activeEditorTab, floatingWindows })
  }

```

</details>

**依据 4 · 源码核查**：[src/client/service.ts:375-378](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L375-L378)

seed/meta持久说明。

```text
   * unknown ids are a no-op). `patch.meta` is shallow-merged into the
   * instance's current meta when both are plain objects; other patch fields
   * replace their seed counterparts wholesale. Persisted with the layout, so
   * instance-level state (e.g. an editor's dirty flag) survives reloads.
```

**依据 5 · 源码核查**：[src/client/settings.ts:318-323](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/settings.ts#L318-L323)

反注册保留值。

```text
      return () => {
        if (definitions.get(definition.id) !== typed) return
        definitions.delete(definition.id)
        // Keep the in-memory and persisted value so re-registration (including
        // HMR) restores the user's choice instead of silently resetting it.
        notify()
```

#### 缺口

- 异步确认中实例内容变化、功能插件实际缓冲持久化与拒绝Promise行为未完成交互验证。
  **影响**：不能把beforeClose接口称为完整数据无损保证。
  **进一步探讨**：可用假的异步view，先pending再改seed/dirty并resolve/reject，检查是否错误关闭和有无未处理拒绝。
- 组合功能插件的文件/Git权限与I/O未在本基座研究中审计。
  **影响**：基座空Host不能保证扩展后的工作台没有外部副作用。
  **进一步探讨**：可对每个拟装功能插件固定版本单独研究，并核对它们传入seed的数据类型。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、三阶段成本和效果怎样判断？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包dock-base0.2.4声明DSH>=0.1.3-alpha.2、Node>=20；React peers虽标可选，Client静态导入React/ReactDOM，渲染实际仍依赖。基座不要求模型，不应把功能插件潜在模型/外部服务费用算成基座固定成本，也不能忽略组合维护。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20、DSH>=0.1.3-alpha.2及Cordis | 基础必需 | Host/Client装载及uiSession | 不能用包能安装推断UI契约匹配 |
| React/ReactDOM18、浏览器DOM | UI必需 | portal与组件渲染 | peer标optional不等UI无需React |
| 功能插件注册workbench | 实际业务按需 | 文件/编辑/Git等 | 只装基座是空壳，不提供文件操作 |
| localStorage | 刷新恢复必需 | 布局/seed/设置和几何 | 配额或禁用时仅本次内存有效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者固定兼容宿主和dock-base | 明确只选真正需要的功能插件 |
| 加载 | 安装到web profile并重启刷新 | uiSession就绪、workbench先提供再显示 |
| 扩展 | 功能插件按effect注册并处理beforeClose | 标识唯一、实例上下文与关闭一致 |
| 退出/恢复 | 停用各注册方和基座，单独处理localStorage | 清理UI不等保存未提交编辑内容 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 基座/功能插件与UI资源，金额未知 | 宿主兼容、插件组合和位置设置 | 无强制模型服务 |
| 持续使用 | React渲染、布局/seed整体本地写入 | 管理视图、设置与上游更新 | 多实例/大seed的性能未测 |
| 失败恢复 | 布局重置、注册方重载和版本回退 | 判断持久状态与未保存业务数据 | localStorage恢复不等编辑缓冲恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 复用布局 | 统一视图/活动/命令/设置注册接口 | 接入插件实际维护人时 |
| 连续工作 | 布局与设置可恢复，关闭有可选hook | 多步异步确认下内容保护 |
| 工作台体验 | 浮窗/停靠和单portal结构 | 与独立面板在任务完成率/干扰上的差异 |

比较应选同一组面板和完整任务，计接入、升级、恢复与人工操作，而不以注册API数判断收益。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:51-77](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/package.json#L51-L77)

版本/引擎与optional peer。

<details>
<summary>查看原文（27行）</summary>

```text
  "engines": {
    "node": ">=20",
    "dsh": ">=0.1.3-alpha.2"
  },
  "peerDependencies": {
    "cordis": "^4.0.0-rc.7",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "cordis": "^4.0.0-rc.7",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tsdown": "^0.22.14",
    "typescript": "^6.0.3"
  }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:9-15](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts#L9-L15)

静态React依赖。

```text
import { createRoot, type Root } from 'react-dom/client'
import type { WorkbenchContext } from './contract.ts'
import { createLayoutStore } from './layout.ts'
import { createSettingsStore } from './settings.ts'
import { createWorkbenchService } from './service.ts'
import { WorkbenchRoot } from './parts.tsx'
import { mountStyles } from './styles.ts'
```

**依据 3 · 源码核查**：[src/client/layout.ts:126-145](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/layout.ts#L126-L145)

localStorage恢复/保存失败回退。

<details>
<summary>查看原文（20行）</summary>

```text
export function createLayoutStore(storage?: LayoutStorage): LayoutStore {
  const backing: LayoutStorage = storage ?? (typeof window !== 'undefined' ? window.localStorage : memoryStorage())
  const loaded = loadPersisted(backing)
  if (loaded !== null) {
    // Persist the normalized (migrated) form so legacy data upgrades once.
    try { backing.setItem(STORAGE_KEY, JSON.stringify(loaded)) } catch { /* storage unavailable */ }
  }
  let layout: WorkbenchLayout = loaded ?? DEFAULT_LAYOUT
  const listeners = new Set<() => void>()

  return {
    getLayout: () => layout,
    update(patch) {
      layout = { ...layout, ...patch }
      try {
        backing.setItem(STORAGE_KEY, JSON.stringify(layout))
      } catch {
        // Storage full / unavailable: the layout still applies for this session.
      }
      for (const listener of [...listeners]) listener()
```

</details>

**依据 4 · 源码核查**：[src/client/settings.ts:342-359](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/settings.ts#L342-L359)

设置写入验证与持久化。

<details>
<summary>查看原文（18行）</summary>

```text
    set<T = unknown>(id: string, value: T): void {
      const definition = definitions.get(id)
      if (definition === undefined) throw new Error(`[dock] unknown setting "${id}"`)
      const safeValue = cloneJsonSafe(value)
       const valid = definition.validate(safeValue)
      
      const next = valid ? safeValue : cloneJsonSafe(definition.defaultValue)
      if (Object.is(values.get(id), next)) {
        if (!valid) {
          persisted[id] = next
          persist()
        }
        return
      }
      values.set(id, next)
      persisted[id] = next
      persist()
      notify()
```

</details>

#### 缺口

- 没有相同功能面板独立接线与基座方案的实现人时、渲染负担和恢复对照。
  **影响**：不能量化减少开发/维护成本或更流畅。
  **进一步探讨**：可固定面板数量、seed大小与任务，分别统计接入/升级人时、布局写频率、峰值内存和恢复完整性。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些工程可复用，版本绑定关闭假设如何证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是服务先提供、挂载失败也幂等清理、注册ID唯一与反注册、设置输入JSON-safe克隆/validate，以及布局/设置分离。设置排序按order再ID稳定，反注册保留值改善热更新体验。localStorage失败继续内存状态便于降级，但应让读者知道无法跨刷新恢复。

可探讨未验证的“实例版本绑定关闭协议”。每次seed/dirty变化增加版本，beforeClose返回与instanceId/版本绑定的结果，pending期间变化则拒绝旧结果或重新询问，Promise拒绝有可读错误并保持视图；功能方另负责真实缓冲持久化。相比现在延迟回调，目标是关闭决策只作用于读者确认过的内容。代价是状态/Promise生命周期与关闭重入处理。最小夹具包含pending后改内容、重复关闭、注销view及reject，比较错误关闭/悬挂与恢复复杂度；若仍可旧确认关闭新内容应否定当前方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:34-65](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts#L34-L65)

幂等挂载清理。

<details>
<summary>查看原文（32行）</summary>

```text
    let root: Root | undefined
    let host: HTMLDivElement | undefined
    let unstyle: (() => void) | undefined
    let cleaned = false
    const cleanup = (): void => {
      if (cleaned) return
      cleaned = true
      root?.unmount()
      root = undefined
      host?.remove()
      host = undefined
      unstyle?.()
      unstyle = undefined
      service.dispose()
    }
    try {
      unstyle = mountStyles()
      host = document.createElement('div')
      host.setAttribute('data-dock', '')
      document.body.appendChild(host)
      root = createRoot(host)
      root.render(createElement(WorkbenchRoot, { ctx, service, store }))
      return cleanup
    } catch (error) {
      console.error('[dock] mount error:', error)
      // The effect callback may never be disposed after a failed mount, so
      // release every resource immediately as well as returning an idempotent
      // disposer for Cordis.
      cleanup()
      return cleanup
    }
  }, 'dock: shell mount')
```

</details>

**依据 2 · 源码核查**：[src/client/service.ts:174-210](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L174-L210)

唯一ID及反注册。

<details>
<summary>查看原文（37行）</summary>

```text
  const registerPanel = (def: ViewDefinition & { region: 'sideBar' }): (() => void) => {
    if (panels.has(def.id)) throw new Error(`[dock] panel "${def.id}" already registered`)
    panels.set(def.id, def)
    notify()
    return () => { if (panels.get(def.id) === def) { panels.delete(def.id); notify() } }
  }

  const registerEditorView = (def: ViewDefinition): (() => void) => {
    if (editorViews.has(def.id)) throw new Error(`[dock] editor view "${def.id}" already registered`)
    editorViews.set(def.id, def)
    notify()
    return () => { if (editorViews.get(def.id) === def) { editorViews.delete(def.id); notify() } }
  }

  const registerStatusBarItem = (def: StatusBarItemDefinition): (() => void) => {
    if (statusItems.has(def.id)) throw new Error(`[dock] status item "${def.id}" already registered`)
    statusItems.set(def.id, def)
    notify()
    return () => { if (statusItems.get(def.id) === def) { statusItems.delete(def.id); notify() } }
  }

  const registerCommand = (def: CommandDefinition): (() => void) => {
    if (commands.has(def.id)) throw new Error(`[dock] command "${def.id}" already registered`)
    commands.set(def.id, def)
    notify()
    return () => { if (commands.get(def.id) === def) { commands.delete(def.id); notify() } }
  }

  const executeCommand = async (id: string, ...args: unknown[]): Promise<unknown> => {
    const command = commands.get(id)
    if (command === undefined) {
      console.warn(`[dock] unknown command "${id}"`)
      return undefined
    }
    return command.run(...args)
  }

```

</details>

**依据 3 · 源码核查**：[src/client/settings.ts:295-323](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/settings.ts#L295-L323)

注册验证、克隆与HMR值保留。

<details>
<summary>查看原文（29行）</summary>

```text
  }
  const cloneJsonSafe = <T>(value: T): T => {
    assertJsonSafe(value)
    return JSON.parse(JSON.stringify(value)) as T
  }
  const notify = (): void => { for (const listener of [...listeners]) listener() }

  return {
    register<T>(definition: SettingDefinition<T>): () => void {
      if (definitions.has(definition.id)) throw new Error(`[dock] setting "${definition.id}" already registered`)
      const defaultValue = cloneJsonSafe(definition.defaultValue)
      if (!definition.validate(defaultValue)) throw new Error(`[dock] invalid default value for setting "${definition.id}"`)
      const typed = definition as SettingDefinition<unknown>
      definitions.set(definition.id, typed)
      const candidate = persisted[definition.id]
      const safeCandidate = candidate === undefined ? undefined : cloneJsonSafe(candidate)
      const value = safeCandidate !== undefined && definition.validate(safeCandidate)
        ? safeCandidate
        : cloneJsonSafe(defaultValue)
      values.set(definition.id, value)
      persisted[definition.id] = cloneJsonSafe(value)
      persist()
      notify()
      return () => {
        if (definitions.get(definition.id) !== typed) return
        definitions.delete(definition.id)
        // Keep the in-memory and persisted value so re-registration (including
        // HMR) restores the user's choice instead of silently resetting it.
        notify()
```

</details>

**依据 4 · 源码核查**：[src/client/settings.ts:335-359](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/settings.ts#L335-L359)

稳定排序/写前验证。

<details>
<summary>查看原文（25行）</summary>

```text
    getDefinitions(pluginId?: string): readonly SettingDefinition<unknown>[] {
      // Settings are ordered by `order`, then by id for a deterministic tie-break.
      return [...definitions.values()].filter((definition) => pluginId === undefined || definition.pluginId === pluginId).sort((left, right) => {
        const orderDifference = (left.order ?? 100) - (right.order ?? 100)
        return orderDifference !== 0 ? orderDifference : left.id < right.id ? -1 : left.id > right.id ? 1 : 0
      })
    },
    set<T = unknown>(id: string, value: T): void {
      const definition = definitions.get(id)
      if (definition === undefined) throw new Error(`[dock] unknown setting "${id}"`)
      const safeValue = cloneJsonSafe(value)
       const valid = definition.validate(safeValue)
      
      const next = valid ? safeValue : cloneJsonSafe(definition.defaultValue)
      if (Object.is(values.get(id), next)) {
        if (!valid) {
          persisted[id] = next
          persist()
        }
        return
      }
      values.set(id, next)
      persisted[id] = next
      persist()
      notify()
```

</details>

**依据 5 · 源码核查**：[src/client/service.ts:225-243](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L225-L243)

假设来自异步gate。

<details>
<summary>查看原文（19行）</summary>

```text
   * Evaluate the instance's view-defined `beforeClose` gate. No hook → the
   * gate is trivially allowed; a synchronous `false` cancels; a synchronous
   * `true`/`undefined` allows; a promise defers the decision to its
   * resolution (any non-`false` value allows). Shared by `closeViewInstance`
   * and `openView` so replacing an instance's content (switching files) is
   * gated exactly like closing it — a dirty editor must confirm before its
   * content is discarded.
   */
  const evaluateBeforeClose = (entry: CloseRequest): BeforeCloseResult => {
    const beforeClose = editorViews.get(entry.viewId)?.beforeClose
    if (beforeClose === undefined) return { kind: 'allowed' }
    const verdict = beforeClose(entry)
    if (typeof verdict === 'object' && verdict !== null && typeof (verdict as Promise<boolean>).then === 'function') {
      return {
        kind: 'pending',
        then(onAllow) {
          void (verdict as Promise<boolean>).then((allow) => { if (allow !== false) onAllow() })
        },
      }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁适合试用，什么情况停止？

**研究主题**：采用判断

#### 完整回答

推荐trial，优先服务有多个DSH视图需要统一接线的开发者和明确组合需求的读者。只需一个简单面板时新增基座不一定有净收益。先装基座再按需单独核查功能插件，不沿README批量安装命令将全部组合当必需。

继续探讨可先用无I/O注册view检查生命周期、session上下文与异步关闭，再选择一个可信功能插件。若上下文错位、旧确认关闭新内容、Promise拒绝未可见、停用残留或localStorage错误造成恢复预期落空，应停止扩展并保留原配置。Q02异步边界和Q03成本结果会影响扩大范围，本轮只检查源码。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-14](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/index.ts#L1-L14)

基座功能范围。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Host half of dock — currently an empty shell.
 *
 * The base owns the *window* (client layout shell + registry service); all
 * feature domains (fs / git / terminal / ...) live in feature plugins with
 * their own host routes. Layout persistence happens on the client
 * (localStorage), so the host half has no routes yet.
 */
export const name = 'dock-base'

/** No host-side services required yet. */
export function apply(): void {
  // Intentionally empty: all behavior lives in the client half.
}
```

</details>

**依据 2 · 源码核查**：[src/client/service.ts:225-243](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/service.ts#L225-L243)

异步关闭限制。

<details>
<summary>查看原文（19行）</summary>

```text
   * Evaluate the instance's view-defined `beforeClose` gate. No hook → the
   * gate is trivially allowed; a synchronous `false` cancels; a synchronous
   * `true`/`undefined` allows; a promise defers the decision to its
   * resolution (any non-`false` value allows). Shared by `closeViewInstance`
   * and `openView` so replacing an instance's content (switching files) is
   * gated exactly like closing it — a dirty editor must confirm before its
   * content is discarded.
   */
  const evaluateBeforeClose = (entry: CloseRequest): BeforeCloseResult => {
    const beforeClose = editorViews.get(entry.viewId)?.beforeClose
    if (beforeClose === undefined) return { kind: 'allowed' }
    const verdict = beforeClose(entry)
    if (typeof verdict === 'object' && verdict !== null && typeof (verdict as Promise<boolean>).then === 'function') {
      return {
        kind: 'pending',
        then(onAllow) {
          void (verdict as Promise<boolean>).then((allow) => { if (allow !== false) onAllow() })
        },
      }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:18-32](https://github.com/AKS1st/dock/blob/8535f6e24670931d9e93fb087ab474e38aa01856/src/client/index.ts#L18-L32)

活动会话契约与先provide。

<details>
<summary>查看原文（15行）</summary>

```text
 * The shell resolves the active Session from `uiSession`, whose scope adapter
 * is the view owner's selection source; waiting for it keeps every view's
 * sessionId correct on its first render instead of racing boot order.
 */
export const inject: string[] = ['uiSession']

/** Client plugin body. */
export function apply(ctx: WorkbenchContext): void {
  // Publish the registry BEFORE the shell mounts so feature plugins
  // injecting 'workbench' are ready by the time the shell renders.
  const store = createLayoutStore()
  const settings = createSettingsStore()
  const service = createWorkbenchService(store, settings)
  ctx.provide('workbench', service)

```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
