# dsh-im-qq

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[d1ae124](https://github.com/988hj7tczd-oss/dsh-im-qq/tree/d1ae12486264359f9c516bb2cf0ed5e75e811d37)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq) [![npm 30d 280](https://img.shields.io/static/v1?label=npm+30d&message=280&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-im-qq) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-im-qq)
<!-- END META -->

> **实现功能**：将QQ私聊、群和频道文本接入DSH完整Agent，提供会话恢复、回复分段与审批桥。

> **核心亮点**：把QQ文本与原Agent/preset、会话持久映射、回复/审批生命周期组合，降低自写远程桥成本。详见[Q01](#research-q01)。

> **风险与缺陷**：默认白名单通配、群级ACL、缺身份按钮放行和群slash无作者核对削弱仅发起者审批；恢复/回复不等恰好一次。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · QQ接入提供什么业务增量，哪些能力来自宿主？](#detail-section-11)
  - [Q02 · 白名单与审批是否始终只允许发起者？](#detail-section-12)
  - [Q03 · 会话隔离、懒恢复和重置可靠到什么程度？](#detail-section-13)
  - [Q04 · WS恢复与回复链有哪些真实保证和缺口？](#detail-section-14)
  - [Q05 · 部署依赖、凭证隐私与三阶段成本怎么判断？](#detail-section-15)
  - [Q06 · 测试与采用结论如何成立？](#detail-section-16)
  - [Q07 · 可从哪些已核机制推导未来方案？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：受权QQ用户远程请求宿主Agent，群/频道共享会话，不是逐成员隔离。详见[Q01](#research-q01)。

回Web操作或自写QQ bot转发；完整工具能力来自宿主，插件负责远程交接。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| QQ文本入口 | 私聊/群/频道请求 | 群ACL按chat非成员，默认通配 |
| 原Agent/preset接入 | 完整宿主工具任务 | 能力来自宿主，权限需另核 |
| 平台内slash/按钮 | new/approve/always/revoke | 群命令及缺身份授权受限 |
| WS/回复维护 | 心跳恢复/分段回文 | 无持久消息去重/收妥协议 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node>=22与DSH完整服务 | Agent/WS/审批 | 固定rc6 ABI非任意新版保证 |
| QQ受权bot/身份 | 远程接入 | 默认通配应先收窄，平台条件另核 |
| 凭证/模型/preset | 登录与任务执行 | row可明文，保存不等已连通 |
| 独立工作区/原会话日志 | 隔离与恢复 | 群成员共享，非安全沙箱替代 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 核平台/宿主并收紧身份 | 操作者 | 非默认通配，最小preset |
| 保存凭据并观察连接事实 | 用户/宿主 | 不能只信UI已启动 |
| QQ发请求/审批 | 受权用户 | 主体与turn需核，群模式慎用 |
| 核任务/回复与恢复 | 用户 | 已发/已处理/未知分清 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node>=22、DSH完整Agent/preset/工作区/审批服务，QQ bot账户/模型 | 配AppID/Secret与受权身份、独立工作区和沙箱，核平台类型/审核条件 | 账户条件与配额为作者版本材料，当前平台规则未独立核；金额工时未知 |
| 持续使用 | WS/token维护、宿主模型/工具与QQ请求，多段/主动回复额外资源 | 群协作权限管理、审批复核、漏重送检查；耗时未知 | 30条/分钟是每chat入站频控，非模型费用/全局并发硬限 |
| 失败恢复 | 本地映射/会话日志/工作区备份、token/WS与重发资源 | 核旧turn是否仍跑、重置generation和已发回复，必要时撤销权限 | 无持久inbox/outbox/业务去重；退避不可取消，送达/外部副作用状态未知，工时金额未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 远程Agent任务 | WS→原preset/session | 当前平台可用与最终任务结果 |
| 审批桥 | timeout/按钮与命令 | 缺身份/群命令不保证仅发起者 |
| 会话/回复恢复 | 映射/RESUME/分段 | 重放去重/unknown送达/重置竞态 |

> **思考**：默认白名单通配、群级ACL、缺身份按钮放行和群slash无作者核对削弱仅发起者审批；恢复/回复不等恰好一次。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把QQ文本与原Agent/preset、会话持久映射、回复/审批生命周期组合，降低自写远程桥成本。详见[Q01](#research-q01)。

把QQ文本与原Agent/preset、会话持久映射、回复/审批生命周期组合，降低自写远程桥成本。详见[Q01](#research-q01)。

平台/core分层、挂原preset、恢复provider和固定错误兜底可借鉴；身份、投递与OS隔离不能靠聊天目录名或WS重连保证。详见[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认白名单通配、群级ACL、缺身份按钮放行和群slash无作者核对削弱仅发起者审批；恢复/回复不等恰好一次。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，继续从严格单人身份、最小Agent权限和可审计任务/回复入手。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

远程接线/会话/回复贡献可核；身份审批与恢复送达限制明显；请求收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、SECURITY.md、package.json、index.js、client.js、core/acl.js、core/approval.js、core/session-map.js、core/outbound.js、core/slash.js、platform/router.js、platform/qqapi.js、platform/transport/websocket.js、lib/util.js、scripts/smoke-test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整host318行、core ACL/approval/session/outbound/slash、QQ API和WS/router关键链、util/UI凭据保存与mock代表测试。未运行目标/登录/发消息。
- 下一步：围绕群非发起者命令/缺身份/早点击/重放/new竞态/body挂起/小chunk与未知送达对照可审计收据，比较授权正确与总恢复成本。

**分析版本**

- **仓库**：[988hj7tczd-oss/dsh-im-qq](https://github.com/988hj7tczd-oss/dsh-im-qq)
- **版本号**：0.1.1（[固定提交 d1ae124](https://github.com/988hj7tczd-oss/dsh-im-qq/tree/d1ae12486264359f9c516bb2cf0ed5e75e811d37)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

bot/chat/event/author/turn绑定的远程任务收据，统一审批/去重/原子generation和可取消outbox；以群越权/重放/未知送达反例检验，未验证。详见[Q07](#research-q07)。

围绕群非发起者命令/缺身份/早点击/重放/new竞态/body挂起/小chunk与未知送达对照可审计收据，比较授权正确与总恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 654 | — | — | 9475 |
| .js | source | 11 | 2147 | 1567 | 473 | — |
| .mjs | source | 1 | 345 | 279 | 37 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+created%3A2026-09-22T10%3A13%3A53.071Z..2026-10-22T10%3A13%3A53.071Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-im-qq/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A13%3A53.071Z..2026-10-22T10%3A13%3A53.071Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**QQ远程完整Agent接入是否具备正确请求身份、审批和可解释回复恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QQ接入提供什么业务增量，哪些能力来自宿主？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向已在DSH运行Agent、希望在QQ私聊或群/频道@中请求任务并接收回复的人。原方案是回Web操作或自行写机器人中转，本项将QQ事件归一化为chatKey/文本，创建或恢复原Agent并挂preset，监听同源session事件返回文本，桥接原审批服务。工具、记忆、模型、子代理能力来自宿主/preset，不是本插件重新实现；图片/流式/typing/Webhook仅预留，实际支持文本+WebSocket。

贡献在平台适配与会话/审批/回复生命周期组合，减少把远程消息接完整Agent的接线。私聊按用户、群按整个群、频道按guild+channel共享上下文，不是群内每个人独立Agent；选择群就要接受共同上下文/权限。合格交付需身份和chat匹配、操作授权明确、回复可追到请求，不能把WS连上或“机器人已启动”日志当任务成功/送达。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:10-25](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/README.md#L10-L25)

作者能力范围。

<details>
<summary>查看原文（16行）</summary>

```text
## 功能

| 能力 | 状态 |
|---|---|
| 私聊（C2C）文本收发 | ✅ 已实现 |
| 群聊 @机器人 / 频道 @机器人 | ✅ 已实现 |
| 会话隔离（每人/每群独立 session，`qq:` 前缀） | ✅ 已实现 |
| 完整 agent 能力（工具/记忆/子代理/文件系统） | ✅ 经 `agentPresets.mount` 挂 standard preset |
| WS 长连接（心跳 / 断线重连 / RESUME / op9 重 identify） | ✅ 已实现 |
| 回复合并 / 超长分段 / 去内部标签 / 错误兜底 | ✅ 已实现 |
| 白名单 fail-closed + 频控 | ✅ 已实现 |
| 审批桥（QQ 内联按钮 ✅/⭐/❌）+ `/revoke` 撤销 | ✅ 已实现 |
| 斜杠命令 `/help /ping /me /new /approve /always /revoke` | ✅ 已实现 |
| Webhook transport（官方强制时启用） | ⏳ P5 预留，未实现 |
| 图片收发 / 流式回复 / typing | ⏳ P4，接口需实测确认后实现 |

```

</details>

**依据 2 · 源码核查**：[platform/router.js:44-96](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/router.js#L44-L96)

chatKey与共享会话。

<details>
<summary>查看原文（53行）</summary>

```text
  const openid = d.author?.user_openid || d.author?.openid || d.author?.member_openid
  if (!openid) return null
  const text = cleanContent(d.content)
  if (!text) return null
  return {
    message: {
      id: d.id,
      chat: { kind: 'user', id: openid, name: d.author?.nickname || openid },
      chatKey: `qq:user:${openid}`,
      content: [{ type: 'text', text }],
      authorOpenid: openid,
      // ⚠️ 被动回复 msg_id 取事件的 d.id（官方文档：C2C_MESSAGE_CREATE 等事件的 d.id），
      //    不是 d.msg_id——取错会导致带错 msg_id 发消息被平台拒绝
      replyTo: { chatId: 'user', messageId: d.id },
    },
  }
}

function routeGroup(d) {
  const groupOpenid = d.group_openid
  if (!groupOpenid) return null
  const text = cleanContent(d.content)
  if (!text) return null
  return {
    message: {
      id: d.id,
      chat: { kind: 'group', id: groupOpenid, name: d.group_openid || groupOpenid },
      chatKey: `qq:group:${groupOpenid}`,
      content: [{ type: 'text', text }],
      authorOpenid: d.author?.member_openid || d.author?.user_openid || d.author?.id || '',
      replyTo: { chatId: 'group', messageId: d.id },
    },
  }
}

function routeChannel(d) {
  const channelId = d.channel_id
  const guildId = d.guild_id
  if (!channelId) return null
  const text = cleanContent(d.content)
  if (!text) return null
  return {
    message: {
      id: d.id,
      chat: { kind: 'channel', id: channelId, guildId, name: `频道 ${channelId}` },
      chatKey: `qq:channel:${guildId}:${channelId}`,
      content: [{ type: 'text', text }],
      replyTo: { chatId: 'channel', messageId: d.id },
    },
  }
}

/**
```

</details>

**依据 3 · 源码核查**：[core/session-map.js:219-246](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L219-L246)

原Agent/preset。

<details>
<summary>查看原文（28行）</summary>

```text
  /** 全新会话：workspace 注册（前置两步，避免 workspace-not-found）→ agents.create。 */
  async create(sessionId, chatKey, chat) {
    const wsPath = this.workspacePath(chatKey)
    mkdirSync(wsPath, { recursive: true })
    await this.ctx.workspaceRegistry.create(wsPath, `QQ ${chat.kind} ${chat.id}`)
    this.log.info(`创建新会话 ${sessionId}（cwd: ${wsPath}）`)
    return this.ctx.agents.create({
      sessionId: SessionId(sessionId),
      meta: { cwd: wsPath, agentPreset: this.cfg.agentPreset },
      agentOptions: { provider: this.cfg.provider, model: this.cfg.model },
      setup: async (agentCtx) => {
        // 显式 mount（实锤：factory 不自动消费 meta.agentPreset，必须在 setup 里挂）
        await this.ctx.agentPresets.mount(agentCtx, this.cfg.agentPreset)
      },
    })
  }

  /** 恢复持久化会话（懒加载；mount 幂等，重复绑定同 agent 无害）。 */
  async resume(sessionId) {
    this.log.info(`恢复会话 ${sessionId}`)
    // ⚠️ 必须带 agentOptions（provider/model）——resume 不带的话 agent 没有模型，
    //    prompt 组装时 {{model}} 无值 → 回合直接报错（曾实机复现：重启后
    //    一直回「服务暂时不可用」兜底文本）
    return this.ctx.agents.resume({
      resumeSessionId: SessionId(sessionId),
      agentOptions: { provider: this.cfg.provider, model: this.cfg.model },
      setup: async (agentCtx) => {
        await this.ctx.agentPresets.mount(agentCtx, this.cfg.agentPreset)
```

</details>

**依据 4 · 源码核查**：[index.js:261-273](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L261-L273)

启动日志与仅WS分支。

<details>
<summary>查看原文（13行）</summary>

```text
        }
      }
      const api = new QQApi({ id, secret, sandbox: cfg.sandbox, logger: log, timer: ctx.timer })
      const transport = new QQWebSocketTransport({ qqapi: api, logger: log, timer: ctx.timer, onEvent })
      bot = { qqapi: api, transport, appId: id, credKey }
      qqapi = api
      if (cfg.transport === 'websocket') {
        transport.start().catch((err) => log.error('transport 启动失败:', err?.message))
        log.info(`机器人已启动（${reason}）：AppID=${id} transport=websocket`)
      } else {
        log.warn(`transport=${cfg.transport} 尚未实现（P5 预留），当前仅支持 websocket；机器人未连接，请改为 'websocket'`)
      }
    })()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 白名单与审批是否始终只允许发起者？

**研究主题：**功能与机制、缺陷与关键质疑

#### 完整回答

Acl空数组确实failclosed，群/频道按chat.id在groupAllowFrom匹配；但是Config默认allowFrom/groupAllowFrom都是['*']，未显式配置不等空，因此开箱策略实际放行可达发送者。群白名单只核群/频道ID，不核其中成员；每chat60秒30条防洪但不区分危险命令。入站在ACL前log.info记录chat和前60字符，debug=false也会写内容。

按钮approval handle从sessionMap.authorFor取“最近入站作者”，不是绑定触发该工具的消息作者；等待sendKeyboard完成后才放pending并取initiator，期间新消息可改作者。onInteraction仅两边身份均非空且不等才拒，任一缺失放行；channel router压根没填authorOpenid，频道桥天然缺发起者。interaction分流还在普通ACL前，未绑定callback chat与pending chat。不能据SECURITY概括为只有发起者。

更直接的群内绕过是slash /approve与/always只传chat，approveOnce只比chatKey、setAlways只找本chat agent，没成员/initiator校验；任何能通过群ACL的成员都可允许别人的pending或切policy=never。always含义是整个会话后续不再问，不是只允许这类工具；revoke可恢复ask，超时返回unavailable是正向，但不弥补这些身份缺口。界面所有人可点按钮的配置又依赖后端核查，缺身份兼容不能当安全failclosed。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:73-74](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L73-L74)

默认通配与配置。

```text
  allowFrom: z.array(z.string()).default(['*']), // 空=全拒（fail-closed）
  groupAllowFrom: z.array(z.string()).default(['*']),
```

**依据 2 · 源码核查**：[core/acl.js:35-58](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/acl.js#L35-L58)

群身份与频控。

<details>
<summary>查看原文（24行）</summary>

```text
  check(chat, chatKey) {
    // —— 白名单（fail-closed）——
    // 频道属于"群组"性质，与群共用 groupAllowFrom
    const list = chat.kind === 'group' || chat.kind === 'channel'
      ? this.groupAllowFrom
      : this.allowFrom
    if (list.length === 0) {
      return { ok: false, reason: `未配置白名单（fail-closed），拒绝 ${chatKey}` }
    }
    if (!list.includes('*') && !list.includes(chat.id)) {
      return { ok: false, reason: `不在白名单，拒绝 ${chatKey}` }
    }

    // —— 频率限制（滑动窗口）——
    const now = Date.now()
    const hits = (this.rateHits.get(chatKey) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (hits.length >= RATE_LIMIT_MAX) {
      return { ok: false, reason: `频率超限（${RATE_LIMIT_MAX} 条/${RATE_LIMIT_WINDOW_MS / 1000}s），拒绝 ${chatKey}` }
    }
    hits.push(now)
    this.rateHits.set(chatKey, hits)
    return { ok: true }
  }
}
```

</details>

**依据 3 · 源码核查**：[index.js:131-153](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L131-L153)

interaction/日志/ACL顺序。

<details>
<summary>查看原文（23行）</summary>

```text
          qqapi?.ackInteraction(interaction.interactionId)
        }
        if (approvalBridge?.onInteraction(interaction.dataId, interaction.clicker)) return
        log.debug('未消费的交互回调 dataId =', interaction.dataId)
        return
      }

      const { message } = routed
      log.info(`入站 ${message.chat.kind}(${message.chat.id}): ${message.content?.[0]?.text?.slice(0, 60) || ''}`)

      // 白名单 fail-closed
      const gate = acl.check(message.chat, message.chatKey)
      if (!gate.ok) {
        log.warn(`拒绝 ${message.chatKey}: ${gate.reason}`)
        return
      }

      // 斜杠命令（chat 需携带 chatKey 供 slash/session-map 匹配）
      if (slash) {
        const chat = { ...message.chat, chatKey: message.chatKey }
        const text = message.content?.filter((b) => b?.type === 'text').map((b) => b.text).join('\n') || ''
        const result = await slash.handle(chat, text)
        if (result) {
```

</details>

**依据 4 · 源码核查**：[core/approval.js:50-119](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/approval.js#L50-L119)

最近作者与缺身份放行。

<details>
<summary>查看原文（70行）</summary>

```text
   */
  async handle(req, next) {
    const sessionId = req.agent.session.id
    if (!sessionId.startsWith('qq:')) return next()

    const chat = this.sessionMap.chatForSession(sessionId)
    if (!chat) return next() // 会话已被 /new 重置等，无发送目标 → 不拦截

    const requestId = `${PREFIX}${++this.counter}`
    const reason = req.reason ? `（${req.reason}）` : ''
    const minutes = Math.max(1, Math.round(this.cfg.approvalTimeoutMs / 60000))
    const text = `⚠️ 需要你的审批：\n操作：${req.toolName}${reason}\n\n（${minutes} 分钟内有效，超时自动拒绝）`

    try {
      await this.sendKeyboard(chat, text, [
        { id: `${requestId}:${ACTION_ALLOW}`, label: '✅ 允许一次', action: ACTION_ALLOW },
        { id: `${requestId}:${ACTION_ALWAYS}`, label: '⭐ 始终允许', action: ACTION_ALWAYS },
        { id: `${requestId}:${ACTION_REJECT}`, label: '❌ 拒绝', action: ACTION_REJECT },
      ])
    } catch (err) {
      this.log.error('审批按钮发送失败（fail-closed → unavailable）:', err?.message)
      return 'unavailable'
    }

    // 等待按钮回调；超时 fail-closed
    return new Promise((resolve) => {
      const timer = this.ctx.timer.timeout(() => {
        this.pending.delete(requestId)
        this.log.warn(`审批 ${requestId} 超时（${this.cfg.approvalTimeoutMs}ms），自动拒绝`)
        resolve('unavailable')
      }, this.cfg.approvalTimeoutMs)
      this.pending.set(requestId, {
        chat,
        // 发起审批时的最近入站作者（审批点击者身份校验：只有发起者能点）
        initiator: this.sessionMap.authorFor(chat.chatKey) || '',
        resolve: (outcome) => {
          this.pending.delete(requestId)
          timer()
          resolve(outcome)
        },
        settled: false,
      })
    })
  }

  /**
   * 按钮回调入口（index.js 从 router 的 INTERACTION_CREATE 分流）。
   * @param {string} dataId 按钮 id（'qq_apv_<n>:<action>'）
   * @param {string} [clicker] 点击者 openid（INTERACTION_CREATE 事件 user.id）
   * @returns {boolean} 是否本桥消费（是 → 不再进消息管线）
   *
   * ⚠️ 安全：校验点击者身份——按钮 id 只编码 requestId，若不禁身份，
   *    群聊里任何成员都能点 ⭐「始终允许」把群会话 policy 切到 never。
   *    校验规则：有发起者且有点击者时两者必须一致；任一缺失则放行（防误伤）。
   */
  onInteraction(dataId, clicker = '') {
    const m = new RegExp(`^${PREFIX}(\\d+):(${ACTION_ALLOW}|${ACTION_ALWAYS}|${ACTION_REJECT})$`).exec(dataId)
    if (!m) return false
    const [, n, action] = m
    const entry = this.pending.get(`${PREFIX}${n}`)
    if (!entry) return true // 已过期/已处理：吞掉，不打扰用户
    if (entry.settled) return true
    if (entry.initiator && clicker && entry.initiator !== clicker) {
      this.log.warn(`审批点击者身份不符，忽略（initiator=${entry.initiator} clicker=${clicker}）`)
      return true
    }
    entry.settled = true

    if (action === ACTION_ALLOW) {
      entry.resolve('allowed-once')
```

</details>

**依据 5 · 源码核查**：[core/approval.js:145-171](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/approval.js#L145-L171)

slash授权按chat。

<details>
<summary>查看原文（27行）</summary>

```text
    const chat = this.sessionMap.chatForChatKey(chatKey)
    for (const [requestId, entry] of this.pending) {
      if (entry.settled) continue
      if (chat && entry.chat.chatKey === chatKey) {
        entry.settled = true
        entry.resolve('allowed-once')
        this.log.info(`/approve：允许 ${requestId}`)
        return true
      }
    }
    return false
  }

  /** /always：该 chat 的 agent 切 policy=never（始终允许）。 */
  setAlways(chat) {
    const agent = this.sessionMap.agentForChat(chat)
    if (!agent) return false
    try {
      this.ctx.approval.setPolicy(agent, 'never')
      return true
    } catch (err) {
      this.log.error('setPolicy(never) 失败:', err?.message)
      return false
    }
  }

  /** /revoke：撤销「始终允许」，恢复逐次审批（policy=ask）。 */
```

</details>

**依据 6 · 源码核查**：[core/slash.js:55-71](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/slash.js#L55-L71)

未传作者的审批命令。

<details>
<summary>查看原文（17行）</summary>

```text
        return { reply: `📋 会话：${info.sessionId}\n创建时间：${created}\n状态：${info.live ? '🟢 活跃' : '⚪ 待唤醒'}` }
      }
      case '/new': {
        // 等待旧 agent 真正 dispose 完成再回复（避免旧 agent 泄漏/并发写文件）
        await this.sessionMap.reset(chat).catch((err) => this.log.error('/new 失败:', err?.message))
        return { reply: '🆕 已开启新会话，上下文已清空（历史记录保留在磁盘）。' }
      }
      case '/approve': {
        if (!this.approvalBridge) return { reply: '审批桥未启用（config.approval=false）' }
        const ok = this.approvalBridge.approveOnce(chat.chatKey)
        return { reply: ok ? '✅ 已允许该操作一次' : '当前没有待审批的操作。' }
      }
      case '/always': {
        if (!this.approvalBridge) return { reply: '审批桥未启用（config.approval=false）' }
        const ok = this.approvalBridge.setAlways(chat)
        return { reply: ok ? '⭐ 已设置始终允许，后续操作不再询问（/revoke 可撤销）' : '当前没有活跃会话可设置。' }
      }
```

</details>

**依据 7 · 源码核查**：[platform/router.js:82-96](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/router.js#L82-L96)

频道缺author。

<details>
<summary>查看原文（15行）</summary>

```text
  if (!channelId) return null
  const text = cleanContent(d.content)
  if (!text) return null
  return {
    message: {
      id: d.id,
      chat: { kind: 'channel', id: channelId, guildId, name: `频道 ${channelId}` },
      chatKey: `qq:channel:${guildId}:${channelId}`,
      content: [{ type: 'text', text }],
      replyTo: { chatId: 'channel', messageId: d.id },
    },
  }
}

/**
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 会话隔离、懒恢复和重置可靠到什么程度？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

SessionMap以chatKey串行deliver防并发创建，创建前注册workspace、挂preset；持久映射记录sessionId/generation，重启懒resume并保provider/model，避免只恢复空Agent。workspaceIsolation只是每chat独立目录，未设置独立安全策略，不是群成员隔离或所有读写全隔离；safeSegment有损替字符，sessionId也不带AppID/实例namespace，多实例同配置需额外约束。save同步直写JSON、无tmp/版本锁，坏映射清空，写失败日志后仍继续，不保证重启映射完整。

恢复失败的注释说generation+1，代码却entry=null后newSessionId(chatKey,undefined)用默认0，可复用旧chatKey ID而不是新世代；旧日志/引擎如何拒冲突依宿主，不能承诺自动安全新建。/new不走deliver的inflight队列，dispose失败catch仍更新映射并回复已新建，可能旧Agent未停；与已在创建/投递的消息并发可重新写回旧entry。followup不await完成/受理，也不去重message.id，序列化仅包创建和调用，不等整个turn串行处理。最新作者和outbound被动预算随新消息覆盖，群并发请求的审批/回复归属要分清。

#### 证据与依据

**依据 1 · 源码核查**：[core/session-map.js:75-112](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L75-L112)

恢复和非原子save。

<details>
<summary>查看原文（38行）</summary>

```text
    if (!this.mapFile || !existsSync(this.mapFile)) return
    try {
      const data = JSON.parse(readFileSync(this.mapFile, 'utf8'))
      for (const [chatKey, rec] of Object.entries(data || {})) {
        const chat = parseChatKey(chatKey)
        if (!chat) continue
        // sessionId 可能为 null（/new 后未发新消息就重启）：保留 generation，
        // 下次 deliver 时用 generation 生成新会话 id，避免与磁盘旧日志冲突
        this.entries.set(chatKey, {
          sessionId: rec.sessionId ?? null,
          generation: rec.generation ?? 0,
          chat,
          handle: null, // 懒恢复
          createdAt: rec.createdAt ?? Date.now(),
        })
      }
      this.log.info(`已恢复 ${this.entries.size} 个 QQ 会话映射`)
    } catch (err) {
      this.log.error('恢复会话映射失败（将重新开始）:', err?.message)
      this.entries.clear()
    }
  }

  /** 持久化映射（chatKey → sessionId / generation）。写失败不影响主流程。 */
  save() {
    if (!this.mapFile) return
    try {
      const data = {}
      for (const [chatKey, e] of this.entries) {
        data[chatKey] = { sessionId: e.sessionId, generation: e.generation, createdAt: e.createdAt }
      }
      writeFileSync(this.mapFile, JSON.stringify(data, null, 2), 'utf8')
    } catch (err) {
      this.log.error('保存会话映射失败:', err?.message)
    }
  }

  /** 会话信息（/me 命令）。 */
```

</details>

**依据 2 · 源码核查**：[core/session-map.js:154-170](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L154-L170)

deliver串行。

<details>
<summary>查看原文（17行）</summary>

```text
   */
  async deliver(message) {
    const chatKey = message.chatKey
    const chat = message.chat
    const text = message.content?.filter((b) => b?.type === 'text').map((b) => b.text).join('\n') || ''

    // 同 chatKey 串行化（防并发 create/resume 竞态）
    const run = async () => this.deliverCore(chatKey, chat, text, message)
    const prev = this.inflight.get(chatKey) || Promise.resolve()
    const cur = prev.then(run, run)
    this.inflight.set(chatKey, cur)
    try {
      return await cur
    } finally {
      if (this.inflight.get(chatKey) === cur) this.inflight.delete(chatKey)
    }
  }
```

</details>

**依据 3 · 源码核查**：[core/session-map.js:172-216](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L172-L216)

恢复失败/不await投递。

<details>
<summary>查看原文（45行）</summary>

```text
  async deliverCore(chatKey, chat, text, message) {
    let entry = this.entries.get(chatKey)
    this.setAuthor(chatKey, message?.authorOpenid)

    // 1. live agent 复用（⚠️ ctx.agents.get(id) 返回 agent 本身，不是 handle）
    let agent = entry?.sessionId ? this.ctx.agents.get(entry.sessionId) : undefined

    // 2. 无 live：有持久化记录 → resume；无 → create
    if (!agent) {
      if (entry?.sessionId) {
        try {
          const handle = await this.resume(entry.sessionId)
          agent = handle.agent
          entry = { ...entry, handle }
          // ⚠️ 必须写回映射（create 分支有 set+save，resume 分支曾漏掉）：
          //   不写回则 entry.handle 永远为 null → /new 泄漏旧 agent、
          //   /always /revoke 永远失败、/me 永远显示「待唤醒」
          this.entries.set(chatKey, entry)
          this.save()
        } catch (err) {
          // 持久化损坏/缺失：放弃该记录，落回新建会话（generation+1）
          this.log.error(`恢复会话 ${entry.sessionId} 失败，改为新建:`, err?.message)
          entry = null
        }
      }
      if (!agent) {
        const sessionId = this.newSessionId(chatKey, entry?.generation)
        const handle = await this.create(sessionId, chatKey, chat)
        agent = handle.agent
        entry = { sessionId, generation: entry?.generation ?? 0, chat, handle, createdAt: Date.now() }
        this.entries.set(chatKey, entry)
        this.save()
      }
    }

    // 3. 通知 outbound 本轮的被动回复预算（msg_id 只对本条入站消息有效）
    this.outbound?.beginTurn(agent.session.id, message.replyTo?.messageId)

    // 4. 投递（createUserMessage 签名实锤：无 id 字段，content 是 ContentBlock[]）
    const userMessage = createUserMessage({
      content: [{ type: 'text', text }],
      source: { kind: 'plugin', plugin: 'dsh-im-qq' },
    })
    agent.followup(userMessage)
    return agent
```

</details>

**依据 4 · 源码核查**：[core/session-map.js:250-278](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L250-L278)

reset/工作目录。

<details>
<summary>查看原文（29行）</summary>

```text

  /**
   * /new：dispose 旧 agent，generation+1；sessionId 置空，
   * 下次 deliver 时新建会话（历史保留在磁盘，新会话用 chatKey#<gen> 避免冲突）。
   */
  async reset(chat) {
    const chatKey = chat.chatKey
    const entry = this.entries.get(chatKey)
    if (entry?.handle) {
      await entry.handle.dispose().catch((err) => this.log.error('dispose 旧 agent 失败:', err?.message))
    }
    const generation = (entry?.generation ?? -1) + 1
    this.entries.set(chatKey, { sessionId: null, generation, chat, handle: null, createdAt: Date.now() })
    this.save()
    this.log.info(`/new：${chatKey} 已重置（generation=${generation}）`)
  }

  /** workspaceIsolation=true 时每个 chatKey 独立子目录，防并发写文件互踩。 */
  workspacePath(chatKey) {
    return this.cfg.workspaceIsolation
      ? join(this.cfg.cwd, safeSegment(chatKey))
      : this.cfg.cwd
  }

  /** sessionId 生成：首个会话 = chatKey，之后 chatKey#<generation>（前缀保持 qq:）。 */
  newSessionId(chatKey, generation = 0) {
    return generation === 0 ? chatKey : `${chatKey}#${generation}`
  }
}
```

</details>

**依据 5 · 源码核查**：[core/slash.js:57-60](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/slash.js#L57-L60)

reset失败仍成功文本。

```text
      case '/new': {
        // 等待旧 agent 真正 dispose 完成再回复（避免旧 agent 泄漏/并发写文件）
        await this.sessionMap.reset(chat).catch((err) => this.log.error('/new 失败:', err?.message))
        return { reply: '🆕 已开启新会话，上下文已清空（历史记录保留在磁盘）。' }
```

#### 缺口

- 固定宿主同sessionId重建、followup受理与dispose失败/并发的真实契约
  **影响：**无法把本地映射/已新建文本等同旧turn已停止或新消息恰好处理一次
  **进一步探讨：**对照宿主固定Agent/sessionPersistence契约，核坏映射/创建中new/重复事件和ID冲突的受理事实

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · WS恢复与回复链有哪些真实保证和缺口？

**研究主题：**功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

WS保sequence/sessionId用于RESUME，op9清状态重新identify，心跳两周期无ack触发重连、指数退避上限30秒，stop清timer/连接；属于连接恢复，不是持久消息队列。DISPATCH只记录seq后onEvent不await，无message.id去重，重放/重启不保证exactly once。QQApi token只内存、刷新循环与10秒fetch头请求超时，返回Response后timer已清，res.json/text读取不在原预算内；频控退避5/10/20/30/60秒总和可长，sleep无stop/取消信号，卸载/凭据切换后已有发送仍可能续跑。

Outbound聚合文本/去内部标签/UTF8分段，error无内容给固定兜底避免泄露引擎错误。flushTimer从创建buffer时设定且后续消息不重置，实为首条后窗口而非持续静默窗口；buffer移出Map再异步send，多次flush可能并行而串行只在各buffer内部。pendingPassive首次buffer取走，flush又删除；同轮后续buffer无原msgId会转主动，不能泛称所有正常回复都不耗主动配额。发送失败QQApi可能返回null，outbound不核结果也不留重试状态，已见assistant文本会抑制error兜底，即使实际没送到。

chunkText在UTF16码元上累加UTF8，再护代理对，可保一般emoji但较保守；textChunkLimit schema没最小值，若小于首字符字节数，cut=0、remaining不变，while可能无限循环。应保持合理正数且核平台限制，不把可配任意number当健壮预算。平台配额/错误码规则在README是作者固定版本报告，本轮不验证其今日状态。

#### 证据与依据

**依据 1 · 源码核查**：[platform/transport/websocket.js:111-157](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/transport/websocket.js#L111-L157)

seq与不await事件。

<details>
<summary>查看原文（47行）</summary>

```text

    ws.onerror = (err) => {
      this.log.error('WS 错误:', err?.message || err)
    }
  }

  handleMessage(msg) {
    switch (msg.op) {
      case OP.HELLO: {
        this.heartbeatIntervalMs = msg.d?.heartbeat_interval ?? 41_000
        this.log.debug('hello: heartbeat_interval =', this.heartbeatIntervalMs)
        this.startHeartbeat()
        this.identify()
        break
      }
      case OP.DISPATCH: {
        this.sequence = msg.s
        if (msg.t === 'READY') {
          this.sessionId = msg.d?.session_id ?? null
          this.resumable = true
          this.reconnectAttempt = 0 // 连接稳定，重置退避
          this.log.info('WS READY, session_id =', this.sessionId?.slice(0, 8) + '…')
        } else if (msg.t === 'RESUMED') {
          this.resumable = true
          this.reconnectAttempt = 0
          this.log.info('WS RESUMED（会话恢复成功）')
        }
        if (this.onEvent) this.onEvent(msg)
        break
      }
      case OP.HEARTBEAT_ACK: {
        this.awaitingAck = false
        this.lastAckAt = Date.now()
        break
      }
      case OP.RECONNECT: {
        // op7：服务器要求重连，可 RESUME
        this.log.warn('收到 op7(reconnect)，主动重连（将尝试 RESUME）')
        this.resumable = true
        this.ws?.close(4000, 'op7 reconnect')
        break
      }
      case OP.INVALID_SESSION: {
        // op9：session 失效，必须全新 identify（不能带 session_id）
        this.log.warn('收到 op9(invalid session)，session 失效，将全新 identify')
        this.resumable = false
        this.sessionId = null
```

</details>

**依据 2 · 源码核查**：[platform/transport/websocket.js:167-238](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/transport/websocket.js#L167-L238)

心跳重连停止。

<details>
<summary>查看原文（72行）</summary>

```text
  /** 心跳循环：每 heartbeat_interval 发 op1；超过 2 周期未 ack 判定断线重连。 */
  startHeartbeat() {
    this.stopHeartbeat()
    this.awaitingAck = false
    this.lastAckAt = Date.now()
    this.heartbeatTimer = this.timer.interval(() => {
      if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
      if (this.awaitingAck && Date.now() - this.lastAckAt > this.heartbeatIntervalMs * HEARTBEAT_ACK_TIMEOUT_FACTOR) {
        this.log.warn('心跳超时（未收到 ack），强制重连')
        this.ws.close(4000, 'heartbeat timeout')
        return
      }
      this.awaitingAck = true
      try {
        this.ws.send(JSON.stringify({ op: OP.HEARTBEAT, d: this.sequence ?? null }))
      } catch (err) {
        this.log.error('心跳发送失败', err?.message)
      }
    }, this.heartbeatIntervalMs)
  }

  stopHeartbeat() {
    this.heartbeatTimer?.()
    this.heartbeatTimer = null
  }

  /** identify / resume 二选一：resumable 且有 session_id 时走 RESUME，否则全新 IDENTIFY。 */
  identify() {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) return
    const token = `QQBot ${this.qqapi.token}`
    if (this.resumable && this.sessionId) {
      this.log.info('发起 RESUME(seq=' + this.sequence + ')')
      this.ws.send(JSON.stringify({
        op: OP.RESUME,
        d: { token, session_id: this.sessionId, seq: this.sequence ?? null },
      }))
    } else {
      this.log.info('发起 IDENTIFY（全新会话）')
      this.ws.send(JSON.stringify({
        op: OP.IDENTIFY,
        d: { token, intents: INTENTS, shard: [0, 1] },
      }))
    }
  }

  /** 断线重连：指数退避（1s → 2s → … → 30s 上限）。 */
  scheduleReconnect() {
    if (this.stopped) return
    this.reconnectTimer?.()
    const delay = Math.min(RECONNECT_MAX_MS, RECONNECT_BASE_MS * 2 ** this.reconnectAttempt)
    this.reconnectAttempt += 1
    this.log.info(`${delay / 1000}s 后重连…`)
    this.reconnectTimer = this.timer.timeout(() => {
      this.reconnectTimer = null
      this.connect()
    }, delay)
  }

  /** 插件卸载/停止：关闭连接、清定时器。 */
  stop() {
    this.stopped = true
    this.stopHeartbeat()
    this.reconnectTimer?.()
    this.reconnectTimer = null
    try {
      this.ws?.close(4000, 'dsh-im-qq stop')
    } catch {
      /* ignore */
    }
    this.ws = null
  }
}
```

</details>

**依据 3 · 源码核查**：[platform/qqapi.js:22-35](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/qqapi.js#L22-L35)

仅fetch头阶段timer。

<details>
<summary>查看原文（14行）</summary>

```text
/** fetch + AbortController 超时（防接口挂起导致整条链路卡死）。 */
async function fetchWithTimeout(url, init = {}) {
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), HTTP_TIMEOUT_MS)
  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } catch (err) {
    if (err?.name === 'AbortError') throw new Error(`QQ API 请求超时（${HTTP_TIMEOUT_MS}ms）: ${url}`)
    throw err
  } finally {
    clearTimeout(timer)
  }
}

```

</details>

**依据 4 · 源码核查**：[platform/qqapi.js:221-270](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/platform/qqapi.js#L221-L270)

退避/返回null。

<details>
<summary>查看原文（50行）</summary>

```text
        return res.json().catch(() => null)
      }
      const text = await res.text().catch(() => '')
      let code = null
      try {
        code = JSON.parse(text).code ?? null
      } catch {
        /* 非 JSON 响应 */
      }
      return { _status: res.status, _code: code, _text: text.slice(0, 300) }
    }

    let result = await attempt(token, false)
    // token 失效：刷新后重试一次
    if (result && typeof result === 'object' && '_status' in result && [401, 403].includes(result._status)) {
      this.log.warn('token 失效，刷新后重试')
      const fresh = await this.refreshToken().catch(() => null)
      if (fresh) result = await attempt(fresh, true)
    }
    // 频控 50015014：指数退避重试
    let backoffIndex = 0
    while (
      result && typeof result === 'object' && '_code' in result && result._code === 50015014 &&
      backoffIndex < RATE_LIMIT_BACKOFF.length
    ) {
      const wait = RATE_LIMIT_BACKOFF[backoffIndex]
      this.log.warn(`平台频控 50015014，${wait / 1000}s 后重试 (${backoffIndex + 1}/${RATE_LIMIT_BACKOFF.length})`)
      await sleep(wait)
      const freshToken = await this.getAccessToken().catch(() => token)
      result = await attempt(freshToken, true)
      backoffIndex += 1
    }

    if (result && typeof result === 'object' && '_status' in result) {
      const { _status, _code, _text } = result
      if (_code === 11255) {
        this.log.error(`发送失败 code=11255（永久性错误：私域机器人或发送者不在沙箱/测试人员名单）: ${_text}`)
      } else {
        this.log.error(`发送失败 HTTP ${_status} code=${_code}: ${_text}`)
      }
      return null
    }
    this.log.debug('发送成功 →', chat.kind, chat.id, 'seq', body.msg_seq)
    return result
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
```

</details>

**依据 5 · 源码核查**：[core/outbound.js:91-146](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/outbound.js#L91-L146)

buffer/预算/发送。

<details>
<summary>查看原文（56行）</summary>

```text
    }
  }

  /** 聚合一条 assistant 文本到合并缓冲。 */
  buffer(session, turn, text) {
    let b = this.buffers.get(session.id)
    if (!b) {
      const chat = this.sessionMap.chatForSession(session.id)
      if (!chat) return // 无对应聊天（会话已重置），丢弃
      // 消费 beginTurn 预置的被动预算（若无则无被动）
      const pp = this.pendingPassive.get(session.id)
      b = {
        sessionId: session.id,
        chat,
        parts: [],
        turn,
        flushTimer: null,
        maxTimer: null,
        passive: pp ?? { msgId: null, used: 0 },
      }
      this.pendingPassive.delete(session.id)
      b.flushTimer = this.ctx.timer.timeout(() => this.flush(session.id), this.cfg.deliverWindowMs)
      b.maxTimer = this.ctx.timer.timeout(() => this.flush(session.id), this.cfg.deliverMaxWaitMs)
      this.buffers.set(session.id, b)
    }
    const cleaned = stripInternalTags(text)
    if (cleaned) b.parts.push(cleaned)
  }

  /** 发送合并缓冲（清 timer）。 */
  async flush(sessionId) {
    const b = this.buffers.get(sessionId)
    if (!b) return
    b.flushTimer?.()
    b.maxTimer?.()
    this.buffers.delete(sessionId)
    this.pendingPassive.delete(sessionId)

    const text = b.parts.join('\n\n').trim()
    if (!text) return

    // 分段：> textChunkLimit 拆多条；串行发送（防乱序 + 降频控）。
    // ⚠️ 全部走被动回复（官方：主动消息每月限 4 条/人/群，超限发送失败）——
    //    被动回复限 replyPassiveLimit 次/消息，预算内绝不落主动
    const chunks = chunkText(text, this.cfg.textChunkLimit)
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index]
      const passive = b.passive.msgId && b.passive.used < this.cfg.replyPassiveLimit
      if (passive) b.passive.used += 1
      try {
        await this.send(b.chat, [{ type: 'text', text: chunk }], {
          passive,
          msgId: b.passive.msgId || undefined,
        })
      } catch (err) {
        this.log.error('出站发送失败:', err?.message)
```

</details>

**依据 6 · 源码核查**：[lib/util.js:44-73](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/lib/util.js#L44-L73)

分段循环与cut。

<details>
<summary>查看原文（30行）</summary>

```text
  const rest = (text ?? '').trim()
  if (!rest) return out
  const max = limit > 0 ? limit : 4000
  let remaining = rest
  while (Buffer.byteLength(remaining, 'utf8') > max) {
    let bytes = 0
    let cut = 0
    let lastNewline = -1
    for (let i = 0; i < remaining.length; i += 1) {
      bytes += Buffer.byteLength(remaining[i], 'utf8')
      if (bytes > max) break
      if (remaining[i] === '\n') lastNewline = i
      cut = i + 1
    }
    // 预算过半后若遇到换行，优先在换行处断开（可读性）
    if (lastNewline > max / 2 && lastNewline + 1 < remaining.length) cut = lastNewline + 1
    // 不在 UTF-16 代理对中间切断：emoji 等 4 字节字符是代理对（2 个 code unit），
    // 切成两半会产生孤立代理项，发给平台会损坏内容
    if (cut > 0 && cut < remaining.length &&
        remaining.charCodeAt(cut - 1) >= 0xD800 && remaining.charCodeAt(cut - 1) <= 0xDBFF &&
        remaining.charCodeAt(cut) >= 0xDC00 && remaining.charCodeAt(cut) <= 0xDFFF) {
      cut -= 1
    }
    out.push(remaining.slice(0, cut).trim())
    remaining = remaining.slice(cut).trim()
  }
  if (remaining) out.push(remaining)
  return out
}

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 部署依赖、凭证隐私与三阶段成本怎么判断？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

Node>=22提供fetch/WebSocket，硬服务agents/agentPresets/workspaceRegistry/sessionPersistence/approval/timer/sessions，模型provider/preset和工作区需宿主可用。AppID/Secret按row明文→环境变量→credentials优先；SECURITY“不落明文”仅适用凭证域/环境路径，配置schema与README明确支持明文secret，凭证域安全还依宿主。UI先写AppID再写Secret，两次非事务触发更新，保存成功只证明credentials calls完成，不证明WS登录/平台可发消息；ensureBot并发守卫复用正在启动promise，不排队重读最新组合，需核部分更新/失败。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node>=22、DSH完整Agent/preset/工作区/审批服务，QQ bot账户/模型 | 配AppID/Secret与受权身份、独立工作区和沙箱，核平台类型/审核条件 | 账户条件与配额为作者版本材料，当前平台规则未独立核；金额工时未知 |
| 持续使用 | WS/token维护、宿主模型/工具与QQ请求，多段/主动回复额外资源 | 群协作权限管理、审批复核、漏重送检查；耗时未知 | 30条/分钟是每chat入站频控，非模型费用/全局并发硬限 |
| 失败恢复 | 本地映射/会话日志/工作区备份、token/WS与重发资源 | 核旧turn是否仍跑、重置generation和已发回复，必要时撤销权限 | 无持久inbox/outbox/业务去重；退避不可取消，送达/外部副作用状态未知，工时金额未知 |

用户把完整Agent接到远程群即扩展控制面，选最小preset/独立工作区和严格成员权限比“消息插件”名称更影响成本风险。日志会在ACL前含入站片段，QQ和模型分别得到内容，标签regex不是全敏感信息去除。首次平台审核/沙箱/URL白名单、WS长期支持与主动配额均依作者材料和平台现实条件，不能硬填当前费用或成功率。本轮不登录/发QQ/执行安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:13-15](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/package.json#L13-L15)

Node范围。

```text
  "engines": {
    "node": ">=22"
  },
```

**依据 2 · 源码核查**：[index.js:46-59](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L46-L59)

硬宿主依赖。

<details>
<summary>查看原文（14行）</summary>

```text
/** 硬依赖（对应服务缺失时插件进入等待，服务出现后自动激活）。 */
export const inject = [
  'agents',
  'agentPresets',
  'workspaceRegistry',
  'sessionPersistence',
  'approval',
  'timer',
  'sessions',
]

/** 凭据域 ref（配置卡片写入、本插件读取；值存 $DSH_HOME/.credentials.yaml）。 */
export const CRED_APPID = 'QQ_BOT_APP_ID'
export const CRED_SECRET = 'QQ_BOT_APP_SECRET'
```

</details>

**依据 3 · 源码核查**：[index.js:228-246](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L228-L246)

凭证解析。

<details>
<summary>查看原文（19行）</summary>

```text
    let secret = raw.secret || ''
    if (!secret && raw.secretEnv) secret = process.env[raw.secretEnv] || ''
    if (cred) {
      try {
        if (!id) id = (await cred.resolve(CRED_APPID))?.value || ''
        if (!secret) secret = (await cred.resolve(CRED_SECRET))?.value || ''
      } catch (err) {
        log.error('读取凭据失败:', err?.message)
      }
    }
    return { id: String(id).trim(), secret: String(secret).trim() }
  }

  const ensureBot = async (reason) => {
    // 并发守卫：启动 + 凭据更新同时触发时只执行一次（防双 WS 连接）
    if (botStarting) return botStarting
    const run = (async () => {
      const { id, secret } = await resolveCreds()
      if (!id || !secret) {
```

</details>

**依据 4 · 源码核查**：[client.js:198-216](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/client.js#L198-L216)

两步保存非启动验收。

<details>
<summary>查看原文（19行）</summary>

```text
      var onSave = function () {
        if (!appid.trim() || !secret.trim()) {
          setError(t('empty'))
          return
        }
        setError('')
        setMessage('')
        setBusy(true)
        props
          .save({ appid: appid.trim(), secret: secret.trim() })
          .then(function () {
            setBusy(false)
            setSecret('')
            setConfigured(true)
            setMessage(t('saved'))
            refresh()
          })
          .catch(function (e) {
            setBusy(false)
```

</details>

**依据 5 · 源码核查**：[index.js:247-278](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L247-L278)

并发启动与日志。

<details>
<summary>查看原文（32行）</summary>

```text
        if (bot) stopBot()
        log.warn(
          `凭据未就绪（${reason}），机器人未启动——请在「设置 → 插件 → QQ 机器人」填写 AppID / AppSecret，保存后自动生效`,
        )
        return
      }
      const credKey = `${id}|${secret}`
      if (bot) {
        // 凭据已变化（id 或 secret 任一不同）→ 重启机器人；未变化则忽略（防抖）
        if (bot.credKey !== credKey) {
          log.info(`凭据已更新（${reason}），重启机器人: AppID=${bot.appId} → ${id}`)
          stopBot()
        } else {
          return
        }
      }
      const api = new QQApi({ id, secret, sandbox: cfg.sandbox, logger: log, timer: ctx.timer })
      const transport = new QQWebSocketTransport({ qqapi: api, logger: log, timer: ctx.timer, onEvent })
      bot = { qqapi: api, transport, appId: id, credKey }
      qqapi = api
      if (cfg.transport === 'websocket') {
        transport.start().catch((err) => log.error('transport 启动失败:', err?.message))
        log.info(`机器人已启动（${reason}）：AppID=${id} transport=websocket`)
      } else {
        log.warn(`transport=${cfg.transport} 尚未实现（P5 预留），当前仅支持 websocket；机器人未连接，请改为 'websocket'`)
      }
    })()
    botStarting = run
    try {
      return await run
    } finally {
      if (botStarting === run) botStarting = null
```

</details>

**依据 6 · 源码核查**：[client.js:313-318](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/client.js#L313-L318)

两次credentials.set串行非事务，ID已保存不等Secret成功。

```text
                save: function (value) {
                  return api.credentials
                    .set({ ref: REF_APPID, value: value.appid })
                    .then(function () {
                      return api.credentials.set({ ref: REF_SECRET, value: value.secret })
                    })
```

#### 缺口

- 固定宿主消息格式/审批/凭证ABI及当前QQ平台接入/发送要求和实际到账
  **影响：**连接适配不证明当前平台稳定可用，凭证保存不证明机器人启动成功
  **进一步探讨：**核相同宿主API与平台原始版本契约，分别保受权身份、WS READY、任务受理与回复到账证据

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 测试与采用结论如何成立？

**研究主题：**工程质量与复用、采用判断

#### 完整回答

smoke直接导入真实router/acl/session/outbound/approval等，但mock整个DSH/QQ平台；用例核事件字段、空ACL、emoji、session恢复与按钮他人拒绝，也明确把无clicker放行当兼容性成功。它证明该分支是刻意实现，不是安全验收；未涵盖同群其他成员slash审批、最新作者竞态、tiny chunk、重放/恢复ID回退等关键反例。连接/类型注释的“已实锤”是作者核查，不替本轮独立验证或任意新版兼容。

建议观察。完整Agent远程入口价值清楚，关键问题是默认通配、群级ACL和缺身份/命令授权的组合，普通群成员可以影响会话审批；加上回复/恢复未确认，不宜直接作为共享群的高权限控制入口。继续探讨可先严格单人私聊白名单、最小preset与工作区、禁always并保本地审阅，明确重发/未知结果；不是因为普通没冒烟而降级。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/smoke-test.mjs:1-21](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/scripts/smoke-test.mjs#L1-L21)

mock范围。

<details>
<summary>查看原文（21行）</summary>

```text
/**
 * 冒烟测试（无真实平台/dsh 运行时）：mock dsh 服务，验证核心逻辑。
 *
 * 运行：node scripts/smoke-test.mjs
 * 覆盖：router 事件路由 / acl fail-closed（含群/频道白名单与频控）/
 *       util 清洗分段（含 emoji 代理对无损）/ qqapi URL 与 seq /
 *       session-map 生命周期 / outbound 合并与兜底 / approval 按钮回调解析
 */
import assert from 'node:assert'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { routeEvent } from '../platform/router.js'
import { QQApi } from '../platform/qqapi.js'
import { Acl } from '../core/acl.js'
import { SessionMap } from '../core/session-map.js'
import { Outbound } from '../core/outbound.js'
import { ApprovalBridge } from '../core/approval.js'
import { Slash } from '../core/slash.js'
import { chunkText, stripInternalTags, textFromBlocks } from '../lib/util.js'
```

</details>

**依据 2 · 源码核查**：[scripts/smoke-test.mjs:305-328](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/scripts/smoke-test.mjs#L305-L328)

身份/缺clicker用例。

<details>
<summary>查看原文（24行）</summary>

```text
  const outcome2 = await promise2
  ok('超时 → unavailable（fail-closed）', outcome2 === 'unavailable')

  // 非 qq: 会话不拦截
  const promise3 = bridge.handle({ agent: { session: { id: 'web-session-1' } }, toolName: 'bash' }, nextFn)
  ok('非 qq: 会话放行到下游', (await promise3) === 'unavailable') // next() 的结果

  // 🔴3 验收：点击者身份校验——发起者(authorFor='O1')能点，他人点击被忽略
  const promise4 = bridge.handle({ agent: { session: { id: 'qq:user:O1' } }, toolName: 'bash' }, nextFn)
  await new Promise((r) => setTimeout(r, 0))
  const btnId = keyboardSent[keyboardSent.length - 1].actions[0].id
  const hackConsumed = bridge.onInteraction(btnId, 'HACKER_OPENID')
  ok('他人点击被忽略（身份不符，吞掉不打扰）', hackConsumed === true)
  // pending 未被 settle：发起者本人再点才生效
  const ownerConsumed = bridge.onInteraction(btnId, 'O1')
  const outcome4 = await promise4
  ok('发起者点击生效（身份匹配）', ownerConsumed === true && outcome4 === 'allowed-once')
  // 无点击者信息（clicker 空）时向后兼容放行
  const promise5 = bridge.handle({ agent: { session: { id: 'qq:user:O1' } }, toolName: 'bash' }, nextFn)
  await new Promise((r) => setTimeout(r, 0))
  const btnId5 = keyboardSent[keyboardSent.length - 1].actions[0].id
  const noClicker = bridge.onInteraction(btnId5)
  ok('无点击者信息时放行（向后兼容）', noClicker === true && (await promise5) === 'allowed-once')
}
```

</details>

**依据 3 · 源码核查**：[core/slash.js:55-71](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/slash.js#L55-L71)

群级授权限制。

<details>
<summary>查看原文（17行）</summary>

```text
        return { reply: `📋 会话：${info.sessionId}\n创建时间：${created}\n状态：${info.live ? '🟢 活跃' : '⚪ 待唤醒'}` }
      }
      case '/new': {
        // 等待旧 agent 真正 dispose 完成再回复（避免旧 agent 泄漏/并发写文件）
        await this.sessionMap.reset(chat).catch((err) => this.log.error('/new 失败:', err?.message))
        return { reply: '🆕 已开启新会话，上下文已清空（历史记录保留在磁盘）。' }
      }
      case '/approve': {
        if (!this.approvalBridge) return { reply: '审批桥未启用（config.approval=false）' }
        const ok = this.approvalBridge.approveOnce(chat.chatKey)
        return { reply: ok ? '✅ 已允许该操作一次' : '当前没有待审批的操作。' }
      }
      case '/always': {
        if (!this.approvalBridge) return { reply: '审批桥未启用（config.approval=false）' }
        const ok = this.approvalBridge.setAlways(chat)
        return { reply: ok ? '⭐ 已设置始终允许，后续操作不再询问（/revoke 可撤销）' : '当前没有活跃会话可设置。' }
      }
```

</details>

**依据 4 · 源码核查**：[index.js:73-74](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/index.js#L73-L74)

默认通配。

```text
  allowFrom: z.array(z.string()).default(['*']), // 空=全拒（fail-closed）
  groupAllowFrom: z.array(z.string()).default(['*']),
```

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 可从哪些已核机制推导未来方案？

**研究主题：**新假设与验证

#### 完整回答

可推“请求身份绑定的远程任务收据”。参照chatKey共享Agent/最近作者和seq连接状态，将平台eventID、bot身份、chat和author绑定成不可混淆request，去重inbox与turn关联；approval绑定该request的author/有效期/工具摘要且缺身份拒绝，所有slash管理权限同一规则，不给普通群成员never策略。会话映射以独立实例namespace和原子generation更新，outbox保每chunk幂等ID、被动预算/受理回执及unknown，停用能取消发送/退避。

最小反例包含群A发任务B发/approve或/always、channel缺author、快速换作者/早点击、WS重放、resume失败/new竞态、body挂起、超时已送未回以及emoji小chunk。若仍授权错误主体、处理重复业务或未知发送被称完成，就否定可靠控制假设；若收据额外操作/存储成本不减少误批漏回，则否定业务收益。方向未实现，不计已有能力或创新分。

#### 证据与依据

**依据 1 · 源码核查**：[core/approval.js:81-119](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/approval.js#L81-L119)

身份绑定基线。

<details>
<summary>查看原文（39行）</summary>

```text
      this.pending.set(requestId, {
        chat,
        // 发起审批时的最近入站作者（审批点击者身份校验：只有发起者能点）
        initiator: this.sessionMap.authorFor(chat.chatKey) || '',
        resolve: (outcome) => {
          this.pending.delete(requestId)
          timer()
          resolve(outcome)
        },
        settled: false,
      })
    })
  }

  /**
   * 按钮回调入口（index.js 从 router 的 INTERACTION_CREATE 分流）。
   * @param {string} dataId 按钮 id（'qq_apv_<n>:<action>'）
   * @param {string} [clicker] 点击者 openid（INTERACTION_CREATE 事件 user.id）
   * @returns {boolean} 是否本桥消费（是 → 不再进消息管线）
   *
   * ⚠️ 安全：校验点击者身份——按钮 id 只编码 requestId，若不禁身份，
   *    群聊里任何成员都能点 ⭐「始终允许」把群会话 policy 切到 never。
   *    校验规则：有发起者且有点击者时两者必须一致；任一缺失则放行（防误伤）。
   */
  onInteraction(dataId, clicker = '') {
    const m = new RegExp(`^${PREFIX}(\\d+):(${ACTION_ALLOW}|${ACTION_ALWAYS}|${ACTION_REJECT})$`).exec(dataId)
    if (!m) return false
    const [, n, action] = m
    const entry = this.pending.get(`${PREFIX}${n}`)
    if (!entry) return true // 已过期/已处理：吞掉，不打扰用户
    if (entry.settled) return true
    if (entry.initiator && clicker && entry.initiator !== clicker) {
      this.log.warn(`审批点击者身份不符，忽略（initiator=${entry.initiator} clicker=${clicker}）`)
      return true
    }
    entry.settled = true

    if (action === ACTION_ALLOW) {
      entry.resolve('allowed-once')
```

</details>

**依据 2 · 源码核查**：[core/session-map.js:172-216](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/session-map.js#L172-L216)

请求/会话基线。

<details>
<summary>查看原文（45行）</summary>

```text
  async deliverCore(chatKey, chat, text, message) {
    let entry = this.entries.get(chatKey)
    this.setAuthor(chatKey, message?.authorOpenid)

    // 1. live agent 复用（⚠️ ctx.agents.get(id) 返回 agent 本身，不是 handle）
    let agent = entry?.sessionId ? this.ctx.agents.get(entry.sessionId) : undefined

    // 2. 无 live：有持久化记录 → resume；无 → create
    if (!agent) {
      if (entry?.sessionId) {
        try {
          const handle = await this.resume(entry.sessionId)
          agent = handle.agent
          entry = { ...entry, handle }
          // ⚠️ 必须写回映射（create 分支有 set+save，resume 分支曾漏掉）：
          //   不写回则 entry.handle 永远为 null → /new 泄漏旧 agent、
          //   /always /revoke 永远失败、/me 永远显示「待唤醒」
          this.entries.set(chatKey, entry)
          this.save()
        } catch (err) {
          // 持久化损坏/缺失：放弃该记录，落回新建会话（generation+1）
          this.log.error(`恢复会话 ${entry.sessionId} 失败，改为新建:`, err?.message)
          entry = null
        }
      }
      if (!agent) {
        const sessionId = this.newSessionId(chatKey, entry?.generation)
        const handle = await this.create(sessionId, chatKey, chat)
        agent = handle.agent
        entry = { sessionId, generation: entry?.generation ?? 0, chat, handle, createdAt: Date.now() }
        this.entries.set(chatKey, entry)
        this.save()
      }
    }

    // 3. 通知 outbound 本轮的被动回复预算（msg_id 只对本条入站消息有效）
    this.outbound?.beginTurn(agent.session.id, message.replyTo?.messageId)

    // 4. 投递（createUserMessage 签名实锤：无 id 字段，content 是 ContentBlock[]）
    const userMessage = createUserMessage({
      content: [{ type: 'text', text }],
      source: { kind: 'plugin', plugin: 'dsh-im-qq' },
    })
    agent.followup(userMessage)
    return agent
```

</details>

**依据 3 · 源码核查**：[core/outbound.js:115-146](https://github.com/988hj7tczd-oss/dsh-im-qq/blob/d1ae12486264359f9c516bb2cf0ed5e75e811d37/core/outbound.js#L115-L146)

无ack预算基线。

<details>
<summary>查看原文（32行）</summary>

```text
    }
    const cleaned = stripInternalTags(text)
    if (cleaned) b.parts.push(cleaned)
  }

  /** 发送合并缓冲（清 timer）。 */
  async flush(sessionId) {
    const b = this.buffers.get(sessionId)
    if (!b) return
    b.flushTimer?.()
    b.maxTimer?.()
    this.buffers.delete(sessionId)
    this.pendingPassive.delete(sessionId)

    const text = b.parts.join('\n\n').trim()
    if (!text) return

    // 分段：> textChunkLimit 拆多条；串行发送（防乱序 + 降频控）。
    // ⚠️ 全部走被动回复（官方：主动消息每月限 4 条/人/群，超限发送失败）——
    //    被动回复限 replyPassiveLimit 次/消息，预算内绝不落主动
    const chunks = chunkText(text, this.cfg.textChunkLimit)
    for (let index = 0; index < chunks.length; index += 1) {
      const chunk = chunks[index]
      const passive = b.passive.msgId && b.passive.used < this.cfg.replyPassiveLimit
      if (passive) b.passive.used += 1
      try {
        await this.send(b.chat, [{ type: 'text', text: chunk }], {
          passive,
          msgId: b.passive.msgId || undefined,
        })
      } catch (err) {
        this.log.error('出站发送失败:', err?.message)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
