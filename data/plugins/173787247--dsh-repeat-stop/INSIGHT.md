# dsh-repeat-stop

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[b600454](https://github.com/173787247/dsh-repeat-stop/tree/b60045434ab23f06b11bf74d4e4d7682a549f83d)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/173787247/dsh-repeat-stop)
<!-- END META -->

> **功能**：在 DSH 工具执行前，按 Agent 对连续相同工具和参数的调用计数，并拒绝超过阈值的调用。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把精确重复键与工具guard相接，默认允许六次并拒绝第七次，按Agent对象隔离状态。该局部保险丝有明确机制，不能称通用防循环或已验证节费。

> **主要限制**：[Q03](#research-q03) 跨步计数依赖宿主user消息窗口与exec对象身份；若历史user每步重现就可能重置，若双钩子包装不同可能双计数，均未真实复现。被排除工具不重置旧链，合法轮询也可能触阈值。

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
  - [Q01 · 哪类循环被处理，相对提醒或人工停止增加什么？](#detail-section-11)
  - [Q02 · 计数与拒绝如何接线，状态何时重置？](#detail-section-12)
  - [Q03 · 哪些宿主事件与任务条件可能击穿保护？](#detail-section-13)
  - [Q04 · 采用要承担哪些成本，如何停止？](#detail-section-14)
  - [Q05 · 如何检验按工具进展区分重复的假设？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为原样重复失败调用提供执行前保险丝，合格结果是减少无效重复同时保留合法探索和等待。

人工查看轨迹并停止和宿主提醒是直接参照；作者关于原生只提醒的说法未独立核查，本包不处理变参/交替循环或全任务预算。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 精确重复guard | 超阈值前拒绝相同键 | 不看结果，不处理变参/交替循环 |
| Agent链隔离 | 分别累计各Agent | 依赖Agent对象生命周期 |
| 名称过滤 | include/exclude控制范围 | 被排除调用不清旧链 |
| 用户消息重置 | 允许新请求重新开始 | 真实消息窗口未核查 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools/systemPrompt及事件 | 必需 | 注册guard、提示和重置 | 实际契约需先核对 |
| Node>=18 | 包声明 | 执行JS插件 | 不代表宿主兼容已验 |
| 正确Agent/exec对象身份 | 计数必需 | 持续链及双钩子去重 | 可能重置/双计数，当前未知 |
| include/exclude与阈值 | 按任务核对 | 区分等待与失败调用 | 不把默认排除三个名字写成全部job_* |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核对 | 先固定宿主消息窗口与对象身份 | 证据不明保持观察 |
| 配置 | 选择跟踪工具、阈值和合法轮询排除 | 可丢弃任务检查第7次拒绝 |
| 执行 | guard计数并在超阈值前拒绝 | 查看轨迹，不当工具总预算 |
| 恢复 | 核对已执行副作用，必要时停用 | 禁用不等于回滚或取消远端操作 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装及宿主/模型资源未知 | 重启、规则与宿主契约核对 | 耗时未知 |
| 持续使用 | 递归排序/序列化，资源量未知 | 拒绝轨迹与规则维护 | 无节费对照 |
| 失败恢复 | 重跑可能增加工具/模型开销 | 回读副作用、识别误拦并停用 | 禁用不回滚前次工具 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 精确重复拒绝 | guard与规范化源码 | 宿主跨步计数效果 |
| 按Agent隔离 | 弱引用状态 | 实际对象生命周期 |
| 无效调用节省 | 有拒绝意图 | 账单、误拦和合格率 |

> **思考**：[Q03](#research-q03) 跨步计数依赖宿主user消息窗口与exec对象身份；若历史user每步重现就可能重置，若双钩子包装不同可能双计数，均未真实复现。被排除工具不重置旧链，合法轮询也可能触阈值。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02) 把精确重复键与工具guard相接，默认允许六次并拒绝第七次，按Agent对象隔离状态。该局部保险丝有明确机制，不能称通用防循环或已验证节费。

[Q02](#research-q02)、[Q03](#research-q03) 纯函数与接线分离、弱引用状态有明确复用价值；mock测试源码覆盖阈值、user重置与关闭，但没有真实宿主事件窗口与对象身份的集成证明。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 跨步计数依赖宿主user消息窗口与exec对象身份；若历史user每步重现就可能重置，若双钩子包装不同可能双计数，均未真实复现。被排除工具不重置旧链，合法轮询也可能触阈值。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 当前观察，先核对宿主消息窗口和双钩子对象身份；确认后只在可丢弃任务检查阈值与合法等待。误拦、保护失效或恢复负担过大时停用并人工回读，勿把重置计数当可安全重跑。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持guard、规范化和重置机制；真实宿主事件契约及效果未核清。进展信号是假设，不是已有能力。

- 已检查：作者 README、包清单、源码路径 README.md、README.zh.md、package.json、index.js、lib/repeat.js、cordis.patch.yml、test/apply.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定入口、纯函数、配置、包清单和apply测试源码；未执行目标测试或宿主，不把作者套件兼容矩阵当验收。
- 下一步：按 [Q05](#research-q05) 先核实宿主契约，再比较原样失败、合法等待和变参空转轨迹的误拦/漏拦与恢复成本。

**分析版本**

- **仓库**：[173787247/dsh-repeat-stop](https://github.com/173787247/dsh-repeat-stop)
- **版本号**：0.1.2（[固定提交 b600454](https://github.com/173787247/dsh-repeat-stop/tree/b60045434ab23f06b11bf74d4e4d7682a549f83d)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证假设是使用可信工具结果区分进展、等待和无效失败，以误拦/漏拦及额外副作用比较现有精确规则；不接受模型自报进展，信号维护无净收益时放弃。

按 [Q05](#research-q05) 先核实宿主契约，再比较原样失败、合法等待和变参空转轨迹的误拦/漏拦与恢复成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 120 | 103 | 0 | — |
| .md | source | 2 | 172 | — | — | 879 |
| .js | test | 2 | 151 | 135 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+created%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/173787247/dsh-repeat-stop/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-03T02%3A08%3A50.948Z..2026-11-02T02%3A08%3A50.948Z)



统计日期：2026-11-02。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：精确重复硬拒绝能否约束无进展循环，同时避免合法等待误拦？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类循环被处理，相对提醒或人工停止增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向Agent反复用同一参数调用同一工具而没有进展的任务，提供执行前保险丝。合格结果须同时减少无效原样重试并让合法探索继续，不能只数被拒绝次数。源码增量是guard返回拒绝文本而不是仅加提示；作者关于官方repeat-tool-reminder只提醒的对照未在本次回源宿主验证，不能扩成对原生全部保护的比较。

直接替代是人工看轨迹停止、调整任务提示，或限制整个任务预算。本包只判精确键连续相同，不限制改变参数或交替工具的循环，也不分析工具是否真的取得进展。因此对已知原样失败循环有候选便利，对合法轮询、重复读取外部变化状态则可能误拦，不能叫通用防死循环。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-47](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/README.md#L35-L47)

作者说明场景、默认第7次拒绝及原生提醒器对照，仅按声明引用。

<details>
<summary>查看原文（13行）</summary>

````text
## Why

Official `repeat-tool-reminder` only advises and never blocks. Agents can still spin on the same failing call. This plugin **denies** the next call after a streak.

Default: **6** identical calls may run; the **7th** is blocked. Changing args/tool or a real user message resets the streak.

## Install

```sh
dsh plugin --profile web add github:173787247/dsh-repeat-stop
```

Restart `dsh web`. No new tool appears. When it fires, Trajectory shows `dsh-repeat-stop: blocked`.
````

</details>

**依据 2 · 源码核查**：[index.js:43-51](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L43-L51)

实际guard超阈值返回文本，支持硬拒绝意图。

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

**依据 3 · 源码核查**：[lib/repeat.js:25-47](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/lib/repeat.js#L25-L47)

键只由名称和规范化参数，链只比较相等。

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

- 缺少真实循环/合法等待任务的效果对照及宿主原生保护核查
  **影响**：不能判断一般任务净收益或原生不足
  **进一步探讨**：按具体宿主固定原生guard契约，用原样失败和合法状态轮询对照漏拦与误拦。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 计数与拒绝如何接线，状态何时重置？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply注入tools与systemPrompt，启用后用WeakMap按Agent对象保存链，用WeakSet标记已计数的exec对象，避免同一对象在guard与post-execute重复计数。key把工具名和递归排序后的对象参数序列化；数组顺序保留，所以仅对象键顺序变化不打断链，数组重排可能改变键。阈值默认6且要求整数至少2，允许前6次，在count>threshold时拒绝第7次。

不同被跟踪键把计数变成1，而不是全局工具预算。没有agent或被include/exclude过滤的调用直接返回，不清空旧链；所以A→被排除工具→A仍可能继续A的计数，不能把README“换工具清零”无条件照抄。默认排除是job_output/job_list/job_kill三个精确名字，不是所有job_*。pre-step只要messages中存在source.kind=user就删除该Agent链，代码没有检查该消息是否新到。

这种纯函数/宿主接线分离和弱引用状态有可借鉴处，但WeakSet去重依赖guard与post传入同一个对象，是宿主契约条件，而非序列号幂等。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-18](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L12-L18)

启用与默认精确排除、弱引用状态。

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const threshold = readThreshold(config.threshold);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const chains = new WeakMap();
  const counted = new WeakSet();
```

**依据 2 · 源码核查**：[index.js:33-64](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L33-L64)

计数、guard/post复用及user消息重置。

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

**依据 3 · 源码核查**：[lib/repeat.js:1-12](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/lib/repeat.js#L1-L12)

阈值默认与非法值回退。

<details>
<summary>查看原文（12行）</summary>

```text
export const DEFAULT_THRESHOLD = 6;

export function readThreshold(value, fallback = DEFAULT_THRESHOLD) {
  if (value === undefined || value === null || value === "") {
    return fallback;
  }
  const n = Number(value);
  if (!Number.isInteger(n) || n < 2) {
    console.warn(`[dsh-repeat-stop] invalid threshold ${JSON.stringify(value)}; using ${fallback}`);
    return fallback;
  }
  return n;
```

</details>

**依据 4 · 源码核查**：[lib/repeat.js:25-54](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/lib/repeat.js#L25-L54)

排序/数组键语义、链相等和过滤不重置。

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

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些宿主事件与任务条件可能击穿保护？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

跨步保护成立至少依赖同一Agent对象持续存在、guard返回文本能拒绝执行、guard/post复用exec对象，以及pre-step消息窗口只在适当时候含user。源码遇任意user即重置，若宿主每步都传历史用户消息，则链可能每步归零；这是明确的条件风险，不是本次复现缺陷。若guard/post用不同exec包装，同一调用也可能算两次。本包测试mock直接调用回调，只证明作者构造的条件，不能证明真实事件契约。

另外，精确重复有意不看结果：相同读取若外部状态变化仍会累加，交替参数无进展却不会累加同一链。include/exclude可收窄，但把所有等待工具排除也可能漏掉真正循环。必要依赖是支持相应tools guard和事件的DSH宿主；Node>=18是包声明，README兼容矩阵是作者跨仓引用而非本次宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:33-64](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L33-L64)

事件对象身份与user窗口条件直接可见。

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

**依据 2 · 源码核查**：[test/apply.test.js:5-19](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/test/apply.test.js#L5-L19)

mock只存回调，不是宿主集成。

<details>
<summary>查看原文（15行）</summary>

```text
function mockCtx() {
  const guards = [];
  const handlers = {};
  return {
    tools: {
      guard(fn) {
        guards.push(fn);
      },
    },
    on(name, fn) {
      handlers[name] = fn;
    },
    guards,
    handlers,
  };
```

</details>

**依据 3 · 源码核查**：[test/apply.test.js:37-48](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/test/apply.test.js#L37-L48)

重置测试手工构造一条user消息，未验证真实历史窗口。

<details>
<summary>查看原文（12行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[package.json:16-21](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/package.json#L16-L21)

Node声明和测试命令。

```text
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/repeat.test.js test/apply.test.js"
  },
```

**依据 5 · 作者声明**：[README.md:24-31](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/README.md#L24-L31)

兼容内容仅作者声明及套件链接。

```text
| Field | Value |
|-------|-------|
| **Plugin** | `dsh-repeat-stop` **0.1.2** |
| **Minimum dsh** | ≥ **0.1.2** (web UI one-shot `?token=` on Windows relay `:3081`) |
| **Latest verified** | See [dsh-wsl-kit Compatibility](https://github.com/173787247/dsh-wsl-kit#compatibility-2026-09) (currently **`0.2.1-rc.5`**) — single source of truth for the suite |
| **Kit set** | `daily` (also in `github` / `full`; fetch+net also in `llm`) |
| **Cloud Flash** | Use model id **`deepseek-flash`** (V4.1 Flash) in `~/.dsh/settings.yaml` / `llm-deepseek` — not configured by this plugin |
| **Agent Teams** | Upstream experimental; not required here |
```

#### 缺口

- 真实宿主pre-step消息窗口和双钩子对象身份未核实
  **影响**：直接影响跨步计数与阈值，阻止当前推荐试用
  **进一步探讨**：在拟用宿主固定版本核对事件实现或记录只读轨迹，确认同对象、消息窗口和第7次拒绝后再试。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用要承担哪些成本，如何停止？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前观察，先核清Q03的宿主契约，再在可丢弃任务启用；不要在合法长任务里直接把默认阈值当适用值。首次要安装、重启并明确跟踪/排除哪些工具；持续要为每次调用参数递归排序与序列化，并让人解释拒绝轨迹。资源随参数大小和层级增长，真实CPU、时间、模型/工具费用与节省均未知。

失败恢复不是单纯清零：被拦前的前6次可能已经产生副作用，调整参数或用户发消息重置后重跑仍需核对已有结果。若合法等待被拦、同一失败调用不受约束或恢复投入超过节省，应停用enabled并由人查看轨迹、回读副作用，不宣称禁用能回滚工具。没有同任务合格率与完整尝试数据，不能估节费或单位成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:41-69](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/README.md#L41-L69)

安装重启、配置与阈值说明。

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

**依据 2 · 源码核查**：[lib/repeat.js:25-42](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/lib/repeat.js#L25-L42)

每次参数规范化的资源来源。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[index.js:20-23](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L20-L23)

disabled时不安装后续guard，提供停止入口。

```text
  if (!enabled) {
    console.log("[dsh-repeat-stop] disabled");
    return;
  }
```

**依据 4 · 源码核查**：[index.js:43-64](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L43-L64)

拒绝与重置不包含工具副作用回滚。

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

#### 缺口

- 未量化误拦、漏拦、参数处理资源和人工恢复
  **影响**：不能认定节费或低维护负担
  **进一步探讨**：记录固定任务的完整调用、合格结果、误拦和恢复投入，净负担增加即停用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何检验按工具进展区分重复的假设？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是让受支持工具提供“等待外部状态/已取得进展/无进展失败”的可核对结果，在精确键旁避免把合法轮询与无效失败一概计数。推导来自当前规则只看调用键而不看结果，post-execute虽接result但未使用。不能由此断言所有工具都有可信进展信号，或模型自报进展足够。

先收集同一工具的合法等待、原样错误、改变参数空转三类固定轨迹，对照现有阈值与带可信结果信号的规则，记录误拦、漏拦、允许的额外副作用及维护信号契约的工时。若信号由模型任意填写、工具升级后不可解释，或误拦改善伴随严重漏拦增加，则否定。先核实真实宿主计数契约，否则无法将差异归因到进展规则。

#### 证据与依据

**依据 1 · 源码核查**：[lib/repeat.js:25-47](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/lib/repeat.js#L25-L47)

现有键/链不使用工具结果。

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

**依据 2 · 源码核查**：[index.js:54-56](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L54-L56)

post-execute收到_result但只调用observe，提供假设推导。

```text
  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
```

**依据 3 · 源码核查**：[index.js:43-51](https://github.com/173787247/dsh-repeat-stop/blob/b60045434ab23f06b11bf74d4e4d7682a549f83d/index.js#L43-L51)

当前规则是对照组。

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

- 缺少可信工具进展信号及轨迹对照
  **影响**：不能认定增量规则更优或值得维护
  **进一步探讨**：先验证一个工具的可观察进展契约，再比较误拦/漏拦与新增副作用，无净收益就保留精确规则。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
