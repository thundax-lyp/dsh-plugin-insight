# dsh-model-failover

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b762ec0](https://github.com/Airisey/dsh-model-failover/tree/b762ec038fc2d47a0504ae55af0fdab3162367ee)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover)
<!-- END META -->

> **实现功能**：把已接入 DSH 的模型组成队列，提供失败重试、切换、会话隔离与自动继续。

> **核心亮点**：以可见输出提交点控制切换，并将会话×模板隔离纳入恢复队列，相比手工 provider 切换有明确流程增量。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：可见输出提交不等于业务事务完成，轮级自动继续可能重做非幂等动作；有限重试也扩大总预算。没有复现重复写入，保留风险性质。见 [Q03](#research-q03)。

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
  - [Q01 · 接力相对手工切换改变什么？](#detail-section-11)
  - [Q02 · 提交点如何限制跨模型混流？](#detail-section-12)
  - [Q03 · 自动继续有什么边界与额外代价？](#detail-section-13)
  - [Q04 · 部署依赖和操作流程是什么？](#detail-section-14)
  - [Q05 · 可推导什么恢复验证？](#detail-section-15)
  - [Q06 · 什么任务适合试用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多模型 DSH 用户在配额和短时故障下保持可回滚任务推进，验收最终任务而非吐字。

简单替代是手工切换已接入 provider 或只用宿主 retry；本插件增加队列隔离和流提交控制，但效果须等预算对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 队列模型 | 一个模型选择映射多候选 | 各 provider 先可用 |
| 提交前切换 | 避免不同模型无声混流 | 工具事务完成不由此保证 |
| 自动继续 | 截断或轮失败后继续 | agents 必需，有限但会扩大预算 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19 或≥24、DSH llm | 启动必需 | 注册 wrapper provider | 接力无法运行 |
| 已可用候选 provider | 任务必需 | 承担真实模型请求 | 队列会耗尽，不能自行修复凭据 |
| agents | 自动继续必需 | turn/end 与 followup | 仅保留调用级接力 |
| webServer/Web client | 设置界面可选 | 队列配置与状态 | 无 Web 不等于 llm 路由失效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户逐候选验收并编队 | 凭据、模态和窗口满足任务 |
| 2 | 用户设置重试/继续上限并选择模板 | 可见输出不混流，失败预算可控 |
| 3 | 用户测试取消、工具恢复和禁用 | 无停止后继续或重复动作，否则回退手工切换 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多 provider、宿主及测试调用，金额未知 | 队列/兼容/继续上限配置，耗时未知 | 每个后端先独立可用 |
| 持续使用 | 失败调用、候选重试和继续上下文 | 检查隔离与模型变动 | 无单位合格交付成本实测 |
| 失败恢复 | 重试/等待及回滚资源未知 | 对账重复动作、解除隔离 | 不保证事务幂等 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 接力 | 提交前缓存、候选切换存在 | 实际合格任务率 |
| 恢复边界 | 用户取消和部分错误被排除 | 工具 exactly-once 与宿主兼容 |
| 成本 | 外层重试关闭避免整队重跑 | 总现金、时延及人工节省 |

> **思考**：可见输出提交不等于业务事务完成，轮级自动继续可能重做非幂等动作；有限重试也扩大总预算。没有复现重复写入，保留风险性质。见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以可见输出提交点控制切换，并将会话×模板隔离纳入恢复队列，相比手工 provider 切换有明确流程增量。见 [Q01](#research-q01)、[Q02](#research-q02)。

以可见输出提交点控制切换，并将会话×模板隔离纳入恢复队列，相比手工 provider 切换有明确流程增量。见 [Q01](#research-q01)、[Q02](#research-q02)。

commitsAnswer 将 reasoning 与用户可见结果区分，是可复用的流提交边界；外层 retry 关闭避免双重重试。移植必须对齐宿主事件与工具 delta 语义，轮级继续需要额外事务约束，不能只复制错误码表。

<a id="detail-section-5"></a>

### 1.4 主要限制

可见输出提交不等于业务事务完成，轮级自动继续可能重做非幂等动作；有限重试也扩大总预算。没有复现重复写入，保留风险性质。见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有限试用可回滚任务，先设总尝试上限并验证取消、隔离和副作用；不可逆操作暂缓。见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持提交前接力与有限继续；任务正确性、调用总成本和工具副作用未验证；事务状态恢复假设未验证。

- 已检查：作者 README、包清单、源码路径 index.js、lib/adapter.js、lib/autocontinue.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码核查，不执行插件、测试或模型调用；未审计全部 Web API 与持久化安全，不将作者测试当本研究运行。
- 下一步：以固定故障矩阵测合格交付、总调用成本、恢复耗时、用户取消及工具重复写入，完整记录宿主和模型版本。

**分析版本**

- **仓库**：[Airisey/dsh-model-failover](https://github.com/Airisey/dsh-model-failover)
- **版本号**：1.0.0（[固定提交 b762ec0](https://github.com/Airisey/dsh-model-failover/tree/b762ec038fc2d47a0504ae55af0fdab3162367ee)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证的提交状态与工具副作用确认联动，可能改善安全恢复；四处故障注入比较重复写入和合格率，若牺牲恢复而无收益即否定。见 [Q05](#research-q05)。

以固定故障矩阵测合格交付、总调用成本、恢复耗时、用户取消及工具重复写入，完整记录宿主和模型版本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 5317 | 3387 | 1609 | — |
| .md | source | 1 | 342 | — | — | 7682 |
| .mjs | test | 4 | 5234 | 4195 | 473 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+created%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Airisey/dsh-model-failover/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T03%3A22%3A47.788Z..2026-10-26T03%3A22%3A47.788Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：模型接力是否能在不混合回答、不扩大副作用的条件下改善 DSH 模型故障恢复？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 接力相对手工切换改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合已接入多个模型、重复遭遇配额或短时上游失败的 DSH 使用者。合格交付应是同一业务任务正确办结，而非仅队列中某模型吐字。作者把一条候选队列暴露为一个模型，用户只选模板即可由插件处理模型重试与切换。相对人工换 provider，增量是将失败记忆、会话×模板隔离和轮级继续组织成恢复流程；wrapper adapter 模式本身由既有宿主模式继承。它可能减少人工接管，但没有同任务成功率及总成本对照，不能把作者“直到任务跑完”当保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-23](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/README.md#L1-L23)

作者目标和队列恢复行为

<details>
<summary>查看原文（23行）</summary>

```text
# 模型接力 · dsh-model-failover

把 **已经接入 dsh 的全部模型**排成优先级队列，再把这个插件本身当成**一组「模型」**——
**一条队列就是模型选择器里的一个模型**。用户在模型选择里挑中哪条（默认那条叫
`默认模板`，也可以自己新建、改名），任务就按那条队列的顺序去跑：靠前的先上，不行就自动
往下换，直到任务跑完。

## 它解决什么

一个模型不能输出，往往是这几种：额度用尽、余额不足、key 失效、路由挂了、上游 5xx。
以前遇到这些，任务当场就断了。现在：

1. 先用**第一个**模型跑；
2. 它出问题 → 把**同一个请求原样**再发几次（默认 2 次，为了换掉背后那个坏账号），
   还是不行再补一句「继续」试一次；
3. 仍然不行 → 换**第二个**模型，这一跳补上「继续」，接着跑；
4. 依次往下，直到某个模型把任务跑完；
5. 某个模型今天在这个会话里出过这种问题 → **这个会话今天不再从它开始**，直接用排在它后面、
   已经验证过能用的那个（别的会话照常可以先用它）；
6. 到了**第二天设定时间**（默认 01:00，可改），隔离自动清空，重新从第一个开始试。

另外，**整轮**以失败告终、或被 token 上限截断时（模型自己没坏，只是这一轮没跑完），
插件会替你自动补一句「继续」接着做 —— 见下面的「DSH 异常」。
```

</details>

**依据 2 · 源码核查**：[lib/adapter.js:13-24](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L13-L24)

wrapper 模式归属与提交边界

<details>
<summary>查看原文（12行）</summary>

```text
 * 本插件是「包装路由」（wrapper route）：在自己的 stream() 体内再调用一次
 * ctx.llm.stream()，把 provider/model 换成队列里的真实模型。modlens、
 * vision-router 用的都是这个模式，dsh-cost-meter 的注释里把它写得很明确。
 *
 * 整个设计的关键只有一条 —— **提交点**：
 * 候选模型产出的 chunk 先全部扣在手里，直到出现「用户会看见的答案内容」
 * （非空白 text-delta、tool-call-delta，或非 reasoning 的 block-end）才整批
 * 放行。在此之前失败，这一整轮就被整根丢掉，调用方一个字节都没看见，于是
 * 换模型是无声的、不会把两个模型的文字拼在一起。
 *
 * reasoning 的 delta 故意不算提交点：「思考了一分钟然后撞上额度墙」正是最
 * 值得切换的情形，扣住的思考跟着这一轮一起丢，调用方根本不知道发生过。
```

</details>

**依据 3 · 源码核查**：[lib/adapter.js:245-259](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L245-L259)

模板作为模型暴露

<details>
<summary>查看原文（15行）</summary>

```text
  /**
   * 这条路由下的「模型」就是队列模板：一个模板一条队列。
   *
   * 用户在模型选择器里挑中哪个模板，那个会话就用哪条队列 —— 模板 id 会原样
   * 出现在 `GenerateOptions.model` 里，`stream()` 拿它选队列。
   */
  async listModels(provider) {
    const settings = this.settings.get()
    const templates = Array.isArray(settings.templates) ? settings.templates : []
    return templates.map((template) => ({
      provider,
      id: template.id,
      name: template.name,
      description: MODEL_DESCRIPTION,
      inputModalities: ['text', 'image'],
```

</details>

#### 缺口

- 未见同任务手工切换与自动接力对照
  **影响**：无法量化实际恢复收益
  **进一步探讨**：固定模型与预算比较合格交付率、人工次数、总调用量

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提交点如何限制跨模型混流？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

适配器先缓存候选 chunk，直到非空文本、tool-call-delta 或非 reasoning block-end 才向调用者放行。仅 reasoning 不提交，故思考阶段失败可以丢弃并换模型；已提交内容后不能再无声替换，stream 看到 committed 后记录可用并返回。这个提交点比简单“收到任意事件即成功”更贴近调用者可见产品，是可借鉴的机制；同时它解决的是单次模型调用的输出混合，不等于工具业务事务的 exactly-once。工具 delta 出现即提交，后续实际工具是否已经执行由宿主负责，轮级自动继续可能再次操作，必须另验收任务幂等。providerRetryPolicy 关闭外层重试，避免宿主再将整队候选重复跑一遍；移植时需复核 retry 契约形状。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:100-107](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L100-L107)

可见输出提交判据

```text
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

**依据 2 · 源码核查**：[lib/adapter.js:231-238](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L231-L238)

关闭整队外层重试

```text
  /**
   * 接力队列自己做重试与切换，所以这条路由对外声明「不做重试」。
   *
   * 否则 llm-retry 会把整条队列再跑一遍：每一轮都要等每个坏模型各自超时，
   * 延迟成倍放大，而队列本身已经把「所有候选都试过」这件事做完了。
   */
  providerRetryPolicy(_provider) {
    return { mode: 'normal', maxRetries: 0, retryableCodes: [NEVER_RETRY], ...DEFAULT_BACKOFF }
```

**依据 3 · 源码核查**：[lib/adapter.js:516-523](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L516-L523)

提交后返回，避免继续切模型

```text
      if (result.committed) {
        // 这一轮正常写完了：撞上限的旧账一笔勾销，下一个任务还从队首开始。
        if (userFacing && sessionId !== undefined) this.ceiling.delete(sessionId)
        // 这个模型今天被验证过能用了；下一个任务从它开始。
        const recorded = this.health.markGood(key, this.now(), sessionId, templateId)
        this.health.file.flush()
        if (recorded) this.log.push({ at: this.now(), kind: 'good', provider, model, attempts: index + 1 })
        return
```

**依据 4 · 源码核查**：[lib/adapter.js:669-740](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L669-L740)

嵌套调用与缓存放行

<details>
<summary>查看原文（72行）</summary>

```text
   * 返回 `{ committed, truncated, finish, failure, held, speed }`。`held` 在未提交时
   * 交还给调用方 —— 队列还有下一个候选就丢掉它，队列走完了就原样放出去。
   * `speed` 是这一趟的输出速度（`{ tokens, ms }`），没跑出东西时是 `undefined`。
   *
   * `truncated` 单独拎出来，是因为「撞到输出上限」既不是成功也不是失败：
   * 见下面 `failureOf` 之前的注释。
   */
  async * #attempt(candidate, options, messages, effort) {
    const nested = { ...options, provider: candidate.provider, model: candidate.model, messages }
    // 调用方给「模型接力」这条路由选的档位不能原样透给候选：它是在队列的并集上
    // 校验过的，候选未必认识。这一轮该不该带档位由 `#effortFor` 决定，所以这里
    // 显式删掉，避免它顺着 `...options` 漏下去。
    if (effort === undefined) delete nested.reasoningEffort
    else nested.reasoningEffort = effort
    let iterator
    try {
      iterator = this.llm.stream(nested)[Symbol.asyncIterator]()
    } catch (error) {
      return { committed: false, finish: undefined, failure: failureOf(undefined, error), held: [] }
    }

    const held = []
    let committed = false
    let finish
    let failure
    let drained = false
    // 输出速度的两个端点：第一个真的在写字（或想事情）的 chunk，和收到 finish
    // 的那一刻。**不含**排队与首字延迟 —— 那是延迟，不是速度，混进来会让一个
    // 「想很久但写得很快」的推理模型显得很慢。
    let firstDeltaAt
    let finishedAt
    let outputTokens

    try {
      for (;;) {
        let row
        try {
          row = await iterator.next()
        } catch (error) {
          drained = true
          failure = failureOf(undefined, error)
          break
        }
        if (row.done === true) {
          drained = true
          break
        }
        const chunk = row.value
        if (chunk !== null && typeof chunk === 'object') {
          if (chunk.type === 'finish') {
            finish = chunk
            finishedAt = this.now()
          } else if (chunk.type === 'usage') {
            if (Number.isFinite(chunk.usage?.outputTokens)) outputTokens = chunk.usage.outputTokens
          } else if (
            firstDeltaAt === undefined &&
            (chunk.type === 'text-delta' || chunk.type === 'reasoning-delta' || chunk.type === 'tool-call-delta')
          ) {
            firstDeltaAt = this.now()
          }
        }
        if (committed) {
          yield chunk
          continue
        }
        held.push(chunk)
        if (commitsAnswer(chunk)) {
          committed = true
          for (const pending of held) yield pending
          held.length = 0
        }
      }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动继续有什么边界与额外代价？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

自动继续分两层：候选调用中同模型重试保持原请求，切模型追加最多3条继续；turn/end 层对截断或失败可发送真正用户消息。后者是全局 agents 监听能力，不限于接力 provider，需用户明确配置和理解作用范围。源码为失败和截断分别计数，排除 aborted、上下文超长和本机网络等情形，说明有边界设计；但有限次重试仍会增加已付出的失败调用、等待和上下文，不保证便宜。预算单位应是最终合格交付而非最后成功一跳。最强质疑是“可见输出已出现”与“任务事务完成”不同：自动继续读到部分状态，可能重复非幂等工具。当前没有执行副作用重放实验，不能判已发生重复，也不能保证不会发生。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:50-54](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L50-L54)

同模型尝试次数

```text
function sameModelTries(settings) {
  const raw = settings?.sameModelRetries
  if (Number.isInteger(raw) && raw >= 0) return Math.min(raw, MAX_SAME_MODEL_RETRIES) + 1
  return (settings?.retrySameModelOnce === false ? 0 : 2) + 1
}
```

**依据 2 · 源码核查**：[lib/adapter.js:461-490](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L461-L490)

切换追加继续与嵌套调用

<details>
<summary>查看原文（30行）</summary>

```text
    for (const [index, step] of steps.entries()) {
      const { provider, model } = step.candidate
      const key = routeKey(provider, model)
      const continues = networkDown ? 0 : step.continues

      // 带「继续」的那一跳之前先等一等 —— 等的是上一次失败留下的余波。
      // 不带的跳（每个候选的首发）不欠这一等，否则第一次调用就会平白慢 5 秒。
      if (continues > 0 && delayMs > 0) {
        await this.sleep(delayMs, options?.signal)
        // 等待期间用户按了停止：别再打一个注定被取消的请求。
        if (options?.signal?.aborted === true) {
          for (const chunk of held) yield chunk
          return
        }
      }

      const messages = continues === 0
        ? options.messages
        : [...options.messages, ...Array.from({ length: continues }, () => continueMessage(continueText))]

      const effort = this.#effortFor(step.candidate, options?.reasoningEffort)
      // 标记「此刻正在跑的就是这一跳」，会话页据此把这一栏刷得快一点、并把还没
      // 跑完任何一趟的会话也列出来。只包住真正的请求：上面等待和下面记账都不算
      // 「正在跑」，否则用户会看到一行永远亮着的「运行中」。
      if (sessionId !== undefined) {
        this.live.set(sessionId, { provider, model, key, startedAt: this.now() })
      }
      let result
      try {
        result = yield * this.#attempt(step.candidate, options, messages, effort)
```

</details>

**依据 3 · 源码核查**：[lib/autocontinue.js:23-39](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/autocontinue.js#L23-L39)

两类轮级次数与用户停止边界

<details>
<summary>查看原文（17行）</summary>

```text
 * ── 无限循环是怎么被摁住的 ────────────────────────────────────────────
 *
 * 「失败 → 继续 → 又失败」是个天然的发散结构，靠三道闸：
 *
 *   1. `autoContinueFailureLimit` / `autoContinueMaxTokensLimit`：同一段连续
 *      补发里，两种结局**各自**最多自动补几次。用满就停。
 *   2. 用户自己发消息会**重置**计数（`turn/start` 时发现不是我们发起的轮
 *      就清零），所以「停手以后用户再试一次」不会因为历史计数被拒。
 *   3. 轮到 `completed` 一律清零。
 *
 * 为什么分成两个数：撞上限是「没写完」，接着写就行，默认给到 10；运行失败
 * 往往是「这个任务现在做不下去」，再问一遍大概率还是同一个结局，默认只补
 * 1 次。共用一个计数器的话，一段连着撞上限的长文档会把失败那份额度也吃掉，
 * 反过来一次失败又会掐掉本该继续的长文档。
 *
 * 另外 `aborted`（用户按了停止）永远不触发：用户喊停的时候，替他再发一句
 * 是十足的冒犯。
```

</details>

**依据 4 · 源码核查**：[lib/autocontinue.js:95-112](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/autocontinue.js#L95-L112)

触发排除逻辑

<details>
<summary>查看原文（18行）</summary>

```text
export function autoContinueTrigger(reason, settings) {
  if (reason === null || typeof reason !== 'object') return undefined
  if (settings?.autoContinue !== true) return undefined

  if (reason.kind === 'max-tokens') {
    return settings.autoContinueOnMaxTokens === false ? undefined : 'max-tokens'
  }

  if (reason.kind === 'error') {
    if (settings.autoContinueOnFailure === false) return undefined
    const code = typeof reason.error?.code === 'string' ? reason.error.code : ''
    if (AUTO_CONTINUE_SKIP_CODES.has(code)) return undefined
    // 本机网络没通：重发救不回来，只会白烧一次上限。
    if (isLocalNetworkFailure(reason.error)) return undefined
    return 'error'
  }

  return undefined
```

</details>

#### 缺口

- 同版本工具副作用、全局继续与预算放大未验收
  **影响**：限制高风险业务任务采用
  **进一步探讨**：故障注入后比对工具幂等键、实际写入次数、全部调用账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署依赖和操作流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包是 private 的 Git 源码插件，Node 要求 ^22.19 或≥24，宿主 Cordis ^4.0.2。llm 是强依赖；webServer 与 agents 分开注入，因此无 Web 的组合仍可有接力路由，但没有 agents 就不能提供轮级自动继续。用户首先要让每个候选 provider 独立可用，再编排模板；连接测试并不证明长上下文或工具调用可办结。失败恢复包括查看会话隔离、解除指定会话、核对重置时间和禁用自动继续。不同模型的模态、上下文及 reasoning 支持需在真实任务检查，不能从列表宣称 text/image 推断每个后端兼容。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/package.json#L1-L16)

private 包、入口与 Node 要求

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "dsh-model-failover",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "模型接力 — 把已接入 dsh 的全部模型排成一条优先级队列，用它当模型跑任务：额度耗尽或模型无法输出时自动重试「继续」，再不行就切到下一个模型，直到任务跑完；当天出过问题的模型会被隔离，次日设定时间后自动复活。",
  "main": "./index.js",
  "exports": {
    ".": "./index.js",
    "./client": "./client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
```

</details>

**依据 2 · 源码核查**：[index.js:55-60](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/index.js#L55-L60)

llm 强依赖、Web 非强依赖

```text
 *
 * `webServer` **故意不在这里** —— 它只影响设置页能不能连上后端，而 headless
 * 组合（TUI、离线测试）根本没有 HTTP 服务。把它写进 inject 会让整个插件在
 * 那些组合里静默不加载，连接力本身一起丢掉。它由下面的 ctx.inject 按需取得。
 */
export const inject = ['llm']
```

**依据 3 · 源码核查**：[index.js:747-772](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/index.js#L747-L772)

webServer 与 agents 可选注入

<details>
<summary>查看原文（26行）</summary>

```text
  ctx.inject(['webServer'], (scoped) => {
    const server = scoped.webServer
    scoped.effect(
      () => server.register({ kind: 'prefix', path: API_PREFIX, handler: api }),
      'model-failover: settings API',
    )
    logger.info?.(`model-failover: 设置接口已挂载到 ${API_PREFIX}`)
  })

  // ── 本轮失败 / 输出撞上限时，自动补一句「继续」 ────────────────────────────
  // `agents` 和 `webServer` 一样**故意不写进 inject**：headless 组合（TUI、
  // 离线测试）里没有它，写进去会让整个插件静默不加载，连接力一起丢掉。
  ctx.inject(['agents'], (scoped) => {
    const autoContinue = new AutoContinue({
      agents: scoped.agents,
      settings: settingsFile,
      notes,
      log: {
        info: (message) => logger.info?.(`model-failover: ${message}`),
        warn: (message) => logger.warn?.(`model-failover: ${message}`),
        push: (event) => pushEvent(event),
      },
    })
    scoped.effect(() => autoContinue.attach(scoped), 'model-failover: auto continue')
    logger.info?.('model-failover: 已接管「本轮失败 / 输出撞上限」时的自动「继续」')
  })
```

</details>

**依据 4 · 源码核查**：[lib/adapter.js:251-259](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L251-L259)

列表宣称输入模态

```text
  async listModels(provider) {
    const settings = this.settings.get()
    const templates = Array.isArray(settings.templates) ? settings.templates : []
    return templates.map((template) => ({
      provider,
      id: template.id,
      name: template.name,
      description: MODEL_DESCRIPTION,
      inputModalities: ['text', 'image'],
```

#### 缺口

- 候选模型兼容和真实宿主注册未运行
  **影响**：模板可见不等于后端任务可用
  **进一步探讨**：逐候选验收文本、工具、图像及上下文限制

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可推导什么恢复验证？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把恢复策略从“错误码+可见输出”扩展为“提交前/提交后+工具副作用确认状态”，能在保持故障恢复的同时减少重复写入。依据是 Q02 的流提交点已可用，而 Q03 的轮级继续并不知道业务事务状态。最小验证以一项可幂等文件写任务和一项模拟非幂等计数任务，在 reasoning、首个 tool delta、工具执行后与 finish 前四个位置注入失败，对照当前策略与只读恢复摘要；统计重复写次数、合格率、人工修复及调用成本。若收益只能靠全面禁止工具换来，或重复率不降而恢复率下降，则否定该方向。需要宿主明确提供工具结果/幂等状态，不用插件自行猜测事务完成。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:100-107](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L100-L107)

现有提交点可作为分层信号

```text
export function commitsAnswer(chunk) {
  if (chunk === null || typeof chunk !== 'object') return false
  if (chunk.type === 'text-delta') return typeof chunk.text === 'string' && chunk.text.trim() !== ''
  if (chunk.type === 'tool-call-delta') return true
  if (chunk.type !== 'block-end') return false
  if (chunk.block?.type === 'reasoning') return false
  if (chunk.block?.type === 'text') return typeof chunk.block.text === 'string' && chunk.block.text.trim() !== ''
  return true
```

**依据 2 · 源码核查**：[lib/autocontinue.js:164-179](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/autocontinue.js#L164-L179)

轮结束层的继续计数

<details>
<summary>查看原文（16行）</summary>

```text
 * 监听 `turn/end`，在「本轮失败」和「输出撞上限」两种结局下自动补一句「继续」。
 */
export class AutoContinue {
  #agents
  #settings
  #log
  #notes
  #now
  #pendingTtlMs
  #sleep
  /**
   * 每个会话、每种触发原因**连续**自动补发了几次。
   *
   * 键是 `sessionId`，值是 `{ 'max-tokens'?: number, error?: number }`。两种结局
   * 各算各的，因为它们的上限是两个独立设置（默认 10 和 1）。
   * 用户自己发言的 `turn/start` 与 `completed` 会把整条记录清掉。
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么任务适合试用？

**研究主题**：采用判断

#### 完整回答

建议有限试用，优先阅读、草稿或可回滚的开发任务；有多个已独立验证的 provider，且能设置总尝试与轮级继续上限时，接力可减少手工换模型。金融、发布、消息发送等不可逆工具任务先观察，不能将自动继续视作业务补偿。试用成功标准是对同任务在等预算下提高合格交付或减少人工，且无取消后续跑、跨会话隔离污染、重复写入。若只提高吐字率却增加总成本或错误，停止试用。没有执行同版本安装和卸载，不给持续安装建议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/adapter.js:568-575](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/adapter.js#L568-L575)

用户取消与不可接力错误退出

```text
      // 用户自己按了停止：换模型救不回来，把真实结局原样交出去。
      if (options?.signal?.aborted === true || failure?.code === 'ABORTED') {
        for (const chunk of held) yield chunk
        return
      }

      // 请求本身的问题（上下文超长之类）：换模型只会再撞一次墙。
      if (failure !== undefined && NON_FAILOVER_CODES.has(failure.code)) {
```

**依据 2 · 源码核查**：[lib/autocontinue.js:95-112](https://github.com/Airisey/dsh-model-failover/blob/b762ec038fc2d47a0504ae55af0fdab3162367ee/lib/autocontinue.js#L95-L112)

自动继续的受限触发

<details>
<summary>查看原文（18行）</summary>

```text
export function autoContinueTrigger(reason, settings) {
  if (reason === null || typeof reason !== 'object') return undefined
  if (settings?.autoContinue !== true) return undefined

  if (reason.kind === 'max-tokens') {
    return settings.autoContinueOnMaxTokens === false ? undefined : 'max-tokens'
  }

  if (reason.kind === 'error') {
    if (settings.autoContinueOnFailure === false) return undefined
    const code = typeof reason.error?.code === 'string' ? reason.error.code : ''
    if (AUTO_CONTINUE_SKIP_CODES.has(code)) return undefined
    // 本机网络没通：重发救不回来，只会白烧一次上限。
    if (isLocalNetworkFailure(reason.error)) return undefined
    return 'error'
  }

  return undefined
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
