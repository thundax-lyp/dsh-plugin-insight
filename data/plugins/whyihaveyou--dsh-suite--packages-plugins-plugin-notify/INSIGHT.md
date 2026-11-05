# Plugin Notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 145](https://img.shields.io/static/v1?label=npm+30d&message=145&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-notify) [![最新发布 2026-08-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-notify)
<!-- END META -->

> **功能**：把 DSH 回合结束、异常和待审批事件推送至六类 webhook 或 macOS 本机通知

> **亮点**：[Q01](#research-q01) 把持久会话事件映射到六类远程通知，补离屏获知入口；DND与摘要便利实际接线，但turn完成不能当目标验收。

> **主要限制**：[Q03](#research-q03) POST不检查HTTP/业务响应，没有送达账本；custom元数据不随隐私文本开关关闭，摘要截断也非脱敏。核心值守与隐私承诺尚不足。

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
  - [Q01 · 通知谁、什么时机，与本机弹窗相比多什么？](#detail-section-11)
  - [Q02 · 时长、免打扰与监听如何实现？](#detail-section-12)
  - [Q03 · 发起POST是否等于IM收到，哪些数据会离开？](#detail-section-13)
  - [Q04 · 采用条件、成本与退路是什么？](#detail-section-14)
  - [Q05 · 什么可证伪改进值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：离开DSH屏幕的用户获知回合结束/异常和审批待处理，见 [Q01](#research-q01)。

守候DSH事件或本机弹窗；作者所列其他通知插件能力未独立比较，远程机器人协议是既有接口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 回合/异常/审批提示 | 离屏获知 | 非目标完成或远程批准 |
| 六类webhook | IM接入 | HTTP/业务拒绝未检查，非送达保证 |
| 本机弹窗 | macOS提醒 | 其他平台无效、失败吞掉 |
| DND/内容开关 | 降噪 | 本地时间丢弃不补发，custom元数据另有边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
|---|---|---|
| DSH sessions与构建dist | 事件入口 | 发布制品未核验 |
| 机器人URL/网络 | 远程发送 | 服务权限/配额与真实接收未知 |
| macOS osascript/通知许可 | 本机可选 | 非mac自动跳过 |
| 首条用户/assistant文本 | 标题/摘要 | 截断不脱敏 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
|---|---|---|
| 准备 | 专用去敏测试群与授权URL | 不用正式敏感会话 |
| 配置 | 通道、事件、DND和本机开关 | 空events不等于关闭 |
| 验收 | 三类事件与429/业务拒绝/custom字段检查 | POST尝试不算收到 |
| 失败 | 查渠道和DSH日志 | 超时结果未知，人工判断补发 |
| 退出 | 清URL/停插件并轮换凭据 | 已发消息不自动撤回 |

**效果与成本**

#### 成本

| 阶段 | 资源现金 | 人工与未知 |
|---|---|---|
| 首次 | 构建/机器人/网络 | URL和去敏配置，费用工时未知 |
| 持续 | POST配额与日志 | 噪音、秘密轮换、渠道维护 |
| 失败 | 可能丢通知或未知接收 | 人工对账/补发，不自动恢复 |
| 退出 | 既发摘要留在渠道 | 清配置与消息管理另行操作 |

#### 效果

| 效果 | 支持 | 未知 |
|---|---|---|
| 离屏提醒 | 事件映射与POST入口 | IM实际接收率和及时性 |
| 任务状态 | turn/end原因 | 目标整体完成及正确性 |
| 降噪 | DND直接丢弃 | 对漏审批/告警的影响 |
| 隐私 | 文本截断/部分开关 | custom元数据和敏感片段暴露 |

> **思考**：[Q03](#research-q03) POST不检查HTTP/业务响应，没有送达账本；custom元数据不随隐私文本开关关闭，摘要截断也非脱敏。核心值守与隐私承诺尚不足。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把持久会话事件映射到六类远程通知，补离屏获知入口；DND与摘要便利实际接线，但turn完成不能当目标验收。

小型事件插件保留宿主循环非阻塞是明确取舍，代价是没有接收确认/补偿账本。模块Map生命周期、URL失败日志和custom隐私开关范围值得修补，不把外部HTTP接受等同用户获知。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) POST不检查HTTP/业务响应，没有送达账本；custom元数据不随隐私文本开关关闭，摘要截断也非脱敏。核心值守与隐私承诺尚不足。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议观察；有授权才用去敏测试群逐类验收，不能作为唯一审批/故障告警。漏告警、任务语义误导或外发敏感片段就清URL并回DSH日志；当前includeSession:false不是custom全字段隐私保证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持事件至POST/本机尝试，不能证明真实投递；作者明确IM未闭环，本轮仅源码。

- 已检查：作者 README、包清单、源码路径 packages/plugins/plugin-notify/src/index.ts、packages/plugins/plugin-notify/package.json、packages/plugins/plugin-notify/README.md 及固定范围 inventory；组件：packages/plugins/plugin-notify。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整src事件、发送与摘要/DND/mac路径定向核查，包与作者验证说明已读；未审外部机器人服务和DSH事件重放策略。
- 下一步：未构建或运行目标代码，未请求webhook、触发弹窗或发送任何消息。作者无key派发与编译声明不作本次运行证据。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.2.0（[固定提交 3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证的最少数据与分层投递契约，明确回合语义、业务拒绝/未知与字段开关；用429/200拒绝/超时已收/重放验证。

未构建或运行目标代码，未请求webhook、触发弹窗或发送任何消息。作者无key派发与编译声明不作本次运行证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 120 | — | — | 1108 |
| .ts | source | 1 | 298 | 248 | 22 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/whyihaveyou/dsh-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查远程通知价值、回合语义、送达和隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 通知谁、什么时机，与本机弹窗相比多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

离开DSH屏幕仍需知道回合结束/异常或审批待处理的用户，可把摘要发到六类webhook并可选macOS本机弹窗。相对作者列的本机通知与守着终端，增量是将session/event映射到飞书、企微、钉钉、Slack、Discord或custom消息格式。completed只是turn/end原因，不证明目标整体完成或结果正确；其他终止原因统一error，正常人为中断也可能发错误类。审批仅告知工具名/原因，没有远程批准或处理交互，不能当审批通道。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:22-46](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L22-L46)

插件注入sessions与通道配置。

<details>
<summary>查看原文（25行）</summary>

```text
export const name = 'plugin-notify'

// Dependency on the session service: `session/event` only exists once a
// SessionStore is composed, and this plugin consumes the durable firehose.
export const inject = ['sessions']

export interface Config {
  webhooks?: {
    feishu?: string
    wecom?: string
    dingtalk?: string
    slack?: string
    discord?: string
    custom?: string
  }
  events?: string[]
  local?: boolean
  timeoutMs?: number
  /** Do-not-disturb window (HH:MM, empty = off). During the window the
   *  event is still observed/logged but no notification is emitted. */
  dnd?: { start?: string; end?: string }
  /** Include the 会话 line in the notification text. */
  includeSession?: boolean
  /** Include the 耗时 line in the notification text. */
  includeDuration?: boolean
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:112-146](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L112-L146)

turn结束映射与approval仅通知。

<details>
<summary>查看原文（35行）</summary>

```text
      const reason = event.data.reason
      const kind: NotifyKind = reason.kind === 'completed' ? 'task_done' : 'error'
      if (!events.has(kind)) return
      const started = turnStarts.get(String(session.id))
      turnStarts.delete(String(session.id))
      dispatch({
        kind,
        title: sessionTitle(session),
        sessionId: String(session.id),
        summary: summarizeTurn(session, event.data.turn),
        reason: reasonLabel(reason),
        durationMs: started === undefined ? undefined : Date.now() - started,
      })
      return
    }

    if (event.type === 'approval/asked') {
      if (!events.has('approval_requested')) return
      const data = event.data
      dispatch({
        kind: 'approval_requested',
        title: sessionTitle(session),
        sessionId: String(session.id),
        summary: `等待审批：工具 ${data.toolName}${data.reason ? `（${data.reason}）` : ''}`,
      })
    }
  })
}

function normalizeEvents(configured: string[] | undefined): NotifyKind[] {
  if (!configured || configured.length === 0) return [...DEFAULT_EVENTS]
  const known: NotifyKind[] = ['task_done', 'error', 'approval_requested']
  return known.filter(kind => configured.includes(kind))
}

```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:181-197](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L181-L197)

六通道格式。

<details>
<summary>查看原文（17行）</summary>

```text
  if (webhooks.discord) post(webhooks.discord, { content: text })
  if (webhooks.custom) {
    post(webhooks.custom, {
      text,
      kind: n.kind,
      title: n.title,
      sessionId: n.sessionId,
      durationMs: n.durationMs,
      time: new Date().toISOString(),
    })
  }

  if (local) notifyLocal(n.kind === 'task_done' ? '✅ 任务完成' : n.kind === 'error' ? '⚠️ 运行出错' : '⏸️ 等待审批', text)
}

function renderText(n: Notification, includeSession: boolean, includeDuration: boolean): string {
  const kindLabel = n.kind === 'task_done' ? '任务完成' : n.kind === 'error' ? '运行出错' : '等待审批'
```

</details>

#### 缺口

- 本轮未构建或运行通知、未用真实webhook/系统弹窗。
  **影响**：机制证据不能证明送达、隐私设置生效或节时。
  **进一步探讨**：授权后只用去敏测试群执行状态/拒绝/隐私反例。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 时长、免打扰与监听如何实现？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

turn/start在模块级Map以sessionId记当前Date.now，turn/end仅当kind在配置events时删除并计算耗时，不是模型计费或执行时长；进程中途加载缺开始则不含时长。事件注册依赖Cordis ctx.on管理，Map未随插件卸载/会话结束统一清空，过滤掉结束事件或没对应结束会留条目；多个实例共享Map存在干扰可能，未运行验证。DND按Host本地时钟与跨午夜区间判断，非法或相同起止视为不启用；期间只console记录，直接丢弃，不排队补发。events空数组回到默认三类而非全关，停通知应local:false且清webhooks或卸载。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:73-141](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L73-L141)

模块Map与turn开始/条件删除。

<details>
<summary>查看原文（69行）</summary>

```text

/** Per-session last `turn/start` epoch ms, for turn-duration reporting. */
const turnStarts = new Map<string, number>()

interface Notification {
  kind: NotifyKind
  title: string
  sessionId: string
  summary?: string
  reason?: string
  durationMs?: number
}

export function apply(ctx: Context, config: Config = {}) {
  const cfg = config ?? {}
  const events = new Set<NotifyKind>(normalizeEvents(cfg.events))
  const local = cfg.local ?? true
  const timeoutMs = cfg.timeoutMs ?? 5000
  const webhooks = cfg.webhooks ?? {}
  const dnd = cfg.dnd
  const includeSession = cfg.includeSession ?? true
  const includeDuration = cfg.includeDuration ?? true

  /** DND gate: event is logged (recorded) but no notification is emitted. */
  const dispatch = (n: Notification): void => {
    if (inDnd(dnd)) {
      console.log(`[plugin-notify] ${n.kind} · ${n.title} · 会话 ${n.sessionId} · 免打扰时段（${dnd?.start}-${dnd?.end}），事件照记不通知`)
      return
    }
    send(n, webhooks, timeoutMs, local, includeSession, includeDuration)
  }

  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    if (event.type === 'turn/start') {
      turnStarts.set(String(session.id), Date.now())
      return
    }

    if (event.type === 'turn/end') {
      const reason = event.data.reason
      const kind: NotifyKind = reason.kind === 'completed' ? 'task_done' : 'error'
      if (!events.has(kind)) return
      const started = turnStarts.get(String(session.id))
      turnStarts.delete(String(session.id))
      dispatch({
        kind,
        title: sessionTitle(session),
        sessionId: String(session.id),
        summary: summarizeTurn(session, event.data.turn),
        reason: reasonLabel(reason),
        durationMs: started === undefined ? undefined : Date.now() - started,
      })
      return
    }

    if (event.type === 'approval/asked') {
      if (!events.has('approval_requested')) return
      const data = event.data
      dispatch({
        kind: 'approval_requested',
        title: sessionTitle(session),
        sessionId: String(session.id),
        summary: `等待审批：工具 ${data.toolName}${data.reason ? `（${data.reason}）` : ''}`,
      })
    }
  })
}

function normalizeEvents(configured: string[] | undefined): NotifyKind[] {
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:141-145](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L141-L145)

空events归默认。

```text
function normalizeEvents(configured: string[] | undefined): NotifyKind[] {
  if (!configured || configured.length === 0) return [...DEFAULT_EVENTS]
  const known: NotifyKind[] = ['task_done', 'error', 'approval_requested']
  return known.filter(kind => configured.includes(kind))
}
```

**依据 3 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:99-110](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L99-L110)

DND直接return。

<details>
<summary>查看原文（12行）</summary>

```text
      console.log(`[plugin-notify] ${n.kind} · ${n.title} · 会话 ${n.sessionId} · 免打扰时段（${dnd?.start}-${dnd?.end}），事件照记不通知`)
      return
    }
    send(n, webhooks, timeoutMs, local, includeSession, includeDuration)
  }

  ctx.on('session/event', (session: Session, event: SessionEvent) => {
    if (event.type === 'turn/start') {
      turnStarts.set(String(session.id), Date.now())
      return
    }

```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:217-224](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L217-L224)

