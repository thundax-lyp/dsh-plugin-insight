# DSH 统计工具

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-toolkit)
<!-- END META -->

> **功能**：为 DSH 提供显式有限数值数组的描述统计、百分位、频数和 Pearson 或 Spearman 相关计算。

> **亮点**：把小样本的方差、分位数、频数和相关计算集中到一个 DSH 工具，并明确返回零方差、溢出和截断边界。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：同步计算的长度上限不等于可以抢占执行，也不证明接近上限的数组在目标宿主可顺畅处理。[Q02](#research-q02)

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
  - [Q01 · 统计一组服务延迟需要复查均值、样本方差和百分位时，工具实际做了什么？](#detail-section-11)
  - [Q02 · 常量列相关、无效数据和高基数频数是否会用普通数值掩盖失败？](#detail-section-12)
  - [Q03 · 何时用会话内统计划算，如何避免样本口径误选？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DSH 的测试或数据分析人员，可用一小组已知样本核对延迟分布或成对相关。

现有表格或脚本可完成同一统计。对可以列出的短数组，工具减少模型心算和临时编写统计脚本的步骤。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 描述统计 | 核对均值、范围及离散性 | 区分样本和总体 |
| 百分位 | 核对延迟阈值 | 指定百分比，按线性插值 |
| 频数 | 观察数值分布 | 高基数输出可被截断 |
| 相关 | 比较配对样本联系 | 常量列无定义，结果不说明因果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Cordis 与 tools peers | 是 | 向 DSH 注册 stat | 宿主解析失败 |
| 有限数值数组 | 是 | 作为统计输入 | 不合规时报错 |
| 等长配对数组 | 相关计算需要 | 基于位置关联样本 | 不等长或不足两项不计算 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 加载 | 用户将固定子包加到隔离 profile | 工具列表有 stat |
| 试算 | 先比较几个已知数值的均值和方差 | 样本口径及值一致 |
| 退出 | 根据截断或数据质量转回已有脚本 | 保留完整数据和脚本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 未测 | 核对 profile、宿主和小样本 | 历史兼容仅作者陈述 |
| 持续 | 数组和排序占用内存，金额未知 | 核对统计定义、数据和显示 | 近上限性能未知 |
| 恢复 | 未测 | 改用已验证脚本重算 | 避免误把部分频数当全量 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 从样本计算分布 | 部分统计采用明确方差与分位定义 | 真实任务准确率和节时 |
| 识别异常输入 | 有有限数组、规模和溢出保护 | 最大可用吞吐量 |

> **思考**：同步计算的长度上限不等于可以抢占执行，也不证明接近上限的数组在目标宿主可顺畅处理。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把小样本的方差、分位数、频数和相关计算集中到一个 DSH 工具，并明确返回零方差、溢出和截断边界。[Q01](#research-q01) [Q02](#research-q02)

保留固定计算定义和结构化失败。同步执行、有限精度和频数截断是结果解释的一部分。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

同步计算的长度上限不等于可以抢占执行，也不证明接近上限的数组在目标宿主可顺畅处理。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

用明确口径的小数组试统计，核对实际参数和输出。数据来自多个文件或需要大样本时，沿用可重放的脚本。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码的统计口径、输入和失败分支已核查；宿主兼容、浮点极端样例和负载未运行。

- 已检查：作者 README、包清单、源码路径 packages/dsh-tool-stat/package.json、packages/dsh-tool-stat/cordis.patch.yml、packages/dsh-tool-stat/lib/index.js、packages/dsh-tool-stat/lib/describe.js、packages/dsh-tool-stat/lib/validate.js、packages/dsh-tool-stat/lib/correlation.js、packages/dsh-tool-stat/lib/frequency.js、packages/dsh-tool-stat/README.md 及固定范围 inventory；组件：packages/dsh-tool-stat。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只核查固定统计子包的分发、工具入口与主要算法。未运行宿主、模型任务、压力用例或上游测试。
- 下一步：对照固定脚本的五个整数、两列常量、非有限输入和高基数输入，记录请求使用的样本口径以及异常输出。

**分析版本**

- **仓库**：[omdsh-dev/dsh-toolkit](https://github.com/omdsh-dev/dsh-toolkit)
- **版本号**：0.0.1（[固定提交 c3319d9](https://github.com/omdsh-dev/dsh-toolkit/tree/c3319d9d3e78a18191e1381461b69e84bc547575)）
- **版本日期**：2026-09-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可随结果提供团队所选的分位算法与样本口径，使用同一批容易混淆的输入，验证是否减少复查错误。[Q03](#research-q03)

对照固定脚本的五个整数、两列常量、非有限输入和高基数输入，记录请求使用的样本口径以及异常输出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 493 | 363 | 131 | — |
| .md | source | 2 | 275 | — | — | 2671 |
| .ts | source | 7 | 620 | 429 | 140 | — |
| .ts | test | 6 | 676 | 588 | 8 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-14），可前往 [GitHub Issues](https://github.com/omdsh-dev/dsh-toolkit/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：一组显式样本如何获得可复核的描述统计，什么条件下应改用现有脚本？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统计一组服务延迟需要复查均值、样本方差和百分位时，工具实际做了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

独立 bundle 补丁挂载包出口，工具注册注入 DSH 的 tools。stat 对调用参数先验证，再分发到四类计算。describe 用 Neumaier 补偿求和，再用 Welford 二阶矩求方差，sample=true 时走 n−1，否则走 n。百分位先排序副本，再按 h=(n−1)p 插值，其中百分比参数除以 100 变为 p；调用顺序和重复请求保留。对于明确定义的数据，这比让模型心算有可重复的函数路径。原有脚本或表格若已经提供这套定义，计算本身仍可复用它们。增量是让 DSH 对显式数组调用已写好的计算和参数结构。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-stat/package.json:21-37](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/package.json#L21-L37)

宿主依赖、清单补丁与实际出口。

<details>
<summary>查看原文（17行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/dsh-tools": ">=0.0.1-rc.1 <0.2.0",
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-stat/cordis.patch.yml:1-4](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/cordis.patch.yml#L1-L4)

插入独立子包的挂载行。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack (0806+).
- insert:
    - id: tool-stat
      name: '@deepseek-ai/dsh-tool-stat'
```

**依据 3 · 源码核查**：[packages/dsh-tool-stat/lib/index.js:23-59](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/index.js#L23-L59)

工具注册和校验后的动作分派。

<details>
<summary>查看原文（37行）</summary>

```text
export const name = '@deepseek-ai/dsh-tool-stat';
export const inject = ['tools'];
/**
 * `stat` 工具入口：校验参数后按 action 分发。
 * 校验失败抛 `stat: ...` 错误；计算结果溢出抛 `numeric-overflow` 错误。
 */
export function runStatAction(args) {
    const { action, values, other, percentiles, method, sample } = validateStatArgs(args);
    switch (action) {
        case 'describe':
            return describeValues(values, sample);
        case 'percentile':
            return percentileValues(values, percentiles);
        case 'frequency':
            return frequencyValues(values);
        case 'correlation':
            return correlationValues(values, other, method);
    }
}
export function apply(ctx) {
    ctx.tools.register(defineTool({
        name: 'stat',
        description: 'Deterministic statistics over explicit finite numeric arrays. ' +
            'Actions: describe (count/sum/min/max/mean/median/variance/standardDeviation/q1/q3/iqr, ' +
            'Neumaier compensated sum + Welford variance, population or sample), ' +
            'percentile (one or more percentiles 0..100, linear interpolation h=(n-1)*p, output keeps request order, duplicates kept), ' +
            'frequency (value/count/ratio grouped by strict equality, ascending output, ratio denominators use the original count), ' +
            'correlation (Pearson or Spearman midrank; zero-variance pairs return defined=false with reason "zero-variance"). ' +
            'Rejects NaN/Infinity; -0 is normalized to 0; inputs are never modified; results are re-checked for finiteness ' +
            '(numeric-overflow errors are returned instead of emitting non-finite JSON). ' +
            'Limits: 1..100000 observations, at most 100 percentiles, at most 10000 distinct output entries.',
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['describe', 'percentile', 'frequency', 'correlation'],
                description: 'Operation to perform.',
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-stat/lib/describe.js:16-43](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/describe.js#L16-L43)

补偿求和和 Welford 二阶矩。

<details>
<summary>查看原文（28行）</summary>

```text
/** Neumaier compensated summation。 */
export function compensatedSum(values) {
    let sum = 0;
    let compensation = 0;
    for (const v of values) {
        const t = sum + v;
        if (Math.abs(sum) >= Math.abs(v)) {
            compensation += (sum - t) + v;
        }
        else {
            compensation += (v - t) + sum;
        }
        sum = t;
    }
    return sum + compensation;
}
/** Welford 在线均值/二阶矩：返回 mean 与 M2（Σ(x-mean)²）。 */
export function welford(values) {
    let count = 0;
    let mean = 0;
    let m2 = 0;
    for (const v of values) {
        count++;
        const delta = v - mean;
        mean += delta / count;
        m2 += delta * (v - mean);
    }
    return { mean, m2 };
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-stat/lib/describe.js:79-107](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/describe.js#L79-L107)

样本及总体方差、分位数的输出。

<details>
<summary>查看原文（29行）</summary>

```text
/** describe action。`sample=false` 用 n 分母，`sample=true` 用 n-1 分母。 */
export function describeValues(values, sample) {
    const n = values.length;
    const sum = compensatedSum(values);
    // 设计契约：均值由 compensated sum / n 得到；Welford 仅用于方差（M2）
    const mean = sum / n;
    const { m2 } = welford(values);
    const variance = m2 / (sample ? n - 1 : n);
    const sorted = sortedCopy(values);
    const q1 = percentileAt(sorted, 0.25);
    const median = percentileAt(sorted, 0.5);
    const q3 = percentileAt(sorted, 0.75);
    const standardDeviation = Math.sqrt(variance);
    const iqr = q3 - q1;
    assertFinite({ sum, mean, variance, standardDeviation, q1, median, q3, iqr }, 'describe');
    return {
        action: 'describe',
        count: n,
        sum: normalizeZero(sum),
        min: normalizeZero(sorted[0]),
        max: normalizeZero(sorted[n - 1]),
        mean: normalizeZero(mean),
        median: normalizeZero(median),
        variance: normalizeZero(variance),
        standardDeviation: normalizeZero(standardDeviation),
        q1: normalizeZero(q1),
        q3: normalizeZero(q3),
        iqr: normalizeZero(iqr),
        sample,
```

</details>

**依据 6 · 源码核查**：[packages/dsh-tool-stat/lib/describe.js:110-122](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/describe.js#L110-L122)

分位数输入顺序与插值换算。

<details>
<summary>查看原文（13行）</summary>

```text
/** percentile action。输出保持调用方传入顺序，重复项不去重。 */
export function percentileValues(values, percentiles) {
    const sorted = sortedCopy(values);
    const entries = percentiles.map((p) => ({
        percentile: normalizeZero(p),
        value: normalizeZero(percentileAt(sorted, p / 100)),
    }));
    for (const e of entries) {
        if (!Number.isFinite(e.value)) {
            throw new Error('stat: numeric-overflow: percentile produced a non-finite value');
        }
    }
    return { action: 'percentile', count: values.length, percentiles: entries };
```

</details>

#### 缺口

- 实际宿主加载和结果传到模型的样式未验证
  **影响**：不能判断目标 DSH 是否可读到原数值和参数
  **进一步探讨**：在隔离 profile 选择一组已知整数，检查原始工具返回与模型展示

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 常量列相关、无效数据和高基数频数是否会用普通数值掩盖失败？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑、功能与机制

#### 完整回答

验证器要求有限数值、非空且最多 100000 个观测，拒绝字符串和无穷值，归一化负零；相关要求等长配对且至少两点。常量列使二阶矩为零时返回 defined=false 与 null，并标明原因。Spearman 对两列分别求中秩后使用 Pearson 路径。频数超过 10000 个不同值时按频数降序、值升序取前项，最终按值排序并返回 truncated，比例仍以原观测数作分母，不能把保留条目当全分布。Describe 检查非有限输出，但补偿和检查并不提供任意精度。运行仍为同步计算，工具的协作超时不能抢占排序或循环，输入限额才是这条链的前置资源限制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-stat/lib/validate.js:13-38](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/validate.js#L13-L38)

有限数与规模限制、归一化。

<details>
<summary>查看原文（26行）</summary>

```text
/** 最大观测数（主保险丝；同步 CPU 计算无法被协作式 timeout 真正中断）。 */
export const MAX_OBSERVATIONS = 100000;
/** 单次最多请求的百分位数个数。 */
export const MAX_PERCENTILES = 100;
/** frequency 最多输出的 distinct 项数。 */
export const MAX_DISTINCT = 10000;
/** `-0` 规范化为 `0`；其余原样返回。 */
export function normalizeZero(v) {
    return Object.is(v, -0) ? 0 : v;
}
function checkFiniteNumbers(arr, what) {
    if (!Array.isArray(arr))
        throw new Error(`stat: ${what} must be an array of numbers`);
    for (let i = 0; i < arr.length; i++) {
        const v = arr[i];
        if (typeof v !== 'number' || !Number.isFinite(v)) {
            throw new Error(`stat: ${what}[${i}] must be a finite number (got ${String(v)})`);
        }
    }
}
/** 复制并把 -0 归一化为 0（不修改输入数组）。 */
function normalizedCopy(arr) {
    const out = new Array(arr.length);
    // i < arr.length 保证下标在界内
    for (let i = 0; i < arr.length; i++)
        out[i] = normalizeZero(arr[i]);
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-stat/lib/validate.js:55-86](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/validate.js#L55-L86)

数据和配对验证。

<details>
<summary>查看原文（32行）</summary>

```text
    const statAction = action;
    const values = raw.values;
    if (!Array.isArray(values))
        throw new Error('stat: values must be an array of numbers');
    if (values.length < 1)
        throw new Error('stat: values must contain at least 1 number');
    if (values.length > MAX_OBSERVATIONS) {
        throw new Error(`stat: values exceeds the ${MAX_OBSERVATIONS} observation limit`);
    }
    checkFiniteNumbers(values, 'values');
    const sample = raw.sample === true;
    const method = raw.method === 'spearman' ? 'spearman' : 'pearson';
    if (raw.method !== undefined && raw.method !== 'pearson' && raw.method !== 'spearman') {
        throw new Error('stat: method must be pearson or spearman');
    }
    if (statAction === 'describe' && sample && values.length < 2) {
        throw new Error('stat: sample variance requires at least 2 values');
    }
    let other;
    if (statAction === 'correlation') {
        const rawOther = raw.other;
        if (!Array.isArray(rawOther)) {
            throw new Error('stat: correlation requires the other array of paired observations');
        }
        if (rawOther.length !== values.length) {
            throw new Error(`stat: other must have the same length as values (got ${rawOther.length}, expected ${values.length})`);
        }
        if (rawOther.length < 2) {
            throw new Error('stat: correlation requires at least 2 paired observations');
        }
        checkFiniteNumbers(rawOther, 'other');
        other = normalizedCopy(rawOther);
```

</details>

**依据 3 · 源码核查**：[packages/dsh-tool-stat/lib/correlation.js:36-73](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/correlation.js#L36-L73)

相关的数值与常量结果分支。

<details>
<summary>查看原文（38行）</summary>

```text
function pearsonCore(method, x, y) {
    const n = x.length;
    let meanX = 0;
    let meanY = 0;
    let m2x = 0;
    let m2y = 0;
    let cov = 0;
    for (let i = 0; i < n; i++) {
        // x/y 等长且长度 n，下标在界内；取局部变量避免重复下标访问
        const xi = x[i];
        const yi = y[i];
        const dx = xi - meanX;
        meanX += dx / (i + 1);
        const dy = yi - meanY;
        meanY += dy / (i + 1);
        m2x += dx * (xi - meanX);
        m2y += dy * (yi - meanY);
        cov += dx * (yi - meanY);
    }
    if (m2x === 0 || m2y === 0) {
        return { action: 'correlation', method, count: n, defined: false, value: null, reason: 'zero-variance' };
    }
    const denom = Math.sqrt(m2x * m2y);
    if (!Number.isFinite(denom) || !Number.isFinite(cov)) {
        throw new Error('stat: numeric-overflow: correlation produced a non-finite value');
    }
    const value = cov / denom;
    if (!Number.isFinite(value)) {
        throw new Error('stat: numeric-overflow: correlation produced a non-finite value');
    }
    return { action: 'correlation', method, count: n, defined: true, value: normalizeZero(value), reason: null };
}
/** correlation action。`method='spearman'` 时先对两序列分别做 midrank。 */
export function correlationValues(x, y, method) {
    if (method === 'spearman') {
        return pearsonCore(method, midranks(x), midranks(y));
    }
    return pearsonCore(method, x, y);
```

</details>

**依据 4 · 源码核查**：[packages/dsh-tool-stat/lib/frequency.js:21-55](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/frequency.js#L21-L55)

截断选择及全体比例分母。

<details>
<summary>查看原文（35行）</summary>

```text
    const total = values.length;
    const entries = [];
    for (const [value, count] of counts) {
        const ratio = count / total;
        if (!Number.isFinite(ratio)) {
            throw new Error('stat: numeric-overflow: frequency produced a non-finite ratio');
        }
        entries.push({ value: normalizeZero(value), count, ratio });
    }
    const truncated = entries.length > MAX_DISTINCT;
    let selected;
    if (truncated) {
        // 先按 count 降序、再按 value 升序选择前 MAX_DISTINCT 项
        selected = entries
            .slice()
            .sort((a, b) => b.count - a.count || a.value - b.value)
            .slice(0, MAX_DISTINCT);
    }
    else {
        selected = entries;
    }
    // 最终按数值升序稳定呈现
    selected.sort((a, b) => a.value - b.value);
    let returnedRatio = 0;
    for (const e of selected)
        returnedRatio += e.ratio;
    return {
        action: 'frequency',
        count: total,
        distinctTotal: entries.length,
        distinctReturned: selected.length,
        truncated,
        returnedRatio,
        entries: selected,
    };
```

</details>

**依据 5 · 源码核查**：[packages/dsh-tool-stat/lib/index.js:87-97](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/index.js#L87-L97)

真正同步计算，再包装 Promise。

<details>
<summary>查看原文（11行）</summary>

```text
        output: {
            schema: { type: 'json' },
            render: (_args, value) => [{ type: 'text', text: JSON.stringify(value) }],
        },
        execute: (args) => {
            // 非 async：同步计算 + Promise.resolve；结果接口无隐式索引签名，
            // 经 unknown 双断言转换为 canonical JsonValue（数值输出已保证有限）。
            return Promise.resolve(runStatAction(args));
        },
        timeoutMs: 2000,
    }));
```

</details>

#### 缺口

- 接近上限时的响应时间、内存和事件循环影响未知
  **影响**：不能将上限当吞吐保证或事件循环隔离
  **进一步探讨**：在独占宿主用递增数组并测正常会话延迟

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时用会话内统计划算，如何避免样本口径误选？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适用于已有 DSH 且需要核对一小组数值的人。先用五个已知值对照已有统计脚本，分别检查样本与总体方差，再用全常量列看模型是否保留 undefined 语义。该工具不能自行从文件取列或校正采样偏差，读数据之前的选择和解释由用户负责。首次需核对 peer 与真实调用入口，持续成本包括把数组送进工具、模型续写与人工核对；未测现金与时间。对巨大数据、缺列或需要高级统计时回到可保留数据与方法的脚本。可在输出增加一份短的计算口径回执，确认作者定义之外的团队默认值，例如分位算法和样本设定。若模型已能稳定使用当前 sample 字段，或回执不能减少复查误差，这个改动的收益不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-tool-stat/lib/index.js:54-85](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/index.js#L54-L85)

动作、配对和样本选项在工具定义中。

<details>
<summary>查看原文（32行）</summary>

```text
        parameters: {
            action: {
                type: 'string',
                required: true,
                enum: ['describe', 'percentile', 'frequency', 'correlation'],
                description: 'Operation to perform.',
            },
            values: {
                type: 'array',
                required: true,
                items: { type: 'number' },
                description: 'Finite numeric observations (1..100000). -0 is normalized to 0.',
            },
            other: {
                type: 'array',
                items: { type: 'number' },
                description: 'Paired observations for correlation; must have the same length as values (at least 2).',
            },
            percentiles: {
                type: 'array',
                items: { type: 'number' },
                description: 'Percentiles in 0..100 for percentile (1..100 items); output keeps request order.',
            },
            method: {
                type: 'string',
                enum: ['pearson', 'spearman'],
                description: 'Correlation method (default pearson).',
            },
            sample: {
                type: 'boolean',
                description: 'Use the sample (n-1) variance denominator (default false = population).',
            },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-tool-stat/lib/describe.js:79-108](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/lib/describe.js#L79-L108)

输出含 sample，现有结果已提供部分口径。

<details>
<summary>查看原文（30行）</summary>

```text
/** describe action。`sample=false` 用 n 分母，`sample=true` 用 n-1 分母。 */
export function describeValues(values, sample) {
    const n = values.length;
    const sum = compensatedSum(values);
    // 设计契约：均值由 compensated sum / n 得到；Welford 仅用于方差（M2）
    const mean = sum / n;
    const { m2 } = welford(values);
    const variance = m2 / (sample ? n - 1 : n);
    const sorted = sortedCopy(values);
    const q1 = percentileAt(sorted, 0.25);
    const median = percentileAt(sorted, 0.5);
    const q3 = percentileAt(sorted, 0.75);
    const standardDeviation = Math.sqrt(variance);
    const iqr = q3 - q1;
    assertFinite({ sum, mean, variance, standardDeviation, q1, median, q3, iqr }, 'describe');
    return {
        action: 'describe',
        count: n,
        sum: normalizeZero(sum),
        min: normalizeZero(sorted[0]),
        max: normalizeZero(sorted[n - 1]),
        mean: normalizeZero(mean),
        median: normalizeZero(median),
        variance: normalizeZero(variance),
        standardDeviation: normalizeZero(standardDeviation),
        q1: normalizeZero(q1),
        q3: normalizeZero(q3),
        iqr: normalizeZero(iqr),
        sample,
    };
```

</details>

**依据 3 · 作者声明**：[packages/dsh-tool-stat/README.md:83-90](https://github.com/omdsh-dev/dsh-toolkit/blob/c3319d9d3e78a18191e1381461b69e84bc547575/packages/dsh-tool-stat/README.md#L83-L90)

作者的历史宿主与消费验证声明。

```text
## DSH 0.1.5-rc.1 兼容（已验证）

本插件已迁移到 DSH 0.1.5-rc.1 依赖线，并在 `local harness 0.1.5-rc.1`（npm 私有包）的隔离 consumer 中完成全链路验证：

- **类型/运行时**：peer 为 `@deepseek-ai/cordis: ^4.0.1` + `@deepseek-ai/dsh-tools: >=0.0.1-rc.1 <0.2.0` + `@deepseek-ai/dsh-invariants: >=0.0.1-rc.1 <0.2.0`；不再依赖 unscoped `cordis`
- **独立构建**：`npm install`（devDependencies 自包含 typescript/vitest/@types/node）→ `npm run typecheck` → `npm test` → `npm run build` → `npm pack`
- **消费验证**：tarball 装入 DSH 0.1.5-rc.1（npm）consumer → `dsh --profile compat --dump-config` 出现本插件 row → 工具真实注册与执行通过
- **启动方式**：`npx -p @deepseek-ai/dsh@next dsh web`（lib 生产模式；勿 `install -g` 全局安装）
```

#### 缺口

- 未比较已装工具与团队现有脚本的准确率和人工耗时
  **影响**：不能判断单位合格检查成本是否下降
  **进一步探讨**：统一小样本、脚本和输出判据，逐项记录口径错误与复查耗时

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
