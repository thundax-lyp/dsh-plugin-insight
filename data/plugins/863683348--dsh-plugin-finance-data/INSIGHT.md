# dsh-plugin-finance-data

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[0a10267](https://github.com/863683348/dsh-plugin-finance-data/tree/0a10267fa6f8f75da68005406b899894b60dd796)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-finance-data) [![npm 30d 1,023](https://img.shields.io/static/v1?label=npm+30d&message=1%2C023&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-finance-data) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-finance-data)
<!-- END META -->

> **实现功能**：对调用者提供的财务数字执行格式化、收益、比率、风险和组合计算。

> **核心亮点**：作者希望把财务算术从模型自由生成中分离；实际增量是提供确定函数与结构返回，便于检查输入输出。相比让模型心算，方向合理；但当前工具壳与计算函数单位契约和长期投影存在明确源码问题，不能承诺算术正确。

> **风险与缺陷**：computeRatio的roe/roa/利润率已乘100，index再以percent=true调用formatNumber乘100；例如10/100应表达10%，这条路径会显示1000%。projectPlan默认steps=12并令total=min(periods,steps)，years>1的月度计划仍只累计12期却标完整年数；index未暴露steps覆盖。portfolio targets/values声明additionalProperties:false却无已声明资产键，也需宿主schema验收。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 场景与替代办法](#detail-section-2)
  - [1.2 能力、依赖与流程](#detail-section-3)
  - [1.3 成本与效果](#detail-section-4)
  - [1.4 工程亮点](#detail-section-5)
  - [1.5 用途与适用场景](#detail-section-6)
  - [1.6 能力、流程与成本](#detail-section-7)
  - [1.7 工程贡献](#detail-section-8)
  - [1.8 使用建议](#detail-section-9)
  - [1.9 核查说明与分析版本](#detail-section-10)
- [2 未来设计假设（未验证）](#detail-section-11)
- [3 辅助信息](#detail-section-12)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 场景与替代办法

替代是受审阅电子表格或成熟金融计算库；项目新增DSH工具封装而非新财务方法或数据源。

<a id="detail-section-3"></a>

### 1.2 能力、依赖与流程

lib/index.js注册finance_data并把参数交给finance.js纯计算；formatNumber处理小数/百分比，computeRatio算比率，projectPlan生成分期表，riskMetrics基于输入收益序列算样本指标。

- **模型工具**：finance_data格式化、财务比率、风险、投影与组合计算

宿主tools/systemPrompt与Schemastery；调用者提供实际数据、期间、币种和定义，插件不连接行情服务、不执行订单。

模型收集数据→选择action并传数值→纯函数计算→index格式化输出→人工核单位和期间；当前比率显示与长期投影应停止用于实际结论。

<a id="detail-section-4"></a>

### 1.3 成本与效果

首次需整理可信数据和每个指标单位；无模块网络成本，模型token另计。错误百分数及投影会带来高人工复核与返工成本，现金收益没有证据，不用于真实资金决策。

确定计算接口可减少自由算术，但上述接线缺陷使当前结果存在实质误导风险，未验证业务收益。

<a id="detail-section-5"></a>

### 1.4 工程亮点

纯finance函数与薄工具壳本应便于测试，实际显示函数单测不能替代端到端单位检查；函数显式抛部分无效输入是可借鉴点，尚需统一所有指标的量纲及时间口径。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/index.js)、[lib/finance.js](https://github.com/863683348/dsh-plugin-finance-data/blob/0a10267fa6f8f75da68005406b899894b60dd796/lib/finance.js)。

<a id="detail-section-6"></a>

### 1.5 用途与适用场景

> **用途**：适合需要可检查的财务算术草稿，不提供行情抓取、实际交易或投资判断。

<a id="detail-section-7"></a>

### 1.6 能力、流程与成本

**能力**

- **模型工具**：finance_data格式化、财务比率、风险、投影与组合计算

> **思考**：computeRatio的roe/roa/利润率已乘100，index再以percent=true调用formatNumber乘100；例如10/100应表达10%，这条路径会显示1000%。projectPlan默认steps=12并令total=min(periods,steps)，years>1的月度计划仍只累计12期却标完整年数；index未暴露steps覆盖。portfolio targets/values声明additionalProperties:false却无已声明资产键，也需宿主schema验收。

<a id="detail-section-8"></a>

### 1.7 工程贡献

> **亮点**：作者希望把财务算术从模型自由生成中分离；实际增量是提供确定函数与结构返回，便于检查输入输出。相比让模型心算，方向合理；但当前工具壳与计算函数单位契约和长期投影存在明确源码问题，不能承诺算术正确。

<a id="detail-section-9"></a>

### 1.8 使用建议

当前仅作源码和计算接口参考。先修复百分数二次放大与长期计划截断，并用手算样本核对；工具不抓取或验证数据来源。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-10"></a>

### 1.9 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[863683348/dsh-plugin-finance-data](https://github.com/863683348/dsh-plugin-finance-data)
- **版本号**：0.3.2（[固定提交 0a10267f](https://github.com/863683348/dsh-plugin-finance-data/tree/0a10267fa6f8f75da68005406b899894b60dd796)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/finance.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：在固定宿主对比10/100比率、零利率五年60期定投、负数/零分母和多资产schema；本轮仅源码推导，未运行目标代码。

<a id="detail-section-11"></a>

## 2 未来设计假设（未验证）

待验证假设：把量纲、小数/百分数和投影期数写进可校验类型契约，可比增加更多指标更有效地减少财务工具错误。用10/100比率和五年月度零收益定投等可手算样本，先验证各层单位及60期累计一致，再评估实际数据任务。

在固定宿主对比10/100比率、零利率五年60期定投、负数/零分母和多资产schema；本轮仅源码推导，未运行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a837657d83aac6f337f7e325c6d04f7493885962871ef29c963b97783e488998。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 480 | 426 | 34 | — |
| .md | source | 4 | 160 | — | — | 1356 |
| .mjs | test | 1 | 178 | 150 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-12"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-finance-data/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
