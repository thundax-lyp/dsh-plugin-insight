# dsh-block-ptc

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[c2afa0a](https://github.com/mengwEX/dsh-block-ptc/tree/c2afa0a0a34990aa7189ea6df377cd215e29f8d6)

<!-- BEGIN META -->
[![GitHub ★ 102](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=102&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mengwEX/dsh-block-ptc) [![npm 30d 1,170](https://img.shields.io/static/v1?label=npm+30d&message=1%2C170&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-block-ptc) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-block-ptc)
<!-- END META -->

> **功能**：为 DSH 的 PTC 模式添加块标签，让模型提交保留内容以整理不再活跃的上下文。

> **亮点**：块协议把语义工作单元、工具配对与可恢复会话替换连接起来，避免另设摘要服务；其增量是调度与边界组织，非新PTC执行器。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：目标块的首末连续区间也会覆盖交错块；content非空并不能证明跨块约束被摘要保留，历史可见不等于模型当前输入无损。[Q02](#research-q02)

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
  - [Q01 · 谁使用block-ptc，块归属如何进入工具链？](#detail-section-11)
  - [Q02 · 压缩区间会覆盖哪些内容，并发与延迟提交如何恢复？](#detail-section-12)
  - [Q03 · 依赖、操作和合格任务成本是什么？](#detail-section-13)
  - [Q04 · 何种试用和未来假设能被推翻？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多子任务编码会话可用块ID标记工作并主动压缩；合格结果是后续仍正确遵循约束。[Q01](#research-q01)

宿主自动压缩按压力触发；本组件改由模型指定工作块和保留内容，仍复用宿主PTC与会话能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Block PTC预设 | 在程序工具调用中组织工作块 | 需选择预设并正确填写块头 |
| block_compact | 用模型撰写内容替换已结束区间 | 连续区间可含其他块，摘要需复核 |
| pending恢复 | 工具未配对完成时延迟压缩 | 成功请求需持久日志可重建 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH>=0.2.1-rc.2、Cordis>=4.0.5 | 必需，作者声明 | 宿主与PTC执行 | 方法检查失败拒绝挂载或摘要 |
| Block PTC预设与run_code | 本协议必需 | 块头及程序内调用 | 普通预设不自动获得协议 |
| 模型正确划块和摘要 | 效果必需 | 保留后续要求 | 非空检查不能阻止语义遗漏 |
| tokenMeter | 可选 | 估算被遮蔽内容 | 使用粗略长度估算 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装bundle、重启并选择Block PTC | 模型可用run_code块协议 |
| 工作 | 模型给每个程序写块头 | guard拒绝不合格式调用，可修正重试 |
| 整理 | 模型提交ids与content | 配对完成才替换，否则持久pending |
| 验收恢复 | 用户核对后续要求与pending | 缺约束查看原转录，回原PTC继续 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 主模型/宿主资源，量未知 | 安装与划块协议检查，耗时未知 | 不另调摘要服务 |
| 持续 | 主模型摘要与缓存后缀重建，金额未知 | 抽查跨块约束 | tokensFreed非净省费用 |
| 失败恢复 | 重提摘要与额外上下文，量未知 | 核对pending、原日志和遗漏 | 原历史保留不保证自动恢复内容 |
| 退出 | 原日志存储保留 | 换回原PTC并复核任务要求 | 新会话可避开既有压缩状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主动整理 | 块标签到连续区间替换已接线 | 摘要忠实性 |
| 延迟提交 | 成功pending从日志重建 | 任意宿主版本正确性 |
| 输入与费用 | 被遮蔽范围可估算 | 净输入、缓存命中和账单收益 |

> **思考**：目标块的首末连续区间也会覆盖交错块；content非空并不能证明跨块约束被摘要保留，历史可见不等于模型当前输入无损。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：块协议把语义工作单元、工具配对与可恢复会话替换连接起来，避免另设摘要服务；其增量是调度与边界组织，非新PTC执行器。[Q01](#research-q01) [Q02](#research-q02)

纯规划模块把归属与区间校验分离，持久成功请求而非内存队列承担pending恢复，值得借鉴。移植需宿主append、surface与原生压缩锁语义，方法名存在不够。

<a id="detail-section-5"></a>

### 1.4 主要限制

目标块的首末连续区间也会覆盖交错块；content非空并不能证明跨块约束被摘要保留，历史可见不等于模型当前输入无损。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用有交错工作块和纠正指令的可复做任务，核对摘要前后要求与pending落地；出现遗漏就停止该预设并查看原转录。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

预设、工具guard、区间与持久pending机制已查源码；摘要忠实性和净收益未测，预览协议是假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/plugin.js、lib/blocks.js、lib/prompts.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查预设、三份生产JS与包声明；没有执行作者测试、安装或模型任务。
- 下一步：后续固定模型与任务，对比原PTC和块协议，记录遗漏、总输入、账单和人工修正，不以示意图或tokensFreed当收益。

**分析版本**

- **仓库**：[mengwEX/dsh-block-ptc](https://github.com/mengwEX/dsh-block-ptc)
- **版本号**：0.4.0（[固定提交 c2afa0a](https://github.com/mengwEX/dsh-block-ptc/tree/c2afa0a0a34990aa7189ea6df377cd215e29f8d6)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是提交前给模型展示区间内继承ID与待保留约束，减少交错任务漏记；若同任务遗漏不降或总负担增大，就放弃该预览设计。[Q04](#research-q04)

后续固定模型与任务，对比原PTC和块协议，记录遗漏、总输入、账单和人工修正，不以示意图或tokensFreed当收益。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1354 | — | — | 12008 |
| .js | source | 3 | 532 | 401 | 87 | — |
| .mjs | source | 1 | 106 | 103 | 1 | — |
| .mjs | test | 3 | 498 | 463 | 21 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mengwEX/dsh-block-ptc/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/mengwEX/dsh-block-ptc/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/mengwEX/dsh-block-ptc/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：PTC块压缩能否保留后续任务所需信息，范围规划和模型摘要有哪些限制？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用block-ptc，块归属如何进入工具链？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它给使用DSH PTC编程工具调用的编码Agent增加按工作块主动整理上下文的协议。原办法是等宿主按大小压缩或人工提示模型总结；本插件让模型在run_code描述开头写块ID，并通过程序内block_compact提交自己写的保留内容。guard拒绝没有块头的直接run_code，也拒绝其他直接工具调用，但允许子调用。块ID并非只标一段工具输出，surfaceView把同一assistant消息全部调用的ID取并集，再连到结果。包补丁提供单独block-ptc预设而不改原ptc，贡献是把任务语义边界、工具协议和原生会话替换组合起来，PTC执行与会话存储仍来自宿主。合格结果应是压缩后能继续正确执行并保留用户约束，而不只是tokensFreed有值。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-59](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/README.md#L50-L59)

作者将任务语义边界与自动压缩比较，摘要由主模型撰写。

<details>
<summary>查看原文（10行）</summary>

```text
## Why

Automatic compaction condenses history when token pressure builds, and it
decides what to condense by size. It has no idea that the last forty messages
were one finished sub-task and the next ten are a new one.

This plugin lets the model draw that line itself: open a block, work inside it,
and close it with a handover summary — so the context it keeps is the one it
chose to keep. The model submits the summary inside its program call; the plugin
does not run a separate summarizer model.
```

</details>

**依据 2 · 源码核查**：[lib/plugin.js:240-259](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L240-L259)

真实工具guard和block_compact注册。

<details>
<summary>查看原文（20行）</summary>

```text
  // The host's PTC collapse already limits model-direct calls to run_code.
  // This guard adds the block contract: every run_code description must carry
  // a header the membership scan can tag, and under a native composition
  // (where the collapse does not run) no other tool is directly callable either.
  ctx.tools.guard((exec) => {
    if (exec.parent !== undefined) return undefined
    if (exec.name !== RUN_CODE) {
      return `In block mode only \`${RUN_CODE}\` may be called directly. Call \`${exec.name}\` from inside a ${RUN_CODE} program (it is in the tools SDK there).`
    }
    if (parseBlockHeader(exec.arguments?.description) === undefined) {
      return `${HEADER_GUIDANCE} This call did not run; retry with the header.`
    }
    return undefined
  })

  ctx.tools.register({
    name: BLOCK_COMPACT,
    description:
      `${COMPACT_GUIDANCE} ` +
      `Call from inside a ${RUN_CODE} program: \`await tools.${BLOCK_COMPACT}({ ids, content })\`.`,
```

</details>

**依据 3 · 源码核查**：[lib/blocks.js:46-94](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/blocks.js#L46-L94)

整条消息、调用和结果的归属扫描。

<details>
<summary>查看原文（49行）</summary>

```text
/** Map whole assistant messages and their results to the union of their calls' ids. */
export function surfaceView(session) {
  const events = session.snapshotEvents()
  const steps = new Map()
  const calls = new Map()
  const assign = (key, raw) => {
    let args
    try { args = JSON.parse(raw) } catch { return }
    const ids = steps.get(key) ?? new Set()
    const memberships = parseBlockHeader(args?.description)?.ids ?? []
    for (const id of memberships) ids.add(id)
    steps.set(key, ids)
  }
  for (const event of events) {
    // Read the complete model-issued batch before dispatch starts. Another
    // call in that same message may not have a tool/call log record yet.
    if (event.type === 'assistant/message') {
      const key = keyOf(event.data)
      for (const part of event.data.message?.content ?? []) {
        if (part.type !== 'tool-call') continue
        calls.set(part.id, key)
        if (part.name === RUN_CODE) assign(key, part.arguments)
      }
    }
    if (event.type !== 'tool/call') continue
    const key = keyOf(event.data)
    calls.set(event.data.callId, key)
    if (event.data.name !== RUN_CODE) continue
    assign(key, event.data.arguments)
  }
  let balance = 0
  return [...session.surface.nodes].map((seq) => {
    const event = session.eventAt(seq)
    const metadata = summaryMetadata(event)
    const data = event?.data
    let key
    if (event?.type === 'assistant/message') {
      key = keyOf(data)
      balance += (data.message?.content ?? []).filter((part) => part.type === 'tool-call').length
    } else if (event?.type === 'tool/result') {
      key = calls.get(data.message?.source?.callId ?? data.message?.toolCallId ?? data.callId) ?? keyOf(data)
      balance -= 1
    }
    if (balance < 0) throw new Error('block_compact: unpaired tool result on the session surface')
    return {
      seq, event, balance,
      ids: metadata === undefined ? [...(steps.get(key) ?? [])] : [...metadata.ids],
      replaceable: event?.type === 'user/message' || event?.type === 'assistant/message' || event?.type === 'tool/result',
    }
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:11-18](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/cordis.patch.yml#L11-L18)

单独预设入口。

```text
- insert:
    - id: preset-block-ptc
      name: '@deepseek-ai/dsh-agent-preset'
      config:
        id: block-ptc
        name: Block PTC
        description: PTC mode where every program runs inside a blackboard block and blocks no longer needed for active work are replaced by model-written retained content.
        order: 3
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 压缩区间会覆盖哪些内容，并发与延迟提交如何恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

计划器替换目标ID第一次到最后一次出现的整个连续区间，所以混在中间的其他块也进入摘要范围，剩余块ID继承给摘要；它不是只删除目标ID的离散节点。新增用户消息若在摘要撰写后进入区间会拒绝替换，system/developer等受保护节点也使整段拒绝；起点或终点工具配对不完整则拒绝或pending。提交先检查原生压缩锁，以start/summary/替换user message/end顺序写原生事件，失败尝试写end释放锁。pending请求通过成功的持久tool/ptc-dispatch结果重建，并在事件后的microtask冲刷以避免Session.append重入。它解决重启后认领与配对的一部分问题，但摘要只要求content非空，没有语义验证用户约束是否保留；不应把append-only保留历史等同于模型当前输入无损。

#### 证据与依据

**依据 1 · 源码核查**：[lib/blocks.js:98-133](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/blocks.js#L98-L133)

连续区间、保护消息、新消息和工具配对条件。

<details>
<summary>查看原文（36行）</summary>

```text
/** Plan one entire first-to-last interval, or wait for its tool pairs to settle. */
export function planReplacement(session, target, requestSeq) {
  const ids = normalizeIds({ ids: target }, 'block_compact')
  const wanted = new Set(ids)
  const rows = surfaceView(session)
  const matches = rows.flatMap((row, index) => row.ids.some((id) => wanted.has(id)) ? [index] : [])
  const present = new Set(rows.flatMap((row) => row.ids))
  const missing = ids.filter((id) => !present.has(id))
  if (missing.length > 0) throw new Error(`block_compact: no current content for ids ${JSON.stringify(missing)}`)
  const first = matches[0]
  const last = matches[matches.length - 1]
  const span = rows.slice(first, last + 1)
  // Never discard instructions that arrived after the model wrote this summary.
  const invocation = requestSeq === undefined ? undefined : session.eventAt(requestSeq)
  const caller = invocation?.data?.parentCallId
  const generated = caller === undefined ? undefined : session.snapshotEvents().find((event) =>
    event.type === 'assistant/message' && event.data.message?.content?.some((part) => part.type === 'tool-call' && part.id === caller),
  )
  if (generated && span.some((row) => row.event.type === 'user/message' && row.seq > generated.seq && !summaryMetadata(row.event))) {
    throw new Error('block_compact: a new message arrived after this content was written; read it and submit updated content; nothing was replaced')
  }
  const protectedRows = span.filter((row) => !row.replaceable)
  if (protectedRows.length > 0) {
    const boundaries = protectedRows.map((row) => `${row.event?.type ?? 'unknown'} at seq ${row.seq}`).join(', ')
    throw new Error(`block_compact: the full interval contains protected system/developer messages (${boundaries}); nothing was replaced`)
  }
  if ((rows[first - 1]?.balance ?? 0) !== 0) throw new Error('block_compact: the interval starts inside an unfinished tool group')
  const inherited = [...new Set(span.flatMap((row) => row.ids))].filter((id) => !wanted.has(id))
  return {
    kind: rows[last].balance === 0 ? 'replace' : 'pending',
    startSeq: rows[first].seq,
    endSeq: rows[last].seq,
    shadowedSeqs: span.map((row) => row.seq),
    closedIds: ids,
    ids: inherited,
  }
```

</details>

**依据 2 · 源码核查**：[lib/blocks.js:136-154](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/blocks.js#L136-L154)

pending从持久成功工具结果重建。

<details>
<summary>查看原文（19行）</summary>

```text
/** Successful queued tool outcomes survive restart/fork; attempts alone do not close ids. */
export function pendingCompactions(session) {
  const events = session.snapshotEvents()
  const committed = new Set(events.map(summaryMetadata).filter(Boolean).map((meta) => meta.requestSeq))
  const starts = new Map()
  const pending = []
  for (const event of events) {
    const data = event.data
    if (event.type === 'tool/ptc-dispatch-start' && data.name === 'block_compact') starts.set(data.subCallId, event.seq)
    if (event.type !== 'tool/ptc-dispatch' || data.name !== 'block_compact' || data.isError !== false) continue
    const requestSeq = starts.get(data.subCallId)
    if (requestSeq === undefined || committed.has(requestSeq)) continue
    let value
    try { value = JSON.parse((data.content ?? []).filter((part) => part.type === 'text').map((part) => part.text).join('\n')) } catch { continue }
    if (value.pending !== true || value.requestSeq !== requestSeq) continue
    const ids = loggedIds(data.arguments)
    const content = data.arguments?.content
    if (ids.length > 0 && typeof content === 'string') pending.push({ ids, content, requestSeq })
  }
```

</details>

**依据 3 · 源码核查**：[lib/plugin.js:135-178](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L135-L178)

原生事务顺序与异常close尝试。

<details>
<summary>查看原文（44行）</summary>

```text
function commitReplacement(ctx, session, plan, target, content, requestSeq = null) {
  if (plan.kind !== 'replace') throw new Error('block_compact: tool results have not completed')
  if (compactionBusy(session)) throw new Error('block_compact: another compaction is in progress')
  const closedIds = normalizeIds({ ids: target }, BLOCK_COMPACT)
  const compactionId = `block:${randomUUID()}`
  const turn = openTurn(session)
  const header = session.requestHeader?.()
  const provider = header?.config?.provider ?? 'dsh-block-ptc'
  const model = header?.config?.model ?? 'dsh-block-ptc'
  const shadowedTokenCount = priceSpan(ctx, session, plan.shadowedSeqs)
  const framed = frameSummary(plan.ids, content)

  const startEvent = session.append('compaction/start', { compactionId, turn })
  let summaryEvent
  try {
    summaryEvent = session.append('compaction/summary', {
      compactionId,
      summary: [textBlock(framed)],
      shadowedRange: { start: plan.startSeq, end: plan.endSeq },
      shadowedSeqs: [...plan.shadowedSeqs],
      shadowedTokenCount,
      provider,
      model,
    })
    const message = {
      id: randomUUID(),
      role: 'user',
      content: [textBlock(framed)],
      source: { kind: CHECKPOINT_KIND, compactionId, blockPtc: { version: 1, ids: [...plan.ids], closedIds, requestSeq } },
    }
    session.append('user/message', message, {
      surfaceOp: { op: 'replace', startSeq: plan.startSeq, endSeq: plan.endSeq },
      sourceEventSeqs: [startEvent.seq, summaryEvent.seq, ...plan.shadowedSeqs],
    })
  } catch (error) {
    session.append('compaction/end', {
      compactionId,
      turn,
      error: error instanceof Error ? error.message : String(error),
    })
    throw error
  }
  session.append('compaction/end', { compactionId, turn })
  return { replaced: plan.shadowedSeqs.length, shadowedTokenCount }
```

</details>

**依据 4 · 源码核查**：[lib/plugin.js:208-228](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L208-L228)

事件后microtask冲刷，失败日志去重。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx) {
  requireHostApi(ctx)

  const scheduled = new WeakSet()
  const failures = new WeakMap()
  ctx.on('session/event', (session, event) => {
    if (!['tool/result', 'tool/ptc-dispatch', 'compaction/end', 'step/start', 'turn/start'].includes(event.type) || scheduled.has(session)) return
    scheduled.add(session)
    // Session.append forbids reentry while observers are being notified.
    queueMicrotask(() => {
      try {
        flushPending(ctx, session)
        failures.delete(session)
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error)
        if (failures.get(session) !== message) ctx.logger?.warn(`Deferred block compaction not committed: ${message}`)
        failures.set(session, message)
      } finally {
        scheduled.delete(session)
      }
    })
```

</details>

**依据 5 · 源码核查**：[lib/plugin.js:291-308](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L291-L308)

content仅检查非空，pending返回0和请求序号。

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      const session = exec.agent?.session
      if (session === undefined) throw new Error(`${BLOCK_COMPACT}: no session on this execution`)
      const ids = normalizeIds(args, BLOCK_COMPACT)
      if (typeof args.content !== 'string' || args.content.trim().length === 0) {
        throw new Error(
          `${BLOCK_COMPACT}: \`content\` is required and must be written by you`,
        )
      }
      requireSessionApi(session)
      const requestSeq = compactionRequestSeq(session, exec.callId)
      const plan = planReplacement(session, ids, requestSeq)
      if (plan.kind === 'pending' || compactionBusy(session)) {
        if (requestSeq === undefined) throw new Error(`${BLOCK_COMPACT}: no durable invocation to defer`)
        return { replaced: 0, tokensFreed: 0, pending: true, requestSeq, note: 'Waiting for tool results or the current compaction to finish.' }
      }
      const result = commitReplacement(ctx, session, plan, ids, args.content, requestSeq ?? null)
      return { replaced: result.replaced, tokensFreed: result.shadowedTokenCount, ...(plan.ids.length > 0 ? { ids: plan.ids } : {}) }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、操作和合格任务成本是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明Node>=22、Cordis>=4.0.5及DSH核心peer>=0.2.1-rc.2，没有上界；方法存在性检查只证明宿主具备命名接口，不能保证新版本事件语义。安装后需重启并选择Block PTC，模型必须持续正确划块和写摘要。插件不另调摘要模型，但主模型生成摘要、失败重试和压缩后的缓存后缀重建仍有成本。tokensFreed是被遮蔽范围的估算token价格，不扣摘要输入，也不是供应商缓存命中或账单下降；无tokenMeter时甚至用JSON长度/4粗估。首次要核对预设和模型遵循协议，持续要抽查摘要约束，失败时需要从人类转录/日志复核并重新提交更新摘要。没有同条件合格任务费用与耗时，不能判定净省钱。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:16-18](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/package.json#L16-L18)

Node版本声明。

```text
  "engines": {
    "node": ">=22"
  },
```

**依据 2 · 源码核查**：[package.json:51-59](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/package.json#L51-L59)

DSH与Cordis peer范围。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.5",
    "@deepseek-ai/dsh-agent": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-session": ">=0.2.1-rc.2",
    "@deepseek-ai/dsh-tools": ">=0.2.1-rc.2"
  },
  "scripts": {
    "test": "node tests/logic.test.mjs",
```

**依据 3 · 源码核查**：[lib/plugin.js:39-59](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L39-L59)

仅对宿主与会话方法存在性做检查。

<details>
<summary>查看原文（21行）</summary>

```text
/** Check the host capabilities used by the functional preset before mounting. */
function requireHostApi(ctx) {
  const missing = ['register', 'guard']
    .filter((method) => typeof ctx.tools?.[method] !== 'function')
    .map((method) => `tools.${method}`)
  if (typeof ctx.systemPrompt?.section !== 'function') missing.push('systemPrompt.section')
  if (typeof ctx.get !== 'function') missing.push('context.get')
  if (typeof ctx.on !== 'function') missing.push('context.on')
  if (missing.length > 0) {
    throw new Error(`dsh-block-ptc: incompatible DSH host API; missing ${missing.join(', ')}`)
  }
}

/** Check the session seam before planning or appending a summary transaction. */
function requireSessionApi(session) {
  const missing = ['snapshotEvents', 'eventAt', 'deriveEventMessage', 'append']
    .filter((method) => typeof session[method] !== 'function')
  if (typeof session.surface?.nodes?.[Symbol.iterator] !== 'function') missing.push('surface.nodes (iterable)')
  if (missing.length > 0) {
    throw new Error(`${BLOCK_COMPACT}: incompatible DSH session API; missing ${missing.join(', ')}`)
  }
```

</details>

**依据 4 · 源码核查**：[lib/plugin.js:83-103](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L83-L103)

估算被遮蔽范围的计量方式。

<details>
<summary>查看原文（21行）</summary>

```text
/** Heuristic price used only when no token meter is mounted. */
function roughTokens(message) {
  try {
    return Math.ceil(JSON.stringify(message.content).length / 4)
  } catch {
    return 0
  }
}

/** Estimated token price of the shadowed span. */
function priceSpan(ctx, session, shadowedSeqs) {
  const meter = ctx.get('tokenMeter')
  let total = 0
  for (const seq of shadowedSeqs) {
    const event = session.eventAt(seq)
    if (event === undefined) continue
    const message = session.deriveEventMessage(event)
    if (message === null || message === undefined) continue
    total += meter === undefined ? roughTokens(message) : meter.estimateMessage(message)
  }
  return total
```

</details>

**依据 5 · 作者声明**：[README.md:65-77](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/README.md#L65-L77)

作者明确图为机制示意、缓存和账单不保证。

<details>
<summary>查看原文（13行）</summary>

```text
**Mechanism illustration, not an API benchmark.** Both panels replay the same
synthetic four-task workload with assigned token weights. Full bar = input
context; blue = modeled cache hits, orange = modeled cache misses. Cached tokens
still occupy the context window.

After a block closes, the next request carries a summary in place of its
completed work. Replacing history can also invalidate the cached suffix:
**smaller context does not guarantee a higher cache-hit rate or a lower bill**.
The closing assistant/tool pair settles before replacement; original user
messages remain. The baseline has not reached its automatic compaction threshold.

See the [data, assumptions and reproduction steps](docs/context-comparison/README.md).
The plugin's `tokensFreed` is not a provider cache-hit measurement.
```

</details>

#### 缺口

- 未取得同任务完整账单、摘要遗漏率和人工时间。
  **影响**：无法确定主动压缩比宿主自动压缩的净收益。
  **进一步探讨**：同主模型、同任务分别运行Block PTC和原PTC，记录摘要生成、重建缓存、失败修正及合格输出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何种试用和未来假设能被推翻？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合能清楚分出多个独立子任务、能检查日志且愿意核对摘要的维护者先试用，不适合把持续增长的用户约束完全交给模型自行压缩且无人核对的场景。先在可复做任务里给跨块共享约束加标记，关闭一个已完成块后继续另一个任务，核对约束、工具配对和pending最终落地。由连续区间会吞入其他块可推导未验证假设：在提交前展示区间内所有继承ID和待保留约束，可能减少主模型漏记跨块要求。对照现协议与预览协议，若错误率不降或预览费用大于收益，就否定它。本版本仅能验证结构与空值，不能自动证明摘要忠实；一旦后续任务丢约束、pending未完成或成本增加，停止该预设，查看原转录并回到原PTC继续。

#### 证据与依据

**依据 1 · 源码核查**：[lib/blocks.js:103-132](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/blocks.js#L103-L132)

区间及继承ID构成假设依据。

<details>
<summary>查看原文（30行）</summary>

```text
  const matches = rows.flatMap((row, index) => row.ids.some((id) => wanted.has(id)) ? [index] : [])
  const present = new Set(rows.flatMap((row) => row.ids))
  const missing = ids.filter((id) => !present.has(id))
  if (missing.length > 0) throw new Error(`block_compact: no current content for ids ${JSON.stringify(missing)}`)
  const first = matches[0]
  const last = matches[matches.length - 1]
  const span = rows.slice(first, last + 1)
  // Never discard instructions that arrived after the model wrote this summary.
  const invocation = requestSeq === undefined ? undefined : session.eventAt(requestSeq)
  const caller = invocation?.data?.parentCallId
  const generated = caller === undefined ? undefined : session.snapshotEvents().find((event) =>
    event.type === 'assistant/message' && event.data.message?.content?.some((part) => part.type === 'tool-call' && part.id === caller),
  )
  if (generated && span.some((row) => row.event.type === 'user/message' && row.seq > generated.seq && !summaryMetadata(row.event))) {
    throw new Error('block_compact: a new message arrived after this content was written; read it and submit updated content; nothing was replaced')
  }
  const protectedRows = span.filter((row) => !row.replaceable)
  if (protectedRows.length > 0) {
    const boundaries = protectedRows.map((row) => `${row.event?.type ?? 'unknown'} at seq ${row.seq}`).join(', ')
    throw new Error(`block_compact: the full interval contains protected system/developer messages (${boundaries}); nothing was replaced`)
  }
  if ((rows[first - 1]?.balance ?? 0) !== 0) throw new Error('block_compact: the interval starts inside an unfinished tool group')
  const inherited = [...new Set(span.flatMap((row) => row.ids))].filter((id) => !wanted.has(id))
  return {
    kind: rows[last].balance === 0 ? 'replace' : 'pending',
    startSeq: rows[first].seq,
    endSeq: rows[last].seq,
    shadowedSeqs: span.map((row) => row.seq),
    closedIds: ids,
    ids: inherited,
```

</details>

**依据 2 · 源码核查**：[lib/prompts.js:2-6](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/prompts.js#L2-L6)

摘要保留要求是模型指令，不是语义校验器。

```text
export const HEADER_GUIDANCE = 'Every run_code call, including the first, must use description "[block: <ids>] <goal>". Replace <ids> with the block ids and <goal> with the purpose of this operation. Separate multiple ids with commas; ids must be non-empty, unique, and contain no commas, brackets or line breaks.'

export const CONTENT_GUIDANCE = 'Organize the complete content from the first occurrence to the last occurrence of these ids. Preserve information still needed for subsequent work in full, with enough detail to continue directly. Briefly summarize information no longer needed, and omit irrelevant or duplicate material. Preserve user requirements, corrections and constraints accurately. Record completed work, results, unfinished work and the next step.'

export const COMPACT_GUIDANCE = 'Compact a block when its content is no longer needed, or its results have already been reported to the user and you are moving on to other work. Keep content still needed for upcoming execution, replies or discussion. Do not compact merely because a work step has finished.'
```

**依据 3 · 源码核查**：[lib/plugin.js:291-308](https://github.com/mengwEX/dsh-block-ptc/blob/c2afa0a0a34990aa7189ea6df377cd215e29f8d6/lib/plugin.js#L291-L308)

真实校验和pending边界。

<details>
<summary>查看原文（18行）</summary>

```text
    async execute(args, exec) {
      const session = exec.agent?.session
      if (session === undefined) throw new Error(`${BLOCK_COMPACT}: no session on this execution`)
      const ids = normalizeIds(args, BLOCK_COMPACT)
      if (typeof args.content !== 'string' || args.content.trim().length === 0) {
        throw new Error(
          `${BLOCK_COMPACT}: \`content\` is required and must be written by you`,
        )
      }
      requireSessionApi(session)
      const requestSeq = compactionRequestSeq(session, exec.callId)
      const plan = planReplacement(session, ids, requestSeq)
      if (plan.kind === 'pending' || compactionBusy(session)) {
        if (requestSeq === undefined) throw new Error(`${BLOCK_COMPACT}: no durable invocation to defer`)
        return { replaced: 0, tokensFreed: 0, pending: true, requestSeq, note: 'Waiting for tool results or the current compaction to finish.' }
      }
      const result = commitReplacement(ctx, session, plan, ids, args.content, requestSeq ?? null)
      return { replaced: result.replaced, tokensFreed: result.shadowedTokenCount, ...(plan.ids.length > 0 ? { ids: plan.ids } : {}) }
```

</details>

#### 缺口

- 区间预览假设未做任务对照。
  **影响**：不能确认它比现有提示更可靠或总成本更低。
  **进一步探讨**：用交错块和纠正指令组成同任务集，对比遗漏、人工复核与总费用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
