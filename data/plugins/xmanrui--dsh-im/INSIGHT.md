# dsh-im

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[14f8648](https://github.com/xmanrui/dsh-im/tree/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c)

<!-- BEGIN META -->
[![GitHub ★ 3,023](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C023&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xmanrui/dsh-im) [![npm 30d 79,244](https://img.shields.io/static/v1?label=npm+30d&message=79%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@xmanrui/dsh-im)
<!-- END META -->

> **功能**：把即时通讯机器人与本机 DSH 会话和工作区连接。

> **亮点**：[Q02](#research-q02) 把 IM 消息映射到 DSH 工作区会话并回传，减少单独搭桥工作；不保证所有渠道具备相同能力。

> **主要限制**：[Q03](#research-q03) 部分交付、未知结果及文件读取范围使目标、权限与平台记录核验必要。

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
  - [Q01 · 谁用它以及依赖什么？](#detail-section-11)
  - [Q02 · 一条 QQ 消息如何到会话并回传？](#detail-section-12)
  - [Q03 · 故障和访问边界是什么？](#detail-section-13)
  - [Q04 · 成本和可验证改进假设是什么？](#detail-section-14)
  - [Q05 · 如何试用与退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 用户希望从授权 IM 私聊操作本机 DSH，并把结果回到正确会话。

用户可直接使用 DSH 本地界面，或自行维护独立机器人桥接和平台权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| IM 会话桥接 | 接收消息并调用 DSH 会话 | 依赖平台凭据、访问策略和正确绑定 |
| 结果回传 | 向目标聊天发送文本或附件 | 平台权限与发送结果不确定，部分交付需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与工作区 | 必需 | 创建和使用会话 | 无法完成工作 |
| 平台机器人、凭据与网络 | 对相应渠道必需 | 接收和发送消息 | 无法连接或投递 |
| 平台权限与访问策略 | 必需 | 限制聊天和功能 | 无法接收、误授权或发送失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户设置机器人和访问权限 | 确认身份与工作区 |
| 测试 | 在私聊中发非敏感消息 | 正确会话生成可核对回复 |
| 故障 | 暂停并检查平台与 DSH 状态 | 结果未知时不盲目重发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 平台和模型费用视配置 | 凭据、权限、工作区设置 | 耗时未知 |
| 持续使用 | 模型与网络资源 | 凭据轮换和运行维护 | 单任务成本未知 |
| 失败恢复 | 排查及重试成本 | 对账会话和平台记录 | 重复与误投风险未知 |
| 退出 | 回到本地 DSH | 停止连接与处理凭据 | 不撤销已发送消息 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 远程会话 | QQ 消息绑定和发问源码 | 实际端到端可靠性 |
| 结果回传 | 流式回退、附件及回执处理 | 所有平台效果一致 |

> **思考**：[Q03](#research-q03) 部分交付、未知结果及文件读取范围使目标、权限与平台记录核验必要。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把 IM 消息映射到 DSH 工作区会话并回传，减少单独搭桥工作；不保证所有渠道具备相同能力。

[Q02](#research-q02) 共享会话层处理绑定，[Q03](#research-q03) 提交前标记和不确定发送处理有明确边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 部分交付、未知结果及文件读取范围使目标、权限与平台记录核验必要。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在非敏感私聊和固定工作区试用，结果未知时暂停并对账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

QQ 源码支持消息与会话的双向接线；其他渠道和实际平台交付未逐一运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、plugin-src/host/channels/qq/index.mjs、plugin-src/host/channels/qq/production.mjs、src/channels/qq/qq-bridge.mjs、src/channels/shared/workspace-session.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查，重点追踪 QQ 路径，未对全部平台或真实连接做验收。
- 下一步：使用隔离工作区与测试机器人，核查来源授权、会话绑定和平台回执；不发送真实敏感文件。

**分析版本**

- **仓库**：[xmanrui/dsh-im](https://github.com/xmanrui/dsh-im)
- **版本号**：5.9.1（[固定提交 14f8648](https://github.com/xmanrui/dsh-im/tree/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 会话发送前展示目标和文件范围或能减少误投；需要对照实验，尚未验证。

使用隔离工作区与测试机器人，核查来源授权、会话绑定和平台回执；不发送真实敏感文件。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 395 | 99149 | 86816 | 6828 | — |
| .md | source | 106 | 24762 | — | — | 484661 |
| .js | source | 92 | 50523 | 47984 | 1289 | — |
| .mjs | test | 299 | 132088 | 121736 | 2366 | — |
| .js | test | 4 | 575 | 549 | 8 | — |
| .mjs | example | 3 | 322 | 290 | 12 | — |
| .js | example | 2 | 78 | 73 | 5 | — |
| .md | example | 1 | 34 | — | — | 223 |

</details>

**活跃度**

[![Issue 未关闭 68](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=68&color=737b86&logo=github)](https://github.com/xmanrui/dsh-im/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 IM 消息如何进入 DSH 会话并回传，以及访问、绑定和投递失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁用它以及依赖什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

插件面向希望通过 IM 与本机 DSH 交互的用户，声明支持多机器人、多工作区和多个平台。合格的使用结果是授权聊天对应正确工作区与会话、得到可核对的回复；目标用户必须能管理机器人凭据、权限、网络和本机 DSH。包声明 Node >=22.19、DSH Web 集成及多个平台 SDK。不同平台能力和权限各异，源码存在不等于真实连接成功。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:82-96](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/README.md#L82-L96)

安装入口及多机器人工作区说明。

<details>
<summary>查看原文（15行）</summary>

````text
> 选择对应的一条命令：**Desktop** 在内置终端执行，**Web** 在启动当前 Harness 的终端执行。
>
> ```sh
> dsh plugin --profile desktop add -w @xmanrui/dsh-im
> ```
>
> ```sh
> dsh plugin --profile web add -w @xmanrui/dsh-im
> ```
>
> 安装后重启 Desktop 或 `dsh web`，Web 刷新浏览器，再打开「设置 → IM机器人」。

## 简介

通过扫码、App Manifest 或已有机器人凭据把 IM 机器人接入 DeepSeek Harness，并让本机 Harness 主动连接公网 AI Office。一个插件、一个设置入口，统一管理内置 IM 渠道和 AI Office Connector。**每个 IM 渠道都支持接入多个机器人**，各机器人的连接状态、工作区、模型和会话绑定彼此独立；iMessage 是本机 Messages.app 身份接入的例外，详见[iMessage 渠道说明](docs/imessage.md)。
````

</details>

**依据 2 · 源码核查**：[package.json:76-100](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/package.json#L76-L100)

DSH 集成及 Node 条件。

<details>
<summary>查看原文（25行）</summary>

```text
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    },
    "compatibility": {
      "dsh": "0.2.1-rc.2",
      "dshReleases": {
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible"
      },
      "profiles": [
        "web"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[package.json:107-125](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/package.json#L107-L125)

平台依赖。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": ">=22.19"
  },
  "dependencies": {
    "@matrix-org/olm": "3.2.15",
    "@tencent-connect/qqbot-connector": "1.2.0",
    "@tencent-connect/qqbot-nodejs": "1.0.4",
    "@wecom/aibot-node-sdk": "1.0.7",
    "dingtalk-stream": "2.1.4",
    "imapflow": "^2.0.5",
    "mailparser": "^3.9.43",
    "nodemailer": "^10.1.4",
    "qrcode": "1.5.4",
    "undici": "7.30.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@larksuiteoapi/node-sdk": "1.73.0",
    "@whiskeysockets/baileys": "7.0.0-rc14",
```

</details>

#### 缺口

- 目标平台配置和真实连接未知
  **影响**：不能判断可用性
  **进一步探讨**：用测试机器人及非敏感工作区验收

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一条 QQ 消息如何到会话并回传？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

QQ Host 插件注入 connection、credentials 和 typertGateway，生产控制器加载配置和每机器人状态，建立 Harness 与工作区作用域。QQ bridge 对消息 ID、发送者、群聊类型和重复状态进行筛选，再按访问策略或旧 owner 规则处理；接收后，在发送给 Harness 前记录已消费和已提交，避免崩溃时重放可能已提交的请求。共享会话逻辑按聊天绑定或创建工作区会话，并防范工作区切换造成旧会话误投；接着发问，结果优先流式回复，失败可回退 Markdown，文件单独交付并产生回执。相比独立机器人脚本，增量是接入既有 DSH 会话与工作区并封装一条双向链路；QQ 的实现不能代表其他渠道逐一验证。

#### 证据与依据

**依据 1 · 源码核查**：[plugin-src/host/channels/qq/index.mjs:1-16](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/plugin-src/host/channels/qq/index.mjs#L1-L16)

QQ Host 插件和生产控制器入口。

<details>
<summary>查看原文（16行）</summary>

```text
import { createProductionController } from './production.mjs';
import { createQqRpcHandler, installQqRpc, QQ_RPC_CHANNEL } from './rpc.mjs';
import { installProductionChannel } from '../shared/startup.mjs';

export const name = 'dsh-im-qq-host';
export const inject = ['connection', 'credentials', 'typertGateway'];

export async function apply(ctx, config = {}) {
  if (config?.controller) {
    return installQqRpc(ctx, config.controller, config.rpcOptions, config.rpcAuthority);
  }
  return installProductionChannel(ctx, config, {
    channel: 'qq',
    rpcChannel: QQ_RPC_CHANNEL,
    createProduction: () => createProductionController(ctx, config, config.internals),
    createHandler: controller => createQqRpcHandler(controller, config.rpcOptions),
```

</details>

**依据 2 · 源码核查**：[plugin-src/host/channels/qq/production.mjs:47-70](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/plugin-src/host/channels/qq/production.mjs#L47-L70)

凭据、配置和工作区加载。

<details>
<summary>查看原文（24行）</summary>

```text
export async function createProductionController(ctx, config = {}, internals = {}) {
  if (!ctx?.credentials) throw new TypeError('dsh-im QQ requires ctx.credentials');
  const connection = harnessConnection(ctx, config, { competitiveApprovals: true });

  const ConfigStore = internals.ConfigStore ?? QqConfigStore;
  const StateStore = internals.StateStore ?? QqStateStore;
  const Harness = internals.HarnessClient ?? QqHarnessClient;
  const Controller = internals.Controller ?? QqController;
  const Runtime = internals.Runtime ?? QqRuntime;
  const QrAuth = internals.QrAuth ?? QqQrAuth;
  const createSupervisor = internals.createConnectionSupervisor ?? createConnectionSupervisor;
  const logger = typeof ctx.logger === 'function' ? ctx.logger('dsh-im:qq') : (ctx.logger ?? console);
  const agentPresetCatalog = () => listAgentPresetCatalog(ctx);
  const paths = pluginPaths(config);
  const configStore = await new ConfigStore(paths.config).load();
  const { defaultWorkspace, ungroupedWorkspace } = await prepareBotWorkspace(config);
  const WorkspaceStore = internals.WorkspaceStore ?? BotWorkspaceStore;
  const workspaces = internals.workspaces
    ?? await new WorkspaceStore(paths.workspaces, { defaultWorkspace, ungroupedWorkspace, groupByAgentPreset: config.groupByAgentPreset }).load();
  const configuredBots = configStore.list();
  await workspaces.reconcile(configuredBots.map((bot) => bot.botId));
  await Promise.all(configuredBots.map((bot) => workspaces.ensure(bot.botId, {
    defaultAgentPreset: config.agentPreset,
    initialAccessPolicy: initialAccessPolicyFor('qq', bot),
```

</details>

**依据 3 · 源码核查**：[src/channels/qq/qq-bridge.mjs:561-598](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L561-L598)

去重与访问判断。

<details>
<summary>查看原文（38行）</summary>

```text
  #accept(message) {
    if (this.#signal?.aborted) return Promise.resolve();
    const messageId = nonEmptyString(message?.messageId);
    const sender = nonEmptyString(message?.senderId);
    if (!messageId || !sender || message?.senderIsBot === true
      || !['c2c', 'group'].includes(message?.kind)
      || this.#state.hasSeen(messageId)
      || this.#acceptedMessageIds.has(messageId)) return Promise.resolve();
    message = normalizeQqMentions(message, new Set([this.#bot.appId]));
    const key = conversationKey(message);
    const addressed = isQqMessageAddressed(message);
    const commandText = safeText(message);
    const menuTextOnly = !hasQqImageAttachments(message) && !hasQqFileAttachments(message)
      && !qqReplyReference(message);
    const explicitMenu = menuTextOnly && isQqMenuCommand(commandText);
    const numericMenu = menuTextOnly && /^\d{1,2}$/u.test(commandText)
      && this.#menus.has(key, sender)
      && !this.#pendingInteractions.has(key) && !this.#approvals.hasPending(key)
      && this.#batchInputs.status(key).phase === 'idle';
    const menuInput = numericMenu
      ? `/m pick ${this.#menus.tokenFor(key, sender)} ${commandText}` : commandText;
    if (addressed) {
      const access = this.#accessPolicy
        ? evaluateInboundAccess(this.#accessPolicy, {
            conversationType: message.kind === 'c2c' ? 'direct' : 'group',
            senderIds: sender,
            text: commandText,
            hasImages: hasQqImageAttachments(message),
            hasFiles: hasQqFileAttachments(message),
            ...(explicitMenu || numericMenu || isPermissionCommand(commandText) ? { isCommand: true } : {}),
          })
        : senderAllowed(message, this.#ownerUserOpenid)
          ? { allowed: true, reason: 'legacy-owner' }
          : { allowed: false, reason: 'sender-not-allowed' };
      if (!access.allowed) {
        this.#acceptedMessageIds.set(messageId, null);
        return this.#finishAccessDecision(message, messageId, access);
      }
```

</details>

**依据 4 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1314-1341](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1314-L1341)

提交标记与会话请求。

<details>
<summary>查看原文（28行）</summary>

```text
        // Persist consumption before handing the prompt to Harness. Provider
        // redelivery after a failed error notice must never execute it twice.
        await markMessageSeen();
        // The prompt is about to enter the Harness inbox, which is itself
        // durable. Marking the entry submitted first means a crash after this
        // point reports the message instead of replaying a turn the Harness may
        // already own.
        await this.#markPendingSubmitted(key, messageId);
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
          onNotice: (notice) => this.#bot.sendText(target, notice),
          deferredDelivery: () => ({ coordinator: this.#deferred, target: deferredQqTarget(message, target, acceptedAt) }),
          harness: this.#harness,
          state: this.#state,
          key,
          text,
          content,
          titleText: batchSubmission?.title,
          sourceGuidance: snapshot?.config?.guidance,
          contextEnhanced,
          createOptions: { signal: this.#signal },
          existsOptions: { signal: this.#signal },
          askOptions: {
            groupHistory: message.groupHistory,
            timeoutMs: this.#replyTimeoutMs,
            signal: this.#signal,
            control: { owner: this, key },
            progressMode: 'all',
            finalAnswerOnly: true,
```

</details>

**依据 5 · 源码核查**：[src/channels/shared/workspace-session.mjs:137-159](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/shared/workspace-session.mjs#L137-L159)

会话创建与绑定失败回滚。

<details>
<summary>查看原文（23行）</summary>

```text
          // Name the Session here and bind it *before* creating it. Prompt
          // assembly runs inside creation, and a subscriber that resolves the
          // conversation by session id can only answer if the conversation owns
          // the id by then.
          // A Harness that accepts a caller-chosen id lets the binding exist
          // before the Session does; anything else keeps the old order.
          const plannedSessionId = harness?.canChooseSessionId === true ? `session-${randomUUID()}` : null;
          const previousSessionId = plannedSessionId === null ? null : state.sessionFor(key) ?? null;
          if (plannedSessionId !== null && await state.setSession(key, plannedSessionId) === false) return null;
          try {
            sessionId = await createSession(harness, {
              conversationKey: key,
              ...(plannedSessionId === null ? {} : { sessionId: plannedSessionId }),
              ...(createOptions ?? {}),
            });
          } catch (error) {
            // The binding must not outlive a Session that was never created, and a
            // failed replacement must leave the previous binding in place.
            if (plannedSessionId !== null) {
              if (previousSessionId === null) await state.clearSession?.(key);
              else await state.setSession(key, previousSessionId);
            }
            throw error;
```

</details>

**依据 6 · 源码核查**：[src/channels/shared/workspace-session.mjs:167-189](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/shared/workspace-session.mjs#L167-L189)

切换代次检测。

<details>
<summary>查看原文（23行）</summary>

```text
          // Binding committed: capture the conversation's effective-workspace
          // generation together with the session, so the prompt below is fenced
          // against a conversation switch that only commits after the bind.
          const conversationGeneration = readConversationGeneration(harness, key);
          session = workspaceSession(harness, sessionId, key);
          if (initialTitle && typeof session.renameTitle === 'function') {
            try {
              await session.renameTitle(initialTitle, renameOptions);
            } catch (error) {
              if (error?.code === WORKSPACE_SESSION_STALE || renameOptions?.signal?.aborted) {
                throw error;
              }
              console.warn('[dsh-im] unable to set the initial Session title:', error?.message ?? error);
            }
          }
          // A switch that committed while the title was being set has already
          // cleared the mapping and must not receive this prompt.
          if (conversationGenerationMoved(harness, key, conversationGeneration)) {
            throw workspaceSessionStaleError();
          }
          return { sessionId, session, recovered: replacingUnreadable };
        }
        return { sessionId, session };
```

</details>

**依据 7 · 源码核查**：[src/channels/shared/workspace-session.mjs:212-245](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/shared/workspace-session.mjs#L212-L245)

通过绑定会话发问。

<details>
<summary>查看原文（34行）</summary>

```text
      let answer;
      // Prepare session-dependent context after binding, outside the binding
      // lock. A stale-workspace retry must prepare it for the new session too.
      const prompt = prepareContent
        ? await prepareContent({ sessionId: binding.sessionId, content, text })
        : content ?? text;
      try {
        // An alternate Harness adapter may not supply finer ask() diagnostics.
        diagnostic.stage = 'operation';
        diagnostic.submissionState = 'unknown';
        answer = await binding.session.ask(prompt, artifactOptions);
      } catch (error) {
        if (error?.code === 'harness-reply-timeout' && deferredDelivery) {
          try {
            const { coordinator, ...destination } = deferredDelivery();
            await coordinator.trackTimeout(error, { ...destination, key, sessionId: binding.sessionId });
          } catch (registrationError) {
            console.warn('[dsh-im] unable to persist deferred delivery:', registrationError.message);
          }
        }
        throw error;
      }
      return {
        sessionId: binding.sessionId,
        answer,
        ...(artifacts.length > 0 ? { artifacts } : {}),
      };
    } catch (error) {
      const failure = messageDiagnosticError(error, diagnostic);
      // Retry once, only with positive evidence that no prompt was submitted.
      // The binding lock rechecks identity so a concurrent /new or workspace
      // switch cannot be overwritten by recovery of the previous Session.
      if (!unreadableSessionId && !dsBotSession && diagnostic.sessionId
        && error?.code === 'session-unreadable'
```

</details>

**依据 8 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1374-1432](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1374-L1432)

流式回退、附件和交付回执。

<details>
<summary>查看原文（59行）</summary>

```text
      this.#signal?.throwIfAborted();
      const answerText = answerTextForDelivery(answer, artifacts);
      const displayAnswer = toolErrors.length > 0
        ? `${answerText}\n\n---\n\n${toolErrors.join('\n\n')}`
        : answerText;
      let textReceipt = null;
      let textSendError = null;
      try {
        let streamFinished = false;
        if (stream) {
          try {
            await stream.update(displayAnswer);
            streamFinished = true;
            textReceipt = createDeliveryReceipt({
              deliveryId: messageId,
              presentation: 'qq-text',
              providerMessageIds: providerMessageIdsFor(stream),
            });
            try {
              await stream.complete();
            } catch (error) {
              this.#logger.warn?.('[dsh-im:qq] QQ stream completion failed after visible final content:', error);
            }
          } catch (error) {
            stream.cancel?.();
            this.#logger.warn?.('[dsh-im:qq] QQ stream update failed; using markdown fallback:', error);
          }
        }
        if (!streamFinished) {
          const deliveries = await sendMarkdownReply(this.#bot, target, displayAnswer, {
            logger: this.#logger,
          });
          textReceipt = createDeliveryReceipt({
            deliveryId: messageId,
            presentation: 'qq-text',
            providerMessageIds: deliveries.flatMap((delivery) => providerMessageIdsFor(delivery)),
          });
        }
      } catch (error) {
        textSendError = channelDeliveryFailure(error);
        this.#logger.warn?.('[dsh-im:qq] final text delivery failed; continuing with result files:', error);
      }
      const delivery = await this.#deliverArtifacts(target, messageId, artifacts, textReceipt);
      const artifactDispatched = delivery.receipt?.artifacts?.some(
        ({ outcome }) => outcome === 'sent' || outcome === 'unknown',
      );
      if (textSendError && !artifactDispatched && !delivery.failureNoticeVisible) {
        throw textSendError;
      }
      if (textSendError && delivery.artifactSendErrors === 0) {
        setLastMessageFailure(this.#status, textSendError);
      }
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
      if (!textSendError && delivery.artifactSendErrors === 0) {
        clearLastMessageFailure(this.#status);
      }
      return delivery.receipt;
```

</details>

#### 缺口

- QQ 平台连接和 DSH 会话交互未实际运行
  **影响**：无法证明端到端交付
  **进一步探讨**：使用自有测试机器人验证一次消息和会话映射

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 故障和访问边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

QQ 的重复消息筛选和提交前持久标记是减少重放的措施，并非全链路恰好一次：崩溃或发送结果未知仍需核对平台与会话记录。发送文本失败后代码继续尝试附件，最终结果可能是部分交付；流式失败回退可能改变表现。作者说明延迟交付对不确定发送不自动重试以避免重复，文件回传可读取 Harness 能访问的文件，插件不另设工作区来源边界；这扩大了配置错误或会话授权不当时的数据暴露面。渠道能力、权限和回执语义各不相同，不应泛化为统一安全保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/qq/qq-bridge.mjs:561-568](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L561-L568)

基于消息 ID 的重复过滤。

```text
  #accept(message) {
    if (this.#signal?.aborted) return Promise.resolve();
    const messageId = nonEmptyString(message?.messageId);
    const sender = nonEmptyString(message?.senderId);
    if (!messageId || !sender || message?.senderIsBot === true
      || !['c2c', 'group'].includes(message?.kind)
      || this.#state.hasSeen(messageId)
      || this.#acceptedMessageIds.has(messageId)) return Promise.resolve();
```

**依据 2 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1314-1322](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1314-L1322)

提交前标记与重放权衡。

```text
        // Persist consumption before handing the prompt to Harness. Provider
        // redelivery after a failed error notice must never execute it twice.
        await markMessageSeen();
        // The prompt is about to enter the Harness inbox, which is itself
        // durable. Marking the entry submitted first means a crash after this
        // point reports the message instead of replaying a turn the Harness may
        // already own.
        await this.#markPendingSubmitted(key, messageId);
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
```

**依据 3 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1397-1429](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1397-L1429)

文本回退和部分交付分支。

<details>
<summary>查看原文（33行）</summary>

```text
          } catch (error) {
            stream.cancel?.();
            this.#logger.warn?.('[dsh-im:qq] QQ stream update failed; using markdown fallback:', error);
          }
        }
        if (!streamFinished) {
          const deliveries = await sendMarkdownReply(this.#bot, target, displayAnswer, {
            logger: this.#logger,
          });
          textReceipt = createDeliveryReceipt({
            deliveryId: messageId,
            presentation: 'qq-text',
            providerMessageIds: deliveries.flatMap((delivery) => providerMessageIdsFor(delivery)),
          });
        }
      } catch (error) {
        textSendError = channelDeliveryFailure(error);
        this.#logger.warn?.('[dsh-im:qq] final text delivery failed; continuing with result files:', error);
      }
      const delivery = await this.#deliverArtifacts(target, messageId, artifacts, textReceipt);
      const artifactDispatched = delivery.receipt?.artifacts?.some(
        ({ outcome }) => outcome === 'sent' || outcome === 'unknown',
      );
      if (textSendError && !artifactDispatched && !delivery.failureNoticeVisible) {
        throw textSendError;
      }
      if (textSendError && delivery.artifactSendErrors === 0) {
        setLastMessageFailure(this.#status, textSendError);
      }
      this.#status.messagesReplied += 1;
      this.#status.lastReplyAt = new Date().toISOString();
      this.#status.lastError = null;
      if (!textSendError && delivery.artifactSendErrors === 0) {
```

</details>

**依据 4 · 作者声明**：[README.md:147-155](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/README.md#L147-L155)

作者说明延迟发送和文件边界。

```text
已接入的 IM 渠道共用超时任务跟踪：收到“等待模型回复超时”后，插件会继续检查原任务，完成后向原聊天或线程补发最终文字；插件重启或连接恢复后也会继续检查。`/stop` 只停止当前聊天提交的对应回合，切换会话后不再向该聊天补发旧会话的结果。无需新增设置，正常回复流程保持原样。

补发仍受渠道发送权限和配额限制。明确发送失败最多尝试三次；发送结果不确定时保留记录并停止自动重试，避免重复消息。此机制恢复文字结果和终态通知，不重放问题、审批或文件工具调用。详见[延迟交付说明](docs/deferred-delivery.md)。

### 结果文件与图片回传

支持文件回传的内置渠道均可把 Harness 可读取的文件作为渠道原生附件回传。已有文件和当前任务新生成的文件都可以直接发送；该能力对所有已连接机器人默认可用，无需开关或机器人白名单，原有文字、图片、流式回复、命令和会话行为保持不变。iMessage 首版不支持文件或附件回传。

模型调用文件回传工具后，插件把指定文件交给当前渠道的原生接口。图片会优先以原生图片消息呈现；渠道不支持或明确拒绝图片发送时自动回退为文件附件，发送结果不确定时不会补发文件造成重复消息。插件不额外设置文件来源、创建时间、工作区边界、扩展名、内容、数量、大小或有效期规则；文件只需真实存在且可读取。渠道平台仍可能依据自身权限、配额、文件能力或账号等级拒绝发送，插件会按平台返回结果提示。
```

#### 缺口

- 网络故障、平台回执和不同渠道实际权限
  **影响**：决定恢复与信息暴露风险
  **进一步探讨**：核对目标平台权限和发送结果，再手工对账

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和可验证改进假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

配置平台凭据、账号权限、工作区、网络和 DSH；运行还需模型费用、附件流量、凭据轮换及排障。源码未给出可核验的单位任务费用、误投率和响应时间。假设在发起会话前展示收件渠道、目标会话、工作区和潜在文件范围并允许取消，能降低误投；会增加一次交互和界面成本。可比较同一批模拟任务的误绑定发现率、任务时间和取消率，未改善或操作负担过高则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1322-1341](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1322-L1341)

消息和会话发问路径。

<details>
<summary>查看原文（20行）</summary>

```text
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
          onNotice: (notice) => this.#bot.sendText(target, notice),
          deferredDelivery: () => ({ coordinator: this.#deferred, target: deferredQqTarget(message, target, acceptedAt) }),
          harness: this.#harness,
          state: this.#state,
          key,
          text,
          content,
          titleText: batchSubmission?.title,
          sourceGuidance: snapshot?.config?.guidance,
          contextEnhanced,
          createOptions: { signal: this.#signal },
          existsOptions: { signal: this.#signal },
          askOptions: {
            groupHistory: message.groupHistory,
            timeoutMs: this.#replyTimeoutMs,
            signal: this.#signal,
            control: { owner: this, key },
            progressMode: 'all',
            finalAnswerOnly: true,
```

</details>

**依据 2 · 作者声明**：[README.md:149-155](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/README.md#L149-L155)

作者说明发送结果未知和文件边界。

```text
补发仍受渠道发送权限和配额限制。明确发送失败最多尝试三次；发送结果不确定时保留记录并停止自动重试，避免重复消息。此机制恢复文字结果和终态通知，不重放问题、审批或文件工具调用。详见[延迟交付说明](docs/deferred-delivery.md)。

### 结果文件与图片回传

支持文件回传的内置渠道均可把 Harness 可读取的文件作为渠道原生附件回传。已有文件和当前任务新生成的文件都可以直接发送；该能力对所有已连接机器人默认可用，无需开关或机器人白名单，原有文字、图片、流式回复、命令和会话行为保持不变。iMessage 首版不支持文件或附件回传。

模型调用文件回传工具后，插件把指定文件交给当前渠道的原生接口。图片会优先以原生图片消息呈现；渠道不支持或明确拒绝图片发送时自动回退为文件附件，发送结果不确定时不会补发文件造成重复消息。插件不额外设置文件来源、创建时间、工作区边界、扩展名、内容、数量、大小或有效期规则；文件只需真实存在且可读取。渠道平台仍可能依据自身权限、配额、文件能力或账号等级拒绝发送，插件会按平台返回结果提示。
```

**依据 3 · 源码核查**：[package.json:107-125](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/package.json#L107-L125)

平台依赖。

<details>
<summary>查看原文（19行）</summary>

```text
  "engines": {
    "node": ">=22.19"
  },
  "dependencies": {
    "@matrix-org/olm": "3.2.15",
    "@tencent-connect/qqbot-connector": "1.2.0",
    "@tencent-connect/qqbot-nodejs": "1.0.4",
    "@wecom/aibot-node-sdk": "1.0.7",
    "dingtalk-stream": "2.1.4",
    "imapflow": "^2.0.5",
    "mailparser": "^3.9.43",
    "nodemailer": "^10.1.4",
    "qrcode": "1.5.4",
    "undici": "7.30.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "4.0.1",
    "@larksuiteoapi/node-sdk": "1.73.0",
    "@whiskeysockets/baileys": "7.0.0-rc14",
```

</details>

#### 缺口

- 实际误投率和配置耗时未知
  **影响**：不能量化收益
  **进一步探讨**：用不含敏感信息的任务做对照试验

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用与退出？

**研究主题**：采用判断

#### 完整回答

有机器人维护经验且已有 DSH 的用户，可先配置一个非敏感私聊和固定工作区，用自有测试机器人核查身份、会话绑定、回复与文件权限。相比独立桥接脚本，它可复用 DSH 会话和插件配置，但跨平台收益未实测。若目标会话不符、消息重复或投递结果未知，暂停连接并在 DSH 与平台记录中人工核对，明确状态后再恢复；不要盲目重发。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/qq/qq-bridge.mjs:583-598](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L583-L598)

QQ 入站访问策略。

<details>
<summary>查看原文（16行）</summary>

```text
      const access = this.#accessPolicy
        ? evaluateInboundAccess(this.#accessPolicy, {
            conversationType: message.kind === 'c2c' ? 'direct' : 'group',
            senderIds: sender,
            text: commandText,
            hasImages: hasQqImageAttachments(message),
            hasFiles: hasQqFileAttachments(message),
            ...(explicitMenu || numericMenu || isPermissionCommand(commandText) ? { isCommand: true } : {}),
          })
        : senderAllowed(message, this.#ownerUserOpenid)
          ? { allowed: true, reason: 'legacy-owner' }
          : { allowed: false, reason: 'sender-not-allowed' };
      if (!access.allowed) {
        this.#acceptedMessageIds.set(messageId, null);
        return this.#finishAccessDecision(message, messageId, access);
      }
```

</details>

**依据 2 · 源码核查**：[src/channels/qq/qq-bridge.mjs:1314-1324](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/src/channels/qq/qq-bridge.mjs#L1314-L1324)

提交与请求。

<details>
<summary>查看原文（11行）</summary>

```text
        // Persist consumption before handing the prompt to Harness. Provider
        // redelivery after a failed error notice must never execute it twice.
        await markMessageSeen();
        // The prompt is about to enter the Harness inbox, which is itself
        // durable. Marking the entry submitted first means a crash after this
        // point reports the message instead of replaying a turn the Harness may
        // already own.
        await this.#markPendingSubmitted(key, messageId);
        ({ answer, artifacts = [] } = await askInWorkspaceSession({
          onNotice: (notice) => this.#bot.sendText(target, notice),
          deferredDelivery: () => ({ coordinator: this.#deferred, target: deferredQqTarget(message, target, acceptedAt) }),
```

</details>

**依据 3 · 作者声明**：[README.md:147-155](https://github.com/xmanrui/dsh-im/blob/14f8648e49502bad6b5caf54fea7b7c77dcdfb0c/README.md#L147-L155)

作者的延迟交付和文件边界。

```text
已接入的 IM 渠道共用超时任务跟踪：收到“等待模型回复超时”后，插件会继续检查原任务，完成后向原聊天或线程补发最终文字；插件重启或连接恢复后也会继续检查。`/stop` 只停止当前聊天提交的对应回合，切换会话后不再向该聊天补发旧会话的结果。无需新增设置，正常回复流程保持原样。

补发仍受渠道发送权限和配额限制。明确发送失败最多尝试三次；发送结果不确定时保留记录并停止自动重试，避免重复消息。此机制恢复文字结果和终态通知，不重放问题、审批或文件工具调用。详见[延迟交付说明](docs/deferred-delivery.md)。

### 结果文件与图片回传

支持文件回传的内置渠道均可把 Harness 可读取的文件作为渠道原生附件回传。已有文件和当前任务新生成的文件都可以直接发送；该能力对所有已连接机器人默认可用，无需开关或机器人白名单，原有文字、图片、流式回复、命令和会话行为保持不变。iMessage 首版不支持文件或附件回传。

模型调用文件回传工具后，插件把指定文件交给当前渠道的原生接口。图片会优先以原生图片消息呈现；渠道不支持或明确拒绝图片发送时自动回退为文件附件，发送结果不确定时不会补发文件造成重复消息。插件不额外设置文件来源、创建时间、工作区边界、扩展名、内容、数量、大小或有效期规则；文件只需真实存在且可读取。渠道平台仍可能依据自身权限、配额、文件能力或账号等级拒绝发送，插件会按平台返回结果提示。
```

#### 缺口

- 部署环境和具体渠道的实际行为
  **影响**：影响是否适合使用
  **进一步探讨**：只以测试账号验证实际绑定与回执

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
