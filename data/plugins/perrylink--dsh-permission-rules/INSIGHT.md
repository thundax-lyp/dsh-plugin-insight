# dsh-permission-rules

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[67bf70b](https://github.com/PerryLink/dsh-permission-rules/tree/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581)

<!-- BEGIN META -->
[![GitHub ★ 134](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=134&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/PerryLink/dsh-permission-rules) [![npm 30d 6,247](https://img.shields.io/static/v1?label=npm+30d&message=6%2C247&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permission-rules) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-permission-rules)
<!-- END META -->

> **功能**：把可配置的工具权限规则、审批分流和代理网络判断接入 DSH。

> **亮点**：[Q01](#research-q01) 将高频审批条件编码为有序规则。

> **主要限制**：[Q02](#research-q02) 代理覆盖依赖流量路径，审计依赖宿主事件能力。

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
  - [Q01 · 怎样把重复审批变成可复核的规则？](#detail-section-11)
  - [Q02 · 代理与审计能提供何种证据？](#detail-section-12)
  - [Q03 · 怎样降低上线的误拦截？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：团队重复审批同类工具调用，需要可审阅的项目规则。

依赖宿主预设及逐次人工审批。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 规则 | 筛选重复审批 | 按顺序匹配 |
| 代理 | 筛选经代理的出站请求 | 直连另验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH | 必需 | 挂载工具钩子 | 审计支持需单独核对 |
| 审批答复方 | 按 ask 使用 | 完成裁决 | 缺答复方需验收拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 编写 | 维护者配置规则 | 固定规则优先级 |
| 预演 | 使用隔离 profile | 比对宿主裁决 |
| 上线 | 分阶段启用 | 记录例外及撤回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未知 | 编写代表性规则 | 核对宿主版本 |
| 持续 | 成本未知 | 调优和跟踪误拦截 | 审计能力随宿主变化 |
| 失败 | 恢复耗时未知 | 撤回 enforce | 按现有策略继续 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 审批治理 | 重复请求按可读规则分流 | 漏拦截和审批节时 |

> **思考**：[Q02](#research-q02) 代理覆盖依赖流量路径，审计依赖宿主事件能力。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将高频审批条件编码为有序规则。

[Q02](#research-q02) 代理注入有覆盖边界，日志有宿主能力门槛。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 代理覆盖依赖流量路径，审计依赖宿主事件能力。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在测试 profile 先预演并记录差异。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持规则拦截与代理注入，当前宿主覆盖未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/runtime.ts、VERIFICATION.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定运行时、README 和作者历史记录，未执行宿主与目标代码。
- 下一步：回放工具请求，比较直连与代理，并验证日志可重开。

**分析版本**

- **仓库**：[PerryLink/dsh-permission-rules](https://github.com/PerryLink/dsh-permission-rules)
- **版本号**：0.7.20（[固定提交 67bf70b](https://github.com/PerryLink/dsh-permission-rules/tree/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 用同一批历史请求比较规则预演和人工审批。

回放工具请求，比较直连与代理，并验证日志可重开。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 16 | 3576 | — | — | 53699 |
| .mjs | source | 10 | 956 | 649 | 250 | — |
| .ts | source | 24 | 7138 | 4574 | 2173 | — |
| .ts | test | 26 | 6534 | 4783 | 1427 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/PerryLink/dsh-permission-rules/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/PerryLink/dsh-permission-rules/issues?q=is%3Aissue+created%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z) [![近30天关闭 10](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=10&color=737b86&logo=github)](https://github.com/PerryLink/dsh-permission-rules/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T03%3A59%3A20.742Z..2026-11-05T03%3A59%3A20.742Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：团队如何固定重复工具审批，同时保留宿主审批和回退路径？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样把重复审批变成可复核的规则？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

维护者可用 YAML 针对工具、参数、路径和代理身份写有序规则。工具请求按会话 cwd 取规则并匹配；deny 和 ask 返回裁决，allow 和无匹配继续下游，保留原有宿主策略。ask 可交官方审批服务的人工或外置答复方。相比每次人工辨识，规则将重复判断固定为可读配置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:72-87](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/README.md#L72-L87)

规则、命中与审批接口。

<details>
<summary>查看原文（16行）</summary>

```text
## What you get

`dsh-permission-rules` puts an ordered **`allow` / `deny` / `ask`** rule list in front of every tool call on the `tools/pre-execute` waterfall — deterministic, instant, auditable, and written by you in plain YAML:

- **`deny`** blocks the call; the rule's `reason` becomes the model-visible error.
- **`ask`** rides the official approval seam (mount `dsh-auto-review` for a second-model answerer, or a human answers; with neither, the harness fails closed).
- **`allow`** (and no-match) strictly delegates via `next()` — downstream listeners are never short-circuited.

Every hit **and** every passthrough is audit-logged as a `permissionRules/decision` session event (log-only — nothing extra is injected into the model context).

- **Rich matching** — tool-name globs (including `mcp__*`), agent-identity selectors (`main` / `subagent` / `preset:*`), argument key/value globs **or** regexes (with `!pattern` negation and an `absent` key dimension), workspace-relative path globs at **any nesting depth**, `when` host conditions (env vars, platform), and **shell command decomposition** (`argv`: command word, argument tokens, pipeline signature) for token-precise command matching.
- **Built-in high-risk baseline** — a shipped deny/ask ruleset (destructive commands, privilege escalation, download-and-execute, sensitive paths) enabled by default and appended after user rules so a nearer user rule can override it; toggle with `builtin.enabled`.
- **Hierarchical rule files** — optional `searchUp` merges every `.dsh/rules.yaml` from the session cwd to the filesystem root, nearest first.
- **Dry-run rollout** — `enforce: false` audits what the policy *would* do while passing every call through.
- **Hot reload** — Chokidar watch with debounce; a broken edit keeps the previous rules, never crashes. On a WSL host, or for a rule file under `/mnt/<drive>`, the watch switches to polling because native change events are unreliable there.
- **Fail loud** — invalid YAML, unknown actions/fields, bad globs/regexes, backtracking-prone patterns, or more than `maxRules` rules fail the load.
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:442-475](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/src/runtime.ts#L442-L475)

实际决策和透传。

<details>
<summary>查看原文（34行）</summary>

```text
  async preExecute(exec: ToolExecution, next: () => Promise<PreToolDecision>): Promise<PreToolDecision> {
    const cwd = exec.agent?.session.header.cwd ?? process.cwd()
    const loaded = this.rulesFor(cwd)
    const hit = matchRules(loaded.compiled, exec.name, exec.arguments, cwd, this.matchContext(exec))
    if (hit !== undefined && hit.rule.action !== 'allow') {
      const structured = hit.rule.network !== undefined
      const reason = structured ? `${hit.rule.action === 'deny' ? '[network: denied]' : '[network: approval required]'} ${hit.rule.reason}` : hit.rule.reason
      if (!this.config.enforce) {
        // Dry-run: match the rule, log what it WOULD do, and delegate.
        const decision = await next()
        this.audit(exec, loaded, hit, decision.kind, true)
        return decision
      }
      const outcome: DecisionOutcome = hit.rule.action
      this.audit(exec, loaded, hit, outcome)
      return { kind: outcome, reason }
    }
    if (hit === undefined) {
      const fallback = this.webToolFallback(exec)
      if (fallback !== undefined) {
        if (!this.config.enforce) {
          const decision = await next()
          this.audit(exec, loaded, undefined, decision.kind, true, fallback)
          return decision
        }
        this.audit(exec, loaded, undefined, fallback, false, fallback)
        return { kind: fallback, reason: blockMessage(defaultDecision(this.resolveNetworkMode(exec.agent?.session).mode, this.config.network.unlisted)) }
      }
    }
    if (isShellTool(exec.name)) this.markShell(exec)
    const decision = await next()
    this.audit(exec, loaded, hit, decision.kind)
    return decision
  }
```

</details>

#### 缺口

- 宿主与插件顺序没有实测
  **影响**：未知原有监听器组合结果
  **进一步探讨**：在两个监听顺序下回放同一组请求

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代理与审计能提供何种证据？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

插件的本地代理可接收遵循代理变量的进程流量，运行时只有启用注入才向进程提供代理配置。直接连接或自定义传输仍须靠网络隔离另行验证。会话审计还取决于宿主是否支持安全持久化 ignorable 标记，未知能力默认跳过。作者有早期 headless 回放记录，本轮仅审阅固定代码。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:519-548](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/src/runtime.ts#L519-L548)

审计能力门槛。

<details>
<summary>查看原文（30行）</summary>

```text
  audit(exec: ToolExecution, loaded: LoadedRules, hit: RuleHit | undefined, outcome: DecisionOutcome, dryRun = false, modeDefault?: 'deny' | 'ask'): void {
    if (this.config.audit === 'hits' && hit === undefined && modeDefault === undefined) return
    const agent = exec.agent
    if (agent === undefined) return
    if (this.auditSupport === 'unsupported') return
    if (this.auditSupport === 'unknown' && !this.config.allowUnmarkedAudit) {
      const version = this.peerVersion()
      if (version === null || isUnmarkedHostVersion(version)) {
        this.auditSupport = 'unsupported'
        this.warnUnmarkedAuditHost()
        return
      }
    }
    try {
      const action = hit === undefined ? (modeDefault ?? 'passthrough') : hit.rule.action
      const result = this.appendAudit(agent, {
        toolName: exec.name,
        callId: exec.callId,
        source: hit === undefined ? (loaded.sources[0] ?? '') : (loaded.sources[hit.rule.sourceIndex] ?? ''),
        action,
        outcome,
        cwd: loaded.cwd,
        ...hit !== undefined ? { ruleIndex: hit.ruleIndex, reason: hit.rule.reason } : {},
        ...modeDefault !== undefined ? { reason: `${modeDefault === 'deny' ? '[network: denied]' : '[network: approval required]'} network mode default (no rule matched)` } : {},
        ...dryRun ? { dryRun: true as const } : {},
      })
      this.probeAuditResult(result)
    } catch (error: unknown) {
      this.ctx.logger.warn(`permission-rules: audit append failed: ${String(error)}`)
    }
```

</details>

**依据 2 · 源码核查**：[src/runtime.ts:758-782](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/src/runtime.ts#L758-L782)

代理环境变量注入。

<details>
<summary>查看原文（25行）</summary>

```text
      onBlock: (record, attribution) => this.auditNetworkBlock(record, attribution),
      logger: this.ctx.logger,
      upstream: () => this.upstreamFor(),
    })
    this.networkProxy = proxy
    this.ctx.effect(() => () => {
      void proxy.close()
      this.networkProxy = undefined
    })
    try {
      const port = await proxy.start()
      if (cfg.injectEnv) {
        this.envRestore = injectProxyEnv(port, cfg.noProxy)
        this.ctx.effect(() => {
          const restore = this.envRestore
          this.envRestore = undefined
          return () => restore?.()
        })
      }
      const { mode, sandboxMode } = this.resolveNetworkMode()
      this.ctx.logger.info(`permission-rules: network proxy listening on ${cfg.proxyBind}:${port} (mode ${mode}${sandboxMode !== undefined ? `, sandbox ${sandboxMode}` : ''})`)
    } catch (error: unknown) {
      this.ctx.logger.warn(`permission-rules: network proxy failed to bind on ${cfg.proxyBind}:${cfg.proxyPort} (${String(error)}) — shell network policy is INACTIVE; file/command rules stay active`)
    }
  }
```

</details>

**依据 3 · 源码核查**：[VERIFICATION.md:101-139](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/VERIFICATION.md#L101-L139)

历史 deny 和 ask 回放。

<details>
<summary>查看原文（39行）</summary>

````text
## 3. headless 实测（无 API key，llm-replay 回放模型脚本）

工作区 `Project\Plugins\dsh-permission-rules\.verification\workspace`，规则文件 `.dsh/rules.yaml`：

```yaml
rules:
  - match: { tools: [pwsh], params: { command: "git push*" } }
    action: deny
    reason: "禁止 push 到受保护路径"
  - match: { tools: [pwsh], params: { command: "Write-Output secret*" } }
    action: ask
    reason: "输出 secret 需要审批"
```

回放 fixture（`.verification/fixture-deny.session.jsonl` / `fixture-ask.session.jsonl`）记录两轮模型响应：第 1 轮发出 `pwsh` 工具调用，第 2 轮输出 `DONE` 结束回合。运行：

```sh
$env:DSH_SNAPSHOT_FILE = '<repo>\.verification\fixture-deny.session.jsonl'
dsh --profile permission-rules-demo "verify the deny rule blocks git push"   # cwd = .verification\workspace
```

### 3.1 deny 阻止 pwsh（fixture-deny）

回放出的 `pwsh(git push origin main)` 在 `tools/pre-execute` 被规则 1 阻止。会话日志（`~/.dsh/sessions/.../session.jsonl.zstd` 解帧）：

```
{"type":"permissionRules/decision","seq":21,"data":{"toolName":"pwsh","callId":"call-1",
 "source":"D:\\deepseek-harness\\Project\\Plugins\\dsh-permission-rules\\.verification\\workspace\\.dsh\\rules.yaml",
 "action":"deny","ruleIndex":0,"reason":"禁止 push 到受保护路径"}}
{"type":"tool/result","seq":22,"data":{...,"content":[{"type":"tool-result","toolCallId":"call-1",
 "content":[{"type":"text","text":"Error: 禁止 push 到受保护路径"}],"isError":true}]}}
```

模型可见结果 = 规则 reason；`pwsh` 进程从未执行。✅

### 3.2 ask 触发官方审批（fixture-ask）

`pwsh(Write-Output secret hello)` 命中规则 2 → 返回 `ask` → 官方 tools 流水线调用 `ctx.approval.request`。headless 组合的会话预设为 `danger-full-access`，审批策略因此为 `never`（官方服务在任何 answerer 之前确定拒绝），审计对完整：

````

</details>

#### 缺口

- 尚无目标宿主旁路和重开测试
  **影响**：不能将它当成出站隔离或完整审计证据
  **进一步探讨**：比较代理感知和直连客户端，重开会话核对日志

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样降低上线的误拦截？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

在专用 profile 将 enforce 关闭，从少量已知工具和参数规则开始，用回放比较预期与下游结果，并确认当前宿主可写审计；再打开 enforcement。对照只靠人工审批与预置规则的误拦截、漏拦截和回退时间，审计不可用或误拦截持续则停止扩围。

#### 证据与依据

**依据 1 · 源码核查**：[src/runtime.ts:442-475](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/src/runtime.ts#L442-L475)

dry-run 保留实际下游决策。

<details>
<summary>查看原文（34行）</summary>

```text
  async preExecute(exec: ToolExecution, next: () => Promise<PreToolDecision>): Promise<PreToolDecision> {
    const cwd = exec.agent?.session.header.cwd ?? process.cwd()
    const loaded = this.rulesFor(cwd)
    const hit = matchRules(loaded.compiled, exec.name, exec.arguments, cwd, this.matchContext(exec))
    if (hit !== undefined && hit.rule.action !== 'allow') {
      const structured = hit.rule.network !== undefined
      const reason = structured ? `${hit.rule.action === 'deny' ? '[network: denied]' : '[network: approval required]'} ${hit.rule.reason}` : hit.rule.reason
      if (!this.config.enforce) {
        // Dry-run: match the rule, log what it WOULD do, and delegate.
        const decision = await next()
        this.audit(exec, loaded, hit, decision.kind, true)
        return decision
      }
      const outcome: DecisionOutcome = hit.rule.action
      this.audit(exec, loaded, hit, outcome)
      return { kind: outcome, reason }
    }
    if (hit === undefined) {
      const fallback = this.webToolFallback(exec)
      if (fallback !== undefined) {
        if (!this.config.enforce) {
          const decision = await next()
          this.audit(exec, loaded, undefined, decision.kind, true, fallback)
          return decision
        }
        this.audit(exec, loaded, undefined, fallback, false, fallback)
        return { kind: fallback, reason: blockMessage(defaultDecision(this.resolveNetworkMode(exec.agent?.session).mode, this.config.network.unlisted)) }
      }
    }
    if (isShellTool(exec.name)) this.markShell(exec)
    const decision = await next()
    this.audit(exec, loaded, hit, decision.kind)
    return decision
  }
```

</details>

**依据 2 · 作者声明**：[README.md:74-87](https://github.com/PerryLink/dsh-permission-rules/blob/67bf70bdcffe5d58d30b0ff87ebc05eecaf9f581/README.md#L74-L87)

部署选项和配置。

<details>
<summary>查看原文（14行）</summary>

```text
`dsh-permission-rules` puts an ordered **`allow` / `deny` / `ask`** rule list in front of every tool call on the `tools/pre-execute` waterfall — deterministic, instant, auditable, and written by you in plain YAML:

- **`deny`** blocks the call; the rule's `reason` becomes the model-visible error.
- **`ask`** rides the official approval seam (mount `dsh-auto-review` for a second-model answerer, or a human answers; with neither, the harness fails closed).
- **`allow`** (and no-match) strictly delegates via `next()` — downstream listeners are never short-circuited.

Every hit **and** every passthrough is audit-logged as a `permissionRules/decision` session event (log-only — nothing extra is injected into the model context).

- **Rich matching** — tool-name globs (including `mcp__*`), agent-identity selectors (`main` / `subagent` / `preset:*`), argument key/value globs **or** regexes (with `!pattern` negation and an `absent` key dimension), workspace-relative path globs at **any nesting depth**, `when` host conditions (env vars, platform), and **shell command decomposition** (`argv`: command word, argument tokens, pipeline signature) for token-precise command matching.
- **Built-in high-risk baseline** — a shipped deny/ask ruleset (destructive commands, privilege escalation, download-and-execute, sensitive paths) enabled by default and appended after user rules so a nearer user rule can override it; toggle with `builtin.enabled`.
- **Hierarchical rule files** — optional `searchUp` merges every `.dsh/rules.yaml` from the session cwd to the filesystem root, nearest first.
- **Dry-run rollout** — `enforce: false` audits what the policy *would* do while passing every call through.
- **Hot reload** — Chokidar watch with debounce; a broken edit keeps the previous rules, never crashes. On a WSL host, or for a rule file under `/mnt/<drive>`, the watch switches to polling because native change events are unreliable there.
- **Fail loud** — invalid YAML, unknown actions/fields, bad globs/regexes, backtracking-prone patterns, or more than `maxRules` rules fail the load.
```

</details>

#### 缺口

- 真实规则误报率未知
  **影响**：实际节省的审批时间未知
  **进一步探讨**：固定正常和危险调用集记录差异

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
