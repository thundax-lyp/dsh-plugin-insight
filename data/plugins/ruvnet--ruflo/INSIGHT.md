# Ruflo

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[89b0cd0](https://github.com/ruvnet/ruflo/tree/89b0cd02dd99ea1f63437fde6c05992ec53cc22b)

<!-- BEGIN META -->
[![GitHub ★ 79,980](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=79%2C980&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ruvnet/ruflo) [![npm 30d 56,659](https://img.shields.io/static/v1?label=npm+30d&message=56%2C659&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/claude-flow)
<!-- END META -->

> **功能**：独立CLI/MCP工具平台，用项目内任务、Agent/模型登记、provider调用与状态记录辅助多Agent开发协调。

> **亮点**：统一协调操作和单次模型调用/观测，具局部重读、孤儿/锁及中央policy接线；不以角色数/演示/弱标签算自主交付或学习收益。见[Q01](#research-q01)至[Q04](#research-q04)。

> **主要限制**：本路径agent_execute是单次文本API而非工具结果回灌循环；task completed/API success不能验代码。多JSON/状态stop非事务/物理退出，schema剪裁只管广告；policy legacy/observe与enforce分开。见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · Ruflo根对象是什么，能为谁组织什么工作？](#detail-section-11)
  - [Q02 · 代表MCP链到底执行什么，结果怎样返回？](#detail-section-12)
  - [Q03 · 状态、权限、恢复与stop能保证到哪里？](#detail-section-13)
  - [Q04 · 路由提示和学习成功标签实际说明什么？](#detail-section-14)
  - [Q05 · 何时只观察，受控小样需要什么及怎样退出？](#detail-section-15)
  - [Q06 · 什么增量可证伪，什么时候只是修原工具？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为已有协调需求的开发者统一角色/模型、任务和调用结果记录；根为CLI/MCP工具，非DSH插件，登记不是自主工作。见[Q01](#research-q01)。

对照单Agent/原生Task和人工分配/独立测试清单；底层模型和客户端原生子Agent/工具不全算本项原创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 任务/Agent登记 | 角色/模型/分配/结果状态 | 登记非进程；completed不验代码 |
| agent_execute | 真实provider文本API/usage | 本链无自主工具循环；有条件切模型/追加成本 |
| MCP接口/策略 | registry、广告与policy门 | 广告剪裁非allowlist，legacy/observe不等enforce |
| 状态恢复/观测 | 部分重读/孤儿/锁、API health | 非跨JSON事务/硬退出或代码正确率 |
| 条件mod/反馈 | Claude路由上下文/API弱标签 | 非DSH通用契约/校准概率/已证学习效果 |

**流程与依赖**

匹配实际构建/Node、私有MCP/正确root与JSON写权限、真实provider/模型/额度必需；policy模式/身份和客户端特性另核，neural/mods等可选不全开。表见[Q05](#research-q05)。

隔离副本核dist/目录/调用方/policy→显式model/provider与零回退的一次分析→分开核API/文本/任务状态/代码测试→异常多状态对账→核物理请求/进程后退出。含执行者表见[Q05](#research-q05)。

**效果与成本**

构建/依赖、每轮模型与可能embedding/切模型、人工分配/合并/独立验收及多JSON恢复分开；timeout/输出数不是全任务费用上限，缓存折扣和净工时未测。表见[Q05](#research-q05)。

源码支持真实协调/文本调用与部分恢复/授权措施，不证明自主工作、任务质量/全局学习增益或更便宜；状态/API/验收分开。效果表见[Q05](#research-q05)。

> **思考**：本路径agent_execute是单次文本API而非工具结果回灌循环；task completed/API success不能验代码。多JSON/状态stop非事务/物理退出，schema剪裁只管广告；policy legacy/observe与enforce分开。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一协调操作和单次模型调用/观测，具局部重读、孤儿/锁及中央policy接线；不以角色数/演示/弱标签算自主交付或学习收益。见[Q01](#research-q01)至[Q04](#research-q04)。

可借鉴先中央policy再handler、结果重读保新修改、scope化API观测与部分锁/原子写；应明确广告/授权、API/质量和状态/物理退出，不能用局部机制概括全系统。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本路径agent_execute是单次文本API而非工具结果回灌循环；task completed/API success不能验代码。多JSON/状态stop非事务/物理退出，schema剪裁只管广告；policy legacy/observe与enforce分开。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，已有明确协调需求者最多在后续独立账户/隔离非敏感副本、匹配实际dist、私有受控stdio中核一项代表操作，并显式model/provider、小正有限输出和零fallback，不全开mods/neural/federation。分别核登记、API/stopReason、真实产物/测试和多文件状态，schema剪裁不当授权，task/agent stop不当请求/进程/外部动作撤回。身份、root、回执、费用或退出不清即停并人工读回，不能用本次单次文本接口承诺自主代码执行或生产多租户交付。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根/bin到stdio registry/policy、agent登记/execute真实API与结果、task状态、swarm孤儿/信号锁、条件Claude route mod/API反馈的代表核心及失败支路已核；非全workflow/native worker/neural/memory/federation/训练/安全/console或所有客户端审计，未运行。真实entry_type=tool。总体观察，最多后续在匹配构建、私有受控stdio/隔离非敏感副本、显式provider/model/零回退下核代表操作；需要自主代码执行Agent、生产多租户/硬资源退出或已证增益者不能凭本链采用。

- 已检查：作者 README、包清单、源码路径 README.md、bin/cli.js、package.json、plugins/ruflo-mods/hooks/register.ts、plugins/ruflo-mods/hooks/route/index.ts、plugins/ruflo-mods/hooks/route/route-task.ts、v3/@claude-flow/cli/bin/cli.js、v3/@claude-flow/cli/package.json、v3/@claude-flow/cli/src/mcp-client.ts、v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts、v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts、v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts、v3/@claude-flow/cli/src/mcp-tools/task-tools.ts、v3/@claude-flow/cli/src/services/policy-runtime.ts、v3/@claude-flow/security/src/mcp-caller-identity.ts、v3/@claude-flow/security/src/policy/engine.ts、v3/@claude-flow/security/src/policy/evaluator.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根/v3包与bin stdio、MCP registry/调用/中央policy代表模式与身份开关、agent_spawn/execute provider选路/Anthropic单次请求/有条件回退/反馈/归档、task assign/complete/cancel、Agent terminate/health、swarm孤儿/写入和pheromone锁caller、Claude mod路由注册/静态提示。只核与采用直接相关代表链；未全审已构建发行字节/全部provider与native工作/工具循环、workflow/安全/授权/成本规则、neural/训练/memory/federation/console/各客户端实现；未执行目标。
- 下一步：后续固定隔离构建/私有调用方/模型预算，对照单Agent/原生Task，独立验代码/测试与API/业务成功，测JSON并发/错误/在途terminate、schema隐藏call/policy模式/弱标签和恢复费用；未满足身份/退出不扩用。

**分析版本**

- **仓库**：[ruvnet/ruflo](https://github.com/ruvnet/ruflo)
- **版本号**：3.63.8（[固定提交 89b0cd0](https://github.com/ruvnet/ruflo/tree/89b0cd02dd99ea1f63437fde6c05992ec53cc22b)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

先复用/检查现有quality hook，以独立产物验收分开API弱反馈，并把登记/请求/工作退出分层；简单原生Task/人工清单或小修够用就否定新编排产品。见[Q06](#research-q06)。

后续固定隔离构建/私有调用方/模型预算，对照单Agent/原生Task，独立验代码/测试与API/业务成功，测JSON并发/错误/在途terminate、schema隐藏call/policy模式/弱标签和恢复费用；未满足身份/退出不扩用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2212 | 479617 | — | — | 2087684 |
| .cjs | source | 28 | 11145 | 7507 | 2962 | — |
| .mjs | source | 377 | 71134 | 50879 | 14549 | — |
| .js | source | 73 | 24755 | 19559 | 3939 | — |
| .ts | source | 2260 | 648368 | 458850 | 115746 | — |
| .mjs | test | 106 | 11349 | 9505 | 1080 | — |
| .ts | test | 1415 | 305871 | 238612 | 23082 | — |
| .mts | source | 6 | 598 | 568 | 25 | — |
| .ts | example | 85 | 19167 | 14331 | 2543 | — |
| .md | example | 23 | 993 | — | — | 3946 |
| .mjs | example | 3 | 68 | 51 | 9 | — |
| .cjs | test | 9 | 859 | 732 | 77 | — |
| .cjs | example | 2 | 23 | 16 | 7 | — |
| .tsx | source | 79 | 14108 | 12916 | 238 | — |
| .js | example | 1 | 2 | 1 | 1 | — |
| .md | test | 10 | 2257 | — | — | 9038 |

</details>

**活跃度**

[![Issue 未关闭 659](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=659&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 257](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=257&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 271](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=271&color=737b86&logo=github)](https://github.com/ruvnet/ruflo/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定根MCP代表链的真实执行/状态/权限/反馈边界能否支持多Agent软件交付及更小可验证方向？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Ruflo根对象是什么，能为谁组织什么工作？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

仓库称Ruflo，固定根npm名claude-flow 3.63.8、MIT、Node>=20，bin是claude-flow→bin/cli.js→仓库v3/@claude-flow/cli/bin/cli.js；v3包@claude-flow/cli同版，继续导入构建dist。根不是DSH原生插件；这是独立CLI/MCP工具和客户端专用扩展集合，根entry_type=tool。README的ruflo命令/多客户端安装方式不等本轮下载/执行过对应npm发行或各扩展，源码checkout未跟踪那两个构建dist入口，试用还需核实际构建/发行字节，不能把可读TS当已装可用。

主要对象是已明确需要多个Agent的软件开发者，用同项目状态、角色/模型记录、MCP操作和可观察入口组织任务分工；合格交付应是独立验收的代码/测试结果与可恢复状态，而非mission创建、Agent数或completed。相对手工协调/原生单Agent或Task，本轮可支持的是登记、调用和结果归档的统一接口，不是“上百角色就等于上百工作进程”。模型能力和Claude/Codex等原生工具/子Agent执行不都属于本项原创，也不外推Claude专用mods到DSH。

本轮限定根stdio MCP→registry/policy→agent_spawn/agent_execute、task状态和一条swarm恢复/信号锁、API反馈及Claude route mod代表链；未全审其他CLI命令、全部workflow/native worker、neural/memory/federation、安全/console/各客户端mods与训练。所核agent_execute有真实模型API，却是单次prompt到文本回复和状态归档，不是自己执行工具、将工具结果回灌再决定的代码Agent循环；不据此否定未审全项目其他执行方式。

旧正式631c1557b5f325163c4f9f029a397bb30a61c730四题、全部findings/自代码依赖及7份原文路径已只读复核作线索。本轮补实际入口、MCP policy caller、advertise与授权差异、登记/单次API/任务状态及停止的分层；未运行目标/安装/测试、模型API或客户端配置。作者自己说明录屏中的mission/页面/被拒stop不证明swarm工作完成或memory recall，不能拿演示当业务验收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-16](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/package.json#L1-L16)

根claude-flow版本与bin。

<details>
<summary>查看原文（16行）</summary>

```text
{
  "name": "claude-flow",
  "version": "3.63.8",
  "workspaces": [
    "v3/@claude-flow/codex",
    "v3/@claude-flow/mcp",
    "v3/@claude-flow/plugin-agent-federation",
    "v3/@claude-flow/security"
  ],
  "description": "Ruflo - Enterprise AI agent orchestration for Claude Code. Deploy 60+ specialized agents in coordinated swarms with self-learning, fault-tolerant consensus, vector memory, and MCP integration",
  "main": "dist/index.js",
  "type": "module",
  "bin": {
    "claude-flow": "bin/cli.js"
  },
  "homepage": "https://github.com/ruvnet/claude-flow#readme",
```

</details>

**依据 2 · 源码核查**：[package.json:170-172](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/package.json#L170-L172)

Node要求。

```text
  "engines": {
    "node": ">=20.0.0"
  },
```

**依据 3 · 源码核查**：[package.json:213-213](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/package.json#L213-L213)

MIT许可。

```text
  "license": "MIT",
```

**依据 4 · 源码核查**：[bin/cli.js:1-11](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/bin/cli.js#L1-L11)

真实根到v3入口。

<details>
<summary>查看原文（11行）</summary>

```text
#!/usr/bin/env node
/**
 * Claude Flow CLI - Umbrella entry point
 * Proxies to @claude-flow/cli bin for cross-platform compatibility.
 */
import { pathToFileURL, fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '..', 'v3', '@claude-flow', 'cli', 'bin', 'cli.js');
await import(pathToFileURL(cliPath).href);
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/package.json:1-14](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/package.json#L1-L14)

同版子CLI及dist/bin。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "@claude-flow/cli",
  "version": "3.63.8",
  "type": "module",
  "description": "Ruflo CLI - Enterprise AI agent orchestration with 60+ specialized agents, swarm coordination, MCP server, self-learning hooks, and vector memory for Claude Code",
  "main": "dist/src/index.js",
  "types": "dist/src/index.d.ts",
  "sideEffects": false,
  "bin": {
    "cli": "bin/cli.js",
    "claude-flow": "bin/cli.js",
    "claude-flow-mcp": "bin/mcp-server.js"
  },
  "homepage": "https://github.com/ruvnet/claude-flow#readme",
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:182-186](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/bin/cli.js#L182-L186)

stdio真实加载dist MCP client/policy。

```text
} else if (isMCPMode) {
  // Run MCP server mode
  const { listMCPTools, callMCPTool, hasTool } = await import('../dist/src/mcp-client.js');
  const { isPolicyEnforcementEnabled, loadMcpPolicy, evaluateToolCall } =
    await import('../dist/src/mcp-tools/policy-enforcer.js');
```

**依据 7 · 作者声明**：[README.md:148-160](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/README.md#L148-L160)

作者界定演示范围，不替独立验证。

<details>
<summary>查看原文（13行）</summary>

```text
### One task: create a mission with Claude

<img src="docs/assets/readme/console-icon-workflows.svg" width="28" height="28" alt=""> **Watch the recorded console session below.** Claude creates a mission, opens the Learning and Security pages, and reports its actions in Overview.

1. **Set the boundary.** Install the console using the commands below, open `/ruflo`, then choose **Settings → Claude control → write + ask**.
2. **Give a concrete request.** Try: “Create a mission to add a dark mode toggle. Show me the mission and its status.”
3. **Approve creation.** Claude opens Missions and sets the goal. Confirm the pending create action in the console.
4. **Verify the result.** Check that Missions contains the goal and Overview records the action. Creating a mission does not mean the feature has been implemented.
5. **Keep control.** **Take back control** pauses Claude's console tools. A later call should be refused until you restore control.

**What the recording demonstrates:** a real Claude Haiku session with `write + auto`, mission creation, page navigation, a refused swarm stop, and control being taken back. The steps above use `ask` so you approve creation yourself. The linked workflow animation uses sample data, while the theme demo replays renderer frames. Neither is evidence of completed swarm work or memory recall.

[Implementation and recorded test findings](v3/docs/adr/ADR-444-claude-controls-the-console.md) · [Reproduction script](plugins/ruflo-console/scripts/e2e-control.sh)
```

</details>

#### 缺口

- 实际发行/dist和客户端兼容、完整Agent工作及协调收益未验
  **影响**：不能将TS/命令数/演示视为安装推荐或自主代码交付；先观察，最多受控副本核代表操作
  **进一步探讨**：后续固定构建/发行、私有stdio与非敏感任务，和单Agent/原生Task比较验收产物、重复/恢复与总用量。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 代表MCP链到底执行什么，结果怎样返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根stdio分支listMCPTools与callMCPTool不是占位：mcp-client把agent/swarm/task等数组注册到TOOL_REGISTRY，tools/call查hasTool后调callMCPTool；后者先authorizeMcpTool，再真实tool.handler，结果以JSON文本/isError回MCP。协议返回不代表用户任务合格，显式error字符串会作工具错误；宿主接结果后的下一步决策在客户端，不在这个stdio路由里。

agent_spawn先determineAgentModel，显式model可直接返回、否则task可触发增强/embedding路由；登记idle、初始health=1.0、taskCount=0、config/createdAt/model/provider后save，并尝试同步swarm数组。它没有在所核handler创建OS Agent工作进程；role登记、swarm容量或health种子不证明工作开始。agent_execute另经identifier/text校验及pheromone eligibility后调用共享executeAgentTask，后者读非terminated记录、取配置instructions/model/provider，先busy/taskCount+1并存盘，再实际调用provider。

代表Anthropic路径按环境/agent provider等选择backend，POST所配base URL /v1/messages，附凭据、system可带ephemeral缓存提示、单条user prompt和max_tokens；本地AbortController timer默认60秒、默认输出1024。响应只提text块，返回stopReason/usage/messageId/duration；没有tools定义、工具执行器或tool_result→下一模型调用的自主循环。这是真实文本API请求，不是完整编码执行；Ollama/OpenRouter兼容分支有接线，但本轮不全审它们/所有第三方契约。缓存hint不保证命中，更不引用代码注释的折扣当实测节费。

失败可以触发cost-optimal候选回退：只有result失败且agent.modelId存在、budget>0、首错匹配429/5xx/timeout等、embedding和候选可用才进loop。env parse默认1次回退（非总调用/费用限额）；每次可换模型，alt调用未重新传agent.provider，不能保证始终同一provider/数据接收方，实际按router/key选择。小样应显式固定model/provider并将CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES=0，不把所有异常自动重试当无副作用/无追加费用。

完成时重新读取注册表，只有同createdAt记录才写回，不将新注册覆盖；若busy按本进程remaining count更新idle，用户期间改的model选择/health尽量保留，executionHistory记录调用结果。AgentExecuteResult成功仅表示API响应及文本/用量返回，stopReason仍可能输出截断，不证明已改文件/测试通过。task_assign只写assignedTo/agent busy/currentTask/in_progress，task_complete接收调用方result便progress100/completed；这些任务状态不是agent_execute结果自动通过独立验收的事务。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:298-337](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/bin/cli.js#L298-L337)

真实tool call/返回与可选旧policy门。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/call': {
        const toolName = params.name;
        const toolParams = params.arguments || {};

        if (!hasTool(toolName)) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          };
        }

        if (isPolicyEnforcementEnabled()) {
          const check = evaluateToolCall(loadMcpPolicy(), sessionId, toolName);
          if (!check.allowed) {
            return {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32001, message: `Policy denied: ${check.reason}` },
            };
          }
        }

        try {
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio' });
          // Failed task outcomes are data; an explicit handler error is a tool failure.
          const isError = result !== null && typeof result === 'object'
            && typeof result.error === 'string' && result.error.trim().length > 0;
          return {
            jsonrpc: '2.0',
            id: message.id,
            result: { content: [{ type: 'text', text: JSON.stringify(result, null, 2) }], isError },
          };
        } catch (error) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: {
              code: -32603,
              message: error instanceof Error ? error.message : 'Tool execution failed',
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:130-145](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-client.ts#L130-L145)

实际工具注册。

<details>
<summary>查看原文（16行）</summary>

```text

// Register all tools
function registerTools(tools: MCPTool[]): void {
  tools.forEach(tool => {
    TOOL_REGISTRY.set(tool.name, tool);
  });
}

// Initialize registry with all available tools
registerTools([
  ...agentTools,
  ...swarmTools,
  ...memoryTools,
  ...configTools,
  ...hooksTools,
  ...taskTools,
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:255-288](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-client.ts#L255-L288)

统一policy→handler→结果guardrail。

<details>
<summary>查看原文（34行）</summary>

```text
export async function callMCPTool<T = unknown>(
  toolName: string,
  input: Record<string, unknown> = {},
  context?: Record<string, unknown>
): Promise<T> {
  // Look up tool in registry
  const tool = TOOL_REGISTRY.get(toolName);

  if (!tool) {
    throw new MCPClientError(
      `MCP tool not found: ${toolName}`,
      toolName
    );
  }

  try {
    // ADR-324: one policy chokepoint for every local CLI/MCP invocation.
    // Policy administration is not exempt: authorization calls the engine
    // directly, so there is no recursive MCP dispatch. In enforce mode an
    // administrator must explicitly allow policy.* actions or use the local
    // CLI bootstrap path.
    const decision = await authorizeMcpTool(toolName, input, context, classifyMcpTool(toolName));
    if (decision.enforcedOutcome !== 'allowed') {
      throw new Error(`policy-${decision.enforcedOutcome}:${decision.reason}; receipt=${decision.receiptId}`);
    }
    // Call the tool handler
    const result = await tool.handler(input, context);
    // ADR-146 P2: scan every tool result for indirect-injection before it
    // returns to the caller. The screen is opt-in via env (default off in
    // 3.10.34 — flip to default in v4) so existing pipelines keep their
    // exact behaviour while the call site is exercised by tests and
    // adopters. Telemetry from the screen lands in the shared
    // GuardrailEvent sink (P5).
    return applyContentBoundaryGuardrail(toolName, result) as T;
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:188-205](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L188-L205)

显式model优先及task路由条件。

<details>
<summary>查看原文（18行）</summary>

```text
  // 1. Explicit model in config
  if (config.model) {
    const explicitModel = config.model as string;
    if (['haiku', 'sonnet', 'opus', 'opus-4.7', 'inherit'].includes(explicitModel)) {
      return { model: explicitModel as ClaudeModel, routedBy: 'explicit' };
    }
    // #2962 — a non-alias model string (e.g. an Ollama tag like
    // 'qwen3.6:27b', or any other provider-native model id) is still an
    // explicit user selection. Route it through the modelId fast-path
    // (executeAgentTask already prefers agent.modelId over
    // MODEL_MAP[agent.model] — ADR-149 iter 13) instead of falling through
    // to task-based routing / agent-type defaults, which silently
    // substituted 'sonnet' and discarded the user's request.
    return { model: 'sonnet', routedBy: 'explicit', modelId: explicitModel };
  }

  // 2. Enhanced task-based routing with deterministic Tier-1 codemods
  if (task) {
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:351-393](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L351-L393)

登记字段与持久化，不是进程启动。

<details>
<summary>查看原文（43行）</summary>

```text
      // Get task from either top-level or config (CLI passes it in config.task)
      const task = (input.task as string) || (config.task as string) || undefined;

      // Determine model using ADR-026 3-tier routing logic
      const routingResult = await determineAgentModel(
        agentType,
        config,
        task
      );

      // #2962 — an explicit, unambiguous provider choice in config wins over
      // the router's own pick. 'anthropic' is deliberately excluded: the CLI's
      // `agent spawn` action always sets config.provider (defaulting to
      // 'anthropic' when --provider isn't passed — commands/agent.ts), so
      // 'anthropic' here is indistinguishable from that silent default.
      // 'ollama'/'openrouter' are never silently defaulted and are unambiguous.
      const explicitConfigProvider =
        config.provider === 'ollama' || config.provider === 'openrouter'
          ? (config.provider as 'ollama' | 'openrouter')
          : undefined;

      const agent: AgentRecord = {
        agentId,
        agentType,
        ...(name ? { name } : {}),
        status: 'idle',
        health: 1.0,
        taskCount: 0,
        config,
        createdAt: new Date().toISOString(),
        domain: input.domain as string,
        model: routingResult.model,
        modelRoutedBy: routingResult.routedBy,
        ...(routingResult.modelId ? { modelId: routingResult.modelId } : {}),
        ...(explicitConfigProvider
          ? { provider: explicitConfigProvider }
          : routingResult.provider ? { provider: routingResult.provider } : {}),
        ...(routingResult.openrouterModel ? { openrouterModel: routingResult.openrouterModel } : {}),
      };

      const store = loadAgentStore();
      store.agents[agentId] = agent;
      saveAgentStore(store);
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:520-543](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L520-L543)

真实execute校验/eligibility→共享core。

<details>
<summary>查看原文（24行）</summary>

```text
    handler: async (input) => {
      const vId = validateIdentifier(input.agentId, 'agentId');
      if (!vId.valid) return { success: false, error: `Input validation failed: ${vId.error}` };
      const vP = validateText(input.prompt as string, 'prompt');
      if (!vP.valid) return { success: false, error: `Input validation failed: ${vP.error}` };
      const pheromone = pheromoneAgentEligibility(input.agentId as string);
      if (!pheromone.eligible) {
        return {
          success: false,
          agentId: input.agentId,
          suspended: true,
          error: pheromone.reason,
        };
      }

      // Delegate to the shared core (also used by the workflow runtime).
      return executeAgentTask({
        agentId: input.agentId as string,
        prompt: input.prompt as string,
        systemPrompt: input.systemPrompt as string | undefined,
        maxTokens: input.maxTokens as number | undefined,
        temperature: input.temperature as number | undefined,
        timeoutMs: input.timeoutMs as number | undefined,
      });
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:615-686](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L615-L686)

core读registry/配置、先存busy与真实provider caller。

<details>
<summary>查看原文（72行）</summary>

```text
export async function executeAgentTask(input: AgentExecuteInput): Promise<AgentExecuteResult> {
  const store = loadAgentStore();
  const agent = store.agents[input.agentId];
  if (!agent) return { success: false, agentId: input.agentId, error: 'Agent not found' };
  if (agent.status === 'terminated') return { success: false, agentId: input.agentId, error: 'Agent has been terminated' };

  // ADR-149 iter 13 — first-call dispatch prefers `agent.modelId` (the
  // cost-optimal pick from the neural backend) over `MODEL_MAP[agent.model]`
  // when present. Before this fix the first attempt always used the tier
  // mapping; only the iter-7 fallback chain used modelId on retry, which
  // meant the cost-optimal pick was wasted unless the first call failed
  // with a 429/5xx.
  //
  // Rules:
  //   - agent.modelId is set AND it's a non-Anthropic slug (e.g.
  //     'inclusionai/ling-2.6-flash', 'openai/gpt-4.1') → dispatch
  //     directly via that id. callAnthropicMessages forwards non-Anthropic
  //     ids through OpenRouter (#2042), so this gets us the cost-optimal
  //     model on attempt 1.
  //   - agent.modelId starts with 'anthropic/' → strip the prefix, use the
  //     bare Anthropic id (e.g. 'anthropic/claude-haiku-4.5' → 'claude-haiku-4.5').
  //   - agent.modelId is unset (no neural backend fired) → fall back to the
  //     legacy tier-mapped MODEL_MAP path. Existing behaviour preserved.
  let firstCallModel: string;
  if (agent.modelId) {
    firstCallModel = agent.modelId.startsWith('anthropic/')
      ? agent.modelId.slice('anthropic/'.length)
      : agent.modelId;
  } else {
    firstCallModel = resolveAnthropicModel(agent.model || 'sonnet');
  }
  // Kept for legacy error-path remediation message + final-result `model` field
  // (returned when the request fully fails with no successful retry).
  const anthropicModel = firstCallModel;
  // The agent registry persists per-agent instructions, including those set
  // through agent_update. Workflow steps do not supply a systemPrompt, so
  // omitting this fallback silently discards the configured agent context.
  const configuredInstructions = typeof agent.config?.instructions === 'string' && agent.config.instructions.trim()
    ? agent.config.instructions
    : undefined;
  const systemPrompt = input.systemPrompt ||
    configuredInstructions ||
    `You are a ${agent.agentType} agent operating as part of a Ruflo swarm. ` +
    `Agent ID: ${input.agentId}. Domain: ${agent.domain ?? 'general'}. ` +
    `Respond directly and stay focused on the task. If you need information you don't have, state that explicitly.`;

  const initialModelId = agent.modelId;
  const initialModel = agent.model;
  agent.status = 'busy';
  agent.taskCount = (agent.taskCount || 0) + 1;
  saveAgentStore(store);

  const executionKey = JSON.stringify([getAgentPath(), input.agentId, agent.createdAt]);
  activeExecutions.set(executionKey, (activeExecutions.get(executionKey) || 0) + 1);
  try {
  const startedAt = Date.now();

  // #2042 — delegate to callAnthropicMessages so the v3 provider router
  // (Anthropic / Ollama / OpenRouter) governs which backend is hit.
  // #2962 — forward the agent's own explicit provider (set at spawn time
  // from --provider / persisted config) so it outranks env-var inference.
  // Only the first-attempt call; the ADR-149 fallback-retry call below is
  // driven by the cost-optimal neural router picking model-id alternatives,
  // an orthogonal mechanism left as-is to avoid unintended interaction.
  let result = await callAnthropicMessages({
    model: anthropicModel,
    prompt: input.prompt,
    systemPrompt,
    maxTokens: input.maxTokens,
    temperature: input.temperature,
    timeoutMs: input.timeoutMs,
    provider: agent.provider,
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:171-207](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L171-L207)

provider优先/分支。

<details>
<summary>查看原文（37行）</summary>

```text
export async function callAnthropicMessages(input: AnthropicCallInput): Promise<AnthropicCallResult> {
  // #2962 — precedence: explicit per-agent flag (input.provider, forwarded
  // from agent.provider by executeAgentTask, itself populated from a
  // user's `agent spawn --provider` flag) → env vars (RUFLO_PROVIDER + the
  // *_API_KEY family — unchanged back-compat surface) → persisted
  // `agents.providers` config (`providers configure`) → the original
  // key-presence inference, kept below as the last-resort fallback.
  const explicitProvider = (input.provider || process.env.RUFLO_PROVIDER || '').toLowerCase();
  const ollamaKey = process.env.OLLAMA_API_KEY;
  const anthropicAuthToken = process.env.ANTHROPIC_AUTH_TOKEN;
  // A gateway bearer token is also an Anthropic credential for provider inference.
  const anthropicKey = process.env.ANTHROPIC_API_KEY || anthropicAuthToken;
  // #2042 — OpenRouter is an OpenAI-compat endpoint that fronts dozens of
  // providers. Reporter (@ummcke00) had `providers.openrouter.apiKey` in
  // their config.yaml but agent_execute hardcoded Anthropic. Detect via
  // explicit RUFLO_PROVIDER=openrouter OR presence of OPENROUTER_API_KEY
  // when no Anthropic key is available (same precedence as the Ollama
  // branch above).
  const openrouterKey = process.env.OPENROUTER_API_KEY;
  const useOpenRouter =
    explicitProvider === 'openrouter' || (!explicitProvider && !anthropicKey && !!openrouterKey);
  // #2962 — only consult the persisted config when a candidate is actually
  // relevant (explicit choice, or no env key found anywhere), so a normal
  // ANTHROPIC_API_KEY-only setup never pays a config-file read.
  const persistedOllama =
    explicitProvider === 'ollama' || (!anthropicKey && !openrouterKey && !ollamaKey)
      ? getPersistedProviderConfig('ollama')
      : undefined;
  const persistedOpenRouter =
    explicitProvider === 'openrouter' && !openrouterKey ? getPersistedProviderConfig('openrouter') : undefined;
  const useOllama =
    explicitProvider === 'ollama' || (!explicitProvider && !anthropicKey && !openrouterKey && (!!ollamaKey || !!persistedOllama));

  if (useOpenRouter) {
    const apiKey = openrouterKey || persistedOpenRouter?.apiKey;
    if (apiKey) {
      return callOpenAICompat({
```

</details>

**依据 9 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:251-314](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L251-L314)

真实单次Anthropic POST及text-only结果。

<details>
<summary>查看原文（64行）</summary>

```text
  const model = input.model || DEFAULT_ANTHROPIC_MODEL;
  const startedAt = Date.now();
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(anthropicAuthToken
          ? { Authorization: `Bearer ${anthropicAuthToken}` }
          : { 'x-api-key': anthropicKey }),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: input.maxTokens || 1024,
        // #2357 — omit temperature for models that reject sampling params
        // (Fable 5 / Opus 4.8 / Opus 4.7 → 400 "Extra inputs are not
        // permitted"); keep the 0.7 default unchanged for models that still
        // accept it (sonnet / haiku / opus ≤4.6).
        ...(modelRejectsSamplingParams(model)
          ? {}
          : { temperature: typeof input.temperature === 'number' ? input.temperature : 0.7 }),
        // #8 prompt caching (hermes-agent pattern): mark the (often large,
        // stable) system prompt as an ephemeral cache breakpoint so repeated
        // agent_execute calls with the same system prompt hit Anthropic's
        // prompt cache (~90% discount on cached input tokens, 5-min TTL).
        ...(input.systemPrompt
          ? { system: [{ type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } }] }
          : {}),
        messages: [{ role: 'user', content: input.prompt }],
      }),
      signal: controller.signal,
    });
    if (!res.ok) {
      const errText = await res.text().catch(() => '<unreadable error body>');
      return { success: false, model, error: `Anthropic API error ${res.status}: ${errText.slice(0, 400)}` };
    }
    const data = await res.json() as {
      id: string;
      model: string;
      content: Array<{ type: string; text?: string }>;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };
    const textOut = data.content
      .filter(c => c.type === 'text' && typeof c.text === 'string')
      .map(c => c.text as string)
      .join('');
    return {
      success: true,
      model: data.model,
      messageId: data.id,
      stopReason: data.stop_reason,
      output: textOut,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      durationMs: Date.now() - startedAt,
    };
```

</details>

**依据 10 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:695-736](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L695-L736)

有条件回退/预算与alt调用。

<details>
<summary>查看原文（42行）</summary>

```text
  const configuredFallbackBudget = parseInt(process.env.CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES ?? '1', 10);
  const fallbackBudget = Number.isNaN(configuredFallbackBudget) ? 1 : Math.max(0, configuredFallbackBudget);
  const fallbackHistory: Array<{ modelId: string; error: string }> = [];
  // Keep feedback for each completed attempt before switching model identity.
  const failedAttempts: Array<{ model: ClaudeModel; modelId: string }> = [];
  if (!result.success && agent.modelId && fallbackBudget > 0) {
    const isRetryable = /\b(429|500|502|503|504|timeout|ECONNRESET|ETIMEDOUT)\b/i.test(result.error ?? '');
    if (isRetryable) {
      try {
        const { nextCostOptimalAlternative } = await import('../ruvector/neural-router.js');
        // ADR-149 iter 9 — delegate to the shared task-embedder LRU. The
        // pipeline + cache are shared with agent-tools.ts, so the embedding
        // for this prompt is almost always already cached from the initial
        // routing decision (no extra inference cost in steady state).
        const { embedTaskWithCache } = await import('../ruvector/task-embedder.js');
        const embedding = await embedTaskWithCache(input.prompt);
        if (embedding) {
          const excludeIds: string[] = [agent.modelId];
          for (let attempt = 0; attempt < fallbackBudget && !result.success; attempt++) {
            fallbackHistory.push({ modelId: excludeIds[excludeIds.length - 1], error: result.error ?? '' });
            const alt = await nextCostOptimalAlternative(embedding, excludeIds);
            if (!alt || !alt.modelId) break;
            excludeIds.push(alt.modelId);
            const altResult = await callAnthropicMessages({
              model: alt.modelId,
              prompt: input.prompt,
              systemPrompt,
              maxTokens: input.maxTokens,
              temperature: input.temperature,
              timeoutMs: input.timeoutMs,
            });
            // Record the model that ACTUALLY answered (or errored). On success,
            // update agent.modelId so downstream observers see the retry winner.
            failedAttempts.push({ model: agent.model ?? 'sonnet', modelId: agent.modelId! });
            agent.modelId = alt.modelId;
            agent.model = alt.model;
            result = altResult;
          }
        }
      } catch {
        // Fallback chain is best-effort — preserve the original error result.
      }
```

</details>

**依据 11 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:832-877](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L832-L877)

重读/保用户修改与结果归档。

<details>
<summary>查看原文（46行）</summary>

```text
  const remaining = (activeExecutions.get(executionKey) || 1) - 1;
  const persistCompletion = (out?: AgentExecuteResult): void => {
    // Awaited provider/feedback work may have overlapped registration, updates,
    // termination or deletion. Never replace that newer registry snapshot.
    const latest = loadAgentStore();
    const current = latest.agents[input.agentId];
    if (!current || current.createdAt !== agent.createdAt) return;
    if (current.status === 'busy') current.status = remaining > 0 ? 'busy' : 'idle';
    if (agent.modelId !== initialModelId && current.modelId === initialModelId) {
      // A fallback may also change its tier. Carry that change with the model
      // ID, but preserve any selection the user edited during the request.
      if (agent.model !== initialModel && current.model === initialModel) current.model = agent.model;
      current.modelId = agent.modelId;
    }
    if (out) current.lastResult = out as unknown as Record<string, unknown>;
    const previousMeasuredHealth = summarizeAgentExecutions(current.executionHistory).health;
    const mayUpdateStoredHealth = previousMeasuredHealth === null
      ? current.health === agent.health
      : current.health === previousMeasuredHealth;
    current.executionHistory = appendAgentExecution(current.executionHistory, {
      at: new Date().toISOString(),
      success: result.success,
      durationMs: result.durationMs ?? Date.now() - startedAt,
    });
    // An explicit agent_update during the provider call still wins. The
    // measured value remains available from executionHistory in agent_health.
    if (mayUpdateStoredHealth) {
      current.health = summarizeAgentExecutions(current.executionHistory).health ?? current.health;
    }
    saveAgentStore(latest);
  };

  if (result.success) {
    const out: AgentExecuteResult = {
      success: true,
      agentId: input.agentId,
      messageId: result.messageId,
      model: result.model,
      stopReason: result.stopReason,
      output: result.output,
      usage: result.usage,
      durationMs: result.durationMs ?? Date.now() - startedAt,
      ...(fallbackHistory.length > 0 ? { fallbackHistory } : {}),
    };
    persistCompletion(out);
    return out;
```

</details>

**依据 12 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:480-518](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L480-L518)

assign状态更新非模型执行。

<details>
<summary>查看原文（39行）</summary>

```text
      const store = loadTaskStore();
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (!task) {
        return { taskId, error: 'Task not found' };
      }

      const previouslyAssigned = [...task.assignedTo];

      // Load agent store to sync worker state
      const agentStorePath = join(getProjectCwd(), STORAGE_DIR, 'agents', 'store.json');
      readRecordStore<{ agents: Record<string, Record<string, unknown>> }>(
        agentStorePath, 'agents', () => ({ agents: {} }),
      );
      if (input.unassign) {
        // Revert previously assigned agents to idle
        releaseAgents(previouslyAssigned, taskId);
        task.assignedTo = [];
      } else {
        const agentIds = (input.agentIds as string[]) || [];
        // Revert old agents to idle
        releaseAgents(previouslyAssigned.filter((id) => !agentIds.includes(id)), taskId);
        // Set new agents to active
        updateAgents(agentIds, (agent) => {
          agent.status = 'busy';
          agent.currentTask = taskId;
        });
        task.assignedTo = agentIds;
        // Auto-transition task to in_progress if pending
        if (task.status === 'pending' && agentIds.length > 0) {
          task.status = 'in_progress';
          if (!task.startedAt) {
            task.startedAt = new Date().toISOString();
          }
        }
      }

      saveTaskStore(store);
```

</details>

**依据 13 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:305-329](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L305-L329)

complete按输入标状态/释放，不独立验产物。

<details>
<summary>查看原文（25行）</summary>

```text
    handler: async (input) => {
      // Validate user-provided input (#1425)
      const vId = validateIdentifier(input.taskId, 'taskId');
      if (!vId.valid) return { success: false, error: vId.error };

      const store = loadTaskStore();
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (task) {
        if (task.status === 'completed') {
          return { taskId: task.taskId, status: task.status, completedAt: task.completedAt, result: task.result };
        }
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.result = (input.result as Record<string, unknown>) || {};
        saveTaskStore(store);

        // Sync assigned agents back to idle and increment taskCount
        updateAgents(task.assignedTo, (agent) => {
          if (agent.currentTask === taskId) {
            agent.status = 'idle';
            agent.currentTask = null;
          }
```

</details>

#### 缺口

- 真实API/路由/构建兼容与完整软件交付未运行，未审所有worker/provider
  **影响**：可证明登记+单次模型调用，不支持把它当在线工具执行Agent或完成任务的验收依据
  **进一步探讨**：后续隔离项目固定一个provider/model、零回退/小正有限输出预算，分别核API请求/文本、实际文件/测试和宿主下一步，不用状态计数替代。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 状态、权限、恢复与stop能保证到哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

项目有真实恢复措施但范围有限。swarm load会按可选PID或无PID且有效updatedAt超过24小时协调running孤儿；当前init只有config.trackHostProcess===true才记本机process.pid，普通短CLI不把其PID当swarm寿命。即使PID活着也只是owner/记录条件，不证明每个登记Agent在运行。swarm保存随机tmp、0600参数再rename；recordSwarmPheromoneSignal实际在wx锁、100轮等待/过期锁处理里load-modify-save，不能由此泛称所有Agent/task/swarm写都有同一锁/事务。

execute core自己的JSON load解析失败会回空registry，save是直接writeFileSync；task save也直接写且和Agent store分开。spawn还分别更新agent/swarm；task assign/complete/cancel分别改多处状态。因此有部分原子写/锁/重读保护不等跨进程/跨文件exactly-once或崩溃自动恢复。busy/taskCount是尝试登记，接口异常可能已有调用或部分本地状态，先读回对账；不能见失败就重复写任务。

agent_terminate所核handler写terminated并尝试COW memory promote/discard（best-effort）后返回terminated:true，没有拿到进行中provider局部AbortController。executeCompletion看到terminated不会改回idle，但仍可能写lastResult并已产生响应/费用；task_cancel也是取消状态/释放Agent引用，已终态会拒覆盖，不是终止API请求/撤文件。停止“登记/任务/一轮HTTP/宿主native进程/外部动作”应分别验，不能把force字段或stop绿状态当全部物理切断。

最小工具列表只影响广告：bin tools/list调用_filterAdvertisedMcpTools，未配置/all则全列；tools/call却按全registry hasTool，再走授权。所以--tools/CLAUDE_FLOW_MCP_TOOLS不是权限白名单，不该作为不可信客户端隔离。当前有更强独立统一policy chokepoint（不能忽略）：authorizeMcpTool会构造身份/action/namespace/属性交evaluatePolicyRequest；无状态时loadPolicyState走createLegacyCompatibleState，其mode legacy、规则/budget空；evaluator只在enforce把策略outcome真正执行，legacy/observe不能统称默认拒绝。已有state/anchor校验可抛错，不能把这些一般化为所有配置总是allow或deny。

身份也有条件：resolveMcpCallerIdentity在caller-auth未启时取env principal/legacy-cli，认证开关只有literal true启用；启用后缺/坏token会抛错并做验签，但本轮不全审密钥分发/规则/budget/所有安全组件，不据此宣称多租户安全或任意worker身份可信。输出内容guardrail调用存在，源码default开关未true则返回原结果，不能当默认全内容净化。MCP本身可暴露许多写/网络/终端类工具，试验只用自己的受控stdio客户端和隔离项目/账户，另核真实policy模式与规则，不接公网/不可信调用方。

health接口当前用executionHistory派生API成功/延迟，无观测返回unknown/null并标source=agent_execute；这比初始health种子诚实，仍不是代码正确率、native Task是否执行或所有Agent成本。库/平台和所有policy/存储支路未全审、无权限/并发/kill实验，不能扩大为全系统安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:106-164](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L106-L164)

孤儿条件/读取和原子rename。

<details>
<summary>查看原文（59行）</summary>

```text
const ORPHAN_TTL_MS = 24 * 60 * 60 * 1000;
function reconcileOrphanSwarms(store: SwarmStore): number {
  let reconciled = 0;
  const nowIso = new Date().toISOString();
  const nowMs = Date.now();
  for (const swarm of Object.values(store.swarms)) {
    if (swarm.status !== 'running') continue;
    let orphanReason: string | null = null;
    if (typeof swarm.pid === 'number') {
      if (!isPidAlive(swarm.pid)) {
        orphanReason = `host process ${swarm.pid} exited`;
      }
    } else {
      const ageMs = nowMs - new Date(swarm.updatedAt).getTime();
      if (Number.isFinite(ageMs) && ageMs > ORPHAN_TTL_MS) {
        orphanReason = `no pid recorded and heartbeat is ${Math.round(ageMs / 3600000)}h stale`;
      }
    }
    if (orphanReason) {
      swarm.status = 'terminated';
      swarm.terminationReason = orphanReason;
      swarm.updatedAt = nowIso;
      reconciled++;
    }
  }
  return reconciled;
}

// #2085 — exported so `agent-tools.ts agent_spawn` can push into
// `swarm.agents` (the field `swarm_status` reads).
export function loadSwarmStore(): SwarmStore {
  let store: SwarmStore = { swarms: {}, version: '3.0.0' };
  try {
    const path = getSwarmStatePath();
    if (existsSync(path)) {
      store = JSON.parse(readFileSync(path, 'utf-8'));
    }
  } catch { /* fall through with default */ }

  // #1799 — reconcile orphans on every load and persist if anything changed.
  // Cheap (process.kill(pid, 0) is sub-millisecond) and means
  // `swarm_status`/`swarm_health` never see ghost "running" entries.
  const reconciled = reconcileOrphanSwarms(store);
  if (reconciled > 0) {
    try { saveSwarmStore(store); } catch { /* best-effort */ }
  }
  return store;
}

export function saveSwarmStore(store: SwarmStore): void {
  ensureSwarmDir();
  const target = getSwarmStatePath();
  const temporary = `${target}.${process.pid}.${Math.random().toString(36).slice(2)}.tmp`;
  try {
    writeFileSync(temporary, JSON.stringify(store, null, 2), { encoding: 'utf-8', mode: 0o600 });
    renameSync(temporary, target);
  } catch (error) {
    try { unlinkSync(temporary); } catch { /* already renamed or never created */ }
    throw error;
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:315-320](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L315-L320)

owner PID明确可选。

```text
        createdAt: now,
        updatedAt: now,
        // A normal CLI invocation exits immediately after creating this
        // coordination record; its PID is therefore not the swarm lifetime.
        // Long-lived hosts may opt into PID ownership explicitly.
        pid: config.trackHostProcess === true ? process.pid : undefined,
```

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:168-194](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L168-L194)

局部wx锁/等待/释放。

<details>
<summary>查看原文（27行）</summary>

```text
function withSwarmStoreLock<T>(operation: () => T): T {
  ensureSwarmDir();
  const lockPath = join(getSwarmDir(), SWARM_STATE_LOCK);
  let descriptor: number | undefined;
  const waiter = new Int32Array(new SharedArrayBuffer(4));
  for (let attempt = 0; attempt < 100; attempt++) {
    try {
      descriptor = openSync(lockPath, 'wx', 0o600);
      break;
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error;
      try {
        if (Date.now() - statSync(lockPath).mtimeMs > SWARM_LOCK_STALE_MS) {
          unlinkSync(lockPath);
          continue;
        }
      } catch { /* another writer released it */ }
      Atomics.wait(waiter, 0, 0, 10);
    }
  }
  if (descriptor === undefined) throw new Error('swarm state is busy; retry the outcome update');
  try {
    return operation();
  } finally {
    try { closeSync(descriptor); } catch { /* best effort */ }
    try { unlinkSync(lockPath); } catch { /* best effort */ }
  }
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/swarm-tools.ts:214-228](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/swarm-tools.ts#L214-L228)

锁实际覆盖pheromone signal caller。

<details>
<summary>查看原文（15行）</summary>

```text
/** Shared by hooks_post-task so outcome labels immediately drive APSC. */
export function recordSwarmPheromoneSignal(
  signal: ApscSignal,
): { active: false; reason: string } | { active: true; swarmId: string; decision: ApscDecision } {
  return withSwarmStoreLock(() => {
    const store = loadSwarmStore();
    const swarm = latestRunningSwarm(store);
    const current = apscStateOf(swarm);
    if (!swarm || !current) return { active: false, reason: 'no running pheromone-adaptive swarm' };
    const result = recordApscSignal(current, signal);
    swarm.config.apscState = result.state;
    swarm.updatedAt = new Date().toISOString();
    saveSwarmStore(store);
    return { active: true, swarmId: swarm.swarmId, decision: result.decision };
  });
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:55-69](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L55-L69)

core独立JSON load/default和直接写。

<details>
<summary>查看原文（15行）</summary>

```text
function getAgentDir(): string { return join(getProjectCwd(), STORAGE_DIR, AGENT_DIR); }
function getAgentPath(): string { return join(getAgentDir(), AGENT_FILE); }
function ensureAgentDir(): void {
  const dir = getAgentDir();
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
}
function loadAgentStore(): AgentStore {
  try {
    if (existsSync(getAgentPath())) return JSON.parse(readFileSync(getAgentPath(), 'utf-8'));
  } catch { /* fall through */ }
  return { agents: {}, version: '3.0.0' };
}
function saveAgentStore(store: AgentStore): void {
  ensureAgentDir();
  writeFileSync(getAgentPath(), JSON.stringify(store, null, 2), 'utf-8');
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:70-76](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L70-L76)

task直接写，非同一事务。

```text
function loadTaskStore(): TaskStore {
  return readRecordStore(getTaskPath(), 'tasks', () => ({ tasks: {}, version: '3.0.0' }));
}

function saveTaskStore(store: TaskStore): void {
  ensureTaskDir();
  writeFileSync(getTaskPath(), JSON.stringify(store, null, 2), 'utf-8');
```

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:559-592](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L559-L592)

terminate只登记与best-effort memory分支。

<details>
<summary>查看原文（34行）</summary>

```text
    handler: async (input) => {
      const v = validateIdentifier(input.agentId, 'agentId');
      if (!v.valid) return { success: false, error: `Input validation failed: ${v.error}` };

      const store = loadAgentStore();
      const agentId = input.agentId as string;

      if (store.agents[agentId]) {
        const rec = store.agents[agentId];
        rec.status = 'terminated';
        saveAgentStore(store);

        // ACOW — resolve the agent's COW memory branch on teardown: promote
        // (merge into base) when asked, else discard. Non-fatal — a failure
        // here never blocks termination. Discard needs no agenticow (pure fs),
        // so cleanup still works in the degraded path.
        let memory: Record<string, unknown> | undefined;
        if (rec.memoryBranch) {
          try {
            const { SwarmMemoryBranches } = await import('../services/swarm-memory-branches.js');
            const svc = new SwarmMemoryBranches();
            memory = input.promoteMemory
              ? (await svc.promoteAgent(agentId)) as unknown as Record<string, unknown>
              : (await svc.discardAgent(agentId)) as unknown as Record<string, unknown>;
          } catch { /* best-effort teardown */ }
        }

        return {
          success: true,
          agentId,
          terminated: true,
          terminatedAt: new Date().toISOString(),
          ...(memory ? { memory } : {}),
        };
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:832-861](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L832-L861)

completion重读保非busy状态但仍记结果。

<details>
<summary>查看原文（30行）</summary>

```text
  const remaining = (activeExecutions.get(executionKey) || 1) - 1;
  const persistCompletion = (out?: AgentExecuteResult): void => {
    // Awaited provider/feedback work may have overlapped registration, updates,
    // termination or deletion. Never replace that newer registry snapshot.
    const latest = loadAgentStore();
    const current = latest.agents[input.agentId];
    if (!current || current.createdAt !== agent.createdAt) return;
    if (current.status === 'busy') current.status = remaining > 0 ? 'busy' : 'idle';
    if (agent.modelId !== initialModelId && current.modelId === initialModelId) {
      // A fallback may also change its tier. Carry that change with the model
      // ID, but preserve any selection the user edited during the request.
      if (agent.model !== initialModel && current.model === initialModel) current.model = agent.model;
      current.modelId = agent.modelId;
    }
    if (out) current.lastResult = out as unknown as Record<string, unknown>;
    const previousMeasuredHealth = summarizeAgentExecutions(current.executionHistory).health;
    const mayUpdateStoredHealth = previousMeasuredHealth === null
      ? current.health === agent.health
      : current.health === previousMeasuredHealth;
    current.executionHistory = appendAgentExecution(current.executionHistory, {
      at: new Date().toISOString(),
      success: result.success,
      durationMs: result.durationMs ?? Date.now() - startedAt,
    });
    // An explicit agent_update during the provider call still wins. The
    // measured value remains available from executionHistory in agent_health.
    if (mayUpdateStoredHealth) {
      current.health = summarizeAgentExecutions(current.executionHistory).health ?? current.health;
    }
    saveAgentStore(latest);
```

</details>

**依据 9 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:549-578](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L549-L578)

取消task记录及release、终态保护。

<details>
<summary>查看原文（30行）</summary>

```text
      const store = loadTaskStore();
      const taskId = input.taskId as string;
      const task = store.tasks[taskId];

      if (task) {
        const previousStatus = task.status;
        // A finished task keeps its outcome: cancelling it used to overwrite a
        // completed task's result and completedAt with a cancel reason.
        if (previousStatus === 'completed' || previousStatus === 'failed' || previousStatus === 'cancelled') {
          return {
            success: false,
            taskId,
            status: previousStatus,
            previousStatus,
            error: `Task is already ${previousStatus}`,
          };
        }

        task.status = 'cancelled';
        task.completedAt = new Date().toISOString();
        task.result = { cancelReason: input.reason || 'Cancelled by user' };
        saveTaskStore(store);
        releaseAgents(task.assignedTo, taskId);

        return {
          success: true,
          taskId: task.taskId,
          status: task.status,
          previousStatus,
          cancelledAt: task.completedAt,
```

</details>

**依据 10 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:41-59](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/bin/cli.js#L41-L59)

默认all的广告剪裁。

<details>
<summary>查看原文（19行）</summary>

```text
function _filterAdvertisedMcpTools(tools) {
  const argv = process.argv.slice(2);
  const toolsIndex = argv.findIndex((arg) => arg === '--tools');
  const inlineTools = argv.find((arg) => arg.startsWith('--tools='));
  const configured = process.env.CLAUDE_FLOW_MCP_TOOLS
    || (toolsIndex >= 0 ? argv[toolsIndex + 1] : undefined)
    || (inlineTools ? inlineTools.slice('--tools='.length) : undefined);
  if (!configured || configured.trim().toLowerCase() === 'all') return tools;
  const selectors = new Set(
    configured.split(',').map((item) => item.trim().toLowerCase()).filter(Boolean),
  );
  if (selectors.size === 0) return tools;
  return tools.filter((tool) => {
    const name = tool.name.toLowerCase();
    const category = typeof tool.category === 'string' ? tool.category.toLowerCase() : '';
    return selectors.has(name)
      || selectors.has(category)
      || Array.from(selectors).some((selector) => name.startsWith(`${selector}_`));
  });
```

</details>

**依据 11 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:283-322](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/bin/cli.js#L283-L322)

list剪裁与call全registry/门卫的区别。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/list': {
        const tools = _filterAdvertisedMcpTools(listMCPTools());
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: tools.map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          },
        };
      }

      case 'tools/call': {
        const toolName = params.name;
        const toolParams = params.arguments || {};

        if (!hasTool(toolName)) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          };
        }

        if (isPolicyEnforcementEnabled()) {
          const check = evaluateToolCall(loadMcpPolicy(), sessionId, toolName);
          if (!check.allowed) {
            return {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32001, message: `Policy denied: ${check.reason}` },
            };
          }
        }

        try {
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio' });
```

</details>

**依据 12 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:270-288](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-client.ts#L270-L288)

中央policy真实门与输出guard caller。

<details>
<summary>查看原文（19行）</summary>

```text
  try {
    // ADR-324: one policy chokepoint for every local CLI/MCP invocation.
    // Policy administration is not exempt: authorization calls the engine
    // directly, so there is no recursive MCP dispatch. In enforce mode an
    // administrator must explicitly allow policy.* actions or use the local
    // CLI bootstrap path.
    const decision = await authorizeMcpTool(toolName, input, context, classifyMcpTool(toolName));
    if (decision.enforcedOutcome !== 'allowed') {
      throw new Error(`policy-${decision.enforcedOutcome}:${decision.reason}; receipt=${decision.receiptId}`);
    }
    // Call the tool handler
    const result = await tool.handler(input, context);
    // ADR-146 P2: scan every tool result for indirect-injection before it
    // returns to the caller. The screen is opt-in via env (default off in
    // 3.10.34 — flip to default in v4) so existing pipelines keep their
    // exact behaviour while the call site is exercised by tests and
    // adopters. Telemetry from the screen lands in the shared
    // GuardrailEvent sink (P5).
    return applyContentBoundaryGuardrail(toolName, result) as T;
```

</details>

**依据 13 · 源码核查**：[v3/@claude-flow/cli/src/mcp-client.ts:312-326](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-client.ts#L312-L326)

内容guard默认关闭条件。

<details>
<summary>查看原文（15行）</summary>

```text
let _guardrailInstance: { scanAndEnforce: (s: string) => { content: string; action: string; result: { severity: string; category: string; pattern: string } } } | null = null;
function applyContentBoundaryGuardrail(toolName: string, result: unknown): unknown {
  if (process.env.CLAUDE_FLOW_STRICT_GUARDRAIL !== 'true') return result;
  if (typeof result !== 'object' || result === null) return result;

  // Lazy-resolve the guardrail singleton to avoid hot-path import cost.
  if (_guardrailInstance === null) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const sec = require('@claude-flow/security') as {
        createToolOutputGuardrail?: (cfg?: unknown) => typeof _guardrailInstance;
      };
      if (sec?.createToolOutputGuardrail) {
        _guardrailInstance = sec.createToolOutputGuardrail();
      } else {
```

</details>

**依据 14 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:516-527](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L516-L527)

状态/anchor读取和legacy default caller。

<details>
<summary>查看原文（12行）</summary>

```text
export function loadPolicyState(projectRoot = process.cwd()): PolicyState {
  const target = paths(projectRoot);
  if (!existsSync(target.state)) {
    verifyStateAnchor(projectRoot, undefined);
    return createLegacyCompatibleState(detectLegacyCapabilities(projectRoot));
  }
  const parsed = JSON.parse(readFileSync(target.state, 'utf8')) as PolicyState;
  if ((parsed.version !== 1 && parsed.version !== POLICY_STATE_VERSION) || !Array.isArray(parsed.rules) || !Array.isArray(parsed.receipts)) {
    throw new Error(`unsupported-policy-state-version:${String(parsed.version)}`);
  }
  verifyStateAnchor(projectRoot, parsed);
  return parsed;
```

</details>

**依据 15 · 源码核查**：[v3/@claude-flow/security/src/policy/engine.ts:398-409](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/security/src/policy/engine.ts#L398-L409)

真实初始legacy、空规则与预算。

<details>
<summary>查看原文（12行）</summary>

```text
export function createLegacyCompatibleState(source = 'pre-ADR-324'): PolicyState {
  return {
    version: POLICY_STATE_VERSION,
    mode: 'legacy',
    migratedFrom: source,
    migratedAt: Date.now(),
    rules: [],
    budgets: [],
    usage: [],
    approvals: [],
    receipts: [],
  };
```

</details>

**依据 16 · 源码核查**：[v3/@claude-flow/security/src/policy/evaluator.ts:110-128](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/security/src/policy/evaluator.ts#L110-L128)

enforce与observe/legacy的真实enforcedOutcome差异。

<details>
<summary>查看原文（19行）</summary>

```text
  } else if (approval) {
    outcome = 'approval_required';
    reason = `approval-required-by:${approval.id}`;
  } else if (allow) {
    outcome = 'allowed';
    reason = `allowed-by:${allow.id}`;
  } else {
    outcome = mode === 'legacy' ? 'allowed' : 'denied';
    reason = mode === 'legacy' ? 'legacy-default-allow' : 'default-deny';
  }

  return {
    requestId,
    outcome,
    enforcedOutcome: mode === 'enforce' ? outcome : 'allowed',
    mode,
    reason,
    matchedRules: matched.map((rule) => rule.id),
    obligations: approval ? ['valid-human-approval'] : [],
```

</details>

**依据 17 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:823-851](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L823-L851)

身份env分支及启认证后的验签。

<details>
<summary>查看原文（29行）</summary>

```text
function resolveMcpCallerIdentity(): { id: string; type: 'agent' | 'legacy' } {
  if (!isMcpCallerAuthEnabled()) {
    return {
      id: process.env.CLAUDE_FLOW_PRINCIPAL_ID ?? 'legacy-cli',
      type: process.env.CLAUDE_FLOW_PRINCIPAL_ID ? 'agent' : 'legacy',
    };
  }

  const encodedToken = process.env.CLAUDE_FLOW_MCP_INVOCATION_TOKEN;
  const publicKeyHex = process.env.CLAUDE_FLOW_MCP_CALLER_PUBKEY;
  if (!encodedToken || !publicKeyHex) {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }

  const token = decodeTokenEnvelope(encodedToken);
  if (!token) {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }

  let publicKey;
  try {
    publicKey = publicKeyFromHex(publicKeyHex);
  } catch {
    throw new Error('mcp-caller-auth-enabled-but-no-token');
  }

  const result = verifyInvocationToken(token, publicKey, {});
  if (!result.valid) {
    throw new Error(`mcp-caller-auth-verification-failed:${result.reason}`);
```

</details>

**依据 18 · 源码核查**：[v3/@claude-flow/security/src/mcp-caller-identity.ts:154-156](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/security/src/mcp-caller-identity.ts#L154-L156)

真实literal true开关。

```text
/** Off by default — see the file header re: key distribution being out of scope pending a follow-on ADR. Only the literal `'true'` enables enforcement. */
export function isMcpCallerAuthEnabled(): boolean {
  return process.env[CALLER_AUTH_ENV] === 'true';
```

**依据 19 · 源码核查**：[v3/@claude-flow/cli/src/services/policy-runtime.ts:899-917](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/services/policy-runtime.ts#L899-L917)

实际policy身份/action/属性装配。

<details>
<summary>查看原文（19行）</summary>

```text
  return evaluatePolicyRequest({
    identity: resolveMcpCallerIdentity(),
    action: {
      type: attributes.actionType ?? 'mcp.tool.call',
      resource: toolName,
      tool: toolName,
      server: typeof context.serverId === 'string' ? context.serverId : 'ruflo',
      namespace: typeof input.namespace === 'string' ? input.namespace : undefined,
      environment: typeof context.environment === 'string' ? context.environment : undefined,
      costUsd: attributes.costUsd,
      tokens: attributes.tokens,
      concurrency: attributes.concurrency,
      network: attributes.network === true,
      destructive: attributes.destructive === true,
    },
    context: {
      envelope: attributes.envelope ?? processEnvelope,
      approvalIds: Array.isArray(context.approvalIds) ? context.approvalIds.map(String) : undefined,
      evidence: Array.isArray(context.evidence) ? context.evidence as PolicyEvidence[] : undefined,
```

</details>

**依据 20 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:852-875](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L852-L875)

实际health unknown/观测source与指标。

<details>
<summary>查看原文（24行）</summary>

```text
      const store = loadAgentStore();
      const agents = Object.values(store.agents).filter(a => a.status !== 'terminated');
      const threshold = input.threshold === undefined ? 0.5 : input.threshold as number;
      if (!Number.isFinite(threshold) || threshold < 0 || threshold > 1) {
        return { error: 'threshold must be a finite number between 0 and 1' };
      }
      const healthStatus = (health: number | null): 'healthy' | 'degraded' | 'unhealthy' | 'unknown' =>
        health === null ? 'unknown' : health >= threshold ? 'healthy' : health >= 0.3 ? 'degraded' : 'unhealthy';

      if (input.agentId) {
        const agent = store.agents[input.agentId as string];
        if (agent) {
          const metrics = summarizeAgentExecutions(agent.executionHistory);
          return {
            agentId: agent.agentId,
            ...metrics,
            healthStatus: healthStatus(metrics.health),
            status: agent.status,
            healthy: metrics.health === null ? null : metrics.health >= threshold,
            taskCount: agent.taskCount,
            uptime: null,
            registryAgeMs: Date.now() - new Date(agent.createdAt).getTime(),
            windowSize: AGENT_HEALTH_WINDOW,
            source: 'agent_execute',
```

</details>

#### 缺口

- 真实policy/身份、磁盘/并发/终止与全平台安全和恢复未实验/全审
  **影响**：只支持受控私有调用，不用广告剪裁或状态stop承诺安全/费用/进程回收；恢复需多处对账
  **进一步探讨**：后续隔离测未广告工具call、各policy模式、坏状态/并发/在途terminate，再核请求/记录/工作与费用；不能控制调用方/目录/凭据就观察。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 路由提示和学习成功标签实际说明什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

Claude route mod提供一条可核条件链：hooks/register调用registerRoute，后者注册prompt.submit；只有state.owned有route才执行routeTask，保存lastRoute/routed并把formatRoute结果加上下文后next，不在这个函数真的启动某角色进程。routeTask按表首个正则关键词匹配，英文token/短语映射coder/tester等；命中固定0.6，没命中coder/0.3、matched:false/no-match-default。它是低成本可解释建议/先验，不是校准成功概率，也不能代表所有MCP/neural路由或DSH宿主会载此mod。中文、多意图和规则顺序误导需实测，未执行。

agent_execute的实际反馈不同于只看hook计数。共享core从result.success产生success/failure，调用recordModelOutcome/ByModelId，失败的回退attempt也逐个记；这些调用是best-effort，故反馈写失败不阻断执行。CLAUDE_FLOW_ROUTER_TRAJECTORY=1时还把同一API outcome映射quality 1/0并记录task/model/tokens；CLAUDE_FLOW_RUN_TRANSCRIPTS=1才捕获system/user/assistant等messages并resolved=API outcome、resolvedSource=api-success，默认不进入这些opt-in分支。不能称没有真实API/反馈接线，也不能因名字quality/resolved就当软件任务合格。

代表API响应只抽text、带stopReason和usage，没有工具执行/patch验证环；transcript还明确没有模型patch产物。固定弱标签能说明调用可靠性/延迟，不能独立判代码是否正确、隐藏测试/用户目标是否达成。如果后续质量选择/训练把它当产物金标，可能学偏；本轮未全审所有selector/训练/人工评价接口，不声称污染已发生或全项目绝无其他质量数据。模型和已有router/backend能力不全计根原创。

默认MCP全工具广告、关键词confidence、记录的API health、模型缓存提示与未来quality improvement应各自分开。真实价值需同任务/预算、同可用模型的独立代码/测试验收，再比较状态协调、重试成本和错误分配；没有这一步，不从success计数或日志帧推已实现自学习提效/更低费用。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/ruflo-mods/hooks/register.ts:35-45](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/plugins/ruflo-mods/hooks/register.ts#L35-L45)

实际调用registerRoute。

<details>
<summary>查看原文（11行）</summary>

```text
  const opts = readOptions(options)
  const guidance = createGuidance(state, opts)

  registerTrust(on, opts.modTrust, opts.modTrustAllow)
  if (opts.capabilityProbe) registerProbe(on, state, opts)
  if (opts.sessionRollup) registerRollup(on, state)
  state.grounding.enabled = opts.grounding
  registerNoun(on, state)
  registerSession(on, state, opts, guidance)
  registerRoute(on, state, opts, guidance)
  registerGuard(on, state, guidance)
```

</details>

**依据 2 · 源码核查**：[plugins/ruflo-mods/hooks/route/index.ts:20-43](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/plugins/ruflo-mods/hooks/route/index.ts#L20-L43)

条件prompt.submit→routeTask→context而非进程spawn。

<details>
<summary>查看原文（24行）</summary>

```text
export function registerRoute(on: On, state: ModState, options: ModOptions, guidance?: GuidanceHooks) {
  const ranked = cachedFile(() => under(state, RANKED_PATH), parseRanked)

  on('prompt.submit', async ($, e, next) => {
    const text = typeof e.text === 'string' ? e.text : ''
    if (state.agentTrim.enabled) state.agentTrim.prompt = text.slice(0, 4000).toLowerCase() // agent.offer keeps a type the prompt names
    const advisory = guidance ? await guidance.prompt(text, { stat: path => $.fs.stat(path), read: path => $.fs.read(path) }) : undefined
    const context = [...(e.context ?? []), ...(advisory ? [advisory] : [])]
    if (!state.owned.has('route')) return next(advisory ? { ...e, context } : e)
    const result = routeTask(text)
    state.lastRoute = result
    state.routed++

    const blocks: string[] = []
    if (options.routeContext) {
      const read = await ranked({ stat: path => $.fs.stat(path), read: path => $.fs.read(path) })
      const context = read.kind === 'ok' ? rankedContext(text, read.value) : null
      if (context) blocks.push(context)
    }
    blocks.push(formatRoute(text, result))
    redraw(state)

    return next({ ...e, context: [...context, blocks.join('\n')] })
  }).catch(($, e, next) => next(e)) // a broken plugin never blocks a prompt
```

</details>

**依据 3 · 源码核查**：[plugins/ruflo-mods/hooks/route/route-task.ts:22-37](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/plugins/ruflo-mods/hooks/route/route-task.ts#L22-L37)

固定先验和关键词表。

<details>
<summary>查看原文（16行）</summary>

```text
/** A real keyword match's heuristic prior (router.cjs, #2257). */
export const MATCH_CONFIDENCE = 0.6

/** `NO_MATCH_CONFIDENCE` in cli/src/mcp-tools/hooks-tools.ts (#3567). */
export const NO_MATCH_CONFIDENCE = 0.3

export const TASK_PATTERNS: ReadonlyArray<{ readonly tokens: readonly string[]; readonly agent: string }> = [
  { tokens: ['implement', 'create', 'build', 'add', 'write code', 'refactor', 'debug'], agent: 'coder' },
  { tokens: ['test', 'tests', 'testing', 'spec', 'specs', 'coverage', 'unit test', 'integration test'], agent: 'tester' },
  { tokens: ['review', 'audit', 'check', 'validate', 'security'], agent: 'reviewer' },
  { tokens: ['research', 'find', 'search', 'documentation', 'explore'], agent: 'researcher' },
  { tokens: ['design', 'architect', 'architecture', 'structure', 'plan'], agent: 'architect' },
  { tokens: ['api', 'endpoint', 'server', 'backend', 'database'], agent: 'backend-dev' },
  { tokens: ['ui', 'frontend', 'component', 'react', 'css', 'style'], agent: 'frontend-dev' },
  { tokens: ['deploy', 'docker', 'ci', 'cd', 'ci/cd', 'pipeline', 'infrastructure', 'devops'], agent: 'devops' },
]
```

</details>

**依据 4 · 源码核查**：[plugins/ruflo-mods/hooks/route/route-task.ts:62-77](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/plugins/ruflo-mods/hooks/route/route-task.ts#L62-L77)

first-match/default实际返回。

<details>
<summary>查看原文（16行）</summary>

```text
export function routeTask(task: unknown): RouteResult {
  const text = typeof task === 'string' ? task.toLowerCase() : ''

  for (const entry of COMPILED) {
    if (entry.regex.test(text)) {
      return { agent: entry.agent, confidence: MATCH_CONFIDENCE, matched: true, reason: entry.reason }
    }
  }

  return {
    agent: 'coder',
    confidence: NO_MATCH_CONFIDENCE,
    matched: false,
    reason: 'no-match-default',
  }
}
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:741-768](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L741-L768)

API outcome实际反馈caller。

<details>
<summary>查看原文（28行）</summary>

```text
  // ADR-149 — close the bandit feedback loop. `recordModelOutcome` updates
  // the Beta(α,β) prior for the agent's tier so the Thompson sampler learns
  // from production traffic instead of staying frozen at install-day priors.
  // This is best-effort: any error here must NOT break the agent execution.
  // For now, "success" = the model returned a response without an API error.
  // A finer-grained signal (user-accepted output / regression-detected) is a
  // follow-up; this commit closes the bandit's basic learning loop.
  try {
    const { recordModelOutcome, recordModelOutcomeByModelId } = await import('../ruvector/model-router.js');
    // Bandit priors are keyed on the 3 canonical tiers (haiku/sonnet/opus/inherit);
    // collapse opus-4.7 → opus before recording so the bandit's per-tier Beta
    // updates correctly.
    const tier: 'haiku' | 'sonnet' | 'opus' | 'inherit' =
      agent.model === 'opus-4.7' ? 'opus' :
      (agent.model as 'haiku' | 'sonnet' | 'opus' | 'inherit' | undefined) ?? 'sonnet';
    const outcome: 'success' | 'failure' = result.success ? 'success' : 'failure';
    for (const attempt of failedAttempts) {
      recordModelOutcome(input.prompt, attempt.model === 'opus-4.7' ? 'opus' : attempt.model, 'failure');
      recordModelOutcomeByModelId(input.prompt, attempt.modelId, 'failure');
    }
    recordModelOutcome(input.prompt, tier, outcome);
    // ADR-149 — also write to the shadow per-modelId priors when the cost-
    // optimal neural backend picked a concrete model id. Selection logic
    // still uses tier priors, but the per-modelId data accumulates so a
    // future refactor can switch the selector over.
    if (agent.modelId) {
      recordModelOutcomeByModelId(input.prompt, agent.modelId, outcome);
    }
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:778-795](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L778-L795)

opt-in trajectory quality映射。

<details>
<summary>查看原文（18行）</summary>

```text
    if (process.env.CLAUDE_FLOW_ROUTER_TRAJECTORY === '1') {
      try {
        const { recordTrajectoryOutcome } = await import('../ruvector/router-trajectory.js');
        const scores: Record<string, number> | undefined = agent.modelId
          ? { [agent.modelId]: outcome === 'success' ? 1.0 : 0.0 }
          : undefined;
        // iter 31 — pass token usage + modelId so the recorder can compute
        // USD spend at write time. Consumers (`router decisions`, cost-
        // savings reports) get cost without their own price table.
        recordTrajectoryOutcome({
          task: input.prompt,
          quality: outcome === 'success' ? 1.0 : 0.0,
          scores,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
          modelId: agent.modelId,
        });
      } catch { /* never break execution */ }
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:797-825](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L797-L825)

opt-in transcript原始消息与api-success。

<details>
<summary>查看原文（29行）</summary>

```text
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:291-313](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L291-L313)

text/stopReason/usage，而非产物验证。

<details>
<summary>查看原文（23行）</summary>

```text
    const data = await res.json() as {
      id: string;
      model: string;
      content: Array<{ type: string; text?: string }>;
      stop_reason: string;
      usage: { input_tokens: number; output_tokens: number };
    };
    const textOut = data.content
      .filter(c => c.type === 'text' && typeof c.text === 'string')
      .map(c => c.text as string)
      .join('');
    return {
      success: true,
      model: data.model,
      messageId: data.id,
      stopReason: data.stop_reason,
      output: textOut,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens,
        totalTokens: data.usage.input_tokens + data.usage.output_tokens,
      },
      durationMs: Date.now() - startedAt,
```

</details>

#### 缺口

- 其他router/训练/人工质量通路与中文多意图效果未全审/运行
  **影响**：不能将静态先验/API可靠性等同任务质量、全局学习增益或已发生偏差
  **进一步探讨**：以后固定模型预算对照静态/当前router/独立验收标注，记录任务通过/分配错误/总调用和恢复；先查现有质量接口避免重复造。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时只观察，受控小样需要什么及怎样退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

总体先观察，不为简单任务扩成多Agent系统。只有已有明确协调需求且愿意手工验产物的开发者，才在独立账户/隔离无敏感项目、私有受控stdio和可核匹配构建上做后续小样；不启全部mods/federation/memory，也不把Claude原生hook移作DSH契约。若目标是能自己执行指令、读工具结果继续决策的在线Agent，所核agent_execute单次文本API不足，不能按这个入口承诺。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 实际CLI/构建 | 调用必需 | 根claude-flow/v3 CLI 3.63.8、MIT、Node>=20；wrapper导入匹配dist | 本轮未下载发行/构建；源码不含被指两个dist入口，先核包/构建，不装上就宣称兼容 |
| 宿主MCP/本地目录 | 代表链必需 | 私有stdio客户端、固定项目root、可写.claude-flow状态与读回 | 本包非DSH插件；广告最小化不限制已知隐藏工具call，禁止接不可信/公网调用 |
| 真实provider/model/凭据 | agent_execute必需 | 明确agent model/provider、用户授权的非敏感prompt、已配置服务/额度 | 无provider返回错误，远端收到prompt/system；变更base/provider需另核，不在日志暴露key |
| policy/身份模式 | 控制权限时必需 | 当前真实中央authorize/规则/receipt，按模式和caller-auth配置 | 无状态legacy并非默认拒绝，env principal不自动可信；要求多租户/硬资源限额者先观察 |
| 神经/embedding/原生依赖 | 仅相关路由/记忆必需 | 可选路由候选、embedding/存储与本地资源 | 本轮不全审；先显式model避task-route，fallback env=0，不把缺模块静默退化当质量保障 |
| Claude mods/console/native worker | 可选且不在小样 | 客户端专用hooks、UI和其他执行方式 | 不继承到DSH或把mission/演示当实际工作，本轮不宣称这些全兼容 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 固定环境 | 管理员隔离账户/副本与stdio，核匹配dist、目录、policy模式/调用方 | 拒绝不可信客户端与不明权限；只列少量schema不是授权验收 |
| 单次代表请求 | 操作者显式model/provider、正有限小输出预算和零fallback，登记角色后发非敏感分析请求 | 分开见登记、实际API、文本/stopReason；不期待此API自动改代码/跑工具 |
| 软件任务对照 | 开发者如需后续编排，明确由哪个宿主Agent执行工具，再独立验同任务代码/测试 | task_complete/result不作金标；记录原生Task/单Agent相同预算基线 |
| 故障对账 | 操作者核JSON记录/调用结果，模拟异常前保副本；有未知API结果不盲重试 | busy/terminated/health计数与实际请求/工作分开，多个状态写失败逐处读回 |
| 退出 | 操作者停测试MCP/宿主进程、核在途请求/费用、保需要的结果后清隔离状态/凭据 | agent_terminate/task_cancel只局部状态/记忆处理，不充当网络或OS任务取消证明 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | CLI/构建/依赖和可选native/embedding；金额未知 | MCP/项目/凭据/policy/客户端配置和学习，工时未知 | 未安装；默认工具全广告可给宿主加schema上下文，但真实token与收费未知 |
| 持续使用 | 每次模型请求、可能embedding/本地存储、回退切模型/服务，usage按实际provider计 | 拆分/分配/合并与独立代码测试、维护路由和权限 | 单轮maxTokens/timeout/回退计数非整个任务费用上限；缓存hint不保证优惠 |
| 失败恢复 | 可能已计API/重复请求、多JSON修复/状态资源 | 查半写/重读、孤儿/任务/Agent/swarm关联及请求未知结果 | 有局部rename/锁/重读，但非全事务；stop状态不撤已发调用/外部工作 |
| 退出/扩展 | 清理进程/状态/可选记忆、第三方存储和调用尾费未知 | 核物理退出/凭据/retention、移除客户端专用改动 | transcript/trajectory显式开关会留prompt/输出等，其他训练/服务政策未审 |

| 效果 | 当前材料支持 | 未证明/验收条件 |
|---|---|---|
| 协调登记 | 真实MCP/任务/角色/模型/状态JSON接口 | 多角色不是多进程/自主工作或合格交付 |
| 执行接线 | agent_execute真实provider文本API及usage/stopReason | 无本路径工具循环/代码改动/测试，API success非质量 |
| 恢复/权限 | 孤儿协调、部分rename/锁/重读、中央policy caller和模式 | 非全部存储事务/安全或硬退出；最小广告非call allowlist |
| 路由/反馈 | 条件Claude hook先验、API outcome反馈/opt-in记录 | 不是校准质量概率/已证学习收益，其他训练未全审 |

只有真实任务比原生Task/单Agent有更少遗漏/重复和可接受总调用/恢复成本，才考虑扩大；身份、目录、费用、回执或产物/退出任一不清楚，立即停在观察并人工读回，不为命令/Agent数继续铺开。

#### 证据与依据

**依据 1 · 源码核查**：[bin/cli.js:9-11](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/bin/cli.js#L9-L11)

必需构建入口。

```text
const __dirname = dirname(fileURLToPath(import.meta.url));
const cliPath = join(__dirname, '..', 'v3', '@claude-flow', 'cli', 'bin', 'cli.js');
await import(pathToFileURL(cliPath).href);
```

**依据 2 · 源码核查**：[package.json:170-172](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/package.json#L170-L172)

Node要求。

```text
  "engines": {
    "node": ">=20.0.0"
  },
```

**依据 3 · 源码核查**：[v3/@claude-flow/cli/bin/cli.js:283-322](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/bin/cli.js#L283-L322)

广告与调用/授权分开。

<details>
<summary>查看原文（40行）</summary>

```text
      case 'tools/list': {
        const tools = _filterAdvertisedMcpTools(listMCPTools());
        return {
          jsonrpc: '2.0',
          id: message.id,
          result: {
            tools: tools.map(tool => ({
              name: tool.name,
              description: tool.description,
              inputSchema: tool.inputSchema,
            })),
          },
        };
      }

      case 'tools/call': {
        const toolName = params.name;
        const toolParams = params.arguments || {};

        if (!hasTool(toolName)) {
          return {
            jsonrpc: '2.0',
            id: message.id,
            error: { code: -32601, message: `Tool not found: ${toolName}` },
          };
        }

        if (isPolicyEnforcementEnabled()) {
          const check = evaluateToolCall(loadMcpPolicy(), sessionId, toolName);
          if (!check.allowed) {
            return {
              jsonrpc: '2.0',
              id: message.id,
              error: { code: -32001, message: `Policy denied: ${check.reason}` },
            };
          }
        }

        try {
          const result = await callMCPTool(toolName, toolParams, { sessionId, transport: 'stdio' });
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:188-202](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L188-L202)

显式model绕过task路由。

<details>
<summary>查看原文（15行）</summary>

```text
  // 1. Explicit model in config
  if (config.model) {
    const explicitModel = config.model as string;
    if (['haiku', 'sonnet', 'opus', 'opus-4.7', 'inherit'].includes(explicitModel)) {
      return { model: explicitModel as ClaudeModel, routedBy: 'explicit' };
    }
    // #2962 — a non-alias model string (e.g. an Ollama tag like
    // 'qwen3.6:27b', or any other provider-native model id) is still an
    // explicit user selection. Route it through the modelId fast-path
    // (executeAgentTask already prefers agent.modelId over
    // MODEL_MAP[agent.model] — ADR-149 iter 13) instead of falling through
    // to task-based routing / agent-type defaults, which silently
    // substituted 'sonnet' and discarded the user's request.
    return { model: 'sonnet', routedBy: 'explicit', modelId: explicitModel };
  }
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:253-285](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L253-L285)

单轮资源字段/外部请求。

<details>
<summary>查看原文（33行）</summary>

```text
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(anthropicAuthToken
          ? { Authorization: `Bearer ${anthropicAuthToken}` }
          : { 'x-api-key': anthropicKey }),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: input.maxTokens || 1024,
        // #2357 — omit temperature for models that reject sampling params
        // (Fable 5 / Opus 4.8 / Opus 4.7 → 400 "Extra inputs are not
        // permitted"); keep the 0.7 default unchanged for models that still
        // accept it (sonnet / haiku / opus ≤4.6).
        ...(modelRejectsSamplingParams(model)
          ? {}
          : { temperature: typeof input.temperature === 'number' ? input.temperature : 0.7 }),
        // #8 prompt caching (hermes-agent pattern): mark the (often large,
        // stable) system prompt as an ephemeral cache breakpoint so repeated
        // agent_execute calls with the same system prompt hit Anthropic's
        // prompt cache (~90% discount on cached input tokens, 5-min TTL).
        ...(input.systemPrompt
          ? { system: [{ type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } }] }
          : {}),
        messages: [{ role: 'user', content: input.prompt }],
      }),
      signal: controller.signal,
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:695-725](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L695-L725)

显式零fallback及切模型条件。

<details>
<summary>查看原文（31行）</summary>

```text
  const configuredFallbackBudget = parseInt(process.env.CLAUDE_FLOW_ROUTER_FALLBACK_MAX_RETRIES ?? '1', 10);
  const fallbackBudget = Number.isNaN(configuredFallbackBudget) ? 1 : Math.max(0, configuredFallbackBudget);
  const fallbackHistory: Array<{ modelId: string; error: string }> = [];
  // Keep feedback for each completed attempt before switching model identity.
  const failedAttempts: Array<{ model: ClaudeModel; modelId: string }> = [];
  if (!result.success && agent.modelId && fallbackBudget > 0) {
    const isRetryable = /\b(429|500|502|503|504|timeout|ECONNRESET|ETIMEDOUT)\b/i.test(result.error ?? '');
    if (isRetryable) {
      try {
        const { nextCostOptimalAlternative } = await import('../ruvector/neural-router.js');
        // ADR-149 iter 9 — delegate to the shared task-embedder LRU. The
        // pipeline + cache are shared with agent-tools.ts, so the embedding
        // for this prompt is almost always already cached from the initial
        // routing decision (no extra inference cost in steady state).
        const { embedTaskWithCache } = await import('../ruvector/task-embedder.js');
        const embedding = await embedTaskWithCache(input.prompt);
        if (embedding) {
          const excludeIds: string[] = [agent.modelId];
          for (let attempt = 0; attempt < fallbackBudget && !result.success; attempt++) {
            fallbackHistory.push({ modelId: excludeIds[excludeIds.length - 1], error: result.error ?? '' });
            const alt = await nextCostOptimalAlternative(embedding, excludeIds);
            if (!alt || !alt.modelId) break;
            excludeIds.push(alt.modelId);
            const altResult = await callAnthropicMessages({
              model: alt.modelId,
              prompt: input.prompt,
              systemPrompt,
              maxTokens: input.maxTokens,
              temperature: input.temperature,
              timeoutMs: input.timeoutMs,
            });
```

</details>

**依据 7 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:559-592](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L559-L592)

终止状态局部行为。

<details>
<summary>查看原文（34行）</summary>

```text
    handler: async (input) => {
      const v = validateIdentifier(input.agentId, 'agentId');
      if (!v.valid) return { success: false, error: `Input validation failed: ${v.error}` };

      const store = loadAgentStore();
      const agentId = input.agentId as string;

      if (store.agents[agentId]) {
        const rec = store.agents[agentId];
        rec.status = 'terminated';
        saveAgentStore(store);

        // ACOW — resolve the agent's COW memory branch on teardown: promote
        // (merge into base) when asked, else discard. Non-fatal — a failure
        // here never blocks termination. Discard needs no agenticow (pure fs),
        // so cleanup still works in the degraded path.
        let memory: Record<string, unknown> | undefined;
        if (rec.memoryBranch) {
          try {
            const { SwarmMemoryBranches } = await import('../services/swarm-memory-branches.js');
            const svc = new SwarmMemoryBranches();
            memory = input.promoteMemory
              ? (await svc.promoteAgent(agentId)) as unknown as Record<string, unknown>
              : (await svc.discardAgent(agentId)) as unknown as Record<string, unknown>;
          } catch { /* best-effort teardown */ }
        }

        return {
          success: true,
          agentId,
          terminated: true,
          terminatedAt: new Date().toISOString(),
          ...(memory ? { memory } : {}),
        };
```

</details>

**依据 8 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:797-825](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L797-L825)

opt-in记录的隐私/保留面。

<details>
<summary>查看原文（29行）</summary>

```text
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
```

</details>

#### 缺口

- 发行/宿主兼容、真实收益/总成本/回收和完整权限均未验
  **影响**：采用先观察；后续小样也只是私有隔离的代表操作，不支持生产自主软件交付或多租户
  **进一步探讨**：固定非敏感任务同模型预算比较单Agent/原生Task，独立测代码/测试与恢复/费用；无法核真实调用和产物就不扩。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么增量可证伪，什么时候只是修原工具？

**研究主题**：新假设与验证

#### 完整回答

候选是把API完成与独立产物验收分通道，并把登记/在途请求/实际工作停止分开，不是再加角色数或一个任务绿勾。已有MCP policy/身份可选验证、健康观测、孤儿协调/局部锁、回退和api-success来源标记要保留；也要先排查未审的完整quality/user feedback/worker接口是否已能做到，不宣称全项目没有这些能力。

先在所核入口做轻量约束：展示单次API文本而非自主Agent执行、保stopReason/API health和可选来源标签；产物测试/人工认可另记validator/version/任务与模型身份及unknown，不让completed或success自动变质量金标。路由如果要优化产物质量，只消费独立验收通道并保失败/未知；对console/任务stop给状态与物理请求/进程核查区别，不因为清registry就宣称取消所有花费。

最小对照固定一组无敏感软件任务、同模型/预算/可用工具，比较单Agent/原生Task、当前所选Ruflo链、加人工清单/少量验收标注的原实现；用保留隐藏测试/人工盲评验产物，另外记录任务分配错误、重复工作、API与业务失败、总用量/恢复分钟。故障项含超时/重试切模型、并发JSON/注册变更、任务状态完成但产物错、terminate时请求仍在途。这里都没执行，不说已测出质量改善/缺陷复现。

若一份独立测试清单和现有hook/记录字段够用，就修原工具或用原生Task，不造跨平台编排服务。没有真实协调摩擦、验收标签不能可靠绑定实际任务、指标只增加流程/费用或不优于单Agent，就否定；有代码复杂度/模型路由不证明市场/付费。只有多次真实交付显示少错、恢复更快且成本可接受，才考虑生产插件方向。

#### 证据与依据

**依据 1 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/task-tools.ts:314-329](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/task-tools.ts#L314-L329)

任务完成是状态/输入结果，不验产物。

<details>
<summary>查看原文（16行）</summary>

```text
      if (task) {
        if (task.status === 'completed') {
          return { taskId: task.taskId, status: task.status, completedAt: task.completedAt, result: task.result };
        }
        task.status = 'completed';
        task.progress = 100;
        task.completedAt = new Date().toISOString();
        task.result = (input.result as Record<string, unknown>) || {};
        saveTaskStore(store);

        // Sync assigned agents back to idle and increment taskCount
        updateAgents(task.assignedTo, (agent) => {
          if (agent.currentTask === taskId) {
            agent.status = 'idle';
            agent.currentTask = null;
          }
```

</details>

**依据 2 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:741-768](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L741-L768)

API outcome反馈通道。

<details>
<summary>查看原文（28行）</summary>

```text
  // ADR-149 — close the bandit feedback loop. `recordModelOutcome` updates
  // the Beta(α,β) prior for the agent's tier so the Thompson sampler learns
  // from production traffic instead of staying frozen at install-day priors.
  // This is best-effort: any error here must NOT break the agent execution.
  // For now, "success" = the model returned a response without an API error.
  // A finer-grained signal (user-accepted output / regression-detected) is a
  // follow-up; this commit closes the bandit's basic learning loop.
  try {
    const { recordModelOutcome, recordModelOutcomeByModelId } = await import('../ruvector/model-router.js');
    // Bandit priors are keyed on the 3 canonical tiers (haiku/sonnet/opus/inherit);
    // collapse opus-4.7 → opus before recording so the bandit's per-tier Beta
    // updates correctly.
    const tier: 'haiku' | 'sonnet' | 'opus' | 'inherit' =
      agent.model === 'opus-4.7' ? 'opus' :
      (agent.model as 'haiku' | 'sonnet' | 'opus' | 'inherit' | undefined) ?? 'sonnet';
    const outcome: 'success' | 'failure' = result.success ? 'success' : 'failure';
    for (const attempt of failedAttempts) {
      recordModelOutcome(input.prompt, attempt.model === 'opus-4.7' ? 'opus' : attempt.model, 'failure');
      recordModelOutcomeByModelId(input.prompt, attempt.modelId, 'failure');
    }
    recordModelOutcome(input.prompt, tier, outcome);
    // ADR-149 — also write to the shadow per-modelId priors when the cost-
    // optimal neural backend picked a concrete model id. Selection logic
    // still uses tier priors, but the per-modelId data accumulates so a
    // future refactor can switch the selector over.
    if (agent.modelId) {
      recordModelOutcomeByModelId(input.prompt, agent.modelId, outcome);
    }
```

</details>

**依据 3 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:797-825](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L797-L825)

已有api-success来源，非未来新量。

<details>
<summary>查看原文（29行）</summary>

```text
    // ADR-150 weight-eft capture seam — the ONLY place a run's full outcome is
    // known here: prompt (issue), assistant transcript, model, tier, and a
    // resolved PROXY. Gated behind CLAUDE_FLOW_RUN_TRANSCRIPTS=1 (off by
    // default; PII/retention surface, mirrors the router trajectory recorder).
    // HONESTY: `resolved` here is the WEAKEST proxy — 'api-success' means only
    // that the model returned without an API error, NOT that the output is
    // correct (ruflo has no SWE-bench gold oracle). model_patch is '' because
    // this single-shot execute path produces no unified diff. Both facts are
    // stamped so no downstream weight-eft export mistakes this for gold data.
    if (process.env.CLAUDE_FLOW_RUN_TRANSCRIPTS === '1') {
      try {
        const { recordRunTranscript, tierForModel } = await import('../ruvector/run-transcript-recorder.js');
        const modelId = agent.modelId ?? String(agent.model ?? 'unknown');
        const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [];
        if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
        messages.push({ role: 'user', content: input.prompt });
        if (result.success && typeof result.output === 'string') {
          messages.push({ role: 'assistant', content: result.output });
        }
        recordRunTranscript({
          task: input.prompt,
          model: modelId,
          tier: tierForModel(modelId),
          resolved: outcome === 'success',
          resolvedSource: 'api-success',
          messages,
          source: 'agent-execute',
          tokens: result.usage ? { input: result.usage.inputTokens, output: result.usage.outputTokens } : undefined,
        });
```

</details>

**依据 4 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-tools.ts:559-592](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-tools.ts#L559-L592)

状态终止与请求退出应分开。

<details>
<summary>查看原文（34行）</summary>

```text
    handler: async (input) => {
      const v = validateIdentifier(input.agentId, 'agentId');
      if (!v.valid) return { success: false, error: `Input validation failed: ${v.error}` };

      const store = loadAgentStore();
      const agentId = input.agentId as string;

      if (store.agents[agentId]) {
        const rec = store.agents[agentId];
        rec.status = 'terminated';
        saveAgentStore(store);

        // ACOW — resolve the agent's COW memory branch on teardown: promote
        // (merge into base) when asked, else discard. Non-fatal — a failure
        // here never blocks termination. Discard needs no agenticow (pure fs),
        // so cleanup still works in the degraded path.
        let memory: Record<string, unknown> | undefined;
        if (rec.memoryBranch) {
          try {
            const { SwarmMemoryBranches } = await import('../services/swarm-memory-branches.js');
            const svc = new SwarmMemoryBranches();
            memory = input.promoteMemory
              ? (await svc.promoteAgent(agentId)) as unknown as Record<string, unknown>
              : (await svc.discardAgent(agentId)) as unknown as Record<string, unknown>;
          } catch { /* best-effort teardown */ }
        }

        return {
          success: true,
          agentId,
          terminated: true,
          terminatedAt: new Date().toISOString(),
          ...(memory ? { memory } : {}),
        };
```

</details>

**依据 5 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:253-285](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L253-L285)

请求独立timeout/controller。

<details>
<summary>查看原文（33行）</summary>

```text
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), input.timeoutMs || 60000);
  try {
    const baseUrl = (process.env.ANTHROPIC_BASE_URL || 'https://api.anthropic.com').replace(/\/+$/, '');
    const res = await fetch(`${baseUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        ...(anthropicAuthToken
          ? { Authorization: `Bearer ${anthropicAuthToken}` }
          : { 'x-api-key': anthropicKey }),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model,
        max_tokens: input.maxTokens || 1024,
        // #2357 — omit temperature for models that reject sampling params
        // (Fable 5 / Opus 4.8 / Opus 4.7 → 400 "Extra inputs are not
        // permitted"); keep the 0.7 default unchanged for models that still
        // accept it (sonnet / haiku / opus ≤4.6).
        ...(modelRejectsSamplingParams(model)
          ? {}
          : { temperature: typeof input.temperature === 'number' ? input.temperature : 0.7 }),
        // #8 prompt caching (hermes-agent pattern): mark the (often large,
        // stable) system prompt as an ephemeral cache breakpoint so repeated
        // agent_execute calls with the same system prompt hit Anthropic's
        // prompt cache (~90% discount on cached input tokens, 5-min TTL).
        ...(input.systemPrompt
          ? { system: [{ type: 'text', text: input.systemPrompt, cache_control: { type: 'ephemeral' } }] }
          : {}),
        messages: [{ role: 'user', content: input.prompt }],
      }),
      signal: controller.signal,
```

</details>

**依据 6 · 源码核查**：[v3/@claude-flow/cli/src/mcp-tools/agent-execute-core.ts:832-861](https://github.com/ruvnet/ruflo/blob/89b0cd02dd99ea1f63437fde6c05992ec53cc22b/v3/%40claude-flow/cli/src/mcp-tools/agent-execute-core.ts#L832-L861)

已有重读/并发保护作基底。

<details>
<summary>查看原文（30行）</summary>

```text
  const remaining = (activeExecutions.get(executionKey) || 1) - 1;
  const persistCompletion = (out?: AgentExecuteResult): void => {
    // Awaited provider/feedback work may have overlapped registration, updates,
    // termination or deletion. Never replace that newer registry snapshot.
    const latest = loadAgentStore();
    const current = latest.agents[input.agentId];
    if (!current || current.createdAt !== agent.createdAt) return;
    if (current.status === 'busy') current.status = remaining > 0 ? 'busy' : 'idle';
    if (agent.modelId !== initialModelId && current.modelId === initialModelId) {
      // A fallback may also change its tier. Carry that change with the model
      // ID, but preserve any selection the user edited during the request.
      if (agent.model !== initialModel && current.model === initialModel) current.model = agent.model;
      current.modelId = agent.modelId;
    }
    if (out) current.lastResult = out as unknown as Record<string, unknown>;
    const previousMeasuredHealth = summarizeAgentExecutions(current.executionHistory).health;
    const mayUpdateStoredHealth = previousMeasuredHealth === null
      ? current.health === agent.health
      : current.health === previousMeasuredHealth;
    current.executionHistory = appendAgentExecution(current.executionHistory, {
      at: new Date().toISOString(),
      success: result.success,
      durationMs: result.durationMs ?? Date.now() - startedAt,
    });
    // An explicit agent_update during the provider call still wins. The
    // measured value remains available from executionHistory in agent_health.
    if (mayUpdateStoredHealth) {
      current.health = summarizeAgentExecutions(current.executionHistory).health ?? current.health;
    }
    saveAgentStore(latest);
```

</details>

#### 缺口

- 真实验收标签/退出对照、其他quality通路和需求经济性未验证
  **影响**：只是候选，先小修/原生Task基线，不能称已实现可靠自学习或新产品需求
  **进一步探讨**：先查既有质量接口并用隔离任务证伪，不能降低误判/重复和恢复成本就否定。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
