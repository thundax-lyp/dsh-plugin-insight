# dsh-wsl-clipboard

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[1aeac41](https://github.com/173787247/dsh-wsl-clipboard/tree/1aeac41d93ee494267b83095b4c8217226d7bd33)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/173787247/dsh-wsl-clipboard)
<!-- END META -->

> **实现功能**：从WSL读取或写入Windows文本剪贴板，支持长度限制与Unicode编码转换。

> **核心亮点**：lib/clipboard.js用PowerShell Forms Clipboard读写，写入文本先UTF-8编码为base64，输出携带字符数及截断标记。

> **风险与缺陷**：base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。

<a id="detail-section-1"></a>

## 1 用途与适用场景

> **用途**：WSL开发者需要在模型输出和Windows应用间传递文本，合格结果是文本完整且没有覆盖错误内容。

此前未入档；手工复制粘贴更透明，本项在频繁跨WSL/Windows文本传递时减少步骤。

<a id="detail-section-2"></a>

## 2 能力与限制

**能力**

- **模型工具**：wsl_clipboard的get/set文本操作。

**流程与依赖**

需要WSL到Windows互操作、可访问剪贴板的桌面用户会话；数据保密依赖工具调用范围与模型服务处理。

明确get或set，执行后核对字符数和内容；出现占用或错误先检查Windows会话，不自动反复覆盖。

**兼容条件**

0.1.0，Node>=18，依赖WSL互操作及Windows PowerShell/桌面会话，无目标宿主运行验证。

**效果与成本**

无额外云服务，主要是跨进程启动及人工确认；长文本截断或误覆盖后的恢复也要计入，未测效率。

> **思考**：base64传输减少字符串转义问题；把复制操作接入Agent并不会自动判断当前剪贴板是否该被读取或替换。

<a id="detail-section-3"></a>

## 3 工程分析

> **亮点**：lib/clipboard.js用PowerShell Forms Clipboard读写，写入文本先UTF-8编码为base64，输出携带字符数及截断标记。

文本编码与格式化分离、返回截断状态便于复核；桌面剪贴板占用或STA约束需要实际Windows验证。

<a id="detail-section-4"></a>

## 4 使用建议

先用测试字符串验证中文、换行和长度上限，写入前保存重要剪贴板内容；仅在明确需要时读取。

<a id="detail-section-5"></a>

## 5 核查说明

**核查状态**：已检查源码。

- 已检查：作者 README、包清单、上述源码路径及固定范围 inventory；来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只处理文本，不支持完整富媒体剪贴板；读取可能把已有敏感内容送入模型，写入会覆盖Windows当前剪贴板。
- 独立证据：未核实第三方采用与端到端收益；META 的 Star、Issue、npm 下载不作效果证明。
- 下一步：覆盖中文表情、引号、换行、空文本和超长内容，并在剪贴板被其他应用占用时检查错误与恢复。

**分析版本**

固定提交 [1aeac41](https://github.com/173787247/dsh-wsl-clipboard/tree/1aeac41d93ee494267b83095b4c8217226d7bd33)

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 179 | — | — | 879 |
| .js | source | 3 | 226 | 205 | 2 | — |
| .js | test | 1 | 28 | 25 | 0 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/173787247/dsh-wsl-clipboard/issues) 查看。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
