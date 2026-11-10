# Trae 连接器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[a80b77c](https://github.com/dingminhua/dsh-connect-trae/tree/a80b77c2fca56c18c1ea59629a74372303a5c7d5)

<!-- BEGIN META -->
[![GitHub ★ 217](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=217&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-trae) [![npm 30d 24,622](https://img.shields.io/static/v1?label=npm+30d&message=24%2C622&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae)
<!-- END META -->

> **功能**：将本机登录的 Trae 国内、企业和国际账号接入 DSH 模型选择器，提供用量、签到及模型管理。

> **亮点**：[Q01](#research-q01) 供应商适配器将 Trae 模型输出接入 DSH 原有工具循环，并按供应商选择对应上游路由。

> **主要限制**：[Q02](#research-q02) 企业目录会展示租户自配条目，现有企业聊天通道缺少这类模型所需的直连路径。企业图片预算也依赖宿主卸载和重发。

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
  - [Q01 · 在 DSH 内延用 Trae 登录相对两边手工搬运有什么实质差异？](#detail-section-11)
  - [Q02 · 企业目录展示和图片预算分别能否代表企业请求可完成？](#detail-section-12)
  - [Q03 · 账号、费用归属、失败重试和本机凭据操作由谁承担？](#detail-section-13)
  - [Q04 · 哪些人适合试用，什么机制能让用户在提交前识别风险？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：开发者可在 DSH 对话里调用已获准使用的 Trae 模型，并接续宿主的本地工具。

在 Trae 客户端单独使用模型，再把相关输出搬入 DSH。已有可用 DSH 供应商时，也可以直接沿用该供应商的工具循环。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Trae 供应商 | 在 DSH 会话用 Trae 模型发起工具循环 | 对应账号、路由和模型可用 |
| 企业模型发现 | 查看租户配置模型 | 租户直连模型的聊天通道缺失 |
| Web 设置页 | 查看和管理账号与模型 | 宿主提供相应 Web 插槽 |
| 文生图 | 为会话生成图片 | 按面板启用且存在可用账号 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Node、DSH LLM 和存储服务 | 必需 | 注册供应商、收发事件流和保存凭据副本 | 保留已用供应商 |
| 获准使用的 Trae 登录及可达网关 | 必需 | 路由、模型权限和计费 | 在原客户端核对账号与模型 |
| 宿主图片卸载能力 | 长图文任务所需 | 根据供应商预算移出旧图片并重发 | 缩短图文上下文，检查答案所需图片 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 操作者确认账号与计费方，保持账号池关闭 | 模型与面板对应，账单归属明确 |
| 核查 | 操作者发起只读文件问答，宿主执行工具 | 取得完整工具输出和可追溯账单 |
| 退出 | 操作者停用面板并核对插件副本 | DSH 不再暴露相应模型，原账号仍可单独管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号套餐按计费方确认 | 宿主版本、模型权限和数据范围核对 | 未测配置耗时 |
| 持续 | 推理与重试可能消耗账号额度 | 续期、核对实际路由及账单 | 未测每个合格任务成本 |
| 恢复 | 重发可能增加推理费用 | 排查凭据、失败流或被卸载的图片 | 未测恢复时间 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结构化工具流 | 桥接映射工具调用字段 | 真实宿主工具往返与任务正确性 |
| 企业图片预算 | 适配器声明 8 MiB | 实际宿主重发成功率和图片保真 |
| 租户模型发现 | 企业面板启用来源 2 提升 | 当前聊天路径无法覆盖作者描述的直连模型 |

> **思考**：[Q02](#research-q02) 企业目录会展示租户自配条目，现有企业聊天通道缺少这类模型所需的直连路径。企业图片预算也依赖宿主卸载和重发。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 供应商适配器将 Trae 模型输出接入 DSH 原有工具循环，并按供应商选择对应上游路由。

目录发现和上游调用分开，便于定位企业条目可见却无法调用的问题。适配器按供应商只修改图片总字节上限，共享其余宿主参数。源码中有相应预算边界断言，本轮未执行。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 企业目录会展示租户自配条目，现有企业聊天通道缺少这类模型所需的直连路径。企业图片预算也依赖宿主卸载和重发。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 从单面板、单账号、已知可调用的模型开始。只读任务出现模型拒绝或流不完整时，关闭面板，回到原供应商检查权限与账单。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持供应商接线、目录提升和区域预算。租户自配模型请求结果及网关体积探针来自作者记录。可调用标记与完整体积预估是待验证的设计假设。

- 已检查：作者 README、包清单、源码路径 cordis.patch.yml、src/index.ts、src/shim.ts、src/solo-bridge.ts、README.md、src/catalog.ts、CHANGELOG.md、src/adapter.ts、package.json、src/auth.ts、src/client/index.tsx、src/image-tool.ts、tests/adapter-image-budget.spec.ts、src/solo.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：实际阅读了注册、路由、凭据、目录、图片预算及上游桥接。未访问真实账号、租户、网关或账单，未覆盖完整项目安全审计。
- 下一步：经授权后，用无敏感内容的只读文件任务核对工具往返与实际账单。企业长图文另记录重发体积、被卸载图片和输出质量。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-trae](https://github.com/dingminhua/dsh-connect-trae)
- **版本号**：4.18.0（[固定提交 a80b77c](https://github.com/dingminhua/dsh-connect-trae/tree/a80b77c2fca56c18c1ea59629a74372303a5c7d5)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 分开标示目录发现与经验证的可调用性，并在提交前估算完整请求体积，可能减少无效请求和不必要的图片卸载。

经授权后，用无敏感内容的只读文件任务核对工具往返与实际账单。企业长图文另记录重发体积、被卸载图片和输出质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 103 | 17743 | — | — | 291926 |
| .js | source | 1 | 21 | 17 | 2 | — |
| .mjs | source | 23 | 3165 | 2262 | 779 | — |
| .ts | source | 75 | 22899 | 11701 | 10284 | — |
| .tsx | source | 16 | 9300 | 5575 | 3574 | — |
| .ts | test | 75 | 17339 | 12814 | 3321 | — |
| .tsx | test | 39 | 11139 | 7188 | 2871 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-trae/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 38](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=38&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-trae/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-trae/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对已获准使用 Trae 账号的 DSH 用户，这个固定版本能否把模型接入原有工具流程，同时让计费归属、模型可调用性、图文请求失败和凭据退出路径可判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH 内延用 Trae 登录相对两边手工搬运有什么实质差异？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

已在 Trae 登录且需要 DSH 本地工具的开发者，可以在 DSH 会话里选择对应 Trae 模型，让宿主用自己已有的工具接续模型输出。典型任务是读一个项目文件再总结。单独使用两个应用时，要自己在两边搬运上下文、工具输出或结论。合格结果应包含模型发出的结构化只读工具请求和一次由宿主消费工具结果后生成的总结。

插件是 Cordis bundle。加载时为每个面板建立自己的 Trae SOLO 客户端和桥接，随后在 DSH 注册各自的适配器。适配器把请求送到本机回环 shim，shim 按 bearer 选择路由并回送事件流。桥接代码把上游增量转换为宿主客户端能识别的 OpenAI 流式格式，分别映射文本、推理和工具调用。项目自述由宿主执行本地工具。这里的增量在于供应商和工具协议的接线，工具权限和执行器仍在宿主。用户已有其他可直接使用的供应商、也无需 Trae 额度时，接线带来的收益会缩小。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/cordis.patch.yml#L1-L4)

证明 bundle 的加载器入口。

```text
# Register the Trae provider without changing the profile's default model.
- insert:
    - id: dsh-connect-trae
      name: dsh-connect-trae
```

**依据 2 · 源码核查**：[src/index.ts:1198-1210](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L1198-L1210)

按供应商创建固定路由的 SOLO 客户端和流桥接。

<details>
<summary>查看原文（13行）</summary>

```text
    for (const provider of [providerOfPanel(panel)]) {
      const route = routeOfTraeProvider(provider) ?? 'solo'
      const client = new TraeSoloUpstreamClient({
        credential: () => store.resolve(),
        identity,
        route,
        log: (message, detail) => ctx.logger.warn(message, detail),
      })
      const bridge = new TraeSoloBridge(client, catalog, wireResolver, (message, detail) => ctx.logger.warn(message, detail))
      // The shim always sees a stable client; the Raw gateway may replace the
      // delegate asynchronously, but it stays disabled until a probe succeeds.
      const delegating = new TraeDelegatingUpstreamClient(bridge)
      routeClients[provider] = { provider, route, client, upstream: delegating, secret: '' }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2420-2447](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L2420-L2447)

将带本机 shim 与附件解析的适配器注册给宿主。

<details>
<summary>查看原文（28行）</summary>

```text
        const provider = providerOfPanel(panel)
        const entry = stack.routeClients[provider]
        if (entry === undefined) continue
        const trae = createTraeAdapter({
          shim: stack.shim,
          catalog: stack.catalog,
          provider,
          displayName: displayNameOfTraeProvider(provider),
          secret: entry.secret,
          resolveAttachments: () => ctx.get('attachments'),
          // Read lazily on every resolution (not captured here): a settings
          // save must reach the very next request, and the config document it
          // reads is rebuilt by the loader on each volatile update.
          defaultEfforts: () => thinkingEffortsOf(current(), panel),
        })
        stack.invalidateAdapter = () => {
          trae.invalidate()
          // The adapter rebuild and the host's catalog view are two sides of
          // the same refresh: `invalidate()` makes the NEXT read service the new
          // rows, and this tells the picker there is a reason to read at all.
          announceCatalog(panel)
        }
        // Always register the route first: an empty INITIAL registration is
        // invalid (`INVALID_ADAPTER`), while `replace([])` on a live one is
        // explicitly legal. `syncRegionRegistration` below then withdraws the
        // route for a panel the user has switched off, in the same synchronous
        // section, so nothing observes the transient route.
        registration[panel].adapters.push({ provider, handle: ctx.llm.registerAdapter([provider], trae.adapter) })
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:250-266](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/shim.ts#L250-L266)

本机请求由 bearer 挑选路由，模型和聊天端点分开。

<details>
<summary>查看原文（17行）</summary>

```text
  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (!hostIsLoopback(req.headers.host)) return writeError(res, 403, 'host_not_allowed', 'Host must be loopback')
      if (!originIsLoopback(req.headers.origin)) return writeError(res, 403, 'origin_not_allowed', 'Origin must be loopback')
      // The bearer selects the billing pool, so an unrecognised token is a 401
      // and never a fallback to the first route.
      const route = routeOf(req)
      if (route === undefined) return writeError(res, 401, 'unauthorized', 'Missing or invalid bearer')
      const url = req.url ?? '/'
      if (req.method === 'GET' && (url === '/healthz' || url === '/healthz/')) return writeJson(res, 200, { ok: true })
      if (req.method === 'GET' && (url === '/v1/models' || url === '/v1/models/')) {
        return writeJson(res, 200, {
          object: 'list',
          data: options.catalog.current().map(model => ({ id: model.id, object: 'model', created: 0, owned_by: 'trae' })),
        })
      }
      if (req.method === 'POST' && (url === '/v1/chat/completions' || url === '/v1/chat/completions/')) {
```

</details>

**依据 5 · 源码核查**：[src/solo-bridge.ts:238-247](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/solo-bridge.ts#L238-L247)

把模型增量转换为包含工具调用的响应。

<details>
<summary>查看原文（10行）</summary>

```text
        if (decoded.type === 'delta') {
          const delta: Record<string, unknown> = {}
          if (decoded.text !== '') delta['content'] = decoded.text
          if (decoded.reasoning !== undefined && decoded.reasoning !== '') delta['reasoning_content'] = decoded.reasoning
          const toolCalls = normalizeToolCalls(decoded.toolCalls)
          if (toolCalls.length > 0) {
            sawToolCalls = true
            delta['tool_calls'] = toolCalls
          }
          if (Object.keys(delta).length > 0) controller.enqueue(chunk(delta))
```

</details>

**依据 6 · 作者声明**：[README.md:44-55](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/README.md#L44-L55)

作者说明三供应商与宿主本地工具循环。

<details>
<summary>查看原文（12行）</summary>

```text
- **三供应商并行接入** —— 国内版注册为 DSH 的 `trae` provider（`DeepSeek-V4-Flash`、`DeepSeek-V4-Pro` 等），企业版注册为 `trae-enterprise`，国际版注册为 `trae-global`（Gemini / GPT / MiniMax 阵容），**三边模型同时出现在 DSH 模型选择器里**：不同会话可以各选一边，互不干扰。
- **企业版是独立计费通道，不是国内版的别名** —— 同一张 CN 凭据若属于 `tob_online` 租户，会被**两个**网关同时服务：消费池（扣个人积分）与租户池（扣企业额度）。同一模型、两种付费方，所以「谁付钱」由你显式选，插件不替你猜。`trae` 永不碰企业网关；`trae-enterprise` **不回落**，被拒绝就如实报错，不会悄悄改用个人额度重跑。企业版**默认关闭**——纯个人账号用不了企业池，默认放开等于塞一条一用就失败的 provider。
- **可单独关闭任一面板** —— 三个 tab 各带一个勾选（国内版与国际版默认勾选，企业版默认不勾）：取消勾选即把该面板的供应商**整个从 DSH 模型选择器撤掉**（不是只藏起 tab），并且不再发起任何请求；重新勾选即恢复，账号、目录、勾选与上下文预算全部保留。用不到国际版就把国际版关掉即可。
- **设置页 tab 切换** —— 设置页顶部为「国内版 / 企业版 / 国际版」三个 tab，各含独立的账号选择、用量概览与模型管理；每个 tab 的账号、目录、勾选与未保存草稿完全隔离——在一个 tab 里切账号或刷新模型，不会触碰另一边的运行时目录与会话。国内版与企业版共用同一份 CN 凭据池，但**各有各的账号绑定与模型勾选**：两个池的名录并不相同（`DeepSeek-V4.1-Flash` 只有企业池列），所以勾选互不覆盖。
- **卡片内再按「账号 / 模型 / 诊断」分栏**（学自同族 `dsh-connect-workbuddy`）—— 上面那排地区是**作用域**（这张卡片讲的是哪个供应商），这一排是同一张卡片里的**分栏**：账号栏管「谁在服务、还剩多少、签到与账号池」，模型栏管「勾哪些模型、图片输入、上下文预算、保存」，诊断栏只读地列出面板名、供应商 id、服务账号、两种令牌到期时间、目录/已启用模型数、账号池与签到支持与否，以及本面板最近一次报错的**原文**。**4.4.7 起诊断栏还多一行「损坏副本留存」**：读不出来、因此被改名留存的账号副本会在这里被点名（连同它曾经保存了几个账号）——被顶掉的账号「去哪了」这个问题，从此不用再去 `~/.dsh` 里翻文件名；未登录那一屏也会显示同一条通知，因为账号消失之后用户落地的正是那一屏。分栏的理由是**提交语义不同**：账号改动点一下即生效，模型改动是草稿、必须点「保存」——一列长页会把保存按钮放到离它要保存的东西三屏之外。切栏不重新拉取、不丢未保存的模型草稿、账号池日志也不重建；未登录时不出分栏，那一屏说明不会被看不见的 tab 藏起来。**模型栏把所有模型一次性铺开，没有内层滚动条**——不再是一个套在滚动页面里的小窗口，唯一滚动的就是卡片自己那一页。
- **账号池：自动选号 + 失败换号（默认关闭）** —— 本机读完几个账号后，「该用谁的额度」可以交给插件按规则排序：**先排除不可用的**（凭据被拒、套餐不覆盖、账号已不存在、限流未到重试时间、额度耗尽），再在可用账号里**优先快到期的那点额度**（与其放着过期，不如先花掉），最后才比总额、token 新鲜度，并以账号 id 兜底成**全序**（同样的输入永远得到同样的顺序，不会在两行之间来回抖）。三个面板**各有各的池**：国内版与企业版共用同一份 CN 凭据，但企业版只挑租户账号、国内版不会漂到租户号上。开着池时，发请求前先按上面的顺序选中一个账号，并且**真实请求失败会换下一个账号重试（最多 3 个）**——只有账号级失败才换（`401` 凭据被拒、额度耗尽、限流、上游 5xx）；模型 id 写错、请求本身不合法**不换号**，因为那不是账号的问题，换号只会把同一个错误烧两遍、还冤枉一个没机会服务的账号。换号失败的真相会写进池的探针记录，下一次排序直接把它排到后面，而每一次结论都能在卡片上看到：`可用` / `限流` / `额度耗尽` / `凭据被拒` / `套餐不覆盖` / `上游不提供` / `本次未测出`，以及「什么时候可以重试」。**关掉池就回到严格绑定**，不会有任何残留 override。卡片里的「全部测速」会把每个成员按目标模型各测一次，结果**边跑边显示**（一行一个答案，不等整批跑完），并落盘成下次排序的依据。

  > 池是**显式选择**：默认关闭。它不会替你在没打开池的情况下换账号——「换账号等于换人计费」，所以这件事只能由你点头。池打开后卡片会明确写出**当前是谁在付费**（Host 报告的是「下一个真正发送请求的账号」，不是保存的那个绑定）。

- **倍率内嵌模型名** —— 模型名称按 Trae 自身菜单的格式显示积分倍率（如 `GLM-5.2 · x0.79`），倍率随目录刷新更新。
- **活动优惠徽标** —— Trae 把促销规则发在目录里（`activity_discount`：折扣比例、原价、闲时时段与时区），插件按**当前时钟**判定后，在模型名旁边画一枚胶囊：`5 折` / `闲时 5 折` / `限时 5 折`，悬停写明原价、现价与时段。判定放在**渲染时刻**而不是解析时刻，所以夜间折扣不会在第二天早上继续挂着；上游说「此刻没打折」就不画，**不从倍率反推**，也不给没有结束时间的活动编「限时」。这是纯提示：不改请求、不改计费，国际区（订阅制）没有这项数据因此不显示。详见 [docs/PROMO_BADGE.md](docs/PROMO_BADGE.md)。**同一枚胶囊也画在 DSH 的模型选择器里**（宿主 `conversation.input.model.label` 插槽），挑模型时就能看见——毕竟徽标画在设置卡片里时，你已经选完了。选择器里**倍率只出现一次**：名字里已有的目录倍率会被拆出来，有折扣时换成**折后价**（与卡片同一套时钟判定，同一份数据），打开选择器不会额外触发上游读。**现在本插件也发布自己的选择器徽标**：通过 `LlmModelInfo.badge` 把**此刻正在跑的促销**交出去（`5 折` / `闲时 5 折` / `限时 5 折`），与卡片上是同一份数据、同一个判定。时钟在宿主重建目录的那一刻（`listModels()`）读，所以窗口一关就不会再挂在那儿；整个目录只取一次时间。选择器的标签槽是 `single`，赢家替**所有** provider 的行画；插件不发布 `badge`，一旦别的插件占了那格，本插件的行就什么装饰都没有。
- **DSH 本地工具循环** —— 通过 Trae `llm_utils_chat` 获取待执行的结构化 `tool_calls`，交由 DSH 自带的本地工具执行，再将工具结果回传模型。
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 企业目录展示和图片预算分别能否代表企业请求可完成？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

企业目录现在允许提升租户自配行。筛选要求 chat_completion、来源值为 1 或 2，名称须非空且不能是占位符。来源 2 允许以配置名作显示名，合并时仍受重复 ID、同名上下文窗口和企业面板 opt-in 约束。面板确实调用了带 enterprise 判断的合并。它解决了目录发现遗漏。实际聊天仍通过 SOLO 桥接和企业路由。项目变更日志描述这类模型使用自带 base URL 的 OpenAI 兼容直连通道，并报告通过现有 llm_utils_chat 请求得到 4001。桥接中确有 4001 的可读映射。此处能看到租户条目并不能证明能调用，重选同一模型也无法补齐传输通道。

企业图片预算是另一个层级。适配器实际在供应商 profile 写入按 provider 分支的配置。企业上限是 8 MiB，国内和国际保留 20 MiB，共享图片计数上限和批处理粒度。作者称企业网关在 10 MiB 附近由 401 转为 413，并记录了同一批历史会话图片进入宿主卸载算法后的体积。可确认的是插件向宿主声明较保守的图片总量；卸载、占位符、重发和图片信息保留程度仍由宿主和对应扩展决定。长系统提示、工具声明或其他正文也占网关总请求字节。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.ts:343-350](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/catalog.ts#L343-L350)

限制提升范围并单独接纳租户配置的真实名称。

```text
export function isPromotableWireModel(model: TraeWireModel): boolean {
  if (model.usage !== 'chat_completion') return false
  // `config_source: 2` is a model the tenant's enterprise console configures.
  if (model.configSource !== 1 && model.configSource !== 2) return false
  const name = model.name.trim()
  if (name === '' || name === '-') return false
  // Tenant-configured rows use the config_name as their display name.
  if (model.configSource === 2) return true
```

**依据 2 · 源码核查**：[src/catalog.ts:665-688](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/catalog.ts#L665-L688)

合并层受企业 opt-in 和同名去重规则约束。

<details>
<summary>查看原文（24行）</summary>

```text
  for (const model of remote) claim(model.name, model.contextWindow)
  for (const wireModel of wire) {
    if (remoteIds.has(displayKey(wireModel.id))) continue
    // A tenant-configured model is only surfaced by the panel that bills it.
    if (wireModel.configSource === 2 && options.allowTenantConfigured !== true) continue
    if (!isPromotableWireModel(wireModel)) continue
    // A display name already claimed means this row either aliases a model the
    // catalog exposes or duplicates it. It earns its own row only when it is
    // strictly more capable than the strongest claimant — see `claimedNames`.
    const collides = claimedNames.has(displayKey(wireModel.name))
    if (collides && (wireModel.contextWindow ?? 0) <= (claimedNames.get(displayKey(wireModel.name)) ?? 0)) continue
    /**
     * A surviving collision gets the id appended, because the whole point of
     * promoting it is that the user can TELL IT APART from the equally-named
     * row: two rows rendering as `MiniMax-M2` is a picker that lies about
     * having one model. The id is the `config_name` the bridge sends, so it is
     * also the most actionable disambiguator available.
     */
    const name = collides ? `${wireModel.name} (${wireModel.id})` : wireModel.name
    claim(wireModel.name, wireModel.contextWindow)
    // Register the disambiguated name too, so no later row can mint the same
    // one and produce a second indistinguishable pair.
    claim(name, wireModel.contextWindow)
    result.push({
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1372-1388](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L1372-L1388)

只有企业面板允许租户配置模型进入合并目录。

<details>
<summary>查看原文（17行）</summary>

```text
        const [wireModels, roster] = await Promise.all([
          solo.fetchModels(signal),
          officialRoster.fetch(signal),
        ])
        // Only the enterprise panel bills the tenant-pool models of source 2.
        const merged = mergeTraeModelSources(remote, wireModels, { allowTenantConfigured: panel === 'enterprise' })
        // A row whose function is a NON-chat roster (solo_agent, builder_v3) is
        // not callable through llm_utils_chat BY THAT FUNCTION — asking answers
        // 4011/4001. The row is KEPT and only the function is cleared, so the
        // bridge falls back to the default chat function. Dropping it would
        // re-hide the nine `solo_agent`-only models issue #19 was opened about
        // (gpt-5.5, gpt-5.6-*, gpt-6-astra, glm-5.2, kimi-k2.7-code,
        // Dola-Seed-2.0-Code, deepseek-v4-flash-0731) precisely on a restricted
        // network, where the directory group is the only attribution there is —
        // and those models DO answer under the default function (measured). See
        // `withChatCallableFunctions` for the full trail.
        const callable = withChatCallableFunctions(merged, TRAE_DIRECTORY_FUNCTIONS[region])
```

</details>

**依据 4 · 源码核查**：[src/solo-bridge.ts:66-74](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/solo-bridge.ts#L66-L74)

声明 4001 的模型与 SOLO function 不匹配错误文案。

```text
 */
const TRAE_ERROR_HINTS: Readonly<Record<number, string>> = {
  1005: 'Trae requires a paid plan for this model; the current account\'s plan does not cover it',
  2001: 'Trae has not published its function config for this route (an upstream condition, not a local credential or config problem)',
  4001: 'Trae does not serve this model under the SOLO function the request used (config_name rejected)',
  4008: 'Trae reports the account\'s SOLO quota is exhausted for this request',
  4011: 'Trae throttled the SOLO channel for this account (a rate limit, not the credit balance)',
  4023: 'Trae does not recognise this model name on the SOLO route that was asked',
  4222: 'The enterprise tenant allowance is exhausted (tenant spend is separate from the personal credit balance; the consumer gateway still has its own)',
```

**依据 5 · 作者声明**：[CHANGELOG.md:5-22](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/CHANGELOG.md#L5-L22)

作者报告租户模型直连通道缺失及一次 4001。

<details>
<summary>查看原文（18行）</summary>

```text
### 企业面板的发现层收录租户自配模型（`config_source: 2`）

企业租户可以在 Trae 企业控制台配置自己的模型。Trae 自己的选择器能看到它们，插件的企业
面板一直不列——这批行由企业侧 `get_detail_param` 返回（`config_source: 2` +
`usage: 'chat_completion'`），**不在**企业侧 Remote 目录里，所以只有「wire 提升」一条路
能看见它们；而提升门槛只接受 `config_source === 1`，又拒绝「`display_name` 等于
`config_name`」的行——那恰好是租户配置模型的常见形态。两条门槛各自都足以挡掉它们。

**改法。** 提升门槛接受 `2`，且这类行允许用 `config_name` 当显示名。提升改为 **opt-in**
（`mergeTraeModelSources(..., { allowTenantConfigured })`），**只有企业面板传 `true`**：
这些行计费落在租户池，放进消费面板等于让用户选到一个不属于自己计费面的模型。另外两条
区域本来也取不到它们——它们的 wire 客户端钉在消费网关，那批行只出现在企业网关的名册里。

**这批模型现在调用不通，这是刻意不做的部分。** 租户配置的模型属于
`custom_openai_compatible`、客户端直连（`use_remote_service: false`、自带 base_url），
插件没有对应传输通道，实测走 `llm_utils_chat` 返回 `4001`。本次只修发现层，通道另开
issue 讨论——不做「静默假设能调」这种事。真要选中时，拿到的是桥接层翻译过的可读错误
（`4001` → 该 SOLO function 不提供此模型），不是一次空白回复。
```

</details>

**依据 6 · 源码核查**：[src/adapter.ts:137-143](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/adapter.ts#L137-L143)

共享图片预算与计数规则。

```text
const REQUEST_IMAGE_BUDGETS = {
  maxRequestImageBytes: 20_971_520,
  requestImagePixelBudget: 4_194_304,
  requestImageMaxBytes: 1_048_576,
  maxRequestImages: 50,
  imageOffloadCountQuantum: 10,
} as const
```

**依据 7 · 源码核查**：[src/adapter.ts:174-197](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/adapter.ts#L174-L197)

企业路由图片总量分支为 8 MiB。

<details>
<summary>查看原文（24行）</summary>

```text
const ENTERPRISE_MAX_REQUEST_IMAGE_BYTES = 8_388_608

/**
 * Image-request budgets for one route.
 *
 * The byte bound is region-specific; every other field is shared. Kept as a
 * function rather than two constants so the shared fields cannot drift apart.
 *
 * The return type is the profile's own field types rather than
 * `typeof REQUEST_IMAGE_BUDGETS`: that constant is `as const`, so its
 * `maxRequestImageBytes` is the LITERAL `20_971_520` and the enterprise arm
 * would not typecheck against it.
 * @param providerId - the route whose gateway will receive the request.
 */
function requestImageBudgets(
  providerId: string,
): Pick<
  ResolvedPiAiProviderProfile,
  'maxRequestImageBytes' | 'requestImagePixelBudget' | 'requestImageMaxBytes' | 'maxRequestImages' | 'imageOffloadCountQuantum'
> {
  return providerId === TRAE_ENTERPRISE_PROVIDER
    ? { ...REQUEST_IMAGE_BUDGETS, maxRequestImageBytes: ENTERPRISE_MAX_REQUEST_IMAGE_BYTES }
    : REQUEST_IMAGE_BUDGETS
}
```

</details>

**依据 8 · 源码核查**：[src/adapter.ts:699-702](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/adapter.ts#L699-L702)

将预算接入返回给宿主的 profile。

```text
    defaultContextWindow: FALLBACK_CONTEXT_WINDOW,
    ...requestImageBudgets(providerId),
    piProvider: provider,
  }
```

**依据 9 · 作者声明**：[CHANGELOG.md:45-75](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/CHANGELOG.md#L45-L75)

作者报告网关未鉴权体积探针与图片卸载结果。

<details>
<summary>查看原文（31行）</summary>

```text
**实测（2026-11-09，未鉴权探针）。** openresty 在**鉴权之前**就按 body 体积拒绝，所以状态码本身就是
上限，且不消耗任何凭据或积分：

| 网关 | 10,485,758 字节 | 10,485,762 字节 | 结论 |
| --- | --- | --- | --- |
| `console.enterprise.trae.cn`（`create_agent_task`） | `401` | **`413`** | 上限 10 MiB |
| `console.enterprise.trae.cn`（`llm_utils_chat`） | `401` | **`413`** | 上限 10 MiB |
| `trae-api-cn.mchost.guru` | `401`（测到 48 MiB） | — | 未触顶 |
| `coresg-normal.trae.ai` | `401`（测到 20 MiB） | — | 未触顶 |

**修复。** 只有企业版降到 **8 MiB**，另外两条区域保持 20 MiB：

| 区域 | 改前 | 改后 |
| --- | --- | --- |
| `trae-enterprise` | 20 MiB | **8 MiB** |
| `trae`（CN） | 20 MiB | 20 MiB |
| `trae-global`（国际） | 20 MiB | 20 MiB |

**为什么是 8 而不是 10。** 预算只管图片，请求还要带系统提示、工具声明和消息文本。8 MiB 留 2 MiB
信封，而实测请求远没到这个量级（工具声明约 49 KB）。**为什么不干脆把三条都降下来**：CN 与国际
网关实测 48 MiB / 20 MiB 都收，降它们只会白白卸掉用户本来能看到的图——那是静默的质量回退，
不是修复。

用那次失败会话的同一批图片跑宿主真实的卸载算法（`imageOffloadCountQuantum: 10`，超额按 10 的
整数倍卸）：

| | 改前（20 MiB） | 改后（8 MiB） |
| --- | --- | --- |
| 卸载是否触发 | 从不 | 第 13 张图时 |
| 卸载数量 | 0 / 15 | 5 / 15 |
| 实际发出 | ≈11.92 MiB → **413** | ≈7.99 MiB → 通过 |
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 账号、费用归属、失败重试和本机凭据操作由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

使用前提是本机具备兼容 Node 与宿主服务、可读取登录记录、且账号被授权发送任务数据至对应 Trae 网关。企业面板默认关闭并要求租户凭据。适配器显式绑定企业或 SOLO 路由，本机 shim 只监听 IPv4 回环，检查 Host、Origin 和独立 bearer。这个边界保护本机转发入口，消息、工具声明和发给模型的工具结果仍会离开主机。企业路由不会把账户池失败转换为个人额度回落；池开启后，同一路由的符合条件的失败可尝试换同池账号，最多三次。取得响应流后，shim 的流错误分支记录并结束响应，该循环没有恢复半途已收到的输出。一次请求尝试数与实际计费次数是两个量。

插件可刷新 token 并在锁内合并写入自己的凭据副本。其清除本地副本方法保留原应用文件；另有移除原应用登录数据的分支会先复制备份，再原子写入并回读。一次准备成本包括宿主版本、账号与数据授权核对。运行成本包括上游推理和失败重试的潜在积分，加上排查目录、过期登录与账单的人工时间。停用面板会撤回宿主适配器路由。清除插件凭据、检查备份以及在原应用重登则是单独操作。单位成本应按一次有完整工具结果且可核对账单的任务测量。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:89-103](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/package.json#L89-L103)

声明宿主 peer 范围，宿主适配器和存储服务均参与。

<details>
<summary>查看原文（15行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.4 <5.0.0",
    "@deepseek-ai/dsh-atomic-write": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-attachment": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm-pi-ai": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": ">=3.18.4 <4.0.0",
    "@earendil-works/pi-ai": ">=0.85.1 <2.0.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:434-438](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L434-L438)

企业面板需要显式启用。

```text
export function regionEnabled(config: Config, panel: TraePanel): boolean {
  const stored = regionStateOf(config, panel).enabled
  if (stored !== undefined) return stored !== false
  return panel !== 'enterprise'
}
```

**依据 3 · 源码核查**：[src/index.ts:1058-1071](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L1058-L1071)

企业存储要求租户账号且配置刷新行为。

<details>
<summary>查看原文（14行）</summary>

```text
    const store = new TraeCredentialStore({
      region,
      // The enterprise panel may only bill through a TENANT account. Its store
      // therefore refuses a personal binding (falls back to the preferred
      // tenant account) and never picks one by default — the tenant gateway
      // hands a personal account a full directory, so this is the only place
      // the difference can be enforced before a turn fails with `4019`.
      ...panel === 'enterprise' ? { requireTenant: true } : { hideTenantAccounts: !tenantLocal },
      ...unwrapVolatile(config.authFile) === undefined ? {} : { storagePath: unwrapVolatile(config.authFile) },
      edition: unwrapVolatile(config.edition) ?? 'auto',
      // The refresh callback resolves the device identity lazily so an
      // international SOLO account refreshes with its own installation's
      // machine/device ids (the official client sends a DeviceInfo body there).
      refresh: async credential => refreshTraeCredential(credential, undefined, await refreshDeviceSafe()),
```

</details>

**依据 4 · 源码核查**：[src/adapter.ts:58-68](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/adapter.ts#L58-L68)

供应商映射到各自的企业或 SOLO 路由。

<details>
<summary>查看原文（11行）</summary>

```text
export type TraeProviderRoute = 'solo' | 'enterprise'

export const TRAE_PROVIDER_ROUTES: Readonly<Record<string, TraeProviderRoute>> = {
  [TRAE_PROVIDER]: 'solo',
  [TRAE_ENTERPRISE_PROVIDER]: 'enterprise',
  [TRAE_AI_PROVIDER]: 'solo',
}

/** Chat pool a provider id bills against; `undefined` for an unknown id. */
export function routeOfTraeProvider(provider: string): TraeProviderRoute | undefined {
  return TRAE_PROVIDER_ROUTES[provider]
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:173-200](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/shim.ts#L173-L200)

每路随机 bearer，绑定回环并比较凭据。

<details>
<summary>查看原文（28行）</summary>

```text
  const routes: readonly (TraeShimRoute & { secret: string })[] = options.routes !== undefined
    ? options.routes.map(route => ({ ...route, secret: randomBytes(32).toString('base64url') }))
    : [{ label: 'solo', client: options.client as TraeUpstreamClient, secret: randomBytes(32).toString('base64url') }]
  const secret = routes[0]?.secret ?? randomBytes(32).toString('base64url')
  const sockets = new Set<import('node:net').Socket>()
  const server: Server = createServer((req, res) => { void handle(req, res) })
  server.on('connection', socket => {
    sockets.add(socket)
    socket.once('close', () => sockets.delete(socket))
  })
  const ready = new Promise<void>((resolve, reject) => {
    server.once('listening', resolve)
    server.once('error', reject)
  })
  server.listen(0, '127.0.0.1')

  /** Route whose secret matches the request's bearer, or `undefined`. */
  function routeOf(req: IncomingMessage): (TraeShimRoute & { secret: string }) | undefined {
    const match = typeof req.headers.authorization === 'string'
      ? /^Bearer\s+(.+)$/i.exec(req.headers.authorization.trim())
      : null
    if (match === null) return undefined
    const actual = Buffer.from(match[1] ?? '')
    for (const route of routes) {
      const expected = Buffer.from(route.secret)
      if (actual.length === expected.length && timingSafeEqual(actual, expected)) return route
    }
    return undefined
```

</details>

**依据 6 · 源码核查**：[src/shim.ts:104-113](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/shim.ts#L104-L113)

限定换号失败类别和三次尝试上限。

<details>
<summary>查看原文（10行）</summary>

```text
const FAILOVER_KINDS: ReadonlySet<TraeUpstreamErrorKind> = new Set(['authentication', 'hard_credit', 'soft_rate', 'server'])

/**
 * Accounts one request may try.
 *
 * Not "all of them": every attempt costs a round-trip before the user sees a
 * byte, and a pool whose every member is down must fail with a reason instead of
 * turning one request into a slow tour of the roster.
 */
const MAX_POOL_ATTEMPTS = 3
```

</details>

**依据 7 · 源码核查**：[src/shim.ts:221-246](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/shim.ts#L221-L246)

同一路由内换号并记录失败，成功拿到流即退出换号循环。

<details>
<summary>查看原文（26行）</summary>

```text
    const pool = route.pool
    let client: TraeUpstreamClient = route.client
    let accountId = pool === undefined ? undefined : await pool.prepare().catch(() => undefined)
    const tried: string[] = []
    for (let attempt = 0; ; attempt += 1) {
      const result = await client.chatStream(raw, signal)
      if (result.ok) return { kind: 'stream', response: result.response }
      const retryable = pool !== undefined && !signal.aborted && FAILOVER_KINDS.has(result.kind)
      // Only account-scoped failures are recorded: a bad model id is not evidence
      // that the account cannot serve, and writing it would exclude the account
      // from the pool permanently over one typo.
      if (retryable && accountId !== undefined) await pool.failed(accountId, result.kind, result.message).catch(() => {})
      const failed = { kind: 'failed' as const, status: STATUS_BY_KIND[result.kind], code: result.kind, message: result.message }
      if (!retryable) return failed
      if (accountId !== undefined) tried.push(accountId)
      // A spent attempt budget and an empty pool end the request the same way, so
      // the pool is asked once, at the end, whether it can explain the shortfall
      // (`undefined` when it has nothing to add — e.g. accounts remain, this
      // request simply ran out of tries).
      const next = attempt + 1 >= MAX_POOL_ATTEMPTS ? undefined : await pool.next(tried).catch(() => undefined)
      if (next === undefined) {
        const reason = await pool.shortfall(tried).catch(() => undefined)
        return reason === undefined ? failed : { ...failed, message: `${failed.message} (${reason})` }
      }
      client = next.client
      accountId = next.accountId
```

</details>

**依据 8 · 源码核查**：[src/shim.ts:282-302](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/shim.ts#L282-L302)

转发中断只结束响应。

<details>
<summary>查看原文（21行）</summary>

```text
        const controller = new AbortController()
        const abort = (): void => controller.abort()
        req.once('aborted', abort)
        req.socket.once('close', abort)
        const result = await chatWithFailover(route, raw, controller.signal)
        if (result.kind === 'failed') return writeError(res, result.status, result.code, result.message)
        res.writeHead(200, {
          'Content-Type': 'text/event-stream',
          'Cache-Control': 'no-cache',
          'Connection': 'keep-alive',
          'X-Accel-Buffering': 'no',
        })
        const body = Readable.fromWeb(result.response.body as Parameters<typeof Readable.fromWeb>[0])
        body.on('error', (error: unknown) => {
          const record = error instanceof Error
            ? { name: error.name, message: error.message, cause: error.cause ? String(error.cause) : undefined }
            : String(error)
          options.logger?.warn('dsh-connect-trae: upstream stream failed', record)
          if (!res.writableEnded) res.end()
        })
        body.pipe(res)
```

</details>

**依据 9 · 源码核查**：[src/auth.ts:1551-1579](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/auth.ts#L1551-L1579)

刷新在锁内合并持久化本插件副本。

<details>
<summary>查看原文（29行）</summary>

```text
    try {
      const outcome = await this.refresh(credential)
      const refreshed: TraeCredential = {
        ...credential,
        accessToken: outcome.accessToken,
        ...outcome.refreshToken === undefined ? {} : { refreshToken: outcome.refreshToken },
        expiresAtMs: outcome.expiresAtMs,
        ...outcome.refreshExpiresAtMs === undefined ? {} : { refreshExpiresAtMs: outcome.refreshExpiresAtMs },
        ...outcome.host === undefined ? {} : { host: outcome.host },
        source: 'dsh',
      }
      const ownPath = this.ownAuthPath()
      await withFileLock(ownPath, async () => {
        // Read-modify-write, NOT overwrite. Since version 2 this file holds
        // every account of the region — including imported ones that have no
        // desktop file behind them and could not be re-discovered — so writing
        // a single refreshed credential as the whole document would silently
        // delete the others. The account whose token was just refreshed
        // replaces its own entry; every other entry is carried over verbatim.
        const existing = await this.readOwnForMerge(ownPath)
        // A corrupt file we could not quarantine is not a base to write over:
        // the refreshed token is returned to this request but not persisted,
        // and the next refresh retries the merge against the intact bytes.
        if (existing === undefined) return
        const refreshedId = traeAccountId(refreshed)
        const entries = existing.filter(item => traeAccountId(item) !== refreshedId)
        entries.push(refreshed)
        await writeOwn(ownPath, entries)
      })
```

</details>

**依据 10 · 源码核查**：[src/auth.ts:470-499](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/auth.ts#L470-L499)

原应用登录清理有备份、原子写与回读。

<details>
<summary>查看原文（30行）</summary>

```text
): Promise<boolean> {
  const stamp = new Date().toISOString().replace(/[:.]/g, '-')
  try {
    await copyFile(path, `${path}.dsh-backup-${stamp}`)
  } catch { return false }
  const next: Record<string, unknown> = { ...document }
  delete next[TRAE_AUTH_STORAGE_KEY]
  const userTag = document[TRAE_USERTAG_STORAGE_KEY]
  const userId = typeof claims['userId'] === 'string' || typeof claims['userId'] === 'number'
    ? String(claims['userId'])
    : undefined
  if (userId !== undefined && typeof userTag === 'string') {
    try {
      const decoded = parseTraeAuthValue(userTag)
      if (typeof decoded === 'object' && decoded !== null && !Array.isArray(decoded)) {
        const tags = { ...(decoded as Record<string, unknown>) }
        delete tags[userId]
        next[TRAE_USERTAG_STORAGE_KEY] = encryptTraeStorageValue(JSON.stringify(tags), traeStorageValueType(userTag))
      }
    } catch {
      // An unreadable usertag map is left untouched: dropping the login is the
      // point, and a map we cannot decode is not worth risking.
    }
  }
  try {
    await writeFileAtomic(path, `${JSON.stringify(next, null, 2)}\n`, { mode: 0o600 })
    // Read back before claiming success: another writer (the app, if the probe
    // missed it) could have replaced the file between write and verify.
    const check = await readFile(path, 'utf8')
    return !check.includes(encoded)
```

</details>

**依据 11 · 源码核查**：[src/auth.ts:1154-1165](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/auth.ts#L1154-L1165)

清除插件副本与原应用登录操作有各自边界。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * Remove every plugin-owned copy this store could read (per-region file,
   * legacy single file, and their lock siblings); the desktop storage files
   * are untouched. A region store's logout therefore also clears the legacy
   * migration source — deliberate: `logout` is the user's "forget what the
   * plugin stored" action, not a per-account toggle.
   */
  async logout(): Promise<void> {
    for (const path of this.ownCandidates()) {
      await rm(path, { force: true })
      await rm(`${path}.lock`, { force: true })
    }
```

</details>

**依据 12 · 源码核查**：[src/index.ts:2160-2167](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L2160-L2167)

关闭面板实际撤回适配器路由。

```text
  const syncRegionRegistration = (value: Config): void => {
    for (const panel of TRAE_PANELS) {
      // Each panel keeps its OWN registration, so a per-panel switch replaces
      // exactly that panel: withdrawing the adapter route is what actually
      // removes its models from DSH's picker.
      const enabled = regionEnabled(value, panel)
      for (const entry of registration[panel].adapters) entry.handle.replace(enabled ? [entry.provider] : [])
    }
```

**依据 13 · 源码核查**：[src/solo.ts:469-485](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/solo.ts#L469-L485)

企业调用补关联 ID，随后发送模型请求至固定聊天端点。

<details>
<summary>查看原文（17行）</summary>

```text
    if (this.options.route === 'enterprise') {
      // The tenant gateway requires a per-call correlation id; the consumer
      // gateway rejects a body that carries one (`4001`), so this stays inside
      // the enterprise branch rather than being stamped for everyone.
      try {
        const parsed = JSON.parse(prepared) as Record<string, unknown>
        if (parsed['session_id'] === undefined) parsed['session_id'] = randomUUID()
        prepared = JSON.stringify(parsed)
      } catch {
        return { ok: false, status: 400, kind: 'client', message: 'invalid JSON request' }
      }
    }
    let response: Response
    try {
      response = await this.fetchImpl(traeEndpoint(base, TRAE_SOLO_CHAT_PATH), {
        method: 'POST', headers, body: prepared, signal: signal ?? AbortSignal.timeout(120_000),
      })
```

</details>

**依据 14 · 源码核查**：[src/solo.ts:519-523](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/solo.ts#L519-L523)

企业路由固定目标网关，其他路由按凭据地区选择。

```text
  /** Chat gateway for this client's pinned route. */
  private chatBaseOf(credential: TraeCredential): string {
    if (this.options.route === 'enterprise') return TRAE_ENTERPRISE_HOST
    return REGION_GATEWAYS[assertSupportedRegion(regionOfCredential(credential))].chat
  }
```

#### 缺口

- 未掌握该账号或租户的协议权限、费用和失败计费
  **影响**：无法推算回本或多账号自动切换的影响
  **进一步探讨**：由有授权的测试账号使用脱敏账单逐次对照任务事件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些人适合试用，什么机制能让用户在提交前识别风险？

**研究主题**：新假设与验证、采用判断

#### 完整回答

在有明确账号授权、允许向对应网关发送测试数据的开发者场景，可选一个面板、一个明确属于该计费方的模型，关闭账号池，做一轮无敏感内容的只读文件问答。合格标准是工具调用只出现一次、宿主收到完整输出、总结能引用该输出、账单可追溯。遇到模型被拒绝、扣费归属不明、流提前结束或关键图片已被卸载时，结束本次试用并切回原供应商或原 Trae 客户端。

可检验的设计假设是分开显示“目录可发现”和“该路由的探针已通过”，并在发送前估算完整序列化请求的体积。这可分别解决租户自配条目与图片预算的两种错位。探针结果应绑定供应商、账号类别、模型和发现时间，过期显示未知。体积预估应和宿主实际发出的 body 比对，避免重复提示。对已知可调用模型和租户直连模型各试一组，另复跑一组有大工具声明的长图文任务。如果错误选择未减少，或保守估算频繁丢弃原本可发且决定答案的图片，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.ts:665-675](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/catalog.ts#L665-L675)

目录提升只检查发现层条件，适合作为对照组。

<details>
<summary>查看原文（11行）</summary>

```text
  for (const model of remote) claim(model.name, model.contextWindow)
  for (const wireModel of wire) {
    if (remoteIds.has(displayKey(wireModel.id))) continue
    // A tenant-configured model is only surfaced by the panel that bills it.
    if (wireModel.configSource === 2 && options.allowTenantConfigured !== true) continue
    if (!isPromotableWireModel(wireModel)) continue
    // A display name already claimed means this row either aliases a model the
    // catalog exposes or duplicates it. It earns its own row only when it is
    // strictly more capable than the strongest claimant — see `claimedNames`.
    const collides = claimedNames.has(displayKey(wireModel.name))
    if (collides && (wireModel.contextWindow ?? 0) <= (claimedNames.get(displayKey(wireModel.name)) ?? 0)) continue
```

</details>

**依据 2 · 作者声明**：[CHANGELOG.md:18-22](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/CHANGELOG.md#L18-L22)

作者报告已经发现但无法用同一通道调用的反例。

```text
**这批模型现在调用不通，这是刻意不做的部分。** 租户配置的模型属于
`custom_openai_compatible`、客户端直连（`use_remote_service: false`、自带 base_url），
插件没有对应传输通道，实测走 `llm_utils_chat` 返回 `4001`。本次只修发现层，通道另开
issue 讨论——不做「静默假设能调」这种事。真要选中时，拿到的是桥接层翻译过的可读错误
（`4001` → 该 SOLO function 不提供此模型），不是一次空白回复。
```

**依据 3 · 源码核查**：[src/adapter.ts:188-197](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/adapter.ts#L188-L197)

图片预算只提供图像层门槛，完整请求估算属于新假设。

<details>
<summary>查看原文（10行）</summary>

```text
function requestImageBudgets(
  providerId: string,
): Pick<
  ResolvedPiAiProviderProfile,
  'maxRequestImageBytes' | 'requestImagePixelBudget' | 'requestImageMaxBytes' | 'maxRequestImages' | 'imageOffloadCountQuantum'
> {
  return providerId === TRAE_ENTERPRISE_PROVIDER
    ? { ...REQUEST_IMAGE_BUDGETS, maxRequestImageBytes: ENTERPRISE_MAX_REQUEST_IMAGE_BYTES }
    : REQUEST_IMAGE_BUDGETS
}
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2160-2167](https://github.com/dingminhua/dsh-connect-trae/blob/a80b77c2fca56c18c1ea59629a74372303a5c7d5/src/index.ts#L2160-L2167)

确认试用可通过面板路由撤回而结束。

```text
  const syncRegionRegistration = (value: Config): void => {
    for (const panel of TRAE_PANELS) {
      // Each panel keeps its OWN registration, so a per-panel switch replaces
      // exactly that panel: withdrawing the adapter route is what actually
      // removes its models from DSH's picker.
      const enabled = regionEnabled(value, panel)
      for (const entry of registration[panel].adapters) entry.handle.replace(enabled ? [entry.provider] : [])
    }
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
