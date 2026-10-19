# @banana-peeljj12/dsh-trellis

> 以阶段速记、技能和任务状态实现 Trellis 风格开发工作流。

<!-- BEGIN META -->
[![GitHub ★ 8](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=8&color=yellow&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis) · [![npm 30d 1766](https://img.shields.io/static/v1?label=npm+30d&message=1%2C766&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@banana-peeljj12/dsh-trellis) · [![最后更新 11天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=11%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1264459640/dsh-trellis/commits)
<!-- END META -->

## 版本

固定提交 [7d2e5b69d2e744de511ac01632cf0865dfa79a85](https://github.com/1264459640/dsh-trellis/tree/7d2e5b69d2e744de511ac01632cf0865dfa79a85)

## 采用点评

- **用途**：以阶段速记、技能和任务状态实现 Trellis 风格开发工作流。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：流程纪律会增加每回合状态维护；只有在降低遗忘和错误提交时才值得，并依赖特定 DSH 0.2.0 RC。
- **建议**：在中型代码任务上比较有无该流程的恢复、Git 清洁度和人工维护时间。

## 场景、原有办法与合格交付

目标场景是：以阶段速记、技能和任务状态实现 Trellis 风格开发工作流。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`@banana-peeljj12/dsh-trellis@0.3.7`。
- 声明依赖：`@deepseek-ai/cordis`、`@deepseek-ai/dsh-agent`、`@deepseek-ai/dsh-fs`、`@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-session`、`@deepseek-ai/dsh-settings`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/schemastery`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 126 | 7451 | — | — | — | 110112 |
| test | .md | 2 | 279 | — | — | — | 5061 |
| source | .mjs | 3 | 728 | 571 | 106 | 56 | — |
| source | .js | 15 | 7822 | 5896 | 1584 | 357 | — |
| test | .js | 12 | 2906 | 2352 | 284 | 283 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/types/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **模型工具**：trellis_artifact_update、trellis_state、trellis_task_create、trellis_task_skip、trellis_task_update、trellis_task_archive、trellis_ui_update
- **事件监听**：system-prompt/assemble、agent/pre-step
- **界面**：plugins.row.config、conversation.session.header.utilities、conversation.input.dock
- **Skill**：trellis-before-dev、trellis-brainstorm、trellis-break-loop、trellis-channel、trellis-check、trellis-continue、trellis-feat、trellis-finish-work、trellis-issue、trellis-meta

- tools：`trellis_artifact_update`（[lib/artifact.js:146](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/artifact.js#L146)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_state`（[lib/index.js:293](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L293)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_task_create`（[lib/index.js:360](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L360)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_task_skip`（[lib/index.js:494](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L494)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_task_update`（[lib/index.js:568](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L568)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_task_archive`（[lib/index.js:738](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L738)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`trellis_ui_update`（[lib/index.js:1008](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L1008)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`system-prompt/assemble`（[lib/index.js:1060](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L1060)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/pre-step`（[lib/index.js:1089](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/index.js#L1089)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`plugins.row.config`（[lib/client.js:3281](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/client.js#L3281)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`conversation.session.header.utilities`（[lib/client.js:3294](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/client.js#L3294)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`conversation.input.dock`（[lib/client.js:3312](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/client.js#L3312)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-before-dev`（[skills/trellis-before-dev/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-before-dev/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-brainstorm`（[skills/trellis-brainstorm/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-brainstorm/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-break-loop`（[skills/trellis-break-loop/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-break-loop/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-channel`（[skills/trellis-channel/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-channel/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-check`（[skills/trellis-check/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-check/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-continue`（[skills/trellis-continue/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-continue/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-feat`（[skills/trellis-feat/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-feat/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-finish-work`（[skills/trellis-finish-work/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-finish-work/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-issue`（[skills/trellis-issue/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-issue/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-meta`（[skills/trellis-meta/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-meta/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-refactor`（[skills/trellis-refactor/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-refactor/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-session-insight`（[skills/trellis-session-insight/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-session-insight/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-spec-bootstrap`（[skills/trellis-spec-bootstrap/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-spec-bootstrap/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-start`（[skills/trellis-start/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-start/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`trellis-update-spec`（[skills/trellis-update-spec/SKILL.md:1](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/skills/trellis-update-spec/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 158 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 8 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/1264459640/dsh-trellis/blob/7d2e5b69d2e744de511ac01632cf0865dfa79a85/lib/client.js)。


每轮 breadcrumb 与 Git 清洁度护栏把流程状态和仓库风险放在同一控制点。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
