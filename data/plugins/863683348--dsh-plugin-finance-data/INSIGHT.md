# dsh-plugin-finance-data

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[0a10267](https://github.com/863683348/dsh-plugin-finance-data/tree/0a10267fa6f8f75da68005406b899894b60dd796)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data)
<!-- END META -->

> **实现功能**：DSH Agent 的确定性金融算术工具，但比率文本、跨年定投和组合再平衡路径存在可核不一致。

> **核心亮点**：将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](#research-q01)。

> **风险与缺陷**：四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 工具包实际提供什么？](#detail-section-11)
  - [Q02 · 比率百分数输出是否准确？](#detail-section-12)
  - [Q03 · 定投和组合动作是否兑现描述？](#detail-section-13)
  - [Q04 · 怎样安全采用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：Agent 在有已核来源/口径的数字上做格式化、收益与风险计算。

模型自行计算或电子表格；工具可重复，但当前关键输出不可靠。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 当前边界 |
| --- | --- | --- |
| 比率 | 财务分析 | 百倍展示错误 |
| 定投 | 长期规划 | 默认只算 12 期 |
| 组合 | 漂移评估 | 未返回交易指令 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH tools/systemPrompt | Agent 调用 | 无工具入口 |
| 已核金融输入 | 正确解释 | 结果无事实根基 |
| 黄金样本 | 公式回归 | 错误易扩散 |

#### 修复验证

| 步骤 | 输入 | 判据 |
| --- | --- | --- |
| 比率 | 10/100 | 10% |
| 定投 | 两年月投 | 24 期终值 |
| 组合 | 60/40 目标与偏离 | 给出买卖金额 |

**效果与成本**

#### 成本

| 阶段 | 资源 | 边界 |
| --- | --- | --- |
| 输入 | 经核口径数字 | 无行情来源 |
| 核算 | 黄金样本复核 | 当前三个关键错误 |
| 维护 | 单位/期数测试 | 金融输出需严格可靠 |

#### 效果

| 项 | 源码支持 | 问题 |
| --- | --- | --- |
| 比率 | 纯函数 | 展示百倍 |
| 定投 | 周期循环 | 默认截断 12 期 |
| 组合 | 权重/独立再平衡函数 | 工具未接再平衡 |

> **思考**：四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](#research-q01)。

将常见财务算术从模型口算转为确定性工具，并提示数据来源/口径。详见[Q01](#research-q01)。

工具将 10 类 action 派到纯函数；比率展示、plan steps 和 portfolio 接线存在分层契约不一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

四类财务比率在计算层和展示层各乘 100；多年 plan 默认只算 12 期，portfolio 未返回再平衡单。详见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

修复关键路径前不用于真实决策；以 10/100 比率、2 年月投和组合偏离样本验每个 action。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认纯算术工具与 10 类 action；百分数百倍展示、定投默认仅 12 期和再平衡函数未接工具属于明确代码路径问题。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、lib/index.js、lib/finance.js、test/finance.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态审阅 README.zh、finance.js、index.js，未执行插件或进行投资/市场数据核验。
- 下一步：修复后对所有 action 做单位、期数、边界和黄金样本核对，再到目标宿主复验文本/结构值。

**分析版本**

- **仓库**：[863683348/dsh-plugin-finance-data](https://github.com/863683348/dsh-plugin-finance-data)
- **版本号**：0.3.2（[固定提交 0a10267](https://github.com/863683348/dsh-plugin-finance-data/tree/0a10267fa6f8f75da68005406b899894b60dd796)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

统一单位契约并分离最终计算与表格采样，配黄金样本可提高可靠性；修复效果尚未验。详见[Q04](#research-q04)。

修复后对所有 action 做单位、期数、边界和黄金样本核对，再到目标宿主复验文本/结构值。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 480 | 426 | 34 | — |
| .md | source | 4 | 160 | — | — | 1356 |
| .mjs | test | 1 | 178 | 150 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data/issues?q=is%3Aissue+created%3A2026-09-22T06%3A08%3A30.292Z..2026-10-22T06%3A08%3A30.292Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A08%3A30.292Z..2026-10-22T06%3A08%3A30.292Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实金融计算工具的用途、输出口径与代码/宣传不一致；不给投资建议。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 工具包实际提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

插件注册 finance_data Agent 工具和可选金融提示段，纯函数做格式、收益、财务比率、现值/终值、风险、清单、定投、组合、趋势与同业分位数。数学与宿主适配分在 finance.js/index.js，便于离线算术与单元测试。它不提供原始行情、财报、事实核验或投资决策；模型需提供来源、时点、单位与口径。README 中文表列 8 类动作，但工具枚举还有 trend/peer 两类，文档范围滞后。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-35](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/README.zh.md#L1-L35)

作者说明确定性计算、8 类动作与薄适配层。

<details>
<summary>查看原文（35行）</summary>

````text
# dsh-plugin-finance-data

面向 [DeepSeek Harness](https://github.com/deepseek-ai/dsh) agent 的**金融数据工具包**：数字格式化、收益计算、估值与盈利比率、时间价值、风险指标，全部确定性计算。模型负责解读，插件负责算术。

## 安装

```bash
dsh plugin --profile <profile> add dsh-plugin-finance-data
```

重启 DSH 后，`finance_data` 工具全局注册。

## 工具

| 动作 | 用途 |
| --- | --- |
| `format` | 数字/货币/百分比格式化，千分位，中文万/亿单位 |
| `return` | 简单/对数/年化收益（CAGR 风格） |
| `ratio` | PE、PB、ROE、ROA、毛利率、净利率、产权比率 |
| `value` | 现值、终值、隐含收益率 |
| `risk` | 收益率序列的均值、波动率、最大回撤、历史 VaR(95)、夏普比率 |
| `checklist` | 数据质量检查清单（来源、时点、单位、口径） |
| `plan` | 定投/复利模拟（终值时间表、通胀调整实际价值） |
| `portfolio` | 组合权重、漂移与再平衡指令（买/卖金额）

## 配置

均为可选项，写在组合行的 `config` 里：

| 键 | 默认值 | 含义 |
| --- | --- | --- |
| `personaSection` | `true` | 是否注册金融提示词段 |
| `sectionOrder` | `6` | 提示词段顺序（persona 为 0，升序） |

## 设计
````

</details>

**依据 2 · 源码核查**：[lib/index.js:12-24](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js#L12-L24)

引入计算函数并声明 tools/systemPrompt。

<details>
<summary>查看原文（13行）</summary>

```text
import z from "@deepseek-ai/schemastery";
import { defineTool } from "@deepseek-ai/dsh-tools";
import {
  analyzeTrend,
  computeRatio,
  computeReturn,
  dataChecklist,
  formatNumber,
  peerCompare,
  portfolioWeights,
  projectPlan,
  rebalance,
  riskMetrics,
```

</details>

**依据 3 · 源码核查**：[lib/index.js:53-71](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js#L53-L71)

工具枚举共 10 类动作。

<details>
<summary>查看原文（19行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "finance_data",
    description: "Finance-data helper: `format` (number/currency/percent formatting, optional Chinese wan/yi units), `return` (simple, log, and annualized returns), `ratio` (PE, PB, ROE, ROA, gross/net margin, debt-to-equity), `value` (present/future value and implied rate), `risk` (mean, volatility, max drawdown, historical VaR(95), Sharpe from a return series), `checklist` (data-quality checklist), `plan` (DCA/compound projection with inflation adjustment), `portfolio` (portfolio weights, drift and rebalance orders), `trend` (metric time-series level/direction/volatility), `peer` (value vs peer distribution: P10/P50/P90 + percentile rank). Use it whenever the task involves financial figures, returns, valuations, or risk.",
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["format", "return", "ratio", "value", "risk", "checklist", "plan", "portfolio", "trend", "peer"],
        description: "Which finance helper to run.",
      },
      value: { type: "number", description: "Number to format (format)." },
      decimals: { type: "integer", description: "Decimal places (format)." },
      thousands: { type: "boolean", description: "Thousands separators (format)." },
      currency: { type: "string", description: "Currency symbol prefix (format)." },
      percent: { type: "boolean", description: "Treat value as a fraction and render as percent (format)." },
      zh: { type: "boolean", description: "Use Chinese wan/yi units (format)." },
      start: { type: "number", description: "Starting value (return)." },
      end: { type: "number", description: "Ending value (return)." },
      periods: { type: "integer", description: "Number of periods for annualization (return)." },
      annualized: { type: "boolean", description: "Compute annualized return (return)." },
```

</details>

#### 缺口

- 未在目标 DSH 调用工具。
  **影响**：模型选择、参数补全和界面输出未核。
  **进一步探讨**：用受控案例在宿主检验 action 选择和错误处理。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 比率百分数输出是否准确？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

finance.js 的 roe、roa、grossMargin、netMargin 已把除法结果乘 100，返回百分数数值；index.js 的 ratio 分支又把这四类设置 percent=true，formatNumber 再乘 100 并附 %。例如净利润 10、收入 100，计算值为 10，但工具文本格式化成 1000.00%。这是静态代码路径可直接推导的百倍展示错误，且风险是 Agent 可能引用文本而不是原值。PE/PB 等非百分数不走这条错误路径。

#### 证据与依据

**依据 1 · 源码核查**：[lib/finance.js:10-24](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L10-L24)

percent 格式化对输入再乘 100。

<details>
<summary>查看原文（15行）</summary>

```text
export function formatNumber({ value, decimals = 2, thousands = true, currency = "", percent = false, zh = false } = {}) {
  const v = Number(value);
  if (!Number.isFinite(v)) throw new Error("finance: value must be a finite number");
  let out;
  if (percent) {
    out = (v * 100).toFixed(Math.max(0, Math.floor(decimals))) + "%";
  } else if (zh && Math.abs(v) >= 1e8) {
    out = (v / 1e8).toFixed(Math.max(0, Math.floor(decimals))) + "亿";
  } else if (zh && Math.abs(v) >= 1e4) {
    out = (v / 1e4).toFixed(Math.max(0, Math.floor(decimals))) + "万";
  } else {
    out = v.toFixed(Math.max(0, Math.floor(decimals)));
    if (thousands) out = out.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }
  return (currency ? currency + out : out);
```

</details>

**依据 2 · 源码核查**：[lib/finance.js:43-55](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L43-L55)

四个比率计算时已乘 100。

<details>
<summary>查看原文（13行）</summary>

```text
export function computeRatio({ type = "pe", price, eps, bvps, netIncome, equity, assets, revenue, cogs, debt } = {}) {
  const ratio = {
    pe: () => { if (price == null || eps == null || eps === 0) throw new Error("finance: pe needs price and eps (eps != 0)"); return price / eps; },
    pb: () => { if (price == null || bvps == null || bvps === 0) throw new Error("finance: pb needs price and bvps (bvps != 0)"); return price / bvps; },
    roe: () => { if (netIncome == null || equity == null || equity === 0) throw new Error("finance: roe needs netIncome and equity (equity != 0)"); return (netIncome / equity) * 100; },
    roa: () => { if (netIncome == null || assets == null || assets === 0) throw new Error("finance: roa needs netIncome and assets (assets != 0)"); return (netIncome / assets) * 100; },
    grossMargin: () => { if (revenue == null || cogs == null || revenue === 0) throw new Error("finance: grossMargin needs revenue and cogs (revenue != 0)"); return ((revenue - cogs) / revenue) * 100; },
    netMargin: () => { if (netIncome == null || revenue == null || revenue === 0) throw new Error("finance: netMargin needs netIncome and revenue (revenue != 0)"); return (netIncome / revenue) * 100; },
    debtToEquity: () => { if (debt == null || equity == null || equity === 0) throw new Error("finance: debtToEquity needs debt and equity (equity != 0)"); return debt / equity; },
  }[type];
  if (!ratio) throw new Error("finance: unknown ratio type '" + type + "'");
  return { type, value: ratio() };
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:137-145](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js#L137-L145)

ratio 分支对四类再次调用 percent 格式化。

```text
        case "ratio":
          values = computeRatio({
            type: args.type, price: args.price, eps: args.eps, bvps: args.bvps,
            netIncome: args.netIncome, equity: args.equity, assets: args.assets,
            revenue: args.revenue, cogs: args.cogs, debt: args.debt,
          });
          value = values.value;
          const isPct = ["roe", "roa", "grossMargin", "netMargin"].includes(args.type);
          text = values.type + " = " + formatNumber({ value, percent: isPct, decimals: 2, zh: true });
```

#### 缺口

- 未执行目标工具确认宿主最终展示。
  **影响**：已能从代码确定文本计算路径，但实际模型采信程度未知。
  **进一步探讨**：用 ROE=10/100 等固定案例验证工具 text/value，并统一比率单位契约。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 定投和组合动作是否兑现描述？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

plan 的周期数为 years×频率，却用默认 steps=12 截断实际迭代；index.js 调用 projectPlan 时未传 steps。故默认月度定投无论 years=2 或 10，表和 final 只算前 12 期，摘要仍显示用户输入的 years。portfolio 说明称权重、漂移及再平衡买卖指令，finance.js 有 rebalance 函数，但 index.js portfolio case 只调用 portfolioWeights，未把 rebalance 结果交给工具，买卖指令不会出现。这两个接口/文档不一致会直接影响金额和动作建议。

#### 证据与依据

**依据 1 · 源码核查**：[lib/finance.js:133-171](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L133-L171)

plan 用 Math.min(periods,steps) 截断并据此算 final。

<details>
<summary>查看原文（39行）</summary>

```text
export function projectPlan({ principal = 0, contribution = 0, contributionFrequency = "month", annualRate = 0, years = 1, inflation = 0, steps = 12 } = {}) {
  const p = Number(principal) || 0;
  const c = Number(contribution) || 0;
  const r = Number(annualRate) || 0;
  const yrs = Math.max(0.1, Number(years) || 0);
  const inf = Number(inflation) || 0;
  if (p < 0 || c < 0) throw new Error("finance: principal and contribution must be non-negative");
  if (r < -100) throw new Error("finance: annualRate must be >= -100");
  const perYear = contributionFrequency === "year" ? 1 : contributionFrequency === "week" ? 52 : contributionFrequency === "quarter" ? 4 : 12;
  const n = Math.max(1, Math.floor(steps));
  const perPeriod = r / (perYear * 100);
  const periods = Math.max(1, Math.round(yrs * perYear));
  const total = Math.min(periods, n);
  let balance = p;
  const schedule = [];
  for (let i = 1; i <= total; i++) {
    balance = balance * (1 + perPeriod) + c;
    const nominal = balance;
    const real = nominal / Math.pow(1 + inf / 100, i / perYear);
    schedule.push({ period: i, balance: round2(nominal), real: round2(real) });
  }
  const final = balance;
  const invested = p + c * total;
  const totalReturn = final - invested;
  const finalReal = final / Math.pow(1 + inf / 100, total / perYear);
  const text = [
    "# Projection",
    "",
    "Principal: " + round2(p) + ", contribution: " + round2(c) + "/" + contributionFrequency + ", annual rate: " + r + "%, years: " + yrs + (inf > 0 ? ", inflation: " + inf + "%" : ""),
    "",
    "| Period | Balance | Real (after inflation) |",
    "|--------|---------|------------------------|",
    ...schedule.map((s) => "| " + s.period + " | " + s.balance + " | " + s.real + " |"),
    "",
    "Invested: " + round2(invested) + ", final: " + round2(final) + ", return: " + round2(totalReturn) + " (" + (invested > 0 ? round2((totalReturn / invested) * 100) : 0) + "%)",
    "Final real value: " + round2(finalReal),
  ].join("\n");
  return { principal: round2(p), contributionPerPeriod: round2(c), totalContributed: round2(c * total), invested: round2(invested), final: round2(final), finalReal: round2(finalReal), totalReturn: round2(totalReturn), returnPct: invested > 0 ? round2((totalReturn / invested) * 100) : 0, schedule, text };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:166-175](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js#L166-L175)

plan 不传 steps；portfolio 仅调用 portfolioWeights。

<details>
<summary>查看原文（10行）</summary>

```text
        case "plan":
          text = projectPlan({
            principal: args.principal, contribution: args.contribution,
            contributionFrequency: args.contributionFrequency, annualRate: args.annualRate,
            years: args.years, inflation: args.inflation,
          }).text;
          break;
        case "portfolio":
          text = portfolioWeights({ targets: args.targets, values: args.values }).text;
          break;
```

</details>

**依据 3 · 源码核查**：[lib/finance.js:198-214](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L198-L214)

rebalance 存在但未用于工具分支。

<details>
<summary>查看原文（17行）</summary>

```text
/** Rebalance orders to bring the portfolio back to target weights. */
export function rebalance({ targets = {}, values = {} } = {}) {
  const base = portfolioWeights({ targets, values });
  const orders = base.rows.map((r) => {
    const desired = (r.target / 100) * base.totalValue;
    const diff = desired - r.value;
    return { name: r.name, targetValue: round2(desired), diff: round2(diff), action: diff >= 0 ? "buy" : "sell", amount: round2(Math.abs(diff)) };
  });
  const text = [
    "# Rebalance orders",
    "",
    "| Asset | Target value | Current | Action | Amount |",
    "|-------|--------------|---------|--------|--------|",
    ...orders.map((o) => "| " + o.name + " | " + o.targetValue + " | " + o.diff + " | " + o.action + " | " + o.amount + " |"),
  ].join("\n");
  return { orders, text };
}
```

</details>

**依据 4 · 作者声明**：[README.zh.md:18-27](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/README.zh.md#L18-L27)

作者宣称定投终值与再平衡指令。

<details>
<summary>查看原文（10行）</summary>

```text
| `return` | 简单/对数/年化收益（CAGR 风格） |
| `ratio` | PE、PB、ROE、ROA、毛利率、净利率、产权比率 |
| `value` | 现值、终值、隐含收益率 |
| `risk` | 收益率序列的均值、波动率、最大回撤、历史 VaR(95)、夏普比率 |
| `checklist` | 数据质量检查清单（来源、时点、单位、口径） |
| `plan` | 定投/复利模拟（终值时间表、通胀调整实际价值） |
| `portfolio` | 组合权重、漂移与再平衡指令（买/卖金额）

## 配置

```

</details>

#### 缺口

- 未执行目标工具的多年输入。
  **影响**：源码路径清楚，但修复后数值与输出上限需单测。
  **进一步探讨**：以 years=2/10、月/周频率核最终期数和金额；组合同时验买卖明细。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样安全采用？

**研究主题**：采用判断、效果与总成本、新假设与验证、依赖、兼容与流程

#### 完整回答

当前版本不宜将比率百分数、跨年 plan 终值或 portfolio 再平衡文本用于实际金融判断；其他算术也应做黄金样本核算。建议先修统一比率单位（内部用小数、展示时乘 100 或内部百分数、展示不再乘）、把 schedule 输出采样与最终计算解耦，并让 portfolio 显式组合 weights 与 rebalance。风险指标也需明确收益频率、无年化 Sharpe 和 VaR 符号约定。插件不能替代数据来源和专业判断，本轮只审代码、不验证现实金融数据。

#### 证据与依据

**依据 1 · 源码核查**：[lib/finance.js:91-113](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L91-L113)

风险指标按输入期均值/样本标准差计算，无频率参数。

<details>
<summary>查看原文（23行）</summary>

```text
/** Basic risk metrics from a series of period returns (decimals, e.g. 0.01). */
export function riskMetrics({ returns = [], riskFree = 0 } = {}) {
  if (!Array.isArray(returns) || returns.length < 2) throw new Error("finance: risk needs at least 2 returns");
  const rs = returns.map(Number);
  if (rs.some((x) => !Number.isFinite(x))) throw new Error("finance: returns must be finite numbers");
  const n = rs.length;
  const mean = rs.reduce((a, b) => a + b, 0) / n;
  const variance = rs.reduce((a, b) => a + (b - mean) ** 2, 0) / (n - 1);
  const stdev = Math.sqrt(variance);
  let peak = 1;
  let maxDrawdown = 0;
  let cum = 1;
  for (const r of rs) {
    cum *= 1 + r;
    if (cum > peak) peak = cum;
    const dd = (peak - cum) / peak;
    if (dd > maxDrawdown) maxDrawdown = dd;
  }
  const sorted = [...rs].sort((a, b) => a - b);
  const var95 = percentile(sorted, 0.05);
  const sharpe = stdev === 0 ? NaN : (mean - Number(riskFree)) / stdev;
  return { mean, stdev, maxDrawdown, var95, sharpe, samples: n };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:53-111](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js#L53-L111)

工具参数/描述与输出契约。

<details>
<summary>查看原文（59行）</summary>

```text
  ctx.tools.register(defineTool({
    name: "finance_data",
    description: "Finance-data helper: `format` (number/currency/percent formatting, optional Chinese wan/yi units), `return` (simple, log, and annualized returns), `ratio` (PE, PB, ROE, ROA, gross/net margin, debt-to-equity), `value` (present/future value and implied rate), `risk` (mean, volatility, max drawdown, historical VaR(95), Sharpe from a return series), `checklist` (data-quality checklist), `plan` (DCA/compound projection with inflation adjustment), `portfolio` (portfolio weights, drift and rebalance orders), `trend` (metric time-series level/direction/volatility), `peer` (value vs peer distribution: P10/P50/P90 + percentile rank). Use it whenever the task involves financial figures, returns, valuations, or risk.",
    parameters: {
      action: {
        type: "string", required: true,
        enum: ["format", "return", "ratio", "value", "risk", "checklist", "plan", "portfolio", "trend", "peer"],
        description: "Which finance helper to run.",
      },
      value: { type: "number", description: "Number to format (format)." },
      decimals: { type: "integer", description: "Decimal places (format)." },
      thousands: { type: "boolean", description: "Thousands separators (format)." },
      currency: { type: "string", description: "Currency symbol prefix (format)." },
      percent: { type: "boolean", description: "Treat value as a fraction and render as percent (format)." },
      zh: { type: "boolean", description: "Use Chinese wan/yi units (format)." },
      start: { type: "number", description: "Starting value (return)." },
      end: { type: "number", description: "Ending value (return)." },
      periods: { type: "integer", description: "Number of periods for annualization (return)." },
      annualized: { type: "boolean", description: "Compute annualized return (return)." },
      log: { type: "boolean", description: "Also compute log return (return)." },
      type: { type: "string", description: "Ratio type: pe | pb | roe | roa | grossMargin | netMargin | debtToEquity (ratio)." },
      price: { type: "number", description: "Price per share (ratio pe/pb)." },
      eps: { type: "number", description: "Earnings per share (ratio pe)." },
      bvps: { type: "number", description: "Book value per share (ratio pb)." },
      netIncome: { type: "number", description: "Net income (ratio roe/roa/netMargin)." },
      equity: { type: "number", description: "Shareholders' equity (ratio roe/debtToEquity)." },
      assets: { type: "number", description: "Total assets (ratio roa)." },
      revenue: { type: "number", description: "Revenue (ratio grossMargin/netMargin)." },
      cogs: { type: "number", description: "Cost of goods sold (ratio grossMargin)." },
      debt: { type: "number", description: "Total debt (ratio debtToEquity)." },
      mode: { type: "string", description: "fv | pv | rate (value)." },
      present: { type: "number", description: "Present value (value)." },
      future: { type: "number", description: "Future value (value)." },
      rate: { type: "number", description: "Per-period rate (value)." },
      returns: { type: "array", items: { type: "number" }, description: "Return series as decimals, e.g. [0.01, -0.02] (risk)." },
      principal: { type: "number", description: "Starting principal (plan)." },
      contribution: { type: "number", description: "Periodic contribution amount (plan)." },
      contributionFrequency: { type: "string", enum: ["month", "quarter", "year", "week"], description: "Contribution frequency (plan)." },
      annualRate: { type: "number", description: "Annual rate in percent, e.g. 6 for 6% (plan)." },
      years: { type: "number", description: "Projection length in years (plan)." },
      inflation: { type: "number", description: "Annual inflation in percent (plan)." },
      targets: { type: "object", additionalProperties: false, description: "Target weights in percent summing to 100, e.g. {\"equity\": 60} (portfolio)." },
      values: { type: "object", additionalProperties: false, description: "Current market values per asset, e.g. {\"equity\": 50000} (portfolio)." },
      metricValues: { type: "array", items: { type: "number" }, description: "Chronological metric values, oldest first (trend)." },
      labels: { type: "array", items: { type: "string" }, description: "Optional period labels (trend)." },
      peers: { type: "array", items: { type: "number" }, description: "Peer group values for the same metric (peer)." },
      metric: { type: "string", description: "Metric name, e.g. PE / ROE (peer)." },
      higherIsBetter: { type: "boolean", description: "Whether a higher value is favorable (peer)." },
      riskFree: { type: "number", description: "Risk-free rate for Sharpe (risk)." },
    },
    output: {
      schema: {
        type: "object",
        additionalProperties: true,
        properties: {
          action: { type: "string", required: true },
          text: { type: "string" },
          value: { type: "number" },
          values: { type: "object", additionalProperties: true },
```

</details>

**依据 3 · 源码核查**：[lib/finance.js:133-214](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js#L133-L214)

定投及再平衡实现。

<details>
<summary>查看原文（82行）</summary>

```text
export function projectPlan({ principal = 0, contribution = 0, contributionFrequency = "month", annualRate = 0, years = 1, inflation = 0, steps = 12 } = {}) {
  const p = Number(principal) || 0;
  const c = Number(contribution) || 0;
  const r = Number(annualRate) || 0;
  const yrs = Math.max(0.1, Number(years) || 0);
  const inf = Number(inflation) || 0;
  if (p < 0 || c < 0) throw new Error("finance: principal and contribution must be non-negative");
  if (r < -100) throw new Error("finance: annualRate must be >= -100");
  const perYear = contributionFrequency === "year" ? 1 : contributionFrequency === "week" ? 52 : contributionFrequency === "quarter" ? 4 : 12;
  const n = Math.max(1, Math.floor(steps));
  const perPeriod = r / (perYear * 100);
  const periods = Math.max(1, Math.round(yrs * perYear));
  const total = Math.min(periods, n);
  let balance = p;
  const schedule = [];
  for (let i = 1; i <= total; i++) {
    balance = balance * (1 + perPeriod) + c;
    const nominal = balance;
    const real = nominal / Math.pow(1 + inf / 100, i / perYear);
    schedule.push({ period: i, balance: round2(nominal), real: round2(real) });
  }
  const final = balance;
  const invested = p + c * total;
  const totalReturn = final - invested;
  const finalReal = final / Math.pow(1 + inf / 100, total / perYear);
  const text = [
    "# Projection",
    "",
    "Principal: " + round2(p) + ", contribution: " + round2(c) + "/" + contributionFrequency + ", annual rate: " + r + "%, years: " + yrs + (inf > 0 ? ", inflation: " + inf + "%" : ""),
    "",
    "| Period | Balance | Real (after inflation) |",
    "|--------|---------|------------------------|",
    ...schedule.map((s) => "| " + s.period + " | " + s.balance + " | " + s.real + " |"),
    "",
    "Invested: " + round2(invested) + ", final: " + round2(final) + ", return: " + round2(totalReturn) + " (" + (invested > 0 ? round2((totalReturn / invested) * 100) : 0) + "%)",
    "Final real value: " + round2(finalReal),
  ].join("\n");
  return { principal: round2(p), contributionPerPeriod: round2(c), totalContributed: round2(c * total), invested: round2(invested), final: round2(final), finalReal: round2(finalReal), totalReturn: round2(totalReturn), returnPct: invested > 0 ? round2((totalReturn / invested) * 100) : 0, schedule, text };
}

/** Portfolio actual weights and drift vs target weights. */
export function portfolioWeights({ targets = {}, values = {} } = {}) {
  const names = Object.keys(targets);
  if (names.length === 0) throw new Error("finance: target weights are required");
  const totalTarget = names.reduce((s, n) => s + (Number(targets[n]) || 0), 0);
  if (Math.abs(totalTarget - 100) > 1e-6) throw new Error("finance: target weights must sum to 100");
  const totalValue = names.reduce((s, n) => s + (Number(values[n]) || 0), 0);
  const rows = names.map((n) => {
    const target = Number(targets[n]) || 0;
    const value = Number(values[n]) || 0;
    const actual = totalValue > 0 ? (value / totalValue) * 100 : 0;
    return { name: n, target, value: round2(value), actual: round2(actual), drift: round2(actual - target) };
  });
  const text = [
    "# Portfolio weights",
    "",
    "Total value: " + round2(totalValue),
    "",
    "| Asset | Target % | Value | Actual % | Drift |",
    "|-------|----------|-------|----------|-------|",
    ...rows.map((r) => "| " + r.name + " | " + r.target + " | " + r.value + " | " + r.actual + " | " + r.drift + " |"),
  ].join("\n");
  return { totalValue: round2(totalValue), rows, text };
}

/** Rebalance orders to bring the portfolio back to target weights. */
export function rebalance({ targets = {}, values = {} } = {}) {
  const base = portfolioWeights({ targets, values });
  const orders = base.rows.map((r) => {
    const desired = (r.target / 100) * base.totalValue;
    const diff = desired - r.value;
    return { name: r.name, targetValue: round2(desired), diff: round2(diff), action: diff >= 0 ? "buy" : "sell", amount: round2(Math.abs(diff)) };
  });
  const text = [
    "# Rebalance orders",
    "",
    "| Asset | Target value | Current | Action | Amount |",
    "|-------|--------------|---------|--------|--------|",
    ...orders.map((o) => "| " + o.name + " | " + o.targetValue + " | " + o.diff + " | " + o.action + " | " + o.amount + " |"),
  ].join("\n");
  return { orders, text };
}
```

</details>

#### 缺口

- 尚无独立黄金样本和目标宿主复验。
  **影响**：无法量化其他公式的实际错误率。
  **进一步探讨**：修复后建立单位、期数、边界和金额黄金样本，再测试 Agent 是否正确解释。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
