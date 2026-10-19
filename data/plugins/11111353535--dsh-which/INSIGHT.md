# dsh-which

> 解释命令实际解析路径、遮蔽关系、重复项与版本差异。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-which) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-which) · [![最后更新 前天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E5%89%8D%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-which/commits)
<!-- END META -->

## 版本

固定提交 [7894da833582b46526b251348cd8993b70a5ce85](https://github.com/11111353535/dsh-which/tree/7894da833582b46526b251348cd8993b70a5ce85)

## 采用点评

- **用途**：解释命令实际解析路径、遮蔽关系、重复项与版本差异。
- **亮点**：固定提交中的 README、package 与注册点支持作者描述的核心路径；实际效果尚未在宿主验证。
- **思考**：版本探针会执行目标命令的版本参数，仍可能有副作用或超时；跨 shell 解析规则也未宿主验证。
- **建议**：先在含重复、失效和包装脚本的测试 PATH 中核对结果，再用于真实环境排障。

## 场景、原有办法与合格交付

目标场景是：解释命令实际解析路径、遮蔽关系、重复项与版本差异。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-which@0.1.0`。
- 声明依赖：未在组件 package.json 声明直接或 peer 依赖；宿主接线仍需按源码核对。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .js | 7 | 1776 | 1003 | 641 | 132 | — |
| source | .md | 2 | 508 | — | — | — | 4302 |
| source | .mjs | 1 | 155 | 88 | 51 | 16 | — |
| test | .mjs | 4 | 1425 | 1091 | 197 | 143 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **模型工具**：which_resolve、which_path、which_env、which_sweep、which_probe
- **用户命令**：which

- tools：`which_resolve`（[lib/index.js:310](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L310)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`which_path`（[lib/index.js:342](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L342)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`which_env`（[lib/index.js:362](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L362)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`which_sweep`（[lib/index.js:381](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L381)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- tools：`which_probe`（[lib/index.js:410](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L410)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- commands：`which`（[lib/index.js:442](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js#L442)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 14 个 JS/TS/Markdown 文件。组件声明依赖较少，但仍不能据此推断运行简单或无外部依赖。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/index.js](https://github.com/11111353535/dsh-which/blob/7894da833582b46526b251348cd8993b70a5ce85/lib/index.js)。


把 PATH 胜出、遮蔽和版本一致性合成一份可审计诊断。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
