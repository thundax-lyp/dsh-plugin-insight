# DSH Automation

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fa23c5f](https://github.com/MichengAI/dsh-automation/tree/fa23c5f7d0549d3d4c32a8653092889c3d06978a)

<!-- BEGIN META -->
[![GitHub ★ 40](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=40&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-automation) [![npm 30d 43,736](https://img.shields.io/static/v1?label=npm+30d&message=43%2C736&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-automation) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-automation)
<!-- END META -->

> **功能**：在独立 DSH 会话中按计划执行编码任务，管理权限、状态和运行记录。

> **亮点**：[Q01](#research-q01) 将重复启动移到计划和独立会话。[Q02](#research-q02) 将冲突、补跑和中断作为可回查状态。

> **主要限制**：[Q02](#research-q02) 中 queued 会继续领取，只有旧 running 被标失败，与 README 口径有差异。[Q03](#research-q03) 的失败、超时或取消都不能直接推出工具副作用已回滚。

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
  - [Q01 · 哪类重复任务适合从聊天移到独立计划？](#detail-section-11)
  - [Q02 · 调度如何识别重复、重叠和重启？](#detail-section-12)
  - [Q03 · 权限、超时和退出怎样影响采用？](#detail-section-13)
  - [Q04 · 怎样验证中断后既不误重跑也不误报结果？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合定期重复同一项边界明确且输出可复核的 DSH 工作。

以手动在 DSH 发起同样任务并保存结果为基线，核对真实产物和人力投入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 计划调度 | 启动重复任务 | loader、每任务并发和补跑窗口 |
| 独立会话 | 按保存目标运行 | 实际权限由宿主处理 |
| 历史状态 | 核中断和结果 | 必须对照真实产物 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Web 客户端 | 必需 | 挂宿主和任务管理 | 核 loader 与服务状态 |
| 明确工作区、预设和模型 | 任务必需 | 创建独立 Agent 会话 | 先试无破坏任务 |
| 存储与权限边界 | 必需 | 调度和记录 | 核权限及历史 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 工程师建隔离目录和最小权限计划 | 任务和验收条件清楚 |
| 验证 | 工程师试一次并回查会话和文件 | 终态与实际产物一致 |
| 退出 | 工程师暂停计划并检查在途 | 错误先核副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型和配置成本未知 | 选工作区、权限与计划 | 独立会话无来源批准复用 |
| 持续 | 模型和任务资源未知 | 复核运行和结果 | 同目录不同任务可重叠 |
| 失败及退出 | 重试资源未知 | 确认在途和副作用 | 失败不是回滚凭证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 重复计划 | 持久触发和会话状态 | 真实节省与合格率 |
| 中断 | queued/running 差异处理 | 外部副作用和跨进程保证 |

> **思考**：[Q02](#research-q02) 中 queued 会继续领取，只有旧 running 被标失败，与 README 口径有差异。[Q03](#research-q03) 的失败、超时或取消都不能直接推出工具副作用已回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将重复启动移到计划和独立会话。[Q02](#research-q02) 将冲突、补跑和中断作为可回查状态。

[Q02](#research-q02) 按定义控制并发并保留未启动队列。此控制不替代对同目录多定义的协调。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 中 queued 会继续领取，只有旧 running 被标失败，与 README 口径有差异。[Q03](#research-q03) 的失败、超时或取消都不能直接推出工具副作用已回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先试隔离目录、最小权限的一次任务。暂停或超时后回看真实会话和文件，有未核副作用先不恢复计划。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持计划、会话和恢复逻辑，真实宿主、模型、权限和外部副作用待验。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、src/executor.ts、src/service.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定宿主注册、任务运行、权限、超时和重启分支。未安装、执行或启动模型。
- 下一步：按 [Q04](#research-q04) 分阶段故障注入，对照会话、记录和文件标记。

**分析版本**

- **仓库**：[MichengAI/dsh-automation](https://github.com/MichengAI/dsh-automation)
- **版本号**：1.0.22（[固定提交 fa23c5f](https://github.com/MichengAI/dsh-automation/tree/fa23c5f7d0549d3d4c32a8653092889c3d06978a)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用唯一文件标记验证宿主中断后三类执行边界。若实际文件与状态不能对上，保留手动执行。

按 [Q04](#research-q04) 分阶段故障注入，对照会话、记录和文件标记。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 3183 | — | — | 42725 |
| .js | source | 2 | 24360 | 21979 | 2571 | — |
| .mjs | source | 4 | 435 | 403 | 11 | — |
| .ts | source | 47 | 10450 | 9550 | 322 | — |
| .tsx | source | 9 | 2799 | 2624 | 48 | — |
| .ts | test | 40 | 7407 | 6733 | 141 | — |
| .mjs | test | 7 | 740 | 710 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MichengAI/dsh-automation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/MichengAI/dsh-automation/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/MichengAI/dsh-automation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 自动化如何从计划创建独立会话，怎样解释调度、权限与中断终态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类重复任务适合从聊天移到独立计划？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已有 DSH 和一项边界明确的重复编码任务，例如在测试副本检查报告并生成一份可人工审阅的结果。原流程每次在聊天重新选择目录、模型和说明。插件将计划目标放进独立 Agent 会话，实际创建使用记录的工作目录、模型和 Agent 预设，运行记录绑定新会话并带完成状态、摘要或错误。价值是把重复启动和历史归档连起来。仍需用实际文件或测试确认输出，不以会话完成替代任务验收。一次性或需人工连续批准的操作不适合自动运行。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:165-175](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/README.zh-CN.md#L165-L175)

作者说明创建规则及独立运行。

<details>
<summary>查看原文（11行）</summary>

```text
| 目标 | 操作 | 范围 |
| --- | --- | --- |
| 创建规则 | 点击「新建定时任务」，填写名称、计划、任务说明、工作目录、模型、技能、权限和 Agent 预设。 | 当前 Host |
| 通过对话创建 | 在任意对话描述定时任务，或点击「通过对话创建」。 | 当前对话 |
| 暂停或恢复 | 使用任务卡片上的开关。 | 单条规则 |
| 立即运行 | 打开卡片菜单，选择「立即执行」。 | 单条规则 |
| 删除 | 打开卡片菜单，选择「删除任务」。运行历史会保留。 | 仅定义 |
| 查看记录 | 打开「执行记录」，再按天、周、月、任务或状态筛选。 | 当前 Host |

每次派发都使用保存的任务说明、工作区、模型和权限边界，不会复用来源对话中的批准。

```

</details>

**依据 2 · 源码核查**：[src/executor.ts:221-245](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/executor.ts#L221-L245)

真正创建独立会话并应用工作区、模型和预设。

<details>
<summary>查看原文（25行）</summary>

```text
    handle = await ctx.agents.withoutInitiator(() => ctx.agents.create({
      sessionId,
      ...(config.signal === undefined ? {} : { signal: config.signal }),
      meta: { cwd: target.cwd, agentPreset: target.agentPreset },
      // DSH 0.2.2-rc.1 removed the selection argument from installModelSelection
      // and applies the initial route (including reasoningEffort) from AgentOptions.
      // The effort must travel here to be recorded in the request header.
      agentOptions: {
        provider: selection.provider,
        model: selection.model,
        ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort }),
      },
      setup: async (agentCtx: Context, createdAgent?: SetupAgent) => {
        if (ctx.agentPresets === undefined) throw new Error('Host 未提供 agentPresets 服务。')
        await ctx.agentPresets.mount(agentCtx, target.agentPreset)
        // DSH 0.2.0-rc.2 → 0.2.1-rc.5 select the model through the second argument;
        // DSH 0.2.2-rc.1 accepts only agentCtx and ignores it (AgentOptions above wins).
        installModelSelection(agentCtx, { current: selection, assembled: undefined })
        if (createdAgent === undefined) throw new Error('automation setup has no scoped Agent')
        const agent = createdAgent
        applyUnattendedPermission(ctx.permissionPresets, agent.session, target.permissionPreset)
      },
    }))
    await handle.agent.whenIdle()
    await workspace.attachSession(sessionId)
```

</details>

**依据 3 · 源码核查**：[src/service.ts:1290-1318](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1290-L1318)

保存运行和会话，写入终态及摘要。

<details>
<summary>查看原文（29行）</summary>

```text
    const startedAt = toIso();
    const sessionId = `${AUTOMATION_SESSION_PREFIX}${randomUUID()}`;
    const running: AutomationRun = {
      ...run,
      status: "running",
      startedAt,
      sessionId,
    };
    await this.runs.put(run.id, running);
    const completion = await executeAutomationRun(this.ctx, definition, run, {
      runTimeoutMs: this.config.runTimeoutMs,
      sessionId,
      signal,
    });
    const finishedAt = toIso();
    const boundSessionId = completion.sessionId ?? running.sessionId;
    await this.runs.update(run.id, (current) => ({
      ...current,
      status: completion.status,
      sessionId: completion.sessionId ?? null,
      finishedAt,
      summary: completion.summary ?? null,
      error: completion.error ?? null,
      unread: true,
    }));
    if (typeof boundSessionId === "string" && boundSessionId !== "") {
      await this.adoptSession(boundSessionId).catch(() => undefined);
    }
    await this.pruneWorkspaceHistory(run.targetSnapshot.workspaceId);
```

</details>

#### 缺口

- 没有与手动重复的真实交付质量对照。
  **影响**：不能量化节省和成功率。
  **进一步探讨**：选一个固定副本任务，检查输出一致性及复核工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调度如何识别重复、重叠和重启？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

宿主组合注册任务管理 RPC、工具和计划栏。时钟依赖 loader 就绪，失败时留告警并不启动。调度计算最近到期时间，同定义已有该时刻的计划运行或同 ID 时跳过再创建。若同一任务的 queued 与 running 已达上限，或当前时刻超补跑窗口，则登记 skipped。领取阶段按计划时间排序，限制按任务计，同目录的不同定义未共用上限。重启恢复函数只把 running 改为 failed(host_interrupted)，保留 queued 给启动后调度泵；README 所述两类都改失败与本提交源码不符。存储里的失败表示旧进程未到终态，无法据此判断外部操作未发生。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:151-171](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/index.ts#L151-L171)

挂载管理与等 loader 就绪。

<details>
<summary>查看原文（21行）</summary>

```text
      stopApproval = ctx.on('tools/pre-execute', async (exec: any, next: () => Promise<any>) => {
        const downstream = await next()
        const approval = ctx.get('approval') as ApprovalPolicyReader | undefined
        const policy = sessionApprovalPolicy(approval, exec.agent?.session)
        if (downstream.kind !== 'allow' || !needsHumanApproval(exec, agentTools.has(exec.agent), policy)) {
          return downstream
        }
        return {
          kind: 'ask' as const,
          reason: humanApprovalReason(exec.name),
        }
      })
      removeRpc = registerAutomationRpc(ctx, service)

      const loader = ctx.get('loader') as { await(): Promise<void> } | undefined
      if (loader === undefined) service.start()
      else {
        void loader.await().then(() => {
          if (alive) service.start()
        }, (error: unknown) => {
          if (alive) ctx.logger.warn(`dsh-automation: Loader did not settle; clock remains stopped: ${String(error)}`)
```

</details>

**依据 2 · 源码核查**：[src/service.ts:1175-1210](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1175-L1210)

最近计划触发、重复检测和超窗/重叠跳过。

<details>
<summary>查看原文（36行）</summary>

```text
    const scheduledFor = latestDueOccurrence(definition.schedule, now);
    if (
      scheduledFor === null ||
      Date.parse(scheduledFor) <= Date.parse(definition.updatedAt)
    )
      return;
    if (
      related.some(
        (run) =>
          run.trigger === "schedule" && run.scheduledFor === scheduledFor,
      )
    )
      return;
    const candidate = createScheduledRun(definition, scheduledFor);
    if (this.runs.get(candidate.id) !== undefined) return;
    const overlapping = related.filter(
      (run) => run.status === "queued" || run.status === "running",
    ).length >= (definition.maxConcurrentRuns ?? 1);
    const age = Date.parse(now) - Date.parse(scheduledFor);
    if (overlapping || age > this.config.misfireGraceMs) {
      const reason = overlapping
        ? { code: "overlap", message: "已达到该自动化的并发上限，本次已跳过。" }
        : {
            code: "misfire",
            message: "Host 恢复时已超出补跑窗口，本次已跳过。",
          };
      await this.runs.put(candidate.id, {
        ...candidate,
        status: "skipped",
        finishedAt: now,
        error: reason,
      });
      await this.pruneWorkspaceHistory(candidate.targetSnapshot.workspaceId);
      return;
    }
    await this.runs.put(candidate.id, candidate);
```

</details>

**依据 3 · 源码核查**：[src/service.ts:1213-1235](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1213-L1235)

按定义限制领取。

<details>
<summary>查看原文（23行）</summary>

```text
  private async startQueuedRuns(): Promise<void> {
    if (this.stopping) return;
    const activeCounts = new Map<string, number>();
    for (const id of this.active.keys()) {
      const automationId = this.runs.get(id)?.automationId;
      if (automationId !== undefined) activeCounts.set(automationId, (activeCounts.get(automationId) ?? 0) + 1);
    }
    const candidates = [...this.runs.entries()]
      .map(([, run]) => run)
      .filter((run) => run.status === "queued" && !this.active.has(run.id))
      .sort(
        (left, right) =>
          Date.parse(left.scheduledFor) - Date.parse(right.scheduledFor),
      );
    const queued: AutomationRun[] = [];
    for (const run of candidates) {
      const count = activeCounts.get(run.automationId) ?? 0;
      const limit = this.definitions.get(run.automationId)?.maxConcurrentRuns ?? 1;
      if (count >= limit) continue;
      activeCounts.set(run.automationId, count + 1);
      queued.push(run);
    }
    for (const run of queued) this.startRun(run);
```

</details>

**依据 4 · 源码核查**：[src/service.ts:1418-1434](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1418-L1434)

重启仅处理 running。

<details>
<summary>查看原文（17行）</summary>

```text
  private async recoverInterruptedRuns(): Promise<void> {
    const finishedAt = toIso();
    for (const [id, run] of this.runs.entries()) {
      // queued 已在上次进程完成准入，启动后的调度泵会继续领取且不再应用 misfireGraceMs；
      // 只有 running 代表宿主中断了执行。
      if (run.status !== "running") continue;
      await this.runs.put(id, {
        ...run,
        status: "failed",
        finishedAt,
        error: {
          code: "host_interrupted",
          message: "DSH Host 在本次运行到达终态前停止。",
        },
        unread: true,
      });
    }
```

</details>

**依据 5 · 作者声明**：[README.zh-CN.md:180-193](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/README.zh-CN.md#L180-L193)

作者文档的重启与并发口径。

<details>
<summary>查看原文（14行）</summary>

```text
## 权限与安全边界

| 项目 | 行为 |
| --- | --- |
| 权限 | 列表和默认值直接来自 Host 官方 `permissionPresets` 服务；支持 Host 注册的自定义预设。 |
| Agent 预设 | 新建/编辑时从 Host 官方 `agentPresets` 名册选择；任务卡片显示当前预设，执行记录显示每次运行实际使用的预设；已损坏的预设显示但不可选。 |
| 工具调用 | 遵循 Host 的工具可用性、权限和审批检查，不额外维护固定工具白名单或禁止后台 shell；后台进程由 Host 管理。 |
| 完全访问 | 选择官方 `danger-full-access` 时显示与 Chat 一致的风险确认和橙色提示。 |
| 审批 | 对话创建跟随当前会话策略。Full access（`never`）直接创建；Workspace Write / Read Only（`ask`）走官方授权卡。无人值守运行仍是 fail-closed 的 `never`。 |
| 重试 | 已经开始的运行不会自动重试。 |
| Host 重启 | 遗留的 `queued` / `running` 会变成 `failed(host_interrupted)`。 |
| 并发 | 不同自动化任务不设插件级全局并发上限，同一目录下也可同时运行。旧插件级全局并发配置（插件 config 中的 `maxConcurrentRuns`）不再生效，与下方任务级字段不同。 |
| 最短间隔 | 自 `0.1.40` 起，间隔计划支持最短 `1` 分钟，仅接受整数分钟。恢复时仅处理补跑窗口内最近的到期点，不逐次补齐漏掉的触发。 |
| 单任务并发 | 自 `0.1.40` 起支持。在任务的新建/编辑页设置“并发数量”（正整数，默认 `1`）。同一任务的排队及运行记录共用此上限；满额时定时触发记为 `skipped(overlap)`，手动运行返回上限提示。调低上限不取消已有运行。Agent 创建/更新工具使用 `max_concurrent_runs`，Web RPC 使用 `maxConcurrentRuns`；旧任务默认 `1`。 |
```

</details>

#### 缺口

- 未模拟实际宿主崩溃、并发存储访问和重启。
  **影响**：代码里的去重与状态不足以证明跨进程恰好一次。
  **进一步探讨**：分别在入队后和产生副作用前后重启，核历史与结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 权限、超时和退出怎样影响采用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

独立执行会话先设置选定的官方权限预设，再覆盖审批策略为 never，避免无人值守停等；不代表授予更多工具权限，具体准入依赖宿主实现和选定预设。交互会话的管理工具追加确认仅在实际 ask 策略下触发。运行超时或服务关闭会向 Agent 发取消，等待收敛超时会记 cancel_convergence_timeout。此时不能认为已发生的写入或外部请求已撤销。

试用应先选隔离目录与最小权限，用只生成可复核文本的计划试一次。暂停后还要单独核已启动的任务和文件。首次要配置计划、身份、目录和权限，持续耗模型额度和人工复核，失败可能要重建产物，实际金额和时长未知。若出现待复核权限、失败后已写入或未停止的任务，先暂停计划，核对会话与产物，再决定恢复或改用手动执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/executor.ts:76-84](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/executor.ts#L76-L84)

选定权限预设再设置无人值守审批。

```text
/** 先应用官方预设的完整语义，再让无人值守审批 fail-closed。 */
export function applyUnattendedPermission(
  presets: PermissionPresetService,
  session: unknown,
  permission: AutomationDefinition['permissionPreset'],
): void {
  presets.set(session, permission)
  setApprovalPolicy(session, 'never')
}
```

**依据 2 · 源码核查**：[src/index.ts:43-70](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/index.ts#L43-L70)

实际 ask 和管理操作追加确认条件。

<details>
<summary>查看原文（28行）</summary>

```text
/** 读取当前会话实际审批策略；自定义权限预设也以 Host 投影结果为准。 */
export function sessionApprovalPolicy(
  approval: ApprovalPolicyReader | undefined,
  session: unknown,
): SessionApprovalPolicy | undefined {
  const override = approval?.overrideOf?.(session)
  if (override === 'ask' || override === 'never') return override
  const fallback = approval?.config?.policy
  if (fallback === 'ask' || fallback === 'never') return fallback
  return undefined
}

/**
 * 只在实际 ask 策略下二次确认。never 策略再 ask，
 * 会被映射成 “the user rejected tool”，且不会弹窗。
 */
export function needsHumanApproval(
  exec: { readonly name: string; readonly arguments?: unknown; readonly signal: AbortSignal },
  isMountedAgent: boolean,
  policy?: SessionApprovalPolicy,
): boolean {
  if (!isMountedAgent || exec.signal.aborted || !MUTATING_TOOLS.has(exec.name)) return false
  if (policy !== 'ask') return false
  if (exec.name !== 'automation_update') return true
  const args = typeof exec.arguments === 'object' && exec.arguments !== null
    ? exec.arguments as Record<string, unknown>
    : {}
  return !(args.status === 'paused' && Object.keys(args).every(key => key === 'id' || key === 'status'))
```

</details>

**依据 3 · 源码核查**：[src/executor.ts:264-319](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/executor.ts#L264-L319)

时限、取消、收敛失败和终态。

<details>
<summary>查看原文（56行）</summary>

```text
    let aborted = false
    const idle = handle.agent.whenIdle()
    const deadline = new Promise<void>((resolve) => {
      timeout = setTimeout(() => {
        timedOut = true
        handle?.agent.cancel({ kind: 'hook', reason: 'automation run timeout' })
        resolve()
      }, config.runTimeoutMs)
    })
    const cancellation = new Promise<void>((resolve) => {
      if (config.signal === undefined) return
      const cancel = () => {
        aborted = true
        handle?.agent.cancel({ kind: 'hook', reason: 'automation service disposed' })
        resolve()
      }
      if (config.signal.aborted) cancel()
      else {
        config.signal.addEventListener('abort', cancel, { once: true })
        removeCancellationListener = () => { config.signal?.removeEventListener('abort', cancel) }
      }
    })
    await Promise.race([idle, deadline, cancellation])
    removeCancellationListener()
    if ((timedOut || aborted) && !await settlesWithin(idle, CANCEL_CONVERGENCE_TIMEOUT_MS)) {
      return {
        sessionId: String(sessionId),
        status: aborted ? 'cancelled' : 'failed',
        error: {
          code: 'cancel_convergence_timeout',
          message: '自动化取消后未能在安全时限内停止。',
        },
      }
    }
    if (timeout !== undefined) clearTimeout(timeout)
    await ctx.sessions.flush(handle.agent.session)
    const outcome = summarizeCollectedRun(watched.events, handle.agent.session, firstSeq)
    const summary = boundSummary(outcome.text)
    if (aborted) {
      return {
        sessionId: String(sessionId),
        status: 'cancelled',
        ...(summary === undefined ? {} : { summary }),
        error: { code: 'cancelled', message: '自动化因其所属服务停止而被取消。' },
      }
    }
    if (timedOut) {
      return {
        sessionId: String(sessionId),
        status: 'failed',
        ...(summary === undefined ? {} : { summary }),
        error: { code: 'timeout', message: '自动化超过最大运行时限。' },
      }
    }
    if (outcome.reason?.kind === 'completed') {
      return { sessionId: String(sessionId), status: 'succeeded', ...(summary === undefined ? {} : { summary }) }
```

</details>

#### 缺口

- 未验证宿主权限和取消期间真实工具副作用。
  **影响**：不能据终态判断外部操作被撤销。
  **进一步探讨**：在临时目录用最小权限注入长运行测试，核停止与文件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证中断后既不误重跑也不误报结果？

**研究主题**：新假设与验证

#### 完整回答

假设持久队列加独立会话能使重复任务更容易恢复和核对。用可丢弃任务向临时文件追加唯一标记，分别在入队、开始但未写、写入后尚未收尾时停止宿主，然后重新启动。对照运行记录、会话和文件，比较手动计划与插件是否产生重复标记或遗漏任务。并行两个不同定义以验证同目录竞争。若运行显示失败但已存在标记，应留给用户核对，不把失败直接当安全重跑依据。若状态不能解释实际文件、重复或漏跑上升，保留手动执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:1290-1318](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1290-L1318)

运行状态与会话记录的写入边界。

<details>
<summary>查看原文（29行）</summary>

```text
    const startedAt = toIso();
    const sessionId = `${AUTOMATION_SESSION_PREFIX}${randomUUID()}`;
    const running: AutomationRun = {
      ...run,
      status: "running",
      startedAt,
      sessionId,
    };
    await this.runs.put(run.id, running);
    const completion = await executeAutomationRun(this.ctx, definition, run, {
      runTimeoutMs: this.config.runTimeoutMs,
      sessionId,
      signal,
    });
    const finishedAt = toIso();
    const boundSessionId = completion.sessionId ?? running.sessionId;
    await this.runs.update(run.id, (current) => ({
      ...current,
      status: completion.status,
      sessionId: completion.sessionId ?? null,
      finishedAt,
      summary: completion.summary ?? null,
      error: completion.error ?? null,
      unread: true,
    }));
    if (typeof boundSessionId === "string" && boundSessionId !== "") {
      await this.adoptSession(boundSessionId).catch(() => undefined);
    }
    await this.pruneWorkspaceHistory(run.targetSnapshot.workspaceId);
```

</details>

**依据 2 · 源码核查**：[src/service.ts:1418-1434](https://github.com/MichengAI/dsh-automation/blob/fa23c5f7d0549d3d4c32a8653092889c3d06978a/src/service.ts#L1418-L1434)

重启时 queued 与 running 的不同处理。

<details>
<summary>查看原文（17行）</summary>

```text
  private async recoverInterruptedRuns(): Promise<void> {
    const finishedAt = toIso();
    for (const [id, run] of this.runs.entries()) {
      // queued 已在上次进程完成准入，启动后的调度泵会继续领取且不再应用 misfireGraceMs；
      // 只有 running 代表宿主中断了执行。
      if (run.status !== "running") continue;
      await this.runs.put(id, {
        ...run,
        status: "failed",
        finishedAt,
        error: {
          code: "host_interrupted",
          message: "DSH Host 在本次运行到达终态前停止。",
        },
        unread: true,
      });
    }
```

</details>

#### 缺口

- 未实际注入故障。
  **影响**：无法断言恢复正确或收益。
  **进一步探讨**：保存按阶段的历史、日志与文件标记。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
