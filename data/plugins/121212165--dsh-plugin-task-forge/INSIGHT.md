# dsh-plugin-task-forge

> 把粗略需求编译为版本化任务书，并用回读握手交接给其他 AI。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-task-forge) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/121212165/dsh-plugin-task-forge/commits)
<!-- END META -->

## 版本

固定提交 [af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac](https://github.com/121212165/dsh-plugin-task-forge/tree/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac)

## 采用点评

- **用途**：把粗略需求编译为版本化任务书，并用回读握手交接给其他 AI。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：握手能确认文本被复述，却不能证明接收方具备正确上下文或会按验收执行；任务书维护也有额外成本。
- **建议**：用一次跨窗口真实交接，对比普通复制粘贴的遗漏、返工和维护时间。

## 场景、原有办法与合格交付

目标场景是：把粗略需求编译为版本化任务书，并用回读握手交接给其他 AI。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-plugin-task-forge@0.2.0`。
- 声明依赖：`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 1 | 138 | — | — | — | 2634 |
| source | .ts | 8 | 1874 | 1533 | 195 | 148 | — |
| test | .ts | 9 | 1957 | 1618 | 99 | 250 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：forge_write
- **用户命令**：forge、relay、ack、answer、forge-list、forge-done、forge-show、forge-note

- tools：`forge_write`（[src/plugin.ts:604](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L604)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`forge`（[src/plugin.ts:339](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L339)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`relay`（[src/plugin.ts:380](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L380)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`ack`（[src/plugin.ts:422](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L422)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`answer`（[src/plugin.ts:470](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L470)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`forge-list`（[src/plugin.ts:519](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L519)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`forge-done`（[src/plugin.ts:546](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L546)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`forge-show`（[src/plugin.ts:563](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L563)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`forge-note`（[src/plugin.ts:580](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/plugin.ts#L580)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 18 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 1 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/121212165/dsh-plugin-task-forge/blob/af8cf4f67a14d7c55dbcf8c91171a1d4ae14c7ac/src/index.ts)。


版本化缺口与 READY 回读把交接中的隐含理解变成可检查状态。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
