# @tencent-connect/dsh-qqbot

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9109a1a](https://github.com/tencent-connect/dsh-qqbot/tree/9109a1abc958239aeef6a2eaa819880a380d4474)

<!-- BEGIN META -->
[![GitHub ★ 414](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=414&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tencent-connect/dsh-qqbot) [![npm 30d 30,185](https://img.shields.io/static/v1?label=npm+30d&message=30%2C185&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot)
<!-- END META -->

> **功能**：把QQ私聊和群聊接入DSH原生Agent，回传文本、工具反馈、审批和文件。

> **亮点**：把QQ消息作为原生Agent入口，整合续接、确认及结果/附件回传；不是新模型或Agent预设。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：默认open/群共享、审批未绑当前call/发起人、文件词法围栏与无本层耐久投递收据，不能从执行完成推交付可靠。见[Q03](#research-q03)。

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
  - [Q01 · QQ接入给谁什么增量，是普通转发还是Agent回合？](#detail-section-11)
  - [Q02 · 凭据、入站门、会话和回复怎样连起来？](#detail-section-12)
  - [Q03 · 哪些身份、文件和失败边界妨碍可靠远程执行？](#detail-section-13)
  - [Q04 · 部署条件、受控步骤和总成本是什么？](#detail-section-14)
  - [Q05 · 当前采用和生产方向如何判断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有DSH用户在QQ远程发任务和收结果，目标是权限正确、可核投递的任务而非在线消息。见[Q01](#research-q01)。

Web/TUI或手工转发更直接可见；插件减少渠道切换，也增加身份与平台交付状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| QQ私聊/群入口 | 远程原生Agent任务 | 默认open，群共享会话，@非个人授权 |
| 会话续接/命令 | 复用任务与切模型/preset | app/scope/peer key；preset失败回Host |
| 问答/审批 | 远程人机交互 | 审批按钮无当前call/发起人绑定证明 |
| 文本/流式/文件回传 | 收任务结果 | 平台/发送可失败，Agent完成非收到 |
| qqbot_send_file | 指定本地文件到QQ | 显式target可覆盖会话目标，路径为词法root |
| 媒体/视觉入口 | 收附件/可选图理解 | 配置限制不是独立下载/安全验收 |
| 绑定/设置 | 配应用凭据 | 完整管理路由与SDK认证未审 |

**流程与依赖**

在线DSH/QQ应用权限、匹配SDK及明确名单/preset/目录；TS源码需制品构建。表见[Q04](#research-q04)。

先隔离私聊显式名单并核Host实际工具，匿名只读任务后再核审批/文件/断线状态，失败先对账。步骤见[Q04](#research-q04)。

**效果与成本**

平台长连接、模型/工具、媒体及身份/投递恢复均计入一次合格远程任务。完整表见[Q04](#research-q04)。

渠道便利可解释，默认在线和Agent回合结束不足以确认交付；收据方向需净成本对照。见[Q05](#research-q05)。

> **思考**：默认open/群共享、审批未绑当前call/发起人、文件词法围栏与无本层耐久投递收据，不能从执行完成推交付可靠。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把QQ消息作为原生Agent入口，整合续接、确认及结果/附件回传；不是新模型或Agent预设。见[Q01](#research-q01)、[Q02](#research-q02)。

原生会话对象/事件与文本文件顺序可借鉴，群/动作/收件和失败状态需更明确关联。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认open/群共享、审批未绑当前call/发起人、文件词法围栏与无本层耐久投递收据，不能从执行完成推交付可靠。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，维护者限定名单/隔离目录/只读能力研究；不直接承接一般远程写任务。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

新固定源码支持QQ到原生Agent再回传的主链；未连平台或执行目标，关键身份/审批/文件/交付边界须先验证，建议观察。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/config.ts、src/features/approval-channel.ts、src/features/approval-renderer.ts、src/features/button-utils.ts、src/gateway/bootstrap.ts、src/gateway/middleware-setup.ts、src/index.ts、src/media/send-file-tool.ts、src/media/send-media.ts、src/session/session-manager.ts、src/transport/inbound.ts、src/transport/outbound.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定0.5.4入口、SDK中间件装配、会话key/恢复/目录/preset回退、原生followup/出站、审批按钮和pending、发送路径/目标、配置/生命周期；未穷尽SDK/绑定路由/全部命令、下载转码/视觉或宿主后端。
- 下一步：无旧research基线的新固定源码研究；本轮身份/revision已准备核定，unknown不当身份失败。不执行目标/连接QQ/发消息文件；平台/身份/关联/交付仍是研究缺口。

**分析版本**

- **仓库**：[tencent-connect/dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)
- **版本号**：0.5.4（[固定提交 9109a1a](https://github.com/tencent-connect/dsh-qqbot/tree/9109a1abc958239aeef6a2eaa819880a380d4474)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

身份/动作nonce、真实路径/目标授权和执行/投递分层收据，能否减少误批误投及总恢复成本待验证。见[Q05](#research-q05)。

无旧research基线的新固定源码研究；本轮身份/revision已准备核定，unknown不当身份失败。不执行目标/连接QQ/发消息文件；平台/身份/关联/交付仍是研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 767 | — | — | 5990 |
| .js | source | 1 | 23 | 18 | 2 | — |
| .ts | source | 64 | 8597 | 6155 | 1595 | — |
| .ts | test | 15 | 2902 | 2403 | 126 | — |

</details>

**活跃度**

[![Issue 未关闭 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=19&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=25&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)

暂未获取：近30天关闭。

统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：QQ远程任务如何绑定身份/权限/当前审批，并证明结果投到正确目标？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QQ接入给谁什么增量，是普通转发还是Agent回合？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有DSH Agent、希望在QQ私聊/群聊远程发起任务和收到回复/文件的用户。Web/TUI或手工复制消息是直接基线；插件把QQ身份、会话、消息/工具反馈和审批入口接到现有Agent，不是新模型或独立Agent预设。

源码组装userMessage后调用record.agent.followup并等whenIdle，出站按真实session ID监听assistant/tool/result/turn-end。因此这是原生Agent入口接线，后续推理/工具能力和权限仍取决于宿主组合，不是只请求一个聊天API；也没有本轮真实执行任务的证据。

合格交付应是指定发送者/会话发起的任务在预期权限执行，结果确实回到预期QQ目标，失败/重复/审批可解释。单看Bot在线、模型回答或文件upload成功不足以证明业务完成。需要宿主持续在线，平台应用权限/收件范围及网络另验。本项分配baseline不存在，按新固定源码研究，不继承旧空结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-5](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/README.md#L1-L5)

作者QQ私群接DSH定位。

```text
<div align="center">

<img width="120" src="https://img.shields.io/badge/🤖-QQ_Bot-blue?style=for-the-badge" alt="QQ Bot" />

**基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 的 QQ Bot 插件，将 DeepSeek AI 助手接入 QQ 私聊与群聊。**
```

**依据 2 · 源码核查**：[package.json:2-15](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/package.json#L2-L15)

实际0.5.4与dist入口。

<details>
<summary>查看原文（14行）</summary>

```text
  "name": "@tencent-connect/dsh-qqbot",
  "version": "0.5.4",
  "icon": "./assets/icons/qq_logo.svg",
  "description": "在 QQ 私聊和群聊里直接对话 DeepSeek Harness。 Chat with DeepSeek Harness in QQ private and group chats.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
```

</details>

**依据 3 · 源码核查**：[src/transport/inbound.ts:129-149](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/inbound.ts#L129-L149)

原生Agent followup与whenIdle。

<details>
<summary>查看原文（21行）</summary>

```text
  // ── 构建 UserMessage → followup ──
  const content: ContentBlock[] = [{ type: 'text' as const, text: agentBody }];

  const message = createUserMessage({
    content,
    source: { kind: 'user' as const },
  });

  record.agent.followup(message);
  logger.info(`→ followup sent: key=${scope}:${peerId}`);

  // 群消息回复后清空历史缓存（避免下次 @ 时重复组包）
  if (scope === 'group') {
    clearGroupHistory(config.appId, msg.groupOpenid ?? msg.senderId);
  }

  // 阻塞等待本轮 turn 收敛，避免后续消息在 turn 运行期间被 followup 打断
  try {
    await record.agent.whenIdle();
  } catch (err) {
    logger.warn(`whenIdle rejected: ${err instanceof Error ? err.message : String(err)}`);
```

</details>

**依据 4 · 源码核查**：[src/transport/outbound.ts:99-125](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/outbound.ts#L99-L125)

按session路由模型/工具/回合事件。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 事件分发入口 */
  public route(session: SessionLike, raw: RawSessionEvent): void {
    const event = parseEvent(raw);
    if (event === undefined) return;

    const record = this.manager.findBySessionId(session.header.id);
    if (record === undefined) return;

    switch (event.type) {
      case 'assistant/chunk':
        this.onChunk(session.header.id, record, event);
        break;
      case 'assistant/message':
        this.onMessage(session.header.id, record, event);
        break;
      case 'tool/call':
        this.onToolCall(event);
        break;
      case 'tool/result':
        this.onToolResult(record, event);
        break;
      case 'deliverables/presented':
        this.onPresented(session.header.id, event);
        break;
      case 'turn/end':
        this.onTurnEnd(session.header.id, record, event);
        break;
```

</details>

#### 缺口

- 无QQ应用/宿主同任务交付与身份/权限对照。
  **影响**：不能把代码桥接推为远程任务可靠完成。
  **进一步探讨**：匿名隔离账号/目录对照Web与QQ，核执行权限、正确目标、结果和总耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据、入站门、会话和回复怎样连起来？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口从配置/环境取AppID/Secret，缺失则异步启动绑定，不阻塞Host ready；拿到凭据后持久化或启动网关。SDK用WebSocket及配置的QQ API/token地址，本轮未审SDK认证/重连内部或完整绑定路由，不把AppID可用当聊天参与者获授权。

消息链先SDK过滤/去重和access，再群历史缓冲、mention门、内容清洗/限流、命令/待答问题、同peer合并队列、引用和附件。默认私聊/群access为open，群需@才触发；实际平台可达范围还取决于QQ应用权限。allowlist空数组被传成['*']，SDK怎样解释空名单场景须验，使用时应显式填允许openid。

Session key包含appId、c2c/group和peerId，私聊按用户、群聊按整个群；ID由key派生，尝试复用/恢复，失败才create，cwd统一取config或process.cwd。组历史在mention前记录，收到@且SDK提供history时拼入上下文，因此“需要@触发”不等“只读取@消息”。

出站按session匹配，按块发Markdown/可选流式，并等待在途文本后发声明文件；SDK回复限额适配/重连不等业务确认。插件还桥接问答和仅允许一次/拒绝的审批。preset解析失败警告后回Host composition，需要核真实挂载工具，不把配置preset名当硬权限围栏。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:27-46](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/index.ts#L27-L46)

凭据与非阻塞绑定入口。

<details>
<summary>查看原文（20行）</summary>

```text

  let appId = resolveEnv(config.appId, 'QQBOT_APPID');
  let appSecret = resolveEnv(config.appSecret, 'QQBOT_SECRET');

  // ── 凭据缺失时唤起扫码绑定 ──
  if (!appId || !appSecret) {
    logger.info('凭据未配置，启动扫码绑定...');

    // 关键：不 await 扫码结果。boot 会等 Loader 树稳定（loader.await()），
    // 无限期等待用户扫码会阻塞 Host ready——Desktop 界面无法进入、
    // Web 的 URL 延迟输出。绑定编排（路由/呈现/生命周期）在
    // ensureCredentials 的同步阶段即完成，凭据就绪后由异步链接管。
    void ensureCredentials(ctx, { logger, config: { ...config } })
      .then((credentials): void => {
        if (!credentials) {
          // null 包括：扫码取消、手动提交（已另行持久化）、流程失败
          logger.info('扫码绑定流程结束（未获取凭据或已手动配置）');
          return;
        }

```

</details>

**依据 2 · 源码核查**：[src/gateway/bootstrap.ts:42-67](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/gateway/bootstrap.ts#L42-L67)

SDK/端点/入站装配。

<details>
<summary>查看原文（26行）</summary>

```text
  return false;
}

export async function bootstrapGateway(
  ctx: Context,
  agents: DshAgentRegistry,
  config: ImQQBotConfig,
  logger: Logger,
): Promise<void> {
  const manager = new SessionManager(ctx, agents, config, logger);

  // ── 初始化 QQ Bot SDK ──
  const userAgent = buildUserAgent();
  const bot = new QQBot({
    appId: config.appId,
    appSecret: config.appSecret,
    transport: 'websocket',
    baseUrl: process.env.QQBOT_BASE_URL?.replace(/\/+$/, '') || 'https://api.bot.qq.com',
    tokenBaseUrl: process.env.QQBOT_TOKEN_BASE_URL?.replace(/\/+$/, '') || 'https://api.bot.qq.com',
    userAgent,
    logger,
  } as ConstructorParameters<typeof QQBot>[0]);
  logger.info(`QQBot SDK initialized (UA: ${userAgent})`);

  // ── 中间件链 ──
  setupMiddlewares(bot, config, manager, logger);
```

</details>

**依据 3 · 源码核查**：[src/gateway/bootstrap.ts:125-141](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/gateway/bootstrap.ts#L125-L141)

问答与审批通道装配。

<details>
<summary>查看原文（17行）</summary>

```text
    .on('agent/assistant-stream', (payload: unknown) => {
      const parsed = parseStreamFrame(payload);
      if (parsed !== undefined) outbound.routeStreamFrame(parsed.agentId, parsed.delta);
    }, { global: true });

  // ── 问答通道（ask_user_question → QQ 文本 + 按钮） ──
  const questionChannel = new QuestionChannel(manager, sender, config, logger);
  manager.questionChannel = questionChannel;
  questionChannel.install(ctx);

  // ── 审批通道（approval/request → QQ 两按钮审批） ──
  const approvalChannel = new ApprovalChannel(manager, sender, logger);
  manager.approvalChannel = approvalChannel;
  approvalChannel.install(ctx as unknown as ApprovalChannelContext);

  // ── 按钮点击回调（interaction）：统一分发到问答/审批通道 ──
  bot.on('interaction', async (_iCtx: unknown, event: InteractionEvent) => {
```

</details>

**依据 4 · 源码核查**：[src/gateway/middleware-setup.ts:37-76](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/gateway/middleware-setup.ts#L37-L76)

access在历史/mention之前，空名单传星号。

<details>
<summary>查看原文（40行）</summary>

```text
  bot.use(errorHandler());

  // 2. 消息过滤：bot 回声 + 消息去重
  bot.use(messageFilter({ skipSelfEcho: false }));

  // 3. 访问控制（白名单/开放/禁用）
  bot.use(accessPolicy({
    c2c: {
      mode: config.access.c2cMode,
      allow: config.access.c2cAllow.length > 0 ? config.access.c2cAllow : ['*'],
    },
    group: {
      mode: config.access.groupMode,
      allow: config.access.groupAllow.length > 0 ? config.access.groupAllow : ['*'],
    },
    onBlock: (_mCtx, reason) => {
      if (config.debug) {
        logger.debug(`Access blocked: ${reason}`);
      }
    },
  }));

  // 4. 群历史缓冲 — 放在门控之前，确保所有消息（含未 @bot）都计入上下文
  //    store 走共享单例（getHistoryStore），groupKey 带 appId 前缀，供回复后清空
  bot.use(historyBuffer({
    limit: config.historyLimit,
    store: getHistoryStore(),
    recordOnSkip: true,
    groupKey: (ctx) => {
      const gid = ctx.message.groupOpenid;
      if (ctx.message.kind !== 'group' || !gid) return undefined;
      return historyGroupKey(config.appId, gid);
    },
  }));

  // 5. 群聊 @bot 门控
  bot.use(mentionGate({
    requireMentionInGroup: config.requireMention,
  }));

```

</details>

**依据 5 · 源码核查**：[src/gateway/middleware-setup.ts:83-102](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/gateway/middleware-setup.ts#L83-L102)

限流、命令/问题和合并队列。

<details>
<summary>查看原文（20行）</summary>

```text
  bot.use(rateLimiter());

  // 8. 斜杠命令（在 concurrencyGuard 之前，命令匹配后不排队直接响应）
  const slash = slashCommand({
    // 关闭 autoHelp：help 命令由 qqbot 注册为 /bot-help，
    // 避免 SDK 再自动注册一个无前缀的 /help 造成重复
    autoHelp: false,
    commands: buildCommandList({ manager, config }),
  });
  bot.use(slash.middleware);

  // 8.5. 待答问题截获（在 concurrencyGuard 之前，答案消息不排队直接作答）
  bot.use(questionAnswer(manager));

  // 9. 并发串行 + 消息合并（同 peer 排队，避免 session 冲突）
  bot.use(concurrencyGuard({
    strategy: 'merge',
    maxQueue: config.maxQueue,
    maxProcessingMs: config.processingTimeoutMs,
  }));
```

</details>

**依据 6 · 源码核查**：[src/config.ts:103-107](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/config.ts#L103-L107)

默认open。

```text
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单'),
```

**依据 7 · 源码核查**：[src/session/session-manager.ts:430-458](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/session/session-manager.ts#L430-L458)

会话key/派生ID与preset挂载/失败回退。

<details>
<summary>查看原文（29行）</summary>

```text
  private sessionKey(scope: ChatScope, peerId: string): string {
    return `qqbot:${this.config.appId}:${scope}:${peerId}`;
  }

  private deriveSessionId(sessionKey: string): string {
    const hash = createHash('sha256').update(sessionKey).digest('hex');
    return `${hash.slice(0, 8)}-${hash.slice(8, 12)}-${hash.slice(12, 16)}-${hash.slice(16, 20)}-${hash.slice(20, 32)}`;
  }

  private currentSessionId(sessionKey: string): string {
    return this.modelResolver.getSessionId(sessionKey) ?? this.deriveSessionId(sessionKey);
  }

  private async composePreset(presetId?: string): Promise<PresetComposition> {
    const presets = this.getPresetsService();
    if (!presets) return {};

    try {
      const resolved = await presets.resolve(presetId);
      const resolvedId = resolved.id;
      return {
        agentPreset: resolvedId,
        setup: async (agentCtx: Context) => {
          await presets.mount(agentCtx, resolvedId);
        },
      };
    } catch (err) {
      this.logger.warn(
        `im-qqbot: preset ${presetId ?? '(default)'} unavailable: ${err instanceof Error ? err.message : String(err)} — using host composition`,
```

</details>

**依据 8 · 源码核查**：[src/session/session-manager.ts:487-517](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/session/session-manager.ts#L487-L517)

resume/create及统一cwd。

<details>
<summary>查看原文（31行）</summary>

```text

    const live = this.agents.get(sessionId);
    if (live) {
      agent = live;
      this.logger.info(`reusing live agent: key=${key}`);
    } else {
      // preset 只解析一次：resume/create 共用同一组合，避免重复 resolve/mount 目录。
      // 优先 session 当初的 preset（started 锁定语义），无则用当前 effective preset。
      const presetId = (await this.resolvePersistedPreset(sessionId)) ?? this.getEffectivePresetByKey(key);
      const composed = await this.composePreset(presetId);
      agentPreset = composed.agentPreset;
      try {
        const resumeRoute = this.modelResolver.getResumeRoute(key);
        const resumed = await this.agents.resume({
          resumeSessionId: sessionId,
          ...(resumeRoute ? { agentOptions: resumeRoute } : {}),
          ...(composed.setup ? { setup: composed.setup } : {}),
        });
        agent = resumed.agent;
        handle = resumed;
        this.logger.info(`resumed session: key=${key} preset=${agentPreset ?? 'none'} route=${resumeRoute ? `${resumeRoute.provider}/${resumeRoute.model}` : 'session-own'}`);
      } catch {
        const created = await this.agents.create({
          sessionId,
          meta: {
            cwd: this.config.cwd || process.cwd(),
            ...(agentPreset ? { agentPreset } : {}),
          },
          ...(route ? { agentOptions: route } : {}),
          ...(composed.setup ? { setup: composed.setup } : {}),
        });
```

</details>

**依据 9 · 源码核查**：[src/transport/inbound.ts:342-364](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/inbound.ts#L342-L364)

群历史拼入。

<details>
<summary>查看原文（23行）</summary>

```text
function buildAgentBody(
  base: string,
  history: HistoryEntry[] | undefined,
  isGroup: boolean,
  wasMentioned: boolean,
): string {
  if (!isGroup || !wasMentioned || !history || history.length === 0) {
    return base;
  }

  const historyLines = history.map(h => {
    const name = h.senderName ?? shortSenderId(h.senderId);
    return `[${name} (${h.senderId})] ${h.content}`;
  });

  return [
    '[Chat history begins]',
    ...historyLines,
    '',
    '[Chat history ends]',
    '[Current message]',
    base,
  ].join('\n');
```

</details>

**依据 10 · 源码核查**：[src/transport/outbound.ts:250-279](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/outbound.ts#L250-L279)

文本等待与文件投递顺序。

<details>
<summary>查看原文（30行）</summary>

```text
  private onTurnEnd(sessionId: string, record: SessionRecord, event: TurnEndEvent): void {
    const buffer = this.buffers.get(sessionId);
    // 文本 flush 可等待，保证回复先于交付文件到达用户
    let flushTask: Promise<void> = Promise.resolve();
    if (buffer !== undefined) {
      if (buffer.text.trim()) {
        flushTask = buffer.flush();
      } else {
        buffer.cancel();
      }
      this.buffers.delete(sessionId);
    }
    this.streamAttempts.delete(sessionId);
    const files = this.presentedFiles.get(sessionId) ?? [];
    this.presentedFiles.delete(sessionId);
    this.presentedCalls.delete(sessionId);
    // assistant/message 已在轮内先行发送的文本可能仍在途：与 turn/end 自身的 flush 一起等待
    const pending = this.pendingText.get(sessionId) ?? Promise.resolve();
    this.pendingText.delete(sessionId);

    const failure = extractTurnError(event.reason);
    void (async () => {
      await Promise.all([flushTask, pending]);
      if (failure !== undefined && !SILENT_TURN_ERROR_CODES.has(failure.code)) {
        await this.send(record, `⚠️ 本轮异常结束\n\`${failure.code}\`: ${failure.message}`, 'sendTurnEndError');
      }
      if (files.length > 0 && this.deliverer !== undefined) {
        await this.deliverer.deliver(record, files);
      }
      this.logger.debug(`im-qqbot: turn/end sessionId=${sessionId}`);
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些身份、文件和失败边界妨碍可靠远程执行？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

群按peer共用Agent，群允许名单不等群成员逐人授权，会话分开也不隔离config.cwd下的主机文件。preset缺失回Host而非拒绝；若用它限制工具，必须核失败后的真实权限。入站info日志会写body前200字符，debug关闭不等消息正文不落日志。

审批有实在的拒绝/取消/发送失败返回unavailable设计，但按钮payload只有approval+allow/deny，handler按当前群/用户会话找pending，未核callId、request nonce或原发起user。不能凭两个按钮就承诺批准的是当前那条命令；旧未用按钮、其他群成员和平台有效期的交错需要验证。本轮没有重放或误批复现。

qqbot_send_file允许显式target优先于当前会话；文件白名单由media/cwd/extraRoots做resolve/relative词法判断，后续stat跟随文件系统并把localPath交SDK，没有本层realpath检查。因此不能把restrictPaths当已证明的符号链接/收件人授权隔离；SDK最终上传限制未审，未发送任何文件，不称实际外传。

出站会先清理内存本轮文件/发送状态，再异步发；文本分块send失败记日志后继续，本层未给持久重放/人已收到收据。SDK可能重试或平台可能拒绝，均未独立验；Agent turn完成不等QQ交付成功，也不能见超时就无幂等地重新执行有副作用任务。

范围限定：本轮未完整审SDK去重/下载、凭据绑定管理路由、转码/视觉和所有命令，不能给综合安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/session/session-manager.ts:430-431](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/session/session-manager.ts#L430-L431)

按群/用户而非每个群成员的key。

```text
  private sessionKey(scope: ChatScope, peerId: string): string {
    return `qqbot:${this.config.appId}:${scope}:${peerId}`;
```

**依据 2 · 源码核查**：[src/session/session-manager.ts:443-460](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/session/session-manager.ts#L443-L460)

preset失败用Host。

<details>
<summary>查看原文（18行）</summary>

```text
  private async composePreset(presetId?: string): Promise<PresetComposition> {
    const presets = this.getPresetsService();
    if (!presets) return {};

    try {
      const resolved = await presets.resolve(presetId);
      const resolvedId = resolved.id;
      return {
        agentPreset: resolvedId,
        setup: async (agentCtx: Context) => {
          await presets.mount(agentCtx, resolvedId);
        },
      };
    } catch (err) {
      this.logger.warn(
        `im-qqbot: preset ${presetId ?? '(default)'} unavailable: ${err instanceof Error ? err.message : String(err)} — using host composition`,
      );
      return {};
```

</details>

**依据 3 · 源码核查**：[src/session/session-manager.ts:509-516](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/session/session-manager.ts#L509-L516)

统一cwd而非用户独立目录。

```text
        const created = await this.agents.create({
          sessionId,
          meta: {
            cwd: this.config.cwd || process.cwd(),
            ...(agentPreset ? { agentPreset } : {}),
          },
          ...(route ? { agentOptions: route } : {}),
          ...(composed.setup ? { setup: composed.setup } : {}),
```

**依据 4 · 源码核查**：[src/transport/inbound.ts:107-117](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/inbound.ts#L107-L117)

非debug的正文片段日志。

<details>
<summary>查看原文（11行）</summary>

```text
  // ── 组装 agentBody（下载结果经 mwState.downloadedFiles 提供） ──
  const agentBody = assembleAgentBody(msg, mwState, scope, logger);

  if (!agentBody) return;

  logger.info(`Processing: scope=${scope} peerId=${peerId} body="${agentBody.slice(0, 200)}"`);

  // ── 获取或创建会话 ──
  let record;
  try {
    record = await manager.getOrCreate(scope, peerId, msg.senderId, replyTarget);
```

</details>

**依据 5 · 源码核查**：[src/features/approval-renderer.ts:36-59](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/approval-renderer.ts#L36-L59)

按钮只有t/d且未附callId/nonce。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildApprovalKeyboard(): InlineKeyboard {
  const allow = {
    id: 'approval-allow',
    render_data: { label: '✅ 允许一次', visited_label: '✓ 已允许', style: 1 },
    action: {
      type: 1,
      permission: { type: 2 },
      click_limit: 1,
      data: encodeButtonData({ t: 'approval', d: 'allow' }),
    },
    group_id: 'approval',
  };
  const deny = {
    id: 'approval-deny',
    render_data: { label: '❌ 拒绝', visited_label: '✓ 已拒绝', style: 0 },
    action: {
      type: 1,
      permission: { type: 2 },
      click_limit: 1,
      data: encodeButtonData({ t: 'approval', d: 'deny' }),
    },
    group_id: 'approval',
  };
  return { content: { rows: [{ buttons: [allow, deny] }] } };
```

</details>

**依据 6 · 源码核查**：[src/features/button-utils.ts:31-52](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/button-utils.ts#L31-L52)

审批数据类型及直接JSON编解码，不附生成请求身份。

<details>
<summary>查看原文（22行）</summary>

```text
/** 审批按钮：d=决策 */
export interface ApprovalButtonData {
  t: 'approval';
  d: 'allow' | 'deny';
}

export type ButtonData = QuestionButtonData | ApprovalButtonData;

/** 编码 button_data（JSON 字符串） */
export function encodeButtonData(data: ButtonData): string {
  return JSON.stringify(data);
}

/** 解码 button_data；非法 JSON 或缺少合法 `t` 时返回 undefined */
export function decodeButtonData(raw: string): ButtonData | undefined {
  try {
    const parsed = JSON.parse(raw) as Partial<ButtonData>;
    if (parsed !== null && typeof parsed === 'object' && (parsed.t === 'question' || parsed.t === 'approval')) {
      return parsed as ButtonData;
    }
  } catch {
    // fall through
```

</details>

**依据 7 · 源码核查**：[src/features/approval-channel.ts:159-176](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/approval-channel.ts#L159-L176)

按当前peer pending决定，没有绑定发起user/request。

<details>
<summary>查看原文（18行）</summary>

```text
  /** 按钮点击决策：解码 button_data，settle pending 审批 */
  public handleInteraction(event: InteractionEvent): boolean {
    const peerId = event.group_openid ?? event.user_openid;
    if (!peerId) return false;
    const scope: ChatScope = event.group_openid ? 'group' : 'c2c';
    const record = this.manager.getSessionRecord(scope, peerId);
    if (!record) return false;
    const entry = this.pending.get(record.sessionKey);
    if (!entry) return false;

    const data = event.data?.resolved?.button_data;
    if (!data) return false;
    const button = decodeButtonData(data);
    if (!button || button.t !== 'approval') return false;

    this.pending.delete(record.sessionKey);
    this.removeAbort(entry);
    entry.resolve(button.d === 'allow' ? 'allowed-once' : 'rejected');
```

</details>

**依据 8 · 源码核查**：[src/features/approval-channel.ts:182-210](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/approval-channel.ts#L182-L210)

发送失败不可用、signal取消及pending。

<details>
<summary>查看原文（29行）</summary>

```text
    const key = record.sessionKey;
    // 会话回收/取消可能在发送前发生：signal 已 abort 则直接失败
    if (request.signal?.aborted) return 'cancelled';

    const command = commandOf(request);
    try {
      await this.sender.sendMarkdown(
        record.replyTarget,
        buildApprovalText(request, command),
        { keyboard: buildApprovalKeyboard() },
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`im-qqbot: approval send failed key=${key}: ${msg}`);
      return 'unavailable'; // 无法呈现审批，fail-closed
    }

    return new Promise<ApprovalOutcome>((resolve) => {
      const entry: PendingApproval = { record, request, resolve };
      if (request.signal) {
        const onAbort = (): void => {
          if (this.pending.get(key) !== entry) return;
          this.pending.delete(key);
          resolve('cancelled');
        };
        entry.onAbort = onAbort;
        request.signal.addEventListener('abort', onAbort, { once: true });
      }
      this.pending.set(key, entry);
```

</details>

**依据 9 · 源码核查**：[src/media/send-file-tool.ts:109-134](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/media/send-file-tool.ts#L109-L134)

显式target和路径检查/发送。

<details>
<summary>查看原文（26行）</summary>

```text
      // 1. 解析发送目标：显式 target > 当前会话（exec.agent → SessionRecord）
      let replyTarget: ReplyTarget | undefined;
      if (target !== undefined && target !== '') {
        replyTarget = parseTarget(target);
        if (replyTarget === undefined) {
          throw new Error(`qqbot_send_file: target 格式错误，需要 c2c:openid 或 group:openid，收到: ${target}`);
        }
      } else if (exec.agent !== undefined) {
        replyTarget = manager.findByAgent(exec.agent as DshAgent)?.replyTarget;
      }
      if (replyTarget === undefined) {
        throw new Error('qqbot_send_file: 无法确定发送目标，请显式传 target 参数');
      }

      // 2. 校验文件 + 路径白名单
      const absPath = resolve(file_path);
      if (!isPathAllowed(absPath, config.sendFile, cwd)) {
        throw new Error(`qqbot_send_file: file_path 不在允许的目录内: ${absPath}`);
      }
      if (!existsSync(absPath)) {
        throw new Error(`qqbot_send_file: 文件不存在: ${absPath}`);
      }

      // 3. 按扩展名分类发送（与交付物投递共用 send-media 的分发实现）
      const fileName = basename(absPath);
      const result = await sendMediaFile(bot, replyTarget, absPath);
```

</details>

**依据 10 · 源码核查**：[src/media/send-media.ts:30-40](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/media/send-media.ts#L30-L40)

词法路径白名单。

<details>
<summary>查看原文（11行）</summary>

```text
/** 判断 filePath 是否位于 root 目录内（含 root 本身） */
export function isWithinRoot(filePath: string, root: string): boolean {
  const rel = relative(resolve(root), filePath);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/** 路径白名单校验：restrictPaths 关闭时放行任意路径，否则限定 media + cwd + extraRoots */
export function isPathAllowed(filePath: string, config: SendFileConfig, cwd: string): boolean {
  if (!config.restrictPaths) return true;
  const roots = [MEDIA_ROOT, cwd, ...config.extraRoots];
  return roots.some((root) => isWithinRoot(filePath, root));
```

</details>

**依据 11 · 源码核查**：[src/media/send-media.ts:61-78](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/media/send-media.ts#L61-L78)

stat后传SDK localPath。

<details>
<summary>查看原文（18行）</summary>

```text
  let size: number;
  try {
    const info = await stat(filePath);
    if (!info.isFile()) return { outcome: 'missing' };
    size = info.size;
  } catch {
    return { outcome: 'missing' };
  }

  const fileName = opts.fileName ?? basename(filePath);
  const ext = extname(filePath).toLowerCase();
  const source = { localPath: filePath };

  try {
    const result = ext === '.gif' || IMAGE_EXTS.has(ext)
      ? await bot.sendImage(target, source)
      : VIDEO_EXTS.has(ext)
        ? await bot.sendVideo(target, source)
```

</details>

**依据 12 · 源码核查**：[src/transport/outbound.ts:250-279](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/outbound.ts#L250-L279)

状态清理与异步发送。

<details>
<summary>查看原文（30行）</summary>

```text
  private onTurnEnd(sessionId: string, record: SessionRecord, event: TurnEndEvent): void {
    const buffer = this.buffers.get(sessionId);
    // 文本 flush 可等待，保证回复先于交付文件到达用户
    let flushTask: Promise<void> = Promise.resolve();
    if (buffer !== undefined) {
      if (buffer.text.trim()) {
        flushTask = buffer.flush();
      } else {
        buffer.cancel();
      }
      this.buffers.delete(sessionId);
    }
    this.streamAttempts.delete(sessionId);
    const files = this.presentedFiles.get(sessionId) ?? [];
    this.presentedFiles.delete(sessionId);
    this.presentedCalls.delete(sessionId);
    // assistant/message 已在轮内先行发送的文本可能仍在途：与 turn/end 自身的 flush 一起等待
    const pending = this.pendingText.get(sessionId) ?? Promise.resolve();
    this.pendingText.delete(sessionId);

    const failure = extractTurnError(event.reason);
    void (async () => {
      await Promise.all([flushTask, pending]);
      if (failure !== undefined && !SILENT_TURN_ERROR_CODES.has(failure.code)) {
        await this.send(record, `⚠️ 本轮异常结束\n\`${failure.code}\`: ${failure.message}`, 'sendTurnEndError');
      }
      if (files.length > 0 && this.deliverer !== undefined) {
        await this.deliverer.deliver(record, files);
      }
      this.logger.debug(`im-qqbot: turn/end sessionId=${sessionId}`);
```

</details>

**依据 13 · 源码核查**：[src/transport/outbound.ts:284-292](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/outbound.ts#L284-L292)

分块发送失败只记录。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
```

#### 缺口

- 审批旧按钮/成员关联、SDK空名单/去重、路径真实解析和断线交付未验。
  **影响**：不能承诺逐请求人确认、无越界/重复或可靠交付。
  **进一步探讨**：匿名临时Bot与目录构造两次审批/不同成员、符号链接、显式别目标和发一半断线，核实际权限/投递及恢复收据。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署条件、受控步骤和总成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| QQ应用凭据/对应平台权限与网络 | 渠道必需 | SDK认证、连接与消息/媒体 | 配置成功不等可达/发得出，平台限制另核 |
| 在线DSH Agent和明确preset/工具/权限/cwd | 核心必需 | 真正执行任务 | 不能拿默认Host composition当最小权限 |
| qqbot-nodejs/connector等匹配包 | SDK必需 | 网关/中间件/绑定 | package版本范围不等运行SDK已验，内部行为未完整审 |
| Web客户端/配置与本地持久/媒体空间 | 对应入口必需 | 绑定设置、会话/媒体和文件 | 头部加载不代表整链可用 |
| 显式私聊openid名单、禁群/非敏感专用目录 | 当前研究必需 | 缩小身份/内容范围 | 默认open/群共享不适合当个人隔离 |
| dist/lib构建或对应发布包 | 加载必需 | TS host/client产物 | checkout两入口均缺，需构建/匹配制品 |

固定package0.5.4、MIT，build为tsc+tsdown，未构建/安装/核发布字节。本轮INPUT/准备材料已固定仓库版本，changes=unknown不作身份失败；没有旧研究基线，不宣称最新远端或平台当前仍可分发。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定界 | 维护者隔离Bot/工作目录，显式c2cAllow、禁群并核Host实际工具/权限 | 无默认Host扩大，秘密不进样本/日志 |
| 连接 | 维护者配凭据/模型、匹配制品并看ready/断线 | 加载/绑定不能替代连接状态 |
| 对话 | 用户发非敏感只读任务 | 核原生Agent执行、会话/收件人和完整回复 |
| 审批 | 用无副作用样本核两次请求/旧按钮/不同发送者/取消 | 未对应当前动作就停写能力，不依赖旧按钮 |
| 文件 | 临时无敏感文件核真实路径和显式目标 | 检查上传/回复与实际收件，不靠词法路径名判断 |
| 故障/退出 | 维护者断线/半发送后核任务状态，停插件核Agent与socket | 不盲重执行，保留会话/日志/发送结果再恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 在线主机、SDK/构建及QQ/模型资源 | 凭据/平台能力、ACL、preset和目录核验 | 金额/审核条件/工时未核，不称免费接入 |
| 持续使用 | 原生模型/工具、长连接、媒体下载/存储及日志 | 处理访问/审批/格式与失败 | 默认媒体200MB/24h为配置，不是独立执行证明 |
| 失败恢复 | 重连/重发/队列与重复执行风险 | 核Agent完成vsQQ收到、按钮和文件状态 | 无本层耐久交付收据，恢复工时未知 |
| 升级退出 | 会话/凭据/媒体备份清理 | SDK/平台变更、取消pending/停Agent/socket | lifecycle有清理设计，未实测全程停止 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 远程Agent入口 | followup/whenIdle及原生事件回传 | 真实任务正确/完整交付 |
| 会话续接 | app+scope+peer key与resume/create | 群成员隔离、并发/重连重复 |
| 人机确认 | 问答/允许一次与取消路径 | 当前请求/发起人绑定和平台按钮有效性 |
| 文件/结果 | 文本后投递及目标/路径检查 | realpath、收件权限与发送失败重放 |

按“一次权限正确且结果到达正确目标的任务”计所有执行/恢复和人工，不以Bot在线、消息数或上传file_uuid作净收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:77-81](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/index.ts#L77-L81)

凭据常驻路由装配。

```text
  registerBoundCredentialRoutes(ctx, logger, appId, { ...config });

  const resolvedConfig: ImQQBotConfig = { ...config, appId, appSecret };

  await bootstrapGateway(ctx, agents, resolvedConfig, logger);
```

**依据 2 · 源码核查**：[src/media/send-file-tool.ts:51-69](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/media/send-file-tool.ts#L51-L69)

文件工具可选注册。

<details>
<summary>查看原文（19行）</summary>

```text
/** 注册 qqbot_send_file 工具（tools 服务缺失时优雅降级，不阻断插件启动） */
export function registerSendFileTool(
  ctx: Context,
  bot: MediaSenderLike,
  manager: SessionManager,
  config: ImQQBotConfig,
  logger: Logger,
): void {
  const tools = ctx.get('tools') as ToolsRegistryLike | undefined;
  if (!tools?.register) {
    logger.warn('im-qqbot: tools 服务不可用，qqbot_send_file 工具未注册');
    return;
  }

  const cwd = config.cwd || process.cwd();

  const definition = {
    name: SEND_FILE_TOOL_NAME,
    description: DESCRIPTION,
```

</details>

**依据 3 · 源码核查**：[package.json:2-27](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/package.json#L2-L27)

版本与dist/client导出、build。

<details>
<summary>查看原文（26行）</summary>

```text
  "name": "@tencent-connect/dsh-qqbot",
  "version": "0.5.4",
  "icon": "./assets/icons/qq_logo.svg",
  "description": "在 QQ 私聊和群聊里直接对话 DeepSeek Harness。 Chat with DeepSeek Harness in QQ private and group chats.",
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "scripts": {
    "build": "tsc && tsdown --config tsdown.client.config.ts",
    "build:client": "tsdown --config tsdown.client.config.ts",
    "dev": "tsc --watch",
    "prepublishOnly": "npm run build",
    "lint": "eslint src/",
    "test": "vitest run",
    "typecheck:client": "tsc -p tsconfig.client.json",
```

</details>

**依据 4 · 源码核查**：[package.json:42-42](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/package.json#L42-L42)

许可。

```text
  "license": "MIT",
```

**依据 5 · 源码核查**：[package.json:69-83](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/package.json#L69-L83)

SDK/宿主依赖。

<details>
<summary>查看原文（15行）</summary>

```text
  "dependencies": {
    "@tencent-connect/qqbot-connector": "1.2.0",
    "@tencent-connect/qqbot-nodejs": "^1.0.5",
    "js-yaml": "^4.1.0",
    "qrcode": "^1.5.4",
    "yaml": "2.8.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1",
    "@deepseek-ai/dsh-agent": ">=0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": ">=0.1.0-rc.6",
    "@deepseek-ai/dsh-session": ">=0.1.0-rc.6",
    "@deepseek-ai/dsh-user-approval": ">=0.1.0-rc.6",
    "@deepseek-ai/schemastery": ">=3.18.1",
    "@tencent-connect/qqbot-connector": "1.2.0"
```

</details>

**依据 6 · 源码核查**：[src/config.ts:103-107](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/config.ts#L103-L107)

访问默认。

```text
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单'),
```

**依据 7 · 源码核查**：[src/config.ts:135-142](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/config.ts#L135-L142)

媒体配置上限/TTL。

```text
  media: Schema.object({
    enabled: Schema.boolean().default(true).description('是否启用富媒体理解（图片/视频下载 + 工具分析）'),
    maxMB: Schema.number().default(200).description('富媒体下载大小上限(MB)'),
    ttlHours: Schema.number().default(24).description('富媒体存活时长(小时)，0=永不过期'),
  }).default({
    enabled: true,
    maxMB: 200,
    ttlHours: 24,
```

**依据 8 · 源码核查**：[src/config.ts:161-170](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/config.ts#L161-L170)

文件root/交付配置。

<details>
<summary>查看原文（10行）</summary>

```text
  sendFile: Schema.object({
    restrictPaths: Schema.boolean().default(true).description('是否启用路径白名单（默认 true，仅允许 media + cwd + extraRoots）'),
    extraRoots: Schema.array(Schema.string()).default([]).description('额外允许访问的根目录'),
    sendPresentedFiles: Schema.boolean().default(true).description('是否将 present 声明的交付文件发送到当前会话'),
    maxFiles: Schema.number().default(4).description('单轮最多投递的交付文件数'),
  }).default({
    restrictPaths: true,
    extraRoots: [],
    sendPresentedFiles: true,
    maxFiles: 4,
```

</details>

**依据 9 · 源码核查**：[src/gateway/bootstrap.ts:188-202](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/gateway/bootstrap.ts#L188-L202)

生命周期启动/失败与dispose/stop。

<details>
<summary>查看原文（15行）</summary>

```text
  // ── 生命周期 ──
  (ctx as unknown as { effect(fn: () => (() => Promise<void>) | void, name?: string): void })
    .effect(() => {
      logger.info(`Starting bot (appId=${config.appId})`);
      bot.start().catch((err: unknown) => {
        logger.error(`Bot start failed: ${err instanceof Error ? err.message : String(err)}`);
      });

      return async () => {
        logger.info('Shutting down');
        await manager.disposeAll();
        bot.stop();
      };
    }, 'im-qqbot.lifecycle');
}
```

</details>

#### 缺口

- 缺真实QQ/宿主任务、平台限制及总资源/人工恢复数据。
  **影响**：无法量化可用性、净便利和可靠任务率。
  **进一步探讨**：匿名账号矩阵对照Web/QQ，计执行正确、目标到达、重复、所有模型/媒体和人工。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前采用和生产方向如何判断？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察。已有DSH且需要QQ远程任务的用户确有入口增量，但默认open、群共享、审批关联和本层交付收据缺口使一般远程写任务尚不能直接接受。维护者可在单私聊显式名单、非敏感目录和已核宿主只读工具中研究，不能只设置一个preset名就当权限收紧。出现发起人/审批不对应、路径/目标不明或任务完成但回复缺失，应停止副作用和发送，先核会话/收件与日志，不重复执行碰运气。

可借鉴scope会话归属、原生Agent事件回传、文本先文件后以及审批发送失败不可用。生产方向是统一身份/动作/投递收据：将App/peer/发送者/工具callId/审批nonce和期限绑定，拒绝旧/异人按钮；文件真实路径与收件目标共同授权；任务执行ID和文本/附件消息ID分开记录可核状态，重试先对账。

以Web/手工转发和当前版为基线，匿名样本交错群成员/旧按钮、preset缺失、链接路径、别目标、SDK重连/重复消息和半发送。比较误批、误目标、重复执行、交付缺失与总人工/模型成本；若只是多记录却不能减少错误或恢复时间，否定优势。该方案未实现，不把现有按钮/队列当可靠事务。

#### 证据与依据

**依据 1 · 源码核查**：[src/features/approval-channel.ts:159-176](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/approval-channel.ts#L159-L176)

动作绑定方向的当前pending匹配。

<details>
<summary>查看原文（18行）</summary>

```text
  /** 按钮点击决策：解码 button_data，settle pending 审批 */
  public handleInteraction(event: InteractionEvent): boolean {
    const peerId = event.group_openid ?? event.user_openid;
    if (!peerId) return false;
    const scope: ChatScope = event.group_openid ? 'group' : 'c2c';
    const record = this.manager.getSessionRecord(scope, peerId);
    if (!record) return false;
    const entry = this.pending.get(record.sessionKey);
    if (!entry) return false;

    const data = event.data?.resolved?.button_data;
    if (!data) return false;
    const button = decodeButtonData(data);
    if (!button || button.t !== 'approval') return false;

    this.pending.delete(record.sessionKey);
    this.removeAbort(entry);
    entry.resolve(button.d === 'allow' ? 'allowed-once' : 'rejected');
```

</details>

**依据 2 · 源码核查**：[src/features/approval-renderer.ts:36-59](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/features/approval-renderer.ts#L36-L59)

静态按钮payload。

<details>
<summary>查看原文（24行）</summary>

```text
export function buildApprovalKeyboard(): InlineKeyboard {
  const allow = {
    id: 'approval-allow',
    render_data: { label: '✅ 允许一次', visited_label: '✓ 已允许', style: 1 },
    action: {
      type: 1,
      permission: { type: 2 },
      click_limit: 1,
      data: encodeButtonData({ t: 'approval', d: 'allow' }),
    },
    group_id: 'approval',
  };
  const deny = {
    id: 'approval-deny',
    render_data: { label: '❌ 拒绝', visited_label: '✓ 已拒绝', style: 0 },
    action: {
      type: 1,
      permission: { type: 2 },
      click_limit: 1,
      data: encodeButtonData({ t: 'approval', d: 'deny' }),
    },
    group_id: 'approval',
  };
  return { content: { rows: [{ buttons: [allow, deny] }] } };
```

</details>

**依据 3 · 源码核查**：[src/media/send-media.ts:30-40](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/media/send-media.ts#L30-L40)

真实路径方向对应词法边界。

<details>
<summary>查看原文（11行）</summary>

```text
/** 判断 filePath 是否位于 root 目录内（含 root 本身） */
export function isWithinRoot(filePath: string, root: string): boolean {
  const rel = relative(resolve(root), filePath);
  return rel === '' || (!rel.startsWith('..') && !isAbsolute(rel));
}

/** 路径白名单校验：restrictPaths 关闭时放行任意路径，否则限定 media + cwd + extraRoots */
export function isPathAllowed(filePath: string, config: SendFileConfig, cwd: string): boolean {
  if (!config.restrictPaths) return true;
  const roots = [MEDIA_ROOT, cwd, ...config.extraRoots];
  return roots.some((root) => isWithinRoot(filePath, root));
```

</details>

**依据 4 · 源码核查**：[src/transport/outbound.ts:250-292](https://github.com/tencent-connect/dsh-qqbot/blob/9109a1abc958239aeef6a2eaa819880a380d4474/src/transport/outbound.ts#L250-L292)

执行/投递状态应分开的当前链。

<details>
<summary>查看原文（43行）</summary>

```text
  private onTurnEnd(sessionId: string, record: SessionRecord, event: TurnEndEvent): void {
    const buffer = this.buffers.get(sessionId);
    // 文本 flush 可等待，保证回复先于交付文件到达用户
    let flushTask: Promise<void> = Promise.resolve();
    if (buffer !== undefined) {
      if (buffer.text.trim()) {
        flushTask = buffer.flush();
      } else {
        buffer.cancel();
      }
      this.buffers.delete(sessionId);
    }
    this.streamAttempts.delete(sessionId);
    const files = this.presentedFiles.get(sessionId) ?? [];
    this.presentedFiles.delete(sessionId);
    this.presentedCalls.delete(sessionId);
    // assistant/message 已在轮内先行发送的文本可能仍在途：与 turn/end 自身的 flush 一起等待
    const pending = this.pendingText.get(sessionId) ?? Promise.resolve();
    this.pendingText.delete(sessionId);

    const failure = extractTurnError(event.reason);
    void (async () => {
      await Promise.all([flushTask, pending]);
      if (failure !== undefined && !SILENT_TURN_ERROR_CODES.has(failure.code)) {
        await this.send(record, `⚠️ 本轮异常结束\n\`${failure.code}\`: ${failure.message}`, 'sendTurnEndError');
      }
      if (files.length > 0 && this.deliverer !== undefined) {
        await this.deliverer.deliver(record, files);
      }
      this.logger.debug(`im-qqbot: turn/end sessionId=${sessionId}`);
    })();
  }

  /** 统一发送：切分 + 逐 chunk 发送 + 错误记录 */
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
    }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
