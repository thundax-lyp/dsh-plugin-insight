# dsh-mac-companion

> 从DSH经HTTP调用Mac端Companion，支持通知、快捷指令和剪贴板读写。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion) · [![最后更新 20天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=20%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/commits)
<!-- END META -->

## 版本

固定提交 [80c0f61cedd985b19178bd45b2618f64a4eb96fc](https://github.com/173787247/dsh-mac-companion/tree/80c0f61cedd985b19178bd45b2618f64a4eb96fc)

## 用途与采用点评

- **用途**：主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。
- **亮点**：index.js注册Mac专用工具，将通知、shortcut和剪贴板动作交给共享Companion客户端；Mac侧Python服务调用系统能力。
- **思考**：为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。
- **建议**：先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。

## 场景与替代办法

主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。

此前未入档；SSH执行或手工操作更直接，本项增量在统一桌面动作入口，未证明跨平台可靠性。

## 依赖与流程

需要可达Mac、token、Python和相关macOS自动化权限；DSH端默认地址为本机，远程使用必须正确配置URL。

启动受控Companion并测试健康，发送通知或指定Shortcut，检查Mac结果；超时先核对是否已执行，不直接重复写剪贴板。

## 成本与效果

首次部署token、网络和Mac权限需人工，常驻服务与故障排查是持续负担；未测跨设备任务节省时间。

为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：60bc5bcbaf10f3a6d86c6c2d9ce2e8fa55b76962db924dde74d95dba19d92ac6。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 499 |
| .js | source | 2 | 220 | 209 | 2 | — |
| .js | test | 1 | 15 | 14 | 3 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：mac_companion_status、mac_notify、mac_run_shortcut、mac_clipboard_read、mac_clipboard_write。

## 工程亮点

Mac动作被拆成具名工具，状态探测独立；实际权限、确认和网络传输需客户端与服务端共同保证。

## 分发与兼容

0.1.1，Node>=18，另需Mac Python Companion和系统权限，依赖dsh-wsl-common；不是仅装DSH插件即可。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；SSH执行或手工操作更直接，本项增量在统一桌面动作入口，未证明跨平台可靠性。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：confirm=true是工具参数，不等同人类在独立审批界面确认；共享Git依赖未固定，未验证跨设备权限或重试幂等。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试错误token、未授权Shortcut、Unicode剪贴板和断网重试，观察是否重复通知或覆盖内容；记录恢复步骤与人工耗时。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+created%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion/issues?q=is%3Aissue+updated%3A2026-09-20T07%3A15%3A30.299Z..2026-10-20T07%3A15%3A30.299Z)

统计日期：2026-10-20。
