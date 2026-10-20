# dsh-folderwatch

> 监测目录快照差异，把外部文件变化批量排队或唤醒原会话处理。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/commits)
<!-- END META -->

## 版本

固定提交 [c11125d12738945d291b6067fb5fa03ea48c1c08](https://github.com/11111353535/dsh-folderwatch/tree/c11125d12738945d291b6067fb5fa03ea48c1c08)

## 用途与采用点评

- **用途**：等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。
- **亮点**：周期扫描与快照差分作为主路径，fs.watch 只提示加速；批量去抖、冷却和短时自身写入账本抑制回声。
- **思考**：准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。
- **建议**：先以 queue 模式监听小目录，统计漏报、重复和自身写入抑制，再开放自动唤醒。

## 场景与替代办法

等待构建报告、下载或共享目录交接的智能体需要发现外部变化，减少反复手工查询。

定时检查实现更简单但延迟高；仅在外部异步交接频繁时值得引入持续监控。

## 依赖与流程

依赖 tools、commands、可读文件系统及活跃会话；不能把本机扫描当成远程共享文件系统强一致保证。

明确目录和过滤后布置监听，检查通知再读取实际文件，任务结束解除监听；漏报时手动检查并看扫描错误。

## 成本与效果

周期遍历消耗文件系统资源，wake 模式额外启动模型回合；收益需对照扫描规模与通知频率。

准确变化摘要比轮询提示更利于交接；通知到达并不保证后续任务成功。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：c87d1102451f431c02c2a4cf0a88a1effe958c93ebb76e8aff2edfa55075f4d0。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 2246 | 1048 | 1073 | — |
| .md | source | 2 | 414 | — | — | 3707 |
| .mjs | source | 1 | 155 | 88 | 51 | — |
| .mjs | test | 4 | 1228 | 488 | 689 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：创建、检查和移除目录监测。
- **后台**：快照扫描与批量消息交付。

## 工程亮点

通知节流、扫描上限和监测提示分离可借鉴；目录超限与无法读取必须作为覆盖缺口看待。

## 分发与兼容

版本 0.1.0，纯 Host 工具，通知需要原会话可解析和 agent 的 inject/followup。

## 历史对照

前次代码指纹为 c11125d12738945d291b6067fb5fa03ea48c1c08；本轮固定为 c11125d12738945d291b6067fb5fa03ea48c1c08。定时检查实现更简单但延迟高；仅在外部异步交接频繁时值得引入持续监控。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证跨平台事件完整性、截断目录漏报或长期运行；短时路径抑制也可能隐藏同时发生的外部写入。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试突发改写、删除重建、断开会话、超限目录和与自身写入同时发生的外部修改。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/11111353535/dsh-folderwatch/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
