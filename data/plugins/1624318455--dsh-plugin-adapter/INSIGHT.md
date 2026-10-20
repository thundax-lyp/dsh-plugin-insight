# dsh-plugin-adapter

> 把OpenCode Zen模型接入DSH模型目录，提供原生流式适配与可选网络路由管理。

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter) · [![最后更新 29天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=29%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/commits)
<!-- END META -->

## 版本

固定提交 [db7f273bd7caf2bb87c2428dcb8bd883eb338d1c](https://github.com/1624318455/dsh-plugin-adapter/tree/db7f273bd7caf2bb87c2428dcb8bd883eb338d1c)

## 用途与采用点评

- **用途**：希望在DSH尝试Zen模型的用户需要原生会话和工具调用接口，验收需包括流式文本、工具结果与失败恢复。
- **亮点**：packages/plugin/src/index.ts默认注册zen-free及旧别名LlmAdapter，后台预热模型目录；另保留sidecar和可选IP池/代理配置。
- **思考**：原生适配减少单独进程与UI切换；上游匿名接口变化可能让全部便利失效，需与直接使用原CLI比较维护负担。
- **建议**：适合非关键试验，先用原生adapter模式验证小任务，保留可用供应商回退；不要把免费通道当生产容量保证。

## 场景与替代办法

希望在DSH尝试Zen模型的用户需要原生会话和工具调用接口，验收需包括流式文本、工具结果与失败恢复。

此前未入档；原生付费供应商与OpenCode CLI为替代，本轮只支持机制判断，不排名模型质量或稳定性。

## 依赖与流程

依赖宿主llm、credentials、settings及Zen网络端点；根包装的外部依赖版本与仓库源码还需分别固定，可选sidecar另需进程与端口。

选adapter模式并加载目录，发起小请求，核对流与工具结果；目录未就绪先等预热状态，失败退回已验证的模型供应商。

## 成本与效果

无key是作者描述的接入方式，不等于无流量或运维成本；重试、上游限流及可选代理池有额外负担，未测可用性或单位任务成本。

原生适配减少单独进程与UI切换；上游匿名接口变化可能让全部便利失效，需与直接使用原CLI比较维护负担。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：94d3914cc5fb55cb5db0b88a9dd853e974b9895e4ae6d720897918554af73ba4。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2102 | — | — | 33390 |
| .ts | source | 27 | 7192 | 5246 | 1536 | — |
| .tsx | source | 1 | 951 | 860 | 52 | — |
| .ts | test | 21 | 4282 | 3604 | 485 | — |
| .mts | test | 3 | 311 | 223 | 64 | — |
| .mjs | source | 1 | 21 | 10 | 9 | — |

排除 1 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **后台**：原生Zen LlmAdapter、模型目录预热及legacy入口。
- **界面**：可选IP池设置界面。

## 工程亮点

默认adapter与legacy sidecar分开，缺llm时显式报错；网络池、安装器与代理管理扩大接入面的维护复杂度。

## 分发与兼容

根是private包装包，依赖^0.3.4；仓库内插件子包0.3.9，Node>=20。根安装可解析外部版本，不能把本轮源码SHA当成实际npm产物。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；原生付费供应商与OpenCode CLI为替代，本轮只支持机制判断，不排名模型质量或稳定性。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：匿名免费通道是否可用取决于上游，仿CLI请求不构成稳定服务承诺；未验证模型目录、工具语义或网络路由。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：固定模型和小任务测试取消、429、工具参数及空目录；同时核对安装实际解析版本，记录失败重试与人工时间。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1624318455/dsh-plugin-adapter/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
