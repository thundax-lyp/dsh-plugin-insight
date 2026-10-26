# oh-my-dsh

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[aa0b8de](https://github.com/1225Sakura/oh-my-deepseekharness/tree/aa0b8dee1a15e0eb66a3a334377c74dd505a743e)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) [![npm 30d 2,166](https://img.shields.io/static/v1?label=npm+30d&message=2%2C166&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) [![最新发布 2026-10-22](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-22&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness)
<!-- END META -->

> **实现功能**：为 DSH 提供多智能体编排、角色资产、状态工具、团队运行时与恢复机制。

> **核心亮点**：相对直接使用 DSH 原生工具，它把 OMC/OMX 的编排资产适配为 DSH 服务、降级矩阵和可恢复团队状态，增量主要是系统化组合与宿主接线，而非全新基础算法。 [Q03](#research-q03)

> **风险与缺陷**：覆盖面很大，但价值依赖模型遵循协议、宿主服务契约与大量状态文件持续一致；源码可见注册和守卫，尚无同任务对照证明端到端合格率高于更小的原生流程。 [Q04](#research-q04)

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
  - [Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？](#detail-section-11)
  - [Q02 · 能力如何从入口、注册、调用到状态变化实现？](#detail-section-12)
  - [Q03 · 相对原生能力或简单替代，固定版本增加了什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心价值不成立？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复分别依赖什么？](#detail-section-15)
  - [Q06 · 首次、持续与失败恢复成本及效果证据如何？](#detail-section-16)
  - [Q07 · 实现有哪些可靠性取舍和可复用设计？](#detail-section-17)
  - [Q08 · 由贡献和限制能推导什么未验证方向？](#detail-section-18)
  - [Q09 · 对什么人值得观察或试用，成功与停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望在 DSH 内组织长链路编码任务的开发者，把规划、委派、评审、恢复与团队协作收进一套显式协议。 [Q01](#research-q01)

基线是直接使用 DSH 的 goal、ralph、subagent 与文件工具，由用户自行规划和验收；该插件增加角色资产、状态协议和团队运行时，但也增加配置、提示与状态维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 三种编排模式 | autopilot、ralph 与 team 组织不同复杂度任务。 | 仅由固定版本源码确认；运行效果未验证 |
| 状态与恢复 | 以 `.omd` 保存阶段、交接、事件与检查点。 | 仅由固定版本源码确认；运行效果未验证 |
| 委派与代码智能 | 提供模型路由、AST/LSP 及团队协调工具。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node.js ≥22.19 与兼容 DSH | 必需 | 加载插件及宿主 API | 启动失败或契约不兼容 |
| tools/skills/systemPrompt/commands | 必需 | 注入协议、资产、命令和工具 | `apply` 明确抛错 |
| storage/subagents/MCP/webServer | 按能力 | 记忆、委派、状态工具与 HUD | 探测后降级，能力矩阵必须显示缺口 |
| `.omd` 写权限与可信 graph descriptor | team/graph 必需 | 保存状态、交接和执行命令 | 不能恢复；不可信命令节点具有 shell 权限 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 验装 | 用户重载 profile 并运行 `/omd-doctor` | 核心服务、目录写入与 MCP 状态可见 |
| 选择模式 | 用户按任务复杂度显式选 autopilot/ralph/team | 普通任务不误触发 team |
| 执行与验收 | 领队模型推进阶段并执行测试/评审门 | graph/team 状态与产物一致 |
| 取消或恢复 | 用户调用 cancel 并核对 `.omd` journal/handoff | 无孤儿 worktree、重复节点或丢失交接 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Node/DSH 与可选 LSP/AST 进程；金额未知 | 选择模型档位、理解 42 Skill 与模式，分钟数未知 | 复杂度显著高于原生 goal |
| 持续使用 | 多角色模型调用、heartbeat、HUD 与状态 I/O | 阶段交接、双评审和冲突处理 | 缺 token 与委派次数台账 |
| 失败恢复 | 重跑节点或模型会追加调用 | 核对 graph journal、mailbox、handoff、worktree | 恢复成功率与重复执行风险未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 编排覆盖 | 三模式、角色资产、team/graph 状态机存在 | 是否提高真实任务合格率 |
| 降级与恢复 | 核心/可选依赖分层，状态有 journal/handoff | 崩溃后是否无重复副作用恢复 |
| 总负担 | 协议集中规划、评审和交接 | 是否比原生 goal 少人工且不多耗模型 |

> **思考**：覆盖面很大，但价值依赖模型遵循协议、宿主服务契约与大量状态文件持续一致；源码可见注册和守卫，尚无同任务对照证明端到端合格率高于更小的原生流程。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对直接使用 DSH 原生工具，它把 OMC/OMX 的编排资产适配为 DSH 服务、降级矩阵和可恢复团队状态，增量主要是系统化组合与宿主接线，而非全新基础算法。 [Q03](#research-q03)

相对直接使用 DSH 原生工具，它把 OMC/OMX 的编排资产适配为 DSH 服务、降级矩阵和可恢复团队状态，增量主要是系统化组合与宿主接线，而非全新基础算法。 [Q03](#research-q03)

入口将硬依赖与可降级能力分开，注册随 Cordis scope 回收，值得借鉴；但资产、工具和状态面很宽，升级时需同时验证协议、文件格式和宿主 API。

<a id="detail-section-5"></a>

### 1.4 主要限制

覆盖面很大，但价值依赖模型遵循协议、宿主服务契约与大量状态文件持续一致；源码可见注册和守卫，尚无同任务对照证明端到端合格率高于更小的原生流程。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已经有长链路、多阶段或并行冲突任务，并愿意维护 `.omd` 状态的 DSH 团队先观察；普通单文件任务继续用原生 goal 或直接工具。试验成功需在相同测试门槛下减少人工接管或返工，且取消后能从 journal/handoff 恢复；若委派调用和状态修复增加而合格率不升，应停用复杂模式。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在同一固定仓库和模型预算下完成一个跨模块变更：原生 goal、autopilot、team 各运行至少多次，以测试全绿和两类评审无阻塞为合格；记录调用数、token、墙钟、人工接管、重复节点和恢复结果。team 未提高合格率或恢复产生重复副作用即推翻渐进启用假设。

**分析版本**

- **仓库**：[1225Sakura/oh-my-deepseekharness](https://github.com/1225Sakura/oh-my-deepseekharness)
- **版本号**：0.5.1（[固定提交 aa0b8de](https://github.com/1225Sakura/oh-my-deepseekharness/tree/aa0b8dee1a15e0eb66a3a334377c74dd505a743e)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可验证“按任务风险渐进开启编排能力”的设计，只在跨阶段或并行冲突出现时启用 team/graph，以降低常规任务的提示与状态负担。 [Q08](#research-q08)

在同一固定仓库和模型预算下完成一个跨模块变更：原生 goal、autopilot、team 各运行至少多次，以测试全绿和两类评审无阻塞为合格；记录调用数、token、墙钟、人工接管、重复节点和恢复结果。team 未提高合格率或恢复产生重复副作用即推翻渐进启用假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 173 | 22218 | — | — | 271382 |
| .mjs | source | 18 | 2708 | 2233 | 328 | — |
| .js | source | 30 | 6203 | 4525 | 1350 | — |
| .js | test | 46 | 10116 | 8651 | 918 | — |
| .mjs | example | 1 | 83 | 74 | 5 | — |
| .mjs | test | 1 | 66 | 42 | 17 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 oh-my-dsh 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向希望在 DSH 内组织长链路编码任务的开发者，把规划、委派、评审、恢复与团队协作收进一套显式协议。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是直接使用 DSH 的 goal、ralph、subagent 与文件工具，由用户自行规划和验收；该插件增加角色资产、状态协议和团队运行时，但也增加配置、提示与状态维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

````text
# oh-my-dsh (omd)

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE) [![Node.js >=22.19.0](https://img.shields.io/badge/node-%3E%3E22.19.0-brightgreen)](https://nodejs.org/) [![Tests: 558 passed](https://img.shields.io/badge/tests-558%20passed-brightgreen)](./tests)

**DeepSeek Harness 的多智能体编排层** —— OMC / OMX 编排理念的 dsh 宿主适配实现。
Multi-agent orchestration layer for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness), adapted from:

- [oh-my-claudecode (OMC)](https://github.com/Yeachan-Heo/oh-my-claudecode) — Claude Code 编排层
- [oh-my-codex (OMX)](https://github.com/Yeachan-Heo/oh-my-codex) — Codex 编排层

omd 以单个 dsh 插件交付：注入编排协议到系统提示词、注册 42 个 skill 目录 + 33 个 `omd-agent-*` 角色卡（66 个双语文件，会话技能目录共 75 条）与 2 个斜杠命令、挂载内置 MCP server 提供 55 个状态/记忆/协调/代码智能/graph 运行时工具。三种执行模式（autopilot / ralph / team）：autopilot 与 ralph 由 dsh 原生 `goal` / `ralph` 工具驱动前台循环；team 由 `lib/team.js` 领队运行时驱动（阶段状态机 + 队员 UUID 生命周期 + mailbox + heartbeat + merge 计划，无 tmux——dsh 无承载面）。

---

## 安装 / Install

```bash
# 发布后（npm 包名 @sakura12/oh-my-deepseekharness——注意裸 oh-my-dsh 是 npm 上另一个已停更的包）
dsh plugin --profile <profile> add @sakura12/oh-my-deepseekharness

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

入口探测宿主服务并注册协议、技能、命令、记忆、委派、关键词钩子、心跳与 HUD；项目内 `.omd` 保存模式状态和交接材料。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对直接使用 DSH 原生工具，它把 OMC/OMX 的编排资产适配为 DSH 服务、降级矩阵和可恢复团队状态，增量主要是系统化组合与宿主接线，而非全新基础算法。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：覆盖面很大，但价值依赖模型遵循协议、宿主服务契约与大量状态文件持续一致；源码可见注册和守卫，尚无同任务对照证明端到端合格率高于更小的原生流程。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

Node.js 22.19 及兼容 DSH；核心 tools、skills、systemPrompt、commands 服务必需，storage、subagents、MCP、AST/LSP 与 webServer 可降级；需允许项目写入 `.omd`。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次使用需要安装 Node.js 22.19+、兼容 DSH，并理解 42 个 Skill、33 个角色和三种模式；持续成本来自更多模型委派、`.omd` 状态文件、heartbeat/HUD 与可选 LSP 进程；失败恢复要核对 graph journal、mailbox、handoff 和 worktree 状态。现金成本取决于各 tier/role 实际模型调用，当前没有每个合格任务的 token、委派次数和人工评审分钟数，因此不能声称编排节省成本。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

#### 缺口

- 缺少同一编码任务在原生 DSH 与 omd 三种模式下的模型调用数、token、墙钟时间、人工评审时间和恢复次数。
  **影响**：无法判断大量角色与状态协议是否降低返工，还是只增加模型和协调预算。
  **进一步探讨**：固定一个跨文件实现任务，分别用原生 goal、autopilot 和 team 执行，按通过同一测试与双评审门计合格数，并记录总调用、token、人工分钟和失败恢复。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

入口将硬依赖与可降级能力分开，注册随 Cordis scope 回收，值得借鉴；但资产、工具和状态面很宽，升级时需同时验证协议、文件格式和宿主 API。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可验证“按任务风险渐进开启编排能力”的设计，只在跨阶段或并行冲突出现时启用 team/graph，以降低常规任务的提示与状态负担。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合已经有长链路、多阶段或并行冲突任务，并愿意维护 `.omd` 状态的 DSH 团队先观察；普通单文件任务继续用原生 goal 或直接工具。试验成功需在相同测试门槛下减少人工接管或返工，且取消后能从 journal/handoff 恢复；若委派调用和状态修复增加而合格率不升，应停用复杂模式。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1225Sakura/oh-my-deepseekharness/blob/aa0b8dee1a15e0eb66a3a334377c74dd505a743e/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
// lib/index.js
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { Config } from './config.js'
import { probeCapabilities, _resetCache } from './probe.js'
import { renderProtocol } from './protocol.js'
import { renderRuntimeSnapshot } from './runtime.js'
import { loadAssets, registerAssets } from './skills.js'
import { registerCommands } from './commands.js'
import { registerMemoryTools } from './memory.js'
import { registerDelegateTool } from './delegate.js'
import { registerKeywordHook } from './hook.js'
import { registerHeartbeatTimer } from './heartbeat.js'
import { registerHudRoute } from './hud-route.js'

export const name = 'oh-my-dsh'
// 双清单语义（M1.1 修复）：
// - CORE_SERVICES：缺失即抛错（规格 §6.1 例外条款——没有它们插件根本无法工作）
// - inject 全量 = CORE_SERVICES + storage：storage 必须进 inject（cordis 对未 inject
//   服务的访问抛错——B1 教训；dsh-base 的 cordis.patch.yml 挂载了 dsh-storage 三件套，
//   任何 base profile 都保证它存在）。storage 缺失仍走降级不抛错（防御非 base profile）。
const CORE_SERVICES = ['tools', 'skills', 'systemPrompt', 'commands']
// M3 c1：subagents 进 inject（设计规格 §7-5：omd_delegate 用宿主 dsh-subagent 服务 spawn
// 指定 model）——cordis 对未 inject 服务的访问抛错（B1 教训）；dsh-base 每个模板都挂
// subagent 缝，缺席时 setup 内 tryGet 降级记 probeReport.delegate=unavailable。
export const inject = [...CORE_SERVICES, 'storage', 'subagents']
export { Config }

const DEFAULT_ASSETS = join(dirname(fileURLToPath(import.meta.url)), '..', 'assets')

// §7-2 核验：dsh-system-prompt 的 section()/context() 都强制 Number.isFinite(order)；
// context 的集中档位 CONTEXT_ORDERS 用到 120（SUBAGENT_DELEGATION），omd 顺延。
const PROTOCOL_SECTION_ORDER = 100
const RUNTIME_CONTEXT_ORDER = 130

/**
 * cordis 插件入口。配置变更时宿主经 Fiber.update() → restart() 重放本函数，
 * 所有注册（section/context/skill/command/tool/domain close）随 scope dispose 自动回收。
 *
 * cordis 契约：apply 的返回值只能是 dispose 函数或 null/undefined，
```

</details>

#### 缺口

- 未比较原生 DSH 与 omd 在同任务、同模型预算下的合格率和协调开销。
  **影响**：无法判断系统化编排是否值得常驻，而非仅在复杂任务临时启用。
  **进一步探讨**：用同一仓库任务对照原生 goal、autopilot 和 team，记录测试通过、评审缺陷、调用预算、人工接管和恢复成功。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
