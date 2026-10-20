# dsh-plugin-ide-hub

> 统一盘点多种编码 IDE 的会话、用量、恢复命令与共享规则。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-ide-hub) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-ide-hub/commits)
<!-- END META -->

## 版本

固定提交 [814621be897a27752550b0be6f7be2bc44ccb897](https://github.com/121212165/dsh-plugin-ide-hub/tree/814621be897a27752550b0be6f7be2bc44ccb897)

## 采用点评

- **用途**：统一盘点多种编码 IDE 的会话、用量、恢复命令与共享规则。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：它读取多种工具的私有磁盘状态，格式漂移、权限和规则写回冲突是主要维护成本。
- **建议**：先只读盘点两种实际 IDE，核对会话与用量；确认指针文件幂等后再启用共享规则。

## 场景、原有办法与合格交付

目标场景是：统一盘点多种编码 IDE 的会话、用量、恢复命令与共享规则。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-plugin-ide-hub@0.7.0`。
- 声明依赖：`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 1 | 136 | — | — | — | 2890 |
| source | .ts | 13 | 2285 | 1953 | 174 | 168 | — |
| test | .ts | 10 | 1400 | 1216 | 53 | 141 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **用户命令**：ide-hub、hub-init、hub-migrate、hub-export、hub-usage、hub-sessions、hub-week、today

- commands：`ide-hub`（[src/plugin.ts:340](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L340)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-init`（[src/plugin.ts:351](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L351)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-migrate`（[src/plugin.ts:385](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L385)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-export`（[src/plugin.ts:394](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L394)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-usage`（[src/plugin.ts:413](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L413)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-sessions`（[src/plugin.ts:432](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L432)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`hub-week`（[src/plugin.ts:454](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L454)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`today`（[src/plugin.ts:482](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/plugin.ts#L482)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 24 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 1 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/121212165/dsh-plugin-ide-hub/blob/814621be897a27752550b0be6f7be2bc44ccb897/src/index.ts)。


零 API 读取与标记分隔的指针文件降低了对各家云接口的依赖。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