本地时间与非法/相等边界。

```text
/** In the do-not-disturb window? Cross-midnight ranges (23:00-08:00) are
 *  supported; equal start/end or malformed values mean "never". */
function inDnd(dnd: { start?: string; end?: string } | undefined, now = new Date()): boolean {
  const s = parseHM(dnd?.start)
  const e = parseHM(dnd?.end)
  if (s === null || e === null || s === e) return false
  const cur = now.getHours() * 60 + now.getMinutes()
  return s < e ? cur >= s && cur < e : cur >= s || cur < e
```

#### 缺口

- 本轮未构建或运行通知、未用真实webhook/系统弹窗。
  **影响**：机制证据不能证明送达、隐私设置生效或节时。
  **进一步探讨**：授权后只用去敏测试群执行状态/拒绝/隐私反例。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发起POST是否等于IM收到，哪些数据会离开？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

send为每次通知建立timeout signal并向配置URL并发fire-and-forget POST，只catch网络异常；没有检查response.ok或飞书等业务错误码，HTTP401/429/500与HTTP200业务拒绝均可静默不告警。没有持久outbox、receipt、重试或去重，设计选择不阻塞循环换取可能丢失，不能用于必须送达的值守/审批升级。标题是首条用户消息前60字符，摘要取最后assistant文本前120字符和工具次数；截断不是脱敏，审批原因也可能敏感。includeSession/includeDuration只控制renderText，custom JSON仍无条件包含sessionId/durationMs/title/time。失败日志拼URL前64字符，可能泄露webhook token片段；mac本地通知也在锁屏可见，是否显示取系统策略。非mac无本地弹窗，osascript error吞掉，未提供可见失败。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:165-179](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L165-L179)

