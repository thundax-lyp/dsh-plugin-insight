# dsh-plan-lattice

> 为长任务提供持久执行合同、工作图与连续性恢复。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plan-lattice) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1052326311/dsh-plan-lattice/commits)
<!-- END META -->

## 版本

固定提交 [ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3](https://github.com/1052326311/dsh-plan-lattice/tree/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3)

## 采用点评

- **用途**：为长任务提供持久执行合同、工作图与连续性恢复。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：复杂状态机只有在中断恢复率和交付质量优于简单任务文档时才值得；作者 benchmark 不是本轮宿主验收。
- **建议**：用可中断的多步骤仓库任务，与手工 RUNBOOK 对照恢复正确率、重复工作和维护负担。

## 场景、原有办法与合格交付

目标场景是：为长任务提供持久执行合同、工作图与连续性恢复。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-plan-lattice@0.4.0-rc.8`。
- 声明依赖：`@deepseek-ai/cordis`、`@deepseek-ai/dsh-agent`、`@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-plan-mode`、`@deepseek-ai/dsh-session`、`@deepseek-ai/dsh-subagent`、`@deepseek-ai/dsh-system-prompt`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/dsh-user-questions`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 72 | 8122 | — | — | — | 62377 |
| source | .mjs | 285 | 65400 | 61299 | 240 | 3942 | — |
| example | .ts | 1 | 130 | 121 | 0 | 9 | — |
| example | .js | 5 | 42 | 35 | 0 | 7 | — |
| example | .md | 17 | 90 | — | — | — | 584 |
| example | .mjs | 64 | 3814 | 3179 | 330 | 360 | — |
| source | .js | 98 | 6842 | 6273 | 0 | 569 | — |
| test | .mjs | 24 | 3271 | 3085 | 11 | 186 | — |
| source | .ts | 23 | 12113 | 11013 | 400 | 701 | — |
| test | .ts | 79 | 19850 | 18373 | 84 | 1462 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：lattice_route、lattice_intake、lattice_commit_intake、lattice_open、lattice_status、lattice_review_input、lattice_commit_input_review、lattice_refresh_context、lattice_adopt_context、lattice_reframe
- **事件监听**：subagent/start、subagent/end、agent/pre-step、agent/request-error、tools/execute、tools/result、tools/change、session/event、agent/created、agent/session-start

- tools：`lattice_route`（[src/index.ts:5022](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5022)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_intake`（[src/index.ts:5130](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5130)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_commit_intake`（[src/index.ts:5303](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5303)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_open`（[src/index.ts:5384](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5384)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_status`（[src/index.ts:5611](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5611)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_review_input`（[src/index.ts:5646](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5646)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_commit_input_review`（[src/index.ts:5706](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5706)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_refresh_context`（[src/index.ts:5775](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5775)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_adopt_context`（[src/index.ts:5884](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5884)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_reframe`（[src/index.ts:5941](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L5941)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_add`（[src/index.ts:6189](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6189)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_split`（[src/index.ts:6236](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6236)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_update`（[src/index.ts:6297](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6297)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_archive`（[src/index.ts:6347](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6347)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_checkout`（[src/index.ts:6384](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6384)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`lattice_checkpoint`（[src/index.ts:6470](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6470)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`subagent/start`（[src/index.ts:1300](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L1300)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`subagent/end`（[src/index.ts:1311](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L1311)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/pre-step`（[src/index.ts:3062](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L3062)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/request-error`（[src/index.ts:3114](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L3114)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`tools/execute`（[src/index.ts:4484](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4484)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`tools/result`（[src/index.ts:4591](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4591)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`tools/change`（[src/index.ts:4610](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4610)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/event`（[src/index.ts:4628](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L4628)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/created`（[src/index.ts:6766](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6766)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/session-start`（[src/index.ts:6767](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6767)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/disposed`（[src/index.ts:6772](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6772)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/disposed`（[src/index.ts:6783](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6783)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/turn-stopping`（[src/index.ts:6791](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6791)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/inbox/inserted`（[src/index.ts:6801](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts#L6801)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 668 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 9 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.ts](https://github.com/1052326311/dsh-plan-lattice/blob/ea4d4f7d726681466e86d11f93e4cc38a6c0d3f3/src/index.ts)。


把计划、证据与恢复点持久化，适合借鉴到长期 Agent 工作流。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
