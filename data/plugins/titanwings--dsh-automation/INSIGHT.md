# dsh-automation

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[0d73a4e](https://github.com/titanwings/dsh-automation/tree/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0)

<!-- BEGIN META -->
[![GitHub ★ 103](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=103&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/titanwings/dsh-automation)
<!-- END META -->

> **功能**：按日程创建新的 DSH 根 Agent 执行完整任务，保存权限快照与运行历史。

> **亮点**：[Q01](#research-q01) 把任务和权限完整保存后独立派发。

> **主要限制**：[Q02](#research-q02) 中断标失败不能说明外部效果不存在。

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
  - [Q01 · 定时任务怎样独立于旧聊天运行？](#detail-section-11)
  - [Q02 · Host 中断与任务失败后如何恢复？](#detail-section-12)
  - [Q03 · 如何先验证无人值守价值？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户需定期生成代码检查或工作区报告。

同会话提醒或人工重复执行完整任务。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 日程 | 定时独立工作 | Host 在线 |
| 执行记录 | 查看输入及结果 | 失败后核对效果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 在线且兼容 DSH Host | 必需 | 计时和 Agent 创建 | 退出时不继续计时 |
| 模型及自包含任务 | 必需 | 无人值守执行 | 审批 never 不能互动确认 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 定义 | 固定任务和工作区 | 核对时间与权限 |
| 执行 | 检查新 Session 和记录 | 验证结果质量 |
| 恢复 | 核查中断效果 | 明确后再重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 写完整任务和时区 | 先只读 |
| 持续 | 模型成本未知 | 审阅结果和历史 | Host 要在线 |
| 失败 | 恢复工时未知 | 查真实副作用 | 中断不盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 定期工作 | 新 Session 执行自包含任务 | 漏跑、重复和实际节时 |

> **思考**：[Q02](#research-q02) 中断标失败不能说明外部效果不存在。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把任务和权限完整保存后独立派发。

[Q02](#research-q02) 恢复 queued/running 为中断失败，外部状态另查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 中断标失败不能说明外部效果不存在。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单个只读周期任务先验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持派发、记录和恢复状态，未运行调度。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/executor.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定执行器和服务，未运行任务或修改日程。
- 下一步：时区、漏跑、重启和部分成功对照。

**分析版本**

- **仓库**：[titanwings/dsh-automation](https://github.com/titanwings/dsh-automation)
- **版本号**：0.1.7（[固定提交 0d73a4e](https://github.com/titanwings/dsh-automation/tree/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0)）
- **版本日期**：2026-09-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 对照人工重复任务的漏跑与报告质量。

时区、漏跑、重启和部分成功对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1072 | — | — | 12658 |
| .js | source | 2 | 26487 | 24055 | 3026 | — |
| .mjs | source | 1 | 87 | 80 | 0 | — |
| .tsx | source | 5 | 2290 | 2160 | 26 | — |
| .ts | source | 20 | 5073 | 4564 | 193 | — |
| .ts | test | 14 | 4141 | 3808 | 24 | — |
| .mjs | test | 2 | 32 | 30 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/titanwings/dsh-automation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/titanwings/dsh-automation/issues?q=is%3Aissue+created%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/titanwings/dsh-automation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A08%3A46.024Z..2026-11-05T05%3A08%3A46.024Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自包含任务能否按时间在明确工作区独立执行并留下记录？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 定时任务怎样独立于旧聊天运行？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

规则保存完整任务、工作区、模型和权限快照，每次创建新的根 Agent 和 Session。执行器挂预设、设沙箱并固定 approval never，再提交任务。相对同一会话提醒，它可定期执行无需旧聊天上下文的工作，但交互审批任务不适合无人值守。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:51-63](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/README.md#L51-L63)

与原生提醒的区别。

<details>
<summary>查看原文（13行）</summary>

```text
## 🎯 Why automation

DSH Core Schedule is the right tool for reminders in the current conversation: “come back to this Session in ten minutes.” `dsh-automation` handles a different job: “run this complete task independently every weekday and leave me a result I can inspect.”

| | DSH Core Schedule | dsh-automation |
| --- | --- | --- |
| Execution context | Returns to the same live Agent | Starts a fresh root Agent and Session |
| Input | A follow-up inside existing context | A saved, self-contained task |
| Scope | Current Session Log | One canonical DSH workspace |
| History | Conversation events | Definition revisions and durable run records |
| Best for | Reminders and same-chat follow-ups | Repeated or one-shot standalone coding work |

If a task depends on unstated chat history, needs an interactive approval halfway through, or should react to a file, HTTP, or process condition rather than time, it is not a good automation yet.
```

</details>

**依据 2 · 源码核查**：[src/service.ts:826-845](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/service.ts#L826-L845)

run 身份和状态保存。

<details>
<summary>查看原文（20行）</summary>

```text
    const startedAt = toIso()
    // The durable identity lives in the SessionId itself. This remains true
    // even if Agent creation fails before the first automation-sourced message
    // is appended and after bounded run history has pruned the owning row.
    const sessionId = `${AUTOMATION_SESSION_PREFIX}${randomUUID()}`
    const running: AutomationRun = { ...run, status: 'running', startedAt, sessionId }
    await this.runs.put(run.id, running)
    const completion = await executeAutomationRun(this.ctx, definition, run, {
      runTimeoutMs: this.config.runTimeoutMs,
      sessionId,
      signal,
    })
    const finishedAt = toIso()
    const completed: AutomationRun = {
      ...running,
      status: completion.status,
      sessionId: completion.sessionId ?? null,
      finishedAt,
      summary: completion.summary ?? null,
      error: completion.error ?? null,
```

</details>

**依据 3 · 源码核查**：[src/executor.ts:145-181](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/executor.ts#L145-L181)

实际创建、权限和任务。

<details>
<summary>查看原文（37行）</summary>

```text
    handle = await ctx.agents.withoutInitiator(() => ctx.agents.create({
      sessionId,
      ...(config.signal === undefined ? {} : { signal: config.signal }),
      meta: { cwd: target.cwd, agentPreset: target.agentPreset },
      agentOptions: { provider: selection.provider, model: selection.model },
      setup: async (agentCtx: Context) => {
        await ctx.agentPresets.mount(agentCtx, target.agentPreset)
        installModelSelection(agentCtx, { current: selection, assembled: undefined })
        const agent = agentCtx.agent
        if (agent === undefined) throw new Error('automation setup has no scoped Agent')
        setSandboxMode(agent.session, target.permissionPreset)
        setApprovalPolicy(agent.session, 'never')
        agentCtx.tools.guard((exec: ToolExecution) => unattendedToolGuardReason(exec.name, exec.arguments))
      },
    }))
    await handle.agent.whenIdle()
    await workspace.attachSession(sessionId)
    // Stamp the automation's name as the Session title before the first
    // message. Automatic title generation only considers human user/message
    // sources, so an automation-sourced conversation would otherwise fall
    // back to the workspace name in the conversation list.
    const runTitle = definition.name.trim()
    if (runTitle !== '') {
      const session = handle.agent.session as { readonly append?: (type: string, data: unknown) => unknown }
      if (session !== undefined && typeof session.append === 'function') {
        session.append('session/title', {
          title: runTitle,
          messageSeqs: [],
          source: { kind: 'user' },
        })
      }
    }
    const firstSeq = handle.agent.session.seq
    handle.agent.followup(createUserMessage({
      content: [{ type: 'text', text: run.promptSnapshot }],
      source: {
        kind: 'automation',
```

</details>

#### 缺口

- 未跑调度时间或真实工作任务
  **影响**：时间正确性和任务效果未知
  **进一步探讨**：对固定时区任务比对预期与实际触发

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · Host 中断与任务失败后如何恢复？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

启动将历史 queued 或 running 标为 host_interrupted failed，并不自动证明外部副作用没发生。执行结果按 turn 结束类型区分成功、超时和取消，最后尝试 dispose。并行同一定义由服务检查已有活动记录，仍需多进程实例和重启验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:902-916](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/service.ts#L902-L916)

中断历史标失败。

<details>
<summary>查看原文（15行）</summary>

```text
  private async recoverInterruptedRuns(): Promise<void> {
    const finishedAt = toIso()
    for (const [id, run] of this.runs.entries()) {
      if (run.status !== 'queued' && run.status !== 'running') continue
      await this.runs.put(id, {
        ...run,
        status: 'failed',
        finishedAt,
        error: {
          code: 'host_interrupted',
          message: 'The DSH Host stopped before this automation run reached a terminal state.',
        },
        unread: true,
      })
    }
```

</details>

**依据 2 · 源码核查**：[src/service.ts:374-390](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/service.ts#L374-L390)

手动运行去重。

<details>
<summary>查看原文（17行）</summary>

```text
    const run = await this.serialize(async () => {
      const definition = await this.ownedDefinition(scope, id)
      throwIfCancelled(signal)
      const related = this.relatedRuns(id)
      const alreadyActive = related.some(candidate => (
        candidate.automationId === id
        && (candidate.status === 'queued' || candidate.status === 'running')
      ))
      if (alreadyActive) throw new Error('The automation already has a queued or running run.')
      const now = toIso()
      // "Run ahead": this manual run takes the place of the next scheduled
      // occurrence. Once it succeeds that occurrence is treated as handled.
      // Without a future occurrence the manual run is a plain one-off.
      const replacesScheduledFor = options.replaceNext === true
        ? this.nextPendingOccurrence(definition, related, now)
        : null
      const value = createManualRun(definition, now, undefined, replacesScheduledFor)
```

</details>

**依据 3 · 源码核查**：[src/executor.ts:222-255](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/executor.ts#L222-L255)

失败和结束清理。

<details>
<summary>查看原文（34行）</summary>

```text
        ...(summary === undefined ? {} : { summary }),
        error: { code: 'cancelled', message: 'The automation was cancelled because its owner stopped.' },
      }
    }
    if (timedOut) {
      return {
        sessionId: String(sessionId),
        status: 'failed',
        ...(summary === undefined ? {} : { summary }),
        error: { code: 'timeout', message: 'The automation exceeded its run time limit.' },
      }
    }
    if (outcome.reason?.kind === 'completed') {
      return { sessionId: String(sessionId), status: 'succeeded', ...(summary === undefined ? {} : { summary }) }
    }
    return {
      sessionId: String(sessionId),
      status: 'failed',
      ...(summary === undefined ? {} : { summary }),
      error: reasonError(outcome.reason),
    }
  } catch (error: unknown) {
    return {
      ...(handle === undefined ? {} : { sessionId: String(sessionId) }),
      status: 'failed',
      error: {
        code: 'executor_error',
        message: error instanceof Error ? error.message : 'The automation executor failed.',
      },
    }
  } finally {
    removeCancellationListener()
    if (timeout !== undefined) clearTimeout(timeout)
    await handle?.dispose().catch(() => {})
```

</details>

#### 缺口

- 多 Host、进程中断和远端副作用未核验
  **影响**：自动重试可能重复效果
  **进一步探讨**：模拟工具已完成但记录未写与 Host 重开

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何先验证无人值守价值？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

从独立工作区的只读报告开始，确认任务文本自包含，核对时区和模型快照。对照人工定期执行，记录漏跑、重复和报告可用性。中断后先核对 Session 和外部状态，再决定手动重试；需要审批或依赖聊天历史则退回人工。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:73-88](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/README.md#L73-L88)

规则配置和模型选定。

<details>
<summary>查看原文（16行）</summary>

```text
- **DSH Web:** open **Automations** from the sidebar or the conversation tab to create a rule, pause or resume it, run it now, delete it, and inspect recent runs. On the blank New Session screen, the sidebar shortcut tells you to start a conversation instead of failing silently.
- **Any eligible root Agent:** ask in natural language. Six scoped tools let the Agent manage automations only for its exact workspace.

There is no separate bot, daemon UI, or third-party scheduler to operate.

### 📅 Schedules people can read

Create a one-shot, fixed-interval, daily, or weekly rule. Daily and weekly schedules use an IANA time zone; the friendly form is normalized into a validated RFC 5545 RRULE for persistence and inspection.

![Create form with schedule, time zone, and permission boundary](docs/02-create-en.png)

### 🧠 A model target for each automation

The Web form can follow the live global model or pin one provider/model pair. A pinned model can use its own default reasoning effort or one of the opaque effort values advertised by that exact model. The card shows the saved target, and each run keeps the same target in its immutable snapshot.

Agent tools expose the same fields. Omitting all model fields on create preserves the existing behavior of capturing the creating Session's complete selection; explicitly setting `provider` and `model` to `null` follows the live global selection at run time. On update, omitted fields stay unchanged, `null` clears a pin, and changing the route without an effort resets to the new model's default.
```

</details>

**依据 2 · 源码核查**：[src/executor.ts:145-157](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/executor.ts#L145-L157)

无人审批策略。

<details>
<summary>查看原文（13行）</summary>

```text
    handle = await ctx.agents.withoutInitiator(() => ctx.agents.create({
      sessionId,
      ...(config.signal === undefined ? {} : { signal: config.signal }),
      meta: { cwd: target.cwd, agentPreset: target.agentPreset },
      agentOptions: { provider: selection.provider, model: selection.model },
      setup: async (agentCtx: Context) => {
        await ctx.agentPresets.mount(agentCtx, target.agentPreset)
        installModelSelection(agentCtx, { current: selection, assembled: undefined })
        const agent = agentCtx.agent
        if (agent === undefined) throw new Error('automation setup has no scoped Agent')
        setSandboxMode(agent.session, target.permissionPreset)
        setApprovalPolicy(agent.session, 'never')
        agentCtx.tools.guard((exec: ToolExecution) => unattendedToolGuardReason(exec.name, exec.arguments))
```

</details>

**依据 3 · 源码核查**：[src/service.ts:902-916](https://github.com/titanwings/dsh-automation/blob/0d73a4e03639d4f63d0771ae4490e2718b7e7aa0/src/service.ts#L902-L916)

中断状态待确认。

<details>
<summary>查看原文（15行）</summary>

```text
  private async recoverInterruptedRuns(): Promise<void> {
    const finishedAt = toIso()
    for (const [id, run] of this.runs.entries()) {
      if (run.status !== 'queued' && run.status !== 'running') continue
      await this.runs.put(id, {
        ...run,
        status: 'failed',
        finishedAt,
        error: {
          code: 'host_interrupted',
          message: 'The DSH Host stopped before this automation run reached a terminal state.',
        },
        unread: true,
      })
    }
```

</details>

#### 缺口

- 运行费用和长期漏跑未知
  **影响**：不能估计净节时
  **进一步探讨**：测试夏令时、积压、失败和实际报告质量

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
