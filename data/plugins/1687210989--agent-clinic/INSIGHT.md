# agent-clinic

> 读取本地Agent会话与配置，生成带证据定位的诊断报告，并匹配可复核的改进处方。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/1687210989/agent-clinic) · [![npm 30d 95](https://img.shields.io/static/v1?label=npm+30d&message=95&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/agent-clinic) · [![最后更新 4天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=4%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/commits)
<!-- END META -->

## 版本

固定提交 [e88d6ec63d7a67277bf3c6c86f38a43ee97527c4](https://github.com/1687210989/agent-clinic/tree/e88d6ec63d7a67277bf3c6c86f38a43ee97527c4)

## 用途与采用点评

- **用途**：用户感觉Agent循环、上下文浪费或失忆，希望从实际日志定位问题，合格结果是能回查的证据和适用建议。
- **亮点**：adapters/dsh.mjs解析事件并保留行定位，report和prescriber生成诊断与配置建议，跨会话比较用本地加盐指纹；插件与CLI共用分析核心。
- **思考**：证据定位与撤回不适用处方比只报数字更利于行动；插件目录匹配依据不能证明被推荐插件安全或有效。
- **建议**：先离线扫描少量会话并回读证据行，确认隐私与指纹保存策略；处方涉及配置修改时先备份并单独验证。

## 场景与替代办法

此前未入档；人工日志排查更可控但费时。本项把定位和建议串联，尚无独立证据说明诊断准确率或任务收益。

## 依赖与流程

需要可读会话/配置与对应事件格式，联网推荐另需目录源；指纹在本机可清除，诊断效果依赖阈值与会话样本代表性。

选会话扫描，阅读异常证据和当前配置，再决定是否采纳处方；数据维度不可用时补材料，不能把未采集当无异常。

## 成本与效果

扫描大日志耗时与IO，指纹快照占磁盘；逐条复核、尝试处方并对照结果占人工，未测改善幅度。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：d9f7cf5c3154bf30f8b891501a4c0b577df96e7028d14fb3cb310a49325d5285。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 3768 | — | — | 59546 |
| .js | source | 2 | 2068 | 1705 | 264 | — |
| .mjs | source | 22 | 13435 | 10326 | 2368 | — |
| .mjs | example | 1 | 981 | 695 | 215 | — |
| .mjs | test | 1 | 2101 | 1790 | 206 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **Skill**：仓库提供agent-clinic Skill入口。
- **界面**：体检侧栏与报告面板。
- **后台**：本地会话扫描、证据定位和处方生成。

## 工程亮点

适配、证据、诊断和处方分层，写指纹失败显式标不可用；动态插件目录与第三方中继的来源信任需保留。

## 分发与兼容

0.2.0，Node>=22.15，Skill与DSH Plugin双入口；压缩日志需可用zstd支持，宿主面板更新后需重启。


## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：启发式诊断和处方不是因果验证；只读扫描源会话，但会写自身指纹/反馈状态，不能把只读理解为绝不落盘。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：准备已知循环及正常重试会话，盲核证据定位、误报与处方适用性；关闭联网/指纹分别检查报告诚实度，再比较排障人工时间。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/1687210989/agent-clinic/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
