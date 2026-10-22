# dsh-compaction-route

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6039b26](https://github.com/643048695/dsh-compaction-route/tree/6039b260d96652ce4af606f850cd1a179cd9d4f7)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：仅对DSH压缩摘要调用选择主模型，并在终止error时用备援路线重试相同历史。

> **核心亮点**：补可编辑摘要主备与purpose窄路由，减少手工失败切换，非新压缩算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

> **风险与缺陷**：缺finish被当无failure、无用摘要不备援、throw直抛且完整流缓存；备援重发历史并产生额外成本，窗口提示非成功保证。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要压缩路由，主备尝试如何运行？](#detail-section-11)
  - [Q02 · 相对固定summarizer贡献和关键边界是什么？](#detail-section-12)
  - [Q03 · 依赖、退出和三阶段成本效果怎样判断？](#detail-section-13)
  - [Q04 · 工程复用和压缩尝试收据假设怎么检验？](#detail-section-14)
  - [Q05 · 目前推荐和停止条件是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话维护者选择压缩模型并恢复终止错误，需摘要保真和完整尝试收据。

固定单summarizer加手工换路线可替代；自动备援省切换，但不解决输入/摘要语义或省去失败成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主路线 | 选定摘要模型 | 默认空透明，effort默认high |
| 备援 | terminal error后重试 | throw/abort/无用摘要不涵盖 |
| 完整缓存 | 不交付失败内容 | 无界缓存/最后流成本需核 |
| 窗口提示 | 帮助挑选候选 | 仅声明值非tokenizer保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm/stream瀑布与llm服务 | 重路由必需 | 指定purpose并重入 | 无服务不启用，需接口兼容 |
| 已安装primary及凭据 | 开启路由必需 | 真正生成摘要 | 默认空值不改变原流程 |
| fallback及相应数据发送许可 | 失败备援可选 | 再发相同历史 | 不配置则不备援，不能自动扩大信任域 |
| Client设置及pi-ai模型描述 | 下拉UI必需 | 选择路线/显示上下文 | 声明窗口非实际token校准 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者核对可信主/备provider和历史发送范围 | 保存原压缩设置与可恢复会话 |
| 加载 | 安装后默认primary/fallback为空 | 未选择时透明，不无感重路由 |
| 配置 | 明确选择主/备、effort并核窗口/预算 | high默认不等成本最优 |
| 压缩/退出 | 检查实际摘要和后续任务，停路由可关enabled/清primary | 关插件不撤销已发历史或已生成摘要 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | provider/模型环境，金额未知 | 隐私、tokenizer/窗口和配置核对 | 作者大窗口测量非本轮验证 |
| 持续使用 | 成功主调用或失败后完整备援，chunk全缓存 | 核对摘要保真与effort/窗口 | 失败调用也可能已耗资源，不能当免费 |
| 失败恢复 | 再压缩/换路线、保留原历史与任务重做 | 分清终止error、aborted、throw和无finish | 插件不修复无用但无error摘要 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定向路由 | 仅purpose=compaction进入重路由 | 宿主purpose与其他中间件组合行为 |
| 备援 | terminal error后可再试一次 | 输入实际适配/费用与成功率 |
| 任务连续性 | 成功流交回原压缩引擎 | 摘要关键信息保留及后续任务完成率 |

> **思考**：缺finish被当无failure、无用摘要不备援、throw直抛且完整流缓存；备援重发历史并产生额外成本，窗口提示非成功保证。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：补可编辑摘要主备与purpose窄路由，减少手工失败切换，非新压缩算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

补可编辑摘要主备与purpose窄路由，减少手工失败切换，非新压缩算法。详见[Q01](#research-q01)与[Q02](#research-q02)。

可复用的是purpose窄匹配、空配置透明、volatile每次取值、WeakSet避免自身递归及遵守abort不再备援。缓冲尝试避免失败内容污染最终摘要，但当前无界缓存/缺finish无错误和只给最终流需要明确。

<a id="detail-section-5"></a>

### 1.4 主要限制

缺finish被当无failure、无用摘要不备援、throw直抛且完整流缓存；备援重发历史并产生额外成本，窗口提示非成功保证。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确主备provider/原历史恢复的维护者可限范围试用，先核失败分类、全部成本和摘要保真。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持purpose限定的压缩模型主备路由与重入防护；终止缺失、抛错备援和所有尝试的成本/外发范围仍需明确，不能承诺更优压缩。逐尝试终止/预算收据尚未验证。

- 已检查：作者 README、包清单、源码路径 lib/index.js、README.md、package.json、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定完整Host选路/缓存/失败主链及Client配置线索、作者测量；未运行宿主/模型，不校准真实tokenizer。
- 下一步：进一步探讨可用error/throw/abort/缺finish/超大chunk流，再用固定历史后续任务比较信息保留与全部成本。

**分析版本**

- **仓库**：[643048695/dsh-compaction-route](https://github.com/643048695/dsh-compaction-route)
- **版本号**：0.1.0（[固定提交 6039b26](https://github.com/643048695/dsh-compaction-route/tree/6039b260d96652ce4af606f850cd1a179cd9d4f7)）
- **版本日期**：2026-09-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨每尝试压缩收据，保留route/usage/终止与预算，缺finish标不完整并核数据范围；隐私/缓存维护成本未验证。详见[Q04](#research-q04)。

进一步探讨可用error/throw/abort/缺finish/超大chunk流，再用固定历史后续任务比较信息保留与全部成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 308 | — | — | 3291 |
| .js | source | 2 | 685 | 482 | 157 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+created%3A2026-09-22T06%3A09%3A10.165Z..2026-10-22T06%3A09%3A10.165Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A09%3A10.165Z..2026-10-22T06%3A09%3A10.165Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查压缩主/备路由、终止失败与完整摘要任务成本/隐私边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要压缩路由，主备尝试如何运行？

**研究主题**：场景与需求、功能与机制

#### 完整回答

面向DSH长会话维护者，希望压缩摘要模型与主聊天模型分开且失败时换一条路线。输入为purpose=compaction的原始options与用户选择的主/备provider/model，输出一个尝试的chunk流供原引擎继续。合格任务需摘要有效、后续工作不丢关键约束，并清楚历史向哪些服务发送。

handler先排除非compaction和自己WeakSet标记的call，无primary透明。对每条路线克隆options改provider/model和可选effort，重入llm.stream，完整收集到finish。若finish error则且未取消时试fallback，成功/aborted或最后错误交回chunks；throw直接抛出不重试。原压缩引擎仍负责接收摘要和写会话，不由插件实现。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:183-198](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L183-L198)

每次读取primary/fallback，空primary透明。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Read the routing plan. Called per compaction so a settings edit applies at once. */
  const plan = () => {
    if (plain(settings.enabled, true) !== true) return undefined
    const primary = parseTarget(plain(settings.primary, NO_TARGET))
    // A fallback without a primary is meaningless — there is nothing to fail — and
    // treating it as the primary would silently route compaction somewhere the
    // person never chose. No primary means this plugin stays transparent.
    if (primary === undefined) return undefined
    const chain = [primary]
    const fallback = parseTarget(plain(settings.fallback, NO_TARGET))
    if (fallback !== undefined) chain.push(fallback)
    return {
      chain,
      effort: plain(settings.effort, 'high'),
      log: plain(settings.log, true) === true
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:212-241](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L212-L241)

purpose/重入/选路与throw。

<details>
<summary>查看原文（30行）</summary>

```text
    const handler = async function * (options, next) {
      if (options === null || typeof options !== 'object') return yield * next()
      if (options.purpose !== COMPACTION_PURPOSE) return yield * next()
      // Our own retry re-enters the waterfall; hand it straight to the adapter.
      if (OWN_CALLS.has(options)) return yield * next()

      const route = plan()
      if (route === undefined) return yield * next()

      const signal = options.signal
      const chain = route.chain
      const effort = route.effort === '' ? undefined : route.effort

      for (let index = 0; index < chain.length; index += 1) {
        const target = chain[index]
        const isLast = index === chain.length - 1
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
        } catch (error) {
          // A thrown middleware or consumer failure is not a provider outcome
          // this seam can retry; surface it exactly as the unpatched runtime would.
          throw error
```

</details>

**依据 3 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L244-L268)

error/取消/最后尝试。

<details>
<summary>查看原文（25行）</summary>

```text
        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:148-171](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L148-L171)

收集与终止判定。

<details>
<summary>查看原文（24行）</summary>

```text
/** Collect one attempt's chunks, stopping at its terminal finish chunk. */
async function collectAttempt (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
    if (chunk !== null && typeof chunk === 'object' && chunk.type === 'finish') break
  }
  return chunks
}

/**
 * Interpret collected chunks.
 *
 * @returns the terminal failure, or undefined when the attempt succeeded.
 */
function outcomeOf (chunks) {
  for (const chunk of chunks) {
    if (chunk === null || typeof chunk !== 'object' || chunk.type !== 'finish') continue
    const reason = chunk.reason === undefined ? {} : chunk.reason
    if (reason.kind === 'aborted') return { aborted: true, failure: reason.failure }
    if (reason.kind === 'error') return { aborted: false, failure: reason.failure === undefined ? { code: 'UNKNOWN' } : reason.failure }
    return { aborted: false, failure: undefined }
  }
  return { aborted: false, failure: undefined }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对固定summarizer贡献和关键边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

贡献是补上用户可编辑主/备摘要路由、purpose限定和终止错误备援，不接管所有模型调用。用WeakSet重入而非next改参数是具体接线经验；自动缩小输入/切分或改善摘要算法不在实现内。作者同payload跨模型token测量可说明其场景，未被本轮复现。

限制在失败定义和完整副作用。outcomeOf未见finish也返回failure undefined，语义无用/空摘要但无error也不触发备援；throw不备援、aborted不备援是明确边界。所有chunks全存在内存再yield，主失败内容不交消费者，取消仍依赖provider遵守signal。尝试成本/usage若只看最后流可能不完整，实际计量还需宿主事件确认。

fallback收到同一历史，跨provider意味着额外数据接收者；更大声明窗口只是线索，tokenizer、输出预算和实际上限共同决定输入是否可接受。不能把“同窗口必失败/更大窗口必成功”当普遍结论。默认effort high在启用后传给两路线，未核每provider是否接受，也不证明摘要更好。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-37](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/README.md#L21-L37)

作者跨模型测量及窗口结论。

<details>
<summary>查看原文（17行）</summary>

```text
Measured on a real 950k-window session:

| | |
|---|---|
| DSH estimate for the replay | 743,536 tokens |
| What the chat model actually read | 744,184 tokens |
| What the chosen summarizer needed | **over its input ceiling** → HTTP 400 |

The meter was calibrated on the chat model's tokenizer (0.1% off), so it reported "fits" while the summarizer was already over. Three routes measured against one identical payload:

| Route | Tokens for the same bytes |
|---|---|
| gemini-3.8-flash | 1,027,843 |
| opencode-go/deepseek-v4.1-flash | 939,469 |
| surplan/deepseek-v4.1-flash | 939,003 |

The tokenizers differ by **~10%**; the ceilings are the **same** (1,048,576). So "just pick a different model" is not enough on its own: **a fallback only rescues an oversized replay when its window is larger than the primary's.** The settings card says so when your pick cannot help.
```

</details>

**依据 2 · 源码核查**：[lib/index.js:148-171](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L148-L171)

无finish按无failure与全缓存。

<details>
<summary>查看原文（24行）</summary>

```text
/** Collect one attempt's chunks, stopping at its terminal finish chunk. */
async function collectAttempt (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
    if (chunk !== null && typeof chunk === 'object' && chunk.type === 'finish') break
  }
  return chunks
}

/**
 * Interpret collected chunks.
 *
 * @returns the terminal failure, or undefined when the attempt succeeded.
 */
function outcomeOf (chunks) {
  for (const chunk of chunks) {
    if (chunk === null || typeof chunk !== 'object' || chunk.type !== 'finish') continue
    const reason = chunk.reason === undefined ? {} : chunk.reason
    if (reason.kind === 'aborted') return { aborted: true, failure: reason.failure }
    if (reason.kind === 'error') return { aborted: false, failure: reason.failure === undefined ? { code: 'UNKNOWN' } : reason.failure }
    return { aborted: false, failure: undefined }
  }
  return { aborted: false, failure: undefined }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:228-241](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L228-L241)

同options改路线/effort，throw直接上抛。

<details>
<summary>查看原文（14行）</summary>

```text
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
        } catch (error) {
          // A thrown middleware or consumer failure is not a provider outcome
          // this seam can retry; surface it exactly as the unpatched runtime would.
          throw error
```

</details>

**依据 4 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L244-L268)

仅terminal error备援。

<details>
<summary>查看原文（25行）</summary>

```text
        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:89-92](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L89-L92)

默认high。

```text
  effort: Schema.string()
    .default('high')
    .description('Reasoning effort for compaction calls. Empty keeps the provider default.')
    .volatile(),
```

#### 缺口

- 各provider实际tokenizer/窗口、effort和摘要质量未独立验证。
  **影响**：不能仅按下拉窗口选出可靠压缩路线或断言备援成功。
  **进一步探讨**：可用固定无敏感长历史分别核实际输入/输出与关键信息保留，统计后续任务而非只HTTP成功。
- 其他中间件重入组合、无finish流和失败尝试usage记录未确定。
  **影响**：不能把只yield最后流当全部成本/错误可见。
  **进一步探讨**：可用模拟流和宿主事件观察点检查每尝试收据、throw/abort/缺finish，不发送真实历史。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、退出和三阶段成本效果怎样判断？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包0.1.0无构建流程、仅Schema运行依赖；真正可用仍依赖llm/stream契约、provider凭据和Client配置服务。primary/fallback默认空是积极边界，没有选路线不改变现有压缩。设置实时读取适用于下一次压缩，不应改变在途尝试计划。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH llm/stream瀑布与llm服务 | 重路由必需 | 指定purpose并重入 | 无服务不启用，需接口兼容 |
| 已安装primary及凭据 | 开启路由必需 | 真正生成摘要 | 默认空值不改变原流程 |
| fallback及相应数据发送许可 | 失败备援可选 | 再发相同历史 | 不配置则不备援，不能自动扩大信任域 |
| Client设置及pi-ai模型描述 | 下拉UI必需 | 选择路线/显示上下文 | 声明窗口非实际token校准 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者核对可信主/备provider和历史发送范围 | 保存原压缩设置与可恢复会话 |
| 加载 | 安装后默认primary/fallback为空 | 未选择时透明，不无感重路由 |
| 配置 | 明确选择主/备、effort并核窗口/预算 | high默认不等成本最优 |
| 压缩/退出 | 检查实际摘要和后续任务，停路由可关enabled/清primary | 关插件不撤销已发历史或已生成摘要 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | provider/模型环境，金额未知 | 隐私、tokenizer/窗口和配置核对 | 作者大窗口测量非本轮验证 |
| 持续使用 | 成功主调用或失败后完整备援，chunk全缓存 | 核对摘要保真与effort/窗口 | 失败调用也可能已耗资源，不能当免费 |
| 失败恢复 | 再压缩/换路线、保留原历史与任务重做 | 分清终止error、aborted、throw和无finish | 插件不修复无用但无error摘要 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定向路由 | 仅purpose=compaction进入重路由 | 宿主purpose与其他中间件组合行为 |
| 备援 | terminal error后可再试一次 | 输入实际适配/费用与成功率 |
| 任务连续性 | 成功流交回原压缩引擎 | 摘要关键信息保留及后续任务完成率 |

完整对照需相同历史、相同后续任务，计主失败/备援全部调用、人工重做及摘要丢约束，不以fallback日志成功代替业务结果。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:76-96](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L76-L96)

空路线与实时配置默认。

<details>
<summary>查看原文（21行）</summary>

```text
export const Config = Schema.object({
  enabled: Schema.boolean()
    .default(true)
    .description('Route compaction calls through the models below. Off leaves the engine exactly as it was.')
    .volatile(),
  primary: Schema.string()
    .default(NO_TARGET)
    .description('The summarizer used first, as "provider|model". Empty leaves compaction untouched.')
    .volatile(),
  fallback: Schema.string()
    .default(NO_TARGET)
    .description('Tried when the primary ends in an error. Empty disables the fallback.')
    .volatile(),
  effort: Schema.string()
    .default('high')
    .description('Reasoning effort for compaction calls. Empty keeps the provider default.')
    .volatile(),
  log: Schema.boolean()
    .default(true)
    .description('Write one info line when a fallback is used.')
    .volatile()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:183-198](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L183-L198)

每调用固定计划。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Read the routing plan. Called per compaction so a settings edit applies at once. */
  const plan = () => {
    if (plain(settings.enabled, true) !== true) return undefined
    const primary = parseTarget(plain(settings.primary, NO_TARGET))
    // A fallback without a primary is meaningless — there is nothing to fail — and
    // treating it as the primary would silently route compaction somewhere the
    // person never chose. No primary means this plugin stays transparent.
    if (primary === undefined) return undefined
    const chain = [primary]
    const fallback = parseTarget(plain(settings.fallback, NO_TARGET))
    if (fallback !== undefined) chain.push(fallback)
    return {
      chain,
      effort: plain(settings.effort, 'high'),
      log: plain(settings.log, true) === true
    }
```

</details>

**依据 3 · 源码核查**：[package.json:39-60](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/package.json#L39-L60)

web分发与Schema依赖。

<details>
<summary>查看原文（22行）</summary>

```text
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "keywords": [
    "dsh",
    "deepseek-harness",
    "dsh-plugin",
    "dsh-plugin-bundle",
    "compaction",
    "compaction-model",
    "context",
    "context-window",
    "fallback",
    "summarizer"
  ],
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.2"
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:228-249](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L228-L249)

完整尝试后交付。

<details>
<summary>查看原文（22行）</summary>

```text
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
        } catch (error) {
          // A thrown middleware or consumer failure is not a provider outcome
          // this seam can retry; surface it exactly as the unpatched runtime would.
          throw error
        }

        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
```

</details>

#### 缺口

- 缺少同历史/后续任务的成功率、摘要保真、总tokens/耗时与恢复对照。
  **影响**：不能量化更稳、更省或较好摘要。
  **进一步探讨**：可比较原单route、手工换route与本插件，记录每次失败/备援收费和任务完成质量。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程复用和压缩尝试收据假设怎么检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是purpose窄匹配、空配置透明、volatile每次取值、WeakSet避免自身递归及遵守abort不再备援。缓冲尝试避免失败内容污染最终摘要，但当前无界缓存/缺finish无错误和只给最终流需要明确。

可探讨未验证的“压缩尝试收据”。每次主/备记录route、输入估算与实际usage、开始/finish/throw/abort、缓存预算和摘要验收状态，缺finish视不完整而非成功；失败尝试保留成本/错误元数据，跨provider数据范围在配置时可读。可选按已核provider预算选择路线，而不是只按声明窗口。相对现有info日志，它使失败与成本可复核，代价是日志隐私、tokenizer维护和缓存策略。可用部分输出后error、throw、abort、缺finish、超大chunk与同窗口不同tokenizer夹具比较误成功、峰值内存和总成本；若只能看最后成功应修设计。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:212-241](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L212-L241)

purpose、WeakSet重入和throw。

<details>
<summary>查看原文（30行）</summary>

```text
    const handler = async function * (options, next) {
      if (options === null || typeof options !== 'object') return yield * next()
      if (options.purpose !== COMPACTION_PURPOSE) return yield * next()
      // Our own retry re-enters the waterfall; hand it straight to the adapter.
      if (OWN_CALLS.has(options)) return yield * next()

      const route = plan()
      if (route === undefined) return yield * next()

      const signal = options.signal
      const chain = route.chain
      const effort = route.effort === '' ? undefined : route.effort

      for (let index = 0; index < chain.length; index += 1) {
        const target = chain[index]
        const isLast = index === chain.length - 1
        const call = {
          ...options,
          ...target,
          ...effort === undefined ? {} : { reasoningEffort: effort }
        }
        OWN_CALLS.add(call)

        let chunks
        try {
          chunks = await collectAttempt(llm.stream(call))
        } catch (error) {
          // A thrown middleware or consumer failure is not a provider outcome
          // this seam can retry; surface it exactly as the unpatched runtime would.
          throw error
```

</details>

**依据 2 · 源码核查**：[lib/index.js:148-171](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L148-L171)

缓冲与缺finish起点。

<details>
<summary>查看原文（24行）</summary>

```text
/** Collect one attempt's chunks, stopping at its terminal finish chunk. */
async function collectAttempt (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
    if (chunk !== null && typeof chunk === 'object' && chunk.type === 'finish') break
  }
  return chunks
}

/**
 * Interpret collected chunks.
 *
 * @returns the terminal failure, or undefined when the attempt succeeded.
 */
function outcomeOf (chunks) {
  for (const chunk of chunks) {
    if (chunk === null || typeof chunk !== 'object' || chunk.type !== 'finish') continue
    const reason = chunk.reason === undefined ? {} : chunk.reason
    if (reason.kind === 'aborted') return { aborted: true, failure: reason.failure }
    if (reason.kind === 'error') return { aborted: false, failure: reason.failure === undefined ? { code: 'UNKNOWN' } : reason.failure }
    return { aborted: false, failure: undefined }
  }
  return { aborted: false, failure: undefined }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L244-L268)

失败尝试被替换的流与info日志。

<details>
<summary>查看原文（25行）</summary>

```text
        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 目前推荐和停止条件是什么？

**研究主题**：采用判断

#### 完整回答

推荐trial，面向已明确主备数据接收者且能保存原历史的长会话维护者。默认不重路由、只限压缩、取消不再备援使范围可控；仍需把fallback当额外调用/隐私面，而非自动零成本恢复。

继续探讨可先用模拟流核失败分类和成本收据，再固定无敏感历史评估摘要与后续任务。若无finish被当成功、关键约束丢失、备援provider数据许可不清、调用成本只见最后一次、effort不受支持或缓存异常，应停止对应route并保留原历史恢复。Q02和Q03结果决定扩大采用，本轮未调用模型。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:183-198](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L183-L198)

空primary和范围可配置。

<details>
<summary>查看原文（16行）</summary>

```text
  /** Read the routing plan. Called per compaction so a settings edit applies at once. */
  const plan = () => {
    if (plain(settings.enabled, true) !== true) return undefined
    const primary = parseTarget(plain(settings.primary, NO_TARGET))
    // A fallback without a primary is meaningless — there is nothing to fail — and
    // treating it as the primary would silently route compaction somewhere the
    // person never chose. No primary means this plugin stays transparent.
    if (primary === undefined) return undefined
    const chain = [primary]
    const fallback = parseTarget(plain(settings.fallback, NO_TARGET))
    if (fallback !== undefined) chain.push(fallback)
    return {
      chain,
      effort: plain(settings.effort, 'high'),
      log: plain(settings.log, true) === true
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L244-L268)

取消/终止处理。

<details>
<summary>查看原文（25行）</summary>

```text
        const { aborted, failure } = outcomeOf(chunks)
        if (aborted || failure === undefined) {
          if (index > 0 && route.log) {
            ctx.logger?.info('[compaction-route] summarized with fallback ' + labelOf(target))
          }
          yield * chunks
          return
        }

        if (signal !== undefined && signal.aborted === true) {
          yield * chunks
          return
        }

        if (isLast) {
          if (route.log) {
            ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); no candidate left')
          }
          yield * chunks
          return
        }

        if (route.log) {
          ctx.logger?.info('[compaction-route] ' + labelOf(target) + ' failed (' + describeFailure(failure) + '); retrying on ' + labelOf(chain[index + 1]))
        }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:148-171](https://github.com/643048695/dsh-compaction-route/blob/6039b260d96652ce4af606f850cd1a179cd9d4f7/lib/index.js#L148-L171)

缺finish边界。

<details>
<summary>查看原文（24行）</summary>

```text
/** Collect one attempt's chunks, stopping at its terminal finish chunk. */
async function collectAttempt (stream) {
  const chunks = []
  for await (const chunk of stream) {
    chunks.push(chunk)
    if (chunk !== null && typeof chunk === 'object' && chunk.type === 'finish') break
  }
  return chunks
}

/**
 * Interpret collected chunks.
 *
 * @returns the terminal failure, or undefined when the attempt succeeded.
 */
function outcomeOf (chunks) {
  for (const chunk of chunks) {
    if (chunk === null || typeof chunk !== 'object' || chunk.type !== 'finish') continue
    const reason = chunk.reason === undefined ? {} : chunk.reason
    if (reason.kind === 'aborted') return { aborted: true, failure: reason.failure }
    if (reason.kind === 'error') return { aborted: false, failure: reason.failure === undefined ? { code: 'UNKNOWN' } : reason.failure }
    return { aborted: false, failure: undefined }
  }
  return { aborted: false, failure: undefined }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
