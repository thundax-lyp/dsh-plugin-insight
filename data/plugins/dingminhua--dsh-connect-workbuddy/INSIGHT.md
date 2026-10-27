# DSH Connect WorkBuddy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[bba5ea5](https://github.com/dingminhua/dsh-connect-workbuddy/tree/bba5ea5c638995f612dfbb4612951a0a4e3532ac)

<!-- BEGIN META -->
[![GitHub ★ 671](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=671&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-workbuddy) [![npm 30d 37,263](https://img.shields.io/static/v1?label=npm+30d&message=37%2C263&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy) [![最新发布 2026-10-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-26&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy)
<!-- END META -->

> **功能**：把本机 WorkBuddy 账号模型接入 DSH，管理双区域模型、账号池与积分读数。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 证明账号模型接线及受限换号确实落在请求链中，减少界面切换和手工重选；实际吞吐与费用改善未测。

> **主要限制**：[Q03](#research-q03) 非公开接口与上游账号限制会直接击穿持续可用性；失败重试与探测仍会消耗资源，账号池不能提供稳定额度或恰好一次保证。

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
  - [Q01 · 模型接入相对官方客户端改变哪一步？](#detail-section-11)
  - [Q02 · 从 provider 到上游和失败换号如何接通？](#detail-section-12)
  - [Q03 · 账号、测试、上游限制如何改变成本与持续性？](#detail-section-13)
  - [Q04 · 谁值得试用，怎样检验换号是否净有益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 WorkBuddy 账号的 DSH 用户，希望在当前编码环境调用其模型而不切客户端。

官方 WorkBuddy 客户端和手工选择账号；上游模型能力不算插件增量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 双区域模型接入 | 在DSH选择账号模型 | 已有有效账号和上游允许 |
| 失败换号 | 重选未尝试账号 | 限失败类别，不能保证扣费回滚 |
| 串行签到 | 逐账号检查和领取 | 先读状态，企业账号跳过 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node ^22.19 或>=24、DSH模型服务 | 必需 | 注册provider | 无法接入 |
| 用户 WorkBuddy 登录和额度 | 调用必需 | 上游鉴权与计费 | 拒绝或限流 |
| 非公开客户端接口 | 必需 | 模型目录与请求 | 上游调整可能失效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核对账号和额度并接入插件 | 区域与模型正确显示 |
| 调用 | Agent 使用选定模型 | 检查回答与服务账号 |
| 失败 | 池按分类换未尝试账号 | 被拒或消费未知即停 |
| 退出 | 用户关闭池或provider | 回手工或官方客户端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主及本地凭据存储 | 账号发现和配置 | 用时未知 |
| 持续使用 | 模型积分及真实探测请求 | 核对目录、余额和错误 | 实际单任务消耗未知 |
| 失败恢复 | 换号与重复请求可能消费 | 核对服务账号及扣费 | 外部结果不一定可撤销 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 环境整合 | 模型provider实际注册 | 当前服务可用性与任务收益 |
| 失败治理 | 身份去重、取消和错误分类 | 总体吞吐与真实扣费改善 |

> **思考**：[Q03](#research-q03) 非公开接口与上游账号限制会直接击穿持续可用性；失败重试与探测仍会消耗资源，账号池不能提供稳定额度或恰好一次保证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 证明账号模型接线及受限换号确实落在请求链中，减少界面切换和手工重选；实际吞吐与费用改善未测。

[Q02](#research-q02) 本地秘密与上游账号分层、取消不污染测量、重试身份去重值得借鉴；移植需继续维护上游协议与凭据生命周期。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 非公开接口与上游账号限制会直接击穿持续可用性；失败重试与探测仍会消耗资源，账号池不能提供稳定额度或恰好一次保证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先给非关键任务明确额度上限，比较手工换号和池的合格回答及消耗；被拒或费用不清回官方客户端。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

provider、凭据转发和换号边界有源码支持；上游可用性、实际扣费和合格任务收益未知。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/adapter.ts、src/shim.ts、src/upstream.ts、src/account-pool-run.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本的provider接线、上游chat、失败换号和批量签到；图片、视频与CLI子功能不列为已核实能力。
- 下一步：固定模型比较手工换号和池，核对首次失败、流中断、取消及全部扣费；未执行。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)
- **版本号**：5.12.2（[固定提交 bba5ea5](https://github.com/dingminhua/dsh-connect-workbuddy/tree/bba5ea5c638995f612dfbb4612951a0a4e3532ac)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出将已消费积分与换号原因一起供用户决策，未验证；若不能减少无效重试或辨识消费仍困难则否定。

固定模型比较手工换号和池，核对首次失败、流中断、取消及全部扣费；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 39 | 13822 | — | — | 377877 |
| .mjs | source | 15 | 2805 | 2032 | 569 | — |
| .ts | source | 69 | 38834 | 18215 | 18979 | — |
| .tsx | source | 12 | 9376 | 4986 | 4163 | — |
| .ts | test | 114 | 39198 | 26895 | 9211 | — |
| .tsx | test | 32 | 8815 | 5830 | 2375 | — |

</details>

**活跃度**

[![Issue 未关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 101](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=101&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 95](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=95&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：账号复用和失败换号能否减少切换且不隐藏消耗？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 模型接入相对官方客户端改变哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有本机 WorkBuddy 登录态的 DSH 用户可以直接在宿主模型选择器使用账号模型，原办法是切到官方客户端，或自行维护协议适配。本组件增量是双区域 provider、账号与模型管理和余额可见性，模型能力来自上游，不是插件原创。README 明确依赖非公开客户端接口且已受非官方客户端限制，不能把账号额度视作稳定开放 API。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-35](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/README.md#L27-L35)

接入目的、上游接口与限制由作者明确说明。

```text
一个独立的 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) bundle 插件。它把本机已登录的 WorkBuddy 账号（**国内版与国际版 WorkBuddy AI 均支持**）接到 DSH 的模型选择器，同时提供账号池、可勾选的模型管理，以及一套围绕积分的只读能力：**每次刷新按上游目录自动读取每个模型的积分倍率**（`x0.79` 这种，倍率完全由上游给出，插件不写死也不猜）、逐模型开关图片输入、多账号切换与账号池自动换号、每日签到、以及卡片与输入框里胶囊式的只读积分读数。**国内版与国际版是两个并行的供应商（`workbuddy` / `workbuddy-global`），可同时使用**；插件设置卡片以 tab 区分两者，方便统一管理。只需本机 WorkBuddy 的登录态，**或在浏览器里登录一次**即可。

## 风险提示

> **WorkBuddy 已开始限制非官方客户端请求。本项目不保证相关接口长期可用，上游一旦收紧限制，插件可能失效。请先阅读文末[「免责声明」](#免责声明)，自行评估账号风险。使用官方 WorkBuddy 客户端始终是最安全的选择。**

需要说明的是，这个插件的目的很普通：**省掉在 WorkBuddy 客户端和 DSH 之间来回切换的麻烦**。你已经在自己的机器上登录了 WorkBuddy，插件只是把那份已有的登录态接到 DSH 的模型选择器上，让你在写代码的地方直接用到它——不提供账号、不共享凭据、不绕过计费。每一次调用都消耗**你自己账号**的额度，按上游给出的倍率真实扣费，插件从不修改账号状态，也不附带任何提权或刷额度的能力。

它依赖的是 WorkBuddy 客户端自身的接口（非官方开放 API），所以上游调整时插件可能需要跟着调整——这是这类工具的常态，也是这条提示存在的原因。**请自行评估账号风险后再决定是否安装。**
```

**依据 2 · 源码核查**：[src/index.ts:3288-3324](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/index.ts#L3288-L3324)

国内与国际 adapter 真正注册。

<details>
<summary>查看原文（37行）</summary>

```text
      try {
        // Constructed only once the listeners hold their ports: a provider's
        // models read the shim origin at construction time.
        for (const region of REGION_KEYS) {
          adapters[region] = createWorkBuddyAdapter({
            shim: stacks[region].shim,
            store: stacks[region].store,
            catalog: stacks[region].catalog,
            provider: WORKBUDDY_PROVIDERS[region],
            displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES[region],
            resolveAttachments: () => ctx.get('attachments'),
            resolveContextRescue: () => contextRescue,
            // Read through `current()` (not the captured `config`) so the
            // switch applies to the NEXT request: the user turns it on while
            // looking at a working-notes turn, and a stale capture would make
            // that look like a broken toggle.
            dropForeignThinking: () => unwrapVolatile(current().dropForeignThinking) === true,
            onForeignThinking: blocks => {
              latestForeignThinking = { blocks, atMs: Date.now() }
            },
          })
        }
        invalidateCatalog = () => {
          for (const region of REGION_KEYS) adapters[region].invalidate()
        }

        let releaseAdapterCn: (() => void) | undefined
        let releaseAdapterGlobal: (() => void) | undefined
        let releaseDirectory: (() => void) | undefined
        try {
          // Always register the route first: an empty INITIAL registration is
          // invalid (`INVALID_ADAPTER`), while `replace([])` on a live one is
          // explicitly legal. `syncRegionRegistration` below then withdraws the
          // route for a region the user has switched off, in the same synchronous
          // section, so nothing observes the transient route.
          releaseAdapterCn = registration.cn.adapter = ctx.llm.registerAdapter([WORKBUDDY_PROVIDER], adapters.cn.adapter)
          releaseAdapterGlobal = registration.global.adapter = ctx.llm.registerAdapter([WORKBUDDY_GLOBAL_PROVIDER], adapters.global.adapter)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从 provider 到上游和失败换号如何接通？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

index 创建两个区域 adapter，adapter 用每进程 shim 密钥作本地 Bearer，实际 WorkBuddy token 由 shim/store 解析，远端 chatStream 再向账号区域 /v2/chat/completions 发送。shim 只在初始结果失败且符合换号类别时尝试其他账号，已尝试身份去重，中止信号前后检查，间隔后再请求；成功取得 SSE 响应意味着退出此失败换号循环，并不证明完整回答或工具任务成功。上游传输错误变 server 结果，重试可能仍消耗额度，不能保证远端无副作用。失败记录不把用户中止记作账号不可用，减少健康账号被误停用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:3288-3324](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/index.ts#L3288-L3324)

按区域实例与路由注册。

<details>
<summary>查看原文（37行）</summary>

```text
      try {
        // Constructed only once the listeners hold their ports: a provider's
        // models read the shim origin at construction time.
        for (const region of REGION_KEYS) {
          adapters[region] = createWorkBuddyAdapter({
            shim: stacks[region].shim,
            store: stacks[region].store,
            catalog: stacks[region].catalog,
            provider: WORKBUDDY_PROVIDERS[region],
            displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES[region],
            resolveAttachments: () => ctx.get('attachments'),
            resolveContextRescue: () => contextRescue,
            // Read through `current()` (not the captured `config`) so the
            // switch applies to the NEXT request: the user turns it on while
            // looking at a working-notes turn, and a stale capture would make
            // that look like a broken toggle.
            dropForeignThinking: () => unwrapVolatile(current().dropForeignThinking) === true,
            onForeignThinking: blocks => {
              latestForeignThinking = { blocks, atMs: Date.now() }
            },
          })
        }
        invalidateCatalog = () => {
          for (const region of REGION_KEYS) adapters[region].invalidate()
        }

        let releaseAdapterCn: (() => void) | undefined
        let releaseAdapterGlobal: (() => void) | undefined
        let releaseDirectory: (() => void) | undefined
        try {
          // Always register the route first: an empty INITIAL registration is
          // invalid (`INVALID_ADAPTER`), while `replace([])` on a live one is
          // explicitly legal. `syncRegionRegistration` below then withdraws the
          // route for a region the user has switched off, in the same synchronous
          // section, so nothing observes the transient route.
          releaseAdapterCn = registration.cn.adapter = ctx.llm.registerAdapter([WORKBUDDY_PROVIDER], adapters.cn.adapter)
          releaseAdapterGlobal = registration.global.adapter = ctx.llm.registerAdapter([WORKBUDDY_GLOBAL_PROVIDER], adapters.global.adapter)
```

</details>

**依据 2 · 源码核查**：[src/adapter.ts:1301-1316](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/adapter.ts#L1301-L1316)

本地秘密和真实凭据分离。

<details>
<summary>查看原文（16行）</summary>

```text
  const adapter = new EffortNormalizingAdapter({
    profiles: () => profiles,
    auth: INERT_AUTH,
    // Resolve the shim's per-process shared secret as the OpenAI apiKey so
    // pi-ai sends it as `Authorization: Bearer <shared-secret>`. The shim
    // validates this before forwarding and resolves the real WorkBuddy token
    // itself via the store, so the secret never reaches upstream.
    resolveApiKey: async () => shim.token(),
    ...resolveAttachments === undefined ? {} : { resolveAttachments },
  }, effortCapable)

  return {
    adapter,
    invalidate: () => {
      profiles = buildProfiles()
    },
```

</details>

**依据 3 · 源码核查**：[src/upstream.ts:3343-3374](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/upstream.ts#L3343-L3374)

带账号 token 的实际远端请求及错误分类。

<details>
<summary>查看原文（32行）</summary>

```text
  async chatStream(
    credential: WorkBuddyCredential,
    bodyJson: string,
    signal?: AbortSignal,
  ): Promise<WorkBuddyChatResult> {
    let response: Response
    // Deliberately NO ceiling of our own here, unlike `probeChat`.
    //
    // A chat answer has to prefill the whole prompt before its first byte, and
    // that legitimately varies by an order of magnitude with context size — a
    // bound tight enough to matter would eventually cut a real answer short, and
    // cutting a real answer is worse than waiting for a slow one. What remains is
    // the caller's cancellation (the shim's controller, which aborts when the
    // client hangs up) plus the HTTP client's own default headers timeout.
    //
    // Detecting a DEAD endpoint is the probe's job, not this path's: the pool
    // tests liveness with a cheap fixed request (see `PROBE_TIMEOUT_MS`) and
    // excludes what does not answer. Bounding the real request as well would be a
    // second, far more expensive detector for the same fact.
    try {
      response = await fetch(`${chatBase(credential)}/v2/chat/completions`, {
        method: 'POST',
        headers: { ...chatHeaders(credential, this.identity), 'Authorization': `Bearer ${credential.accessToken}` },
        body: bodyJson,
        ...signal === undefined ? {} : { signal },
      })
    } catch (error: unknown) {
      return { ok: false, status: 0, kind: 'server', message: `transport error: ${String(error)}` }
    }
    if (response.ok) return { ok: true, response }
    const text = (await response.text()).slice(0, ERROR_BODY_LIMIT)
    const kind = classifyUpstreamError(response.status, text)
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:1834-1873](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/shim.ts#L1834-L1873)

失败换号、去重和取消条件。

<details>
<summary>查看原文（40行）</summary>

```text
    while (!result.ok && isFailoverWorthy(result.kind) && failoverAccount !== undefined) {
      // A client that hung up is not waiting for a better account.
      if (controller.signal.aborted) break
      recordAttempt(credential, result)
      triedAccountIds.push(workbuddyAccountId(credential))
      const next = await failoverAccount(triedAccountIds).catch(() => undefined)
      if (next === undefined) break
      // The policy is expected to skip what was already tried, and the shim does
      // not rely on it: a candidate that repeats one of them would re-send the
      // same request to the same account forever, spending real quota in a loop
      // with no upper bound. `triedAccountIds` is the only brake there is, so
      // the identity check lives here as well as in the policy.
      if (triedAccountIds.includes(workbuddyAccountId(next))) break
      // Wait before hitting another account: the upstream's rate limit (6004)
      // fires on request volume, so hammering it with zero-gap retries makes
      // every candidate hit the same wall — 4 accounts can fail in under a
      // second. The batch test already waits 400ms between accounts for exactly
      // this reason; the failover loop used to wait nothing. The wait is
      // abortable: if the client hung up we stop instead of sleeping on, and the
      // check AFTER it ends the loop rather than spending the remaining accounts
      // on requests whose signal is already dead.
      if (controller.signal.aborted) break
      await new Promise<void>(resolve => {
        if (controller.signal.aborted) return resolve()
        const timer = setTimeout(resolve, FAILOVER_ACCOUNT_GAP_MS)
        controller.signal.addEventListener('abort', () => { clearTimeout(timer); resolve() }, { once: true })
      })
      if (controller.signal.aborted) break
      logger?.warn(
        `dsh-connect-workbuddy: retrying chat on another pool account after ${result.kind} (http ${result.status})`,
      )
      // Remember WHY the switch happened and FROM which account, so the answer
      // can carry one line saying so. Recorded here rather than only logged: the
      // log is invisible to the person reading the reply, and a silent failover
      // is indistinguishable from the account they chose having answered.
      switchedFrom ??= describeAccount(credential)
      switchedBecause ??= failoverReasonText(result)
      credential = next
      result = await client.chatStream(credential, prepared, controller.signal)
    }
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:1792-1826](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/shim.ts#L1792-L1826)

中止不污染账号测量。

<details>
<summary>查看原文（35行）</summary>

```text
    const failures: Array<{ accountId: string, failure: WorkBuddyChatResult }> = []
    const recordAttempt = (credential: WorkBuddyCredential, failure: WorkBuddyChatResult): void => {
      if (failure.ok) return
      failures.push({ accountId: workbuddyAccountId(credential), failure })
    }
    const reportFailures = (): void => {
      // Drain FIRST, unconditionally. A second call (the markup-only retry path
      // reports its own attempts) must never re-report a measurement that was
      // already stored, and every early return below has to consume what it
      // discards — an earlier version cleared this and then iterated the cleared
      // array, which silently reported nothing at all.
      const batch = failures.splice(0, failures.length)
      if (onAccountFailure === undefined) return
      // A client that hung up leaves NO measurement worth keeping.
      //
      // Our own abort surfaces as a transport failure (`status: 0`, `kind:
      // 'server'`), so it is indistinguishable from a dead network where the
      // plugin reads it — and it used to be recorded as `unavailable`, which the
      // pool then treated as a statement about the ACCOUNT. One closed panel
      // could therefore idle a healthy account, and with every member idled the
      // pool had no candidate and failover had nowhere to go.
      //
      // The retry loop already refuses to fail over for an aborted request (see
      // the `controller.signal.aborted` guard below); this is the same rule
      // applied one step later, to the bookkeeping.
      if (controller.signal.aborted) return
      for (const entry of batch) {
        if (entry.failure.ok) continue
        try {
          onAccountFailure(entry.accountId, {
            status: entry.failure.status,
            kind: entry.failure.kind,
            message: entry.failure.message,
            ...requestModelId === undefined ? {} : { modelId: requestModelId },
          })
```

</details>

#### 缺口

- 真实流中断和远端消费结果未知
  **影响**：不能把重试成功当恰好一次业务执行
  **进一步探讨**：核对首字节前后断线、额度变化和工具副作用

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账号、测试、上游限制如何改变成本与持续性？

**研究主题**：依赖、兼容与流程、效果与总成本、缺陷与关键质疑

#### 完整回答

启动要兼容 Node、DSH 模型服务及用户自己的有效账号，持续效果取决于非公开接口、区域目录和限流。模型倍率与积分由上游给出，不能从切换账号推导调用免费或总成本下降。批量探测是实际请求，README 说明约25k输入；串行批处理与失败逐行记录可减少整批不透明，但本轮未运行，不引用注释中的历史实测作当前结果。签到先查状态、企业账号跳过；已签到不写只是客户端幂等便利，不保证并发重入的服务端事务。用户需维护授权账号、观察消耗和错误，关闭池可退回手工选择，接口被拒时用官方客户端。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-20](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/package.json#L17-L20)

Node版本条件。

```text
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

**依据 2 · 作者声明**：[README.md:115-128](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/README.md#L115-L128)

池开关、手工动作与空成员约束。

<details>
<summary>查看原文（14行）</summary>

```text
**它只控制「插件要不要自己决定」，不控制「你能不能操作」。**

| | 账号池 **开启** | 账号池 **关闭** |
|---|---|---|
| 谁服务 | 由排序**自动**选出（可用优先 → 快过期先花 → 积分高 → 凭据新） | **你在账号池里手动选**「使用哪个账号」 |
| 请求失败 | **自动**换下一个可用账号重试 | 不换号，如实报错 |
| 一键签到 / 一键测试 | 可用 | **仍然可用** |
| 目标测试模型 | 可改 | **仍然可改** |

最后两行是刻意的：签到与测试是**手动动作**，它们作用于你勾选的成员，与「插件是否自动路由」是两件事。之前把按钮也挂在开关上，导致关掉账号池就**再也没法签到或测试**——而「关闭」本该是「我手动来」，不是「什么都不许做」。

**手动选择账号在哪里**：账号池区块里。**关闭账号池时**，该区块会显示一行「使用哪个账号」的下拉，选定即生效（写回本区域的账号槽，与凭据失效时的「切换到可用账号」走同一条已验证的写入路径）；**开启账号池时这一行不显示**——那时由排序决定，一个改了不生效的下拉比没有更糟。账号的发现（「重新检测账号」）、勾选、签到与测试全部集中在这个区块里，所以账号管理只有一处。

**唯一的硬约束**：池里一个成员都没勾选时，批量动作一律拒绝。空的池**绝不**退化成「那就对全部账号执行」——那是唯一会花掉你没授权过的积分的解读。
```

</details>

**依据 3 · 作者声明**：[README.md:142-145](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/README.md#L142-L145)

探测实际调用体积的作者说明。

```text
### 两个批量动作

- **签到勾选的账号** —— 逐个账号签到。**签到前先查当天状态**，已签到的直接标记为「已签到」而**不发写入请求**（幂等，不重复领取）；任何单个账号失败只标记该行，**不中断整批**。
- **测试勾选的账号** —— 对每个成员发一次**真实体积**的探测请求（约 25k 输入 token；与模型行的「测试」是同一套 `probeModel`，因而同样继承两个实测结论：限流**按请求体积**触发、恢复时间写在**响应体**里而不是响应头），得出该账号此刻能否用这个模型。
```

**依据 4 · 源码核查**：[src/account-pool-run.ts:103-165](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/account-pool-run.ts#L103-L165)

串行签到、企业跳过和先读状态。

<details>
<summary>查看原文（63行）</summary>

```text
export async function checkinAllAccounts(
  targets: readonly WorkBuddyPoolTarget[],
  deps: WorkBuddyPoolRunnerDeps,
  nowMs: () => number = Date.now,
): Promise<WorkBuddyPoolCheckinRow[]> {
  void nowMs
  const rows: WorkBuddyPoolCheckinRow[] = []
  let issued = 0
  for (const target of targets) {
    // An enterprise account has no consumer check-in to claim (see
    // `WorkBuddyPoolTarget.enterprise`). Reported as `skipped`, not `failed`:
    // nothing is wrong with the account.
    if (target.enterprise === true) {
      rows.push({
        accountId: target.accountId,
        accountName: target.accountName,
        status: 'skipped',
        message: 'enterprise accounts have no daily check-in',
      })
      continue
    }
    // The gap is between REQUESTS, not between rows: a skipped row costs
    // nothing, so it must not delay the next one.
    if (issued > 0) await (deps.wait ?? defaultWait)(POOL_BATCH_GAP_MS)
    issued += 1
    rows.push(await checkinOne(target, deps))
  }
  return rows
}

/** One account's check-in, reduced to its row. */
async function checkinOne(
  target: WorkBuddyPoolTarget,
  deps: WorkBuddyPoolRunnerDeps,
): Promise<WorkBuddyPoolCheckinRow> {
  const base = { accountId: target.accountId, accountName: target.accountName }
  let credential: WorkBuddyCredential | undefined
  try {
    credential = await deps.credentialFor(target.accountId)
  } catch (error: unknown) {
    return { ...base, status: 'failed', message: messageOf(error) }
  }
  if (credential === undefined) {
    return { ...base, status: 'failed', message: 'no stored credential for this account' }
  }
  try {
    const status = await deps.fetchCheckinStatus(credential)
    // Not active (an upstream-declared closed window) is reported as `failed`
    // rather than `already`: claiming is impossible, and saying "already
    // checked in" would be a different, wrong claim.
    if (!status.active) {
      return { ...base, status: 'failed', message: 'check-in activity is not active' }
    }
    if (status.todayCheckedIn) return { ...base, status: 'already' }
    const claim = await deps.claimDailyCheckin(credential)
    return {
      ...base,
      status: 'claimed',
      credit: claim.credit,
      streakDays: claim.streakDays,
    }
  } catch (error: unknown) {
    return { ...base, status: 'failed', message: messageOf(error) }
```

</details>

#### 缺口

- 当期服务可用性与实际额度消耗未测
  **影响**：不能给稳定长期接入或费用节省保证
  **进一步探讨**：用受控账号记录单次请求、探测、失败换号及扣费

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，怎样检验换号是否净有益？

**研究主题**：新假设与验证、采用判断

#### 完整回答

愿意自行承担非官方接口不稳定性且已有账号的 DSH 用户，可以在非关键文本任务中限额试用；需要稳定服务承诺的生产任务应继续官方 API 或客户端。可探索“每次重试展示已花额度与当前服务账号”的决策支持：现有换号会记录原因和初始账号，补充真实扣费可能让用户更容易决定停止，但这是待验证方向。比较手工换号与账号池，统计合格回答、失败尝试、实际积分及排障时间。若所有账号反复被拒或未知扣费增加，立即关闭池并回官方客户端，不以多账号数量当吞吐或成本优势。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1862-1872](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/src/shim.ts#L1862-L1872)

记录换号来源与原因，是可见性假设起点。

<details>
<summary>查看原文（11行）</summary>

```text
      logger?.warn(
        `dsh-connect-workbuddy: retrying chat on another pool account after ${result.kind} (http ${result.status})`,
      )
      // Remember WHY the switch happened and FROM which account, so the answer
      // can carry one line saying so. Recorded here rather than only logged: the
      // log is invisible to the person reading the reply, and a silent failover
      // is indistinguishable from the account they chose having answered.
      switchedFrom ??= describeAccount(credential)
      switchedBecause ??= failoverReasonText(result)
      credential = next
      result = await client.chatStream(credential, prepared, controller.signal)
```

</details>

**依据 2 · 作者声明**：[README.md:29-35](https://github.com/dingminhua/dsh-connect-workbuddy/blob/bba5ea5c638995f612dfbb4612951a0a4e3532ac/README.md#L29-L35)

官方客户端退路和不稳定边界。

```text
## 风险提示

> **WorkBuddy 已开始限制非官方客户端请求。本项目不保证相关接口长期可用，上游一旦收紧限制，插件可能失效。请先阅读文末[「免责声明」](#免责声明)，自行评估账号风险。使用官方 WorkBuddy 客户端始终是最安全的选择。**

需要说明的是，这个插件的目的很普通：**省掉在 WorkBuddy 客户端和 DSH 之间来回切换的麻烦**。你已经在自己的机器上登录了 WorkBuddy，插件只是把那份已有的登录态接到 DSH 的模型选择器上，让你在写代码的地方直接用到它——不提供账号、不共享凭据、不绕过计费。每一次调用都消耗**你自己账号**的额度，按上游给出的倍率真实扣费，插件从不修改账号状态，也不附带任何提权或刷额度的能力。

它依赖的是 WorkBuddy 客户端自身的接口（非官方开放 API），所以上游调整时插件可能需要跟着调整——这是这类工具的常态，也是这条提示存在的原因。**请自行评估账号风险后再决定是否安装。**
```

#### 缺口

- 失败扣费可见性是否改善决策未知
  **影响**：尚非已实现优势
  **进一步探讨**：对比用户是否更早停止无效重试以及合格任务成本

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
