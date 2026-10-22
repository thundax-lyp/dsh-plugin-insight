# AI Look-Up

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[840ff04](https://github.com/1344738825/ai-look-up/tree/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up)
<!-- END META -->

> **实现功能**：监测代理重复调用、失败循环和目标漂移，并在触发时注入自检提示。

> **核心亮点**：相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 [Q03](#research-q03)

> **风险与缺陷**：触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 [Q04](#research-q04)

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

> **用途**：面向长时间运行编码代理的用户，在重复命令、无产出密集调用或目标漂移时获得可见的收束提醒。 [Q01](#research-q01)

基线是用户手工观察日志或仅设超时；插件能更早提示重复与漂移，但阈值误报和额外评审调用必须计入。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 行为节奏监测 | 识别重复、失败循环、无编辑长跑和目标漂移候选。 | 仅由固定版本源码确认；运行效果未验证 |
| 自检注入 | 把静态或模型审查建议送回代理上下文。 | 仅由固定版本源码确认；运行效果未验证 |
| 自适应记录 | 保存提醒效果与经验线索供后续会话使用。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| tools/result、session/event、agent.inject | 必需 | 采集节奏并注入提醒 | 核心监督链路失效 |
| 可选 llm 服务 | 可选 | 独立 JSON 审查 | 超时或失败退回静态清单 |
| watcher API Key 与额度 | deliverReview 时必需 | 外部独立复核 | 默认关闭，不能静默耗费额度 |
| 阈值与冷却配置 | 必需 | 控制误报和提醒风暴 | 配置不当会打断正常探索 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 定标 | 用户按任务长度设置阈值、冷却和 reviewer 开关 | 预算和最大提醒数明确 |
| 观察 | 插件统计重复、失败、无编辑和漂移信号 | 不阻断正常工具执行 |
| 审查与注入 | 可选 reviewer 判定，失败退静态提示 | 单次触发只形成一次可解释提醒 |
| 复盘 | 用户核对提醒后是否产生有效进展 | 误报持续则增大冷却或停用通道 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地日志；可选 reviewer API | 调阈值与选择通道 | 不同任务的合理阈值未知 |
| 持续使用 | 每触发一次可追加一次 LLM 调用 | 阅读/忽略提醒并复核台账 | 每有效提醒 token 与分钟未知 |
| 失败恢复 | reviewer 超时消耗延迟后退静态清单 | 排查误报、重置状态或关闭 watcher | 提醒风暴概率未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 停滞检测 | 重复、失败、无编辑和漂移信号存在 | 真阳性与误报率 |
| 审查降级 | 模型失败可退静态提示 | 降级提示是否仍有用 |
| 行为改善 | 能把提醒送入下一步上下文 | 是否减少返工并提高合格率 |

> **思考**：触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 [Q03](#research-q03)

相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 [Q03](#research-q03)

共享 spec 和静态降级降低双端漂移，事件入口和配置面明确；但启发式、持久日志与可选外部 watcher 形成较多状态，需以误报率和完成率共同验收。

<a id="detail-section-5"></a>

### 1.4 主要限制

触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合经常运行长时编码代理、能审阅提醒台账的团队先观察，不适合短任务或对中断敏感的会话。只有当提醒后的有效编辑率显著高于未提醒窗口、误报和 reviewer 预算低于预设上限时才试用；若静态提醒反复打断正常探索或独立 reviewer 成为主要成本，应关闭对应通道。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在关闭/开启插件的配对长任务中记录触发标签、reviewer token、注入延迟、后续十次调用的有效编辑和最终验收；以每个有效提醒的额外 token 与节省返工分钟为单位。精确率低或开启后合格率不升且中断增加，就推翻常驻监督价值。

**分析版本**

- **仓库**：[1344738825/ai-look-up](https://github.com/1344738825/ai-look-up)
- **版本号**：0.8.3（[固定提交 840ff04](https://github.com/1344738825/ai-look-up/tree/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可把提醒升级为可归因实验，每次随机延迟一小部分提醒并比较后续有效编辑、任务完成与人工接管，从而学习不同任务的阈值。 [Q08](#research-q08)

在关闭/开启插件的配对长任务中记录触发标签、reviewer token、注入延迟、后续十次调用的有效编辑和最终验收；以每个有效提醒的额外 token 与节省返工分钟为单位。精确率低或开启后合格率不升且中断增加，就推翻常驻监督价值。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 512 | — | — | 7299 |
| .js | source | 2 | 1122 | 886 | 181 | — |
| .mjs | test | 2 | 1072 | 900 | 111 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1344738825/ai-look-up/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 AI Look-Up 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向长时间运行编码代理的用户，在重复命令、无产出密集调用或目标漂移时获得可见的收束提醒。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是用户手工观察日志或仅设超时；插件能更早提示重复与漂移，但阈值误报和额外评审调用必须计入。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

```text
# AI 抬头 (ai-look-up)

[![ci](https://github.com/1344738825/ai-look-up/actions/workflows/ci.yml/badge.svg)](https://github.com/1344738825/ai-look-up/actions/workflows/ci.yml)

让 AI 在长时间空跑时**中途自我审查**的 ZCode 插件。

AI 在长任务里最常见的浪费是**空跑**。表现是:同一个探针脚本换个名字反复跑(`_peek2.py`、`_peek3.py`、`_peek4.py`…),失败的命令原样重试,一两个小时里一次文件都没改。本插件用会话钩子盯着这些行为,命中就让 AI 停一下:对照最初目标,看最近几步有没有带来新东西,然后决定继续、换方法还是汇报。

## 安装

**方式一:插件市场(ZCode / DeepSeek Harness 等)**

把本仓库克隆或下载解压,在客户端中打开 **插件市场 → 添加 → 添加插件市场**,选择仓库目录(根目录即市场清单 `marketplace.json` 所在),然后在 **个人 → ai-look-up-market** 中安装「AI 抬头」。

**方式二:Git 仓库直装(DeepSeek Harness)**

DeepSeek Harness 的插件页支持直接粘贴 Git 仓库地址安装——本仓库同时是一个 **cordis bundle**(`package.json` 声明 `dsh.bundle.patch`),会以 Host 插件形式安装,通过 `tools/result` / `session/event` 事件观察行为节奏,经 `agent.inject()` 注入提醒,无需 Python。

**要求:** ZCode 安装方式需要系统可用 `python` 命令(3.8+),若可执行名不同,修改 `hooks/hooks.json` 中的 4 处 `python` 即可;dsh 安装方式无此要求(纯 JS)。

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

插件监听 tools/result 与 session/event，维护回合统计和冷却状态；触发后可调用独立审查模型生成 JSON 判断，失败则退回静态检查表。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对人工盯守日志，它把行为节奏检测、独立审查和提示注入放进宿主事件链，并保留静态降级；增量在持续监督接线和多种漂移信号组合。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：触发阈值与“生产性工具”名单会把探索性工作误判为漂移，独立审查还增加调用成本；尚无对照数据证明提醒减少返工而不增加打断。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

依赖 DSH 会话与工具事件、agent.inject；独立评审依赖可用 llm 服务，外部 watcher 还需显式密钥和额度；失败可退回静态检查。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次使用要选择重复窗口、失败阈值、冷却和是否启用 LLM reviewer/watcher；持续成本包括监听每次工具结果、保存行为台账，以及每次触发时最多一次额外模型审查；失败恢复是 reviewer 超时后退回静态清单并避免提醒风暴。合格单位应是一次“提醒后任务重新产生有效进展且未造成无谓打断”的触发。当前没有触发总数、真阳性、触发后有效编辑率、额外模型 token 和人工忽略时间。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

#### 缺口

- 缺少提醒真阳性率、触发后有效编辑率、额外 reviewer token/延迟及用户忽略时间。
  **影响**：无法判断监督减少的返工是否超过误报与额外模型调用。
  **进一步探讨**：对真实长任务记录每次触发、审查结论、后续十次调用是否产生有效编辑、人工接受/忽略及额外 token，并与关闭插件的任务比较。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

共享 spec 和静态降级降低双端漂移，事件入口和配置面明确；但启发式、持久日志与可选外部 watcher 形成较多状态，需以误报率和完成率共同验收。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可把提醒升级为可归因实验，每次随机延迟一小部分提醒并比较后续有效编辑、任务完成与人工接管，从而学习不同任务的阈值。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合经常运行长时编码代理、能审阅提醒台账的团队先观察，不适合短任务或对中断敏感的会话。只有当提醒后的有效编辑率显著高于未提醒窗口、误报和 reviewer 预算低于预设上限时才试用；若静态提醒反复打断正常探索或独立 reviewer 成为主要成本，应关闭对应通道。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/1344738825/ai-look-up/blob/840ff04c25bf3e6d6b5cacfd94b4c28444d0419b/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * AI Look-Up — Host plugin for the DeepSeek Harness (cordis bundle).
 *
 * Watches the agent's behavioral rhythm and injects a self-review nudge when
 * aimless grinding is detected: the exact same command repeated, variant
 * commands that normalize to the same shape, long runs with zero file edits,
 * dense calls with zero output, and failure loops. Also anchors the agent's
 * unreliable sense of time by injecting the real local clock periodically.
 *
 * v0.4: when a trigger fires and the `llm` service is present, an independent
 * reviewer LLM call (same provider/model route as the main agent, temperature
 * 0, strict JSON verdict) judges the recent behavior; its verdict is injected
 * instead of the static checklist. Any reviewer failure falls back to the
 * static checklist, so the plugin degrades gracefully.
 *
 * Extension points (see the cordis-plugin-development skill):
 * - `tools/result`      observe final tool outcomes
 * - `session/event`     reset per-turn state on `user/message`, wrap-up check on `turn/end`
 * - `agent.inject()`    mid-run context, enters the next admitted step
 * - `llm` (optional)    independent reviewer calls
 */

import { randomUUID, createHash } from 'node:crypto';
import { readFileSync, writeFileSync, mkdirSync, readdirSync, rmSync, renameSync } from 'node:fs';
import { tmpdir } from 'node:os';

const PRODUCTIVE_TOOLS = new Set(['Edit', 'Write', 'MultiEdit', 'NotebookEdit', 'ApplyPatch']);

import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

// ---- spec.json: single source of truth shared with the Python hook ----
const KEY_MAP = {
  call_nudge_interval: 'callNudgeInterval',
  repeat_window: 'repeatWindow',
  repeat_cmd_count: 'repeatCmdCount',
  repeat_min_calls: 'repeatMinCalls',
  max_recent_cmds: 'maxRecentCmds',
  fail_streak_threshold: 'failStreakThreshold',
  long_run_minutes: 'longRunMinutes',
```

</details>

#### 缺口

- 触发阈值尚未用真实长任务标注真阳性和误报。
  **影响**：采用可能把监督负担从人工盯守转为频繁提醒与额外 LLM 调用。
  **进一步探讨**：在多类长任务中盲标“确实停滞/正常探索”，计算触发精确率、提醒后进展率和每个有效提醒的 token 成本。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
