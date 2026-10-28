# dsh-jev-interceptor

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[6eedce8](https://github.com/AskTheWay/dsh-jev-interceptor/tree/6eedce85014b7f237c4a4f6bc513b8239103bef2)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AskTheWay/dsh-jev-interceptor) [![npm 30d 2,815](https://img.shields.io/static/v1?label=npm+30d&message=2%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-interceptor)
<!-- END META -->

> **功能**：将 Jev typed 决策接入 DSH 工具风险分流、证据门控预批及上下文保留

> **亮点**：typed fan-out接多宿主决策点，并用next委托、空白名单、session/call/tool新鲜参数证据与字节预算限制部分权限和信息损失；贡献在编排，不等分类准确或最终任务收益。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：确认逻辑缺陷：opt-in图像卸载在shadow也可直接落盘image/offload，违反只记录承诺；默认关闭收窄触发面但不消除缺陷。其他挂点有mode门，不能泛化。[Q03](#research-q03)

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
  - [Q01 · 真实接入哪些决策，目标结果是什么？](#detail-section-11)
  - [Q02 · guard和预批如何避免模型扩大权限？](#detail-section-12)
  - [Q03 · 全局shadow只记录承诺是否成立？](#detail-section-13)
  - [Q04 · 外部分类和遥测是否能证明净收益？](#detail-section-14)
  - [Q05 · 怎样小范围试用和退出？](#detail-section-15)
  - [Q06 · 统一副作用门是否值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁工具调用且愿校准遥测的DSH开发者，以可控风险分流和任务正确为目标。

原生人工/规则审批与静态FIFO保留，Jev模型是外部依赖，非插件原创；未作同任务运行比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| guard/预批 | 风险分流与有证据allowed-once | 空白名单、mode、同call证据；准确率未证 |
| session保留 | 评分替代FIFO | 有字节预算，shadow走upstream |
| 可选图像卸载 | 压力下减少图上下文 | 默认关；shadow遗漏可直接落盘 |
| 遥测/校准 | 回看分类与建议阈值 | 写失败可吞，不是审计事务 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 相容DSH alpha事件/审批/resolver API | 启动与对应挂点必需 | 多决策接线 | 不同版本须重验，不用空inject推断全兼容 |
| Jev provider、key、endpoint/model | 分类必需 | typed判断 | 无key/超时/cooldown多数回原生，不是全拒绝 |
| 可发送的有界参数/摘要 | 分类效果必需 | 提供任务证据 | 截短非匿名，不能外发则不适用 |
| 可写遥测目录与人工校准 | 效果评估必需 | 日志/阈值 | 日志失败可吞掉，非零动作证明 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 用户在隔离profile核key与数据目的地 | 不把作者dogfood当本地账单 |
| 2 | 主row shadow，图像卸载false，白名单空 | 所有挂点零状态变化，故障回原生 |
| 3 | 用户仅对可逆工具逐项试enforce | 同session/call/tool证据正确且可复核 |
| 4 | 禁整个bundle恢复session-reference | 不单关替代row；缺resolver立即停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | provider/key与本地资源，费用未知 | 装隔离profile、审参数与配置 | 价格/政策未独立验证 |
| 持续使用 | 分类调用与JSONL资源未知 | 处理误判、ask/deny与阈值校准 | cache不重计usage，非完整账单 |
| 失败恢复 | 重试/cooldown与原生审批资源 | 查丢日志、mode和resolver | telemetry非事务前提 |
| 升级/退出 | 兼容与迁移资源未知 | 禁bundle并核原resolver，重验alpha API | 单关row可能留功能空缺 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 风险分流 | typed问答到ask/deny/next | 准确率、漏拦和任务正确 |
| 预批 | 白名单和新鲜参数证据门 | 作者0/0无误预批样本，净点击收益未知 |
| 信息保留 | enforce评分、shadow upstream | 最终质量是否胜FIFO |
| shadow安全 | 多数挂点有门 | 图像opt-in已见模式遗漏 |

> **思考**：确认逻辑缺陷：opt-in图像卸载在shadow也可直接落盘image/offload，违反只记录承诺；默认关闭收窄触发面但不消除缺陷。其他挂点有mode门，不能泛化。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：typed fan-out接多宿主决策点，并用next委托、空白名单、session/call/tool新鲜参数证据与字节预算限制部分权限和信息损失；贡献在编排，不等分类准确或最终任务收益。[Q01](#research-q01) [Q02](#research-q02)

typed矩阵、next委托、单次session/call/tool证据、cache不重复计费及并发冷却可复用；分散effect门、best-effort遥测和alpha resolver耦合是主要代价，复制分类器不等权限保证。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

确认逻辑缺陷：opt-in图像卸载在shadow也可直接落盘image/offload，违反只记录承诺；默认关闭收窄触发面但不消除缺陷。其他挂点有mode门，不能泛化。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离profile试用：图像卸载保持关闭、白名单空并从shadow审起；任何shadow状态变化、无遥测有效动作或resolver缺失即停用整个bundle回原生。[Q05](#research-q05)

采用建议：隔离profile试用：图像卸载保持关闭、白名单空并从shadow审起；任何shadow状态变化、无遥测有效动作或resolver缺失即停用整个bundle回原生。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

挂点、证据门与图像shadow遗漏为固定源码支持，后者为条件明确逻辑缺陷；dogfood是作者报告，本轮未运行provider。效果和统一gate假设未验证。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、cordis.patch.yml、src/index.ts、src/config.ts、src/guard.ts、src/preapprove.ts、src/image-offload.ts、src/session-reference.ts、src/jev.ts、src/telemetry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根49个tracked文件统计；重点index、guard/preapprove、image、session-reference、client resilience/telemetry/config及patch。源码不是已发布lib字节验收；未运行目标/provider或真实Host。
- 下一步：合成参数在五挂点shadow/enforce/disabled矩阵中注入超时/半响应/日志失败/取消，检查零shadow副作用与整体bundle恢复；同任务比较原生的误判、最终正确、总费用和人工分钟。

**分析版本**

- **仓库**：[AskTheWay/dsh-jev-interceptor](https://github.com/AskTheWay/dsh-jev-interceptor)
- **版本号**：0.6.1（[固定提交 6eedce8](https://github.com/AskTheWay/dsh-jev-interceptor/tree/6eedce85014b7f237c4a4f6bc513b8239103bef2)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证统一effect gate让所有动作携带mode/provenance/证据/可逆性，单一提交边界强制shadow只建议；跨五类挂点矩阵中任意shadow状态变化即否定，再与原生比误判和全成本。[Q06](#research-q06)

合成参数在五挂点shadow/enforce/disabled矩阵中注入超时/半响应/日志失败/取消，检查零shadow副作用与整体bundle恢复；同任务比较原生的误判、最终正确、总费用和人工分钟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 656 | — | — | 9394 |
| .mjs | source | 4 | 357 | 317 | 27 | — |
| .ts | source | 22 | 5911 | 4153 | 1416 | — |
| .js | source | 1 | 219 | 158 | 36 | — |
| .tsx | source | 2 | 1489 | 1339 | 66 | — |
| .ts | test | 14 | 2354 | 2070 | 94 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/AskTheWay/dsh-jev-interceptor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：typed决策集成能否保持权限、shadow与信息损失边界，并提供可核查净收益？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实接入哪些决策，目标结果是什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标人群是在隔离DSH profile频繁调用工具、愿意审遥测和校准阈值的开发者；合格结果不仅是分类响应，而是风险/权限选择不越界且任务办结、成本可追踪。index真实挂tools/pre-execute、approval/request，另有opt-in agent/pre-step图像卸载及停滞检测，session事件记录审批循环。bundle新增主row并以子类resolver替代session-reference，评分决定丢弃顺序而保留上游预算/发现能力。贡献是typed decision fan-out与宿主多决策点的集成及有界证据，不是Jev模型原创；相对原生审批/静态FIFO是否更好仍要同任务验证，不能照作者生态首个或毫秒宣传判定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:281-335](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/index.ts#L281-L335)

guard、preapprove和图像挂点真实接线。

<details>
<summary>查看原文（55行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/cordis.patch.yml#L1-L25)

替代resolver与整体禁用边界。

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

**依据 3 · 源码核查**：[src/session-reference.ts:395-415](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/session-reference.ts#L395-L415)

enforce选择与shadow保持upstream分开。

<details>
<summary>查看原文（21行）</summary>

```text
      const scored = retainScoredSession(source.snapshot, source.input.label, maxReferenceBytes, scores, { protectAbove })
      if (scored === undefined) {
        // Scoring cannot resize past what FIFO could; upstream raises the same error.
        rendered.push(...upstream([source], maxReferenceBytes))
        continue
      }
      // The FIFO counterfactual is computed once per source and shared with
      // the comparison record; when it cannot fit, the comparison is simply
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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · guard和预批如何避免模型扩大权限？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

guard对不确定/失败返回next，shadow也next；enforce仅ask/deny，不自行allow，因此下游仍可否决，不能把delegate说成拒绝执行。预批先要求enabled、非jev-guard自发人类请求、tool白名单，再评估；allowed-once只在enforce和auto-approve时返回。evaluate还要求callId，PendingAsks按session+callId取且立即消费，核tool和新鲜度，没有捕获参数证据不靠模型reason直接预批。空白名单默认阻断所有自动预批，这是明确权限收窄。但这些结构不证明分类准确或口头授权理解正确，且“fail-closed”实质多数是回原生路径，不是阻断全部危险动作。

#### 证据与依据

**依据 1 · 源码核查**：[src/guard.ts:188-211](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/guard.ts#L188-L211)

真实guard只next/ask/deny，shadow不变更。

<details>
<summary>查看原文（24行）</summary>

```text
 */
export function createGuardListener(
  deps: GuardDeps,
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
```

</details>

**依据 2 · 源码核查**：[src/guard.ts:77-84](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/guard.ts#L77-L84)

pending证据单次消费、同tool和新鲜度。

```text
  take(sessionId: string, callId: string, toolName: string): PendingAsk | undefined {
    const key = `${sessionId}\0${callId}`
    const ask = this.asks.get(key)
    this.asks.delete(key)
    if (ask === undefined) return undefined
    if (ask.tool !== toolName) return undefined
    if (Date.now() - ask.createdAt > PENDING_ASK_STALE_MS) return undefined
    return ask
```

**依据 3 · 源码核查**：[src/preapprove.ts:95-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/preapprove.ts#L95-L116)

allowlist、enforce和allowed-once。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/preapprove.ts:125-153](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/preapprove.ts#L125-L153)

callId和捕获参数是模型分类的先决条件。

<details>
<summary>查看原文（29行）</summary>

```text
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
    args_preview: pending.argsPreview,
    recent: digestRecent(session.deriveMessages(), deps.recentMessages, deps.recentMessageChars),
    cwd: session.header.cwd ?? '',
  }

  const result = await deps.jev.classify({
    tag: 'preapprove',
    mode: live.mode,
    tool: req.toolName,
    sessionId: session.id,
    callId: req.callId === undefined ? undefined : String(req.callId),
    state,
    questions: PREAPPROVE_QUESTIONS,
    signal: req.signal,
```

</details>

#### 缺口

- 分类漏拦、误拦与真实预批授权匹配未测。
  **影响**：结构门不能作为实际安全准确率，尤其0/0预批没有效果样本。
  **进一步探讨**：用脱敏同工具/不同目标、过期callId和注入reason矩阵与原生人工审批对照，任何越权即停预批。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全局shadow只记录承诺是否成立？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不完全成立。session-reference在shadow明确调用upstream并只记录反事实，guard和预批也有mode门；但imageOffload listener只检查enabled，压力、候选和分类条件满足后直接session.append image/offload，没有shadow/enforce判断。index在imageOffloadEnabled=true时真实注册此分支，注释明确落盘不可逆，故这是条件明确的源码确认逻辑缺陷：默认关闭时不触发，开启后可违反shadow“只记录”。不能泛化为其他挂点都越权，也不能把默认off当无缺陷。信息保留评分还只根据周边文本，不直接证明被丢图可重建；状态改变与价值预测须分开验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:323-335](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/index.ts#L323-L335)

opt-in真实挂载及不可逆落盘声明。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/image-offload.ts:76-93](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/image-offload.ts#L76-L93)

仅enabled/压力/候选门，无mode。

<details>
<summary>查看原文（18行）</summary>

```text
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
    if (imageCount < deps.minCandidates) return next()
```

</details>

**依据 3 · 源码核查**：[src/image-offload.ts:120-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/image-offload.ts#L120-L164)

分类后选择并直接append事件，遥测标skipped不阻止写入。

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

**依据 4 · 源码核查**：[src/session-reference.ts:405-414](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/session-reference.ts#L405-L414)

对照分支确有shadow返回upstream。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 外部分类和遥测是否能证明净收益？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Jev请求需要key/endpoint/model，发送有界工具参数和最近消息摘要；截短不是匿名化，敏感参数仍可能在head/tail。client无key/cooldown返回null，有并发semaphore、LRU与超时/重试约束；cache命中只复用answers不重记usage，避免费用虚增。telemetry串行append但写失败被吞掉，决策已提交不依赖日志，所以无记录不等没有动作。README dogfood的272决策/费用/延迟是作者窗口，预批明确0/0无样本；不能以它证明本机账单、全场景漏拦或净效益。人工作业还含审ask/deny、误判复核和阈值校准；未测合格任务全尝试不能算单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/config.ts:34-55](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/config.ts#L34-L55)

时间、并发、cache与参数/消息截短配置。

<details>
<summary>查看原文（22行）</summary>

```text
  /** Wall-clock budget per decision attempt in milliseconds (default 1500). */
  timeoutMs?: number
  /** Cooldown after consecutive failures in milliseconds (default 60000). */
  cooldownMs?: number
  /** Consecutive failures that open the cooldown (default 3). */
  failureThreshold?: number
  /** Maximum in-flight Jev requests (default 4; the provider rate-limits near 8). */
  maxConcurrency?: number
  /** Decision input cache capacity (default 512). */
  cacheSize?: number
  /** Directory for `telemetry.jsonl` (default `~/.dsh-jev-interceptor`). */
  telemetryDir?: string
  /** Trailing messages digested into the guard state (default 6). */
  recentMessages?: number
  /** Trailing messages digested into the pre-approval state (default 3). */
  preapproveRecentMessages?: number
  /** Per-message text bound in the state, characters (default 300). */
  recentMessageChars?: number
  /** Head characters kept from tool arguments in the state (default 2048). */
  argsHeadChars?: number
  /** Tail characters kept from tool arguments in the state (default 512). */
  argsTailChars?: number
```

</details>

**依据 2 · 源码核查**：[src/jev.ts:164-209](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/jev.ts#L164-L209)

key/cooldown、cache费用与semaphore释放。

<details>
<summary>查看原文（46行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/telemetry.ts:106-118](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/telemetry.ts#L106-L118)

写失败best-effort，记录不是事务前提。

<details>
<summary>查看原文（13行）</summary>

```text
  /**
   * Append one record. Never throws: a telemetry failure is swallowed because
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
```

</details>

**依据 4 · 源码核查**：[README.md:95-106](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/README.md#L95-L106)

作者窗口与0/0，失败回原生不是拒绝。

<details>
<summary>查看原文（12行）</summary>

```text
Five weeks of dogfooding (2026-09-22 → 10-27, 15 active days, 7 sessions, 272 decisions — `/jev-impact` renders this from your own telemetry any time):

- the pre-approve path never fired, so the mis-approval metric has **no samples yet** (0/0, honestly rendered as "无样本" rather than "0") — what *was* exercised: 6 uncertain calls escalated to the human, 0 high-risk calls missed
- total decision cost: **$0.0068** (162,425 input tokens across 143 billed decisions; p50 1110ms, p95 1503ms — the screenshots above are this same window)
- 128 decisions degraded to stock behavior (no key for most of the window, 9 timeouts) at **zero behavioral cost** — the fail-closed posture doing exactly what it promises

Calibration closes its own loop: every `/jev-calibrate` run snapshots the report; the next run tells you which of its previous suggestions you adopted (`✓ 已采纳`), ignored, or manually overrode (`↔`), and how the agreement buckets moved since.

## Safety model (the part you should actually read)

- **Never `allow`.** "No objection" is expressed as `next()`, so downstream listeners (external hooks, auto-review) keep their veto.
- **Fail-closed everywhere.** No key / provider cooldown / timeout / parse mismatch / internal error → delegate to stock behavior. The approval service's `never` policy is enforced upstream of every listener, so this plugin structurally cannot relax it.
```

</details>

#### 缺口

- provider当前价格/政策、脱敏程度、真实任务质量与总费用未验证。
  **影响**：不能给固定节省或安全收益，关键参数不宜直接发外部。
  **进一步探讨**：先核数据发送目的地，用合成参数对照原生审批，记录账单、误判、人工分钟和最终正确率。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样小范围试用和退出？

**研究主题**：采用判断、依赖、兼容与流程

#### 完整回答

可控试用必须从隔离profile开始，imageOffloadEnabled保持false、白名单空、主row shadow；验证所有挂点零状态变化、provider故障回原生，然后只对可逆/可重建工具逐项扩大。需要纯人工确认所有外部写入或禁止发送参数摘要的人不适合。session-reference原row被patch disabled，不能只关替代row，否则没有resolver；退出须禁整个bundle层恢复原row并核发现/加载，而不只把enabled=false当全卸载。其维护成本包括多项alpha API、resolver子类和权限preset行为；未运行不能推荐持续安装。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-25](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/cordis.patch.yml#L1-L25)

整体bundle禁用才恢复original row。

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

**依据 2 · 源码核查**：[src/index.ts:323-335](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/index.ts#L323-L335)

图像opt-in需保持关闭。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[src/preapprove.ts:95-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/preapprove.ts#L95-L116)

白名单空和shadow为受控起点。

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

#### 缺口

- 精确Host上的零副作用shadow、bundle恢复和卸载未动态验收。
  **影响**：仅条件试用，不能install或称alpha全兼容。
  **进一步探讨**：隔离profile做无key/超时/错误响应、禁bundle恢复resolver和会话继续，出现缺resolver或无日志动作即停止。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 统一副作用门是否值得验证？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

从分散mode门漏掉image-offload可推导未验证假设：统一effect gate要求每个建议动作携带mode、来源证据、可逆性和对应session/call，将日志与副作用分离，并在单一提交边界强制shadow仅产建议。它不能靠再加一处if就证明所有未来挂点安全，也不能让分类替代宿主权限。最小验证跨guard/preapprove/retention/image/stagnation的shadow/enforce/disabled动作矩阵，注入超时、半响应、日志写失败和取消；shadow任何session.append、预批或保留结果变化都否定实现，再比较误判、任务正确率和全成本是否优于原生。

#### 证据与依据

**依据 1 · 源码核查**：[src/image-offload.ts:148-164](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/image-offload.ts#L148-L164)

mode门遗漏的实质副作用。

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 2 · 源码核查**：[src/preapprove.ts:114-116](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/preapprove.ts#L114-L116)

现有显式effect门对照。

```text
    if (verdict === undefined) return next()
    if (live.mode === 'enforce' && verdict.kind === 'auto-approve') return 'allowed-once'
    return next()
```

**依据 3 · 源码核查**：[src/session-reference.ts:405-414](https://github.com/AskTheWay/dsh-jev-interceptor/blob/6eedce85014b7f237c4a4f6bc513b8239103bef2/src/session-reference.ts#L405-L414)

保留结果的另一显式effect门。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

#### 缺口

- 统一gate能否覆盖所有future hook且不增加错误成本未知。
  **影响**：设计仍未验证，不计创新分或已确认需求。
  **进一步探讨**：按矩阵零副作用与故障回退为硬门，再以同任务质量/全成本比较；不优于基线则不扩展。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
