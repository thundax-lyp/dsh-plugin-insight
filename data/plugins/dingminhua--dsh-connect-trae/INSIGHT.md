# Trae 连接器

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0eec39d](https://github.com/dingminhua/dsh-connect-trae/tree/0eec39df4367db229baf77c5ebcf1e7bc043e7d9)

<!-- BEGIN META -->
[![GitHub ★ 191](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=191&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-trae) [![npm 30d 20,364](https://img.shields.io/static/v1?label=npm+30d&message=20%2C364&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-trae)
<!-- END META -->

> **功能**：将本机 Trae 账号接入 DSH 模型供应商，提供地区、用量和模型设置。

> **亮点**：[Q01](#research-q01) 把 Trae 模型输出接入 DSH 会话，并让面板选择固定到相应路由。

> **主要限制**：[Q03](#research-q03) 本机回环不代表凭据只读；部分账号操作会改写原应用存储。

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
  - [Q01 · 已有 Trae 登录对 DSH 用户有何增量？](#detail-section-11)
  - [Q02 · 企业与个人账单如何避免静默串路？](#detail-section-12)
  - [Q03 · 插件是否只读 Trae 本地登录文件？](#detail-section-13)
  - [Q04 · 怎样最小化试用的账号和维护负担？](#detail-section-14)
  - [Q05 · 显示实际使用的计费身份能否减少误判？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 使用已登录 Trae 模型的人可评估按面板分离的供应商接入。

分别在两套应用中使用账号可保留原路径，但任务和输出需手动搬运。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型流转换 | 把工具调用交给 DSH | 需相应账号和上游服务 |
| 面板路由 | 区分账单池 | 真实扣费仍须查账 |
| 账号操作 | 管理副本及部分原应用登录状态 | 须核对文件权限与操作范围 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 可访问的 Trae 账号 | 必需 | 授权上游 | 供应商不可用 |
| 兼容 DSH | 必需 | 接收模型与工具流 | 保持原应用 |
| 本机 HTTP 和文件权限 | 必需 | 连接 shim 与存储 | 核对绑定及文件权限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 单面板单受控账号 | 核对授权条件 |
| 核查 | 发无副作用的请求 | 确认路由及真实账单 |
| 退出 | 停用并重启宿主 | 另查本机副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 账号和模型费用未知 | 版本和文件核对耗时未知 | 地区和账号有条件 |
| 持续 | 推理及账户池费用未知 | 维护与刷新耗时未知 | 可能发生同池换号 |
| 恢复 | 重试费用未知 | 撤回账号与配置时间未知 | 文件操作和停用分开 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型接入 | 可转发结构化工具流 | 真实可调用及正确性 |
| 路由分流 | 按面板与 bearer 匹配 | 实际费用和账号权限 |

> **思考**：[Q03](#research-q03) 本机回环不代表凭据只读；部分账号操作会改写原应用存储。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把 Trae 模型输出接入 DSH 会话，并让面板选择固定到相应路由。

回环 bearer 是路由选择条件；成功流交接和同池账户重试的界线可定位。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 本机回环不代表凭据只读；部分账号操作会改写原应用存储。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只用一个已核对的面板，保持账号池关闭并独立查账。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

核查固定路由、流转换与存储写入；未执行账号、模型或真实计费。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/solo-bridge.ts、src/shim.ts、src/auth.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定插件的路由、流和部分凭据文件路径；未使用账号、设备、网关或模型。
- 下一步：以受控身份检查成功、拒绝、限额、禁用和文件变更。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-trae](https://github.com/dingminhua/dsh-connect-trae)
- **版本号**：4.8.0（[固定提交 0eec39d](https://github.com/dingminhua/dsh-connect-trae/tree/0eec39df4367db229baf77c5ebcf1e7bc043e7d9)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用不含凭据的实际路由与账号标签检验能否减少计费误判。

以受控身份检查成功、拒绝、限额、禁用和文件变更。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 98 | 16204 | — | — | 266646 |
| .js | source | 1 | 21 | 17 | 2 | — |
| .mjs | source | 22 | 2912 | 2115 | 682 | — |
| .ts | source | 69 | 21316 | 11095 | 9360 | — |
| .tsx | source | 14 | 8098 | 4973 | 2992 | — |
| .ts | test | 71 | 16213 | 12191 | 2883 | — |
| .tsx | test | 32 | 9187 | 5978 | 2287 | — |

</details>

**活跃度**

[![近30天新建 39](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=39&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-trae/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 41](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=41&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-trae/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Trae 请求的路由、账单范围、回退与本机凭据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 Trae 登录对 DSH 用户有何增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已使用 Trae 又在 DSH 执行工具的用户可以把模型侧接到 DSH 的会话。固定源码为面板建立单独 client 和 bridge，把上游文本、推理及工具调用映射成适配器理解的流字段。相比切到 Trae 手工搬运回复，宿主可消费结构化工具调用。模型目录或工具字段存在只证明协议转换，不保证账号可调用模型或工具正确。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-40](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/README.md#L27-L40)

作者说明用户、供应商和本地执行

<details>
<summary>查看原文（14行）</summary>

```text
一个独立的 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) bundle 插件。它把本机已登录的 Trae 账号（**国内版、企业版与国际版均支持**）接到 DSH 的模型选择器：模型负责生成结构化工具调用，`bash` / `read` / `write` / `edit` 等工具由 DSH 本地执行；同时提供用量概览（国内版 Work/通用积分、企业版租户额度、国际版订阅状态）、每日签到领取与模型管理界面。**国内版、企业版与国际版是三个并行的供应商（`trae` / `trae-enterprise` / `trae-global`），可同时使用**；插件设置卡片以 tab 区分三者，方便统一管理。

**支持 macOS、Windows 与 Linux**：CI 在 `ubuntu-latest` 与 `windows-latest` 上跑完整 typecheck / 测试 / 构建；Windows 侧的目录探测、应用版本头与锁行为均有针对性处理，详见 [Windows 说明](#windows-说明)。

> 除每日签到领取外，插件的所有查询都是只读的、不消耗额度；签到领取也只在你点击按钮时才发生。

> **边界：本插件不与任何其它插件联动。** 账号、凭据、模型目录、账号池与设置命名空间都只属于本插件；`trae` 失败不会借用别的插件的账号或额度，反之亦然。理由与具体含义见[与其它插件的关系](#与其它插件的关系)。

## 功能特性

- **三供应商并行接入** —— 国内版注册为 DSH 的 `trae` provider（`DeepSeek-V4-Flash`、`DeepSeek-V4-Pro` 等），企业版注册为 `trae-enterprise`，国际版注册为 `trae-global`（Gemini / GPT / MiniMax 阵容），**三边模型同时出现在 DSH 模型选择器里**：不同会话可以各选一边，互不干扰。
- **企业版是独立计费通道，不是国内版的别名** —— 同一张 CN 凭据若属于 `tob_online` 租户，会被**两个**网关同时服务：消费池（扣个人积分）与租户池（扣企业额度）。同一模型、两种付费方，所以「谁付钱」由你显式选，插件不替你猜。`trae` 永不碰企业网关；`trae-enterprise` **不回落**，被拒绝就如实报错，不会悄悄改用个人额度重跑。企业版**默认关闭**——纯个人账号用不了企业池，默认放开等于塞一条一用就失败的 provider。
- **可单独关闭任一面板** —— 三个 tab 各带一个勾选（国内版与国际版默认勾选，企业版默认不勾）：取消勾选即把该面板的供应商**整个从 DSH 模型选择器撤掉**（不是只藏起 tab），并且不再发起任何请求；重新勾选即恢复，账号、目录、勾选与上下文预算全部保留。用不到国际版就把国际版关掉即可。
- **插件卡片 tab 切换** —— 设置卡片顶部为「国内版 / 企业版 / 国际版」三个 tab，各含独立的账号选择、用量概览与模型管理；每个 tab 的账号、目录、勾选与未保存草稿完全隔离——在一个 tab 里切账号或刷新模型，不会触碰另一边的运行时目录与会话。国内版与企业版共用同一份 CN 凭据池，但**各有各的账号绑定与模型勾选**：两个池的名录并不相同（`DeepSeek-V4.1-Flash` 只有企业池列），所以勾选互不覆盖。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1158-1175](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/index.ts#L1158-L1175)

为面板建立桥和路由

<details>
<summary>查看原文（18行）</summary>

```text
    // Exactly ONE provider per panel. The route label is the shim's bearer
    // key and must be unique within a shim, so a panel never publishes the
    // other panels' ids either.
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
      shimRoutes.push({ label: route, client: delegating, pool: poolShimHooksOf(panel) })
    }
```

</details>

**依据 3 · 源码核查**：[src/solo-bridge.ts:238-247](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/solo-bridge.ts#L238-L247)

转换流增量和工具调用

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

#### 缺口

- 未验证实际账号模型和工具准确性
  **影响**：不能认定供应商可用性
  **进一步探讨**：用允许的受控账号核对单轮文本和无副作用工具

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 企业与个人账单如何避免静默串路？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每面板按 provider 决定 route，并为 shim 路由生成随机 bearer。监听地址是 127.0.0.1，先过 Host 和 Origin 判定，再匹配 bearer，未知 bearer 返回 401。该选择发生在转发前。若账户池开启，受控重试只取当前 route 的 pool，遇到允许类别的失败才尝试下一个账号，收到 ok 流后函数直接返回，不会在此分支继续换号。这层设计降低误路由，但请求可能触及同池其他身份，真实账单仍要从供应方记录复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1158-1175](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/index.ts#L1158-L1175)

provider 决定 route 和 pool

<details>
<summary>查看原文（18行）</summary>

```text
    // Exactly ONE provider per panel. The route label is the shim's bearer
    // key and must be unique within a shim, so a panel never publishes the
    // other panels' ids either.
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
      shimRoutes.push({ label: route, client: delegating, pool: poolShimHooksOf(panel) })
    }
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:173-201](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L173-L201)

回环监听和密钥匹配

<details>
<summary>查看原文（29行）</summary>

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
  }
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:221-247](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L221-L247)

同路由池的失败和限制

<details>
<summary>查看原文（27行）</summary>

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
    }
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:250-257](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L250-L257)

拒绝未知 bearer

```text
  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (!hostIsLoopback(req.headers.host)) return writeError(res, 403, 'host_not_allowed', 'Host must be loopback')
      if (!originIsLoopback(req.headers.origin)) return writeError(res, 403, 'origin_not_allowed', 'Origin must be loopback')
      // The bearer selects the billing pool, so an unrecognised token is a 401
      // and never a fallback to the first route.
      const route = routeOf(req)
      if (route === undefined) return writeError(res, 401, 'unauthorized', 'Missing or invalid bearer')
```

#### 缺口

- 未对供应方账单做核验
  **影响**：不能以本地 route 代替实际扣费凭据
  **进一步探讨**：受控两账号对照账单、失败及取消

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 插件是否只读 Trae 本地登录文件？

**研究主题**：缺陷与关键质疑

#### 完整回答

插件有自己的凭据副本，并用原子写入请求 0600 文件权限。另有一条操作路径删除 Trae 存储对象的登录字段，并尝试删除相关用户标签，再写回并回读。这证明本项目并非所有账号操作都只读，不能把自己的副本与原应用文件混为一谈。回环访问验证也只约束进入 shim 的 HTTP 请求，不能保证本机其他进程无法读取存储。对于共享机器，先核对文件权限和明确操作触发范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:98-105](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/README.md#L98-L105)

作者区分插件状态与原应用文件

```text
## 与其它插件的关系

**本插件不与任何其它插件联动。** 这是一条边界，不是一句口号：

- **不共享状态。** 账号、凭据、模型目录、账号池、访问令牌、设备号都只属于本插件；插件只读写自己的文件（`$DSH_HOME/.trae-auth.*.json`、`.trae-auth.deleted.*.json`、`.trae-pool.*.json`）与自己的设置命名空间，**不读、不写、也不为任何别的插件供数**。它确实会编辑 Trae 桌面应用自己的登录文件，但那是另一个**应用**，不是另一个插件。
- **不做跨插件的账号或额度调度。** 账号池只在本插件自己的账号之间排序与换号；`trae` 失败就是失败，不会去「借」另一个连接器插件的账号、额度或通道，也不会把请求转交给别的插件重试。反方向同样成立：没有任何插件能通过本插件代发请求。
- **不协商槽位。** 卡片与 composer 读数是否出现，由**本插件的 provider 是否被选中**决定（读 DSH 自己的 `modelSelection` 投影），不靠插件间通信分配位置。两个连接器插件同时安装时，它们靠「各自只在自己的 provider 被选中时出现」共存——这是**互不干扰**，不是协作。
- **不共享开关。** 关掉本插件的某个面板，只撤下本插件的 provider 与请求，不会改动另一个插件的供应商、模型、绑定或设置。
```

**依据 2 · 源码核查**：[src/auth.ts:415-426](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/auth.ts#L415-L426)

写插件凭据副本

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Write the plugin-owned file: every credential of the region, in the version-2
 * array layout.
 *
 * One writer for both paths that persist to this file (a refresh, and an
 * import) so the read-modify-write in `refreshNow` and the additive write in
 * {@link TraeCredentialStore.importAccounts} cannot drift apart. Always writes
 * `OWN_VERSION`, which is what upgrades a version-1 file on its first write.
 */
async function writeOwn(path: string, credentials: readonly TraeCredential[]): Promise<void> {
  const document = { version: OWN_VERSION, credentials: credentials.map(credential => ({ ...credential })) }
  await writeFileAtomic(path, `${JSON.stringify(document, null, 2)}\n`, { mode: 0o600, dirMode: 0o700 })
```

</details>

**依据 3 · 源码核查**：[src/auth.ts:476-498](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/auth.ts#L476-L498)

删除原应用存储键并写回

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/shim.ts:250-257](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L250-L257)

回环 HTTP 防护范围

```text
  async function handle(req: IncomingMessage, res: ServerResponse): Promise<void> {
    try {
      if (!hostIsLoopback(req.headers.host)) return writeError(res, 403, 'host_not_allowed', 'Host must be loopback')
      if (!originIsLoopback(req.headers.origin)) return writeError(res, 403, 'origin_not_allowed', 'Origin must be loopback')
      // The bearer selects the billing pool, so an unrecognised token is a 401
      // and never a fallback to the first route.
      const route = routeOf(req)
      if (route === undefined) return writeError(res, 401, 'unauthorized', 'Missing or invalid bearer')
```

#### 缺口

- 未核对所有账号操作入口及跨系统权限行为
  **影响**：不能给出本机操作和外部条款的安全保证
  **进一步探讨**：以合成存储文件验证写入触发和备份，另核对账号授权条件

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样最小化试用的账号和维护负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、能读取的 Trae 账号和允许的供应方接入。先只选择一个面板和一个受控账号，保持企业与账号池关闭，确认流式回复、无副作用工具及退出状态。企业面板默认关闭，有显式开关。插件卸载后按文档重启宿主，并单独检查本机副本和原应用登录状态。实际推理、积分、维护及排障费用未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:200-219](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/README.md#L200-L219)

版本、安装与重启条件

<details>
<summary>查看原文（20行）</summary>

````text
## 安装

推荐使用 DSH 插件命令安装 npm 已发布版本：

```sh
dsh plugin --profile desktop add dsh-connect-trae
```

或直接通过 npm 安装：

```sh
npm install dsh-connect-trae
```

安装、更新或卸载 bundle 后，需要重启对应的 DSH 进程。

## DSH 版本兼容

**要求 DSH 0.1.7-rc.1 及以上**（2.3.0 起不再支持 0.1.7 之前的宿主；peer 依赖范围已按此收窄）。
**peer 上界为 `<0.3.0-0`：0.1.7 与 0.2 两条线均受支持（含 0.2.1-rc.5，已实测）。**
````

</details>

**依据 2 · 源码核查**：[src/index.ts:408-418](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/index.ts#L408-L418)

企业面板默认关闭

<details>
<summary>查看原文（11行）</summary>

```text
 * The ENTERPRISE panel is the one deliberate exception: it defaults OFF. A
 * consumer-only account (`tenant 7o2d894p7dr0o4`) cannot use that pool at all,
 * so opting every existing user into a second CN provider would put a route in
 * their model picker that fails on first use. It is switched on from its card
 * tab, by someone whose account actually belongs to a tenant.
 */
export function regionEnabled(config: Config, panel: TraePanel): boolean {
  const stored = regionStateOf(config, panel).enabled
  if (stored !== undefined) return stored !== false
  return panel !== 'enterprise'
}
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:221-247](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L221-L247)

账号池影响身份选择

<details>
<summary>查看原文（27行）</summary>

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
    }
```

</details>

#### 缺口

- 未运行账号、宿主或网关
  **影响**：不能认定 provider 与账单稳定
  **进一步探讨**：用明确获准的账号测试后核对供应方账单及禁用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显示实际使用的计费身份能否减少误判？

**研究主题**：新假设与验证

#### 完整回答

现在 provider 选择决定路由，账号池能在一条 route 内切换。可验证在失败回执或成功记录中显示不含凭据的实际面板及账号别名，是否有助识别重试和账单。固定同样的限额模拟，对照现有与新增记录，测能否识别实际账号、耗时及暴露信息。若显示不能减少误判，或披露超出必要范围，就不采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1158-1175](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/index.ts#L1158-L1175)

当前面板的路由和池

<details>
<summary>查看原文（18行）</summary>

```text
    // Exactly ONE provider per panel. The route label is the shim's bearer
    // key and must be unique within a shim, so a panel never publishes the
    // other panels' ids either.
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
      shimRoutes.push({ label: route, client: delegating, pool: poolShimHooksOf(panel) })
    }
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:223-247](https://github.com/dingminhua/dsh-connect-trae/blob/0eec39df4367db229baf77c5ebcf1e7bc043e7d9/src/shim.ts#L223-L247)

失败时同池切换账号

<details>
<summary>查看原文（25行）</summary>

```text
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
    }
```

</details>

#### 缺口

- 缺真实操作者与账单对照
  **影响**：只能作待验证的诊断假设
  **进一步探讨**：用测试路由注入限额并记录身份选择

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
