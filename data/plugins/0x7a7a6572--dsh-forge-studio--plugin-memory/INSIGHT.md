# @zzerx/dsh-plugin-memory

> 保存全局与项目偏好并跨会话注入，提供可视化管理。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio) · [![npm 30d 2569](https://img.shields.io/static/v1?label=npm+30d&message=2%2C569&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0x7A7A6572/dsh-forge-studio/commits)
<!-- END META -->

## 版本

固定提交 [acb136c0dbbf8e984bdffea9de48b6ed73d0103e](https://github.com/0x7A7A6572/dsh-forge-studio/tree/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory)

## 采用点评

- **用途**：保存全局与项目偏好并跨会话注入，提供可视化管理。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：自动注入会把陈旧或错误记忆带入后续任务；作用域、修订和删除是否可靠比条目数量更重要。
- **建议**：用可纠错的项目决策做小样本，验证保存、召回、改正和删除后再扩大范围。

## 场景、原有办法与合格交付

目标场景是：保存全局与项目偏好并跨会话注入，提供可视化管理。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`@zzerx/dsh-plugin-memory@0.4.3`。
- 声明依赖：`@deepseek-ai/cordis`、`@deepseek-ai/cordis-plugin-loader`、`@deepseek-ai/dsh-brand`、`@deepseek-ai/dsh-settings`、`@deepseek-ai/dsh-storage-domain`、`@deepseek-ai/dsh-system-prompt`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-typert-protocol`、`@deepseek-ai/schemastery`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 1 | 67 | — | — | — | 1250 |
| source | .mjs | 1 | 31 | 16 | 10 | 5 | — |
| source | .ts | 25 | 6528 | 5384 | 651 | 502 | — |
| source | .tsx | 10 | 1596 | 1436 | 107 | 55 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`packages/plugin-memory/src/client/css.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **事件监听**：session/event
- **界面**：settings.section

- events：`session/event`（[packages/plugin-memory/src/agent/capture.ts:455](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory/src/agent/capture.ts#L455)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`settings.section`（[packages/plugin-memory/src/client/index.ts:32](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory/src/client/index.ts#L32)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 37 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 9 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[packages/plugin-memory/scripts/build.mjs](https://github.com/0x7A7A6572/dsh-forge-studio/blob/acb136c0dbbf8e984bdffea9de48b6ed73d0103e/packages/plugin-memory/scripts/build.mjs)。


全局/项目双作用域与管理界面让记忆具备可见的治理入口。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
