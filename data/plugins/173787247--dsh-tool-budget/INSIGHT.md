# dsh-tool-budget

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[c806416](https://github.com/173787247/dsh-tool-budget/tree/c80641689728dc918a0f6fb03797e98e09a4496e)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget)
<!-- END META -->

> **实现功能**：按Agent累计工具调用次数，在超过配置阈值后返回阻断说明，并支持工具名称过滤。

> **核心亮点**：把按Agent累计次数规则接到工具执行前，并保留三个job管理工具的默认例外，能够约束更换名称或参数的持续调用；属于常规计数机制的宿主适配。详见[Q03](#research-q03)。

> **风险与缺陷**：作者的会话预算实际以Agent对象为键，重载和新Agent不共享计数；工具次数也不约束现金与已启动后台工作。对象契约仍不明确，不能当作全局硬预算。详见[Q04](#research-q04)。

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
  - [Q01 · 哪种失控调用需要总次数而非重复检测？](#detail-section-11)
  - [Q02 · 配置、计数、拦截和后置观察怎样联动？](#detail-section-12)
  - [Q03 · 相比普通最大迭代数和重复检测增加什么？](#detail-section-13)
  - [Q04 · 每会话硬上限的关键前提成立吗？](#detail-section-14)
  - [Q05 · 安装、依赖和恢复如何操作？](#detail-section-15)
  - [Q06 · 总成本与实际效果能量化吗？](#detail-section-16)
  - [Q07 · 哪些实现可借鉴，测试覆盖到哪里？](#detail-section-17)
  - [Q08 · 从每Agent局部预算能推导什么新设计？](#detail-section-18)
  - [Q09 · 哪类用户可试用，何时应停用？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长任务操作者希望阻止不断更换工具的持续调用；合格结果需明确计数主体、越额拒绝和人工恢复。

可用手工取消、原生迭代限制或连续相同调用检测作为参照；本插件主要新增工具执行前累计次数，不等同现金预算。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 工具调用闸门 | 超过maxCalls后返回阻断消息 | 以exec.agent对象计数，不是全局现金预算 |
| 名称筛选 | include限制范围、exclude排除例外 | 支持星号通配，exclude优先 |
| 前后观察去重 | guard与post-execute复用observe | 依赖同一个执行对象身份 |
| 模型提示 | 说明阈值及团队范围 | 提示不替代执行前guard |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=18 | 包声明必需 | ESM与WeakMap/WeakSet | 版本声明不代表宿主兼容已经验证 |
| DSH tools、systemPrompt | 注入声明必需 | 注册guard并给模型预算提示 | 无相应服务接口无法依赖完整接线 |
| exec.agent对象与工具执行对象 | 计数必需 | 确定计数主体和前后去重 | 缺Agent会跳过，跨阶段复制对象可能影响计数 |
| Profile配置与宿主重启 | 修改阈值时必需 | 启用、阈值和名称范围 | maxCalls=0回退80；需enabled=false关闭 |
| repeat-stop或WSL kit | 非源码必需 | 作者描述的配套策略 | 本插件入口未导入这些包 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认工具名、Agent范围和允许次数 | 不把次数当金额或团队总额 |
| 加载 | 按固定GitHub来源安装到profile后重启 | 轨迹中能识别该guard的阻断文案 |
| 设置 | 用户配置enabled、maxCalls、include/exclude | 配置实际覆盖范围与预期一致 |
| 恢复 | 触顶后总结已有结果、人工决定调阈值或退出 | 不靠不断新建Agent绕过管理目标 |

cordis.patch 注释说后层重定义会替换整个配置对象，因此不能假定局部覆盖保留原排除列表。默认排除job监控和取消入口有利于触顶后观察/终止已启动任务，但没有自动取消逻辑。恢复责任仍属于操作者，插件不保存可恢复的预算账本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主资源；金额未知 | 安装、梳理工具名和预算单位、重启 | 没有实际部署耗时 |
| 持续使用 | 每个执行对象匹配名称及内存计数；总开销未测 | 监控是否过早触顶、维护排除规则 | 不直接追踪模型token或外部任务费用 |
| 失败恢复 | 重试或新会话可能增加模型费用，金额未知 | 总结中间成果、决定取消后台任务或重配 | 没有自动补偿或恢复已完成工作 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 越额拒绝 | guard对被计数调用返回阻断说明 | 宿主集成后的全部停止路径 |
| 无效循环控制 | 工具名称或参数变化仍累计 | 减少无效支出还是中断有价值长任务 |
| 监控可达 | 默认排除三个job管理工具 | 实际工具名是否与部署完全一致 |

阈值低会拒绝必要工作，阈值高可能不能及时阻断昂贵工具。仅有次数并不能对不同工具成本加权，也无法从80这个默认值推断合理ROI。使用者需要将失败和人工接管一起计入总成本，避免“调用更少”掩盖任务完成率降低。

> **思考**：作者的会话预算实际以Agent对象为键，重载和新Agent不共享计数；工具次数也不约束现金与已启动后台工作。对象契约仍不明确，不能当作全局硬预算。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把按Agent累计次数规则接到工具执行前，并保留三个job管理工具的默认例外，能够约束更换名称或参数的持续调用；属于常规计数机制的宿主适配。详见[Q03](#research-q03)。

把按Agent累计次数规则接到工具执行前，并保留三个job管理工具的默认例外，能够约束更换名称或参数的持续调用；属于常规计数机制的宿主适配。详见[Q03](#research-q03)。

代码结构小而清楚。阈值解析和通配匹配与宿主接线分离，适合复用到其他名称筛选护栏。通配规则先转义正则特殊字符，再仅扩展星号；避免把普通配置直接当任意正则。用WeakMap绑定Agent、WeakSet绑定执行对象避免显式永久ID表，但正确性依赖宿主对象身份稳定，移植时必须把这点写为契约。

测试源码覆盖默认及非法阈值、include/exclude、累计到第三次拒绝、禁用不注册、排除工具不计数。apply mock 的 on() 为空，因此这些接线测试没有覆盖post-execute路径或与guard共享对象时的去重，也没有覆盖多个Agent、会话恢复和插件重载。这个覆盖缺口直接影响“per-session”理解，不能只看到测试文件就认为预算语义已验收。

可借鉴的是小型纯函数和单一observe路径，复用代价是重新核对目标宿主的guard返回值、事件顺序、执行对象和Agent生命周期。未运行测试，静态断言仅支持维护意图，不能被记成实际通过。

<a id="detail-section-5"></a>

### 1.4 主要限制

作者的会话预算实际以Agent对象为键，重载和新Agent不共享计数；工具次数也不约束现金与已启动后台工作。对象契约仍不明确，不能当作全局硬预算。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察。适合继续核对局部Agent次数护栏，不适合当团队或现金硬预算；需先确认宿主对象身份、后置事件和恢复工具可达，再讨论阈值。详见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

现有贡献是源码支持的局部工具次数护栏；持久会话与团队总额语义不成立为无条件保证；共享账本是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、lib/budget.js、cordis.patch.yml、test/apply.test.js、test/budget.test.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本完整生产入口与预算纯函数，静态阅读两份测试、README与配置；未核查固定宿主执行对象契约，未运行目标代码。
- 下一步：进一步探讨可先沿固定宿主工具执行链核对对象身份，再用同任务阈值对照记录误拒绝、合格率和人工恢复。

**分析版本**

- **仓库**：[173787247/dsh-tool-budget](https://github.com/173787247/dsh-tool-budget)
- **版本号**：0.1.2（[固定提交 c806416](https://github.com/173787247/dsh-tool-budget/tree/c80641689728dc918a0f6fb03797e98e09a4496e)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探索稳定会话身份下的共享额度预留与恢复账本，先比较团队并发和重载后超额与误拒绝；当前未实现，也可能不值得额外复杂度。详见[Q08](#research-q08)。

进一步探讨可先沿固定宿主工具执行链核对对象身份，再用同任务阈值对照记录误拒绝、合格率和人工恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 216 | — | — | 1137 |
| .js | source | 2 | 100 | 81 | 5 | — |
| .js | test | 2 | 107 | 95 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+created%3A2026-09-22T04%3A42%3A17.734Z..2026-10-22T04%3A42%3A17.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-tool-budget/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A42%3A17.734Z..2026-10-22T04%3A42%3A17.734Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断固定版本工具次数护栏的真实预算单位、贡献和采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种失控调用需要总次数而非重复检测？

**研究主题**：场景与需求

#### 完整回答

面向在 DSH 长任务中担心工具调用持续增长的用户，尤其是工具名称与参数不断改变、因而不构成相同调用循环的场景。作者将插件与 repeat-stop 区分，后者针对连续相同调用，本插件针对被计入的工具调用累计次数。合格结果是阈值内允许、越阈值可观察地拒绝，并为用户保留理解阻断和结束任务的路径。

原有办法包括手工观察轨迹、主动取消任务或依靠既有调度器迭代限制。这里的价值是把计数规则放到工具执行前的 guard，不要求模型自觉服从提示。但是次数不能代表费用。一条 shell 命令可以启动长期进程，一个工具可触发大量外部调用，模型没有调用工具时也可能产生费用。因此它适合给工具活动设局部闸门，不适合独立承担现金预算、团队总额或后台任务的终止。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:35-41](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/README.md#L35-L41)

作者明确不同工具无限调用的需求与80次默认值。

```text
## Why

Repeat-stop catches identical spam. Budget catches “many different tools forever” in one session—useful when long WSL tasks burn API quota.

Default: **80** tracked calls allowed; the **81st** is denied. Job status tools are excluded by default.

This is a **safety rail**, not a product license limit. Raise `maxCalls` or disable if it feels tight.
```

**依据 2 · 源码核查**：[index.js:47-56](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L47-L56)

执行前guard是实际阻断点，后置观察不是取消正在运行的任务。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.tools.guard((exec) => {
    const count = observe(exec);
    if (count === undefined || count <= maxCalls) return undefined;
    return formatBlockMessage(exec.name, maxCalls, count);
  });

  ctx.on("tools/post-execute", async (exec, _result, next) => {
    observe(exec);
    return next();
  });
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置、计数、拦截和后置观察怎样联动？

**研究主题**：功能与机制

#### 完整回答

apply 读取 enabled、maxCalls、include 和 exclude，为当前插件实例创建 WeakMap counts 与 WeakSet counted。observe 先要求 exec.agent 存在且工具命中过滤规则，再以执行对象身份去重，以 agent 对象为键增加计数。guard 调用 observe，计数小于等于 maxCalls 时放行，超过时返回阻断说明。默认80允许计数到80的调用，第81个被计入的执行返回说明。

后置 tools/post-execute 也调用 observe，意图覆盖执行后观察而不重复计数。去重依赖前后阶段收到同一个 exec 对象；同一对象再次进入 observe 会直接返回当前 agent 计数，而不是再增一。它没有按工具参数去重，所以不同参数和相同参数的新执行对象都会计入。

include 非空时先限制命中的名称，再由 exclude 排除；二者冲突时排除优先。通配符只把星号转换为任意字符串，其他正则字符先转义。maxCalls 无效或小于1会回退80，零并不表示关闭；必须 enabled=false 才不安装 guard。默认排除的是 job_output、job_list、job_kill 三个名称，不是源码里一个 job_* 通配符。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:17-56](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L17-L56)

配置、按Agent计数、按exec去重、guard和post-execute完整链路。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx, config = {}) {
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();

  if (!enabled) {
    console.log("[dsh-tool-budget] disabled");
    return;
  }

  console.log(`[dsh-tool-budget] loaded maxCalls=${maxCalls}`);

  ctx.systemPrompt?.section?.({
    name: "plugin:dsh-tool-budget",
    order: 41,
    text: `Tool calls are capped at ${maxCalls} per agent session (dsh-tool-budget). Agent Teams multiplies spend across teammates — keep subagents short or raise maxCalls only when needed.`,
  });

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
  });
```

</details>

**依据 2 · 源码核查**：[lib/budget.js:3-29](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L3-L29)

阈值解析及include/exclude匹配规则。

<details>
<summary>查看原文（27行）</summary>

```text
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
}

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

- 未核查宿主guard和post-execute是否跨阶段保持同一exec对象身份。
  **影响**：若宿主复制执行对象，WeakSet去重不能保证一次执行只增加一次；本研究只确认插件意图。
  **进一步探讨**：继续探讨可从固定宿主版本的工具执行管线入手，逐段核对传递对象及生命周期。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比普通最大迭代数和重复检测增加什么？

**研究主题**：贡献与相对优势

#### 完整回答

源码支持的贡献是一个容易接到DSH工具执行前的、按Agent累计的次数闸门，并允许特定监控工具例外。相较只比对连续相同调用的简单策略，它对“换工具继续循环”仍会累计；相较只给模型一段节制提示，guard 返回值提供宿主侧的拒绝入口。这里的优势来自规则位置和计数对象，而非新的配额算法。

独立纯函数让阈值解析、名称筛选和阻断文案可脱离宿主阅读；WeakMap/WeakSet 利用对象生命周期避免保存永久映射，是小幅工程组合。它没有任务成本模型、全局租约或持久化预算，也未提供每会话ID账本。不能把“累计计数”包装成金额治理创新。

原生宿主若已有等价的全局最大工具次数限制，这个插件的额外价值可能缩小。本次只以手工终止、模型自律和连续相同调用检测作为明确机制参照，没有完成固定宿主原生能力的全量对比，因此不作全生态唯一或优于原生的断言。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:32-50](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L32-L50)

提示仅为引导，guard才是拒绝入口。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.systemPrompt?.section?.({
    name: "plugin:dsh-tool-budget",
    order: 41,
    text: `Tool calls are capped at ${maxCalls} per agent session (dsh-tool-budget). Agent Teams multiplies spend across teammates — keep subagents short or raise maxCalls only when needed.`,
  });

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

**依据 2 · 源码核查**：[lib/budget.js:25-42](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L25-L42)

名称筛选与通用阻断，不包含金额或参数复杂度模型。

<details>
<summary>查看原文（18行）</summary>

```text
export function tracked(toolName, includePatterns, excludePatterns) {
  if (includePatterns.length > 0 && !includePatterns.some((re) => re.test(toolName))) {
    return false;
  }
  return !excludePatterns.some((re) => re.test(toolName));
}

export function nextCount(previous) {
  return (previous ?? 0) + 1;
}

export function formatBlockMessage(toolName, maxCalls, count) {
  return [
    `dsh-tool-budget: blocked ${toolName} after ${maxCalls} tool calls this session.`,
    "Finish with what you have, ask the user, or start a new session.",
    "Agent Teams: this cap is per teammate agent — stop spawning more tools and summarize.",
    `count=${count} maxCalls=${maxCalls}`,
  ].join(" ");
```

</details>

#### 缺口

- 没有对固定宿主版本内置迭代／工具预算能力作同条件对照。
  **影响**：不能确定额外插件相对原生配置的净优势。
  **进一步探讨**：可从宿主自身停止条件、排除规则和团队范围逐项比较，判断是否重复实现。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 每会话硬上限的关键前提成立吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

最关键边界是“会话”在实现里实际由 exec.agent 对象身份代替。counts 的键不是 sessionId；新Agent对象会得到独立预算，插件重新加载也重新创建计数器。源码注释和提示明确指出每个 teammate 各有预算，因此不能把 maxCalls 当作整个人类会话或Agent团队的总上限。对象是否恰好与宿主会话一一对应，仍需要宿主契约支持。

计数只覆盖存在exec.agent且命中过滤规则的执行。排除的状态工具无限调用不耗此预算；一次已放行的shell或后台job也不会因随后触顶被终止。拒绝调用仍先增加计数，反复尝试越额工具会让count继续增长，这不等于执行数或账单金额。当前阻断文案建议开新会话，更凸显它是局部流程护栏，而非防绕过配额。

这些限制不证明小型次数闸门无价值，而是收窄作者“hard-stop per-session”的解释。对团队总支出和费用硬封顶需求，它缺少共享身份、持久化及外部资源取消链；对每个活跃Agent的工具活动限制，源码有明确机制支持。本次未执行绕过或并发复现。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-23](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L12-L23)

作者注释每teammate独立；计数在插件内存且以WeakMap保存。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[index.js:38-50](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L38-L50)

缺Agent或排除工具不计数，拒绝前已增加计数。

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

**依据 3 · 源码核查**：[lib/budget.js:36-42](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L36-L42)

阻断信息建议结束、求助或新会话，并提示团队范围。

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

- 缺少exec.agent与持久会话生命周期的一一对应依据。
  **影响**：不能将局部对象计数提升为持久会话硬预算保证。
  **进一步探讨**：进一步探讨应先核对恢复会话、重载插件、创建子Agent时的对象身份，再选择准确的预算单位。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、依赖和恢复如何操作？

**研究主题**：依赖、兼容与流程

#### 完整回答

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node >=18 | 包声明必需 | ESM与WeakMap/WeakSet | 版本声明不代表宿主兼容已经验证 |
| DSH tools、systemPrompt | 注入声明必需 | 注册guard并给模型预算提示 | 无相应服务接口无法依赖完整接线 |
| exec.agent对象与工具执行对象 | 计数必需 | 确定计数主体和前后去重 | 缺Agent会跳过，跨阶段复制对象可能影响计数 |
| Profile配置与宿主重启 | 修改阈值时必需 | 启用、阈值和名称范围 | maxCalls=0回退80；需enabled=false关闭 |
| repeat-stop或WSL kit | 非源码必需 | 作者描述的配套策略 | 本插件入口未导入这些包 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户确认工具名、Agent范围和允许次数 | 不把次数当金额或团队总额 |
| 加载 | 按固定GitHub来源安装到profile后重启 | 轨迹中能识别该guard的阻断文案 |
| 设置 | 用户配置enabled、maxCalls、include/exclude | 配置实际覆盖范围与预期一致 |
| 恢复 | 触顶后总结已有结果、人工决定调阈值或退出 | 不靠不断新建Agent绕过管理目标 |

cordis.patch 注释说后层重定义会替换整个配置对象，因此不能假定局部覆盖保留原排除列表。默认排除job监控和取消入口有利于触顶后观察/终止已启动任务，但没有自动取消逻辑。恢复责任仍属于操作者，插件不保存可恢复的预算账本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:15-22](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/package.json#L15-L22)

Node和入口声明，无外部运行依赖包。

```text
  "main": "index.js",
  "engines": {
    "node": ">=18"
  },
  "scripts": {
    "test": "node --test test/budget.test.js test/apply.test.js"
  },
  "files": [
```

**依据 2 · 源码核查**：[index.js:9-21](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L9-L21)

声明注入服务并读取名称规则。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-12](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/cordis.patch.yml#L1-L12)

完整默认配置及覆盖语义注释。

<details>
<summary>查看原文（12行）</summary>

```text
# Default dsh-tool-budget config for DeepSeek Harness profiles.
# Later layers that redefine this plugin config replace the whole object.
- insert:
    - id: dsh-tool-budget
      name: dsh-tool-budget
      config:
        enabled: true
        maxCalls: 80
        exclude:
          - job_output
          - job_list
          - job_kill
```

</details>

**依据 4 · 作者声明**：[README.md:43-71](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/README.md#L43-L71)

作者给出安装、重启及配置步骤。

<details>
<summary>查看原文（29行）</summary>

````text
## Install

```sh
dsh plugin --profile web add github:173787247/dsh-tool-budget
```

Restart `dsh web`. No new tool. Blocks show as `dsh-tool-budget: blocked` in Trajectory.

## Config

```yaml
- id: dsh-tool-budget
  name: dsh-tool-budget
  config:
    enabled: true
    maxCalls: 80
    exclude:
      - job_output
      - job_list
      - job_kill
    # include: []   # if set, only these names count
```

| Key | Default | Meaning |
|-----|---------|---------|
| `enabled` | `true` | Master switch |
| `maxCalls` | `80` | Allowed tracked calls per session |
| `exclude` | job_* | Names that do not count |
| `include` | (empty) | If set, only these names count |
````

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 总成本与实际效果能量化吗？

**研究主题**：效果与总成本

#### 完整回答

计量单位应是一次完成用户目标且保留所需恢复能力的任务，不能只以“被挡住多少工具”计算收益。源码显示过滤、对象映射和返回文案的局部机制，没有模型账单、外部服务调用量、执行时长或合格任务记录。因而可以解释节制机制，不能填入节省金额。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 本地宿主资源；金额未知 | 安装、梳理工具名和预算单位、重启 | 没有实际部署耗时 |
| 持续使用 | 每个执行对象匹配名称及内存计数；总开销未测 | 监控是否过早触顶、维护排除规则 | 不直接追踪模型token或外部任务费用 |
| 失败恢复 | 重试或新会话可能增加模型费用，金额未知 | 总结中间成果、决定取消后台任务或重配 | 没有自动补偿或恢复已完成工作 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 越额拒绝 | guard对被计数调用返回阻断说明 | 宿主集成后的全部停止路径 |
| 无效循环控制 | 工具名称或参数变化仍累计 | 减少无效支出还是中断有价值长任务 |
| 监控可达 | 默认排除三个job管理工具 | 实际工具名是否与部署完全一致 |

阈值低会拒绝必要工作，阈值高可能不能及时阻断昂贵工具。仅有次数并不能对不同工具成本加权，也无法从80这个默认值推断合理ROI。使用者需要将失败和人工接管一起计入总成本，避免“调用更少”掩盖任务完成率降低。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:18-23](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L18-L23)

预算单位是次数和局部对象，缺少费用字段。

```text
  const enabled = config.enabled !== false;
  const maxCalls = readMaxCalls(config.maxCalls);
  const excludePatterns = toPatterns(config.exclude ?? ["job_output", "job_list", "job_kill"]);
  const includePatterns = toPatterns(config.include ?? []);
  const counts = new WeakMap();
  const counted = new WeakSet();
```

**依据 2 · 源码核查**：[index.js:38-55](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L38-L55)

计数和阻断的直接机制。

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

**依据 3 · 源码核查**：[lib/budget.js:36-42](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L36-L42)

触顶后交由总结、用户决策或新会话。

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

- 没有同一批合格任务的完成率、模型账单和人工恢复时间。
  **影响**：无法判断阈值带来的净成本效果，也不能确定默认80适合哪些工作。
  **进一步探讨**：可对照无插件和多个阈值，按同任务记录成功率、总费用、取消成本和人工时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 哪些实现可借鉴，测试覆盖到哪里？

**研究主题**：工程质量与复用

#### 完整回答

代码结构小而清楚。阈值解析和通配匹配与宿主接线分离，适合复用到其他名称筛选护栏。通配规则先转义正则特殊字符，再仅扩展星号；避免把普通配置直接当任意正则。用WeakMap绑定Agent、WeakSet绑定执行对象避免显式永久ID表，但正确性依赖宿主对象身份稳定，移植时必须把这点写为契约。

测试源码覆盖默认及非法阈值、include/exclude、累计到第三次拒绝、禁用不注册、排除工具不计数。apply mock 的 on() 为空，因此这些接线测试没有覆盖post-execute路径或与guard共享对象时的去重，也没有覆盖多个Agent、会话恢复和插件重载。这个覆盖缺口直接影响“per-session”理解，不能只看到测试文件就认为预算语义已验收。

可借鉴的是小型纯函数和单一observe路径，复用代价是重新核对目标宿主的guard返回值、事件顺序、执行对象和Agent生命周期。未运行测试，静态断言仅支持维护意图，不能被记成实际通过。

#### 证据与依据

**依据 1 · 源码核查**：[lib/budget.js:15-33](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L15-L33)

名称模式和计数纯函数分离。

<details>
<summary>查看原文（19行）</summary>

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
}

export function nextCount(previous) {
  return (previous ?? 0) + 1;
```

</details>

**依据 2 · 源码核查**：[test/apply.test.js:5-15](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/test/apply.test.js#L5-L15)

mock on为空，明确未验证后置钩子。

<details>
<summary>查看原文（11行）</summary>

```text
function mockCtx() {
  const guards = [];
  return {
    tools: {
      guard(fn) {
        guards.push(fn);
      },
    },
    on() {},
    guards,
  };
```

</details>

**依据 3 · 源码核查**：[test/apply.test.js:22-48](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/test/apply.test.js#L22-L48)

测试集中于guard、禁用和排除。

<details>
<summary>查看原文（27行）</summary>

```text
describe("apply", () => {
  it("blocks after maxCalls distinct or repeated tools", () => {
    const ctx = mockCtx();
    apply(ctx, { maxCalls: 2, exclude: [] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "bash", { command: "a" })), undefined);
    assert.equal(guard(call(agent, "bash", { command: "b" })), undefined);
    assert.match(guard(call(agent, "read_file", { path: "x" })), /blocked read_file after 2/);
  });

  it("does not install a guard when disabled", () => {
    const ctx = mockCtx();
    apply(ctx, { enabled: false });
    assert.equal(ctx.guards.length, 0);
  });

  it("skips excluded tools", () => {
    const ctx = mockCtx();
    apply(ctx, { maxCalls: 1, exclude: ["job_*"] });
    const agent = {};
    const guard = ctx.guards[0];
    assert.equal(guard(call(agent, "job_list")), undefined);
    assert.equal(guard(call(agent, "bash")), undefined);
    assert.match(guard(call(agent, "bash")), /blocked bash after 1/);
  });
});
```

</details>

**依据 4 · 源码核查**：[test/budget.test.js:11-43](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/test/budget.test.js#L11-L43)

阈值和筛选用例可查，但不是宿主验收。

<details>
<summary>查看原文（33行）</summary>

```text
describe("readMaxCalls", () => {
  it("defaults and rejects non-positive", () => {
    assert.equal(readMaxCalls(undefined), 80);
    assert.equal(readMaxCalls(0), 80);
    assert.equal(readMaxCalls(12), 12);
  });

  it("rejects non-integers and empty string", () => {
    assert.equal(readMaxCalls(1.5), 80);
    assert.equal(readMaxCalls(""), 80);
    assert.equal(readMaxCalls("nope"), 80);
    assert.equal(readMaxCalls(-3), 80);
  });
});

describe("tracked", () => {
  it("honors exclude wildcards", () => {
    const exclude = toPatterns(["job_*"]);
    assert.equal(tracked("job_list", [], exclude), false);
    assert.equal(tracked("bash", [], exclude), true);
  });

  it("honors include when set", () => {
    const include = toPatterns(["bash", "net_*"]);
    assert.equal(tracked("bash", include, []), true);
    assert.equal(tracked("net_doctor", include, []), true);
    assert.equal(tracked("read_file", include, []), false);
  });

  it("treats non-array patterns as empty", () => {
    assert.deepEqual(toPatterns(null), []);
    assert.equal(tracked("bash", [], []), true);
  });
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 从每Agent局部预算能推导什么新设计？

**研究主题**：新假设与验证

#### 完整回答

可以探索显式的会话预算账本与工具预留设计，仍属于未实现假设。起点是当前每个Agent的计数分离，团队越多总调用可越多，且插件重载后内存预算消失。若目标确为用户会话总额，应先规定稳定sessionId与父子关系，再让所有相关Agent向同一个账本申请工具额度。

与现在按执行对象加一相比，预留需要定义放行、拒绝、执行失败、重试和退出的状态归属，避免并发双花或失败重复扣款。若要限制金额还要接真实费用计量，不能只给工具名乘任意权重。共享账本增加持久化、锁和恢复复杂度，可能对只需个人次数提醒的人得不偿失。

最小验证可在可控执行流中安排两个Agent并发调用，穿插重载、恢复及被拒绝后的重试，比较局部计数和共享账本是否能保持同一总额度。验收包括从不越额、没有重复扣记、取消/恢复结果可解释，并记录延迟。若复杂度显著增加但没有降低实际超额或误拒绝，应否定净价值假设。此方向不计入现有贡献评分。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:12-23](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L12-L23)

明确每Agent独立内存预算，支撑共享账本假设的起点。

<details>
<summary>查看原文（12行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[index.js:38-50](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L38-L50)

当前不存在预留/提交状态，仅观察对象并立即累加。

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

#### 缺口

- 共享预算是否符合真实用户任务和恢复需求尚无证据。
  **影响**：假设不能提升本插件现有预算范围或采用成熟度。
  **进一步探讨**：可先比较单Agent与团队任务的实际超额模式，再决定是否承担持久化账本的复杂度。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪类用户可试用，何时应停用？

**研究主题**：采用判断

#### 完整回答

建议结论为观察。对只想限制一个活跃Agent累计工具调用的本地使用者，它有清楚的简单机制；但作者每会话措辞依赖Agent对象生命周期，当前没有固定宿主契约支持，也没有完成原生停止条件对照。把它当作会话现金硬预算或团队总额保护会高估范围，因此本轮不直接进入推荐试用名单。

若读者继续评估，应先用自己的固定宿主核对Agent和执行对象在guard、post-execute、恢复会话及团队中的身份，确认预算单位，再用一组有明确交付标准的任务选择阈值。必须保留能取消后台任务的入口，触顶后要能总结中间结果。若必要恢复工具被排除规则误伤、同一调用重复计数或新建Agent轻易改变管理目标，应停止依赖它提供总预算保证。

现有证据只支持源码级解释，没有安装、核心功能及禁用验收，不能给值得安装结论。创新分也不能替代采用证据。后续若对象契约、原生对照和任务成本边界澄清，可将判断提升为有条件试用；不需要为了保留简单护栏而实现未经确认的全局计费系统。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:38-55](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/index.js#L38-L55)

对象身份与过滤是实际计数前提。

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

**依据 2 · 源码核查**：[lib/budget.js:36-42](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/lib/budget.js#L36-L42)

阻断后退出/求助路径需要人负责。

```text
export function formatBlockMessage(toolName, maxCalls, count) {
  return [
    `dsh-tool-budget: blocked ${toolName} after ${maxCalls} tool calls this session.`,
    "Finish with what you have, ask the user, or start a new session.",
    "Agent Teams: this cap is per teammate agent — stop spawning more tools and summarize.",
    `count=${count} maxCalls=${maxCalls}`,
  ].join(" ");
```

**依据 3 · 源码核查**：[test/apply.test.js:5-15](https://github.com/173787247/dsh-tool-budget/blob/c80641689728dc918a0f6fb03797e98e09a4496e/test/apply.test.js#L5-L15)

当前静态测试mock未覆盖后置事件契约。

<details>
<summary>查看原文（11行）</summary>

```text
function mockCtx() {
  const guards = [];
  return {
    tools: {
      guard(fn) {
        guards.push(fn);
      },
    },
    on() {},
    guards,
  };
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
