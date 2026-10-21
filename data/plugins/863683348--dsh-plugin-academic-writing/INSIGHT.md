# dsh-plugin-academic-writing

> 提供论文结构、标题、摘要、引文格式和措辞检查等确定性写作辅助。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[cbeb4db](https://github.com/863683348/dsh-plugin-academic-writing/tree/cbeb4db61d11cc327092f5e7f56d333693e52bde)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=yellow&logo=github&style=flat)](https://github.com/863683348/dsh-plugin-academic-writing) [![npm 30d 1,803](https://img.shields.io/static/v1?label=npm+30d&message=1%2C803&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-academic-writing)
<!-- END META -->

**使用建议**：适合用来起草骨架和初筛格式。引文逐条核源，措辞提示结合目标期刊判断，LaTeX片段在实际文档编译后再交付。

**核查状态**：已检查源码，未进行真实宿主验证。

**本文目录**

- [当前插件分析](#detail-section-1)
  - [场景与替代办法](#detail-section-2)
  - [能力、依赖与流程](#detail-section-3)
  - [成本与效果](#detail-section-4)
  - [工程亮点](#detail-section-5)
  - [使用判断](#detail-section-6)
  - [能力、流程与成本](#detail-section-7)
  - [工程贡献](#detail-section-8)
  - [核查说明与分析版本](#detail-section-9)
- [未来设计假设（未验证）](#detail-section-10)
- [辅助信息](#detail-section-11)

<a id="detail-section-1"></a>

## 当前插件分析

<a id="detail-section-2"></a>

### 场景与替代办法

替代是编辑器模板、文献管理器和人工style guide；项目把常用操作放进DSH，专业覆盖不等同成熟文献工具。

<a id="detail-section-3"></a>

### 能力、依赖与流程

lib/index.js注册academic_writing并分派action到academic.js；后者以模板生成大纲/标题/摘要，以字段拼接引文、正则检查语言并输出LaTeX片段及结构报告。

- **模型工具**：academic_writing论文骨架、引文、措辞、结构和LaTeX辅助

宿主tools/systemPrompt、Schemastery；正文依赖模型，书目信息由调用者提供，LaTeX环境和样式包另行准备。

提供主题或书目字段→选action→确定模板/检查→模型组织稿件→人工核源、核样式和编译；插件不检索论文。

<a id="detail-section-4"></a>

### 成本与效果

首次将文献与稿件转换为工具字段；无本模块网络成本，宿主模型token另计。持续人工核引用、姓名、期刊规范与LaTeX编译，生成骨架不是合格论文。

可减少重复排版与清单遗漏，无论文质量、编辑工时或发表成功的独立证据。

<a id="detail-section-5"></a>

### 工程亮点

academic.js纯函数与薄宿主壳方便审阅，结构输出可用于后续文档流程；正则计数和有限转义说明需要针对输入边界验证，不能只因确定性就称正确。

源码依据：[lib/index.js](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/index.js)、[lib/academic.js](https://github.com/863683348/dsh-plugin-academic-writing/blob/cbeb4db61d11cc327092f5e7f56d333693e52bde/lib/academic.js)。

<a id="detail-section-6"></a>

### 使用判断

- **用途**：适合研究者快速准备稿件骨架和检查明显格式问题；研究事实与论证仍需作者确认。

- **建议**：待验证假设：把格式规则与目标期刊配置及真实引用元数据对齐，可降低一刀切文风误报。用已人工校对的多语引文和不同期刊段落比较格式错误、误报及编辑时间；若规则不能跨语适用，应明确支持子集。

适合用来起草骨架和初筛格式。引文逐条核源，措辞提示结合目标期刊判断，LaTeX片段在实际文档编译后再交付。

**核查状态**：已检查固定版本源码，未安装或执行目标插件、未完成真实宿主验收。已有贡献由固定版本源码支持，实际运行与宿主效果未验证；未来设计假设均未验证。

<a id="detail-section-7"></a>

### 能力、流程与成本

- **模型工具**：academic_writing论文骨架、引文、措辞、结构和LaTeX辅助

- **思考**：formatCitation按提供字段拼接，不能验证文献存在，也未覆盖不同姓名文化与所有样式细节。academicCheck的PASSIVE/FIRST_PERSON/HEDGING非全局正则，因此match计数最多1，与出现次数不同；把谨慎措辞或第一人称标出也不表示文风错误。LaTeX转义仅覆盖部分字符，不能承诺片段任意输入可编译。

<a id="detail-section-8"></a>

### 工程贡献

- **亮点**：作者明确模型负责行文、插件负责结构；可确认增量是将常见论文模板和格式操作封成可重复工具，减少模型临时编造格式。相对纯提示生成，更可预测；这不是自动研究、引用真实性验证或投稿规范完整实现。

<a id="detail-section-9"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-academic-writing](https://github.com/863683348/dsh-plugin-academic-writing)
- **版本号**：0.3.2（[固定提交 cbeb4db6](https://github.com/863683348/dsh-plugin-academic-writing/tree/cbeb4db61d11cc327092f5e7f56d333693e52bde)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：lib/index.js、lib/academic.js、作者README、package与固定范围inventory；源码抽读不等于完整审计。
- 未验证：插件执行、测试、安装、真实宿主与独立采用。
- 证据限制：固定提交内列明源码和作者材料的有界抽读，静态inventory为组件范围；没有安装、执行目标代码或测试、发起插件服务请求、真实宿主验收或独立采用核实。
- 下一步：用多次被动句、谨慎词、中外姓名、缺失字段和特殊LaTeX字符核对结果，与人工样式样本对照；本轮未执行。

<a id="detail-section-10"></a>

## 未来设计假设（未验证）

待验证假设：把格式规则与目标期刊配置及真实引用元数据对齐，可降低一刀切文风误报。用已人工校对的多语引文和不同期刊段落比较格式错误、误报及编辑时间；若规则不能跨语适用，应明确支持子集。

用多次被动句、谨慎词、中外姓名、缺失字段和特殊LaTeX字符核对结果，与人工样式样本对照；本轮未执行。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：7af0f9d70efac79a4f256985eda604fa2affcb5bffcd15b1447cab0899d763e6。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 548 | 484 | 40 | — |
| .md | source | 4 | 158 | — | — | 1476 |
| .mjs | test | 1 | 193 | 170 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-11"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-academic-writing/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
