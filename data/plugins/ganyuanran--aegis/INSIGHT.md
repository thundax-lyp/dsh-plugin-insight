# Aegis Method Pack

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[0461c21](https://github.com/GanyuanRan/Aegis/tree/0461c211e4d812f0b215fab240a68a25c1e22424)

<!-- BEGIN META -->
[![GitHub ★ 1,386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GanyuanRan/Aegis)
<!-- END META -->

> **实现功能**：为编码 Agent 提供按需技能路由、基线读取、变更治理与完成证据流程，含 DSH 适配。

> **核心亮点**：把基线、风险路由与完成证据原则组织为按需Skill，并适配DSH生命周期，减少反复提醒属于有条件推断。见[Q01](#research-q01)。

> **风险与缺陷**：自动bootstrap在首个durable活动后才投递，依赖模型遵守；作者旧Codex基准不能当本版DSH的安全/完成保证。见[Q02](#research-q02)。

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
  - [Q01 · 方法包为谁改变基线和完成证据的流程？](#detail-section-11)
  - [Q02 · DSH如何发现技能并注入自动入口？](#detail-section-12)
  - [Q03 · 旧基准和生命周期成本如何限制本版采用结论？](#detail-section-13)
  - [Q04 · 什么试用与可证伪的流程简化有依据？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：有既有工程规则的开发者可用方法包辅助非平凡变更的基线对齐和完成核验。

项目AGENTS加手工基线/验证提醒为简单基线，auto和explicit分别比较，不用旧Codex数字替代。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 方法Skill发现 | 按需读取基线/调试/核验方法 | 模型遵守，未逐一执行所有Skill |
| 自动路由提示 | 生命周期后补入using-aegis | 首durable活动后注入，不是首写硬门禁 |
| explicit配置 | 停自动注入、保留显式调用 | 需配置及新会话核生效 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 匹配DSH skills/agents及peer包 | 必需 | 技能发现与事件注入 | 插件不能正确激活 |
| 正确profile管理者和Git来源 | 必需 | 可靠安装 | Desktop不以web替代 |
| Python doctor与配置 | 作者完整安装流程需要 | 核工作区支持和配置 | 不宣称安装完整 |
| 模型遵守与工程基线 | 效果必需 | 兑现方法流程 | 注入不是强制完成保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核profile所有者、固定Git和备份 | 原生插件启用、Skill发现 |
| 配置 | 用户按作者指南在方法包根doctor | 配置/工作区支持检查通过但还需入口核对 |
| 试用 | Agent处理非敏感中等变更 | 真实基线、恰当路由和当前完成证据 |
| 退出 | 用户切explicit或移除并新开会话 | 回项目AGENTS，核无额外注入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | Git包、DSH依赖与Python支持；金额未知 | 核profile、doctor配置及自动入口 | 发现文件不等于激活 |
| 持续使用 | 指南token、基线读取和工作材料 | 解释路由、验证完成；时间未知 | 快路径节省未测 |
| 失败恢复 | 配置/会话重载资源 | 切explicit/移除并新会话核注入 | 已注入上下文不会凭禁用自动消失 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 技能路由 | canonical目录与bootstrap | 首写前实际遵守 |
| 完成核验 | 指南要求当前证据和残余风险 | 当前版本合格率/返工 |
| 作者基准 | 旧2.7.6冻结记录 | 本版DSH/模型效果 |

> **思考**：自动bootstrap在首个durable活动后才投递，依赖模型遵守；作者旧Codex基准不能当本版DSH的安全/完成保证。见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把基线、风险路由与完成证据原则组织为按需Skill，并适配DSH生命周期，减少反复提醒属于有条件推断。见[Q01](#research-q01)。

把基线、风险路由与完成证据原则组织为按需Skill，并适配DSH生命周期，减少反复提醒属于有条件推断。见[Q01](#research-q01)。

薄适配复用宿主filesystem provider、epoch校验和卸载清理值得借鉴；路由合同是提示而非外部权限，迁移需实核事件顺序与消息source格式，见[Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动bootstrap在首个durable活动后才投递，依赖模型遵守；作者旧Codex基准不能当本版DSH的安全/完成保证。见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在单个中等任务核当前证据与实际路由，保留项目规则优先；流程过载就改explicit或退回原工作法。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

技能发现和提示注入有源码支持；不是工具硬门禁，旧基准不代表本版效果，最小路由评估为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、extensions/dsh/index.js、extensions/dsh/cordis.patch.yml、extensions/dsh/bootstrap.js、skills/using-aegis/SKILL.md、docs/README.deepseek-harness.md、benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本轮检查根包DSH薄适配、bootstrap、using-aegis路由及作者基准边界，不执行doctor/安装/目标测试或全部Skill。
- 下一步：固定提交、DSH、模型及同任务集，对比合格交付/返工、token与人工理解时间；单列发现、自动入口、遵守与结果四个层级。

**分析版本**

- **仓库**：[GanyuanRan/Aegis](https://github.com/GanyuanRan/Aegis)
- **版本号**：2.14.2（[固定提交 0461c21](https://github.com/GanyuanRan/Aegis/tree/0461c211e4d812f0b215fab240a68a25c1e22424)）
- **版本日期**：2026-10-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是比较auto、explicit与原AGENTS的最小指南路由，记录返工和总投入；自动模式仅增材料无改善则收窄。见[Q04](#research-q04)。

固定提交、DSH、模型及同任务集，对比合格交付/返工、token与人工理解时间；单列发现、自动入口、遵守与结果四个层级。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 136 | 31730 | — | — | 191504 |
| .js | source | 3 | 849 | 642 | 86 | — |
| .ts | source | 4 | 493 | 325 | 127 | — |
| .md | test | 37 | 1495 | — | — | 7667 |
| .md | example | 7 | 50 | — | — | 275 |
| .mjs | test | 3 | 539 | 442 | 51 | — |
| .js | example | 6 | 49 | 39 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=15&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查方法包的DSH自动入口、软性约束与证据流程及当前收益边界

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 方法包为谁改变基线和完成证据的流程？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是让Agent在已有工程做非平凡修改、常遇到忽略契约、过度设计或无证据声称完成的开发者。合格交付是实际完成用户范围、绑定当前基线与验证，并说清残余风险；单有计划文件或测试数不够。相对一段AGENTS原则，Aegis将路由、风险分级、基线读取、调试和完成核验组织为按需Skill，简单任务可快路径。贡献在方法的可复用组织与宿主入口适配，不是运行权限或新的验证算法。using-aegis明确用户/工程指令优先、测试只证明覆盖范围、不要额外审批或完整追踪模板，说明作者尝试限制流程本身膨胀。收益需对具体任务检验，不能从方法覆盖广就推断少返工。

#### 证据与依据

**依据 1 · 源码核查**：[skills/using-aegis/SKILL.md:17-37](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/skills/using-aegis/SKILL.md#L17-L37)

以用户结果、证据范围和最小必要流程约束完成

<details>
<summary>查看原文（21行）</summary>

```text

## Outcome Anchor

Understand the requested object, scope, actions, conditions, and deliverables
from the conversation. Complete the authorized task within business constraints
and deliver a usable, verifiable result. Project goals guide durable choices;
they do not override the user's current scope. Preserve outstanding intent
across follow-ups; clarify material ambiguity before dependent action and
continue independent authorized work. Do not repeat satisfied approvals.

Judge success by the requested outcome. Execution, parsing, tests, and
architecture alignment prove only their covered scope; tests of real acceptance
criteria can prove that outcome. Fix the problem class at its owner, preserving
neighboring behavior. Report delivered results and remaining gaps honestly;
partial work is not complete. These are decision principles, not a new artifact,
universal goal-framing route, or completion authority.

Preserve task fidelity through understanding, transformation, execution and
delivery: retain decision-relevant meaning and evidence status, checking both
omissions and unsupported additions. Authorized summaries, designs and
evidence-based corrections are valid. Use existing checkpoints and sufficient
```

</details>

**依据 2 · 源码核查**：[skills/using-aegis/SKILL.md:41-61](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/skills/using-aegis/SKILL.md#L41-L61)

按需路由、风险分级及简单任务快路径

<details>
<summary>查看原文（21行）</summary>

```text

1. User/project instructions outrank Aegis.
2. Load only the smallest explicitly requested or clearly relevant skill/reference;
   otherwise stay on the fast path. Compose `ui-ux-governance` for UI/UX effects;
   retain task ownership and scope.
3. Active codebase question/"what next": use the authority index and relevant
   README/ADR/rule/baseline sections, else a bounded index-first scan. Do not
   recursively read all linked docs. Non-trivial work passively use relevant
   `CONTEXT-MAP.md`/`CONTEXT.md`; model semantic conflicts only when found.
4. Primary routes: `grill me`/`grill this plan`/`审问我`/`盘问我`/`拷问我` -> `brainstorming` (literal/explanatory uses do not); `/aegis-goal` or `Aegis goal:` -> `goal-framing`. Bug, failure, regression, or unexpected behavior routes to `systematic-debugging`.
5. Implementation only: Classify before implementation. Low stays owner-local;
   Medium/high: baseline read-set + plan. Spec Brief or Design Spec only for
   ambiguous/contract/cross-module medium/high work. TDD: off=no auto route/load; auto=risk-based strict/light/skipped; explicit strict applies.
   Pure explanation and read-only diagnosis skip implementation/TDD/write gates.
6. For writes, the owner workflow surfaces Change Necessity, records
   `TaskStartSnapshot`, and decides `ArchitectureReviewRequired`; ceremony alone
   never creates a branch/worktree.
7. At the first substantive user-visible stage say why Aegis is shaping
   non-tiny work; do not wait for the user to ask. structured trace is only for audit/debug/release/long-task review/asked and does not route (`Trace Digest`).
8. Workspace support is lazy; use configured Aegis workspace support as needed.
   Q&A/status writes no files except authorized baseline bootstrap before
```

</details>

**依据 3 · 作者声明**：[README.md:37-67](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/README.md#L37-L67)

作者价值主张与旧版基准限制

<details>
<summary>查看原文（31行）</summary>

```text
    <a href="docs/current/AEGIS_FAST_TRACK_PLAYBOOK_ZH.md">速通秘籍</a>
</p>

> **Stop babysitting your agent.** Aegis makes your agent plan against your real
> baseline before it edits, prove completion with fresh evidence, and leave simple
> tasks alone — you get **fewer reworks, safer changes, and less blind trust in "done"**.

## What You Get

Aegis is a method pack that makes AI coding agents work like disciplined
engineers — so you don't have to watch them.

- **Fewer reworks.** Your agent aligns with your project's real baseline —
  owners, contracts, boundaries — before touching code. It stops guessing, and
  so do you.
- **Safer changes.** Measured on a frozen held-out A/B benchmark: contract
  pass rate **61.67% → 93.33%**, unsafe outcomes **13.33% → 0%**.
- **Proof before "done".** Completion claims ship with fresh verification
  evidence, covered scope, and residual risk. You read evidence, not vibes.
- **No ghost code.** Retired fallbacks and old paths are tracked or removed
  with a retirement trigger — technical debt stops accumulating silently.
- **Simple tasks stay simple.** Trivial requests stay on the fast path;
  ceremony only appears when the task genuinely needs it.
- **UI/UX rules on demand.** [UI/UX governance](skills/ui-ux-governance/SKILL.md)
  carries project design rules, lower user effort, and scoped experience evidence
  through design, implementation, review, and verification.
- **One method pack, every host.** The same discipline works across Codex,
  Claude Code, OpenCode, Kimi, and other skill-aware hosts.

> These numbers are bounded advisory evidence from Aegis 2.7.6 (2026-08-11),
> not a measurement of this release, a universal-quality claim, or completion authority.
```

</details>

#### 缺口

- 当前版在真实用户任务上的返工和审阅负担未知
  **影响**：不能把完整方法说明当作已验证用户收益
  **进一步探讨**：选同一工程真实变更，比较原AGENTS与方法包的合格交付、返工和人工理解时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH如何发现技能并注入自动入口？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

根包是private源码工程，但dsh.bundle指向专用patch；原生安装通过Git来源而非猜测npm身份。适配器注入skills/agents，复用官方filesystem provider，只指向包内canonical skills目录，不复制正文、不替换skill工具，也不添加运行权限。bootstrap读取用户配置，activation explicit时直接不注入；默认auto，TDD默认off。自动模式在agent创建或旧session-start时为稳定sessionId置pending，等首个durable tool/call或assistant/message后异步注入带plugin:aegis来源的用户消息；compaction/end重新武装，epoch及agent匹配防过时投递，卸载清timer和监听。这个时序特意保持首请求无注入，所以不能说首个工具调用前已有硬性路由门禁；消息中的路由合同靠模型遵守。本轮没见tools.guard式阻止动作，不能将“proof before done”描述为外部强制放行。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:11-29](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/extensions/dsh/index.js#L11-L29)

官方provider与bootstrap接线

<details>
<summary>查看原文（19行）</summary>

```text
import { fileURLToPath } from "node:url";
import { createUserMessage } from "@deepseek-ai/dsh-llm";
import { apply as applyFilesystemProvider } from "@deepseek-ai/dsh-skill-filesystem";
import { installBootstrap } from "./bootstrap.js";

const skillsRoot = fileURLToPath(new URL("../../skills/", import.meta.url));

export const name = "aegis-method-pack";
export const inject = ["skills", "agents"];

export function apply(ctx) {
  applyFilesystemProvider(ctx, {
    providerName: "aegis-method-pack",
    includeDefaultRoots: false,
    bundledSkillDir: skillsRoot,
    watch: false,
  });

  installBootstrap(ctx, { createUserMessage, skillsRoot });
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/bootstrap.js:25-40](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/extensions/dsh/bootstrap.js#L25-L40)

auto/explicit与TDD默认

<details>
<summary>查看原文（16行）</summary>

```text
export function readAegisConfig(homeDir = os.homedir()) {
  const envActivation = process.env.AEGIS_ACTIVATION_MODE;
  const configuredActivation = readConfigValue(homeDir, "activation_mode");
  const requestedActivation = envActivation ?? configuredActivation;
  const activationMode =
    requestedActivation === "auto" || requestedActivation === "explicit"
      ? requestedActivation
      : "auto";

  const envTdd = process.env.AEGIS_TDD_MODE;
  const configuredTdd = readConfigValue(homeDir, "tdd_mode");
  const requestedTdd = envTdd ?? configuredTdd;
  const tddMode =
    requestedTdd === "auto" || requestedTdd === "off" ? requestedTdd : "off";

  return { activationMode, tddMode };
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/bootstrap.js:85-108](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/extensions/dsh/bootstrap.js#L85-L108)

explicit不注入及首个durable事件后投递的设计

<details>
<summary>查看原文（24行）</summary>

```text
export function installBootstrap(
  ctx,
  { createUserMessage, skillsRoot, homeDir = os.homedir() },
) {
  const config = readAegisConfig(homeDir);
  if (config.activationMode === "explicit") return null;

  // Read and render synchronously during plugin apply so injection cannot race
  // the first model step on either supported DSH lifecycle event.
  const body = readUsingAegisBody(skillsRoot);
  const bootstrap = buildBootstrap(body, config);

  // Injecting at session start used to land the bootstrap in the session
  // inbox BEFORE the first model request, which polluted the sterile
  // first-request baseline that trajectory presets such as
  // dsh-anchored-standard (context gate) depend on. Deferral keeps that
  // request clean: every session lifecycle boundary only ARMS an injection, and
  // the bootstrap lands once the session emits its first durable promotion
  // signal (`tool/call` or `assistant/message`) — after the anchored first
  // request has already been assembled. `compaction/end` re-arms the
  // deferral because the first post-compaction request is itself a gated
  // "second first request". Sessions without a stable `session.id` cannot
  // be correlated with their events, so they are skipped rather than
  // injected blind.
```

</details>

**依据 4 · 源码核查**：[extensions/dsh/bootstrap.js:175-206](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/extensions/dsh/bootstrap.js#L175-L206)

事件触发、压缩重武装及卸载清理

<details>
<summary>查看原文（32行）</summary>

```text
  const disposeEvents = ctx.on("session/event", (session, event) => {
    const sessionId = session?.id;
    if (sessionId === undefined || !agents.has(sessionId)) return;
    if (event?.type === "compaction/end") {
      armDelivery(sessionId);
      return;
    }
    if (event?.type !== "tool/call" && event?.type !== "assistant/message") {
      return;
    }
    if (!pending.delete(sessionId)) return;
    const agent = agents.get(sessionId);
    const epoch = epochs.get(sessionId);
    const message = createBootstrapMessage(createUserMessage, bootstrap);
    deferDelivery(sessionId, agent, epoch, message);
  });

  return () => {
    disposed = true;
    for (const delivery of scheduledDeliveries.values()) {
      clearTimeout(delivery.timer);
    }
    scheduledDeliveries.clear();
    disposeLifecycle();
    disposeLegacyLifecycle();
    disposeAgents();
    disposeEvents();
    agents.clear();
    epochs.clear();
    pending.clear();
  };
}
```

</details>

#### 缺口

- 目标DSH事件时序及真实Skill调用未执行
  **影响**：不能确认首次写入前模型已收到或遵守方法约束
  **进一步探讨**：在临时会话记录首请求、首工具事件与注入顺序，并核auto/explicit及压缩后行为

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 旧基准和生命周期成本如何限制本版采用结论？

**研究主题**：缺陷与关键质疑、效果与总成本

#### 完整回答

README的61.67%到93.33%来自作者2.7.6旧版冻结A/B，不是当前2.14.2或DSH验收；文中明确评审并非独立人类、宿主事件没返回观察到的模型身份。现有sanitized JSON含120次valid结果与advisory边界，支持作者确实提供有范围的结果记录，但本轮不复算因果或把它外推新版本。首次需要正确profile管理者、Git来源、DSH依赖及Python doctor写配置/工作区支持；Desktop要通过应用管理，web/headless单独安装，不应混用兼容复制目录。持续有路由/指南上下文和基线阅读、证据整理、可能工作区材料维护，金额/耗时未知。简单任务快路径是意图而非已测开销保证。失败应先区分Skill发现、自动入口、配置和模型遵守，doctor通过只证明检查项；退出可切explicit或按profile移除，已注入会话需新开/重载核状态，不能以禁用包自动抹去历史上下文。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:65-96](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/README.md#L65-L96)

作者明确旧版基准与限制

<details>
<summary>查看原文（32行）</summary>

````text

> These numbers are bounded advisory evidence from Aegis 2.7.6 (2026-08-11),
> not a measurement of this release, a universal-quality claim, or completion authority.
> See [the full benchmark and its limitations](#measured-agentic-benchmark).

## Quick Install

New here? The fastest start is one prompt to your agent — the full
install-and-verify flow is below.

Give this prompt to your AI coding agent:

```text
Read https://github.com/GanyuanRan/Aegis, identify my current AI coding host, and install Aegis globally using the correct host guide. If the host is the official DeepSeek Harness (`dsh`), treat global/minimal installation as native profile-plugin installation with `dsh plugin --profile <profile> add "git+https://github.com/GanyuanRan/Aegis.git"`; do not silently substitute the direct-child compatibility path unless the plugin manager is unavailable and I explicitly approve compatibility mode. Restart or reload the host if needed, then run complete-install verification from the installed Aegis method-pack root. Do not run the doctor command from the target project directory. First locate `<aegis-method-pack-root>`, then run `cd <aegis-method-pack-root> && python scripts/aegis-doctor.py --write-config --json`. Treat the install as complete only if the JSON includes `"ok": true`, `"workspaceSupport": "available"`, and `"configStatus": "configured"`; if the host uses a separate skill discovery directory, also verify it with `--discovery-root <path>`; if the host guide declares a skill directory name prefix, also pass `--discovery-name-prefix <prefix>`. Also complete the selected host guide's native activation and automatic-entry checks; file discovery or a generic doctor result alone is not sufficient when the host provides a plugin, hook, or session-start bootstrap contract.
```

## Measured Agentic Benchmark

A frozen held-out A/B benchmark for Aegis 2.7.6 (2026-08-11) kept the Codex client, prompts, projects, tool policy, and requested the same `gpt-5.6-sol` / `xhigh` setting in both arms; only the Aegis projection differed. Across 120 valid runs on 20 cases,
contract pass rate was **61.67% → 93.33% (+31.67 pp)** and unsafe outcomes were **13.33% → 0%**. The 95% case-cluster interval was **+15.00 pp to +50.00 pp**. This is bounded advisory evidence; review was arm-hidden technical review, not independent human review, and host events did not return the observed model identity.

![Aegis agentic benchmark: with and without Aegis](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.svg)

[Sanitized JSON](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json) · [English table](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.en.md) · [中文表格](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.zh-CN.md) · [Methodology](docs/current/AEGIS_AGENTIC_BENCHMARK_BASELINE.md)

A newer [matrix-v7 standard snapshot for Aegis 2.10.8](benchmarks/results/gpt-5-6-sol-xhigh-standard-20260925-v2-10-8.en.md)
covers 22 cases with one observation per arm and case. It uses a different run
profile from the extended snapshot above and does not measure the changes in
this release.

## Try Aegis Methods in a Coding Runtime

````

</details>

**依据 2 · 源码核查**：[benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json:1-13](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json#L1-L13)

120valid结果及advisory authority字段

<details>
<summary>查看原文（13行）</summary>

```text
{
  "attempts": {
    "fails": 27,
    "invalid": 0,
    "invalidReasons": {},
    "passes": 93,
    "remaining": 0,
    "total": 120,
    "valid": 120
  },
  "authorityBoundary": "advisory-method-pack-evidence-not-completion-authority",
  "batchDigest": "be67a98fdcd9f249e6fb0de8eaf921e640d0d7ab5c860feb02a57223c1f6b46b",
  "batchId": "gpt-5-6-sol-xhigh-extended-20260811-aegis-2-7-6-958fcc2-native-proxy-001",
```

</details>

**依据 3 · 源码核查**：[docs/README.deepseek-harness.md:80-104](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/docs/README.deepseek-harness.md#L80-L104)

profile独立安装和固定Git目标

<details>
<summary>查看原文（25行）</summary>

````text
Install Aegis through the manager that owns the intended profile. The following
terminal commands apply to CLI-managed Web and Headless profiles. For Web:

```bash
dsh plugin --profile web add "git+https://github.com/GanyuanRan/Aegis.git"
```

For the Headless profile, install it separately:

```bash
dsh plugin --profile headless add "git+https://github.com/GanyuanRan/Aegis.git"
```

An `aegis` dependency that is installed in one profile is not automatically
active in another profile. Do not also register Aegis under `$DSH_HOME/skills`,
`$DSH_AGENTS_HOME/skills`, a project `.dsh/skills` directory, or a custom skill
directory.

After a bundle-bearing Aegis release exists, a release tag may be pinned:

```bash
dsh plugin --profile web add "git+https://github.com/GanyuanRan/Aegis.git#vX.Y.Z"
```

The explicit `git+https://` form is intentional. Do not shorten it to
````

</details>

**依据 4 · 源码核查**：[docs/README.deepseek-harness.md:112-132](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/docs/README.deepseek-harness.md#L112-L132)

Desktop管理归属与不能替换profile

<details>
<summary>查看原文（21行）</summary>

````text
### Desktop (Electron)

DSH `0.2.0-rc.2` reserves the `desktop` profile for the Electron application.
Terminal plugin commands for that profile fail with
`profile "desktop" is managed exclusively by the Electron application`.
Use the desktop application's plugin manager for installation, inspection,
update, and removal. Do not substitute `web`: it is a different profile and
does not make the plugin active in Desktop.

When the application's own installer supports an explicit Git target, select
the official repository and a fixed release, for example:

```text
git+https://github.com/GanyuanRan/Aegis.git#v2.12.2
```

Read back the actual dependency name, source/ref, installed package version,
and bundle through the application or its profile manifest. Do not assume a
community marketplace's catalog button or custom Git input preserves the
requested target; see the marketplace channel changes below. Do not edit the
Electron-managed profile to bypass its manager.
````

</details>

#### 缺口

- 本版DSH真实安装、自动入口和任务收益未知
  **影响**：不能推荐持续安装或声称当前数字改善
  **进一步探讨**：固定此提交、宿主和模型，对小/中/跨模块任务分别核完成质量和总投入

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么试用与可证伪的流程简化有依据？

**研究主题**：采用判断、新假设与验证

#### 完整回答

已有工程治理和可恢复profile的开发者可在一个非敏感中等修改任务试用，先检查原生插件启用、技能目录和auto/explicit入口，要求交付指向真实当前证据。相对每次手写基线/完成提醒，源码提供生命周期入口和按需资源，能否减少返工仍是推断。若简单请求反复触发无关文档、首写前仍未定位基线、或把旧测试当本次完成凭证，则停止依赖自动路由，切explicit/移除并回到项目AGENTS和手动验证。由默认auto和快路径之间张力可推导未验证方向：用少量可解释任务风险信号选择最小指南，并记录每次路由增加的读取与人工负担。最小验证同一任务集比较手动AGENTS、auto和explicit，分别看合格交付、返工、token及用户理解时间；若auto只是增加材料而不改善交付，或风险信号漏掉跨模块修改，应收窄自动范围。不得把新增指标再变成每任务强制报告。

#### 证据与依据

**依据 1 · 源码核查**：[skills/using-aegis/SKILL.md:41-61](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/skills/using-aegis/SKILL.md#L41-L61)

最小相关资源与风险分级提供简化起点

<details>
<summary>查看原文（21行）</summary>

```text

1. User/project instructions outrank Aegis.
2. Load only the smallest explicitly requested or clearly relevant skill/reference;
   otherwise stay on the fast path. Compose `ui-ux-governance` for UI/UX effects;
   retain task ownership and scope.
3. Active codebase question/"what next": use the authority index and relevant
   README/ADR/rule/baseline sections, else a bounded index-first scan. Do not
   recursively read all linked docs. Non-trivial work passively use relevant
   `CONTEXT-MAP.md`/`CONTEXT.md`; model semantic conflicts only when found.
4. Primary routes: `grill me`/`grill this plan`/`审问我`/`盘问我`/`拷问我` -> `brainstorming` (literal/explanatory uses do not); `/aegis-goal` or `Aegis goal:` -> `goal-framing`. Bug, failure, regression, or unexpected behavior routes to `systematic-debugging`.
5. Implementation only: Classify before implementation. Low stays owner-local;
   Medium/high: baseline read-set + plan. Spec Brief or Design Spec only for
   ambiguous/contract/cross-module medium/high work. TDD: off=no auto route/load; auto=risk-based strict/light/skipped; explicit strict applies.
   Pure explanation and read-only diagnosis skip implementation/TDD/write gates.
6. For writes, the owner workflow surfaces Change Necessity, records
   `TaskStartSnapshot`, and decides `ArchitectureReviewRequired`; ceremony alone
   never creates a branch/worktree.
7. At the first substantive user-visible stage say why Aegis is shaping
   non-tiny work; do not wait for the user to ask. structured trace is only for audit/debug/release/long-task review/asked and does not route (`Trace Digest`).
8. Workspace support is lazy; use configured Aegis workspace support as needed.
   Q&A/status writes no files except authorized baseline bootstrap before
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/bootstrap.js:25-40](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/extensions/dsh/bootstrap.js#L25-L40)

auto/explicit是可比较入口

<details>
<summary>查看原文（16行）</summary>

```text
export function readAegisConfig(homeDir = os.homedir()) {
  const envActivation = process.env.AEGIS_ACTIVATION_MODE;
  const configuredActivation = readConfigValue(homeDir, "activation_mode");
  const requestedActivation = envActivation ?? configuredActivation;
  const activationMode =
    requestedActivation === "auto" || requestedActivation === "explicit"
      ? requestedActivation
      : "auto";

  const envTdd = process.env.AEGIS_TDD_MODE;
  const configuredTdd = readConfigValue(homeDir, "tdd_mode");
  const requestedTdd = envTdd ?? configuredTdd;
  const tddMode =
    requestedTdd === "auto" || requestedTdd === "off" ? requestedTdd : "off";

  return { activationMode, tddMode };
```

</details>

**依据 3 · 源码核查**：[skills/using-aegis/SKILL.md:33-37](https://github.com/GanyuanRan/Aegis/blob/0461c211e4d812f0b215fab240a68a25c1e22424/skills/using-aegis/SKILL.md#L33-L37)

不要新审批或完整追踪的作者边界

```text

Preserve task fidelity through understanding, transformation, execution and
delivery: retain decision-relevant meaning and evidence status, checking both
omissions and unsupported additions. Authorized summaries, designs and
evidence-based corrections are valid. Use existing checkpoints and sufficient
```

#### 缺口

- 风险路由的增量效果未验证
  **影响**：不能作为已确认生产插件机会
  **进一步探讨**：先在现有方法包做只读路由与投入记录，不先建设新平台

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
