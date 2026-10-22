# dsh-anet

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[0343705](https://github.com/ANetResearch/ANet/tree/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)
<!-- END META -->

> **实现功能**：通过本地AgentNetwork节点发现远端Agent、发送加密任务、跟踪执行并处理有价格的技能。

> **核心亮点**：把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线。它相对“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已运行 AgentNetwork 节点并需要跨 Agent 委派的开发者或运营者可用它把 DSH 接到本地 anet 节点，支持发现 Agent、委派和跟踪加密任务、价格限制与入站任务处理；合格结果是任务发给明确身份的 Agent，端到端状态、费用边界和最终结果可核对，失败不被误记为完成。详见[Q01](#research-q01)。

基线是通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果。本项的价值主要来自把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Agent 发现 | 通过本地节点查询可用 Agent 与技能。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 加密任务委派 | 发送并跟踪跨 Agent 任务。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 预算与入站处理 | 在运营者限制内处理价格和发送到本节点的任务。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 本地 anet node与CLI/MCP入口 | 必需 | 发现Agent、提交和跟踪A2A任务 | 节点未就绪时技能应返回诊断 |
| Agent身份、端到端密钥与网络 | 任务必需 | 选择接收方并加密传输 | 身份不可核或密钥失败时不得发送 |
| 运营者预算/价格限制 | 付费技能必需 | 约束结算与防超支 | 报价或余额未知时停止提交 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 检查本地节点状态并发现目标Agent/技能 | 身份、能力、报价和网络状态可见 |
| 2 | 提交带任务ID、预算和截止条件的加密任务 | 收到可追踪受理回执 |
| 3 | 轮询到终态并核结果/结算；未知效果人工接管 | 失败不重复扣费或重复副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地节点算力/存储与网络 | 安装anet、建立身份/密钥、配置DSH环境 | 节点运维与信任建立时间未知 |
| 持续使用 | 远端技能报价、网络与节点资源 | 选Agent、定义验收、跟踪和复核 | 每个合格任务总价与人工分钟未知 |
| 失败恢复 | 重试可能重复结算或远端副作用 | 查任务ID/链上或节点状态后决定重试 | 远端已执行但回执丢失最难恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 跨Agent委派 | 插件提供节点环境和Skill入口 | 远端执行成功率与端到端时延 |
| 身份与加密 | 作者声明由anet节点提供 | 本分发组件未独立验证密码学与密钥恢复 |
| 预算控制 | 可在运营者限制内结算技能 | 并发/超时下是否避免重复扣费 |

> **思考**：组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线。它相对“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线。它相对“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 deploy/plugins/dist/dsh/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“轮询到终态并核结果/结算；未知效果人工接管｜失败不重复扣费或重复副作用”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

已部署anet节点者值得观察；试用前应固定节点版本并验证身份、预算、失败重试和未知执行效果。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 deploy/plugins/dist/dsh/README.md、deploy/plugins/dist/dsh/package.json、deploy/plugins/dist/dsh/index.js 及固定范围 inventory；组件：deploy/plugins/dist/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。

**分析版本**

- **仓库**：[ANetResearch/ANet](https://github.com/ANetResearch/ANet)
- **版本号**：0.2.0（[固定提交 0343705](https://github.com/ANetResearch/ANet/tree/0343705ad75ee90d83c3044853569fd4df5baea6)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可为每次委派保存身份、预算、状态转换与结果摘要的不可变回执，并对未知效果实施显式人工接管。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/ANetResearch/ANet/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-anet 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是已运行 AgentNetwork 节点并需要跨 Agent 委派的开发者或运营者。反复任务是把 DSH 接到本地 anet 节点，支持发现 Agent、委派和跟踪加密任务、价格限制与入站任务处理。原有办法为通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果。合格结果必须达到“任务发给明确身份的 Agent，端到端状态、费用边界和最终结果可核对，失败不被误记为完成”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:1-19](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# anet

[中文文档](./README_CN.md)

Connects DeepSeek Harness to AgentNetwork (anet), so that the agent in a DeepSeek Harness session can hand work to other AI agents over the [A2A protocol](https://a2a-protocol.org) and answer tasks that other agents send to this machine.

anet is an open-source node that runs on the user's machine. It holds the agent's identity, encrypts every message end to end, and exchanges tasks with other nodes through a hub. The hub relays messages and cannot read them. anet runs no model: the agents at either end do the work. Priced skills are settled with [a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) within limits that only the operator sets.

## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
| MCP server | `anet` | The tools of `anet mcp`, served by the anet installed on this machine. Its tool `guide` returns the current guide to anet. |
| Skill | `anet` | Tells the agent to read the guide of the installed anet before the first anet action of a session and on every "@anet" request, and holds the rules that always apply. Loaded when the user writes "@anet", mentions anet, AgentNetwork or an AID, or wants to hand work to other agents. |
| Skill | `anet-status` | Shows the state of the node, as the guide of the installed anet describes. |
| Skill | `anet-setup` | Finds the anet executable, installs anet when it is missing and the user agrees, and follows the setup guide of the installed anet. |

The plugin carries no description of the tools of anet or of its setup steps: the installed anet provides them (the MCP tool `guide`, and `anet guide` on the command line). A new release of anet therefore reaches DeepSeek Harness with the anet executable alone; the plugin does not need an update.

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

deploy/plugins/dist/dsh/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“检查本地节点状态并发现目标Agent/技能｜身份、能力、报价和网络状态可见；提交带任务ID、预算和截止条件的加密任务｜收到可追踪受理回执；轮询到终态并核结果/结算；未知效果人工接管｜失败不重复扣费或重复副作用”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/package.json:1-26](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-anet",
  "version": "0.2.0",
  "description": "Delegate tasks to other AI agents over A2A through a local AgentNetwork (anet) node: find agents, send and track end-to-end encrypted tasks, settle priced skills within operator limits, and answer tasks sent to this node.",
  "license": "Apache-2.0",
  "author": "Agent Network Research (https://agentnetwork.org.cn)",
  "homepage": "https://docs.agentnetwork.org.cn/docs/en/latest/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ANetResearch/ANet.git",
    "directory": "deploy/plugins/dist/dsh"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "anet",
    "agentnetwork",
    "a2a",
    "agent-to-agent",
    "mcp",
    "x402",
    "multi-agent"
  ],
  "type": "module",
  "main": "index.js",
  "files": [
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线。参照是“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/README.md:1-19](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# anet

[中文文档](./README_CN.md)

Connects DeepSeek Harness to AgentNetwork (anet), so that the agent in a DeepSeek Harness session can hand work to other AI agents over the [A2A protocol](https://a2a-protocol.org) and answer tasks that other agents send to this machine.

anet is an open-source node that runs on the user's machine. It holds the agent's identity, encrypts every message end to end, and exchanges tasks with other nodes through a hub. The hub relays messages and cannot read them. anet runs no model: the agents at either end do the work. Priced skills are settled with [a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) within limits that only the operator sets.

## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
| MCP server | `anet` | The tools of `anet mcp`, served by the anet installed on this machine. Its tool `guide` returns the current guide to anet. |
| Skill | `anet` | Tells the agent to read the guide of the installed anet before the first anet action of a session and on every "@anet" request, and holds the rules that always apply. Loaded when the user writes "@anet", mentions anet, AgentNetwork or an AID, or wants to hand work to other agents. |
| Skill | `anet-status` | Shows the state of the node, as the guide of the installed anet describes. |
| Skill | `anet-setup` | Finds the anet executable, installs anet when it is missing and the user agrees, and follows the setup guide of the installed anet. |

The plugin carries no description of the tools of anet or of its setup steps: the installed anet provides them (the MCP tool `guide`, and `anet guide` on the command line). A new release of anet therefore reaches DeepSeek Harness with the anet executable alone; the plugin does not need an update.

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

#### 缺口

- 缺少针对“组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：本地 anet node与CLI/MCP入口｜必需｜发现Agent、提交和跟踪A2A任务｜节点未就绪时技能应返回诊断；Agent身份、端到端密钥与网络｜任务必需｜选择接收方并加密传输｜身份不可核或密钥失败时不得发送；运营者预算/价格限制｜付费技能必需｜约束结算与防超支｜报价或余额未知时停止提交。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“轮询到终态并核结果/结算；未知效果人工接管｜失败不重复扣费或重复副作用”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/package.json:1-26](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-anet",
  "version": "0.2.0",
  "description": "Delegate tasks to other AI agents over A2A through a local AgentNetwork (anet) node: find agents, send and track end-to-end encrypted tasks, settle priced skills within operator limits, and answer tasks sent to this node.",
  "license": "Apache-2.0",
  "author": "Agent Network Research (https://agentnetwork.org.cn)",
  "homepage": "https://docs.agentnetwork.org.cn/docs/en/latest/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ANetResearch/ANet.git",
    "directory": "deploy/plugins/dist/dsh"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "anet",
    "agentnetwork",
    "a2a",
    "agent-to-agent",
    "mcp",
    "x402",
    "multi-agent"
  ],
  "type": "module",
  "main": "index.js",
  "files": [
```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“任务发给明确身份的 Agent，端到端状态、费用边界和最终结果可核对，失败不被误记为完成”为合格单位。三阶段投入为：首次使用｜本地节点算力/存储与网络｜安装anet、建立身份/密钥、配置DSH环境｜节点运维与信任建立时间未知；持续使用｜远端技能报价、网络与节点资源｜选Agent、定义验收、跟踪和复核｜每个合格任务总价与人工分钟未知；失败恢复｜重试可能重复结算或远端副作用｜查任务ID/链上或节点状态后决定重试｜远端已执行但回执丢失最难恢复。当前源码只支持机制存在，效果维度为“跨Agent委派｜插件提供节点环境和Skill入口｜远端执行成功率与端到端时延；身份与加密｜作者声明由anet节点提供｜本分发组件未独立验证密码学与密钥恢复；预算控制｜可在运营者限制内结算技能｜并发/超时下是否避免重复扣费”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:1-19](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# anet

[中文文档](./README_CN.md)

Connects DeepSeek Harness to AgentNetwork (anet), so that the agent in a DeepSeek Harness session can hand work to other AI agents over the [A2A protocol](https://a2a-protocol.org) and answer tasks that other agents send to this machine.

anet is an open-source node that runs on the user's machine. It holds the agent's identity, encrypts every message end to end, and exchanges tasks with other nodes through a hub. The hub relays messages and cannot read them. anet runs no model: the agents at either end do the work. Priced skills are settled with [a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) within limits that only the operator sets.

## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
| MCP server | `anet` | The tools of `anet mcp`, served by the anet installed on this machine. Its tool `guide` returns the current guide to anet. |
| Skill | `anet` | Tells the agent to read the guide of the installed anet before the first anet action of a session and on every "@anet" request, and holds the rules that always apply. Loaded when the user writes "@anet", mentions anet, AgentNetwork or an AID, or wants to hand work to other agents. |
| Skill | `anet-status` | Shows the state of the node, as the guide of the installed anet describes. |
| Skill | `anet-setup` | Finds the anet executable, installs anet when it is missing and the user agrees, and follows the setup guide of the installed anet. |

The plugin carries no description of the tools of anet or of its setup steps: the installed anet provides them (the MCP tool `guide`, and `anet guide` on the command line). A new release of anet therefore reaches DeepSeek Harness with the anet executable alone; the plugin does not need an update.

```

</details>

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/package.json:1-26](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-anet",
  "version": "0.2.0",
  "description": "Delegate tasks to other AI agents over A2A through a local AgentNetwork (anet) node: find agents, send and track end-to-end encrypted tasks, settle priced skills within operator limits, and answer tasks sent to this node.",
  "license": "Apache-2.0",
  "author": "Agent Network Research (https://agentnetwork.org.cn)",
  "homepage": "https://docs.agentnetwork.org.cn/docs/en/latest/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ANetResearch/ANet.git",
    "directory": "deploy/plugins/dist/dsh"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "anet",
    "agentnetwork",
    "a2a",
    "agent-to-agent",
    "mcp",
    "x402",
    "multi-agent"
  ],
  "type": "module",
  "main": "index.js",
  "files": [
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 deploy/plugins/dist/dsh/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“轮询到终态并核结果/结算；未知效果人工接管｜失败不重复扣费或重复副作用”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/package.json:1-26](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-anet",
  "version": "0.2.0",
  "description": "Delegate tasks to other AI agents over A2A through a local AgentNetwork (anet) node: find agents, send and track end-to-end encrypted tasks, settle priced skills within operator limits, and answer tasks sent to this node.",
  "license": "Apache-2.0",
  "author": "Agent Network Research (https://agentnetwork.org.cn)",
  "homepage": "https://docs.agentnetwork.org.cn/docs/en/latest/",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/ANetResearch/ANet.git",
    "directory": "deploy/plugins/dist/dsh"
  },
  "keywords": [
    "dsh-plugin",
    "deepseek-harness",
    "anet",
    "agentnetwork",
    "a2a",
    "agent-to-agent",
    "mcp",
    "x402",
    "multi-agent"
  ],
  "type": "module",
  "main": "index.js",
  "files": [
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把本地节点环境配置、A2A 操作与 DSH Skill 入口打包，减少跨工具委派接线”和“组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络”推导的新方向是可为每次委派保存身份、预算、状态转换与结果摘要的不可变回执，并对未知效果实施显式人工接管。它不是当前能力。最小验证为用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。已部署anet节点者值得观察；试用前应固定节点版本并验证身份、预算、失败重试和未知执行效果。 试用成功标准是“任务发给明确身份的 Agent，端到端状态、费用边界和最终结果可核对，失败不被误记为完成”，并且 远端执行成功率与端到端时延、本分发组件未独立验证密码学与密钥恢复、并发/超时下是否避免重复扣费 有可接受结果；停止标准包括发生组件主要是分发与接线层，端到端加密、结算和远端执行可靠性归属于外部 anet 节点与网络所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“通过外部 A2A 客户端或 MCP 手工发现 Agent、发送任务并轮询结果”。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:1-19](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# anet

[中文文档](./README_CN.md)

Connects DeepSeek Harness to AgentNetwork (anet), so that the agent in a DeepSeek Harness session can hand work to other AI agents over the [A2A protocol](https://a2a-protocol.org) and answer tasks that other agents send to this machine.

anet is an open-source node that runs on the user's machine. It holds the agent's identity, encrypts every message end to end, and exchanges tasks with other nodes through a hub. The hub relays messages and cannot read them. anet runs no model: the agents at either end do the work. Priced skills are settled with [a2a-x402](https://github.com/google-agentic-commerce/a2a-x402) within limits that only the operator sets.

## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
| MCP server | `anet` | The tools of `anet mcp`, served by the anet installed on this machine. Its tool `guide` returns the current guide to anet. |
| Skill | `anet` | Tells the agent to read the guide of the installed anet before the first anet action of a session and on every "@anet" request, and holds the rules that always apply. Loaded when the user writes "@anet", mentions anet, AgentNetwork or an AID, or wants to hand work to other agents. |
| Skill | `anet-status` | Shows the state of the node, as the guide of the installed anet describes. |
| Skill | `anet-setup` | Finds the anet executable, installs anet when it is missing and the user agrees, and follows the setup guide of the installed anet. |

The plugin carries no description of the tools of anet or of its setup steps: the installed anet provides them (the MCP tool `guide`, and `anet guide` on the command line). A new release of anet therefore reaches DeepSeek Harness with the anet executable alone; the plugin does not need an update.

```

</details>

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/index.js:49-66](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L49-L66)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text

// Sets the environment variables of the effective settings and returns the
// function that restores the previous state.
export function applyEnvironment(settings, env) {
  const previous = new Map()
  for (const [key, variable] of SETTINGS) {
    if (!settings[key] || env[variable] === settings[key]) continue
    previous.set(variable, { before: env[variable], applied: settings[key] })
    env[variable] = settings[key]
  }
  return () => {
    for (const [variable, { before, applied }] of previous) {
      // Restore only a value that this plugin set; a later change by another owner stays.
      if (env[variable] !== applied) continue
      if (before === undefined) delete env[variable]
      else env[variable] = before
    }
  }
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：用两个受控Agent执行30个可幂等任务，注入受理后断网、结果丢失和报价变化；记录完成率、P95时延、每个合格任务价格、重复执行/扣费数，任何未知状态自动重提即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
