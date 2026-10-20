# dsh-wsl-defender

> 从WSL读取Windows Defender、防火墙、近期检测和排除项，形成安全状态摘要。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[3463d75](https://github.com/173787247/dsh-wsl-defender/tree/3463d756faa7318bb8c1597db9a1bc0b1072d413)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender)
<!-- END META -->

**使用建议**：作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。

**核查状态**：已检查源码，未进行真实宿主验证。

## 使用建议

- **用途**：开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。

此前未入档；手工Windows安全中心和PowerShell查询为对照，本项主要减少证据收集步骤。

## 能力与限制

- **模型工具**：win_defender。

**流程与依赖**

需要Windows PowerShell互操作、Defender和防火墙cmdlet及相应读取权限；实际防护状态由Windows与组织策略决定。

运行win_defender，查看哪些维度可用，再对照系统界面；不因某项缺失就自动关闭或修改防护。

**兼容条件**

0.1.0，Node>=18，要求WSL与Windows相关cmdlet；第三方安全软件或权限不足时信息可能不完整。

**效果与成本**

无新增外部API费用，主要是PowerShell启动和人工核对；敏感排除路径与检测记录进入模型也有数据管理负担。

- **思考**：合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。

## 工程分析

- **亮点**：defender-exec.js经PowerShell调用Get-MpComputerStatus等只读命令，defender.js规范化结果并将杀毒数据缺失显示为不可用。

执行脚本与纯规范化/格式化分开利于跨平台静态验证；子查询catch吞错后缺少逐维度可用性，解释结果时需保留边界。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：部分PowerShell子查询失败会退为空数组，近期检测为空不一定代表确实没有检测；不扫描、不修复，也不能证明设备安全。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在受控Windows环境分别模拟第三方杀毒、无权限和子查询失败，核对报告能否区分未知与没有记录，保留原始命令结果。

**分析版本**

固定提交 [3463d75](https://github.com/173787247/dsh-wsl-defender/tree/3463d756faa7318bb8c1597db9a1bc0b1072d413)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 407 |
| .js | source | 4 | 241 | 207 | 12 | — |
| .js | test | 1 | 22 | 21 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-10-20。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
