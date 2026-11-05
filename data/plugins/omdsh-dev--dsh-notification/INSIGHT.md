# dsh-notification

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[675aab9](https://github.com/omdsh-dev/dsh-notification/tree/675aab9b43d5011738feb6185281596c0365ccba)

<!-- BEGIN META -->
[![GitHub ★ 91](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=91&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-notification) [![npm 30d 2,912](https://img.shields.io/static/v1?label=npm+30d&message=2%2C912&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notification) [![最新发布 2026-09-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-notification)
<!-- END META -->

> **功能**：从DSH完成摘要和待交互状态发送可配置浏览器系统通知。

> **亮点**：[Q01](#research-q01) 把实时完成边沿变成本地提醒。

> **主要限制**：[Q02](#research-q02) 断线历史不补发，失败已消费观察值，多标签未协调。

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
  - [Q01 · 完成消息怎样触发系统通知？](#detail-section-11)
  - [Q02 · 断线与失败后会补发吗？](#detail-section-12)
  - [Q03 · 怎样判断轻提醒足够而无需待办系统？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：切换浏览器标签仍需知道任务何时结束的用户。

一直查看会话或轮询原生列表。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 完成摘要 | 折叠最后turn正文与工具 | 有界正文 |
| 完成提醒 | 结果开关及关键词过滤 | 重连不追历史 |
| 等待提醒 | 审批/问题状态提示 | 旧等待seed不补发 |
| 系统提示 | 权限后创建并聚焦窗口 | 无跨标签claim与失败队列 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容Host投影及浏览器客户端 | 必需 | 接收会话列表 | 断线不补历史 |
| Notification权限 | 系统提醒必需 | 创建toast | 拒绝记录失败无重试 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 单标签申请权限与过滤规则 | 先发测试通知 |
| 等待 | 切后台触发完成/审批 | 核对可见提示 |
| 重连 | 回原列表找漏项 | 既有边沿不补发 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 核对浏览器权限和正文隐私 | 无第三方服务 |
| 持续 | 注意力成本未知 | 调整开关和规则 | 浏览器要在线 |
| 失败 | 查漏时间未知 | 查原生会话列表 | 创建失败不自动重发 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提醒机制 | 源码将新turn映射到系统API | OS可见和实际遗漏率 |
| 正文 | 有界摘要与规则筛选 | 隐私片段是否合适 |

> **思考**：[Q02](#research-q02) 断线历史不补发，失败已消费观察值，多标签未协调。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把实时完成边沿变成本地提醒。

[Q02](#research-q02) baseline优先避免历史刷屏，以遗漏为代价。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 断线历史不补发，失败已消费观察值，多标签未协调。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单标签实时任务先验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态确认投影到通知主链，未测试OS。

- 已检查：作者 README、包清单、源码路径 src/projection.ts、src/client/index.ts、src/client/notifier.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定projection、runner和Notification构造，未运行。
- 下一步：前后台、拒绝权限、断线、休眠和双标签。

**分析版本**

- **仓库**：[omdsh-dev/dsh-notification](https://github.com/omdsh-dev/dsh-notification)
- **版本号**：0.1.4（[固定提交 675aab9](https://github.com/omdsh-dev/dsh-notification/tree/675aab9b43d5011738feb6185281596c0365ccba)）
- **版本日期**：2026-09-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 比较回看频率及可接受遗漏。

前后台、拒绝权限、断线、休眠和双标签。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 196 | — | — | 2077 |
| .mjs | source | 1 | 91 | 73 | 10 | — |
| .js | source | 3 | 16568 | 16201 | 593 | — |
| .ts | source | 15 | 1437 | 1041 | 311 | — |
| .tsx | source | 1 | 355 | 306 | 27 | — |
| .ts | test | 8 | 628 | 512 | 41 | — |
| .tsx | test | 1 | 159 | 136 | 8 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-notification/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-notification/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-notification/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：轻量本地通知能否让用户及时看到会话完成与等待？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 完成消息怎样触发系统通知？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

Host projection 在 turn/start 建临时状态，累加助手文本与不重复工具名，turn/end 才生成最后完成回合的摘要，正文按maxChars截断。浏览器订阅session列表，projection.turn比本标签记忆值前进时作新完成事件，再用结果开关、关键词和前台可见性过滤，调用原生Notification。点击只执行 window.focus，并没有按sessionId导航，所以“提醒结束”和“回到对应任务”是不同能力。相对盯着网页等，它提供本地提醒；内容是有界正文，通知中心可能显示隐私片段，需用户设定。

#### 证据与依据

**依据 1 · 源码核查**：[src/projection.ts:45-81](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/projection.ts#L45-L81)

完成摘要形成。

<details>
<summary>查看原文（37行）</summary>

```text
export function applyProjectionEvent(
  state: NotificationProjectionState,
  event: SessionEvent,
  maxChars: number,
): NotificationProjectionState {
  switch (event.type) {
    case 'turn/start':
      return { ...state, openTurn: { turn: event.data.turn, text: '', tools: [] } }
    case 'assistant/message': {
      const open = state.openTurn
      if (open === null || open.turn !== event.data.turn) return state
      let text = open.text
      for (const block of event.data.message.content) {
        if (block.type === 'text') text += block.text
      }
      if (text.length > maxChars) text = boundText(text, maxChars)
      if (text === open.text) return state
      return { ...state, openTurn: { ...open, text } }
    }
    case 'tool/call': {
      const open = state.openTurn
      if (open === null || open.turn !== event.data.turn) return state
      if (open.tools.includes(event.data.name)) return state
      return { ...state, openTurn: { ...open, tools: [...open.tools, event.data.name] } }
    }
    case 'turn/end': {
      const open = state.openTurn
      if (open === null || open.turn !== event.data.turn) return state
      return {
        openTurn: null,
        last: {
          turn: event.data.turn,
          reason: event.data.reason.kind,
          body: open.text.trim(),
          tools: open.tools,
        },
      }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:124-162](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L124-L162)

新回合检测与通知。

<details>
<summary>查看原文（39行）</summary>

```text
  // Completion runner: the host projection's turn is monotonic per session,
  // so an advance past the last-observed turn IS a freshly completed turn with
  // its own correct body — no race with the session-status frame. The first
  // observation seeds the baseline (history is never re-notified), and a
  // reconnect re-seeds so a completion that happened while disconnected
  // never fires.
  ctx.effect(() => {
    const observedTurn = new Map<string, number>()
    const reseed = (): void => { observedTurn.clear() }
    const stopReset = ctx.on('connection/reset', reseed)
    const off = sessions.list.subscribe(() => {
      const state = sessions.list.getSnapshot()
      const current = settings.getSnapshot()
      for (const id of state.ids) {
        const summary = state.byId[id]
        if (summary === undefined) continue
        const projection = summary.projectionValues?.notification
        const { nextTurn, fresh } = projectionAdvance(observedTurn.get(id), projection)
        observedTurn.set(id, nextTurn)
        if (!fresh) continue
        const plan = notificationFor(summary.id, summary.origin, summary.title, projection, current)
        if (plan === null) {
          console.info(`[dsh-notification] turn ${nextTurn} ${id} suppressed by settings/rules`)
          continue
        }
        const permission = notificationsApi()?.permission ?? 'denied'
        const showIt = shouldShow(permission, current.backgroundOnly, document.hidden, id, state.current)
        console.info(
          `[dsh-notification] turn ${nextTurn} ${id}: reason=${plan.reason} show=${showIt}`
          + ` (permission=${permission} backgroundOnly=${current.backgroundOnly}`
          + ` hidden=${document.hidden} current=${String(state.current)})`,
        )
        if (showIt) {
          show(
            t(titleKey(plan.reason)),
            bodyText(plan.body, t('notify.emptyBody')),
            plan.tag,
            current.requireInteraction,
          )
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:104-114](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L104-L114)

点击与失败日志。

<details>
<summary>查看原文（11行）</summary>

```text
  const show = (title: string, body: string, tag: string, requireInteraction: boolean): NotificationCreationResult => {
    const result = createBrowserNotification(notificationsApi(), title, { body, tag, requireInteraction })
    if (!result.ok) {
      console.error(`[dsh-notification] notification creation failed: ${result.message}`)
      return result
    }
    result.notification.onclick = () => { window.focus() }
    result.notification.onerror = () => {
      console.error('[dsh-notification] the browser reported a notification delivery error')
    }
    return result
```

</details>

**依据 4 · 源码核查**：[src/client/notifier.ts:39-59](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/notifier.ts#L39-L59)

权限、前台和每turn标签。

<details>
<summary>查看原文（21行）</summary>

```text
export function shouldShow(
  permission: NotificationPermission,
  backgroundOnly: boolean,
  documentHidden: boolean,
  completedSessionId?: string,
  currentSessionId?: string,
): boolean {
  if (permission !== 'granted') return false
  if (backgroundOnly && !documentHidden && completedSessionId === currentSessionId) return false
  return true
}

/**
 * The grouping tag: one notification slot per session per turn. Turn-scoped
 * (not session-scoped): the browser replaces same-tag notifications, and a
 * stale same-tag entry lingering in the Windows notification center silently
 * swallows every later notification with that tag — a per-turn tag guarantees
 * each completed turn's toast always shows.
 */
export function notificationTag(sessionId: string, turn: number): string {
  return `dsh-notification-${sessionId}-${turn}`
```

</details>

#### 缺口

- 真实OS通知未测试
  **影响**：无法保证toast可见或用户找到对应会话
  **进一步探讨**：同时运行两会话，点击后核对窗口与任务定位

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 断线与失败后会补发吗？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

首次观察只建立baseline，connection/reset会清除观察值，因此断线中发生的完成不会在重连后追补；pending runner也启动/重连先seed既有等待。这个取舍避免历史刷屏，但不能当可靠待办收件箱。observedTurn在permission和创建之前更新，权限拒绝或new Notification抛错会记录日志而不会回退观察值；没有看到失败重试队列。每turn tag帮助浏览器替换重复通知，但观察Map属于单标签，没有Host claim跨标签协调。浏览器休眠、多个标签或OS免打扰下的真实表现都需核验。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:124-170](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L124-L170)

baseline、先更新再创建。

<details>
<summary>查看原文（47行）</summary>

```text
  // Completion runner: the host projection's turn is monotonic per session,
  // so an advance past the last-observed turn IS a freshly completed turn with
  // its own correct body — no race with the session-status frame. The first
  // observation seeds the baseline (history is never re-notified), and a
  // reconnect re-seeds so a completion that happened while disconnected
  // never fires.
  ctx.effect(() => {
    const observedTurn = new Map<string, number>()
    const reseed = (): void => { observedTurn.clear() }
    const stopReset = ctx.on('connection/reset', reseed)
    const off = sessions.list.subscribe(() => {
      const state = sessions.list.getSnapshot()
      const current = settings.getSnapshot()
      for (const id of state.ids) {
        const summary = state.byId[id]
        if (summary === undefined) continue
        const projection = summary.projectionValues?.notification
        const { nextTurn, fresh } = projectionAdvance(observedTurn.get(id), projection)
        observedTurn.set(id, nextTurn)
        if (!fresh) continue
        const plan = notificationFor(summary.id, summary.origin, summary.title, projection, current)
        if (plan === null) {
          console.info(`[dsh-notification] turn ${nextTurn} ${id} suppressed by settings/rules`)
          continue
        }
        const permission = notificationsApi()?.permission ?? 'denied'
        const showIt = shouldShow(permission, current.backgroundOnly, document.hidden, id, state.current)
        console.info(
          `[dsh-notification] turn ${nextTurn} ${id}: reason=${plan.reason} show=${showIt}`
          + ` (permission=${permission} backgroundOnly=${current.backgroundOnly}`
          + ` hidden=${document.hidden} current=${String(state.current)})`,
        )
        if (showIt) {
          show(
            t(titleKey(plan.reason)),
            bodyText(plan.body, t('notify.emptyBody')),
            plan.tag,
            current.requireInteraction,
          )
        }
      }
      const live = new Set(state.ids)
      for (const id of [...observedTurn.keys()]) {
        if (!live.has(id)) observedTurn.delete(id)
      }
    })
    return () => { off(); stopReset() }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:173-198](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L173-L198)

pending基线。

<details>
<summary>查看原文（26行）</summary>

```text
  // Pending-interaction runner: seed from the current snapshot before
  // subscribing so a newly observed question is not mistaken for startup
  // history. Re-seed on reconnect for the same reason: a wait that existed
  // while disconnected must not generate a stale notification.
  ctx.effect(() => {
    const observed = new Map<SessionId, { kind: PendingKind | undefined }>()
    const sequences = new Map<SessionId, number>()
    const pendingKind = (state: NotificationSessionListState, id: SessionId): PendingKind | undefined =>
      state.byId[id]?.pendingInteraction
      ?? asPendingKind(uiSession?.pendingInteractions.getSnapshot().get(id)?.kind)
    const seed = (state: NotificationSessionListState): void => {
      const live = new Set(state.ids)
      for (const id of state.ids) observed.set(id, { kind: pendingKind(state, id) })
      for (const id of [...observed.keys()]) {
        if (!live.has(id)) {
          observed.delete(id)
          sequences.delete(id)
        }
      }
    }
    seed(sessions.list.getSnapshot())
    const reseed = (): void => {
      observed.clear()
      seed(sessions.list.getSnapshot())
    }
    const stopReset = ctx.on('connection/reset', reseed)
```

</details>

**依据 3 · 源码核查**：[src/client/notifier.ts:77-91](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/notifier.ts#L77-L91)

权限及构造失败。

<details>
<summary>查看原文（15行）</summary>

```text
/** Construct one notification without allowing browser failures to disappear silently. */
export function createBrowserNotification(
  api: typeof Notification | undefined,
  title: string,
  options: NotificationOptions,
): NotificationCreationResult {
  if (api === undefined) return { ok: false, message: 'The Notification API is unavailable in this browser context.' }
  if (api.permission !== 'granted') return { ok: false, message: 'Notification permission is not granted.' }
  try {
    return { ok: true, notification: new api(title, options) }
  } catch (error) {
    /* v8 ignore next -- browsers throw Error objects for constructor failures. */
    const message = error instanceof Error ? error.message : String(error)
    return { ok: false, message }
  }
```

</details>

#### 缺口

- 多标签与休眠实际行为未知
  **影响**：可能漏提醒或重复，不能作为唯一任务记录
  **进一步探讨**：断线完成、权限切换与双标签同时完成演练

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样判断轻提醒足够而无需待办系统？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

单浏览器测试一个普通完成、一个错误和一个待审批，确认配置开关与规则确实筛掉不需要的结果。合格标准是当前可见会话不打断、后台有权限时能看到有界提示，点击能聚焦窗口；双会话须核对聚焦后仍需手选正确会话。断线发生的事件预期不补发，应明确从原生列表找回；这不是测试失败，而是适用范围。比较等待页常开与通知的回看频率、误报和遗漏，若重要任务会在关闭/休眠期间结束，则证伪“提醒足够”并改用持久待办。禁用插件可停止新通知，清理通知中心不修改会话或撤销工具；不把已有通知当完成账本。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:104-114](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L104-L114)

聚焦行为。

<details>
<summary>查看原文（11行）</summary>

```text
  const show = (title: string, body: string, tag: string, requireInteraction: boolean): NotificationCreationResult => {
    const result = createBrowserNotification(notificationsApi(), title, { body, tag, requireInteraction })
    if (!result.ok) {
      console.error(`[dsh-notification] notification creation failed: ${result.message}`)
      return result
    }
    result.notification.onclick = () => { window.focus() }
    result.notification.onerror = () => {
      console.error('[dsh-notification] the browser reported a notification delivery error')
    }
    return result
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:124-170](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/index.ts#L124-L170)

可见性及不补历史。

<details>
<summary>查看原文（47行）</summary>

```text
  // Completion runner: the host projection's turn is monotonic per session,
  // so an advance past the last-observed turn IS a freshly completed turn with
  // its own correct body — no race with the session-status frame. The first
  // observation seeds the baseline (history is never re-notified), and a
  // reconnect re-seeds so a completion that happened while disconnected
  // never fires.
  ctx.effect(() => {
    const observedTurn = new Map<string, number>()
    const reseed = (): void => { observedTurn.clear() }
    const stopReset = ctx.on('connection/reset', reseed)
    const off = sessions.list.subscribe(() => {
      const state = sessions.list.getSnapshot()
      const current = settings.getSnapshot()
      for (const id of state.ids) {
        const summary = state.byId[id]
        if (summary === undefined) continue
        const projection = summary.projectionValues?.notification
        const { nextTurn, fresh } = projectionAdvance(observedTurn.get(id), projection)
        observedTurn.set(id, nextTurn)
        if (!fresh) continue
        const plan = notificationFor(summary.id, summary.origin, summary.title, projection, current)
        if (plan === null) {
          console.info(`[dsh-notification] turn ${nextTurn} ${id} suppressed by settings/rules`)
          continue
        }
        const permission = notificationsApi()?.permission ?? 'denied'
        const showIt = shouldShow(permission, current.backgroundOnly, document.hidden, id, state.current)
        console.info(
          `[dsh-notification] turn ${nextTurn} ${id}: reason=${plan.reason} show=${showIt}`
          + ` (permission=${permission} backgroundOnly=${current.backgroundOnly}`
          + ` hidden=${document.hidden} current=${String(state.current)})`,
        )
        if (showIt) {
          show(
            t(titleKey(plan.reason)),
            bodyText(plan.body, t('notify.emptyBody')),
            plan.tag,
            current.requireInteraction,
          )
        }
      }
      const live = new Set(state.ids)
      for (const id of [...observedTurn.keys()]) {
        if (!live.has(id)) observedTurn.delete(id)
      }
    })
    return () => { off(); stopReset() }
```

</details>

**依据 3 · 源码核查**：[src/client/notifier.ts:39-59](https://github.com/omdsh-dev/dsh-notification/blob/675aab9b43d5011738feb6185281596c0365ccba/src/client/notifier.ts#L39-L59)

每turn标签。

<details>
<summary>查看原文（21行）</summary>

```text
export function shouldShow(
  permission: NotificationPermission,
  backgroundOnly: boolean,
  documentHidden: boolean,
  completedSessionId?: string,
  currentSessionId?: string,
): boolean {
  if (permission !== 'granted') return false
  if (backgroundOnly && !documentHidden && completedSessionId === currentSessionId) return false
  return true
}

/**
 * The grouping tag: one notification slot per session per turn. Turn-scoped
 * (not session-scoped): the browser replaces same-tag notifications, and a
 * stale same-tag entry lingering in the Windows notification center silently
 * swallows every later notification with that tag — a per-turn tag guarantees
 * each completed turn's toast always shows.
 */
export function notificationTag(sessionId: string, turn: number): string {
  return `dsh-notification-${sessionId}-${turn}`
```

</details>

#### 缺口

- 用户注意力收益未测
  **影响**：持续采用取决于是否接受断线遗漏
  **进一步探讨**：固定事件对照和手工查看原生列表

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
