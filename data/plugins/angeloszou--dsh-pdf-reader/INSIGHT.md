# dsh-pdf-reader

> 用PyMuPDF分析PDF页面内容，按文本、全页预览和高分辨率局部图像组合供视觉模型阅读。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[ffecd36](https://github.com/AngelosZou/dsh-pdf-reader/tree/ffecd361b7f2803fdccd1cf92149aad3e11a3271)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader) [![npm 30d 774](https://img.shields.io/static/v1?label=npm+30d&message=774&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader) [![最新发布 2026-08-26](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-26&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pdf-reader)
<!-- END META -->

**使用建议**：适合含图表论文的只读研究，先用标注页面检查漏区与权限边界；关键信息对照原PDF并明确引用页/区域。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [使用判断](#detail-section-2)
  - [能力、流程与成本](#detail-section-3)
  - [工程贡献](#detail-section-4)
  - [主要限制](#detail-section-5)
  - [核查说明与分析版本](#detail-section-6)
- [未来设计假设（未验证）](#detail-section-7)
- [辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 使用判断

- **用途**：读论文图表/公式时整页缩图可能丢细节，合格交付是答案引用的页面与区域可核而非只生成PNG。

- **建议**：由低清全页与局部裁图推导，可返回区域覆盖图和可疑未覆盖块，让视觉模型选择补裁并绑定page/bbox引用。未验证；标注双栏/跨页表/公式集比较漏读率、答案正确率及总图像调用成本，若只增图不增正确率则否定。

适合含图表论文的只读研究，先用标注页面检查漏区与权限边界；关键信息对照原PDF并明确引用页/区域。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

文本提取便宜但丢二维，整页图保布局却压细节；插件组合两者，不能保证完全覆盖。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：PDF扫描、页面混合读取和区域渲染。
- **后台**：Python内容检测与PNG缓存。

**流程与依赖**

DSH tools/subprocess/fs/timer、Python+PyMuPDF、另行可用read_image/视觉模型；依赖缺失仅给warning和安装建议。

scan规划页→mixed预览/文本/区域→read_image实际看图→render_region补细节→对照引用；缺依赖先人工决定安装。

**效果与成本**

首次解释器/依赖准备，持续CPU渲染、PNG磁盘与视觉模型调用/人工核对；高DPI不直接等于模型有效分辨率或省token。

局部渲染有明确资源分配思路，实际阅读准确性和成本改善未测。

- **思考**：自动裁图是否保证“无布局丢失”？列数、math fonts和表格块检测是启发式，图题或跨栏公式可能漏/裁断，路径返回也不表示模型已读。absPath允许绝对路径，helper宿主执行未见独立session sandboxPolicy检查，不能认定与普通read权限等价。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：增量是内容感知的预览→区域→定点放大流程和路径交付，避免整页平均分配图像预算；提取/渲染归PyMuPDF，视觉理解归模型。

增量是内容感知的预览→区域→定点放大流程和路径交付，避免整页平均分配图像预算；提取/渲染归PyMuPDF，视觉理解归模型。

独立helper、UTF8/argv、超时与路径结果有用；内容检测、缓存归属、输入读取权限需联合核查。 源码依据：[lib/index.js](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/index.js)、[lib/tools.js](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/tools.js)、[lib/runner.js](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/runner.js)、[lib/python.js](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/python.js)、[lib/pdf_helper.py](https://github.com/AngelosZou/dsh-pdf-reader/blob/ffecd361b7f2803fdccd1cf92149aad3e11a3271/lib/pdf_helper.py)。

<a id="detail-section-5"></a>

### 主要限制

自动裁图是否保证“无布局丢失”？列数、math fonts和表格块检测是启发式，图题或跨栏公式可能漏/裁断，路径返回也不表示模型已读。absPath允许绝对路径，helper宿主执行未见独立session sandboxPolicy检查，不能认定与普通read权限等价。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AngelosZou/dsh-pdf-reader](https://github.com/AngelosZou/dsh-pdf-reader)
- **版本号**：0.2.0（[固定提交 ffecd361](https://github.com/AngelosZou/dsh-pdf-reader/tree/ffecd361b7f2803fdccd1cf92149aad3e11a3271)）
- **版本日期**：2026-08-26（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/index.js、lib/tools.js、lib/runner.js、lib/python.js、lib/pdf_helper.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读lib/index.js、lib/tools.js、lib/runner.js、lib/python.js、lib/pdf_helper.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：固定PDF标注区域、公式/扫描/双栏样例比较整页和mixed正确率/总成本；测试越根路径、只读模式、超时和同名PDF缓存，不执行目标本轮代码。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由低清全页与局部裁图推导，可返回区域覆盖图和可疑未覆盖块，让视觉模型选择补裁并绑定page/bbox引用。未验证；标注双栏/跨页表/公式集比较漏读率、答案正确率及总图像调用成本，若只增图不增正确率则否定。

固定PDF标注区域、公式/扫描/双栏样例比较整页和mixed正确率/总成本；测试越根路径、只读模式、超时和同名PDF缓存，不执行目标本轮代码。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：ad2a362cf0183daaf7bee9a972981d3f26801fe7fa6a7a1b854e728d19839dcd。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 213 | — | — | 2153 |
| .js | source | 4 | 343 | 256 | 62 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader/issues?q=is%3Aissue+created%3A2026-09-21T08%3A03%3A07.249Z..2026-10-21T08%3A03%3A07.249Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AngelosZou/dsh-pdf-reader/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A03%3A07.249Z..2026-10-21T08%3A03%3A07.249Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
