# VeriScope 门禁重放

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[5299b64](https://github.com/4444wjt/dsh-plugin-veriscope/tree/5299b64087bbfa5beef6ae2e336045468f1af01d)

<!-- BEGIN META -->
[![npm 30d 956](https://img.shields.io/static/v1?label=npm+30d&message=956&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-plugin-veriscope)
<!-- END META -->

> **实现功能**：对已有逐条评分执行三态阈值判定，保存并复验绑定输入与策略的回执。

> **核心亮点**：相对只看均值或旧报告，贡献是把缺证据作为REVIEW、已知FAIL不被留痕异常掩盖，以及让回执有效性依赖输入/策略/环境绑定。V2把最差行诊断与显式逐行门槛分开，避免把“展示最差行”偷换成拒绝规则。

> **风险与缺陷**：核心质疑是PASS究竟约束到哪里。源码支持当前回执的完整性与阈值裁决，不证明原始评分准确或输入未提前删行；builtin B2明确不支持bind/complete，原replay的managed complete只写自有完成文件，没有拦截外部发布副作用。不能据“门禁”名称声称所有发布被强制保护。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
  - [1.6 跨插件比较：验收与最终写入](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有RAG或模型逐条评分的评测维护者，判断给定策略下能否放行并保存复验材料；合格交付是范围明确、当前有效的回执，评分真值和实际发布由其他系统负责。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照简单阈值脚本、静态评测报告和上游VeriScope Python；本组件新增回执/状态/宿主桥接，原评分与上游裁决分别归属。

Node builtin接受显式GateArchive/Ragas records和策略，三态判定不补零不跳缺失；V2从原始JSON数值词元做精确十进制均值/逐行比较。receipt绑定输入/策略/插件/环境，status重新核摘要；原replay路径另调用固定上游Python。


Node>=22.19，B2需显式持久VERISCOPE_STATE_DIR；原replay还需固定上游与Python/pandas。DSH工具SDK固定0.2.1-alpha.2，MCP/CLI不加载该SDK；无自动评分和模型API调用。

准备逐条结果和显式策略→check/replay→保存来源/日志/report/receipt→status核当前有效性→人工或外部系统判断下一步。原replay可bind并在complete时两次校验后写完成记录；B2拒绝该路径，MCP不提供原生受管完成。

首次需整理评分导出与策略、配置状态备份；持续保存回执（不自动清理）和处理REVIEW，可能需要Python环境维护。无需新增评测模型调用，但上游评分成本不消失。

降低旧结论在输入/环境变化后被误用的风险，适合审计链；不能替代数据质量、样本覆盖和实际回答事实验证。

**能力**

- **模型工具**：check/replay/status/list等门禁工具；B2与原replay能力边界不同。

> **思考**：核心质疑是PASS究竟约束到哪里。源码支持当前回执的完整性与阈值裁决，不证明原始评分准确或输入未提前删行；builtin B2明确不支持bind/complete，原replay的managed complete只写自有完成文件，没有拦截外部发布副作用。不能据“门禁”名称声称所有发布被强制保护。

<a id="detail-section-4"></a>

### 1.3 工程贡献

判定、回执、状态与managed模块分开，V2保留原始十进制词元和FAIL优先故障语义可借鉴；实现scope反复核验能缩小竞态窗口，不能替代外部事务。状态目录和hash绑定升级需迁移/重跑。

dsh-plugin-veriscope 0.6.0；作者提供跨宿主验收材料，本轮未重放，不把作者CI/宿主记录当本次实测。DSH兼容固定alpha SDK需先确认。

固定源码依据：[lib/managed.js L59–74](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L59-L74)；[lib/builtin.js L12–17](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin.js#L12-L17)；[lib/builtin-rules.js L16–35](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/builtin-rules.js#L16-L35)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：相对只看均值或旧报告，贡献是把缺证据作为REVIEW、已知FAIL不被留痕异常掩盖，以及让回执有效性依赖输入/策略/环境绑定。V2把最差行诊断与显式逐行门槛分开，避免把“展示最差行”偷换成拒绝规则。

<a id="detail-section-5"></a>

### 1.4 使用建议

已有评测结果且需要可追溯裁决的团队可先用构造样本核验策略；把PASS解释为当前输入满足该阈值，真正发布仍由接入方执行器负责。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[4444wjt/dsh-plugin-veriscope](https://github.com/4444wjt/dsh-plugin-veriscope)；固定提交：[5299b640](https://github.com/4444wjt/dsh-plugin-veriscope/tree/5299b64087bbfa5beef6ae2e336045468f1af01d)；版本号：0.6.0；版本日期：2026-10-18（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查builtin、规则、回执、状态与managed路径；未运行Python/Node门禁、外部宿主或作者CI，评分来源质量不在门禁保证内。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

### 1.6 跨插件比较：验收与最终写入

在“生成网页后决定是否提交或发布”的共同流程中，task-monitor汇总活动并提供Git写入口；dsh-verify执行给定浏览器断言；VeriScope复验评分回执并约束自有完成记录。三者分别改变可见性、可重复检查和裁决追溯，当前源码未将三种状态与最终Git/GitHub副作用绑定成同一事务，因此不能以面板活动、断言PASS或完成文件任一项替代最终放行。没有进行组合安装或同条件效果实验。

共同任务的合格交付应同时满足：需求覆盖的检查已通过、被检查产物就是将发布产物、最终写入结果可回读。简单对照是人工核对差异、执行现成浏览器清单，再手工提交；组合方案增加回执保管、版本匹配和写入恢复成本。

依据：[活动与写入入口](https://github.com/3450892121/dsh-task-monitor/blob/e628e3ea76cf0f7f0a3489b93c9f00271daeb791/dsh-task-monitor/index.js#L1053-L1103)、[给定浏览器断言](https://github.com/263311487-ux/dsh-verify/blob/d969899808e51dcccd261588f667b18633020fca/bin/verify.mjs#L225-L262)、[完成记录边界](https://github.com/4444wjt/dsh-plugin-veriscope/blob/5299b64087bbfa5beef6ae2e336045468f1af01d/lib/managed.js#L59-L74)。比较依赖已在结构化finding中绑定三个稳定ID和各自code指纹。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

待验证假设：外部发布适配器消费一次性、绑定最终产物哈希的当前PASS回执，并在执行前再次校验，可能把记录式门禁扩展到实际放行。推导自现有scope复验和managed二次核查，但需要明确令牌消费、变更竞态和未知发布结果责任；尚未实现。

最小验证与否定条件：构造完整通过、缺值、均值通过但单行失败、输入中途变更和日志落盘失败五类样本；对照简单均值脚本，要求REVIEW不转PASS、已知FAIL不被覆盖、策略变更使旧回执失效。另证明B2不能managed complete；外部真实发布须另接执行器验收，不能只看completion文件。

组合验证（未执行）：对照人工流程和拟议回执适配器，分别注入首次截图基线、检查后改产物、远端写成功后丢响应。检查适配器是否拒绝过期产物，以及结果未知时能否先查询再重试；若仍可发布未验收产物或重复写入，否定组合的放行保证。状态所有权归实际写入适配器，面板与检查器只提供证据，不能各自重放写入。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 1628 | — | — | 32791 |
| .js | source | 29 | 2763 | 2598 | 71 | — |
| .md | example | 2 | 29 | — | — | 518 |
| .mjs | source | 6 | 333 | 316 | 5 | — |
| .js | test | 21 | 2744 | 2598 | 6 | — |
| .mjs | example | 1 | 43 | 41 | 1 | — |

排除 0 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/4444wjt/dsh-plugin-veriscope/issues) 查看。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
