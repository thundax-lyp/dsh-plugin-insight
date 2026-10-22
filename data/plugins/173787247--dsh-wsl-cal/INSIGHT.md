# dsh-wsl-cal

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[675bc5c](https://github.com/173787247/dsh-wsl-cal/tree/675bc5cc7efaf79a171e205e4f570ac2b945bb13)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-cal)
<!-- END META -->

> **实现功能**：把本机 khal 日历以只读状态、今日和未来日程工具暴露给 DSH。

> **核心亮点**：相对终端执行 khal，它把只读日历查询接入模型工具并限制日期范围，增量是低风险接线而非新的日历能力。 [Q03](#research-q03)

> **风险与缺陷**：输出依赖用户自行维护的 khal 配置、时区与同步状态，且插件不创建或修改事件；读取成功不能证明日历已同步或计划可执行。 [Q04](#research-q04)

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

> **用途**：面向已在 WSL 使用 khal 管理日历的用户，让代理在每日检查和计划任务时读取现有安排。 [Q01](#research-q01)

基线是用户运行 khal list 或查看日历应用；插件减少代理读取步骤，但不承担同步、写入和提醒。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 环境状态 | 检查 khal 版本与日历配置。 | 仅由固定版本源码确认；运行效果未验证 |
| 今日日程 | 读取当天事件。 | 仅由固定版本源码确认；运行效果未验证 |
| 范围查询 | 读取最多 31 天的未来日程。 | 仅由固定版本源码确认；运行效果未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| PATH 中可用 khal | 必需 | 实际查询日历 | status/查询返回错误 |
| 用户已配置并同步日历 | 必需 | 提供可信事件源 | 空结果或陈旧结果不代表无日程 |
| 正确时区/DST 配置 | 必需 | 解释 today 与未来范围 | 事件时间可能偏移 |
| DSH tools/systemPrompt | 必需 | 注册四个只读工具 | 无法由代理调用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|---|
| 状态检查 | Agent 先调用 cal_status/cal_calendars | khal 可用且日历数量符合预期 |
| 查询 | 调 cal_today 或限定 1–31 天的 cal_list | 返回事件和明确空结果 |
| 核对 | 用户确认同步时间与时区 | 关键安排与外部日历一致 |
| 降级 | 配置/同步异常时回到 khal 或日历应用 | 不根据陈旧/空结果自动安排任务 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | khal 与日历同步基础设施 | 配账号、日历与时区 | 插件不承担同步配置 |
| 持续使用 | 每次一个本地 khal 子进程 | 核对关键事件与同步状态 | 每次查询秒数未知 |
| 失败恢复 | 无写入回滚成本 | 修 PATH、配置、同步或时区 | 陈旧数据识别时间未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 只读边界 | 四工具均不创建/修改事件 | 宿主环境实际权限与输出兼容 |
| 范围限制 | list 天数有默认和上限 | DST/跨时区边界正确性 |
| 计划接线 | Agent 可直接取得 today/list | 陈旧同步是否被正确识别 |

> **思考**：输出依赖用户自行维护的 khal 配置、时区与同步状态，且插件不创建或修改事件；读取成功不能证明日历已同步或计划可执行。 [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对终端执行 khal，它把只读日历查询接入模型工具并限制日期范围，增量是低风险接线而非新的日历能力。 [Q03](#research-q03)

相对终端执行 khal，它把只读日历查询接入模型工具并限制日期范围，增量是低风险接线而非新的日历能力。 [Q03](#research-q03)

只读边界、天数上限、超时和错误返回降低副作用，适合作为轻量集成样本；仍需用真实时区、多日历和异常输出验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

输出依赖用户自行维护的 khal 配置、时区与同步状态，且插件不创建或修改事件；读取成功不能证明日历已同步或计划可执行。 [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。成功标准是 status 能暴露配置问题、today/list 与 khal 在事件数和时间上一致、陈旧同步被用户识别；出现时区偏移或遗漏时应停止将输出用于自动计划。 [Q09](#research-q09)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为固定版本源码支持的实现与集成增量；效果和真实宿主可用性未验证。未来设计假设保持未验证，不计入插件现有能力。

- 已检查：作者 README、包清单、源码路径 README.md、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定提交的作者材料、入口和关键实现；未运行插件、测试、外部服务或真实宿主，也未核验独立用户反馈。
- 下一步：在测试 khal 日历放入全天、跨午夜、DST 与多时区事件，逐项比较 cal_today/cal_list 与 khal 原输出，记录事件数、时间偏差和查询秒数；再制造同步陈旧与 PATH 缺失，确认工具明确失败。任何时间偏移或空结果被误当“无安排”即限制采用。

**分析版本**

- **仓库**：[173787247/dsh-wsl-cal](https://github.com/173787247/dsh-wsl-cal)
- **版本号**：0.1.1（[固定提交 675bc5c](https://github.com/173787247/dsh-wsl-cal/tree/675bc5cc7efaf79a171e205e4f570ac2b945bb13)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在保持只读的前提下增加“计划冲突解释”，明确引用事件来源和时区，并让任何写入建议仍由用户确认到外部日历工具。 [Q08](#research-q08)

在测试 khal 日历放入全天、跨午夜、DST 与多时区事件，逐项比较 cal_today/cal_list 与 khal 原输出，记录事件数、时间偏差和查询秒数；再制造同步陈旧与 PATH 缺失，确认工具明确失败。任何时间偏移或空结果被误当“无安排”即限制采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 116 | — | — | 450 |
| .js | source | 2 | 197 | 181 | 2 | — |
| .js | test | 1 | 6 | 6 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-cal/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：研究 dsh-wsl-cal 在固定版本中的实现贡献、成立条件、关键限制、采用价值与可证伪的新设计方向。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在何种任务中使用，原有办法和合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

面向已在 WSL 使用 khal 管理日历的用户，让代理在每日检查和计划任务时读取现有安排。 合格结果不是“工具被调用”，而是用户能在既定边界内得到可复核产物。基线是用户运行 khal list 或查看日历应用；插件减少代理读取步骤，但不承担同步、写入和提醒。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-20](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/README.md#L1-L20)

作者材料说明目标用户、安装方式、主要能力和已知边界。

<details>
<summary>查看原文（20行）</summary>

````text
# dsh-wsl-cal

> **语言：** **中文**（本页） · [English](./README.en.md)

日历只读：khal list / today。

| | |
|---|---|
| 版本 | **0.1.0** |
| 套件 | [dsh-wsl-kit](https://github.com/173787247/dsh-wsl-kit) **可选**，不在 `install.sh` |

## 安装

```sh
dsh plugin --profile web add github:173787247/dsh-wsl-cal
# 或本机 path：
# dsh plugin --profile web add /mnt/c/Users/YOU/Desktop/AIFullStackDevelopment/dsh-wsl-cal
```

kit 批量链接（可选）：`bash dsh-wsl-kit/scripts/link-linux-plugins.sh`
````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 能力如何从入口、注册、调用到状态变化实现？

**研究主题**：功能与机制

#### 完整回答

插件注册状态、日历列表、今日与未来 N 天四个只读工具，底层调用 khal 并统一超时与结构化错误。 源码可以确认注册和数据流存在，但不能据此推断宿主加载、外部服务或最终效果已经通过。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对原生能力或简单替代，固定版本增加了什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对终端执行 khal，它把只读日历查询接入模型工具并限制日期范围，增量是低风险接线而非新的日历能力。 参照是宿主原生工具、直接脚本或手工流程，现有证据支持实现增量，不支持全球首创或收益排名。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心价值不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强支持是固定版本实现确有完整入口和防御分支。最关键限制是：输出依赖用户自行维护的 khal 配置、时区与同步状态，且插件不创建或修改事件；读取成功不能证明日历已同步或计划可执行。 这会直接收窄采用范围，而不是否定所有能力。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复分别依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

需要 WSL/Node 环境、PATH 中可用的 khal 及已配置日历；超时和输出格式变化可能影响解析，没有写操作降级。 启动成功、持续有用和失败恢复是三类不同条件；缺少依赖时不能把“已注册”当作任务已办结。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续与失败恢复成本及效果证据如何？

**研究主题**：效果与总成本

#### 完整回答

首次成本是安装并配置 khal、日历源和时区，而插件本身只增加工具接线；持续成本是每次 khal 子进程、日历同步读取和用户核对时区；失败恢复包括 PATH/配置错误、超时和陈旧同步，插件不会写入或修复事件。合格单位是指定日期范围内事件名称、时间和来源日历与 khal 当前输出一致。当前缺多日历/时区样本的准确率、查询秒数和陈旧同步比例。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

#### 缺口

- 缺少真实 khal 配置下的多日历、全天事件、跨时区和未来 31 天查询准确率与延迟。
  **影响**：无法确认只读接线在每日计划中是否可靠，陈旧同步可能产生错误安排。
  **进一步探讨**：用已知事件金标准覆盖全天/跨时区/多日历，比较 cal_today/cal_list 与 khal 原输出，记录遗漏、时区偏移和查询秒数。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可靠性取舍和可复用设计？

**研究主题**：工程质量与复用

#### 完整回答

只读边界、天数上限、超时和错误返回降低副作用，适合作为轻量集成样本；仍需用真实时区、多日历和异常输出验证。 这些判断来自结构与错误路径抽读，不等于完整安全审计或生产可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献和限制能推导什么未验证方向？

**研究主题**：新假设与验证

#### 完整回答

从已确认机制与关键限制可推导：可在保持只读的前提下增加“计划冲突解释”，明确引用事件来源和时区，并让任何写入建议仍由用户确认到外部日历工具。 最小验证应与现有简单流程在相同任务、模型、预算和验收标准下比较，并在人工投入或失败率上升时否定该方向。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对什么人值得观察或试用，成功与停止条件是什么？

**研究主题**：采用判断

#### 完整回答

适合已经稳定使用 khal、只需代理读取日程的 WSL 用户试用；需要创建、修改、提醒或同步保证的人不适用。成功标准是 status 能暴露配置问题、today/list 与 khal 在事件数和时间上一致、陈旧同步被用户识别；出现时区偏移或遗漏时应停止将输出用于自动计划。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:1-40](https://github.com/173787247/dsh-wsl-cal/blob/675bc5cc7efaf79a171e205e4f570ac2b945bb13/index.js#L1-L40)

固定版本源码显示入口接线、关键数据流与失败处理；这不是运行结果。

<details>
<summary>查看原文（40行）</summary>

```text
import { calStatus, khalList, khalAgenda, khalCalendars } from "./lib/cal.js";

export const name = "dsh-wsl-cal";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  if (config.enabled === false) {
    console.log("[dsh-wsl-cal] disabled");
    return;
  }
  const timeoutMs = positive(config.timeoutMs, 15_000);

  ctx.systemPrompt.section({
    name: "tool:cal",
    order: 140,
    text: "dsh-wsl-cal lists events via khal (read-only). Prefer cal_today for daily check-ins. Configure khal calendars yourself. Does not create/modify events.",
  });

  ctx.tools.register({
    name: "cal_status",
    description: "Whether khal is on PATH; version + configured calendar count.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: { schema: { type: "object", additionalProperties: true }, render: (_a, v) => [{ type: "text", text: JSON.stringify(v, null, 2) }] },
    timeoutMs: 10_000,
    isConcurrencySafe: () => true,
    async execute() {
      return calStatus();
    },
    presentCall: () => ({ card: "generic", title: "cal status" }),
    presentResult: (_a, r) => ({ card: "generic", title: "cal status", content: r.content }),
  });

  ctx.tools.register({
    name: "cal_calendars",
    description: "List configured khal calendars (printcalendars). Read-only.",
    parameters: { type: "object", additionalProperties: false, properties: {} },
    output: {
      schema: { type: "object", additionalProperties: true },
      render: (_a, v) => [
        { type: "text", text: v.ok === false ? v.error : (v.calendars || []).join("\n") || "(none)" },
```

</details>

#### 缺口

- 未核实多时区、全天事件与同步陈旧时的输出。
  **影响**：错误日程可能影响后续计划，即使插件保持只读。
  **进一步探讨**：构造带已知事件的测试 calendar，覆盖 DST/全天/跨区间并逐项比对 khal 与工具输出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
