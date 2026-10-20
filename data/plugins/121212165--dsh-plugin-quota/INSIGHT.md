# Quota 用量仪表

> 累计会话用量并注入实时仪表，按价格与历史增量估计预算和上下文余量。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 138](https://img.shields.io/static/v1?label=npm+30d&message=138&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) · [![最后更新 昨天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E6%98%A8%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/commits)
<!-- END META -->

## 版本

固定提交 [a705c9d0cb5f025ce6eebd3e8c17a37d161a8628](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)

## 用途与采用点评

- **用途**：长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。
- **亮点**：监听 assistant/message usage 累加本地账本，通过 systemPrompt 注入一行仪表，/qm 与工具展示统计。
- **思考**：及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。
- **建议**：先与一天供应商用量对账，检查缺失 usage、重复事件和价格单位，再启用预算提醒。

## 场景与替代办法

长任务开发者希望在继续调用前看到消耗趋势和可能的预算边界。

提供商账单更权威且有延迟；本插件提供近实时提示，不能认定是结算系统。

## 依赖与流程

依赖宿主 usage 字段和上下文窗口信息；提供商缺字段时无法由界面补出真实用量。

记录真实用量、查看仪表并人工调整任务预算；差异从事件、去重、价格来源逐项核对。

## 成本与效果

注入有上下文开销，价表和用量去重需维护；没有测量预算预警的准确率和净节省。

及时可见的消耗有助于做继续决策；金额和下步预测不能替代账单与强制限额。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7eaf9e903d11f7a8efd24657d7a3c8c63f7f504c392518f181984d86b63f04a6。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 84 | — | — | 1638 |
| .ts | source | 4 | 977 | 769 | 128 | — |
| .ts | test | 3 | 867 | 730 | 51 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：quota_meter 提供会话仪表。
- **用户命令**：/qm 查看用量与预测。

## 工程亮点

展示与原始累计分层、微单位金额存储可借鉴；重放事件和跨进程写入要专项验收。

## 分发与兼容

版本 0.2.0，依赖 commands、tools、systemPrompt；实际估价需要配置价格或计费数据库。

## 历史对照

前次代码指纹为 a705c9d0cb5f025ce6eebd3e8c17a37d161a8628；本轮固定为 a705c9d0cb5f025ce6eebd3e8c17a37d161a8628。提供商账单更权威且有延迟；本插件提供近实时提示，不能认定是结算系统。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：预测是基于历史与裕量的估计；提示模型注意预算不是不可绕过的计费硬闸。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用已知调用序列测试缓存、工具长输出、重放、重启和币种，衡量预测误差。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
