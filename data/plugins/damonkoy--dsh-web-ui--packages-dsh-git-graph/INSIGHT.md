# DSH Git Graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui) [![npm 30d 98,719](https://img.shields.io/static/v1?label=npm+30d&message=98%2C719&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)
<!-- END META -->

> **功能**：在 DSH Web 对话中展示 Git 分支及提交图，并支持切换和新建分支。

> **亮点**：把当前分支和提交图加入会话边的上下文，支持由用户控制的工作区切换，见 [Q01](#research-q01)。

> **主要限制**：操作作用于共享 checkout，其他会话及未提交改动需核对，见 [Q02](#research-q02)。

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
  - [Q01 · 何时需要在会话里显示分支和历史？](#detail-section-11)
  - [Q02 · 点击切换如何约束真实 checkout？](#detail-section-12)
  - [Q03 · 哪种试用能测同屏收益且避免误切？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在同一 DSH Web 工作区频繁核对 Git 分支的开发者，见 [Q01](#research-q01)。

与终端 git status、git log 和 IDE 图对照，比较定位时间，见 [Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提交图 | 核对最近分支历史 | 条数受查询上限 |
| 分支操作 | 切换和创建 | 影响整个物理 checkout |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| webServer、subprocess、workspaceRegistry | 宿主必需 | 路由与真实 Git 操作 | 不能加载服务 |
| 注册工作区与 Git | 目标需要 | 读取和切换 | 返回空或错误 |
| Web 槽和会话 | 界面需要 | 分支入口和查看 | 尝试回退槽 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 打开临时工作区 | 命令行保存基线 |
| 查看 | 比对真实分支与图 | 指向预期 repo |
| 退出 | 停用并核对 checkout | 回到 Git 命令行 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主及 Git | 确认工作区范围 | 配置时间未知 |
| 持续 | 状态查询和轮询 | 核对其他会话 | 时间和负载未测 |
| 退出 | 有真实 checkout 变更 | 核对分支和工作树 | 卸载不恢复 checkout |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 分支上下文 | 可显示工作区图与分支 | 查询节约时间 |
| 受控切换 | 可检查冲突及其他 worktree | 实际并发安全 |

> **思考**：操作作用于共享 checkout，其他会话及未提交改动需核对，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把当前分支和提交图加入会话边的上下文，支持由用户控制的工作区切换，见 [Q01](#research-q01)。

将真实 Git guard 和界面槽分开，但物理工作区仍共享，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

操作作用于共享 checkout，其他会话及未提交改动需核对，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先查分支与图，切换只用可丢弃仓库。对照其他会话及工作树后退出，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持分支、图和真实切换，跨会话体验与并发结果未运行验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-git-graph/package.json、packages/dsh-git-graph/tsdown.config.ts、packages/dsh-git-graph/cordis.patch.yml、packages/dsh-git-graph/README.md、packages/dsh-git-graph/src/client/index.ts、packages/dsh-git-graph/src/host/git-service.ts、packages/dsh-git-graph/src/index.ts、packages/dsh-git-graph/src/host/routes.ts 及固定范围 inventory；组件：packages/dsh-git-graph。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定子包宿主与 Web，未运行目标代码或 Git 变更。
- 下一步：比较原 Git 和面板状态，验证共享会话和拒绝条件，见 [Q03](#research-q03)。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

在切换前列出共享同一 checkout 的活动会话，测试能否减少误切，见 [Q03](#research-q03)。

比较原 Git 和面板状态，验证共享会话和拒绝条件，见 [Q03](#research-q03)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 241 | — | — | 4667 |
| .ts | source | 14 | 1837 | 1201 | 498 | — |
| .tsx | source | 5 | 761 | 580 | 134 | — |
| .tsx | test | 2 | 580 | 458 | 64 | — |
| .ts | test | 3 | 914 | 753 | 61 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：工作区中的 Git 分支切换怎样从 DSH 发起，影响哪些会话及已有变更？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时需要在会话里显示分支和历史？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

同时维护多个分支并轮流打开 DSH 工程会话的开发者，可先确认当前分支及提交线，再决定后续任务。相比 git status、git log，插件让上下文入口显示在工作区选择器附近。Web 根据运行的槽声明选择首选上下文位置，否则等待后退到 dock。该组件仍让宿主处理工作区选择，避免并行作用域入口。图只读限定数量的提交，不是完整历史导出。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-git-graph/README.md:5-7](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/README.md#L5-L7)

作者描述界面与操作。

```text
External dsh Web GUI plugin: a **git branch selector** and **Git graph** panel, mounted in the context hole of the official input selector row (`conversation.input.selector.context`, a session-maybe list slot) next to the official workspace selector pill, just above the input card; if the running shell does not declare that slot (the npm SDK rc.6 removed it), it waits `CONTEXT_FALLBACK_MS` then falls back to `conversation.input.dock` (the 0.1.9 mount point). On the dock, the active phase measures the input card's left edge so the chip starts flush with the card, and the hero (blank-session) phase lifts the chip into the official hero row immediately after the agent-preset seat — right of the preset name, with the same transparent 28px pill recipe and the same `--dsw-*` theme tokens as the official workspace/preset chips. Git capabilities run for real in the host process (checkout-tree `git switch`), the UI is browser React; workspace selection is left entirely to the official entry (product decision: the in-house selector is retired, no dual entry is kept).

Behavior aligns with ZCode's `GitBranchSwitcher`: searchable popover, a checkmark on the current item, bottom actions "创建并检出新分支… / Git 图谱" (Create and check out new branch… / Git graph), a switch guard (unresolved conflicts / an operation in progress / the target branch checked out by another worktree) and readable errors.
```

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:186-215](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/client/index.ts#L186-L215)

首选槽及延迟回退。

<details>
<summary>查看原文（30行）</summary>

```text
    // The entry shape shared by both seats; each register call spells the
    // seat's literal name so its own declaration is checked.
    const chipEntry = { id: 'git-graph', order: 100, locale: NS, inject: injected } as const

    // Declaration-aware with a fallback. A bare register() would throw on
    // shells that dropped the hole (SDK SlotCore.register rejects undeclared
    // slots), so both seats route through inject like the pet / remote-web-ui
    // entries. The preferred context wait resolves the moment the shell
    // declares the hole; when it never does (rc.6 and the current shipped
    // shell), the fallback disposes that wait and moves the chip to the
    // dock, whose row sits directly above the composer card. BranchChip
    // indents the dock copy by the shell's composer side clearance in the
    // active phase and joins the official hero chip row (right of the agent
    // preset) in the hero phase. Exactly one seat mounts: a context
    // declaration landing after the fallback finds the wait gone.
    let mounted = false
    const disposeContextWait = scope.slots.inject('conversation.input.selector.context', () => {
      mounted = true
      return scope.slots.register(
        { name: 'conversation.input.selector.context', ...chipEntry },
        BranchChip)
    })
    fallbackTimer = setTimeout(() => {
      if (mounted) return
      disposeContextWait()
      scope.slots.inject('conversation.input.dock', () =>
        scope.slots.register(
          { name: 'conversation.input.dock', ...chipEntry },
          BranchChip))
    }, CONTEXT_FALLBACK_MS)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:231-247](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/git-service.ts#L231-L247)

提交图额度，标记还有后续。

<details>
<summary>查看原文（17行）</summary>

```text
  async graph(path: string, limit = 200): Promise<GraphView | null> {
    const gated = await this.gate(path)
    if (!gated.ok) return null
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return null
    const [logResult, branchResult] = await Promise.all([
      this.runner.run(graphLogArgv(limit + 1), root),
      this.runner.run(headBranchArgv(), root),
    ])
    const commits = parseGraph(logResult.stdout)
    const hasMore = commits.length > limit
    const branch = branchResult.stdout.trim()
    return {
      root,
      branch: branch === DETACHED ? '' : branch,
      commits: hasMore ? commits.slice(0, limit) : commits,
      hasMore,
```

</details>

#### 缺口

- 未比较窗口切换收益
  **影响**：影响只可按频繁复核场景推断
  **进一步探讨**：用相同目标在界面和终端确认两次分支及一条提交

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 点击切换如何约束真实 checkout？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

宿主要求 webServer、subprocess、workspaceRegistry。路由检查 loopback 与 JSON，服务用 realpath 检查请求是注册工作区，然后解析仓库根。切换用实际 git switch，预查未解决冲突、正在进行的 Git 操作和目标是否由另一个 worktree 占用。新建还检查分支名与重名。如果在预查后外部状态变化，真正的 Git 调用仍可能失败，界面显示错误。切换针对物理 checkout，其他会话共享同一工作区时也观察到变化。关闭 UI 不会还原分支。SSE 回报分支状态但依赖订阅和轮询，不保证每毫秒一致。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/index.ts:20-50](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/index.ts#L20-L50)

三项宿主能力、真实路径与注册范围。

<details>
<summary>查看原文（31行）</summary>

```text
/** Required services: the route registry, the managed subprocess seam, and the workspace registry. */
export const inject = ['webServer', 'subprocess', 'workspaceRegistry']

/**
 * The workspace-membership gate: canonicalize the requested path and require
 * it to equal a registered workspace path. This is the security boundary of
 * the /git routes — the browser may only run git on workspace roots, never
 * arbitrary host directories.
 */
function createWorkspaceGate(ctx: Context): WorkspaceGate {
  return async (path) => {
    let canonical: string
    try {
      canonical = await realpath(path)
    } catch {
      return { ok: false, error: { code: 'workspace-unknown', message: 'path does not resolve on disk' } }
    }
    if (ctx.workspaceRegistry.list().some(workspace => workspace.path === canonical)) {
      return { ok: true, canonical }
    }
    return { ok: false, error: { code: 'workspace-unknown', message: 'path is not a registered workspace' } }
  }
}

/**
 * Mount the git service and its routes.
 * @param ctx - context carrying webServer, subprocess, and workspaceRegistry.
 */
export function apply(ctx: Context): void {
  const service = new GitService(subprocessRunner(ctx), createWorkspaceGate(ctx))
  ctx.effect(() => registerGitRoutes(ctx, service), 'dsh-git-graph: /git routes')
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:77-104](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/routes.ts#L77-L104)

loopback 和站点检查。

<details>
<summary>查看原文（28行）</summary>

```text
 * routes: a loopback socket address AND a loopback Host header, plus browser
 * same-origin markers. The /git operations mutate the real repository, so a
 * LAN-exposed dsh web must not serve them to unpaired devices. The socket
 * address is authoritative; X-Forwarded-For is never trusted (matching
 * dsh-ssh).
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

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:238-276](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/routes.ts#L238-L276)

分支读写 API。

<details>
<summary>查看原文（39行）</summary>

```text
      case '/git/status':
        okView(res, await service.status(path), isRepoStatus)
        return
      case '/git/branches':
        okView(res, await service.branches(path), isBranchesView)
        return
      case '/git/graph': {
        const rawLimit = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).limit
          : undefined
        const limit = typeof rawLimit === 'number' && rawLimit > 0 && rawLimit <= 1000 ? rawLimit : undefined
        okView(res, await service.graph(path, limit), isGraphView)
        return
      }
      case '/git/switch': {
        const branch = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).branch
          : undefined
        if (typeof branch !== 'string' || branch === '') {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await service.switchBranch(path, branch)
        json(res, result.ok ? OK({ branch: result.branch }) : FAIL(isGitError(result.error) ? result.error : MALFORMED_VIEW))
        return
      }
      case '/git/create-branch': {
        const name = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).name
          : undefined
        if (typeof name !== 'string' || name === '') {
          json(res, FAIL(BAD_REQUEST))
          return
        }
        const result = await service.createBranch(path, name)
        json(res, result.ok ? OK({ branch: result.branch }) : FAIL(isGitError(result.error) ? result.error : MALFORMED_VIEW))
        return
      }
      default:
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:169-226](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/git-service.ts#L169-L226)

实际操作、失败和名称检查。

<details>
<summary>查看原文（58行）</summary>

```text
   * Switch the workspace's checked-out branch: real `git switch --no-guess`
   * on disk, affecting every session in the workspace (never a per-session
   * override). Guards run before the mutation; switch failures classify onto
   * the stable error codes.
   * @param path - workspace root.
   * @param branch - existing local branch name.
   */
  async switchBranch(path: string, branch: string): Promise<SwitchResult> {
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    const formatted = await this.runner.run(checkRefFormatArgv(branch), root)
    if (formatted.exitCode !== 0) {
      return { ok: false, error: { code: 'invalid-branch-name', message: formatted.stderr.trim() || 'invalid branch name' } }
    }
    const verified = await this.runner.run(verifyRefArgv(branch), root)
    if (verified.exitCode !== 0) {
      return { ok: false, error: { code: 'target-branch-not-found', message: `branch "${branch}" does not exist locally` } }
    }
    const currentResult = await this.runner.run(headBranchArgv(), root)
    const current = currentResult.stdout.trim()
    if (current === branch) return { ok: true, branch }
    const blocked = await this.guardBlock(root, branch)
    if (blocked !== null) return { ok: false, error: blocked }
    const switched = await this.runner.run(switchArgv(branch), root)
    if (switched.exitCode === 0) return { ok: true, branch }
    return { ok: false, error: classifySwitchFailure(switched.stderr) }
  }

  /**
   * Create a branch from the current HEAD and switch to it
   * (`git switch --no-guess -c <name>`). The authoritative name gate is
   * `git check-ref-format --branch`; duplicates are rejected up front.
   * @param path - workspace root.
   * @param name - proposed branch name.
   */
  async createBranch(path: string, name: string): Promise<SwitchResult> {
    const mirrorReason = validateBranchName(name)
    if (mirrorReason !== null) {
      return { ok: false, error: { code: 'invalid-branch-name', message: `invalid branch name: ${mirrorReason}` } }
    }
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    const formatted = await this.runner.run(checkRefFormatArgv(name), root)
    if (formatted.exitCode !== 0) {
      return { ok: false, error: { code: 'invalid-branch-name', message: formatted.stderr.trim() || 'invalid branch name' } }
    }
    const refs = await this.runner.run(forEachRefArgv(), root)
    if (parseBranches(refs.stdout).some(row => row.name === name)) {
      return { ok: false, error: { code: 'branch-already-exists', message: `branch "${name}" already exists` } }
    }
    const blocked = await this.guardBlock(root, undefined)
    if (blocked !== null) return { ok: false, error: blocked }
    const created = await this.runner.run(createBranchArgv(name), root)
    if (created.exitCode === 0) return { ok: true, branch: name }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:287-312](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/git-service.ts#L287-L312)

预查 Git 状态。

<details>
<summary>查看原文（26行）</summary>

```text
   * The pre-switch guards (ZCode branchSwitcher semantics): unresolved
   * conflicts, in-progress operations, and a target already checked out in
   * another worktree.
   * @param root - repository root.
   * @param target - target branch; undefined for create (worktree check skipped).
   * @returns the rejection, or null when the switch may proceed.
   */
  private async guardBlock(root: string, target: string | undefined): Promise<GitError | null> {
    const [conflicts, inProgress, worktrees] = await Promise.all([
      this.runner.run(unmergedArgv(), root),
      this.operationInProgress(root),
      target === undefined ? Promise.resolve(null) : this.runner.run(worktreeListArgv(), root),
    ])
    const conflictCount = conflicts.stdout.split('\n').filter(line => line !== '').length
    if (conflictCount > 0) {
      return { code: 'conflicts-present', message: `repository has ${conflictCount} unresolved conflict(s)` }
    }
    if (inProgress) {
      return { code: 'operation-in-progress', message: 'a git operation is in progress' }
    }
    if (target !== undefined && worktrees !== null && parseWorktreeBranches(worktrees.stdout).includes(target)) {
      return { code: 'branch-in-other-worktree', message: `branch "${target}" is checked out in another worktree` }
    }
    return null
  }
}
```

</details>

**依据 6 · 作者声明**：[packages/dsh-git-graph/README.md:70-77](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/README.md#L70-L77)

作者说明共享 checkout 及刷新范围。

```text
## Design notes

- Boundary and load-chain research and key decisions: see [docs/ADR-001-plugin-boundary.md](docs/ADR-001-plugin-boundary.md).
- The host half's `/git/*` only accepts paths of registered workspaces (realpath check) and loopback clients (loopback socket + loopback Host, the same fence as dsh-ssh); the browser cannot run git against arbitrary directories, and a LAN-exposed dsh web answers non-loopback clients with 403.
- The switch semantics are workspace-level: `git switch --no-guess <branch>` operates on the repoRoot checkout tree and affects all sessions of that workspace; project switch = activate the target workspace and open its (reused or newly created) blank session, without changing the cwd of existing sessions.
- Mount seam: `conversation.input.selector.context` (the officially declared session-maybe list slot) — the context hole of the input selector row, next to the official workspace pill; both the hero (blank session) and active-session phases show the branch pill; the branch chip hides itself when there is no session cwd or it is not a git workspace. Declaration-aware with fallback: it waits `CONTEXT_FALLBACK_MS` for the slot declaration (the npm SDK rc.6 shell removed this declaration); if no declaration arrives by the timeout it remounts on `conversation.input.dock`. On the dock the active phase is left-aligned with the input card via a live measurement of its left edge; the hero phase re-anchors the chip into the official hero row after the agent-preset seat (2px official row gap, vertically centered, matching the workspace/preset chip metrics and tokens) and opens the picker downward like the official workspace menu. Only one seat is mounted, and late context declarations after the fallback are ignored.
- Workspace selection is not inside this plugin: the official workspace pill (`conversation.input.selector.workspace`) is the only entry; this plugin only provides git branch context.
- Branch state refresh: fetch on mount / popover open / successful switch + host SSE (`/git/events`, polling workspace state every 30s while subscribed, each probe bounded by a 15s deadline so a hung git never stalls the stream) pushing external changes + refresh on window focus (throttled to once per 5s).
```

#### 缺口

- 未实测两会话交错操作或宿主兼容
  **影响**：不能保证切换期间的任务一致性
  **进一步探讨**：在副本试外部切换、脏工作区和分支被占用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪种试用能测同屏收益且避免误切？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先只读试图和分支显示，在可丢弃工作区比对原 git status。若要创建或切换，先记录未提交改动和其他会话是否还在使用该 checkout。统计窗口切换、SSE 更新延迟、错误复核与恢复时间。可进一步在切换前提示共享 checkout 的活动会话数，并在对照中加入正在编辑的第二会话。若提示不能降低误切或错误恢复成本增加，退出到原命令行，不继续扩大适用范围。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:169-196](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/src/host/git-service.ts#L169-L196)

切换产生 checkout 状态变化。

<details>
<summary>查看原文（28行）</summary>

```text
   * Switch the workspace's checked-out branch: real `git switch --no-guess`
   * on disk, affecting every session in the workspace (never a per-session
   * override). Guards run before the mutation; switch failures classify onto
   * the stable error codes.
   * @param path - workspace root.
   * @param branch - existing local branch name.
   */
  async switchBranch(path: string, branch: string): Promise<SwitchResult> {
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    const formatted = await this.runner.run(checkRefFormatArgv(branch), root)
    if (formatted.exitCode !== 0) {
      return { ok: false, error: { code: 'invalid-branch-name', message: formatted.stderr.trim() || 'invalid branch name' } }
    }
    const verified = await this.runner.run(verifyRefArgv(branch), root)
    if (verified.exitCode !== 0) {
      return { ok: false, error: { code: 'target-branch-not-found', message: `branch "${branch}" does not exist locally` } }
    }
    const currentResult = await this.runner.run(headBranchArgv(), root)
    const current = currentResult.stdout.trim()
    if (current === branch) return { ok: true, branch }
    const blocked = await this.guardBlock(root, branch)
    if (blocked !== null) return { ok: false, error: blocked }
    const switched = await this.runner.run(switchArgv(branch), root)
    if (switched.exitCode === 0) return { ok: true, branch }
    return { ok: false, error: classifySwitchFailure(switched.stderr) }
```

</details>

**依据 2 · 作者声明**：[packages/dsh-git-graph/README.md:64-77](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-git-graph/README.md#L64-L77)

停用路径和共享范围。

<details>
<summary>查看原文（14行）</summary>

````text
## Uninstall

```sh
dsh plugin --profile web remove @linxin666/dsh-client-ui-git-graph
```

## Design notes

- Boundary and load-chain research and key decisions: see [docs/ADR-001-plugin-boundary.md](docs/ADR-001-plugin-boundary.md).
- The host half's `/git/*` only accepts paths of registered workspaces (realpath check) and loopback clients (loopback socket + loopback Host, the same fence as dsh-ssh); the browser cannot run git against arbitrary directories, and a LAN-exposed dsh web answers non-loopback clients with 403.
- The switch semantics are workspace-level: `git switch --no-guess <branch>` operates on the repoRoot checkout tree and affects all sessions of that workspace; project switch = activate the target workspace and open its (reused or newly created) blank session, without changing the cwd of existing sessions.
- Mount seam: `conversation.input.selector.context` (the officially declared session-maybe list slot) — the context hole of the input selector row, next to the official workspace pill; both the hero (blank session) and active-session phases show the branch pill; the branch chip hides itself when there is no session cwd or it is not a git workspace. Declaration-aware with fallback: it waits `CONTEXT_FALLBACK_MS` for the slot declaration (the npm SDK rc.6 shell removed this declaration); if no declaration arrives by the timeout it remounts on `conversation.input.dock`. On the dock the active phase is left-aligned with the input card via a live measurement of its left edge; the hero phase re-anchors the chip into the official hero row after the agent-preset seat (2px official row gap, vertically centered, matching the workspace/preset chip metrics and tokens) and opens the picker downward like the official workspace menu. Only one seat is mounted, and late context declarations after the fallback are ignored.
- Workspace selection is not inside this plugin: the official workspace pill (`conversation.input.selector.workspace`) is the only entry; this plugin only provides git branch context.
- Branch state refresh: fetch on mount / popover open / successful switch + host SSE (`/git/events`, polling workspace state every 30s while subscribed, each probe bounded by a 15s deadline so a hung git never stalls the stream) pushing external changes + refresh on window focus (throttled to once per 5s).
````

</details>

#### 缺口

- 未做真实流程试验
  **影响**：采用限定只读与可丢弃副本
  **进一步探讨**：分别测试状态读取与变更，比较误操作和恢复时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
