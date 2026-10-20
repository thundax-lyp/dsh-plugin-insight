# dsh-reaper

> 盘点端口占用与进程归属，先预览再按显式参数清理可归属的进程树。

<!-- BEGIN META -->
[![GitHub ★ 0](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=0&color=yellow&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper) · [![最后更新 3天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=3%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/commits)
<!-- END META -->

## 版本

固定提交 [b0412244e623d54fbf0bded66cba5203de8c85c4](https://github.com/11111353535/dsh-reaper/tree/b0412244e623d54fbf0bded66cba5203de8c85c4)

## 用途与采用点评

- **用途**：智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。
- **亮点**：按宿主祖先链、工作区和保护规则评级，默认返回计划，confirm:true 才执行，发信号前再次检查保护。
- **思考**：归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。
- **建议**：先仅用扫描与预览，对照系统工具确认归属；实际清理只在可丢弃开发进程上验收。

## 场景与替代办法

智能体遗留开发服务占用端口时，开发者需要区分可清理进程与宿主及系统服务。

系统端口与进程工具透明但需手工关联；高风险环境宜保留人工判断。

## 依赖与流程

需要本机系统命令、进程权限及正确工作区；容器和远程映射会改变观察范围。

扫描、核对计划、显式确认后清理，再核查释放结果；误归属时保护并重新确认。

## 成本与效果

减少人工找进程的潜在收益需与误判、终止恢复和跨平台维护成本一起评估。

归属和不可覆盖的保护规则比裸 kill 端口更有约束，但启发式归属仍不是授权证明。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7bd33fe6818e62474866b7fbe1eab28b166b0a311ae8b9993d73af7c668a74a3。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 6 | 1944 | 1203 | 605 | — |
| .md | source | 2 | 336 | — | — | 2870 |
| .mjs | source | 1 | 77 | 42 | 26 | — |
| .mjs | test | 3 | 690 | 540 | 74 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：端口扫描与可确认的进程清理。
- **用户命令**：/reap 查看进程归属。

## 工程亮点

深度优先终止子进程、结束后确认端口释放可借鉴；预览与真实执行之间仍有时间差。

## 分发与兼容

版本 0.1.0，需要系统进程与端口枚举能力，权限和工具可用性影响结果。

## 历史对照

前次代码指纹为 b0412244e623d54fbf0bded66cba5203de8c85c4；本轮固定为 b0412244e623d54fbf0bded66cba5203de8c85c4。系统端口与进程工具透明但需手工关联；高风险环境宜保留人工判断。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：未验证 PID 复用、系统枚举与跨平台归属准确率；confirm 参数不等同于总会弹出人工审批。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在测试进程树中覆盖宿主保护、同名服务、PID 变化、拒绝权限和 TERM 后仍存活。

## 活跃度

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 0](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+created%3A2026-09-20T02%3A57%3A22.116Z..2026-10-20T02%3A57%3A22.116Z) · [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T02%3A57%3A22.116Z..2026-10-20T02%3A57%3A22.116Z) · [![近30天更新 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=0&color=grey&logo=github&style=flat)](https://github.com/11111353535/dsh-reaper/issues?q=is%3Aissue+updated%3A2026-09-20T02%3A57%3A22.116Z..2026-10-20T02%3A57%3A22.116Z)

统计日期：2026-10-20。
