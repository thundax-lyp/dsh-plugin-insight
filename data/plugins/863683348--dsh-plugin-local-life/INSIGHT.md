# dsh-plugin-local-life

> 提供预算、分账、单价、折扣、单位、账本和分期等日常计算辅助。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[c7abe09](https://github.com/863683348/dsh-plugin-local-life/tree/c7abe0935ceab43d784019fb42caf600b3aaadc5)

<!-- BEGIN META -->
[![npm 30d 857](https://img.shields.io/static/v1?label=npm+30d&message=857&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-local-life) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-local-life)
<!-- END META -->

**使用建议**：适合日常计算草稿。先用已知答案核单位和取整，实际分账总和再加一遍；出行要求另查当前官方信息。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是计算器、电子表格和人工清单；项目提供对话工具入口，覆盖浅于专业账务或行程服务。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册local_life按action调用local.js；代码做金额取整、单位因子换算、折扣规则、贷款表与静态出行清单，不做网络请求或账本持久化。

- **模型工具**：local_life预算、分账、换算、账本汇总和分期辅助

宿主tools/systemPrompt、Schemastery；数字、币种、单位和规则由调用者提供，不接银行、地图或商家数据库。

整理用户数字和规则→调用action→确定计算或静态清单→人工核单位和合计→再实际支付/出行；插件不执行支付。

<a id="detail-section-4"></a>

### 成本与效果

首次需确认币种、单位与折扣语义；无模块网络费，宿主模型token另计。人工要核取整、满减门槛和贷款口径，错误参数及一分钱差额都可能增加协调成本。

可减少重复输入计算器，但没有节时或账务准确率的独立对照。

<a id="detail-section-5"></a>

### 工程亮点

local纯函数集中并有部分输入约束，便于复用；单位归一化与因子表不一致、浮点尾差说明必须验证跨函数契约。无需文件副作用是轻量点，不能因此称计算全正确。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/index.js)、[lib/local.js](https://github.com/863683348/dsh-plugin-local-life/blob/c7abe0935ceab43d784019fb42caf600b3aaadc5/lib/local.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合把已有购物、分账或账本数字交给确定函数处理；不是本地商家、实时价格或交通信息服务。

- **建议**：待验证假设：用规范化单位注册表与最小货币单位整数分配，可减少别名不一致和分账差额。对L/l/升别名、10元三人和带小费加权分账做守恒核对，再比较人工纠错；未验证，不将浮点计算称精确账务。

适合日常计算草稿。先用已知答案核单位和取整，实际分账总和再加一遍；出行要求另查当前官方信息。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：local_life预算、分账、换算、账本汇总和分期辅助

- **思考**：unitConvert先将输入单位转小写，而UNIT_FACTORS.volume保存L大写键，导致L/升与ml等组合可能因l找不到而拒绝。splitBill仅在舍入差额绝对值>0.01时修正，账单10元三人各3.33的0.01差额可能保留，不能保证分摊和精确等于总额。出行清单是静态模板，不是现行规则核实。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者定位日常算术工具；实际增量是把常用生活计算封成统一DSH入口并返回文字/结构结果，减少模型自由心算。相比手工计算器，模型可整理输入；不是新的预算方法或自动记账平台。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-local-life](https://github.com/863683348/dsh-plugin-local-life)
- **版本号**：0.3.2（[固定提交 c7abe093](https://github.com/863683348/dsh-plugin-local-life/tree/c7abe0935ceab43d784019fb42caf600b3aaadc5)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/local.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：核对L/升/ml别名、分摊守恒、无效roundTo、负折扣和零利率分期，按真实规则复核清单；本轮未执行目标代码。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：用规范化单位注册表与最小货币单位整数分配，可减少别名不一致和分账差额。对L/l/升别名、10元三人和带小费加权分账做守恒核对，再比较人工纠错；未验证，不将浮点计算称精确账务。

核对L/升/ml别名、分摊守恒、无效roundTo、负折扣和零利率分期，按真实规则复核清单；本轮未执行目标代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：cfd1c3b774e3cf07ac017068fa627cfc0cb9006e4edfe4c87340afe979de4eb0。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 554 | 497 | 35 | — |
| .md | source | 4 | 160 | — | — | 1341 |
| .mjs | test | 1 | 200 | 175 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-local-life/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
