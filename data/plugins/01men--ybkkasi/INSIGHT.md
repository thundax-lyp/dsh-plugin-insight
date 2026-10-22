# 元冰可 · 企业 AI 资源管理平台

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[d42aa3b](https://github.com/01men/ybkkasi/tree/d42aa3bb5925f1f8be7c92337682d006484ec413)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：以插件化控制面统一管理Agent、应用、身份、审计、连接器、MCP、技能和用量。

> **核心亮点**：以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线。它相对“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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
  - [Q01 · 目标用户、反复任务、原有办法与合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、调用链、数据和状态如何实现核心能力？](#detail-section-12)
  - [Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？](#detail-section-13)
  - [Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？](#detail-section-14)
  - [Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？](#detail-section-15)
  - [Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？](#detail-section-16)
  - [Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？](#detail-section-17)
  - [Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？](#detail-section-18)
  - [Q09 · 对谁值得观察或试用，成功与停止标准是什么？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要自建企业 AI 资源控制面并能承担部署与治理工作的运维和平台团队可用它在一套插件化平台内管理企业 Agent、应用、身份权限、连接器、MCP、技能市场、审计和用量；合格结果是资源、权限、调用、审计和成本有一致身份与状态，可追踪失败并按组织边界操作。详见[Q01](#research-q01)。

基线是分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面。本项的价值主要来自以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 资源控制面 | 管理 Agent、应用、模型、MCP 与技能等资源。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 身份与审计 | 提供组织、角色、凭据、审批和审计能力。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 连接与用量治理 | 接入连接器、远端执行、用量核对和成本报告。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 共享 platform-core、SQLite/存储与插件总线 | 必需 | 统一身份、事件、HTTP和持久化 | 核心未就绪时业务插件不得部分启动 |
| OIDC/IAM/凭据与审批策略 | 治理操作必需 | 认证、授权、冻结和敏感动作审批 | 策略未知时拒绝写操作 |
| 连接器/MCP/NAS/模型等外部系统 | 按模块必需 | 执行企业资源操作 | 外部状态未知时保留对账/补偿记录 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 先部署最小core+authn+iam+audit并建立组织/角色 | 权限拒绝与审计链可验证 |
| 2 | 逐模块接Agent/App/MCP/连接器和用量 | 每项都有健康检查、资源ID与回滚 |
| 3 | 用跨模块场景演练审批、执行、计量和对账 | 失败可定位到阶段，禁止全栈盲重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 服务器、数据库、OIDC/连接器和监控资源 | 架构部署、权限建模、92个工具面审阅 | 上线人周与外部许可未知 |
| 持续使用 | 存储、网络、模型/MCP/NAS与监控 | 升级、审计、对账、告警和密钥轮换 | 月度TCO与值班负担未知 |
| 失败恢复 | 消息/任务重放、数据库备份和外部补偿 | 跨插件对账、冻结写入、恢复一致性 | 外部动作已发生时需业务补偿 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 统一控制面 | 共享core和多插件工具面存在 | 生产吞吐、隔离和升级兼容 |
| 身份/审计闭环 | authn/iam/audit代码与工具存在 | 策略覆盖、不可抵赖和告警质量 |
| 资源/用量治理 | 连接器、MCP、usage等模块存在 | 跨系统账实一致率与恢复时间 |

> **思考**：能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线。它相对“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线。它相对“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 packages/platform-core/src/index.ts 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“用跨模块场景演练审批、执行、计量和对账｜失败可定位到阶段，禁止全栈盲重试”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

具备平台工程团队者可观察并从最小治理内核评估，不宜仅凭工具数量直接作为生产控制面。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/platform-core/src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。

**分析版本**

- **仓库**：[01men/ybkkasi](https://github.com/01men/ybkkasi)
- **版本号**：1.3.0（[固定提交 d42aa3b](https://github.com/01men/ybkkasi/tree/d42aa3bb5925f1f8be7c92337682d006484ec413)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可先抽取最小治理内核，将身份、审批、审计和用量回执作为所有插件的强制协议，再分阶段启用业务模块。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 142 | 47911 | 37479 | 7083 | — |
| .md | source | 144 | 21658 | — | — | 372687 |
| .mjs | source | 26 | 14441 | 9883 | 4046 | — |
| .js | source | 54 | 20972 | 18829 | 1235 | — |
| .mjs | test | 21 | 4505 | 3624 | 653 | — |
| .tsx | source | 2 | 267 | 194 | 53 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A52.537Z..2026-10-22T15%3A12%3A52.537Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/01men/ybkkasi/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A12%3A52.537Z..2026-10-22T15%3A12%3A52.537Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 元冰可 · 企业 AI 资源管理平台 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是需要自建企业 AI 资源控制面并能承担部署与治理工作的运维和平台团队。反复任务是在一套插件化平台内管理企业 Agent、应用、身份权限、连接器、MCP、技能市场、审计和用量。原有办法为分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面。合格结果必须达到“资源、权限、调用、审计和成本有一致身份与状态，可追踪失败并按组织边界操作”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# 元冰可 · 企业 AI 资源管理平台

> **v1.3.0 · MIT · self-hosted.** One control plane for every MCP server, skill, agent and AI app.

[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![selftest](https://img.shields.io/badge/selftest-1486%20green-success)](https://github.com/01men/ybkkasi/actions/workflows/quality-gate.yml)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.6-339933)]()
[![i18n](https://img.shields.io/badge/i18n-zh--en--ja-blue)]()
[![Demo](https://img.shields.io/badge/demo-demo.ybkkasi.com-FF6B35)](https://demo.ybkkasi.com)

**把散落在企业里的 MCP 服务 / Skill / Agent / AI 应用 / 模型渠道 / SaaS 连接器 / NAS 存储，
统一成一套可管、可算、可审的资产。**

一套身份 · 一套权限 · 一套计量 · 一套审计。**27 个插件包，按需启用。**

> **YBK Enterprise AI Asset Governance** — One control plane for every MCP server, skill,
> agent, and AI app. One identity, one permission model, one metering pipeline, one audit trail.
> Self-hosted, MIT licensed.

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

packages/platform-core/src/index.ts 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“先部署最小core+authn+iam+audit并建立组织/角色｜权限拒绝与审计链可验证；逐模块接Agent/App/MCP/连接器和用量｜每项都有健康检查、资源ID与回滚；用跨模块场景演练审批、执行、计量和对账｜失败可定位到阶段，禁止全栈盲重试”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-enterprise-ops",
  "version": "1.3.0",
  "private": true,
  "type": "module",
  "description": "企业 AI 资源统一管理平台 —— 基于 DeepSeek Harness「一切皆插件」架构",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/01men/ybkkasi.git"
  },
  "files": [
    "cordis.patch.yml",
    "cordis.yml",
    "packages",
    "src",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线。参照是“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# 元冰可 · 企业 AI 资源管理平台

> **v1.3.0 · MIT · self-hosted.** One control plane for every MCP server, skill, agent and AI app.

[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![selftest](https://img.shields.io/badge/selftest-1486%20green-success)](https://github.com/01men/ybkkasi/actions/workflows/quality-gate.yml)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.6-339933)]()
[![i18n](https://img.shields.io/badge/i18n-zh--en--ja-blue)]()
[![Demo](https://img.shields.io/badge/demo-demo.ybkkasi.com-FF6B35)](https://demo.ybkkasi.com)

**把散落在企业里的 MCP 服务 / Skill / Agent / AI 应用 / 模型渠道 / SaaS 连接器 / NAS 存储，
统一成一套可管、可算、可审的资产。**

一套身份 · 一套权限 · 一套计量 · 一套审计。**27 个插件包，按需启用。**

> **YBK Enterprise AI Asset Governance** — One control plane for every MCP server, skill,
> agent, and AI app. One identity, one permission model, one metering pipeline, one audit trail.
> Self-hosted, MIT licensed.

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

#### 缺口

- 缺少针对“能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：共享 platform-core、SQLite/存储与插件总线｜必需｜统一身份、事件、HTTP和持久化｜核心未就绪时业务插件不得部分启动；OIDC/IAM/凭据与审批策略｜治理操作必需｜认证、授权、冻结和敏感动作审批｜策略未知时拒绝写操作；连接器/MCP/NAS/模型等外部系统｜按模块必需｜执行企业资源操作｜外部状态未知时保留对账/补偿记录。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“用跨模块场景演练审批、执行、计量和对账｜失败可定位到阶段，禁止全栈盲重试”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-enterprise-ops",
  "version": "1.3.0",
  "private": true,
  "type": "module",
  "description": "企业 AI 资源统一管理平台 —— 基于 DeepSeek Harness「一切皆插件」架构",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/01men/ybkkasi.git"
  },
  "files": [
    "cordis.patch.yml",
    "cordis.yml",
    "packages",
    "src",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

**依据 2 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“资源、权限、调用、审计和成本有一致身份与状态，可追踪失败并按组织边界操作”为合格单位。三阶段投入为：首次使用｜服务器、数据库、OIDC/连接器和监控资源｜架构部署、权限建模、92个工具面审阅｜上线人周与外部许可未知；持续使用｜存储、网络、模型/MCP/NAS与监控｜升级、审计、对账、告警和密钥轮换｜月度TCO与值班负担未知；失败恢复｜消息/任务重放、数据库备份和外部补偿｜跨插件对账、冻结写入、恢复一致性｜外部动作已发生时需业务补偿。当前源码只支持机制存在，效果维度为“统一控制面｜共享core和多插件工具面存在｜生产吞吐、隔离和升级兼容；身份/审计闭环｜authn/iam/audit代码与工具存在｜策略覆盖、不可抵赖和告警质量；资源/用量治理｜连接器、MCP、usage等模块存在｜跨系统账实一致率与恢复时间”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# 元冰可 · 企业 AI 资源管理平台

> **v1.3.0 · MIT · self-hosted.** One control plane for every MCP server, skill, agent and AI app.

[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![selftest](https://img.shields.io/badge/selftest-1486%20green-success)](https://github.com/01men/ybkkasi/actions/workflows/quality-gate.yml)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.6-339933)]()
[![i18n](https://img.shields.io/badge/i18n-zh--en--ja-blue)]()
[![Demo](https://img.shields.io/badge/demo-demo.ybkkasi.com-FF6B35)](https://demo.ybkkasi.com)

**把散落在企业里的 MCP 服务 / Skill / Agent / AI 应用 / 模型渠道 / SaaS 连接器 / NAS 存储，
统一成一套可管、可算、可审的资产。**

一套身份 · 一套权限 · 一套计量 · 一套审计。**27 个插件包，按需启用。**

> **YBK Enterprise AI Asset Governance** — One control plane for every MCP server, skill,
> agent, and AI app. One identity, one permission model, one metering pipeline, one audit trail.
> Self-hosted, MIT licensed.

```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-enterprise-ops",
  "version": "1.3.0",
  "private": true,
  "type": "module",
  "description": "企业 AI 资源统一管理平台 —— 基于 DeepSeek Harness「一切皆插件」架构",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/01men/ybkkasi.git"
  },
  "files": [
    "cordis.patch.yml",
    "cordis.yml",
    "packages",
    "src",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 packages/platform-core/src/index.ts 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“用跨模块场景演练审批、执行、计量和对账｜失败可定位到阶段，禁止全栈盲重试”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-enterprise-ops",
  "version": "1.3.0",
  "private": true,
  "type": "module",
  "description": "企业 AI 资源统一管理平台 —— 基于 DeepSeek Harness「一切皆插件」架构",
  "license": "MIT",
  "workspaces": [
    "packages/*"
  ],
  "repository": {
    "type": "git",
    "url": "https://github.com/01men/ybkkasi.git"
  },
  "files": [
    "cordis.patch.yml",
    "cordis.yml",
    "packages",
    "src",
    "README.md",
    "LICENSE"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“以共享平台核心和插件总线统一多个治理域，并同时提供 DSH 插件与独立宿主接线”和“能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度”推导的新方向是可先抽取最小治理内核，将身份、审批、审计和用量回执作为所有插件的强制协议，再分阶段启用业务模块。它不是当前能力。最小验证为只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 若合格结果不改善、误差/副作用越界或恢复负担高于“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。具备平台工程团队者可观察并从最小治理内核评估，不宜仅凭工具数量直接作为生产控制面。 试用成功标准是“资源、权限、调用、审计和成本有一致身份与状态，可追踪失败并按组织边界操作”，并且 生产吞吐、隔离和升级兼容、策略覆盖、不可抵赖和告警质量、跨系统账实一致率与恢复时间 有可接受结果；停止标准包括发生能力面和工具数量很大，部署、权限、存储、第三方连接器及运维故障面也显著扩大；源码不足以证明企业生产成熟度所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“分别使用 AI Gateway、IAM、监控、连接器平台和脚本拼装控制面”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# 元冰可 · 企业 AI 资源管理平台

> **v1.3.0 · MIT · self-hosted.** One control plane for every MCP server, skill, agent and AI app.

[![MIT](https://img.shields.io/badge/license-MIT-green)](LICENSE)
[![selftest](https://img.shields.io/badge/selftest-1486%20green-success)](https://github.com/01men/ybkkasi/actions/workflows/quality-gate.yml)
[![Node](https://img.shields.io/badge/Node-%E2%89%A522.6-339933)]()
[![i18n](https://img.shields.io/badge/i18n-zh--en--ja-blue)]()
[![Demo](https://img.shields.io/badge/demo-demo.ybkkasi.com-FF6B35)](https://demo.ybkkasi.com)

**把散落在企业里的 MCP 服务 / Skill / Agent / AI 应用 / 模型渠道 / SaaS 连接器 / NAS 存储，
统一成一套可管、可算、可审的资产。**

一套身份 · 一套权限 · 一套计量 · 一套审计。**27 个插件包，按需启用。**

> **YBK Enterprise AI Asset Governance** — One control plane for every MCP server, skill,
> agent, and AI app. One identity, one permission model, one metering pipeline, one audit trail.
> Self-hosted, MIT licensed.

```

</details>

**依据 2 · 源码核查**：[packages/platform-core/src/index.ts:48-65](https://github.com/01men/ybkkasi/blob/d42aa3bb5925f1f8be7c92337682d006484ec413/packages/platform-core/src/index.ts#L48-L65)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text

export const name = 'platform-core'

export async function apply(ctx: Context, config: PlatformCoreConfig = {}) {
  const storage = new StorageService(ctx, { dataDir: config.dataDir })
  ctx.plugin(PlatformBusService)
  ctx.plugin(SqliteTxnService, { dataDir: config.dataDir })
  // 数字员工工作策略登记器（窄端口）：plugin-workforce ready 后登记实现，
  // 资源网关/exec-hub 经 ctx.workforcePolicy 消费（装配顺序无关，防循环依赖）
  ctx.plugin(WorkforcePolicyRegistry)
  if (config.provideToolRuntime !== false) {
    ctx.plugin(ToolRuntimeLite)
  }
  const http = new HttpServerService(ctx, config.http ?? {})
  // 集合恢复必须先于一切业务集合读取（form B 教训：boot-all 的 restoreAll 在 loader
  // 链路不存在，集合全空 → 演示种子重种撞幂等键 fatal）。apply 异步化，loader 会等待。
  await storage.start()
  await storage.restoreAll()
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：只启用core/authn/iam/audit/usage五模块，跑20条跨角色审批与计量场景并注入数据库/外部超时；记录越权数、账实差异、恢复时间和运维小时，任何越权成功或静默丢账即停止扩容。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
