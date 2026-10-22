# dsh-capability-index

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[c180313](https://github.com/777-Zen/dsh-capability-index/tree/c1803133660c6bc30dbc2d3eda493724b801aad0)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=yellow&logo=github&style=flat)](https://github.com/777-Zen/dsh-capability-index)
<!-- END META -->

> **实现功能**：扫描已启用工具，结合规则与语义召回向Agent上下文提示可能适用的插件能力。

> **核心亮点**：相对将所有工具说明直接塞进上下文，增量是以任务触发、语义召回和负向声明分层压缩候选，同时把纯排序逻辑与宿主适配分开。使用的向量模型与检索原理是上游能力，插件贡献在能力发现的流程组合。

> **风险与缺陷**：提升插件利用率是否提升任务质量？README作者主动承认仅16条评估不足以证明价值并已归档；源码中词表、Top-K池及模型降级表明召回受工具描述和声明质量约束。错误提示也可能增加调用或挤占上下文，不能从命中率推出净收益。

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

> **用途**：工具库较大的DSH会话需要减少遗漏可用工具；合格交付应是正确工具被使用且任务更可靠，不能只用提示命中率代替任务成功。

直接使用宿主工具描述与人工提示最简单；此插件额外提供筛选和显式负向条件，但新增检索错误来源。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **事件监听**：根据会话输入生成runtime-context能力提示。

**流程与依赖**

必要为宿主工具schema与runtime-context；语义层需transformers和模型权重，失败时回退规则；效果依赖任务语言、描述质量和负向声明。

会话输入触发规则判定，构造/复用工具索引，语义候选经not_for过滤后注入提示；模型决定是否调用，最后仍由用户验收任务。

**效果与成本**

首次需要工具能力声明与向量依赖/权重缓存；日常有编码与提示token成本，描述变化需重建索引。无同任务现金或工时对照。

可能降低模型忽略已装工具的概率，但其关键业务收益仍缺独立任务证据，归档不能证明该方向无需求。

> **思考**：提升插件利用率是否提升任务质量？README作者主动承认仅16条评估不足以证明价值并已归档；源码中词表、Top-K池及模型降级表明召回受工具描述和声明质量约束。错误提示也可能增加调用或挤占上下文，不能从命中率推出净收益。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对将所有工具说明直接塞进上下文，增量是以任务触发、语义召回和负向声明分层压缩候选，同时把纯排序逻辑与宿主适配分开。使用的向量模型与检索原理是上游能力，插件贡献在能力发现的流程组合。

相对将所有工具说明直接塞进上下文，增量是以任务触发、语义召回和负向声明分层压缩候选，同时把纯排序逻辑与宿主适配分开。使用的向量模型与检索原理是上游能力，插件贡献在能力发现的流程组合。

core纯数据函数与adapter分离、动态import失败降级、工具向量缓存值得借鉴。移植需要维护能力声明、缓存失效及宿主上下文通道；不能将样例能力声明数当可用插件总数。 源码依据：[lib/core.js](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/core.js)、[lib/embed.js](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/embed.js)、[lib/dsh-adapter.js](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/lib/dsh-adapter.js)、[eval-results/samples.json](https://github.com/777-Zen/dsh-capability-index/blob/c1803133660c6bc30dbc2d3eda493724b801aad0/eval-results/samples.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

提升插件利用率是否提升任务质量？README作者主动承认仅16条评估不足以证明价值并已归档；源码中词表、Top-K池及模型降级表明召回受工具描述和声明质量约束。错误提示也可能增加调用或挤占上下文，不能从命中率推出净收益。

<a id="detail-section-6"></a>

### 1.5 使用建议

更适合作为工具发现设计样本阅读。项目已归档，生产采用前需自行承担宿主适配和评估；先用本地脱敏任务验证误触发成本，不按16条作者样本认定有效。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- **仓库**：[777-Zen/dsh-capability-index](https://github.com/777-Zen/dsh-capability-index)
- **版本号**：0.2.0（[固定提交 c1803133](https://github.com/777-Zen/dsh-capability-index/tree/c1803133660c6bc30dbc2d3eda493724b801aad0)）
- **版本日期**：2026-09-04（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/core.js、lib/embed.js、lib/dsh-adapter.js、eval-results/samples.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：固定模型、工具库与token预算，对留出任务比较无提示、规则提示、语义+负向提示的交付率、错误调用与人工复核时间。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

由not_for负向声明和不强制调用推导，可增加“本任务不调用”的解释性拒绝记录与按任务结果校准阈值，而不是只追求召回。未验证假设：将误触发成本纳入阈值后可在固定token预算下提高合格交付率。用未参与调参的新任务与无提示基线盲评；若质量未升或复核负担更高则否定。

固定模型、工具库与token预算，对留出任务比较无提示、规则提示、语义+负向提示的交付率、错误调用与人工复核时间。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：055c2dd25d4c8d3cdca7d482db2324da8d8bf29c4d4689a607baac9e1df8607e。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 158 | — | — | 1812 |
| .mjs | source | 5 | 1507 | 1277 | 173 | — |
| .js | example | 1 | 274 | 235 | 26 | — |
| .md | example | 1 | 39 | — | — | 388 |
| .js | source | 7 | 1656 | 1066 | 506 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-9"></a>

## 3 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/777-Zen/dsh-capability-index/issues) 查看。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
