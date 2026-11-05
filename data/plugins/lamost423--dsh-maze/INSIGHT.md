# dsh-maze

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[fb83f30](https://github.com/lamost423/dsh-maze/tree/fb83f3076b4683f23672cefd571e63534f5bc166)

<!-- BEGIN META -->
[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lamost423/dsh-maze) [![npm 30d 1,840](https://img.shields.io/static/v1?label=npm+30d&message=1%2C840&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-maze) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-maze)
<!-- END META -->

> **功能**：在 DSH 展示实时或上传会话轨迹的迷宫视图与工具判定。

> **亮点**：[Q01](#research-q01) 用视觉路径统一比较调用时序和分支。

> **主要限制**：[Q02](#research-q02) 自动标签仅是规则结果，损坏行可能被跳过。

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
  - [Q01 · 迷宫怎样帮助复核工具轨迹？](#detail-section-11)
  - [Q02 · 成功与盲目重试标签可信到什么程度？](#detail-section-12)
  - [Q03 · 如何试用而避免误读轨迹？](#detail-section-13)
  - [Q04 · 怎样区分合法重试与浪费？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：复核长工具任务、并行时长和重试路径的开发者。

逐条查看原始日志与时间戳。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 轨迹图 | 查看时长并行及分支 | 基于输入完整性 |
| 工具标签 | 定位可疑失败及重试 | 需回原结果复核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH Chat服务 | 实时需要 | 快照及子会话 | 用上传模式 |
| 可解码会话日志 | 上传需要 | 还原轨迹 | 回原日志 |
| 浏览器内存 | 必需 | 全文件解压绘图 | 缩小测试日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 合成成功失败及并行调用 | 记录原时间 |
| 比较 | 同一日志两路径 | 逐标签核对 |
| 退出 | 关闭视图禁用 | 保留原日志 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器资源未知 | 准备基准日志 | 未实测 |
| 持续使用 | 大日志内存未知 | 复核误标签 | 按日志规模 |
| 失败恢复 | 重新导入成本未知 | 回原日志查缺行 | 不依赖图认定成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 时序定位 | 源码转换并绘图 | 实际排障速度 |
| 自动标签 | 确定性规则与依据 | 准确率 |
| 上传 | zstd及JSONL解析 | 损坏行完整性 |

> **思考**：[Q02](#research-q02) 自动标签仅是规则结果，损坏行可能被跳过。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用视觉路径统一比较调用时序和分支。

[Q02](#research-q02) 规则有明确优先级，但解析跳过损坏行需要读者知情。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 自动标签仅是规则结果，损坏行可能被跳过。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 小合成日志先核对两路径。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

两类输入和规则已静态核查，准确率和排障效率未测。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/TraceLiveView.tsx、src/client/index.ts、src/client/maze-upload.html、src/client/verdict.js、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定客户端入口、实时传输、规则与文件解码。
- 下一步：对照原日志、损坏行、内存及关闭释放。

**分析版本**

- **仓库**：[lamost423/dsh-maze](https://github.com/lamost423/dsh-maze)
- **版本号**：2.4.0（[固定提交 fb83f30](https://github.com/lamost423/dsh-maze/tree/fb83f3076b4683f23672cefd571e63534f5bc166)）
- **版本日期**：2026-10-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 结果变化与重试理由可作为独立校准候选。

对照原日志、损坏行、内存及关闭释放。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 627 | — | — | 25134 |
| .js | source | 18 | 4941 | 3799 | 1141 | — |
| .ts | source | 13 | 1874 | 1249 | 512 | — |
| .tsx | source | 4 | 388 | 295 | 79 | — |
| .ts | test | 12 | 2736 | 2317 | 296 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/lamost423/dsh-maze/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：实时和上传轨迹怎样生成迷宫视图，自动判定能支持什么复核？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 迷宫怎样帮助复核工具轨迹？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要比较长任务工具调用的开发者可上传日志或打开当前会话的实时视图。入口注册侧栏和conversation view，实时组件从宿主Chat snapshot及子会话取数据，转换后发给隔离iframe。相比逐条翻日志，可把时长、并行和重试放到同一视觉轴上。这个增量是观察和定位，不等同于自动证明任务成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:40-58](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/index.ts#L40-L58)

宿主依赖与入口

<details>
<summary>查看原文（19行）</summary>

```text
/** Required services for slot composition, the subagent child roster, per-session Conversation assembly, and localized copy. */
export const inject = ['slots', 'locale', 'sessions', 'uiConversation']

/** Mount the trigger, center surface, and live per-session view with one apply-scoped viewing store. */
export async function apply(ctx: ClientContext): Promise<() => Promise<void>> {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-trace-compare: dictionaries')
  const t = ctx.locale.bind(NS)
  const viewStore = createTraceCompareViewStore()
  // The sidebar entry is switchable (#11: live-tab-only users never need it).
  // The switch lives on our settings page below and persists per browser (see
  // settings.ts for why not the Host settings document); slots.inject's
  // idempotent disposer makes the flip immediate — no reload.
  const mountSidebarEntry = () => ctx.slots.inject('sidebar.footer.action', () => ctx.slots.register({
    name: 'sidebar.footer.action',
    id: 'trace-compare',
    order: 10,
    locale: NS,
    store: viewStore,
  }, TraceCompareTrigger))
```

</details>

**依据 2 · 源码核查**：[src/client/TraceLiveView.tsx:81-100](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/TraceLiveView.tsx#L81-L100)

快照及子会话订阅

<details>
<summary>查看原文（20行）</summary>

```text
  // Conversation content moved off the Session snapshot in host 0.1.2; the
  // maze reads the Chat target, which owns the ordered node stream.
  const snapshot = useChat(s => s)
  // Model identity rides the Trajectory target: it is assembled from the
  // durable request/header events, which never reach the Chat nodes.
  const requests = useTrajectory(s => s.requests)
  // One roster per (service, session); disposed with the view or on session switch.
  // Built in an effect, not in render: the roster subscribes to the session list
  // and follows child sessions as soon as it exists, and React may discard a
  // render (concurrent rendering) — a roster built there would never be disposed.
  const [source, setSource] = useState<SubagentRoster | null>(null)
  useEffect(() => {
    const roster = createSubagentRoster(sessions, conversations, sessionId)
    setSource(roster)
    return () => { roster.dispose() }
  }, [sessions, conversations, sessionId])
  const children = useSyncExternalStore(source?.subscribe ?? noRosterSubscribe, source?.getSnapshot ?? noChildren)
  // 父会话的子代理目录（宿主 0.1.5 起的投影；0.1.2 没有，读到 undefined）：持有式花名册靠它定成员，
  // 被动式花名册只拿它当名字来源。投影值按宿主的折叠切面稳定，可直接当依赖。
  const catalogRaw: unknown = (useProjection as (key: string) => unknown)('subagentCatalog')
```

</details>

**依据 3 · 源码核查**：[src/client/TraceLiveView.tsx:140-175](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/TraceLiveView.tsx#L140-L175)

转换与iframe消息

<details>
<summary>查看原文（36行）</summary>

```text
    const d = snapshotToMazeData(snapshot, children, requests, { now, ...(hostWindow === undefined ? {} : { hostWindow }) })
    const lane = d?.lanes[0]
    // Trajectory 的请求级身份更精确，优先；窗口外的早期请求靠 fork 投影兜。
    if (lane !== undefined && lane.model === null && hostModel !== null) lane.model = hostModel
    return d
  }, [snapshot, children, requests, hostModel, now, hostWindow])
  const anyLive = data !== null && data.lanes.some(l => l.main.some(n => n.live) || l.detours.some(n => n.live))
  useEffect(() => {
    if (!anyLive) return
    setNow(Date.now())   // 刚开始运行时立刻对齐，别让第一帧钉在旧的「现在」
    const tick = (): void => { if (typeof document === 'undefined' || !document.hidden) setNow(Date.now()) }
    const id = setInterval(tick, 1000)
    return () => { clearInterval(id) }
  }, [anyLive])
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const dataRef = useRef<MazeData | null>(null)
  dataRef.current = data
  // srcDoc 按挂载时的宿主主题预置暗色：暗色宿主下切 tab 重挂载 iframe，
  // 页面默认浅色变量会先画一帧（issue #4 的闪白）。挂载后的主题翻转走
  // postMessage，不动 srcDoc。
  const srcDoc = useMemo(() => themedMazeHtml(MAZE_PAGE_HTML), [])

  // Push on data change; also re-push once the iframe finished loading.
  useEffect(() => {
    const frame = iframeRef.current
    if (frame !== null && data !== null) {
      frame.contentWindow?.postMessage({ kind: 'trace-maze', data }, '*')
    }
  }, [data])
  const onLoad = (): void => {
    const frame = iframeRef.current
    postThemeTo(frame)   // 主题先于数据：首次 build 即按宿主主题着色
    postLocaleTo(frame, locale)   // 语言同理：首次 build 即按宿主语言渲染文案
    const payload = dataRef.current
    if (frame !== null && payload !== null) {
      frame.contentWindow?.postMessage({ kind: 'trace-maze', data: payload }, '*')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:1-4](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/index.ts#L1-L4)

空宿主入口

```text
/** Trace Compare UI plugin, Host half: client-only; the Loader finds its browser bundle through package.json. */

/** Host plugin body. */
export function apply(): void {}
```

#### 缺口

- 真实长任务定位效率未对照
  **影响**：不能量化排障节省
  **进一步探讨**：用已知慢调用与失败调用的合成会话核对

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 成功与盲目重试标签可信到什么程度？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

toolVerdict先信任err标记，再扫描文本首尾失败特征，随后把write类无错误视为成功、搜索类空结果视为deadend、其他工具有内容视为ok。规则可能把命令返回的引用错误误标失败，也可能漏掉中部真实错误；ok只表示规则未发现失败，不能说明文件内容正确。相似参数重试是行为线索，合法重复读取也可能相似。上传解析逐行JSON.parse，损坏行被跳过，只在全部无法解析时拒绝，部分日志会画出不完整轨迹而非总失败。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/verdict.js:14-44](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/verdict.js#L14-L44)

首尾窗口及工具分类

<details>
<summary>查看原文（31行）</summary>

```text
export const VERDICT_RULES = {
  /**
   * 强失败特征（扫开头 + 末尾两个窗口）：包装器/运行时的硬标记。真失败的标记要么在
   * 短输出里（命令直接死掉），要么贴着末尾（stderr 段是包装器追加在最后的）；而转储/
   * 引用别的日志时（如会话分析会话），这些标记悬在长文本中部，两个窗口都够不着。
   * 刻意不含项目特定话术（如 "No such container"），那类失败靠 [status=Failed] / __EXIT__ 兜住。
   */
  ERROR_PATTERNS_STRONG: /\[stderr\].*(Error|Traceback|File ")|\[status=Failed\]|__EXIT__=[1-9]/i,
  /**
   * 弱失败特征（只扫开头窗口）：真实报错从开头开始说，而 git log / grep / 文档类输出
   * 在正文深处**引用**别人的报错（如提交信息里写 "upstream returns HTTP 400"）不该算
   * 这条命令失败——2026-08-19 实测误报案例。
   */
  ERROR_PATTERNS_WEAK: /Traceback \(most recent|command not found|Permission denied|No such file|HTTP 40\d|HTTP 50\d|^Error:/i,
  /** 开头扫描窗口（字符）：弱特征仅此窗口；强特征此窗口 + 末尾窗口。 */
  ERROR_HEAD_SCAN: 300,
  /** 末尾扫描窗口（字符）：覆盖「长输出后崩溃」的 stderr 追加段。 */
  ERROR_TAIL_SCAN: 1000,
  /** 写入类工具：成功确认天然很短，无错误即成功，永不按输出判扑空。 */
  WRITE_TOOLS: ['write', 'edit', 'todo_write'],
  /** 检索类工具：空结果=扑空；有返回（哪怕一行命中）即成功。 */
  SEARCH_TOOLS: ['grep', 'read', 'web_search', 'read_image'],
  /**
   * 空结果/无命中特征（只扫开头窗口）：真正的空结果提示本来就是整段短消息；
   * 读到的文件内容/命中的代码里出现 "not found in" 字样不算扑空——2026-08-19 实测误报案例。
   */
  NO_RESULT_PATTERNS: /^(---)?$|no matches|no results|not found in/i,
  /** 盲目重试：相邻同工具调用的参数 token Jaccard 相似度门槛。 */
  RETRY_SIMILARITY: 0.6,
  /** 盲目重试：最小连续调用数。 */
  RETRY_MIN_CLUSTER: 2,
```

</details>

**依据 2 · 源码核查**：[src/client/verdict.js:55-79](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/verdict.js#L55-L79)

判定优先级

<details>
<summary>查看原文（25行）</summary>

```text
export function toolVerdict(ev){
  if (ev.err) return { v: 'error', why: { k: 'errFlag' } }
  const txt = (ev.res ?? '').trim()
  const head = txt.slice(0, VERDICT_RULES.ERROR_HEAD_SCAN)
  const tail = txt.slice(-VERDICT_RULES.ERROR_TAIL_SCAN)
  const strong = VERDICT_RULES.ERROR_PATTERNS_STRONG.exec(head) ?? VERDICT_RULES.ERROR_PATTERNS_STRONG.exec(tail)
  if (strong !== null) return { v: 'error', why: { k: 'errStrong', p: [strong[0].slice(0, 48)] } }
  const weak = VERDICT_RULES.ERROR_PATTERNS_WEAK.exec(head)
  if (weak !== null) return { v: 'error', why: { k: 'errWeak', p: [weak[0].slice(0, 48)] } }
  if (VERDICT_RULES.WRITE_TOOLS.includes(ev.name)) return { v: 'ok', why: { k: 'writeOk' } }
  if (VERDICT_RULES.SEARCH_TOOLS.includes(ev.name)){
    if (VERDICT_RULES.NO_RESULT_PATTERNS.test(head)) return { v: 'deadend', why: { k: txt === '' ? 'searchEmpty' : 'searchNoHit' } }
    return { v: 'ok', why: { k: 'searchOk' } }
  }
  if (VERDICT_RULES.NO_RESULT_PATTERNS.test(head)) return { v: 'deadend', why: { k: 'exitNoOut' } }
  return { v: 'ok', why: { k: 'exitOk' } }
}

/** 步级判定：返回该步最坏判定的工具（其 v/why 即步判定与依据）；无参与投票的工具时返回 null。 */
export function stepVerdict(tools){
  let worst = null
  for (const t of tools){
    if (worst === null || (SEV[t.v] ?? 0) > (SEV[worst.v] ?? 0)) worst = t
  }
  return worst
```

</details>

**依据 3 · 源码核查**：[src/client/maze-upload.html:948-956](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/maze-upload.html#L948-L956)

损坏行跳过

```text
/** One session log → rows of steps with tool events, verdicts, reasoning stats. */
function buildLane(text){
  const evs = []
  for (const line of text.split(/\r?\n/)){
    const l = line.trim()
    if (!l) continue
    try { evs.push(JSON.parse(l)) } catch { /* skip malformed lines */ }
  }
  if (evs.length === 0) throw new Error(tr('errNotJsonl'))
```

#### 缺口

- 规则在其他工具与语言上的误报漏报未知
  **影响**：不能作为无人复核的结果验收或绩效评价
  **进一步探讨**：把标签与原始exitCode、文件结果及人工标注逐项比较

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用而避免误读轨迹？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在兼容DSH里打开一段不含私密命令的合成会话，核对实时泳道，再上传同一日志比较两条路径。文件会整体读入并解压，原生zstd不可用时用内置fzstd，峰值内存未知；源码没有模型调用。实时iframe只接收父组件数据，父组件对跳转消息检查source为自己的iframe，sandbox不授同源权限。页面还保留独立URL加载钩子，实际部署应核对是否允许外部资源。退出时关闭视图或禁用插件，确认订阅与页面释放。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/maze-upload.html:3438-3449](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/maze-upload.html#L3438-L3449)

全文件解码

<details>
<summary>查看原文（12行）</summary>

```text
/** zstd bytes → text: native DecompressionStream where available, bundled fzstd otherwise. */
async function unzstd(buf){
  if (NATIVE_ZSTD) return await new Response(new Blob([buf]).stream().pipeThrough(new DecompressionStream('zstd'))).text()
  if (typeof fzstd !== 'undefined') return new TextDecoder().decode(fzstd.decompress(buf))
  throw new Error(tr('errZstd'))
}

/** File → decoded text; zstd frames (session.jsonl.zstd) are detected by magic bytes and decompressed. */
async function decodeFile(f){
  const buf = new Uint8Array(await f.arrayBuffer())
  const isZstd = buf.length >= 4 && ZSTD_MAGIC.every((b, i) => buf[i] === b)
  return isZstd ? await unzstd(buf) : new TextDecoder().decode(buf)
```

</details>

**依据 2 · 源码核查**：[src/client/TraceLiveView.tsx:186-210](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/TraceLiveView.tsx#L186-L210)

消息source与sandbox

<details>
<summary>查看原文（25行）</summary>

```text

  useEffect(() => {
    const onMessage = (event: MessageEvent): void => {
      const frame = iframeRef.current
      if (frame === null || event.source !== frame.contentWindow) return
      const msg = event.data as TraceJumpMessage | null
      if (msg === null || msg.kind !== 'trace-jump') return
      jumpToChat(frame, msg)
    }
    window.addEventListener('message', onMessage)
    return () => { window.removeEventListener('message', onMessage) }
  }, [])

  if (data === null) {
    return <div className={css.empty}>{t('live.empty')}</div>
  }
  return (
    <div className={css.frame}>
      <iframe
        ref={iframeRef}
        title="trace-live"
        className={css.iframe}
        srcDoc={srcDoc}
        sandbox="allow-scripts allow-modals allow-downloads"
        onLoad={onLoad}
```

</details>

**依据 3 · 源码核查**：[src/client/maze-upload.html:3587-3598](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/maze-upload.html#L3587-L3598)

URL加载钩子

<details>
<summary>查看原文（12行）</summary>

```text
/* URL-direct load hook: ?load1=<path>…&load5=<path> (dev/embed convenience). */
;(async () => {
  const params = new URLSearchParams(location.search)
  const paths = Array.from({ length: MAX_LANES }, (_, i) => params.get('load' + (i + 1))).filter(Boolean)
  for (const p of paths){
    try {
      const r = await fetch(p)
      const text = await r.text()
      loaded.push({ name: p.split('/').pop() ?? p, text })
    } catch (e){
      showErr(tr('errUrl')(p, e.message ?? e))
    }
```

</details>

**依据 4 · 作者声明**：[README.md:94-119](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/README.md#L94-L119)

格式和安装

<details>
<summary>查看原文（26行）</summary>

````text
## 支持的 session log 格式

按文件内容识别格式，文件名任意（macOS 复制出的「session.jsonl 2」也能直接选）：

- 纯文本 `.jsonl`（session 格式 v0 事件流）
- `~/.dsh/sessions/` 下原样的 `.jsonl.zstd`——浏览器端直接解压（原生 `DecompressionStream('zstd')` 可用时优先，否则用内置的 [fzstd](https://github.com/101arrowz/fzstd)）

## 安装

**先看你的宿主是哪来的。** 宿主 `0.1.2` 把客户端包重新拆分了一次（`dsh-client-runtime` 拆成 `dsh-client-store` 等），同时换掉了会话快照的数据模型，所以两条线的插件不通用：

| 你的宿主 | 装哪个版本 | 命令 |
|---|---|---|
| `0.1.2` 及以后——npm 的 `@deepseek-ai/dsh`（现在的 `latest` 是 `0.2.0-rc.2`）、内核 `0.1.2` 以后的各家桌面版、或自建 master | dsh-maze `2.x`，`latest` 标签 | `dsh plugin --profile web add dsh-maze` |
| 老宿主（`0.1.0-rc.6` ~ `0.1.1-rc.2`） | dsh-maze `1.1.2`，手动钉版本 | `dsh plugin --profile web add dsh-maze@1.1.2` |

**宿主 `0.1.7` 起需要 dsh-maze `2.3.0` 及以上**：`0.1.7` 改了图标名和子代理目录接口，更早的 `2.x` 装上去侧边栏入口不显示、实时迷宫页签空白。`0.1.6-alpha.2` 起的宿主上 `2.2.0` 虽然不崩，但切换会话时不再自动关闭上传面板，也建议升级。**桌面版（`0.2.0-rc.2`）请用 `2.4.0`**：本版把 `@deepseek-ai/dsh*` 的 peer 范围从 `<0.2.0` 放开到 `<0.3.0`，并把构建产物 `lib/` 纳入版本控制——否则从 GitHub 安装会装出一个没有 `lib/index.js` 的空壳，插件完全加载不了（2026-10-05 桌面版就是这个原因）。用 pnpm 11 的默认设置时，插件发新版后的 24 小时内，不带版本号的安装会解析回上一版，这时请钉精确版本，例如 `dsh plugin --profile desktop add dsh-maze@2.4.0`。

兼容性：`2.4.0` 对着 npm 的 `0.2.0-rc.2` 全家桶构建，类型检查另在 `0.1.2-rc.1`、`0.1.5-rc.3` 两套包上跑过，均为零错误，158 个测试全绿；实机验收在全新的 `0.1.5-rc.3`、`0.1.7-rc.2`、`0.2.0-rc.2` 宿主上做过（`2.3.0` 那轮：装上安装包、用模拟模型跑会话、界面数字与宿主自己的统计逐项对账，上传页也读通了这些宿主写出的第 3 版、第 4 版会话日志），`0.2.0-rc.2` 桌面版另装了本版做回归。`1.1.x` 已对官方 `0.1.0-rc.6`（构建 + 全量测试）与 `rc.8`（插槽/类型核对 + 实机验收）验证。

```sh
npm install --global @deepseek-ai/dsh
dsh plugin --profile web add dsh-maze
dsh web
```

````

</details>

#### 缺口

- 大日志内存与宿主兼容未测试
  **影响**：不能支持无大小上限的导入
  **进一步探讨**：递增日志测内存并核对关闭后释放

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样区分合法重试与浪费？

**研究主题**：新假设与验证

#### 完整回答

可用与当前相似度阈值无关的人工作业结果作标签，收集正常轮询、故障恢复及无进展重复。固定当前规则后，在保留集上比较增加结果变化量和明确重试理由的方案，统计误标与漏标及所需状态。若仅提高复杂度而没有减少误标，保留现有标签并解释其启发式性质。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/verdict.js:40-44](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/verdict.js#L40-L44)

相似度和簇阈值

```text
  NO_RESULT_PATTERNS: /^(---)?$|no matches|no results|not found in/i,
  /** 盲目重试：相邻同工具调用的参数 token Jaccard 相似度门槛。 */
  RETRY_SIMILARITY: 0.6,
  /** 盲目重试：最小连续调用数。 */
  RETRY_MIN_CLUSTER: 2,
```

**依据 2 · 源码核查**：[src/client/verdict.js:82-93](https://github.com/lamost423/dsh-maze/blob/fb83f3076b4683f23672cefd571e63534f5bc166/src/client/verdict.js#L82-L93)

参数token相似度

<details>
<summary>查看原文（12行）</summary>

```text
function argTokens(s){
  const out = new Set()
  for (const w of String(s).split(/[^\w一-鿿./-]+/)) if (w.length > 2) out.add(w)
  return out
}

/** 参数相似度：token 集 Jaccard，用于识别「几乎相同的重复调用」。 */
export function argSimilarity(a, b){
  const ta = argTokens(a), tb = argTokens(b)
  if (ta.size === 0 || tb.size === 0) return 0
  let inter = 0
  for (const w of ta) if (tb.has(w)) inter += 1
```

</details>

#### 缺口

- 独立标注集和结果变化特征尚无证据
  **影响**：不能声称新规则更准确
  **进一步探讨**：先盲标小样本再做保留集比较

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
