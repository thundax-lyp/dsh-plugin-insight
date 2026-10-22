# logicprobe

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[a264c40](https://github.com/AmethystLuna/logicprobe/tree/a264c4018b02d24e2b2103c772ca431e21c16e65)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe) [![npm 30d 2,967](https://img.shields.io/static/v1?label=npm+30d&message=2%2C967&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-logicprobe) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-logicprobe)
<!-- END META -->

> **实现功能**：以工具和技能检查设计声称、状态机、数据模型与依赖图，生成可比较的结构化核验报告。

> **核心亮点**：把事实核查、可执行抽象模型、结构图和回归差异组织成统一审查流程；相对仅LLM口头评审有确定性检查与机器定位。外部UPPAAL/TLA+/PRISM/SPIN仍是独立验证器，导出不等于已运行。

> **风险与缺陷**：模型通过能否证明代码设计正确？提取模型可能遗漏真实并发、I/O或调度，有限搜索截断及不完整narrative要单列；concurrency scan只路由不证明。最强支持是确定性引擎，关键缺口是源码到模型保真度而非工具数量。

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

> **用途**：开发者希望在实现前找出状态/协议/迁移设计错误，合格交付是有来源且覆盖充分的模型和可定位反例。

人工评审灵活但不可重复；通用模型检查器更成熟却建模成本高，此工具补Agent友好接线与报告。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **Skill**：声称、状态机、并发、图及数据模型核查技能。
- **模型工具**：模型验证、组合、导出、UML/依赖审查与报告差异。
- **事件监听**：首步核查路由提示。

**流程与依赖**

DSH tools/skills、Node引擎，非DSH路径有Python实现；外部导出验证器与模型提取证据另需准备。

列声称→查事实/建模型→结构与对抗检查→读verdict/反例/覆盖→修正设计→基线差异；行为结论回到源码/测试复核。

**效果与成本**

首次建模与领域专家复核是主要人工成本；状态空间、图转换和回归维护持续花费，工具运行本身不代表减少总审查成本。

有助将模糊设计问题变成可重复报告，真实缺陷发现率与建模负担未测。

> **思考**：模型通过能否证明代码设计正确？提取模型可能遗漏真实并发、I/O或调度，有限搜索截断及不完整narrative要单列；concurrency scan只路由不证明。最强支持是确定性引擎，关键缺口是源码到模型保真度而非工具数量。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把事实核查、可执行抽象模型、结构图和回归差异组织成统一审查流程；相对仅LLM口头评审有确定性检查与机器定位。外部UPPAAL/TLA+/PRISM/SPIN仍是独立验证器，导出不等于已运行。

把事实核查、可执行抽象模型、结构图和回归差异组织成统一审查流程；相对仅LLM口头评审有确定性检查与机器定位。外部UPPAAL/TLA+/PRISM/SPIN仍是独立验证器，导出不等于已运行。

闭合schema、注记不入语义hash、绝对与增量结论分离以及截断提示值得借鉴；报告消费者须按schema读取并保留覆盖限制。 源码依据：[src/index.ts](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/index.ts)、[src/engine.ts](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/engine.ts)、[src/structure.ts](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/structure.ts)、[src/report-view.ts](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/src/report-view.ts)、[tools/python/logicprobe-engine.py](https://github.com/AmethystLuna/logicprobe/blob/a264c4018b02d24e2b2103c772ca431e21c16e65/tools/python/logicprobe-engine.py)。

<a id="detail-section-5"></a>

### 1.4 主要限制

模型通过能否证明代码设计正确？提取模型可能遗漏真实并发、I/O或调度，有限搜索截断及不完整narrative要单列；concurrency scan只路由不证明。最强支持是确定性引擎，关键缺口是源码到模型保真度而非工具数量。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合有明确状态/迁移模型的设计审查，先用已知缺陷验证反例与覆盖；读verdict并检查truncated，不能将pass写成源码已证正确。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[AmethystLuna/logicprobe](https://github.com/AmethystLuna/logicprobe)
- **版本号**：1.4.1（[固定提交 a264c401](https://github.com/AmethystLuna/logicprobe/tree/a264c4018b02d24e2b2103c772ca431e21c16e65)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/engine.ts、src/structure.ts、src/report-view.ts、tools/python/logicprobe-engine.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读src/index.ts、src/engine.ts、src/structure.ts、src/report-view.ts、tools/python/logicprobe-engine.py；未覆盖全部协议/界面与操作系统分支，未执行安装、目标测试或真实宿主；独立采用与同条件收益未核实。
- 下一步：用死锁/遗漏分支/截断/不忠实UML例子核对报告和roundtrip；比较人工基线的发现数、误报和建模时间，不运行目标本轮工具。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由hash/coverage/差异报告推导，可将源码断言和模型边映射到可复核证据，遇源码变化自动标过期，抽样与执行轨迹对账。未验证；植入源码独有分支后模型仍pass但映射应报警，否则无法弥合抽象缺口。

用死锁/遗漏分支/截断/不忠实UML例子核对报告和roundtrip；比较人工基线的发现数、误报和建模时间，不运行目标本轮工具。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：a2e81222ef9fec9770469b19ae44fdeba5a04125e58b69bbb57a413330a5a338。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 5030 | — | — | 53321 |
| .md | example | 1 | 46 | — | — | 276 |
| .js | source | 21 | 9547 | 8510 | 1004 | — |
| .mjs | source | 2 | 213 | 168 | 28 | — |
| .ts | source | 19 | 9635 | 8005 | 1128 | — |
| .mjs | test | 17 | 6168 | 5181 | 492 | — |
| .md | test | 1 | 38 | — | — | 472 |

排除 19 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+created%3A2026-09-21T08%3A02%3A07.380Z..2026-10-21T08%3A02%3A07.380Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AmethystLuna/logicprobe/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T08%3A02%3A07.380Z..2026-10-21T08%3A02%3A07.380Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
