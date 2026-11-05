# dsh-providers-hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[97bc37c](https://github.com/iJetLi/dsh-providers-hub/tree/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9)

<!-- BEGIN META -->
[![GitHub ★ 99](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=99&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iJetLi/dsh-providers-hub) [![npm 30d 7,264](https://img.shields.io/static/v1?label=npm+30d&message=7%2C264&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-providers-hub) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-providers-hub)
<!-- END META -->

> **功能**：为 DSH 集中管理编程服务账号、凭据续期、多账号接入与本地 OpenAI 兼容网关。

> **亮点**：统一账号池、动态聚合设置和网关复用宿主模型路径，减少重复接入逻辑；本次只确认代表性静态Key链和公共编排，未证明全渠道效果。[Q01](#research-q01)

> **主要限制**：模型目录和渠道注册不等于有效推理，多槽重试与续期仍依赖各路独立协议；代表性七牛机制不能外推到所有登录渠道。[Q01](#research-q01) [Q02](#research-q02)

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
  - [Q01 · 账号、模型注册和网关怎样接成用户流程？](#detail-section-11)
  - [Q02 · 选号、续期与网关鉴权如何失败和降级？](#detail-section-12)
  - [Q03 · 成本、观察建议与可证伪改进是什么？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多服务账号的维护者可研究统一接入，但合格结果需明确实际账号、模型与费用。[Q01](#research-q01)

直接配置单一官方或兼容供应商更简单；本组件增加多账号与渠道编排，也增加协议和凭据维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 七牛静态Key接入 | 注册模型并发起推理 | Key、额度和上游协议，未实测 |
| 聚合路由注册 | 以共享池与动态顺序选择渠道 | 各渠道独立有效性未共同确认 |
| 续期调度 | 周期处理账号凭据 | 具体渠道需有有效refresh实现 |
| 兼容网关 | 外部客户端复用宿主llm | Bearer Key、监听范围和端口；非全语义兼容保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24，匹配Cordis/credentials/commands/llm | 启动必需 | 宿主与适配注册 | 不能推定可加载 |
| 各渠道账号或Key | 对应推理必需 | 上游认证与额度 | 无可用槽时报错 |
| 上游网络与协议 | 持续必需 | 目录、续期和推理 | 需区分限流、认证和传输 |
| Web连接与设置模块 | 设置界面必需 | 管理与状态 | 无界面不代表后端状态 |
| 网关Key及可绑定端口 | 可选网关必需 | 其他客户端复用 | 网关失败降级记录日志 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者核对构建、peer和目标渠道资格 | 不把目录注册当推理成功 |
| 账号 | 用户在设置页录入/登录并核对凭据 | 具体渠道状态明确 |
| 请求 | 宿主适配器选号并请求 | 已交付后不重放仅代表已查七牛链 |
| 网关 | 用户配置Key和监听范围 | 401/端口错误单独排查 |
| 退出 | 停用聚合和网关，回直接供应商 | 核对凭据与实际扣费渠道 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 构建和账号资源，金额未知 | 多服务登录/Key及兼容配置 | 未逐渠道确认资格 |
| 持续 | 模型、续期与目录请求，费用未知 | 协议更新和账号排障 | 积分不等于无成本 |
| 失败恢复 | 多槽尝试可能增加请求 | 区分认证、配额与网络 | 不把七牛恢复外推全渠道 |
| 退出 | 凭据与本地状态需保留或处理 | 回直接供应商并核对客户端Key | 迁移时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一接入 | 公共池、聚合和网关接线 | 全渠道推理有效性 |
| 七牛错误处理 | 交付后不重放、取消和分类 | 真实服务响应与全部协议覆盖 |
| 成本管理 | 有路由组织机制 | 单位合格任务账单和维护负担 |

> **思考**：模型目录和渠道注册不等于有效推理，多槽重试与续期仍依赖各路独立协议；代表性七牛机制不能外推到所有登录渠道。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一账号池、动态聚合设置和网关复用宿主模型路径，减少重复接入逻辑；本次只确认代表性静态Key链和公共编排，未证明全渠道效果。[Q01](#research-q01)

续期调度的武装与账号池内容解耦、running防重入和网关故障隔离值得借鉴。多渠道接线仍需独立契约核查，不能用导入/注册数量替代覆盖，源码注释中的历史实测不作本次执行证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型目录和渠道注册不等于有效推理，多槽重试与续期仍依赖各路独立协议；代表性七牛机制不能外推到所有登录渠道。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

保持观察，先逐路核实身份、协议与费用；没有这些材料时用已验证供应商直接配置，不将全部账号自动接入日常任务。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

公共编排、网关和代表性七牛链已有源码支持；全渠道可用与成本未确认，界面改进为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/qiniu-adapter.ts、src/refresh-scheduler.ts、src/openai-gateway/index.ts、src/openai-gateway/auth.ts、src/openai-gateway/server.ts、src/openai-gateway/config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查公共入口、代表性七牛Key/请求/重试链、续期调度与本地网关；没有完整核查每路OAuth、浏览器登录、消息转换或备份，也未运行服务。
- 下一步：下一步只选拟使用渠道，按同任务验证登录、续期、工具消息、取消、账单与退出；本次未执行。

**分析版本**

- **仓库**：[iJetLi/dsh-providers-hub](https://github.com/iJetLi/dsh-providers-hub)
- **版本号**：0.2.1-rc.2（[固定提交 97bc37c](https://github.com/iJetLi/dsh-providers-hub/tree/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把目录、认证、真实推理状态和聚合选择原因分开展示，减少“看见模型即可用”的误判；固定失效场景若不改善定位，就放弃。[Q03](#research-q03)

下一步只选拟使用渠道，按同任务验证登录、续期、工具消息、取消、账单与退出；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 50 | 39215 | — | — | 567032 |
| .js | source | 39 | 25822 | 12352 | 12681 | — |
| .mjs | source | 10 | 2824 | 2040 | 551 | — |
| .ts | source | 285 | 192817 | 86890 | 98315 | — |
| .ts | test | 598 | 250243 | 168974 | 62833 | — |
| .md | test | 1 | 445 | — | — | 9634 |

</details>

**活跃度**

[![Issue 未关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/iJetLi/dsh-providers-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=28&color=737b86&logo=github)](https://github.com/iJetLi/dsh-providers-hub/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 11](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=11&color=737b86&logo=github)](https://github.com/iJetLi/dsh-providers-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一账号池与本地网关如何把渠道接进DSH，异构协议和自动重试对采用有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账号、模型注册和网关怎样接成用户流程？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向已有多个编程服务账号、希望在DSH和其他兼容客户端复用接入的人，合格结果是使用预期账号与模型完成一次请求，并能解释实际扣费渠道。简单替代是分别配置官方或OpenAI兼容供应商。源码入口强制credentials、commands和llm，渠道各有适配器；本次以七牛静态Key链为代表核查：slots筛掉停用和模型限流账号，凭据从宿主credentials解析，适配器注册到llm并把请求转成带Key的HTTP调用。aggregate注册接入同一账号池和动态拒绝/允许/顺序表，网关把OpenAI请求转GenerateOptions再委托ctx.llm.stream，复用现有适配器而不另维护一份账号凭据。贡献是接入编排与统一状态，不是创造上游模型，也不能以README渠道数证明每路都可用。本次未逐个复核所有异构登录及协议，不能对它们共同作有效性保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:327-335](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L327-L335)

核心服务注入。

```text
export const name = 'codearts-auth'
// `connection` 刻意不列入静态 inject：它只由 Web bundle（dsh-client-connection）
// 提供，headless/CLI profile 里并不存在。静态 inject 会让本插件在那些 profile
// 里永久 pending，进而让整个 profile 以
// "plugin tree failed to load: 1 entry did not activate" 启动失败
// —— chicheng-cron 的 skill/agent 任务正是通过 `dsh --profile headless` 运行的，
// 会因此全部 exit 1。Jet Hub 的 RPC 端点在 Web 下通过 apply 内的可选注入挂载，
// 其余 profile 只是不注册该端点。
export const inject = ['credentials', 'commands', 'llm']
```

**依据 2 · 源码核查**：[src/index.ts:4574-4609](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L4574-L4609)

七牛slots、凭据解析与限流回写接线。

<details>
<summary>查看原文（36行）</summary>

```text
  // 服务名由 QiniuAuth 依 product.id 派生，注册为 ctx.qiniuAuth。
  const qiniu = new QiniuAuth(ctx)
  const qiniuAdapter = registerQiniuLlm(ctx, {
    // 单凭据回退 ref：池里没有 qiniu 账号时用它（与其余 provider 同约定）。
    credentialRef: credentialRef(QINIU.defaultCredentialRef),
    // 槽序列由**接线层**解析好传进来（适配器不直接读凭据）。
    // `modelId` 透传：据此过滤「该模型正处于限流窗口」的账号。
    slots: async (modelId?: string) => {
      const entries = await pool.listAccounts(QINIU.id)
      const usable = await Promise.all(entries.map(async (entry) => {
        if (!entry.enabled) return undefined
        // ⚠️ 模型级限流标记：`modelId` 缺省时**不查**（目录路径刻意不传 ——
        //    传了会让被限流的账号把整个目录一起拖空）。
        if (modelId !== undefined && modelId.length > 0) {
          const resetAt = entry.modelRateLimits?.[modelId]
          if (typeof resetAt === 'number' && resetAt > Date.now()) return undefined
        }
        const resolved = await ctx.credentials.resolve(credentialRef(entry.credentialRef))
        if (!resolved) return undefined
        try {
          const parsed = JSON.parse(resolved.value) as QiniuCredential
          if (typeof parsed.access_token !== 'string' || parsed.access_token.length === 0) return undefined
          return { id: entry.id, apiKey: parsed.access_token }
        } catch {
          return undefined
        }
      }))
      return usable.filter((s): s is { id: string; apiKey: string } => s !== undefined)
    },
    accountPool: pool,
    product: QINIU,
    // 限流标记的**写入端**。⚠️ 读端（上面 `slots()` 里的 `modelRateLimits` 判据）
    // 与写端必须成对存在 —— 只读不写 ⇒ 那段判据恒不命中（死代码）；
    // 只写不读 ⇒ 标记写进池却永远不影响选号。与 modelscope / opencode 同款。
    markLimited: async (slotId, modelId, resetAtMs) => {
      await pool.updateModelRateLimit(slotId, modelId, resetAtMs)
```

</details>

**依据 3 · 源码核查**：[src/qiniu-adapter.ts:713-735](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/qiniu-adapter.ts#L713-L735)

代表性推理HTTP调用。

<details>
<summary>查看原文（23行）</summary>

```text
  protected async *streamVia(slot: QiniuSlot, options: GenerateOptions): AsyncIterable<StreamChunk> {
    const imageUrls = await this.resolveImageUrls(options.model, options.messages)
    const messages = serializeMessages(
      options.messages as readonly { role: string; content: unknown }[],
      imageUrls,
    )
    const payload = buildQiniuPayload({
      model: normalizeQiniuModelId(options.model),
      messages,
      ...options.system !== undefined && options.system.length > 0 ? { system: options.system } : {},
      ...options.tools !== undefined ? { tools: options.tools } : {},
      ...options.temperature !== undefined ? { temperature: options.temperature } : {},
      ...options.maxTokens !== undefined ? { maxTokens: options.maxTokens } : {},
      ...options.reasoningEffort !== undefined
        ? { reasoningEffort: String(options.reasoningEffort) }
        : {},
    })
    const response = await fetch(qiniuChatUrl(this.product), {
      method: 'POST',
      headers: qiniuHeaders(slot.apiKey, 'text/event-stream'),
      body: JSON.stringify(payload),
      ...options.signal === undefined ? {} : { signal: options.signal },
    })
```

</details>

**依据 4 · 源码核查**：[src/qiniu-adapter.ts:846-853](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/qiniu-adapter.ts#L846-L853)

适配器注册到llm。

```text
export function registerQiniuLlm(
  ctx: Context,
  options: QiniuAdapterOptions,
): QiniuAdapter {
  const product = options.product ?? QINIU
  const adapter = new QiniuAdapter(options)
  registerAdapterIdempotent(ctx.llm, [product.id], adapter)
  return adapter
```

**依据 5 · 源码核查**：[src/index.ts:5879-5913](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L5879-L5913)

聚合与自动路由共享账号池/探针。

<details>
<summary>查看原文（35行）</summary>

```text
  const aggregateAdapter = registerAggregateLlm(ctx, {
    accountPool: pool,
    expiryProbe: sharedExpiryProbe,
    // ⚠️ **函数**而非快照（P2）：设置面板改了拒绝表后，**下一次请求**就要生效。
    //    传快照会让用户以为开关坏了（要重启插件才生效）。
    //    `pool.listAggregateRejections()` 返回进程内权威副本（与 state.json 同步）。
    rejections: () => pool.listAggregateRejections(),
    // ⚠️ 同样是**函数**（不是快照），理由与 `rejections` 完全相同：面板改完开关，
    //    下一次请求就要生效。三张表都是「同一枚开关的不同域」，故接线必须一起给
    //   （漏一个 ⇒ 该功能整个不生效，且**完全静默**：例如漏 `allowed` 时，
    //   用户手工打开的未接入候选仍会被判成「默认不参与」）。
    allowed: () => pool.listAggregateAllowed(),
    order: () => pool.listAggregateOrder(),
    orderMode: () => pool.listAggregateOrderMode(),
  })
  // ⚠️ 赋给上面的可变引用 ⇒ 账号入库时**也**清候选序缓存（见那里的长注释：
  //    两个缓存不同，只清折算缓存会让「刚登录的账号」在 60 秒内仍不进候选序）。
  sharedChoiceCacheRef = aggregateAdapter
  // ===== Jet Hub RPC 注册 =====
  // Jet Hub「自动」：一个 `auto` 模型名用整池，按「积分最快作废」跨 provider 选型
  // （见 `auto-adapter.ts` 模块头）。注册放在全部 provider 适配器之后：它经
  // ctx.llm 公开路径委托目标适配器，目录/凭据此时均已就绪。
  //
  // ⚠️ 位置在 `modelAdapters` 表**之前**：那张表要收它的实例（见下面的
  //    `'jet-hub-auto'` 键），而 `usage.badge` 对 `jet-hub-auto` 的改写依赖它。
  // ⚠️ 上游 `ba10f4f` 重写 aggregate 时把这条接线一并删掉了 ⇒ 旧 auto 的徽标
  //    彻底消失（用户报障 2026-10-08「也没胶囊了？」）。这里补回来。
  const autoAdapter = registerAutoLlm(ctx, {
    accountPool: pool,
    // ⚠️ **与 aggregate 共用同一个探针**（真实缺陷，对抗审计实测证伪）：
    //    不传时 `AutoAdapter` 会**自建一份**，于是有两份独立缓存 ⇒
    //    ① 同一渠道被折算两次（白打两次上游余额接口）；
    //    ② 缓存失效要清两次，漏一次就让「刚登录的账号最长 60 秒对路由不可见」。
    expiryProbe: sharedExpiryProbe,
  })
```

</details>

**依据 6 · 源码核查**：[src/openai-gateway/server.ts:600-617](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/openai-gateway/server.ts#L600-L617)

网关转换并委托llm流。

<details>
<summary>查看原文（18行）</summary>

```text
    await withRequest(request, response, async (signal) => {
      const body = await readJson(request, signal, bodyLimit)
      const route = parseModelRoute(body.model)
      const modelInfo = await resolveModelInfo(route, signal)
      const reasoningEffort = normalizeReasoningEffort(
        body.reasoning_effort, modelInfo, route.provider, route.model, (notice) => logEffortNotice(route, notice),
      )
      const requestedMaxTokens = body.max_completion_tokens ?? body.max_tokens
      const maxTokens = typeof requestedMaxTokens === 'number'
        ? normalizeMaxTokens(requestedMaxTokens, route.provider, route.model)
        : undefined
      const generate = await toGenerateOptions(body, signal, reasoningEffort, maxTokens, {
        bridge: options.attachments,
        limits: options.imageLimits,
      })
      const stream = options.llm.stream(markGatewayChannel(generate))
      const fullId = `${route.provider}/${route.model}`
      if (body.stream === true) {
```

</details>

#### 缺口

- 其他渠道的独立登录、协议转换与业务有效性没有逐路核验。
  **影响**：统一界面与代表性链路不能推出全渠道可用，采用仅观察。
  **进一步探讨**：按拟用渠道分别核对登录、凭据持久化、消息转换、取消与一次合格任务。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 选号、续期与网关鉴权如何失败和降级？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

代表性七牛链在没有槽时明确MISSING_CREDENTIAL，有chunk交付后不再换号重放；取消先上抛，请求形状和上下文超限不换号，认证/网络故障按槽尝试且最终保留原错，限流才写模型窗口。这是有价值的错误分类设计，但不能推广为其他适配器也一样。续期调度器先武装定时器、首轮生产延迟15秒，running防重入，单轮失败保留调度；账号入库还会重新武装并清缓存。调度存在不保证某渠道有refresh能力或实际续期成功。网关普通请求要求Bearer Key，OPTIONS仅预检不执行推理；默认本机地址，明确allowLan可改变监听。密钥来自环境或本地持久文件，网关初始化异常被隔离为日志，不应让所有账号功能失败。用户仍需保护本地凭据与网关Key，接口兼容不等于任意客户端语义完全一致。

#### 证据与依据

**依据 1 · 源码核查**：[src/qiniu-adapter.ts:609-666](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/qiniu-adapter.ts#L609-L666)

无账号、交付后不重放、取消和请求错误边界。

<details>
<summary>查看原文（58行）</summary>

```text
  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // ⚠️ 传 modelId：接线层据此跳过「该模型正处于限流窗口」的账号。
    const slots = await this.options.slots(options.model)
    if (slots.length === 0) {
      throw new LlmError(
        // ⚠️ 这条文案是用户**唯一**的出路（没有凭据时列表也是空的），故必须给出
        //    与控制台一致的入口：AI 大模型推理 / API Key（与 `qiniu-rpc.ts` 的报错同源）。
        'qiniu: 没有可用账号。请在 Jet Hub 的 Qiniu 面板粘贴一个 API Key'
        + '（https://portal.qiniu.com/ai-inference/api-key 创建）。',
        'MISSING_CREDENTIAL',
      )
    }

    const tried = new Set<string>()
    const limited: string[] = []

    for (;;) {
      const slot = slots.find((s) => !tried.has(s.id))
      if (slot === undefined) {
        throw new LlmError(
          `qiniu: 所有账号对该模型均受限${limited.length > 0 ? `（${limited.join('、')}）` : ''}`,
          'QUOTA_EXCEEDED',
        )
      }
      tried.add(slot.id)
      // Token 账本：回报「本笔请求实际使用的槽」。
      reportLedgerAccount(this.product.id, slot.id)

      let delivered = false
      try {
        for await (const chunk of this.streamVia(slot, options)) {
          // ⚠️ **任何 chunk 产出都算「已交付」**：`StreamChunk` 联合里没有
          // 「内容之前的前置事件」，保守取「一律算交付」—— 宁可漏掉一次可切换
          // 的机会，也绝不重放。
          delivered = true
          yield chunk
        }
        return
      } catch (error) {
        if (delivered) throw error
        if (error instanceof LlmError && error.code === 'QUOTA_EXCEEDED') throw error
        // ⚠️⚠️ **取消 / 超时必须在此立刻抛出，且排在所有分类之前**
        //    （2026-10-17 审计 P2 修复）。此前轮换循环**从不检查中止**：取消产生的
        //    `AbortError` 消息不命中任何分类关键词 ⇒ 落到兜底 `server` 分支 ⇒ 被当成
        //    「换个号再试」⇒ 取消之后**继续发请求**（实测取消后仍多打 2 次），且全池
        //    耗尽后抛 `QUOTA_EXCEEDED`「所有账号对该模型均受限」—— 用户明明点了取消，
        //    看到的却是「额度用尽」。
        //    ⚠️ 用**共享** `isAbortLike`（`aggregate-adapter.ts` 导出，仓库唯一一份）：
        //    它覆盖 `signal.aborted`、`AbortError`、`code === 'ABORTED'` 与上游 499 报文。
        if (isAbortLike(error, options.signal)) {
          throw error
        }

        const info = classifyQiniuFailure(error)
        if (info.kind === 'invalid_request') {
          // 400/422：**换号无益**（每个槽发的是同一个体，形状问题与账号无关），
          // 且七牛云对形状极严格（工具未包装事故）⇒ 带上服务端原文直接上抛。
          throw new LlmError(
```

</details>

**依据 2 · 源码核查**：[src/qiniu-adapter.ts:671-707](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/qiniu-adapter.ts#L671-L707)

认证/传输/上下文和限流不同处理。

<details>
<summary>查看原文（37行）</summary>

```text
        if (info.kind === 'auth') {
          // 认证失败：**标记并切下一个账号是对的，但不写限流标记**。
          // 也不能在试完全部槽后报「所有账号均受限」—— 真实原因通常是
          // 「这条 Key 无效」，与额度无关。故最后一次失败**直接透传原文**。
          if (tried.size >= slots.length) throw error
          limited.push(`${slot.id}(认证失败)`)
          continue
        }
        if (info.kind === 'server' || info.kind === 'transport') {
          // 上游故障/网络问题：**不写标记**（不是配额问题），只换下一个。
          this.options.warn?.(`qiniu: 账号 ${slot.id} ${info.kind}，换下一个：${info.detail}`)
          // ⚠️⚠️ **换号有意义只在「故障是账号级」时**（2026-10-17 审计 P1 修复）。
          //    本分支此前无条件 `continue` ⇒ 换号直到槽耗尽 ⇒ 兜底那段抛
          //    `QUOTA_EXCEEDED`「所有账号对该模型均受限」。⇒ ① **单账号用户**
          //    （绝大多数）看到的是「额度用尽」而真因是上游 5xx / 风控页，
          //    排障方向完全错；② 每换一个号白发一次请求。
          //    ⇒ 判据：**槽已耗尽**时把**原始错误**抛出去（保留真因与错误码）。
          if (tried.size >= slots.length) throw error
          continue
        }
        if (info.kind === 'context_window') {
          // ⚠️ **本 fork 独有**（2026-10-17 审计 P1 修复）：上下文超限**换账号也没用**
          // —— 它是**请求本身**太大，与哪个账号无关（同一长会话换 10 个号一样报错）。
          //    ⇒ 不写冷却标记、不换号，直接把原文抛出去，让宿主走溢出压缩。
          //    ⚠️ 若漏这一格会落进下面「限流/额度」默认分支 ⇒ 给账号写一个到次日
          //    UTC+8 零点的标记 ⇒ 用户只是消息太长却被封账号一整天
          //    （与 loomy 的滑动窗口缺陷同族）。
          //    ⚠️ 真机取证（2026-10-17）：模型 id 去掉组织前缀会得到
          //    **HTTP 400 `Invalid model id: DeepSeek-V4-Flash-0731`**，且该校验
          //    **发生在鉴权之前**（带合法前缀时同一请求先回 401）⇒ 这类报文是
          //    `invalid_request`（上游已有分支直接抛），不该被当成额度去换号。
          throw error
        }
        // 限流 / 额度：标记该槽后换下一个。
        const resetAtMs = Date.now() + qiniuRetryAfterMs(info.kind, info.retryAfterMs, tried.size)
        await this.options.markLimited?.(slot.id, options.model, resetAtMs)
        limited.push(`${slot.id}(${info.kind})`)
```

</details>

**依据 3 · 源码核查**：[src/refresh-scheduler.ts:190-216](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/refresh-scheduler.ts#L190-L216)

单轮防重入与失败保留。

<details>
<summary>查看原文（27行）</summary>

```text
  private async onTick(context?: { initial: boolean }): Promise<void> {
    if (this.running) {
      this.options.warn?.('[jet-hub] 上一轮续期尚未结束，跳过本轮')
      return
    }
    this.running = true
    try {
      const empty = await this.probeEmpty()
      if (empty) {
        // ⚠️ 这里**必须留痕**：issue IKJOZB 的一半伤害来自「日志无痕」——
        // 用户看到「可自动续期」却永远不续，且没有任何线索。
        // 措辞要能让人区分「正常等待」与「调度坏了」。
        this.options.info?.(
          context?.initial === true
            ? '[jet-hub] 账号池为空：续期调度器已武装并等待首个账号入库（后续每 30 分钟复查）'
            : '[jet-hub] 账号池仍为空，本轮无可续期账号（调度器保持武装）',
        )
      }
      await this.options.refresh()
    } catch (error) {
      this.options.warn?.(
        `[jet-hub] 一轮续期失败（调度器保持武装，下轮重试）：`
        + `${error instanceof Error ? error.message : String(error)}`,
      )
    } finally {
      this.running = false
    }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:5229-5252](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L5229-L5252)

生产续期延迟及启动失败日志。

<details>
<summary>查看原文（24行）</summary>

```text
  const refreshScheduler = new MultiAccountRefreshScheduler({
    refresh: refreshAllCredentials,
    intervalMs: REFRESH_INTERVAL_MS,
    /**
     * 首轮延后 15s（issue #20）：宿主启动时插件并发初始化，立即对全量账号
     * 发续期会和启动路径抢网络/凭据存储，日志里常见一串冷启动 `fetch failed`。
     * 周期定时器仍然立刻武装；只有首轮让路。
     */
    initialDelayMs: 15_000,
    isPoolEmpty: async () => (await pool.listAllAccounts()).length === 0,
    // ⚠️ 可选链：`logger` 在极简 profile 下可能缺席，而日志不该成为续期的
    // 单点故障（与仓库既有的 `ctx.logger?.warn?.()` 一致）。
    info: (message) => ctx.logger?.info?.(message),
    warn: (message) => ctx.logger?.warn?.(message),
  })
  // ⚠️ 不 await：`apply()` 是同步函数，而 `start()` 内含首轮续期（会发网络请求，
  // 可达数十秒）。阻塞在这里会让插件启动卡住（与 opencode 能力预热同款约定）。
  void refreshScheduler.start().catch((error: unknown) => {
    // 走到这里说明 `refresh()` 或订阅通知本身出了意料之外的异常；`onTick`
    // 内部已消化常规失败，故这条只是最后一道可观测性兜底。
    ctx.logger?.warn?.(
      `[jet-hub] 多账号续期调度器启动失败（本次会话不会自动续期）：`
      + `${error instanceof Error ? error.message : String(error)}`,
    )
```

</details>

**依据 5 · 源码核查**：[src/index.ts:5280-5289](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L5280-L5289)

入库通知和卸载清理。

<details>
<summary>查看原文（10行）</summary>

```text
  let sharedChoiceCacheRef: { clearChoiceCache: () => void } | undefined
  const unsubscribeAccountAdded = pool.onAccountAdded(() => {
    refreshScheduler.notifyAccountAdded()
    // ⚠️ 未定义时什么都不做（订阅可能在它们建好前就触发 —— 那是正常时序）。
    sharedExpiryProbeRef?.clear()
    sharedChoiceCacheRef?.clearChoiceCache()
  })
  ctx.effect(() => () => {
    unsubscribeAccountAdded()
    refreshScheduler.stop()
```

</details>

**依据 6 · 源码核查**：[src/openai-gateway/server.ts:744-777](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/openai-gateway/server.ts#L744-L777)

预检、鉴权与推理路由。

<details>
<summary>查看原文（34行）</summary>

```text
  const requestHandler = (request: IncomingMessage, response: ServerResponse): void => {
    if (request.method === 'OPTIONS') {
      response.writeHead(204, {
        'access-control-allow-origin': '*',
        'access-control-allow-headers': 'Authorization, Content-Type',
        'access-control-allow-methods': 'GET, POST, OPTIONS',
      })
      response.end()
      return
    }
    if (!authorized(request, key)) {
      jsonResponse(response, 401, { error: { message: 'Missing or invalid API key', type: 'authentication_error', code: 'invalid_api_key' } })
      return
    }
    const path = new URL(request.url ?? '/', 'http://127.0.0.1').pathname
    if (path === '/v1/models' && request.method === 'GET') {
      void handleModels(response).catch(error => jsonResponse(response, 502, { error: { message: String(error), type: 'server_error', code: 'model_list_failed' } }))
      return
    }
    // 本网关特有的只读端点：思考档位对照表（见 handleReasoningEfforts 的理由）。
    // ⚠️ 路径不放在 `/v1/models/…` 之下：客户端会把那些路径当模型 ID 解析。
    if (path === '/v1/reasoning-efforts' && request.method === 'GET') {
      void handleReasoningEfforts(response).catch(error => jsonResponse(response, 502, { error: { message: String(error), type: 'server_error', code: 'model_list_failed' } }))
      return
    }
    if ((path === '/v1/chat/completions' || path === '/v1/responses') && request.method === 'POST') {
      if (!request.headers['content-type']?.toLowerCase().startsWith('application/json')) {
        jsonResponse(response, 415, { error: { message: 'Content-Type must be application/json', type: 'invalid_request_error', code: 'invalid_content_type' } })
        return
      }
      void (path === '/v1/responses' ? handleResponses(request, response) : handleChat(request, response))
      return
    }
    jsonResponse(response, 404, { error: { message: 'Not found', type: 'invalid_request_error', code: 'not_found' } })
```

</details>

**依据 7 · 源码核查**：[src/openai-gateway/config.ts:424-444](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/openai-gateway/config.ts#L424-L444)

显式局域网监听条件。

<details>
<summary>查看原文（21行）</summary>

```text
export function resolveGatewayConfig(
  env: NodeJS.ProcessEnv = process.env,
  options: ResolveGatewayConfigOptions = {},
): OpenAiGatewayConfig {
  const host = resolveHost(env)
  const rawPort = env.DSH_OPENAI_GATEWAY_PORT
  const port = (() => {
    if (rawPort === undefined || rawPort.trim() === '') return DEFAULT_GATEWAY_PORT
    const parsed = Number.parseInt(rawPort, 10)
    if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535 || String(parsed) !== rawPort.trim()) {
      throw new Error('DSH_OPENAI_GATEWAY_PORT 必须是 1 到 65535 之间的整数')
    }
    return parsed
  })()
  // 「允许局域网访问」开关：仅当 env 没有显式给 host 时生效（env 优先）。
  // ⚠️ 刻意放在 resolveHost 之后：env 里的通配值仍会被闸门拒绝——开关只能
  // **显式**选择通配，不能让任何字符串解析链「顺便」通配。
  if (options.allowLan === true && !isGatewayHostFromEnv(env)) {
    return { host: WILDCARD_GATEWAY_HOST, port }
  }
  return { host, port }
```

</details>

**依据 8 · 源码核查**：[src/openai-gateway/index.ts:53-104](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/openai-gateway/index.ts#L53-L104)

网关异常隔离于主插件。

<details>
<summary>查看原文（52行）</summary>

```text
export function mountOpenAiGateway(ctx: Context, pool?: GatewaySwitchSource): void {
  const logger: GatewayLogger = {
    info: (message) => ctx.logger?.info?.(message),
    warn: (message) => ctx.logger?.warn?.(message),
    error: (message) => ctx.logger?.error?.(message),
  }
  const describe = (error: unknown): string => (error instanceof Error ? error.message : String(error))

  try {
    // 设置页里的开关是**期望状态**：缺键 / 读取失败一律按启用（老用户行为不变），
    // 真正的判定（含 env 的更高优先级）在 runtime 里做。
    setGatewayDesiredEnabled(pool?.gatewayEnabled() !== false)
    // 「允许局域网访问」同理：缺键 / 缺方法 / 读取失败一律按关闭（安全默认）。
    setGatewayDesiredAllowLan(pool?.gatewayAllowLan?.() === true)
    registerGatewayFactory(() => {
      // 工厂在**收敛时**才被调用（可能是设置页在运行期触发的启动），
      // 故同步异常必须在这里就地消化 —— 见 `GatewayFactory` 的契约。
      try {
        return createOpenAiGateway({
          ctx,
          llm: ctx.llm as unknown as LlmRuntimeLike,
          // 图片入站：把客户端的 base64 图片落成 DSH 附件。缺失时网关仍可正常
          // 提供文本能力，收到图片时明确报「未装载附件服务」而非静默丢图。
          attachments: makeGatewayAttachmentBridge(ctx),
          home: resolveJetHubHome(ctx),
          logger,
          // ⚠️⚠️ 必须读 **runtime 的当前期望状态**（`gatewayDesiredAllowLan()`），
          // 不能读 pool 的持久化副本：收敛判据用的是前者，两处不同源时会出现
          // 「收敛判 allowLan=true、工厂却拿 false 重建」⇒ 地址不变 ⇒ 收敛判
          // 永远失配 ⇒ **每次收敛都反复重建**（运行期翻开关的必现死循环）。
          // 单一来源 = 期望状态本身；pool 只在 mount 时镜像进期望状态，
          // RPC 翻转时两侧一起写。
          allowLan: gatewayDesiredAllowLan(),
        })
      } catch (error) {
        logger.error(`[openai-gateway] 初始化失败，本机网关未启动：${describe(error)}`)
        return undefined
      }
    })
  } catch (error) {
    // 配置非法或 key 无法持久化：网关不可用，但插件其余功能必须照常工作。
    logger.error(`[openai-gateway] 初始化失败，本机网关未启动：${describe(error)}`)
    return
  }

  // 端口冲突等启动期失败由 runtime 内部消化（不抛），不阻断 Desktop 其它功能。
  if (!isGatewayEnabled(process.env)) {
    // 显式停用也要留痕：否则用户设了 env 却看不到任何提示，只能靠猜。
    // 仍继续挂载 runtime —— 设置页需要据此显示「被 env 阻止」而不是「开关坏了」。
    logger.info('[openai-gateway] DSH_OPENAI_GATEWAY_ENABLED 已停用本机网关')
  }
  void applyGatewayDesiredState().catch((error: unknown) => {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 成本、观察建议与可证伪改进是什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

当前宜供能管理凭据和排查协议的维护者观察，尚不足给多渠道自动路由作日常采用推荐。首次可能需要源码构建、匹配peer服务、逐渠道账号与网关客户端配置；持续有模型账单、续期/目录请求、账号维护及服务协议变化成本，不能因积分领取或本机网关叫“免费”。失败后要分清请求坏、凭据坏、限流和上游网络问题，停用聚合与网关可回到原供应商直接配置，但既有账号与Key需单独核对。由“目录不证明推理”和多槽错误分类可推导未验证假设：把每路最近一次真实推理、认证和目录状态分开显示，并在聚合选择时记录原因，可减少看到模型却用不了的误判。以一组失效Key、目录可读和限流槽对比现界面与分离状态，若排障错误或人工时间不减少，就否定该设计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:100-111](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/README.md#L100-L111)

作者说明git安装构建与包管理器条件。

<details>
<summary>查看原文（12行）</summary>

```text
### 方式一：从 git 仓库安装（推荐）

`add` 以 git 仓库方式安装（pnpm 内部走 `git+https:` 协议），会运行本包的 `prepare`
脚本自动构建 `lib/`，无需手动 `pnpm build`。

⚠️ `prepare` **不依赖任何包管理器**（它直接内联 `tsc` / `node`）：pnpm 在 clone
目录里跑 `prepare` 时，**pnpm 10 / 11 不会把 npm 注入 PATH**（只有 pnpm ≥ 12 会）
⇒ 若 `prepare` 里写 `npm run …`，那两代上安装会直接失败。

⚠️ pnpm 10 起会拦截依赖的构建脚本，必须先在 profile 的 `pnpm-workspace.yaml`
（路径形如 `~/.dsh/profiles/<name>/pnpm-workspace.yaml`）里放行；而**放行键的写法
在 pnpm 10 与 pnpm 11 之间互不兼容**，写错就装不上。
```

</details>

**依据 2 · 源码核查**：[package.json:103-115](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/package.json#L103-L115)

宿主peer和网络依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/dsh-commands": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.2",
    "@deepseek-ai/dsh-credentials": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": "^0.1.2-rc.1 || ^0.1.7-rc.2 || ^0.2.0-rc.1 || ^0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.4"
  },
  "dependencies": {
    "@deepseek-ai/cosmokit": "^1.8.5",
    "@deepseek-ai/schemastery": "^3.18.4",
    "jose": "^6.1.3",
    "undici": "^8.11.2",
    "wreq-js": "^3.2.0"
```

</details>

**依据 3 · 作者声明**：[src/index.ts:4563-4572](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/index.ts#L4563-L4572)

作者源码说明目录可读不证明凭据有效。

<details>
<summary>查看原文（10行）</summary>

```text
  // ===== 七牛云 AI（Qiniu）—— **本 fork 独有** =====
  //
  // 与 modelscope **同格**：OpenAI 兼容协议 + 长期有效的静态 API Key ⇒ 无 OAuth、
  // 无 refresh 端点、无余额端点（`credits.balance: false`）。故整套实现是
  // modelscope 范式的逐字镜像（`src/qiniu-*.ts` 七个文件）。
  //
  // ⚠️ 与 modelscope 的**唯一实质差异**：`slots()` 里模型级限流判据完全一致，但
  //    `fetchRemoteCatalog` 打在 `/v1/models` 上 —— 该端点**实测免鉴权也回 200**
  //    ⇒ 「目录能读到」**不构成**凭据有效的证据（本仓库对这条一贯的要求，
  //    见 officeace / opencode 的登记）。凭据有效性只由推理请求的真实结果判定。
```

</details>

**依据 4 · 源码核查**：[src/qiniu-adapter.ts:609-630](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/qiniu-adapter.ts#L609-L630)

实际推理链无可用槽/额度错误。

<details>
<summary>查看原文（22行）</summary>

```text
  async *stream(options: GenerateOptions): AsyncIterable<StreamChunk> {
    // ⚠️ 传 modelId：接线层据此跳过「该模型正处于限流窗口」的账号。
    const slots = await this.options.slots(options.model)
    if (slots.length === 0) {
      throw new LlmError(
        // ⚠️ 这条文案是用户**唯一**的出路（没有凭据时列表也是空的），故必须给出
        //    与控制台一致的入口：AI 大模型推理 / API Key（与 `qiniu-rpc.ts` 的报错同源）。
        'qiniu: 没有可用账号。请在 Jet Hub 的 Qiniu 面板粘贴一个 API Key'
        + '（https://portal.qiniu.com/ai-inference/api-key 创建）。',
        'MISSING_CREDENTIAL',
      )
    }

    const tried = new Set<string>()
    const limited: string[] = []

    for (;;) {
      const slot = slots.find((s) => !tried.has(s.id))
      if (slot === undefined) {
        throw new LlmError(
          `qiniu: 所有账号对该模型均受限${limited.length > 0 ? `（${limited.join('、')}）` : ''}`,
          'QUOTA_EXCEEDED',
```

</details>

**依据 5 · 源码核查**：[src/openai-gateway/index.ts:53-104](https://github.com/iJetLi/dsh-providers-hub/blob/97bc37c47cf3616b0de5330fd1a1968d0b8fd8f9/src/openai-gateway/index.ts#L53-L104)

网关可独立降级。

<details>
<summary>查看原文（52行）</summary>

```text
export function mountOpenAiGateway(ctx: Context, pool?: GatewaySwitchSource): void {
  const logger: GatewayLogger = {
    info: (message) => ctx.logger?.info?.(message),
    warn: (message) => ctx.logger?.warn?.(message),
    error: (message) => ctx.logger?.error?.(message),
  }
  const describe = (error: unknown): string => (error instanceof Error ? error.message : String(error))

  try {
    // 设置页里的开关是**期望状态**：缺键 / 读取失败一律按启用（老用户行为不变），
    // 真正的判定（含 env 的更高优先级）在 runtime 里做。
    setGatewayDesiredEnabled(pool?.gatewayEnabled() !== false)
    // 「允许局域网访问」同理：缺键 / 缺方法 / 读取失败一律按关闭（安全默认）。
    setGatewayDesiredAllowLan(pool?.gatewayAllowLan?.() === true)
    registerGatewayFactory(() => {
      // 工厂在**收敛时**才被调用（可能是设置页在运行期触发的启动），
      // 故同步异常必须在这里就地消化 —— 见 `GatewayFactory` 的契约。
      try {
        return createOpenAiGateway({
          ctx,
          llm: ctx.llm as unknown as LlmRuntimeLike,
          // 图片入站：把客户端的 base64 图片落成 DSH 附件。缺失时网关仍可正常
          // 提供文本能力，收到图片时明确报「未装载附件服务」而非静默丢图。
          attachments: makeGatewayAttachmentBridge(ctx),
          home: resolveJetHubHome(ctx),
          logger,
          // ⚠️⚠️ 必须读 **runtime 的当前期望状态**（`gatewayDesiredAllowLan()`），
          // 不能读 pool 的持久化副本：收敛判据用的是前者，两处不同源时会出现
          // 「收敛判 allowLan=true、工厂却拿 false 重建」⇒ 地址不变 ⇒ 收敛判
          // 永远失配 ⇒ **每次收敛都反复重建**（运行期翻开关的必现死循环）。
          // 单一来源 = 期望状态本身；pool 只在 mount 时镜像进期望状态，
          // RPC 翻转时两侧一起写。
          allowLan: gatewayDesiredAllowLan(),
        })
      } catch (error) {
        logger.error(`[openai-gateway] 初始化失败，本机网关未启动：${describe(error)}`)
        return undefined
      }
    })
  } catch (error) {
    // 配置非法或 key 无法持久化：网关不可用，但插件其余功能必须照常工作。
    logger.error(`[openai-gateway] 初始化失败，本机网关未启动：${describe(error)}`)
    return
  }

  // 端口冲突等启动期失败由 runtime 内部消化（不抛），不阻断 Desktop 其它功能。
  if (!isGatewayEnabled(process.env)) {
    // 显式停用也要留痕：否则用户设了 env 却看不到任何提示，只能靠猜。
    // 仍继续挂载 runtime —— 设置页需要据此显示「被 env 阻止」而不是「开关坏了」。
    logger.info('[openai-gateway] DSH_OPENAI_GATEWAY_ENABLED 已停用本机网关')
  }
  void applyGatewayDesiredState().catch((error: unknown) => {
```

</details>

#### 缺口

- 无逐渠道当前费用、账号资格与合格任务结果。
  **影响**：无法判断整体稳定性或单位任务总成本，也不推荐自动路由日常采用。
  **进一步探讨**：选择实际需要的一路，在授权账号下记录请求结果、账单、续期和退出；其余保持关闭。
- 分离状态与选择原因展示的假设未验证。
  **影响**：不能断言它已降低排障负担。
  **进一步探讨**：固定失效场景对照界面，观察定位准确率和人工时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
