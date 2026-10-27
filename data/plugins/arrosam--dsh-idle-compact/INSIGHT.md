# dsh-idle-compact

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[009e04d](https://github.com/Arrosam/dsh-idle-compact/tree/009e04d8016b7ce96eb88f316ddbb6280d2005fd)

<!-- BEGIN META -->
[![npm 30d 880](https://img.shields.io/static/v1?label=npm+30d&message=880&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-idle-compact) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-idle-compact)
<!-- END META -->

> **功能**：在长会话空闲时预生成压缩摘要，并由用户确认后应用到会话。

> **亮点**：[Q01](#research-q01) 的贡献是将摘要计算与会话提交分离，复用宿主compact而保留用户确认；[Q02](#research-q02) 的异步作用域使普通并发调用不误用准备结果。属于预计算与事务式确认的具体组合，未证明算法原创或净节费。

> **主要限制**：[Q03](#research-q03) 说明缓存寿命只是延迟配置代理，摘要失效保护解决正确性的一部分，却不能证明预付请求比手动压缩更经济。供应商缓存与用户回访概率是核心限制。

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
  - [Q01 · 空闲期预压缩改变长会话的哪一步？](#detail-section-11)
  - [Q02 · 如何在不改活跃历史的情况下准备并应用摘要？](#detail-section-12)
  - [Q03 · 摘要失效检查能否证明节省费用？](#detail-section-13)
  - [Q04 · 未应用和失败摘要的成本由谁承担？](#detail-section-14)
  - [Q05 · 应用概率能否改善预压缩的净收益？](#detail-section-15)
  - [Q06 · 谁可先试，何时停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标是会离开后继续的长会话用户。原来要返回后手动compact或让宿主在压力下压缩；此插件把同一摘要请求提前到空闲期，用户回来再决定应用。合格交付是原有上下文被正确摘要且下一步可继续，不是仅出现按钮。相对提前自动压缩，其增量是分离准备和提交、保留用户控制；相对手动压缩，它引入可能根本不会使用的预付摘要成本。

参照手动宿主compact与直接空闲自动压缩；没有独立供应商费用实测。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 空闲准备 | 提前计算长会话摘要 | 正常结束、无后台任务、达到token阈值 |
| 请求回放 | 应用时复用同一次摘要响应 | 相同provider/model/messages等请求键 |
| 失效丢弃 | 活动变化后移除准备 | 内存保存，重启丢失 |

#### 启动与依赖
| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Web DSH与timer/commands/llm/sessions/connection | 必需 | 计时、压缩、回放、界面 | 插件无完整工作链 |
| tokenMeter与compaction | 每agent必需 | 资格和摘要 | 跳过准备 |
| 供应商缓存与用户返回 | 收益必需 | 兑现经济性 | 仍付预摘要成本 |

#### 启动步骤
| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 设置 | 用户配置阈值及idle秒数 | 设置表单生效 |
| 准备 | 宿主idle后检查活动并摘要副本 | 有当前有效准备 |
| 应用 | 用户点击应用 | 真实compact匹配回放 |
| 核对 | 用户续任务并看账单 | 内容保真且总费用符合预期 |

#### 成本
| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Web宿主资源，金额未知 | 配阈值与延迟，耗时未知 | 需匹配宿主API |
| 持续使用 | 每次准备一次摘要调用与内存 | 观察账单和摘要质量 | 缓存命中及应用概率未知 |
| 失败恢复 | 不匹配可能追加新模型调用 | 手动compact或重试 | abort计费未知 |

#### 效果
| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 不提前改活会话 | 分离copy接收compact | 宿主新版本兼容 |
| 避免重复相同请求 | 匹配后仅回放一次 | 总账单是否下降 |
| 失效保护 | surface签名与请求键 | 关键约束保真与完整接续 |

> **思考**：[Q03](#research-q03) 说明缓存寿命只是延迟配置代理，摘要失效保护解决正确性的一部分，却不能证明预付请求比手动压缩更经济。供应商缓存与用户回访概率是核心限制。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的贡献是将摘要计算与会话提交分离，复用宿主compact而保留用户确认；[Q02](#research-q02) 的异步作用域使普通并发调用不误用准备结果。属于预计算与事务式确认的具体组合，未证明算法原创或净节费。

PreparedStore单一拥有准备状态，RequestReplay用AsyncLocalStorage隔离并发范围，调度器独立处理abort，值得借鉴。移植需要稳定会话surface版本和可在副本运行的压缩服务；这些宿主内部约定是维护成本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 说明缓存寿命只是延迟配置代理，摘要失效保护解决正确性的一部分，却不能证明预付请求比手动压缩更经济。供应商缓存与用户回访概率是核心限制。

<a id="detail-section-6"></a>

### 1.5 使用建议

经常在超长会话停顿后返回、能核查供应商缓存计费的Web用户可在非关键会话试用。先确认正常idle才准备、恢复活动后失效、应用只回放相同请求，随后用同任务检查摘要遗漏与下一轮费用。以总尝试账单和合格接续共同验收，不能只看应用时零新请求。频繁废弃会话、缓存不可观测或严格保留全部历史的用户先观察；若净费用增加、摘要漏掉关键约束或宿主升级导致匹配失常，应停用。 [Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

分离准备、请求回放和失效路径有源码支持；缓存节省及摘要质量未验证；自适应策略是假设。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、src/prepare.js、src/replay.js、src/prepared-store.js、src/idle-scheduler.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本入口、prepare、replay、store、scheduler与README。
- 下一步：- 已检查固定源码。
- 未执行目标测试及宿主安装。
- 缓存命中、废弃支出和接续质量未测。

**分析版本**

- **仓库**：[Arrosam/dsh-idle-compact](https://github.com/Arrosam/dsh-idle-compact)
- **版本号**：0.3.0（[固定提交 009e04d](https://github.com/Arrosam/dsh-idle-compact/tree/009e04d8016b7ce96eb88f316ddbb6280d2005fd)）
- **版本日期**：2026-10-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出未验证的返回概率及cache usage联动策略。须对比总成本、合格接续和等待时间，任何质量下降或净费用上升都会削弱它。

- 已检查固定源码。
- 未执行目标测试及宿主安装。
- 缓存命中、废弃支出和接续质量未测。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 1029 | 649 | 288 | — |
| .md | source | 1 | 108 | — | — | 1069 |
| .mjs | test | 7 | 4240 | 3451 | 430 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-idle-compact/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-idle-compact/issues?q=is%3Aissue+created%3A2026-09-24T05%3A56%3A42.402Z..2026-10-24T05%3A56%3A42.402Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-idle-compact/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T05%3A56%3A42.402Z..2026-10-24T05%3A56%3A42.402Z)



统计日期：2026-10-24。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：空闲期预压缩能否在不使用过期摘要的前提下降低长会话接续成本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 空闲期预压缩改变长会话的哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是会离开后继续的长会话用户。原来要返回后手动compact或让宿主在压力下压缩；此插件把同一摘要请求提前到空闲期，用户回来再决定应用。合格交付是原有上下文被正确摘要且下一步可继续，不是仅出现按钮。相对提前自动压缩，其增量是分离准备和提交、保留用户控制；相对手动压缩，它引入可能根本不会使用的预付摘要成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:13-25](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/README.md#L13-L25)

声明准备、用户确认和失效语义；源码在Q02核对。

<details>
<summary>查看原文（13行）</summary>

```text
1. When a session finishes a turn and waits for you, a timer starts.
2. Any new activity in that session cancels the timer, whether it's you replying or the agent starting work.
3. When the timer fires, the plugin prepares a compaction only if all of these hold:
   - the agent is still idle and its last turn finished normally (not an error or a stop);
   - no background job or subagent is running for the session;
   - the session's context, measured with DSH's token meter, has reached the threshold.
4. Preparing runs exactly the summarization request DSH's `/compact` would make, and keeps the result. Your session is not changed.
5. An **Apply compaction** bar appears just above the message input, showing how many history items it covers.
6. Clicking it runs DSH's own `/compact` command, exactly as if you had typed it, and answers its summarization request with the prepared result, so no new model call is made. The conversation shows the usual `/compact` card with its "Compacted N history items" reply.

The prepared summary is only valid for the conversation it summarized. If you send another message (or the history changes in any other way), it is discarded and the button disappears; the next idle period that qualifies prepares a fresh one. If the conversation somehow differs at the moment you click, `/compact` makes its own model call instead of using a stale summary.

When the plugin starts or is reloaded (a DSH restart, a plugin update), sessions that are already waiting are timed from the end of their last turn. A session idle for less than the idle delay is timed for only the remaining seconds. A session idle for longer is skipped entirely, because the provider's cache has most likely expired and preparing would cost full price. It qualifies again after its next turn.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何在不改活跃历史的情况下准备并应用摘要？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

prepare先确认idle、正常turn结束、无后台活动、压缩和token服务可用且达到阈值。它用当前Session构造器复制事件到分离会话，将compactNow作用于副本，记录该异步调用链中的摘要流。apply调用真实commands.execute('/compact')，仅对provider、model、maxTokens、tools、toolHistory和messages构成的相同请求回放一次。依赖timer、commands、llm、sessions、connection及agent作用域内compaction服务；宿主API变化会影响副本和请求匹配。

#### 证据与依据

**依据 1 · 源码核查**：[src/prepare.js:62-82](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/prepare.js#L62-L82)

资格门槛和分离复制。

<details>
<summary>查看原文（21行）</summary>

```text
export async function checkEligible(ctx, agent, thresholdTokens, isPrepared) {
  if (agent.status !== AGENT.statusIdle) return { skip: SKIP.busy }
  if (!lastTurnCompleted(agent.session)) return { skip: SKIP.turnNotCompleted }
  if (await hasBackgroundWork(ctx, agent.session)) return { skip: SKIP.backgroundWork }
  const meter = serviceFor(ctx, agent, SERVICE.tokenMeter)
  const compaction = serviceFor(ctx, agent, SERVICE.compaction)
  if (meter === undefined || compaction === undefined) return { skip: SKIP.servicesUnavailable }
  const tokens = meter.measure(agent.session).totalTokens
  if (tokens < thresholdTokens) return { skip: SKIP.belowThreshold, tokens }
  if (isPrepared()) return { skip: SKIP.alreadyPrepared, tokens }
  return { compaction, tokens }
}

/**
 * A detached replay of the session's log. DSH's `Session` class is reached through the
 * live instance rather than imported, so the copy is built by exactly the runtime that
 * built the session (a profile plugin may otherwise resolve a different dsh-session).
 * Appends to a detached session notify no observer and reach no persistence.
 */
function detachedCopy(ctx, session) {
  return session.constructor.create(session.id, session.snapshotEvents(), session.header, session.inheritedEventCount, ctx.sessions.messageProjections)
```

</details>

**依据 2 · 源码核查**：[src/prepare.js:103-126](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/prepare.js#L103-L126)

压缩在副本提交并返回记录。

<details>
<summary>查看原文（24行）</summary>

```text
export async function prepareCompaction(ctx, replay, agent, compaction, signal) {
  const session = agent.session
  const signature = surfaceSignature(session)
  const copy = detachedCopy(ctx, session)
  const fromSeq = copy.seq
  const proxy = {
    session: copy,
    options: agent.options,
    // The copy has no driver to serialize against; run the job under this operation's signal.
    runMaintenance: (job) => job(signal),
  }
  const { recording } = await replay.record(async () => {
    try {
      await compaction.compactNow(proxy, signal)
    } catch (error) {
      // The engine ends with a durability checkpoint (`sessions.flush`) that only a live,
      // persisted session can pass. The summary is committed to the copy before it, so
      // this one failure still leaves a complete result to read below.
      if (error?.code !== COMPACTION.persistenceFailureCode) throw error
    }
  })
  const summary = committedSummary(copy, fromSeq)
  if (summary === undefined || recording.key === undefined) return undefined
  return { agent, key: recording.key, chunks: recording.chunks, signature, items: summary.shadowedSeqs.length, tokens: summary.shadowedTokenCount }
```

</details>

**依据 3 · 源码核查**：[src/replay.js:62-82](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/replay.js#L62-L82)

请求不同就走真实模型而非回放。

<details>
<summary>查看原文（21行）</summary>

```text
  intercept(options, next) {
    const marker = this.#scope.getStore()
    if (marker === undefined || options.purpose !== COMPACTION.requestPurpose) return next()
    const key = requestKey(options)
    if (marker.recording !== undefined) {
      // Keep the LAST request: if the engine's summary-error recovery retries, the retry's
      // response is the one that produced the committed summary.
      marker.recording.key = key
      marker.recording.chunks = []
      return recordStream(next(), marker.recording.chunks)
    }
    // Replay at most once, and only for the identical request. Work the apply schedules
    // (a turn woken when maintenance ends) inherits this async context; its own pressure
    // compaction asks something different, or comes after the replay, and goes to the model.
    if (marker.replayed || marker.replayFrom.key !== key) {
      if (!marker.replayed) this.#logger.info('session %s: compaction request differs from the prepared one; making a fresh call', options.sessionId)
      return next()
    }
    marker.replayed = true
    this.#logger.info('session %s: applying prepared compaction without a new LLM call', options.sessionId)
    return replayStream(marker.replayFrom.chunks)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摘要失效检查能否证明节省费用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

正确性防线是surface generation与节点长度签名、会话事件重校验及应用时完整请求键；活动变化取消计时和工作，匹配失败时回退新调用。这些设计支持避免明显过期回放，却不能证明供应商cache仍热。代码将idleSeconds当作缓存寿命代理，重启时超时会话跳过；供应商逐出策略、前缀变化与缓存计费未被探测。即便机制完全正确，准备后会话废弃也会白花摘要费用，因此节费应为条件假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/prepared-store.js:63-86](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/prepared-store.js#L63-L86)

签名失效与主动重检。

<details>
<summary>查看原文（24行）</summary>

```text
   * The prepared entry for a session, dropped if the visible history changed since.
   * @returns {PreparedEntry | undefined}
   */
  current(session) {
    const entry = this.#entries.get(session)
    if (entry === undefined || entry.signature === surfaceSignature(session)) return entry
    this.drop(session)
    return undefined
  }

  /** Store a freshly prepared entry and notify watchers. */
  set(session, entry) {
    this.#entries.set(session, entry)
    this.#publish(session)
  }

  /** Discard a session's entry, if any, and notify watchers. */
  drop(session) {
    if (this.#entries.delete(session)) this.#publish(session)
  }

  /** Re-check staleness after a log append, except while applying writes its own events. */
  revalidate(session) {
    if (this.#entries.has(session) && !this.#applying.has(session)) this.current(session)
```

</details>

**依据 2 · 源码核查**：[index.js:132-144](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/index.js#L132-L144)

delay作为KV寿命代理而非供应商确认。

<details>
<summary>查看原文（13行）</summary>

```text
  // The same gap after a reload: a plugin update or profile recomposition restarts this
  // plugin while sessions already wait idle, and neither event above fires for them.
  // Only sessions idle for less than the idle delay are armed, for the rest of it: the
  // delay is the plugin's stand-in for the provider's KV-cache lifetime (the user's rule),
  // so a session idle longer has a cold cache and preparing it would pay full input price.
  // A session with no finished turn has no idle start to measure, so it is skipped too.
  for (const agent of ctx.get(SERVICE.agents)?.list() ?? []) {
    if (agent.status !== AGENT.statusIdle) continue
    const idleSinceMs = lastTurnEnd(agent.session)?.time
    if (idleSinceMs === undefined) continue
    const elapsedMs = Math.max(0, Date.now() - idleSinceMs)
    if (elapsedMs < scheduler.delayMs()) scheduler.arm(agent, elapsedMs)
    else logger.info('session %s: idle compaction skipped (%s)', agent.id, START_SKIP.cacheExpired)
```

</details>

#### 缺口

- 真实缓存命中率、准备后应用比例和摘要质量没有同条件数据。
  **影响**：无法确认净节省或保证接续质量。
  **进一步探讨**：按供应商记录cache usage、被丢弃准备与合格接续任务成本，对比手动compact。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 未应用和失败摘要的成本由谁承担？

**研究主题**：效果与总成本

#### 完整回答

以一次压缩后仍能正确继续任务为合格单位。首次需要Web宿主配置阈值和延迟；持续每次准备都产生模型摘要请求，保存记录占内存，重启丢弃；请求不同会再付一次正常compact调用费用。活动时abort不保证供应商未计费。用户承担阈值调优和摘要质量复核，失败后可回到手动compact。没有缓存计价与应用概率，不能把提前执行称免费或给ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:59-63](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/README.md#L59-L63)

作者明确每次准备收费及内存丢失。

```text
## Token cost

Each prepared compaction makes one summarization call to your model. It's cheap because the cache is warm, but it is spent even if you never click Apply or never return to that session. If most of your idle sessions are ones you abandon, raise the threshold.

Prepared summaries are kept in memory only. Restarting DSH discards them.
```

**依据 2 · 源码核查**：[src/replay.js:76-82](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/replay.js#L76-L82)

不匹配时新调用带来潜在追加支出。

```text
    if (marker.replayed || marker.replayFrom.key !== key) {
      if (!marker.replayed) this.#logger.info('session %s: compaction request differs from the prepared one; making a fresh call', options.sessionId)
      return next()
    }
    marker.replayed = true
    this.#logger.info('session %s: applying prepared compaction without a new LLM call', options.sessionId)
    return replayStream(marker.replayFrom.chunks)
```

#### 缺口

- 模型价格、缓存命中、废弃比例与人工复核时间未知。
  **影响**：没有合格交付单位成本。
  **进一步探讨**：记录全部准备尝试和最终使用结果，含失败与被废弃支出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应用概率能否改善预压缩的净收益？

**研究主题**：新假设与验证

#### 完整回答

从未应用准备也收费与固定延迟代理缓存两点推导，可仅对预计会返回、且供应商明确支持缓存窗口的会话预准备。未验证方案是以最近会话返回频率和实际cache usage调节阈值，用户可选择隐私友好的本地统计。新代价是预测偏差、状态维护与错过可节省窗口。最小实验与固定300秒规则对比，使用同模型同任务，统计全部现金成本、合格接续率和等待时间；若降低调用次数却增加总费用或丢失质量，则否定收益。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:132-144](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/index.js#L132-L144)

现有固定代理窗口。

<details>
<summary>查看原文（13行）</summary>

```text
  // The same gap after a reload: a plugin update or profile recomposition restarts this
  // plugin while sessions already wait idle, and neither event above fires for them.
  // Only sessions idle for less than the idle delay are armed, for the rest of it: the
  // delay is the plugin's stand-in for the provider's KV-cache lifetime (the user's rule),
  // so a session idle longer has a cold cache and preparing it would pay full input price.
  // A session with no finished turn has no idle start to measure, so it is skipped too.
  for (const agent of ctx.get(SERVICE.agents)?.list() ?? []) {
    if (agent.status !== AGENT.statusIdle) continue
    const idleSinceMs = lastTurnEnd(agent.session)?.time
    if (idleSinceMs === undefined) continue
    const elapsedMs = Math.max(0, Date.now() - idleSinceMs)
    if (elapsedMs < scheduler.delayMs()) scheduler.arm(agent, elapsedMs)
    else logger.info('session %s: idle compaction skipped (%s)', agent.id, START_SKIP.cacheExpired)
```

</details>

**依据 2 · 作者声明**：[README.md:59-63](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/README.md#L59-L63)

浪费准备提供优化依据。

```text
## Token cost

Each prepared compaction makes one summarization call to your model. It's cheap because the cache is warm, but it is spent even if you never click Apply or never return to that session. If most of your idle sessions are ones you abandon, raise the threshold.

Prepared summaries are kept in memory only. Restarting DSH discards them.
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁可先试，何时停止？

**研究主题**：采用判断

#### 完整回答

经常在超长会话停顿后返回、能核查供应商缓存计费的Web用户可在非关键会话试用。先确认正常idle才准备、恢复活动后失效、应用只回放相同请求，随后用同任务检查摘要遗漏与下一轮费用。以总尝试账单和合格接续共同验收，不能只看应用时零新请求。频繁废弃会话、缓存不可观测或严格保留全部历史的用户先观察；若净费用增加、摘要漏掉关键约束或宿主升级导致匹配失常，应停用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:97-112](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/index.js#L97-L112)

应用消费一次准备结果。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Apply the prepared compaction through the real `/compact` command. */
  const applyPrepared = async (session) => {
    const entry = store.current(session)
    if (entry === undefined) return { ok: false, code: APPLY_CODE.notPrepared }
    if (store.isApplying(session)) return { ok: false, code: APPLY_CODE.applying }
    const controller = new AbortController()
    applying.add(controller)
    store.beginApply(session)
    try {
      const execution = await replay.replay(entry, () => ctx.commands.execute(entry.agent, COMPACTION.commandLine, COMPACTION.noAttachments, controller.signal))
      if (execution === undefined) return { ok: false, code: APPLY_CODE.commandUnavailable }
      return { ok: execution.result.kind === COMPACTION.resultSuccess, result: execution.result }
    } finally {
      applying.delete(controller)
      store.endApply(session)
    }
```

</details>

**依据 2 · 源码核查**：[src/idle-scheduler.js:39-51](https://github.com/Arrosam/dsh-idle-compact/blob/009e04d8016b7ce96eb88f316ddbb6280d2005fd/src/idle-scheduler.js#L39-L51)

活动取消与子agent排除。

<details>
<summary>查看原文（13行）</summary>

```text
  arm(agent, elapsedMs = 0) {
    this.disarm(agent)
    // Subagents never receive a user reply; compacting them would only spend tokens.
    if (agent.session?.header?.origin === AGENT.subagentOrigin) return
    this.#timers.set(agent, this.#ctx.timeout(() => { void this.#fire(agent) }, this.delayMs() - elapsedMs))
  }

  /** Cancel the agent's timer and abort any work it started. */
  disarm(agent) {
    const dispose = this.#timers.get(agent)
    if (dispose !== undefined) { this.#timers.delete(agent); dispose() }
    const controller = this.#working.get(agent)
    if (controller !== undefined) { this.#working.delete(agent); controller.abort() }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
