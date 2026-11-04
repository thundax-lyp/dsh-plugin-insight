# AX Feishu Bridge

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[af56acb](https://github.com/AX1202/ax-feishu-bridge/tree/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AX1202/ax-feishu-bridge) [![npm 30d 556](https://img.shields.io/static/v1?label=npm+30d&message=556&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ax-feishu-bridge) [![最新发布 2026-08-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/ax-feishu-bridge)
<!-- END META -->

> **功能**：把飞书或 Lark 消息和回复卡片桥接到本机 DeepSeek Harness 或 Pi。

> **亮点**：[Q01](#research-q01) 复用宿主 Agent 和会话，同时把引用及附件带到聊天侧。

> **主要限制**：[Q02](#research-q02) 群触发只筛事件，消息 claim 与 flush 也不能保证严格一次和持久。

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
  - [Q01 · 飞书对话如何进入现有 DSH Agent，再返回卡片？](#detail-section-11)
  - [Q02 · 群聊触发和消息去重能保证什么？](#detail-section-12)
  - [Q03 · 怎样试用、衡量失败和退出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 或 Pi 的团队希望从飞书持续处理协作消息。

用户切换到 DSH Web，或维护自己的飞书 bot 和模型调用。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聊天桥接 | 从飞书调用 Agent | 平台和 Host 同时可用 |
| 回复卡片 | 显示轮次文本 | 需真实平台验证 |
| 管理命令 | 查询和配置连接 | 依赖宿主 commands |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node | 必需 | 装配公开服务与 Agent | 退回 Web |
| 飞书测试 app、凭据和网络 | 必需 | 接收和发送消息 | 不连接平台 |
| 低权限测试 Profile | 试用必需 | 约束宿主影响 | 停止试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理员核 app 和 Host 权限 | 先隔离私聊 |
| 验证 | 用户发样例并核卡片与会话 | 异常检查触发和持久状态 |
| 退出 | 卸载桥并检查平台凭据 | 独立处理残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 凭据与服务费用未知 | 配置 app、Profile、模型 | 需平台授权 |
| 持续 | 模型与附件资源未知 | 管理群权限、会话和日志 | 跨端维护 |
| 失败 | 重跑及文件未知 | 区分触发、连接、执行和回卡 | 未测恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 对话接入 | 消息进入 Agent 并回卡 | 真实可靠性和速度 |
| 去重 | 内存和文件 claim | 锁超时和故障恢复 |

> **思考**：[Q02](#research-q02) 群触发只筛事件，消息 claim 与 flush 也不能保证严格一次和持久。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 复用宿主 Agent 和会话，同时把引用及附件带到聊天侧。

[Q02](#research-q02) 文件 claim 有锁，但超时后仍运行，失败状态也暂时抑制重投。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 群触发只筛事件，消息 claim 与 flush 也不能保证严格一次和持久。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先核隔离 app 的身份和 Host 工具，无法证实时保留 Web 工作流。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核固定 DSH 接线与共享触发/去重。未验证宿主、外部账号和真实交付。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/adapters/harness/index.ts、src/feishu/message-handler.ts、src/adapters/harness/HarnessConversationRuntime.ts、src/feishu/group-trigger.ts、src/feishu/transport.ts、src/feishu/dedupe-store.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定 DSH 主路径与共享飞书模块，未运行构建、平台、真实 Host 或 Pi。
- 下一步：双用户和群话题、消息重投、锁冲突、flush 失败和卸载后清理。

**分析版本**

- **仓库**：[AX1202/ax-feishu-bridge](https://github.com/AX1202/ax-feishu-bridge)
- **版本号**：0.4.9（[固定提交 af56acb](https://github.com/AX1202/ax-feishu-bridge/tree/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较隔离飞书桥与手工交接的确认时间和误回复；不改善即退出。

双用户和群话题、消息重投、锁冲突、flush 失败和卸载后清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 36 | 8581 | 7352 | 466 | — |
| .md | source | 3 | 837 | — | — | 6632 |
| .ts | test | 12 | 1572 | 1388 | 64 | — |
| .mjs | test | 4 | 249 | 217 | 6 | — |
| .ts | example | 2 | 44 | 38 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-04），可前往 [GitHub Issues](https://github.com/AX1202/ax-feishu-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：飞书桥接如何用既有 DSH Agent 处理消息，有哪些身份、会话和交付边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书对话如何进入现有 DSH Agent，再返回卡片？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已有 DSH 的用户可以从飞书接续代码协作。Cordis 入口引用 ax-feishu-bridge/harness，安装工件需要把 TypeScript 编译到 manifest 的 lib 路径。Host 初始化配置和附件服务，再建 Transport、消息处理及 HarnessConversationRuntime。handler 按会话键整理原文、引用和附件，先开卡片，再将 prompt 交给对应运行时。运行时按 key 串行取 Agent、followup 并等待，读取事件给最终答复；卡片会使用分段推送。与直接打开 DSH 相比，增量是消息和卡片前端；与自己写 webhook 相比可复用 Agent、附件与宿主会话；Pi 与 DSH 配置分开。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:47-81](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/README.md#L47-L81)

作者 DSH 场景与配置。

<details>
<summary>查看原文（35行）</summary>

````text
### DeepSeek Harness（DSH）

本扩展同时以 DeepSeek Harness 组合包（bundle）形式分发，飞书机器人的配置和聊天体验与 Pi 一致。

#### 1. 安装

前提：本机已安装 dsh

从 npm 安装

```bash
dsh plugin --profile web add ax-feishu-bridge --ignore-scripts
```



#### 2. 启动与首次配置


安装后重启dsh,如果没有检测到飞书机器人配置，会自动进入终端配置向导：推荐选择“扫码自动创建飞书助手”，按提示扫描终端里的二维码即可；如果你已经有现成的飞书/Lark 应用，也可以选择手动填写 App ID 和 App Secret。

配置完成后桥接会自动启动并连上飞书/Lark，之后每次启动 dsh 也会自动连接。

> DSH 使用独立的配置文件 `~/.dsh/feishu/config.harness.json`（存放在 dsh 自己的家目录下），与 Pi 的配置互不干扰，两边可以同时安装、共存。

#### 3. 在飞书里互动

- 私聊：直接发消息
- 群聊：根据群聊策略决定是否需要 `@` 机器人
- 话题：每个话题会独立对应一个会话

**群聊策略设为open后，想要不@机器人就能回复任何群内消息，还需要到飞书开发者后台 - 对应机器人事件与回调 - 打开“获取群组中所有消息”或“获取群组中用户和机器人发送的消息”这两个任意一个权限。**
![图片说明](docs/images/1.jpeg)

`/new`、`/resume`、`/model`、`/thinking`、`/stop`、`/workspace`、`/status`、`/config` 等聊天内命令同样可用，完整列表见下文“飞书里怎么用”。
````

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-11](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/cordis.patch.yml#L1-L11)

真实组件挂载。

<details>
<summary>查看原文（11行）</summary>

```text
# ax-feishu-bridge 的 DeepSeek Harness 插件入口
#
# 发布/分发形态：插件行按包名子路径引用（见 package.json 的 exports），
# 这样通过 dsh plugin add 安装后 Node 模块解析能找到已安装的代码。
#
# 本地调试时可临时改为本机绝对路径，例如：
#   name: '/Users/ax/Dev/projects/ax-feishu-bridge/src/adapters/harness/index.ts'
#   然后运行：npx @deepseek-ai/dsh web --patch ./cordis.patch.yml
- insert:
    - id: feishu-harness
      name: 'ax-feishu-bridge/harness'
```

</details>

**依据 3 · 源码核查**：[package.json:44-70](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/package.json#L44-L70)

宿主子路径与构建入口。

<details>
<summary>查看原文（27行）</summary>

```text
  },
  "devDependencies": {
    "typescript": "^5.9.2",
    "@types/node": "^24.3.0",
    "@types/qrcode-terminal": "^0.12.2"
  },
  "exports": {
    "./pi": "./src/adapters/pi/index.ts",
    "./harness": "./lib/adapters/harness/index.js",
    "./cordis.patch.yml": "./cordis.patch.yml"
  },
  "files": [
    "src",
    "lib",
    ".pi",
    "cordis.patch.yml"
  ],
  "pi": {
    "extensions": [
      "./.pi/extensions/feishu/index.ts"
    ]
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
```

</details>

**依据 4 · 源码核查**：[src/adapters/harness/index.ts:91-99](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/index.ts#L91-L99)

Host 创建 transport 处理链。

```text
function startFeishu(ctx: Context, cfg: FeishuConfig) {
  const bridgeStore = new FeishuBridgeStore();
  const delivery = new FeishuDelivery(() => transport);
  const bridge = new FeishuBridgeRuntime(bridgeStore, delivery);
  const conversations = new HarnessConversationRuntime(ctx, process.cwd(), bridge, {
    promptNotifySec: cfg.promptNotifySec,
    promptTimeoutSec: cfg.promptTimeoutSec,
  });
  const messageHandler = new FeishuMessageHandler(conversations, () => transport, bridgeStore);
```

**依据 5 · 源码核查**：[src/feishu/message-handler.ts:136-157](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/message-handler.ts#L136-L157)

卡片、prompt 与流增量调用。

<details>
<summary>查看原文（22行）</summary>

```text
      const basePrompt = buildPrompt(msg, text, fileSections, imageInputs, skippedImageCount, modelSupportsImage, downloadErrors);
      const prompt = buildPromptWithQuote(basePrompt, quoted);
      // 单卡：全程 header；流式参数来自 config/env
      const useStreaming = cfg?.streamingReply !== false;
      const card = new ReplyCard(key, msg.messageId, transport, {
        enabled: useStreaming,
        printFrequencyMs: cfg?.streamPrintFrequencyMs,
        printStep: cfg?.streamPrintStep,
        pushIntervalMs: cfg?.streamPushIntervalMs,
      });
      await card.start();

      await this.conversations.promptWithImages(
        key,
        prompt,
        imageInputs,
        async (reply) => {
          await card.completeWithAnswer(reply || "（无内容）");
        },
        card,
        useStreaming ? (delta) => card.append(delta) : undefined,
      );
```

</details>

**依据 6 · 源码核查**：[src/adapters/harness/HarnessConversationRuntime.ts:105-137](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/HarnessConversationRuntime.ts#L105-L137)

Agent 执行、刷新和回复。

<details>
<summary>查看原文（33行）</summary>

```text
    const previous = this.previousTurn(key);
    const next = previous.then(async () => {
      debugLog("feishu.harness.prompt.start", { key, textLength: userText.length, imageCount: images.length });
      const handle = await this.getAgent(key);
      const agent = handle.agent;
      const run: ActiveRun = { agent, runId: status?.runId, stopped: false, status, onDelta };
      this.activeRuns.set(key, run);
      this.bridge?.beginFeishuInput(agent.id);
      const firstSeq = agent.session.seq;
      try {
        agent.followup(createUserMessage({
          content: await this.buildUserContent(userText, images),
          source: { kind: "user" },
        }));
        await this.runPromptWithTimeouts(key, agent, run, firstSeq, onReply, status);
        // 落盘当前会话日志，保证 /resume 与重启后可以恢复
        await this.ctx.sessions.flush(agent.session).catch(() => undefined);
      } catch (error) {
        if (run.stopped) {
          debugLog("feishu.harness.prompt.stopped", { key });
          return;
        }
        throw error;
      } finally {
        if (this.activeRuns.get(key) === run) this.activeRuns.delete(key);
        this.bridge?.endFeishuInput(agent.id);
      }
      if (run.stopped) return;
      const answer = summarizeAssistantText(agent.session.events, firstSeq);
      debugLog("feishu.harness.prompt.done", { key, answerLength: answer.length });
      await onReply(answer || "本轮处理已完成，但没有生成最终回答文本。可以再问一次试试。");
      // onReply（ReplyCard.completeWithAnswer）已切到 done；此处仅兜底
      await status?.finish("done");
```

</details>

#### 缺口

- 未接真实 Feishu/Lark 或 DSH
  **影响**：不能保证消息格式与宿主适配
  **进一步探讨**：用测试 app 验证一个私聊、一个群话题和图片

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 群聊触发和消息去重能保证什么？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

私聊在触发逻辑中允许；群聊 open 允许已收到的消息，mention 基线还可因关键词或回复机器人通过。它只决定何时响应，不能由此推断发送者有资格调用 Host 的工具。平台权限决定实际可接收哪些消息，开放模式需要相应飞书权限。消息处理有内存 seen 与文件 claim；若已有记录（含 processing 或 failed）便跳过；文件锁等待超时后会不持锁执行。进程崩溃、文件损坏及超时后的重复与丢失均不能排除，不能称严格一次。DSH flush 错误在 runtime 被吞掉，回复完成也不能证明跨重启持久化。

#### 证据与依据

**依据 1 · 源码核查**：[src/feishu/group-trigger.ts:91-120](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/group-trigger.ts#L91-L120)

群触发的决策。

<details>
<summary>查看原文（30行）</summary>

```text
/**
 * 群聊触发决策（私聊始终 accept）。
 * mention 基线 + 可选 keyword / alsoOnReply 叠加。
 */
export function shouldAcceptGroupMessage(input: GroupTriggerInput): GroupTriggerDecision {
  if (input.chatType === "p2p") {
    return { accept: true, reason: "p2p" };
  }

  if (input.groupPolicy === "open") {
    return { accept: true, reason: "open" };
  }

  // mention 基线（及未来 keyword-only 仍走叠加语义）
  if (input.mentioned) {
    return { accept: true, reason: "mentioned" };
  }
  if (textMatchesKeywords(input.text, input.keywords)) {
    return { accept: true, reason: "keyword" };
  }
  if (input.alsoOnReply && input.replyToBot) {
    return { accept: true, reason: "reply_to_bot" };
  }

  // 有关键词配置但未命中时，日志可区分；最终统一为 not_mentioned 语义也可
  if (input.keywords.length > 0 && !input.mentioned) {
    return { accept: false, reason: "not_mentioned" };
  }
  return { accept: false, reason: "not_mentioned" };
}
```

</details>

**依据 2 · 源码核查**：[src/feishu/transport.ts:150-194](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/transport.ts#L150-L194)

接收后应用群策略。

<details>
<summary>查看原文（45行）</summary>

```text
  private async handleRawMessage(data: any) {
    const event = data?.event || data;
    const message = event?.message;
    const sender = event?.sender;
    if (!message) return;

    const cfg = this.effectiveConfig();
    if (sender?.sender_type === "bot" && cfg.ignoreBotMessages !== false) {
      debugLog("feishu.message.ignored_bot", {
        messageId: message.message_id,
        messageType: message.message_type,
      });
      return;
    }

    debugLog("feishu.message.received", {
      messageId: message.message_id,
      chatType: message.chat_type,
      messageType: message.message_type,
      senderType: sender?.sender_type || "unknown",
      hasRootId: Boolean(message.root_id),
      hasParentId: Boolean(message.parent_id),
      hasThreadId: Boolean(message.thread_id),
      content: message.content || "",
    });

    if (message.chat_type === "group") {
      const text = extractPlainTextForTrigger(message.message_type || "text", message.content || "");
      const mentioned = this.isMentioned(message);
      const replyToBot = this.isReplyToBot(message);
      const decision = shouldAcceptGroupMessage({
        chatType: "group",
        groupPolicy: cfg.groupPolicy,
        mentioned,
        text,
        keywords: cfg.groupKeywords || [],
        alsoOnReply: Boolean(cfg.groupAlsoOnReply),
        replyToBot,
      });
      if (!decision.accept) {
        debugLog(`feishu.message.ignored_${decision.reason}`, {
          messageId: message.message_id,
          reason: decision.reason,
          mentioned,
          replyToBot,
```

</details>

**依据 3 · 源码核查**：[src/feishu/message-handler.ts:43-72](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/message-handler.ts#L43-L72)

消息 claim 与引用读取。

<details>
<summary>查看原文（30行）</summary>

```text
  async handle(msg: FeishuMessage) {
    const transport = this.getTransport();
    if (!transport) return;

    try {
      if (this.seen.has(msg.messageId)) return;
      if (!(await claimFeishuMessage(msg.messageId))) return;
      this.seen.add(msg.messageId);
      if (this.seen.size > 2000) this.seen.clear();

      const cfg = loadConfig();
      const parsed = parseMessageInput(msg, transport.getBotOpenId(), {
        parseInteractiveCards: cfg?.parseInteractiveCards !== false,
      });
      let text = parsed.text || "";
      const key = conversationKey(msg);
      this.bridgeStore?.bindConversation(key, msg);

      // 展开引用/回复的父消息（告警卡片场景）
      let quoted: { msgType: string; text: string } | null = null;
      if (cfg?.includeQuotedMessage !== false && (msg.parentId || msg.rootId)) {
        const q = await transport.getQuotedContext(
          msg,
          transport.getBotOpenId(),
          cfg?.quotedMessageMaxChars ?? 8000,
        );
        if (q?.text) {
          quoted = { msgType: q.msgType, text: q.text };
          for (const a of q.attachments || []) parsed.attachments.push(a);
        }
```

</details>

**依据 4 · 源码核查**：[src/feishu/dedupe-store.ts:36-60](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/dedupe-store.ts#L36-L60)

已有状态均阻止重领。

<details>
<summary>查看原文（25行）</summary>

```text
    pruneExpired(messages, now);

    const existing = messages[messageId];
    if (existing) {
      existing.updatedAt = now;
      writeStore({ messages });
      debugLog("feishu.dedupe.ignored_message", {
        messageId,
        status: existing.status,
        firstSeenAt: new Date(existing.firstSeenAt).toISOString(),
        ownerPid: existing.pid,
        currentPid: process.pid,
      });
      return false;
    }

    messages[messageId] = {
      status: "processing",
      firstSeenAt: now,
      updatedAt: now,
      pid: process.pid,
    };
    writeStore({ messages });
    debugLog("feishu.dedupe.claimed_message", { messageId, pid: process.pid });
    return true;
```

</details>

**依据 5 · 源码核查**：[src/feishu/dedupe-store.ts:90-129](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/feishu/dedupe-store.ts#L90-L129)

读失败回空、写入及锁超时回退。

<details>
<summary>查看原文（40行）</summary>

```text
function readStore(): DedupeStore {
  try {
    const path = dedupePath();
    if (!existsSync(path)) return {};
    return JSON.parse(readFileSync(path, "utf8")) as DedupeStore;
  } catch {
    return {};
  }
}

function writeStore(store: DedupeStore) {
  ensureRoot();
  writeFileSync(dedupePath(), `${JSON.stringify(store, null, 2)}\n`, "utf8");
}

function pruneExpired(messages: Record<string, DedupeRecord>, now: number) {
  for (const [messageId, record] of Object.entries(messages)) {
    if (!record.updatedAt || now - record.updatedAt > MESSAGE_TTL_MS) {
      delete messages[messageId];
    }
  }
}

async function withStoreLock<T>(fn: () => T | Promise<T>): Promise<T> {
  ensureRoot();
  const lockPath = `${dedupePath()}.lock`;

  for (let attempt = 0; attempt < LOCK_ATTEMPTS; attempt += 1) {
    if (tryAcquireLock(lockPath)) {
      try {
        return await fn();
      } finally {
        try { rmSync(lockPath, { recursive: true, force: true }); } catch {}
      }
    }
    await sleep(LOCK_RETRY_MS);
  }

  debugLog("feishu.dedupe.lock_timeout", { lockPath });
  return await fn();
```

</details>

**依据 6 · 源码核查**：[src/adapters/harness/HarnessConversationRuntime.ts:114-135](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/HarnessConversationRuntime.ts#L114-L135)

flush 不把失败抛出。

<details>
<summary>查看原文（22行）</summary>

```text
      try {
        agent.followup(createUserMessage({
          content: await this.buildUserContent(userText, images),
          source: { kind: "user" },
        }));
        await this.runPromptWithTimeouts(key, agent, run, firstSeq, onReply, status);
        // 落盘当前会话日志，保证 /resume 与重启后可以恢复
        await this.ctx.sessions.flush(agent.session).catch(() => undefined);
      } catch (error) {
        if (run.stopped) {
          debugLog("feishu.harness.prompt.stopped", { key });
          return;
        }
        throw error;
      } finally {
        if (this.activeRuns.get(key) === run) this.activeRuns.delete(key);
        this.bridge?.endFeishuInput(agent.id);
      }
      if (run.stopped) return;
      const answer = summarizeAssistantText(agent.session.events, firstSeq);
      debugLog("feishu.harness.prompt.done", { key, answerLength: answer.length });
      await onReply(answer || "本轮处理已完成，但没有生成最终回答文本。可以再问一次试试。");
```

</details>

#### 缺口

- 未检查平台身份、完整卡片权限与进程竞争
  **影响**：不应把触发规则用作 Host 安全边界或承诺无漏回
  **进一步探讨**：用两个测试用户与故障注入核权限、重复和重启后持久化

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用、衡量失败和退出？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

使用隔离 Feishu 测试应用、无敏感 DSH Profile、一个受控私聊，先验证平台授权和 Host 工具边界。DSH 与 Pi 按 appId 竞争连接锁，锁丢失会停 transport；在支持权限的端上核清只有一个消费者。部署需 app 凭据、网络、宿主和模型，运行会有模型调用、附件和重连成本；退出卸载会停 transport、释放锁与回收 Agent，独立检查远端 app 凭据及会话、附件留存。可以与手工 Web+IM 交接对照同一无敏感任务，记录确认时间、重复与误回复；若不能降低工作量或身份边界无法验证，应退回 Web。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapters/harness/index.ts:104-142](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/index.ts#L104-L142)

共享锁、失败及连接状态。

<details>
<summary>查看原文（39行）</summary>

```text
  ctx.effect(() => {
    void (async () => {
      // 与 Pi daemon 等进程共用 gateway lock（按机器人凭证区分），保证同一机器人只有一个连接
      connectionStatus = "连接中 / connecting";
      const lockResult = await acquireGatewayLock(process.cwd(), false, cfg.appId);
      if (lockResult.status === "busy") {
        console.log(`[feishu] 飞书连接已被其他进程占用（pid=${lockResult.owner.pid}），本插件不启动。`);
        connectionStatus = `被其他进程占用（pid=${lockResult.owner.pid}）/ owned by another process`;
        return;
      }
      gatewayLock = lockResult.handle;
      gatewayLock.setOnLost(async () => {
        await transport?.stop();
        transport = undefined;
        connectionStatus = "已断开（连接锁丢失）/ disconnected (lock lost)";
        console.log("[feishu] 飞书连接锁丢失，已断开连接。");
      });

      transport = new FeishuTransport(
        cfg,
        (msg) => messageHandler.handle(msg),
        createCardActionHandler(conversations, () => transport),
      );
      try {
        await transport.start();
        gatewayLock.startHeartbeat();
        await gatewayLock.update("connected");
        connectionStatus = "已连接 / connected";
        console.log("[feishu] 飞书连接已启动（DeepSeek Harness 插件）。");
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        debugLog("feishu.harness.start_failed", { error: message });
        connectionStatus = `启动失败：${message} / start failed`;
        console.error(`[feishu] 飞书连接启动失败：${message}`);
        await gatewayLock.release().catch(() => undefined);
        gatewayLock = undefined;
        if (error instanceof BotUnavailableError) {
          console.error("[feishu] 机器人不可用：请确认飞书应用已发布并启用机器人能力。");
        }
```

</details>

**依据 2 · 源码核查**：[src/adapters/harness/index.ts:146-156](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/index.ts#L146-L156)

卸载清理。

<details>
<summary>查看原文（11行）</summary>

```text
    // 插件卸载时停止 Transport、释放连接锁、回收全部 agent
    return async () => {
      await transport?.stop();
      transport = undefined;
      await gatewayLock?.release().catch(() => undefined);
      gatewayLock = undefined;
      await conversations.dispose();
      connectionStatus = "已停止（插件卸载）/ stopped (plugin unloaded)";
      console.log("[feishu] 飞书连接已停止（Harness 插件卸载）。");
    };
  });
```

</details>

**依据 3 · 源码核查**：[src/adapters/harness/index.ts:69-88](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/src/adapters/harness/index.ts#L69-L88)

可能安装本地附件存储。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * 图片输入依赖宿主 attachments 服务；当前部分 dsh 部署未挂载它，
 * 缺失时由本插件自行挂载官方本地存储实现（存到 ~/.dsh/attachments）。
 * 已挂载时直接复用，不重复注册。
 */
function ensureAttachmentStore(ctx: Context) {
  try {
    if ((ctx as any).get("attachments")) return;
  } catch {
    // 服务未挂载，继续自行注册
  }
  try {
    const dshHome = process.env.DSH_HOME?.trim() || join(homedir(), ".dsh");
    ctx.plugin(LocalAttachmentStore, { dshHome });
    console.log("[feishu] 宿主未提供图片附件服务，飞书插件已挂载本地附件存储。");
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    debugLog("feishu.harness.attachment_store_failed", { error: message });
    console.warn(`[feishu] 图片附件服务挂载失败，图片输入将不可用：${message}`);
  }
```

</details>

**依据 4 · 作者声明**：[README.md:64-81](https://github.com/AX1202/ax-feishu-bridge/blob/af56acbb1d4cf40dcbfbbbf4ae0fb8e8b15702bc/README.md#L64-L81)

作者说明向导及平台权限。

<details>
<summary>查看原文（18行）</summary>

```text


安装后重启dsh,如果没有检测到飞书机器人配置，会自动进入终端配置向导：推荐选择“扫码自动创建飞书助手”，按提示扫描终端里的二维码即可；如果你已经有现成的飞书/Lark 应用，也可以选择手动填写 App ID 和 App Secret。

配置完成后桥接会自动启动并连上飞书/Lark，之后每次启动 dsh 也会自动连接。

> DSH 使用独立的配置文件 `~/.dsh/feishu/config.harness.json`（存放在 dsh 自己的家目录下），与 Pi 的配置互不干扰，两边可以同时安装、共存。

#### 3. 在飞书里互动

- 私聊：直接发消息
- 群聊：根据群聊策略决定是否需要 `@` 机器人
- 话题：每个话题会独立对应一个会话

**群聊策略设为open后，想要不@机器人就能回复任何群内消息，还需要到飞书开发者后台 - 对应机器人事件与回调 - 打开“获取群组中所有消息”或“获取群组中用户和机器人发送的消息”这两个任意一个权限。**
![图片说明](docs/images/1.jpeg)

`/new`、`/resume`、`/model`、`/thinking`、`/stop`、`/workspace`、`/status`、`/config` 等聊天内命令同样可用，完整列表见下文“飞书里怎么用”。
```

</details>

#### 缺口

- 未获实际测试 app、配额或恢复样本
  **影响**：长期费用、停止与附件清理未验
  **进一步探讨**：在隔离环境重启、重投、卸载，清点平台权限和本地文件

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