POST只catch，不检查status/body，日志URL前缀。

<details>
<summary>查看原文（15行）</summary>

```text
    // Emission is an irreversible side effect: fire-and-forget, never retry,
    // never block the agent loop (design principle 9 — compensate, don't block).
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    }).catch(error => {
      console.warn(`[plugin-notify] webhook POST failed (${url.slice(0, 64)}…): ${String(error)}`)
    })
  }

  if (webhooks.feishu) post(webhooks.feishu, { msg_type: 'text', content: { text } })
  if (webhooks.wecom) post(webhooks.wecom, { msgtype: 'text', text: { content: text } })
  if (webhooks.dingtalk) post(webhooks.dingtalk, { msgtype: 'text', text: { content: text } })
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:187-197](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L187-L197)

custom元数据未受文本开关约束。

<details>
<summary>查看原文（11行）</summary>

```text
      sessionId: n.sessionId,
      durationMs: n.durationMs,
      time: new Date().toISOString(),
    })
  }

  if (local) notifyLocal(n.kind === 'task_done' ? '✅ 任务完成' : n.kind === 'error' ? '⚠️ 运行出错' : '⏸️ 等待审批', text)
}

function renderText(n: Notification, includeSession: boolean, includeDuration: boolean): string {
  const kindLabel = n.kind === 'task_done' ? '任务完成' : n.kind === 'error' ? '运行出错' : '等待审批'
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:259-287](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L259-L287)

