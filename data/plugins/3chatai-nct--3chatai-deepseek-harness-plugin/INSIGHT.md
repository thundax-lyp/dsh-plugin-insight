# 3Chat 私域客户运营

[返回分类](../../views/categories/CUSTOMER-SERVICE.md) · [返回首页](../../../README.md)

分析版本：[d741956](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/tree/d741956969f0adcd523c13d682e9ca8d7b313cb0)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=yellow&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)
<!-- END META -->

> **实现功能**：连接 3Chat 客户和会话，准备跟进消息并经确认发送及查询批次结果。

> **核心亮点**：相对人工在CRM筛客并复制发信，贡献是把客户上下文、草稿和渠道执行放进DSH编排，同时显式处理授权、写确认和未知结果。渠道/客服Agent能力归3Chat平台；本插件未实现7×24回复引擎或成交归因。

> **风险与缺陷**：核心假设是模型筛客与自动编排能提高跟进质量而不放大误发。确认提示与串行队列有支持，但用户能否看清批量收件人、远端返回是否代表实际送达仍需端到端验收。未知写结果不能自动重发；原地重试可能产生重复触达。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有3Chat组织和渠道的运营人员，按客户沟通上下文准备单发/批量跟进；交付客户筛选、草稿与可核对发送结果，成交仍需业务记录确认。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

参照人工CRM筛选/发送及原生MCP接入；本次不将3Chat平台自主Agent和广泛产品规划算插件已实现功能。

区域化OAuth连接器获取远端MCP工具，公开工具名/参数契约校验后动态注册；写工具串行并在tools执行决策中要求确认。连接层拦截自动写重放，超时后已dispatch的写返回acceptance unknown。


Node>=22、DSH官方0.2.1-rc.2+（作者声明）、3Chat组织/空间/已连接渠道和发送权限；自主接待需平台预先配置Agent、知识与转人工规则。国内外区域各自授权，服务和账号可达性为效果依赖。

准备渠道/组织→浏览器OAuth→查询已知客户及上下文→模型拟稿→用户确认上传/发送→查询批次逐项结果→平台已配置Agent接待回复。授权临时失败不强迫重登；未知发送先查询状态再决定人工处理。

初装需渠道接入、OAuth和业务规则配置；持续有3Chat服务、模型调用、附件上传及人工消息审阅成本。无本轮价格、成交率或ROI数据，不能把草稿/任务创建算收入。

能把客户洞察直接接入可执行跟进，前提是渠道授权和上下文质量；是否提高成交属于未验证业务结果。

**能力**

- **模型工具**：客户/会话/群查询、附件上传、单发与批量发送及状态查询，经公开契约过滤。
- **界面**：OAuth连接与区域状态面板。

> **思考**：核心假设是模型筛客与自动编排能提高跟进质量而不放大误发。确认提示与串行队列有支持，但用户能否看清批量收件人、远端返回是否代表实际送达仍需端到端验收。未知写结果不能自动重发；原地重试可能产生重复触达。

<a id="detail-section-4"></a>

### 1.3 工程贡献

公开工具allowlist、完整新代际准备后切换注册、写串行和WRITE_REPLAY_BLOCKED值得复用。它们约束插件自动行为，仍需远端幂等/送达语义，不能声称绝对不重复。

包3chat-customer-growth 2.1.4，DSH web双面插件；打包依赖在dist，业务Skill与渠道实现来源需分别归属。

固定源码依据：[src/tools.js L81–115](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/tools.js#L81-L115)；[src/connection.js L129–137](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L129-L137)；[src/connection.js L431–450](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/blob/d741956969f0adcd523c13d682e9ca8d7b313cb0/src/connection.js#L431-L450)。上述贡献与关键质疑均限定于这些固定源码，不把测试文件存在当运行通过。

> **亮点**：相对人工在CRM筛客并复制发信，贡献是把客户上下文、草稿和渠道执行放进DSH编排，同时显式处理授权、写确认和未知结果。渠道/客服Agent能力归3Chat平台；本插件未实现7×24回复引擎或成交归因。

<a id="detail-section-5"></a>

### 1.4 使用建议

已有3Chat渠道的团队先用测试客户验证查询和确认发送，再启用批量；保留人工处理未知结果和业务回复的流程。

核查状态：源码支持本文所述机制与有限集成贡献；效果、宿主兼容和独立采用未验证。未来设计假设仅为推演，未实现、未验证。 只执行研究工程的统计/装配与结构验证，未安装插件、运行目标代码/测试或做真实宿主验收。

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 版本依据：仓库：[3ChatAI-NCT/3chatai-deepseek-harness-plugin](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin)；固定提交：[d7419569](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/tree/d741956969f0adcd523c13d682e9ca8d7b313cb0)；版本号：2.1.4；版本日期：2026-10-19（固定提交日期，北京时间，非包发布日期）。
- 已检查与未覆盖范围：核查工具注册、连接状态、OAuth和写重放约束；未连接3Chat、访问客户或发送消息。
- 证据限制：作者功能摘要来自固定版本README；未核实独立用户采用、同条件效果或端到端收益。版本、证据原文与inventory绑定保存在本项JSON；GitHub/npm统计仅作背景，不构成采用证明。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

待验证假设：以批次收件人和内容摘要生成一次性确认凭据，再把远端任务id和逐项结果绑定，可减少“批准的是A，发送的是B”及未知结果重试。基于已有动态工具代际、确认与禁止重放推导；服务端去重支持和状态所有权需共同设计。

最小验证与否定条件：在测试空间用同名客户、账号切换、批量部分失败与发送超时样本，对照人工CRM；核查收件人/渠道/正文与确认一致、未知写不自动重放、断连后无跨区旧授权。记录送达与人工纠错，若误发或重复触达增加则不能宣称流程改善。

<a id="detail-section-8"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 785 | — | — | 12047 |
| .mjs | source | 6 | 205 | 195 | 6 | — |
| .js | source | 10 | 1470 | 1247 | 142 | — |
| .jsx | source | 1 | 228 | 213 | 3 | — |
| .mjs | test | 4 | 263 | 248 | 3 | — |

排除 6 项；解析错误 0 项。统计为固定Git范围，源码抽读不冒充全面审计；JS/TS与Markdown分别计量。默认排除为启发式，不能从LOC推算原创量或工时。

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+created%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/3ChatAI-NCT/3chatai-deepseek-harness-plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-21T05%3A08%3A56.162Z..2026-10-21T05%3A08%3A56.162Z)



统计日期：2026-10-21。

[返回分类](../../views/categories/CUSTOMER-SERVICE.md) · [返回首页](../../../README.md)
