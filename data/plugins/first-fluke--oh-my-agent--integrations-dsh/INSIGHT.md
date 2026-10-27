# OMA for DeepSeek Harness

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[5f0c34a](https://github.com/first-fluke/oh-my-agent/tree/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh)

<!-- BEGIN META -->
[![GitHub ★ 1,354](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C354&color=yellow&logo=github&style=flat)](https://github.com/first-fluke/oh-my-agent)
<!-- END META -->

> **实现功能**：将OMA项目Skill与验证钩子接入DSH，支持自动项目准备、工具前后检查及有限停止跟进。

> **核心亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是把原来仅靠Skill提醒和人工检查的OMA项目规则接到DSH执行前后，冻结参数不匹配时拒绝原调用。规则和CLI来自OMA上游；适配价值在准确转换宿主决策，不能宣称自动角色调度或全部交付质量门禁。

> **风险与缺陷**：[Q02](#research-q02)表明Stop达到maxStopBlocks只警告并返回，post检查也不能撤销已执行工具。最影响贡献边界的是用户把结束误当验收通过；pre阻断仍有独立价值，严格交付流程需另管未解决状态。本轮未运行反例，不把有限继续设计称为故障复现。

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
  - [Q01 · 项目规则钩子相对仅提示Skill改变什么？](#detail-section-11)
  - [Q02 · 工具前后检查与停止边界怎样映射？](#detail-section-12)
  - [Q03 · 自动初始化的来源、写入及失败恢复是什么？](#detail-section-13)
  - [Q04 · 什么用户可以有界试用，全周期付出什么？](#detail-section-14)
  - [Q05 · 持久未解决状态能否减少Stop上限被误读为通过？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：它面向已使用或准备采用OMA项目规则、希望DSH工具执行可受规则检查的开发者。合格交付是特定不允许的工具在执行前被拒绝，并把后续质量问题交给Agent修正；不能只因为Agent读过Skill就认定规则已经执行。简单替代是AGENTS/Skill提醒加人工运行检查，规则可靠性依赖模型遵从和人工交接。

仅用项目AGENTS/Skill提示，Agent或人手工运行检查。比较同样规则下的违规阻断、误拒绝、交付质量与人工时间，不按Skill数量推断效果。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动项目准备 | 下载校验并补缺项目模板 | 需网络写权限，可关，不自动撤销文件 |
| pre-tool桥 | 规则拒绝、审批及上下文 | 变更参数需新调用，失败拒绝 |
| post-tool反馈 | 将检查结果交下一模型步 | 不能撤销已执行工具 |
| Stop跟进 | 未通过请求继续修正 | 默认2次，上限不表示通过 |
| OMA Skill发现刷新 | 让宿主读项目Skill | 内容来自依赖资源，不是本插件静态新增33定义 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22、DSH 0.2.0-rc.2及Cordis ~4.0.4 | 是 | 工具/Agent事件语义 | 非匹配宿主不能据源码声明兼容 |
| oh-my-agent 20.4.1 | 是 | CLI及规则执行 | 无需全局oma，替代命令要兼容 |
| GitHub网络与项目写权限 | 首次autoSetup | 下载校验模板到.agents | 失败pre拒绝，可手工初始化 |
| 项目规则/Skill和所需工具 | 效果需要 | 实际限制与检查 | 规则存在不等业务质量通过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 维护者固定宿主/依赖并备份项目 | autoSetup写入可审查 |
| 2 | 初始化或关闭自动setup后手工准备 | 检查marker、Skill和配置 |
| 3 | Agent执行一允许和一拒绝工具 | pre决策与原参数一致 |
| 4 | 检查post及Stop未解决行为 | 不把结束当通过 |
| 5 | 误拒绝持续则停用并回人工 | 用Git审查保留/撤销项目文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 依赖及release下载 | 规则/模板审查、初始化 | 金额耗时未知，写项目.agents |
| 持续使用 | CLI进程与检查，继续可能多模型回合 | 维护规则、处理误拒绝 | 每hook默认10秒上限非耗时实测 |
| 失败恢复 | 重试hook与模型可能付费 | 分setup/规则/运行时，清查锁后reload | pre失败拒绝，post不能撤销 |
| 退出 | 依赖和项目资源保留 | 移除插件后Git审查模板回退 | 不自动回滚.agents文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| pre阻断 | deny/ask及变更参数拒绝 | 项目规则覆盖和误拒绝 |
| post反馈 | 下一次模型请求附上下文 | 已发生副作用不撤销 |
| Stop修正 | 最多配置次数继续请求 | 上限结束不表示通过 |
| 自动setup | 校验、保留旧文件、marker最后 | 自定义规则语义冲突及实机恢复 |

> **思考**：[Q02](#research-q02)表明Stop达到maxStopBlocks只警告并返回，post检查也不能撤销已执行工具。最影响贡献边界的是用户把结束误当验收通过；pre阻断仍有独立价值，严格交付流程需另管未解决状态。本轮未运行反例，不把有限继续设计称为故障复现。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)识别的增量是把原来仅靠Skill提醒和人工检查的OMA项目规则接到DSH执行前后，冻结参数不匹配时拒绝原调用。规则和CLI来自OMA上游；适配价值在准确转换宿主决策，不能宣称自动角色调度或全部交付质量门禁。

[Q01](#research-q01)、[Q02](#research-q02)识别的增量是把原来仅靠Skill提醒和人工检查的OMA项目规则接到DSH执行前后，冻结参数不匹配时拒绝原调用。规则和CLI来自OMA上游；适配价值在准确转换宿主决策，不能宣称自动角色调度或全部交付质量门禁。

值得复用的现有工程是薄入口、protocol纯映射、runner进程所有权和setup最后激活各自分开。移植需宿主冻结参数、pre决策和continuation语义匹配，不能仅把hook名称换掉。当前采用限定为规则执行桥试用，不宣称完整质量门禁。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)表明Stop达到maxStopBlocks只警告并返回，post检查也不能撤销已执行工具。最影响贡献边界的是用户把结束误当验收通过；pre阻断仍有独立价值，严格交付流程需另管未解决状态。本轮未运行反例，不把有限继续设计称为故障复现。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04)建议规则维护者在项目副本固定版本，先用允许与拒绝两个工具检查，必要时先关autoSetup手工审查模板。把pre阻断、post反馈和有限Stop分开验收；误拒绝持续或未解决被误放行时，停用桥并回人工检查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持pre-tool阻断、参数变更拒绝和初始化边界；post是反馈，Stop为有限继续而非强制质量放行；未执行作者测试或宿主。

- 已检查：作者 README、包清单、源码路径 integrations/dsh/README.md、integrations/dsh/package.json、integrations/dsh/index.mjs、integrations/dsh/bridge.mjs、integrations/dsh/protocol.mjs、integrations/dsh/runner.mjs、integrations/dsh/setup.mjs 及固定范围 inventory；组件：integrations/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只研究integrations/dsh固定源码及作者说明；不执行自动setup、目标代码、测试或宿主。不把作者52测试及宏观初始化数字转成本轮运行证据；未审计整个OMA规则库。
- 下一步：后续固定宿主、CLI、项目规则与任务，对允许/拒绝/修改参数/超时/Stop上限和退出记录结果，再比较人工基线的合格交付与维护代价。

**分析版本**

- **仓库**：[first-fluke/oh-my-agent](https://github.com/first-fluke/oh-my-agent)
- **版本号**：0.2.0（[固定提交 5f0c34a](https://github.com/first-fluke/oh-my-agent/tree/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证的持久验收状态：绑定会话与规则版本保存通过/未解决，最终交付读取；上限结束作为中断而非成功。对持续失败、修正、规则更改和恢复比较错误放行与人工负担，无收益或新过期误拒绝就停止。

后续固定宿主、CLI、项目规则与任务，对允许/拒绝/修改参数/超时/Stop上限和退出记录结果，再比较人工基线的合格交付与维护代价。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 8 | 1241 | 1179 | 15 | — |
| .mjs | test | 5 | 1420 | 1355 | 2 | — |
| .md | source | 1 | 199 | — | — | 1361 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/first-fluke/oh-my-agent/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/first-fluke/oh-my-agent/issues?q=is%3Aissue+created%3A2026-09-27T02%3A08%3A47.179Z..2026-10-27T02%3A08%3A47.179Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/first-fluke/oh-my-agent/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T02%3A08%3A47.179Z..2026-10-27T02%3A08%3A47.179Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：OMA桥对DSH工具与停止阶段提供哪些真实约束，规则检查结果如何验收？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 项目规则钩子相对仅提示Skill改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向已使用或准备采用OMA项目规则、希望DSH工具执行可受规则检查的开发者。合格交付是特定不允许的工具在执行前被拒绝，并把后续质量问题交给Agent修正；不能只因为Agent读过Skill就认定规则已经执行。简单替代是AGENTS/Skill提醒加人工运行检查，规则可靠性依赖模型遵从和人工交接。

适配器将DSH工具前后事件和turn-stopping转换为OMA CLI hook JSON，增加确定的pre-tool决策入口和model-visible反馈；OMA规则、Skill和CLI属于上游依赖，不算DSH集成独创。它不提供自动关键词工作流或原生OMA角色调度，也不把Markdown workflow转换成JavaScript执行计划。价值在于把已有项目规则接到真实执行点，而非增加一套自主Agent。

已有规则能表达目标限制且维护者能检查误拒绝时有采用条件；没有规则、只想增加角色提示或要求任何输出都必须验证通过才交付的人，应先检查本桥的Stop边界。作者报告的52测试和宏观并发初始化是作者验证材料，本轮未重跑。

#### 证据与依据

**依据 1 · 作者声明**：[integrations/dsh/README.md:3-17](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/README.md#L3-L17)

场景与固定CLI依赖。

<details>
<summary>查看原文（15行）</summary>

```text
Use project OMA skills and validation hooks in DeepSeek Harness (DSH). The
plugin installs its OMA CLI dependency and prepares uninitialized projects on
first use. It connects DSH tool execution and turn completion to OMA checks.
It ships executable JavaScript and needs no build or install-time scripts.

## Requirements

- DeepSeek Harness `0.2.0-rc.2`, using Cordis `4.0.4`.
- Node.js `22` or newer.
- Network access to GitHub when first opening an uninitialized project.
- Write access to that project's directory for automatic setup.

The plugin depends on exactly `oh-my-agent@20.4.1` and invokes that package's
CLI through Node.js. A global OMA installation or an `oma` executable on PATH
is unnecessary. Existing OMA projects can run without the setup download.
```

</details>

**依据 2 · 作者声明**：[integrations/dsh/README.md:86-124](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/README.md#L86-L124)

事件映射、冻结参数和未提供能力。

<details>
<summary>查看原文（39行）</summary>

```text
The skill supplies instructions. The plugin runs the project's configured OMA
checks before and after tool calls and when a turn tries to finish. Hook output
becomes DSH tool decisions or model-visible follow-up context.

| DSH event | OMA event | Behavior |
| --- | --- | --- |
| `agent/created` | Project setup and runtime note | Prepares an uninitialized project and explains the skill location and CLI invocation. |
| `agent/created` | `oma state emit boundary` | Ties the active OMA session to the DSH session, for `oma state trajectory`. |
| `tools/pre-execute` | `PreToolUse` | Denies a blocked call before its tool body runs; forwards approval requests and context. |
| `tools/post-execute` | `PostToolUse` | Adds validation feedback to the next model request. |
| `agent/turn-stopping` | `Stop` | Queues bounded follow-up work when an OMA check blocks completion. |

The bridge invokes the dependency's CLI with
`hook run --vendor claude --event <event>` using an argument array, without a
shell. The runtime note gives the agent that CLI command as an argument array
for other OMA instructions. Here `claude` selects OMA's hook JSON format.
The DSH agent and session keep their existing identities. The bridge deliberately
omits OMA `SessionStart` and `UserPromptSubmit`: those handlers currently record
host identity and contain Claude-specific prompt behavior.

When an OMA session is active, a root agent records its DSH session id (and
`DSH_HOME`, when set) on that session as a `boundary` event. `oma state
trajectory` uses it to join the session's events with the DSH session log, so
DSH turns, tool calls, and token usage appear in the trajectory. With no active
OMA session there is nothing to attach to and nothing is recorded. Subagents
are not recorded; their work lives in separate DSH sessions.

DSH freezes tool arguments before its pre-execution hooks. If OMA requests a
changed input, the plugin denies the call instead of executing the original
input. The agent must make a new call with the required input. Post-execution
feedback cannot undo a completed tool.

Stop follow-up is bounded by `maxStopBlocks` to avoid an endless correction
loop. Exhausting this bound does not establish that OMA validation passed;
inspect the hook feedback and OMA result evidence.

Automatic OMA keyword-triggered workflows and OMA native role dispatch are not
part of this version. OMA Markdown workflows are instructions; they are not
converted into DSH JavaScript workflow scripts.
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/index.mjs:1-9](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/index.mjs#L1-L9)

薄入口注册bridge而非独立Agent。

```text
import { createUserMessage } from "@deepseek-ai/dsh-llm/message";
import { registerBridge } from "./bridge.mjs";

export const name = "oma";
export const inject = [];

export function apply(ctx, config = {}) {
  registerBridge(ctx, config, createUserMessage);
}
```

#### 缺口

- 项目规则减少违规或人工检查的实际收益未知
  **影响**：不能从hook存在推导交付质量提高
  **进一步探讨**：在固定项目比较提示+人工检查与hook，记录违规拦截、误拒绝和人工复核

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工具前后检查与停止边界怎样映射？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

pre-execute等待项目active/setup，然后用冻结的工具参数调用PreToolUse。明确deny/block/continue=false映射为DSH deny；ask映射审批；如果OMA返回与原参数不同的updatedInput，桥不会执行原参数，而是拒绝并要求Agent另发新调用。这避免了“要求修改参数却仍执行旧调用”的语义错配。初始化或pre-hook异常也拒绝，不静默放行。

post-execute只把检查结果作为additionalContexts加入下一次模型请求，已经发生的工具副作用不会被撤销。Stop解析阻断原因后用agent.steer请求继续，但每轮仅允许maxStopBlocks（默认2）次；达到上限时只warning并返回，不再强制继续。存在inFlight防同轮并发检查，但上限代表避免无限纠错，而非验证成功。

因此可依赖的强机制是执行前工具阻断，post是反馈，Stop是有限纠正请求。若工作流程要求所有验收均通过才能交付，还需一个持久验收状态和明确放行规则，不能把“Agent停下了”解读为通过。该限制由代码可见，本轮没有运行反例，不把设计选择称为已复现漏洞。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/bridge.mjs:176-225](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/bridge.mjs#L176-L225)

pre失败拒绝与post追加上下文的实际分界。

<details>
<summary>查看原文（50行）</summary>

```text
  ctx.on("tools/pre-execute", async (execution, next) => {
    const agent = execution.agent;
    try {
      if (!(await active(agent, execution.signal)))
        return inactive(agent, execution.signal) ? { kind: "cancel" } : next();
      const output = await run(
        "PreToolUse",
        agent,
        execution.signal,
        execution,
      );
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      const context = hookContext(output);
      if (context) agent.inject(message(context));
      return preDecision(output, execution.arguments) ?? next();
    } catch (error) {
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      if (!(error instanceof WorkspaceSetupError)) report(error);
      return {
        kind: "deny",
        reason: `OMA hook could not validate this tool: ${error.message}`,
      };
    }
  });
  ctx.on("tools/post-execute", async (execution, result, next) => {
    const agent = execution.agent;
    let context;
    try {
      if (!(await active(agent, execution.signal))) return next();
      context = postContext(
        await run("PostToolUse", agent, execution.signal, execution, result),
      );
    } catch (error) {
      if (
        !inactive(agent, execution.signal) &&
        !(error instanceof WorkspaceSetupError)
      )
        report(error);
      context = `OMA post-tool validation failed: ${error.message}`;
    }
    const downstream = await next();
    if (!context || inactive(agent, execution.signal)) return downstream;
    return {
      ...downstream,
      additionalContexts: [
        message(context),
        ...(downstream.additionalContexts ?? []),
      ],
    };
  });
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/protocol.mjs:74-114](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/protocol.mjs#L74-L114)

决策、updatedInput和stop原因映射。

<details>
<summary>查看原文（41行）</summary>

```text
export function preDecision(output, argumentsValue) {
  const specific = output.hookSpecificOutput ?? {};
  const reason = [specific.permissionDecisionReason, output.reason].find(
    (value) => typeof value === "string" && value.trim(),
  );
  if (
    specific.permissionDecision === "deny" ||
    output.decision === "block" ||
    output.continue === false
  ) {
    return { kind: "deny", reason: reason || "Blocked by an OMA hook." };
  }
  const updatedInput = Object.hasOwn(specific, "updatedInput")
    ? specific.updatedInput
    : output.updatedInput;
  if (
    updatedInput !== undefined &&
    !isDeepStrictEqual(updatedInput, argumentsValue)
  ) {
    return {
      kind: "deny",
      reason: `OMA requested changed tool input. DSH 0.2.0-rc.2 freezes arguments before hooks; retry the tool with this required input: ${JSON.stringify(updatedInput)}`,
    };
  }
  if (specific.permissionDecision === "ask") {
    return { kind: "ask", ...(reason ? { reason } : {}) };
  }
  return undefined;
}

export function stopReason(output) {
  if (output.decision === "block" || output.continue === false) {
    return typeof output.reason === "string" && output.reason.trim()
      ? output.reason
      : "An OMA stop hook requires follow-up work.";
  }
  return undefined;
}

export function postContext(output) {
  return [hookContext(output), stopReason(output)].filter(Boolean).join("\n\n");
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/bridge.mjs:226-266](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/bridge.mjs#L226-L266)

有限Stop继续，上限后warning而非通过状态。

<details>
<summary>查看原文（41行）</summary>

```text
  ctx.on("agent/turn-stopping", async ({ agent, turn, signal }) => {
    let state = stopStates.get(agent);
    if (state?.turn !== turn) {
      state = { turn, blocks: 0, inFlight: false, warned: false };
      stopStates.set(agent, state);
    }
    if (state.inFlight) return;
    state.inFlight = true;
    let reason;
    try {
      if (!(await active(agent, signal))) return;
      const payload = await hookPayload("Stop", agent);
      if (inactive(agent, signal)) return;
      const latest = assistantResponses.get(agent.session);
      if (latest?.turn === turn) payload.response = latest.text;
      const stdout = await runner.run("Stop", payload, {
        signal,
        owner: agent,
      });
      reason = stopReason(decodeOutput(stdout, "Stop"));
    } catch (error) {
      if (!inactive(agent, signal) && !(error instanceof WorkspaceSetupError))
        report(error);
      reason = `OMA stop validation failed: ${error.message}`;
    } finally {
      state.inFlight = false;
    }
    if (!reason || inactive(agent, signal)) return;
    if (state.blocks >= maxStopBlocks) {
      if (!state.warned) {
        state.warned = true;
        report(
          new Error(
            `Stop validation remains unresolved after ${maxStopBlocks} continuation requests: ${reason}`,
          ),
        );
      }
      return;
    }
    state.blocks += 1;
    agent.steer(message(reason));
```

</details>

#### 缺口

- 上限未解决时使用者能否准确区分停止与验收通过
  **影响**：影响高要求交付流程采用
  **进一步探讨**：构造持续失败Stop并询问用户对日志/最终回复的理解，检查是否仍会误交付

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 自动初始化的来源、写入及失败恢复是什么？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

包固定依赖oh-my-agent 20.4.1及tar，宿主peer固定DSH 0.2.0-rc.2和Cordis ~4.0.4。首次未初始化项目会下载相应release资源及SHA256，校验后解包、核对资源版本，并只复制缺少模板到项目.agents。checksum来自同一release渠道，能检查完整性但不应被描述为独立发布者认证。已有配置则跳过自动setup。

setup拒绝通过.agents符号链接写入，COPYFILE_EXCL保留已有文件；锁目录记录pid/token，只由匹配owner回收。marker最后提交，部分复制不激活OMA guards，出错后模型可见且pre-tool拒绝。过期锁需用户确认没有活动初始化后处理并reload，不能用无条件删锁掩盖并发。

该设计可借鉴为“准备资源→合并缺文件→最后激活”，把下载和项目副作用责任明确。但卸载DSH插件只移除集成，不自动回滚复制的项目Skill、规则和配置；用户需要在版本控制中审查并决定保留哪些。autoSetup=false允许维护者先手工初始化后只接规则，适合已有严格项目流程的人。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/package.json:27-41](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/package.json#L27-L41)

Node、精确CLI和宿主依赖。

<details>
<summary>查看原文（15行）</summary>

```text
    "node": ">=22"
  },
  "dependencies": {
    "oh-my-agent": "20.4.1",
    "tar": "7.5.22"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-llm": "0.2.0-rc.2"
  },
  "keywords": [
    "dsh-plugin",
    "dsh-bundle",
    "oma",
    "agent",
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/setup.mjs:140-178](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/setup.mjs#L140-L178)

release/checksum、受限解包来源。

<details>
<summary>查看原文（39行）</summary>

```text
  dependencies = {},
) {
  const request = dependencies.fetch ?? globalThis.fetch;
  const base = `https://github.com/first-fluke/oh-my-agent/releases/download/cli-v${OMA_VERSION}/agent-skills.tar.gz`;
  const checksum = (
    await responseBytes(
      await request(`${base}.sha256`, { signal }),
      4096,
      signal,
    )
  )
    .toString("utf8")
    .trim()
    .match(/^([a-fA-F0-9]{64})(?:\s|$)/)?.[1]
    ?.toLowerCase();
  if (!checksum)
    throw new Error("OMA project asset checksum is missing or invalid");
  const archive = await responseBytes(
    await request(base, { signal }),
    MAX_ARCHIVE_BYTES,
    signal,
  );
  if (createHash("sha256").update(archive).digest("hex") !== checksum)
    throw new Error(
      "OMA project asset checksum mismatch; refusing to initialize the project",
    );
  const archivePath = join(dirname(directory), "agent-skills.tar.gz");
  await writeFile(archivePath, archive, { flag: "wx" });
  const extract = dependencies.extract ?? (await import("tar")).x;
  signal.throwIfAborted();
  await extract({
    file: archivePath,
    cwd: directory,
    strip: 1,
    strict: true,
    preservePaths: false,
    filter: projectArchiveFilter(),
    signal,
  });
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/setup.mjs:191-207](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/setup.mjs#L191-L207)

缺文件复制和符号链接限制。

<details>
<summary>查看原文（17行）</summary>

```text
async function mergeMissing(source, destination, signal) {
  signal.throwIfAborted();
  const existing = await info(destination);
  if (existing && (!existing.isDirectory() || existing.isSymbolicLink()))
    throw new Error(`OMA setup will not write through ${destination}`);
  await mkdir(destination, { recursive: true });
  for (const entry of await readdir(source, { withFileTypes: true })) {
    signal.throwIfAborted();
    const from = join(source, entry.name);
    const to = join(destination, entry.name);
    if (entry.isDirectory()) await mergeMissing(from, to, signal);
    else if (entry.isFile()) {
      try {
        await copyFile(from, to, constants.COPYFILE_EXCL);
      } catch (error) {
        if (error.code !== "EEXIST") throw error;
      }
```

</details>

**依据 4 · 源码核查**：[integrations/dsh/setup.mjs:215-274](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/setup.mjs#L215-L274)

锁所有权与过期提示。

<details>
<summary>查看原文（60行）</summary>

```text
async function acquireLock(root, signal) {
  const path = join(root, ".oma-dsh-setup.lock");
  const token = randomUUID();
  while (true) {
    signal.throwIfAborted();
    let acquired = false;
    try {
      await mkdir(path);
      acquired = true;
    } catch (error) {
      if (error.code !== "EEXIST") throw error;
    }
    if (acquired) {
      try {
        await writeFile(
          join(path, "owner.tmp"),
          JSON.stringify({ pid: process.pid, token }),
          { flag: "wx" },
        );
        await rename(join(path, "owner.tmp"), join(path, "owner.json"));
      } catch (error) {
        await rm(path, { recursive: true, force: true });
        throw error;
      }
      return async () => {
        const owner = JSON.parse(
          await readFile(join(path, "owner.json"), "utf8"),
        );
        if (owner.token === token) await rm(path, { recursive: true });
      };
    }
    const held = await info(path);
    if (!held) continue;
    if (!held.isDirectory() || held.isSymbolicLink())
      throw new Error(`OMA setup lock is not a directory: ${path}`);
    try {
      const owner = JSON.parse(
        await readFile(join(path, "owner.json"), "utf8"),
      );
      if (
        Number.isSafeInteger(owner.pid) &&
        owner.pid > 0 &&
        typeof owner.token === "string"
      ) {
        try {
          process.kill(owner.pid, 0);
        } catch (error) {
          if (error.code === "ESRCH") {
            throw new Error(
              `Remove the stale OMA setup lock at ${path} and reload the plugin`,
            );
          }
          if (error.code !== "EPERM") throw error;
        }
      }
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
    await delay(50, undefined, { signal });
  }
```

</details>

**依据 5 · 源码核查**：[integrations/dsh/setup.mjs:277-308](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/setup.mjs#L277-L308)

目标边界和marker最后激活。

<details>
<summary>查看原文（32行）</summary>

```text
async function prepareWorkspace(root, signal, prepareProject) {
  if (root === parse(root).root || root === (await realpath(homedir())))
    throw new Error(
      "Choose a project directory for OMA setup, rather than your home or filesystem root",
    );
  const release = await acquireLock(root, signal);
  let staging;
  try {
    if (await initialized(root)) return;
    // Do not follow an uninitialized .agents symlink into another project.
    const existing = await info(join(root, ".agents"));
    if (existing && (!existing.isDirectory() || existing.isSymbolicLink()))
      throw new Error("OMA setup needs a project-local .agents directory");
    for (const marker of MARKERS) {
      if (await info(join(root, ".agents", marker)))
        throw new Error(
          `Existing OMA config ${marker} is not a usable file; it was preserved`,
        );
    }
    staging = await mkdtemp(join(tmpdir(), "oma-dsh-setup-"));
    const assets = join(staging, "assets");
    await mkdir(assets);
    await prepareProject(assets, signal);
    signal.throwIfAborted();
    if (await initialized(root)) return;
    await mergeMissing(assets, join(root, ".agents"), signal);
    signal.throwIfAborted();
    // The marker is committed last; partial copies never activate OMA guards.
    if (!(await initialized(root))) {
      const marker = join(root, ".agents", `.oma-config-${randomUUID()}.tmp`);
      try {
        await writeFile(marker, INITIAL_CONFIG, { flag: "wx" });
```

</details>

**依据 6 · 作者声明**：[integrations/dsh/README.md:141-164](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/README.md#L141-L164)

关闭自动setup、失败后reload等契约。

<details>
<summary>查看原文（24行）</summary>

```text
Set `autoSetup: false` to enable the plugin only in projects you have already
initialized with `.agents/oma-config.yaml` or `.agents/oma-config.cue`. With
that setting, uninitialized workspaces are left alone. `setupTimeoutMs` limits
automatic setup separately from the per-hook `timeoutMs`.

To use another CLI, add `command: /absolute/path/to/oma` and `commandArgs: []`.
`command` names one executable; `commandArgs` is a literal argument array.
These explicit overrides take precedence over the installed dependency. If
you override the CLI, keep it compatible with the `20.4.1` project templates
or initialize the project yourself and disable automatic setup.

The host environment is inherited so OMA can use the project's configured
tools. Hook processes run in the agent's actual working
directory, including an explicit Bash `workdir`. Directories are resolved to
their physical paths so symlinks and relative paths are checked from the same
location as the tool. Cancellation, agent disposal, and plugin unload terminate
owned hook processes.

Setup failures, including download and checksum failures, are shown to the
model and deny pre-tool execution. Fix the reported cause and reload the
plugin to retry; validation does not silently pass through after a setup
failure. In an initialized project, a failed, timed-out, or malformed
pre-tool hook denies that call. A post-tool failure becomes feedback, and a
stop-hook failure uses the same bounded follow-up mechanism.
```

</details>

#### 缺口

- release资源与项目已有自定义规则的语义冲突是否可发现
  **影响**：保留旧文件不等于规则彼此兼容
  **进一步探讨**：在版本控制中比较初始化前后，运行目标规则并检查相互冲突及回退

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么用户可以有界试用，全周期付出什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

可试用对象是能维护项目规则的DSH开发者，先固定宿主、CLI和项目副本，选择一项会被阻断的工具与一项允许工具作验收。相比每次人工提醒检查，pre-hook把已有规则放到执行边界；但规则是否正确、误拒绝是否可接受仍由项目维护者负责。把autoSetup关掉并先审查项目.agents，可减少首次隐式写入，但不是免除初始化成本。

首次成本含依赖和约1MB资源下载、规则审查和技能发现；持续每个工具前后增加CLI子进程与检查耗时，Stop继续可能增加模型回合。runner默认10秒超时、输入4MiB和输出256KiB上限，取消/退出拥有进程的资源；预算上限是保护，不是每次耗时或总费用。现金依赖实际模型、检查和网络，未知不填零。

失败时pre拒绝能保护执行，但会阻碍工作，需区分setup、hook、规则错误与模型修改；post不能撤销，Stop上限不能保证通过。若持续误拒绝、规则不能覆盖关键动作或结束被误当放行，应停用集成回到人工运行检查；保留项目文件并通过Git审查回退，不能认为移除插件删除所有写入。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/runner.mjs:12-35](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/runner.mjs#L12-L35)

默认进程输入输出和超时预算。

<details>
<summary>查看原文（24行）</summary>

```text
export function createHookRunner(config = {}) {
  const configuredCommand = config.command;
  const command = configuredCommand ?? process.execPath;
  const commandArgs = config.commandArgs ?? [];
  if (typeof command !== "string" || !command.trim()) {
    throw new TypeError("command must name an executable");
  }
  if (
    !Array.isArray(commandArgs) ||
    commandArgs.some((x) => typeof x !== "string")
  ) {
    throw new TypeError("commandArgs must be an array of strings");
  }
  const timeoutMs = positiveInteger(config.timeoutMs, 10000, "timeoutMs");
  const maxOutputBytes = positiveInteger(
    config.maxOutputBytes,
    262144,
    "maxOutputBytes",
  );
  const maxInputBytes = positiveInteger(
    config.maxInputBytes,
    4194304,
    "maxInputBytes",
  );
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/runner.mjs:69-111](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/runner.mjs#L69-L111)

取消与超时终止/回收路径。

<details>
<summary>查看原文（43行）</summary>

```text
      const group = process.platform !== "win32";
      function kill(signalName) {
        if (!child?.pid) return;
        try {
          if (group) process.kill(-child.pid, signalName);
          else child.kill(signalName);
        } catch (error) {
          if (error.code !== "ESRCH") child.kill(signalName);
        }
      }
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        clearTimeout(terminationTimer);
        clearTimeout(drainTimer);
        signal?.removeEventListener("abort", abort);
        active.delete(record);
        if (error) reject(error);
        else resolve(stdout);
      }
      function terminate(error) {
        if (failure || finished) return;
        failure = error;
        kill("SIGTERM");
        terminationTimer = setTimeout(() => {
          kill("SIGKILL");
          escalated = true;
          if (closed) finish(failure);
        }, 250);
        drainTimer = setTimeout(() => {
          child?.stdin.destroy();
          child?.stdout.destroy();
          child?.stderr.destroy();
          finish(failure);
        }, 1000);
      }
      const abort = () => terminate(new Error("OMA hook was cancelled"));
      const timeout = setTimeout(() => {
        terminate(
          new Error(`OMA ${event} hook timed out after ${timeoutMs} ms`),
        );
      }, timeoutMs);
```

</details>

**依据 3 · 作者声明**：[integrations/dsh/README.md:49-73](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/README.md#L49-L73)

移除集成与首次写项目模板区别。

<details>
<summary>查看原文（25行）</summary>

````text
To remove it:

```sh
dsh plugin --profile web remove dsh-plugin-oma
```

## Use

When DSH creates the first agent in an uninitialized workspace, the plugin:

1. Finds the nearest Git root, or uses the workspace directory when it has no
   Git root.
2. Downloads the approximately 1 MB `agent-skills.tar.gz` release asset for
   `cli-v20.4.1`, checks its SHA-256 checksum, and verifies its version.
3. Copies missing project templates into `.agents/` and creates a minimal
   `.agents/oma-config.yaml`. Existing files are preserved.
4. Refreshes DSH's skill discovery before the first model turn.

An existing `.agents/oma-config.yaml` or `.agents/oma-config.cue` skips setup
and remains unchanged. Automatic setup installs project skills, rules,
workflows, agent definitions, configuration templates, and hooks. It does not
run the full `oma install` command or configure vendor tools in your home
directory. The generated configuration disables automatic CLI updates and
keeps `providers.code_intelligence_guard: off` until you configure a code
intelligence provider and its DSH tools.
````

</details>

**依据 4 · 源码核查**：[integrations/dsh/bridge.mjs:191-197](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/bridge.mjs#L191-L197)

pre异常拒绝会产生排障负担。

```text
    } catch (error) {
      if (inactive(agent, execution.signal)) return { kind: "cancel" };
      if (!(error instanceof WorkspaceSetupError)) report(error);
      return {
        kind: "deny",
        reason: `OMA hook could not validate this tool: ${error.message}`,
      };
```

#### 缺口

- 项目工具频率、hook耗时、误拒绝及模型继续费用未知
  **影响**：不支持净节时或低成本承诺
  **进一步探讨**：按完整合格任务记录hook耗时、误拒绝、继续次数、人工时间和模型费用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 持久未解决状态能否减少Stop上限被误读为通过？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设是保留有限继续机制，但将Stop通过/未解决及具体规则ID写入与会话绑定的持久验收记录，并在最终交付入口读取该记录。上限达到仍结束可以作为中断结果，而不是隐含成功；若需严格交付，用户显式确认或外部CI结果才能改变状态。由Q02仅warning退出推导，这不是已有功能。

代价是会话与规则版本绑定、状态过期处理、重试幂等及额外人审；不能把总是阻断作为质量改善。最小验证使用持续失败、修正成功、规则更改、会话恢复四种任务，对比现有日志与持久结果，记录错误放行、未解决定位时间、人工负担和循环次数。若原日志已足够、记录过期造成新误拒绝或人工成本更高则停止。

值得复用的现有工程是薄入口、protocol纯映射、runner进程所有权和setup最后激活各自分开。移植需宿主冻结参数、pre决策和continuation语义匹配，不能仅把hook名称换掉。当前采用限定为规则执行桥试用，不宣称完整质量门禁。

#### 证据与依据

**依据 1 · 源码核查**：[integrations/dsh/bridge.mjs:226-266](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/bridge.mjs#L226-L266)

上限后未解决warning提供假设起点。

<details>
<summary>查看原文（41行）</summary>

```text
  ctx.on("agent/turn-stopping", async ({ agent, turn, signal }) => {
    let state = stopStates.get(agent);
    if (state?.turn !== turn) {
      state = { turn, blocks: 0, inFlight: false, warned: false };
      stopStates.set(agent, state);
    }
    if (state.inFlight) return;
    state.inFlight = true;
    let reason;
    try {
      if (!(await active(agent, signal))) return;
      const payload = await hookPayload("Stop", agent);
      if (inactive(agent, signal)) return;
      const latest = assistantResponses.get(agent.session);
      if (latest?.turn === turn) payload.response = latest.text;
      const stdout = await runner.run("Stop", payload, {
        signal,
        owner: agent,
      });
      reason = stopReason(decodeOutput(stdout, "Stop"));
    } catch (error) {
      if (!inactive(agent, signal) && !(error instanceof WorkspaceSetupError))
        report(error);
      reason = `OMA stop validation failed: ${error.message}`;
    } finally {
      state.inFlight = false;
    }
    if (!reason || inactive(agent, signal)) return;
    if (state.blocks >= maxStopBlocks) {
      if (!state.warned) {
        state.warned = true;
        report(
          new Error(
            `Stop validation remains unresolved after ${maxStopBlocks} continuation requests: ${reason}`,
          ),
        );
      }
      return;
    }
    state.blocks += 1;
    agent.steer(message(reason));
```

</details>

**依据 2 · 源码核查**：[integrations/dsh/protocol.mjs:74-114](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/protocol.mjs#L74-L114)

纯决策映射便于明确宿主语义。

<details>
<summary>查看原文（41行）</summary>

```text
export function preDecision(output, argumentsValue) {
  const specific = output.hookSpecificOutput ?? {};
  const reason = [specific.permissionDecisionReason, output.reason].find(
    (value) => typeof value === "string" && value.trim(),
  );
  if (
    specific.permissionDecision === "deny" ||
    output.decision === "block" ||
    output.continue === false
  ) {
    return { kind: "deny", reason: reason || "Blocked by an OMA hook." };
  }
  const updatedInput = Object.hasOwn(specific, "updatedInput")
    ? specific.updatedInput
    : output.updatedInput;
  if (
    updatedInput !== undefined &&
    !isDeepStrictEqual(updatedInput, argumentsValue)
  ) {
    return {
      kind: "deny",
      reason: `OMA requested changed tool input. DSH 0.2.0-rc.2 freezes arguments before hooks; retry the tool with this required input: ${JSON.stringify(updatedInput)}`,
    };
  }
  if (specific.permissionDecision === "ask") {
    return { kind: "ask", ...(reason ? { reason } : {}) };
  }
  return undefined;
}

export function stopReason(output) {
  if (output.decision === "block" || output.continue === false) {
    return typeof output.reason === "string" && output.reason.trim()
      ? output.reason
      : "An OMA stop hook requires follow-up work.";
  }
  return undefined;
}

export function postContext(output) {
  return [hookContext(output), stopReason(output)].filter(Boolean).join("\n\n");
```

</details>

**依据 3 · 源码核查**：[integrations/dsh/runner.mjs:49-111](https://github.com/first-fluke/oh-my-agent/blob/5f0c34a8e7d0ea871e3793c12b89e91bd5e0628a/integrations/dsh/runner.mjs#L49-L111)

进程所有权与取消资源边界。

<details>
<summary>查看原文（63行）</summary>

```text
  function run(event, payload, { signal, owner, args } = {}) {
    if (disposed || signal?.aborted) {
      return Promise.reject(new Error("OMA hook was cancelled"));
    }
    const stdin = `${JSON.stringify(payload)}\n`;
    if (Buffer.byteLength(stdin) > maxInputBytes) {
      return Promise.reject(new Error("OMA hook input exceeds maxInputBytes"));
    }
    const record = { owner, cancel: undefined, done: undefined };
    record.done = new Promise((resolve, reject) => {
      let child;
      let failure;
      let outputBytes = 0;
      let stdout = "";
      let stderr = "";
      let terminationTimer;
      let drainTimer;
      let finished = false;
      let closed = false;
      let escalated = false;
      const group = process.platform !== "win32";
      function kill(signalName) {
        if (!child?.pid) return;
        try {
          if (group) process.kill(-child.pid, signalName);
          else child.kill(signalName);
        } catch (error) {
          if (error.code !== "ESRCH") child.kill(signalName);
        }
      }
      function finish(error) {
        if (finished) return;
        finished = true;
        clearTimeout(timeout);
        clearTimeout(terminationTimer);
        clearTimeout(drainTimer);
        signal?.removeEventListener("abort", abort);
        active.delete(record);
        if (error) reject(error);
        else resolve(stdout);
      }
      function terminate(error) {
        if (failure || finished) return;
        failure = error;
        kill("SIGTERM");
        terminationTimer = setTimeout(() => {
          kill("SIGKILL");
          escalated = true;
          if (closed) finish(failure);
        }, 250);
        drainTimer = setTimeout(() => {
          child?.stdin.destroy();
          child?.stdout.destroy();
          child?.stderr.destroy();
          finish(failure);
        }, 1000);
      }
      const abort = () => terminate(new Error("OMA hook was cancelled"));
      const timeout = setTimeout(() => {
        terminate(
          new Error(`OMA ${event} hook timed out after ${timeoutMs} ms`),
        );
      }, timeoutMs);
```

</details>

#### 缺口

- 最终交付误读是否是实际用户痛点，持久记录是否值得成本
  **影响**：假设不计已有技术或业务贡献
  **进一步探讨**：对四类任务比较错误放行与人工负担，无改善则停止

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
