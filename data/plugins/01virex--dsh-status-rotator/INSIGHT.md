# dsh-status-rotator

> 为 DSH Web 状态栏提供阶段文案、打字机、渐变、弹幕和主题，支持在设置页自定义。

<!-- BEGIN META -->
[![GitHub ★ 174](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=174&color=yellow&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator) · [![npm 30d 11947](https://img.shields.io/static/v1?label=npm+30d&message=11%2C947&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-status-rotator) · [![最后更新 今天](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=%E4%BB%8A%E5%A4%A9&color=blue&logo=github&style=flat)](https://github.com/01Virex/dsh-status-rotator/commits)
<!-- END META -->

## 版本

固定提交 [bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1](https://github.com/01Virex/dsh-status-rotator/tree/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1)

## 采用点评

- **用途**：用户在等待模型时希望状态更可读或更有趣；合格结果是状态能随阶段变化且不遮挡操作。基线是宿主原生状态栏，不以词库数量或主题数量证明生产效率。
- **亮点**：为 DSH Web 状态栏提供阶段文案、打字机、渐变、弹幕和主题，支持在设置页自定义。
- **思考**：首次主要是外观选择与兼容确认；持续有浏览器动画／定时器、SSE连接、设置存储和注意力成本，无模型收益实测。迁移需保留词库与配置，升级要复核 DOM／客户端契约。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：适合重视界面氛围的个人用户体验；工作环境先关弹幕与动画，比较状态可读性和浏览器负担。

## 场景、原有办法与合格交付

目标场景是：用户在等待模型时希望状态更可读或更有趣；合格结果是状态能随阶段变化且不遮挡操作。基线是宿主原生状态栏，不以词库数量或主题数量证明生产效率。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-status-rotator@0.37.0`。
- 声明依赖：`@deepseek-ai/cordis`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 13 | 4184 | — | — | — | 70472 |
| source | .cjs | 25 | 7094 | 5859 | 943 | 400 | — |
| source | .js | 3 | 11855 | 9219 | 2337 | 426 | — |
| source | .mjs | 1 | 111 | 88 | 15 | 9 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：`lib/index.d.ts`（generated/dependency/vendor/declaration heuristic; review exclusions）。解析错误：未记录。

## 能力清单

- **界面**：settings.section

- ui：`settings.section`（[lib/client.js:6438](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js#L6438)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 42 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 1 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/01Virex/dsh-status-rotator/blob/bf980a6d6c9dd1fce87cb9b1611cf5d42f5c10e1/lib/client.js)。


lib/index.js 提供配置读写与 SSE 通知；lib/client.js 负责状态和动效挂载，兼容不同设置 API。README 的 1362 词条和主题数为作者表述，本轮不作为工程能力评分。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 1／已关闭 42 · 近30天：新建 27／关闭 27／更新 暂未获取

统计日期：2026-10-19。
