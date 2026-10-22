# dsh-subagent

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[e30f1ce](https://github.com/1373700184/dsh-subagent/tree/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7)

<!-- BEGIN META -->
[![npm 30d 22](https://img.shields.io/static/v1?label=npm+30d&message=22&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-subagent) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-subagent)
<!-- END META -->

> **实现功能**：把多个已登录的外部编码 CLI 注册为 DSH 子代理并提供进度与恢复。

> **核心亮点**：相对手工开多个终端，它统一多种事件协议、模型回退、进度展示和崩溃接管，使外部额度成为 DSH 可调度的子代理资源。 [Q03](#research-q03)

> **风险与缺陷**：子代理不继承父上下文且默认无头权限较宽，任务说明、工作目录和验证责任全部回到父代理；多后端并不自动带来更好结果。 [Q04](#research-q04)

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

> **用途**：面向同时拥有多个编码代理订阅或 CLI 的开发者，把独立子任务分派到不同后端并从 DSH 汇总结果。 [Q01](#research-q01)

基线是用户手工调用各 CLI 并复制结果；插件减少进程、事件和恢复接线，但新增权限、费用、上下文打包与独立核验负担。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多 CLI 提供方 | 把 Qoder、Codex、Claude 等注册为子代理。 | 仅由固定版本源码确认；运行效果未验证 |
| 模型回退 | 按有序模型链处理无输出或失败。 | 仅由固定版本源码确认；运行效果未验证 |
| 进度与恢复 | 落盘事件并在重启后继续跟踪。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 至少一个外部 CLI 已安装登录 | 必需 | 真正执行子任务 | provider 启动前报 binary/account 错误 |
| DSH subagents/tools/commands | 必需 | 注册 provider、委派工具和状态命令 | 无法从父会话调度 |
| 可写 runs 目录 | 恢复必需 | 保存 detached stdout 与活动台账 | 宿主重启后无法接管或回放 |
| 自足提示与受控权限模式 | 安全采用必需 | 子代理不继承父上下文且 headless 执行 | 上下文遗漏或未授权文件/命令副作用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 探测 | 用户在设置页确认 CLI、版本、登录与模型 | 只启用可用且受信后端 |
| 打包任务 | 父代理提交含 cwd、输入、约束和验收的自足提示 | 子代理无需父上下文也能执行 |
| 运行与回退 | provider detached 启动并解析事件流 | 静默超时切模型，总预算耗尽后明确失败 |
| 接管与验收 | 重启后恢复 run，父代理核对产物 | 完成通知只发一次，关键结论独立验证 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 多个 CLI 订阅/API 与本地安装 | 登录、路径、权限、模型链配置 | 每后端准备分钟未知 |
| 持续使用 | 子进程、事件日志、各模型额度 | 编写自足任务和复核结果 | 每个合格子任务费用/分钟未知 |
| 失败恢复 | 回退模型可能重复消耗额度 | 查状态、重启接管、处理迟到结果 | 去重与重复副作用未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 后端统一 | 多驱动和动态 provider 注册存在 | 各 CLI 当前协议兼容率 |
| 故障转移 | 静默阈值、模型链和总等待预算存在 | 是否提高合格率而不显著增费 |
| 崩溃接管 | detached 输出和活动台账设计存在 | 重启时是否无重复通知/执行 |

> **思考**：子代理不继承父上下文且默认无头权限较宽，任务说明、工作目录和验证责任全部回到父代理；多后端并不自动带来更好结果。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手工开多个终端，它统一多种事件协议、模型回退、进度展示和崩溃接管，使外部额度成为 DSH 可调度的子代理资源。 [Q03](#research-q03)

相对手工开多个终端，它统一多种事件协议、模型回退、进度展示和崩溃接管，使外部额度成为 DSH 可调度的子代理资源。 [Q03](#research-q03)

驱动层、活动台账、detached 输出与客户端展示形成完整链路，恢复设计可借鉴；高权限无头执行和协议适配面要求逐后端验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

子代理不继承父上下文且默认无头权限较宽，任务说明、工作目录和验证责任全部回到父代理；多后端并不自动带来更好结果。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已安装并信任多个 CLI、能写出自足任务并独立验收结果的开发者做受限试用；敏感仓库或无法授予 headless 权限的环境不应启用。成功标准是回退链在总预算内提高合格子任务数、重启接管不重复执行且父代理复核时间低于手工多终端；若上下文遗漏、权限暴露或迟到结果重复产生，应停止。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在隔离仓库给每个后端同一组自足任务，记录首输出、完成、验收、额度和父代理复核；故意让首模型静默并在运行中重启 DSH，核对模型切换、run 接管、通知恰一次和产物无重复修改。回退未提高合格数或重启产生重复副作用即否定采用。

**分析版本**

- **仓库**：[1373700184/dsh-subagent](https://github.com/1373700184/dsh-subagent)
- **版本号**：1.0.1（[固定提交 e30f1ce](https://github.com/1373700184/dsh-subagent/tree/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在派发前生成最小上下文包并在返回后执行统一验收契约，只把失败证据和产物摘要回流，从而降低上下文遗漏与汇总偏差。 [Q08](#research-q08)

在隔离仓库给每个后端同一组自足任务，记录首输出、完成、验收、额度和父代理复核；故意让首模型静默并在运行中重启 DSH，核对模型切换、run 接管、通知恰一次和产物无重复修改。回退未提高合格数或重启产生重复副作用即否定采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 177 | — | — | 2489 |
| .js | source | 3 | 2731 | 2518 | 149 | — |
| .mjs | source | 1 | 40 | 35 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/1373700184/dsh-subagent/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-subagent 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向同时拥有多个编码代理订阅或 CLI 的开发者，把独立子任务分派到不同后端并从 DSH 汇总结果。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是用户手工调用各 CLI 并复制结果；插件减少进程、事件和恢复接线，但新增权限、费用、上下文打包与独立核验负担。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

````text
# dsh-subagent

把外部 CLI 子代理(Qoder、QoderCN、Codex、Claude、OpenCode、Pi、CodeBuddy,可继续扩展)注册成 dsh(DeepSeek Harness)的**子代理提供方**,让父 agent 通过委派工具把任务交给这些 CLI 跑,消耗各自的订阅/API 额度。

每个后端都是**一次性执行**:插件 spawn CLI 子进程,提示词经 stdin 送入,读取各自的 JSON 事件流(`qoder-json` / `claude-json` / `codex-json` / `codebuddy-json` / `opencode-json` / `pi-json` 驱动),收敛到最终结果。子代理**看不到父会话上下文**,所以委派任务里要自带完整上下文。

## 安装

```sh
dsh plugin --profile web add github:1373700184/dsh-subagent
```

装好后插件的 `cordis.patch.yml` 会向 profile 树插入提供方 `dsh-subagent` 和 Agent 预设;委派工具、斜杠指令随**已启用的后端**动态挂载(启用几个后端就有几个工具/指令)。重启 dsh 生效。

前置条件:对应 CLI 已安装且已登录——`qodercli`(`~/.qoder/bin/qodercli/`)、`qoderclicn`(`~/.qoder-cn/bin/qoderclicn/`)、`codex`(npm 全局)、`claude`(npm 全局,沿用 `~/.claude/settings.json` 的模型/网关配置)、`opencode`(`~/.opencode/bin/`)、`pi`(`~/.pi/agent/bin/`,通过 node + `pi-launcher.js` 启动)、`codebuddy`(npm 全局 `@tencent-ai/codebuddy-code`,通过 node 启动)。

## 使用

在 dsh 会话里让父 agent 调用工具即可,例如:

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

每个 provider 把提示经 stdin 交给一次性 CLI，解析其事件流并落盘；detached 运行记录允许宿主重启后接管，工具行、状态工具和命令展示进度。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工开多个终端，它统一多种事件协议、模型回退、进度展示和崩溃接管，使外部额度成为 DSH 可调度的子代理资源。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：子代理不继承父上下文且默认无头权限较宽，任务说明、工作目录和验证责任全部回到父代理；多后端并不自动带来更好结果。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要相应 CLI 已安装、登录且协议版本兼容；依赖 DSH subagents、tools、commands 与持久目录写权限，不同后端还受账号额度和网络影响。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是逐个安装和登录外部 CLI、选择权限模式、模型链与可执行路径；持续成本由各 CLI 订阅/API、并行进程、事件日志磁盘和父代理汇总验证构成；失败恢复包括无输出 90 秒后的模型切换、总等待预算耗尽、宿主重启后接管 detached run，以及对迟到结果去重。合格单位是一个上下文自足的子任务在预算内产出可独立验收结果。当前缺各后端成功率、排队时间、每个合格子任务费用与父代理复核分钟。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

#### 缺口

- 缺少各 CLI 在相同子任务上的成功率、首输出时间、总费用/额度、事件日志字节和父代理复核时间。
  **影响**：无法判断多后端编排是否降低总成本，或只是消耗更多订阅并增加汇总工作。
  **进一步探讨**：固定一组上下文自足的编码子任务，逐后端与回退链执行，记录首输出/完成秒数、失败切换、费用或额度、日志大小、验收通过和父代理复核分钟。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

驱动层、活动台账、detached 输出与客户端展示形成完整链路，恢复设计可借鉴；高权限无头执行和协议适配面要求逐后端验证。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可在派发前生成最小上下文包并在返回后执行统一验收契约，只把失败证据和产物摘要回流，从而降低上下文遗漏与汇总偏差。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合已安装并信任多个 CLI、能写出自足任务并独立验收结果的开发者做受限试用；敏感仓库或无法授予 headless 权限的环境不应启用。成功标准是回退链在总预算内提高合格子任务数、重启接管不重复执行且父代理复核时间低于手工多终端；若上下文遗漏、权限暴露或迟到结果重复产生，应停止。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-40](https://github.com/1373700184/dsh-subagent/blob/e30f1cef1988f040ea0a7a5f6b8a15b70f0e23a7/lib/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { closeSync, existsSync, fstatSync, mkdirSync, openSync, readSync, readFileSync, renameSync, writeFileSync } from "node:fs";
import { homedir } from "node:os";
import { join } from "node:path";
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import { createUserMessage, boundContextSummary } from "@deepseek-ai/dsh-llm";
import * as ToolSubagentPlugin from "@deepseek-ai/dsh-tool-subagent";
import { SessionId } from "@deepseek-ai/dsh-session";
import {
	NO_START_CAPABILITIES,
	assertUsableCwd,
	settleRunResult,
	subprocessRunHandle,
} from "@deepseek-ai/dsh-subagent";

//#region 元数据
/**
* 把外部订阅制 CLI 聚合为 dsh 子代理提供方。
* 每个已配置后端都会在 `ctx.subagents` 上注册为具名 `SubagentProvider`;
* 配套的 `@deepseek-ai/dsh-tool-subagent` 实例(见 cordis.patch.yml)
* 把它暴露给模型。后端均一次性执行:启动 CLI 子进程,
* 通过 stdin 送入提示词,再把 Claude 风格的 `stream-json` 事件流
* 收敛为 `SubagentResult`。
*/
const name = "dsh-subagent";
const inject = ["subagents", "tools", "commands"];
//#endregion

//#region CLI 路径探测
const platform = process.platform;
/** 每个内置后端的候选可执行文件路径,越具体的越靠前。 */
const KNOWN_BINARIES = {
	qoder: [
		join(homedir(), ".qoder", "bin", "qodercli", platform === "win32" ? "qodercli.exe" : "qodercli"),
	],
	qodercn: [
		join(homedir(), ".qoder-cn", "bin", "qoderclicn", platform === "win32" ? "qoderclicn.exe" : "qoderclicn"),
	],
```

</details>

#### 缺口

- 未在同一任务集比较七类 CLI 驱动、模型回退和重启接管。
  **影响**：推荐无法判断哪种后端组合真正提高交付，且默认无头权限扩大副作用风险。
  **进一步探讨**：在隔离仓库用固定任务包执行各驱动，故意制造静默与宿主重启，核对一次性通知、进程终止、产物哈希和总预算。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
