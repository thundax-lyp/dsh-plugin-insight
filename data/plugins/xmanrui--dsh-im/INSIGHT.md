# dsh-im

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[7e78d77](https://github.com/xmanrui/dsh-im/tree/7e78d771e33ff655a91f127fdd04e90440403e71)

<!-- BEGIN META -->
[![GitHub ★ 2,599](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2%2C599&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xmanrui/dsh-im) [![npm 30d 66,600](https://img.shields.io/static/v1?label=npm+30d&message=66%2C600&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im)
<!-- END META -->

> **功能**：把微信、飞书等 IM 渠道与多机器人接入 DSH，并提供会话同步和主动投递。

> **亮点**：相对独立机器人脚本，把多渠道身份、DSH会话和主动投递组织到同Host服务；增量在交付编排与共享路由。见[Q01](#research-q01)。

> **主要限制**：unknown停止重试有明确保护，但发送成功到pending删除之间仍有崩溃窗口；多渠道权限与宿主认证不能由统一UI代替。见[Q02](#research-q02)。

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
  - [Q01 · 多IM接入为谁改变什么交付流程？](#detail-section-11)
  - [Q02 · 入站去重、会话状态和延迟交付怎样实现？](#detail-section-12)
  - [Q03 · 管理凭据与渠道权限能否约束外部副作用？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复负担支持什么试用？](#detail-section-14)
  - [Q05 · 怎样补齐外部投递与本地状态之间的证据窗口？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有机器人维护经验的用户可在IM私聊调用固定DSH工作区并接收结果。

每平台独立SDK机器人加手写DSH会话调用为基线；平台现有机器人若已满足单渠道任务，统一框架额外维护未必划算。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| IM消息接入 | 在聊天渠道提交DSH任务 | 平台身份/权限及访问策略；本次重点核微信 |
| 会话映射 | 对应工作区/会话持续对话 | 状态与机器人身份需保存 |
| 主动投递 | 按botId/targetId发送文字 | 目标有效、渠道配额及权限 |
| 延迟补发 | 超时后从宿主终态恢复文字 | unknown停止，非工具调用重放 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH与Node>=22.19 | 必需 | 内部会话/工作区服务 | 对应Host调用不可用 |
| 渠道账号/Token/平台权限 | 目标渠道必需 | 接收和发送 | 不连接或发送被拒 |
| 模型接入和工作区 | 任务必需 | DSH任务执行 | 连接在线仍不能交付 |
| Host认证与访问白名单 | 管理及安全试用必需 | 限管理与入站范围 | 不扩大LAN或群聊 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者备份配置、建单机器人并收紧访问 | 目标/工作区/白名单清楚 |
| 接入 | 维护者按渠道扫码或配Token | 连接状态与本Host一致 |
| 试用 | 指定私聊发非敏感任务 | 正确会话、唯一最终结果 |
| 恢复 | 遇unknown先查平台收件与宿主终态 | 不盲重发，暂停连接后本地处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装包、渠道账号/服务；金额未知 | 创建机器人、权限、工作区与白名单；耗时未知 | 各渠道不同 |
| 持续使用 | 模型、网络、平台配额及附件；实际金额未知 | 维护Token/连接并复核收件 | 不等于统一UI免运维 |
| 失败恢复 | 重连和补发资源，费用未知 | 先查宿主终态/平台回执，unknown人工对账 | 状态备份后再处理凭据和重装 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| IM到DSH | 微信去重、访问策略与会话状态 | 全渠道实际兼容 |
| 延迟交付 | completed终态提取、failed/unknown区分 | 崩溃后端到端不重复 |
| 统一管理 | 共享Host服务和目标配置 | 总维护时间与净费用 |

> **思考**：unknown停止重试有明确保护，但发送成功到pending删除之间仍有崩溃窗口；多渠道权限与宿主认证不能由统一UI代替。见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对独立机器人脚本，把多渠道身份、DSH会话和主动投递组织到同Host服务；增量在交付编排与共享路由。见[Q01](#research-q01)。

入口提供显式版本的dshIm服务、adapter隔离以及unknown不同于failed的恢复分类值得借鉴；移植需平台回执与宿主持久事件语义。源码去重不能替代外部发送对账，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

unknown停止重试有明确保护，但发送成功到pending删除之间仍有崩溃窗口；多渠道权限与宿主认证不能由统一UI代替。见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

一个非敏感私聊、一个固定工作区、明确收件目标可受控试用；不将Matrix实验加密用于敏感内容。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核微信入站及共享延迟交付核心；全部平台兼容、Host安全和交付效果未验，持久attempt设计属未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin-src/host/index.mjs、plugin-src/host/rpc-authority.mjs、src/channels/weixin/weixin-bridge.mjs、src/channels/weixin/state-store.mjs、src/channels/shared/deferred-delivery.mjs、src/channels/shared/deferred-delivery-coordinator.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码抽查Host服务、微信入站与共享延迟投递，不宣称所有渠道端到端兼容、管理认证安全或文件权限验收。
- 下一步：选同一非敏感任务记录会话映射、收件目标和最终回执；对unknown及崩溃窗口用测试接收端核重复/漏发和恢复时间，未经授权不真实外发。

**分析版本**

- **仓库**：[xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)
- **版本号**：5.6.0（[固定提交 7e78d77](https://github.com/xmanrui/dsh-im/tree/7e78d771e33ff655a91f127fdd04e90440403e71)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是将延迟交付attempt与已有receipt关联，重启先按幂等键和平台messageId对账；断响应/杀进程对照无改善则停止。见[Q05](#research-q05)。

选同一非敏感任务记录会话映射、收件目标和最终回执；对unknown及崩溃窗口用测试接收端核重复/漏发和恢复时间，未经授权不真实外发。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 380 | 94488 | 83362 | 5861 | — |
| .md | source | 100 | 23066 | — | — | 453143 |
| .js | source | 90 | 49340 | 46873 | 1245 | — |
| .mjs | test | 281 | 125446 | 115878 | 2136 | — |
| .js | test | 4 | 573 | 549 | 6 | — |
| .mjs | example | 3 | 322 | 290 | 12 | — |
| .js | example | 2 | 78 | 73 | 5 | — |
| .md | example | 1 | 34 | — | — | 223 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-27），可前往 [GitHub Issues](https://github.com/xmanrui/dsh-im/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多IM接入、会话映射与外部交付的机制和条件，重点检查微信及共享延迟投递

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多IM接入为谁改变什么交付流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有DSH和机器人账号的个人/团队维护者，可以在熟悉的IM里提问、绑定工作区和会话，并收取文字或渠道支持的结果文件；合格结果需同时满足正确会话、正确收件人和可确认投递，而非只看到机器人在线。相对为每个平台单独写机器人，本项目集中管理多机器人并复用本Host的Session/Workspace服务，跨渠道保留同一DSH任务执行面。HTTP、同Host插件和Connection RPC共用目标配置及投递核心，减少多入口各自维护路由的错配。它是渠道/交付编排，不是新模型能力；各平台协议、权限和附件限制仍不同，不能从统一设置面推出完全等价体验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:94-96](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/README.md#L94-L96)

作者明确统一管理、多机器人独立状态

```text
## 简介

通过扫码、App Manifest 或已有机器人凭据把 IM 机器人接入 DeepSeek Harness，并让本机 Harness 主动连接公网 AI Office。一个插件、一个设置入口，统一管理内置 IM 渠道和 AI Office Connector。**每个 IM 渠道都支持接入多个机器人**，各机器人的连接状态、工作区、模型和会话绑定彼此独立；iMessage 是本机 Messages.app 身份接入的例外，详见[iMessage 渠道说明](docs/imessage.md)。
```

**依据 2 · 作者声明**：[README.md:250-258](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/README.md#L250-L258)

共同投递核心与双向同步的私聊限制

```text
### 主动投递

支持主动投递的 IM 渠道可以使用稳定的 `botId + targetId` 主动发送文字消息。机器人设置页支持从已聊会话选择或手工填写目标、保存前测试当前路由，以及复制调用参数；HTTP POST、同 Host 插件和 Connection RPC 共用同一目标配置与投递核心。

已保存的私聊目标还可以开启默认关闭的「会话双向同步」。开启后，DSH Web／CLI 在该私聊当前 Session 中发送的用户文字和最终助手文字会同步回私聊，定时任务成功完成后的最终助手文字也会同步；IM 侧原有提问与 `/steer` 不会重复。开关自动跟随 `/session`、`/new` 和工作区切换后的当前 Session。首版仅支持当前 Host 的私聊文字；群聊、Topic、Thread 与显式远程 `harnessBaseUrl` 不支持。

同步回答按渠道能力呈现 Markdown：复用飞书卡片、Telegram 富文本、QQ／钉钉／Slack 的格式消息，以及企业微信机器人、Matrix、Discord 的已有能力；WhatsApp 适配常用格式，企业微信应用和微信保留完整文本。格式降级与长消息处理沿用或复用渠道机制，发送结果未知时不新增自动重发。

设置步骤、各渠道字段、完整调用示例、管理端点、错误码与排错说明请查看[《主动投递使用指南》](PROACTIVE_DELIVERY.md)（[English](PROACTIVE_DELIVERY.en.md)）。
```

**依据 3 · 源码核查**：[plugin-src/host/index.mjs:96-125](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/plugin-src/host/index.mjs#L96-L125)

提供dshIm服务并注入内部Session/Workspace控制器

<details>
<summary>查看原文（30行）</summary>

```text
      const deliveryService = makeDeliveryService({
        unavailableSessionSyncChannels: unavailableSessionSyncChannels.map((channel) => channel === 'wecomApp' ? 'wecom-app' : channel),
        dsBot: createDsBotClient(ctx),
      });
      if (typeof ctx?.provide === 'function') {
        ctx.provide('dshIm', Object.freeze({
          contractVersion: 1,
          receiptVersion: 1,
          inboundVersion: 1,
          consumeInbound: (botId, options) => deliveryService.consumeInbound(botId, options),
          historyChecked: (botId, route, query, options) => deliveryService.historyChecked(botId, route, query, options),
          replyChecked: (botId, route, text, options) => deliveryService.replyChecked(botId, route, text, options),
          describeBot: (botId) => deliveryService.describeBot(botId),
          sendChecked: (botId, targetId, text, options) => deliveryService.sendChecked(botId, targetId, text, options),
          send: (botId, targetId, text, options) => (
            deliveryService.send(botId, targetId, text, options)
          ),
          listTargets: async (botId) => (await deliveryService.listTargets(botId)).targets,
          createTarget: (botId, target) => deliveryService.createTarget(botId, target),
          listBots: () => deliveryService.listBots(),
        }));
      }
      const activate = async (readyCtx) => {
        await activateChannels(readyCtx, config, deliveryService);
      };
      if (typeof ctx?.inject === 'function') {
        await ctx.inject(
          ['sessionController', 'workspaceController'],
          activate,
        );
```

</details>

#### 缺口

- 缺少多渠道相同任务的交付质量和人工维护时间对照
  **影响**：无法证明统一入口降低总成本
  **进一步探讨**：固定一个真实通知任务比较独立脚本和本插件的配置、交付率、人工恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入站去重、会话状态和延迟交付怎样实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

本次用微信链路核核心语义，并非逐一验收所有渠道。accept忽略机器人消息，要求messageId与sender，先查持久hasSeen和内存acceptedMessageIds；接着执行访问策略，旧配置回退owner-only。通过后按sender建立conversationKey并保存context_token等上下文，后续会话映射由state-store持久化，区别于仅靠进程内缓存。共享延迟交付从宿主durable事件中提取completed轮次的最终回答，每机器人按会话串行读取/发送/删除，避免同进程并发投递旧对象。发送成功才移除pending，明确失败最多三次退避，unknown落为failed/unknown并停止自动重试。这个分类比一律重发更可靠，但注释明确没有持久化pre-send claim：进程在平台已接收、pending尚未删除之间崩溃，仍存在重启重投的不确定窗口；本轮未运行故只指出机制边界，不宣称已复现重复消息。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/weixin/weixin-bridge.mjs:383-405](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/weixin/weixin-bridge.mjs#L383-L405)

去重与访问策略先于会话处理

<details>
<summary>查看原文（23行）</summary>

```text
  accept(message) {
    if (this.#signal?.aborted) return Promise.resolve();
    if (message?.message_type === 2) return Promise.resolve();
    const messageId = weixinMessageId(message);
    const sender = nonEmptyString(message?.from_user_id);
    if (!messageId || !sender || this.#state.hasSeen(messageId)
      || this.#acceptedMessageIds.has(messageId)) return Promise.resolve();
    const commandText = nonEmptyString(extractWeixinText(message)) ?? '';
    const access = this.#accessPolicy
      ? evaluateInboundAccess(this.#accessPolicy, {
          conversationType: 'direct',
          senderIds: sender,
          text: commandText,
          hasImages: hasWeixinImageItems(message),
          hasFiles: hasWeixinFileItems(message),
        })
      : sender === this.#ownerUserId
        ? { allowed: true, reason: 'legacy-owner' }
        : { allowed: false, reason: 'sender-not-allowed' };
    if (!access.allowed) {
      this.#acceptedMessageIds.set(messageId, null);
      return this.#finishAccessDecision(messageId, sender, message, access);
    }
```

</details>

**依据 2 · 源码核查**：[src/channels/weixin/state-store.mjs:169-175](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/weixin/state-store.mjs#L169-L175)

会话绑定写入状态

```text
  sessionFor(key) {
    return this.#state.sessions[key] ?? null;
  }

  async setSession(key, sessionId) {
    this.#state.sessions[key] = sessionId;
    await this.#persist();
```

**依据 3 · 源码核查**：[src/channels/shared/deferred-delivery-coordinator.mjs:22-25](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/shared/deferred-delivery-coordinator.mjs#L22-L25)

串行队列及无持久pre-send claim的明确边界

```text
/** One coordinator per bot. All history reads, sends, removal and stops for a
 * Session use the same queue. Queued work stores ids, never stale entry objects.
 * Durable pending rows survive crashes; there is no persisted pre-send claim.
 */
```

**依据 4 · 源码核查**：[src/channels/shared/deferred-delivery-coordinator.mjs:150-184](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/shared/deferred-delivery-coordinator.mjs#L150-L184)

成功删除、unknown停止、明确失败三次重试

<details>
<summary>查看原文（35行）</summary>

```text
        return 'waiting';
      }
      sending = true;
      const result = await deliver(entry, outcome);
      if (result === false || result?.deliveryOutcome === 'failed' || result?.deliveryOutcome === 'unknown') {
        throw Object.assign(new Error('Deferred delivery was not confirmed'), {
          deliveryOutcome: result?.deliveryOutcome ?? 'failed',
        });
      }
      await remove(entry);
      return 'delivered';
    } catch (error) {
      if (activeSignal.aborted) return 'none';
      if (isSessionNotFound(error?.code)) { await remove(entry); return 'none'; }
      const current = await pending(id);
      if (!current) return 'none';
      if (!sending) {
        warn(error);
        schedule(current);
        return stopping ? 'unavailable' : 'waiting';
      }
      const uncertain = error?.deliveryOutcome === 'unknown'
        || (error?.deliveryOutcome !== 'failed'
          && channelDeliveryFailure(error).code === 'channel-delivery-uncertain');
      if (uncertain) {
        // The provider may already have accepted the message. Preserve the
        // existing delivery-uncertain rule instead of retrying a possible copy.
        await state.patchDeferred(id, { status: 'failed', deliveryOutcome: 'unknown', attempts: (current.attempts ?? 0) + 1 });
        warn(error);
        return stopping ? 'unavailable' : 'unknown';
      }
      const attempts = await registry.markFailedAttempt(current);
      warn(error);
      if (attempts < 3) schedule(current, retryDelayMs * 2 ** (attempts - 1));
      return stopping ? 'unavailable' : 'retry';
```

</details>

#### 缺口

- 崩溃窗口与跨进程重复投递未实测
  **影响**：不能把去重机制称作端到端exactly-once
  **进一步探讨**：用可记录请求ID的测试接收端，在发送返回前后强制终止进程，核pending恢复和重复消息

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 管理凭据与渠道权限能否约束外部副作用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

管理默认trusted-host，明确依赖Harness在分发管理Fetch前执行浏览器认证与Host/Origin信任检查，可显式加loopback限制；因此安全结论绑定真实宿主版本，不能只检查本文件就认可局域网暴露。入站访问策略和主动出站是两种权限面，允许提问不意味着应把任意文件或结果发送到任意目标。新建飞书/QQ默认所有用户可聊及执行内置命令，维护者必须按实际场景收紧白名单；Matrix作者明确实验性加密缺设备验证、密钥备份和附件内容加密，不适合敏感数据。各渠道需要自己的Token、扫码设备密钥、权限/配额和网络；本机Host内部调用不会自动失败转连其他Host，降低误路由同时要求准确配置。所有能力并不在一个统一安全承诺下成立，推荐必须按目标渠道缩小范围。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/rpc-authority.mjs:1-12](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/plugin-src/host/rpc-authority.mjs#L1-L12)

管理权限默认复用宿主信任层

<details>
<summary>查看原文（12行）</summary>

```text
const RPC_AUTHORITIES = new Set(['loopback', 'trusted-host']);

/**
 * Resolve the browser authority accepted by an IM management RPC channel.
 * By default, use the browser authentication and Host/Origin trust checks
 * already enforced by Harness before it dispatches a management Fetch route.
 */
export function resolveRpcAuthority(value) {
  if (value === undefined) return 'trusted-host';
  if (RPC_AUTHORITIES.has(value)) return value;
  throw new TypeError('dsh-im rpcAuthority must be "loopback" or "trusted-host"');
}
```

</details>

**依据 2 · 作者声明**：[README.md:125-131](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/README.md#L125-L131)

Matrix限制与新机器人默认访问范围

```text
Matrix 加密目前仅供非敏感测试：默认 optional 模式尝试启动加密引擎，失败时跳过收到的加密消息；required 模式在引擎启动失败时拒绝连接。尚未实现交互式设备验证、密钥备份、SSSS 或媒体附件内容加密，本次发布未验证真实 homeserver／Element 互通，请勿将其视为完整的端到端保密保障。

企业微信自建应用的回调基址、代理地址和企业可信 IP 配置，见[企业微信自建应用接入说明](docs/企业微信自建应用接入.md)。

其他 IM 平台可继续按同一渠道适配器结构接入。

扫码新建的飞书和 QQ 机器人，默认允许所有用户在私聊和群聊中聊天及执行内置命令；可在机器人的访问设置中调整白名单和命令权限。已有机器人的访问设置保持不变。
```

**依据 3 · 作者声明**：[README.md:196-196](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/README.md#L196-L196)

本机内部服务不自动改连其他Host

```text
本机 `dsh web` 和 DSH Desktop 默认直接复用当前 Host 的内部服务：通过 Typert Gateway 调用 Session Controller 和 Workspace Controller，不需要配置 Harness 地址，也不绕行本机 HTTP 端口。Desktop 的兼容模式、扩展窗口和增强模式均无需开启“允许在浏览器中打开”或局域网访问。渠道配置中显式设置的 `harnessBaseUrl` 仅保留给旧版远程 HTTP/WebSocket Harness；内部调用失败不会自动改连其他 Host。
```

#### 缺口

- 目标Host认证以及所有渠道权限实现未逐项核查
  **影响**：本次不能推广为多平台安全认证或敏感消息保证
  **进一步探讨**：先只选一个非敏感私聊渠道，核白名单、凭据存放、附件权限及Host管理认证

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复负担支持什么试用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

首次要安装匹配DSH与Node的包，创建机器人或扫码、配置平台权限并选择工作区/模型/访问策略；每新增渠道是新的凭据和生命周期，不是零配置。持续有模型token、平台配额、长轮询/长连接、附件传输与人工审批成本；金额与频率缺测。失败恢复必须先查会话终态与平台实际收件，再决定补发，unknown不重发是可行退路但会增加人工核对。state-store保存会话、消息ID、上下文和待交付记录，删除状态或重新扫码会改变恢复条件，应先备份且不要用重装替代结果核对。建议有机器人维护经验者在一个非敏感私聊、一个固定工作区试用；成功标准是消息落到预期会话且只有一次最终结果，错误收件、重复输出或结果不明时暂停机器人连接，回到DSH本地完成任务并人工核对平台记录，不扩到群聊或多渠道。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:101-104](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/package.json#L101-L104)

作者兼容声明绑定DSH版本

```text
    "build": "node plugin-src/client/build.mjs && node plugin-src/host/build.mjs",
    "test": "node --test test/*.test.mjs test/channels/*/*.test.mjs",
    "check": "npm run build && npm test && node scripts/verify-package.mjs"
  },
```

**依据 2 · 作者声明**：[README.md:145-149](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/README.md#L145-L149)

超时补发限定文字/终态，不重放工具

```text
### 超时后的结果补发

已接入的 IM 渠道共用超时任务跟踪：收到“等待模型回复超时”后，插件会继续检查原任务，完成后向原聊天或线程补发最终文字；插件重启或连接恢复后也会继续检查。`/stop` 只停止当前聊天提交的对应回合，切换会话后不再向该聊天补发旧会话的结果。无需新增设置，正常回复流程保持原样。

补发仍受渠道发送权限和配额限制。明确发送失败最多尝试三次；发送结果不确定时保留记录并停止自动重试，避免重复消息。此机制恢复文字结果和终态通知，不重放问题、审批或文件工具调用。详见[延迟交付说明](docs/deferred-delivery.md)。
```

**依据 3 · 源码核查**：[src/channels/weixin/state-store.mjs:8-15](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/weixin/state-store.mjs#L8-L15)

持久状态范围

```text

const EMPTY_STATE = Object.freeze({
  version: 1,
  sessions: {},
  seenMessageIds: [],
  getUpdatesBuf: '',
  recentOutboundMessages: [],
});
```

**依据 4 · 源码核查**：[src/channels/shared/deferred-delivery-coordinator.mjs:171-184](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/shared/deferred-delivery-coordinator.mjs#L171-L184)

unknown与明确失败的不同恢复策略

<details>
<summary>查看原文（14行）</summary>

```text
      const uncertain = error?.deliveryOutcome === 'unknown'
        || (error?.deliveryOutcome !== 'failed'
          && channelDeliveryFailure(error).code === 'channel-delivery-uncertain');
      if (uncertain) {
        // The provider may already have accepted the message. Preserve the
        // existing delivery-uncertain rule instead of retrying a possible copy.
        await state.patchDeferred(id, { status: 'failed', deliveryOutcome: 'unknown', attempts: (current.attempts ?? 0) + 1 });
        warn(error);
        return stopping ? 'unavailable' : 'unknown';
      }
      const attempts = await registry.markFailedAttempt(current);
      warn(error);
      if (attempts < 3) schedule(current, retryDelayMs * 2 ** (attempts - 1));
      return stopping ? 'unavailable' : 'retry';
```

</details>

#### 缺口

- 真实任务的渠道费用、重连频率和人工核对时间未知
  **影响**：不支持持续安装或成本节省承诺
  **进一步探讨**：按同一通知任务记录成功/失败总调用、收件确认和恢复时间，确认可退出后再扩渠道

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样补齐外部投递与本地状态之间的证据窗口？

**研究主题**：新假设与验证

#### 完整回答

从“发送成功再删除pending”与“没有持久pre-send claim”的组合，可推导未验证设计：在发送前写attempt及幂等键，绑定bot、target、会话轮次和内容摘要；发送后保存平台messageId或unknown状态，重启先对账而非直接重发。若平台支持幂等键可尝试强约束；不支持时只能收敛到人工/平台查询，不能用本地日志伪造exactly-once。该设计新增存储、隐私与垃圾清理负担，而且部分receipt能力可能已经由投递核心提供，需先核全链避免重复建账。最小验证在外部接收成功后断开响应和杀进程，比较当前与预写attempt方案的重复数、漏发数、人工核对耗时；若不能减少未知窗口或显著增加人工步骤，则不推广。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/shared/deferred-delivery-coordinator.mjs:22-25](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/shared/deferred-delivery-coordinator.mjs#L22-L25)

持久pending但无发送前claim提供推导起点

```text
/** One coordinator per bot. All history reads, sends, removal and stops for a
 * Session use the same queue. Queued work stores ids, never stale entry objects.
 * Durable pending rows survive crashes; there is no persisted pre-send claim.
 */
```

**依据 2 · 源码核查**：[src/channels/shared/deferred-delivery-coordinator.mjs:150-179](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/src/channels/shared/deferred-delivery-coordinator.mjs#L150-L179)

接受后移除和未知结果停止的边界

<details>
<summary>查看原文（30行）</summary>

```text
        return 'waiting';
      }
      sending = true;
      const result = await deliver(entry, outcome);
      if (result === false || result?.deliveryOutcome === 'failed' || result?.deliveryOutcome === 'unknown') {
        throw Object.assign(new Error('Deferred delivery was not confirmed'), {
          deliveryOutcome: result?.deliveryOutcome ?? 'failed',
        });
      }
      await remove(entry);
      return 'delivered';
    } catch (error) {
      if (activeSignal.aborted) return 'none';
      if (isSessionNotFound(error?.code)) { await remove(entry); return 'none'; }
      const current = await pending(id);
      if (!current) return 'none';
      if (!sending) {
        warn(error);
        schedule(current);
        return stopping ? 'unavailable' : 'waiting';
      }
      const uncertain = error?.deliveryOutcome === 'unknown'
        || (error?.deliveryOutcome !== 'failed'
          && channelDeliveryFailure(error).code === 'channel-delivery-uncertain');
      if (uncertain) {
        // The provider may already have accepted the message. Preserve the
        // existing delivery-uncertain rule instead of retrying a possible copy.
        await state.patchDeferred(id, { status: 'failed', deliveryOutcome: 'unknown', attempts: (current.attempts ?? 0) + 1 });
        warn(error);
        return stopping ? 'unavailable' : 'unknown';
```

</details>

**依据 3 · 源码核查**：[plugin-src/host/index.mjs:101-109](https://github.com/xmanrui/dsh-im/blob/7e78d771e33ff655a91f127fdd04e90440403e71/plugin-src/host/index.mjs#L101-L109)

已有receiptVersion与sendChecked接口，提示需避免重建现有账本

```text
        ctx.provide('dshIm', Object.freeze({
          contractVersion: 1,
          receiptVersion: 1,
          inboundVersion: 1,
          consumeInbound: (botId, options) => deliveryService.consumeInbound(botId, options),
          historyChecked: (botId, route, query, options) => deliveryService.historyChecked(botId, route, query, options),
          replyChecked: (botId, route, text, options) => deliveryService.replyChecked(botId, route, text, options),
          describeBot: (botId) => deliveryService.describeBot(botId),
          sendChecked: (botId, targetId, text, options) => deliveryService.sendChecked(botId, targetId, text, options),
```

#### 缺口

- 全投递核心receipt与延迟补发关联尚未全面核查
  **影响**：新账本可能重复现有能力，假设不能当产品缺口定论
  **进一步探讨**：先逐项对齐sendChecked回执和deferred记录，再开展崩溃对照

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
