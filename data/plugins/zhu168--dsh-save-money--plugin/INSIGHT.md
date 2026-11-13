# dsh-save-money

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[adaa4ba](https://github.com/zhu168/dsh-save-money/tree/adaa4ba539ae528e749895620ba1c2a84f394951/plugin)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu168/dsh-save-money) [![npm 30d 1,000](https://img.shields.io/static/v1?label=npm+30d&message=1%2C000&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-save-money) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-save-money)
<!-- END META -->

> **功能**：按配置的时间窗延迟部分 DSH 模型请求，并提供目标暂停、恢复和余额显示。

> **亮点**：[Q01](#research-q01) 将按模型档位配置的时间窗接到宿主流式调用，并在界面显示当前状态。

> **主要限制**：[Q02](#research-q02) 恢复未核对原目标身份，启动 reconcile 会尝试恢复手工暂停目标。[Q03](#research-q03) 管理路由自身缺身份检查。

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
  - [Q01 · 峰谷窗口具体拦截哪些模型请求？](#detail-section-11)
  - [Q02 · 自动恢复能否只恢复插件自己的暂停？](#detail-section-12)
  - [Q03 · HTTP 管理、余额查询及凭据分别经过什么边界？](#detail-section-13)
  - [Q04 · 怎样证实分时方案有收益并保护手工暂停？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有可延迟长任务的 DSH 用户想减少高价时段请求，又不希望误恢复手工暂停目标。

手工暂停可以明确控制目标，但要在价格窗口切换时回来处理；定时网关需自行维护任务和状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分时窗口 | 延迟选中档位请求 | 未知模型或豁免直接通过 |
| 目标控制 | 暂停与恢复 Host 目标 | 恢复所有权需验证 |
| 余额与状态 | 辅助检查模型费率和窗口 | 余额不是任务实际费用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Host timer 和流式钩子 | 必需 | 调度与拦截 | 先核对实际事件和服务 |
| agents 和 goals | 目标控制必需 | 暂停及恢复 | 缺服务不运行相应路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 隔离设置时区、档位与窗口 | 核对豁免和恢复 |
| 演练 | 验证取消和手工暂停 | 无意外请求和恢复 |
| 退出 | 结束本窗口或停用 | 确认手工目标不被改变 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 依模型费率 | 配置时区、档位与恢复 | 需真实账单 |
| 持续 | 费用可能因时段变化 | 核对价格与延迟 | 节约未实测 |
| 失败 | 可能多次请求 | 人工恢复与排障 | 副作用待测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 延迟请求 | 有时间窗与模型档位门槛 | 取消、真实上游和账单 |
| 目标恢复 | 实际调用 Host 目标服务 | 权限、所有权及重启可用性 |

> **思考**：[Q02](#research-q02) 恢复未核对原目标身份，启动 reconcile 会尝试恢复手工暂停目标。[Q03](#research-q03) 管理路由自身缺身份检查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将按模型档位配置的时间窗接到宿主流式调用，并在界面显示当前状态。

待开窗的异步等待和 release guard 可以复用，但恢复应核对目标身份与来源。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 恢复未核对原目标身份，启动 reconcile 会尝试恢复手工暂停目标。[Q03](#research-q03) 管理路由自身缺身份检查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先观察。用隔离任务核对窗口、取消与恢复所有权，异常即停用并手工排班。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实请求和目标控制入口。实际费用、运行时请求抑制和权限隔离待测。

- 已检查：作者 README、包清单、源码路径 plugin/client.js、plugin/cordis.patch.yml、plugin/index.js、plugin/package.json、src/balance-bars.ts、src/balance-host.ts、src/config.ts、src/gate.ts、src/host-goals.ts、src/host-http.ts、src/host.ts 及固定范围 inventory；组件：plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽查固定子包产物及对应源码，未执行 Host、工具、请求或账单测试。
- 下一步：比较窗口内外、取消、卸载及替换目标，核对上游、恢复与权限。

**分析版本**

- **仓库**：[zhu168/dsh-save-money](https://github.com/zhu168/dsh-save-money)
- **版本号**：1.4.4（[固定提交 adaa4ba](https://github.com/zhu168/dsh-save-money/tree/adaa4ba539ae528e749895620ba1c2a84f394951)）
- **版本日期**：2026-08-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 让恢复以绑定目标版本和暂停来源的凭据为条件，测试是否同时减少误恢复和漏恢复。

比较窗口内外、取消、卸载及替换目标，核对上游、恢复与权限。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 4397 | 3373 | 1036 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu168/dsh-save-money/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/zhu168/dsh-save-money/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu168/dsh-save-money/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：峰谷分时的 DSH 用户能否将可延迟请求移到低价窗口，同时保留任务状态和授权边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 峰谷窗口具体拦截哪些模型请求？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用任务是能够等待低价窗口的长时或后台任务。原办法是手动暂停并定时回来，插件在 Host 的 llm/stream 链路对后续请求应用时间窗，能减少手工切换。合格结果是目标请求按计划延迟，恢复后按预期执行，交互请求和不支持的模型不被误拦。它不会撤回已启动的上游流。

网关以 provider 和模型字符串分类，名称未识别或档位未勾选就继续，不能从“省钱模式”推导覆盖所有模型。关闭时异步迭代器等待打开，事件可唤醒等待项，单个 waiter 的 release 防重复 next。请求取消与卸载也进入 release，取消处理仍调用 next，需要下游正确消费已 abort 的 signal；代码自身不证明所有下游都不发送，也不证明不同迭代调用共享同一个等待者。建议只用可中断的测试任务核对，并检查恢复后的实际请求计数。

#### 证据与依据

**依据 1 · 源码核查**：[plugin/index.js:1427-1449](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/plugin/index.js#L1427-L1449)

固定运行产物实际安装流式拦截。

<details>
<summary>查看原文（23行）</summary>

```text
            console.error('[save-money] ctx.on unavailable; llm/stream gate not installed');
            return;
        }
        ctx.effect(() => {
            const dispose = ctx.on('llm/stream', (options, next) => {
                // Fresh user/model activity: every llm/stream request counts (also for
                // exempted tiers — it is real usage), so mark it before any check.
                deps.onRequest(options);
                // Model-tier exemption: classify the request's provider/model tier; if
                // that tier is unchecked in modelApply (or recognition fails = null),
                // pass straight through — not paused inside windows either. Any
                // classification/query error fails safely as exempt (no pause), never
                // throws.
                try {
                    const cls = classifyModel(options && options.provider, options && options.model);
                    if (!modelApplyEnabled(deps.getCfg().modelApply, cls))
                        return next();
                }
                catch (e) { /* classification error → exempt (no pause) */ }
                if (!gateClosedAt(new Date()))
                    return next();
                const waitForOpen = () => new Promise((resolve) => {
                    const ready = () => gateDisposed || !gateClosedAt(new Date())
```

</details>

**依据 2 · 源码核查**：[src/balance-bars.ts:61-84](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/balance-bars.ts#L61-L84)

名称分类和未知模型豁免。

<details>
<summary>查看原文（24行）</summary>

```text
export function classifyModel(provider: any, model: any): ModelClass {
  const p = typeof provider === 'string' ? provider.toLowerCase() : ''
  const m = typeof model === 'string' ? model.toLowerCase() : ''
  if (p.length === 0 || m.length === 0) return null
  // vision first: "deepseek-v4-flash-vision-exp" also contains "flash"
  const isVision = m.indexOf('vision') >= 0
  const isPro = !isVision && m.indexOf('pro') >= 0
  const isFlash = !isVision && m.indexOf('flash') >= 0
  if (!isVision && !isPro && !isFlash) return null // unknown → exempt
  const tier = isVision ? 'vision' : isPro ? 'pro' : 'flash'
  if (p === OFFICIAL_PROVIDER) return ('official-' + tier) as ModelClass
  // Any other provider belongs to the "other" group (v1.4.4)
  return ('other-' + tier) as ModelClass
}

/**
 * Whether a tier is checked in the current modelApply config (should save).
 * Missing/corrupt config returns false (safe direction: no pause); a null
 * tier is always false.
 */
export function modelApplyEnabled(applied: any, cls: ModelClass): boolean {
  if (!applied || typeof applied !== 'object' || cls === null) return false
  return applied[cls] === true
}
```

</details>

**依据 3 · 源码核查**：[src/gate.ts:87-135](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/gate.ts#L87-L135)

触发、等待、取消及 release。

<details>
<summary>查看原文（49行）</summary>

```text
    ctx.effect(() => {
      const dispose = ctx.on('llm/stream', (options: any, next: any) => {
        // Fresh user/model activity: every llm/stream request counts (also for
        // exempted tiers — it is real usage), so mark it before any check.
        deps.onRequest(options)
        // Model-tier exemption: classify the request's provider/model tier; if
        // that tier is unchecked in modelApply (or recognition fails = null),
        // pass straight through — not paused inside windows either. Any
        // classification/query error fails safely as exempt (no pause), never
        // throws.
        try {
          const cls = classifyModel(options && options.provider, options && options.model)
          if (!modelApplyEnabled(deps.getCfg().modelApply, cls)) return next()
        } catch (e) { /* classification error → exempt (no pause) */ }
        if (!gateClosedAt(new Date())) return next()
        const waitForOpen = () => new Promise((resolve) => {
          const ready = () => gateDisposed || !gateClosedAt(new Date())
            || !!(options && options.signal && options.signal.aborted)
          // Release helper: call next() defensively. A synchronous throw from
          // the waterfall chain (request context torn down / invariant fail)
          // must surface as a rejected promise — never as an exception
          // escaping into the abort event dispatch or wakeGateWaiters.
          // Once-guard: the abort listener AND wakeGateWaiters (60s tick /
          // config change / unload) can both reach release() in the same
          // instant — resolve() is idempotent but next() is NOT, so a second
          // call would invoke the downstream chain twice.
          let released = false
          const release = () => {
            if (released) return
            released = true
            try { resolve(next()) } catch (e) {
              resolve(Promise.reject(e))
            }
          }
          if (ready()) return release()
          const waiter = () => { release() }
          gateWaiters.push(waiter)
          if (options && options.signal && typeof options.signal.addEventListener === 'function') {
            options.signal.addEventListener('abort', () => {
              const i = gateWaiters.indexOf(waiter)
              if (i >= 0) gateWaiters.splice(i, 1)
              release()
            }, { once: true })
          }
        })
        // Wrapper stream: iteration waits only when the gate is closed; once
        // open → next() → the real request proceeds as usual.
        let inner: any = null
        const getInner = () => (inner !== null ? Promise.resolve(inner) : waitForOpen().then((s) => { inner = s; return inner }))
```

</details>

**依据 4 · 源码核查**：[src/gate.ts:136-165](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/gate.ts#L136-L165)

迭代器协议与卸载唤醒。

<details>
<summary>查看原文（30行）</summary>

```text
        return {
          [Symbol.asyncIterator]() {
            let it: any = null
            return {
              next() {
                return getInner().then((s: any) => {
                  if (!it) it = s[Symbol.asyncIterator]()
                  return it.next()
                })
              },
              return(value: any) {
                return getInner().then((s: any) => {
                  if (!it) it = s[Symbol.asyncIterator]()
                  return it.return ? it.return(value) : { done: true, value }
                })
              },
              throw(e: any) {
                return getInner().then((s: any) => {
                  if (!it) it = s[Symbol.asyncIterator]()
                  return it.throw ? it.throw(e) : { done: true, value: e }
                })
              },
            }
          },
        }
      }, { global: true })
      return () => {
        gateDisposed = true
        try { wakeGateWaiters() } catch (e) { /* unload must never throw */ }
        dispose()
```

</details>

#### 缺口

- 不同 Host 下取消是否仍到达上游及复用迭代器行为未测
  **影响**：不能当成硬性无请求保证
  **进一步探讨**：用隔离下游统计窗口内、取消和卸载时的 next 与实际发送次数

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自动恢复能否只恢复插件自己的暂停？

**研究主题**：工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

到达窗口时，目标管理器扫描 Host 的 agents 和 goals，只尝试暂停活跃目标，并记下成功条目的 session、goal ID、revision。恢复时按 session 找当前 agent。当前目标只要为 paused，就以它当下的 ID 和 revision 调用 resume，没比较记录中的目标 ID 和 revision，因而同一 session 换了暂停目标也可能被恢复。agent 缺失时直接跳过，失败抛错才保留重试条目。

启动 reconcile 是另一个流程，固定配置默认开启。它枚举所有现有 agent 并恢复 paused，未核对是否由本插件造成。手工暂停、旧目标被替换和 restart 都是采用前反例。卸载释放请求 gate 与恢复 goal 所有权应分别验证，不能把释放请求视为所有目标均恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/host-goals.ts:49-60](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-goals.ts#L49-L60)

Host 服务和活跃目标收集。

<details>
<summary>查看原文（12行）</summary>

```text
  function collectTasks(): { ok: boolean; tasks: TaskInfo[]; reason?: string } {
    const agents = ctx.get('agents')
    const goals = ctx.get('goals')
    if (!agents || !goals) return { ok: false, tasks: [], reason: 'agents/goals services unavailable' }
    const tasks: TaskInfo[] = []
    for (const agent of agents.list()) {
      let gv: any = undefined
      try { gv = goals.get(agent) } catch (e) { gv = undefined }
      if (gv && (gv.phase === 'active' || (S.pauseRecord && S.pauseRecord.paused && S.pauseRecord.paused.some((p: GoalRef) => p.sessionId === agent.id)))) {
        tasks.push({ agent, sessionId: agent.id, goalId: gv.id, revision: gv.revision, phase: gv.phase })
      }
    }
```

</details>

**依据 2 · 源码核查**：[src/host-goals.ts:63-89](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-goals.ts#L63-L89)

暂停记录写入 ID、revision。

<details>
<summary>查看原文（27行）</summary>

```text
  function freeze(window: TimeWindow | undefined): { frozen: number; record: any } {
    const col = collectTasks()
    if (!col.ok) { console.error('[save-money] freeze skipped:', col.reason); return { frozen: 0, record: null } }
    const freezeTargets = col.tasks.filter((t) => t.phase === 'active')
    if (freezeTargets.length === 0) {
      console.log('[save-money] pauseAt reached but no active tasks; not pausing')
      return { frozen: 0, record: null }
    }
    const goals = ctx.get('goals')
    const paused: GoalRef[] = []
    for (const t of freezeTargets) {
      try {
        goals.pause(t.agent, { id: t.goalId, revision: t.revision })
        paused.push({ sessionId: t.sessionId, goalId: t.goalId, revision: t.revision, pausedAt: Date.now() })
      } catch (e: any) {
        console.error('[save-money] goals.pause failed for ' + t.sessionId + ': ' + String((e && e.message) || e))
      }
    }
    S.pauseRecord = {
      pausedBySaveMoney: true,
      at: new Date().toISOString(),
      window: window ? { pauseAt: window.pauseAt, resumeAt: window.resumeAt, timezone: window.timezone || getCfg().timezone } : null,
      paused,
      cascaded: true,
    }
    console.log('[save-money] FROZEN ' + paused.length + ' goal(s), record written')
    return { frozen: paused.length, record: S.pauseRecord }
```

</details>

**依据 3 · 源码核查**：[src/host-goals.ts:91-116](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-goals.ts#L91-L116)

恢复读取当前目标且不核对历史 ID，缺 agent 跳过。

<details>
<summary>查看原文（26行）</summary>

```text
  function unfreeze(): { resumed: number; record: any } {
    if (!S.pauseRecord) return { resumed: 0, record: null }
    const agents = ctx.get('agents')
    const goals = ctx.get('goals')
    const remaining: GoalRef[] = []
    let resumed = 0
    const targets = S.pauseRecord.paused || []
    for (const p of targets) {
      const agent = agents && agents.get(p.sessionId)
      if (!agent) continue
      try {
        const gv = goals.get(agent)
        if (gv && gv.phase === 'paused') {
          goals.resume(agent, { id: gv.id, revision: gv.revision })
          resumed++
        } else if (gv && gv.phase === 'active') {
          resumed++
        }
      } catch (e: any) {
        console.error('[save-money] goals.resume failed for ' + p.sessionId + ': ' + String((e && e.message) || e))
        remaining.push(p)
      }
    }
    S.pauseRecord = remaining.length > 0 ? { ...S.pauseRecord, paused: remaining } : null
    console.log('[save-money] RESUMED ' + resumed + ' goal(s)' + (remaining.length > 0 ? ', ' + remaining.length + ' still pending' : ', record cleared'))
    return { resumed, record: S.pauseRecord }
```

</details>

**依据 4 · 源码核查**：[src/host-goals.ts:118-140](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-goals.ts#L118-L140)

启动遍历并恢复 paused。

<details>
<summary>查看原文（23行）</summary>

```text
  // Startup reconciliation: any goal still paused when the plugin starts
  // (e.g. a previous crash while frozen) is resumed — nothing must stay
  // frozen across restarts.
  function reconcile(): { restored: number; reason?: string } {
    const col = collectTasks()
    if (!col.ok) return { restored: 0, reason: col.reason }
    const goals = ctx.get('goals')
    const agents = ctx.get('agents')
    let restored = 0
    for (const agent of agents.list()) {
      let gv: any = undefined
      try { gv = goals.get(agent) } catch (e) { gv = undefined }
      if (gv && gv.phase === 'paused') {
        try {
          goals.resume(agent, { id: gv.id, revision: gv.revision })
          restored++
          console.log('[save-money] reconcile: restored paused goal of ' + agent.id)
        } catch (e: any) {
          console.error('[save-money] reconcile resume failed for ' + agent.id + ': ' + String((e && e.message) || e))
        }
      }
    }
    return { restored }
```

</details>

**依据 5 · 源码核查**：[src/config.ts:49-54](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/config.ts#L49-L54)

reconcile 默认。

```text
  timezone: 'Asia/Shanghai',
  warnMinutes: 5,
  windows: [],
  reconcileOnStart: true,
  lang: 'auto',
  showBalance: false,
```

#### 缺口

- 未在目标 Host 复现手工暂停和目标替换
  **影响**：可能意外恢复有副作用的任务，当前保留观察
  **进一步探讨**：在空工作区设置手工暂停、换目标和重启三组状态，记录实际 resume 目标

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · HTTP 管理、余额查询及凭据分别经过什么边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、功能与机制

#### 完整回答

官方 bundle 在 webServer 就绪时注册 /save-money 前缀。路由提供状态、余额，以及 POST 配置和结束窗口。handler 按路径、方法解析，但本函数没有调用 connection.requestRejection，也没有显式的请求体上限。Host 是否先拦截请求取决于实际部署；仅能确认插件路由本身未实现这层授权。错误 JSON 回退到空 patch，返回值仍需检查。动态安装的 harnessApi 路径不同，不可套用这段 HTTP 结论。

余额在 Host 通过 credentials 取 DEEPSEEK_API_KEY，官方模块固定发到 DeepSeek 余额端点。动态模式用 curl 并把 Bearer 放进 argv，应单独核对本机进程可见范围。账户余额只是一次余额查询，不能证明某个任务或时间窗省了多少。运行需要可用 Host timer 和相关服务，配置变动、余额读取、关闭动作应按独立权限验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.ts:315-335](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host.ts#L315-L335)

动态处理与正式包 Web 路由分流。

<details>
<summary>查看原文（21行）</summary>

```text
      ctx.effect(() => harnessApi.handle('save-money/status', async () => status(new Date())))
      ctx.effect(() => harnessApi.handle('save-money/configure', async (args: any) => applyConfig(unwrap(args) || {})))
    }
    const webServer = ctx.get('webServer')
    // The plugin row only injects timer, so in the official bundle form apply()
    // can run BEFORE the webServer service is registered. Register the HTTP
    // endpoints via Cordis' inject() dependency waiting — it runs the callback
    // as soon as webServer is available, so the bundled Client half never sees
    // 404s. Skipped entirely in the dynamic form (harnessApi present).
    const httpDeps = {
      status: () => status(new Date()),
      balanceQuery: () => tracker.query(),
      applyConfig,
      endWindowHandler: () => endWindowHandler(),
    }
    if (!harnessApi && webServer && typeof webServer.register === 'function') {
      ctx.effect(() => registerHttpEndpoints(webServer, httpDeps) as any)
    } else if (!harnessApi && typeof ctx.inject === 'function') {
      ctx.inject(['webServer'], (sub: any) => {
        sub.effect(() => registerHttpEndpoints(sub.get('webServer'), httpDeps) as any)
      })
```

</details>

**依据 2 · 源码核查**：[src/host-http.ts:24-60](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-http.ts#L24-L60)

路由实际方法和缺少本地请求鉴权。

<details>
<summary>查看原文（37行）</summary>

```text
  if (!ws || typeof ws.register !== 'function') return
  const sendJson = (res: any, code: number, obj: any) => {
    res.writeHead(code, { 'content-type': 'application/json; charset=utf-8' })
    res.end(JSON.stringify(obj))
  }
  return ws.register({
    kind: 'prefix',
    path: '/save-money',
    handler: async (req: any, res: any) => {
      try {
        const rawPath = String(req.url || '/').split('?')[0]
        const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath
        if (path === '/save-money/status') {
          sendJson(res, 200, deps.status())
          return
        }
        if (path === '/save-money/balance') {
          sendJson(res, 200, await deps.balanceQuery())
          return
        }
        if (req.method === 'POST' && path === '/save-money/configure') {
          let raw = ''
          for await (const chunk of req) raw += chunk
          let patch: any = {}
          try { patch = JSON.parse(raw || '{}') } catch (e) { patch = {} }
          sendJson(res, 200, deps.applyConfig(patch))
          return
        }
        if (req.method === 'POST' && path === '/save-money/end-window') {
          for await (const _ of req) { /* drain */ }
          sendJson(res, 200, await deps.endWindowHandler())
          return
        }
        sendJson(res, 404, { ok: false, message: 'not found: ' + path })
      } catch (e: any) {
        sendJson(res, 500, { ok: false, message: String((e && e.message) || e) })
      }
```

</details>

**依据 3 · 源码核查**：[src/balance-host.ts:102-138](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/balance-host.ts#L102-L138)

固定余额端点及两条凭据传输路径。

<details>
<summary>查看原文（37行）</summary>

```text
/** One balance request (no caching; see the service wrapper). */
async function fetchBalance(ctx: any, sandbox: boolean): Promise<any> {
  const creds = ctx.get('credentials')
  const key = creds && typeof creds.resolve === 'function'
    ? await creds.resolve('DEEPSEEK_API_KEY').then((r: any) => r && r.value).catch(() => undefined)
    : undefined
  if (!key) return { ok: false, error: 'no DEEPSEEK_API_KEY credential' }
  const url = 'https://api.deepseek.com/user/balance'
  try {
    let status = 0
    let text = ''
    if (!sandbox && typeof fetch === 'function') {
      // Official module form runs in Node: real fetch is available.
      const res = await fetch(url, {
        headers: { authorization: 'Bearer ' + key, accept: 'application/json' },
        signal: typeof AbortSignal !== 'undefined' && AbortSignal && typeof AbortSignal.timeout === 'function'
          ? AbortSignal.timeout(10000)
          : undefined,
      })
      status = res.status
      text = await res.text()
    } else {
      // Dynamic sandbox: `fetch` exists but is a guard stub that throws on
      // call — run curl via the subprocess service. Any shape mismatch fails
      // closed (ok:false) and can never throw out of this function.
      const sub = ctx.get('subprocess')
      if (!sub || typeof sub.spawn !== 'function') {
        return { ok: false, error: 'no fetch or subprocess available for balance' }
      }
      let done: any = null
      let raw = ''
      try {
        const handle = sub.spawn({
          argv: ['curl', '-sS', '-f', '-m', '10', '-H', 'Authorization: Bearer ' + key, url],
          cwd: '.',
          stdio: { stdin: 'ignore', stdout: { maxBytes: 65536 }, stderr: { maxBytes: 4096 } },
          graceMs: 12000,
```

</details>

**依据 4 · 源码核查**：[plugin/client.js:2128-2145](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/plugin/client.js#L2128-L2145)

状态和设置界面实际挂载。

<details>
<summary>查看原文（18行）</summary>

```text
        slots.inject('conversation.session.header.utilities', () => slots.register({ name: 'conversation.session.header.utilities', id: 'save-money-status-text', order: 5 }, () => {
            const [st, setSt] = useSnap();
            const actions = makeActions(setSt);
            // The header entry owns its popovers (settings, bar chart, balance
            // card); refresh is passed in so opening the chart forces a fresh
            // balance sample (the host 5-min sampler does not push updates).
            return React.createElement(ui.HeaderEntry, {
                st,
                actions,
                onRefresh: () => { void refresh(); },
            });
        }));
        // ---- System settings page (settings.section, kept) ----
        slots.inject('settings.section', () => slots.register({ name: 'settings.section', id: 'save-money', order: 25, label: translate('sectionLabel') }, () => {
            const [st, setSt] = useSnap();
            const actions = makeActions(setSt);
            return React.createElement('div', { style: { padding: '12px' } }, React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '15px' } }, translate('settingsHeading')), React.createElement(ui.SettingsView, { st, ...actions }));
        }));
```

</details>

#### 缺口

- Host 是否统一认证插件路由及 curl argv 实际可见性未核实
  **影响**：远程部署和带真实凭据的试用缺依据
  **进一步探讨**：隔离 profile 检查无会话的状态、配置和结束窗口请求，验证余额使用测试凭据

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样证实分时方案有收益并保护手工暂停？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前建议观察。先选择可中断、可验证的后台任务，在隔离 profile 对照手工暂停与固定时间窗。记录完成时间、每次上游请求开始时间、模型豁免和取消、恢复错误、可归属账单。没有独立账单就保留收益未知。首次需要配置时区、档位、窗口和回退；持续承担价格核对与误延迟处理；失败还可能需要手动恢复目标和重新运行。发生无意恢复、非预期上游请求或外部可改配置时回到手工方式。

待验证的设计是只消费绑定目标 ID、revision 与暂停来源的恢复凭据，再对照当前按会话和启动遍历方式。模拟手工暂停、换目标、重启和正常跨窗，比较越权恢复与漏恢复。如果仍恢复外部目标，或正常目标经常需要人工补救，就否定或缩小设计。

#### 证据与依据

**依据 1 · 源码核查**：[src/host-goals.ts:91-139](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-goals.ts#L91-L139)

现有恢复实现作为对照。

<details>
<summary>查看原文（49行）</summary>

```text
  function unfreeze(): { resumed: number; record: any } {
    if (!S.pauseRecord) return { resumed: 0, record: null }
    const agents = ctx.get('agents')
    const goals = ctx.get('goals')
    const remaining: GoalRef[] = []
    let resumed = 0
    const targets = S.pauseRecord.paused || []
    for (const p of targets) {
      const agent = agents && agents.get(p.sessionId)
      if (!agent) continue
      try {
        const gv = goals.get(agent)
        if (gv && gv.phase === 'paused') {
          goals.resume(agent, { id: gv.id, revision: gv.revision })
          resumed++
        } else if (gv && gv.phase === 'active') {
          resumed++
        }
      } catch (e: any) {
        console.error('[save-money] goals.resume failed for ' + p.sessionId + ': ' + String((e && e.message) || e))
        remaining.push(p)
      }
    }
    S.pauseRecord = remaining.length > 0 ? { ...S.pauseRecord, paused: remaining } : null
    console.log('[save-money] RESUMED ' + resumed + ' goal(s)' + (remaining.length > 0 ? ', ' + remaining.length + ' still pending' : ', record cleared'))
    return { resumed, record: S.pauseRecord }
  }
  // Startup reconciliation: any goal still paused when the plugin starts
  // (e.g. a previous crash while frozen) is resumed — nothing must stay
  // frozen across restarts.
  function reconcile(): { restored: number; reason?: string } {
    const col = collectTasks()
    if (!col.ok) return { restored: 0, reason: col.reason }
    const goals = ctx.get('goals')
    const agents = ctx.get('agents')
    let restored = 0
    for (const agent of agents.list()) {
      let gv: any = undefined
      try { gv = goals.get(agent) } catch (e) { gv = undefined }
      if (gv && gv.phase === 'paused') {
        try {
          goals.resume(agent, { id: gv.id, revision: gv.revision })
          restored++
          console.log('[save-money] reconcile: restored paused goal of ' + agent.id)
        } catch (e: any) {
          console.error('[save-money] reconcile resume failed for ' + agent.id + ': ' + String((e && e.message) || e))
        }
      }
    }
```

</details>

**依据 2 · 源码核查**：[src/gate.ts:101-129](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/gate.ts#L101-L129)

取消及打开时 next 调用观测点。

<details>
<summary>查看原文（29行）</summary>

```text
        if (!gateClosedAt(new Date())) return next()
        const waitForOpen = () => new Promise((resolve) => {
          const ready = () => gateDisposed || !gateClosedAt(new Date())
            || !!(options && options.signal && options.signal.aborted)
          // Release helper: call next() defensively. A synchronous throw from
          // the waterfall chain (request context torn down / invariant fail)
          // must surface as a rejected promise — never as an exception
          // escaping into the abort event dispatch or wakeGateWaiters.
          // Once-guard: the abort listener AND wakeGateWaiters (60s tick /
          // config change / unload) can both reach release() in the same
          // instant — resolve() is idempotent but next() is NOT, so a second
          // call would invoke the downstream chain twice.
          let released = false
          const release = () => {
            if (released) return
            released = true
            try { resolve(next()) } catch (e) {
              resolve(Promise.reject(e))
            }
          }
          if (ready()) return release()
          const waiter = () => { release() }
          gateWaiters.push(waiter)
          if (options && options.signal && typeof options.signal.addEventListener === 'function') {
            options.signal.addEventListener('abort', () => {
              const i = gateWaiters.indexOf(waiter)
              if (i >= 0) gateWaiters.splice(i, 1)
              release()
            }, { once: true })
```

</details>

**依据 3 · 源码核查**：[src/host-http.ts:44-55](https://github.com/zhu168/dsh-save-money/blob/adaa4ba539ae528e749895620ba1c2a84f394951/src/host-http.ts#L44-L55)

可测试的配置与结束窗口入口。

<details>
<summary>查看原文（12行）</summary>

```text
        if (req.method === 'POST' && path === '/save-money/configure') {
          let raw = ''
          for await (const chunk of req) raw += chunk
          let patch: any = {}
          try { patch = JSON.parse(raw || '{}') } catch (e) { patch = {} }
          sendJson(res, 200, deps.applyConfig(patch))
          return
        }
        if (req.method === 'POST' && path === '/save-money/end-window') {
          for await (const _ of req) { /* drain */ }
          sendJson(res, 200, await deps.endWindowHandler())
          return
```

</details>

#### 缺口

- 没有同任务账单和恢复对照
  **影响**：不能宣称节省或建议直接启用
  **进一步探讨**：用固定模型和时间窗口收集前后日志，并人工核对恢复所有权

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
