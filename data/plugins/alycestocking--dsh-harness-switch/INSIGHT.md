# DSH Harness Switch

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[678b5a2](https://github.com/AlyceStocking/dsh-harness-switch/tree/678b5a218f750c61c055bb113a4ff003948aa774)

<!-- BEGIN META -->
[![npm 30d 39](https://img.shields.io/static/v1?label=npm+30d&message=39&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-harness-switch) [![最新发布 2026-10-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-harness-switch)
<!-- END META -->

> **实现功能**：在 DSH 原生会话中切换原生适配与嵌入式 Kimi Code 执行核心。

> **核心亮点**：避免把外部harness降格成模型文本：嵌入Kimi核心拥有提示/工具/权限/压缩，DSH保留会话UI与审批，外层不再执行同一真实工具第二次。贡献是执行所有权桥接；vendor Kimi内核明确上游固定提交，不将其能力或代码量算插件原创。

> **风险与缺陷**：切换后权限和历史是否仍具一致含义？Kimi判免审批动作不再经过DSH逐工具allowlist，审批桥仅覆盖Kimi提出的请求；同原生权限名称不意味着同策略。pending链接在调用前落盘能标未知，但副作用已发生而completed写失败仍需恢复协议，不能只因有messageId就认定exactly-once；跨模型历史导入是参考而非状态等价。

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

> **用途**：希望相同模型下比较/使用不同harness工具、Skills和压缩的开发者；合格交付是一次真实执行、正确审批和可恢复会话关联。

DSH原生工具循环、Kimi CLI独立运行或简单模型API适配；本项保留嵌入执行语义，不只是换系统提示。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **模型工具**：kimi_harness_turn为本地嵌入式执行传输入口。
- **Host 路由**：connection /harness-switch提供设置/模型/执行视图RPC。
- **事件监听**：原生prompt装配与Agent作用域接入传输adapter。
- **后台**：embedded Kimi执行核心管理会话/工具/Skills/MCP/压缩，上游归属明确。

**流程与依赖**

外层adapter对embedded绑定生成本地kimi_harness_turn工具信封，prompt装配替换为传输说明；EngineManager将DSH session映射Kimi session并存home/cwd/固定上游commit/seen/pending/completed。引擎内部执行工具，审批/提问桥到DSH，历史增量导入，输出投影为原生工具卡。

DSH llm/systemPrompt/tools/approval/userQuestions/attachments/connection、嵌入KimiSDK及配置/OAuth、可写storage；MCP与项目Skill按上游信任规则。

绑定模型/harness→选原生session→外层本地信封→恢复/建Kimi session→增量历史→信任/工具审批→内部执行→回传/持久完成；取消清监听并保留状态。

DSH bundle，README声明Node24.15/特定Desktop；vendor固定MIT来源与来源补丁需保留，settings/会话目录独立于包迁移。

**效果与成本**

现金为所选Kimi/API模型及MCP动作；人工是模型绑定、权限差异、历史导入和未知pending复核，双引擎状态迁移有维护成本。

在同原生UI使用另一执行体系，适合研究harness差异；未有同模型任务质量/成本实验。

> **思考**：切换后权限和历史是否仍具一致含义？Kimi判免审批动作不再经过DSH逐工具allowlist，审批桥仅覆盖Kimi提出的请求；同原生权限名称不意味着同策略。pending链接在调用前落盘能标未知，但副作用已发生而completed写失败仍需恢复协议，不能只因有messageId就认定exactly-once；跨模型历史导入是参考而非状态等价。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：避免把外部harness降格成模型文本：嵌入Kimi核心拥有提示/工具/权限/压缩，DSH保留会话UI与审批，外层不再执行同一真实工具第二次。贡献是执行所有权桥接；vendor Kimi内核明确上游固定提交，不将其能力或代码量算插件原创。

避免把外部harness降格成模型文本：嵌入Kimi核心拥有提示/工具/权限/压缩，DSH保留会话UI与审批，外层不再执行同一真实工具第二次。贡献是执行所有权桥接；vendor Kimi内核明确上游固定提交，不将其能力或代码量算插件原创。

settings活跃turn时拒变更，session链接绑定home/cwd/engine commit防错复用，取消同时请求turn/compaction并等待；存completed结果有助重入，仍需断电/写错故障核查。

固定源码依据：[index.js](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/index.js)、[src/engine.js](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/src/engine.js)、[cordis.patch.yml](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/cordis.patch.yml)、[package.json](https://github.com/AlyceStocking/dsh-harness-switch/blob/678b5a218f750c61c055bb113a4ff003948aa774/package.json)。

<a id="detail-section-5"></a>

### 1.4 主要限制

切换后权限和历史是否仍具一致含义？Kimi判免审批动作不再经过DSH逐工具allowlist，审批桥仅覆盖Kimi提出的请求；同原生权限名称不意味着同策略。pending链接在调用前落盘能标未知，但副作用已发生而completed写失败仍需恢复协议，不能只因有messageId就认定exactly-once；跨模型历史导入是参考而非状态等价。

<a id="detail-section-6"></a>

### 1.5 使用建议

明确需要Kimi内核且能核权限差异的开发者可评估；不能把DSH allowlist当对全部内部工具的第二道检查。

核查状态：传输/引擎分工、审批桥与持久关联源码支持；上游内核全部行为和跨harness恢复未运行验证。 本轮只检查源码，未安装、执行目标代码/测试或真实宿主验收。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

- 版本号：0.3.3；版本日期：2026-10-14（固定提交日期，北京时间，非包发布日期）。
- 固定提交：[678b5a21](https://github.com/AlyceStocking/dsh-harness-switch/tree/678b5a218f750c61c055bb113a4ff003948aa774)；本轮基准：2026-10-21T07:52:12Z。
- 已检查：上述源码路径、README、包清单及组件inventory。
- 范围：根index与src/engine.js核心映射/审批/取消/持久化及patch；vendor核心未全审，src与构建产物不自动等价，未操作真实Kimi会话。
- 未执行：目标安装、代码/测试、真实宿主和第三方服务。作者说明与源码不等于独立效果验证。

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

给每harness显示可比较的权限能力清单，并为未知pending提供只读恢复/回执核查而非重新prompt，可能减少策略误判和重复工具副作用。固定同任务比较原生/embedded审批触发，再在工具完成后断写completed恢复，要求不自动重放；若不能核定原结果，应保持unknown并交人。

未运行目标；拟测审批拒绝/取消、切harness历史、工具副作用后落盘失败与重入，区分消息回执和业务完成。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 1048 | 1008 | 14 | — |
| .md | source | 1 | 131 | — | — | 2665 |
| .mjs | source | 3 | 175 | 151 | 25 | — |
| .js | test | 7 | 481 | 458 | 2 | — |
| .mjs | test | 4 | 283 | 277 | 3 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/AlyceStocking/dsh-harness-switch/issues) 查看。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
