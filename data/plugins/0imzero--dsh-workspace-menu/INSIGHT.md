# dsh-workspace-menu

> 为 DSH 工作区与会话补充右键、双击菜单，集中提供置顶、重命名、归档、分叉和打开目录等操作。

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/@dsh-external/dsh-workspace-menu) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0imzero/dsh-workspace-menu/commits)
<!-- END META -->

## 版本

固定提交 [afd55510f82821cde60a8364e42f752e244b5b31](https://github.com/0imzero/dsh-workspace-menu/tree/afd55510f82821cde60a8364e42f752e244b5b31)

## 采用点评

- **用途**：经常管理很多会话和项目的用户，希望减少定位和切页。合格交付物是动作作用于正确对象、可区分保留文件与永久删除；基线是宿主原生菜单和系统文件管理器。
- **亮点**：为 DSH 工作区与会话补充右键、双击菜单，集中提供置顶、重命名、归档、分叉和打开目录等操作。
- **思考**：常用动作可能减少点击，但需要界面升级适配、localStorage跨浏览器不一致处理和依赖插件维护。删除误操作成本远高于省下点击；迁移需备份置顶／未读偏好和项目数据。无本轮耗时实测。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：先试非破坏菜单并保持删除关闭；需要删除时必须在临时目录验证路径授权、归档依赖和失败恢复。

## 场景、原有办法与合格交付

目标场景是：经常管理很多会话和项目的用户，希望减少定位和切页。合格交付物是动作作用于正确对象、可区分保留文件与永久删除；基线是宿主原生菜单和系统文件管理器。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`@dsh-external/dsh-workspace-menu@1.2.0`。
- 声明依赖：`@deepseek-ai/dsh-client-runtime`、`@deepseek-ai/dsh-client-ui-settings`、`@deepseek-ai/dsh-client-ui-slots`、`cordis`、`react`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 5 | 340 | — | — | — | 2797 |
| source | .js | 2 | 1251 | 1215 | 37 | 1 | — |
| source | .mjs | 1 | 34 | 24 | 4 | 6 | — |
| source | .ts | 3 | 1472 | 1355 | 43 | 76 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/types/client/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`lib/types/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）；`src/cordis.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **界面**：settings.general.item

- ui：`settings.general.item`（[lib/client.js:975](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/lib/client.js#L975)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 11 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 5 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/0imzero/dsh-workspace-menu/blob/afd55510f82821cde60a8364e42f752e244b5b31/lib/client.js)。


src/client/index.ts 用DOM事件与React fiber恢复行对象，置顶和未读保存在localStorage；src/index.ts提供打开系统文件管理器和删除目录的两个POST接口。永久会话删除调用dsh-archive-manager，工作区目录由本插件rm递归删除。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
