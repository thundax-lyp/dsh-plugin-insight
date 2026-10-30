# Git Graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph)

<!-- BEGIN META -->
[![GitHub ★ 9,728](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C728&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 103,703](https://img.shields.io/static/v1?label=npm+30d&message=103%2C703&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)
<!-- END META -->

> **功能**：DSH Git插件，在空白会话选择分支、查看提交图，并创建和管理托管worktree的新工作区会话。

> **亮点**：空会话上下文、托管路径和真实Git/新会话接线有源码；默认关闭自动化及有限删除保护可复用。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：已有部分补偿却未核清理Result；自动隔离失败回原workspace，工具/删除链仍有分段状态，开关和清理日志不是隔离/恢复证明。见[Q03](#research-q03)。

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
  - [Q01 · 谁使用它，真实入口和相对Git本身的增量是什么？](#detail-section-11)
  - [Q02 · 从界面或模型请求到Git及会话，身份、副作用和返回如何连接？](#detail-section-12)
  - [Q03 · 多阶段失败、自动隔离与清理有哪些具体缺口？](#detail-section-13)
  - [Q04 · 依赖、操作、成本和效果如何支持有限试用？](#detail-section-14)
  - [Q05 · 有什么可证伪的插件改进方向，何时不应另造产品？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为在DSH Git仓库开编码会话的人集中选择分支和创建另一检出；验收看Git、登记和session cwd。见[Q01](#research-q01)。

对照终端/IDE的Git/worktree与DSH手工登记；上游Git和共享SDK/围栏不全算本组件原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 分支/提交GUI | 空白会话读历史、选/建分支 | 真实检出变更影响整个仓库；图不证明完整读取 |
| 托管worktree | 新wt/分支、登记并开另一会话 | 核实际cwd；已有补偿不等事务 |
| 自动隔离 | 开关开启后包装新会话 | 默认关，失败会回原workspace |
| 模型工具 | opt-in create/list/remove | 默认关；新路径不迁移当前会话，force另有风险 |

**流程与依赖**

需兼容双半区宿主服务、Node/Git、注册工作区和可写worktree目录；实际安装/运行、遥测及可选远程条件有边界。依赖表见[Q04](#research-q04)。

先只读对照→手工命名worktree→核新session cwd/分支→小任务→非force清理逐层确认；失败先对账，勿重复变更。步骤见[Q04](#research-q04)。

**效果与成本**

副本/进程/刷新和多阶段人工恢复成本未知，非单status deadline或工具超时能总量封顶；现金、模型与人工分列见[Q04](#research-q04)。

GUI到Git及新会话链支持入口便利，净节时、始终隔离与完整恢复未验证；状态读取也非全量完整证明。效果表见[Q04](#research-q04)。

> **思考**：已有部分补偿却未核清理Result；自动隔离失败回原workspace，工具/删除链仍有分段状态，开关和清理日志不是隔离/恢复证明。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：空会话上下文、托管路径和真实Git/新会话接线有源码；默认关闭自动化及有限删除保护可复用。见[Q01](#research-q01)、[Q02](#research-q02)。

realpath注册门卫、host构造路径、分离argv、默认非force删除及状态读取消可借鉴；不外推为全事务/全变更取消。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

已有部分补偿却未核清理Result；自动隔离失败回原workspace，工具/删除链仍有分段状态，开关和清理日志不是隔离/恢复证明。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉Git并能核对真实目录和分支的DSH用户，可在无敏感数据、无并发写且可弃置的仓库手工创建一个命名worktree，保持autoIsolate与agentTool关闭。创建、登记和新session cwd须逐层读回；错误、超时、错cwd或清理不明时立即停写，先人工对账，不重复创建或force删除，保留终端/IDE流程与原状态。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包核心GUI/工具/Git/工作区会话及重要失败支路源码已核，非全monorepo/宿主/OS审计，未运行。建议无并发写、无敏感数据、可弃置仓库的手工小样，autoIsolate/agentTool保持关闭；补偿存在但不能据其日志宣称恢复或始终隔离。

- 已检查：作者 README、包清单、源码路径 packages/dsh-git-graph/README.zh.md、packages/dsh-git-graph/cordis.patch.yml、packages/dsh-git-graph/package.json、packages/dsh-git-graph/src/client/api.ts、packages/dsh-git-graph/src/client/auto-isolation.ts、packages/dsh-git-graph/src/client/chips/BranchChip.tsx、packages/dsh-git-graph/src/client/index.ts、packages/dsh-git-graph/src/client/telemetry.ts、packages/dsh-git-graph/src/core/git-command.ts、packages/dsh-git-graph/src/host/access.ts、packages/dsh-git-graph/src/host/agent-tool.ts、packages/dsh-git-graph/src/host/config.ts、packages/dsh-git-graph/src/host/git-runner.ts、packages/dsh-git-graph/src/host/git-service.ts、packages/dsh-git-graph/src/host/loopback.ts、packages/dsh-git-graph/src/host/pair-access.ts、packages/dsh-git-graph/src/host/routes.ts、packages/dsh-git-graph/src/host/worktree-home.ts、packages/dsh-git-graph/src/index.ts 及固定范围 inventory；组件：packages/dsh-git-graph。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本子包manifest/bundle、host/client实际入口、Git argv/门卫、分支/worktree创建与删除、登记/会话/导航、自动隔离降级和补偿、动态模型工具、SSE关键生命周期及共享围栏/心跳接线。未审整个monorepo、完整宿主审批/配对/OS与Git hook策略、多标签选主协议或所有UI细节，不执行目标。
- 下一步：获授权后可弃置仓库对照终端与GUI，逐层读回Git/登记/session cwd，注入登记/会话/导航/清理及传输失败；记录错写、残留识别、恢复工时与正常开销，未知状态不重放变更。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.12（[固定提交 de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

候选是按操作阶段读回Git/登记/session cwd并报告ready或未知；先比简单提示/人工清单，补丁够用就否定独立插件。见[Q05](#research-q05)。

获授权后可弃置仓库对照终端与GUI，逐层读回Git/登记/session cwd，注入登记/会话/导航/清理及传输失败；记录错写、残留识别、恢复工时与正常开销，未知状态不重放变更。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 289 | — | — | 6062 |
| .ts | source | 29 | 4034 | 2531 | 1232 | — |
| .tsx | source | 7 | 1246 | 958 | 205 | — |
| .ts | test | 12 | 2740 | 2148 | 297 | — |
| .tsx | test | 2 | 915 | 726 | 101 | — |
| .md | example | 1 | 64 | — | — | 473 |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 183](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=183&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 182](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=182&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定Git Graph子组件能否在实际Git/登记/session链及失败情况下支持可回退采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它，真实入口和相对Git本身的增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是dsh-web内原生双半区插件@linxin666/dsh-client-ui-git-graph 0.4.12，manifest声明host入口、/client、bundle及DSH>=0.2.1-rc.3，Node ^22.19.0或>=24.0.0、Apache-2.0。它为在DSH Git工作区开编码会话的人提供空白会话分支选择、提交图和托管worktree新会话管理；不是Git实现、独立Agent或自动合并工具。基线是终端/IDE执行git branch/log/switch/worktree，再在DSH注册目录、开会话；验收应看实际检出、workspace登记和新会话cwd，不能只看图标或工具返回路径。

host apply创建GitService和工作区门卫，effect实际注册/git路由；client实际创建GitApi、注入sessions/workspaces等服务并在conversation.input.dock挂BranchChip。BranchChip只在blank且open/blankSession的hero位显示，active会话不显示分支选择。这个GUI限制不等于服务端禁止活动工作区切分支：真实git switch作用于整仓库检出，会影响共享该检出的其他会话；worktree的增量是另一文件检出及wt/新分支，普通工作区切分支本身不提供会话隔离。

手工入口在Git变更之后注册worktree为workspace、创建会话，再由uiWorkspace.openSession导航；opt-in自动隔离则包装共享startSession并调用原行为。另一个独立开关注册模型可见git_worktree工具，提供create/list/remove，默认关闭，当前会话不会因为create返回新路径而迁移。Git的历史、分支、worktree和冲突保护属于上游Git；本组件贡献是DSH上下文入口、托管路径、错误分类与多阶段接线。SDK、共享子进程/配对围栏/客户端心跳不能全算本组件原创，更不能把远程Web、SSH或Skill管理归给此子包。

已读旧正式research.json内五题、证据和依赖，以旧提交6b984b10950f78f1f4a5b5adf4c16636b5e6113d作历史线索。本固定版本的浏览器创建路径已有补偿，不能继承旧“完全无注册失败回滚”结论；当前局限应核补偿是否成功和错误时实际在哪个workspace开会话。没有安装、运行或用户对照，尚未证明净节时、并行不互扰或生产兼容。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/package.json:1-57](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/package.json#L1-L57)

0.4.12双入口、宿主/Node和许可证声明。

<details>
<summary>查看原文（57行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-git-graph",
  "description": "External dsh web GUI plugin: a blank-session git branch selector + Git graph, with real host-side git operations and guards, as a dsh profile bundle",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
  },
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
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
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
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.d.ts.map",
    "src",
    "cordis.patch.yml",
    "icon.svg"
  ],
  "license": "Apache-2.0",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/cordis.patch.yml:1-12](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/cordis.patch.yml#L1-L12)

bundle插入本插件host/client。

<details>
<summary>查看原文（12行）</summary>

```text
# dsh-git-graph bundle patch: inserts the dual-face plugin row into the web
# profile roster. Applied as a profile bundle layer (the `dsh.bundle.patch`
# manifest field) over dsh-base; activate with
# `dsh plugin --profile <name> add link:~/code/dsh-git-graph`.
#
# The row is a bare plugin by package name: the node half (exports ".") runs
# in the host process (git service + /git/* HTTP routes), and the dsh.client
# declaration in package.json makes the browser half (exports "./client",
# served at /plugins/<id>/client.js) load in the web GUI.
- insert:
    - id: ui-git-graph
      name: '@linxin666/dsh-client-ui-git-graph'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/index.ts:83-132](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/index.ts#L83-L132)

实例化、动态工具与实际路由effect。

<details>
<summary>查看原文（50行）</summary>

```text
function applyImpl(ctx: Context, config?: Config): void {
  const service = new GitService(subprocessRunner(ctx), createWorkspaceGate(ctx))

  // The settings subsystem commits an edit into these references without
  // remounting the row, so every read goes through effectiveConfig.
  const featureConfig = (): GitFeatureConfig => {
    const active = effectiveConfig(config)
    return {
      autoIsolate: active.autoIsolate,
      autoBaseline: active.autoBaseline,
      worktreesHome: worktreesHome(),
    }
  }

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
  }

  // A volatile-only edit never remounts the row: the Loader commits the new
  // value into the references and announces the paths. That notice is what
  // re-derives the tool registration (the old settings hook's job); a change
  // to any other field re-syncs to the same verdict, because syncTool only
  // compares the flag with what is registered.
  ctx.effect(() => {
    const dispose = ctx.on('loader/volatile-update', (paths) => {
      if (paths.some(path => path[0] === 'agentTool')) syncTool()
    })
    return () => { dispose() }
  }, 'dsh-git-graph: settings-committed tool sync')

  ctx.effect(() => {
    syncTool()
    const disposeRoutes = registerGitRoutes(ctx, service, featureConfig)
    return () => {
      disposeRoutes()
      toolFiber?.dispose()
      toolFiber = undefined
    }
  }, 'dsh-git-graph: /git routes + tool')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:100-108](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L100-L108)

GitApi与自动隔离实际安装。

```text
  const git = new GitApi()

  // Auto-isolation (settings-gated host-side, probed here): wrap the shared
  // workspaces service's startSession so New Session on a git workspace
  // lands in a fresh managed worktree. Shape mismatch degrades to the
  // official behavior. The fiber's dispose restores the official method.
  ctx.inject(['workspaces', 'sessions', 'uiWorkspace'], (worktreeScope: ClientContext) => {
    worktreeScope.effect(() => installAutoIsolation(worktreeScope, git), 'dsh-git-graph: auto-isolation')
  })
```

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:165-186](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L165-L186)

手工worktree→workspace→会话→导航实际调用。

<details>
<summary>查看原文（22行）</summary>

```text
        createWorktreeSession: async (sessionId, name, baseRef) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const created = await git.addWorktree(resolved.path, name, baseRef)
          if (!created.ok) return { ok: false, error: created.error }
          // Register the worktree as a workspace and open its blank session;
          // a registration failure rolls the worktree back (no half-made env).
          try {
            const workspace = await scope.workspaces.create({ path: created.value.path })
            // 0.1.2 cohort: workspace-side session launch moved to the sessions
            // face. ISessions.create only adopts the target workspace and
            // resolves the new SessionId; open() is the separate navigation
            // step that selects it (matching the old startSession behavior).
            const createdSessionId = await scope.sessions.create({ workspaceId: workspace.workspaceId })
            // Navigation belongs to the workspace UI since the multi-instance
            // Client Session model; the Session Controller no longer opens one.
            scope.uiWorkspace.openSession(createdSessionId)
          } catch (error: unknown) {
            await git.removeWorktree(resolved.path, created.value.path, { force: true })
            return { ok: false, error: { code: 'internal', message: `workspace registration failed: ${String(error)}` } }
          }
          return { ok: true, path: created.value.path, branch: created.value.branch, name: created.value.name }
```

</details>

**依据 6 · 源码核查**：[packages/dsh-git-graph/src/client/chips/BranchChip.tsx:124-133](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/chips/BranchChip.tsx#L124-L133)

hero条件。

<details>
<summary>查看原文（10行）</summary>

```text
  // The dock seat carries the composer snapshot and exposes the selector only
  // in the blank hero phase.
  const sessionSnapshot = props.session
  // 0.1.2 cohort: the composer phase machine is gone from the snapshot; the
  // blank empty-log mirror plus open state covers the same show-selector seat.
  const heroSeat = sessionSnapshot?.blank === true && (sessionSnapshot.openState === 'open' || blankSession === true)
  const stockLightTheme = useStockLightTheme()

  /** Repository state: undefined = loading, null = not a repository, else the snapshot. */
  const [repo, setRepo] = useState<RepoStatus | null | undefined>(undefined)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-git-graph/src/client/chips/BranchChip.tsx:234-236](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/chips/BranchChip.tsx#L234-L236)

活动会话不显示选择器。

```text
  // Active sessions intentionally expose no branch-selection control. Loading
  // and non-repository workspaces likewise render no dead control.
  if (!heroSeat || repo === undefined || repo === null) return null
```

#### 缺口

- 实际宿主加载/slot兼容、目标用户操作频次及节时均未实测
  **影响**：不能把源码接线或入口数量作为净收益/隔离成立证明
  **进一步探讨**：授权后仅以无敏感数据、无并发写的可弃置Git仓库，对照终端/IDE完成同样命名worktree与新会话任务，核实际cwd/分支、工时和返工。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从界面或模型请求到Git及会话，身份、副作用和返回如何连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器GitApi.post以JSON POST到/git端点，把业务envelope.ok解析为Result；HTTP 200本身不是Git成功。routes先isGitAllowed，再限制POST、application/json和1MiB请求体，路径字段交GitService。围栏经共享pair-access允许直接loopback或可选配对服务的有效请求；本项只核接线，不宣称全配对/远程认证已审。host门卫realpath请求目录并要求等于workspaceRegistry中某个路径，服务再用git rev-parse取得仓库toplevel。门卫约束注册入口，不是子目录沙箱；注册的目录若在仓库内部，分支事务仍作用于整个Git仓库。

runner经ctx.subprocess.spawn分离argv运行git，Windows明确用git.exe，不走cmd.exe或拼shell。stdout/stderr各1MiB，signal在传入时向进程传播；graceMs=10000是终止宽限，不是所有操作十秒总时限。switch验证分支格式与本地ref，拒绝未合并冲突、进行中的Git操作或分支已被另一worktree检出，再执行git switch --no-guess -- <branch>；普通有改动不等于一律拒绝，剩余覆盖保护由Git实际执行并分类错误。

addWorktree先sanitize名称、查新wt/分支/路径冲突、验证基线并拒绝进行中的Git操作，路径由host构造为$DSH_HOME/worktrees/<仓库名+root短哈希>/<name>，不是让客户端任意给落盘地址。基线默认当前HEAD；origin/HEAD不存在时退回HEAD，既不fetch远端，也不把主检出尚未提交的改动复制进新worktree。Git成功后浏览器手工入口依次workspaces.create、sessions.create、openSession；模型工具则从exec.agent.session.header.cwd取入口，create后workspaceRegistry.create并返回新路径/登记ID，明确当前会话仍在旧检出。工具create并不等于已启动另一个Agent。

删除先canonicalize双方路径，要求候选是本仓库托管目录直接子级、实际存在于git worktree list，且不是主检出。默认还查脏/未跟踪/冲突及进行中操作，再执行git worktree remove；force=true会跳过这两组前置检查并传--force。模型工具接受force/deleteBranch，无本组件额外真人确认调用；是否有宿主通用审批不在本项全审范围，不能把默认关闭当开启后的逐次授权证明。磁盘删除成功后，浏览器/模型入口按路径相等查登记并注销；这是后续步骤，不是同一事务。

状态流是另一条只读链：HTTP status由15秒controller deadline→service.status→带signal子进程；SSE订阅首个加入启动PollGuard，30秒轮询、15秒心跳，断连时撤订阅并abort其读取，最后订阅离开停止循环，插件卸载释放路由和流。循环本身用MAX_SAFE_INTEGER哨兵，无固定总寿命；不能把单次status超时当全部Git/连接总成本上限。状态事件key比较root/branch/head和worktree摘要，不含所有脏文件计数；不是全文件实时监控。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/client/api.ts:30-49](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/api.ts#L30-L49)

网络与业务Result实际解析。

<details>
<summary>查看原文（20行）</summary>

```text
async function post<T>(path: string, payload: Record<string, unknown>): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    return { ok: false, error: TRANSPORT_ERROR }
  }
  try {
    const envelope = await response.json() as unknown
    if (typeof envelope !== 'object' || envelope === null) return { ok: false, error: TRANSPORT_ERROR }
    const record = envelope as Record<string, unknown>
    if (record.ok === true) return { ok: true, value: record.value as T }
    return { ok: false, error: (record.error as GitError | undefined) ?? TRANSPORT_ERROR }
  } catch {
    return { ok: false, error: TRANSPORT_ERROR }
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:195-225](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L195-L225)

围栏、JSON及请求上限。

<details>
<summary>查看原文（31行）</summary>

```text
  const handler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    // Trust fence first: never let an unpaired LAN client reach any /git
    // operation, regardless of method or content-type.
    if (!isGitAllowed(ctx, req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return
    }
    if (req.method !== 'POST') {
      res.writeHead(405)
      res.end()
      return
    }
    // CSRF hardening: the /git mutations (switch/create-branch) act on the
    // real repository with no origin/referer check, so require a JSON
    // content-type — cross-site forms cannot set application/json without a
    // CORS preflight, which the same-origin client always sends.
    const contentType = req.headers['content-type'] ?? ''
    if (!contentType.toLowerCase().startsWith('application/json')) {
      res.writeHead(415)
      res.end()
      return
    }
    const pathname = new URL(req.url ?? '/', 'http://x').pathname
    const payload = await readJsonBody(req, { maxBytes: 1024 * 1024 })
    // The feature config is pathless: the browser reads it before any
    // workspace resolution (the auto-isolation wrapper consults it on every
    // New Session action, so a settings toggle applies without a reload).
    if (pathname === '/git/config') {
      const view = config()
      writeJson(res, 200, isGitFeatureConfig(view) ? OK(view) : FAIL(MALFORMED_VIEW))
      return
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/access.ts:10-20](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/access.ts#L10-L20)

委托共享配对/loopback。

<details>
<summary>查看原文（11行）</summary>

```text
import { isPairedOrLoopbackAllowed } from './pair-access.ts'

/**
 * Whether this request may enter any /git route (JSON operations or SSE).
 * @param ctx - host context; may expose remoteWebUiPairing.
 * @param request - the incoming HTTP request.
 * @returns true for loopback, or a live paired-device cookie.
 */
export function isGitAllowed(ctx: Context, request: IncomingMessage): boolean {
  return isPairedOrLoopbackAllowed(ctx, request)
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/index.ts:59-71](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/index.ts#L59-L71)

realpath且注册workspace路径精确匹配。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:433-438](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L433-L438)

注册入口再取Git仓库root。

```text
  /** Repository root of a canonical path, or null when not inside a git repository. */
  private async repoRoot(path: string, signal?: AbortSignal): Promise<string | null> {
    const result = await this.runner.run(topLevelArgv(), path, signal)
    if (result.exitCode !== 0) return null
    const root = result.stdout.trim()
    return root === '' ? null : root
```

**依据 6 · 源码核查**：[packages/dsh-git-graph/src/host/git-runner.ts:81-117](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-runner.ts#L81-L117)

独立argv、输出cap、signal和终止宽限。

<details>
<summary>查看原文（37行）</summary>

```text
    async run(argv, cwd, signal) {
      signal?.throwIfAborted()
      const spec = {
        argv: spawnArgv(argv),
        cwd,
        stdio: {
          stdin: 'ignore' as const,
          stdout: { maxBytes: OUTPUT_CAP_BYTES },
          stderr: { maxBytes: OUTPUT_CAP_BYTES },
        },
        graceMs: 10_000,
        signal,
      }
      if (degrade) {
        let handle
        try {
          handle = ctx.subprocess.spawn(spec)
        } catch (error) {
          signal?.throwIfAborted()
          console.error('[' + errorTag + '] git spawn failed:', error)
          return failure('git: spawn failed: ', error)
        }
        try {
          const outcome = await handle.done
          signal?.throwIfAborted()
          const stdout = handle.collected.stdout?.readFrom(0).text ?? ''
          const stderr = handle.collected.stderr?.readFrom(0).text ?? ''
          return { exitCode: outcome.exitCode, stdout, stderr }
        } catch (error) {
          signal?.throwIfAborted()
          console.error('[' + errorTag + '] git run failed:', error)
          return failure('git: run failed: ', error)
        }
      }
      const handle = ctx.subprocess.spawn(spec)
      const outcome = await handle.done
      signal?.throwIfAborted()
```

</details>

**依据 7 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:47-48](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L47-L48)

Windows git.exe真实分支。

```text
export function gitSpawnArgv(platform: NodeJS.Platform, argv: readonly string[]): readonly string[] {
  return platform === 'win32' ? ['git.exe', ...argv] : ['git', ...argv]
```

**依据 8 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:216-236](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L216-L236)

切分支实际校验和调用。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 9 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:315-357](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L315-L357)

创建路径、分支、基线及真实变更。

<details>
<summary>查看原文（43行）</summary>

```text
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
  }

  /**
```

</details>

**依据 10 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:95-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/agent-tool.ts#L95-L125)

从会话cwd创建并登记，返回不迁移会话。

<details>
<summary>查看原文（31行）</summary>

```text
    timeoutMs: 60_000,
    async execute(args: unknown, exec) {
      const input = (typeof args === 'object' && args !== null ? args : {}) as ToolArgs
      const cwd = callingCwd(exec)
      if (cwd === undefined) {
        return { ok: false, code: 'workspace-unknown', message: 'git_worktree needs a calling session with a project cwd' }
      }
      switch (input.action) {
        case 'list': {
          const view = await service.worktrees(cwd, exec.signal)
          if (view === null) return { ok: false, code: 'workspace-unknown', message: 'not a git workspace' }
          return { ok: true, root: view.root, worktrees: view.worktrees }
        }
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

**依据 11 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:367-431](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L367-L431)

移除资格、force与branch清理。

<details>
<summary>查看原文（65行）</summary>

```text
  async removeWorktree(
    path: string,
    worktreePath: string,
    opts: { force?: boolean; deleteBranch?: boolean } = {},
  ): Promise<WorktreeRemoveResult> {
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    let canonical: string
    try {
      canonical = await realpath(worktreePath)
    } catch {
      return { ok: false, error: { code: 'worktree-not-found', message: `worktree path does not resolve: ${worktreePath}` } }
    }
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

**依据 12 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:128-139](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/agent-tool.ts#L128-L139)

模型移除后再注销。

<details>
<summary>查看原文（12行）</summary>

```text
        case 'remove': {
          if (typeof input.worktreePath !== 'string' || input.worktreePath === '') {
            return { ok: false, code: 'invalid-worktree-name', message: 'remove requires worktreePath' }
          }
          const result = await service.removeWorktree(cwd, input.worktreePath, {
            force: input.force === true,
            deleteBranch: input.deleteBranch === true,
          })
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          const linked = ctx.workspaceRegistry.list().find(item => item.path === input.worktreePath)
          if (linked !== undefined) await ctx.workspaceRegistry.delete(linked.id)
          return { ok: true, removed: input.worktreePath }
```

</details>

**依据 13 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:188-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L188-L199)

浏览器移除后再注销。

<details>
<summary>查看原文（12行）</summary>

```text
        removeWorktree: async (sessionId, worktreePath, opts) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const removed = await git.removeWorktree(resolved.path, worktreePath, opts)
          if (!removed.ok) return { ok: false, error: removed.error }
          // Unregister the linked workspace after the disk removal succeeds,
          // so a rejection never orphans the registration.
          const linked = scope.workspaces.list.getSnapshot().items.find(item => item.path === worktreePath)
          if (linked !== undefined) {
            await scope.workspaces.delete(linked.workspaceId)
          }
          return { ok: true }
```

</details>

**依据 14 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:145-192](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L145-L192)

status deadline与事件key。

<details>
<summary>查看原文（48行）</summary>

```text
  const statusWithDeadline = async (path: string, controller: AbortController = new AbortController()): Promise<Awaited<ReturnType<GitService['status']>>> => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        const error = new Error(STATUS_TIMEOUT_MESSAGE)
        controller.abort(error)
        reject(error)
      }, STATUS_TIMEOUT_MS)
    })
    try {
      return await Promise.race([service.status(path, controller.signal), deadline])
    } finally {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }

  const runPoll = async (): Promise<void> => {
    await Promise.all([...subscribers].map(async (subscriber) => {
      const controller = new AbortController()
      subscriber.statusAbort = controller
      try {
        const status = await statusWithDeadline(subscriber.path, controller)
        // Worktree membership rides the same change key: `git worktree
        // add/remove` elsewhere never moves the checkout's branch/head, but
        // the worktree manager must still refresh. A failed list keeps the
        // previous digest so a transient error never flaps the stream.
        let worktreeDigest = subscriber.lastWorktreeDigest ?? ''
        try {
          const view = await service.worktrees(subscriber.path, controller.signal)
          if (view !== null) {
            worktreeDigest = view.worktrees.map(item => `${item.path}:${item.branch}:${item.head}`).join(',')
            subscriber.lastWorktreeDigest = worktreeDigest
          }
        } catch {
          // tolerate: the status half still covers branch changes
        }
        const key = status === null ? 'no-repo' : `${status.root}|${status.branch}|${status.head}|wt:${worktreeDigest}`
        if (key === subscriber.last) return
        subscriber.last = key
        push(subscriber, { path: subscriber.path, status })
      } catch (error: unknown) {
        if (subscribers.has(subscriber)) {
          ctx.logger.warn(`dsh-git-graph: status poll failed for ${subscriber.path}: ${String(error)}`)
        }
      } finally {
        if (subscriber.statusAbort === controller) subscriber.statusAbort = undefined
      }
    }))
```

</details>

**依据 15 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:339-377](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L339-L377)

真实SSE生命周期和dispose。

<details>
<summary>查看原文（39行）</summary>

```text
    const subscriber: Subscriber = { path, last: '', res }
    subscribers.add(subscriber)
    // A push/heartbeat write racing socket teardown emits 'error' on the
    // response stream; unhandled, that can crash the host. Dropping the
    // subscriber degrades the race to a lost write; req 'close' finishes
    // the remaining cleanup.
    res.on('error', () => { removeSubscriber(subscriber) })
    if (guard === undefined) {
      guard = new PollGuard({
        intervalMs: POLL_INTERVAL_MS,
        deadlineMs: POLL_LIFETIME_MS,
        maxBackoffMs: POLL_INTERVAL_MS,
        onRun: runPoll,
      })
    }
    guard.start()
    if (heartbeatTimer === undefined) {
      heartbeatTimer = setInterval(() => {
        for (const current of subscribers) current.res.write(': ping\n\n')
      }, HEARTBEAT_INTERVAL_MS)
    }
    req.on('close', () => { removeSubscriber(subscriber) })
  }

  const disposers = [
    ctx.webServer.register({ kind: 'prefix', path: '/git', handler }),
    ctx.webServer.register({ kind: 'exact', path: '/git/events', handler: sse }),
  ]
  return () => {
    for (const dispose of disposers) dispose()
    guard?.stop()
    if (heartbeatTimer !== undefined) clearInterval(heartbeatTimer)
    for (const subscriber of subscribers) {
      subscriber.statusAbort?.abort(new Error('git status routes disposed'))
      subscriber.res.end()
    }
    subscribers.clear()
  }
}
```

</details>

#### 缺口

- 宿主通用审批/进程生命周期、不同OS与多标签页资源行为未独立运行
  **影响**：路径门卫/argv/局部signal不能推出OS沙箱、工具所有变更可取消或跨标签页全资源上限
  **进一步探讨**：小样逐次核Git、登记、会话三层真实状态；取消/超时后先对账，不重复create/remove，不给模型force清理权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多阶段失败、自动隔离与清理有哪些具体缺口？

**研究主题**：缺陷与关键质疑

#### 完整回答

当前存在补偿，但不是已证全事务。手工createWorktreeSession的try包含workspace登记、session创建和openSession；catch会await git.removeWorktree(force:true)再报workspace registration failed，却不保存/注销已经成功登记的workspace，也不检查removeWorktree返回的Result。GitApi在网络错误、错误envelope和解析失败时通常返回ok:false而不是抛错；因此await清理结束不能证明磁盘已回滚，session创建或导航失败亦可能留下登记/会话。这里的错误文案也覆盖不止登记失败，不能当故障阶段证据。

自动隔离链有改进：保存registeredId、若可用调用registry.delete，再尝试removeWorktree；但registry.delete可选，删除抛错仅warn后继续，remove的业务Result未检查，仍打印rolled back。它没有证明worktree、登记和会话三层均恢复。更关键的是配置/状态不可得、worktree创建失败、注册/启动出错等包装流程内的分支会回调original(target)，在原workspace按官方方式开会话；服务形状不匹配则不安装包装，沿用官方行为。README明确承认可用性优先的降级。autoIsolate默认false；开启不等于每个新会话必然隔离，适合要求严格隔离的人不能只看开关，应核新会话实际cwd/分支，降级时停写。导航方法的返回值没有被await，异步拒绝也不能从这个同步try推为可捕获/已补偿，宿主实际返回契约需另验。

模型工具create的Git成功之后直接await workspaceRegistry.create，无同等catch清理；登记失败可能留下worktree与wt/分支。其60秒timeout字段也不能证明Git变更被终止：list实际传exec.signal，create/remove却没有向服务调用传该signal，服务变更runner也未传signal。未全审宿主的其他取消机制，所以结论是组件链本身不足以保证取消，不宣称进程必定失控。取消、传输失败或等待超时都先查实际Git与登记，不能把报错当未执行。

remove可在磁盘已删除后注销workspace失败，返回并非统一的整体事务结果；路径登记匹配使用输入原拼写相等，若与登记canonical路径拼写不同，可能找不到应注销的行。具体宿主是否规范化到相同字符串未实测，不能宣称默认必现。deleteBranch只对wt/分支运行git branch -D，但忽略该命令exitCode，随后仍ok:true；所以worktree删除成功不等于可选分支清理已完成。默认非force、真实Git membership/直接子目录和主检出禁止等保护仍存在，不应把这些缺口写成任意目录可删。

只读提交图也有完整性边界：graph在repoRoot成功后不检查log/branch命令exitCode，解析stdout并以解析条数是否大于limit计算hasMore；输出还有各1MiB cap，路由limit最多1000。空图/hasMore=false不能独立证明仓库无历史或读取完整，失败应对照原Git。状态SSE的15秒保护只包status，随后worktrees读未另加该deadline；共享controller在status完成后timeout已经清除。故不能声称每一完整轮询或所有Git调用都15秒有界。

未执行任何目标代码、Git变更或故障实验。这里只给源码可达失败支路及条件影响，不证明每个宿主部署必现、远程可利用、现有用户已受损或已知恢复时间。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:165-186](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L165-L186)

手工补偿缺登记/会话阶段对账并忽略remove Result。

<details>
<summary>查看原文（22行）</summary>

```text
        createWorktreeSession: async (sessionId, name, baseRef) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const created = await git.addWorktree(resolved.path, name, baseRef)
          if (!created.ok) return { ok: false, error: created.error }
          // Register the worktree as a workspace and open its blank session;
          // a registration failure rolls the worktree back (no half-made env).
          try {
            const workspace = await scope.workspaces.create({ path: created.value.path })
            // 0.1.2 cohort: workspace-side session launch moved to the sessions
            // face. ISessions.create only adopts the target workspace and
            // resolves the new SessionId; open() is the separate navigation
            // step that selects it (matching the old startSession behavior).
            const createdSessionId = await scope.sessions.create({ workspaceId: workspace.workspaceId })
            // Navigation belongs to the workspace UI since the multi-instance
            // Client Session model; the Session Controller no longer opens one.
            scope.uiWorkspace.openSession(createdSessionId)
          } catch (error: unknown) {
            await git.removeWorktree(resolved.path, created.value.path, { force: true })
            return { ok: false, error: { code: 'internal', message: `workspace registration failed: ${String(error)}` } }
          }
          return { ok: true, path: created.value.path, branch: created.value.branch, name: created.value.name }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/client/api.ts:30-49](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/api.ts#L30-L49)

错误转Result而非必抛异常。

<details>
<summary>查看原文（20行）</summary>

```text
async function post<T>(path: string, payload: Record<string, unknown>): Promise<ApiResult<T>> {
  let response: Response
  try {
    response = await fetch(path, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    })
  } catch {
    return { ok: false, error: TRANSPORT_ERROR }
  }
  try {
    const envelope = await response.json() as unknown
    if (typeof envelope !== 'object' || envelope === null) return { ok: false, error: TRANSPORT_ERROR }
    const record = envelope as Record<string, unknown>
    if (record.ok === true) return { ok: true, value: record.value as T }
    return { ok: false, error: (record.error as GitError | undefined) ?? TRANSPORT_ERROR }
  } catch {
    return { ok: false, error: TRANSPORT_ERROR }
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/client/auto-isolation.ts:154-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/auto-isolation.ts#L154-L199)

默认行为回退、registeredId补偿及清理结果未校验。

<details>
<summary>查看原文（46行）</summary>

```text
      // Already inside the managed worktree home: never nest isolations.
      const home = config.worktreesHome
      if (item.path.startsWith(home + '/') || item.path.startsWith(home + '\\')) {
        original.call(navigation, target)
        return
      }
      const status = await git.status(item.path)
      if (!status.ok || status.value === null) {
        original.call(navigation, target)
        return
      }
      const name = `s-${Date.now().toString(36)}`
      const baseRef = config.autoBaseline === 'default' ? 'origin/HEAD' : undefined
      const created = await git.addWorktree(item.path, name, baseRef)
      if (!created.ok) {
        console.warn(`${TAG} worktree creation failed; starting the session in the main checkout instead`, created.error)
        original.call(navigation, target)
        return
      }
      let registeredId: string | undefined
      try {
        const workspace = await registry.create({ path: created.value.path })
        registeredId = workspace.workspaceId
        original.call(navigation, workspace.workspaceId)
      } catch (error) {
        // Roll back the half-created environment rather than leaking it: drop
        // the registration just made, then the worktree directory. Without the
        // registration step the list would keep an entry pointing at a path we
        // are about to delete.
        if (registeredId !== undefined && typeof registry.delete === 'function') {
          try {
            await registry.delete(registeredId)
          } catch (cleanupError) {
            console.warn(`${TAG} could not drop the failed workspace registration`, cleanupError)
          }
        }
        await git.removeWorktree(item.path, created.value.path, { force: true })
        console.warn(`${TAG} workspace registration failed; rolled back the worktree`, error)
        original.call(navigation, target)
      }
    })().catch((error: unknown) => {
      console.warn(`${TAG} routing failed; using the official behavior`, error)
      original.call(navigation, target)
    }).finally(() => {
      routing.delete(target)
    })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/client/auto-isolation.ts:202-214](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/auto-isolation.ts#L202-L214)

方法patch/恢复失败降级。

<details>
<summary>查看原文（13行）</summary>

```text
  try {
    navigation.startSession = routed
  } catch {
    console.warn(`${TAG} disabled: startSession is not writable`)
    return () => {}
  }
  return () => {
    try {
      navigation.startSession = original
    } catch {
      // A frozen service cannot be restored; the wrapper dies with the page.
    }
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-git-graph/README.zh.md:77-82](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/README.zh.md#L77-L82)

开关默认关闭和失败降级已说明。

```text
插件设置卡里有两个开关（默认都关闭）：

- **自动隔离**（`autoIsolate`）：git 工作区的“新会话”动作会静默创建全新托管 worktree 并在其中开会话——Claude 桌面版式的自动形态。`autoBaseline` 选择基线：当前检出 HEAD（`current`）或远程默认分支（`default`，解析为 `origin/HEAD`，无远程时回退 HEAD）。已在托管目录下的工作区不会被二次隔离；任何失败都降级回官方新会话行为。实现上是浏览器半区对 workspaces 服务的运行时包装（形状探测过的 patch，不改 DSH 源码）——SDK 升级若改变该服务形状，功能自动关闭并打印诊断，不会硬崩。
- **Agent 工具**（`agentTool`）：注册模型可见的 `git_worktree` 工具（对同一托管目录做 create/list/remove，以调用会话的 cwd 做工作区门卫）。这是对“git 能力不进模型可见面”既定规则的有意豁免，仅对开启者生效。注意沙盒边界：会话 cwd 不可变，当前会话无法迁入 worktree；workspace-write 沙盒下 agent 也不能写会话根之外——所以 `create` 会同时把 worktree 注册成 workspace，工具回复会提示模型在其上开新会话。danger-full-access 模式下 agent 可直接在返回路径里工作。

删除只针对仓库托管目录的直接子级（双侧 canonical 路径包含校验），且在磁盘删除成功后才注销关联的 workspace。
```

**依据 6 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:95-139](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/agent-tool.ts#L95-L139)

工具create登记无同等补偿，变更不传exec.signal。

<details>
<summary>查看原文（45行）</summary>

```text
    timeoutMs: 60_000,
    async execute(args: unknown, exec) {
      const input = (typeof args === 'object' && args !== null ? args : {}) as ToolArgs
      const cwd = callingCwd(exec)
      if (cwd === undefined) {
        return { ok: false, code: 'workspace-unknown', message: 'git_worktree needs a calling session with a project cwd' }
      }
      switch (input.action) {
        case 'list': {
          const view = await service.worktrees(cwd, exec.signal)
          if (view === null) return { ok: false, code: 'workspace-unknown', message: 'not a git workspace' }
          return { ok: true, root: view.root, worktrees: view.worktrees }
        }
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
          }
        }
        case 'remove': {
          if (typeof input.worktreePath !== 'string' || input.worktreePath === '') {
            return { ok: false, code: 'invalid-worktree-name', message: 'remove requires worktreePath' }
          }
          const result = await service.removeWorktree(cwd, input.worktreePath, {
            force: input.force === true,
            deleteBranch: input.deleteBranch === true,
          })
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          const linked = ctx.workspaceRegistry.list().find(item => item.path === input.worktreePath)
          if (linked !== undefined) await ctx.workspaceRegistry.delete(linked.id)
          return { ok: true, removed: input.worktreePath }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:315-357](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L315-L357)

create runner无signal调用。

<details>
<summary>查看原文（43行）</summary>

```text
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
  }

  /**
```

</details>

**依据 8 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:367-431](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L367-L431)

