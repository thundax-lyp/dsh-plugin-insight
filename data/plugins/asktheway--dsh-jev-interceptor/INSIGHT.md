# dsh-jev-interceptor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2ba7b8c](https://github.com/AskTheWay/dsh-jev-interceptor/tree/2ba7b8c9fce9dfc364ba057099a4b459edc9e760)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 3,180](https://img.shields.io/static/v1?label=npm+30d&message=3%2C180&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor)
<!-- END META -->

> **功能**：将typed分类接入DSH工具风险、预批和引用保留，支持shadow观测；可选图像卸载存在模式门遗漏。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) typed多决策点与next/有界新鲜证据限制部分授权风险；[Q04](#research-q04) 引用反事实、缓存/预算可复用，不等准确或省钱实测。

> **主要限制**：[Q03](#research-q03) enabled且图像opt-in时shadow也可append image/offload，默认关闭收窄而非修复；[Q04](#research-q04) 遥测best-effort非动作前置，resolver退出要整bundle。

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
  - [Q01 · typed分类编排给谁增加什么？](#detail-section-11)
  - [Q02 · guard和预批的证据、mode及next怎样接线？](#detail-section-12)
  - [Q03 · shadow能保证所有动作只记录吗？](#detail-section-13)
  - [Q04 · 引用替换、缓存与遥测如何影响恢复和成本？](#detail-section-14)
  - [Q05 · 怎样限定隔离试用与退出？](#detail-section-15)
  - [Q06 · 统一effect gate有何可证伪增量？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁工具调用且愿校准遥测的开发者，需任务正确/权限不扩和可追全成本，不凭分类响应算成功。

原生审批/生成式复核与FIFO引用；本包编排分类服务，不是Jev模型算法原创或授权替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| guard | 风险ask/deny/原生委托 | 分类非授权保证，shadow有门 |
| 预批 | 有证据白名单allowed-once | 仅enforce，空名单起步 |
| 引用评分 | 字节预算内保有价值信息 | shadow原生、退出整bundle |
| 图像卸载 | 压力时牺牲候选图 | 默认关闭，shadow缺门不可逆 |
| 遥测 | 决策/成本线索 | 可丢非完整账单/安全事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 同版DSH事件/alpha resolver | 必需 | 决策与引用接线 | 兼容/退出另验 |
| provider/key/网络 | 分类必需 | typed判定 | 缺失/预算失败回原生 |
| 空白名单/图像关闭 | 本次试用前提 | 避免未验授权与不可逆变化 | 不扩自动授权 |
| JSONL与人工审阅 | 可解释采用前提 | 错判/阈值核对 | 日志可丢，非安全事务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 备份 | 隔离profile/原resolver与资料 | 审provider输入 |
| 起步 | shadow、图像关/白名单空 | 核同调用参数/mode/实际结果 |
| 比较 | 与原生同任务核错误/成本 | 分类不等任务成功 |
| 停止 | shadow副作用/无日志动作停bundle | 核原resolver与持久事件，非自动逆转 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | provider/key/本地环境 | 参数/隐私/alpha核验 | 当前价格/政策未知 |
| 持续 | 分类/引用评分/JSONL | 错判/ask/deny/阈值校准 | cache usage非完整账单 |
| 失败恢复 | 重试/cooldown | 查丢日志/模式/resolver | telemetry非提交前提 |
| 退出 | profile迁移 | 禁整bundle恢复原行 | 单禁替换行留空缺 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 风险分流 | typed→ask/deny/next | 准确/漏拦与业务正确 |
| 预批约束 | 白名单/新鲜参数身份 | 同任务净点击/成本收益 |
| 引用保留 | enforce评分/shadow原字节 | 比FIFO最终质量 |
| shadow边界 | 多数门控 | 图像opt-in已见遗漏，未运行 |

> **思考**：[Q03](#research-q03) enabled且图像opt-in时shadow也可append image/offload，默认关闭收窄而非修复；[Q04](#research-q04) 遥测best-effort非动作前置，resolver退出要整bundle。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) typed多决策点与next/有界新鲜证据限制部分授权风险；[Q04](#research-q04) 引用反事实、缓存/预算可复用，不等准确或省钱实测。

[Q02](#research-q02)、[Q04](#research-q04) typed矩阵/next、单次身份证据、缓存不重复usage与有界降级可借鉴；[Q03](#research-q03) 分散mode门与best-effort日志不等安全提交。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) enabled且图像opt-in时shadow也可append image/offload，默认关闭收窄而非修复；[Q04](#research-q04) 遥测best-effort非动作前置，resolver退出要整bundle。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 隔离profile从shadow审起，图像关/白名单空；缺遥测动作、shadow变化或resolver异常停整个bundle回原生，核持久状态与provider输入。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

完整复核正式findings，定向读固定guard/preapprove/image/resolver/client预算遥测关键链；未执行目标/provider/宿主或发布lib字节验收。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/config.ts、src/guard.ts、src/image-offload.ts、src/index.ts、src/jev.ts、src/preapprove.ts、src/session-reference.ts、src/stagnation.ts、src/telemetry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定index/guard/preapprove/image/session-reference/jev预算与telemetry/config/patch；未全审客户端/校准或发布产物与上游真实宿主。
- 下一步：[Q06](#research-q06) 五挂点mode/失败/取消矩阵核零shadow变化，再与原生任务正确/误批和全成本比，均未执行。

**分析版本**

- **仓库**：[AskTheWay/dsh-jev-interceptor](https://github.com/AskTheWay/dsh-jev-interceptor)
- **版本号**：0.6.2（[固定提交 2ba7b8c](https://github.com/AskTheWay/dsh-jev-interceptor/tree/2ba7b8c9fce9dfc364ba057099a4b459edc9e760)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 待验证统一effect gate携mode/provenance/证据/可逆性，shadow零状态变化与原生任务/全成本矩阵；不能重复算已有模式门。

[Q06](#research-q06) 五挂点mode/失败/取消矩阵核零shadow变化，再与原生任务正确/误批和全成本比，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 656 | — | — | 9394 |
| .mjs | source | 4 | 357 | 317 | 27 | — |
| .ts | source | 22 | 5950 | 4177 | 1429 | — |
| .js | source | 1 | 219 | 158 | 36 | — |
| .tsx | source | 2 | 1499 | 1347 | 68 | — |
| .ts | test | 15 | 2375 | 2088 | 94 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+created%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T05%3A16%3A13.796Z..2026-11-02T05%3A16%3A13.796Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：分类编排怎样约束权限/上下文动作，shadow与故障边界支持怎样试用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · typed分类编排给谁增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标是频繁调用工具、愿校准遥测的DSH开发者，在隔离profile把风险/可逆性/任务契合/注入可疑度的typed问答接入工具执行和预批，并按任务价值保留被引用会话。相对原生审批和FIFO截断，增量是有界证据到多决策点的编排，不是Jev模型原创，也不能据“System1/毫秒/更省”宣传推断最终正确性。

合格结果是权限选择不越界、任务办结且信息未误丢，并把分类服务调用/人工纠错全成本算入。作者README给过价格/延迟示例，只是固定文档作者报告，不是当前报价或本轮实测；本包不替代服务端授权和宿主既有限制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-38](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/README.md#L26-L38)

作者能力/价格/延迟为固定版本主张。

<details>
<summary>查看原文（13行）</summary>

```text
> The Web panel (sidebar ⚡ → Jev 决策): live KPIs and net-benefit card, a filterable decision log with full evidence per row, shadow-data threshold advice that tracks whether you adopted it, and one-click connection test. Every screenshot above is the real plugin running real decisions.

**What it does, in one breath:** before a tool call runs, Jev classifies its risk, irreversibility, task-fit, and injection-suspicion in one ~$0.00002 request — confident high-risk calls get denied, medium ones escalate to a human, and clearly-granted reversible ones stop wasting your clicks on approval dialogs. And when an `@session` snapshot gets injected, Jev scores every message's value for the citing task so the **error traceback survives the byte budget instead of the oldest small talk**. Every doubt, every timeout, every missing key degrades to stock dsh behavior. Nothing to configure away, nothing that can widen a permission.

## Why this exists

dsh ships **zero per-call risk classification** — the pre-execute waterfall's default is a bare `allow`. Its only built-in precedent, `experimental/auto-review`, does the classification with a *generative* LLM: one full model request per tool call, temperature 0, hand-rolled JSON text protocol, self-described as slow, expensive, and experimental. That's a System-2 scribe doing a System-1 reflex's job:

| | auto-review (generative LLM) | dsh-jev-interceptor (Jev) |
|---|---|---|
| Decision shape | emits JSON token-by-token, then parses it and prays | typed `choice`/`noul` answers — type errors are structurally impossible |
| Cost per call | one **full LLM request** | **~$0.00002** (measured: 501 input tokens) |
| Latency | seconds | ~100ms provider-side (TypeSafe-reported p50); ~1s end-to-end from outside US-West |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:301-341](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/index.ts#L301-L341)

实际guard/preapproval挂点。

<details>
<summary>查看原文（41行）</summary>

```text
  if (settings.guardEnabled) {
    ctx.on('tools/pre-execute', createGuardListener({
      readOnlyTools: settings.readOnlyTools,
      excludeTools: settings.excludeTools,
      thresholds: {
        confidenceMin: settings.guardConfidenceMin,
        denyConfidence: settings.guardDenyConfidence,
        irreversibleCeiling: settings.guardIrreversibleCeiling,
        irreversibleDenyFloor: settings.guardIrreversibleDenyFloor,
        injectionAskThreshold: settings.guardInjectionAskThreshold,
      },
      recentMessages: settings.recentMessages,
      recentMessageChars: settings.recentMessageChars,
      argsHeadChars: settings.argsHeadChars,
      argsTailChars: settings.argsTailChars,
      jev,
      telemetry,
      pendingAsks,
      live,
      // Resolved per event: a capture here could miss a service that activates later.
      permissionPresets: () => ctx.get('permissionPresets'),
    }))
  }

  if (settings.preapproveEnabled) {
    ctx.on('approval/request', createPreapproveListener({
      allowlist: settings.preapproveToolAllowlist,
      thresholds: {
        autoApproveMin: settings.preapproveAutoApproveMin,
        irreversibleMax: settings.preapproveIrreversibleMax,
        injectionSuspectMax: settings.preapproveInjectionSuspectMax,
      },
      recentMessages: settings.preapproveRecentMessages,
      recentMessageChars: settings.recentMessageChars,
      jev,
      telemetry,
      pendingAsks,
      live,
      trace: approvalTrace,
    }), { prepend: true })
  }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/cordis.patch.yml#L1-L25)

resolver替换是部署范围。

<details>
<summary>查看原文（25行）</summary>

```text
# The dsh-jev-interceptor bundle layer.
#
# Row 1 (jev-interceptor): the tools/pre-execute guard and approval/request
# pre-approver. Inert until `enabled: true` in config.
#
# Rows 2-3 take over the upstream session-reference row by subclassing its
# resolver: the replacement inherits @-mention discovery, the remote
# candidates face, budgets, spill, and cancellation unchanged, and
# `sessionReferenceEnabled: false` (default) renders byte-for-byte like the
# upstream resolver. Correct way to remove this takeover: disable the whole
# bundle layer (setBundleEnabled false), which restores the original row —
# disabling only the jev-session-reference row would leave the original row
# overridden and no session-reference plugin active.
#
# The session-reference override only matches in profiles that stack the
# web-app layer (where the upstream row lives), such as the web and demo
# profiles.
- insert:
    - id: jev-interceptor
      name: dsh-jev-interceptor
    - id: jev-session-reference
      name: dsh-jev-interceptor/session-reference

- id: session-reference
  disabled: true
```

</details>

#### 缺口

- 未同任务比较分类准确、漏拦/误拦与业务结果
  **影响**：不能保证更安全/更便宜或真实净收益
  **进一步探讨**：隔离profile对照原生审批/FIFO，记错误决策、任务正确与全成本。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · guard和预批的证据、mode及next怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

默认enabled=false/mode shadow，预批白名单空。guard评估失败或无意见委托next，shadow同样next；enforce才返回ask或deny，不用分类成功直接放行越过后续决策。PendingAsks按sessionId+callId定界、上限64且10分钟新鲜，take即消耗并核tool匹配。预批要白名单、callId及捕获参数，自己的jev-guard升级明确委托人类，不对仅模型理由自动批准。

预批评估失败保next，只有enforce且auto-approve才allowed-once；next自身异常不当成分类失败吞掉。typed矩阵和证据约束有具体权限收窄价值，但阈值仍需校准、分类器可误判，next表示回原生而不是“所有失败皆deny”。依赖DSH alpha/宿主事件语义、provider/key与网络，源码未证明具体宿主或服务当前可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:122-147](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/config.ts#L122-L147)

默认关闭/shadow/白名单。

<details>
<summary>查看原文（26行）</summary>

```text
  enabled: false,
  mode: 'shadow' as const,
  provider: 'typesafe' as const,
  apiKeyEnv: 'TYPESAFE_API_KEY',
  timeoutMs: 1500,
  /** OpenRouter 的 decisions 端点实测 2-3s（本机 p95 ~3s），显式配置可覆盖。 */
  openrouterTimeoutMs: 3000,
  cooldownMs: 60_000,
  failureThreshold: 3,
  maxConcurrency: 4,
  cacheSize: 512,
  recentMessages: 6,
  preapproveRecentMessages: 3,
  recentMessageChars: 300,
  argsHeadChars: 2048,
  argsTailChars: 512,
  guardEnabled: true,
  guardReadOnlyTools: [...DEFAULT_READ_ONLY_TOOLS],
  guardExcludeTools: [] as string[],
  guardConfidenceMin: 0.6,
  guardDenyConfidence: 0.85,
  guardIrreversibleCeiling: 0.2,
  guardIrreversibleDenyFloor: 0.5,
  guardInjectionAskThreshold: 0.8,
  preapproveEnabled: true,
  preapproveToolAllowlist: [] as string[],
```

</details>

**依据 2 · 源码核查**：[src/guard.ts:40-84](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/guard.ts#L40-L84)

有界新鲜单次证据与身份。

<details>
<summary>查看原文（45行）</summary>

```text
/** Entries older than this bound are stale on sight; a hygiene constant, not a deployment tunable. */
const PENDING_ASK_STALE_MS = 10 * 60_000

/**
 * Bounded store of guard escalations keyed by `sessionId:callId` — provider
 * call ids are NOT unique across concurrent sessions (they can collide as
 * `call_0` in parallel subagent loops), so the session id must disambiguate.
 * The pre-approval answerer consumes an entry only when it is fresh and its
 * tool matches the request, so a stale or mismatched entry never supplies the
 * argument evidence for an auto-approval.
 */
export class PendingAsks {
  private readonly asks = new Map<string, PendingAsk>()

  /**
   * Record one escalation.
   * @param sessionId - session that owns the escalated call.
   * @param callId - the escalated tool call.
   * @param ask - bounded context for the pre-approval question.
   */
  set(sessionId: string, callId: string, ask: Omit<PendingAsk, 'createdAt'>): void {
    if (this.asks.size >= 64) {
      const oldest = this.asks.keys().next()
      if (oldest.done !== true) this.asks.delete(oldest.value)
    }
    this.asks.set(`${sessionId}\0${callId}`, { ...ask, createdAt: Date.now() })
  }

  /**
   * Take (remove) the context recorded for one call, but only when it is
   * fresh and belongs to the asking tool.
   * @param sessionId - session that owns the approval request.
   * @param callId - the call being approved.
   * @param toolName - the tool the approval question names.
   * @returns the matching fresh context, or `undefined` (the entry is
   *   dropped either way — a miss must never be retried against stale data).
   */
  take(sessionId: string, callId: string, toolName: string): PendingAsk | undefined {
    const key = `${sessionId}\0${callId}`
    const ask = this.asks.get(key)
    this.asks.delete(key)
    if (ask === undefined) return undefined
    if (ask.tool !== toolName) return undefined
    if (Date.now() - ask.createdAt > PENDING_ASK_STALE_MS) return undefined
    return ask
```

</details>

**依据 3 · 源码核查**：[src/guard.ts:191-213](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/guard.ts#L191-L213)

失败/影子委托与enforce动作。

<details>
<summary>查看原文（23行）</summary>

```text
): (exec: ToolExecution, next: () => Promise<PreToolDecision>) => Promise<PreToolDecision> {
  return async (exec, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    let action: GuardAction | undefined
    try {
      action = await evaluateGuard(deps, live, exec)
      // evaluateGuard returns undefined when the call should simply delegate.
    } catch {
      // Our own failure must degrade to stock behavior; next() errors are not ours to swallow.
      action = undefined
    }
    if (action === undefined || action.kind === 'delegate') return next()
    if (live.mode === 'shadow') return next()
    if (action.kind === 'ask') {
      // evaluateGuard already recorded the bounded preview for the pre-approval question.
      return { kind: 'ask', reason: action.reason }
    }
    // info.reason 是上游 ToolErrorInfo 专设的用户可见通道（durable 投影保留、
    // model-facing content 不含）：把同一份拦截理由送进审计与面板回放。
    return { kind: 'deny', reason: action.reason, info: { ...GUARD_DENY_INFO, reason: action.reason } }
  }
}
```

</details>

**依据 4 · 源码核查**：[src/preapprove.ts:94-139](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/preapprove.ts#L94-L139)

白名单/自己升级/证据与模式门。

<details>
<summary>查看原文（46行）</summary>

```text
): (req: ApprovalRequestEvent, next: () => Promise<ApprovalOutcome>) => Promise<ApprovalOutcome> {
  return async (req, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    // Our guard's escalation is a request FOR the human; auto-approving it would defeat the guard.
    if (req.reason !== undefined && req.reason.startsWith('jev-guard:')) return next()
    if (!deps.allowlist.has(req.toolName)) return next()

    let verdict: PreapproveVerdict | undefined
    try {
      verdict = await evaluatePreapprove(deps, live, req)
    } catch {
      // Our own failure must land on the human answerer; next() errors are not ours to swallow.
      verdict = undefined
    }
    deps.trace?.noteVerdict(
      req.agent.session.id,
      req.callId === undefined ? undefined : String(req.callId),
      verdict === undefined ? 'not-evaluated' : verdict.kind,
    )
    if (verdict === undefined) return next()
    if (live.mode === 'enforce' && verdict.kind === 'auto-approve') return 'allowed-once'
    return next()
  }
}

/**
 * Run every pre-approval stage that must not swallow `next()` failures.
 * Returns `undefined` for delegation — most importantly whenever argument
 * evidence is missing, stale, or mismatched.
 */
async function evaluatePreapprove(
  deps: PreapproveDeps,
  live: LiveSettings,
  req: ApprovalRequestEvent,
): Promise<PreapproveVerdict | undefined> {
  const session = req.agent.session
  // Without captured arguments the only grant evidence left is the model's
  // own ask reason; judge that for a human, never for an auto-approval.
  if (req.callId === undefined) return undefined
  const pending = deps.pendingAsks.take(session.id, req.callId, req.toolName)
  if (pending === undefined) return undefined

  const state = {
    tool: req.toolName,
    ask_reason: req.reason ?? '',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · shadow能保证所有动作只记录吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能覆盖已读图像路径。index只在imageOffloadEnabled=true时挂agent/pre-step，默认关闭且注释承认image/offload落盘不可逆。listener只检查live.enabled、token压力、图片数和分类结果，高置信“可牺牲”时直接session.append(image/offload)，未检查live.mode是否enforce；mode只传分类和遥测。因此enabled+shadow+图像opt-in+阈值满足仍可改变持久会话。

这是固定控制流缺门，不是将所有shadow挂点泛化坏：guard/preapprove有明确模式门，引用保留shadow也回upstream，停滞提醒只enforce注入。默认关图像避免通常触发，不修复opt-in对只记录承诺的违反。分类图像只用周围文本与age，没有直接图像视觉理解证据，误选后信息价值仍需检验。未运行/故障复现，不称已丢用户图片。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:343-358](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/index.ts#L343-L358)

默认关闭/不可逆注释与挂载。

<details>
<summary>查看原文（16行）</summary>

```text
  // Image-offload pre-planning: fills the gap dsh's README admits —
  // "nothing plans an offload before dispatch". Opt-in (default off) because
  // image/offload events are irreversible on disk; only high-confidence
  // sacrificial images are offloaded before the request dispatches.
  if (config.imageOffloadEnabled === true) {
    ctx.on('agent/pre-step', createImageOffloadListener({
      live,
      pressureThreshold: config.imageOffloadPressureThreshold ?? 0.75,
      minCandidates: config.imageOffloadMinCandidates ?? 3,
      sacrificeScoreMax: config.imageOffloadSacrificeScoreMax ?? 0.33,
      sacrificeProbMin: config.imageOffloadSacrificeProbMin ?? 0.8,
      jev,
      telemetry,
    }))
  }

```

</details>

**依据 2 · 源码核查**：[src/image-offload.ts:73-92](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/image-offload.ts#L73-L92)

仅enabled/压力/候选门。

<details>
<summary>查看原文（20行）</summary>

```text
export function createImageOffloadListener(
  deps: ImageOffloadDeps,
): (payload: { agent: Agent; messages: unknown[]; turn: number; step: number; signal: AbortSignal }, next: () => Promise<PreStepDecision>) => Promise<PreStepDecision> {
  return async (payload, next) => {
    const live = deps.live()
    if (!live.enabled) return next()
    const agent = payload.agent
    const session = agent.session

    // L1: pressure gate — read the token meter's latest measurement.
    const tokenMeter = (session as unknown as { tokenMeter?: { totalTokens: number; contextWindow: number } }).tokenMeter
    if (tokenMeter === undefined) return next()
    const contextWindow = tokenMeter.contextWindow || 0
    if (contextWindow <= 0) return next()
    const pressure = tokenMeter.totalTokens / contextWindow
    if (pressure < deps.pressureThreshold) return next()

    // L2: candidate gate — need enough unoffloaded images to be worth a Jev call.
    const candidates = collectImageCandidates(session)
    const imageCount = candidates.reduce((sum, c) => sum + c.imageIndexes.length, 0)
```

</details>

**依据 3 · 源码核查**：[src/image-offload.ts:120-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/image-offload.ts#L120-L164)

mode未阻落盘事件。

<details>
<summary>查看原文（45行）</summary>

```text
    const result = await deps.jev.classify({
      tag: 'guard',
      mode: live.mode,
      sessionId: session.id,
      state: {
        task: 'Free context by offloading sacrificial images before the next model request',
        images: flatImages.map(img => ({ index: flatImages.indexOf(img), context: img.context, age_in_messages: img.age })),
      },
      questions,
      signal: payload.signal,
    })
    if (result === null) return next()

    // L4: selection — only high-confidence sacrificial images get offloaded.
    const toOffload: { seq: number; imageIndexes: number[] }[] = []
    for (const [index, img] of flatImages.entries()) {
      const answer = result.answers[`img_${index}`]
      if (answer === undefined || answer.type !== 'score') continue
      const scoreAnswer = answer as ScoreAnswer
      if (scoreAnswer.score > deps.sacrificeScoreMax) continue
      const sacrificeProb = scoreAnswer.probabilities?.['0'] ?? 0
      if (sacrificeProb < deps.sacrificeProbMin) continue
      // Group by source message seq.
      const existing = toOffload.find(t => t.seq === img.seq)
      if (existing !== undefined) existing.imageIndexes.push(img.imageIndex)
      else toOffload.push({ seq: img.seq, imageIndexes: [img.imageIndex] })
    }

    if (toOffload.length > 0) {
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

**依据 4 · 源码核查**：[src/session-reference.ts:403-415](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/session-reference.ts#L403-L415)

引用shadow确实upstream反证。

<details>
<summary>查看原文（13行）</summary>

```text
      // skipped (upstream would raise the same budget error anyway).
      const fifo = retainScoredSession(source.snapshot, source.input.label, maxReferenceBytes, null)
      if (this.scoring.mode === 'enforce') {
        if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
        rendered.push({ ...scored, capturedFormatVersion: source.snapshot.session.version })
        continue
      }
      // Shadow: the real render stays the upstream bytes; the scored selection
      // is only the recorded counterfactual.
      const upstreamRendered = upstream([source], maxReferenceBytes)
      if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
      rendered.push(...upstreamRendered)
    }
```

</details>

**依据 5 · 源码核查**：[src/stagnation.ts:303-313](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/stagnation.ts#L303-L313)

停滞模式门反证。

<details>
<summary>查看原文（11行）</summary>

```text
      const downstream = await next()
      try {
        const judged = await observed.probe
        if (judged === undefined || !judged.alerted) return downstream
        // shadow 模式只记遥测不注入（照 guard/preapprove 的 would-have 语义）。
        if (observed.mode === 'enforce') {
          deps.tracker.noteAlert(observed.target.agent, observed.target.tool, now())
          return prependContext(downstream, buildReminder(observed.target.tool, observed.target.attempts, judged.confidence))
        }
        return downstream
      } catch {
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 引用替换、缓存与遥测如何影响恢复和成本？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

bundle覆盖原session-reference行并装子类，继承发现/预算/溢出等上游能力；enforce用scored结果，shadow实际回upstream只记反事实，评分不完整不该驱动选择。它改变丢弃策略不是无限上下文，也不证明错误线索一定比FIFO保得好。退出必须禁整个bundle恢复原行，单禁替换行会留下原行disabled。

Jev客户端缓存key含model/state/questions，命中只复用answers不重计usage/latency，避免遥测重复账单；限并发、剩余预算重试/cooldown是有界降级策略，失败回宿主路径仍需实际任务验证。telemetry异步串行append，异常吞掉，不是有效动作前置事务；缓存与日志用量也不是provider完整账单。

现金有分类API/模型结果费，资源有JSONL/缓存/引用评分，人工需看错判、ask/deny、阈值/alpha升级与resolver恢复。首次provider配置、持续分类、故障重试/丢日志和退出都不能据作者单次例价估ROI；本轮不核当前外部价格，保持未知。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/cordis.patch.yml#L1-L25)

替换/整bundle退出。

<details>
<summary>查看原文（25行）</summary>

```text
# The dsh-jev-interceptor bundle layer.
#
# Row 1 (jev-interceptor): the tools/pre-execute guard and approval/request
# pre-approver. Inert until `enabled: true` in config.
#
# Rows 2-3 take over the upstream session-reference row by subclassing its
# resolver: the replacement inherits @-mention discovery, the remote
# candidates face, budgets, spill, and cancellation unchanged, and
# `sessionReferenceEnabled: false` (default) renders byte-for-byte like the
# upstream resolver. Correct way to remove this takeover: disable the whole
# bundle layer (setBundleEnabled false), which restores the original row —
# disabling only the jev-session-reference row would leave the original row
# overridden and no session-reference plugin active.
#
# The session-reference override only matches in profiles that stack the
# web-app layer (where the upstream row lives), such as the web and demo
# profiles.
- insert:
    - id: jev-interceptor
      name: dsh-jev-interceptor
    - id: jev-session-reference
      name: dsh-jev-interceptor/session-reference

- id: session-reference
  disabled: true
```

</details>

**依据 2 · 源码核查**：[src/session-reference.ts:403-415](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/session-reference.ts#L403-L415)

实际enforce/shadow选择。

<details>
<summary>查看原文（13行）</summary>

```text
      // skipped (upstream would raise the same budget error anyway).
      const fifo = retainScoredSession(source.snapshot, source.input.label, maxReferenceBytes, null)
      if (this.scoring.mode === 'enforce') {
        if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
        rendered.push({ ...scored, capturedFormatVersion: source.snapshot.session.version })
        continue
      }
      // Shadow: the real render stays the upstream bytes; the scored selection
      // is only the recorded counterfactual.
      const upstreamRendered = upstream([source], maxReferenceBytes)
      if (fifo !== undefined) this.recordComparison(source, scored, fifo, scores)
      rendered.push(...upstreamRendered)
    }
```

</details>

**依据 3 · 源码核查**：[src/jev.ts:166-215](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/jev.ts#L166-L215)

cache命中不重计与预算/降级。

<details>
<summary>查看原文（50行）</summary>

```text

    const key = await this.resolveKey()
    if (key === undefined || key.length === 0) return degrade('no-key')
    if (this.gate.open()) return degrade('cooldown')

    const cacheKey = createHash('sha256')
      .update(JSON.stringify([this.model, call.state, call.questions]))
      .digest('hex')
    const hit = this.cache.get(cacheKey)
    if (hit !== undefined) {
      // A hit reuses the ANSWERS only: usage and latency belong to the
      // original billable call, so recording them again would multiply the
      // reported token count and cost by every reuse.
      return {
        answers: hit.answers,
        model: hit.model,
        latencyMs: 0,
        inputTokens: undefined,
        costUsd: undefined,
        cached: true,
      }
    }

    if (call.signal?.aborted) return degrade('aborted')
    const acquired = await this.semaphore.acquire(
      call.signal ?? new AbortController().signal,
      this.timeoutMs - (this.now() - started),
    )
    if (acquired !== 'acquired') return degrade(acquired === 'aborted' ? 'aborted' : 'timeout')
    try {
      const outcome = await this.request(call, key, started)
      if (typeof outcome === 'string') {
        if (outcome === 'caller-aborted') return degrade('aborted')
        if (outcome === 'timeout') this.countFailure('timeout')
        else this.countFailure(outcome)
        return degrade(outcome === 'retryable' ? 'http-error' : outcome)
      }
      this.gate.onSuccess()
      const result: ClassifyResult = {
        ...outcome,
        latencyMs: this.now() - started,
        cached: false,
      }
      this.cache.set(cacheKey, result)
      return result
    } finally {
      this.semaphore.release()
    }
  }

```

</details>

**依据 4 · 源码核查**：[src/telemetry.ts:108-120](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/telemetry.ts#L108-L120)

best-effort日志。

<details>
<summary>查看原文（13行）</summary>

```text
   * the decision path already committed. Writes are chained so records land in
   * the log in the order they were recorded.
   * @param entry - the record to persist.
   */
  record(entry: TelemetryEntry): void {
    this.writeQueue = this.writeQueue
      .then(() => this.ready())
      .then(() => appendFile(this.file, `${JSON.stringify(entry)}\n`, 'utf8'))
      .catch(() => {
        // Telemetry is best-effort; nothing downstream depends on it.
      })
  }

```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样限定隔离试用与退出？

**研究主题**：采用判断

#### 完整回答

可在愿审日志的隔离profile条件试用：enabled后从shadow观测起，图像卸载保持关闭、预批白名单保持空，不马上自动授权；核同一工具调用的捕获参数、mode/decision和宿主实际结果。确认原resolver、备份profile和引用材料，provider输入可能含工具参数/近期文本，敏感任务先审数据流而非只说日志脱敏。

合格标准是权限不扩、shadow无状态变化、每项有效动作可解释且任务正确；原生行为不能靠单插件自报保证。误拦/误批、缺遥测的动作、shadow副作用或resolver缺失即停整个bundle回原生并核实际会话事件，已落盘图像卸载不当自动可逆。持续采用需同版宿主和基线总成本验收，本次无。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:122-147](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/config.ts#L122-L147)

保守默认可限定路径。

<details>
<summary>查看原文（26行）</summary>

```text
  enabled: false,
  mode: 'shadow' as const,
  provider: 'typesafe' as const,
  apiKeyEnv: 'TYPESAFE_API_KEY',
  timeoutMs: 1500,
  /** OpenRouter 的 decisions 端点实测 2-3s（本机 p95 ~3s），显式配置可覆盖。 */
  openrouterTimeoutMs: 3000,
  cooldownMs: 60_000,
  failureThreshold: 3,
  maxConcurrency: 4,
  cacheSize: 512,
  recentMessages: 6,
  preapproveRecentMessages: 3,
  recentMessageChars: 300,
  argsHeadChars: 2048,
  argsTailChars: 512,
  guardEnabled: true,
  guardReadOnlyTools: [...DEFAULT_READ_ONLY_TOOLS],
  guardExcludeTools: [] as string[],
  guardConfidenceMin: 0.6,
  guardDenyConfidence: 0.85,
  guardIrreversibleCeiling: 0.2,
  guardIrreversibleDenyFloor: 0.5,
  guardInjectionAskThreshold: 0.8,
  preapproveEnabled: true,
  preapproveToolAllowlist: [] as string[],
```

</details>

**依据 2 · 源码核查**：[src/preapprove.ts:134-145](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/preapprove.ts#L134-L145)

参数/近期文本外发判定输入。

<details>
<summary>查看原文（12行）</summary>

```text
  const pending = deps.pendingAsks.take(session.id, req.callId, req.toolName)
  if (pending === undefined) return undefined

  const state = {
    tool: req.toolName,
    ask_reason: req.reason ?? '',
    args_preview: pending.argsPreview,
    recent: digestRecent(session.deriveMessages(), deps.recentMessages, deps.recentMessageChars),
    cwd: session.header.cwd ?? '',
  }

  const result = await deps.jev.classify({
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:6-12](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/cordis.patch.yml#L6-L12)

完整退出约束。

```text
# Rows 2-3 take over the upstream session-reference row by subclassing its
# resolver: the replacement inherits @-mention discovery, the remote
# candidates face, budgets, spill, and cancellation unchanged, and
# `sessionReferenceEnabled: false` (default) renders byte-for-byte like the
# upstream resolver. Correct way to remove this takeover: disable the whole
# bundle layer (setBundleEnabled false), which restores the original row —
# disabling only the jev-session-reference row would leave the original row
```

#### 缺口

- 未同版宿主/目标provider及退出/故障验收
  **影响**：只支持隔离条件探索，不支持持续采用和安全承诺
  **进一步探讨**：不敏感profile比原生，核权限/状态/日志/恢复及provider输入，记录完整成本。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 统一effect gate有何可证伪增量？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是所有有效动作携mode/provenance/所用证据/可逆性，在单一提交门强制shadow只能产建议；不重复计算已有guard/preapprove模式门、引用反事实或遥测。图像分支缺门说明分散检查会漏，但不证明集中提交必然更可靠。

用工具deny/ask、预批、引用裁剪、停滞提醒、图像卸载五类挂点及provider失败/丢日志/取消矩阵比当前实现；任一shadow持久变化即失败，再比原生权限错误、任务质量和API/人工总成本。若统一门漏别的状态、增加维护耦合或已有局部门足够，则否定独立扩展。实验未执行，不纳已有创新分。

#### 证据与依据

**依据 1 · 源码核查**：[src/image-offload.ts:149-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/image-offload.ts#L149-L164)

无统一mode gate的实际线索。

<details>
<summary>查看原文（16行）</summary>

```text
      // L5: land image/offload events in the exact upstream format.
      for (const target of toOffload) {
        ;(session as unknown as { append: (type: string, data: unknown) => void }).append('image/offload', { targets: [target] })
      }
      deps.telemetry.record({
        ts: new Date().toISOString(),
        tag: 'guard',
        mode: live.mode,
        sessionId: session.id,
        action: 'skipped',
        detail: `image-offload: pre-planned ${toOffload.reduce((s, t) => s + t.imageIndexes.length, 0)} images at pressure ${(pressure * 100).toFixed(0)}%`,
        latencyMs: result.latencyMs,
      })
    }

    return next()
```

</details>

**依据 2 · 源码核查**：[src/guard.ts:203-212](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/guard.ts#L203-L212)

既有局部门是基线。

<details>
<summary>查看原文（10行）</summary>

```text
    if (action === undefined || action.kind === 'delegate') return next()
    if (live.mode === 'shadow') return next()
    if (action.kind === 'ask') {
      // evaluateGuard already recorded the bounded preview for the pre-approval question.
      return { kind: 'ask', reason: action.reason }
    }
    // info.reason 是上游 ToolErrorInfo 专设的用户可见通道（durable 投影保留、
    // model-facing content 不含）：把同一份拦截理由送进审计与面板回放。
    return { kind: 'deny', reason: action.reason, info: { ...GUARD_DENY_INFO, reason: action.reason } }
  }
```

</details>

**依据 3 · 源码核查**：[src/preapprove.ts:111-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/2ba7b8c9fce9dfc364ba057099a4b459edc9e760/src/preapprove.ts#L111-L116)

既有预批门是基线。

```text
      req.callId === undefined ? undefined : String(req.callId),
      verdict === undefined ? 'not-evaluated' : verdict.kind,
    )
    if (verdict === undefined) return next()
    if (live.mode === 'enforce' && verdict.kind === 'auto-approve') return 'allowed-once'
    return next()
```

#### 缺口

- 未实施统一门或跨挂点故障矩阵
  **影响**：不能声称解决shadow副作用或净收益
  **进一步探讨**：隔离矩阵逐动作查状态/权限与基线全成本，无净改善不做。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
