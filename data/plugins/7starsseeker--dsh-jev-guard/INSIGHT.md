# dsh-jev-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[958da7d](https://github.com/7starsseeker/dsh-jev-guard/tree/958da7d14b8a18dccd724daa6c270f20892ce983)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,591](https://img.shields.io/static/v1?label=npm+30d&message=1%2C591&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
<!-- END META -->

> **实现功能**：在DSH工具执行前组合静态规则、Jev判据和人工升级，检查删除或覆盖风险。

> **核心亮点**：把成熟规则和语义判据接到工具执行前的硬决策点，区分改写/阻断/人工；是附加事故阀而非完整安全边界。[Q01](#research-q01)、[Q02](#research-q02)

> **风险与缺陷**：模型或adapter错误可能放回原生管线，非指定工具跳过；令牌未绑cwd/状态/TTL且折叠命令空白，局部一次性不等严格资源授权。[Q03](#research-q03)

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
  - [Q01 · shell前判定解决什么风险，相对静态确认增加什么？](#detail-section-11)
  - [Q02 · 命令抽取、Jev判定、改写与一次性授权如何执行？](#detail-section-12)
  - [Q03 · 故障、误拦/漏拦与作用域是否影响保护承诺？](#detail-section-13)
  - [Q04 · 密钥、区域、审计、恢复流程与成本怎样？](#detail-section-14)
  - [Q05 · 适配器和测试有哪些可复用边界？](#detail-section-15)
  - [Q06 · 风险分层与命令语义缓存能否降低调用成本，如何采用？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：给编码Agent shell任务提供附加事故检查，仍保留原生沙箱与审批。

原生审批+静态规则和人工确认是替代，本轮不对作者样本外准确率作排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 执行前事故判据 | 检查删除/覆盖风险 | 只覆盖指定且可抽取命令的工具 |
| revise/block/escalate | 模型重写或人工接管 | 宿主审批策略决定映射 |
| 一次token | 放行非硬deny判定 | 不绑cwd/TTL，进程内消费串行 |
| 降级与审计 | 暴露服务失败 | 失败可放行，异步日志需回读 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20及DSH pre-execute | 必需 | 指定工具拦截 | 未接线则不保护 |
| Jev端点/key/区域访问 | 语义层必需 | 风险判断 | 降级/错误可放行 |
| 原生沙箱/审批 | 仍需保留 | 最终执行边界 | 插件不替代 |
| 可写token/审计路径 | 对应功能必需 | 授权和追踪 | 回退/日志失败需检查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 配工具、key、降级与日志 | 已知样本路由符合预期 |
| 使用 | 模型调用shell前判定 | revise重写、ask人工、deny停止 |
| 验收 | 查降级及实际动作/审计 | 异常先恢复服务与原生边界 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | Jev账号/日志资源，金额未知 | 工具覆盖与降级/权限核对 | 区域/凭据依赖 |
| 持续 | 语义调用，预筛/缓存可省请求 | 处理误拦、改写与确认 | 总费用/合格率未知 |
| 失败恢复 | 重试、日志与状态检查 | 恢复key/网络，核对原生权限 | fail-open不等仍有语义保护 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 执行前检查 | 指定工具进入typed决策 | 全工具/语法覆盖 |
| 语义判据 | 风险值阈值路由 | 真实任务漏放/误拦 |
| 降级透明 | 日志与状态告警 | 故障期端到端保护 |

> **思考**：模型或adapter错误可能放回原生管线，非指定工具跳过；令牌未绑cwd/状态/TTL且折叠命令空白，局部一次性不等严格资源授权。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把成熟规则和语义判据接到工具执行前的硬决策点，区分改写/阻断/人工；是附加事故阀而非完整安全边界。[Q01](#research-q01)、[Q02](#research-q02)

把成熟规则和语义判据接到工具执行前的硬决策点，区分改写/阻断/人工；是附加事故阀而非完整安全边界。[Q01](#research-q01)、[Q02](#research-q02)

判据/adapter分离、typed路由及cwd缓存可复用；规则优先级明确但显式off例外；授权需资源绑定和跨进程消费，不能以日志/缓存数量当安全证据。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

模型或adapter错误可能放回原生管线，非指定工具跳过；令牌未绑cwd/状态/TTL且折叠命令空白，局部一次性不等严格资源授权。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在可恢复目录验证良性、危险及断网样本，再把它作为附加事故阀；降级时看status，保留原生沙箱和审批，不依赖单一判据。[Q06](#research-q06)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

执行前接线和分层判据由源码支持；失败开窗、工具范围及令牌状态绑定有限；资源绑定假设未验证。

- 已检查：作者 README、包清单、源码路径 adapters/dsh/index.js、lib/gate.js、lib/token.js、README.md、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取DSH adapter、gate、令牌及作者声明；未执行命令或目标测试，未独立复现作者校准/安全效果，未完整审计规则/预筛所有语法。
- 下一步：可进一步用固定任务与状态变更/断网/并发矩阵，记录漏放、误拦、所有调用及人工处理时间。

**分析版本**

- **仓库**：[7starsseeker/dsh-jev-guard](https://github.com/7starsseeker/dsh-jev-guard)
- **版本号**：0.5.7（[固定提交 958da7d](https://github.com/7starsseeker/dsh-jev-guard/tree/958da7d14b8a18dccd724daa6c270f20892ce983)）
- **版本日期**：2026-10-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是准确命令+real cwd+资源摘要+session/TTL授权，以及显式降级停/问策略；用状态变更、并发和断网矩阵检验错误放行与负担。[Q06](#research-q06)

可进一步用固定任务与状态变更/断网/并发矩阵，记录漏放、误拦、所有调用及人工处理时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6838 | — | — | 105430 |
| .js | source | 8 | 3279 | 1510 | 1594 | — |
| .mjs | source | 16 | 3737 | 2431 | 1012 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对执行前事故阀的真实覆盖、降级/授权边界与采用成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · shell前判定解决什么风险，相对静态确认增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向编码Agent调用shell时可能不可逆删除/覆盖真实数据的事故防护。相对每条弹窗或仅提示小心，增量是在tools/pre-execute硬接线，把静态规则、离线预筛、模型语义判断和人工升级连接起来；实际工具仍受宿主原生沙箱/审批约束。合格结果要同时衡量危险命令漏放、良性命令误拦和任务办结成本。作者114例校准与延迟/价格是限定样本报告，不是本轮真实任务泛化。它自己称事故安全网而非安全边界，这与降级行为相符。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-33](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/README.md#L19-L33)

作者定义执行前事故安全网和判据来源。

<details>
<summary>查看原文（15行）</summary>

````text
**A pre-execution safety valve for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): before a command actually runs, it asks one question — "will this irreversibly delete or overwrite your real data?"**

It judges with [TypeSafe Jev](https://typesafe.ai/blog/introducing-system-one-models-and-jev) — a "System One" model that produces no prose, only a **structured decision**. Yes/no questions are what this kind of judgment measures most accurately (114-case calibration, 90.4% with the Chinese text sent as-is). It hooks into DSH's native `tools/pre-execute`, so it is a **hard interception**, not a "please be careful" nudge to the model.

```
command text ──▶ L0 static hard rules (offline · cannot be overridden) ──▶ pre-screen (read-only / rebuildable) ──▶ Jev semantic judgment (~300ms)
                        │                       │                        │
                        └───────────────┬───────┴────────────────────────┘
                                        ▼
                        allow ／ revise (with downgrade templates) ／ block ／ escalate
                            │        │              │          │
                        run it   model rewrites   refuse    DSH approval prompt or one-shot token
```

> **中文说明** — 本文档为英文版,完整中文介绍见 [README.zh-CN.md](README.zh-CN.md)。`dsh-jev-guard` 是 DeepSeek Harness 的执行前安全阀门:每条 `bash` / `pwsh` 工具调用**执行之前**先判定一次(先离线静态规则,再付费语义模型),返回 `allow` / `revise` / `block` / `escalate` 四态之一。它会拦下不可逆的命令,能教模型更安全的写法时就给出降级模板,两者都不适用时提供一次性人工令牌;额度耗尽时**大声降级而不是静默失效**。**它是事故安全网,不是安全边界** —— 见 [Known limits](#known-limits)。
````

</details>

**依据 2 · 作者声明**：[README.md:65-69](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/README.md#L65-L69)

作者三层主张及样本成本数据。

```text
Three layers, always in this order:

1. **L0 static hard rules** (`lib/rules.js`): 26 "never allowed" + 24 "human confirmation required". **Offline and impossible to override** — not even a one-shot token gets past them. Rules match at **command position only** (the start of a line, or after `;` `&` `|` `(` `$(`, or after `bash -c "` / `pwsh -NoProfile -Command "` / `cmd /c "`, and skipping wrappers such as `sudo` / `timeout 30` / `xargs -0` / `find … -exec`) — so *mentioning* a dangerous command inside an argument is not a false positive, **and a real command buried in a multi-line script is not missed either**. Only two rules cannot be anchored structurally (`redirect-to-device`, `fork-bomb`) and match the whole text; the counter `RULE_STATS.anywhere` is always 2.
2. **Pre-screen**: commands that are provably read-only or touch only rebuildable content (caches, build output, `/tmp`) pass straight through, with **zero network calls**.
3. **Jev semantic judgment**: one yes/no question — *"will this command irreversibly delete or overwrite the user's real data?"* — split by two thresholds into `allow` / `revise` / `block`. Measured latency ~300ms (P50 267ms), cost ≈ `$0.000019` per call.
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 命令抽取、Jev判定、改写与一次性授权如何执行？

**研究主题**：功能与机制

#### 完整回答

adapter只处理cfg.tools中的名称且能extractCommand的调用，解析key、cwd及审批策略后交evaluate。gate先处理显式degradePolicy off，再跑L0静态规则、预筛、cwd+原命令缓存和Jev阈值；模型返回风险值后映射allow/revise/block。重试预算按会话+命令指纹累计，硬deny不因预算变ask；其余可转人工。一次令牌在判定后检查，不能覆盖L0 deny；revise给模型改写模板而非替用户静默修改命令。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:371-384](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L371-L384)

工具范围、命令、cwd及判据调用。

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

**依据 2 · 源码核查**：[lib/gate.js:669-700](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L669-L700)

静态/预筛/缓存及降级次序。

<details>
<summary>查看原文（32行）</summary>

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

  const key = cfg.cwd ? `${cfg.cwd}\u0000${command}` : command
  const cached = cache.get(key)
  if (cached) return applyToken(command, { ...cached, source: 'cache', ms: 0 }, cfg)

  // 降级窗口内(探测还没到期)→ 直接放行,不发请求。缓存过的判定在上面已经生效,
  // 所以降级丢掉的只是"无法再用语义层判新命令",不是整个判定历史。
  if (degradedNow && !probeDue(degradedState, now, cfg.scope)) return degradedVerdict(degradedState, cfg, now)
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/index.js:424-453](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L424-L453)

预算和硬规则例外。

<details>
<summary>查看原文（30行）</summary>

```text
      const sessionKey = `${exec.agent?.session?.id ?? 'no-session'}:${fingerprint(command)}`
      let effective = verdict

      if (verdict.action === 'allow') {
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
      }

      // Blocked or merely uncertain: count attempts so a model that keeps
      // rephrasing the same destruction eventually reaches a human instead of
      // looping forever.
      const { attempts, exhausted } = budget.hit(sessionKey)
      // 例外:带 L0 `deny` 规则的硬命中**不能**借重试预算转人工 —— 那会让弹窗里的"允许"
      // 越过硬地板(令牌不能越过 L0,审批同样不能,见 D5/D13)。硬命中照旧记 attempts 供审计。
      const hardRule = verdict.rule?.kind === 'deny'
      if (exhausted && verdict.action !== 'escalate' && hardRule !== true) {
        effective = { ...verdict, action: 'escalate', source: `${verdict.source}+retry-budget` }
```

</details>

**依据 4 · 源码核查**：[lib/gate.js:558-576](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L558-L576)

令牌只覆盖非硬deny并消费。

<details>
<summary>查看原文（19行）</summary>

```text
async function applyToken(command, verdict, cfg) {
  if (cfg.tokens === false || verdict.action === 'allow') return verdict
  const token = commandToken(command)
  if (verdict.rule?.kind === 'deny') return { ...verdict, token } // L0 硬地板:令牌不越过
  try {
    const grant = await consumeToken(command, { tokenPath: cfg.tokenPath })
    if (!grant.ok) return { ...verdict, token }
    return {
      action: 'allow',
      source: 'token',
      token: grant.token,
      overridden: verdict.action,
      p: verdict.p,
      rule: verdict.rule,
      ms: verdict.ms,
    }
  } catch {
    // 令牌机制出错不能让判定变形:退回原判定(保守方向)
    return { ...verdict, token }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 故障、误拦/漏拦与作用域是否影响保护承诺？

**研究主题**：缺陷与关键质疑

#### 完整回答

影响很大。Jev失败可返回allow，adapter意外异常也next交给正常管线，因此语义保护不可用时不自动阻断；默认l0-only保留免费规则，但显式off会在L0前停用整阀。不在工具列表或抽不到命令的执行路径直接跳过，所以不能保护任意文件/工具副作用。令牌仅hash折叠空白后的命令前10个十六进制，未绑cwd、文件版本、session或TTL；引号内空白也被折叠，意味着所谓“这一次命令”不是精确字节和状态授权。单进程消费队列不等跨进程一次性。

#### 证据与依据

**依据 1 · 源码核查**：[lib/gate.js:671-673](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L671-L673)

显式off早于L0。

```text
  // 0. 配置要求"降级期间整条阀门暂停" → 在 L0 之前就放行(连免费规则也不跑)。
  //    这是显式选择:默认的 'l0-only' 会保留免费的 L0 + 预筛。
  if (degradedNow && cfg.degradePolicy === 'off') return degradedVerdict(degradedState, cfg, now, true)
```

**依据 2 · 源码核查**：[lib/gate.js:758-766](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L758-L766)

Jev失败回allow。

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
```

**依据 3 · 源码核查**：[adapters/dsh/index.js:493-499](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L493-L499)

adapter异常委托next。

```text
    } catch (error) {
      // Never let the valve break a turn: an unexpected failure delegates to the
      // normal pipeline, where the sandbox and approval policy still apply.
      stats.errors += 1
      ctx.logger?.warn?.('jev-guard: unexpected failure, delegating: %s', String(error?.stack ?? error))
      void record({ action: 'allow', decision: 'allow', source: 'adapter-error', error: String(error?.message ?? error), cwd: process.cwd() }, cfg)
      return next()
```

**依据 4 · 源码核查**：[lib/token.js:52-63](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/token.js#L52-L63)

命令空白归一与截断摘要。

<details>
<summary>查看原文（12行）</summary>

```text
export function canonicalize(command) {
  return String(command ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * 计算一条命令的放行令牌。
 * @param command - 原始命令文本。
 * @returns 形如 `ALLOW-3F9A2C7B14` 的令牌。
 */
export function commandToken(command) {
  const digest = createHash('sha256').update(canonicalize(command)).digest('hex')
  return `${TOKEN_PREFIX}${digest.slice(0, 10).toUpperCase()}`
```

</details>

**依据 5 · 源码核查**：[lib/token.js:93-108](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/token.js#L93-L108)

令牌读改写只有进程内链。

<details>
<summary>查看原文（16行）</summary>

```text
export function consumeToken(command, options = {}) {
  const path = resolveTokenPath(options)
  const token = commandToken(command)
  const run = chain.then(async () => {
    const tokens = await readTokens(path)
    if (!tokens.includes(token)) {
      return { ok: false, token, reason: tokens.length === 0 ? '令牌文件为空' : '该命令没有对应令牌' }
    }
    const kept = tokens.filter(t => t !== token)
    await mkdir(dirname(path), { recursive: true })
    const tmp = `${path}.tmp-${process.pid}`
    await writeFile(tmp, kept.length > 0 ? `${kept.join('\n')}\n` : '', 'utf8')
    await rename(tmp, path) // 原子替换
    return { ok: true, token, remaining: kept.length }
  })
  chain = run.then(() => undefined, () => undefined)
```

</details>

#### 缺口

- 当前命令分布的漏放/误拦、降级时长与跨进程令牌复用无独立数据
  **影响**：不能承诺全面保护或授权等价
  **进一步探讨**：在隔离目录对代表性良性/危险与key/网络故障矩阵盲测，核对cwd/状态变化后的令牌行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 密钥、区域、审计、恢复流程与成本怎样？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

静态规则和预筛可离线，语义层需有效Jev兼容端点、key及区域可达；宿主原生审批策略决定ask还是deny。用户首次应确认工具覆盖、降级策略和审计位置，再在可恢复目录试命令。adapter记录命令/cwd/判据与错误，敏感命令文本可能入日志；record多为void异步，不能只凭返回allow当审计已持久化。失败恢复先查看status/日志和原生权限，不用不断改写逃避判据。持续费用含所有Jev调用、误拦后的重试与人工确认，作者单次报价不等当前总成本。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:377-383](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L377-L383)

凭据、审批和cwd分离。

```text
      const apiKey = await resolveKey(ctx, cfg.apiKeyEnv, cfg)
      const policy = effectivePolicy(ctx, exec.agent)
      // 沙箱档位:只进审计,不参与判定(阈值不随档位偷偷变;见 effectivePreset 的说明)。
      const preset = effectivePreset(ctx, exec.agent)
      const cwd = typeof exec.arguments?.workdir === 'string'
        ? exec.arguments.workdir
        : (exec.agent?.session?.cwd ?? process.cwd())
```

**依据 2 · 源码核查**：[adapters/dsh/index.js:390-407](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L390-L407)

错误与降级告警。

<details>
<summary>查看原文（18行）</summary>

```text
      if (verdict.source === 'error') {
        stats.errors += 1
        ctx.logger?.warn?.('jev-guard: fail-open after %s (%sms): %s', verdict.error, verdict.ms, command.slice(0, 160))
      }
      // 降级告警:额度/密钥出问题时**必须有人能发现**。旧行为是静默 fail-open,
      // 日志里一堆 error 但没人看得出"它已经不在防护了"。这里三件事一起做:
      //   ① host 日志一条 warn(尽力而为);② 审计里留一条 level:'warn' 的记录(可靠);
      //   ③ 非 allow 判定的理由里已经带了同一句(见 lib/verdict.js 的 warn)。
      // 每个降级窗口最多吼一次,免得刷屏;人可以用 `guard status` 看全貌。
      const degradedKey = verdict.degraded ? `${verdict.degraded.kind}:${verdict.degraded.until}` : ''
      if (degradedKey && degradedKey !== lastDegradedKey) {
        lastDegradedKey = degradedKey
        ctx.logger?.warn?.('jev-guard: DEGRADED %s', verdict.warning)
        void record({
          level: 'warn', tool: exec.name, source: verdict.source, errorKind: verdict.errorKind,
          degraded: verdict.degraded, warning: verdict.warning, cwd, command,
          session: exec.agent?.session?.id,
        }, cfg)
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/index.js:427-442](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L427-L442)

放行审计异步及包含命令。

<details>
<summary>查看原文（16行）</summary>

```text
      if (verdict.action === 'allow') {
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

**依据 4 · 作者声明**：[README.md:67-75](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/README.md#L67-L75)

作者离线/语义依赖和历史环境声明。

```text
1. **L0 static hard rules** (`lib/rules.js`): 26 "never allowed" + 24 "human confirmation required". **Offline and impossible to override** — not even a one-shot token gets past them. Rules match at **command position only** (the start of a line, or after `;` `&` `|` `(` `$(`, or after `bash -c "` / `pwsh -NoProfile -Command "` / `cmd /c "`, and skipping wrappers such as `sudo` / `timeout 30` / `xargs -0` / `find … -exec`) — so *mentioning* a dangerous command inside an argument is not a false positive, **and a real command buried in a multi-line script is not missed either**. Only two rules cannot be anchored structurally (`redirect-to-device`, `fork-bomb`) and match the whole text; the counter `RULE_STATS.anywhere` is always 2.
2. **Pre-screen**: commands that are provably read-only or touch only rebuildable content (caches, build output, `/tmp`) pass straight through, with **zero network calls**.
3. **Jev semantic judgment**: one yes/no question — *"will this command irreversibly delete or overwrite the user's real data?"* — split by two thresholds into `allow` / `revise` / `block`. Measured latency ~300ms (P50 267ms), cost ≈ `$0.000019` per call.

## Install

Requires **Node ≥ 20** (it uses the global `fetch`). **Zero runtime dependencies** — no `npm install` needed.

**Verified host versions: DSH 0.1.6-alpha.2, 0.1.7-rc.2, 0.2.0-rc.2, 0.2.1-rc.2 and 0.2.1-rc.3.** 0.1.7-rc.2 was checked end to end on 2026-09-25 (Node 24.21.0, WSL/Linux, this plugin at 0.5.3): `guard selftest` 12/12; the seven offline suites 20 / 31 / 34 / 109 / 56 / 48 / 17 assertions, all passing; the DSH adapter smoke test 23/23; and the tool-pipeline integration test running against that checkout's own `@deepseek-ai/dsh-tools` 6/6 offline and **7/7 with a key**, the extra case being one live judgement through the real five-stage pipeline. The valve also ran mounted in a real session, judging commands and writing its audit log under approval policy `ask`.
```

#### 缺口

- 实际账号/区域费用、误拦人工时间与日志可靠性未知
  **影响**：无法计算单位合格shell任务成本
  **进一步探讨**：对同一任务计全部调用、人工处理及日志失败恢复，核对供应商当日账单

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适配器和测试有哪些可复用边界？

**研究主题**：工程质量与复用

#### 完整回答

判定与DSH adapter分离便于复用CLI/离线语料；typed宿主决策、cwd纳入判据缓存和硬规则优先级可借鉴。告警区分降级、缓存和错误，比静默失效透明，但透明不等保护持续生效。重试预算用命令指纹，模型改写可能改变预算key，不能仅凭注释说会阻止所有反复改写。token队列、审计和缓存都是局部状态，移植时要重新绑定资源、执行语义和权限，不能照搬校准阈值就声称安全。作者已有验证文件与自检脚本，本轮不运行，不升级为独立宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:5-12](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L5-L12)

判据与宿主adapter分离的结构。

```text
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
```

**依据 2 · 源码核查**：[lib/gate.js:694-696](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L694-L696)

判据缓存绑定cwd与原命令。

```text
  const key = cfg.cwd ? `${cfg.cwd}\u0000${command}` : command
  const cached = cache.get(key)
  if (cached) return applyToken(command, { ...cached, source: 'cache', ms: 0 }, cfg)
```

**依据 3 · 源码核查**：[adapters/dsh/index.js:424-453](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L424-L453)

预算键与硬规则处理的实际边界。

<details>
<summary>查看原文（30行）</summary>

```text
      const sessionKey = `${exec.agent?.session?.id ?? 'no-session'}:${fingerprint(command)}`
      let effective = verdict

      if (verdict.action === 'allow') {
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
      }

      // Blocked or merely uncertain: count attempts so a model that keeps
      // rephrasing the same destruction eventually reaches a human instead of
      // looping forever.
      const { attempts, exhausted } = budget.hit(sessionKey)
      // 例外:带 L0 `deny` 规则的硬命中**不能**借重试预算转人工 —— 那会让弹窗里的"允许"
      // 越过硬地板(令牌不能越过 L0,审批同样不能,见 D5/D13)。硬命中照旧记 attempts 供审计。
      const hardRule = verdict.rule?.kind === 'deny'
      if (exhausted && verdict.action !== 'escalate' && hardRule !== true) {
        effective = { ...verdict, action: 'escalate', source: `${verdict.source}+retry-budget` }
```

</details>

**依据 4 · 源码核查**：[lib/token.js:83-108](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/token.js#L83-L108)

消费队列的进程作用域。

<details>
<summary>查看原文（26行）</summary>

```text
/** 串行化读改写,避免并发消费互相覆盖。 */
let chain = Promise.resolve()

/**
 * 尝试用令牌放行一条命令:命中则**消费**(从文件移除)并返回成功。
 *
 * @param command - 原始命令文本。
 * @param options - `{ tokenPath }`。
 * @returns `{ ok, token, reason? }` —— `reason` 说明为何没命中。
 */
export function consumeToken(command, options = {}) {
  const path = resolveTokenPath(options)
  const token = commandToken(command)
  const run = chain.then(async () => {
    const tokens = await readTokens(path)
    if (!tokens.includes(token)) {
      return { ok: false, token, reason: tokens.length === 0 ? '令牌文件为空' : '该命令没有对应令牌' }
    }
    const kept = tokens.filter(t => t !== token)
    await mkdir(dirname(path), { recursive: true })
    const tmp = `${path}.tmp-${process.pid}`
    await writeFile(tmp, kept.length > 0 ? `${kept.join('\n')}\n` : '', 'utf8')
    await rename(tmp, path) // 原子替换
    return { ok: true, token, remaining: kept.length }
  })
  chain = run.then(() => undefined, () => undefined)
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 风险分层与命令语义缓存能否降低调用成本，如何采用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

当前已有静态预筛与cwd缓存，新假设应是资源/状态绑定而不是重复提出缓存。可将一次授权绑定准确命令字节、real cwd、相关目标摘要、session和短TTL，同时把降级状态明确接到用户可配置的停/问/仅L0策略。这样针对环境变化下旧授权误用与语义层失败开窗，代价是快照/确认负担。用相同命令不同cwd/文件版本、并发消费者和断网样本测试，若误拦显著增加却不减少错误放行则否定。建议作为附加事故阀在可恢复任务试用，保留原生沙箱/审批；不能把它当唯一执行边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/token.js:52-63](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/token.js#L52-L63)

精确资源授权相对当前命令token的增量。

<details>
<summary>查看原文（12行）</summary>

```text
export function canonicalize(command) {
  return String(command ?? '').replace(/\s+/g, ' ').trim()
}

/**
 * 计算一条命令的放行令牌。
 * @param command - 原始命令文本。
 * @returns 形如 `ALLOW-3F9A2C7B14` 的令牌。
 */
export function commandToken(command) {
  const digest = createHash('sha256').update(canonicalize(command)).digest('hex')
  return `${TOKEN_PREFIX}${digest.slice(0, 10).toUpperCase()}`
```

</details>

**依据 2 · 源码核查**：[lib/gate.js:669-700](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/lib/gate.js#L669-L700)

降级与L0策略提供重组依据。

<details>
<summary>查看原文（32行）</summary>

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

  const key = cfg.cwd ? `${cfg.cwd}\u0000${command}` : command
  const cached = cache.get(key)
  if (cached) return applyToken(command, { ...cached, source: 'cache', ms: 0 }, cfg)

  // 降级窗口内(探测还没到期)→ 直接放行,不发请求。缓存过的判定在上面已经生效,
  // 所以降级丢掉的只是"无法再用语义层判新命令",不是整个判定历史。
  if (degradedNow && !probeDue(degradedState, now, cfg.scope)) return degradedVerdict(degradedState, cfg, now)
```

</details>

**依据 3 · 源码核查**：[adapters/dsh/index.js:493-499](https://github.com/7starsseeker/dsh-jev-guard/blob/958da7d14b8a18dccd724daa6c270f20892ce983/adapters/dsh/index.js#L493-L499)

原生管线仍是最后边界。

```text
    } catch (error) {
      // Never let the valve break a turn: an unexpected failure delegates to the
      // normal pipeline, where the sandbox and approval policy still apply.
      stats.errors += 1
      ctx.logger?.warn?.('jev-guard: unexpected failure, delegating: %s', String(error?.stack ?? error))
      void record({ action: 'allow', decision: 'allow', source: 'adapter-error', error: String(error?.message ?? error), cwd: process.cwd() }, cfg)
      return next()
```

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
