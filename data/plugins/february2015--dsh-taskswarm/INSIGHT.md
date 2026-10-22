# dsh-taskswarm

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[032e2c9](https://github.com/february2015/dsh-taskswarm/tree/032e2c9d228c20cab65fe0ea061d78a7c753ab8c)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm)
<!-- END META -->

> **实现功能**：为DSH按任务包依赖分波并行调度worker，以Git worktree、检查点、状态/邮箱和review/merge流程集成代码产出。

> **核心亮点**：把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](#research-q01)、[Q03](#research-q03)。

> **风险与缺陷**：默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](#research-q04)、[Q05](#research-q05)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 什么任务适合蜂群，增量与上游如何区分？](#detail-section-11)
  - [Q02 · 依赖分波和lane隔离到什么程度？](#detail-section-12)
  - [Q03 · 检查点、状态和恢复是否等于无损事务？](#detail-section-13)
  - [Q04 · Reviewer与合并是否构成最终质量门？](#detail-section-14)
  - [Q05 · 权限、dashboard与安装有哪些前提？](#detail-section-15)
  - [Q06 · 三阶段成本与预期效果怎样区分？](#detail-section-16)
  - [Q07 · 推荐与进一步探索从何入手？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合有Git仓库、能把目标拆成明确PROMPT/STATUS任务包、依赖与完成条件的多步骤代码工作。基线手工subagent+分支/worktree+PR/CI，由人跟踪交接；插件将任务外置、按波次启动lane、保检查点/状态/邮箱、串行集成到taskswarm/orch，用户再integrate到当前分支。单次咨询/高度耦合任务可能不值得这层管理。

TaskPlane是明确MIT移植参照，wave/worktree/git/mailbox并非本项目新发明，增量是DSH-native agent/工具/会话supervisor适配与生命周期恢复。合格产物应是满足任务条件且有最终代码验收的集成提交，merged/绿色dashboard只是调度状态。把操作者从逐工人盯守转向任务定义/异常处置是有依据的业务推断，是否减少总负担没有对照。

手工subagent+任务说明/PR/CI/worktree；上游TaskPlane提供主要编排参照，DSH原生适配不自称新调度算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 任务包/wave | 外置目标/依赖并发 | 未知依赖和环不硬阻 |
| worktree/checkpoint | 分支现场/续跑 | 全权限agent非安全沙箱 |
| review/merge | 评语与串行集成 | none/blocked可合并非最终验收 |
| 状态/邮箱/dashboard | 恢复/观察/交接 | 非事务/默认网络范围需控 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22/DSH agents、commands、sessions、模型/工具 | 编排与内部会话 | peer通配非任意版本保证 |
| Git仓库/可写tasks与.taskswarm/磁盘 | worktree/状态/checkpoint | 非权限沙箱，状态文件非事务日志 |
| 明确任务包/依赖/验收与模型路由 | 分波/worker/reviewer | 依赖环与未知ID不硬阻 |
| 可信任务/Host网络策略 | 全权限agent/dashboard | 需另核访问控制 |



#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 处理Git构建/宿主服务/模型 | 核权限与dashboard绑定 |
| 定义任务 | PROMPT/STATUS/文件范围/依赖/验收 | 先check/plan，处理环/缺依赖 |
| 启动 | wave/lane/检查点/报告 | 控制整波并发与token预算 |
| 接受 | 独立required checks绑定最终SHA | 不把none/blocked/关键字当验收 |
| 恢复/集成 | 保留现场，核外部效果再续跑/integrate | 任务变更/未知效果不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node/构建、Git worktree/模型与工具资源 | 拆任务/验收/权限/网络审查 | 配置工时/包空间未知 |
| 持续使用 | wave整批worker、独立reviewer/merger token、状态/日志/分支磁盘 | 处理语义冲突/审最终结果/维护任务包 | 并行省墙钟不等少token，费用/吞吐未知 |
| 失败恢复 | 保留worktree/重复模型调用/手动冲突修复 | 核代码/任务/外部效果，修状态与补验收 | 无损/恰好一次未证明，恢复耗时未知 |



#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 批量项目协作 | 任务包/wave/worktree/报告 | 错依赖/整波并发需审 |
| 持续代码现场 | checkpoint/持久计划 | 非外部效果事务 |
| 交接可读 | 状态/邮箱/dashboard | merged不等accepted，信息可达需控 |

与手工PR+CI/worktree比，潜在减少跟踪和重建上下文，但没有同任务对照，不能断言总成本下降。

> **思考**：默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](#research-q01)、[Q03](#research-q03)。

把TaskPlane式外置任务、wave/worktree/checkpoint与DSH内部agent/supervisor/恢复接线，支持代码现场持续推进；总管理负担减少仍是推断。详见[Q01](#research-q01)、[Q03](#research-q03)。

task_runner advance/done会修改STATUS并git add -A/commit lane工作树，worker退出再checkpoint；能保存代码进度，但add -A也会纳入lane内所有未忽略改动，且runLane未检查退出checkpoint的ok。外部网络/数据库/文件副作用不随Git回滚，不能宣传崩溃绝不丢任何工作。

批次落盘wavePlan和lane状态，updateLane重新读单lane写、拒绝aborted/complete再写；operator暂停来源限制自主恢复，是具体防护。恢复复用wavePlan ID布局却重新从当前磁盘读任务，缺失任务被filter，任务正文/依赖/代码没有按启动hash绑定。状态writeFileSync直接覆盖而非临时rename/fsync，损坏JSON读null，不能当断电事务日志；邮箱单消息temp+rename更谨慎，但drain先ack再由调用者处理不等业务确认交付。

超时/stop/abort以Promise.race尽快收尾，host.abort尽力cancel。runLaneWorker timer创建后没有clearTimeout，旧timer晚触发靠磁盘终态判断避免覆盖部分情况；merger超时只是race返回未解决，未见在该处取消merger会话，后台副作用可能晚到。恢复的是编排和代码现场，不能证明外部效果恰好一次或所有任务状态一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认PASS/none与blocked可合并、首review缺.seq抛错、普通merge不统一check；worktree非权限沙箱且dashboard非显式loopback绑定，merged不能当accepted。详见[Q04](#research-q04)、[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，不将默认自主流程视可靠接受门；可丢弃仓库研究需独立强制CI/人工SHA验收及权限/预算/网络控制。详见[Q07](#research-q07)。

TaskPlane是明确MIT移植参照，wave/worktree/git/mailbox并非本项目新发明，增量是DSH-native agent/工具/会话supervisor适配与生命周期恢复。合格产物应是满足任务条件且有最终代码验收的集成提交，merged/绿色dashboard只是调度状态。把操作者从逐工人盯守转向任务定义/异常处置是有依据的业务推断，是否减少总负担没有对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码。编排/代码现场贡献成立，最终接受、依赖与权限/可达性限制须先收敛。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh-CN.md、package.json、src/core/discover.ts、src/core/worktree.ts、src/core/git.ts、src/core/status.ts、src/core/mailbox.ts、src/orchestrator/engine.ts、src/orchestrator/index.ts、src/orchestrator/in-process-host.ts、src/worker/worker-tools.ts、src/worker/reviewer.ts、src/worker/merger.ts、src/worker/lane-tools.ts、dashboard/server.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整core关键worktree/discover/status/mailbox/git、engine运行/合并/恢复/超时、worker/reviewer/merger/lane工具关键流程、in-process与配置、dashboard核心绑定/CORS/状态；未全审supervisor全部自治工具/前端/平台所有分支，不运行build/测试/宿主/agent/Git写操作。
- 下一步：可继续假agent/fs/Git状态与固定任务矩阵核review/依赖/恢复，接受收据先对照简单严格CI，不运行真实副作用。

**分析版本**

- **仓库**：[february2015/dsh-taskswarm](https://github.com/february2015/dsh-taskswarm)
- **版本号**：0.2.38（[固定提交 032e2c9](https://github.com/february2015/dsh-taskswarm/tree/032e2c9d228c20cab65fe0ea061d78a7c753ab8c)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索任务/代码/策略/依赖产物绑定的接受收据与变化失效，对照简单严格CI/人工最终SHA验收；未实现。跨执行者任务包仅更远设想。详见[Q07](#research-q07)。

可继续假agent/fs/Git状态与固定任务矩阵核review/依赖/恢复，接受收据先对照简单严格CI，不运行真实副作用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3638 | — | — | 33158 |
| .mjs | source | 4 | 1448 | 920 | 433 | — |
| .mjs | test | 9 | 3178 | 2582 | 291 | — |
| .js | source | 1 | 2871 | 2101 | 460 | — |
| .ts | source | 23 | 5548 | 4189 | 1050 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+created%3A2026-09-22T10%3A23%3A50.800Z..2026-10-22T10%3A23%3A50.800Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/february2015/dsh-taskswarm/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A23%3A50.800Z..2026-10-22T10%3A23%3A50.800Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核TaskPlane归属、任务包/波次/现场贡献、恢复与验收/权限边界、成本和产物绑定接受假设，逐ID复核旧finding。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么任务适合蜂群，增量与上游如何区分？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合有Git仓库、能把目标拆成明确PROMPT/STATUS任务包、依赖与完成条件的多步骤代码工作。基线手工subagent+分支/worktree+PR/CI，由人跟踪交接；插件将任务外置、按波次启动lane、保检查点/状态/邮箱、串行集成到taskswarm/orch，用户再integrate到当前分支。单次咨询/高度耦合任务可能不值得这层管理。

TaskPlane是明确MIT移植参照，wave/worktree/git/mailbox并非本项目新发明，增量是DSH-native agent/工具/会话supervisor适配与生命周期恢复。合格产物应是满足任务条件且有最终代码验收的集成提交，merged/绿色dashboard只是调度状态。把操作者从逐工人盯守转向任务定义/异常处置是有依据的业务推断，是否减少总负担没有对照。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/worktree.ts:1-15](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L1-L15)

上游归属/分支模型。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Git worktree isolation, checkpoint commits, and merge-back.
 * Adapted from TaskPlane `extensions/taskplane/worktree.ts`
 * (github.com/HenryLach/taskplane, MIT License) — lean re-implementation.
 *
 * Model:
 *   - `taskswarm/orch`  — dedicated integration branch (created once, never checked
 *     out in the main working tree).
 *   - one lane worktree per task: `git worktree add -b taskswarm/<taskId> <laneDir> taskswarm/orch`
 *     (lane baselines on the orch HEAD — it inherits every previously merged task's
 *     output, instead of starting from the working branch and re-inventing shared code)
 *   - worker checkpoints: `git add -A && git commit -m "checkpoint: <msg>"`
 *   - merge-back: merge the lane branch into `taskswarm/orch` inside the orch
 *     worktree, then remove the lane worktree and delete the lane branch.
 * @module taskswarm/core/worktree
```

</details>

**依据 2 · 源码核查**：[src/orchestrator/index.ts:1-19](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/index.ts#L1-L19)

DSH命令与集成。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * TaskSwarm orchestrator plugin — registers the /orch-family human commands on
 * `ctx.commands` and lazily builds a per-repo TaskSwarmEngine. Mount via the
 * `taskswarm` bundle patch (cordis.patch.yml) on any profile that composes the
 * base services. Replaces TaskPlane's `extensions/task-orchestrator.ts`
 * (github.com/HenryLach/taskplane, MIT License).
 *
 * Commands:
 *   /orch [scope]       start a batch (scope: all | <task-id> | <path>)
 *   /orch-plan [scope]  preview waves and dependencies (no execution)
 *   /orch-check         validate all task packets (parse + structure + waves)
 *   /orch-status        current batch / lane progress
 *   /orch-pause         pause after the current wave
 *   /orch-resume        resume a paused batch
 *   /orch-abort         abort after the current wave
 *   /orch-deps [scope]  show the dependency graph
 *   /orch-sessions      list active lanes and their worktrees
 *   /orch-integrate     merge taskswarm/orch into the working branch
 *   /tswarm-init [ID]     scaffold two example tasks from templates
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:13-30](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/README.zh-CN.md#L13-L30)

作者特性/TaskPlane归属。

<details>
<summary>查看原文（18行）</summary>

```text
- **English:** [README.md](README.md)

## 核心特性

- **Waves / Lanes 并行编排** —— 按依赖 DAG 把任务排成波次，每波任务并行执行；依赖关系自动分层
- **Git worktree 隔离** —— 每个任务（lane）在独立 git worktree 里工作，互不干扰，产物通过 `taskswarm/orch` 集成分支合并
- **任务包（Task Packets）** —— 每个任务 = `PROMPT.md`（使命/步骤/约束）+ `STATUS.md`（进度），持久记忆，worker 能扛过上下文重置
- **检查点纪律** —— 步骤边界自动 git commit；worker 崩溃不丢已完成的活
- **跨模型评审（Reviewer）** —— 独立 reviewer 按任务 `Review Level` 评审产出，PASS 才合并，REVISE 打回修订
- **文件邮箱（Mailbox）** —— worker ↔ supervisor 异步通信（notify / escalate / request），不依赖共享上下文
- **对话式 Supervisor** —— 与你共享会话：wave 完成、lane 失败、批次完成自动汇报；可指挥它 start / pause / abort / integrate / 开 dashboard；通知与提示词**中英双语**（"用英文汇报"即可切换，自动按你的会话语言判断，写入 `.taskswarm/config.json` 跨重启生效）
- **Web Dashboard** —— 本地实时仪表盘，零依赖 node:http + SSE，多仓库多实例、端口自动避让。**启动批次时自动拉起并打印链接到会话**——同一工作区始终只有一个 dashboard 实例（已运行的会被复用，绝不重复拉起）
- **崩溃可恢复** —— 磁盘状态持久化 + 检查点 + lane 分支保留，进程被杀/重启后可抢救产物、清理残留、重跑
- **orch 基线 lane** —— 每个 lane 工作树从 `taskswarm/orch` 集成 HEAD 创建，直接继承此前全部已合并产物，不重造共享代码
- **任务包校验** —— `/tswarm-check` + `npm run check:tasks` 让坏格式任务包（ID 缺连字符、缺步骤/验收标准）报出可操作原因，不再静默跳过
- **LLM merge agent** —— lane 并入 `taskswarm/orch` 冲突时，独立 merger agent 在 orch worktree 内语义化解冲突；无法解决时 lane 进入 `conflict` 态并暂停批次等 supervisor 处置

## 为什么用 TaskSwarm，DSH 不是已经有 subagent 了吗？
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 依赖分波和lane隔离到什么程度？

**研究主题**：功能与机制

#### 完整回答

scanTasks默认排除.DONE、跳无法解析包，resolveScope按ID/目录/路径选择。buildWaves对已选集合中依赖分层，未知ID记unresolved却当满足；环导致无可运行波时把剩余任务同波发出。因此不是严格DAG校验/阻塞调度，未知ID还可能是已完成或未选任务，不能一概当拼错。File Scope可用于任务描述/质量提示，已读调度不用于文件冲突感知。

每lane从orch HEAD新分支worktree，已有分支续接尝试merge最新orch、冲突abort保旧现场。wave内Promise.all，无单独最大lane限流；独立工作目录减少同文件同时编辑互踩，但共享宿主进程/网络/权限和Git仓库对象，不是安全沙箱。串行merge避免并发Git锁，冲突留lane/merge现场交merger/人；不会自动解决语义冲突。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/discover.ts:65-83](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/discover.ts#L65-L83)

已完成/解析过滤。

<details>
<summary>查看原文（19行）</summary>

```text
/**
 * Scan a tasks root for task packets (directories containing PROMPT.md).
 * @param tasksRoot   - absolute path to the tasks root
 * @param includeDone - when false, tasks with a `.DONE` marker are excluded
 */
export function scanTasks(tasksRoot: string, includeDone = false): DiscoveredTask[] {
  if (!existsSync(tasksRoot)) return []
  const found: DiscoveredTask[] = []
  for (const entry of readdirSync(tasksRoot).sort()) {
    const folder = join(tasksRoot, entry)
    if (!statSync(folder).isDirectory()) continue
    const promptPath = join(folder, 'PROMPT.md')
    if (!existsSync(promptPath)) continue
    if (!includeDone && existsSync(join(folder, '.DONE'))) continue
    const areaName = entry.includes('-') ? entry.split('-')[0]!.toLowerCase() : 'tasks'
    const task = parsePrompt(promptPath, folder, areaName)
    if (!task) continue
    found.push({ task, status: parseStatusFile(folder), selected: true })
  }
```

</details>

**依据 2 · 源码核查**：[src/core/discover.ts:92-148](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/discover.ts#L92-L148)

scope/未知依赖/环。

<details>
<summary>查看原文（57行）</summary>

```text
export function resolveScope(scope: string, repoRoot: string, tasks: DiscoveredTask[]): DiscoveredTask[] {
  const trimmed = (scope || 'all').trim()
  if (trimmed === '' || trimmed === 'all') return tasks.map((t) => ({ ...t, selected: true }))
  const wanted = new Set(
    trimmed.split(/\s+/).map((token) => {
      if (isAbsolute(token)) return resolve(token)
      if (token.includes('/') || token.includes('\\')) return resolve(repoRoot, token)
      return token.toUpperCase()
    }),
  )
  return tasks.map((t) => {
    const path = resolve(t.task.folder)
    const id = t.task.id.toUpperCase()
    const folderName = path.split(/[\\/]/).pop()!.toUpperCase()
    const selected = [...wanted].some((w) => path === w || id === w || folderName.includes(w) || (w.includes('/') && path.startsWith(w)))
    return { ...t, selected }
  })
}

/**
 * Build the wave plan: topological layers over the dependency DAG.
 * Unknown dependency ids are reported (and treated as satisfied) rather than
 * failing the whole plan.
 */
export function buildWaves(tasks: TaskPacket[]): WavePlan {
  const byId = new Map<string, TaskPacket>()
  for (const task of tasks) byId.set(task.id, task)

  const unresolved = new Map<string, string[]>()
  const done = new Set<string>()
  const waves: TaskPacket[][] = []
  const remaining = new Set(tasks.map((t) => t.id))

  while (remaining.size > 0) {
    const wave: TaskPacket[] = []
    for (const id of remaining) {
      const task = byId.get(id)!
      const deps = task.deps.filter((dep) => byId.has(dep))
      const missing = task.deps.filter((dep) => !byId.has(dep))
      if (missing.length > 0) unresolved.set(id, missing)
      if (deps.every((dep) => done.has(dep))) wave.push(task)
    }
    if (wave.length === 0) {
      // Dependency cycle — break it by emitting the remaining tasks in order.
      for (const id of remaining) {
        const task = byId.get(id)!
        if (!waves.flat().some((t) => t.id === task.id)) wave.push(task)
      }
      if (wave.length === 0) break
    }
    for (const task of wave) {
      done.add(task.id)
      remaining.delete(task.id)
    }
    waves.push(wave)
  }
  return { tasks, waves, unresolvedDeps: unresolved }
```

</details>

**依据 3 · 源码核查**：[src/core/worktree.ts:58-90](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L58-L90)

orch基线/续接。

<details>
<summary>查看原文（33行）</summary>

```text
export function createLaneWorktree(repoRoot: string, paths: WorktreePaths, taskId: string): LaneWorktree | null {
  const branch = `taskswarm/${sanitizeNameComponent(taskId, 48)}`
  const dir = join(paths.worktreesDir, sanitizeNameComponent(taskId, 48))
  // Leftovers from a killed process or an aborted batch must not block the
  // next batch: remove a stale worktree dir, and attach an existing branch
  // instead of `-b` (which fails when the branch already exists).
  if (existsSync(dir)) {
    const removed = runGit(['worktree', 'remove', '--force', dir], repoRoot)
    if (!removed.ok) runGit(['worktree', 'prune'], repoRoot)
  }
  const hasBranch = runGit(['rev-parse', '--verify', `refs/heads/${branch}`], repoRoot).ok
  const hasOrch = runGit(['rev-parse', '--verify', `refs/heads/${ORCH_BRANCH}`], repoRoot).ok
  // git worktree add 语法：`add <path> [<commit-ish>]`——path 在前。
  // 新分支：`worktree add -b <branch> <dir> [<commit-ish>]`。
  // 已存在分支：`worktree add <dir> <branch>`（附着）。
  // （2026-08-14 修正：原 `add <branch> <dir>` 参数顺序颠倒，git 把 branch 当 path → 无效引用，
  //   导致"已存在分支"的 lane 重跑 always "could not create lane worktree"，如 JM-337。）
  // （2026-08-15 修正：新 lane 显式以 taskswarm/orch HEAD 为基线——此前从工作分支出发，
  //   lane 看不到已合并任务的产物，全靠 worker 自觉 `git merge taskswarm/orch` 补基线；
  //   若 worker 未意识到依赖即产出残缺/重复实现，merge 回 orch 时互相冲突。）
  const result = hasBranch
    ? runGit(['worktree', 'add', dir, branch], repoRoot)
    : hasOrch
      ? runGit(['worktree', 'add', '-b', branch, dir, ORCH_BRANCH], repoRoot)
      : runGit(['worktree', 'add', '-b', branch, dir], repoRoot)
  if (!result.ok) return null
  // 续跑（附着既有分支）：把 orch 最新合并产物并入 lane，让重跑从最新状态继续
  // （旧检查点保留；合并冲突时 abort，worker 可在任务中自行 merge orch）。
  if (hasBranch && hasOrch) {
    const sync = runGit(['merge', '--no-edit', ORCH_BRANCH], dir)
    if (!sync.ok) runGit(['merge', '--abort'], dir)
  }
  return { dir, branch }
```

</details>

**依据 4 · 源码核查**：[src/orchestrator/engine.ts:285-299](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L285-L299)

整波并发。

<details>
<summary>查看原文（15行）</summary>

```text
      state.phase = 'aborted'
      writeBatchState(state)
      return
    }

    for (const [waveIndex, wave] of waves.waves.entries()) {
      while (ctx.paused && !ctx.aborted) await sleep(250)
      if (ctx.aborted) {
        state.phase = 'aborted'
        writeBatchState(state)
        return
      }
      const lanes = await Promise.all(wave.map((task) => this.runLane(ctx, state, task)))
      for (const lane of lanes) {
        const index = state.lanes.findIndex((l) => l.taskId === lane.taskId)
```

</details>

**依据 5 · 源码核查**：[src/core/worktree.ts:123-135](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L123-L135)

合并与失败保留。

<details>
<summary>查看原文（13行）</summary>

```text
export function mergeLane(repoRoot: string, paths: WorktreePaths, lane: LaneWorktree): GitResult {
  ensureGitIdentity(repoRoot)
  const merged = runGit(['merge', '--no-edit', lane.branch], paths.orchWorktree)
  if (!merged.ok) {
    // Preserve the merge failure state: do NOT remove the lane worktree,
    // do NOT delete the lane branch, and leave the orch merge in progress
    // (conflict markers intact) for inspection / merge-agent resolution.
    return merged
  }
  const removeWt = runGit(['worktree', 'remove', '--force', lane.dir], repoRoot)
  if (!removeWt.ok) runGit(['worktree', 'prune'], repoRoot)
  runGit(['branch', '-d', lane.branch], repoRoot)
  return merged
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 检查点、状态和恢复是否等于无损事务？

**研究主题**：工程质量与复用

#### 完整回答

task_runner advance/done会修改STATUS并git add -A/commit lane工作树，worker退出再checkpoint；能保存代码进度，但add -A也会纳入lane内所有未忽略改动，且runLane未检查退出checkpoint的ok。外部网络/数据库/文件副作用不随Git回滚，不能宣传崩溃绝不丢任何工作。

批次落盘wavePlan和lane状态，updateLane重新读单lane写、拒绝aborted/complete再写；operator暂停来源限制自主恢复，是具体防护。恢复复用wavePlan ID布局却重新从当前磁盘读任务，缺失任务被filter，任务正文/依赖/代码没有按启动hash绑定。状态writeFileSync直接覆盖而非临时rename/fsync，损坏JSON读null，不能当断电事务日志；邮箱单消息temp+rename更谨慎，但drain先ack再由调用者处理不等业务确认交付。

超时/stop/abort以Promise.race尽快收尾，host.abort尽力cancel。runLaneWorker timer创建后没有clearTimeout，旧timer晚触发靠磁盘终态判断避免覆盖部分情况；merger超时只是race返回未解决，未见在该处取消merger会话，后台副作用可能晚到。恢复的是编排和代码现场，不能证明外部效果恰好一次或所有任务状态一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/worker/lane-tools.ts:161-184](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/lane-tools.ts#L161-L184)

advance/done检查点。

<details>
<summary>查看原文（24行）</summary>

```text
          case 'advance': {
            const packet = parsePrompt(promptFilePath(lane.taskDir), lane.taskDir, '')
            if (!packet) return { ok: false, text: `cannot parse PROMPT.md at ${lane.taskDir}` }
            ensureStatusFile(packet)
            const stepIndex = args.step as number | undefined
            const step = stepIndex !== undefined
              ? packet.steps.find((s) => s.index === stepIndex)
              : packet.steps.find((s) => s.items.some((i) => !i.checked)) ?? packet.steps[packet.steps.length - 1]
            if (!step) return { ok: false, text: 'task has no steps' }
            const result = advanceStep(packet, step.index)
            const cp = checkpointCommit(lane.worktree, `taskswarm: ${taskId} advance step ${step.index} ${message ? `— ${message}` : ''}`)
            appendExecutionLog(lane.taskDir, `advance step ${step.index}`, cp.summary)
            return {
              ok: true,
              text: result.item
                ? `Checked: ${result.item} (${result.remaining} remaining in step ${step.index})`
                : `Step ${step.index} (${step.title}) complete`,
            }
          }
          case 'done': {
            markTaskDone(lane.taskDir)
            const cp = checkpointCommit(lane.worktree, `taskswarm: ${taskId} done${message ? ` — ${message}` : ''}`)
            appendExecutionLog(lane.taskDir, 'done', cp.summary)
            return { ok: true, text: `Task ${taskId} marked done. Checkpoint: ${cp.summary}` }
```

</details>

**依据 2 · 源码核查**：[src/core/worktree.ts:97-108](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L97-L108)

addA/commit回执。

<details>
<summary>查看原文（12行）</summary>

```text
export function checkpointCommit(worktreeDir: string, message: string): { ok: boolean; summary: string } {
  const add = runGit(['add', '-A'], worktreeDir)
  if (!add.ok) return { ok: false, summary: add.stderr }
  const status = runGit(['status', '--porcelain'], worktreeDir)
  if (!status.ok || status.stdout.trim() === '') return { ok: true, summary: 'no changes' }
  const commit = runGit(['commit', '-m', message], worktreeDir)
  if (!commit.ok) {
    if (commit.stderr.includes('nothing to commit')) return { ok: true, summary: 'no changes' }
    return { ok: false, summary: commit.stderr }
  }
  const short = commit.stdout.match(/\[([^\]]+)\]/)
  return { ok: true, summary: short ? short[1] : commit.stdout.slice(0, 60) }
```

</details>

**依据 3 · 源码核查**：[src/core/status.ts:64-94](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/status.ts#L64-L94)

直接覆盖/终态防御。

<details>
<summary>查看原文（31行）</summary>

```text
export function readBatchState(stateRoot: string, batchId: string): BatchState | null {
  const path = batchStatePath(stateRoot, batchId)
  if (!existsSync(path)) return null
  try {
    return JSON.parse(readFileSync(path, 'utf-8')) as BatchState
  } catch {
    return null
  }
}

export function writeBatchState(state: BatchState): void {
  const dir = batchStateDir(state.stateRoot)
  mkdirSync(dir, { recursive: true })
  writeFileSync(batchStatePath(state.stateRoot, state.id), JSON.stringify(state, null, 2), 'utf-8')
}

/**
 * Update one lane of a batch by id, then persist.
 * 终态防御（2026-08-15）：`aborted` / `complete` 批次拒绝再写 lane 状态——
 * 否则 abort 后仍在途的旧 execute() 会用旧 batchId 把完成状态续写进已终态的旧批次文件
 * （bug-batch-state-write 报告放大因素）。
 */
export function updateLane(stateRoot: string, batchId: string, lane: LaneState): BatchState | null {
  const state = readBatchState(stateRoot, batchId)
  if (!state) return null
  if (state.phase === 'aborted' || state.phase === 'complete') return state
  const index = state.lanes.findIndex((l) => l.lane === lane.lane && l.taskId === lane.taskId)
  if (index === -1) state.lanes.push(lane)
  else state.lanes[index] = lane
  writeBatchState(state)
  return state
```

</details>

**依据 4 · 源码核查**：[src/orchestrator/engine.ts:678-746](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L678-L746)

暂停/磁盘恢复。

<details>
<summary>查看原文（69行）</summary>

```text
  resume(owner?: unknown, by: 'operator' | 'supervisor' | 'engine' = 'operator'): boolean {
    const ctx = this.activeContext()
    if (ctx) {
      const state = readBatchState(this.config.stateRoot, ctx.batchId)
      // 用户下令暂停的批次：仅 operator 能恢复。supervisor/引擎自动恢复一律拒绝。
      if (state?.pausedBy === 'operator' && by !== 'operator') return false
      if (owner) this.batchOwners.set(ctx.batchId, owner)
      ctx.paused = false
      if (state) {
        state.phase = 'running'
        writeBatchState(state)
      }
      return true
    }
    // 引擎重启后 active 为空：从磁盘恢复未完成批次续跑（方案 A，KI-007）。
    // 已 merged/failed 的 lane 由 runLane 跳过；剩余 pending 任务按新 wave plan 继续。
    // pauseOnLaneFailure 暂停的批次：跳过 failed lane（丢弃失败工作），避免重跑再失败死循环。
    const latest = latestBatch(this.config.stateRoot)
    // operator 暂停的批次：仅 operator 显式 resume 才恢复；supervisor 自主恢复被拒。
    if (latest?.pausedBy === 'operator' && by !== 'operator') return false
    const skipFailed = this.pausedOnFailureBatch === latest?.id
    const ok = this.recoverPendingBatch(skipFailed, owner)
    if (ok) this.pausedOnFailureBatch = null
    return ok
  }

  /**
   * 方案 A（KI-007）：引擎重启/崩溃后，把磁盘上 phase ∈ running/planning/paused 的
   * 批次重新挂回执行（跳过已完成 lane）。这样失联/重启不再需要手动开新批次重排剩余任务。
   * @param skipFailed 为 true 时跳过已 failed 的 lane（pauseOnLaneFailure 暂停后 resume =
   *   丢弃失败工作继续；false = 崩溃恢复，failed lane 需重跑续接）。
   */
  private recoverPendingBatch(skipFailed = false, owner?: unknown): boolean {
    const state = latestBatch(this.config.stateRoot)
    if (!state) return false
    if (state.phase !== 'running' && state.phase !== 'planning' && state.phase !== 'paused') return false
    if (this.active.has(state.id)) return false
    // 重启后恢复：把发起 resume 的会话设为 owner——后续事件/定时汇报路由到它（新对话），
    // 而不是 apply 时捕获的旧 supervisorAgent（2026-08-17 修复）。
    if (owner) this.batchOwners.set(state.id, owner)
    // 2026-08-16：wave plan 是批次启动时定死的（持久化在 state.wavePlan），恢复时**原样复用**——
    // 已完成 wave 的任务由 runLane 的 "merged 跳过" 处理，绝不中途重算 wave 结构
    // （旧实现 select 排除 done 后重新 buildWaves，wave 数变化 + lane.wave 错位）。
    let waves: WavePlan
    if (state.wavePlan && state.wavePlan.length > 0) {
      // 用持久化的原始 wave plan；任务仍从磁盘 scope 解析（保留完整任务包上下文）。
      const discovered = scanTasks(this.config.tasksRoot, true)
      const byId = new Map(discovered.map((d) => [d.task.id, d.task]))
      waves = {
        tasks: state.wavePlan.flat().map((id) => byId.get(id)).filter((t): t is NonNullable<typeof t> => !!t),
        waves: state.wavePlan
          .map((ids) => ids.map((id) => byId.get(id)).filter((t): t is NonNullable<typeof t> => !!t))
          .filter((wave) => wave.length > 0),
        unresolvedDeps: new Map(),
      }
      if (skipFailed) {
        const failedIds = new Set(state.lanes.filter((l) => l.phase === 'failed').map((l) => l.taskId))
        waves.waves = waves.waves.map((wave) => wave.filter((t) => !failedIds.has(t.id)))
      }
      if (waves.waves.length === 0) return false
    } else {
      // 兼容旧批次文件（无 wavePlan）：回退到重新计算。
      let selected = this.select(state.scope)
      if (skipFailed) {
        const failedIds = new Set(state.lanes.filter((l) => l.phase === 'failed').map((l) => l.taskId))
        selected = selected.filter((t) => !failedIds.has(t.task.id))
      }
      if (selected.length === 0) return false
      waves = buildWaves(selected.map((t) => t.task))
```

</details>

**依据 5 · 源码核查**：[src/core/mailbox.ts:71-92](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/mailbox.ts#L71-L92)

消息原子rename。

<details>
<summary>查看原文（22行）</summary>

```text
export function writeMailboxMessage(
  inboxDir: string,
  from: string,
  to: string,
  type: MailboxMessageType,
  payload: unknown,
): MailboxMessage {
  ensureDir(inboxDir)
  const message: MailboxMessage = {
    id: randomUUID(),
    from,
    to,
    type,
    payload,
    ts: new Date().toISOString(),
  }
  const filename = `${Date.now()}-${message.id.slice(0, 8)}.json`
  const target = join(inboxDir, filename)
  const tmp = join(inboxDir, `.${filename}.tmp`)
  writeFileSync(tmp, JSON.stringify(message), 'utf-8')
  renameSync(tmp, target)
  return message
```

</details>

**依据 6 · 源码核查**：[src/core/mailbox.ts:127-139](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/mailbox.ts#L127-L139)

drain先ack。

<details>
<summary>查看原文（13行）</summary>

```text
/** Drain an inbox: ack everything, returning the drained messages. */
export function drainInbox(inboxDir: string): MailboxMessage[] {
  const messages = readInbox(inboxDir)
  for (const m of messages) {
    // Locate the file by id suffix; filenames are `<ts>-<id8>.json`.
    for (const name of readdirSync(inboxDir)) {
      if (name.endsWith(`-${m.id.slice(0, 8)}.json`)) {
        ackMessage(inboxDir, name)
        break
      }
    }
  }
  return messages
```

</details>

**依据 7 · 源码核查**：[src/orchestrator/engine.ts:592-642](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L592-L642)

timeout无清timer。

<details>
<summary>查看原文（51行）</summary>

```text
  private async runLaneWorker(ctx: RunContext, lane: LaneState, spec: LaneSpec): Promise<WorkerResult> {
    const { config } = ctx
    // abort 信号：abort() resolve 后立即中断在途 await，避免旧批次 worker 继续跑。
    const abortNow = ctx.abortWaiter
      ? ctx.abortWaiter.then(() => ({ exitCode: 1, text: '', error: 'aborted' } satisfies WorkerResult))
      : undefined
    // per-lane 停止信号：stopLane(taskId) resolve → 立即中断该 lane 的 worker（主动停卡住 lane）。
    let resolveStop: (() => void) | undefined
    const stopNow = new Promise<WorkerResult>((resolve) => {
      resolveStop = () => resolve({ exitCode: 1, text: '', error: 'stopped by operator' } satisfies WorkerResult)
    })
    ctx.laneStopResolvers.set(spec.lane, () => resolveStop?.())
    try {
      const timeoutMin = config.laneTimeoutMinutes ?? 0
      if (!(timeoutMin > 0)) {
        return Promise.race([config.host.spawn(spec), stopNow, ...(abortNow ? [abortNow] : [])])
      }

      const timeoutMs = timeoutMin * 60_000
      let timer: NodeJS.Timeout | undefined
      const timeout = new Promise<WorkerResult>((resolve) => {
        timer = setTimeout(() => {
          // 看门狗触发前先查磁盘：若该 lane 已被手动收尾（supervisor 标记 merged/failed、
          // 代码已并入分支），则跳过不覆盖——避免看门狗把已完成的 lane 误标 failed
          // （2026-08-14 JM-334 实测：手动收尾后 90 分钟超时仍覆盖为 failed）。
          try {
            const disk = readBatchState(config.stateRoot, ctx.batchId)
            const dl = disk?.lanes?.find((x) => x.taskId === spec.task.id)
            if (dl && (dl.phase === 'merged' || dl.phase === 'failed')) {
              laneLog(lane, `watchdog skipped (lane already ${dl.phase} on disk — manual finalize)`)
              resolve({ exitCode: 0, text: '', error: undefined })
              return
            }
          } catch {
            // 磁盘不可读时按常规超时处理
          }
          // 先 abort 僵尸 worker，再以 failed 收尾（worktree/分支保留供排查）。
          try {
            config.host.abort?.(spec.lane)
          } catch {
            // best-effort
          }
          laneLog(lane, `lane timeout after ${timeoutMin} min (watchdog)`)
          resolve({ exitCode: 1, text: '', error: `lane timeout after ${timeoutMin} min（worker 无完成事件，看门狗强制结束；检查点保留在 taskswarm/${spec.task.id} 分支）` })
        }, timeoutMs)
      })
      return await Promise.race([config.host.spawn(spec), timeout, stopNow, ...(abortNow ? [abortNow] : [])])
    } finally {
      ctx.laneStopResolvers.delete(spec.lane)
      ctx.laneStopWaiters.delete(spec.lane)
    }
```

</details>

**依据 8 · 源码核查**：[src/orchestrator/engine.ts:517-538](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L517-L538)

merger race。

<details>
<summary>查看原文（22行）</summary>

```text
        const mergerTimeoutMin = config.mergerTimeoutMinutes ?? 10
        const mergerPromise = (async () => {
          // 必须绑定 host：方法解引用后 this 会丢（ES class 方法）。
          return merger.call(config.host, {
            orchWorktree: paths.orchWorktree,
            laneBranch: wt.branch,
            taskId: task.id,
            repoRoot: config.repoRoot,
            verifyCommands: config.mergeVerifyCommands,
          })
        })()
        let mr: MergeResult
        if (mergerTimeoutMin > 0) {
          const timer = new Promise<MergeResult>((resolve) => {
            setTimeout(() => {
              laneLog(lane, `merger agent timed out after ${mergerTimeoutMin} min — preserving merge state`)
              resolve({ status: 'CONFLICT_UNRESOLVED', summary: `merger agent timed out after ${mergerTimeoutMin} min` })
            }, mergerTimeoutMin * 60_000).unref?.()
          })
          mr = await Promise.race([mergerPromise, timer])
        } else {
          mr = await mergerPromise
```

</details>

#### 缺口

- 崩溃/断电/外部效果后恢复的全链一致性未知。
  **影响**：不能把checkpoint/磁盘状态当恰好一次或无损保证。
  **进一步探讨**：假fs/agent/外部效果计数矩阵区分提交点、状态损坏和迟到回调，不运行真实副作用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Reviewer与合并是否构成最终质量门？

**研究主题**：缺陷与关键质疑

#### 完整回答

Reviewer提示要求PASS/REVISE，但实际从末助手文字只要出现REVISE就拒，否则包括空/无效文本都PASS。engine读.reviews文件仅substring，不绑定任务正文/代码SHA/完整检查记录；没有review/无法识别为none，并不强制阻合并。worker exit0、任务status为done或blocked且非REVISE就markTaskDone尝试合并，blocked并非硬阻塞。

首次review_step在mkdir(.reviews)后用existsSync(reviewsDir)决定是否读.seq，因此新目录存在而.seq不存在就会在try外抛ENOENT；无法保证“每步都review”。spawnReviewer异常catch返回REVISE但不写review文件，engine仍可能读先前PASS/none。普通无冲突merge直接first.ok返回，不统一执行mergeVerifyCommands；只把验证命令给冲突merger的提示，merger结果靠SUCCESS/CONFLICT_RESOLVED关键词，不独立核最终Git状态/测试退出。

这些静态边界否定“只有经过最终独立PASS才合并”的强保证，不代表某次产物已错或运行漏洞被复现。独立模型也不等独立真值，应该绑定最终产物与验收证据再称accepted。

#### 证据与依据

**依据 1 · 源码核查**：[src/worker/reviewer.ts:93-107](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/reviewer.ts#L93-L107)

非REVISE默认PASS。

<details>
<summary>查看原文（15行）</summary>

```text
      await agent.whenIdle()
      const prompt = [
        `You are an independent reviewer for task ${request.taskId}, step ${request.step} (${request.type}).`,
        `Inspect the worktree at ${request.worktree}: run \`git diff\` against the parent branch to see the changes.`,
        `Check the changes against the mission, steps, and completion criteria in ${request.taskDir}/PROMPT.md.`,
        'Respond with a verdict line: PASS or REVISE, followed by a short findings summary.',
      ].join('\n')
      agent.followup(createUserMessage({
        content: [{ type: 'text', text: prompt }],
        source: { kind: 'user' },
      }))
      await agent.whenIdle()
      const text = lastAssistantText(agent)
      const verdict: 'PASS' | 'REVISE' = /\bREVISE\b/i.test(text) ? 'REVISE' : 'PASS'
      return { verdict, summary: text.slice(0, 2000) }
```

</details>

**依据 2 · 源码核查**：[src/worker/lane-tools.ts:229-254](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/lane-tools.ts#L229-L254)

首次.seq/异常回执。

<details>
<summary>查看原文（26行）</summary>

```text
    async execute(args): Promise<{ verdict: 'PASS' | 'REVISE' | 'pending'; summary: string }> {
      const step = args.step as number
      const type = (args.type as string | undefined) ?? 'code'
      const reviewsDir = join(lane.taskDir, '.reviews')
      mkdirSync(reviewsDir, { recursive: true })
      const seq = (existsSync(reviewsDir) ? readFileSync(join(reviewsDir, '.seq'), 'utf-8') : '0').trim()
      const nextSeq = Number(seq || 0) + 1
      writeFileSync(join(reviewsDir, '.seq'), String(nextSeq), 'utf-8')

      if (!lane.spawnReviewer) {
        const file = join(reviewsDir, `R${String(nextSeq).padStart(3, '0')}-${type}-step${step}.md`)
        writeFileSync(file, `# Review ${nextSeq} — ${type} step ${step}\n\n**Verdict:** pending (no reviewer configured)\n`, 'utf-8')
        return { verdict: 'pending', summary: 'no reviewer configured — recorded pending review' }
      }

      try {
        const result = await lane.spawnReviewer({ worktree: lane.worktree, taskDir: lane.taskDir, taskId, step: String(step), type })
        const file = join(reviewsDir, `R${String(nextSeq).padStart(3, '0')}-${type}-step${step}.md`)
        writeFileSync(file, `# Review ${nextSeq} — ${type} step ${step}\n\n**Verdict:** ${result.verdict}\n\n${result.summary}\n`, 'utf-8')
        appendExecutionLog(lane.taskDir, `review_step ${type} ${step}`, result.verdict)
        return { verdict: result.verdict, summary: result.summary }
      } catch (err) {
        const summary = `reviewer failed: ${err instanceof Error ? err.message : String(err)}`
        appendExecutionLog(lane.taskDir, `review_step ${type} ${step}`, summary)
        return { verdict: 'REVISE', summary }
      }
```

</details>

**依据 3 · 源码核查**：[src/orchestrator/engine.ts:490-526](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L490-L526)

blocked/none可合并与普通merge无verify。

<details>
<summary>查看原文（37行）</summary>

```text
    checkpointCommit(wt.dir, `taskswarm: ${task.id} worker exit`)
    const verdict = this.readLatestVerdict(task.folder)
    lane.reviewVerdict = verdict

    const taskStatus = parseStatusFile(task.folder)
    const workerFailed = result.exitCode !== 0
    const notFinished = taskStatus.status !== 'done' && taskStatus.status !== 'blocked'
    if (workerFailed || notFinished) {
      lane.phase = 'failed'
      lane.error = lane.error ?? (workerFailed ? `worker exited ${result.exitCode}` : 'task not marked done')
    } else if (verdict === 'REVISE') {
      lane.phase = 'review'
      lane.error = 'reviewer requested revisions'
    } else {
      markTaskDone(task.folder)
      // orch merge 必须串行（同一 wave 多 lane 并行完成，并发 git merge 会被锁拒绝）。
      const merged = await this.serializedMerge(async () => {
        const first = mergeLane(config.repoRoot, paths, wt)
        if (first.ok) return first
        // merge 失败：现场已保留（lane worktree/branch + orch 冲突状态，P0）。
        // 尝试 LLM merger agent 语义化解冲突（P1，借鉴 TaskPlane merge agent）；
        // agent 不可用（headless host 未实现 spawnMerger）或仍失败 → failed 保留现场。
        const merger = config.host.spawnMerger
        if (!merger) return first
        laneLog(lane, `merge failed (${first.stderr.slice(0, 120).trim() || 'git lock/state error'}) — spawning merger agent`)
        // merger 卡住时不能阻塞 serializedMerge 队列：看门狗超时（P3，借鉴 TaskPlane
        // merge timeout）。超时 = 保留现场返回 unresolved，agent 会话由 spawner finally 收尾。
        const mergerTimeoutMin = config.mergerTimeoutMinutes ?? 10
        const mergerPromise = (async () => {
          // 必须绑定 host：方法解引用后 this 会丢（ES class 方法）。
          return merger.call(config.host, {
            orchWorktree: paths.orchWorktree,
            laneBranch: wt.branch,
            taskId: task.id,
            repoRoot: config.repoRoot,
            verifyCommands: config.mergeVerifyCommands,
          })
```

</details>

**依据 4 · 源码核查**：[src/orchestrator/engine.ts:645-653](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L645-L653)

substring旧review。

```text
  private readLatestVerdict(taskFolder: string): 'PASS' | 'REVISE' | 'none' {
    const reviewsDir = join(taskFolder, '.reviews')
    if (!existsSync(reviewsDir)) return 'none'
    const files = readdirSync(reviewsDir).filter((f) => f.endsWith('.md')).sort()
    if (files.length === 0) return 'none'
    const latest = readFileSync(join(reviewsDir, files[files.length - 1]!), 'utf-8')
    if (latest.includes('REVISE')) return 'REVISE'
    if (latest.includes('PASS')) return 'PASS'
    return 'none'
```

**依据 5 · 源码核查**：[src/worker/merger.ts:65-71](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/merger.ts#L65-L71)

关键词结论。

```text
      }))
      await agent.whenIdle()
      const text = lastAssistantText(agent)
      const resolved = /\bCONFLICT_RESOLVED\b/i.test(text)
      const success = /\bSUCCESS\b/i.test(text)
      const status: MergeStatus = resolved ? 'CONFLICT_RESOLVED' : success ? 'SUCCESS' : 'CONFLICT_UNRESOLVED'
      return { status, summary: text.slice(0, 2000) }
```

**依据 6 · 源码核查**：[src/worker/merger.ts:109-134](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/merger.ts#L109-L134)

verify仅提示。

<details>
<summary>查看原文（26行）</summary>

```text
    '4. `git add <files>` after resolving each file.',
    '5. When all conflicts are resolved, run `git commit --no-edit` to complete the merge.',
    '6. Run the verification commands below after a successful merge.',
    '',
    '## Rules',
    '',
    '- Never delete a worker\'s completed implementation of the task unless it is provably broken.',
    '- Never overwrite previously merged work from other tasks unless the worker change intentionally supersedes it.',
    '- Keep the merge commit; do not amend or squash.',
    `- HARD: do NOT run \`git merge ${request.laneBranch}\` again — the merge is ALREADY in progress`,
    '  (MERGE_HEAD exists) and the lane branch is preserved only as a reference. Resolve the conflicts',
    '  in the working tree, `git add` the resolved files, and `git commit --no-edit` to conclude the merge.',
    '- HARD: do NOT abort the in-progress merge (no `git merge --abort`) unless resolution is impossible;',
    '  if you cannot resolve it, leave the merge state untouched and report CONFLICT_UNRESOLVED.',
    '',
    '## Verification Commands',
    '',
    verify,
    '',
    '## Response',
    '',
    'Finish with a line:',
    '- `CONFLICT_RESOLVED` — conflicts were resolved and the merge was committed.',
    '- `CONFLICT_UNRESOLVED` — you could not resolve the conflicts; leave the merge in progress for manual handling.',
    '- `SUCCESS` — the merge completed with no conflicts.',
    'followed by a short summary of what you did.',
```

</details>

#### 缺口

- 最终产物绑定的接受凭据/强制required checks未实现。
  **影响**：merged不能当业务验收。
  **进一步探讨**：对照空review/缺.seq/旧PASS后失败/blocked/代码后改，假agent与Git状态确认全部拒绝路径。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 权限、dashboard与安装有哪些前提？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

默认in-process host创建内部agent，worker与reviewer主动append danger-full-access和approval never事件并挂bash/fs工具。即使父GUI更收敛也尝试赋子会话全权限；失败catch保ambient。故worktree只是代码工作目录隔离，不是限制读写宿主或联网的权限边界，任务包/邮箱/远端内容必须可信且范围经用户授权。

Dashboard自动拉起的“本地”URL不等loopback绑定。server.listen(port)没指定host，按Node默认全接口；SSE与preflight CORS *，核心api/state和stream无认证分支。网络可达性/防火墙决定暴露面，未实际监听或发请求；任务路径/进度/内容可能对可达者可读，不能按README localhost字符串保证私密。

package Node>=22、多个DSH peer=*，Git当前无lib而prepare编译TS，npm分发含lib与Git安装构建路径不同，需固定宿主服务/模型/工具版本。Config实际laneTimeout default180，注释90，不能只抄注释。HMR/卸载会中止批次的作者提醒有实际生命周期依据，应先保状态再升级。

#### 证据与依据

**依据 1 · 源码核查**：[src/orchestrator/in-process-host.ts:47-64](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/in-process-host.ts#L47-L64)

创建全权限worker。

<details>
<summary>查看原文（18行）</summary>

```text
      const handle = await this.deps.agents.create({
        sessionId: SessionId(`session-${randomUUID()}`),
        // origin 'subagent' keeps worker sessions out of the sidebar's workspace
        // groups (they are internal agents, not user conversations); dispose()
        // tears the session down once the lane turn finishes.
        // taskswarmWorker: 显式标记，供 dsh-dingo 等插件精确识别 TaskSwarm 内部 worker
        // （9fd2634：dingo 用该字段排除内部会话，避免出现在用户卡片清单/统计）。
        meta: { cwd: spec.worktree, origin: 'subagent', taskswarmWorker: true },
        agentOptions: { provider: selection.provider, model: spec.model ?? selection.model },
        setup: (agentCtx) => {
          // Workers are internal agents: grant them full sandbox access with
          // approvals off (per-session, via the DSH delegation event mechanism),
          // then mount the standard tool set when the ambient profile does not
          // provide it, and finally register the lane bridge tools.
          grantWorkerFullAccess(agentCtx as unknown as Context)
          mountStandardTools(agentCtx as unknown as Context)
          registerLaneTools(agentCtx as unknown as { tools: { register(def: unknown): unknown } }, lane)
        },
```

</details>

**依据 2 · 源码核查**：[src/worker/worker-tools.ts:70-91](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/worker-tools.ts#L70-L91)

显式权限事件。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Grant a programmatic worker/reviewer session full sandbox access with
 * approvals pinned to `never` — the same mechanism DSH's subagent delegation
 * uses (`sandbox/mode` + `approval/policy` session events), applied directly
 * on the worker's own session so it is full-access regardless of the GUI
 * session's policy or the deployment environment. The GUI session and the
 * global profile configuration are untouched.
 * @param agentCtx - the agent's scoped creation context (from `agents.create`
 *   setup); the unpublished child session is reached via `agentCtx.agent.session`.
 */
export function grantWorkerFullAccess(agentCtx: Context): void {
  const session = (agentCtx as unknown as {
    agent?: { session?: { append?(type: string, data: unknown): unknown } }
  }).agent?.session
  if (!session?.append) return
  try {
    session.append('sandbox/mode', { mode: 'danger-full-access', source: 'delegation' })
    session.append('approval/policy', { policy: 'never', source: 'delegation' })
  } catch {
    // Non-fatal: the worker still runs under the ambient policy.
  }
}
```

</details>

**依据 3 · 源码核查**：[src/worker/reviewer.ts:80-89](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/worker/reviewer.ts#L80-L89)

reviewer同样全权限。

<details>
<summary>查看原文（10行）</summary>

```text
    const { agent, dispose } = await deps.agents.create({
      sessionId: SessionId(`session-${randomUUID()}`),
      meta: { cwd: request.worktree, origin: 'subagent', taskswarmWorker: true },
      agentOptions: { provider: selection.provider, model },
      setup: (agentCtx) => {
        // Reviewer 也是内部 agent：必须 full access + approvals off（2026-08-16 修复——
        // 此前漏了 grantWorkerFullAccess，reviewer 会话保持默认 workspace-write + ask，
        // 会触发授权提醒）。
        grantWorkerFullAccess(agentCtx as unknown as Context)
        mountStandardTools(agentCtx as unknown as Context)
```

</details>

**依据 4 · 源码核查**：[dashboard/server.mjs:283-291](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/dashboard/server.mjs#L283-L291)

SSE开放。

```text
function handleSSE(req, res, ctx) {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
  })
  // Initial state immediately on connect.
  res.write(`data: ${JSON.stringify(buildState(ctx))}\n\n`)
```

**依据 5 · 源码核查**：[dashboard/server.mjs:323-339](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/dashboard/server.mjs#L323-L339)

CORS/状态。

<details>
<summary>查看原文（17行）</summary>

```text
export function registerCore(router, ctx = {}) {
  // CORS preflight — OPTIONS on any path (browser preflights POST /api/...).
  router.on('OPTIONS', '*', (req, res) => {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    })
    res.end()
  })

  // Live SSE stream — initial state + 2s poll + fs.watch instant push.
  router.on('GET', '/api/stream', (req, res, c) => handleSSE(req, res, c))

  // One-shot full state (dashboard boot fetch before SSE connects).
  router.on('GET', '/api/state', (req, res, c) => {
    sendJson(res, 200, buildState(c))
```

</details>

**依据 6 · 源码核查**：[dashboard/server.mjs:393-407](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/dashboard/server.mjs#L393-L407)

无host绑定。

<details>
<summary>查看原文（15行）</summary>

```text
/** Listen on `port`; resolves with the actual bound port, rejects on error. */
function tryListen(server, port) {
  return new Promise((resolve, reject) => {
    const onError = (err) => {
      server.removeListener('listening', onListening)
      reject(err)
    }
    const onListening = () => {
      server.removeListener('error', onError)
      resolve(server.address().port)
    }
    server.once('error', onError)
    server.once('listening', onListening)
    server.listen(port)
  })
```

</details>

**依据 7 · 源码核查**：[src/orchestrator/index.ts:74-93](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/index.ts#L74-L93)

实际默认配置。

<details>
<summary>查看原文（20行）</summary>

```text
export const Config: z<Config> = z.object({
  repoRoot: z.string(),
  tasksRoot: z.string(),
  stateRoot: z.string(),
  workerModel: z.string(),
  reviewerModel: z.string(),
  mergerModel: z.string(),
  mergeVerifyCommands: z.array(z.string()),
  mergerTimeoutMinutes: z.number().default(10),
  includeDoneTasks: z.boolean(),
  host: z.union([z.const('in-process'), z.const('headless')]).default('in-process'),
  dshBin: z.string(),
  workerProfile: z.string(),
  supervisorMode: z.union([z.const('off'), z.const('interactive'), z.const('supervised'), z.const('autonomous')]).default('supervised'),
  supervisorCheckIntervalMs: z.number().default(60_000),
  supervisorStalledMs: z.number().default(420_000),
  locale: z.union([z.const('auto'), z.const('zh-CN'), z.const('en')]).default('auto'),
  laneTimeoutMinutes: z.number().default(180),
  pauseOnLaneFailure: z.boolean().default(true),
})
```

</details>

#### 缺口

- 各宿主版本权限事件执行和dashboard网络可达策略未确定。
  **影响**：不保证实际可读宿主范围/仅本机，也不称已发生暴露。
  **进一步探讨**：固定部署前审服务契约/绑定地址和访问控制，以假事件/假监听参数确认，不触真实任务。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 三阶段成本与预期效果怎样区分？

**研究主题**：效果与总成本

#### 完整回答

#### 启动与依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=22/DSH agents、commands、sessions、模型/工具 | 编排与内部会话 | peer通配非任意版本保证 |
| Git仓库/可写tasks与.taskswarm/磁盘 | worktree/状态/checkpoint | 非权限沙箱，状态文件非事务日志 |
| 明确任务包/依赖/验收与模型路由 | 分波/worker/reviewer | 依赖环与未知ID不硬阻 |
| 可信任务/Host网络策略 | 全权限agent/dashboard | 需另核访问控制 |

#### 使用流程

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 固定安装 | 处理Git构建/宿主服务/模型 | 核权限与dashboard绑定 |
| 定义任务 | PROMPT/STATUS/文件范围/依赖/验收 | 先check/plan，处理环/缺依赖 |
| 启动 | wave/lane/检查点/报告 | 控制整波并发与token预算 |
| 接受 | 独立required checks绑定最终SHA | 不把none/blocked/关键字当验收 |
| 恢复/集成 | 保留现场，核外部效果再续跑/integrate | 任务变更/未知效果不盲重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Node/构建、Git worktree/模型与工具资源 | 拆任务/验收/权限/网络审查 | 配置工时/包空间未知 |
| 持续使用 | wave整批worker、独立reviewer/merger token、状态/日志/分支磁盘 | 处理语义冲突/审最终结果/维护任务包 | 并行省墙钟不等少token，费用/吞吐未知 |
| 失败恢复 | 保留worktree/重复模型调用/手动冲突修复 | 核代码/任务/外部效果，修状态与补验收 | 无损/恰好一次未证明，恢复耗时未知 |

#### 效果

| 目标 | 当前增量 | 边界 |
| --- | --- | --- |
| 批量项目协作 | 任务包/wave/worktree/报告 | 错依赖/整波并发需审 |
| 持续代码现场 | checkpoint/持久计划 | 非外部效果事务 |
| 交接可读 | 状态/邮箱/dashboard | merged不等accepted，信息可达需控 |

与手工PR+CI/worktree比，潜在减少跟踪和重建上下文，但没有同任务对照，不能断言总成本下降。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:81-106](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/package.json#L81-L106)

构建/Node/脚本。

<details>
<summary>查看原文（26行）</summary>

```text
    "build": "tsc -p tsconfig.json",
    "test": "npm run build && node --test tests/*.spec.mjs",
    "dashboard": "node dashboard/server.mjs",
    "check:tasks": "node scripts/check-tasks.mjs"
  },
  "engines": {
    "node": ">=22.0.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/cordis-plugin-loader": "*",
    "@deepseek-ai/dsh-agent": "*",
    "@deepseek-ai/dsh-agent-default-model": "*",
    "@deepseek-ai/dsh-cmdline": "*",
    "@deepseek-ai/dsh-commands": "*",
    "@deepseek-ai/dsh-llm": "*",
    "@deepseek-ai/dsh-session": "*",
    "@deepseek-ai/dsh-tools": "*",
    "@deepseek-ai/dsh-tool-bash": "*",
    "@deepseek-ai/dsh-tool-fs": "*",
    "@deepseek-ai/dsh-tool-fs-search": "*",
    "@deepseek-ai/dsh-tool-str-replace-editor": "*",
    "@deepseek-ai/schemastery": "*"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/cordis": {
```

</details>

**依据 2 · 源码核查**：[src/orchestrator/engine.ts:237-265](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L237-L265)

持久计划/背景执行。

<details>
<summary>查看原文（29行）</summary>

```text
      repoRoot: this.config.repoRoot,
      tasksRoot: this.config.tasksRoot,
      stateRoot: this.config.stateRoot,
      phase: 'planning',
      scope,
      startedAt: new Date().toISOString(),
      waves: waves.waves.length,
      wavePlan: waves.waves.map((wave) => wave.map((t) => t.id)),
      lanes: [],
    }
    let laneNumber = 0
    for (const [waveIndex, wave] of waves.waves.entries()) {
      for (const task of wave) {
        laneNumber++
        state.lanes.push({ lane: laneNumber, taskId: task.id, phase: 'pending', wave: waveIndex + 1, log: [] })
      }
    }
    writeBatchState(state)
    const ctx = this.makeRunContext(batchId, paths)
    this.active.set(batchId, ctx)
    this.emit({
      type: 'batch-started',
      batchId,
      total: selected.length,
      taskId: scope,
    })
    void this.execute(ctx, waves, state).finally(() => this.active.delete(batchId))
    return { batchId }
  }
```

</details>

**依据 3 · 源码核查**：[src/orchestrator/engine.ts:285-299](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L285-L299)

并发。

<details>
<summary>查看原文（15行）</summary>

```text
      state.phase = 'aborted'
      writeBatchState(state)
      return
    }

    for (const [waveIndex, wave] of waves.waves.entries()) {
      while (ctx.paused && !ctx.aborted) await sleep(250)
      if (ctx.aborted) {
        state.phase = 'aborted'
        writeBatchState(state)
        return
      }
      const lanes = await Promise.all(wave.map((task) => this.runLane(ctx, state, task)))
      for (const lane of lanes) {
        const index = state.lanes.findIndex((l) => l.taskId === lane.taskId)
```

</details>

**依据 4 · 源码核查**：[src/core/worktree.ts:97-108](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/worktree.ts#L97-L108)

checkpoint。

<details>
<summary>查看原文（12行）</summary>

```text
export function checkpointCommit(worktreeDir: string, message: string): { ok: boolean; summary: string } {
  const add = runGit(['add', '-A'], worktreeDir)
  if (!add.ok) return { ok: false, summary: add.stderr }
  const status = runGit(['status', '--porcelain'], worktreeDir)
  if (!status.ok || status.stdout.trim() === '') return { ok: true, summary: 'no changes' }
  const commit = runGit(['commit', '-m', message], worktreeDir)
  if (!commit.ok) {
    if (commit.stderr.includes('nothing to commit')) return { ok: true, summary: 'no changes' }
    return { ok: false, summary: commit.stderr }
  }
  const short = commit.stdout.match(/\[([^\]]+)\]/)
  return { ok: true, summary: short ? short[1] : commit.stdout.slice(0, 60) }
```

</details>

#### 缺口

- 同任务PR+CI基线下的交付正确率、墙钟/token与操作者工时未知。
  **影响**：不量化提效/节省。
  **进一步探讨**：固定任务和验收，以总成本/误接受/恢复次数对照手工编排。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 推荐与进一步探索从何入手？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。项目级外置任务/现场和DSH接线有价值，但依赖计划、权限、最终review/merge验收和dashboard边界需先收敛；不宜把当前默认当可靠自主交付流水线。若在可丢弃无秘密仓库试验，应另设强制CI/人工最终SHA验收、限制并发/预算和网络，不能因模拟测试绿就放宽实际权限。

由缺review可合并、判断未绑SHA和恢复重读任务推导“产物绑定的接受收据”。任务规范/策略/依赖产物/代码SHA与required checks/人工接受绑定，状态区分executed/merged/accepted；未知依赖显式说明已完成证据或阻塞，环拒绝而非同波；恢复按内容变化选择性失效，不盲重跑外部效果。

新假设未实现。先对照简单严格CI+人工验收，矩阵含缺.seq/空review/旧PASS后代码改/blocked/普通merge无check、缺依赖/环、崩溃后任务变更与外部效果unknown。若收据仍接受不匹配SHA/错误前置产物或总管理负担明显增加无误接受下降，假设被反证。跨执行者转交任务包是更远探索，不因存在目录就证明跨团队需求/迁移价值/付费意愿；先观察真实PR交接失败类型。

#### 证据与依据

**依据 1 · 源码核查**：[src/orchestrator/engine.ts:490-526](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L490-L526)

接受边界推导。

<details>
<summary>查看原文（37行）</summary>

```text
    checkpointCommit(wt.dir, `taskswarm: ${task.id} worker exit`)
    const verdict = this.readLatestVerdict(task.folder)
    lane.reviewVerdict = verdict

    const taskStatus = parseStatusFile(task.folder)
    const workerFailed = result.exitCode !== 0
    const notFinished = taskStatus.status !== 'done' && taskStatus.status !== 'blocked'
    if (workerFailed || notFinished) {
      lane.phase = 'failed'
      lane.error = lane.error ?? (workerFailed ? `worker exited ${result.exitCode}` : 'task not marked done')
    } else if (verdict === 'REVISE') {
      lane.phase = 'review'
      lane.error = 'reviewer requested revisions'
    } else {
      markTaskDone(task.folder)
      // orch merge 必须串行（同一 wave 多 lane 并行完成，并发 git merge 会被锁拒绝）。
      const merged = await this.serializedMerge(async () => {
        const first = mergeLane(config.repoRoot, paths, wt)
        if (first.ok) return first
        // merge 失败：现场已保留（lane worktree/branch + orch 冲突状态，P0）。
        // 尝试 LLM merger agent 语义化解冲突（P1，借鉴 TaskPlane merge agent）；
        // agent 不可用（headless host 未实现 spawnMerger）或仍失败 → failed 保留现场。
        const merger = config.host.spawnMerger
        if (!merger) return first
        laneLog(lane, `merge failed (${first.stderr.slice(0, 120).trim() || 'git lock/state error'}) — spawning merger agent`)
        // merger 卡住时不能阻塞 serializedMerge 队列：看门狗超时（P3，借鉴 TaskPlane
        // merge timeout）。超时 = 保留现场返回 unresolved，agent 会话由 spawner finally 收尾。
        const mergerTimeoutMin = config.mergerTimeoutMinutes ?? 10
        const mergerPromise = (async () => {
          // 必须绑定 host：方法解引用后 this 会丢（ES class 方法）。
          return merger.call(config.host, {
            orchWorktree: paths.orchWorktree,
            laneBranch: wt.branch,
            taskId: task.id,
            repoRoot: config.repoRoot,
            verifyCommands: config.mergeVerifyCommands,
          })
```

</details>

**依据 2 · 源码核查**：[src/core/discover.ts:125-148](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/core/discover.ts#L125-L148)

依赖边界推导。

<details>
<summary>查看原文（24行）</summary>

```text
  while (remaining.size > 0) {
    const wave: TaskPacket[] = []
    for (const id of remaining) {
      const task = byId.get(id)!
      const deps = task.deps.filter((dep) => byId.has(dep))
      const missing = task.deps.filter((dep) => !byId.has(dep))
      if (missing.length > 0) unresolved.set(id, missing)
      if (deps.every((dep) => done.has(dep))) wave.push(task)
    }
    if (wave.length === 0) {
      // Dependency cycle — break it by emitting the remaining tasks in order.
      for (const id of remaining) {
        const task = byId.get(id)!
        if (!waves.flat().some((t) => t.id === task.id)) wave.push(task)
      }
      if (wave.length === 0) break
    }
    for (const task of wave) {
      done.add(task.id)
      remaining.delete(task.id)
    }
    waves.push(wave)
  }
  return { tasks, waves, unresolvedDeps: unresolved }
```

</details>

**依据 3 · 源码核查**：[src/orchestrator/engine.ts:721-746](https://github.com/february2015/dsh-taskswarm/blob/032e2c9d228c20cab65fe0ea061d78a7c753ab8c/src/orchestrator/engine.ts#L721-L746)

恢复内容重读。

<details>
<summary>查看原文（26行）</summary>

```text
    let waves: WavePlan
    if (state.wavePlan && state.wavePlan.length > 0) {
      // 用持久化的原始 wave plan；任务仍从磁盘 scope 解析（保留完整任务包上下文）。
      const discovered = scanTasks(this.config.tasksRoot, true)
      const byId = new Map(discovered.map((d) => [d.task.id, d.task]))
      waves = {
        tasks: state.wavePlan.flat().map((id) => byId.get(id)).filter((t): t is NonNullable<typeof t> => !!t),
        waves: state.wavePlan
          .map((ids) => ids.map((id) => byId.get(id)).filter((t): t is NonNullable<typeof t> => !!t))
          .filter((wave) => wave.length > 0),
        unresolvedDeps: new Map(),
      }
      if (skipFailed) {
        const failedIds = new Set(state.lanes.filter((l) => l.phase === 'failed').map((l) => l.taskId))
        waves.waves = waves.waves.map((wave) => wave.filter((t) => !failedIds.has(t.id)))
      }
      if (waves.waves.length === 0) return false
    } else {
      // 兼容旧批次文件（无 wavePlan）：回退到重新计算。
      let selected = this.select(state.scope)
      if (skipFailed) {
        const failedIds = new Set(state.lanes.filter((l) => l.phase === 'failed').map((l) => l.taskId))
        selected = selected.filter((t) => !failedIds.has(t.task.id))
      }
      if (selected.length === 0) return false
      waves = buildWaves(selected.map((t) => t.task))
```

</details>

#### 缺口

- 接受收据/依赖产物失效和跨执行者交接假设未实现且无效果证据。
  **影响**：不计当前创新或交付保证。
  **进一步探讨**：用合成任务/假检查状态对照简单CI，跨团队交接另做真实需求观察。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
