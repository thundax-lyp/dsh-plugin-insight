# dsh-tool-budget

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8cc503d](https://github.com/173787247/dsh-tool-budget/tree/8cc503d3e574a676020ae605591217c35128b8ec)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-tool-budget)
<!-- END META -->

> **功能**：为 DSH Agent 的工具调用设置按对象计数的上限。

> **亮点**：[Q02](#research-q02) 对被跟踪工具累计对象级调用，在 guard 越限时拒绝；不等于共享费用预算。

> **主要限制**：[Q03](#research-q03) 无持久或跨 Agent 共享计数，且未验证前后执行对象同一性。

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
  - [Q01 · 长任务中调用上限相比手动取消或宿主限制增加什么？](#detail-section-11)
  - [Q02 · 实际 guard、post 和过滤如何计数并拒绝？](#detail-section-12)
  - [Q03 · 此上限是否为持久会话、团队或费用的严格上限？](#detail-section-13)
  - [Q04 · 怎样配置和恢复，成本和退出条件是什么？](#detail-section-14)
  - [Q05 · 是否可让用户在接近限额时更好决定继续、总结或调整？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望控制长任务中工具调用次数的 DSH 用户；真实频率和节省未知。

手动取消、宿主迭代限制或其他调用检测可约束部分活动。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| guard 计数 | 限制被跟踪调用 | 以 Agent 对象为主体 |
| 名称过滤 | 排除或限定工具 | 排除项不计数 |
| 阻断提示 | 告知超额和退路 | 不撤销已发生动作 |
| 系统提示 | 提醒模型上限 | 不等于独立资金账本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH tools guard 和 post 事件 | 阻断必需 | 安装监听并计数 | 接线或身份不匹配时范围未知 |
| Node >=18 | 包声明必需 | 执行 ESM | 未满足声明条件时不保证加载 |
| systemPrompt 服务 | 提示必需 | 提前告知上限 | 不证明阻断一定失效 |
| 用户配置和核对 | 使用必需 | 限额及工具范围 | 错误范围可能漏计或误拦 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户检查宿主、阈值及过滤 | 使用隔离任务核对计数 |
| 加载 | 宿主注册 guard 与监听 | 禁用时不注册；失败回宿主排查 |
| 运行 | Agent 调用纳入范围的工具 | 超限返回拒绝，不撤销先前动作 |
| 验收与恢复 | 用户核对调用、总结或停止插件 | 若需要共享费用上限改用宿主控制 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 软件与计算费用未知 | 配置和验证时间未知 | 需兼容宿主 |
| 持续使用 | 被跟踪工具及模型费用未知 | 监控误拦和范围时间未知 | 不统计金额 |
| 失败恢复 | 重试资源费用未知 | 复核及更改配置时间未知 | 前后对象及重建行为未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 调用阻断 | 固定源码累计后超过上限返回文本 | 固定宿主最终执行覆盖 |
| 名称过滤 | 源码 include 后排除 | 过滤是否符合具体任务 |
| 成本控制 | 作者描述避免无休止调用 | 金额、跨 Agent 总额及节省 |

> **思考**：[Q03](#research-q03) 无持久或跨 Agent 共享计数，且未验证前后执行对象同一性。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 对被跟踪工具累计对象级调用，在 guard 越限时拒绝；不等于共享费用预算。

[Q02](#research-q02) 前后去重取决于相同 exec 对象，[Q03](#research-q03) 对象级弱引用不提供持久账本。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 无持久或跨 Agent 共享计数，且未验证前后执行对象同一性。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先在隔离会话校验计数与过滤，把它作为附加提示而非资金预算。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码静态核查入口、计数和过滤；未运行目标、宿主或真实任务，假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/budget.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交的入口、辅助函数、包声明和作者文档；未运行目标或宿主。
- 下一步：隔离宿主追踪相同调用前后对象、会话重建、多 Agent、排除项及阻断后工具行为。

**分析版本**

- **仓库**：[173787247/dsh-tool-budget](https://github.com/173787247/dsh-tool-budget)
- **版本号**：0.1.2（[固定提交 8cc503d](https://github.com/173787247/dsh-tool-budget/tree/8cc503d3e574a676020ae605591217c35128b8ec)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 在现有提示外验证计数与范围展示对用户决策的影响；这是未实现假设。

隔离宿主追踪相同调用前后对象、会话重建、多 Agent、排除项及阻断后工具行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 216 | — | — | 1137 |
| .js | source | 2 | 100 | 81 | 5 | — |
| .js | test | 2 | 107 | 95 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查工具调用上限的计数、范围与恢复条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长任务中调用上限相比手动取消或宿主限制增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

操作者担心 Agent 不断调用不同工具，要求达到设定次数后停止纳入范围的后续调用。手动取消需要持续观察，宿主已有迭代或权限限制也可限制部分活动；本插件具体增加的是每个 Agent 对象上的工具调用计数，而不是按金额预算或跨团队共享限额。README 将默认 80 次、第 81 次拒绝作为作者主张；真实反复发生频率和减少损失尚无独立材料。合格结果应核对指定工具是否按预期计数、越限是否阻断以及用户能否恢复。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:39-48](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/README.md#L39-L48)

作者将不同工具的连续调用与默认阈值作为目标。

<details>
<summary>查看原文（10行）</summary>

````text
Default: **80** tracked calls allowed; the **81st** is denied. Job status tools are excluded by default.

This is a **safety rail**, not a product license limit. Raise `maxCalls` or disable if it feels tight.

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

````

</details>

**依据 2 · 源码核查**：[index.js:17-23](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L17-L23)

每次 apply 创建 Agent 对象计数和执行对象去重集合。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();
```

#### 缺口

- 未有代表性任务频率与成本对照
  **影响**：不能断言实际节省或必要性
  **进一步探讨**：同任务比较手动停止、宿主限额与本插件，记录合格结果、工具调用及人工干预。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 实际 guard、post 和过滤如何计数并拒绝？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 启用后注册 tools.guard 和 tools/post-execute，二者调用同一 observe：无 exec.agent 或名称不在跟踪范围直接跳过；WeakSet 按 exec 对象去重，WeakMap 按 agent 对象累计；guard 在 count 大于 maxCalls 时返回阻断文本，达到上限本次仍放行。include 非空先要求匹配，exclude 再排除，默认排除三个 job 工具；非法或小于 1 的上限回退 80。计数在 guard 时已递增，所以这不是只统计成功完成的工具；同一调用的两个阶段若宿主传不同对象则去重不成立，当前仓源码无法证明宿主对象同一性。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-23](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L17-L23)

状态位于 apply 闭包，并按对象身份维护。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();
```

**依据 2 · 源码核查**：[index.js:38-55](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L38-L55)

guard 与 post 调用 observe，越限返回阻断文本。

<details>
<summary>查看原文（18行）</summary>

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return counts.get(exec.agent);
    counted.add(exec);
    const next = nextCount(counts.get(exec.agent));
    counts.set(exec.agent, next);
    return next;
  }

  ctx.tools.guard((exec) => {
    const count = observe(exec);
    if (count === undefined || count <= maxCalls) return undefined;
    return formatBlockMessage(exec.name, maxCalls, count);
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
```

</details>

**依据 3 · 源码核查**：[lib/budget.js:1-12](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/lib/budget.js#L1-L12)

无效上限回退默认。

<details>
<summary>查看原文（12行）</summary>

```text
export const DEFAULT_MAX_CALLS = 80;

export function readMaxCalls(value, fallback = DEFAULT_MAX_CALLS) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    console.warn(`[dsh-tool-budget] invalid maxCalls ${JSON.stringify(value)}; using ${fallback}`);
    return fallback;
  }
  return n;
```

</details>

**依据 4 · 源码核查**：[lib/budget.js:15-29](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/lib/budget.js#L15-L29)

include 和 exclude 的顺序。

<details>
<summary>查看原文（15行）</summary>

```text
export function toPatterns(list) {
  if (!Array.isArray(list)) return [];
  return list.map((pattern) => wildcardToRegExp(String(pattern)));
}

export function wildcardToRegExp(pattern) {
  const escaped = pattern.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
  return new RegExp(`^${escaped.replaceAll("*", ".*")}$`);
}

export function tracked(toolName, includePatterns, excludePatterns) {
  if (includePatterns.length > 0 && !includePatterns.some((re) => re.test(toolName))) {
    return false;
  }
  return !excludePatterns.some((re) => re.test(toolName));
```

</details>

#### 缺口

- 未在固定宿主追踪前后阶段是否共享 exec 对象
  **影响**：两次观察可能重复计数，影响阈值语义
  **进一步探讨**：在隔离宿主记录同调用前后对象身份与实际阻断次数。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 此上限是否为持久会话、团队或费用的严格上限？

**研究主题**：缺陷与关键质疑

#### 完整回答

源码 WeakMap 以运行中的 agent 对象为键，apply 重建时计数状态亦重新建立；它没有持久会话账本，也没有跨 agent 共享配额或价格计算。不同 agent 分别累计，缺 agent 的执行会跳过，默认 job_output、job_list、job_kill 不计数；因此不能保证会话重建、团队总调用、金钱或所有工具执行受统一限制。达到上限后的新被跟踪请求仍先增加计数再拒绝；阻断不撤销先前已发生的工具副作用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-23](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L17-L23)

每个插件实例中新建 WeakMap 与 WeakSet。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();
```

**依据 2 · 源码核查**：[index.js:38-50](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L38-L50)

缺 agent 跳过，累计后判断。

<details>
<summary>查看原文（13行）</summary>

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return counts.get(exec.agent);
    counted.add(exec);
    const next = nextCount(counts.get(exec.agent));
    counts.set(exec.agent, next);
    return next;
  }

  ctx.tools.guard((exec) => {
    const count = observe(exec);
    if (count === undefined || count <= maxCalls) return undefined;
    return formatBlockMessage(exec.name, maxCalls, count);
```

</details>

**依据 3 · 源码核查**：[lib/budget.js:25-29](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/lib/budget.js#L25-L29)

名称过滤可排除调用。

```text
export function tracked(toolName, includePatterns, excludePatterns) {
  if (includePatterns.length > 0 && !includePatterns.some((re) => re.test(toolName))) {
    return false;
  }
  return !excludePatterns.some((re) => re.test(toolName));
```

#### 缺口

- 未验证不同版本宿主的 Agent 对象生命周期与工具链
  **影响**：不能把对象生命周期等同持久 session 或全链覆盖
  **进一步探讨**：隔离宿主覆盖重载、恢复、多个 agent、不同阶段对象与缺 agent。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样配置和恢复，成本和退出条件是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

运行需兼容 DSH tools guard、post 事件及可选 systemPrompt；Node 版本下限来自包声明，声明不证明宿主兼容。用户配置上限及 include/exclude，并先用受控任务验证计数主体；超过上限时已有提示建议总结、询问或开新会话，禁用插件可停止此限制。调整配置、人工复核及误拦恢复需要时间，现金费用和真实误拦率未知；启用或重载是否重置正在运行的宿主状态需按宿主实测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-19](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/package.json#L14-L19)

Node 引擎和测试声明。

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
```

**依据 2 · 源码核查**：[index.js:9-26](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L9-L26)

依赖声明、配置及禁用早退。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = "dsh-tool-budget";
export const inject = ["tools", "systemPrompt"];

/**
 * Cap total tool calls per agent session. Complements dsh-repeat-stop
 * (identical-call streak) with a session-wide ceiling.
 * Agent Teams: each teammate agent has its own budget (WeakMap per agent).
 */
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();

  if (!enabled) {
    console.log("[dsh-tool-budget] disabled");
```

</details>

**依据 3 · 源码核查**：[lib/budget.js:36-42](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/lib/budget.js#L36-L42)

阻断时面向用户的恢复提示。

```text
export function formatBlockMessage(toolName, maxCalls, count) {
  return [
    `dsh-tool-budget: blocked ${toolName} after ${maxCalls} tool calls this session.`,
    "Finish with what you have, ask the user, or start a new session.",
    "Agent Teams: this cap is per teammate agent — stop spawning more tools and summarize.",
    `count=${count} maxCalls=${maxCalls}`,
  ].join(" ");
```

#### 缺口

- 未安装宿主或测成本、误拦与热重载
  **影响**：不能估算维护负担或保证退出效果
  **进一步探讨**：用无副作用工具测试上限、禁用和会话重建并测人工处理时间。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 是否可让用户在接近限额时更好决定继续、总结或调整？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 systemPrompt 已在开始说明 maxCalls，越限消息也给出总结、询问或开新会话建议；因此并非完全没有额度提示。可验证假设是：在保留相同实际计数语义下，用户界面显示当前被跟踪调用数、阈值和“对象计数非费用”的范围，帮助用户在耗尽前决定总结或继续。以现有提示为对照，在相同任务回放中注入多 agent、排除工具、前后对象不同和接近阈值场景，测误以为总预算受控、意外阻断、合格任务率、决策时间及额外打扰。若误解或阻断不降、错误安全感增加或打扰抵消收益，则否定假设；尚未核查宿主其他额度展示，且必须先确认对象身份语义。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:30-35](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L30-L35)

已有 systemPrompt 配额提醒。

```text
  console.log(`[dsh-tool-budget] loaded maxCalls=${maxCalls}`);

  ctx.systemPrompt?.section?.({
    name: "plugin:dsh-tool-budget",
    order: 41,
    text: `Tool calls are capped at ${maxCalls} per agent session (dsh-tool-budget). Agent Teams multiplies spend across teammates — keep subagents short or raise maxCalls only when needed.`,
```

**依据 2 · 源码核查**：[index.js:38-50](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/index.js#L38-L50)

实际计数主体与越限逻辑。

<details>
<summary>查看原文（13行）</summary>

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return counts.get(exec.agent);
    counted.add(exec);
    const next = nextCount(counts.get(exec.agent));
    counts.set(exec.agent, next);
    return next;
  }

  ctx.tools.guard((exec) => {
    const count = observe(exec);
    if (count === undefined || count <= maxCalls) return undefined;
    return formatBlockMessage(exec.name, maxCalls, count);
```

</details>

**依据 3 · 源码核查**：[lib/budget.js:36-42](https://github.com/173787247/dsh-tool-budget/blob/8cc503d3e574a676020ae605591217c35128b8ec/lib/budget.js#L36-L42)

已有阻断消息。

```text
export function formatBlockMessage(toolName, maxCalls, count) {
  return [
    `dsh-tool-budget: blocked ${toolName} after ${maxCalls} tool calls this session.`,
    "Finish with what you have, ask the user, or start a new session.",
    "Agent Teams: this cap is per teammate agent — stop spawning more tools and summarize.",
    `count=${count} maxCalls=${maxCalls}`,
  ].join(" ");
```

#### 缺口

- 宿主是否已有等价预算视图及用户对额度的理解未知
  **影响**：不能断言增量或安全效果
  **进一步探讨**：核查宿主现有 UI 后，固定任务盲测提示组与对照组。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
