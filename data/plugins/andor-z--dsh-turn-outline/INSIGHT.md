# dsh-turn-outline

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[64fad2e](https://github.com/Andor-Z/dsh-turn-outline/tree/64fad2e2ecb71af1b78031989ff01d20ad25807b)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Andor-Z/dsh-turn-outline) [![npm 30d 1,529](https://img.shields.io/static/v1?label=npm+30d&message=1%2C529&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-turn-outline) [![最新发布 2026-09-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-turn-outline)
<!-- END META -->

> **实现功能**：不调用模型，把DSH事件按用户轮次折叠为输入、工具与输出轨迹，并用seq定位回原文。

> **核心亮点**：复用结构化事件生成可追踪轨迹并跳回原文，省LLM接线且有live/冷路径优化，未证明秒开或零资源。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：Host围栏不是会话授权，任意非空sessionId进入读取链；摘要截断、lastSeq缓存及单大项预算例外也限制审计/性能承诺。详见[Q02](#research-q02)。

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
  - [Q01 · 谁需要轮次轨迹，事件到跳回主链如何运行？](#detail-section-11)
  - [Q02 · 相对LLM大纲或原生滚动贡献和关键边界是什么？](#detail-section-12)
  - [Q03 · 依赖、三阶段成本与效果怎么判断？](#detail-section-13)
  - [Q04 · 可复用机制与授权版本投影假设怎么验证？](#detail-section-14)
  - [Q05 · 当前适合谁采用，何时停止？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：授权的长会话读者快速回看工具步骤，需把导航摘要与完整记录区分。

原生搜索/滚动或LLM标题大纲可替代；事件轨迹避免模型调用但不减少所有加载/核查成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 轮次折叠 | 输入/工具/输出回看 | 文本/参数截断，不含完整结果 |
| 增量拉取 | live/冷事件分页 | seq假设与缓存非硬总预算 |
| 跳回原文 | 结构化节点/seq定位 | 历史与视图可用，失败可见 |
| sidebar tab | 当前会话入口 | 无sidebar不等Host不挂路由 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web/desktop、sessionQuery/sessions/webServer | Host必需 | live/冷事件读取与路由 | 接口版本需固定核对 |
| React18、uiConversation/sessions | Client必需 | 轨迹显示和结构化跳转 | 老宿主有回退，非全部版本保证 |
| better-sidebar>=0.17 | 显示tab必需 | 注册轨迹入口 | optional只表示不注册tab，Host仍独立存在 |
| 会话日志可读 | 展示必需 | seq事件投影/分页 | 不存在或读错有错误状态 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/sidebar版本并核对Host外层授权 | 不把Host/Origin围栏当用户授权 |
| 加载 | 安装包及sidebar，重启并启用tab | 当前会话轨迹对应正确ID |
| 使用 | 按输入/工具/输出回看并跳回 | 截断摘要回原文，跳转错误可见 |
| 退出/恢复 | 停用插件与tab，重新打开核对日志 | 只读无模型不等无缓存/资源成本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | sidebar/插件/兼容宿主，金额未知 | 版本与多视图跳转核对 | 无LLM tokens依赖 |
| 持续使用 | Host投影/冷缓存、浏览器fold、网络分页 | 识别截断摘要与跳转失败 | 单大冷会话可超过32MiB缓存预算 |
| 失败恢复 | 重新拉取/加载历史与重建UI状态 | 判断权限、日志、跳转或版本失配 | 无独立长会话性能/恢复时间结果 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 长会话回看 | 事件按轮次/工具投影，原seq保留 | 找到正确历史步骤的人时与误导率 |
| 增量 | 分页/请求generation和live路径 | 冷日志探测及大实例峰值负担 |
| 定位 | uiConversation节点/历史分页跳转 | 各宿主视图和折叠状态完成率 |

> **思考**：Host围栏不是会话授权，任意非空sessionId进入读取链；摘要截断、lastSeq缓存及单大项预算例外也限制审计/性能承诺。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：复用结构化事件生成可追踪轨迹并跳回原文，省LLM接线且有live/冷路径优化，未证明秒开或零资源。详见[Q01](#research-q01)与[Q02](#research-q02)。

复用结构化事件生成可追踪轨迹并跳回原文，省LLM接线且有live/冷路径优化，未证明秒开或零资源。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是wire数据最小化、活跃冻结快照与冷缓存分离、request generation防跨会话迟到响应、burst节流、分步drain及结构化锚点，而不是DOM文本匹配。剪裁数据减少带宽，但不构成脱敏或授权；seq是锚点，不是内容版本。

<a id="detail-section-5"></a>

### 1.4 主要限制

Host围栏不是会话授权，任意非空sessionId进入读取链；摘要截断、lastSeq缓存及单大项预算例外也限制审计/性能承诺。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

宿主授权明确的一人本地长会话可试用作导航摘要，远程/多用户先核会话授权。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持消息序列轨迹投影、增量折叠和结构化跳转；请求头信任、全会话可见及仅lastSeq缓存不保证授权/版本一致。授权且带日志版本的轨迹投影尚未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/client/useTrail.ts、src/client/index.tsx、src/client/trail-jump.ts、README.md、src/wire.ts、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定Host信任围栏/live冷路径、wire裁剪、Client注册/拉取与seq跳转关键链；未真实运行或全面审计全部UI。
- 下一步：进一步探讨可从双会话、同seq改写、迟到响应、巨型冷日志与视图折叠夹具入手，比较授权、陈旧显示和跳转。

**分析版本**

- **仓库**：[Andor-Z/dsh-turn-outline](https://github.com/Andor-Z/dsh-turn-outline)
- **版本号**：0.3.1（[固定提交 64fad2e](https://github.com/Andor-Z/dsh-turn-outline/tree/64fad2e2ecb71af1b78031989ff01d20ad25807b)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨授权且有版本的轨迹投影，校验主体/session并携带日志版本重建缓存；有授权适配与重建成本，未验证。详见[Q04](#research-q04)。

进一步探讨可从双会话、同seq改写、迟到响应、巨型冷日志与视图折叠夹具入手，比较授权、陈旧显示和跳转。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 85 | 61 | 15 | — |
| .md | source | 3 | 368 | — | — | 5329 |
| .tsx | source | 2 | 720 | 584 | 85 | — |
| .ts | source | 9 | 2891 | 2315 | 409 | — |
| .tsx | test | 2 | 375 | 302 | 45 | — |
| .ts | test | 4 | 1281 | 1121 | 64 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Andor-Z/dsh-turn-outline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Andor-Z/dsh-turn-outline/issues?q=is%3Aissue+created%3A2026-09-22T05%3A45%3A57.619Z..2026-10-22T05%3A45%3A57.619Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Andor-Z/dsh-turn-outline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A45%3A57.619Z..2026-10-22T05%3A45%3A57.619Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查轮次轨迹的投影、结构化定位、权限/缓存边界及完整成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要轮次轨迹，事件到跳回主链如何运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向DSH长会话读者，想回看用户输入、工具步骤和输出并回到原位。输入是当前sessionId的事件序列，输出为轮次/工具筛选的轨迹与seq锚点。合格结果需会话/事件归属正确、摘要明确截断且定位到对应原文，不等同自然语言语义标题。

Host优先从live snapshotEvents/events借冻结事件，冷会话用sessionQuery及lastSeq/TTL缓存，projectEvent只传所需字段并分页。Client订阅会话变化，合并节流拉取，request generation拒绝过期结果，TrailFolder折叠轮次。tab通过betterSidebar注册，点击用uiConversation/seq和loadOlder或loadThrough加载原记录，返回跳转成功/错误；不调用模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:169-185](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L169-L185)

live版本适配。

<details>
<summary>查看原文（17行）</summary>

```text
/**
 * Borrow the live store's frozen snapshot — O(1) amortized, zero copies.
 * DSH 0.2.0 renamed the live session's frozen log from the `events` property
 * to the `snapshotEvents()` method (the returned array is frozen and cached
 * between appends, so the borrow stays zero-copy); older DSH exposed the
 * array directly. Either face is accepted; the events must be ascending by
 * seq for the binary-search page slice.
 */
function liveEventsOf(session: LiveSessionLike): ReadonlyArray<SessionEventLike> | undefined {
  if (typeof session.snapshotEvents === 'function') {
    try {
      const snapshot = session.snapshotEvents()
      if (Array.isArray(snapshot)) return snapshot
    } catch {
      return undefined
    }
  }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:269-320](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L269-L320)

live与冷缓存读取/投影。

<details>
<summary>查看原文（52行）</summary>

```text
      try {
        // Live fast path: synchronous, O(1) probe, O(delta) projection.
        const live = liveSessionOf(ctx, sessionId)
        if (live !== undefined) {
          respondPage(res, liveEventsOf(live) ?? [], afterSeq, true)
          return
        }

        // Persisted path. The listEvents probe costs a whole-log read +
        // per-event structuredClone inside sessionQuery, so its result is
        // cached behind PROBE_TTL_MS: a multi-page drain (each page = one
        // request) probes once instead of once per page.
        const cached = trailCache.get(sessionId)
        let lastSeq = -1
        let probedAt = 0
        if (cached !== undefined && Date.now() - cached.probedAt < PROBE_TTL_MS) {
          // Fresh probe reuse: trust the cached lastSeq, skip the round-trip.
          lastSeq = cached.lastSeq
          probedAt = cached.probedAt
        } else {
          try {
            const records = await ctx.sessionQuery.listEvents(sessionId)
            const last = records[records.length - 1]
            lastSeq = last !== undefined && typeof last.seq === 'number' ? last.seq : -1
            probedAt = Date.now()
          } catch {
            lastSeq = -1
            probedAt = Date.now()
          }
        }
        let base: SessionEventLike[]
        if (cached !== undefined && lastSeq >= 0 && cached.lastSeq === lastSeq) {
          base = cached.events
          if (probedAt > cached.probedAt) cached.probedAt = probedAt
          // LRU touch: re-insert at the fresh end.
          trailCache.delete(sessionId)
          trailCache.set(sessionId, cached)
        } else {
          const snapshot = await ctx.sessionQuery.readSession(sessionId)
          const raw = Array.isArray(snapshot.events) ? snapshot.events : []
          // Project once, accumulating wire bytes per event in the same pass —
          // no separate whole-log JSON.stringify just for the byte budget.
          let bytes = 0
          base = raw.map((event) => {
            const projected = projectEvent(event)
            bytes += Buffer.byteLength(JSON.stringify(projected))
            return projected
          })
          cacheStore(sessionId, lastSeq, base, bytes, probedAt)
        }
        // base is already projected (idempotently); serve without re-projecting.
        respondPage(res, base, afterSeq, false)
```

</details>

**依据 3 · 源码核查**：[src/client/useTrail.ts:121-153](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts#L121-L153)

分页拉取和过期请求保护。

<details>
<summary>查看原文（33行）</summary>

```text
  const pull = React.useCallback(async (): Promise<void> => {
    const generation = ++requestGen.current
    const sid = sessionIdRef.current
    const seqBefore = seqRef.current
    // True when the drain loop hit MAX_PULL_PAGES with pages still pending.
    let drainCapped = false
    try {
      // Drain possibly-paginated pages until the server log is current.
      for (let page = 0; page < MAX_PULL_PAGES; page += 1) {
        const { events, hasMore } = await fetchRef.current(sid, seqRef.current)
        if (generation !== requestGen.current || sid !== sessionIdRef.current) return
        if (events.length > 0) {
          let folder = folderRef.current
          if (folder === null) folder = folderRef.current = new TrailFolder()
          let anyPushed = false
          for (const event of events) {
            const before = folder.latestSeq
            folder.push(event)
            if (folder.latestSeq !== before) anyPushed = true
          }
          if (anyPushed) {
            const last = events[events.length - 1]
            if (typeof last.seq === 'number' && last.seq > seqRef.current) seqRef.current = last.seq
            setTurns(folder.snapshot())
            setStats(folder.stats())
          }
        }
        if (hasMore !== true || events.length === 0) {
          drainCapped = false
          break
        }
        drainCapped = page === MAX_PULL_PAGES - 1
      }
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:76-105](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/index.tsx#L76-L105)

sidebar tab注册。

<details>
<summary>查看原文（30行）</summary>

```text
  const betterSidebar = ctx.get('betterSidebar')
  if (
    betterSidebar === undefined || betterSidebar === null
    || typeof (betterSidebar as { registerTab?: unknown }).registerTab !== 'function'
  ) {
    // No better-sidebar: stay inert (the plan's no-op path).
    return
  }

  ctx.effect(() => (betterSidebar as { registerTab(descriptor: unknown): () => void }).registerTab({
    id: 'turn-outline',
    title: () => (typeof navigator !== 'undefined' && navigator.language.toLowerCase().startsWith('zh')
      ? '轮次轨迹'
      : 'Turn Outline'),
    description: tabDescription,
    icon: (size: number) => routeIcon(size),
    order: 46,
    single: true,
    component: (props: {
      ctx: { get(name: string): unknown }
      store?: unknown
      scope: { sessionId: string; cwd?: string }
      tab: { id: string }
      visible: boolean
    }) => React.createElement(TrailTab, {
      ctx: props.ctx,
      scope: props.scope,
      visible: props.visible === true,
      tab: props.tab,
    }),
```

</details>

**依据 5 · 源码核查**：[src/client/trail-jump.ts:418-432](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/trail-jump.ts#L418-L432)

seq加载与历史分页。

<details>
<summary>查看原文（15行）</summary>

```text
    // `loadOlder()` loop for older hosts.
    let pages = 0
    if (!hasSeqInWindow(view, item.seq) && typeof session.loadThrough === 'function') {
      await session.loadThrough(item.seq)
      // The conversation projection rebuilds from the event window on notify —
      // give it a couple of frames before re-reading the node store.
      await waitForNextFrame()
      await waitForNextFrame()
      view = viewStateForJump(session, options.conversation)
    }
    while (view.hasMore && !hasSeqInWindow(view, item.seq) && pages < guard) {
      await session.loadOlder()
      view = viewStateForJump(session, options.conversation)
      pages += 1
      options.onProgress?.(pages)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对LLM大纲或原生滚动贡献和关键边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是用现有结构化事件生成可追溯轨迹、保留seq跳回，减少LLM标题生成和逐段阅读需求。省去模型调用只代表不新增这类tokens，不代表“零成本、秒开、无失败态”；Client有明确错误状态，跳转也有not-rendered等失败。轨迹是投影，正文2048字符、参数512字符且tool/result全文丢弃，不能作为完整审计日志或从摘要判断工具全部结果。

Host围栏只检查Host为loopback、cross-site标记与Origin hostname，缺Origin允许，不按socket本地/当前用户/sessionId权限授权；请求给非空sessionId就读取对应live/持久日志。源码也明确它是browser-trust fence而非auth。实际可达由宿主外层认证决定，不能声称已可由任意外部用户读取，但不适合把插件单独当多用户会话隔离。

冷缓存按lastSeq判断不变，同seq内容改写/日志替换未见版本指纹；单实例最后一条缓存保留，即使超过32MiB，预算非硬上限。没有sidebar只是不注册Client tab，Host仍挂路由，Client还先挂样式，作者inert应按层理解。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-31](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/README.md#L27-L31)

作者零成本/无失败态声明。

```text
- **按用户轮次折叠轨迹** —— 会话被折叠成「输入 → 工具步骤 → 输出」的结构化轨迹，长会话一目了然；轮次内支持多级折叠与工具类型筛选 chips，只看你想看的部分。
- **一键跳回原位** —— 点击任意轮次 / 工具步骤，自动加载历史并滚动到聊天视图 / 轨迹视图的对应行；0.2.0 走 client `uiConversation` 会话视图注册表（`anchorSeq` 节点匹配 + `loadOlder` 翻页），0.1.x 回退旧 session 快照，不依赖 DOM 文本与哈希类名。
- **零 AI 依赖** —— 纯事件折叠，不调用 LLM：零 token、秒开、无失败态。
- **只读零侵入** —— 不改动 DSH 核心：host 一个只读路由 + client 一个 tab，注册即用、卸载干净。
- **增量性能** —— 会话订阅驱动刷新（无定时轮询）；`TrailFolder` 只重折打开中的轮次（O(delta)）；seq-keyed 行追加不重挂。
```

**依据 2 · 源码核查**：[src/wire.ts:15-33](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/wire.ts#L15-L33)

截断与结果裁减。

<details>
<summary>查看原文（19行）</summary>

```text
 *   - `tool/result` message content (the bulky part of real logs) is dropped
 *     entirely — the fold consumes only `error.name` / `error.code`.
 */
import type { SessionEventLike } from './context-types'

/** Max characters carried per text field (input / output / summary). */
export const TEXT_CAP = 2048

/** Max characters of tool-call arguments (the fold only previews 120). */
export const ARGS_CAP = 512

/** Max events per response page; the client loops while `hasMore` is true. */
export const PAGE_SIZE = 2000

/** Hard body cap for the route's request payload. */
export const MAX_BODY_BYTES = 64 * 1024

function clipText(value: string, cap: number): string {
  return value.length > cap ? `${value.slice(0, cap)}…` : value
```

</details>

**依据 3 · 源码核查**：[src/client/useTrail.ts:171-174](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts#L171-L174)

真实错误状态。

```text
    } catch (reason) {
      if (generation !== requestGen.current) return
      setError(reason instanceof Error ? reason.message : String(reason))
      setStatus((current) => (current === 'ready' ? current : 'error'))
```

**依据 4 · 源码核查**：[src/index.ts:99-111](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L99-L111)

围栏不是用户认证且Origin缺省允许。

<details>
<summary>查看原文（13行）</summary>

```text
export function isTrustedApiRequest(request: { headers: HttpHeadersLike }): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined || !isLoopbackHostname(hostUrl.hostname)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).hostname === hostUrl.hostname
  } catch {
    return false
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:241-273](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L241-L273)

按请求sessionId读取。

<details>
<summary>查看原文（33行）</summary>

```text
export function apply(ctx: HostCtx): void {
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: '/turn-outline/api/events',
    handler: async (rawReq, rawRes) => {
      const req = rawReq as HttpRequestLike
      const res = rawRes as HttpResponseLike

      if (!isTrustedApiRequest({ headers: req.headers })) {
        sendJson(res, 403, { error: 'forbidden' })
        return
      }
      if (req.method !== 'POST') {
        sendJson(res, 405, { error: 'method not allowed' })
        return
      }
      const body = await readJsonBody(req)
      if (body === BODY_TOO_LARGE) {
        sendJson(res, 413, { error: 'payload too large' })
        return
      }
      const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
      if (sessionId.length === 0) {
        sendJson(res, 400, { error: 'sessionId is required' })
        return
      }
      const afterSeq = afterSeqOf(body.afterSeq)

      try {
        // Live fast path: synchronous, O(1) probe, O(delta) projection.
        const live = liveSessionOf(ctx, sessionId)
        if (live !== undefined) {
          respondPage(res, liveEventsOf(live) ?? [], afterSeq, true)
```

</details>

**依据 6 · 源码核查**：[src/index.ts:281-305](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L281-L305)

lastSeq冷缓存。

<details>
<summary>查看原文（25行）</summary>

```text
        const cached = trailCache.get(sessionId)
        let lastSeq = -1
        let probedAt = 0
        if (cached !== undefined && Date.now() - cached.probedAt < PROBE_TTL_MS) {
          // Fresh probe reuse: trust the cached lastSeq, skip the round-trip.
          lastSeq = cached.lastSeq
          probedAt = cached.probedAt
        } else {
          try {
            const records = await ctx.sessionQuery.listEvents(sessionId)
            const last = records[records.length - 1]
            lastSeq = last !== undefined && typeof last.seq === 'number' ? last.seq : -1
            probedAt = Date.now()
          } catch {
            lastSeq = -1
            probedAt = Date.now()
          }
        }
        let base: SessionEventLike[]
        if (cached !== undefined && lastSeq >= 0 && cached.lastSeq === lastSeq) {
          base = cached.events
          if (probedAt > cached.probedAt) cached.probedAt = probedAt
          // LRU touch: re-insert at the fresh end.
          trailCache.delete(sessionId)
          trailCache.set(sessionId, cached)
```

</details>

**依据 7 · 源码核查**：[src/index.ts:229-238](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L229-L238)

大单实例缓存例外。

<details>
<summary>查看原文（10行）</summary>

```text
  }
  trailCache.set(sessionId, { lastSeq, probedAt, events, bytes })
  cacheBytes += bytes
  while (trailCache.size > CACHE_MAX_ENTRIES || (cacheBytes > CACHE_MAX_BYTES && trailCache.size > 1)) {
    const oldest = trailCache.keys().next().value
    if (oldest === undefined) break
    const entry = trailCache.get(oldest)
    trailCache.delete(oldest)
    cacheBytes -= entry?.bytes ?? 0
  }
```

</details>

**依据 8 · 源码核查**：[src/client/index.tsx:65-82](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/index.tsx#L65-L82)

先样式后sidebar判定。

<details>
<summary>查看原文（18行）</summary>

```text
  const style = document.createElement('style')
  style.dataset.plugin = 'dsh-turn-outline'
  style.textContent = trailCss
  document.head.appendChild(style)
  // cordis ctx.effect(fn) RUNS fn to register and treats its RETURN VALUE as
  // the cleanup. A single arrow executes style.remove() immediately (the
  // injected <style> is deleted on the spot → styles never apply). Double
  // arrow returns the cleanup so the sheet survives (matches conversation-
  // outline, the working reference).
  ctx.effect(() => () => style.remove())

  const betterSidebar = ctx.get('betterSidebar')
  if (
    betterSidebar === undefined || betterSidebar === null
    || typeof (betterSidebar as { registerTab?: unknown }).registerTab !== 'function'
  ) {
    // No better-sidebar: stay inert (the plan's no-op path).
    return
```

</details>

#### 缺口

- 固定Host外层认证/会话授权与远程部署边界未完整核查。
  **影响**：不能称插件接口自身实现多用户隐私隔离。
  **进一步探讨**：可先核宿主统一路由认证，再用两会话无敏感事件检查未授权sessionId请求。
- 冷日志同seq改写/替换与巨型会话实际内存/跳转未验证。
  **影响**：不能把seq末尾相同视为内容必然相同或缓存硬受32MiB限制。
  **进一步探讨**：可从同seq内容更新、缓存单大项与重建日志夹具核查版本失配和峰值资源。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、三阶段成本与效果怎么判断？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包0.3.1、Node>=18，better-sidebar为optional peer但实际tab依赖其服务。DSH多条版本回退只说明代码feature detection，README作者联调不等本轮真实验证。无LLM是明确机制，但网络分页、Host冷日志探测和浏览器折叠仍耗资源；删除插件不删除原日志。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH web/desktop、sessionQuery/sessions/webServer | Host必需 | live/冷事件读取与路由 | 接口版本需固定核对 |
| React18、uiConversation/sessions | Client必需 | 轨迹显示和结构化跳转 | 老宿主有回退，非全部版本保证 |
| better-sidebar>=0.17 | 显示tab必需 | 注册轨迹入口 | optional只表示不注册tab，Host仍独立存在 |
| 会话日志可读 | 展示必需 | seq事件投影/分页 | 不存在或读错有错误状态 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 固定宿主/sidebar版本并核对Host外层授权 | 不把Host/Origin围栏当用户授权 |
| 加载 | 安装包及sidebar，重启并启用tab | 当前会话轨迹对应正确ID |
| 使用 | 按输入/工具/输出回看并跳回 | 截断摘要回原文，跳转错误可见 |
| 退出/恢复 | 停用插件与tab，重新打开核对日志 | 只读无模型不等无缓存/资源成本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | sidebar/插件/兼容宿主，金额未知 | 版本与多视图跳转核对 | 无LLM tokens依赖 |
| 持续使用 | Host投影/冷缓存、浏览器fold、网络分页 | 识别截断摘要与跳转失败 | 单大冷会话可超过32MiB缓存预算 |
| 失败恢复 | 重新拉取/加载历史与重建UI状态 | 判断权限、日志、跳转或版本失配 | 无独立长会话性能/恢复时间结果 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 长会话回看 | 事件按轮次/工具投影，原seq保留 | 找到正确历史步骤的人时与误导率 |
| 增量 | 分页/请求generation和live路径 | 冷日志探测及大实例峰值负担 |
| 定位 | uiConversation节点/历史分页跳转 | 各宿主视图和折叠状态完成率 |

对照原生搜索/滚动或LLM标题大纲，应固定历史问题，统计准确找到事件与回到原文的时间、误定位和资源，而不是标题条数。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:37-45](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/package.json#L37-L45)

sidebar/React peer与optional。

```text
  "peerDependencies": {
    "dsh-better-sidebar": ">=0.17.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "dsh-better-sidebar": {
      "optional": true
    }
  },
```

**依据 2 · 源码核查**：[package.json:59-65](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/package.json#L59-L65)

Node及包元数据。

```text
  "engines": {
    "node": ">=18"
  },
  "packageManager": "pnpm@11.8.0",
  "license": "MIT",
  "author": "Andor <zyfsta@outlook.com>",
  "homepage": "https://github.com/Andor-Z/dsh-turn-outline",
```

**依据 3 · 源码核查**：[src/index.ts:277-317](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L277-L317)

冷日志成本与缓存。

<details>
<summary>查看原文（41行）</summary>

```text
        // Persisted path. The listEvents probe costs a whole-log read +
        // per-event structuredClone inside sessionQuery, so its result is
        // cached behind PROBE_TTL_MS: a multi-page drain (each page = one
        // request) probes once instead of once per page.
        const cached = trailCache.get(sessionId)
        let lastSeq = -1
        let probedAt = 0
        if (cached !== undefined && Date.now() - cached.probedAt < PROBE_TTL_MS) {
          // Fresh probe reuse: trust the cached lastSeq, skip the round-trip.
          lastSeq = cached.lastSeq
          probedAt = cached.probedAt
        } else {
          try {
            const records = await ctx.sessionQuery.listEvents(sessionId)
            const last = records[records.length - 1]
            lastSeq = last !== undefined && typeof last.seq === 'number' ? last.seq : -1
            probedAt = Date.now()
          } catch {
            lastSeq = -1
            probedAt = Date.now()
          }
        }
        let base: SessionEventLike[]
        if (cached !== undefined && lastSeq >= 0 && cached.lastSeq === lastSeq) {
          base = cached.events
          if (probedAt > cached.probedAt) cached.probedAt = probedAt
          // LRU touch: re-insert at the fresh end.
          trailCache.delete(sessionId)
          trailCache.set(sessionId, cached)
        } else {
          const snapshot = await ctx.sessionQuery.readSession(sessionId)
          const raw = Array.isArray(snapshot.events) ? snapshot.events : []
          // Project once, accumulating wire bytes per event in the same pass —
          // no separate whole-log JSON.stringify just for the byte budget.
          let bytes = 0
          base = raw.map((event) => {
            const projected = projectEvent(event)
            bytes += Buffer.byteLength(JSON.stringify(projected))
            return projected
          })
          cacheStore(sessionId, lastSeq, base, bytes, probedAt)
```

</details>

**依据 4 · 源码核查**：[src/client/useTrail.ts:155-169](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts#L155-L169)

大日志继续drain而非静默截断。

<details>
<summary>查看原文（15行）</summary>

```text
      setStatus('ready')
      // A capped drain with pages pending (first open of a huge cold session)
      // must not truncate silently: keep draining through the throttled path.
      // Guards stop a misbehaving transport from looping forever: the tab is
      // still visible, the pull is still current, and THIS pull made real seq
      // progress (a stalled transport yields none, so scheduling stops).
      if (
        drainCapped
        && seqRef.current !== seqBefore
        && generation === requestGen.current
        && sid === sessionIdRef.current
        && visibleRef.current
        && schedulePullRef.current !== null
      ) {
        schedulePullRef.current()
```

</details>

#### 缺口

- 缺少同长会话历史检索任务的人时、正确率、内存与网络对照。
  **影响**：不能证明秒开或更低完整任务成本。
  **进一步探讨**：可用固定规模/事件类型会话，比较原生查找、轨迹与标题大纲，分别记冷/热加载和跳转失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可复用机制与授权版本投影假设怎么验证？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是wire数据最小化、活跃冻结快照与冷缓存分离、request generation防跨会话迟到响应、burst节流、分步drain及结构化锚点，而不是DOM文本匹配。剪裁数据减少带宽，但不构成脱敏或授权；seq是锚点，不是内容版本。

可探讨未验证的“授权且有版本的轨迹投影”。Host沿官方会话授权校验调用者，返回投影版本/日志指纹与截断标记；Client发现版本变化重建而非只按afterSeq追加，并用受控预算拒绝/分段大冷项。相对当前sessionId/lastSeq链，目标是避免越权投影和同seq旧内容。代价是官方授权适配、hash/版本维护与重建成本。可用双会话、同seq改写、迟到响应和超预算单项夹具比较越权字段、陈旧显示及加载时间；若仍错读或反复全量重建，应修正。

#### 证据与依据

**依据 1 · 源码核查**：[src/wire.ts:20-33](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/wire.ts#L20-L33)

投影预算和截断。

<details>
<summary>查看原文（14行）</summary>

```text
/** Max characters carried per text field (input / output / summary). */
export const TEXT_CAP = 2048

/** Max characters of tool-call arguments (the fold only previews 120). */
export const ARGS_CAP = 512

/** Max events per response page; the client loops while `hasMore` is true. */
export const PAGE_SIZE = 2000

/** Hard body cap for the route's request payload. */
export const MAX_BODY_BYTES = 64 * 1024

function clipText(value: string, cap: number): string {
  return value.length > cap ? `${value.slice(0, cap)}…` : value
```

</details>

**依据 2 · 源码核查**：[src/client/useTrail.ts:121-145](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts#L121-L145)

请求代际与会话检查。

<details>
<summary>查看原文（25行）</summary>

```text
  const pull = React.useCallback(async (): Promise<void> => {
    const generation = ++requestGen.current
    const sid = sessionIdRef.current
    const seqBefore = seqRef.current
    // True when the drain loop hit MAX_PULL_PAGES with pages still pending.
    let drainCapped = false
    try {
      // Drain possibly-paginated pages until the server log is current.
      for (let page = 0; page < MAX_PULL_PAGES; page += 1) {
        const { events, hasMore } = await fetchRef.current(sid, seqRef.current)
        if (generation !== requestGen.current || sid !== sessionIdRef.current) return
        if (events.length > 0) {
          let folder = folderRef.current
          if (folder === null) folder = folderRef.current = new TrailFolder()
          let anyPushed = false
          for (const event of events) {
            const before = folder.latestSeq
            folder.push(event)
            if (folder.latestSeq !== before) anyPushed = true
          }
          if (anyPushed) {
            const last = events[events.length - 1]
            if (typeof last.seq === 'number' && last.seq > seqRef.current) seqRef.current = last.seq
            setTurns(folder.snapshot())
            setStats(folder.stats())
```

</details>

**依据 3 · 源码核查**：[src/index.ts:281-317](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L281-L317)

版本假设来自lastSeq缓存。

<details>
<summary>查看原文（37行）</summary>

```text
        const cached = trailCache.get(sessionId)
        let lastSeq = -1
        let probedAt = 0
        if (cached !== undefined && Date.now() - cached.probedAt < PROBE_TTL_MS) {
          // Fresh probe reuse: trust the cached lastSeq, skip the round-trip.
          lastSeq = cached.lastSeq
          probedAt = cached.probedAt
        } else {
          try {
            const records = await ctx.sessionQuery.listEvents(sessionId)
            const last = records[records.length - 1]
            lastSeq = last !== undefined && typeof last.seq === 'number' ? last.seq : -1
            probedAt = Date.now()
          } catch {
            lastSeq = -1
            probedAt = Date.now()
          }
        }
        let base: SessionEventLike[]
        if (cached !== undefined && lastSeq >= 0 && cached.lastSeq === lastSeq) {
          base = cached.events
          if (probedAt > cached.probedAt) cached.probedAt = probedAt
          // LRU touch: re-insert at the fresh end.
          trailCache.delete(sessionId)
          trailCache.set(sessionId, cached)
        } else {
          const snapshot = await ctx.sessionQuery.readSession(sessionId)
          const raw = Array.isArray(snapshot.events) ? snapshot.events : []
          // Project once, accumulating wire bytes per event in the same pass —
          // no separate whole-log JSON.stringify just for the byte budget.
          let bytes = 0
          base = raw.map((event) => {
            const projected = projectEvent(event)
            bytes += Buffer.byteLength(JSON.stringify(projected))
            return projected
          })
          cacheStore(sessionId, lastSeq, base, bytes, probedAt)
```

</details>

**依据 4 · 源码核查**：[src/client/trail-jump.ts:418-432](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/trail-jump.ts#L418-L432)

结构化seq加载。

<details>
<summary>查看原文（15行）</summary>

```text
    // `loadOlder()` loop for older hosts.
    let pages = 0
    if (!hasSeqInWindow(view, item.seq) && typeof session.loadThrough === 'function') {
      await session.loadThrough(item.seq)
      // The conversation projection rebuilds from the event window on notify —
      // give it a couple of frames before re-reading the node store.
      await waitForNextFrame()
      await waitForNextFrame()
      view = viewStateForJump(session, options.conversation)
    }
    while (view.hasMore && !hasSeqInWindow(view, item.seq) && pages < guard) {
      await session.loadOlder()
      view = viewStateForJump(session, options.conversation)
      pages += 1
      options.onProgress?.(pages)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 当前适合谁采用，何时停止？

**研究主题**：采用判断

#### 完整回答

推荐trial，限授权边界已由宿主明确的一人本地长会话回看。数据投影和结构化跳转有实际集成价值，先把它当导航摘要，不能替代完整日志或业务结果核查。对多用户/远程服务，应先解决调用者到sessionId授权，不把loopback Host头当访问者身份。

继续探讨可先用固定无敏感日志验证权限和同seq更新，再按宿主版本测试冷/热加载及聊天/轨迹视图。出现别的会话可见、截断摘要误导、跳转错行、错误当无记录、巨型冷日志资源异常或旧内容持续不变，应停止依赖对应结果并回原始记录。依据Q02和Q03，不因作者无失败态描述免于核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:99-111](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/index.ts#L99-L111)

围栏权限边界。

<details>
<summary>查看原文（13行）</summary>

```text
export function isTrustedApiRequest(request: { headers: HttpHeadersLike }): boolean {
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host)
  if (hostUrl === undefined || !isLoopbackHostname(hostUrl.hostname)) return false
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  try {
    return new URL(origin).hostname === hostUrl.hostname
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[src/wire.ts:20-33](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/wire.ts#L20-L33)

摘要截断。

<details>
<summary>查看原文（14行）</summary>

```text
/** Max characters carried per text field (input / output / summary). */
export const TEXT_CAP = 2048

/** Max characters of tool-call arguments (the fold only previews 120). */
export const ARGS_CAP = 512

/** Max events per response page; the client loops while `hasMore` is true. */
export const PAGE_SIZE = 2000

/** Hard body cap for the route's request payload. */
export const MAX_BODY_BYTES = 64 * 1024

function clipText(value: string, cap: number): string {
  return value.length > cap ? `${value.slice(0, cap)}…` : value
```

</details>

**依据 3 · 源码核查**：[src/client/useTrail.ts:171-174](https://github.com/Andor-Z/dsh-turn-outline/blob/64fad2e2ecb71af1b78031989ff01d20ad25807b/src/client/useTrail.ts#L171-L174)

错误处理。

```text
    } catch (reason) {
      if (generation !== requestGen.current) return
      setError(reason instanceof Error ? reason.message : String(reason))
      setStatus((current) => (current === 'ready' ? current : 'error'))
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
