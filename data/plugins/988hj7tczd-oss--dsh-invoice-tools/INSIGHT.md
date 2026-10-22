# dsh-invoice-tools

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[b1c8ee8](https://github.com/988hj7tczd-oss/dsh-invoice-tools/tree/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/988hj7tczd-oss/dsh-invoice-tools) [![npm 30d 437](https://img.shields.io/static/v1?label=npm+30d&message=437&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-invoice-tools)
<!-- END META -->

> **实现功能**：在本地解析电子发票字段，核对金额并汇总生成报销单资料。

> **核心亮点**：相对手抄票面进表格，增量是XML优先、字段缺失/金额核对与重复票汇总接入DSH，并保留来源置信标记。PDF/XML与OOXML为既有格式，本插件不是税务查验服务；“搜索0结果”不证明生态首创。

> **风险与缺陷**：解析高置信和xlsx输出是否等于合格报销件？XML存在不证明票真，正则可能取错编号，勾稽只检金额关系；无OCR的扫描件会跳过。xlsx实际保存为.xlsx.b64还需解码，缺session时global缓存可跨调用共享，不能把本地处理概括为严格会话隐私隔离。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人整理含结构化XML或文本层的电子发票，交付字段核对表和报销汇总草稿；不替代真伪查验或财务审批。

参照手工录表、常规票据解析和OCR工具；本轮未对照其他产品召回/准确率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：invoice_parse与invoice_summary。

**流程与依赖**

pdf-extract取PDF嵌入XML或文本，invoice-model候选标签/正则抽字段并核金额；parse按session缓存，summary去重汇总并经fs版本守卫写Markdown或xlsx的base64文本。

DSH tools/fs与宿主沙箱、PDF/XML文本可提取性和构建依赖；无网络真伪查验。

选发票→提取/标缺失→金额勾稽→按会话缓存→用户选文件/类别→去重汇总→版本守卫写资料→人工核票。

TS构建与相邻dsh-src link依赖；输出xlsx为base64文本，纯扫描票不支持OCR，须明确产物格式。

**效果与成本**

首次匹配宿主并确认票据类型，持续人工核票、解码xlsx和处理缺字段；无外部查验请求费，人工/错误成本未测。

减少重复录入与简单重复检查；不能证明合法报销、税务合规或发票真伪。

> **思考**：解析高置信和xlsx输出是否等于合格报销件？XML存在不证明票真，正则可能取错编号，勾稽只检金额关系；无OCR的扫描件会跳过。xlsx实际保存为.xlsx.b64还需解码，缺session时global缓存可跨调用共享，不能把本地处理概括为严格会话隐私隔离。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手抄票面进表格，增量是XML优先、字段缺失/金额核对与重复票汇总接入DSH，并保留来源置信标记。PDF/XML与OOXML为既有格式，本插件不是税务查验服务；“搜索0结果”不证明生态首创。

相对手抄票面进表格，增量是XML优先、字段缺失/金额核对与重复票汇总接入DSH，并保留来源置信标记。PDF/XML与OOXML为既有格式，本插件不是税务查验服务；“搜索0结果”不证明生态首创。

XML优先与正则兜底分层、写前读取并replaceIfVersion降低覆盖冲突可借鉴；缓存身份及字段来源需要更严格保证。

固定源码依据：[src/index.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/index.ts)、[src/pdf-extract.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/pdf-extract.ts)、[src/invoice-model.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/invoice-model.ts)、[src/summary.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/summary.ts)、[src/tools/invoice-parse.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-parse.ts)、[src/tools/invoice-summary.ts](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/src/tools/invoice-summary.ts)、[package.json](https://github.com/988hj7tczd-oss/dsh-invoice-tools/blob/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

解析高置信和xlsx输出是否等于合格报销件？XML存在不证明票真，正则可能取错编号，勾稽只检金额关系；无OCR的扫描件会跳过。xlsx实际保存为.xlsx.b64还需解码，缺session时global缓存可跨调用共享，不能把本地处理概括为严格会话隐私隔离。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用脱敏且有XML/文本层的发票做汇总草稿；逐张核票号、买卖方与金额，确认缓存会话和.xlsx.b64解码后再交财务。

核查状态：源码支持本地解析/勾稽/汇总；未运行真实票据或验证Excel打开，财务正确性与真伪均未验。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.1.1；版本日期：2026-08-24（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[b1c8ee8f](https://github.com/988hj7tczd-oss/dsh-invoice-tools/tree/b1c8ee8f6ce6573e1de06587d428d331a0cfd02a)；本轮基准：2026-10-21T04:06:46Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：抽读PDF/字段模型、parse缓存、summary渲染/写入；未用真实发票或外部查验，无财务准确率。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

待验证假设：每字段保存原文位置/方法及人工确认，汇总只纳入确认字段且缓存缺session时拒绝，可减少错字段和跨会话混入。由置信度只按解析方法与global回退推导，未实现。对照错序文本、同号不同主体、扫描件和缺session，测错汇总/漏票与复核时间；不能用勾稽通过代替原票核对。

脱敏多模板/坏XML/扫描件/重复票/缺session对照人工金标准，并用独立表格软件打开解码产物；本轮不执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 256 | — | — | 3253 |
| .ts | source | 6 | 1973 | 1547 | 290 | — |
| .ts | test | 1 | 539 | 441 | 56 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-invoice-tools/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
