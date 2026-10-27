# dsh-cache-bricks

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2e52b91](https://github.com/3289192-bot/dsh-cache-bricks/tree/2e52b914eaea5a02e5937c323160cf2fd2b8de1b)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：用缓存棋盘展示 DSH 模型请求活动，并提供请求详情、对比、对话定位和历史回看。

> **核心亮点**：把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](#research-q01)。

> **风险与缺陷**：缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要逐请求缓存诊断，增加了什么？](#detail-section-11)
  - [Q02 · 请求观察、存储、计算和展示怎么连接？](#detail-section-12)
  - [Q03 · 命中率能否解释原因，记录是否完整可安全访问？](#detail-section-13)
  - [Q04 · 加载、兼容与失败恢复依赖什么？](#detail-section-14)
  - [Q05 · 观测会增加哪些阶段成本，效果如何判断？](#detail-section-15)
  - [Q06 · 工程哪些可复用，可推导何种未验证改进？](#detail-section-16)
  - [Q07 · 对什么人值得试用，停止标准是什么？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者排查长会话的缓存变化与重试，需要把usage和请求证据关联到对话位置；目标是正确诊断，不是只追求绿色。详见[Q01](#research-q01)。

宿主usage与日志配合人工检索和对话定位是简单对照；插件减少关联步骤，不替代provider账单和业务验收。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| attempt观测 | 分开真实请求与重试 | 降级/历史仅有日志可恢复字段 |
| 缓存棋盘和详情 | 可视检查usage与请求 | 不是优化器或因果判定 |
| 对比/导航/历史 | 关联请求与对话 | 宿主加载、渲染及保留限制 |
| 本地数据接口 | 前后端共享采集材料 | 包含敏感payload，需认证边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途和必要性 | 失效影响 |
| --- | --- | --- |
| DSH事件、usage和日志契约 | attempt与指标 | 错位或缺字段降低诊断 |
| Cordis/React及客户端模块 | web棋盘和面板 | peer可安装不等于兼容 |
| webServer/connection | 发布本地数据 | 无web则只观察；认证须核对 |
| sessions loader与DOM目标 | 历史定位 | 缺失应报告而非假成功 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 安装到web并重启刷新 | 维护者 | host和客户端加载 |
| 核对不敏感样例 | 维护者 | attempt与usage口径一致 |
| 查看颜色、详情与对比 | 用户 | 原始材料支持解释 |
| 失败区分采集/淘汰/渲染 | 用户 | 不把缺失写成零或成功 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主与web运行时，无新增模型请求机制 | 安装、版本和usage口径核对 | 无新增模型请求机制；版本/usage核查工时未知 |
| 持续使用 | 请求摘要/哈希、默认48MiB blob预算、SSE与渲染 | 解读对比及复核原因，耗时未知 | 48MiB是默认blob预算非总内存；摘要/哈希/SSE用量未知 |
| 失败恢复 | 重启丢内存，重新采集或会重复模型费用 | 区分淘汰、日志缺失与导航失败 | 重启丢内存，重采可重复模型费；人工辨因时间未知 |


#### 效果

| 目标 | 源码支持 | 解释边界 |
| --- | --- | --- |
| 观察缓存比例 | 集中公式、缺字段不当零 | 不独立解释缓存下降原因 |
| 查看请求证据 | 内容寻址ref与面板接口 | 淘汰及重启会缺失 |
| 定位历史 | 加载窗口后检查覆盖 | 加载不等于目标渲染 |

> **思考**：缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](#research-q01)。

把attempt级请求、缓存指标和对话位置组织成可视诊断流程，保留重试和缺字段区别；增量是观察证据与阅读操作的组合，不会自动优化缓存。详见[Q01](#research-q01)。

纯指标、内容寻址去重和失败隔离可借鉴，导航检查真实窗口而非仅await；迁移需核对attempt身份、usage和宿主DOM契约。详见[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

缓存颜色不能独立解释原因，公式依赖宿主分桶口径；记录会淘汰且敏感blob需要明确访问边界，历史重建也不等于原始请求完整恢复。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议本地单用户维护者用不敏感会话试用，先核对attempt、usage和访问边界；主链延迟、字段错位、UI干扰或权限不清时停止，回到宿主日志。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

逐请求采集、缺失值处理与可视化接线有源码支持；效果归因和跨版本兼容有限。证据完整性提示是未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/host/collect.ts、src/host/routes.ts、src/core/blob-store.ts、src/shared/metrics.ts、src/client/index.tsx、src/client/navigation.ts、tests/metrics.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交读取host采集/路由、内容存储、指标、客户端接线/导航与测试；未逐行审计全部布局和回放模块，不把作者开发记录当本轮独立执行。
- 下一步：进一步探讨可从token桶映射、重试身份、blob淘汰与历史渲染四类样例入手，再用启用/停用对照比较主调用开销和正确诊断时间。

**分析版本**

- **仓库**：[3289192-bot/dsh-cache-bricks](https://github.com/3289192-bot/dsh-cache-bricks)
- **版本号**：0.1.5（[固定提交 2e52b91](https://github.com/3289192-bot/dsh-cache-bricks/tree/2e52b914eaea5a02e5937c323160cf2fd2b8de1b)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨在颜色旁显式表达attempt/估算及证据完整性，并要求归因回指可比请求；先用缺字段和淘汰样例比较误归因与操作时间，当前未验证。详见[Q06](#research-q06)。

进一步探讨可从token桶映射、重试身份、blob淘汰与历史渲染四类样例入手，再用启用/停用对照比较主调用开销和正确诊断时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2180 | — | — | 25526 |
| .js | source | 3 | 2095 | 1607 | 503 | — |
| .mjs | source | 9 | 4051 | 3233 | 632 | — |
| .ts | source | 25 | 12674 | 7403 | 4595 | — |
| .tsx | source | 2 | 1636 | 1225 | 336 | — |
| .ts | test | 26 | 7581 | 6110 | 855 | — |
| .js | test | 1 | 52 | 51 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/3289192-bot/dsh-cache-bricks/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/3289192-bot/dsh-cache-bricks/issues?q=is%3Aissue+created%3A2026-09-22T04%3A50%3A05.404Z..2026-10-22T04%3A50%3A05.404Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/3289192-bot/dsh-cache-bricks/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A50%3A05.404Z..2026-10-22T04%3A50%3A05.404Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本Cache Bricks如何为模型attempt提供缓存诊断，其口径、完整性、隐私和采用成本边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要逐请求缓存诊断，增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH Web调试长对话、重试和提示上下文的开发者，希望定位某次模型请求的缓存变化，并回到对应对话材料。合格产出是指标口径清楚、attempt与重试不混淆、缺失不假装零、可查到支持解释的请求内容。单看棋盘绿色不是合格业务任务，也不证明提示设计已经优化。

简单替代是阅读宿主usage、日志和请求详情，再人工关联会话步骤。插件把逐attempt观测、缓存比例、对比、历史和导航组织成可视化流程，贡献在观测证据与会话位置的结合。它观察现有请求而不修改提示或模型调用，因此不应宣传为自动提升缓存命中率。分辨attempt与step有价值，但历史或降级路径只有step级时要保留估算标记。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-38](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/README.md#L26-L38)

作者定义缓存、详情、定位、对比和attempt/step边界。

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

| 功能 | 用途 |
| --- | --- |
| 缓存棋盘 | 按轮次堆叠请求砖，看到每次请求的缓存命中率变化 |
| 请求详情 | 单击砖块，查看可用的对话、缓存与 token 用量、耗时、工具调用、重试及错误 |
| 对话定位 | 双击砖块或点击面板定位按钮，跳到对应对话行 |
| 请求对比 | 对比两次请求的记录，帮助排查变化 |
| 活动翻面 | 在同一棋盘查看模型输出、思考和工具调用等活动 |
| 历史回看 | 横向、纵向滚动棋盘，按当前视图加载历史，一键回到最新 |

一块砖对应一次模型请求 attempt，重试产生另一块砖。宿主采集不可用时，降级记录按 step 折叠，并标为估算。插件观察已有请求，不修改模型请求或提示词。

```

</details>

**依据 2 · 源码核查**：[src/index.ts:4-15](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/index.ts#L4-L15)

入口说明只读观察、不增加工具或请求改写。

<details>
<summary>查看原文（12行）</summary>

```text
 * The cache badge is a browser-facing plugin, but its data cannot be gathered in
 * the browser: the outgoing request, the attempt identity, the retry records and
 * the token-meter snapshot only exist on the host. This half therefore installs a
 * **read-only** collector (see `./host/collect`) and serves what it gathered over
 * its own HTTP namespace.
 *
 * It adds no tool, no prompt section and no request rewrite: the plugin's only
 * interaction with the model-call path is an `llm/stream` observer that returns
 * `next()` untouched. The two server-side facts that make this safe are the
 * waterfall contract (returning anything else would replace the model's stream)
 * and the deep-frozen loop request (writing to it throws), both verified against
 * the installed runtime.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求观察、存储、计算和展示怎么连接？

**研究主题**：功能与机制

#### 完整回答

host入口安装collector，监听llm/stream捕获派发请求，监听assistant stream和durable session事件补齐attempt与结果，再由ledger组织记录。采集失败在safely中捕获，llm waterfall会调用next继续模型链；辅助调用可能包裹流以观察，属于可见的执行路径参与，不能把“只读”误解为完全没有运行开销。

大型payload放入内容寻址BlobStore，规范化JSON后哈希去重，砖记录保留ref；按单blob、总字节和数量限制淘汰。metrics将未缓存input、缓存读与缓存写相加作分母，缺缓存字段时返回undefined而不是零；时间指标从dispatch/first token/finish推导。HTTP前缀提供sessions、attempts、blob和SSE，先宿主requestRejection再loopback与Host/Origin比较。客户端把实时feed与宿主历史窗口组合，面板和对话导航共享记录，但历史不保证恢复当时完整请求。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/collect.ts:268-295](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L268-L295)

派发采集、next和辅助流观察。

<details>
<summary>查看原文（28行）</summary>

```text
  ctx.on('llm/stream', ((...args: unknown[]) => {
    const options = args[0] as RequestLike
    const next = args[1] as () => unknown
    // Every read of the payload is guarded: a hostile or exotic request object
    // must not be able to turn into a throw inside the model-call path.
    let sessionId = 'unknown'
    try {
      if (typeof options.sessionId === 'string') sessionId = options.sessionId
    } catch {
      sessionId = 'unknown'
    }
    safely(() => {
      snapshotContext(sessionId)
      collect(sessionId, { kind: 'dispatch', at: Date.now(), options: stateFor(sessionId).summarizer.summarize(options) })
    })
    const stream = next()
    // Reading the payload is itself guarded: this code sits inside the model-call
    // path, so even a hostile or exotic request object must not turn into a throw
    // here. Anything unreadable is treated as a normal request.
    let purpose: unknown
    try {
      purpose = options.purpose
    } catch {
      purpose = undefined
    }
    // An auxiliary call has no Turn attempt to pair with and produces no
    // `agent/assistant-stream` frames, so its chunks can only be observed by
    // wrapping the stream. The wrapper yields exactly what it receives: the
```

</details>

**依据 2 · 源码核查**：[src/core/blob-store.ts:96-132](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/core/blob-store.ts#L96-L132)

内容哈希、去重、读取及淘汰后缺失。

<details>
<summary>查看原文（37行）</summary>

```text
  put(value: unknown): StoredBlob | undefined {
    const text = canonicalize({ [ENVELOPE]: value })
    const bytes = utf8Length(text)
    if (bytes > this.maxBlobBytes) {
      this.skipped += 1
      return undefined
    }
    const hash = contentRef(text)
    const existing = this.blobs.get(hash)
    if (existing !== undefined) {
      // Re-insert to mark it as recently used.
      this.blobs.delete(hash)
      this.blobs.set(hash, existing)
      return { hash, bytes: existing.bytes, added: false }
    }
    this.blobs.set(hash, { text, bytes })
    this.bytes += bytes
    this.evict()
    return { hash, bytes, added: true }
  }

  /**
   * Read a payload back.
   * @param hash - the ref returned by {@link put}.
   * @returns the payload, or undefined when it was never stored or has been evicted.
   */
  get(hash: string): unknown {
    const entry = this.blobs.get(hash)
    if (entry === undefined) {
      this.misses += 1
      return undefined
    }
    this.hits += 1
    this.blobs.delete(hash)
    this.blobs.set(hash, entry)
    const parsed = JSON.parse(entry.text) as Record<string, unknown>
    return parsed[ENVELOPE]
```

</details>

**依据 3 · 源码核查**：[src/shared/metrics.ts:23-62](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/shared/metrics.ts#L23-L62)

输入分母与缓存缺失语义。

<details>
<summary>查看原文（40行）</summary>

```text
export function promptTokensOf(usage: BrickUsage | undefined): number | undefined {
  if (usage === undefined) return undefined
  const total = usage.inputTokens + (usage.cacheReadTokens ?? 0) + (usage.cacheWriteTokens ?? 0)
  return total > 0 ? total : undefined
}

/** The three prompt buckets as ratios of the prompt. */
export interface PromptRatios {
  readonly promptTokens: number
  readonly cacheHitRatio: number
  readonly uncachedRatio: number
  readonly cacheWriteRatio: number
}

/**
 * Split the prompt into its three disjoint parts.
 *
 * Returns nothing when the provider reported **no** cache buckets at all: a
 * missing field means "not reported", not "zero cached", and printing `0.00%`
 * for a provider that never mentions caching is the same lie as printing `n/a`
 * for one that does.
 *
 * @param usage - provider usage for the attempt.
 * @returns the ratios, or undefined when there is no usable prompt size or no
 *   cache accounting to split.
 */
export function promptRatiosOf(usage: BrickUsage | undefined): PromptRatios | undefined {
  if (usage !== undefined && usage.cacheReadTokens === undefined && usage.cacheWriteTokens === undefined) {
    return undefined
  }
  const promptTokens = promptTokensOf(usage)
  if (promptTokens === undefined || usage === undefined) return undefined
  const cacheRead = usage.cacheReadTokens ?? 0
  const cacheWrite = usage.cacheWriteTokens ?? 0
  return {
    promptTokens,
    cacheHitRatio: cacheRead / promptTokens,
    uncachedRatio: usage.inputTokens / promptTokens,
    cacheWriteRatio: cacheWrite / promptTokens,
  }
```

</details>

**依据 4 · 源码核查**：[src/host/routes.ts:107-158](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/routes.ts#L107-L158)

认证栅栏及数据读取端点。

<details>
<summary>查看原文（52行）</summary>

```text
export function createCacheBricksRouter(deps: RouterDeps, options: RouterOptions = {}): {
  readonly path: string
  readonly handler: (request: RouteRequestLike, response: RouteResponseLike) => void
} {
  const path = options.basePath ?? '/cache-bricks'
  const handler = (request: RouteRequestLike, response: RouteResponseLike): void => {
    // The harness's policy first: it is the same one /api uses, so this route is
    // exactly as reachable as the rest of the GUI and no more.
    const rejection = options.guard?.(request)
    if (rejection !== undefined) {
      json(response, rejection, { error: rejection === 401 ? 'unauthenticated' : 'forbidden' })
      return
    }
    if (!isLoopback(request) || !isSameOrigin(request)) {
      json(response, 403, { error: 'forbidden' })
      return
    }
    const url = new URL(request.url ?? '/', 'http://localhost')
    const route = url.pathname.slice(path.length)
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      json(response, 405, { error: 'method not allowed' })
      return
    }

    if (route === '/sessions') {
      json(response, 200, { sessions: deps.sessions() })
      return
    }

    if (route === '/attempts') {
      const sessionId = url.searchParams.get('sessionId')
      if (sessionId === null) {
        json(response, 400, { error: 'sessionId is required' })
        return
      }
      const feed = deps.feed(sessionId)
      json(response, feed === undefined ? 404 : 200, feed ?? { error: 'no observations for this session yet' })
      return
    }

    if (route === '/blob') {
      const ref = url.searchParams.get('ref')
      if (ref === null) {
        json(response, 400, { error: 'ref is required' })
        return
      }
      const value = deps.blob(ref)
      if (value === undefined) {
        json(response, 404, { error: 'unknown or evicted ref' })
        return
      }
      json(response, 200, { ref, value })
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:99-105](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/client/index.tsx#L99-L105)

历史来源与原始请求捕获的差异。

```text
/**
 * The session's own log, read a **scene** at a time — the board's historical source.
 *
 * The collector only ever sees this process, so a brick older than it used to lose its type, its
 * lifecycle and its target. The log has held all of that all along; `./history-scene` reads it
 * with the same observations the collector uses, so a replayed brick means what a live one means,
 * minus the request capture the log never had.
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 命中率能否解释原因，记录是否完整可安全访问？

**研究主题**：缺陷与关键质疑

#### 完整回答

命中率只是读token占提示token的比例，不能单独确定下降来自提示变化、路由、模型缓存策略或任务内容；低prompt被灰色处理也不是异常判断。公式假设宿主将input、read、write桶分离，若适配器传入的是另一口径，视觉颜色可能精确表达了错误输入语义。需要结合完整请求和版本解释，而不是见红就归因插件或用户。

记录有明确保留上限。默认最多八个会话、BlobStore总48MiB、单项4MiB及4096对象；内容会被淘汰，重启清内存，历史只恢复宿主实际日志字段。/blob可能提供原始请求、工具参数和流，敏感性高于一般计数看板。代码优先宿主认证，后备loopback和同Host来源，不等同于多用户数据隔离；在反向代理或共享本地环境下必须核对部署边界。导航也将日志加载和渲染分开，no-loader或timeout不能当成功。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/metrics.ts:49-62](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/shared/metrics.ts#L49-L62)

比例仅表达usage字段关系。

<details>
<summary>查看原文（14行）</summary>

```text
export function promptRatiosOf(usage: BrickUsage | undefined): PromptRatios | undefined {
  if (usage !== undefined && usage.cacheReadTokens === undefined && usage.cacheWriteTokens === undefined) {
    return undefined
  }
  const promptTokens = promptTokensOf(usage)
  if (promptTokens === undefined || usage === undefined) return undefined
  const cacheRead = usage.cacheReadTokens ?? 0
  const cacheWrite = usage.cacheWriteTokens ?? 0
  return {
    promptTokens,
    cacheHitRatio: cacheRead / promptTokens,
    uncachedRatio: usage.inputTokens / promptTokens,
    cacheWriteRatio: cacheWrite / promptTokens,
  }
```

</details>

**依据 2 · 源码核查**：[src/host/collect.ts:108-145](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L108-L145)

默认内存和会话限制。

<details>
<summary>查看原文（38行）</summary>

```text
export function installCollector(ctx: HostContextLike, options: CollectorOptions = {}): Collector {
  const store = new BlobStore({ maxTotalBytes: options.maxStoreBytes ?? 48 * 1024 * 1024 })
  const sessions = new Map<string, SessionState>()
  let disposed = false

  /** Run an observation without ever letting it reach the caller. */
  const safely = (action: () => void): void => {
    try {
      action()
    } catch (error) {
      // Never rethrow: this code sits inside the model-call path.
      console.warn('[dsh-cache-bricks] observation failed:', error instanceof Error ? error.message : error)
    }
  }

  /**
   * Session states, capped. A long-running host sees many sessions, and each one
   * holds a ledger and (through the shared store) raw payloads; the oldest is
   * dropped rather than kept until the plugin is disposed.
   */
  const MAX_SESSIONS = options.maxSessions ?? 8

  const stateFor = (sessionId: string): SessionState => {
    const existing = sessions.get(sessionId)
    if (existing !== undefined) {
      // Re-insert to mark it as most recently used.
      sessions.delete(sessionId)
      sessions.set(sessionId, existing)
      return existing
    }
    if (sessions.size >= MAX_SESSIONS) {
      const oldest = sessions.keys().next()
      if (oldest.done !== true) sessions.delete(oldest.value)
    }
    const state: SessionState = {
      ledger: new BrickLedger(sessionId, {
        store,
        ...(options.maxBricks === undefined ? {} : { maxBricks: options.maxBricks }),
```

</details>

**依据 3 · 源码核查**：[src/core/blob-store.ts:38-50](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/core/blob-store.ts#L38-L50)

单对象与数量上限。

<details>
<summary>查看原文（13行）</summary>

```text
/** Limits that keep a long session from growing without bound. */
export interface BlobStoreOptions {
  /** Largest single payload kept; bigger ones are refused and reported. */
  readonly maxBlobBytes?: number
  /** Total bytes kept across all payloads; the least recently used go first. */
  readonly maxTotalBytes?: number
  /** Hard cap on payload count, independent of their size. */
  readonly maxBlobs?: number
}

const DEFAULT_MAX_BLOB_BYTES = 4 * 1024 * 1024
const DEFAULT_MAX_TOTAL_BYTES = 48 * 1024 * 1024
const DEFAULT_MAX_BLOBS = 4096
```

</details>

**依据 4 · 源码核查**：[src/host/routes.ts:60-90](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/routes.ts#L60-L90)

loopback、Origin/Host后备栅栏。

<details>
<summary>查看原文（31行）</summary>

```text
const LOOPBACK = new Set(['127.0.0.1', '::1', '::ffff:127.0.0.1'])

/**
 * True when the peer is the local machine.
 *
 * An absent `remoteAddress` is **not** treated as local: this route serves whole
 * requests, tool arguments and model streams, so an unidentifiable peer is
 * refused rather than admitted. (With the harness fence in place this is only a
 * backstop — the official policy runs first.)
 */
function isLoopback(request: RouteRequestLike): boolean {
  const address = request.socket?.remoteAddress
  return address !== undefined && LOOPBACK.has(address)
}

/**
 * True when the request either carries no `Origin` (same-origin fetches from the
 * page, and non-browser clients) or carries one matching the `Host` it was sent
 * to. A cross-origin page cannot read the response either way without CORS, but
 * refusing outright keeps the data out of reach of a stray `<img>`/`<script>`.
 */
function isSameOrigin(request: RouteRequestLike): boolean {
  const origin = request.headers.origin
  if (typeof origin !== 'string' || origin === '') return true
  const host = request.headers.host
  if (typeof host !== 'string' || host === '') return false
  try {
    return new URL(origin).host === host
  } catch {
    return false
  }
```

</details>

**依据 5 · 源码核查**：[src/client/navigation.ts:421-440](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/client/navigation.ts#L421-L440)

加载依据实际窗口覆盖而非调用完成。

<details>
<summary>查看原文（20行）</summary>

```text
  if (request.unreachable !== undefined) return { status: request.unreachable }
  const seq = request.seq
  if (seq === undefined || !Number.isSafeInteger(seq) || seq < 1) return { status: 'no-seq' }
  if (face === undefined) return { status: 'no-loader', seq }
  if (covers(face, seq)) return { status: 'already-loaded', seq }

  const wait = options.wait ?? defaultWait
  try {
    await face.loadThrough(seq)
  } catch {
    // A soft failure is the session's own to publish (`snapshot.loadingOlder`, `openError`);
    // the coverage check below still answers the only question asked here.
  }
  const budget = options.timeoutMs ?? 4000
  const poll = options.pollMs ?? 100
  for (let spent = 0; spent < budget; spent += poll) {
    if (covers(face, seq)) return { status: 'loaded', seq }
    await wait(poll)
  }
  return covers(face, seq) ? { status: 'loaded', seq } : { status: 'timeout', seq }
```

</details>

#### 缺口

- 部署适配器token桶语义与共享/代理环境的访问边界未固定。
  **影响**：影响指标可比性和敏感请求内容的可见范围。
  **进一步探讨**：在所用宿主及provider固定版本核对usage映射和路由认证，限定单用户本地环境后再解释颜色。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 加载、兼容与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

安装提供已构建lib入口和web客户端，运行时需要Cordis、React以及宿主chat/conversation/renderer/slots相关表面。package放宽部分peer依赖为*且可选，并不证明任意DSH版本兼容；作者公开基线是0.1.7-rc.2。本轮固定读取插件源码和作者契约，不把其开发机验证当独立复现。

host没有webServer时仍可观察，但不发布HTTP；客户端延迟取得sessions服务，导航依赖loadThrough和窗口事件、对话DOM目标。失败恢复先区分没有观测、blob已淘汰、历史未覆盖、加载器缺失和目标未渲染。重启会丢进程内原始记录，不可能靠reload恢复从未写进宿主日志的payload；旧cache-badge包还需按作者说明移除避免两套UI。退出走宿主移除和重启，不需要迁移插件自己的磁盘数据库。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:22-33](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/index.ts#L22-L33)

host可无HTTP环境安装collector。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * Install the collector.
 *
 * `webServer` is requested through `ctx.inject` rather than a module-level
 * `inject`, so the collector still observes on a composition that serves no HTTP
 * (headless, TUI) — it simply has no routes to publish to.
 *
 * @param ctx - the plugin context.
 * @param config - optional capacity and serving options from the plugin row.
 */
export function apply(ctx: unknown, config?: CollectorOptions): void {
  installCollector(ctx as HostContextLike, config ?? {})
```

</details>

**依据 2 · 源码核查**：[src/host/collect.ts:461-483](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L461-L483)

延迟注入webServer及宿主认证接线。

<details>
<summary>查看原文（23行）</summary>

```text
  if (options.serve !== false) {
    const router = createCacheBricksRouter({
      feed: (sessionId) => collector.feed(sessionId),
      sessions: () => collector.sessions(),
      blob: (ref) => collector.blob(ref),
      subscribe: (sessionId, sink) => collector.subscribe(sessionId, sink),
    }, {
      ...(options.basePath === undefined ? {} : { basePath: options.basePath }),
      // Prefer the harness's own request policy: it applies the same host, origin
      // and browser-authentication checks as /api, which matters because /blob
      // serves whole requests, tool arguments and streams.
      guard: (request) => {
        const connection = ctx.get('connection') as
          | { requestRejection?: (request: unknown) => number | undefined }
          | undefined
        return connection?.requestRejection?.(request)
      },
    })
    ctx.inject(['webServer'], (webCtx) => {
      const server = webCtx.get('webServer') as { register(route: { kind: string; path: string; handler: unknown }): () => void } | undefined
      if (server === undefined || disposed) return
      webCtx.effect(() => server.register({ kind: 'prefix', path: options.basePath ?? router.path, handler: router.handler }))
    })
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:57-85](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/client/index.tsx#L57-L85)

延迟服务与不同加载结果的可读说明。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * The client context, kept only so the official services can be resolved **at use time**.
 *
 * They cannot be resolved once at startup: the sessions service is provided *after* this
 * plugin's client half applies (measured on 0.1.7-rc.1: `ctx.get('sessions')` is undefined
 * inside `apply` and present two seconds later), so anything captured early would be a
 * permanent `undefined` — a jump feature that never loads and never says why.
 */
const ctxRef: { current: Context | undefined } = { current: undefined }

/** How one load ended, in one short sentence for the panel. */
export function loadText(report: LoadReport): string {
  switch (report.status) {
    case 'not-needed':
      return 'the row was already on screen'
    case 'already-loaded':
      return `history already covered seq ${String(report.seq)}`
    case 'loaded':
      return `loaded history through seq ${String(report.seq)}`
        + (report.rendered === false ? ' (the transcript has not rendered it)' : '')
    case 'nothing-to-load':
      return 'this brick has no row in the transcript to load for'
    case 'no-seq':
      return 'the record carries no log position for this attempt, so there is nothing to load'
    case 'no-loader':
      return 'this core did not give the plugin a session face, so nothing could be loaded'
    case 'timeout':
      return `history was requested but the window still does not cover seq ${String(report.seq)}`
      + (report.rendered === false ? ' — and the transcript shows no new rows either' : '')
```

</details>

**依据 4 · 作者声明**：[README.md:86-91](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/README.md#L86-L91)

作者明确内存、重启及日志恢复边界。

```text
## 数据与使用边界

- 插件读取本机 DSH 的请求观测记录和会话日志，完整版可能展示其中的请求、对话与工具内容。
- 插件采集内容保存在进程内存中，通过受保护的本机接口提供给界面；插件自身不将这些内容写入磁盘，没有第三方上传或分析端点。DSH 原有会话日志由宿主管理。
- 重启会清空内存中的采集内容；历史回看能恢复的字段以会话日志实际记录为准。
- 定位依赖宿主加载并渲染目标行；对话旁空白不足时棋盘会隐藏。
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 观测会增加哪些阶段成本，效果如何判断？

**研究主题**：效果与总成本

#### 完整回答

首次成本是加载与核对宿主版本/布局、正确读取一组usage和重试记录；没有新增模型请求不表示不用CPU、内存或人工。持续路径会摘要请求、规范化JSON和哈希、保留大payload，并将feed通过本地HTTP/SSE传给浏览器。去重只复用完全相同对象内容，不能等同于跨不同请求前缀自动压缩。最多100ms发布一次且无人订阅不物化feed可减轻代价，但实际长上下文计算和UI成本仍需测量。

失败恢复需要辨别采集遗漏、过期ref和历史窗口不足，再决定是否重现任务。为了重新采集payload而重跑模型会产生额外费用，不能从插件本身只读推断总成本零。效果标准应是同一缓存异常的正确诊断率与定位时间，连同模型总账单、请求合格结果和人工复核比较；本轮没有证据量化节省或性能改善。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/blob-store.ts:62-114](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/core/blob-store.ts#L62-L114)

每个完整payload规范化、字节计量与哈希。

<details>
<summary>查看原文（53行）</summary>

```text
/** Canonical JSON: key order fixed, so equal values always hash equally. */
function canonicalize(value: unknown): string {
  return JSON.stringify(value, (_key, item: unknown) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) return item
    const source = item as Record<string, unknown>
    const sorted: Record<string, unknown> = {}
    for (const key of Object.keys(source).sort()) sorted[key] = source[key]
    return sorted
  }) ?? 'null'
}

/** Content-addressed store with LRU eviction. */
export class BlobStore {
  private readonly blobs = new Map<string, { text: string; bytes: number }>()
  private readonly maxBlobBytes: number
  private readonly maxTotalBytes: number
  private readonly maxBlobs: number
  private bytes = 0
  private hits = 0
  private misses = 0
  private skipped = 0
  private evicted = 0

  constructor(options: BlobStoreOptions = {}) {
    this.maxBlobBytes = options.maxBlobBytes ?? DEFAULT_MAX_BLOB_BYTES
    this.maxTotalBytes = options.maxTotalBytes ?? DEFAULT_MAX_TOTAL_BYTES
    this.maxBlobs = options.maxBlobs ?? DEFAULT_MAX_BLOBS
  }

  /**
   * Store a payload and return its ref.
   * @param value - any JSON-serializable payload.
   * @returns the ref and size, or undefined when the payload is too large to keep.
   */
  put(value: unknown): StoredBlob | undefined {
    const text = canonicalize({ [ENVELOPE]: value })
    const bytes = utf8Length(text)
    if (bytes > this.maxBlobBytes) {
      this.skipped += 1
      return undefined
    }
    const hash = contentRef(text)
    const existing = this.blobs.get(hash)
    if (existing !== undefined) {
      // Re-insert to mark it as recently used.
      this.blobs.delete(hash)
      this.blobs.set(hash, existing)
      return { hash, bytes: existing.bytes, added: false }
    }
    this.blobs.set(hash, { text, bytes })
    this.bytes += bytes
    this.evict()
    return { hash, bytes, added: true }
```

</details>

**依据 2 · 源码核查**：[src/host/collect.ts:155-169](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L155-L169)

100ms发布及无订阅时跳过feed物化。

<details>
<summary>查看原文（15行）</summary>

```text
  const PUBLISH_INTERVAL_MS = 100
  let lastPublish = 0
  let trailing: ReturnType<typeof setTimeout> | undefined

  const publishNow = (state: SessionState): void => {
    lastPublish = Date.now()
    // Materializing every brick is the expensive part; skip it when the tab that
    // asked for the stream has gone.
    if (state.listeners.size === 0) return
    const feed = state.ledger.feed()
    for (const listener of state.listeners) {
      try {
        listener(feed)
      } catch {
        // A dead SSE client is not the collector's problem.
```

</details>

**依据 3 · 源码核查**：[src/host/collect.ts:279-283](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L279-L283)

派发链上先做同步观测再next。

```text
    safely(() => {
      snapshotContext(sessionId)
      collect(sessionId, { kind: 'dispatch', at: Date.now(), options: stateFor(sessionId).summarizer.summarize(options) })
    })
    const stream = next()
```

#### 缺口

- 缺少真实长上下文下采集开销和诊断收益对照。
  **影响**：不能判断内存/CPU代价是否被排查效率抵销。
  **进一步探讨**：同宿主同任务对照启用和停用，记录模型链延迟、峰值内存、UI响应与正确诊断时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 工程哪些可复用，可推导何种未验证改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用设计包括指标纯函数集中口径、缺失值与零分离、内容寻址存储、观察失败不抛入主模型链，以及历史加载后再次检查实际覆盖而非把await完成当成功。测试源码给出手算usage fixture，明确input/read/write分离假设，便于做反例。移植需重核宿主事件身份、usage适配和DOM导航，不把结构类型兼容当语义兼容。

未验证方向是让颜色旁同时呈现证据完整性与口径来源，区分真实attempt、step估算、payload淘汰和历史重建，并要求缓存归因假设引用一次可比请求对照。推导来自指标看似清楚却仍依赖桶语义与保留范围。最小验证向维护者提供同一组cache变化、缺字段和淘汰样例，对比仅颜色与带完整性提示的误归因率及操作时间；若增加信息没有降低误判，或妨碍主要任务阅读，应否定扩展。该方向未实现，不计入现有评分。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/metrics.ts:37-62](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/shared/metrics.ts#L37-L62)

缺字段不显示零的明确语义。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Split the prompt into its three disjoint parts.
 *
 * Returns nothing when the provider reported **no** cache buckets at all: a
 * missing field means "not reported", not "zero cached", and printing `0.00%`
 * for a provider that never mentions caching is the same lie as printing `n/a`
 * for one that does.
 *
 * @param usage - provider usage for the attempt.
 * @returns the ratios, or undefined when there is no usable prompt size or no
 *   cache accounting to split.
 */
export function promptRatiosOf(usage: BrickUsage | undefined): PromptRatios | undefined {
  if (usage !== undefined && usage.cacheReadTokens === undefined && usage.cacheWriteTokens === undefined) {
    return undefined
  }
  const promptTokens = promptTokensOf(usage)
  if (promptTokens === undefined || usage === undefined) return undefined
  const cacheRead = usage.cacheReadTokens ?? 0
  const cacheWrite = usage.cacheWriteTokens ?? 0
  return {
    promptTokens,
    cacheHitRatio: cacheRead / promptTokens,
    uncachedRatio: usage.inputTokens / promptTokens,
    cacheWriteRatio: cacheWrite / promptTokens,
  }
```

</details>

**依据 2 · 源码核查**：[tests/metrics.spec.ts:16-39](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/tests/metrics.spec.ts#L16-L39)

手算fixture和桶求和断言。

<details>
<summary>查看原文（24行）</summary>

```text
/** The example the design notes use: a healthy step with a big cached prefix. */
const HEALTHY: BrickUsage = {
  inputTokens: 2461,
  outputTokens: 2986,
  cacheReadTokens: 317_992,
  cacheWriteTokens: 0,
  reasoningTokens: 1421,
}

/** The same shape after the prefix was invalidated: nothing cached. */
const REBUILD: BrickUsage = { inputTokens: 321_844, outputTokens: 118, cacheReadTokens: 0 }

describe('promptTokensOf', () => {
  it('sums the three disjoint prompt buckets', () => {
    expect(promptTokensOf(HEALTHY)).toBe(320_453)
    expect(promptTokensOf(REBUILD)).toBe(321_844)
  })

  it('treats missing cache buckets as zero', () => {
    expect(promptTokensOf({ inputTokens: 900, outputTokens: 10 })).toBe(900)
  })

  it('returns nothing for an empty or absent prompt, rather than dividing by zero later', () => {
    expect(promptTokensOf(undefined)).toBeUndefined()
```

</details>

**依据 3 · 源码核查**：[src/host/collect.ts:113-120](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/collect.ts#L113-L120)

观察异常隔离。

```text
  /** Run an observation without ever letting it reach the caller. */
  const safely = (action: () => void): void => {
    try {
      action()
    } catch (error) {
      // Never rethrow: this code sits inside the model-call path.
      console.warn('[dsh-cache-bricks] observation failed:', error instanceof Error ? error.message : error)
    }
```

**依据 4 · 源码核查**：[src/client/navigation.ts:421-440](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/client/navigation.ts#L421-L440)

实际覆盖检查。

<details>
<summary>查看原文（20行）</summary>

```text
  if (request.unreachable !== undefined) return { status: request.unreachable }
  const seq = request.seq
  if (seq === undefined || !Number.isSafeInteger(seq) || seq < 1) return { status: 'no-seq' }
  if (face === undefined) return { status: 'no-loader', seq }
  if (covers(face, seq)) return { status: 'already-loaded', seq }

  const wait = options.wait ?? defaultWait
  try {
    await face.loadThrough(seq)
  } catch {
    // A soft failure is the session's own to publish (`snapshot.loadingOlder`, `openError`);
    // the coverage check below still answers the only question asked here.
  }
  const budget = options.timeoutMs ?? 4000
  const poll = options.pollMs ?? 100
  for (let spent = 0; spent < budget; spent += poll) {
    if (covers(face, seq)) return { status: 'loaded', seq }
    await wait(poll)
  }
  return covers(face, seq) ? { status: 'loaded', seq } : { status: 'timeout', seq }
```

</details>

#### 缺口

- 完整性提示对用户误归因的影响没有对照。
  **影响**：设计推演不能宣称改进诊断效果。
  **进一步探讨**：固定混合样例并盲评正确归因与耗时，再决定最小提示。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 对什么人值得试用，停止标准是什么？

**研究主题**：采用判断

#### 完整回答

建议熟悉usage口径、需要排查长会话或重试的本地单用户维护者试用；先使用不含敏感材料的会话，确认实际attempt数量、缺字段、重启与淘汰行为，再看缓存变化。它适合辅助诊断而非自动优化，读者应能分清颜色、原始证据和原因假设。

成功标准是已知重试样例不被合并成一个真实attempt、指标与适配器原始usage一致、导航准确报告结果、敏感blob只在预期边界可见。若升级后字段错位、主调用延迟明显、页面遮挡或访问边界不清，应停止该范围使用并回到宿主日志。当前已读源码及作者说明支撑可控试用，不满足本轮同版本安装/核心功能/卸载验收，不能评为值得安装。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared/metrics.ts:23-62](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/shared/metrics.ts#L23-L62)

采用前需核对usage语义。

<details>
<summary>查看原文（40行）</summary>

```text
export function promptTokensOf(usage: BrickUsage | undefined): number | undefined {
  if (usage === undefined) return undefined
  const total = usage.inputTokens + (usage.cacheReadTokens ?? 0) + (usage.cacheWriteTokens ?? 0)
  return total > 0 ? total : undefined
}

/** The three prompt buckets as ratios of the prompt. */
export interface PromptRatios {
  readonly promptTokens: number
  readonly cacheHitRatio: number
  readonly uncachedRatio: number
  readonly cacheWriteRatio: number
}

/**
 * Split the prompt into its three disjoint parts.
 *
 * Returns nothing when the provider reported **no** cache buckets at all: a
 * missing field means "not reported", not "zero cached", and printing `0.00%`
 * for a provider that never mentions caching is the same lie as printing `n/a`
 * for one that does.
 *
 * @param usage - provider usage for the attempt.
 * @returns the ratios, or undefined when there is no usable prompt size or no
 *   cache accounting to split.
 */
export function promptRatiosOf(usage: BrickUsage | undefined): PromptRatios | undefined {
  if (usage !== undefined && usage.cacheReadTokens === undefined && usage.cacheWriteTokens === undefined) {
    return undefined
  }
  const promptTokens = promptTokensOf(usage)
  if (promptTokens === undefined || usage === undefined) return undefined
  const cacheRead = usage.cacheReadTokens ?? 0
  const cacheWrite = usage.cacheWriteTokens ?? 0
  return {
    promptTokens,
    cacheHitRatio: cacheRead / promptTokens,
    uncachedRatio: usage.inputTokens / promptTokens,
    cacheWriteRatio: cacheWrite / promptTokens,
  }
```

</details>

**依据 2 · 源码核查**：[src/host/routes.ts:115-158](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/src/host/routes.ts#L115-L158)

访问边界与敏感blob端点。

<details>
<summary>查看原文（44行）</summary>

```text
    const rejection = options.guard?.(request)
    if (rejection !== undefined) {
      json(response, rejection, { error: rejection === 401 ? 'unauthenticated' : 'forbidden' })
      return
    }
    if (!isLoopback(request) || !isSameOrigin(request)) {
      json(response, 403, { error: 'forbidden' })
      return
    }
    const url = new URL(request.url ?? '/', 'http://localhost')
    const route = url.pathname.slice(path.length)
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      json(response, 405, { error: 'method not allowed' })
      return
    }

    if (route === '/sessions') {
      json(response, 200, { sessions: deps.sessions() })
      return
    }

    if (route === '/attempts') {
      const sessionId = url.searchParams.get('sessionId')
      if (sessionId === null) {
        json(response, 400, { error: 'sessionId is required' })
        return
      }
      const feed = deps.feed(sessionId)
      json(response, feed === undefined ? 404 : 200, feed ?? { error: 'no observations for this session yet' })
      return
    }

    if (route === '/blob') {
      const ref = url.searchParams.get('ref')
      if (ref === null) {
        json(response, 400, { error: 'ref is required' })
        return
      }
      const value = deps.blob(ref)
      if (value === undefined) {
        json(response, 404, { error: 'unknown or evicted ref' })
        return
      }
      json(response, 200, { ref, value })
```

</details>

**依据 3 · 作者声明**：[README.md:86-91](https://github.com/3289192-bot/dsh-cache-bricks/blob/2e52b914eaea5a02e5937c323160cf2fd2b8de1b/README.md#L86-L91)

作者数据和UI边界。

```text
## 数据与使用边界

- 插件读取本机 DSH 的请求观测记录和会话日志，完整版可能展示其中的请求、对话与工具内容。
- 插件采集内容保存在进程内存中，通过受保护的本机接口提供给界面；插件自身不将这些内容写入磁盘，没有第三方上传或分析端点。DSH 原有会话日志由宿主管理。
- 重启会清空内存中的采集内容；历史回看能恢复的字段以会话日志实际记录为准。
- 定位依赖宿主加载并渲染目标行；对话旁空白不足时棋盘会隐藏。
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
