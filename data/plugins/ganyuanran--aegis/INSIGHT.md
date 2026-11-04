# Aegis

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[1370a15](https://github.com/GanyuanRan/Aegis/tree/1370a15001b9130316d51715bab44c87a3993dcb)

<!-- BEGIN META -->
[![GitHub ★ 1,416](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C416&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/GanyuanRan/Aegis)
<!-- END META -->

> **功能**：为 AI 编码助手提供任务路由、工程方法及验证指导。

> **亮点**：[Q01](#research-q01) 将多方法集中并接到宿主发现机制；效果仍需对照。

> **主要限制**：[Q02](#research-q02) 提示在首次 promotion 后才投递，不能保证第一次写工具前已约束。

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
  - [Q01 · Aegis 为开发者增加什么，相比宿主原生 Skill 有何区别？](#detail-section-11)
  - [Q02 · DSH 路由何时注入，能否约束第一次工具调用？](#detail-section-12)
  - [Q03 · 依赖、结果证据和退出条件是什么？](#detail-section-13)
  - [Q04 · 如何验证首动作路由边界的改进？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：使用 AI 编码助手处理有不同风险等级任务的开发团队。

宿主原生 Skill 和团队手工工程规则也能提供方法；项目增加自动注入和跨宿主方法组织。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Skill 发现 | 暴露方法包 | 宿主 filesystem provider |
| 路由提示 | 引导任务选择 | 首次 promotion 后注入，不是强制门禁 |
| 压缩重注入 | 恢复上下文指导 | 依赖事件与 session ID |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH skills、agents 及 filesystem provider | DSH 路由必需 | 发现 Skill 与注入 | 接线不可用或时序不同 |
| using-aegis 原稿及稳定 session.id | 自动注入必需 | 构建和定位会话 | 缺文件抛错，缺 ID 跳过 |
| 模型遵循路由文本 | 期望流程必需 | 决定 Skill 或快路径 | 无强制完成保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 核版本和自动激活 | 不适配则停用 |
| 启动 | 宿主发现 Skill 并记录会话 | 可解析 session.id |
| 路由 | 首次事件后投递提示 | 对照首动作及提示实际时序 |
| 交付 | 模型依任务选择 Skill 或快路径 | 人工核证据与结果 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 额外上下文和运行资源未知 | 配置兼容与规则 | 未测时间 |
| 持续 | 模型 token 成本未知 | 路由与结果复核 | 效率未对照 |
| 恢复 | 资源成本未知 | 纠正漏路由及关闭配置 | 首动作影响需单独核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 方法发现 | 原生 provider 配置 | 所有宿主实际加载 |
| 路由提示 | 延迟注入源码 | 首动作前遵守率 |
| 质量效果 | 作者旧版有边界基准 | 当前版本及 DSH 效果 |

> **思考**：[Q02](#research-q02) 提示在首次 promotion 后才投递，不能保证第一次写工具前已约束。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将多方法集中并接到宿主发现机制；效果仍需对照。

[Q02](#research-q02) 按 session、epoch 管理取消和重注入，减少迟到投递；延迟时序不构成写前强制门禁。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 提示在首次 promotion 后才投递，不能保证第一次写工具前已约束。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 在隔离仓库对照首次动作和交付证据；路由未生效或成本过高时停用自动激活。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

仅检查固定版本 DSH 适配器、路由 Skill 和作者基准摘要；未运行目标。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、extensions/dsh/index.js、extensions/dsh/bootstrap.js、skills/using-aegis/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查根包、DSH adapter、bootstrap、using-aegis 路由及 README 基准摘要；未全审其他宿主或独立复算实验。
- 下一步：固定 DSH 版本验证首次写动作、无 ID、压缩和投递失败，并对照人工规则。

**分析版本**

- **仓库**：[GanyuanRan/Aegis](https://github.com/GanyuanRan/Aegis)
- **版本号**：2.14.3（[固定提交 1370a15](https://github.com/GanyuanRan/Aegis/tree/1370a15001b9130316d51715bab44c87a3993dcb)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 假设经宿主确定性拦截首个写动作能减少漏路由，尚未验证。

固定 DSH 版本验证首次写动作、无 ID、压缩和投递失败，并对照人工规则。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 136 | 31831 | — | — | 192592 |
| .js | source | 3 | 849 | 642 | 86 | — |
| .ts | source | 4 | 493 | 325 | 127 | — |
| .md | test | 37 | 1495 | — | — | 7667 |
| .md | example | 7 | 50 | — | — | 275 |
| .mjs | test | 3 | 539 | 442 | 51 | — |
| .js | example | 6 | 49 | 39 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=16&color=737b86&logo=github)](https://github.com/GanyuanRan/Aegis/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查方法包贡献、DSH 注入时序及效果证据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Aegis 为开发者增加什么，相比宿主原生 Skill 有何区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Aegis 是跨宿主的方法包，面向希望 Agent 在改代码前选择方法、交付时说明验证和风险的团队。它提供路由指引及相关 Skill；DSH 适配器把其 skills 树交给宿主原生 filesystem provider，并注入压缩路由指引，未替换宿主 Skill 工具或建立新的运行时权限。与手工调用宿主 Skill 相比，增量是默认路由和共享方法集合；模型是否遵守及实际减少返工不能仅由文本证明。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:40-68](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/README.md#L40-L68)

作者描述方法和效果边界。

<details>
<summary>查看原文（29行）</summary>

```text
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
> See [the full benchmark and its limitations](#measured-agentic-benchmark).
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/index.js:1-29](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/index.js#L1-L29)

DSH 使用宿主 provider 和 bootstrap。

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * Thin DeepSeek Harness bundle adapter for Aegis Method Pack.
 *
 * The host-owned filesystem provider remains the discovery implementation.
 * This adapter points one isolated provider at this package's canonical
 * skills tree and injects the compact Aegis router at DSH lifecycle start. It
 * does not copy skill bodies, replace the native skill tool, or add runtime
 * authority.
 */

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

**依据 3 · 源码核查**：[skills/using-aegis/SKILL.md:45-58](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/skills/using-aegis/SKILL.md#L45-L58)

按任务和风险的文本路由。

<details>
<summary>查看原文（14行）</summary>

```text
## Hot Path

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
```

</details>

#### 缺口

- 缺本版本同任务对照和宿主运行
  **影响**：不能确认触发可靠性或净收益
  **进一步探讨**：固定任务、模型与宿主对照加载行为、正确率和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 路由何时注入，能否约束第一次工具调用？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

默认 activation 是 auto，显式模式不安装 bootstrap。auto 同步读 using-aegis 内容，agent 创建或旧生命周期事件按 session.id 记录 agent 并 arm；首个 tool/call 或 assistant/message 后通过零延迟定时器注入提示，compaction/end 再次 arm。子代理和缺 session.id 被跳过，agent disposed 会取消待投递并清理。提示要求首次非只读工具前选路，但注入本身故意晚于首个持久 promotion，故不能据此保证第一次工具调用之前已收到要求；agent.inject 失败只打印错误。这里是提示与生命周期静态接线，不是强制拦截或已测时序。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/bootstrap.js:25-40](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L25-L40)

activation 与 TDD 默认值。

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

**依据 2 · 源码核查**：[extensions/dsh/bootstrap.js:57-70](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L57-L70)

注入文本的首次工具前路由要求。

<details>
<summary>查看原文（14行）</summary>

```text
export function buildBootstrap(body, { tddMode }) {
  return `<${BOOTSTRAP_MARKER}>
You have Aegis.

Aegis TDD mode: ${tddMode}. off is the default and disables automatic TDD while verification-before-completion still applies; auto routes strict TDD only when risk warrants.

**ROUTING CONTRACT (this lifecycle):** Before the first non-readonly tool call, either use DeepSeek Harness's native \`skill\` tool to load the relevant task-specific Aegis skill, or explicitly declare \`Route: fast-path\` with a one-line reason. The compact \`using-aegis\` hot path is already loaded below; do not load it again.

${body.trim()}

**Tool Mapping for DeepSeek Harness:**
- \`Skill\` tool → DeepSeek Harness's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, and shell references → the equivalent tools available in the active DSH profile
</${BOOTSTRAP_MARKER}>`;
```

</details>

**依据 3 · 源码核查**：[extensions/dsh/bootstrap.js:85-108](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L85-L108)

显式模式及延迟注入动机。

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

**依据 4 · 源码核查**：[extensions/dsh/bootstrap.js:133-162](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L133-L162)

定时投递、失败记录、会话和子代理过滤。

<details>
<summary>查看原文（30行）</summary>

```text
  const deferDelivery = (sessionId, agent, epoch, message) => {
    const delivery = { agent, epoch, timer: undefined };
    delivery.timer = setTimeout(() => {
      if (scheduledDeliveries.get(sessionId) !== delivery) return;
      scheduledDeliveries.delete(sessionId);
      if (
        disposed ||
        agents.get(sessionId) !== agent ||
        epochs.get(sessionId) !== epoch
      ) {
        return;
      }
      try {
        agent.inject(message);
      } catch (error) {
        reportDeliveryFailure(error);
      }
    }, 0);
    scheduledDeliveries.set(sessionId, delivery);
  };

  const armFromLifecycle = ({ agent }) => {
    if (agent.session?.header?.origin === "subagent") return;
    const sessionId = agent.session?.id;
    if (sessionId === undefined) return;
    armDelivery(sessionId, agent);
  };
  // DSH 0.1.6+ moved the source-bearing lifecycle event to agent/created.
  // Older preview hosts still emit agent/session-start; their agent/created
  // event can also fire before it, so both subscriptions share one path.
```

</details>

**依据 5 · 源码核查**：[extensions/dsh/bootstrap.js:163-205](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L163-L205)

生命周期和 promotion、压缩、清理处理。

<details>
<summary>查看原文（43行）</summary>

```text
  const disposeLifecycle = ctx.on("agent/created", armFromLifecycle);
  const disposeLegacyLifecycle = ctx.on("agent/session-start", armFromLifecycle);

  const disposeAgents = ctx.on("agent/disposed", ({ agent }) => {
    const sessionId = agent.session?.id;
    if (sessionId === undefined || agents.get(sessionId) !== agent) return;
    cancelDelivery(sessionId);
    agents.delete(sessionId);
    epochs.delete(sessionId);
    pending.delete(sessionId);
  });

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
```

</details>

#### 缺口

- 未运行 DSH 生命周期和异常竞态
  **影响**：不能保证提示在目标动作前被消费
  **进一步探讨**：隔离宿主测首次即写工具、无 session ID、压缩与投递失败。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖、结果证据和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

DSH 路径依赖宿主 skills/agents、filesystem provider、消息格式和会话事件；watch 为 false，变更何时重新发现要依宿主加载行为验证。README 展示的 2.7.6 基准是作者报告，指出评审并非独立人工且无法观测实际模型身份，不能外推到当前 2.14.3 或 DSH。配置和路由阅读消耗模型上下文与人工复核，时间和费用未知。先用隔离仓库比较一类任务的首动作和证据质量；若首次写入缺指引、路由不遵守或负担抵消收益，停用自动激活并回到原生流程。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/index.js:11-29](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/index.js#L11-L29)

宿主依赖及 watch false。

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

**依据 2 · 源码核查**：[extensions/dsh/bootstrap.js:85-95](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L85-L95)

配置控制自动注入。

<details>
<summary>查看原文（11行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.md:80-90](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/README.md#L80-L90)

作者标明旧版本实验、评审和模型身份限制。

<details>
<summary>查看原文（11行）</summary>

```text

## Measured Agentic Benchmark

A frozen held-out A/B benchmark for Aegis 2.7.6 (2026-08-11) kept the Codex client, prompts, projects, tool policy, and requested the same `gpt-5.6-sol` / `xhigh` setting in both arms; only the Aegis projection differed. Across 120 valid runs on 20 cases,
contract pass rate was **61.67% → 93.33% (+31.67 pp)** and unsafe outcomes were **13.33% → 0%**. The 95% case-cluster interval was **+15.00 pp to +50.00 pp**. This is bounded advisory evidence; review was arm-hidden technical review, not independent human review, and host events did not return the observed model identity.

![Aegis agentic benchmark: with and without Aegis](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.svg)

[Sanitized JSON](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.json) · [English table](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.en.md) · [中文表格](benchmarks/results/gpt-5-6-sol-xhigh-extended-20260811-v2-7-6.zh-CN.md) · [Methodology](docs/current/AEGIS_AGENTIC_BENCHMARK_BASELINE.md)

A newer [matrix-v7 standard snapshot for Aegis 2.10.8](benchmarks/results/gpt-5-6-sol-xhigh-standard-20260925-v2-10-8.en.md)
```

</details>

#### 缺口

- 未独立复算实验或验证当前宿主
  **影响**：无法证明当前版本效果
  **进一步探讨**：固定版本和同任务运行两组并审阅实际轨迹。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证首动作路由边界的改进？

**研究主题**：新假设与验证

#### 完整回答

假设宿主提供确定性的首个写工具前拦截，并在进入动作前确认已路由或真实快路径，可减少提示尚未注入时的漏路由；这不是现有实现，也不证明模型必然遵守。对照当前延迟 promotion 与拦截方案，在首个动作是写、只读后写、压缩后写及无 session ID 的固定任务中测漏拦、误阻和延迟；若损失基线行为、误阻过多或没有减少漏路由则否定。

#### 证据与依据

**依据 1 · 源码核查**：[extensions/dsh/bootstrap.js:57-70](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L57-L70)

目标路由条件。

<details>
<summary>查看原文（14行）</summary>

```text
export function buildBootstrap(body, { tddMode }) {
  return `<${BOOTSTRAP_MARKER}>
You have Aegis.

Aegis TDD mode: ${tddMode}. off is the default and disables automatic TDD while verification-before-completion still applies; auto routes strict TDD only when risk warrants.

**ROUTING CONTRACT (this lifecycle):** Before the first non-readonly tool call, either use DeepSeek Harness's native \`skill\` tool to load the relevant task-specific Aegis skill, or explicitly declare \`Route: fast-path\` with a one-line reason. The compact \`using-aegis\` hot path is already loaded below; do not load it again.

${body.trim()}

**Tool Mapping for DeepSeek Harness:**
- \`Skill\` tool → DeepSeek Harness's native \`skill\` tool
- \`Read\`, \`Write\`, \`Edit\`, and shell references → the equivalent tools available in the active DSH profile
</${BOOTSTRAP_MARKER}>`;
```

</details>

**依据 2 · 源码核查**：[extensions/dsh/bootstrap.js:97-108](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L97-L108)

现有刻意推迟到 promotion。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 3 · 源码核查**：[extensions/dsh/bootstrap.js:175-189](https://github.com/GanyuanRan/Aegis/blob/1370a15001b9130316d51715bab44c87a3993dcb/extensions/dsh/bootstrap.js#L175-L189)

触发后排队投递。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 宿主是否支持安全同步拦截未确认
  **影响**：不能保证方案可行或无副作用
  **进一步探讨**：核对固定宿主事件合同并运行上述对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
