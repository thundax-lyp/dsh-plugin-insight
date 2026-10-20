# Forge 用量计费

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

> 从会话用量建立账本，以事件时刻价格计费并展示预算、趋势与未计价项目。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 1814](https://img.shields.io/static/v1?label=npm+30d&message=1%2C814&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-usage-billing)
<!-- END META -->

## 版本

固定提交 [acb136c0dbbf8e984bdffea9de48b6ed73d0103e](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-usage-billing)

## 用途与采用点评

- **用途**：需要了解模型使用支出的开发者希望把日志用量与预算放在同一视图。
- **亮点**：服务聚合账本分片并锁定价格快照，联网价表与汇率有缓存和降级；未知项目不静默记零。
- **思考**：锁定历史价格能避免改价反写旧账；价格来源或使用日志不准时，账本仍可能精确记录错误值。
- **建议**：先选择一个模型和一天真实账单，逐项核对 token、缓存计价、币种和未计价行。

## 场景与替代办法

供应商账单是对照来源，不能拿插件自算金额自证；本轮不提供任何费率正确性背书。

## 依赖与流程

依赖 storageDomain、会话查询及模型用量数据；联网投影和汇率服务影响估算质量。

读取用量并按有效价格入账，查看预算和异常行；价格缺失时补齐后有条件重算。

## 成本与效果

主要成本是价表维护、历史估算和账单对账；收益需按可发现的计费差异评估，未实测。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：packages/plugin-usage-billing；内容摘要：58d86f355f39e5d065fbfd73fb6cf48e32fec7157afe67bb166c66bd10c4c1a3。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 47 | — | — | 994 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 72 | 7441 | 5221 | 1539 | — |
| .tsx | source | 39 | 3186 | 2612 | 459 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **界面**：预算、趋势和明细用量视图。
- **后台**：用量账本聚合与价格快照刷新。

## 工程亮点

价格快照与用量账本分离、未知金额保留空值值得借鉴；默认价格假设必须独立核实。

## 分发与兼容

组件 @zzerx/dsh-plugin-usage-billing 1.3.0；多宿主服务及外部价表构成兼容和数据依赖。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未核对供应商真实账单、费率覆盖或并发重建正确性，展示金额不等于结算凭证。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：用同一批调用与官方账单比较缓存、时区、费率切换和重启重建，记录未计价比例。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aopen) · [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)



统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
