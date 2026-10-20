# dsh-plugin-nlbi

> 在 DSH 中用自然语言查询 MySQL，生成表格、图表与可保存报表。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[232f924](https://github.com/1byteone/dsh-plugin-nlbi/tree/232f9243029add39dd18a368de45d8326aca178f)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/1byteone/dsh-plugin-nlbi) · [![npm 30d 917](https://img.shields.io/static/v1?label=npm+30d&message=917&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-nlbi)
<!-- END META -->

**使用建议**：适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

贡献机制有固定源码支持；效果与采用收益为条件性解释，后续设计假设尚未验证。

[重点创新推演与最小验证](#innovation)

- **用途**：业务分析人员想把问题转为 MySQL 查询和可重跑报表；合格交付是业务口径正确、权限允许且可复核的SQL结果。

采用建议：适合有可复核SQL和只读数据环境的分析任务；先定义关键指标标准答案，核对生成SQL再复用报表。

参照继承的dsh-mysql、人工SQL与普通数据库客户端；未核验独立业务用户成效。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：nl_query、sql_to_chart（源码注册）
- **界面**：数据浏览器与报表展示

**流程与依赖**

需要MySQL只读账号、DSH模型路由与node-sql-parser；可写能力还取决于连接allowWrite。表结构/样例数据可能进入模型提示，需按数据权限配置。

建连接与权限，选择会话连接，提问后读取Schema并生成/校验SQL，执行并渲染；保存报表后重跑仍须核对当前Schema和业务口径；错误返回SQL与解释供修订。

**效果与成本**

模型调用、数据库负载和报表保存为现金/资源成本；人工包括账户权限配置、指标定义、SQL与图表核验。只读和2000行上限并不保证查询低成本。

把答案、SQL和图表一起交付有利于复核；没有同条件证明降低分析工时，更不能替代指标负责人。

- **思考**：最影响贡献成立的是语法安全与指标正确的区别：text2sql.js 校验后直接 pool.query，AST能限制语句和表，却不能验证“活跃用户”时间窗、重复JOIN和统计口径。空allowlist意味着不限制，不能把默认配置理解为最小授权。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：作者明确继承 dsh-mysql v0.1.4，数据库连接和原有 mysql 工具不算本插件原创；新增贡献是 Text2SQL、AST护栏、BI与报表复用串联，相对裸SQL对话提高可检查性。

作者明确继承 dsh-mysql v0.1.4，数据库连接和原有 mysql 工具不算本插件原创；新增贡献是 Text2SQL、AST护栏、BI与报表复用串联，相对裸SQL对话提高可检查性。

lib/sqlsafe.js 用AST处理语句和表引用、解析失败拒绝白名单校验，优于只用正则；lib/text2sql.js 将模型失败与校验失败分开返回，方便纠错。安全校验与语义验收应保持分层，复用成本包括方言及复杂查询覆盖。 源码：[lib/sqlsafe.js](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/sqlsafe.js)、[lib/text2sql.js](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/text2sql.js)、[lib/index.js](https://github.com/1byteone/dsh-plugin-nlbi/blob/232f9243029add39dd18a368de45d8326aca178f/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

最影响贡献成立的是语法安全与指标正确的区别：text2sql.js 校验后直接 pool.query，AST能限制语句和表，却不能验证“活跃用户”时间窗、重复JOIN和统计口径。空allowlist意味着不限制，不能把默认配置理解为最小授权。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- 已检查：作者 README、包清单、源码路径 lib/sqlsafe.js、lib/text2sql.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定提交的所列核心实现与作者材料；未运行插件、安装、测试或真实宿主验收，未确认独立用户效果。
- 下一步：用带标准SQL和人工业务口径的一组问题，比较直接Text2SQL与指标模板约束；加入多表重复计数、日期边界和空白名单，测数值正确率、拒绝率与人工审核时间。若维护成本高于修SQL则保留专家人工流程。

**分析版本**

- **仓库**：[1byteone/dsh-plugin-nlbi](https://github.com/1byteone/dsh-plugin-nlbi)
- **版本号**：0.2.1（[固定提交 232f924](https://github.com/1byteone/dsh-plugin-nlbi/tree/232f9243029add39dd18a368de45d8326aca178f)）
- **版本日期**：2026-08-25（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：把已批准指标口径与SQL结构绑定成可复用语义模板，能降低报表重跑中的口径漂移；来自自然语言问题到AST安全检查之间的语义缺口。需要指标负责人维护模板，不能由模型自审当真值。

用带标准SQL和人工业务口径的一组问题，比较直接Text2SQL与指标模板约束；加入多表重复计数、日期边界和空白名单，测数值正确率、拒绝率与人工审核时间。若维护成本高于修SQL则保留专家人工流程。

<a id="detail-section-8"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1169 | — | — | 8784 |
| .cjs | source | 2 | 110 | 83 | 12 | — |
| .js | source | 10 | 7602 | 6033 | 1033 | — |
| .mjs | source | 1 | 61 | 41 | 12 | — |
| .mjs | test | 12 | 2447 | 1886 | 219 | — |
| .md | example | 1 | 134 | — | — | 766 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-20），可前往 [GitHub Issues](https://github.com/1byteone/dsh-plugin-nlbi/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
