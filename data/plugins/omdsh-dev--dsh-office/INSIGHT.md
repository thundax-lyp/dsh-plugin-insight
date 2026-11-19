# DSH Office

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[dfd99db](https://github.com/omdsh-dev/dsh-office/tree/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4)

<!-- BEGIN META -->
[![GitHub ★ 30](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=30&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-office) [![npm 30d 977](https://img.shields.io/static/v1?label=npm+30d&message=977&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-office) [![最新发布 2026-09-25](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-25&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@huiliyi37/dsh-office)
<!-- END META -->

> **功能**：为 DSH 提供表格、PDF、PPTX 和 DOCX 文件工具，包含生成、读取、部分编辑及公式检查。

> **亮点**：[Q01](#research-q01)/[Q02](#research-q02)支持常规但具体的适配增量：将四类成熟文件库统一成DSH参数化工具面，提供family开关及公式问题检查，降低部分临时接线负担。相对增量是工具集成和使用纪律，不是新格式引擎或自动正确交付。

> **主要限制**：[Q03](#research-q03)表明xlsx_recalc并不把结果回写文件；[Q04](#research-q04)的文字抽取/文字run修改不能验证视觉和完整内容，[Q05](#research-q05)又存在默认覆盖与部分写入。能生成文件和返回success，并不能独立证明可交付。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要统一的Office工具面，相比临时脚本多做了什么？](#detail-section-11)
  - [Q02 · 插件如何挂载，附带Skill是否自动启用，缺依赖怎样？](#detail-section-12)
  - [Q03 · xlsx_recalc会回写Excel计算缓存吗，audit能证明公式正确吗？](#detail-section-13)
  - [Q04 · 读取和编辑能保留什么，哪些输入会丢失信息？](#detail-section-14)
  - [Q05 · 文件覆盖和并发如何约束，失败恢复由谁负责？](#detail-section-15)
  - [Q06 · 一次合格文件任务的成本和可控试用方式是什么？](#detail-section-16)
  - [Q07 · 统一另存与可核对交付回执是否值得新增？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH内反复交付实际Office文件的用户，可用固定工具参数减少临时库脚本接线；成品仍须内容与视觉验收，见 [Q01](#research-q01)。

以模型每次手写ExcelJS/pdfkit/PptxGenJS/docx脚本和用户在Office应用中人工处理为基线。项目声明移植Tianshu，底层格式能力和部分审计思路有上游归属，不宣称原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| xlsx读写编辑 | 建表、读区域、改单元格或追加行 | 缓存与公式分开，编辑默认可覆盖 |
| xlsx有限求值 | 检查支持语法的公式错误 | 不回写计算缓存，不等Excel引擎 |
| xlsx结构审计 | 找可疑公式结构 | 启发式提示需确认，不自动修复 |
| PDF创建与抽取 | 生成内容块或读页文字 | 中文依赖字体，扫描图像无OCR |
| PDF合并拆分 | 按页组合或输出多文件 | 逐页写可部分完成，保留源件 |
| PPTX创建与读取 | 生成简报、查看文本和部分结构 | 非视觉验收，复杂对象未保证 |
| PPTX文字替换 | 修改单文字run内的匹配项 | 跨run不匹配，长字串需看溢出 |
| DOCX创建与读取 | 生成文档和抽取纯文字 | 读取截断，不含通用原位编辑 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Cordis/dsh-tools的宿主与编译lib | 加载必需 | 工具注册与调用 | peer/制品不符不能假设可用 |
| ExcelJS、PDF/Word/PPT库及Node运行环境 | 格式处理必需 | 读取、创建与修改 | 模块或格式操作报错，无外部转换降级 |
| 可用CJK字体 | 中文PDF可见性需要 | 嵌入中文字符 | 可生成并warning，必须人工看字 |
| 模型接入、明确数据与可写副本目录 | 实际任务需要 | 选择工具并交文件 | 不对唯一原件自动覆盖 |
| 目标Office/PDF查看器与人工核对 | 成品验收需要 | 检查公式语义和实际页面 | 工具success不能代替 |
| 另装附带Skill | 可选使用说明 | 分页与生成纪律 | 不自动注册，不当工具依赖 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选family并保留原件，明确新输出路径 | 数据和目标格式/应用有核对标准 |
| 加载 | 宿主注册所启用的工具族 | 能解析制品与依赖，非仅安装完成 |
| 执行 | 模型用参数调用本地库 | 核实际文件清单，错误可能已有部分写入 |
| 检查 | 读回内容、有限公式检查并用目标应用查看 | 处理截断/未知函数/字体warning，不把检查当完整重算 |
| 失败退出 | 用户停止覆盖，保留原件与已写副本 | 回人工Office处理，独立Skill需单独停用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配宿主、依赖下载、本机磁盘与字体 | 安装/构建、选择family、创建副本 | 真实兼容与配置时间未验 |
| 持续使用 | 本机解析/压缩资源和宿主模型调用 | 检查文字、公式及页面，处理截断 | 无云端转换调用不等于总费用为零 |
| 失败恢复 | 已写副本与临时输出的磁盘 | 核原件/新件、清理部分拆分页 | 未统一回滚，不能重试覆盖唯一原件 |
| 退出 | 留存文件和可能的独立Skill副本 | 停用工具并清理发现目录Skill | 文件不因禁用自动撤销，Skill需单独管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 固定工具面 | 14工具接到本机格式库 | 同任务节时和合格率 |
| 公式检查 | 有限求值与启发式警告 | 业务正确和Excel缓存更新 |
| 文件输出 | 有实际写入及部分另存选项 | 目标应用排版与复杂格式兼容 |

> **思考**：[Q03](#research-q03)表明xlsx_recalc并不把结果回写文件；[Q04](#research-q04)的文字抽取/文字run修改不能验证视觉和完整内容，[Q05](#research-q05)又存在默认覆盖与部分写入。能生成文件和返回success，并不能独立证明可交付。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)/[Q02](#research-q02)支持常规但具体的适配增量：将四类成熟文件库统一成DSH参数化工具面，提供family开关及公式问题检查，降低部分临时接线负担。相对增量是工具集成和使用纪律，不是新格式引擎或自动正确交付。

[Q02](#research-q02)按族注册及固定参数比临时脚本更容易复用，移植仍需宿主工具契约。[Q03](#research-q03)有限求值/启发式清楚区分可疑项有价值，但不是完整公式引擎。[Q05](#research-q05)PDF create的临时文件rename优于直接覆盖，其他写路径尚未统一，也未实现按目标路径串行化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)表明xlsx_recalc并不把结果回写文件；[Q04](#research-q04)的文字抽取/文字run修改不能验证视觉和完整内容，[Q05](#research-q05)又存在默认覆盖与部分写入。能生成文件和返回success，并不能独立证明可交付。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在新目录用小表和短报告试用，保留原件，指定output_path并检查实际文件与页面；公式检查不写回缓存。缺字、内容截断、计算不符或非预期覆盖时停止自动交付并回人工Office，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已确认DSH工具挂载及四类文件处理机制，明确有限求值、文本读取、原位写入等范围。采用建议是副本小任务试用，未完成真实渲染或宿主验收；统一回执为未验证假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、tsconfig.json、README.md、src/index.ts、src/excel.ts、src/excel-audit.ts、src/pdf.ts、src/pdf-ops.ts、src/fonts.ts、src/ppt.ts、src/docx.ts、src/write.ts、src/text-output.ts、skills/dsh-office/SKILL.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查root清单/补丁/tsconfig、四族入口、Excel读写/求值审计、PDF字体/文本/页操作、PPT文字run编辑、DOCX生成/抽取、写与输出辅助及附带Skill说明。INVENTORY覆盖完整组件；本次关键源码检查不等所有格式或所有第三方库审计。
- 下一步：- 已检查固定源码，未运行插件或安装依赖。
- 未生成、打开或修改真实Office文件，未做宿主加载/成品渲染验收。
- 公式差分与目标应用排版属于具体采用缺口，success字符串不代表实测通过。

**分析版本**

- **仓库**：[omdsh-dev/dsh-office](https://github.com/omdsh-dev/dsh-office)
- **版本号**：0.2.5（[固定提交 dfd99db](https://github.com/omdsh-dev/dsh-office/tree/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07)提出统一另存与检查范围回执，先明确哪些文件已写、哪些校验未做，再让用户决定交付；用误交付和核对负担验证，不把这个方案记为现有门禁。

- 已检查固定源码，未运行插件或安装依赖。
- 未生成、打开或修改真实Office文件，未做宿主加载/成品渲染验收。
- 公式差分与目标应用排版属于具体采用缺口，success字符串不代表实测通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 350 | — | — | 3329 |
| .ts | source | 10 | 3484 | 3007 | 208 | — |
| .ts | test | 9 | 1315 | 1107 | 44 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-office/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-19。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对四类文件工具的实际交付能力、公式/格式边界和文件写入责任，判断可控采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要统一的Office工具面，相比临时脚本多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在DSH中反复把结构化内容交成xlsx、PDF、pptx或docx文件，且能人工核对成品的用户。合格交付应是内容、公式和可见版式符合要求的实际文件，不是工具返回“Generated”字符串。相比每次让模型写脚本并选择底层库，插件给模型提供固定参数和14个实际注册的工具，另提供公式问题检查及文档使用说明。

这是一项适配与整合贡献。README及入口明确说明移植自Tianshu，文件生成、抽取、压缩和渲染主要来自ExcelJS、pdfkit/pdf-lib、PptxGenJS、docx/mammoth等成熟库；不能把这些格式能力或公式审计思路全部归为本项目原创。偶发纯文本任务没有必须引入四族工具的理由，family可关闭以收窄工具面。实际节时和交付合格率未测。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:5-26](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/README.md#L5-L26)

作者定位、移植归属和真实工具用途。

<details>
<summary>查看原文（22行）</summary>

```text
Office document tools for [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`): generate, read, and edit spreadsheets (`.xlsx`), PDFs, presentations (`.pptx`), and Word documents (`.docx`).

Ported from the office plugins of the [Tianshu](https://github.com/Tianshu-Tui) terminal coding agent (Apache-2.0 licensed upstream), adapted to the dsh cordis tool model.

## Tools

| Tool | What it does |
| --- | --- |
| `xlsx_read` | List sheets of a `.xlsx`, or read one sheet as a markdown table (range-limited for large files; formula text preserved) |
| `xlsx_write` | Write a 2D array to a new `.xlsx` (formula cells, header bold, column widths, number formats) |
| `xlsx_edit` | Edit an existing `.xlsx`: add sheets, update cells (value or formula), append rows |
| `xlsx_recalc` | Recalculate every formula with a lightweight pure-TS engine and report error values (`#REF!`, `#DIV/0!`, `#VALUE!`, `#N/A`, `#NAME?`, `#NUM!`) with locations |
| `xlsx_audit` | Statically audit formula structure: array-formula traps, aggregation ranges missing rows, formulas overwritten by hardcoded values, inconsistent formulas in a column, self-references, division by zero |
| `pdf_create` | Generate a real PDF with headings, paragraphs, tables, lists, code blocks and footer page numbers; CJK text renders via an auto-detected system font |
| `pdf_read` | Extract text from a PDF for reading into context |
| `pdf_merge` | Merge multiple PDFs into one, in order |
| `pdf_split` | Split a PDF into single-page files, or extract pages by spec (`"1,3,5-7"`) |
| `pptx_create` | Generate a `.pptx` deck from slide definitions (title / section / content / two-column / image / table / chart), with optional theme and speaker notes |
| `pptx_read` | Extract slide text as markdown, optionally including speaker notes; `include` adds structure (summary/layouts/images/tables: shape names & cm positions, image targets, table dims) |
| `pptx_edit` | Find/replace text inside an existing `.pptx` (`<a:t>` surgery), preserving all layout and styling |
| `docx_create` | Generate a real `.docx` Word document from content blocks (heading / paragraph / table / code / list), with optional striped tables, page background color, and diagonal text watermark |
| `docx_read` | Extract text from a `.docx` for reading into context |
```

</details>

**依据 2 · 源码核查**：[src/index.ts:18-57](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/index.ts#L18-L57)

四族注册器和按需关闭。

<details>
<summary>查看原文（40行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { registerExcelTools } from './excel.js'
import { registerPdfTools } from './pdf.js'
import { registerPptTools } from './ppt.js'
import { registerDocxTools } from './docx.js'

export const name = 'dsh-office'

/** Requires the tool registry seam. */
export const inject = ['tools'] as const

/** Per-family enable switches. Families omitted from `enable` stay enabled. */
export interface Config {
  enable?: {
    xlsx?: boolean
    pdf?: boolean
    ppt?: boolean
    docx?: boolean
  }
}

/** Schemastery configuration for loader validation. */
export const Config: z<Config> = z.object({
  enable: z.object({
    xlsx: z.boolean().required(false),
    pdf: z.boolean().required(false),
    ppt: z.boolean().required(false),
    docx: z.boolean().required(false),
  }).required(false),
})

/** Register office tools on the shared tool registry, honoring family switches. */
export function apply(ctx: Context, config: Config = {}): void {
  const enable = config.enable ?? {}
  if (enable.xlsx !== false) registerExcelTools(ctx)
  if (enable.pdf !== false) registerPdfTools(ctx)
  if (enable.ppt !== false) registerPptTools(ctx)
  if (enable.docx !== false) registerDocxTools(ctx)
}
```

</details>

**依据 3 · 源码核查**：[package.json:51-64](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/package.json#L51-L64)

格式能力依赖第三方库。

<details>
<summary>查看原文（14行）</summary>

```text
    "exceljs": "^4.4.0",
    "jszip": "^3.10.1",
    "mammoth": "^1.12.1",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^6.3.289",
    "pdfkit": "^0.15.0",
    "pptxgenjs": "^3.12.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.5 || ^0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
```

</details>

#### 缺口

- 缺少固定任务的手写库脚本/人工Office操作对照
  **影响**：无法确认统一工具面是否减少总工时或返工
  **进一步探讨**：用同一份表格、短报告和演示任务比较内容正确、版式问题与人工修订时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件如何挂载，附带Skill是否自动启用，缺依赖怎样？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

package导出lib/index.js，TypeScript从src按NodeNext编译到lib；bundle补丁按@huiliyi37/dsh-office装入入口。apply只注入tools并按enable开关调用四族注册器，默认全开；PDF注册器进一步注册merge/split，14个工具不是仅README清单。能力路径直接进入本机JS库和文件系统。

随包skills/dsh-office/SKILL.md包含分页和生成纪律，但入口没有注册Skill，README要求用户另复制到宿主发现目录。因此“安装工具包”不能写成“Skill已自动生效”。包的prepare/prepack负责构建，源码checkout没有lib时需先产生制品；本轮未安装构建，不把tsconfig映射当真实制品验证。peer范围约束Cordis与dsh-tools，README的兼容说明仍是作者声明。缺所需库/宿主tools会妨碍模块加载或注册，没有统一网络替代服务或运行时自修复机制。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:7-31](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/package.json#L7-L31)

导出lib与补丁。

<details>
<summary>查看原文（25行）</summary>

```text
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "cordis.patch.yml",
    "skills",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
  },
  "license": "Apache-2.0",
  "publishConfig": {
    "access": "public"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:44-69](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/package.json#L44-L69)

构建、依赖与peer范围。

<details>
<summary>查看原文（26行）</summary>

```text
    "prepack": "npm run build",
    "test": "vitest run",
    "typecheck": "tsc --noEmit -p tsconfig.json"
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.18.1",
    "docx": "^9.7.1",
    "exceljs": "^4.4.0",
    "jszip": "^3.10.1",
    "mammoth": "^1.12.1",
    "pdf-lib": "^1.17.1",
    "pdfjs-dist": "^6.3.289",
    "pdfkit": "^0.15.0",
    "pptxgenjs": "^3.12.0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-tools": "^0.1.0-rc.5 || ^0.2.0-rc.1"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.0.4",
    "@deepseek-ai/dsh-system-prompt": "0.2.0-rc.2",
    "@deepseek-ai/dsh-tools": "0.2.0-rc.2",
    "@types/fontkit": "^2.0.9",
    "@types/node": "^26.2.0",
    "@types/pdfkit": "^0.17.6",
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-11](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/cordis.patch.yml#L1-L11)

真实包名挂载与family配置。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: dsh-office
      name: '@huiliyi37/dsh-office'
      # Load every family (default). To load only a subset, list the families
      # you want and set the others to false — e.g. PDF + DOCX only:
      # config:
      #   enable:
      #     xlsx: false
      #     pdf: true
      #     ppt: false
      #     docx: true
```

</details>

**依据 4 · 源码核查**：[tsconfig.json:1-19](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/tsconfig.json#L1-L19)

src→lib构建映射。

<details>
<summary>查看原文（19行）</summary>

```text
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "lib",
    "rootDir": "src",
    "skipLibCheck": true,
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src/**/*.ts"]
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:18-57](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/index.ts#L18-L57)

仅tools注入和四族开关。

<details>
<summary>查看原文（40行）</summary>

```text
import type { Context } from '@deepseek-ai/cordis'
import z from '@deepseek-ai/schemastery'
import { registerExcelTools } from './excel.js'
import { registerPdfTools } from './pdf.js'
import { registerPptTools } from './ppt.js'
import { registerDocxTools } from './docx.js'

export const name = 'dsh-office'

/** Requires the tool registry seam. */
export const inject = ['tools'] as const

/** Per-family enable switches. Families omitted from `enable` stay enabled. */
export interface Config {
  enable?: {
    xlsx?: boolean
    pdf?: boolean
    ppt?: boolean
    docx?: boolean
  }
}

/** Schemastery configuration for loader validation. */
export const Config: z<Config> = z.object({
  enable: z.object({
    xlsx: z.boolean().required(false),
    pdf: z.boolean().required(false),
    ppt: z.boolean().required(false),
    docx: z.boolean().required(false),
  }).required(false),
})

/** Register office tools on the shared tool registry, honoring family switches. */
export function apply(ctx: Context, config: Config = {}): void {
  const enable = config.enable ?? {}
  if (enable.xlsx !== false) registerExcelTools(ctx)
  if (enable.pdf !== false) registerPdfTools(ctx)
  if (enable.ppt !== false) registerPptTools(ctx)
  if (enable.docx !== false) registerDocxTools(ctx)
}
```

</details>

**依据 6 · 源码核查**：[src/pdf.ts:296-302](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L296-L302)

PDF入口转注册页面操作。

```text
// ── registration ─────────────────────────────────────────────────

export function registerPdfTools(ctx: Context): void {
  registerPdfOpsTools(ctx)
  ctx.tools.register(defineTool({
    name: 'pdf_create',
    description: 'Generate a real PDF with text, headings, tables, and lists. CJK text is rendered via an auto-detected system font (warns if none found). Content is an array of blocks: {type:"heading"|"h2"|"h3"|"paragraph"|"table"|"code"|"list", text?, headers?, rows?, items?, ordered?}.',
```

**依据 7 · 源码核查**：[README.md:87-95](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/README.md#L87-L95)

附带Skill需另装入发现根。

````text
## Skill

The package ships a usage skill (`skills/SKILL.md`, anthropics-compatible
format) that teaches the model large-file pagination and generation
discipline. Install it into a skill discovery root:

```sh
mkdir -p ~/.dsh/skills && cp -r node_modules/@huiliyi37/dsh-office/skills/dsh-office ~/.dsh/skills/
```
````

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · xlsx_recalc会回写Excel计算缓存吗，audit能证明公式正确吗？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

不会将计算结果回写xlsx。xlsx_recalc读取工作簿后调用recalcWorkbook，只返回错误计数、位置与warning。求值器使用本次内存formulaCache，遍历公式并计算错误，既不把结果写入cell.value，也没有再调用xlsx.writeFile。因此它是有限纯TS求值检查，不是Excel/LibreOffice完整重算服务；success不能说明外部应用打开后缓存已更新，也不能说明所有业务公式语义正确。

不支持函数会被记录并以#NAME?处理；timeout参数转换成步数预算，最多两百万步，不是启动可强制中断的Office进程或真实墙钟超时。audit另扫缓存错误、数组公式风险、自引用、漏行和结构不一致等启发式，只给可疑位置，代码明确要求人/模型确认、不自动修复。

因此生成含公式文件后，模型可用这两工具发现部分问题，但交付还需核实际单元格、业务预期和目标表格应用。静态结构相似不保证公式正确，启发式命中也不等于已确认缺陷。

#### 证据与依据

**依据 1 · 源码核查**：[src/excel.ts:350-387](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L350-L387)

读取后只生成结果文本，没有写回。

<details>
<summary>查看原文（38行）</summary>

```text
async function xlsxRecalc(params: {
  file_path: string
  timeout?: number
}): Promise<string> {
  const filePath = params.file_path
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)

  const result = await recalcWorkbook(workbook, params.timeout ?? 30)
  const lines = [
    `status: ${result.status}`,
    `total_formulas: ${result.total_formulas}`,
    `total_errors: ${result.total_errors}`,
  ]
  const errors = Object.entries(result.error_summary)
  if (errors.length > 0) {
    lines.push('')
    lines.push('error_summary:')
    for (const [err, info] of errors) {
      lines.push(`  ${err}: ${info.count} hit(s)`)
      for (const loc of info.locations) {
        lines.push(`    ${loc}`)
      }
    }
  }
  for (const w of result.warnings) {
    lines.push(`warning: ${w}`)
  }
  if (result.status === 'errors_found') {
    lines.push('')
    lines.push('Fix the reported formula cells, then re-run xlsx_recalc until status is success before delivery.')
  }
  return lines.join('\n')
}
```

</details>

**依据 2 · 源码核查**：[src/excel-audit.ts:1025-1083](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel-audit.ts#L1025-L1083)

内存求值缓存、步数上限、unsupported函数及返回统计。

<details>
<summary>查看原文（59行）</summary>

```text
export async function recalcWorkbook(wb: Workbook, timeoutSec = 30): Promise<RecalcResult> {
  const ctx: EvalContext = {
    wb,
    formulaCache: new Map(),
    evalStack: new Set(),
    steps: 0,
    maxSteps: Math.max(1000, Math.min(2_000_000, Math.floor(timeoutSec * 200_000))),
    unknownFunctions: new Set(),
  }

  const errorSummary: Record<string, { count: number; locations: string[] }> = {}
  let totalFormulas = 0

  const record = (err: ErrorCode, location: string): void => {
    const entry = (errorSummary[err] ??= { count: 0, locations: [] })
    entry.count++
    if (entry.locations.length < 20) entry.locations.push(location)
  }

  for (const ws of wb.worksheets) {
    ws.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        const raw = cell.value
        if (raw === null || raw === undefined || typeof raw !== 'object') return
        const obj = raw as { formula?: string; result?: unknown }
        if (typeof obj.formula !== 'string' || obj.formula.length === 0) return
        totalFormulas++
        const key = `${ws.name.toLowerCase()}!${cell.col}:${cell.row}`
        ctx.evalStack.add(key)
        const formulaText = obj.formula.startsWith('=') ? obj.formula.slice(1) : obj.formula
        let v: Value
        try {
          v = new Parser(tokenize(formulaText), ctx, ws.name).parse()
        } catch {
          v = ERR.value
        }
        ctx.evalStack.delete(key)
        ctx.formulaCache.set(key, v)
        if (isErr(v)) {
          record(v.err, `${ws.name}!${cell.address}`)
        }
      })
    })
  }

  const warnings: string[] = []
  if (ctx.unknownFunctions.size > 0) {
    warnings.push(`Unsupported functions (evaluated as #NAME?): ${[...ctx.unknownFunctions].sort().join(', ')}`)
  }

  const totalErrors = Object.values(errorSummary).reduce((s, e) => s + e.count, 0)
  return {
    status: totalErrors > 0 ? 'errors_found' : 'success',
    total_formulas: totalFormulas,
    total_errors: totalErrors,
    error_summary: errorSummary,
    warnings,
  }
}
```

</details>

**依据 3 · 源码核查**：[src/excel-audit.ts:1-16](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel-audit.ts#L1-L16)

启发式来源与不自动修复声明。

<details>
<summary>查看原文（16行）</summary>

```text
// xlsx_audit / xlsx_recalc — formula quality gates for .xlsx workbooks.
//
// Heuristics adapted from the WPS Lingxi office-skills xlsx skill
// (recalc.py + audit.py, Apache-2.0 lineage via the Tianshu upstream):
//   • xlsx_recalc evaluates every formula with a lightweight pure-TS engine
//     and scans the results for error values (#REF!, #DIV/0!, #VALUE!, #N/A,
//     #NAME?, #NUM!) plus the "array formula trap" — constructs that Python
//     engines compute fine but Excel evaluates as #VALUE!.
//   • xlsx_audit statically inspects formula structure for problems a value
//     scan cannot see: aggregation ranges that miss an adjacent data row,
//     formulas overwritten by hardcoded values, inconsistent formulas within
//     a column, self-references, and literal division by zero.
//
// Both are zero-dependency on top of exceljs and intentionally heuristic —
// they flag suspicions for the model to confirm, never silently fix.

```

</details>

**依据 4 · 源码核查**：[src/excel-audit.ts:1132-1182](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel-audit.ts#L1132-L1182)

具体audit规则。

<details>
<summary>查看原文（51行）</summary>

```text
export async function auditWorkbook(wb: Workbook): Promise<AuditResult> {
  const summary: Record<string, number> = {}
  const warningsMap = new Map<string, AuditWarning>()
  let totalFormulas = 0

  const addWarning = (type: string, location: string): void => {
    summary[type] = (summary[type] ?? 0) + 1
    const w = warningsMap.get(type) ?? { type, count: 0, samples: [] }
    w.count++
    if (w.samples.length < 5) w.samples.push(location)
    warningsMap.set(type, w)
  }

  const columnFormulas = new Map<string, Map<string, Array<{ row: number; text: string }>>>()
  const columnValues = new Map<string, Map<string, Map<number, number>>>()

  for (const ws of wb.worksheets) {
    const sheetKey = ws.name.toLowerCase()
    ws.eachRow({ includeEmpty: false }, (row) => {
      row.eachCell({ includeEmpty: false }, (cell) => {
        const raw = cell.value
        const colKey = `${sheetKey}|${colToLetter(Number(cell.col))}`
        if (raw === null || raw === undefined) return
        if (typeof raw === 'object') {
          const obj = raw as { formula?: string; result?: unknown }
          if (typeof obj.formula === 'string' && obj.formula.length > 0) {
            const text = obj.formula.startsWith('=') ? obj.formula.slice(1) : obj.formula
            totalFormulas++
            const bySheet = columnFormulas.get(colKey) ?? new Map()
            const list = bySheet.get(sheetKey) ?? []
            list.push({ row: cell.row, text })
            bySheet.set(sheetKey, list)
            columnFormulas.set(colKey, bySheet)

            if (typeof obj.result === 'string' && EXCEL_ERRORS.includes(obj.result as ErrorCode)) {
              addWarning('cached_error_value', `${ws.name}!${cell.address}`)
            }
            if (ARRAY_TRAP_RE.test(text)) {
              addWarning('array_formula_risk', `${ws.name}!${cell.address}`)
            }
            if (refsInFormula(text).some(
              r => (r.sheet === '' || r.sheet === sheetKey) && r.start.col === Number(cell.col) && r.start.row === Number(cell.row),
            )) {
              addWarning('self_reference', `${ws.name}!${cell.address}`)
            }
            if (/\/\s*0([^.\d]|$)/.test(text)) {
              addWarning('division_by_zero', `${ws.name}!${cell.address}`)
            }
            AGGREGATE_RE.lastIndex = 0
            if (AGGREGATE_RE.test(text)) {
              for (const ref of refsInFormula(text)) {
```

</details>

**依据 5 · 源码核查**：[src/excel.ts:400-420](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L400-L420)

audit输出要求确认每条可疑项。

<details>
<summary>查看原文（21行）</summary>

```text
  const result = await auditWorkbook(workbook)
  const lines = [
    `status: ${result.status}`,
    `total_formulas: ${result.total_formulas}`,
  ]
  const types = Object.entries(result.summary)
  if (types.length > 0) {
    lines.push('')
    lines.push('summary:')
    for (const [type, count] of types) {
      lines.push(`  ${type}: ${count}`)
    }
    lines.push('')
    lines.push('warnings:')
    for (const w of result.warnings) {
      lines.push(`  ${w.type} (${w.count}): ${w.samples.join(', ')}`)
    }
    lines.push('')
    lines.push('These are heuristic suspicions — inspect each sample and fix, or confirm it is intentional.')
  }
  return lines.join('\n')
```

</details>

#### 缺口

- 纯TS求值与目标Office应用的函数语义覆盖未做差分验证
  **影响**：不能用success替代完整重算和业务结果核验
  **进一步探讨**：在副本上用带边界值、未知函数、跨表引用的样本对比目标应用结果与检查输出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 读取和编辑能保留什么，哪些输入会丢失信息？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

读取以文字或结构摘要为主，不是所见即所得预览。xlsx_read保留公式文本和已有缓存值，但缓存可能旧；PDF用pdfjs逐页抽取文字，没有OCR调用，扫描图像不能据空文字判空白；DOCX用mammoth.extractRawText并在8000字符截断，也不保留版式信息。PDF分页参数是在抽取全部页面后选择返回范围，输出变短不意味着解析资源按页降低。

PPTX读取可输出文字、几何和图片目标等结构。编辑仅对每个<a:t>文字run做普通字符串替换，其余ZIP条目尽量不动；跨run拆开的词不会按整段匹配。替换长文本即使保留原布局XML，也可能出现溢出或换行变化，因此“保留全部样式”不能替代实际渲染。DOCX只提供create/read，没有通用的现存Word文档原位编辑工具。PDF创建依赖本机CJK字体，找不到会继续生成并给warning，生成成功不证明中文可见。

#### 证据与依据

**依据 1 · 源码核查**：[src/excel.ts:145-165](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L145-L165)

公式读取保留文本与缓存，而非再次求值。

<details>
<summary>查看原文（21行）</summary>

```text
  endCol = Math.min(endCol, ws.columnCount || 26)

  // Read cells into markdown table
  const rows: string[][] = []
  for (let r = startRow; r <= endRow; r++) {
    const row = ws.getRow(r)
    const cells: string[] = []
    for (let c = startCol; c <= endCol; c++) {
      const cell = row.getCell(c)
      const val = cell.value
      if (val && typeof val === 'object' && 'formula' in val) {
        // Formula cell: show cached result when present, always keep formula text
        const text = `=${String((val as { formula: string }).formula)}`
        const result = (val as { result?: unknown }).result
        cells.push(result !== undefined && result !== null ? `${String(result)} (${text})` : text)
      } else if (val && typeof val === 'object' && 'result' in val) {
        cells.push(String((val as { result?: unknown }).result ?? ''))
      } else if (val !== null && val !== undefined) {
        cells.push(String(val))
      } else {
        cells.push('')
```

</details>

**依据 2 · 源码核查**：[src/pdf.ts:268-294](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L268-L294)

PDF全文抽取没有OCR且先遍历全部页。

<details>
<summary>查看原文（27行）</summary>

```text
const PDF_READ_CHAR_CAP = 8000

async function extractPdfPages(filePath: string): Promise<PdfPageText[]> {
  // 用现代的 pdfjs-dist 取代 pdf-parse：后者内置的是 2018 年版 pdf.js，一旦
  // 同进程加载过 pdfkit 的字体依赖 fontkit（它会往 globalThis 注入一批 TS helper），
  // pdf-parse 便 100% 报 'bad XRef entry' 解析失败；pdfjs-dist 不受该污染影响，
  // 且持续维护。详见 issue 后续调查。
  const { getDocument } = await import('pdfjs-dist/legacy/build/pdf.mjs')
  const buffer = new Uint8Array(readFileSync(filePath))
  const loadingTask = getDocument({ data: buffer, useSystemFonts: true })
  const doc = await loadingTask.promise
  try {
    const pages: PdfPageText[] = []
    for (let i = 1; i <= doc.numPages; i++) {
      const page = await doc.getPage(i)
      const content = await page.getTextContent()
      const text = content.items
        .map((item) => ('str' in item ? item.str : ''))
        .join(' ')
        .trim()
      pages.push({ page: i, text })
    }
    return pages
  } finally {
    await loadingTask.destroy()
  }
}
```

</details>

**依据 3 · 源码核查**：[src/pdf.ts:340-360](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L340-L360)

返回页范围在抽取之后处理。

<details>
<summary>查看原文（21行）</summary>

```text
    execute: async (args) => {
      const fp = args.file_path
      if (!fp) throw new Error('file_path is required')
      if (!existsSync(fp)) throw new Error(`file not found: ${fp}`)

      try {
        const pages = await extractPdfPages(fp)
        if (pages.length === 0) {
          return { content: 'PDF appears to contain no extractable text (scanned image?).' }
        }
        const start = Math.max(1, args.start_page ?? 1)
        const end = Math.min(pages.length, args.end_page ?? pages.length)
        if (start > end) {
          throw new Error(`invalid page range: start_page ${start} > end_page ${end} (total ${pages.length} pages)`)
        }

        // Page markers + per-page text, truncated at the page boundary.
        const blocks: string[] = []
        let chars = 0
        for (let i = start - 1; i < end; i++) {
          const p = pages[i]
```

</details>

**依据 4 · 源码核查**：[src/docx.ts:229-240](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/docx.ts#L229-L240)

DOCX抽取纯文本并截断。

<details>
<summary>查看原文（12行）</summary>

```text
const DOCX_READ_CHAR_CAP = 8000

async function docxRead(filePath: string): Promise<string> {
  if (!existsSync(filePath)) throw new Error(`file not found: ${filePath}`)
  const result = await mammoth.extractRawText({ path: filePath })
  const text = result.value ?? ''
  if (!text.trim()) return 'DOCX appears to contain no extractable text.'
  const truncated = text.length > DOCX_READ_CHAR_CAP
    ? text.slice(0, DOCX_READ_CHAR_CAP) + `\n\n... (truncated, ${text.length - DOCX_READ_CHAR_CAP} more chars.)`
    : text
  return truncated
}
```

</details>

**依据 5 · 源码核查**：[src/ppt.ts:453-503](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/ppt.ts#L453-L503)

文字run替换与重写ZIP。

<details>
<summary>查看原文（51行）</summary>

```text
  const report: string[] = []
  let totalReplacements = 0

  for (const op of operations) {
    if (!op || typeof op.find !== 'string' || op.find.length === 0) {
      throw new Error('each operation needs a non-empty find string')
    }
    const find = op.find
    const replace = typeof op.replace === 'string' ? op.replace : ''
    const targets = op.slide
      ? [op.slide].filter(n => Number.isInteger(n) && n >= 1 && n <= slideNumbers[slideNumbers.length - 1]!)
      : slideNumbers
    if (targets.length === 0) {
      throw new Error(`slide ${String(op.slide)} out of range (deck has ${slideNumbers.length} slides)`)
    }

    const perSlide: string[] = []
    for (const num of targets) {
      const path = `ppt/slides/slide${num}.xml`
      const file = zip.file(path)
      if (!file) continue
      let xml = await file.async('string')
      let count = 0
      xml = xml.replace(run, (full, attrs: string, content: string) => {
        const text = unescapeXml(content)
        if (!text.includes(find)) return full
        count++
        return `<a:t${attrs}>${escapeXml(text.split(find).join(replace))}</a:t>`
      })
      if (count > 0) {
        zip.file(path, xml)
        perSlide.push(`${num}×${count}`)
        totalReplacements += count
      }
    }

    if (perSlide.length > 0) {
      report.push(`"${find}" → "${replace}": ${perSlide.join(', ')}`)
    }
  }

  if (totalReplacements === 0) {
    return `📊 PPTX: No text matches found in ${basename(filePath)} — nothing changed`
  }

  const outPath = params.output_path || filePath
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  ensureParentDir(outPath)
  writeFileSync(outPath, buf)
  const name = basename(filePath)
  return `📊 PPTX: Edited "${name}" — ${totalReplacements} replacement(s)\n${report.map(r => `   ${r}`).join('\n')}\n   File: ${outPath}`
```

</details>

**依据 6 · 源码核查**：[src/pdf.ts:60-96](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L60-L96)

CJK字体缺失继续并warning。

<details>
<summary>查看原文（37行）</summary>

```text
async function generatePdf(filePath: string, input: PdfInput): Promise<string[]> {
  const warnings: string[] = []

  // CJK glyphs are absent from the built-in fonts — resolve a system font.
  const cjkNeeded = containsCjk(collectText(input))
  let cjkFont: ResolvedCjkFont | null = null
  if (cjkNeeded) {
    cjkFont = await resolveCjkFont()
    if (!cjkFont) {
      warnings.push('未找到 CJK 字体，中文可能无法渲染 (no CJK font found on this system; Chinese text may not render)')
    }
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: !!input.pageNumbers })
  const buffers: Buffer[] = []
  // pdfkit's typed `on` overloads are narrower than the runtime event set;
  // route events through the generic emitter surface.
  const emitter = doc as unknown as Pick<NodeJS.EventEmitter, 'on'>

  // Body/heading font setters — code blocks always switch back via applyBody.
  const applyBody = (): void => {
    if (cjkFont) {
      if (cjkFont.name) doc.font(cjkFont.path, cjkFont.name)
      else doc.font(cjkFont.path)
    } else {
      doc.font('Helvetica')
    }
  }
  const applyHeading = (): void => {
    if (cjkFont) {
      const name = cjkFont.headingName || cjkFont.name
      if (name) doc.font(cjkFont.path, name)
      else doc.font(cjkFont.path)
    } else {
      doc.font('Helvetica')
    }
  }
```

</details>

**依据 7 · 源码核查**：[src/docx.ts:243-291](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/docx.ts#L243-L291)

Word工具仅create和read。

<details>
<summary>查看原文（49行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'docx_create',
    description: 'Generate a real .docx Word document from content blocks: {type:"heading"|"h2"|"h3"|"paragraph"|"table"|"code"|"list", text?, headers?, rows?, items?, stripe?}. Optional title renders as a centered bold heading. Optional background_color fills every page (e.g. a cover). Optional watermark overlays diagonal text (e.g. 机密 / DRAFT). Tables with stripe:true get a shaded header row and alternating row tints.',
    parameters: {
      destination_path: { type: 'string', required: true, description: 'Output .docx file path' },
      title: { type: 'string', description: 'Document title (centered, bold)' },
      background_color: { type: 'string', description: 'Page background color, hex without "#" (e.g. "1A1A2E" for a dark cover)' },
      watermark: {
        type: 'object',
        additionalProperties: false,
        description: 'Diagonal text watermark overlay',
        properties: {
          text: { type: 'string', required: true, description: 'Watermark text, e.g. "机密" or "DRAFT"' },
          color: { type: 'string', description: 'Watermark color, hex without "#" (default black)' },
          opacity: { type: 'number', description: 'Opacity 0..1 (default 0.3)' },
        },
      },
      content: {
        type: 'array', required: true,
        description: 'Content blocks: [{type, text?, headers?, rows?, items?, stripe?}]',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            type: { type: 'string', enum: ['heading', 'h2', 'h3', 'paragraph', 'table', 'code', 'list'] as const },
            text: { type: 'string' },
            headers: { type: 'array', items: { type: 'string' } },
            rows: { type: 'array', items: { type: 'array' } },
            items: { type: 'array', items: { type: 'string' } },
            stripe: { type: 'boolean', description: 'Table: shaded header row + alternating row tints' },
          },
        },
      },
    },
    output: textOutput,
    execute: async (args) => ({ content: await docxCreate(args) }),
    isConcurrencySafe: () => true,
  }))
  ctx.tools.register(defineTool({
    name: 'docx_read',
    description: 'Extract plain text from a .docx Word document for reading into context. Large documents are truncated at 8000 characters.',
    parameters: {
      file_path: { type: 'string', required: true, description: 'Path to the .docx file to read' },
    },
    output: textOutput,
    execute: async (args) => ({ content: await docxRead(args.file_path) }),
    isConcurrencySafe: () => true,
  }))
}
```

</details>

#### 缺口

- 未对真实排版、中文字体和复杂Office特性做渲染对照
  **影响**：不能保证现存模板编辑后视觉和特殊对象不变
  **进一步探讨**：选含跨run文字、中文、表格和图表的副本，目标应用打开并逐页比较，再决定适用输入范围。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 文件覆盖和并发如何约束，失败恢复由谁负责？

**研究主题**：工程质量与复用、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

插件只注入tools，并直接以传入路径调用fs或格式库；ensureParentDir仅递归建父目录，不限定工作区，也没有插件级路径许可/用户确认。宿主策略是否限制调用，需单独核实际工具执行环境；不能把普通工具注册等同于OS沙箱。

xlsx_edit及pptx_edit未给output_path时覆盖输入文件。PPTX编辑标记isConcurrencySafe=false，而PDF生成/合并/拆分页等标true，但路径没有互斥，两个请求使用同一目标仍可能覆盖。这里的“并发安全”不能解释成同路径写入有冲突检测。PDF创建同目录临时文件+rename，错误转Promise拒绝，是局部较好的原子替换；其他ExcelJS、DOCX和PDF页面操作并不统一采用同一写事务。

PDF拆分按页逐个写，后续失败时前面文件已存在，没有整批回滚；合并输出父目录也不像create那样统一确保。用户应指定新目录/另存路径，保留原文件，按本次产物清单处理失败副本；工具返回错误不会自动撤销已经发生的磁盘写入。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:25-28](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/index.ts#L25-L28)

只注入tools。

```text
export const name = 'dsh-office'

/** Requires the tool registry seam. */
export const inject = ['tools'] as const
```

**依据 2 · 源码核查**：[src/write.ts:1-15](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/write.ts#L1-L15)

建父目录而非路径沙箱。

<details>
<summary>查看原文（15行）</summary>

```text
// Shared write helpers for the office tools.

import { mkdirSync } from 'node:fs'
import { dirname } from 'node:path'

/**
 * Create the parent directory of `filePath` (and its ancestors) when missing.
 * Call before every tool-side file write so a destination inside a
 * not-yet-existing directory succeeds instead of failing with ENOENT.
 *
 * @param filePath Destination file path whose parent directory is ensured.
 */
export function ensureParentDir(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true })
}
```

</details>

**依据 3 · 源码核查**：[src/excel.ts:338-346](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L338-L346)

未给output_path则原位写。

```text
    applied.push(`applied styles to "${styleWs.name}"`)
  }

  const outPath = params?.output_path || filePath
  ensureParentDir(outPath)
  await workbook.xlsx.writeFile(outPath)

  return `Edited ${filePath}${outPath !== filePath ? ` → ${outPath}` : ''}\n${applied.map(a => `  - ${a}`).join('\n')}`
}
```

**依据 4 · 源码核查**：[src/ppt.ts:497-503](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/ppt.ts#L497-L503)

PPTX原位回写。

```text

  const outPath = params.output_path || filePath
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  ensureParentDir(outPath)
  writeFileSync(outPath, buf)
  const name = basename(filePath)
  return `📊 PPTX: Edited "${name}" — ${totalReplacements} replacement(s)\n${report.map(r => `   ${r}`).join('\n')}\n   File: ${outPath}`
```

**依据 5 · 源码核查**：[src/ppt.ts:589-612](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/ppt.ts#L589-L612)

PPT编辑标非并发安全。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'pptx_edit',
    description: 'Edit text inside an existing .pptx by find/replace on text runs (<a:t> nodes), preserving all other layout and styling. Each operation: {find, replace, slide?} — slide is 1-based, omit to edit all slides. Saves back to file_path unless output_path is given. Perfect for fixing typos or updating numbers in a generated deck.',
    parameters: {
      file_path: { type: 'string', required: true, description: 'Path to the existing .pptx file' },
      output_path: { type: 'string', description: 'Save to a different path instead of overwriting' },
      operations: {
        type: 'array', required: true,
        description: 'Ordered find/replace operations',
        items: {
          type: 'object',
          additionalProperties: false,
          properties: {
            find: { type: 'string', required: true, description: 'Text to find (plain text, not regex)' },
            replace: { type: 'string', description: 'Replacement text (empty string deletes the match)' },
            slide: { type: 'integer', description: '1-based slide number; omit to edit all slides' },
          },
        },
      },
    },
    output: textOutput,
    execute: async (args) => ({ content: await pptxEdit(args) }),
    isConcurrencySafe: () => false,
  }))
```

</details>

**依据 6 · 源码核查**：[src/pdf.ts:98-115](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L98-L115)

PDF create临时文件rename与错误拒绝。

<details>
<summary>查看原文（18行）</summary>

```text
  return new Promise<string[]>((resolve, reject) => {
    emitter.on('data', (chunk: Buffer) => buffers.push(Buffer.from(chunk)))
    emitter.on('end', () => {
      // 原子替换：同目录临时文件 + rename（跨文件系统会 EXDEV，故不用 os.tmpdir）
      // 这里的 throw 发生在 pdfkit 流事件栈内、Promise 链之外，宿主进程会直接
      // 崩溃，所以必须 catch 后转成 reject，交给工具层返回错误。
      try {
        ensureParentDir(filePath)
        const tmp = `${filePath}.${process.pid}.${Date.now()}.tmp`
        writeFileSync(tmp, Buffer.concat(buffers))
        renameSync(tmp, filePath)
        resolve(warnings)
      } catch (err) {
        reject(err)
      }
    })
    emitter.on('error', reject)
    const { title, content } = input
```

</details>

**依据 7 · 源码核查**：[src/pdf-ops.ts:52-95](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf-ops.ts#L52-L95)

merge直接写、split逐页写无批回滚。

<details>
<summary>查看原文（44行）</summary>

```text
  files: string[]
  output_path: string
}): Promise<string> {
  const files = params.files
  if (!Array.isArray(files) || files.length < 2) {
    throw new Error('pdf_merge requires at least 2 input files')
  }
  const out = await PDFDocument.create()
  let total = 0
  for (const f of files) {
    const src = await loadDoc(f)
    const pages = await out.copyPages(src, src.getPageIndices())
    for (const page of pages) out.addPage(page)
    total += pages.length
  }
  await writeFile(params.output_path, await out.save())
  return `📄 PDF: Merged ${files.length} file(s) → ${total} pages\n   File: ${params.output_path}`
}

async function pdfSplit(params: {
  file_path: string
  output_dir: string
  pages?: string // "1,3,5-7"; default: every page into its own file
}): Promise<string> {
  const src = await loadDoc(params.file_path)
  const total = src.getPageCount()
  const indices = params.pages ? parsePages(params.pages, total) : Array.from({ length: total }, (_, i) => i + 1)

  await mkdir(params.output_dir, { recursive: true })
  const stem = basename(params.file_path).replace(/\.pdf$/i, '')
  const written: string[] = []
  for (const pageNo of indices) {
    const out = await PDFDocument.create()
    const [page] = await out.copyPages(src, [pageNo - 1])
    if (!page) throw new Error(`failed to copy page ${pageNo}`)
    out.addPage(page)
    const dest = join(params.output_dir, `${stem}_p${String(pageNo).padStart(String(total).length, '0')}.pdf`)
    await writeFile(dest, await out.save())
    written.push(dest)
  }
  return [
    `📄 PDF: Split ${indices.length} page(s) from "${basename(params.file_path)}" (${total} pages)`,
    ...written.map(p => `   ${p}`),
  ].join('\n')
```

</details>

**依据 8 · 源码核查**：[src/pdf-ops.ts:98-121](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf-ops.ts#L98-L121)

页面操作标记并发安全，未按路径互斥。

<details>
<summary>查看原文（24行）</summary>

```text
export function registerPdfOpsTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'pdf_merge',
    description: 'Merge two or more PDF files into one, in the given order.',
    parameters: {
      files: { type: 'array', required: true, items: { type: 'string' }, description: 'Input PDF paths (at least 2), merged in order' },
      output_path: { type: 'string', required: true, description: 'Output .pdf file path' },
    },
    output: textOutput,
    execute: async (args) => ({ content: await pdfMerge(args) }),
    isConcurrencySafe: () => true,
  }))
  ctx.tools.register(defineTool({
    name: 'pdf_split',
    description: 'Split a PDF into single-page files, or extract specific pages (page spec like "1,3,5-7"; default: every page).',
    parameters: {
      file_path: { type: 'string', required: true, description: 'Input .pdf file path' },
      output_dir: { type: 'string', required: true, description: 'Directory to write page files into (created if missing)' },
      pages: { type: 'string', description: 'Page spec, e.g. "1,3,5-7" (1-based; default: all pages)' },
    },
    output: textOutput,
    execute: async (args) => ({ content: await pdfSplit(args) }),
    isConcurrencySafe: () => true,
  }))
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 一次合格文件任务的成本和可控试用方式是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

已有DSH且愿意检查成品的用户可在副本目录先试小型表格或短报告生成。明确数据、输出格式、目标应用和成功判据，另存后读回内容并用实际应用看页面；公式文件不能只看recalc success，尤其不能把它当已更新Excel缓存。关闭暂不用的family，以减少工具选择与维护范围。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 匹配宿主、依赖下载、本机磁盘与字体 | 安装/构建、选择family、创建副本 | 真实兼容与配置时间未验 |
| 持续使用 | 本机解析/压缩资源和宿主模型调用 | 检查文字、公式及页面，处理截断 | 无云端转换调用不等于总费用为零 |
| 失败恢复 | 已写副本与临时输出的磁盘 | 核原件/新件、清理部分拆分页 | 未统一回滚，不能重试覆盖唯一原件 |
| 退出 | 留存文件和可能的独立Skill副本 | 停用工具并清理发现目录Skill | 文件不因禁用自动撤销，Skill需单独管理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 交付文件 | 14工具真实注册并调用格式库 | 目标应用兼容和渲染合格率 |
| 公式辅助 | 有限求值与结构检查 | 完整Excel语义、业务正确与缓存更新 |
| 流程减负 | 减少临时脚本接线的可能 | 返工是否抵消省下的步骤 |

以一个经内容和视觉核对的实际文件作为单位，当前缺总调用费、资源、工时和合格数，不能估算ROI。发现中文缺字、公式结果不符、被截断内容或非预期覆盖，就停止自动交付，回到原文件和熟悉的Office应用人工处理。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:51-57](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/index.ts#L51-L57)

按family收窄注册。

```text
export function apply(ctx: Context, config: Config = {}): void {
  const enable = config.enable ?? {}
  if (enable.xlsx !== false) registerExcelTools(ctx)
  if (enable.pdf !== false) registerPdfTools(ctx)
  if (enable.ppt !== false) registerPptTools(ctx)
  if (enable.docx !== false) registerDocxTools(ctx)
}
```

**依据 2 · 源码核查**：[src/pdf.ts:60-73](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf.ts#L60-L73)

缺字体的warning。

<details>
<summary>查看原文（14行）</summary>

```text
async function generatePdf(filePath: string, input: PdfInput): Promise<string[]> {
  const warnings: string[] = []

  // CJK glyphs are absent from the built-in fonts — resolve a system font.
  const cjkNeeded = containsCjk(collectText(input))
  let cjkFont: ResolvedCjkFont | null = null
  if (cjkNeeded) {
    cjkFont = await resolveCjkFont()
    if (!cjkFont) {
      warnings.push('未找到 CJK 字体，中文可能无法渲染 (no CJK font found on this system; Chinese text may not render)')
    }
  }

  const doc = new PDFDocument({ size: 'A4', margin: 50, bufferPages: !!input.pageNumbers })
```

</details>

**依据 3 · 源码核查**：[src/excel.ts:350-387](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L350-L387)

检查结果不能替代文件重算。

<details>
<summary>查看原文（38行）</summary>

```text
async function xlsxRecalc(params: {
  file_path: string
  timeout?: number
}): Promise<string> {
  const filePath = params.file_path
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)

  const result = await recalcWorkbook(workbook, params.timeout ?? 30)
  const lines = [
    `status: ${result.status}`,
    `total_formulas: ${result.total_formulas}`,
    `total_errors: ${result.total_errors}`,
  ]
  const errors = Object.entries(result.error_summary)
  if (errors.length > 0) {
    lines.push('')
    lines.push('error_summary:')
    for (const [err, info] of errors) {
      lines.push(`  ${err}: ${info.count} hit(s)`)
      for (const loc of info.locations) {
        lines.push(`    ${loc}`)
      }
    }
  }
  for (const w of result.warnings) {
    lines.push(`warning: ${w}`)
  }
  if (result.status === 'errors_found') {
    lines.push('')
    lines.push('Fix the reported formula cells, then re-run xlsx_recalc until status is success before delivery.')
  }
  return lines.join('\n')
}
```

</details>

**依据 4 · 源码核查**：[src/pdf-ops.ts:74-95](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf-ops.ts#L74-L95)

部分页面可能已写入。

<details>
<summary>查看原文（22行）</summary>

```text
  pages?: string // "1,3,5-7"; default: every page into its own file
}): Promise<string> {
  const src = await loadDoc(params.file_path)
  const total = src.getPageCount()
  const indices = params.pages ? parsePages(params.pages, total) : Array.from({ length: total }, (_, i) => i + 1)

  await mkdir(params.output_dir, { recursive: true })
  const stem = basename(params.file_path).replace(/\.pdf$/i, '')
  const written: string[] = []
  for (const pageNo of indices) {
    const out = await PDFDocument.create()
    const [page] = await out.copyPages(src, [pageNo - 1])
    if (!page) throw new Error(`failed to copy page ${pageNo}`)
    out.addPage(page)
    const dest = join(params.output_dir, `${stem}_p${String(pageNo).padStart(String(total).length, '0')}.pdf`)
    await writeFile(dest, await out.save())
    written.push(dest)
  }
  return [
    `📄 PDF: Split ${indices.length} page(s) from "${basename(params.file_path)}" (${total} pages)`,
    ...written.map(p => `   ${p}`),
  ].join('\n')
```

</details>

**依据 5 · 源码核查**：[README.md:87-95](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/README.md#L87-L95)

独立Skill拷贝需分开管理。

````text
## Skill

The package ships a usage skill (`skills/SKILL.md`, anthropics-compatible
format) that teaches the model large-file pagination and generation
discipline. Install it into a skill discovery root:

```sh
mkdir -p ~/.dsh/skills && cp -r node_modules/@huiliyi37/dsh-office/skills/dsh-office ~/.dsh/skills/
```
````

#### 缺口

- 没有同任务费用、工时和成品合格数
  **影响**：无法判断工具整合在实际工作量下是否净节省
  **进一步探讨**：对小表、短报告与现有模板修改分别记录模型调用、人工校正时间和成品通过率。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 统一另存与可核对交付回执是否值得新增？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

待验证假设是围绕“成品是否合格”增加统一交付回执，比继续扩工具名更能改善采用。依据来自Q03检查不写回计算缓存、Q04文本读取不等视觉验证及Q05各写路径/原子性不一。候选流程先强制输出到新路径，再给源/目标摘要、实际写入文件列表、覆盖标记、检查范围和未完成项；多页拆分失败保留明确部分完成状态。公式求值回执只称有限检查，视觉回执只有真正渲染后才可给通过。

最小实验选择带公式、中文和长文字run的固定样本，对比当前工具文本和候选回执，让执行者指出哪些文件已写、哪些检查未完成、能否交付。观察错交付、非预期覆盖、人工核对时间和新增调用资源。若回执无法降低误判、仍把有限检查当整体正确或带来过多额外开销，就收窄到路径/文件清单，不推出自动放行。该假设未执行，不能记为现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/text-output.ts:16-25](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/text-output.ts#L16-L25)

当前输出统一为一个文本块，不是结构化文件事务回执。

<details>
<summary>查看原文（10行）</summary>

```text
export const textOutput: TextOutput = {
  schema: {
    type: 'object',
    additionalProperties: false,
    properties: {
      content: { type: 'string', required: true, description: 'Human-readable tool result.' },
    },
  },
  render: (_args, value) => [{ type: 'text', text: value.content }],
}
```

</details>

**依据 2 · 源码核查**：[src/excel.ts:350-387](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/excel.ts#L350-L387)

检查与文件写入分离。

<details>
<summary>查看原文（38行）</summary>

```text
async function xlsxRecalc(params: {
  file_path: string
  timeout?: number
}): Promise<string> {
  const filePath = params.file_path
  if (!existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`)
  }

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)

  const result = await recalcWorkbook(workbook, params.timeout ?? 30)
  const lines = [
    `status: ${result.status}`,
    `total_formulas: ${result.total_formulas}`,
    `total_errors: ${result.total_errors}`,
  ]
  const errors = Object.entries(result.error_summary)
  if (errors.length > 0) {
    lines.push('')
    lines.push('error_summary:')
    for (const [err, info] of errors) {
      lines.push(`  ${err}: ${info.count} hit(s)`)
      for (const loc of info.locations) {
        lines.push(`    ${loc}`)
      }
    }
  }
  for (const w of result.warnings) {
    lines.push(`warning: ${w}`)
  }
  if (result.status === 'errors_found') {
    lines.push('')
    lines.push('Fix the reported formula cells, then re-run xlsx_recalc until status is success before delivery.')
  }
  return lines.join('\n')
}
```

</details>

**依据 3 · 源码核查**：[src/pdf-ops.ts:74-95](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/pdf-ops.ts#L74-L95)

多文件部分写入点。

<details>
<summary>查看原文（22行）</summary>

```text
  pages?: string // "1,3,5-7"; default: every page into its own file
}): Promise<string> {
  const src = await loadDoc(params.file_path)
  const total = src.getPageCount()
  const indices = params.pages ? parsePages(params.pages, total) : Array.from({ length: total }, (_, i) => i + 1)

  await mkdir(params.output_dir, { recursive: true })
  const stem = basename(params.file_path).replace(/\.pdf$/i, '')
  const written: string[] = []
  for (const pageNo of indices) {
    const out = await PDFDocument.create()
    const [page] = await out.copyPages(src, [pageNo - 1])
    if (!page) throw new Error(`failed to copy page ${pageNo}`)
    out.addPage(page)
    const dest = join(params.output_dir, `${stem}_p${String(pageNo).padStart(String(total).length, '0')}.pdf`)
    await writeFile(dest, await out.save())
    written.push(dest)
  }
  return [
    `📄 PDF: Split ${indices.length} page(s) from "${basename(params.file_path)}" (${total} pages)`,
    ...written.map(p => `   ${p}`),
  ].join('\n')
```

</details>

**依据 4 · 源码核查**：[src/ppt.ts:497-503](https://github.com/omdsh-dev/dsh-office/blob/dfd99dbb6481bc0147c51dea71c25ec9b0ed5fd4/src/ppt.ts#L497-L503)

覆盖默认路径。

```text

  const outPath = params.output_path || filePath
  const buf = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' })
  ensureParentDir(outPath)
  writeFileSync(outPath, buf)
  const name = basename(filePath)
  return `📊 PPTX: Edited "${name}" — ${totalReplacements} replacement(s)\n${report.map(r => `   ${r}`).join('\n')}\n   File: ${outPath}`
```

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
