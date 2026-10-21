# Quota 用量仪表

> 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[a705c9d](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 126](https://img.shields.io/static/v1?label=npm+30d&message=126&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota)
<!-- END META -->

**使用建议**：先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。

提供商账单更权威且有延迟；本插件提供近实时提示，不能认定是结算系统。

## 能力与限制

- **模型工具**：quota_meter 提供会话仪表。
- **用户命令**：/qm 查看用量与预测。

**流程与依赖**

依赖宿主 usage 字段和上下文窗口信息；提供商缺字段时无法由界面补出真实用量。

记录真实用量、查看仪表并人工调整任务预算；差异从事件、去重、价格来源逐项核对。

**兼容条件**

版本 0.2.0，依赖 commands、tools、systemPrompt；实际估价需要配置价格或计费数据库。

**效果与成本**

注入有上下文开销，价表和用量去重需维护；没有测量预算预警的准确率和净节省。

- **思考**：及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。

## 工程分析

- **亮点**：监听 assistant/message usage 累加本地账本，通过 systemPrompt 注入一行仪表，/qm 与工具展示统计。

展示与原始累计分层、微单位金额存储可借鉴；重放事件和跨进程写入要专项验收。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：预测是基于历史与裕量的估计；提示模型注意预算不是不可绕过的计费硬闸。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用已知调用序列测试缓存、工具长输出、重放、重启和币种，衡量预测误差。

**分析版本**

固定提交 [a705c9d](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 84 | — | — | 1638 |
| .ts | source | 4 | 977 | 769 | 128 | — |
| .ts | test | 3 | 867 | 730 | 51 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/121212165/dsh-plugin-quota/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
