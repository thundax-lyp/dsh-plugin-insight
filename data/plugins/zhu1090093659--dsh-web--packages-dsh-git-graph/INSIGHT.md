# dsh-git-graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph)

<!-- BEGIN META -->
[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=yellow&logo=github&style=flat)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 94,671](https://img.shields.io/static/v1?label=npm+30d&message=94%2C671&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)
<!-- END META -->

> **实现功能**：在 DSH 界面显示 Git 分支与提交图，并管理独立 worktree 和新会话工作区。

> **核心亮点**：它把原生 git worktree 能力与 DSH 工作区注册及空会话入口组合，创建独立 wt/ 分支后将路径交给新会话，而不是让现有会话静默换目录。宿主执行与浏览器展示分开，工作区 realpath 门禁与托管目录约束为集成提供边界；Git 隔离机制本身归属上游。[Q02](#research-q02)

> **风险与缺陷**：隔离只成立于实际进入新 worktree 的会话。当前会话 cwd 不变，分支切换仍作用于整个共享工作区；此外模型工具先创建磁盘 worktree、再注册 workspace，两步间没有在该入口看到补偿，注册失败可能留下需人工核对的部分状态。这是源码推断的恢复风险，未复现。[Q03](#research-q03)

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
  - [Q01 · 图形 Git 与 worktree 面向谁，怎样算隔离成功？](#detail-section-11)
  - [Q02 · 如何从操作入口到独立 checkout，贡献与上游在哪里？](#detail-section-12)
  - [Q03 · 工作区和 Git 两套状态在失败时是否一致？](#detail-section-13)
  - [Q04 · 部署与日常隔离有哪些前提和阶段投入？](#detail-section-14)
  - [Q05 · 可回读的阶段恢复值得做吗，谁应先试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为在 DSH Web 或官方桌面中操作 Git 仓库、并行开展多会话开发的用户，提供空会话分支选择、提交图和独立 worktree 管理。合格产物是正确仓库状态和可进入的新工作区；图形展示不代替合并验收。

终端 git worktree add 加手工创建 DSH 工作区是直接基线；普通 git switch 不提供独立树。集成差异成立，端到端冲突与时间收益仍未知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分支与提交图 | 查看仓库上下文与切换分支 | 分支选择限定空会话，切换影响共享工作区 |
| Worktree 创建管理 | 为并行任务准备独立 checkout | 创建新 wt/ 分支；需在新工作区开会话 |
| git_worktree | 让模型管理托管 worktree | 默认关闭；调用会话 cwd 决定仓库范围 |
| 状态流 | 反映外部 Git 状态变化 | 受轮询和请求期限影响，未测延迟 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.3、Web UI 与工作区注册表 | 启动必需 | 挂载插件和限定 Git 路径 | 不注册服务，兼容性需实际验收 |
| Git 与宿主 subprocess 服务 | 操作必需 | 查询、切分支和 worktree 操作 | 返回操作错误；不在浏览器执行 Git |
| 可写 DSH_HOME/worktrees 与仓库 | 创建必需 | 保存托管 checkout 和新分支 | 创建失败，需要核对残留状态 |
| agentTool 开关及 tools 服务 | 模型管理可选 | 注册 git_worktree | 默认关闭，界面功能仍独立 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在 web profile 安装包并重启、刷新 | 空会话出现分支入口；活动会话不显示 |
| 2 | 用户在已注册 Git 工作区查看图或创建 worktree | 得到独立 wt/ 分支和托管路径；冲突拒绝 |
| 3 | 用户打开新注册工作区的会话 | 新会话 cwd 位于 worktree；旧会话不移动 |
| 4 | 用户合并后清理 worktree | 脏状态默认拒绝；强制删除需要另行确认并核对分支 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Git、宿主与安装资源；金额未知 | 核对 SDK 版本与仓库权限 | 未计安装实测时间 |
| 持续使用 | 每 worktree 文件副本、状态查询进程 | 分支交接、依赖安装、合并复核 | worktree 不共享 node_modules 等未跟踪构建资源的成本需测量 |
| 失败恢复 | 残留 checkout 与分支占用 | 对账 Git、工作区注册表和会话 | 两阶段创建中断的恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 并行隔离 | 新分支与独立 checkout 的创建链 | 实际任务冲突率和交付时间变化 |
| 误操作约束 | 注册工作区、托管目录和脏状态检查 | 与外部 Git 并发时的整体安全性 |
| 状态可见 | 提交图查询与 SSE 生命周期 | 多标签页和大仓库延迟、资源量 |

> **思考**：隔离只成立于实际进入新 worktree 的会话。当前会话 cwd 不变，分支切换仍作用于整个共享工作区；此外模型工具先创建磁盘 worktree、再注册 workspace，两步间没有在该入口看到补偿，注册失败可能留下需人工核对的部分状态。这是源码推断的恢复风险，未复现。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把原生 git worktree 能力与 DSH 工作区注册及空会话入口组合，创建独立 wt/ 分支后将路径交给新会话，而不是让现有会话静默换目录。宿主执行与浏览器展示分开，工作区 realpath 门禁与托管目录约束为集成提供边界；Git 隔离机制本身归属上游。[Q02](#research-q02)

它把原生 git worktree 能力与 DSH 工作区注册及空会话入口组合，创建独立 wt/ 分支后将路径交给新会话，而不是让现有会话静默换目录。宿主执行与浏览器展示分开，工作区 realpath 门禁与托管目录约束为集成提供边界；Git 隔离机制本身归属上游。[Q02](#research-q02)

GitService 集中 Git 业务规则，路由负责 envelope 与 SSE 生命周期；可借鉴 realpath 工作区限定、托管路径约束和按设置注册模型工具。移植依赖宿主注册表、subprocess 与 Git 错误语义，应补测双状态创建的恢复。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

隔离只成立于实际进入新 worktree 的会话。当前会话 cwd 不变，分支切换仍作用于整个共享工作区；此外模型工具先创建磁盘 worktree、再注册 workspace，两步间没有在该入口看到补偿，注册失败可能留下需人工核对的部分状态。这是源码推断的恢复风险，未复现。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

多会话开发者可在临时仓库试用，先验证新会话确实进入独立 cwd，再测试脏目录删除被拒绝及禁用后的状态保留。已有终端 worktree 流程且不需图形入口者收益较小。若出现孤儿 checkout、注册失配或共享工作区被误切换，应先人工对账并暂停自动隔离。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持界面与宿主 Git/workspace 接线；并行收益及中断恢复没有运行验证，新阶段恢复设计为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-git-graph/README.md、packages/dsh-git-graph/package.json、packages/dsh-git-graph/src/index.ts、packages/dsh-git-graph/src/host/routes.ts、packages/dsh-git-graph/src/host/git-service.ts、packages/dsh-git-graph/src/host/access.ts、packages/dsh-git-graph/src/host/agent-tool.ts 及固定范围 inventory；组件：packages/dsh-git-graph。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查本组件宿主入口、Git 服务、工具与路由，未审计全部客户端和共享生成模块，也未运行 Git 操作或安装插件。
- 下一步：在临时仓库核对新旧会话 cwd 与分支，制造脏树删除和注册失败，记录 Git、workspace 和磁盘是否一致。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.8（[固定提交 6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是给“创建 worktree → 注册 workspace → 打开会话”加入可回读操作记录与阶段补偿，让中断后按真实 Git 和注册表对账再继续。由两种状态系统分开提交推导，增量在恢复语义而非再包装 Git。用故障注入分别在磁盘创建后、注册后中断，与当前流程对比孤儿 worktree、重复工作区和人工恢复时间；若同等负担下无改善，或误删用户状态，否定方案。[Q05](#research-q05)

在临时仓库核对新旧会话 cwd 与分支，制造脏树删除和注册失败，记录 Git、workspace 和磁盘是否一致。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：packages/dsh-git-graph；内容摘要：ff7b73e3e498baad97968e1f97d0b19e520a9f87a686b2e3f7434ed2e0ac85d5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 108 | — | — | 1550 |
| .ts | source | 5 | 1179 | 804 | 313 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Git UI 与 worktree 集成能否提供真实隔离边界，并分析跨磁盘、工作区和会话的恢复成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 图形 Git 与 worktree 面向谁，怎样算隔离成功？

**研究主题**：场景与需求

#### 完整回答

作者面向 DSH Web 和官方桌面用户，把分支选择限制在空会话，将图形图与 worktree 管理相连。基线是终端 git switch/worktree 再手动创建 DSH 工作区。成功不能只看出现图标，要检查新 checkout、新分支、已注册工作区与新会话 cwd 一致，并在合并清理后保留所需提交。README 明确活动会话隐藏分支入口，但同工作区已有会话仍可能受到工作区层面的 Git 状态影响，所以它不是每会话虚拟 Git。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-git-graph/README.md:18-24](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/README.md#L18-L24)

作者说明入口和上游行为参照

```text
An external plugin for DeepSeek Harness (DSH) Web GUI and official desktop client: featuring an **interactive Git branch switcher** and a **visual Git commit graph** panel. The branch switcher appears exclusively on blank conversations, mounting on the shell's composer dock (`conversation.input.dock`), the seam every shipped shell declares. In blank conversation hero state, the chip elevates into the hero row directly right of the agent-preset chip, styled with authentic 28px pill layout and `--dsw-*` theme tokens. Active sessions hide the switcher. Git operations run in the host process (`git switch`) while the UI renders via React.

Mirrors ZCode's `GitBranchSwitcher` behavior: searchable dropdown, active checkmark, "Create and switch branch... / Git Graph" footer actions, safety guards (unresolved merge conflicts, operations in progress, branch locked by other worktrees), and clear error diagnostics.

## Repository layout and build

The plugin is a self-contained cordis plugin package inside the dsh-web family monorepo (see "Generic install" below); no DeepSeek Harness source checkout is involved. All peer APIs come from the official `@deepseek-ai/*` npm SDK declared in `devDependencies`, resolved from `node_modules`, and the type gate is `pnpm run typecheck` (`tsc -b` over the package's own host and client programs).
```

**依据 2 · 作者声明**：[packages/dsh-git-graph/README.md:70-82](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/README.md#L70-L82)

隔离、开关和不可迁移 cwd 的约束

<details>
<summary>查看原文（13行）</summary>

```text
## Worktree isolation

The branch popover carries two worktree entries (a worktree is a linked git checkout that shares the repository history but owns its files and branch, so parallel sessions never touch each other's tree):

- **Start a new session in a worktree…** opens a dialog: name the worktree and pick the base branch (the current branch is preselected). The host creates the worktree at `$DSH_HOME/worktrees/<repo-key>/<name>/` on a NEW branch `wt/<name>` (git forbids checking out one branch in two places), registers it as a workspace, and opens its blank session. The current checkout never moves.
- **Manage worktrees…** lists every linked worktree of the repository with branch/head. Managed worktrees can be removed: a dirty worktree rejects once and then offers an inline force-confirm; the `wt/` branch survives removal unless the row's delete-branch checkbox is on. The primary checkout row is display-only.

Two gates live in the plugin's settings card (both off by default):

- **Auto-isolation** (`autoIsolate`): the New Session action of a git workspace silently creates a fresh managed worktree and starts the session there — the Claude-desktop-style automatic shape. `autoBaseline` picks the base: the checkout's current HEAD (`current`) or the remote default branch (`default`, resolved as `origin/HEAD` with a HEAD fallback when no remote exists). Workspaces already inside the managed home are never re-isolated, and any failure degrades to the official new-session behavior. This wraps the browser-side workspaces service at runtime — a shape-probed patch, not a source change; an SDK update that changes that service disables the feature with a console diagnostic instead of breaking anything.
- **Agent tool** (`agentTool`): registers the model-facing `git_worktree` tool (create/list/remove over the same managed home, workspace-gated by the calling session's cwd). This deliberately lifts the package's "git stays off the model-visible surface" rule for opted-in users. Mind the sandbox boundary: a session's cwd is immutable, so the current session cannot move into the worktree, and under workspace-write sandboxing the agent cannot write outside its session root — `create` therefore also registers the worktree as a workspace and its reply tells the model to open a new session there. Under danger-full-access the agent may work in the returned path directly.

Removal only ever targets direct children of the repository's managed directory (canonical-path containment on both sides) and unregisters the linked workspace after the disk removal succeeds.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从操作入口到独立 checkout，贡献与上游在哪里？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

宿主 apply 构建 GitService，使用 realpath 后与注册工作区做精确路径匹配，再注册 HTTP 路由。addWorktree 仅接受名称与基线，路径由宿主构造，检查新 wt/ 分支和目录冲突，再调用 Git worktree add。可选模型工具从执行身份取当前 cwd，创建成功后注册工作区并返回新会话提示。独立文件树和分支隔离归属 Git；本插件的增量是将 Git 状态与 DSH 会话、工作区及图形入口连接。该组合有可复用的边界设计，但还不能用源码认定节省了多少冲突处理时间。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/index.ts:53-71](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/index.ts#L53-L71)

注册工作区 realpath 门禁

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:305-354](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/git-service.ts#L305-L354)

名称、分支、目录、基线检查与真实 Git 调用

<details>
<summary>查看原文（50行）</summary>

```text
   * Create a managed worktree: `git worktree add -b wt/<name> <target> <baseRef>`
   * under $DSH_HOME/worktrees/<repo-key>/<name>/. The target path is ALWAYS
   * host-constructed (the caller supplies only a name, never a path), and the
   * worktree always checks out a NEW wt/ branch — git allows one branch in
   * one checkout, so reusing the base branch would break the main checkout.
   * @param path - workspace root.
   * @param rawName - proposed worktree name (sanitized; collisions reject).
   * @param baseRef - base revision; omitted means the checkout's current HEAD,
   *   and an unresolvable 'origin/HEAD' falls back to HEAD (no remote).
   */
  async addWorktree(path: string, rawName: string, baseRef?: string): Promise<WorktreeAddResult> {
    const name = sanitizeWorktreeName(rawName)
    if (name === null) {
      return { ok: false, error: { code: 'invalid-worktree-name', message: `invalid worktree name: ${JSON.stringify(rawName)}` } }
    }
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    const branch = WORKTREE_BRANCH_PREFIX + name
    const formatted = await this.runner.run(checkRefFormatArgv(branch), root)
    if (formatted.exitCode !== 0) {
      return { ok: false, error: { code: 'invalid-worktree-name', message: formatted.stderr.trim() || 'invalid worktree name' } }
    }
    const branchExists = await this.runner.run(verifyRefArgv(branch), root)
    if (branchExists.exitCode === 0) {
      return { ok: false, error: { code: 'worktree-already-exists', message: `branch "${branch}" already exists` } }
    }
    const target = worktreePathFor(root, name)
    if (existsSync(target)) {
      return { ok: false, error: { code: 'worktree-already-exists', message: `worktree path already exists: ${target}` } }
    }
    // Base-ref resolution: default HEAD; an explicit origin/HEAD without a
    // remote falls back to HEAD (the worktree must still be creatable).
    let base = baseRef === undefined || baseRef.trim() === '' ? 'HEAD' : baseRef.trim()
    const verified = await this.runner.run(verifyRevArgv(base), root)
    if (verified.exitCode !== 0) {
      if (base === 'origin/HEAD') {
        base = 'HEAD'
      } else {
        return { ok: false, error: { code: 'base-ref-not-found', message: `base ref "${base}" does not resolve` } }
      }
    }
    if (await this.operationInProgress(root)) {
      return { ok: false, error: { code: 'operation-in-progress', message: 'a git operation is in progress' } }
    }
    await mkdir(repoWorktreesDir(root), { recursive: true })
    const added = await this.runner.run(worktreeAddArgv(target, branch, base), root)
    if (added.exitCode === 0) return { ok: true, path: target, branch, name }
    return { ok: false, error: classifySwitchFailure(added.stderr) }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:108-125](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/agent-tool.ts#L108-L125)

创建后注册工作区并提示新会话

<details>
<summary>查看原文（18行）</summary>

```text
        case 'create': {
          const rawName = typeof input.name === 'string' && input.name.trim() !== ''
            ? input.name
            : `agent-${Date.now().toString(36)}`
          const baseRef = typeof input.baseRef === 'string' && input.baseRef.trim() !== '' ? input.baseRef : undefined
          const result = await service.addWorktree(cwd, rawName, baseRef)
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          // Environment-preparation semantics: the worktree becomes a
          // registered workspace immediately, so a new session can open on it
          // (the only way in under workspace-write sandboxing).
          const workspace = await ctx.workspaceRegistry.create(result.path, `wt: ${result.name}`)
          return {
            ok: true,
            path: result.path,
            branch: result.branch,
            name: result.name,
            workspaceId: String(workspace.id),
            note: 'The current session stays in its original checkout; open a new session on the registered workspace to work inside the worktree.',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工作区和 Git 两套状态在失败时是否一致？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

已见保护包括默认不启用模型工具、删除只接受托管目录的直接子项且必须在 Git worktree list 中、拒绝主 checkout，以及默认阻止脏文件和正在进行的 Git 操作。最影响隔离价值的边界却是会话 cwd 不迁移：创建后继续在旧会话工作不能获得隔离。另一个恢复缺口在模型工具入口，service.addWorktree 成功后 await workspaceRegistry.create，所读代码没有注册失败时删除刚建 worktree 的补偿；此时磁盘与注册表可能不一致。这是可以通过中断实验检验的风险，不能写成已发生损失。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:382-431](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/git-service.ts#L382-L431)

双重托管路径检查、主目录和脏状态保护

<details>
<summary>查看原文（50行）</summary>

```text
    // Containment compares canonical paths on BOTH sides: DSH_HOME itself
    // may traverse symlinks (macOS /var -> /private/var), so the lexical
    // home prefix and the realpath'd candidate would otherwise never match.
    let canonicalHome: string
    try {
      canonicalHome = await realpath(repoWorktreesDir(root))
    } catch {
      return { ok: false, error: { code: 'worktree-not-found', message: 'this repository has no managed worktree directory' } }
    }
    if (!isManagedWorktreeOf(canonicalHome, canonical)) {
      return { ok: false, error: { code: 'worktree-not-found', message: 'not a managed worktree of this repository' } }
    }
    const listed = await this.runner.run(worktreeListArgv(), root)
    // git reports worktree paths as spelled at add time (possibly
    // symlinked); canonicalize each row before comparing.
    let entry: ReturnType<typeof parseWorktrees>[number] | undefined
    for (const item of parseWorktrees(listed.stdout)) {
      try {
        if (await realpath(item.path) === canonical) {
          entry = item
          break
        }
      } catch {
        // A stale row whose directory vanished cannot be the removal target.
      }
    }
    if (entry === undefined) {
      return { ok: false, error: { code: 'worktree-not-found', message: `git does not list ${canonical} as a worktree` } }
    }
    if (entry.main) {
      return { ok: false, error: { code: 'worktree-is-main', message: 'the primary checkout cannot be removed' } }
    }
    if (opts.force !== true) {
      const porcelain = await this.runner.run(statusPorcelainArgv(), canonical)
      const counts = parsePorcelain(porcelain.stdout)
      if (counts.dirtyFiles + counts.untrackedFiles + counts.conflicts > 0) {
        return { ok: false, error: { code: 'worktree-dirty', message: 'the worktree has uncommitted changes' } }
      }
      if (await this.operationInProgress(canonical)) {
        return { ok: false, error: { code: 'operation-in-progress', message: 'a git operation is in progress in the worktree' } }
      }
    }
    const removed = await this.runner.run(worktreeRemoveArgv(canonical, opts.force === true), root)
    if (removed.exitCode !== 0) {
      return { ok: false, error: { code: 'internal', message: removed.stderr.trim() || 'git worktree remove failed' } }
    }
    if (opts.deleteBranch === true && entry.branch.startsWith(WORKTREE_BRANCH_PREFIX)) {
      await this.runner.run(branchDeleteForceArgv(entry.branch), root)
    }
    return { ok: true }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:108-125](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/agent-tool.ts#L108-L125)

磁盘创建与注册表提交的顺序及无局部补偿

<details>
<summary>查看原文（18行）</summary>

```text
        case 'create': {
          const rawName = typeof input.name === 'string' && input.name.trim() !== ''
            ? input.name
            : `agent-${Date.now().toString(36)}`
          const baseRef = typeof input.baseRef === 'string' && input.baseRef.trim() !== '' ? input.baseRef : undefined
          const result = await service.addWorktree(cwd, rawName, baseRef)
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          // Environment-preparation semantics: the worktree becomes a
          // registered workspace immediately, so a new session can open on it
          // (the only way in under workspace-write sandboxing).
          const workspace = await ctx.workspaceRegistry.create(result.path, `wt: ${result.name}`)
          return {
            ok: true,
            path: result.path,
            branch: result.branch,
            name: result.name,
            workspaceId: String(workspace.id),
            note: 'The current session stays in its original checkout; open a new session on the registered workspace to work inside the worktree.',
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/index.ts:97-109](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/index.ts#L97-L109)

可选模型工具动态注册与卸载

<details>
<summary>查看原文（13行）</summary>

```text
  // The git_worktree tool registers only while agentTool is on. The tools
  // service is awaited lazily so the plugin never hard-depends on it.
  let toolFiber: ReturnType<Context['inject']> | undefined
  const syncTool = (): void => {
    const want = effectiveConfig(config).agentTool
    if (want && toolFiber === undefined) {
      toolFiber = ctx.inject(['tools'], (toolCtx: Context) => {
        toolCtx.effect(() => toolCtx.tools.register(buildWorktreeTool(ctx, service)), 'dsh-git-graph: git_worktree tool')
      })
    } else if (!want && toolFiber !== undefined) {
      toolFiber.dispose()
      toolFiber = undefined
    }
```

</details>

#### 缺口

- 未执行磁盘成功后注册失败的故障实验
  **影响**：无法确定宿主其他层是否提供统一恢复或留下哪些残留
  **进一步探讨**：在测试仓库注入注册失败，检查 Git list、磁盘与 workspaceRegistry，并记录恢复路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署与日常隔离有哪些前提和阶段投入？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package 的 dsh engines 指定 >=0.2.1-rc.3，声明 bundle 与浏览器平台；宿主硬注入 webServer、subprocess 和 workspaceRegistry。模型工具属于可选动态注入，不能误称默认常驻。Git 副作用发生在宿主，其路径约束不等于整个主机沙箱。每个新 worktree 增加工作副本和可能的依赖准备，收益应按同一并行开发任务的冲突数、合格交付时间和人工合并投入计量，而非按新会话创建次数。

首次需核对宿主与Git权限，持续新增工作副本并承担依赖准备和合并，失败则要对账Git、磁盘、workspace和会话。现金、磁盘及恢复时间未测，不能由创建成功率推算开发收益。表格见[成本与效果](#cost-and-value)，运行条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/package.json:7-15](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/package.json#L7-L15)

Node 与构建条件

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
```

**依据 2 · 源码核查**：[packages/dsh-git-graph/package.json:31-46](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/package.json#L31-L46)

dsh 引擎、bundle 与 client 平台

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/index.ts:29-30](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/index.ts#L29-L30)

宿主服务硬依赖

```text
/** Required services: the route registry, the managed subprocess seam, and the workspace registry. */
export const inject = ['webServer', 'subprocess', 'workspaceRegistry']
```

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:53-70](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/routes.ts#L53-L70)

状态轮询与请求期限

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Poll interval for external git-state changes while subscribers are
 * connected. Kept deliberately long (30s): each tick spawns several git
 * processes per subscriber, and on Windows a cold git.exe costs ~0.7s per
 * spawn — a short interval turns the poll itself into a self-exciting
 * storm. Window focus and the client's own refresh calls cover the
 * interactive freshness path.
 */
const POLL_INTERVAL_MS = 30_000
/** SSE keep-alive comment interval (proxies drop idle connections). */
const HEARTBEAT_INTERVAL_MS = 15_000

/**
 * Route-layer deadline for one git status request. On expiry the controller
 * aborts the read path so the subprocess can terminate; the JSON handler keeps
 * the stable envelope and the SSE poll loop can clear its overlap guard.
 */
const STATUS_TIMEOUT_MS = 15_000
```

</details>

#### 缺口

- 没有同条件并行开发收益与资源实测
  **影响**：不能给出冲突减少率、单位任务成本或额外磁盘量
  **进一步探讨**：固定同一仓库和任务，对比终端手动 worktree 与插件入口，计入依赖、合并和失败恢复时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可回读的阶段恢复值得做吗，谁应先试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

根据 Git 磁盘与工作区注册表分阶段变更，提出操作记录与对账恢复的未验证假设。记录操作 ID、目标路径和预期阶段，重启后先查询 Git 和注册表现状，已有 checkout 不重复创建；补偿也必须证明归属，不能无条件删除。试用可从临时仓库两条并行任务开始，验收分支、cwd、清理拒绝及禁用行为。若用户已有可靠终端流程，则只为 UI 入口迁移可能不划算。假设实验需在创建、注册与开会话之间分别中断，观测残留、重复和人工恢复时间，任何误删用户数据都是停止条件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:108-125](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/agent-tool.ts#L108-L125)

跨状态系统的创建链支持恢复假设

<details>
<summary>查看原文（18行）</summary>

```text
        case 'create': {
          const rawName = typeof input.name === 'string' && input.name.trim() !== ''
            ? input.name
            : `agent-${Date.now().toString(36)}`
          const baseRef = typeof input.baseRef === 'string' && input.baseRef.trim() !== '' ? input.baseRef : undefined
          const result = await service.addWorktree(cwd, rawName, baseRef)
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          // Environment-preparation semantics: the worktree becomes a
          // registered workspace immediately, so a new session can open on it
          // (the only way in under workspace-write sandboxing).
          const workspace = await ctx.workspaceRegistry.create(result.path, `wt: ${result.name}`)
          return {
            ok: true,
            path: result.path,
            branch: result.branch,
            name: result.name,
            workspaceId: String(workspace.id),
            note: 'The current session stays in its original checkout; open a new session on the registered workspace to work inside the worktree.',
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:414-431](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-git-graph/src/host/git-service.ts#L414-L431)

现有清理需尊重脏状态与可选分支删除

<details>
<summary>查看原文（18行）</summary>

```text
    if (opts.force !== true) {
      const porcelain = await this.runner.run(statusPorcelainArgv(), canonical)
      const counts = parsePorcelain(porcelain.stdout)
      if (counts.dirtyFiles + counts.untrackedFiles + counts.conflicts > 0) {
        return { ok: false, error: { code: 'worktree-dirty', message: 'the worktree has uncommitted changes' } }
      }
      if (await this.operationInProgress(canonical)) {
        return { ok: false, error: { code: 'operation-in-progress', message: 'a git operation is in progress in the worktree' } }
      }
    }
    const removed = await this.runner.run(worktreeRemoveArgv(canonical, opts.force === true), root)
    if (removed.exitCode !== 0) {
      return { ok: false, error: { code: 'internal', message: removed.stderr.trim() || 'git worktree remove failed' } }
    }
    if (opts.deleteBranch === true && entry.branch.startsWith(WORKTREE_BRANCH_PREFIX)) {
      await this.runner.run(branchDeleteForceArgv(entry.branch), root)
    }
    return { ok: true }
```

</details>

#### 缺口

- 没有中断样本与真实用户恢复负担
  **影响**：阶段恢复仍是研究假设，不能计入当前能力或分数
  **进一步探讨**：采集故障注入结果与开发者恢复操作，再比较有记录与无记录两种流程

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
