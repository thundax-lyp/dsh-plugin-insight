# dsh-gov

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[bb06125](https://github.com/863683348/dsh-gov/tree/bb061250a1dcead15edc202b4666c7d54f36da4a)

<!-- BEGIN META -->
[![npm 30d 146](https://img.shields.io/static/v1?label=npm+30d&message=146&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gov) [![最新发布 2026-08-17](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-17&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gov)
<!-- END META -->

> **实现功能**：为DSH提供规则式工具allow/deny/ask、JSONL审计查询与按Agent累计token的预算警告。

> **核心亮点**：把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](#research-q01)。

> **风险与缺陷**：被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](#research-q02)。

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
  - [Q01 · 治理用途和策略判据是什么，谁持有管理权？](#detail-section-11)
  - [Q02 · 配额会硬停吗，计量与设置能保证什么？](#detail-section-12)
  - [Q03 · 审计、持久化和测试支持哪些保证？](#detail-section-13)
  - [Q04 · 如何启动和衡量三阶段成本？](#detail-section-14)
  - [Q05 · 采用结论及可证伪方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护者需要统一解释工具策略、观察事件和预算提示，强治理需额外权限边界。详见[Q01](#research-q01)。

分别写工具hook、查宿主日志和tokenMeter；本项统一辅助治理入口，不等不可绕企业控制面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| gov模型工具 | 全局规则/日志/额度操作 | 未分管理员/主体范围 |
| 策略hook | allow/deny/ask决策 | 默认allow、宿主契约另核 |
| JSONL审计 | 查询/汇总/路径导出 | best-effort，不防篡改 |
| token quota提醒 | 周期used与上下文警告 | 非硬停，注册和key条件 |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| tools/agents/systemPrompt/tokenMeter | gate/工具/计量 | 固定宿主契约，非自带硬预算 |
| host治理目录可写 | 全局JSON/日志 | 权限/备份/容量外部管理 |
| 管理员受权策略 | 防模型自改治理 | 本插件未区分调用者 |
| 明确usage口径 | 预算解释 | totalTokens不能直接推账单 |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 定义管理员/执行者与备份 | 维护者 | 先限制gov管理面 |
| 配规则/额度并核hook | 维护者 | 动态quota需检查启动条件 |
| 查看实际决策和计量 | 用户/Agent | 不把warning当硬停 |
| 核审计持久与恢复 | 管理员 | 缺失/坏文件不能静默信任 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH工具/Agent/tokenMeter服务、host治理JSON和日志目录 | 定义受控工具/主体/工作区与管理权限、预算口径，工时未知 | 无独立云服务调用；宿主ABI及真正管理边界需核 |
| 持续使用 | 每工具同步日志append、每步计量/状态写入、查询全日志内存 | 审阅策略/异常日志和计量差异，维护规则与文件备份 | token值不等货币账单；无日志轮转/存储总限，净工时未知 |
| 失败恢复 | 原策略/额度/日志备份及宿主恢复资源 | 核静默持久失败/坏文件、恢复误改规则、对照真实用量 | 审计不防篡改/失败不阻断，无完整交易回滚；金额工时未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 策略解释 | priority与平局排序 | 宿主hook强制与管理员隔离 |
| 事件查询 | JSONL字段/筛选 | 持久完整、防篡改与调用关联 |
| 预算提示 | 每步累计并warning | 新增usage/货币、硬上限和动态接线 |

> **思考**：被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](#research-q01)。

把工具策略解释、JSONL事件与预算提示用纯模块和一个工具整合，减少分散hook接线。详见[Q01](#research-q01)。

纯模型可读可测、日志少采参数降低部分敏感面；fail-open持久/计量与管理权混合需按实际治理目标判断。详见[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

被治理模型也能改全局策略/预算，quota不硬停且启动/global键与计量delta未闭合，持久失败和坏配置可静默失去治理。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察，只作可信单用户辅助诊断继续探讨，强权限/预算/审计在宿主受权面另保证。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

纯规则/观察组合可核；管理权、计量与审计可靠性不够硬治理；版本化政策/收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.zh.md、README.md、SECURITY.md、package.json、lib/index.js、lib/policy.js、lib/quota.js、lib/audit.js、test/policy.test.mjs、test/quota.test.mjs、test/audit.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整lib四文件492行、README/SECURITY、三组纯函数测试只读；无宿主/目标执行。
- 下一步：对照管理员隔离和usage delta，按模型自改、动态quota/global键、重复measure、坏盘和并发调用检验政策/审计收据与维护成本。

**分析版本**

- **仓库**：[863683348/dsh-gov](https://github.com/863683348/dsh-gov)
- **版本号**：0.1.0（[固定提交 bb06125](https://github.com/863683348/dsh-gov/tree/bb061250a1dcead15edc202b4666c7d54f36da4a)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

管理员签发的版本化政策、明确usage delta/预算预留与关联审计收据，按自改政策/计量/坏盘反例检验，未验证。详见[Q05](#research-q05)。

对照管理员隔离和usage delta，按模型自改、动态quota/global键、重复measure、坏盘和并发调用检验政策/审计收据与维护成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 156 | — | — | 1421 |
| .js | source | 4 | 493 | 377 | 88 | — |
| .mjs | source | 1 | 31 | 24 | 4 | — |
| .mjs | test | 3 | 166 | 147 | 4 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-gov/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-gov/issues?q=is%3Aissue+created%3A2026-09-22T10%3A18%3A12.774Z..2026-10-22T10%3A18%3A12.774Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-gov/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T10%3A18%3A12.774Z..2026-10-22T10%3A18%3A12.774Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版策略/审计/配额组合能否成为可信治理，哪些仅属辅助提醒？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 治理用途和策略判据是什么，谁持有管理权？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标是给需要按工具/Agent/workspace解释权限、查工具行为和看预算提醒的DSH维护者一个统一入口。原方案是分别写hook、查日志和量token，本项纯policy/audit/quota模块加host接线，模型用gov status/list/query及管理action。规则按priority高者优先，同优先deny>ask>allow，无匹配默认allow；这只是平局排序保守，不是默认拒绝。glob仅简单*和全平台case-insensitive字符串，workspace不做realpath/系统大小写区分，不是物理路径隔离或基于参数风险的权限模型。

前置hook计算decision并记日志，deny/ask返回给宿主管线，allow才next；实际强制和审批语义仍依tools/pre-execute ABI。核心局限是gov这个模型工具同时提供全局policy_add/remove、quota_set/reset、跨Agent查询，没有调用者/管理员身份、workspace范围或单独审批检查；在既有策略未先限制gov时，被治理Agent可以给任何工具添加更高priority allow、删限制或调quota。自然语言“不要绕过”不构成权威分离。已有贡献是可解释策略/观察组合的便捷实现，不能按企业不可绕治理层使用。

#### 证据与依据

**依据 1 · 源码核查**：[README.zh.md:3-11](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/README.zh.md#L3-L11)

作者场景。

```text
权限与合规、审计日志、成本控制 —— DSH 进企业前必须有的东西，做成一个插件。策略门禁（allow/deny/ask）、结构化审计日志、按 agent 的 token 配额，状态持久化在 `$DSH_HOME/gov/`。

## 为什么需要它

企业引入 DSH 时第一波问题永远是：

- **谁能让 agent 跑高危工具？** 策略门禁：按工具/agent/工作区规则 allow / deny / ask，通配符 + 优先级，默认放行、平局 fail-closed（deny > ask > allow）。
- **出事了怎么追溯？** 每次工具调用（决定 + 结果）写入结构化 JSONL 审计日志（`audit.jsonl`），可查询、可导出、可汇总。
- **钱花哪去了？** 接宿主 `tokenMeter` 按 agent 累计用量，周期配额（day/week/month/total），超限注入上下文警告，一键重置。
```

**依据 2 · 源码核查**：[lib/policy.js:11-52](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/policy.js#L11-L52)

匹配/排序/默认。

<details>
<summary>查看原文（42行）</summary>

```text
/** Simple glob: `*` matches any sequence; otherwise exact, case-insensitive. */
export function globMatch(pattern, value) {
  if (pattern === "*" || pattern === void 0) return true;
  const p = String(pattern).toLowerCase();
  const v = String(value ?? "").toLowerCase();
  if (!p.includes("*")) return p === v;
  const parts = p.split("*");
  if (!v.startsWith(parts[0]) || !v.endsWith(parts[parts.length - 1])) return false;
  let rest = v.slice(parts[0].length, v.length - parts[parts.length - 1].length);
  for (let i = 1; i < parts.length - 1; i++) {
    const idx = rest.indexOf(parts[i]);
    if (idx === -1) return false;
    rest = rest.slice(idx + parts[i].length);
  }
  return true;
}

/** Whether one rule applies to a call context. */
export function matchRule(rule, call) {
  if (!rule || typeof rule !== "object") return false;
  if (rule.tool !== void 0 && !globMatch(rule.tool, call.tool)) return false;
  if (rule.agents !== void 0 && rule.agents.length > 0 && !rule.agents.some((a) => globMatch(a, call.agent))) return false;
  if (rule.workspaces !== void 0 && rule.workspaces.length > 0 && !rule.workspaces.some((w) => globMatch(w, call.workspace))) return false;
  return true;
}

const ACTION_RANK = { deny: 2, ask: 1, allow: 0 };

/**
 * Decide on a call against the rule list. Defaults to `allow` (matching the
 * harness default posture); a matched rule's priority decides, ties fail
 * closed (deny > ask > allow).
 * @param rules - policy rules.
 * @param call - { tool, agent?, workspace? }.
 * @returns { decision, rule? }.
 */
export function decide(rules, call) {
  const matched = (rules ?? [])
    .filter((r) => matchRule(r, call))
    .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0) || ACTION_RANK[b.action] - ACTION_RANK[a.action]);
  if (matched.length === 0) return { decision: "allow" };
  return { decision: matched[0].action, rule: matched[0] };
```

</details>

**依据 3 · 源码核查**：[lib/index.js:110-127](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L110-L127)

host gate。

<details>
<summary>查看原文（18行）</summary>

```text
  if (rulesOk.length > 0) ctx.root?.logger?.("gov").warn("invalid persisted rules: " + rulesOk.join("; "));

  // 1) pre-execute gating: deny / ask / allow by policy
  ctx.on("tools/pre-execute", async (exec, next) => {
    const call = callFor(exec);
    const { decision, rule } = decide(state.rules, call);
    appendAudit(config.root, auditEntry({
      ...call,
      decision,
      reason: rule?.reason ?? "",
      meta: { gate: "policy" },
    }));
    if (decision === "deny") return { kind: "deny", reason: rule?.reason ?? "blocked by dsh-gov policy" };
    if (decision === "ask") return { kind: "ask", reason: rule?.reason ?? "requires approval (dsh-gov policy)" };
    return next();
  });

  // 2) result observation: record tool outcomes in the audit trail
```

</details>

**依据 4 · 源码核查**：[lib/index.js:209-238](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L209-L238)

全局规则管理。

<details>
<summary>查看原文（30行）</summary>

```text
      render: (_args, value) => {
        const lines = [value.action + (value.ok ? " ok" : " failed") + ": " + value.message];
        if (value.data) lines.push(JSON.stringify(value.data, null, 1).slice(0, 4000));
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const { action } = args;
      if (action === "policy_add") {
        if (!ACTIONS.includes(args.policyAction)) throw new Error('gov: policy_add requires policyAction in ["allow","deny","ask"]');
        state.seq += 1;
        const rule = {
          id: "r" + state.seq,
          tool: args.tool,
          agents: args.agent ? [args.agent] : void 0,
          workspaces: args.workspace ? [args.workspace] : void 0,
          action: args.policyAction,
          reason: args.reason ?? "",
          priority: args.priority ?? 0,
        };
        if (validateRules([rule]).length > 0) throw new Error("gov: invalid rule");
        state.rules.push(rule);
        saveState(config.root, state);
        return { action, ok: true, message: "rule added: " + rule.id + " (" + rule.action + " on " + (rule.tool ?? "*") + ")", data: { rule } };
      }
      if (action === "policy_remove") {
        const before = state.rules.length;
        state.rules = state.rules.filter((r) => r.id !== args.id);
        if (state.rules.length === before) throw new Error('gov: no rule with id "' + args.id + '"');
        saveState(config.root, state);
```

</details>

**依据 5 · 源码核查**：[lib/index.js:249-278](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L249-L278)

quota修改无身份。

<details>
<summary>查看原文（30行）</summary>

```text
      if (action === "audit_export") {
        const path = join(config.root, "audit.jsonl");
        return { action, ok: true, message: "audit log at " + path, data: { path, events: readAudit(config.root).length } };
      }
      if (action === "quota_set") {
        const key = args.id ?? "global";
        const quota = state.quotas[key] ?? (state.quotas[key] = newQuota(config.defaultPeriod, config.defaultLimit));
        if (args.period) quota.period = args.period;
        if (args.quotaLimit !== void 0) quota.limit = args.quotaLimit;
        quota.periodKey = periodKey(quota.period);
        saveState(config.root, state);
        return { action, ok: true, message: "quota for " + key + ": " + quota.used + "/" + quota.limit + " (" + quota.period + ")", data: { quota } };
      }
      if (action === "quota_get") {
        const key = args.id ?? "global";
        const quota = state.quotas[key];
        if (!quota) return { action, ok: true, message: "no quota set for " + key, data: { quota: null } };
        return { action, ok: true, message: "quota for " + key + ": " + quota.used + "/" + quota.limit + " (" + quota.period + ")", data: { quota } };
      }
      if (action === "quota_reset") {
        const key = args.id ?? "global";
        const quota = state.quotas[key];
        if (!quota) throw new Error('gov: no quota for "' + key + '"');
        quota.used = 0;
        quota.periodKey = periodKey(quota.period);
        saveState(config.root, state);
        return { action, ok: true, message: "quota reset for " + key, data: { quota } };
      }
      // status
      const entries = readAudit(config.root);
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配额会硬停吗，计量与设置能保证什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

quota超限仅在pre-step注入user snapshot警告，返回enter继续，不cancel/deny，也不预留token预算，等于提醒不是消费硬限。计量异常catch直接继续，defaultLimit=0无已有quota时连pre-step listener都不注册，后续gov quota_set不会动态装hook，需重载才可能计量。执行hook每次只取state.quotas[agent.id]，默认quota_set/get/reset用global，global并不作为新Agent的共享兜底，因此“设全局额度”不会自动约束所有Agent。

每步把measurement.totalTokens直接applyTokens累加，无上次值/差分标记，也不区分输入/输出/缓存和价格。若tokenMeter值是session累计或当前上下文，重复累加不能代表新增账单token；固定宿主测量语义需外部契约核，不能据字段名宣称真实花费。used>limit才exceeded，等于限额不超；limit<=0包括负值都视无限。quota_set可改period并直接periodKey=current却保used，跨周期新设置可沿用旧数而不重置；quota_get不检查过期。week按周一所在年份计算，不是通用ISO周数，年界不能外推ISO契约。具体口径与时间边界要在治理说明中明确。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:137-179](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L137-L179)

条件注册/累计/仅警告。

<details>
<summary>查看原文（43行）</summary>

```text
  if (config.defaultLimit > 0 || Object.keys(state.quotas).length > 0) {
    ctx.on("agent/pre-step", async (payload, next) => {
      const decision = await next();
      if (decision.kind === "reject") return decision;
      const { agent } = payload;
      let tokens = 0;
      let exceeded = false;
      try {
        const measurement = ctx.tokenMeter.measure(agent.session);
        tokens = measurement.totalTokens || 0;
        const quota = state.quotas[agent.id] ?? (state.quotas[agent.id] = newQuota(config.defaultPeriod, config.defaultLimit));
        const r = applyTokens(quota, tokens, Date.now());
        exceeded = r.exceeded;
        saveState(config.root, state);
      } catch {
        return decision; // metering unavailable: never block on it
      }
      appendAudit(config.root, auditEntry({
        agent: agent.id,
        workspace: agent.session?.header?.cwd,
        tool: "(step)",
        decision: exceeded ? "ask" : "ok",
        meta: { gate: "quota", tokens, used: state.quotas[agent.id]?.used ?? tokens },
      }));
      if (exceeded && config.prestepWarn) {
        const text = "dsh-gov quota warning: agent " + agent.id + " exceeded its " + state.quotas[agent.id].period + " token budget (used " + state.quotas[agent.id].used + " of " + state.quotas[agent.id].limit + "). Stop token-heavy work or ask the user to raise the quota via gov quota_set.";
        return {
          kind: "enter",
          messages: decision.messages.concat([createUserMessage({
            content: [{ type: "text", text }],
            source: { kind: "plugin", plugin: name, form: "snapshot", sections: [{ name: "gov:quota", text }] },
          })]),
        };
      }
      return decision;
    }, { prepend: true });
  }

  // 4) the model-facing governance tool
  ctx.tools.register(defineTool({
    name: "gov",
    description: "Agent governance suite: policy-based tool gating (allow/deny/ask), structured audit trail, and per-agent token quotas. Actions: status, policy_list, policy_add, policy_remove, audit_query, audit_export, quota_get, quota_set, quota_reset. Use for permissions, compliance, audit, and cost control questions.",
    parameters: {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:249-278](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L249-L278)

global与period设置。

<details>
<summary>查看原文（30行）</summary>

```text
      if (action === "audit_export") {
        const path = join(config.root, "audit.jsonl");
        return { action, ok: true, message: "audit log at " + path, data: { path, events: readAudit(config.root).length } };
      }
      if (action === "quota_set") {
        const key = args.id ?? "global";
        const quota = state.quotas[key] ?? (state.quotas[key] = newQuota(config.defaultPeriod, config.defaultLimit));
        if (args.period) quota.period = args.period;
        if (args.quotaLimit !== void 0) quota.limit = args.quotaLimit;
        quota.periodKey = periodKey(quota.period);
        saveState(config.root, state);
        return { action, ok: true, message: "quota for " + key + ": " + quota.used + "/" + quota.limit + " (" + quota.period + ")", data: { quota } };
      }
      if (action === "quota_get") {
        const key = args.id ?? "global";
        const quota = state.quotas[key];
        if (!quota) return { action, ok: true, message: "no quota set for " + key, data: { quota: null } };
        return { action, ok: true, message: "quota for " + key + ": " + quota.used + "/" + quota.limit + " (" + quota.period + ")", data: { quota } };
      }
      if (action === "quota_reset") {
        const key = args.id ?? "global";
        const quota = state.quotas[key];
        if (!quota) throw new Error('gov: no quota for "' + key + '"');
        quota.used = 0;
        quota.periodKey = periodKey(quota.period);
        saveState(config.root, state);
        return { action, ok: true, message: "quota reset for " + key, data: { quota } };
      }
      // status
      const entries = readAudit(config.root);
```

</details>

**依据 3 · 源码核查**：[lib/quota.js:8-19](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/quota.js#L8-L19)

周计算。

<details>
<summary>查看原文（12行）</summary>

```text
export function periodKey(period, now = Date.now()) {
  const d = new Date(now);
  if (period === "month") return d.getUTCFullYear() + "-" + String(d.getUTCMonth() + 1).padStart(2, "0");
  if (period === "week") {
    const day = (d.getUTCDay() + 6) % 7; // Monday = 0
    const monday = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() - day));
    const year = monday.getUTCFullYear();
    const week = Math.ceil(((monday - new Date(Date.UTC(year, 0, 1))) / 86400000 + 1) / 7);
    return year + "-W" + String(week).padStart(2, "0");
  }
  if (period === "total") return "total";
  return d.toISOString().slice(0, 10); // day
```

</details>

**依据 4 · 源码核查**：[lib/quota.js:34-48](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/quota.js#L34-L48)

used/limit与累计。

<details>
<summary>查看原文（15行）</summary>

```text
 * the quota plus the exceeded flag.
 * @returns { quota, exceeded, remaining }.
 */
export function applyTokens(quota, tokens, now = Date.now()) {
  resetIfNeeded(quota, now);
  quota.used += Math.max(0, tokens);
  const limit = quota.limit > 0 ? quota.limit : Infinity;
  const exceeded = quota.used > limit;
  return { quota, exceeded, remaining: limit === Infinity ? Infinity : Math.max(0, limit - quota.used) };
}

/** Build a default quota object. */
export function newQuota(period = "day", limit = 0, now = Date.now()) {
  return { period, limit, used: 0, periodKey: periodKey(period, now) };
}
```

</details>

#### 缺口

- 相同宿主tokenMeter.measure的计量对象/是否delta以及pre-step返回契约
  **影响**：无法把当前used解释为可计费新增token或把警告称硬预算，计量异常仍放行
  **进一步探讨**：核固定tokenMeter源，比较多步相同上下文/累计usage/周期切换与本地used，不用货币估算替代

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 审计、持久化和测试支持哪些保证？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

audit记录时间、agent/workspace/tool、decision/reason和少量meta，不写工具参数和返回正文，可降低日志泄密面；缺少调用ID/turn/attempt、规则版本/胜出ID和完整审批结果，policy gate与result并发时难精确配对。它记录的是决策/结果，不是可证明命令内容、实际文件变更或业务完成的完整审计链。JSONL纯append没有签名/链哈希/外部存证/不可变权限，host或拥有目录写权者可改；append失败catch吞，仍执行工具，无可见“本次缺审计”收据。

gov.json同步直写、无tmp/锁/CAS，写失败吞且工具回ok；load解析失败默认空规则/额度，等于受控策略静默回默认allow，不是安全恢复。已解析但rules格式非法只warn，不拒用或隔离，validateRules也只查id/action等基础字段，agents/workspaces非数组可能在some处抛错。query/status/export每次同步读完整日志再sort/filter，limit最多200只限制输出条数不限制读盘/CPU；render4000字符也只是截断展示，不是日志保留上限。工具schema未声明decision参数却audit_query读取args.decision，README的decision筛选能否从模型参数通过依宿主validator，不能当已完整配置。

测试全为纯policy/audit/quota模块断言，覆盖优先级、简单通配、JSONL坏行跳过、普通周/日累计，无host hook/tool权限/计量delta/失败持久/年界集成。逻辑分层可借鉴，但纯函数通过不等企业安全合规或宿主强制性验收。本轮只读不执行。

#### 证据与依据

**依据 1 · 源码核查**：[lib/audit.js:8-50](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/audit.js#L8-L50)

字段/查询。

<details>
<summary>查看原文（43行）</summary>

```text
export function auditEntry({ ts, agent, workspace, tool, decision, reason, meta }) {
  return {
    ts: typeof ts === "number" ? ts : Date.now(),
    agent: agent ?? "unknown",
    workspace: workspace ?? "",
    tool: tool ?? "",
    decision: decision ?? "observe",
    reason: reason ?? "",
    meta: meta ?? null,
  };
}

/** Serialize one entry as a JSON line (for a JSONL audit log). */
export function serializeEntry(entry) {
  return JSON.stringify(entry);
}

/** Parse a JSONL audit log into entries (skipping malformed lines). */
export function parseLog(text) {
  const entries = [];
  for (const line of String(text).split(/\r?\n/)) {
    if (line.trim().length === 0) continue;
    try {
      const e = JSON.parse(line);
      if (e && typeof e === "object" && e.ts !== void 0) entries.push(e);
    } catch { /* skip malformed line */ }
  }
  return entries;
}

/** Filter and page a log. */
export function queryLog(entries, opts = {}) {
  const { limit = 50, agent, tool, decision, since, until } = opts;
  return entries
    .filter((e) => agent === void 0 || e.agent === agent)
    .filter((e) => tool === void 0 || globEquals(e.tool, tool))
    .filter((e) => decision === void 0 || e.decision === decision)
    .filter((e) => since === void 0 || e.ts >= since)
    .filter((e) => until === void 0 || e.ts <= until)
    .sort((a, b) => b.ts - a.ts)
    .slice(0, Math.max(1, Math.min(limit, 200)));
}

```

</details>

**依据 2 · 源码核查**：[lib/index.js:52-90](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L52-L90)

静默加载/存储/日志。

<details>
<summary>查看原文（39行）</summary>

```text
 */
function loadState(root) {
  try {
    return JSON.parse(readFileSync(join(root, "gov.json"), "utf8"));
  } catch {
    return { rules: [], quotas: {}, seq: 0 };
  }
}

/** Persist state. */
function saveState(root, state) {
  try {
    mkdirSync(root, { recursive: true });
    writeFileSync(join(root, "gov.json"), JSON.stringify(state, null, 1));
  } catch {
    /* state persistence is best-effort; never crash the agent over it */
  }
}

/** Append one line to the JSONL audit log. */
function appendAudit(root, entry) {
  try {
    mkdirSync(root, { recursive: true });
    appendFileSync(join(root, "audit.jsonl"), serializeEntry(entry) + "\n", "utf8");
  } catch {
    /* audit persistence is best-effort */
  }
}

/** Read and parse the audit log. */
function readAudit(root) {
  try {
    const text = readFileSync(join(root, "audit.jsonl"), "utf8");
    return text.split(/\r?\n/).filter((l) => l.trim().length > 0).map((l) => {
      try { return JSON.parse(l); } catch { return null; }
    }).filter(Boolean);
  } catch {
    return [];
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:110-137](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L110-L137)

invalid仅warn及审计。

<details>
<summary>查看原文（28行）</summary>

```text
  if (rulesOk.length > 0) ctx.root?.logger?.("gov").warn("invalid persisted rules: " + rulesOk.join("; "));

  // 1) pre-execute gating: deny / ask / allow by policy
  ctx.on("tools/pre-execute", async (exec, next) => {
    const call = callFor(exec);
    const { decision, rule } = decide(state.rules, call);
    appendAudit(config.root, auditEntry({
      ...call,
      decision,
      reason: rule?.reason ?? "",
      meta: { gate: "policy" },
    }));
    if (decision === "deny") return { kind: "deny", reason: rule?.reason ?? "blocked by dsh-gov policy" };
    if (decision === "ask") return { kind: "ask", reason: rule?.reason ?? "requires approval (dsh-gov policy)" };
    return next();
  });

  // 2) result observation: record tool outcomes in the audit trail
  ctx.on("tools/result", (exec, result) => {
    appendAudit(config.root, auditEntry({
      ...callFor(exec),
      decision: result.isError ? "error" : "ok",
      meta: { gate: "result", error: result.isError },
    }));
  });

  // 3) pre-step token metering: accumulate per-agent quota, warn on exceed
  if (config.defaultLimit > 0 || Object.keys(state.quotas).length > 0) {
```

</details>

**依据 4 · 源码核查**：[lib/index.js:179-197](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L179-L197)

参数缺decision。

<details>
<summary>查看原文（19行）</summary>

```text
    parameters: {
      action: {
        type: "string",
        required: true,
        enum: ["status", "policy_list", "policy_add", "policy_remove", "audit_query", "audit_export", "quota_get", "quota_set", "quota_reset"],
        description: "What to do.",
      },
      tool: { type: "string", description: "Tool name pattern (supports * wildcards); for policy_add / audit_query filters." },
      agent: { type: "string", description: "Agent id pattern; for policy_add / audit_query filters / quota scope." },
      workspace: { type: "string", description: "Workspace path pattern; for policy_add / audit_query filters." },
      policyAction: { type: "string", enum: ACTIONS, description: "allow | deny | ask — the rule action (policy_add only)." },
      reason: { type: "string", description: "Human-readable reason for a rule or denied call." },
      priority: { type: "integer", description: "Rule priority (higher wins; default 0)." },
      id: { type: "string", description: "Rule id to remove (policy_remove) or quota key (quota_get/set/reset)." },
      limit: { type: "integer", description: "Result cap for audit_query (default 50)." },
      since: { type: "integer", description: "Earliest ts (ms epoch) for audit_query." },
      period: { type: "string", enum: PERIODS, description: "day | week | month | total — quota period." },
      quotaLimit: { type: "integer", description: "Token budget (0 = unlimited) for quota_set." },
    },
```

</details>

**依据 5 · 源码核查**：[lib/index.js:239-247](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L239-L247)

读args.decision和export路径。

```text
        return { action, ok: true, message: "rule removed: " + args.id, data: { remaining: state.rules.length } };
      }
      if (action === "policy_list") {
        return { action, ok: true, message: state.rules.length + " rule(s)", data: { rules: state.rules } };
      }
      if (action === "audit_query") {
        const entries = readAudit(config.root);
        const out = queryLog(entries, { limit: args.limit ?? 50, agent: args.agent, tool: args.tool, decision: args.decision, since: args.since });
        return { action, ok: true, message: out.length + " of " + entries.length + " events", data: { entries: out } };
```

**依据 6 · 源码核查**：[test/policy.test.mjs:1-49](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/test/policy.test.mjs#L1-L49)

纯规则断言。

<details>
<summary>查看原文（49行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import { globMatch, matchRule, decide, validateRules } from "../lib/policy.js";

test("globMatch supports wildcards and case-insensitivity", () => {
  assert.equal(globMatch("*", "anything"), true);
  assert.equal(globMatch("bash*", "bash_foo"), true);
  assert.equal(globMatch("bash*", "pwsh_foo"), false);
  assert.equal(globMatch("*write*", "my_writer"), true);
  assert.equal(globMatch("tool", "TOOL"), true);
  assert.equal(globMatch("tool", "tools"), false);
});

test("matchRule applies tool/agent/workspace filters", () => {
  const rule = { id: "r1", tool: "bash*", agents: ["alice"], workspaces: ["/work/a*"], action: "deny" };
  assert.equal(matchRule(rule, { tool: "bash_run", agent: "alice", workspace: "/work/app" }), true);
  assert.equal(matchRule(rule, { tool: "read", agent: "alice", workspace: "/work/app" }), false);
  assert.equal(matchRule(rule, { tool: "bash_run", agent: "bob", workspace: "/work/app" }), false);
  assert.equal(matchRule(rule, { tool: "bash_run", agent: "alice", workspace: "/other" }), false);
});

test("decide defaults to allow when nothing matches", () => {
  const r = decide([], { tool: "read" });
  assert.equal(r.decision, "allow");
  assert.equal(r.rule, void 0);
});

test("decide honors priority and fails closed on ties", () => {
  const rules = [
    { id: "a", tool: "bash*", action: "allow", priority: 1 },
    { id: "b", tool: "bash_run", action: "deny", priority: 2 },
  ];
  assert.equal(decide(rules, { tool: "bash_run" }).decision, "deny");
  const tie = [
    { id: "x", tool: "read", action: "allow", priority: 0 },
    { id: "y", tool: "read", action: "deny", priority: 0 },
  ];
  assert.equal(decide(tie, { tool: "read" }).decision, "deny");
});

test("decide returns the winning rule", () => {
  const rules = [{ id: "guard", tool: "pwsh*", action: "ask", reason: "shell is risky" }];
  const out = decide(rules, { tool: "pwsh_run" });
  assert.equal(out.decision, "ask");
  assert.equal(out.rule.id, "guard");
});

test("validateRules catches bad structures", () => {
  assert.ok(validateRules("nope").length > 0);
```

</details>

**依据 7 · 源码核查**：[test/quota.test.mjs:5-32](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/test/quota.test.mjs#L5-L32)

计量纯模型。

<details>
<summary>查看原文（28行）</summary>

```text
test("periodKey: day / week / month / total", () => {
  const now = Date.UTC(2026, 7, 17, 12, 0, 0); // 2026-08-17
  assert.equal(periodKey("day", now), "2026-08-17");
  assert.equal(periodKey("month", now), "2026-08");
  assert.equal(periodKey("total", now), "total");
  assert.ok(/^2026-W\d{2}$/.test(periodKey("week", now)));
});

test("resetIfNeeded resets when the period rolls over", () => {
  const q = newQuota("day", 1000, Date.UTC(2026, 7, 17, 10, 0, 0));
  q.used = 500;
  resetIfNeeded(q, Date.UTC(2026, 7, 18, 0, 0, 0));
  assert.equal(q.used, 0);
  assert.equal(q.periodKey, "2026-08-18");
});

test("applyTokens accumulates and flags exceed", () => {
  const q = newQuota("day", 100, Date.UTC(2026, 7, 17, 10, 0, 0));
  const r1 = applyTokens(q, 60, Date.UTC(2026, 7, 17, 11, 0, 0));
  assert.equal(r1.exceeded, false);
  assert.equal(r1.remaining, 40);
  const r2 = applyTokens(q, 50, Date.UTC(2026, 7, 17, 12, 0, 0));
  assert.equal(r2.exceeded, true);
  assert.equal(r2.remaining, 0);
});

test("limit 0 means unlimited", () => {
  const q = newQuota("day", 0, Date.now());
```

</details>

**依据 8 · 源码核查**：[test/audit.test.mjs:1-36](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/test/audit.test.mjs#L1-L36)

JSONL纯函数。

<details>
<summary>查看原文（36行）</summary>

```text
import { test } from "node:test";
import assert from "node:assert/strict";
import { auditEntry, serializeEntry, parseLog, queryLog, summarize } from "../lib/audit.js";

test("auditEntry normalizes fields", () => {
  const e = auditEntry({ agent: "a", workspace: "/w", tool: "read", decision: "deny", reason: "policy r1" });
  assert.equal(e.decision, "deny");
  assert.ok(e.ts > 0);
  assert.equal(e.meta, null);
});

test("serialize/parse roundtrip preserves entries", () => {
  const entries = [
    auditEntry({ agent: "a", tool: "read", decision: "allow" }),
    auditEntry({ agent: "b", tool: "pwsh_run", decision: "deny", reason: "guard" }),
  ];
  const text = entries.map(serializeEntry).join("\n");
  const parsed = parseLog(text);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[1].decision, "deny");
});

test("parseLog skips malformed lines", () => {
  const parsed = parseLog("not json\n{\"ts\": 1}\n");
  assert.equal(parsed.length, 1);
});

test("queryLog filters, sorts newest first, and pages", () => {
  const entries = [
    { ts: 1, agent: "a", tool: "read", decision: "allow" },
    { ts: 2, agent: "b", tool: "pwsh_run", decision: "deny" },
    { ts: 3, agent: "a", tool: "read", decision: "deny" },
  ];
  const out = queryLog(entries, { agent: "a", limit: 1 });
  assert.equal(out.length, 1);
  assert.equal(out[0].ts, 3);
```

</details>

**依据 9 · 源码核查**：[lib/index.js:249-251](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L249-L251)

audit_export返回完整entries而非生成文件。

```text
      if (action === "audit_export") {
        const path = join(config.root, "audit.jsonl");
        return { action, ok: true, message: "audit log at " + path, data: { path, events: readAudit(config.root).length } };
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何启动和衡量三阶段成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

硬需tools/systemPrompt/agents/tokenMeter，包peers指rc6系列与Cordis/schemastery。根默认dshHomePath(gov)，可配其他host路径，需文件权限/备份；没有Web UI/用户命令/Skill，gov是一个模型工具，提示section只是其使用说明。安装后维护者必须先解决谁可改全局策略和日志目录可写范围，不能让模型“随时管理权限”替代管理员设置。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH工具/Agent/tokenMeter服务、host治理JSON和日志目录 | 定义受控工具/主体/工作区与管理权限、预算口径，工时未知 | 无独立云服务调用；宿主ABI及真正管理边界需核 |
| 持续使用 | 每工具同步日志append、每步计量/状态写入、查询全日志内存 | 审阅策略/异常日志和计量差异，维护规则与文件备份 | token值不等货币账单；无日志轮转/存储总限，净工时未知 |
| 失败恢复 | 原策略/额度/日志备份及宿主恢复资源 | 核静默持久失败/坏文件、恢复误改规则、对照真实用量 | 审计不防篡改/失败不阻断，无完整交易回滚；金额工时未知 |

若defaultLimit未正数且无持久quota，后设额度需重载才接计量，这是首次配置/恢复的真实步骤成本。相对独立hook组合可少代码接线，按正确阻止/解释政策与可追溯事件衡量，而非规则数/日志行数。没有企业流程/误拦率/漏审率/成本节省对照，金额/工时未知，不把本地无联网称整体免费或合规认证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:44-54](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/package.json#L44-L54)

宿主peers。

<details>
<summary>查看原文（11行）</summary>

```text
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-agent": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-home-paths": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-llm": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-system-prompt": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-token-meter": "^0.1.0-rc.6",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.6",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
```

</details>

**依据 2 · 源码核查**：[lib/index.js:25-39](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L25-L39)

硬服务/配置。

<details>
<summary>查看原文（15行）</summary>

```text
/** Services this plugin must resolve before it applies. */
const inject = ["tools", "systemPrompt", "agents", "tokenMeter"];

/** Composition-row configuration. */
const Config = z.object({
  /** Governance data root (policy state + audit logs). Defaults to $DSH_HOME/gov. */
  root: z.string().default(dshHomePath("gov")),
  /** Default quota period for new quotas. */
  defaultPeriod: z.string().default("day"),
  /** Default token limit (0 = unlimited). */
  defaultLimit: z.number().default(0),
  /** Inject a warning into the model context when a quota is exceeded. */
  prestepWarn: z.boolean().default(true),
  /** Prompt section order (ascending; persona is 0). */
  sectionOrder: z.number().default(5),
```

</details>

**依据 3 · 源码核查**：[lib/index.js:137-142](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L137-L142)

启动时计量条件。

```text
  if (config.defaultLimit > 0 || Object.keys(state.quotas).length > 0) {
    ctx.on("agent/pre-step", async (payload, next) => {
      const decision = await next();
      if (decision.kind === "reject") return decision;
      const { agent } = payload;
      let tokens = 0;
```

**依据 4 · 源码核查**：[lib/index.js:299-305](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L299-L305)

提示段。

```text

  ctx.effect(() => ctx.systemPrompt.section({
    name: "gov:instructions",
    order: config.sectionOrder,
    text: GOV_SECTION_TEXT,
  }), "gov.section()");
}
```

#### 缺口

- 目标组织管理员权限、审计留存/容量要求与规则维护误拦/漏拦成本
  **影响**：无法把企业配套定位当合规适配结论，也不能量化净维护收益
  **进一步探讨**：按实际治理职责定义策略管理员/执行者/审计者，再核固定宿主和持久失败恢复过程

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用结论及可证伪方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议观察。纯规则模型与统一观察入口有价值，但模型拥有同一全局管理面、quota只是可跳过提醒、启动条件/global键和计量口径存在具体限制，静默丢审计/坏配置回allow不能满足强治理目标。这些是源码行为，不是普通没冒烟导致降级。继续探讨可从受信单用户的辅助诊断/提示用途入手，把真正权限、费用上限和审计留存放在宿主受权边界，不把本项alone当企业硬控或账单来源。

未来可推“管理员签发的版本化政策与计量收据”。参照当前模型可改全局JSON，分离管理员写策略/预算与Agent只读解释，策略保存CAS并原子切换、解析失败保最后有效版，gate返回policyVersion/ruleID/callID；计量用宿主明确usage delta/账期与reservation，若超硬预算则由不可绕过执行面拒绝；audit带序列/相关ID和外部受保护append，持久失败显式呈现。最小反例用Agent高priority allow、跨主体删规则、quota_set在启动后、global/agent错键、相同累计重复measure、坏JSON/磁盘只读与并发调用。若仍可自改政策、审计缺口隐匿或预算值与真实usage无解释差异，则否定治理假设；若新增管理工时高于减少的错误/恢复，则否定经济性。未验证，不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:209-238](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L209-L238)

管理权限基线。

<details>
<summary>查看原文（30行）</summary>

```text
      render: (_args, value) => {
        const lines = [value.action + (value.ok ? " ok" : " failed") + ": " + value.message];
        if (value.data) lines.push(JSON.stringify(value.data, null, 1).slice(0, 4000));
        return [{ type: "text", text: lines.join("\n") }];
      },
    },
    execute: async (args) => {
      const { action } = args;
      if (action === "policy_add") {
        if (!ACTIONS.includes(args.policyAction)) throw new Error('gov: policy_add requires policyAction in ["allow","deny","ask"]');
        state.seq += 1;
        const rule = {
          id: "r" + state.seq,
          tool: args.tool,
          agents: args.agent ? [args.agent] : void 0,
          workspaces: args.workspace ? [args.workspace] : void 0,
          action: args.policyAction,
          reason: args.reason ?? "",
          priority: args.priority ?? 0,
        };
        if (validateRules([rule]).length > 0) throw new Error("gov: invalid rule");
        state.rules.push(rule);
        saveState(config.root, state);
        return { action, ok: true, message: "rule added: " + rule.id + " (" + rule.action + " on " + (rule.tool ?? "*") + ")", data: { rule } };
      }
      if (action === "policy_remove") {
        const before = state.rules.length;
        state.rules = state.rules.filter((r) => r.id !== args.id);
        if (state.rules.length === before) throw new Error('gov: no rule with id "' + args.id + '"');
        saveState(config.root, state);
```

</details>

**依据 2 · 源码核查**：[lib/index.js:139-179](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L139-L179)

计量基线。

<details>
<summary>查看原文（41行）</summary>

```text
      const decision = await next();
      if (decision.kind === "reject") return decision;
      const { agent } = payload;
      let tokens = 0;
      let exceeded = false;
      try {
        const measurement = ctx.tokenMeter.measure(agent.session);
        tokens = measurement.totalTokens || 0;
        const quota = state.quotas[agent.id] ?? (state.quotas[agent.id] = newQuota(config.defaultPeriod, config.defaultLimit));
        const r = applyTokens(quota, tokens, Date.now());
        exceeded = r.exceeded;
        saveState(config.root, state);
      } catch {
        return decision; // metering unavailable: never block on it
      }
      appendAudit(config.root, auditEntry({
        agent: agent.id,
        workspace: agent.session?.header?.cwd,
        tool: "(step)",
        decision: exceeded ? "ask" : "ok",
        meta: { gate: "quota", tokens, used: state.quotas[agent.id]?.used ?? tokens },
      }));
      if (exceeded && config.prestepWarn) {
        const text = "dsh-gov quota warning: agent " + agent.id + " exceeded its " + state.quotas[agent.id].period + " token budget (used " + state.quotas[agent.id].used + " of " + state.quotas[agent.id].limit + "). Stop token-heavy work or ask the user to raise the quota via gov quota_set.";
        return {
          kind: "enter",
          messages: decision.messages.concat([createUserMessage({
            content: [{ type: "text", text }],
            source: { kind: "plugin", plugin: name, form: "snapshot", sections: [{ name: "gov:quota", text }] },
          })]),
        };
      }
      return decision;
    }, { prepend: true });
  }

  // 4) the model-facing governance tool
  ctx.tools.register(defineTool({
    name: "gov",
    description: "Agent governance suite: policy-based tool gating (allow/deny/ask), structured audit trail, and per-agent token quotas. Actions: status, policy_list, policy_add, policy_remove, audit_query, audit_export, quota_get, quota_set, quota_reset. Use for permissions, compliance, audit, and cost control questions.",
    parameters: {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:52-77](https://github.com/863683348/dsh-gov/blob/bb061250a1dcead15edc202b4666c7d54f36da4a/lib/index.js#L52-L77)

持久失败基线。

<details>
<summary>查看原文（26行）</summary>

```text
 */
function loadState(root) {
  try {
    return JSON.parse(readFileSync(join(root, "gov.json"), "utf8"));
  } catch {
    return { rules: [], quotas: {}, seq: 0 };
  }
}

/** Persist state. */
function saveState(root, state) {
  try {
    mkdirSync(root, { recursive: true });
    writeFileSync(join(root, "gov.json"), JSON.stringify(state, null, 1));
  } catch {
    /* state persistence is best-effort; never crash the agent over it */
  }
}

/** Append one line to the JSONL audit log. */
function appendAudit(root, entry) {
  try {
    mkdirSync(root, { recursive: true });
    appendFileSync(join(root, "audit.jsonl"), serializeEntry(entry) + "\n", "utf8");
  } catch {
    /* audit persistence is best-effort */
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
