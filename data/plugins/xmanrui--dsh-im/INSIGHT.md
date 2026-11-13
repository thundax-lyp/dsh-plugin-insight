# DSH-IM

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[fc2ceab](https://github.com/xmanrui/dsh-im/tree/fc2ceab217309f8973afa03c58cdd8ff3e900130)

<!-- BEGIN META -->
[![GitHub ★ 3,501](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C501&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xmanrui/dsh-im) [![npm 30d 130,158](https://img.shields.io/static/v1?label=npm+30d&message=130%2C158&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im)
<!-- END META -->

> **功能**：把多个即时通讯平台的机器人接入 DSH，会话消息和回复由各渠道适配器转发。

> **亮点**：[Q01](#research-q01) 让离开桌面的用户可在原聊天提交任务。[Q02](#research-q02) 把通道管理与生产连接拆开，一个通道启动失败时保留其他入口。

> **主要限制**：[Q03](#research-q03) 的群历史采集早于共享桥的回复门禁。即使没有回复，也要单独检查记录和清理。[Q04](#research-q04) 的主动回执不匹配会保留为结果未知。

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
  - [Q01 · IM 接入给远程等待和处理任务的人增加什么？](#detail-section-11)
  - [Q02 · 单通道故障怎样影响插件与其他通道？](#detail-section-12)
  - [Q03 · 哪些权限、留存和恢复成本决定能否试用？](#detail-section-13)
  - [Q04 · 如何验证远程交付不增加跨聊天误发？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有本地 DSH、想从手机提交任务并查看结果的人，先观察一个测试聊天。

以 DSH Web 的原生任务交互为基线。增加机器人带来远程入口，也多出身份、平台和会话映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 远程文本桥 | 从 Telegram 测试聊天提交 | 依赖机器人身份、访问策略与会话路由 |
| Web 管理 | 观察连接、配置与失败 | 管理端存在不证明连接可用 |
| 主动投递 | 向已核对的聊天发送 | 账号、目标、回执分别核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、连接与凭据服务 | 必需 | 宿主管理及任务 | 管理端可能报告未就绪 |
| Telegram 测试机器人和网络 | 代表通道必需 | 收发消息 | 先核 token 与权限 |
| 正确会话和访问策略 | 必需 | 限制测试任务与回复范围 | 停用，查原会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者用隔离 DSH 与单机器人 | 校对允许人和留存设置 |
| 对照 | 用允许与拒绝身份分别发测试文本 | 只预期聊天产生任务和结果 |
| 退出 | 停机器人、撤销凭据、检查测试记录 | 确认没有意外投递和留存 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号和模型额度未知 | 配置网络和访问策略 | 按渠道分别核对 |
| 持续 | 轮询、消息和存储费用未知 | 核留存和消息目标 | 群采集和回复是不同环节 |
| 失败及退出 | 重试成本未知 | 查回执、撤销和清理 | 未知投递先核平台 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远程入口 | 按聊天桥接任务 | 交付延迟和成功率 |
| 启动隔离 | 通道并发与失败处理 | 真实服务商断线恢复 |
| 留存边界 | 采集早于共享桥 | 部署实际保留与授权 |

> **思考**：[Q03](#research-q03) 的群历史采集早于共享桥的回复门禁。即使没有回复，也要单独检查记录和清理。[Q04](#research-q04) 的主动回执不匹配会保留为结果未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 让离开桌面的用户可在原聊天提交任务。[Q02](#research-q02) 把通道管理与生产连接拆开，一个通道启动失败时保留其他入口。

[Q02](#research-q02) 在连接可用前提供管理状态，错误路径清理生产连接。[Q04](#research-q04) 的主动投递比对目标和账号，回执不明仍需平台核实。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的群历史采集早于共享桥的回复门禁。即使没有回复，也要单独检查记录和清理。[Q04](#research-q04) 的主动回执不匹配会保留为结果未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先对单机器人私聊测试核允许身份和真实接收范围。群留存、文件和主动投递分别验收，发现目标错误时回原 Web。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核查 Telegram 代表链、管理接线和部分投递边界。平台兼容、真实隔离和延迟未执行。

- 已检查：作者 README、包清单、源码路径 README.md、src/channels/telegram/telegram-runtime.mjs、cordis.patch.yml、plugin-src/host/index.mjs、plugin-src/host/channels/telegram/index.mjs、plugin-src/host/channels/shared/startup.mjs、plugin-src/host/rpc-authority.mjs、src/channels/shared/text-harness-bridge.mjs、plugin-src/host/delivery-service.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查 Telegram 代表链和共用管理、投递代码。未运行各平台、模型或真实宿主。
- 下一步：按 [Q04](#research-q04) 在隔离聊天记录身份、消息 ID 和 DSH 会话，对照允许、拒绝和未知投递。

**分析版本**

- **仓库**：[xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)
- **版本号**：5.10.0（[固定提交 fc2ceab](https://github.com/xmanrui/dsh-im/tree/fc2ceab217309f8973afa03c58cdd8ff3e900130)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提议用两个测试聊天对照目标变化、重启和丢回执。不能保持消息落点或正确表达未知时，不扩大使用。

按 [Q04](#research-q04) 在隔离聊天记录身份、消息 ID 和 DSH 会话，对照允许、拒绝和未知投递。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 405 | 103563 | 90389 | 7480 | — |
| .md | source | 107 | 24921 | — | — | 490727 |
| .js | source | 93 | 51725 | 49143 | 1308 | — |
| .mjs | test | 312 | 137347 | 126327 | 2517 | — |
| .js | test | 4 | 575 | 549 | 8 | — |
| .mjs | example | 3 | 322 | 290 | 12 | — |
| .js | example | 2 | 78 | 73 | 5 | — |
| .md | example | 1 | 34 | — | — | 223 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/xmanrui/dsh-im/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH-IM 代表通道如何接入远程会话，如何核对实际消息、权限和交付边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · IM 接入给远程等待和处理任务的人增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已有本地 DSH 且常离开桌面的人，用一个 Telegram 测试机器人从手机发起短任务并在原聊天收结果。相对回到 Web 才能提交和查看，增量是将长轮询得到的更新、会话身份和异步消息桥连起来。Telegram 入站标准化保留聊天来源，按 conversationId 分队，再交给桥处理。任务是否完成仍需从 DSH 会话及平台实际消息核对。已经有可靠远程入口的人，额外机器人凭据和频道策略可能大于便利。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:96-96](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/README.md#L96-L96)

作者描述多个渠道及各自配置。

```text
通过扫码、App Manifest 或已有机器人凭据把 IM 机器人接入 DeepSeek Harness，并让本机 Harness 主动连接公网 AI Office。一个插件、一个设置入口，统一管理内置 IM 渠道和 AI Office Connector。**每个 IM 渠道都支持接入多个机器人**，各机器人的连接状态、工作区、模型和会话绑定彼此独立；iMessage 是本机 Messages.app 身份接入的例外，详见[iMessage 渠道说明](docs/imessage.md)。
```

**依据 2 · 源码核查**：[src/channels/telegram/telegram-runtime.mjs:1933-1949](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/src/channels/telegram/telegram-runtime.mjs#L1933-L1949)

真实 Telegram 长轮询和接收时上下文快照。

<details>
<summary>查看原文（17行）</summary>

```text
  async #poll(initialCursor, signal) {
    let cursor = initialCursor;
    while (!signal.aborted) {
      const updates = await this.#api.getUpdates({ offset: cursor, timeout: 25, signal });
      this.#status.lastCheckedAt = Date.now();
      if (signal.aborted) return;
      // All updates have arrived together; cursor persistence must not move the
      // settings boundary for the later messages in this received batch.
      const received = updates.map((update) => {
        const chatType = update?.message?.chat?.type
          ?? update?.callback_query?.message?.chat?.type;
        return {
          update,
          contextSnapshot: captureContextEnhancement(this.#contextEnhancement,
            chatType === 'private' ? 'direct'
              : chatType === 'group' || chatType === 'supergroup' ? 'group' : null),
        };
```

</details>

**依据 3 · 源码核查**：[src/channels/telegram/telegram-runtime.mjs:1821-1839](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/src/channels/telegram/telegram-runtime.mjs#L1821-L1839)

按会话队列准备并交给入站桥。

<details>
<summary>查看原文（19行）</summary>

```text
    let accepted = false;
    void this.#conversationQueue.run(message.conversationId, async () => {
      try {
        if (signal.aborted) return;
        if (needsPreparation) await this.#transcribeVoice(message, signal);
        if (signal.aborted) return;
        await captureGroupHistory(this.#groupHistory, message, groupHistoryEntry('telegram', update, message), {
          logger: this.#logger,
        });
        accepted = true;
        // The bridge owns turn ordering; awaiting it here would park the
        // conversation behind a turn that waits for the user.
        void this.#bridge.accept(message, { contextSnapshot }).catch((error) => {
          if (signal.aborted) return;
          this.#logger.error?.(
            `[dsh-im:telegram] bot ${this.#config.botId} message handling failed:`,
            extractConnectionEvidence(error).details,
          );
        });
```

</details>

#### 缺口

- 没有实际消息延迟或任务完成对照。
  **影响**：不能断言比原 Web 更快或更可靠。
  **进一步探讨**：用同一合成任务比较从发出到实际收到的时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 单通道故障怎样影响插件与其他通道？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根 Cordis 行加载宿主包，宿主需要连接、凭据和 Typert 网关，Web 设置由单独浏览器入口挂载。各通道并发启动，捕获单通道失败并保留其他渠道，全部失败才抛出聚合错误。Telegram 生产启动先注册管理 RPC，再构造生产控制器，初始化时返回结构化暂未就绪结果。准备成功后挂载真实 handler 并登记作用域清理。初始化失败时尝试注销投递适配和关闭生产连接，管理端保留失败解释。这有助于定位故障，不能从面板仍存在推断机器人可用。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/cordis.patch.yml#L1-L3)

真实根包挂载。

```text
- insert:
    - id: xmanrui-dsh-im
      name: '@xmanrui/dsh-im'
```

**依据 2 · 源码核查**：[plugin-src/host/index.mjs:36-51](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/index.mjs#L36-L51)

宿主依赖和通道配置合成。

<details>
<summary>查看原文（16行）</summary>

```text
export const inject = [
  'connection',
  'credentials',
  'typertGateway',
];

function channelConfig(config, name, deliveryService) {
  const channel = {
    ...(config.dshHome ? { dshHome: config.dshHome } : {}),
    ...(config.groupByAgentPreset === undefined ? {} : { groupByAgentPreset: config.groupByAgentPreset }),
    ...config[name],
  };
  const withAuthority = config.rpcAuthority === undefined
    ? channel
    : { ...channel, rpcAuthority: config.rpcAuthority };
  return name === 'office' ? withAuthority : { ...withAuthority, deliveryService };
```

</details>

**依据 3 · 源码核查**：[plugin-src/host/index.mjs:252-275](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/index.mjs#L252-L275)

并发启动、隔离失败和全部失败。

<details>
<summary>查看原文（24行）</summary>

```text
    const failures = [];
    // Each channel mounts its management RPC before awaiting initialization.
    // Start them together so a slow channel cannot leave later routes absent.
    await Promise.all(channels.map(async ([channel, start]) => {
      try {
        await start(ctx, channelConfig(config, channel, deliveryService));
      } catch (error) {
        failures.push(error);
        logger.error?.(`[dsh-im] failed to activate ${channel}; continuing with the remaining channels`, error);
      }
    }));
    if (failures.length === channels.length) {
      throw new AggregateError(failures, 'dsh-im failed to activate every channel');
    }
    if (typeof ctx?.on === 'function') {
      try {
        startSessionSync(ctx, deliveryService, {
          logger,
          inputScope: ctx.root ?? ctx,
          config,
        });
        installDsBotQuestionSync(ctx, deliveryService, { logger });
      } catch (error) {
        logger.error?.('[dsh-im] failed to activate Session sync; continuing with channels', error);
```

</details>

**依据 4 · 源码核查**：[plugin-src/host/channels/telegram/index.mjs:8-17](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/channels/telegram/index.mjs#L8-L17)

实际 Telegram 生产入口。

<details>
<summary>查看原文（10行）</summary>

```text
export async function apply(ctx, config = {}) {
  if (config?.controller) {
    return installTelegramRpc(ctx, config.controller, config.rpcAuthority);
  }
  return installProductionChannel(ctx, config, {
    channel: 'telegram',
    rpcChannel: TELEGRAM_RPC_CHANNEL,
    createProduction: () => createProductionController(ctx, config, config.internals ?? {}),
    createHandler: controller => createTelegramRpcHandler(controller),
  });
```

</details>

**依据 5 · 源码核查**：[plugin-src/host/channels/shared/startup.mjs:28-74](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/channels/shared/startup.mjs#L28-L74)

先挂管理 RPC，接通生产 handler，失败和卸载清理。

<details>
<summary>查看原文（47行）</summary>

```text
/** Mount the native management RPC before any fallible production initialization. */
export async function installProductionChannel(ctx, config, {
  channel, rpcChannel, createProduction, createHandler, reportStartupError,
}) {
  let startupError = publicChannelInitializing(channel);
  let handler = async () => ({ ok: false, error: startupError });
  const logger = typeof ctx.logger === 'function' ? ctx.logger(`dsh-im:${channel}`) : (ctx.logger ?? console);
  const diagnostics = createConnectionDiagnostics({ channel, logger });
  const disposeRpc = registerManagementRpc(ctx, rpcChannel, async (endpoint, payload, signal) => {
    if (signal?.aborted) {
      return { ok: false, error: { code: 'cancelled', message: 'The request was cancelled.', details: {} } };
    }
    try { return await handler(endpoint, payload, signal); }
    catch (error) {
      // Preserve a final Host diagnostic if an endpoint misses its own catch.
      return diagnosticRpcResult(diagnostics, error, { ok: false, error: { code: `${channel}-operation-failed` } }, { operation: endpoint });
    }
  }, { authority: resolveRpcAuthority(config.rpcAuthority) });
  let production;
  let unregisterDelivery;
  let closing;
  const closeProduction = () => (closing ??= (async () => {
    try {
      await unregisterDelivery?.();
    } finally {
      await production?.close();
    }
  })());
  try {
    production = await createProduction();
    unregisterDelivery = config.deliveryService && production.deliveryAdapter
      ? config.deliveryService.registerAdapter(production.deliveryAdapter) : undefined;
    const readyHandler = createHandler(production.controller);
    ctx.effect(() => closeProduction, `dsh-im: close ${channel} connections`);
    followHostLanguage(ctx, channel, production.controller, logger);
    handler = readyHandler;
  } catch (error) {
    startupError = reportStartupError
      ? reportStartupError(error, false)
      : diagnostics.report(error, { operation: 'startup', stage: 'startup.load', publicError: publicChannelStartupError(channel, error) }).publicError;
    try {
      await closeProduction();
    } catch (cleanupError) {
      if (reportStartupError) reportStartupError(cleanupError, true);
      else diagnostics.report(cleanupError, { operation: 'startup', stage: 'connection.stop', warning: true });
    }
  }
```

</details>

#### 缺口

- 真实失败重启和账号生命周期未跑。
  **影响**：源码中的清理不能证明外部机器人实际断线。
  **进一步探讨**：以失效 Token 和正常 Token 各一份检查加载及连接状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些权限、留存和恢复成本决定能否试用？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

管理 RPC 默认选择 trusted-host，依赖宿主浏览器认证和 Host/Origin 判断。Telegram 活动消息链在共享桥中区分未寻址群消息、用户和命令权限，旧 telegramInboundAllowed 函数不可当真实活动调用。群历史采集发生在桥的 accept 之前，所以只关回复或看到入站策略拒绝，不能证明没有采集。作者称默认启用并有滚动留存，仍需独立核对实际设置、平台能收到什么和清理结果。

优先用隔离 DSH、测试账号、单机器人和仅私聊允许人群试一条无敏感内容的文本。先验证错误身份不触发任务，不把群历史和文件回传纳入首轮试用。平台授权、消息额度、模型费、日志清理和失败重启都需承担，实际金额未知。消息或回执无法对上预期聊天、权限拒绝不生效时，应停用测试机器人，撤销凭据并回到 DSH Web。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/rpc-authority.mjs:1-12](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/rpc-authority.mjs#L1-L12)

默认管理请求依赖宿主信任边界。

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

**依据 2 · 源码核查**：[src/channels/shared/text-harness-bridge.mjs:329-375](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/src/channels/shared/text-harness-bridge.mjs#L329-L375)

实际桥的群触发和权限判断。

<details>
<summary>查看原文（47行）</summary>

```text
  accept(message, { contextSnapshot, accessDecision, busyMessageMode } = {}) {
    if (this.#signal?.aborted) return Promise.resolve();
    const conversationId = cleanText(message?.conversationId);
    const kind = message?.kind === 'group' ? 'group' : 'direct';
    const normalized = { ...message, kind, conversationId };
    const messageId = cleanText(normalized.messageId);
    const senderId = cleanText(normalized.senderId);
    if (!messageId || !senderId || !conversationId || normalized.senderIsBot === true
      || this.#state.hasSeen(messageId) || this.#acceptedMessageIds.has(messageId)) {
      return Promise.resolve();
    }
    // Preserve the channel trigger boundary. Access policy never turns an
    // unaddressed group message into a denial reply.
    if (kind === 'group' && normalized.addressed !== true) {
      this.#status.messagesRejected += 1;
      this.#status.lastRejectedAt = new Date().toISOString();
      this.#acceptedMessageIds.set(messageId, null);
      return this.#finishLocalMessage(normalized, messageId, null);
    }
    if (this.#accessPolicy || accessDecision) {
      const hasImages = hasInboundImages(normalized);
      const hasFiles = hasInboundFiles(normalized);
      const decision = accessDecision ?? evaluateInboundAccess(this.#accessPolicy, {
        conversationType: kind,
        senderIds: [senderId, cleanText(normalized.senderAlternateId)].filter(Boolean),
        // The same control text the command runner below parses. A channel may
        // decorate `content` for the model (email prepends the mail headers), and
        // a decorated body never looks like a command — so reading `content` here
        // recognized no command at all and skipped the command-permission gate.
        text: controlTextOf(normalized),
        hasImages,
        hasFiles,
      });
      if (!decision.allowed) {
        this.#status.messagesRejected += 1;
        this.#status.lastRejectedAt = new Date().toISOString();
        // Mark policy denials so a webhook replay cannot repeat local work or
        // a command-permission notice.
        this.#acceptedMessageIds.set(messageId, null);
        return this.#finishLocalMessage(
          normalized,
          messageId,
          decision.reason === 'command-not-allowed'
            ? t(COMMAND_PERMISSION_DENIED_MESSAGE)
            : null,
          { recordReceived: decision.reason === 'command-not-allowed' },
        );
```

</details>

**依据 3 · 源码核查**：[src/channels/telegram/telegram-runtime.mjs:1822-1839](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/src/channels/telegram/telegram-runtime.mjs#L1822-L1839)

群历史采集在共享桥入站判定前。

<details>
<summary>查看原文（18行）</summary>

```text
    void this.#conversationQueue.run(message.conversationId, async () => {
      try {
        if (signal.aborted) return;
        if (needsPreparation) await this.#transcribeVoice(message, signal);
        if (signal.aborted) return;
        await captureGroupHistory(this.#groupHistory, message, groupHistoryEntry('telegram', update, message), {
          logger: this.#logger,
        });
        accepted = true;
        // The bridge owns turn ordering; awaiting it here would park the
        // conversation behind a turn that waits for the user.
        void this.#bridge.accept(message, { contextSnapshot }).catch((error) => {
          if (signal.aborted) return;
          this.#logger.error?.(
            `[dsh-im:telegram] bot ${this.#config.botId} message handling failed:`,
            extractConnectionEvidence(error).details,
          );
        });
```

</details>

**依据 4 · 作者声明**：[README.md:137-143](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/README.md#L137-L143)

作者声明默认采集和留存范围。

```text
### 群聊天记录与群文件

WhatsApp、飞书、Telegram、Discord、Slack、QQ 支持自动保存实际收到的群消息和附件，包括平台允许接收的未 @ 消息。采集默认开启，保存本身不触发模型回复；在群内 @ 机器人即可按需查询聊天记录、总结讨论或读取文件。

记录按群共享，独立于机器人、AI 会话和工作区，默认滚动保留 **14 天**。可在 **DSH 设置 → IM机器人 → 齿轮「通用设置」→ 通用** 修改保留天数。只保存实际接收的内容，不回填完整历史；QQ 当前按应用来源隔离，Discord 线程独立保存。

详见[群消息记录与群文件使用指南](docs/group-history.md)：包含六渠道权限与设置步骤、查询示例、存储位置、文件限制和排查方法。WhatsApp、飞书、QQ 已完成文字及文本附件实测；Telegram 已完成文字实测，文件暂未验证；Discord、Slack 待真实群验收。
```

#### 缺口

- 未验真实 Telegram 策略、历史落盘和管理访问授权。
  **影响**：单账号试用不证明共享配置安全。
  **进一步探讨**：在两个测试身份下逐一检查私聊、群回复、采集和撤销。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证远程交付不增加跨聊天误发？

**研究主题**：新假设与验证

#### 完整回答

假设在一个专用机器人和明确聊天目标下，远程提交能减少往返 Web 操作，并在重启后保留清楚的投递状态。检查投递服务用于主动文字发送的账号指纹、目标摘要、适配注册与可选回执。回执格式或聊天对不上时可返回结果未知。设计两个测试聊天交错提交同样的短任务，加入一次服务重启、一次目标变化和一次发送后丢回执。比较原 Web 和 IM 的完成时间、消息落点、未知状态和重复。如果出现错误聊天收到内容或把未知写成未发送并再投一次，就不支持扩大使用。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/delivery-service.mjs:716-737](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/plugin-src/host/delivery-service.mjs#L716-L737)

受检主动投递与不匹配回执。

<details>
<summary>查看原文（22行）</summary>

```text
      if (digest !== expectedTargetDigest) throw deliveryError('target-changed');
      const account = await adapter.describeAccount(id);
      if (account?.version !== 1 || !account.capabilities?.includes('proactive-text-checked')) {
        throw deliveryError('capability-unavailable');
      }
      if (account.account?.fingerprint !== expectedFingerprint) throw deliveryError('account-changed');
      if (receipt && (!account.capabilities?.includes('proactive-receipt-checked') || target.kind !== 'group'))
        throw deliveryError('capability-unavailable');
      const beforeSend = () => {
        cancellation(signal);
        this.#assertRegistered(registration);
      };
      beforeSend();
      const result = await adapter.sendText(id, target, text, { signal, expectedFingerprint, beforeSend,
        ...(receipt ? { receipt: true } : {}),
        ...(format === 'markdown' ? { format } : {}) });
      if (!receipt) return { sent: true };
      if (result?.sent !== true || result.receipt?.version !== 1
        || typeof result.receipt.messageId !== 'string' || !result.receipt.messageId || result.receipt.messageId.length > 512
        || result.receipt.conversationId !== target.route.chatId)
        throw deliveryError('send-result-unknown');
      return { sent: true, receipt: { version: 1, messageId: result.receipt.messageId, conversationId: result.receipt.conversationId } };
```

</details>

**依据 2 · 源码核查**：[src/channels/telegram/telegram-runtime.mjs:1821-1844](https://github.com/xmanrui/dsh-im/blob/fc2ceab217309f8973afa03c58cdd8ff3e900130/src/channels/telegram/telegram-runtime.mjs#L1821-L1844)

异步桥接及部分待处理消息记录。

<details>
<summary>查看原文（24行）</summary>

```text
    let accepted = false;
    void this.#conversationQueue.run(message.conversationId, async () => {
      try {
        if (signal.aborted) return;
        if (needsPreparation) await this.#transcribeVoice(message, signal);
        if (signal.aborted) return;
        await captureGroupHistory(this.#groupHistory, message, groupHistoryEntry('telegram', update, message), {
          logger: this.#logger,
        });
        accepted = true;
        // The bridge owns turn ordering; awaiting it here would park the
        // conversation behind a turn that waits for the user.
        void this.#bridge.accept(message, { contextSnapshot }).catch((error) => {
          if (signal.aborted) return;
          this.#logger.error?.(
            `[dsh-im:telegram] bot ${this.#config.botId} message handling failed:`,
            extractConnectionEvidence(error).details,
          );
        });
      } finally {
        // A cancelled prepare keeps the record: the next start replays it.
        if (needsPreparation && accepted) {
          await this.#state.removePendingMessage(pendingId).catch(() => {});
        }
```

</details>

#### 缺口

- 没有模拟丢回执或真实平台交付对照。
  **影响**：不能推断所有渠道具有等价交付保证。
  **进一步探讨**：记录平台消息 ID、目标账号与 DSH 会话，单独复核未知结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
