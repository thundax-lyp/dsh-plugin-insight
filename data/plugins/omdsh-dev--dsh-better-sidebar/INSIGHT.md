# DSH Better Sidebar

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2811573](https://github.com/omdsh-dev/DSH-better-sidebar/tree/2811573c9c0bad51d77db6c3c94d78f5aed8d38a)

<!-- BEGIN META -->
[![GitHub ★ 5,186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C186&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 329,965](https://img.shields.io/static/v1?label=npm+30d&message=329%2C965&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)
<!-- END META -->

> **功能**：在 DSH 原生右侧和底部工作台查看文件、差异与预览，并提供可扩展的侧栏服务。

> **亮点**：将会话文件定位、可查差异和外部预览扩展放进两种共用的工作台。新增可撤销的导览接管让原生标签和自绘面板在同一服务上分工。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：文件目标是路径解析结果，能否操作取决于宿主请求检查与 OS 用户权限。mtime 检查也无法给并发保存提供完整版本锁。[Q02](#research-q02)

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
  - [Q01 · 谁需要双工作台，导览接管怎样影响打开文件的步骤？](#detail-section-11)
  - [Q02 · 通过会话路由后，文件读写受什么约束？](#detail-section-12)
  - [Q03 · 扩展和原生安装如何共存，失败后能否撤销？](#detail-section-13)
  - [Q04 · 怎样在可回退的环境里判断会话工作台是否省时？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 对话中反复查看文件与差异的用户，可以沿当前工作树打开对应预览。

用宿主原生预览和外部编辑器，手工确认文件路径、工作树和当前会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生侧栏与底部工作台 | 按会话查看文件与差异 | 宿主类型与 slots 需匹配 |
| 预览扩展 | 共享第三方 tabs/viewers | 依赖服务接口和注册状态 |
| 文件操作 | 打开及编辑目标文件 | Host 用户及真实目录权限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 0.2.2-rc.2 线调用接口 | 启动 | 挂载 host 和 client | 注册失败或部分界面缺失 |
| 宿主会话及工作树可定位 | 读取 | 判定文件范围 | 改查原生日志与路径 |
| 低权限测试账号 | 试用 | 限制错误路径影响 | 先准备隔离数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户创建可丢弃仓库 | 查重复 bundle 与权限 |
| 定位 | 打开两个工作树的同名文件 | 核对绝对路径和内容 |
| 退出 | 禁用接管或插件 | 原生界面恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 实际资源未知 | 配置版本和隔离账号 | 需核实挂载顺序 |
| 持续 | 客户端预览与目录读取尚未测量 | 路径、文件版本与结果复核 | 并发保存或旧状态可增加排障 |
| 失败恢复 | 额外支出未知 | 回原生入口，恢复测试目录 | 只测试可丢弃内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话定位 | 活动工作树解析 | 误开率 |
| 工作台导航 | 两套同源界面 | 节时与重复切换次数 |
| 文件冲突处理 | mtime 与独立临时写入 | 并发覆盖概率 |

> **思考**：文件目标是路径解析结果，能否操作取决于宿主请求检查与 OS 用户权限。mtime 检查也无法给并发保存提供完整版本锁。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将会话文件定位、可查差异和外部预览扩展放进两种共用的工作台。新增可撤销的导览接管让原生标签和自绘面板在同一服务上分工。[Q01](#research-q01) [Q03](#research-q03)

原生标签注册释放、临时文件写入与版本冲突提示值得复用。聚合安装顺序及宿主权限需独立检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

文件目标是路径解析结果，能否操作取决于宿主请求检查与 OS 用户权限。mtime 检查也无法给并发保存提供完整版本锁。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

个人可在专用低权限账号与可丢弃项目试查同名文件，先比较只读定位。权限、工作树或插件顺序无法核对时退出视图并回到编辑器。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多种界面入口和工作树路径，实际权限、兼容与节时仍无运行证据。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/index.tsx、src/client/native/index.ts、src/fs-operations.ts、src/index.ts、src/path-security.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，只追文件定位、原生导览和注册处置路径。
- 下一步：固定宿主和工作树，交叉比较两种查看流程，主动使同名文件、已删除文件和共享权限成为反例。

**分析版本**

- **仓库**：[omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
- **版本号**：0.32.1（[固定提交 2811573](https://github.com/omdsh-dev/DSH-better-sidebar/tree/2811573c9c0bad51d77db6c3c94d78f5aed8d38a)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把工作树、会话和当前文件的来源一起显示，可能减少同名文件误开。对照原生路径记录正确率与总耗时，若复核和排障抵消收益则停止。[Q04](#research-q04)

固定宿主和工作树，交叉比较两种查看流程，主动使同名文件、已删除文件和共享权限成为反例。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 118 | 17486 | — | — | 377505 |
| .mjs | source | 8 | 1125 | 890 | 195 | — |
| .js | source | 1 | 93 | 58 | 32 | — |
| .ts | source | 179 | 55657 | 37568 | 16098 | — |
| .tsx | source | 73 | 26350 | 18049 | 7377 | — |
| .ts | test | 189 | 47258 | 35897 | 8085 | — |
| .tsx | test | 134 | 40572 | 30685 | 6613 | — |
| .mjs | test | 1 | 227 | 150 | 56 | — |
| .js | example | 1 | 4 | 1 | 3 | — |
| .md | example | 1 | 57 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 153](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=153&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 132](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=132&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 102](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=102&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 对话中打开正确工作树的文件，何时双工作台比原生侧栏和编辑器更易用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要双工作台，导览接管怎样影响打开文件的步骤？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同一会话中频繁查看文件、草稿和差异的人，可用原生右侧和独立底部面板。作者描述的共用服务确实在客户端建 catalog、service 和 native surface，再挂载内置 tabs/viewers。新增 guide 接管使原生右边入口由同一 tab catalog 呈现。有插件市场、工作区或终端服务时才传相应按钮行为，没有这些服务不建立该项动作。关闭 guideTakeover 时释放注册，恢复宿主导览。底部专用类型不会再在原生面板冒出第二个不能绘制的入口。

该设计的增量在会话内切换和扩展复用。单次预览可用原生 UI，大范围重构仍可留在编辑器。正确打开应该回查路径和当前工作树，而不仅看同名文件出现。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-8](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/README.md#L1-L8)

作者把原生侧栏和底部工作台视作同一双界面。

```text
# dsh-better-sidebar

<div align="center">
  <b style="font-size: 1.15em;">A dual workbench for DSH: native right sidebar + self-drawn bottom panel, with the <code>ctx.betterSidebar</code> service open to every plugin</b><br /><br />
  <a href="https://www.npmjs.com/package/dsh-better-sidebar"><img alt="npm version" src="https://img.shields.io/npm/v/dsh-better-sidebar" /></a>
  <a href="https://www.npmjs.com/package/dsh-better-sidebar"><img alt="npm downloads" src="https://img.shields.io/npm/dm/dsh-better-sidebar" /></a>
  <a href="https://github.com/omdsh-dev/DSH-better-sidebar/actions/workflows/ci.yml"><img alt="CI" src="https://github.com/omdsh-dev/DSH-better-sidebar/actions/workflows/ci.yml/badge.svg" /></a>
  <a href="https://github.com/omdsh-dev/DSH-better-sidebar/stargazers"><img alt="GitHub stars" src="https://img.shields.io/github/stars/omdsh-dev/DSH-better-sidebar" /></a>
```

**依据 2 · 源码核查**：[src/client/index.tsx:183-229](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/client/index.tsx#L183-L229)

客户端注册 native surface 和内置 tabs/viewers。

<details>
<summary>查看原文（47行）</summary>

```text
  // One live catalog of host guide cards, shared by the start-page takeover
  // and the settings inventory. It subscribes to the host tab registry and is
  // released with this activation.
  const nativeGuide = createNativeGuideCatalog(ctx)
  ctx.effect(() => () => { nativeGuide.dispose() }, 'dsh-better-sidebar: native guide catalog')
  const nativeSurface = createNativeSurface(ctx, nativeRecords)
  service.setSurface(nativeSurface)
  // The optional dsh-context diagnostics: ONE controller per activation. It
  // re-proves the optional runtime faces itself, so the plugin needs no new
  // inject entry; it is threaded explicitly into the three consumers (the two
  // host slots by closure, the plugin's own React tree through the provider,
  // and the native tab bodies through the native surface's deps). On a
  // deployment without dsh-context it reports `available: false` and every
  // entry point stays absent.
  const diagnostics = createContextDiagnosticsHost(ctx)
  ctx.effect(
    () => registerNativeSurface({
      ctx, store: sidebarStore, service, records: nativeRecords, diagnostics,
      guideCatalog: nativeGuide.catalog,
      reportFailure: (phase, error) => { fail(`native ${phase}`, error) },
    }),
    'dsh-better-sidebar: native right-Sidebar registrations',
  )
  // The bottom workbench's expand/collapse button in DSH's session header
  // (the header's corner seat belongs to the native sidebar's own control).
  ctx.effect(
    () => registerBottomToggle(ctx, sidebarStore),
    'dsh-better-sidebar: bottom-workbench toggle',
  )
  ctx.effect(
    () => () => { nativeSurface.dispose(); service.setSurface(undefined) },
    'dsh-better-sidebar: native right-Sidebar surface',
  )
  ctx.effect(
    () => registerContextDiagnosticsUI(ctx, diagnostics),
    'dsh-better-sidebar: context diagnostics surfaces',
  )
  // The controller holds a child fiber (its runtime-face integration) and a
  // pending-open timer; releasing both is what keeps a disabled plugin — and a
  // hot reload that activates a fresh one — from leaving the old one behind.
  ctx.effect(() => () => { diagnostics.dispose() }, 'dsh-better-sidebar: context diagnostics controller')
  // Register the plugin's own built-in tabs and viewers through the same
  // service (eating our own dogfood). The disposer unregisters them on
  // fiber disposal (HMR-safe).
  ctx.effect(
    () => registerBuiltins(ctx, service),
    'dsh-better-sidebar: register built-in tabs and viewers',
```

</details>

**依据 3 · 源码核查**：[src/client/native/index.ts:335-399](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/client/native/index.ts#L335-L399)

导览接管可撤，Host 服务存在才提供相关动作。

<details>
<summary>查看原文（65行）</summary>

```text
    // The start page: replace the host guide body with the plugin's own grid.
    // Its lifetime follows the `guideTakeover` preference, so turning the
    // switch off unregisters the chain entry and the shipped guide resumes.
    let disposeGuide: (() => void) | undefined
    const syncGuide = (): void => {
      if (guideCatalog === undefined) return
      if (store.getPrefs().guideTakeover === false) {
        if (disposeGuide !== undefined) {
          disposeSafely(disposeGuide, 'the start-page guide takeover')
          disposeGuide = undefined
        }
        return
      }
      if (disposeGuide !== undefined) return
      const catalog = guideCatalog
      try {
        disposeGuide = ctx.slots.inject('sidebar.right.tab.guide', () => {
          try {
            return ctx.slots.register({
              name: 'sidebar.right.tab.guide',
              // Always elect: the shipped guide is the fallback we replace.
              select: () => ({}),
              inject: (sessionId: string) => {
                const scope = typeof sessionId === 'string' && sessionId !== ''
                  ? sessionId
                  : mountedSessionId(ctx)
                const terminals = webTerminals(ctx)
                const navigation = ctx.get('pluginNavigation') as unknown as PluginNavigationFace | undefined
                const workspace = ctx.get('uiWorkspace') as unknown as WorkspaceSessionFace | undefined
                const onBrowsePlugins = typeof navigation?.openList === 'function'
                  ? () => { navigation.openList!() }
                  : undefined
                const onCreatePlugin = typeof workspace?.startSession === 'function'
                  ? () => {
                    workspace.startSession!(undefined, {
                      agentPreset: 'cordis',
                      prompt: t('guideCreatePrompt'),
                      whenDraftExists: 'append',
                    })
                  }
                  : undefined
                const shellMenu = scope !== undefined
                  && terminals?.launchShells !== undefined
                  && terminals?.selectShell !== undefined
                  ? {
                    // Call the methods on the SERVICE: the shell catalog reads
                    // its own remote field, and a detached call throws
                    // "Cannot read properties of undefined (reading 'remote')".
                    launchShells: (signal: AbortSignal) => terminals.launchShells!(scope, signal),
                    selectShell: (path: string) => { terminals.selectShell!(path) },
                  }
                  : undefined
                return {
                  catalog,
                  store,
                  service,
                  ...(shellMenu === undefined ? {} : { shellMenu }),
                  ...(onBrowsePlugins === undefined ? {} : { onBrowsePlugins }),
                  ...(onCreatePlugin === undefined ? {} : { onCreatePlugin }),
                }
              },
            }, NativeGuide)
          } catch (error) {
            reportFailure?.('register start page', error)
            return () => {}
```

</details>

**依据 4 · 源码核查**：[src/client/native/index.ts:584-620](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/client/native/index.ts#L584-L620)

客户端拒绝为底部专用类型复制原生入口。

<details>
<summary>查看原文（37行）</summary>

```text
    /** Bring the live registrations in line with the registry + the settings. */
    const sync = (): void => {
      syncGuide()
      const wanted = new Map<string, () => () => void>()
      for (const descriptor of service.getTabs()) {
        if (!service.isTabEnabled(descriptor.id)) continue
        // A `bottomOnly` type lives in the plugin's own workbench and has no
        // native tab: registering one would put a second capsule in the
        // host's guide for a page it cannot draw (the bottom terminal is the
        // case — the host owns the right-Sidebar `terminal` kind outright).
        if (descriptor.bottomOnly === true) continue
        wanted.set(descriptor.id, () => registerDescriptor(descriptor))
      }
      for (const [descriptorId, registration] of live) {
        // `files` is this module's OWN takeover, never a descriptor (`wanted`
        // only ever holds descriptor ids): its lifetime belongs to the
        // editor-type switch below. Disposing it here on EVERY notification
        // (any prefs/state pulse, a Session switch included) re-mounted the
        // explorer body and lost the tree's own component state — and a
        // re-registration attempted on an already-inactive context (a plugin
        // reload) left the type registered with nobody holding its disposer,
        // so the same id could never be registered again for the rest of the
        // page's life.
        if (descriptorId === FILES_KIND || wanted.has(descriptorId)) continue
        disposeSafely(() => registration.dispose(), `native tab type "${descriptorId}"`)
        live.delete(descriptorId)
      }
      for (const [descriptorId, create] of wanted) {
        if (live.has(descriptorId)) continue
        // One descriptor must not take the rest of the surface down with it:
        // report and continue so the remaining types still register. `create`
        // has already released whatever it managed to install.
        try {
          live.set(descriptorId, { dispose: create() })
        } catch (error) {
          reportFailure?.(`register ${descriptorId}`, error)
        }
```

</details>

#### 缺口

- 不同宿主与其他扩展同时启用的加载体验未执行。
  **影响**：实际导览是否减少切换取决于能显示哪些类型。
  **进一步探讨**：在目标 DSH 版本开关导览并核对文件与底部专用入口。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 通过会话路由后，文件读写受什么约束？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

宿主路由先调用 connection.requestRejection 判断请求能否通过。API 为 POST，路由名被限定在定义的前缀与单层方法。通过验证后，以会话目录、活动 worktree 解释相对目标，允许绝对路径、主目录和折叠后的上级路径。路径处理只是取得目标，操作系统权限才限制最终能触达的范围，隔离 profile 不能收窄 Host 用户实际可访问的目录。

文本写入先解析编码和换行。客户端提供 expectedMtimeMs 时，文件已删除或与预期时间不同返回冲突；然后使用独立临时文件和 rename，减小半写入带来的残留。检查与 rename 之间没有文件版本锁，并发保存仍可能都通过检查后互相覆盖。读取、保存和重命名应结合实际工作树和文件历史，不能靠标签文字推断授权范围或完整事务性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1438-1446](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/index.ts#L1438-L1446)

路由信任委托宿主连接服务。

```text
export function apply(ctx: Context, config?: SidebarConfig): void {
  const resolved = resolveSidebarConfig(config)
  // Connection owns both deployment trust and authentication; never infer or
  // bypass its policy from invocation flags or a copied trust list.
  const fence = (req: SidebarHttpRequest): boolean => ctx.connection.requestRejection(req) === undefined
  // The model-facing open-request registry: queues `sidebar_open` requests
  // per session and pushes them to connected sidebar views over the
  // `/sidebar/ws/agent-opens` socket.
  const agentOpenRegistry = new AgentOpenRegistry()
```

**依据 2 · 源码核查**：[src/index.ts:1630-1646](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/index.ts#L1630-L1646)

只处理受验的 POST 方法路径。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/sidebar/api',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/sidebar/api/') ? pathname.slice('/sidebar/api/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new SidebarError('not-found', 'unknown sidebar API method', 404))
        return
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1730-1742](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/index.ts#L1730-L1742)

取会话工作目录后再定位活动工作树。

<details>
<summary>查看原文（13行）</summary>

```text
        const relativePath = url.searchParams.get('relativePath')
        if (sessionId === null || dir === null || relativePath === null || relativePath.trim() === '') {
          throw new SidebarError('bad-request', 'sessionId, dir, and relativePath are required')
        }
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        const { path, size } = await writeWorkspaceUpload({
          cwd,
          dir,
          relativePath,
          chunks: req,
        })
        writeOk(res, { path, size })
      } catch (error) {
```

</details>

**依据 4 · 源码核查**：[src/path-security.ts:24-41](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/path-security.ts#L24-L41)

词法路径允许绝对、主目录和相对路径。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * The single resolution primitive: session-relative targets resolve under the
 * session cwd, absolute targets stay absolute, and the result is `resolve()`d
 * (lexical `..` collapse). Throws fs-error for a non-absolute result.
 */
export function resolveTarget(cwd: string, target: string): string {
  // #713: `~` names the user's home directory, not a session-relative path —
  // expand it before the join so it is not pasted after the cwd (ENOENT).
  const homeExpanded = target === '~' || target.startsWith('~/') || target.startsWith('~\\')
    ? join(homedir(), target.slice(1))
    : target
  // #646: the ecosystem passes session-relative targets (e.g. `openFile(scope,
  // 'pastes/x.txt')` keeps `pastes/x.txt` in the tab). Join them onto the
  // session cwd before the absolute check so every entry point (fs.read /
  // write / rename / remove / upload, media, html) shares ONE contract.
  const joined = isAbsolute(homeExpanded) ? homeExpanded : join(cwd, homeExpanded)
  return requireAbsolute(resolveSessionPath(cwd, joined))
}
```

</details>

**依据 5 · 源码核查**：[src/fs-operations.ts:221-259](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/fs-operations.ts#L221-L259)

mtime 检查发生于临时文件和重命名前，无 CAS。

<details>
<summary>查看原文（39行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = resolveTarget(cwd, path)
  // Detect the byte encoding AND the line ending BEFORE the temp write, so the
  // save round-trips what the file already used.
  const { encoding, eol } = await fileFormatOf(absolute)
  if (expectedMtimeMs !== undefined) {
    const current = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
    // A NUMERIC baseline can only come from a successful read of a file that
    // existed, so "no stat" is not "nothing to compare" — it means the path was
    // removed (or renamed away) while the draft was open. Reading that as "no
    // gate" wrote the draft back over the user's own deletion and re-created
    // the file (and its parent directory) with no prompt. Creating a file is a
    // different intent with its own entry points (`fs.createFile`, the upload
    // writer), so refusing here costs nothing.
    if (current !== expectedMtimeMs) {
      const why = current === undefined
        ? `no longer exists on disk (expected mtime ${expectedMtimeMs})`
        : `changed on disk since it was loaded (expected mtime ${expectedMtimeMs}, found ${current})`
      throw new SidebarError('fs-conflict', `"${absolute}" ${why}`, 409)
    }
  }
  // Per-request temp name (same pattern as writeWorkspaceUpload): a
  // pid-suffixed name is shared by every concurrent save to the same path,
  // letting two writers interleave into one temp file — and the failure-path
  // rm could delete the other writer's in-flight temp.
  const tmp = join(dirname(absolute), `.${basename(absolute)}.dsh-sidebar-tmp-${randomUUID()}.tmp`)
  try {
    await mkdir(dirname(absolute), { recursive: true })
    await writeFile(tmp, encodeText(restoreEol(content, eol), encoding), { flag: 'wx' })
    await rename(tmp, absolute)
  } catch (error) {
    await rm(tmp, { force: true }).catch(() => {})
    throw new SidebarError('fs-error', `cannot write "${absolute}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  invalidateDirectoryCache(dirname(absolute))
  // The fresh baseline the client adopts after a successful save.
  const mtimeMs = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
  return { ...(mtimeMs !== undefined ? { mtimeMs } : {}) }
```

</details>

#### 缺口

- 共享实例的宿主请求权限以及多用户保存的实际冲突概率未知。
  **影响**：任何可写验证都应使用可丢弃数据，无法许可共享运行号时不启用。
  **进一步探讨**：不同账号和并发编辑分别验证请求拒绝与两个同时持草稿的保存结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 扩展和原生安装如何共存，失败后能否撤销？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

包清单规定 host/client 入口与 Web 注入，Host 依赖四个核心服务。当前 peers 在 0.2.2-rc.2 线，须按固定源码看兼容范围。补丁 guard 只看处理到当前行已可见的其他启用 entry。在聚合行先加载时能防重复，但同 ID 或逆序手工组合尚可能重复路由并终止该树。安全试用时先检查 profile 的 bundles 和人工行。

原生 tabs 按服务的 descriptor 与偏好配对。同步时释放禁用项，单个注册异常会记录并继续。files 接管单独跟随 editor 类型开关，避免任意会话变化导致重新挂载和丢树状态。此机制可给第三方 viewer 复用，但注册释放和 slot API 必须匹配。弹出提示或启动成功只证明其中某项注册，不保证全部外部扩展同时正常。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:95-110](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/package.json#L95-L110)

固定 peers 明确指向当前宿主线。

<details>
<summary>查看原文（16行）</summary>

```text
  "license": "MIT",
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.1.0",
    "@deepseek-ai/schemastery": ">=3.18.5 <4",
    "@deepseek-ai/dsh-agent": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-locale": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-input-trigger": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-host-webserver": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-llm": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-session": "^0.2.2-rc.2",
    "@deepseek-ai/dsh-settings": "^0.2.2-rc.2",
```

</details>

**依据 2 · 源码核查**：[src/index.ts:116-116](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/index.ts#L116-L116)

服务端依赖 webServer、sessions、connection、tools。

```text
export const inject = ['webServer', 'sessions', 'connection', 'tools']
```

**依据 3 · 源码核查**：[cordis.patch.yml:26-42](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/cordis.patch.yml#L26-L42)

bundle 防重只看到当前已启用和不同 ID 的行。

<details>
<summary>查看原文（17行）</summary>

```text
# Aggregate double-mount guard: aggregate bundles (e.g. @linxin666/dsh-web-ui-all)
# may already mount this package under their own entry id (e.g.
# `web-ui-better-sidebar`). Two mounts register /sidebar/api twice and fail the
# whole plugin tree at boot ("duplicate prefix route"). The `!!js` disabled
# expression backs THIS row off when another *enabled* entry already mounts
# `dsh-better-sidebar`; the aggregate instance then owns the sidebar. The
# loader evaluates it when this row is processed (entry-list order, only rows
# before this one are visible), so the aggregate bundle must precede this one
# in `dsh.profile.bundles` — the standard install order, since `dsh plugin add`
# appends new bundles last. The reverse order (this bundle before the
# aggregate) is a known limitation: the guard cannot see rows that come after
# it, and no runtime singleton guard is added. Same-id manual duplicates still
# fail loudly at the loader as before.
- insert:
    - id: better-sidebar
      name: 'dsh-better-sidebar'
      disabled: !!js "[...ctx.loader.entries()].some((e) => e.options.name === 'dsh-better-sidebar' && e.options.id !== 'better-sidebar' && !e.disabled)"
```

</details>

**依据 4 · 源码核查**：[src/client/native/index.ts:584-635](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/client/native/index.ts#L584-L635)

依偏好收敛并局部处理失败，内置 files 由 editor 接管。

<details>
<summary>查看原文（52行）</summary>

```text
    /** Bring the live registrations in line with the registry + the settings. */
    const sync = (): void => {
      syncGuide()
      const wanted = new Map<string, () => () => void>()
      for (const descriptor of service.getTabs()) {
        if (!service.isTabEnabled(descriptor.id)) continue
        // A `bottomOnly` type lives in the plugin's own workbench and has no
        // native tab: registering one would put a second capsule in the
        // host's guide for a page it cannot draw (the bottom terminal is the
        // case — the host owns the right-Sidebar `terminal` kind outright).
        if (descriptor.bottomOnly === true) continue
        wanted.set(descriptor.id, () => registerDescriptor(descriptor))
      }
      for (const [descriptorId, registration] of live) {
        // `files` is this module's OWN takeover, never a descriptor (`wanted`
        // only ever holds descriptor ids): its lifetime belongs to the
        // editor-type switch below. Disposing it here on EVERY notification
        // (any prefs/state pulse, a Session switch included) re-mounted the
        // explorer body and lost the tree's own component state — and a
        // re-registration attempted on an already-inactive context (a plugin
        // reload) left the type registered with nobody holding its disposer,
        // so the same id could never be registered again for the rest of the
        // page's life.
        if (descriptorId === FILES_KIND || wanted.has(descriptorId)) continue
        disposeSafely(() => registration.dispose(), `native tab type "${descriptorId}"`)
        live.delete(descriptorId)
      }
      for (const [descriptorId, create] of wanted) {
        if (live.has(descriptorId)) continue
        // One descriptor must not take the rest of the surface down with it:
        // report and continue so the remaining types still register. `create`
        // has already released whatever it managed to install.
        try {
          live.set(descriptorId, { dispose: create() })
        } catch (error) {
          reportFailure?.(`register ${descriptorId}`, error)
        }
      }
      // The built-in files kind follows the editor type's switch: with the
      // editor disabled the plugin has no explorer to put there.
      const wantsFiles = service.isTabEnabled(EDITOR_KIND)
      const hasFiles = live.has(FILES_KIND)
      if (wantsFiles && !hasFiles) {
        try {
          live.set(FILES_KIND, { dispose: registerFilesKind(service.getTab(EDITOR_KIND)) })
        } catch (error) {
          reportFailure?.(`register ${FILES_KIND}`, error)
        }
      }
      if (!wantsFiles && hasFiles) {
        const takeover = live.get(FILES_KIND)
        live.delete(FILES_KIND)
```

</details>

#### 缺口

- 真实聚合包逆序、多发行版本扩展兼容矩阵未知。
  **影响**：扩展缺席与原生接管失败可能影响整个目标工作流。
  **进一步探讨**：用两个可恢复的 profile 观察先启聚合与后启聚合，并核对注销。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样在可回退的环境里判断会话工作台是否省时？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

从同一个会话中找两个分支均有的同名文件，在可丢弃低权限目录分别用原生与外部编辑器，及 Better Sidebar 路径完成查看文件和差异。合格任务要求活动工作树、绝对路径和实际内容都一致，再记录正确定位率、全部切换、复核和重试时间。可把导览接管开关作为额外变量，在确定只读定位后才考虑对同一个可丢弃文件做保存对照。

假设会话路由和共同工作台能减少误开及切换。若跳转同名文件错误增加、Host 权限超出设计或放大排查，则退回原生侧栏与编辑器。尚无实测速率，也无法从一次点击拆出长期配置与排障总成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1730-1742](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/index.ts#L1730-L1742)

工作树解析可以作为试验核对点。

<details>
<summary>查看原文（13行）</summary>

```text
        const relativePath = url.searchParams.get('relativePath')
        if (sessionId === null || dir === null || relativePath === null || relativePath.trim() === '') {
          throw new SidebarError('bad-request', 'sessionId, dir, and relativePath are required')
        }
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        const { path, size } = await writeWorkspaceUpload({
          cwd,
          dir,
          relativePath,
          chunks: req,
        })
        writeOk(res, { path, size })
      } catch (error) {
```

</details>

**依据 2 · 源码核查**：[src/path-security.ts:29-41](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/path-security.ts#L29-L41)

权限按实际文件系统进一步验证。

<details>
<summary>查看原文（13行）</summary>

```text
export function resolveTarget(cwd: string, target: string): string {
  // #713: `~` names the user's home directory, not a session-relative path —
  // expand it before the join so it is not pasted after the cwd (ENOENT).
  const homeExpanded = target === '~' || target.startsWith('~/') || target.startsWith('~\\')
    ? join(homedir(), target.slice(1))
    : target
  // #646: the ecosystem passes session-relative targets (e.g. `openFile(scope,
  // 'pastes/x.txt')` keeps `pastes/x.txt` in the tab). Join them onto the
  // session cwd before the absolute check so every entry point (fs.read /
  // write / rename / remove / upload, media, html) shares ONE contract.
  const joined = isAbsolute(homeExpanded) ? homeExpanded : join(cwd, homeExpanded)
  return requireAbsolute(resolveSessionPath(cwd, joined))
}
```

</details>

**依据 3 · 源码核查**：[src/client/native/index.ts:335-355](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/client/native/index.ts#L335-L355)

切换 guide 可定义有无接管的条件。

<details>
<summary>查看原文（21行）</summary>

```text
    // The start page: replace the host guide body with the plugin's own grid.
    // Its lifetime follows the `guideTakeover` preference, so turning the
    // switch off unregisters the chain entry and the shipped guide resumes.
    let disposeGuide: (() => void) | undefined
    const syncGuide = (): void => {
      if (guideCatalog === undefined) return
      if (store.getPrefs().guideTakeover === false) {
        if (disposeGuide !== undefined) {
          disposeSafely(disposeGuide, 'the start-page guide takeover')
          disposeGuide = undefined
        }
        return
      }
      if (disposeGuide !== undefined) return
      const catalog = guideCatalog
      try {
        disposeGuide = ctx.slots.inject('sidebar.right.tab.guide', () => {
          try {
            return ctx.slots.register({
              name: 'sidebar.right.tab.guide',
              // Always elect: the shipped guide is the fallback we replace.
```

</details>

**依据 4 · 源码核查**：[src/fs-operations.ts:221-259](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2811573c9c0bad51d77db6c3c94d78f5aed8d38a/src/fs-operations.ts#L221-L259)

需用实际磁盘冲突与内容验证。

<details>
<summary>查看原文（39行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = resolveTarget(cwd, path)
  // Detect the byte encoding AND the line ending BEFORE the temp write, so the
  // save round-trips what the file already used.
  const { encoding, eol } = await fileFormatOf(absolute)
  if (expectedMtimeMs !== undefined) {
    const current = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
    // A NUMERIC baseline can only come from a successful read of a file that
    // existed, so "no stat" is not "nothing to compare" — it means the path was
    // removed (or renamed away) while the draft was open. Reading that as "no
    // gate" wrote the draft back over the user's own deletion and re-created
    // the file (and its parent directory) with no prompt. Creating a file is a
    // different intent with its own entry points (`fs.createFile`, the upload
    // writer), so refusing here costs nothing.
    if (current !== expectedMtimeMs) {
      const why = current === undefined
        ? `no longer exists on disk (expected mtime ${expectedMtimeMs})`
        : `changed on disk since it was loaded (expected mtime ${expectedMtimeMs}, found ${current})`
      throw new SidebarError('fs-conflict', `"${absolute}" ${why}`, 409)
    }
  }
  // Per-request temp name (same pattern as writeWorkspaceUpload): a
  // pid-suffixed name is shared by every concurrent save to the same path,
  // letting two writers interleave into one temp file — and the failure-path
  // rm could delete the other writer's in-flight temp.
  const tmp = join(dirname(absolute), `.${basename(absolute)}.dsh-sidebar-tmp-${randomUUID()}.tmp`)
  try {
    await mkdir(dirname(absolute), { recursive: true })
    await writeFile(tmp, encodeText(restoreEol(content, eol), encoding), { flag: 'wx' })
    await rename(tmp, absolute)
  } catch (error) {
    await rm(tmp, { force: true }).catch(() => {})
    throw new SidebarError('fs-error', `cannot write "${absolute}": ${error instanceof Error ? error.message : String(error)}`, 400)
  }
  invalidateDirectoryCache(dirname(absolute))
  // The fresh baseline the client adopts after a successful save.
  const mtimeMs = await stat(absolute).then(info => info.mtimeMs).catch(() => undefined)
  return { ...(mtimeMs !== undefined ? { mtimeMs } : {}) }
```

</details>

#### 缺口

- 任务耗时、成功率及首次接入时间均未知。
  **影响**：只能做隔离试用，未形成已证实的效率收益。
  **进一步探讨**：同一实际文件任务两条路径交叉计时并验证结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
