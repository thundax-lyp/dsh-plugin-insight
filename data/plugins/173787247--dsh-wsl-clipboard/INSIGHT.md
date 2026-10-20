# dsh-wsl-clipboard

> 从WSL读取或写入Windows文本剪贴板，支持长度限制与Unicode编码转换。

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard) · [![最后更新 21天前](https://img.shields.io/static/v1?label=%E6%9C%80%E5%90%8E%E6%9B%B4%E6%96%B0&message=21%E5%A4%A9%E5%89%8D&color=blue&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/commits)
<!-- END META -->

## 版本

固定提交 [1aeac41d93ee494267b83095b4c8217226d7bd33](https://github.com/173787247/dsh-wsl-clipboard/tree/1aeac41d93ee494267b83095b4c8217226d7bd33)

## 用途与采用点评

- **用途**：WSL开发者需要在模型输出和Windows应用间传递文本，合格结果是文本完整且没有覆盖错误内容。
- **亮点**：lib/clipboard.js用PowerShell Forms Clipboard读写，写入文本先UTF-8编码为base64，输出携带字符数及截断标记。
- **思考**：base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。
- **建议**：先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。

## 场景与替代办法

WSL开发者需要在模型输出和Windows应用间传递文本，合格结果是文本完整且没有覆盖错误内容。

此前未入档；手工复制粘贴更透明，本项在频繁跨WSL/Windows文本传递时减少步骤。

## 依赖与流程

需要WSL到Windows互操作、可访问剪贴板的桌面用户会话；数据保密依赖工具调用范围与模型服务处理。

明确get或set，执行后核对字符数和内容；出现占用或错误先检查Windows会话，不自动反复覆盖。

## 成本与效果

无额外云服务，主要是跨进程启动及人工确认；长文本截断或误覆盖后的恢复也要计入，未测效率。

base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。

## 工程统计

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ca03e3a37bb2ec1bab3d25eb654a506641e1650029d1e984e1c8843d59d168e7。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 179 | — | — | 879 |
| .js | source | 3 | 226 | 205 | 2 | — |
| .js | test | 1 | 28 | 25 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

## 能力清单

- **模型工具**：wsl_clipboard的get/set文本操作。

## 工程亮点

文本编码与格式化分离、返回截断状态便于复核；桌面剪贴板占用或STA约束需要实际Windows验证。

## 分发与兼容

0.1.0，Node>=18，依赖WSL互操作及Windows PowerShell/桌面会话，无目标宿主运行验证。

## 历史对照

当前快照此前没有该稳定身份的研究档案。此前未入档；手工复制粘贴更透明，本项在频繁跨WSL/Windows文本传递时减少步骤。

## 核查说明

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只处理文本，不支持完整富媒体剪贴板；读取可能把已有敏感内容送入模型，写入会覆盖Windows当前剪贴板。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖中文表情、引号、换行、空文本和超长内容，并在剪贴板被其他应用占用时检查错误与恢复。

## 活跃度

[![Issue 未关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aopen) · [![Issue 已关闭 暂未获取](https://img.shields.io/static/v1?label=Issue+%E5%B7%B2%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aclosed)

[![近30天新建 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+created%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天关闭 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z) · [![近30天更新 暂未获取](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%9B%B4%E6%96%B0&message=%E6%9A%82%E6%9C%AA%E8%8E%B7%E5%8F%96&color=lightgrey&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard/issues?q=is%3Aissue+updated%3A2026-09-20T06%3A08%3A58.680Z..2026-10-20T06%3A08%3A58.680Z)

统计日期：2026-10-20。
