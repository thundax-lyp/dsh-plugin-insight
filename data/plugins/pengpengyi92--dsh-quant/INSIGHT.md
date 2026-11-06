# dsh-quant

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[8bf174d](https://github.com/pengpengyi92/dsh-quant/tree/8bf174d3587f9df27608e5759b979eb00abe0927)

<!-- BEGIN META -->
[![GitHub ★ 65](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=65&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/pengpengyi92/dsh-quant) [![npm 30d 1,035](https://img.shields.io/static/v1?label=npm+30d&message=1%2C035&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-quant) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-quant)
<!-- END META -->

> **功能**：DSH 量化研究工具集，提供行情、指标、回测、风险与执行模拟及结构化研究报告管线。

> **亮点**：已有增量是把多域函数以统一工具契约和固定管线交给Agent组合，并明确次根成交/等长对齐等约定；工具数与作者测试数不代替独立数值/收益验证，见[Q01](#research-q01)至[Q03](#research-q03)。

> **主要限制**：双均线完整平仓未把价差结转现金，却流入pipeline报告；fallback实际来源被丢弃、年化固定365，执行模拟还有乱序与满仓手续费边界。均为静态推导未运行，见[Q03](#research-q03)至[Q05](#research-q05)。

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
  - [Q01 · 真实类型与研究任务增量是什么？](#detail-section-11)
  - [Q02 · pipeline如何从数据形成报告？](#detail-section-12)
  - [Q03 · 时间对齐和未来信息怎样约束？](#detail-section-13)
  - [Q04 · 数据来源和质量有哪些依赖？](#detail-section-14)
  - [Q05 · execution与风险输出能证明什么？](#detail-section-15)
  - [Q06 · 成本及最小采用如何判断？](#detail-section-16)
  - [Q07 · 什么改进值得验证？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：能独立复算数值/时序口径的研究者可让Agent组织固定数据到报告；交付必须可追数据与费用假设，模拟不作实盘或收益证据，见[Q01](#research-q01)。

成熟数值/回测库、独立脚本和表格可完成原任务；本项目主要提供Agent接口与组合，外链UI不属于本根插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 行情/质量 | 公开API或固定数组 | 来源/闭合不完整，PIT是启发式 |
| 指标/回测 | Agent数值研究 | 完整平仓资金缺陷待修，不代表全部函数 |
| pipeline | 固定组合报告和图表数据 | 无execute sim调用，标的风险非策略风险 |
| execution sim | 次根收盘/费滑点模拟 | 无实盘，乱序和满仓加费需核 |
| 研究Skill | 对齐与OOS规范 | 文件存在不证明自动注册 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需性 | 用途 | 边界 |
| --- | --- | --- | --- |
| 兼容DSH tools/schema与构建包 | 宿主必需 | 原生注册 | source checkout不等于已发布可加载 |
| 有序、可复算且合法使用的数组/行情 | 必需 | 数值研究 | 形状有效不等于时间可用或正确 |
| 公共行情网络 | 在线可选 | 固定API fetch | 地区/限流/闭合与实际来源需核 |
| 独立基准和研究能力 | 采用必需 | 资金/时序/费用核对 | 发现数值问题前不产决策报告 |
| 宿主模型预算 | Agent使用条件 | 工具调用和报告上下文 | 数值函数不直接调模型，金额未知 |

#### 验证流程

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 固定样本 | 使用离线已知数组及输入哈希 | 不先取波动行情 |
| 单函数 | 手算指标/次根成交/平仓资金 | 不守恒则停相关链路 |
| 模拟反例 | 乱序、100%加费、小时bar | 明确未成交和年化口径 |
| 管线 | 修正后对独立基准核报告 | 标的风险不混策略风险 |
| 退出 | 保留原始快照回成熟库 | 不接实盘，不据报告下注 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工 | 未知 |
| --- | --- | --- | --- |
| 首次 | 构建/宿主资源与合法数据 | 数值基准和版本核对 | 载入/耗时未测 |
| 持续 | 网络、计算/内存、Agent上下文 | 数据/周期/费用与策略复核 | 免费接口不等于零成本 |
| 恢复 | 重取快照/重算 | 定位资金/来源错误 | 净节时和费用未知 |
| 退出 | 保存输入与报告存储 | 回成熟库/脚本复算 | 模拟资本/基金费不是用户支出 |

#### 效果

| 效果 | 当前证据 | 未证实 |
| --- | --- | --- |
| Agent组合 | schema/结构结果与管线 | 比成熟库少错/省时 |
| 时间约定 | 次根信号和窗口代码 | 上游PIT真实无泄漏 |
| 研究报告 | Markdown/图表结果 | 数值可信与策略有效 |
| 模拟执行 | 数组fills/unfilled | 实盘成交、收益或流动性 |

> **思考**：双均线完整平仓未把价差结转现金，却流入pipeline报告；fallback实际来源被丢弃、年化固定365，执行模拟还有乱序与满仓手续费边界。均为静态推导未运行，见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：已有增量是把多域函数以统一工具契约和固定管线交给Agent组合，并明确次根成交/等长对齐等约定；工具数与作者测试数不代替独立数值/收益验证，见[Q01](#research-q01)至[Q03](#research-q03)。

工具契约、等长对齐和纯函数拆分有复用价值；但作者测试可能固化错误口径，完整平仓净值就是实例。质量输出非门禁，来源和年化上下文不足，不以绿测试替代数值不变量，见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

双均线完整平仓未把价差结转现金，却流入pipeline报告；fallback实际来源被丢弃、年化固定365，执行模拟还有乱序与满仓手续费边界。均为静态推导未运行，见[Q03](#research-q03)至[Q05](#research-q05)。

<a id="detail-section-6"></a>

### 1.5 使用建议

观察。先用离线手算/可信库复核完整平仓、乱序与100%加费、fallback和小时bar年化；关键数值未闭合就停相关报告，回成熟库与独立脚本，不接实盘，见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

原生工具与固定研究管线有源码证据；发现资金/来源/周期边界，未运行数值或宿主验收，当前观察。清单设计未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、skill/quant-research/SKILL.md、src/dsh-data/market.ts、src/dsh-data/quality.ts、src/dsh-execution/execute.ts、src/dsh-execution/pipeline.ts、src/dsh-ml/backtest.ts、src/dsh-ml/metrics.ts、src/dsh-ml/walkforward.ts、src/index.ts、tests/backtest.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对原生tools/bundle、pipeline、双均线回测及作者手算测试、指标年化、行情Binance/OKX解析与fallback、PIT启发式、walkforward窗口、execute模拟。未逐个审计全部指标/回测/衍生品/优化器和外链UI，未构建或执行测试/行情；不把特定缺陷泛化全部函数。
- 下一步：- 固定源码和作者测试内容检查，不运行目标。
- 0.998001×7/8为人工算术对照，不是执行输出。
- 未安装构建、取行情、下单、调用模型或验证收益。
- 发布/渠道价表/可靠性保持作者宣称边界，无实盘建议。

**分析版本**

- **仓库**：[pengpengyi92/dsh-quant](https://github.com/pengpengyi92/dsh-quant)
- **版本号**：0.91.1（[固定提交 8bf174d](https://github.com/pengpengyi92/dsh-quant/tree/8bf174d3587f9df27608e5759b979eb00abe0927)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是在修正数值实现后，为报告强制带实际来源/闭合/输入哈希/周期和资金守恒清单，比较口径误判与维护负担，见[Q07](#research-q07)。

- 固定源码和作者测试内容检查，不运行目标。
- 0.998001×7/8为人工算术对照，不是执行输出。
- 未安装构建、取行情、下单、调用模型或验证收益。
- 发布/渠道价表/可靠性保持作者宣称边界，无实盘建议。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 409 | 24637 | — | — | 247979 |
| .ts | source | 52 | 10599 | 8812 | 1373 | — |
| .mjs | source | 5 | 823 | 725 | 53 | — |
| .ts | test | 36 | 3226 | 2653 | 366 | — |
| .ts | example | 1 | 42 | 36 | 2 | — |

</details>

**活跃度**

[![Issue 未关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/pengpengyi92/dsh-quant/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/pengpengyi92/dsh-quant/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/pengpengyi92/dsh-quant/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Agent量化工具链可复用什么，数据/时间/模拟边界是否支持离线研究采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 真实类型与研究任务增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根项目是DSH模型工具插件，name/inject/tools与apply注册defineTool，bundle patch挂quant-indicators行；不是完整交易服务或独立Web UI。README链接dsh-quant-ui是另一项目，不能当本根组件已提供图形工作台。目标用户是能核对数值/时序口径、希望Agent组合数据到研究报告的研究者；原办法是脚本/表格或成熟回测库逐项拼接。贡献是统一schema、结构结果/文本render分离和跨域组合入口，不是59这个数本身。

合格交付需要可复算数据、时间与费用假设明确、模拟与实盘分开；它没有从工具数、作者测试数或“Quant OS”定位证明生产策略、收益或机构级质量。仓库包含研究Skill文件，但本轮未证明宿主自动发现它；CLI与MCP资源也不能自动等同已在DSH挂载。普通指标计算若已有可靠库，不必迁移。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:90-106](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/index.ts#L90-L106)

原生工具插件导出与注册。

<details>
<summary>查看原文（17行）</summary>

```text

export const name = 'dsh-quant'
export const inject = ['tools'] as const

const numberArrayParam = {
  type: 'array' as const,
  items: { type: 'number' as const },
  description: 'Price series, oldest first',
}

export function apply(ctx: Context) {
  ctx.tools.register(defineTool({
    name: 'quant_sma',
    description:
      'Compute the simple moving average (SMA) of a price series over a window. ' +
      'Returns values aligned to the input length; the first window-1 positions are null.',
    parameters: {
```

</details>

**依据 2 · 源码核查**：[package.json:17-31](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/package.json#L17-L31)

包主入口与bundle。

<details>
<summary>查看原文（15行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    }
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "lib",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-10](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/cordis.patch.yml#L1-L10)

真实bundle插入。

<details>
<summary>查看原文（10行）</summary>

```text
# The dsh-quant bundle patch: inserts the quant toolkit into any profile
# that stacks this bundle (or installs it via `dsh plugin add dsh-quant`).
#
# Row id and plugin name: a user can override config or disable the row from
# their own cordis.patch.yml by id. The row id keeps the historical
# 'quant-indicators' anchor for backward compatibility with existing patches.

- insert:
    - id: quant-indicators
      name: 'dsh-quant'
```

</details>

**依据 4 · 作者声明**：[README.md:18-39](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/README.md#L18-L39)

作者六域/插件化定位。

<details>
<summary>查看原文（22行）</summary>

````text

> **AI-native & DSH-native quant toolkit for every quant aspect** — 59 tools · 6 domains
> (data / alpha / ML / risk / execution / ecosystem) · one end-to-end PDAT→PET
> research pipeline. **Methods open, secrets internal.**

## 🧩 Core Philosophy: Everything is a Plugin (quant edition)

dsh's philosophy is **everything is a plugin**; dsh-quant brings it to quant —
open-sourcing the internal five-team paradigm (**PDAT → PAAT → PCPT → PRT → PET**)
as **five pluggable modules**:

```
data plugin   dsh-data      market data / sources / quality  ← plug in Binance or your own data
alpha plugin  dsh-alpha     indicators / factors / eval      ← write your own alpha (internal alpha stays private)
model plugin  dsh-ml        backtests / ML/DL/RL framework   ← train your own models (internal research stays private)
risk plugin   dsh-risk      VaR / drawdown / options / bonds ← set your own risk limits
exec plugin   dsh-execution sim execution / fund / report    ← build your own trading system (paper or live)
```

- **What's open is the paradigm**: how modules compose, how contracts are defined
  (null alignment / no look-ahead / hand-computed tests), how results are validated —
  not the internal secrets
````

</details>

**依据 5 · 作者声明**：[README.md:144-154](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/README.md#L144-L154)

UI是另一个仓库。

<details>
<summary>查看原文（11行）</summary>

```text
## 🖥️ UI Workbench (dsh-quant-ui)

![dsh-quant UI](demos/ui-demo-preview.png)

[dsh-quant-ui](https://github.com/pengpengyi92/dsh-quant-ui): candlesticks + MA
overlays + trade markers, equity curves, fund NAV / management-fee / performance-fee
cards, metric selector — plus a swimming chibi whale 🐋 (click the title 3 times).

Live demo: https://dsh-quant-ui.pages.dev

## ⌨️ CLI (dsh-quant terminal)
```

</details>

**依据 6 · 源码核查**：[skill/quant-research/SKILL.md:1-27](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/skill/quant-research/SKILL.md#L1-L27)

包内研究说明，不证明自动装载。

<details>
<summary>查看原文（27行）</summary>

````text
---
name: quant-research
description: Use when running quantitative research with dsh-quant — factor evaluation, backtests, risk analysis, fund simulation, walk-forward validation, or the end-to-end research pipeline. Gives the canonical tool chain, alignment conventions (no look-ahead, null padding, factor[i]→returns[i+1]) and the out-of-sample validation gold standard.
---

# Quant Research with dsh-quant

dsh-quant 的量化研究标准工作流：工具按域组合成 PDAT→PET 链路，每步都有
对齐契约与验证金标准。规划（planning）时按链路排布任务；执行（tool use）
时严格按契约传参。

## 1. 规划：PDAT→PET 链路

```
planning: 数据 → 质量 → 特征/因子 → 模型/回测 → 风控 → 交付
tool use: quant_market_fetch → quant_data_quality → quant_factor_evaluate/
          quant_factor_neutralize → quant_backtest*/quant_walk_forward →
          quant_risk/quant_drawdown → quant_fund/quant_report/quant_chart
```

- 单标的完整研究：一条 `quant_research_pipeline` 跑通全链路（含报告与图表）。
- 多标的并行：每个标的交给一个 subagent 调 `quant_research_pipeline`
  （纯 TS 侧可用 `researchMultiAsset`），单标的失败不阻断其他标的。
- 研究结论的样本外证据必须来自 `quant_walk_forward` 的 OOS IC/RankIC，
  训练集 R2 只是参考。

## 2. Tool use 契约（不可违反）
````

</details>

#### 缺口

- 无真实研究者任务与成熟库对照。
  **影响**：不能确认Agent包装值得替换原工具。
  **进一步探讨**：比较可复算小任务的错误、维护和人工核对时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · pipeline如何从数据形成报告？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

quant_research_pipeline工具合成调用方取消与20秒超时，传入candles则跳过网络，否则行情容错取数据；最少30根、fast<slow后计算质量、统计、均线、双均线回测、指标、风险、回撤、基金、动量因子，最终输出Markdown和图表数据。质量结果只是附带输出，不因healthy=false自动阻断后续计算。它的“全链路”是固定示例组合，不会自动搜索最优策略、训练所有模型或做实盘。

管线没有调用executeSimulate，不能将单独存在的执行模拟工具当已进入这条链；riskMetrics输入是标的close逐期收益，而drawdown/metrics输入是策略净值，因此报告risk与策略表现不是同一对象。基金默认资本/管理费/业绩费是模拟参数，不是本插件收费。固定组合易于消费，但错误的底层回测可一路进入看似完整的报告，必须先验数值守恒再评报告漂亮程度。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:3069-3091](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/index.ts#L3069-L3091)

工具预算与参数转交。

<details>
<summary>查看原文（23行）</summary>

```text
        }]
      },
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const signal = AbortSignal.any([exec.signal, AbortSignal.timeout(20_000)])
      return researchPipeline({
        symbol: args.symbol,
        interval: args.interval,
        limit: args.limit,
        provider: args.provider,
        candles: args.candles,
        fast: args.fast,
        slow: args.slow,
        feeRate: args.feeRate,
        stopLoss: args.stopLoss,
        takeProfit: args.takeProfit,
        factorWindow: args.factorWindow,
        initialCapital: args.initialCapital,
      }, signal) as never
    },
  }))
}
```

</details>

**依据 2 · 源码核查**：[src/dsh-execution/pipeline.ts:86-125](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L86-L125)

质量只计算后继续、固定回测/风险与基金。

<details>
<summary>查看原文（40行）</summary>

```text
  const limit = options.limit ?? 120
  const provider = options.provider ?? 'binance'
  let symbol = options.symbol ?? 'BTCUSDT'
  let candles: Candle[]
  if (options.candles !== undefined && options.candles.length > 0) {
    candles = [...options.candles]
  } else {
    candles = await fetchWithFallback(symbol, interval, limit, signal, provider)
    symbol = options.symbol ?? 'BTCUSDT'
  }
  if (candles.length < 30) throw new RangeError(`pipeline needs at least 30 candles, got ${candles.length}`)
  const close = candles.map(c => c.close)
  const fast = options.fast ?? 5
  const slow = options.slow ?? 20
  if (fast >= slow) throw new RangeError(`fast ${fast} must be < slow ${slow}`)

  const quality = candlesCheck(candles)
  const stats = seriesStats(close)
  const smaValues = sma(close, slow)
  const bt = backtestMaCross(close, fast, slow, options.feeRate ?? 0.001, options.stopLoss, options.takeProfit)
  const em = equityMetrics(bt.equityCurve)
  const tm = tradeMetrics(bt.trades)
  const returns = close.slice(1).map((c, i) => c / close[i]! - 1)
  const rk = riskMetrics(returns, { confidence: 0.95 })
  const dd = drawdownAnalysis(bt.equityCurve)
  const fund = fundSimulate(bt.equityCurve, {
    initialCapital: options.initialCapital ?? 100_000_000,
    managementFeeRate: 0.02,
    performanceFeeRate: 0.2,
  })

  // 动量因子：close[t]/close[t-12]-1 预测 close[t+1]/close[t]-1
  const factorWindow = options.factorWindow ?? 20
  const f: number[] = []
  const r: number[] = []
  for (let t = 12; t < close.length - 1; t++) {
    f.push(close[t]! / close[t - 12]! - 1)
    r.push(close[t + 1]! / close[t]! - 1)
  }
  const fe = f.length >= 2 ? factorEvaluate(f, r, 5, Math.min(factorWindow, f.length)) : null
```

</details>

**依据 3 · 源码核查**：[src/dsh-execution/pipeline.ts:117-163](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L117-L163)

动量因子计算、报告和图表组装。

<details>
<summary>查看原文（47行）</summary>

```text
  // 动量因子：close[t]/close[t-12]-1 预测 close[t+1]/close[t]-1
  const factorWindow = options.factorWindow ?? 20
  const f: number[] = []
  const r: number[] = []
  for (let t = 12; t < close.length - 1; t++) {
    f.push(close[t]! / close[t - 12]! - 1)
    r.push(close[t + 1]! / close[t]! - 1)
  }
  const fe = f.length >= 2 ? factorEvaluate(f, r, 5, Math.min(factorWindow, f.length)) : null

  const report = generateReport({
    strategy: `dual-MA crossover ${fast}/${slow} on ${symbol} ${interval} (${provider})`,
    metrics: {
      totalReturnPct: em.totalReturnPct,
      maxDrawdownPct: em.maxDrawdownPct,
      sharpe: em.sharpe,
      annualizedVol: em.annualizedVol,
      calmar: em.calmar,
      sortino: em.sortino,
      winRate: tm.winRate,
      profitFactor: tm.profitFactor,
      avgPeriodReturnPct: em.avgPeriodReturnPct,
    },
    risk: {
      var95: rk.var95, cvar95: rk.cvar95, maxDrawdownPct: rk.maxDrawdownPct,
      beta: rk.beta, informationRatio: rk.informationRatio, trackingError: rk.trackingError,
    },
    fund: {
      initialCapital: fund.initialCapital, finalNavNet: fund.finalNavNet,
      finalAum: fund.finalAum, netReturnPct: fund.netReturnPct,
      managementFeeTotal: fund.managementFeeTotal, performanceFeeTotal: fund.performanceFeeTotal,
    },
    factor: fe === null ? undefined : { ic: fe.ic, icir: fe.icir },
  })

  const markers = bt.trades
    .filter(t => t.exitIndex !== null)
    .map(t => ({ index: t.entryIndex, kind: 'entry' as const }))
  const chartCandleData = chartCandles(
    candles.map(c => ({ openTime: c.openTime, open: c.open, high: c.high, low: c.low, close: c.close, volume: c.volume })),
    [{ name: `SMA${slow}`, values: [...smaValues] }],
    markers,
    `${symbol} ${interval}`,
  )
  const chartEquityData = chartBacktest(bt.equityCurve, bt.trades, `${fast}/${slow} equity`)
  const chartUnderwaterData = chartSeries([{ name: 'underwater', values: [...dd.underwater] }], 'underwater')

```

</details>

**依据 4 · 源码核查**：[src/dsh-execution/pipeline.ts:164-178](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L164-L178)

实际结果返回quality、report、charts；本管线完整函数未调用executeSimulate。

<details>
<summary>查看原文（15行）</summary>

```text
  return {
    symbol,
    provider: options.candles !== undefined && options.candles.length > 0 ? 'fixture' : provider,
    interval,
    candles: { count: candles.length, from: candles[0]!.openTime, to: candles[candles.length - 1]!.openTime },
    quality,
    stats,
    metrics: { ...em, trades: tm },
    risk: rk,
    drawdown: dd,
    fund,
    factor: fe ?? { ic: 0, rankIc: 0, icDecay: [], icir: 0, icSeries: [], quantileReturns: [], longShort: 0, turnover: 0, autocorr1: 0, n: 0 },
    report,
    charts: { candles: chartCandleData, equity: chartEquityData, underwater: chartUnderwaterData },
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 时间对齐和未来信息怎样约束？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

双均线先执行上一根pending信号，再确认本根交叉，确实将信号与下一根成交分开；walkForward以历史训练窗口拟合features[t]→returns[t+1]并输出样本外预测，提供可查约定。但这只能限制函数使用给定数组的方式，不能证明上游因子在当时已可得、复权/修订无泄漏或整个策略有效。PIT工具实际按超过50%的单调台阶启发式标疑，渠道可靠性是常量表；pass不是取得修订历史验证“无未来信息”，幸存偏差检查也只是单序列缺失段。

发现更基础的资金口径问题：backtestMaCross持仓期间以cash×close/entry盯市，平仓时却只cash乘一次扣费，没有把exit/entry价差结转。故一次完整交易空仓后净值退回累计手续费，不保留交易涨跌；trade.returnPct又按裸价比，注释“含费”不一致。作者V形完整周期测试明确期望买8卖7后净值0.998001，固化了此口径。按同一全仓、双边0.1%假设应结转价差成为0.998001×7/8=0.873250875；这是人工算术与代码推导，未运行目标，不声称实测。它影响使用该回测曲线的pipeline指标/基金/报告，不能泛化所有其它回测函数。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-ml/backtest.ts:85-145](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/backtest.ts#L85-L145)

pending次根成交、平仓现金缺少价差结转。

<details>
<summary>查看原文（61行）</summary>

```text
      holding = true
      entryIndex = i
      entryPrice = close[i]!
      cash *= 1 - feeRate
    }
    if (pendingExit && holding) {
      const exitPrice = close[i]!
      cash *= 1 - feeRate
      trades.push({
        entryIndex: entryIndex!,
        entryPrice,
        exitIndex: i,
        exitPrice,
        returnPct: exitPrice / entryPrice - 1,
        exitReason: 'signal',
      })
      holding = false
      entryIndex = null
    }
    if (holding) {
      const reason = stopTargetReason(close, i, entryPrice, stopLoss, takeProfit)
      if (reason !== undefined) {
        const exitPrice = close[i]!
        cash *= 1 - feeRate
        trades.push({
          entryIndex: entryIndex!,
          entryPrice,
          exitIndex: i,
          exitPrice,
          returnPct: exitPrice / entryPrice - 1,
          exitReason: reason,
        })
        holding = false
        entryIndex = null
      }
    }
    pendingEntry = false
    pendingExit = false

    // 2) 本根确认交叉信号（下一根成交）
    const prevValid = i > 0 && fastMa[i - 1] !== null && slowMa[i - 1] !== null
    const curValid = fastMa[i] !== null && slowMa[i] !== null
    if (prevValid && curValid) {
      const prevFast = fastMa[i - 1]!
      const prevSlow = slowMa[i - 1]!
      const curFast = fastMa[i]!
      const curSlow = slowMa[i]!
      const crossUp = prevFast <= prevSlow && curFast > curSlow
      const crossDown = prevFast >= prevSlow && curFast < curSlow
      if (crossUp && !holding) pendingEntry = true
      else if (crossDown && holding) pendingExit = true
    }

    // 3) 记录本根持仓与市值
    position[i] = holding ? 1 : 0
    equityCurve[i] = holding ? cash * (close[i]! / entryPrice) : cash
  }

  // 尾部未平仓：记录 open trade
  if (holding) {
    trades.push({
```

</details>

**依据 2 · 源码核查**：[tests/backtest.spec.ts:26-40](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/tests/backtest.spec.ts#L26-L40)

作者测试固化仅扣费净值。

<details>
<summary>查看原文（15行）</summary>

```text
test('backtest: V 形后回落 — 完整买卖周期 + 双边手续费', () => {
  const close = [10, 9, 8, 7, 6, 5, 6, 7, 8, 9, 10, 9, 8, 7, 6, 5, 4]
  const out = backtestMaCross(close, 2, 3, 0.001)
  // 买 i=8 @8；crossDown 确认于 i=12（prev fast 9.5 >= slow 9.333，cur 8.5 < 9），i=13 收盘价 7 卖出
  assert.equal(out.trades.length, 1)
  const t = out.trades[0]!
  assert.equal(t.entryIndex, 8)
  assert.equal(t.exitIndex, 13)
  assert.equal(t.exitPrice, 7)
  assert.ok(Math.abs(t.returnPct! - (7 / 8 - 1)) < 1e-9)
  // 空仓收尾：cash = (1-fee)^2 = 0.998001
  assert.equal(out.position[13], 0)
  assert.ok(Math.abs(out.equityCurve[13]! - 0.998001) < 1e-9)
  assert.ok(Math.abs(out.totalReturnPct - (0.998001 - 1) * 100) < 1e-6)
})
```

</details>

**依据 3 · 源码核查**：[src/dsh-ml/walkforward.ts:135-175](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/walkforward.ts#L135-L175)

历史窗口训练/未来一根标签与预测。

<details>
<summary>查看原文（41行）</summary>

```text
  for (let testStart = trainWindow; testStart + testWindow - 1 <= n - 1; testStart += advance) {
    const testEnd = Math.min(testStart + testWindow, n)
    const trainEnd = testStart
    const trainStart = trainEnd - trainWindow
    if (trainStart < 0) continue
    // 法方程：X 行 = [1, f[0][t]..f[k-1][t]]，y = returns[t+1]，t ∈ [trainStart, trainEnd)
    const dim = k + 1
    const XtX: number[][] = []
    const Xty: number[] = []
    for (let i = 0; i < dim; i++) {
      XtX.push(new Array<number>(dim).fill(0))
      Xty.push(0)
    }
    let ySum = 0
    for (let t = trainStart; t < trainEnd; t++) {
      const row = [1, ...f.map(fx => fx[t]!)]
      const y = returns[t + 1]!
      ySum += y
      for (let i = 0; i < dim; i++) {
        Xty[i]! += row[i]! * y
        for (let j = 0; j < dim; j++) XtX[i]![j]! += row[i]! * row[j]!
      }
    }
    const beta = solveLinear(XtX, Xty)
    const yMean = ySum / trainWindow
    let ssTot = 0
    let ssRes = 0
    for (let t = trainStart; t < trainEnd; t++) {
      const row = [1, ...f.map(fx => fx[t]!)]
      let yhat = beta[0]!
      for (let i = 0; i < k; i++) yhat += beta[i + 1]! * row[i + 1]!
      const y = returns[t + 1]!
      ssTot += (y - yMean) ** 2
      ssRes += (y - yhat) ** 2
    }
    const trainR2 = ssTot === 0 ? 0 : 1 - ssRes / ssTot
    // 样本外预测（testEnd-1 是最后一个可用 returns 索引）
    for (let t = testStart; t < testEnd; t++) {
      let yhat = beta[0]!
      for (let i = 0; i < k; i++) yhat += beta[i + 1]! * f[i]![t]!
      predictions[t] = yhat
```

</details>

**依据 4 · 源码核查**：[src/dsh-data/quality.ts:27-59](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-data/quality.ts#L27-L59)

PIT仅台阶启发式。

<details>
<summary>查看原文（33行）</summary>

```text
 * Point-in-time 校验：检测"未来才知道的值"在序列中出现的位置。
 *
 * 简化模型：如果某值比其前值发生"异常跳变"且之后不再回落
 * （单调台阶），可能是修订/幸存导致的断点。更严格的做法需要
 * 数据源的修订历史；此处提供可用的启发式。
 */
export function pitCheck(values: readonly number[]): PitCheckResult {
  const n = values.length
  if (n < 3) return { pass: true, lookAheadIndices: [], notes: ['序列过短，跳过 PIT 校验'] }
  const lookAheadIndices: number[] = []
  const notes: string[] = []
  // 检测单调台阶：值跳变后不再回到跳变前的水平（可能被"事后修正"）
  for (let i = 2; i < n; i++) {
    const prev = values[i - 1]!
    const cur = values[i]!
    const before = values[i - 2]!
    const jump = Math.abs(cur - prev)
    const relJump = Math.abs(prev) > 1e-12 ? jump / Math.abs(prev) : jump
    const stepUp = cur > prev && prev >= before
    const stepDown = cur < prev && prev <= before
    if (relJump > 0.5 && (stepUp || stepDown)) {
      lookAheadIndices.push(i)
    }
  }
  if (lookAheadIndices.length > 0) {
    notes.push(`检测到 ${lookAheadIndices.length} 个疑似台阶断点（可能为事后修订/幸存偏差）`)
  } else {
    notes.push('未检测到明显台阶断点')
  }
  return { pass: lookAheadIndices.length === 0, lookAheadIndices, notes }
}

/** 幸存者偏差检查结果。 */
```

</details>

**依据 5 · 源码核查**：[src/dsh-data/quality.ts:125-151](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-data/quality.ts#L125-L151)

可靠性硬编码，不是实测。

<details>
<summary>查看原文（27行）</summary>

```text
export function channelReliability(channels: readonly string[]): ChannelReliability[] {
  const known: Record<string, ChannelReliability> = {
    binance: { channel: 'binance', reliability: 0.95, cost: 'free', risks: ['地区封锁（451），需 fallback'] },
    okx: { channel: 'okx', reliability: 0.93, cost: 'free', risks: ['部分地区限制'] },
    bybit: { channel: 'bybit', reliability: 0.92, cost: 'free', risks: ['CloudFront 偶发'] },
    yahoo: { channel: 'yahoo', reliability: 0.85, cost: 'free', risks: ['美股/全球为主，A股覆盖有限'] },
    sina: { channel: 'sina', reliability: 0.8, cost: 'free', risks: ['A股实时行情，前复权需自行处理'] },
    tencent: { channel: 'tencent', reliability: 0.8, cost: 'free', risks: ['A股实时行情'] },
    akshare: { channel: 'akshare', reliability: 0.7, cost: 'free', risks: ['爬虫类接口，稳定性依赖上游'] },
    tushare: { channel: 'tushare', reliability: 0.75, cost: 'freemium', risks: ['积分制，部分接口需付费'] },
    baostock: { channel: 'baostock', reliability: 0.72, cost: 'free', risks: ['A股，更新有延迟'] },
    wind: { channel: 'wind', reliability: 0.98, cost: 'paid', risks: ['商业终端，贵'] },
    ifind: { channel: 'ifind', reliability: 0.97, cost: 'paid', risks: ['同花顺商业终端'] },
  }
  const out: ChannelReliability[] = []
  for (const c of channels) {
    const k = c.toLowerCase()
    if (known[k]) out.push(known[k])
    else out.push({ channel: c, reliability: 0.5, cost: 'freemium', risks: ['未知渠道，需实测'] })
  }
  return out.sort((a, b) => b.reliability - a.reliability)
}

/** 数据质量总报告：串起 PIT / 幸存者 / 渠道。 */
export interface DataQualityReport {
  pit: PitCheckResult
  survivorship: SurvivorshipCheckResult
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 数据来源和质量有哪些依赖？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

行情工具走固定公开API与native fetch，无需交易凭据，但地区/网络/限流与上游字段仍影响可用性。本轮没有取实时行情，不能把作者free/reliability表当现行价格、许可或可达保证。Candle只保存openTime/OHLCV，不带抓取时刻、closeTime/已闭合或原始响应；Binance/OKX解析不丢未闭合末根，故最后一根可变化，研究者需自行固定快照和截断。

pipeline的fetchWithFallback只返回Candle[]，丢掉实际成功p；结果provider和报告strategy仍使用初始provider。Binance失败而OKX成功时可能把OKX行情标成Binance，这是条件成立的源码推导，未注入故障复现。各交易所/复权来源并非可无声互换。equityMetrics固定365期/年，pipeline支持分钟/小时/股票等interval却不传年化周期，因此非365根/年的输入会让年化Sharpe、波动/Calmar口径失真；须与总收益和逐期指标区别。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:337-353](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/index.ts#L337-L353)

行情工具校验及15秒budget。

<details>
<summary>查看原文（17行）</summary>

```text
      if (provider === 'sina' || provider === 'tencent') {
        assertAShareSymbol(args.symbol)
      } else if (provider === 'yahoo') {
        assertYahooSymbol(args.symbol)
      } else if (!/^[A-Z0-9]+$/.test(args.symbol)) {
        throw new Error(`invalid symbol "${args.symbol}": crypto providers expect uppercase letters and digits, e.g. BTCUSDT`)
      }
      const interval = args.interval ?? '1d'
      const limit = args.limit ?? 100
      if (!Number.isInteger(limit) || limit < 1 || limit > 1000) {
        throw new Error(`limit must be an integer in [1, 1000], got ${limit}`)
      }
      const signal = AbortSignal.any([exec.signal, AbortSignal.timeout(15_000)])
      const candles = await fetchKlines(args.symbol, interval, limit, signal, provider)
      if (candles.length === 0) throw new Error(`no candles returned for ${args.symbol} ${interval}`)
      return { symbol: args.symbol, interval, provider, candles }
    },
```

</details>

**依据 2 · 源码核查**：[src/dsh-data/market.ts:19-26](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-data/market.ts#L19-L26)

Candle无闭合/抓取元数据。

```text
  /** 开盘时间（Unix 毫秒） */
  openTime: number
  open: number
  high: number
  low: number
  close: number
  volume: number
}
```

**依据 3 · 源码核查**：[src/dsh-data/market.ts:69-88](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-data/market.ts#L69-L88)

Binance解析只取前六字段。

<details>
<summary>查看原文（20行）</summary>

```text
}

/** 解析 Binance klines 响应行（纯函数）。非法行抛错。 */
export function parseKlines(rows: readonly (readonly unknown[])[]): Candle[] {
  return rows.map((row, i) => {
    if (row.length < 6) throw new Error(`klines row ${i}: expected >= 6 fields, got ${row.length}`)
    const num = (v: unknown, field: string): number => {
      const n = Number(v)
      if (!Number.isFinite(n)) throw new Error(`klines row ${i}: ${field} is not a finite number (${String(v)})`)
      return n
    }
    return {
      openTime: num(row[0], 'openTime'),
      open: num(row[1], 'open'),
      high: num(row[2], 'high'),
      low: num(row[3], 'low'),
      close: num(row[4], 'close'),
      volume: num(row[5], 'volume'),
    }
  })
```

</details>

**依据 4 · 源码核查**：[src/dsh-data/market.ts:130-151](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-data/market.ts#L130-L151)

OKX同样不检查confirm/闭合。

<details>
<summary>查看原文（22行）</summary>

```text
/** 解析 OKX candles（倒序 → 正序，映射到统一 Candle）。 */
export function parseOkxKlines(rows: readonly (readonly unknown[])[]): Candle[] {
  return rows.slice().reverse().map((row, i) => {
    if (row.length < 6) throw new Error(`okx row ${i}: expected >= 6 fields, got ${row.length}`)
    const num = (v: unknown, field: string): number => {
      const n = Number(v)
      if (!Number.isFinite(n)) throw new Error(`okx row ${i}: ${field} is not a finite number (${String(v)})`)
      return n
    }
    return {
      openTime: num(row[0], 'openTime'),
      open: num(row[1], 'open'),
      high: num(row[2], 'high'),
      low: num(row[3], 'low'),
      close: num(row[4], 'close'),
      volume: num(row[5], 'volume'),
    }
  })
}

/** 解析 Bybit klines（倒序 → 正序，映射到统一 Candle）。 */
export function parseBybitKlines(rows: readonly (readonly unknown[])[]): Candle[] {
```

</details>

**依据 5 · 源码核查**：[src/dsh-execution/pipeline.ts:57-80](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L57-L80)

fallback返回数据不返回实际来源。

<details>
<summary>查看原文（24行）</summary>

```text
/** 加密三所容错链（去重；A 股 provider 直接单点，失败即报错）。 */
async function fetchWithFallback(
  symbol: string,
  interval: Interval,
  limit: number,
  signal: AbortSignal,
  provider: MarketProvider,
): Promise<Candle[]> {
  if (provider === 'sina' || provider === 'tencent') {
    return fetchKlines(symbol, interval, limit, signal, provider)
  }
  const chain = [...new Set([provider, 'binance', 'okx', 'bybit'] as MarketProvider[])]
  let lastError: unknown
  for (const p of chain) {
    try {
      return await fetchKlines(symbol, interval, limit, signal, p)
    } catch (err) {
      lastError = err
    }
  }
  throw new Error(`all providers failed for ${symbol}: ${(lastError as Error).message}`)
}

/** 跑通全链路研究：返回可直接消费的结果包（含 Markdown 报告与图表数据）。 */
```

</details>

**依据 6 · 源码核查**：[src/dsh-execution/pipeline.ts:127-128](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L127-L128)

报告strategy使用请求provider变量。

```text
  const report = generateReport({
    strategy: `dual-MA crossover ${fast}/${slow} on ${symbol} ${interval} (${provider})`,
```

**依据 7 · 源码核查**：[src/dsh-execution/pipeline.ts:164-168](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L164-L168)

返回provider：离线输入标fixture，否则保留请求provider变量。

```text
  return {
    symbol,
    provider: options.candles !== undefined && options.candles.length > 0 ? 'fixture' : provider,
    interval,
    candles: { count: candles.length, from: candles[0]!.openTime, to: candles[candles.length - 1]!.openTime },
```

**依据 8 · 源码核查**：[src/dsh-ml/metrics.ts:31-59](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/metrics.ts#L31-L59)

365期年化常量。

<details>
<summary>查看原文（29行）</summary>

```text
export function equityMetrics(equityCurve: readonly number[]): EquityMetrics {
  const n = equityCurve.length
  if (n < 2) throw new RangeError(`equityCurve needs >= 2 points, got ${n}`)
  const totalReturnPct = (equityCurve[n - 1]! / equityCurve[0]! - 1) * 100
  // 逐期收益
  const rets: number[] = []
  for (let i = 1; i < n; i++) rets.push(equityCurve[i]! / equityCurve[i - 1]! - 1)
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, x) => a + (x - mean) ** 2, 0) / rets.length
  const std = Math.sqrt(variance)
  const sharpe = std === 0 ? 0 : (mean / std) * Math.sqrt(365)
  const annualizedVol = std * Math.sqrt(365) * 100
  // 最大回撤
  let peak = equityCurve[0]!
  let maxDd = 0
  for (const v of equityCurve) {
    if (v > peak) peak = v
    const dd = (peak - v) / peak
    if (dd > maxDd) maxDd = dd
  }
  const maxDrawdownPct = maxDd * 100
  // 年化收益（按期数推算，日频假设 365）
  const annualReturn = (Math.pow(equityCurve[n - 1]! / equityCurve[0]!, 365 / (n - 1)) - 1) * 100
  const calmar = maxDd === 0 ? 0 : annualReturn / maxDrawdownPct
  // 下行波动（只取负收益）
  const downs = rets.filter(r => r < 0)
  const downVar = downs.length === 0 ? 0 : downs.reduce((a, x) => a + x ** 2, 0) / rets.length
  const downStd = Math.sqrt(downVar)
  const sortino = downStd === 0 ? 0 : (mean / downStd) * Math.sqrt(365)
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · execution与风险输出能证明什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

executeSimulate是本地数组模拟，无券商/交易所下单适配；下一根加latencyBars收盘价、固定滑点/手续费、仅多头现货和持仓约束不包含盘口、部分成交、涨跌停或真实订单确认。它返回fills/unfilled而非真实成交回执，不能建议直接交易。风险/历史回测输出同样不能证明未来收益。

模拟还存在输入顺序边界：先按orders原数组顺序更新cash/position并记录快照，全部执行完才sort fills按成交时间回放；未见执行前排序/拒绝乱序，故乱序输入可能以未来资金影响更早成交，再拼出不一致曲线。另默认未给quantity/valueFraction时按权益100%计算买量，但还要额外手续费，初始无仓、默认正费且金额超过容差时会因value+fee>cash判unfilled；这不是自动缩量全仓。小额浮点容差等条件需说明，不称所有订单都失败。本轮静态检查未执行样本。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-execution/execute.ts:1-16](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/execute.ts#L1-L16)

纯模拟、次根成交。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * 交易执行模拟（纯函数、零依赖）—— dsh-execution 域（PET 映射）。
 *
 * 兑现「提供 dsh 交易框架（不接实盘）」承诺：订单在信号后一根（可加
 * 延迟）收盘成交，含双边手续费与滑点，资金曲线按收盘价盯市。仅多头
 * 现货语义：卖出受持仓约束。
 */

export interface SimOrder {
  /** 信号 K 线索引（成交在 index + 1 + latencyBars） */
  index: number
  side: 'buy' | 'sell'
  /** 数量（与 valueFraction 二选一） */
  quantity?: number
  /** 按当前权益比例下单（0-1，与 quantity 二选一） */
  valueFraction?: number
```

</details>

**依据 2 · 源码核查**：[src/dsh-execution/execute.ts:89-117](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/execute.ts#L89-L117)

原数组顺序逐单处理。

<details>
<summary>查看原文（29行）</summary>

```text
  orders.forEach((order, orderIndex) => {
    if (!Number.isInteger(order.index) || order.index < 0 || order.index >= n - 1) {
      unfilledCount++
      return
    }
    if (order.side !== 'buy' && order.side !== 'sell') {
      unfilledCount++
      return
    }
    if (order.quantity !== undefined && (!Number.isFinite(order.quantity) || order.quantity <= 0)) {
      unfilledCount++
      return
    }
    if (order.valueFraction !== undefined && (!Number.isFinite(order.valueFraction) || order.valueFraction <= 0 || order.valueFraction > 1)) {
      unfilledCount++
      return
    }
    if (order.quantity !== undefined && order.valueFraction !== undefined) {
      unfilledCount++
      return
    }
    const fillIndex = order.index + 1 + latencyBars
    if (fillIndex >= n) {
      unfilledCount++
      return
    }
    const base = close[fillIndex]!
    const fillPrice = order.side === 'buy' ? base * (1 + slip) : base * (1 - slip)
    const equity = cash + position * base
```

</details>

**依据 3 · 源码核查**：[src/dsh-execution/execute.ts:119-154](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/execute.ts#L119-L154)

按权益100%后加手续费、更新状态再排序。

<details>
<summary>查看原文（36行）</summary>

```text
    let quantity: number
    if (order.quantity !== undefined) {
      quantity = order.quantity
    } else {
      const frac = order.valueFraction ?? 1
      quantity = order.side === 'buy'
        ? (equity * frac) / fillPrice
        : position * frac
    }
    if (order.side === 'sell') quantity = Math.min(quantity, position)
    if (quantity <= 0) {
      unfilledCount++
      return
    }
    const value = quantity * fillPrice
    const fee = value * feeRate
    const slippageCost = quantity * Math.abs(fillPrice - base)
    if (order.side === 'buy') {
      if (value + fee > cash + 1e-12) {
        unfilledCount++
        return
      }
      cash -= value + fee
      position += quantity
    } else {
      cash += value - fee
      position -= quantity
    }
    fills.push({
      orderIndex, side: order.side, fillIndex, fillPrice, quantity, value, fee,
      slippageCost, cashAfter: cash, positionAfter: position, equityAfter: cash + position * base,
    })
  })

  // 按成交顺序重放状态 → 每根 K 线的盯市权益
  fills.sort((a, b) => a.fillIndex - b.fillIndex)
```

</details>

**依据 4 · 源码核查**：[src/dsh-execution/execute.ts:153-179](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/execute.ts#L153-L179)

排序既有快照后回放。

<details>
<summary>查看原文（27行）</summary>

```text
  // 按成交顺序重放状态 → 每根 K 线的盯市权益
  fills.sort((a, b) => a.fillIndex - b.fillIndex)
  const equityCurve: number[] = new Array(n).fill(0)
  let c = initialCash
  let p = 0
  let fi = 0
  for (let i = 0; i < n; i++) {
    while (fi < fills.length && fills[fi]!.fillIndex === i) {
      c = fills[fi]!.cashAfter
      p = fills[fi]!.positionAfter
      fi++
    }
    equityCurve[i] = c + p * close[i]!
  }
  const finalEquity = equityCurve[n - 1]!
  return {
    fills,
    equityCurve: equityCurve.map(v => v / initialCash),
    finalEquity,
    totalReturnPct: (finalEquity / initialCash - 1) * 100,
    totalFee: fills.reduce((a, f) => a + f.fee, 0),
    totalSlippageCost: fills.reduce((a, f) => a + f.slippageCost, 0),
    tradeCount: fills.length,
    unfilledCount,
    cash,
    position,
  }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 成本及最小采用如何判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

当前观察，不把现有pipeline当研究结论产线。先使用已知固定离线数据，手算单指标、次根信号、完整平仓资金守恒、乱序订单/满仓加费和不同bar周期年化；修正或明确这些口径并经独立基准对照后，再用公开数据做非交易演示。不能因作者测试数/绿CI或纯函数声明跳过数值反例。目标包主入口声明lib，而固定源码checkout无对应构建文件，发布记录还区分candidate/tag/npm；本轮未构建/安装，实际可装载性仍未知。

首次成本是兼容DSH tools/schema与构建版本、准备合法数据/快照及数值基准；持续有行情网络、计算/数组内存、Agent上下文与人工研究核对，免费接口不等于零成本。离线算术本身不主动调LLM，但模型调用工具和读取长报告有宿主费用；固定资本和基金费是模拟，不是用户支出。金额/性能/节时未测。若资金不守恒、来源/闭合/年化不清或结果不可复算，就停用相关回测/报告，回成熟库与独立脚本；不连接实盘。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:17-31](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/package.json#L17-L31)

lib入口声明。

<details>
<summary>查看原文（15行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    }
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "files": [
    "lib",
```

</details>

**依据 2 · 作者声明**：[README.md:91-105](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/README.md#L91-L105)

作者区分candidate、tag与registry，非本轮安装证据。

<details>
<summary>查看原文（15行）</summary>

```text
The **0.91.1 release candidate** includes DSH 0.2.1-rc.2 compatibility, with
0.1.0-rc.6 / 0.2.0-rc.2 / 0.2.1-alpha.3 coverage retained. npm was still at
0.90.0 when this candidate was prepared on 2026-10-18. Check the
[delivery record](docs/maintenance/RELEASE-0.91.1-2026-10-18.md) and
`npm view dsh-quant version` before treating the fix as published.
Original compatibility contribution: **@hufeide (#136)**; user reports:
**@ziladan (#139 / #140)**.

The `v0.91.1` tag is fixed to the reviewed source. Its first authenticated
publisher attempt failed with npm E404, so the tag is **not** evidence of npm
availability. See [delivery attempt](release/0.91.1/DELIVERY-ATTEMPT.md).
Maintainers can manually run `release acceptance` with `source=candidate`
to reproduce the Linux package, or `source=registry` after publication to
verify four clean real-Loader consumers. The workflow never publishes.

```

</details>

**依据 3 · 源码核查**：[src/dsh-ml/backtest.ts:85-145](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/backtest.ts#L85-L145)

资金复算先决。

<details>
<summary>查看原文（61行）</summary>

```text
      holding = true
      entryIndex = i
      entryPrice = close[i]!
      cash *= 1 - feeRate
    }
    if (pendingExit && holding) {
      const exitPrice = close[i]!
      cash *= 1 - feeRate
      trades.push({
        entryIndex: entryIndex!,
        entryPrice,
        exitIndex: i,
        exitPrice,
        returnPct: exitPrice / entryPrice - 1,
        exitReason: 'signal',
      })
      holding = false
      entryIndex = null
    }
    if (holding) {
      const reason = stopTargetReason(close, i, entryPrice, stopLoss, takeProfit)
      if (reason !== undefined) {
        const exitPrice = close[i]!
        cash *= 1 - feeRate
        trades.push({
          entryIndex: entryIndex!,
          entryPrice,
          exitIndex: i,
          exitPrice,
          returnPct: exitPrice / entryPrice - 1,
          exitReason: reason,
        })
        holding = false
        entryIndex = null
      }
    }
    pendingEntry = false
    pendingExit = false

    // 2) 本根确认交叉信号（下一根成交）
    const prevValid = i > 0 && fastMa[i - 1] !== null && slowMa[i - 1] !== null
    const curValid = fastMa[i] !== null && slowMa[i] !== null
    if (prevValid && curValid) {
      const prevFast = fastMa[i - 1]!
      const prevSlow = slowMa[i - 1]!
      const curFast = fastMa[i]!
      const curSlow = slowMa[i]!
      const crossUp = prevFast <= prevSlow && curFast > curSlow
      const crossDown = prevFast >= prevSlow && curFast < curSlow
      if (crossUp && !holding) pendingEntry = true
      else if (crossDown && holding) pendingExit = true
    }

    // 3) 记录本根持仓与市值
    position[i] = holding ? 1 : 0
    equityCurve[i] = holding ? cash * (close[i]! / entryPrice) : cash
  }

  // 尾部未平仓：记录 open trade
  if (holding) {
    trades.push({
```

</details>

**依据 4 · 源码核查**：[src/dsh-execution/pipeline.ts:86-125](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L86-L125)

网络/本地数据及固定模拟参数。

<details>
<summary>查看原文（40行）</summary>

```text
  const limit = options.limit ?? 120
  const provider = options.provider ?? 'binance'
  let symbol = options.symbol ?? 'BTCUSDT'
  let candles: Candle[]
  if (options.candles !== undefined && options.candles.length > 0) {
    candles = [...options.candles]
  } else {
    candles = await fetchWithFallback(symbol, interval, limit, signal, provider)
    symbol = options.symbol ?? 'BTCUSDT'
  }
  if (candles.length < 30) throw new RangeError(`pipeline needs at least 30 candles, got ${candles.length}`)
  const close = candles.map(c => c.close)
  const fast = options.fast ?? 5
  const slow = options.slow ?? 20
  if (fast >= slow) throw new RangeError(`fast ${fast} must be < slow ${slow}`)

  const quality = candlesCheck(candles)
  const stats = seriesStats(close)
  const smaValues = sma(close, slow)
  const bt = backtestMaCross(close, fast, slow, options.feeRate ?? 0.001, options.stopLoss, options.takeProfit)
  const em = equityMetrics(bt.equityCurve)
  const tm = tradeMetrics(bt.trades)
  const returns = close.slice(1).map((c, i) => c / close[i]! - 1)
  const rk = riskMetrics(returns, { confidence: 0.95 })
  const dd = drawdownAnalysis(bt.equityCurve)
  const fund = fundSimulate(bt.equityCurve, {
    initialCapital: options.initialCapital ?? 100_000_000,
    managementFeeRate: 0.02,
    performanceFeeRate: 0.2,
  })

  // 动量因子：close[t]/close[t-12]-1 预测 close[t+1]/close[t]-1
  const factorWindow = options.factorWindow ?? 20
  const f: number[] = []
  const r: number[] = []
  for (let t = 12; t < close.length - 1; t++) {
    f.push(close[t]! / close[t - 12]! - 1)
    r.push(close[t + 1]! / close[t]! - 1)
  }
  const fe = f.length >= 2 ? factorEvaluate(f, r, 5, Math.min(factorWindow, f.length)) : null
```

</details>

**依据 5 · 源码核查**：[src/index.ts:3069-3091](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/index.ts#L3069-L3091)

宿主调用预算。

<details>
<summary>查看原文（23行）</summary>

```text
        }]
      },
    },
    isConcurrencySafe: () => true,
    async execute(args, exec) {
      const signal = AbortSignal.any([exec.signal, AbortSignal.timeout(20_000)])
      return researchPipeline({
        symbol: args.symbol,
        interval: args.interval,
        limit: args.limit,
        provider: args.provider,
        candles: args.candles,
        fast: args.fast,
        slow: args.slow,
        feeRate: args.feeRate,
        stopLoss: args.stopLoss,
        takeProfit: args.takeProfit,
        factorWindow: args.factorWindow,
        initialCapital: args.initialCapital,
      }, signal) as never
    },
  }))
}
```

</details>

#### 缺口

- 没有独立数值运行、构建加载、性能/净费用与采用对照。
  **影响**：暂不支持输出可用于决策的研究报告。
  **进一步探讨**：先以手算与可信库检验上述反例，再评宿主演示和总核对成本。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 什么改进值得验证？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是让研究结果携带不可省略的“数据与计算口径清单”：实际来源/抓取时间/闭合截止、输入哈希、bar年化周期、资金守恒检查和各报告块的对象（标的或策略）；关键校验失败时报告明确不可采信。现状质量字段虽存在，但没有阻断错误扩散，fallback与周期又丢上下文；单加免责声明不能恢复这些事实。

先修数值实现再验证清单，不能靠报告包装掩盖平仓缺陷。最小对照包括固定已平仓盈亏、fallback、未闭合末根、小时bar、乱序订单与不同fees；比较来源/口径误判、资金差异定位时间、额外存储与人工维护。代价是结果契约/版本兼容、来源快照和校验规则维护；若已知样本仍错判或维护明显超过诊断增量，就否定清单方案。无用户或商业验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/dsh-execution/pipeline.ts:57-80](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L57-L80)

实际来源丢失。

<details>
<summary>查看原文（24行）</summary>

```text
/** 加密三所容错链（去重；A 股 provider 直接单点，失败即报错）。 */
async function fetchWithFallback(
  symbol: string,
  interval: Interval,
  limit: number,
  signal: AbortSignal,
  provider: MarketProvider,
): Promise<Candle[]> {
  if (provider === 'sina' || provider === 'tencent') {
    return fetchKlines(symbol, interval, limit, signal, provider)
  }
  const chain = [...new Set([provider, 'binance', 'okx', 'bybit'] as MarketProvider[])]
  let lastError: unknown
  for (const p of chain) {
    try {
      return await fetchKlines(symbol, interval, limit, signal, p)
    } catch (err) {
      lastError = err
    }
  }
  throw new Error(`all providers failed for ${symbol}: ${(lastError as Error).message}`)
}

/** 跑通全链路研究：返回可直接消费的结果包（含 Markdown 报告与图表数据）。 */
```

</details>

**依据 2 · 源码核查**：[src/dsh-execution/pipeline.ts:102-115](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-execution/pipeline.ts#L102-L115)

quality计算后继续；策略净值供指标/回撤/基金，标的close收益供risk。

<details>
<summary>查看原文（14行）</summary>

```text
  const quality = candlesCheck(candles)
  const stats = seriesStats(close)
  const smaValues = sma(close, slow)
  const bt = backtestMaCross(close, fast, slow, options.feeRate ?? 0.001, options.stopLoss, options.takeProfit)
  const em = equityMetrics(bt.equityCurve)
  const tm = tradeMetrics(bt.trades)
  const returns = close.slice(1).map((c, i) => c / close[i]! - 1)
  const rk = riskMetrics(returns, { confidence: 0.95 })
  const dd = drawdownAnalysis(bt.equityCurve)
  const fund = fundSimulate(bt.equityCurve, {
    initialCapital: options.initialCapital ?? 100_000_000,
    managementFeeRate: 0.02,
    performanceFeeRate: 0.2,
  })
```

</details>

**依据 3 · 源码核查**：[src/dsh-ml/metrics.ts:31-59](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/metrics.ts#L31-L59)

周期假设常量。

<details>
<summary>查看原文（29行）</summary>

```text
export function equityMetrics(equityCurve: readonly number[]): EquityMetrics {
  const n = equityCurve.length
  if (n < 2) throw new RangeError(`equityCurve needs >= 2 points, got ${n}`)
  const totalReturnPct = (equityCurve[n - 1]! / equityCurve[0]! - 1) * 100
  // 逐期收益
  const rets: number[] = []
  for (let i = 1; i < n; i++) rets.push(equityCurve[i]! / equityCurve[i - 1]! - 1)
  const mean = rets.reduce((a, b) => a + b, 0) / rets.length
  const variance = rets.reduce((a, x) => a + (x - mean) ** 2, 0) / rets.length
  const std = Math.sqrt(variance)
  const sharpe = std === 0 ? 0 : (mean / std) * Math.sqrt(365)
  const annualizedVol = std * Math.sqrt(365) * 100
  // 最大回撤
  let peak = equityCurve[0]!
  let maxDd = 0
  for (const v of equityCurve) {
    if (v > peak) peak = v
    const dd = (peak - v) / peak
    if (dd > maxDd) maxDd = dd
  }
  const maxDrawdownPct = maxDd * 100
  // 年化收益（按期数推算，日频假设 365）
  const annualReturn = (Math.pow(equityCurve[n - 1]! / equityCurve[0]!, 365 / (n - 1)) - 1) * 100
  const calmar = maxDd === 0 ? 0 : annualReturn / maxDrawdownPct
  // 下行波动（只取负收益）
  const downs = rets.filter(r => r < 0)
  const downVar = downs.length === 0 ? 0 : downs.reduce((a, x) => a + x ** 2, 0) / rets.length
  const downStd = Math.sqrt(downVar)
  const sortino = downStd === 0 ? 0 : (mean / downStd) * Math.sqrt(365)
```

</details>

**依据 4 · 源码核查**：[src/dsh-ml/backtest.ts:85-145](https://github.com/pengpengyi92/dsh-quant/blob/8bf174d3587f9df27608e5759b979eb00abe0927/src/dsh-ml/backtest.ts#L85-L145)

资金守恒必须先修。

<details>
<summary>查看原文（61行）</summary>

```text
      holding = true
      entryIndex = i
      entryPrice = close[i]!
      cash *= 1 - feeRate
    }
    if (pendingExit && holding) {
      const exitPrice = close[i]!
      cash *= 1 - feeRate
      trades.push({
        entryIndex: entryIndex!,
        entryPrice,
        exitIndex: i,
        exitPrice,
        returnPct: exitPrice / entryPrice - 1,
        exitReason: 'signal',
      })
      holding = false
      entryIndex = null
    }
    if (holding) {
      const reason = stopTargetReason(close, i, entryPrice, stopLoss, takeProfit)
      if (reason !== undefined) {
        const exitPrice = close[i]!
        cash *= 1 - feeRate
        trades.push({
          entryIndex: entryIndex!,
          entryPrice,
          exitIndex: i,
          exitPrice,
          returnPct: exitPrice / entryPrice - 1,
          exitReason: reason,
        })
        holding = false
        entryIndex = null
      }
    }
    pendingEntry = false
    pendingExit = false

    // 2) 本根确认交叉信号（下一根成交）
    const prevValid = i > 0 && fastMa[i - 1] !== null && slowMa[i - 1] !== null
    const curValid = fastMa[i] !== null && slowMa[i] !== null
    if (prevValid && curValid) {
      const prevFast = fastMa[i - 1]!
      const prevSlow = slowMa[i - 1]!
      const curFast = fastMa[i]!
      const curSlow = slowMa[i]!
      const crossUp = prevFast <= prevSlow && curFast > curSlow
      const crossDown = prevFast >= prevSlow && curFast < curSlow
      if (crossUp && !holding) pendingEntry = true
      else if (crossDown && holding) pendingExit = true
    }

    // 3) 记录本根持仓与市值
    position[i] = holding ? 1 : 0
    equityCurve[i] = holding ? cash * (close[i]! / entryPrice) : cash
  }

  // 尾部未平仓：记录 open trade
  if (holding) {
    trades.push({
```

</details>

#### 缺口

- 未实现/对照口径清单。
  **影响**：不能确认改善可复算性值得维护。
  **进一步探讨**：先封闭数值问题，再开展上述对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
