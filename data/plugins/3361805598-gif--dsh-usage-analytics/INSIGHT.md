# dsh-usage-analytics

> 在 DSH 设置页展示本机 Token、模型分布和技能调用状态。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6b44b37](https://github.com/3361805598-gif/dsh-usage-analytics/tree/6b44b372e475188acd71feef81e8451b70c05483)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/3361805598-gif/dsh-usage-analytics)
<!-- END META -->

**使用建议**：适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [核查说明与分析版本](#detail-section-5)
- [未来设计假设（未验证）](#detail-section-6)
- [辅助信息](#detail-section-7)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：用户按日周月回顾模型使用和技能调用，发现用量异常并追溯统计覆盖；交付是可重建的个人分析视图。

适合个人用量复盘；先以少量原始日志核对重试和技能状态，勿把成功率作为技能业务质量。

**核查状态**：已实现机制有源码支持；贡献价值为条件性解释，未来设计假设未验证。本轮仅作固定版本源码核查，未安装、运行目标代码或验收宿主。

<a id="detail-section-3"></a>

### 能力、流程与成本

参照手工读取durable日志及实时累加统计，不把其他未检查插件作为比较证据。

reducer从durable事件提取数值用量与技能结果，跳过继承seed前缀；indexer串行排队，turn/end先flush后读持久日志替换会话索引，周期回填并清理90天事实。


DSH sessionPersistence、sessions.flush、storageDomain、Web设置页面；README目标0.1.1-rc.2为声明兼容。

启动读取派生表并裁剪旧事实，监听turn/end落源日志后重归集，每分钟回填，页面选择时区与窗口读取汇总；重建只清派生索引。

本地历史扫描、索引写入占计算和存储；人工为口径核对、宿主升级及异常缓存重建，无本次财务收益实测。

可重建索引减少实时状态丢失造成的长期偏差；趋势能提示复核方向，不能替代账单与任务验收。

- **后台**：durable事件派生索引、90天裁剪与缓存重建
- **界面**：个人Token及模型/技能统计页

- **思考**：统计成功不等于技能任务成功。显式skill-invocation一出现就记success，自动skill结果只检查工具错误，这些是调用状态而非业务完成质量。usage缺失虽保留known标记，字段缺失仍补0；比较总量需要同时看覆盖。

<a id="detail-section-4"></a>

### 工程贡献

reducer与indexer分离，队列序列化refresh/rebuild，持久读取避免将下一未flush回合混入；复用须保留seed去重与usage已知性。 源码依据：[src/analytics/reducer.ts](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/reducer.ts#L65)、[src/analytics/indexer.ts](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/indexer.ts#L16)、[src/analytics/summary.ts](https://github.com/3361805598-gif/dsh-usage-analytics/blob/6b44b372e475188acd71feef81e8451b70c05483/src/analytics/summary.ts#L47)。

- **亮点**：相对直接把实时事件累加，设计增量在以持久日志为真相重建派生索引，并对stream终止usage与assembled message去重；reasoning作为output子集不再加总，减少重复计费口径误读。

<a id="detail-section-5"></a>

### 核查说明与分析版本

- **仓库**：[3361805598-gif/dsh-usage-analytics](https://github.com/3361805598-gif/dsh-usage-analytics)
- **版本号**：0.2.1（[固定提交 6b44b37](https://github.com/3361805598-gif/dsh-usage-analytics/tree/6b44b372e475188acd71feef81e8451b70c05483)）
- **版本日期**：2026-09-07（固定提交日期，北京时间；不是包发布日期）
- **实际范围**：固定提交源码抽读与作者材料核查；没有执行目标代码、测试、安装或真实宿主验收，没有确认独立用户效果。
- **来源**：作者README与上述固定版本源码；未确认独立采用效果，目录收录与下载统计不作效果证据。

<a id="detail-section-6"></a>

## 未来设计假设（未验证）

待验证假设：将技能“已载入/执行完成/业务验收”分层展示，并报告usage覆盖，可降低用户误读成功率。由显式调用直接记成功和工具结果判定推导，业务验收无法完全从日志自动提取。

最小验证：一组显式技能加载失败、自动工具成功但业务失败、继承会话和流式重试记录，对照分层状态与原口径的误读率；无法取得验收事实时保持未知。

<a id="detail-section-7"></a>

## 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 166 | — | — | 1834 |
| .tsx | source | 6 | 213 | 198 | 1 | — |
| .js | source | 1 | 779 | 758 | 176 | — |
| .mjs | source | 2 | 738 | 722 | 26 | — |
| .ts | source | 14 | 814 | 719 | 19 | — |
| .ts | test | 4 | 338 | 309 | 6 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/3361805598-gif/dsh-usage-analytics/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