首条用户标题与assistant截断。

<details>
<summary>查看原文（29行）</summary>

```text
/** A short human title for a session: the first user message, else the id. */
function sessionTitle(session: Session): string {
  for (const event of session.events) {
    if (event.type === 'user/message') {
      const text = textOf(event.data.content).replace(/\s+/g, ' ').trim()
      if (text) return text.length > 60 ? `${text.slice(0, 60)}…` : text
    }
  }
  return String(session.id)
}

/** One-line summary of a finished turn: last assistant text + tool-call count. */
function summarizeTurn(session: Session, turn: number): string {
  let toolCalls = 0
  let lastText = ''
  for (const event of session.events) {
    if (event.type === 'tool/call' && event.data.turn === turn) toolCalls += 1
    if (event.type === 'assistant/message' && event.data.turn === turn) {
      const text = textOf(event.data.message.content)
      if (text) lastText = text
    }
  }
  const parts: string[] = []
  if (lastText) {
    const trimmed = lastText.replace(/\s+/g, ' ').trim()
    parts.push(trimmed.length > 120 ? `${trimmed.slice(0, 120)}…` : trimmed)
  }
  if (toolCalls > 0) parts.push(`调用了 ${toolCalls} 次工具`)
  return parts.join('；') || '（无文本输出）'
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:290-298](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L290-L298)

mac限定与失败吞掉。

```text
/** Best-effort macOS notification; a no-op elsewhere. */
function notifyLocal(title: string, text: string): void {
  if (process.platform !== 'darwin') return
  const esc = (s: string) => s.replace(/\\/g, '\\\\').replace(/"/g, '\\"')
  const script = `display notification "${esc(text)}" with title "${esc(title)}"`
  spawn('osascript', ['-e', script], { stdio: 'ignore' })
    .on('error', () => {})
    .unref()
}
```

#### 缺口

- 本轮未构建或运行通知、未用真实webhook/系统弹窗。
  **影响**：机制证据不能证明送达、隐私设置生效或节时。
  **进一步探讨**：授权后只用去敏测试群执行状态/拒绝/隐私反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用条件、成本与退路是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需兼容sessions事件的DSH、Schemastery运行依赖和已构建dist入口；当前checkout只有src，包声明发布dist不证明制品存在或匹配。远程需用户配置机器人URL、出网和各渠道权限/频率规则，本轮未查外部服务条款或价格，不作现时推荐；本机需macOS osascript及通知许可。首次成本是URL配置/测试群与脱敏审阅，持续是摘要外发、事件噪音/配额与凭据轮换，失败需人工对账消息是否送达；现金和节时未知。作者README明确真实IM未闭环，只称本地编译/配置和无key派发路径，不升级为当前投递成功。建议观察：若获准实验先去敏专用群，分别completed/中断/审批与DND、HTTP拒绝/custom开关验收；漏告警或含敏感片段就撤webhook并回DSH事件日志。本轮未发送消息，退出清配置/轮换URL，既发消息不自动撤回。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-notify/package.json:1-37](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/package.json#L1-L37)

dist入口与依赖声明。

<details>
<summary>查看原文（37行）</summary>

```text
{
  "name": "@dsh-suite/plugin-notify",
  "version": "0.2.0",
  "description": "DSH plugin: send IM webhook + local notifications when a turn completes, errors, or requests approval (Feishu/WeCom/DingTalk/Slack/Discord/custom).",
  "license": "MIT",
  "type": "module",
  "main": "./dist/index.js",
  "exports": {
    ".": "./dist/index.js"
  },
  "files": [
    "dist",
    "cordis.patch.yml"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "scripts": {
    "build": "tsc -p tsconfig.json",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-session": "^0.1.0-rc.6",
    "@types/node": "^22.10.0",
    "typescript": "^5.6.0"
  }
}
```

</details>

**依据 2 · 作者声明**：[packages/plugins/plugin-notify/README.md:94-104](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/README.md#L94-L104)

作者真实IM阻塞声明。

<details>
<summary>查看原文（11行）</summary>

```text
- ✅ 纯 ESM 编译（`pnpm build`）
- ✅ `dsh.bundle` + `cordis.patch.yml` 装载进真实 DSH profile（`--dump-config` 含本行）
- ✅ `turn/end` → 通知派发路径（缺省无 key 场景，`turn/end(reason=error)` 已触发）
- ⚠️ 真实 IM 投递（需真实 webhook URL 与外部网络）——未闭环，见下

Blocked / not closed: 本环境无真实 webhook 地址，远程投递只验证到「POST 已发起、失败仅
`console.warn`」，未验证到对方 IM 收到消息。

## 设计准则 / Design principles

遵守 `dsh-plugin-design-principles.md`：`inject` 声明依赖（#3）、`ctx.on` 注册即 effect（#1）、
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:49-69](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L49-L69)

可配置项与默认。

<details>
<summary>查看原文（21行）</summary>

```text
export const Config = Schema.object({
  webhooks: Schema.object({
    feishu: Schema.string().description('飞书自定义机器人 webhook URL（…/bot/v2/hook/…）'),
    wecom: Schema.string().description('企业微信群机器人 webhook URL（…/cgi-bin/webhook/send?key=…）'),
    dingtalk: Schema.string().description('钉钉群机器人 webhook URL（…/robot/send?access_token=…）'),
    slack: Schema.string().description('Slack Incoming Webhook URL'),
    discord: Schema.string().description('Discord Webhook URL'),
    custom: Schema.string().description('自定义通用 webhook URL（POST JSON，含 text + 元数据）'),
  }).description('各 IM 通道的 webhook 地址，留空即不发送'),
  events: Schema.array(Schema.string())
    .description('触发通知的事件：task_done（回合完成）/ error（出错） / approval_requested（待审批）'),
  local: Schema.boolean().default(true).description('是否同时发本机系统通知（macOS osascript）'),
  timeoutMs: Schema.number().default(5000).description('单次 webhook 请求超时（毫秒）'),
  dnd: Schema.object({
    start: Schema.string().default('').description('免打扰开始（HH:MM，留空关闭）'),
    end: Schema.string().default('').description('免打扰结束（HH:MM，跨天也支持，如 23:00-08:00）'),
  }).description('免打扰时段：期间不弹本机通知也不发 webhook，事件照常记录'),
  includeSession: Schema.boolean().default(true).description('通知内容是否带「会话」行'),
  includeDuration: Schema.boolean().default(true).description('通知内容是否带「耗时」行'),
})

```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:165-197](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L165-L197)

