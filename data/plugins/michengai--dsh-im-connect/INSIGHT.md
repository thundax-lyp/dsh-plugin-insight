# dsh-im-connect

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[fb27f2c](https://github.com/MichengAI/dsh-im-connect/tree/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b)

<!-- BEGIN META -->
[![GitHub ★ 136](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=136&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-im-connect) [![npm 30d 68,285](https://img.shields.io/static/v1?label=npm+30d&message=68%2C285&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect)
<!-- END META -->

> **功能**：把多平台即时通讯接入本机 DeepSeek Harness，会话可从聊天续接并回传结果。

> **亮点**：[Q01](#research-q01) 把即时通讯账号下的聊天和话题绑定到宿主会话，聊天发出的任务可回网页查原会话，结果仍回原聊天。[Q03](#research-q03) 将确认未送和送达未知分开处理，提供可查的文本补发记录。

> **主要限制**：[Q02](#research-q02) 私聊普通准入拒绝时仍可尝试消费当前聊天的待审批票据，必须验证旧绑定和授权变化的组合。[Q03](#research-q03) Telegram 游标先落盘可能漏掉崩溃窗口的输入，未知回复也需人工查证。

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
  - [Q01 · 聊天中输入、切回 DSH 网页和原聊天接收结果的最小任务链是什么？](#detail-section-11)
  - [Q02 · IM 发言、命令、审批和管理 API 的鉴权条件各是什么？](#detail-section-12)
  - [Q03 · Telegram 卡住、限流及发送结果未知时，输入与输出各怎样恢复？](#detail-section-13)
  - [Q04 · 账号接入、宿主升级和 Telegram 展示带来哪些条件与维护成本？](#detail-section-14)
  - [Q05 · 何种试用可证实接入值得，哪一条新设计假设可被推翻？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常离开 DSH 网页的用户在手机私聊里提交只读任务、继续追问，再回到同一宿主会话核对完整结果。

继续使用 DSH 网页可保留完整能力，简单单向转发脚本还需另建会话映射和回信。频繁跨入口跟进才有理由承担一个额外机器人账号。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聊天绑定 | 原聊天发任务并回网页检查同一会话 | 按账号、聊天类型及目标键区分 |
| 审批提示 | 在原聊天给出挂起请求和操作选项 | 身份变更与同聊天待审批需独立验证 |
| 文本交付恢复 | 核查待发送或未知的原任务结果 | 绑定有效；未知需人工判断；文件回网页 |
| 账号和频道侧栏 | 管理账号及定位宿主会话 | 需要 Host 认证和 Web 插槽 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Host 服务 | 必需 | 挂载、权限与管理 API | 缺认证方法返回 503，缺会话控制器影响附件 |
| 专用机器人账号和凭据 | 每渠道必需 | 接入目标私聊与 API | 连接失败或被平台限流 |
| 网页侧栏与原会话可访问 | 核对时必需 | 异常时回读正文、文件与会话 | 先停用渠道，回宿主查原始任务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 管理员只接一个隔离私聊和低权限预设 | 确认身份、工作区和原网页会话 |
| 续接 | 用户发送只读任务并在原聊天追问 | 两次输入落同一会话，正文可查 |
| 恢复 | 用户查 /delivery 与宿主日志 | 结果不明先核对原聊天，网页取文件；异常时停收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型、平台配额和宿主资源依部署而定 | 开通账号并核对凭据、工作区、权限 | 仅隔离私聊试验，接入工时待测 |
| 持续 | 额外通道连接与本地状态 | 连接诊断、凭据轮换、宿主升级回归 | 实际频率和耗时未知 |
| 失败 | 可能有重复消息和人工恢复成本 | 查宿主会话、回执和交付记录 | 未知送达不能自动确认为失败 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 异地续接 | 原聊天触发已绑定的 Host 会话，网页可通过插槽打开 | 移动端实测和切换时间 |
| 断线恢复 | 按原绑定和状态恢复可重试文本 | 真实漏发率、重复率及恢复时间 |

> **思考**：[Q02](#research-q02) 私聊普通准入拒绝时仍可尝试消费当前聊天的待审批票据，必须验证旧绑定和授权变化的组合。[Q03](#research-q03) Telegram 游标先落盘可能漏掉崩溃窗口的输入，未知回复也需人工查证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把即时通讯账号下的聊天和话题绑定到宿主会话，聊天发出的任务可回网页查原会话，结果仍回原聊天。[Q03](#research-q03) 将确认未送和送达未知分开处理，提供可查的文本补发记录。

将渠道连接、宿主会话绑定、审批等候和交付状态分别处理。最终回复完成屏障保护回合清理顺序，Telegram 新建与编辑走不同重试条件；可迁移思路依赖宿主回合历史及平台的稳定聊天标识。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 私聊普通准入拒绝时仍可尝试消费当前聊天的待审批票据，必须验证旧绑定和授权变化的组合。[Q03](#research-q03) Telegram 游标先落盘可能漏掉崩溃窗口的输入，未知回复也需人工查证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先在隔离工作区用单渠道私聊提交不含敏感文件的只读任务，同时在网页核对同一会话。权限意外、错绑或重复执行就停收并回到网页。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持宿主会话挂载、原聊天回信和带状态的补发。单渠道效果及审批身份边界待验证，统一审批校验属于未来设计假设。

- 已检查：作者 README、包清单、源码路径 CHANGELOG.zh-CN.md、README.zh-CN.md、client.js、cordis.patch.yml、package.json、src/channels/telegram-retry.ts、src/channels/telegram.ts、src/engine/access.ts、src/engine/deferred-delivery.ts、src/engine/gateway.ts、src/engine/router.ts、src/engine/thinking-display.ts、src/index.ts、src/manager.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦固定版本的 Telegram 入站、Host 会话、审批及出站收口，另读共享管理与 Web 插槽。其他平台逐一回执、同版宿主和移动浏览器运行效果未核验。
- 下一步：使用隔离账号和只读工作区测原会话往返，再分别演练 Telegram 游标后崩溃、远端接收但应答丢失以及拒绝准入的私聊尝试回复待审批。

**分析版本**

- **仓库**：[MichengAI/dsh-im-connect](https://github.com/MichengAI/dsh-im-connect)
- **版本号**：1.0.37（[固定提交 fb27f2c](https://github.com/MichengAI/dsh-im-connect/tree/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可让文本与按钮审批在消费同一票据时重新校验任务发起者和当前准入。若隔离回放仍允许错人批准，或合法审批频繁需要回网页，这项设计假设就不成立。

使用隔离账号和只读工作区测原会话往返，再分别演练 Telegram 游标后崩溃、远端接收但应答丢失以及拒绝准入的私聊尝试回复待审批。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 38 | 5971 | — | — | 117281 |
| .js | source | 79 | 30917 | 29274 | 1356 | — |
| .mjs | source | 4 | 238 | 214 | 3 | — |
| .ts | source | 77 | 16863 | 14751 | 1180 | — |
| .mjs | test | 129 | 22787 | 20860 | 544 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=23&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 23](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=23&color=737b86&logo=github)](https://github.com/MichengAI/dsh-im-connect/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：离开网页的 DSH 用户能否通过自己已有的即时通讯渠道交接同一个任务，并在账号、审批、断线和宿主兼容边界清楚时值得投入试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聊天中输入、切回 DSH 网页和原聊天接收结果的最小任务链是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合已经运行 DSH、经常从手机跟进同一工作区任务的人。以在 Telegram 私聊提交一段文本、继续追问、随后从网页核对完整结果为例，合格结果是两次输入落入同一条 DSH 会话，并在原聊天收到对应正文，同时在网页能打开该会话。原办法是直接登录 DSH 网页继续任务，或者用简单转发脚本把消息送进宿主。网页保留完整能力但需要切换入口，单向脚本还须另外维护会话映射和回信。

Telegram 把聊天与话题映射为内部 chatId 并带上发送者、私聊或群聊类型和更新 ID。网关按账号实例和更新 ID 去重，按账号实例、会话类型与 chatId 查找现存或持久绑定。创建新绑定时路由器先创建 Host agent、关联工作区，再持久化含 cwd 的会话记录，失败会释放句柄。纯文本直接走该绑定的 followup，图片或普通文件走宿主 sessionController.prompt；缺少该接口会报错而不会把附件伪装成正文。最终文本和符合条件的文件回到仍可投递的原聊天。客户端频道插槽用会话 ID 调用宿主打开函数，也将归档、恢复和重命名交还宿主。

可核查增量是聊天与同一宿主会话的双向交接，并保留宿主的模型、工作区和工具执行路径。直接操作网页已能处理低频任务，也能避开机器人维护。管理面和频道侧栏依赖相应 Host 与 Web 壳，手机抽屉内点击能否正确打开尚须实机验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/telegram.ts:688-698](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram.ts#L688-L698)

原始 Telegram chat/thread、发言者与 update ID 被转换成网关消费的消息。

<details>
<summary>查看原文（11行）</summary>

```text
            void handler?.({
              chatId: telegramChatId(message.chat.id, message.message_thread_id),
              userId: message.from ? String(message.from.id) : undefined,
              username: message.from?.username ?? message.from?.first_name,
              text,
              ...(media.length ? { media } : {}),
              kind: direct ? 'dm' : 'group',
              addressed,
              messageId: String(delivery.update_id),
              platformMessageId: String(message.message_id),
            })
```

</details>

**依据 2 · 源码核查**：[src/engine/gateway.ts:456-478](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L456-L478)

入站先去重和检查准入，再查绑定。

<details>
<summary>查看原文（23行）</summary>

```text
  private async handleInbound(channelId: string, msg: ImMessage): Promise<void> {
    const channel = this.channels.get(channelId)
    if (!channel) return
    try {
      if (msg.messageId && this.seen.has(`${channelId}:${msg.messageId}`)) return
      if (msg.messageId) this.seen.add(`${channelId}:${msg.messageId}`)
      const decision = decideAccess({
        userAllowed: this.isAuthorized(channelId, channel, msg),
        kind: msg.kind === 'group' ? 'group' : 'dm',
        addressed: msg.addressed,
      })
      if (decision === 'ignore') return
      if (msg.userId) this.chatActors.set(`${channelId}:${msg.kind === 'group' ? 'group' : 'dm'}:${msg.chatId}`, msg.userId)
      if (decision === 'deny') {
        if (!msg.media?.length && await this.answerApproval(channelId, msg, this.approvalVerdict(msg.text))) return
        await this.rejectUnauthorized(channelId, channel, msg)
        return
      }
      if (!/^\/delivery(?:\s|$)/i.test(msg.text.trim())) void this.recoverDeliveries(channel, msg)
      let text = msg.text.trim()
      const kind: ChatKind = msg.kind === 'group' ? 'group' : 'dm'
      const binding = this.router.lookup(channelId, kind, msg.chatId)
      const selected = this.choices.resolve(channelId, msg, binding?.sessionId, !binding || (!this.questions.has(binding.sessionId) && !this.broker.has(binding.sessionId)))
```

</details>

**依据 3 · 源码核查**：[src/engine/router.ts:80-95](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/router.ts#L80-L95)

同一个键支持读取活动绑定和持久化映射。

<details>
<summary>查看原文（16行）</summary>

```text
  get(channelId: ChannelInstanceId, kind: ChatKind, chatId: string): ChatBinding | undefined {
    return this.live.get(sessionKeyOf(channelId, kind, chatId))
  }

  lookup(channelId: ChannelInstanceId, kind: ChatKind, chatId: string): ChatBinding | undefined {
    const live = this.get(channelId, kind, chatId)
    if (live) return live
    const rec = this.store.get(sessionKeyOf(channelId, kind, chatId))
    if (!rec || rec.detached) return undefined
    return {
      key: sessionKeyOf(channelId, kind, chatId),
      channelId,
      kind,
      chatId,
      sessionId: rec.sessionId,
    }
```

</details>

**依据 4 · 源码核查**：[src/engine/router.ts:513-546](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/router.ts#L513-L546)

创建 Host agent、关联工作区、持久化绑定和失败释放顺序。

<details>
<summary>查看原文（34行）</summary>

```text
  private async create(channelId: ChannelInstanceId, kind: ChatKind, chatId: string, title: string, cwd?: string, signal?: AbortSignal): Promise<ChatBinding> {
    const key = sessionKeyOf(channelId, kind, chatId)
    const sessionId = createImSessionId()
    const config = { ...this.resolveConfig(channelId), ...(cwd ? { cwd } : {}) }
    const handle = await this.createHandle(sessionId, channelId, config)
    try {
      signal?.throwIfAborted()
      await this.attachWorkspace(sessionId, channelId, config.cwd, true)
      signal?.throwIfAborted()
    } catch (error) {
      await this.disposeHandle({ key, channelId, kind, chatId, sessionId, handle })
      throw error
    }
    const record: SessionRecord = {
      sessionId,
      channel: channelId,
      kind,
      chatId,
      title,
      titleSource: 'pending',
      agentPreset: config.agentPreset || 'standard',
      cwd: config.cwd || process.cwd(),
      updatedAt: new Date().toISOString(),
    }
    try {
      this.store.upsert(key, record)
    } catch (error) {
      await this.disposeHandle({ key, channelId, kind, chatId, sessionId, handle })
      throw error
    }
    const binding: ChatBinding = { key, channelId, kind, chatId, sessionId, handle }
    this.live.set(key, binding)
    this.log(`[router] 新建 IM 会话 ${sessionId}`)
    return binding
```

</details>

**依据 5 · 源码核查**：[src/engine/gateway.ts:713-757](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L713-L757)

区分附件经 Host prompt 与文本经 followup，启动交付记录并标记提交边界。

<details>
<summary>查看原文（45行）</summary>

```text
      const binding = await this.router.getOrCreate(channel.id, kind, msg.chatId, title)
      this.router.touch(channel.id, kind, msg.chatId)
      if (initialTitle) this.router.setTitle(binding.sessionId, initialTitle, 'message')
      const content: Array<Record<string, unknown>> = []
      if (msg.text.trim()) content.push({ type: 'text', text: msg.text.trim() })
      for (const media of msg.media ?? []) {
        if (media.kind === 'image') content.push(await imagePromptPart(media))
        else if (media.kind === 'voice-text' && media.text) content.push({ type: 'text', text: `[语音] ${media.text}` })
        else if (media.kind !== 'file' && media.path) content.push({ type: 'text', text: `[附件 ${media.name ?? media.kind}] ${media.path}` })
      }
      const files = msg.media?.filter(media => media.kind === 'file') ?? []
      if (files.length) content.push(...await withReplyLocale(this.ctx, () => filePromptParts(this.ctx, binding.sessionId, files, signal)))
      if (signal.aborted || content.length === 0) return
      if (msg.userId) this.sessionActors.set(binding.sessionId, msg.userId)
      this.interactionMessageIds.set(binding.sessionId, msg.messageId)
      this.streams.reset(`${channel.id}:${msg.chatId}`)
      if (signal.aborted) return
      requestId = crypto.randomUUID()
      this.deferred.begin(requestId, binding.sessionId, channel.id, { ...msg, userId: msg.userId ?? sources[0]?.userId })
      reject = this.progress.begin(binding.sessionId, requestId, items)
      if (content.some(part => part.type === 'image' || part.type === 'file')) {
        // Use Chat's public admission entry: session-local model selection, shared
        // model-switch serialization, and durable attachment validation/storage.
        // Optional lookup preserves text-only operation on older Hosts. Keep
        // strict lookup so a pending or unloading provider is never invoked.
        const controller = (this.ctx as unknown as { get(name: string): unknown }).get('sessionController') as {
          prompt(request: { requestId: string; sessionId: string; mode: SendMode; content: Array<Record<string, unknown>> }, signal: AbortSignal): Promise<unknown>
        } | undefined
        if (!controller?.prompt) throw new ImageInputError('当前 Host 不支持 Chat 图片输入，请升级 DeepSeek Harness。')
        submitted = true
        await controller.prompt({ requestId, sessionId: binding.sessionId, mode: sendMode, content }, signal)
      } else {
        submitted = true
        this.router.followup(binding, {
        id: requestId,
        role: 'user',
        content,
        source: { kind: 'user', rpcId: requestId },
        }, sendMode)
      }
      accepted = true
      this.log(`[${channel.id}] 已注入 ${binding.sessionId}`)
    } catch (error) {
      try { if (requestId) this.deferred.reject(requestId, !submitted) }
      catch { this.log('[im-delivery] 注入失败记录落盘失败，已暂停本进程恢复') }
```

</details>

**依据 6 · 源码核查**：[src/engine/gateway.ts:1392-1415](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L1392-L1415)

最终正文和文件经过不同路径，仅对仍有效的会话回传文件。

<details>
<summary>查看原文（24行）</summary>

```text
        if (this.streams.consumeDelivered(streamKey, sessionId)) {
          this.log(`[${channel.id}] 忽略重复助手消息 ${sessionId}`)
          return
        }
        if (text) {
          outcome.content = true
          markAttempt()
          const bubbles = this.segmentBubbles(channel, text)
          this.log(`[${channel.id}] 准备回复 ${sessionId}，长度 ${text.length}${bubbles.length > 1 ? `，分 ${bubbles.length} 条` : ''}`)
          let delivered = bubbles.length > 1
            ? await this.pauseBeforeSegment(channel.id)
              && await this.deliver(channel, binding.chatId, bubbles[0] ?? text, outcome)
            : await this.deliver(channel, binding.chatId, bubbles[0] ?? text, outcome)
          if (delivered && bubbles.length > 1) delivered = await this.deliverSegments(channel, binding.chatId, bubbles.slice(1), outcome)
          outcome.ok = outcome.ok && delivered
        } else {
          this.log(`[${channel.id}] 助手消息为空 ${sessionId}`)
        }
      } finally {
        const filesOk = await this.fileDelivery.deliver(session, event, () => {
          return !stopped && stillDeliverable() ? { channel, chatId: binding.chatId } : undefined
        }, () => { outcome.content = true; markAttempt() })
        outcome.ok = outcome.ok && filesOk
      }
```

</details>

**依据 7 · 源码核查**：[client.js:6881-6893](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/client.js#L6881-L6893)

侧栏渠道会话操作直接回到 Host。

<details>
<summary>查看原文（13行）</summary>

```text
      ctx.slots.inject("sidebar.channels", () => ctx.slots.register({
          name: "sidebar.channels",
          id: "im-connect-channels",
          locale: IM_LOCALE_NS,
        inject: () => ({
          openSession: (id) => { openHostSession(ctx, id); },
          open: (id) => { openHostSession(ctx, id); },
          archiveSession: (id, options) => archiveHostSession(ctx, id, options),
          unarchiveSession: (id) => unarchiveHostSession(ctx, id),
          forkSession: (id) => forkHostSession(ctx, id),
          renameSession: (sessionId, title) => renameHostSession(ctx, sessionId, title),
        }),
        }, LocalizedChannelRail));
```

</details>

#### 缺口

- 未实机检查网页频道侧栏对移动抽屉中的点击处理
  **影响**：只能确认源码接线，无法保证用户能在手机网页续接
  **进一步探讨**：用固定 Host 在手机浏览器点击已绑私聊会话，并核对网页 ID 与 IM 路由一致

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · IM 发言、命令、审批和管理 API 的鉴权条件各是什么？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

普通私聊默认需要账号白名单，选择允许所有私聊时仍需发送者 ID。群聊普通消息在适配器标记 addressed 后就能进入，普通群发言者没有相同的白名单条件。Telegram 先按提及、回复机器人和该账号的触发策略计算 addressed，群免提及扩大的是消息入口，群成员能否执行斜杠命令要再看账号命令权限。管理 API 使用宿主 connection.requestRejection 做登录、Host 和跨站校验，缺少认证方法时返回 503，变更还走独立请求验证。这个管理鉴权和聊天内的批准条件分别执行。

已绑定且等待审批的私聊存在明确的源码例外。入站普通权限被拒时，网关仍会先尝试识别无附件的批准或拒绝文本；answerApproval 查同一个聊天的当前绑定、待审批和是否已就绪，只在群聊且双方身份都可得时比较发送者和任务发起者。满足这些前提，私聊普通准入拒绝的回复仍能交给 broker。可以从宿主继续已有 IM 会话触发审批来设计反例，无需假设任意外部聊天可直接跨绑。源码也不能据此推出某个平台必然会交付缺 userId 的事件。后端审批等候器只在提示发送成功后激活，取消、提示明确失败和超时都会回到拒绝或取消响应。管理员不宜将群触发条件、命令限制或私聊白名单视为对审批回复的一致授权保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/access.ts:17-34](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/access.ts#L17-L34)

普通消息群聊和私聊准入分支；文件中的另一个审批辅助函数需要结合网关的实际调用判断。

<details>
<summary>查看原文（18行）</summary>

```text
export function decideAccess(input: {
  userAllowed: boolean
  kind?: 'dm' | 'group'
  addressed?: boolean
}): AccessDecision {
  if (input.kind === 'group') {
    return input.addressed === false ? 'ignore' : 'allow'
  }
  return input.userAllowed ? 'allow' : 'deny'
}

/** 工具授权比普通消息更严：必须已在白名单，且只能在私聊里答复。 */
export function canAnswerToolApproval(input: {
  userAllowed: boolean
  kind?: 'dm' | 'group'
}): boolean {
  return input.userAllowed && input.kind !== 'group'
}
```

</details>

**依据 2 · 源码核查**：[src/channels/telegram.ts:626-645](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram.ts#L626-L645)

群触发由频道适配器计算。

<details>
<summary>查看原文（20行）</summary>

```text
          const message = update.message
          if (!message || message.from?.is_bot) continue
          if (!['private', 'group', 'supergroup'].includes(message.chat.type)) continue
          // 话题改名是服务消息，不是对话内容：上报后直接结束，
          // 绝不能送进 agent，否则会产生一个没有输入的空回合。
          if (message.forum_topic_edited) {
            onTopicEdited?.(telegramChatId(message.chat.id, message.message_thread_id), message.forum_topic_edited.name ?? '')
            continue
          }
          const direct = message.chat.type === 'private'
          let addressed = isInboundAddressed({
            direct,
            chatId: message.chat.id,
            replyToBot: String(message.reply_to_message?.from?.id ?? '') === botId,
            mentioned: mentioned(message),
            policy: config.mentionPolicy,
            freeChatGroups: config.freeChatGroups,
          })
          let deliveries = [update]
          if (!direct && message.media_group_id && message.from?.id) {
```

</details>

**依据 3 · 源码核查**：[src/engine/gateway.ts:440-474](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L440-L474)

未授权私聊进入 rejectUnauthorized 前仍可尝试匹配审批文本。

<details>
<summary>查看原文（35行）</summary>

```text
  private isAuthorized(channelId: string, channel: ChannelAdapter, msg: ImMessage): boolean {
    if (msg.userId && this.resolvePrivateAccess(channelId) === 'all') return true
    const local = channel.authorizes?.(msg.userId ?? '')
    if (local === false) return false
    if (local === true) return true
    return this.userAllowed(channelId, msg.userId)
  }

  private async rejectUnauthorized(channelId: string, channel: ChannelAdapter, msg: ImMessage): Promise<void> {
    this.log(`[${channelId}] 拒绝未授权用户 ${msg.userId || '(无 userId)'}`)
    const hint = withReplyLocale(this.ctx, () => this.onUnauthorized?.(channelId, msg) ?? replyText('未授权：请管理员在设置 → IM助理 中批准你的访问。'))
    if (msg.kind !== 'group') {
      await channel.send(msg.chatId, hint).catch(() => undefined)
    }
  }

  private async handleInbound(channelId: string, msg: ImMessage): Promise<void> {
    const channel = this.channels.get(channelId)
    if (!channel) return
    try {
      if (msg.messageId && this.seen.has(`${channelId}:${msg.messageId}`)) return
      if (msg.messageId) this.seen.add(`${channelId}:${msg.messageId}`)
      const decision = decideAccess({
        userAllowed: this.isAuthorized(channelId, channel, msg),
        kind: msg.kind === 'group' ? 'group' : 'dm',
        addressed: msg.addressed,
      })
      if (decision === 'ignore') return
      if (msg.userId) this.chatActors.set(`${channelId}:${msg.kind === 'group' ? 'group' : 'dm'}:${msg.chatId}`, msg.userId)
      if (decision === 'deny') {
        if (!msg.media?.length && await this.answerApproval(channelId, msg, this.approvalVerdict(msg.text))) return
        await this.rejectUnauthorized(channelId, channel, msg)
        return
      }
      if (!/^\/delivery(?:\s|$)/i.test(msg.text.trim())) void this.recoverDeliveries(channel, msg)
```

</details>

**依据 4 · 源码核查**：[src/engine/gateway.ts:494-516](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L494-L516)

斜杠命令单独检查权限。

<details>
<summary>查看原文（23行）</summary>

```text
      if (selected !== undefined) { text = selected; msg = { ...msg, text, actionToken: undefined } }
      if (text.startsWith('/') && !msg.media?.length) {
        if (!canExecuteCommand(this.resolveCommandPermissions(channelId), kind, msg.userId)) {
          await this.deliver(channel, msg.chatId, withReplyLocale(this.ctx, () => replyText('当前聊天未开启命令权限，可以继续正常对话。')))
          return
        }
        const command = text.split(/\s+/, 1)[0]?.toLowerCase()
        const mergeKey = `${channelId}:${kind}:${msg.chatId}`
        if (command === '/stop') { this.merger.cancel(mergeKey); this.mergedMessages.delete(mergeKey) }
        else if (this.merger.has(mergeKey)) {
          await this.deliver(channel, msg.chatId, withReplyLocale(this.ctx, () => replyText('上一条消息正在合并，尚未执行本次命令。等待提交后再发 {0}。', command || '/help')))
          return
        }
        if ((command === '/new' || command === '/clear')
          && binding
          && (this.questions.has(binding.sessionId) || this.broker.has(binding.sessionId))) {
          await this.deliver(channel, msg.chatId, withReplyLocale(this.ctx, () => replyText('请先完成当前问题或审批，再执行 /{0}。', command.slice(1))))
          return
        }
        const reply = await this.handleCommand(channel, msg)
        this.router.touch(channel.id, kind, msg.chatId)
        if (reply) await this.deliver(channel, msg.chatId, reply)
        return
```

</details>

**依据 5 · 源码核查**：[src/engine/gateway.ts:775-803](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L775-L803)

批准词、聊天绑定、等待状态及群聊发言者比较；私聊分支没有再次调用 isAuthorized。

<details>
<summary>查看原文（29行）</summary>

```text
  private approvalVerdict(text: string): boolean | undefined {
    const value = text.trim().toLowerCase()
    if (['批准', '同意', 'yes', 'y', 'allow'].includes(value)) return true
    if (['拒绝', '不同意', 'no', 'n', 'reject', 'deny'].includes(value)) return false
    return undefined
  }

  private async answerApproval(channelId: string, msg: ImMessage, allow: boolean | undefined): Promise<boolean> {
    if (allow === undefined || msg.media?.length) return false
    const binding = this.router.lookup(channelId, msg.kind === 'group' ? 'group' : 'dm', msg.chatId)
    if (!binding) return false
    if (!this.broker.has(binding.sessionId)) return false
    // 群聊里只让发起当前任务的人批准，其他成员即使能发言也不能替其决定。
    if (msg.kind === 'group') {
      const actor = this.sessionActors.get(binding.sessionId)
      if (actor && msg.userId && msg.userId !== actor) {
        await this.channels.get(channelId)?.send(msg.chatId, notice(this.ctx, '只有发起当前任务的用户可以批准或拒绝。')).catch(() => undefined)
        return true
      }
    }
    if (!this.broker.isReady(binding.sessionId)) {
      await this.channels.get(channelId)?.send(msg.chatId, notice(this.ctx, '审批详情仍在发送，请稍后再回复。')).catch(() => undefined)
      return true
    }
    this.interactionMessageIds.set(binding.sessionId, msg.messageId)
    const ok = this.broker.answer(binding.sessionId, allow)
    if (ok) await this.channels.get(channelId)?.send(msg.chatId, withReplyLocale(this.ctx, () => allow ? replyText('已批准。') : replyText('已拒绝。')))
    return ok
  }
```

</details>

**依据 6 · 源码核查**：[src/engine/gateway.ts:812-858](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L812-L858)

绑定宿主审批、推送提示后启用，处理失败和超时。

<details>
<summary>查看原文（47行）</summary>

```text
  private async handleApproval(req: ApprovalRequestLike, next: () => Promise<unknown>): Promise<unknown> {
    const currentContract = req.agent !== undefined
    const rawSessionId = req.agent?.session?.id ?? req.agent?.id ?? req.session?.id
    const sessionId = rawSessionId ? String(rawSessionId) : ''
    if (!sessionId || !this.router.bindingForSession(sessionId)) return next()
    const refused = currentContract ? 'rejected' : { behavior: 'reject' as const }
    const cancelled = currentContract ? 'cancelled' : { behavior: 'reject' as const }
    if (req.signal?.aborted) return cancelled
    return await this.runInteraction(sessionId, async () => {
      if (this.disposed || req.signal?.aborted) return cancelled
      const binding = this.router.bindingForSession(sessionId)
      const channel = binding ? this.channels.get(binding.channelId) : undefined
      if (!binding || !channel) return refused
      // 只记录真实发言人；不能拿 chatId 冒充用户，否则群聊会把发起者判成外人。
      const knownActor = this.sessionActors.get(sessionId)
        ?? this.chatActors.get(`${binding.channelId}:${binding.kind}:${binding.chatId}`)
      if (knownActor) this.sessionActors.set(sessionId, knownActor)
      const prompt = await withReplyLocale(this.ctx, () => this.approvalPrompt(req))
      const wait = this.broker.wait(sessionId, APPROVAL_WAIT_MS, req.signal)
      if (!wait) return refused
      const ticket = this.broker.token(sessionId)
      const delivery = await this.retryInteraction(channel, () => this.deliverInteraction(channel, binding.chatId, prompt, req.signal, {
        sessionId, message: { chatId: binding.chatId, userId: knownActor ?? binding.chatId, kind: binding.kind, text: '', messageId: this.interactionMessageIds.get(sessionId) },
        choices: withReplyLocale(this.ctx, () => [{ label: replyText('批准一次'), value: 'allow' }, { label: replyText('拒绝'), value: 'reject' }]),
        valid: () => this.broker.token(sessionId) === ticket && this.broker.isReady(sessionId),
      }))
      if (delivery.status === 'aborted' || req.signal?.aborted) {
        this.broker.cancel(sessionId)
        if (delivery.deliveredAny) await this.announceInteractionCancelled(channel, binding.chatId, '审批')
        return cancelled
      }
      if (delivery.status === 'failed') {
        this.broker.cancel(sessionId)
        return refused
      }
      this.broker.activate(sessionId)
      const verdict = await wait
      if (req.signal?.aborted) {
        if (delivery.deliveredAny) await this.announceInteractionCancelled(channel, binding.chatId, '审批')
        return cancelled
      }
      if (verdict === 'allow') return currentContract ? 'allowed-once' : { behavior: 'allow' }
      if (verdict === 'reject') return currentContract ? 'rejected' : { behavior: 'reject' }
      if (verdict === 'timeout' && delivery.deliveredAny && !this.disposed) {
        await this.announceApprovalTimedOut(channel, binding.chatId)
      }
      return cancelled
```

</details>

**依据 7 · 源码核查**：[src/manager.ts:892-918](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/manager.ts#L892-L918)

Web 管理路由调用活动宿主认证服务，缺少该能力时直接 503。

<details>
<summary>查看原文（27行）</summary>

```text
    const basePath = '/api/michengai/dsh-im-connect'
    const dispose = webServer.register({
      kind: 'prefix',
      path: basePath,
      handler: async (req, res) => {
        try {
          // 动态读取活动服务，并保留 requestRejection 的 this 绑定。
          const connection = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) as {
            requestRejection?: (request: { headers: typeof req.headers }) => 401 | 403 | undefined
          } | undefined
          if (typeof connection?.requestRejection !== 'function') {
            send(res, 503, { ok: false, error: '宿主认证服务尚未就绪或版本不支持；请稍后重试或升级宿主。 / Retry or upgrade DSH to enable authenticated management.' })
            return
          }
          const rejection = connection.requestRejection(req)
          if (rejection !== undefined) {
            send(res, rejection, { ok: false, error: rejection === 401 ? '请先登录 DSH / Sign in to DSH first' : '宿主拒绝此 Host 或跨站请求 / Host or cross-site request forbidden' })
            return
          }
          const requestError = validateApiMutation(req)
          if (requestError) { send(res, requestError.status, { ok: false, error: requestError.error }); return }
          const url = new URL(req.url ?? '/', 'http://localhost')
          if (url.pathname !== basePath && !url.pathname.startsWith(basePath + '/')) {
            send(res, 404, { ok: false, error: 'not found' })
            return
          }
          await dispatch(req.method ?? 'GET', url.pathname.slice(basePath.length), () => readJson(req), (status, body) => send(res, status, body))
```

</details>

#### 缺口

- 旧私聊绑定在权限配置变化后仍能触发并消费挂起审批的实际可达性、各适配器的发送者完整度尚未联调
  **影响**：涉及工具副作用的采用必须等待隔离验证
  **进一步探讨**：在可丢弃 Host 中创建私聊绑定，改变准入后从网页同会话触发无副作用审批，再用被拒聊天发允许文本，核对 broker 与工具执行记录

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · Telegram 卡住、限流及发送结果未知时，输入与输出各怎样恢复？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Telegram getUpdates 的服务端等待为 25 秒，代码另以 35 秒尝试预算包住 fetch 和 JSON 读取，生命周期停机也会取消尝试。常规错误等待 3 秒，同 token 多实例的 409 迹象等待 15 秒，外层还看护意外退出。游标在处理消息之前保存，进程在写游标后、任务进入宿主前崩溃时可能漏一条输入。用户看到机器人在线也无法从该状态判断这一条消息已提交。

回复端将新建消息和编辑既有消息区别对待。仅确认拒收的 429 可以自动重试新建操作；编辑既有消息可重试暂态错误，曾出现可能落地的编辑时，即使之后明确拒收也不会将整次操作降为可新建兜底。收口用每会话队列把最终回复完成屏障排在 turn/end 清理之前，并检查旧清理是否撞上更新回合，减少最终长文还在发送时被清理的窗口。对于流式收口失败，网关保留未知，并提示查交付记录。

冷启动从宿主持久历史找原请求及回合的文本。恢复器按会话串行，校验账号、聊天与原绑定，按分片保存偏移，恢复前将上次的 sending 视为 unknown；只有尚未开始或明确可重试的记录自动处理。发起者可用 /delivery 查询或人工显式补发，未知状态人工重发可能重复，补发只读取原结果文本，文件应回网页。适配器缺乏可主动投递的连接时依赖原聊天下一条消息刷新目标，无法用 Telegram 的轮询或重试行为推定其他平台。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/telegram.ts:56-59](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram.ts#L56-L59)

Telegram 每次长轮询请求的完整预算。

```text

const API = 'https://api.telegram.org'
const POLL_REQUEST_TIMEOUT_MS = 35_000

```

**依据 2 · 源码核查**：[src/channels/telegram.ts:594-612](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram.ts#L594-L612)

长轮询和本地游标先于 handler，形成可观察的丢输入窗口。

<details>
<summary>查看原文（19行）</summary>

```text
  async function pollLoop(): Promise<void> {
    while (!stopped) {
      try {
        // Bound the complete fetch + JSON await even if a transport ignores abort.
        // This attempt-local signal also cancels the request, never its parent lifecycle.
        // Late results/rejections are observed by fileOperation but cannot reach dispatch.
        const signal = timeoutSignal(POLL_REQUEST_TIMEOUT_MS, lifecycle?.signal)
        const updates = await fileOperation(api<TgUpdate[]>('getUpdates', {
          offset,
          timeout: 25,
          allowed_updates: ['message', 'callback_query'],
        }, POLL_REQUEST_TIMEOUT_MS, { signal }), signal)
        lastError = ''
        for (const update of updates) {
          if (stopped) break
          // Telegram offset 是 at-most-once 取舍：先确认游标可避免崩溃重启后重复驱动 agent，代价是极端情况下丢一条未完成消息。
          offset = update.update_id + 1
          if (persist) cursorFile.write({ offset })
          if (update.callback_query) {
```

</details>

**依据 3 · 源码核查**：[src/channels/telegram.ts:701-726](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram.ts#L701-L726)

轮询错误退避和外层看护。

<details>
<summary>查看原文（26行）</summary>

```text
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error)
        log(`[telegram] 轮询错误: ${lastError}`)
        if (stopped) break
        // 409 是「同一个 bot token 还有另一个实例在 getUpdates」：3s 一次的抢轮询只会放大冲突，
        // 也把真正的原因淹在日志里。退到 15s 复查，等另一个实例自己让出。
        const conflicting = /Conflict|terminated by other getUpdates/i.test(lastError)
        await sleepWithSignal(conflicting ? 15_000 : 3000, lifecycle?.signal).catch(() => undefined)
      }
    }
  }

  /**
   * 轮询外层看护：pollLoop 内部已按 3s 重试常规网络抖动，
   * 这里只兜住循环自身意外退出的情况——否则 channels.json 里会一直显示「轮询中」，
   * 实际却再也没有 getUpdates 在跑。
   */
  async function supervisePoll(): Promise<void> {
    while (!stopped) {
      try {
        await pollLoop()
        return
      } catch (error) {
        if (stopped) return
        lastError = error instanceof Error ? error.message : String(error)
        log(`[telegram] 轮询循环退出: ${lastError}，5s 后重启`)
```

</details>

**依据 4 · 源码核查**：[src/channels/telegram-retry.ts:32-55](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/channels/telegram-retry.ts#L32-L55)

新建只在确认限流时重试；编辑先前结果不明会抑制新建兜底。

<details>
<summary>查看原文（24行）</summary>

```text
/** 新建操作只重试明确限流，编辑已有消息可重试临时错误。 */
export async function retryTelegram<T>(operation: (signal: AbortSignal) => Promise<T>, options: TelegramRetryOptions = {}): Promise<T> {
  const delays = options.delaysMs ?? [1000, 3000, 8000]
  const budget = options.budgetMs ?? 90_000
  const deadline = Date.now() + budget
  const signal = timeoutSignal(budget, options.signal)
  let ambiguous = false
  for (let attempt = 0; ; attempt++) {
    signal.throwIfAborted()
    try { return await operation(signal) }
    catch (error) {
      signal.throwIfAborted()
      const limited = error instanceof DeliveryRejected && (error as { status?: number }).status === 429
      const canRetry = options.edit ? isTelegramTransient(error) : limited
      // 先前编辑可能已经落地，不能让后来的明确拒收触发新消息兜底。
      const finalError = () => ambiguous && (error as { rejected?: boolean })?.rejected === true
        ? new Error(error instanceof Error ? error.message : 'telegram delivery unknown', { cause: error }) : error
      if (!canRetry || attempt >= delays.length) throw finalError()
      const retryAfterMs = Number((error as { retryAfterMs?: number }).retryAfterMs)
      const delay = Math.max(delays[attempt]!, Number.isFinite(retryAfterMs) && retryAfterMs > 0 ? retryAfterMs : 0)
      if (Date.now() + delay >= deadline) throw finalError()
      if (!limited) ambiguous = true
      options.log?.(`[telegram] ${options.method ?? 'delivery'} 临时发送失败，${delay / 1000}s 后重试（${attempt + 1}/${delays.length}）`)
      await sleepWithSignal(delay, signal)
```

</details>

**依据 5 · 源码核查**：[src/engine/gateway.ts:1090-1139](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L1090-L1139)

回合守卫、最终消息处理屏障和终态清理按会话排序。

<details>
<summary>查看原文（50行）</summary>

```text
    const statusEvent = !!channel?.beginReply && channel.replyStatus === true && ['tool/call', 'tool/result'].includes(event.type ?? '')
    const deliveryEvent = statusEvent || ['assistant/chunk', 'assistant/message', 'turn/end'].includes(event.type ?? '')
    if (deliveryEvent && this.deferred.coldTurn(id, turn)) {
      this.thinking.cancelTurn(id, turn)
      return Promise.resolve()
    }
    const tracked = this.deferred.turnEntries(id, turn)
    const unavailable = !!channel?.canDeliverDeferred && !channel.canDeliverDeferred()
    const invalid = tracked.some(entry => entry.status === 'blocked' || !this.validDelivery(entry))
    if (invalid) for (const entry of tracked) if (entry.status !== 'sent') this.deferred.patch(entry.id, { status: 'blocked' })
    const skip = (unavailable || invalid) && deliveryEvent
    if (skip) this.thinking.cancelTurn(id, turn)
    if (!binding || !channel || this.router.isMuted(id)) this.thinking.cancelSession(id)
    if (skip && statusEvent && binding) this.streams.discard(`${binding.channelId}:${binding.chatId}`, id)
    const trackedEnd = event.type === 'turn/end' && this.progress.hasTurn(id, event.data?.turn)
    // Register the optional thinking final before progress closes its delivery list.
    // Otherwise normal settlement makes the still-pending final look like a cold turn.
    if (event.type !== 'turn/end') this.progress.event(id, event)
    const outcome: DeliveryOutcome = { ok: !skip, content: false }
    const deferEnd = event.type === 'turn/end' && this.replyFinalization.keys().includes(id)
    const process = () => skip ? Promise.resolve() : this.processSessionEvent(session, event, outcome, trackedEnd)
    let work: Promise<void>
    if (event.type === 'assistant/message') {
      // Start now, registering content before a synchronous turn/end; queue only its barrier.
      const delivery = process()
      // Observe rejection immediately, even when a previous finalization is still pending.
      void delivery.catch(() => undefined)
      work = this.replyFinalization.run(id, () => delivery)
    } else if (event.type === 'turn/end') {
      work = this.replyFinalization.run(id, () => {
        const currentTurn = this.observedTurns.get(id)
        // A queued old cleanup must not discard a newer turn's stream or thinking display.
        const newerTurn = turn !== undefined && currentTurn !== undefined && currentTurn > turn
        const ending = newerTurn ? Promise.resolve() : process()
        // process() synchronously registers thinking-final delivery before closing progress.
        this.progress.event(id, event)
        return ending
      })
    } else {
      work = process()
    }
    if (event.type === 'assistant/message' && event.surfaceOp === 'append') {
      this.progress.delivery(id, event.data?.turn, work.then(
        () => !outcome.ok ? (outcome.definite ? 'rejected' as const : false) : outcome.content ? true : undefined,
        () => false,
      ))
    }
    const handled = work.catch(error => { this.log(`[im-progress] 会话回复失败: ${error instanceof Error ? error.name : 'Error'}`) })
    // Delivery owns settlement; never hold the event producer behind a slow platform request.
    return deferEnd ? Promise.resolve() : handled
```

</details>

**依据 6 · 源码核查**：[src/engine/gateway.ts:1363-1388](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L1363-L1388)

流式收口异常保留未知而停止后续片。

<details>
<summary>查看原文（26行）</summary>

```text
          if (finalText) {
            outcome.content = true
            markAttempt()
            // 分段回复：第一条沿用既有流式收口（QQ 等渠道的 finish 就是发一条），
            // 其余按间隔逐条补发；第一条也等一个随机间隔，免得刚说完就弹出来。
            // 中途失败按「已送出过」处理，避免整条重发。
            const bubbles = this.segmentBubbles(channel, finalText)
            let delivered = true
            if (bubbles.length > 1 && !await this.pauseBeforeSegment(channel.id)) return
            try {
              await taken.stream.finish(bubbles[0] ?? finalText)
            } catch (error) {
              // 请求可能已经到达渠道，不能自动补一份重复回复。
              this.log(`[${channel.id}] 流式收口结果未知，请通过 /delivery 查询: ${error instanceof Error ? error.message : String(error)}`)
              delivered = false
              outcome.ok = false
              this.streams.markDelivered(streamKey, sessionId)
            }
            if (delivered && bubbles.length > 1) {
              if (!await this.deliverSegments(channel, binding.chatId, bubbles.slice(1), outcome)) {
                delivered = false
                this.streams.markDelivered(streamKey, sessionId)
              }
            }
            outcome.ok = outcome.ok && delivered
            if (delivered) this.streams.markDelivered(streamKey, sessionId)
```

</details>

**依据 7 · 源码核查**：[src/engine/deferred-delivery.ts:51-70](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/deferred-delivery.ts#L51-L70)

恢复 sending 为 unknown，状态按本地文件落盘。

<details>
<summary>查看原文（20行）</summary>

```text
      if (parsed.version !== 1 || !Array.isArray(parsed.entries)) throw new Error('Invalid delivery journal')
      for (const entry of parsed.entries) {
        if (typeof entry.id !== 'string' || typeof entry.sessionId !== 'string' || typeof entry.channelId !== 'string'
          || typeof entry.message?.chatId !== 'string' || !['dm', 'group'].includes(entry.message.kind)
          || !Number.isFinite(entry.createdAt) || !Number.isSafeInteger(entry.offset) || entry.offset < 0
          || !['waiting', 'ready', 'sending', 'sent', 'unknown', 'blocked', 'expired', 'rejected'].includes(entry.status)
          || (entry.message.userId !== undefined && typeof entry.message.userId !== 'string')
          || (entry.turn !== undefined && !Number.isSafeInteger(entry.turn))
          || this.entries.some(e => e.id === entry.id)
          || (entry.parts !== undefined && (!Array.isArray(entry.parts) || !entry.parts.every((p: unknown) => typeof p === 'string') || entry.offset > entry.parts.length))
          || (entry.text !== undefined && typeof entry.text !== 'string')) throw new Error('Invalid delivery record')
        if (entry.status === 'sending') entry.status = 'unknown'
        this.entries.push(entry)
      }
      this.flush()
    } catch (error) {
      if ((error as { code?: string }).code !== 'ENOENT') throw error
    }
  }
  private flush(): void { if (this.file) writeFileAtomicSync(this.file, JSON.stringify({ version: 1, entries: this.entries }), 0o600) }
```

</details>

**依据 8 · 源码核查**：[src/engine/deferred-delivery.ts:139-175](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/deferred-delivery.ts#L139-L175)

重新核对记录、偏移和连接，明确区分可恢复及未知。

<details>
<summary>查看原文（37行）</summary>

```text
  async recover(id: string, read: (entry: DeferredEntry) => Promise<{ text: string; turn?: number } | undefined>, valid: (entry: DeferredEntry) => boolean,
    send: (entry: DeferredEntry, text: string) => Promise<void>, chunks: (text: string) => string[], explicit = false): Promise<'missing' | 'unavailable' | undefined> {
    const sessionId = this.entries.find(e => e.id === id)?.sessionId ?? id
    return this.queue.run(sessionId, async () => {
      const entry = this.entries.find(e => e.id === id)
      if (!entry || this.active.has(id) || this.quarantined.has(id)) return
      const originalStatus = entry.status
      const pausedRetry = explicit && ['unknown', 'blocked'].includes(originalStatus)
      if (!pausedRetry && !['waiting', 'ready'].includes(entry.status)) return
      if (Date.now() - entry.createdAt > 7 * 86400_000) { this.patch(id, { status: 'expired' }); return }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      if (!entry.text) {
        let result: { text: string; turn?: number } | undefined
        try { result = await read({ ...entry }) }
        catch (error) { if (explicit) return 'unavailable'; throw error }
        if (!result) return explicit ? 'missing' : undefined
        if (entry.status !== originalStatus) return
        this.patch(id, { text: result.text, turn: result.turn ?? entry.turn, status: 'ready' })
      }
      if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
      const duplicate = this.entries.find(e => e.id !== id && e.sessionId === entry.sessionId && e.turn !== undefined && e.turn === entry.turn && ['sent', 'unknown', 'sending'].includes(e.status))
      if (duplicate && !explicit) { this.patch(id, { status: duplicate.status === 'sent' ? 'sent' : 'unknown' }); return }
      if (!entry.parts) this.patch(id, { parts: chunks(entry.text!) })
      const parts = entry.parts!
      if (!parts.length) { this.patch(id, { status: 'sent' }); return }
      for (let index = entry.offset; index < parts.length; index++) {
        if (!valid(entry)) { this.patch(id, { status: 'blocked' }); return }
        this.patch(id, { status: 'sending' })
        try { await send(entry, parts[index]!) }
        catch (error) {
          // 只有适配器明确确认请求未提交时才保留自动恢复资格。
          this.patch(id, { status: error instanceof DeliveryUnavailable ? 'ready' : 'unknown' })
          return
        }
        const blocked = (entry.status as string) === 'blocked'
        this.patch(id, { offset: index + 1, status: blocked ? 'blocked' : index + 1 === parts.length ? 'sent' : 'ready' })
        if (blocked) return
```

</details>

**依据 9 · 源码核查**：[src/engine/gateway.ts:581-637](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L581-L637)

按绑定核查恢复目标、冷热路径及显式命令的用户可见边界。

<details>
<summary>查看原文（57行）</summary>

```text
  private validDelivery(entry: DeferredEntry): boolean {
    const channel = this.channels.get(entry.channelId)
    if (this.disposed || !channel) return false
    const binding = this.router.lookup(entry.channelId, entry.message.kind ?? 'dm', entry.message.chatId)
    return binding?.sessionId === entry.sessionId && decideAccess({ userAllowed: this.isAuthorized(entry.channelId, channel, entry.message), kind: entry.message.kind, addressed: true }) === 'allow'
  }

  private async recoverDelivery(entry: DeferredEntry, fresh = false, explicit = false): Promise<'missing' | 'unavailable' | undefined> {
    return this.deferred.recover(entry.id, async current => {
      const signal = AbortSignal.any([this.recoveryScope.signal, AbortSignal.timeout(30_000)])
      const result = await readDeliveryHistory(this.ctx, current.sessionId, current.id, signal, this.channels.get(current.channelId)?.skipInterimText)
      if (!result) return undefined
      return withReplyLocale(this.ctx, () => ({ turn: result.turn, text: [result.text ? replyText('补发此前任务的结果（不会重新执行任务）：') : '', result.text,
        result.kind === 'completed' ? replyText('此前任务已完成。文件请在原会话查看。') : result.kind === 'error' ? replyText('此前任务失败，已生成的内容保留。') : replyText('此前任务已停止，已生成的内容保留。')].filter(Boolean).join('\n\n') }))
    }, current => this.validDelivery(current), async (current, text) => {
      const channel = this.channels.get(current.channelId)
      if (!channel || (!fresh && !channel.canDeliverDeferred?.())) throw new DeliveryUnavailable()
      await channel.send(current.message.chatId, text)
    }, text => splitText(text, Math.max(1, (this.channels.get(entry.channelId)?.maxMessageLength ?? 2000) - 32)), explicit)
  }

  private async recoverDeliveries(channel?: ChannelAdapter, message?: ImMessage): Promise<void> {
    if (this.recovering || this.disposed) return
    this.recovering = true
    try {
      const pending = this.deferred.list(channel?.id, message).filter(entry => ['waiting', 'ready'].includes(entry.status))
      const start = message ? 0 : this.recoveryCursor % Math.max(1, pending.length)
      const batch = [...pending.slice(start), ...pending.slice(0, start)].slice(0, 20)
      this.recoveryCursor = start + batch.length
      for (const entry of batch) {
        if (this.disposed) break
        try { await this.recoverDelivery(entry, !!message) }
        catch (error) { this.log(`[im-delivery] 单条记录暂时无法恢复: ${error instanceof Error ? error.name : 'Error'}`) }
      }
    } catch (error) { this.log(`[im-delivery] 补发检查失败: ${error instanceof Error ? error.name : 'Error'}`) }
    finally { this.recovering = false }
  }

  private async deliveryCommand(channel: ChannelAdapter, message: ImMessage): Promise<string> {
    return withReplyLocale(this.ctx, async () => {
      const args = message.text.trim().split(/\s+/).slice(1)
      const entries = this.deferred.list(channel.id, message)
      if (args.length) {
        const entry = entries.find(item => item.id === args[1])
        if (args.length !== 2 || args[0] !== 'retry' || !entry) return replyText('用法：/delivery；补发指定结果：/delivery retry 记录ID。记录仅属于当前聊天和发起人。')
        if (!this.validDelivery(entry)) return replyText('无法补发：请先恢复原会话绑定及访问权限。不会发送到其他会话。')
        const result = await this.recoverDelivery(entry, true, true)
        if (result) return replyText('暂未找到可补发的结果，本次未发送，自动补发状态未改变。可稍后重试，或在网页查看原会话。')
      }
      const current = this.deferred.list(channel.id, message).slice(-10).reverse()
      if (!current.length) return replyText('没有近期交付记录。直接发送消息开始任务；查看最近记录：/history。')
      const states = {
        rejected: replyText('未提交任务，不需要补发'), waiting: replyText('等待原任务结果'), ready: replyText('等待渠道可发送'), sending: replyText('正在补发'), sent: replyText('已发送'),
        unknown: replyText('送达未知，自动补发已暂停'), blocked: replyText('绑定或权限已变化，补发已暂停'), expired: replyText('已过期，请在网页查看原会话'),
      }
      return [replyText('最近交付记录（最多 10 条，保留 7 天）：'), ...current.map(entry => `${entry.id} — ${states[entry.status]}`), '',
        replyText('补发：/delivery retry 记录ID。送达未知的结果可能重复；只补发文字，不重新执行任务，文件请在网页查看。')].join('\n')
```

</details>

#### 缺口

- 实际 Bot API 回执丢失、限流、崩溃窗口的发生频率未知
  **影响**：无法估计漏发重复率或人工恢复负担
  **进一步探讨**：用隔离 token 模拟平台已收件但调用方断开，以及游标落盘后杀进程，核对 IM 与宿主的任务、分片和回执

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 账号接入、宿主升级和 Telegram 展示带来哪些条件与维护成本？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

包通过 Cordis patch 挂入宿主，入口依赖 agents、模型、权限预设、凭据、webServer 等服务。Node 声明为 22.19+ 的 22 系列或 24+，DSH 声明从 0.2.0-rc.1 到 0.3.0 预发布边界之前；固定开发依赖主要是 0.2.2-rc.2。作者在更新日志中声明完成该宿主兼容验证，实质联调环境和结果仍待自行核对。Web 界面接入宿主设置、语言和侧栏插槽，旧自更新 UI 和后端在本版本树中已移除，升级管理按作者说明走宿主管理。管理服务 503 和附件服务缺失是可区分的版本问题。

首次接入需要管理员选定工作区和权限预设、为平台提供账号或 Bot Token、按场景配置命令权限及私聊准入。运行中有账号启停、连接诊断、凭据轮换、宿主升级回归和日志排查；凭据优先走宿主凭据服务，管理器提供本地文件回退实现，但入口注入 credentials，因此不能据文件回退断言缺服务的宿主一定可加载。停止接收或断开会停适配器，移除账号还清理秘密引用、白名单和待授权项。宿主卸载回调释放 API、配对和引擎，并为已排队渠道操作安排停止。退出需核对网页会话和外部平台已有消息，平台消息的撤回不在上述移除路径。

Telegram 可选择把模型思考内容以折叠消息发出。显示状态受会话、回合、当前目标和取消信号约束，缓冲长度和发出频率都有上限。群内可见成员仍能展开该消息，折叠只降低默认展开的显示面积。它是与最终答复独立的交付，试用可关闭并记录文本回传和恢复指标；不能把少发思考或状态请求误写成模型成本下降。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:66-93](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/package.json#L66-L93)

Node、Host 范围、依赖及预发布测试声明。

<details>
<summary>查看原文（28行）</summary>

```text
  "scripts": {
    "build": "tsc -p tsconfig.json && node scripts/copy-client.mjs",
    "test": "npm run build && node --test tests/*.test.mjs",
    "prepublishOnly": "npm test"
  },
  "license": "Apache-2.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
  "dependencies": {
    "@larksuiteoapi/node-sdk": "^1.36.0",
    "@tencent-connect/qqbot-connector": "^1.2.0",
    "@wecom/aibot-node-sdk": "^1.0.7",
    "dingtalk-stream": "^2.1.4",
    "qrcode": "^1.5.4",
    "undici": "^6.29.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-agent": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-locale": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.2.0-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.2",
    "react": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[package.json:100-131](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/package.json#L100-L131)

开发锁定版本与 manifest 的宿主、Web 接线。

<details>
<summary>查看原文（32行）</summary>

```text
  "devDependencies": {
    "@deepseek-ai/cordis": "4.1.0",
    "@deepseek-ai/dsh-agent": "0.2.2-rc.2",
    "@deepseek-ai/dsh-client-locale": "0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.2.2-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.2.2-rc.2",
    "@deepseek-ai/dsh-error": "0.2.2-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.2.2-rc.2",
    "@deepseek-ai/schemastery": "3.19.0",
    "@types/node": "^22.10.0",
    "@types/qrcode": "^1.5.6",
    "esbuild": "^0.25.0",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "typescript": "5.9.3",
    "@deepseek-ai/dsh-llm": "0.2.2-rc.2"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:15-24](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/index.ts#L15-L24)

包入口声明注入的 Host 服务。

<details>
<summary>查看原文（10行）</summary>

```text
export const name = 'dsh-im-connect'
export const inject = [
  'webServer',
  'credentials',
  'agents',
  'agentPresets',
  'agentDefaultModel',
  'llm',
  'permissionPresets',
  'systemPrompt',
```

</details>

**依据 4 · 源码核查**：[src/index.ts:135-143](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/index.ts#L135-L143)

生命周期中注册 API、启用已配置账号及清理。

```text
  ctx.effect(() => {
    manager.registerApi(ctx)
    // 卸载或初始化失败后不再恢复会话；保留一个完整异常链，避免后台拒绝终止宿主。
    void manager.initEnabled().then(() => manager.attachMappedSessions()).catch(error => {
      fileLog.append(`${new Date().toISOString()} [boot] 初始化失败: ${error instanceof Error ? error.message : String(error)}\n`)
    })
    log(`[boot] apply 完成 ${Date.now() - applyStarted}ms`)
    return () => { manager.disposeApi(); void fileLog.flush() }
  }, 'im-connect.serve')
```

**依据 5 · 源码核查**：[src/manager.ts:310-329](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/manager.ts#L310-L329)

持久状态和凭据服务与文件 vault 的分支。

<details>
<summary>查看原文（20行）</summary>

```text
    this.ctx = options.ctx
    this.engineConfig = options.engineConfig
    this.stateDir = options.stateDir
    this.file = join(options.stateDir, 'channels.json')
    this.sessions = new SessionMapStore(join(options.stateDir, 'sessions.json'))
    this.log = options.log
    this.load()
    this.applyAssistant(this.store.assistant)
    this.applyWorkspace(this.store.cwd)
    this.applyPermission(this.store.permission)
    this.migrateAccountSettings()
    const seen = new SeenStore(join(options.stateDir, 'seen.json'))
    const credentials = (options.ctx as Context & { credentials?: CredentialService }).credentials
    this.vault = credentials
      ? createServiceVault(credentials)
      : createFileVault(join(options.stateDir, 'secrets.json'))
    this.engine = new ImEngine(options.ctx, this.sessions, seen, options.engineConfig, options.log, (accountId, msg) => {
      this.requestAuthorization(accountId, msg)
      return replyText('未授权：请管理员在设置 → IM助理 中批准你的访问。')
    }, (accountId) => this.accountEngineConfig(accountId), (accountId) => this.store.channels[accountId]?.privateAccess === 'all' ? 'all' : 'approved', (accountId) => normalizeCommandPermissions(this.store.channels[accountId]?.commandPermissions), join(options.stateDir, 'deferred-delivery.json'), undefined, join(options.stateDir, 'topic-titles.json'))
```

</details>

**依据 6 · 源码核查**：[src/manager.ts:537-594](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/manager.ts#L537-L594)

停止接收、断开和移除账号有不同状态及凭据操作。

<details>
<summary>查看原文（58行）</summary>

```text
  async setReceive(id: string, receiveEnabled: boolean): Promise<{ ok: boolean; error?: string }> {
    const accountId = this.resolveAccountId(id)
    if (!accountId) return { ok: false, error: '账号不存在' }
    return this.channelOperations.run(accountId, () => this.setReceiveNow(accountId, receiveEnabled))
  }

  private async setReceiveNow(id: string, receiveEnabled: boolean): Promise<{ ok: boolean; error?: string }> {
    const state = this.store.channels[id]
    if (!state?.enabled) return { ok: false, error: '渠道未配置' }
    state.receiveEnabled = receiveEnabled
    this.flush()
    if (!receiveEnabled) await this.stopOne(id)
    else if (!this.running.has(id)) await this.startOne(id)
    return { ok: true }
  }

  async disconnect(id: string): Promise<void> {
    const accountId = this.resolveAccountId(id)
    if (!accountId) return
    await this.channelOperations.run(accountId, () => this.disconnectNow(accountId))
  }

  private async disconnectNow(id: string): Promise<void> {
    const state = this.store.channels[id]
    if (state) {
      state.enabled = false
      state.receiveEnabled = false
      this.flush()
    }
    await this.stopOne(id)
  }

  async remove(id: string): Promise<void> {
    const accountId = this.resolveAccountId(id)
    if (!accountId) return
    await this.channelOperations.run(accountId, () => this.removeNow(accountId))
  }

  private async removeNow(id: string): Promise<void> {
    await this.stopOne(id)
    const state = this.store.channels[id]
    if (!state) return
    const platform = this.platformOf(id, state)
    if (platform === 'weixin') {
      clearWeixinLogin(this.accountStateDir(id, platform))
      await this.vault.unset(credentialRef(id, 'botToken'))
    }
    for (const field of CHANNEL_META[platform].fields.filter((item) => item.secret)) {
      const ref = state?.config?.[`${field.key}Ref`] || credentialRef(id, field.key)
      await this.vault.unset(ref)
    }
    delete this.store.channels[id]
    this.proxyUrlCache.delete(id)
    delete this.store.allowlist[id]
    delete this.store.pending[id]
    this.engine.clearAllowed(id)
    this.flush()
  }
```

</details>

**依据 7 · 源码核查**：[src/manager.ts:929-938](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/manager.ts#L929-L938)

卸载会中止诊断、移除路由及停用渠道。

<details>
<summary>查看原文（10行）</summary>

```text
  disposeApi(): void {
    this.disposed = true
    this.diagnosticAbort.abort()
    for (const dispose of this.apiDisposers) dispose()
    this.apiDisposers = []
    this.pairing.dispose()
    const activeIds = new Set([...this.running.keys(), ...this.channelOperations.keys()])
    for (const id of activeIds) void this.channelOperations.run(id, () => this.stopOne(id))
    this.engine.dispose()
  }
```

</details>

**依据 8 · 源码核查**：[src/engine/thinking-display.ts:69-117](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/thinking-display.ts#L69-L117)

可选思考展示的当前目标、缓冲与频率约束。

<details>
<summary>查看原文（49行）</summary>

```text
    if (config.mode !== 'collapsed' || !target.channel.sendThinking || !target.isCurrent()) return
    this.states.set(target.key, {
      target, config, scope: new AbortController(), streamId: `${target.sessionId}:${this.identity}:${++this.generation}`,
      prefix: '', total: 0, closed: false, final: false,
    })
  }

  append(target: ThinkingDisplayTarget, text: string): void {
    if (!text) return
    let state = this.states.get(target.key)
    if (!state) {
      const identity = this.identities.get(target.key)
      // Only a start event can replace an already observed lifecycle.
      if (identity) return
      this.start(target)
      state = this.states.get(target.key)
    }
    if (!state || !this.matches(state, target) || state.final || !this.valid(state)) return
    // Count Unicode scalars, including a surrogate pair split between frames.
    let count = 0
    for (const _ of text) count++
    const first = text.charCodeAt(0)
    const joins = state.high !== undefined && first >= 0xdc00 && first <= 0xdfff
    state.total += count - (joins ? 1 : 0)
    let addition = text
    if (state.high !== undefined && !state.closed) addition = String.fromCharCode(state.high) + text
    state.high = undefined
    if (!state.closed) {
      const last = addition.charCodeAt(addition.length - 1)
      if (last >= 0xd800 && last <= 0xdbff) {
        state.high = last
        addition = addition.slice(0, -1)
      }
      const room = 4096 - state.prefix.length
      let prefix = addition.slice(0, room)
      const end = prefix.charCodeAt(prefix.length - 1)
      if (end >= 0xd800 && end <= 0xdbff) prefix = prefix.slice(0, -1)
      // Copy the bounded slice: do not keep a large frame's backing string alive.
      state.prefix += Array.from(prefix).join('')
      if (addition.length > room) state.closed = true
    }
    // Keep split-pair count metadata even after the bounded prefix is full.
    const last = text.charCodeAt(text.length - 1)
    state.high = last >= 0xd800 && last <= 0xdbff ? last : undefined
    if (state.total < state.config.minChars) return
    const now = this.now()
    if (state.lastAt !== undefined && now - state.lastAt < state.config.intervalMs) return
    state.lastAt = now
    this.send(state, false)
```

</details>

**依据 9 · 作者声明**：[README.zh-CN.md:304-312](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/README.zh-CN.md#L304-L312)

作者明确说明折叠对可见成员仍可展开，并与最终回复分开。

````text
    mode: collapsed   # off | collapsed
    minChars: 120     # 累计到这个字数才发第一条
    intervalMs: 2000  # 两次刷新的最小间隔
    maxChars: 3500    # 单条上限，超出截断并注明
  ```
- **渠道与界面支持**：目前由 Telegram 实现，可在「设置 → IM助理 → Telegram 账号」中通过「展示思考过程」下拉选择「折叠展示」一键开启；其他渠道会忽略该配置，只保留原有状态行。
- **边界与隐私**：折叠是客户端展示，不是访问控制，群内所有能看到消息的人均能点击展开思考内容。请只在明确允许公开展示思维链的部署中开启；思考消息不会被算作最终答案的送达或自动补发内容。
- **资源与生命周期**：关闭或渠道不支持时不缓存思考原文；开启时每回合最多保留 4096 个 UTF-16 单元的前缀和总字数。刷新合并为最新快照，停止、换绑、静音、卸载及下一回合会阻止过期输出。
- **参数范围**：`minChars` 为 0–4096（结束时同样适用），`intervalMs` 为 1000–60000，`maxChars` 为 200–4096；超界值收敛到范围，非有限数字使用默认值。实际 HTML 转义、标题、标签与截断提示均计入预算，不切开 emoji 代理对。
````

**依据 10 · 作者声明**：[CHANGELOG.zh-CN.md:3-8](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/CHANGELOG.zh-CN.md#L3-L8)

作者声明完成 0.2.2-rc.2 兼容验证。

```text
## [1.0.37] - 2026-11-12

### 兼容性与依赖升级

- 完成 DeepSeek Harness `0.2.2-rc.2` 全量兼容验证，支持范围涵盖 `0.2.0-rc.1` 至 `0.2.2-rc.2` 及后续同代预发布版本。
- 对齐开发依赖至官方 `0.2.2-rc.2` 与 Schemastery `3.19.0`，并同步更新说明文档中的已验证版本列表与 CI 契约测试范围（覆盖 `0.2.0-rc.1` 至 `0.2.1-rc.5`）。
```

**依据 11 · 作者声明**：[CHANGELOG.zh-CN.md:19-24](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/CHANGELOG.zh-CN.md#L19-L24)

作者描述移动抽屉会话入口的修改。

```text
## [1.0.34] - 2026-11-09

### 移动端侧栏交互与频道会话打开体验优化

- 修复移动端下频道会话点击无法进入的问题：在手机端或抽屉外壳中展开「频道」页签时，点击任意即时通讯会话行，能够准确唤起并进入对应的通讯对话，不再被误当成普通任务会话（#65）。
- 修复移动端抽屉下侧栏快捷入口显示双图标的问题：在移动端或浮层抽屉中展开左侧导航时，即时通讯管理入口恢复单枚专属图标与自然文字间距，不再重复渲染两个图标。
```

**依据 12 · 作者声明**：[CHANGELOG.zh-CN.md:41-47](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/CHANGELOG.zh-CN.md#L41-L47)

作者描述本地化覆盖和将版本管理移交 Host。

```text
## [1.0.31] - 2026-11-09

### 全语言国际化支持与插件中心体验对齐

- 全面支持官方 8 门语言：完整支持简体中文、英语、日语、西班牙语、法语、德语、俄语与葡萄牙语（巴西），包括插件市场简介与即时通讯管理面板的全部界面文案，跨语言切换自然顺畅。
- 详情与使用说明文档对齐：优化插件市场与插件中心的详情文档路由，非中文环境默认展示完整的英文使用手册，方便全球用户查阅接入指引。
- 管理界面精简与对齐官方生态：移除设置面板内冗余的自制更新入口与开关，版本升级与生命周期完全由 DSH 官方插件管理统一接管，保持设置面板专注高效。
```

#### 缺口

- 各 Host 版本的认证、侧栏、附件接入及卸载后状态无本轮验收
  **影响**：不能承诺跨版本一致，升级可能增加运维
  **进一步探讨**：在拟用 Host 版本验证 503、文件回传、侧栏打开和卸载后无残余轮询并核对可恢复会话

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何种试用可证实接入值得，哪一条新设计假设可被推翻？

**研究主题**：采用判断、新假设与验证、贡献与相对优势

#### 完整回答

建议从隔离私聊验证只读文本任务。选已经每天需要离开 DSH 网页跟进任务的用户，统一工作区与模型，让他们分别用网页和 Telegram 完成同一项可核对任务，例如读取沙箱内的公开文件并回传固定摘要。要求原聊天续问和网页打开指向同一会话、回信可见且不重复执行。记录切页次数、到首个可接受结果的时间、管理员接入分钟数以及有缺失时的恢复时间，保持模型和操作权限一致。若发生错绑、授权条件异常、重复执行或需要频繁回网页排障，就停用账号并回网页。文件、群聊和高权限任务等候专项验收。

未验证的设计假设是将审批资格绑定到本次任务发起者与当前准入状态，在消费回复时由网关再次核对，并把可选按钮和普通文本回复使用同一票据。当前等候器的 token 能判定旧按钮失效，但文本批准走聊天当前待审批状态，私聊拒绝分支仍可提前尝试。验证时对照当前路径和统一核对路径，分别演练合法发起人、准入变化、群中他人、无发送者和提示超时。若合法审批多出大量回网页动作，或准入变化后的错误批准仍未被拦住，就不能接受这项设计。保持试用的 DSH 权限预设不允许有副作用工具，以免把假设验证变成对真实资源的操作。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/gateway.ts:456-478](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L456-L478)

试用须单独检查准入与会话绑定，拒绝分支仍可尝试审批。

<details>
<summary>查看原文（23行）</summary>

```text
  private async handleInbound(channelId: string, msg: ImMessage): Promise<void> {
    const channel = this.channels.get(channelId)
    if (!channel) return
    try {
      if (msg.messageId && this.seen.has(`${channelId}:${msg.messageId}`)) return
      if (msg.messageId) this.seen.add(`${channelId}:${msg.messageId}`)
      const decision = decideAccess({
        userAllowed: this.isAuthorized(channelId, channel, msg),
        kind: msg.kind === 'group' ? 'group' : 'dm',
        addressed: msg.addressed,
      })
      if (decision === 'ignore') return
      if (msg.userId) this.chatActors.set(`${channelId}:${msg.kind === 'group' ? 'group' : 'dm'}:${msg.chatId}`, msg.userId)
      if (decision === 'deny') {
        if (!msg.media?.length && await this.answerApproval(channelId, msg, this.approvalVerdict(msg.text))) return
        await this.rejectUnauthorized(channelId, channel, msg)
        return
      }
      if (!/^\/delivery(?:\s|$)/i.test(msg.text.trim())) void this.recoverDeliveries(channel, msg)
      let text = msg.text.trim()
      const kind: ChatKind = msg.kind === 'group' ? 'group' : 'dm'
      const binding = this.router.lookup(channelId, kind, msg.chatId)
      const selected = this.choices.resolve(channelId, msg, binding?.sessionId, !binding || (!this.questions.has(binding.sessionId) && !this.broker.has(binding.sessionId)))
```

</details>

**依据 2 · 源码核查**：[src/engine/gateway.ts:782-803](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L782-L803)

文本回复消费当前待审批状态及有限的身份条件。

<details>
<summary>查看原文（22行）</summary>

```text
  private async answerApproval(channelId: string, msg: ImMessage, allow: boolean | undefined): Promise<boolean> {
    if (allow === undefined || msg.media?.length) return false
    const binding = this.router.lookup(channelId, msg.kind === 'group' ? 'group' : 'dm', msg.chatId)
    if (!binding) return false
    if (!this.broker.has(binding.sessionId)) return false
    // 群聊里只让发起当前任务的人批准，其他成员即使能发言也不能替其决定。
    if (msg.kind === 'group') {
      const actor = this.sessionActors.get(binding.sessionId)
      if (actor && msg.userId && msg.userId !== actor) {
        await this.channels.get(channelId)?.send(msg.chatId, notice(this.ctx, '只有发起当前任务的用户可以批准或拒绝。')).catch(() => undefined)
        return true
      }
    }
    if (!this.broker.isReady(binding.sessionId)) {
      await this.channels.get(channelId)?.send(msg.chatId, notice(this.ctx, '审批详情仍在发送，请稍后再回复。')).catch(() => undefined)
      return true
    }
    this.interactionMessageIds.set(binding.sessionId, msg.messageId)
    const ok = this.broker.answer(binding.sessionId, allow)
    if (ok) await this.channels.get(channelId)?.send(msg.chatId, withReplyLocale(this.ctx, () => allow ? replyText('已批准。') : replyText('已拒绝。')))
    return ok
  }
```

</details>

**依据 3 · 源码核查**：[src/engine/gateway.ts:829-847](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L829-L847)

按钮已绑定等待票据及 ready；它是统一核对假设的参照。

<details>
<summary>查看原文（19行）</summary>

```text
      const prompt = await withReplyLocale(this.ctx, () => this.approvalPrompt(req))
      const wait = this.broker.wait(sessionId, APPROVAL_WAIT_MS, req.signal)
      if (!wait) return refused
      const ticket = this.broker.token(sessionId)
      const delivery = await this.retryInteraction(channel, () => this.deliverInteraction(channel, binding.chatId, prompt, req.signal, {
        sessionId, message: { chatId: binding.chatId, userId: knownActor ?? binding.chatId, kind: binding.kind, text: '', messageId: this.interactionMessageIds.get(sessionId) },
        choices: withReplyLocale(this.ctx, () => [{ label: replyText('批准一次'), value: 'allow' }, { label: replyText('拒绝'), value: 'reject' }]),
        valid: () => this.broker.token(sessionId) === ticket && this.broker.isReady(sessionId),
      }))
      if (delivery.status === 'aborted' || req.signal?.aborted) {
        this.broker.cancel(sessionId)
        if (delivery.deliveredAny) await this.announceInteractionCancelled(channel, binding.chatId, '审批')
        return cancelled
      }
      if (delivery.status === 'failed') {
        this.broker.cancel(sessionId)
        return refused
      }
      this.broker.activate(sessionId)
```

</details>

**依据 4 · 源码核查**：[src/engine/gateway.ts:619-637](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/engine/gateway.ts#L619-L637)

异常时可以检查原任务并比较人工恢复成本。

<details>
<summary>查看原文（19行）</summary>

```text
  private async deliveryCommand(channel: ChannelAdapter, message: ImMessage): Promise<string> {
    return withReplyLocale(this.ctx, async () => {
      const args = message.text.trim().split(/\s+/).slice(1)
      const entries = this.deferred.list(channel.id, message)
      if (args.length) {
        const entry = entries.find(item => item.id === args[1])
        if (args.length !== 2 || args[0] !== 'retry' || !entry) return replyText('用法：/delivery；补发指定结果：/delivery retry 记录ID。记录仅属于当前聊天和发起人。')
        if (!this.validDelivery(entry)) return replyText('无法补发：请先恢复原会话绑定及访问权限。不会发送到其他会话。')
        const result = await this.recoverDelivery(entry, true, true)
        if (result) return replyText('暂未找到可补发的结果，本次未发送，自动补发状态未改变。可稍后重试，或在网页查看原会话。')
      }
      const current = this.deferred.list(channel.id, message).slice(-10).reverse()
      if (!current.length) return replyText('没有近期交付记录。直接发送消息开始任务；查看最近记录：/history。')
      const states = {
        rejected: replyText('未提交任务，不需要补发'), waiting: replyText('等待原任务结果'), ready: replyText('等待渠道可发送'), sending: replyText('正在补发'), sent: replyText('已发送'),
        unknown: replyText('送达未知，自动补发已暂停'), blocked: replyText('绑定或权限已变化，补发已暂停'), expired: replyText('已过期，请在网页查看原会话'),
      }
      return [replyText('最近交付记录（最多 10 条，保留 7 天）：'), ...current.map(entry => `${entry.id} — ${states[entry.status]}`), '',
        replyText('补发：/delivery retry 记录ID。送达未知的结果可能重复；只补发文字，不重新执行任务，文件请在网页查看。')].join('\n')
```

</details>

**依据 5 · 源码核查**：[src/manager.ts:537-566](https://github.com/MichengAI/dsh-im-connect/blob/fb27f2cb84a17d76b1c3486e22c2c7c927b8c55b/src/manager.ts#L537-L566)

单渠道试验可停止接收或断开。

<details>
<summary>查看原文（30行）</summary>

```text
  async setReceive(id: string, receiveEnabled: boolean): Promise<{ ok: boolean; error?: string }> {
    const accountId = this.resolveAccountId(id)
    if (!accountId) return { ok: false, error: '账号不存在' }
    return this.channelOperations.run(accountId, () => this.setReceiveNow(accountId, receiveEnabled))
  }

  private async setReceiveNow(id: string, receiveEnabled: boolean): Promise<{ ok: boolean; error?: string }> {
    const state = this.store.channels[id]
    if (!state?.enabled) return { ok: false, error: '渠道未配置' }
    state.receiveEnabled = receiveEnabled
    this.flush()
    if (!receiveEnabled) await this.stopOne(id)
    else if (!this.running.has(id)) await this.startOne(id)
    return { ok: true }
  }

  async disconnect(id: string): Promise<void> {
    const accountId = this.resolveAccountId(id)
    if (!accountId) return
    await this.channelOperations.run(accountId, () => this.disconnectNow(accountId))
  }

  private async disconnectNow(id: string): Promise<void> {
    const state = this.store.channels[id]
    if (state) {
      state.enabled = false
      state.receiveEnabled = false
      this.flush()
    }
    await this.stopOne(id)
```

</details>

#### 缺口

- 未对照运行网页与私聊流程，也未实现和测量统一审批资格假设
  **影响**：无法确认节时和审批负担净变化
  **进一步探讨**：先做无副作用同任务对照，随后用模拟审批回合单独验证发起者和准入组合

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
