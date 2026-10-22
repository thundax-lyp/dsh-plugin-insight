# dsh-skill-7d-code-reviewer

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[bd0069f](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/tree/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057)

<!-- BEGIN META -->
[![GitHub ★ 11](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=11&color=yellow&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)
<!-- END META -->

> **实现功能**：为DSH提供模板驱动的代码审查Skill，输出分级问题、文本摘要和HTML报告。

> **核心亮点**：相对每次手写审查提示，增量是将检查表、严重性语言、报告模板与宿主资源定位打包为可分发流程。核心贡献是审查知识和报告组织，不是静态分析器，也没有证据证明模板能提高漏洞检出率。

> **风险与缺陷**：结构一致能否转化为有效审查？入口仅分发Markdown，HTML生成说明要求模型自行转义和填占位符，README明确没有结果验证器。模型可能输出漂亮但错误的问题或未转义片段，启动invariant只保证Skill存在，并不检查审查结论。

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

> **用途**：需要一致格式代码审查记录的开发团队，输入代码或文件路径，期望交付可定位且经人工复核的问题清单与可归档报告。

普通审查提示与静态扫描可直接使用；本插件提供可重用模板与组织一致性，未比较同模型下检出质量。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：注册7d-code-reviewer，提供五步审查、参考检查表和HTML报告模板。

**流程与依赖**

必要为ctx.skills、模型阅读与文件访问能力；HTML输出依赖模型遵循模板规则，语言/业务知识取决于参考资料。

用户提交范围，模型识别业务与改动，加载检查表逐行审查，分级并填报告，人工验证问题后采用；没有自动门禁或修复事务。

**效果与成本**

首次维护团队审查规范和模板；日常模型token、逐条复核与误报修正是成本，报告篇幅也增加阅读负担。无现金与检出率对照。

可能降低重复组织报告时间，但不能替代测试、安全扫描或人工放行。未核实独立团队采用。

> **思考**：结构一致能否转化为有效审查？入口仅分发Markdown，HTML生成说明要求模型自行转义和填占位符，README明确没有结果验证器。模型可能输出漂亮但错误的问题或未转义片段，启动invariant只保证Skill存在，并不检查审查结论。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对每次手写审查提示，增量是将检查表、严重性语言、报告模板与宿主资源定位打包为可分发流程。核心贡献是审查知识和报告组织，不是静态分析器，也没有证据证明模板能提高漏洞检出率。

相对每次手写审查提示，增量是将检查表、严重性语言、报告模板与宿主资源定位打包为可分发流程。核心贡献是审查知识和报告组织，不是静态分析器，也没有证据证明模板能提高漏洞检出率。

Provider职责单纯、资源路径明确、参考资料按需加载值得借鉴。可执行代码很薄，主要维护成本在规范适配和模型执行一致性；复用模板应增加确定性转义与校验，不能把启动注册测试当审查效果测试。 源码依据：[src/index.ts](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/src/index.ts)、[src/invariant.ts](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/src/invariant.ts)、[assets/7d-code-reviewer/SKILL.md](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/SKILL.md)、[assets/7d-code-reviewer/scripts/html-report-generation.md](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/blob/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057/assets/7d-code-reviewer/scripts/html-report-generation.md)。

<a id="detail-section-5"></a>

### 1.4 主要限制

结构一致能否转化为有效审查？入口仅分发Markdown，HTML生成说明要求模型自行转义和填占位符，README明确没有结果验证器。模型可能输出漂亮但错误的问题或未转义片段，启动invariant只保证Skill存在，并不检查审查结论。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合已有人工审查负责人、希望统一报告格式的团队先用已知缺陷样例试用。每个严重问题核对路径、条件与反例，HTML对外分享前检查转义和残留占位符。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[7dgroup-ai/dsh-skill-7d-code-reviewer](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer)
- **版本号**：0.1.0（[固定提交 bd0069f4](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/tree/bd0069f4feabbcb6ede8b0ba2da6a59f4d477057)）
- **版本日期**：2026-10-02（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/invariant.ts、assets/7d-code-reviewer/SKILL.md、assets/7d-code-reviewer/scripts/html-report-generation.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：相同模型审查带已知缺陷和干净对照的代码，统计可复现问题、误报、人工复核时间及HTML转义/占位符完整性。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由模板与语义检查分离推导，可先要求模型生成有路径、行号、可复现条件的结构化finding，再用确定性渲染器生成HTML；每条严重问题附最小反例。未验证假设是降低虚报与格式错误，而非仅美化。对已知缺陷/无缺陷代码盲评，若误报率与证据可复现性不改善则否定。

相同模型审查带已知缺陷和干净对照的代码，统计可复现问题、误报、人工复核时间及HTML转义/占位符完整性。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：fb7af17cae7f29bcee62237fb232f6eb0f085d2d98d6e2f067c699ef39c59e8a。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1810 | — | — | 12210 |
| .ts | source | 3 | 111 | 66 | 33 | — |
| .ts | test | 1 | 46 | 42 | 0 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+created%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/7dgroup-ai/dsh-skill-7d-code-reviewer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A12%3A30.672Z..2026-10-22T05%3A12%3A30.672Z)



统计日期：2026-10-22。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