发送副作用与无撤回。

<details>
<summary>查看原文（33行）</summary>

```text
    // Emission is an irreversible side effect: fire-and-forget, never retry,
    // never block the agent loop (design principle 9 — compensate, don't block).
    fetch(url, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    }).catch(error => {
      console.warn(`[plugin-notify] webhook POST failed (${url.slice(0, 64)}…): ${String(error)}`)
    })
  }

  if (webhooks.feishu) post(webhooks.feishu, { msg_type: 'text', content: { text } })
  if (webhooks.wecom) post(webhooks.wecom, { msgtype: 'text', text: { content: text } })
  if (webhooks.dingtalk) post(webhooks.dingtalk, { msgtype: 'text', text: { content: text } })
  if (webhooks.slack) post(webhooks.slack, { text })
  if (webhooks.discord) post(webhooks.discord, { content: text })
  if (webhooks.custom) {
    post(webhooks.custom, {
      text,
      kind: n.kind,
      title: n.title,
      sessionId: n.sessionId,
      durationMs: n.durationMs,
      time: new Date().toISOString(),
    })
  }

  if (local) notifyLocal(n.kind === 'task_done' ? '✅ 任务完成' : n.kind === 'error' ? '⚠️ 运行出错' : '⏸️ 等待审批', text)
}

function renderText(n: Notification, includeSession: boolean, includeDuration: boolean): string {
  const kindLabel = n.kind === 'task_done' ? '任务完成' : n.kind === 'error' ? '运行出错' : '等待审批'
```

