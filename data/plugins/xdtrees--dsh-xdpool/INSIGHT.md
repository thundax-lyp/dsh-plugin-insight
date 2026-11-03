# DSH XD Pool

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[74a80b6](https://github.com/XDTrees/dsh-xdpool/tree/74a80b6e6b568d97957a623a0d9d3b625035fed7)

<!-- BEGIN META -->
[![GitHub ★ 392](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=392&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/XDTrees/dsh-xdpool) [![npm 30d 5,806](https://img.shields.io/static/v1?label=npm+30d&message=5%2C806&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-xdpool)
<!-- END META -->

> **功能**：将自有 WorkBuddy 多账号接成 DSH 模型池，提供渠道接入、用量、路由、网关与可选积分自动化。

> **亮点**：[Q01](#research-q01) 把多账号当统一选择面，连接可用性、模型级冷却、拒绝原因和宿主provider；同一请求标识覆盖物理尝试，减少把尝试数误当用户任务数。

> **主要限制**：[Q02](#research-q02) 集中JSON凭据、可选HTTP共享网关和积分远端动作扩大责任；[Q01](#research-q01) 流接受不代表完整任务，切号与摘要不保证净节省。

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
  - [Q01 · 账号池如何接入真实模型调用，什么失败可以轮转，什么失败不能透明续接？](#detail-section-11)
  - [Q02 · 持久凭据、可选网关和积分自动化产生哪些副作用，默认保护是否足以替代访问控制？](#detail-section-12)
  - [Q03 · 什么用户值得承担本地试用负担，如何衡量收益并检验请求恢复的新方向？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向多自有账号、希望减少手工换号的本地DSH用户，验收单位是同一任务的合格结果与可解释总调用。

[Q03](#research-q03) 对照原单账号provider和人工换号，未做同任务运行比较，不把额外模型或上游额度归为插件贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多账号主池 | 拒绝阶段换用自有可用账号 | 已接受流不保证透明续接，国内国际分域 |
| 第三方渠道入口 | 接已有登录或key模型 | 未完整核查各lane，数量不证明可用 |
| 用量记账 | 用请求身份归并尝试 | 完整账单一致性未运行 |
| 可选共享网关 | 向其他设备提供兼容接口 | 默认关闭，独立key与白名单，不自动提供TLS |
| 可选积分调度 | 按计划执行远端账户动作 | 默认关闭，需单独核账号与远端结果 |

**流程与依赖**

[Q03](#research-q03) 依赖表区分主池、第三方lane、网关和积分，免费标签不构成价格依据。

[Q03](#research-q03) 步骤表按准备、加载、调用、验收和退出展开；先主池小样，后逐项扩展。

**效果与成本**

[Q03](#research-q03) 分阶段成本表保留请求重试、缓存、摘要、凭据和退出负担，金额与人工时间未知。

[Q03](#research-q03) 效果表将源码可见的切号与记账分开，不推导实际节省。

> **思考**：[Q02](#research-q02) 集中JSON凭据、可选HTTP共享网关和积分远端动作扩大责任；[Q01](#research-q01) 流接受不代表完整任务，切号与摘要不保证净节省。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把多账号当统一选择面，连接可用性、模型级冷却、拒绝原因和宿主provider；同一请求标识覆盖物理尝试，减少把尝试数误当用户任务数。

[Q01](#research-q01)、[Q02](#research-q02) 模型级拒绝冷却、请求级记账及relay/内部shim分层值得借鉴，迁移需上游协议、凭据和宿主适配；不能据tmp/rename保证凭据加密或所有远端副作用幂等。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 集中JSON凭据、可选HTTP共享网关和积分远端动作扩大责任；[Q01](#research-q01) 流接受不代表完整任务，切号与摘要不保证净节省。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 备份profile并核凭据目录，主池只用自有账号和非敏感任务，保持额外lane、网关与积分自动化关闭；核所有尝试与最终回答。异常先改回原provider并查远端记录，退出时另核持久凭据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

主池注册、拒绝轮转与流边界、持久凭据、relay认证和自动化默认开关已源码核查；未执行目标代码，未覆盖所有厂商lane及积分事件链，假设未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/index.ts、src/shim.ts、src/account-store.ts、src/relay.ts、src/web-status.ts、src/scheduler.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件完整inventory；人工定向核查主池注册、shim循环、持久账号、relay和调度开关，不是所有厂商渠道、积分任务与Web认证的完整审计。
- 下一步：未执行目标代码、模型请求、登录、积分任务或网关监听；后续分拒绝前失败、已输出断流和成本对照验收。

**分析版本**

- **仓库**：[XDTrees/dsh-xdpool](https://github.com/XDTrees/dsh-xdpool)
- **版本号**：2.5.1（[固定提交 74a80b6](https://github.com/XDTrees/dsh-xdpool/tree/74a80b6e6b568d97957a623a0d9d3b625035fed7)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 在已有turnId与面板上比较恢复账的解释增量，区分拒绝、部分流、摘要改变与费用来源；以错误重试和人工复核对照，无改善或隐私负担过大即否定。

未执行目标代码、模型请求、登录、积分任务或网关监听；后续分拒绝前失败、已输出断流和成本对照验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 2036 | — | — | 52750 |
| .js | source | 3 | 49233 | 38779 | 12080 | — |
| .ts | source | 53 | 28016 | 16612 | 10633 | — |
| .tsx | source | 14 | 8206 | 5803 | 2405 | — |
| .ts | test | 83 | 18765 | 13520 | 3903 | — |
| .mjs | source | 5 | 520 | 335 | 138 | — |

</details>

**活跃度**

[![Issue 未关闭 59](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=59&color=737b86&logo=github)](https://github.com/XDTrees/dsh-xdpool/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 53](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=53&color=737b86&logo=github)](https://github.com/XDTrees/dsh-xdpool/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/XDTrees/dsh-xdpool/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：多账号模型池能否降低本地DSH手动切号负担，哪些失败与凭据、自动化及网关副作用限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账号池如何接入真实模型调用，什么失败可以轮转，什么失败不能透明续接？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它是带 Host、客户端和 CLI 的原生 DSH 插件。核心人群是拥有多个自有 WorkBuddy 账号、经常需要手动切换可用账号的本地 DSH 用户。合格任务不是“换号成功”，而是在明确账号和资源约束下完成同一模型任务。相对一个 provider 绑定一个登录或人工切号，增量在于把发现、持久化、可用性选择、冷却和 DSH 适配接成一条链；模型本身和额度由上游提供，不能算插件创造。

index 先建立国内与国际两个 loopback shim，监听 ready 后创建适配器并注册到 ctx.llm。国内与国际账号分别选择，聚合、免费和登录渠道通过不同 lane 接入，不能从一个 lane 的正常路径推定其他厂商均可用。源码中的渠道数量、免费标签和 README 免费主张均不证明当前额度和服务可访问。

主池请求分配同一 turnId，在有限 attempt 循环中 acquire 账号后调用 chatStream；上游接受流时进入 serveSuccessfulStream 并直接 return。拒绝阶段的 soft_rate 才继续按模型冷却换账号，失效登录有刷新路径，其他错误可终止；上下文超长另有内层压缩重试。这不是已输出若干 token 后可以无损换号续写的协议。流被接受与完整回答成功仍是不同事实，模型链、摘要压缩和多个物理尝试也可能增加调用量或改变历史信息。

用请求级身份统一记账、把无账号/冷却/禁用原因分开具有实际诊断价值。它有望减少人工切号，但缓存按账号隔离、切换后的提示兼容及重复尝试总成本需要同任务验证，不能从故障切换代码直接得出更多合格产出或“零成本”。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1645-1669](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/index.ts#L1645-L1669)

两个监听准备好后创建区域适配器。

<details>
<summary>查看原文（25行）</summary>

```text
  // Register once BOTH loopback listeners hold a port: each adapter reads its
  // shim origin at construction time, so neither can be built any earlier.
  void Promise.all([shims.cn.ready, shims.global.ready])
    .then(async () => {
      if (stopped) return
      recordStartupNote(`both shims ready cn=${shims.cn.baseUrl()} global=${shims.global.baseUrl()}; entering registration`)
      try {
        // One adapter per region. Each provider is bound to its own account
        // slice of the pool (see the `region` argument on `pool.acquire`), so a
        // CN request can never be served by a global account and vice versa —
        // the two gateways are not interchangeable.
        const adaptersByRegion = {
          cn: createWorkBuddyAdapter({
            ctx,
            shim: shims.cn,
            catalog: core.catalogs.cn,
            providerId: POOL_PROVIDER_BY_REGION.cn,
            displayName: POOL_NAME_BY_REGION.cn,
          }),
          global: createWorkBuddyAdapter({
            ctx,
            shim: shims.global,
            catalog: core.catalogs.global,
            providerId: POOL_PROVIDER_BY_REGION.global,
            displayName: POOL_NAME_BY_REGION.global,
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1721-1747](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/index.ts#L1721-L1747)

真实 registerAdapter 及失败释放。

<details>
<summary>查看原文（27行）</summary>

```text
          releaseAdapterGlobal = ctx.llm.registerAdapter(
            [POOL_PROVIDER_BY_REGION.global],
            adaptersByRegion.global.adapter,
          )
          releaseAdapterAggregate = ctx.llm.registerAdapter(
            [XDPOOL_AGGREGATE_PROVIDER],
            adaptersByRegion.aggregate.adapter,
          )
          // The free lane registers in the SAME try as the three pool adapters,
          // deliberately. It is the same kind of thing — a pi-ai provider over
          // the same loopback shim — so if it cannot be created the plugin is no
          // longer in a state it should advertise at all, and letting three
          // through would only hide that.
          releaseAdapterFree = ctx.llm.registerAdapter(
            [XDPOOL_FREE_PROVIDER],
            adaptersByRegion.free.adapter,
          )
        } catch (error: unknown) {
          // An adapter that cannot be created is not survivable — the picker
          // would advertise a provider with nothing behind it — so this is the
          // one path that still unwinds everything and gives up.
          ctx.logger.error('dsh-xdpool: adapter registration failed', error)
          recordStartupNote(`adapters REJECTED: ${describeError(error)}`)
          releaseAdapterCn?.()
          releaseAdapterGlobal?.()
          releaseAdapterAggregate?.()
          releaseAdapterFree?.()
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1290-1331](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/shim.ts#L1290-L1331)

同轮身份、有限尝试和无账号冷却错误。

<details>
<summary>查看原文（42行）</summary>

```text
    let last: { kind: UpstreamErrorKind; status: number; message: string } | undefined
    // One identity per user request, minted once, so every account the pool
    // rotates through - and the compaction retry below - file under the SAME
    // turn. Counting those separately would overstate how much the user asked
    // for, which is the one number a usage panel must never inflate.
    const turnId = randomBytes(8).toString('hex')
    const usageContext: UsageContext | undefined = usageRecorder === undefined
      ? undefined
      : { recorder: usageRecorder, region: region ?? 'cn', model: modelId ?? '(none)', turnId }
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      if (controller.signal.aborted) return
      const { account, reserveExempt } = await acquireForRequest(modelId, conversationKey, controller.signal)
      if (account === undefined) {
        // Ask the POOL why, instead of inferring it from this request alone.
        //
        // The old check used a flag set earlier IN THIS LOOP, which cannot see a
        // cooldown that was established by an earlier request. After a 429, the
        // next request found no account on its first attempt, the flag was still
        // false, and the shim answered 401 "no credential found; sign in" — so
        // DSH showed an "API key invalid" panel for a model that was merely
        // cooling, sending the user to re-authenticate over a temporary limit.
        const why = pool.unavailableReason(modelId, region, reserveExempt)
        if (why.reason === 'cooling') {
          // A rate limit is TEMPORARY: the caller should wait, not re-authenticate.
          const subject = modelId === undefined
            ? 'every WorkBuddy account is rate-limited'
            : `every account is rate-limited for model ${modelId}`
          const upstream = last === undefined ? '' : ` — ${last.message.slice(0, 200)}`
          // The gateway limits each ROW of a product line separately, so a
          // cooling free row usually has a working paid twin. Without this the
          // user's only move is to wait; naming the twin gives them a way out
          // that costs a little rather than nothing.
          const twin = modelId === undefined ? undefined : paidTwinHint(modelId)
          writeOpenAIError(
            res,
            429,
            'soft_rate',
            `${subject} (${why.cooling}/${why.total} cooling, tried ${tried.length})`
              + `${tried.length === 0 ? '' : `: ${tried.join(' → ')}`}${upstream}`
              + (twin === undefined ? '' : ` — ${twin}`),
          )
          return
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:1382-1402](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/shim.ts#L1382-L1402)

流接受后转发并退出循环。

<details>
<summary>查看原文（21行）</summary>

```text
      tried.push(account.label)
      const result = await client.chatStream(account.credential, prepared, controller.signal, conversationKey)
      if (result.ok) {
        // Success is filed by the stream forwarder, the only place that knows
        // when the stream really ended and what it cost.
        await serveSuccessfulStream(res, account, result, logger, refreshBalance, pool, usageContext)
        return
      }
      // A refusal is filed here because there is no stream to time: the call
      // left the machine and came back refused. Note the early return above,
      // where `pool.acquire` found nothing, records NOTHING - under-reporting
      // one turn beats claiming a request that was never sent.
      usageRecorder?.record({
        region: region ?? 'cn',
        model: modelId ?? '(none)',
        account: account.label,
        turnId,
        at: Date.now(),
        ok: false,
      })
      last = { kind: result.kind, status: result.status, message: result.message }
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:1450-1479](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/shim.ts#L1450-L1479)

只有指定限流继续轮转，超长另走压缩。

<details>
<summary>查看原文（30行）</summary>

```text
      // Other failures are terminal for this request.
      if (result.kind !== 'soft_rate') break
      // Cool only this model on this account; the account's other models stay
      // usable (the upstream explicitly allows switching to another model).
      pool.penalize(account.id, parseRateLimitReset(result.message), modelId)
      logger?.warn(
        `dsh-xdpool: ${account.label} rate-limited on ${modelId ?? '(no model)'} ` +
          `(attempt ${attempt + 1}/${maxAttempts}); rotating`,
      )
    }
    if (last === undefined) {
      writeOpenAIError(res, 500, 'internal', 'chat request exhausted without a result')
      return
    }
    // A context-window overrun has two layers of defence, and this is the inner
    // one. The Harness runs its own `compaction-basic` BEFORE dispatch, driven by
    // the context window each model advertises — but that window is a guess for
    // an upstream routed through a shim, so a prompt can still arrive too large.
    // When it does, compact in place here and retry once; if even that cannot fit,
    // emit the message the Harness classifies as an overflow (see
    // `contextOverflowMessage`) so its OUTER recovery path gets a chance to
    // shrink the history and retry at the agent level.
    //
    // The two layers are complementary, not redundant: this one keeps a single
    // turn alive without the Harness ever seeing a failure, and the outer one
    // survives the case where a shim-side compaction still will not fit.
    if (isContextTooLong(last.message)) {
      const recovered = await recoverFromContextOverrun({
        raw: poolRaw,
        modelId,
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 持久凭据、可选网关和积分自动化产生哪些副作用，默认保护是否足以替代访问控制？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

账号池把登录历史写入插件数据目录而不是仅临时读取桌面当前登录。account-store 明确把 credential 整体序列化为 JSON，经 tmp 写入再 rename。这个原子替换减少半文件，但该函数没有应用级加密或显式 mode 限制；不能把桌面原始凭据的加密机制等同于插件落盘副本受同样保护。实际文件权限取决于环境，集中保存多个自有账号扩大备份、共享目录和清理责任。停用插件也不等于删除账号快照，退出时须核本地数据与必要的账号撤销。

本地 shim 与 LAN relay 分开。relay 默认配置是关闭且回环地址；开启时允许配置到 0.0.0.0，使用独立 key 验证并仅转发白名单路径，转到 shim 时替换为进程内部 token。这个分层避免把短生命周期内部 token 发给外部设备，但监听日志与构造用 HTTP，不能据此承诺局域网传输保密。浏览器状态写操作检查 POST 与 loopback Origin；origin 缺失时允许，Origin 检查不能当成全网络身份认证或多租户隔离。

积分调度器确实在插件 apply 尾部 start，但 tick 首行在 enabled=false 时不做任务；“已启动调度器”与“默认自动代用户操作上游”不同。打开后会按计划补跑签到、任务、活跃、连登、旅行等，操作会改变远端账户状态；本次没有对其每条事件链或现行服务规则做完整验证。调度账本和 busy 标志减少部分重复调度，不能直接推出跨进程恰好一次或退出时远端副作用回滚。

因此本次采用边界仅主池本地小样，网关、积分及其他额外 lane 要分别确认。可借鉴的是监听/适配器生命周期、错误类别和请求身份分层；移植需重接宿主 registry、上游协议、凭据刷新与记账，不能只复制一个轮转循环。

#### 证据与依据

**依据 1 · 源码核查**：[src/account-store.ts:34-44](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/account-store.ts#L34-L44)

持久账号包含 credential 与目录来源。

<details>
<summary>查看原文（11行）</summary>

```text
/** One durably stored account: identity plus the credential that worked. */
export interface StoredAccount {
  id: string
  label: string
  credential: WorkBuddyCredential
  savedAtMs: number
}

/** Absolute path of the durable account list. */
export function accountStorePath(env: NodeJS.ProcessEnv = process.env): string {
  return join(dshHome(env), PLUGIN_DATA_DIR_NAME, ACCOUNTS_FILE_NAME)
```

</details>

**依据 2 · 源码核查**：[src/account-store.ts:103-118](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/account-store.ts#L103-L118)

凭据JSON写入，tmp/rename未显式加密或mode。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Atomically write the durable list: `${path}.tmp` first, then rename. A crash
 * mid-write leaves the previous generation intact.
 */
export async function saveStoredAccounts(path: string, accounts: readonly WorkBuddyAccount[]): Promise<void> {
  const stored: StoredAccount[] = accounts.map(account => ({
    id: account.id,
    label: account.label,
    credential: account.credential,
    savedAtMs: Date.now(),
  }))
  const document = JSON.stringify({ version: 1, accounts: stored }, null, 2) + '\n'
  await mkdir(join(path, '..'), { recursive: true })
  const tmp = `${path}.tmp`
  await writeFile(tmp, document, 'utf8')
  await rename(tmp, path)
```

</details>

**依据 3 · 源码核查**：[src/relay.ts:219-219](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/relay.ts#L219-L219)

无配置时默认关闭回环。

```text
      return { enabled: false, host: RELAY_HOSTS[0] ?? '127.0.0.1', port: RELAY_DEFAULT_PORT, key: '' }
```

**依据 4 · 源码核查**：[src/relay.ts:281-303](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/relay.ts#L281-L303)

独立key、白名单和内部转发。

<details>
<summary>查看原文（23行）</summary>

```text
    if (!settings.enabled) {
      writeJson(res, 503, 'relay_disabled', 'the XD Pool LAN relay is switched off')
      return
    }
    if (!keyMatches(bearerOf(req), settings.key)) {
      writeJson(res, 401, 'relay_unauthorized', 'a valid XD Pool relay key is required')
      return
    }
    const path = (req.url ?? '').split('?')[0] ?? ''
    if (!RELAY_FORWARDED_PATHS.has(path)) {
      writeJson(res, 404, 'relay_no_route', `${path} is not a path this relay forwards`)
      return
    }
    const target = new URL(`${shim.baseUrl()}${path}`)
    const send = target.protocol === 'https:' ? httpsRequest : httpRequest
    const upstream = send(
      {
        protocol: target.protocol,
        hostname: target.hostname,
        port: target.port === '' ? 80 : Number(target.port),
        method: req.method,
        path: `${target.pathname}${target.search}`,
        headers: upstreamHeaders(req, shim.token()),
```

</details>

**依据 5 · 源码核查**：[src/web-status.ts:302-310](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/web-status.ts#L302-L310)

Origin缺失允许，回环Origin检查的实际边界。

```text
/** Loopback browser origins only; other devices are refused. */
function loopbackOrigin(req: IncomingMessage): boolean {
  const origin = req.headers.origin
  if (origin === undefined) return true
  try {
    const { hostname } = new URL(origin)
    return hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '[::1]' || hostname === '::1'
  } catch {
    return false
```

**依据 6 · 源码核查**：[src/index.ts:1590-1593](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/index.ts#L1590-L1593)

调度start但关闭时no-op。

```text
  // Start the automation last, once every runtime object exists: a tick firing
  // immediately must not find a half-applied core. The scheduler no-ops while
  // `enabled` is false, so this is safe on an install that never opened the card.
  core.scheduler.start()
```

**依据 7 · 源码核查**：[src/scheduler.ts:914-937](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/scheduler.ts#L914-L937)

enabled/busy与补跑调度。

<details>
<summary>查看原文（24行）</summary>

```text
  private async tick(): Promise<void> {
    if (!this.enabled || this.stopped || this.busy) return
    this.busy = true
    try {
      const now = this.now()
      const slot = slotKey(now)
      const today = dayKey(now)
      for (const kind of JOB_KINDS) {
        if (this.stopped) return
        // Throttle only: never start the same job twice inside one clock hour.
        // This is NOT the schedule ledger — that is `firedSlots`, checked by
        // `dueSlot` below. Tying the throttle to the ledger is what let a
        // catch-up run consume a slot it had not actually been scheduled for.
        if (this.states[kind].lastFiredHour === slot) continue
        // CATCH-UP: run if the configured hour has already PASSED and that
        // slot is still unconsumed. The old equality test (`hour === configured`)
        // silently skipped the day whenever DSH was not running at that exact
        // hour — a 09:00 check-in never ran if the app started at 10:00. Asking
        // "has the hour passed, and is that slot still unspent" makes a missed
        // schedule self-heal on the next tick, which is what a laptop that
        // slept through the hour needs.
        const consumed = this.dueSlot(kind, now)
        if (consumed === undefined) continue
        await this.runJob(kind, today, consumed)
```

</details>

#### 缺口

- 未完整核查厂商登录包、积分事件链与远程访问部署
  **影响**：不支持所有渠道/自动化/共享场景的安全或有效性结论
  **进一步探讨**：逐个分离验收新增lane；网关核TLS/主机访问策略；积分先核远端记录和服务允许的使用范围。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么用户值得承担本地试用负担，如何衡量收益并检验请求恢复的新方向？

**研究主题**：效果与总成本、采用判断、新假设与验证、贡献与相对优势、依赖、兼容与流程

#### 完整回答

已有多个自有账号且能处理本机凭据的用户，可以先试主池的有限拒绝容错；只需一个稳定账号的人仍可使用原 provider，不能因为界面功能多就判断值得迁移。操作只在用户对账号和调用有权的条件下有意义；作者个人研究用途说明不等于厂商允许自动化，当前服务条款、额度和价格没有核实，因此不把“免费”算成本基线。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm/settings、适配器peer与指定Node | 主池必需 | 注册provider与设置 | 先核profile依赖和启动日志，兼容未运行 |
| 自有WorkBuddy桌面登录及可读取凭据 | WorkBuddy主池必需 | 发现账号、刷新会话 | 未登录或失效需桌面重登，不能制造账号 |
| 上游网络、模型可用和额度 | 调用必需 | 处理任务 | 限流可冷却；其余拒绝需用户处理 |
| 其他厂商登录或key | 特定lane必需 | 提供额外模型 | 未配置不等于已有可用额度 |
| relay key和访问边界 | 仅共享网关必需 | 外部设备认证 | 默认关闭，HTTP共享另核保密 |
| 积分授权与可解释账目 | 仅自动化必需 | 远端账户动作 | 先不启用，不以预计奖励抵扣费用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份profile、核账号及插件数据位置 | 明确会持久化的凭据和删除退路 |
| 加载 | 用户按README装对应profile并重启 | 两区域shim和provider注册状态一致 |
| 调用 | 用户仅主池非敏感任务，不开额外自动化/网关 | 记录所选模型、拒绝和最终回答 |
| 验收 | 用户对照原单账号provider与池处理同任务 | 核合格结果、总尝试与账单，而非只看已换号 |
| 退出 | 用户改回原provider、停用并核残留文件/会话 | 不再监听或调度，按备份接管，不盲目重复失败任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 账号、模型及存储成本未知 | profile、凭据发现和日志核对 | 不由免费标签推定0元 |
| 持续使用 | 多次请求、缓存失效和摘要调用 | 核路由、余额及模型结果 | 净成本和合格率未测 |
| 失败恢复 | 已接收但未完成的请求可能已消耗额度 | 分清拒绝、部分输出与远端未知结果 | 不保证透明续写或副作用回滚 |
| 退出 | 快照与备份保留资源 | 恢复provider，清理凭据并按需撤销 | 停用不等于凭据已清除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少手动切号 | 拒绝分类、冷却和账号选择接线 | 同任务实际少多少人工 |
| 用量解释 | 同一turnId覆盖物理尝试 | 全部lane与上游账单完全一致 |
| 总成本 | 可识别重试/缓存/摘要开销 | 单位合格任务是否更低 |

新假设是恢复账以同一请求标识并列呈现拒绝前尝试、已输出断流、压缩导致的历史变化及费用来源，帮助用户决定是否重试。已有turnId和用量面板是直接反证，不能声称系统没有记账。应先检查现有面板能否解释这些状态；在同样任务上对照现状与新增解释，测错误重试、任务遗漏、总费用和人工复核时间。若无改善或日志/隐私负担超过收益，就否定新增设计。该假设未验证，不计本版本创新。

试用出现账号去向、扣费或部分输出不可解释时，先停止新任务并回原provider，核远端状态后再决定重跑；不要以清冷却按钮代替问题诊断。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:20-32](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/package.json#L20-L32)

运行时与DSH范围声明。

<details>
<summary>查看原文（13行）</summary>

```text
    "codebuddy",
    "model-provider",
    "multi-account",
    "failover"
  ],
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.1.5-rc.1 <0.3.0"
  },
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "bin": {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1645-1669](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/index.ts#L1645-L1669)

监听ready之后才构建适配器。

<details>
<summary>查看原文（25行）</summary>

```text
  // Register once BOTH loopback listeners hold a port: each adapter reads its
  // shim origin at construction time, so neither can be built any earlier.
  void Promise.all([shims.cn.ready, shims.global.ready])
    .then(async () => {
      if (stopped) return
      recordStartupNote(`both shims ready cn=${shims.cn.baseUrl()} global=${shims.global.baseUrl()}; entering registration`)
      try {
        // One adapter per region. Each provider is bound to its own account
        // slice of the pool (see the `region` argument on `pool.acquire`), so a
        // CN request can never be served by a global account and vice versa —
        // the two gateways are not interchangeable.
        const adaptersByRegion = {
          cn: createWorkBuddyAdapter({
            ctx,
            shim: shims.cn,
            catalog: core.catalogs.cn,
            providerId: POOL_PROVIDER_BY_REGION.cn,
            displayName: POOL_NAME_BY_REGION.cn,
          }),
          global: createWorkBuddyAdapter({
            ctx,
            shim: shims.global,
            catalog: core.catalogs.global,
            providerId: POOL_PROVIDER_BY_REGION.global,
            displayName: POOL_NAME_BY_REGION.global,
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1290-1298](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/shim.ts#L1290-L1298)

已有请求级turnId是新假设的比较基线。

```text
    let last: { kind: UpstreamErrorKind; status: number; message: string } | undefined
    // One identity per user request, minted once, so every account the pool
    // rotates through - and the compaction retry below - file under the SAME
    // turn. Counting those separately would overstate how much the user asked
    // for, which is the one number a usage panel must never inflate.
    const turnId = randomBytes(8).toString('hex')
    const usageContext: UsageContext | undefined = usageRecorder === undefined
      ? undefined
      : { recorder: usageRecorder, region: region ?? 'cn', model: modelId ?? '(none)', turnId }
```

**依据 4 · 源码核查**：[src/account-store.ts:107-118](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/account-store.ts#L107-L118)

退出必须考虑额外持久凭据。

<details>
<summary>查看原文（12行）</summary>

```text
export async function saveStoredAccounts(path: string, accounts: readonly WorkBuddyAccount[]): Promise<void> {
  const stored: StoredAccount[] = accounts.map(account => ({
    id: account.id,
    label: account.label,
    credential: account.credential,
    savedAtMs: Date.now(),
  }))
  const document = JSON.stringify({ version: 1, accounts: stored }, null, 2) + '\n'
  await mkdir(join(path, '..'), { recursive: true })
  const tmp = `${path}.tmp`
  await writeFile(tmp, document, 'utf8')
  await rename(tmp, path)
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:1450-1479](https://github.com/XDTrees/dsh-xdpool/blob/74a80b6e6b568d97957a623a0d9d3b625035fed7/src/shim.ts#L1450-L1479)

重试分类和压缩带来额外开销。

<details>
<summary>查看原文（30行）</summary>

```text
      // Other failures are terminal for this request.
      if (result.kind !== 'soft_rate') break
      // Cool only this model on this account; the account's other models stay
      // usable (the upstream explicitly allows switching to another model).
      pool.penalize(account.id, parseRateLimitReset(result.message), modelId)
      logger?.warn(
        `dsh-xdpool: ${account.label} rate-limited on ${modelId ?? '(no model)'} ` +
          `(attempt ${attempt + 1}/${maxAttempts}); rotating`,
      )
    }
    if (last === undefined) {
      writeOpenAIError(res, 500, 'internal', 'chat request exhausted without a result')
      return
    }
    // A context-window overrun has two layers of defence, and this is the inner
    // one. The Harness runs its own `compaction-basic` BEFORE dispatch, driven by
    // the context window each model advertises — but that window is a guess for
    // an upstream routed through a shim, so a prompt can still arrive too large.
    // When it does, compact in place here and retry once; if even that cannot fit,
    // emit the message the Harness classifies as an overflow (see
    // `contextOverflowMessage`) so its OUTER recovery path gets a chance to
    // shrink the history and retry at the agent level.
    //
    // The two layers are complementary, not redundant: this one keeps a single
    // turn alive without the Harness ever seeing a failure, and the outer one
    // survives the case where a shim-side compaction still will not fit.
    if (isContextTooLong(last.message)) {
      const recovered = await recoverFromContextOverrun({
        raw: poolRaw,
        modelId,
```

</details>

#### 缺口

- 无同任务效果/费用/恢复对照
  **影响**：无法确认净收益或新增恢复账的价值
  **进一步探讨**：以上述原单账号provider对照，记录任务结果和所有物理调用；新增信息无改善即放弃。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
