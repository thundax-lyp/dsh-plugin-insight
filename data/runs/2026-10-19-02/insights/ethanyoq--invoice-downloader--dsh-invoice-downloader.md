# InvoiceFlowAI：收票自动化是否值得承担一套本地引擎

核查对象：`EthanYoQ/Invoice-Downloader` 的 `plugins/dsh-invoice-downloader`，提交 `8fe3a1147c619268b41f1480e73c4fa38d97db69`；源码和公开 npm latest 均为 0.1.1。

## 采用短评

- **用途：**从邮箱集中收集发票，识别、归档并生成报销准备报表。
- **亮点：**把原先分散的下载、分类和 Excel 汇总串起来，对固定邮箱、重复批量任务有潜在价值。
- **关键质疑：**为省整理时间引入 Python、OCR、Chromium 和模型处理，配置、纠错及人工核验会不会把收益吃回去？它产出准备材料，不能据此认定报销已办结。
- **建议：**已有 DSH、收票频繁且愿意核验的用户可用小批脱敏材料试验；偶发收票者先比较人工与桌面版。

## 场景、基线与验收

目标是每周或每月批量整理邮件票据的人。输入包括附件和链接，交付物应是可追溯的原件、正确字段和与原件一一对应的汇总表。
基线是人工下载整理，或同仓库桌面版。DSH 插件的 Node/Python 依赖不能与桌面安装体验混为一谈。财务审批、会计处理和税务有效性仍在本轮能力证明之外。

## 关键依赖

| 条件 | 用途与负担 | 失效影响 |
|---|---|---|
| 支持的 DSH、Node 与 Python 3.10+ | 插件接入与本地引擎；源码声明 Windows x64／Apple Silicon | 不支持的宿主或平台不能由元数据可读推断可运行 |
| IMAP 授权、可访问邮箱、保存目录 | 实际取票；需管理授权码和写入位置 | 无法完成邮箱收集，不能把空结果当无发票 |
| Python 环境、RapidOCR 及 Chromium | 安装器建虚拟环境、安装依赖和浏览器；不是只加一个 npm 包 | 首次联网和平台兼容构成试用前置 |
| DSH 所选模型 | OCR 文本结构化走当前 provider/model；模型路由决定数据处理边界和费用 | 默认链路不能宣传为纯本地，也不能固定套用根 README 的 GLM 价格 |
| 可选 GLM key | 启用对应图像后备处理 | 没配时不能把后备能力计入预期 |

依据：[组件文档](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/README.md)、[引擎安装器](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/runtime/install.py)、[模型桥](https://github.com/EthanYoQ/Invoice-Downloader/blob/8fe3a1147c619268b41f1480e73c4fa38d97db69/plugins/dsh-invoice-downloader/src/invoice-scanner.ts)。模型桥的 maxTokens 500 是输出上限，不是每张票据总费用上限。

## 从准备到失败恢复

用户配置引擎、邮箱、时间范围、目录及模型，再提交整理任务。后台收集邮件与附件／链接、抽取及 OCR，调用模型整理字段后写归档和报表。用户要复核漏件、错件、字段与对应关系。
失败时先区分邮箱授权、链接取回、本地识别和模型路由；重试前核对已有输出，重复件和覆盖行为需用具体任务验收。本轮未运行异常注入，不能保证自动恢复或绝不重复。

## 成本、结果与关键解释

首次成本是环境搭建和授权；持续成本包括抓取、OCR、模型调用、存储、人工校对和失败重跑；迁移还涉及目录、账号和报表流程。现金与人工分钟分列，不编造金额或节省率。

**判断：**更可能值得的是稳定重复的批量整理，而非任何人都立即省时。支持它的是流程集成和可核查模型链路；反例是偶发、小批、易人工核对的材料，固定成本可能占主导。收益也可能来自原有脚本或模型能力，不能全归功于插件。

最小试验：选一批已人工建立真值的混合票据，覆盖附件、链接、模糊件和重复件；对比人工与插件的关键字段全对率、漏件、总人工分钟、账单及失败尝试。配置按评估周期分摊。关键字段或原件追溯不达标，或总人工时间不降，则暂缓采用。

## 与上轮的差异

源码提交、目录条目和 npm 可用版本未变；本轮重新检查后维持“条件试用”。变化是表达更聚焦频率与固定成本的摊薄，没有新的实测证据让建议升级。

公开 npm 元数据本轮返回 200／0.1.1，[查询证据](../snapshots/ethanyoq--invoice-downloader--dsh-invoice-downloader/NPM.json)。源码复用同一固定提交的[原始快照](../../2026-10-19-01/snapshots/ethanyoq--invoice-downloader--dsh-invoice-downloader/SOURCE.json)，并通过[本轮仓库采集](../snapshots/ethanyoq--invoice-downloader--dsh-invoice-downloader/REPOSITORY.json)核对提交未变。原始许可证随快照保留。

## 证据与边界

本轮为 2026-10-19 三插件定向源码研究，未安装插件、未运行目标测试、未启动真实 DSH，未处理真实邮箱或用户项目。没有测得合格率、端到端耗时和每个合格任务成本。测试文件的存在不等于本轮通过。未核查独立用户效果反馈，不能推断无人使用。

[会话进度](../SESSION.json)保存本轮版本和完成检查点；完整来源及覆盖见[轮次报告](../REPORT.md)。