</details>

#### 缺口

- 本轮未构建或运行通知、未用真实webhook/系统弹窗。
  **影响**：机制证据不能证明送达、隐私设置生效或节时。
  **进一步探讨**：授权后只用去敏测试群执行状态/拒绝/隐私反例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么可证伪改进值得验证？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q01/Q03推导未验证的最小通知契约：消息显式写“回合结束”与终止原因，默认仅发不含标题/摘要的最少状态，所有custom字段也服从隐私开关；日志URL只保留通道名和请求ID。outbox区分发送尝试、HTTP接受、渠道业务接受和最终未知，必要时人工补发并保留幂等键，不把timeout当未送。以200业务拒绝、429、网络超时已接收、同一事件重放、custom关session与含敏感prompt为反例；成功需拒绝可见、无错误完成语义、无关掉字段外发，未知不自动重复。若仍静默吞拒绝或重复告警，推翻可靠性假设。增加持久状态与渠道解析维护，不等于当前实现或收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:112-118](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L112-L118)

回合completed映射任务文案。

```text
      const reason = event.data.reason
      const kind: NotifyKind = reason.kind === 'completed' ? 'task_done' : 'error'
      if (!events.has(kind)) return
      const started = turnStarts.get(String(session.id))
      turnStarts.delete(String(session.id))
      dispatch({
        kind,
```

