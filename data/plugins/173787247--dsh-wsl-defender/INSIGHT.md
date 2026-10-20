# dsh-wsl-defender

> 从WSL读取Windows Defender、防火墙、近期检测和排除项，形成安全状态摘要。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-defender/commits)
<!-- END META -->

## 版本

固定提交 [3463d756faa7318bb8c1597db9a1bc0b1072d413](https://github.com/173787247/dsh-wsl-defender/tree/3463d756faa7318bb8c1597db9a1bc0b1072d413)

## 用途与采用点评

- **用途**：开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。
- **亮点**：defender-exec.js经PowerShell调用Get-MpComputerStatus等只读命令，defender.js规范化结果并将杀毒数据缺失显示为不可用。
- **思考**：合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。
- **建议**：作为状态收集工具使用，对关键异常回到Windows安全中心核对；遇到unavailable先查权限和安全产品。

## 场景与替代办法

开发者排查Windows环境状态时需要把系统安全配置带入会话，合格结果是可核对的当前状态而非安全认证。

此前未入档；手工Windows安全中心和PowerShell查询为对照，本项主要减少证据收集步骤。

## 依赖与流程

需要Windows PowerShell互操作、Defender和防火墙cmdlet及相应读取权限；实际防护状态由Windows与组织策略决定。

运行win_defender，查看哪些维度可用，再对照系统界面；不因某项缺失就自动关闭或修改防护。

## 成本与效果

无新增外部API费用，主要是PowerShell启动和人工核对；敏感排除路径与检测记录进入模型也有数据管理负担。

合并多个状态命令方便排障；快照不能代替持续防护，也不把没有返回数据当作已确认无威胁。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：bd35dc6145e49343f623bb85da067ee66b53cc3e28b933ba9a5ca9119aaa1516。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 115 | — | — | 407 |
| .js | source | 4 | 241 | 207 | 12 | — |
| .js | test | 1 | 22 | 21 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：win_defender。

## 工程亮点

执行脚本与纯规范化/格式化分开利于跨平台静态验证；子查询catch吞错后缺少逐维度可用性，解释结果时需保留边界。

## 分发与兼容

0.1.0，Node>=18，要求WSL与Windows相关cmdlet；第三方安全软件或权限不足时信息可能不完整。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；手工Windows安全中心和PowerShell查询为对照，本项主要减少证据收集步骤。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：部分PowerShell子查询失败会退为空数组，近期检测为空不一定代表确实没有检测；不扫描、不修复，也不能证明设备安全。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：在受控Windows环境分别模拟第三方杀毒、无权限和子查询失败，核对报告能否区分未知与没有记录，保留原始命令结果。

## Issue 活跃度

Issue：未关闭 暂未获取／已关闭 暂未获取 · 近30天：新建 暂未获取／关闭 暂未获取／更新 暂未获取

统计日期：2026-10-20。
