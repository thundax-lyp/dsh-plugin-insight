# dsh-codevault

> 把源码阅读笔记按仓库、文件和符号归档，并可连接 Obsidian。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-codevault) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1014029855/dsh-codevault/commits)
<!-- END META -->

## 版本

固定提交 [14dcb88d65f7d9fcf30b3e6adac5764f705ffae9](https://github.com/1014029855/dsh-codevault/tree/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9)

## 采用点评

- **用途**：把源码阅读笔记按仓库、文件和符号归档，并可连接 Obsidian。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：价值取决于笔记可检索性和引用准确性；自动归档不能替代对固定版本源码的复核。
- **建议**：选同一仓库的三次阅读任务，比较召回命中、出处可追溯和整理时间，再决定长期迁移。

## 场景、原有办法与合格交付

目标场景是：把源码阅读笔记按仓库、文件和符号归档，并可连接 Obsidian。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-codevault@0.3.0`。
- 声明依赖：`@deepseek-ai/cordis`、`@deepseek-ai/dsh-commands`、`@deepseek-ai/dsh-home-paths`、`@deepseek-ai/dsh-skill`、`@deepseek-ai/dsh-tools`、`@deepseek-ai/schemastery`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 5 | 631 | — | — | — | 9752 |
| source | .js | 7 | 2634 | 2320 | 316 | 0 | — |
| source | .mjs | 1 | 390 | 335 | 27 | 29 | — |
| source | .ts | 7 | 3048 | 2463 | 394 | 193 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/commands.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/domain.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/skill.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/store.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/tools.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/vault.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **模型工具**：read_capture、read_note、read_expand、read_query、read_recent、vault_search、vault_read、vault_suggest、read_link、read_history

- tools：`read_capture`（[lib/tools.js:85](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L85)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_note`（[lib/tools.js:183](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L183)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_expand`（[lib/tools.js:282](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L282)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_query`（[lib/tools.js:346](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L346)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_recent`（[lib/tools.js:474](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L474)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`vault_search`（[lib/tools.js:554](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L554)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`vault_read`（[lib/tools.js:651](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L651)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`vault_suggest`（[lib/tools.js:689](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L689)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_link`（[lib/tools.js:761](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L761)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_history`（[lib/tools.js:810](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L810)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`read_delete`（[lib/tools.js:926](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/tools.js#L926)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 20 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 6 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/index.js](https://github.com/1014029855/dsh-codevault/blob/14dcb88d65f7d9fcf30b3e6adac5764f705ffae9/lib/index.js)。


Markdown 加 JSONL 的开放存储降低了离开插件后的迁移成本。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
