# dsh-mac-companion

> 从DSH经HTTP调用Mac端Companion，支持通知、快捷指令和剪贴板读写。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[80c0f61](https://github.com/173787247/dsh-mac-companion/tree/80c0f61cedd985b19178bd45b2618f64a4eb96fc)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-mac-companion)
<!-- END META -->

**使用建议**：先只测试通知，再检查剪贴板和快捷指令权限；写入前保留剪贴板副本，并使用专门的低风险Shortcut。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：主Agent在WSL等环境运行，用户希望触达Mac桌面动作；验收应是目标Mac正确执行且数据未送错。

此前未入档；SSH执行或手工操作更直接，本项增量在统一桌面动作入口，未证明跨平台可靠性。

## 能力与限制

- **模型工具**：mac_companion_status、mac_notify、mac_run_shortcut、mac_clipboard_read、mac_clipboard_write。

**流程与依赖**

需要可达Mac、token、Python和相关macOS自动化权限；DSH端默认地址为本机，远程使用必须正确配置URL。

启动受控Companion并测试健康，发送通知或指定Shortcut，检查Mac结果；超时先核对是否已执行，不直接重复写剪贴板。

**兼容条件**

0.1.1，Node>=18，另需Mac Python Companion和系统权限，依赖dsh-wsl-common；不是仅装DSH插件即可。

**效果与成本**

首次部署token、网络和Mac权限需人工，常驻服务与故障排查是持续负担；未测跨设备任务节省时间。

- **思考**：为跨系统桌面任务提供薄协议有便利；读取剪贴板会把潜在敏感文本带入工具输出及模型上下文。

## 工程分析

- **亮点**：index.js注册Mac专用工具，将通知、shortcut和剪贴板动作交给共享Companion客户端；Mac侧Python服务调用系统能力。

Mac动作被拆成具名工具，状态探测独立；实际权限、确认和网络传输需客户端与服务端共同保证。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：confirm=true是工具参数，不等同人类在独立审批界面确认；共享Git依赖未固定，未验证跨设备权限或重试幂等。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：测试错误token、未授权Shortcut、Unicode剪贴板和断网重试，观察是否重复通知或覆盖内容；记录恢复步骤与人工耗时。

**分析版本**

固定提交 [80c0f61](https://github.com/173787247/dsh-mac-companion/tree/80c0f61cedd985b19178bd45b2618f64a4eb96fc)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 124 | — | — | 499 |
| .js | source | 2 | 220 | 209 | 2 | — |
| .js | test | 1 | 15 | 14 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/173787247/dsh-mac-companion/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
