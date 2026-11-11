# 飞书 DSH 机器人

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6e722e0](https://github.com/PlutoKeating/dsh-lark-bot/tree/6e722e0272f370fa0071715703294490e2f89bf8)

<!-- BEGIN META -->
[![GitHub ★ 41](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=41&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PlutoKeating/dsh-lark-bot) [![npm 30d 2,163](https://img.shields.io/static/v1?label=npm+30d&message=2%2C163&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-bot) [![最新发布 2026-08-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-lark-bot)
<!-- END META -->

> **功能**：将 DSH 接入飞书私聊、群聊和话题，支持任务状态、通知与审批交互。

> **亮点**：用会话范围和持久任务账本把远程消息、运行状态和恢复接入飞书渠道。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：中断只说明没有终态；旧 running 不自动重跑。审批策略有 allow 和低风险直通，卡片不能证明每次都会询问。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 相比网页对话加手工转告，飞书桥增加什么？](#detail-section-11)
  - [Q02 · 崩溃后怎样区分排队与已运行任务？](#detail-section-12)
  - [Q03 · 审批、启动和关停分别依赖什么？](#detail-section-13)
  - [Q04 · 如何避免重试未知副作用，同时保留恢复能力？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用飞书沟通开发、需要远程追踪 DSH 任务的人，可在既有会话中接收状态和结果。

本机网页处理任务更直接，手工转发可逐条筛选，但无法自动维持渠道内进度。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 飞书桥 | 发起和追踪 DSH 任务 | 依赖渠道与宿主 |
| 账本恢复 | 记录中断与显式重试 | 运行与远端结果不同 |
| 审批卡 | 处理需要用户判断的动作 | 存在策略和风险直通 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH 与 Node | 启动宿主桥 | 按包版本核对 |
| 飞书应用和账号 | 长连接及消息交互 | 真实接入前须验证权限 |
| 模型、工作区与账本 | 任务执行和恢复 | 状态与外部副作用分别查 |

| 阶段 | 操作 | 异常 |
| --- | --- | --- |
| 首次 | 假渠道和测试工作区 | 先查 scope 与批准规则 |
| 持续 | 查看排队、运行、终态 | 中断先查再显式重试 |
| 退出 | 停止桥并核对上游和守护 | 保留已需的账本与消息 |

**效果与成本**

| 成本 | 单位 | 限制 |
| --- | --- | --- |
| 人工 | 每个合格交付的配置和对账 | 未测时间 |
| 模型与渠道 | 实际执行和重复请求 | 未测成本 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少同步 | 原消息可追踪任务状态 | 真实送达未验 |
| 可恢复 | 排队继续、运行中断不盲重放 | 不保证远端未写 |

> **思考**：中断只说明没有终态；旧 running 不自动重跑。审批策略有 allow 和低风险直通，卡片不能证明每次都会询问。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用会话范围和持久任务账本把远程消息、运行状态和恢复接入飞书渠道。[Q01](#research-q01) [Q02](#research-q02)

running 先于派发持久化，重启区分排队与未知中断值得复用。任务状态仍不能代替远端动作回执。

<a id="detail-section-5"></a>

### 1.4 主要限制

中断只说明没有终态；旧 running 不自动重跑。审批策略有 allow 和低风险直通，卡片不能证明每次都会询问。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用假渠道、无写权限的测试工作区核对隔离、账本和批准条件。状态或外部结果不能解释时不接真实群。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持队列恢复和审批策略；未运行宿主、渠道、守护或真实工具。

- 已检查：作者 README、包清单、源码路径 src/bridge/job-recovery.ts、src/bot/job-ledger.ts、src/plugin.ts、src/notify/approval-handler.ts、src/bridge/scope-isolation.ts、cordis.patch.yml、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查固定 bundle、恢复与审批，未运行飞书、模型、真实守护或更新。
- 下一步：使用假飞书和工具，注入终态落盘失败、已受理断连和审批例外，核对账本与出站。

**分析版本**

- **仓库**：[PlutoKeating/dsh-lark-bot](https://github.com/PlutoKeating/dsh-lark-bot)
- **版本号**：0.19.16（[固定提交 6e722e0](https://github.com/PlutoKeating/dsh-lark-bot/tree/6e722e0272f370fa0071715703294490e2f89bf8)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

给外部动作独立回执供显式重试前对账，比较未知结果的重复率和恢复成本；无改善就撤回。[Q04](#research-q04)

使用假飞书和工具，注入终态落盘失败、已受理断连和审批例外，核对账本与出站。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 81 | 7700 | — | — | 113342 |
| .mjs | source | 14 | 2102 | 1839 | 173 | — |
| .mts | source | 1 | 66 | 65 | 5 | — |
| .ts | source | 183 | 33262 | 28950 | 2162 | — |
| .tsx | source | 1 | 299 | 269 | 3 | — |
| .ts | test | 160 | 22658 | 20606 | 359 | — |
| .ts | example | 1 | 24 | 23 | 1 | — |

</details>

**活跃度**

[![近30天新建 18](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=18&color=737b86&logo=github)](https://github.com/PlutoKeating/dsh-lark-bot/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PlutoKeating/dsh-lark-bot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断飞书桥让用户远程续接 DSH 任务的增量，以及中断、重试与审批边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相比网页对话加手工转告，飞书桥增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已经用飞书讨论开发工作、需要从手机发起或追踪 DSH 任务的人，可在原会话看反馈。网页对话更直接，手工转发结果可人工过滤，但离开电脑时需要再同步。这里的增量是给渠道消息分配持久会话范围和任务账本，并提供宿主通知、文件和审批接线。群隔离模式可按群、成员或话题，缺话题标识会落回群，因此不能将群内并行理解为恒定的成员隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-24](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/README.md#L21-L24)

作者描述手机、群聊和长连接。

```text
## 产品简介

让 DeepSeek Harness 成为你飞书里的一员，在手机、群聊、话题里直接指挥本机 coding agent。
走飞书 WebSocket 长连接，**不需要公网 IP、域名、服务器或内网穿透**；Linux / macOS / Windows 通用，Node.js ≥ 22。
```

**依据 2 · 源码核查**：[cordis.patch.yml:5-17](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/cordis.patch.yml#L5-L17)

bundle 声明桥、通知、文件和批准能力。

<details>
<summary>查看原文（13行）</summary>

```text
# `dsh.profile.bundles` and applies this patch on boot:
#   - `dsh-lark-bot/plugin` starts the full bridge engine IN-PROCESS (Feishu
#     channel, workspace/session layers, notify server, nested dsh SDK
#     runtime) and exposes `ctx.larkBridge` (status / stop).
#   - `dsh-lark-bot/notify` mounts the `lark_notify` tool for the host agent
#     (mentions + cross-session messages).
#   - `dsh-lark-bot/file` mounts the `lark_send_file` result upload tool.
#   - `dsh-lark-bot/plan` mounts the host plan gate; managed SDK / ACP overlays
#     mount the same tool for their nested agents.
#   - `dsh-lark-bot/approval` answers official one-shot tool approvals through
#     Feishu/Lark cards for host agents.
# First boot without credentials prints a QR code for one-time binding.
# Set DSH_LARK_DISABLED=1 to keep the engine stopped.
```

</details>

**依据 3 · 源码核查**：[src/bridge/scope-isolation.ts:10-23](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/scope-isolation.ts#L10-L23)

实际 scope 计算和回落路径。

<details>
<summary>查看原文（14行）</summary>

```text
/** Resolve the durable state key without mutating or migrating any existing scope. */
export function isolatedScope(identity: ScopeIdentity, mode: ScopeIsolationMode): string {
  if (identity.chatMode === 'p2p') return identity.chatId;
  if (mode === 'group') return identity.chatId;
  if (mode === 'member') {
    if (!identity.senderId) {
      throw new Error('member isolation requires a sender identity');
    }
    return `${identity.chatId}:member:${identity.senderId}`;
  }
  if (mode === 'topic' && identity.threadId) {
    return `${identity.chatId}:${identity.threadId}`;
  }
  return identity.chatId;
```

</details>

#### 缺口

- 实际消息传输、账号权限及使用频率未测
  **影响**：不能断言日常任务可可靠完成
  **进一步探讨**：用虚构群消息和不同成员／话题对照路由

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 崩溃后怎样区分排队与已运行任务？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

开始前先持久化 running，失败时不派发。重启以连接接受新消息前的快照区分 queued 与 running；恢复 queued 进入本地队列，旧 running 转 interrupted 并提醒人对账，不自动重跑。显式 retry 只接受原 scope、原工作目录、failed 或 interrupted，重新设 queued 并增加尝试数。终态写盘失败可能仍显示 running，记录中断不是判断外部动作失败的证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge/job-recovery.ts:21-62](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/job-recovery.ts#L21-L62)

读取恢复集合，排队重入，旧运行转中断。

<details>
<summary>查看原文（42行）</summary>

```text
/** Freeze the recovery set before the live channel can accept new events. */
export async function prepareDurableJobRecovery(jobs: JobLedger): Promise<JobRecoveryPlan> {
  return {
    queued: jobs.queued(),
    running: jobs.running(),
    interrupted: jobs.pendingRecoveryNotices(),
  };
}

/**
 * Reconciles durable jobs only after the outbound channel is ready. Queued
 * messages are safe to replay; in-flight jobs become explicit interrupted
 * records and require a human retry because tools may already have had side
 * effects before the previous process stopped.
 */
export async function recoverDurableJobs(
  plan: JobRecoveryPlan,
  jobs: Pick<JobLedger, 'recoverInterrupted' | 'markRecoveryNotified'>,
  pending: Pick<PendingQueue<QueuedMessage>, 'push'>,
  channel: Pick<StreamingChannel, 'sendMarkdown'>,
): Promise<JobRecoverySummary> {
  for (const record of plan.queued) {
    await channel.sendMarkdown(
      record.message.chatId,
      bilingualMarkdown(
        `♻️ 已从持久任务账本恢复排队消息：\`${record.message.messageId}\`，即将继续处理。`,
        `♻️ Restored queued message \`${record.message.messageId}\` from the durable job ledger; processing will resume shortly.`,
      ),
      routeFor(record.message),
    ).catch((error) => log.fail('job-ledger', error, {
      step: 'queued-recovery-notice',
      messageId: record.message.messageId,
    }));
    pending.push(record.message.scope, queuedMessageFromDurable(record.message));
  }

  // Convert only the pre-connect running snapshot after outbound delivery is
  // ready. A crash before this point leaves it running so the next boot can
  // retry reconciliation. The pending bit makes notification at-least-once.
  const newlyInterrupted = await jobs.recoverInterrupted(
    plan.running.map((record) => record.message.messageId),
  );
```

</details>

**依据 2 · 源码核查**：[src/bridge/job-recovery.ts:63-84](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/job-recovery.ts#L63-L84)

中断通知后标记，失败留待后续。

<details>
<summary>查看原文（22行）</summary>

```text
  const interrupted = new Map<string, JobRecord>();
  for (const record of [...plan.interrupted, ...newlyInterrupted]) {
    interrupted.set(record.message.messageId, record);
  }
  for (const record of interrupted.values()) {
    const checkpoint = safeInline(record.checkpoint?.detail ?? record.checkpoint?.stage ?? 'unknown');
    try {
      await channel.sendMarkdown(
        record.message.chatId,
        bilingualMarkdown(
          `⚠️ 上次任务在 bridge 退出时中断：\`${record.message.messageId}\`（最后 checkpoint：${checkpoint}）。为避免重复外部副作用，未自动重跑；可用 \`/jobs show ${record.message.messageId}\` 对账，确认后执行 \`/jobs retry ${record.message.messageId}\`。`,
          `⚠️ The previous job was interrupted when the bridge stopped: \`${record.message.messageId}\` (last checkpoint: ${checkpoint}). It was not rerun automatically to avoid duplicate external side effects. Use \`/jobs show ${record.message.messageId}\`, then \`/jobs retry ${record.message.messageId}\` after review.`,
        ),
        routeFor(record.message),
      );
      await jobs.markRecoveryNotified(record.message.messageId);
    } catch (error) {
      log.fail('job-ledger', error, {
        step: 'recovery-notice',
        messageId: record.message.messageId,
      });
    }
```

</details>

**依据 3 · 源码核查**：[src/bridge/job-recovery.ts:131-149](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/job-recovery.ts#L131-L149)

运行状态成功持久化才可派发。

<details>
<summary>查看原文（19行）</summary>

```text
export async function claimJobDispatch(input: {
  jobs: Pick<JobLedger, 'markRunning' | 'finish'>;
  messageIds: string[];
  runId: string;
  first: Pick<QueuedMessage, 'chatId' | 'messageId' | 'threadId'>;
  channel: Pick<StreamingChannel, 'sendMarkdown'>;
}): Promise<boolean> {
  try {
    await input.jobs.markRunning(input.messageIds, input.runId);
    return true;
  } catch (error) {
    await persistDispatchFailure({
      jobs: input.jobs,
      messageIds: input.messageIds,
      error: error instanceof Error ? error.message : String(error),
      first: input.first,
      channel: input.channel,
    });
    return false;
```

</details>

**依据 4 · 源码核查**：[src/bridge/job-recovery.ts:161-180](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/job-recovery.ts#L161-L180)

终态写盘失败留待对账。

<details>
<summary>查看原文（20行）</summary>

```text
  if (input.messageIds.length === 0) return true;
  try {
    await input.jobs.finish(input.messageIds, input.state, input.error);
    return true;
  } catch (error) {
    log.fail('job-ledger', error, {
      step: 'terminal-persist',
      messageIds: input.messageIds,
    });
    await input.channel.sendMarkdown(
      input.first.chatId,
      bilingualMarkdown(
        `⚠️ 任务已经结束，但任务账本终态落盘失败；当前记录可能仍显示 running。请保留消息 ID \`${input.first.messageId}\` 并用 \`/jobs show ${input.first.messageId}\` 对账；若 bridge 重启，它会安全标记为 interrupted，不会自动重复执行。`,
        `⚠️ The job ended, but its terminal ledger update could not be persisted, so it may still appear as running. Keep message ID \`${input.first.messageId}\` and reconcile with \`/jobs show ${input.first.messageId}\`. After a bridge restart it will be marked interrupted and will not rerun automatically.`,
      ),
      routeFor(input.first),
    ).catch((noticeError) => log.fail('job-ledger', noticeError, {
      step: 'terminal-persist-notice',
      messageId: input.first.messageId,
    }));
```

</details>

**依据 5 · 源码核查**：[src/bot/job-ledger.ts:265-285](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bot/job-ledger.ts#L265-L285)

显式重试限制原范围和工作目录。

<details>
<summary>查看原文（21行）</summary>

```text
  async retry(messageId: string, scope: string, workspaceCwd: string): Promise<JobRecord | undefined> {
    let result: JobRecord | undefined;
    const now = this.now();
    await this.commit(() => {
      const record = this.data.records[messageId];
      if (
        !record ||
        record.message.scope !== scope ||
        record.message.workspaceCwd !== workspaceCwd ||
        (record.state !== 'failed' && record.state !== 'interrupted')
      ) return;
      record.state = 'queued';
      record.attempts += 1;
      record.updatedAt = now;
      record.checkpoint = { stage: 'queued' };
      delete record.runId;
      delete record.error;
      delete record.recoveryNoticePending;
      result = structuredClone(record);
    });
    return result;
```

</details>

#### 缺口

- 未模拟消息已被外部受理但本地中断
  **影响**：不能从恢复设计证明无重复写
  **进一步探讨**：在假渠道记录一次外部写并截断回执，核对重启状态和人工 retry

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审批、启动和关停分别依赖什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

包经 Cordis 启动桥，设置变化用序号与串行队列停止旧服务再启新服务。审批根据 session 映射到 scope 和目的会话；默认 ask 仍允许标成 lowRisk 的动作直接通过，scope policy allow 也直接放行。不能把有批准卡片当作每个工具都会询问，也不能仅从此 handler 确认点击人或外部平台授权。飞书应用、模型服务、宿主及工作区的配置和会话权限均需维护。关闭 bridge 与清理已有消息、工作区或守护服务是不同任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/plugin.ts:190-227](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/plugin.ts#L190-L227)

宿主配置校验、串行重启与停止。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx: Context, config: Config = {}, deps: PluginDeps = {}) {
  const service = new LarkBridgeService(ctx);
  const detachTui = attachOptionalTuiSeams(ctx);
  let source = () => config;
  let appliedConfig: Config | undefined;
  let revision = 0;
  let disposed = false;
  let reconcileQueue = Promise.resolve();
  const baseConfig = hydrateSettingsBase(config, deps.env ?? process.env);

  const reconcile = (): void => {
    const desired = source();
    if (appliedConfig && sameConfig(desired, appliedConfig)) return;
    const ticket = ++revision;
    reconcileQueue = reconcileQueue
      .catch(() => undefined)
      .then(async () => {
        if (disposed || ticket !== revision) return;
        if (appliedConfig && sameRestartConfig(desired, appliedConfig)) {
          service.updateSafeSettings(desired, deps);
          appliedConfig = desired;
          return;
        }
        await service.stop();
        if (disposed || ticket !== revision) return;
        if (!isDisabled(desired)) {
          const engine = await service.start(desired, deps);
          ctx.logger.info(
            `[dsh-lark-bot] bridge engine running (profile=${engine.profile}, home=${engine.home})`,
          );
        }
        appliedConfig = desired;
      })
      .catch((error: unknown) => {
        ctx.logger.warn(
          `[dsh-lark-bot] Web settings reload failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      });
```

</details>

**依据 2 · 源码核查**：[src/notify/approval-handler.ts:55-90](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/notify/approval-handler.ts#L55-L90)

scope 解析、默认、allow/deny/lowRisk 分支。

<details>
<summary>查看原文（36行）</summary>

```text
  return async (payload, signal) => {
    const scope = deps.sessions.scopeForSession(payload.sessionId);
    if (!scope) return { ok: false, error: `unknown session: ${payload.sessionId}` };
    const destination = deps.scopeDirectory.resolve(scope);
    if (!destination) return { ok: false, error: `unknown scope: ${scope}` };
    const policy = deps.permissionPolicies?.get(scope) ?? 'ask';
    if (payload.policyCheckOnly) {
      return {
        ok: true,
        policy,
        ...(policy === 'deny'
          ? { denial: permissionPolicyDenial(scope, payload.toolName) }
          : {}),
      };
    }
    if (policy === 'allow') return { ok: true, outcome: 'allowed-once' };
    if (policy === 'deny') {
      const denial = permissionPolicyDenial(scope, payload.toolName);
      const options = destination.threadId && destination.messageId
        ? { threadId: destination.threadId, replyTo: destination.messageId }
        : undefined;
      try {
        await deps.channel.sendMarkdown?.(
          destination.chatId,
          bilingualMarkdown(
            `⛔ **权限策略拒绝**\n\n\`\`\`text\n${policyDenialText(denial)}\n\`\`\``,
            `⛔ **Permission policy denial**\n\n\`\`\`text\n${policyDenialText(denial)}\n\`\`\``,
          ),
          options,
        );
      } catch (error) {
        log.warn('approval-policy', 'deny-notice-failed', { scope, error });
      }
      return { ok: true, outcome: 'rejected', denial };
    }
    if (payload.lowRisk) return { ok: true, outcome: 'allowed-once' };
```

</details>

**依据 3 · 源码核查**：[src/notify/approval-handler.ts:106-135](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/notify/approval-handler.ts#L106-L135)

待批注册、取消和卡片发送。

<details>
<summary>查看原文（30行）</summary>

```text
    if (signal?.aborted) return { ok: false, error: 'approval cancelled' };
    const promise = deps.approvals.register(scope, request, payload.sessionId);
    let cardMessageId: string | undefined;
    const cancel = (): void => { deps.approvals.cancel(scope, id); };
    signal?.addEventListener('abort', cancel, { once: true });
    if (signal?.aborted) cancel();
    try {
      if (signal?.aborted) return { ok: false, error: 'approval cancelled' };
      const options = destination.threadId && destination.messageId
        ? { threadId: destination.threadId, replyTo: destination.messageId }
        : undefined;
      cardMessageId = await deps.channel.sendCard(
        destination.chatId,
        renderApprovalCard({
          ...request,
          actionScope: scope,
          englishOptionNames: {
            'allow-once': 'Allow once',
            'reject-once': 'Reject',
          },
        }),
        options,
      );
      const cancelReminder = deps.onApprovalWaiting?.(scope, payload.toolName);
      let outcome: ApprovalOutcome;
      try {
        outcome = await promise;
      } finally {
        cancelReminder?.();
      }
```

</details>

**依据 4 · 作者声明**：[README.md:28-39](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/README.md#L28-L39)

作者列出宿主、Node 和账号。

<details>
<summary>查看原文（12行）</summary>

````text
## 快速开始

**前置**：本机已安装 DeepSeek Harness（`dsh`）并配置好 `DEEPSEEK_API_KEY`；Node.js ≥ 22.19；一个飞书 / Lark 账号。

```bash
npx dsh-lark-bot@latest setup --profile dsh-lark   # ① 一键安装（装进 dsh profile + 默认装「安全网守护」）
dsh --profile dsh-lark                              # ② 启动
```

③ 首次启动终端打印二维码 → 飞书 App 扫码创建或选择 PersonalAgent 应用 → 绑定后直接私聊发消息；群聊 / 话题默认 `@bot`。

- **已有应用**可跳过扫码：`DSH_LARK_APP_ID=cli_xxx DSH_LARK_APP_SECRET=<secret> DSH_LARK_TENANT=feishu dsh --profile dsh-lark`。
````

</details>

**依据 5 · 源码核查**：[cordis.patch.yml:19-33](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/cordis.patch.yml#L19-L33)

宿主凭据、工作区和 disabled 配置。

<details>
<summary>查看原文（15行）</summary>

```text
- insert:
    - id: dsh-lark-bot
      name: 'dsh-lark-bot/plugin'
      config:
        profile: !!js process.env.DSH_LARK_PROFILE ?? 'default'
        home: !!js process.env.DSH_LARK_HOME
        tenant: !!js process.env.DSH_LARK_TENANT ?? 'feishu'
        appId: !!js process.env.DSH_LARK_APP_ID
        appSecret: !!js process.env.DSH_LARK_APP_SECRET
        workspace: !!js process.env.DSH_LARK_WORKSPACE
        adapter: !!js process.env.DSH_LARK_ADAPTER
        model: !!js process.env.DSH_LARK_MODEL
        scopeConcurrency: !!js 'process.env.DSH_LARK_SCOPE_CONCURRENCY ? Number(process.env.DSH_LARK_SCOPE_CONCURRENCY) : undefined'
        notificationDefault: !!js process.env.DSH_LARK_NOTIFICATION_DEFAULT
        disabled: !!js process.env.DSH_LARK_DISABLED === '1'
```

</details>

#### 缺口

- 消息卡操作者、平台权限和独立守护退出未验证
  **影响**：不能承诺每次远端动作都需人确认或卸载自动回收
  **进一步探讨**：在假审批与专用 profile 验证用户矩阵、拒绝与低风险例外

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何避免重试未知副作用，同时保留恢复能力？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察。用假飞书和测试工作区检查两个来源的 scope、排队重入、已运行转中断和批准策略，不先连接真实群或带写权限的工具。可把外部动作的幂等标识、接受状态和完成结果写入独立回执，重试前查对应动作，而不是只看任务最终状态。对照现有显式 retry，模拟工具已提交但断连、无请求发出和回执重复；若错误重试未降且合法恢复大量变慢，撤回方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge/job-recovery.ts:67-78](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bridge/job-recovery.ts#L67-L78)

现有告警要求先对账再显式重试。

<details>
<summary>查看原文（12行）</summary>

```text
  for (const record of interrupted.values()) {
    const checkpoint = safeInline(record.checkpoint?.detail ?? record.checkpoint?.stage ?? 'unknown');
    try {
      await channel.sendMarkdown(
        record.message.chatId,
        bilingualMarkdown(
          `⚠️ 上次任务在 bridge 退出时中断：\`${record.message.messageId}\`（最后 checkpoint：${checkpoint}）。为避免重复外部副作用，未自动重跑；可用 \`/jobs show ${record.message.messageId}\` 对账，确认后执行 \`/jobs retry ${record.message.messageId}\`。`,
          `⚠️ The previous job was interrupted when the bridge stopped: \`${record.message.messageId}\` (last checkpoint: ${checkpoint}). It was not rerun automatically to avoid duplicate external side effects. Use \`/jobs show ${record.message.messageId}\`, then \`/jobs retry ${record.message.messageId}\` after review.`,
        ),
        routeFor(record.message),
      );
      await jobs.markRecoveryNotified(record.message.messageId);
```

</details>

**依据 2 · 源码核查**：[src/bot/job-ledger.ts:265-283](https://github.com/PlutoKeating/dsh-lark-bot/blob/6e722e0272f370fa0071715703294490e2f89bf8/src/bot/job-ledger.ts#L265-L283)

当前重试按任务记录，不检查远端动作结果。

<details>
<summary>查看原文（19行）</summary>

```text
  async retry(messageId: string, scope: string, workspaceCwd: string): Promise<JobRecord | undefined> {
    let result: JobRecord | undefined;
    const now = this.now();
    await this.commit(() => {
      const record = this.data.records[messageId];
      if (
        !record ||
        record.message.scope !== scope ||
        record.message.workspaceCwd !== workspaceCwd ||
        (record.state !== 'failed' && record.state !== 'interrupted')
      ) return;
      record.state = 'queued';
      record.attempts += 1;
      record.updatedAt = now;
      record.checkpoint = { stage: 'queued' };
      delete record.runId;
      delete record.error;
      delete record.recoveryNoticePending;
      result = structuredClone(record);
```

</details>

#### 缺口

- 没有外部工具同一操作 ID 的兼容性矩阵
  **影响**：实现成本和可迁移范围未知
  **进一步探讨**：用有幂等和无查询能力两类替身对照失败情况

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
