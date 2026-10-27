# dsh-worktable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6cb86b6](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040)

<!-- BEGIN META -->
[![GitHub ★ 800](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=800&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **功能**：为 DSH 提供项目分屏工作台与控制室，集中查看会话、文件、终端和窗口。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是多项目会话和窗格统一组织，以及按binding隔离晚到自定义结果；它是管理界面增量，不是新的Agent执行或业务完成证明。

> **主要限制**：[Q03](#research-q03)显示文件读写handler接受原始路径，终端启动真实shell，未在这些段落看到项目级约束。宿主认证未核查，不能断言匿名漏洞，但也不能把浏览器folder或窗口所有权当文件权限；这足以暂缓真实项目采用。

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
  - [Q01 · 项目台对多会话用户提供什么？](#detail-section-11)
  - [Q02 · 状态镜像和自定义窗口怎样避免归错项目？](#detail-section-12)
  - [Q03 · 项目folder是否限制服务端文件与终端？](#detail-section-13)
  - [Q04 · 浏览器本地状态和权限负担怎样影响采用？](#detail-section-14)
  - [Q05 · 显式文件能力绑定能否保留便利并缩小权限？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：并行管理多个Agent项目的用户，可用分屏和会话绑定集中查看状态，但done不代表交付验收。

原生DSH会话加编辑器和多标签可完成同类工作；项目台增加组织层，不是更强Agent或交付验收系统。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 控制室 | 集中查看会话状态 | done不等于交付 |
| 项目窗格 | 绑定会话与自定义结果 | 状态依赖浏览器origin |
| 文件/终端路由 | 操作本机文件与shell | 项目级授权未核清 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH webServer/sessions | 是 | 路由、快照和界面 | 需固定匹配版本 |
| 浏览器localStorage/IndexedDB | 状态持久化必需 | 布局、绑定和媒体 | 不能假设跨origin同步 |
| node-pty/ws | 终端必需 | 本机shell | 缺失则不注册 |
| 授权与备份证据 | 真实项目采用必需 | 文件权限及迁移 | 暂缓采用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 核查 | 先确认宿主权限和备份 | 缺口则保持观察 |
| 准备 | 选正确发行/profile及副本 | 不从root误构建 |
| 查看 | 仅核对会话映射 | done只作状态 |
| 退出 | 保留工程与浏览器状态 | 回原生会话/编辑器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 插件和PTY依赖资源未知 | 匹配profile、设置布局与目录 | root非实际安装目录 |
| 持续 | 会话/自定义任务模型费用未知 | 维护布局和绑定 | 监控本身读快照 |
| 恢复迁移 | 浏览器localStorage/IndexedDB资源 | 备份、换origin重建 | 完整恢复方法未核清 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 状态查看 | 宿主快照映射need/done | done非业务合格 |
| 窗口隔离 | 独立binding结果命名和持久化 | 文件系统权限不是同一边界 |
| 管理收益 | 集中布局与会话绑定 | 节时、漏项和恢复成本 |

> **思考**：[Q03](#research-q03)显示文件读写handler接受原始路径，终端启动真实shell，未在这些段落看到项目级约束。宿主认证未核查，不能断言匿名漏洞，但也不能把浏览器folder或窗口所有权当文件权限；这足以暂缓真实项目采用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02)支持的贡献是多项目会话和窗格统一组织，以及按binding隔离晚到自定义结果；它是管理界面增量，不是新的Agent执行或业务完成证明。

[Q02](#research-q02)先持久化所有权再发自定义任务、绑定版本化结果路径及回滚内存值得借鉴；[Q03](#research-q03)权限边界要由服务端权威管理，不能把UI隔离泛化为安全。移植需宿主会话适配与浏览器持久化策略。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)显示文件读写handler接受原始路径，终端启动真实shell，未在这些段落看到项目级约束。宿主认证未核查，不能断言匿名漏洞，但也不能把浏览器folder或窗口所有权当文件权限；这足以暂缓真实项目采用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 当前观察，先核清精确宿主的HTTP/Upgrade权限与布局媒体备份；不要把项目目录设定当授权。保持原生会话和编辑器可用，重要工程不接文件/终端路由，待边界清楚后再考虑隔离副本。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查快照接线、窗口绑定和文件/PTY路由；未核查匹配宿主统一认证，不断言匿名漏洞或多用户安全。当前观察，能力绑定方案未验证。

- 已检查：作者 README、包清单、源码路径 README.md、01_content/package.json、01_content/src/index.ts、01_content/src/client/index.tsx、01_content/src/client/widgetMount.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库根下01_content实际插件的状态、绑定与文件/终端源码；未执行目标测试或核查宿主统一认证，不作全权限审计。
- 下一步：继续固定宿主认证及项目权限接口，检查跨根和WebSocket来源后再讨论试用；布局收益用同项目切换任务和备份恢复对照，不在本轮执行。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：未声明（[固定提交 6cb86b6](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出复用可信宿主项目根及许可约束文件/终端的未验证接线方案，先查已有接口，再测试跨根、旧binding和撤销后请求；已有等价约束时不重造。

继续固定宿主认证及项目权限接口，检查跨根和WebSocket来源后再讨论试用；布局收益用同项目切换任务和备份恢复对照，不在本轮执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 2668 | — | — | 48892 |
| .mjs | source | 4 | 565 | 446 | 94 | — |
| .mjs | test | 8 | 1702 | 1562 | 79 | — |
| .js | source | 3 | 24412 | 23006 | 1945 | — |
| .ts | source | 14 | 2400 | 2088 | 201 | — |
| .tsx | source | 2 | 6500 | 5790 | 500 | — |
| .cjs | source | 56 | 5614 | 5300 | 348 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分屏项目台如何组织宿主会话，浏览器状态与服务端权限能否支持采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目台对多会话用户提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户同时管理多个Agent项目，反复在聊天、文件、终端和浏览器间切换，项目台把这些窗格与绑定会话放在同一分屏布局，控制室镜像状态以便发现需要介入的项目。相对多标签和手工记项目，会话绑定与统一可见性是具体增量；它不替代Agent本身，也不证明项目已交付。client把pendingInteraction映射need、completed布尔映射done，done只是宿主会话状态而非测试、部署或业务验收。README明确监控不调用模型，不能把这个局部性质扩成整个工作台零模型成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-49](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/README.md#L19-L49)

项目分屏、控制室与浏览器持久化主张。

<details>
<summary>查看原文（31行）</summary>

```text
### 🧩 Sidebar app drawer

- Collects your self-hosted projects (and resident plugins like dsh-travelatlas) in one place
- Rename / icon / reorder / hide each project; per-project folder; **project ↔ conversation binding** — opening a project switches the chat pane to its bound conversation
- Collapse the sidebar and every project becomes a tappable square tile (icon only)

### 🪟 Dockable split workspace

- Declarative layout presets (left column / top row / main grid + right chat pane)
- Draggable dividers, per-pane tabs, per-layout width persistence
- Built-in panes: **file explorer, terminal, browser, animation site, custom window**
- Custom window: send a requirement to a new or existing conversation; the agent builds it and the result auto-mounts into the window (locked)

### 🖥️ Control room (built-in default project)

- A pinned, undeletable first project — bind one management conversation on first open
- A configurable card grid mirrors visible projects: working / needs you / done with available runtime and a cleaned message preview
- Event-driven host snapshot mirroring; status monitoring does not call a model
- Glassmorphism cards, dark / light / system theme, neon status glows and a rotating comet on busy cards

---

## At a glance

| | |
|---|------|
| 🧩 Plugin type | Cordis plugin — host routes + web client, pure additive (no official plugin replaced) |
| 🪟 Workspace engine | Self-built split engine rendered into the host shell overlay seat |
| 💬 Chat pane | Reuses the host conversation; navigation uses the host's new or legacy session API |
| 📡 Status data | Mirror of the host session runtime snapshots (subscription-driven) |
| 💾 State | Projects/layouts/bindings in localStorage; media in IndexedDB; file panes access configured project directories |
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/index.tsx:939-943](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/index.tsx#L939-L943)

done与need来自会话字段，不等于业务验收。

```text
function sessionNotifyState(entry: any): 'done' | 'need' | null {
  if (!entry) return null
  if (entry.pendingInteraction != null) return 'need'
  if (entry.completed === true) return 'done'
  return null
```

#### 缺口

- 项目切换负担和真实多任务收益未量化
  **影响**：不能说节省多少时间或改善交付率
  **进一步探讨**：在相同多项目任务比较标签页与控制室的遗漏、切换和人工介入时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态镜像和自定义窗口怎样避免归错项目？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

syncSessionScope从list.getSnapshot经adapter取当前会话，读cwd、jobs与subagent目录，并把完整快照同步给控制室监听；状态读取不必额外调用模型。自定义窗口注册表绑定projectId/paneId/folder/sessionId/bindingId，结果文件按project及pane+binding ID独立命名，以免共享文件夹或晚到结果覆盖新绑定。构造时验证记录形状，无法持久化所有权则不继续send，并在持久化失败回滚内存记录。这种显式所有权设计值得借鉴，但浏览器localStorage是配置权威，不能当服务端文件权限。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/index.tsx:954-978](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/index.tsx#L954-L978)

真实宿主快照到当前scope及监听的数据流。

<details>
<summary>查看原文（25行）</summary>

```text
function syncSessionScope(list: any) {
  try {
    const snap = adaptSessionSnapshot(list.getSnapshot(), sessionStatusSource)
    const current = currentSessionOf(snap)
    const entry = snap?.byId?.[current] ?? snap?.items?.find((it: any) => it.sessionId === current) ?? null ?? null
    const cat = snap?.subagentsByParent?.[current]
    let subagents: any[] = []
    if (Array.isArray(cat)) subagents = cat
    else if (cat && Array.isArray(cat.entries)) subagents = cat.entries
    else if (cat && Array.isArray(cat.items)) subagents = cat.items
    else if (cat && Array.isArray(cat.children)) subagents = cat.children
    sessionScopeStore.snapshot = {
      sessionId: current,
      cwd: entry?.cwd ?? '',
      jobs: (snap?.jobsBySession?.[current] ?? []) as any[],
      subagents,
    }
    // 完整快照 + 通知监听（项目卡片提醒镜像）
    try {
      sessionsSnapshotStore.snapshot = snap
      sessionsSnapshotStore.listeners.forEach((l) => { try { l() } catch {} })
    } catch {}
    // 项目×对话联动：项目打开期间切到「非该项目绑定」的会话 → 自动关项目（保留用户新选的会话）
    try {
      if (current !== lastSessionScopeId) {
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:35-65](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L35-L65)

绑定特定路径、记录校验和持久化约束。

<details>
<summary>查看原文（31行）</summary>

```text
export function widgetManifestPath(binding: WidgetBinding): string {
  // Binding-specific files also keep late writers from overwriting a newer binding's result.
  return joinPath(binding.folder, joinPath('.dsh-worktable', joinPath(
    'project-' + encodeURIComponent(binding.projectId),
    'pane-' + encodeURIComponent(binding.paneId) + '-' + binding.bindingId + '.json',
  )))
}

export class WidgetMountRegistry {
  private records: Record<string, Record<string, WidgetBinding>> = Object.create(null)
  private listeners = new Set<() => void>()
  constructor(private storage: Store | null, private makeId = () => newWidgetId()) {
    try {
      const data = JSON.parse(storage?.getItem(WIDGET_BINDINGS_KEY) ?? '{}')
      for (const [projectId, panes] of Object.entries(data ?? {})) {
        if (!panes || typeof panes !== 'object' || Array.isArray(panes)) continue
        const valid: Record<string, WidgetBinding> = Object.create(null)
        for (const [paneId, b] of Object.entries(panes)) {
          const v = b as WidgetBinding
          if (v?.projectId !== projectId || v.paneId !== paneId || typeof v.folder !== 'string' || !v.folder ||
              typeof v.sessionId !== 'string' || !v.sessionId || typeof v.window !== 'string' ||
              typeof v.bindingId !== 'string' || !/^[a-z0-9-]+$/i.test(v.bindingId) || typeof v.enabled !== 'boolean') continue
          valid[paneId] = { ...v }
        }
        if (Object.keys(valid).length) this.records[projectId] = valid
      }
    } catch { /* Invalid registry cannot authorize an old manifest. */ }
  }
  private persist() {
    // A send must not proceed with ownership that cannot survive reload.
    this.storage?.setItem(WIDGET_BINDINGS_KEY, JSON.stringify(this.records))
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:73-90](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L73-L90)

绑定生成与持久化失败回滚。

<details>
<summary>查看原文（18行）</summary>

```text
  begin(projectId: string, spec: WidgetSpec, folder: string, sessionId: string, window: string): WidgetBinding[] {
    if (!this.storage) throw new Error('project storage unavailable')
    if (!folder || !sessionId || spec.id !== projectId) throw new Error('project folder or session unavailable')
    const targets = widgetTargets(spec)
    const selected = targets.find((t) => t.window === window)
    if (!selected || new Set(targets.map((t) => t.pane.id)).size !== targets.length) throw new Error('project window changed')
    const before = this.records[projectId]
    const next: Record<string, WidgetBinding> = Object.create(null)
    for (const t of targets) {
      const old = before?.[t.pane.id]
      // Unassigned windows can participate in one multi-window result. A manually revoked
      // window stays revoked until explicitly selected for another custom task.
      next[t.pane.id] = t === selected || !old || old.folder !== folder || (old.enabled && old.window !== t.window)
        ? { projectId, paneId: t.pane.id, window: t.window, folder, sessionId, bindingId: this.makeId(), enabled: true }
        : old
    }
    this.records[projectId] = next
    try { this.persist() } catch (error) { if (before) this.records[projectId] = before; else delete this.records[projectId]; throw error }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 项目folder是否限制服务端文件与终端？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

从已读服务端并不能得到这个保证。file路由直接pathResolve查询path后读取最多20MiB文件，write路由对传入path同样解析后writeFile，没有在这些handler内把路径绑定到注册项目根；fs也接受body.path。终端升级按sessionId/cwd解析目录后以process.env启动本机shell并把WebSocket文本写入PTY。已检查这些handler未见各自的身份/项目权限校验，但webServer宿主可能先做统一认证，本轮没有核查该层，故不能断言匿名可利用漏洞。能确定的是“项目文件夹”只是组织配置，不能把它解释成文件系统隔离或安全沙箱。node-pty/ws缺失时终端不注册，其他窗格仍是独立能力。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/index.ts:268-291](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L268-L291)

任意解析路径读取，没有该段项目根包含校验。

<details>
<summary>查看原文（24行）</summary>

```text
  webServer.register({
    kind: 'exact',
    path: '/api/worktable/file',
    handler: async (req: any, res: any) => {
      try {
        const u = new URL(req.url ?? '/', 'http://dsh.internal')
        const p = u.searchParams.get('path') || ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        const abs = pathResolve(p)
        const stat = await import('node:fs/promises').then((m) => m.stat(abs))
        if (stat.size > 20 * 1024 * 1024) { json(res, 413, { error: 'file too large' }); return }
        const data = await readFile(abs)
        const ext = (abs.split('.').pop() || '').toLowerCase()
        const types: Record<string, string> = {
          html: 'text/html; charset=utf-8', htm: 'text/html; charset=utf-8',
          css: 'text/css; charset=utf-8', js: 'text/javascript; charset=utf-8', mjs: 'text/javascript; charset=utf-8',
          json: 'application/json; charset=utf-8', md: 'text/markdown; charset=utf-8', markdown: 'text/markdown; charset=utf-8', txt: 'text/plain; charset=utf-8', log: 'text/plain; charset=utf-8',
          pdf: 'application/pdf', svg: 'image/svg+xml', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif', webp: 'image/webp', bmp: 'image/bmp', ico: 'image/x-icon',
        }
        res.writeHead(200, { 'content-type': FILE_TYPES[ext] ?? 'application/octet-stream', 'cache-control': 'no-store' })
        res.end(data)
      } catch (err) {
        json(res, 404, { error: String(err) })
      }
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:351-363](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L351-L363)

目录路由接受body.path。

<details>
<summary>查看原文（13行）</summary>

```text
  webServer.register({
    kind: 'exact',
    path: '/api/worktable/fs',
    handler: async (req: any, res: any) => {
      try {
        const body = await readJsonBody(req)
        const path = typeof body.path === 'string' && body.path
          ? body.path
          : serverCwd(ctx, body.sessionId, body.cwd)
        json(res, 200, await listDirectory(path))
      } catch (err) {
        json(res, 500, { path: '', entries: [], truncated: false, error: String(err) })
      }
```

</details>

**依据 3 · 源码核查**：[01_content/src/index.ts:414-430](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L414-L430)

写入接受传入path，并无该段版本/项目根约束。

<details>
<summary>查看原文（17行）</summary>

```text
  // 本地文件写入（MD 编辑模式保存回磁盘）
  webServer.register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
        json(res, 200, { ok: true })
      } catch (err) {
        json(res, 500, { error: String(err) })
```

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:196-247](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L196-L247)

依赖探测、PTY启动及输入转发。

<details>
<summary>查看原文（52行）</summary>

```text
/** 终端 WebSocket 升级路由（同步注册 + ctx.effect，同 better-sidebar；node-pty 缺失时不注册） */
function setupTerminal(webServer: any, ctx: any) {
  if (typeof webServer.registerUpgrade !== 'function') return
  const wsMod = loadPkg('ws')
  const ptyMod = loadPkg('node-pty')
  ctx.logger?.info?.('[dsh-worktable] term deps: ws=' + (wsMod ? 'ok' : 'MISSING') + ' node-pty=' + (ptyMod ? 'ok' : 'MISSING'))
  if (!wsMod || !ptyMod) {
    ctx.logger?.warn('[dsh-worktable] 终端路由未注册：ws/node-pty 不可用')
    return
  }
  const WebSocketServer = wsMod.WebSocketServer ?? wsMod.default?.WebSocketServer
  if (!WebSocketServer) return
  const pty = ptyMod.default ?? ptyMod
  const wss = new WebSocketServer({ noServer: true })
  const spawnShell = (): { cmd: string; args: string[] } =>
    process.platform === 'win32'
      ? { cmd: 'powershell.exe', args: ['-NoLogo', '-NoProfile'] } // -NoProfile：跳过用户配置（oh-my-posh 花哨提示符在 xterm 里是乱码，PSReadLine 长输入行不换行被截断）
      : { cmd: process.env.SHELL || '/bin/bash', args: [] }
  const clampDim = (v: number, fallback: number) => Math.min(1024, Math.max(2, Number.isFinite(v) ? v : fallback))

  ctx.effect(() => webServer.registerUpgrade({
    path: '/api/worktable/term',
    handler: (req: any, socket: any, head: any) => {
      wss.handleUpgrade(req, socket, head, (ws: any) => {
        const u = new URL(req.url ?? '/', 'http://dsh.internal')
        const cwd = serverCwd(ctx, u.searchParams.get('sessionId') || undefined, u.searchParams.get('cwd') || undefined)
        const cols = clampDim(Number(u.searchParams.get('cols')), 80)
        const rows = clampDim(Number(u.searchParams.get('rows')), 24)
        let term: any = null
        try {
          const shell = spawnShell()
          term = pty.spawn(shell.cmd, shell.args, { name: 'xterm-256color', cols, rows, cwd, env: process.env })
        } catch (err) {
          try { ws.send('\r\n[worktable] 终端启动失败：' + String(err)) } catch {}
          try { ws.close() } catch {}
          return
        }
        term.onData((d: string) => { try { ws.send(d) } catch {} })
        term.onExit(() => { try { ws.close() } catch {} })
        ws.on('message', (raw: any) => {
          const text = String(raw)
          try {
            const msg = JSON.parse(text)
            if (msg && msg.type === 'resize' && Number.isFinite(msg.cols) && Number.isFinite(msg.rows)) {
              term.resize(clampDim(msg.cols, cols), clampDim(msg.rows, rows))
              return
            }
          } catch {}
          try { term.write(text) } catch {}
        })
        ws.on('close', () => { try { term.kill() } catch {} })
      })
```

</details>

#### 缺口

- 匹配宿主webServer对HTTP及Upgrade的统一认证/来源约束未核查
  **影响**：不能断言匿名漏洞，也不能确认多用户安全
  **进一步探讨**：沿精确宿主注册接口核查认证和WebSocket来源，再用不同项目及未授权会话定向检查拒绝

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 浏览器本地状态和权限负担怎样影响采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

布局、项目及绑定存localStorage，媒体存IndexedDB，工程文件仍在目录；Web与Desktop不同origin不会自动同步，这使切换浏览器、清理站点或升级的恢复成本归用户。首次需匹配宿主和选择正确01_content/发行包，终端还依赖宿主node-pty/ws；持续需维护布局、浏览器状态和宿主API兼容。模型仅在自定义任务/会话发生，不为控制室监控再调模型；费用和耗时未量化。当前建议观察：文件/终端的权限归属缺口会影响真实项目安全，不能仅凭漂亮分屏推荐广泛接入。可先保留截图和配置需求，继续用宿主原生会话及编辑器；待精确宿主权限链及备份/迁移办法核清后，再考虑隔离配置试用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:54-56](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/README.md#L54-L56)

兼容和Desktop验收范围有限。

```text
## Quick start

**v0.4.0** adds Windows official Desktop support within the tested scope below. Web compatibility lists only DSH **0.1.1-rc.2 / 0.1.2-rc.1 / 0.2.0-rc.2**; Desktop checks cover **Windows + 0.2.0-rc.2**. Desktop page checks and targeted regressions do not establish full final-package Desktop end-to-end acceptance. Older versions rely on prior page checks plus code regressions, not a newly repeated full GUI suite. Back up important data and check other plugins before upgrading; GitHub Release is the publication authority.
```

**依据 2 · 作者声明**：[README.md:79-89](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/README.md#L79-L89)

Desktop使用正确profile，origin状态不自动同步。

<details>
<summary>查看原文（11行）</summary>

````text
### Windows official Desktop

Save your tasks, fully exit the app from its menu/tray (closing the window is not enough), replace the installation-directory placeholder, run in PowerShell, then reopen the app manually:

```powershell
& "<Desktop installation directory>\resources\runtime\cli\bin\dsh.cmd" plugin --profile desktop add "https://github.com/Aisland-SJL/dsh-worktable/releases/download/v0.4.0/dsh-worktable-0.4.0.tgz"
```

Use the Desktop-bundled CLI and `desktop` profile, not an unpinned npx or Web CLI. Preserve the actual DSH_HOME. Browser-local projects/layouts/media do not automatically sync between Web and Desktop origins, even when sessions share one data home.

Explicit **Ungrouped** in a custom-window task no longer silently joins a workspace. For a **blank control-room conversation**, the tested DSH 0.2 host disables the ungrouped composer: choose a group or join a usable existing conversation. The plugin explains this and blocks that blank creation, without changing your choice or sending an activation message. An empty existing-group selection cannot silently default either; legacy ungrouped creation stays unchanged.
````

</details>

**依据 3 · 作者声明**：[README.md:123-139](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/README.md#L123-L139)

布局/媒体位置与故障处理负担。

<details>
<summary>查看原文（17行）</summary>

````text
**Q: After a DeepSeek Harness update, the worktable fails to open / the service fails to start?**

Projects, bindings and layouts live in browser localStorage; media lives in IndexedDB, and project files remain in your project directories. Back up important data before changing your installation, and keep the same browser origin when you want to retain its worktable state.

**Case A: Harness works, only the worktable needs updating**

- Open the worktable "Settings" → click "Check now"; when the amber update badge appears next to the worktable title, click it and choose "Copy AI prompt" to hand the upgrade to your AI assistant;
- For Web, re-run the install command (installs the latest published release), then restart dsh web and refresh. Desktop users must follow the Desktop instructions above:

  ```bash
  dsh plugin --profile web add "https://github.com/Aisland-SJL/dsh-worktable/releases/latest/download/dsh-worktable.tgz"
  ```

**Case B: Harness itself is down** (service fails to start / "Failed to load plugins")

- Record the actual DSH version, plugin version, profile/data-home location and the first complete error. Restart the process fully before checking again.
- Missing exports or failed imports require checking the named plugin against the installed host version. A newer host can change APIs; upgrading everything blindly is not a diagnosis.
````

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:196-204](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L196-L204)

终端依赖缺失时降级。

```text
/** 终端 WebSocket 升级路由（同步注册 + ctx.effect，同 better-sidebar；node-pty 缺失时不注册） */
function setupTerminal(webServer: any, ctx: any) {
  if (typeof webServer.registerUpgrade !== 'function') return
  const wsMod = loadPkg('ws')
  const ptyMod = loadPkg('node-pty')
  ctx.logger?.info?.('[dsh-worktable] term deps: ws=' + (wsMod ? 'ok' : 'MISSING') + ' node-pty=' + (ptyMod ? 'ok' : 'MISSING'))
  if (!wsMod || !ptyMod) {
    ctx.logger?.warn('[dsh-worktable] 终端路由未注册：ws/node-pty 不可用')
    return
```

#### 缺口

- 浏览器状态完整导出/导入及宿主权限链未知
  **影响**：不能认定关键项目迁移安全且可恢复
  **进一步探讨**：明确导出、恢复校验和精确宿主认证后，才在非关键副本试用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式文件能力绑定能否保留便利并缩小权限？

**研究主题**：新假设与验证

#### 完整回答

从widget已有project/pane/binding所有权与服务端原始path形成对照，可以推导未验证的能力绑定假设：文件/写入/终端请求先由可信宿主解析项目根与操作许可，再使用相对路径，真实路径复核后执行；浏览器不能自己把folder当授权。这个方案需与宿主现有workspace权限复用，避免双份权威。最小验证是同一界面尝试跨根、符号链接、旧binding和撤销后晚到请求，检查应拒绝操作且正常项目功能不退化。若宿主已完整做等价约束，则本项目只需接线/文档而非重造权限；本轮不把假设视为已确认漏洞修复。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:35-65](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L35-L65)

已有窗口所有权说明绑定机制可复用。

<details>
<summary>查看原文（31行）</summary>

```text
export function widgetManifestPath(binding: WidgetBinding): string {
  // Binding-specific files also keep late writers from overwriting a newer binding's result.
  return joinPath(binding.folder, joinPath('.dsh-worktable', joinPath(
    'project-' + encodeURIComponent(binding.projectId),
    'pane-' + encodeURIComponent(binding.paneId) + '-' + binding.bindingId + '.json',
  )))
}

export class WidgetMountRegistry {
  private records: Record<string, Record<string, WidgetBinding>> = Object.create(null)
  private listeners = new Set<() => void>()
  constructor(private storage: Store | null, private makeId = () => newWidgetId()) {
    try {
      const data = JSON.parse(storage?.getItem(WIDGET_BINDINGS_KEY) ?? '{}')
      for (const [projectId, panes] of Object.entries(data ?? {})) {
        if (!panes || typeof panes !== 'object' || Array.isArray(panes)) continue
        const valid: Record<string, WidgetBinding> = Object.create(null)
        for (const [paneId, b] of Object.entries(panes)) {
          const v = b as WidgetBinding
          if (v?.projectId !== projectId || v.paneId !== paneId || typeof v.folder !== 'string' || !v.folder ||
              typeof v.sessionId !== 'string' || !v.sessionId || typeof v.window !== 'string' ||
              typeof v.bindingId !== 'string' || !/^[a-z0-9-]+$/i.test(v.bindingId) || typeof v.enabled !== 'boolean') continue
          valid[paneId] = { ...v }
        }
        if (Object.keys(valid).length) this.records[projectId] = valid
      }
    } catch { /* Invalid registry cannot authorize an old manifest. */ }
  }
  private persist() {
    // A send must not proceed with ownership that cannot survive reload.
    this.storage?.setItem(WIDGET_BINDINGS_KEY, JSON.stringify(this.records))
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:414-430](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L414-L430)

原始路径写入是需要核对能力范围的具体起点。

<details>
<summary>查看原文（17行）</summary>

```text
  // 本地文件写入（MD 编辑模式保存回磁盘）
  webServer.register({
    kind: 'exact',
    path: '/api/worktable/write',
    handler: async (req: any, res: any) => {
      try {
        if (req.method !== 'POST') { res.writeHead(405); res.end(); return }
        const body = await readJsonBody(req)
        const p = typeof body.path === 'string' ? body.path : ''
        const content = typeof body.content === 'string' ? body.content : ''
        if (!p) { json(res, 400, { error: 'missing path' }); return }
        if (content.length > 20 * 1024 * 1024) { json(res, 413, { error: 'content too large' }); return }
        const abs = pathResolve(p)
        await import('node:fs/promises').then((m) => m.writeFile(abs, content, 'utf8'))
        json(res, 200, { ok: true })
      } catch (err) {
        json(res, 500, { error: String(err) })
```

</details>

#### 缺口

- 宿主已有授权接口与精确集成范围未知
  **影响**：不能直接设计第二套权限并宣称安全
  **进一步探讨**：先固定宿主workspace服务与认证契约，再进行跨根/撤销对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
