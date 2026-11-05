# dsh-deepcanary

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[07a5665](https://github.com/Oscar-Williams/dsh-deepcanary/tree/07a56658e8e6130644da68c68b57067dbe3c09c4)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Oscar-Williams/dsh-deepcanary) [![npm 30d 1,754](https://img.shields.io/static/v1?label=npm+30d&message=1%2C754&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepcanary) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-deepcanary)
<!-- END META -->

> **功能**：将 DSH 待答、审批和完成事件整理到收件箱，并协调本地通知。

> **亮点**：[Q01](#research-q01) 把瞬时事件变成可延后和回看的待办。

> **主要限制**：[Q02](#research-q02) claim按owner协调，回调主要按客户端时间推进，不是严格attempt fencing。

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
  - [Q01 · 任务变化怎样变成可跟进收件箱？](#detail-section-11)
  - [Q02 · 多标签页claim与回调到底防住哪些重复？](#detail-section-12)
  - [Q03 · 什么时候收件箱比单通知更适合？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：同时运行多个会话的用户需要回看和处理等待项。

原生会话列表和瞬时浏览器通知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 收件箱 | 分类并保留任务变化 | 依赖权威会话读取 |
| 处理 | 已读/延后/静音与跳转 | 任务执行仍由宿主 |
| 通知 | 多标签claim和阶段回调 | 回调不校验claim owner；时间比较不证明OS可见或严格一次 |
| 恢复 | 重启恢复items与投递账本 | 策略版本和陈旧收敛需验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容Host与权威会话列表 | 必需 | 基线和等待状态 | 版本/读取失败影响完整性 |
| 浏览器Notification及权限 | 通知需要 | OS提醒 | 拒绝不妨碍收件箱查看 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 观察 | 固定两会话事件集 | 待办分类正确 |
| 处理 | 跳转/延后/静音 | 会话与状态匹配 |
| 恢复 | 双标签重连并核查旧项目 | 旧claim、晚到attempt和陈旧审批分别核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 匹配Host并授权通知 | 先测试profile |
| 持续 | 存储和人工未知 | 检查噪音和陈旧状态 | 持久元数据有维护 |
| 失败 | 排障工时未知 | 回原任务列表核对 | 禁用不取消任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 待办 | 源码可保存恢复items与延后 | 实际漏任务率 |
| 投递协调 | 源码save后grant，item generation拦条件陈旧；回调按客户端时间推进 | 同generation旧attempt接管影响、OS可见与重复率 |

> **思考**：[Q02](#research-q02) claim按owner协调，回调主要按客户端时间推进，不是严格attempt fencing。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把瞬时事件变成可延后和回看的待办。

[Q02](#research-q02) claim持久化协调发送机会，回调的客户端时间比较不能替代owner或attempt fencing。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) claim按owner协调，回调主要按客户端时间推进，不是严格attempt fencing。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 固定事件集和双标签测试后再日用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对基线、恢复和投递授权，未跑浏览器。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/adapters/dsh.ts、src/core/delivery.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定adapter、service和delivery，未运行OS通知。
- 下一步：启动竞争、旧回调、写失败、重启与实际点击。

**分析版本**

- **仓库**：[Oscar-Williams/dsh-deepcanary](https://github.com/Oscar-Williams/dsh-deepcanary)
- **版本号**：0.1.9-rc.1（[固定提交 07a5665](https://github.com/Oscar-Williams/dsh-deepcanary/tree/07a56658e8e6130644da68c68b57067dbe3c09c4)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 固定事件集比较漏处理和打断。

启动竞争、旧回调、写失败、重启与实际点击。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 29 | 1505 | — | — | 16600 |
| .js | source | 32 | 10984 | 10679 | 311 | — |
| .mjs | source | 43 | 5589 | 5297 | 57 | — |
| .ts | source | 41 | 12090 | 10985 | 379 | — |
| .ts | test | 40 | 5871 | 5468 | 41 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Oscar-Williams/dsh-deepcanary/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Oscar-Williams/dsh-deepcanary/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)

暂未获取：近30天关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：任务收件箱能否减少漏处理并避免重复或陈旧提醒？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务变化怎样变成可跟进收件箱？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

DeepCanary 将需要回答/审批的任务放 Pending，延后放 Snoozed，普通完成放 Activity，导航回原会话。服务订阅 DSH adapter，adapter 启动时先缓冲增量、读取权威会话集合，再发布基线并排空缓冲；第二次读取检验集合一致，在切到 live 后再排尾部事件。这改变了仅看瞬时 toast 的跟进流程，使用户能回看待办。恢复时服务从持久状态读 items、dedupe、预算和 deliveryLedger，只有匹配 policyVersion 的运行状态才沿用；因此需要核对当前宿主能提供权威列表，不能以 UI 出现项目就证明所有事件都捕获。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-22](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/README.md#L14-L22)

任务收件箱和兼容要求。

```text
DeepCanary groups task updates in **Pending**, **Snoozed**, and **Activity**. It reminds you when DSH needs an answer or approval, keeps routine completions in Activity, and returns you to the corresponding session.

<p align="center"><img src="assets/deepcanary-panel-en.png" width="880" alt="DeepCanary inbox with task list and details"></p>

[Install](#install) · [Use](#use) · [Notifications](#notifications) · [Update or remove](#update-or-remove) · [Compatibility](#compatibility) · [Troubleshooting](#troubleshooting) · [Security](#security-and-privacy) · [Contributing](#contributing) · [Acknowledgments](#acknowledgments) · [License](#license)

## Install

DeepCanary **0.1.9-rc.1** requires DSH `0.2.1-rc.5` or `0.2.2-alpha.3` and later. Check the [Node.js requirements for WebUI](#compatibility) before installing. Windows Desktop includes its own runtime. [Install DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness#readme).
```

**依据 2 · 源码核查**：[src/service.ts:286-303](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L286-L303)

订阅与初始化拒绝状态。

<details>
<summary>查看原文（18行）</summary>

```text
    this.adapterSubscription = this.adapter.subscribe(event => {
      if (event.type === 'session/created') this.onSessionCreated(event.session, event.snapshot)
      else if (event.type === 'session/event') this.onSessionEvent(event.session, event.event, event.snapshot)
      else this.onSessionDisposed(event.session)
    })
    void this.adapter.start().then(() => this.normalizeLifecycle(Date.now())).catch(() => {
      this.disposed = true
      this.logger.error?.(`${PLUGIN_NAME}: initialization failed; state access refused`)
      this.adapterSubscription?.dispose()
    })
    void this.ready.catch(() => {
      this.disposed = true
      this.adapterSubscription?.dispose()
      if (this.interval) clearInterval(this.interval)
      if (this.hostProbeInterval) clearInterval(this.hostProbeInterval)
      this.logger.error?.(`${PLUGIN_NAME}: state ownership validation failed; writes refused`)
    })
    this.ctx.effect?.(() => () => this.dispose(), 'deepcanary: pending state and timers')
```

</details>

**依据 3 · 源码核查**：[src/adapters/dsh.ts:248-280](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/adapters/dsh.ts#L248-L280)

基线和增量协调。

<details>
<summary>查看原文（33行）</summary>

```text
      // that was previously live and is now absent has converged to the
      // disposal edge; publish that edge so the service can retain its
      // summaries but mark live navigation unavailable, without a missed firehose
      // event. This only runs after a successful authoritative read.
      for (const sessionId of previouslyActive) {
        if (authoritative.has(sessionId)) continue
        const previous = this.snapshots.get(sessionId)
        if (previous === undefined || !previous.active) continue
        const disposed = { ...previous, active: false }
        this.snapshots.set(sessionId, disposed)
        this.emit({ type: 'session/disposed', session: { id: sessionId }, snapshot: disposed })
      }

      // Publish authoritative startup state while the incremental source is
      // still buffered. This gives subscribers a complete baseline before any
      // post-baseline event is released.
      for (const { session, snapshot } of authoritative.values()) {
        this.emit({ type: 'session/created', session, snapshot })
      }

      skippedBufferedEvents += this.drainBuffered(baseline)

      // A second authoritative read closes the interval around the first
      // snapshot. Events observed during this read remain in the buffer and
      // are released through the same idempotent sequence check.
      const verifiedSessions = normalizeSessionList(await this.sessionStore!.list!())
      skippedBufferedEvents += this.drainBuffered(baseline)
      const verified = sameAuthoritativeSessionSet(verifiedSessions, authoritative.keys(), this.snapshots)
      this.reconciling = false
      // Drain once more after switching the phase so an event delivered at the
      // boundary becomes an ordinary live event rather than a lost edge.
      const trailing = this.bufferedEvents.splice(0)
      for (const event of trailing) this.publishLive(event)
```

</details>

**依据 4 · 源码核查**：[src/service.ts:1321-1332](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L1321-L1332)

持久化恢复。

<details>
<summary>查看原文（12行）</summary>

```text
      const restored = await this.store.loadState()
      this.items.splice(0, this.items.length, ...retainInboxItems(restored.items, this.config.maxInboxItems))
      for (const item of this.items) this.restoredAttention.add(item.id)
      this.background.restore(restored.backgroundWatches)
      if (restored.runtime?.policyVersion === ATTENTION_POLICY_VERSION) {
        this.revision = Math.max(this.revision, (restored.runtime.revision ?? 0) + 1)
        this.dedupe.restore(restored.runtime.dedupe)
        this.budget.restore(restored.runtime.interruptConsumedAt)
        this.deliveryLedger.restore(restored.runtime.deliveryLedger)
        this.automation.restore(restored.runtime.automationRuns ?? [])
        for (const source of restored.runtime.deferredSources ?? []) this.deferredSources.set(source.sessionRef, source.sourceSeq)
        this.rescanAll = restored.runtime.rescanAll === true
```

</details>

#### 缺口

- 真实多会话与断线事件未运行
  **影响**：待办完整性和陈旧项目收敛未知
  **进一步探讨**：启动期间触发事件并核对重连后相同集合

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 多标签页claim与回调到底防住哪些重复？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

浏览器先申请逻辑投递claim。服务核对item的notificationGeneration、资格和次数，claim以短期clientInstance owner及期限占位，同标签重试幂等，另一标签租期内拒绝；返回前等待queueSave，写失败返回unavailable。这能协调获得发送机会，但回调没有延续同一owner检查。recordNotificationDelivery核对item generation、notificationRef、tagRef和titleKey，校验attemptId为opaque格式及observedAt可解析；传给ledger的字段没有claim owner，也没有由Host签发并比对的attempt序号。notificationGeneration是收件箱条件版本，多个attempt可属于同一generation，不能当投递代际fence。ledger.record用attemptHashes判断曾见attempt，状态推进主要取决于客户端observedAt是否不早于current.updatedAt和canAdvance。只有current为planned且有owner、incoming时间更旧时才直接拒绝；旧attempt若在新claim后产生clicked/error并用新的客户端时间，可进入新attempt分支并推进状态。客户端attempted沿用构造前时间，error、clicked及handler-attached则在各自回调时new Date，所以“晚到旧attempt”和“时间戳旧”不等价。较旧时间的回调在其它状态也可能加入attemptHashes或更改firstObservedAt，不能笼统说完全忽略。状态阶梯阻止已观测成功被错误抹除，但不是严格owner/attempt fencing。OS是否实际展示仍无法由constructed或点击handler安装来证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:1075-1095](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L1075-L1095)

claim校验和save后授权。

<details>
<summary>查看原文（21行）</summary>

```text
  private async claimNotification(id: string, payload: Record<string, unknown>): Promise<DeliveryClaimOutcome> {
    this.normalizeLifecycle(Date.now())
    const item = this.find(id)
    if (item === undefined || (payload.notificationGeneration ?? 0) !== notificationGeneration(item)) return 'unavailable'
    if (this.deliveryLedger.completed(item.id, notificationCondition(item))) return 'already-complete'
    if (this.deliveryLedger.exhausted(item.id, notificationCondition(item))) {
      this.bumpRevision()
      return 'exhausted'
    }
    if (!this.notificationEligible(item)) return 'unavailable'
    const result = this.deliveryLedger.claim({
      verdictId: item.id,
      conditionGeneration: notificationCondition(item),
      sink: 'browser',
      clientInstance: payload.notificationClientInstance as string,
      expiresAt: payload.notificationExpiresAt as string,
      claimedAt: new Date(Date.now()).toISOString(),
    })
    this.syncSupervisor()
    this.bumpRevision()
    return await this.queueSave() ? result.outcome : 'unavailable'
```

</details>

**依据 2 · 源码核查**：[src/service.ts:1099-1149](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L1099-L1149)

回调字段与无owner验证。

<details>
<summary>查看原文（51行）</summary>

```text
  private async recordNotificationDelivery(id: string, payload: Record<string, unknown>): Promise<boolean> {
    const item = this.find(id)
    if (item === undefined || (payload.notificationGeneration ?? 0) !== notificationGeneration(item)) return false
    const stage = payload.notificationStage as DogfoodNotificationStage
    const notificationAttemptId = payload.notificationAttemptId as string
    const notificationRef = payload.notificationRef as string
    const tagRef = payload.tagRef as string
    const titleKey = payload.titleKey as string
    if (notificationRef !== hashMetadata(`${notificationKey(item)}:notification`)
      || tagRef !== hashMetadata(`${notificationKey(item)}:tag`)
      || titleKey !== `notification.title.${item.reasonCode}`) return false
    const delivery: DogfoodNotificationDelivery = {
      notificationAttemptId,
      notificationRef,
      tagRef,
      titleKey,
      bodyFingerprint: payload.bodyFingerprint as string,
      stages: [stage],
      firstObservedAt: payload.observedAt as string,
      ...(stage === 'clicked' ? { clickedAt: payload.observedAt as string } : {}),
    }
    this.deliveryLedger.record({
      verdictId: item.id,
      conditionGeneration: notificationCondition(item),
      sink: 'browser',
      attemptId: notificationAttemptId,
      stage,
      observedAt: delivery.firstObservedAt,
    })
    this.dogfoodRecorder?.recordNotificationDelivery(item.id, delivery)
    this.syncSupervisor()
    this.bumpRevision()
    return this.queueSave()
  }

  private isNotificationDeliveryPayload(payload: Record<string, unknown>): boolean {
    const stage = payload.notificationStage
    const notificationAttemptId = payload.notificationAttemptId
    const notificationRef = payload.notificationRef
    const tagRef = payload.tagRef
    const titleKey = payload.titleKey
    const bodyFingerprint = payload.bodyFingerprint
    const observedAt = payload.observedAt
    if (stage !== 'attempted' && stage !== 'constructed' && stage !== 'click-handler-attached' && stage !== 'clicked' && stage !== 'error') return false
    if (typeof notificationAttemptId !== 'string' || !opaqueRefPattern.test(notificationAttemptId)) return false
    if (typeof notificationRef !== 'string' || !opaqueRefPattern.test(notificationRef)) return false
    if (typeof tagRef !== 'string' || !opaqueRefPattern.test(tagRef)) return false
    if (typeof titleKey !== 'string' || !notificationTitlePattern.test(titleKey)) return false
    if (typeof bodyFingerprint !== 'string' || !opaqueRefPattern.test(bodyFingerprint)) return false
    if (typeof observedAt !== 'string' || !Number.isFinite(Date.parse(observedAt))) return false
    return true
```

</details>

**依据 3 · 源码核查**：[src/core/delivery.ts:162-204](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/core/delivery.ts#L162-L204)

owner仅claim阶段协调。

<details>
<summary>查看原文（43行）</summary>

```text
  claim(input: DeliveryClaimInput): DeliveryClaimResult {
    if (!isPrintable(input.verdictId)
      || !isPrintable(input.conditionGeneration)
      || input.sink !== 'browser'
      || !isPrintable(input.clientInstance)) return { outcome: 'unavailable' }
    const claimedAt = input.claimedAt ?? new Date().toISOString()
    const claimedAtMs = Date.parse(claimedAt)
    const expiresAtMs = Date.parse(input.expiresAt)
    if (!Number.isFinite(claimedAtMs)
      || !Number.isFinite(expiresAtMs)
      || expiresAtMs <= claimedAtMs
      || expiresAtMs - claimedAtMs > MAX_CLAIM_MS) return { outcome: 'unavailable' }

    const logicalKeyHash = logicalHash(input.verdictId, input.conditionGeneration, input.sink)
    const current = this.entries.get(logicalKeyHash)
    if (current !== undefined) {
      if (isComplete(current.state)) return { outcome: 'already-complete', logicalKeyHash }
      const currentExpiry = current.claimExpiresAt === undefined ? Number.NaN : Date.parse(current.claimExpiresAt)
      if (current.claimOwnerHash !== undefined && Number.isFinite(currentExpiry) && currentExpiry > claimedAtMs) {
        const ownerHash = hash(input.clientInstance)
        if (ownerHash !== current.claimOwnerHash) {
          return {
            outcome: 'already-claimed',
            logicalKeyHash,
            ...(current.claimExpiresAt === undefined ? {} : { claimExpiresAt: current.claimExpiresAt }),
          }
        }
        // A retry from the same tab is idempotent and may continue its claim.
        return {
          outcome: 'granted',
          logicalKeyHash,
          ...(current.claimExpiresAt === undefined ? {} : { claimExpiresAt: current.claimExpiresAt }),
        }
      }
      const claimAttempts = current.claimAttempts ?? 0
      if (claimAttempts >= MAX_DELIVERY_ATTEMPTS) return { outcome: 'exhausted', logicalKeyHash }
      current.claimOwnerHash = hash(input.clientInstance)
      current.claimExpiresAt = input.expiresAt
      current.claimAttempts = claimAttempts + 1
      current.updatedAt = claimedAt
      this.entries.set(logicalKeyHash, current)
      this.trim()
      return { outcome: 'granted', logicalKeyHash, claimExpiresAt: input.expiresAt }
```

</details>

**依据 4 · 源码核查**：[src/core/delivery.ts:223-278](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/core/delivery.ts#L223-L278)

时间、attempt与状态推进完整分支。

<details>
<summary>查看原文（56行）</summary>

```text
  record(input: DeliveryRecordInput): void {
    const observedAt = Date.parse(input.observedAt)
    if (!Number.isFinite(observedAt)) return
    const logicalKeyHash = logicalHash(input.verdictId, input.conditionGeneration, input.sink)
    const attemptHash = hash(input.attemptId)
    const incomingState = stateForStage(input.stage)
    const current = this.entries.get(logicalKeyHash)
    if (current === undefined) {
      this.entries.set(logicalKeyHash, {
        logicalKeyHash,
        sink: input.sink,
        attemptHash,
        attemptHashes: [attemptHash],
        state: incomingState,
        attempts: 1,
        firstObservedAt: input.observedAt,
        updatedAt: input.observedAt,
      })
      this.trim()
      return
    }

    const sameAttempt = current.attemptHashes.includes(attemptHash)
    const currentTime = Date.parse(current.updatedAt)
    const incomingIsNewer = !Number.isFinite(currentTime) || observedAt >= currentTime
    // A callback from an older browser attempt must not mutate a fresh
    // planned claim (or invalidate its planned-entry shape) after another
    // tab has taken over. The newer claimant remains authoritative.
    if (current.state === 'planned' && current.claimOwnerHash !== undefined && !incomingIsNewer) return
    const next = { ...current }
    if (!sameAttempt) {
      next.attempts = Math.min(MAX_ENTRIES, current.attempts + 1)
      next.attemptHashes = [...current.attemptHashes, attemptHash].slice(-16)
      // A new attempt can reopen a failed/superseded logical delivery. A
      // successful terminal state remains visible while the retry is tracked.
      if (incomingIsNewer && canAdvance(current.state, incomingState)) {
        next.state = incomingState
        next.attemptHash = attemptHash
        next.updatedAt = input.observedAt
      }
    } else if (incomingIsNewer && canAdvance(current.state, incomingState)) {
      next.state = incomingState
      next.updatedAt = input.observedAt
    }

    if (incomingState === 'failed' && incomingIsNewer && canAdvance(current.state, incomingState)) {
      delete next.claimOwnerHash
      delete next.claimExpiresAt
    } else if (incomingState !== 'failed' && isComplete(next.state)) {
      delete next.claimOwnerHash
      delete next.claimExpiresAt
    }

    if (observedAt < Date.parse(next.firstObservedAt)) next.firstObservedAt = input.observedAt
    this.entries.set(logicalKeyHash, next)
    this.trim()
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:1477-1504](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/client/index.ts#L1477-L1504)

attempt及初始时间生成。

<details>
<summary>查看原文（28行）</summary>

```text
    const observedAt = new Date().toISOString()
    attempted.add(key)
    try {
      window.localStorage.setItem(ATTEMPTED_NOTIFICATION_KEY, JSON.stringify([...attempted].slice(-100)))
    } catch {
      // Notification deduplication is best effort.
    }
    let notificationAttemptId: string | undefined
    if (delivery !== undefined) {
      try {
        notificationAttemptId = await opaqueRef(`${key}:attempt:${Date.now()}:${Math.random()}`)
      } catch {
        // A transient Web Crypto failure must not cancel the user-facing
        // notification; only its optional delivery telemetry is omitted.
        notificationAttemptId = undefined
      }
    }
    if (delivery !== undefined && notificationAttemptId !== undefined) {
      void controller.recordDelivery(item.id, {
        notificationStage: 'attempted',
        notificationGeneration: notificationGeneration(item),
        notificationAttemptId,
        notificationRef: delivery.notificationRef,
        tagRef: delivery.tagRef,
        titleKey,
        bodyFingerprint: delivery.bodyFingerprint,
        observedAt,
      })
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:1554-1567](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/client/index.ts#L1554-L1567)

旧通知点击生成新时间。

<details>
<summary>查看原文（14行）</summary>

```text
    notification.onclick = () => {
      const current = controller.getState().snapshot
      const selected = [...(current?.inbox ?? []), ...(current?.scheduled ?? [])].find(value => value.id === item.id)
      if (delivery !== undefined && notificationAttemptId !== undefined) {
        void controller.recordDelivery(item.id, {
          notificationStage: 'clicked',
          notificationGeneration: notificationGeneration(item),
          notificationAttemptId,
          notificationRef: delivery.notificationRef,
          tagRef: delivery.tagRef,
          titleKey,
          bodyFingerprint: delivery.bodyFingerprint,
          observedAt: new Date().toISOString(),
        })
```

</details>

#### 缺口

- 同generation旧attempt新时间回调、时钟偏移和跨标签接管未运行
  **影响**：可能在接管后改变投递账本，不能承诺严格一次或旧attempt绝不覆盖
  **进一步探讨**：让A租期过后B接管，再触发A点击/错误并保留较新时间，检查owner、state、attempt及重试资格

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候收件箱比单通知更适合？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

多任务用户先在兼容 Host 的测试 profile 建两个会话，分别触发问题、审批和普通完成，要求待办与Activity分流符合策略，跳转到正确会话。延后、静音、已读各做一次并重启，陈旧审批不能继续提示成待处理。通知验收用两个标签竞争，先核对有效claim，再让A租期过后B接管、点击A的旧通知；要求记录是否改变B的新claim和账本，不能仅因generation相同就接受“旧回调安全”结论。需在OS端人工确认可见、点击和拒绝权限状态；写失败时不应宣告发送。与原生会话列表/通知比较漏处理、重复打断和找回时间。若无法证明项目收敛或导致更多打断，则推翻收件箱价值假设并禁用，回宿主查看待审批；清除插件元数据不会替用户执行或取消任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:14-22](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/README.md#L14-L22)

目标流程和版本。

```text
DeepCanary groups task updates in **Pending**, **Snoozed**, and **Activity**. It reminds you when DSH needs an answer or approval, keeps routine completions in Activity, and returns you to the corresponding session.

<p align="center"><img src="assets/deepcanary-panel-en.png" width="880" alt="DeepCanary inbox with task list and details"></p>

[Install](#install) · [Use](#use) · [Notifications](#notifications) · [Update or remove](#update-or-remove) · [Compatibility](#compatibility) · [Troubleshooting](#troubleshooting) · [Security](#security-and-privacy) · [Contributing](#contributing) · [Acknowledgments](#acknowledgments) · [License](#license)

## Install

DeepCanary **0.1.9-rc.1** requires DSH `0.2.1-rc.5` or `0.2.2-alpha.3` and later. Check the [Node.js requirements for WebUI](#compatibility) before installing. Windows Desktop includes its own runtime. [Install DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness#readme).
```

**依据 2 · 源码核查**：[src/service.ts:1022-1031](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L1022-L1031)

跳转与人工处理。

<details>
<summary>查看原文（10行）</summary>

```text
    } else if (action === 'jump') {
      body = { schemaVersion: PROTOCOL_VERSION, requestId, revision: this.revision, result: this.jump(id) }
    } else {
      let updated: boolean
      let updatedItem: PublicInboxItem | undefined
      if (action === 'seen') updated = this.seen(id)
      else if (action === 'acknowledge') updated = this.acknowledge(id)
      else if (action === 'snooze') updated = this.snooze(id, typeof payload.minutes === 'number' ? payload.minutes : 30)
      else if (action === 'unsnooze') updated = this.unsnooze(id)
      else if (action === 'mute') updated = this.mute(id)
```

</details>

**依据 3 · 源码核查**：[src/service.ts:1075-1095](https://github.com/Oscar-Williams/dsh-deepcanary/blob/07a56658e8e6130644da68c68b57067dbe3c09c4/src/service.ts#L1075-L1095)

投递验收。

<details>
<summary>查看原文（21行）</summary>

```text
  private async claimNotification(id: string, payload: Record<string, unknown>): Promise<DeliveryClaimOutcome> {
    this.normalizeLifecycle(Date.now())
    const item = this.find(id)
    if (item === undefined || (payload.notificationGeneration ?? 0) !== notificationGeneration(item)) return 'unavailable'
    if (this.deliveryLedger.completed(item.id, notificationCondition(item))) return 'already-complete'
    if (this.deliveryLedger.exhausted(item.id, notificationCondition(item))) {
      this.bumpRevision()
      return 'exhausted'
    }
    if (!this.notificationEligible(item)) return 'unavailable'
    const result = this.deliveryLedger.claim({
      verdictId: item.id,
      conditionGeneration: notificationCondition(item),
      sink: 'browser',
      clientInstance: payload.notificationClientInstance as string,
      expiresAt: payload.notificationExpiresAt as string,
      claimedAt: new Date(Date.now()).toISOString(),
    })
    this.syncSupervisor()
    this.bumpRevision()
    return await this.queueSave() ? result.outcome : 'unavailable'
```

</details>

#### 缺口

- 真实注意力效果和长期维护未测
  **影响**：不能证明减少漏任务或噪音
  **进一步探讨**：记录固定事件集的待办/通知/点击与人工结果

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
