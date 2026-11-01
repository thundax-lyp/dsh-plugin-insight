# @tencent-connect/dsh-qqbot

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a4a01fa](https://github.com/tencent-connect/dsh-qqbot/tree/a4a01fa9f122e187733fbd990c3d6a41e4d7e538)

<!-- BEGIN META -->
[![GitHub ★ 468](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=468&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tencent-connect/dsh-qqbot) [![npm 30d 52,995](https://img.shields.io/static/v1?label=npm+30d&message=52%2C995&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot)
<!-- END META -->

> **功能**：将 QQ 私聊与群聊连接 DSH Agent 会话。

> **亮点**：把 QQ 消息与 DSH Agent 回合、会话和回复连接，减少切换；投递和权限仍依赖宿主及平台。[Q01](#research-q01)

> **主要限制**：默认私聊与群均 open，群白名单按群而非成员，群会话共享；发送失败记日志不等于送达。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · QQ 接入是普通转发还是 Agent 回合？](#detail-section-11)
  - [Q02 · 访问门、会话和回复如何衔接？](#detail-section-12)
  - [Q03 · 哪些身份和投递边界妨碍可靠远程执行？](#detail-section-13)
  - [Q04 · 部署和安全试用需要什么？](#detail-section-14)
  - [Q05 · 如何减少共享会话与未知发送带来的误解？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 用户希望在 QQ 远程发任务及接收结果；基线是 Web/TUI 或手工转发。[Q01](#research-q01)

直接在 DSH Web/TUI 操作或人工转发消息。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 入站 | QQ 消息触发 Agent | 默认 open 须自行配置 |
| 会话 | 按 peer 维护上下文 | 群内共享 |
| 回复 | 发送模型输出 | 日志不证明送达 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH 宿主与模型 | 必需 | Agent 回合 | 无法执行 |
| QQ Bot 凭据和网络 | 必需 | 消息渠道 | 无法连接 |
| 访问控制和工作区授权 | 试用必需 | 限制触发范围 | 不开放 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 配置 | 用测试账号和 allowlist | 核对身份 |
| 发送 | 低风险任务 | 核对 Agent 会话 |
| 回查 | 检查 QQ 回执和副作用 | 未知先对账 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 应用与宿主资源 | 凭据、授权和工作区 | 平台权限未测 |
| 持续 | 模型与网络费用未知 | 审核任务及群身份 | 效率未测 |
| 恢复 | 可能发生副作用 | 核对发送与结果 | 错误日志非送达证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远程回合 | QQ peer 到 Agent followup | 平台运行和身份 |
| 消息回复 | 分块发送并记录失败 | 用户实际收到 |

> **思考**：默认私聊与群均 open，群白名单按群而非成员，群会话共享；发送失败记日志不等于送达。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把 QQ 消息与 DSH Agent 回合、会话和回复连接，减少切换；投递和权限仍依赖宿主及平台。[Q01](#research-q01)

私聊按 sender、群按 group 建会话；默认 open，发送失败仅记录日志。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认私聊与群均 open，群白名单按群而非成员，群会话共享；发送失败记日志不等于送达。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用测试账号、allowlist 与低权限工作区核对身份、审批和回执。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码显示访问默认、peer 会话和发送错误处理；未运行 QQ、DSH 或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/config.ts、src/session/session-manager.ts、src/transport/inbound.ts、src/transport/outbound.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 inventory 165 个指定扩展名文件、排除 1、解析错误 0；静态核查代表入站、会话和发出路径，未运行宿主与 QQ。
- 下一步：隔离账号验证群成员、会话、审批、平台失败及重复任务恢复。

**分析版本**

- **仓库**：[tencent-connect/dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)
- **版本号**：0.5.5（[固定提交 a4a01fa](https://github.com/tencent-connect/dsh-qqbot/tree/a4a01fa9f122e187733fbd990c3d6a41e4d7e538)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：分层显示成员授权、会话与投递状态可减少误授权和误重试；对照现有机制测误报与隐私。[Q05](#research-q05)

隔离账号验证群成员、会话、审批、平台失败及重复任务恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 839 | — | — | 8310 |
| .js | source | 66 | 7249 | 5923 | 1350 | — |
| .ts | source | 68 | 9410 | 6721 | 1792 | — |
| .ts | test | 27 | 4463 | 3654 | 212 | — |

</details>

**活跃度**

[![Issue 未关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 37](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=37&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 21](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=21&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：QQ 消息怎样接入 DSH Agent，会话、身份与投递边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QQ 接入是普通转发还是 Agent 回合？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

面向已有 DSH 用户在 QQ 私聊或群聊远程发起任务、接收结果。入站处理按 QQ peer 创建或取得 Agent，构造 user message 后 followup；回复再经 QQ 渠道发送。相比 Web/TUI 或手工转发减少渠道切换，但远程身份、宿主权限和送达可靠性需要额外管理；收到消息不代表任务成功。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:1-5](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/README.md#L1-L5)

作者定位 QQ 私聊与群聊。

```text
<div align="center">

<img width="120" src="https://img.shields.io/badge/🤖-QQ_Bot-blue?style=for-the-badge" alt="QQ Bot" />

**基于 [deepseek-harness](https://github.com/deepseek-ai/deepseek-harness) (dsh) 的 QQ Bot 插件，将 DeepSeek AI 助手接入 QQ 私聊与群聊。**
```

**依据 2 · 源码核查**：[src/transport/inbound.ts:94-105](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/inbound.ts#L94-L105)

按私聊或群 peer 确定目标。

<details>
<summary>查看原文（12行）</summary>

```text
  const msg = ctx.message as unknown as ProcessedMessage;
  const mwState = ctx.state as MiddlewareState;
  const { bot } = ctx;

  const scope: ChatScope = msg.kind === 'group' ? 'group' : 'c2c';
  const peerId = scope === 'group' ? (msg.groupOpenid ?? msg.senderId) : msg.senderId;

  const replyTarget: ReplyTarget = {
    scope,
    targetId: peerId,
    msgId: msg.messageId,
  };
```

</details>

**依据 3 · 源码核查**：[src/transport/inbound.ts:117-149](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/inbound.ts#L117-L149)

取得会话并向 Agent followup。

<details>
<summary>查看原文（33行）</summary>

```text
    record = await manager.getOrCreate(scope, peerId, msg.senderId, replyTarget);
  } catch (err) {
    logger.error(`ERROR creating session: ${err instanceof Error ? err.message : String(err)}`);
    // 兜底回复：会话创建失败时告知用户，避免静默无响应
    try {
      await bot.sendMarkdown(replyTarget, '⚠️ 处理消息时出现异常，请稍后重试。');
    } catch (sendErr) {
      logger.error(`fallback reply failed: ${sendErr instanceof Error ? sendErr.message : String(sendErr)}`);
    }
    return;
  }

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

**依据 4 · 源码核查**：[src/transport/outbound.ts:284-291](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/outbound.ts#L284-L291)

发送与失败日志。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
```

#### 缺口

- 未运行 DSH、QQ 网关或真实账号
  **影响**：不能证明身份权限、消息投递和执行结果
  **进一步探讨**：固定宿主并用授权测试账号验证身份、会话和失败回执

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 访问门、会话和回复如何衔接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

配置支持 open、allowlist、disabled；固定默认私聊和群聊均为 open，群的 allowlist 是 group OpenID 而不是逐成员授权。SessionManager 的键按 appId、kind、peer 组织：私聊按 sender，群按 group，组内多人的消息会进入同一群会话。发送 Markdown 时分块调用平台，异常记录日志；这表明路径，不证明用户身份与审批权限按个人隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:102-107](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/config.ts#L102-L107)

访问模式及白名单定义。

```text
/** 访问控制子 Schema（独立导出：config 路由的服务端校验复用） */
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式（默认开放）'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单（QQ OpenID）'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式（默认开放：群自带进群门槛 + @bot 触发）'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单（群 OpenID）'),
```

**依据 2 · 源码核查**：[src/config.ts:124-133](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/config.ts#L124-L133)

默认 open。

<details>
<summary>查看原文（10行）</summary>

```text
  processingTimeoutMs: Schema.number().default(30 * 60 * 1000).description('处理超时(ms)，超时中断当前 LLM 调用'),
  askTimeoutMs: Schema.number().default(5 * 60 * 1000).description('待答问题超时(ms)，超时自动拒绝并提示'),
  historyLimit: Schema.number().default(10).description('群历史缓冲条数'),
  access: AccessControlSchema.default({
    c2cMode: 'open',
    c2cAllow: [],
    groupMode: 'open',
    groupAllow: [],
  }).description('访问控制'),
  showToolResults: Schema.boolean().default(false).description('是否展示工具调用成功结果（错误始终展示）'),
```

</details>

**依据 3 · 源码核查**：[src/session/session-manager.ts:1-11](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/session/session-manager.ts#L1-L11)

sessionKey 私聊和群的粒度。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * SessionManager — 管理 QQ peer → dsh Agent 的映射和生命周期
 *
 * sessionKey 格式: `qqbot:${appId}:${kind}:${peerId}`
 *   - c2c:   peerId = senderId (用户 openid)
 *   - group: peerId = groupOpenid
 *
 * sessionKey → sessionId 的映射存于 prefs（`model-prefs.json`），新会话 id 由
 * `mintSessionId()` 铸造（`session-` + UUID，与宿主一致）。0.5.x 的 SHA-256 确定性
 * 派生 id 仅用于探测存量会话并迁移，不再用于新建——确定性 id 跨进程必然相同，
 * 两个进程各自新建会把同一 id 写入不同 project 目录。
```

</details>

**依据 4 · 源码核查**：[src/transport/outbound.ts:284-291](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/outbound.ts#L284-L291)

分块发送异常记录。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
```

#### 缺口

- 未运行 DSH、QQ 网关或真实账号
  **影响**：不能证明身份权限、消息投递和执行结果
  **进一步探讨**：固定宿主并用授权测试账号验证身份、会话和失败回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些身份和投递边界妨碍可靠远程执行？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

群 OpenID 白名单只限制群，不证明该群每个成员获相同本机工具授权；共享群会话亦需考虑上下文暴露。默认 open 更不能假定私聊已限制为所有者。发送失败被捕获并记日志，不能把 Agent 回合完成等同 QQ 收到；应回查平台及任务副作用，避免不明结果盲重试。具体 QQ 网关权限、审批和重试需真实配置验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:102-107](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/config.ts#L102-L107)

群白名单是群 OpenID。

```text
/** 访问控制子 Schema（独立导出：config 路由的服务端校验复用） */
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式（默认开放）'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单（QQ OpenID）'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式（默认开放：群自带进群门槛 + @bot 触发）'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单（群 OpenID）'),
```

**依据 2 · 源码核查**：[src/session/session-manager.ts:1-11](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/session/session-manager.ts#L1-L11)

群按群 peer 共享会话。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * SessionManager — 管理 QQ peer → dsh Agent 的映射和生命周期
 *
 * sessionKey 格式: `qqbot:${appId}:${kind}:${peerId}`
 *   - c2c:   peerId = senderId (用户 openid)
 *   - group: peerId = groupOpenid
 *
 * sessionKey → sessionId 的映射存于 prefs（`model-prefs.json`），新会话 id 由
 * `mintSessionId()` 铸造（`session-` + UUID，与宿主一致）。0.5.x 的 SHA-256 确定性
 * 派生 id 仅用于探测存量会话并迁移，不再用于新建——确定性 id 跨进程必然相同，
 * 两个进程各自新建会把同一 id 写入不同 project 目录。
```

</details>

**依据 3 · 源码核查**：[src/transport/outbound.ts:284-291](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/outbound.ts#L284-L291)

发送失败记录。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
```

#### 缺口

- 未运行 DSH、QQ 网关或真实账号
  **影响**：不能证明身份权限、消息投递和执行结果
  **进一步探讨**：固定宿主并用授权测试账号验证身份、会话和失败回执

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署和安全试用需要什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要 DSH 宿主、QQ Bot 应用凭据、网络和实际可用模型；作者描述扫码保存凭据。先选受控测试账号和明确 allowlist、低权限工作区，核对发送者、群上下文、审批、附件及回执；未授权成员可触发、任务结果或发送状态不清时停止开放通道。平台限制、凭据维护、模型费用及人工对账均是额外成本，本轮未测试。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:29-43](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/README.md#L29-L43)

架构与扫码配置的作者说明。

<details>
<summary>查看原文（15行）</summary>

````text
```
QQ 用户 → QQ WebSocket → dsh-qqbot → ctx.agents → dsh agent loop → LLM
                                 ↑                           │
                                 └── session/event ──────────┘
                                       (assistant reply → QQ sendMarkdown)
```

## 安装

### 方式一：桌面版安装（推荐）

无需命令行，全程在应用内完成：

1. **安装**：左侧栏点击「插件」→「添加插件」→ 输入 `@tencent-connect/dsh-qqbot@latest` → 安装并立即启动

````

</details>

**依据 2 · 源码核查**：[src/config.ts:102-107](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/config.ts#L102-L107)

可配置访问模式。

```text
/** 访问控制子 Schema（独立导出：config 路由的服务端校验复用） */
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式（默认开放）'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单（QQ OpenID）'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式（默认开放：群自带进群门槛 + @bot 触发）'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单（群 OpenID）'),
```

**依据 3 · 源码核查**：[src/transport/outbound.ts:284-291](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/outbound.ts#L284-L291)

发送失败记录。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
```

#### 缺口

- 未运行 DSH、QQ 网关或真实账号
  **影响**：不能证明身份权限、消息投递和执行结果
  **进一步探讨**：固定宿主并用授权测试账号验证身份、会话和失败回执

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何减少共享会话与未知发送带来的误解？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证假设：将群成员身份、授权依据、Agent 会话与消息投递状态分层显示，并在状态未知时要求人工对账，可能降低越权与重复操作。现有 access 模式、群 peer 隔离和发送错误日志是反证，新增 UI 不能代替平台侧身份验证或让发送恰好一次。对照现有流程，用群内不同成员、丢失发送响应及凭据失效样本测误授权、重复、可恢复率和隐私成本；效果不足则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:102-107](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/config.ts#L102-L107)

已有访问模式。

```text
/** 访问控制子 Schema（独立导出：config 路由的服务端校验复用） */
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式（默认开放）'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单（QQ OpenID）'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式（默认开放：群自带进群门槛 + @bot 触发）'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单（群 OpenID）'),
```

**依据 2 · 源码核查**：[src/session/session-manager.ts:1-11](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/session/session-manager.ts#L1-L11)

已有 peer 会话键。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * SessionManager — 管理 QQ peer → dsh Agent 的映射和生命周期
 *
 * sessionKey 格式: `qqbot:${appId}:${kind}:${peerId}`
 *   - c2c:   peerId = senderId (用户 openid)
 *   - group: peerId = groupOpenid
 *
 * sessionKey → sessionId 的映射存于 prefs（`model-prefs.json`），新会话 id 由
 * `mintSessionId()` 铸造（`session-` + UUID，与宿主一致）。0.5.x 的 SHA-256 确定性
 * 派生 id 仅用于探测存量会话并迁移，不再用于新建——确定性 id 跨进程必然相同，
 * 两个进程各自新建会把同一 id 写入不同 project 目录。
```

</details>

**依据 3 · 源码核查**：[src/transport/outbound.ts:284-291](https://github.com/tencent-connect/dsh-qqbot/blob/a4a01fa9f122e187733fbd990c3d6a41e4d7e538/src/transport/outbound.ts#L284-L291)

已有发送错误日志。

```text
  private async send(record: SessionRecord, text: string, tag: string): Promise<void> {
    const chunks = chunkMarkdownText(text, this.config.textChunkLimit);
    for (const chunk of chunks) {
      try {
        await this.bot.sendMarkdown(record.replyTarget, chunk);
      } catch (err) {
        this.logger.error(`im-qqbot: ${tag} failed: ${err instanceof Error ? err.message : String(err)}`);
      }
```

#### 缺口

- 未运行 DSH、QQ 网关或真实账号
  **影响**：不能证明身份权限、消息投递和执行结果
  **进一步探讨**：固定宿主并用授权测试账号验证身份、会话和失败回执

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
