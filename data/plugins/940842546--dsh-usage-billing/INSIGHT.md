# dsh-usage-billing

> 统计DSH的DeepSeek模型调用与估算消费，提供预算提醒、历史回填、导出和余额展示。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d16e244](https://github.com/940842546/dsh-usage-billing/tree/d16e2445a8021814765fec14912507da6cafecae)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/940842546/dsh-usage-billing) [![npm 30d 1,231](https://img.shields.io/static/v1?label=npm+30d&message=1%2C231&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-usage-billing) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-usage-billing)
<!-- END META -->

**使用建议**：适合本机单实例做大致用量观察。先把模型映射和价格与实际账单核对，未知项单独检查；告警只提醒，不会自动阻止超预算调用。

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

- **用途**：自管DSH用户想按会话理解模型花费，合格结果是token来源、计价版本与官方账单可对齐，估算与实际扣费必须区分。

- **建议**：由可配置价格与未知归零推导，可将“已计价/未计价/usage缺失”分账，价格表绑定生效日期与来源，并用官方账单差额校准。未验证假设是减少被低估的预算决策。用未知模型、缺usage、调价跨界和缓存字段缺失事件对照账单，若仍把未知金额合入零则否定。

适合本机单实例做大致用量观察。先把模型映射和价格与实际账单核对，未知项单独检查；告警只提醒，不会自动阻止超预算调用。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

供应商账单更权威但会话归属少；自行统计日志可实现相同基础，插件提供就近观测界面。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：usage_billing查询本地统计。
- **事件监听**：llm/stream用量采集。
- **界面**：预算、会话/日期统计与导出界面。
- **后台**：周期余额刷新与预算提醒。

**流程与依赖**

需要宿主llm事件与会话日志、FS，余额需现有DeepSeek key和官方端点；正确估费依赖usage字段、价格表、时区与模型映射。

采集每次调用并选价格段、聚合保存与触发阈值通知；启动回填历史，用户从会话/日期看明细并导出，最终与供应商账单对照。

**效果与成本**

读取日志、存储与定时余额HTTP有资源成本；首次需核对价格/时区与模型映射，持续对账和维护价格有人工成本。无实际预算改善证据。

可帮助定位高消费会话和观察预算，不能保证供应商最终扣费、未来续航天数或财务准确性。

- **思考**：缺失价格或usage会不会显示得像免费？classifyModel仅用flash/pro子串，其余other；recordUsage找不到价格回落hit/miss/out全0，num也将非数值回为0。因此真实未知模型可能有调用但估费为0，不能据此结算或宣称免费。当前官方价格未在本轮独立核实，内置规则只能作为固定版本作者配置。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对只看单次token，增量是把历史、时间价格段、预算阈值和会话组织为持续消费视图。它是本地估算与观测，不是供应商账单或费用硬上限。

相对只看单次token，增量是把历史、时间价格段、预算阈值和会话组织为持续消费视图。它是本地估算与观测，不是供应商账单或费用硬上限。

历史回填、阈值去重提醒、聚合与导出便于对账；temp副本是恢复手段而非原子多实例存储。把未知转换0和模型子串归类值得改造，复用计费逻辑需版本化与显式unknown。 源码依据：[lib/index.js](https://github.com/940842546/dsh-usage-billing/blob/d16e2445a8021814765fec14912507da6cafecae/lib/index.js)、[lib/client.js](https://github.com/940842546/dsh-usage-billing/blob/d16e2445a8021814765fec14912507da6cafecae/lib/client.js)。

<a id="detail-section-5"></a>

### 主要限制

缺失价格或usage会不会显示得像免费？classifyModel仅用flash/pro子串，其余other；recordUsage找不到价格回落hit/miss/out全0，num也将非数值回为0。因此真实未知模型可能有调用但估费为0，不能据此结算或宣称免费。当前官方价格未在本轮独立核实，内置规则只能作为固定版本作者配置。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[940842546/dsh-usage-billing](https://github.com/940842546/dsh-usage-billing)
- **版本号**：0.9.5（[固定提交 d16e2445](https://github.com/940842546/dsh-usage-billing/tree/d16e2445a8021814765fec14912507da6cafecae)）
- **版本日期**：2026-09-29（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定合成usage只作隔离测试，覆盖未知模型、缺字段、缓存拆分、调价边界与重复回填；用真实脱敏账单另做金额对齐，不能以图表显示作通过。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由可配置价格与未知归零推导，可将“已计价/未计价/usage缺失”分账，价格表绑定生效日期与来源，并用官方账单差额校准。未验证假设是减少被低估的预算决策。用未知模型、缺usage、调价跨界和缓存字段缺失事件对照账单，若仍把未知金额合入零则否定。

固定合成usage只作隔离测试，覆盖未知模型、缺字段、缓存拆分、调价边界与重复回填；用真实脱敏账单另做金额对齐，不能以图表显示作通过。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：96aaa0f15bfc41ea16fcf7e114b312d60f08073b269eb7b26cfdb3964e7e2a70。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3195 | 2918 | 133 | — |
| .md | source | 3 | 351 | — | — | 3912 |
| .mjs | test | 3 | 368 | 312 | 31 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/940842546/dsh-usage-billing/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
