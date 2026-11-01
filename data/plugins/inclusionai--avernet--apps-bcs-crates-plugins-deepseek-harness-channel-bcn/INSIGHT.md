# DeepSeek Harness Channel BCN

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6fb0042](https://github.com/inclusionAI/Avernet/tree/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn)

<!-- BEGIN META -->
[![GitHub ★ 598](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=598&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/inclusionAI/Avernet) [![npm 30d 1,557](https://img.shields.io/static/v1?label=npm+30d&message=1%2C557&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn)
<!-- END META -->

> **功能**：将 DeepSeek Harness Agent 接入 Avernet Bot Collaboration Network。

> **亮点**：[Q01](#research-q01) 集中 DSH 与 BCN 会话接线，[Q02](#research-q02) 将网络请求派发给 Agent 并发送事件。

> **主要限制**：[Q03](#research-q03) 内存缓冲有限，不能保证重启或断线无丢失；[Q04](#research-q04) 凭据和对端须独立管理。

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
  - [Q01 · BCN 通道相对 DSH Web 或手动转发解决什么？](#detail-section-11)
  - [Q02 · 消息如何落到 DSH Agent 并返回状态？](#detail-section-12)
  - [Q03 · 断线缓冲、凭据与审批的失败边界是什么？](#detail-section-13)
  - [Q04 · 版本、凭据、数据及采用成本是什么？](#detail-section-14)
  - [Q05 · 如何帮助用户决定断线后是否需要人工对账？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Agent 需要在授权 BCN 会话中接收消息与返回结果。

原生 DSH Web 会话或人工在系统间转发内容。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 消息桥 | BCN 会话与 Agent 通信 | 依赖外部服务和凭据 |
| 事件缓冲 | 断线时暂存事件 | 内存容量有限 |
| 审批与提问 | 路由 BCN 活跃 run 的交互 | 对端完成情况未测 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH 和 Node | 必需 | 宿主及 Agent | 不兼容需停止 |
| BCN V3 及网络 | 必需 | 接收消息和事件 | 连接失败退避，缓冲有限 |
| Bot Session 或注册凭据 | 必需 | 鉴权 | 缺失或端点不符报错 |
| 模型 | 按会话需要 | Agent 响应 | 需用户自行配置 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核宿主版本、授权与凭据 | 不符合停止 |
| 连接 | 配置端点并启动 | 确认对端连接和身份 |
| 试用 | 发送低敏消息并处理审批 | 核对 run 的终态 |
| 异常 | 核本地与对端状态 | 未知时不盲目重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 服务和网络成本未知 | 配置版本和凭据 | 外部服务未测 |
| 运行 | 模型和网络费用未知 | 审批及状态核查 | 吞吐未知 |
| 失败 | 停机和恢复成本未知 | 对账与排障 | 缓冲有限 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 消息桥 | 映射会话并向 Agent 派发 | 对端消费成功 |
| 断线 | 有限缓存与退避重连 | 重启后不丢事件 |
| 审批 | 活跃 BCN run 前置路由 | 真实往返及时完成 |

> **思考**：[Q03](#research-q03) 内存缓冲有限，不能保证重启或断线无丢失；[Q04](#research-q04) 凭据和对端须独立管理。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中 DSH 与 BCN 会话接线，[Q02](#research-q02) 将网络请求派发给 Agent 并发送事件。

[Q02](#research-q02) run_id 确认先于 Agent 执行；[Q03](#research-q03) 断线队列有容量上限。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 内存缓冲有限，不能保证重启或断线无丢失；[Q04](#research-q04) 凭据和对端须独立管理。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在受控服务和兼容宿主用低敏消息试通，并对照终态；异常时双方核查后再处理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态检查消息、凭据、缓冲与交互代表链；未运行对端或宿主。

- 已检查：作者 README、包清单、源码路径 apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/interactions.ts 及固定范围 inventory；组件：apps/bcs/crates/plugins/deepseek-harness-channel-bcn。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定子组件清单、入口、桥、连接、身份和交互代表路径；未读取独立服务组件，未运行 DSH、BCN、网络或模型。
- 下一步：[Q05](#research-q05) 确认对端协议后比较现有日志与跨端对账。

**分析版本**

- **仓库**：[inclusionAI/Avernet](https://github.com/inclusionAI/Avernet)
- **版本号**：0.2.4（[固定提交 6fb0042](https://github.com/inclusionAI/Avernet/tree/6fb00420cf553fe36cde9f6eca4204a1f4d07200)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设双方确认的脱敏对账视图能减少断线误判；尚未验证。

[Q05](#research-q05) 确认对端协议后比较现有日志与跨端对账。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 375 | — | — | 2589 |
| .ts | source | 14 | 2924 | 2678 | 41 | — |
| .ts | test | 10 | 1898 | 1767 | 33 | — |

</details>

**活跃度**

[![Issue 未关闭 109](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=109&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=37&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对通道消息、身份、交互与断线边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · BCN 通道相对 DSH Web 或手动转发解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

package.json:1-4 将其定义为 Avernet Bot Collaboration Network 的 DSH 通道包。index.ts:21-41 装载凭据、建立桥与连接，bridge.ts:133-139 注册会话和交互请求；增量是在网络通道中承载 DSH Agent 会话，而非模型本身或 BCN 服务。人工转发与原生 Web 是基线；没有联网任务、吞吐或协作收益对照。

#### 证据与依据

**依据 1 · 作者声明**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json:1-4](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json#L1-L4)

作者描述插件定位。

```text
{
  "name": "@avernet-plugin/deepseek-harness-channel-bcn",
  "version": "0.2.4",
  "description": "DeepSeek Harness channel bundle for the Avernet Bot Collaboration Network.",
```

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts:21-41](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts#L21-L41)

加载会话并启动桥和连接。

<details>
<summary>查看原文（21行）</summary>

```text
export async function apply(ctx: Context, rawConfig: PluginConfig): Promise<() => Promise<void>> {
  const config = normalizeConfig(rawConfig);
  const log = ctx.logger(name);
  if (!config.enabled) {
    log.info('BCN channel is installed but disabled');
    return async () => {};
  }

  const { session, endpoint } = await loadOrRegisterBotSession(ctx, config);
  let bridge: BcnBridge | undefined;
  const client = new BcnWsClient({
    endpoint,
    session,
    config,
    status: () => bridge?.busy ? 'busy' : 'idle',
    onSessionChanged: rotated => persistBotSession(ctx, config, rotated),
    log,
  });
  bridge = new BcnBridge(ctx, client, config, log);
  bridge.start();
  client.start();
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:133-139](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L133-L139)

注册聊天与交互请求。

```text
  start(): void {
    this.disposers.push(
      this.client.onRequest('chat.send', frame => this.handleChatSend(frame)),
      this.client.onRequest('chat.inject', frame => this.handleChatInject(frame)),
      this.client.onRequest('chat.abort', frame => this.handleChatAbort(frame)),
      this.client.onRequest('interaction.resolve', frame => this.interactions.resolve(frame)),
    );
```

#### 缺口

- 未验证真实协作或模型效果
  **影响**：不能证明吞吐或协作收益
  **进一步探讨**：在授权测试服务对照 Web 与通道。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 消息如何落到 DSH Agent 并返回状态？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

bridge.ts:325-387 解析 chat.send，拒绝缺少 bcs_session_id，以 idempotency_key 或请求 id 作 runId；同一内存 run 复用前需核 session 一致。创建 Agent 后注入用户消息，异常发送 DELIVERY_FAILED；先回复 run_id 再执行，收到 run_id 并不代表 Agent 完成。bridge.ts:528-537 和 630-650 将文本和终态发为 chat 事件；交付依赖外部 BCN、宿主与模型，本研究未验服务端消费，也不能把内存去重推广到进程重启。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:325-387](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L325-L387)

消息校验、内存去重、Agent 派发和失败。

<details>
<summary>查看原文（63行）</summary>

```text
  private async handleChatSend(frame: RequestFrame): Promise<void> {
    let params: ChatSendParams;
    try {
      params = parseChatSendParams(frame.params);
    } catch (error) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest(error));
      return;
    }
    const bcsSessionId = params.bcs_session_id?.trim();
    if (!bcsSessionId) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest('BCN V3 chat.send requires bcs_session_id'));
      return;
    }
    const runId = params.idempotency_key ?? frame.id;
    const existing = this.runs.get(runId);
    if (existing) {
      if (existing.bcsSessionId !== bcsSessionId) {
        this.client.sendResponse(frame.id, false, undefined, invalidRequest('run_id belongs to another bcs_session_id'));
        return;
      }
      this.client.sendResponse(frame.id, true, { run_id: existing.runId });
      return;
    }

    const sessionIdentity = resolveBcnSessionIdentity({
      sessionKey: params.session_key,
      groupId: params.bcs_group_id,
      bcsSessionId,
    });
    const sessionId = dshSessionIdForV2(sessionIdentity);
    const toolProfile = resolveToolProfile(params.session_context);
    const run: RunContext = {
      runId,
      sessionId,
      groupId: params.bcs_group_id,
      bcsSessionId,
      text: '',
      stepText: new Map(),
      terminal: false,
      usage: { input: 0, output: 0 },
      toolNames: new Map(),
      toolArguments: new Map(),
      toolStarts: new Set(),
      toolResults: new Set(),
      pendingToolResults: new Map(),
      toolProfile,
    };
    this.runs.set(runId, run);
    this.client.sendResponse(frame.id, true, { run_id: runId });

    try {
      const managed = await this.getOrCreateAgent(sessionIdentity, toolProfile);
      if (this.disposed || run.terminal) return;
      const message = createUserMessage({
        content: [{ type: 'text', text: formatInboundMessage(params) }],
        source: { kind: 'bcn-channel' },
      });
      this.runIdByMessageId.set(String(message.id), runId);
      run.messageId = message.id;
      managed.agent.followup(message);
    } catch {
      this.sendTerminal(run, 'error', 'DELIVERY_FAILED');
    }
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:528-537](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L528-L537)

发送增量文本。

<details>
<summary>查看原文（10行）</summary>

```text
  private appendDelta(run: RunContext, step: number, text: string): void {
    run.text += text;
    run.stepText.set(step, `${run.stepText.get(step) ?? ''}${text}`);
    this.client.sendEvent('chat', {
      runId: run.runId,
      sessionId: run.bcsSessionId,
      ts: Date.now(),
      state: 'delta',
      content: text,
    });
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:630-650](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L630-L650)

发送终态事件。

<details>
<summary>查看原文（21行）</summary>

```text
    const payload: Record<string, unknown> = {
      runId: run.runId,
      sessionId: run.bcsSessionId,
      ts: Date.now(),
      state,
    };
    if (run.text) payload.content = run.text;
    if (state === 'final') {
      if (run.text) payload.content = run.text;
      if (run.usage.input || run.usage.output) payload.usage = run.usage;
      if (stopReason) payload.stopReason = stopReason;
      if (run.route) payload.routing = routeWire(run.route);
    } else if (state === 'error') {
      payload.errorMessage = 'DeepSeek Harness run failed';
      payload.errorKind = 'dsh_turn';
      payload.errorCode = errorCode ?? 'UNKNOWN';
    } else {
      payload.stopReason = 'aborted';
    }
    this.client.sendEvent('chat', payload);
    run.terminal = true;
```

</details>

#### 缺口

- 未检查外部服务消费及重启后去重
  **影响**：不能证明端到端恰好一次
  **进一步探讨**：用测试服务核重试、重启及终态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 断线缓冲、凭据与审批的失败边界是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

credentials.ts:15-39 优先复用存储 Bot Session，端点不匹配拒绝，首次配置与凭据缺失报错；72-85 注册后持久化。ws-client.ts:149-162 断线时在内存缓冲，超过 1000 帧或 16 MiB 上限报错；238-255 连接成功后 flush，失败指数退避。interactions.ts:34-44 仅对属于活跃 BCN run 的 Agent 前置处理审批和提问，其他请求交 next；58-84 检查交互标识、run 和类型。缓冲满、进程重启或对端已接收但确认丢失的完整恢复未证实，不能承诺无丢失。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts:15-39](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts#L15-L39)

已保存身份复用及首次缺失失败。

<details>
<summary>查看原文（25行）</summary>

```text
export async function loadOrRegisterBotSession(
  ctx: Context,
  config: Config,
  options: { resolver?: DnsResolver; transport?: HttpTransport } = {},
): Promise<ResolvedBotSession> {
  const botSessionRef = credentialRef(config.botSessionRef);
  const stored = await ctx.credentials.resolve(botSessionRef);
  if (stored) {
    const session = parseBotSession(stored.value);
    const endpoint = await resolveEndpoint(session.endpoint, options.resolver);
    if (config.endpoint && canonicalizeEndpoint(config.endpoint) !== endpoint.baseUrl.toString()) {
      throw new Error(
        'Configured BCN endpoint differs from the endpoint bound into BCN_BOT_SESSION; clear or rotate the Bot Session before changing endpoints',
      );
    }
    return { session, endpoint };
  }

  if (!config.endpoint || !config.botName) {
    throw new Error('First-time BCN onboarding requires endpoint and botName configuration');
  }
  const endpoint = await resolveEndpoint(config.endpoint, options.resolver);
  const onboardingToken = await ctx.credentials.resolve(credentialRef(config.onboardingTokenRef));
  if (!onboardingToken) {
    throw new Error(`BCN onboarding token credential ${config.onboardingTokenRef} is not configured`);
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts:72-85](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts#L72-L85)

注册与保存会话。

<details>
<summary>查看原文（14行）</summary>

```text
  const registration = await client.register(onboardingToken.value, config.botName,
    scope && providerBotRef ? { scope, providerBotRef } : undefined);
  const session: BotSession = {
    version: 1,
    endpoint: endpoint.baseUrl.toString(),
    botUuid: registration.bot_uuid,
    botToken: registration.bot_token,
    botName: registration.bot_name,
    ...(registration.registration ? { registration: registration.registration } : {}),
  };

  // /register already creates the Bot, sets its name, and establishes ownership.
  // Persist before connecting so restarts reuse this identity without registering again.
  await ctx.credentials.set(botSessionRef, JSON.stringify(session));
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts:149-162](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts#L149-L162)

有限断线事件缓冲。

<details>
<summary>查看原文（14行）</summary>

```text
  sendEvent(event: string, payload: Record<string, unknown>): void {
    const seq = ++this.eventSequence;
    const frame: EventFrame = { type: 'event', event, payload: { ...payload, seq }, seq };
    if (this.connected) {
      this.sendFrameNow(frame);
      return;
    }
    const bytes = Buffer.byteLength(JSON.stringify(frame), 'utf8');
    if (bytes > MAX_FRAME_BYTES) throw new Error('BCN event exceeds 2 MiB');
    if (this.queuedEvents.length >= 1_000 || this.queuedEventBytes + bytes > 8 * MAX_FRAME_BYTES) {
      throw new Error('BCN reconnect event buffer is full');
    }
    this.queuedEvents.push({ frame, bytes });
    this.queuedEventBytes += bytes;
```

</details>

**依据 4 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts:238-255](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts#L238-L255)

重连与退避。

<details>
<summary>查看原文（18行）</summary>

```text
      this.connectedState = true;
      this.reconnectDelayMs = this.options.config.reconnectInitialMs;
      this.flushQueuedEvents();
      this.startHeartbeat();
      this.options.log?.info(
        `Connected to BCN with Bot WebSocket protocol v${connected.protocol_version} (bot_uuid=${connected.bot_uuid})`,
      );
    } catch (error) {
      this.connectedState = false;
      const socket = this.socket;
      this.socket = undefined;
      socket?.removeAllListeners();
      socket?.terminate();
      this.rejectPending(new Error('BCN connection attempt failed'));
      if (!this.stopped) {
        this.options.log?.warn(`BCN connection failed; retrying in ${this.reconnectDelayMs}ms`);
        this.scheduleConnect(this.reconnectDelayMs);
        this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, this.options.config.reconnectMaxMs);
```

</details>

**依据 5 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/interactions.ts:34-44](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/interactions.ts#L34-L44)

按活跃 run 前置审批和提问。

<details>
<summary>查看原文（11行）</summary>

```text
  mount(ctx: Context, agent: Agent): void {
    // DSH Web's remote answerer is registered earlier and does not call next
    // while awaiting its UI. Own BCN agents before that fallback gets the request.
    ctx.on('approval/request', (req, next) => {
      const run = this.activeRun(agent);
      return run && req.agent === agent ? this.approve(run, req) : next();
    }, { prepend: true });
    ctx.on('user-questions/request', (req, next) => {
      const run = this.activeRun(agent);
      return run && req.agent === agent ? this.ask(ctx, agent, run, req) : next();
    }, { prepend: true });
```

</details>

**依据 6 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/interactions.ts:58-84](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/interactions.ts#L58-L84)

交互范围及幂等字段校验。

<details>
<summary>查看原文（27行）</summary>

```text
  async resolve(frame: RequestFrame): Promise<void> {
    const params = asRecord(frame.params);
    const id = asNonEmptyString(params?.interactionId);
    const runId = asNonEmptyString(params?.runId);
    const kind = asNonEmptyString(params?.kind);
    if (!params || !id || !runId || !kind || !asNonEmptyString(params.idempotencyKey)) {
      this.reject(frame, 'INVALID_REQUEST', 'interaction.resolve requires runId, interactionId, kind and idempotencyKey');
      return;
    }
    const pending = this.pending.get(id);
    if (!pending) {
      const completed = this.completed.get(id);
      if (completed?.runId === runId && completed.kind === kind && completed.resolution === resolutionKey(params)) {
        this.client.sendResponse(frame.id, true, {});
      } else this.reject(frame, 'INTERACTION_NOT_FOUND', 'Unknown or already settled interaction');
      return;
    }
    if (pending.run.runId !== runId || pending.kind !== kind) {
      this.reject(frame, 'SCOPE_MISMATCH', 'Interaction does not belong to this run and kind');
      return;
    }
    try {
      const value = pending.validate(params);
      this.completed.set(id, { runId, kind, resolution: resolutionKey(params) });
      while (this.completed.size > 2_000) this.completed.delete(this.completed.keys().next().value!);
      pending.settle(value);
      this.client.sendResponse(frame.id, true, {});
```

</details>

#### 缺口

- 未测试长断线、重启及审批往返
  **影响**：不能承诺不丢消息或完全恢复
  **进一步探讨**：模拟缓冲溢出与重复请求并核对对端。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 版本、凭据、数据及采用成本是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:44-54、73-74 固定 DSH peer 为 >=0.2.0-rc.2 至 <=0.2.1-rc.2，Node >=22.19；需要可用 BCN 和身份凭据。发送的消息和 Agent 事件跨网络传递，模型费用、网络、服务器和人工审批成本未测。先在受控 BCN 与兼容宿主用低敏测试消息，核对持久身份、交互和结束状态；认证错误、对端不可用、范围不明或状态未知时暂停并由双方核查，避免盲目重发。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json:44-54](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json#L44-L54)

宿主 peer 范围。

<details>
<summary>查看原文（11行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.5-alpha.1",
    "@deepseek-ai/dsh-agent": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-session": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-session-persistence": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-user-approval": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/dsh-user-questions": ">=0.2.0-rc.2 <=0.2.1-rc.2",
    "@deepseek-ai/schemastery": "~3.18.5-alpha.1"
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json:73-74](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json#L73-L74)

Node 版本。

```text
  "engines": {
    "node": ">=22.19.0"
```

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts:21-41](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts#L21-L41)

凭据、桥与客户端启动。

<details>
<summary>查看原文（21行）</summary>

```text
export async function apply(ctx: Context, rawConfig: PluginConfig): Promise<() => Promise<void>> {
  const config = normalizeConfig(rawConfig);
  const log = ctx.logger(name);
  if (!config.enabled) {
    log.info('BCN channel is installed but disabled');
    return async () => {};
  }

  const { session, endpoint } = await loadOrRegisterBotSession(ctx, config);
  let bridge: BcnBridge | undefined;
  const client = new BcnWsClient({
    endpoint,
    session,
    config,
    status: () => bridge?.busy ? 'busy' : 'idle',
    onSessionChanged: rotated => persistBotSession(ctx, config, rotated),
    log,
  });
  bridge = new BcnBridge(ctx, client, config, log);
  bridge.start();
  client.start();
```

</details>

**依据 4 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:325-387](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L325-L387)

消息进入 Agent。

<details>
<summary>查看原文（63行）</summary>

```text
  private async handleChatSend(frame: RequestFrame): Promise<void> {
    let params: ChatSendParams;
    try {
      params = parseChatSendParams(frame.params);
    } catch (error) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest(error));
      return;
    }
    const bcsSessionId = params.bcs_session_id?.trim();
    if (!bcsSessionId) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest('BCN V3 chat.send requires bcs_session_id'));
      return;
    }
    const runId = params.idempotency_key ?? frame.id;
    const existing = this.runs.get(runId);
    if (existing) {
      if (existing.bcsSessionId !== bcsSessionId) {
        this.client.sendResponse(frame.id, false, undefined, invalidRequest('run_id belongs to another bcs_session_id'));
        return;
      }
      this.client.sendResponse(frame.id, true, { run_id: existing.runId });
      return;
    }

    const sessionIdentity = resolveBcnSessionIdentity({
      sessionKey: params.session_key,
      groupId: params.bcs_group_id,
      bcsSessionId,
    });
    const sessionId = dshSessionIdForV2(sessionIdentity);
    const toolProfile = resolveToolProfile(params.session_context);
    const run: RunContext = {
      runId,
      sessionId,
      groupId: params.bcs_group_id,
      bcsSessionId,
      text: '',
      stepText: new Map(),
      terminal: false,
      usage: { input: 0, output: 0 },
      toolNames: new Map(),
      toolArguments: new Map(),
      toolStarts: new Set(),
      toolResults: new Set(),
      pendingToolResults: new Map(),
      toolProfile,
    };
    this.runs.set(runId, run);
    this.client.sendResponse(frame.id, true, { run_id: runId });

    try {
      const managed = await this.getOrCreateAgent(sessionIdentity, toolProfile);
      if (this.disposed || run.terminal) return;
      const message = createUserMessage({
        content: [{ type: 'text', text: formatInboundMessage(params) }],
        source: { kind: 'bcn-channel' },
      });
      this.runIdByMessageId.set(String(message.id), runId);
      run.messageId = message.id;
      managed.agent.followup(message);
    } catch {
      this.sendTerminal(run, 'error', 'DELIVERY_FAILED');
    }
```

</details>

**依据 5 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts:149-162](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts#L149-L162)

断线缓冲有限。

<details>
<summary>查看原文（14行）</summary>

```text
  sendEvent(event: string, payload: Record<string, unknown>): void {
    const seq = ++this.eventSequence;
    const frame: EventFrame = { type: 'event', event, payload: { ...payload, seq }, seq };
    if (this.connected) {
      this.sendFrameNow(frame);
      return;
    }
    const bytes = Buffer.byteLength(JSON.stringify(frame), 'utf8');
    if (bytes > MAX_FRAME_BYTES) throw new Error('BCN event exceeds 2 MiB');
    if (this.queuedEvents.length >= 1_000 || this.queuedEventBytes + bytes > 8 * MAX_FRAME_BYTES) {
      throw new Error('BCN reconnect event buffer is full');
    }
    this.queuedEvents.push({ frame, bytes });
    this.queuedEventBytes += bytes;
```

</details>

#### 缺口

- 未验证服务、费用和权限边界
  **影响**：无法保证兼容或运营成本
  **进一步探讨**：核授权与版本后隔离环境试消息与审批。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户决定断线后是否需要人工对账？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 runId、seq、终态与断线队列已可标识并发送状态，不应重复增加在线提示或序号。设想在双方支持的前提下提供脱敏对账视图：按会话和 run 比较对端确认的最高序号、终态及本地缓冲，区分已确认、未确认和未知，并由用户决定查询还是手工恢复；不得自动重放可能有副作用的请求。对照现有重连日志和事件，在缓冲满、对端确认丢失、重启和重复发送下测误判、漏报与人工排查时间；对端没有可靠确认、未知被显示为成功或收益不足则否定。先确认协议和已有界面是否已有等价确认。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:325-345](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L325-L345)

现有 run 身份和内存去重。

<details>
<summary>查看原文（21行）</summary>

```text
  private async handleChatSend(frame: RequestFrame): Promise<void> {
    let params: ChatSendParams;
    try {
      params = parseChatSendParams(frame.params);
    } catch (error) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest(error));
      return;
    }
    const bcsSessionId = params.bcs_session_id?.trim();
    if (!bcsSessionId) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest('BCN V3 chat.send requires bcs_session_id'));
      return;
    }
    const runId = params.idempotency_key ?? frame.id;
    const existing = this.runs.get(runId);
    if (existing) {
      if (existing.bcsSessionId !== bcsSessionId) {
        this.client.sendResponse(frame.id, false, undefined, invalidRequest('run_id belongs to another bcs_session_id'));
        return;
      }
      this.client.sendResponse(frame.id, true, { run_id: existing.runId });
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts:149-162](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts#L149-L162)

现有序号和有限队列。

<details>
<summary>查看原文（14行）</summary>

```text
  sendEvent(event: string, payload: Record<string, unknown>): void {
    const seq = ++this.eventSequence;
    const frame: EventFrame = { type: 'event', event, payload: { ...payload, seq }, seq };
    if (this.connected) {
      this.sendFrameNow(frame);
      return;
    }
    const bytes = Buffer.byteLength(JSON.stringify(frame), 'utf8');
    if (bytes > MAX_FRAME_BYTES) throw new Error('BCN event exceeds 2 MiB');
    if (this.queuedEvents.length >= 1_000 || this.queuedEventBytes + bytes > 8 * MAX_FRAME_BYTES) {
      throw new Error('BCN reconnect event buffer is full');
    }
    this.queuedEvents.push({ frame, bytes });
    this.queuedEventBytes += bytes;
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:630-650](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L630-L650)

现有终态事件。

<details>
<summary>查看原文（21行）</summary>

```text
    const payload: Record<string, unknown> = {
      runId: run.runId,
      sessionId: run.bcsSessionId,
      ts: Date.now(),
      state,
    };
    if (run.text) payload.content = run.text;
    if (state === 'final') {
      if (run.text) payload.content = run.text;
      if (run.usage.input || run.usage.output) payload.usage = run.usage;
      if (stopReason) payload.stopReason = stopReason;
      if (run.route) payload.routing = routeWire(run.route);
    } else if (state === 'error') {
      payload.errorMessage = 'DeepSeek Harness run failed';
      payload.errorKind = 'dsh_turn';
      payload.errorCode = errorCode ?? 'UNKNOWN';
    } else {
      payload.stopReason = 'aborted';
    }
    this.client.sendEvent('chat', payload);
    run.terminal = true;
```

</details>

**依据 4 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts:238-255](https://github.com/inclusionAI/Avernet/blob/6fb00420cf553fe36cde9f6eca4204a1f4d07200/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/ws-client.ts#L238-L255)

重连后发送缓冲。

<details>
<summary>查看原文（18行）</summary>

```text
      this.connectedState = true;
      this.reconnectDelayMs = this.options.config.reconnectInitialMs;
      this.flushQueuedEvents();
      this.startHeartbeat();
      this.options.log?.info(
        `Connected to BCN with Bot WebSocket protocol v${connected.protocol_version} (bot_uuid=${connected.bot_uuid})`,
      );
    } catch (error) {
      this.connectedState = false;
      const socket = this.socket;
      this.socket = undefined;
      socket?.removeAllListeners();
      socket?.terminate();
      this.rejectPending(new Error('BCN connection attempt failed'));
      if (!this.stopped) {
        this.options.log?.warn(`BCN connection failed; retrying in ${this.reconnectDelayMs}ms`);
        this.scheduleConnect(this.reconnectDelayMs);
        this.reconnectDelayMs = Math.min(this.reconnectDelayMs * 2, this.options.config.reconnectMaxMs);
```

</details>

#### 缺口

- 未核对端确认契约及现有 UI
  **影响**：无法证明增量可实现或有收益
  **进一步探讨**：先核协议，再以故障注入对照。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
