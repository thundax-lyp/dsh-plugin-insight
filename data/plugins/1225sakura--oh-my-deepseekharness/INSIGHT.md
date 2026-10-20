# @sakura12/oh-my-deepseekharness

> 提供多 Agent 编排模式、角色技能、MCP 工具与图运行时。

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness) · [![npm 30d 2379](https://img.shields.io/static/v1?label=npm+30d&message=2%2C379&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@sakura12/oh-my-deepseekharness) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1225Sakura/oh-my-deepseekharness/commits)
<!-- END META -->

## 版本

固定提交 [f38d8a6cffca4d2beb97e3cdd53208794163b92f](https://github.com/1225Sakura/oh-my-deepseekharness/tree/f38d8a6cffca4d2beb97e3cdd53208794163b92f)

## 采用点评

- **用途**：提供多 Agent 编排模式、角色技能、MCP 工具与图运行时。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：大规模角色和工具会增加上下文、协调与失败恢复成本；数量不等于交付质量，且兼容范围很宽。
- **建议**：只选一个可并行且结果可验收的任务，与单 Agent 基线比较总 token、人工介入和合格率。

## 场景、原有办法与合格交付

目标场景是：提供多 Agent 编排模式、角色技能、MCP 工具与图运行时。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`@sakura12/oh-my-deepseekharness@0.4.9`。
- 声明依赖：`@modelcontextprotocol/sdk`、`zod`、`@deepseek-ai/dsh-commands`、`@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-mcp-client`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-storage`、`@deepseek-ai/dsh-storage-domain`、`@deepseek-ai/dsh-system-prompt`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/schemastery`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 170 | 21855 | — | — | — | 256566 |
| source | .mjs | 17 | 2619 | 2171 | 300 | 185 | — |
| source | .js | 29 | 5996 | 4382 | 1280 | 397 | — |
| test | .js | 45 | 10002 | 8560 | 899 | 794 | — |
| example | .mjs | 1 | 83 | 74 | 5 | 5 | — |
| test | .mjs | 1 | 63 | 41 | 15 | 7 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：omd_delegate、omd_memory_set、omd_memory_get、omd_memory_delete
- **用户命令**：omd-doctor、omd-cancel
- **事件监听**：agent/pre-step
- **界面**：sidebar.right.pane.tab
- **Skill**：agent-doc-discipline、ai-slop-cleaner、analyze、ask-navigator、ask、autopilot、autoresearch、best-practice-research、cancel、debug

- tools：`omd_delegate`（[lib/delegate.js:134](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/delegate.js#L134)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`omd_memory_set`（[lib/memory.js:117](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/memory.js#L117)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`omd_memory_get`（[lib/memory.js:127](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/memory.js#L127)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`omd_memory_delete`（[lib/memory.js:137](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/memory.js#L137)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`omd-doctor`（[lib/commands.js:19](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/commands.js#L19)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`omd-cancel`（[lib/commands.js:27](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/commands.js#L27)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/pre-step`（[lib/hook.js:160](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/hook.js#L160)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`sidebar.right.pane.tab`（[lib/client.js:334](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/client.js#L334)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`agent-doc-discipline`（[assets/skills/agent-doc-discipline/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/agent-doc-discipline/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`ai-slop-cleaner`（[assets/skills/ai-slop-cleaner/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/ai-slop-cleaner/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`analyze`（[assets/skills/analyze/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/analyze/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`ask-navigator`（[assets/skills/ask-navigator/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/ask-navigator/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`ask`（[assets/skills/ask/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/ask/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`autopilot`（[assets/skills/autopilot/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/autopilot/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`autoresearch`（[assets/skills/autoresearch/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/autoresearch/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`best-practice-research`（[assets/skills/best-practice-research/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/best-practice-research/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`cancel`（[assets/skills/cancel/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/cancel/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`debug`（[assets/skills/debug/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/debug/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`deep-interview`（[assets/skills/deep-interview/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/deep-interview/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`deepinit`（[assets/skills/deepinit/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/deepinit/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`design`（[assets/skills/design/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/design/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`drydock`（[assets/skills/drydock/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/drydock/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`execute`（[assets/skills/execute/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/execute/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`external-context`（[assets/skills/external-context/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/external-context/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`graph`（[assets/skills/graph/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/graph/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`harbor`（[assets/skills/harbor/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/harbor/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`hud`（[assets/skills/hud/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/hud/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`launch`（[assets/skills/launch/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/launch/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`loft`（[assets/skills/loft/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/loft/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- skills：`minimal-code-discipline`（[assets/skills/minimal-code-discipline/SKILL.md:1](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/assets/skills/minimal-code-discipline/SKILL.md#L1)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 263 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 11 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/1225Sakura/oh-my-deepseekharness/blob/f38d8a6cffca4d2beb97e3cdd53208794163b92f/lib/client.js)。


图 DAG、团队 HUD 与状态服务为复杂编排提供了显式控制面。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
