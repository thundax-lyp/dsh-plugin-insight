# dsh-pr-description

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[7608cb9](https://github.com/988hj7tczd-oss/dsh-pr-description/tree/7608cb9b7b61447a3aff14491537ba7ee8caad6b)

<!-- BEGIN META -->
[![npm 30d 385](https://img.shields.io/static/v1?label=npm+30d&message=385&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-pr-description) [![最新发布 2026-08-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-24&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-pr-description)
<!-- END META -->

> **实现功能**：分析分支差异并生成PR标题和Markdown描述，可选确认及调用gh创建PR。

> **核心亮点**：作者主张PR描述自动生成；实际增量是将基线选择、差异统计、模板和可选gh动作连成DSH工具。相对手抄git diff可减少格式操作；README明确不调用LLM，确定模板不能理解业务动机，也不能凭文件变更证明测试通过。

> **风险与缺陷**：正则提取最多16个符号，不能完整理解多语言、重命名和语义破坏；自动base选择可能和实际目标分支不同。输出路径resolve(workdir,outputFile)后直接Node mkdir/writeFile，无本工具ctx.fs containment，应核调用者允许写范围。confirm可选且只预览标题与路径，openPr是实际外部动作，不能把仅生成草稿和创建PR混同。

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

> **用途**：适合已有分支提交、想快速整理可复核PR草稿的开发者；动机和测试事实仍需作者补齐。

替代是Git统计加PR模板或模型读diff；本项目提供确定工具流程，未实现语义撰写或代码评审。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：pr_describe分支差异草稿、可选确认与创建PR

**流程与依赖**

pr-describe.ts以宿主subprocess固定argv读取Git事实，diff-analysis.ts轻量解析文件/符号与breaking信号，templates填五段文本；可选userQuestions确认，随后Node fs写文件，openPr调用gh。

宿主tools/subprocess、Git、模板与Schemastery；confirm需userQuestions，openPr需gh及认证。README开发环境要求相邻dsh-src，实际包依赖另以固定package为准。

选base→读取已提交分支diff→统计/符号/规则分类→模板草稿→可选确认→落盘→可选gh pr create；取消时不落盘，不自动push。

**效果与成本**

首次确认Git基线、工作区、输出路径及gh认证；计算无模型额外调用但后续人工润色仍需时间。创建PR需要外部权限，文案错误会增加评审成本，无净工时数据。

可省统计与排版，未有PR审阅质量或编辑时间的独立对照。

> **思考**：正则提取最多16个符号，不能完整理解多语言、重命名和语义破坏；自动base选择可能和实际目标分支不同。输出路径resolve(workdir,outputFile)后直接Node mkdir/writeFile，无本工具ctx.fs containment，应核调用者允许写范围。confirm可选且只预览标题与路径，openPr是实际外部动作，不能把仅生成草稿和创建PR混同。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：作者主张PR描述自动生成；实际增量是将基线选择、差异统计、模板和可选gh动作连成DSH工具。相对手抄git diff可减少格式操作；README明确不调用LLM，确定模板不能理解业务动机，也不能凭文件变更证明测试通过。

作者主张PR描述自动生成；实际增量是将基线选择、差异统计、模板和可选gh动作连成DSH工具。相对手抄git diff可减少格式操作；README明确不调用LLM，确定模板不能理解业务动机，也不能凭文件变更证明测试通过。

Git命令走固定argv、禁用部分副作用环境、输出有界且对lossy有处理，分层解析易审阅；写文件却走Node fs，与受控命令边界不同，复用时应统一权限。

源码依据：[src/tools/pr-describe.ts](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/tools/pr-describe.ts)、[src/diff-analysis.ts](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/diff-analysis.ts)、[src/gh.ts](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/src/gh.ts)、[README.md](https://github.com/988hj7tczd-oss/dsh-pr-description/blob/7608cb9b7b61447a3aff14491537ba7ee8caad6b/README.md)。

<a id="detail-section-5"></a>

### 1.4 主要限制

正则提取最多16个符号，不能完整理解多语言、重命名和语义破坏；自动base选择可能和实际目标分支不同。输出路径resolve(workdir,outputFile)后直接Node mkdir/writeFile，无本工具ctx.fs containment，应核调用者允许写范围。confirm可选且只预览标题与路径，openPr是实际外部动作，不能把仅生成草稿和创建PR混同。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合先生成本地草稿。明确base和输出路径，逐段核业务动机、breaking与已跑测试；只有确实要创建PR时才用openPr。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。贡献仅获固定版本源码支持，外部语言服务或技能流程的实际运行尚未验证；未来假设未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[988hj7tczd-oss/dsh-pr-description](https://github.com/988hj7tczd-oss/dsh-pr-description)
- **版本号**：0.1.1（[固定提交 7608cb9b](https://github.com/988hj7tczd-oss/dsh-pr-description/tree/7608cb9b7b61447a3aff14491537ba7ee8caad6b)）
- **版本日期**：2026-08-24（固定提交日期，北京时间；不是包发布日期）

- 已检查：src/tools/pr-describe.ts、src/diff-analysis.ts、src/gh.ts、README.md、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定SHA内本组件列明文件及配置/作者资料的有界源码检查；组件inventory不包含外部官方底座原创量。未安装或执行目标代码、测试、语言服务、外部发布或真实宿主验收。
- 下一步：核错误base、rename/二进制、大diff、取消、越界输出和gh失败，逐段比对事实；本轮不写目标PR或调用gh。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

未验证假设：将每段描述绑定diff证据并把未知动机/未执行测试保留空项，可降低模板看似完整却陈述失真的情况。用仅重命名、多语言与未跑测试分支比较事实错误和人工改写时间；语义润色不得补造测试结果。

核错误base、rename/二进制、大diff、取消、越界输出和gh失败，逐段比对事实；本轮不写目标PR或调用gh。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7dec6e03bfa76edaff0509ae40857953fc02a570f8de54717f0a4455aaf3584f。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 262 | — | — | 3250 |
| .mjs | source | 1 | 44 | 29 | 12 | — |
| .ts | source | 6 | 1325 | 1029 | 203 | — |
| .ts | test | 1 | 260 | 206 | 26 | — |
| .mjs | test | 1 | 468 | 387 | 36 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/988hj7tczd-oss/dsh-pr-description/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
