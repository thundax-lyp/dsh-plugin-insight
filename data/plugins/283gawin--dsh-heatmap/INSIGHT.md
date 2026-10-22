# dsh-activity-heatmap

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[4ba131d](https://github.com/283Gawin/dsh-heatmap/tree/4ba131df0980c8c8af72901ca9fa0f31accb9a6d)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/283Gawin/dsh-heatmap)
<!-- END META -->

> **实现功能**：在 DSH 侧栏展示活动热力图、Token 用量、缓存命中和估算花费。

> **核心亮点**：相对分别查看日志和Git记录，增量是将模型用量、缓存与开发活动聚合到常驻侧栏；纯聚合与宿主扫描分离，重复turn/step记录替换而非累加。

> **风险与缺陷**：README仍称90天，但stats-service的WINDOW_DAYS为365，实际范围需以源码为准；模型定价和usage字段口径决定估算准确性，最近模型名归因与缺失字段补0不能证明财务完整。提交量也不能代表交付价值。 pricing.ts对未知模型使用DEFAULT_PRICE而非未知值，因此新模型也会显示貌似精确的估算。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望回顾本机使用节奏的开发者将会话用量与Git提交按日查看；交付是观测面板而非财务账单或生产力排名。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照手工session日志及git log汇总；未对TokenTracker原实现独立比较，作者引用的价格不能充当当前官方价格验证。

官方sessionPersistence读取durable事件，按turn/step归并assistant usage并归属最近请求模型；工作区git log计数，经TTL缓存和REST提供日桶统计。


DSH sessionPersistence、subprocess、web路由与客户端挂载；设置卡片白名单修改为作者声明的额外维护条件。

扫描会话和工作区，按本机日历归桶，套用价格表，缓存快照供侧栏切维度；缺失来源需人工核对。

现金未见独立付费依赖；人工需维护定价、核对usage口径与宿主设置白名单，扫描历史日志和Git占本地资源。

方便发现异常用量日期；花费估算与提交活跃度不能推出投入产出。

**能力**

- **后台**：会话Token/缓存/模型估算成本及Git提交日聚合
- **界面**：侧栏热力图

> **思考**：README仍称90天，但stats-service的WINDOW_DAYS为365，实际范围需以源码为准；模型定价和usage字段口径决定估算准确性，最近模型名归因与缺失字段补0不能证明财务完整。提交量也不能代表交付价值。 pricing.ts对未知模型使用DEFAULT_PRICE而非未知值，因此新模型也会显示貌似精确的估算。

<a id="detail-section-4"></a>

### 1.3 工程贡献

aggregate纯函数将归因、去重、日桶解耦；StatsService有单飞扫描和日志签名缓存。复用需明确时间区与同模型不同供应商价格差异。 源码依据：[src/core/aggregate.ts](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/aggregate.ts#L29)、[src/core/pricing.ts](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/core/pricing.ts#L201)、[src/host/stats-service.ts](https://github.com/283Gawin/dsh-heatmap/blob/4ba131df0980c8c8af72901ca9fa0f31accb9a6d/src/host/stats-service.ts#L53)。

> **亮点**：相对分别查看日志和Git记录，增量是将模型用量、缓存与开发活动聚合到常驻侧栏；纯聚合与宿主扫描分离，重复turn/step记录替换而非累加。

<a id="detail-section-5"></a>

### 1.4 使用建议

适合个人趋势观察；先与少量原始usage和实际账单核对，不用于财务结算或绩效评价。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[283Gawin/dsh-heatmap](https://github.com/283Gawin/dsh-heatmap)
- **版本号**：0.1.0（[固定提交 4ba131d](https://github.com/283Gawin/dsh-heatmap/tree/4ba131df0980c8c8af72901ca9fa0f31accb9a6d)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：在日桶同时显示已知价格覆盖率、缺失usage及源日志范围，能减少用户把估算当账单；由当前模型归因与静态定价依赖推导，需额外覆盖信息而非更多漂亮图表。

最小验证：合成具有已知账单的缺失usage、重复step、跨日和未知模型记录，比较覆盖提示前后账单误读；以原始记录精确对账，覆盖未知仍显示精确费用则假设失败。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2198 | 2040 | 205 | — |
| .md | source | 1 | 164 | — | — | 1507 |
| .ts | source | 14 | 1878 | 1318 | 410 | — |
| .tsx | source | 2 | 62 | 58 | 0 | — |
| .ts | test | 1 | 190 | 166 | 14 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/283Gawin/dsh-heatmap/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
