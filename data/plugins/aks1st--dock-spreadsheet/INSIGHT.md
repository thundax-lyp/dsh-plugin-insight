# dock-spreadsheet

> 在Dock只读预览工作簿及UTF-8分隔文本，保持表格坐标。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

分析版本：[8ad1eea](https://github.com/AKS1st/dock-spreadsheet/tree/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7)

<!-- BEGIN META -->
[![npm 30d 413](https://img.shields.io/static/v1?label=npm+30d&message=413&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dock-spreadsheet) [![最新发布 2026-10-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dock-spreadsheet)
<!-- END META -->

**使用建议**：用于小表快速阅读；需编辑、计算或完整报表时另用表格软件。

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

- **用途**：快速查看模型产出或工作区表格，不承担编辑和公式重新计算。

- **建议**：未验证假设：解析隔离到worker并提供取消/复杂度预算和公式缓存提示，可使大表失败可控。比较高压缩XLSX、大范围和陈旧公式缓存样例的峰值内存、可取消性及误判。

用于小表快速阅读；需编辑、计算或完整报表时另用表格软件。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，插件与依赖流程的实际运行尚未验证；未来假设未验证。

参照SheetJS解析、Papa Parse与Tabulator及外部电子表格软件；增量是本地受限读取与Dock viewer接入。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **界面**：只读多工作表预览
- **Host 路由**：/dock-spreadsheet/read二进制读取

**流程与依赖**

主机/read以同一open句柄核文件类型和20MiB前后大小，客户端解析后每表最多5000行256列、保留原起始坐标，文本URL窄匹配。

Dock/files、webServer/webRuntime；SheetJS CE、Papa Parse、Tabulator随包提供，浏览器本地解析。

选表→读原字节→解析workbook→切sheet/展示有界网格→点击显式http链接；无保存、宏或公式重算。

**效果与成本**

无模型token或CDN请求；打包依赖、全量解析和网格占浏览器资源，格式兼容须维护。

便捷坐标预览有实现，未证明替代专业表格工具或提升处理效率。

- **思考**：行列上限在工作簿解析之后才应用，20MiB压缩文件不代表展开内存有界；公式显示依赖缓存/格式化值，不能用预览判断计算正确。只读不意味着文件内容可当可靠业务报表。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：首行保留为数据而非猜标题、范围偏移保留为真实行列坐标，避免常见预览歧义；解析和虚拟表格来自上游。

首行保留为数据而非猜标题、范围偏移保留为真实行列坐标，避免常见预览歧义；解析和虚拟表格来自上游。

同句柄前后限长、首行不猜表头及单元格字符串化是清晰边界；链接只识别明确http(s)/www，保留其余文本。

源码依据：[src/index.ts](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/index.ts)、[src/client/index.ts](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/index.ts)、[src/client/workbook.ts](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/workbook.ts)、[src/client/links.ts](https://github.com/AKS1st/dock-spreadsheet/blob/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7/src/client/links.ts)。

<a id="detail-section-5"></a>

### 主要限制

行列上限在工作簿解析之后才应用，20MiB压缩文件不代表展开内存有界；公式显示依赖缓存/格式化值，不能用预览判断计算正确。只读不意味着文件内容可当可靠业务报表。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[AKS1st/dock-spreadsheet](https://github.com/AKS1st/dock-spreadsheet)
- **版本号**：0.1.0（[固定提交 8ad1eead](https://github.com/AKS1st/dock-spreadsheet/tree/8ad1eeadf9ed7e6d8b27373a76c20b08964efeb7)）
- **版本日期**：2026-10-01（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/index.ts、src/client/index.ts、src/client/workbook.ts、src/client/links.ts、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本插件列明注册、核心与副作用文件及作者资料的有界源码检查；inventory包含生成包时不将其重复代码计为独立原创。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核真实行列偏移、截断提示、UTF-8拒绝、缓存公式和复杂文件取消；本轮未运行解析。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

未验证假设：解析隔离到worker并提供取消/复杂度预算和公式缓存提示，可使大表失败可控。比较高压缩XLSX、大范围和陈旧公式缓存样例的峰值内存、可取消性及误判。

核真实行列偏移、截断提示、UTF-8拒绝、缓存公式和复杂文件取消；本轮未运行解析。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7a851bb1df355286a7cec7317e4f6b6b8f05eecd15ada0e079b027a8548c5db5。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 265 | — | — | 4733 |
| .js | source | 2 | 43324 | 43169 | 284 | — |
| .mjs | source | 2 | 19 | 19 | 1 | — |
| .ts | source | 6 | 635 | 406 | 190 | — |
| .tsx | source | 1 | 229 | 198 | 21 | — |
| .mjs | test | 3 | 355 | 305 | 36 | — |

排除 7 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AKS1st/dock-spreadsheet/issues) 查看。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
