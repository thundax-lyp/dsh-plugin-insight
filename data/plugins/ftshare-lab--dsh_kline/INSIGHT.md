# dsh_kline

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[33db01b](https://github.com/FTShare-Lab/dsh_kline/tree/33db01bd64cd039644527ada43391d559cf4acb5)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FTShare-Lab/dsh_kline) [![npm 30d 296](https://img.shields.io/static/v1?label=npm+30d&message=296&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ftshare-lab/dsh-kline) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ftshare-lab/dsh-kline)
<!-- END META -->

> **功能**：在 DSH 会话中查看 K 线、分析历史形态并把绘图应用到当前图。

> **亮点**：[Q01](#research-q01) 将成功工具结果与对应会话的原生图表标签连起来。[Q02](#research-q02) 把历史候选和修改申请拆开，并核对版本和来源快照。

> **主要限制**：[Q02](#research-q02) 的形态取决于已加载日线和收盘判断，queued 还要等待真实应用。[Q03](#research-q03) 的工具目录能先于后端就绪，断线前派发的操作也可能结果未知。

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
  - [Q01 · 对话里产生的图表怎样进入对应工作台，能少做哪些事？](#detail-section-11)
  - [Q02 · 自动形态和九转依据什么数据，准备结果如何避免写到错误图表？](#detail-section-12)
  - [Q03 · 运行就绪、断线和行情凭据怎样影响采用？](#detail-section-13)
  - [Q04 · 怎样判断同窗图表是否值得采用，同时避免误用旧分析？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 对话中复盘历史 K 线的用户，希望从工具结果直接定位到同一会话图表及对应标注。

独立图表能复盘相同历史行情，仍需手工记录标的、日期及标注，再与对话来回核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 图表交接 | 从工具成功结果打开会话图表 | 依赖调用关联及宿主事件 |
| 规则候选 | 为历史 K 线生成标注 | 依赖已加载数据、时区与收盘条件 |
| 图形申请 | 将选定候选交给当前图 | 需核对图表 revision 与应用回执 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH、Node 与 Python | 是 | 挂载 MCP 和图表工作台 | 先查运行状态 |
| 固定有效历史数据 | 复盘需要 | 对照日线及规则 | 停在独立图表 |
| FTShare 或匿名数据源 | 请求新行情时 | 获取数据 | 不假定覆盖和时效 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备对照 | 用户 | 固定标的、日期、复权和参考图 | 记录来源 |
| 请求并核对 | 用户与插件 | 比对会话、标注和应用状态 | 缺准备或过期时停 |
| 退出 | 用户 | 复核运行目录和可选凭据 | 保留独立图表 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | Python 环境和依赖 | 核版本和固定数据 | 首次时延未知 |
| 持续 | 行情、模型和本地计算 | 核对来源、延迟和 revision | 真实费用未知 |
| 失败与退出 | 状态日志和测试目录 | 先判断应用状态再重试 | 关闭与残留未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同窗回看 | 成功结果按会话交接 | 真实浏览器打开时序 |
| 自动绘图 | 规则候选和版本检查 | 行情质量、规则业务价值 |
| 失败核对 | 准备、申请与未知状态 | 真实中断恢复表现 |

> **思考**：[Q02](#research-q02) 的形态取决于已加载日线和收盘判断，queued 还要等待真实应用。[Q03](#research-q03) 的工具目录能先于后端就绪，断线前派发的操作也可能结果未知。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将成功工具结果与对应会话的原生图表标签连起来。[Q02](#research-q02) 把历史候选和修改申请拆开，并核对版本和来源快照。

[Q01](#research-q01) 的工具调用关联、[Q02](#research-q02) 的准备和应用边界，以及 [Q03](#research-q03) 的结果未知状态分别针对界面、写入和进程问题。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的形态取决于已加载日线和收盘判断，queued 还要等待真实应用。[Q03](#research-q03) 的工具目录能先于后端就绪，断线前派发的操作也可能结果未知。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用固定历史样本，在隔离 profile 比较独立图表。遇 [Q02](#research-q02) 的版本冲突或 [Q03](#research-q03) 的结果未知时先回读再决定。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持图表交接、候选生成和版本化申请。真实数据质量、宿主、权限和采用效果未验证，结果提示是假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、scripts/dsh-bootstrap.mjs、scripts/dsh-mcp-plugin.mjs、scripts/run-dsh-kline.mjs、src/client/chart-handoff.ts、src/client/chart-session-resolver.ts、src/client/conversation.ts、src/client/index.tsx、src/ftshare-settings-bridge.ts、src/index.ts、tools/automatic_analysis.py、tools/chart_applications.py、tools/closed_daily.py、tools/price_patterns.py、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 DSH 挂载、事件交接、代表自动绘图、申请状态、MCP 启动和可选凭据桥。未审计全部市场、图形、宿主认证和实际行情。
- 下一步：用固定历史日线与两会话，检查重复结果、会话切换、图表 revision 和断线时回执。独立核对依赖与临时凭据。

**分析版本**

- **仓库**：[FTShare-Lab/dsh_kline](https://github.com/FTShare-Lab/dsh_kline)
- **版本号**：0.6.10（[固定提交 33db01b](https://github.com/FTShare-Lab/dsh_kline/tree/33db01bd64cd039644527ada43391d559cf4acb5)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出并列显示工具调用来源、规则截止和图表版本，验证是否减少误用旧图和人工核对。

用固定历史日线与两会话，检查重复结果、会话切换、图表 revision 和断线时回执。独立核对依赖与临时凭据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 98 | 5870 | — | — | 136038 |
| .js | source | 41 | 34111 | 33231 | 1056 | — |
| .mjs | source | 21 | 2837 | 2532 | 152 | — |
| .ts | source | 35 | 2875 | 2469 | 316 | — |
| .tsx | source | 5 | 801 | 677 | 83 | — |
| .ts | test | 46 | 6204 | 5813 | 69 | — |
| .mjs | test | 8 | 822 | 764 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/FTShare-Lab/dsh_kline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/FTShare-Lab/dsh_kline/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/FTShare-Lab/dsh_kline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在 DSH 复盘历史图表的用户，能否把一段工具分析可靠地落到当前图，并辨别数据与运行状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对话里产生的图表怎样进入对应工作台，能少做哪些事？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

常从 DSH 对话分析历史 K 线的用户，可将工具结果直接打开在同一会话，省去外部工具手动复制标的、区间和标注的步骤。插件有实际 MCP 启动器与 Web Host 两路挂载，界面优先注册宿主原生会话标签。没有原生标签时可借助 Better Sidebar，经典模式或尚无会话时保留浮动入口。界面是否打开与独立工具调用结果可分别观察。

客户端从事件窗口先建立调用 ID 到工具名的映射，再识别新版 tool-role 及旧嵌套结果，拒绝找不到调用或带错误的记录，并限制允许匹配的 K 线工具名。现代事件使用 append 区分新结果与历史加载。新图通过 Sessions 实例和当前会话键进入内存交接，新标签挂载后可取出。历史加载仍能提取引用，但不按新结果自动抢占界面；旧宿主用等待窗口近似识别，快速结果与重载仍需验收。

#### 证据与依据

**依据 1 · 源码核查**：[scripts/dsh-mcp-plugin.mjs:19-27](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/dsh-mcp-plugin.mjs#L19-L27)

构建 stdio 启动参数并挂载 MCP。

```text
  return { ...config, command: config.command || process.execPath, transport: 'stdio',
    cwd: root, args: [join(root, 'scripts', 'run-dsh-kline.mjs')] }
}

export async function apply(ctx, config) {
  const resolved = mcpConfiguration(config)
  const client = await ctx.loader.import('@deepseek-ai/dsh-mcp-client')
  ctx.plugin(client.default || client, resolved)
}
```

**依据 2 · 源码核查**：[src/client/index.tsx:24-57](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/index.tsx#L24-L57)

原生标签、旧扩展和经典入口。

<details>
<summary>查看原文（34行）</summary>

```text
  // Registered before the router paints, so the first frame already knows
  // whether the host owns a right column this plugin can put a tab in.
  const native = registerNativeSidebar(ctx, emit)
  function Router() {
    const sidebar = useSyncExternalStore(subscribe, () => service)
    const nativeTab = useSyncExternalStore(subscribe, () => native.available())
    const conversation = useSyncExternalStore(
      subscribeSessions,
      () => currentConversationId(ctx.sessions.list.getSnapshot()),
    )
    const available = nativeTab || isSidebarUsable(sidebar)
    const mode = resolveDisplayMode(preference, available)
    // A tab body lives in a Session, so before one exists the chart has no
    // tab to live in — whichever column the host owns. The classic launcher
    // covers that screen, which is what the old aria-label probe approximated
    // and only ever got right in an English UI.
    const showClassicLauncher = mode === 'classic' || conversation === undefined
    return <InterfaceContext.Provider value={{ preference, mode, available }}>
      {/* The host's own column first: it needs no third-party sidebar. */}
      {nativeTab && mode === 'better-sidebar' && <NativeSidebarBridgeView bridge={native} sessions={ctx.sessions} />}
      {!nativeTab && sidebar && <BetterSidebarBridge service={sidebar} sessions={ctx.sessions} />}
      {/* Native registration owns the tab kind now; tabs this plugin saved
          under Better Sidebar would render as "plugin not loaded". */}
      {nativeTab && sidebar && <RetireBetterSidebarTabs service={sidebar} />}
      {showClassicLauncher && <ClassicShell sessions={ctx.sessions} />}
    </InterfaceContext.Provider>
  }
  ctx.effect(() => {
    const host = document.createElement('div')
    host.dataset.dshKlineRouter = ''
    document.body.appendChild(host)
    const root = createRoot(host)
    root.render(<Router />)
    return () => { root.unmount(); host.remove(); listeners.clear() }
```

</details>

**依据 3 · 源码核查**：[src/client/conversation.ts:48-81](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/conversation.ts#L48-L81)

建立调用关联并兼容两类结果。

<details>
<summary>查看原文（34行）</summary>

```text
    const data = event?.data
    if (event?.type === 'tool/call' && typeof data?.callId === 'string') {
      calls.set(data.callId, { name: data.name, time: event.time })
    } else if (event?.type === 'tool/code-dispatch-start' && typeof data?.subCallId === 'string') {
      calls.set(data.subCallId, { name: data.name, time: event.time })
    }
  }
  for (const entry of entries) {
    if (entry.type !== 'event') continue
    const event = entry.event
    const data = event?.data
    if (event?.type === 'tool/result') {
      const message = data?.message
      // DSH 0.2 emits one first-class tool-role message per invocation. The
      // 0.1 adapter below still handles nested tool-result content blocks.
      // In both cases the invocation start supplies the trusted tool name and
      // ordering; result text alone must never claim a chart.
      if (message?.role === 'tool' && typeof message.toolCallId === 'string') {
        const call = calls.get(message.toolCallId)
        if (call) nodes.push({ kind: 'tool-result', call, callTime: call.time,
          content: message.content, isError: message.isError || !!data.error })
        continue
      }
      for (const block of data?.message?.content ?? []) {
        if (block?.type !== 'tool-result') continue
        const call = calls.get(block.toolCallId)
        if (!call) continue // Never guess a truncated call's identity.
        nodes.push({ kind: 'tool-result', call, callTime: call.time, content: block.content, isError: block.isError || !!data.error })
      }
    } else if (event?.type === 'tool/code-dispatch') {
      const call = calls.get(data?.subCallId)
      if (!call || call.name !== data.name) continue
      nodes.push({ kind: 'tool-result', call, callTime: call.time, content: data.content, isError: data.isError })
    }
```

</details>

**依据 4 · 源码核查**：[src/client/conversation.ts:86-99](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/conversation.ts#L86-L99)

只从匹配的成功工具结果提取图表引用。

<details>
<summary>查看原文（14行）</summary>

```text
export function latestChart(nodes: readonly any[]): ChartReference | undefined {
  let latest: ChartReference | undefined
  const visit = (node: any) => {
    for (const child of node.subCalls ?? []) visit(child)
    if (node.kind !== 'tool-result' || node.isError) return
    if (!/^mcp__dsh[_-]kline__(?:analyze_kline(?:_rows)?|(?:create|update|delete)_(?:(?:horizontal|trend)_line|channel|rectangle))(?:_[a-f0-9]+)?$/.test(node.call?.name ?? '')) return
    const serialized = JSON.stringify(node.content ?? [])
    const match = serialized.match(/chart_session(?:\\?"\s*:\s*\\?"|=)([A-Za-z0-9_-]{32})/)
    if (!match) return
    const order = Number(node.callTime ?? node.time ?? node.seq ?? 0)
    if (!latest || order >= latest.order) latest = { session: match[1], order }
  }
  for (const node of nodes) visit(node)
  return latest
```

</details>

**依据 5 · 源码核查**：[src/client/chart-handoff.ts:4-32](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/chart-handoff.ts#L4-L32)

区分 append，按宿主实例与会话交接。

<details>
<summary>查看原文（29行）</summary>

```text
export function observeLiveCharts(initial: SessionEventWindow) {
  let revision = initial.revision
  let previous = latestChartFromEvents(initial.entries)
  return (window: SessionEventWindow): ChartReference | undefined => {
    if (typeof window.revision !== 'number' || !window.change || window.revision === revision) return
    revision = window.revision
    const next = latestChartFromEvents(window.entries)
    const changed = next && (next.session !== previous?.session || next.order !== previous?.order)
    previous = next
    return window.change.kind === 'append' && changed ? next : undefined
  }
}

// A newly opened tab mounts after its triggering tool result. Share that live
// result within this host instance, scoped to its owning conversation. Unlike
// browser persistence, this cannot promote an old chart after a page reload.
const liveCharts = new WeakMap<Sessions, Map<string, ChartReference>>()

export function handoffLiveChart(sessions: Sessions, conversationId: string, reference: ChartReference) {
  if (currentConversationId(sessions.list.getSnapshot()) !== conversationId) return
  let charts = liveCharts.get(sessions)
  if (!charts) liveCharts.set(sessions, charts = new Map())
  const previous = charts.get(conversationId)
  if (!previous || reference.order >= previous.order) charts.set(conversationId, reference)
}

export function liveChartFor(sessions: Sessions, conversationId?: string): ChartReference | undefined {
  if (!conversationId || currentConversationId(sessions.list.getSnapshot()) !== conversationId) return
  return liveCharts.get(sessions)?.get(conversationId)
```

</details>

**依据 6 · 源码核查**：[src/client/chart-session-resolver.ts:52-71](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/chart-session-resolver.ts#L52-L71)

老宿主时间窗口和当前会话保护。

<details>
<summary>查看原文（20行）</summary>

```text
  useEffect(() => {
    // Older hosts have no event-delta metadata. Preserve their hydration
    // grace period; modern hosts distinguish history replacements from live
    // appends explicitly and do not discard fast results in this window.
    const timer = window.setTimeout(() => { readyForNewCharts.current = true }, 350)
    return () => { window.clearTimeout(timer) }
  }, [conversationId])
  useEffect(() => {
    if (!conversationId || !discovered || (reference && reference.order >= discovered.order)) return
    if(reference?.recovery && reference.recoverySourceSessions?.includes(discovered.session))return
    setReference(discovered)
    // Reveal only a result that appeared after this hook mounted. Merely
    // reopening historical messages must not override the Market launcher.
    const explicitLive = liveEvent.current?.session === discovered.session && liveEvent.current?.order === discovered.order
    const legacyLive = events.revision === undefined && readyForNewCharts.current && discovered.session !== initialChartSession.current
    if ((explicitLive || legacyLive)
      && currentConversationId(sessions.list.getSnapshot()) === conversationId) {
      handoffLiveChart(sessions, conversationId, discovered)
      onNewChart?.(discovered)
    }
```

</details>

#### 缺口

- 未运行真实 0.2 宿主或测试新结果、切会话和重载。
  **影响**：可以核实同窗接线，不能保证真实宿主的界面时序。
  **进一步探讨**：用两个会话分别加载历史和追加固定结果，核对自动打开的标的与归属。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动形态和九转依据什么数据，准备结果如何避免写到错误图表？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

自动绘图注册表给不同函数规定参数、默认值和候选类型。分析入口读取已加载 K 线，数据不是列表时直接报错，源码没有为这一入口补取行情。形态与九转的收盘过滤要求单日线，按市场时区、收盘时刻与来源可信程度排除未来、当前未收盘或日界语义不明的记录。未知市场保守排除 UTC 当天；形态规则还保存候选、价格确认、失效等状态以及无法核实的成交量。它描述按既定规则如何标注历史，不能用来推断回测或交易表现。

分析结果和修改申请分离。apply 侧持有同一视图的准备锁，检查候选属于当前会话与视图、预期 revision、成功准备 journal 和源快照对齐。相同候选已有非 queued 状态会返回已有状态，另一个未确认申请存在时拒绝覆盖。进入 queued 只表示申请写入记录，真正图表应用还需客户端确认。适合需要从历史候选定位图形的用户，失败后应先检查状态而非盲目重发。

#### 证据与依据

**依据 1 · 源码核查**：[tools/automatic_analysis.py:31-65](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/automatic_analysis.py#L31-L65)

统一参数、默认值及缺已加载数据的错误。

<details>
<summary>查看原文（35行）</summary>

```text
AUTOMATIC_ANALYSES = {
    "recent_drawing_candidates": AnalysisSpec(("drawing_type",), ("lookback_bars", "max_candidates"), "first_candidate",
        {"lookback_bars": 120, "max_candidates": 5}),
    "channel_candidates": AnalysisSpec((), ("direction", "scope", "lookback_bars", "left_bars", "right_bars", "min_span_bars", "max_candidates", "closed_daily_only"), "first_candidate",
        {"direction": "both", "scope": "current", "lookback_bars": 120, "left_bars": 2, "right_bars": 2, "min_span_bars": 12, "max_candidates": 3}, "3", "channel"),
    "range_candidates": AnalysisSpec((), ("window_sizes", "max_candidates", "closed_daily_only"), "first_candidate",
        {"window_sizes": list(DEFAULT_WINDOW_SIZES), "max_candidates": 3}, drawing_kind="rectangle"),
    "price_pattern_candidates": AnalysisSpec((), ("pattern_types", "lookback_bars", "max_candidates", "anchor_times"), "first_candidate",
        {"pattern_types": list(PATTERN_TYPES), "lookback_bars": 240, "max_candidates": 5}, drawing_kind="price_pattern"),
    "nine_count": AnalysisSpec((), ("display_bars",), "whole_sequence", {"display_bars": 120}),
}

RECENT_DRAWING_KINDS = {"horizontal_line": "horizontal", "trend_line": "trend",
                        "fibonacci_retracement": "fibonacci", "labeled_polyline": "abc"}


def analyze_automatic(function: str, candles: list[dict[str, Any]], *,
                      symbol: str, interval: str, source_interval: str | None,
                      interval_value: int | None, provider: str | None,
                      volume_unit: str | None = None,
                      parameters: dict[str, Any] | None = None) -> tuple[dict[str, Any], dict[str, Any]]:
    """Return (summary, normalized parameters), without modifying a chart."""
    spec = AUTOMATIC_ANALYSES.get(function)
    if spec is None:
        raise LineError("unknown_chart_function", "未知自动绘图分析函数。")
    values = dict(parameters or {})
    if values.keys() - set(spec.required + spec.optional):
        raise LineError("invalid_function_parameters", "参数不适用于该分析函数。")
    if any(key not in values or values[key] is None for key in spec.required):
        raise LineError("missing_anchor", "缺少必要的绘图类型。")
    effective = {**spec.defaults, **{key: value for key, value in values.items() if value is not None}}
    if not isinstance(candles, list):
        code = ("channel_candidate_data_unavailable" if function == "channel_candidates" else
                "range_candidate_data_unavailable" if function == "range_candidates" else "daily_analysis_unavailable")
        raise LineError(code, "当前图缺少可核对的已加载K线，未补取行情。")
```

</details>

**依据 2 · 源码核查**：[tools/closed_daily.py:22-68](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/closed_daily.py#L22-L68)

收盘和数据语义检查。

<details>
<summary>查看原文（47行）</summary>

```text
def closed_daily(rows, *, symbol: str, interval: str, source_interval: str | None = None,
                 interval_value: int | None = 1, provider: str | None = None,
                 now: datetime | None = None):
    if interval != "day" or source_interval not in {None, "day"} or interval_value != 1:
        raise LineError("daily_analysis_only", "形态与九转首版仅支持单日线；请在当前图切换后重新分析。")
    try:
        candles = validate_rows(rows, min_len=1)
    except RowsValidationError:
        raise LineError("daily_analysis_unavailable", "当前图缺少有效的已加载日线。") from None
    market = market_for_symbol(symbol)
    clock = now or datetime.now(timezone.utc)
    if clock.tzinfo is None:
        raise ValueError("now must be timezone-aware")
    quality = []
    if market is None:
        quality.append("market_unknown_current_day_excluded")
        # UTC prior days are surely historical regardless of the exchange zone.
        cutoff_date = clock.astimezone(timezone.utc).date()
        accepted = [r for r in candles if datetime.fromtimestamp(r["time"], timezone.utc).date() < cutoff_date]
        return accepted, {"market": None, "timezone": None, "as_of": accepted[-1]["time"] if accepted else None,
                          "quality": quality, "excluded": len(candles) - len(accepted)}
    zone, close_time = MARKETS[market]
    local = clock.astimezone(zone)
    accepted = []
    for row in candles:
        bar = datetime.fromtimestamp(row["time"], zone)
        utc_day = datetime.fromtimestamp(row["time"], timezone.utc).date()
        if bar.date() < local.date() and utc_day == local.date():
            # A date-only UTC-midnight stamp for today's US session appears as
            # yesterday evening in New York. It is not proof of a closed bar.
            quality.append("date_semantics_uncertain_current_day_excluded")
        elif bar.date() < local.date():
            accepted.append(row)
        elif bar.date() > local.date():
            quality.append("future_daily_bar_excluded")
        elif provider in {None, "unknown", "external"}:
            quality.append("source_unknown_current_day_excluded")
        elif bar.time() < time(9, 0) or bar.time() > time(23, 0):
            quality.append("date_semantics_uncertain_current_day_excluded")
        elif local.time() >= close_time:
            accepted.append(row)
        else:
            quality.append("current_day_not_conservatively_closed")
    return accepted, {"market": market, "timezone": zone.key,
                      "as_of": accepted[-1]["time"] if accepted else None,
                      "quality": sorted(set(quality)), "excluded": len(candles) - len(accepted),
                      "cutoff_local": close_time.strftime("%H:%M")}
```

</details>

**依据 3 · 源码核查**：[tools/price_patterns.py:115-159](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/price_patterns.py#L115-L159)

形态状态及成交量未知分支。

<details>
<summary>查看原文（45行）</summary>

```text
    def event(name):
        item["events"].append({"type": name, "time": row["time"], "index": index})
    if item["confirmed_index"] is None:
        if item["type"] != "platform" and ((item["direction"] == "down" and row["high"] > item["outer"] + item["buffer"])
                                                 or (item["direction"] == "up" and row["low"] < item["outer"] - item["buffer"])):
            item["status"] = "structurally_invalid"; item["invalidated_at"] = row["time"]; event("structurally_invalid"); return
        if index - item["available_index"] > 60:
            item["status"] = "expired"; item["invalidated_at"] = row["time"]; event("expired"); return
        direction = item.get("pending_direction") or item["direction"]
        if item["pending_direction"] and _outside(item, row, index, direction):
            item["status"] = "price_confirmed"; item["confirmed_at"] = row["time"]
            item["confirmed_index"] = index; item["break_direction"] = direction
            item["pending_direction"] = None; event("price_confirmed")
            return
        if item["pending_direction"]:
            item["pending_direction"] = None; item["status"] = "candidate"; event("pending_cancelled")
        directions = ("up", "down") if item["type"] == "platform" else (item["direction"],)
        for side in directions:
            if _outside(item, row, index, side):
                item["pending_direction"] = side; item["status"] = "pending_confirmation"; event("pending_confirmation"); break
        return
    age = index - item["confirmed_index"]
    if age > 20 or item["followup_complete"]:
        return
    if _reclaimed(item, row, index):
        item["reclaim_count"] += 1
        if item["reclaim_count"] == 2:
            item["status"] = "breakout_failed"; item["invalidated_at"] = row["time"]; event("breakout_failed")
            return
    else:
        item["reclaim_count"] = 0
    if age == 20:
        item["followup_complete"] = True; event("followup_complete")


def _volume_evidence(rows, item, provider, volume_unit):
    if provider not in {"ftshare", "eastmoney_free", "tencent_free", "builtin_free"} or volume_unit not in {"shares", "lots"}:
        return {"status": "unknown", "reason": "source_or_unit_unverified"}
    i = item["confirmed_index"]
    if i is None or i < 20:
        return {"status": "unknown", "reason": "insufficient_preceding_volume"}
    baseline = [r["volume"] for r in rows[i - 20:i]]
    if any(not isfinite(x) or x < 0 for x in baseline) or sum(baseline) <= 0:
        return {"status": "unknown", "reason": "volume_unavailable"}
    return {"status": "known", "relative_to_preceding_20": rows[i]["volume"] / (sum(baseline) / 20),
```

</details>

**依据 4 · 源码核查**：[tools/chart_applications.py:141-175](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/chart_applications.py#L141-L175)

确认来源、锁及同一候选与视图绑定。

<details>
<summary>查看原文（35行）</summary>

```text
def confirmed_source(payload: dict, context: dict, token: str) -> bool:
    guard = payload.get("drawing_guard") or {}
    try: proof = read_application(guard.get("context_ref"), token)
    except LineError: return False
    return (proof["status"] == "applied" and proof.get("confirmed_chart_session") == token
            and proof.get("conversation_id") == context.get("conversation_id") == guard.get("conversation_id")
            and proof.get("view_id") == guard.get("view_id") and proof.get("request_id") == guard.get("request_id"))


def request_chart_apply(context_ref: str, candidate: str) -> dict:
    path = application_path(context_ref, candidate)
    directory = path.parent.parent
    directory.mkdir(mode=0o700, parents=True, exist_ok=True)
    lock = directory / "prepare.lock"
    try: descriptor = os.open(lock, os.O_CREAT | os.O_EXCL | os.O_WRONLY, 0o600)
    except FileExistsError:
        raise LineError("chart_edit_busy", "该视图正在准备或申请应用，未并行修改。") from None
    os.close(descriptor)
    try:
        if path.exists():
            existing = read_application(context_ref, candidate)
            # Same immutable candidate has one delivery, including after a lost reply.
            if existing["status"] != "queued": return application_status(existing)
        else: existing = None
        context = read_chart_context(context_ref, candle_scope="loaded", limit=4000)
        if not context.get("guarded_apply_supported"):
            raise LineError("chart_apply_protocol_unavailable", "该网页尚未声明支持应用协议，请更新/重载插件网页；未发送修改指令。")
        payload = chart_service.read_chart_snapshot(candidate)
        guard = payload.get("drawing_guard") if payload else None
        if (not isinstance(guard, dict) or guard.get("protocol") != "prepared-only-v1"
            or guard.get("context_ref") != context_ref or guard.get("conversation_id") != context["conversation_id"]
            or guard.get("view_id") != context["view_id"]):
            raise LineError("invalid_chart_application", "候选不属于当前视图的准备请求，未申请应用。")
        if context["revision"] != guard.get("expected_revision"):
            raise LineError("chart_context_revision_conflict", "准备后当前图版本已变化，未申请应用。")
```

</details>

**依据 5 · 源码核查**：[tools/chart_applications.py:176-203](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/chart_applications.py#L176-L203)

准备记录、源对齐、未确认保护和 queued 持久化。

<details>
<summary>查看原文（28行）</summary>

```text
        journal = _read(directory / "journal.json")
        entries = journal.get("entries")
        if not isinstance(entries, list) or not any(e.get("status") == "prepared" and e.get("request_id") == guard.get("request_id")
            and isinstance(e.get("result"), dict) and e["result"].get("chart_session") == candidate for e in entries if isinstance(e, dict)):
            raise LineError("chart_edit_outcome_unknown", "未找到成功准备记录，不能申请应用。")
        source = chart_service.read_chart_snapshot(guard.get("chart_session"))
        if source is None: raise LineError("chart_session_not_found", "原始来源快照不可用。")
        from tools.chart_edits import require_alignment
        require_alignment(context, source, guard["chart_session"], guard["symbol"])
        pending = directory / "pending.json"
        if pending.exists():
            old_token = _read(pending).get("candidate_chart_session")
            if old_token != candidate:
                old = read_application(context_ref, old_token)
                if old["status"] not in {"applied", "rejected", "failed"}:
                    raise LineError("chart_apply_busy", "该视图有等待或结果未确认的应用，不能覆盖它。")
        if existing is None:
            observation = _read(chart_service.RUNTIME_DIR / "views" / str(chart_service.HOST_PROCESS_ID) / (context_ref + ".json"))
            if observation.get("revision") != guard["expected_revision"] or observation.get("view_id") != guard["view_id"]:
                raise LineError("chart_context_revision_conflict", "读取期间当前图版本已变化，未申请应用。")
            now = int(time.time() * 1000)
            existing = {"host_process_id": chart_service.HOST_PROCESS_ID, "context_ref": context_ref,
                "candidate_chart_session": candidate, "conversation_id": context["conversation_id"], "view_id": context["view_id"],
                "expected_revision": guard["expected_revision"], "request_id": guard["request_id"], "status": "queued",
                "created_at_ms": now, "expires_at_ms": now + 30000, "base_state": observation["state"]}
            chart_service._atomic_runtime_json(path, existing)
        chart_service._atomic_runtime_json(pending, {"candidate_chart_session": candidate})
        return application_status(existing)
```

</details>

#### 缺口

- 未验证时间戳映射、跨市场实际行情质量和真实浏览器提交。
  **影响**：不能将规则输出视为真实图表已修改或投资建议。
  **进一步探讨**：用固定日线样例检查提前收盘、未知源和过期候选，并分别核对准备、申请与界面确认。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 运行就绪、断线和行情凭据怎样影响采用？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

外部 MCP 由 Node 启动器先响应 initialize 与 tools/list，Python 未就绪时工具调用可能等候或返回准备状态。后端准备会选择或重建虚拟环境、用 pip 安装并核对依赖导入及指纹。因此显示工具目录只证明 Node 接线已启动。Python 中断后对已派发调用明确回报 outcome_unknown，未派发的准备失败另报；恢复后需要用户根据状态决定下一步。首装可能写虚拟环境和日志并需要网络。

行情可由 FTShare 或部分匿名历史源取得，作者指出公开源覆盖与延迟条件。Host 可将 FTShare 设置密钥桥接给 Python，在运行目录按 Host 进程发布文件；源码以随机临时目录、限制权限和 rename 写入，清理时取消订阅并删除文件。POSIX 权限处理和 Windows 实际保护不等价，且异常退出后的残留还需核验。试用可先用固定已加载数据，避免把行情请求、外部订阅和规则验证混成一次成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:114-124](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/package.json#L114-L124)

Node 与启动及构建命令。

<details>
<summary>查看原文（11行）</summary>

```text
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": ">=22.19.0"
  },
  "scripts": {
    "bootstrap": "node ./scripts/run-dsh-kline.mjs --prepare-project",
    "pack:release": "node ./scripts/build-release-package.mjs ./release/dsh-kline-v0.6.10.tgz",
    "pack:codex": "node ./scripts/build-codex-package.mjs ./release/ft-kline-v0.6.10.zip && node ./scripts/verify-codex-package.mjs ./release/ft-kline-v0.6.10.zip",
    "smoke:codex-package": "python ./scripts/smoke-codex-package.py ./release/ft-kline-v0.6.10.zip",
    "generate:client-view": "node ./scripts/generate-client-view.mjs",
    "build:sidebar": "pnpm generate:client-view && tsc -p tsconfig.json && tsdown --config tsdown.config.ts && pnpm verify:package",
```

</details>

**依据 2 · 源码核查**：[scripts/dsh-bootstrap.mjs:44-57](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/dsh-bootstrap.mjs#L44-L57)

已派发和未执行的状态区别。

<details>
<summary>查看原文（14行）</summary>

```text
  const unavailable = (id, dispatched = false) => reply(id, {
    content: [{ type: 'text', text: dispatched
      ? '后端连接中断，操作结果未知。请先核对当前状态，不要自动重放操作。'
      : ready ? '后端已恢复，请重新发起操作。' : 'Python 正在准备或恢复。此操作尚未执行，请就绪后重试。' }],
    structuredContent: { ...status(), ok: false, error: dispatched ? 'runtime_connection_lost' : lastError || 'runtime_preparing',
      operation_dispatched: dispatched, outcome_unknown: dispatched }, isError: true,
  })
  const cancelQueued = id => {
    const item = queued.get(id)
    if (item) { clearTimeout(item.timer); queued.delete(id) }
  }
  const forward = message => {
    if (message.id != null && message.method) inFlight.set(message.id, message)
    child.stdin.write(`${JSON.stringify(message)}\n`)
```

</details>

**依据 3 · 源码核查**：[scripts/dsh-bootstrap.mjs:72-83](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/dsh-bootstrap.mjs#L72-L83)

后端退出时标记未知。

<details>
<summary>查看原文（12行）</summary>

```text
  const down = (generation, reason) => {
    if (closed || child !== generation) return
    ready = false; child = undefined; lastError = reason
    clearTimeout(handshakeTimer)
    lines?.close()
    terminate(generation)
    for (const [id, message] of inFlight) {
      if (message.method === 'tools/call') unavailable(id, true)
      else protocolError(id, -32603, 'Backend connection lost; request was not replayed')
    }
    inFlight.clear()
    for (const id of queued.keys()) { cancelQueued(id); unavailable(id) }
```

</details>

**依据 4 · 源码核查**：[scripts/dsh-bootstrap.mjs:150-174](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/dsh-bootstrap.mjs#L150-L174)

完整目录与后端准备分离。

<details>
<summary>查看原文（25行）</summary>

```text
    if (message.method === 'initialize' && !init) {
      init = message
      reply(message.id, { protocolVersion: message.params?.protocolVersion || '2024-11-05',
        capabilities: { tools: { listChanged: false } }, serverInfo: { name: 'dsh_kline', version: catalog.version },
        instructions: `${catalog.instructions}\nThe complete tool catalog is available during preparation. Retry calls reporting runtime_preparing only after readiness; never replay operations with unknown outcomes.` })
      start(); return
    }
    if (message.method === 'ping') { reply(message.id, {}); return }
    if (!init) { if (message.id != null) protocolError(message.id, -32002, 'Initialize the server first'); return }
    if (message.method === 'tools/list') reply(message.id, { tools: [...catalog.tools, runtimeTool] })
    else if (message.method === 'resources/list') reply(message.id, { resources: [] })
    else if (message.method === 'resources/templates/list') reply(message.id, { resourceTemplates: [] })
    else if (message.method === 'tools/call' && message.params?.name === runtimeTool.name) {
      reply(message.id, { content: [{ type: 'text', text: JSON.stringify(status()) }], structuredContent: status(), isError: false })
    } else if (message.method === 'notifications/initialized') { /* Child has its own handshake. */ }
    else if (message.method === 'notifications/cancelled') {
      if (queued.has(message.params?.requestId)) cancelQueued(message.params.requestId)
      else if (ready) { inFlight.delete(message.params?.requestId); forward(message) }
    } else if (message.method === 'tools/call' && !catalog.tools.some(tool => tool.name === message.params?.name)) protocolError(message.id, -32602, 'Unknown tool')
    else if (ready) forward(message)
    else if (message.method === 'tools/call') {
      if (queued.has(message.id)) return
      const timer = setTimeout(() => { queued.delete(message.id); unavailable(message.id) }, preparationWaitMs)
      queued.set(message.id, { message, timer })
    } else if (message.id != null) protocolError(message.id, -32002, 'Python backend is preparing or recovering')
```

</details>

**依据 5 · 源码核查**：[scripts/run-dsh-kline.mjs:384-418](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/run-dsh-kline.mjs#L384-L418)

虚拟环境和依赖安装及核验。

<details>
<summary>查看原文（35行）</summary>

```text
async function prepareRuntime(venvDirectory, fingerprint, logPath, preferredPython = '', clearExisting = false) {
  await mkdir(dirname(venvDirectory), { recursive: true })
  await mkdir(dirname(logPath), { recursive: true })
  await writeFile(logPath, '', { encoding: 'utf8', mode: 0o600 })
  const runtimePython = pythonPathForVenv(venvDirectory)
  const reusable = !clearExisting && await pathExists(runtimePython)
    && commandPasses(runtimePython, [], VERSION_CHECK) && await venvInterpreterMatches(venvDirectory, runtimePython)
    && (commandPasses(runtimePython, [], 'import pip') || commandPasses(runtimePython, [], 'import ensurepip'))
  if (reusable) {
    process.stderr.write('[dsh_kline] Reusing the existing Python environment.\n')
    if (!commandPasses(runtimePython, [], 'import pip')) await bootstrapStep('PYTHON_VENV_UNAVAILABLE',
      'Cannot prepare pip in the existing environment', runtimePython, ['-m', 'ensurepip', '--upgrade'], logPath)
  } else {
    const base = await findBootstrapPython(venvDirectory, logPath, preferredPython)
    process.stderr.write('[dsh_kline] Creating or repairing the Python environment…\n')
    // Python -m venv does not replace an existing interpreter when upgrading
    // across Python versions. Clear any unusable venv before creating it again.
    const replaceExisting = clearExisting || await pathExists(runtimePython)
    const venvArgs = [...base.args, '-m', 'venv', ...(replaceExisting ? ['--clear'] : []), venvDirectory]
    const venvMs = await bootstrapStep('PYTHON_VENV_UNAVAILABLE', 'Cannot create or repair the virtual environment', base.command, venvArgs, logPath)
    process.stderr.write(`[dsh_kline] Python environment ready in ${Math.ceil(venvMs / 1000)}s.\n`)
  }
  process.stderr.write('[dsh_kline] Installing dependencies…\n')
  // Isolate pip from a user's config (notably `user = true`, which makes a
  // venv install fail before it can write the ready stamp).
  const dependenciesMs = await bootstrapStep('PYTHON_DEPENDENCY_INSTALL_FAILED', 'Dependency installation failed',
    runtimePython, ['-m', 'pip', '--isolated', 'install', '-r', REQUIREMENTS_FILE], logPath)
  process.stderr.write(`[dsh_kline] Dependencies ready in ${Math.ceil(dependenciesMs / 1000)}s.\n`)
  process.stderr.write('[dsh_kline] Verifying the runtime…\n')
  await bootstrapStep('PYTHON_IMPORT_CHECK_FAILED', 'Installed dependency verification failed',
    runtimePython, ['-c', await dependencyImportCheck()], logPath)
  await writeStamp(venvDirectory, fingerprint)
  await rm(join(venvDirectory, BOOTSTRAP_FAILURE), { force: true })
  if (!(await stampMatches(venvDirectory, fingerprint))) {
    throw new Error('Dependency fingerprint was not persisted; refusing to report a ready runtime.')
```

</details>

**依据 6 · 源码核查**：[src/ftshare-settings-bridge.ts:78-112](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/ftshare-settings-bridge.ts#L78-L112)

密钥同步、轮换及关闭。

<details>
<summary>查看原文（35行）</summary>

```text
export function startFtshareSettingsBridge(options: FtshareSettingsBridgeOptions): FtshareSettingsBridge {
  const hostPid = options.hostPid ?? process.pid
  if (!Number.isSafeInteger(hostPid) || hostPid <= 0) throw new Error('invalid host process id')
  const file = settingsCredentialFile(options.runtimeDirectory, hostPid)
  const directory = dirname(file)
  let pending: Promise<void> = Promise.resolve()
  let disposed = false

  const sync = async (): Promise<void> => {
    const key = usableKey(await options.settings.apiKey.resolve())
    if (disposed) return
    if (key) await writeCredentialFile(file, key)
    else await withdrawCredentialFile(file)
  }
  const schedule = (): Promise<void> => {
    pending = pending.then(sync, sync).catch(async () => {
      // Failed resolution/rotation must not leave a previously published key
      // active. Never include provider exception text: it may contain a key.
      await withdrawCredentialFile(file).catch(() => {})
      try { options.warn?.('FTShare settings credential publication failed') } catch {}
    })
    return pending
  }

  const unsubscribe = options.settings.apiKey.subscribe(() => { void schedule() })
  void pruneCredentialDirectory(directory, hostPid).catch(() => {})
  void schedule()

  return {
    async dispose(): Promise<void> {
      disposed = true
      unsubscribe()
      await pending.catch(() => {})
      await withdrawCredentialFile(file).catch(() => {})
    },
```

</details>

**依据 7 · 源码核查**：[src/ftshare-settings-bridge.ts:127-145](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/ftshare-settings-bridge.ts#L127-L145)

暂存与文件权限。

<details>
<summary>查看原文（19行）</summary>

```text
async function writeCredentialFile(file: string, key: string): Promise<void> {
  const directory = dirname(file)
  await mkdir(directory, { recursive: true, mode: 0o700 })
  const info = await lstat(directory)
  if (!info.isDirectory() || info.isSymbolicLink()) throw new Error('unsafe credential directory')
  await restrict(directory, 0o700)
  // Exclusive random directory prevents following a pre-created temporary
  // symlink and keeps concurrent publishers from sharing a staging file.
  const staging = await mkdtemp(join(directory, `.${basename(file)}.`))
  const temporary = join(staging, 'credential.json')
  try {
    await restrict(staging, 0o700)
    await writeFile(temporary, JSON.stringify({ version: 1, api_key: key }), { mode: 0o600, flag: 'wx' })
    await restrict(temporary, 0o600)
    await rename(temporary, file)
    await restrict(file, 0o600)
  } finally {
    await rm(staging, { recursive: true, force: true }).catch(() => {})
  }
```

</details>

**依据 8 · 作者声明**：[README.md:153-158](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/README.md#L153-L158)

作者给出行情范围及延迟。

```text
- **行情来源：** 可接入 FTShare；在「设置 → 数据源」配置并测试 Key。无 Key 时可尝试部分 A 股、港美股历史日 K 和指数备用行情，覆盖与可用性取决于公开源。
- **权限与周期：** 分钟线、新闻和公司资料取决于来源与权限。自动绘图、价格形态与九转当前使用已加载的 A／港／美股已收盘日线。
- **修改边界：** 绘图使用当前图真实 K 线。数据来源不明、结果过期或活动视图存在歧义时，会停止修改并说明原因；鼠标拖拽改点与撤销暂不支持。
- **保存范围：** DSH 自选与分组跨对话保留。Codex 图表、自选及应用内临时 Key 保存在当前连接内存中，不继承 DSH 配置；绘图不保证跨服务重启恢复。

行情可能延迟。形态与计数用于研究和复盘，不保证交易收益。数据覆盖见[无 Key 支持范围](docs/anonymous-market-support.md)与[港美股免费日线](docs/free-foreign-daily.md)。
```

#### 缺口

- 未安装或测虚拟环境、供应商数据、凭据权限、成本或系统差异。
  **影响**：只能给出固定数据的小范围试验，不能承诺实时覆盖。
  **进一步探讨**：使用无真实凭据的隔离运行目录和静态数据检查准备、退出和断线回执。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样判断同窗图表是否值得采用，同时避免误用旧分析？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

建议需要用 DSH 复盘历史图表的用户，在可丢弃 profile 以固定历史样本试一张图。对照用独立绘图工具手工记录标的、日期、复权口径和标注，检查同窗工具是否能把正确结果打开在对应会话，并明确显示规则截止和应用状态。没有真实数据或凭据时，优先验证可追溯的视图与日线规则。遇到数据来源、图表 revision 或状态无法核对，先看独立图表与原记录。断线后确认是否已应用再重试。

待验证假设是在图表打开时并列显示工具调用、规则截止和当前数据版本，能减少历史引用被误读为当前结果。对照现有工作台，用切会话、图表刷新和延迟数据样本测错用和人工核对步骤。若信息提示未减少错用，或相比独立图表增加更多步骤，就维持原流程。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/chart-handoff.ts:17-33](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/src/client/chart-handoff.ts#L17-L33)

交接只在匹配会话及宿主实例内。

<details>
<summary>查看原文（17行）</summary>

```text
// A newly opened tab mounts after its triggering tool result. Share that live
// result within this host instance, scoped to its owning conversation. Unlike
// browser persistence, this cannot promote an old chart after a page reload.
const liveCharts = new WeakMap<Sessions, Map<string, ChartReference>>()

export function handoffLiveChart(sessions: Sessions, conversationId: string, reference: ChartReference) {
  if (currentConversationId(sessions.list.getSnapshot()) !== conversationId) return
  let charts = liveCharts.get(sessions)
  if (!charts) liveCharts.set(sessions, charts = new Map())
  const previous = charts.get(conversationId)
  if (!previous || reference.order >= previous.order) charts.set(conversationId, reference)
}

export function liveChartFor(sessions: Sessions, conversationId?: string): ChartReference | undefined {
  if (!conversationId || currentConversationId(sessions.list.getSnapshot()) !== conversationId) return
  return liveCharts.get(sessions)?.get(conversationId)
}
```

</details>

**依据 2 · 源码核查**：[tools/closed_daily.py:43-68](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/closed_daily.py#L43-L68)

输出市场时区、截止与排除条件。

<details>
<summary>查看原文（26行）</summary>

```text
    zone, close_time = MARKETS[market]
    local = clock.astimezone(zone)
    accepted = []
    for row in candles:
        bar = datetime.fromtimestamp(row["time"], zone)
        utc_day = datetime.fromtimestamp(row["time"], timezone.utc).date()
        if bar.date() < local.date() and utc_day == local.date():
            # A date-only UTC-midnight stamp for today's US session appears as
            # yesterday evening in New York. It is not proof of a closed bar.
            quality.append("date_semantics_uncertain_current_day_excluded")
        elif bar.date() < local.date():
            accepted.append(row)
        elif bar.date() > local.date():
            quality.append("future_daily_bar_excluded")
        elif provider in {None, "unknown", "external"}:
            quality.append("source_unknown_current_day_excluded")
        elif bar.time() < time(9, 0) or bar.time() > time(23, 0):
            quality.append("date_semantics_uncertain_current_day_excluded")
        elif local.time() >= close_time:
            accepted.append(row)
        else:
            quality.append("current_day_not_conservatively_closed")
    return accepted, {"market": market, "timezone": zone.key,
                      "as_of": accepted[-1]["time"] if accepted else None,
                      "quality": sorted(set(quality)), "excluded": len(candles) - len(accepted),
                      "cutoff_local": close_time.strftime("%H:%M")}
```

</details>

**依据 3 · 源码核查**：[tools/chart_applications.py:165-180](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/tools/chart_applications.py#L165-L180)

过期和缺准备回执可明确观察。

<details>
<summary>查看原文（16行）</summary>

```text
        context = read_chart_context(context_ref, candle_scope="loaded", limit=4000)
        if not context.get("guarded_apply_supported"):
            raise LineError("chart_apply_protocol_unavailable", "该网页尚未声明支持应用协议，请更新/重载插件网页；未发送修改指令。")
        payload = chart_service.read_chart_snapshot(candidate)
        guard = payload.get("drawing_guard") if payload else None
        if (not isinstance(guard, dict) or guard.get("protocol") != "prepared-only-v1"
            or guard.get("context_ref") != context_ref or guard.get("conversation_id") != context["conversation_id"]
            or guard.get("view_id") != context["view_id"]):
            raise LineError("invalid_chart_application", "候选不属于当前视图的准备请求，未申请应用。")
        if context["revision"] != guard.get("expected_revision"):
            raise LineError("chart_context_revision_conflict", "准备后当前图版本已变化，未申请应用。")
        journal = _read(directory / "journal.json")
        entries = journal.get("entries")
        if not isinstance(entries, list) or not any(e.get("status") == "prepared" and e.get("request_id") == guard.get("request_id")
            and isinstance(e.get("result"), dict) and e["result"].get("chart_session") == candidate for e in entries if isinstance(e, dict)):
            raise LineError("chart_edit_outcome_unknown", "未找到成功准备记录，不能申请应用。")
```

</details>

**依据 4 · 源码核查**：[scripts/dsh-bootstrap.mjs:44-49](https://github.com/FTShare-Lab/dsh_kline/blob/33db01bd64cd039644527ada43391d559cf4acb5/scripts/dsh-bootstrap.mjs#L44-L49)

断线后核对未知结果。

```text
  const unavailable = (id, dispatched = false) => reply(id, {
    content: [{ type: 'text', text: dispatched
      ? '后端连接中断，操作结果未知。请先核对当前状态，不要自动重放操作。'
      : ready ? '后端已恢复，请重新发起操作。' : 'Python 正在准备或恢复。此操作尚未执行，请就绪后重试。' }],
    structuredContent: { ...status(), ok: false, error: dispatched ? 'runtime_connection_lost' : lastError || 'runtime_preparing',
      operation_dispatched: dispatched, outcome_unknown: dispatched }, isError: true,
```

#### 缺口

- 没有同版本真实用户、源行情、耗时或可用性验证。
  **影响**：试用范围限历史图表与明确的数据来源。
  **进一步探讨**：固定样本比较标注匹配、回执核对、人工动作和耗时，不评价预测收益。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