remove主检出/资格保护仍有、可选branch退出码忽略。

<details>
<summary>查看原文（65行）</summary>

```text
  async removeWorktree(
    path: string,
    worktreePath: string,
    opts: { force?: boolean; deleteBranch?: boolean } = {},
  ): Promise<WorktreeRemoveResult> {
    const gated = await this.gate(path)
    if (!gated.ok) return { ok: false, error: WORKSPACE_UNKNOWN }
    const root = await this.repoRoot(gated.canonical)
    if (root === null) return { ok: false, error: { code: 'internal', message: 'not a git repository' } }
    let canonical: string
    try {
      canonical = await realpath(worktreePath)
    } catch {
      return { ok: false, error: { code: 'worktree-not-found', message: `worktree path does not resolve: ${worktreePath}` } }
    }
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

**依据 9 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:188-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L188-L199)

删除后的原拼写相等查登记与注销。

<details>
<summary>查看原文（12行）</summary>

```text
        removeWorktree: async (sessionId, worktreePath, opts) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const removed = await git.removeWorktree(resolved.path, worktreePath, opts)
          if (!removed.ok) return { ok: false, error: removed.error }
          // Unregister the linked workspace after the disk removal succeeds,
          // so a rejection never orphans the registration.
          const linked = scope.workspaces.list.getSnapshot().items.find(item => item.path === worktreePath)
          if (linked !== undefined) {
            await scope.workspaces.delete(linked.workspaceId)
          }
          return { ok: true }
