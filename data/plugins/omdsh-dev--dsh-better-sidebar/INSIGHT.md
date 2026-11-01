# DSH Better Sidebar

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[2d736f5](https://github.com/omdsh-dev/DSH-better-sidebar/tree/2d736f5496fe97f4bba6af37d99861649b9ef3c0)

<!-- BEGIN META -->
[![GitHub ★ 4,789](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4%2C789&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/DSH-better-sidebar) [![npm 30d 233,365](https://img.shields.io/static/v1?label=npm+30d&message=233%2C365&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-better-sidebar)
<!-- END META -->

> **功能**：为 DSH 提供会话侧栏与底部工作台，支持文件、编辑器、Git 和扩展页面。

> **亮点**：[Q02](#research-q02) 和 [Q04](#research-q04) 显示会话目录、编辑与可注销扩展服务在一个工作台接线；相对 IDE 的增量主要是上下文组织，不能据此推断功能全面领先。

> **主要限制**：[Q03](#research-q03) 表明请求准入不等于工作目录隔离，文件操作可达宿主账户有权限访问的其他路径；目录误判或错误操作的影响不能仅凭会话作用域排除。

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
  - [Q01 · 谁需要会话工作台，IDE 和终端是否足够？](#detail-section-11)
  - [Q02 · 编辑保存如何定位会话目录和防止覆盖？](#detail-section-12)
  - [Q03 · 会话工作区是否构成访问围栏？](#detail-section-13)
  - [Q04 · 扩展服务如何注册和卸载？](#detail-section-14)
  - [Q05 · Git 与终端依赖及副作用有哪些？](#detail-section-15)
  - [Q06 · 版本、持续维护及恢复成本如何影响采用？](#detail-section-16)
  - [Q07 · 细粒度路径授权可否减小误操作？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH 会话中频繁查看文件、编辑和核对 Git 的开发者；成熟 IDE 与终端仍可完成同类任务。

将宿主原生侧栏、独立 IDE 与终端作为参照，比较会话上下文中的位置整合，不推断已实测节时。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 文件编辑 | 在会话中读取与保存文件 | 路径不限定工作区；缺 mtime 时不比较 |
| Git 面板 | 检查并操作当前仓库 | 写操作和远端操作具有副作用 |
| 扩展注册 | 其他插件提供页面和预览器 | ID 不可重复，需兼容宿主服务 |
| 底部终端 | 在工作台访问终端 | 需要宿主终端服务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 宿主 | 启动必需 | 提供会话、连接和界面服务 | 版本不匹配时不可假设能加载 |
| 宿主终端服务 | 终端功能需要 | 提供终端进程 | 终端不可用 |
| Git 与仓库 | Git 功能需要 | 查询和变更仓库 | 相应 Git 操作无法完成 |
| 进程文件权限 | 文件操作需要 | 读取和修改目标 | 由操作系统权限决定范围 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主版本和 profile，备份目录 | 有可恢复副本 |
| 加载 | 宿主装入插件并刷新客户端 | 侧栏可打开；失败检查版本 |
| 执行 | 用户确认会话目录再编辑文件 | 保存结果指向预期路径，冲突时复核 |
| 验收 | 用户查看文件和 Git 差异 | 不符时停止并从备份或 Git 恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主与存储资源未知 | 核对版本、备份和刷新，时间未知 | 依赖兼容宿主 |
| 持续 | 文件监听与网络资源未知 | 检查路径、保存和版本升级 | 净节时未知 |
| 失败恢复 | 备份资源未知 | 排查目标与恢复文件，时间未知 | 停用插件不撤销已写内容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话内工作台 | 文件写入与扩展注册有实际接线 | 相比 IDE 的合格率和节时 |
| 冲突提示 | 有 mtime 基准时会比对并拒绝不一致 | 比较与写入之间的全部并发情形 |

> **思考**：[Q03](#research-q03) 表明请求准入不等于工作目录隔离，文件操作可达宿主账户有权限访问的其他路径；目录误判或错误操作的影响不能仅凭会话作用域排除。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 和 [Q04](#research-q04) 显示会话目录、编辑与可注销扩展服务在一个工作台接线；相对 IDE 的增量主要是上下文组织，不能据此推断功能全面领先。

[Q02](#research-q02) 中临时文件及条件 mtime 检查降低部分覆盖风险，但检查与 rename 分离且基准可缺失；[Q04](#research-q04) 的注册表避免重复 ID 并按原对象注销，均不等于真实宿主可靠性证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 表明请求准入不等于工作目录隔离，文件操作可达宿主账户有权限访问的其他路径；目录误判或错误操作的影响不能仅凭会话作用域排除。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 建议已确认宿主版本的开发者先用低权限宿主和可丢弃目录试读、编辑；若实际路径不符或需要工作目录隔离，停止并回到 IDE。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持所查机制；宿主运行、效果与未来假设均未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/TextEditor.tsx、src/client/api.ts、src/index.ts、src/fs-operations.ts、src/active-worktree.ts、src/path-security.ts、src/client/index.tsx、src/client/builtins/index.ts、src/client/builtins/tabs.tsx、src/client/service.ts、src/git.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交中与文件、路径、Git、扩展注册相关的部分源码；未安装、执行目标测试或真实宿主验收。
- 下一步：在隔离宿主固定版本，用同一任务对照 IDE；注入外部写入、文件删除、会话切换和符号链接路径，记录目标、结果、遗留状态与耗时。

**分析版本**

- **仓库**：[omdsh-dev/DSH-better-sidebar](https://github.com/omdsh-dev/DSH-better-sidebar)
- **版本号**：0.28.2（[固定提交 2d736f5](https://github.com/omdsh-dev/DSH-better-sidebar/tree/2d736f5496fe97f4bba6af37d99861649b9ef3c0)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提出未验证的按真实路径授予写权限假设；若合法跨目录任务受阻或符号链接仍可绕过，应放弃。

在隔离宿主固定版本，用同一任务对照 IDE；注入外部写入、文件删除、会话切换和符号链接路径，记录目标、结果、遗留状态与耗时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 99 | 15179 | — | — | 317790 |
| .mjs | source | 4 | 497 | 373 | 99 | — |
| .js | source | 1 | 91 | 57 | 31 | — |
| .ts | source | 161 | 48871 | 32971 | 14195 | — |
| .tsx | source | 64 | 23032 | 15715 | 6485 | — |
| .ts | test | 156 | 39887 | 30299 | 6818 | — |
| .tsx | test | 95 | 29215 | 22515 | 4357 | — |
| .mjs | test | 1 | 227 | 150 | 56 | — |
| .js | example | 1 | 4 | 1 | 3 | — |
| .md | example | 1 | 57 | — | — | 240 |

</details>

**活跃度**

[![Issue 未关闭 155](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=155&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 136](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=136&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 166](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=166&color=737b86&logo=github)](https://github.com/omdsh-dev/DSH-better-sidebar/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 用户能否在会话上下文内查看和修改文件，以及相对 IDE 与终端的增量及权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话工作台，IDE 和终端是否足够？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 对话中查看、编辑工作目录并核对 Git 的用户。合格任务是针对正确会话目录打开目标文件、确认改动并保存，而非仅打开面板。README.md:21-29 是作者对文件、编辑器、Git、任务、侧聊和底部工作台的功能主张；README.md:94 明确终端能力由宿主提供。成熟 IDE 与终端也可做这些任务；本插件的潜在增量是把工作入口与会话上下文并置，不能据此宣称能力全面替代 IDE。真实任务频率、操作节时和用户反馈未经验证，需在同一修改任务下对照两种流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-29](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/README.md#L21-L29)

作者描述工作台及任务。

```text
## ✨ Features

| | |
|---|---|
| **🗂️ File Management**<br/>Lazy-loading tree, git status colors, live directory watch, global search, drag-and-drop upload, multi-select batch actions, dual-source "Open with" menu.<br/><img alt="File tree with git colors" src="./docs/screenshots/files-tree.png" /><br/><img alt="Context menu: Open with + Zip and download" src="./docs/screenshots/files-menu-openwith.png" /> | **🌿 Git**<br/>Source Control (Merge / Staged / Changes groups, message box with Generate, branch + sync footer) plus a this-session AI-changes lens, with a **read-only commit graph** (lanes, branch and tag badges, branch filter, commit details) in one tab.<br/><img alt="Git: changes and commit graph with tags" src="./docs/screenshots/changes-tree.png" /> |
| **📝 Editable Editor & Previews**<br/>An editable CodeMirror (the stock preview is read-only), Markdown + Mermaid + floating outline, sandboxed HTML preview, `.jsonl` record cards, paged preview for huge files, streaming transfers with no size caps.<br/><img alt="Markdown + Mermaid preview" src="https://github.com/user-attachments/assets/fe0e5182-55bb-45cc-b98b-a2877c2bdd38" /> | **🧩 Tasks**<br/>Live subagent topology (workflow graph / tree modes) + background task list: exit codes, live output, force-kill.<br/><img alt="Tasks: subagent topology" src="https://github.com/user-attachments/assets/dcd8ed2f-59fa-405b-937b-2d250f5034dd" /> |
| **💬 Side Chat (beta)**<br/>Codex-style side threads: inherit the full parent context and run independently, realtime push, visible & revocable queue, per-thread model selection, one-click promotion to a top-level session.<br/><img alt="Side Chat" src="https://github.com/user-attachments/assets/3a338c36-f5de-4000-95f3-4b1cd04f60fc" /> | **🖥️ Bottom Workbench**<br/>A self-drawn bottom panel that coexists with the native right sidebar: drag-to-split panes, multiple terminal tabs, per-session persisted layout.<br/><img alt="Dual workbench" src="https://github.com/user-attachments/assets/dfdb875e-a1a8-4d4b-8340-353736b1708f" /> |

**Also**: 📂 the `sidebar_open` tool lets the model open the sidebar itself · ⚡ ~325KB core at startup, heavy chunks load on demand · 🌏 i18n follows DSH · 📱 narrow screens switch to a full-width drawer
```

**依据 2 · 作者声明**：[README.md:91-95](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/README.md#L91-L95)

作者说明终端由宿主提供。

```text
| "Profile directory not found" | Run `dsh web` once to initialize `~/.dsh/profiles/web`. |
| **Two sidebars** on the page | Double mounting. Remove the legacy manual mount line (`- insert: ... better-sidebar ...`) from `~/.dsh/profiles/web/cordis.patch.yml`; aggregate packages mounting this package under a different id are auto-yielded, no action needed. |
| Settings values gone after upgrade | Since DSH 0.1.7, preferences live on this plugin's mount row in the profile (default entry id `better-sidebar`). The plugin migrates your old `settings.yaml` values once on first start and never overwrites newer values. |
| Terminal unavailable | Terminals are provided by **DSH itself** (this plugin ships no PTY) — see DSH docs; "host provides no terminal capability" in the bottom terminal means this deployment has no terminal controller mounted. |
| `dsh: command not found` | Install DSH first; or use `npx -y --package @deepseek-ai/dsh@0.2.1-rc.1 dsh plugin --profile web add dsh-better-sidebar@0.28.2`. |
```

#### 缺口

- 未取得同条件任务和用户需求证据
  **影响**：不知是否减少切换成本
  **进一步探讨**：让目标用户在相同任务下比较 IDE 和插件工作台。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑保存如何定位会话目录和防止覆盖？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端 TextEditor.tsx:716-748 以 mtime 基准提交并在 fs-conflict 时保留冲突状态；client/api.ts:337-351 将正文 POST 至 /sidebar/write。index.ts:1629-1661 对路由做宿主准入，取得 sessionId 和路径，依据会话与工作树解析 cwd，再将正文和可选 mtime 交给写入函数。fs-operations.ts:162-181 在有基准时对比磁盘 mtime，188-199 用独立临时文件和 rename 写入。缺 mtime 时不启用比较；比较和 rename 之间不是原子比较交换，不能保证并发写入绝无覆盖。index.ts:213-241 使用已附着会话的工作目录，随后尝试存储头、默认目录和客户端提示等回退；active-worktree.ts:464-472 对分离会话直接返回基准，附着后再解析活动 worktree。源码支持条件性机制，宿主目录切换、竞态及结果未实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/TextEditor.tsx:716-748](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/TextEditor.tsx#L716-L748)

编辑器提交 mtime，处理冲突。

<details>
<summary>查看原文（33行）</summary>

```text
  const save = (): void => {
    const view = viewRef.current
    if (view === null || savingRef.current) return
    // The bytes this request writes: the same string becomes the baseline text
    // once the host accepts it (the draft may keep changing while in flight).
    const text = view.state.doc.toString()
    savingRef.current = true
    setSaveState('saving')
    // Optimistic concurrency: the draft was based on the bytes read at
    // `mtimeMs`; a file that changed on disk since is REFUSED (fs-conflict)
    // instead of clobbering whatever wrote it (the model, another tab, an
    // external editor). `null` = the file did not exist when loaded.
    api.fsWrite(scope, path, text, mtimeRef.current ?? null).then((result) => {
      savingRef.current = false
      // Adopt the fresh baseline the host reports (absent on a stat failure —
      // keep the old one, the next save just re-checks).
      if (typeof result.mtimeMs === 'number') mtimeRef.current = result.mtimeMs
      savedTextRef.current = text
      setDraft(null)
      setDirty(false)
      setConflict(false)
      setSaveState('saved')
      // The saved bytes are a new revision of the uncommitted diff: re-read
      // the change set (the file's XY status code usually stays the same, so
      // the status store alone would never wake the gutter up again).
      setGitRevision(value => value + 1)
    }).catch((error: unknown) => {
      savingRef.current = false
      if (error instanceof SidebarApiError && error.code === 'fs-conflict') {
        setConflict(true)
        setSaveState('idle')
        return
      }
```

</details>

**依据 2 · 源码核查**：[src/client/api.ts:337-351](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/api.ts#L337-L351)

客户端发出写请求。

<details>
<summary>查看原文（15行）</summary>

```text
async function fetchWrite(
  scope: SessionScope,
  path: string,
  content: string,
  expectedMtimeMs?: number,
): Promise<{ ok: true; mtimeMs?: number }> {
  const params = new URLSearchParams({ sessionId: scope.sessionId, path })
  if (scope.cwd !== undefined && scope.cwd !== '') params.set('cwd', scope.cwd)
  if (expectedMtimeMs !== undefined) params.set('expectedMtimeMs', String(expectedMtimeMs))
  let response: Response
  try {
    response = await fetch(hostRouteUrl(`sidebar/write?${params.toString()}`).href, {
      method: 'POST',
      headers: { 'content-type': 'text/plain; charset=utf-8' },
      body: content,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1629-1661](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L1629-L1661)

路由接收数据并解析会话目录。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/sidebar/write',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      try {
        const url = new URL(req.url ?? '/', 'http://dsh.internal')
        const sessionId = url.searchParams.get('sessionId')
        const path = url.searchParams.get('path')
        if (sessionId === null || path === null || path === '') {
          throw new SidebarError('bad-request', 'sessionId and path are required')
        }
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        // Optimistic concurrency: the client sends the mtime its draft was
        // based on. Absent = no gate (a brand-new file has no baseline).
        const raw = url.searchParams.get('expectedMtimeMs')
        const parsed = raw === null ? Number.NaN : Number(raw)
        const expectedMtimeMs = Number.isFinite(parsed) ? parsed : undefined
        const content = await readTextBody(req, WRITE_BODY_GUARD_BYTES)
        const result = await writeWorkspaceText({
          cwd,
          path,
          content,
          ...(expectedMtimeMs === undefined ? {} : { expectedMtimeMs }),
        })
        writeOk(res, { ok: true, ...result })
```

</details>

**依据 4 · 源码核查**：[src/index.ts:213-241](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L213-L241)

会话 cwd 的优先级与回退。

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

**依据 5 · 源码核查**：[src/fs-operations.ts:162-199](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/fs-operations.ts#L162-L199)

条件检查后以临时文件和 rename 写入。

<details>
<summary>查看原文（38行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = await ensureWorkspaceWritePath(cwd, path)
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
```

</details>

**依据 6 · 源码核查**：[src/active-worktree.ts:464-472](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/active-worktree.ts#L464-L472)

分离会话使用基准目录。

```text
export async function activeWorktreeRootOf(ctx: Context, sessionId: string, base: string): Promise<string> {
  if (base === '') return base
  const override = (process.env[ACTIVE_ROOT_OVERRIDE_ENV] ?? '').trim()
  if (override !== '' && isAbsolute(override)) return requireAbsolute(override)
  // A detached session has no live event log, and folding its STORED one means
  // decoding the whole artifact (39 MB here) for a follow-the-agent nicety the
  // workspace address already answers: while cold, the session's header cwd IS
  // the root. Attaching the session re-enables the fold on the next ask.
  if (ctx.sessions.get(sessionId) === undefined) return base
```

#### 缺口

- 未运行版本及并发任务
  **影响**：无法保证真实宿主和所有竞态行为
  **进一步探讨**：在隔离 profile 对比外部写入、删除与切换会话的结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话工作区是否构成访问围栏？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

index.ts:1407-1411 把请求交给宿主 connection.requestRejection 判定，index.ts:1541-1552 将其用于 API 路由。path-security.ts:4-14、38-76 明确不做 workspace 包含检查，绝对路径保留、相对路径以会话 cwd 解析，写入可经过符号链接；因此已获准用户的访问上限是宿主进程 OS 权限，而非工作目录。路径函数旧名和局部注释不能改变实际实现。具体部署的 host gate、OS 权限与跨账户暴露尚未验证，应独立检查宿主权限并使用可恢复目录。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1407-1411](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L1407-L1411)

借用宿主请求准入。

```text
export function apply(ctx: Context, config?: SidebarConfig): void {
  const resolved = resolveSidebarConfig(config)
  // Connection owns both deployment trust and authentication; never infer or
  // bypass its policy from invocation flags or a copied trust list.
  const fence = (req: SidebarHttpRequest): boolean => ctx.connection.requestRejection(req) === undefined
```

**依据 2 · 源码核查**：[src/index.ts:1541-1552](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L1541-L1552)

API 注册和准入。

<details>
<summary>查看原文（12行）</summary>

```text
  const api = buildApi(ctx, resolved, () => settingsFace, assistantLive, archiveTasks)
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
```

</details>

**依据 3 · 源码核查**：[src/path-security.ts:38-76](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/path-security.ts#L38-L76)

解析路径且不执行包含约束。

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

- 目标部署的账号权限和宿主 gate 未实测
  **影响**：不能外推到所有部署或跨账户
  **进一步探讨**：审计实际宿主权限和可访问目录并在隔离环境试验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 扩展服务如何注册和卸载？

**研究主题**：贡献与相对优势、功能与机制

#### 完整回答

client/index.tsx:162-179 创建 store 和服务、通过 ctx.provide 发布，再设置宿主原生侧栏 surface；213-218 行以 effect 注册内置项目。client/builtins/index.ts:21-35 调用服务注册内置 tab 与 viewer 并返回清理函数；client/service.ts:929-955 拒绝重复 ID，disposer 只移除仍匹配原 descriptor 的条目并通知。由此源码支持内置与外部消费者共用注册接口、注销保护的设计；是否在具体版本热重载和外部插件生命周期正确协作未运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:162-179](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/index.tsx#L162-L179)

创建并发布服务。

<details>
<summary>查看原文（18行）</summary>

```text
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
  // The native right-Sidebar surface: the plugin's content is registered as
  // DSH tab types (one per descriptor) and every open routes there, so the
  // right column belongs to the host and only the bottom workbench stays
  // plugin-owned. Both halves live for this fiber's lifetime.
  const nativeRecords = createNativeTabRecords()
  const nativeSurface = createNativeSurface(ctx, nativeRecords)
  service.setSurface(nativeSurface)
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:213-218](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/index.tsx#L213-L218)

激活内置注册。

```text
  // Register the plugin's own built-in tabs and viewers through the same
  // service (eating our own dogfood). The disposer unregisters them on
  // fiber disposal (HMR-safe).
  ctx.effect(
    () => registerBuiltins(ctx, service),
    'dsh-better-sidebar: register built-in tabs and viewers',
```

**依据 3 · 源码核查**：[src/client/builtins/index.ts:21-35](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/builtins/index.ts#L21-L35)

内置页面调用服务注册并返回 disposer。

<details>
<summary>查看原文（15行）</summary>

```text
export function registerBuiltins(
  ctx: Context,
  service: BetterSidebarService,
): () => void {
  const disposers: (() => void)[] = []
  for (const tab of builtinTabs(ctx)) {
    disposers.push(service.registerTab(tab))
  }
  for (const viewer of builtinViewers()) {
    disposers.push(service.registerFileViewer(viewer))
  }
  return () => {
    for (const d of disposers) {
      try { d() } catch { /* already disposed */ }
    }
```

</details>

**依据 4 · 源码核查**：[src/client/service.ts:929-955](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/service.ts#L929-L955)

拒绝重复 ID 并仅清理匹配条目。

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

- 未运行外部消费者和热重载
  **影响**：生命周期可靠性只由源码支持
  **进一步探讨**：使用隔离宿主验证注册、重复和注销行为。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · Git 与终端依赖及副作用有哪些？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

README.md:23-27 将文件、Git、编辑器、任务和侧聊并列作为作者主张；client/builtins/tabs.tsx:9-18、291-298 表示底部终端由插件绘制，实际终端进程通过宿主会话终端服务提供；README.md:94 说明宿主缺终端能力时不可用。Git 图的只读属性来自作者 README.md:31-33，而同一界面其他 Git 操作不因此自动只读。尚未逐一跟踪变更、提交和远端命令的允许列表与用户确认，不能将整个 Git 面板视为无副作用；进一步核对所需操作并在隔离仓库验收。

`src/index.ts:940-981` 注册 stage、unstage、commit、push、pull 和 checkout 处理；`src/git.ts:1040-1050, 1127-1141` 具体调用 git add、reset、commit、push 与 pull，后两者涉及远端。由此可以确认后端能力具有副作用；尚未逐项核对界面确认及异常恢复，不能声称所有动作都有二次确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/builtins/tabs.tsx:9-18](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/client/builtins/tabs.tsx#L9-L18)

底部终端依赖宿主服务。

<details>
<summary>查看原文（10行）</summary>

```text
 * DSH 0.1.6-alpha.2 ships its own right-Sidebar terminal and browser tab
 * types, so this plugin contributes neither: the host's `terminal` kind owns
 * interactive shells outright, and the host's `browser` kind (delegated to
 * from the chat's http(s) links) owns embedded pages. See
 * docs/plans/2026-09-21-dsh-0.1.6-alpha.2-adaptation.md.
 *
 * `terminal-bottom` (#774) is the one type that is NOT a host tab: it is the
 * plugin's own bottom workbench terminal, driving the host's session-scoped
 * terminal service through a self-drawn xterm. It declares `bottomOnly` so it
 * can never become a second right-Sidebar terminal capsule beside the host's
```

</details>

**依据 2 · 源码核查**：[src/index.ts:940-981](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L940-L981)

注册多个写入及远端 Git 操作。

<details>
<summary>查看原文（42行）</summary>

```text
    'git.stage': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const record = payload as { path?: unknown }
      const path = record.path === undefined ? undefined : requireString(payload, 'path')
      await git.stage(cwd, path, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.unstage': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const record = payload as { path?: unknown }
      const path = record.path === undefined ? undefined : requireString(payload, 'path')
      await git.unstage(cwd, path, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.commit': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      const message = requireString(payload, 'message')
      await git.commit(cwd, message, selectedRepoOf(payload))
      return { ok: true }
    },
    // Ship a commit without leaving the panel. Both target the selected
    // checkout through gitCwdOf/selectedRepoOf like every other git route, and
    // both report git's own stderr: a missing upstream (push) or a diverged
    // branch (pull is --ff-only) is the user's to resolve in a terminal.
    'git.push': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.push(cwd, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.pull': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.pull(cwd, selectedRepoOf(payload))
      return { ok: true }
    },
    'git.branch': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      return git.branches(cwd, selectedRepoOf(payload))
    },
    'git.checkout': async (payload) => {
      const { cwd } = await gitCwdOf(payload)
      await git.checkout(cwd, requireString(payload, 'branch'), selectedRepoOf(payload))
      return { ok: true }
```

</details>

**依据 3 · 源码核查**：[src/git.ts:1038-1050](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/git.ts#L1038-L1050)

调用 add、reset、commit。

<details>
<summary>查看原文（13行）</summary>

```text
/** Stage paths (all when path is undefined). */
export async function stage(cwd: string, path: string | undefined, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['add', '-A', ...(path !== undefined ? ['--', path] : [])])
}

/** Unstage paths (all when path is undefined). */
export async function unstage(cwd: string, path: string | undefined, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['reset', '-q', ...(path !== undefined ? ['--', path] : [])])
}

/** Commit the staged changes with a message (global identity untouched). */
export async function commit(cwd: string, message: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['commit', '-m', message])
```

</details>

**依据 4 · 源码核查**：[src/git.ts:1127-1141](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/git.ts#L1127-L1141)

调用 push 和 pull。

<details>
<summary>查看原文（15行）</summary>

```text

/** Push the current branch to its upstream (`git push`). A branch without a
 *  tracking remote fails loudly with git's own message — the panel shows it and
 *  the user fixes the tracking in a terminal. No operands, so there is nothing
 *  for a caller-supplied value to smuggle in as an option. */
export async function push(cwd: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['push'])
}

/** Pull upstream changes into the current branch (`git pull --ff-only`).
 *  Fast-forward-only keeps a headless panel out of merge/conflict editors: a
 *  diverged branch fails with git's own message instead of opening an
 *  interactive merge, so the user resolves it in a terminal. */
export async function pull(cwd: string, selected?: string): Promise<void> {
  await runGit(await repoRoot(cwd, selected), ['pull', '--ff-only'])
```

</details>

#### 缺口

- 未逐项核对 UI 确认与异常恢复
  **影响**：不能保证每种修改都需要确认或可撤销
  **进一步探讨**：在隔离仓库核查操作调用、对话框与失败状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 版本、持续维护及恢复成本如何影响采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

README.md:39-62 将 0.28.2 对应宿主 0.2.1-rc.1+，并要求旧宿主固定兼容版本；这是固定版本作者说明，非本轮宿主兼容实测。package.json 的 peer 依赖和客户端注入进一步表明强宿主耦合。首次要核对宿主、profile 并刷新；持续使用需确认会话当前目录和文件变更；发生错误后需靠 Git 或独立备份检查恢复。取消或停用界面不能撤销已写入文件。对于经常切换会话和文件、可承受核对路径的用户，可在低权限宿主和可丢弃目录试读、单文件编辑和只读图；若路径或版本不符合预期则停止并回到 IDE。现金和人工投入、真实出错率和节时均未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-62](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/README.md#L39-L62)

作者给出宿主和插件版本对应。

<details>
<summary>查看原文（24行）</summary>

````text
## 🚀 Installation

```sh
dsh plugin --profile web add dsh-better-sidebar@latest
```

Then **hard-refresh the browser** (Cmd/Ctrl+Shift+R). Requires DSH **0.2.1-rc.1+**.

> **Compatibility warning — match the plugin to the host line.** As of 2026-10-26, DSH's npm `latest` is **0.2.1-rc.2**, so the command above installs the compatible v0.28.2. Hosts still on **0.2.0-rc.2** must pin `dsh-better-sidebar@0.26.1` (and should upgrade the host to `0.2.1-rc.2` first); DSH 0.2.1-alpha.5 users must pin `dsh-better-sidebar@0.28.0-alpha.0`. The marketplace installer picks the plugin's `latest` regardless of host version, so an old host gets a version-rejection error — upgrade the host or pin the version explicitly. The two packages' `latest` tags are independent.

<details>
<summary><b>Pick the plugin version for your DSH version</b></summary>

| Your DSH version | Install command |
| --- | --- |
| **0.2.1-rc.1+** | `dsh plugin --profile web add dsh-better-sidebar@0.28.2` |
| **0.2.1-alpha.5** | `dsh plugin --profile web add dsh-better-sidebar@0.28.0-alpha.0` |
| **0.2.0-rc.2** | `dsh plugin --profile web add dsh-better-sidebar@0.26.1` |
| **0.2.0-rc.1** | `dsh plugin --profile web add dsh-better-sidebar@0.24.1` |
| **0.1.7-rc.1 ~ 0.1.7 stable** | `dsh plugin --profile web add dsh-better-sidebar@0.22.1` |
| 0.1.7-alpha.x | No compatible release — upgrade DSH to rc.1 first |
| 0.1.6 and earlier (incl. the 0.1.5 line) | `dsh plugin --profile web add dsh-better-sidebar@0.19.1` |

Always pin **exact versions** for older releases (`latest` moves forward with each new stable). Replace `web` with your own profile name.
````

</details>

**依据 2 · 源码核查**：[package.json:39-59](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/package.json#L39-L59)

声明 DSH bundle、客户端注入及运行要求。

<details>
<summary>查看原文（21行）</summary>

```text
  },
  "packageManager": "pnpm@11.8.0",
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
        "@deepseek-ai/dsh-client-modules"
      ],
      "platform": "web"
    },
    "manifestVersion": 1
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
```

</details>

**依据 3 · 源码核查**：[src/fs-operations.ts:162-199](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/fs-operations.ts#L162-L199)

保存会修改目标文件。

<details>
<summary>查看原文（38行）</summary>

```text
export async function writeWorkspaceText(input: WorkspaceWriteInput): Promise<{ mtimeMs?: number }> {
  const { cwd, path, content, expectedMtimeMs } = input
  const absolute = await ensureWorkspaceWritePath(cwd, path)
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
```

</details>

#### 缺口

- 现金、人时、恢复成功率和节时均未知
  **影响**：不能量化净收益
  **进一步探讨**：在可丢弃 profile 测试文件保存、禁用与备份恢复并记录成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 细粒度路径授权可否减小误操作？

**研究主题**：新假设与验证

#### 完整回答

由请求准入与文件路径不设 workspace 限制的边界，可提出未验证假设：为单次写操作授予可见、可撤销的真实路径范围并对符号链接目标进行一致校验，可能让用户控制跨目录权限而不牺牲全部跨目录工作。相对现有方案增加权限确认和迁移负担；应在受控环境比较合法跨目录任务、链接逃逸及误拒绝率，若它妨碍常见工作或仍不能限制真实写目标则放弃。当前无原型与实验，不能当作现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/path-security.ts:38-76](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/path-security.ts#L38-L76)

目标解析不限制工作区，可作为假设出发点。

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

**依据 2 · 源码核查**：[src/index.ts:1629-1661](https://github.com/omdsh-dev/DSH-better-sidebar/blob/2d736f5496fe97f4bba6af37d99861649b9ef3c0/src/index.ts#L1629-L1661)

已准入请求可触发文件写入。

<details>
<summary>查看原文（33行）</summary>

```text
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/sidebar/write',
    handler: async (req, res) => {
      if (!fence(req)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'method-error', message: 'method not allowed' } })
        return
      }
      try {
        const url = new URL(req.url ?? '/', 'http://dsh.internal')
        const sessionId = url.searchParams.get('sessionId')
        const path = url.searchParams.get('path')
        if (sessionId === null || path === null || path === '') {
          throw new SidebarError('bad-request', 'sessionId and path are required')
        }
        const cwd = await activeWorktreeRootOf(ctx, sessionId, await sessionCwdOf(ctx, sessionId, url.searchParams.get('cwd') ?? undefined))
        // Optimistic concurrency: the client sends the mtime its draft was
        // based on. Absent = no gate (a brand-new file has no baseline).
        const raw = url.searchParams.get('expectedMtimeMs')
        const parsed = raw === null ? Number.NaN : Number(raw)
        const expectedMtimeMs = Number.isFinite(parsed) ? parsed : undefined
        const content = await readTextBody(req, WRITE_BODY_GUARD_BYTES)
        const result = await writeWorkspaceText({
          cwd,
          path,
          content,
          ...(expectedMtimeMs === undefined ? {} : { expectedMtimeMs }),
        })
        writeOk(res, { ok: true, ...result })
```

</details>

#### 缺口

- 没有设计原型和故障实验
  **影响**：不能推断该假设能降低事故
  **进一步探讨**：比较合法跨目录任务、符号链接边界和误拒绝。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
