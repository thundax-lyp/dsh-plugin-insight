# dsh-ls125-uv-probe

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[c252d58](https://github.com/2333hutao/dsh-ls125-uv-probe/tree/c252d589d1d021bc08a386cd110e96cd011cb4a2)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/2333hutao/dsh-ls125-uv-probe)
<!-- END META -->

> **实现功能**：为 LS125 UVALED-X3 紫外探头提供 UART 协议、抓取分析工具与 STM32F103 主机固件的技能包。

> **核心亮点**：相比仅给AI一段设备说明，本项把反向协议、否定实验陷阱、示例捕获和MCU实现一起作为资源分发，使Agent能追溯字段和采样方法。CRC/UART均为成熟技术，具体贡献在该探头的协议知识与从仪表脱离的实现材料，不宣称通用仪器协议创新。

> **风险与缺陷**：样本设备实验能否支持该型号所有探头？PROTOCOL有字段对照、清零和排除实验，提供比单段演示更强的作者证据；但文中“完整原始证据”指向另一技能的case文件，当前分发未含全部原始轮次，偏移16–17含义也未知。21帧正确不能覆盖批次、固件、漂移和长时间计时溢出。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
  - [1.7 源码索引](#detail-section-8)
- [2 未来设计假设（未验证）](#detail-section-9)
- [3 辅助信息](#detail-section-10)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有LS125/UVALED-X3硬件、想用自有MCU读取紫外测量的嵌入式研究者；合格结果须帧校验正确、量纲匹配并与原仪表对照。

参照厂商仪表人工读数、从零逆向与一般UART分析工具；该包新增具体设备知识和复现实物链路，不替代校准、实验设计或通用硬件驱动。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：ls125-uv-probe技能及协议、分析脚本、F103固件资源目录

**流程与依赖**

宿主skills服务仅负责知识分发；实际工作依赖UVALED-X3、9600 8N1电气接线及采集/烧录工具链。Windows工具含原生libusb依赖，其他环境需替换；外部原始case证据未完整随包交付。

阅读协议/陷阱→建立原仪表对照→抓取或读示例→UART解码与字段分析→MCU只读轮询/CRC核对→明确需要时清零→长期对照。失败先分电气、时序、校验与单位，不凭设备可扫描认定采集可用。

**效果与成本**

必需探头、MCU/逻辑分析仪、接线与参考仪表，硬件采购和实验人时明显超过技能安装；部分固件/采集工具需工具链。未估算测量精度、校准或商业替代节省金额。

可能减少重新摸索协议和Windows采集问题的时间；可测数据链不等于校准仪器的替代，实际收益需扣接线、版本适配和误解字段的返工。

> **思考**：样本设备实验能否支持该型号所有探头？PROTOCOL有字段对照、清零和排除实验，提供比单段演示更强的作者证据；但文中“完整原始证据”指向另一技能的case文件，当前分发未含全部原始轮次，偏移16–17含义也未知。21帧正确不能覆盖批次、固件、漂移和长时间计时溢出。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相比仅给AI一段设备说明，本项把反向协议、否定实验陷阱、示例捕获和MCU实现一起作为资源分发，使Agent能追溯字段和采样方法。CRC/UART均为成熟技术，具体贡献在该探头的协议知识与从仪表脱离的实现材料，不宣称通用仪器协议创新。

相比仅给AI一段设备说明，本项把反向协议、否定实验陷阱、示例捕获和MCU实现一起作为资源分发，使Agent能追溯字段和采样方法。CRC/UART均为成熟技术，具体贡献在该探头的协议知识与从仪表脱离的实现材料，不宣称通用仪器协议创新。

index.js保持技能正文单一真相和相对资源，适合分发带工具知识。uv-analyze.cjs通过位置变化和滑动浮点候选协助实验归因，但合理浮点不证明字段语义；固件CRC与帧头验证是保护边界，移植需匹配串口电平、时钟与量纲。

<a id="detail-section-5"></a>

### 1.4 主要限制

样本设备实验能否支持该型号所有探头？PROTOCOL有字段对照、清零和排除实验，提供比单段演示更强的作者证据；但文中“完整原始证据”指向另一技能的case文件，当前分发未含全部原始轮次，偏移16–17含义也未知。21帧正确不能覆盖批次、固件、漂移和长时间计时溢出。

<a id="detail-section-6"></a>

### 1.5 使用建议

已有对应硬件的工程人员可把它当复核起点，先只读轮询并对照原表，核对电气连接、CRC与单位后再试清零；不直接将示例读数用于要求校准证明的交付。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

确认可分发的协议知识、分析脚本和固件实现存在；21/21帧与表显一致是作者报告，未独立接线/采样复现，不能升级为本次硬件验收。跨探头适配假设未验证。

- 已检查：作者 README、包清单、源码路径 index.js、skill/SKILL.md、skill/PROTOCOL.md、skill/tools/uv-analyze.cjs、skill/firmware/f103_probe/main.c 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查技能注册、协议文档、UART分析脚本和F103主机固件；未执行捕获/解码脚本、未烧录、未核对真实辐照度或安全测量条件。
- 下一步：用至少两个批次探头在稳定与变化光源下记录完整帧/原表读数，检验CRC、单位、清零和计时边界；未知版本先只读拒绝危险命令。若兼容向量不能识别字段漂移或误拒正常探头，则否定假设。

**分析版本**

- **仓库**：[2333hutao/dsh-ls125-uv-probe](https://github.com/2333hutao/dsh-ls125-uv-probe)
- **版本号**：1.0.0（[固定提交 c252d589](https://github.com/2333hutao/dsh-ls125-uv-probe/tree/c252d589d1d021bc08a386cd110e96cd011cb4a2)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

### 1.7 源码索引

- [index.js](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/index.js)
- [skill/SKILL.md](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/SKILL.md)
- [skill/PROTOCOL.md](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/PROTOCOL.md)
- [skill/tools/uv-analyze.cjs](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/tools/uv-analyze.cjs)
- [skill/firmware/f103_probe/main.c](https://github.com/2333hutao/dsh-ls125-uv-probe/blob/c252d589d1d021bc08a386cd110e96cd011cb4a2/skill/firmware/f103_probe/main.c)

<a id="detail-section-9"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证假设：按探头身份/固件保存协议兼容向量，先用只读轮询识别固定头、CRC、量纲与字段范围，再允许清零。它从未知字段与有限设备证据推导，把“一套协议通吃”改成可拒绝的兼容握手；新增负担是采集多个实物版本和维护指纹。

用至少两个批次探头在稳定与变化光源下记录完整帧/原表读数，检验CRC、单位、清零和计时边界；未知版本先只读拒绝危险命令。若兼容向量不能识别字段漂移或误拒正常探头，则否定假设。

<a id="detail-section-10"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 101 | 57 | 33 | — |
| .md | source | 7 | 847 | — | — | 9232 |
| .cjs | source | 6 | 756 | 612 | 82 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/2333hutao/dsh-ls125-uv-probe/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
