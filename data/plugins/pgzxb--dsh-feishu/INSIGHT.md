# dsh-feishu

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[98772bf](https://github.com/PGZXB/dsh-feishu/tree/98772bff938685741f138b93d7cad7aa3a01114b)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PGZXB/dsh-feishu) [![npm 30d 1,790](https://img.shields.io/static/v1?label=npm+30d&message=1%2C790&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-feishu/dsh-feishu) [![最新发布 2026-10-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-feishu/dsh-feishu)
<!-- END META -->

> **功能**：将 DSH 会话接入飞书聊天，提供流式卡片、提问、审批及文件收发。

> **亮点**：[Q01](#research-q01) 在已有飞书聊天中接入宿主会话、排队和卡片动作。[Q02](#research-q02) 卡片状态按请求、聊天和消息归并。

> **主要限制**：[Q02](#research-q02) 卡片批准未绑定任务发起者。[Q03](#research-q03) send_file 的实际读路径没有工作区包含性检查。

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
  - [Q01 · 飞书任务如何进入 DSH 会话并在原聊天更新？](#detail-section-11)
  - [Q02 · 卡片上的批准和原消息授权如何区分？](#detail-section-12)
  - [Q03 · 附件、文件发送及日志实际触及哪些内容？](#detail-section-13)
  - [Q04 · 配对、版本和退出需要哪些运维工作？](#detail-section-14)
  - [Q05 · 何种结果能将当前观察改为可试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在飞书中反复跟进 DSH 任务的人希望从同一聊天收到可核对的结果。

原生 DSH Web 可处理完整会话；单向脚本转发需要自行维护状态和回执。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聊天续接 | 在飞书触发 Host 会话 | 按聊天映射，重启去重待核 |
| 卡片审批 | 提交允许或拒绝 | 当前需核对点击者角色 |
| 文件收发 | 从聊天接收或发回文件 | 须核对宿主读取范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Host | 必需 | 会话、审批与工具 | 核对固定 peer |
| 飞书应用与授权 | 必需 | 长连接和发送 | 禁用机器人并核对 scope |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离 profile 和专用机器人 | 仅测试聊天和操作者 |
| 验证 | 对照只读任务与反例 | 审批和文件按权限拒绝 |
| 退出 | 停用桥并回 Web | 清理凭据副本、检查已发文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与飞书配额待测 | 配置应用和权限 | 实际接入用时未知 |
| 持续 | 网络、日志及本机附件 | 凭据维护和版本回归 | 真实耗时未知 |
| 失败 | 日志和备份空间 | 停止、检查副作用 | 已发消息需独立处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 聊天续接 | 会话绑定及 Host followup | 节时与持久重放 |
| 卡片操作 | 按请求和卡片消费 | 成员权限及实机可靠性 |

> **思考**：[Q02](#research-q02) 卡片批准未绑定任务发起者。[Q03](#research-q03) send_file 的实际读路径没有工作区包含性检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在已有飞书聊天中接入宿主会话、排队和卡片动作。[Q02](#research-q02) 卡片状态按请求、聊天和消息归并。

卡片交互集中消费与进程内去重可复用；跨重启幂等、主体绑定和宿主文件访问需要分别验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 卡片批准未绑定任务发起者。[Q03](#research-q03) send_file 的实际读路径没有工作区包含性检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察，先在独立 profile 以无价值文件核对权限。出现他人批准、越界上传或无法退出就回 Web。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持宿主任务与飞书交互，实际平台权限、出站文件范围和重启恢复仍待验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、cordis.patch.yml、package.json、src/bridge.ts、src/cards/InteractionCardController.ts、src/cards/interactions.ts、src/index.ts、src/message-dedup.ts、src/outbound.ts、src/setup/cli.ts、src/transport.ts、tsconfig.build.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码抽查长连接、回合、卡片审批、文件、凭据和挂载，未执行插件或飞书联调。
- 下一步：以隔离机器人和无敏感文件检查重放、错人批准、路径越界及退出，再与 Web 比较。

**分析版本**

- **仓库**：[PGZXB/dsh-feishu](https://github.com/PGZXB/dsh-feishu)
- **版本号**：0.3.7（[固定提交 98772bf](https://github.com/PGZXB/dsh-feishu/tree/98772bff938685741f138b93d7cad7aa3a01114b)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可把批准绑定具体授权主体，并由 Host 文件权限能力限制规范化路径。以错人、错卡和跨工作区测试证伪。

以隔离机器人和无敏感文件检查重放、错人批准、路径越界及退出，再与 Web 比较。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 7219 | — | — | 75828 |
| .mjs | source | 19 | 3245 | 2295 | 724 | — |
| .ts | source | 63 | 18287 | 12864 | 4518 | — |
| .ts | test | 49 | 20845 | 17824 | 1822 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PGZXB/dsh-feishu/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/PGZXB/dsh-feishu/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/PGZXB/dsh-feishu/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：飞书团队能否在原聊天中续接 DSH 任务、理解交付及审批状态，并控制文件和凭据边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书任务如何进入 DSH 会话并在原聊天更新？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合经常在飞书跟进同一个工作区任务的 DSH 用户。直接使用 Web 能看全量会话，手写消息转发可触发任务，但还需要单独处理会话映射和交互回执。插件用 SDK 的 WebSocket dispatcher 接收消息与卡片回调，既有运行中的会话先排队并显示独立卡片，空闲时按 chat ID 查找会话和工作目录，再调用宿主 agent.followup。卡片先发工作状态，用户回复、执行阶段和结果可以留在原聊天，任务是否合格仍需核对宿主结果。

消息去重只记最近 4096 个 ID 且在进程内。重启或驱逐后同一事件可再次入站，不能把消息去重视为任务仅执行一次。卡片动作处理分为立即空 ACK 后 patch 与等待交互 ACK 两种，网络故障时 UI 状态和宿主状态可能分离。没有本轮实机证据证明连接、卡片或耗时改善。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport.ts:354-382](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/transport.ts#L354-L382)

SDK dispatcher 处理消息与不同的卡片 ACK。

<details>
<summary>查看原文（29行）</summary>

```text
  async start(): Promise<void> {
    this.dispatcher.register({
      'im.message.receive_v1': (data) => {
        const message = normalizeMessageEvent(data as RawMessageEvent);
        if (message !== undefined) this.handler?.(message);
        return undefined;
      },
      'card.action.trigger': async (data: RawCardActionEvent) => {
        const action = normalizeCardAction(data);
        if (action === undefined) return {};
        if (!cardActionNeedsAck(action)) {
          // Fire-and-forget: these actions may take longer than Feishu's
          // 3-second callback deadline. Their card updates go through
          // `message.patch` as before.
          void this.actionHandler?.(action);
          return {};
        }
        // Return the updated card as the callback ACK. Feishu applies it
        // before stopping the click spinner; an empty ACK can make the
        // client restore the pre-click card and hide the decision.
        try {
          return (await this.actionHandler?.(action)) ?? {};
        } catch (error: unknown) {
          this.logger?.warn(`card action ACK failed: ${String(error)}`);
          return {};
        }
      },
    });
    await this.ws.start({ eventDispatcher: this.dispatcher });
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:1455-1503](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L1455-L1503)

排队、卡片、会话解析和宿主 followup。

<details>
<summary>查看原文（49行）</summary>

```text
      live !== undefined &&
      live.inbox !== undefined &&
      this.streaming.isWorking(message.chatId)
    ) {
      const queued = createUserMessage({
        content: await this.inboundContent(message),
        source: { kind: 'user' },
      });
      const entry: QueueCardEntry = {
        cardMessageId: undefined,
        status: 'queued',
        text: queueMessageText(queued),
        message: queued,
        feishu: message,
      };
      this.queueCardEntries(message.chatId).set(queued.id, entry);
      this.queuedFor(message.chatId).push(entry);
      await this.renderQueueItem(message.chatId, queued.id, entry);
      this.options.logger.debug(`message ${message.messageId} -> queued (chat ${message.chatId})`);
      return;
    }
    this.streaming.rememberPrompt(message.chatId, message.text);
    // Remember the accepted sender and chat type: proactive @-mentions in
    // groups (error notices, approval cards, question cards) target the user
    // who started this turn.
    this.requesterOpenIds.set(message.chatId, message.senderOpenId);
    this.chatTypes.set(message.chatId, message.chatType === 'group' ? 'group' : 'p2p');
    // Inbound media (image/file messages): download and inject BEFORE the
    // turn starts — a broken attachment notices loudly but never wedges the
    // chat (the turn continues, text-only when the attachment failed).
    const content = await this.inboundContent(message);
    // Inbound-wait-instruction: prepend any pending attachments (bare file
    // messages that arrived earlier) so this text message's turn works on
    // them too, in arrival order.
    this.drainPending(message.chatId, content);
    // Two-stage ack stage 1 + the working card state + the card open (the
    // streaming controller's beginTurn; a failed reaction or card post must
    // never block the turn).
    await this.streaming.beginTurn(message.chatId, message.messageId, turnTitle(message.text));
    const sessionId = this.options.sessionMap.ensure(message.chatId);
    const cwd = this.options.sessionMap.cwdFor(message.chatId) ?? this.options.defaultCwd;
    const agent = await this.resolveAgent(message.chatId, sessionId, cwd);
    this.options.logger.info(`delivering message ${message.messageId} to agent`);
    agent.followup(
      createUserMessage({
        content,
        source: { kind: 'user' },
      }),
    );
```

</details>

**依据 3 · 源码核查**：[src/message-dedup.ts:1-35](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/message-dedup.ts#L1-L35)

FIFO 去重仅进程内。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * In-memory deduplication of inbound Feishu message ids.
 *
 * Feishu may redeliver an event (6-hour replay window, daemon restarts), so
 * the surface must ignore a message id it has already processed. Durable
 * dedup (surviving process restarts) is deferred; this bounded in-memory
 * ring covers the live process lifetime.
 *
 * @module @dsh-feishu/dsh-feishu/message-dedup
 */

/** Bounded dedup set with FIFO eviction. */
export class MessageDeduplicator {
  private readonly seen = new Set<string>();
  private readonly order: string[] = [];

  /**
   * @param capacity - maximum remembered ids; oldest ids evict beyond it.
   */
  constructor(private readonly capacity = 4096) {}

  /**
   * Claim an id: `true` the first time, `false` on every repeat.
   * @param messageId - the Feishu message id to claim.
   * @returns whether the id was not seen before (i.e. should be processed).
   */
  claim(messageId: string): boolean {
    if (this.seen.has(messageId)) return false;
    this.seen.add(messageId);
    this.order.push(messageId);
    if (this.order.length > this.capacity) {
      const evicted = this.order.shift();
      if (evicted !== undefined) this.seen.delete(evicted);
    }
    return true;
```

</details>

**依据 4 · 源码核查**：[src/transport.ts:558-566](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/transport.ts#L558-L566)

卡片更新调用飞书 API。

```text
  async updateCard(messageId: string, card: CardJson): Promise<void> {
    this.logger?.debug(
      `transport updateCard ${messageId}: ${card.header?.title?.content ?? '(no title)'}`,
    );
    const response = await this.client.im.v1.message.patch({
      data: { content: JSON.stringify(card) },
      path: { message_id: messageId },
    });
    this.assertOk(response, 'im.v1.message.patch');
```

#### 缺口

- 真实卡片更新、重连和重复事件未验收
  **影响**：不能确认用户见到的回执与任务恰好一致
  **进一步探讨**：用只读任务对照宿主与飞书，模拟重启及事件重放

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 卡片上的批准和原消息授权如何区分？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

文字入站分别检查聊天及用户白名单，有非空配置才拒绝不在列表的值。私聊过名单即可响应，群聊按提及规则运行，裸附件在白名单后有特殊放行以便等待下一条指令。卡片动作另检查操作者白名单，然后按动作类型路由。待审批记录绑定请求 ID、chat ID 和卡片消息 ID，超时或中止清理，已决或不对应的回调不会重复消费。

发起者会被记下用于群内提醒，但审批消费函数没有把点击者与发起者或独立审批角色比对。两个都在名单内且能操作同一有效卡片的人，应用层仅据此无法区分谁应批准。白名单为空时，入口也没有独立用户限制。需核对飞书真实点击权限和 Host 的工具策略，不能从卡片显示或正确 ACK 推导跨成员隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.ts:2054-2079](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L2054-L2079)

消息层的聊天、用户、私聊和附件条件。

<details>
<summary>查看原文（26行）</summary>

```text
  private async shouldRespond(message: FeishuMessage): Promise<boolean> {
    const allowed = this.options.allowedChats ?? [];
    if (allowed.length > 0 && !allowed.includes(message.chatId)) {
      this.options.logger.info(`ignoring message from chat ${message.chatId}: not in allowlist`);
      return false;
    }
    const allowedUsers = this.options.allowedUsers ?? [];
    if (allowedUsers.length > 0 && !allowedUsers.includes(message.senderOpenId)) {
      this.options.logger.info(
        `ignoring message from user ${message.senderOpenId}: not in user allowlist`,
      );
      return false;
    }
    if (message.chatType === 'p2p') {
      this.options.logger.debug(
        `message ${message.messageId}: p2p chat -> respond (no mention gate)`,
      );
      return true;
    }
    // Inbound-wait-instruction: a bare attachment message (no text) bypasses
    // the group mention gate. Feishu sends attachments without an input box,
    // so an @ is physically impossible — gating it would dead-lock group file
    // usage. Registration is pending-only (no work happens), and the follow-up
    // TEXT instruction still passes the gate below, so the gate's safety
    // purpose (the agent never acts without an accepted instruction) holds.
    if (message.text === '' && (message.attachments?.length ?? 0) > 0) {
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:2195-2213](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L2195-L2213)

卡片动作的操作者门槛。

<details>
<summary>查看原文（19行）</summary>

```text
  async handleCardAction(action: CardAction): Promise<CardActionResponse | undefined> {
    // The user allowlist gates card buttons too (a button IS a command —
    // everything-is-a-card); an unlisted operator must not stop turns or
    // answer approvals from an allowed chat.
    const allowedUsers = this.options.allowedUsers ?? [];
    if (allowedUsers.length > 0 && !allowedUsers.includes(action.operatorOpenId)) {
      this.options.logger.info(
        `ignoring card action from user ${action.operatorOpenId}: not in user allowlist`,
      );
      return undefined;
    }
    const kind = action.value.kind;
    this.options.logger.info(
      `card action ${kind ?? '?'} from ${action.operatorOpenId} in ${action.chatId}`,
    );
    this.options.logger.debug(
      `card action ${kind ?? '?'} on card ${action.messageId} (chat ${action.chatId})`,
    );
    switch (kind) {
```

</details>

**依据 3 · 源码核查**：[src/bridge.ts:1476-1481](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L1476-L1481)

保存发起者供主动提醒。

```text
    this.streaming.rememberPrompt(message.chatId, message.text);
    // Remember the accepted sender and chat type: proactive @-mentions in
    // groups (error notices, approval cards, question cards) target the user
    // who started this turn.
    this.requesterOpenIds.set(message.chatId, message.senderOpenId);
    this.chatTypes.set(message.chatId, message.chatType === 'group' ? 'group' : 'p2p');
```

**依据 4 · 源码核查**：[src/cards/InteractionCardController.ts:335-352](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/cards/InteractionCardController.ts#L335-L352)

审批动作提取请求及结论，未检查发起者。

<details>
<summary>查看原文（18行）</summary>

```text
  async handleCardAction(action: CardAction): Promise<CardActionResponse | undefined> {
    switch (action.value.kind) {
      case 'approval': {
        const id = action.value.id;
        const decision = action.value.decision;
        if (id === undefined || (decision !== 'allow' && decision !== 'reject')) return undefined;
        const outcome = decision === 'allow' ? 'allowed-once' : 'rejected';
        const card = buildApprovalDecidedCard(outcome);
        this.approvalAckCards.set(id, card);
        const settled = this.interactions.resolveOnce(id, action.chatId, action.messageId, outcome);
        if (!settled) {
          // Stale callback: the interaction was already settled or the
          // callback targeted another card/chat. Do not claim the ACK.
          this.approvalAckCards.delete(id);
          return undefined;
        }
        return cardAck(card, { type: 'success', content: t('card.approval.submittedNote') });
      }
```

</details>

**依据 5 · 源码核查**：[src/cards/interactions.ts:45-81](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/cards/interactions.ts#L45-L81)

按聊天和卡片消费一次，超时取消。

<details>
<summary>查看原文（37行）</summary>

```text
  register(
    id: string,
    chatId: string,
    messageId: string,
    onSettle: (outcome: string) => void,
    timeoutMs = INTERACTION_TIMEOUT_MS,
  ): void {
    // A duplicate id supersedes the previous entry (its timer is cleared).
    const previous = this.pending.get(id);
    if (previous !== undefined) clearTimeout(previous.timer);
    let settled = false;
    const settle = (outcome: string): void => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      this.pending.delete(id);
      onSettle(outcome);
    };
    const timer = setTimeout(() => settle('cancelled'), timeoutMs);
    this.pending.set(id, { chatId, messageId, resolve: settle, timer });
  }

  /**
   * Settle a pending interaction from a card callback. A callback from the
   * wrong chat/card or for an unknown/already-settled id is ignored.
   * @param id - the request id.
   * @param chatId - the chat the callback came from.
   * @param messageId - the card the callback came from.
   * @param outcome - the outcome to settle with.
   * @returns whether the interaction was settled (false = stale/unknown).
   */
  resolveOnce(id: string, chatId: string, messageId: string, outcome: string): boolean {
    const entry = this.pending.get(id);
    if (entry === undefined) return false;
    if (entry.chatId !== chatId || entry.messageId !== messageId) return false;
    entry.resolve(outcome);
    return true;
```

</details>

#### 缺口

- 真实飞书成员能否操作目标卡片及 Host 额外审批未验证
  **影响**：群聊和有副作用工具需专门验收
  **进一步探讨**：用两个隔离用户分别点击非本人、错卡和超时请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 附件、文件发送及日志实际触及哪些内容？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

入站裸附件会进入等待指令路径，注释和调用表明先登记到本地并给回执，之后聊天文字才进入 agent。等待阶段不会主动开回合，但附件处理本身已发生本地写入。文本消息日志包含前 80 字符，Host 配置日志导出器可写入文件，因此不能把聊天文本当作只在飞书端保留。

send_file 在工具描述里接受工作区相对路径，执行时还接受绝对路径，并把相对值 join 到 cwd。它根据 agent session 查目标聊天后在 Host 直接 stat/readFile，所读路径没有 realpath 和工作区包含性检查。也应考虑 .. 与符号链接。随后按后缀上传为图片或普通文件。源码支持文件发送，但具体可读范围还由 OS 权限、Host 工具审批和部署决定；工具说明本身不能提供沙箱保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/bridge.ts:808-837](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L808-L837)

入站文本日志及附件登记。

<details>
<summary>查看原文（30行）</summary>

```text
    this.lastInboundAtValue = Date.now();
    this.options.logger.info(
      `inbound message ${message.messageId} in ${message.chatId} (${message.chatType}): ${message.text.slice(0, 80)}`,
    );
    // Feishu renders inline @-mentions as `@<label>` tokens. Strip them
    // before dispatch so "@bot /help" (or a mention mid-text) parses as the
    // slash command instead of falling into the working-directory gate as a
    // plain message. The agent also sees the cleaned text.
    const text = stripMentions(message.text);
    const slash = parseSlash(text);
    if (slash !== undefined) {
      this.options.logger.debug(
        `message ${message.messageId} -> slash command /${slash.name} (chat ${message.chatId})`,
      );
      await this.handleCommand(message, slash);
      return;
    }
    // Inbound-wait-instruction: a bare attachment message (no text) is
    // registered as pending — every attachment (file OR image, both treated
    // as plain files) lands on disk and a receipt card posts, but NO turn
    // starts. The user's follow-up text message drains the pending list into
    // its turn (the agent then works on the files). Attachment messages
    // cannot carry a mention (Feishu sends them without an input box), so
    // this is also where the mention gate is bypassed for groups — handled
    // in shouldRespond.
    if (text === '' && (message.attachments?.length ?? 0) > 0) {
      this.options.logger.debug(
        `message ${message.messageId} -> pending attachment (chat ${message.chatId})`,
      );
      await this.registerPending(message);
```

</details>

**依据 2 · 源码核查**：[src/bridge.ts:1482-1496](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/bridge.ts#L1482-L1496)

下一条文本消耗待处理附件。

<details>
<summary>查看原文（15行）</summary>

```text
    // Inbound media (image/file messages): download and inject BEFORE the
    // turn starts — a broken attachment notices loudly but never wedges the
    // chat (the turn continues, text-only when the attachment failed).
    const content = await this.inboundContent(message);
    // Inbound-wait-instruction: prepend any pending attachments (bare file
    // messages that arrived earlier) so this text message's turn works on
    // them too, in arrival order.
    this.drainPending(message.chatId, content);
    // Two-stage ack stage 1 + the working card state + the card open (the
    // streaming controller's beginTurn; a failed reaction or card post must
    // never block the turn).
    await this.streaming.beginTurn(message.chatId, message.messageId, turnTitle(message.text));
    const sessionId = this.options.sessionMap.ensure(message.chatId);
    const cwd = this.options.sessionMap.cwdFor(message.chatId) ?? this.options.defaultCwd;
    const agent = await this.resolveAgent(message.chatId, sessionId, cwd);
```

</details>

**依据 3 · 源码核查**：[src/index.ts:438-445](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/index.ts#L438-L445)

安装文件日志导出器。

```text
export function apply(ctx: Context, config: Config, deps: ApplyDeps = {}): void {
  // dsh surfaces mount no console exporter by default; bridge operators need
  // visible logs, so route structured log records to the console (the logger
  // service disposes the exporter with the current fiber). Also append to the
  // dsh-feishu log file under `$dataDir/logs` so the `/log` command and the
  // error-card "Export log" button can ship it to a chat.
  ctx.logger.exporter(consoleExporter(logFilePath(config.dataDir ?? defaultDataDir())));
  const credentials = resolveCredentials(config);
```

**依据 4 · 源码核查**：[src/outbound.ts:27-36](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/outbound.ts#L27-L36)

绝对路径或 cwd join。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Resolve a send target path against a working directory. The producer tools
 * (`write`/`edit`) carry an ABSOLUTE path in their `meta.diffs[].path`, while
 * the surface accepts a workspace-relative path too. An absolute path is used
 * as-is; a relative path is joined onto the cwd. Never re-join an absolute
 * path onto a cwd — that double-prefixes it (the #31 chip-click bug).
 */
function resolveSendPath(cwd: string, path: string): string {
  return isAbsolute(path) ? path : join(cwd, path);
}
```

</details>

**依据 5 · 源码核查**：[src/outbound.ts:130-160](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/outbound.ts#L130-L160)

按会话找聊天，Host 直接读文件。

<details>
<summary>查看原文（31行）</summary>

```text
      async execute(args: unknown, exec: ToolRunContext) {
        const { path, description } = args as { path?: string; description?: string };
        if (typeof path !== 'string' || path === '') {
          throw new Error('send_file: `path` is required');
        }
        const cwd = exec.agent?.session.header.cwd;
        if (cwd === undefined || exec.agent === undefined) {
          throw new Error('send_file: no working directory for this session');
        }
        const sessionId = exec.agent.session.id;
        const chatId = chatForSession(host.sessionMap, sessionId);
        if (chatId === undefined) {
          throw new Error('send_file: no chat mapped for this session');
        }
        const filePath = resolveSendPath(cwd, path);
        let bytes: Uint8Array;
        try {
          const info = await stat(filePath);
          if (!info.isFile()) throw new Error('not a file');
          bytes = new Uint8Array(await readFile(filePath));
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          host.logger.warn(`outbound send_file ${path}: unreadable (${msg})`);
          throw new Error(`send_file: could not read '${path}' (${msg})`);
        }
        const name = basename(filePath);
        const isImage = isImagePath(path);
        host.logger.debug(
          `outbound send_file ${name}: ${bytes.length} bytes, ${isImage ? 'image' : 'file'} -> chat ${chatId}`,
        );
        // Upload + post. The transport implementation picks the right API:
```

</details>

**依据 6 · 源码核查**：[src/outbound.ts:176-187](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/outbound.ts#L176-L187)

实际飞书出站。

<details>
<summary>查看原文（12行）</summary>

```text
          }
          if (isImage) {
            await host.transport.sendImage(chatId, name, bytes);
          } else {
            await host.transport.sendFile(chatId, name, bytes);
          }
          host.logger.debug(`outbound send_file ${name}: sent to chat ${chatId}`);
          return { name, sent: true };
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          host.logger.warn(`outbound send_file ${name}: send failed (${msg})`);
          throw new Error(`send_file: failed to send '${name}' (${msg})`);
```

</details>

#### 缺口

- 未验证实际 Host 工具权限或会话可达的宿主文件范围
  **影响**：有敏感文件的 Host 暂不接入
  **进一步探讨**：用无价值文件测试 cwd 内外及符号链接，核对 Host 拒绝和发送结果

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配对、版本和退出需要哪些运维工作？

**研究主题**：依赖、兼容与流程、工程质量与复用、效果与总成本

#### 完整回答

包要求 Node 22.13+，多个 Host peer 固定为 0.2.1-rc.2；包的真实兼容不能外推到其他版本。补丁挂载连接、文件上传和会话控制等依赖，缺服务可能影响提醒及会话操作。Host apply 根据配置建 transport，订阅审批、用户提问，停止时解除 Bridge 和传输。开通需要飞书应用、事件、卡片和文件权限，并验证目标聊天和工作目录。连接为出站 WS，可省掉公网接收地址，仍要承担网络、凭据与宿主版本维护。

设置 CLI 有显式 printEnv 路径，会将密钥输出到 stdout；默认路由把凭据写入 profile，已有文件使用 .bak。退出需检查客户端回调和 profile 配置，撤销或轮换飞书凭据，处理日志及备份。停止本地传输不能撤回飞书中既有消息和文件。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:27-31](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/package.json#L27-L31)

Node 与构建声明。

```text
  "engines": {
    "node": ">=22.13"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
```

**依据 2 · 源码核查**：[package.json:56-78](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/package.json#L56-L78)

Host peer 版本。

<details>
<summary>查看原文（23行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "0.2.1-rc.2",
    "@deepseek-ai/dsh-api-session-controller": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-connection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-file-upload": "0.2.1-rc.2",
    "@deepseek-ai/dsh-commands": "0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": "0.2.1-rc.2",
    "@deepseek-ai/dsh-invariants": "^0.2.0-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
    "@deepseek-ai/dsh-schedule": "0.2.1-rc.2",
    "@deepseek-ai/dsh-scope": "0.2.1-rc.2",
    "@deepseek-ai/dsh-session": "0.2.1-rc.2",
    "@deepseek-ai/dsh-storage": "0.2.1-rc.2",
    "@deepseek-ai/dsh-storage-domain": "0.2.1-rc.2",
    "@deepseek-ai/dsh-storage-json": "0.2.1-rc.2",
    "@deepseek-ai/dsh-timeout": "0.2.1-rc.2",
    "@deepseek-ai/dsh-tool-schedule": "0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": "0.2.1-rc.2",
    "@deepseek-ai/dsh-user-approval": "0.2.1-rc.2",
    "@deepseek-ai/dsh-user-questions": "0.2.1-rc.2",
    "@deepseek-ai/dsh-workspace": "0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.1"
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:32-52](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/cordis.patch.yml#L32-L52)

上传与 sessionController 挂载。

<details>
<summary>查看原文（21行）</summary>

```text
    # Client-connection service (`connection`), which the upload bundle below
    # injects; part of the same 0.1.7 chain that `dsh-schedule` now needs.
    - id: client-connection
      name: '@deepseek-ai/dsh-client-connection'

    # Host storage/staged-receipt service for uploads. dsh 0.1.7's
    # `api-session-controller` below injects `fileUploads`, which only this
    # bundle provides; without it the controller stays pending and the
    # reminder scheduler never activates (`unknown tool "schedule_create"`).
    # It injects nothing itself, so it is the root of this chain.
    - id: client-file-upload
      name: '@deepseek-ai/dsh-client-file-upload'

    # The Session business API owner. dsh 0.1.7's `dsh-schedule` injects
    # `sessionController`, which only this bundle provides — without it the
    # schedule row below stays `pending (waiting for service:
    # sessionController)` and registers no tools (the agent's create/list
    # calls fail with an unknown tool). dsh-base mounts `api-gateway` but
    # not this controller.
    - id: api-session-controller
      name: '@deepseek-ai/dsh-api-session-controller'
```

</details>

**依据 4 · 源码核查**：[src/index.ts:660-708](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/index.ts#L660-L708)

审批、问题、工具与停止路径。

<details>
<summary>查看原文（49行）</summary>

```text
  // Interactive approvals: answer every `approval/request` with a Feishu
  // approval card. Fail-closed semantics are the service's own (throwing or
  // no answerer yields `unavailable`), so an absent service is logged, not
  // fatal.
  const approvalService = ctx.get('approval');
  if (approvalService !== undefined) {
    ctx.on('approval/request', (request: ApprovalRequestLike) =>
      bridge.handleApprovalRequest(request),
    );
  } else {
    ctx.logger.warn('[feishu] approval service unavailable; approvals fail closed');
  }
  // Interactive questions: answer every `user-questions/request` with a
  // Feishu question card. The dsh runtime asks the scoped answerer waterfall
  // (`ctx.waterfall('user-questions/request', …)`); the surface listens on
  // the same event and claims the request by returning a structured answer.
  // Answerer instances dispose with the event subscription; the service's
  // absence degrades to an unanswered question (loud, non-fatal).
  const userQuestionsService = ctx.get('userQuestions');
  if (userQuestionsService !== undefined) {
    ctx.on('user-questions/request', (request: AskQuestionsRequestLike) =>
      bridge.askQuestions(request),
    );
  } else {
    ctx.logger.warn('[feishu] userQuestions service unavailable; questions cannot be rendered');
  }
  ctx.effect(() => () => {
    bridge.dispose();
    sessionMap.persist();
  });
  // Outbound files/images: give the agent a `send_file` tool so it can
  // deliver a workspace file/image to the chat. Feature-detect `tools`
  // (a dsh-base service) — absent, the surface logs and the agent never
  // sees the tool (never a broken tool). register() returns a disposer;
  // register it as an effect so it tears down with the bundle.
  const disposeSendFile = registerSendFileTool(ctx, {
    transport,
    sessionMap,
    appId: credentials.appId,
    logger,
  });
  if (disposeSendFile !== undefined) {
    ctx.effect(() => () => disposeSendFile());
  }
  promoteAmbientApiKey(ctx, config);
  void transport
    .start()
    .then(() => ctx.logger.info('[feishu] bridge ready'))
    .catch((error: unknown) => ctx.logger.error(`[feishu] bridge start failed: ${String(error)}`));
```

</details>

**依据 5 · 源码核查**：[src/setup/cli.ts:271-285](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/setup/cli.ts#L271-L285)

显式打印或写入 profile 与备份。

<details>
<summary>查看原文（15行）</summary>

```text
async function deliverCredentials(
  options: CliOptions,
  credentials: { appId: string; appSecret: string },
): Promise<void> {
  if (options.printEnv) {
    process.stdout.write(`export FEISHU_APP_ID=${credentials.appId}\n`);
    process.stdout.write(`export FEISHU_APP_SECRET=${credentials.appSecret}\n`);
    return;
  }
  const guided = await resolveGuidedConfig(options);
  const result = writeProfileCredentials(options.dshHomeDir, options.profile, credentials, guided);
  if (result.changed) {
    log(
      `wrote appId/appSecret into ${result.path}${result.backupPath ? ` (backup: ${result.backupPath})` : ''}`,
    );
```

</details>

**依据 6 · 作者声明**：[README.zh.md:10-14](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/README.zh.md#L10-L14)

作者所述预发布兼容范围。

```text
给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)（dsh）做的飞书 UI——一个 dsh 原生插件，带**面板驱动的控制台**：每个 slash 命令都是 ⚙️ 控制面板卡片上的一个按钮，审批和提问都在聊天卡片内完成，扫一次二维码就把整个应用配好。

> **注意：** [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness)
> 仍是预发布版本，版本之间可能有破坏性变更。dsh-feishu 以 **dsh `@latest`**
> （当前为 **`0.2.1-rc.2`**）为准构建与验证，从 npm 与从 git 安装都适用。
```

#### 缺口

- 真实租户的应用权限、停用及重启成本未测
  **影响**：无法确认接入净收益
  **进一步探讨**：使用专用机器人和独立 profile 做私聊回归后退出，检查本地副本与飞书权限

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何种结果能将当前观察改为可试用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

目前观察。飞书同聊天内处理任务和卡片有实质便利，但当前权限和本机文件边界需要先有隔离验收。可对照同一只读任务在原生 Web 和飞书的操作步骤、到可核对结果的时间和恢复时间。使用专用机器人、两名测试用户、单个无敏感数据的工作区和最低权限。分别检查重启去重、非发起者点击、旧卡片、路径越界和登录凭据。若错误批准或越界上传仍成立，回到 Web；只有明确收窄安全边界后再评估多用户和文件能力。

待验证设计是让审批消费绑定具体授权主体，并让 send_file 通过 Host 的文件权限能力读取规范化后仍处于工作区的文件。用允许用户、其他成员、符号链接、旧卡和过期回执对照当前实现。如果非授权操作仍能通过，或正常任务无法完成且只能普遍扩权，就收窄方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/cards/interactions.ts:67-81](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/cards/interactions.ts#L67-L81)

当前仅请求、聊天与卡片边界作对照。

<details>
<summary>查看原文（15行）</summary>

```text
  /**
   * Settle a pending interaction from a card callback. A callback from the
   * wrong chat/card or for an unknown/already-settled id is ignored.
   * @param id - the request id.
   * @param chatId - the chat the callback came from.
   * @param messageId - the card the callback came from.
   * @param outcome - the outcome to settle with.
   * @returns whether the interaction was settled (false = stale/unknown).
   */
  resolveOnce(id: string, chatId: string, messageId: string, outcome: string): boolean {
    const entry = this.pending.get(id);
    if (entry === undefined) return false;
    if (entry.chatId !== chatId || entry.messageId !== messageId) return false;
    entry.resolve(outcome);
    return true;
```

</details>

**依据 2 · 源码核查**：[src/outbound.ts:135-155](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/outbound.ts#L135-L155)

当前工作目录与文件实际读取作对照。

<details>
<summary>查看原文（21行）</summary>

```text
        const cwd = exec.agent?.session.header.cwd;
        if (cwd === undefined || exec.agent === undefined) {
          throw new Error('send_file: no working directory for this session');
        }
        const sessionId = exec.agent.session.id;
        const chatId = chatForSession(host.sessionMap, sessionId);
        if (chatId === undefined) {
          throw new Error('send_file: no chat mapped for this session');
        }
        const filePath = resolveSendPath(cwd, path);
        let bytes: Uint8Array;
        try {
          const info = await stat(filePath);
          if (!info.isFile()) throw new Error('not a file');
          bytes = new Uint8Array(await readFile(filePath));
        } catch (error: unknown) {
          const msg = error instanceof Error ? error.message : String(error);
          host.logger.warn(`outbound send_file ${path}: unreadable (${msg})`);
          throw new Error(`send_file: could not read '${path}' (${msg})`);
        }
        const name = basename(filePath);
```

</details>

**依据 3 · 源码核查**：[src/message-dedup.ts:20-35](https://github.com/PGZXB/dsh-feishu/blob/98772bff938685741f138b93d7cad7aa3a01114b/src/message-dedup.ts#L20-L35)

重启或驱逐是对照场景。

<details>
<summary>查看原文（16行）</summary>

```text
  constructor(private readonly capacity = 4096) {}

  /**
   * Claim an id: `true` the first time, `false` on every repeat.
   * @param messageId - the Feishu message id to claim.
   * @returns whether the id was not seen before (i.e. should be processed).
   */
  claim(messageId: string): boolean {
    if (this.seen.has(messageId)) return false;
    this.seen.add(messageId);
    this.order.push(messageId);
    if (this.order.length > this.capacity) {
      const evicted = this.order.shift();
      if (evicted !== undefined) this.seen.delete(evicted);
    }
    return true;
```

</details>

#### 缺口

- 缺少群组权限、任务对照及文件恢复的真实结果
  **影响**：当前保留观察
  **进一步探讨**：先完成隔离反例矩阵，再评价便利与额外成本

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