**依据 2 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:169-179](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L169-L179)

无响应判定。

<details>
<summary>查看原文（11行）</summary>

```text
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      signal,
    }).catch(error => {
      console.warn(`[plugin-notify] webhook POST failed (${url.slice(0, 64)}…): ${String(error)}`)
    })
  }

  if (webhooks.feishu) post(webhooks.feishu, { msg_type: 'text', content: { text } })
  if (webhooks.wecom) post(webhooks.wecom, { msgtype: 'text', text: { content: text } })
  if (webhooks.dingtalk) post(webhooks.dingtalk, { msgtype: 'text', text: { content: text } })
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-notify/src/index.ts:187-197](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-notify/src/index.ts#L187-L197)

custom隐私反例。

<details>
<summary>查看原文（11行）</summary>

```text
      sessionId: n.sessionId,
      durationMs: n.durationMs,
      time: new Date().toISOString(),
    })
  }

  if (local) notifyLocal(n.kind === 'task_done' ? '✅ 任务完成' : n.kind === 'error' ? '⚠️ 运行出错' : '⏸️ 等待审批', text)
}

function renderText(n: Notification, includeSession: boolean, includeDuration: boolean): string {
  const kindLabel = n.kind === 'task_done' ? '任务完成' : n.kind === 'error' ? '运行出错' : '等待审批'
```

</details>

#### 缺口

- 本轮未构建或运行通知、未用真实webhook/系统弹窗。
  **影响**：机制证据不能证明送达、隐私设置生效或节时。
  **进一步探讨**：授权后只用去敏测试群执行状态/拒绝/隐私反例。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
