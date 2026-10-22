# dsh-repeat-stop

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[cb1ed9f](https://github.com/173787247/dsh-repeat-stop/tree/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop)
<!-- END META -->

> **实现功能**：在 DSH 中按 Agent 拦截超过阈值的连续同工具同参数调用，支持过滤与用户消息重置。

> **核心亮点**：把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](#research-q03)。

> **风险与缺陷**：跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](#research-q04)。

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
  - [Q01 · 什么重复任务适合硬阻断，怎样算合格结果？](#detail-section-11)
  - [Q02 · 调用如何计数、阻断和重置？](#detail-section-12)
  - [Q03 · 相对提示提醒和总预算机制增加了什么？](#detail-section-13)
  - [Q04 · 连续性、排除和用户消息重置能否削弱保护？](#detail-section-14)
  - [Q05 · 启动和长期工作依赖什么，如何退出？](#detail-section-15)
  - [Q06 · 首次、持续和恢复成本及收益是否可计量？](#detail-section-16)
  - [Q07 · 哪些工程设计值得复用，测试证明到哪里？](#detail-section-17)
  - [Q08 · 从绕过与误拦截可推导什么新机制？](#detail-section-18)
  - [Q09 · 对谁值得试用，什么结果应停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为反复原样重试工具的 Agent 提供执行前保险丝，合格结果是阻断无效重复并保留合法探索；正常轮询需单独配置。详见[Q01](#research-q01)。

简单替代是人工查看轨迹后中断；作者另以仅提醒的 repeat-tool-reminder 和全会话 dsh-tool-budget 作职责对照，本轮没有完成它们的同版本独立源码比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 精确重复硬拒绝 | 阻止原样连续重试 | 不覆盖交替工具和变化参数循环 |
| 按 Agent 隔离与去重 | 多 Agent 分开计数 | 依赖 Agent 和 exec 对象语义 |
| 过滤与用户消息重置 | 保留合法轮询和新任务 | 历史消息窗口需核对 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途与必要性 | 失效影响与处理 |
| --- | --- | --- |
| Node >=18、ESM | 清单声明的运行时 | 运行时不满足则先调整宿主环境 |
| tools、systemPrompt | 入口注入与提示、guard | 宿主服务及事件语义需匹配 |
| 阈值与过滤规则 | 区分循环和合法轮询 | 先排除正常等待，必要时停用 |

#### 启动步骤

| 步骤 | 执行者 | 判断依据 |
| --- | --- | --- |
| 加入目标 profile 并重启 | 维护者 | 作者安装说明及 loaded 日志 |
| 核查阈值、合法等待与消息重置 | 维护者 | 固定宿主事件契约及反例序列 |
| 观察拒绝并处理任务 | 使用者 | 超阈值后换参、换工具或结束 |
| 出现误拦时停用或调整 | 维护者 | enabled=false 注册前返回 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 无独立服务调用；模型与宿主费用依部署 | 安装、重启和排除规则核查，耗时未知 | 无独立服务不等模型/宿主总费为零；准备耗时未知 |
| 持续使用 | 参数递归排序和序列化；实际资源量未知 | 维护阈值、复核拒绝轨迹 | 规范化成本随参数层级/大小增长；节费无任务对照 |
| 失败恢复 | 重新执行可能产生工具或模型费用，金额未知 | 判断误拦、调整规则或停用并核对副作用 | 重执行可重复工具/模型费用；误拦恢复工时未知 |


#### 效果

| 判断对象 | 可见支持 | 未确定边界 |
| --- | --- | --- |
| 阈值硬拒绝 | guard 超阈值返回拒绝文本 | 宿主计数持续性待核对 |
| 节省无效调用 | 精确重复可被阻断 | 账单、合格率和端到端收益未量化 |
| 合法任务保护 | include/exclude 可调 | 真实误拦与恢复成本未知 |

> **思考**：跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](#research-q03)。

把原样重复检测接入工具 guard，默认允许六次并拒绝第七次，同时按 Agent 隔离状态并规范化对象键；属于有用的局部机制组合，官方提醒器对照仅为作者声明。详见[Q03](#research-q03)。

纯函数与宿主接线分开、弱引用状态隔离值得借鉴；测试源码覆盖阈值和重置，却没有真实事件消息窗口或双钩子对象身份的集成证明。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

跨步计数能否成立取决于宿主消息窗口。pre-step 遇到任何 user 消息便重置，若每步含历史用户消息就可能削弱保护；这是静态条件风险，未做故障复现。精确键还无法识别交替与改参循环。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。先由维护者确认消息窗口和执行对象身份，再决定是否在可丢弃任务试用；历史消息反复重置、合法等待误拦或恢复负担高于收益时停止。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

硬阻断及按 Agent 隔离具有源码支持；跨步骤消息和执行对象约定仍有缺口。进展感知扩展是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、lib/repeat.js、test/repeat.test.js、test/apply.test.js、cordis.patch.yml、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Git 提交源码核查，包括入口、纯函数、配置、清单与两组测试材料；不把作者兼容矩阵当宿主验收。
- 下一步：进一步探讨可从宿主 pre-step 消息窗口与执行对象传递关系入手，再比较固定循环和合法轮询序列，最后用合格任务成本决定是否值得扩展规则。

**分析版本**

- **仓库**：[173787247/dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop)
- **版本号**：0.1.2（[固定提交 cb1ed9f](https://github.com/173787247/dsh-repeat-stop/tree/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨让工具结果声明进展，在精确重复规则旁区分合法等待和无进展失败；先用固定事件反例比较误拦及漏拦，再评估状态契约的维护代价。当前未验证，不属于已有能力。详见[Q08](#research-q08)。

进一步探讨可从宿主 pre-step 消息窗口与执行对象传递关系入手，再比较固定循环和合法轮询序列，最后用合格任务成本决定是否值得扩展规则。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 120 | 103 | 0 | — |
| .md | source | 2 | 172 | — | — | 879 |
| .js | test | 2 | 151 | 135 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+created%3A2026-09-22T04%3A37%3A07.159Z..2026-10-22T04%3A37%3A07.159Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A37%3A07.159Z..2026-10-22T04%3A37%3A07.159Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**固定版本的精确重复保险丝能否以可控误拦截负担切断 Agent 原样重试，其贡献、限制和采用条件是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 什么重复任务适合硬阻断，怎样算合格结果？

**研究主题：**场景与需求

#### 完整回答

适用对象是运行会调用工具的 DSH Agent 的维护者，尤其是工具失败后模型连续提交完全相同调用的任务。这里的合格结果不是“完成用户业务”，而是在允许的一段重试后拒绝进一步原样调用，并让模型改变参数、换工具或结束。README 明确将它与限制整场工具总量的预算插件区分；正常轮询不能直接按这种判据视为无效，因此默认排除了 job_output、job_list、job_kill。

原有替代办法是用户看轨迹后手工中断，或者按作者描述使用仅提示不拦截的 repeat-tool-reminder。后者的具体官方版本未在本插件内固定，故本轮只把它作为作者提出的参照，不能宣称完成宿主能力全量比较。插件适合重复副作用可接受且希望尽早介入的任务，不适合依赖多次同参数读取等待远端状态变化、又没有正确设置排除的流程。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-39](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/README.md#L35-L39)

作者定义提醒与硬拦截的差别及默认第七次阻断。

```text
## Why

Official `repeat-tool-reminder` only advises and never blocks. Agents can still spin on the same failing call. This plugin **denies** the next call after a streak.

Default: **6** identical calls may run; the **7th** is blocked. Changing args/tool or a real user message resets the streak.
```

**依据 2 · 源码核查**：[index.js:12-18](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L12-L18)

默认排除三种 job 工具，体现正常轮询与无效重试需要区分。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const threshold = readThreshold(config.threshold);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const chains = new WeakMap();
  const counted = new WeakSet();
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调用如何计数、阻断和重置？

**研究主题：**功能与机制

#### 完整回答

apply 读取 enabled、threshold 和 include/exclude 规则，创建按 Agent 对象索引的 WeakMap 与按执行对象去重的 WeakSet。guard 在执行前调用 observe，只有存在 agent 且工具通过过滤才计数。调用键包含工具名和参数的规范化 JSON，递归排序对象键、保留数组顺序，因此对象键顺序变化不会重置计数。相同键递增，不同键从一开始；超过阈值时返回拒绝文本，默认六次允许、第七次拒绝。

post-execute 再次调用同一个 observe，意图覆盖不同执行路径并用 WeakSet 避免同一个 exec 被算两次。agent/pre-step 在 messages 中看到 user 来源便删除该 Agent 的计数。状态只保存在内存，没有磁盘写入、外部请求或新增模型工具。过滤分支会直接返回而不重置旧链，因此“连续”实际指连续被跟踪的调用，不是轨迹上所有调用。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:33-64](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L33-L64)

展示过滤、去重、guard、事后观察与用户消息重置。

<details>
<summary>查看原文（32行）</summary>

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return chains.get(exec.agent);
    counted.add(exec);
    const key = callKey(exec);
    const next = nextChain(chains.get(exec.agent), key);
    chains.set(exec.agent, next);
    return next;
  }

  ctx.tools.guard((exec) => {
    const chain = observe(exec);
    if (!chain || chain.count <= threshold) return undefined;
    return [
      `dsh-repeat-stop: blocked ${exec.name} after ${threshold} consecutive identical calls.`,
      "Change the arguments, use a different tool, or finish the task.",
      "In Agent Teams sessions, stop spawning loops — ask the lead to conclude.",
      `count=${chain.count} threshold=${threshold}`,
    ].join(" ");
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
  });

  ctx.on("agent/pre-step", ({ agent, messages }, next) => {
    if (messages.some((message) => message.source?.kind === "user")) {
      chains.delete(agent);
    }
    return next();
  });
```

</details>

**依据 2 · 源码核查**：[lib/repeat.js:25-54](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/lib/repeat.js#L25-L54)

调用键、排序、计数和过滤的纯函数实现。

<details>
<summary>查看原文（30行）</summary>

```text
export function callKey(exec) {
  return JSON.stringify([exec.name, canonicalize(exec.arguments)]);
}

export function canonicalize(argumentsValue) {
  return JSON.stringify(sortJsonValue(argumentsValue ?? {}));
}

export function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value !== null && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortJsonValue(value[key]);
    }
    return sorted;
  }
  return value;
}

export function nextChain(chain, key) {
  const count = chain !== undefined && chain.key === key ? chain.count + 1 : 1;
  return { key, count };
}

export function tracked(toolName, includePatterns, excludePatterns) {
  if (includePatterns.length > 0 && !includePatterns.some((re) => re.test(toolName))) {
    return false;
  }
  return !excludePatterns.some((re) => re.test(toolName));
```

</details>

#### 缺口

- 宿主是否让 guard 与 post-execute 共享同一个 exec 对象未由本仓库材料确定。
  **影响：**若对象身份不同，单次调用可能被重复计数。
  **进一步探讨：**检查所用宿主固定版本中两条事件链传递对象的构造与引用关系。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对提示提醒和总预算机制增加了什么？

**研究主题：**贡献与相对优势

#### 完整回答

可确认的已有贡献是在宿主工具 guard 上把重复调用提示升级为执行前拒绝，并用按 Agent 分离的状态避免不同队友相互消耗同一连续计数。参数排序和双观察去重让规则更接近“同一语义参数的执行”，属于局部机制组合，不能据此称为新的循环检测算法。

相对手工看轨迹，它把介入时点自动化；相对总调用预算，它只针对精确重复键，允许参数变化后的探索继续进行。这项取舍同时减少了对有进展长任务的直接限制，也放过交替工具或轻微改参的循环。作者关于官方提醒器只提示不阻断的描述没有附固定宿主源码，故本轮贡献判断限于本插件可核查的硬拒绝和状态结构，不给同类效果排名。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-18](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L17-L18)

Agent 状态和执行对象分别使用弱引用。

```text
  const chains = new WeakMap();
  const counted = new WeakSet();
```

**依据 2 · 源码核查**：[index.js:43-51](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L43-L51)

明确的执行前拒绝文本。

```text
  ctx.tools.guard((exec) => {
    const chain = observe(exec);
    if (!chain || chain.count <= threshold) return undefined;
    return [
      `dsh-repeat-stop: blocked ${exec.name} after ${threshold} consecutive identical calls.`,
      "Change the arguments, use a different tool, or finish the task.",
      "In Agent Teams sessions, stop spawning loops — ask the lead to conclude.",
      `count=${chain.count} threshold=${threshold}`,
    ].join(" ");
```

**依据 3 · 作者声明**：[README.md:71-76](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/README.md#L71-L76)

作者区分精确重复与全会话预算的职责。

```text
## vs dsh-tool-budget

| Plugin | What it blocks |
|--------|----------------|
| `dsh-repeat-stop` | Consecutive identical calls |
| `dsh-tool-budget` | Total tool calls in the whole session |
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连续性、排除和用户消息重置能否削弱保护？

**研究主题：**缺陷与关键质疑

#### 完整回答

最影响价值成立的前提是重复计数能够跨宿主步骤稳定累积，而不是用户消息检测每步重置。实现对 messages 只执行 some(user)，没有识别新用户消息或游标。如果宿主每步提供包含历史用户消息的完整数组，就可能每步删掉链；若只提供新增消息则符合设计。这是条件化兼容风险，不能写成已经发生的故障。

规则本身也不能检测一般无进展。A、B 工具交替会重置链；参数增加无意义字段或时间戳也生成新键。相反同参数合法轮询会达到阈值。被排除的工具不会删除已计数链，A 与被排除轮询交错后仍可达到阈值。重试是否成功与是否产生结果完全不参与计数，因此六次成功的相同读取与六次失败获得同等处理。这些限制决定它是精确重复保险丝，不是进展判断或资源总预算。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:33-40](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L33-L40)

排除工具直接返回，旧链保留。

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return chains.get(exec.agent);
    counted.add(exec);
    const key = callKey(exec);
    const next = nextChain(chains.get(exec.agent), key);
    chains.set(exec.agent, next);
    return next;
```

**依据 2 · 源码核查**：[index.js:59-64](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L59-L64)

任意 user 来源消息触发删除，没有新消息判定。

```text
  ctx.on("agent/pre-step", ({ agent, messages }, next) => {
    if (messages.some((message) => message.source?.kind === "user")) {
      chains.delete(agent);
    }
    return next();
  });
```

**依据 3 · 源码核查**：[lib/repeat.js:25-47](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/lib/repeat.js#L25-L47)

精确键判等，不包含结果或任务进展。

<details>
<summary>查看原文（23行）</summary>

```text
export function callKey(exec) {
  return JSON.stringify([exec.name, canonicalize(exec.arguments)]);
}

export function canonicalize(argumentsValue) {
  return JSON.stringify(sortJsonValue(argumentsValue ?? {}));
}

export function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value !== null && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortJsonValue(value[key]);
    }
    return sorted;
  }
  return value;
}

export function nextChain(chain, key) {
  const count = chain !== undefined && chain.key === key ? chain.count + 1 : 1;
  return { key, count };
```

</details>

#### 缺口

- 所用宿主 agent/pre-step 消息数组的增量语义未确定。
  **影响：**直接影响跨步骤阻断是否可兑现。
  **进一步探讨：**在对应宿主固定提交检查消息装配和事件派发代码；若含历史记录则需要新用户消息标识。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动和长期工作依赖什么，如何退出？

**研究主题：**依赖、兼容与流程

#### 完整回答

包清单声明 ESM、入口 index.js、Node >=18，没有 npm runtime dependencies；Cordis 补丁将插件以 enabled 和阈值六插入配置。入口硬声明 tools 与 systemPrompt 注入，工具 guard 与 tools/post-execute、agent/pre-step 的执行语义是主要宿主依赖。提示区注册使用可选链，但注入声明本身并没有把 systemPrompt 标为可选，不能仅因可选链就承诺缺服务也能加载。

维护者按 README 把 GitHub 来源加入目标 profile 并重启 web，再核对 loaded 日志和阻断轨迹；长期使用需要维护 include/exclude 与合法重试阈值。enabled=false 会在注册前返回，是源码可见的退出途径。更改配置是否需要重启、热卸载是否撤销事件处理由宿主管理，本仓库未给独立卸载回调。内存状态在重新 apply 后重建，不需要迁移磁盘数据。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:14-28](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/package.json#L14-L28)

运行时、入口和发布文件清单。

<details>
<summary>查看原文（15行）</summary>

```text
  "type": "module",
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/repeat.test.js test/apply.test.js"
  },
  "files": [
    "index.js",
    "lib",
    "cordis.patch.yml",
    "README.md",
    "README.zh.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[index.js:9-31](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L9-L31)

注入、开关和提示注册。

<details>
<summary>查看原文（23行）</summary>

```text
export const name = "dsh-repeat-stop";
export const inject = ["tools", "systemPrompt"];

export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const threshold = readThreshold(config.threshold);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const chains = new WeakMap();
  const counted = new WeakSet();

  if (!enabled) {
    console.log("[dsh-repeat-stop] disabled");
    return;
  }

  console.log(`[dsh-repeat-stop] loaded threshold=${threshold}`);

  ctx.systemPrompt?.section?.({
    name: "plugin:dsh-repeat-stop",
    order: 40,
    text: `Identical tool calls are hard-stopped after ${threshold} repeats (dsh-repeat-stop). Agent Teams: each teammate agent has its own streak counter — still avoid hammering the same tool. Prefer finishing or changing args over looping.`,
  });
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/cordis.patch.yml#L1-L10)

配置插入的具体默认值。

<details>
<summary>查看原文（10行）</summary>

```text
- insert:
    - id: dsh-repeat-stop
      name: dsh-repeat-stop
      config:
        enabled: true
        threshold: 6
        exclude:
          - job_output
          - job_list
          - job_kill
```

</details>

**依据 4 · 作者声明**：[README.md:41-69](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/README.md#L41-L69)

安装、重启、配置与观察入口均为作者操作说明。

<details>
<summary>查看原文（29行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:173787247/dsh-repeat-stop
```

Restart `dsh web`. No new tool appears. When it fires, Trajectory shows `dsh-repeat-stop: blocked`.

## Config

```yaml
- id: dsh-repeat-stop
  name: dsh-repeat-stop
  config:
    enabled: true
    threshold: 6
    exclude:
      - job_output
      - job_list
      - job_kill
    # include: []   # if set, only these names (wildcards ok) are tracked
```

| Key | Default | Meaning |
|-----|---------|---------|
| `enabled` | `true` | Master switch |
| `threshold` | `6` | Allowed streak; next call blocked (integer ≥ 2) |
| `exclude` | job_* | Names that never count |
| `include` | (empty) | If set, only these names are tracked |
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 首次、持续和恢复成本及收益是否可计量？

**研究主题：**效果与总成本

#### 完整回答

源码没有单独账号、服务或付费 API 调用，不能据此把采用总成本写成零。首次投入是 profile 安装、重启和按工作流核查阈值与排除；持续阶段每个被跟踪调用都规范化并序列化参数，成本随参数大小、对象层级和键排序增长。WeakMap/WeakSet 不主动保活 Agent 和执行对象，仍需宿主正确释放对象。

潜在现金收益来自阻断无效调用后减少工具或后续模型消耗，但本实现不统计 token、账单、任务完成率和被阻断次数收益。失败恢复由用户检查轨迹、识别合法重试、调整排除或停用，再核对原任务是否存在已完成副作用。恰当对照是同任务同模型下的手工中断或提醒器，计入失败尝试和人工复核；本材料没有这种工作负载与结果，因此不提供金额、耗时或 ROI 数值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/repeat.js:25-43](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/lib/repeat.js#L25-L43)

递归规范化和排序显示每次调用的局部资源负担。

<details>
<summary>查看原文（19行）</summary>

```text
export function callKey(exec) {
  return JSON.stringify([exec.name, canonicalize(exec.arguments)]);
}

export function canonicalize(argumentsValue) {
  return JSON.stringify(sortJsonValue(argumentsValue ?? {}));
}

export function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value !== null && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortJsonValue(value[key]);
    }
    return sorted;
  }
  return value;
}
```

</details>

**依据 2 · 源码核查**：[index.js:43-51](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L43-L51)

阻断只返回文本，没有效果或账单核算。

```text
  ctx.tools.guard((exec) => {
    const chain = observe(exec);
    if (!chain || chain.count <= threshold) return undefined;
    return [
      `dsh-repeat-stop: blocked ${exec.name} after ${threshold} consecutive identical calls.`,
      "Change the arguments, use a different tool, or finish the task.",
      "In Agent Teams sessions, stop spawning loops — ask the lead to conclude.",
      `count=${chain.count} threshold=${threshold}`,
    ].join(" ");
```

#### 缺口

- 缺少合法轮询与故障重试混合任务的误拦截和成本记录。
  **影响：**不能量化节省是否超过恢复负担。
  **进一步探讨：**在另行授权的对照研究中记录合格任务数、总工具费、模型费和人工恢复时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些工程设计值得复用，测试证明到哪里？

**研究主题：**工程质量与复用

#### 完整回答

可借鉴的是将配置、通配过滤、参数规范化和链计数拆成纯函数，再由小型入口绑定宿主生命周期。WeakSet 防重复计数解决同一执行对象穿过多个钩子的重复观察问题，WeakMap 则隔离 Agent 计数，移植时必须同时确认执行对象身份和 Agent 对象生命周期，否则无法直接复制正确性结论。

测试源码覆盖阈值回退、通配符、include/exclude、键顺序、空参数、链切换，以及 mock guard 阈值和用户消息重置。apply 测试的 mock 没有真实消息窗口，也没有 guard 后接 post-execute 的组合断言，不能证明双钩子去重和宿主事件先后关系。测试文件本轮只阅读未执行。代码易于检查不等于完整循环防护，更不意味着效果可靠性已得到测试验证。

#### 证据与依据

**依据 1 · 源码核查**：[test/repeat.test.js:54-88](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/test/repeat.test.js#L54-L88)

纯函数测试覆盖规范化和链切换。

<details>
<summary>查看原文（35行）</summary>

```text
describe("canonicalize", () => {
  it("sorts object keys so argument order does not reset the streak", () => {
    assert.equal(
      canonicalize({ b: 1, a: 2 }),
      canonicalize({ a: 2, b: 1 }),
    );
  });
});

describe("callKey", () => {
  it("includes the tool name and canonical arguments", () => {
    const a = callKey({ name: "bash", arguments: { command: "ls", cwd: "." } });
    const b = callKey({ name: "bash", arguments: { cwd: ".", command: "ls" } });
    const c = callKey({ name: "bash", arguments: { command: "pwd" } });
    assert.equal(a, b);
    assert.notEqual(a, c);
  });

  it("treats missing arguments as an empty object", () => {
    assert.equal(
      callKey({ name: "net_doctor" }),
      callKey({ name: "net_doctor", arguments: {} }),
    );
  });
});

describe("nextChain", () => {
  it("increments only while the key stays the same", () => {
    const first = nextChain(undefined, "a");
    const second = nextChain(first, "a");
    const reset = nextChain(second, "b");
    assert.deepEqual(first, { key: "a", count: 1 });
    assert.deepEqual(second, { key: "a", count: 2 });
    assert.deepEqual(reset, { key: "b", count: 1 });
  });
```

</details>

**依据 2 · 源码核查**：[test/apply.test.js:26-61](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/test/apply.test.js#L26-L61)

mock 覆盖 guard、重置、停用及默认配置，没有真实宿主事件链。

<details>
<summary>查看原文（36行）</summary>

```text
describe("apply", () => {
  it("blocks the call after the threshold of identical tools", () => {
    const ctx = mockCtx();
    apply(ctx, { threshold: 2, exclude: [] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    assert.match(guard(call(agent, "bash", { command: "ls" })), /blocked bash after 2/);
  });

  it("resets the streak after a real user message", () => {
    const ctx = mockCtx();
    apply(ctx, { threshold: 2, exclude: [] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    ctx.handlers["agent/pre-step"]({
      agent,
      messages: [{ source: { kind: "user" } }],
    }, () => {});
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
  });

  it("does not install a guard when disabled", () => {
    const ctx = mockCtx();
    apply(ctx, { enabled: false, threshold: 6 });
    assert.equal(ctx.guards.length, 0);
  });

  it("loads with the default threshold when config omits it", () => {
    const ctx = mockCtx();
    apply(ctx, { exclude: [] });
    assert.equal(ctx.guards.length, 1);
  });
```

</details>

**依据 3 · 源码核查**：[index.js:33-40](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L33-L40)

弱引用去重机制及其对象身份前提。

```text
  function observe(exec) {
    if (!exec.agent || !tracked(exec.name, includePatterns, excludePatterns)) return undefined;
    if (counted.has(exec)) return chains.get(exec.agent);
    counted.add(exec);
    const key = callKey(exec);
    const next = nextChain(chains.get(exec.agent), key);
    chains.set(exec.agent, next);
    return next;
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 从绕过与误拦截可推导什么新机制？

**研究主题：**新假设与验证

#### 完整回答

未验证假设是保留现有精确重复保险丝，同时由工具结果声明可等待的进展状态，将合法轮询与无变化失败分开计数。推导来自两个事实，即规则目前只看输入键、不看输出，而默认排除 job 工具体现了合法等待的存在。相对直接增加阈值，这种组合有望保留故障阻断而减少合法轮询误拦，但会新增结果契约、状态所有权和工具适配成本。

最小验证先用固定事件序列对照精确规则与候选规则，覆盖输出有进展、输出不变、结果缺失、工具交替和历史用户消息。随后如获授权，在相同宿主、模型和任务下比较合格交付、无效调用与人工恢复；若候选规则靠模型自报进展持续放过故障循环，或适配负担大于减少的误拦截，就否定采用该扩展。该设想没有进入本插件当前能力，也不计入现有贡献评分。

#### 证据与依据

**依据 1 · 源码核查**：[lib/repeat.js:25-47](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/lib/repeat.js#L25-L47)

输入精确键与简单链是推导起点。

<details>
<summary>查看原文（23行）</summary>

```text
export function callKey(exec) {
  return JSON.stringify([exec.name, canonicalize(exec.arguments)]);
}

export function canonicalize(argumentsValue) {
  return JSON.stringify(sortJsonValue(argumentsValue ?? {}));
}

export function sortJsonValue(value) {
  if (Array.isArray(value)) return value.map(sortJsonValue);
  if (value !== null && typeof value === "object") {
    const sorted = {};
    for (const key of Object.keys(value).sort()) {
      sorted[key] = sortJsonValue(value[key]);
    }
    return sorted;
  }
  return value;
}

export function nextChain(chain, key) {
  const count = chain !== undefined && chain.key === key ? chain.count + 1 : 1;
  return { key, count };
```

</details>

**依据 2 · 源码核查**：[index.js:15-16](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L15-L16)

默认排除合法任务轮询类工具。

```text
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
```

#### 缺口

- 缺少结果进展契约及候选机制的实际对照。
  **影响：**只能形成设计假设，不能宣称减少误拦截。
  **进一步探讨：**先约定结果状态和所有权，再对固定反例序列进行可复核比较。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得试用，什么结果应停止？

**研究主题：**采用判断

#### 完整回答

本轮建议观察，适合已经遇到原样工具循环、愿意核查宿主事件语义的维护者。硬拒绝、参数排序与按 Agent 隔离有明确源码依据，安装及关闭流程简单；但历史用户消息是否每步重置是直接影响主能力的兼容缺口，不能在未查清时普遍推荐启用。经确认宿主只传新增消息且执行对象共享后，才有理由为可丢弃、低副作用工作流制定小范围试用。

合格判据应包括阈值后稳定拒绝、合法轮询不误拦、不同 Agent 不串计数和停用后恢复正常调用。若每步重置导致不能累积，或正常等待需要不断修改排除且收益不显著，应停止该工作流采用。不给 install，因为没有同版本安装、核心任务和禁用卸载的真实验收；推荐分也仅表达固定源码研究下的采用优先级。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:43-64](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/index.js#L43-L64)

同一段源码同时支持硬拒绝和兼容缺口，采用结论须同时考虑。

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.tools.guard((exec) => {
    const chain = observe(exec);
    if (!chain || chain.count <= threshold) return undefined;
    return [
      `dsh-repeat-stop: blocked ${exec.name} after ${threshold} consecutive identical calls.`,
      "Change the arguments, use a different tool, or finish the task.",
      "In Agent Teams sessions, stop spawning loops — ask the lead to conclude.",
      `count=${chain.count} threshold=${threshold}`,
    ].join(" ");
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
  });

  ctx.on("agent/pre-step", ({ agent, messages }, next) => {
    if (messages.some((message) => message.source?.kind === "user")) {
      chains.delete(agent);
    }
    return next();
  });
```

</details>

**依据 2 · 源码核查**：[test/apply.test.js:37-54](https://github.com/173787247/dsh-repeat-stop/blob/cb1ed9fb558072adf80e2068b3bc7c50ff736fb9/test/apply.test.js#L37-L54)

源码测试明确重置与关闭的预期，但不是宿主验收。

<details>
<summary>查看原文（18行）</summary>

```text
  it("resets the streak after a real user message", () => {
    const ctx = mockCtx();
    apply(ctx, { threshold: 2, exclude: [] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
    ctx.handlers["agent/pre-step"]({
      agent,
      messages: [{ source: { kind: "user" } }],
    }, () => {});
    assert.equal(guard(call(agent, "bash", { command: "ls" })), undefined);
  });

  it("does not install a guard when disabled", () => {
    const ctx = mockCtx();
    apply(ctx, { enabled: false, threshold: 6 });
    assert.equal(ctx.guards.length, 0);
```

</details>

#### 缺口

- 宿主消息和执行对象的约定尚未固定。
  **影响：**阻碍把观察升级为当前可控试用。
  **进一步探讨：**定位部署宿主的固定版本核查两项事件契约，再按阈值和合法轮询反例决定试用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
