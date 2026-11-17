# DSH AionUi Panel

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui) [![npm 30d 7,420](https://img.shields.io/static/v1?label=npm+30d&message=7%2C420&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-aionui-panel) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-aionui-panel)
<!-- END META -->

> **功能**：在 DSH Web 内提供工作区文件树、预览、编辑和 Git 变更面板。

> **亮点**：把工作区预览、相对路径草稿和变更状态接到当前对话，见 [Q01](#research-q01)。

> **主要限制**：授权路径、冲突保护和实际写入边界能否跟上工作区切换？删除和 Git 操作真实生效，见 [Q02](#research-q02)。

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
  - [Q01 · 同屏文件预览和 Agent 如何衔接？](#detail-section-11)
  - [Q02 · 本地面板如何处理真实写入？](#detail-section-12)
  - [Q03 · 怎样判断把文件操作搬进聊天值得？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在本地 DSH 中频繁核对 Agent 文件的开发者，见 [Q01](#research-q01)。

对照独立 IDE 文件树与 Git 面板，比较切换及误操作，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 预览 | 同屏查看工作区文件 | 需受注册目录与可用格式 |
| Git 状态和操作 | 核对及暂存变更 | 使用真实工作区，先检查副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| webServer、workspaceRegistry、subprocess 和 systemPrompt | 宿主启动需 | 提供工作区访问及提示 | 功能未装入 |
| DSH Web 与当前会话 cwd | 界面需 | 绑定工作区 | 无项目面板 |
| Git | 变更视图需 | 状态和写操作 | 预览仍可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 配置本地临时工作区 | 记录原文件及索引状态 |
| 试用 | 切换两个会话并预览 | 命中当前目录和正确草稿 |
| 退出 | 停用插件并核对项目 | 恢复 IDE 工作流 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 持续 | 监听、Git 轮询和文件读取 | 核对冲突和当前项目 | 资源未测 |
| 退出 | 真实工作区已有变更 | 逐项查对和恢复 | 由用户备份和 Git 状态决定 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同屏预览 | cwd 绑定的面板 | 切换是否可靠 |
| 真实文件操作 | 路径检查下的读写 | 错误恢复与并发安全 |

> **思考**：授权路径、冲突保护和实际写入边界能否跟上工作区切换？删除和 Git 操作真实生效，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把工作区预览、相对路径草稿和变更状态接到当前对话，见 [Q01](#research-q01)。

将界面路径与宿主注册工作区分开，保存和递归删除需独立核验，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

授权路径、冲突保护和实际写入边界能否跟上工作区切换？删除和 Git 操作真实生效，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在临时工作区只读试用，若有路径误选或写入风险，返回原 IDE，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持工作区路由和界面，真实宿主和文件竞态尚未运行验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-aionui-panel/package.json、packages/dsh-aionui-panel/tsdown.config.ts、packages/dsh-aionui-panel/cordis.patch.yml、packages/dsh-aionui-panel/README.md、packages/dsh-aionui-panel/src/index.ts、packages/dsh-aionui-panel/src/client/index.ts、packages/dsh-aionui-panel/src/host/routes.ts、packages/dsh-aionui-panel/src/host/fs-service.ts 及固定范围 inventory；组件：packages/dsh-aionui-panel。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定子包宿主、Web 和文件写入，未运行插件或安装构建。
- 下一步：两个工作区、同名文件和编辑冲突标准回放，见 [Q03](#research-q03)。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把只读挂载与带租约的写入分开，比较是否减少误操作及切换，见 [Q03](#research-q03)。

两个工作区、同名文件和编辑冲突标准回放，见 [Q03](#research-q03)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 138 | — | — | 2096 |
| .ts | source | 23 | 4872 | 3595 | 975 | — |
| .tsx | source | 11 | 2374 | 2003 | 245 | — |
| .ts | test | 14 | 2398 | 1955 | 179 | — |
| .tsx | test | 1 | 103 | 72 | 20 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：能否为本地 DSH 会话提供省切换的工作区预览，并把读写控制在预期范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 同屏文件预览和 Agent 如何衔接？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

适合反复检查 Agent 所改文件的本地开发者。与 IDE 文件树和聊天分屏相比，增量是侧栏在会话切换时对应活动 cwd，拖入文件只把相对路径加进当前草稿，用户可以在实际提交前核对。缺会话或输入服务时拖放返回失败。宿主提供 workspaceRegistry、subprocess、systemPrompt 与 webServer，通过注册路由接真实文件和 Git，并向模型描述面板。合格结果是切换两个项目后只预览当前文件，草稿里是相对路径而非自动发送的内容。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-aionui-panel/README.md:25-49](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/README.md#L25-L49)

作者描述 Explorer、预览、Git 及工作区。

<details>
<summary>查看原文（25行）</summary>

```text
## Usage

When a project session (the current session has a working directory) is open, two panels appear to the right of the chat area:

- **Explorer (rightmost column, default 260px, range 220–500px)**: `File / Changes` two tabs; clicking a row in the file tree expands/collapses a folder, clicking a file opens it in the preview panel, and the top filename search (150ms debounce, clicking a result locates it in the tree without interrupting flow); the `Changes` tab reads the real git status and supports stage / unstage / discard (untracked via delete, tracked via restore, bulk discard asks for confirmation).
- **Drag a file to the input box**: file rows in the tree can be dragged (except directory rows); dropping onto the chat input area inserts the relative path (e.g. `deploy/base/deployment.yaml`) at the cursor of the current draft, and the agent reads the file itself once the message arrives — no need to type the path by hand; a highlighted hint bar shows above the input while dragging.
- **Preview (second column from right, default 480px, range 340–1200px)**: multi-tab preview supporting markdown / html / code / diff / csv / pdf / word / excel / ppt / image / text / url; source/preview toggle, split-screen editing (ratio persisted), save (mtime conflict detection), download, refresh (4-state: dead buttons are not rendered), dirty dot, middle-click close, right-click menu batch close (dirty confirm), and tab-overflow gradient indicator.

Interaction details:

- Drag the left edge handle to resize (merged per frame via rAF, body user-select:none); double-click the handle to reset to the default width.
- Two-level width clamping (Explorer first, Preview second) mathematically guarantees the chat area stays >= 360px; out-of-range values are written back to persistence.
- Collapse = width shrinks to 0 while the component stays mounted (tree expanded state / preview tabs are not lost), no transition animation; a floating expand button appears on the right after collapsing.
- Light/dark themes follow the GUI (`body[data-ds-dark-theme]`), and prefers-reduced-motion globally disables animations.
- Preferences persist per project (localStorage keys matching AionUi): `chat-workspace-width-px` / `chat-preview-width-px` / `preview-panel-split-ratio` / `project-panel-collapse:<root>` / `explorer-ui:<root>` / `scm-ui:<root>` / `preview-ui:<root>` (LRU capped at 12 scopes). Reads are always range-checked; invalid values fall back to defaults.

## Data sources

The real filesystem and the real git repository, no mocks:

- The host half (`src/index.ts` + `src/host/`) serves directory listing, file reads (text capped at 80k chars / image data URLs), writes (mtime conflict detection), filename search (skipping .git / node_modules), git status (porcelain v1 -z) / stage / unstage / discard, and an SSE change stream (fs watching + git polling) over the `/aionui-panel/*` HTTP routes.
- All operations pass through a workspace guard: paths must fall inside a registered workspace (realpath normalization + prefix check); the browser can only read/write relative paths under the project root.
- Every `/aionui-panel/*` route (JSON operations, raw reads, and the SSE events stream) is loopback-only: non-loopback clients get `403 forbidden: loopback-only` before any workspace access, matching the dsh-ssh fence.
- The recursive watcher ignores changes under `node_modules` / `.git`; the SCM poll runs every 30s per workspace (each probe bounded by a 15s deadline), and roots that are not git repositories stop being re-probed thanks to a TTL cache. File edits surface via the watcher immediately; `.git`-only changes (commits/checkouts from other tools) appear within one poll interval or on window focus (throttled to once per 5s).
- The browser half (`src/client/`) treats the current session cwd as the project root; switching sessions switches projects.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-aionui-panel/src/index.ts:28-49](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/index.ts#L28-L49)

宿主路由与提示接线。

<details>
<summary>查看原文（22行）</summary>

```text
export const inject = ['webServer', 'subprocess', 'workspaceRegistry', 'systemPrompt']

/** Order of the announcement section within the tool-guidance band. */
const SECTION_ORDER = 210

/** Model-facing announcement: plugin presence, capabilities, and limits. */
export const AIONUI_PANEL_GUIDANCE = '本机已安装 dsh-aionui-panel 插件（DSH Web GUI 的右侧面板系统）：项目会话打开时，聊天区右侧出现「预览」与「文件/变更」两块面板。能力：Explorer 文件树（点击文件在预览面板打开、整行点击展开文件夹、按文件名搜索定位）；Preview 多 tab 预览（markdown/html/code/diff/csv/pdf/office/图片/文本等格式，支持源码/预览切换、分屏编辑、保存）；SCM 变更面板（真实 git stage/unstage/discard）；面板宽度可拖拽调整（Explorer 220~500px、Preview 340~1200px），双击把手复位默认宽度，折叠状态与宽度按项目持久化（localStorage）。数据源为当前会话工作目录的真实文件系统与真实 git 仓库，宿主进程经 /aionui-panel/* 路由提供。用户提到「右侧面板 / 预览面板 / 文件树 / 变更面板」时即指本插件，请据此协作。'

/**
 * Mount the panel data services and their routes.
 * @param ctx - context carrying webServer, subprocess, workspaceRegistry, systemPrompt.
 */
export function apply(ctx: Context): void {
  const gate = createWorkspaceGate(ctx)
  const fs = new FsService(gate)
  const git = new GitService(subprocessRunner(ctx), gate, (root, rel) => fs.delete(root, rel))
  ctx.effect(() => registerPanelRoutes(ctx, fs, git), 'dsh-aionui-panel: /aionui-panel routes')
  ctx.effect(() => ctx.systemPrompt.section({
    name: 'plugin:aionui-panel',
    order: SECTION_ORDER,
    text: AIONUI_PANEL_GUIDANCE,
  }), 'dsh-aionui-panel: prompt section')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-aionui-panel/src/client/index.ts:48-90](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/client/index.ts#L48-L90)

当前会话作用域、草稿和 cwd。

<details>
<summary>查看原文（43行）</summary>

```text
  ctx.inject(['slots', 'conversation', 'sessions'], (scope: ClientContext) => {
    const sessions = scope.sessions
    const conversation = scope.conversation
    scope.slots.inject('conversation.input.dock', () =>
      scope.slots.register({
        name: 'conversation.input.dock',
        id: 'aionui-drag-file',
        order: 90,
        locale: NS,
        inject: (sessionId: SessionId | undefined): DragFileInjected => ({
          insertPath: (path: string): boolean => {
            if (sessionId === undefined) return false
            const actx = sessions.scope(sessionId)
            if (actx === undefined) return false
            const input = conversation.input
            if (input === undefined) return false
            const shell = input.for(actx)
            const draft = shell.state.getSnapshot().draft
            shell.setDraft(insertPathIntoDraft(draft, path))
            return true
          },
        }),
      }, DragFileInlay))
  })

  ctx.effect(() => {
    const api = new PanelApi()
    const stores = createPanelStores(api)
    const layout = new PanelLayoutController(stores.layout)
    const disposers: Array<() => void> = []
    let disposeEvents: (() => void) | undefined
    let currentRoot = ''
    let lastPreviewOpen = false

    // The project root follows the active session's cwd; switching sessions
    // re-binds every store (widths, collapse, tree, tabs persist per root).
    const bindRoot = (): void => {
      const snapshot = ctx.sessions.list.getSnapshot()
      const sessionId = snapshot.current as SessionId | undefined
      const cwd = sessionId === undefined ? undefined : snapshot.byId[sessionId]?.cwd
      const root = typeof cwd === 'string' && cwd !== '' ? cwd : ''
      if (root === currentRoot) return
      currentRoot = root
```

</details>

#### 缺口

- 无跨项目真实 Web 验收
  **影响**：切换、预览及草稿连续性尚未知
  **进一步探讨**：用两个脱敏工作区和同名文件比对

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本地面板如何处理真实写入？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

HTTP 以 socket.remoteAddress 校验 loopback，并结合 Host、Origin 与站点属性检查，POST 还要 JSON。实际工作区由宿主注册表与路径 realpath 约束。保存仅在请求给有效 baseMtime 时作比较，然后实际写文件；现有比较和写入之间有时间差，不能仅靠它断言所有并发写可阻止。删除会递归 rm，Git stage、unstage、discard 调用真实工作区。客户端批量确认不能视为服务端无副作用，移除插件也不会还原已写文件或索引。在有反代、多账号和符号链接竞争时应另验共享边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:65-90](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/routes.ts#L65-L90)

loopback 与同源检查。

<details>
<summary>查看原文（26行）</summary>

```text
 * same-origin markers. The /aionui-panel operations read/write real workspace
 * files and run git, so a LAN-exposed dsh web must not serve them to unpaired
 * devices. The socket address is authoritative; X-Forwarded-For is never
 * trusted (matching dsh-ssh).
 */
function isLoopbackRequest(request: IncomingMessage): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL(`http://${host}`)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
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

**依据 2 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:258-285](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/routes.ts#L258-L285)

GET 原文件、POST JSON。

<details>
<summary>查看原文（28行）</summary>

```text
    // Loopback fence first: never let a LAN client reach any /aionui-panel
    // operation, regardless of method or content-type.
    if (!isLoopbackRequest(req)) {
      forbidden(res)
      return
    }
    if (req.method === 'GET') {
      const url = new URL(req.url ?? '/', 'http://x')
      if (url.pathname === '/aionui-panel/raw') {
        await serveRaw(url, res)
        return
      }
      res.writeHead(405)
      res.end()
      return
    }
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    // Require an explicit JSON content-type: cross-site simple requests (no
    // preflight) cannot set application/json, so this blocks form-based CSRF
    // from driving the fs/git routes.
    const contentType = req.headers['content-type'] ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      json(res, FAIL(BAD_REQUEST), 415)
      return
```

</details>

**依据 3 · 源码核查**：[packages/dsh-aionui-panel/src/host/routes.ts:318-395](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/routes.ts#L318-L395)

实际写入、删除及 Git 变更入口。

<details>
<summary>查看原文（78行）</summary>

```text
      case '/aionui-panel/write': {
        const path = strField(payload, 'path')
        const content = strOrEmpty(payload, 'content')
        if (path === null || content === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const rawBase = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).baseMtime
          : undefined
        const baseMtime = typeof rawBase === 'number' && Number.isFinite(rawBase) ? rawBase : undefined
        const result = await fs.write(root, path, content, baseMtime)
        json(res, 'mtime' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/search': {
        const query = strField(payload, 'query') ?? ''
        const result = await fs.search(root, query)
        json(res, 'hits' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/delete': {
        const path = strField(payload, 'path')
        if (path === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await fs.delete(root, path)
        json(res, 'ok' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/git-status': {
        const result = await git.status(root)
        json(res, result === null ? OK(null) : 'root' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/git-diff': {
        const path = strField(payload, 'path')
        if (path === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const staged = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).staged === true
          : false
        const result = await git.diff(root, path, staged)
        json(res, 'content' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/git-stage': {
        const paths = strArray(payload, 'paths')
        if (paths === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await git.stage(root, paths)
        json(res, 'applied' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/git-unstage': {
        const paths = strArray(payload, 'paths')
        if (paths === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await git.unstage(root, paths)
        json(res, 'applied' in result ? OK(result) : FAIL(result))
        return
      }
      case '/aionui-panel/git-discard': {
        const paths = strArray(payload, 'paths')
        if (paths === null) {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await git.discard(root, paths)
        json(res, 'applied' in result ? OK(result) : FAIL(result))
        return
```

</details>

**依据 4 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:40-77](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/fs-service.ts#L40-L77)

词法和 realpath 路径范围。

<details>
<summary>查看原文（38行）</summary>

```text
const POLL_FALLBACK_MS = 3_000

/**
 * Resolve a relative path against the canonical root, realpath-checking the
 * existing ancestors so a symlink cannot smuggle the operation outside the
 * root. A path that does not yet exist (ENOENT) is verified through its
 * nearest existing ancestor — a nonexistent tail cannot itself be a symlink.
 * A path whose real path escapes the root is rejected with path-outside-root.
 */
async function resolveInsideRoot(root: string, rel: string): Promise<{ ok: true; abs: string } | { ok: false; error: PanelError }> {
  if (rel.includes('\0')) return { ok: false, error: { code: 'path-outside-root', message: 'invalid path' } }
  const abs = join(root, rel)
  if (!isPathInside(root, abs)) {
    return { ok: false, error: { code: 'path-outside-root', message: `path escapes root: ${rel}` } }
  }
  // Walk ancestors until we hit one that exists; validate its real path.
  let probe = abs
  for (let hop = 0; hop < 32; hop += 1) {
    let real: string
    try {
      real = await realpath(probe)
    } catch (error) {
      const code = (error as NodeJS.ErrnoException).code
      // Any other realpath failure (EACCES/ELOOP/...) lets the operation run;
      // the caller's own try/catch maps permission/IO problems to its normal
      // not-found / write-failed codes.
      if (code !== 'ENOENT') return { ok: true, abs }
      // Ancestor does not exist yet; realpath the parent instead.
      const parent = dirname(probe)
      if (parent === probe) return { ok: true, abs }
      probe = parent
      continue
    }
    if (!isPathInside(root, real)) {
      return { ok: false, error: { code: 'path-outside-root', message: `path resolves outside root: ${rel}` } }
    }
    return { ok: true, abs }
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:297-320](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/fs-service.ts#L297-L320)

可选 mtime 比较与写入。

<details>
<summary>查看原文（24行）</summary>

```text
  async write(
    root: string,
    rel: string,
    content: string,
    baseMtime?: number,
  ): Promise<{ mtime: number } | PanelError> {
    const gated = await this.gate(root)
    if (!gated.ok) return gated.error
    if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
    const resolved = await resolveInsideRoot(gated.canonical, rel)
    if (!resolved.ok) return resolved.error
    try {
      let current: Awaited<ReturnType<typeof stat>>
      try {
        current = await stat(resolved.abs)
      } catch {
        current = { mtimeMs: 0 } as Awaited<ReturnType<typeof stat>>
      }
      if (baseMtime !== undefined && Number(current.mtimeMs) !== 0 && Math.abs(Number(current.mtimeMs) - baseMtime) > 1) {
        return { code: 'write-conflict', message: 'file changed on disk since it was loaded' }
      }
      await mkdir(dirname(resolved.abs), { recursive: true })
      await writeFile(resolved.abs, content, 'utf8')
      const info = await stat(resolved.abs)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:384-397](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/fs-service.ts#L384-L397)

递归删除。

<details>
<summary>查看原文（14行）</summary>

```text
  async delete(root: string, rel: string): Promise<{ ok: true } | PanelError> {
    const gated = await this.gate(root)
    if (!gated.ok) return gated.error
    if (rel === '') return { code: 'path-outside-root', message: 'refusing to delete the root' }
    if (isGitPath(rel)) return { code: 'path-outside-root', message: 'refusing to touch .git' }
    const resolved = await resolveInsideRoot(gated.canonical, rel)
    if (!resolved.ok) return resolved.error
    try {
      await rm(resolved.abs, { recursive: true, force: true })
      return { ok: true }
    } catch {
      return { code: 'write-failed', message: `cannot delete ${rel}` }
    }
  }
```

</details>

#### 缺口

- 未实测竞态、反代和篡改
  **影响**：不能保证生产工作区写入隔离
  **进一步探讨**：隔离副本测冲突保存、跨目录和受限访问

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断把文件操作搬进聊天值得？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先只在本地副本比较读取三处明确文件、核对一条差异和插入路径。统计窗口切换次数、缓存或监听延迟、误选文件和恢复时间。更长期间还有订阅、Git 轮询和磁盘 I/O。若真实写入准备不足，只保留读视图并使用原 IDE。可进一步提供纯读挂载和服务端写入租约，对比基于 mtime 的单次提醒能否防误操作且保留同屏收益。若权限成本或误选没有改善，不进入长期使用。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-aionui-panel/README.md:41-49](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/README.md#L41-L49)

作者描述监听及轮询负担。

```text
## Data sources

The real filesystem and the real git repository, no mocks:

- The host half (`src/index.ts` + `src/host/`) serves directory listing, file reads (text capped at 80k chars / image data URLs), writes (mtime conflict detection), filename search (skipping .git / node_modules), git status (porcelain v1 -z) / stage / unstage / discard, and an SSE change stream (fs watching + git polling) over the `/aionui-panel/*` HTTP routes.
- All operations pass through a workspace guard: paths must fall inside a registered workspace (realpath normalization + prefix check); the browser can only read/write relative paths under the project root.
- Every `/aionui-panel/*` route (JSON operations, raw reads, and the SSE events stream) is loopback-only: non-loopback clients get `403 forbidden: loopback-only` before any workspace access, matching the dsh-ssh fence.
- The recursive watcher ignores changes under `node_modules` / `.git`; the SCM poll runs every 30s per workspace (each probe bounded by a 15s deadline), and roots that are not git repositories stop being re-probed thanks to a TTL cache. File edits surface via the watcher immediately; `.git`-only changes (commits/checkouts from other tools) appear within one poll interval or on window focus (throttled to once per 5s).
- The browser half (`src/client/`) treats the current session cwd as the project root; switching sessions switches projects.
```

**依据 2 · 源码核查**：[packages/dsh-aionui-panel/src/client/index.ts:57-67](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/client/index.ts#L57-L67)

草稿插入不等于直接读取或写入。

<details>
<summary>查看原文（11行）</summary>

```text
        inject: (sessionId: SessionId | undefined): DragFileInjected => ({
          insertPath: (path: string): boolean => {
            if (sessionId === undefined) return false
            const actx = sessions.scope(sessionId)
            if (actx === undefined) return false
            const input = conversation.input
            if (input === undefined) return false
            const shell = input.for(actx)
            const draft = shell.state.getSnapshot().draft
            shell.setDraft(insertPathIntoDraft(draft, path))
            return true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-aionui-panel/src/host/fs-service.ts:311-320](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-aionui-panel/src/host/fs-service.ts#L311-L320)

可能发生检查和实际保存分离。

<details>
<summary>查看原文（10行）</summary>

```text
        current = await stat(resolved.abs)
      } catch {
        current = { mtimeMs: 0 } as Awaited<ReturnType<typeof stat>>
      }
      if (baseMtime !== undefined && Number(current.mtimeMs) !== 0 && Math.abs(Number(current.mtimeMs) - baseMtime) > 1) {
        return { code: 'write-conflict', message: 'file changed on disk since it was loaded' }
      }
      await mkdir(dirname(resolved.abs), { recursive: true })
      await writeFile(resolved.abs, content, 'utf8')
      const info = await stat(resolved.abs)
```

</details>

#### 缺口

- 没有运行净收益
  **影响**：仅适合受控试用
  **进一步探讨**：在临时工作区重放相同任务并对账文件

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