```

</details>

**依据 10 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:273-289](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L273-L289)

graph忽略命令exit并从解析数计算hasMore。

<details>
<summary>查看原文（17行）</summary>

```text
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
    }
```

</details>

**依据 11 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:244-251](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L244-L251)

graph limit clamp。

```text
      case '/git/graph': {
        const rawLimit = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).limit
          : undefined
        // Clamp rather than reset: a limit above 1000 must not silently fall
        // back to the 200 default (the client's load-more grows past 1000).
        const limit = typeof rawLimit === 'number' && rawLimit > 0 ? Math.min(rawLimit, 1000) : undefined
        okView(res, await service.graph(path, limit), isGraphView)
```

**依据 12 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:145-179](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L145-L179)

status单段deadline清除后另读worktree。

<details>
<summary>查看原文（35行）</summary>

```text
  const statusWithDeadline = async (path: string, controller: AbortController = new AbortController()): Promise<Awaited<ReturnType<GitService['status']>>> => {
    let timeout: ReturnType<typeof setTimeout> | undefined
    const deadline = new Promise<never>((_, reject) => {
      timeout = setTimeout(() => {
        const error = new Error(STATUS_TIMEOUT_MESSAGE)
        controller.abort(error)
        reject(error)
      }, STATUS_TIMEOUT_MS)
    })
    try {
      return await Promise.race([service.status(path, controller.signal), deadline])
    } finally {
      if (timeout !== undefined) clearTimeout(timeout)
    }
  }

  const runPoll = async (): Promise<void> => {
    await Promise.all([...subscribers].map(async (subscriber) => {
      const controller = new AbortController()
      subscriber.statusAbort = controller
      try {
        const status = await statusWithDeadline(subscriber.path, controller)
        // Worktree membership rides the same change key: `git worktree
        // add/remove` elsewhere never moves the checkout's branch/head, but
        // the worktree manager must still refresh. A failed list keeps the
        // previous digest so a transient error never flaps the stream.
        let worktreeDigest = subscriber.lastWorktreeDigest ?? ''
        try {
          const view = await service.worktrees(subscriber.path, controller.signal)
          if (view !== null) {
            worktreeDigest = view.worktrees.map(item => `${item.path}:${item.branch}:${item.head}`).join(',')
            subscriber.lastWorktreeDigest = worktreeDigest
          }
        } catch {
          // tolerate: the status half still covers branch changes
```

</details>

**依据 13 · 源码核查**：[packages/dsh-git-graph/src/host/git-runner.ts:81-92](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-runner.ts#L81-L92)

每流1MiB cap、宽限与signal。

<details>
<summary>查看原文（12行）</summary>

```text
    async run(argv, cwd, signal) {
      signal?.throwIfAborted()
      const spec = {
        argv: spawnArgv(argv),
        cwd,
        stdio: {
          stdin: 'ignore' as const,
          stdout: { maxBytes: OUTPUT_CAP_BYTES },
          stderr: { maxBytes: OUTPUT_CAP_BYTES },
        },
        graceMs: 10_000,
        signal,
```

</details>

**依据 14 · 源码核查**：[packages/dsh-git-graph/src/client/auto-isolation.ts:75-98](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/auto-isolation.ts#L75-L98)

形状探测失败不安装包装，和包装内部original回调区分。

<details>
<summary>查看原文（24行）</summary>

```text
 */
function probeWorkspaces(navigation: unknown, registry: unknown): WorkspacesPatchTarget | null {
  if (typeof navigation !== 'object' || navigation === null) return null
  if (typeof registry !== 'object' || registry === null) return null
  const nav = navigation as Partial<NavigationPatchTarget>
  const reg = registry as Partial<RegistryPatchTarget>
  if (typeof nav.startSession !== 'function') return null
  if (typeof reg.create !== 'function' || typeof reg.list?.getSnapshot !== 'function') return null
  return { navigation: nav as NavigationPatchTarget, registry: reg as RegistryPatchTarget }
}

/**
 * Install the startSession wrapper on the shared navigation service.
 * @param scope - client context carrying the navigation (`uiWorkspace`) and
 * registry (`workspaces`) faces plus the sessions list.
 * @param git - the /git/* client (config + worktree verbs).
 * @returns the disposer restoring the official method.
 */
export function installAutoIsolation(scope: ClientContext, git: GitApi): () => void {
  const probe = probeWorkspaces(scope.uiWorkspace, scope.workspaces)
  if (probe === null) {
    console.warn(`${TAG} disabled: the uiWorkspace/workspaces service shape changed; using the official new-session behavior`)
    return () => {}
  }
```

</details>

#### 缺口

- 故障重现率、实际宿主方法同步/异步返回与清理成本未知
  **影响**：只能限定人工核实、非关键仓库的手工试用，不能推荐无感自动隔离或自动破坏性清理
  **进一步探讨**：后续获授权后注入每阶段失败/超时、清理ok:false/注销失败/导航失败，读回Git+登记+session cwd，保留副作用清单再人工恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、操作、成本和效果如何支持有限试用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

以下是未来获授权后的采用办法，本轮没有安装、创建worktree、运行目标或实测。建议只用手工GUI入口，在可弃置、无敏感数据且无并发写入的仓库完成一次命名worktree→核新会话→非force清理；保持autoIsolate与agentTool默认关闭。普通终端/IDE的Git工作流是对照和保留的恢复办法。不是让用户为了界面便利开启danger-full-access，也不保证不同cwd能隔离端口、网络、凭据或仓库共享对象。

| 依赖 | 必须成立的条件 | 核查边界 |
|---|---|---|
| DSH/Node与双半区 | manifest DSH>=0.2.1-rc.3、Node ^22.19或>=24；host webServer/subprocess/workspaceRegistry与client slots/sessions/workspaces/connection/locale可用 | 声明和接线已读，真实安装/服务形状未验；不以最低版本声明保证全部兼容 |
| Git与仓库 | Git可执行、真实注册入口、有可解析HEAD及目录权限 | detached/无远端/脏状态有分支条件，worktree不复制未提交内容；原仓库Git配置/hook执行策略未全审 |
| 空间与会话 | $DSH_HOME/worktrees有空间，用户核workspace/session cwd与新wt/分支 | worktree文件树、登记及会话是多阶段，不是一个事务 |
| 可选外部面 | 远程访问额外依赖配对服务；agentTool/autoIsolate需显式开启 | 本次小样均不用；共享认证不是本组件全审结果 |
| 网络与偏好 | 浏览器apply调用共享日报心跳，DNT/本地opt-out/自动化与storage门槛生效 | dsh-market.com端点，随机visitor、包名、可选baked version；成功日标记去重、失败可能重试，不核服务端IP存储承诺 |

| 步骤 | 成功读回 | 失败/退出 |
|---|---|---|
| 先备份并只读对照 | 终端原目录/branch/HEAD、登记和旧会话cwd | 不确定真实目录/有并发或敏感内容则停，不以页面名称猜测 |
| 手工创建命名worktree | 磁盘目标、新wt/分支、workspace登记、新session cwd一致 | UI报错或超时先逐层对账，禁止直接重试/force补偿 |
| 在新会话做同一小任务 | 读回只在预期worktree产生变化、旧会话仍旧cwd | cwd/分支不符立即停写并保存变更，不以“auto开关开着”作隔离证据 |
| 清理与退出 | 无未保存改动，非force remove，确认登记/会话引用；若选删分支再核真实ref | 错误/引用不明保留worktree/分支，人工处置；卸载只释放组件，不当已撤销Git副作用 |

| 成本 | 现金与资源 | 人工及风险 |
|---|---|---|
| 获取/兼容 | 本地包/宿主/Node/Git，当前收费、托管和许可适配成本未知 | SDK形状/slot、跨平台和真实版本需验 |
| 每个worktree | 共享Git对象但另有检出文件、依赖安装/构建与进程资源；未测数值 | 基线、未提交内容、端口/配置与新会话身份需确认 |
| 刷新与网络 | 状态30秒poll、SSE15秒心跳及按日遥测标记；活跃订阅与Git子进程成本未知 | 大仓库卡顿、输出cap和不完整图要对照，单status deadline非总资源cap |
| 恢复/维护 | 异常后登记/分支/目录/会话可能各留状态 | 多阶段读回/备份/人工恢复工时未知，不能把补偿日志当完成 |
| 模型费用 | 普通GUI不需模型；开启可选工具后的token/模型价格与调用量另计 | 不纳入本轮试用，不以工具60秒字段当全部费用/变更停止保证 |

| 效果 | 已检查材料支持 | 尚不能证明的效果/验收 |
|---|---|---|
| 少切终端 | GUI→API→host Git/会话真实链 | 净省时/返工减少须与终端同任务比较 |
| 另一检出开始工作 | 新wt/分支与新workspace/session接线 | 必须读实际cwd；不等完整OS/网络/秘密隔离 |
| 受限删除 | canonical membership、非主检出、默认脏拒绝 | 整体事务恢复、可选branch删成功与并发安全未证 |
| 失败后可知道停在哪 | 现有错误/envelope及部分补偿 | 清理Result忽略、回退主workspace不能当隔离验收 |

只读核到浏览器遥测caller和与已读Skill Explorer同固定版本逐字相同的共享helper；不将“服务端不存IP”文档声明升级为本轮独立验证。只要错目录、隔离降级、清理不确定或恢复工时抵消便利就停止该采用方案，保留已知的终端工作流。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/package.json:1-57](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/package.json#L1-L57)

基础版本、入口与许可证条件。

<details>
<summary>查看原文（57行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-git-graph",
  "description": "External dsh web GUI plugin: a blank-session git branch selector + Git graph, with real host-side git operations and guards, as a dsh profile bundle",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "typecheck": "tsc -b --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
  },
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
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
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
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.d.ts.map",
    "src",
    "cordis.patch.yml",
    "icon.svg"
  ],
  "license": "Apache-2.0",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/index.ts:29-30](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/index.ts#L29-L30)

host required services。

```text
/** Required services: the route registry, the managed subprocess seam, and the workspace registry. */
export const inject = ['webServer', 'subprocess', 'workspaceRegistry']
```

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:52-53](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L52-L53)

client required services。

```text
/** Required services: slots for the dock entry, sessions for the cwd lookup, workspaces for worktree sessions, locale for the copy. */
export const inject = ['slots', 'sessions', 'workspaces', 'connection', 'locale']
```

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/host/config.ts:42-61](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/config.ts#L42-L61)

默认关闭及volatile取实时值。

<details>
<summary>查看原文（20行）</summary>

```text
/** Schemastery schema backing the profile patch values and the generated settings page. */
export const Config: z<ConfigInput, Config> = z.object({
  autoIsolate: z.boolean().default(false).volatile(),
  autoBaseline: z.union(['current', 'default'] as const).default('current').volatile(),
  agentTool: z.boolean().default(false).volatile(),
})

/**
 * Resolve the effective config with schema defaults applied. Volatile fields
 * arrive as live references, so this reads the value the settings subsystem
 * last committed rather than a snapshot taken at mount.
 * @param config - the config the Host handed to the plugin row.
 * @returns the resolved values.
 */
export function effectiveConfig(config?: Config): ResolvedConfig {
  return {
    autoIsolate: config?.autoIsolate?.get() ?? false,
    autoBaseline: config?.autoBaseline?.get() ?? 'current',
    agentTool: config?.agentTool?.get() ?? false,
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:88-90](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L88-L90)

每日心跳真实caller。

```text
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-client-ui-git-graph' }])
```

**依据 6 · 源码核查**：[packages/dsh-git-graph/src/client/telemetry.ts:117-150](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/telemetry.ts#L117-L150)

抑制、payload、成功日标记和失败处理。

<details>
<summary>查看原文（34行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

**依据 7 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:61-81](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/routes.ts#L61-L81)

poll、heartbeat、status deadline和循环寿命。

<details>
<summary>查看原文（21行）</summary>

```text
const POLL_INTERVAL_MS = 30_000
/** SSE keep-alive comment interval (proxies drop idle connections). */
const HEARTBEAT_INTERVAL_MS = 15_000

/**
 * Route-layer deadline for one git status request. On expiry the controller
 * aborts the read path so the subprocess can terminate; the JSON handler keeps
 * the stable envelope and the SSE poll loop can clear its overlap guard.
 */
const STATUS_TIMEOUT_MS = 15_000
const STATUS_TIMEOUT_MESSAGE = 'git status timed out'

/**
 * PollGuard lifetime bound. The SSE loop must live exactly as long as the
 * subscriber set (start on first join, stop on empty), so there is no natural
 * server-side expiry: the deadline is set to a sentinel that never fires and
 * the loop is terminated by {@link PollGuard.stop} when the last subscriber
 * closes. The per-subscriber 15s {@link STATUS_TIMEOUT_MS} deadline is a run
 * bound, unrelated to this loop-lifetime value.
 */
const POLL_LIFETIME_MS = Number.MAX_SAFE_INTEGER
```

</details>

**依据 8 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:165-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L165-L199)

创建/清理的多阶段实际步骤。

<details>
<summary>查看原文（35行）</summary>

```text
        createWorktreeSession: async (sessionId, name, baseRef) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const created = await git.addWorktree(resolved.path, name, baseRef)
          if (!created.ok) return { ok: false, error: created.error }
          // Register the worktree as a workspace and open its blank session;
          // a registration failure rolls the worktree back (no half-made env).
          try {
            const workspace = await scope.workspaces.create({ path: created.value.path })
            // 0.1.2 cohort: workspace-side session launch moved to the sessions
            // face. ISessions.create only adopts the target workspace and
            // resolves the new SessionId; open() is the separate navigation
            // step that selects it (matching the old startSession behavior).
            const createdSessionId = await scope.sessions.create({ workspaceId: workspace.workspaceId })
            // Navigation belongs to the workspace UI since the multi-instance
            // Client Session model; the Session Controller no longer opens one.
            scope.uiWorkspace.openSession(createdSessionId)
          } catch (error: unknown) {
            await git.removeWorktree(resolved.path, created.value.path, { force: true })
            return { ok: false, error: { code: 'internal', message: `workspace registration failed: ${String(error)}` } }
          }
          return { ok: true, path: created.value.path, branch: created.value.branch, name: created.value.name }
        },
        removeWorktree: async (sessionId, worktreePath, opts) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const removed = await git.removeWorktree(resolved.path, worktreePath, opts)
          if (!removed.ok) return { ok: false, error: removed.error }
          // Unregister the linked workspace after the disk removal succeeds,
          // so a rejection never orphans the registration.
          const linked = scope.workspaces.list.getSnapshot().items.find(item => item.path === worktreePath)
          if (linked !== undefined) {
            await scope.workspaces.delete(linked.workspaceId)
          }
          return { ok: true }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:95-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/agent-tool.ts#L95-L125)

当前cwd不迁移、另会话条件。

<details>
<summary>查看原文（31行）</summary>

```text
    timeoutMs: 60_000,
    async execute(args: unknown, exec) {
      const input = (typeof args === 'object' && args !== null ? args : {}) as ToolArgs
      const cwd = callingCwd(exec)
      if (cwd === undefined) {
        return { ok: false, code: 'workspace-unknown', message: 'git_worktree needs a calling session with a project cwd' }
      }
      switch (input.action) {
        case 'list': {
          const view = await service.worktrees(cwd, exec.signal)
          if (view === null) return { ok: false, code: 'workspace-unknown', message: 'not a git workspace' }
          return { ok: true, root: view.root, worktrees: view.worktrees }
        }
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

#### 缺口

- 市场收费、实际工时/磁盘峰值/兼容和真实用户频次未获取
  **影响**：采用仅限可回退人工小样，不能宣称低成本、普遍增效或生产隔离
  **进一步探讨**：记录终端与GUI对照的错目录/失败恢复分钟、额外副本大小和继续使用意愿；读回任一层失败即停用，不扩大自动化。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 有什么可证伪的插件改进方向，何时不应另造产品？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是“新会话隔离成立回执与失败状态对账”。不是重新实现Git/worktree，也不是再加一个worktree列表；现有版本已经有canonical门卫、托管目录、主检出/默认脏拒绝、部分注册失败补偿与默认关闭的自动化，README也承认失败回退。真实增量要针对清理Result未核、手工链登记/会话残留、工具链登记失败无同等补偿，以及自动隔离回退后用户不能把开关当实际cwd证明。

候选可先作为本插件小补丁：操作ID和具体阶段绑定仓库canonical root、目标worktree/分支、workspace/session标识；Git、登记、session创建及最终cwd分别读回，只有三层匹配才显示ready。失败显示已完成/未完成/未知，回退原工作区明确提示并在继续写前要求用户选择；不把clear日志或Result返回当恢复成立。未知时先对账、不重放create/remove、不自动force删除可能已有新内容的目录。分支清理和workspace注销分别报告，不能一颗绿勾遮蔽后续失败。

最小对照包括：①Git创建后登记失败；②登记后session失败；③session后导航失败/异步拒绝；④清理返回ok:false及注销失败；⑤传输中断后实际落盘未知；⑥auto隔离失败回到原cwd。保持同一固定Git/宿主版本、同一可弃置仓库与任务，对比当前GUI、简单“人工先核cwd+终端对账清单”及阶段回执补丁。观察错目录写入、重复/误清理、残留状态识别率、恢复人工分钟和正常路径额外点击/延迟；不以回执数量或模拟器通过代替真实回读。真实数据及故障实验尚无，不能宣称已减少错误。

若一个失败提示与cwd回读小补丁/人工清单已足够，或用户没有频繁并行/失败恢复需求，或回执维护比现有步骤更费时，应否定独立插件产品，只向原组件修补。只有实际用户反复需要跨阶段恢复、清单长期漏项且增量能稳定减少错写/返工，才继续独立方向；当前未证明付费意愿、组织流程变化或市场需求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/client/index.ts:165-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/index.ts#L165-L199)

手工创建/清理需要分阶段对账。

<details>
<summary>查看原文（35行）</summary>

```text
        createWorktreeSession: async (sessionId, name, baseRef) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const created = await git.addWorktree(resolved.path, name, baseRef)
          if (!created.ok) return { ok: false, error: created.error }
          // Register the worktree as a workspace and open its blank session;
          // a registration failure rolls the worktree back (no half-made env).
          try {
            const workspace = await scope.workspaces.create({ path: created.value.path })
            // 0.1.2 cohort: workspace-side session launch moved to the sessions
            // face. ISessions.create only adopts the target workspace and
            // resolves the new SessionId; open() is the separate navigation
            // step that selects it (matching the old startSession behavior).
            const createdSessionId = await scope.sessions.create({ workspaceId: workspace.workspaceId })
            // Navigation belongs to the workspace UI since the multi-instance
            // Client Session model; the Session Controller no longer opens one.
            scope.uiWorkspace.openSession(createdSessionId)
          } catch (error: unknown) {
            await git.removeWorktree(resolved.path, created.value.path, { force: true })
            return { ok: false, error: { code: 'internal', message: `workspace registration failed: ${String(error)}` } }
          }
          return { ok: true, path: created.value.path, branch: created.value.branch, name: created.value.name }
        },
        removeWorktree: async (sessionId, worktreePath, opts) => {
          const resolved = pathOf(sessionId)
          if (!resolved.ok) return { ok: false, error: resolved.error }
          const removed = await git.removeWorktree(resolved.path, worktreePath, opts)
          if (!removed.ok) return { ok: false, error: removed.error }
          // Unregister the linked workspace after the disk removal succeeds,
          // so a rejection never orphans the registration.
          const linked = scope.workspaces.list.getSnapshot().items.find(item => item.path === worktreePath)
          if (linked !== undefined) {
            await scope.workspaces.delete(linked.workspaceId)
          }
          return { ok: true }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/client/auto-isolation.ts:173-199](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/client/auto-isolation.ts#L173-L199)

已有补偿、结果未确认和原workspace回退。

<details>
<summary>查看原文（27行）</summary>

```text
      let registeredId: string | undefined
      try {
        const workspace = await registry.create({ path: created.value.path })
        registeredId = workspace.workspaceId
        original.call(navigation, workspace.workspaceId)
      } catch (error) {
        // Roll back the half-created environment rather than leaking it: drop
        // the registration just made, then the worktree directory. Without the
        // registration step the list would keep an entry pointing at a path we
        // are about to delete.
        if (registeredId !== undefined && typeof registry.delete === 'function') {
          try {
            await registry.delete(registeredId)
          } catch (cleanupError) {
            console.warn(`${TAG} could not drop the failed workspace registration`, cleanupError)
          }
        }
        await git.removeWorktree(item.path, created.value.path, { force: true })
        console.warn(`${TAG} workspace registration failed; rolled back the worktree`, error)
        original.call(navigation, target)
      }
    })().catch((error: unknown) => {
      console.warn(`${TAG} routing failed; using the official behavior`, error)
      original.call(navigation, target)
    }).finally(() => {
      routing.delete(target)
    })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/agent-tool.ts:110-139](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/agent-tool.ts#L110-L139)

工具登记与删除后注销链。

<details>
<summary>查看原文（30行）</summary>

```text
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
          }
        }
        case 'remove': {
          if (typeof input.worktreePath !== 'string' || input.worktreePath === '') {
            return { ok: false, code: 'invalid-worktree-name', message: 'remove requires worktreePath' }
          }
          const result = await service.removeWorktree(cwd, input.worktreePath, {
            force: input.force === true,
            deleteBranch: input.deleteBranch === true,
          })
          if (!result.ok) return { ok: false, code: result.error.code, message: result.error.message }
          const linked = ctx.workspaceRegistry.list().find(item => item.path === input.worktreePath)
          if (linked !== undefined) await ctx.workspaceRegistry.delete(linked.id)
          return { ok: true, removed: input.worktreePath }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:424-430](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/src/host/git-service.ts#L424-L430)

branch清理退出码忽略。

```text
    const removed = await this.runner.run(worktreeRemoveArgv(canonical, opts.force === true), root)
    if (removed.exitCode !== 0) {
      return { ok: false, error: { code: 'internal', message: removed.stderr.trim() || 'git worktree remove failed' } }
    }
    if (opts.deleteBranch === true && entry.branch.startsWith(WORKTREE_BRANCH_PREFIX)) {
      await this.runner.run(branchDeleteForceArgv(entry.branch), root)
    }
```

**依据 5 · 源码核查**：[packages/dsh-git-graph/README.zh.md:74-82](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-git-graph/README.zh.md#L74-L82)

现有功能与明确降级基线。

```text
- **在 worktree 中开始新会话…** 打开对话框：命名 worktree 并选择基线分支（默认预填当前分支）。host 在 `$DSH_HOME/worktrees/<repo-key>/<名称>/` 创建 worktree，携带新分支 `wt/<名称>`（git 不允许同一分支两处检出），随即注册为 workspace 并打开其空白会话。当前检出不受影响。
- **管理 worktree…** 列出仓库的全部链接 worktree（分支/HEAD）。托管的 worktree 可删除：有未提交更改时先拒绝一次，随后给出行内强制确认；`wt/` 分支默认保留，勾选该行的“同时删除分支”才会一并删除。主检出行只读。

插件设置卡里有两个开关（默认都关闭）：

- **自动隔离**（`autoIsolate`）：git 工作区的“新会话”动作会静默创建全新托管 worktree 并在其中开会话——Claude 桌面版式的自动形态。`autoBaseline` 选择基线：当前检出 HEAD（`current`）或远程默认分支（`default`，解析为 `origin/HEAD`，无远程时回退 HEAD）。已在托管目录下的工作区不会被二次隔离；任何失败都降级回官方新会话行为。实现上是浏览器半区对 workspaces 服务的运行时包装（形状探测过的 patch，不改 DSH 源码）——SDK 升级若改变该服务形状，功能自动关闭并打印诊断，不会硬崩。
- **Agent 工具**（`agentTool`）：注册模型可见的 `git_worktree` 工具（对同一托管目录做 create/list/remove，以调用会话的 cwd 做工作区门卫）。这是对“git 能力不进模型可见面”既定规则的有意豁免，仅对开启者生效。注意沙盒边界：会话 cwd 不可变，当前会话无法迁入 worktree；workspace-write 沙盒下 agent 也不能写会话根之外——所以 `create` 会同时把 worktree 注册成 workspace，工具回复会提示模型在其上开新会话。danger-full-access 模式下 agent 可直接在返回路径里工作。

删除只针对仓库托管目录的直接子级（双侧 canonical 路径包含校验），且在磁盘删除成功后才注销关联的 workspace。
```

#### 缺口

- 回执机制未实现、没有用户需求/故障对照与商业效果数据
  **影响**：不能把源码失败窗口直接当独立产品机会或声称已获收益
  **进一步探讨**：先用原组件最小提示/读回补丁与人工清单做真实小样；以错目录、残留识别、恢复分钟和维护负担决定继续或否定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
