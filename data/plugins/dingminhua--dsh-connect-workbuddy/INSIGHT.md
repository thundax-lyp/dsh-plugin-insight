# DSH Connect WorkBuddy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[ad8e851](https://github.com/dingminhua/dsh-connect-workbuddy/tree/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e)

<!-- BEGIN META -->
[![GitHub ★ 950](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=950&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-workbuddy) [![npm 30d 54,110](https://img.shields.io/static/v1?label=npm+30d&message=54%2C110&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy) [![最新发布 2026-11-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy)
<!-- END META -->

> **功能**：将本机 WorkBuddy 账号和模型接入 DeepSeek Harness。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将本机账号和双地区模型目录接入 DSH，提供统一宿主入口；模型能力和用户收益不归功于插件。

> **主要限制**：[Q03](#research-q03) 的输出前换号不能证明无重复计费；[Q04](#research-q04) 的拒绝后请求变化可能影响内容保真及上游规则，off 也不是全面关闭恢复链。

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
  - [Q01 · 谁需要将 WorkBuddy 模型接入 DSH，相比切换原客户端有什么增量？](#detail-section-11)
  - [Q02 · 凭据和模型请求如何经本地 shim 到上游？](#detail-section-12)
  - [Q03 · 哪些失败允许换号，流中断和取消如何处理？](#detail-section-13)
  - [Q04 · 入口拒绝时重试是否改变输入，如何理解风险？](#detail-section-14)
  - [Q05 · 账号动作、运行成本和退出条件是什么？](#detail-section-15)
  - [Q06 · 能否用预算与尝试收据减少不透明重试？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 WorkBuddy 账号、希望在 DSH 中使用对应模型的用户。

直接使用原客户端或 DSH 的其他模型均可对话；此插件主要减少切换入口，质量和费用优势未对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 地区模型接入 | 在 DSH 调用 WorkBuddy 模型 | 需账号、宿主和上游服务 |
| 条件换号 | 对部分输出前失败选择其他账号 | 不代表未计费或完整流恢复 |
| 签到 | 对选定账号检查并领取 | 实际写入上游，并非只读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19 或 >=24 | 必需 | 运行插件 | 不满足版本可能无法启动 |
| 兼容 DSH llm/settings | 宿主接入必需 | 注册模型与配置 | 适配器无法装载 |
| WorkBuddy 账号、凭据和网络 | 模型调用需要 | 访问上游服务 | 凭据失效或网络/服务失败 |
| 显式选定的账号池 | 仅多账号操作需要 | 选择换号和批量对象 | 默认空池不执行批量操作 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认服务规则、宿主与凭据来源 | 限定数据、预算并备份配置 |
| 调用 | 用户选择地区和模型并核对输入 | 检查输出与实际账号 |
| 异常 | 用户查看换号、拒绝或部分流 | 费用或内容不明时停止重试 |
| 恢复 | 用户检查积分和凭据状态 | 回退原客户端或其他授权提供方 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 安装和账号费用未知 | 核对凭据、版本和服务规则 | 需兼容宿主与上游 |
| 持续 | 模型请求及重试积分未知 | 复核账号、输入和费用 | 上游目录与限制可能变化 |
| 失败恢复 | 额外请求及重试费用未知 | 核查部分输出与账单 | 响应失败不证明未计费 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接入 | 两地区适配器及本地桥接 | 真实服务可用率 |
| 分类换号 | 排除特定错误且候选去重 | 实际失败分类与费用 |
| 账户操作 | 状态检查后执行签到 | 上游是否接受或实际权益变化 |

> **思考**：[Q03](#research-q03) 的输出前换号不能证明无重复计费；[Q04](#research-q04) 的拒绝后请求变化可能影响内容保真及上游规则，off 也不是全面关闭恢复链。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示将本机账号和双地区模型目录接入 DSH，提供统一宿主入口；模型能力和用户收益不归功于插件。

[Q02](#research-q02) 的凭据单飞和原子保存、[Q03](#research-q03) 的取消与候选去重针对具体失败；分类漂移和同账号内容变化仍需对照。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的输出前换号不能证明无重复计费；[Q04](#research-q04) 的拒绝后请求变化可能影响内容保真及上游规则，off 也不是全面关闭恢复链。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议仅在允许该接入方式的隔离配置下核对账号、请求和预算；费用、凭据或输入变化不明时停止并回退。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本提供方、凭据与部分重试源码已检查；真实上游、计费、宿主和新方案未验证。

- 已检查：作者 README、包清单、源码路径 package.json、src/index.ts、src/adapter.ts、src/shim.ts、src/auth.ts、src/upstream.ts、src/account-pool-run.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交的包清单、提供方接入、凭据、模型流重试和批量签到样本；未读取用户凭据或运行插件、宿主、上游、账户操作和模型请求，未审计图片、视频或全部平台。
- 下一步：在固定宿主及假上游测试前流失败、部分流、取消、账号去重、拒绝后的输入变化与未知费用；真实服务须另以授权账户和上游账单核验。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)
- **版本号**：5.17.0（[固定提交 ad8e851](https://github.com/dingminhua/dsh-connect-workbuddy/tree/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设跨所有尝试设置显式预算并提供脱敏收据，可帮助用户识别未知费用和无效重试；相对现有分类和换号提示的收益未验证。

在固定宿主及假上游测试前流失败、部分流、取消、账号去重、拒绝后的输入变化与未知费用；真实服务须另以授权账户和上游账单核验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 45 | 16298 | — | — | 424245 |
| .mjs | source | 16 | 2952 | 2116 | 618 | — |
| .cjs | source | 1 | 140 | 95 | 34 | — |
| .ts | source | 81 | 44970 | 21066 | 22013 | — |
| .tsx | source | 14 | 10517 | 5744 | 4517 | — |
| .ts | test | 139 | 45419 | 30993 | 10804 | — |
| .tsx | test | 35 | 9356 | 6156 | 2541 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 128](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=128&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 WorkBuddy 提供方的凭据接线、失败重试、输入与账户边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要将 WorkBuddy 模型接入 DSH，相比切换原客户端有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是已有 WorkBuddy 账号、希望在 DSH 对话中选择该模型的用户。package.json:1-5 的作者描述涵盖国内/国际版本、账号池与积分概览；src/index.ts:3795-3818 注册两个地区模型适配器和可配置提供方。直接使用 WorkBuddy 客户端或 DSH 其他模型也能完成对话，本插件提供在现有宿主中使用该账号与目录的接线，并非模型本身。无法从注册证明账号、模型或接口当前可用，也没有跨客户端任务质量、操作时间或费用对照。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-5](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/package.json#L1-L5)

作者描述模型接入和账户功能。

```text
{
  "name": "dsh-connect-workbuddy",
  "displayName": "DSH Connect WorkBuddy",
  "description": "把本机登录的 WorkBuddy 模型（国内版与国际版）接入 DeepSeek Harness：每次刷新按上游目录自动读取每个模型的积分倍率，支持逐模型图片输入开关、多账号切换与账号池自动换号，并提供每日签到、卡片与输入框里的胶囊积分读数等只读积分概览。",
  "version": "5.17.0",
```

**依据 2 · 源码核查**：[src/index.ts:3795-3818](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L3795-L3818)

注册两个地区的模型适配器及配置项。

<details>
<summary>查看原文（24行）</summary>

```text
        try {
          // Always register the route first: an empty INITIAL registration is
          // invalid (`INVALID_ADAPTER`), while `replace([])` on a live one is
          // explicitly legal. `syncRegionRegistration` below then withdraws the
          // route for a region the user has switched off, in the same synchronous
          // section, so nothing observes the transient route.
          releaseAdapterCn = registration.cn.adapter = ctx.llm.registerAdapter([WORKBUDDY_PROVIDER], adapters.cn.adapter)
          releaseAdapterGlobal = registration.global.adapter = ctx.llm.registerAdapter([WORKBUDDY_GLOBAL_PROVIDER], adapters.global.adapter)
          releaseDirectory = registration.cn.directory = ctx.llm.registerConfigurableProviders([
            {
              provider: WORKBUDDY_PROVIDER,
              displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES.cn,
              settingsNs,
              settingsPath: [],
              declared: false,
            },
            {
              provider: WORKBUDDY_GLOBAL_PROVIDER,
              displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES.global,
              settingsNs,
              settingsPath: [],
              declared: false,
            },
          ])
```

</details>

#### 缺口

- 没有实际账号用户和同任务对照
  **影响**：无法量化切换节省、质量或费用
  **进一步探讨**：固定同模型、任务和预算比较原客户端与 DSH。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据和模型请求如何经本地 shim 到上游？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

src/index.ts:324-327 声明 llm 和 settings 注入；1428-1444 创建按地区配置的 shim。src/shim.ts:1529-1549 启动监听并提供 127.0.0.1 地址，src/adapter.ts:1363-1380 将目录模型映射到 shim /v1 并接入 WorkBuddy token；src/auth.ts:1836-1846 在缺失时报告错误，凭据需刷新时复用单个进行中的刷新；1118-1127 在锁内原子写入自有凭据副本并设置文件/目录模式。它是本地桥接和外部账号服务组合，回环监听、文件权限及单飞实现不等于完整认证或多平台安全性验证；未读取任何用户凭据或运行宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:324-327](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L324-L327)

注入宿主模型与设置服务。

```text
export const name = 'dsh-connect-workbuddy'

/** The model registry required before the provider can register. */
export const inject = ['llm', 'settings']
```

**依据 2 · 源码核查**：[src/index.ts:1428-1444](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L1428-L1444)

按配置创建 shim。

<details>
<summary>查看原文（17行）</summary>

```text
    const shim = createWorkBuddyShim({
      store,
      client,
      catalog,
      logger: ctx.logger,
      channelPerturbation: unwrapVolatile(config.channelPerturbation) ?? 'failure',
      keepPromptLast: unwrapVolatile(config.keepPromptLast) === true,
      extraInjectedPrefixes: unwrapVolatile(config.extraInjectedPrefixes) ?? [],
      sessionTitle: unwrapVolatile(config.sessionTitle) ?? {},
      /**
       * Pool routing, bound to THIS region.
       *
       * The region is captured in the closure rather than passed per call: each
       * region owns its own store, pool and shim, and routing that consulted the
       * other region's members would bill an account from a different account
       * pool than the one in play.
       *
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1529-1549](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1529-L1549)

启动并提供 loopback 地址。

<details>
<summary>查看原文（21行）</summary>

```text
   */
  const ready = listenOnClientReachablePort({
    server,
    clientRefuses: clientRefusesPort,
    logger,
    cancelled: () => disposed,
  }).catch((error: unknown) => {
    // Re-rolled into the same contract the old `once('error', reject)` had, but
    // logged first: `index.ts` awaits these in a `Promise.all` with no catch of
    // its own, so a bare rejection would be easy to miss in the console.
    logger?.error('dsh-connect-workbuddy: loopback listener failed to start', error)
    throw error
  })

  const baseUrl = (): string => {
    const address = server.address()
    if (address === null || typeof address === 'string') {
      throw new Error('workbuddy shim has no listening address')
    }
    return `http://127.0.0.1:${address.port}`
  }
```

</details>

**依据 4 · 源码核查**：[src/adapter.ts:1363-1380](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/adapter.ts#L1363-L1380)

模型映射到本地 shim 与凭据解析。

<details>
<summary>查看原文（18行）</summary>

```text
  const buildModels = (): Model<Api>[] => {
    // The OpenAI SDK pi-ai drives appends `/chat/completions` to baseURL,
    // so the shim's routes line up with the `/v1` prefix in place.
    const baseUrl = `${shim.baseUrl()}/v1`
    return catalog.current().map(info => toPiModel(info, baseUrl, modelIdentity))
  }

  const base = createProvider({
    id: providerId,
    name: providerName,
    auth: {
      apiKey: {
        name: 'WorkBuddy OAuth bearer token',
        async resolve({ credential }) {
          const apiKey = credential?.key
          return apiKey === undefined || apiKey.length === 0
            ? undefined
            : { auth: { apiKey }, source: 'WorkBuddy' }
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:1118-1127](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/auth.ts#L1118-L1127)

锁内原子保存凭据副本。

<details>
<summary>查看原文（10行）</summary>

```text
   * Memoized per directory per process, so the second account costs nothing: see
   * the cost model in `src/windows-acl.ts` for why the per-write budget matters
   * here.
   */
  await protectCredentialDirectory(dirname(dir))
  await withFileLock(path, async () => {
    await writeFileAtomic(path, `${JSON.stringify(vaultDocument(credential, accountId, refreshedFrom), null, 2)}\n`, {
      mode: 0o600,
      dirMode: 0o700,
    })
```

</details>

**依据 6 · 源码核查**：[src/auth.ts:1836-1846](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/auth.ts#L1836-L1846)

凭据缺失、刷新与单飞。

<details>
<summary>查看原文（11行）</summary>

```text
  async resolve(): Promise<WorkBuddyCredential> {
    const credential = await this.current()
    if (credential === undefined) {
      throw await this.describeMissingCredential()
    }
    if (!this.needsRefresh(credential)) return credential
    this.inflight ??= this.refreshNow(credential)
      .finally(() => {
        this.inflight = undefined
      })
    return this.inflight
```

</details>

#### 缺口

- 没有运行凭据刷新、宿主连接及不同平台安全实验
  **影响**：无法证明实际可用性、权限和完整隔离
  **进一步探讨**：固定宿主与受控测试账户，检查凭据生命周期和本地接口权限。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些失败允许换号，流中断和取消如何处理？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

src/upstream.ts:1276-1280 和 1330-1342 根据状态或响应内容分类；src/shim.ts:1627-1643 不对 client、model_busy、channel_reject 和 model_queue 换号。1699-1709 表明连接关闭中止上游，且账号池重试只处理流开始前失败，流中途失败不重放；1876-1903 对候选去重、按间隔等待并检查取消，1904-1914 保存换号来源和原因。分类是代码选择而不是供应商保证；即使失败发生在输出开始前，也不能单凭响应状态证明上游没有计费或处理请求，部分流也不保证可恢复。未运行真实网络或计费对账。

#### 证据与依据

**依据 1 · 源码核查**：[src/upstream.ts:1276-1280](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/upstream.ts#L1276-L1280)

将部分上游状态/内容归类。

```text
export function classifyUpstreamError(status: number, body: string): UpstreamErrorKind {
  if (status === 402) return 'hard_credit'
  const lower = body.toLowerCase()
  for (const marker of HARD_CREDIT_MARKERS) {
    if (lower.includes(marker.toLowerCase()) || body.includes(marker)) return 'hard_credit'
```

**依据 2 · 源码核查**：[src/shim.ts:1627-1643](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1627-L1643)

排除请求、模型和渠道类型的跨账号重试。

<details>
<summary>查看原文（17行）</summary>

```text
  function isFailoverWorthy(kind: UpstreamErrorKind): boolean {
    // `channel_reject` joins the two non-failover kinds. The gate matches the
    // OPENING of a system message, and every account sends that same opening, so
    // the next account answers the same 11128 one round trip later — while each
    // attempt burns real quota and records a false statistic against a credential
    // that was never at fault (issues #87–#90 were reported as account problems
    // for exactly this reason).
    //
    // `model_queue` joins them for a different reason: the queue is a fact about
    // the MODEL and the platform-wide line in front of it, not about this
    // credential. The next account is put in the SAME queue with the SAME
    // position, so rotating spends one real request per account to learn nothing.
    // Before it was its own kind a queue fell through to `server`/`soft_rate`
    // (the status it rides on), both of which fail over — so one queued request
    // walked the whole pool before the user was told their position.
    return kind !== 'client' && kind !== 'model_busy' && kind !== 'channel_reject'
      && kind !== 'model_queue'
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1699-1709](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1699-L1709)

断开取消及只在输出前重试的说明。

<details>
<summary>查看原文（11行）</summary>

```text
    res.on('close', () => controller.abort())

    // Retry the SAME prepared body against the pool's other usable accounts,
    // in the plugin's order, until one serves it or none is left.
    //
    // Only failures raised BEFORE the stream starts reach this loop: `!ok`
    // means the upstream answered non-2xx, so not one byte has been written to
    // the client and a retry cannot splice two responses together. A stream
    // that dies MID-flight (the `body.on('error')` path below) is deliberately
    // not retried — the client already received a partial answer, and
    // replaying it would duplicate output the model may already have acted on.
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:1876-1903](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1876-L1903)

账号去重、延迟和取消。

<details>
<summary>查看原文（28行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:1904-1914](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1904-L1914)

记录换号来源及原因。

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

#### 缺口

- 没有真实流中断、上游计费及错误码对照
  **影响**：不能证明无重复计费、恢复或错误分类准确
  **进一步探讨**：用受控假服务模拟输出前、输出后、断线及分类漂移并核对调用数。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 入口拒绝时重试是否改变输入，如何理解风险？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

src/index.ts:608-616、1041-1045 的 channelPerturbation 默认 failure；off 的说明仍保留拒绝后的恢复链，而非全面关闭所有重写。src/shim.ts:1771-1791 在渠道拒绝后可先后用变化后的请求重试，成功后在当前进程记住后续偏好；这是对上游拒绝及输入完整性的关键边界，不能把一次成功当作原请求被原样接受，也不能推断该行为符合服务方规则。自动账号切换的排除列表不等于此同账号恢复链不存在。真实内容语义、审计可见性、当前服务行为和用户配置影响未运行验证；不适合内容必须逐字保真或不允许该行为的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:608-616](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L608-L616)

配置含 failure、always、off；off 仍保留拒绝后恢复链。

```text
  /**
   * When scanned messages are perturbed with invisible characters.
   *
   * `failure` (default) learns from a successful channel-gate rescue and starts
   * later requests with the learned form; `always` starts every request with
   * the dense form for a gateway whose plain attempt is a guaranteed refusal;
   * `off` keeps only the post-failure rescue ladder.
   */
  channelPerturbation?: 'off' | 'failure' | 'always'
```

**依据 2 · 源码核查**：[src/index.ts:1039-1045](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L1039-L1045)

基础配置默认 failure。

```text
    cliBridgeConfig.default({} as any).description('Optional CodeBuddy CLI route; off by default and independent of the providers'),
  ) as unknown as z<CliBridgeSettings>,
  channelPerturbation: asVolatile(
    z.union([z.const('off'), z.const('failure'), z.const('always')])
      .default('failure')
      .description('When to perturb scanned messages with invisible characters: "off" only rescues after a channel-gate refusal, "failure" (default) learns from a successful rescue and starts later requests perturbed, "always" starts every request with the dense rescue for a gateway whose plain attempt is guaranteed to fail.'),
  ) as unknown as z<'off' | 'failure' | 'always'>,
```

**依据 3 · 源码核查**：[src/shim.ts:1771-1791](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1771-L1791)

渠道拒绝后使用变化的请求重试并可记住偏好。

<details>
<summary>查看原文（21行）</summary>

```text
    let retriedWithForcedHead = false
    let retriedWithPerturbation = false
    let retriedWithDensePerturbation = false
    if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
      const forced = forceNeutralHead(prepared)
      if (forced !== undefined) {
        logger?.warn('dsh-connect-workbuddy: the channel gate refused the body; retrying once with the neutral head forced in front of every opening')
        result = await client.chatStream(credential, forced, controller.signal)
        retriedWithForcedHead = true
      }
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const rescued = perturbChannelFingerprints(forced ?? prepared)
        if (rescued !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the body again; retrying once with an invisible perturbation of the scanned text')
          result = await client.chatStream(credential, rescued, controller.signal)
          retriedWithPerturbation = true
          // THE PERTURBATION IS WHAT WORKED, so remember it: the next request
          // in this process starts perturbed and skips both doomed attempts.
          // Only set on SUCCESS — a perturbation that is also refused teaches
          // nothing about what the gateway wants.
          if (result.ok) channelNeedsPerturbation = true
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:1627-1643](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1627-L1643)

渠道拒绝不触发跨账号换号。

<details>
<summary>查看原文（17行）</summary>

```text
  function isFailoverWorthy(kind: UpstreamErrorKind): boolean {
    // `channel_reject` joins the two non-failover kinds. The gate matches the
    // OPENING of a system message, and every account sends that same opening, so
    // the next account answers the same 11128 one round trip later — while each
    // attempt burns real quota and records a false statistic against a credential
    // that was never at fault (issues #87–#90 were reported as account problems
    // for exactly this reason).
    //
    // `model_queue` joins them for a different reason: the queue is a fact about
    // the MODEL and the platform-wide line in front of it, not about this
    // credential. The next account is put in the SAME queue with the SAME
    // position, so rotating spends one real request per account to learn nothing.
    // Before it was its own kind a queue fell through to `server`/`soft_rate`
    // (the status it rides on), both of which fail over — so one queued request
    // walked the whole pool before the user was told their position.
    return kind !== 'client' && kind !== 'model_busy' && kind !== 'channel_reject'
      && kind !== 'model_queue'
```

</details>

#### 缺口

- 未测试实际请求前后内容、上游政策和用户可见性
  **影响**：无法证明逐字保真或服务持续允许
  **进一步探讨**：固定伪上游对比输入和重试审计，并由用户核对服务条款。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 账号动作、运行成本和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

package.json:18-19 要求 Node ^22.19 或 >=24，宿主及 WorkBuddy 登录与网络也决定能否工作。src/index.ts:539-544 和 788 的配置注释与 schema 表明账号池成员显式选择且默认空；account-pool-run.ts:103-128 对选定账号串行处理，148-161 先读签到状态，未签到才调用领取接口，因此积分概览可只读不等于整个插件或签到是只读。src/auth.ts:1118-1127 表明会保存凭据副本，需要备份及权限核对；模型调用、失败重试、账号动作和人工审阅有费用或时间成本，数额未知。已有账户且允许该接入方式的用户可在隔离配置中用小预算核对输入、实际账号和上游读数；凭据来源、改写或费用无法确认时停止，回退原客户端或其他已授权提供方。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-19](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/package.json#L17-L19)

Node 运行版本约束。

```text
  "type": "module",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
```

**依据 2 · 源码核查**：[src/index.ts:539-546](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L539-L546)

账号池成员显式选择、默认空。

```text
   * The account ids checked into this region's pool.
   *
   * An EXPLICIT opt-in, and empty by default: the batch actions claim rewards
   * and spend credits on real accounts, so membership is the user's decision
   * rather than a consequence of which sign-ins happen to exist. Empty means
   * the pool covers nothing and both buttons stay disabled.
   */
  memberAccountIds?: string[]
```

**依据 3 · 源码核查**：[src/account-pool-run.ts:103-128](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/account-pool-run.ts#L103-L128)

串行处理目标账号。

<details>
<summary>查看原文（26行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/account-pool-run.ts:148-161](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/account-pool-run.ts#L148-L161)

状态检查后执行签到领取。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/auth.ts:1118-1127](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/auth.ts#L1118-L1127)

持久化凭据副本及权限。

<details>
<summary>查看原文（10行）</summary>

```text
   * Memoized per directory per process, so the second account costs nothing: see
   * the cost model in `src/windows-acl.ts` for why the per-write budget matters
   * here.
   */
  await protectCredentialDirectory(dirname(dir))
  await withFileLock(path, async () => {
    await writeFileAtomic(path, `${JSON.stringify(vaultDocument(credential, accountId, refreshedFrom), null, 2)}\n`, {
      mode: 0o600,
      dirMode: 0o700,
    })
```

</details>

**依据 6 · 源码核查**：[src/index.ts:786-789](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/index.ts#L786-L789)

账号池成员 schema 默认空数组。

```text
   */
  probeInputTokens: z.number().step(1).default(0).description('Input tokens each test probe sends: 10000 / 20000 / 30000 / 50000 / 100000. Bigger probes catch a rate limit real conversations would hit, but cost more credit per test and may mark an account unusable for large requests only. 0 uses the measured default (25000)'),
  memberAccountIds: z.array(z.string()).default([]).description('Account ids checked into this pool (opt-in; empty means the pool covers nothing)'),
  orderAccountIds: z.array(z.string()).default([]).description('The user\'s hand-ordered pool order, as account ids. Independent of membership: an id need not be checked in (it only takes effect once the account is a member), and ids not listed sort last. Separate from memberAccountIds so reordering never conflicts with, or is destroyed by, a membership edit.'),
```

#### 缺口

- 未实测服务政策、成本和凭据恢复
  **影响**：无法确定持续可用性或费用节省
  **进一步探讨**：隔离账户核对来源、上游读数、请求数及账户恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否用预算与尝试收据减少不透明重试？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有分类禁止部分换号并对换号来源和原因作提示（Q03），所以单纯增加失败分类或显示一次切换不是新方案；已有积分视图也不等于每次调用账单。未验证方案是在一个用户请求范围内设置跨账号和同账号重试的显式次数与费用预算，默认遇渠道拒绝停止并交由用户决定；生成不含凭据和原文的尝试收据，列出尝试数、粗粒度原因、账号别名及上游是否确认了费用，无法确认则显示 unknown 而非零。依赖宿主可显示收据、可归属的计费记录和可靠取消；可能增加请求等待与人工确认，不能保证上游恰好一次。用相同假上游对照现有分类/换号提示和预算收据，覆盖拒绝、超时、部分流、取消及额度未知；比较不必要请求、费用误判、用户决策时间与信息泄露。若仍超预算、把未知费用说成零、泄露凭据、阻断率超出用户收益或不能减少无效重试，则否定；方案未实现或运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1627-1643](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1627-L1643)

现有不换号分类。

<details>
<summary>查看原文（17行）</summary>

```text
  function isFailoverWorthy(kind: UpstreamErrorKind): boolean {
    // `channel_reject` joins the two non-failover kinds. The gate matches the
    // OPENING of a system message, and every account sends that same opening, so
    // the next account answers the same 11128 one round trip later — while each
    // attempt burns real quota and records a false statistic against a credential
    // that was never at fault (issues #87–#90 were reported as account problems
    // for exactly this reason).
    //
    // `model_queue` joins them for a different reason: the queue is a fact about
    // the MODEL and the platform-wide line in front of it, not about this
    // credential. The next account is put in the SAME queue with the SAME
    // position, so rotating spends one real request per account to learn nothing.
    // Before it was its own kind a queue fell through to `server`/`soft_rate`
    // (the status it rides on), both of which fail over — so one queued request
    // walked the whole pool before the user was told their position.
    return kind !== 'client' && kind !== 'model_busy' && kind !== 'channel_reject'
      && kind !== 'model_queue'
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1903-1914](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1903-L1914)

已有换号来源及原因。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1771-1791](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/shim.ts#L1771-L1791)

已有同账号拒绝后恢复链。

<details>
<summary>查看原文（21行）</summary>

```text
    let retriedWithForcedHead = false
    let retriedWithPerturbation = false
    let retriedWithDensePerturbation = false
    if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
      const forced = forceNeutralHead(prepared)
      if (forced !== undefined) {
        logger?.warn('dsh-connect-workbuddy: the channel gate refused the body; retrying once with the neutral head forced in front of every opening')
        result = await client.chatStream(credential, forced, controller.signal)
        retriedWithForcedHead = true
      }
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const rescued = perturbChannelFingerprints(forced ?? prepared)
        if (rescued !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the body again; retrying once with an invisible perturbation of the scanned text')
          result = await client.chatStream(credential, rescued, controller.signal)
          retriedWithPerturbation = true
          // THE PERTURBATION IS WHAT WORKED, so remember it: the next request
          // in this process starts perturbed and skips both doomed attempts.
          // Only set on SUCCESS — a perturbation that is also refused teaches
          // nothing about what the gateway wants.
          if (result.ok) channelNeedsPerturbation = true
```

</details>

**依据 4 · 源码核查**：[src/account-pool-run.ts:148-161](https://github.com/dingminhua/dsh-connect-workbuddy/blob/ad8e8515c7a46439ff2979cd3b0ea7ca02b5446e/src/account-pool-run.ts#L148-L161)

状态读取与真实签到领取不同。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

#### 缺口

- 跨重试总预算、费用归属和收据原型未验证
  **影响**：无法确定能否减少费用误判或保证隐私
  **进一步探讨**：在隔离假服务比较现有行为与预算收据并模拟未知计费。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
