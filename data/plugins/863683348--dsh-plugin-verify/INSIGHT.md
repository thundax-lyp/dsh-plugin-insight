# dsh-plugin-verify

> 提供工作区关键词证据检索、配置检查及URL、npm和GitHub只读探测。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[5a70cbd](https://github.com/863683348/dsh-plugin-verify/tree/5a70cbdc230ee19bb4578e52440e18cc93153ee8)

<!-- BEGIN META -->
[![npm 30d 839](https://img.shields.io/static/v1?label=npm+30d&message=839&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-verify)
<!-- END META -->

**使用建议**：适合把它当检索和体检辅助。先看实际命中行与上下文，再给结论；不要依据verified或high自动放行，也不要把unsupported写成证伪。

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

- **用途**：Agent研究或插件提交前需要把主张定位到文件与外部元数据；合格交付应是证据与主张逻辑关系清楚，访问成功并不等于主张成立。

- **建议**：由行级证据与过强判定推导，可将verdict改为“检索覆盖”并附待验证关系，增加相反证据和数字条件核对，再由人或独立验证器形成结论。未验证假设是减少引用正确但结论错误。用相同关键词正反命题盲测，若误verified不降则否定。

适合把它当检索和体检辅助。先看实际命中行与上下文，再给结论；不要依据verified或high自动放行，也不要把unsupported写成证伪。

核查状态：已检查固定提交源码，未执行目标代码、安装或真实宿主验收。

源码核查支持所述实现机制；用户效果未实测，未来设计假设尚未验证。

rg与HTTP请求可完成底层工作；插件价值在聚合与行级输出，语义判断仍须另做。

<a id="detail-section-3"></a>

### 能力、流程与成本

- **模型工具**：verify聚合claim/config/url/npm/repo/batch只读检查。

**流程与依赖**

需要宿主文件读工具、HTTP访问及GitHub/npm可达性；结论依赖检索范围、关键词质量与人工解释，YAML复杂语法需真正解析器。

指定主张/配置/URL等范围，工具搜索或探测并给引用与结果，研究者检查原文、反例和范围，再形成有限结论。

**效果与成本**

无新增专属模型服务，但扫描文件、网络API与人工阅读引用有时间成本；GitHub限流会限制批量检查，未测总研究时间。

减少人工找行号与重复探测工作；收益依赖研究者继续判断，未提供事实准确率对照。

- **思考**：verified与high confidence标签是否过强？scoreClaim仅60%关键词命中即verified，batch的high可由至少两条命中触发；否定、主体归属与相反陈述都可能共享关键词。YAML又只是结构烟检。因此引用可追溯是支持，但不能从覆盖率推出事实正确性或置信概率。

<a id="detail-section-4"></a>

### 工程贡献

- **亮点**：相对模型无依据口述，增量是统一文件行号引用和常见只读探测，把原始线索带回研究过程。它实现的是证据发现与结构体检，不是语义事实验证引擎。

相对模型无依据口述，增量是统一文件行号引用和常见只读探测，把原始线索带回研究过程。它实现的是证据发现与结构体检，不是语义事实验证引擎。

纯探测逻辑、注入fetch和有界并发值得借鉴。主要复用成本是把标签与实际证据强度对齐，避免把关键词计数包装成校准置信度；网络可达性也应与业务正确性分层。 源码依据：[lib/verify.js](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/verify.js)、[lib/batch.js](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/batch.js)、[lib/index.js](https://github.com/863683348/dsh-plugin-verify/blob/5a70cbdc230ee19bb4578e52440e18cc93153ee8/lib/index.js)。

<a id="detail-section-5"></a>

### 主要限制

verified与high confidence标签是否过强？scoreClaim仅60%关键词命中即verified，batch的high可由至少两条命中触发；否定、主体归属与相反陈述都可能共享关键词。YAML又只是结构烟检。因此引用可追溯是支持，但不能从覆盖率推出事实正确性或置信概率。

<a id="detail-section-6"></a>

### 核查说明与分析版本

- **仓库**：[863683348/dsh-plugin-verify](https://github.com/863683348/dsh-plugin-verify)
- **版本号**：1.1.2（[固定提交 5a70cbdc](https://github.com/863683348/dsh-plugin-verify/tree/5a70cbdc230ee19bb4578e52440e18cc93153ee8)）
- **版本日期**：2026-09-11（固定提交日期，北京时间；不是包发布日期）

- 已检查：作者 README、包清单、源码路径 lib/verify.js、lib/batch.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交中所列入口和核心路径的人工抽读；未执行目标插件、测试或真实宿主，未核实独立采用与同条件收益。
- 下一步：以真假相反、主体替换与数字边界命题检验命中标签，复杂合法/非法YAML与正式解析器对照，记录误放行与复核工时。

<a id="detail-section-7"></a>

## 未来设计假设（未验证）

由行级证据与过强判定推导，可将verdict改为“检索覆盖”并附待验证关系，增加相反证据和数字条件核对，再由人或独立验证器形成结论。未验证假设是减少引用正确但结论错误。用相同关键词正反命题盲测，若误verified不降则否定。

以真假相反、主体替换与数字边界命题检验命中标签，复杂合法/非法YAML与正式解析器对照，记录误放行与复核工时。

<details>
<summary>工程统计</summary>

统计范围：git tracked files at exact commit; component scope only；组件：根；内容摘要：b0bf0c57fde02996f969647e373644b5738ffa7fdfe78f493fb06f7b13c47c86。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 157 | — | — | 1278 |
| .js | source | 3 | 688 | 548 | 111 | — |
| .mjs | source | 1 | 117 | 103 | 7 | — |
| .mjs | test | 2 | 215 | 199 | 11 | — |

排除 0 项，解析错误 0 项；默认排除规则是启发式，源文件与打包产物可能重复，不能从行数推算原创量或工时。Markdown 字数与代码行分别计量，未知不填0。

</details>

<a id="detail-section-8"></a>

## 辅助信息

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/863683348/dsh-plugin-verify/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
