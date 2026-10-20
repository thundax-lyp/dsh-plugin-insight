# dsh-remote-ssh

> 通过SSH对配置主机执行允许命令，提供状态查询、固定探针与受限远程运行工具。

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh) · [![最后更新 11天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=11%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/commits)
<!-- END META -->

## 版本

固定提交 [d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd](https://github.com/173787247/dsh-remote-ssh/tree/d294fe0e1a8617900f1f3d7b83fa0f8809c29ddd)

## 用途与采用点评

- **用途**：维护Unix、AIX或Mac主机的人希望在DSH排障，合格结果是主机明确、输出可信且操作范围可控。
- **亮点**：index.js注册状态、运行及固定探针工具，lib/ssh.js过滤argv、检查命令白名单，以BatchMode调用ssh并限制超时和输出。
- **思考**：固定探针能降低重复取诊断信息的步骤；通用命令允许列表如果过宽，会把权限负担转回操作者。
- **建议**：先使用远端低权限账号和固定只读探针，严格限定命令及参数，确认超时后的远端进程状态；不要把插件白名单当完整沙箱。

## 场景与替代办法

维护Unix、AIX或Mac主机的人希望在DSH排障，合格结果是主机明确、输出可信且操作范围可控。

此前未入档；直接SSH和固定运维脚本更透明，本项减少会话里手工拼接诊断，但未证实更可靠。

## 依赖与流程

需要可达SSH、ssh-agent或身份文件及远端授权；账户权限、主机指纹和远端shell行为是实际边界。

列主机并探测，选hostId与允许argv，复核输出；本地SSH超时先确认远端是否仍运行再重试，写操作需额外人工核对。

## 成本与效果

账号、主机密钥和白名单配置有首次成本，远程延迟与失败重试有持续负担；误写恢复与审计需人工，未测收益。

固定探针能降低重复取诊断信息的步骤；通用命令允许列表如果过宽，会把权限负担转回操作者。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：118a96c3783f1e91504ce15de4a40d29ac7629df0a885b2449c4e89f3113e183。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 99 | — | — | 468 |
| .md | example | 1 | 73 | — | — | 317 |
| .js | source | 2 | 272 | 259 | 1 | — |
| .js | test | 1 | 34 | 33 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：remote_ssh_status、remote_ssh_run、remote_ssh_probe。

## 工程亮点

探针按OS拆分、输出截断和BatchMode避免口令进入聊天值得复用；accept-new主机策略和简单元字符过滤需要结合远端限制审阅。

## 分发与兼容

0.1.1，包名实际为dsh-remote-ssh-run，Node>=18；需本机SSH和凭据，跨系统命令可用性由远端决定。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；直接SSH和固定运维脚本更透明，本项减少会话里手工拼接诊断，但未证实更可靠。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：本地spawn未开shell不表示SSH远端不经shell解释；有限变更命令名单不能覆盖所有程序写入模式，参数confirm也不是独立人工审批。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在临时远端测试空白参数、路径、选项及超时，核对实际远端命令；用拒绝写入的账号确认白名单之外还有独立约束。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-remote-ssh/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
