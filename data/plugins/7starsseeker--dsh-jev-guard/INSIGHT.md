# dsh-jev-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f6c73dc](https://github.com/7starsseeker/dsh-jev-guard/tree/f6c73dc589e572abd517d649d6196cdbca25a101)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,641](https://img.shields.io/static/v1?label=npm+30d&message=1%2C641&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-jev-guard)
<!-- END META -->

> **功能**：在 DSH 工具执行前结合静态规则与远程风险判定。

> **亮点**：[Q02](#research-q02) 把静态与语义判断接入工具前置流程。

> **主要限制**：[Q03](#research-q03) 远程故障和 adapter 异常 fail-open，显式降级 off 更会跳过 L0。

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
  - [Q01 · 命令预执行判定相比宿主审批有什么用途？](#detail-section-11)
  - [Q02 · 静态、预筛与远程判定怎样路由？](#detail-section-12)
  - [Q03 · 远程故障或异常是否仍保护语义风险？](#detail-section-13)
  - [Q04 · 什么条件下适合启用，如何应对失效？](#detail-section-14)
  - [Q05 · 如何帮助用户在降级时决定是否继续？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望在 DSH 执行 shell 前增加风险判断的用户。

宿主 sandbox 和审批本身已能控制部分工具操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| L0 静态规则 | 命中阻断或升级 | off 降级时跳过 |
| 语义判断 | 分析其他命令 | 网络失败 fail-open |
| 宿主路由 | ask 或 deny | 依当前策略 |
| 降级告警 | 暴露语义失效 | 送达未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 工具钩子 | 必需 | 拦截目标工具 | 该路径不受插件判断 |
| API key 和网络服务 | 语义判定必需 | 请求远程判断 | fail-open 或降级 |
| 宿主审批及沙箱 | 风险控制必需 | 后续执行保护 | 不能依赖本插件完全保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户配置工具、宿主审批及密钥 | 检查兼容性和降级策略 |
| 判定 | 插件按规则、预筛和远程层判断 | 异常可回宿主管线 |
| 审批 | 用户按策略处理需人工操作 | 拒绝或取消时不执行 |
| 验收 | 用户核对审计与宿主状态 | 语义不可用时暂停高风险操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务费用未知 | 策略、密钥和钩子配置时间未知 | 需兼容宿主 |
| 持续使用 | 模型 API 调用费用未知 | 审批与误报处理时间未知 | 命令可能发至服务 |
| 失败恢复 | 重试费用未知 | 降级核查时间未知 | 超时可放行至宿主 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 静态规则 | 源码先判 L0（默认降级） | 真实覆盖与误报 |
| 语义层 | 发起限时远程请求 | 对抗准确率和隐私影响 |
| 降级告警 | 源码记录和提示 | 送达率及用户响应 |

> **思考**：[Q03](#research-q03) 远程故障和 adapter 异常 fail-open，显式降级 off 更会跳过 L0。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把静态与语义判断接入工具前置流程。

[Q02](#research-q02) 默认保留 L0；[Q03](#research-q03) 远程失败继续宿主而非安全证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 远程故障和 adapter 异常 fail-open，显式降级 off 更会跳过 L0。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先隔离验证目标工具、宿主审批和失效告警。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码静态核查；未运行宿主、远程服务或命令。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/index.js、lib/gate.js、lib/verdict.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态检查；未跑服务或工具。
- 下一步：隔离宿主测试静态规则、ask/never、超时、无 key、off 降级及恢复。

**分析版本**

- **仓库**：[7starsseeker/dsh-jev-guard](https://github.com/7starsseeker/dsh-jev-guard)
- **版本号**：0.5.7（[固定提交 f6c73dc](https://github.com/7starsseeker/dsh-jev-guard/tree/f6c73dc589e572abd517d649d6196cdbca25a101)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照现有告警显示可用防护以辅助暂停决策，待检验。

隔离宿主测试静态规则、ask/never、超时、无 key、off 降级及恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6842 | — | — | 106268 |
| .js | source | 8 | 3279 | 1510 | 1594 | — |
| .mjs | source | 16 | 3749 | 2440 | 1015 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/7starsseeker/dsh-jev-guard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查门禁判定链、降级和宿主审批边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 命令预执行判定相比宿主审批有什么用途？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在代理运行 shell 前发现破坏性命令的用户可增加静态规则与语义判定；宿主已有 sandbox 与审批，插件是补充风险线索，不保证覆盖所有命令或消除误判。作者报告的离线和宿主结果不是本次执行。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:371-384](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L371-L384)

在目标工具的 pre-execute 中调用评估。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    try {
      if (!cfg.tools.includes(exec.name)) return next()
      const command = extractCommand(exec)
      if (command === undefined) return next()

      const apiKey = await resolveKey(ctx, cfg.apiKeyEnv, cfg)
      const policy = effectivePolicy(ctx, exec.agent)
      // 沙箱档位:只进审计,不参与判定(阈值不随档位偷偷变;见 effectivePreset 的说明)。
      const preset = effectivePreset(ctx, exec.agent)
      const cwd = typeof exec.arguments?.workdir === 'string'
        ? exec.arguments.workdir
        : (exec.agent?.session?.cwd ?? process.cwd())
      const verdict = await evaluateCommand(command, { ...cfg, cwd, cache, apiKey, signal: exec.signal })
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/index.js:493-499](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L493-L499)

异常回宿主管线。

```text
    } catch (error) {
      // Never let the valve break a turn: an unexpected failure delegates to the
      // normal pipeline, where the sandbox and approval policy still apply.
      stats.errors += 1
      ctx.logger?.warn?.('jev-guard: unexpected failure, delegating: %s', String(error?.stack ?? error))
      void record({ action: 'allow', decision: 'allow', source: 'adapter-error', error: String(error?.message ?? error), cwd: process.cwd() }, cfg)
      return next()
```

#### 缺口

- 未在本次宿主运行或与基线对照
  **影响**：不能声称降低误执行率
  **进一步探讨**：隔离宿主对相同命令比较阻断、误报和人工负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 静态、预筛与远程判定怎样路由？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

目标工具和可解析命令才进入 gate；默认降级 l0-only 先执行 L0 静态规则，再跑预筛，其他命令走远程评估。显式 degradePolicy=off 且处于降级时在 L0 之前返回，连 L0 都不运行。静态 deny 进入宿主拒绝，其他需根据 verdict 和会话审批策略路由；插件 allow 调 next 并非证明后续宿主一定执行。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:371-384](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L371-L384)

筛选工具、提取命令并评估。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    try {
      if (!cfg.tools.includes(exec.name)) return next()
      const command = extractCommand(exec)
      if (command === undefined) return next()

      const apiKey = await resolveKey(ctx, cfg.apiKeyEnv, cfg)
      const policy = effectivePolicy(ctx, exec.agent)
      // 沙箱档位:只进审计,不参与判定(阈值不随档位偷偷变;见 effectivePreset 的说明)。
      const preset = effectivePreset(ctx, exec.agent)
      const cwd = typeof exec.arguments?.workdir === 'string'
        ? exec.arguments.workdir
        : (exec.agent?.session?.cwd ?? process.cwd())
      const verdict = await evaluateCommand(command, { ...cfg, cwd, cache, apiKey, signal: exec.signal })
```

</details>

**依据 2 · 源码核查**：[lib/gate.js:669-692](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L669-L692)

显式 off、静态规则和预筛次序。

<details>
<summary>查看原文（24行）</summary>

```text
  const degradedNow = isDegraded(degradedState, now, cfg.scope)

  // 0. 配置要求"降级期间整条阀门暂停" → 在 L0 之前就放行(连免费规则也不跑)。
  //    这是显式选择:默认的 'l0-only' 会保留免费的 L0 + 预筛。
  if (degradedNow && cfg.degradePolicy === 'off') return degradedVerdict(degradedState, cfg, now, true)

  // L0 — hard rules first, and they outrank everything below.
  // 它**不花钱、不联网**,所以降级期间照常工作 —— 这正是默认策略的用意。
  const rule = staticRule(command)
  if (rule) {
    return applyToken(command, {
      action: rule.kind === 'deny' ? 'block' : 'escalate',
      source: 'static-rule',
      rule: { id: rule.id, why: rule.why, kind: rule.kind },
      ms: 0,
      ...(degradedNow
        ? { degraded: { kind: degradedState.kind, until: degradedState.until }, warning: warningLine(degradedState, now) }
        : {}),
    }, cfg)
  }

  // L1a — provably harmless, no network.
  const fast = prefilter(command)
  if (fast) return { action: 'allow', source: 'prefilter', reason: fast, ms: 0 }
```

</details>

**依据 3 · 源码核查**：[lib/verdict.js:189-205](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/verdict.js#L189-L205)

允许、人工与拒绝映射。

<details>
<summary>查看原文（17行）</summary>

```text
export function toHostDecision(command, verdict, approvalPolicy = 'ask', opts = {}) {
  const reviseInAskMode = opts.reviseInAskMode ?? 'ask'
  const blockInAskMode = opts.blockInAskMode ?? 'ask'
  const hardRule = verdict.rule?.kind === 'deny'
  const toHuman = approvalPolicy === 'ask' && hardRule !== true
    && (verdict.action === 'escalate'
      || (verdict.action === 'revise' && reviseInAskMode === 'ask')
      || (verdict.action === 'block' && blockInAskMode === 'ask'))
  const reason = explain(command, verdict, {
    policy: approvalPolicy,
    token: opts.token ?? verdict.token,
    cliPath: opts.cliPath,
    routedToHuman: toHuman,
  })
  if (verdict.action === 'allow') return { kind: 'allow' }
  // revise and block are model-facing denials when nobody can be asked; revise additionally teaches.
  return toHuman ? { kind: 'ask', reason } : { kind: 'deny', reason }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/index.js:428-442](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L428-L442)

allow 继续宿主管线。

<details>
<summary>查看原文（15行）</summary>

```text
        stats.allowed += 1
        budget.clear(sessionKey)
        ctx.logger?.debug?.('jev-guard: allow via %s (p=%s, %sms)', verdict.source, verdict.p, verdict.ms)
        // 审计:DSH 的 logger 会过滤 info 级,所以真实凭据落在 guard.log 里。
        void record({
          tool: exec.name, action: 'allow', decision: 'allow', source: verdict.source,
          p: verdict.p, model: verdict.model, ms: verdict.ms, rule: verdict.rule?.id,
          enriched: verdict.enriched, cwd, error: verdict.error, errorKind: verdict.errorKind,
          policy, preset,
          degraded: verdict.degraded, usage: verdict.usage, probe: verdict.probe,
          recovered: verdict.recovered, command,
          overridden: verdict.overridden, token: verdict.token,
          session: exec.agent?.session?.id,
        }, cfg)
        return next()
```

</details>

#### 缺口

- 未运行规则和目标宿主
  **影响**：不能证明覆盖与真实阻断率
  **进一步探讨**：隔离宿主验证 deny、ask、never、未匹配工具和降级配置。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 远程故障或异常是否仍保护语义风险？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

远程超时、网络错误或调用中止走 fail-open，插件返回 allow；adapter 意外异常亦 next，随后仍由宿主 sandbox/审批决定。配额、认证或无 key 等可进入降级并发警告，默认只保留静态规则与预筛，不等于模型仍对每条命令判定；显式 off 时连静态规则也跳过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gate.js:499-517](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L499-L517)

请求带超时及取消信号。

<details>
<summary>查看原文（19行）</summary>

```text
export async function callJev(state, cfg, signal) {
  if (!cfg.apiKey) {
    const error = new Error('no TypeSafe API key resolved')
    error.code = 'no-key'
    throw error
  }
  const timeout = AbortSignal.timeout(cfg.timeoutMs)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
  const body = {
    model: cfg.model,
    state,
    questions: { [QUESTION_ID]: judgeQuestion(cfg.promptLang) },
  }
  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: combined,
  })
```

</details>

**依据 2 · 源码核查**：[lib/gate.js:758-782](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L758-L782)

错误处理与降级。

<details>
<summary>查看原文（25行）</summary>

```text
  } catch (error) {
    // fail-open: availability of the valve must never block the agent; the
    // host's sandbox + approval pipeline still sits in front of the execution.
    const { kind, status, detail } = classifyFailure(error)
    const base = {
      action: 'allow',
      source: 'error',
      errorKind: kind,
      error: detail,
      status,
      ms: Date.now() - started,
    }
    // 持久性失败 → 进入降级:停发请求 + 留一份可读状态 + 把告警挂到这次判定上。
    // `scope` 只对本地类(`no-key`)有意义:它决定这份状态压制谁(见 DEFAULTS.scope)。
    if (DEGRADING_KINDS.includes(kind)) {
      const after = await enterDegraded(kind, { cfg, now: Date.now(), detail, status, probe: isProbe, scope: cfg.scope })
      return {
        ...base,
        degraded: { kind, label: after.label, since: after.since, until: after.until, failures: after.failures },
        warning: warningLine(after, Date.now()),
        probe: isProbe,
      }
    }
    return { ...base, ...(isProbe ? { probe: true } : {}) }
  }
```

</details>

**依据 3 · 源码核查**：[lib/gate.js:669-692](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L669-L692)

降级策略的 L0 条件。

<details>
<summary>查看原文（24行）</summary>

```text
  const degradedNow = isDegraded(degradedState, now, cfg.scope)

  // 0. 配置要求"降级期间整条阀门暂停" → 在 L0 之前就放行(连免费规则也不跑)。
  //    这是显式选择:默认的 'l0-only' 会保留免费的 L0 + 预筛。
  if (degradedNow && cfg.degradePolicy === 'off') return degradedVerdict(degradedState, cfg, now, true)

  // L0 — hard rules first, and they outrank everything below.
  // 它**不花钱、不联网**,所以降级期间照常工作 —— 这正是默认策略的用意。
  const rule = staticRule(command)
  if (rule) {
    return applyToken(command, {
      action: rule.kind === 'deny' ? 'block' : 'escalate',
      source: 'static-rule',
      rule: { id: rule.id, why: rule.why, kind: rule.kind },
      ms: 0,
      ...(degradedNow
        ? { degraded: { kind: degradedState.kind, until: degradedState.until }, warning: warningLine(degradedState, now) }
        : {}),
    }, cfg)
  }

  // L1a — provably harmless, no network.
  const fast = prefilter(command)
  if (fast) return { action: 'allow', source: 'prefilter', reason: fast, ms: 0 }
```

</details>

**依据 4 · 源码核查**：[adapters/dsh/index.js:493-499](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L493-L499)

意外异常委托宿主。

```text
    } catch (error) {
      // Never let the valve break a turn: an unexpected failure delegates to the
      // normal pipeline, where the sandbox and approval policy still apply.
      stats.errors += 1
      ctx.logger?.warn?.('jev-guard: unexpected failure, delegating: %s', String(error?.stack ?? error))
      void record({ action: 'allow', decision: 'allow', source: 'adapter-error', error: String(error?.message ?? error), cwd: process.cwd() }, cfg)
      return next()
```

#### 缺口

- 未模拟网络故障及验证宿主默认策略
  **影响**：不能推断远程不可用时有完整语义防护
  **进一步探讨**：隔离断网、超时、缺 key 和 off 配置并检查最终工具执行。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么条件下适合启用，如何应对失效？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 工具钩子和宿主策略；语义层需要有效 API key、服务和网络，带来费用及命令内容传输风险。管理员应先核对被拦工具和降级状态，保持宿主隔离与审批；不满足高风险任务要求时停止并人工执行或审查。实际服务计价、延迟、误判与恢复未测。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:371-384](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L371-L384)

工具筛选及 key。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('tools/pre-execute', async (exec, next) => {
    try {
      if (!cfg.tools.includes(exec.name)) return next()
      const command = extractCommand(exec)
      if (command === undefined) return next()

      const apiKey = await resolveKey(ctx, cfg.apiKeyEnv, cfg)
      const policy = effectivePolicy(ctx, exec.agent)
      // 沙箱档位:只进审计,不参与判定(阈值不随档位偷偷变;见 effectivePreset 的说明)。
      const preset = effectivePreset(ctx, exec.agent)
      const cwd = typeof exec.arguments?.workdir === 'string'
        ? exec.arguments.workdir
        : (exec.agent?.session?.cwd ?? process.cwd())
      const verdict = await evaluateCommand(command, { ...cfg, cwd, cache, apiKey, signal: exec.signal })
```

</details>

**依据 2 · 源码核查**：[lib/gate.js:499-517](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L499-L517)

API key 与网络请求。

<details>
<summary>查看原文（19行）</summary>

```text
export async function callJev(state, cfg, signal) {
  if (!cfg.apiKey) {
    const error = new Error('no TypeSafe API key resolved')
    error.code = 'no-key'
    throw error
  }
  const timeout = AbortSignal.timeout(cfg.timeoutMs)
  const combined = signal ? AbortSignal.any([signal, timeout]) : timeout
  const body = {
    model: cfg.model,
    state,
    questions: { [QUESTION_ID]: judgeQuestion(cfg.promptLang) },
  }
  const res = await fetch(cfg.endpoint, {
    method: 'POST',
    headers: { Authorization: `Bearer ${cfg.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    signal: combined,
  })
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/index.js:390-395](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L390-L395)

fail-open 与降级提示。

```text
      if (verdict.source === 'error') {
        stats.errors += 1
        ctx.logger?.warn?.('jev-guard: fail-open after %s (%sms): %s', verdict.error, verdict.ms, command.slice(0, 160))
      }
      // 降级告警:额度/密钥出问题时**必须有人能发现**。旧行为是静默 fail-open,
      // 日志里一堆 error 但没人看得出"它已经不在防护了"。这里三件事一起做:
```

#### 缺口

- 未进行付费调用和隐私检查
  **影响**：不能量化费用、延迟及外发风险
  **进一步探讨**：使用无敏感隔离样本核对日志、服务条款和告警。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户在降级时决定是否继续？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 adapter 已有降级日志、审计和会话提示，默认仍保留 L0，是直接反证。假设在允许高风险操作前展示“语义层未运行、当前 L0/宿主策略和原因”，帮助用户选择暂停或改用人工审查。对照现有通知，在超时、无 key、配额冷却、恢复和 off 配置下比较错误继续率、误停率、提示响应时间和打断负担；无改善、误导或成本抵消收益则否定。未穷尽其他宿主 UI。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:390-395](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L390-L395)

已有故障和降级提示。

```text
      if (verdict.source === 'error') {
        stats.errors += 1
        ctx.logger?.warn?.('jev-guard: fail-open after %s (%sms): %s', verdict.error, verdict.ms, command.slice(0, 160))
      }
      // 降级告警:额度/密钥出问题时**必须有人能发现**。旧行为是静默 fail-open,
      // 日志里一堆 error 但没人看得出"它已经不在防护了"。这里三件事一起做:
```

**依据 2 · 源码核查**：[lib/gate.js:669-692](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/lib/gate.js#L669-L692)

降级时规则执行条件。

<details>
<summary>查看原文（24行）</summary>

```text
  const degradedNow = isDegraded(degradedState, now, cfg.scope)

  // 0. 配置要求"降级期间整条阀门暂停" → 在 L0 之前就放行(连免费规则也不跑)。
  //    这是显式选择:默认的 'l0-only' 会保留免费的 L0 + 预筛。
  if (degradedNow && cfg.degradePolicy === 'off') return degradedVerdict(degradedState, cfg, now, true)

  // L0 — hard rules first, and they outrank everything below.
  // 它**不花钱、不联网**,所以降级期间照常工作 —— 这正是默认策略的用意。
  const rule = staticRule(command)
  if (rule) {
    return applyToken(command, {
      action: rule.kind === 'deny' ? 'block' : 'escalate',
      source: 'static-rule',
      rule: { id: rule.id, why: rule.why, kind: rule.kind },
      ms: 0,
      ...(degradedNow
        ? { degraded: { kind: degradedState.kind, until: degradedState.until }, warning: warningLine(degradedState, now) }
        : {}),
    }, cfg)
  }

  // L1a — provably harmless, no network.
  const fast = prefilter(command)
  if (fast) return { action: 'allow', source: 'prefilter', reason: fast, ms: 0 }
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/index.js:509-524](https://github.com/7starsseeker/dsh-jev-guard/blob/f6c73dc589e572abd517d649d6196cdbca25a101/adapters/dsh/index.js#L509-L524)

会话通知入口。

<details>
<summary>查看原文（16行）</summary>

```text
  // `packages/guard/repeat-tool-reminder` 与 `packages/core/agent/src/model-selection.ts`。
  if (cfg.notifyInSession !== false) {
    ctx.on('agent/pre-step', async (payload, next) => {
      const decision = await next()
      try {
        // 两条纪律,违反任何一条都会伤害宿主:
        //  · 必须 `await next()` 之后再**追加** —— 决策里的 `messages` 是**替换**整个批次,
        //    直接返回自己的数组会把用户这条消息吞掉;
        //  · 空批次不要塞消息 —— 那会让循环白白多跑一次模型请求(DSH 自己的 model-selection
        //    用的就是这条守卫)。
        if (decision?.kind !== 'enter' || payload?.signal?.aborted) return decision
        if (decision.messages.length === 0 && (payload.step === 1 || payload.messages?.length > 0)) return decision
        const notice = await pendingNotice(ctx, cfg, payload)
        if (notice === null) return decision
        ctx.logger?.debug?.('jev-guard: in-session notice (%s)', notice.summary)
        return { ...decision, messages: [...decision.messages, noticeMessage(notice.text, notice.summary)] }
```

</details>

#### 缺口

- 未实测通知送达及用户决策
  **影响**：不能证明新增提示有益
  **进一步探讨**：隔离宿主回放降级与恢复并同条件对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
