# dsh-project-memory

> 为 DSH 提供持久化项目记忆，索引文档与代码符号，关联任务和文件，并按需召回带出处的经验。

<!-- BEGIN META -->
[![GitHub ★ 23](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=23&color=yellow&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory) · [![npm 30d 4786](https://img.shields.io/static/v1?label=npm+30d&message=4%2C786&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@yolk_vat-y/dsh-project-memory) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/00080000/dsh-project-memory/commits)
<!-- END META -->

## 版本

固定提交 [fe7ac6cab91784a34996aede007d3586f0ff2def](https://github.com/00080000/dsh-project-memory/tree/fe7ac6cab91784a34996aede007d3586f0ff2def)

## 采用点评

- **用途**：合格交付物是恢复正确的任务状态、引用正确文件并继续完成开发；基线是 AGENTS、任务清单、交接文档和 rg。适用频率是同一项目经常跨会话继续，不适合仅偶尔问答时增加常驻索引。
- **亮点**：为 DSH 提供持久化项目记忆，索引文档与代码符号，关联任务和文件，并按需召回带出处的经验。
- **思考**：首次包括索引与作用域配置；持续包括 CPU、磁盘、注入上下文 token、误召回清理，以及可选查询扩展／反思的模型费用；迁移需要导出／保留本地记忆及任务映射。本轮没有合格任务实测，不输出金额或收益比例。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合同项目反复中断的开发者小规模试用，先与交接文档加 rg 对照，暂不作安装推荐。

## 场景、原有办法与合格交付

目标场景是：合格交付物是恢复正确的任务状态、引用正确文件并继续完成开发；基线是 AGENTS、任务清单、交接文档和 rg。适用频率是同一项目经常跨会话继续，不适合仅偶尔问答时增加常驻索引。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`@yolk_vat-y/dsh-project-memory@0.6.2`。
- 声明依赖：`pdfjs-dist`、`@deepseek-ai/cordis`、`@deepseek-ai/dsh-llm`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/schemastery`、`typescript`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 4 | 2224 | — | — | — | 47141 |
| source | .js | 52 | 14144 | 10338 | 3291 | 732 | — |
| source | .mjs | 6 | 1447 | 1189 | 156 | 111 | — |
| source | .ts | 9 | 1324 | 924 | 318 | 86 | — |
| source | .tsx | 5 | 1556 | 1337 | 140 | 87 | — |
| test | .mjs | 40 | 9467 | 7577 | 1172 | 788 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`client/client.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`src/client/css-modules.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：4。

## 能力清单

- **模型工具**：forget、index_doc、index_repo、save_lesson、query_memory、remember、memory_stats、list_tasks、select_task、show_task_panel
- **事件监听**：session/event、agent/pre-step、session/disposed、fs/observed

- tools：`forget`（[src/tools/forget.js:12](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/forget.js#L12)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`index_doc`（[src/tools/index-doc.js:9](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/index-doc.js#L9)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`index_repo`（[src/tools/index-repo.js:131](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/index-repo.js#L131)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`save_lesson`（[src/tools/lesson-tools.js:19](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/lesson-tools.js#L19)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`query_memory`（[src/tools/query-memory.js:35](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/query-memory.js#L35)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`remember`（[src/tools/remember.js:10](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/remember.js#L10)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`memory_stats`（[src/tools/stats.js:9](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/stats.js#L9)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`list_tasks`（[src/tools/task-tools.js:19](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/task-tools.js#L19)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`select_task`（[src/tools/task-tools.js:44](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/task-tools.js#L44)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`show_task_panel`（[src/tools/task-tools.js:149](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/task-tools.js#L149)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`archive_task`（[src/tools/task-tools.js:169](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/task-tools.js#L169)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`watch_repo`（[src/tools/watch-repo.js:7](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/tools/watch-repo.js#L7)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/event`（[src/auto-inject.js:638](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/auto-inject.js#L638)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/pre-step`（[src/auto-inject.js:670](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/auto-inject.js#L670)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/disposed`（[src/index.js:188](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/index.js#L188)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`fs/observed`（[src/lazy.js:87](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/lazy.js#L87)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 116 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 6 项，升级时需要核对兼容范围。 静态解析存在错误，候选清单不完整。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[src/index.js](https://github.com/00080000/dsh-project-memory/blob/fe7ac6cab91784a34996aede007d3586f0ff2def/src/index.js)。


src/index.js 显式注册 12 个工具及 /tasks 命令；TaskBridge 对接宿主任务，读取时索引文档与符号，installAutoInject 在 agent/pre-step 注入召回。全量首用索引是单独开关，不把自动注入理解为无条件全库扫描。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 4 · 近30天：新建 2／关闭 2／更新 暂未获取

统计日期：2026-10-19。
