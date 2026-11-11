# 腾讯 QQ Bot

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0ddf232](https://github.com/tencent-connect/dsh-qqbot/tree/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7)

<!-- BEGIN META -->
[![GitHub ★ 570](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=570&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/tencent-connect/dsh-qqbot) [![npm 30d 88,583](https://img.shields.io/static/v1?label=npm+30d&message=88%2C583&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tencent-connect/dsh-qqbot)
<!-- END META -->

> **功能**：把 DeepSeek Harness 助手接入 QQ 私聊和群聊，支持消息、回复与交付文件。

> **亮点**：在 QQ 对话内复用 DSH 的会话、工具和交付链路，消息 ID 将用户来源与回复方式关联，可减少手工往返。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：群接入与提及是不同门控，未提及的群内容也可先入历史。已冻结的出站缓冲不会因晚到的 QQ 输入改目标，需要分别核验授权与路由。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 与手工转述或独立机器人相比，多做成什么？](#detail-section-11)
  - [Q02 · 怎样识别应答与主动出站，混合输入会怎样？](#detail-section-12)
  - [Q03 · 私聊、群和命令控制在哪生效？](#detail-section-13)
  - [Q04 · 怎样控制使用成本并验证出站语义？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队已在 QQ 讨论或请求帮助，希望让 DSH 在原会话回应并提供交付物。

手工转发可以逐条控制内容，独立 QQ bot 可以直接走模型；接线与会话状态需要另维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| QQ 会话桥 | 在私聊或群里取得 DSH 应答 | 需绑定凭据并通过接入策略 |
| 授权和配对 | 控制私聊、群与命令 | 默认策略应按实际 profile 核对 |
| 轮次出站 | 发送文本和交付文件 | 受回复窗口、目标缓冲和平台限制 |

**流程与依赖**

| 依赖 | 作用 | 边界 |
| --- | --- | --- |
| QQ 凭据与 SDK | 建立 QQ WebSocket | 测试号隔离，绑定和权限需实测 |
| DSH agent 与 profile | 选择会话并运行模型 | 模型和工具应独立收敛权限 |
| Web 设置或绑定入口 | 凭据配置、名单 | 配置和持久化失败需独立处理 |

| 阶段 | 操作 | 异常处理 |
| --- | --- | --- |
| 首次 | 在测试 profile 设置私聊白名单，群和命令先禁用 | 扫码失败核对凭据存储，禁止将凭据写进诊断材料 |
| 持续 | 比对输入来源、群历史和回复目标 | 出站异常或非预期群数据触发即停 |
| 退出 | 断开测试连接、停用插件并检查重启后状态 | 分别核对环境和 profile 凭据、会话存储及授权撤销 |

**效果与成本**

| 成本 | 单位 | 未知 |
| --- | --- | --- |
| 模型与工具 | 每个合格应答的模型轮次与工具调用 | 实测费用未知 |
| 运维 | 绑定、权限检查、重连与失败排查时间 | 跨宿主差异待测 |
| 退出 | 停用并核对会话和凭据 | 时间及恢复结果未知 |

| 效果 | 判据 | 边界 |
| --- | --- | --- |
| 减少转述 | 一次合格任务的手工转发与补充次数 | 尚无实测 |
| 在原对话交付 | 回复和文件都到正确对话 | 回复窗口、并发和群上下文待验证 |

> **思考**：群接入与提及是不同门控，未提及的群内容也可先入历史。已冻结的出站缓冲不会因晚到的 QQ 输入改目标，需要分别核验授权与路由。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在 QQ 对话内复用 DSH 的会话、工具和交付链路，消息 ID 将用户来源与回复方式关联，可减少手工往返。[Q01](#research-q01) [Q02](#research-q02)

入站登记消息 ID、出站按回合分类，能在统一宿主事件中复用交付逻辑。已有缓冲目标冻结和失败轮继续投递文件需在客户端区分。

<a id="detail-section-5"></a>

### 1.4 主要限制

群接入与提及是不同门控，未提及的群内容也可先入历史。已冻结的出站缓冲不会因晚到的 QQ 输入改目标，需要分别核验授权与路由。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

保留观察。后续只在隔离测试账号验证白名单拒绝、仅测试私聊的完整应答、断连与卸载。出现未经同意的历史转发或错误路由时停用，改为人工转述。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 QQ 接入、回合跟踪与群历史边界；真实平台连通、交付、授权及成本尚未验证。

- 已检查：作者 README、包清单、源码路径 src/transport/inbound.ts、src/transport/outbound.ts、src/transport/turn-origin.ts、src/transport/turn-tracker.ts、src/gateway/middleware-setup.ts、src/gateway/bootstrap.ts、src/runtime/account-service.ts、src/config.ts、package.json、cordis.patch.yml、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本的网关、入站、出站、配对及配置定向核查。未安装、运行 QQ、目标测试或 DSH 宿主。
- 下一步：在测试账号分开检查未授权接入、命令、非 @ 群历史、交错输入、文件发送与主动降级，并记录拒绝、错误目标、重复和总用量。

**分析版本**

- **仓库**：[tencent-connect/dsh-qqbot](https://github.com/tencent-connect/dsh-qqbot)
- **版本号**：0.5.5（[固定提交 0ddf232](https://github.com/tencent-connect/dsh-qqbot/tree/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可以给待发缓冲绑定因果输入并在首段前重新确认目标，检查交错输入的误投率和首段等待；若无误投改善却增加等待，就保留现机制。[Q04](#research-q04)

在测试账号分开检查未授权接入、命令、非 @ 群历史、交错输入、文件发送与主动降级，并记录拒绝、错误目标、重复和总用量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 915 | — | — | 9837 |
| .js | source | 86 | 9743 | 8173 | 1601 | — |
| .ts | test | 46 | 7140 | 6050 | 241 | — |
| .ts | source | 97 | 11800 | 8636 | 2092 | — |

</details>

**活跃度**

[![Issue 未关闭 27](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=27&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 40](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=40&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 20](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=20&color=737b86&logo=github)](https://github.com/tencent-connect/dsh-qqbot/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：QQ 接入怎样复用 DSH 会话，以及授权、上下文与出站选择怎样影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 与手工转述或独立机器人相比，多做成什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

对已在 QQ 私聊或群里工作的 DSH 用户，合格结果是在原 QQ 对话收到与相应 DSH 会话一致的回复及需要交付的文件。手工在 QQ 与 DSH 间复制可精确选择哪些内容外发，但每条需人做。独立机器人可以直接调用模型，却要另做会话和工具接线。插件在已过中间件的消息上按私聊发送者或群 OpenID 选择会话，构造宿主 user 消息并交给 agent，再用宿主事件送回。群级会话意味着多个成员可共享群上下文，使用人不应把它理解为每个成员分别隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-34](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/README.md#L27-L34)

作者描绘 QQ WebSocket 与 DSH 事件的双向链路。

````text
## 架构

```
QQ 用户 → QQ WebSocket → dsh-qqbot → ctx.agents → dsh agent loop → LLM
                                 ↑                           │
                                 └── session/event ──────────┘
                                       (assistant reply → QQ sendMarkdown)
```
````

**依据 2 · 源码核查**：[src/gateway/bootstrap.ts:76-105](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/bootstrap.ts#L76-L105)

网关注册中间件和入站接线，并通过回复限制器处理出站。

<details>
<summary>查看原文（30行）</summary>

```text
  // ── 中间件链 ──
  setupMiddlewares(bot, config, manager, logger);

  // ── 入站：经过中间件链后的消息交给 dsh agent ──
  bot.on('message', async (mCtx: MiddlewareContext) => {
    const msg = mCtx.message;
    // 记录最近 msgId，供无上下文的出站发送（文件发送显式 target、主动推送等）获取被动回复目标
    cacheMsgId(mCtx.replyTarget.scope, mCtx.replyTarget.targetId, mCtx.replyTarget.msgId);
    if (config.debug) {
      logger.debug(`← message (post-middleware): ${JSON.stringify(msg, null, 2).slice(0, 500)}`);
    }
    await handleInbound(mCtx, manager, config, logger, qqInputs);
  });

  // ── 出站：dsh session/event → QQ 消息 ──
  // 获取 tools 服务（工具结果结构化展示），可选
  let toolsRegistry: ToolsRegistryLike | undefined;
  try {
    toolsRegistry = ctx.get('tools') as ToolsRegistryLike | undefined;
  } catch {
    toolsRegistry = undefined;
  }

  // 发送适配器：将 QQBot 实例适配为 QQBotSender（openStream 参数形态不同）。
  // sendMarkdown 统一做被动回复限额管控：同一 msgId 超限/过期时降级主动推送。
  const replyLimiter = new ReplyLimiter({ limit: 4 });
  const sender: QQBotSender = {
    sendMarkdown: (target, content, opts) => sendResolvedMarkdown(bot, resolveReplyTarget(target, replyLimiter, true), content, opts),
    openStream: (target) => bot.openStream({
      target: {
```

</details>

**依据 3 · 源码核查**：[src/transport/inbound.ts:100-142](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/inbound.ts#L100-L142)

根据 scope 与 peer 选择会话，登记用户消息后送给 agent。

<details>
<summary>查看原文（43行）</summary>

```text
  const scope: ChatScope = msg.kind === 'group' ? 'group' : 'c2c';
  const peerId = scope === 'group' ? (msg.groupOpenid ?? msg.senderId) : msg.senderId;

  const replyTarget: ReplyTarget = {
    scope,
    targetId: peerId,
    msgId: msg.messageId,
  };

  // ── 组装 agentBody（下载结果经 mwState.downloadedFiles 提供） ──
  const agentBody = assembleAgentBody(msg, mwState, scope, logger);

  if (!agentBody) return;

  logger.info(`Processing: scope=${scope} peerId=${peerId} body="${agentBody.slice(0, 200)}"`);

  // ── 获取或创建会话 ──
  let record;
  try {
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

  // 按宿主保证跨边界不变的 Message.id 登记 QQ 入站，出站据此认领回合归属
  //（不在 source 上写非契约字段，也不在 SessionRecord 上抢标记）。
  inputs.register(String(message.id));
  record.agent.followup(message);
```

</details>

**依据 4 · 源码核查**：[src/transport/outbound.ts:285-313](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/outbound.ts#L285-L313)

结束时等待文本并投递交付文件。

<details>
<summary>查看原文（29行）</summary>

```text
  private finishTurn(sessionId: string, event: TurnEndEvent, plan: DeliveryPlan | undefined): void {
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
      if (plan !== undefined && failure !== undefined && !SILENT_TURN_ERROR_CODES.has(failure.code)) {
        await this.send(plan.target, `⚠️ 本轮异常结束\n\`${failure.code}\`: ${failure.message}`, 'sendTurnEndError');
      }
      if (files.length > 0 && this.deliverer !== undefined && plan !== undefined) {
        await this.deliverer.deliver(plan.target, files);
      }
```

</details>

#### 缺口

- 未与独立机器人的维护开销或交付正确率实测对照
  **影响**：只能确定复用方式，不能量化收益
  **进一步探讨**：对同一组私聊和群聊任务记录搬运次数、正确会话和可用交付物

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样识别应答与主动出站，混合输入会怎样？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入站登记 Message.id，回合跟踪器用它把 QQ user 与其他宿主界面的 user 区分。内部通知不覆盖读者归属，QQ 归属可压过外部输入；外部和内部触发可选主动推送，QQ 路径优先走被动回复。网关在同一 msgId 超限或过期时有主动降级路径。归属按事件变化，但实现说明已创建的出站缓冲会保留原目标，故同一回合晚到的 QQ 输入可能无法改变已经准备的主动投递。结束时等待文本再送文件，并在失败时也可发送已完成交付；这不是事务提交或用户收件确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/transport/inbound.ts:131-142](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/inbound.ts#L131-L142)

用宿主消息 ID 登记 QQ 入站。

<details>
<summary>查看原文（12行）</summary>

```text
  // ── 构建 UserMessage → followup ──
  const content: ContentBlock[] = [{ type: 'text' as const, text: agentBody }];

  const message = createUserMessage({
    content,
    source: { kind: 'user' as const },
  });

  // 按宿主保证跨边界不变的 Message.id 登记 QQ 入站，出站据此认领回合归属
  //（不在 source 上写非契约字段，也不在 SessionRecord 上抢标记）。
  inputs.register(String(message.id));
  record.agent.followup(message);
```

</details>

**依据 2 · 源码核查**：[src/transport/turn-origin.ts:2-10](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/turn-origin.ts#L2-L10)

实现注释明确混合输入时目标缓冲冻结的已知边界。

```text
 * 回合来源。对齐 dsh-im 的 turn 归属：一条 user/message 只说明它自己。
 *
 * - qq：本插件入站的 user 消息。回复沿用被动窗口。
 * - external：读者在别的界面输入。kind 仍是 user，但消息 id 不是本插件登记的。
 * - internal：宿主自己发起的一条消息，例如 schedule、已回答的提问、notice，
 *   或每轮注入的上下文。它不锁定回合。整轮都没有读者输入时，才按服务回合主动推到 QQ。
 *
 * 已知边界：一个 external 回合中途插入 QQ 入站时会改判为被动，但本回合已创建的
 * 出站缓冲仍按创建时的主动目标发送（目标在缓冲创建时拍下，回合内不改）。
```

**依据 3 · 源码核查**：[src/transport/turn-origin.ts:35-67](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/turn-origin.ts#L35-L67)

按来源和登记 ID 分类，QQ 优先且决定被动送达。

<details>
<summary>查看原文（33行）</summary>

```text
/**
 * 按这一条消息自己的 source 归类。
 * `qqOwned` 只在这条消息的 id 是本插件入站登记过的时候为真。
 */
export function classifyTurnInput(source: TurnInputSource | undefined, qqOwned: boolean): MessageOrigin {
  if (source?.form === 'notice') return 'internal';
  if (source?.kind !== undefined && INTERNAL_KINDS.has(source.kind)) return 'internal';
  if (source?.kind !== 'user') return 'internal';
  return qqOwned ? 'qq' : 'external';
}

/** 把一条消息记进当前回合。internal 不抢归属；qq 可以改判已经记成 external 的回合。 */
export function noteTurnInput(state: TurnDeliveryState, origin: MessageOrigin): void {
  if (origin === 'qq') {
    state.origin = 'qq';
    return;
  }
  if (origin === 'external') {
    if (state.origin !== 'qq') state.origin = 'external';
    return;
  }
  state.sawInternal = true;
}

/**
 * 本回合怎么发到 QQ。
 * 尚无任何输入时保持被动：这是 QQ 入站回合在第一条 user/message 之前的既有路径。
 */
export function deliveryMode(state: TurnDeliveryState): DeliveryMode {
  if (state.origin === 'qq') return 'passive';
  if (state.origin === 'external') return 'proactive';
  if (state.sawInternal) return 'proactive';
  return 'passive';
```

</details>

**依据 4 · 源码核查**：[src/transport/turn-tracker.ts:130-151](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/turn-tracker.ts#L130-L151)

目标计划按归属与策略选择被动或主动。

<details>
<summary>查看原文（22行）</summary>

```text

  /**
   * 本回合怎么发。
   * - 不是 QQ 会话 → undefined；
   * - 无回合状态或被动回合 → 沿用会话的 replyTarget（含 msgId）；
   * - 主动回合 → 只保留地址并打 forceProactive；external 回合按策略可能不投递。
   */
  public planFor(sessionId: string): DeliveryPlan | undefined {
    const base = this.addressOf(sessionId);
    if (base === undefined) return undefined;
    const tracked = this.turns.get(sessionId);
    if (tracked === undefined || deliveryMode(tracked.state) === 'passive') {
      return { target: base, proactive: false };
    }
    if (tracked.state.origin === 'external' && !this.allowsExternal(base)) return undefined;
    return {
      target: { scope: base.scope, targetId: base.targetId, forceProactive: true },
      proactive: true,
    };
  }

  public targetFor(sessionId: string): ReplyTarget | undefined {
```

</details>

**依据 5 · 源码核查**：[src/gateway/bootstrap.ts:99-110](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/bootstrap.ts#L99-L110)

回复限制器参与发出 Markdown。

<details>
<summary>查看原文（12行）</summary>

```text
  // 发送适配器：将 QQBot 实例适配为 QQBotSender（openStream 参数形态不同）。
  // sendMarkdown 统一做被动回复限额管控：同一 msgId 超限/过期时降级主动推送。
  const replyLimiter = new ReplyLimiter({ limit: 4 });
  const sender: QQBotSender = {
    sendMarkdown: (target, content, opts) => sendResolvedMarkdown(bot, resolveReplyTarget(target, replyLimiter, true), content, opts),
    openStream: (target) => bot.openStream({
      target: {
        scope: target.scope,
        targetId: target.targetId,
        msgId: target.msgId as string,
      },
    }),
```

</details>

**依据 6 · 源码核查**：[src/transport/outbound.ts:285-313](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/outbound.ts#L285-L313)

文本、失败通知与交付文件分别处理。

<details>
<summary>查看原文（29行）</summary>

```text
  private finishTurn(sessionId: string, event: TurnEndEvent, plan: DeliveryPlan | undefined): void {
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
      if (plan !== undefined && failure !== undefined && !SILENT_TURN_ERROR_CODES.has(failure.code)) {
        await this.send(plan.target, `⚠️ 本轮异常结束\n\`${failure.code}\`: ${failure.message}`, 'sendTurnEndError');
      }
      if (files.length > 0 && this.deliverer !== undefined && plan !== undefined) {
        await this.deliverer.deliver(plan.target, files);
      }
```

</details>

#### 缺口

- 未验证目标冻结、并发消息与 QQ 服务限额的实际结果
  **影响**：不能给回复切换或重复发送的发生率
  **进一步探讨**：用假网关重放 Web 输入后到 QQ 消息、已建缓冲、turn end 和回复过期

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 私聊、群和命令控制在哪生效？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

包由 Cordis 补丁加载，依赖 QQ 凭据、SDK 与 DSH agent 组件。配置默认私聊、群与斜杠命令开放，群消息另有提及门控。有效配对码先于接入白名单被处理，但仍走提及及限流，按群或私聊场景辨别；对应接入关闭则拒绝，撤销身份后旧码拒绝重新认领。普通群聊历史在群接入策略之后、提及门控之前进入缓冲，因此没 @ 的消息也可能被后续 @ 带入会话，不能把 @bot 当成同意传输的粒度。斜杠另检发送者，和普通群接入、宿主工具权限是不同边界。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:54-83](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/package.json#L54-L83)

核对 Cordis 补丁、客户端、SDK 和宿主依赖。

<details>
<summary>查看原文（30行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    },
    "compatibility": {
      "dshReleases": {
        "0.1.0-rc.8": "compatible",
        "0.2.0-rc.2": "compatible"
      },
      "note": "0.1.0-rc.8 为 CLI（dsh web）已验证：扫码/手动/解绑全流程、终端二维码与端内绑定页；0.2.0-rc.2 为 Desktop 内嵌运行时已验证：端内绑定页（settings.section 与侧栏）、HMR 重载收敛。客户端依赖 settings.section / sidebarRightTabs / sidebar.right.pane.tab 席位契约与 dsh.client 模块系统，宿主大版本升级后请重新验收席位行为。"
    }
  },
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

**依据 2 · 源码核查**：[cordis.patch.yml:13-25](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/cordis.patch.yml#L13-L25)

确认加载插件及默认群提及和队列配置。

<details>
<summary>查看原文（13行）</summary>

```text
- insert:
    - id: im-qqbot
      name: '@tencent-connect/dsh-qqbot'
      config:
        appId: __FROM_ENV__
        appSecret: __FROM_ENV__
        # provider/model 留空：从宿主默认模型路由继承
        # 用户可通过 /model 命令在聊天中切换
        requireMention: true
        textChunkLimit: 4500
        sessionIdleTimeout: 1800000
        maxQueue: 20
        processingTimeoutMs: 1800000
```

</details>

**依据 3 · 源码核查**：[src/config.ts:118-149](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/config.ts#L118-L149)

静态默认模式与提及门控定义。

<details>
<summary>查看原文（32行）</summary>

```text
/** 访问控制子 Schema（独立导出：config 路由的服务端校验复用） */
export const AccessControlSchema: Schema<AccessControlConfig> = Schema.object({
  c2cMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('C2C访问模式（默认开放）'),
  commandMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('斜杠命令模式（所有人／白名单／关闭）'),
  c2cAllow: Schema.array(Schema.string()).default([]).description('C2C白名单（QQ OpenID）'),
  groupMode: Schema.union(['open', 'allowlist', 'disabled']).default('open').description('群聊访问模式（默认开放：群自带进群门槛 + @bot 触发）'),
  groupAllow: Schema.array(Schema.string()).default([]).description('群聊白名单（群 OpenID）'),
});

export const ConfigSchema: Schema<ImQQBotConfig> = Schema.object({
  appId: Schema.string().default('').description('QQ 机器人 AppID'),
  appSecret: Schema.string().default('').description('QQ 机器人 AppSecret'),
  provider: Schema.string().description('LLM provider name'),
  model: Schema.string().description('Model name'),
  preset: Schema.string().description('Agent preset id'),
  cwd: Schema.string().description('Agent working directory (default ~/.dsh-qqbot/workspace)'),
  requireMention: Schema.boolean().default(true).description('群聊是否需要@bot触发'),
  groupPrompt: Schema.string().description('群聊额外system prompt'),
  directPrompt: Schema.string().description('私聊额外system prompt'),
  textChunkLimit: Schema.number().default(4500).description('单条消息最大字符数'),
  streaming: Schema.boolean().default(true).description('是否启用流式输出（群聊始终不启用）'),
  sessionIdleTimeout: Schema.number().default(30 * 60 * 1000).description('会话闲置超时(ms)，<=0 不回收'),
  maxQueue: Schema.number().default(20).description('并发队列最大长度'),
  processingTimeoutMs: Schema.number().default(30 * 60 * 1000).description('处理超时(ms)，超时中断当前 LLM 调用'),
  askTimeoutMs: Schema.number().default(5 * 60 * 1000).description('待答问题超时(ms)，超时自动拒绝并提示'),
  historyLimit: Schema.number().default(10).description('群历史缓冲条数'),
  access: AccessControlSchema.default({
    c2cMode: 'open',
    c2cAllow: [],
    groupMode: 'open',
    groupAllow: [],
  }).description('访问控制'),
```

</details>

**依据 4 · 源码核查**：[src/gateway/middleware-setup.ts:46-77](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/middleware-setup.ts#L46-L77)

配对中间件在一般访问控制前处理。

<details>
<summary>查看原文（32行）</summary>

```text
  // 有效网页邀请是加白入口，必须先于访问控制；普通消息仍走下方策略。
  bot.use(async (ctx, next) => {
    const service = manager.accountAccess;
    const content = ctx.message.content
      .replaceAll(`<@!${config.appId}>`, '').replaceAll(`<@${config.appId}>`, '').trim();
    if (!service || !content || content.length > 32 || !service.isActivePairCode(content)) {
      await next();
      return;
    }
    await mention(ctx, async () => limit(ctx, async () => {
      try {
        const result = service.beginClaimFromMessage(
          ctx.replyTarget.scope, ctx.replyTarget.targetId, content,
          ctx.message.senderId, messageSenderName(ctx.message),
        );
        await ctx.bot.sendText(ctx.replyTarget, result.message);
      } catch (err) {
        logger.error(`im-qqbot: 认领处理失败: ${err instanceof Error ? err.message : String(err)}`);
        try { await ctx.bot.sendText(ctx.replyTarget, '⚠️ 认领处理失败，请稍后重试。'); } catch { /* reply best-effort */ }
      }
      ctx.stop('claim-result');
    }));
  });

  // 3. 访问控制（空名单 = 拒绝所有人，fail-closed）
  bot.use((ctx, next) => {
    const access = manager.accountAccess?.currentAccess() ?? config.access;
    return accessPolicy({
      c2c: { mode: access.c2cMode, allow: access.c2cAllow },
      group: { mode: access.groupMode, allow: access.groupAllow },
      onBlock: (_ctx, reason) => { if (config.debug) logger.debug('Access blocked: ' + reason); },
    })(ctx, next);
```

</details>

**依据 5 · 源码核查**：[src/gateway/middleware-setup.ts:80-123](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/middleware-setup.ts#L80-L123)

群历史早于提及门控，命令另进入鉴权。

<details>
<summary>查看原文（44行）</summary>

```text
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
  bot.use(mention);

  // 6. 内容清洗（去 @marker、表情标签、多余空白）
  bot.use(contentSanitizer({
    parseFaceTags: true,
  }));

  // 7. 三层限流（sender / group / global）
  bot.use(limit);

  // 8. 斜杠命令（在 concurrencyGuard 之前，命令匹配后不排队直接响应）
  const slash = slashCommand({
    // 关闭 autoHelp：help 命令由 qqbot 注册为 /bot-help，
    // 避免 SDK 再自动注册一个无前缀的 /help 造成重复
    autoHelp: false,
    commands: buildCommandList({ manager, config, logger }),
  });
  bot.use(slash.middleware);
  bot.use(async (ctx, next) => {
    if (ctx.message.content.trim().startsWith('/')) {
      const service = manager.accountAccess;
      const error = service ? service.commandAccessError(ctx.message.senderId) : '斜杠命令服务尚未就绪。';
      await ctx.bot.sendText(ctx.replyTarget, error ?? '未知命令，请发送 /bot-help 查看可用命令。');
      ctx.stop(error ? 'slash-command-access-denied' : 'unknown-command');
      return;
    }
    await next();
  });
  // 8.5. 待答问题截获（在 concurrencyGuard 之前，答案消息不排队直接作答）
  bot.use(questionAnswer(manager));
```

</details>

**依据 6 · 源码核查**：[src/runtime/account-service.ts:89-131](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/runtime/account-service.ts#L89-L131)

识别认领范围、撤销和已存在名单。

<details>
<summary>查看原文（43行）</summary>

```text
  /** 由 QQ 侧发起认领（群里/私聊直接发送配对码）：在允许接入的场景认领。 */
  beginClaimFromMessage(scope: ChatScope, peerId: string, code: string, senderId: string, senderName?: string): { ok: boolean; message: string } {
    const validation = this.pairing.validate(code);
    if (!validation.ok) {
      return { ok: false, message: validation.reason === 'expired' ? '❌ 配对码已过期，请在网页重新生成。' : '❌ 配对码无效或已结束，请在网页重新生成。' };
    }
    const { purpose } = validation;
    if ((purpose === 'allow-group' && scope !== 'group') || (purpose === 'allow-c2c' && scope !== 'c2c')) {
      return { ok: false, message: purpose === 'allow-group'
        ? '请在目标群聊中 @机器人发送此配对码；配对码仍然有效。'
        : '请在私聊中发送此配对码；配对码仍然有效。' };
    }
    const access = this.currentAccess();
    if ((scope === 'group' ? access.groupMode : access.c2cMode) === 'disabled') {
      return { ok: false, message: '此类 QQ 对话的接入已关闭，无法认领配对码。' };
    }
    const entry = this.store.peerName(scope, peerId);
    // 群白名单是对「群」加白：身份用群 openID（peerId），昵称用群名；其余用发送者 openID。
    const isGroupAllow = purpose === 'allow-group';
    const savedName = this.store.memberProfiles()[isGroupAllow ? peerId : senderId]?.nickname;
    return this.claimMember(code, purpose, {
      openid: isGroupAllow ? peerId : senderId,
      nickname: isGroupAllow
        ? (entry.alias || savedName || entry.name || '')
        : (senderName?.trim() || savedName || (scope === 'c2c' ? (entry.alias || entry.name) : '') || ''),
      scene: scope,
      sceneName: scope === 'group' ? (entry.name || entry.alias || '本群') : (entry.alias || entry.name || '私聊'),
    });
  }

  private claimMember(code: string, purpose: PairPurpose, actor: Omit<ClaimedMember, 'claimedAt'>): { ok: boolean; message: string } {
    if (this.pairing.isRevoked(code, actor.openid)) return { ok: false, message: '该身份已被移出白名单，请使用新的配对码。' };
    const status = this.pairStatus();
    const members = purpose === 'owner' ? status.owners : purpose === 'allow-group' ? status.allowGroup : status.allowC2c;
    const existing = members.find(member => member.openid === actor.openid);
    if (this.pairing.claimResult(code, actor.openid) && !existing) return { ok: false, message: '该身份已被移出白名单，请使用新的配对码。' };
    if (existing) {
      this.pairing.recordResult(code, { ...existing, state: 'existing' });
      return { ok: true, message: `✅ ${existing.nickname || '该身份'}已在白名单中，无需重复添加。` };
    }
    const applied = this.applyMember(purpose, actor.openid, actor.nickname, actor.scene, actor.sceneName);
    if (applied.ok) this.pairing.recordResult(code, { ...applied.member, state: 'added' });
    return { ok: applied.ok, message: applied.message };
```

</details>

#### 缺口

- 真实群成员知情方式和宿主工具授权链没有验收
  **影响**：不能将安装成功视作授权和数据边界正确
  **进一步探讨**：在测试账号拒绝未授权私聊、群和命令，确认非提及消息是否进入后续上下文

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样控制使用成本并验证出站语义？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先观察。只有独立 QQ 测试号、受控私聊白名单和无敏感工具的 DSH profile 可用于后续接入验证。扫码缺凭据时异步启动，成功写入 profile 后等热重载；写入失败本进程可继续但下次需绑定。费用按实际合格回复累计模型调用、工具和人工排查；QQ 平台流量或失败次数未测。退出需停网关和会话，分别检查 profile 和环境凭据、名单与本地记录。可以让缓冲记录入站因果 ID 和目标选择时间，在正式发首个片段前确认最终可用目标，随后冻结；预期能减少外部输入与 QQ 入站交错时的目标错配。若首段等待显著增加，且错误路由或重复投递没有减少，则撤回假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:24-59](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/index.ts#L24-L59)

异步绑定以及持久化成功等待重载、失败直接启动的分支。

<details>
<summary>查看原文（36行）</summary>

```text
export async function apply(ctx: Context, config: ImQQBotConfig): Promise<void> {
  const agents = (ctx as unknown as Record<string, unknown>).agents as DshAgentRegistry;
  const logger: Logger = ((ctx as unknown as Record<string, unknown>).logger as Logger) ?? console;

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

        // 持久化到 profile：成功则等待热更新重载，失败则用凭据直接启动。
        // 注意：不写入 process.env——resolveEnv 的 env 回退属于用户显式
        // export 的配置语义，运行时写入会与解绑清理不对齐（解绑后 HMR
        // 重载的新 fiber 仍从 env 读到旧凭据，状态停留 bound）
        const persisted = persistCredentialsToProfile(credentials, getProfileDir() ?? undefined, logger);
        if (persisted) {
          // 写入 cordis.patch.yml 会触发 dsh 热更新，自动重新加载本插件。
          logger.info('配置已保存，等待热更新重新加载...');
          return;
        }
        logger.warn('凭据未能持久化，本次进程将使用环境变量凭据启动（重启后需重新绑定）');
        // 本 fiber 已激活（ctx 有效），直接以凭据启动网关
        void bootstrapGateway(ctx, agents, {
```

</details>

**依据 2 · 源码核查**：[src/gateway/bootstrap.ts:172-184](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/bootstrap.ts#L172-L184)

监听断连并区分重连与永久失败。

<details>
<summary>查看原文（13行）</summary>

```text
  // disconnected 事件为 SDK 1.0.5+ 新增：旧版 handlers 表缺该键，bot.on 会抛
  // TypeError（profiles 增量安装可能残留旧版 SDK）——降级为跳过监听而非崩溃
  try {
    bot.on('disconnected', (event: GatewayDisconnect) => {
      const detail = `code=${event.code}${event.reason ? ` reason=${event.reason}` : ''}`;
      if (event.willReconnect) {
        logger.warn(`Bot disconnected (${detail}), reconnecting...`);
      } else {
        logger.error(`Bot disconnected permanently (${detail}), giving up`);
      }
    });
  } catch (err) {
    logger.warn(`qqbot-nodejs SDK 不支持 disconnected 事件（请升级 @tencent-connect/qqbot-nodejs 至 1.0.5+）: ${err instanceof Error ? err.message : String(err)}`);
```

</details>

**依据 3 · 源码核查**：[src/gateway/bootstrap.ts:202-215](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/gateway/bootstrap.ts#L202-L215)

宿主清理关闭会话管理和机器人。

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/transport/turn-origin.ts:9-10](https://github.com/tencent-connect/dsh-qqbot/blob/0ddf232ef24a6e38b8ebd73c68b360c39f87adf7/src/transport/turn-origin.ts#L9-L10)

缓冲冻结目标是可观察对照。

```text
 * 已知边界：一个 external 回合中途插入 QQ 入站时会改判为被动，但本回合已创建的
 * 出站缓冲仍按创建时的主动目标发送（目标在缓冲创建时拍下，回合内不改）。
```

#### 缺口

- 实际绑解、网关重连、配额和工具开销未实测
  **影响**：不能评估无人维护的稳定性和净成本
  **进一步探讨**：用测试账号采集握手、白名单拒绝、只读应答、断连和退出，记录模型用量与重复数

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
