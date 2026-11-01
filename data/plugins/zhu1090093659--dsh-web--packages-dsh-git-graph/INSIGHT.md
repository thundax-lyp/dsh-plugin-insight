# DSH Git Graph

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 104,603](https://img.shields.io/static/v1?label=npm+30d&message=104%2C603&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-git-graph)
<!-- END META -->

> **功能**：在 DSH Web 中展示 Git 分支与提交图，并提供工作树管理入口。

> **亮点**：[Q02](#research-q02) 把 Git 状态和分支操作接入 DSH 界面，并对工作区和分支执行前置检查；仓库数据与 Git 语义仍由上游决定。

> **主要限制**：[Q03](#research-q03) 显示部分守卫判断未检查探测退出码，分支删除结果也未核；界面成功不能代替回读实际仓库。

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
  - [Q01 · 用户、类型和依赖是什么？](#detail-section-11)
  - [Q02 · 浏览或操作如何从界面到 Git 执行？](#detail-section-12)
  - [Q03 · 工作区、并发和错误有哪些边界？](#detail-section-13)
  - [Q04 · 成本、效果及假设是什么？](#detail-section-14)
  - [Q05 · 谁可试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要在 DSH 工作区查看分支及历史的 Git 用户；合格操作需要保留工作并确认磁盘状态。

用户可以直接使用 Git 命令或既有图形客户端；本轮未对照操作时间和误操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 提交图与分支查看 | 浏览仓库历史 | 需要注册的 Git 工作区 |
| 分支切换 | 切换仓库工作树的分支 | 影响该工作区所有会话；需回读状态 |
| 托管工作树管理 | 创建、列出或删除托管工作树 | 可选；强制删除及分支删除有数据副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH、WebServer、subprocess、workspaceRegistry | 必需 | 注册路由并执行 Git | 插件能力无法正常挂载 |
| Git 与已注册工作区 | 仓库操作必需 | 检查与修改目标仓库 | 拒绝或返回错误 |
| 备份和清楚的仓库状态 | 写操作前必要的使用条件 | 核对和恢复工作 | 失败后可能无法找回未保存内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户保留未提交工作并选测试仓库 | 可以恢复初始状态 |
| 浏览 | 用户打开空白会话的分支和图谱 | 与 Git 状态核对 |
| 操作 | 用户确认目标并执行允许的切换 | 回读磁盘、分支和会话 |
| 异常 | 用户停止并人工检查 | 确认仓库、分支和备份后再操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主与 Git 资源 | 配置、备份和核对范围 | 时间未知 |
| 持续使用 | Git 进程与状态读取 | 核对共享仓库变化 | 节时未测 |
| 失败恢复 | 备份及可能的重建空间 | 回读文件、分支和工作树 | 恢复时间和成功率未知 |
| 退出 | 保留备份空间 | 手工核对 Git 状态 | 不自动撤销已执行的命令 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 图谱和切换 | 路由和 Git 命令路径 | 真实 UI 与宿主兼容 |
| 操作保护 | 工作区及部分 Git 前置检查 | 并发或命令失败时的完整安全 |

> **思考**：[Q03](#research-q03) 显示部分守卫判断未检查探测退出码，分支删除结果也未核；界面成功不能代替回读实际仓库。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把 Git 状态和分支操作接入 DSH 界面，并对工作区和分支执行前置检查；仓库数据与 Git 语义仍由上游决定。

[Q02](#research-q02) 参数数组和工作区门控限定部分执行范围；[Q03](#research-q03) 表明检查失败与删除分支回读仍有重要边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示部分守卫判断未检查探测退出码，分支删除结果也未核；界面成功不能代替回读实际仓库。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议先在独立测试仓库只读观察，写操作前保留工作并核对目标；状态不明时停止并使用 Git 回读。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持图谱与真实 Git 命令集成；真实宿主、并发和恢复结果未验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-git-graph/README.md、packages/dsh-git-graph/README.zh.md、packages/dsh-git-graph/package.json、packages/dsh-git-graph/src/index.ts、packages/dsh-git-graph/src/client/api.ts、packages/dsh-git-graph/src/host/routes.ts、packages/dsh-git-graph/src/host/git-service.ts、packages/dsh-git-graph/src/host/git-runner.ts、packages/dsh-git-graph/src/core/git-command.ts 及固定范围 inventory；组件：packages/dsh-git-graph。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查该子包的分支切换、工作区门控和托管工作树删除关键路径；未执行目标命令或审计全部 UI 与配对服务。
- 下一步：在隔离仓库验证受信访问、分支切换、守卫失败与删除后的真实状态；本次不创建工作树或执行目标代码。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设展示受影响会话并在操作后回读状态可减少错目标和伪成功，须以隔离仓库比较错误和时间，尚未验证。

在隔离仓库验证受信访问、分支切换、守卫失败与删除后的真实状态；本次不创建工作树或执行目标代码。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 289 | — | — | 6062 |
| .ts | source | 29 | 4034 | 2531 | 1232 | — |
| .tsx | source | 7 | 1245 | 951 | 211 | — |
| .ts | test | 12 | 2740 | 2148 | 297 | — |
| .tsx | test | 2 | 986 | 780 | 112 | — |
| .md | example | 1 | 64 | — | — | 473 |

</details>

**活跃度**

[![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 内 Git 图谱与工作区管理如何接线，什么条件下可安全查看和操作仓库。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户、类型和依赖是什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

这是 DSH Web 插件，为 Git 工作区的空白会话提供分支选择和提交图，并提供托管工作树管理。包声明 DSH 至少 0.2.1-rc.3，Host 注入 WebServer、subprocess 和 workspaceRegistry，实际 Git 命令依赖宿主能运行 Git。合格操作需要确认正确仓库和分支，保留未提交数据并核对实际磁盘状态；界面出现不代表操作安全。Agent 工作树工具和自动隔离是可选功能，作者说明默认关闭。本次只研究源码，没有创建工作树、切换分支或启动插件。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/package.json:1-45](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/package.json#L1-L45)

子包版本、宿主和 Web 客户端。

<details>
<summary>查看原文（45行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-git-graph",
  "description": "External dsh web GUI plugin: a blank-session git branch selector + Git graph, with real host-side git operations and guards, as a dsh profile bundle",
  "version": "0.4.13",
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
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/index.ts:23-30](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L23-L30)

Host 服务依赖。

```text
import { GitService, subprocessRunner, type WorkspaceGate } from './host/git-service.ts'
import { registerGitRoutes } from './host/routes.ts'
import { buildWorktreeTool } from './host/agent-tool.ts'
import { worktreesHome } from './host/worktree-home.ts'
import { mountOnce } from './mount-once.ts'

/** Required services: the route registry, the managed subprocess seam, and the workspace registry. */
export const inject = ['webServer', 'subprocess', 'workspaceRegistry']
```

**依据 3 · 作者声明**：[packages/dsh-git-graph/README.zh.md:14-20](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/README.zh.md#L14-L20)

界面范围与工作区级切换。

```text
  <strong>DeepSeek Harness（DSH）官方 Web GUI 与桌面客户端专属 Git 可视化与多任务工作区隔离系统</strong><br>
  <em>交互式 Git 提交图谱 · 空白会话分支快速切换 · Git Worktree 隔离防冲突 · 零侵入代码隔离 · 安全冲突守卫</em>
</p>

外部 DeepSeek Harness（DSH）Web GUI 与官方桌面客户端插件：**Git 分支选择器**与**交互式 Git 提交历史图谱**面板。分支选择器只在空白会话显示，挂在 shell 的 composer dock（`conversation.input.dock`，每个随发行 shell 都声明的 seam）上；在其空白会话 hero 相位，chip 会提升进官方 hero 行，紧贴 agent-preset 座位右侧，采用与官方工作区/预设胶囊一致的透明 28px 胶囊配方和 `--dsw-*` 主题 token。active 会话不提供分支选择控件。Git 能力在 host 进程执行（磁盘工作树 `git switch`），UI 在浏览器 React；工作区选择保留官方入口。

行为对齐 ZCode 的 `GitBranchSwitcher`：可搜索弹层、当前项打勾、「创建并检出新分支… / Git 图谱」底部操作、切换守卫（未解决冲突 / 进行中操作 / 目标分支被其他 worktree 检出）与可读报错。
```

**依据 4 · 作者声明**：[packages/dsh-git-graph/README.zh.md:70-80](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/README.zh.md#L70-L80)

可选工作树和模型工具。

<details>
<summary>查看原文（11行）</summary>

```text
## Worktree 隔离

分支弹层底部有两个 worktree 入口（worktree 是共享仓库历史、但文件与分支各自独立的链接检出，并行会话互不触碰对方的工作树）：

- **在 worktree 中开始新会话…** 打开对话框：命名 worktree 并选择基线分支（默认预填当前分支）。host 在 `$DSH_HOME/worktrees/<repo-key>/<名称>/` 创建 worktree，携带新分支 `wt/<名称>`（git 不允许同一分支两处检出），随即注册为 workspace 并打开其空白会话。当前检出不受影响。
- **管理 worktree…** 列出仓库的全部链接 worktree（分支/HEAD）。托管的 worktree 可删除：有未提交更改时先拒绝一次，随后给出行内强制确认；`wt/` 分支默认保留，勾选该行的“同时删除分支”才会一并删除。主检出行只读。

插件设置卡里有两个开关（默认都关闭）：

- **自动隔离**（`autoIsolate`）：git 工作区的“新会话”动作会静默创建全新托管 worktree 并在其中开会话——Claude 桌面版式的自动形态。`autoBaseline` 选择基线：当前检出 HEAD（`current`）或远程默认分支（`default`，解析为 `origin/HEAD`，无远程时回退 HEAD）。已在托管目录下的工作区不会被二次隔离；任何失败都降级回官方新会话行为。实现上是浏览器半区对 workspaces 服务的运行时包装（形状探测过的 patch，不改 DSH 源码）——SDK 升级若改变该服务形状，功能自动关闭并打印诊断，不会硬崩。
- **Agent 工具**（`agentTool`）：注册模型可见的 `git_worktree` 工具（对同一托管目录做 create/list/remove，以调用会话的 cwd 做工作区门卫）。这是对“git 能力不进模型可见面”既定规则的有意豁免，仅对开启者生效。注意沙盒边界：会话 cwd 不可变，当前会话无法迁入 worktree；workspace-write 沙盒下 agent 也不能写会话根之外——所以 `create` 会同时把 worktree 注册成 workspace，工具回复会提示模型在其上开新会话。danger-full-access 模式下 agent 可直接在返回路径里工作。
```

</details>

#### 缺口

- 当前宿主和 Git 版本下界面、守卫与实际仓库状态
  **影响**：影响是否可安全使用
  **进一步探讨**：在独立测试仓库核对命令和结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 浏览或操作如何从界面到 Git 执行？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host apply 创建带工作区门控的 GitService 并注册 /git 路由；客户端 switchBranch 将路径和分支通过同源 POST 发送。路由先验证访问、POST 与 JSON，再调用 service.switchBranch。service 将路径规范化并要求它匹配已注册工作区，定位仓库根、检查分支格式和存在性、当前分支及冲突/进行中操作/其他工作树占用后，通过宿主 subprocess 执行 git switch；命令返回后映射成功或错误。相对手动终端查看与切换，它将状态和操作集中到会话界面并增加前置检查；切换作用于真实仓库而不是仅切换当前会话，Git 自身与共享仓库语义仍是基础。未验证实际 UI 或命令执行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/index.ts:53-70](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L53-L70)

canonical 路径须匹配已注册工作区。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/index.ts:81-85](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L81-L85)

创建带门控的 Git 服务。

```text
export const apply = mountOnce('@linxin666/dsh-client-ui-git-graph', applyImpl)

function applyImpl(ctx: Context, config?: Config): void {
  const service = new GitService(subprocessRunner(ctx), createWorkspaceGate(ctx))

```

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/index.ts:124-132](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L124-L132)

注册路由。

```text
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

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/client/api.ts:30-46](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/client/api.ts#L30-L46)

客户端 POST 与错误映射。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/client/api.ts:59-66](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/client/api.ts#L59-L66)

分支切换请求。

```text
  /** Local branch list with the current branch marked. */
  branches(path: string): Promise<ApiResult<BranchesView | null>> {
    return post('git/branches', { path })
  }

  /** Workspace-level `git switch --no-guess <branch>` (host guards first). */
  switchBranch(path: string, branch: string): Promise<ApiResult<{ branch: string }>> {
    return post('git/switch', { path, branch })
```

**依据 6 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:195-215](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/routes.ts#L195-L215)

访问、方法和 JSON 检查。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[packages/dsh-git-graph/src/host/routes.ts:254-264](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/routes.ts#L254-L264)

路由调用切换服务。

<details>
<summary>查看原文（11行）</summary>

```text
      case '/git/switch': {
        const branch = typeof payload === 'object' && payload !== null
          ? (payload as Record<string, unknown>).branch
          : undefined
        if (typeof branch !== 'string' || branch === '') {
          writeJson(res, 200, FAIL(BAD_REQUEST))
          return
        }
        const result = await service.switchBranch(path, branch)
        writeJson(res, 200, result.ok ? OK({ branch: result.branch }) : FAIL(isGitError(result.error) ? result.error : MALFORMED_VIEW))
        return
```

</details>

**依据 8 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:216-236](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L216-L236)

工作区、引用及检查后执行切换。

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

**依据 9 · 源码核查**：[packages/dsh-git-graph/src/core/git-command.ts:70-76](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/core/git-command.ts#L70-L76)

Git switch 参数。

```text
export const checkRefFormatArgv = (name: string): string[] => ['check-ref-format', '--branch', name]

/** `git switch --no-guess -- <branch>` — workspace-level branch switch (ZCode semantics). */
export const switchArgv = (branch: string): string[] => ['switch', '--no-guess', '--', branch]

/** `git switch --no-guess -c <name>` — create from current HEAD and switch. */
export const createBranchArgv = (name: string): string[] => ['switch', '--no-guess', '-c', name]
```

**依据 10 · 源码核查**：[packages/dsh-git-graph/src/host/git-runner.ts:71-92](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-runner.ts#L71-L92)

宿主 subprocess 构造参数与输出上限。

<details>
<summary>查看原文（22行）</summary>

```text
export function subprocessRunner(ctx: { subprocess: SubprocessServiceLike }, options: GitRunnerOptions = {}): GitRunner {
  const spawnArgv = options.spawnArgv ?? ((argv) => ['git', ...argv])
  const degrade = options.failureMode === 'degrade'
  const errorTag = options.errorTag ?? 'git'
  const failure = (prefix: string, error: unknown): GitRunResult => ({
    exitCode: 127,
    stdout: '',
    stderr: prefix + (error instanceof Error ? error.message : String(error)),
  })
  return {
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

#### 缺口

- 目标宿主上的路径身份、切换与失败结果
  **影响**：影响是否能安全作用于预期仓库
  **进一步探讨**：在独立测试仓库逐步核对命令和磁盘状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 工作区、并发和错误有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

切换会改仓库磁盘工作树，影响使用该工作区的其他会话；检查后到 git 命令之间状态仍可能变化，不能当作跨进程事务。guardBlock 读取冲突、操作标记和 worktree 列表，但当前分支中没有检查冲突与列表命令的退出码，故命令失败时空输出不能证明检查充分，具体后果仍须实际验证。托管 worktree 删除通过 canonical 目录和 Git 列表、主工作树及脏状态检查；force 会绕过脏状态检查。删除后选择删除 wt 分支时，源码调用分支强制删除却不检查其结果，返回成功只表明 worktree 删除成功，分支需另查。回环或配对门控与工作区限定是局部保护，不能证明全环境安全。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-git-graph/README.zh.md:89-96](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/README.zh.md#L89-L96)

工作区级切换和访问边界。

```text
## 设计要点

- 边界与加载链调研、关键决策见 [docs/ADR-001-plugin-boundary.md](docs/ADR-001-plugin-boundary.md)。
- host half 的 `/git/*` 只接受已注册 workspace 的路径（realpath 校验）与受信任客户端（loopback socket + loopback Host，与 dsh-ssh 相同的 fence，同时装了 `dsh-remote-web-ui` 时有效的已配对设备 cookie 也是放行路径）；浏览器无法对任意目录执行 git，LAN 暴露的 dsh web 对未配对的非 loopback 客户端返回 403。
- 切换语义是工作区级：`git switch --no-guess <branch>` 作用于 repoRoot 磁盘树，影响该工作区所有会话；项目切换 = 激活目标工作区并打开其（复用或新建的）空白会话，不给既有会话换 cwd。
- 挂载 seam：`conversation.input.dock`，即 shell 为自己的队列 dock 与 todo dock 声明的 composer dock。注册经 `slots.inject` 等待该声明（裸 `register` 对未声明槽位会被拒绝），没有第二个座位。分支胶囊只在空白会话显示；无会话 cwd、非 Git 工作区或会话不再空白时自行隐藏。此时 chip 重新定位到官方 hero 行 agent-preset 座位右侧（官方 2px 行间距、垂直居中，胶囊尺寸与 token 对齐官方工作区/预设胶囊），弹层向下打开、对齐官方工作区菜单。React 会把 portal 子节点追加到该行末尾，因此 chip 随后把自己插到行尾 options 组之前——该组以 `margin-left: auto` 顶到右边缘；没有这一步，chip 会落在输入卡片右上角而不是预设胶囊旁边。active 会话没有分支选择控件。
- 工作区选择不在此插件内：官方工作区胶囊（`conversation.input.selector.workspace`）是唯一入口，本插件只提供 git 分支上下文。
- 分支状态刷新：空白会话 chip 挂载、弹层打开、切换成功后拉取，加上 host SSE（`/git/events`，订阅期间每 30s 轮询 workspace 状态，单次探测有 15s 超时兜底，挂起的 git 不会卡死推送流）推送外部变更和 window focus 刷新（5s 节流）。active 会话不订阅。SSE 流经跨标签页选主中继共享（Web Locks + BroadcastChannel），同一 URL 全浏览器只保留一条流，多开标签页不会挤占同源 HTTP 连接池（#383）。
```

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:485-499](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L485-L499)

守卫依据输出判断，未检查相应退出码。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:367-412](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L367-L412)

删除前 canonical 目录、列表和主工作树检查。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:414-431](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L414-L431)

force 和分支删除结果处理。

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

**依据 5 · 源码核查**：[packages/dsh-git-graph/src/index.ts:53-70](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/index.ts#L53-L70)

工作区 gate。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

#### 缺口

- 守卫命令失败、并发修改及删除分支失败时的用户可见结果
  **影响**：影响是否可相信成功或拒绝提示
  **进一步探讨**：以隔离仓库构造失败并回读 worktree、分支及文件状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本、效果及假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

初次使用需要匹配 DSH、Git 和受信任的工作区，先备份并理解真实磁盘写入；持续使用需观察工作区、会话和共享仓库状态。失败后需要人工检查工作树、分支及残留，force 或同时删除分支会增加恢复负担。没有同一任务的操作时间、冲突率和恢复成本数据，不能断言图谱或隔离降低冲突。可提出未验证假设：显示将受影响的工作区和当前所有会话，并在执行后回读分支与 worktree 删除结果，可减少错误目标或伪成功；这增加界面复杂度和检查成本。比较相同隔离仓库任务的目标识别、错误操作率、人工时间，若无改善或状态经常过期则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:216-236](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L216-L236)

真实仓库切换及状态检查。

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

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:414-431](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L414-L431)

强制删除及分支结果边界。

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

**依据 3 · 作者声明**：[packages/dsh-git-graph/README.zh.md:89-96](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/README.zh.md#L89-L96)

共享工作区作用范围。

```text
## 设计要点

- 边界与加载链调研、关键决策见 [docs/ADR-001-plugin-boundary.md](docs/ADR-001-plugin-boundary.md)。
- host half 的 `/git/*` 只接受已注册 workspace 的路径（realpath 校验）与受信任客户端（loopback socket + loopback Host，与 dsh-ssh 相同的 fence，同时装了 `dsh-remote-web-ui` 时有效的已配对设备 cookie 也是放行路径）；浏览器无法对任意目录执行 git，LAN 暴露的 dsh web 对未配对的非 loopback 客户端返回 403。
- 切换语义是工作区级：`git switch --no-guess <branch>` 作用于 repoRoot 磁盘树，影响该工作区所有会话；项目切换 = 激活目标工作区并打开其（复用或新建的）空白会话，不给既有会话换 cwd。
- 挂载 seam：`conversation.input.dock`，即 shell 为自己的队列 dock 与 todo dock 声明的 composer dock。注册经 `slots.inject` 等待该声明（裸 `register` 对未声明槽位会被拒绝），没有第二个座位。分支胶囊只在空白会话显示；无会话 cwd、非 Git 工作区或会话不再空白时自行隐藏。此时 chip 重新定位到官方 hero 行 agent-preset 座位右侧（官方 2px 行间距、垂直居中，胶囊尺寸与 token 对齐官方工作区/预设胶囊），弹层向下打开、对齐官方工作区菜单。React 会把 portal 子节点追加到该行末尾，因此 chip 随后把自己插到行尾 options 组之前——该组以 `margin-left: auto` 顶到右边缘；没有这一步，chip 会落在输入卡片右上角而不是预设胶囊旁边。active 会话没有分支选择控件。
- 工作区选择不在此插件内：官方工作区胶囊（`conversation.input.selector.workspace`）是唯一入口，本插件只提供 git 分支上下文。
- 分支状态刷新：空白会话 chip 挂载、弹层打开、切换成功后拉取，加上 host SSE（`/git/events`，订阅期间每 30s 轮询 workspace 状态，单次探测有 15s 超时兜底，挂起的 git 不会卡死推送流）推送外部变更和 window focus 刷新（5s 节流）。active 会话不订阅。SSE 流经跨标签页选主中继共享（Web Locks + BroadcastChannel），同一 URL 全浏览器只保留一条流，多开标签页不会挤占同源 HTTP 连接池（#383）。
```

#### 缺口

- 单个合格任务的人工时间和冲突恢复成本
  **影响**：无法判断是否比终端操作更经济
  **进一步探讨**：同一测试仓库比较任务结果、操作时间和回退成本

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用、何时退出？

**研究主题**：采用判断

#### 完整回答

理解 Git 并能保留未提交工作的人，可先在独立测试仓库只读查看图谱，再单独验证切换后磁盘与会话状态。插件相对命令行集中展示和前置检查，但不会让仓库级操作变成会话私有，也不能保证每个失败分支已被正确报告。目标或状态不清、守卫命令异常、worktree 删除成功但分支仍存在时应停止后续写入，使用 Git 手工核对状态与备份；本研究及当前仓库不创建工作树。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:216-236](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L216-L236)

切换真实仓库并检查目标。

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

**依据 2 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:485-499](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L485-L499)

守卫依赖命令输出。

<details>
<summary>查看原文（15行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-git-graph/src/host/git-service.ts:424-431](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/src/host/git-service.ts#L424-L431)

分支删除未校验结果。

```text
    const removed = await this.runner.run(worktreeRemoveArgv(canonical, opts.force === true), root)
    if (removed.exitCode !== 0) {
      return { ok: false, error: { code: 'internal', message: removed.stderr.trim() || 'git worktree remove failed' } }
    }
    if (opts.deleteBranch === true && entry.branch.startsWith(WORKTREE_BRANCH_PREFIX)) {
      await this.runner.run(branchDeleteForceArgv(entry.branch), root)
    }
    return { ok: true }
```

**依据 4 · 作者声明**：[packages/dsh-git-graph/README.zh.md:89-94](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-git-graph/README.zh.md#L89-L94)

切换共享工作区语义。

```text
## 设计要点

- 边界与加载链调研、关键决策见 [docs/ADR-001-plugin-boundary.md](docs/ADR-001-plugin-boundary.md)。
- host half 的 `/git/*` 只接受已注册 workspace 的路径（realpath 校验）与受信任客户端（loopback socket + loopback Host，与 dsh-ssh 相同的 fence，同时装了 `dsh-remote-web-ui` 时有效的已配对设备 cookie 也是放行路径）；浏览器无法对任意目录执行 git，LAN 暴露的 dsh web 对未配对的非 loopback 客户端返回 403。
- 切换语义是工作区级：`git switch --no-guess <branch>` 作用于 repoRoot 磁盘树，影响该工作区所有会话；项目切换 = 激活目标工作区并打开其（复用或新建的）空白会话，不给既有会话换 cwd。
- 挂载 seam：`conversation.input.dock`，即 shell 为自己的队列 dock 与 todo dock 声明的 composer dock。注册经 `slots.inject` 等待该声明（裸 `register` 对未声明槽位会被拒绝），没有第二个座位。分支胶囊只在空白会话显示；无会话 cwd、非 Git 工作区或会话不再空白时自行隐藏。此时 chip 重新定位到官方 hero 行 agent-preset 座位右侧（官方 2px 行间距、垂直居中，胶囊尺寸与 token 对齐官方工作区/预设胶囊），弹层向下打开、对齐官方工作区菜单。React 会把 portal 子节点追加到该行末尾，因此 chip 随后把自己插到行尾 options 组之前——该组以 `margin-left: auto` 顶到右边缘；没有这一步，chip 会落在输入卡片右上角而不是预设胶囊旁边。active 会话没有分支选择控件。
```

#### 缺口

- 具体宿主和仓库中的写入、回读及恢复
  **影响**：影响能否安全用于正式工作
  **进一步探讨**：独立测试仓库按实际状态逐步核验

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
