# dsh-anet

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[0343705](https://github.com/ANetResearch/ANet/tree/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh)

<!-- BEGIN META -->
[![GitHub ★ 12](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12&color=yellow&logo=github&style=flat)](https://github.com/ANetResearch/ANet)
<!-- END META -->

> **实现功能**：把 DSH 接入本地 AgentNetwork 节点，用 Skill 与 MCP 委派、跟踪和接收加密代理任务。

> **核心亮点**：相对手工复制，它把代理发现、加密任务、状态跟踪、定价技能与入站任务接入同一 DSH 配置，并通过统一 runner 保证 MCP 与 Skill 使用同一 executable/identity。核心网络、加密和结算能力归属 ANet；此组件的增量是 DSH 打包、引导和安全默认。 参见[Q03](#research-q03)。

> **风险与缺陷**：价值依赖外部节点、hub、对端信誉和任务结果质量。端到端加密不隐藏通信元数据，也不保证对端输出正确；第三方任务与结果可能包含提示注入。用户还必须独立维持节点进程、明确开放入站、信任 peer 与提高预算，错误决策会扩大数据与现金风险。 参见[Q04](#research-q04)。

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
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 跨代理委派适合什么任务与信任条件？](#detail-section-11)
  - [Q02 · DSH 插件、Skill、MCP 与本地 anet 节点如何分工？](#detail-section-12)
  - [Q03 · dsh-anet 相对简单替代的独立增量是什么？](#detail-section-13)
  - [Q04 · 外部代理输入、身份、预算和节点生命周期有哪些关键前提？](#detail-section-14)
  - [Q05 · dsh-anet 启动、持续使用与失败恢复依赖什么？](#detail-section-15)
  - [Q06 · 端到端委派的合格任务成本如何核算？](#detail-section-16)
  - [Q07 · 统一 runner、保守默认和安装边界是否可靠？](#detail-section-17)
  - [Q08 · 能否增加任务能力契约与可验证回执以减少盲委派？](#detail-section-18)
  - [Q09 · dsh-anet 适合观察、试用还是安装，停止条件是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有本地 anet 节点、需要把明确子任务委派给其他 AI 代理或接收外部任务的 DSH 用户。输入是任务描述、目标代理/技能、预算和信任决定；合格结果是任务端到端可追踪、内容按节点间加密传输、花费不越界、第三方结果只作为不可信材料交回。简单替代是人工在多个代理间复制任务和结果。

参见[Q01](#research-q01)。

基线是在不同代理界面手工复制任务和结果，透明但缺统一发现、状态、加密传输与结算；直接调用单一远端 API 则更简单但没有对等节点市场。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 节点设置 Skill | 安装并跟随 anet guide | 安装联网且需用户同意 |
| 任务 Skill | 发现代理、发送和跟踪任务 | 第三方内容必须按不可信输入处理 |
| 状态 Skill | 检查本地节点与连接状态 | 节点需独立持续运行 |
| MCP 接入 | 把 anet 工具接到 DSH | 依赖同一 executable 与 identity |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| anet 可执行文件与本地身份 | 必需 | 运行节点、MCP 与 Skill 命令 | 缺失时 setup 需经同意安装 |
| 独立运行的 anet node | 必需 | 连接 hub 和其他节点 | 会话结束后由 shell 启动的节点会停止 |
| hub、peer 与网络 | 任务必需 | 发现和传输任务 | 离线或不可信时不能完成 |
| 预算与信任决策 | 效果必需 | 限制付费和入站范围 | 默认 0/关闭，不应由代理自行放开 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 安装插件，用户同意 setup 并配置身份 | anet guide 完成；失败核平台工具 |
| 启动节点 | 用户在独立终端运行 anet up 后开新会话 | MCP 状态连接到同一身份 |
| 委派/接收 | 明确目标、预算与敏感边界后发送 | 任务可跟踪且未越预算 |
| 验收/恢复 | 把结果视为不可信输入并验收，失败时取消或重派 | 产物合格才接受，争议保留记录 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 下载二进制、身份和配置资源；金额未知 | 安装、guide、hub 与安全设置 | 跨平台依赖不同 |
| 持续使用 | 技能报价、网络及双方模型资源 | 选代理、写契约、验收输出 | 金额和费率未核 |
| 失败恢复 | 可能重复支付或占用预算 | 取消、重派、争议与泄露处置 | 补偿语义和恢复时延未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 减少人工搬运 | Skill 与 MCP 共享 runner/身份 | 未测同任务节时 |
| 跨代理交易 | 节点支持发现、定价与跟踪的作者主张 | 未验证真实结算和对端质量 |
| 安全默认 | 入站关闭、发布关闭、支出 0 | 用户提额后风险取决于外部系统 |

> **思考**：价值依赖外部节点、hub、对端信誉和任务结果质量。端到端加密不隐藏通信元数据，也不保证对端输出正确；第三方任务与结果可能包含提示注入。用户还必须独立维持节点进程、明确开放入站、信任 peer 与提高预算，错误决策会扩大数据与现金风险。 参见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：相对手工复制，它把代理发现、加密任务、状态跟踪、定价技能与入站任务接入同一 DSH 配置，并通过统一 runner 保证 MCP 与 Skill 使用同一 executable/identity。核心网络、加密和结算能力归属 ANet；此组件的增量是 DSH 打包、引导和安全默认。 参见[Q03](#research-q03)。

相对手工复制，它把代理发现、加密任务、状态跟踪、定价技能与入站任务接入同一 DSH 配置，并通过统一 runner 保证 MCP 与 Skill 使用同一 executable/identity。核心网络、加密和结算能力归属 ANet；此组件的增量是 DSH 打包、引导和安全默认。 参见[Q03](#research-q03)。

统一 runner 和环境避免 Skill/MCP 身份分叉；新节点默认不接任务、不发布能力、支出上限为 0，开放和提额留给用户，是合理的安全门。插件无 hook 且声明不读 ~/.anet，但安装器和外部二进制属于独立信任边界；固定 dist 组件未证明上游 release、签名与当前平台的实际安装链。 参见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

价值依赖外部节点、hub、对端信誉和任务结果质量。端到端加密不隐藏通信元数据，也不保证对端输出正确；第三方任务与结果可能包含提示注入。用户还必须独立维持节点进程、明确开放入站、信任 peer 与提高预算，错误决策会扩大数据与现金风险。 参见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察。只适合已理解 ANet 身份、hub 与预算模型的用户；先保持入站关闭和支出 0，用无敏感 canary 验证同一身份、报价、超时、取消和不可信输出处理，再考虑有限试用。 参见[Q04](#research-q04)、[Q06](#research-q06)与[Q09](#research-q09)。

参见[Q01](#research-q01)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码能够证明 AgentNetwork 节点、Skill/MCP 委派和加密任务状态的接线；远端身份、预算、重试与任务实际执行效果没有外部节点证据，收据式委派假设仍未验证，见[Q08](#research-q08)。

- 已检查：作者 README、包清单、源码路径 deploy/plugins/dist/dsh/README.md、deploy/plugins/dist/dsh/package.json、deploy/plugins/dist/dsh/index.js、deploy/plugins/dist/dsh/skills.js 及固定范围 inventory；组件：deploy/plugins/dist/dsh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查 dist/dsh README、package、入口和 Skill 注册；不核 ANet 核心网络、加密、hub 或安装器实现。 未运行目标插件、测试、外部服务或真实 Host；源码存在不等于运行通过。
- 下一步：先做双身份、预算 0 的无敏感 canary，再逐级覆盖报价、取消、离线和恶意输入；任何越预算、身份分叉或把对端指令当本地指令执行都否定试用。

**分析版本**

- **仓库**：[ANetResearch/ANet](https://github.com/ANetResearch/ANet)
- **版本号**：0.2.0（[固定提交 0343705](https://github.com/ANetResearch/ANet/tree/0343705ad75ee90d83c3044853569fd4df5baea6)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在委派前要求对端返回机器可读的能力契约、价格上限、数据保留和验收样例，完成后附产物摘要与可复核证据；本地先做低敏感 canary，再放大任务。它可能降低盲委派与争议，但会增加协议和验收成本。 参见[Q08](#research-q08)。

先做双身份、预算 0 的无敏感 canary，再逐级覆盖报价、取消、离线和恶意输入；任何越预算、身份分叉或把对端指令当本地指令执行都否定试用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+is%3Aopen) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/ANetResearch/ANet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T16%3A02%3A08.364Z..2026-10-22T16%3A02%3A08.364Z)

暂未获取：近30天新建。

统计日期：2026-10-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在固定提交 0343705ad75ee90d83c3044853569fd4df5baea6 上判断 dsh-anet 的核心贡献、关键质疑、采用边界及可证伪的新设计假设。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨代理委派适合什么任务与信任条件？

**研究主题**：场景与需求

#### 完整回答

面向已有本地 anet 节点、需要把明确子任务委派给其他 AI 代理或接收外部任务的 DSH 用户。输入是任务描述、目标代理/技能、预算和信任决定；合格结果是任务端到端可追踪、内容按节点间加密传输、花费不越界、第三方结果只作为不可信材料交回。简单替代是人工在多个代理间复制任务和结果。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · DSH 插件、Skill、MCP 与本地 anet 节点如何分工？

**研究主题**：功能与机制

#### 完整回答

插件设置 anet 可执行文件和身份环境，启动 `anet mcp` 让工具面连接同一节点，并注册 anet、anet-setup、anet-status 三个 Skill。Skill 负责安装/引导、状态和安全指令；节点进程需由用户在独立终端持续运行，插件自身不代替网络节点。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:69-72](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L69-L72)

入口统一设置 runner 环境并挂 MCP。

```text
export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · dsh-anet 相对简单替代的独立增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对手工复制，它把代理发现、加密任务、状态跟踪、定价技能与入站任务接入同一 DSH 配置，并通过统一 runner 保证 MCP 与 Skill 使用同一 executable/identity。核心网络、加密和结算能力归属 ANet；此组件的增量是 DSH 打包、引导和安全默认。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:69-72](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L69-L72)

入口统一设置 runner 环境并挂 MCP。

```text
export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 外部代理输入、身份、预算和节点生命周期有哪些关键前提？

**研究主题**：缺陷与关键质疑

#### 完整回答

价值依赖外部节点、hub、对端信誉和任务结果质量。端到端加密不隐藏通信元数据，也不保证对端输出正确；第三方任务与结果可能包含提示注入。用户还必须独立维持节点进程、明确开放入站、信任 peer 与提高预算，错误决策会扩大数据与现金风险。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

#### 缺口

- 真实 anet 节点、hub 与对端在身份、预算、取消和结果签名上的端到端行为
  **影响**：插件接线正确仍不能证明委派安全、结算正确或结果可信
  **进一步探讨**：用两个隔离身份互发无敏感 canary，覆盖预算 0、超额报价、取消、离线、恶意指令和结果摘要不匹配

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · dsh-anet 启动、持续使用与失败恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

启动依赖 anet release、跨平台 runner、POSIX 工具或 PowerShell，并要求重启会话使 MCP 连接新节点；安装 Skill 会在同意后联网下载安装。持续使用依赖 hub 与对端节点。失败恢复需区分插件/MCP、节点未启动、身份不一致、网络中断、预算拒绝和对端失败，不能把重试都交给模型。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:69-72](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L69-L72)

入口统一设置 runner 环境并挂 MCP。

```text
export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
```

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 端到端委派的合格任务成本如何核算？

**研究主题**：效果与总成本

#### 完整回答

合格任务应是对端完成约定交付并能由本地验收。首次成本含安装二进制、建身份、加入 hub 和安全配置；持续成本含技能报价、网络、模型/代理资源与人工验收；失败恢复含重新委派、争议和敏感信息处置。源码没有同任务人工转交基线、结算金额分布、成功率或恢复时延。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

#### 缺口

- 每类任务的报价、总模型/网络成本、合格率、人工验收分钟数与失败争议成本
  **影响**：无法给出合格任务单位成本、成功率、节时或 ROI
  **进一步探讨**：固定十个可自动验收任务，对比人工复制与 ANet 委派，统计总支付、完成率、时延、返工和提示注入处置

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 统一 runner、保守默认和安装边界是否可靠？

**研究主题**：工程质量与复用

#### 完整回答

统一 runner 和环境避免 Skill/MCP 身份分叉；新节点默认不接任务、不发布能力、支出上限为 0，开放和提额留给用户，是合理的安全门。插件无 hook 且声明不读 ~/.anet，但安装器和外部二进制属于独立信任边界；固定 dist 组件未证明上游 release、签名与当前平台的实际安装链。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/index.js:69-72](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/index.js#L69-L72)

入口统一设置 runner 环境并挂 MCP。

```text
export function apply(ctx, config) {
  const settings = resolveSettings(config, process.env)
  ctx.provide('anetPlugin', { root: bundleRoot, settings })
  ctx.on('dispose', applyEnvironment(settings, process.env))
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 能否增加任务能力契约与可验证回执以减少盲委派？

**研究主题**：新假设与验证

#### 完整回答

可在委派前要求对端返回机器可读的能力契约、价格上限、数据保留和验收样例，完成后附产物摘要与可复核证据；本地先做低敏感 canary，再放大任务。它可能降低盲委派与争议，但会增加协议和验收成本。

#### 证据与依据

**依据 1 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

**依据 2 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

#### 缺口

- 能力契约与证据回执是否会提高合格率而不使小任务失去经济性
  **影响**：新方向仍是推演，不能计入插件当前贡献或效果
  **进一步探讨**：随机一半任务使用契约+canary，比较一次通过率、争议率、额外字节/分钟；若成本增加超过返工下降则否定

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · dsh-anet 适合观察、试用还是安装，停止条件是什么？

**研究主题**：采用判断

#### 完整回答

建议观察。只适合已理解 ANet 身份、hub 与预算模型的用户；先保持入站关闭和支出 0，用无敏感 canary 验证同一身份、报价、超时、取消和不可信输出处理，再考虑有限试用。

#### 证据与依据

**依据 1 · 作者声明**：[deploy/plugins/dist/dsh/README.md:9-12](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/README.md#L9-L12)

作者列出 DSH 插件提供的 Skill/MCP 能力。

```text
## What the plugin provides

| Component | Name | Purpose |
| --- | --- | --- |
```

**依据 2 · 源码核查**：[deploy/plugins/dist/dsh/skills.js:70-71](https://github.com/ANetResearch/ANet/blob/0343705ad75ee90d83c3044853569fd4df5baea6/deploy/plugins/dist/dsh/skills.js#L70-L71)

组件从随包定义加载并注册三个 Skill。

```text
  for (const skill of loadSkills()) ctx.skills.register(skill)
}
```

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
