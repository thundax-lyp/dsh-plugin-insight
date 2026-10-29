# dsh-compaction-route

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[1a01ac7](https://github.com/643048695/dsh-compaction-route/tree/1a01ac738ae1572d139cf5299cc145a2b12df6ff)

<!-- BEGIN META -->

<!-- END META -->

> **功能**：在 DSH 设置页选择会话压缩摘要模型，并配置终止错误后的备用模型。

> **亮点**：插件把主备摘要模型配置与明确错误后的自动切换接入同一压缩调用，减少人工换路线的一个环节；贡献是流程集成，不是新压缩算法。见[Q01](#research-q01)与[Q02](#research-q02)。

> **主要限制**：调用未报错不等于摘要合格，缺 finish 也不会触发备援；界面声明窗口不是实际 token 预算，空推理强度还可能继承上游参数。见[Q02](#research-q02)与[Q03](#research-q03)。

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
  - [Q01 · 谁需要独立选择压缩模型，相比原配置增加什么？](#detail-section-11)
  - [Q02 · 主备选路怎样接入，哪些失败会重试？](#detail-section-12)
  - [Q03 · 配置界面和宿主依赖能否兑现选择意图？](#detail-section-13)
  - [Q04 · 一次合格压缩的成本、效果和恢复负担是什么？](#detail-section-14)
  - [Q05 · 什么人可控试用，什么新机制值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话维护者可为压缩单独配置摘要主备，合格结果仍须保留任务关键事实，不能只看调用结束。见[Q01](#research-q01)。

参照是引擎单一路线后由用户手动更换模型，或先减少历史。宿主无备援来自作者说明，本次未独立核对宿主实现，不作全宿主能力优劣结论。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 压缩模型选路 | 为摘要调用覆盖主模型 | 仅purpose=compaction且主模型非空 |
| 终止错误后备援 | 主失败后用相同历史再试一次 | 仅finish error，不处理语义不合格、缺finish或抛出异常 |
| Web配置卡 | 从宿主模型设置选择主备和推理强度 | 依赖llm-pi-ai、remote.settings与配置插槽；应读回确认 |
| 窗口与同模型提示 | 提醒备援可能无法扩容 | 只比较声明窗口，不预测真实token适配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH/Cordis宿主及Schema包 | 启动必需 | 加载bundle、schema与llm事件 | llm服务未提供时不挂接；包解析失败的宿主行为未验收 |
| llm/stream用途及流结束契约 | 选路必需 | 区分压缩并判断错误 | 契约变化可能导致透传或错误判定失真 |
| Web配置插槽、remote.settings、llm-pi-ai | 界面配置必需 | 枚举模型并保存主备 | 缺服务无法编辑，模型列表可能为空 |
| 主模型及访问权限 | 接管必需 | 执行摘要 | 未配置主模型时透传，服务拒绝时再看备用 |
| 备用模型及同历史数据许可 | 备援必需 | 接收相同历史再试 | 空备用不重试，窗口不足仍可能拒绝 |

具体参数继承与保存返回值边界见[Q03](#research-q03)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认两条路线能处理同一历史，保留原会话 | 权限或数据范围不满足则保留原配置 |
| 加载 | 用户按README安装并启用bundle | 看到配置卡及读回设置；本轮未安装验收 |
| 配置 | 用户选择主备与推理参数 | 重新读取确认，不只看保存文案 |
| 执行 | 宿主发压缩请求，插件按错误类别决定备援 | 非压缩透传，取消和异常不继续重试 |
| 验收 | 用户核对摘要关键事实与全部调用成本 | 不合格则关闭路由、减少历史或手工换模型 |

**效果与成本**

一次失败后的自动切换把操作交给插件，也把第二条路线的历史处理许可与全部尝试核算交给维护者。是否值得保留，应按合格摘要核算而非按成功调用核算；分阶段成本表及尚缺的数据见[Q04](#research-q04)。

本项最可确认的结果是错误分支被接入备援链，尚不能把这一局部恢复等同于完整任务恢复。评估时应将“路由已切换”“摘要保留事实”“后续任务可继续”分开记录，效果表和证据边界见[Q04](#research-q04)。

> **思考**：调用未报错不等于摘要合格，缺 finish 也不会触发备援；界面声明窗口不是实际 token 预算，空推理强度还可能继承上游参数。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件把主备摘要模型配置与明确错误后的自动切换接入同一压缩调用，减少人工换路线的一个环节；贡献是流程集成，不是新压缩算法。见[Q01](#research-q01)与[Q02](#research-q02)。

purpose窄匹配、空主模型透传、每次读取volatile和WeakSet身份隔离值得借鉴，复用前需核对宿主中间件对象身份及事件契约。完整缓冲隔离失败片段，但无专用大小限制；缺finish默认无failure、备用取消也可写成功式日志，不能把日志当摘要验收。作者fake测试覆盖主要分支，本轮仅检查测试源码，没有执行。见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

调用未报错不等于摘要合格，缺 finish 也不会触发备援；界面声明窗口不是实际 token 预算，空推理强度还可能继承上游参数。见[Q02](#research-q02)与[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合能保留原会话并复核摘要的长会话维护者限范围试用。先核对主备的数据许可及配置读回，再以已列关键事实验收摘要；两路均失败或摘要不保真时关闭路由并回原配置。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码支持选路与限定错误后的备援机制；摘要保真、同条件收益与真实宿主兼容没有独立验证。未来尝试记录方案是研究假设。

- 已检查：作者 README、包清单、源码路径 lib/index.js、client/client.js、package.json、cordis.patch.yml、README.md、test/host.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：已检查固定提交的宿主实现、Web配置卡、bundle、package、README与作者测试。未独立核对宿主源码、远端模型与计费；作者测量不作独立效果证据。
- 下一步：可在脱敏同历史上比较手工切换与自动备援，记录全部尝试、错误类别、延迟、费用和关键事实保留；另覆盖缺finish、取消、配置冲突与空effort参数继承。未授权执行，当前均为验证建议。

**分析版本**

- **仓库**：[643048695/dsh-compaction-route](https://github.com/643048695/dsh-compaction-route)
- **版本号**：0.2.0（[固定提交 1a01ac7](https://github.com/643048695/dsh-compaction-route/tree/1a01ac738ae1572d139cf5299cc145a2b12df6ff)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索只记录路线、终止类别、全部 usage 和预算判定的压缩尝试记录，以分清调用恢复与摘要恢复；隐私与排障收益尚未验证。见[Q04](#research-q04)与[Q05](#research-q05)。

可在脱敏同历史上比较手工切换与自动备援，记录全部尝试、错误类别、延迟、费用和关键事实保留；另覆盖缺finish、取消、配置冲突与空effort参数继承。未授权执行，当前均为验证建议。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 348 | — | — | 4040 |
| .js | source | 2 | 685 | 482 | 157 | — |
| .mjs | test | 1 | 174 | 142 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/643048695/dsh-compaction-route/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的压缩模型选路是否为长会话用户提供可控的失败恢复，哪些边界会使其价值不成立？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要独立选择压缩模型，相比原配置增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是一项给 DSH 长会话维护者使用的原生插件。目标任务是在会话压缩时选用独立摘要模型，并在明确的终止错误后自动换一条备用路线。合格结果应是宿主接收可继续工作的摘要，保留当前约束、未完成任务与关键事实；仅收到文本或结束信号还不够。

作者以超长历史在不同模型上分词不同为动机，列出一次约 95 万窗口会话的估算与路线 token 数。它说明了作者遇到的场景，但没有原始请求、服务响应和独立复现记录，本研究不据此确认普遍失败频率或节省比例。真正可核查的增量是 bundle 加载服务端钩子与浏览器配置卡，主模型非空时按用途匹配压缩调用，失败后代替用户手动改模型再重试。

直接替代是保留引擎自己的单一摘要路线，失败后手工改路线，或在压缩前减少历史。插件把一次切换纳入同一调用，不负责重新选择历史、校验摘要保真或修补压缩算法。宿主“没有自动备援”的比较来自作者说明，本次未独立读取对应宿主实现，因此只能确认本插件额外实现的流程，不能宣称它优于当前宿主的全部能力。没有备用服务、很少压缩或可直接固定使用合适模型的人，未必值得增加这一层。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-45](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/README.md#L15-L45)

作者说明长历史失败场景、测量及主备流程；测量为作者报告。

<details>
<summary>查看原文（31行）</summary>

```text
## Why this exists

DSH's compaction engine resolves **one** summarizer from its own composition config and has **no failover**. When the summarization call is rejected it throws, `/compact` reports *"Compaction could not produce a useful summary"*, and nothing else is ever tried.

That matters because the replayed history is sized by DSH's fixed **chars/4** estimate, while every provider tokenizes the *same bytes* differently and enforces its own input ceiling. A history that comfortably fits the model you are *chatting* with can be **too large for the summarizer you picked** — and the whole compaction fails with nothing to catch it.

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

## What it does

Listens on the `llm/stream` waterfall — the single seam every model call passes through — and for `purpose === "compaction"` requests **only**:

1. rewrites the target to the configured **primary**;
2. if that attempt ends in a terminal error chunk, retries the same request on the **fallback**;
3. yields the first attempt that succeeds, or the last attempt's outcome.
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:10-12](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/cordis.patch.yml#L10-L12)

bundle确实插入宿主行，类型为plugin。

```text
- insert:
    - id: compaction-route
      name: dsh-compaction-route
```

**依据 3 · 源码核查**：[lib/index.js:180-219](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L180-L219)

主模型非空且purpose为compaction才接管，增量是选路。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply (ctx, config) {
  const settings = config === undefined || config === null ? {} : config

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
  }

  ctx.inject(['llm'], (scope) => {
    const llm = scope.llm
    if (llm === undefined) {
      ctx.logger?.warn('[compaction-route] no llm service; compaction routing stays inert')
      return
    }

    /**
     * The waterfall listener. Async generator: the value returned here IS the
     * chunk stream the caller iterates.
     */
    const handler = async function * (options, next) {
      if (options === null || typeof options !== 'object') return yield * next()
      if (options.purpose !== COMPACTION_PURPOSE) return yield * next()
      // Our own retry re-enters the waterfall; hand it straight to the adapter.
      if (OWN_CALLS.has(options)) return yield * next()

      const route = plan()
      if (route === undefined) return yield * next()
```

</details>

#### 缺口

- 未取得作者测量的原始请求与独立需求记录。
  **影响**：不能判断失败频率、保真改善或实际用户收益。
  **进一步探讨**：在相同历史与任务上保存脱敏请求、终止结果和摘要验收。
- 未独立核查对应宿主单一路线实现。
  **影响**：原生能力比较仅限作者声明，不能作全宿主优势结论。
  **进一步探讨**：比较固定宿主版本的摘要调用及备援行为。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主备选路怎样接入，哪些失败会重试？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

宿主侧在 llm 服务注入后注册全局且前置的 llm/stream 监听器。它对非对象、非 compaction 用途、自己产生的调用、禁用或未配置主模型的请求直接交回原链。需要接管时，先复制原 options，再覆盖目标 provider/model 与非空推理强度，调用 llm.stream 重新进入调用链；WeakSet 按对象身份识别自己的调用以防自身递归。它仍会经过其他中间件，不能据此保证任意插件组合下只执行一次。

每次尝试先把所有片段存入数组，遇到 finish 即停止。终止原因 error 才触发备用路线；aborted 或 signal 已取消时不继续，抛出的异常直接向上传播。主路线成功只返回主路线片段，主路线失败而备援成功只返回备援片段，全部失败则返回最后一次片段。这种缓冲避免前一次失败文本混入最终摘要，但也推迟了下游看到片段的时间，且数组没有专用大小限制。

最关键的边界是“没有 terminal error”不等于“合格摘要”。流若没有 finish 就结束，outcomeOf 仍给出无 failure，因而不备援；空摘要、截断或丢关键信息只要没有 error 也不触发这层恢复。该结论直接来自默认返回分支，并非已在真实模型上复现的数据损坏。取消发生前主调用已可能耗资源；代码不是在发出第一请求前阻断已取消任务，而是在结果与重试节点检查取消。fallback 返回 aborted 时还会走包含 summarized with fallback 的日志分支，因此这条日志不能独立当作成功验收凭据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:148-172](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L148-L172)

收集到finish停止，缺少finish默认无failure。

<details>
<summary>查看原文（25行）</summary>

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
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:212-276](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L212-L276)

逐分支核查透传、重入、错误备援、取消、日志与最终输出。

<details>
<summary>查看原文（65行）</summary>

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
        }

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
      }
    }

    // \`prepend\` makes this the outermost listener so it wraps every inner
    // middleware and the adapter itself; \`global\` keeps it visible to dispatches
    // from any scope (the compaction engine mounts inside each agent preset's
    // isolated realm).
    scope.on('llm/stream', handler, { global: true, prepend: true })
```

</details>

**依据 3 · 源码核查**：[test/host.test.mjs:115-164](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/test/host.test.mjs#L115-L164)

作者fake测试覆盖备援、全部失败、取消及重入；只读取，未执行。

<details>
<summary>查看原文（50行）</summary>

```text
test("a failed primary is retried on the fallback, and the fallback's chunks are yielded", async () => {
  const fake = scriptedStream({ big: failed(), bigger: ok("fallback summary") });
  const { ctx, fire, logs } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "compaction" }));
  assert.deepEqual(fake.calls.map((c) => c.model), ["big", "bigger"]);
  assert.equal(chunks[0].text, "fallback summary");
  assert.ok(
    logs.some(([, m]) => m.includes("summarized with fallback")),
    "the win must be reported",
  );
});

test("when every candidate fails the last attempt's chunks are yielded, not a retry", async () => {
  const fake = scriptedStream({ big: failed(), bigger: failed("RATE_LIMIT") });
  const { ctx, fire, logs } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "compaction" }));
  assert.equal(fake.calls.length, 2);
  assert.equal(chunks.at(-1).reason.kind, "error");
  assert.ok(logs.some(([, m]) => m.includes("no candidate left")));
});

test("an aborted signal stops the chain instead of trying the fallback", async () => {
  const fake = scriptedStream({ big: failed("ABORTED"), bigger: ok("never used") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const controller = new AbortController();
  controller.abort();
  const chunks = await collect(fire({ purpose: "compaction", signal: controller.signal }));
  assert.deepEqual(fake.calls.map((c) => c.model), ["big"], "cancellation must win");
  assert.equal(chunks.at(-1).reason.kind, "error");
});

test("its own re-entrant dispatch delegates instead of looping", async () => {
  const fake = scriptedStream({ big: ok("summary") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big" });

  await collect(fire({ purpose: "compaction" }));
  const ownCall = fake.calls[0];
  // The runtime re-enters the waterfall with the very object the plugin created;
  // seeing that object again must delegate, or the plugin would recurse forever.
  const replayed = await collect(fire(ownCall));
  assert.equal(replayed.at(-1).from, "next");
  assert.equal(fake.calls.length, 1, "no second dispatch");
});
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 配置界面和宿主依赖能否兑现选择意图？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

安装入口由 package 的默认导出 lib/index.js、Web 客户端导出和 bundle patch 组成；Schema 包是运行依赖。浏览器卡注册 plugins.bundle.config，读取 remote.settings.describe 返回的 llm-pi-ai 命名空间，从 providers.models 生成 provider|model 选项和声明窗口。它保存到 compaction-route 命名空间，并传入 revision 后重新加载；服务不存在时显示不可编辑。主模型为空默认不改变路由，每次压缩重新读取 volatile 配置，用户可通过关闭 enabled 返回原链。

这里有两处应影响配置理解。第一，Schema 的 effort 默认 high，空字符串只使新 call 不额外覆盖 reasoningEffort；由于 call 先展开原 options，若上游已带该字段就会保留。README 与界面所说“跟随模型默认”因此不是所有输入下的保证，应核查实际发往备援模型的参数。第二，界面比较的是各模型声明的 contextWindow，既不对本次历史重新分词，也不扣输出预算。更大的名义窗口不保证可容纳，同窗口下若实际 token 数不同也不能逻辑上断言一定失败；README 的绝对说法超出了这段源码所能支持的范围。

保存函数 await update 后并未像读取函数 valueOf 那样检查返回值的 ok 字段，再 load 后设置已保存文案。若宿主用正常返回的失败结果表达冲突，界面可能显示误导成功；本次没有取得更新接口的确切返回契约，因此这是有明确触发条件的兼容风险，尚不能写成已确认宿主缺陷。保留版本校验与重新读取是值得借鉴的设计，但最终仍应检查读回的主备设置。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-33](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/package.json#L21-L33)

固定包的默认导出、client与bundle入口。

<details>
<summary>查看原文（13行）</summary>

```text
      "default": "./lib/index.js"
    },
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "scripts": {
    "test": "node test/host.test.mjs"
  },
  "files": [
    "lib",
    "client",
    "test",
```

</details>

**依据 2 · 源码核查**：[lib/index.js:76-97](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L76-L97)

默认high、空主备、volatile配置。

<details>
<summary>查看原文（22行）</summary>

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
})
```

</details>

**依据 3 · 源码核查**：[lib/index.js:221-241](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L221-L241)

空effort保留原options中的reasoningEffort。

<details>
<summary>查看原文（21行）</summary>

```text
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

**依据 4 · 源码核查**：[client/client.js:131-173](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/client/client.js#L131-L173)

读取RemoteResult及声明模型窗口，不是实际tokenizer预算。

<details>
<summary>查看原文（43行）</summary>

```text
      /** Resolve a RemoteResult to its value, or undefined on any failure. */
      function valueOf (response) {
        if (response === undefined || response === null) return undefined
        if (response.ok === false) return undefined
        return response.value
      }

      /** Normalise \`settings.describe()\` output: an array or \`{namespaces}\`. */
      function namespacesOf (described) {
        if (Array.isArray(described)) return described
        if (described !== null && typeof described === 'object' && Array.isArray(described.namespaces)) {
          return described.namespaces
        }
        return []
      }

      /** One option per installed model, carrying its provider and window. */
      function optionsOf (namespaces) {
        const llm = namespaces.find((entry) => entry !== null && entry !== undefined && entry.ns === LLM_NS)
        const providers = llm !== undefined && llm.value !== null && typeof llm.value === 'object'
          ? llm.value.providers
          : undefined
        if (providers === null || typeof providers !== 'object') return []
        const rows = []
        for (const provider of Object.keys(providers)) {
          const models = providers[provider] === null || typeof providers[provider] !== 'object'
            ? undefined
            : providers[provider].models
          if (!Array.isArray(models)) continue
          for (const model of models) {
            if (model === null || typeof model !== 'object' || typeof model.id !== 'string') continue
            const window = humanWindow(model.contextWindow)
            rows.push({
              value: provider + SEP + model.id,
              provider,
              model: model.id,
              window: typeof model.contextWindow === 'number' ? model.contextWindow : undefined,
              label: model.id + (window === undefined ? '' : '  \u00b7 ' + window)
            })
          }
        }
        return rows
      }
```

</details>

**依据 5 · 源码核查**：[client/client.js:222-273](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/client/client.js#L222-L273)

加载revision、保存后重读，未显式检查update返回ok。

<details>
<summary>查看原文（52行）</summary>

```text
        const load = React.useCallback(async () => {
          try {
            const settingsApi = remote('remote.settings')
            if (settingsApi === undefined || typeof settingsApi.describe !== 'function') {
              setState('unavailable')
              return
            }
            const namespaces = namespacesOf(valueOf(await settingsApi.describe()))
            setOptions(optionsOf(namespaces))
            const mine = namespaces.find((entry) => entry !== null && entry !== undefined && entry.ns === NS)
            if (mine === undefined) {
              setState('missing')
              return
            }
            const value = mine.value !== null && typeof mine.value === 'object' ? mine.value : {}
            setDraft({
              enabled: value.enabled !== false,
              primary: typeof value.primary === 'string' ? value.primary : '',
              fallback: typeof value.fallback === 'string' ? value.fallback : '',
              effort: typeof value.effort === 'string' ? value.effort : ''
            })
            setRevision(mine.revision)
            setState('ready')
            setNote('')
          } catch (error) {
            setState('failed')
            setNote(t.loadFailed(String(error)))
          }
        }, [t])

        React.useEffect(() => {
          load()
        }, [load])

        const save = React.useCallback(async (change) => {
          setBusy(true)
          setNote('')
          try {
            const settingsApi = remote('remote.settings')
            if (settingsApi === undefined || typeof settingsApi.update !== 'function') {
              setState('unavailable')
              return
            }
            await settingsApi.update(NS, change, revision)
            await load()
            setNote(t.savedRestart)
          } catch (error) {
            setNote(t.saveFailed(String(error)))
          } finally {
            setBusy(false)
          }
        }, [revision, load, t])
```

</details>

**依据 6 · 源码核查**：[client/client.js:309-316](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/client/client.js#L309-L316)

窗口提示只比较contextWindow。

```text
        const primaryInfo = byValue.get(draft.primary)
        const fallbackInfo = byValue.get(draft.fallback)
        const bothKnown = primaryInfo !== undefined && fallbackInfo !== undefined
        const sameModel = bothKnown && draft.primary === draft.fallback
        const smallerWindow = bothKnown &&
          primaryInfo.window !== undefined &&
          fallbackInfo.window !== undefined &&
          fallbackInfo.window <= primaryInfo.window
```

**依据 7 · 源码核查**：[client/client.js:383-402](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/client/client.js#L383-L402)

客户端注入与配置卡注册。

<details>
<summary>查看原文（20行）</summary>

```text
    return {
      /**
       * The client services this card reads. \`slots\` places it, \`locale\` drives its
       * language, \`remote\` carries the settings calls.
       */
      inject: ['slots', 'locale', 'remote', 'remote.settings'],
      /**
       * Register the card into the bundle-configuration seat.
       *
       * @param {object} ctx - the client plugin context.
       */
      apply (ctx) {
        const slots = ctx.slots
        if (slots === undefined || typeof slots.inject !== 'function') return
        const React = require('react')
        const Card = makeCard(React, ctx)
        slots.inject('plugins.bundle.config', () => slots.register({
          name: 'plugins.bundle.config',
          key: 'dsh-compaction-route'
        }, Card))
```

</details>

#### 缺口

- remote.settings.update 的失败返回契约未在本包内定义。
  **影响**：无法确认正常返回失败是否会被误报保存成功。
  **进一步探讨**：核对固定宿主API定义，分别保存冲突与权限拒绝的返回对象。
- README声明兼容0.2.1-rc.3与0.1.7，未独立取得宿主接缝证明。
  **影响**：不能升级为当前桌面环境兼容验收。
  **进一步探讨**：在对应固定宿主核查事件、命名空间和配置接口。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 一次合格压缩的成本、效果和恢复负担是什么？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

计量单位应是“交付一份保留任务关键事实且可继续对话的摘要”，而不是一次模型调用或一次没有报错的 finish。主调用失败后代码把相同 options.messages 随对象展开交给备用 provider，因而可能再次外发整段压缩历史；配置人员必须确认两条路线的权限和数据范围。两次调用的实际计费、延迟与摘要质量均未知，不能把失败调用当免费，也不能由源码推算成功率。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主、Schema依赖及已接入模型服务；金额未知 | 配主备、核对数据外发范围与实际参数；耗时未知 | 不自建新服务，但需要用户已有合法可用路线 |
| 持续使用 | 每次主请求，错误后最多一次备援；完整响应片段暂存内存 | 核查关键事实、路线日志与账单 | 输入输出token、实际延迟和费用未知 |
| 失败恢复 | 原请求与备援均可能消耗资源，再次压缩另计 | 区分异常、取消、缺finish和内容不合格，保留原历史 | 插件不会因语义不合格而自动重试 |
| 退出 | 关闭enabled后回原链；已发生调用不能撤回 | 恢复原摘要配置并检查摘要结果 | 不提供历史内容回滚或备援服务数据删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 自动换摘要路线 | 明确terminal error后有一次备援分支 | 真实服务成功率及节时 |
| 防止失败片段污染输出 | 每次尝试独立收集，仅返回选定尝试 | 下游摘要是否完整且可继续任务 |
| 窗口提示 | 比较声明的主备contextWindow | 同一历史的真实token预算、输出余量与接入端限制 |

作者给出的 token 数仅作问题线索，未作为本轮费用或效果实测。日志保留失败概述，最终调用者只得到最后或成功尝试的片段，前次 usage 不会作为同一流交还；若只按最终流统计，可能漏算失败尝试。但实际计费系统是否另行记录不在本包范围，不能断言账单必然错误。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:225-268](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L225-L268)

原options复用、片段缓冲和仅返回选定尝试解释资源与成本边界。

<details>
<summary>查看原文（44行）</summary>

```text
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
        }

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

**依据 2 · 作者声明**：[README.md:21-37](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/README.md#L21-L37)

作者测量无原始请求，本研究不将其转成独立效果。

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

**依据 3 · 作者声明**：[README.md:108-114](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/README.md#L108-L114)

作者承认引擎事件目标与实际选路可不同。

```text
## Notes and limits

- **Retry is on terminal error chunks only.** A thrown middleware or consumer failure is surfaced exactly as the unpatched runtime would — this seam does not swallow it.
- **Cancellation wins.** An aborted call is never retried.
- **Only compaction is touched.** `purpose` is the discriminator, so nothing else is rerouted.
- **The engine's own event still records its configured target.** `compaction/summary` reports the engine's `summarizationProvider` / `summarizationModel`, not this plugin's override; a fallback win shows up as this plugin's log line instead. Point the engine's own row at the same primary if you want the session log to agree.
- **Not a substitute for a smaller history.** If the replay exceeds *every* window you have, no fallback helps; that is a compaction-policy problem, not a routing one.
```

#### 缺口

- 没有同任务合格摘要、全部尝试usage与账单记录。
  **影响**：单位合格任务成本和净收益无法量化。
  **进一步探讨**：固定相同脱敏历史，对比手工切换与自动备援，记录全部调用、人工纠错与关键事实保留。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人可控试用，什么新机制值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可让有两条已获准处理同一历史的模型路线、能保留原会话并检查摘要的长会话维护者小范围试用。先在可恢复的非敏感会话配置主备，读回配置，再观察一次正常压缩与一次可识别的主路线终止错误；核对实际路线、取消是否阻止备援，以及摘要能否保留明确列出的任务约束。正常对话应继续走原链。此处是可执行建议，本轮未运行这些步骤，也没有据作者测试宣布安装通过。

对只有一条合适路线、没有备援数据许可，或希望自动保证语义完整的人，应先保留原配置。若两个模型都拒绝历史、保存后读回不一致、取消后仍继续备援，或关键事实丢失，就关闭enabled并回原摘要路线，必要时减少历史后人工重试；关闭只能阻止后续接管，不能撤回已经外发的历史或修复已生成摘要。

由逐次缓冲但只返回选定尝试、声明窗口不等于实际输入预算，可提出未验证假设：增加轻量的“每次压缩尝试记录”，保留路线、终止类别、全部usage和预算判定，缺少finish明确记为不完整，并在可取得各路线token估计时预检。相对当前一次日志，它可能帮助区分“调用恢复”与“合格摘要恢复”，并暴露重试总成本；它也新增隐私字段、存储与不同提供商适配负担。

最小验证应先用脱敏固定历史比较现有方案与只加记录的方案，覆盖主成功、主错误后备成功、两次失败、取消、缺finish与无用摘要，分别核对尝试数、全部usage和人工判断是否更准确。只有减少漏计与误判且未增加敏感历史留存、未改变原任务结果，才值得继续做预算预检；若记录无法与实际账单对齐或排障没有改善，就停止扩展。该假设不计入插件已经实现的创新或收益。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:184-219](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L184-L219)

关闭或空主模型可回原链，构成可逆试用前提。

<details>
<summary>查看原文（36行）</summary>

```text
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
  }

  ctx.inject(['llm'], (scope) => {
    const llm = scope.llm
    if (llm === undefined) {
      ctx.logger?.warn('[compaction-route] no llm service; compaction routing stays inert')
      return
    }

    /**
     * The waterfall listener. Async generator: the value returned here IS the
     * chunk stream the caller iterates.
     */
    const handler = async function * (options, next) {
      if (options === null || typeof options !== 'object') return yield * next()
      if (options.purpose !== COMPACTION_PURPOSE) return yield * next()
      // Our own retry re-enters the waterfall; hand it straight to the adapter.
      if (OWN_CALLS.has(options)) return yield * next()

      const route = plan()
      if (route === undefined) return yield * next()
```

</details>

**依据 2 · 源码核查**：[lib/index.js:244-268](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/lib/index.js#L244-L268)

终止类别与日志支持停止判据和尝试记录假设。

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

**依据 3 · 源码核查**：[test/host.test.mjs:82-173](https://github.com/643048695/dsh-compaction-route/blob/1a01ac738ae1572d139cf5299cc145a2b12df6ff/test/host.test.mjs#L82-L173)

作者测试提供试用分支线索，不是本轮执行结果。

<details>
<summary>查看原文（92行）</summary>

```text
test("chat turns and other purposes fall through untouched", async () => {
  const fake = scriptedStream({});
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "chat", model: "x" }));
  assert.equal(chunks.at(-1).from, "next", "the host handler must be used unchanged");
  assert.equal(fake.calls.length, 0, "no compaction call was issued");
});

test("an empty primary keeps the plugin transparent", async () => {
  const fake = scriptedStream({});
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "compaction", model: "engine-default" }));
  assert.equal(chunks.at(-1).from, "next");
  assert.equal(fake.calls.length, 0, "a fallback without a primary must not route anything");
});

test("a compaction call is rewritten to the configured primary and effort", async () => {
  const fake = scriptedStream({ big: ok("summary") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", effort: "high" });

  const chunks = await collect(fire({ purpose: "compaction", provider: "engine", model: "engine-default" }));
  assert.deepEqual(chunks.map((c) => c.type), ["text", "finish"]);
  assert.equal(fake.calls.length, 1);
  assert.equal(fake.calls[0].provider, "openrouter");
  assert.equal(fake.calls[0].model, "big");
  assert.equal(fake.calls[0].reasoningEffort, "high");
});

test("a failed primary is retried on the fallback, and the fallback's chunks are yielded", async () => {
  const fake = scriptedStream({ big: failed(), bigger: ok("fallback summary") });
  const { ctx, fire, logs } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "compaction" }));
  assert.deepEqual(fake.calls.map((c) => c.model), ["big", "bigger"]);
  assert.equal(chunks[0].text, "fallback summary");
  assert.ok(
    logs.some(([, m]) => m.includes("summarized with fallback")),
    "the win must be reported",
  );
});

test("when every candidate fails the last attempt's chunks are yielded, not a retry", async () => {
  const fake = scriptedStream({ big: failed(), bigger: failed("RATE_LIMIT") });
  const { ctx, fire, logs } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const chunks = await collect(fire({ purpose: "compaction" }));
  assert.equal(fake.calls.length, 2);
  assert.equal(chunks.at(-1).reason.kind, "error");
  assert.ok(logs.some(([, m]) => m.includes("no candidate left")));
});

test("an aborted signal stops the chain instead of trying the fallback", async () => {
  const fake = scriptedStream({ big: failed("ABORTED"), bigger: ok("never used") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big", fallback: "openrouter|bigger" });

  const controller = new AbortController();
  controller.abort();
  const chunks = await collect(fire({ purpose: "compaction", signal: controller.signal }));
  assert.deepEqual(fake.calls.map((c) => c.model), ["big"], "cancellation must win");
  assert.equal(chunks.at(-1).reason.kind, "error");
});

test("its own re-entrant dispatch delegates instead of looping", async () => {
  const fake = scriptedStream({ big: ok("summary") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { primary: "openrouter|big" });

  await collect(fire({ purpose: "compaction" }));
  const ownCall = fake.calls[0];
  // The runtime re-enters the waterfall with the very object the plugin created;
  // seeing that object again must delegate, or the plugin would recurse forever.
  const replayed = await collect(fire(ownCall));
  assert.equal(replayed.at(-1).from, "next");
  assert.equal(fake.calls.length, 1, "no second dispatch");
});

test("disabled leaves the engine alone", async () => {
  const fake = scriptedStream({ big: ok("summary") });
  const { ctx, fire } = makeCtx(fake.stream);
  apply(ctx, { enabled: false, primary: "openrouter|big" });

  const chunks = await collect(fire({ purpose: "compaction" }));
  assert.equal(chunks.at(-1).from, "next");
  assert.equal(fake.calls.length, 0);
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
