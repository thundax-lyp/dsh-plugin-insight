# Avernet BCN channel

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1b2d3a7](https://github.com/inclusionAI/Avernet/tree/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn)

<!-- BEGIN META -->
[![GitHub ★ 593](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=593&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/inclusionAI/Avernet) [![npm 30d 1,463](https://img.shields.io/static/v1?label=npm+30d&message=1%2C463&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@avernet-plugin/deepseek-harness-channel-bcn)
<!-- END META -->

> **功能**：将 DSH Bot 接入 Avernet BCN，映射消息、会话、工具事件和审批交互

> **亮点**：[Q01](#research-q01)将canonical会话、runId和DSH Agent关联；[Q02](#research-q02)先持久pending注册身份避免重试静默建新Bot，是明确恢复设计增量。

> **主要限制**：[Q02](#research-q02)成功注册响应丢失不自动重放凭据，运行去重也仅内存；[Q03](#research-q03)本地scope解析与descriptor配置不能证明服务器授权或按技能发现。

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
  - [Q01 · 插件如何把BCN消息映射到DSH会话，相比手工传话多什么？](#detail-section-11)
  - [Q02 · 注册结果丢失、重试和取消有哪些不会自动恢复的状态？](#detail-section-12)
  - [Q03 · 使用依赖与成本由谁承担，适合什么采用？](#detail-section-13)
  - [Q04 · 能否增加持久任务收据使跨worker恢复可对账？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有BCN的团队可用DSH作为协作节点，由canonical会话承接远端任务。

人工转发任务或自写WebSocket桥；协作网络、宿主执行与模型能力分别归BCN和DSH。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话桥 | 接入BCN任务与返回事件 | 依赖可信服务器权限 |
| pending注册 | 保留重试身份 | 成功丢响应仍可能需人工恢复 |
| run取消 | 中止精确运行 | 不回滚外部工具副作用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH匹配版本/Node22.19+ | 必需 | Agent与Credentials接线 | 不按包存在认定兼容 |
| BCN V3与可信服务器 | 必需 | canonical会话和网络分工 | 服务器认证不能由本地字段代替 |
| static_bearer注册令牌 | 首次Provider注册需 | 建Bot与membership | 不支持模式应停止，勿反复换身份 |
| 运营恢复能力 | 异常时需 | 找回已注册无凭据状态 | 409先查原身份 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 注册 | 运维持久pending后请求并保存Bot Session | 返回身份匹配，失败保留原ref |
| 连接 | 插件复用Session启动WS | 不重复注册，确认V3 |
| 执行 | bridge将canonical会话消息交DSH | 回答和取消对应同run |
| 恢复 | 运维查询已有Bot和任务 | 丢凭据或未知结果不盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | BCN服务与模型，金额未知 | 注册、权限和凭据配置 | 未运行部署 |
| 持续使用 | 多Bot调用、网络与存储 | 会话路由与权限维护 | 无吞吐或token对照 |
| 失败恢复 | 可能重跑任务 | Bot恢复、任务结果核对 | 注册成功响应丢失不可自动重放凭据 |
| 退出 | 已有服务器Bot记录 | 停bridge/client并人工回收身份 | 取消不回滚副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话映射 | canonical ID到DSH哈希会话 | 服务端跨租户授权 |
| 注册恢复 | pending绑定避免换身份 | 丢凭据自动恢复 |
| 任务取消 | 精确run/会话且先终态 | 跨进程去重和副作用回滚 |

> **思考**：[Q02](#research-q02)成功注册响应丢失不自动重放凭据，运行去重也仅内存；[Q03](#research-q03)本地scope解析与descriptor配置不能证明服务器授权或按技能发现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)将canonical会话、runId和DSH Agent关联；[Q02](#research-q02)先持久pending注册身份避免重试静默建新Bot，是明确恢复设计增量。

[Q02](#research-q02)注册pending先持久化与取消先标终态可借鉴；内存run去重和服务器凭据不重放使自动恢复存在硬边界。[Q03](#research-q03)不将scope解析视为签名认证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)成功注册响应丢失不自动重放凭据，运行去重也仅内存；[Q03](#research-q03)本地scope解析与descriptor配置不能证明服务器授权或按技能发现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 有BCN运维能力者先观察，注册409与任务身份不符即停止重试，按既有身份人工对账。

最小验证用两个会话、同run重发、确认后断线和执行后崩溃，对照当前桥与持久收据，记录重复执行、错会话及恢复人工时间。若服务器本来已有等价收据，应复用而非创建第二真相源；没有可核对执行结果就保留unknown，不以重试掩盖。假设尚无真实用户痛点与运行证明。 见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

适配入口、pending注册和run取消有源码依据；服务器授权、完整任务交付和跨进程恢复未验收。持久任务收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/package.json、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/registration.ts、apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/session-identity.ts 及固定范围 inventory；组件：apps/bcs/crates/plugins/deepseek-harness-channel-bcn。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定1b2d3a79d192ea7316beca9da602d5411a2659f1，限定apps/bcs/crates/plugins/deepseek-harness-channel-bcn，检查注册、身份、bridge与入口；不声称审查整个Avernet服务器和权限。
- 下一步：仅固定源码；未注册Bot、连接BCN、执行任务或运行其测试。跨实例和权限隔离未验收。

**分析版本**

- **仓库**：[inclusionAI/Avernet](https://github.com/inclusionAI/Avernet)
- **版本号**：0.2.4（[固定提交 1b2d3a7](https://github.com/inclusionAI/Avernet/tree/1b2d3a79d192ea7316beca9da602d5411a2659f1)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以把注册pending身份的先写后请求思想推广为任务收据，但保持注册身份和业务执行状态独立。按runId记录任务输入摘要、canonical session、尝试和终态证据，重启先查询原收据再决定是否发送。相对内存Map，增量是解释“已排队/已执行/结果未知”，不能仅有终态字符串就认定报告合格。

最小验证用两个会话、同run重发、确认后断线和执行后崩溃，对照当前桥与持久收据，记录重复执行、错会话及恢复人工时间。若服务器本来已有等价收据，应复用而非创建第二真相源；没有可核对执行结果就保留unknown，不以重试掩盖。假设尚无真实用户痛点与运行证明。 见 [Q04](#research-q04)。

仅固定源码；未注册Bot、连接BCN、执行任务或运行其测试。跨实例和权限隔离未验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 355 | — | — | 2400 |
| .ts | source | 14 | 2902 | 2659 | 41 | — |
| .ts | test | 10 | 1909 | 1777 | 33 | — |

</details>

**活跃度**

[![Issue 未关闭 98](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=98&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=27&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/inclusionAI/Avernet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Bot接入BCN后注册恢复与会话运行边界是否足以支持可对账协作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件如何把BCN消息映射到DSH会话，相比手工传话多什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用于已经运营BCN Bot协作网络、希望DSH作为其中工作节点的开发者。基线是人工转发任务与回答，或手写WebSocket桥。插件载入Bot凭据后启动client与bridge，chat.send要求canonical bcs_session_id，以其生成固定DSH Session ID，再将消息送入该Agent.followup。相同session_key下不同canonical会话因此不必混到同一对话；路径身份采用SHA-256而非把外部原文直接变成目录名。

runId取idempotency_key或frame.id，内存Map发现同run则回已有ID并检查会话。贡献是协议适配和会话/运行生命周期接线，不是新的推理模型；Bot协作和服务器任务分配来自BCN，DSH持久化与执行来自宿主。接受chat.send只是排入运行，不证明工作交付通过验收。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts:29-48](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/index.ts#L29-L48)

实际启动bridge和client并按生命周期关闭。

<details>
<summary>查看原文（20行）</summary>

```text
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

  return async () => {
    try {
      await bridge?.dispose();
    } finally {
      await client.stop();
    }
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:312-363](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L312-L363)

会话必填、run去重、session映射到followup。

<details>
<summary>查看原文（52行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/session-identity.ts:16-40](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/session-identity.ts#L16-L40)

canonical身份与哈希会话ID。

<details>
<summary>查看原文（25行）</summary>

```text
 * historical `session_key` mapping.
 */
export function resolveBcnSessionIdentity(input: BcnSessionIdentityInput): string {
  const canonicalSessionId = input.bcsSessionId?.trim();
  if (canonicalSessionId) return canonicalSessionId;

  const wireGroupId = input.groupId.trim();
  const separator = wireGroupId.indexOf(':');
  if (separator > 0 && separator < wireGroupId.length - 1) return wireGroupId;

  const legacySessionKey = input.sessionKey.trim();
  if (!legacySessionKey) throw new Error('BCN session identity requires a non-empty session_key');
  return legacySessionKey;
}

/**
 * Convert the resolved BCN identity to a fixed-size DSH Session ID.
 * Keeping this translation isolated lets a later canonical V3-only adapter
 * change the wire selection without touching DSH persistence.
 */
export function dshSessionIdForV2(sessionIdentity: string): SessionId {
  // COSEC: hash the server-delivered identity before it reaches DSH's
  // filesystem-backed Session ID boundary; raw protocol text never becomes a path segment.
  const digest = createHash('sha256').update(sessionIdentity, 'utf8').digest('hex');
  return SessionId(`bcn-v2-${digest}`);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 注册结果丢失、重试和取消有哪些不会自动恢复的状态？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

首次Provider注册先保存非秘密pending身份，后发HTTP，收到凭据后保存Bot Session；重启有Session则直接复用，endpoint改变拒绝。pending绑定provider/owner/name/endpoint，重试不偷偷生成另一Bot。这个顺序避免重复登记，但如果服务器成功而响应丢失或本地保存失败，客户端仍可能没有Bot凭据；README明确服务器重复ref返回409且不重放凭据，需要运营者恢复。不能把保存pending当作自动补偿成功。

运行去重是进程内runs Map，不能由canonical session持久化推出跨进程恰好一次。abort先标终态再处理Agent，尚未送达时可避免后续开始；已运行则取消或移除收件箱，但不会回滚工具副作用。注册恢复和任务恢复各有状态边界，连接重连不自动解决业务结果未知。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts:20-30](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts#L20-L30)

已保存会话复用并绑定endpoint。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts:47-85](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts#L47-L85)

pending身份先保存，注册后再保存Session。

<details>
<summary>查看原文（39行）</summary>

```text
  const scope = registrationTokenScope(onboardingToken.value);
  const pendingRef = credentialRef(`${config.botSessionRef}_REGISTRATION`);
  const pending = await ctx.credentials.resolve(pendingRef);
  if (pending && !scope) {
    throw new Error('Pending BCN Provider registration cannot be replaced by legacy onboarding; use the original Provider token or a separate DSH profile');
  }
  let providerBotRef: string | undefined;
  if (scope) {
    // Persist before HTTP: a lost response or failed Session write must not create another Bot.
    if (pending) {
      let record: Record<string, unknown> | undefined;
      try { record = asRecord(JSON.parse(pending.value)); } catch { /* Report without credential contents. */ }
      providerBotRef = asNonEmptyString(record?.providerBotRef);
      if (!providerBotRef || record?.endpoint !== endpoint.baseUrl.toString()
        || record.providerId !== scope.providerId || record.owner !== scope.owner
        || record.botName !== config.botName) {
        throw new Error('Pending BCN Provider registration differs from this endpoint, owner, Provider or Bot name; use a separate DSH profile');
      }
    } else {
      providerBotRef = `dsh-${randomUUID()}`;
      await ctx.credentials.set(pendingRef, JSON.stringify({
        ...scope, endpoint: endpoint.baseUrl.toString(), botName: config.botName, providerBotRef,
      }));
    }
  }
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

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md:55-61](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md#L55-L61)

作者明确丢成功响应或保存失败需运营恢复。

```text
Before the request, the plugin saves a non-secret pending identity in the managed
`${botSessionRef}_REGISTRATION` credential. Retries retain the same reference;
changing the endpoint, Provider, owner or Bot name while registration is pending
requires a separate profile. A lost successful response or failed Session save
can leave a registered Bot without local credentials: the server returns 409 for
duplicate references and never replays credentials. The plugin stops rather than
silently creating another Bot; an operator must recover that registration.
```

**依据 4 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:403-429](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L403-L429)

按会话/run检查并先标终态再取消。

<details>
<summary>查看原文（27行）</summary>

```text
    const params = asRecord(frame.params);
    const sessionId = asNonEmptyString(params?.session_key);
    const runId = asNonEmptyString(params?.run_id);
    if (!sessionId || !runId) {
      this.client.sendResponse(frame.id, false, undefined, invalidRequest('chat.abort requires session_key and run_id'));
      return;
    }
    const run = this.runs.get(runId);
    if (!run || run.bcsSessionId !== sessionId) {
      this.client.sendResponse(frame.id, false, undefined, {
        code: run ? 'SCOPE_MISMATCH' : 'RUN_NOT_FOUND',
        message: run ? 'run_id does not belong to session_key' : 'Unknown run_id',
        retryable: false,
      });
      return;
    }
    if (run.terminal) {
      this.client.sendResponse(frame.id, true, { aborted: false, aborted_run_ids: [] });
      return;
    }
    // Mark terminal before awaiting anything, including agent creation.
    // An acknowledged but not yet delivered run must never start afterwards.
    this.sendTerminal(run, 'aborted');
    const agent = this.ctx.agents.get(run.sessionId);
    if (run.turn !== undefined) agent?.cancel({ kind: 'user' }, { keepInbox: true });
    else if (run.messageId) agent?.inbox.remove(run.messageId);
    this.client.sendResponse(frame.id, true, { aborted: true, aborted_run_ids: [runId] });
```

</details>

#### 缺口

- 服务器409恢复操作及跨重启任务去重是否另有持久机制未核对。
  **影响**：不能保证自动恢复丢凭据或任务恰好一次。
  **进一步探讨**：模拟注册响应丢失与Agent已执行后进程退出，分别核对服务端Bot、Session和任务收据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 使用依赖与成本由谁承担，适合什么采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要匹配DSH、BCN V3、节点网络、Credentials服务及有效注册令牌。registrationTokenScope只解析提示并检查scope/auth_mode，函数明确签名认证由BCS服务器负责；本地知道owner字符串不等于已授权。Provider仅static_bearer模式。客户端把配置descriptor与服务器真实发现区分，README明确summary/domains/skills/scopes当前不自动同步，因此不能凭本地skills配置承诺按技能发现并分派任务。

建议观察，适合已有BCN运维和恢复权限的团队评估桥接，不适合只想安装即获多worker平台的人。首次注册、凭据保全、服务器运维、模型调用和异常人工恢复都需承担；金额、并发吞吐、任务验收成本未知。服务器权限边界和完整调度链未审，不能声称多租户隔离。出现注册409无本地凭据、任务归错会话或未知结果时停止自动重试，由运营者查已有身份和任务。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md:29-39](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md#L29-L39)

明确宿主、协议和Node前提。

<details>
<summary>查看原文（11行）</summary>

```text
## Compatibility

- DeepSeek Harness declared compatibility: `>=0.2.0-rc.2 <=0.2.1-rc.2`
- DeepSeek Harness development/test baseline: `@deepseek-ai/dsh 0.2.1-rc.2`
- BCN Bot WebSocket protocol: V3
- Node.js: `>=22.19.0`

This release requires BCN V3. Every `chat.send` and `chat.inject` must carry the canonical
`bcs_session_id`; uplink events use the shared Run Event envelope with
`runId`, `sessionId`, `seq`, and `ts`. The adapter still keeps the historical
session-key mapping helper for persisted sessions created by older releases.
```

</details>

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/registration.ts:8-32](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/registration.ts#L8-L32)

本地仅检查scope路由提示，认证签名交服务器。

<details>
<summary>查看原文（25行）</summary>

```text
/** Inspect routing hints only. BCS authenticates the signature and authorizes registration. */
export function registrationTokenScope(token: string): ProviderTokenScope | undefined {
  let payload: Record<string, unknown> | undefined;
  try {
    if (!/^[A-Za-z0-9_-]+$/.test(token) || token.length > 16_384) throw new Error();
    const bytes = Buffer.from(token, 'base64url');
    if (bytes.length <= 32 || bytes.toString('base64url') !== token) throw new Error();
    payload = asRecord(JSON.parse(bytes.subarray(0, -32).toString('utf8')));
  } catch {
    throw new Error('BCN onboarding token has an invalid format');
  }
  if (!payload || typeof payload.id !== 'string' || !/^human_.+/.test(payload.id)
    || typeof payload.exp !== 'number' || !Number.isSafeInteger(payload.exp) || payload.exp <= Date.now() / 1_000) {
    throw new Error('BCN onboarding token is expired or incomplete');
  }
  if (payload.v === 1) return undefined;
  const providerId = asNonEmptyString(payload.provider_id);
  if (payload.v !== 2 || payload.purpose !== 'provider_bot_registration' || !providerId || providerId !== payload.provider_id
    || !Array.isArray(payload.allowed_modes) || !payload.allowed_modes.includes('plugin')) {
    throw new Error('BCN onboarding token does not authorize Provider plugin registration');
  }
  if (payload.auth_mode !== 'static_bearer') {
    throw new Error('DSH Provider registration requires static_bearer authentication');
  }
  return { providerId, owner: payload.id };
```

</details>

**依据 3 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md:68-73](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/README.md#L68-L73)

descriptor未同步，注册成功不证明descriptor持久。

```text
Current registration only publishes the Bot name and ownership. The configured
`summary`, `domains`, `skills`, and `scopes` are not synchronized by this plugin;
do not rely on these settings for skill-based discovery. Descriptor synchronization
and propagation of server-side onboarding persistence failures require a separate
registration contract update. A successful `/register` response currently cannot
prove that the server persisted its optional descriptor.
```

#### 缺口

- BCS服务器认证授权、描述符发现和端到端任务路由未全面核查。
  **影响**：无法将本地桥接判断扩展到多用户权限与按技能分配。
  **进一步探讨**：固定一个BCN部署和两会话，检查服务器授权后才做任务与恢复对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否增加持久任务收据使跨worker恢复可对账？

**研究主题**：新假设与验证

#### 完整回答

可以把注册pending身份的先写后请求思想推广为任务收据，但保持注册身份和业务执行状态独立。按runId记录任务输入摘要、canonical session、尝试和终态证据，重启先查询原收据再决定是否发送。相对内存Map，增量是解释“已排队/已执行/结果未知”，不能仅有终态字符串就认定报告合格。

最小验证用两个会话、同run重发、确认后断线和执行后崩溃，对照当前桥与持久收据，记录重复执行、错会话及恢复人工时间。若服务器本来已有等价收据，应复用而非创建第二真相源；没有可核对执行结果就保留unknown，不以重试掩盖。假设尚无真实用户痛点与运行证明。

#### 证据与依据

**依据 1 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts:55-85](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/credentials.ts#L55-L85)

持久pending的具体先例。

<details>
<summary>查看原文（31行）</summary>

```text
    // Persist before HTTP: a lost response or failed Session write must not create another Bot.
    if (pending) {
      let record: Record<string, unknown> | undefined;
      try { record = asRecord(JSON.parse(pending.value)); } catch { /* Report without credential contents. */ }
      providerBotRef = asNonEmptyString(record?.providerBotRef);
      if (!providerBotRef || record?.endpoint !== endpoint.baseUrl.toString()
        || record.providerId !== scope.providerId || record.owner !== scope.owner
        || record.botName !== config.botName) {
        throw new Error('Pending BCN Provider registration differs from this endpoint, owner, Provider or Bot name; use a separate DSH profile');
      }
    } else {
      providerBotRef = `dsh-${randomUUID()}`;
      await ctx.credentials.set(pendingRef, JSON.stringify({
        ...scope, endpoint: endpoint.baseUrl.toString(), botName: config.botName, providerBotRef,
      }));
    }
  }
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

**依据 2 · 源码核查**：[apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts:317-352](https://github.com/inclusionAI/Avernet/blob/1b2d3a79d192ea7316beca9da602d5411a2659f1/apps/bcs/crates/plugins/deepseek-harness-channel-bcn/src/bridge.ts#L317-L352)

当前运行去重是内存Map并在执行前返回runId。

<details>
<summary>查看原文（36行）</summary>

```text
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
```

</details>

#### 缺口

- 服务器当前任务收据的契约与持久化覆盖。
  **影响**：新状态可能与上游冲突而不是改进恢复。
  **进一步探讨**：先核服务器真相源，已有等价能力就只做查询适配。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
