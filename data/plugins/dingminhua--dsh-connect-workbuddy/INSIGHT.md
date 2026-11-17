# DSH Connect WorkBuddy

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[764dfa9](https://github.com/dingminhua/dsh-connect-workbuddy/tree/764dfa903b67556184c680b3daf9fe55f512ef89)

<!-- BEGIN META -->
[![GitHub ★ 1,686](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C686&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-workbuddy) [![npm 30d 114,878](https://img.shields.io/static/v1?label=npm+30d&message=114%2C878&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy) [![最新发布 2026-11-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy)
<!-- END META -->

> **功能**：把已有的国内版与国际版 WorkBuddy 登录账号接入 DSH 模型选择器，并查看积分和账号池。

> **亮点**：固定代码把两个 WorkBuddy 模型目录、当前账号和宿主会话连接起来，用户可以继续用 DSH 工具，并取消某一区域入口。账号池将可用性、积分和到期时间纳入候选选择。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：一次可见答案不能证明一次上游请求或一笔可核对的积分。渠道拒绝后的改写与账号池独立，Web 管理的 Host/Origin 检查也只约束浏览器类入口。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 本机 WorkBuddy 账号和模型怎样进入 DSH 同一会话？](#detail-section-11)
  - [Q02 · 账号排序和流重试分别控制什么，能否由一次可见输出反推上游次数？](#detail-section-12)
  - [Q03 · 请求改写和会话压缩如何处理不同失败，关闭账号池或改写开关能保留原消息吗？](#detail-section-13)
  - [Q04 · 可付费生图由谁触发，管理路由与账单分别能证明什么？](#detail-section-14)
  - [Q05 · 如何识别响应有效、没有重复执行且支出符合预期的合格任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 WorkBuddy 登录的 DSH 用户，可在同一会话使用两区模型与积分视图。

可直接使用官方 WorkBuddy 客户端，按需手动切换账号和复制当前工作的非敏感上下文。只用一个稳定模型时，这个基线已覆盖核心推理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 两区模型入口 | 用已有登录提供模型 | 需区域登录态及宿主 llm 服务 |
| 账号池 | 排序和有条件换号 | 一次输出可能经历多个请求 |
| 媒体操作 | 生成或编辑图像和处理视频 | 分区显式授权，响应缺少积分则查账单 |
| Web 管理 | 看余额、模型和账号状态 | Host/Origin 不代替访问认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH llm、settings 与对应运行时 | Host 必需 | 构造 provider 和配置目录 | 入口无法完成注册 |
| 可解析的区域登录与可达上游 | 获取模型或执行时必需 | 读取目录、请求回复 | 可能只有插件设置，模型和发送不可用 |
| Web slots 与管理监听信任边界 | Web 管理必需 | 展示和操作区域账户 | 回退宿主管理，避免对外暴露 |
| tools 服务及逐区授权 | 媒体才必需 | 注册可消费积分的动作 | 工具不可用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 在隔离 profile 检查区域账号、入口和上游 | 先选已有账号，关闭媒体 |
| 执行 | 发一个无副作用文本请求并核对路由 | 收到可用回复，检查是否重发 |
| 审阅 | 核对日志、凭据身份和账单 | 成本或正文不可核对时撤回 provider |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次接入 | 账号和上游使用支出未测 | 确认 profile、凭据及区域 | 各宿主适配未执行 |
| 持续使用 | 目录、积分、实际模型或媒体支出各异 | 核对结果、次数和账单 | 缺少逐次账单证据 |
| 失败恢复 | 跨账号重发或多次媒体请求可能计费 | 排查路径并恢复官方客户端 | 无合格结果不估单位成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在一处选择模型 | 两区 provider 通过 DSH llm 注册 | 目标宿主与当日上游可用率 |
| 账号连续性 | 有条件转交可用凭据 | 重复处理和费用 |
| 环境隔离 | 逐区停用和受控工具注册 | 用户部署的代理认证与权限 |

> **思考**：一次可见答案不能证明一次上游请求或一笔可核对的积分。渠道拒绝后的改写与账号池独立，Web 管理的 Host/Origin 检查也只约束浏览器类入口。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：固定代码把两个 WorkBuddy 模型目录、当前账号和宿主会话连接起来，用户可以继续用 DSH 工具，并取消某一区域入口。账号池将可用性、积分和到期时间纳入候选选择。[Q01](#research-q01) [Q02](#research-q02)

可借鉴区域内独立 store、目录和路由，与跨区目录一次覆盖的组织方式。账号失败、模型拥堵和已输出状态分别核对才可直接复用其重试模式。

<a id="detail-section-5"></a>

### 1.4 主要限制

一次可见答案不能证明一次上游请求或一笔可核对的积分。渠道拒绝后的改写与账号池独立，Web 管理的 Host/Origin 检查也只约束浏览器类入口。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

关注已有 WorkBuddy 登录用户迁回 DSH 会话的具体需求。涉及费用、敏感内容或依赖原始消息字节时沿用官方客户端，直到完成受控来源、执行与账单核对。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有两区接入、受控换号和显式工具授权的源码依据。上游费用、改写对内容的影响和宿主可用性待验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/account-pool.ts、src/adapter.ts、src/client/index.tsx、src/image-tool.ts、src/index.ts、src/shim.ts、src/web-status.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件，抽查模型、凭据接线、失败状态、媒体和管理信任边界。未使用真实账号或发送上游请求。
- 下一步：用本地模拟端区分请求被接受、返回正文和结算三种事件，再对照授权沙盒账号的账单核查可见任务实际成本。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)
- **版本号**：5.24.10（[固定提交 764dfa9](https://github.com/dingminhua/dsh-connect-workbuddy/tree/764dfa903b67556184c680b3daf9fe55f512ef89)）
- **版本日期**：2026-11-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

把每次上游请求的匿名账号、输出提交状态和结算确认写进同一条记录，可以区分重发与客户端单份输出。只有模拟及真实账单都能回查匹配时，才支持该假设。[Q05](#research-q05)

用本地模拟端区分请求被接受、返回正文和结算三种事件，再对照授权沙盒账号的账单核查可见任务实际成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 68 | 25738 | — | — | 586476 |
| .mjs | source | 24 | 5817 | 4115 | 1311 | — |
| .cjs | source | 1 | 140 | 95 | 34 | — |
| .ts | source | 91 | 54720 | 25114 | 27373 | — |
| .tsx | source | 17 | 13689 | 7237 | 6168 | — |
| .ts | test | 167 | 56560 | 38558 | 13655 | — |
| .tsx | test | 50 | 14778 | 9427 | 4344 | — |
| .mjs | example | 1 | 15 | 14 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 140](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=140&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 137](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=137&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 WorkBuddy 登录且在 DSH 工作的人，何时可以把模型和付费工具接入同一会话，如何确认账户、内容与实际支出？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本机 WorkBuddy 账号和模型怎样进入 DSH 同一会话？

**研究主题**：场景与需求、贡献与相对优势、功能与机制、依赖、兼容与流程

#### 完整回答

适合比较的是已有 WorkBuddy 会话、也用 DSH 写代码的人。官方客户端中选模型及账号后，用户还要把 DSH 工作的上下文带过去。插件在 DSH 中把国内、国际两区分开注册为 LLM adapter，使同一会话能使用相应目录。每区独立构造 credential store、catalog 和 shim。凭据可来自显式配置路径、区域桌面登录态，刷新使用上游 token 回调。宿主发现入口按 provider 判定区域，读取该区目录及繁忙信息，再按已保存模型集合、预算及图像输入派生元数据。

每区有独立 adapter 撤回，但 provider 目录是一次包含两区的覆盖操作。关掉单区后该路由和目录行撤回，发现回调对旧选择补做拒绝，不会把另一地区一同撤掉。列表出现只证明发现链形成，凭据有效、连接稳定及输出能用于任务需要分别检查。单一区域单一稳定模型的用户用官方客户端可完成同样推理，插件改善的是免切界面而且沿用 DSH 会话与工具。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-27](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/README.md#L27-L27)

作者描述目标是把本机已有两区账号接入模型选择器。

```text
一个独立的 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) bundle 插件。它把本机已登录的 WorkBuddy 账号（**国内版与国际版 WorkBuddy AI 均支持**）接到 DSH 的模型选择器，同时提供账号池、可勾选的模型管理，以及一套围绕积分的只读能力：**每次刷新按上游目录自动读取每个模型的积分倍率**（`x0.79` 这种，倍率完全由上游给出，插件不写死也不猜）、逐模型开关图片输入、多账号切换与账号池自动换号、每日签到、以及卡片与输入框里胶囊式的只读积分读数。**国内版与国际版是两个并行的供应商（`workbuddy` / `workbuddy-global`），可同时使用**；插件设置页以 tab 区分两者，方便统一管理。只需本机 WorkBuddy 的登录态，**或在浏览器里登录一次**即可。
```

**依据 2 · 源码核查**：[src/index.ts:1854-1893](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/index.ts#L1854-L1893)

区域的登录存储、刷新、目录及 shim 分离。

<details>
<summary>查看原文（40行）</summary>

```text
  const stacks = {} as Record<WorkBuddyRegion, WorkBuddyRegionStack>
  for (const region of REGION_KEYS) {
    // `authFile` is volatile on the 0.1.7 line: the raw config value is a live
    // cosmokit reference, and passing it through would hand the store a
    // reference object instead of a path.
    const authFile = unwrapVolatile(config.authFile)
    const store = new WorkBuddyCredentialStore({
      region,
      ...authFile === undefined ? {} : { desktopPath: authFile },
      refresh: credential => client.refreshToken(credential),
    })
    const catalog = new WorkBuddyCatalog(region)
    // This region's OWN first-sighting history, the source of the composer
    // pill's "· N 新模型". Region-scoped like the credential and pool copies:
    // the two catalogs are separate, so a CN first-sighting says nothing about
    // the international roster, and they must never overwrite each other.
    const rosterSeen = createFileRosterSeenStore(region)
    /**
     * Where the next upstream `usage` should be written.
     *
     * The body report is two-phase (send, then charge), and the two phases are
     * wired through different callbacks, so the seam between them has to live
     * somewhere. `noop` rather than `undefined` keeps the usage path free of a
     * presence check on the hot request path — and a request whose report was
     * disabled resolves to the same noop, so nothing needs to know whether
     * reporting is on.
     */
    let pendingUsage: (usage: WorkBuddyUsageCounts | undefined) => void = () => {}
    const shim = createWorkBuddyShim({
      store,
      client,
      catalog,
      logger: ctx.logger,
      channelPerturbation: unwrapVolatile(config.channelPerturbation) ?? 'failure',
      keepPromptLast: unwrapVolatile(config.keepPromptLast) === true,
      // Route B: a LIVE getter — the card can be toggled mid-session and the
      // next request picks it up, unlike route A's mount-time sample.
      sessionConversationId: () => unwrapVolatile(current().sessionConversationId) === true,
      extraInjectedPrefixes: unwrapVolatile(config.extraInjectedPrefixes) ?? [],
      sessionTitle: unwrapVolatile(config.sessionTitle) ?? {},
```

</details>

**依据 3 · 源码核查**：[src/index.ts:4725-4758](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/index.ts#L4725-L4758)

实际注册两个 adapter 和目录，失败清理已注册部分。

<details>
<summary>查看原文（34行）</summary>

```text
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
        } finally {
          if (releaseAdapterCn === undefined || releaseAdapterGlobal === undefined || releaseDirectory === undefined) {
            // Registration threw; release whichever half landed.
            releaseAdapterCn?.()
            releaseAdapterGlobal?.()
            releaseDirectory?.()
          }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2640-2659](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/index.ts#L2640-L2659)

分区 adapter 与完整目录的撤回粒度不同。

<details>
<summary>查看原文（20行）</summary>

```text
  const syncRegionRegistration = (value: Config): void => {
    // Each region owns its OWN adapter registration, so a per-region replace is
    // exactly that region's complete route set.
    for (const region of REGION_KEYS) {
      registration[region].adapter?.replace(regionEnabled(value, region) ? [WORKBUDDY_PROVIDERS[region]] : [])
    }
    // The directory is ONE registration holding BOTH entries: `replace` sets the
    // complete entry set, so it is called once with the full enabled list.
    // Replacing per region would make the last region win and silently drop the
    // other's entry — a disabled region would take its enabled sibling with it.
    registration.cn.directory?.replace(REGION_KEYS
      .filter(region => regionEnabled(value, region))
      .map(region => ({
        provider: WORKBUDDY_PROVIDERS[region],
        displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES[region],
        settingsNs,
        settingsPath: [],
        declared: false,
      })))
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4780-4805](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/index.ts#L4780-L4805)

按 provider、实时开关和区域目录返回模型元数据。

<details>
<summary>查看原文（26行）</summary>

```text
        ctx.llm.registerModelDiscovery(settingsNs, async (request, signal) => {
          const region = regionOfProvider(request.provider ?? '')
          if (region === undefined) return []
          // A switched-off region advertises nothing: its route is withdrawn, so
          // this is defence in depth against a stale model-picker refresh.
          if (!regionEnabled(current(), region)) return []
          const discovered = await discoverModels(region, signal)
          // Load levels are stamped on the RUNTIME roster only — see
          // `withBusyLevels` for why the settings draft stays free of them.
          const live = await withBusyLevels(region, discovered, signal)
          const state = regionStateOf(current(), region)
          const next = withImageSelection(
            deriveCatalog(
              live,
              new Set(state.enabledModelIds ?? []),
              state.contextBudgets ?? {},
            ),
            // #168: a discovery read is exactly the path that reveals a NEW
            // model, so an unedited region must be seeded from the table here
            // rather than from the array a previous refresh wrote.
            effectiveImageIds(state, live),
          )
          return next.map(model => ({
            id: model.id,
            name: workBuddyDisplayName(model),
            contextWindow: model.contextWindow,
```

</details>

#### 缺口

- 当前 WorkBuddy 各区协议与 DSH 宿主版本组合的登录、刷新和媒体目录可用性未实测。
  **影响**：接入源码正常时，供应链变化仍可让选择器空白或无法发送。
  **进一步探讨**：在获授权的隔离 profile 先核对一枚非敏感模型的列出、纯文本响应及撤回。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 账号排序和流重试分别控制什么，能否由一次可见输出反推上游次数？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

池内先按已知可用性筛，排序保留手动顺序、临期积分数量和时间等独立信号。零积分还可用于免费模型，排除原因来自记录的探测失败。已排除账号的恢复时间只是排除行的展示排序，冷却结束后仍按可用账号的正常规则选择。换号循环在尚未转发正常输出前才处理上游失败，并排除请求错误、模型繁忙、渠道拒绝和模型排队。当前判断没有排除 policy_reject，因而该错误也可能在最终策略拒绝呈现前走候选账号。每个账号的身份加入尝试清单，中途断开会取消等待，防止无界重试。

正常流中途断开不重放其已发内容。只产生被暂存的工具标记、尚未交付时可重试，原暂存字节在成功接手时丢弃，据此同时保住客户端单份流与重复上游请求两件不同的事。传输错误也只说明此端收不到结果。失败记录及可见的换号说明能改善归因，但一次用户输出没有证明一次上游执行或一次计费。

#### 证据与依据

**依据 1 · 源码核查**：[src/account-pool.ts:492-548](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/account-pool.ts#L492-L548)

将可用性、临期与已排除的恢复时间分开。

<details>
<summary>查看原文（57行）</summary>

```text
export function rankPool(
  members: readonly WorkBuddyPoolMember[],
  nowMs: number,
  orderAccountIds?: readonly string[],
): WorkBuddyPoolRanked[] {
  // The user's manual order, as a position lookup so missing ids (and accounts
  // never listed) map consistently to "sorted last". Position 0 is "first".
  // Duplicate ids keep the FIRST occurrence's position — hand lists often have
  // a stray duplicate, and whichever the user intended first must win.
  const order = new Map<string, number>()
  for (const [index, id] of (orderAccountIds ?? []).entries()) {
    if (!order.has(id)) order.set(id, index)
  }
  const rows = members.map(member => {
    // A zero balance does not rule out free models. Keep this verdict identical
    // to the panel and shortfall explanation: only a recorded failure excludes.
    const excludedBy = exclusionOf(member.probe, nowMs)
    return {
      account: member.account,
      score: scoreOf(member),
      ...excludedBy === undefined ? {} : { excludedBy },
      // Ordering keys below the primary score; not part of the public row.
      _usable: excludedBy === undefined,
      // The user's manual order position; Infinity = not listed = sorted last.
      _order: order.get(member.account.id) ?? Number.POSITIVE_INFINITY,
      // Whether ANYTHING lapses within the window, and how much.
      //
      // `expiringSoon` is the amount (credits); `nearestExpiryMs` is a
      // timestamp. Comparing them directly would be a units error, so they
      // stay two separate keys: `_expiring` now means "has something at risk"
      // (the old key reused the name for the raw timestamp, which is why the
      // amount was never consultable at all).
      _atRisk: (member.credits?.expiringSoon ?? 0) > 0,
      _expiringAmount: member.credits?.expiringSoon ?? 0,
      _expiring: member.credits?.nearestExpiryMs ?? Number.POSITIVE_INFINITY,
      _tokenExpiresAtMs: member.tokenExpiresAtMs ?? 0,
      // When this account becomes a candidate again (issue #240).
      //
      // Only meaningful for EXCLUDED rows, and only as a DISPLAY order among
      // them: it is computed here so the card can list "the one that comes back
      // soonest" first, which is the half of the reporter's rule 2 that the
      // ranking can honestly answer. It deliberately does not change who
      // SERVES: an excluded row is not a candidate at any position, and when
      // its cooldown elapses `exclusionOf` drops the exclusion and the ordinary
      // credit keys decide — so "prefer the account that recovers first" is
      // expressed as "it is at the top of the table and explains why", not as a
      // sticky preference.
      //
      // Infinity for a candidate and for an account with no stated recovery
      // time: `undefined` here means "nobody can say", and inventing a number
      // would put an account in a position the plugin cannot justify.
      _recoversAt: excludedBy === undefined ? Number.POSITIVE_INFINITY : recoversAtOf(member.probe, excludedBy),
    }
  })
  rows.sort((left, right) => {
    if (left._usable !== right._usable) return left._usable ? -1 : 1
    // Among two EXCLUDED accounts: whichever recovers soonest goes first, then
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1694-1703](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L1694-L1703)

可换号谓词未排除 policy_reject。

<details>
<summary>查看原文（10行）</summary>

```text
    // `model_queue` joins them for a different reason: the queue is a fact about
    // the MODEL and the platform-wide line in front of it, not about this
    // credential. The next account is put in the SAME queue with the SAME
    // position, so rotating spends one real request per account to learn nothing.
    // Before it was its own kind a queue fell through to `server`/`soft_rate`
    // (the status it rides on), both of which fail over — so one queued request
    // walked the whole pool before the user was told their position.
    return kind !== 'client' && kind !== 'model_busy' && kind !== 'channel_reject'
      && kind !== 'model_queue'
  }
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1940-1986](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L1940-L1986)

显式记录已试凭据，使用可取消的时间间隔，写换号原因。

<details>
<summary>查看原文（47行）</summary>

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
      result = await client.chatStream(credential, prepared, controller.signal, sessionConversationId)
    }
    // The final attempt's failure — recorded only if the loop did not already
    // record it (it does not: the loop records each attempt as it starts the
    // next one, and the last attempt has no next).
    if (failures.length === 0 || failures[failures.length - 1]?.accountId !== workbuddyAccountId(credential)) {
      recordAttempt(credential, result)
    }
    reportFailures()
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:2355-2401](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L2355-L2401)

已控制输出的纯标记重试可能发多次并只交付一份。

<details>
<summary>查看原文（47行）</summary>

```text
    // The notice travels with the STREAM, not with this function: only the
    // stream knows whether any content actually reaches the client, and a
    // retry that ended in an error response leaves nothing to prefix.
    const notice = switchedFrom === undefined || switchedBecause === undefined
      ? undefined
      : failoverNoticeText(switchedFrom, switchedBecause)
    const writer = new RecoveryStream(res, gate, logger, notice, onUpstreamUsage)
    await writer.consume(result.response.body)

    // The one outcome that can only be recognised AFTER the stream: the turn
    // wrote markup and nothing else, so there was never any answer to show.
    // Retrying is safe here for exactly one reason — nothing has been written,
    // because a turn that is still only markup is still being held. That is why
    // the hold exists, and why an ordinary answer never pays for it.
    if (gate !== undefined && !writer.delivered && writer.residueSeen && !controller.signal.aborted) {
      logger?.warn('dsh-connect-workbuddy: the turn produced DSML markup only; retrying it once')
      const retryTried = [...triedAccountIds, workbuddyAccountId(credential)]
      let retryCredential = credential
      for (;;) {
        const attempt = await client.chatStream(retryCredential, prepared, controller.signal, sessionConversationId)
        if (attempt.ok) {
          // The first attempt's held bytes are dropped, not shown: showing them
          // and then the retry would be the two-answers-spliced-together failure
          // the failover loop refuses to risk.
          writer.discard()
          const retried = new RecoveryStream(res, gate, logger)
          await retried.consume(attempt.response.body)
          retried.finish()
          reportFailures()
          return
        }
        recordAttempt(retryCredential, attempt)
        if (!isFailoverWorthy(attempt.kind) || failoverAccount === undefined) break
        if (controller.signal.aborted) break
        const next = await failoverAccount(retryTried).catch(() => undefined)
        if (next === undefined) break
        if (retryTried.includes(workbuddyAccountId(next))) break
        retryTried.push(workbuddyAccountId(next))
        retryCredential = next
      }
      // Nobody could be made to answer: fall back to showing what actually
      // arrived, which is the honest outcome and loses no text.
      logger?.warn('dsh-connect-workbuddy: markup-only retry did not start; showing the original text')
    }

    writer.finish()
    reportFailures()
```

</details>

#### 缺口

- 无法从本地日志确认网关何时接受了首次执行、旧请求是否计积分。
  **影响**：事务式调用、费用上限或高敏权限不能用一次输出作为核对。
  **进一步探讨**：模拟服务收到正文后断链和成功但只返回标记两种路径，再用授权账单比对两区的尝试和实际结算。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 请求改写和会话压缩如何处理不同失败，关闭账号池或改写开关能保留原消息吗？

**研究主题**：缺陷与关键质疑、功能与机制、工程质量与复用

#### 完整回答

账号池控制的是凭据选择。渠道拒绝触发的是同凭据的消息体重发，首发读取前次是否学到改写偏好，收到拒绝后有数个正文变换分支。开关为 off 仍会进入渠道拒绝恢复，较稀疏的变换一旦成功会写进程内偏好，后续首发仍可能选择变换；新增的更激进分支只有 failure 模式才记偏好。需要保留请求字节、尊重渠道拒绝语义或精确记录上游次数时，不宜把这个开关当作保证，直接停用该 provider 或走官方工具更可控。

上下文拯救是另一条机制。适配器拿到 sessionId、contextWindow 与已注入的 rescue 时，识别上游 token 上限或请求体字节上限错误，在透传错误前对会话做压缩，由宿主决定是否再试。缺少所需条件时原样返回流。此分支没有承诺保存历史完整细节，也没有承诺压缩后就一定通过。对有审计要求的任务应把原始转录、当前送出消息以及可重复工具操作分别保全。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1765-1789](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L1765-L1789)

首发可能受进程已学状态影响，与仅关闭池独立。

<details>
<summary>查看原文（25行）</summary>

```text
    // Retry the SAME prepared body against the pool's other usable accounts,
    // in the plugin's order, until one serves it or none is left.
    //
    // Only failures raised BEFORE the stream starts reach this loop: `!ok`
    // means the upstream answered non-2xx, so not one byte has been written to
    // the client and a retry cannot splice two responses together. A stream
    // that dies MID-flight (the `body.on('error')` path below) is deliberately
    // not retried — the client already received a partial answer, and
    // replaying it would duplicate output the model may already have acted on.
    // The first attempt always uses the store's own resolution, so a token
    // refresh still happens exactly once, before any retry.
    /**
     * The body to send FIRST, which is the perturbed form once this process has
     * proven the gateway demands it, or when the user selected `always`.
     *
     * `perturbChannelFingerprints` is consulted only when the flag is set, so a
     * fresh process still pays the plain attempt — that is what discovers
     * whether the gate is on at all (see `channelNeedsPerturbation`).
     *
     * The perturbed form is a purely additive transform: it inserts zero-width
     * spaces and changes no word the model reads, so starting from it is not a
     * behaviour change, only a saved round trip.
     */
    const startPerturbed = channelPerturbation === 'always' || channelNeedsPerturbation
    const preferred = startPerturbed
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1835-1873](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L1835-L1873)

拒绝恢复和学习发生在同凭据，稀疏与更密集分支写偏好条件不同。

<details>
<summary>查看原文（39行）</summary>

```text
    let retriedWithForcedHead = false
    let retriedWithPerturbation = false
    let retriedWithDensePerturbation = false
    if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
      const forced = forceNeutralHead(prepared)
      if (forced !== undefined) {
        logger?.warn('dsh-connect-workbuddy: the channel gate refused the body; retrying once with the neutral head forced in front of every opening')
        result = await client.chatStream(credential, forced, controller.signal, sessionConversationId)
        retriedWithForcedHead = true
      }
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const rescued = perturbChannelFingerprints(forced ?? prepared)
        if (rescued !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the body again; retrying once with an invisible perturbation of the scanned text')
          result = await client.chatStream(credential, rescued, controller.signal, sessionConversationId)
          retriedWithPerturbation = true
          // THE PERTURBATION IS WHAT WORKED, so remember it: the next request
          // in this process starts perturbed and skips both doomed attempts.
          // Only set on SUCCESS — a perturbation that is also refused teaches
          // nothing about what the gateway wants.
          if (result.ok) channelNeedsPerturbation = true
        }
      }
      // The dense rescue is deliberately last: it is the least byte-conservative
      // form, and the gateway's own wording gives no hint that it would be needed.
      // It exists because both measured rungs are punctuation-dependent and a
      // fingerprinted prose span can contain no punctuation at all.
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const dense = perturbChannelFingerprints(forced ?? prepared, true)
        if (dense !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the sparse perturbation too; retrying once with a dense word-boundary perturbation')
          result = await client.chatStream(credential, dense, controller.signal, sessionConversationId)
          retriedWithDensePerturbation = true
          // Dense is the strongest form; remembering it is safe only for the
          // `failure` policy, which exists to learn from a successful rescue.
          if (result.ok && channelPerturbation === 'failure') channelNeedsPerturbation = true
        }
      }
    }
```

</details>

**依据 3 · 源码核查**：[src/adapter.ts:1417-1457](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/adapter.ts#L1417-L1457)

区分请求大小单位，在转交错误前尝试压缩，宿主决定是否再试。

<details>
<summary>查看原文（41行）</summary>

```text
    inner: (model: Model<Api>, context: ContextShape, options?: Options) => AssistantMessageEventStream,
  ) =>
    (model: Model<Api>, context: ContextShape, options?: Options): AssistantMessageEventStream => {
      const source = inner(model, context, options)
      const rescue = resolve()
      // 0.85 and 1.x both carry the session id here under the same name; the
      // structural read keeps the wrapper independent of the options type.
      const sessionId = (options as { sessionId?: string } | undefined)?.sessionId
      const window = model.contextWindow
      if (rescue === undefined || sessionId === undefined || window === undefined) return source

      const out = createAssistantMessageEventStream()
      let final: AssistantMessage | undefined
      void (async () => {
        try {
          for await (const event of source) {
            if (event.type === 'done') final = event.message
            if (event.type === 'error') final = event.error
            // Fold before the consumer settles: the error still reaches it, but
            // the surface is already smaller when the host retries.
            //
            // TWO causes, one rescue (issue #258). `isContextOverflow` only
            // recognises TOKEN overflow, so a request refused because its body
            // exceeded a byte ceiling reached this loop and matched nothing —
            // the surface was never folded and every retry re-sent the same
            // oversized body. The byte case is detected HERE as well, from the
            // same message text, and folded with its own target because the two
            // ceilings are measured in different units (tokens vs bytes).
            if (event.type === 'error') {
              const cause = rescueCauseOf(event.error)
              if (cause !== undefined) await rescue.rescue(sessionId, window, cause)
            }
            out.push(event)
          }
          out.end(final)
        } catch {
          // Unreachable in practice: pi-ai converts every provider failure into
          // an `error` event. Close the stream rather than leave a consumer
          // waiting on an iterator that will never advance.
          out.end(final)
        }
```

</details>

#### 缺口

- 改写、压缩及上游策略变化对输出与会话可审计性的实际影响未知。
  **影响**：影响需保留原始请求和长期上下文的流程。
  **进一步探讨**：只在本地模拟端记录消息版本、压缩输入和输出；真实拒绝应尊重上游策略，不据此尝试规避。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 可付费生图由谁触发，管理路由与账单分别能证明什么？

**研究主题**：功能与机制、依赖、兼容与流程、效果与总成本

#### 完整回答

图像和视频工具须在启用区域显式授权，等待宿主 tools 服务后才注册。执行时再从启用并允许该工具的区取凭据，因此有效凭据和工具可见是两步。生图有输入图时选择编辑，否则生成；解析参数和按模型选择尺寸限制，然后调用各自端点。输出返回模型、区域、实际尺寸和上游明确给出的积分，响应未附消费时提示去积分面板核对。视频使用提交、轮询再下载的形式，与一次生图请求不同。图像生成能力若启用会给 agent 付费路径，手工签入、卡片展示与授予工具权限不应混为同一动作。

浏览器管理端统一检查方法、Host、Origin 和准备状态，信任表供反向代理覆盖两种 authority。没有独立令牌，任意可打开该端口的程序与浏览器来源限制不是同一种边界。部署者需要知道宿主认证、监听地址和代理的访问限制，才能决定是否暴露写操作。用读到的余额替代真正应付金额会忽略并发使用、未返回消费字段和上游延迟。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:63-64](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/README.md#L63-L64)

作者同时说明两项媒体工具默认关闭以及可产生积分支出。

```text
- **生图工具 `workbuddy_draw_image`（国内版 / 国际版，默认关闭，逐区授权）** —— 把 WorkBuddy 的文生图能力交给 agent：你在对话里说「帮我画一只在窗台上晒太阳的猫」，模型自己就会调用这个工具，画完把图贴回来。**默认不开启**，因为这是本插件里唯一一项「由模型自己决定花钱」的能力：国内区约 5.71 积分一张、国际区约 0.03 积分一张，而宿主没有「调用前先确认」的机制。想用就去卡片「能力」栏那个区勾上「允许模型自主生图」；不勾的时候这个工具**根本不会注册**，模型看不到它，也就不会发起注定失败的调用。**两个区都能用，但用的是两个不同的模型**：国内区 `hunyuan-image-alpha`（5.71 积分/张），国际区 `hy-image-3.5`（0.03 积分/张，2026-10-25 实测）。两者的积分池彼此独立，**5.71 与 0.03 不是同一张图的跨区差价**，只是一个读数，别拿它做汇率换算。勾选是**逐区**的：在一个 tab 里勾上只授权那一区的账号；两区都勾着时优先国内区（与升级前的行为一致）。**端点与请求体照抄官方 CLI 的 ImageService**（`POST /v2/images/generations`），产物是 24 小时有效的 COS 签名 URL，插件会提醒你及时下载。**同一个工具也能改图**：给 `image` 参数（**字符串数组**，元素可以是本地路径 / `file://` / `http(s)` / data URL / 裸 base64，上限 8 MB；一张图也要写成 `["/abs/a.png"]`）就自动切到 `POST /v2/images/edits` 并用带 `image-to-image` 标签的模型（国内 `hunyuan-image-alpha-edit`、国际 `hy-image-3.5`），不给就是文生图——**模式由「有没有图」唯一决定，没有 `mode` 参数**。输入图只归一成上游要的 data URL，**不缩放、不裁剪、不转格式**；读不到图、格式错、超限都在发请求之前报错，不算一次花钱的失败。**`size` 是必填参数，不写就直接报错**——早期版本不填会静默按 `1024x1024` 出图，模型于是学会了「什么都不写，让它自己猜」，最后连横竖都没交代就出一张方图。现在写成「宽x高」或 `auto`（工具描述里按「具体像素 → 比例词 → 档位词 → 改图 `auto` → 用途 → 表外比例 → 只提方向 → 默认档」八阶顺序命中，命中即停；比例词单列一阶是因为「9:16」「3:4」既不是像素也不是档位，「改成 9:16」曾经会掉进 `auto` 那阶、输出仍是横图还不报错；这一阶里每个比例词只对应一个像素值——旧稿写「『9:16』`1440x2560` 或 `1024x1536` 按长边需求选」，而后一个其实是 2:3，选它等于对用户说谎；用途表每行自带方向、命中一行就用它，只有用户另外明说的方向与该行不符时才改——第十二轮补的那条链尾裁决句「用途和方向同时出现时按方向」第十三轮被删了，因为它自己造了双解：「做张手机壁纸，横着看的那种」会同时命中用途表的竖档和裁决句的横档；现在方向并进表里，「配张图，要横的」直接给 `1536x1024`，不会出成方图；第十五轮又拆出两阶——「表外比例」（4:5、21:9、5:4）不再写「套最近档」，而是**给算式**（长边尽量取 2560、宽乘高不超 4,194,304，超了就把长边往下取、另一边按比例算完取整：21:9 → `2560x1097`，4:5 → `1831x2289`，回复里写明实际出的比例），「只提了方向」单独成一阶统管所有方向词（横 `1536x1024` / 竖 `1024x1536` / 方 `1024x1024`），④ 与 ⑤ 都只留引用——**引用悬空比重复更危险：重复最多是不一致，悬空是那一条请求根本没有出口**；第十七轮又补三处：`1080P` / `720P` 各给横竖两个值（只写 `1920x1080` 时「1080P 手机壁纸」只能落横图，与「手机壁纸算竖」正面冲突）、`①` 步明说「规整这一步是你自己做」（schema 的 `pattern` 只收 `x`/`X`/`×`，带空格或 `*`、`by` 的值会被宿主直接拒掉）、`⑥` 表外比例的例子改成能被算法复核的 `21:9 → 2560x1097` 与 `4:5 → 1831x2289`——旧例子 `1600x2000` 长边既不是「尽量 2560」、面积也只有 3.2M，照着算和照着抄得到两个不同答案）：合法范围是两边各 512–2560 像素、宽乘高不超过约 419 万像素（2026-10-25 逐档实测：`1024x1536` / `2048x2048` / `2048x1536` / `2560x1440` / `2560x1600` 都成功且输出宽高与请求一致；`2560x2560` 起被直接拒绝），**越界不再报错**——`fitIntoRange()` 会按「`2560/长边`」与「`√(4194304/面积)`」中更小的比例等比缩/放后照常出图，并在 `hint` 里写明「按你给的 X 缩放成 WxH」，同时用 `requestedSize` 回带你原本写的值（写 `auto` 时就是 `auto`），所以「用户要 4K、实际出 2560x1440 档」这件事可以被程序识别、不必正则抠散文（`4K` 在描述里不设独立档：横竖方分别与 2K 同档，因为工具上限是**单边 2560、面积 4,194,304**，写不出真 4K——上限只能用这一组数说，`2048x2048` 才是顶格的那一档）。`region` 与 `size` 都在输出的 `required` 里（两个都由工具自己算，一定在），想按区记账或按尺寸做后处理直接读字段即可。**改图（带 `image`）推荐直接写 `size: "auto"`**：工具会从图片字节里解出第一张的宽高（PNG / JPEG / GIF / WEBP），按同比例给一个长边 1024–1536 的画布（`1600x900` → `1536x864`），模型看不到原图也不必猜比例——只有比对 5:1 更细长、等比缩数学上解不出合法值时，才退回方向常用档并在 `hint` 里写明「比例有变化」。**改图如果写了具体比例（不是 `auto`），裁切/留白这件事要在调用前说**：模型调用前量不到输入图比例，事后问「要不要改用 auto」等于先用掉一次积分再问——现在的写法是「先说一句会按这个比例裁切/留白、原版式可能被切，他同意再调」。本地因此只剩一种尺寸失败：比例极端到缩不出合法值（`INVALID_ARGS`，不扣积分）。再大只能走超分，单纯调参数已经到顶。**它真的花钱**，所以工具描述第二段就把价目写出来——国内版约 5.71 积分/张、国际版约 0.03 积分/张（同一计量单位、相差约 190 倍），模型和你开局就知道这一张多少钱，并且知道「走哪个区这一次改不了、也查不到，只能以返回的 `region` 为准」（所以描述里不要求模型在调用前报价，只要求如实报两个区、并点明差约 190 倍）；真实扣费仍以返回的 `credit` 为准，结果里同时写明**这次走的是国内版还是国际版**、用的哪个模型、实际扣了多少积分（区域从凭据 domain 现算，两区都开着时优先国内版）。描述里不点名具体模型 id，免得模型主动去猜——`model` 一般留空最稳；失败后有 30 秒冷却（但参数写错、没登录、模型不存在这三类一分钱没花，不进冷却），也不提供「一次画四张」这类不可控支出的参数。工具定义是手写的 raw JSON Schema，**没有引入任何新依赖**。第十九轮又收了三处「同一件事两个口径」：① 尺寸链的入口加了**主体门禁**——主体没问清之前整条链一条都不许走（旧稿 (a) 让他先问「想画什么」、第 2 阶又已经把 `2560x1440` 填好，「随便画个 `16:9` 的」于是自编主体扣一次费）；② 用途表补了**方行遇方向**那一支（配图是方行，旧稿只写「横行要竖」「竖行要横」，「给这篇文章配张图，要横的」无定义、会填 `1024x1024` 与同段例子 `1536x1024` 打架）；③ **批量只剩一张同意卡**——旧稿开头让「先报张数和总价」、紧接着又让「多版挑一张先出 1 张」，用户批的是 4 张预算、拿到 1 张；现在统一成「先出 1 张给你看，满意再按张补后面的，每张单独计费」。同时把「重试」写成一次**新的计费决策**（`INVALID_ARGS` / `NOT_LOGGED_IN` 改完直接重试，其余情形重试前按两档重新报价取同意），并把「已经拿到过 `credit`」收紧成「**本次调用**拿到过」——190 倍差正是跨区、跨模型产生的，拿上一次的单价报这一次等于报错价。第二十、二十一轮又收了三处**同一事实两个出口**：① 用户说「我这张是 1600x900」时，① 的触发词（数字 + x）会先吞掉它、脚注又说该写 `auto`——现在第 4 阶第一句先分类「这是输出尺寸还是输入图尺寸」，输入尺寸永远不填进 `size`；② 「单张不必为『要不要花一次积分』单独请示」这句被两个盲读子代理判成最危险的一句（它把授权扩张到不等裁切确认也能扣费），换成一份**五条清单**（超过一张 / 改变原图版式 / 要真调才能报价 / 主体没定 / 用户要的做不到）——命中两条以上合成一次问完，都不成立才直接调；③ 主体例子原来「秋季新品静物」是正例、「秋季新品」是反例，而用户原话正是后者，现在换成「一束向日葵」。第二十二轮又收掉三处「照字面执行必然出错」：① **4K 不再既算档位词又算「做不到」**——七条第 5 条原来写「用户要的东西本工具做不到（真 4K…）」要先停，第 3 阶又让「照 2K 填、出完再说明」直接调，同一句「来张 4K 壁纸」两个出口；现在清单里只留「明确要 `3840x2160` 这类超过 2560 的像素」——**档位词是用户的说法，不是他的诉求**。② **改图的「告知」与「请示」钉进同一个句号**：(b) 说单张只告知、④ 说裁切要等同意，「把这张 `1600x900` 改成 `9:16`」同时命中两条，裁切不可逆、价格可逆，不能共用一句话。③ **「4 张要多少钱」有了分支**：只说张数没说同异时，先问「要一样的还是各不相同的」。另修 ③ 的 4K 算术错（`3840x2160` 是 16:9，等比缩是 `2560x1440`；`2560x1350` 属于`4096x2160`），并把 ⑤ 的「方向 × 用途」三支枚举收成「冲突就交换宽高、相同就照这一行走」。第二十二轮第三批又把三处「作用域/台词」收掉：① **多图三态从「超过一张」的门里提出来**——「要一样就做不到、不报价不调用」原来写在「要超过一张时先判」这道门内，用户说「上次那张再画一遍，要一样」只要 1 张、门不成立，「直接调」与「不调用」两条都逐字可读（0 次或 1 次扣费），现在改成「跟要几张无关，先判要的是『一样』还是『不同』」，并把「没有 seed、不存历史、不能重放」提为全局事实；② **改图的 prompt 台词只剩一套**——旧稿一处让写「只换画布」、另一处让只写「保持主体和光线不变」，而「只换画布」是事实错误（工具会裁切或留白，画面内容会变）；③ **4K 那句话术收窄成条件句**——只有用户提的档位超出上限时才补「最长边 2560」，只说 2K 的用户不再被告知「出不了真 4K」。另把「只提了方向」从用途表里拆走（「竖版海报」要说到「海报」才算用途，只说「竖版」是方向词），并给第 4 阶补一句「同一句里既有输入图尺寸又有比例时，输入那个数不参与匹配」——旧派发顺序会让「这张 4000x1000 的图改成 4:5」填成 4000x1000、被缩成 `2560x640`，方向相反还照扣费。取证、协议与联调记录见 [docs/IMAGE_GEN.md](docs/IMAGE_GEN.md)。
- **视频生成工具 `workbuddy_draw_video`（国内版 / 国际版，默认关闭，逐区授权）** —— 把 WorkBuddy 的视频能力交给 agent：「帮我把这段描述做成 5 秒视频」，模型自己调用工具，跑完把 **mp4 的本地路径**贴回来（视频是二进制，只回 `file://` 路径并渲染成链接，不塞进对话体）。**它和生图不是一个形状**：视频是**异步任务**，`POST /v2/videos/generations` 只回一个 `taskId`，插件再轮询 `POST /v2/videos/tasks` 直到 `completed`（5 秒一次、上限 10 分钟），最后把产物下载到 `os.tmpdir()/workbuddy-video-gen/`。**同一个工具也做图生视频**：给 `image` 参数（字符串或单元素字符串数组、**只收一张**——与生图那边「纯数组、可多张」不同）就切到 `image-to-video` 标签组并按输入图决定比例，不给就是文生视频——**模式由「有没有图」唯一决定**。其余参数：`seconds`（默认 5，须在该模型 `[min,max]` 内）、`resolution`（不在模型 `resolutions` 内会回落默认值并给出告警）、`aspect_ratio`（仅文生视频，`16:9`/`9:16`/`1:1`）、`negative_prompt`、`enable_audio`。**这八个以外的字段一律 `INVALID_ARGS`**：`size`（生图那边才有的）、`ratio`、`n`、`return_base64` 这类从别的生图工具串进来的写法会在发请求前就被点名拒掉，而不是静默忽略让模型以为横竖版生效了——视频按次扣积分，一次几十秒，错一次代价不小。**默认不开启**、逐区勾选「允许模型自主生视频」，不勾时工具**根本不注册**；失败后 60 秒冷却，但参数错、没登录、读不到输入图、以及**上游在建任务之前就退回的 4xx**（它明说没扣积分）这类**一分钱没花**的失败不进冷却——改完参数可以立刻重试，不用白等一分钟；上游若在拒绝文案里报了时长区间（`supported range: 4-15 seconds`），插件会记住它，下次同样的越界值直接在本地拦下。**模型可按模式钉住**：卡片「能力」栏在视频开关下方按文生 / 图生各给一行选择框，写进 `preferredVideoModels`（按区、按标签存）；它是**软约束**——显式 `model` 写错照旧报错，钉住的模型若已从目录里消失则静默回落到组内第一个。两个区的模型目录不同（国内区 `kling-video-v3` / `minimax-video-h3`，国际区 `kling-video-v3`），id 不跨区。**实测单价（国内区）**：图生视频 4 秒 57.14（`minimax-video-h3`）/ 68.57（`kling-video-v3`），文生视频 5 秒 71.43 / 128.57 积分；**产物实测**是 H.264 + AAC、24fps 的 `1280x720` 或 `1344x768`（没有 1080p，`resolution: "1080p"` 会被拒并回落默认），视频码率 3.7–11.5 Mbps，秒数以 24fps 帧数为准（请求 5 秒得 5.09–5.17 秒）。取证、协议与联调记录见 [docs/VIDEO_GEN.md](docs/VIDEO_GEN.md)。
```

**依据 2 · 源码核查**：[src/index.ts:2706-2749](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/index.ts#L2706-L2749)

执行凭据逐区允许选择，图和视频分别连到上游服务。

<details>
<summary>查看原文（44行）</summary>

```text
  const toolCredential = (optIn: ToolOptIn) => async (): Promise<WorkBuddyCredential | undefined> => {
    const live = current()
    for (const region of REGION_KEYS) {
      if (!regionEnabled(live, region)) continue
      if (regionStateOf(live, region)[optIn] !== true) continue
      try { return await stacks[region].store.resolve() } catch { continue }
    }
    return undefined
  }

  // 生图工具：任一「开着 + 显式授权」的区有生图模型就注册。两区单价不同，工具
  // 文案不写死价钱，回报上游结算里真实的 `data.usage.credit`。
  const syncImageTool = mountOptionalTool({
    wanted: value => imageToolRegionOf(value) !== undefined,
    register: tools => registerWorkBuddyImageTool(tools, {
      resolveCredential: toolCredential('imageToolEnabled'),
      listMediaModels: (credential, signal) => client.fetchMediaModels(credential, signal),
      generateImage: (credential, request, signal) => client.generateImage(credential, request, signal),
      editImage: (credential, request, signal) => client.editImage(credential, request, signal),
      // 卡片上选的文生图模型（issue #241）。空串就是「没选」，工具按组内第一个走——
      // 与视频的钉住同一个读法，只是生图只有一个 tag 组，不必按 tag 存一张表。
      preferredImageModel: (credential, tag) => {
        if (tag !== IMAGE_TAG_TEXT_TO_IMAGE) return undefined
        const picked = regionStateOf(current(), regionOf(credential.domain)).preferredImageModel
        return picked === undefined || picked === '' ? undefined : picked
      },
      logger: ctx.logger,
    }),
  })

  // 视频工具：同一注册机，执行层是 submitVideo→pollVideoTask→downloadVideo。
  const syncVideoTool = mountOptionalTool({
    wanted: value => videoToolRegionOf(value) !== undefined,
    register: tools => registerWorkBuddyVideoTool(tools, {
      resolveCredential: toolCredential('videoToolEnabled'),
      listMediaModels: (credential, signal) => client.fetchMediaModels(credential, signal),
      submitVideo: (credential, request, signal) => client.submitVideo(credential, request, signal),
      pollVideoTask: (credential, taskId, signal) => client.pollVideoTask(credential, taskId, signal),
      preferredVideoModel: (credential, tag) =>
        regionStateOf(current(), regionOf(credential.domain)).preferredVideoModels?.[tag],
      downloadVideo: (credential, url, signal) => client.downloadVideo(credential, url, signal),
      logger: ctx.logger,
    }),
  })
```

</details>

**依据 3 · 源码核查**：[src/image-tool.ts:1173-1198](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/image-tool.ts#L1173-L1198)

先计算地区、模式、模型和尺寸再发送。

<details>
<summary>查看原文（26行）</summary>

```text
        // 改图的输出画布按第一张输入图的真实宽高定（size 写 auto 时用它按比例算；
        // 写了具体尺寸时它只是 hint 里的一句实话）。宽高是从字节里解出来的，
        // 不需要模型知道原图多大——它本来也读不到本地文件。
        // 区要先算：它决定可选模型集合（无水印那条只有国内区有路由），而模型又要
        // 先于尺寸定下来（范围跟着模型走）。凭据自带 domain，所以这一步不花代价。
        const region = regionOf(credential.domain) === 'global' ? 'global' : 'cn'
        const inputSize = resolved === undefined ? undefined : firstDimensions(resolved)
        // 纯本地、不花代价的参数错误先报：见 `missingAutoSizeInput` 的注释。
        if (sizeSpec.kind === 'auto' && inputSize === undefined) missingAutoSizeInput()
        const inputs = resolved?.map(input => input.dataUrl)
        const tag = inputs === undefined ? IMAGE_TAG_TEXT_TO_IMAGE : IMAGE_TAG_IMAGE_TO_IMAGE
        // 模型必须先定：它的尺寸范围跟着模型走（见 `imageSizeLimitsOf`），
        // 先算尺寸再选模型会拿 alpha 的 419 万去放行一个 v3.0 发不出去的尺寸。
        const model = resolveImageModel(models, requestedModel, tag, deps, credential, region)
        const limits = imageSizeLimitsOf(model.id)
        const plan = planImageSize(sizeSpec, inputSize, limits)
        const size = plan.size
        sent = true
        const outcome = inputs === undefined
          ? await deps.generateImage(credential, { model: model.id, prompt, size }, signal)
          : await deps.editImage(
            credential,
            { model: model.id, prompt, size, image: inputs },
            signal,
          )
        const mode = inputs === undefined ? 'generate' : 'edit'
```

</details>

**依据 4 · 源码核查**：[src/image-tool.ts:1212-1238](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/image-tool.ts#L1212-L1238)

结果回带模型、尺寸及有条件的实际积分字段。

<details>
<summary>查看原文（27行）</summary>

```text
        const value: Record<string, unknown> = {
          mode,
          region,
          size,
          model: model.id,
          prompt,
          hint:
            `这张图来自 WorkBuddy ${regionLabel}（模型 ${model.id}，`
            + `${mode === 'edit' ? '改图' : '文生图'}，尺寸 ${size}）。`
            + inputNote
            + dimensionNote
            + watermarkNote
            + (outcome.credit === undefined
              ? '本次响应没带扣费字段，具体扣了多少以额度面板为准。'
              : `本次实际扣费 ${outcome.credit} 积分。`)
            + 'COS 签名 URL 约 24 小时失效；要长期保留请及时下载。',
        }
        // 只有真的动过才回带：用户写的就是 1024x1024 时，多一个 requested 字段反而
        // 让调用方以为「请求值和实际值不一致」是个常态。
        if (plan.requested !== undefined && plan.requested !== size) {
          value['requestedSize'] = plan.requested
        }
        if (outcome.url !== undefined) {
          value['url'] = outcome.url
        } else if (outcome.b64 !== undefined) {
          const path = await writeTempImage(outcome.b64, model.id)
          value['url'] = pathToFileURL(path).href
```

</details>

**依据 5 · 源码核查**：[src/web-status.ts:953-989](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/web-status.ts#L953-L989)

路由判断明确是可伪造的请求头而非 token。

<details>
<summary>查看原文（37行）</summary>

```text
 * - they stop a BROWSER on a foreign page from driving these routes (the browser
 *   chooses Origin for us, and rebinding fails the Host comparison), which is
 *   the CSRF / rebinding family;
 * - they do NOT stop a program that can already open a socket to the port.
 *
 * There is no per-route secret here: `req.headers` is read for `host` and
 * `origin` and nothing else. Every route that spends credit or returns token
 * material is protected by the same two forgeable headers as the read routes, so
 * binding this listener to a non-loopback address exposes those routes to the
 * local network. That is a property of the whole surface, not of this function,
 * and it must not be described as though a stronger guard existed.
 *
 * Absent Host is refused: HTTP/1.1 requires it, and its absence on a
 * credit-spending surface is not worth the benefit of the doubt. Absent Origin
 * passes, because that is the shape of the plugin's own fetch and of curl.
 *
 * `trustedHosts` (issue #261) is a THIRD, opt-in input, and it changes none of
 * the above: it is still a forgeable header decision, not authentication. It only
 * admits a Host/Origin authority the deployer declared, which is what a reverse
 * proxy needs (the harness binds loopback, so `localAddress` is always 127.0.0.1
 * and the browser's public authority could never match it). The same getter is
 * passed to BOTH halves so a request cannot be half-trusted. See `loopback.ts`.
 */
function requireLoopback(req: IncomingMessage, res: ServerResponse, deps: WorkBuddyStatusRouteOptions): boolean {
  // Read the trust list ONCE per decision, from the volatile config getter, so
  // Host and Origin can never be judged against different lists within one
  // request. Omitting deps / the getter leaves the pre-#261 fence (empty list).
  const trustedHosts = deps.trustedHosts
  if (!hostMatchesListener(req.headers.host, req.socket?.localAddress, trustedHosts)) {
    json(res, 403, { error: 'host-not-trusted' })
    return false
  }
  if (!originIsLoopback(req.headers.origin, req.socket?.localAddress, trustedHosts)) {
    json(res, 403, { error: 'origin-not-trusted' })
    return false
  }
  return true
```

</details>

**依据 6 · 源码核查**：[src/web-status.ts:1806-1824](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/web-status.ts#L1806-L1824)

处理函数统一执行方法和请求来源检查。

<details>
<summary>查看原文（19行）</summary>

```text
    function raw(
      spec: { path: string, method: 'GET' | 'POST', ready?: (res: ServerResponse) => boolean },
      run: (req: IncomingMessage, res: ServerResponse) => Promise<void> | void,
    ): void {
      route({
        kind: 'exact',
        path: spec.path,
        handler: async (req: IncomingMessage, res: ServerResponse) => {
          if (req.method !== spec.method) return json(res, 405, { error: 'method not allowed' })
          if (!requireLoopback(req, res, deps)) return
          if (spec.ready !== undefined && !spec.ready(res)) return
          try {
            await run(req, res)
          } catch (error: unknown) {
            json(res, 500, { error: safeMessage(error) })
          }
        },
      })
    }
```

</details>

#### 缺口

- 独立浏览器访问、经真实宿主代理以及上游账单准确性均未验收。
  **影响**：决定能否从部署形态安全启用媒体或账户动作，也决定盈亏。
  **进一步探讨**：在隔离宿主验证未登录可达性、输入图丢弃与授权撤回，再以预算受控的沙盒账号做账单核对。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何识别响应有效、没有重复执行且支出符合预期的合格任务？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

建议观察接入机制，优先保留官方 WorkBuddy 客户端完成有账单、工作区敏感或副作用的任务。推荐设定纯文本任务并禁用付费工具、录一份非敏感的会话，从同一登录账号比较官方客户端与隔离 DSH profile，确认任务要求下的答案是否一致、当前凭据和模型可识别、取消是否仍产生上游事件。多账号开关仅隔离换号变量，不能隔离 Q03 的同账号恢复，必须分别记录。HTTP 错误、没有正文、正常输出后断流和只含标记的情况应计入总尝试数，最终用有功能合格判断且账单可说明的任务作分母。

可以验证的设计是让每次调用与后续重试在同一记录中显示独立请求标识、账号匿名标识、可见输出与已知或未知计费。这样比目前流内提示及余额更便于区分「上游已做但本地没收到」。用同步数账的模拟服务验证链路，改变模拟计费与客户端提前取消时应该仍能分别核对。再由授权的一组沙盒请求检验上游是否能提供与这些标识一一对应的结算；若无法关联，界面必须保留未知，不能声称解决了费用归因。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1940-1986](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L1940-L1986)

一次外部请求可执行若干次账号尝试，提供实际可记录的边界。

<details>
<summary>查看原文（47行）</summary>

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
      result = await client.chatStream(credential, prepared, controller.signal, sessionConversationId)
    }
    // The final attempt's failure — recorded only if the loop did not already
    // record it (it does not: the loop records each attempt as it starts the
    // next one, and the last attempt has no next).
    if (failures.length === 0 || failures[failures.length - 1]?.accountId !== workbuddyAccountId(credential)) {
      recordAttempt(credential, result)
    }
    reportFailures()
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:2355-2401](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/shim.ts#L2355-L2401)

单份输出与重复上游执行分离。

<details>
<summary>查看原文（47行）</summary>

```text
    // The notice travels with the STREAM, not with this function: only the
    // stream knows whether any content actually reaches the client, and a
    // retry that ended in an error response leaves nothing to prefix.
    const notice = switchedFrom === undefined || switchedBecause === undefined
      ? undefined
      : failoverNoticeText(switchedFrom, switchedBecause)
    const writer = new RecoveryStream(res, gate, logger, notice, onUpstreamUsage)
    await writer.consume(result.response.body)

    // The one outcome that can only be recognised AFTER the stream: the turn
    // wrote markup and nothing else, so there was never any answer to show.
    // Retrying is safe here for exactly one reason — nothing has been written,
    // because a turn that is still only markup is still being held. That is why
    // the hold exists, and why an ordinary answer never pays for it.
    if (gate !== undefined && !writer.delivered && writer.residueSeen && !controller.signal.aborted) {
      logger?.warn('dsh-connect-workbuddy: the turn produced DSML markup only; retrying it once')
      const retryTried = [...triedAccountIds, workbuddyAccountId(credential)]
      let retryCredential = credential
      for (;;) {
        const attempt = await client.chatStream(retryCredential, prepared, controller.signal, sessionConversationId)
        if (attempt.ok) {
          // The first attempt's held bytes are dropped, not shown: showing them
          // and then the retry would be the two-answers-spliced-together failure
          // the failover loop refuses to risk.
          writer.discard()
          const retried = new RecoveryStream(res, gate, logger)
          await retried.consume(attempt.response.body)
          retried.finish()
          reportFailures()
          return
        }
        recordAttempt(retryCredential, attempt)
        if (!isFailoverWorthy(attempt.kind) || failoverAccount === undefined) break
        if (controller.signal.aborted) break
        const next = await failoverAccount(retryTried).catch(() => undefined)
        if (next === undefined) break
        if (retryTried.includes(workbuddyAccountId(next))) break
        retryTried.push(workbuddyAccountId(next))
        retryCredential = next
      }
      // Nobody could be made to answer: fall back to showing what actually
      // arrived, which is the honest outcome and loses no text.
      logger?.warn('dsh-connect-workbuddy: markup-only retry did not start; showing the original text')
    }

    writer.finish()
    reportFailures()
```

</details>

**依据 3 · 源码核查**：[src/image-tool.ts:1212-1227](https://github.com/dingminhua/dsh-connect-workbuddy/blob/764dfa903b67556184c680b3daf9fe55f512ef89/src/image-tool.ts#L1212-L1227)

当前只在响应有积分字段时提供此项回执。

<details>
<summary>查看原文（16行）</summary>

```text
        const value: Record<string, unknown> = {
          mode,
          region,
          size,
          model: model.id,
          prompt,
          hint:
            `这张图来自 WorkBuddy ${regionLabel}（模型 ${model.id}，`
            + `${mode === 'edit' ? '改图' : '文生图'}，尺寸 ${size}）。`
            + inputNote
            + dimensionNote
            + watermarkNote
            + (outcome.credit === undefined
              ? '本次响应没带扣费字段，具体扣了多少以额度面板为准。'
              : `本次实际扣费 ${outcome.credit} 积分。`)
            + 'COS 签名 URL 约 24 小时失效；要长期保留请及时下载。',
```

</details>

#### 缺口

- 合格率、每次任务人时和现金支出未知。
  **影响**：观察结论只描述可验证机制；用户是否值得迁移仍取决于结果差异。
  **进一步探讨**：比较相同账号、同类文本任务和固定宿主版本，记人工复核、失败重试及账单的总量。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
