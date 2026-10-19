# dsh-discord-richpresence

> 将 DSH 的粗粒度交互状态推送到本机 Discord Rich Presence，支持自定义文案与可选丰富状态。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence) · [![npm 30d 暂未获取](https://img.shields.io/static/v1?label=npm+30d&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-discord-richpresence) · [![最后更新 1个月前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=1%E4%B8%AA%E6%9C%88%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/0QwQ0/dsh-discord-richpresence/commits)
<!-- END META -->

## 版本

固定提交 [bf8d34b4a4c52e9128a44ca7abf6a7de52880266](https://github.com/0QwQ0/dsh-discord-richpresence/tree/bf8d34b4a4c52e9128a44ca7abf6a7de52880266)

## 采用点评

- **用途**：个人用户希望在 Discord 显示正在与代理工作，合格结果是好友所见状态与当前粗粒度阶段一致、断开后能恢复。基线是手动状态；不是企业协作审批、任务结果通知或生产监控。
- **亮点**：将 DSH 的粗粒度交互状态推送到本机 Discord Rich Presence，支持自定义文案与可选丰富状态。
- **思考**：持续成本是socket／重连定时器及外部可见信息的管理，无额外模型调用。首次只需少量配置，迁移时保留文案和richMode；无证据支持其节省开发时间。 本轮未测合格任务成本、耗时或可靠性。 本轮未测合格任务成本、耗时或可靠性。
- **建议**：仅推荐给明确想展示状态的个人用户试用；默认保持模糊模式，先核查实际外发字段。

## 场景、原有办法与合格交付

目标场景是：个人用户希望在 Discord 显示正在与代理工作，合格结果是好友所见状态与当前粗粒度阶段一致、断开后能恢复。基线是手动状态；不是企业协作审批、任务结果通知或生产监控。 原有办法通常是使用宿主原生入口、独立脚本或人工流程；本轮没有对这些基线做运行对比。合格交付至少应同时满足功能结果正确、可恢复、没有越权副作用，并让总人工负担不高于基线。

## 依赖与使用条件

- 固定组件包：`dsh-discord-richpresence@0.3.1`。
- 声明依赖：`@deepseek-ai/cordis`、`@deepseek-ai/dsh-settings`、`@deepseek-ai/schemastery`。
- 效果依赖：输入数据、宿主版本、外部服务/浏览器能力与人工复核需按具体任务确认。
- 失效时应回退到宿主原生入口或人工流程；本轮未验证安装、卸载或迁移。

## 使用流程、失败恢复与成本

准备阶段需安装固定版本并检查配置/权限；执行阶段由源码中的入口接收任务；结果仍需人工验收。异常时优先停用插件、保存原始输入与日志并回退基线，不假设自动恢复。首次成本包括安装与配置，持续成本包括上下文/模型或外部服务、复核和失败重试，迁移成本包括数据导出与清理；本轮没有运行测量，不能给出 ROI、单位任务成本或效果排名。

## 工程统计

| 范围 | 扩展名 | 文件 | 总行 | 代码 | 注释 | 空行 | Markdown 词 |
|---|---:|---:|---:|---:|---:|---:|---:|
| source | .md | 4 | 518 | — | — | — | 4632 |
| source | .js | 3 | 1305 | 940 | 270 | 99 | — |
| test | .mjs | 7 | 762 | 608 | 81 | 77 | — |

统计覆盖：git tracked files at exact commit; component scope only。排除项：无自动排除项。解析错误：未记录。

## 能力清单

- **事件监听**：agent/inbox/inserted、agent/created、agent/status、agent/pre-step、tools/pre-execute、session/created、workflow/start
- **界面**：settings.general.item

- events：`agent/inbox/inserted`（[lib/index.js:479](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L479)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/created`（[lib/index.js:496](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L496)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/status`（[lib/index.js:502](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L502)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`agent/pre-step`（[lib/index.js:526](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L526)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`tools/pre-execute`（[lib/index.js:553](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L553)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`session/created`（[lib/index.js:566](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L566)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- events：`workflow/start`（[lib/index.js:580](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/index.js#L580)）；确认固定源码存在对应注册/入口，未验证运行时可用性。
- ui：`settings.general.item`（[lib/client.js:298](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/client.js#L298)）；确认固定源码存在对应注册/入口，未验证运行时可用性。

## 工程亮点

固定组件内共纳入 14 个 JS/TS/Markdown 文件。宿主或运行依赖共声明 3 项，升级时需要核对兼容范围。 静态解析未记录错误。 代码与文档支持对核心接线做源码级判断，但错误恢复、持久化一致性和外部副作用仍需针对实际任务验证。关键核查入口：[lib/client.js](https://github.com/0QwQ0/dsh-discord-richpresence/blob/bf8d34b4a4c52e9128a44ca7abf6a7de52880266/lib/client.js)。


lib/index.js 监听 inbox、agent、工具和session等信号，按配置映射状态；lib/discord-rpc.js 用本地IPC握手、SET_ACTIVITY和重连；client设置开关持久化 richMode，丰富模式跟踪最后真实用户输入对应会话。 复用时仍应单独确认宿主 API、数据生命周期、失败恢复和最小验收任务，不能只复制注册代码。

## 核查说明

- 历史对照：同一固定提交的既有结论已重新阅读并绑定本轮证据；未直接沿用旧检查时间。
- 已检查材料：目录条目、固定提交 README/package、关键源码和完整组件 inventory。
- 未完成验证：未执行插件测试，未安装到 DSH，未做真实宿主、模型、外部服务或业务结果验收。
- 证据限制：作者声明与源码机制只支持条件判断，不证明性能、安全性、可靠性或采用收益。

## Issue 活跃度

Issue：未关闭 0／已关闭 0 · 近30天：新建 0／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-19。
