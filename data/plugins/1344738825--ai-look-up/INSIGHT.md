# ai-look-up

> 监测重复命令、连续失败与目标漂移，向会话注入复盘提示并可调用审查模型。

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/1344738825/ai-look-up) · [![最后更新 14天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=14%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/commits)
<!-- END META -->

## 版本

固定提交 [adb341c1d9899378caad2c3c2c37cf6cdd0cec49](https://github.com/1344738825/ai-look-up/tree/adb341c1d9899378caad2c3c2c37cf6cdd0cec49)

## 用途与采用点评

- **用途**：长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。
- **亮点**：index.js 监听会话事件，按spec.json阈值与冷却判定触发；可用宿主模型生成复盘建议，失败退回静态清单，另支持外部watcher通道。
- **思考**：将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。
- **建议**：先在非关键任务关闭第三通道，观察重复调用提醒的误报和冷却，再决定是否为审查增加预算。

## 场景与替代办法

长任务中Agent反复失败却继续调用工具，用户希望尽早提示停下来检查方向；成功标准应是减少无效尝试。

此前未入档；固定工具上限和人工检查是更简单对照。本项试图按行为触发，但没有同任务同预算结果。

## 依赖与流程

依赖agent/session事件与注入API；模型审查依赖llm，外部通道依赖Python watcher、目录协议及独立凭据，数据可能离开主宿主。

运行任务、收集调用节奏、触发提示，人工或主模型决定调整；审查失败退回清单，重启后重新建立监测状态。

## 成本与效果

审查与周期提醒额外消耗模型及上下文；调阈值、确认误报、维护watcher产生人工和运维成本，没有实测净收益。

将行为信号转为可见提醒比静默循环更可控；提醒不是强制停止，错误诊断也可能把正常重试打断。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：2eb874fb05773509f5bd152e3a2d95d03c3676d45bf9c7b096bc67122ddff194。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 512 | — | — | 7299 |
| .js | source | 2 | 1112 | 878 | 178 | — |
| .mjs | test | 2 | 1072 | 900 | 111 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **事件监听**：重复调用、失败、运行时长与目标漂移触发。
- **后台**：宿主llm复盘及可选外部watcher协议。

## 工程亮点

共享spec降低双端参数漂移，模型审查失败有静态回退；内存会话状态与落盘第三通道需区分恢复能力。

## 分发与兼容

双端ZCode/Python hooks与DSH JS bundle，配置键及模型路由有差异；第三通道需另配key和watcher，不是安装即具备。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；固定工具上限和人工检查是更简单对照。本项试图按行为触发，但没有同任务同预算结果。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审查模型复用主会话供应商不构成独立真相；DSH内存状态随重启丢失，未验证降低循环或目标漂移的效果。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：回放已知正常重试和死循环任务，在相同预算下比较误报、无效调用及合格率，并检查审查超时和宿主重启。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1344738825/ai-look-up/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
