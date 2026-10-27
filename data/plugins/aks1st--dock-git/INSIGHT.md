# dock-git

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[961c203](https://github.com/AKS1st/dock-git/tree/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AKS1st/dock-git) [![npm 30d 866](https://img.shields.io/static/v1?label=npm+30d&message=866&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-git) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dock-git)
<!-- END META -->

> **功能**：在 DSH Dock 中查看 Git 提交图与差异，并对会话仓库执行暂存、提交、分支和远端操作。

> **亮点**：相对终端 Git 或独立客户端，增量是把提交图、差异与仓库操作接入 DSH 会话工作台，沿用系统 Git。不能由作者最高级宣传推出同类最佳。详见[Q01](#research-q01)。

> **主要限制**：普通提交与合并会跳过部分仓库钩子，这与依赖钩子的团队流程不等价；直接允许浏览器运行钩子又引入代码执行风险。没有通用超时的远端操作也需核查。详见[Q03](#research-q03)。

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
  - [Q01 · 谁在什么任务中需要这种工作台，与终端 Git 相比增加了什么？](#detail-section-11)
  - [Q02 · 客户端请求怎样定位仓库并执行 Git，边界在哪里？](#detail-section-12)
  - [Q03 · 什么前提最可能让图形操作与团队预期的 Git 工作流不等价？](#detail-section-13)
  - [Q04 · 启动、日常使用和失败恢复要由谁承担哪些条件与成本？](#detail-section-14)
  - [Q05 · 哪些工程设计值得借鉴，哪些仍需审查？](#detail-section-15)
  - [Q06 · 怎样从已发现的取舍推出可证伪的新设计方向？](#detail-section-16)
  - [Q07 · 当前证据支持什么采用判断？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH Web 处理代码的开发者可从工作台查看会话仓库并执行 Git 操作；适用前提是能核对目标仓库和写操作结果。详见[Q01](#research-q01)。

现有 Git CLI 和独立图形客户端已经提供历史、差异与写操作；本项目的主要差别是嵌入 DSH 会话工作台。效率、可靠性和安全性没有同条件对照，不能做排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提交图与差异视图 | 在会话工作台查看历史、文件变化 | 需要 Dock/Web；运行可用性未验 |
| 仓库发现与选择 | 在会话目录及两层子目录寻找仓库 | 扫描有限额且可静默截断 |
| 暂存、提交和分支操作 | 完成常用本地 Git 写入 | 目标仓库受工作区约束；提交跳过钩子 |
| 远端操作 | fetch、pull、push 等 | 依赖网络和凭据；没有通用超时 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、Dock 工作台 | 图形视图必需 | 侧栏与历史视图 | workbench 缺失时客户端不注册 |
| 系统 Git 与会话工作区 | Git 操作必需 | 解析并运行目标仓库 | 缺会话 cwd 返回未就绪；无 Git 时执行失败 |
| Cordis/React 与宿主版本 | 按包声明及客户端渲染需求 | 加载与渲染 | 真实兼容范围本轮未知 |
| 远端网络与凭据 | 仅远端操作必需 | fetch/pull/push | 失败或卡住需人工核查状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 开发者核对宿主、Dock、Git 和会话仓库 | 工作台可见正确目标仓库 |
| 查看 | 用户打开历史图并检查提交/差异 | 文件与 ref 对应预期任务 |
| 执行 | 用户选择暂存/提交/分支/远端动作 | 返回后复查 status、ref 和 CI；冲突时停止继续写入 |
| 验收 | 团队按自身门禁检查结果 | 合格提交和远端状态可回查，失败走仓库恢复流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、Dock 与系统 Git 资源；具体金额未知 | 安装、确认版本/仓库与钩子策略；耗时未知 | 包依赖已声明，安装未执行 |
| 持续使用 | Git/远端与凭据基础设施；金额未知 | 核对差异、写操作结果和 CI；频率与耗时未知 | 不能把跳过钩子视为完成团队验证 |
| 失败恢复 | 冲突、重置与远端失败可能占用仓库/网络资源；金额未知 | 检查工作树、恢复 ref 与重跑验证；耗时未知 | 无通用超时或真实恢复数据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 工作台内查看 Git 历史/差异 | 注册视图和对应 Host 端点可见 | 目标宿主实际可用性与交互完成率 |
| 会话仓库内写操作 | 路径约束与 Git argv 可见 | 误操作率、冲突恢复与钩子政策效果 |
| 减少工具切换 | 界面接线提供可能路径 | 同条件节时、合格提交数或 ROI |

> **思考**：普通提交与合并会跳过部分仓库钩子，这与依赖钩子的团队流程不等价；直接允许浏览器运行钩子又引入代码执行风险。没有通用超时的远端操作也需核查。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对终端 Git 或独立客户端，增量是把提交图、差异与仓库操作接入 DSH 会话工作台，沿用系统 Git。不能由作者最高级宣传推出同类最佳。详见[Q01](#research-q01)。

Git 参数构造、会话仓库约束和客户端视图注册分层可借鉴；仓库发现有限额却静默截断，runGit 的 stderr/超时边界仍需审查。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

普通提交与合并会跳过部分仓库钩子，这与依赖钩子的团队流程不等价；直接允许浏览器运行钩子又引入代码执行风险。没有通用超时的远端操作也需核查。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先在隔离仓库核对钩子策略、破坏操作确认和远端失败恢复；团队质量门禁另作明确安排。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交可确认工作台视图、会话仓库限制及 Git argv 调用；图形操作效率与团队质量门禁效果未实测。策略化确认属于未来设计假设，尚未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/git-ops.ts、src/repos.ts、src/client/index.ts、src/client/wb.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的 README、包清单、服务端仓库路由、Git 执行器、仓库发现及客户端注册；未审全量交互、安装、目标代码执行或真实宿主。沿用此前已采集 META，不将其标为本轮新采集。
- 下一步：优先在隔离仓库核对失败钩子、hard reset、合并冲突、远端挂起与退出恢复；记录误接受、误拒绝、工作树状态、人工复核与恢复时间，成功和否定结果均应保留。

**分析版本**

- **仓库**：[AKS1st/dock-git](https://github.com/AKS1st/dock-git)
- **版本号**：0.3.4（[固定提交 961c203](https://github.com/AKS1st/dock-git/tree/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的方向是把目标仓库、受影响 ref、钩子策略和破坏范围列入操作前确认，让可信仓库与不可信仓库采用不同执行策略，再用隔离任务检验误接受与恢复成本。详见[Q06](#research-q06)。

优先在隔离仓库核对失败钩子、hard reset、合并冲突、远端挂起与退出恢复；记录误接受、误拒绝、工作树状态、人工复核与恢复时间，成功和否定结果均应保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 6046 | 5381 | 656 | — |
| .md | source | 2 | 132 | — | — | 1485 |
| .mjs | source | 6 | 2405 | 2107 | 218 | — |
| .tsx | source | 5 | 2539 | 2105 | 270 | — |
| .ts | source | 13 | 4600 | 3290 | 1027 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dock-git/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dock-git 在固定版本中如何把 Git 操作接入 DSH 会话工作台，其便利性、执行边界和团队采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么任务中需要这种工作台，与终端 Git 相比增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是已经在 DSH Web 的会话工作区处理代码、需要边看历史和差异边完成暂存、提交、分支及远端操作的开发者。合格交付不是看到图，而是选中正确仓库和提交，检查文件差异，执行预期 Git 动作，并在操作后确认工作树与远端状态。作者把图谱、详情、仓库发现和写操作放进侧栏及独立视图。固定源码可见服务端 /wb-git 与工作台视图注册，因而这里的可识别增量是会话上下文和 Git 图形操作的接线。Git CLI 与现有图形客户端已能完成 Git 操作；本插件没有提出新 Git 协议，也没有证据证明效率或正确率优于这些替代办法。README 中“最好”属于作者宣传，不能作为比较结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-22](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/README.md#L5-L22)

作者列举视图和写操作，同时含未经比较的最高级宣传。

<details>
<summary>查看原文（18行）</summary>

```text
> **DSH 生态中最好的 Git 历史可视化插件 —— 没有之一。** 泳道式提交图、分支/标签徽标、三栏 diff、暂存提交推送、远端管理，把 VSCode 的 Git 面板直接搬进 DSH 工作台。在 DSH 里看仓库、管分支、推代码，dock-git 就是终极武器。

dock 系列的 Git 历史可视化插件：在侧边栏挂载启动面板（活动项 `git`），渲染当前工作区 git 仓库的提交历史图（提交图 / 分支 / 标签 / 远端），并支持分支、标签、配置、远端、暂存、提交与推送操作。

## 效果预览

![dock-git 提交历史图（中文界面）](assets/main-gui-zh.png)

## 功能

- **提交历史图**：泳道式提交图，展示分支/标签/远端引用徽标、未提交改动节点；N+1 探测「更多提交」。
- **提交详情**：点击提交展开详情——提交信息、作者、变更文件树（新增/修改/删除/重命名）、旧/新文件内容三栏对比、diff（512 KiB 截断，UTF-16 安全）。
- **多仓库发现**：扫描会话工作区（cwd 及其两层子目录）内的独立 git 仓库，可切换目标仓库；仓库列表直接标注各仓库当前分支。
- **分支/标签管理**：创建、重命名、删除分支，创建/删除标签，检出（`git switch`，无路径语义歧义）；本地分支之间可互相合并（`git merge --no-edit`，拉到当前分支）。
- **暂存与提交**：VSCode 风格 status/stage/unstage/commit（`--no-verify`，不执行仓库钩子）。
- **提交重置与回退**：在提交上右键可选择重置模式（混合 / 软 / 强制）执行 `git reset`，或回退提交（`git revert --no-edit`，创建反向提交）。
- **远端操作**：list / add / remove / set-url、fetch、pull、fetch-into、push（分支/标签，支持 `--force-with-lease`）。
- **配置读写**：读取任意仓库配置；写入仅限 `user.name` / `user.email`。
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:26-75](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/client/index.ts#L26-L75)

客户端向 workbench 注册活动项、面板和历史视图。

<details>
<summary>查看原文（50行）</summary>

```text
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  // Optional-peer guard: skip silently when the base is absent.
  if (workbench === undefined) return

  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-git',
    title: 'Git',
    description: 'Git history viewer for the DSH dock: browse the commit graph, branches, tags and remotes; stage, commit, push and manage repository settings.',
    icon: GIT_ICON,
    hasEntry: true,
    order: 20,
  }), 'dock-git: plugin metadata')

  // Panel styles (SVG overlay, ref chips, rows, detail panel).
  ctx.effect(() => mountStyles(), 'dock-git: styles')

  // Activity item: the left strip entry that reveals the git launcher pane
  // (which in turn opens the floating graph window).
  ctx.effect(() => workbench.registerActivityBarItem({
    id: 'git',
    pluginId: 'dock-git',
    title: translate(detectLocale(ctx), 'graphTitle'),
    icon: GIT_ICON,
    order: 20,
    paneId: 'git',
  }), 'dock-git: activity item')

  // The side-bar pane — a slim launcher (the graph itself lives in the
  // floating 'git-history' window: the side bar is too narrow for the graph).
  // The panel title is the repo list's own name, shown once by the dock's
  // sidebar header (the launcher renders no duplicate title).
  ctx.effect(() => workbench.registerPanel({
    id: 'git',
    region: 'sideBar',
    title: () => translate(detectLocale(ctx), 'repoSelectorTitle'),
    icon: GIT_ICON,
    order: 20,
    component: GitLauncher,
  }), 'dock-git: git launcher panel')

  // The full graph view, hosted in an independent floating window (default
  // 520×360, user-resizable, geometry remembered per view id).
  ctx.effect(() => workbench.registerEditorView({
    id: GRAPH_VIEW_ID,
    title: () => translate(detectLocale(ctx), 'graphTitle'),
    icon: GIT_ICON,
    order: 20,
    component: CommitView,
  }), 'dock-git: git history view')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1210-1258](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L1210-L1258)

服务端将多个 Git 阅读和写操作接到 /wb-git。

<details>
<summary>查看原文（49行）</summary>

```text
export function apply(ctx: WbContext): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/wb-git',
    handler: async (req, res) => {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'bad-request', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/wb-git/') ? pathname.slice('/wb-git/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new WbError('not-found', `unknown /wb-git method "${method}"`, 404))
        return
      }
      try {
        const payload = await readJsonBody(req)
        let value: unknown
        if (method === 'status') {
          value = await endpointStatus(ctx, payload)
        } else if (method === 'repos') {
          value = await endpointRepos(ctx, payload)
        } else if (method === 'log') {
          value = await endpointLog(ctx, payload)
        } else if (method === 'detail') {
          value = await endpointDetail(ctx, payload)
        } else if (method === 'branches') {
          value = await endpointBranches(ctx, payload)
        } else if (method === 'config') {
          value = await endpointConfig(ctx, payload)
        } else if (method === 'remote') {
          value = await endpointRemote(ctx, payload)
        } else if (method === 'ref') {
          value = await endpointRef(ctx, payload)
        } else if (method === 'status-files') {
          value = await endpointStatusFiles(ctx, payload)
        } else if (method === 'stage') {
          value = await endpointStage(ctx, payload)
        } else if (method === 'commit') {
          value = await endpointCommit(ctx, payload)
        } else if (method === 'fetch') {
          value = await endpointFetch(ctx, payload)
        } else if (method === 'pull') {
          value = await endpointPull(ctx, payload)
        } else if (method === 'fetch-into') {
```

</details>

#### 缺口

- 没有相同任务的终端或图形客户端对照
  **影响**：不能量化少切换界面是否带来更少错误或更快交付
  **进一步探讨**：在相同仓库和任务清单下比较完成率、用时与错误回退，记录人工复核时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 客户端请求怎样定位仓库并执行 Git，边界在哪里？

**研究主题**：功能与机制

#### 完整回答

客户端构造含 sessionId、可选 repoRoot 的 POST 请求。服务端从会话 header.cwd 取工作目录，不退回宿主进程目录；显式 repoRoot 经过目录存在性、realpath 和相对路径检查，只接受会话工作区内目录。随后各端点选择仓库并构造经过约束的 Git 参数数组，runGit 用 spawn 直接运行系统 Git，清除 GIT_DIR 与 GIT_WORK_TREE，固定 C locale。HTTP 路由先做 Host、trustedHosts 与 Origin 等来源检查，只接受 POST。这个来源检查在源码中明确不是身份认证，也没有证明多用户会话授权；应把它理解为浏览器来源防护。输出上限只在传入 maxBytes 的调用中作用于 stdout，不能概括为所有进程资源均有限制。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/wb.ts:25-63](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/client/wb.ts#L25-L63)

客户端请求与会话和仓库参数封装。

<details>
<summary>查看原文（39行）</summary>

```text
/** POST one /wb-git method; throws on transport/envelope failure. */
export async function postWb<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(path, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(body),
  })
  let json: WbEnvelope<T>
  try {
    json = (await response.json()) as WbEnvelope<T>
  } catch {
    throw new Error(`${path} returned a malformed response`)
  }
  if (json.ok !== true || json.value === undefined) {
    throw new WbRequestError(json.error?.code ?? 'unknown', json.error?.message ?? `${path} failed`)
  }
  return json.value
}

/** Error → string, truncated so the op strip / settings error areas stay readable. */
export function messageOf(cause: unknown): string {
  const text = cause instanceof Error ? cause.message : String(cause)
  return text.length > 500 ? `${text.slice(0, 500)}…` : text
}

/**
 * Build one /wb-git request body: sessionId + optional repoRoot (omitted when
 * empty, so a workspace-root request never pins an explicit root) + extra
 * fields. Endpoints run git at the session cwd unless repoRoot is present,
 * in which case it is the repository root itself.
 */
export function wbBody(
  sessionId: string | undefined,
  repoRoot: string | undefined,
  extra?: Record<string, unknown>,
): Record<string, unknown> {
  const body: Record<string, unknown> = { sessionId, ...extra }
  if (repoRoot !== undefined && repoRoot !== '') body.repoRoot = repoRoot
  return body
```

</details>

**依据 2 · 源码核查**：[src/index.ts:216-262](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L216-L262)

请求来源检查和会话 cwd 的权威来源。

<details>
<summary>查看原文（47行）</summary>

```text
/** DNS-rebinding / cross-site defense (not authentication). */
function isTrustedRequest(request: IncomingMessage, trustedHosts: readonly string[]): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname) && !isTrustedAuthority(hostUrl, trustedHosts)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}

// ── Plugin body ────────────────────────────────────────────────────────────

interface WbContext {
  webServer: {
    register(options: {
      kind: 'prefix'
      path: string
      handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
    }): () => void
  }
  sessions: {
    get(sessionId: string): { header: { cwd?: string } } | undefined
  }
  webRuntime: {
    trustedHosts: readonly string[]
  }
  effect(fn: () => void | (() => void), label?: string): void
}

/** Resolve a session's authoritative working directory.
 *
 * Never fall back to the Host process cwd: that directory is the Harness
 * checkout in production, and running Git there would turn a transient session
 * hydration gap into unrelated repository data. */
function sessionCwdOf(ctx: WbContext, sessionId: string | undefined): string {
  if (sessionId !== undefined) {
    const cwd = ctx.sessions.get(sessionId)?.header.cwd
    if (cwd !== undefined && cwd !== '') return cwd
  }
  throw new WbError('workspace-not-ready', 'workspace is not ready for this session', 409)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:280-318](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L280-L318)

显式仓库目录的 realpath 与工作区边界。

<details>
<summary>查看原文（39行）</summary>

```text
/**
 * Parse and validate the optional `repoRoot` payload field. When provided it
 * must be a non-empty absolute path (`/`-prefix or a Windows drive letter)
 * to an existing directory, otherwise 400 bad-request. It must also lie
 * inside the session workspace (the canonical session cwd or a descendant),
 * otherwise 403 forbidden — a browser-trusted request must not run git in
 * arbitrary repositories outside the conversation's workspace. Returns the
 * canonical (symlink-resolved) path, or undefined when absent (endpoints
 * then fall back to the session cwd). repoRoot is the repository root
 * itself — git runs there directly, no upward lookup. A repoRoot that is
 * not a repository is handled per endpoint: /config rejects it up front
 * with fs-error (work-tree guard), /log reports isRepo:false, and the
 * remaining endpoints surface the failing git command as an fs-error.
 */
async function repoRootOf(payload: unknown, ctx: WbContext, sessionId: string | undefined): Promise<string | undefined> {
  const raw = stringOrUndefined(payload, 'repoRoot')
  if (raw === undefined) return undefined
  if (!raw.startsWith('/') && !/^[A-Za-z]:[\\/]/.test(raw)) {
    throw new WbError('bad-request', 'repoRoot must be an absolute path')
  }
  let info
  try {
    info = await stat(raw)
  } catch {
    throw new WbError('bad-request', `repoRoot directory not found: "${raw}"`)
  }
  if (!info.isDirectory()) {
    throw new WbError('bad-request', `repoRoot is not a directory: "${raw}"`)
  }
  // Canonical spelling so root fields always match the real on-disk path
  // (git reports realpaths too, e.g. through symlinked session dirs).
  const root = await realpath(raw)
  const cwd = sessionCwdOf(ctx, sessionId)
  const workspace = await realpath(cwd).catch(() => resolve(cwd))
  const rel = relative(workspace, root)
  if (rel === '' || (rel !== '..' && !rel.startsWith(`..${sep}`) && !isAbsolute(rel))) {
    return root
  }
  throw new WbError('forbidden', `repoRoot is outside the session workspace: "${raw}"`, 403)
```

</details>

**依据 4 · 源码核查**：[src/git-ops.ts:69-96](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L69-L96)

argv spawn、环境清理及仅可选 stdout 上限。

<details>
<summary>查看原文（28行）</summary>

```text
export function runGit(cwd: string, args: string[], maxBytes?: number): Promise<string> {
  const env: NodeJS.ProcessEnv = { ...process.env }
  delete env.GIT_DIR
  delete env.GIT_WORK_TREE
  env.LC_ALL = 'C'
  env.LC_MESSAGES = 'C'
  env.LANG = 'C'

  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let overflow = false
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      if (maxBytes !== undefined && stdout.length + chunk.length > maxBytes) {
        overflow = true
        child.kill('SIGKILL')
        return
      }
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => { stderr += chunk })
    child.on('error', reject)
    child.on('close', (code: number | null) => {
      if (overflow) {
        reject(new Error(`git output exceeds ${maxBytes} bytes`))
```

</details>

#### 缺口

- 没有目标宿主中的身份、来源和会话权限联合执行记录
  **影响**：不能把静态来源检查当成实际用户授权或宿主验收
  **进一步探讨**：在隔离宿主记录跨来源、跨会话请求的拒绝和允许结果，并核对宿主会话授权

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么前提最可能让图形操作与团队预期的 Git 工作流不等价？

**研究主题**：缺陷与关键质疑

#### 完整回答

最直接的差异是普通提交由 buildCommitArgs 显式传入 --no-verify，合并也传入 --no-verify；作者 README 对提交跳过钩子有所说明。仓库依赖 pre-commit、commit-msg 或 pre-merge-commit 等钩子作质量门禁时，用户经此入口完成的操作可能跳过原本在终端路径执行的验证。这是有意的安全取舍：浏览器触发仓库钩子本身也可能执行不可信代码。不能简单地把恢复钩子设为默认安全答案，需要先明确谁拥有仓库、哪些钩子可信、质量门禁应在何处执行。另一个限制是 runGit 没有通用超时，stderr 无与 stdout 对应的累计上限；远端网络卡住或错误输出过大时，本轮没有执行证据能界定恢复表现。Git 参数隔离也不等于远端凭据和 Git 子进程副作用隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:18-21](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/README.md#L18-L21)

作者将提交跳过钩子和重置、远端写操作列为功能。

```text
- **分支/标签管理**：创建、重命名、删除分支，创建/删除标签，检出（`git switch`，无路径语义歧义）；本地分支之间可互相合并（`git merge --no-edit`，拉到当前分支）。
- **暂存与提交**：VSCode 风格 status/stage/unstage/commit（`--no-verify`，不执行仓库钩子）。
- **提交重置与回退**：在提交上右键可选择重置模式（混合 / 软 / 强制）执行 `git reset`，或回退提交（`git revert --no-edit`，创建反向提交）。
- **远端操作**：list / add / remove / set-url、fetch、pull、fetch-into、push（分支/标签，支持 `--force-with-lease`）。
```

**依据 2 · 源码核查**：[src/git-ops.ts:319-362](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L319-L362)

commit、revert、merge 的钩子行为和 Git 参数有差异。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * Commit with `message` as one argument vector element (newlines stay safe).
 * `--no-verify` skips pre-commit/commit-msg hooks: the /wb-git API is
 * browser-trust fenced, so hooks are not run on its behalf (a malicious
 * config value or a repo with hostile hooks must not execute on commit).
 */
export function buildCommitArgs(message: string): string[] {
  return ['commit', '--no-verify', '-m', message]
}

/**
 * Reset the current branch to `hash` in one of git's three reset modes
 * (`mixed` / `soft` / `hard`). The mode is interpolated as `--<mode>`, so a
 * validated mode can never be parsed by git as a revision or option; callers
 * must pass a mode from the fixed union (the endpoint validates it).
 */
export function buildResetArgs(mode: 'mixed' | 'soft' | 'hard', hash: string): string[] {
  return ['reset', `--${mode}`, hash]
}

/**
 * Revert `hash`: create a new commit that undoes the target commit's changes.
 * `--no-edit` uses git's default revert message (no editor is opened — the
 * API is non-interactive). Unlike `buildCommitArgs`, no `--no-verify` is
 * passed: `git revert` has no such option, so the resulting commit runs the
 * repo's normal commit-msg hook (a documented difference from staged commits,
 * which skip hooks because the /wb-git API is browser-trust fenced). A
 * conflicting revert fails and surfaces as an fs-error (the repo is left in
 * git's normal conflict state).
 */
export function buildRevertArgs(hash: string): string[] {
  return ['revert', '--no-edit', hash]
}

/**
 * Merge `name` (a local branch, or tag/commit) into the current branch.
 * `--no-edit` uses git's default merge message (no editor is opened — the API
 * is non-interactive) and `--no-verify` skips the pre-merge-commit hook for
 * the same reason `buildCommitArgs` does: the /wb-git API is browser-trust
 * fenced, so hooks must not run on its behalf. A conflicting merge fails and
 * surfaces as an fs-error (the repo is left in git's normal conflict state).
 */
export function buildMergeArgs(name: string): string[] {
  return ['merge', '--no-edit', '--no-verify', name]
```

</details>

**依据 3 · 源码核查**：[src/git-ops.ts:69-119](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L69-L119)

通用执行器仅在有 maxBytes 时限制 stdout，未见超时或 stderr 上限。

<details>
<summary>查看原文（51行）</summary>

```text
export function runGit(cwd: string, args: string[], maxBytes?: number): Promise<string> {
  const env: NodeJS.ProcessEnv = { ...process.env }
  delete env.GIT_DIR
  delete env.GIT_WORK_TREE
  env.LC_ALL = 'C'
  env.LC_MESSAGES = 'C'
  env.LANG = 'C'

  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let overflow = false
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      if (maxBytes !== undefined && stdout.length + chunk.length > maxBytes) {
        overflow = true
        child.kill('SIGKILL')
        return
      }
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => { stderr += chunk })
    child.on('error', reject)
    child.on('close', (code: number | null) => {
      if (overflow) {
        reject(new Error(`git output exceeds ${maxBytes} bytes`))
        return
      }
      if (code === 0) {
        resolve(stdout)
        return
      }
      // The message carries git's own output so the host can match substrings
      // of it ("nothing to commit", "does not exist", "bad revision" …).
      // Most failures write to stderr; a few (e.g. `git commit` with nothing
      // staged) exit non-zero with the message on stdout instead, so fall back
      // to stdout when stderr is empty. Both are also attached as properties.
      const text = stderr !== '' ? stderr : stdout
      const error = new Error(text !== '' ? text : `git exited with code ${code}`) as Error & {
        stderr: string
        exitCode: number | null
        stdout: string
      }
      error.stderr = stderr
      error.exitCode = code
      error.stdout = stdout
      reject(error)
    })
  })
```

</details>

#### 缺口

- 未在隔离仓库实际核查钩子、远端阻塞与冲突恢复
  **影响**：无法给出目标宿主中的实际故障频率或恢复用时
  **进一步探讨**：用无真实远端的隔离仓库分别验证可信钩子、拒绝钩子、长时命令和合并冲突，并记录工作树状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、日常使用和失败恢复要由谁承担哪些条件与成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包清单声明 Node >=20、Cordis 与 dock-base、React 对等依赖；README 还要求 DSH Web、dock 工作台和 PATH 中的系统 Git。README 将 dock-base 写成必需，package 中 dock-base、React 又标为 optional peer，客户端源码在取不到 workbench 时静默返回，因此包可装入与界面可用是两种状态，需以目标宿主核查。首次使用要确认包、Web 配置、工作台和 Git 环境，选定仓库及可接受的钩子策略；持续使用要复核图形操作对应的工作树/远端状态，维护凭据、宿主与 Git 兼容。失败恢复涉及冲突、强制重置、远端失败及可能跳过质量门禁后的人工审查。源码与作者说明都没有给出这些阶段的现金金额、人工耗时或失败频率，不能将开源许可视为零总成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-53](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/README.md#L25-L53)

作者列出运行依赖和安装顺序。

<details>
<summary>查看原文（29行）</summary>

````text
## 依赖

| 依赖 | 类型 | 说明 |
| --- | --- | --- |
| [dock](https://github.com/AKS1st/dock) >= 0.1.0 | peer（必需） | 工作台外壳：侧边栏面板、编辑器区视图、`ctx.workbench` 由它提供 |
| `git` 命令行 | 系统运行时 | 必需：所有 Git 操作通过 spawn 调用系统 `git`，需在 PATH 中可用 |
| DSH Web 环境 | 运行时 | 必需，客户端平台为 Web |
| `cordis` ^4.0.0-rc.7 | peer | 插件框架（DSH 自带） |
| `react` ^18.2.0 | peer（可选） | 客户端渲染需要；未提供时面板 UI 不激活 |

**可选搭档**：dock-git 与文件浏览完全独立，不需要 `dock-files`；若同时安装 `dock-files` 及查看器插件，提交详情里的文件可无缝衔接工作台打开。

## 安装

需要 `dock` 基础插件：

推荐从 npm registry 安装：

```sh
dsh plugin --profile web add dock-base
dsh plugin --profile web add dock-git
```

或通过 GitHub 安装（备选）：

```sh
dsh plugin --profile web add github:AKS1st/dock
dsh plugin --profile web add github:AKS1st/dock-git
```
````

</details>

**依据 2 · 源码核查**：[package.json:49-63](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/package.json#L49-L63)

包清单的引擎与 optional peer 标记。

<details>
<summary>查看原文（15行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "peerDependencies": {
    "cordis": "^4.0.0-rc.7",
    "dock-base": ">=0.2.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "dock-base": {
      "optional": true
    },
    "react": {
      "optional": true
    }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:17-30](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/client/index.ts#L17-L30)

workbench 不存在时客户端直接返回。

<details>
<summary>查看原文（14行）</summary>

```text
/** Requires the workbench base to be mounted. */
export const inject = ['workbench']

/** Git branch icon (lucide git-branch, stroke style, currentColor). */
const GIT_ICON: IconSpec = {
  path: 'M6 3v12M18 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM18 9a9 9 0 0 1-9 9',
  stroke: true,
}

export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  // Optional-peer guard: skip silently when the base is absent.
  if (workbench === undefined) return

```

</details>

**依据 4 · 源码核查**：[src/index.ts:795-818](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L795-L818)

重置及合并有真实仓库状态副作用。

<details>
<summary>查看原文（24行）</summary>

```text
  if (action === 'reset') {
    // Reset the current branch to `hash` in the chosen mode (mixed/soft/hard).
    // The commit hash is validated up front (HASH_PATTERN); the mode is drawn
    // from a fixed union by resetModeOf so it can never smuggle a git option.
    if (hash === undefined) throw new WbError('bad-request', 'reset requires hash')
    const mode = resetModeOf(raw)
    await withGitError('reset', () => runGit(root, buildResetArgs(mode, hash)))
    return { action, mode, hash }
  }
  if (action === 'revert') {
    // Create a new commit that undoes `hash` (git revert --no-edit). A
    // conflicting revert fails and surfaces as fs-error; the repo is left in
    // git's normal conflict state, which the refresh shows.
    if (hash === undefined) throw new WbError('bad-request', 'revert requires hash')
    await withGitError('revert', () => runGit(root, buildRevertArgs(hash)))
    return { action, hash }
  }
  if (action === 'merge') {
    // Merge `name` (a local branch, tag or commit) into the current branch
    // (git merge --no-edit --no-verify). Used for pulling one local branch
    // into another. A conflicting merge fails and surfaces as fs-error; the
    // repo is left in git's normal conflict state, which the refresh shows.
    if (name === undefined) throw new WbError('bad-request', 'merge requires a branch name')
    await withGitError('merge', () => runGit(root, buildMergeArgs(name)))
```

</details>

#### 缺口

- 未取得目标宿主安装、团队实际任务量与异常记录
  **影响**：不能估算阶段耗时、维护费用或每个合格任务成本
  **进一步探讨**：在明确宿主版本和工作负载后记录配置时间、执行次数、失败/重试/复核时间及资源支出

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程设计值得借鉴，哪些仍需审查？

**研究主题**：工程质量与复用

#### 完整回答

较明确的设计是把 Git 命令构造与解析放在 git-ops，把会话仓库约束和 HTTP 路由放在服务端入口，把工作台 UI 注册放在客户端入口。直接 argv、清理可改指仓库的环境变量、固定分隔符与输出容量限制可在同类工具接入中借鉴，仓库发现还限定层级和每层候选数。代价是服务端入口仍承担较多路由和写操作，且所有操作共享通用 runGit 的未限时行为；仓库扫描达到上限静默截断，用户可能误以为没有某个仓库。当前检查针对关键文件，不覆盖所有客户端交互状态和完整异常路径；作者测试脚本存在，但本轮按约定未运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/repos.ts:1-16](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/repos.ts#L1-L16)

两层发现、容量上限和静默截断边界。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Multi-repo discovery for dock-git: scans a workspace directory (cwd itself
 * plus two levels of subdirectories) and lists every independent git
 * repository root. Pure logic on top of the injected runGit — no node:http,
 * no Cordis, no ctx — so the host route layer (index.ts) and the host smoke
 * script share it.
 *
 * Rules (multi-repo support):
 *  - depth 0: cwd itself when inside a work tree (toplevel may be an ancestor).
 *  - depth 1/2: a subdirectory is listed only when it is its OWN repository
 *    root (rev-parse --show-toplevel === the directory itself).
 *  - hidden dirs (. prefix) and node_modules are skipped at every level.
 *  - each scan layer enumerates at most MAX_SCAN_DIRS candidate directories
 *    (truncation is silent).
 *  - results are deduped by root (first occurrence wins).
 *  - unreadable directories and failed rev-parse calls are skipped silently.
```

</details>

**依据 2 · 源码核查**：[src/git-ops.ts:69-119](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L69-L119)

命令执行器的可借鉴设计与资源限制缺口。

<details>
<summary>查看原文（51行）</summary>

```text
export function runGit(cwd: string, args: string[], maxBytes?: number): Promise<string> {
  const env: NodeJS.ProcessEnv = { ...process.env }
  delete env.GIT_DIR
  delete env.GIT_WORK_TREE
  env.LC_ALL = 'C'
  env.LC_MESSAGES = 'C'
  env.LANG = 'C'

  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let overflow = false
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      if (maxBytes !== undefined && stdout.length + chunk.length > maxBytes) {
        overflow = true
        child.kill('SIGKILL')
        return
      }
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => { stderr += chunk })
    child.on('error', reject)
    child.on('close', (code: number | null) => {
      if (overflow) {
        reject(new Error(`git output exceeds ${maxBytes} bytes`))
        return
      }
      if (code === 0) {
        resolve(stdout)
        return
      }
      // The message carries git's own output so the host can match substrings
      // of it ("nothing to commit", "does not exist", "bad revision" …).
      // Most failures write to stderr; a few (e.g. `git commit` with nothing
      // staged) exit non-zero with the message on stdout instead, so fall back
      // to stdout when stderr is empty. Both are also attached as properties.
      const text = stderr !== '' ? stderr : stdout
      const error = new Error(text !== '' ? text : `git exited with code ${code}`) as Error & {
        stderr: string
        exitCode: number | null
        stdout: string
      }
      error.stderr = stderr
      error.exitCode = code
      error.stdout = stdout
      reject(error)
    })
  })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1210-1273](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L1210-L1273)

Host 路由集中分发。

<details>
<summary>查看原文（64行）</summary>

```text
export function apply(ctx: WbContext): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: '/wb-git',
    handler: async (req, res) => {
      if (!isTrustedRequest(req, ctx.webRuntime.trustedHosts)) {
        writeJson(res, 403, { ok: false, error: { code: 'forbidden', message: 'forbidden' } })
        return
      }
      if (req.method !== 'POST') {
        writeJson(res, 405, { ok: false, error: { code: 'bad-request', message: 'method not allowed' } })
        return
      }
      const pathname = new URL(req.url ?? '/', 'http://dsh.internal').pathname
      const method = pathname.startsWith('/wb-git/') ? pathname.slice('/wb-git/'.length) : undefined
      if (method === undefined || method.includes('/')) {
        writeError(res, new WbError('not-found', `unknown /wb-git method "${method}"`, 404))
        return
      }
      try {
        const payload = await readJsonBody(req)
        let value: unknown
        if (method === 'status') {
          value = await endpointStatus(ctx, payload)
        } else if (method === 'repos') {
          value = await endpointRepos(ctx, payload)
        } else if (method === 'log') {
          value = await endpointLog(ctx, payload)
        } else if (method === 'detail') {
          value = await endpointDetail(ctx, payload)
        } else if (method === 'branches') {
          value = await endpointBranches(ctx, payload)
        } else if (method === 'config') {
          value = await endpointConfig(ctx, payload)
        } else if (method === 'remote') {
          value = await endpointRemote(ctx, payload)
        } else if (method === 'ref') {
          value = await endpointRef(ctx, payload)
        } else if (method === 'status-files') {
          value = await endpointStatusFiles(ctx, payload)
        } else if (method === 'stage') {
          value = await endpointStage(ctx, payload)
        } else if (method === 'commit') {
          value = await endpointCommit(ctx, payload)
        } else if (method === 'fetch') {
          value = await endpointFetch(ctx, payload)
        } else if (method === 'pull') {
          value = await endpointPull(ctx, payload)
        } else if (method === 'fetch-into') {
          value = await endpointFetchInto(ctx, payload)
        } else if (method === 'file-content') {
          value = await endpointFileContent(ctx, payload)
        } else if (method === 'worktree-content') {
          value = await endpointWorktreeContent(ctx, payload)
        } else {
          writeError(res, new WbError('not-found', `unknown /wb-git method "${method}"`, 404))
          return
        }
        writeOk(res, value)
      } catch (error) {
        writeError(res, error)
      }
    },
  }), 'dock-git: /wb-git routes')
```

</details>

**依据 4 · 源码核查**：[package.json:43-47](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/package.json#L43-L47)

作者声明类型检查和 smoke 脚本，本轮没有执行。

```text
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown -c tsdown.config.mjs",
    "check": "tsc -p tsconfig.json --noEmit --pretty false",
    "test": "node scripts/smoke-host.mjs && node scripts/smoke-diff.mjs && node scripts/smoke-i18n.mjs && node scripts/smoke-layout.mjs"
  },
```

#### 缺口

- 未审完客户端全部交互和异常路径
  **影响**：不能对复杂写操作的人因防误触效果下总体结论
  **进一步探讨**：按 reset、merge、push、冲突和撤销逐个核对 UI 确认流程与真实返回状态

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 怎样从已发现的取舍推出可证伪的新设计方向？

**研究主题**：新假设与验证

#### 完整回答

已有贡献是把 Git 操作放进会话工作台，已发现的反例是浏览器触发钩子存在代码执行风险，而跳过钩子又可能偏离团队质量门禁。可探索把操作前策略与验收责任显式化：在确认面展示目标仓库、待影响 ref、将跳过的钩子和破坏范围，并允许受信任本地仓库按策略执行钩子；不可信仓库保持禁用，团队关键验证转到 CI。这个方向是研究者推演，当前版本未实现也未验证。最小验证应在隔离仓库构造可信/恶意钩子、失败 pre-commit、hard reset、远端挂起和合并冲突，比较误接受危险操作、误拦截、恢复步骤与时间，同时确认插件禁用/退出后仓库状态。若策略复杂度和额外确认抵消图形便利，或仍不能阻止绕过质量门禁，假设就受削弱。

#### 证据与依据

**依据 1 · 源码核查**：[src/git-ops.ts:319-362](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L319-L362)

钩子跳过与回退行为构成设计取舍的推导依据，不证明新方案有效。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * Commit with `message` as one argument vector element (newlines stay safe).
 * `--no-verify` skips pre-commit/commit-msg hooks: the /wb-git API is
 * browser-trust fenced, so hooks are not run on its behalf (a malicious
 * config value or a repo with hostile hooks must not execute on commit).
 */
export function buildCommitArgs(message: string): string[] {
  return ['commit', '--no-verify', '-m', message]
}

/**
 * Reset the current branch to `hash` in one of git's three reset modes
 * (`mixed` / `soft` / `hard`). The mode is interpolated as `--<mode>`, so a
 * validated mode can never be parsed by git as a revision or option; callers
 * must pass a mode from the fixed union (the endpoint validates it).
 */
export function buildResetArgs(mode: 'mixed' | 'soft' | 'hard', hash: string): string[] {
  return ['reset', `--${mode}`, hash]
}

/**
 * Revert `hash`: create a new commit that undoes the target commit's changes.
 * `--no-edit` uses git's default revert message (no editor is opened — the
 * API is non-interactive). Unlike `buildCommitArgs`, no `--no-verify` is
 * passed: `git revert` has no such option, so the resulting commit runs the
 * repo's normal commit-msg hook (a documented difference from staged commits,
 * which skip hooks because the /wb-git API is browser-trust fenced). A
 * conflicting revert fails and surfaces as an fs-error (the repo is left in
 * git's normal conflict state).
 */
export function buildRevertArgs(hash: string): string[] {
  return ['revert', '--no-edit', hash]
}

/**
 * Merge `name` (a local branch, or tag/commit) into the current branch.
 * `--no-edit` uses git's default merge message (no editor is opened — the API
 * is non-interactive) and `--no-verify` skips the pre-merge-commit hook for
 * the same reason `buildCommitArgs` does: the /wb-git API is browser-trust
 * fenced, so hooks must not run on its behalf. A conflicting merge fails and
 * surfaces as an fs-error (the repo is left in git's normal conflict state).
 */
export function buildMergeArgs(name: string): string[] {
  return ['merge', '--no-edit', '--no-verify', name]
```

</details>

**依据 2 · 源码核查**：[src/index.ts:795-818](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/index.ts#L795-L818)

重置与合并需要清晰的目标和失败恢复。

<details>
<summary>查看原文（24行）</summary>

```text
  if (action === 'reset') {
    // Reset the current branch to `hash` in the chosen mode (mixed/soft/hard).
    // The commit hash is validated up front (HASH_PATTERN); the mode is drawn
    // from a fixed union by resetModeOf so it can never smuggle a git option.
    if (hash === undefined) throw new WbError('bad-request', 'reset requires hash')
    const mode = resetModeOf(raw)
    await withGitError('reset', () => runGit(root, buildResetArgs(mode, hash)))
    return { action, mode, hash }
  }
  if (action === 'revert') {
    // Create a new commit that undoes `hash` (git revert --no-edit). A
    // conflicting revert fails and surfaces as fs-error; the repo is left in
    // git's normal conflict state, which the refresh shows.
    if (hash === undefined) throw new WbError('bad-request', 'revert requires hash')
    await withGitError('revert', () => runGit(root, buildRevertArgs(hash)))
    return { action, hash }
  }
  if (action === 'merge') {
    // Merge `name` (a local branch, tag or commit) into the current branch
    // (git merge --no-edit --no-verify). Used for pulling one local branch
    // into another. A conflicting merge fails and surfaces as fs-error; the
    // repo is left in git's normal conflict state, which the refresh shows.
    if (name === undefined) throw new WbError('bad-request', 'merge requires a branch name')
    await withGitError('merge', () => runGit(root, buildMergeArgs(name)))
```

</details>

#### 缺口

- 策略化确认和条件运行钩子均未实现或实测
  **影响**：不能作为插件现有能力或已证实的误操作降低方案
  **进一步探讨**：按上述隔离任务预注册成功和否定指标，再比较现有路径与设计原型

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前证据支持什么采用判断？

**研究主题**：采用判断

#### 完整回答

对个人或小团队、已使用 Dock 且可以在低风险仓库先核对 Git 行为的开发者，图形视图和会话仓库操作具备明确试用价值。对依赖本地钩子作为必经质量门禁、需要明确超时/撤销保证或不能容忍远端写操作误用的团队，当前源码边界阻止直接持续采用。建议观察，先在隔离仓库比较钩子、路径边界、强制重置、冲突和远端失败，并明确 CI 与人工审批责任，再决定是否试用；不把 Star、下载或源码存在当作真实宿主验收。若团队只需查历史，终端 Git 或现有客户端仍是合理替代。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:26-75](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/client/index.ts#L26-L75)

工作台面板和历史视图支撑明确试用场景。

<details>
<summary>查看原文（50行）</summary>

```text
export function apply(ctx: WorkbenchContext): void {
  const workbench = ctx.get<WorkbenchService>('workbench')
  // Optional-peer guard: skip silently when the base is absent.
  if (workbench === undefined) return

  ctx.effect(() => workbench.registerPlugin({
    id: 'dock-git',
    title: 'Git',
    description: 'Git history viewer for the DSH dock: browse the commit graph, branches, tags and remotes; stage, commit, push and manage repository settings.',
    icon: GIT_ICON,
    hasEntry: true,
    order: 20,
  }), 'dock-git: plugin metadata')

  // Panel styles (SVG overlay, ref chips, rows, detail panel).
  ctx.effect(() => mountStyles(), 'dock-git: styles')

  // Activity item: the left strip entry that reveals the git launcher pane
  // (which in turn opens the floating graph window).
  ctx.effect(() => workbench.registerActivityBarItem({
    id: 'git',
    pluginId: 'dock-git',
    title: translate(detectLocale(ctx), 'graphTitle'),
    icon: GIT_ICON,
    order: 20,
    paneId: 'git',
  }), 'dock-git: activity item')

  // The side-bar pane — a slim launcher (the graph itself lives in the
  // floating 'git-history' window: the side bar is too narrow for the graph).
  // The panel title is the repo list's own name, shown once by the dock's
  // sidebar header (the launcher renders no duplicate title).
  ctx.effect(() => workbench.registerPanel({
    id: 'git',
    region: 'sideBar',
    title: () => translate(detectLocale(ctx), 'repoSelectorTitle'),
    icon: GIT_ICON,
    order: 20,
    component: GitLauncher,
  }), 'dock-git: git launcher panel')

  // The full graph view, hosted in an independent floating window (default
  // 520×360, user-resizable, geometry remembered per view id).
  ctx.effect(() => workbench.registerEditorView({
    id: GRAPH_VIEW_ID,
    title: () => translate(detectLocale(ctx), 'graphTitle'),
    icon: GIT_ICON,
    order: 20,
    component: CommitView,
  }), 'dock-git: git history view')
```

</details>

**依据 2 · 源码核查**：[src/git-ops.ts:319-362](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L319-L362)

钩子差异直接影响持续采用。

<details>
<summary>查看原文（44行）</summary>

```text
/**
 * Commit with `message` as one argument vector element (newlines stay safe).
 * `--no-verify` skips pre-commit/commit-msg hooks: the /wb-git API is
 * browser-trust fenced, so hooks are not run on its behalf (a malicious
 * config value or a repo with hostile hooks must not execute on commit).
 */
export function buildCommitArgs(message: string): string[] {
  return ['commit', '--no-verify', '-m', message]
}

/**
 * Reset the current branch to `hash` in one of git's three reset modes
 * (`mixed` / `soft` / `hard`). The mode is interpolated as `--<mode>`, so a
 * validated mode can never be parsed by git as a revision or option; callers
 * must pass a mode from the fixed union (the endpoint validates it).
 */
export function buildResetArgs(mode: 'mixed' | 'soft' | 'hard', hash: string): string[] {
  return ['reset', `--${mode}`, hash]
}

/**
 * Revert `hash`: create a new commit that undoes the target commit's changes.
 * `--no-edit` uses git's default revert message (no editor is opened — the
 * API is non-interactive). Unlike `buildCommitArgs`, no `--no-verify` is
 * passed: `git revert` has no such option, so the resulting commit runs the
 * repo's normal commit-msg hook (a documented difference from staged commits,
 * which skip hooks because the /wb-git API is browser-trust fenced). A
 * conflicting revert fails and surfaces as an fs-error (the repo is left in
 * git's normal conflict state).
 */
export function buildRevertArgs(hash: string): string[] {
  return ['revert', '--no-edit', hash]
}

/**
 * Merge `name` (a local branch, or tag/commit) into the current branch.
 * `--no-edit` uses git's default merge message (no editor is opened — the API
 * is non-interactive) and `--no-verify` skips the pre-merge-commit hook for
 * the same reason `buildCommitArgs` does: the /wb-git API is browser-trust
 * fenced, so hooks must not run on its behalf. A conflicting merge fails and
 * surfaces as an fs-error (the repo is left in git's normal conflict state).
 */
export function buildMergeArgs(name: string): string[] {
  return ['merge', '--no-edit', '--no-verify', name]
```

</details>

**依据 3 · 源码核查**：[src/git-ops.ts:69-119](https://github.com/AKS1st/dock-git/blob/961c203dd87a3dc2940f7c7a3df51d6a00e37b5e/src/git-ops.ts#L69-L119)

执行器资源边界仍有缺口。

<details>
<summary>查看原文（51行）</summary>

```text
export function runGit(cwd: string, args: string[], maxBytes?: number): Promise<string> {
  const env: NodeJS.ProcessEnv = { ...process.env }
  delete env.GIT_DIR
  delete env.GIT_WORK_TREE
  env.LC_ALL = 'C'
  env.LC_MESSAGES = 'C'
  env.LANG = 'C'

  return new Promise((resolve, reject) => {
    const child = spawn('git', args, { cwd, env, stdio: ['ignore', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let overflow = false
    child.stdout.setEncoding('utf8')
    child.stderr.setEncoding('utf8')
    child.stdout.on('data', (chunk: string) => {
      if (maxBytes !== undefined && stdout.length + chunk.length > maxBytes) {
        overflow = true
        child.kill('SIGKILL')
        return
      }
      stdout += chunk
    })
    child.stderr.on('data', (chunk: string) => { stderr += chunk })
    child.on('error', reject)
    child.on('close', (code: number | null) => {
      if (overflow) {
        reject(new Error(`git output exceeds ${maxBytes} bytes`))
        return
      }
      if (code === 0) {
        resolve(stdout)
        return
      }
      // The message carries git's own output so the host can match substrings
      // of it ("nothing to commit", "does not exist", "bad revision" …).
      // Most failures write to stderr; a few (e.g. `git commit` with nothing
      // staged) exit non-zero with the message on stdout instead, so fall back
      // to stdout when stderr is empty. Both are also attached as properties.
      const text = stderr !== '' ? stderr : stdout
      const error = new Error(text !== '' ? text : `git exited with code ${code}`) as Error & {
        stderr: string
        exitCode: number | null
        stdout: string
      }
      error.stderr = stderr
      error.exitCode = code
      error.stdout = stdout
      reject(error)
    })
  })
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
