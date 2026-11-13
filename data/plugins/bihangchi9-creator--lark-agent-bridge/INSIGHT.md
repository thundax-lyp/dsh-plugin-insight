# lark-agent-bridge

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[5f5468d](https://github.com/bihangchi9-creator/lark-agent-bridge/tree/5f5468ddf7a283f6f2f2111d105006cb5cfee60b)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/bihangchi9-creator/lark-agent-bridge) [![npm 30d 811](https://img.shields.io/static/v1?label=npm+30d&message=811&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@bihangchi9/lark-agent-bridge) [![最新发布 2026-09-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@bihangchi9/lark-agent-bridge)
<!-- END META -->

> **功能**：把飞书消息桥接到本地 DeepSeek Harness 会话，并将代理回复流式返回原会话。

> **亮点**：[Q01](#research-q01) 的按群分流与会话适配把飞书消息、固定运行时及流式回复接成一条调用链。

> **主要限制**：[Q02](#research-q02) 的群授权对整个群生效；超时 dispose 不确认之前的副作用已撤回。

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
  - [Q01 · 飞书消息如何到达所选 DSH 会话，再回到原群？](#detail-section-11)
  - [Q02 · 允许一个群是否只授权管理员，超时能否撤回已执行动作？](#detail-section-12)
  - [Q03 · 怎样观察远程只读路径，什么回执可减少超时后的盲重试？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要从专用飞书群查看或询问本地 DSH 的用户可用群消息触发隔离会话。

用户直接在本地 DSH 发起任务，再人工转述结果或链接；可避免向群开放本机代理权限。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 飞书消息桥 | 群消息触发 DSH 会话 | 需要 bot 授权及可用运行时 |
| 流式回复 | 在原群显示代理结果 | 超时、截断与副作用需回查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 飞书 bot 应用和网络 | 是 | 接收和回传消息 | 使用原 DSH |
| DSH agents、受限 preset 与模型 | 是 | 绑定受限代理 | 无法验证权限时停止 |
| 专用测试群和隔离工作目录 | 本建议要求 | 限制内容和权限 | 不启用群桥 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户配置独立 bot 和只读环境 | 核对实际工具及群许可 |
| 观察 | 用公开样本收发消息 | 验证回执、授权及超时 |
| 退出 | 撤回授权及关闭桥 | 回读本地会话和数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号、模型及网络金额未知 | 配置 bot、群和 preset | 权限待验 |
| 持续 | 连接、模型和附件磁盘 | 跟踪群成员及会话 | 实际人时和费用未知 |
| 失败恢复 | 重试与资源清理 | 检查已发生副作用及撤权 | 超时后状态未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 消息往返 | 固定运行时与流式回写 | 真实可用率 |
| 群及会话隔离 | 允许名单、路由和工作目录 | 真实工具访问边界 |
| 出错提示 | 离线、超时与截断有分支 | 重试前状态恢复 |

> **思考**：[Q02](#research-q02) 的群授权对整个群生效；超时 dispose 不确认之前的副作用已撤回。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的按群分流与会话适配把飞书消息、固定运行时及流式回复接成一条调用链。

[Q02](#research-q02) 的出队重查及固定运行时可读，超时回执不包含已发生动作。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的群授权对整个群生效；超时 dispose 不确认之前的副作用已撤回。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在专用群和隔离 profile 观察只读链路，[Q02](#research-q02) 的群授权范围和副作用需验证后再评估写权限。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持入站校验、路由、会话和卡片更新。真实连接、授权隔离及副作用待验。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/lark.ts、src/access.ts、src/config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对 DSH 插件入口和飞书消息、排队、权限、回执关键路径；未执行构建、飞书请求、CLI/IDE daemon 或宿主。
- 下一步：用授权隔离群对照拒绝、队列撤权、固定运行时掉线、公开附件和合成超时。

**分析版本**

- **仓库**：[bihangchi9-creator/lark-agent-bridge](https://github.com/bihangchi9-creator/lark-agent-bridge)
- **版本号**：0.0.3（[固定提交 5f5468d](https://github.com/bihangchi9-creator/lark-agent-bridge/tree/5f5468ddf7a283f6f2f2111d105006cb5cfee60b)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出可回读的超时状态，检查群用户能否减少盲重试。

用授权隔离群对照拒绝、队列撤权、固定运行时掉线、公开附件和合成超时。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | example | 1 | 30 | 22 | 7 | — |
| .md | source | 3 | 820 | — | — | 7489 |
| .ts | source | 29 | 4590 | 3261 | 998 | — |
| .ts | test | 21 | 1795 | 1595 | 21 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/bihangchi9-creator/lark-agent-bridge/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：飞书消息如何到达指定 DSH 会话并返回回复，群授权、工具预设和会话超时分别决定什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 飞书消息如何到达所选 DSH 会话，再回到原群？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

本地运行 DSH 的用户可给专用飞书会话发送问题和素材，减少人工在两个界面搬运。宿主创建 DshBinding 与 DshAdapter 并连接飞书桥。消息过滤机器人并核对发送者或群，命令本地处理，普通消息根据 chatId 找工作目录和固定运行时。适配器不可用时明确拒绝换线。代理文本事件进入缓冲后，以流式更新写到原群卡片，点击或权限细节仍由飞书和宿主决定。仓库所述 CLI/IDE 路线属于另一个 daemon 入口，本次只确认 DSH 插件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-20](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/README.md#L13-L20)

作者声明按群和固定运行时交互。

```text
## What it does

- **Feishu ⇄ your agent.** Inbound Feishu messages drive a live agent; the reply streams back onto a live-updating Feishu message. The agent is whichever runtime this chat is pinned to (dsh / CLI / IDE / custom).
- **Four host classes, one contract.** Every runtime implements the same `AgentAdapter`: dsh runs in-process as a plugin; CLI **spawns** `traex`/`codex`; IDE **attaches** a running window; custom loads your own module. They never silently replace each other.
- **One group, one conversation, one pinned runtime.** Every chat id maps to a stable directory (`<workspaceRoot>/<chatId>`) and one runtime chosen with `/agent`. Different groups never touch each other's files, and a message is never broadcast to several agents. If the pinned runtime is down (e.g. an IDE window closed), that chat fails closed instead of retargeting.
- **Persistent per-chat sessions.** A chat's conversation survives restarts (policy-fingerprint-gated resume-or-create; `/new` really clears it).
- **Files and images.** Send them to the bot and the bridge stores each message in an isolated `.attachments/<messageId>/` folder, then gives the paths to the agent. Limits: 5 attachments per message, images ≤10 MB, other files ≤20 MB; names are sanitized and stale files are swept after 7 days. Whether an image can actually be interpreted depends on the selected model's vision support.
- **Zero-config setup.** On first launch, if no credentials exist, a QR registration wizard runs — scan it in the Feishu app and it connects automatically. No portal spelunking.
```

**依据 2 · 源码核查**：[src/index.ts:74-101](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/index.ts#L74-L101)

实际 DSH binding 和桥接。

<details>
<summary>查看原文（28行）</summary>

```text
function applyInner(ctx: Context, config: LarkBridgeConfig, log: LogFn): void {
  ctx.effect(() => {
    let cancelled = false
    let bridge: LarkBridge | undefined

    // Connect a channel with fully-resolved credentials. Shared by the ready
    // path and the post-registration path.
    const connect = (resolved: ReturnType<typeof resolveConfig>): void => {
      if (cancelled) return
      // P0-2 blast radius: the accessMode tier picks the agent preset (which
      // tools exist), not just the model route.
      const binding = new DshBinding(
        ctx,
        {
          provider: resolved.provider,
          model: resolved.model,
          preset: PRESET_BY_ACCESS_MODE[resolved.accessMode],
        },
        log,
      )
      bridge = new LarkBridge(resolved, [new DshAdapter(binding)], log, DSH_RUNTIME.id)
      void bridge.connect().catch(err => log('error', 'failed to connect', err))
    }

    const ready = tryResolveConfig(config)
    if (ready !== undefined) {
      connect(ready)
    } else {
```

</details>

**依据 3 · 源码核查**：[src/lark.ts:304-338](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L304-L338)

入口授权、命令和代理分路。

<details>
<summary>查看原文（35行）</summary>

```text
  /** Route one inbound message: access gate, command, or agent prompt. */
  private async onMessage(msg: NormalizedMessage): Promise<void> {
    // Never react to our own or other bots' messages — avoids loops.
    if (msg.senderIsBot) return
    const text = msg.content?.trim() ?? ''
    // Image/file-only messages carry their content in `resources`, so an
    // empty text is not a reason to drop the message.
    const hasResources = (msg.resources?.length ?? 0) > 0
    if (text.length === 0 && !hasResources) return

    // Access gate: the security boundary is exactly "who may send the bot a
    // message". Deny loudly and explain how to fix — never fall through.
    const decision = decideAccess(this.accessControls(), {
      chatId: msg.chatId,
      chatType: msg.chatType,
      senderId: msg.senderId,
    })
    if (!decision.ok) {
      this.log('warn', 'access denied', {
        chatId: msg.chatId,
        chatType: msg.chatType,
        senderId: msg.senderId,
      })
      await this.reply(msg, deniedMessage(msg))
      return
    }

    // Commands are handled locally and never reach the agent.
    const command = parseCommand(text)
    if (command) {
      await this.handleCommand(msg, command)
      return
    }

    await this.runAgent(msg, text)
```

</details>

**依据 4 · 源码核查**：[src/lark.ts:632-649](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L632-L649)

工作目录及运行时检查。

<details>
<summary>查看原文（18行）</summary>

```text
  private async runAgentTurn(
    msg: NormalizedMessage,
    prompt: string,
    chatId: string,
  ): Promise<void> {
    const cwd = await resolveWorkspace(this.config.workspaceRoot, chatId)
    const pinned = this.chatRuntime(chatId)
    const adapter = pinned.runtime === undefined ? undefined : this.adapters.get(pinned.id)
    if (!adapter) {
      throw new Error(
        `pinned runtime ${JSON.stringify(pinned.id)} is not installed; refusing to retarget this chat`,
      )
    }
    if (!(await adapter.isAvailable())) {
      throw new Error(
        `pinned runtime ${JSON.stringify(pinned.id)} is down; refusing to retarget this chat`,
      )
    }
```

</details>

**依据 5 · 源码核查**：[src/lark.ts:730-752](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L730-L752)

代理回调写缓冲。

<details>
<summary>查看原文（23行）</summary>

```text
    const session = await adapter.ensureSession(
      chatId,
      cwd,
      (event: BridgeEvent) => {
        switch (event.type) {
          case 'text': {
            const remaining = MAX_BUFFERED_REPLY_CHARS - bufferedChars
            if (remaining > 0) {
              const delta = event.delta.slice(0, remaining)
              buffer += delta
              bufferedChars += delta.length
              if (delta.length < event.delta.length) outputTruncated = true
            } else {
              outputTruncated = true
            }
            break
          }
          case 'final_text':
            if (buffer.length === 0) {
              buffer = event.content.slice(0, MAX_BUFFERED_REPLY_CHARS)
              bufferedChars = buffer.length
              if (buffer.length < event.content.length) outputTruncated = true
            }
```

</details>

**依据 6 · 源码核查**：[src/lark.ts:771-805](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L771-L805)

消息发送与卡片增量。

<details>
<summary>查看原文（35行）</summary>

```text
    await this.channel.stream(
      chatId,
      {
        markdown: async controller => {
          // P1: wrap the user message in bridge metadata blocks so message
          // text is framed as data, never as instructions.
          session.send(
            buildBridgePrompt(effectivePrompt, {
              chatId,
              chatType: msg.chatType,
              senderId: msg.senderId,
              ...(msg.senderName !== undefined ? { senderName: msg.senderName } : {}),
              ...(this.botOpenId !== undefined ? { botOpenId: this.botOpenId } : {}),
              ...(msg.mentions !== undefined && msg.mentions.length > 0
                ? { mentions: msg.mentions }
                : {}),
            }, attachments),
          )
          let shown = ''
          const deadline = Date.now() + this.config.turnTimeoutMs
          // Poll the buffer and push incremental content until the turn ends.
          // A provider that never emits turn/end must not wedge this chat
          // forever; abort the session at the configured hard deadline.
          while (!done) {
            if (Date.now() >= deadline) {
              await adapter.dispose(chatId).catch(err =>
                this.log('warn', 'failed to dispose timed-out session', err),
              )
              throw new Error(`agent turn timed out after ${this.config.turnTimeoutMs}ms`)
            }
            await delay(Math.min(STREAM_FLUSH_MS, Math.max(1, deadline - Date.now())))
            if (buffer !== shown) {
              await controller.setContent(buffer)
              shown = buffer
            }
```

</details>

#### 缺口

- 飞书应用权限、实际连接和事件回执未验证
  **影响**：影响消息能否往返
  **进一步探讨**：用专用测试群及有限权限账户核对允许和拒绝路径

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 允许一个群是否只授权管理员，超时能否撤回已执行动作？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

群聊天在 allowedChats 通过时不再以 senderId 限制成员，因此群资格代表该群成员可走 Agent 路径，owner 权限只用于特定管理命令。默认 accessMode 是 workspace，预设与工具能力由宿主加载；把消息装进协议提示不构成文件权限边界。队列放在当前桥实例，等待消息出队时重新检查授权，已启动任务没有在每一步重做群名单判断。超时分支调用适配器 dispose 并返回错误，源码没有用它回滚之前的文件、外部服务或已送出的卡片。使用可写预设前，应以可观察权限和副作用为约束。

#### 证据与依据

**依据 1 · 源码核查**：[src/access.ts:49-62](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/access.ts#L49-L62)

群白名单按 chatId 允许，无逐成员过滤。

<details>
<summary>查看原文（14行）</summary>

```text
export function decideAccess(
  controls: AccessControls,
  msg: AccessMessage,
): AccessDecision {
  if (controls.ownerId !== undefined && msg.senderId === controls.ownerId) {
    return { ok: true, reason: 'owner' }
  }
  if (msg.chatType === 'group' && controls.allowedChats.includes(msg.chatId)) {
    return { ok: true, reason: 'allowed-chat' }
  }
  if (msg.chatType === 'p2p' && controls.allowedUsers.includes(msg.senderId)) {
    return { ok: true, reason: 'allowed-user' }
  }
  return { ok: false, reason: 'denied' }
```

</details>

**依据 2 · 源码核查**：[src/lark.ts:375-406](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L375-L406)

管理命令限 owner，配置中的群需从配置移除。

<details>
<summary>查看原文（32行）</summary>

```text
          return
        }
        if (!this.isOwner(msg)) {
          await this.reply(msg, '🔒 只有机器人 owner 可以授权群聊。')
          return
        }
        const added = this.allowlist.addChat(msg.chatId)
        await this.reply(
          msg,
          added
            ? `✅ 本群已授权（\`${msg.chatId}\`），立即生效。`
            : `ℹ️ 本群已在授权列表中。`,
        )
        return
      }
      case 'disallow': {
        if (msg.chatType !== 'group') {
          await this.reply(msg, 'ℹ️ `/disallow` 用于撤销群聊授权。')
          return
        }
        if (!this.isOwner(msg)) {
          await this.reply(msg, '🔒 只有机器人 owner 可以撤销授权。')
          return
        }
        if (this.config.allowedChats.includes(msg.chatId)) {
          await this.reply(
            msg,
            'ℹ️ 本群来自环境变量 `DSH_LARK_ALLOWED_CHATS`，命令无法覆盖——请从环境变量中移除。',
          )
          return
        }
        const removed = this.allowlist.removeChat(msg.chatId)
```

</details>

**依据 3 · 源码核查**：[src/config.ts:196-207](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/config.ts#L196-L207)

默认 workspace 和名单解析。

<details>
<summary>查看原文（12行）</summary>

```text
    allowedChats: hasItems(config.allowedChats)
      ? config.allowedChats
      : envList(env.DSH_LARK_ALLOWED_CHATS),
    allowedUsers: hasItems(config.allowedUsers)
      ? config.allowedUsers
      : envList(env.DSH_LARK_ALLOWED_USERS),
    accessMode: parseAccessMode(config.accessMode ?? env.DSH_LARK_ACCESS_MODE, 'workspace'),
    extraPresets: hasKeys(config.extraPresets)
      ? config.extraPresets
      : parsePresetPairs(env.DSH_LARK_EXTRA_PRESETS),
    ssoGatedPresets: hasItems(config.ssoGatedPresets)
      ? config.ssoGatedPresets
```

</details>

**依据 4 · 源码核查**：[src/lark.ts:584-625](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L584-L625)

排队和出队重查。

<details>
<summary>查看原文（42行）</summary>

```text
  private async runAgent(msg: NormalizedMessage, prompt: string): Promise<void> {
    const chatId = msg.chatId
    if (this.busy.has(chatId)) {
      // P2: don't drop — queue per chat, process after the current turn.
      const queue = this.pending.get(chatId) ?? []
      if (queue.length >= MAX_PENDING_PER_CHAT) {
        await this.reply(msg, `📥 队列已满（${MAX_PENDING_PER_CHAT} 条），这条没有入队。`)
        return
      }
      queue.push(msg)
      this.pending.set(chatId, queue)
      await this.reply(msg, '📥 收到，前一条还在处理中，我会接着处理这条。')
      return
    }
    await this.runTurn(msg, prompt)
  }

  /** Run one turn for a chat, then drain the chat's pending queue. */
  private async runTurn(msg: NormalizedMessage, prompt: string): Promise<void> {
    const chatId = msg.chatId
    this.busy.add(chatId)
    try {
      await this.runAgentTurn(msg, prompt, chatId)
    } catch (err) {
      // ensureSession (or any setup step before the stream) can reject; without
      // this the chat's busy flag would stay set forever and every later message
      // would get queued behind a dead turn. Release it here and surface it.
      this.log('error', 'agent turn failed', err)
      await this.reply(msg, `⚠️ Failed to produce a reply: ${String(err)}`).catch(replyErr =>
        this.log('warn', 'could not send turn failure reply', replyErr),
      )
    } finally {
      this.busy.delete(chatId)
      const queue = this.pending.get(chatId)
      const next = queue?.shift()
      if (queue && queue.length === 0) this.pending.delete(chatId)
      if (next) {
        // Re-enter the complete message pipeline: authorization may have been
        // revoked while this item waited, and a queued slash command must stay
        // a command rather than becoming an agent prompt.
        void this.onMessage(next).catch(err =>
          this.log('error', 'queued message handler failed', err),
```

</details>

**依据 5 · 源码核查**：[src/lark.ts:681-695](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L681-L695)

根据权限模式传沙箱及预设。

<details>
<summary>查看原文（15行）</summary>

```text
    const effectivePresetId = presetId ?? this.config.accessMode
    route.sandbox = effectivePresetId === 'read-only'
      ? 'read-only'
      : effectivePresetId === 'workspace'
        ? 'workspace-write'
        : effectivePresetId === 'full'
          ? 'danger-full-access'
          : undefined
    if (presetId !== undefined) {
      const preset = presetNameFor(presetId, this.config.extraPresets)
      if (presetId !== 'full' && preset === undefined) {
        throw new Error(`configured preset ${JSON.stringify(presetId)} is no longer available; refusing to fall back`)
      }
      route.preset = preset
    }
```

</details>

**依据 6 · 源码核查**：[src/lark.ts:789-799](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L789-L799)

硬截止与 dispose。

<details>
<summary>查看原文（11行）</summary>

```text
          let shown = ''
          const deadline = Date.now() + this.config.turnTimeoutMs
          // Poll the buffer and push incremental content until the turn ends.
          // A provider that never emits turn/end must not wedge this chat
          // forever; abort the session at the configured hard deadline.
          while (!done) {
            if (Date.now() >= deadline) {
              await adapter.dispose(chatId).catch(err =>
                this.log('warn', 'failed to dispose timed-out session', err),
              )
              throw new Error(`agent turn timed out after ${this.config.turnTimeoutMs}ms`)
```

</details>

#### 缺口

- 真实 DSH 对各预设、工作区和副作用的隔离
  **影响**：决定群是否能使用写工具
  **进一步探讨**：只在隔离 profile 用合成文件核对工具列表和超时后实际状态

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样观察远程只读路径，什么回执可减少超时后的盲重试？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

需要固定包、兼容 DSH agents、飞书 bot 应用、网络及可用模型。先在隔离 profile 配专用测试群和只读预设，使用公开假素材测试允许、拒绝、回执与掉线；用原 DSH 会话作退路。会话和素材保存在本机，模型调用和持续 bot 运行的开销未知，首次需核对机器人范围，结束后撤回群授权和凭据并检查留存。一个可验证的改进是将超时回执分为未开始、已停止且无已知副作用、结果未知，并附会话和可对照的执行 ID。以故意延迟的模拟执行检查群成员能否先确认状态再重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:52-66](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/index.ts#L52-L66)

有凭据直接连，无凭据走注册。

<details>
<summary>查看原文（15行）</summary>

```text
/**
 * Plugin entry. If credentials are present it wires the Feishu channel and
 * connects; if not, it runs the registration wizard first and connects once it
 * completes. Registers a disposer so a plugin reload or host shutdown tears the
 * channel and every agent down cleanly. A `cancelled` flag makes the wizard
 * path a no-op if the plugin is disposed mid-registration.
 *
 * The whole body is wrapped so that ANY failure here — a config error, an
 * incompatible host API, a bad import surfacing at call time — is logged and
 * contained. A bridge that cannot start must never take the dsh host down
 * with it; the worst outcome is "the bot is offline", never "dsh won't boot".
 */
export function apply(ctx: Context, config: LarkBridgeConfig = {}): void {
  const log = makeLogger(ctx)
  try {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:127-137](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/index.ts#L127-L137)

卸载断连。

<details>
<summary>查看原文（11行）</summary>

```text
          log('info', 'registration complete — connecting to Feishu')
          connect(resolved)
        })
        .catch(err => log('error', 'registration wizard failed', err))
    }

    return async () => {
      cancelled = true
      if (bridge) await bridge.disconnect().catch(err => log('warn', 'disconnect failed', err))
    }
  }, 'lark-bridge.connect()')
```

</details>

**依据 3 · 源码核查**：[src/lark.ts:697-720](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L697-L720)

附件进入本地工作区。

<details>
<summary>查看原文（24行）</summary>

```text
    // Attachments: download images/files into the chat's workspace and hand
    // the paths to the agent (read_image / file reads). Rejections are
    // reported before the turn starts.
    const attachments: BridgePromptAttachment[] = []
    if ((msg.resources?.length ?? 0) > 0) {
      const result = await downloadAttachments(
        this.channel,
        msg.messageId,
        msg.resources,
        join(cwd, '.attachments'),
        this.config.workspaceRoot,
      )
      attachments.push(...result.accepted)
      if (result.rejected.length > 0) {
        const summary = result.rejected
          .map(r => (r.fileName ? `- ${r.fileName}: ${r.reason}` : `- ${r.reason}`))
          .join('\n')
        await this.reply(msg, `⚠️ 部分附件未处理：\n${summary}`)
      }
    }
    // An image-only message has no text — give the agent a stub so the turn
    // still runs (it would otherwise be dropped as "empty").
    const effectivePrompt =
      prompt.length > 0 ? prompt : attachments.length > 0 ? '（对方发来的附件）请查看以下附件。' : prompt
```

</details>

**依据 4 · 源码核查**：[src/lark.ts:789-813](https://github.com/bihangchi9-creator/lark-agent-bridge/blob/5f5468ddf7a283f6f2f2111d105006cb5cfee60b/src/lark.ts#L789-L813)

截止及有限回执。

<details>
<summary>查看原文（25行）</summary>

```text
          let shown = ''
          const deadline = Date.now() + this.config.turnTimeoutMs
          // Poll the buffer and push incremental content until the turn ends.
          // A provider that never emits turn/end must not wedge this chat
          // forever; abort the session at the configured hard deadline.
          while (!done) {
            if (Date.now() >= deadline) {
              await adapter.dispose(chatId).catch(err =>
                this.log('warn', 'failed to dispose timed-out session', err),
              )
              throw new Error(`agent turn timed out after ${this.config.turnTimeoutMs}ms`)
            }
            await delay(Math.min(STREAM_FLUSH_MS, Math.max(1, deadline - Date.now())))
            if (buffer !== shown) {
              await controller.setContent(buffer)
              shown = buffer
            }
          }
          // Final flush. P2: long replies are split at newline boundaries so
          // the streaming card shows the first chunk and the rest arrives as
          // follow-up messages — a truncated reply is a failed deliverable.
          const finalText = errored
            ? `⚠️ ${errored}`
            : buffer.length > 0
              ? `${buffer}${outputTruncated ? '\n\n⚠️ 输出超过安全上限，后续内容已截断。' : ''}`
```

</details>

#### 缺口

- 真实飞书 bot、宿主预设和撤权结果未实测
  **影响**：限制部署决策及退出判断
  **进一步探讨**：在授权测试群验证断开和文件状态，不用生产群

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
