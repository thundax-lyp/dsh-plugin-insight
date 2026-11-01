# dsh-auto-review

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f2dc189](https://github.com/PerryLink/dsh-auto-review/tree/f2dc189f4b3e9ec1452e2ab134656d5681655ebc)

<!-- BEGIN META -->
[![GitHub ★ 245](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=245&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-auto-review) [![npm 30d 6,911](https://img.shields.io/static/v1?label=npm+30d&message=6%2C911&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-review) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-auto-review)
<!-- END META -->

> **功能**：为 DSH 审批请求提供可配置的第二模型审核。

> **亮点**：[Q01](#research-q01) 引入第二模型审核入口，[Q02](#research-q02) 按策略连接审核与后续审批。

> **主要限制**：[Q03](#research-q03) 审核失败默认拒绝，非默认 allow-once 可放行一次，delegate 仅转交；取消为 cancelled，脱敏和结构校验不证明零漏判。

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
  - [Q01 · 第二模型审核相对人工审批解决什么？](#detail-section-11)
  - [Q02 · 哪些审批实际进入审核，结果如何返回？](#detail-section-12)
  - [Q03 · 失败关闭、预算和审计的反证是什么？](#detail-section-13)
  - [Q04 · 宿主、模型和采用退出条件是什么？](#detail-section-14)
  - [Q05 · 如何评估自动审核在哪些任务上可交由用户信任？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用户希望对部分需要审批的操作增加自动风险判断。

宿主原有审批链由人或其他答复器处理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 审批分流 | 选择审核、拒绝或转交 | 非所有请求进入模型 |
| 模型审核 | 对请求生成结构化判断 | 后端可能超时或误判 |
| 审计与回退 | 记录裁决并处理失败 | 失败默认拒绝，allow-once 放行一次，delegate 转交；审计可退内存 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH 审批链及兼容宿主 | 必需 | 处理审批请求 | 无法接入 |
| 审核模型、子代理或本地后端 | AI 策略需要 | 产生裁决 | 默认拒绝；allow-once 放行一次，delegate 转交 |
| 人工后续答复器 | 转交分支需要 | 处理非 AI 或预算耗尽请求 | 无法假定人工已批准 |
| 明确数据及策略授权 | 必需 | 控制发送与风险 | 不应启用自动审批 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户设定策略、后端与数据范围 | 未确认则保留人工审批 |
| 验证 | 隔离 profile 用合成请求试各分支 | 核默认拒绝、allow-once 放行一次、delegate 转交与取消 |
| 使用 | 审查模型裁决与审计 | 错误或缺记录时停用自动放行 |
| 恢复 | 用户切回人工审批链 | 确认宿主实际接收 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 接入 | 后端与存储费用未知 | 定义策略与合成测试 | 宿主兼容未测 |
| 审核 | 模型调用与等待费用未知 | 复核误判与回退 | 默认超时 60 秒 |
| 故障 | 排障和错误放行损失未知 | 恢复人工审批 | 部分分支转交 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分流 | 按策略、预算与会话决定 | 实际宿主顺序 |
| 审核 | 检查结构并处理失败 | 模型判断准确率 |
| 审计 | 尝试追加裁决事件 | 日志在所有故障下完整 |

> **思考**：[Q03](#research-q03) 审核失败默认拒绝，非默认 allow-once 可放行一次，delegate 仅转交；取消为 cancelled，脱敏和结构校验不证明零漏判。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 引入第二模型审核入口，[Q02](#research-q02) 按策略连接审核与后续审批。

[Q03](#research-q03) 审核失败默认拒绝，非默认 allow-once 放行一次，delegate 仅转交；取消为 cancelled。未命中和预算耗尽的 next 属普通分流，日志故障可退内存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 审核失败默认拒绝，非默认 allow-once 可放行一次，delegate 仅转交；取消为 cancelled，脱敏和结构校验不证明零漏判。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离 profile 用合成样例核策略、默认拒绝、非默认 allow-once 放行一次及 delegate 转交；转交不等于批准，取消为 cancelled。误判或证据不足时停止依赖自动放行。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查策略分流、代表性审核、失败与审计路径；未运行任何模型或宿主。

- 已检查：作者 README、包清单、源码路径 README-zh.md、src/runtime.ts、package.json、src/review.ts、src/config.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、审批运行时、审核与配置代表路径；未运行宿主、模型、MCP 或评测，未完整审计本地后端。
- 下一步：[Q05](#research-q05) 先核现有 eval，再用独立标签分层测试误放与误拒。

**分析版本**

- **仓库**：[PerryLink/dsh-auto-review](https://github.com/PerryLink/dsh-auto-review)
- **版本号**：0.15.0（[固定提交 f2dc189](https://github.com/PerryLink/dsh-auto-review/tree/f2dc189f4b3e9ec1452e2ab134656d5681655ebc)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设合成样例分层评测可帮助用户选择人工策略；尚未验证。

[Q05](#research-q05) 先核现有 eval，再用独立标签分层测试误放与误拒。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 18 | 4138 | — | — | 57056 |
| .mjs | source | 16 | 1049 | 742 | 231 | — |
| .mts | source | 1 | 18 | 16 | 1 | — |
| .md | example | 1 | 31 | — | — | 153 |
| .ts | source | 36 | 9300 | 6093 | 2721 | — |
| .tsx | source | 1 | 174 | 145 | 24 | — |
| .ts | test | 34 | 6932 | 5828 | 561 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/PerryLink/dsh-auto-review/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查审批分流、审核后端、失败回退及审计边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 第二模型审核相对人工审批解决什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README-zh.md:3-7 宣称以第二模型处理越过沙箱的审批；相对所有审批由人判断，它尝试对符合策略的请求自动给出理由和裁决。不能将作者“没有不安全的东西蒙混过关”当作已证明的安全结论；模型会误判，人工审批也有局限，真实风险覆盖、误拒和节时均未在本轮测试。

#### 证据与依据

**依据 1 · 作者声明**：[README-zh.md:3-7](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/README-zh.md#L3-L7)

作者描述第二模型审批及强效果主张。

```text
# 🤖 dsh-auto-review

**DeepSeek Harness 的第二模型 AI 审批 —— 一个只读审查子代理在审批链上做出允许/拒绝决策，默认失败关闭。**

*当某个动作越过沙箱边界时，第二模型读取证据并给出带有理由的裁决 —— 人类无需批准任何事，同时也没有任何不安全的东西蒙混过关。*
```

**依据 2 · 源码核查**：[src/runtime.ts:543-555](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L543-L555)

审核处理器的条件性接入。

<details>
<summary>查看原文（13行）</summary>

```text
  /**
   * The `approval/request` answerer. Claims a request ONLY when auto-review
   * is enabled for the session AND the policy for this tool/reason is `ai`
   * AND both per-turn budgets remain AND the rejection circuit breaker is
   * not tripped; everything else delegates via `next()` (or deterministically
   * rejects for `never`). The reviewer's own asks are always delegated
   * (anti-recursion).
   * @param request - the pending decision.
   * @param next - the downstream answerer chain.
   * @returns the closed approval outcome.
   */
  answer(request: ApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<ApprovalOutcome> {
    return this.answerCore(request, next)
```

</details>

**依据 3 · 源码核查**：[package.json:1-5](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/package.json#L1-L5)

插件版本和作者功能描述。

```text
{
  "name": "dsh-auto-review",
  "version": "0.15.0",
  "packageManager": "pnpm@11.7.0",
  "description": "Second-model AI auto-review for DeepSeek Harness approval requests: a read-only reviewer subagent or the local non-generative Phocinae-Largha-150M-v1 decision model decides allow/deny on the approval answerer chain, with fail-closed fallback and full session-log audit.",
```

#### 缺口

- 未进行安全基准或人工对照
  **影响**：无法证明零漏判或替代人类审核
  **进一步探讨**：用受控审批集比较误放、误拒和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 哪些审批实际进入审核，结果如何返回？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

runtime.ts:599-628 对审核子代理自身、会话关闭及非 ai 策略走 next，never 策略走拒绝；633-653 预算耗尽或熔断按各自分支转交或处理。755-773 先查缓存或调用 runReview；review.ts:463-497 按配置选择本地服务、子代理或无子代理时的直接模型调用，具体可用性受宿主接口限制。612-624 检查完成状态与结构化 verdict；runtime.ts:810-836 记录审计或内存回退，风险策略可转交后续处理。不是所有工具调用都经过第二模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:599-628](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L599-L628)

递归、会话和策略分流。

<details>
<summary>查看原文（30行）</summary>

```text
  private answerCore(request: ApprovalRequest, next: () => Promise<ApprovalOutcome>, receipt?: ReviewReceipt): Promise<ApprovalOutcome> {
    // Anti-recursion: a reviewer child's own approval asks go to the human chain.
    if (this.reviewerSessions.has(request.agent.id)) {
      if (receipt !== undefined) {
        receipt.reason = 'reviewer-recursion'
      }
      return next()
    }
    const session = request.agent.session
    const memory = this.memoryFor(session)
    const enabled = effectiveAutoReviewState(sessionEvents(session)) ?? memory.enabledOverride ?? this.config.enableByDefault
    if (!enabled) {
      if (receipt !== undefined) {
        receipt.reason = 'session-disabled'
      }
      return next()
    }
    const needsArguments = this.config.riskRules.some(rule => rule.field === 'arguments')
    const argumentsText = needsArguments && request.callId !== undefined
      ? sanitizedArgumentsText(sessionEvents(session), request.callId)
      : undefined
    const { policy, source } = policyFor(this.config, request, argumentsText)
    if (policy === 'never') {
      return this.neverReject(request, source, receipt)
    }
    if (policy !== 'ai') {
      if (receipt !== undefined) {
        receipt.reason = 'human-policy'
      }
      return next()
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:630-653](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L630-L653)

预算与熔断分支。

<details>
<summary>查看原文（24行）</summary>

```text
    // Separate budgets: real AI verdicts vs reviewer failures. A broken
    // reviewer burns the failure budget (then delegates) without eating the
    // AI-decision budget, and vice versa.
    if (this.verdictsInOpenTurn(session, memory) >= this.config.maxReviewsPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'review-budget'
      }
      return next()
    }
    if (this.failuresInOpenTurn(session, memory) >= this.config.maxFailuresPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'failure-budget'
      }
      return next()
    }
    const circuit = this.circuitFor(session, memory)
    if (circuit !== undefined) {
      if (receipt !== undefined) {
        receipt.category = 'circuit'
        receipt.reason = 'plugin-circuit'
        receipt.circuit = this.circuitSnapshot(circuit)
        receipt.circuitTriggered = false
      }
      return this.circuitSettle(request, circuit, next)
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:755-773](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L755-L773)

缓存或调用审核。

<details>
<summary>查看原文（19行）</summary>

```text
    let resolution: ReviewResolution
    let cached = false
    if (cacheKey !== undefined && override === undefined) {
      const hit = this.cache.get(cacheKey, started)
      if (hit !== undefined) {
        resolution = { ...hit }
        cached = true
      } else {
        resolution = await runReview(this.ctx, this.config, request, this.reviewerSessions, override)
        if (!isReviewFailure(resolution)) {
          this.cache.set(cacheKey, {
            decision: resolution.decision,
            reason: resolution.reason,
            ...resolution.riskLevel !== undefined ? { riskLevel: resolution.riskLevel } : {},
          }, started)
        }
      }
    } else {
      resolution = await runReview(this.ctx, this.config, request, this.reviewerSessions, override)
```

</details>

**依据 4 · 源码核查**：[src/review.ts:463-497](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L463-L497)

本地服务、子代理与模型路径选择。

<details>
<summary>查看原文（35行）</summary>

```text
export async function runReview(
  ctx: Context,
  config: ResolvedConfig,
  request: ApprovalRequest,
  reviewerSessions: ReviewerChildren,
  override?: OverrideContext,
): Promise<ReviewResolution> {
  // The local decision service needs neither `subagents` nor `llm`: it is a
  // plain HTTP call to a loopback process. Checked first so an offline or
  // key-less deployment never falls into the generative path.
  if (config.reviewerBackend === 'phocinae') {
    return runPhocinaeReview(buildPhocinaeEvidence(request, override), config, request.signal)
  }
  // Two reviewer seams, because the host moved: dsh <= 0.2.1-alpha still exposes
  // the one-shot child (`ctx.subagents.start`, structured capture + tool
  // allow-list), while 0.2.1 replaced it with `startActivation`, whose spawn
  // provider no longer accepts a `toolFilter`. Reviving the old call there is
  // not an option — a child without a tool allow-list is exactly the reviewer
  // face this plugin refuses to publish — so the fallback is a plain model
  // call: no agent, no tools, no reachable side effect at all.
  //
  // Both seams are detected at call time rather than declared in `inject`: a
  // host that offers the child seam never needs `llm` mounted, and making it a
  // hard dependency would stop the plugin from loading there at all.
  if (typeof ctx.subagents.start !== 'function') {
    const llm = ctx.get('llm')
    if (llm === undefined) {
      return {
        fallback: 'unavailable',
        error: 'auto-review: the host offers neither subagents.start nor llm, so the reviewer cannot run',
      }
    }
    return runReviewInline(llm, config, request, override)
  }
  return runReviewStructured(ctx, config, request, reviewerSessions, override)
```

</details>

**依据 5 · 源码核查**：[src/review.ts:612-624](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L612-L624)

结果状态和结构校验。

<details>
<summary>查看原文（13行）</summary>

```text
    const result = await run.result
    if (timedOut) {
      return failure('timeout', `reviewer exceeded ${config.reviewerTimeoutMs} ms`)
    }
    if (request.signal?.aborted === true) {
      return failure('cancelled', 'approval request was cancelled while the reviewer ran')
    }
    if (result.stopReason !== 'completed') {
      return failure('unavailable', `reviewer ended with stopReason "${result.stopReason}"`)
    }
    const verdict = parseVerdict(result.structured, config.reasonMaxChars)
    if (verdict === undefined) {
      return failure('schema', 'reviewer returned no valid structured verdict')
```

</details>

**依据 6 · 源码核查**：[src/runtime.ts:810-836](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L810-L836)

审计与风险策略转交。

<details>
<summary>查看原文（27行）</summary>

```text
    const auditOk = this.auditMayAppend()
    if (auditOk) {
      const result = (request.agent.session.append as unknown as VerdictAppend)('autoReview/verdict', {
        reviewId,
        approvalId,
        toolName: request.toolName,
        ...request.callId !== undefined ? { callId: request.callId } : {},
        provider: this.reviewerProviderName(),
        ...resolution.model !== undefined ? { model: resolution.model } : {},
        ...resolution.reviewerSessionId !== undefined ? { reviewerSessionId: resolution.reviewerSessionId } : {},
        durationMs,
        decision: resolution.decision,
        reason: resolution.reason,
        ...resolution.riskLevel !== undefined ? { riskLevel: resolution.riskLevel } : {},
        ...overridden ? { escalation: 'risk-policy' } : {},
        ...outcome !== undefined ? { outcome } : {},
        ...cached ? { cached: true } : {},
      }, { ignorable: true })
      this.probeAuditResult(result)
    } else {
      this.recordVerdictMemory(this.memoryFor(request.agent.session), {
        id: String(reviewId),
        toolName: request.toolName,
        denial: resolution.decision === 'deny' || (overridden && outcome === 'rejected'),
      })
    }
    if (outcome === undefined) return next()
```

</details>

#### 缺口

- 未运行宿主和任何审核后端
  **影响**：无法证明审批顺序及后端效果
  **进一步探讨**：隔离宿主逐分支注入请求并核结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败关闭、预算和审计的反证是什么？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

config.ts:373-398 默认启用、审核超时 60 秒、fallbackPolicy=rejected；runtime.ts:950-956 对审核失败默认返回 rejected；非默认 allow-once 返回 allowed-once，即放行本次；delegate 返回 undefined 并交后续审批链，不等于批准。取消始终单独返回 cancelled。未启用、非 ai 策略及预算耗尽走 next，并非全局强制拒绝；审计 append 不可用时 runtime.ts:810-835 落内存记录，不能把包描述的完整会话日志视作每次都成立。review.ts:115-150 对已知敏感键和字符串模式清理，但无法证明所有秘密与提示注入均被移除；输出结构正确也不证明裁决正确。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:373-398](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/config.ts#L373-L398)

默认启用、超时、工具和回退。

<details>
<summary>查看原文（26行）</summary>

```text
  enableByDefault: z.boolean().default(true),
  toolsPolicy: z.object({
    default: POLICY.default('human'),
    overrides: z.dict(POLICY).default({}),
  }).default({ default: 'human', overrides: {} }),
  riskRules: z.array(z.object({
    pattern: z.string(),
    policy: POLICY,
    field: FIELD.default('reason'),
  })).default([]),
  reviewerProvider: z.string().default('fork'),
  reviewerPreset: z.string(),
  reviewerModel: z.string(),
  reviewerModelProvider: z.string(),
  reviewerBackend: REVIEWER_BACKEND,
  phocinae: z.object({
    endpoint: z.string(),
    model: z.string(),
    timeoutMs: z.number(),
    minConfidence: z.number(),
    maxStateChars: z.number(),
    allowRemoteEndpoint: z.boolean(),
  }),
  reviewerTimeoutMs: z.number().default(60_000),
  reviewerTools: z.array(z.string()).default(['read', 'glob', 'grep']),
  fallbackPolicy: FALLBACK.default('rejected'),
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:599-643](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L599-L643)

未启用、策略及预算转交。

<details>
<summary>查看原文（45行）</summary>

```text
  private answerCore(request: ApprovalRequest, next: () => Promise<ApprovalOutcome>, receipt?: ReviewReceipt): Promise<ApprovalOutcome> {
    // Anti-recursion: a reviewer child's own approval asks go to the human chain.
    if (this.reviewerSessions.has(request.agent.id)) {
      if (receipt !== undefined) {
        receipt.reason = 'reviewer-recursion'
      }
      return next()
    }
    const session = request.agent.session
    const memory = this.memoryFor(session)
    const enabled = effectiveAutoReviewState(sessionEvents(session)) ?? memory.enabledOverride ?? this.config.enableByDefault
    if (!enabled) {
      if (receipt !== undefined) {
        receipt.reason = 'session-disabled'
      }
      return next()
    }
    const needsArguments = this.config.riskRules.some(rule => rule.field === 'arguments')
    const argumentsText = needsArguments && request.callId !== undefined
      ? sanitizedArgumentsText(sessionEvents(session), request.callId)
      : undefined
    const { policy, source } = policyFor(this.config, request, argumentsText)
    if (policy === 'never') {
      return this.neverReject(request, source, receipt)
    }
    if (policy !== 'ai') {
      if (receipt !== undefined) {
        receipt.reason = 'human-policy'
      }
      return next()
    }
    // Separate budgets: real AI verdicts vs reviewer failures. A broken
    // reviewer burns the failure budget (then delegates) without eating the
    // AI-decision budget, and vice versa.
    if (this.verdictsInOpenTurn(session, memory) >= this.config.maxReviewsPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'review-budget'
      }
      return next()
    }
    if (this.failuresInOpenTurn(session, memory) >= this.config.maxFailuresPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'failure-budget'
      }
      return next()
```

</details>

**依据 3 · 源码核查**：[src/runtime.ts:945-956](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L945-L956)

取消单独返回 cancelled；失败回退可拒绝、放行一次或转交。

<details>
<summary>查看原文（12行）</summary>

```text
   * with: `cancelled` when the user aborted the request; otherwise the
   * configured fallback policy.
   * @param failure - the review failure.
   * @returns the outcome, or undefined when the chain must continue.
   */
  private fallbackOutcome(failure: ReviewFailure): ApprovalOutcome | undefined {
    if (failure.fallback === 'cancelled') return 'cancelled'
    switch (this.config.fallbackPolicy) {
      case 'rejected': return 'rejected'
      case 'allow-once': return 'allowed-once'
      case 'delegate': return undefined
      default: return assertNever(this.config.fallbackPolicy, 'fallback policy')
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:810-835](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L810-L835)

审计不可用时内存记录。

<details>
<summary>查看原文（26行）</summary>

```text
    const auditOk = this.auditMayAppend()
    if (auditOk) {
      const result = (request.agent.session.append as unknown as VerdictAppend)('autoReview/verdict', {
        reviewId,
        approvalId,
        toolName: request.toolName,
        ...request.callId !== undefined ? { callId: request.callId } : {},
        provider: this.reviewerProviderName(),
        ...resolution.model !== undefined ? { model: resolution.model } : {},
        ...resolution.reviewerSessionId !== undefined ? { reviewerSessionId: resolution.reviewerSessionId } : {},
        durationMs,
        decision: resolution.decision,
        reason: resolution.reason,
        ...resolution.riskLevel !== undefined ? { riskLevel: resolution.riskLevel } : {},
        ...overridden ? { escalation: 'risk-policy' } : {},
        ...outcome !== undefined ? { outcome } : {},
        ...cached ? { cached: true } : {},
      }, { ignorable: true })
      this.probeAuditResult(result)
    } else {
      this.recordVerdictMemory(this.memoryFor(request.agent.session), {
        id: String(reviewId),
        toolName: request.toolName,
        denial: resolution.decision === 'deny' || (overridden && outcome === 'rejected'),
      })
    }
```

</details>

**依据 5 · 源码核查**：[src/review.ts:115-150](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L115-L150)

按键与字符串模式脱敏。

<details>
<summary>查看原文（36行）</summary>

```text
/** The `--flag VALUE` spelling of an inline secret. */
const INLINE_SECRET_FLAG = new RegExp(`(--?${INLINE_SECRET_KEY}\\s+)(["']?)([^\\s"';&|,)]+)`, 'giu')

/**
 * Redact inline secrets from a free-form string argument. The key-based pass
 * in {@link sanitizeArguments} only inspects object KEYS, so a secret spelled
 * inside a shell command line would otherwise reach the reviewer verbatim.
 * @param text - the free-form string to redact.
 * @returns the string with every recognized inline secret masked.
 */
export function redactInlineSecrets(text: string): string {
  return text
    .replace(INLINE_SECRET_ASSIGN, (_match, head: string, quote: string) => head + quote + REDACTED)
    .replace(INLINE_SECRET_FLAG, (_match, head: string, quote: string) => head + quote + REDACTED)
}

/**
 * Recursively redact sensitive values from a JSON value: any object key
 * matching {@link SENSITIVE_KEY_PATTERN} has its value replaced, and any
 * free-form string is passed through {@link redactInlineSecrets}.
 * @param value - the detached JSON value to sanitize.
 * @returns a detached copy with sensitive values redacted.
 */
export function sanitizeArguments(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(item => sanitizeArguments(item))
  if (typeof value === 'object' && value !== null) {
    const copy: Record<string, unknown> = {}
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      copy[key] = SENSITIVE_KEY_PATTERN.test(key) ? REDACTED : sanitizeArguments(item)
    }
    return copy
  }
  if (typeof value === 'string') return redactInlineSecrets(value)
  return value
}

```

</details>

**依据 6 · 源码核查**：[src/review.ts:404-416](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L404-L416)

裁决结构校验。

<details>
<summary>查看原文（13行）</summary>

```text
export function parseVerdict(value: unknown, reasonMaxChars: number): ReviewerVerdict | undefined {
  if (typeof value !== 'object' || value === null) return undefined
  const record = value as Record<string, unknown>
  const decision = record.decision
  if (decision !== 'allow' && decision !== 'deny') return undefined
  const reason = record.reason
  if (typeof reason !== 'string' || reason.trim().length === 0) return undefined
  const riskLevel = record.riskLevel
  if (riskLevel !== undefined && riskLevel !== 'low' && riskLevel !== 'medium' && riskLevel !== 'high') return undefined
  return {
    decision,
    reason: truncate(reason.trim(), reasonMaxChars),
    ...riskLevel === undefined ? {} : { riskLevel },
```

</details>

#### 缺口

- 未测模型攻击、宿主链和审计故障
  **影响**：不能保证零漏判、完全脱敏或完整日志
  **进一步探讨**：用合成秘密和故障请求验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 宿主、模型和采用退出条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:73-85 声明 DSH Web 插件接线；审核需要可用的选定后端，review.ts:487-495 在子代理入口不存在时检查 llm，否则返回 unavailable。模型调用、审计存储、等待与人工复核成本未知；脱敏不等于所有数据不会发送给审核后端。先在隔离 profile 用合成低风险与恶意样例，明确配置人工链、回退和数据边界：默认拒绝，非默认 allow-once 在审核失败时放行一次，delegate 只转交并不代表批准，取消仍为 cancelled；逐一核实际 outcome；后端不可用、证据不足或裁决误判时停止依赖自动放行并使用人工审批。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:73-85](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/package.json#L73-L85)

宿主 Web 客户端依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
```

</details>

**依据 2 · 源码核查**：[src/review.ts:463-497](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L463-L497)

后端和宿主接口条件。

<details>
<summary>查看原文（35行）</summary>

```text
export async function runReview(
  ctx: Context,
  config: ResolvedConfig,
  request: ApprovalRequest,
  reviewerSessions: ReviewerChildren,
  override?: OverrideContext,
): Promise<ReviewResolution> {
  // The local decision service needs neither `subagents` nor `llm`: it is a
  // plain HTTP call to a loopback process. Checked first so an offline or
  // key-less deployment never falls into the generative path.
  if (config.reviewerBackend === 'phocinae') {
    return runPhocinaeReview(buildPhocinaeEvidence(request, override), config, request.signal)
  }
  // Two reviewer seams, because the host moved: dsh <= 0.2.1-alpha still exposes
  // the one-shot child (`ctx.subagents.start`, structured capture + tool
  // allow-list), while 0.2.1 replaced it with `startActivation`, whose spawn
  // provider no longer accepts a `toolFilter`. Reviving the old call there is
  // not an option — a child without a tool allow-list is exactly the reviewer
  // face this plugin refuses to publish — so the fallback is a plain model
  // call: no agent, no tools, no reachable side effect at all.
  //
  // Both seams are detected at call time rather than declared in `inject`: a
  // host that offers the child seam never needs `llm` mounted, and making it a
  // hard dependency would stop the plugin from loading there at all.
  if (typeof ctx.subagents.start !== 'function') {
    const llm = ctx.get('llm')
    if (llm === undefined) {
      return {
        fallback: 'unavailable',
        error: 'auto-review: the host offers neither subagents.start nor llm, so the reviewer cannot run',
      }
    }
    return runReviewInline(llm, config, request, override)
  }
  return runReviewStructured(ctx, config, request, reviewerSessions, override)
```

</details>

**依据 3 · 源码核查**：[src/config.ts:373-398](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/config.ts#L373-L398)

默认超时及回退。

<details>
<summary>查看原文（26行）</summary>

```text
  enableByDefault: z.boolean().default(true),
  toolsPolicy: z.object({
    default: POLICY.default('human'),
    overrides: z.dict(POLICY).default({}),
  }).default({ default: 'human', overrides: {} }),
  riskRules: z.array(z.object({
    pattern: z.string(),
    policy: POLICY,
    field: FIELD.default('reason'),
  })).default([]),
  reviewerProvider: z.string().default('fork'),
  reviewerPreset: z.string(),
  reviewerModel: z.string(),
  reviewerModelProvider: z.string(),
  reviewerBackend: REVIEWER_BACKEND,
  phocinae: z.object({
    endpoint: z.string(),
    model: z.string(),
    timeoutMs: z.number(),
    minConfidence: z.number(),
    maxStateChars: z.number(),
    allowRemoteEndpoint: z.boolean(),
  }),
  reviewerTimeoutMs: z.number().default(60_000),
  reviewerTools: z.array(z.string()).default(['read', 'glob', 'grep']),
  fallbackPolicy: FALLBACK.default('rejected'),
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:599-643](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L599-L643)

策略与预算边界。

<details>
<summary>查看原文（45行）</summary>

```text
  private answerCore(request: ApprovalRequest, next: () => Promise<ApprovalOutcome>, receipt?: ReviewReceipt): Promise<ApprovalOutcome> {
    // Anti-recursion: a reviewer child's own approval asks go to the human chain.
    if (this.reviewerSessions.has(request.agent.id)) {
      if (receipt !== undefined) {
        receipt.reason = 'reviewer-recursion'
      }
      return next()
    }
    const session = request.agent.session
    const memory = this.memoryFor(session)
    const enabled = effectiveAutoReviewState(sessionEvents(session)) ?? memory.enabledOverride ?? this.config.enableByDefault
    if (!enabled) {
      if (receipt !== undefined) {
        receipt.reason = 'session-disabled'
      }
      return next()
    }
    const needsArguments = this.config.riskRules.some(rule => rule.field === 'arguments')
    const argumentsText = needsArguments && request.callId !== undefined
      ? sanitizedArgumentsText(sessionEvents(session), request.callId)
      : undefined
    const { policy, source } = policyFor(this.config, request, argumentsText)
    if (policy === 'never') {
      return this.neverReject(request, source, receipt)
    }
    if (policy !== 'ai') {
      if (receipt !== undefined) {
        receipt.reason = 'human-policy'
      }
      return next()
    }
    // Separate budgets: real AI verdicts vs reviewer failures. A broken
    // reviewer burns the failure budget (then delegates) without eating the
    // AI-decision budget, and vice versa.
    if (this.verdictsInOpenTurn(session, memory) >= this.config.maxReviewsPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'review-budget'
      }
      return next()
    }
    if (this.failuresInOpenTurn(session, memory) >= this.config.maxFailuresPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'failure-budget'
      }
      return next()
```

</details>

#### 缺口

- 未运行后端及付费模型
  **影响**：无法估计费用、风险和兼容
  **进一步探讨**：隔离 profile 用合成样例测试回退。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何评估自动审核在哪些任务上可交由用户信任？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有 verdict、原因、审核时长、fallback、审计和请求回执；只再添加日志或总通过率没有增量。未验证设想是在用户授权的离线合成评测中按工具类型、风险、回退原因和实际人工标签分层展示误放/误拒及置信区间，并让用户据此决定哪些策略继续交给人工；不复制真实秘密或自动放宽策略。对照现有单次回执，在破坏性命令、无害请求、伪造上下文、模型超时及预算耗尽样本上比较漏判与审核成本；若标签不独立、样本不足、回退被计作正确裁决或分层结果无法复现则否定。先核现有评测工具是否已有等价分层能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:810-835](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L810-L835)

已有裁决审计与内存回退。

<details>
<summary>查看原文（26行）</summary>

```text
    const auditOk = this.auditMayAppend()
    if (auditOk) {
      const result = (request.agent.session.append as unknown as VerdictAppend)('autoReview/verdict', {
        reviewId,
        approvalId,
        toolName: request.toolName,
        ...request.callId !== undefined ? { callId: request.callId } : {},
        provider: this.reviewerProviderName(),
        ...resolution.model !== undefined ? { model: resolution.model } : {},
        ...resolution.reviewerSessionId !== undefined ? { reviewerSessionId: resolution.reviewerSessionId } : {},
        durationMs,
        decision: resolution.decision,
        reason: resolution.reason,
        ...resolution.riskLevel !== undefined ? { riskLevel: resolution.riskLevel } : {},
        ...overridden ? { escalation: 'risk-policy' } : {},
        ...outcome !== undefined ? { outcome } : {},
        ...cached ? { cached: true } : {},
      }, { ignorable: true })
      this.probeAuditResult(result)
    } else {
      this.recordVerdictMemory(this.memoryFor(request.agent.session), {
        id: String(reviewId),
        toolName: request.toolName,
        denial: resolution.decision === 'deny' || (overridden && outcome === 'rejected'),
      })
    }
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:558-591](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L558-L591)

已有请求回执。

<details>
<summary>查看原文（34行）</summary>

```text
  /** Return a request-local audit receipt without appending unknown host events. */
  async answerDetailed(request: ApprovalRequest, next: () => Promise<ApprovalOutcome>): Promise<DetailedAnswer> {
    const receipt: ReviewReceipt = {
      sessionId: String(request.agent.id),
      ...(request.callId === undefined ? {} : { callId: request.callId }),
      toolName: request.toolName,
      category: 'delegate',
      reason: 'unclaimed',
    }
    let outcome: ApprovalOutcome = 'rejected'
    try {
      const approvalId = correlateApprovalId(sessionEvents(request.agent.session), request.toolName, request.callId)
      if (approvalId !== undefined) {
        receipt.approvalId = approvalId
      }
      if (!this.disposed) {
        outcome = await this.answerCore(request, async () => {
          receipt.delegated = true
          return next()
        }, receipt)
      }
    } catch (error) {
      receipt.category = 'fault'
      receipt.reason = error instanceof Error ? error.message : String(error)
      receipt.fallback = 'unavailable'
    }
    if (this.disposed) {
      outcome = 'rejected'
      receipt.category = 'fault'
      receipt.reason = 'runtime-disposed'
      receipt.fallback = 'unavailable'
    }
    receipt.outcome = outcome
    return { outcome, receipt }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:76-104](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/client/index.ts#L76-L104)

客户端注册审核面板并连接命令。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-auto-review: dictionaries')
  ctx.effect(() => installPanelStyles(), 'dsh-auto-review: stylesheet')
  const slots = ctx.get('slots') as SlotsLike | undefined
  if (slots === undefined) return
  slots.inject(
    'conversation.session.header.actions',
    () => slots.register({
      name: 'conversation.session.header.actions',
      id: 'auto-review',
      order: 40,
      locale: NS,
      inject: (sessionId: SessionId): ReviewPanelInjected => {
        const remote = ctx.remote as unknown as { commands: CommandsRemote }
        const executeCommand = async (line: string): Promise<string> => {
          const result = await remote.commands.execute(sessionId, line, [])
          if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
          if (result.value === undefined) throw new Error('unknown command: /auto-review')
          const command = result.value.result
          if (command === undefined) throw new Error('/auto-review produced no command result')
          const text = command.text ?? ''
          return command.kind === 'success' ? text : `${command.kind}: ${text}`
        }
        return {
          approve: async (n: number): Promise<string> => executeCommand(`/auto-review approve ${n}`),
          setEnabled: async (enabled: boolean): Promise<string> => executeCommand(`/auto-review ${enabled ? 'on' : 'off'}`),
        }
      },
    }, ReviewPanel),
```

</details>

**依据 4 · 源码核查**：[src/runtime.ts:630-643](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/runtime.ts#L630-L643)

已有预算转交分支。

<details>
<summary>查看原文（14行）</summary>

```text
    // Separate budgets: real AI verdicts vs reviewer failures. A broken
    // reviewer burns the failure budget (then delegates) without eating the
    // AI-decision budget, and vice versa.
    if (this.verdictsInOpenTurn(session, memory) >= this.config.maxReviewsPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'review-budget'
      }
      return next()
    }
    if (this.failuresInOpenTurn(session, memory) >= this.config.maxFailuresPerTurn) {
      if (receipt !== undefined) {
        receipt.reason = 'failure-budget'
      }
      return next()
```

</details>

**依据 5 · 源码核查**：[src/review.ts:612-624](https://github.com/PerryLink/dsh-auto-review/blob/f2dc189f4b3e9ec1452e2ab134656d5681655ebc/src/review.ts#L612-L624)

已有结构验证和超时失败。

<details>
<summary>查看原文（13行）</summary>

```text
    const result = await run.result
    if (timedOut) {
      return failure('timeout', `reviewer exceeded ${config.reviewerTimeoutMs} ms`)
    }
    if (request.signal?.aborted === true) {
      return failure('cancelled', 'approval request was cancelled while the reviewer ran')
    }
    if (result.stopReason !== 'completed') {
      return failure('unavailable', `reviewer ended with stopReason "${result.stopReason}"`)
    }
    const verdict = parseVerdict(result.structured, config.reasonMaxChars)
    if (verdict === undefined) {
      return failure('schema', 'reviewer returned no valid structured verdict')
```

</details>

#### 缺口

- 未穷尽 eval 工具、无新评测数据
  **影响**：新增性和收益未经验证
  **进一步探讨**：先核现有 eval，再用独立合成标签对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
