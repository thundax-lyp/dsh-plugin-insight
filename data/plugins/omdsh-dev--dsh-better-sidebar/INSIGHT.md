# Better Sidebar

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[8d8592b](https://github.com/omdsh-dev/DSH-better-sidebar/tree/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2)

<!-- BEGIN META -->
[![GitHub ★ 5,087](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5%2C087&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 314,654](https://img.shields.io/static/v1?label=npm+30d&message=314%2C654&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)
<!-- END META -->

> **功能**：为 DSH 提供会话侧栏和底部工作台，用于文件、变更、任务和侧聊。

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，插件把会话文件入口和外部页面、预览器挂在同一工作台。

> **主要限制**：[Q02](#research-q02) 显示，会话路径只定位文件，读写范围由宿主认证与运行账号权限约束。仅分开 profile 无法限制可访问文件。

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
  - [Q01 · 侧栏工作台相对原生预览和编辑器有什么增量？](#detail-section-11)
  - [Q02 · 会话和工作树如何决定文件访问？](#detail-section-12)
  - [Q03 · 插件挂载和外部扩展依赖哪些条件？](#detail-section-13)
  - [Q04 · 如何在不影响现有开发目录的情况下评估收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中按会话定位文件、差异和任务的开发者，可在侧栏或底部工作台查看相关内容。

原生预览和外部编辑器仍能查看文件与变更；市场增量集中在会话关联与工作台切换。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工作台 | 查看对话相关文件 | 依赖客户端插槽 |
| 文件接口 | 打开文件与预览 | 由宿主账号权限决定可访问范围 |
| 扩展服务 | 第三方添加标签和预览 | 需匹配客户端服务版本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 对应版本及宿主服务 | 必需 | 注册服务与界面 | 缺依赖会影响挂载 |
| 连接请求检查与低权限账号 | 受控部署所需 | 限制调用与文件访问 | 会话路径无法提供权限隔离 |
| 外部扩展版本匹配 | 接入额外标签时 | 调用侧栏注册服务 | 扩展可能不能显示 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者选低权限账号与测试仓库 | 运行账号可访问范围已核对 |
| 加载 | 单独挂载固定插件 | 界面及宿主正常加载 |
| 验收 | 打开一个已知文件并与原生方案比较 | 文件与工作树正确且退出后恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和缓存大小未知 | 建立受限账号与匹配宿主 | 耗时未知 |
| 持续 | 预览及监视资源未知 | 核对路径和扩展 | 实际切换次数待测 |
| 失败恢复 | 重复配置资源未知 | 禁用并恢复原生界面 | 文件副作用需独立排查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 文件定位 | 相对路径按会话或工作树解释 | 是否减少错开文件 |
| 扩展 | 可注册标签及预览器 | 生态版本兼容 |
| 退出 | 可禁用挂载 | 配置与实际文件影响需核查 |

> **思考**：[Q02](#research-q02) 显示，会话路径只定位文件，读写范围由宿主认证与运行账号权限约束。仅分开 profile 无法限制可访问文件。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q03](#research-q03) 显示，插件把会话文件入口和外部页面、预览器挂在同一工作台。

服务注册有注销接口。路径解析函数仍使用历史命名，实际只规范化路径，调用方不能从函数名推断权限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 显示，会话路径只定位文件，读写范围由宿主认证与运行账号权限约束。仅分开 profile 无法限制可访问文件。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先用独立低权限账号执行一个只读任务。若目录解析或访问范围超出预期，立即退回原生界面。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认宿主接线、扩展服务与文件路由；未做宿主运行及任务对照。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/client/index.tsx、src/client/service.ts、src/path-security.ts、src/session-path.ts、package.json、cordis.patch.yml、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 0.31.1，覆盖文件访问、会话定位、注册与挂载；侧聊、任务、Git 写入及全部路由未展开。
- 下一步：在相同文件查看任务比较原生与侧栏，记录路径正确性、切换次数、用时以及禁用后的状态。

**分析版本**

- **仓库**：[omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
- **版本号**：0.31.1（[固定提交 8d8592b](https://github.com/omdsh-dev/DSH-better-sidebar/tree/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可验证会话定位是否减少切换与误开文件。若同任务排查成本抵消省时，放弃这一假设。

在相同文件查看任务比较原生与侧栏，记录路径正确性、切换次数、用时以及禁用后的状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 115 | 17279 | — | — | 370874 |
| .mjs | source | 8 | 1125 | 890 | 195 | — |
| .js | source | 1 | 93 | 58 | 32 | — |
| .ts | source | 177 | 55170 | 37135 | 16065 | — |
| .tsx | source | 69 | 25659 | 17458 | 7305 | — |
| .ts | test | 186 | 46901 | 35621 | 8033 | — |
| .tsx | test | 133 | 40135 | 30259 | 6612 | — |
| .mjs | test | 1 | 227 | 150 | 56 | — |
| .js | example | 1 | 4 | 1 | 3 | — |
| .md | example | 1 | 57 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 136](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=136&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 137](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=137&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 106](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=106&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 里从对话定位并查看文件时，侧栏减少什么交接，能接触什么文件范围？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 侧栏工作台相对原生预览和编辑器有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合需要按对话反复打开相关文件的 DSH 用户。作者列出的文件树、可编辑预览及任务页在同一个工作台中，客户端实际发布 betterSidebar 服务，使其他插件可提供页面和预览器。相对在聊天中复制路径再切到编辑器，增量是文件入口和扩展在同一会话工作台共享；对长期编辑和复杂重构，外部编辑器已有成熟能力。合格任务是从正确会话打开正确文件并保留所需上下文。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-29](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/README.md#L25-L29)

作者列出文件、预览、任务与侧聊等工作台能力。

```text
| **🗂️ File Management**<br/>Lazy-loading tree, git status colors, live directory watch, global search, drag-and-drop upload, multi-select batch actions, dual-source "Open with" menu.<br/><img alt="File tree with git colors" src="./docs/screenshots/files-tree.png" /><br/><img alt="Context menu: Open with + Zip and download" src="./docs/screenshots/files-menu-openwith.png" /> | **🌿 Git**<br/>Source Control (Merge / Staged / Changes groups, message box with Generate, branch + sync footer) plus a this-session AI-changes lens, with a **read-only commit graph** (lanes, branch and tag badges, branch filter, commit details) in one tab.<br/><img alt="Git: changes and commit graph with tags" src="./docs/screenshots/changes-tree.png" /> |
| **📝 Editable Editor & Previews**<br/>An editable CodeMirror (the stock preview is read-only), Markdown + Mermaid + floating outline, sandboxed HTML preview, `.jsonl` record cards, paged preview for huge files, streaming transfers with no size caps.<br/><img alt="Markdown + Mermaid preview" src="https://github.com/user-attachments/assets/fe0e5182-55bb-45cc-b98b-a2877c2bdd38" /> | **🧩 Tasks**<br/>Live subagent topology (workflow graph / tree modes) + background task list: exit codes, live output, force-kill.<br/><img alt="Tasks: subagent topology" src="https://github.com/user-attachments/assets/dcd8ed2f-59fa-405b-937b-2d250f5034dd" /> |
| **💬 Side Chat (beta)**<br/>Codex-style side threads: inherit the full parent context and run independently, realtime push, visible & revocable queue, per-thread model selection, one-click promotion to a top-level session.<br/><img alt="Side Chat" src="https://github.com/user-attachments/assets/3a338c36-f5de-4000-95f3-4b1cd04f60fc" /> | **🖥️ Bottom Workbench**<br/>A self-drawn bottom panel that coexists with the native right sidebar: drag-to-split panes, multiple terminal tabs, per-session persisted layout.<br/><img alt="Dual workbench" src="https://github.com/user-attachments/assets/dfdb875e-a1a8-4d4b-8340-353736b1708f" /> |

**Also**: 📂 the `sidebar_open` tool lets the model open the sidebar itself · ⚡ ~325KB core at startup, heavy chunks load on demand · 🌏 i18n follows DSH · 📱 narrow screens switch to a full-width drawer
```

**依据 2 · 源码核查**：[src/client/index.tsx:163-177](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/client/index.tsx#L163-L177)

注册供外部插件使用的侧栏服务。

<details>
<summary>查看原文（15行）</summary>

```text
    }
  }
  // One store instance per activation: production code creates it only here,
  // then hands it to the mounted panel and closes over it in the slot
  // registrations (the official createXXXStore() factory rule — no
  // module-level singleton).
  const sidebarStore = createSidebarStore()
  // The sidebar registry service: external plugins register tab types and
  // file previewers through `ctx.betterSidebar.registerTab/registerFileViewer`.
  // Published before the panel mounts so consumers injecting 'betterSidebar'
  // are ready by the time the sidebar renders.
  const service = createBetterSidebarService(sidebarStore)
  ctx.provide('betterSidebar', service)
  ctx.effect(() => () => { disposeSidechatSurfaces(service) }, 'dsh-better-sidebar: sidechat surface adapters')
  // The native right-Sidebar surface: the plugin's content is registered as
```

</details>

**依据 3 · 源码核查**：[src/client/service.ts:1116-1142](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/client/service.ts#L1116-L1142)

标签和文件预览器分别注册并返回注销。

<details>
<summary>查看原文（27行）</summary>

```text
  const registerTab = (descriptor: TabDescriptor): (() => void) => {
    if (tabs.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] tab type "${descriptor.id}" already registered`)
    }
    tabs.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (tabs.get(descriptor.id) === descriptor) {
        tabs.delete(descriptor.id)
        notify()
      }
    }
  }

  const registerFileViewer = (descriptor: FileViewerDescriptor): (() => void) => {
    if (viewers.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] file viewer "${descriptor.id}" already registered`)
    }
    viewers.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (viewers.get(descriptor.id) === descriptor) {
        viewers.delete(descriptor.id)
        notify()
      }
    }
  }
```

</details>

#### 缺口

- 未在固定宿主操作工作台
  **影响**：无法确认相对原生预览和编辑器的效率
  **进一步探讨**：用同一个对话指向的文件对照两条打开路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话和工作树如何决定文件访问？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

路由先委托宿主 connection.requestRejection 处理部署信任与请求认证。对通过请求，工作目录优先取当前宿主工作目录服务或会话头，随后取存档、默认目录、客户端提供的绝对路径，最后落到进程目录。文件 API 还可依据活动工作树或选定 Git 根来解释相对路径。绝对路径、波浪号和折叠后的上级路径并不限制在会话工作区内，写路径也走同一词法解析，可能穿过符号链接。会话归属是定位，不是文件权限。通过宿主请求检查的操作者可接触运行账号有权访问的文件；不可将会话 ID 或隔离 profile 当作文件沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1438-1445](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L1438-L1445)

统一委托宿主 connection 请求检查。

```text
export function apply(ctx: Context, config?: SidebarConfig): void {
  const resolved = resolveSidebarConfig(config)
  // Connection owns both deployment trust and authentication; never infer or
  // bypass its policy from invocation flags or a copied trust list.
  const fence = (req: SidebarHttpRequest): boolean => ctx.connection.requestRejection(req) === undefined
  // The model-facing open-request registry: queues `sidebar_open` requests
  // per session and pushes them to connected sidebar views over the
  // `/sidebar/ws/agent-opens` socket.
```

**依据 2 · 源码核查**：[src/index.ts:244-272](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L244-L272)

工作目录优先级及回退。

<details>
<summary>查看原文（29行）</summary>

```text
async function sessionCwdOf(ctx: Context, sessionId: string, clientCwd?: string): Promise<string> {
  const session = ctx.sessions.get(sessionId)
  // The immutable header here is the fallback, not the authority: the host's
  // committed value tracks `cd` and wins whenever it is available.
  if (session !== undefined) {
    const cwd = ctx.get('workingDirectory')?.get(session) ?? session.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  const stored = await storedHeaderCwdOf(ctx, sessionId)
  if (stored !== undefined) {
    // A corrupt relative cwd must be refused here: resolving it against the
    // host process cwd is exactly the "outside workspace" misclassification
    // the header read exists to avoid.
    try {
      return requireAbsolute(stored)
    } catch {
      throw new SidebarError('bad-request', `invalid working directory "${stored}"`)
    }
  }
  const defaultDirectory = ctx.get('workingDirectory')?.defaultDirectory
  if (defaultDirectory !== undefined && defaultDirectory !== '') return requireAbsolute(defaultDirectory)
  if (clientCwd !== undefined && clientCwd !== '') {
    try {
      return requireAbsolute(clientCwd)
    } catch {
      throw new SidebarError('bad-request', `invalid working directory "${clientCwd}"`)
    }
  }
  return process.cwd()
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1630-1645](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L1630-L1645)

实际 API 请求检查和方法匹配。

<details>
<summary>查看原文（16行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1846-1860](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L1846-L1860)

文件路由读取会话及活动工作树并调用路径解析。

<details>
<summary>查看原文（15行）</summary>

```text
        const sessionId = url.searchParams.get('sessionId')
        const raw = url.searchParams.get('path')
        if (sessionId === null || raw === null) throw new SidebarError('bad-request', 'sessionId and path are required')
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        // Resolution is the shared contract's alone: relative joins the
        // session cwd, absolute stays, `~` expands against the home (#713),
        // remote-mirror namespaces project. Pre-joining here would paste a
        // `~` target after the cwd and hide it from the resolver.
        // Resolution is the shared contract's alone: relative joins the
        // session cwd, absolute stays, `~` expands against the home (#713),
        // remote-mirror namespaces project. Pre-joining here would paste a
        // `~` target after the cwd and hide it from the resolver.
        const path = await ensureWorkspacePath(cwd, raw)
        const info = await statFileForRoute(path)
        if (!info.isFile()) {
```

</details>

**依据 5 · 源码核查**：[src/path-security.ts:38-76](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/path-security.ts#L38-L76)

读写只作路径解析，保留绝对路径与家目录，未实施目录封闭。

<details>
<summary>查看原文（39行）</summary>

```text
export async function ensureWorkspacePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

/**
 * Resolve a path for a WRITE destination (which may not exist yet).
 *
 * Lexical only, exactly like {@link ensureWorkspacePath}: a missing target is
 * returned as the caller composed it (its parent is created on demand), and an
 * existing symlink in the path is NOT resolved — the caller writes through it,
 * which is what "no containment policy" means.
 *
 * @param cwd - Session workspace directory (the base of relative targets).
 * @param target - Client-supplied absolute or session-relative path.
 * @param _fence - IGNORED (see {@link ensureWorkspacePath}).
 * @returns The absolute destination path.
 * @deprecated The name is historical — this is now plain resolution.
 */
export async function ensureWorkspaceWritePath(cwd: string, target: string, _fence?: boolean): Promise<string> {
  return resolveTarget(cwd, target)
}

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
```

</details>

#### 缺口

- 未验证各部署的宿主认证与操作系统权限
  **影响**：不能推断通过宿主登录的多人共享部署有会话级文件隔离
  **进一步探讨**：用专用低权限账号和测试文件检查拒绝的请求与可访问路径

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件挂载和外部扩展依赖哪些条件？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

包发布 host 与 client 两个入口，分别由固定构建配置生成，宿主需要 webServer、sessions、connection、tools，客户端也需要会话、连接与插槽等服务。补丁按包名挂载；重复保护只能看到先处理的已启用不同 ID 聚合行，反向顺序或手工同 ID 重复仍可能失败。固定包依赖 0.2.2-rc.1 系列宿主包，作者也要求匹配该宿主线。外部扩展使用客户端 betterSidebar 服务，注册函数返回注销，支持与扩展生命周期配合；这不代表任意旧版扩展可用。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-31](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/package.json#L13-L31)

Host、client 和服务导出。

<details>
<summary>查看原文（19行）</summary>

```text
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
    "./client/service": {
      "types": "./lib/types/client/service.d.ts",
      "default": "./lib/client.js"
    },
    "./client/api": {
      "types": "./lib/types/client/service.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 2 · 源码核查**：[package.json:95-111](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/package.json#L95-L111)

宿主 peer 版本和服务包。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/schemastery": ">=3.18.5 <4",
    "@deepseek-ai/dsh-agent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-locale": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-input-trigger": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-sidebar-right": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-slots": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-host-webserver": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-llm": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-session": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-settings": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-subagent": "^0.2.2-rc.1",
    "@deepseek-ai/dsh-tools": "^0.2.2-rc.1",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:26-42](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/cordis.patch.yml#L26-L42)

重复挂载防护仅观察已有行。

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

**依据 4 · 源码核查**：[src/index.ts:113-118](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L113-L118)

服务器所需宿主服务。

```text
}

/** Services required before mounting: routes, sessions, native request admission, and tools. */
export const inject = ['webServer', 'sessions', 'connection', 'tools']

/** Content types for media files and HTML preview resources, by extension. */
```

**依据 5 · 源码核查**：[src/client/index.tsx:53-76](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/client/index.tsx#L53-L76)

客户端所需服务及 locale 注册清理。

<details>
<summary>查看原文（24行）</summary>

```text
export const inject = ['slots', 'sessions', 'locale', 'modules', 'connection', 'remote', 'remote.session']

/**
 * Error boundary over the sidebar tree (root scope): a render error in the
 * sidebar SHELL itself must never blank the page silently — the shared
 * RenderBoundary shows a dismissible error strip and logs the stack. The
 * per-tab scope (Sidebar.tsx) catches viewer/editor crashes first; this root
 * boundary stays as the last resort for Workbench/shell errors.
 */
/**
 * Client plugin body.
 * @param ctx - the client cordis context (slots, sessions).
 */
export function apply(ctx: Context): void {
  // The sidebar follows the DSH i18n system: attach the locale service so
  // the module-level t()/isZh() resolve the Host-backed language preference
  // (and switch live — the Sidebar root subscribes to it), and register the
  // plugin's dictionaries into the shared locale registry. The disposers
  // run on fiber disposal, so re-activation (HMR) re-registers cleanly.
  attachLocale(ctx.locale)
  ctx.effect(() => {
    const offZh = ctx.locale.register(LOCALE_NS, 'zh', zh)
    const offEn = ctx.locale.register(LOCALE_NS, 'en', en)
    return () => { offZh(); offEn() }
```

</details>

**依据 6 · 源码核查**：[src/client/service.ts:1116-1142](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/client/service.ts#L1116-L1142)

注册与解除生命周期。

<details>
<summary>查看原文（27行）</summary>

```text
  const registerTab = (descriptor: TabDescriptor): (() => void) => {
    if (tabs.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] tab type "${descriptor.id}" already registered`)
    }
    tabs.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (tabs.get(descriptor.id) === descriptor) {
        tabs.delete(descriptor.id)
        notify()
      }
    }
  }

  const registerFileViewer = (descriptor: FileViewerDescriptor): (() => void) => {
    if (viewers.has(descriptor.id)) {
      throw new Error(`[dsh-better-sidebar] file viewer "${descriptor.id}" already registered`)
    }
    viewers.set(descriptor.id, descriptor)
    notify()
    return () => {
      if (viewers.get(descriptor.id) === descriptor) {
        viewers.delete(descriptor.id)
        notify()
      }
    }
  }
```

</details>

#### 缺口

- 未执行发布包挂载及第三方扩展兼容验证
  **影响**：无法确认不同宿主版本和聚合顺序都可启动
  **进一步探讨**：先在独立 profile 对单包挂载，再按正确聚合顺序复核

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何在不影响现有开发目录的情况下评估收益？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

用专用低权限账号、隔离 profile 和可丢弃仓库测试只读查看。对同一任务分别用侧栏和原生界面配外部编辑器，从对话打开文件、核对正确目录、定位对应变更。分别记录安装配置时间、重复切换次数、错误文件次数与故障恢复，终点是看到正确工作树上的文件和相关差异。待验证假设是会话定位能降低切换和误开；若侧栏仍频繁回退外部工具或省时被额外排查抵消，放弃假设。若路由能读取不应可见的测试文件、挂载失败或会话定位不一致，禁用该挂载，恢复原生界面和编辑器。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:876-897](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/index.ts#L876-L897)

读取及分页均由会话路径解析决定，提供可重复对照。

<details>
<summary>查看原文（22行）</summary>

```text
      const { cwd } = await cwdOf(payload)
      // File links are session-relative. Git callers must provide an absolute
      // path or explicitly select a repository; missing files never change base.
      const selected = selectedRepoOf(payload)
      const base = selected === undefined ? cwd : await git.repoRoot(cwd, selected)
      const path = await ensureWorkspacePath(base, requireString(payload, 'path'))
      return await readText(path)
    },
    // One byte window of a large text file, for the read-only paged preview.
    // The window is line-aligned by the host, so the client can treat each
    // response as whole lines (and, for a `.jsonl`, whole records) without
    // having to re-split anything.
    'fs.readPage': async (payload) => {
      const { cwd } = await cwdOf(payload)
      const selected = selectedRepoOf(payload)
      const base = selected === undefined ? cwd : await git.repoRoot(cwd, selected)
      const path = await ensureWorkspacePath(base, requireString(payload, 'path'))
      const record = payload as { offset?: unknown } | null
      const offset = typeof record?.offset === 'number' && Number.isFinite(record.offset) && record.offset >= 0
        ? Math.floor(record.offset)
        : 0
      return await readPage(path, offset)
```

</details>

**依据 2 · 源码核查**：[src/path-security.ts:60-76](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/src/path-security.ts#L60-L76)

路径访问边界决定试用要用低权限账号，而非只换 profile。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:47-55](https://github.com/omdsh-dev/DSH-better-sidebar/blob/8d8592bb0ec33fa82b4c41bed04cb885fcd7fda2/README.md#L47-L55)

作者给出固定版本与宿主匹配条件。

```text
> **Compatibility warning — match the plugin to the host line.** As of 2026-11-04, DSH's npm `latest` is **0.2.1-rc.5** and `next` is **0.2.2-rc.1**. **v0.31.1 requires DSH 0.2.2-rc.1+**; hosts on the 0.2.1 line (**0.2.1-rc.1 ~ rc.5**, i.e. today's `latest`) must pin `dsh-better-sidebar@0.28.2` — v0.29.0 was never published to npm. DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`, and hosts still on **0.2.0-rc.2** must pin `dsh-better-sidebar@0.26.1`. A 0.x caret never spans a minor version, so one plugin build cannot serve two host lines. The marketplace installer picks the plugin's `latest` regardless of host version, so an old host gets a version-rejection error — upgrade the host or pin the version explicitly. The two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.2-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.31.1` |
| **0.2.1-rc.1 ~ 0.2.1-rc.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.2` |
```

#### 缺口

- 未测用时和额外配置负担
  **影响**：不能认定实际任务成本下降
  **进一步探讨**：在同宿主版本重复运行只读任务并记录结果

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
