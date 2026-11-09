# DSH Token Pet · 用量小宠物

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ca315d8](https://github.com/Jimmy0123-ux/dsh-token-pet/tree/ca315d8b04f70770598d657629641d3437115a46)

<!-- BEGIN META -->
[![GitHub ★ 58](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=58&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Jimmy0123-ux/dsh-token-pet) [![npm 30d 2,845](https://img.shields.io/static/v1?label=npm+30d&message=2%2C845&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-token-pet) [![最新发布 2026-09-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-token-pet)
<!-- END META -->

> **功能**：在 DSH 悬浮界面显示运行、上下文和用量，另有历史账本、成本估计与主动提示词增强。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把实时投影与持久账本分开呈现，减少切换界面。新鲜度与用户节时未验。

> **主要限制**：[Q03](#research-q03) 留存累计、不可逆清空与本地估价有不同含义，[Q04](#research-q04) 的主动增强另有模型数据出口。

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
  - [Q01 · 悬浮状态和用量相对于手工日志有什么价值？](#detail-section-11)
  - [Q02 · 插件怎样挂载，累计账本和实时状态如何接线？](#detail-section-12)
  - [Q03 · 归档、读失败、清空和价格估算有哪些边界？](#detail-section-13)
  - [Q04 · 使用条件、提示词模型调用和退出成本是什么？](#detail-section-14)
  - [Q05 · 标出估计口径和账本新鲜度能否减少误解？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 多步骤或长会话用户可以随手查看上下文、工具状态和累计用量。原办法是看宿主状态和日志。

[Q01](#research-q01) 对照在原 DSH 查看宿主统计和日志，比较识别事件及核验所需时间。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 悬浮状态 | 查看当前会话进度 | 按宿主投影刷新 |
| 快照账本 | 聚合用量及保留已知值 | 快照滞后与历史留存须分辨 |
| 价格与提示词增强 | 查看估计或主动改写 | 按本地价格与选定模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22.19+、Cordis 与 DSH Web 插槽 | 基础使用需要 | Host 与视图挂载 | 先核对宿主 |
| 会话投影与持久服务 | 相应用量需要 | 当前与历史读数 | 标明快照范围 |
| DSH 模型或适配器 | 仅增强需要 | 改写草稿 | 退回原草稿 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对宿主并关闭可选写动作 | 先查实时与快照状态 |
| 使用 | 用户看状态，按需另行建索引 | 比较投影和历史是否一致 |
| 验收 | 对照已知会话，检查导出与价格 | 估计及留存分别核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Node、插件和索引空间未知 | 安装、核对主机与统计口径 | 历史全量建库另触发 |
| 持续使用 | 动画 CPU、缓存、磁盘和可选模型 token 未测 | 对照账本、编辑本地价格 | 未验证真实账单 |
| 失败恢复 | 重建索引及重新增强资源未知 | 核对日志、快照滞后及旧草稿 | 读取失败与删除会话区分 |
| 退出 | 留存统计与导出占用未知 | 盘点并区分禁用和清空 | Lifetime 清空有确认，无对应恢复路由 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 状态显示 | 当前会话投影及成功完成触发 | 用户识别准确率和干扰 |
| 历史统计 | 独立账本、快照和水位 | 完整性、跨宿主时延 |
| 估算与改写 | 本地价表和主动增强接线 | 费用一致、模型输出有效性 |

> **思考**：[Q03](#research-q03) 留存累计、不可逆清空与本地估价有不同含义，[Q04](#research-q04) 的主动增强另有模型数据出口。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把实时投影与持久账本分开呈现，减少切换界面。新鲜度与用户节时未验。

[Q02](#research-q02) 趋势检查点与异步索引同步分开。[Q03](#research-q03) 保留已知数及区分真正的读错。[Q04](#research-q04) 会话租约限制跨会话提交。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 留存累计、不可逆清空与本地估价有不同含义，[Q04](#research-q04) 的主动增强另有模型数据出口。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先试只读观察并核对底层会话，用到价格和增强时分别确认口径及模型去向。退出前盘点统计留存。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持 Web 插槽、后台账本、确认和主动模型调用。未实际核对宿主用量、发票或界面体验。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/index.ts、src/client/completion.ts、package.json、cordis.patch.yml、src/index.ts、src/lifetime-ledger.ts、src/client/settings.ts、src/client/cost.ts、src/client/prompt-panel.tsx、src/client/prompt.ts、src/client/export-data.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态检查 DSH 接线、代表投影、账本、估计和主动模型入口。未验证皮肤、全部动画、发票、宿主运行或浏览器行为。
- 下一步：[Q05](#research-q05) 以固定会话事件和合成价格做读数盲测，区分新鲜度、统计范围、账单判断和额外阅读成本。

**分析版本**

- **仓库**：[Jimmy0123-ux/dsh-token-pet](https://github.com/Jimmy0123-ux/dsh-token-pet)
- **版本号**：0.4.2（[固定提交 ca315d8](https://github.com/Jimmy0123-ux/dsh-token-pet/tree/ca315d8b04f70770598d657629641d3437115a46)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在数值旁区分快照状态、时间和本地价格匹配，可能减少把旧用量或估计当账单的误判。

[Q05](#research-q05) 以固定会话事件和合成价格做读数盲测，区分新鲜度、统计范围、账单判断和额外阅读成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 12 | 1546 | — | — | 18002 |
| .mjs | source | 6 | 421 | 370 | 31 | — |
| .cjs | source | 1 | 33 | 28 | 2 | — |
| .ts | source | 41 | 6679 | 5503 | 827 | — |
| .tsx | source | 8 | 1713 | 1505 | 126 | — |
| .mjs | test | 19 | 3505 | 3201 | 54 | — |
| .tsx | test | 1 | 90 | 81 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-09），可前往 [GitHub Issues](https://github.com/Jimmy0123-ux/dsh-token-pet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：不用打开日志时，悬浮界面的状态、用量与成本显示哪些可核对信息，哪些动作会进一步触发模型或写入？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 悬浮状态和用量相对于手工日志有什么价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH 长会话或多工具任务中，用户可以不离开当前视图查看运行、工具反馈、上下文和累计用量。手工查看宿主统计或日志便于查单项原始值，但要切换视图。客户端从会话投影读取上下文与计数，另可把选定事件和状态显示为动画。完成提示音只消费当前观察到的已成功结束回合，动画状态也只是事件提示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-17](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/README.md#L9-L17)

作者说明状态与账本场景。

```text
> DeepSeek Harness Desktop 的悬浮桌面宠物、运行状态反馈与 Token / 上下文可视化插件。

DSH Token Pet 将当前请求、工具调用、上下文压缩、会话归档和提示词增强等真实 DSH 事件转化为一个常驻桌面的 Q 版角色。12 个正式逐帧动作让用户无需打开日志，就能看到系统此刻处于空闲、工作、压缩、工具完成/失败或提示词生成等状态。

它不只是动画挂件：可拖动、可缩放的三标签浮窗会展示实时上下文占用、当前模型与 Token 分类、跨会话 Lifetime Ledger、服务商/模型累计、本地时区小时趋势和索引维护状态；提示词增强抽屉支持用户主动触发、预览编辑、覆盖/追加、复制、撤回和直接提交到 DSH composer。面板只读取持久化快照，历史同步由后台增量索引维护，避免打开界面时扫描全部会话。

当前发布版本：`0.4.2` · Node.js `>=22.19`

> 本版修复了浮窗长期显示"本次有 N 个会话读取失败"的问题：**已删除/归档会话的日志不存在时不再被当作读取失败**（保留账本既有值、不再提示），并清理了会反复重试的"僵尸 live 标记"；真正的读取异常仍会提示。0.4.1 修复了局部设置事件会重置其他偏好（主题 / 成本开关 / 提示音），并新增界面截图与英文文档同步。0.4.0 新增**深色 / 浅色主题切换**、**可视化价格编辑器**、**成本估算改为默认关闭（可主动开启）**，并修复了客户端按钮文字被宿主深色样式覆盖看不清、以及皮肤 ZIP 导入导致的客户端加载失败。
```

**依据 2 · 源码核查**：[src/client/index.ts:547-564](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/index.ts#L547-L564)

当前会话投影及运行状态。

<details>
<summary>查看原文（18行）</summary>

```text
function SessionProjectionFeed(props: SessionKit) {
  const useProjection = props.useProjection
  const pressure = useProjection ? useProjection('contextPressure') : undefined
  const breakdown = useProjection ? useProjection('contextBreakdown') : undefined
  const usage = useProjection ? useProjection('tokenUsage') : undefined
  const stats = useProjection ? useProjection('sessionStats') : undefined
  const timeline = useProjection ? useProjection('contextTimeline') : undefined
  // Host contract: todayUsageBuckets projection, independent of contextTimeline.
  const todayBuckets = useProjection ? useProjection('todayUsageBuckets') : undefined
  const useSession = props.useSession
  // Actual host SessionSnapshot identity is sessionId, not id.
  const sessionId = useSession ? useSession((state) => (state as { sessionId?: string }).sessionId) : undefined
  const sessionReady = useSession ? useSession((state) => (state as { openState?: unknown }).openState === 'open') : false
  const turnTimeline = useSession ? useSession(conversationTimelineOf) : undefined
  const running = useSession ? useSession((state) => Boolean((state as { running?: unknown }).running)) : undefined
  const removed = useSession ? useSession((state) => Boolean((state as { removed?: unknown }).removed)) : undefined
  const promptError = useSession ? useSession((state) => (state as { promptError?: unknown }).promptError) : undefined
  const lastToolResult = useSession ? useSession((state) => {
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:815-837](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/index.ts#L815-L837)

投影变化驱动运行、归档和异常提示。

<details>
<summary>查看原文（23行）</summary>

```text
    if (percent !== null) contextBehavior.current = reduceContextSnapshot(contextBehavior.current, { type: 'pressure', occupancyPercent: percent, source: 'real' })
    const oldTurns = previousTurns.current
    if (turns !== null && oldTurns !== null && turns > oldTurns) {
      animation.publish({ action: 'working', dedupeKey: `working:${turns}` })
    }
    previousTurns.current = turns
    const running = snap?.running
    if (typeof running === 'boolean') {
      if (previousRunning.current !== null && running !== previousRunning.current) {
        animation.publish({ action: running ? 'working' : 'idle', dedupeKey: `session-running:${running}:${turns ?? 0}` })
      }
      previousRunning.current = running
    }
    const removed = snap?.removed
    if (typeof removed === 'boolean') {
      if (previousRemoved.current === false && removed) {
        animation.publish({ action: 'archive', dedupeKey: `session-removed:${turns ?? 0}` })
      }
      previousRemoved.current = removed
    }
    if (snap?.promptError != null && snap.promptError !== previousPromptError.current) {
      animation.publish({ action: 'warning', dedupeKey: `prompt-error:${turns ?? 0}`, payload: snap.promptError })
    }
```

</details>

**依据 4 · 源码核查**：[src/client/completion.ts:42-52](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/completion.ts#L42-L52)

仅当前被观察到且成功结束才触发完成。

<details>
<summary>查看原文（11行）</summary>

```text
    const finished = previous?.end ? previous : turn
    const endSeq = finished.end?.seq
    let result: string | null = null
    if (typeof endSeq === 'number' && Number.isSafeInteger(endSeq) && endSeq > lastEndSeq) {
      lastEndSeq = endSeq
      const observed = active !== null && active.turn === finished.turn && endSeq > active.startSeq
      active = null
      // Advance while muted too: enabling sound never replays a historical finish.
      if (observed && input.enabled && finished.end?.type === 'turn/end' && finished.end.data?.reason?.kind === 'completed') {
        result = JSON.stringify([input.sessionId, input.sessionEpoch, finished.turn, endSeq])
      }
```

</details>

#### 缺口

- 未比较盲测识别速度、提醒干扰和漏报。
  **影响**：有真实取数接线，无法据此证明任务完成或视图能替代核对原日志。
  **进一步探讨**：同一轮长任务记录事件时间、用户识别和误判。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件怎样挂载，累计账本和实时状态如何接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

包用 DSH bundle 挂 Host，Web 客户端挂 overlay 和当前会话 dock。会话事件入缓冲，flush 或 disposed 是趋势检查点的耐久性边界；增量索引同步另经合并去抖，尚无持久化索引时只处理已观察的在线或新结束会话，完整历史回填需明确建索引。Lifetime 和会话排行路由只读已持久化快照，分别暴露刷新失败与索引是否持久。该属性只适用于核过的路由，旧累计 GET 另有计算。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:83-97](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/package.json#L83-L97)

DSH bundle 和 Web 依赖。

<details>
<summary>查看原文（15行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-7](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/cordis.patch.yml#L1-L7)

插件插入宿主。

```text
# dsh-token-pet bundle patch: inserts the plugin into a profile's layer stack.
# The single `token-pet` row mounts both halves: browser pet/panel UI plus host
# snapshot routes, persistent indexes and the background maintenance coordinator.
# Install locally with: dsh plugin --profile desktop add link:<absolute-path>
- insert:
    - id: token-pet
      name: 'dsh-token-pet'
```

**依据 3 · 源码核查**：[src/client/index.ts:1078-1087](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/index.ts#L1078-L1087)

窗口与当前会话 feed 独立挂载。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.slots.inject('shell.overlay', () => ctx.slots.register(
    { name: 'shell.overlay', id: 'token-pet', order: 50, label: () => h(TokenPetLabel) },
    () => h(ErrorBoundary, null, h(TokenPetWindow)),
  ))

  // Session-scoped feed: reports live projection figures to the window.
  ctx.slots.inject('conversation.input.dock', () => ctx.slots.register(
    { name: 'conversation.input.dock', id: 'token-pet-feed', order: 50, label: () => h(TokenPetLabel) },
    (props: SessionKit) => h(SessionProjectionFeed, props),
  ))
```

</details>

**依据 4 · 源码核查**：[src/index.ts:337-377](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L337-L377)

事件缓冲、旧宿主分支与持久事件。

<details>
<summary>查看原文（41行）</summary>

```text
      const stopEvent = eventContext.on('session/event', (session, rawEvent) => {
        const sessionId = (session as { id?: unknown })?.id
        if (typeof sessionId !== 'string') return
        // Hosts whose sessionPersistence predates listSnapshots only expose
        // readFrom. The trend replayer depends on enumerable snapshots and the
        // revision key, so it cannot advance on those hosts; silently record
        // usable events for a later explicit maintenance pass instead of
        // throwing on every event (which spams the host error log).
        if (!hasListSnapshots) {
          const list = trendPending.get(sessionId) ?? [];
          const event = rawEvent as SequencedUsageEvent; if (event) list.push({ ...event, seq: typeof event.seq === 'number' ? event.seq : undefined })
          trendPending.set(sessionId, list)
          indexScheduler.notify?.()
          return
        }
        if (!trendBaselineRevisions.has(sessionId)) {
          trendBaselineRevisions.set(sessionId, persistence.listSnapshots().then(items => {
            const snapshot = items.find(item => item.header.id === sessionId)
            return snapshot ? trendRevisionKey(snapshot.revision) : undefined
          }))
        }
        const event = rawEvent as SequencedUsageEvent
        const list = trendPending.get(sessionId) ?? []; list.push(event); trendPending.set(sessionId, list)
        // Do not checkpoint on session/event: persistence may not have made that
        // sequence durable yet. session/flush/disposed are the durability fence.
      }, { global: true })
      const durableFlush = (session: unknown): Promise<void> => {
        const sessionId = (session as { id?: unknown })?.id
        // Merge + debounce an incremental index sync after every durability
        // fence. Never awaited: the fence must not stall on index work, and
        // the coordinator serializes against any running sync itself.
        if (typeof sessionId === 'string') lifetimePendingSessions.set(sessionId, ++lifetimeSessionGeneration)
        indexScheduler.notify?.()
        if (typeof sessionId !== 'string' || !trendPending.has(sessionId)) return Promise.resolve()
        // Returning this promise makes SessionStore.flush await our checkpoint.
        // We first observe persistence's changed revision, establishing that the
        // source log is durable before advancing the trend cursor.
        return flushAfterDurableFence(sessionId)
      }
      const stopFlush = eventContext.on('session/flush', durableFlush, { global: true })
      const stopDisposed = eventContext.on('session/disposed', durableFlush, { global: true })
```

</details>

**依据 5 · 源码核查**：[src/index.ts:622-654](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L622-L654)

有索引做增量，无索引避免全量回填。

<details>
<summary>查看原文（33行）</summary>

```text
          const persisted = await usageIndex.isPersisted()
          if (!ownsOperation(operation)) return
          let promise: Promise<UsageIndexBuildResult | UsageIndexIncrementResult>
          if (persisted) {
            // The readiness check and the incremental fold share this exact
            // inspection; it lists headers only and never opens a session log.
            const inspection = await refreshIndexInspection()
            if (!ownsOperation(operation)) return
            operation.progress = initialIndexProgress('syncing', inspection.pending)
            if (inspection.pending === 0 && inspection.removedIds.length === 0) {
              indexOperation = undefined; indexTerminal = undefined; indexError = undefined
              // Still give Lifetime one reconciliation chance (e.g. startup).
              void refreshLifetimeLedger()
              settleTrailingSync()
              return
            }
            promise = incrementSessionUsageIndex(sessionQuery, usageIndex, {
              signal: operation.controller.signal,
              concurrency: 2,
              yieldEvery: 1,
              inspection,
              onProgress: (next) => { if (indexOperation === operation) operation.progress = { ...next, status: 'syncing' } },
            })
          } else {
            // Full historical backfill remains explicit. Lifetime can still
            // credit live sessions and freshly closed IDs without constructing
            // the usage index or reading unrelated historical logs.
            operation.promise = refreshLifetimeLedger()
            await operation.promise
            if (ownsOperation(operation)) indexOperation = undefined
            indexTerminal = undefined; indexError = undefined
            settleTrailingSync()
            return
```

</details>

**依据 6 · 源码核查**：[src/index.ts:914-925](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L914-L925)

Lifetime 读并返回刷新状态。

<details>
<summary>查看原文（12行）</summary>

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/lifetime',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'GET') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            // Pure durable read. Opening the panel never enumerates transcripts
            // or touches the ledger lock: the background coordinator refreshes
            // the ledger after index syncs, and this GET only mirrors its
            // last outcome.
            const usage = await lifetimeLedger.usage()
            json(res, 200, { ...usage, refreshFailed: lifetimeRefreshFailed, refreshListed: lifetimeRefreshListed, refreshing: Boolean(lifetimeRefreshing) })
```

</details>

**依据 7 · 源码核查**：[src/index.ts:934-960](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L934-L960)

排行从持久索引取，会话 ID 限量返回。

<details>
<summary>查看原文（27行）</summary>

```text
      // GET: per-session totals from the durable usage index. This is a pure
      // persisted-snapshot read: it never lists or opens session logs, so the
      // "面板只读快照" constraint holds. Rows are sorted by token total desc.
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/sessions',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'GET') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            const url = typeof (req as { url?: unknown })?.url === 'string' ? new URL((req as { url: string }).url, 'http://localhost') : undefined
            const rawLimit = Number(url?.searchParams.get('limit') ?? 8)
            const limit = Math.max(1, Math.min(50, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 8))
            const persisted = await usageIndex.isPersisted()
            const entries = await usageIndex.entries()
            const rows = Object.entries(entries).map(([sessionId, entry]) => {
              let total = 0
              const totals = { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 }
              for (const cell of entry.cells) {
                total += cell.total
                totals.uncachedInputTokens += cell.totals.uncachedInputTokens
                totals.outputTokens += cell.totals.outputTokens
                totals.cacheReadTokens += cell.totals.cacheReadTokens
                totals.cacheWriteTokens += cell.totals.cacheWriteTokens
              }
              return { sessionId, total, totals }
            }).sort((a, b) => b.total - a.total).slice(0, limit)
            json(res, 200, { persisted, sessions: rows })
```

</details>

**依据 8 · 源码核查**：[src/index.ts:999-1007](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L999-L1007)

旧累计端点调用计算。

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'GET') { json(res, 405, { error: 'method not allowed' }); return }
          try { json(res, 200, await compute()) }
          catch (e) {
            const detail = e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e)
            console.error('[token-pet] /token-pet/usage failed:', detail)
```

#### 缺口

- 真实宿主版本是否提供需要的持久化投影、索引实际追赶延迟和磁盘增长未复现。
  **影响**：打开浮窗的读与后台维护不同，当前快照可以落后于本轮。
  **进一步探讨**：分别制造首次启动、首次建库、会话退出与日志修订，比较实时投影和快照刷新时间。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 归档、读失败、清空和价格估算有哪些边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

已归档或删除导致可识别的未找到错误时，Lifetime 保留已有值且不计失败，其他读错仍计失败。每会话合并历史最大值，语义是累计账本而非当前仍存在的会话总和。清空 Lifetime 要求精确确认字段，刷新发现错误则拒绝，成功后保留水位限制旧数据回灌；另有可恢复的显示偏移，不等同于清空历史。成本估计默认关闭，价格按模型精确、最长前缀或通配查找，计四类 token，以本地表计算，不能当供应商实际账单。

#### 证据与依据

**依据 1 · 源码核查**：[src/lifetime-ledger.ts:105-110](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/lifetime-ledger.ts#L105-L110)

识别 missing 与一般异常。

```text
function isMissingSession(error: unknown): boolean {
  if (!error || typeof error !== 'object') return false
  const candidate = error as { code?: unknown; cause?: unknown }
  if (candidate.code === 'SESSION_QUERY_SESSION_NOT_FOUND' || candidate.code === 'ENOENT') return true
  const cause = candidate.cause
  return Boolean(cause && typeof cause === 'object' && (cause as { code?: unknown }).code === 'ENOENT')
```

**依据 2 · 源码核查**：[src/lifetime-ledger.ts:173-205](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/lifetime-ledger.ts#L173-L205)

留存、水位计算、读错计数。

<details>
<summary>查看原文（33行）</summary>

```text
        signal?.throwIfAborted(); const id = record.header.id; const fp = sessionFingerprint(record); const prior = state.sessions[id]
        const live = Boolean(record.live)
        // Closed logs are immutable. Live logs are also safe to retain when the
        // host exposes a changing header fingerprint; reopening the panel must
        // not decompress every unchanged live transcript again.
        if (prior && sameFingerprint(prior.fingerprint, fp) && (!record.live || liveFingerprintReliable(record.header))) {
          // A session the host now reports as closed must drop its recorded live
          // flag. Hosts without a reliable live fingerprint would otherwise
          // re-read it on every refresh forever. Only the flag changes here.
          if (prior.live !== live) { state.sessions[id] = { ...prior, live }; relabeled++ }
          retained++; continue
        }
        try {
          let observed: ModelDayTotals[] | undefined
          if (!record.live && usageIndex) observed = await usageIndex.lookup(id, fp)
          if (!observed) {
            const source = await sessionQuery.readSession(id)
            const createdAt = typeof (source.session as { createdAt?: unknown })?.createdAt === 'number' ? (source.session as { createdAt: number }).createdAt : 0
            observed = foldSessionUsage(source.events, createdAt)
          }
          const monotonicObserved = mergeMaxCells(prior?.observed ?? [], observed)
          const credited = mergeMaxCells(prior?.credited ?? [], afterFloor(monotonicObserved, state.floors[id] ?? []))
          state.sessions[id] = { fingerprint: fp, live, observed: monotonicObserved, credited, updatedAt: Date.now() }; updated++
        } catch (error) {
          retained++
          // A deleted/archived session whose log is gone keeps its retained
          // values without being reported as a failed read.
          if (!isMissingSession(error)) failed++
        }
      }
      if (updated > 0 || relabeled > 0) await this.persist(state)
      const collected = this.collect(state.sessions)
      return { usage: summarizeUsageCells(collected.cells, collected.sessions), listed: records.length, updated, retained, failed }
```

</details>

**依据 3 · 源码核查**：[src/lifetime-ledger.ts:208-217](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/lifetime-ledger.ts#L208-L217)

清空后仍保留反回灌锚。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Sole destructive API. Existing sessions become anchors so only future usage is recorded. */
  async clearHistory(): Promise<CumulativeUsage> {
    return this.withLock(async () => {
      const state = await this.load(); const floors: Record<string, ModelDayTotals[]> = Object.create(null) as Record<string, ModelDayTotals[]>
      // Preserve earlier anti-replay anchors, including sessions deleted before
      // a later clear, then advance every still-observed session monotonically.
      for (const [id, floor] of Object.entries(state.floors)) floors[id] = cloneCells(floor)
      for (const [id, entry] of Object.entries(state.sessions)) floors[id] = mergeMaxCells(floors[id] ?? [], entry.observed)
      const cleared = emptyPayload(state.generation + 1); cleared.floors = floors; await this.persist(cleared)
      return summarizeUsageCells([])
```

</details>

**依据 4 · 源码核查**：[src/index.ts:971-989](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L971-L989)

精确确认和刷新失败拒绝。

<details>
<summary>查看原文（19行）</summary>

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/lifetime/clear-history',
        handler: async (req, res) => {
          const method = String((req as { method?: unknown })?.method ?? '').toUpperCase()
          if (method !== 'POST') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            const body = await readJsonBody(req)
            if (body.confirmation !== LIFETIME_CLEAR_CONFIRMATION) {
              json(res, 400, { error: 'explicit Lifetime Ledger confirmation required' })
              return
            }
            const refreshed = await lifetimeLedger.refresh(sessionQuery, undefined, usageIndex)
            if (refreshed.failed > 0) {
              json(res, 409, { error: `cannot clear Lifetime Ledger: ${refreshed.failed} session(s) failed to refresh` })
              return
            }
            const usage = await lifetimeLedger.clearHistory()
            json(res, 200, { ok: true, ...usage })
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1014-1043](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L1014-L1043)

单独显示偏移可恢复。

<details>
<summary>查看原文（30行）</summary>

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/reset',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'POST') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            const raw = await aggregateCumulativeUsage(sessionQuery, undefined, usageIndex)
            const offsets: Record<string, number> = {}
            for (const c of raw.byModelDay) {
              offsets[`${c.provider}\u0000${c.model}\u0000${c.day}`] = c.total
            }
            await baseline.reset(offsets)
            json(res, 200, { ok: true, ...await compute(raw) })
          } catch (e) {
            const detail = e instanceof Error ? `${e.message}\n${e.stack ?? ''}` : String(e)
            console.error('[token-pet] /token-pet/usage/reset failed:', detail)
            json(res, 500, { error: detail })
          }
        },
      }))

      // POST: 恢复 — revert the last 清空.
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/restore',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'POST') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            await baseline.restore()
            json(res, 200, { ok: true, ...await compute() })
```

</details>

**依据 6 · 源码核查**：[src/client/settings.ts:38-44](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/settings.ts#L38-L44)

成本估计与声音默认关闭。

```text
export const DEFAULT_SETTINGS: TokenPetSettings = {
  size: 120, position: { x: 0, y: 0 }, panelPosition: { x: 0, y: 0 }, panelWidth: 500, panelHeight: 620, animationSpeed: 1,
  lowPerformance: false, language: 'zh', completionSound: false, completionSoundTheme: 'chime', completionSoundVolume: 1,
  enhancementEnabled: true,
  enhancementTemplate: '请优化以下提示词，保留原意并提升清晰度：\n\n{{prompt}}', enhancementModel: '', skinId: 'default',
  priceTable: DEFAULT_PRICE_TABLE_JSON, currency: 'USD', costEnabled: false, budgetEnabled: false, budgetMonthly: 10,
  theme: DEFAULT_PET_THEME,
```

**依据 7 · 源码核查**：[src/client/cost.ts:98-125](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/cost.ts#L98-L125)

模型价匹配与四类 token 公式。

<details>
<summary>查看原文（28行）</summary>

```text
 * Resolve a model to its price entry: exact key, then longest `*`-suffixed
 * prefix, then the `*` fallback.
 */
export function resolvePrice(table: PriceTable, model: string): PriceEntry {
  const direct = table[model]
  if (direct) return direct
  const prefixes = Object.keys(table)
    .filter((key) => key.endsWith('*') && key.length > 1)
    .sort((a, b) => b.length - a.length)
  for (const key of prefixes) {
    if (model.startsWith(key.slice(0, -1))) return table[key] as PriceEntry
  }
  return table['*'] ?? FALLBACK_PRICE
}

/** USD cost of one token-usage snapshot under a price entry. */
export function costOfTotals(totals: CostTotals, price: PriceEntry): number {
  return (
    (totals.uncachedInputTokens / 1_000_000) * price.input +
    (totals.outputTokens / 1_000_000) * price.output +
    (totals.cacheReadTokens / 1_000_000) * price.cacheRead +
    (totals.cacheWriteTokens / 1_000_000) * price.cacheWrite
  )
}

/** USD cost of a cell row under a table. */
export function costOfCell(cell: CostCell, table: PriceTable): number {
  return costOfTotals(cell.totals, resolvePrice(table, cell.model))
```

</details>

#### 缺口

- 无真实供应商口径、历史回放和多宿主并发验证。
  **影响**：数据留存与新鲜度不同，缺失数据不能靠价格表修正。
  **进一步探讨**：以同一固定会话先对账，再模拟删除、读错、清空与不同模型价。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用条件、提示词模型调用和退出成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包要求 Node >=22.19 和 Cordis，客户端需要对应 DSH 插槽。可先关闭声音、成本和提示词增强，做非敏感当前会话观察。用户主动增强时，草稿送 Host，由 adapter 或解析到的 DSH provider 处理，无可用模型返回 503，异常返回 502。预览与发送分步，发送使用当前 composer 的 draft 和 submit，会话租约失效时拒绝写入或提交；客户端丢弃旧预览不等于取消已发起的模型调用。JSON 导出是统计快照，但包含会话标识，应按元数据看待；退出时区分禁用插件、统计留存与显式不可逆清空。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:63-71](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/package.json#L63-L71)

Node、Cordis 和依赖。

```text
  "engines": {
    "node": ">=22.19"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dependencies": {
    "fflate": "^0.8.3"
  },
```

**依据 2 · 源码核查**：[src/index.ts:763-789](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L763-L789)

草稿 POST 和 adapter 分支。

<details>
<summary>查看原文（27行）</summary>

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/prompt/enhance',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'POST') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            const body = await readJsonBody(req)
            if (typeof body.prompt !== 'string' || body.prompt.trim() === '') {
              json(res, 400, { error: 'prompt must be a non-empty string' })
              return
            }
            const template = typeof body.template === 'string' ? body.template : undefined
            // Always apply the local optimizer rules. A custom template remains
            // additional user guidance; it is never discarded or used to bypass
            // intent/constraint preservation rules.
            const request = {
              prompt: buildPromptOptimizerInput(body.prompt, template),
              template: undefined,
              provider: typeof body.provider === 'string' ? body.provider : undefined,
              model: typeof body.model === 'string' ? body.model : undefined,
            }
            const adapter = ctx.get('promptEnhancer') as PromptEnhancerService | undefined
            if (adapter && typeof adapter.enhance === 'function') {
              const result = await adapter.enhance(request)
              const enhanced = typeof result === 'string' ? result : result.enhanced
              if (typeof enhanced !== 'string') throw new Error('prompt enhancer returned no enhanced text')
              json(res, 200, { original: body.prompt, enhanced, ...(typeof result === 'string' ? {} : { model: result.model }) })
```

</details>

**依据 3 · 源码核查**：[src/index.ts:792-827](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L792-L827)

模型解析、调用和失败返回。

<details>
<summary>查看原文（36行）</summary>

```text
            const llm = ctx.get('llm') as LlmService | undefined
            const providers = llm?.listProviders?.() ?? []
            const defaults = ctx.get('agentDefaultModel') as DefaultModelService | undefined
            const defaultSelection = defaults?.currentSelection?.() ?? {}
            // An empty enhancement-model setting means the DSH default model.
            // The session timeline wins when it already exposed its routed model;
            // before the first turn, agentDefaultModel supplies that same default.
            const resolved = resolvePromptRoute(request, defaultSelection, providers)
            const provider = resolved.provider
            let model = resolved.model
            if (!model && llm && provider && typeof llm.listModels === 'function') {
              model = (await llm.listModels(provider))[0]?.id
            }
            if (!llm || !provider || !model) {
              json(res, 503, { error: 'no promptEnhancer adapter or resolvable DSH provider/model is available', provider, model })
              return
            }
            const framed = request.prompt
            let enhanced = ''
            for await (const chunk of llm.stream({
              provider,
              model,
              system: 'You improve user prompts. Preserve intent, add useful specificity, and return only the improved prompt.',
              messages: [{ role: 'user', content: [{ type: 'text', text: framed }], source: { kind: 'plugin', plugin: 'dsh-token-pet' } }],
              maxTokens: 2048,
              purpose: 'token-pet-prompt-enhance',
            })) {
              if (chunk.type === 'text-delta' && typeof chunk.text === 'string') enhanced += chunk.text
              if (chunk.type === 'finish' && chunk.reason?.kind === 'error') throw new Error(chunk.reason.failure?.message ?? 'DSH LLM enhancement failed')
            }
            if (enhanced.trim() === '') throw new Error('DSH LLM returned no enhanced text')
            json(res, 200, { original: body.prompt, enhanced: enhanced.trim(), model, provider })
          } catch (e) {
            const detail = e instanceof Error ? e.message : String(e)
            console.error('[token-pet] prompt enhancement failed:', detail)
            json(res, 502, { error: detail })
```

</details>

**依据 4 · 源码核查**：[src/client/prompt-panel.tsx:83-107](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/prompt-panel.tsx#L83-L107)

主动触发及丢弃过期预览。

<details>
<summary>查看原文（25行）</summary>

```text
  const run = async () => {
    const token = lifetime.current
    const source = preview !== null ? preview : original
    if (!token || !source.trim() || busy || sending || sent) return
    if (preview === null) originalBeforeEnhancement.current = original
    p.onAction?.('prompt-enhancing')
    setBusy(true)
    setError(null)
    setSent(false)
    try {
      const settings = loadSettings()
      const result: EnhancementResult = await enhancer.enhance(source, {
        template: resolveEnhancementTemplate(settings),
        provider: p.provider,
        model: settings.enhancementModel || p.model,
      })
      if (lifetime.current !== token) return
      setPreview(result.enhanced)
      setEnhancedApplied(false)
      p.onAction?.('prompt-ready')
    } catch (e) {
      if (lifetime.current === token) setError(e)
    } finally {
      if (lifetime.current === token) setBusy(false)
    }
```

</details>

**依据 5 · 源码核查**：[src/client/prompt.ts:27-46](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/prompt.ts#L27-L46)

检查会话租约后更新草稿和提交。

<details>
<summary>查看原文（20行）</summary>

```text
/** Uses DSH's real composer state machine: update its draft, then invoke its queue submit. */
export function createComposerPromptBridge(actions: ComposerInputActions, isCurrent: () => boolean = () => true) {
  const assertCurrent = () => {
    if (!isCurrent()) throw new PromptEnhancementError('stale')
  }
  const apply = (text: string) => { assertCurrent(); actions.setDraft(text) }
  const send = (text: string) => {
    assertCurrent()
    actions.setDraft(text)
    // Let the input machine publish the new draft before admission snapshots
    // the pending images. Some DSH builds batch the draft transition; calling
    // submit in the same stack can otherwise submit text while losing the
    // attachment rail.
    return new Promise<void>((resolve, reject) => {
      queueMicrotask(() => {
        try {
          assertCurrent()
          actions.submit()
          resolve()
        } catch (error) { reject(error) }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:941-960](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L941-L960)

导出的排行响应带 sessionId。

<details>
<summary>查看原文（20行）</summary>

```text
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'GET') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            const url = typeof (req as { url?: unknown })?.url === 'string' ? new URL((req as { url: string }).url, 'http://localhost') : undefined
            const rawLimit = Number(url?.searchParams.get('limit') ?? 8)
            const limit = Math.max(1, Math.min(50, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 8))
            const persisted = await usageIndex.isPersisted()
            const entries = await usageIndex.entries()
            const rows = Object.entries(entries).map(([sessionId, entry]) => {
              let total = 0
              const totals = { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 }
              for (const cell of entry.cells) {
                total += cell.total
                totals.uncachedInputTokens += cell.totals.uncachedInputTokens
                totals.outputTokens += cell.totals.outputTokens
                totals.cacheReadTokens += cell.totals.cacheReadTokens
                totals.cacheWriteTokens += cell.totals.cacheWriteTokens
              }
              return { sessionId, total, totals }
            }).sort((a, b) => b.total - a.total).slice(0, limit)
            json(res, 200, { persisted, sessions: rows })
```

</details>

**依据 7 · 源码核查**：[src/client/export-data.ts:32-46](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/export-data.ts#L32-L46)

导出分项响应及错误。

<details>
<summary>查看原文（15行）</summary>

```text
/** Collect the current snapshot payload; per-field failures are tolerated. */
export async function collectExportPayload(): Promise<ExportPayload> {
  const failures: string[] = []
  const [ledger, trend, sessions] = await Promise.all([
    fetchJson('/token-pet/usage/lifetime').catch(() => { failures.push('lifetime'); return null }),
    fetchJson('/token-pet/usage/trend').catch(() => { failures.push('trend'); return null }),
    fetchJson('/token-pet/usage/sessions?limit=200').catch(() => { failures.push('sessions'); return null }),
  ])
  return {
    exportedAt: new Date().toISOString(),
    app: 'dsh-token-pet',
    ledger,
    trend,
    sessions,
    failures,
```

</details>

#### 缺口

- 未实际验证宿主访问控制、模型费用、插件卸载后文件状态和并发请求。
  **影响**：纯观察成本与模型增强、全历史索引和销毁不同。
  **进一步探讨**：计动画 CPU、首次建索引时间、快照大小及每次增强 token，退出先盘点导出与本地文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 标出估计口径和账本新鲜度能否减少误解？

**研究主题**：新假设与验证

#### 完整回答

当前 Lifetime 返回刷新状态，排行返回 persisted，估计会从模型价退回前缀或通配。可以在每个数值旁标出快照更新与缺失状态，价格旁注明命中本地表的键和未经账单核对。用模拟已归档、索引旧、价格兜底与当前读数四组数据，比较用户是否误把估计当账单、误把旧数据当当前、核查耗时和信息负担。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:914-925](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L914-L925)

现有刷新状态输出。

<details>
<summary>查看原文（12行）</summary>

```text
      disposers.push(ws.register({
        kind: 'exact',
        path: '/token-pet/usage/lifetime',
        handler: async (req, res) => {
          if (String((req as { method?: unknown })?.method ?? '').toUpperCase() !== 'GET') { json(res, 405, { error: 'method not allowed' }); return }
          try {
            // Pure durable read. Opening the panel never enumerates transcripts
            // or touches the ledger lock: the background coordinator refreshes
            // the ledger after index syncs, and this GET only mirrors its
            // last outcome.
            const usage = await lifetimeLedger.usage()
            json(res, 200, { ...usage, refreshFailed: lifetimeRefreshFailed, refreshListed: lifetimeRefreshListed, refreshing: Boolean(lifetimeRefreshing) })
```

</details>

**依据 2 · 源码核查**：[src/index.ts:943-960](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/index.ts#L943-L960)

排行的持久化标记。

<details>
<summary>查看原文（18行）</summary>

```text
            const url = typeof (req as { url?: unknown })?.url === 'string' ? new URL((req as { url: string }).url, 'http://localhost') : undefined
            const rawLimit = Number(url?.searchParams.get('limit') ?? 8)
            const limit = Math.max(1, Math.min(50, Number.isFinite(rawLimit) ? Math.floor(rawLimit) : 8))
            const persisted = await usageIndex.isPersisted()
            const entries = await usageIndex.entries()
            const rows = Object.entries(entries).map(([sessionId, entry]) => {
              let total = 0
              const totals = { uncachedInputTokens: 0, outputTokens: 0, cacheReadTokens: 0, cacheWriteTokens: 0 }
              for (const cell of entry.cells) {
                total += cell.total
                totals.uncachedInputTokens += cell.totals.uncachedInputTokens
                totals.outputTokens += cell.totals.outputTokens
                totals.cacheReadTokens += cell.totals.cacheReadTokens
                totals.cacheWriteTokens += cell.totals.cacheWriteTokens
              }
              return { sessionId, total, totals }
            }).sort((a, b) => b.total - a.total).slice(0, limit)
            json(res, 200, { persisted, sessions: rows })
```

</details>

**依据 3 · 源码核查**：[src/client/cost.ts:101-125](https://github.com/Jimmy0123-ux/dsh-token-pet/blob/ca315d8b04f70770598d657629641d3437115a46/src/client/cost.ts#L101-L125)

现有价表匹配和估计。

<details>
<summary>查看原文（25行）</summary>

```text
export function resolvePrice(table: PriceTable, model: string): PriceEntry {
  const direct = table[model]
  if (direct) return direct
  const prefixes = Object.keys(table)
    .filter((key) => key.endsWith('*') && key.length > 1)
    .sort((a, b) => b.length - a.length)
  for (const key of prefixes) {
    if (model.startsWith(key.slice(0, -1))) return table[key] as PriceEntry
  }
  return table['*'] ?? FALLBACK_PRICE
}

/** USD cost of one token-usage snapshot under a price entry. */
export function costOfTotals(totals: CostTotals, price: PriceEntry): number {
  return (
    (totals.uncachedInputTokens / 1_000_000) * price.input +
    (totals.outputTokens / 1_000_000) * price.output +
    (totals.cacheReadTokens / 1_000_000) * price.cacheRead +
    (totals.cacheWriteTokens / 1_000_000) * price.cacheWrite
  )
}

/** USD cost of a cell row under a table. */
export function costOfCell(cell: CostCell, table: PriceTable): number {
  return costOfTotals(cell.totals, resolvePrice(table, cell.model))
```

</details>

#### 缺口

- 未知新增标注是否影响正常阅读或降低判断错误。
  **影响**：未实际接供应商，验证目标限于读者辨识估计口径。
  **进一步探讨**：盲测显示标签与现有界面，若判断无改善或阅读更慢则不扩大。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
