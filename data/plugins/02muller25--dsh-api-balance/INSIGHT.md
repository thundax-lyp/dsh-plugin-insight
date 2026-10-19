# api-balance

> 在 DSH Web 输入区实时显示 DeepSeek API 账户余额，支持自动轮询、手动刷新和自定义刷新间隔。

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/api-balance) · [![最后更新 2个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=2%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/02Muller25/dsh-api-balance/commits)
<!-- END META -->

## 版本

固定提交 [c27c8b61acf97714ab08d99f97b7be3a9007e52e](https://github.com/02Muller25/dsh-api-balance/tree/c27c8b61acf97714ab08d99f97b7be3a9007e52e)

## 采用点评

- **用途**：用户在开发过程中担心余额不足，需要快速确认可用性；合格结果是展示与官方账户相符且失败时不会把旧值冒充实时值。基线是官方控制台或手动查询余额接口。
- **亮点**：在 DSH Web 输入区实时显示 DeepSeek API 账户余额，支持自动轮询、手动刷新和自定义刷新间隔。
- **思考**：每浏览器每30秒默认最多约120次查询/小时，每次另起 curl；10秒模式约360次，这是配置推算并非实测。没有模型 token 调用增量，但有网络、子进程和故障排查成本。迁移主要是本地刷新偏好。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合单账户用户按需查看，先验证凭证处理与轮询负担；需要预算控制时仍要配合计量和限额。

## 场景、原有办法与合格交付

目标场景是：用户在开发过程中担心余额不足，需要快速确认可用性；合格结果是展示与官方账户相符且失败时不会把旧值冒充实时值。基线是官方控制台或手动查询余额接口。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`api-balance@0.2.1`。
- 声明依赖：未在组件 package.json 声明直接或 peer 依赖；宿主接线仍需按源码核对。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .js | 2 | 346 | 327 | 16 | 4 | — |
| source | .md | 1 | 89 | — | — | — | 928 |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/client.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- inventory 未检出可人工确认的正向 DSH 注册条目；这不等于确认不存在动态或配置式能力。

## 工程亮点

固定组件内共纳入 3 个 JS/TS/Markdown 文件。组件声明依赖较少，但仍不能据此推断运行简单或无外部依赖。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/02Muller25/dsh-api-balance/blob/c27c8b61acf97714ab08d99f97b7be3a9007e52e/lib/client.js)。


lib/index.js 注册 GET /api/abal-balance，每次解析 DEEPSEEK_API_KEY，用 shell.resolve／run 调用固定 API；lib/client.js 在 composer dock 渲染并轮询，刷新偏好保存在 localStorage。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 1 · 近30天：新建 0／关闭 1／更新 暂未获取

统计日期：2026-10-19。
