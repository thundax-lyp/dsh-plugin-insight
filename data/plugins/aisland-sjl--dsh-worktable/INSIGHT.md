# DSH Worktable

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f98246e](https://github.com/Aisland-SJL/dsh-worktable/tree/f98246ef0cd10173cabfdb4d7070eb245b12b42d)

<!-- BEGIN META -->
[![GitHub ★ 823](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=823&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aisland-SJL/dsh-worktable)
<!-- END META -->

> **功能**：为 DSH 提供组织项目、会话、文件与终端的工作台界面。

> **亮点**：把项目布局、会话与文件/终端窗格组织到工作区。[Q01](#research-q01)

> **主要限制**：认证保护路由而非操作系统沙箱；终端按宿主进程权限执行。[Q03](#research-q03)

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
  - [Q01 · 谁需要工作台，相比原宿主会话有什么额外工作？](#detail-section-11)
  - [Q02 · 终端如何挂接，缺依赖和连接断开如何处理？](#detail-section-12)
  - [Q03 · 认证或预览隔离能否将所有插件和文件访问变成安全沙箱？](#detail-section-13)
  - [Q04 · 如何低风险试用和恢复布局？](#detail-section-14)
  - [Q05 · 能否让用户在迁移前校验工作台布局的可恢复性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多项目并行的 DSH 用户；基线是宿主原会话界面和外部文件工具。[Q01](#research-q01)

宿主原会话界面配合外部终端和文件工具。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作区 | 排列项目与会话 | 浏览器状态需备份 |
| 终端 | 启动宿主账号 shell | 原生依赖和权限 |
| 预览 | 展示项目内容 | 不等于插件沙箱 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 指定 DSH 与 Node 版本 | 必需 | 插件宿主 | 回原界面 |
| ws 和 node-pty | 终端必需 | PTY | 不注册终端 |
| 宿主连接认证 | 私有路由必需 | 请求准入 | 返回拒绝或 503 |
| 浏览器存储及项目目录 | 保存状态需要 | 布局、素材与文件 | 需恢复备份 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 确认版本并备份 | 隔离项目 |
| 试用 | 配置布局及会话 | 验证认证和终端 |
| 恢复 | 检查各类数据 | 异常回原界面 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 兼容宿主和原生模块 | 配置项目与备份 | 版本受限 |
| 持续 | 浏览器和主机资源 | 维护布局、授权 | 节时未测 |
| 恢复 | 备份存储 | 校验状态与文件 | 无恢复实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 组织 | 项目、布局与窗格 | 实际效率 |
| 访问 | 路由鉴权与 PTY 清理 | 完整安全及宿主兼容 |

> **思考**：认证保护路由而非操作系统沙箱；终端按宿主进程权限执行。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把项目布局、会话与文件/终端窗格组织到工作区。[Q01](#research-q01)

终端依赖缺失不注册；每次升级先鉴权，卸载终止连接与进程。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

认证保护路由而非操作系统沙箱；终端按宿主进程权限执行。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先备份不同存储并在隔离项目验证权限、终端及恢复。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持认证与终端注册路径；未运行宿主或恢复实验。

- 已检查：作者 README、包清单、源码路径 README.md、docs/compatibility-and-security.md、01_content/package.json、01_content/src/index.ts、01_content/src/requestAuth.ts、01_content/src/client/index.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 104 文件、无排除和解析错误；静态核查宿主接线和存储，未执行目标。
- 下一步：指定受支持宿主及隔离项目，验证认证拒绝、终端退出和布局恢复。

**分析版本**

- **仓库**：[Aisland-SJL/dsh-worktable](https://github.com/Aisland-SJL/dsh-worktable)
- **版本号**：未声明（[固定提交 f98246e](https://github.com/Aisland-SJL/dsh-worktable/tree/f98246ef0cd10173cabfdb4d7070eb245b12b42d)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：显式布局清单和恢复预览可改善跨浏览器来源迁移，须对照现有持久化及人工备份。[Q05](#research-q05)

指定受支持宿主及隔离项目，验证认证拒绝、终端退出和布局恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 2815 | — | — | 54719 |
| .mjs | source | 4 | 586 | 463 | 96 | — |
| .mjs | test | 14 | 2969 | 2751 | 119 | — |
| .js | source | 3 | 24830 | 23399 | 1955 | — |
| .ts | source | 16 | 2715 | 2350 | 226 | — |
| .tsx | source | 3 | 6548 | 5832 | 503 | — |
| .cjs | source | 56 | 5614 | 5300 | 348 | — |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Aisland-SJL/dsh-worktable/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工作台怎样组织会话和文件，其认证、终端与状态恢复的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要工作台，相比原宿主会话有什么额外工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同时处理多个项目、会话和文件的 DSH 用户可组织布局、绑定和窗格；作者描述复用宿主会话并将布局、项目与绑定保存在浏览器。相对普通会话入口减少跨项目切换的界面操作，但需配置项目路径和布局；单一简单任务可能保持原界面更省事。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:45-54](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/README.md#L45-L54)

作者描述工作台结构、会话和存储。

<details>
<summary>查看原文（10行）</summary>

```text
## At a glance

| | |
|---|------|
| 🧩 Plugin type | Cordis plugin — host routes + web client, pure additive (no official plugin replaced) |
| 🪟 Workspace engine | Self-built split engine rendered into the host shell overlay seat |
| 💬 Chat pane | Reuses the host conversation; navigation uses the host's new or legacy session API |
| 📡 Status data | Mirror of the host session runtime snapshots (subscription-driven) |
| 💾 State | Projects/layouts/bindings in localStorage; media in IndexedDB; file panes access configured project directories |
| 🎨 UI | TypeScript + React (host externals) + vanilla CSS, dark-first with light theme |
```

</details>

**依据 2 · 源码核查**：[01_content/package.json:1-12](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/package.json#L1-L12)

包身份与宿主版本声明。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-worktable",
  "description": "工作台 Worktable：DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）",
  "version": "0.5.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aisland-SJL/dsh-worktable.git",
    "directory": "01_content"
  },
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5"
```

</details>

#### 缺口

- 未运行宿主、客户端、终端或浏览器
  **影响**：不能确认兼容、安全、恢复和实际生产效率
  **进一步探讨**：固定宿主版本，在隔离项目验证权限、终端、预览及状态恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 终端如何挂接，缺依赖和连接断开如何处理？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 注入 webServer 与 sessions；终端仅在升级接口、ws 和 node-pty 可用时注册。升级前逐请求执行认证，选择会话 header.cwd，缺失才使用客户端 cwd 或进程 cwd，再启动当前账号的 shell；卸载时终止连接和终端。是否能工作取决于原生依赖及宿主；cwd 选择不是目录沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/index.ts:63-64](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L63-L64)

宿主依赖。

```text
export const name = 'dsh-worktable'
export const inject = ['webServer', 'sessions']
```

**依据 2 · 源码核查**：[01_content/src/index.ts:135-145](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L135-L145)

工作目录回退顺序。

<details>
<summary>查看原文（11行）</summary>

```text
/** 解析会话工作目录：服务端 header.cwd 优先，其次客户端传入 cwd，最后进程 cwd */
function serverCwd(ctx: any, sessionId?: string, clientCwd?: string): string {
  if (sessionId) {
    try {
      const headerCwd = ctx.sessions?.get?.(sessionId)?.header?.cwd
      if (typeof headerCwd === 'string' && headerCwd) return headerCwd
    } catch {}
  }
  if (typeof clientCwd === 'string' && clientCwd) return clientCwd
  return process.cwd()
}
```

</details>

**依据 3 · 源码核查**：[01_content/src/index.ts:204-225](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L204-L225)

依赖缺失和清理。

<details>
<summary>查看原文（22行）</summary>

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
  let disposed = false
  const terminals = new Set<any>()
  ctx.effect(() => () => {
    disposed = true
    for (const ws of wss.clients ?? []) { try { ws.terminate() } catch {} }
    for (const term of terminals) { try { term.kill() } catch {} }
    terminals.clear()
    try { wss.close() } catch {}
```

</details>

**依据 4 · 源码核查**：[01_content/src/index.ts:227-250](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L227-L250)

认证后升级并启动 shell。

<details>
<summary>查看原文（24行）</summary>

```text
  const spawnShell = (): { cmd: string; args: string[] } =>
    process.platform === 'win32'
      ? { cmd: 'powershell.exe', args: ['-NoLogo', '-NoProfile'] } // -NoProfile：跳过用户配置（oh-my-posh 花哨提示符在 xterm 里是乱码，PSReadLine 长输入行不换行被截断）
      : { cmd: process.env.SHELL || '/bin/bash', args: [] }
  const clampDim = (v: number, fallback: number) => Math.min(1024, Math.max(2, Number.isFinite(v) ? v : fallback))

  ctx.effect(() => webServer.registerUpgrade({
    path: '/api/worktable/term',
    handler: async (req: any, socket: any, head: any) => {
      let rejected = await requestRejection(ctx, req)
      if (disposed) rejected = 503
      if (rejected !== undefined) {
        socket.end(`HTTP/1.1 ${rejected} ${rejectionText(rejected)}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
        return
      }
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

#### 缺口

- 未运行宿主、客户端、终端或浏览器
  **影响**：不能确认兼容、安全、恢复和实际生产效率
  **进一步探讨**：固定宿主版本，在隔离项目验证权限、终端、预览及状态恢复

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 认证或预览隔离能否将所有插件和文件访问变成安全沙箱？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。私有路由逐请求使用宿主 connection.admit，只有 owner 或旧版 operator 放行；服务不可用或异常返回 503。终端 shell 具有宿主进程权限，工作目录回退并不约束文件权限；作者说明预览隔离不等同所有插件隔离。未进行渗透或宿主认证集成测试。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/requestAuth.ts:1-18](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/requestAuth.ts#L1-L18)

认证 owner/operator 和失败关闭。

<details>
<summary>查看原文（18行）</summary>

```text
/** Use the host's current authentication service for every request, never a cached grant. */
export async function requestRejection(ctx: any, req: any): Promise<number | undefined> {
  try {
    const connection = typeof ctx.get === 'function' ? ctx.get('connection') : undefined
    if (!connection) return 503
    if (typeof connection.admit === 'function') {
      const admission = await connection.admit(req)
      if (!admission || typeof admission !== 'object') return 503
      if ('rejection' in admission) return admission.rejection === 401 ? 401 : 403
      const peer = admission.peer
      // 0.2.1 has owner/non-owner principals. 0.2.0 has a single operator Peer.
      if (peer?.principal?.kind === 'owner') return undefined
      if (peer && peer === connection.operator && peer.principal === undefined) return undefined
      return 403
    }
  } catch {}
  // An unavailable or failed security service must not turn into public filesystem access.
  return 503
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:233-250](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L233-L250)

终端路径先验证后启动 shell。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.effect(() => webServer.registerUpgrade({
    path: '/api/worktable/term',
    handler: async (req: any, socket: any, head: any) => {
      let rejected = await requestRejection(ctx, req)
      if (disposed) rejected = 503
      if (rejected !== undefined) {
        socket.end(`HTTP/1.1 ${rejected} ${rejectionText(rejected)}\r\nConnection: close\r\nContent-Length: 0\r\n\r\n`)
        return
      }
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

**依据 3 · 作者声明**：[docs/compatibility-and-security.md:57-63](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/docs/compatibility-and-security.md#L57-L63)

作者说明预览限制及插件隔离边界。

```text
## 对页面开发者的影响

- localStorage、IndexedDB、Cookie 登录、同源 fetch、页面内 iframe/object、弹窗/顶层跳转与标注自动取字可能受限。
- 相对 CSS、JS module 和 JSON fetch 已在夹具页面验证；不能据此保证所有前端库。
- **WebGL/Canvas 图片纹理**还要求图片请求与响应满足跨源条件。仅服务器返回 CORS 头未必足够；加载图片的代码/库也需正确请求。StarMap 的月球纹理路径已在其独立项目中通过 Blob 图片加载与保留隔离修复、验证；这不是工作台包内修复，也不证明所有旧网页纹理都已兼容。
- 自动标注可退为窗口级坐标/用户描述，不承诺从隔离 DOM 获取文字。
- React 组件插件与宿主权限是另一条边界；iframe 隔离不等同把所有已安装插件变成不可信代码沙箱。
```

#### 缺口

- 未运行宿主、客户端、终端或浏览器
  **影响**：不能确认兼容、安全、恢复和实际生产效率
  **进一步探讨**：固定宿主版本，在隔离项目验证权限、终端、预览及状态恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何低风险试用和恢复布局？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包声明仅支持指定三个 DSH 版本及 Node 22 以上，终端还依赖宿主可加载 ws 与 node-pty；配置目录、授权、浏览器来源和备份有维护成本。先隔离项目、确认版本与终端授权，再检查项目布局和数据恢复；作者说明 localStorage、IndexedDB 与项目目录分别存数据，应逐类备份，异常停止并返回原界面。兼容声明和作者回归记录非本轮实测。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/package.json:1-12](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/package.json#L1-L12)

Node 与 DSH 支持范围。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dsh-worktable",
  "description": "工作台 Worktable：DeepSeek Harness 侧边栏的 agent 级项目容器（应用抽屉）",
  "version": "0.5.1",
  "repository": {
    "type": "git",
    "url": "https://github.com/Aisland-SJL/dsh-worktable.git",
    "directory": "01_content"
  },
  "engines": {
    "node": ">=22",
    "dsh": "0.2.0-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.5"
```

</details>

**依据 2 · 源码核查**：[01_content/src/index.ts:204-212](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/index.ts#L204-L212)

终端依赖缺失不注册。

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

**依据 3 · 作者声明**：[README.md:129-133](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/README.md#L129-L133)

作者说明浏览器与项目数据位置。

```text
## Troubleshooting

**Q: After a DeepSeek Harness update, the worktable fails to open / the service fails to start?**

Projects, bindings and layouts live in browser localStorage; media lives in IndexedDB, and project files remain in your project directories. Back up important data before changing your installation, and keep the same browser origin when you want to retain its worktable state.
```

#### 缺口

- 未运行宿主、客户端、终端或浏览器
  **影响**：不能确认兼容、安全、恢复和实际生产效率
  **进一步探讨**：固定宿主版本，在隔离项目验证权限、终端、预览及状态恢复

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否让用户在迁移前校验工作台布局的可恢复性？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：提供用户主动触发的布局清单及恢复前预览，可能降低浏览器来源变更后的配置丢失。现有代码已将项目布局保存在 localStorage，README 已提示同源及分别备份，因而已有持久化与人工备份并非空白；未穷尽等价导入导出功能，也不能假定媒体和项目文件被清单包含。对比既有备份方法，在隔离环境测恢复成功、遗漏项及误覆盖，效果无改善或遗漏/泄露风险过高即否定。

#### 证据与依据

**依据 1 · 源码核查**：[01_content/src/client/index.tsx:350-375](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/01_content/src/client/index.tsx#L350-L375)

项目属性从本地存储解析。

<details>
<summary>查看原文（26行）</summary>

```text
        }
        return Object.keys(out).length > 0 ? out : undefined
      })(),
    }
  } catch {
    return { ...DEFAULT_VIEW }
  }
}

function loadProjects(): ProjectsState {
  try {
    const raw = localStorage.getItem(PROJECTS_KEY)
    if (!raw) return { ...DEFAULT_PROJECTS }
    const p = JSON.parse(raw)
    return {
      order: Array.isArray(p.order) ? p.order.filter((x: unknown): x is string => typeof x === 'string') : [],
      lastUsed: p.lastUsed && typeof p.lastUsed === 'object' ? p.lastUsed : {},
      hidden: Array.isArray(p.hidden) ? p.hidden.filter((x: unknown): x is string => typeof x === 'string') : [],
      nameOverrides: p.nameOverrides && typeof p.nameOverrides === 'object' ? p.nameOverrides : {},
      iconOverrides: p.iconOverrides && typeof p.iconOverrides === 'object' ? p.iconOverrides : {},
      removed: Array.isArray(p.removed) ? p.removed.filter((x: unknown): x is string => typeof x === 'string') : [],
      views: p.views && typeof p.views === 'object' ? p.views : {},
      shortcuts: Array.isArray(p.shortcuts)
        ? p.shortcuts.filter((s: any) => s && typeof s.id === 'string' && typeof s.name === 'string' && typeof s.href === 'string')
        : [],
      layouts: Array.isArray(p.layouts)
```

</details>

**依据 2 · 作者声明**：[README.md:129-133](https://github.com/Aisland-SJL/dsh-worktable/blob/f98246ef0cd10173cabfdb4d7070eb245b12b42d/README.md#L129-L133)

已有备份与同源建议。

```text
## Troubleshooting

**Q: After a DeepSeek Harness update, the worktable fails to open / the service fails to start?**

Projects, bindings and layouts live in browser localStorage; media lives in IndexedDB, and project files remain in your project directories. Back up important data before changing your installation, and keep the same browser origin when you want to retain its worktable state.
```

#### 缺口

- 未运行宿主、客户端、终端或浏览器
  **影响**：不能确认兼容、安全、恢复和实际生产效率
  **进一步探讨**：固定宿主版本，在隔离项目验证权限、终端、预览及状态恢复

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
