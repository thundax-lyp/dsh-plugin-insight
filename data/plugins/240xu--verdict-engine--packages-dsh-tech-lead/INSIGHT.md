# @240xu/dsh-tech-lead

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[c7e23f9](https://github.com/240xu/verdict-engine/tree/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/240xu/verdict-engine)
<!-- END META -->

> **实现功能**：面向 DSH 的旧版只读工程治理工具集，对调用方提交的结构化事实做分级、审计、Gate 与变更预览。

> **核心亮点**：将工程治理规则变为可反复调用的只读函数，辅助发现已提供材料的不一致。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：调用方控制事实与身份，空分类输入默认 T0；旧式裸结果超过 500 条静默截断。Gate 的 pass 不是实际授权或独立评审。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 它替哪些工程治理判断提供机械检查？](#detail-section-11)
  - [Q02 · 分级与 Gate 的判据如何工作，有哪些信任边界？](#detail-section-12)
  - [Q03 · 只读和输出协议的保障是否完整？](#detail-section-13)
  - [Q04 · 何时采用此组件，如何避免误用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 工程代理希望对状态、证据、计划和评审材料做重复、可复核的规则检查。

人工阅读 Skill、状态与证据清单；组件把部分判断规则函数化，仍依赖人工事实收集。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 分级/Gate | 重复规则检查 | 调用方自报事实 |
| 审计 | 发现已输入材料问题 | 不读取真实工程 |
| 预览 | 说明拟议变更 | 不执行也不保证安全 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH tools 宿主 | 注册工具 | 无法调用 |
| 真实结构化状态/计划/证据 | 判据输入 | pass 失去意义 |
| 独立评审与锚点核验 | 高风险 Gate | 自报身份可能冒充 |

#### 审慎使用

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 确认 | 先核包是否仍适用 | 与宿主版本兼容 |
| 输入 | 从原始材料填 JSON | 锚点可追踪 |
| 运行 | 只读工具逐项检查 | 错误/截断显式看见 |
| 复核 | 人工对账 pass | 不把自报结果当授权 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 首次 | DSH/Cordis 工具兼容与 JSON 输入 | 旧包可能弃用 |
| 每次 | 整理状态、证据、评审身份与锚点 | 事实不由插件核验 |
| 复核 | 核对 pass 与完整发现数 | 裸数组可能截断 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 分级/Gate | 纯函数规则 | 输入真实性 |
| 变更预览 | 不执行写操作 | 真正修改安全性 |
| 输出裁剪 | 设上限避免膨胀 | 消费端能否发现 legacy 截断 |

> **思考**：调用方控制事实与身份，空分类输入默认 T0；旧式裸结果超过 500 条静默截断。Gate 的 pass 不是实际授权或独立评审。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将工程治理规则变为可反复调用的只读函数，辅助发现已提供材料的不一致。详见[Q01](#research-q01)、[Q02](#research-q02)。

将工程治理规则变为可反复调用的只读函数，辅助发现已提供材料的不一致。详见[Q01](#research-q01)、[Q02](#research-q02)。

工具入口只计算来参；mutation 仅预览。协议渲染对信封提示截断，对旧裸数组静默截断。无文件/进程/网络读写。

<a id="detail-section-5"></a>

### 1.4 主要限制

调用方控制事实与身份，空分类输入默认 T0；旧式裸结果超过 500 条静默截断。Gate 的 pass 不是实际授权或独立评审。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

现有旧包用户可用于辅助 lint；新部署先比较 dsh-themis。高风险审批需真人与原始证据对账。详见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持只读规则计算；输入真实性、评审身份和锚点不由插件核验，legacy 裸数组截断还有完整性缺口。

- 已检查：作者 README、包清单、源码路径 README.md、packages/dsh-tech-lead/package.json、packages/dsh-tech-lead/src/index.js、packages/dsh-tech-lead/src/tools.js、packages/dsh-tech-lead/src/core/classify.js、packages/dsh-tech-lead/src/core/gate.js、packages/dsh-tech-lead/src/core/gates.js、packages/dsh-tech-lead/src/core/mutation.js、packages/dsh-tech-lead/src/protocol.js 及固定范围 inventory；组件：packages/dsh-tech-lead。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只审固定提交的 packages/dsh-tech-lead 组件及根 README 的产品定位；未运行目标插件/宿主或执行治理动作。
- 下一步：对空输入、伪造锚点、身份重叠、超过 500 发现的旧工具以及真实宿主注册进行隔离验证；比较新 dsh-themis。

**分析版本**

- **仓库**：[240xu/verdict-engine](https://github.com/240xu/verdict-engine)
- **版本号**：1.0.0（[固定提交 c7e23f9](https://github.com/240xu/verdict-engine/tree/c7e23f9e131694af6dbd9f3ed11301602a514864)）
- **版本日期**：2026-09-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对缺失高风险输入 fail-closed、所有输出加完整性元数据，并接入锚点/身份对账后才能进一步承担强治理角色；现版未实现。详见[Q04](#research-q04)。

对空输入、伪造锚点、身份重叠、超过 500 发现的旧工具以及真实宿主注册进行隔离验证；比较新 dsh-themis。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 26 | 1711 | 1479 | 140 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/240xu/verdict-engine/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/240xu/verdict-engine/issues?q=is%3Aissue+created%3A2026-09-22T05%3A47%3A18.886Z..2026-10-22T05%3A47%3A18.886Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/240xu/verdict-engine/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A47%3A18.886Z..2026-10-22T05%3A47%3A18.886Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实此旧版 dsh-tech-lead 组件的只读治理工具边界、输出语义与较新项目产品定位的差异。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它替哪些工程治理判断提供机械检查？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

组件通过 Cordis 注册一组只读工具，覆盖任务分级、状态/计划/证据检查、Gate、发布和安装审计、上下文与进度分析以及变更预览。调用者需要自己把真实工程事实序列化成 JSON 或 CSV 提供；工具没有读取仓库或验证外部证据的通路。因此它把规则判断转成可重复的函数，但“pass”仅表示所给输入满足规则，不是实际项目已经安全或真实评审已发生。仓库根 README 表示当前主线已转为 dsh-themis，旧 dsh-tech-lead 拆分/组件已弃用；本条只评估固定提交中该路径。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tech-lead/src/index.js:1-33](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/index.js#L1-L33)

apply 注册工具，注释声明仅计算调用方 JSON，无文件/子进程/网络。

<details>
<summary>查看原文（33行）</summary>

```text
import { defineTool } from '@deepseek-ai/dsh-tools';
import {
  classify, validateState, transitionCheck,
  evidenceLint, planLint, gatePrecheck,
  releaseAudit, installAudit, resumeCard,
  getCapabilities,
  validateContext, evidenceGraphLint, evidenceFreshness,
  progressDecide, criticalPath, changeImpact,
  gatePlan, gateAggregate, gateReopen, previewMutation,
} from './core/index.js';
import { registerTools } from './tools.js';

export const name = 'tech-lead-tools';
export const inject = ['tools'];
export { getCapabilities };

/**
 * Registers the read-only tech-lead tool surface. Every tool computes over
 * caller-supplied JSON — no filesystem writes, no subprocesses, no network.
 * @param {import('@deepseek-ai/cordis').Context} ctx
 */
export function apply(ctx) {
  for (const tool of registerTools(defineTool, {
    classify, validateState, transitionCheck,
    evidenceLint, planLint, gatePrecheck,
    releaseAudit, installAudit, resumeCard,
    validateContext, evidenceGraphLint, evidenceFreshness,
    progressDecide, criticalPath, changeImpact,
    gatePlan, gateAggregate, gateReopen, previewMutation,
  })) {
    ctx.tools.register(tool);
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tech-lead/src/tools.js:22-112](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/tools.js#L22-L112)

工具以 JSON 字符串/CSV 参数调用纯函数。

<details>
<summary>查看原文（91行）</summary>

```text
export function registerTools(defineTool, core) {
  const json = (str) => {
    try {
      return { ok: true, value: JSON.parse(str) };
    } catch (err) {
      return { ok: false, error: 'invalid JSON: ' + err.message };
    }
  };
  const csv = (str) =>
    String(str ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const out = (value) => renderEnvelope(value);

  /** @type {ReturnType<defineTool>[]} */
  const tools = [];

  tools.push(defineTool({
    name: 'tech_lead_classify',
    description:
      'Classify a task into tech-lead tiers T0/T1/T2 with reasons. T2 involves multi-module work, irreversible ops, protected assets (user data/secrets/runtime), or public interfaces. Use before planning.',
    parameters: {
      touchesMultipleModules: { type: 'boolean', description: 'change spans ≥2 modules' },
      estimatedDays: { type: 'number', description: 'rough duration in days' },
      irreversibleOps: { type: 'string', description: 'comma-separated irreversible operations' },
      protectedAssetTypes: { type: 'string', description: 'comma-separated among SOURCE,USER_DATA,CONFIG,SECRET,RUNTIME,GENERATED' },
      publicInterfaceChange: { type: 'boolean', description: 'changes public API/contract' },
      uncertainRisk: { type: 'boolean', description: 'risk level cannot be determined yet' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args) {
      const provided = [args.touchesMultipleModules, args.estimatedDays, args.irreversibleOps, args.protectedAssetTypes, args.publicInterfaceChange, args.uncertainRisk];
      const input = provided.every((v) => v === undefined || v === '')
        ? {}
        : {
            touchesMultipleModules: args.touchesMultipleModules,
            estimatedDays: args.estimatedDays,
            irreversibleOps: csv(args.irreversibleOps),
            protectedAssetTypes: csv(args.protectedAssetTypes),
            publicInterfaceChange: args.publicInterfaceChange,
            uncertainRisk: args.uncertainRisk,
          };
      return out(core.classify(input));
    },
  }));

  tools.push(defineTool({
    name: 'tech_lead_state_validate',
    description:
      'Validate a tech-lead project state.json (schema v1): enum fields, non-empty anchors on done items, full evidence provenance (id/level E0-E4/source/time/scope/repro). Unknown fields preserved as warnings. Returns pretty-printed JSON string.',
    parameters: {
      stateJson: { type: 'string', required: true, description: 'state.json SERIALIZED AS A STRING — pass the JSON text itself, never a nested object' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args) {
      const parsed = json(args.stateJson);
      if (!parsed.ok) return out({ valid: false, errors: [{ path: 'stateJson', message: parsed.error }], warnings: [], unknownFields: [] });
      return out(core.validateState(parsed.value));
    },
  }));

  tools.push(defineTool({
    name: 'tech_lead_transition_check',
    description:
      'Check whether a proposed outcome transition (CONTINUE/PAUSE/SCOPE-DOWN/PIVOT/STOP) is mechanically justified by the given state. PIVOT needs recorded decisions; SCOPE-DOWN needs goal ledger + risks; STOP needs anchored done items or degraded_reason. Returns pretty-printed JSON string.',
    parameters: {
      stateJson: { type: 'string', required: true, description: 'current state object SERIALIZED AS A STRING (JSON text, not an object)' },
      proposed: { type: 'string', required: true, description: 'one of CONTINUE,PAUSE,SCOPE-DOWN,PIVOT,STOP' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args) {
      const parsed = json(args.stateJson);
      if (!parsed.ok) return out({ allowed: false, reason: parsed.error });
      return out(core.transitionCheck(parsed.value, args.proposed));
    },
  }));

  tools.push(defineTool({
    name: 'tech_lead_plan_lint',
    description:
      'Lint a plan for the tech-lead minimum contracts: goal+metric+target ledger, assumption verification methods, decision alternatives+reasons, risk impacts+mitigations, dependency blockers, rollback for irreversible ops. Returns pretty-printed JSON array of findings.',
    parameters: {
      planJson: { type: 'string', required: true, description: 'plan object SERIALIZED AS A STRING (JSON text, not an object)' },
    },
    output: { schema: { type: 'string' }, render: (_a, v) => [{ type: 'text', text: v }] },
    async execute(args) {
      const parsed = json(args.planJson);
      if (!parsed.ok) return out([{ severity: 'error', path: 'planJson', message: parsed.error }]);
      return out(core.planLint(parsed.value));
    },
  }));

  tools.push(defineTool({
```

</details>

**依据 3 · 作者声明**：[README.md:84-101](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/README.md#L84-L101)

仓库作者指出主线 dsh-themis 与旧包弃用关系。

<details>
<summary>查看原文（18行）</summary>

````text
```

单包注册 24 个入口：23 个只读治理工具（原九项审计＋上下文校验、证据图/新鲜度分析、推进决策、关键路径/影响分析、续跑对账、Gate 计划/聚合/重开、变更预览、会话退出五条件检查、循环 tick 判定）＋能力发现工具 `tech_lead_capabilities`（只列出本包实际注册的工具）。仅对调用方传入的 JSON 做计算——无文件写入、无子进程、无网络访问。旧拆分包（`dsh-tech-lead-{core,plugin,bundle}`）已弃用并指向本包。源码安装：`node scripts/build-market-package.mjs` 装配后 `dsh plugin add packages/dsh-themis`。根 npm 包只发布技能与安装器。

**两个产物，同一套规范：** `nomos-skill`（Verdict Engine 纯文本版）是保守、广泛兼容的纯文本规范——装进任何 agent 环境（opencode/Claude Code/Codex）即可，无其他依赖。**`dsh-themis` 是 DSH 插件专项优化版**：同样的判断层外加机器可校验的只读运行时——全部 22 工具在 schema 中声明 `protocolJson`（legacy 默认裸形态、显式请求 v1/v2 信封、未知取值 fail-closed）、state→context-v2 单向投影（身份与来源永不虚构）、strict/compat 输入兼容模式，以及稳定的 v2 信封（`findings`/`guidance`/`meta.complete`/`meta.outputProtocol`）。

```bash
dsh plugin --profile headless add /path/to/tech-lead-skill/packages/dsh-themis
dsh --profile headless --dump-config   # 确认 tech-lead-tools 行已注入
```


输出家族与限制：

- 十二个强化工具返回 `tech-lead.result.v1` 信封（判别字段：`meta.schema`）；原有九个工具为向后兼容保留裸领域形状。
- 渲染输出有上限：finding/error 数组每字段最多 500 条并附 `FINDINGS_TRUNCATED` 警告；超限调用方回显数组折叠为 `{truncated,total}` 摘要；超过 256KB 自动切换紧凑序列化。

架构与权限矩阵见 [spec](https://github.com/240xu/verdict-engine/blob/main/docs/superpowers/specs/2026-08-25-dsh-tech-lead-system.md)。
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 分级与 Gate 的判据如何工作，有哪些信任边界？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

classify 把多模块、不可逆操作、敏感资产或公共接口变动归 T2，工期和不确定性可继续升级；但无任何输入时默认 T0。gatePrecheck 检查提案/执行/评审 ID 重叠、报告锚点和盲审人数，gateAggregate 按角色/锚点/结论聚合。所有身份、锚点和 verdict 都由调用者提供；函数没有读取 Git、验证锚点存在或核实评审人实际独立。因此空/伪造输入可能得到形式上通过，不能当授权机制。它的价值在于发现已输入材料中的不一致。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tech-lead/src/core/classify.js:16-66](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/classify.js#L16-L66)

分级规则及无输入默认 T0。

<details>
<summary>查看原文（51行）</summary>

```text
  const reasons = [];
  let tier = 'T0';
  const provided = ['touchesMultipleModules', 'estimatedDays', 'irreversibleOps', 'protectedAssetTypes', 'publicInterfaceChange', 'uncertainRisk'];
  if (provided.every((key) => input[key] === undefined)) {
    reasons.unshift('no classification inputs provided; defaulting to T0');
  }

  const t2 =
    input.touchesMultipleModules === true ||
    (Array.isArray(input.irreversibleOps) && input.irreversibleOps.length > 0) ||
    (Array.isArray(input.protectedAssetTypes) &&
      input.protectedAssetTypes.some((t) =>
        ['USER_DATA', 'SECRET', 'RUNTIME'].includes(t)
      )) ||
    input.publicInterfaceChange === true;

  if (input.touchesMultipleModules === true) reasons.push('multi-module change → T2');
  if (Array.isArray(input.irreversibleOps) && input.irreversibleOps.length) {
    reasons.push(`irreversible ops (${input.irreversibleOps.slice(0, 10).join(', ')}${input.irreversibleOps.length > 10 ? ' …' : ''}) → T2`);
  }
  if (Array.isArray(input.protectedAssetTypes)) {
    for (const t of input.protectedAssetTypes) {
      if (['USER_DATA', 'SECRET', 'RUNTIME'].includes(t)) {
        reasons.push(`protected asset ${t} → T2`);
      }
    }
  }
  if (input.publicInterfaceChange === true) reasons.push('public interface change → T2');

  const days = Number(input.estimatedDays) || 0;
  if (t2) {
    tier = 'T2';
  } else if (days >= 7) {
    tier = 'T2';
    reasons.push(`estimated ${days}d crosses a week boundary → T2`);
  } else if (days >= 1) {
    tier = 'T1';
    reasons.push(`estimated ${days}d single-module work → T1`);
  } else {
    reasons.push('trivial, single-file, discardable → T0');
  }

  let escalated = false;
  if (input.uncertainRisk === true && tier !== 'T2') {
    tier = tier === 'T0' ? 'T1' : 'T2';
    reasons.push('risk uncertain: escalated one tier');
    escalated = true;
  }

  return { tier, reasons, escalated };
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tech-lead/src/core/gate.js:16-79](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/gate.js#L16-L79)

Gate precheck 基于调用方 ID/报告字段检查。

<details>
<summary>查看原文（64行）</summary>

```text
 * @returns {{ pass: boolean, violations: Array<{type:string, detail:string}> }}
 */
export function gatePrecheck(input = {}) {
  if (input === null || typeof input !== 'object') {
    return { pass: false, violations: [{ type: 'BAD_INPUT', detail: 'gate precheck input must be an object' }] };
  }
  const reviewerIds = Array.isArray(input.reviewerIds) ? input.reviewerIds : [];
  const reports = Array.isArray(input.reports) ? input.reports : [];
  if (input.reports !== undefined && !Array.isArray(input.reports)) {
    // fall through with empty reports; violation recorded below for parity
  }
  /** @type {Array<{type:string, detail:string}>} */
  const v = [];

  if (input.proposalAuthorId && input.proposalAuthorId === input.executorId) {
    v.push({ type: 'PROPOSER_IS_EXECUTOR', detail: 'referee separation requires proposalAuthorId != executorId' });
  }

  for (const who of ['proposalAuthorId', 'executorId']) {
    const id = input[who];
    if (id && reviewerIds.includes(id)) {
      v.push({ type: 'IDENTITY_OVERLAP', detail: `${who} "${id}" may not also review` });
    }
  }

  for (const [i, r] of reports.entries()) {
    if (r === null || typeof r !== 'object') {
      v.push({ type: 'BAD_REPORT', detail: `report[${i}] must be an object` });
      continue;
    }
    if (!VERDICTS.has(r.verdict)) {
      v.push({ type: 'BAD_VERDICT', detail: `report[${i}] verdict must be pass|conditional|reject` });
    }
    const anchors = Array.isArray(r.anchors) ? r.anchors.filter((a) => typeof a === 'string' && a.trim()) : [];
    if (anchors.length === 0) {
      v.push({ type: 'ANCHOR_MISSING', detail: `report[${i}] needs at least one file:line or command anchor` });
    }
  }

  const destructiveScope = Array.isArray(input.destructiveScope) ? input.destructiveScope : [];
  if (input.destructiveScope !== undefined && !Array.isArray(input.destructiveScope)) {
    v.push({ type: 'BAD_DESTRUCTIVE_SCOPE', detail: 'destructiveScope must be an array of strings when provided' });
  }
  if (input.solo && destructiveScope.length > 0) {
    v.push({
      type: 'SOLO_FORBIDDEN',
      detail: `solo:true cannot clear destructive scope (${destructiveScope.slice(0, 8).join(', ')}${destructiveScope.length > 8 ? ' …' : ''})`,
    });
  }

  if (input.blindRequired) {
    const distinctAnchored = new Set(
      reports
        .filter((r) => VERDICTS.has(r.verdict) &&
          Array.isArray(r.anchors) && r.anchors.some((a) => typeof a === 'string' && a.trim()))
        .map((r) => r.reviewerId)
    ).size;
    if (distinctAnchored < 3) {
      v.push({ type: 'BLIND_QUORUM', detail: `blind gate needs ≥3 distinct anchored reviewers, got ${distinctAnchored}` });
    }
  }

  return { pass: v.length === 0, violations: v };
}
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tech-lead/src/core/gates.js:18-68](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/gates.js#L18-L68)

Gate 聚合基于传入角色、锚点和结论。

<details>
<summary>查看原文（51行）</summary>

```text
export function gateAggregate(reports, plan = {}) {
  plan = object(plan) ? plan : {};
  const findings = [];
  const seen = new Set();
  const rolesSeen = new Set();
  const validReports = [];
  const rejects = [];
  const conditionals = [];
  list(reports).forEach((report, index) => {
    const collect = () => {
      for (const item of list(report.findings)) {
        const id = String(item?.id ?? `${report.role}:${item?.message ?? ''}`);
        if (!seen.has(id)) { seen.add(id); findings.push(item); }
      }
      if (report.verdict === 'reject') rejects.push(report);
      if (report.verdict === 'conditional') conditionals.push(report);
    };
    if (!object(report) || typeof report.role !== 'string' || !report.role || !Array.isArray(report.anchors) || report.anchors.length === 0) {
      findings.push({ code: 'INVALID_REPORT', path: `/reports/${index}`, message: 'report needs role and anchors' });
      return;
    }
    if (report.verdict !== 'pass' && report.verdict !== 'reject' && report.verdict !== 'conditional') {
      findings.push({ code: 'INVALID_VERDICT', path: `/reports/${index}/verdict`, message: 'invalid report verdict' });
      collect();
      return;
    }
    if (rolesSeen.has(report.role)) {
      findings.push({ code: 'DUPLICATE_ROLE', path: `/reports/${index}/role`, message: `duplicate reviewer role: ${report.role}` });
      collect();
      return;
    }
    if (!report.anchors.every((anchor) => typeof anchor === 'string' && anchor.trim().length > 0)) {
      findings.push({ code: 'INVALID_REPORT', path: `/reports/${index}/anchors`, message: 'anchors must be non-empty strings' });
      collect();
      return;
    }
    rolesSeen.add(report.role);
    validReports.push(report);
    collect();
  });
  const required = [...new Set(list(plan.requiredRoles).filter((role) => typeof role === 'string' && role))];
  const quorum = Number.isInteger(plan.quorum) && plan.quorum > 0 ? plan.quorum : required.length;
  if (!required.length || quorum > required.length) findings.push({ code: 'INVALID_PLAN', message: 'plan needs non-empty requiredRoles and a valid quorum' });
  const satisfiedRoles = new Set(validReports.map((report) => report.role));
  const missing = required.filter((role) => !satisfiedRoles.has(role));
  const pass = findings.length === 0 && missing.length === 0 && validReports.length >= quorum && rejects.length === 0 && conditionals.length === 0;
  const verdict = rejects.length ? 'reject' : pass ? 'pass' : 'conditional';
  return { pass, verdict, findings, missingRoles: missing, unresolved: missing.length > 0 || rejects.length > 0 || conditionals.length > 0 || findings.length > 0 };
}

export function gateReopen(previous = {}, current = {}) {
```

</details>

#### 缺口

- 输入事实与真实仓库/人员身份之间无校验。
  **影响**：机器通过可被误当成独立评审或真实风险解除。
  **进一步探讨**：将锚点与受控工作区/评审系统对账，人工复核高风险结论。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读和输出协议的保障是否完整？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

插件入口不调用文件系统、子进程或网络，mutation_preview 明确拒绝执行模式，只返回预期 diff 等数据。输出渲染对信封中的 finding/error 做 500 条上限并发警告，对回显数组和深度也裁剪；然而 legacy 的裸顶层数组超过 500 条时直接 slice，没有完整性标记，依赖完整发现集的消费者可能低估问题。协议注释也承认旧九工具仍用裸结构。不能仅凭包描述中的“21 tools”认定固定版精确工具数量和全部新协议语义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tech-lead/src/core/mutation.js:19-53](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/mutation.js#L19-L53)

变更预览仅允许 read-only-preview，未执行写入。

<details>
<summary>查看原文（35行）</summary>

```text

export function validateMutationIntent(raw) {
  const errors = [];
  if (!object(raw)) return { valid: false, errors: [{ path: '/', message: 'intent must be an object' }], warnings: [] };
  if (raw.schema !== 'tech-lead.mutation-intent.v1') errors.push({ path: '/schema', message: 'invalid schema' });
  if (raw.mode !== 'read-only-preview') errors.push({ path: '/mode', code: 'CAPABILITY_DENIED', message: 'only read-only-preview is available' });
  if (!list(raw.target).length) errors.push({ path: '/target', message: 'at least one target is required' });
  for (const [index, target] of list(raw.target).entries()) if (EXECUTABLE_OPERATIONS.has(target?.operation)) errors.push({ path: `/target/${index}/operation`, code: 'CAPABILITY_DENIED', message: 'executable target operations are unavailable' });
  if (!list(raw.expectedDiff).length) errors.push({ path: '/expectedDiff', message: 'expectedDiff is required' });
  if (!object(raw.recoveryPoint) || raw.recoveryPoint.required !== true) errors.push({ path: '/recoveryPoint', message: 'recovery point is required' });
  if (!list(raw.verification).length) errors.push({ path: '/verification', message: 'verification is required' });
  if (!object(raw.authorization) || raw.authorization.required !== true) errors.push({ path: '/authorization', message: 'authorization declaration is required' });
  return { valid: errors.length === 0, errors, warnings: [] };
}

export function previewMutation(raw) {
  if (!object(raw) || raw.mode !== 'read-only-preview') return errorEnvelope('mutation_preview', 'CAPABILITY_DENIED', [{ code: 'CAPABILITY_DENIED', message: 'mutation execution is not enabled' }]);
  const validation = validateMutationIntent(raw);
  if (!validation.valid) return errorEnvelope('mutation_preview', 'SCHEMA_INVALID', validation.errors, validation);
  const markers = [];
  for (const field of ['target', 'expectedDiff', 'verification', 'recoveryPoint', 'authorization']) scanMarkers(raw[field], `/${field}`, 0, markers);
  if (markers.length) return errorEnvelope('mutation_preview', 'CAPABILITY_DENIED', markers);
  try {
    return okEnvelope('mutation_preview', {
      execution: 'not performed',
      mode: 'read-only-preview',
      targets: clone(list(raw.target)),
      expectedDiff: clone(list(raw.expectedDiff)),
      verification: clone(list(raw.verification)),
      authorization: clone(raw.authorization),
    });
  } catch {
    return errorEnvelope('mutation_preview', 'SERIALIZATION_FAILED', [{ code: 'SERIALIZATION_FAILED', path: '/', message: 'intent payload is not serializable for preview' }]);
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tech-lead/src/protocol.js:27-91](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/protocol.js#L27-L91)

legacy 顶层数组截断无标记，信封和嵌套输出有裁剪。

<details>
<summary>查看原文（65行）</summary>

```text
const RESULT_ARRAY_LIMIT = 1000;
const WALK_DEPTH_LIMIT = 64;
const COMPACT_THRESHOLD = 262144;
const ECHO_KEYS = new Set(['evidence', 'targets', 'expectedDiff', 'verification', 'items']);

export function clampEnvelope(envelope) {
  if (Array.isArray(envelope)) return envelope.length > FINDINGS_LIMIT ? envelope.slice(0, FINDINGS_LIMIT) : envelope;
  if (envelope === null || typeof envelope !== 'object') return envelope;
  const out = { ...envelope };
  let truncatedTotal = 0;
  for (const field of ['errors', 'warnings']) {
    if (Array.isArray(out[field]) && out[field].length > FINDINGS_LIMIT) {
      truncatedTotal = Math.max(truncatedTotal, out[field].length);
      out[field] = out[field].slice(0, FINDINGS_LIMIT);
    }
  }
  if (truncatedTotal > 0) {
    out.warnings = [...(out.warnings ?? []), { code: 'FINDINGS_TRUNCATED', total: truncatedTotal, message: `output truncated to first ${FINDINGS_LIMIT} entries per findings field` }];
  }
  if (out.data !== null && typeof out.data === 'object') {
    out.data = clampNode(out.data, 0);
  }
  return out;
}

// Iterative walk with a hard depth cap: subtrees deeper than WALK_DEPTH_LIMIT are
// passed through untouched (native JSON serialization handles arbitrary depth),
// so hostile nesting can no longer turn the renderer into an INTERNAL error.
function clampNode(root, rootDepth) {
  const result = Array.isArray(root) ? [...root] : { ...root };
  const stack = [[result, rootDepth]];
  while (stack.length) {
    const [node, depth] = stack.pop();
    const entries = Object.keys(node);
    for (const key of entries) {
      const value = node[key];
      if (!value || typeof value !== 'object') continue;
      if (depth + 1 > WALK_DEPTH_LIMIT) {
        node[key] = { truncated: true, reason: 'DEPTH_LIMIT', depth: WALK_DEPTH_LIMIT };
        continue;
      }
      if (Array.isArray(value)) {
        if (ECHO_KEYS.has(key) && value.length > ECHO_LIMIT) {
          node[key] = { truncated: true, total: value.length };
        } else if (value.length > RESULT_ARRAY_LIMIT) {
          node[key] = value.slice(0, RESULT_ARRAY_LIMIT);
        } else {
          node[key] = [...value];
          stack.push([node[key], depth + 1]);
        }
      } else {
        node[key] = { ...value };
        stack.push([node[key], depth + 1]);
      }
    }
  }
  return result;
}

export function canonicalStringify(value) {
  return canonicalize(value, 0);
}

function canonicalize(value, depth) {
  if (depth > WALK_DEPTH_LIMIT) return null; // deep subtrees compare as equal; drift beyond the cap is unreported by design
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tech-lead/src/tools.js:7-17](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/tools.js#L7-L17)

源码注释明确旧工具裸输出与 500 条静默裁剪。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * Tool definitions for the tech-lead read-only surface.
 *
 * Every tool computes over caller-supplied primitives/JSON strings:
 * - composite inputs arrive as JSON strings (parsed defensively),
 * - list inputs arrive as comma-separated values,
 * - outputs are pretty-printed JSON strings (uniform string schema); malformed inputs yield structured BAD_INPUT/invalid results instead of throws.
 * - Legacy nine tools return BARE domain shapes (not wrapped in a tech-lead.result.v1 envelope); consumers can discriminate via the absence of meta.schema. Bare top-level finding arrays slice silently at 500 entries (shape preserved, no warning field exists).
 * - All rendered output is clamped: finding/error arrays are capped at 500 entries (FINDINGS_TRUNCATED warning appended), oversized caller-echo arrays collapse into {truncated,total}, and payloads above 256KB switch to compact serialization.
 *
 * No tool touches the filesystem, spawns processes, or performs network I/O.
```

</details>

#### 缺口

- 未用超过 500 项的真实输入在宿主端测输出。
  **影响**：具体工具渲染与消费端能否感知截断尚未实测。
  **进一步探讨**：构造超过上限的清单，比较 core/工具/宿主显示项数及完整性信号。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时采用此组件，如何避免误用？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

若已有 DSH 旧版本且需要对结构化状态、计划与评审输入做重复机械检查，可在只读条件下试用；先确认目标是否应迁移到仓库当前的 dsh-themis。使用者需维护 state/evidence schema、填真实锚点，调用后对源材料复核，特别是 Gate、发布和大量发现项。建议高风险场景默认缺失输入 fail-closed、所有裁剪输出标完整性标记，并接入可追溯的锚点验证；这是后续假设而非现版能力。衡量价值应看遗漏发现与复核时间，而不是工具输出“pass”次数。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:84-101](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/README.md#L84-L101)

作者声明较新 dsh-themis 和旧包定位。

<details>
<summary>查看原文（18行）</summary>

````text
```

单包注册 24 个入口：23 个只读治理工具（原九项审计＋上下文校验、证据图/新鲜度分析、推进决策、关键路径/影响分析、续跑对账、Gate 计划/聚合/重开、变更预览、会话退出五条件检查、循环 tick 判定）＋能力发现工具 `tech_lead_capabilities`（只列出本包实际注册的工具）。仅对调用方传入的 JSON 做计算——无文件写入、无子进程、无网络访问。旧拆分包（`dsh-tech-lead-{core,plugin,bundle}`）已弃用并指向本包。源码安装：`node scripts/build-market-package.mjs` 装配后 `dsh plugin add packages/dsh-themis`。根 npm 包只发布技能与安装器。

**两个产物，同一套规范：** `nomos-skill`（Verdict Engine 纯文本版）是保守、广泛兼容的纯文本规范——装进任何 agent 环境（opencode/Claude Code/Codex）即可，无其他依赖。**`dsh-themis` 是 DSH 插件专项优化版**：同样的判断层外加机器可校验的只读运行时——全部 22 工具在 schema 中声明 `protocolJson`（legacy 默认裸形态、显式请求 v1/v2 信封、未知取值 fail-closed）、state→context-v2 单向投影（身份与来源永不虚构）、strict/compat 输入兼容模式，以及稳定的 v2 信封（`findings`/`guidance`/`meta.complete`/`meta.outputProtocol`）。

```bash
dsh plugin --profile headless add /path/to/tech-lead-skill/packages/dsh-themis
dsh --profile headless --dump-config   # 确认 tech-lead-tools 行已注入
```


输出家族与限制：

- 十二个强化工具返回 `tech-lead.result.v1` 信封（判别字段：`meta.schema`）；原有九个工具为向后兼容保留裸领域形状。
- 渲染输出有上限：finding/error 数组每字段最多 500 条并附 `FINDINGS_TRUNCATED` 警告；超限调用方回显数组折叠为 `{truncated,total}` 摘要；超过 256KB 自动切换紧凑序列化。

架构与权限矩阵见 [spec](https://github.com/240xu/verdict-engine/blob/main/docs/superpowers/specs/2026-08-25-dsh-tech-lead-system.md)。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-tech-lead/src/core/classify.js:16-28](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/core/classify.js#L16-L28)

未传入分类字段时返回默认 T0。

<details>
<summary>查看原文（13行）</summary>

```text
  const reasons = [];
  let tier = 'T0';
  const provided = ['touchesMultipleModules', 'estimatedDays', 'irreversibleOps', 'protectedAssetTypes', 'publicInterfaceChange', 'uncertainRisk'];
  if (provided.every((key) => input[key] === undefined)) {
    reasons.unshift('no classification inputs provided; defaulting to T0');
  }

  const t2 =
    input.touchesMultipleModules === true ||
    (Array.isArray(input.irreversibleOps) && input.irreversibleOps.length > 0) ||
    (Array.isArray(input.protectedAssetTypes) &&
      input.protectedAssetTypes.some((t) =>
        ['USER_DATA', 'SECRET', 'RUNTIME'].includes(t)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tech-lead/src/protocol.js:27-36](https://github.com/240xu/verdict-engine/blob/c7e23f9e131694af6dbd9f3ed11301602a514864/packages/dsh-tech-lead/src/protocol.js#L27-L36)

裸数组静默裁剪路径。

<details>
<summary>查看原文（10行）</summary>

```text
const RESULT_ARRAY_LIMIT = 1000;
const WALK_DEPTH_LIMIT = 64;
const COMPACT_THRESHOLD = 262144;
const ECHO_KEYS = new Set(['evidence', 'targets', 'expectedDiff', 'verification', 'items']);

export function clampEnvelope(envelope) {
  if (Array.isArray(envelope)) return envelope.length > FINDINGS_LIMIT ? envelope.slice(0, FINDINGS_LIMIT) : envelope;
  if (envelope === null || typeof envelope !== 'object') return envelope;
  const out = { ...envelope };
  let truncatedTotal = 0;
```

</details>

#### 缺口

- 无真实项目对照、误放行率或采用成本数据。
  **影响**：无法量化相对文本 Skill/新 dsh-themis 的收益。
  **进一步探讨**：在相同工程案例中比较漏检、误检、复核用时和升级成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
