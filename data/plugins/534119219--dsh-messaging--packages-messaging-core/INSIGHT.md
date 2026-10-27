# messaging-core

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f1c3399](https://github.com/534119219/dsh-messaging/tree/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/534119219/dsh-messaging)
<!-- END META -->

> **功能**：把多种消息平台接入DSH，共享聊天会话映射、流式出站路由、白名单配置和消息工具。

> **亮点**：统一平台adapter、DSH会话/命令和事件驱动出站，减少逐平台机器人重复接线；上游hermes/SDK/DSH能力不属原创，注册数量不代表效果。详见[Q02](#research-q02)。

> **主要限制**：入站白名单不等出站授权，send_message可直接指定已连接平台/chat，status列全部聊天；平台workspace共享且map非原子写，不能承诺多用户隔离与恰好一次投递。为静态核查未真实发送。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要多渠道入口，收发主链怎样运行？](#detail-section-11)
  - [Q02 · 相对独立机器人有什么增量，最关键授权限制是什么？](#detail-section-12)
  - [Q03 · 账号、宿主、配置和退出依赖什么？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复成本和效果怎样判断？](#detail-section-14)
  - [Q05 · 可复用设计和投递收据假设怎样检验？](#detail-section-15)
  - [Q06 · 谁适合当前采用，停止标准是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给需从消息渠道访问DSH的人统一会话入口，合格回复需身份、目标聊天及投递状态正确。

可为单渠道写独立机器人或使用原生DSH界面。core统一会话便利，但扩大消息、凭据和目标权限面，需逐平台核验。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| adapter网关 | 多平台事件接入DSH | 注册不等各平台运行可用 |
| 聊天会话映射 | 命令/历史与agent恢复 | chat共享，JSONL非原子持久化 |
| 流式回复 | 平台格式/编辑/分段 | ACK、重复和恢复未完整验证 |
| 主动send/status | 指定目标发送及概览 | core未绑定调用者与允许chat |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20及DSH agents/sessions/settings/tools | 启动必需 | 会话与工具服务 | peer失配可能无法接线 |
| 默认模型/preset与凭据 | 对话必需 | 真正执行agent任务 | connected不等模型任务可完成 |
| 所选平台账号/token/SDK | 该渠道必需 | 接收/发送 | 未配置不连接，凭据权限由维护者管理 |
| 回调listener与平台签名 | webhook渠道必需 | 接收外部事件 | 默认loopback，公开暴露需单独核对认证 |
| 本地mapping/平台workspace | 持久运行必需 | 恢复与工作产物 | 禁用不自动删除敏感数据 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者只选一渠道/最小权限测试账号 | 明确白名单、群聊共享与出站范围 |
| 加载 | 固定包和profile，按settings配置 | 能区分connected、映射、agent、发送各状态 |
| 对话 | 已授权测试用户发已知问题 | 正确聊天回复，不向其他目标发信息 |
| 恢复/退出 | 停适配器、移除包，撤销平台凭据并处理本地数据 | 检查轮询/连接关闭和workspace/map留存 |

本轮不连接账号、开公网回调或发送消息。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多SDK依赖、账号和模型环境，金额未知 | 认证、白名单、回调与聊天/工作区策略 | 单渠道配置量和故障率未测 |
| 持续使用 | 模型、平台请求、连接与文件写入 | 观察错路由/限流/权限，维护凭据 | 流式350ms节流与typing仍有API成本 |
| 失败恢复 | 重连、重发、映射/会话恢复 | 判断平台收到了没有，避免重复发送 | 缺完整投递确认与幂等恢复证据 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多入口复用 | adapter到统一DSH agent链存在 | 各平台实际质量/可用性 |
| 连续会话 | JSONL映射与历史切换存在 | 崩溃、多进程和群聊隔离表现 |
| 回复体验 | 流式编辑与最终分段存在 | 重复、遗漏、顺序和任务完成率 |

共同任务比较应含平台故障重做、人工核对和凭据运维，不按接入平台数推断净效益。

> **思考**：入站白名单不等出站授权，send_message可直接指定已连接平台/chat，status列全部聊天；平台workspace共享且map非原子写，不能承诺多用户隔离与恰好一次投递。为静态核查未真实发送。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一平台adapter、DSH会话/命令和事件驱动出站，减少逐平台机器人重复接线；上游hermes/SDK/DSH能力不属原创，注册数量不代表效果。详见[Q02](#research-q02)。

可复用的是adapter注册和统一capabilities输出、会话创建single-flight、使用持久session/event驱动发送以及按chat保留历史generation，减少多个入口并发创建同一agent。每平台workspace清楚标明工作产物归属，但不是安全隔离。发送工具和状态工具是全局面，需在移植时明确谁可查看/发送；日志/映射也应有留存治理。

<a id="detail-section-5"></a>

### 1.4 主要限制

入站白名单不等出站授权，send_message可直接指定已连接平台/chat，status列全部聊天；平台workspace共享且map非原子写，不能承诺多用户隔离与恰好一次投递。为静态核查未真实发送。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，继续核查可用无账号adapter桩验证出站权限和投递状态，再按明确授权评估单平台单用户；暂不把整套作默认多人远程入口。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持多渠道核心集成贡献，仅抽查Telegram链不证明27平台可用；出站授权与投递收据假设尚未验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/messaging-core/package.json、packages/messaging-core/lib/index.js、packages/messaging-core/lib/tools.js、packages/messaging-core/lib/session-map.js、packages/messaging-core/lib/agents.js、packages/messaging-core/lib/outbound.js、packages/messaging-core/lib/workspaces.js、packages/messaging-core/lib/http.js、packages/messaging-core/lib/platforms/telegram.js 及固定范围 inventory；组件：packages/messaging-core。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定packages/messaging-core核心、会话映射/agent/outbound/tools、HTTP与Telegram代表适配器及根作者说明；未逐一审查27平台，不连接账号或发送消息。
- 下一步：进一步探讨可从两agent/两chat、重复事件、丢ACK和断连的无账号夹具入手，核对越界、重复、恢复与状态过滤。

**分析版本**

- **仓库**：[534119219/dsh-messaging](https://github.com/534119219/dsh-messaging)
- **版本号**：0.1.0（[固定提交 f1c3399](https://github.com/534119219/dsh-messaging/tree/f1c3399ef40e3f419161d153e997d6f30576a627)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨授权目标投递收据，绑定主体/会话/允许chat及操作ID，按调用者过滤状态并保存ACK/未知结果；平台差异和策略维护增加成本，未验证。详见[Q05](#research-q05)。

进一步探讨可从两agent/两chat、重复事件、丢ACK和断连的无账号夹具入手，核对越界、重复、恢复与状态过滤。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 39 | 9547 | 7882 | 1047 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/534119219/dsh-messaging/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/534119219/dsh-messaging/issues?q=is%3Aissue+created%3A2026-09-22T05%3A13%3A37.571Z..2026-10-22T05%3A13%3A37.571Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/534119219/dsh-messaging/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A13%3A37.571Z..2026-10-22T05%3A13%3A37.571Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多渠道DSH会话网关的收发、身份与持久化边界及采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要多渠道入口，收发主链怎样运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合希望从自有消息账号或机器人渠道进入DSH的个人/小团队维护者。输入是平台适配器规范化的聊天事件，输出是对应DSH会话的模型回复，另有主动发送工具。合格交付不仅是平台connected，还需发送者有权操作、聊天映射正确、回复不串会话、失败/取消可追踪。作者列27平台，本轮核查核心与Telegram代表链，不将全部注册视为全部可用。

handleInbound按adapter配置检查allowedUsers/allowAll，非空文本再处理命令或touch chat映射，经agentManager创建/恢复会话，并steer运行中agent或followup空闲agent。agent按平台工作目录挂默认preset与模型。outbound订阅session/event，把文本chunks与assistant/message/turn结束聚合，按能力转换HTML/纯文/Markdown，节流编辑并在结束时分段投递。session-map JSONL提供重启映射，当前不是跨平台业务工单系统。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-13](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/README.md#L3-L13)

作者总目标、平台覆盖与授权声明。

<details>
<summary>查看原文（11行）</summary>

```text
将 [hermes-agent](https://github.com/NousResearch/hermes-agent) 的消息平台体系移植为 DSH 插件，**整合为单一插件 `messaging-core`**：27 个消息渠道的适配器全部内聚在插件内部，一个插件完成注册、会话映射、出站路由、授权、命令与配置界面。

## 功能特性

- **27 个消息平台**：Telegram、Discord、Slack、IRC、ntfy、Email、Matrix、Home Assistant、Signal、WhatsApp、飞书/Lark、Mattermost、QQ、LINE、SMS、WhatsApp Cloud、企业微信、Teams、钉钉、Google Chat、通用 Webhook、A2A、微信个人号（iLink）、BlueBubbles iMessage、OpenAI 兼容 API Server、腾讯元宝、SimpleX
- **统一会话体系**：每个聊天映射到独立的 DSH 会话（`msg-<平台>-<hash>[-vN]`），支持 `/new`、`/resume`（按标题切换历史会话）、`/title`、`/status`、`/stop`、`/compress`
- **每平台独立工作区**：`$DSH_HOME/messaging/workspace/<平台>/`，注册进 host 工作区注册表，侧栏按平台分组
- **出站流式路由**：订阅 `session/event`，按平台能力渲染（HTML/纯文本/原生 Markdown），支持流式编辑与 typing 指示
- **授权白名单**：每平台 `allowedUsers` / `allowAll`
- **配置界面**：侧栏「消息平台」入口（与「新建会话」同款按钮），hermes 式两栏弹窗（左侧平台列表，右侧配置表单），配置走 `/messaging/config` 端点持久化
- **共享 Webhook 监听器**：webhook 型平台共用 HTTP listener（默认 `127.0.0.1:8765`）
```

</details>

**依据 2 · 源码核查**：[packages/messaging-core/lib/index.js:294-328](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/index.js#L294-L328)

核心入站白名单。

<details>
<summary>查看原文（35行）</summary>

```text
    /** Authorize, interpret slash commands, and dispatch one inbound message. */
    async handleInbound(platform, event) {
      const adapter = adapters.get(platform)
      if (!adapter) {
        logger.warn(`inbound from unregistered platform: ${platform}`)
        return
      }
      const target = { chatId: event.chatId, threadId: event.threadId }
      const rec = (outcome, extra) => {
        inboundLog.unshift({
          platform,
          at: Date.now(),
          userId: String(event.userId || ''),
          chatId: String(event.chatId || ''),
          text: String(event.text || '').slice(0, 40),
          outcome,
          ...(extra || {}),
        })
        if (inboundLog.length > 5) inboundLog.pop()
      }
      rec('received')
      try {
        const cfg = adapter.resolveConfig ? adapter.resolveConfig() : {}
        const allowAll = Boolean(cfg.allowAll)
        const allowed = allowAll || (Array.isArray(cfg.allowedUsers) && cfg.allowedUsers.some((u) => String(u) === String(event.userId)))
        if (!allowed) {
          logger.warn(`unauthorized ${platform} message from user ${event.userId} in chat ${event.chatId}`)
          rec('unauthorized')
          try {
            await adapter.send(target, '⚠️ 未授权：你的账号不在允许列表中，无法使用本机器人。')
          } catch (error) {
            rec('unauthorized-send-failed', { error: error.message })
          }
          return
        }
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/index.js:377-393](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/index.js#L377-L393)

会话agent分派及来源记录。

<details>
<summary>查看原文（17行）</summary>

```text
        const platformMeta = PLATFORM_CATALOG[platform]
        const agent = await agentManager.ensureAgent(entry.sessionId, {
          platform,
          label: platformMeta ? platformMeta.label : platform,
          cwd: agentManager.workspaceFor(platform),
        })
        rec('agent-ready', { sessionId: entry.sessionId })
        const message = createUserMessage({
          content: [{ type: 'text', text }],
          // kind 'user' renders as a normal user bubble in the web UI; the
          // platform/chat/user fields keep provenance for the outbound router.
          source: { kind: 'user', platform, chatKey: event.chatKey, userId: event.userId },
        })
        if (agent.status === 'running') agent.steer(message)
        else agent.followup(message)
        rec('dispatched', { sessionId: entry.sessionId })
        logger.info(`inbound ${platform} user=${event.userId} -> ${entry.sessionId}: ${text.slice(0, 80)}`)
```

</details>

**依据 4 · 源码核查**：[packages/messaging-core/lib/agents.js:61-90](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/agents.js#L61-L90)

单会话创建/恢复路径。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Resolve the live agent for a session id, creating/resuming it once. */
  async function ensureAgent(sessionId, opts = {}) {
    const live = ctx.agents.get(sessionId)
    if (live) return live
    let creation = creations.get(sessionId)
    if (!creation) {
      creation = (async () => {
        const persistence = ctx.get('sessionPersistence')
        let stored = false
        if (persistence) {
          try {
            stored = (await persistence.list()).some((header) => header.id === sessionId)
          } catch (error) {
            logger.warn(`sessionPersistence.list failed: ${error.message}`)
          }
        }
        const composition = await composeSetup()
        const agentOptions = modelOptions()
        const cwd = opts && opts.cwd ? opts.cwd : process.cwd()
        const handle = stored
          ? await ctx.agents.resume({ resumeSessionId: sessionId, agentOptions, setup: composition.setup })
          : await ctx.agents.create({
              sessionId,
              agentOptions,
              meta: {
                cwd,
                ...(composition.agentPreset ? { agentPreset: composition.agentPreset } : {}),
              },
              setup: composition.setup,
            })
```

</details>

**依据 5 · 源码核查**：[packages/messaging-core/lib/outbound.js:1-14](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/outbound.js#L1-L14)

出站事件组织设计。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Outbound router: subscribes to durable `session/event` facts and pushes
 * them to the platform adapter owning each messaging chat.
 *
 * Streaming model (per session):
 *   - turn/start resets the buffer and starts the typing indicator;
 *   - assistant/chunk text deltas accumulate into the buffer; streaming
 *     platforms get throttled edit-message updates while the buffer stays
 *     under the platform's message cap (no truncation is ever sent — when the
 *     cap is hit, streaming preview stops and the final delivery chunks);
 *   - assistant/message (one per step) flushes immediately; if the provider
 *     emitted no chunks for that step the assembled text is appended;
 *   - turn/end finalizes: chunked delivery of the full text, then a short
 *     status line for aborted/error/blocked endings.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对独立机器人有什么增量，最关键授权限制是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是让多平台共享DSH agent、会话命令、持久映射、平台工作区和输出格式，减少每平台独立复制机器人状态机。移植目标来自hermes-agent消息体系，实际渠道SDK和DSH agent/preset来自上游；注册数量不能计为原创算法或已验证覆盖。

最关键限制是入站白名单不构成出站授权。send_message接受任意已注册平台和chat，直接adapter.send，未核对调用agent关联聊天、allowedUsers或逐次审批；messaging_status也列出所有平台/聊天与用户/会话信息。因此一个拥有工具的agent可能取得并向其他已连接聊天发送，实际可达还依赖平台凭据权限，本轮不发送验证。

会话按chat而非逐用户隔离，群聊中的授权用户可共享历史，平台workspace也共享目录而非每聊天沙箱。映射文件同步整体重写、无原子rename和跨进程锁，损坏行被跳过，不能保证崩溃/多实例一致。日志保留入站文本前段，配置端点与settings持久化涉及账号数据。以上为静态边界，不能宣称多租户隔离或恰好一次投递。

#### 证据与依据

**依据 1 · 源码核查**：[packages/messaging-core/lib/tools.js:26-36](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/tools.js#L26-L36)

主动发送直接调用adapter，无调用者/目标授权核查。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args) {
      const adapter = adapters.get(args.platform)
      if (!adapter) {
        return { ok: false, platform: args.platform, chat: args.chat, reason: `未知平台 ${args.platform}` }
      }
      try {
        const rendered = renderForCapability(String(args.text), adapter.capabilities)
        const result = await adapter.send({ chatId: String(args.chat) }, rendered)
        return { ok: true, platform: args.platform, chat: String(args.chat), messageId: result && result.messageId ? result.messageId : null }
      } catch (error) {
        return { ok: false, platform: args.platform, chat: String(args.chat), reason: String(error && error.message ? error.message : error) }
```

</details>

**依据 2 · 源码核查**：[packages/messaging-core/lib/tools.js:49-61](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/tools.js#L49-L61)

状态工具返回全部聊天信息。

<details>
<summary>查看原文（13行）</summary>

```text
    execute() {
      const platforms = [...adapters.values()].map((adapter) => ({
        id: adapter.id,
        connected: Boolean(adapter.connected),
      }))
      const chats = sessionMap.entries().map((entry) => ({
        platform: entry.chatKey.split(':')[0],
        chatId: entry.chatId,
        userName: entry.userName,
        sessionId: entry.sessionId,
        updatedAt: entry.updatedAt,
      }))
      return { platforms, chats }
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/workspaces.js:19-31](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/workspaces.js#L19-L31)

每平台目录不是每聊天隔离。

<details>
<summary>查看原文（13行）</summary>

```text
export function workspaceRoot() {
  return join(dshHome(), 'messaging', 'workspace')
}

export function workspaceDirFor(platform) {
  return join(workspaceRoot(), String(platform))
}

/** Create the platform workspace directory (idempotent) and return its path. */
export function ensureWorkspaceDir(platform) {
  const dir = workspaceDirFor(platform)
  mkdirSync(dir, { recursive: true })
  return dir
```

</details>

**依据 4 · 源码核查**：[packages/messaging-core/lib/session-map.js:28-59](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/session-map.js#L28-L59)

坏行跳过、整体直接写入。

<details>
<summary>查看原文（32行）</summary>

```text
  function load() {
    if (loaded) return
    loaded = true
    try {
      if (!existsSync(file)) return
      for (const line of readFileSync(file, 'utf8').split(/\r?\n/)) {
        if (!line.trim()) continue
        try {
          const entry = JSON.parse(line)
          if (entry && entry.chatKey && entry.sessionId) {
            // Backfill history for entries written before /resume existed.
            if (!Array.isArray(entry.history) || entry.history.length === 0) {
              entry.history = [{ sessionId: entry.sessionId, generation: entry.generation || 0, updatedAt: entry.updatedAt || 0 }]
            }
            byChat.set(entry.chatKey, entry)
            bySession.set(entry.sessionId, entry.chatKey)
          }
        } catch { /* skip malformed line */ }
      }
    } catch (error) {
      logger.warn(`session map load failed (${file}): ${error.message}`)
    }
  }

  function persist() {
    try {
      const dir = join(file, '..')
      mkdirSync(dir, { recursive: true })
      const lines = [...byChat.values()].map((entry) => JSON.stringify(entry))
      writeFileSync(file, lines.length ? lines.join('\n') + '\n' : '')
    } catch (error) {
      logger.warn(`session map save failed (${file}): ${error.message}`)
```

</details>

**依据 5 · 源码核查**：[packages/messaging-core/lib/index.js:302-312](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/index.js#L302-L312)

状态记录包含用户与文本预览。

<details>
<summary>查看原文（11行）</summary>

```text
      const rec = (outcome, extra) => {
        inboundLog.unshift({
          platform,
          at: Date.now(),
          userId: String(event.userId || ''),
          chatId: String(event.chatId || ''),
          text: String(event.text || '').slice(0, 40),
          outcome,
          ...(extra || {}),
        })
        if (inboundLog.length > 5) inboundLog.pop()
```

</details>

#### 缺口

- 未验证实际宿主工具暴露范围和跨聊天调用的可达性。
  **影响**：静态缺少core出站校验不能等价为已发生外泄，但阻止默认隔离承诺。
  **进一步探讨**：可用无真实账号的adapter桩，按不同agent/目标聊天调用，检查是否能拦截越界并回读记录。
- 27平台的认证、签名与投递失败处理未逐项核查。
  **影响**：不能把Telegram与core结果推广到全部渠道安全。
  **进一步探讨**：可按拟启用平台逐一检查事件签名、sender身份来源及API错误/重试策略。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账号、宿主、配置和退出依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

core需agents/sessions/settings/tools，默认preset、模型选择和持久化服务决定会话真实能力。包把多个平台SDK列为直接依赖，单平台使用也可能承担整包安装面。账号/token及webhook入口按平台分别必需，Telegram默认空白名单和allowAll=false，未配置token不连接；不能因这些默认值推断其他适配器同样安全。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20及DSH agents/sessions/settings/tools | 启动必需 | 会话与工具服务 | peer失配可能无法接线 |
| 默认模型/preset与凭据 | 对话必需 | 真正执行agent任务 | connected不等模型任务可完成 |
| 所选平台账号/token/SDK | 该渠道必需 | 接收/发送 | 未配置不连接，凭据权限由维护者管理 |
| 回调listener与平台签名 | webhook渠道必需 | 接收外部事件 | 默认loopback，公开暴露需单独核对认证 |
| 本地mapping/平台workspace | 持久运行必需 | 恢复与工作产物 | 禁用不自动删除敏感数据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者只选一渠道/最小权限测试账号 | 明确白名单、群聊共享与出站范围 |
| 加载 | 固定包和profile，按settings配置 | 能区分connected、映射、agent、发送各状态 |
| 对话 | 已授权测试用户发已知问题 | 正确聊天回复，不向其他目标发信息 |
| 恢复/退出 | 停适配器、移除包，撤销平台凭据并处理本地数据 | 检查轮询/连接关闭和workspace/map留存 |

本轮不连接账号、开公网回调或发送消息。

#### 证据与依据

**依据 1 · 源码核查**：[packages/messaging-core/package.json:28-60](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/package.json#L28-L60)

peer、众多SDK与Node声明。

<details>
<summary>查看原文（33行）</summary>

```text
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6"
  },
  "dependencies": {
    "@larksuiteoapi/node-sdk": "^1.73.0",
    "@line/bot-sdk": "^11.0.0",
    "@slack/socket-mode": "^1.3.6",
    "@slack/web-api": "^7.8.0",
    "@whiskeysockets/baileys": "^6.7.24",
    "botbuilder": "^4.23.0",
    "dingtalk-stream": "https://registry.npmjs.org/dingtalk-stream/-/dingtalk-stream-2.1.6-beta.1.tgz",
    "discord.js": "^14.16.0",
    "google-auth-library": "^11.0.0",
    "grammy": "^1.35.0",
    "home-assistant-js-websocket": "^9.0.0",
    "imapflow": "^1.0.0",
    "irc-framework": "^4.14.0",
    "jose": "^6.0.0",
    "matrix-js-sdk": "^41.9.0",
    "nodemailer": "^9.0.0",
    "pino": "^10.0.0",
    "qrcode": "^1.5.4",
    "schemastery": "^3.18.0",
    "ws": "^8.0.0"
  },
  "engines": {
    "node": ">=20"
  },
  "license": "MIT"
}
```

</details>

**依据 2 · 源码核查**：[packages/messaging-core/lib/platforms/telegram.js:28-41](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/platforms/telegram.js#L28-L41)

Telegram token和授权默认值。

<details>
<summary>查看原文（14行）</summary>

```text
    cfgScope = ctx.settings.register(settingsNamespace('messaging-telegram'), z.object({
      token: z.string().role('secret').default(''),
      allowedUsers: z.array(z.union([z.number(), z.string()])).default([]),
      allowAll: z.boolean().default(false),
      homeChannel: z.string().default(''),
    }))
  } catch (error) {
    logger.warn(`settings namespace 'messaging-telegram' unavailable: ${error.message}`)
  }

  function resolveConfig() {
    const resolved = cfgScope ? cfgScope.get() : { token: '', allowedUsers: [], allowAll: false, homeChannel: '' }
    const token = (resolved.token && resolved.token.trim()) || process.env.TELEGRAM_BOT_TOKEN || ''
    return { ...resolved, token }
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/platforms/telegram.js:61-90](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/platforms/telegram.js#L61-L90)

连接/失败处理。

<details>
<summary>查看原文（30行）</summary>

```text
    async connect() {
      if (bot) return
      const cfg = resolveConfig()
      if (!cfg.token) {
        logger.warn('telegram: token 未配置（settings messaging-telegram.token 或 TELEGRAM_BOT_TOKEN）')
        return
      }
      const b = new Bot(cfg.token)
      bot = b
      try {
        b.on('message', (msgCtx) => {
          handleUpdate(msgCtx).catch((error) => logger.error(`telegram update failed: ${error.stack || error.message}`))
        })
        await b.init()
        me = b.botInfo
        await b.api.deleteWebhook().catch(() => { /* not configured as webhook */ })
        running = b.start({
          onStart: () => {
            adapter.connected = true
            logger.info(`telegram connected as @${me.username} (${me.id})`)
          },
        }).catch((error) => {
          logger.error(`telegram polling stopped: ${error.message}`)
        })
      } catch (error) {
        // A failed connect must not leave the instance behind, or a later
        // settings change can never trigger a reconnect.
        bot = null
        me = null
        throw error
```

</details>

**依据 4 · 源码核查**：[packages/messaging-core/lib/platforms/telegram.js:94-103](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/platforms/telegram.js#L94-L103)

断开轮询连接。

<details>
<summary>查看原文（10行）</summary>

```text
    async disconnect() {
      const b = bot
      bot = null
      me = null
      adapter.connected = false
      if (b) {
        try {
          await b.stop()
        } catch { /* ignore */ }
      }
```

</details>

**依据 5 · 源码核查**：[packages/messaging-core/lib/http.js:13-15](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/http.js#L13-L15)

共享回调默认loopback与body上限。

```text
const MAX_BODY_BYTES = 10 * 1024 * 1024

export function createWebhookServer(ctx, { logger, port = 8765, host = '127.0.0.1' }) {
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复成本和效果怎样判断？

**研究主题**：效果与总成本

#### 完整回答

合格任务是一条授权消息进入正确会话并产生正确且只投递一次的回复。多平台SDK、账号配置、模型服务和回调运维属于首次负担；持续使用除模型tokens，还包括平台API、流式编辑/typing和映射重写。平台免费额度或价格不在本次固定源码材料中，不能填免费或0。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多SDK依赖、账号和模型环境，金额未知 | 认证、白名单、回调与聊天/工作区策略 | 单渠道配置量和故障率未测 |
| 持续使用 | 模型、平台请求、连接与文件写入 | 观察错路由/限流/权限，维护凭据 | 流式350ms节流与typing仍有API成本 |
| 失败恢复 | 重连、重发、映射/会话恢复 | 判断平台收到了没有，避免重复发送 | 缺完整投递确认与幂等恢复证据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多入口复用 | adapter到统一DSH agent链存在 | 各平台实际质量/可用性 |
| 连续会话 | JSONL映射与历史切换存在 | 崩溃、多进程和群聊隔离表现 |
| 回复体验 | 流式编辑与最终分段存在 | 重复、遗漏、顺序和任务完成率 |

共同任务比较应含平台故障重做、人工核对和凭据运维，不按接入平台数推断净效益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/messaging-core/lib/outbound.js:19-20](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/outbound.js#L19-L20)

编辑和typing间隔。

```text
const EDIT_THROTTLE_MS = 350
const TYPING_INTERVAL_MS = 4500
```

**依据 2 · 源码核查**：[packages/messaging-core/lib/outbound.js:93-125](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/outbound.js#L93-L125)

流式编辑与最终分段有请求负担。

<details>
<summary>查看原文（33行）</summary>

```text
  /** Throttled streaming edit (never truncates; stops preview above the cap). */
  function scheduleEdit(sessionId, info, s) {
    if (!info.adapter.capabilities.streaming || s.editTimer || s.editStopped) return
    s.editTimer = setTimeout(() => {
      s.editTimer = null
      performEdit(sessionId, info, s).catch((error) => logger.warn(`streaming edit failed: ${error.message}`))
    }, EDIT_THROTTLE_MS)
  }

  async function performEdit(sessionId, info, s) {
    const cap = info.adapter.capabilities.maxMessageLength || 4000
    const raw = s.buffer.trim()
    if (!raw) return
    if (raw.length > cap) {
      // Never send truncated markup: stop the streaming preview, the final
      // delivery will chunk the full text.
      s.editStopped = true
      return
    }
    const text = renderForCapability(raw, info.adapter.capabilities)
    if (s.messageId === null) {
      const result = await info.adapter.send(info.target, text)
      s.messageId = result && result.messageId ? result.messageId : null
    } else {
      await info.adapter.editMessage(info.target, s.messageId, text)
    }
    void sessionId
  }

  async function sendChunked(info, raw) {
    const cap = info.adapter.capabilities.maxMessageLength || 4000
    const text = renderForCapability(raw, info.adapter.capabilities)
    const parts = splitText(text, cap)
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/session-map.js:52-59](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/session-map.js#L52-L59)

映射持久化会重写整份文件。

```text
  function persist() {
    try {
      const dir = join(file, '..')
      mkdirSync(dir, { recursive: true })
      const lines = [...byChat.values()].map((entry) => JSON.stringify(entry))
      writeFileSync(file, lines.length ? lines.join('\n') + '\n' : '')
    } catch (error) {
      logger.warn(`session map save failed (${file}): ${error.message}`)
```

#### 缺口

- 缺少同平台、同模型下完整消息任务的成本、重复/遗漏率和恢复时间。
  **影响**：不能给出可靠性或单位成本承诺。
  **进一步探讨**：可先用受控adapter消息集记录接收、agent执行、平台ACK、重试和最终送达，分别统计人时/资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可复用设计和投递收据假设怎样检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是adapter注册和统一capabilities输出、会话创建single-flight、使用持久session/event驱动发送以及按chat保留历史generation，减少多个入口并发创建同一agent。每平台workspace清楚标明工作产物归属，但不是安全隔离。发送工具和状态工具是全局面，需在移植时明确谁可查看/发送；日志/映射也应有留存治理。

由Q02/Q04推导未验证的“授权目标投递收据”。把入站主体、会话、允许出站chat和操作ID绑定，发送前校验目标，状态查询按调用者过滤；每次平台ACK/未知结果形成持久收据，未知不盲目重发。相对当前直接send，它增加权限及副作用所有权，而不是再接一个平台。代价是目标策略、凭据和ACK差异，需要各平台适配。最小对照可用两个聊天/agent、丢ACK、重复入站和断连夹具，比较越界发送、重复回复及恢复人时；若策略阻断正常流程或仍重复，就应修正或否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/messaging-core/lib/agents.js:61-90](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/agents.js#L61-L90)

single-flight创建和恢复。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Resolve the live agent for a session id, creating/resuming it once. */
  async function ensureAgent(sessionId, opts = {}) {
    const live = ctx.agents.get(sessionId)
    if (live) return live
    let creation = creations.get(sessionId)
    if (!creation) {
      creation = (async () => {
        const persistence = ctx.get('sessionPersistence')
        let stored = false
        if (persistence) {
          try {
            stored = (await persistence.list()).some((header) => header.id === sessionId)
          } catch (error) {
            logger.warn(`sessionPersistence.list failed: ${error.message}`)
          }
        }
        const composition = await composeSetup()
        const agentOptions = modelOptions()
        const cwd = opts && opts.cwd ? opts.cwd : process.cwd()
        const handle = stored
          ? await ctx.agents.resume({ resumeSessionId: sessionId, agentOptions, setup: composition.setup })
          : await ctx.agents.create({
              sessionId,
              agentOptions,
              meta: {
                cwd,
                ...(composition.agentPreset ? { agentPreset: composition.agentPreset } : {}),
              },
              setup: composition.setup,
            })
```

</details>

**依据 2 · 源码核查**：[packages/messaging-core/lib/session-map.js:100-119](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/session-map.js#L100-L119)

generation及历史管理。

<details>
<summary>查看原文（20行）</summary>

```text
  /** Start a fresh conversation: bump generation past every historical one. */
  function reset(chatKey) {
    load()
    const prev = byChat.get(chatKey)
    if (prev) bySession.delete(prev.sessionId)
    const history = prev && Array.isArray(prev.history) && prev.history.length ? prev.history : []
    const generation = history.reduce((max, h) => Math.max(max, Number(h.generation) || 0), 0) + 1
    const entry = {
      ...(prev ? { platform: prev.platform, chatId: prev.chatId, threadId: prev.threadId, userId: prev.userId, userName: prev.userName } : {}),
      chatKey,
      sessionId: defaultId(chatKey, generation),
      generation,
      history,
      updatedAt: Date.now(),
    }
    entry.history.push({ sessionId: entry.sessionId, generation, updatedAt: entry.updatedAt })
    if (entry.history.length > 20) entry.history = entry.history.slice(-20)
    byChat.set(chatKey, entry)
    bySession.set(entry.sessionId, chatKey)
    persist()
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/tools.js:26-36](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/tools.js#L26-L36)

缺调用者/目标绑定给出假设起点。

<details>
<summary>查看原文（11行）</summary>

```text
    async execute(args) {
      const adapter = adapters.get(args.platform)
      if (!adapter) {
        return { ok: false, platform: args.platform, chat: args.chat, reason: `未知平台 ${args.platform}` }
      }
      try {
        const rendered = renderForCapability(String(args.text), adapter.capabilities)
        const result = await adapter.send({ chatId: String(args.chat) }, rendered)
        return { ok: true, platform: args.platform, chat: String(args.chat), messageId: result && result.messageId ? result.messageId : null }
      } catch (error) {
        return { ok: false, platform: args.platform, chat: String(args.chat), reason: String(error && error.message ? error.message : error) }
```

</details>

**依据 4 · 源码核查**：[packages/messaging-core/lib/outbound.js:43-57](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/outbound.js#L43-L57)

session映射到adapter目标。

<details>
<summary>查看原文（15行）</summary>

```text
export function createOutboundRouter(ctx, { adapters, sessionMap, logger }) {
  /** sessionId -> { turn, buffer, chunkedSteps, messageId, typingTimer, editTimer, editStopped } */
  const state = new Map()

  function chatInfoFor(sessionId) {
    const chatKey = sessionMap.chatKeyFor(sessionId)
    if (!chatKey) return undefined
    const platform = chatKey.split(':')[0]
    const adapter = adapters.get(platform)
    if (!adapter) return undefined
    const entry = sessionMap.entryFor(chatKey)
    return {
      adapter,
      target: { chatId: entry && entry.chatId ? entry.chatId : chatKey.split(':').slice(1).join(':'), threadId: entry && entry.threadId },
    }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合当前采用，停止标准是什么？

**研究主题**：采用判断

#### 完整回答

推荐observe。统一渠道到DSH会话有明显集成价值，但当前core主动发送工具没有调用者/目标约束，入站白名单不能替代出站治理；多渠道SDK、群聊共享、平台工作区和持久数据进一步增加维护责任。不宜把整套作为默认多用户远程入口。

继续研究可用无真实账号的adapter桩验证core，再针对真正需要的一平台、单用户和隔离workspace作明确授权的后续评估。出现跨聊天信息可见/发送、重复回复、坏映射静默跳过、未知投递被重复重发或不清楚哪些凭据仍有效时，应停止相关渠道。需补出站目标边界和所选平台同版本结果后再评估trial；本轮未发送任何消息。依据Q02、Q03和Q04。

#### 证据与依据

**依据 1 · 源码核查**：[packages/messaging-core/lib/tools.js:26-61](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/tools.js#L26-L61)

发送与状态工具的全局面影响建议。

<details>
<summary>查看原文（36行）</summary>

```text
    async execute(args) {
      const adapter = adapters.get(args.platform)
      if (!adapter) {
        return { ok: false, platform: args.platform, chat: args.chat, reason: `未知平台 ${args.platform}` }
      }
      try {
        const rendered = renderForCapability(String(args.text), adapter.capabilities)
        const result = await adapter.send({ chatId: String(args.chat) }, rendered)
        return { ok: true, platform: args.platform, chat: String(args.chat), messageId: result && result.messageId ? result.messageId : null }
      } catch (error) {
        return { ok: false, platform: args.platform, chat: String(args.chat), reason: String(error && error.message ? error.message : error) }
      }
    },
  }))

  ctx.tools.register(defineTool({
    name: 'messaging_status',
    description: '列出已连接的消息平台、各平台聊天会话与最近活跃时间。',
    parameters: {},
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: JSON.stringify(value, null, 2) }],
    },
    execute() {
      const platforms = [...adapters.values()].map((adapter) => ({
        id: adapter.id,
        connected: Boolean(adapter.connected),
      }))
      const chats = sessionMap.entries().map((entry) => ({
        platform: entry.chatKey.split(':')[0],
        chatId: entry.chatId,
        userName: entry.userName,
        sessionId: entry.sessionId,
        updatedAt: entry.updatedAt,
      }))
      return { platforms, chats }
```

</details>

**依据 2 · 源码核查**：[packages/messaging-core/lib/index.js:316-328](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/index.js#L316-L328)

入站白名单仅约束这一条接收链。

<details>
<summary>查看原文（13行）</summary>

```text
        const cfg = adapter.resolveConfig ? adapter.resolveConfig() : {}
        const allowAll = Boolean(cfg.allowAll)
        const allowed = allowAll || (Array.isArray(cfg.allowedUsers) && cfg.allowedUsers.some((u) => String(u) === String(event.userId)))
        if (!allowed) {
          logger.warn(`unauthorized ${platform} message from user ${event.userId} in chat ${event.chatId}`)
          rec('unauthorized')
          try {
            await adapter.send(target, '⚠️ 未授权：你的账号不在允许列表中，无法使用本机器人。')
          } catch (error) {
            rec('unauthorized-send-failed', { error: error.message })
          }
          return
        }
```

</details>

**依据 3 · 源码核查**：[packages/messaging-core/lib/workspaces.js:19-31](https://github.com/534119219/dsh-messaging/blob/f1c3399ef40e3f419161d153e997d6f30576a627/packages/messaging-core/lib/workspaces.js#L19-L31)

平台级共享工作目录影响多人采用。

<details>
<summary>查看原文（13行）</summary>

```text
export function workspaceRoot() {
  return join(dshHome(), 'messaging', 'workspace')
}

export function workspaceDirFor(platform) {
  return join(workspaceRoot(), String(platform))
}

/** Create the platform workspace directory (idempotent) and return its path. */
export function ensureWorkspaceDir(platform) {
  const dir = workspaceDirFor(platform)
  mkdirSync(dir, { recursive: true })
  return dir
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
