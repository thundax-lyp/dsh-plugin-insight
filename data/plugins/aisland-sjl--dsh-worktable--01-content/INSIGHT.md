# dsh-worktable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6cb86b6](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content)

<!-- BEGIN META -->
[![GitHub ★ 781](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=781&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **实现功能**：在Harness侧栏提供项目容器、分栏窗口、会话绑定与控制室，挂载文件、终端和任务产物。

> **核心亮点**：以显式项目/窗格/绑定所有权代替“文件夹相同即项目相同”，并把宿主会话状态与多窗工作区相连，减少旧结果串挂；贡献是组织与生命周期边界，不是文件系统隔离。参见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：客户端所有权校验不约束Host文件权限，文件读取/写入使用用户或产物路径，PTY继承process.env；多个项目改同一真实文件仍互相影响。撤销持久化失败只在内存生效，刷新后状态需核对；作者也未完成全部审批/子代理/挂载业务验收。参见[Q03](#research-q03)。

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
  - [Q01 · 谁需要工作台内容组件，相对手工或宿主原生办法增加什么？](#detail-section-11)
  - [Q02 · 文件编辑、分屏与会话集成如何从入口形成完整调用链，依赖失效怎么办？](#detail-section-12)
  - [Q03 · 什么实现边界最可能使工作台内容组件的贡献不成立，哪些工程设计可复用？](#detail-section-13)
  - [Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？](#detail-section-14)
  - [Q05 · 可从文件编辑、分屏与会话集成的限制推导什么可证伪改进？](#detail-section-15)
  - [Q06 · 哪些用户可以受控采用工作台内容组件，何时应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给同时处理多个Agent项目/会话的人，将文件、终端、网页和产物窗口收在项目容器中；合格交付是项目/窗格/会话绑定不串挂、状态可解释，不能仅看控制室灯变绿。

宿主原生会话加普通窗口/文件管理可替代主要任务；插件价值在项目组织和当前产物挂载，需同任务衡量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 项目容器与控制室 | 项目/会话绑定及状态总览 | Host状态镜像非业务验收 |
| 分栏/标签布局 | 组织多类窗口 | localStorage按浏览器来源保存 |
| 资源管理器 | 列目录并打开文件 | Host可读权限，不是沙箱 |
| Markdown保存 | 编辑本地文本 | 直接写路径，需备份与授权 |
| 项目目录创建 | 建立工作目录 | Host文件权限 |
| 终端窗 | 交互Shell | ws/node-pty，完整环境和用户权限 |
| Git状态窗 | 只读查看仓库变化 | git可用及工作目录 |
| 本地站点/网页窗 | 预览HTML与资源 | 页面可联网，路径边界依Host |
| 自定义产物挂载 | 接收当前任务窗口结果 | project/pane/binding/session/folder须一致 |
| 会话打开/新建 | 关联宿主对话 | 新宿主未分组空会话受限 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22与声明兼容Harness | 必需 | 加载Host和客户端 | 兼容仅0.1.1-rc.2/0.1.2-rc.1/0.2.0-rc.2 |
| Web slots与会话服务 | 必需 | 项目容器/会话打开 | 接口漂移可能使绑定/界面失败 |
| 浏览器localStorage | 持久界面必需 | 项目、布局和所有权绑定 | 来源之间不同步，失败需明确处理 |
| Host文件权限与可信会话/产物 | 对应窗口必需 | 读取、保存和自动挂载 | 不是沙箱，路径可来自结果 |
| ws/node-pty与Shell | 终端可选 | 完整交互终端 | 缺失仅终端降级，继承完整环境 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 按web/desktop对应CLI安装并完整重启 | 核实际DSH_HOME与兼容版本 |
| 2 | 建项目、选目录并绑定可用会话 | 项目/窗格独立ID正确，未分组限制如实显示 |
| 3 | 从目标自定义窗发任务建立握手 | 只接收本binding结果，不读旧根manifest |
| 4 | 检查实际产物与会话状态后验收 | Host完成状态不等于业务合格 |
| 5 | 关闭/重绑/换目录后核旧绑定失效 | localStorage失败或刷新后须复核撤销持久性 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地包/宿主/存储，金额未知 | 配置多项目布局、目录与会话 | 网页/桌面来源设置不同步 |
| 持续使用 | PTY/Shell、网页自身请求、媒体与产物读取 | 维护窗口和实际文件归属 | 状态订阅不调用模型不代表整个任务无token |
| 失败恢复 | 重复任务、文件备份和浏览器状态恢复 | 核旧握手/串挂/关闭与重绑 | 多个项目写同一实际文件仍可能互相覆盖 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 项目隔离挂载 | 三重ID+session/folder当前检查 | 完整审批/子代理/自动挂载业务链 |
| 界面集中 | 多窗与宿主状态镜像 | 净节时、复杂项目下可理解性 |
| 平台支持 | 作者报告Windows定向验收 | macOS真机及完整桌面业务未验收 |

> **思考**：客户端所有权校验不约束Host文件权限，文件读取/写入使用用户或产物路径，PTY继承process.env；多个项目改同一真实文件仍互相影响。撤销持久化失败只在内存生效，刷新后状态需核对；作者也未完成全部审批/子代理/挂载业务验收。参见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以显式项目/窗格/绑定所有权代替“文件夹相同即项目相同”，并把宿主会话状态与多窗工作区相连，减少旧结果串挂；贡献是组织与生命周期边界，不是文件系统隔离。参见[Q01](#research-q01)、[Q02](#research-q02)。

以显式项目/窗格/绑定所有权代替“文件夹相同即项目相同”，并把宿主会话状态与多窗工作区相连，减少旧结果串挂；贡献是组织与生命周期边界，不是文件系统隔离。参见[Q01](#research-q01)、[Q02](#research-q02)。

显式project/pane/binding与session/folder一致性、创建持久失败回滚值得复用；撤销失败可见性、内容版本和业务验收需另外设计，实际文件不是自动隔离。

<a id="detail-section-5"></a>

### 1.4 主要限制

客户端所有权校验不约束Host文件权限，文件读取/写入使用用户或产物路径，PTY继承process.env；多个项目改同一真实文件仍互相影响。撤销持久化失败只在内存生效，刷新后状态需核对；作者也未完成全部审批/子代理/挂载业务验收。参见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合愿管理本地目录和会话的Windows个人开发者先用两个低风险项目试用；macOS、多人/高权限共享服务和要求完整自动交付者先观察。先验绑定及实际文件，再启终端和网页；状态错位、旧结果复活或权限不符就停止并恢复备份。参见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

项目/窗格/绑定隔离机制可核；全链业务、macOS和持久撤销失败恢复未验证。

- 已检查：作者 README、包清单、源码路径 01_content/README.md、01_content/package.json、01_content/src/index.ts、01_content/src/client/index.tsx、01_content/src/client/widgetMount.ts、01_content/src/client/hostTransport.ts 及固定范围 inventory；组件：01_content。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅分配01_content组件；抽读Host路由/PTY与客户端widget ownership、布局持久和slots，不把仓库根过程文档/其他组件计本插件实现。
- 下一步：隔离双项目核同目录、重绑、关闭、晚到写者和存储满重载；另核真实文件/PTY权限与业务交付，不把静态门当验收。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：0.4.0（[固定提交 6cb86b6](https://github.com/Aisland-SJL/dsh-worktable/tree/6cb86b6c73b3c356373e06cd81e08952542ea040)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可为结果建立内容摘要/生成版本及只读预览收据，把“绑定当前”“文件已变”“业务已验收”分开，并对撤销写失败做可见错误和持久恢复。对照同目录两项目、晚到写者、重绑及存储满，错挂/旧结果复活或额外负担不降就否定；假设未验证。参见[Q05](#research-q05)。

隔离双项目核同目录、重绑、关闭、晚到写者和存储满重载；另核真实文件/PTY权限与业务交付，不把静态门当验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 4 | 565 | 446 | 94 | — |
| .mjs | test | 1 | 72 | 45 | 14 | — |
| .js | source | 2 | 24411 | 23005 | 1945 | — |
| .md | source | 1 | 88 | — | — | 2236 |
| .ts | source | 14 | 2400 | 2088 | 201 | — |
| .tsx | source | 2 | 6500 | 5790 | 500 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-23），可前往 [GitHub Issues](https://github.com/Aisland-SJL/dsh-worktable/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 6cb86b6c73b3c356373e06cd81e08952542ea040 和截止 2026-10-23T01:41:11Z 范围内，工作台内容组件能为明确用户提供什么可核查增量，其关键限制、总成本和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要工作台内容组件，相对手工或宿主原生办法增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

多项目Agent用户需要同时看文件、对话和产物，原办法是多个独立窗口/手工标签。工作台提供agent级项目抽屉与分栏，控制室镜像宿主状态。合格输出是正确项目的当前产物和可工作的会话，不能从“完成”镜像推断业务通过；真正增量是显式绑定所有权与撤销，而非重做官方会话或提供沙箱。

#### 证据与依据

**依据 1 · 作者声明**：[01_content/README.md:5-17](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/README.md#L5-L17)

作者项目容器及技术底座

<details>
<summary>查看原文（13行）</summary>

```text
## 是什么

- **侧边栏「工作台」区块**：收纳用户自建项目与入驻插件项目，支持改名/图标/排序/显示隐藏、项目 × 对话绑定、项目文件夹。
- **分栏工作区引擎（自研）**：声明式布局预设（左栏/顶行/主行 + 右侧对话窗），窗格可拖拽分割、标签页模型；内置 资源管理器 / 终端 / 浏览器 / 动画 / 自定义窗口。
- **控制室**：默认自带项目（固定首位、不可删除），项目卡片网格镜像可见绑定项目的宿主状态（工作中/待你决定/已完成）；状态订阅不调用模型，计时与预览另有刷新机制。
- **项目独立挂载**：窗口任务使用项目 ID、窗格 ID 与绑定 ID 对应的专属结果文件；同一文件夹里的新项目仍从空白窗口开始，不自动读取其他项目的旧结果。
- **平台**：Windows 是本轮验证平台，范围见下方兼容说明；macOS 为实验性支持（核心文件路径代码已做跨平台适配，尚未真机端到端验证）。

## 技术底座

- Cordis 插件协议（客户端 bundle + 服务端路由 /api/worktable/*、终端 WebSocket）。
- 界面经 slot 座位协议注入侧边栏与 shell.overlay；对话窗复用宿主会话服务（新版 uiWorkspace.openSession，旧版 sessions.open）。
- 状态监控为宿主会话运行时快照的事件订阅镜像；视图/项目/绑定状态存 localStorage。
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:103-118](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L103-L118)

当前绑定校验和结果匹配

<details>
<summary>查看原文（16行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件编辑、分屏与会话集成如何从入口形成完整调用链，依赖失效怎么办？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端slots注入侧栏和shell.overlay并把项目/布局存localStorage，绑定宿主会话后自定义任务创建独有manifest路径；resolve先核project/pane/binding/session/folder再接受html/url/file。Host提供fs/file/write/mkdir/site及PTY，终端从宿主加载可选ws/node-pty。需兼容Web/desktop接口与浏览器存储，用户按对应CLI安装重启、建项目绑定、显式发自定义任务，旧关联或读取失败需核待办而非强挂。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:35-39](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L35-L39)

绑定专属manifest路径

```text
export function widgetManifestPath(binding: WidgetBinding): string {
  // Binding-specific files also keep late writers from overwriting a newer binding's result.
  return joinPath(binding.folder, joinPath('.dsh-worktable', joinPath(
    'project-' + encodeURIComponent(binding.projectId),
    'pane-' + encodeURIComponent(binding.paneId) + '-' + binding.bindingId + '.json',
```

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:73-91](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L73-L91)

建立与持久化所有权

<details>
<summary>查看原文（19行）</summary>

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
    return this.entries(projectId).filter((b) => b.sessionId === sessionId)
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:103-118](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L103-L118)

接受当前结果条件

<details>
<summary>查看原文（16行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
```

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:198-227](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L198-L227)

可选终端依赖与Shell

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么实现边界最可能使工作台内容组件的贡献不成立，哪些工程设计可复用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最关键是界面隔离是否被误读为实际文件隔离。Host file直接pathResolve读本机路径，PTY传process.env，结果manifest也可指任意非空path，用户必须信任任务与权限边界；报告不把它当已证实漏洞。撤销本地存储失败被catch，内存有效但重载持久性未保。工程可借鉴binding ID拒晚到旧结果，需补可见写失败与明确业务验收状态；跨平台和全链验收仍有限。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/index.ts:267-288](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L267-L288)

直接文件读取及大小门

<details>
<summary>查看原文（22行）</summary>

```text
  // 本地文件读取（资源管理器点击 .html 后浏览器标签内打开）
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
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:216-227](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L216-L227)

完整环境Shell

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:93-118](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L93-L118)

撤销写失败与结果匹配

<details>
<summary>查看原文（26行）</summary>

```text
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
  }
  revokeProject(projectId: string) {
    if (!this.records[projectId]) return
    for (const b of this.entries(projectId)) this.revokePane(projectId, b.paneId)
  }
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
```

</details>

**依据 4 · 作者声明**：[01_content/README.md:19-25](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/README.md#L19-L25)

作者验证范围与未完成链

```text

## v0.4.0：兼容与验证范围

- DSH 网页端兼容声明仅列 **0.1.1-rc.2 / 0.1.2-rc.1 / 0.2.0-rc.2**，不是对任意新旧版本的保证。
- Windows + 0.2.0-rc.2 网页端已有冷启动、工作台/控制室、新建绑定与短文本回复、关闭回切等验收基础；桌面主要页面与交互已点测，共目录串挂修复获用户确认。最终包经过 98 项源码回归、独立安装与客户端加载门禁；这些检查不等于完整桌面端业务验收。旧版沿用此前页面验收并补定向代码回归，未重跑整套旧版 GUI。
- 实际审批、子代理、自动挂载全链路尚未完成业务验收；macOS 未真机验证。升级后请完整重启 DSH 并刷新页面，仍加载失败需保留完整错误。

```

#### 缺口

- 外层路由认证、刷新撤销与macOS业务链未本轮验收
  **影响**：不能给共享部署或跨平台保证
  **进一步探讨**：隔离环境核Host认证及存储满重载、重绑和晚到结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完成一次合格任务的首次、持续和恢复负担是什么？

**研究主题**：效果与总成本

#### 完整回答

首次需对齐profile/DSH_HOME及布置项目窗口；持续付PTY/网页自身网络、产物IO和界面整理人工，实际模型任务另计；失败需核会话、manifest和实际文件，恢复浏览器存储或文件备份。同文件夹不同绑定可避免串挂，却不能阻止主动写同文件。没有端到端节时/正确交付或金额实测，不能按状态订阅零token推断整任务零成本。

#### 证据与依据

**依据 1 · 作者声明**：[01_content/README.md:32-36](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/README.md#L32-L36)

来源设置及同实际文件边界

```text
- 自动挂载只接收经「自定义」任务登记的项目/窗口结果，握手文件位于项目目录的 `.dsh-worktable/project-<项目 ID>/` 下。换目录、重绑项目、修改布局或手动关闭/替换窗口内容后，旧关联不再自动补挂。
- 同一项目的不同会话只得到和更新各自关联的窗口；同会话追改同名作品可以重新加载。补挂读取失败保留待办，下次打开可重试，成功后才清除。
- 已保存的旧窗口与产物文件保留；根目录旧 `widget-result.json` 不再自动导入。旧对话若需继续自动挂载，请从目标窗口的「自定义 → 发送到会话」发一次任务以建立新关联，随后可在同一对话直接继续修改。不自动清除此前误挂的标签；多个项目主动改写同一实际文件时，文件内容仍可能互相影响。
- 两端共享同一 DSH_HOME 时不必复制会话；项目/布局/媒体和外观设置按浏览器来源保存，不会自动从网页来源同步到桌面来源。不要复制整个浏览器配置或登录状态。

```

**依据 2 · 源码核查**：[01_content/src/index.ts:416-428](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/index.ts#L416-L428)

直接写本地文件

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[01_content/src/client/widgetMount.ts:89-97](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L89-L97)

创建持久失败回滚与撤销内存降级

```text
    this.records[projectId] = next
    try { this.persist() } catch (error) { if (before) this.records[projectId] = before; else delete this.records[projectId]; throw error }
    return this.entries(projectId).filter((b) => b.sessionId === sessionId)
  }
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
```

#### 缺口

- 多项目任务总工时、串挂频率和恢复投入未知
  **影响**：无法量化多窗优于普通窗口管理
  **进一步探讨**：同项目组对照普通窗口与工作台，计入配置和恢复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可从文件编辑、分屏与会话集成的限制推导什么可证伪改进？

**研究主题**：新假设与验证

#### 完整回答

未验证方案在当前三重ID上增加内容版本收据与撤销失败告知。绑定匹配只能说明“属于当前窗”，文件随后可变；应显示当前摘要/任务版本并把业务验收另记，不把Host idle当成功。用同目录双项目、旧写者、换目录、存储满重载对照，错挂或旧授权复活不减即否定，新增manifest版本与人工确认成本要观察。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/widgetMount.ts:103-118](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L103-L118)

当前检查无内容摘要和验收字段

<details>
<summary>查看原文（16行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
```

</details>

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:93-97](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L93-L97)

撤销持久失败处理切入点

```text
  revokePane(projectId: string, paneId: string) {
    const b = this.records[projectId]?.[paneId]
    if (!b || !b.enabled) return
    this.records[projectId] = { ...this.records[projectId], [paneId]: { ...b, enabled: false } }
    try { this.persist() } catch { /* Revocation takes effect in memory even if storage is full. */ }
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些用户可以受控采用工作台内容组件，何时应停止？

**研究主题**：采用判断

#### 完整回答

Windows个人开发者可先建两个低风险项目，核目录/会话/窗格与关闭后旧结果不再挂，确认后才启高权限终端和外部网页。macOS或多人远程部署先观察，作者也未完成全部审批/子代理业务。出现错会话、旧结果复活或文件权限超预期就停用相关窗口并查持久事实，不用重发任务掩盖未知结果。

#### 证据与依据

**依据 1 · 作者声明**：[01_content/README.md:19-25](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/README.md#L19-L25)

平台与业务验证边界

```text

## v0.4.0：兼容与验证范围

- DSH 网页端兼容声明仅列 **0.1.1-rc.2 / 0.1.2-rc.1 / 0.2.0-rc.2**，不是对任意新旧版本的保证。
- Windows + 0.2.0-rc.2 网页端已有冷启动、工作台/控制室、新建绑定与短文本回复、关闭回切等验收基础；桌面主要页面与交互已点测，共目录串挂修复获用户确认。最终包经过 98 项源码回归、独立安装与客户端加载门禁；这些检查不等于完整桌面端业务验收。旧版沿用此前页面验收并补定向代码回归，未重跑整套旧版 GUI。
- 实际审批、子代理、自动挂载全链路尚未完成业务验收；macOS 未真机验证。升级后请完整重启 DSH 并刷新页面，仍加载失败需保留完整错误。

```

**依据 2 · 源码核查**：[01_content/src/client/widgetMount.ts:103-118](https://github.com/Aisland-SJL/dsh-worktable/blob/6cb86b6c73b3c356373e06cd81e08952542ea040/01_content/src/client/widgetMount.ts#L103-L118)

采用验收应核具体所有权

<details>
<summary>查看原文（16行）</summary>

```text
  isCurrent(binding: WidgetBinding, spec: WidgetSpec | null | undefined, folder: string | undefined): boolean {
    const current = this.records[binding.projectId]?.[binding.paneId]
    return !!current?.enabled && current.bindingId === binding.bindingId && current.sessionId === binding.sessionId &&
      current.folder === folder && binding.folder === folder && spec?.id === binding.projectId &&
      widgetTargets(spec).filter((t) => t.pane.id === binding.paneId).length === 1
  }
  resolve(binding: WidgetBinding, raw: string, spec: WidgetSpec | null | undefined, folder: string | undefined):
    { target: WidgetTarget; item: { kind: 'html' | 'url' | 'file'; path: string } } | null {
    if (!this.isCurrent(binding, spec, folder)) return null
    try {
      const d = JSON.parse(raw)
      if (!d || Array.isArray(d) || d.version !== 2 || d.projectId !== binding.projectId ||
          d.paneId !== binding.paneId || d.bindingId !== binding.bindingId || d.window !== binding.window ||
          !['html', 'url', 'file'].includes(d.kind) || typeof d.path !== 'string' || !d.path.trim()) return null
      const target = widgetTargets(spec).find((t) => t.pane.id === binding.paneId)!
      return { target, item: { kind: d.kind, path: d.path.trim() } }
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
