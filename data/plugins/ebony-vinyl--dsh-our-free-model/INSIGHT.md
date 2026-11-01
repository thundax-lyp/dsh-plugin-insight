# Our Free Model

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[999e9f7](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/999e9f784ea3ea7a11cae383b142697b1ff2c42f)

<!-- BEGIN META -->
[![GitHub ★ 54,137](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54%2C137&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Ebony-Vinyl/dsh-our-free-model)
<!-- END META -->

> **功能**：为 DSH 提供免费模型、账户渠道和自带密钥提供者的统一模型接入。

> **亮点**：[Q02](#research-q02) 将匿名、账户和自带密钥渠道纳入统一模型选择并提供受限降级，相对手工逐个切换具有可解释的流程增量；不证明所有渠道免费或稳定。

> **主要限制**：[Q03](#research-q03) 的免费识别依赖名称规则，且作者记录 429；实际限额、费用和隐私由上游决定，不能把目录标签视为担保。

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
  - [Q01 · 面向谁，如何注册及依赖什么？](#detail-section-11)
  - [Q02 · 从注册到模型请求与结果的真实链是什么？](#detail-section-12)
  - [Q03 · 费用、认证、服务故障和隐私边界是什么？](#detail-section-13)
  - [Q04 · 成本与效果、未验证假设是什么？](#detail-section-14)
  - [Q05 · 谁可试用、何时退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向需要尝试多个模型渠道的 DSH 用户；合格任务需明确供应商、费用与结果。

用户可直接配置官方模型提供者和端点；统一入口的真实质量及成本尚未同任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 模型适配器 | 在 DSH 选择并调用模型 | 需要 llm 服务和上游可用 |
| 组合路由 | 在条件允许时切换候选 | 已提交答案后不再透明切换 |
| 匿名免费车道 | 访问免费标识的上游模型 | 默认 OpenCode inference 依赖本地 Bun，额度和政策由上游决定 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm 服务 | 必需 | 注册模型适配器 | 插件模型车道无法注册 |
| 本地 Bun | 默认 OpenCode 免费推理需要 | 执行上游传输 | 缺失时报配置错误，Node 诊断回退不保证可用 |
| 上游网络与政策 | 所选车道必需 | 提供模型响应 | 限额、拒绝或断网导致失败 |
| 密钥或账号 | 特定渠道需要 | 对应供应商认证 | 不可调用该渠道，费用按供应商而定 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对供应商政策、Bun 与隔离配置 | 确认数据接收方和额度 |
| 加载 | 宿主注册适配器并刷新目录 | 选定模型出现在对应路线 |
| 任务 | 用户用脱敏输入调用单一模型 | 检查完整输出与错误 |
| 失败 | 用户停止或切回已知端点 | 避免重复有副作用的工具 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装、本地 Bun 和网络资源 | 检查供应商条款和配置 | 时间未知，其他渠道可能收费 |
| 持续使用 | 上游调用、网络和本地进程 | 复核答案与政策变化 | 费用和质量未知 |
| 失败恢复 | 重试及替代服务费用 | 排查限额和核对副作用 | 成功率与耗时未知 |
| 退出 | 迁移到已知端点的资源 | 移除配置并核对数据 | 历史及上游留存不由插件保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 模型接入 | 适配器注册和上游调用路径 | 当前模型可用及质量 |
| 路由 | 答案提交前有候选推进条件 | 每次故障均恢复或免费 |

> **思考**：[Q03](#research-q03) 的免费识别依赖名称规则，且作者记录 429；实际限额、费用和隐私由上游决定，不能把目录标签视为担保。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将匿名、账户和自带密钥渠道纳入统一模型选择并提供受限降级，相对手工逐个切换具有可解释的流程增量；不证明所有渠道免费或稳定。

[Q02](#research-q02) 冻结快照并限制候选提交边界；[Q03](#research-q03) 显示依赖外部服务与本地传输，按 ID 识别免费不能替代计费及隐私核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的免费识别依赖名称规则，且作者记录 429；实际限额、费用和隐私由上游决定，不能把目录标签视为担保。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议在确认供应商政策后以脱敏内容试单车道；数据去向不明、限额或工具异常时停止并切回已知官方端点。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持统一目录、流分派与有条件降级；免费、可用性和数据政策取决于外部服务。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、src/adapter.js、src/http.js、src/egress.js、src/bun-fetch.js、src/catalog.js、docs/oc-free-transport.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只检查 DSH 匿名车道、适配器和组合路径的关键源码；未审计各账号渠道、所有工具、服务条款或外部服务。
- 下一步：在核实上游条款后固定宿主、模型、网络和输入，检查目录、流、限额、工具边界及费用；不使用敏感数据。

**分析版本**

- **仓库**：[Ebony-Vinyl/dsh-our-free-model](https://github.com/Ebony-Vinyl/dsh-our-free-model)
- **版本号**：2.8.0（[固定提交 999e9f7](https://github.com/Ebony-Vinyl/dsh-our-free-model/tree/999e9f784ea3ea7a11cae383b142697b1ff2c42f)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设组合请求前展示每个候选的数据接收方和费用状态可减少误路由，须测识别正确率、耗时及信息过期，尚未验证。

在核实上游条款后固定宿主、模型、网络和输入，检查目录、流、限额、工具边界及费用；不使用敏感数据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 99 | 36874 | 26723 | 8717 | — |
| .md | source | 94 | 8207 | — | — | 153412 |
| .mjs | source | 209 | 110064 | 96112 | 12496 | — |
| .tsx | source | 18 | 2289 | 2175 | 41 | — |
| .ts | source | 2 | 148 | 144 | 0 | — |
| .md | example | 1 | 8 | — | — | 159 |
| .mjs | example | 2 | 1551 | 1126 | 358 | — |

</details>

**活跃度**

[![Issue 未关闭 81](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=81&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 427](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=427&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 351](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=351&color=737b86&logo=github)](https://github.com/Ebony-Vinyl/dsh-our-free-model/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确定固定版本免费模型提供者如何接入 DSH、选择并发送请求，以及账户、收费和失败边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 面向谁，如何注册及依赖什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

它是 DSH 模型提供者插件，适合希望在模型选择器中尝试匿名免费车道、其他账户渠道或自带密钥端点的用户。合格结果是明确实际供应商和政策后，完成一次符合要求的任务；列出模型不等于它当前可调用。根包的入口是 index.js，源码声明 llm 为硬依赖并注册两个模型适配路线。作者宣称匿名车道无需账号或密钥；固定版本的传输说明却要求 OpenCode 免费推理默认使用独立 Bun，可切回 Node 但不保证上游接收。其他聚合和账户渠道的认证与费用不同，不能把匿名车道的描述推广到全部模型。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-20](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/package.json#L1-L20)

包入口和固定版本。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "dsh-our-free-model",
  "version": "2.8.0",
  "private": true,
  "type": "module",
  "description": "Our Free Model — 在 dsh 里装上这个插件即可，无需登录、注册或填 API Key，就能使用包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型，桌面端另有 EAC 协付渠道；2.0 起接入 LobsterAI、Qoder、TRAE、Cline、Loomy、Raccoon、MiniMax、ZCode、Gemini 十个账号渠道（原有匿名免费通道保留）（登录、账号池、积分领取、本地 OpenAI 网关与局域网转发、数据看板与运行日志），六页毛玻璃界面统一呈现。",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Ebony-Vinyl/dsh-our-free-model.git"
  },
  "homepage": "https://github.com/Ebony-Vinyl/dsh-our-free-model",
  "bugs": {
    "url": "https://github.com/Ebony-Vinyl/dsh-our-free-model/issues"
  },
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
```

</details>

**依据 2 · 源码核查**：[index.js:109-113](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/index.js#L109-L113)

llm 是硬依赖。

```text
 * - `connection`, `attachments` — one feature each: the fence falls back to its
 *   structural replica, image blocks to the text projection. Both are read with
 *   `ctx.get()`, which is the opportunistic lookup that answers `undefined`.
 */
export const inject = ['llm']
```

**依据 3 · 源码核查**：[index.js:432-449](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/index.js#L432-L449)

模型 runtime 与两条路由注册。

<details>
<summary>查看原文（18行）</summary>

```text
  const modelRuntime = createModelRuntime({
    ...stores,
    logger,
    subscriptionRuntime,
    attributionUserAgent: 'deepseek-harness',
    resolveImage: imageResolver(ctx, logger),
    sealedCredential: sealedCredentialOf,
    onSealedUnavailable: () => logger.warn?.('our-free-model: the sealed lane is not available in this composition (no recognized host profile); its models stay hidden'),
    onTopology: () => emitTopology(),
  })
  const { state, adapter, refreshCatalog, refreshAvailability, watchEgress, fetchListing, publicModelRows, syncAggregateCatalog } = modelRuntime
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
```

</details>

**依据 4 · 作者声明**：[README.md:23-30](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/README.md#L23-L30)

作者免费和无需密钥的主张。

```text
> 你只需在 dsh 里装上这个插件，无需登录、注册、填 API Key 或任何其它操作，
> 就能用上包括 DeepSeek V4.1 Flash、Kimi K3 在内的前沿模型——完全免费，不限量。
>
> *All you do is install this plugin in dsh: no login, no sign-up, no API key, nothing
> else. The frontier models are just there — DeepSeek V4.1 Flash, Kimi K3 and the rest.
> Free, with no usage cap.*
>
> 模型清单跟随上游刷新，可用性由**你自己这台机器的网络出口**实测得出，
```

**依据 5 · 作者声明**：[docs/oc-free-transport.md:13-20](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/docs/oc-free-transport.md#L13-L20)

默认 Bun 传输要求和 Node 回退。

```text
## Runtime prerequisite

Install Bun independently or point `OUR_FREE_MODEL_BUN` at a native Bun executable. Nothing is downloaded by this plugin. Discovery checks the explicit path, `BUN_INSTALL/bin`, `~/.bun/bin`, PATH, and the Windows npm Bun executable directory. Windows `.cmd` and `.ps1` shell shims are not executed as subprocess binaries.

`OUR_FREE_MODEL_FREE_TRANSPORT` accepts:

- `auto` (default) / `bun`: use the native Bun worker for official OC inference. If Bun is absent, report a transport configuration error.
- `node`: restore the previous Node transport for diagnosis/rollback. This does not guarantee upstream acceptance.
```

#### 缺口

- 当前地区、出口、上游策略与模型可用性
  **影响**：模型能否完成真实任务及收费条件不确定
  **进一步探讨**：先查上游政策，再用脱敏小请求核对模型和响应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从注册到模型请求与结果的真实链是什么？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

插件创建模型 runtime，将 adapter 注册给宿主 llm；prepareCall 固定目录状态快照并将调用绑定到 stream。stream 依据目录条目选择单模型或组合路由。单模型根据车道选择对应传输，匿名车道经 postStreamed 将序列化请求发送到上游并按响应体解析流；OpenCode inference 的 egress 默认通过本地 Bun 子进程。流的结果转换为宿主增量、用量及结束状态。组合路线在首个可提交答案前缓冲输出，可在允许推进的失败后尝试下一候选；一旦输出已提交就不再透明切换。相对手工逐个配置端点，它提供统一目录与受限降级，但端点数据仍发往各上游，不能推断模型质量、稳定性或免费额度。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:432-449](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/index.js#L432-L449)

构建并注册 llm adapter。

<details>
<summary>查看原文（18行）</summary>

```text
  const modelRuntime = createModelRuntime({
    ...stores,
    logger,
    subscriptionRuntime,
    attributionUserAgent: 'deepseek-harness',
    resolveImage: imageResolver(ctx, logger),
    sealedCredential: sealedCredentialOf,
    onSealedUnavailable: () => logger.warn?.('our-free-model: the sealed lane is not available in this composition (no recognized host profile); its models stay hidden'),
    onTopology: () => emitTopology(),
  })
  const { state, adapter, refreshCatalog, refreshAvailability, watchEgress, fetchListing, publicModelRows, syncAggregateCatalog } = modelRuntime
  const runForwarded = modelRuntime.complete

  // ── registration ────────────────────────────────────────────────────────────
  const routes = () => Object.keys(state().membership)
  const registration = ctx.llm.registerAdapter([ROUTE_MAIN, ROUTE_REGION], adapter)
  ctx.llm.registerConfigurableProviders?.([
    { provider: ROUTE_MAIN, displayName: ROUTE_LABELS[ROUTE_MAIN], settingsNs: ctx.fiber?.entry?.options?.id ?? name, settingsPath: [] },
```

</details>

**依据 2 · 源码核查**：[src/adapter.js:194-218](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L194-L218)

固定目录状态并进入流。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Bind model metadata and the dispatch closure to one state snapshot, so a
   * catalog refresh arriving mid-turn cannot mix one generation's capacities
   * with another's endpoint table.
   */
  async prepareCall(provider, model) {
    const snapshot = this.deps.state()
    const entry = snapshot.catalog.find(candidate => candidate.id === baseModelId(model)) ?? null
    return {
      model: await this.resolveModel(provider, model),
      stream: options => this.stream(options, entry, snapshot),
    }
  }

  /**
   * @param {object} options - GenerateOptions
   * @param {object|null} pinned - catalog row frozen by `prepareCall`, if any
   * @param {object} [snapshot] - state generation frozen by `prepareCall`
   */
  stream(options, pinned, snapshot = this.deps.state()) {
    const controller = new AbortController()
    const onAbort = () => controller.abort(options.signal?.reason)
    if (options.signal?.aborted === true) onAbort()
    else options.signal?.addEventListener('abort', onAbort, { once: true })
    const iterator = this.runStream({ ...options, signal: controller.signal }, pinned, snapshot)
```

</details>

**依据 3 · 源码核查**：[src/adapter.js:247-254](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L247-L254)

选择组合或单模型。

```text
  async * runStream(options, pinned, snapshot) {
    const modelId = baseModelId(options.model)
    const entry = pinned ?? snapshot.catalog.find(candidate => candidate.id === modelId) ?? null
    if (entry !== null && isComboEntry(entry)) {
      yield * this.runCombo(options, entry, snapshot)
      return
    }
    yield * this.runSingle(options, entry, snapshot, {})
```

**依据 4 · 源码核查**：[src/adapter.js:271-329](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L271-L329)

组合缓冲、提交及候选耗尽路径。

<details>
<summary>查看原文（59行）</summary>

```text
  async * runCombo(options, entry, snapshot) {
    const settings = snapshot.settings ?? {}
    const started = Date.now()
    const rejectedTurn = attempts => {
      this.deps.recordTurn?.({ at: started, model: entry.id, ok: false, recovered: false, attempts, origin: 'harness' })
    }
    if (settings.enabled === false) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: 'our free model is switched off in its settings page', code: 'CONFIG_DISABLED' } } }
      return
    }
    const candidates = comboChain(entry, snapshot.catalog, snapshot.routing ?? {})
    if (candidates.length === 0) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = committed ? await iterator.next() : await nextOrSilence(iterator, CHAIN_SILENCE_MS)
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
    }
    rejectedTurn(candidates.length)
    yield { type: 'finish', reason: { kind: 'error', failure: {
      message: `the chain "${entry.name}" exhausted every candidate: ${tried.join('; ')}`,
```

</details>

**依据 5 · 源码核查**：[src/adapter.js:510-533](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L510-L533)

按车道调用不同传输，包括匿名 postStreamed。

<details>
<summary>查看原文（24行）</summary>

```text
        controller.abort()
      }, timeoutMs) : undefined
      timer?.unref?.()
      const channel = createChannel()
      const request = (sealed
        ? postSealedTurn(this.deps, payload, controller.signal, value => channel.push(value))
        : kilo
          ? postKiloStreamed({ body: payload, signal: controller.signal, onData: value => channel.push(value) })
          : aggregate
            ? postAggregateStreamed({
              config: settings.aggregate ?? {},
              providerId: entry.providerId,
              modelId: entry.modelId,
              body: payload,
              session,
              signal: controller.signal,
              onData: value => channel.push(value),
            })
            : postStreamed({
          path: endpointFor(entry.id), body: payload, session,
          attributionUserAgent: snapshot.attributionUserAgent,
          signal: controller.signal,
          onData: value => channel.push(value),
        }))
```

</details>

**依据 6 · 源码核查**：[src/http.js:421-459](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/http.js#L421-L459)

上游 POST、错误分类及流解析。

<details>
<summary>查看原文（39行）</summary>

```text
export async function postStreamed({ path, body, session, attributionUserAgent, signal, onData, timeoutMs = 300000 }) {
  // The Messages wire carries the 2.x client's beta header (o2a/headers.js);
  // the path is the only wire signal this layer sees.
  const headers = gatewayHeaders({ session: truncateSession(session), stream: true, anthropic: path.includes('/messages') })
  headers['user-agent'] = userAgentWith(attributionUserAgent)
  let response
  try {
    response = await egressFetch(`${UPSTREAM_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body), redirect: 'error', signal })
  } catch (error) {
    // The signal's own reason is what fetch rejects with, and Node's is a
    // `TimeoutError`/user Error rather than `AbortError` — testing the name alone
    // reported a cancelled turn as `TRANSPORT`, which is retryable.
    if (signal?.aborted === true || error?.name === 'AbortError') throw new UpstreamError('request aborted', CODE.aborted)
    throw new UpstreamError(`our-free-model: upstream request failed: ${error?.message ?? error}${transportCause(error)}`, CODE.transport)
  }

  const setRetry = retryAfter(response.headers.get('retry-after'))
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    // An empty 5xx body is the case #549 is about: there is no envelope to
    // classify, and `HTTP 502` is not an answer the caller can act on.
    if (text.trim() === '' && response.status >= 500) {
      throw emptyBodyFailure(response.status, setRetry, carriesImageContent(body))
    }
    let payload
    try { payload = JSON.parse(text) } catch { payload = { error: { message: text.slice(0, 300) || `HTTP ${response.status}` } } }
    throw classifyFailure(response.status, payload, setRetry)
  }
  if (response.body === null) throw new UpstreamError('our-free-model: upstream returned no body', CODE.empty)

  // `Content-Type` is a hint, not a verdict: take the first bytes and let the body
  // say what it is. Whatever was spent reading them is replayed in front of the
  // stream, so nothing is buffered away and no frame is dropped.
  const head = await readHead(response.body, SNIFF_BYTES, { signal, timeoutMs })
  const shape = sniffBody(head.text)
  if (shape === 'empty') throw new UpstreamError('our-free-model: upstream returned no body', CODE.empty)
  if (shape === 'sse') {
    await readSse(replayStream(head), onData, signal, timeoutMs)
    return { status: response.status, headers: response.headers }
```

</details>

**依据 7 · 源码核查**：[src/egress.js:108-126](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/egress.js#L108-L126)

OpenCode inference 默认选择 Bun。

<details>
<summary>查看原文（19行）</summary>

```text
  const targetUrl = new URL(url instanceof Request ? url.url : String(url))
  // Only the official OC inference lane uses Bun. Kilo/EAC/catalogs and local
  // test endpoints keep their existing fetch path. Never retry a failed turn
  // through a second transport: a prior request may already have spent tokens.
  const officialFreeLane = targetUrl.protocol === 'https:' && targetUrl.hostname === 'opencode.ai'
    && (targetUrl.port === '' || targetUrl.port === '443') && targetUrl.pathname.startsWith('/inference/')
  const transport = process.env.OUR_FREE_MODEL_FREE_TRANSPORT ?? 'auto'
  if (officialFreeLane && transport !== 'node') {
    if (transport !== 'auto' && transport !== 'bun') throw new Error('OUR_FREE_MODEL_FREE_TRANSPORT must be auto, bun, or node')
    const executable = findBunExecutable()
    if (!executable) throw new Error('OpenCode free inference requires a local Bun executable; install Bun or set OUR_FREE_MODEL_BUN to its executable path (OUR_FREE_MODEL_FREE_TRANSPORT=node restores the legacy transport)')
    if (relay?.dead) throw new Error('the configured egress relay is not running')
    const proxy = relay ? `http://ofm:${relay.key}@${RELAY_HOST}:${relay.port}` : undefined
    if (url instanceof Request) {
      const request = new Request(url, init)
      const body = request.body ? new Uint8Array(await request.arrayBuffer()) : undefined
      return bunFetch(request.url, { ...init, method: request.method, headers: request.headers, body, signal: request.signal, redirect: request.redirect }, { executable, proxy })
    }
    return bunFetch(url, init, { executable, proxy })
```

</details>

#### 缺口

- 在真实宿主中当前模型、流和工具调用是否完整
  **影响**：影响是否可用于实际任务
  **进一步探讨**：在隔离环境使用已知无副作用任务检查请求和输出

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 费用、认证、服务故障和隐私边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

免费模型筛选根据 ID 的 free 标记或例外名单，而不是实时账单担保；其他聚合渠道可带用户密钥，政策和价格属于各自供应商。作者自己记录匿名车道返回 429，故 README 的不限量不是可依赖保证。默认 Bun 找不到时抛出配置错误，上游非 2xx、空响应与流错误分别进入错误路径；组合路由提交正文后不保证切换成功。上游请求包含用户消息，作者说明免费推理可能附带工作目录与平台；README 还提醒 Kilo 可能记录提示词。不要把本地统计或掩码等同于第三方不保存数据；本次没有独立验证供应商政策、安全或实际收费。

#### 证据与依据

**依据 1 · 源码核查**：[src/catalog.js:165-173](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/catalog.js#L165-L173)

按模型名称和例外识别免费车道。

```text
/**
 * Is this id on the免密 lane? The gateway's listing mixes paid and free ids;
 * only these answer without a per-user key.
 */
export function isFreeLane(modelId) {
  const base = baseModelId(modelId)
  if (ALWAYS_FREE.has(base)) return true
  return /(?:^|[-_])free(?:$|[-_.])/.test(base)
}
```

**依据 2 · 源码核查**：[src/catalog.js:217-225](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/catalog.js#L217-L225)

构造匿名目录时仅保留识别出的条目。

```text
export function buildCatalog(ids) {
  const seen = new Set()
  const entries = []
  for (const raw of ids) {
    const id = String(raw ?? '').trim()
    if (id === '' || !isFreeLane(id)) continue
    const base = baseModelId(id)
    if (seen.has(base)) continue
    seen.add(base)
```

**依据 3 · 源码核查**：[src/bun-fetch.js:50-78](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/bun-fetch.js#L50-L78)

本地 Bun 查找与缺失报错。

<details>
<summary>查看原文（29行）</summary>

```text
/** Locate a native executable, never a shell shim. No installation or download. */
export function findBunExecutable() {
  const name = process.platform === 'win32' ? 'bun.exe' : 'bun';
  const candidates = [process.env.OUR_FREE_MODEL_BUN,
    process.env.BUN_INSTALL && join(process.env.BUN_INSTALL, 'bin', name),
    join(homedir(), '.bun', 'bin', name),
    ...(process.env.PATH || '').split(delimiter).filter(Boolean).map(p => join(p.replace(/^"|"$/g, ''), name)),
    process.env.APPDATA && join(process.env.APPDATA, 'npm', 'node_modules', 'bun', 'bin', name)];
  for (const candidate of candidates.filter(Boolean)) {
    try {
      const path = resolve(candidate);
      if (process.platform === 'win32' && !path.toLowerCase().endsWith('.exe')) continue;
      if (!statSync(path).isFile()) continue;
      accessSync(path, constants.X_OK);
      return path;
    } catch { /* try next native executable */ }
  }
  return undefined;
}

/** String/Uint8Array request bodies; init.signal controls the entire response lifetime.
 * options.proxy is passed only over stdin. Omit it to retain Bun's environment proxy.
 * Redirects default to error; no retries. Errors never include worker stderr or input.
 */
export async function bunFetch(url, init = {}, options = {}) {
  const { signal } = init;
  signal?.throwIfAborted();
  const executable = options.executable || findBunExecutable();
  if (!executable) throw new Error('Bun executable not found; set OUR_FREE_MODEL_BUN to a native executable.');
```

</details>

**依据 4 · 源码核查**：[src/http.js:421-449](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/http.js#L421-L449)

网络、非 2xx 和空响应错误。

<details>
<summary>查看原文（29行）</summary>

```text
export async function postStreamed({ path, body, session, attributionUserAgent, signal, onData, timeoutMs = 300000 }) {
  // The Messages wire carries the 2.x client's beta header (o2a/headers.js);
  // the path is the only wire signal this layer sees.
  const headers = gatewayHeaders({ session: truncateSession(session), stream: true, anthropic: path.includes('/messages') })
  headers['user-agent'] = userAgentWith(attributionUserAgent)
  let response
  try {
    response = await egressFetch(`${UPSTREAM_BASE}${path}`, { method: 'POST', headers, body: JSON.stringify(body), redirect: 'error', signal })
  } catch (error) {
    // The signal's own reason is what fetch rejects with, and Node's is a
    // `TimeoutError`/user Error rather than `AbortError` — testing the name alone
    // reported a cancelled turn as `TRANSPORT`, which is retryable.
    if (signal?.aborted === true || error?.name === 'AbortError') throw new UpstreamError('request aborted', CODE.aborted)
    throw new UpstreamError(`our-free-model: upstream request failed: ${error?.message ?? error}${transportCause(error)}`, CODE.transport)
  }

  const setRetry = retryAfter(response.headers.get('retry-after'))
  if (!response.ok) {
    const text = await response.text().catch(() => '')
    // An empty 5xx body is the case #549 is about: there is no envelope to
    // classify, and `HTTP 502` is not an answer the caller can act on.
    if (text.trim() === '' && response.status >= 500) {
      throw emptyBodyFailure(response.status, setRetry, carriesImageContent(body))
    }
    let payload
    try { payload = JSON.parse(text) } catch { payload = { error: { message: text.slice(0, 300) || `HTTP ${response.status}` } } }
    throw classifyFailure(response.status, payload, setRetry)
  }
  if (response.body === null) throw new UpstreamError('our-free-model: upstream returned no body', CODE.empty)
```

</details>

**依据 5 · 作者声明**：[docs/oc-free-transport.md:3-7](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/docs/oc-free-transport.md#L3-L7)

上游地址和环境信息。

```text
## Scope

Only `https://opencode.ai:443/inference/*` uses the Bun worker. Other providers, catalog URLs and local test servers keep the prior transport. This is direct upstream access, not a bridge through OpenCode. A running OpenCode installation is not required.

The free-lane payload includes a short environment block containing the actual process working directory and platform, unless the caller already supplies an `<env>...</env>` system block. Caller instructions and array-valued system blocks are preserved. The existing canonical session ID and tool alias/placeholder handling are retained. No copied OC persona, skills catalog, user conversation or tracing headers are added.
```

**依据 6 · 作者声明**：[docs/oc-free-transport.md:45-49](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/docs/oc-free-transport.md#L45-L49)

作者记录一次成功及随后的 429。

````text
node scripts/oc-free-live-test.mjs --live
node scripts/oc-free-live-test.mjs --live --proxy http://127.0.0.1:7897
```

2026-10-28: integrated source path returned HTTP200, `PONG`, `billing_source: free`. A later configured-outlet attempt returned429, followed by429 on the default path too; this is not sufficient to blame the proxy. Live acceptance is time-dependent and must be checked separately from offline protocol correctness. After adding the persistent real-timestamp session mapping, the installed DSH gateway was verified on 2026-10-29 07:05:49 UTC+8: `our-free-model/nemotron-3.5-lightning-free`, HTTP200, `PONG`, 1.723s. A gateway SSE request immediately after that returned upstream429. After the user reported the free-lane quota refreshed, both were re-verified on 2026-10-29 08:22 UTC+8: nonstream HTTP200 `PONG` in 1.721s, and streaming HTTP200 with `PONG`, `[DONE]`, `finish_reason: stop`, 37 chunks, first byte 1587ms, 2528ms total. The earlier stream 429 therefore reflected the quota window, not a streaming defect. Runtime/artifact hashes matched, the existing image-gateway bundle was unchanged, and no Bun workers remained.
````

**依据 7 · 作者声明**：[README.md:65-67](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/README.md#L65-L67)

不同渠道的授权和隐私声明。

```text
- **EAC 渠道（桌面端专属）**——在 DeepSeek Harness 桌面端与 DSHEAC AIO 桌面端中自动解锁一条协付通道，模型以 EAC 前缀显示（如 EAC DeepSeek V4.1 Flash）；凭据加密密封，由宿主指纹闸门把守；该渠道在服务器侧校验 GitHub 授权（登录并 star 本仓库）后才放行对话；在命令行及其它宿主中该通道完全不存在。详见「EAC 渠道」。
- **Kilo 渠道（免密免费池）**——内置 Kilo AI 公共网关的免费模型池（`isFree` 清单实时拉取，含 `kilo-auto/free` 自动路由），无需任何账号或 Key；模型卡带 Kilo 徽章。思考强度与 EAC 渠道同款：模型自身的档位菜单（Off / Low / Medium / High，默认 High），经网关统一的 `reasoning` 参数真实下发——Off 已逐家族实测将思考归零（nemotron、ling、dots、poolside、apodex、cohere）；stepfun 与 liquid 端点强制思考（对关闭请求返回 400）、两个自动路由不透传关闭，这些模型的菜单不含 Off 档。该池由上游免费提供，上游会在其模型卡中声明 prompt 可能被记录用于改进服务——请勿发送敏感内容，详见「免责声明」。
- **聚合渠道，自带 Key**——设置页新增一页，把第三方端点接进同一条模型清单：注册表内置 76 家提供商（NVIDIA NIM、OpenRouter、Groq、Cerebras、SambaNova、Gemini、DeepSeek、Mistral、Together、Fireworks、SiliconFlow、Nebius、Chutes、Hugging Face、Cloudflare、Z.ai、Kimi、MiniMax、QwenCloud/Alibaba、Bedrock、Vertex、Vercel AI Gateway、Azure OpenAI、FleetRelay Gateway，以及无需账号的 Ollama、LM Studio、llama.cpp），写入 Key（本机免账号的提供商不需要）后其模型即以 `provider/model` 出现在选择器里，也可经本地网关调用。Key 只写入本机 0600 的 settings.json，API 只回显 `hasKey` 与 `…abcd` 指纹；每家可单独启停、测试（列表探测，不花一次生成）、发现模型、覆盖 Base URL 与模型清单。OAuth 与 ADC 认证的提供商照常列出，但标注为不可驱动。
```

#### 缺口

- 供应商当下的价格、限额、数据保留及使用条款
  **影响**：决定费用、隐私和是否可用
  **进一步探讨**：核查真实目标供应商的当前政策，禁止输入敏感材料直到明确

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本与效果、未验证假设是什么？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

匿名车道若符合上游免费政策可避免单次模型 API 收费，但供应商可限额或变化，不能保证零总成本；其他渠道可能收费。首次使用需安装、检查 Bun 和提供者政策；持续需网络、算力及人工验证答案，失败时有重试、替代模型与人工处理成本。没有同任务质量、时间和全部失败成本对照，不能宣称节费或成功率。可提出未验证假设：在组合路由首个候选发出请求前显示每个候选的数据接收方和费用状态，可能减少误发或误选；增加用户确认和政策维护负担。相同任务比较显示与不显示时接收方识别正确率、完成时间和错误路由，若无改善或信息经常过期则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.js:271-296](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L271-L296)

组合路线依次选取候选。

<details>
<summary>查看原文（26行）</summary>

```text
  async * runCombo(options, entry, snapshot) {
    const settings = snapshot.settings ?? {}
    const started = Date.now()
    const rejectedTurn = attempts => {
      this.deps.recordTurn?.({ at: started, model: entry.id, ok: false, recovered: false, attempts, origin: 'harness' })
    }
    if (settings.enabled === false) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: 'our free model is switched off in its settings page', code: 'CONFIG_DISABLED' } } }
      return
    }
    const candidates = comboChain(entry, snapshot.catalog, snapshot.routing ?? {})
    if (candidates.length === 0) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
```

</details>

**依据 2 · 作者声明**：[README.md:65-69](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/README.md#L65-L69)

免费、账户和自带 Key 不同车道及路由说明。

```text
- **EAC 渠道（桌面端专属）**——在 DeepSeek Harness 桌面端与 DSHEAC AIO 桌面端中自动解锁一条协付通道，模型以 EAC 前缀显示（如 EAC DeepSeek V4.1 Flash）；凭据加密密封，由宿主指纹闸门把守；该渠道在服务器侧校验 GitHub 授权（登录并 star 本仓库）后才放行对话；在命令行及其它宿主中该通道完全不存在。详见「EAC 渠道」。
- **Kilo 渠道（免密免费池）**——内置 Kilo AI 公共网关的免费模型池（`isFree` 清单实时拉取，含 `kilo-auto/free` 自动路由），无需任何账号或 Key；模型卡带 Kilo 徽章。思考强度与 EAC 渠道同款：模型自身的档位菜单（Off / Low / Medium / High，默认 High），经网关统一的 `reasoning` 参数真实下发——Off 已逐家族实测将思考归零（nemotron、ling、dots、poolside、apodex、cohere）；stepfun 与 liquid 端点强制思考（对关闭请求返回 400）、两个自动路由不透传关闭，这些模型的菜单不含 Off 档。该池由上游免费提供，上游会在其模型卡中声明 prompt 可能被记录用于改进服务——请勿发送敏感内容，详见「免责声明」。
- **聚合渠道，自带 Key**——设置页新增一页，把第三方端点接进同一条模型清单：注册表内置 76 家提供商（NVIDIA NIM、OpenRouter、Groq、Cerebras、SambaNova、Gemini、DeepSeek、Mistral、Together、Fireworks、SiliconFlow、Nebius、Chutes、Hugging Face、Cloudflare、Z.ai、Kimi、MiniMax、QwenCloud/Alibaba、Bedrock、Vertex、Vercel AI Gateway、Azure OpenAI、FleetRelay Gateway，以及无需账号的 Ollama、LM Studio、llama.cpp），写入 Key（本机免账号的提供商不需要）后其模型即以 `provider/model` 出现在选择器里，也可经本地网关调用。Key 只写入本机 0600 的 settings.json，API 只回显 `hasKey` 与 `…abcd` 指纹；每家可单独启停、测试（列表探测，不花一次生成）、发现模型、覆盖 Base URL 与模型清单。OAuth 与 ADC 认证的提供商照常列出，但标注为不可驱动。
- **省 Token**——三件事：工具输出压缩（RTK）在请求发出前就地重写 `tool_result`（git diff / status / log、grep、find、ls、tree、构建日志、编号转储、搜索清单、重复日志行），实测 40 KB 的 `git diff` 移除 90% 的字节且模型仍能就它作答；提示词瘦身有 caveman 与 ponytail 两族、默认全关；另有五个不占用上游请求的本地应答。设置页用与用量图表同一批统计行显示压缩前后字节、节省比例、压缩块数与统计调用数。
- **路由（降级链）**——把任意车道的模型串成一条命名链，以 `combo:<name>` 作为虚拟模型出现在选择器与网关上；`fallback` 固定从链首开始，`round-robin` 轮换起点并连续 N 轮粘滞。链接在输出任何正文之前失败会被整段丢弃，切换对调用方不可见；思考增量不算正文，因此「想了很久才撞上配额墙」正是降级最有价值的场景。
```

**依据 3 · 作者声明**：[docs/oc-free-transport.md:13-20](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/docs/oc-free-transport.md#L13-L20)

免费传输依赖本地运行时。

```text
## Runtime prerequisite

Install Bun independently or point `OUR_FREE_MODEL_BUN` at a native Bun executable. Nothing is downloaded by this plugin. Discovery checks the explicit path, `BUN_INSTALL/bin`, `~/.bun/bin`, PATH, and the Windows npm Bun executable directory. Windows `.cmd` and `.ps1` shell shims are not executed as subprocess binaries.

`OUR_FREE_MODEL_FREE_TRANSPORT` accepts:

- `auto` (default) / `bun`: use the native Bun worker for official OC inference. If Bun is absent, report a transport configuration error.
- `node`: restore the previous Node transport for diagnosis/rollback. This does not guarantee upstream acceptance.
```

#### 缺口

- 实际单个合格任务费用、模型质量与人工时间
  **影响**：不能计算单位成本或证明相对收益
  **进一步探讨**：对同模型和任务记录成功与失败调用、价格及人工修正时间

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁可试用、何时退出？

**研究主题**：采用判断

#### 完整回答

愿意核实模型供应商及其条款的 DSH 使用者可在隔离配置中用脱敏文本试单一匿名车道，先检查 Bun、出口和明确选中的模型，再对照输出与工具调用。相对手工接入多个端点，插件提供统一选择和有条件降级；收益和各模型效果没有同条件验证。一旦供应商或数据去向无法确认、出现 429、意外付费提示、错误重复工具副作用或流不完整，就应停止当前任务，关闭相关渠道并回到已知官方端点；不能接受第三方处理提示词的任务不适合试用。

#### 证据与依据

**依据 1 · 源码核查**：[src/adapter.js:271-329](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/adapter.js#L271-L329)

组合推进和输出提交的边界。

<details>
<summary>查看原文（59行）</summary>

```text
  async * runCombo(options, entry, snapshot) {
    const settings = snapshot.settings ?? {}
    const started = Date.now()
    const rejectedTurn = attempts => {
      this.deps.recordTurn?.({ at: started, model: entry.id, ok: false, recovered: false, attempts, origin: 'harness' })
    }
    if (settings.enabled === false) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: 'our free model is switched off in its settings page', code: 'CONFIG_DISABLED' } } }
      return
    }
    const candidates = comboChain(entry, snapshot.catalog, snapshot.routing ?? {})
    if (candidates.length === 0) {
      rejectedTurn(0)
      yield { type: 'finish', reason: { kind: 'error', failure: { message: `the chain "${entry.name}" has no model available on this egress`, code: CODE.server } } }
      return
    }
    const tried = []
    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index]
      const iterator = this.runSingle(options, candidate, snapshot, {
        wire: wireOf(candidate),
        turnModel: entry.id,
        recordTurn: false,
        allowAdvance: true,
      })
      let committed = false
      let result
      const held = []
      while (true) {
        const row = committed ? await iterator.next() : await nextOrSilence(iterator, CHAIN_SILENCE_MS)
        if (row.done === true) { result = row.value; break }
        if (committed) { yield row.value; continue }
        held.push(row.value)
        if (commitsAnswer(row.value)) {
          committed = true
          for (const chunk of held) yield chunk
          held.length = 0
        }
      }
      if (committed) {
        this.deps.recordTurn?.({ at: started, model: entry.id, ok: result?.ok === true, recovered: result?.recovered === true, attempts: index + 1, origin: 'harness' })
        return
      }
      if (result?.advance !== true) {
        // Not a candidate fault — an abort, or a failure that arrived after the
        // single-model recovery budget was spent. Hand the caller the real
        // ending instead of pretending another model could have saved it.
        for (const chunk of held) yield chunk
        rejectedTurn(index + 1)
        return
      }
      const reason = result.verdict === null || result.verdict === undefined ? 'failed' : describeVerdict(result.verdict)
      tried.push(`${candidate.id} (${reason})`)
      this.deps.warn?.(`our-free-model: chain "${entry.name}" advanced past ${candidate.id} — ${reason}`)
    }
    rejectedTurn(candidates.length)
    yield { type: 'finish', reason: { kind: 'error', failure: {
      message: `the chain "${entry.name}" exhausted every candidate: ${tried.join('; ')}`,
```

</details>

**依据 2 · 源码核查**：[src/bun-fetch.js:74-78](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/src/bun-fetch.js#L74-L78)

缺少 Bun 的配置错误。

```text
export async function bunFetch(url, init = {}, options = {}) {
  const { signal } = init;
  signal?.throwIfAborted();
  const executable = options.executable || findBunExecutable();
  if (!executable) throw new Error('Bun executable not found; set OUR_FREE_MODEL_BUN to a native executable.');
```

**依据 3 · 作者声明**：[docs/oc-free-transport.md:45-49](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/docs/oc-free-transport.md#L45-L49)

上游可出现 429。

````text
node scripts/oc-free-live-test.mjs --live
node scripts/oc-free-live-test.mjs --live --proxy http://127.0.0.1:7897
```

2026-10-28: integrated source path returned HTTP200, `PONG`, `billing_source: free`. A later configured-outlet attempt returned429, followed by429 on the default path too; this is not sufficient to blame the proxy. Live acceptance is time-dependent and must be checked separately from offline protocol correctness. After adding the persistent real-timestamp session mapping, the installed DSH gateway was verified on 2026-10-29 07:05:49 UTC+8: `our-free-model/nemotron-3.5-lightning-free`, HTTP200, `PONG`, 1.723s. A gateway SSE request immediately after that returned upstream429. After the user reported the free-lane quota refreshed, both were re-verified on 2026-10-29 08:22 UTC+8: nonstream HTTP200 `PONG` in 1.721s, and streaming HTTP200 with `PONG`, `[DONE]`, `finish_reason: stop`, 37 chunks, first byte 1587ms, 2528ms total. The earlier stream 429 therefore reflected the quota window, not a streaming defect. Runtime/artifact hashes matched, the existing image-gateway bundle was unchanged, and no Bun workers remained.
````

**依据 4 · 作者声明**：[README.md:65-67](https://github.com/Ebony-Vinyl/dsh-our-free-model/blob/999e9f784ea3ea7a11cae383b142697b1ff2c42f/README.md#L65-L67)

各渠道隐私与密钥条件不同。

```text
- **EAC 渠道（桌面端专属）**——在 DeepSeek Harness 桌面端与 DSHEAC AIO 桌面端中自动解锁一条协付通道，模型以 EAC 前缀显示（如 EAC DeepSeek V4.1 Flash）；凭据加密密封，由宿主指纹闸门把守；该渠道在服务器侧校验 GitHub 授权（登录并 star 本仓库）后才放行对话；在命令行及其它宿主中该通道完全不存在。详见「EAC 渠道」。
- **Kilo 渠道（免密免费池）**——内置 Kilo AI 公共网关的免费模型池（`isFree` 清单实时拉取，含 `kilo-auto/free` 自动路由），无需任何账号或 Key；模型卡带 Kilo 徽章。思考强度与 EAC 渠道同款：模型自身的档位菜单（Off / Low / Medium / High，默认 High），经网关统一的 `reasoning` 参数真实下发——Off 已逐家族实测将思考归零（nemotron、ling、dots、poolside、apodex、cohere）；stepfun 与 liquid 端点强制思考（对关闭请求返回 400）、两个自动路由不透传关闭，这些模型的菜单不含 Off 档。该池由上游免费提供，上游会在其模型卡中声明 prompt 可能被记录用于改进服务——请勿发送敏感内容，详见「免责声明」。
- **聚合渠道，自带 Key**——设置页新增一页，把第三方端点接进同一条模型清单：注册表内置 76 家提供商（NVIDIA NIM、OpenRouter、Groq、Cerebras、SambaNova、Gemini、DeepSeek、Mistral、Together、Fireworks、SiliconFlow、Nebius、Chutes、Hugging Face、Cloudflare、Z.ai、Kimi、MiniMax、QwenCloud/Alibaba、Bedrock、Vertex、Vercel AI Gateway、Azure OpenAI、FleetRelay Gateway，以及无需账号的 Ollama、LM Studio、llama.cpp），写入 Key（本机免账号的提供商不需要）后其模型即以 `provider/model` 出现在选择器里，也可经本地网关调用。Key 只写入本机 0600 的 settings.json，API 只回显 `hasKey` 与 `…abcd` 指纹；每家可单独启停、测试（列表探测，不花一次生成）、发现模型、覆盖 Base URL 与模型清单。OAuth 与 ADC 认证的提供商照常列出，但标注为不可驱动。
```

#### 缺口

- 所用供应商的实时政策与模型输出质量
  **影响**：决定试用是否安全且能交付
  **进一步探讨**：查看实际端点政策并核验脱敏任务结果

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
