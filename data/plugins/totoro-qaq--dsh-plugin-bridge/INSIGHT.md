# dsh-plugin-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1de31db](https://github.com/Totoro-qaq/dsh-plugin-bridge/tree/1de31db355904a45ea7dd815099f4d1af185bd2a)

<!-- BEGIN META -->
[![GitHub ★ 165](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=165&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Totoro-qaq/dsh-plugin-bridge) [![npm 30d 4,040](https://img.shields.io/static/v1?label=npm+30d&message=4%2C040&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-bridge) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-bridge)
<!-- END META -->

> **功能**：在 DSH 预览并确认会话交接，将上下文或已批准计划移到新会话。

> **亮点**：[Q01](#research-q01) 将可编辑预览与目标创建接起来。

> **主要限制**：[Q02](#research-q02) 进程内批准和宿主取消不能保证跨重启恰好一次。

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
  - [Q01 · 交接怎样进入新会话？](#detail-section-11)
  - [Q02 · 批准和未知发送怎样处理？](#detail-section-12)
  - [Q03 · 怎样控制兼容和使用成本？](#detail-section-13)
  - [Q04 · 怎样验证交接完整性？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在任务中切换工具预设且希望保留关键决策的 DSH 用户。

手工整理并复制上下文，再到新预设创建会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话交接 | 换预设并保留关键背景 | 需核对摘要后确认 |
| 批准计划 | 在新会话执行原计划 | 绑定当前评审和来源 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与会话服务 | 必需 | 读取来源并创建目标 | 使用手工摘要 |
| 可用模型 | 生成预览需要 | 整理上下文 | 编辑或停止 |
| 明确确认 | 执行需要 | 允许建目标 | 只保留预览 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选短任务与目标预设 | 核对宿主能力 |
| 预览 | 用户复核五节并编辑 | 缺内容时补齐 |
| 确认 | 宿主创建目标与回执 | 未知时先读回 |
| 退出 | 用户回到源会话 | 检查目标状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装与测试资源未知 | 核对版本和配置 | 未实测 |
| 持续 | 摘要和 kickoff 模型消耗 | 编辑和复核 | 额度待测 |
| 恢复 | 重新生成资源未知 | 检查源与目标 | 不盲目重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 预览 | 结构化手稿与用户确认 | 摘要保真 |
| 执行 | 精确计划绑定及回执 | 宿主竞态与实际启动 |

> **思考**：[Q02](#research-q02) 进程内批准和宿主取消不能保证跨重启恰好一次。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将可编辑预览与目标创建接起来。

[Q02](#research-q02) 将原生评审、进程内批准和迁移回执分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 进程内批准和宿主取消不能保证跨重启恰好一次。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从短任务验证目标。[Q02](#research-q02) 发送不明时先检查现有目标。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码和作者宿主记录分开核查，未运行目标。

- 已检查：作者 README、包清单、源码路径 README.md、lib/approved-plan.js、lib/dsh-alpha-host.js、lib/index.js、lib/migrate.js、lib/natural-language.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定命令、批准、历史兼容和迁移代表路径，未执行目标。
- 下一步：对照真实宿主版本、用户确认、取消竞争与未知发送。

**分析版本**

- **仓库**：[Totoro-qaq/dsh-plugin-bridge](https://github.com/Totoro-qaq/dsh-plugin-bridge)
- **版本号**：0.5.1（[固定提交 1de31db](https://github.com/Totoro-qaq/dsh-plugin-bridge/tree/1de31db355904a45ea7dd815099f4d1af185bd2a)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对照检查表能否减少迁移遗漏。

对照真实宿主版本、用户确认、取消竞争与未知发送。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 49 | 4796 | — | — | 72044 |
| .mjs | source | 9 | 2174 | 1915 | 107 | — |
| .js | source | 19 | 7382 | 6834 | 673 | — |
| .ts | source | 19 | 6266 | 5190 | 679 | — |
| .tsx | source | 1 | 887 | 821 | 27 | — |
| .mjs | test | 26 | 7095 | 6395 | 139 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/Totoro-qaq/dsh-plugin-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话交接如何处理预览、批准与未知发送？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 交接怎样进入新会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要在任务中途切换 DSH 工具预设的用户，可以先检查摘要再另开会话，避免依赖旧预设的工具历史。宿主注册 /bridge 命令及可选 bridge_prepare，后者只生成预览，由用户另作确认。迁移代码在确认后创建目标会话，并在有目标服务时先创建和暂停目标，再考虑发 kickoff。相对手工整理摘要和复制，增量是预览、目标创建和受控启动连在一起。摘要仍有信息选择，不能保证完整理解。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-99](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L69-L99)

入口与确认工作流

<details>
<summary>查看原文（31行）</summary>

````text
### Three entrypoints

- **Menu action:** open the current conversation's `⋯` menu in the sidebar and choose **Hand off session**. This opens the target picker without replacing a draft or submitting attachments. The composer's existing Bridge item also works when offered; DSH hides argument-taking commands from its `+` menu when the draft is nonempty. No permanent header button or extra command is added.
- **Keyboard:** search for **Bridge** in DSH keyboard settings and bind **Hand off current session**. The command is unbound by default and takes no system, Host, or other plugin shortcut; its ID is `dsh-plugin-bridge.open`.
- **Natural language:** say, for example, “Hand this task off to PTC; let me review the summary first.” Modes with model-tool support can call `bridge_prepare`. An omitted target opens the picker. The model can prepare a handoff, not confirm it for you.

All paths keep **human confirmation**: choose a target → preview → edit Text/Markdown → confirm. Existing `/bridge` commands remain available. Hosts without the optional UI/tool services retain the command fallback. The shortcut acts only on the current conversation, not a separate main panel such as Jot or an open modal.

Natural language is on by default. Set `naturalLanguage: false` in Bridge configuration to disable it without disabling the button, keyboard command, or slash command. Enabling it adds tool-description tokens; ordinary requests are no longer universally zero-overhead. See [entrypoint and confirmation boundaries](docs/entrypoints.md).

### Existing commands

Then type in the official WebUI:

```text
/bridge                       list target presets
/bridge --doctor              check the host contract after a DSH upgrade
/bridge code                  preview the handoff; change nothing
/bridge code --go             migrate, restate, then wait
/bridge code --go --continue  restate and start work in the same target request
```

On DSH rc.7 and later, the official WebUI renders `/bridge` as a native card. **Text** exposes the fixed five sections as ordinary fields and flat bullet or ordered-list rows while preserving their Markdown markers; **Markdown** preserves full source freedom; **Preview** renders Markdown or a complete JSON tree. Long content scrolls inside the card. **Confirm migration** opens the created target session. Bridge 0.3.10 adds room to keep confirmation reachable above the fixed composer at the tested narrow widths.

UIs that implement the official `conversation.chat.commandview` slot receive the same card automatically. Other custom UIs retain the complete server result, summary-file workflow, and target title/session-ID fallback; UI authors can reuse the framework-free `dsh-plugin-bridge/client-contract` export instead of reimplementing the wire. On an older or non-slot client, correct the printed summary file and run:

```text
/bridge code --go --file <path>
```

Preview edits are temporary until migration is confirmed. Restarting the client or system may discard them; the source session remains untouched, and you can regenerate the preview.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:56-93](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/index.js#L56-L93)

实际命令、评审与工具注册

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx, config = {}) {
    const workerSessionIds = new Set();
    const plans = createPlanApprovalBridge({
        hostFor: signal => resolveDshHost(ctx, signal),
        config: commandConfigOf(config),
    });
    // The public scoped waterfall carries the exact native document. Observation delegates
    // ordinary answers unchanged; only an explicit Bridge command takes ownership.
    const events = ctx;
    events.on('user-questions/request', (request, next) => plans.observe(request, next), { global: true, prepend: true });
    ctx.effect(() => () => plans.dispose(), 'bridge: plan approval records');
    const command = createBridgeCommand({
        workerSessionIds,
        planApprovals: plans,
        hostFor: (signal) => resolveDshHost(ctx, signal),
        probe: () => probeDshHost(ctx),
        config: commandConfigOf(config),
        writeSummary: writeSummaryFile,
        readSummary: (path) => readFileSync(path, 'utf8'),
        removeSummary: removeOwnedSummaryFile,
        // 宿主命令协议只在结束时返回结果。没有原生卡片时，阶段进度写进宿主日志，
        // 长等待里命令还会每 15 秒补一条带耗时的进度。
        onProgress: (message) => {
            try {
                ctx.logger.info('%s', message);
            }
            catch { /* 进度日志不能让迁移失败 */ }
        },
    });
    ctx.commands.register(command);
    if (config.naturalLanguage !== false) {
        const natural = createBridgeNaturalLanguage({ handler: command.handler, workerSessionIds });
        ctx.effect(() => () => natural.dispose(), 'bridge: natural-language preparation lifetime');
        // A missing optional tool registry must not hold the command or client half hostage.
        ctx.inject(['tools'], toolCtx => {
            const tools = toolCtx.tools;
            tools.register(natural.tool);
        });
```

</details>

**依据 3 · 源码核查**：[lib/natural-language.js:58-86](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/natural-language.js#L58-L86)

预览工具的可用边界

<details>
<summary>查看原文（29行）</summary>

```text
        name: 'bridge_prepare',
        description: 'When the user asks to move this conversation/task to another DSH preset or mode, prepare an editable handoff preview. '
            + 'This NEVER migrates a session, authorizes continuation, or confirms a handoff. The user must review/edit the Bridge card and click Confirm migration. '
            + 'Use targetPreset for the requested preset ID (for example ptc); omit it to offer the target picker. Do not call from summary workers. '
            + 'No session ID, command, file, summary, go, or continue parameter is accepted.',
        parameters: {
            type: 'object', additionalProperties: false,
            properties: {
                targetPreset: { type: 'string', pattern: '^[a-z0-9][a-z0-9-]{0,127}$', description: 'Requested DSH preset ID, not a command.' },
                lang: { type: 'string', enum: ['zh', 'en', 'auto'], description: 'Handoff display language; omit to follow Bridge settings.' },
            },
        },
        output: {
            schema: {
                type: 'object', additionalProperties: false, required: ['kind', 'text'],
                properties: { kind: { type: 'string', enum: ['success', 'error'] }, text: { type: 'string' } },
            },
            render: (_args, value) => [{ type: 'text', text: value.kind === 'success'
                        ? 'Bridge prepared a handoff review or target picker. No migration has happened. The user must review/edit the Bridge card and explicitly confirm migration. If this client has no Bridge card, use /bridge to open the same review flow.'
                        : `Bridge could not prepare the handoff: ${value.text}` }],
            presentationMeta: (_args, value) => ({ bridge: { version: 1, outcome: value } }),
        },
        async execute(input, exec) {
            if (disposed)
                throw new Error('Bridge was unloaded; the preview entry is disposed.');
            const args = argumentsOf(input);
            const sessionId = sessionIdOf(exec);
            if (deps.workerSessionIds.has(sessionId))
                throw new Error('Bridge summary workers cannot recursively prepare a handoff.');
```

</details>

**依据 4 · 源码核查**：[lib/migrate.js:522-548](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/migrate.js#L522-L548)

目标创建及配置

<details>
<summary>查看原文（27行）</summary>

```text
    const created = await host.sessions.create({
        ...where,
        agentPreset: options.to,
    });
    // rc.2 的 session.selectModel 会同时保存 host 默认模型。预览 worker 可能
    // 用了与源会话不同的档位模型（例如 --tier pro），因此如果这里依赖新会话
    // 默认值，目标会被 worker 悄悄改成那个模型，视觉源会话也会失去 VLM。显式复制源选择既保持用户模型意图，也让
    // 未解析原图能在 kickoff 前通过目标模型的图片准入。
    let modelTransferred = false;
    if (sourceModel) {
        try {
            await host.sessions.selectModel({ sessionId: created.sessionId, ...sourceModel });
            modelTransferred = true;
        }
        catch (error) {
            warnings.push(`复制源会话模型失败，目标将使用 host 默认模型：${error instanceof Error ? error.message : String(error)}`);
        }
    }
    let titled = false;
    if (options.title) {
        try {
            await host.sessions.rename({ sessionId: created.sessionId, title: options.title });
            titled = true;
        }
        catch (error) {
            warnings.push(`改标题失败（不影响迁移）：${error instanceof Error ? error.message : String(error)}`);
        }
```

</details>

**依据 5 · 源码核查**：[lib/migrate.js:553-593](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/migrate.js#L553-L593)

暂停目标与不安全时拦截

<details>
<summary>查看原文（41行）</summary>

```text
    let kickoffSent = false;
    let imagesSent = 0;
    if (inject === 'goal' || inject === 'both') {
        try {
            const createdGoal = await host.goals.create({
                sessionId: created.sessionId,
                objective: summary,
                maxGoalRounds: options.goalRounds ?? 1,
            });
            goalCreated = true;
            try {
                await host.goals.pause({ sessionId: created.sessionId, ref: createdGoal.ref });
                goalPaused = true;
            }
            catch (error) {
                // 安全优先：pause 失败时不再发 kickoff。先清除 goal，挡住尚未入队的
                // requestDrive；再 cancel，截住已排队或已开始的 attempt。
                safeToKickoff = false;
                let goalCleared = false;
                try {
                    const clearGoal = host.goals.clear;
                    if (clearGoal === undefined)
                        throw missingHostCapability('goal clearing');
                    await clearGoal({ sessionId: created.sessionId, ref: createdGoal.ref });
                    goalCleared = true;
                }
                catch (clearError) {
                    warnings.push(`清除未暂停的交接目标失败，已继续取消目标会话；请保持目标会话关闭并手动检查：${clearError instanceof Error ? clearError.message : String(clearError)}`);
                }
                await host.sessions.cancel({ sessionId: created.sessionId }).catch(() => undefined);
                warnings.push(goalCleared
                    ? `暂停交接目标失败，已清除目标并取消自动启动；请打开目标会话检查后手动继续：${error instanceof Error ? error.message : String(error)}`
                    : `暂停交接目标失败，已取消自动启动但无法确认目标已清除；请打开目标会话检查后手动继续：${error instanceof Error ? error.message : String(error)}`);
            }
        }
        catch (error) {
            // 没挂 goal 服务的部署也应该能迁移：摘要还会走首轮提示。
            warnings.push(`挂载会话目标失败，摘要改由首轮提示携带：${error instanceof Error ? error.message : String(error)}`);
        }
    }
    if (options.kickoff !== false && safeToKickoff) {
```

</details>

#### 缺口

- 未运行宿主迁移或检查真实摘要遗漏
  **影响**：不能给出保真、用量或任务完成率
  **进一步探讨**：对照同一任务手工摘要和 Bridge 预览

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 批准和未知发送怎样处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

对批准计划入口，记录以来源会话和原生 callId 绑定，必须匹配完整计划；已完成结果和正在执行的 promise 可复用。运行时先要求原规划轮次接受取消，然后创建目标并传入逐字计划。取消返回和真正停止的语义仍依赖宿主。目标 kickoff 无法确认时，已有分支返回警告和原目标，引导手工检查，不盲目另建目标或重发。确认记录是进程内状态，不能作为跨重启的事务承诺。

#### 证据与依据

**依据 1 · 源码核查**：[lib/approved-plan.js:40-59](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/approved-plan.js#L40-L59)

内存记录和过期

<details>
<summary>查看原文（20行）</summary>

```text
export function createPlanApprovalBridge(deps) {
    const reviews = new Map();
    const approved = new Map();
    const now = deps.now ?? Date.now;
    let disposed = false;
    const prune = () => {
        for (const [id, record] of approved) {
            if (!record.inFlight && now() - record.at >= APPROVAL_TTL_MS) {
                approved.delete(id);
                reviews.delete(nativeKey(record.sourceId, record.callId));
            }
        }
        for (const [id, record] of approved) {
            if (approved.size <= MAX_APPROVALS)
                break;
            if (!record.inFlight) {
                approved.delete(id);
                reviews.delete(nativeKey(record.sourceId, record.callId));
            }
        }
```

</details>

**依据 2 · 源码核查**：[lib/approved-plan.js:79-115](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/approved-plan.js#L79-L115)

源取消和执行入口

<details>
<summary>查看原文（37行）</summary>

```text
            if (!record.sourceStopped) {
                if (record.sourceSignal?.aborted)
                    return failure(lang, 'The original plan review was cancelled. Review the current plan again.', '原计划评审已经取消，请重新评审当前计划。');
                // Cancellation ends the source's blocking exit_plan_mode call while leaving plan/mode active.
                // The observer refuses a concurrent native Approve answer once this record is claimed.
                const cancellation = object(await host.sessions.cancel({ sessionId: record.sourceId }));
                if (cancellation?.accepted === false || cancellation?.cancelled === false)
                    throw new Error('The source did not accept cancellation.');
                record.sourceStopped = true;
            }
            if (disposed)
                return failure(lang, 'Bridge was unloaded before execution started; the plan remains in the source transcript.', 'Bridge 已卸载，尚未启动执行；完整计划仍保留在原会话记录中。');
            const preset = record.preset;
            const heading = /^#{1,6}\s+(.+)$/mu.exec(record.plan)?.[1]?.trim().slice(0, 160)
                ?? (lang === 'en' ? 'Approved plan' : '已批准计划');
            const title = `${heading} → ${preset}`;
            const result = await executeMigration(host, {
                sessionId: record.sourceId, sourceSession: source, to: preset, summary: record.plan,
                executionKind: 'approved-plan', sourceContext: record.sourceContext,
                lang, autoContinue: true, inject: deps.config.inject, goalRounds: deps.config.goalRounds, title,
            });
            const lines = lang === 'en' ? [
                `Created a new session in the ${result.agentPreset} preset for the approved plan.`,
                `Target session: ${title} · ${result.sessionId}`,
                result.kickoffSent ? 'The complete approved plan is being executed in the new session; the handoff goal stays paused.'
                    : 'The target exists but automatic execution could not be confirmed. Open it and inspect the warnings.',
                'The original planning turn was stopped; the source session remains in plan mode for reference.',
            ] : [
                `已在 ${result.agentPreset} 模式下建好新会话，执行已批准的完整计划。`,
                `目标会话：${title} · ${result.sessionId}`,
                result.kickoffSent ? '完整计划已逐字交接，新会话开始执行；交接目标保持暂停。'
                    : '执行会话已创建，但无法确认自动执行已启动；请打开目标并检查警告。',
                '原规划轮次已停止，原会话仍保留在计划模式，供查阅和继续规划。',
            ];
            for (const warning of result.warnings)
                lines.push(`⚠ ${warning}`);
            record.result = { kind: 'success', text: lines.join('\n') };
```

</details>

**依据 3 · 源码核查**：[lib/approved-plan.js:157-207](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/approved-plan.js#L157-L207)

精确绑定、在途与结果复用

<details>
<summary>查看原文（51行）</summary>

```text
        execute: async (input) => {
            const lang = input.lang;
            if (disposed)
                return failure(lang, 'Bridge plan approval is unavailable after unload.', 'Bridge 已卸载，无法接收计划批准。');
            prune();
            let record;
            try {
                if (input.approvePlan64 !== undefined) {
                    const plan = decodePayload(input.approvePlan64);
                    record = reviews.get(nativeKey(input.sessionId, plan.callId));
                    if (!record || record.plan !== plan.plan || (!record.live && !record.claimed)) {
                        return failure(lang, 'This exact plan is no longer awaiting approval. Reopen a current plan review.', '这份计划已不在等待批准，或内容已变更；请重新打开当前计划评审。');
                    }
                }
                else if (input.approvedPlanId !== undefined) {
                    record = approved.get(input.approvedPlanId);
                    if (!record || record.sourceId !== input.sessionId)
                        return failure(lang, 'No approved plan is bound to this session; review it again.', '当前会话没有这份有效的批准记录，请重新评审计划。');
                }
                if (!record)
                    return failure(lang, 'No plan approval was supplied.', '没有收到计划批准。');
                if (record.result)
                    return record.result;
                if (record.inFlight)
                    return record.inFlight;
                const host = deps.hostFor(input.signal);
                const source = await findSession(host, input.sessionId);
                if (!source)
                    return failure(lang, 'The source session is unavailable.', '读不到原计划会话。');
                const presets = await listPresets(host);
                const requested = input.preset ?? record.preset ?? source.agentPreset;
                if (!requested)
                    return failure(lang, 'Choose an execution preset.', '请指定新执行会话的模式。');
                const preset = resolvePresetTarget(requested, presets);
                if (!presets.some(p => p.id === preset))
                    return failure(lang, `No usable execution preset named ${preset}.`, `没有可用的执行模式 ${preset}。`);
                // An asynchronous source/preset lookup can race another approval or the native decision.
                if (record.result)
                    return record.result;
                if (record.inFlight)
                    return record.inFlight;
                if (!record.live && !record.claimed)
                    return failure(lang, 'The plan review already settled.', '这份计划评审已经结束。');
                record.preset = preset;
                record.claimed = true;
                record.approvalId ??= randomUUID();
                record.at = now();
                approved.set(record.approvalId, record);
                const selected = record;
                const operation = run(selected, host, source, lang);
                selected.inFlight = operation;
```

</details>

**依据 4 · 源码核查**：[lib/migrate.js:618-662](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/migrate.js#L618-L662)

不确定发送及目标回执

<details>
<summary>查看原文（45行）</summary>

```text
                    sessionId: created.sessionId,
                    mode: 'queue',
                    content: [...images, { type: 'text', text: `${baseText}\n\n${transferNote}` }],
                });
                imagesSent = images.length;
                kickoffSent = true;
            }
            catch (error) {
                if (imageFallbackAllowed(error)) {
                    warnings.push(`目标模型或 host 不能接收原图，已使用逐字视觉证据/未解析提示降级：${error instanceof Error ? error.message : String(error)}`);
                }
                else {
                    // 目标已经存在且 goal 已暂停。对不确定是否送达的 prompt 不能盲目重试，
                    // 否则可能让模型收到两份 kickoff；把原目标交还给用户手动检查更安全。
                    uncertainImagePromptFailure = true;
                    warnings.push(lang === 'en'
                        ? `The target session was created, but its image kickoff could not be confirmed. Open that target and continue manually; Bridge did not retry an ambiguously delivered prompt: ${error instanceof Error ? error.message : String(error)}`
                        : `目标会话已创建，但带图 kickoff 是否送达无法确认。请打开这个目标手动检查并继续；Bridge 没有盲目重试可能已送达的提示：${error instanceof Error ? error.message : String(error)}`);
                }
            }
        }
        if (imagesSent === 0 && !uncertainImagePromptFailure) {
            try {
                await host.sessions.prompt({
                    sessionId: created.sessionId,
                    mode: 'queue',
                    content: [{ type: 'text', text: baseText }],
                });
                kickoffSent = true;
            }
            catch (error) {
                warnings.push(lang === 'en'
                    ? `The target session was created, but its kickoff could not be confirmed. Open that target and continue manually; Bridge did not create another session: ${error instanceof Error ? error.message : String(error)}`
                    : `目标会话已创建，但 kickoff 是否送达无法确认。请打开这个目标手动检查并继续；Bridge 没有再创建一个会话：${error instanceof Error ? error.message : String(error)}`);
            }
        }
    }
    return {
        sessionId: created.sessionId,
        agentPreset: created.agentPreset ?? options.to,
        modelTransferred,
        ...(sourceModel ? { sourceModel } : {}),
        goalCreated,
        goalPaused,
        kickoffSent,
```

</details>

#### 缺口

- 未验证源和目标在宿主重启、取消竞争或断线时的效果
  **影响**：不能证明所有操作只执行一次或已停止
  **进一步探讨**：用隔离宿主模拟原生批准竞争、超时和目标读回

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样控制兼容和使用成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者把 0.5.1 的 0.2.2 alpha 放行与实际版本验收分开。固定适配器优先读取 inspect，另可读 events 或 page。功能依赖实际宿主的会话、历史、目标及命令面。自然语言默认注册工具说明，有提示开销；预览和目标启动可能用模型，涉及图像的成本另计。用短任务确认预览、目标暂停、执行回执和返回源会话，实际宿主不符时用手工摘要。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:132-153](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L132-L153)

摘要流程与成本

<details>
<summary>查看原文（22行）</summary>

````text
## How it works

```text
fold history -> five-part handoff -> preview/edit -> clean target session
             -> pause stored goal -> inject -> restate -> wait or continue
image history -> verbatim assistant evidence; unresolved originals use the attachment gateway
```

The five sections are Goal, Current state, Key decisions and conventions, Key files, and Next step. The original session is never rewritten; archive the target and return to the source if the handoff is unsatisfactory.

## Migration decisions

| Situation | Bridge behavior | Cost / fidelity effect |
|---|---|---|
| `naturalLanguage: false`, no handoff requested | No prompt injection or model tool | **0 Bridge prompt tokens** |
| Natural language enabled, no handoff requested | `bridge_prepare` tool description registered | Tool-description overhead; no summary-worker request |
| `/bridge code` | One bounded summary worker; preview only | No target session is created |
| Default `--go` | Target restates and waits | One explicit confirmation request before useful work |
| `--go --continue` | Confirm the defined next step; restate and work in one target request | Separate approvals and safety limits still apply; no background goal round |
| Image already has assistant analysis | Copy that response verbatim | No raw image is resent by default |
| Image is unresolved and target accepts images | Copy the original attachment and preserve the source VLM | Vision pricing comes from the selected provider |
| Image is unresolved and target is text-only | Prompt admission rejects the image; Bridge sends a visible text fallback | No hidden local VLM and no silent claim of visual understanding |
````

</details>

**依据 2 · 作者声明**：[README.md:157-169](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L157-L169)

作者兼容准入和测试区别

<details>
<summary>查看原文（13行）</summary>

````text
### Support policy

From Bridge **0.4.7**, `engines.dsh` is an installation-admission range, not an exact list of tested releases. Bridge **0.5.1** keeps that policy and, after comparing `@deepseek-ai/dsh@0.2.2-alpha.2` with the already admitted `0.2.1-rc.4`, admits the 0.2.2 alpha line:

```text
>=0.1.0-rc.7 <0.2.0-0 || 0.2.0-rc.2 || >=0.2.1-alpha.1 <0.2.2-0 || >=0.2.2-alpha <0.2.2-beta
```

The previous host terms are unchanged. The 0.2.1 term still admits later alpha/beta/rc builds and final 0.2.1, and its `<0.2.2-0` ceiling still excludes every 0.2.2 prerelease. The separate `>=0.2.2-alpha <0.2.2-beta` term admits `0.2.2-alpha` and later `0.2.2-alpha.*`, including published `0.2.2-alpha.2`, and stops before `0.2.2-beta`. Beta, rc and stable 0.2.2 stay out until another boundary review. DSH evaluates this field with `includePrerelease: true`. A caret such as `^0.2.1-alpha.1` would also admit later 0.2.x prereleases; this range does not.

`0.2.2-alpha.2` removed `sessionController.inspect`. Bridge reads that host's history through `sessionController.events` (or the deprecated `page` alias) and still uses `sessionController.inspect` when the host provides it. Command registration, goals, plan-review actions, shortcuts and the client slots Bridge uses stayed compatible. This adapter change is not a Web or Desktop acceptance of `0.2.2-alpha.2`. That host requires Node.js `>=24.9.0`; Bridge's own Node declaration stays `>=22` for older hosts. The development SDK pins remain `0.2.1-alpha.4`.

Admission is not acceptance. The table, version-specific reports and Workshop's exact `dshVersions` name only exercised hosts. Published package metadata is a snapshot; later passing documentation checks do not silently rewrite an old npm artifact. Compatible updates inside an admitted line need a diff review and short acceptance pass, not a new npm release merely to append an alpha number. Actual code/dependency/packaging fixes still require a release, and a new version family requires reviewing the boundary. The verified exact alpha.4 development SDK baseline is retained; it does not have to advance for every compatible Host. `/bridge --doctor` helps identify missing capabilities but does not replace migration acceptance.
````

</details>

**依据 3 · 源码核查**：[lib/dsh-alpha-host.js:14-22](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/dsh-alpha-host.js#L14-L22)

读路径探测

```text
/** 有快照就继续用快照，避免改变 0.2.1 宿主的分页；否则改走宿主自己的历史页。 */
function historyReader(controller) {
    if (typeof controller?.inspect === 'function')
        return controller.inspect;
    if (typeof controller?.events === 'function')
        return controller.events;
    if (typeof controller?.page === 'function')
        return controller.page;
    return undefined;
```

**依据 4 · 源码核查**：[lib/dsh-alpha-host.js:160-184](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/lib/dsh-alpha-host.js#L160-L184)

历史读取分支

<details>
<summary>查看原文（25行）</summary>

```text
}
/** 把 0.2.2 的 `events`/`page` 结果收成 Bridge 的 `{ events, hasMore }`。 */
async function readEventPage(controller, sessionId, beforeSeq, maxMessages, signal) {
    const read = typeof controller.events === 'function' ? controller.events : controller.page;
    const page = required('session.history', read);
    const value = await invoke('session.history', () => page.call(controller, {
        address: { kind: 'session', sessionId },
        ...(beforeSeq === undefined ? {} : { beforeSeq }),
        maxMessages,
    }, signal));
    const records = Array.isArray(value?.records) ? value.records : [];
    return {
        events: records.flatMap(record => {
            const event = record?.event;
            return event !== null && typeof event === 'object' ? [{ event }] : [];
        }),
        hasMore: value?.hasMore === true,
    };
}
async function readSessionHistory(controller, sessionId, beforeSeq, maxMessages, signal) {
    if (typeof controller?.inspect === 'function') {
        const inspect = controller.inspect;
        const value = await invoke('session.history', () => inspect.call(controller, sessionId, signal));
        return paginateHistory(value.events, beforeSeq, maxMessages);
    }
```

</details>

**依据 5 · 作者声明**：[README.md:95-101](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L95-L101)

退出及保留源

````text
```text
/bridge code --go --file <path>
```

Preview edits are temporary until migration is confirmed. Restarting the client or system may discard them; the source session remains untouched, and you can regenerate the preview.

Uninstall with `dsh plugin --profile web remove dsh-plugin-bridge`, then restart `dsh web`.
````

#### 缺口

- 未复跑作者版本报告、安装或真实模型
  **影响**：实际成本、兼容和恢复时间未知
  **进一步探讨**：隔离 profile 用短任务测试真实版本及返回源

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证交接完整性？

**研究主题**：新假设与验证

#### 完整回答

现有预览可编辑，固定摘要分成五节。可加一份只列约束、验收项和关联原文的检查表，不替用户自动确认。以相同长会话对照手工和增强预览，评估目标会话遗漏、审查耗时和不必要重复执行。若遗漏不降或成本抵消收益，撤回。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:69-77](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L69-L77)

当前预览和确认

```text
### Three entrypoints

- **Menu action:** open the current conversation's `⋯` menu in the sidebar and choose **Hand off session**. This opens the target picker without replacing a draft or submitting attachments. The composer's existing Bridge item also works when offered; DSH hides argument-taking commands from its `+` menu when the draft is nonempty. No permanent header button or extra command is added.
- **Keyboard:** search for **Bridge** in DSH keyboard settings and bind **Hand off current session**. The command is unbound by default and takes no system, Host, or other plugin shortcut; its ID is `dsh-plugin-bridge.open`.
- **Natural language:** say, for example, “Hand this task off to PTC; let me review the summary first.” Modes with model-tool support can call `bridge_prepare`. An omitted target opens the picker. The model can prepare a handoff, not confirm it for you.

All paths keep **human confirmation**: choose a target → preview → edit Text/Markdown → confirm. Existing `/bridge` commands remain available. Hosts without the optional UI/tool services retain the command fallback. The shortcut acts only on the current conversation, not a separate main panel such as Jot or an open modal.

Natural language is on by default. Set `naturalLanguage: false` in Bridge configuration to disable it without disabling the button, keyboard command, or slash command. Enabling it adds tool-description tokens; ordinary requests are no longer universally zero-overhead. See [entrypoint and confirmation boundaries](docs/entrypoints.md).
```

**依据 2 · 作者声明**：[README.md:132-149](https://github.com/Totoro-qaq/dsh-plugin-bridge/blob/1de31db355904a45ea7dd815099f4d1af185bd2a/README.md#L132-L149)

五节与执行流程

<details>
<summary>查看原文（18行）</summary>

````text
## How it works

```text
fold history -> five-part handoff -> preview/edit -> clean target session
             -> pause stored goal -> inject -> restate -> wait or continue
image history -> verbatim assistant evidence; unresolved originals use the attachment gateway
```

The five sections are Goal, Current state, Key decisions and conventions, Key files, and Next step. The original session is never rewritten; archive the target and return to the source if the handoff is unsatisfactory.

## Migration decisions

| Situation | Bridge behavior | Cost / fidelity effect |
|---|---|---|
| `naturalLanguage: false`, no handoff requested | No prompt injection or model tool | **0 Bridge prompt tokens** |
| Natural language enabled, no handoff requested | `bridge_prepare` tool description registered | Tool-description overhead; no summary-worker request |
| `/bridge code` | One bounded summary worker; preview only | No target session is created |
| Default `--go` | Target restates and waits | One explicit confirmation request before useful work |
````

</details>

#### 缺口

- 未观察真实遗漏率或界面完整性
  **影响**：不能确认检查表具有净收益
  **进一步探讨**：用固定有陷阱的交接任务盲测

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
