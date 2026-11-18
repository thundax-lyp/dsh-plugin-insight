# DSH IM Connect

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[5194e32](https://github.com/MichengAI/dsh-im-connect/tree/5194e32e4e9150cbdc08fe05070c253429c1c06d)

<!-- BEGIN META -->
[![npm 30d 69,170](https://img.shields.io/static/v1?label=npm+30d&message=69%2C170&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect) [![最新发布 2026-11-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-17&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-im-connect)
<!-- END META -->

> **功能**：将 Telegram、飞书、钉钉等即时通讯渠道接入本机 DeepSeek Harness，会话可从聊天继续并在网页查看。

> **亮点**：[Q01](#research-q01) 授权聊天按账号和目标接入现有 Host 会话，用户可以在手机端所在的聊天继续追问，再回网页核对。飞书的复合目标键把多个主题分到不同会话，减少并行任务的上下文混淆 [Q02](#research-q02)。

> **主要限制**：[Q02](#research-q02) 飞书的会话隔离与输出可见范围各有条件。线程发送明确被拒时，回退分支可把正文、按钮或折叠过程卡发回群大厅。普通准入拒绝仍可能走私聊文本审批分支 [Q03](#research-q03)。

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
  - [Q01 · 经常离开网页的 DSH 用户怎样在聊天中续办任务并核对原会话？](#detail-section-11)
  - [Q02 · 飞书群的话题如何绑定会话，平台明确拒绝话题回复时还能保证原话题可见范围吗？](#detail-section-12)
  - [Q03 · 飞书线程卡片按钮与文本审批各绑定谁，普通准入拒绝后仍可能走哪条分支？](#detail-section-13)
  - [Q04 · 飞书原生思考过程如何开始、追加和关闭，什么时候降级为折叠卡？](#detail-section-14)
  - [Q05 · 断线或主动静默后如何区分任务和消息送达，补发会重复跑任务吗？](#detail-section-15)
  - [Q06 · 配置入口到实际账号重载有哪些依赖与成本，声明支持哪些 Host？](#detail-section-16)
  - [Q07 · 谁适合低权限试用，如何验证统一的审批门槛能否缩小授权差异？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常离开网页的 DSH 用户，可从手机私聊委托一次不含敏感文件的只读任务，继续追问并在网页核对原会话。

使用原生网页时，移动端仍能开同一网页会话。渠道桥接提供了已有聊天中的入口及回包，但引入机器人账号的权限、消息回退和交付风险。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 渠道接入 | 在聊天发起或继续 Host 任务 | 需要可用账号、准入及有效会话 |
| 飞书话题键 | 分开普通群和线程内任务 | 依赖事件字段和账号配置；发送回退可回群 |
| 卡片选择 | 将按钮点击送回所属会话 | 校验作用域和期限；与文本审批存在差异 |
| 交付收据 | 查文本送达状态或人工补发 | 仅原绑定和授权范围；文件回网页 |
| 过程卡 | 按回合发送原生气泡或折叠消息 | 默认关闭，有平台权限及回退限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19.0 或 ≥24、支持的 DSH 0.2 RC 系列 | 宿主配置 | 加载插件、绑定会话权限 | 验证实际发布包和宿主版本 |
| Host Web、Agents、Credentials 和权限注入 | 启动必需 | 会话映射、管理和运行 | 管理认证服务缺失时返回 503 |
| 渠道机器人、凭据和相应 SDK | 对应渠道必需 | 接收和返回 IM 消息 | 停止接收或无法发布消息 |
| Host sessionController | 图片和文件输入时必需 | 校验后持久化并排队 | 文本和附件路径行为不同 |
| 飞书真实根消息及权限 | 在线程内回复时必需 | 将回包送回话题 | 明确拒绝等分支可能转群大厅 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理者核对 Host 与账号允许范围，关闭过程展示 | 接入专用机器人和隔离私聊 |
| 发起 | 指定用户发一条只读摘要及追问 | 回包和网页会话应相互对应 |
| 异常 | 参照交付记录和网页，必要时暂停接收 | 查明任务是否执行再考虑补发文本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH 宿主、渠道与模型账号 | 配置授权单用户及隔离目录 | 各平台开通费用和时间未知 |
| 持续 | 长连接、进程状态与模型耗用 | 凭据轮换、宿主升级回归 | 连接稳定性和维护频率未知 |
| 失败恢复 | 可能重复文本或遗漏输入 | 查宿主、平台事件及交付收据 | 真实恢复时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 移动续办 | 复用按账号和目标绑定的 Host 会话 | 移动体验和跨端回归 |
| 飞书并行话题 | 复合目标键影响会话身份 | 实际租户发送拒绝和旧绑定行为 |
| 文本补发 | 读取原会话文本，未知不自动补发 | 各渠道真实漏发与重复率 |

> **思考**：[Q02](#research-q02) 飞书的会话隔离与输出可见范围各有条件。线程发送明确被拒时，回退分支可把正文、按钮或折叠过程卡发回群大厅。普通准入拒绝仍可能走私聊文本审批分支 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 授权聊天按账号和目标接入现有 Host 会话，用户可以在手机端所在的聊天继续追问，再回网页核对。飞书的复合目标键把多个主题分到不同会话，减少并行任务的上下文混淆 [Q02](#research-q02)。

[Q05](#research-q05) 通道连接、宿主绑定与投递终态各有状态。最终回复屏障可避免同步终态先清理正在收口的数据，无法替代上游确认。[Q04](#research-q04) 过程详情按回合、聊天和流隔离，原生事件和折叠卡的降级要以真实回执检验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 飞书的会话隔离与输出可见范围各有条件。线程发送明确被拒时，回退分支可把正文、按钮或折叠过程卡发回群大厅。普通准入拒绝仍可能走私聊文本审批分支 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q07](#research-q07) 先以隔离工作区、单渠道私聊和无敏感内容的只读任务核对同一 Host 会话。若发生错绑、重复、意外审批或出串投递，停收该账号并在网页查原会话。处理群任务前先核对 [Q02](#research-q02) 的回退目的地。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已订正飞书话题隔离的边界，复核原生过程、按钮入口、宿主兼容声明和已有投递。版本条件及回执均为固定源码所见。统一票据校验是待验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/engine/router.ts、src/engine/gateway.ts、lib/client.js、src/channels/feishu.ts、README.zh-CN.md、src/engine/choices.ts、src/index.ts、src/channels/telegram.ts、src/engine/assistant-text.ts、src/manager.ts、.github/workflows/test.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码范围包括 Telegram 入站、回合、恢复，飞书线程与卡片、原生过程及管理入口。其他平台逐一实际权限、全部附件、语言变体、订阅配置、CI 远端结果均未独立验证。
- 下一步：选择一个获准测试账号和固定 Host 进行只读接受测试。让非当前操作者尝试旧按钮，模拟原线程根消息删除并观察最终接收地。保持关闭真实过程数据输出，先用合成内容核对回执。

**分析版本**

- **仓库**：[MichengAI/dsh-im-connect](https://github.com/MichengAI/dsh-im-connect)
- **版本号**：1.0.44（[固定提交 5194e32](https://github.com/MichengAI/dsh-im-connect/tree/5194e32e4e9150cbdc08fe05070c253429c1c06d)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 在文本和按钮消耗审批票据时校验当前准入、发起者和绑定版本，有望降低授权通路不一致。回放撤权及线程切换，记录拒绝、错放和正常审批转回网页的比例。

选择一个获准测试账号和固定 Host 进行只读接受测试。让非当前操作者尝试旧按钮，模拟原线程根消息删除并观察最终接收地。保持关闭真实过程数据输出，先用合成内容核对回执。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 38 | 6269 | — | — | 121918 |
| .js | source | 79 | 31702 | 30001 | 1404 | — |
| .mjs | source | 4 | 238 | 214 | 3 | — |
| .ts | source | 77 | 17445 | 15250 | 1220 | — |
| .mjs | test | 136 | 24705 | 22438 | 676 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-18），可前往 [GitHub Issues](https://github.com/MichengAI/dsh-im-connect/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：经授权的 IM 消息怎样延续同一个 DSH 任务，飞书线程隔离和可选过程展示如何影响会话、收件人及失败恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 经常离开网页的 DSH 用户怎样在聊天中续办任务并核对原会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

对于已在 DSH 工作、需要从手机发送一条只读指令后回到网页核查结果的人，插件将机器人账号实例、聊天类型和目标 ID 映射到 Host 会话。路由优先重用内存绑定，其次按持久记录尝试恢复。原会话暂不可恢复且宿主仍知道它时保留绑定并报错；确认归档或不再存在才走轮换逻辑。通过准入后，文本使用同一会话跟进接口，图像或文件则走 Host 的 sessionController.prompt，以取得附件校验与存储。Web 插槽提供频道入口，方便回到宿主查看文件和历史。相比从手机反复开网页或让机器人另开一套会话，这减少了重述任务和搬运上下文。当前命令、会话与附件链依赖同一账号和 Host 能力；切换账号、话题键或 Host 不再保有会话都会改变恢复条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/router.ts:80-94](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/router.ts#L80-L94)

按账号、类型、目标查实时绑定或持久记录。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/engine/router.ts:193-225](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/router.ts#L193-L225)

按账号串行恢复，无法证明旧会话消失时不直接另开。

<details>
<summary>查看原文（33行）</summary>

```text
  async getOrCreate(channelId: ChannelInstanceId, kind: ChatKind, chatId: string, title: string): Promise<ChatBinding> {
    return this.channelOperations.run(channelId, () => this.getOrCreateNow(channelId, kind, chatId, title))
  }

  private async getOrCreateNow(channelId: ChannelInstanceId, kind: ChatKind, chatId: string, title: string): Promise<ChatBinding> {
    const key = sessionKeyOf(channelId, kind, chatId)
    const live = this.live.get(key)
    if (live?.handle) {
      if (this.isArchived(live.sessionId)) {
        this.log(`[router] 当前会话已归档，轮换 ${live.sessionId}`)
        return this.rotateNow(channelId, kind, chatId, title)
      }
      return live
    }
    const saved = this.store.get(key)
    if (saved) {
      if (this.isArchived(saved.sessionId)) {
        this.log(`[router] 映射会话已归档，轮换 ${saved.sessionId}`)
        return this.rotateNow(channelId, kind, chatId, title)
      }
      const resumed = await this.resume(saved)
      if (resumed) {
        this.live.set(key, resumed)
        return resumed
      }
      const known = await this.knownSessionIds()
      if (known === undefined || known.has(saved.sessionId)) {
        throw new Error(replyText('当前会话暂时无法恢复，已保留原绑定，请稍后重试。'))
      }
      this.log(`[router] 无法恢复会话，轮换 ${saved.sessionId}`)
      return this.rotateNow(channelId, kind, chatId, title)
    }
    return this.create(channelId, kind, chatId, title)
```

</details>

**依据 3 · 源码核查**：[src/engine/gateway.ts:740-763](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L740-L763)

记录请求，文本及附件分别进入实际宿主接口。

<details>
<summary>查看原文（24行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[lib/client.js:7024-7054](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/lib/client.js#L7024-L7054)

实际注册 Web 设置和侧栏频道。

<details>
<summary>查看原文（31行）</summary>

```text
      ctx.slots.inject("settings.section", () => {
        settingsSlotInjected = true;
        syncSettingsSection();
        return () => {
          unmountSettingsSection();
          settingsSlotInjected = false;
        };
      });

      installSettingsIconSlot(ctx, sidebarController, ImNavIcon);

      if (sidebarController && typeof sidebarController.onLocationChange === "function") {
        sidebarController.onLocationChange(() => syncSettingsSection());
      }

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

      // 频道会话行前显示所属频道品牌标，和定时任务的时钟图标同一套 leading 槽位。
      ctx.slots.inject("sidebar.session.row.leading", () => ctx.slots.register({
```

</details>

#### 缺口

- 没有同一用户在手机与网页完成任务的对照
  **影响**：切换次数可解释，耗时和成功率无实测
  **进一步探讨**：在隔离工作区完成同一任务的两轮追问并核对网页会话 ID

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 飞书群的话题如何绑定会话，平台明确拒绝话题回复时还能保证原话题可见范围吗？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

群消息先要求提到当前机器人的 open_id。真实话题事件拥有 thread_id 时，跟帖优先取 root_id，首帖可取自身 message_id；普通群只在账号开启 threadSessions 且有 root_id 时划分，私聊总用原聊天键。该后缀拼进 chatId 和串行队列键，宿主会话按该复合键隔离。发送解析复合键后，优先在根消息上 reply 并用 reply_in_thread。收到非限流业务拒绝、传入 omt_ 类非消息标识或 SDK 无 reply 时，代码可调用 create 将同一正文发往原群大厅。限流和抛出的网络错误沿错误路径上报。思考折叠卡片新建也复用这条发送函数。README 写到过程绝不出串，源码却保留回群分支；话题键隔离保护会话上下文，不能单靠它推断回包可见范围。把话题当边界的群任务应先核对拒绝时的目标，优先使用测试私聊，避免向业务群传入内部内容。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/feishu.ts:743-761](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L743-L761)

实际条件决定群话题复合键，私聊不附后缀。

<details>
<summary>查看原文（19行）</summary>

```text
          const message = data.message
          if (!message) return
          const group = message.chat_type === 'group'
          const addressed = !group || isFeishuBotMentioned(message.mentions, botOpenId)
          if (!addressed || !message.chat_id || !current()) return
          const rawChatId = message.chat_id
          // 原生话题群/话题串认真实根消息 ID（跟帖取 root_id，首贴取自身 message_id）；
          // 普通群仅在开启配置 threadSessions 时按回复串（root_id）隔离会话，避免日常引用过度分裂；私聊绝不隔离话题
          const threadId = group
            ? (typeof message.thread_id === 'string' && message.thread_id.trim()
                ? (typeof message.root_id === 'string' && message.root_id.trim()
                    ? message.root_id.trim()
                    : (typeof message.message_id === 'string' && message.message_id.trim() ? message.message_id.trim() : undefined))
                : (config.threadSessions && typeof message.root_id === 'string' && message.root_id.trim()
                    ? message.root_id.trim()
                    : undefined))
            : undefined
          const chatId = feishuChatId(rawChatId, threadId)
          return incoming.run(chatId, async () => {
```

</details>

**依据 2 · 源码核查**：[src/channels/feishu.ts:409-432](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L409-L432)

明确业务拒绝后调用原群 create，错误与限流是不同分支。

<details>
<summary>查看原文（24行）</summary>

```text
  const { chatId: targetChatId, threadId } = parseFeishuChatId(chatId)
  if (threadId && typeof sender.im.message.reply === 'function') {
    if (!threadId.startsWith('omt_')) {
      try {
        const replyResult = await sender.im.message.reply({
          path: { message_id: threadId },
          data: { msg_type: msgType, content, reply_in_thread: true },
        }) as { code?: number | string; data?: { message_id?: string } } | undefined
        if (!isRejectedCode(replyResult?.code)) return replyResult
        if (isThrottleCode(replyResult?.code)) return replyResult
        log?.(`话题回复被拒 (code=${replyResult?.code})，安全回退群消息`)
      } catch (error) {
        if (throttledResponse(error)) throw error
        log?.(`话题回复网络或调用异常: ${error instanceof Error ? error.message : String(error)}`)
        throw error
      }
    } else {
      log?.(`收到非消息 ID 话题标识 (${threadId})，安全回退群消息`)
    }
  }
  return sender.im.message.create({
    params: { receive_id_type: 'chat_id' },
    data: { receive_id: targetChatId, msg_type: msgType, content },
  }) as Promise<{ code?: number | string; data?: { message_id?: string } } | undefined>
```

</details>

**依据 3 · 源码核查**：[src/channels/feishu.ts:651-663](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L651-L663)

首次思考卡片复用相同发送函数。

<details>
<summary>查看原文（13行）</summary>

```text
              if (cardContent !== current.lastCardContent) {
                if (!current.cardMessageId) {
                  const sent = await postFeishuMessage(
                    client,
                    chatId,
                    'interactive',
                    cardContent,
                    line => log(`[${id}] ${line}`),
                  ) as { code?: number | string; data?: { message_id?: string } } | undefined

                  if (!isRejectedCode(sent?.code) && sent?.data?.message_id) {
                    current.cardMessageId = sent.data.message_id
                    current.lastCardContent = cardContent
```

</details>

**依据 4 · 作者声明**：[README.zh-CN.md:298-303](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/README.zh-CN.md#L298-L303)

作者对原生及折叠卡片可见范围的主张。

```text
### 4. 思考过程折叠消息 (`thinkingDisplay`)
- **默认状态**：关闭（`mode: 'off'`）
- **功能说明**：开启后，模型的思考过程会单独呈现：
  - **Telegram**：发成一条「可折叠引用块」消息（`<blockquote expandable>`），默认显示约三行，点「显示更多」展开；同一回合就地编辑，回合结束时标题变为「🧠 思考过程」。
  - **飞书 / Lark**：私聊与群大厅普通消息走飞书官方原生思考过程气泡（`/open-apis/im/v1/message_cot`）；群话题回复串（Thread）或租户无原生 CoT 权限时自动平滑降级为飞书交互卡片折叠面板（`collapsible_panel`），确保过程绝不出串污染群大厅。
- **配置示例**（插件配置槽位）：
```

#### 缺口

- 没有实际租户中拒绝话题发帖的运行记录
  **影响**：能确认回群调用分支，不能宣称已观察过意外外发
  **进一步探讨**：对专用测试群模拟根消息删除、权限回退和限流并记录实际收件位置

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 飞书线程卡片按钮与文本审批各绑定谁，普通准入拒绝后仍可能走哪条分支？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

飞书选择卡把 token、群标志和线程复合 chatId 嵌入 action。SDK 回调要求令牌、目标键及操作人 open_id，将点击转进普通入站；选择器按账号、聊天类型、键与操作者匹配，再核对 session、有效期和当前性。复合键传回避免在线程里按群大厅查票据。文本 yes/no 审批走另一条路径：入站普通拒绝后，只要无附件且文本可解释为决定，网关仍尝试按当前聊天绑定寻找待审批会话。待审批已就绪才交 broker，群聊额外比对已知发起人和当前 userId；这个比对只在两者都已知且群聊时成立，私聊没有同一检查。由此能确认保留了普通准入拒绝后的文本尝试，尚无权宣称现实租户中发生权限绕过。需检查旧会话、白名单撤销和待处理票据同时存在时的行为。试用采用单用户私聊与只读任务，遇到非预期提示应在宿主处理并停收。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/feishu.ts:730-737](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L730-L737)

复合 chatId、token 和操作人进入回调。

```text
      const dispatcher = new sdk.EventDispatcher({}).register({
        'card.action.trigger': async (data: { operator?: { open_id?: string }; action?: { value?: { token?: string; group?: boolean; chatId?: string } }; context?: { open_chat_id?: string }; event_id?: string }) => {
          const token = data.action?.value?.token
          const chatId = data.action?.value?.chatId ?? data.context?.open_chat_id
          if (current() && token && chatId && data.operator?.open_id) void Promise.resolve(handler?.({ chatId, userId: data.operator.open_id,
            text: '', actionToken: token, kind: data.action?.value?.group ? 'group' : 'dm', addressed: true,
          })).catch(() => log(`[${id}] 按钮操作失败`))
          return {}
```

**依据 2 · 源码核查**：[src/channels/feishu.ts:860-867](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L860-L867)

线程卡携带复合键以回到同一会话。

```text
    async sendChoices(message, text, buttons) {
      if (!client) throw new Error('channel-unavailable')
      const result = await postFeishuMessage(client, message.chatId, 'interactive', JSON.stringify({ config: { wide_screen_mode: true }, elements: [
        { tag: 'markdown', content: text },
        ...buttons.map(button => ({ tag: 'action', actions: [{ tag: 'button', text: { tag: 'plain_text', content: button.label.slice(0, 60) },
        type: 'default', value: { token: button.token, group: message.kind === 'group', ...(parseFeishuChatId(message.chatId).threadId ? { chatId: message.chatId } : {}) } }] })),
      ] }), line => log(`[${id}] ${line}`)).catch(error => { throw choiceSendError(error) }) as { code?: number; data?: { message_id?: string } } | undefined
      if (isRejectedCode(result?.code)) throw new ChoiceSendError('rejected')
```

**依据 3 · 源码核查**：[src/engine/choices.ts:32-32](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/choices.ts#L32-L32)

选择作用域含账号、聊天类型、目标键和用户。

```text
  private key(channel: string, msg: ImMessage): string { return JSON.stringify([channel, msg.kind ?? 'dm', msg.chatId, msg.userId ?? '']) }
```

**依据 4 · 源码核查**：[src/engine/choices.ts:73-89](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/choices.ts#L73-L89)

选择校验会话、作用域、期限和索引。

<details>
<summary>查看原文（17行）</summary>

```text
  resolve(channel: string, msg: ImMessage, session?: string, allowNumber = true): string | undefined {
    const key = this.key(channel, msg)
    const explicit = msg.actionToken
    const token = explicit?.split(':')[0] ?? this.scopes.get(key)
    if (!token) return explicit ? '' : undefined
    const entry = this.entries.get(token)
    const numeric = allowNumber && entry?.allowNumber && /^\d+$/.test(msg.text.trim())
    if (!explicit && !numeric) {
      if (!msg.text.startsWith('/')) this.retire(token)
      return undefined
    }
    if (!entry || entry.key !== key || entry.session !== session) return ''
    if (entry.expires <= Date.now() || !entry.valid()) { this.retire(token); return '' }
    const index = explicit ? Number(explicit.split(':')[1]) : Number(msg.text.trim()) - 1
    if (!Number.isSafeInteger(index) || index < 0 || !entry.choices[index]) return ''
    this.retire(token, entry.selectedTexts[index])
    return entry.choices[index]!.value
```

</details>

**依据 5 · 源码核查**：[src/engine/gateway.ts:467-489](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L467-L489)

普通 deny 分支可先尝试文本批准。

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

**依据 6 · 源码核查**：[src/engine/gateway.ts:786-813](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L786-L813)

文本判断、已知群发起人限制及 broker 状态。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

#### 缺口

- 尚未实测权限撤销与待审批并发
  **影响**：私聊拒绝分支是否有应受限的可利用组合仍待核实
  **进一步探讨**：将一条待审批分别交给失权原发起者和同群其他用户，比较文本与按钮事件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 飞书原生思考过程如何开始、追加和关闭，什么时候降级为折叠卡？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Host 默认关闭折叠展示。开启后，网关逐回合建立目标，发送前看绑定、渠道可用性、当前回合和交付权限，终态把最后一段写入登记在清理前。飞书私聊和群大厅优先创建原生 message_cot，检查状态和两个 ID；累积文本仅追加新片段，附开始、内容和终态事件，成功结束再请求 complete。话题从一开始使用折叠卡，创建拒绝或事件写入失败可切换卡片，调用异常的限流分支退出，complete 失败留日志。切换发生在原生创建后时，当前源码没有在这些异常分支统一回收已发布的原生消息。字形簇切分使用 Intl.Segmenter，缺失时迭代码点，且单个超长字形不是严格长度断言。过程内容出现在聊天卡片，并与正文交付分开；群发路径仍有 Q02 的可见范围条件。因此小批试用可关闭过程输出，若要开启则只用合成内容确认租户权限、实际目的地和收口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:55-64](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/index.ts#L55-L64)

折叠展示配置默认关闭。

<details>
<summary>查看原文（10行）</summary>

```text
  segmentReply: Schema.boolean().default(false).description('分段回复：助手按标记把一次回复拆成多条消息。'),
  segmentMarker: Schema.string().default('<<<MSG>>>').description('分段回复的分隔标记，必须独占一行。'),
  segmentDelayMinSecs: Schema.number().default(1).description('相邻两条分段消息之间随机间隔的下界（秒）。'),
  segmentDelayMaxSecs: Schema.number().default(2).description('相邻两条分段消息之间随机间隔的上界（秒）。'),
  thinkingDisplay: Schema.object({
    mode: Schema.union(['off', 'collapsed']).default('off').description('思考过程投递：off 关闭，collapsed 发成可折叠消息。'),
    minChars: Schema.number().default(120).description('累计到这个字数才发第一条思考消息。'),
    intervalMs: Schema.number().default(2000).description('两次思考消息刷新之间的最小间隔（毫秒）。'),
    maxChars: Schema.number().default(3500).description('单条思考消息允许的最大字符数。'),
  }).description('思考过程折叠消息；需要渠道实现 sendThinking（目前支持 Telegram、飞书与 Lark）。'),
```

</details>

**依据 2 · 源码核查**：[src/engine/gateway.ts:1223-1239](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L1223-L1239)

回合目标与可交付守卫。

<details>
<summary>查看原文（17行）</summary>

```text
    const thinkingTurn = event.data?.turn ?? this.observedTurns.get(sessionId)
    const thinkingTarget: ThinkingDisplayTarget = {
      key: JSON.stringify([streamKey, sessionId]), sessionId, channel, chatId: binding.chatId,
      turn: thinkingTurn, config: this.resolveConfig(channel.id).thinkingDisplay,
      isCurrent: () => {
        if (!stillDeliverable() || normalizeThinkingDisplay(this.resolveConfig(channel.id).thinkingDisplay).mode !== 'collapsed'
          || (channel.canDeliverDeferred && !channel.canDeliverDeferred())
          || this.deferred.coldTurn(sessionId, thinkingTurn)) return false
        const observed = this.observedTurns.get(sessionId)
        if (thinkingTurn !== undefined && observed !== undefined && thinkingTurn !== observed) return false
        return !this.deferred.turnEntries(sessionId, thinkingTurn).some(entry => entry.status === 'blocked' || !this.validDelivery(entry))
      },
      label: (final, total) => final
        ? notice(this.ctx, '🧠 思考过程 · {0} 字', formatThinkingChars(total))
        : notice(this.ctx, '🧠 思考中… · {0} 字', formatThinkingChars(total)),
    }
    if (event.type === 'turn/start') this.thinking.start(thinkingTarget)
```

</details>

**依据 3 · 源码核查**：[src/engine/gateway.ts:1316-1320](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L1316-L1320)

先登记最终思考交付再清理。

```text
    if (event.type === 'turn/end') {
      // 先把最后一段思考写进折叠消息，再释放本回合的中间态。
      const thinkingFinal = this.thinking.finish(thinkingTarget)
      this.progress.delivery(sessionId, thinkingTurn, thinkingFinal.then(() => undefined))
      this.streamHints.delete(streamKey)
```

**依据 4 · 源码核查**：[src/channels/feishu.ts:459-479](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L459-L479)

按话题选择原生或卡片，并绑定取消信号。

<details>
<summary>查看原文（21行）</summary>

```text
  /** 思考过程投递：非话题（私聊/群大厅）走飞书原生 message_cot；话题回复串（thread）或权限不足时平滑降级为折叠卡片 */
  async function publishThinking(chatId: string, text: string, options?: ThinkingOptions): Promise<void> {
    if (!client || !lifecycle || lifecycle.signal.aborted || options?.signal?.aborted || options?.isCurrent?.() === false) return
    const key = JSON.stringify([chatId, options?.streamId ?? 'legacy'])
    let state = openThinking.get(key)
    if (!state) {
      if (!text.trim()) return
      const scope = new AbortController()
      const signal = options?.signal ? AbortSignal.any([scope.signal, options.signal, lifecycle.signal]) : AbortSignal.any([scope.signal, lifecycle.signal])
      const { threadId } = parseFeishuChatId(chatId)
      // 话题回复串（thread）内直接走折叠卡片，避免污染群大厅；大厅与私聊优先尝试原生 CoT
      const initialMode: 'cot' | 'card' = threadId ? 'card' : 'cot'
      state = {
        key,
        chatId,
        mode: initialMode,
        sentChars: 0,
        sealed: false,
        scope,
        guard: { signal, isCurrent: options?.isCurrent },
        detach: () => {},
```

</details>

**依据 5 · 源码核查**：[src/channels/feishu.ts:22-51](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L22-L51)

分段按字形簇迭代，缺失时按码点。

<details>
<summary>查看原文（30行）</summary>

```text
export function chunkByGraphemes(text: string, maxChunkLength: number): string[] {
  if (text.length <= maxChunkLength) return [text]
  const chunks: string[] = []
  let currentChunk = ''

  let units: Iterable<string>
  if (typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function') {
    const segmenter = new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    units = {
      *[Symbol.iterator]() {
        for (const { segment } of segmenter.segment(text)) {
          yield segment
        }
      },
    }
  } else {
    units = text
  }

  for (const unit of units) {
    if (currentChunk.length + unit.length > maxChunkLength && currentChunk.length > 0) {
      chunks.push(currentChunk)
      currentChunk = ''
    }
    currentChunk += unit
  }
  if (currentChunk.length > 0) {
    chunks.push(currentChunk)
  }
  return chunks
```

</details>

**依据 6 · 源码核查**：[src/channels/feishu.ts:544-625](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L544-L625)

原生创建、增量事件及 complete 的实际异常行为。

<details>
<summary>查看原文（82行）</summary>

```text
          // 1. 尝试原生 CoT 模式
          if (current.mode === 'cot') {
            try {
              if (!current.cotId) {
                const res = await client.request({
                  method: 'POST',
                  url: `${FEISHU_COT_API}?receive_id_type=chat_id`,
                  data: {
                    receive_id: targetChatId,
                    cot_hidden: false,
                    enable_badge: false,
                    update_feed_rank: false,
                  },
                }) as { code?: number | string; data?: { cot_id?: string; message_id?: string } } | undefined

                if (!res || isRejectedCode(res.code) || !res.data?.cot_id || !res.data?.message_id) {
                  log(`[${id}] 原生 message_cot 创建失败 (code=${res?.code})，降级为卡片折叠显示`)
                  current.mode = 'card'
                } else {
                  current.cotId = res.data.cot_id
                  current.cotMessageId = res.data.message_id
                }
              }

              if (current.mode === 'cot' && current.cotId && current.cotMessageId) {
                const delta = processedText.slice(current.sentChars)
                const events: CotEvent[] = []
                const reasoningMessageId = `reasoning-${runId}`

                if (!current.reasoningStarted) {
                  events.push(cotEvent('RUN_STARTED', { threadId: targetChatId, runId }, current))
                  events.push(cotEvent('REASONING_MESSAGE_START', { messageId: reasoningMessageId, role: 'reasoning' }, current))
                  current.reasoningStarted = true
                }

                if (delta.length > 0) {
                  const chunks = chunkByGraphemes(delta, FEISHU_COT_CHUNK_SIZE)
                  for (const chunk of chunks) {
                    events.push(cotEvent('REASONING_MESSAGE_CONTENT', { messageId: reasoningMessageId, delta: chunk }, current))
                  }
                  current.sentChars = processedText.length
                }

                if (next.options?.final) {
                  events.push(cotEvent('REASONING_MESSAGE_END', { messageId: reasoningMessageId }, current))
                  events.push(cotEvent('RUN_FINISHED', { threadId: targetChatId, runId, status: 'done' }, current))
                }

                if (events.length > 0) {
                  const putRes = await client.request({
                    method: 'PUT',
                    url: FEISHU_COT_API,
                    data: {
                      cot_id: current.cotId,
                      message_id: current.cotMessageId,
                      events,
                    },
                  }) as { code?: number | string; msg?: string } | undefined

                  if (!putRes || isRejectedCode(putRes.code)) {
                    log(`[${id}] 原生 CoT 事件写入被拒 (code=${putRes?.code}, msg=${putRes?.msg})，降级为卡片折叠`)
                    current.mode = 'card'
                  } else if (next.options?.final) {
                    try {
                      const completeRes = await client.request({
                        method: 'POST',
                        url: `${FEISHU_COT_COMPLETE_API}/${current.cotId}?message_id=${current.cotMessageId}&reason=done`,
                      }) as { code?: number | string; msg?: string } | undefined
                      if (!completeRes || isRejectedCode(completeRes.code)) {
                        log(`[${id}] 原生 CoT 完成收口通知被拒 (code=${completeRes?.code}, msg=${completeRes?.msg})`)
                      }
                    } catch (completeErr) {
                      log(`[${id}] 原生 CoT 完成收口通知异常: ${completeErr instanceof Error ? completeErr.message : String(completeErr)}`)
                    }
                  }
                }
              }
            } catch (error) {
              if (throttledResponse(error)) return
              log(`[${id}] 原生 CoT 发送异常: ${error instanceof Error ? error.message : String(error)}，降级为卡片折叠`)
              current.mode = 'card'
            }
```

</details>

#### 缺口

- 真实租户的消息 API 权限、限流与阶段回执未测
  **影响**：原生气泡、降级卡和关闭状态均不可视为已验收
  **进一步探讨**：对专用测试机器人覆盖创建拒绝、追加失败和完成拒绝，记录最终消息及原生状态

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 断线或主动静默后如何区分任务和消息送达，补发会重复跑任务吗？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

Telegram 轮询在分发前推进游标，有持久目录时先写盘，进程恰在写游标和处理之间崩溃可能跳过该条输入。回包方面，网关按回合记录投递工作，终态被排在正文收口后；旧回合清理不会覆盖已观察到的新回合。助手明确 NO_REPLY 标记可被剥除或抑制，单独标记表示主动静默，不能把所有空接收都归为渠道失败。恢复只从原会话历史读取文本，确认绑定和用户仍有效再发回原聊天。自动恢复只选 waiting、ready，已尝试但未知送达会等待用户选择 /delivery retry，可能重复出现文字但不会再次执行任务；文件需网页核对。这个恢复机制无法弥补尚未进入 Host 的 Telegram 崩溃窗口。可见回执与宿主任务终态要分开，尤其在平台发送成功但客户端收响应前断线时。

#### 证据与依据

**依据 1 · 源码核查**：[src/channels/telegram.ts:598-621](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/telegram.ts#L598-L621)

游标持久化先于事件分发。

<details>
<summary>查看原文（24行）</summary>

```text
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
            const callback = update.callback_query
            await api('answerCallbackQuery', { callback_query_id: callback.id }).catch(() => log('[telegram] 按钮回执失败'))
            if (callback.data && callback.message) await handler?.({
              chatId: telegramChatId(callback.message.chat.id, callback.message.message_thread_id),
              userId: String(callback.from.id),
              kind: callback.message.chat.type === 'private' ? 'dm' : 'group',
              addressed: true,
              text: '',
              actionToken: callback.data,
```

</details>

**依据 2 · 源码核查**：[src/engine/gateway.ts:1115-1144](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L1115-L1144)

终态与正文屏障的顺序和较新回合保护。

<details>
<summary>查看原文（30行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/engine/assistant-text.ts:1-29](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/assistant-text.ts#L1-L29)

单独静默与尾缀剥除，不从空内容推导成功。

<details>
<summary>查看原文（29行）</summary>

```text
const SILENT_REPLY_RE = /^\s*(?:<<<)?NO_REPLY(?:>>>)?\s*$/i
const TRAILING_SILENT_RE = /\s+(?:<<<)?NO_REPLY(?:>>>)?\s*$/i

type AssistantContent = ReadonlyArray<{ type?: string; text?: string }> | null

/** 判断内容是否为显式的主动静默回复（显式 NO_REPLY 标记）。 */
export function isSilentReplyText(content: AssistantContent = []): boolean {
  const blocks = content ?? []
  if (blocks.some(block => block.type === 'tool-call')) return false
  const textBlocks = blocks.filter(block => block.type === 'text' && typeof block.text === 'string')
  if (textBlocks.length === 0) return false
  const raw = textBlocks.map(block => block.text ?? '').join('\n').trim()
  return SILENT_REPLY_RE.test(raw)
}

/**
 * 提取可投递的助手正文；启用过滤时，含工具调用的整条消息返回 undefined。
 * undefined 表示主动抑制，不是投递成功；空串表示消息本身没有文字。
 * 支持 NO_REPLY 静默协议：单独 NO_REPLY 返回空串，尾部 NO_REPLY 则予以剥除。
 */
export function assistantText(content: AssistantContent = [], skipInterimText = false): string | undefined {
  const blocks = content ?? []
  if (skipInterimText && blocks.some(block => block.type === 'tool-call')) return undefined
  const raw = blocks.filter(block => block.type === 'text' && typeof block.text === 'string')
    .map(block => block.text ?? '').join('\n').trim()
  if (SILENT_REPLY_RE.test(raw)) return ''
  if (TRAILING_SILENT_RE.test(raw)) return raw.replace(TRAILING_SILENT_RE, '').trim()
  return raw
}
```

</details>

**依据 4 · 源码核查**：[src/engine/gateway.ts:592-623](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L592-L623)

补发从原宿主历史读出、检查绑定并分批。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/engine/gateway.ts:630-648](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L630-L648)

未知状态暂停自动补发，人工操作仅补文本。

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

#### 缺口

- 不同平台的重复或漏发比例未测
  **影响**：不能承诺消息恰好投递一次
  **进一步探讨**：分别在游标写入、平台发送和接收确认处注入故障，核对 Host 和 IM 两边

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 配置入口到实际账号重载有哪些依赖与成本，声明支持哪些 Host？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根包声明 Node ^22.19.0 或 ≥24 与 DSH 0.2.0-rc.1 到 0.3 预发布边界。Cordis 补丁挂载时 Host 需要 Web server、凭据、Agent 和模型及权限服务。管理路由先调用当前 connection.requestRejection，缺失时 503，拒绝时先回 401/403，写请求另做验证。Feishu/Lark 使用 SDK 和账号凭据建立 WebSocket。Web 账号选项由客户端按渠道过滤，保存时只给 Feishu/Lark 传 threadSessions，Host 确认渠道、持久化变化并重新启动已连接的账号。改设置可能短暂停收，且新键取值会改变普通群是否续旧会话。项目工作流定义 Node 24 和多个 RC，包括 0.2.2 系列，也装配特定文件契约依赖。本次只读配置，未核实远端每行通过或实际租户附件。首次成本是账号、凭据、机器人权限与宿主设置，持续要做权限回归和排查，失败要比对两边历史，现金与投入均未量化。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:65-82](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/package.json#L65-L82)

编译脚本、Node、Host 版本及渠道依赖。

<details>
<summary>查看原文（18行）</summary>

```text
  "icon": "./assets/icon.svg",
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
```

</details>

**依据 2 · 源码核查**：[src/index.ts:15-25](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/index.ts#L15-L25)

实际注入的 Host 服务。

<details>
<summary>查看原文（11行）</summary>

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
]
```

</details>

**依据 3 · 源码核查**：[src/manager.ts:898-925](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/manager.ts#L898-L925)

前缀路由认证、缺失与写入验证。

<details>
<summary>查看原文（28行）</summary>

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
        } catch (error) {
```

</details>

**依据 4 · 源码核查**：[lib/client.js:4738-4762](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/lib/client.js#L4738-L4762)

平台筛选后实际送入账号保存。

<details>
<summary>查看原文（25行）</summary>

```text
          const hasMentionPatch = Object.prototype.hasOwnProperty.call(patch, "mentionPolicy") || Object.prototype.hasOwnProperty.call(patch, "freeChatGroups");
          if (hasMentionPatch) {
            payload.mentionPolicy = Object.prototype.hasOwnProperty.call(patch, "mentionPolicy") ? patch.mentionPolicy : (mentionPolicyDraft === "always" ? "always" : "addressed");
            payload.freeChatGroups = Object.prototype.hasOwnProperty.call(patch, "freeChatGroups") ? patch.freeChatGroups : freeChatGroupsDraft;
          }
        }
        const filterPayload = typeof filterAccountPlatformPayload === "function" ? filterAccountPlatformPayload : (platform, patch, target) => {
          const res = target || {};
          if (platform === "telegram" || platform === "feishu" || platform === "lark") {
            if (Object.prototype.hasOwnProperty.call(patch, "thinkingDisplay")) {
              res.thinkingDisplay = patch.thinkingDisplay;
            }
          }
          if (platform === "feishu" || platform === "lark") {
            if (Object.prototype.hasOwnProperty.call(patch, "threadSessions")) {
              res.threadSessions = patch.threadSessions;
            }
          }
          return res;
        };
        filterPayload(account.platform, patch, payload);
        return onSave(account.id, payload).then((ok) => {
          if (seq === saveSeq.current) setNote(ok ? "status.saved" : "error.save");
          return ok;
        });
```

</details>

**依据 5 · 源码核查**：[src/manager.ts:1092-1106](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/manager.ts#L1092-L1106)

持久化布尔开关并重启活动账号。

<details>
<summary>查看原文（15行）</summary>

```text
      const hasThreadSessionsSetting = (platform === 'feishu' || platform === 'lark') && Object.hasOwn(input, 'threadSessions')
      let threadSessionsChanged = false
      if (hasThreadSessionsSetting) {
        const previousThreadSessions = state.config?.threadSessions === 'true'
        const requestedThreadSessions = input.threadSessions === true || input.threadSessions === 'true'
        threadSessionsChanged = requestedThreadSessions !== previousThreadSessions
        const config = { ...(state.config ?? {}) }
        if (requestedThreadSessions) config.threadSessions = 'true'
        else delete config.threadSessions
        state.config = config
      }
      this.flush()
      if (reloadSessions) await this.engine.reloadChannel(accountId, { resetSessions })
      if ((proxyChanged || mentionPolicyChanged || threadSessionsChanged) && this.running.has(accountId)) await this.startOne(accountId)
      return { ok: true, account: this.accountView(accountId, state) }
```

</details>

**依据 6 · 源码核查**：[.github/workflows/test.yml:63-73](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/.github/workflows/test.yml#L63-L73)

版本矩阵由工作流定义。

<details>
<summary>查看原文（11行）</summary>

```text
    name: Node.js 24 / DSH ${{ matrix.dsh }}
    strategy:
      fail-fast: false
      matrix:
        dsh: [0.2.0-rc.1, 0.2.0-rc.2, 0.2.1-rc.1, 0.2.1-rc.2, 0.2.1-rc.3, 0.2.1-rc.4, 0.2.1-rc.5, 0.2.2-rc.1, 0.2.2-rc.2, 0.2.2-rc.3]
    runs-on: ubuntu-latest
    timeout-minutes: 30
    steps:
      - name: 检出代码
        uses: actions/checkout@v6

```

</details>

**依据 7 · 源码核查**：[src/channels/feishu.ts:713-729](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L713-L729)

依赖 SDK、凭据及机器人身份。

<details>
<summary>查看原文（17行）</summary>

```text
      let sdk: typeof import('@larksuiteoapi/node-sdk')
      try {
        sdk = await (loadSdk ? loadSdk() : import('@larksuiteoapi/node-sdk'))
      } catch {
        throw new Error('缺少依赖 @larksuiteoapi/node-sdk')
      }
      const domain = id === 'lark' || config.domain === 'lark' ? 'https://open.larksuite.com' : undefined
      const logger = quietSdkLogger(() => log(`[${id}] SDK 请求或连接异常（敏感详情已隐藏）`), id)
      const loggerLevel = sdk.LoggerLevel?.error ?? 1
      const httpInstance = Object.create(sdk.defaultHttpInstance)
      httpInstance.request = (opts: Record<string, unknown>) => sdk.defaultHttpInstance.request({ ...opts, timeout: 30_000, maxRedirects: 0 })
      client = new sdk.Client({ appId, appSecret, logger, loggerLevel, httpInstance, ...(domain ? { domain } : {}) }) as unknown as typeof client
      const identity = await client!.request({ url: '/open-apis/bot/v3/info', method: 'GET' }) as {
        bot?: { open_id?: string }
      }
      const botOpenId = identity.bot?.open_id?.trim() ?? ''
      if (!botOpenId) throw new Error(`${id}: 无法获取机器人 open_id`)
```

</details>

#### 缺口

- 生产权限、账号开通成本和当前平台配额未知
  **影响**：不能据清单确认升级兼容或总成本
  **进一步探讨**：先按实际 Host 和单一目标平台核对安装、授权、重载与退出

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 谁适合低权限试用，如何验证统一的审批门槛能否缩小授权差异？

**研究主题**：采用判断、新假设与验证

#### 完整回答

经常在手机上跟进 DSH 且已有可信机器人账号的人，可先选隔离工作区、单渠道私聊和无文件的只读任务，关闭过程展示并核对回到同一个网页会话。若错绑、重复回包、出现非预期审批或发现原线程回复去了群大厅，先停收账号，在网页检查会话和结果。不要用未知送达推导任务没执行。待验证的设计是在文本和按钮真正消耗票据时同时检查当前准入、同一发起者和绑定版本，减少两条通路不一致。如需证伪，回放合法审批、被撤销的原用户、同群其他用户、线程绑定换代和回调重放，比较通过率、错放率及退回网页次数。若仍错放，或正常审批明显无法完成，则假设在该条件下不成立。这个验证应先用模拟回调和只读会话。

#### 证据与依据

**依据 1 · 源码核查**：[src/engine/gateway.ts:473-483](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L473-L483)

普通准入拒绝和文本审批仍可能连续发生。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/engine/gateway.ts:793-813](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/gateway.ts#L793-L813)

文本消费按绑定和待审批状态。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/engine/choices.ts:73-89](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/engine/choices.ts#L73-L89)

按钮走作用域和有效期校验。

<details>
<summary>查看原文（17行）</summary>

```text
  resolve(channel: string, msg: ImMessage, session?: string, allowNumber = true): string | undefined {
    const key = this.key(channel, msg)
    const explicit = msg.actionToken
    const token = explicit?.split(':')[0] ?? this.scopes.get(key)
    if (!token) return explicit ? '' : undefined
    const entry = this.entries.get(token)
    const numeric = allowNumber && entry?.allowNumber && /^\d+$/.test(msg.text.trim())
    if (!explicit && !numeric) {
      if (!msg.text.startsWith('/')) this.retire(token)
      return undefined
    }
    if (!entry || entry.key !== key || entry.session !== session) return ''
    if (entry.expires <= Date.now() || !entry.valid()) { this.retire(token); return '' }
    const index = explicit ? Number(explicit.split(':')[1]) : Number(msg.text.trim()) - 1
    if (!Number.isSafeInteger(index) || index < 0 || !entry.choices[index]) return ''
    this.retire(token, entry.selectedTexts[index])
    return entry.choices[index]!.value
```

</details>

**依据 4 · 源码核查**：[src/channels/feishu.ts:409-432](https://github.com/MichengAI/dsh-im-connect/blob/5194e32e4e9150cbdc08fe05070c253429c1c06d/src/channels/feishu.ts#L409-L432)

线程拒绝后的回退是试用停止条件。

<details>
<summary>查看原文（24行）</summary>

```text
  const { chatId: targetChatId, threadId } = parseFeishuChatId(chatId)
  if (threadId && typeof sender.im.message.reply === 'function') {
    if (!threadId.startsWith('omt_')) {
      try {
        const replyResult = await sender.im.message.reply({
          path: { message_id: threadId },
          data: { msg_type: msgType, content, reply_in_thread: true },
        }) as { code?: number | string; data?: { message_id?: string } } | undefined
        if (!isRejectedCode(replyResult?.code)) return replyResult
        if (isThrottleCode(replyResult?.code)) return replyResult
        log?.(`话题回复被拒 (code=${replyResult?.code})，安全回退群消息`)
      } catch (error) {
        if (throttledResponse(error)) throw error
        log?.(`话题回复网络或调用异常: ${error instanceof Error ? error.message : String(error)}`)
        throw error
      }
    } else {
      log?.(`收到非消息 ID 话题标识 (${threadId})，安全回退群消息`)
    }
  }
  return sender.im.message.create({
    params: { receive_id_type: 'chat_id' },
    data: { receive_id: targetChatId, msg_type: msgType, content },
  }) as Promise<{ code?: number | string; data?: { message_id?: string } } | undefined>
```

</details>

#### 缺口

- 统一消费门槛是未实施假设
  **影响**：真实操作者记录缺失时可能迫使合法用户回网页
  **进一步探讨**：用模拟事件与真实租户专用测试账号分别复测授权变更及旧票据

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
