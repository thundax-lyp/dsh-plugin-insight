# DSH Taskboard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[49e9a51](https://github.com/cloader/dsh-taskboard/tree/49e9a5159f995468f5cecdef191badec0c13c42d)

<!-- BEGIN META -->
[![GitHub ★ 78](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=78&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cloader/dsh-taskboard) [![npm 30d 6,697](https://img.shields.io/static/v1?label=npm+30d&message=6%2C697&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-taskboard) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-taskboard)
<!-- END META -->

> **功能**：以持久台账、Agent工具和Web看板连接任务认领、定时执行与人工验收。

> **亮点**：[Q01](#research-q01) 将Agent提交与人完成分开；[Q02](#research-q02) 将持久队列和执行生命周期接到同一台账。

> **主要限制**：[Q03](#research-q03) worktree靠路径纪律，降级可在主目录运行；[Q02](#research-q02) 停插件不等于停止Agent。

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
  - [Q01 · 看板如何把Agent认领和人工完成分开？](#detail-section-11)
  - [Q02 · 执行、取消和调度重启有哪些防重与失败分支？](#detail-section-12)
  - [Q03 · Git隔离、权限与试用退出怎样实际落地？](#detail-section-13)
  - [Q04 · 外部任务同步怎样保护本地改动和凭据？](#detail-section-14)
  - [Q05 · 隔离降级是否应增加执行前确认？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要把DSH多项目任务、执行记录与人验收集中管理的个人或可信协作环境。

在会话里口头派工并手工追踪任务、定时器和Git分支。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务协议 | 认领清单报告与待验收 | Agent不能直接done |
| 持久调度 | 窗口排队及执行追踪 | 模型成本与停止契约 |
| Git辅助 | 任务分支worktree合并 | 会话仍根目录，可降级 |
| 外部导入 | 三方字段合并和冲突 | 自定义源凭据明文落盘 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Web/agents/workspace | 必需 | 台账工具会话界面 | 缺服务无完整执行 |
| 本地磁盘与单机锁语义 | 必需 | 台账及调度窗口 | 损坏拒写需修复重启 |
| 模型提供方 | 执行需要 | 实际Agent任务 | 消耗推理额度 |
| Git与可写项目 | 隔离合并需要 | 任务分支和worktree | 缺失可退原目录 |
| 外部服务器凭据 | 同步可选 | 自定义HTTP源 | 先核可信源与最小权限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份台账并复制测试项目，关cron外部同步 | 只含可丢弃数据 |
| 执行 | 建手动卡核认领、权限和真实写入目录 | 路径正确且无越界 |
| 停止 | 测试Stop等待idle和持久cancelled | 失败保留追踪修复再试 |
| 验收 | 读报告与实际变更后人完成 | 工具不能直接done |
| 退出 | 逐项Stop确认idle再禁插件 | 备份台账会话分支，按dirty检查清理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 副本与worktree占盘，具体量未知 | 核兼容权限和测试取消 | 无宿主实测 |
| 持续 | Agent推理费及定期任务持续运行 | 检查排队过期和证据 | 关浏览器不能停止调度 |
| 维护 | 各worktree依赖安装及分支占盘 | 处理merge冲突和损坏台账 | 不自动解决冲突 |
| 退出 | 备份台账附件及外部配置 | 分别停止Agent与清凭据 | 禁插件保留数据与Agent |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 状态协调 | 版本门及锁内认领拒绝 | 真实并发和团队误用率 |
| 执行追踪 | 持久窗口、取消优先结算 | 宿主停止和外部副作用 |
| 变更交接 | 分支证据及人完成入口 | 代码质量与节时 |
| 外部导入 | 全页后提交与字段冲突 | 真实API兼容 |

> **思考**：[Q03](#research-q03) worktree靠路径纪律，降级可在主目录运行；[Q02](#research-q02) 停插件不等于停止Agent。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将Agent提交与人完成分开；[Q02](#research-q02) 将持久队列和执行生命周期接到同一台账。

[Q02](#research-q02) 结算与调度有明确守卫；[Q03](#research-q03) worktree不是写沙箱且权限设置可静默失败。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) worktree靠路径纪律，降级可在主目录运行；[Q02](#research-q02) 停插件不等于停止Agent。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先副本手动卡验证停止和路径，再开调度。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态覆盖任务门、持久化、取消恢复、调度、Git及外部同步，未运行目标。

- 已检查：作者 README、包清单、源码路径 src/host/execution.ts、src/host/external-config.ts、src/host/external-http.ts、src/host/external-sync.ts、src/host/git.ts、src/host/isolation.ts、src/host/ledger-lock.ts、src/host/scheduler.ts、src/host/store.ts、src/host/tools.ts、src/index.ts、src/shared/external.ts、src/shared/protocol.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根DSH插件台账、模型工具、Web控制、执行调度、Git和外部导入；未把项目认领等同多租户授权。
- 下一步：测试双写版本、取消启动、断电重启、隔离退化及外部冲突，均尚未执行。

**分析版本**

- **仓库**：[cloader/dsh-taskboard](https://github.com/cloader/dsh-taskboard)
- **版本号**：0.9.11（[固定提交 49e9a51](https://github.com/cloader/dsh-taskboard/tree/49e9a5159f995468f5cecdef191badec0c13c42d)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 强制隔离任务降级前确认是否减少误写需对照等待代价。

测试双写版本、取消启动、断电重启、隔离退化及外部冲突，均尚未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1643 | — | — | 42858 |
| .ts | source | 54 | 17476 | 13509 | 3089 | — |
| .tsx | source | 12 | 5167 | 4527 | 405 | — |
| .ts | test | 50 | 15930 | 13320 | 1259 | — |
| .tsx | test | 8 | 1193 | 1070 | 60 | — |
| .mjs | test | 2 | 249 | 183 | 40 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/cloader/dsh-taskboard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：任务看板怎样把认领、执行、调度和人工验收接成闭环，隔离及恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 看板如何把Agent认领和人工完成分开？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

host提供持久任务台账、工具、Web路由与实时界面。Agent写操作要求ifVersion，move在store.mutate内重新读当前卡，拒绝done、非法迁移和别的会话持有任务；认领时要求自己项目或显式开启的linked roots覆盖目标项目。验收清单勾选和执行报告是Agent交接材料，不能单凭它们宣称任务真实完成。Web人工完成是另一条user入口，因而“人完成”是调用入口语义，不能等同可信身份认证。

项目认领边界并非全表读ACL：list未传workspaceId时遍历所有任务，get也应按实际工具约束使用，不能由认领检查推导多租户隔离。所有突变在进程内lane及跨进程目录锁内重载台账，克隆修改、提升revision、临时文件fsync+rename后才发布。锁用PID唯一owner，仅ESRCH确认死进程，EPERM保留；不同主机共享盘/恶意同用户不在此证据保证内。加载损坏拒读写保留原件，不是默默重建空板。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/tools.ts:760-812](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/tools.ts#L760-L812)

版本、完成拒绝与认领范围

<details>
<summary>查看原文（53行）</summary>

```text
        const to = asStatus(args.status)
        // Claim boundary (policy gate): resolving the caller's workspace is
        // async, so it happens BEFORE the mutation — the comparison runs INSIDE
        // against the FRESH task (stronger than the old stale-clone compare).
        const claimScope = to === 'in_progress'
          ? await callerClaimScope(deps, exec as ToolRunContext)
          : undefined
        // R1: every state guard + the write itself run inside the mutation.
        let next: TaskRecord | undefined
        let beforeTask: TaskRecord | undefined
        await store.mutate('task-moved', ledger => {
          const { index, task } = liveTaskAt(ledger, args.id)
          versionGuard(task, args.ifVersion)
          beforeTask = task

          // Code-level gate: agents never complete a task.
          if (to === 'done') {
            throw new ToolError(ERR.forbidden, 'moving a task to done requires explicit user confirmation (GUI); agents cannot do it')
          }
          if (!canTransition(task.status, to)) {
            throw new ToolError(ERR.invalidTransition, `illegal transition ${task.status} → ${to}`)
          }
          // Exclusive hold: while a task is in_progress under a session
          // (explicit claimedBy — an agent claim or a live execution), no other
          // session may move it (that would be a takeover).
          exclusiveHoldGuard(task, actor.sessionId)
          // Claim boundary: the calling session must belong to the task's
          // project — either through its own workspace root (historical rule)
          // or, when the board enables it, through one of its linked multi-root
          // workspace roots.
          if (isClaim(task.status, to)) {
            const linkedClaim = allowClaimFromLinkedRootsOf(ledger.settings) && claimScope !== undefined
            const reached = claimScope?.wsId === task.workspaceId
              || (linkedClaim && claimScope!.linkedWsIds.has(task.workspaceId))
            if (!reached) {
              throw new ToolError(
                ERR.workspaceMismatch,
                allowClaimFromLinkedRootsOf(ledger.settings)
                  ? 'only a session inside this task\'s project (or one of its linked workspace roots) may claim it'
                  : 'only a session inside this task\'s project may claim it',
              )
            }
          }
          next = structuredClone(task)
          next.status = to
          next.version = task.version + 1
          next.updatedAt = deps.now()
          next.updatedBy = actor
          if (isClaim(task.status, to)) next.blocked = false
          // Record the holder on a claim; every move out of in_progress releases it.
          syncClaim(next, to, deps.now(), isClaim(task.status, to) ? actor.sessionId : undefined)
          ledger.tasks[index] = next
          return [next]
```

</details>

**依据 2 · 源码核查**：[src/host/tools.ts:479-496](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/tools.ts#L479-L496)

无项目过滤查询全表

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      try {
        const a = args as { workspaceId?: string; status?: string; urgency?: string; includeTrashed?: boolean }
        const workspaceId = a.workspaceId === undefined ? undefined : await resolveWorkspaceArg(deps, a.workspaceId)
        if (a.workspaceId !== undefined && workspaceId === undefined) {
          throw new ToolError(ERR.notFound, await unknownWorkspaceDetail(deps, exec as ToolRunContext, a.workspaceId))
        }
        if (a.status !== undefined) asStatus(a.status)
        if (a.urgency !== undefined) asUrgency(a.urgency)
        const tasks = store.snapshot().tasks.filter(t =>
          (workspaceId === undefined || t.workspaceId === workspaceId)
          && (a.status === undefined || t.status === a.status)
          && (a.urgency === undefined || t.urgency === a.urgency)
          && (a.includeTrashed === true || t.trashedAt === undefined))
        return json({ revision: store.snapshot().revision, tasks: tasks.map(summarize) })
      } catch (error) { fail(error) }
    },
  })) as () => void)
```

</details>

**依据 3 · 源码核查**：[src/host/store.ts:255-288](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/store.ts#L255-L288)

锁内重读持久后发布

<details>
<summary>查看原文（34行）</summary>

```text
  async mutate(
    kind: LedgerChange['kind'],
    mutator: (ledger: TaskLedger) => TaskRecord[] | undefined,
  ): Promise<{ ledger: TaskLedger; changed: readonly TaskRecord[] }> {
    const run = async (): Promise<{ ledger: TaskLedger; changed: readonly TaskRecord[] }> => {
      await this.load()
      const file = this.file
      return this.inProcessWriteLane(file, async () => withLedgerWriteLock(file, async () => {
        // A different TaskStore may have committed while this instance waited.
        // Reload under the lock: a cached-revision check before it leaves a
        // TOCTOU window in which two writers emit the same next revision.
        await this.reload()
        const draft: TaskLedger = structuredClone(this.ledger)
        const changed = mutator(draft)
        if (changed === undefined) return { ledger: deepFreeze(structuredClone(this.ledger)), changed: [] }
        for (const task of changed) pruneExecutions(task)
        draft.revision += 1
        await persistAtomic(file, JSON.stringify(draft))
        this.hasReadLedger = true
        this.ledger = draft
        const change: LedgerChange = { revision: draft.revision, tasks: changed, kind }
        for (const fn of this.subscribers) {
          try {
            fn(change)
          } catch { /* subscriber errors never abort the write */ }
        }
        return {
          ledger: deepFreeze(structuredClone(draft)),
          changed: changed.map(t => deepFreeze(structuredClone(t))),
        }
      }))
    }
    if (this.storageQueue !== undefined) return this.storageQueue.run(run)
    return (this.queue = this.queue.then(run, run)) as ReturnType<typeof run>
```

</details>

**依据 4 · 源码核查**：[src/host/store.ts:318-334](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/store.ts#L318-L334)

fsync与rename

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Atomic file persist: write temp, fsync, then rename over the target (S10:
 * without the sync, a power loss after rename can leave a zero-length file —
 * the next load would refuse the damaged ledger).
 */
async function persistAtomic(file: string, contents: string): Promise<void> {
  await mkdir(dirname(file), { recursive: true })
  const temp = join(dirname(file), `.${Math.random().toString(36).slice(2)}.tmp`)
  const fh = await open(temp, 'w')
  try {
    await fh.writeFile(contents, 'utf8')
    await fh.sync()
  } finally {
    await fh.close()
  }
  await rename(temp, file)
}
```

</details>

**依据 5 · 源码核查**：[src/host/ledger-lock.ts:14-21](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/ledger-lock.ts#L14-L21)

死进程判断

```text
/** Only ESRCH establishes that a process is dead; EPERM is not evidence. */
function ownerState(token: string): 'alive' | 'dead' | 'unknown' | 'legacy' {
  const match = /^([1-9]\d*):\d+:[a-z0-9]+$/.exec(token)
  const pid = match === null ? NaN : Number(match[1])
  if (!Number.isSafeInteger(pid) || pid <= 0 || pid > 0x7fffffff) return 'legacy'
  try { process.kill(pid, 0); return 'alive' } catch (error) {
    return (error as NodeJS.ErrnoException).code === 'ESRCH' ? 'dead' : 'unknown'
  }
```

**依据 6 · 源码核查**：[src/host/store.ts:198-206](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/store.ts#L198-L206)

损坏拒绝恢复

```text
      this.hasReadLedger = true
      this.loaded = true
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error)
      this.loadFailure = new Error(`taskboard_ledger_unavailable: cannot load ${this.file}: ${reason}. `
        + 'Original files retained; writes and attachment cleanup are blocked. '
        + 'Repair or restore the ledger at this path, then restart DSH.', { cause: error })
      console.warn('[dsh-taskboard] ledger load failed; recovery required:', this.loadFailure.message, error)
      throw this.loadFailure
```

#### 缺口

- 真实人机权限和跨主机文件系统锁语义未实测
  **影响**：不能作为多租户授权或分布式队列
  **进一步探讨**：单机独立profile验证版本冲突和跨项目读写

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 执行、取消和调度重启有哪些防重与失败分支？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

执行先在写锁内检查任务状态、调度窗口、claim和台账全局运行数，再建立running记录，减少创建Agent的启动空窗重复派发。真正启动后仍复查running及取消意图，取消中的任务不会继续注入新prompt。结算按cancelled高于failed高于success选择未提交意图；取消等待stopRun完成，settle在写锁内还检查stopped。借用现存Agent时cancel+whenIdle，fresh handle的停止依赖宿主dispose契约。保存失败保留追踪和容量预留，有限重试耗尽后要求修复磁盘再Stop或重载，不能把按钮点击当停止成功。

热重载会收养live agent，真正重启找不到live的running记录标failed并退todo；这表示观测中断，不证明远端工具副作用回滚。scheduler无浏览器按分钟tick，单活pass、队列窗口落盘且cron推进一起提交；重启恢复孤立dispatching到队列，过期队列可丢弃并留下说明，不保证逐个补齐错过周期。执行service.dispose只解绑监听/清retry并清内存runs，没有循环取消live agent，禁用插件不能作为停止所有Agent的动作。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/execution.ts:579-625](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L579-L625)

锁内执行门和容量

<details>
<summary>查看原文（47行）</summary>

```text
    await this.deps.store.mutate('execution-recorded', (ledger) => {
      const target = ledger.tasks.find(t => t.id === taskId)
      if (target === undefined || target.trashedAt !== undefined) {
        gate = `no task ${taskId}`
        return undefined
      }
      // A status may change after the scheduler selected/advanced the task.
      // Recheck at the atomic execution gate so terminal tasks cannot be
      // revived by that race. Only todo fires scheduled (periodic or one-
      // shot); an in_review card is finished work and never refires — a
      // periodic run's successor todo card carries the schedule onward.
      // Manual reruns keep their existing semantics.
      if (trigger === 'scheduled' && target.status !== 'todo') {
        gate = `scheduled task is not actionable (${target.status})`
        return undefined
      }
      if (trigger === 'scheduled' && options?.scheduledWindow !== undefined
        && target.execution.dispatchingRunAt !== options.scheduledWindow) {
        gate = 'scheduled dispatch is no longer queued'
        return undefined
      }
      // Issue #51 Plan A: a comment wake is the acceptance-review loop — it
      // only fires on an in_review card. Rechecked INSIDE the gate (not just
      // at the route) so a card that moved between route check and this
      // mutation can never be woken by a stale delivery.
      if (trigger === 'comment' && target.status !== 'in_review') {
        gate = `comment wake requires in_review (current ${target.status})`
        return undefined
      }
      // Refuse while work is IN FLIGHT: a live execution, or a session holding
      // the claim. Status alone is not the test — a card moved back to
      // in progress by the user, or left behind by a run whose host died,
      // is in progress with nothing holding it, and refusing that made the
      // card unrunnable until it was pushed back through todo (issue #50).
      // A run that passes this gate re-claims the card, so the orphan state
      // repairs itself instead of persisting.
      if (target.executions.some(e => e.outcome === 'running') || target.claimedBy !== undefined) {
        gate = 'task is already in progress'
        return undefined
      }
      // S4: authoritative capacity check INSIDE the gate — counts ledger-wide
      // running executions, immune to the startup window (`runs` registers
      // only after agent creation, seconds later).
      const running = ledger.tasks.reduce((n, t) => n + t.executions.filter(e => e.outcome === 'running').length, 0)
      if (running >= max) {
        gate = `execution concurrency limit reached (${running}/${max} running)`
        return undefined
```

</details>

**依据 2 · 源码核查**：[src/host/execution.ts:791-803](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L791-L803)

启动取消守卫

<details>
<summary>查看原文（13行）</summary>

```text
    // cancel() that landed inside that window already settled the execution
    // (cancelled + task back to todo) — with nothing registered in `runs`,
    // it could not dispose the agent this path was about to create. Re-verify
    // INSIDE the queue (after any enqueued cancel committed) BEFORE injecting:
    // a cancelled card must not gain a zombie session that burns tokens and
    // edits files while the task sits in todo, re-runnable by anyone.
    const stillRunning = await this.deps.store.read(ledger =>
      ledger.tasks.some(t => t.executions.some(e => e.id === executionId && e.outcome === 'running')))
    if (!stillRunning || this.runs.get(executionId)?.settlement?.outcome === 'cancelled' || this.disposed) {
      if (!handle.borrowed) await handle.dispose().catch(() => { /* best effort */ })
      // S1: do not leave the startup artifacts behind a cancelled run either.
      await this.cleanupMirror(prepared, workspace.path)
      return { ok: false, error: 'cancelled during startup' }
```

</details>

**依据 3 · 源码核查**：[src/host/execution.ts:370-419](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L370-L419)

结算优先和等待stop

<details>
<summary>查看原文（50行）</summary>

```text
  /** Cancellation wins over an uncommitted failure, which wins over success. */
  private requestSettlement(executionId: string, outcome: PendingSettlement['outcome'], error?: string, retryNow = false): Promise<boolean> {
    const entry = this.runs.get(executionId)
    if (this.disposed || entry === undefined) return Promise.resolve(false)
    const priority = { succeeded: 0, failed: 1, cancelled: 2 }
    let pending = entry.settlement
    if (pending === undefined) {
      pending = { outcome, error, endedAt: this.deps.now(), attempts: 0 }
      entry.settlement = pending
    } else if (priority[outcome] > priority[pending.outcome]) {
      pending.outcome = outcome
      pending.error = error
      pending.endedAt = this.deps.now()
      retryNow = true
    }
    if (retryNow && pending.retry !== undefined) {
      clearTimeout(pending.retry)
      pending.retry = undefined
    }
    if (pending.writing !== undefined) return pending.writing
    if (retryNow) pending.attempts = 0
    if (pending.retry !== undefined || (!retryNow && pending.attempts > 0)) return Promise.resolve(false)
    return this.writeSettlement(executionId, entry, pending)
  }

  /** Bounded retries keep both the outcome intent and concurrency reservation. */
  private writeSettlement(executionId: string, entry: RunEntry, pending: PendingSettlement): Promise<boolean> {
    const write = async (): Promise<boolean> => {
      pending.attempts += 1
      try {
        if (pending.outcome === 'cancelled') await this.stopRun(entry)
        else await entry.stopping
        if (this.disposed || this.runs.get(executionId) !== entry) return false
        await this.flushCommentDelivery(executionId, entry)
        let settled = await this.settleExecution(executionId, entry.sessionId, entry.prepared, pending)
        // Cancellation may arrive after this attempt entered the store queue.
        // A skipped write waits for the agent stop before trying its new intent.
        if (!settled && !this.disposed) {
          await entry.stopping
          settled = await this.settleExecution(executionId, entry.sessionId, entry.prepared, pending)
        }
        if (!settled) return false
        if (this.runs.get(executionId) === entry) this.runs.delete(executionId)
        this.lastActivityAt.delete(entry.sessionId)
        return true
      } catch (error) {
        if (this.disposed || this.runs.get(executionId) !== entry) return false
        const delays = this.deps.settlementRetryDelaysMs ?? SETTLEMENT_RETRY_DELAYS_MS
        const delay = delays[pending.attempts - 1]
        console.error(`[dsh-taskboard] settlement ${executionId} (${pending.outcome}, ${this.deps.store.location()}) write failed; ${delay === undefined ? 'automatic retries exhausted; restore storage and retry Stop or reload the plugin' : `retrying in ${delay}ms`}:`, error)
```

</details>

**依据 4 · 源码核查**：[src/host/execution.ts:1168-1198](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L1168-L1198)

借用Agent取消和持久结果

<details>
<summary>查看原文（31行）</summary>

```text
  async cancel(taskId: string): Promise<CancelRequestResult> {
    const task = this.deps.store.get(taskId)
    if (task === undefined) return { ok: false, error: `no task ${taskId}` }
    const running = [...task.executions].reverse().find(e => e.outcome === 'running')
    if (running === undefined) return { ok: false, error: 'no running execution' }

    let entry = this.runs.get(running.id)
    if (entry === undefined) {
      const sessionId = running.sessionId ?? task.claimedBy ?? ''
      const live = this.deps.liveAgent?.(sessionId)
      // External-session sync records executions without owning their agents.
      // Borrow the live registry handle to stop activity without disposing it.
      // Startup cancellation can still precede creation of any live agent.
      entry = {
        sessionId,
        prepared: this.preparedFromExecution(running),
        dispose: async () => {
          if (live !== undefined) { live.cancel({ kind: 'user' }); await live.whenIdle() }
        },
      }
      this.runs.set(running.id, entry)
    }
    // Register cancellation before dispose can resolve the idle watcher.
    // Repeated Stop requests share the same agent stop and in-progress write.
    // Start stopping even when a prior success write already owns the lane;
    // that writer must await this stop before retrying with cancellation.
    void this.stopRun(entry).catch(() => { /* settlement owns stop retries */ })
    const written = await this.requestSettlement(running.id, 'cancelled', undefined, true)
    const outcome = this.deps.store.get(taskId)?.executions.find(e => e.id === running.id)?.outcome
    if (written && outcome === 'cancelled') return { ok: true, executionId: running.id }
    return { ok: false, error: written ? 'execution already settled' : 'cancellation could not be persisted; execution remains tracked for retry' }
```

</details>

**依据 5 · 源码核查**：[src/host/execution.ts:1223-1256](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L1223-L1256)

重启失败和热重载收养

<details>
<summary>查看原文（34行）</summary>

```text
    await this.deps.store.mutate('execution-recorded', (ledger) => {
      if (this.disposed) return undefined
      const now = this.deps.now()
      const touched: TaskRecord[] = []
      for (const task of ledger.tasks) {
        let dirty = false
        for (const execution of task.executions) {
          if (execution.outcome === 'running' && !adopted.has(execution.id)) {
            execution.outcome = 'failed'
            execution.error = 'interrupted by host restart'
            execution.endedAt = now
            dirty = true
          }
        }
        if (!dirty) continue
        if (task.status === 'in_progress') {
          task.status = 'todo'
          task.updatedAt = now
          delete task.claimedBy
          delete task.claimedAt
        }
        touched.push(task)
      }
      return touched.length > 0 ? touched : undefined
    })
    for (const [executionId, entry] of adopted) {
      // A concurrent old-generation settlement may already have finished it;
      // the idempotent settlement mutation below then becomes a no-op.
      const stillRunning = this.deps.store.snapshot().tasks.some(task =>
        task.executions.some(execution => execution.id === executionId && execution.outcome === 'running'))
      if (!stillRunning) continue
      this.adoptLiveRun(executionId, entry.sessionId, entry.agent, entry.prepared)
    }
  }
```

</details>

**依据 6 · 源码核查**：[src/host/scheduler.ts:238-264](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/scheduler.ts#L238-L264)

cron/一次窗口持久排队

<details>
<summary>查看原文（27行）</summary>

```text
  /** Queue one periodic window and advance its next cron time atomically. */
  private async queueCron(taskId: string, now: number, due: number): Promise<void> {
    await this.deps.store.mutate('task-updated', ledger => {
      const task = ledger.tasks.find(t => t.id === taskId)
      if (task === undefined || task.execution.cron === undefined || task.execution.queuedRunAt !== undefined) return undefined
      if (task.status !== 'todo' || task.trashedAt !== undefined || task.execution.nextRunAt !== due) return undefined
      const match = parseCron(task.execution.cron)
      const next = match === null ? undefined : nextCronTime(match, now) ?? undefined
      if (next === undefined) return undefined
      task.execution.nextRunAt = next
      task.execution.queuedRunAt = due
      task.execution.queuedAt = now
      return [task]
    })
  }

  /** Queue a one-shot window atomically, consuming its public runAt field. */
  private async queueRunAt(taskId: string, now: number, due: number): Promise<void> {
    await this.deps.store.mutate('task-updated', ledger => {
      const task = ledger.tasks.find(t => t.id === taskId)
      if (task === undefined || task.execution.runAt !== due || task.execution.queuedRunAt !== undefined) return undefined
      if (task.status !== 'todo' || task.trashedAt !== undefined) return undefined
      delete task.execution.runAt
      task.execution.nextRunAt = undefined
      task.execution.queuedRunAt = due
      task.execution.queuedAt = now
      return [task]
```

</details>

**依据 7 · 源码核查**：[src/host/scheduler.ts:268-286](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/scheduler.ts#L268-L286)

过期丢弃

<details>
<summary>查看原文（19行）</summary>

```text
  /** Consume a durable queue entry without creating an execution: either an
   *  overdue shelf-life drop or a manual queue clear from the board. */
  private async expireQueued(taskId: string, queuedWindow: number, reason: 'expired' | 'cleared' = 'expired'): Promise<void> {
    const now = this.deps.now()
    await this.deps.store.mutate('task-updated', ledger => {
      const task = ledger.tasks.find(t => t.id === taskId)
      if (task === undefined || task.execution.queuedRunAt !== queuedWindow) return undefined
      if (reason !== 'cleared' && !this.isExpired(task.execution.queuedAt, now)) return undefined
      delete task.execution.queuedRunAt
      delete task.execution.queuedAt
      // A dropped queue entry spends a one-shot (its runAt was already
      // consumed at queue time): normalize to claim (#95).
      if (isSpentOneShot(task.execution)) task.execution.mode = 'claim'
      task.comments.push({
        id: newCommentId(),
        body: normalizeBody(reason === 'cleared'
          ? '[系统] 已被手动清出执行队列，本次不再补跑；可手动执行或修改定时。'
          : '[系统] 排队中的定时执行已超过保留时长，本次不再补跑；可手动执行或修改定时。'),
        systemKey: reason === 'cleared' ? 'sys.queueCleared' : 'sys.queuedExpired',
```

</details>

**依据 8 · 源码核查**：[src/host/execution.ts:291-300](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L291-L300)

卸载不停止live agent

<details>
<summary>查看原文（10行）</summary>

```text
  /** Detach the settlement listener; safe to call once at plugin teardown. */
  dispose(): void {
    this.disposed = true
    this.unsubscribeEvents()
    for (const entry of this.runs.values()) {
      if (entry.settlement?.retry !== undefined) clearTimeout(entry.settlement.retry)
    }
    this.runs.clear()
    this.lastActivityAt.clear()
  }
```

</details>

#### 缺口

- 真实宿主dispose、远端工具停机和崩溃恢复未运行
  **影响**：已记录取消不等于所有外部副作用撤销
  **进一步探讨**：先用无副作用测试任务验证Stop、启动取消及磁盘拒写

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Git隔离、权限与试用退出怎样实际落地？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需兼容DSH Web服务、agents/workspace/session等，任务调用实际模型会产生外部推理费用，定期调度可在关浏览器后继续。Git隔离建立各仓库worktree和分支，但session cwd刻意仍为项目根；Agent从开场文字得到worktree路径、workdir和禁止改主目录指令。因此worktree有独立检出便利，却不是阻止Agent写主目录的沙箱。Git缺失或无仓库会退到原目录并记录降级，不是失败关闭；部分仓库镜像失败也靠文字禁止改未镜像主目录。permission默认workspace-write，宿主permissionPresets设置异常被吞，必须在真实宿主读回实际权限。

合并前查主目录未提交改动，有改动拒绝，merge失败尝试abort；status失败时没有显式拒绝便进入merge，不能概括成所有检查失败都拒绝。删除worktree对dirty/unknown拒绝，清理容器只rmdir空目录。试用用可丢弃副本和无副作用卡，先禁cron与外部同步、确认任务实际工作路径/权限，测试一次认领→Stop→待验收，不执行真实合并。退出先逐任务Stop并确认idle，再关闭调度/插件；台账、会话、任务分支和worktree仍可能保留，先备份再按状态清理。不能以插件卸载代替Agent终止。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/execution.ts:652-698](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L652-L698)

Git退化与项目根cwd

<details>
<summary>查看原文（47行）</summary>

```text
    // Check reusable sessions before resetting any scheduled worktree.
    const prepareIsolation = async (): Promise<void> => {
      if (isolation === 'worktree') {
        if (this.deps.git === undefined) {
          isolationNote = 'git 集成不可用，已在原目录执行'
          await this.patchExecution(executionId, { isolation: 'none', isolationNote, branch: undefined, worktreePath: undefined, baseCommit: undefined })
        } else {
          const outcome = await prepareMirror(
            { git: this.deps.git, scanner: this.deps.scanner ?? createRepoScanner() },
            // Comment wake NEVER resets the mirror: the comments review the
            // PREVIOUS run's work, so a fresh checkout would destroy it.
            { workspacePath: workspace.path, taskId: task.id, branch, branches: task.branches, reuse: options?.reuseWorktree === true || trigger === 'comment' },
          )
          if ('mirror' in outcome) {
            prepared = outcome.mirror
            await this.pinBranches(task, prepared)
            // Persist the actual branch too: preparation may have selected a
            // fallback when the pinned branch is occupied. The root keeps
            // the legacy flat fields; other mirrors also record each repo.
            const root = prepared.repos[0]
            await this.patchExecution(executionId, {
              branch: root?.branch,
              worktreePath: root?.worktreePath,
              baseCommit: root?.baseCommit,
              ...(!isLegacySingle(prepared)
                ? { repos: prepared.repos.map(r => ({ repo: r.repo, branch: r.branch, worktreePath: r.worktreePath, baseCommit: r.baseCommit })) }
                : {}),
            })
          } else {
            isolationNote = outcome.note
            // Degraded run: clear the optimistic worktree markers.
            await this.patchExecution(executionId, { isolation: 'none', isolationNote, branch: undefined, worktreePath: undefined, baseCommit: undefined })
          }
        }
      }
    }
    if (trigger !== 'scheduled') await prepareIsolation()

    // 2. Create or resume the agent+session inside the task's project, carrying
    //    the pinned model — or the deployment default when unpinned (the
    //    persona template renders {{model}}, so the session always needs one).
    //    The session cwd is ALWAYS the project root: DSH's session model
    //    requires cwd === the workspace path EXACTLY (attachSession validates
    //    it, the sidebar groups by it, and the file sandbox takes it as the
    //    workspace-write boundary) — a subdirectory cwd (the worktree) breaks
    //    all three. The worktree is instead handed to the agent explicitly in
    //    the framing line below.
```

</details>

**依据 2 · 源码核查**：[src/host/execution.ts:1417-1458](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L1417-L1458)

worktree文字纪律

<details>
<summary>查看原文（42行）</summary>

```text
  /** The shared isolation/degrade section of a framing line (issue #51 extraction). */
  private isolationFraming(prepared: PreparedMirror | undefined, degradeNote?: string): string {
    if (prepared !== undefined) {
      if (isLegacySingle(prepared)) {
        // Byte-identical legacy single-repo steering (0.3.0–0.6.2 wording).
        const only = prepared.repos[0]!
        if (only.reused === true) {
          return `\n本任务启用了 Git Worktree 隔离，且本次为续跑：任务工作目录是独立分支 ${only.branch} 的 worktree——\n${only.worktreePath}\n上一次执行的改动与提交都保留在原处——请先查看已有改动（git status / git log）再继续，避免重复劳动，并把新完成的工作提交到该分支。`
        }
        return `\n本任务启用了 Git Worktree 隔离：任务工作目录是独立分支 ${only.branch} 的全新 worktree——\n${only.worktreePath}\n（全新检出，不含 node_modules/构建产物，构建或测试前可能需要先安装依赖）。\n⚠ 边界纪律：你的会话根目录是整个项目，但本任务的全部改动必须只发生在上述 worktree 目录内——命令用 workdir 指向它、文件读写用它的绝对路径；不要改动主工作区的任何其它文件；把完成的工作提交（git commit）到该分支，验收将基于该分支的提交记录合并。`
      }
      return this.mirrorFraming(prepared)
    }
    if (degradeNote !== undefined) {
      return `\n⚠ 本次执行未能建立隔离，正在主项目目录中工作（原因：${degradeNote}）。该目录可能有他人未提交的改动：动手前先 git status 检查现状，改动尽量集中，结束时在评论中说明动了哪些文件；避免把未经验证的改动直接提交到主分支。`
    }
    return ''
  }

  /**
   * The multi-repo mirror section of the framing line (0.6.3): per-repo
   * checkout list, the (possibly partial) coverage boundary, per-repo commit
   * discipline, and the 禁改 list for repos that failed to mirror.
   */
  private mirrorFraming(mirror: PreparedMirror): string {
    const mode = mirror.allReused ? '续跑' : '全新'
    const lines = mirror.repos
      .map(r => `- ${r.repo === '' ? '根仓库' : r.repo} → ${r.worktreePath}（分支 ${r.branch}${r.reused === true ? '，续跑' : ''}）`)
      .join('\n')
    let text = `\n本任务启用了 Git Worktree 隔离（多仓库镜像模式，本次${mode}）：整个工作区已镜像到任务目录——\n${mirror.root}\n各仓库检出位置与各自任务分支：\n${lines}\n（全新检出的镜像不含 node_modules/构建产物，构建或测试前可能需要先安装依赖）。\n⚠ 边界纪律：你的会话根目录是整个项目，但本任务的全部改动必须只发生在上述任务目录内对应仓库的镜像里——命令用 workdir 指向它、文件读写用它的绝对路径；不要改动镜像之外的任何文件；改动发生在哪个仓库，就把完成的工作提交（git commit）到那个仓库的任务分支，验收将按仓库合并各分支的提交记录。`
    if (mirror.skipped.length > 0) {
      const skipped = mirror.skipped.map(s => `- ${s.repo}（原因：${s.reason}）`).join('\n')
      text += `\n⚠ 以下仓库未能建立镜像：\n${skipped}\n本次执行严禁改动这些仓库的主目录。`
    }
    if (mirror.allReused) {
      text += `\n本次为续跑：各仓库上一次执行的改动与提交都保留在镜像原处——动手前先在各仓库镜像里查看已有改动（git status / git log），避免重复劳动。`
    }
    return text
  }

  /**
   * The card body as a normal user bubble: the effective prompt (title+
```

</details>

**依据 3 · 源码核查**：[src/shared/protocol.ts:277-290](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/shared/protocol.ts#L277-L290)

默认权限及选项

<details>
<summary>查看原文（14行）</summary>

```text
/** Factory default permission preset (0.5.5). */
export const DEFAULT_PERMISSION: PermissionMode = 'workspace-write'

/** Canonical list of supported permission modes. */
export const ALL_PERMISSIONS: readonly PermissionMode[] = ['workspace-write', 'read-only', 'danger-full-access']

/** Validate and normalize a permission string into a valid {@link PermissionMode}. */
export function asPermission(raw: unknown): PermissionMode {
  if (typeof raw !== 'string') return DEFAULT_PERMISSION
  const normalized = raw.trim()
  if (normalized === 'workspace-write' || normalized === 'workspaceWrite') return 'workspace-write'
  if (normalized === 'read-only' || normalized === 'readOnly') return 'read-only'
  if (normalized === 'danger-full-access' || normalized === 'fullAccess') return 'danger-full-access'
  throw new Error("permission must be 'workspace-write', 'read-only', or 'danger-full-access'")
```

</details>

**依据 4 · 源码核查**：[src/index.ts:268-278](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/index.ts#L268-L278)

权限设置失败吞异常

<details>
<summary>查看原文（11行）</summary>

```text
        setPermission: (sessionId, permission) => {
          try {
            const permService = agentCtx.get('permissionPresets') as { set(session: unknown, name: string): void } | undefined
            const sessions = agentCtx.get('sessions') as { get(id: string): unknown } | undefined
            const session = sessions?.get(sessionId)
            if (session !== undefined && permService !== undefined) {
              permService.set(session, permission)
            }
          } catch { /* cosmetic */ }
        },
        maxConcurrent,
```

</details>

**依据 5 · 源码核查**：[src/host/git.ts:394-414](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/git.ts#L394-L414)

合并检查及status失败分支

<details>
<summary>查看原文（21行）</summary>

```text
    merge: (root, branch, exemptRelPaths) => withRootLock(root, async () => {
      // Main-clean check. The plugin's own worktree directory
      // (<root>/.dsh-worktrees) shows up as untracked noise and is EXEMPT —
      // otherwise merging would be impossible without gitignoring it first.
      const status = await quick(['status', '--porcelain'], root)
      if (status.ok) {
        const dirtyLines = status.stdout.split('\n')
          .filter(l => l.trim().length > 0)
          .filter(l => !statusLineUnder(l, [WORKTREE_DIR, ...(exemptRelPaths ?? [])]))
          .map(l => l.trim())
        if (dirtyLines.length > 0) {
          // Machine-readable tag: callers classify without parsing zh-CN text.
          throw Object.assign(new Error(`主工作区有 ${dirtyLines.length} 处未提交修改，请先提交或暂存后再合并`), { code: 'dirty-tree' })
        }
      }
      const merged = await heavy(['merge', '--no-ff', '--no-edit', branch], root)
      if (!merged.ok) {
        // Roll the half-finished merge back so the main worktree stays usable;
        // report the ORIGINAL failure verbatim (不自动解决冲突).
        await heavy(['merge', '--abort'], root)
        throw new Error(`合并失败：${merged.stderr.trim().slice(0, 300)}`)
```

</details>

**依据 6 · 源码核查**：[src/host/git.ts:424-442](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/git.ts#L424-L442)

删除dirty与unknown拒绝

<details>
<summary>查看原文（19行）</summary>

```text
    removeWorktree: (root, worktreePath, opts) => withRootLock(root, async (): Promise<'removed' | 'unregistered'> => {
      const status = await dirtyLines(worktreePath)
      if (status === undefined) throw worktreeStatusError(worktreePath)
      if (status.length > 0) {
        // opts.exempt drops mirror-structural noise (nested child worktrees /
        // gitlink drift) — the caller's aggregated check already refused real
        // dirt before reaching here.
        const lines = status
          .filter(l => !statusLineUnder(l, opts?.exempt ?? []))
          .map(l => l.trim())
        if (lines.length > 0) {
          // Machine-readable tag: purge flows classify without parsing zh-CN text.
          throw Object.assign(new Error(`worktree 有 ${lines.length} 处未提交修改，拒绝删除：\n${lines.slice(0, 10).join('\n')}`), { code: 'dirty-worktree' })
        }
      }
      const removed = await heavy(opts?.force === true
        ? ['worktree', 'remove', '--force', worktreePath]
        : ['worktree', 'remove', worktreePath], root)
      if (removed.ok) return 'removed'
```

</details>

**依据 7 · 源码核查**：[src/host/isolation.ts:113-132](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/isolation.ts#L113-L132)

空目录清理

<details>
<summary>查看原文（20行）</summary>

```text
/** Git removes registered worktrees. Leftover containers may lose empty
 * directories only; never recursively unlink files after a status check. */
async function removeEmptyContainers(root: string): Promise<void> {
  const directories: string[] = []
  const inspect = async (path: string): Promise<void> => {
    if (!await removalPathExists(path)) return
    for (const entry of await readdir(path, { withFileTypes: true })) {
      if (!entry.isDirectory() || entry.isSymbolicLink()) throw worktreeStatusError(path)
      await inspect(under(path, entry.name))
    }
    directories.push(path)
  }
  try {
    await inspect(root)
    for (const path of directories) {
      // rmdir also refuses files created since inspection (ENOTEMPTY).
      try { await rmdir(path) }
      catch (error) { if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error }
    }
  } catch (error) { throw worktreeStatusError(root, error) }
```

</details>

#### 缺口

- 宿主权限实际应用及Agent是否遵守worktree路径未知
  **影响**：无法将逻辑隔离当安全隔离，可能改主目录
  **进一步探讨**：副本上读回permission并记录全部文件写入路径

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 外部任务同步怎样保护本地改动和凭据？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

外部连接允许无userinfo/query/hash的http或https URL，未见固定官方域名或私网拒绝，用户配置的服务器即凭据目的地，应用在可信自托管源；不应把任意服务器当低风险只读源。credentials随配置以JSON存于外部状态文件，临时写mode0600再rename，返回状态剥除secret字段；这是权限保护不是加密。读取外部描述还会进入本地任务/Agent开场，要当不可信需求内容处理。

同步先完整抓取所有页、校验项目及条目类型，成功才一次store.mutate提交；scope抓取失败不推断删除。现有任务按connection身份和条目键定位，删除过的保持ignored，archived不动，done/canceled只更新远端状态元数据；in_progress/in_review冻结本地标题描述等，变化标冲突。未冻结且本地仍等于旧远端值才自动更新，否则保留本地并冲突。网络GET禁重定向、30秒/次、429/5xx最多重试两次；总同步5分钟signal，仍需真实服务验API和权限。避免先填生产凭据，先导入一个无敏感内容任务核对冲突和退出。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/external-config.ts:17-32](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/external-config.ts#L17-L32)

自定义URL及凭据身份

<details>
<summary>查看原文（16行）</summary>

```text
  if (!mode) throw new Error('unsupported authentication mode')
  const baseUrl = new URL(String(e.baseUrl ?? descriptor.defaultBaseUrl))
  if (!['http:', 'https:'].includes(baseUrl.protocol) || baseUrl.username || baseUrl.password || baseUrl.search || baseUrl.hash) throw new Error('invalid server URL')
  const url = baseUrl.href.replace(/\/$/, '')
  const account = typeof e.account === 'string' ? e.account.trim() : ''
  if (!account) throw new Error('sync account is required')
  const sameSource = previous?.provider === provider && previous.baseUrl === url && previous.account === account
  const sameIdentity = sameSource && previous.authMode === authMode
  const incoming = e.credentials && typeof e.credentials === 'object' && !Array.isArray(e.credentials) ? e.credentials as Record<string, unknown> : {}
  const credentials: Record<string, string> = {}
  for (const field of mode.fields) {
    const value = incoming[field.key]
    if (value !== undefined && typeof value !== 'string') throw new Error('invalid credential value')
    const credential = typeof value === 'string' && value.length ? value : sameIdentity ? previous!.credentials[field.key] : ''
    if (!credential) throw new Error('enter credentials for this server/account/authentication mode')
    credentials[field.key] = credential
```

</details>

**依据 2 · 源码核查**：[src/host/external-sync.ts:68-89](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/external-sync.ts#L68-L89)

明文配置持久化与返回剥离

<details>
<summary>查看原文（22行）</summary>

```text
  }
  private async persist(): Promise<void> {
    await mkdir(dirname(this.options.file), { recursive: true })
    const temp = `${this.options.file}.tmp`
    await writeFile(temp, JSON.stringify(this.state), { mode: 0o600 })
    await rename(temp, this.options.file)
  }
  private serial<T>(run: () => Promise<T>): Promise<T> {
    const next = this.lane.then(run, run)
    this.lane = next.catch(() => {})
    return next
  }
  async status(): Promise<ExternalSyncStatus> {
    await this.ready
    const config = this.state.config ? (({ credentials: _credentials, ...rest }) => rest)(this.state.config) : undefined
    const credentialPresent = Object.fromEntries(Object.entries(this.state.config?.credentials ?? {}).map(([key, value]) => [key, Boolean(value)]))
    const mode = config && this.registry.get(config.provider).descriptor.authModes.find(m => m.id === config.authMode)
    const credentialValues = Object.fromEntries((mode?.fields ?? []).filter(f => f.secret === false).map(f => [f.key, this.state.config!.credentials[f.key] ?? '']))
    const record = config ? this.options.store.snapshot().externalSync?.[config.id] : undefined
    return { config, credentialPresent, credentialValues, providers: this.registry.list(), running: this.running,
      requiresMappingReview: config?.provider === 'zentao' && !config.mappingMode,
      lastResult: record?.lastResult, lastError: this.volatileError ?? record?.lastError, lastAttemptAt: record?.lastAttemptAt, ignoredCount: record?.ignored.length ?? 0 }
```

</details>

**依据 3 · 源码核查**：[src/host/external-sync.ts:183-219](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/external-sync.ts#L183-L219)

完整抓取后提交

<details>
<summary>查看原文（37行）</summary>

```text
    const config = structuredClone(this.state.config)
    this.controller = new AbortController()
    const signal = AbortSignal.any([this.controller.signal, AbortSignal.timeout(300_000)])
    const result: SyncResult = { created: 0, updated: 0, unchanged: 0, conflicts: 0, ignored: 0, at: this.now() }
    let committed = false
    try {
      await this.options.store.load()
      const provider = this.provider(config)
      let mappings = config.mappings
      if (config.provider === 'zentao' && config.includeUnmapped) {
        if (!provider.listProjects) throw new Error('scope discovery is required for unmapped synchronization')
        const scopes = await provider.listProjects(signal)
        const associated = new Map(config.mappings.filter(m => m.workspaceId).map(m => [m.projectId, m]))
        for (const scope of scopes) {
          if (!new RegExp(`^${config.mappingMode}:\\d+$`).test(scope.id)) throw new Error('provider returned an unexpected mapping scope')
          if (!associated.has(scope.id)) associated.set(scope.id, { projectId: scope.id, workspaceId: '' })
        }
        mappings = [...associated.values()]
      }
      // Finish all pages before committing: a failed scan never infers deletion or advances state.
      const items: Array<{ item: ExternalItem; workspaceId: string }> = []
      for (const mapping of mappings) {
        if (mapping.workspaceId && !this.options.workspaceExists(mapping.workspaceId)) throw new Error('mapped workspace no longer exists')
        const existing = new Map(this.options.store.snapshot().tasks.filter(t => t.external?.connectionId === config.id && t.external.item.projectId === mapping.projectId)
          .map(t => [JSON.stringify([t.external!.item.type, t.external!.item.id]), { item: t.external!.item, metadataOnly: t.trashedAt !== undefined || ['done', 'canceled', 'archived'].includes(t.status) }]))
        for (const item of await provider.getItems(mapping.projectId, signal, { existing })) {
          if (item.projectId !== mapping.projectId || !config.itemTypes.includes(item.type)) throw new Error('provider returned an unexpected scope or work item type')
          const source = normalizeExternalSource({ connectionId: config.id, provider: config.provider, item, syncedAt: result.at, conflicts: [] })
          if (!source) throw new Error('provider returned an invalid work item')
          items.push({ item: source.item, workspaceId: mapping.workspaceId })
        }
      }
      signal.throwIfAborted()
      await this.serial(async () => {
        signal.throwIfAborted()
        await this.options.store.mutate('external-sync-updated', ledger => {
          signal.throwIfAborted()
```

</details>

**依据 4 · 源码核查**：[src/host/external-sync.ts:229-270](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/external-sync.ts#L229-L270)

删除归档终态及冲突处理

<details>
<summary>查看原文（42行）</summary>

```text
            if (seen.has(key)) continue
            seen.add(key)
            const task = byKey.get(key)
            if (task) links[key] = task.id
            if (!task && links[key]) ignored.add(key)
            if (task?.trashedAt !== undefined) { ignored.add(key); result.ignored++; continue }
            if (ignored.has(key)) { result.ignored++; continue }
            if (task?.status === 'archived') { result.unchanged++; continue }
            const source: ExternalSource = { connectionId: config.id, provider: config.provider, providerName: this.registry.get(config.provider).descriptor.name, item, syncedAt: result.at, conflicts: [] }
            if (!task) {
              if (item.closed || !(item.assignees ?? [item.assignedTo]).includes(config.account)) continue
              const created: TaskRecord = { id: newTaskId(), title: item.title, description: item.description, urgency: item.urgency,
                workspaceId, prompt: '', status: config.importStatus ?? 'backlog', blocked: false, execution: { mode: 'claim' },
                isolation: defaultIsolationOf(ledger.settings), permission: defaultPermissionOf(ledger.settings),
                model: ledger.settings?.defaultModel, presetId: ledger.settings?.defaultPresetId,
                version: 1, createdAt: result.at, updatedAt: result.at, createdBy: { kind: 'user' }, updatedBy: { kind: 'user' },
                comments: [], executions: [], external: source }
              ledger.tasks.push(created); changed.push(created); byKey.set(key, created); links[key] = created.id; result.created++
            } else {
              links[key] = task.id
              const workspaceChanged = config.provider === 'zentao' && task.workspaceId === '' && workspaceId !== ''
              if (workspaceChanged) task.workspaceId = workspaceId
              if (task.status === 'done' || task.status === 'canceled') {
                const old = task.external!.item
                const statusChanged = ['status', 'assignedTo', 'assignees', 'closed'].some(key => JSON.stringify(old[key as keyof ExternalItem]) !== JSON.stringify(item[key as keyof ExternalItem]))
                if (!workspaceChanged && !statusChanged && !task.external!.conflicts.length) { result.unchanged++; continue }
                task.external = { ...task.external!, item: { ...old, status: item.status, assignedTo: item.assignedTo, closed: item.closed,
                  ...(item.assignees !== undefined ? { assignees: item.assignees } : {}) }, conflicts: [], syncedAt: result.at }
                if (item.assignees === undefined) delete task.external.item.assignees
                task.version++; task.updatedAt = result.at
                changed.push(task); result.updated++
                continue
              }
              const merged = mergeExternalFields(task, task.external!, item,
                ['in_progress', 'in_review'].includes(task.status) || task.executions.some(e => e.outcome === 'running'))
              source.conflicts = merged.conflicts
              const previous = task.external!.item
              const sameItem = ([...new Set([...Object.keys(previous), ...Object.keys(item)])] as Array<keyof ExternalItem>).every(key => JSON.stringify(previous[key]) === JSON.stringify(item[key]))
              if (!workspaceChanged && sameItem && JSON.stringify(task.external!.conflicts) === JSON.stringify(source.conflicts)) { result.unchanged++; continue }
              Object.assign(task, merged.fields)
              task.external = source; task.version++; task.updatedAt = result.at
              changed.push(task); result.updated++
```

</details>

**依据 5 · 源码核查**：[src/shared/external.ts:99-114](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/shared/external.ts#L99-L114)

三方比较与冻结

<details>
<summary>查看原文（16行）</summary>

```text
export function mergeExternalFields(local: ExternalFields, previous: ExternalSource, incoming: ExternalItem, frozen: boolean): {
  fields: ExternalFields; conflicts: Array<keyof ExternalFields>
} {
  const fields = { title: local.title, description: local.description, urgency: local.urgency }
  const conflicts: Array<keyof ExternalFields> = []
  for (const key of ['title', 'description', 'urgency'] as const) {
    if (local[key] === incoming[key]) continue
    const remoteChanged = incoming[key] !== previous.item[key]
    if (!remoteChanged && !previous.conflicts.includes(key)) continue
    if (!frozen && local[key] === previous.item[key] && !previous.conflicts.includes(key)) {
      if (key === 'urgency') fields.urgency = incoming.urgency
      else fields[key] = incoming[key]
    } else conflicts.push(key)
  }
  return { fields, conflicts }
}
```

</details>

**依据 6 · 源码核查**：[src/host/external-http.ts:2-21](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/external-http.ts#L2-L21)

超时重试和重定向拒绝

<details>
<summary>查看原文（20行）</summary>

```text
export async function externalGet(request: typeof fetch, url: string, headers: Record<string, string>, signal: AbortSignal, beforeRequest?: () => Promise<void>): Promise<unknown> {
  for (let attempt = 0; ; attempt++) {
    signal.throwIfAborted()
    await beforeRequest?.()
    const response = await request(url, { headers: { ...headers, Accept: 'application/json' }, signal: AbortSignal.any([signal, AbortSignal.timeout(30_000)]), redirect: 'error' })
    if ((response.status === 429 || response.status >= 500) && attempt < 2) {
      const retry = response.headers.get('retry-after')
      const seconds = retry && /^\d+$/.test(retry) ? Math.min(Number(retry), 30) : 2 ** attempt
      await response.body?.cancel()
      await new Promise<void>((resolve, reject) => {
        const onAbort = () => { clearTimeout(timer); reject(new Error('request aborted')) }
        const timer = setTimeout(() => { signal.removeEventListener('abort', onAbort); resolve() }, seconds * 1000)
        signal.addEventListener('abort', onAbort, { once: true })
        if (signal.aborted) onAbort()
      })
      continue
    }
    if (!response.ok) throw new Error(`External request failed (HTTP ${response.status})`)
    try { return await response.json() }
    catch { throw new Error('External service returned invalid JSON') }
```

</details>

#### 缺口

- 禅道/TAPD等真实服务接口、权限及不可信需求影响未验证
  **影响**：错误源或外部内容可能带来凭据和任务污染
  **进一步探讨**：仅测试服务器最小权限账户，核对导入和冲突后删除凭据

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 隔离降级是否应增加执行前确认？

**研究主题**：新假设与验证

#### 完整回答

当前已经记录降级并在Agent开场警告，假设不是从无到有增加提示，而是对要求worktree的任务在无法建立镜像时增加执行前人工确认，是否减少主目录误写。对照无Git、全部镜像成功、部分仓库失败和主动关闭隔离四类任务，记录主目录写入率、等待时间与成功交付率。若用户本来就接受原目录执行、确认造成调度无人值守卡死，或宿主已提供严格写边界，可能无需新增门。候选仅改变降级决策，不声称修复所有模型越界和外部工具权限。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/execution.ts:652-684](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L652-L684)

降级仍运行

<details>
<summary>查看原文（33行）</summary>

```text
    // Check reusable sessions before resetting any scheduled worktree.
    const prepareIsolation = async (): Promise<void> => {
      if (isolation === 'worktree') {
        if (this.deps.git === undefined) {
          isolationNote = 'git 集成不可用，已在原目录执行'
          await this.patchExecution(executionId, { isolation: 'none', isolationNote, branch: undefined, worktreePath: undefined, baseCommit: undefined })
        } else {
          const outcome = await prepareMirror(
            { git: this.deps.git, scanner: this.deps.scanner ?? createRepoScanner() },
            // Comment wake NEVER resets the mirror: the comments review the
            // PREVIOUS run's work, so a fresh checkout would destroy it.
            { workspacePath: workspace.path, taskId: task.id, branch, branches: task.branches, reuse: options?.reuseWorktree === true || trigger === 'comment' },
          )
          if ('mirror' in outcome) {
            prepared = outcome.mirror
            await this.pinBranches(task, prepared)
            // Persist the actual branch too: preparation may have selected a
            // fallback when the pinned branch is occupied. The root keeps
            // the legacy flat fields; other mirrors also record each repo.
            const root = prepared.repos[0]
            await this.patchExecution(executionId, {
              branch: root?.branch,
              worktreePath: root?.worktreePath,
              baseCommit: root?.baseCommit,
              ...(!isLegacySingle(prepared)
                ? { repos: prepared.repos.map(r => ({ repo: r.repo, branch: r.branch, worktreePath: r.worktreePath, baseCommit: r.baseCommit })) }
                : {}),
            })
          } else {
            isolationNote = outcome.note
            // Degraded run: clear the optimistic worktree markers.
            await this.patchExecution(executionId, { isolation: 'none', isolationNote, branch: undefined, worktreePath: undefined, baseCommit: undefined })
          }
```

</details>

**依据 2 · 源码核查**：[src/host/execution.ts:1417-1458](https://github.com/cloader/dsh-taskboard/blob/49e9a5159f995468f5cecdef191badec0c13c42d/src/host/execution.ts#L1417-L1458)

已有文字警告

<details>
<summary>查看原文（42行）</summary>

```text
  /** The shared isolation/degrade section of a framing line (issue #51 extraction). */
  private isolationFraming(prepared: PreparedMirror | undefined, degradeNote?: string): string {
    if (prepared !== undefined) {
      if (isLegacySingle(prepared)) {
        // Byte-identical legacy single-repo steering (0.3.0–0.6.2 wording).
        const only = prepared.repos[0]!
        if (only.reused === true) {
          return `\n本任务启用了 Git Worktree 隔离，且本次为续跑：任务工作目录是独立分支 ${only.branch} 的 worktree——\n${only.worktreePath}\n上一次执行的改动与提交都保留在原处——请先查看已有改动（git status / git log）再继续，避免重复劳动，并把新完成的工作提交到该分支。`
        }
        return `\n本任务启用了 Git Worktree 隔离：任务工作目录是独立分支 ${only.branch} 的全新 worktree——\n${only.worktreePath}\n（全新检出，不含 node_modules/构建产物，构建或测试前可能需要先安装依赖）。\n⚠ 边界纪律：你的会话根目录是整个项目，但本任务的全部改动必须只发生在上述 worktree 目录内——命令用 workdir 指向它、文件读写用它的绝对路径；不要改动主工作区的任何其它文件；把完成的工作提交（git commit）到该分支，验收将基于该分支的提交记录合并。`
      }
      return this.mirrorFraming(prepared)
    }
    if (degradeNote !== undefined) {
      return `\n⚠ 本次执行未能建立隔离，正在主项目目录中工作（原因：${degradeNote}）。该目录可能有他人未提交的改动：动手前先 git status 检查现状，改动尽量集中，结束时在评论中说明动了哪些文件；避免把未经验证的改动直接提交到主分支。`
    }
    return ''
  }

  /**
   * The multi-repo mirror section of the framing line (0.6.3): per-repo
   * checkout list, the (possibly partial) coverage boundary, per-repo commit
   * discipline, and the 禁改 list for repos that failed to mirror.
   */
  private mirrorFraming(mirror: PreparedMirror): string {
    const mode = mirror.allReused ? '续跑' : '全新'
    const lines = mirror.repos
      .map(r => `- ${r.repo === '' ? '根仓库' : r.repo} → ${r.worktreePath}（分支 ${r.branch}${r.reused === true ? '，续跑' : ''}）`)
      .join('\n')
    let text = `\n本任务启用了 Git Worktree 隔离（多仓库镜像模式，本次${mode}）：整个工作区已镜像到任务目录——\n${mirror.root}\n各仓库检出位置与各自任务分支：\n${lines}\n（全新检出的镜像不含 node_modules/构建产物，构建或测试前可能需要先安装依赖）。\n⚠ 边界纪律：你的会话根目录是整个项目，但本任务的全部改动必须只发生在上述任务目录内对应仓库的镜像里——命令用 workdir 指向它、文件读写用它的绝对路径；不要改动镜像之外的任何文件；改动发生在哪个仓库，就把完成的工作提交（git commit）到那个仓库的任务分支，验收将按仓库合并各分支的提交记录。`
    if (mirror.skipped.length > 0) {
      const skipped = mirror.skipped.map(s => `- ${s.repo}（原因：${s.reason}）`).join('\n')
      text += `\n⚠ 以下仓库未能建立镜像：\n${skipped}\n本次执行严禁改动这些仓库的主目录。`
    }
    if (mirror.allReused) {
      text += `\n本次为续跑：各仓库上一次执行的改动与提交都保留在镜像原处——动手前先在各仓库镜像里查看已有改动（git status / git log），避免重复劳动。`
    }
    return text
  }

  /**
   * The card body as a normal user bubble: the effective prompt (title+
```

</details>

#### 缺口

- 用户是否需要失败关闭及其等待成本未知
  **影响**：确认可能抵消无人值守价值
  **进一步探讨**：副本工作区对照降级任务，统计误写与延迟

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
