# DSH Task Board

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board)

<!-- BEGIN META -->
[![GitHub ★ 9,562](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C562&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 110,197](https://img.shields.io/static/v1?label=npm+30d&message=110%2C197&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-task-board)
<!-- END META -->

> **功能**：在 DSH Web 界面管理任务，由 Host 执行真实会话、定时调度并记录验证与执行状态。

> **亮点**：把任务、Host调度、会话和验证记录串成可回查执行流程，增量在状态所有权和完成门槛。见[Q01](#research-q01)。

> **主要限制**：卡片列可人工声明，gate只拦识别的goal完成；裁判仍可能语义误判，不能将Done或No False Completion当通用验收。见[Q02](#research-q02)。

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
  - [Q01 · 任务板为谁交付什么，较会话列表或清单增加什么？](#detail-section-11)
  - [Q02 · Host如何拥有状态并阻止未通过的goal完成？](#detail-section-12)
  - [Q03 · 调度、权限和故障恢复依赖什么？](#detail-section-13)
  - [Q04 · 哪些任务值得试用，怎样检验验收闭环？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH的维护者可管理可回查的巡检/评审任务和子任务。

外部清单加原生DSH会话/人工验收为基线；不把卡片或裁判分数当独立业务效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 任务与执行记录 | 追踪真实Host工作 | 手工列移动不同于执行完成 |
| cron/一次性调度 | 后台启动任务 | Host在线、模型及权限已配 |
| goal完成门槛 | 要求验收证据通过 | 仅识别的goal路径，LLM语义可能误判 |
| Agent任务工具 | 对话管理同一看板 | 真实配额与权限限制仍适用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH>=0.2.1-rc.3及会话服务 | 必需 | 真实执行与UI | 不能据卡片出现认定执行可用 |
| 模型与裁判路线 | 对应执行/验收必需 | 任务及质量裁决 | 异常应保持非质量判定 |
| Host持续运行 | 后台必需 | cron与监测 | 浏览器可关不等于Host可停 |
| 权限确认与HTTP信任 | 必需 | 限执行和管理范围 | 不放宽到任意公网 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份ledger/工作区，核模型和权限 | 任务范围无外部写入 |
| 执行 | Host开启卡片会话 | session/工作区与卡片一致 |
| 验收 | 裁判给证据，用户核真实差异 | 不以Done列单独证明完成 |
| 恢复 | 停调度，核终态/预算与副作用 | 结果未知先人工对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 插件/Host和模型资源；金额未知 | 备份ledger、选工作区与权限 | 不启外部副作用 |
| 持续使用 | 会话、裁判token、轮询、防休眠 | 复核任务与验收证据 | 总消耗和节时未知 |
| 失败恢复 | 重试会话/裁判与日志 | 核终态、异常预算、锁和文件变化 | 不盲重跑结果未知任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| Host执行 | ledger与会话接线 | 重启并发端到端效果 |
| 完成门槛 | goal complete前裁判与异常分预算 | 业务合格率、裁判误放/误拒 |
| 后台调度 | Host独立于浏览器 | 机器休眠/断电及副作用恢复 |

> **思考**：卡片列可人工声明，gate只拦识别的goal完成；裁判仍可能语义误判，不能将Done或No False Completion当通用验收。见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把任务、Host调度、会话和验证记录串成可回查执行流程，增量在状态所有权和完成门槛。见[Q01](#research-q01)。

权威ledger、fsync/rename与请求指纹，以及质量/异常/无效验收分预算值得复用；移植需持久会话、工具生命周期和权限服务，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

卡片列可人工声明，gate只拦识别的goal完成；裁判仍可能语义误判，不能将Done或No False Completion当通用验收。见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

临时工作区单任务试用，分开手工列、执行终态和验证结果；先保留人工验收。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

权威状态和goal完成门槛有源码支持；LLM裁判正确性、重启恢复与外部副作用未验，证据范围摘要为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-task-board/README.md、packages/dsh-task-board/package.json、packages/dsh-task-board/src/index.ts、packages/dsh-task-board/src/host-ledger.ts、packages/dsh-task-board/src/host/verification-gate.ts、packages/dsh-task-board/src/host-routes.ts 及固定范围 inventory；组件：packages/dsh-task-board。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读任务板组件核心状态、goal门槛与HTTP信任；未执行目标代码或宿主，不验GitHub扩展及所有远程/团队路径。
- 下一步：固定无外部写入任务并注入实现错误、裁判异常和Host重启，核误放/误拒、一次执行记录与人工恢复成本。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.11（[固定提交 dbf0248](https://github.com/zhu1090093659/dsh-web/tree/dbf0248fd8b2a77a3aeb44ae9688d936ba143303)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是默认区分手工声明、Host执行和证据验收及副作用状态；固定卡片理解测试无减误信则不推广。见[Q04](#research-q04)。

固定无外部写入任务并注入实现错误、裁判异常和Host重启，核误放/误拒、一次执行记录与人工恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 503 | — | — | 27326 |
| .ts | source | 72 | 21296 | 12961 | 7143 | — |
| .tsx | source | 23 | 6783 | 5289 | 1244 | — |
| .ts | test | 80 | 22615 | 16254 | 3913 | — |
| .tsx | test | 29 | 7325 | 5177 | 1242 | — |

</details>

**活跃度**

[![Issue 未关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 192](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=192&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-27T02%3A07%3A21.762Z..2026-10-27T02%3A07%3A21.762Z) [![近30天关闭 195](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=195&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A07%3A21.762Z..2026-10-27T02%3A07%3A21.762Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查Host权威任务板怎样把卡片推进为真实会话执行和验收

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务板为谁交付什么，较会话列表或清单增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是已经在DSH反复执行巡检、评审或多子任务工作的开发者。合格交付不是卡片进Done，而是指定工作区真实会话执行、可定位的结果与所需验证。相对外部清单加手工会话，Host权威ledger把任务、调度、会话和执行记录关联，关闭浏览器后流程仍由Host管理；父卡运行一个会话，子任务交给该会话按依赖分派，不能把卡片数当Host自动打开的会话数。源码级可识别贡献在状态所有权和交付门槛集成，非看板外观。人工move-done仍可只改列，作者也标识列与执行不一致，故界面完成不能成为业务完成证明。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:18-23](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/README.md#L18-L23)

作者描述Host任务执行、父卡分派和验证主张

```text
A hot-pluggable DeepSeek Harness (DSH) Web GUI and official desktop client task automation plugin with a Host-authoritative task ledger, real DSH agent session execution, cron background scheduling, cross-platform idle-sleep protection, parent-card subtask dispatch, and automated verification quality gates. It executes unattended background workflows including automated code reviews, routine health checks, and scheduled pipelines without requiring an open browser window. It mounts cleanly via `cordis.patch.yml` and profiles without modifying DSH core code.

- Host-authoritative architecture and offline background execution: The browser is merely an asynchronous view; closing tabs or dropping connections will not interrupt Host scheduling, session execution, or atomic ledger settlement. Built-in cross-platform sleep inhibition (macOS, Windows, Linux) allows screens to power down while preventing system idle sleep for reliable unattended automation.
- Parent-card dispatch over subtask trees: a task can carry subtasks, one to three levels deep as the deployment allows. Running a card opens one session, that card's own: the Host opens nothing for its subtasks, and that session reads them with `task_board_get`, dispatches them with `subagent` in dependency order, and writes their conclusions back with `task_board_manage` before it finishes. A card whose subtasks are still unfinished runs under the liangshen dispatcher preset.
- Double-blind adversarial judge quality gates (No False Completion): Intercepts false agent completion claims; requires verification by an independent Judge Model using strict coding criteria, a 0.65 threshold, two-round A/B position swapping, and validation against real workspace filesystem diffs, returning actionable diagnostics for self-repair.
- Automated GitHub loop, freeze handover, and agent tool surface: Real-time bidirectional GitHub Issues sync automates agent bug fixing and PR creation; supports `<<<FREEZE` session context snapshots with handover packages; exposes 8 native model tools for autonomous planning and external execution registration.
```

**依据 2 · 作者声明**：[packages/dsh-task-board/README.md:55-56](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/README.md#L55-L56)

工具与external outcome/人工列移动区别

```text
- **Agent tools**: every session gets eight model-facing tools (`task_board_list`, `task_board_get`, `task_board_create`, `task_board_update`, `task_board_set_parent`, `task_board_run`, `task_board_manage`, `task_board_schedule`) that drive the same Host ledger the browser drives, so an agent can list the board, create subtasks, link or detach them, start a run, move a card to any column (declaring it done, failed, or in progress without a run), archive/restore/delete it, settle a card the board can no longer observe, and arm its cron schedule from the conversation.
- **External outcomes (issue #1826)**: work that is not executed by this Host — an agent outside DSH such as Codex or Claude Code, running its own model — can be recorded as a real run rather than a bare column edit. `task_board_manage(action: 'record-external-outcome', result: 'succeeded'|'failed', initiatedBy: <who>)` appends an execution record carrying the verdict, the caller and an optional summary, and the terminal column is derived from that same record by the same rule a Host settlement uses (`core/tasks.ts` `settledStatus`). The record is marked `external`, never carries a session, and is refused while the card still has an open execution (while this Host is running the card it stays the only authority) and on an archived card. `running` and `cancelled` cannot be recorded this way: those stay Host-only. A manual `move-done`/`move-failed` remains available and still writes only the column — the difference is that this one leaves a record behind, so the column and the run history can never disagree.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Host如何拥有状态并阻止未通过的goal完成？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

ledger文档含revision、tasks、scheduler和近期request指纹，落盘用同目录临时文件、fsync后rename；配合独占锁与进程身份检查限制同时写入。浏览器被设计为异步视图，确认状态来自Host。验证门槛确实在tool pre-execute识别update_goal(action=complete)，异常fail-closed；它将质量失败、模型/环境异常、无效验收分别记预算，防止超时直接当质量失败。gate只覆盖被识别的goal完成调用，普通卡片移动和外部结果记录是不同语义；“No False Completion”不能从一个拦截点扩大成所有交付均正确。LLM裁判仍需有效证据、适用模型和工作区变化输入，结构校验比提示单独强，但不能消除语义误判。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:38-55](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host-ledger.ts#L38-L55)

状态文档含请求指纹与revision

<details>
<summary>查看原文（18行）</summary>

```text
  importedSources?: string[]
}

interface PersistedRequest {
  requestId: string
  fingerprint: string
}

/** On-disk document of any schema generation (schemaVersion untyped until the load branches decide). */
type ParsedLedgerDocument = Omit<Partial<LedgerDocument>, 'schemaVersion'> & { schemaVersion?: unknown }

interface LedgerDocument {
  schemaVersion: typeof TASK_BOARD_SCHEMA_VERSION
  revision: number
  tasks: TaskRecord[]
  scheduler: PersistedScheduler
  recentRequests: PersistedRequest[]
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1824-1841](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host-ledger.ts#L1824-L1841)

临时文件fsync/rename提交

<details>
<summary>查看原文（18行）</summary>

```text
  private commit(bumpRevision = true): void {
    if (bumpRevision) this.document.revision += 1
    mkdirSync(dirname(this.file), { recursive: true })
    const tmp = `${this.file}.tmp-${process.pid}`
    let fd: number | undefined
    try {
      fd = openSync(tmp, 'w', 0o600)
      writeFileSync(fd, JSON.stringify(this.document, null, 2), { encoding: 'utf8' })
      fsyncSync(fd)
      closeSync(fd)
      fd = undefined
      try { chmodSync(tmp, 0o600) } catch { /* Windows ACLs own access */ }
      renameSync(tmp, this.file)
      try {
        const dirFd = openSync(dirname(this.file), 'r')
        try { fsyncSync(dirFd) } finally { closeSync(dirFd) }
      } catch {
        // Windows does not permit fsync on a directory handle; rename remains atomic.
```

</details>

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:13-32](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host/verification-gate.ts#L13-L32)

分开质量/异常/无效验收预算

<details>
<summary>查看原文（20行）</summary>

```text
 * - one acceptance cycle per EXECUTION, spent at most twice: the first failure
 *   returns its findings to the fixing agent, the second ends the cycle;
 * - a repeated completion call during a repair, a new automatic goal round, a
 *   plugin reload and a Host restart all reuse the same cycle rather than
 *   resetting it (the budget is persisted on the execution record);
 * - an anomaly (timeout, authentication, unparseable answer, an unusable judge
 *   route) is recorded separately from a quality verdict and is never treated
 *   as one;
 * - exhausting the anomaly budget does NOT judge the card: an environment that
 *   cannot answer is not the work failing, so the cycle is held open with no
 *   judge call until a user clears the recorded anomalies (issue #1828);
 * - an attempt the time budget ends before any verdict is recorded as its own
 *   stage and charged to no budget at all (issue #1828);
 * - an INVALID acceptance (a veto whose required evidence is missing,
 *   unlocatable, or aimed at the empty-work baseline) is recorded in its own
 *   stage, spends its OWN bounded budget, and never consumes a quality attempt
 *   or fails the card; when that budget is spent the cycle is held for a human
 *   exactly like a spent anomaly budget;
 * - concurrent completion calls for one execution share one acceptance.

```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:450-467](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host/verification-gate.ts#L450-L467)

仅拦update_goal完成并异常拒绝

<details>
<summary>查看原文（18行）</summary>

```text
  return async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    if (exec.name !== 'update_goal') return undefined
    if (actionOf(exec.arguments) !== 'complete') return undefined
    if (exec.agent === undefined) return undefined
    // A call the caller already cancelled is not a policy refusal: let the host
    // produce its own cancellation result.
    if (exec.signal.aborted) return undefined
    try {
      return await evaluate(exec)
    } catch (error) {
      deps.logger.warn('[dsh-task-board] goal acceptance gate failed; the completion claim is refused (fail closed)', error)
      return deny(
        bounded('[任务看板 · 验收异常] 验收流程自身出错，本次完成声明已被拒绝：' + (error instanceof Error ? error.message : String(error))),
        'TASK_BOARD_VERIFICATION_ANOMALY',
        error instanceof Error ? error.message : String(error),
      )
    }
  }
```

</details>

#### 缺口

- 裁判与真实合格交付的一致性、重启并发恢复未实测
  **影响**：不能确认错误完成率或端到端唯一执行
  **进一步探讨**：固定含错误实现和真实异常的任务集，分别核裁判误放/误拒、重启后的预算和执行记录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 调度、权限和故障恢复依赖什么？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

启动依赖DSH>=0.2.1-rc.3及Session/Workspace等宿主服务，后台cron需要Host进程持续运行，防休眠只阻止idle sleep不等于机器断电或系统更新时持续服务。高于宿主默认权限的卡片需人类确认，cron拒未确认权限；模型工具也能管理看板，必须区分任务文本授权与外部副作用权限。HTTP先采用宿主connection的签名浏览器会话裁决，否则经同源标记和loopback/显式代理规则；trustForwardedProxy放宽转发形态，不能当任意公网安全保证。首次需备份ledger并配置模型/工作区/权限，持续有真实会话与裁判调用、轮询和防休眠资源；失败需核Host会话终态、异常预算、锁及部分文件副作用，不能只拖回todo重跑。现金/token、人工恢复和重复副作用概率未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-task-board/package.json:24-27](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/package.json#L24-L27)

DSH版本声明

```text
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

**依据 2 · 作者声明**：[packages/dsh-task-board/README.md:81-83](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/README.md#L81-L83)

运行消耗真实配额及权限确认

```text
- `task_board_run` runs a card now (optionally re-running a settled one) and nothing else: the card gets its own session, the Host opens none for its subtasks, and a card with unfinished subtasks is told which of them its session must dispatch; it consumes real API quota and refuses an unconfirmed above-default permission with `confirmation-required`.
- `task_board_manage` moves a card to any column — the move writes the column and never an execution record, so backlog/todo plan, done/failed declare work that finished outside a tracked run and running parks work that is under way without a session, while a card with an open execution refuses the move until it settles — archives or restores it, deletes it, or settles a running card the board can no longer observe (recording a cancelled verdict with the caller as the reason and returning the card to todo), with the Host's running-task and subtask guards.
- `task_board_schedule` arms, changes, or disarms a card's schedule — a recurring cron rule (optionally capped by `maxRuns`; `0` clears the cap back to unlimited) or a one-shot at an epoch-millisecond `at` — including its IANA time zone (an empty `timeZone` clears it back to the Host zone).
```

**依据 3 · 源码核查**：[packages/dsh-task-board/src/host-routes.ts:203-223](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host-routes.ts#L203-L223)

Host认证与显式代理回退规则

<details>
<summary>查看原文（21行）</summary>

```text
export function isTrustedTaskBoardRequest(req: IncomingMessage, access: ResolvedRouteAccess): boolean {
  const connection = access.connection?.()
  if (connection !== undefined && connection.requestRejection(req) === undefined) return true
  if (!browserSameOriginMarker(req)) return false
  if (isLoopbackRequest(req)) return true
  // The tunnel makes the socket and the Host describe the proxy, so the
  // origin-equality check of the direct fence has nothing to compare on this
  // path; the explicit cross-site marker is then the one signal that separates
  // the operator's own page from a third-party page posting through the tunnel,
  // and it is refused instead of being read as a mere tripwire.
  if (access.trustForwardedProxy()
    && req.headers['sec-fetch-site'] !== 'cross-site'
    && isForwardedLoopbackRequest(req)) return true
  if (!isLoopbackAddress(req.socket.remoteAddress)) return false
  const host = req.headers.host
  if (typeof host !== 'string') return false
  const parsed = parseAuthority(host)
  if (parsed === undefined || parsed.canonical !== host.toLowerCase()) return false
  if (!access.trustedProxyHosts.has(parsed.canonical) || !sameAuthority(req, parsed.url)) return false
  return matchesToken(req.headers[TASK_BOARD_PROXY_TOKEN_HEADER], access.proxyToken)
}
```

</details>

**依据 4 · 源码核查**：[packages/dsh-task-board/src/host-ledger.ts:1876-1890](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host-ledger.ts#L1876-L1890)

损坏锁新鲜时拒绝，人工核无Host后处理

<details>
<summary>查看原文（15行）</summary>

```text
          const owner = JSON.parse(readFileSync(this.lockFile, 'utf8')) as { pid?: unknown; startedAt?: unknown; probe?: unknown }
          if (typeof owner.pid === 'number') pid = owner.pid
          if (typeof owner.startedAt === 'number') ownerStartedAt = owner.startedAt
          ownerExact = owner.probe === 'exact'
        } catch {
          // A power-loss mid-write can leave an empty or truncated lock. Such a
          // lock still fails closed while it is fresh (a live owner may be
          // mid-write); once it is older than the grace window nothing can be
          // writing it, so the leftover is reclaimed instead of blocking every
          // later start until someone deletes it by hand (issue #1528).
          const age = (() => {
            try { return this.now() - statSync(this.lockFile).mtimeMs } catch { return Number.POSITIVE_INFINITY }
          })()
          if (age < UNREADABLE_LOCK_GRACE_MS) {
            throw new Error(`task-board ledger lock is unreadable: ${this.lockFile}; if this is a leftover from an unclean shutdown and no other DSH host is running, remove it manually and retry`)
```

</details>

#### 缺口

- 外部写入任务中断后的副作用与重试去重未全面核查
  **影响**：不适合直接据调度状态放行无人监督部署
  **进一步探讨**：从无外部写入的单任务开始，人工核终态与工作区差异，明确恢复手册后再扩副作用

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些任务值得试用，怎样检验验收闭环？

**研究主题**：采用判断、新假设与验证

#### 完整回答

有宿主和模型配置经验的维护者可在备份临时工作区试用一个无外部写入的巡检/评审任务。相对外部清单，它把卡片、真实会话、调度和验证记录连在Host中；成功标准是能回查一次真实执行并解释裁判结论，而不是卡片绿色。若会话或工作区不符、裁判证据不可定位、异常被当质量失败或结果不明，应停调度并在原生会话人工核差异。由手工列状态与真实执行分离可推导未验证方向：把验收证据的适用范围和外部副作用状态作为默认卡片摘要，明确展示“手工声明、Host已执行、证据已验”三者。最小验证让用户判断一批包含手工Done、失败裁判和unknown会话的卡片，比较误信完成率与判断时间；若标签不减少误信反而变成新分数，就不要推广。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-task-board/README.md:27-29](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/README.md#L27-L29)

列与最新执行不一致会标注，提供推导基线

```text
Cards keep multi-line title and description previews with visible metadata. Previews strip Markdown formatting; task details render description and prompt as safe Markdown without raw HTML or automatic remote images, and content taller than about eight rendered lines is clamped to a fixed height with a fade hint and a "Show more" toggle that expands and collapses it, while shorter content renders untouched with no toggle. Stored task text is unchanged. A bracketed title prefix such as `[Bug]:` renders as a type badge, and the description preview skips issue-form boilerplate (checkbox lists, section headings, empty-field placeholders), preferring a summary section when one exists. A left stripe shows the latest run (running, succeeded, failed, cancelled); a card whose column disagrees with that run is labelled as set by hand. Each column shows the time its cards differ by — created in Backlog/To Do, started while running, settled in Done/Failed — read in the Host time zone. The latest execution session opens straight from the card. Every column header toggles compact single-line cards (Done starts compact, the choice is stored in the browser); Done, Failed and the archive group cards into Today / Last 7 days / Earlier and fold the oldest group once a column holds more than 30 cards, unless a search is active.

- **Task board UI**: the board is the shell's own center-column panel — like the desktop application's Plugins page, it contributes a row to the shell's official sidebar panel list and a page to the layout's center-column seat, so row geometry, the active highlight, the collapsed rail, the label, and language switching are the shell's to own; the board provides five kanban columns, search, task details, archive/restore, execution history, and links to execution transcripts. Every column is reachable by hand, by dragging a card or from the detail view's move menu: the move writes the column and no execution record, so Done or Failed declares work that finished (or failed) outside a tracked run and Running parks work that is under way without a session, while a card the runner is actually executing refuses every move until it settles. Archived tasks are read-only except for restore, delete, and transcript viewing, and cannot run manually or on schedule until restored.
```

**依据 2 · 源码核查**：[packages/dsh-task-board/src/host/verification-gate.ts:450-467](https://github.com/zhu1090093659/dsh-web/blob/dbf0248fd8b2a77a3aeb44ae9688d936ba143303/packages/dsh-task-board/src/host/verification-gate.ts#L450-L467)

门槛的真实覆盖范围

<details>
<summary>查看原文（18行）</summary>

```text
  return async (exec: GateExecution): Promise<PreToolDecision | undefined> => {
    if (exec.name !== 'update_goal') return undefined
    if (actionOf(exec.arguments) !== 'complete') return undefined
    if (exec.agent === undefined) return undefined
    // A call the caller already cancelled is not a policy refusal: let the host
    // produce its own cancellation result.
    if (exec.signal.aborted) return undefined
    try {
      return await evaluate(exec)
    } catch (error) {
      deps.logger.warn('[dsh-task-board] goal acceptance gate failed; the completion claim is refused (fail closed)', error)
      return deny(
        bounded('[任务看板 · 验收异常] 验收流程自身出错，本次完成声明已被拒绝：' + (error instanceof Error ? error.message : String(error))),
        'TASK_BOARD_VERIFICATION_ANOMALY',
        error instanceof Error ? error.message : String(error),
      )
    }
  }
```

</details>

#### 缺口

- 状态标签能否减少用户误信未知
  **影响**：只能作为未验证设计，不能计当前收益
  **进一步探讨**：用相同卡片集做理解测试，记录误判和人工时间

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
