# dsh-plugin-quota

> 实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota) · [![npm 30d 147](https://img.shields.io/static/v1?label=npm+30d&message=147&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-quota) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-quota/commits)
<!-- END META -->

## 版本

固定提交 [a705c9d0cb5f025ce6eebd3e8c17a37d161a8628](https://github.com/121212165/dsh-plugin-quota/tree/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628)

## 采用点评

- **用途**：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：估算和预测不等于供应商账单；每轮注入本身占上下文，错误价格会让模型做出错误自限。
- **建议**：用已知 token 记录核对仪表和账单，比较注入开销；偏差超出容忍度时只保留只读面板。

## 场景、原有办法与合格交付

目标场景是：实时跟踪会话 token、轮次与估算费用，并向模型注入预算信号。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-plugin-quota@0.2.0`。
- 声明依赖：`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 1 | 84 | — | — | — | 1638 |
| source | .ts | 4 | 977 | 769 | 128 | 82 | — |
| test | .ts | 3 | 867 | 730 | 51 | 99 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：quota_meter
- **用户命令**：qm、qm-top、qm-reset
- **事件监听**：session/event

- tools：`quota_meter`（[src/plugin.ts:403](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L403)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`qm`（[src/plugin.ts:346](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L346)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`qm-top`（[src/plugin.ts:368](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L368)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`qm-reset`（[src/plugin.ts:386](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L386)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/event`（[src/plugin.ts:246](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/plugin.ts#L246)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 8 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 1 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/121212165/dsh-plugin-quota/blob/a705c9d0cb5f025ce6eebd3e8c17a37d161a8628/src/index.ts)。


把预算摘要发布为兄弟插件可读契约，便于跨插件协调资源。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
