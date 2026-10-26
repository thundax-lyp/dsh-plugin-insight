# dsh-jev-guard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a74afc3](https://github.com/7starsseeker/dsh-jev-guard/tree/a74afc36467a75edec1f5c1e2ed98cfdaa246073)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/7starsseeker/dsh-jev-guard) [![npm 30d 1,817](https://img.shields.io/static/v1?label=npm+30d&message=1%2C817&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
<!-- END META -->

> **实现功能**：在shell执行前调用Jev判定不可逆删除或覆盖风险，并给出允许、改写、阻断或升级结果。

> **核心亮点**：把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级。它相对“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：允许 Agent 执行 shell、同时需要对真实数据破坏动作设置额外审批的团队可用它在工具执行前截获 shell 命令，结合本地规则、Jev 判定、一次性令牌和审计记录实施安全闸门；合格结果是危险命令在执行前有明确判定、人工接管路径和可追溯记录，普通命令不过度阻塞。详见[Q01](#research-q01)。

基线是只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令。本项的价值主要来自把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 执行前风险闸门 | 在 shell 命令真正执行前返回允许、改写、阻断或升级。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 人工接管令牌 | 为被阻断动作提供一次性授权路径。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 审计与配额降级 | 记录判定，并在额度不足时进入显式降级策略。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Jev服务、密钥与可用区域 | 判定时必需 | 对候选命令给出 TypeSafe 结论 | 额度或区域失败按配置显式降级 |
| tools/pre-execute 与 shell exec 形状 | 必需 | 在命令执行前抽取实际命令 | 无法识别时不得假装完成检查 |
| 审计目录与一次性令牌存储 | 升级/放行时必需 | 记录判定并防令牌复用 | 写入失败需阻断或显式告警 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 从实际工具调用抽取 shell/脚本与策略上下文 | 抽取结果可展示；非 shell 请求不误拦 |
| 2 | 本地规则与 Jev 形成 allow/revise/block/escalate | 结论结构完整；服务失败走已声明策略 |
| 3 | 人工选择改写、一次性授权或放弃 | 令牌只消费一次，审计含原命令、判定和最终动作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | Jev账号/额度与本地日志空间 | 配置密钥、审批策略、区域和日志权限 | 配置/安全审阅时间未知 |
| 持续使用 | 每个候选命令的Jev调用与延迟 | 审阅 revise/escalate、处理误拦截 | 每100条命令费用、P95延迟未知 |
| 失败恢复 | 重复模型调用或离线规则判断 | 核对命令是否已执行、撤销令牌、补写审计 | 漏拦截后的数据恢复不由插件承担 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 执行前拦截 | 源码挂到 tools/pre-execute 并提供四态 | 真实危险命令漏拦截率 |
| 人工接管 | 一次性令牌和改写路径可见 | 令牌并发/重放与跨会话隔离 |
| 降级透明度 | 配额与区域分支有显式状态 | 服务故障时安全性和可用性的实际取舍 |

> **思考**：外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级。它相对“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级。它相对“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 adapters/dsh/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“人工选择改写、一次性授权或放弃｜令牌只消费一次，审计含原命令、判定和最终动作”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有高风险shell自动化的团队值得观察，试用前应以真实命令集测漏拦截、误拦截和Jev不可用时的策略。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、adapters/dsh/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。

**分析版本**

- **仓库**：[7starsseeker/dsh-jev-guard](https://github.com/7starsseeker/dsh-jev-guard)
- **版本号**：0.5.7（[固定提交 a74afc3](https://github.com/7starsseeker/dsh-jev-guard/tree/a74afc36467a75edec1f5c1e2ed98cfdaa246073)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可将高风险命令拆成资源、动作与可逆性结构，再以本地确定性规则和模型复核双层输出减少单次模型误判。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 40 | 6832 | — | — | 104576 |
| .js | source | 8 | 3279 | 1510 | 1594 | — |
| .mjs | source | 16 | 3737 | 2431 | 1012 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/7starsseeker/dsh-jev-guard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-jev-guard 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是允许 Agent 执行 shell、同时需要对真实数据破坏动作设置额外审批的团队。反复任务是在工具执行前截获 shell 命令，结合本地规则、Jev 判定、一次性令牌和审计记录实施安全闸门。原有办法为只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令。合格结果必须达到“危险命令在执行前有明确判定、人工接管路径和可追溯记录，普通命令不过度阻塞”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-jev-guard

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen.svg)](https://nodejs.org)
[![DSH plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4B6BFB.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-4B6BFB.svg)](https://github.com/topics/dsh-plugin)
[![platform](https://img.shields.io/badge/platform-WSL%20%7C%20Windows-2f2f2f.svg)](#platform-support)
[![version](https://img.shields.io/github/v/tag/7starsseeker/dsh-jev-guard?label=version&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/tags)
[![npm](https://img.shields.io/npm/v/dsh-jev-guard?label=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![downloads](https://img.shields.io/npm/dm/dsh-jev-guard?label=downloads&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![selftest](https://img.shields.io/github/actions/workflow/status/7starsseeker/dsh-jev-guard/selftest.yml?label=selftest)](https://github.com/7starsseeker/dsh-jev-guard/actions/workflows/selftest.yml)
[![last commit](https://img.shields.io/github/last-commit/7starsseeker/dsh-jev-guard)](https://github.com/7starsseeker/dsh-jev-guard/commits/main)
[![stars](https://img.shields.io/github/stars/7starsseeker/dsh-jev-guard?style=flat)](https://github.com/7starsseeker/dsh-jev-guard/stargazers)
[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **English** | [简体中文](README.zh-CN.md) | [Changelog](CHANGELOG.md) | [Design decisions](docs/DECISIONS.md) | [Measurements](docs/MEASUREMENTS.md)

**A pre-execution safety valve for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): before a command actually runs, it asks one question — "will this irreversibly delete or overwrite your real data?"**
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

adapters/dsh/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“从实际工具调用抽取 shell/脚本与策略上下文｜抽取结果可展示；非 shell 请求不误拦；本地规则与 Jev 形成 allow/revise/block/escalate｜结论结构完整；服务失败走已声明策略；人工选择改写、一次性授权或放弃｜令牌只消费一次，审计含原命令、判定和最终动作”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-jev-guard",
  "version": "0.5.7",
  "description": "Pre-execution safety valve for DeepSeek Harness: a TypeSafe Jev question decides whether a shell command/script would irreversibly delete or overwrite real data. Four states (allow/revise/block/escalate), mounted on tools/pre-execute. Zero dependencies; WSL/Linux (bash) and Windows (pwsh); one-shot tokens, credit-exhaustion degradation, shared audit log; bilingual (zh-CN / en) messages.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "guard",
    "safety",
    "destructive-command",
    "jev",
    "typesafe",
    "pre-execute",
    "audit-log"
  ],
  "type": "module",
  "main": "adapters/dsh/index.js",
  "exports": {
    ".": "./adapters/dsh/index.js",
    "./gate": "./lib/gate.js",
    "./rules": "./lib/rules.js",
    "./verdict": "./lib/verdict.js",
    "./audit": "./lib/audit.js",
    "./token": "./lib/token.js",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级。参照是“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-jev-guard

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen.svg)](https://nodejs.org)
[![DSH plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4B6BFB.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-4B6BFB.svg)](https://github.com/topics/dsh-plugin)
[![platform](https://img.shields.io/badge/platform-WSL%20%7C%20Windows-2f2f2f.svg)](#platform-support)
[![version](https://img.shields.io/github/v/tag/7starsseeker/dsh-jev-guard?label=version&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/tags)
[![npm](https://img.shields.io/npm/v/dsh-jev-guard?label=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![downloads](https://img.shields.io/npm/dm/dsh-jev-guard?label=downloads&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![selftest](https://img.shields.io/github/actions/workflow/status/7starsseeker/dsh-jev-guard/selftest.yml?label=selftest)](https://github.com/7starsseeker/dsh-jev-guard/actions/workflows/selftest.yml)
[![last commit](https://img.shields.io/github/last-commit/7starsseeker/dsh-jev-guard)](https://github.com/7starsseeker/dsh-jev-guard/commits/main)
[![stars](https://img.shields.io/github/stars/7starsseeker/dsh-jev-guard?style=flat)](https://github.com/7starsseeker/dsh-jev-guard/stargazers)
[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **English** | [简体中文](README.zh-CN.md) | [Changelog](CHANGELOG.md) | [Design decisions](docs/DECISIONS.md) | [Measurements](docs/MEASUREMENTS.md)

**A pre-execution safety valve for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): before a command actually runs, it asks one question — "will this irreversibly delete or overwrite your real data?"**
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

#### 缺口

- 缺少针对“外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：Jev服务、密钥与可用区域｜判定时必需｜对候选命令给出 TypeSafe 结论｜额度或区域失败按配置显式降级；tools/pre-execute 与 shell exec 形状｜必需｜在命令执行前抽取实际命令｜无法识别时不得假装完成检查；审计目录与一次性令牌存储｜升级/放行时必需｜记录判定并防令牌复用｜写入失败需阻断或显式告警。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“人工选择改写、一次性授权或放弃｜令牌只消费一次，审计含原命令、判定和最终动作”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-jev-guard",
  "version": "0.5.7",
  "description": "Pre-execution safety valve for DeepSeek Harness: a TypeSafe Jev question decides whether a shell command/script would irreversibly delete or overwrite real data. Four states (allow/revise/block/escalate), mounted on tools/pre-execute. Zero dependencies; WSL/Linux (bash) and Windows (pwsh); one-shot tokens, credit-exhaustion degradation, shared audit log; bilingual (zh-CN / en) messages.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "guard",
    "safety",
    "destructive-command",
    "jev",
    "typesafe",
    "pre-execute",
    "audit-log"
  ],
  "type": "module",
  "main": "adapters/dsh/index.js",
  "exports": {
    ".": "./adapters/dsh/index.js",
    "./gate": "./lib/gate.js",
    "./rules": "./lib/rules.js",
    "./verdict": "./lib/verdict.js",
    "./audit": "./lib/audit.js",
    "./token": "./lib/token.js",
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“危险命令在执行前有明确判定、人工接管路径和可追溯记录，普通命令不过度阻塞”为合格单位。三阶段投入为：首次使用｜Jev账号/额度与本地日志空间｜配置密钥、审批策略、区域和日志权限｜配置/安全审阅时间未知；持续使用｜每个候选命令的Jev调用与延迟｜审阅 revise/escalate、处理误拦截｜每100条命令费用、P95延迟未知；失败恢复｜重复模型调用或离线规则判断｜核对命令是否已执行、撤销令牌、补写审计｜漏拦截后的数据恢复不由插件承担。当前源码只支持机制存在，效果维度为“执行前拦截｜源码挂到 tools/pre-execute 并提供四态｜真实危险命令漏拦截率；人工接管｜一次性令牌和改写路径可见｜令牌并发/重放与跨会话隔离；降级透明度｜配额与区域分支有显式状态｜服务故障时安全性和可用性的实际取舍”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-jev-guard

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen.svg)](https://nodejs.org)
[![DSH plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4B6BFB.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-4B6BFB.svg)](https://github.com/topics/dsh-plugin)
[![platform](https://img.shields.io/badge/platform-WSL%20%7C%20Windows-2f2f2f.svg)](#platform-support)
[![version](https://img.shields.io/github/v/tag/7starsseeker/dsh-jev-guard?label=version&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/tags)
[![npm](https://img.shields.io/npm/v/dsh-jev-guard?label=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![downloads](https://img.shields.io/npm/dm/dsh-jev-guard?label=downloads&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![selftest](https://img.shields.io/github/actions/workflow/status/7starsseeker/dsh-jev-guard/selftest.yml?label=selftest)](https://github.com/7starsseeker/dsh-jev-guard/actions/workflows/selftest.yml)
[![last commit](https://img.shields.io/github/last-commit/7starsseeker/dsh-jev-guard)](https://github.com/7starsseeker/dsh-jev-guard/commits/main)
[![stars](https://img.shields.io/github/stars/7starsseeker/dsh-jev-guard?style=flat)](https://github.com/7starsseeker/dsh-jev-guard/stargazers)
[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **English** | [简体中文](README.zh-CN.md) | [Changelog](CHANGELOG.md) | [Design decisions](docs/DECISIONS.md) | [Measurements](docs/MEASUREMENTS.md)

**A pre-execution safety valve for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): before a command actually runs, it asks one question — "will this irreversibly delete or overwrite your real data?"**
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-jev-guard",
  "version": "0.5.7",
  "description": "Pre-execution safety valve for DeepSeek Harness: a TypeSafe Jev question decides whether a shell command/script would irreversibly delete or overwrite real data. Four states (allow/revise/block/escalate), mounted on tools/pre-execute. Zero dependencies; WSL/Linux (bash) and Windows (pwsh); one-shot tokens, credit-exhaustion degradation, shared audit log; bilingual (zh-CN / en) messages.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "guard",
    "safety",
    "destructive-command",
    "jev",
    "typesafe",
    "pre-execute",
    "audit-log"
  ],
  "type": "module",
  "main": "adapters/dsh/index.js",
  "exports": {
    ".": "./adapters/dsh/index.js",
    "./gate": "./lib/gate.js",
    "./rules": "./lib/rules.js",
    "./verdict": "./lib/verdict.js",
    "./audit": "./lib/audit.js",
    "./token": "./lib/token.js",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 adapters/dsh/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“人工选择改写、一次性授权或放弃｜令牌只消费一次，审计含原命令、判定和最终动作”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-jev-guard",
  "version": "0.5.7",
  "description": "Pre-execution safety valve for DeepSeek Harness: a TypeSafe Jev question decides whether a shell command/script would irreversibly delete or overwrite real data. Four states (allow/revise/block/escalate), mounted on tools/pre-execute. Zero dependencies; WSL/Linux (bash) and Windows (pwsh); one-shot tokens, credit-exhaustion degradation, shared audit log; bilingual (zh-CN / en) messages.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "dsh-plugin",
    "cordis",
    "guard",
    "safety",
    "destructive-command",
    "jev",
    "typesafe",
    "pre-execute",
    "audit-log"
  ],
  "type": "module",
  "main": "adapters/dsh/index.js",
  "exports": {
    ".": "./adapters/dsh/index.js",
    "./gate": "./lib/gate.js",
    "./rules": "./lib/rules.js",
    "./verdict": "./lib/verdict.js",
    "./audit": "./lib/audit.js",
    "./token": "./lib/token.js",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把语义风险判断置于 tools/pre-execute，并设计 allow/revise/block/escalate 四态与配额耗尽降级”和“外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据”推导的新方向是可将高风险命令拆成资源、动作与可逆性结构，再以本地确定性规则和模型复核双层输出减少单次模型误判。它不是当前能力。最小验证为构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。有高风险shell自动化的团队值得观察，试用前应以真实命令集测漏拦截、误拦截和Jev不可用时的策略。 试用成功标准是“危险命令在执行前有明确判定、人工接管路径和可追溯记录，普通命令不过度阻塞”，并且 真实危险命令漏拦截率、令牌并发/重放与跨会话隔离、服务故障时安全性和可用性的实际取舍 有可接受结果；停止标准包括发生外部 Jev 判断、提示设计与命令抽取共同决定结果；源码没有同条件误拦截、漏拦截与区域可用性数据所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“只依赖宿主审批策略、静态命令黑名单或人工逐条查看命令”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-jev-guard

[![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](./LICENSE)
[![node](https://img.shields.io/badge/node-%E2%89%A520-brightgreen.svg)](https://nodejs.org)
[![DSH plugin](https://img.shields.io/badge/DeepSeek%20Harness-plugin-4B6BFB.svg)](https://github.com/deepseek-ai/deepseek-harness)
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-4B6BFB.svg)](https://github.com/topics/dsh-plugin)
[![platform](https://img.shields.io/badge/platform-WSL%20%7C%20Windows-2f2f2f.svg)](#platform-support)
[![version](https://img.shields.io/github/v/tag/7starsseeker/dsh-jev-guard?label=version&style=flat)](https://github.com/7starsseeker/dsh-jev-guard/tags)
[![npm](https://img.shields.io/npm/v/dsh-jev-guard?label=npm&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![downloads](https://img.shields.io/npm/dm/dsh-jev-guard?label=downloads&style=flat)](https://www.npmjs.com/package/dsh-jev-guard)
[![selftest](https://img.shields.io/github/actions/workflow/status/7starsseeker/dsh-jev-guard/selftest.yml?label=selftest)](https://github.com/7starsseeker/dsh-jev-guard/actions/workflows/selftest.yml)
[![last commit](https://img.shields.io/github/last-commit/7starsseeker/dsh-jev-guard)](https://github.com/7starsseeker/dsh-jev-guard/commits/main)
[![stars](https://img.shields.io/github/stars/7starsseeker/dsh-jev-guard?style=flat)](https://github.com/7starsseeker/dsh-jev-guard/stargazers)
[![](https://img.shields.io/badge/powered_by-dsh-4D6BFE?style=flat-square&logo=deepseek&logoColor=white)](https://github.com/deepseek-ai/deepseek-harness)

> **English** | [简体中文](README.zh-CN.md) | [Changelog](CHANGELOG.md) | [Design decisions](docs/DECISIONS.md) | [Measurements](docs/MEASUREMENTS.md)

**A pre-execution safety valve for [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness): before a command actually runs, it asks one question — "will this irreversibly delete or overwrite your real data?"**
```

</details>

**依据 2 · 源码核查**：[adapters/dsh/index.js:4-21](https://github.com/7starsseeker/dsh-jev-guard/blob/a74afc36467a75edec1f5c1e2ed98cfdaa246073/adapters/dsh/index.js#L4-L21)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
 * A native hook in DSH is just an ordinary plugin subscribing to a canonical
 * lifecycle event, so this file is thin on purpose: 判定在 `lib/`(与调用方无关),
 * 这一半只做四件事:解析凭据、从工具调用里取出命令、应用重试预算、
 * 在 `tools/pre-execute` 上返回 typed PreToolDecision(allow / ask / deny 瀑布)。
 *
 * 它住在 `adapters/dsh/` 而不是 `lib/`,是**结构性声明**:判定不该知道谁在调用它 ——
 * 这样同一套判定才能被 CLI 与六份自检**离线复跑**(校准、回归、事故复盘全靠这一点)。
 * `lib/` 里没有任何 DSH 概念(没有 Cordis、没有 ctx、没有 PreToolDecision)。
 * 机制与映射见 docs/DSH-INTEGRATION.md。
 *
 * @module jev-guard/dsh
 */

import { randomUUID } from 'node:crypto'
import { readFileSync } from 'node:fs'
import { dirname, isAbsolute, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { flush, record } from '../../lib/audit.js'
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：构造100条经人工标注的删除、覆盖、只读与混淆命令，在相同审批政策下对照静态规则；测漏拦截、误拦截、P95延迟、每100条费用和令牌重放，任何不可逆命令静默放行即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
