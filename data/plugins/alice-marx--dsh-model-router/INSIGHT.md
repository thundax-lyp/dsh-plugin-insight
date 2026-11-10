# DSH Bot · 模型路由

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[288a7cd](https://github.com/Alice-Marx/dsh-model-router/tree/288a7cd13a503379250acd159f22b4424336025e)

<!-- BEGIN META -->
[![GitHub ★ 957](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=957&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Alice-Marx/dsh-model-router) [![npm 30d 1,474](https://img.shields.io/static/v1?label=npm+30d&message=1%2C474&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-route-bot) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ljwei-stak/dsh-model-route-bot)
<!-- END META -->

> **功能**：为 DSH 提供模型路由、依赖工作包、官方 CLI 执行与核算，并提供完整 Bot 工作区版本。

> **亮点**：[Q02](#research-q02) 将依赖分派、路由来源和启动确认集中为可核对的工作台流程。[Q03](#research-q03) 对已启动但未收齐账单的工作保留未知和预占。

> **主要限制**：[Q01](#research-q01) 作者的纯路由宿主回执未打开工作台。[Q04](#research-q04) 任务 journal 和租约需要后端配合，无法单凭本地取消证明远端停止。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 两个发行包分别服务谁，当前宿主兼容证据覆盖哪里？](#detail-section-11)
  - [Q02 · 规划与真实模型调用之间有什么约束，相比手工分派有何增量？](#detail-section-12)
  - [Q03 · 预算预占、费用未知和厂商扣费分别能约束什么？](#detail-section-13)
  - [Q04 · 完整 Bot 如何派发持久任务，哪些故障仍需授权对账？](#detail-section-14)
  - [Q05 · 什么条件下值得继续观察，如何验证自动分派是否真正有收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有多条 DSH 模型路线的开发者可预览依赖工作包，并查看选路、执行与费用记录。

固定单模型易于追溯但要人工拆分依赖和核账。按标价挑最便宜的模型可以控制预估，却无法表达任务适配、切换代价和失败恢复。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 依赖工作包 | 检查候选、手工指定和执行预览 | 估算与质量先验需要核对 |
| 预算与回执 | 管理 API 预占、实际结算与未知用量 | 外部厂商账单需要独立核实 |
| 持久 Bot 任务 | 绑定目标、派发与对账 | 仅完整包，远端依赖显式授权 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 包声明的兼容 DSH Host 与 profile | 必需 | 注册工作台、工具和适用的 Bot 服务 | 保留原 profile，核对加载 |
| 已配置路线和对应账户 | 执行必需 | 选定模型、费用和回执来源 | 未知价格先停 API 任务 |
| 已登记 CLI 和工具登录 | CLI 场景必需 | 按可用执行模式调用官方工具 | 回到已核对的单一路线 |
| 机器及工作区授权 | 远程场景必需 | 限定远端后端和计划目标 | 授权缺失时拒绝派发 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者选一个发行包，使用独立 profile | 可安装并进入面板，不复用生产状态 |
| 预览 | 操作者检查拆分、准确模型和报价 | 权限、估算和验收可读 |
| 执行 | Host 预占，模型或工具处理工作包 | 有结果和可追溯回执 |
| 恢复 | 操作者核查账本和远端引用 | 未决状态先对账，再决定重试 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 配置模型账户、CLI 与状态存储 | 维护权限、价格和独立 profile | 未测上线用时 |
| 持续 | API 调用和订阅用量 | 复核路线、产物和账单 | 未测合格任务净成本 |
| 失败 | 部分调用可能计费 | 对账、核查权限和未决远端操作 | 未测恢复成本 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 规划透明度 | 预览、准确路线和确认点 | 真实用户在引导后完成任务 |
| 预算与任务恢复 | 预占、未决账单和对账入口 | 外部账单一致及远端副作用 |
| 质量和净成本 | 有可解释候选和费用来源 | 自动路由相对固定模型的收益 |

> **思考**：[Q01](#research-q01) 作者的纯路由宿主回执未打开工作台。[Q04](#research-q04) 任务 journal 和租约需要后端配合，无法单凭本地取消证明远端停止。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 将依赖分派、路由来源和启动确认集中为可核对的工作台流程。[Q03](#research-q03) 对已启动但未收齐账单的工作保留未知和预占。

完整版将模型与远端后端通过任务服务接入同一能力边界，派发与结算有各自的持久状态。候选裁剪保留已知价格锚点，账本保留中断未知费用，便于后续人工核查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 作者的纯路由宿主回执未打开工作台。[Q04](#research-q04) 任务 journal 和租约需要后端配合，无法单凭本地取消证明远端停止。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 保持观察。独立 profile 先核对引导、预览和费用标记，待基础验收可复现再运行无敏感数据的只读任务。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

路由求解、预检、预算预占和完整版持久任务有源码支持。发行包挂载来自作者回执，完整面板、真实模型及远端故障未独立验证。质量校准为待验证假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、.dsh-plugin/index.mjs、packages/model-router-plugin/cordis.patch.yml、.dsh-plugin/router-only.mjs、README.zh.md、docs/releases/0.66.4/publication.json、.dsh-plugin/router-core.mjs、.dsh-plugin/shared/router.mjs、.dsh-plugin/shared/budget-reservations.mjs、packages/orchestration/src/funding-admission.mjs、packages/orchestration/src/funded-router-state.mjs、packages/orchestration/src/bot-routing-dispatch.mjs、packages/orchestration/src/product-composition.mjs、packages/orchestration/src/task-service.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交，抽查发行包入口、工作台路由、API 预算和完整 Bot 任务服务。未执行安装、厂商调用、宿主迁移、远程桌面和用量实验。
- 下一步：以独立 profile 复核引导、只读任务和禁用，随后用故障注入对照外部账单、远端记录与 journal。相同预算下盲评固定路线与自动组的任务合格率。

**分析版本**

- **仓库**：[Alice-Marx/dsh-model-router](https://github.com/Alice-Marx/dsh-model-router)
- **版本号**：0.66.4（[固定提交 288a7cd](https://github.com/Alice-Marx/dsh-model-router/tree/288a7cd13a503379250acd159f22b4424336025e)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 只用已验收产物和结清回执校准特定任务族，可能降低评分先验不匹配带来的无效调用。

以独立 profile 复核引导、只读任务和禁用，随后用故障注入对照外部账单、远端记录与 journal。相同预算下盲评固定路线与自动组的任务合格率。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 215 | 41825 | 35786 | 4217 | — |
| .js | source | 7 | 39437 | 37868 | 1594 | — |
| .jsx | source | 14 | 5115 | 4767 | 189 | — |
| .md | source | 18 | 1544 | — | — | 26696 |
| .ts | source | 19 | 2801 | 2210 | 529 | — |
| .mjs | test | 50 | 5736 | 5137 | 231 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Alice-Marx/dsh-model-router/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)

暂未获取：近30天关闭。

统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有多条 DSH 模型路线的团队，能否用 0.66.4 管理依赖任务、权限与费用，并在中断后保留可核对的执行结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两个发行包分别服务谁，当前宿主兼容证据覆盖哪里？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

已经维护多条 DSH 路线、反复做多步骤项目检查的开发者，是路由工作台的直接使用对象。比如先让一个模型核对项目约束，另一个模型读代码并产出可审查结论，再查这两步各用了哪个模型和多少额度。完整 Bot 版还适合需要为多个 Bot 保留各自会话和权限的团队。已有单一可靠模型、任务无依赖时，额外安装路由器的理由较弱。

根包以完整 Bot 为入口，导入路由核心和 Bot 产品钩子，Cordis patch 同时启用一个搜索供应商并配置宿主 Web 搜索。纯路由包有自己的 patch 和薄入口，仅导出路由核心。两者沿用同一 Cordis 条目 ID，作者要求同一 profile 只选一个版本。项目回执记载纯路由版在一个真实宿主样例中已挂载，客户端产物能提供，Bot API 返回 404。同一回执明确说明引导确认不能持久化，路由面板未打开。由此可以判断包的构成和该样例的挂载范围，尚不能判断纯路由版从面板到任务结果的兼容性。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-22](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/package.json#L1-L22)

根包名、版本和完整入口。

<details>
<summary>查看原文（22行）</summary>

```text
{
  "name": "@ljwei-stak/dsh-model-route-bot",
  "version": "0.66.4",
  "type": "module",
  "description": "DSH Bot workspace with integrated model routing, official tools and remote computers",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Alice-Marx/dsh-model-router.git"
  },
  "homepage": "https://github.com/Alice-Marx/dsh-model-router#readme",
  "bugs": {
    "url": "https://github.com/Alice-Marx/dsh-model-router/issues"
  },
  "publishConfig": {
    "access": "public"
  },
  "main": "./.dsh-plugin/index.mjs",
  "exports": {
    ".": "./.dsh-plugin/index.mjs",
    "./client": "./.dsh-plugin/client.js",
    "./web-search": "./modules/bot-runtime/web-search.mjs",
    "./cordis.patch.yml": "./cordis.patch.yml",
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:9-17](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/cordis.patch.yml#L9-L17)

完整包同时挂载 Web 搜索供应商，并更改对应宿主配置。

```text
- insert:
    - id: model-router-galgame
      name: '@ljwei-stak/dsh-model-route-bot'
    - id: web-search-auto
      name: '@ljwei-stak/dsh-model-route-bot/web-search'
- id: web
  config:
    searchProvider: auto
    fetchProvider: http
```

**依据 3 · 源码核查**：[.dsh-plugin/index.mjs:1-9](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/index.mjs#L1-L9)

完整入口把产品钩子注入共同路由核心。

```text
/** Full Bot + routing plugin; package: @ljwei-stak/dsh-model-route-bot. */
import { apply as applyRouter, createRouterConfig, inject as routerInject } from './router-core.mjs'
import * as product from './bot-product.mjs'

export * from './router-core.mjs'
// Preserve the existing Cordis ID and storage namespace across the package rename.
export const inject = [...new Set([...product.inject, ...routerInject])]
export const Config = createRouterConfig(product.configFields)
export function apply(ctx, config = {}) { return applyRouter(ctx, config, product) }
```

**依据 4 · 源码核查**：[packages/model-router-plugin/cordis.patch.yml:1-4](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/model-router-plugin/cordis.patch.yml#L1-L4)

纯路由 package 使用同一 Cordis ID。

```text
# Routing workbench only. The stable ID preserves existing router settings.
- insert:
    - id: model-router-galgame
      name: '@ljwei-stak/dsh-model-router'
```

**依据 5 · 源码核查**：[.dsh-plugin/router-only.mjs:1-2](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/router-only.mjs#L1-L2)

纯路由入口只导出核心。

```text
/** Routing workbench only. No Bot product hooks, schema or services are loaded. */
export * from './router-core.mjs'
```

**依据 6 · 作者声明**：[README.zh.md:23-30](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/README.zh.md#L23-L30)

作者说明两个包的目标用户与同 profile 互斥。

```text
## 选择适合的工作区

| 版本 | 在「插件 → 添加插件」中输入 | 安装内容 |
| --- | --- | --- |
| **DSH Bot + 模型路由** | `@ljwei-stak/dsh-model-route-bot` | 完整 Bot 工作区、模型路由工作台、Bot 分工、远程电脑、私有资料库与例行任务。 |
| **模型路由** | `@ljwei-stak/dsh-model-router` | 在 Harness 原有界面增加「模型路由」入口，提供路线规划、工具、执行与核算，不安装 DS Bot。 |

同一个 Harness profile **选择一种版本**。两者共用路由配置；切换时，在插件管理中移除原包入口，再在同一 profile 添加另一个版本，保留数据目录并沿用已配置的 Bot home。[纯路由版本操作说明](packages/model-router-plugin/README.zh.md)。
```

**依据 7 · 作者声明**：[docs/releases/0.66.4/publication.json:29-37](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/docs/releases/0.66.4/publication.json#L29-L37)

作者记录真实宿主的挂载及引导未通过，证据范围停在面板前。

```text
  "installedInto": {"profile": "C:/Users/Jianw/.dsh/profiles/desktop", "from": "0.66.3", "to": "0.66.4", "verified": ["installed 0.66.4"]},
  "alsoClosedThisRound": [
    "Remote Agent rebuild is byte-identical (nothing to release); Windows desktop helpers compile with recorded SHA256 a1b66f2b… and d09eeb89…",
    "GitHub rendering of both READMEs verified through GitHub's own API, not a local approximation",
    "The router-only edition mounts in a real Host: 71 plugin descriptors, its 969 KB client bundle served, no Bot product API (404)"
  ],
  "notVerified": [
    "The router-only edition's routing panel itself was never opened: the fixture Host cannot persist the onboarding acknowledgement that gates it ('暂时无法保存确认状态'). Composition, mounting and the edition boundary are verified; the panel contents are not.",
    "Windows has no MSI/NSIS installer in this repo; the install entry point is deploy/remote-agent/install-windows.ps1."
```

#### 缺口

- 缺少用户侧两个发行包各自的安装、引导、面板和卸载验收
  **影响**：无法把某个作者环境的挂载扩展为普遍可用
  **进一步探讨**：用各自隔离 profile 复核安装、打开面板、只读任务和禁用

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 规划与真实模型调用之间有什么约束，相比手工分派有何增量？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

路由工具接受准确的已配置 provider/model，显式指定二者可以绕过推荐，手工分配依赖工作包时也能绑定指定工具。工作台启动会重新准备预览，根据本次原因检查确认项，普通启动才交给执行服务。对照在若干 CLI 之间手工传递前序产物，插件把工作包、选路理由、权限确认与结果放入同一任务视图，操作者可以检查选错路线的环节。

自动规划对视觉任务剔除明确不支持图像的行，模态未知仍可能进入候选。它按任务估计质量，若没有达到门槛的路线，会保留若干相对更好的候选并标记放宽。有依赖时保留路线差异，避免本地候选裁剪抹掉后续交接收益，再以候选上限和 beam 宽度换求解资源。质量来源可以是任务基准、用户值或启发式目录，历史目录价格不直接当账单。对于评分先验偏离团队任务或图片能力未知的模型，预览仍要人工判断。另一路咨询实现使用宿主 ctx.llm.stream 接收输出、用量和结束原因，遇字符上限主动中止。源码支持受控调用与回执分类，没有保证模型选择比固定强模型更准确。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/router-core.mjs:2111-2127](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/router-core.mjs#L2111-L2127)

执行重新预检并拒绝未确认风险，演练不启动调用。

<details>
<summary>查看原文（17行）</summary>

```text
/** Execute from the workbench; refuses until every current reason is in confirmedReasons. */
export async function startWorkbenchRun(ctx, config, supplied = {}, options = {}) {
  const prepared = await prepareWorkbenchPreview(ctx, config, supplied, options)
  return refusedWorkbenchStart(prepared) ?? executePreparedWorkbenchRun(ctx, config, prepared, options)
}

function refusedWorkbenchStart({ preview, request }) {
  if (preview.status === 'blocked') return preview
  const confirmed = new Set(request.confirmedReasons ?? [])
  const missing = preview.reasons.filter(item => !confirmed.has(item.code))
  return missing.length ? { ...preview, status: 'needs-confirmation', reasons: preview.reasons,
    missing: missing.map(item => item.code) } : null
}

/**
 * A rehearsal reports the work it would have handed out, without calling a model or a tool.
 * Every field comes from the already-computed preview, so nothing new is decided here.
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/router-core.mjs:2644-2681](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/router-core.mjs#L2644-L2681)

模型工具真实注册并接入按已配置路线执行。

<details>
<summary>查看原文（38行）</summary>

```text
  registerPolicyTool(ctx, config, defineTool({
    name: 'model_router_execute',
    description: 'Run a task on configured models and aggregate the results. Omit provider and model to route first. Supply both to use that one model and skip routing. With assignmentMode manual, use the packagePlanKey from model_router_plan and packageAssignmentsJson to pin each package to an exact API route or registered official tool. Manual tool failures do not fall back to API. Automatic profiles retain CLI/API billing policy. This call is read-only and does not apply file edits.',
    parameters: {
      task: { type: 'string', required: true, description: 'Task to execute.' },
      provider: { type: 'string', description: 'Configured provider. Pair with model to bypass routing.' },
      model: { type: 'string', description: 'Configured model. Pair with provider to bypass routing.' },
      planMode: { type: 'string', enum: ['single', 'team'], description: 'Used only when provider and model are omitted.' },
      assignmentMode: { type: 'string', enum: ['algorithm', 'manual'], description: 'Use algorithm recommendations, or pin every decomposed package to the user-selected API model or official tool.' },
      packagePlanKey: { type: 'string', description: 'Required for manual mode: the current decomposition key returned by model_router_plan for the same task and mode.' },
      packageAssignmentsJson: { type: 'string', description: 'Required for manual mode: JSON object keyed by every package id, values {kind:"api",provider,model} or {kind:"tool",toolId}. Tools use their configured default model. No commands or arguments.' },
      budgetUsd: { type: 'number', description: 'Optional local estimate ceiling when routing. Not a vendor billing cap.' },
      preset: { type: 'string', enum: ['economy', 'balanced', 'quality'], description: 'Optional routing preset for this call; defaults to the saved setting.' },
      confirmOverBudget: { type: 'boolean', description: 'Set only after the user agreed to exceed the daily/monthly budget. Triggers an approval prompt.' },
    },
    output: JSON_OUTPUT,
    async execute(args, exec) {
      const { cwd } = await sessionWorkspace(ctx, exec)
      const configuredBudget = valueOf(config, 'budgetUsd', DEFAULT_ROUTER_SETTINGS.budgetUsd)
      let assignments
      if (args.packageAssignmentsJson !== undefined) {
        if (typeof args.packageAssignmentsJson !== 'string' || args.packageAssignmentsJson.length > 32_000) throw new Error('工作包分配 JSON 超出限制。')
        try { assignments = parsePackageAssignments(JSON.parse(args.packageAssignmentsJson)) }
        catch { throw new Error('工作包分配 JSON 无效；请按包 ID 提供模型 API 或官方工具目标。') }
      }
      const result = await executeConfiguredAssignment(ctx, args.task, config, {
        provider: args.provider,
        model: args.model,
        planMode: args.planMode,
        assignmentMode: args.assignmentMode,
        ...(assignments === undefined ? {} : { packageAssignments: assignments }),
        ...(args.packagePlanKey === undefined ? {} : { packagePlanKey: args.packagePlanKey }),
        preset: args.preset,
        budgetUsd: finiteNumber(args.budgetUsd, finiteNumber(configuredBudget, 0)),
        confirmOverBudget: args.confirmOverBudget === true,
        workspace: cwd,
        signal: exec.signal,
      })
```

</details>

**依据 3 · 源码核查**：[.dsh-plugin/shared/router.mjs:833-856](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/router.mjs#L833-L856)

候选的模态与质量筛选以及放宽条件。

<details>
<summary>查看原文（24行）</summary>

```text
function eligibleRowsForTask(rows, task) {
  const eligible = task.type === 'vision'
    ? rows.filter(row => row.inputModalities.length === 0 || row.inputModalities.includes('image'))
    : rows
  return eligible.flatMap(row => taskActions(row, task))
}

function candidatePool(rows, task, weights, text, complexity, cacheReadRatio, cacheWriteRatio, dependencySensitive = false) {
  const eligibleRows = eligibleRowsForTask(rows, task)
  const floor = Number(task.qualityFloor ?? 0)
  const feasible = eligibleRows.filter(row => qualityForTask(row, task.type) >= floor)
  const source = feasible.length > 0
    ? feasible
    : eligibleRows.slice().sort((left, right) => qualityForTask(right, task.type) - qualityForTask(left, task.type) || compareRowsStable(left, right)).slice(0, 3)
  const taskWeights = weightsForTask(weights, task)
  const scored = source.map(row => ({
    row,
    decision: candidateUtility(row, task, taskWeights, cacheReadRatio, cacheWriteRatio, text, complexity),
    cost: taskCost(row, task, text, complexity, cacheReadRatio, cacheWriteRatio),
  }))
  // Local dominance is unsafe when route identity changes a later handoff.
  // Even without dependencies, a pruning proof must preserve actual utility
  // (including route-specific preferences), not just nominal score axes.
  const frontier = dependencySensitive ? scored : scored.filter(item => !scored.some(other => other !== item
```

</details>

**依据 4 · 源码核查**：[.dsh-plugin/shared/router.mjs:859-900](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/router.mjs#L859-L900)

保留价格、质量等锚点，有限候选和 beam 求解带依赖分派。

<details>
<summary>查看原文（42行）</summary>

```text
  const essential = [
    scored.filter(item => item.row.pricing !== null).sort((left, right) => left.cost - right.cost || compareRowsStable(left.row, right.row))[0],
    scored.slice().sort((left, right) => right.decision.score - left.decision.score || compareRowsStable(left.row, right.row))[0],
    scored.slice().sort((left, right) => qualityForTask(right.row, task.type) - qualityForTask(left.row, task.type) || compareRowsStable(left.row, right.row))[0],
  ].filter(Boolean)
  const all = [...frontier, ...essential]
    .filter((item, index, all) => all.findIndex(candidate => candidate.row === item.row) === index)
    .sort((left, right) => right.decision.score - left.decision.score || left.cost - right.cost || compareRowsStable(left.row, right.row))
  const anchors = [...new Set(essential)]
  // Reserve anchors before truncation: adding expensive high-score routes
  // must never remove the only budget-feasible, quality-eligible candidate.
  const ordered = [...anchors, ...all.filter(item => !anchors.includes(item))]
    .slice(0, ROUTING_CANDIDATE_LIMIT)
    .sort((left, right) => right.decision.score - left.decision.score || left.cost - right.cost || compareRowsStable(left.row, right.row))
  return {
    options: ordered,
    relaxed: feasible.length === 0,
    pruned: Math.max(0, scored.length - all.length),
    filtered: Math.max(0, eligibleRows.length - source.length),
    truncated: Math.max(0, all.length - ordered.length),
    dependencySensitive,
  }
}

function solveAssignments({ rows, tasks, weights, text, complexity, budget, cacheReadRatio, cacheWriteRatio, minimizeCost = false }) {
  const dependencySensitive = tasks.some(task => (task.dependsOn ?? []).length > 0)
  const pools = tasks.map(task => candidatePool(rows, task, weights, text, complexity, cacheReadRatio, cacheWriteRatio, dependencySensitive))
  const result = solveCandidateAssignments({ tasks, pools: pools.map((pool, index) => pool.options.map(option => ({
    route: routeKey(option.row.provider, option.row.model), score: option.decision.score, cost: option.cost,
    actionId: option.row.actionId, handoffRoute: routeKey(option.row.provider, option.row.model),
    qualityShortfall: Math.max(0, option.decision.floor - qualityForTask(option.row, tasks[index].type)),
    pricingKnown: option.row.pricing !== null, payload: option,
  }))), budget, beamWidth: ROUTING_BEAM_WIDTH, minimizeCost })
  if (!result) return null
  return {
    ...result,
    assignments: result.choices.map((choice, index) => ({ task: tasks[index], row: { ...choice.payload.row, estimatedCost: choice.payload.row.pricing === null ? null : choice.cost },
      decision: { ...choice.payload.decision, relaxed: choice.qualityShortfall > 0 },
      estimatedCost: choice.cost, handoffPenalty: choice.handoffPenalty })),
    usedRoutes: new Set(result.choices.map(choice => choice.route)),
    candidatePools: pools,
    minimumFeasibleCost: result.minimumCostLowerBound,
```

</details>

**依据 5 · 源码核查**：[.dsh-plugin/shared/router.mjs:950-975](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/router.mjs#L950-L975)

质量来源分开，价格按已配置资料，避免目录历史价格冒充账单。

<details>
<summary>查看原文（26行）</summary>

```text
    const catalog = modelMetadata(route.model)
    const metadata = {
      ...(catalog ?? { id: route.model, aliases: [route.model], specialties: [] }),
      ...(route.quality === undefined ? {} : { quality: route.quality }),
      ...(route.latency === undefined ? {} : { latency: route.latency }),
      ...(route.risk === undefined ? {} : { risk: route.risk }),
      ...(route.specialties === null ? {} : { specialties: route.specialties }),
    }
    const live = liveBenchRow(liveBench, route.benchmarkModel ?? route.model)
    const liveScores = live?.scores ?? {}
    // A category average cannot provide evidence for an unmeasured task.
    // Legacy cached category rows have no provenance: use their task scores
    // but do not promote an ambiguous overall to cross-task evidence.
    const liveOverall = live?.overallSource === 'explicit' || (live?.overallSource === undefined && Object.keys(liveScores).length === 0)
      ? asScore(live?.overall) : undefined
    const baseQuality = asScore(metadata.quality) ?? 0
    const quality = clamp((asScore(liveScores?.[taskType]) ?? liveOverall ?? baseQuality) + route.qualityBias)
    const fallbackQualitySource = route.quality !== undefined ? route.qualitySource : catalog ? 'catalog-heuristic' : 'unknown'
    const qualitySource = liveOverall !== undefined || asScore(liveScores?.[taskType]) !== undefined
      ? 'livebench' : route.quality !== undefined ? route.qualitySource : catalog ? 'catalog-heuristic' : 'unknown'
    const userPrice = normalizedPrices[normalize(`${route.provider}/${route.model}`)] ?? normalizedPrices[normalize(route.model)]
    // Catalog price numbers are historical hints, not a verified billable
    // price for a user's provider account. A cost claim needs supplied USD
    // prices for the exact configured route.
    const pricingRow = userPrice ?? route.pricing ?? null
    const pricingSource = userPrice ? 'user' : route.pricing ? route.pricingSource : 'unknown'
```

</details>

**依据 6 · 源码核查**：[.dsh-plugin/router-core.mjs:664-709](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/router-core.mjs#L664-L709)

咨询路径用流读取输出、结束原因和用量，保留未知用量并有主动中止边界。

<details>
<summary>查看原文（46行）</summary>

```text
  let answer = ''
  let characterLimitReached = false
  let finish = { kind: 'unknown' }
  let usage = null
  let usageIncomplete = false
  try {
    const stream = ctx.llm.stream({
      provider,
      model,
      messages: [{
        role: 'user',
        content: [{
          type: 'text',
          text: messageText,
        }],
      }],
      maxTokens: Math.min(4_096, Math.max(256, Math.ceil(limit / 2))),
      signal: controller.signal,
      ...reasoning.options,
    })
    for await (const chunk of stream) {
      if (chunk?.type === 'text-delta' && typeof chunk.text === 'string') {
        const remaining = limit - answer.length
        if (remaining > 0) answer += chunk.text.slice(0, remaining)
        if (chunk.text.length > remaining) {
          characterLimitReached = true
          controller.abort(new Error('consultation output limit reached'))
          break
        }
      } else if (chunk?.type === 'usage' && chunk.usage && typeof chunk.usage === 'object') {
        usage = {}
        usageIncomplete = false
        for (const key of ['inputTokens', 'outputTokens', 'cacheReadTokens', 'cacheWriteTokens']) {
          if (typeof chunk.usage[key] === 'number' && Number.isFinite(chunk.usage[key]) && chunk.usage[key] >= 0) usage[key] = chunk.usage[key]
          else if (Object.hasOwn(chunk.usage, key) || ['inputTokens', 'outputTokens'].includes(key)) usageIncomplete = true
        }
      } else if (chunk?.type === 'finish') {
        const reason = chunk.reason
        finish = { kind: text(reason?.kind) || 'unknown' }
        if (finish.kind === 'error' || finish.kind === 'aborted') {
          finish.error = text(reason?.failure?.message) || 'model request failed'
        }
      }
    }
  } catch (error) {
    finish = { kind: signal?.aborted ? 'aborted' : 'error', error: String(error?.message ?? error).slice(0, 2_000) }
```

</details>

#### 缺口

- 没有对同批实际任务的质量评分校准或路由对照
  **影响**：无法判断自动路由是否提高合格率
  **进一步探讨**：保留固定路线组与自动组，在同预算内按盲评验收结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预算预占、费用未知和厂商扣费分别能约束什么？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

工作台 API 预占在状态更新中合并已记账费用和已有预留，检查历史缺失、重复 run、容量和估算超额，再写入带所有权标记的预占与执行记录。通常超额或未知预算需要明确确认。检查点会核对所有权及工作包是否已预留。中断时，已起步却没有费用回执的工作包保留 ran、空金额和中断状态，后续排查仍能看到占用和不确定性。完整 Bot 的托管资金入口还有更严格分支，在估算未知、适用的账号、项目或 Bot 额度存在未核对用量，或合计超过上限时拒绝。两类入口的准入语义应按实际使用路径分别理解。

这些是宿主准入和记账。用户仍需提供实际路由单价、账号计费类型，并核对厂商用量。供应商可能接受请求后断连，取消状态与拒绝日志都无法单独决定是否扣费。订阅 CLI 路线也不能按 API token 单价推算。首次投入包括维护路由、价格、工作区和工具登录，持续成本包括推理及可能的再次执行，故障恢复还需人工核对外部账单。单位应为一次通过任务验收、可追溯账单的工作包，人工时间与美元分别计量。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:149-179](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/budget-reservations.mjs#L149-L179)

把当前预算判断、所有权和预占在同一更新中处理。

<details>
<summary>查看原文（31行）</summary>

```text
    if (!identifier(ownerToken)) throw new TypeError('需要有效的执行所有权标记。')
    const packages = normalizedEstimates(options.packageEstimates, run)
    return update(current => {
      const checks = currentBudget(current, now(), packages, options)
      if (current.historyIncomplete && checks.budget.apiExposure) return { accepted: false, reason: 'history-incomplete', ...checks }
      current.budgetReservations ??= {}
      if (current.budgetReservations[run.id]) return { accepted: false, reason: 'active-run', ...checks }
      if (Object.keys(current.budgetReservations).length >= maxReservations) return { accepted: false, reason: 'reservation-capacity', ...checks }
      if (checks.budget.exceeded && options.confirmOverBudget !== true) return { accepted: false, reason: 'budget', ...checks }
      if (checks.unknownBudget && options.confirmOverBudget !== true) return { accepted: false, reason: 'budget-unknown', ...checks }
      const funding=fundingCheck({current,run,packages})
      if(funding)return {...checks,...funding}
      const at = now()
      const entry = { id: run.id, runId: run.id, ownerToken, ownerPid: pid, status: 'active',
        createdAt: at, updatedAt: at, packages, completedIds: [] }
      current.budgetReservations[run.id] = entry
      upsertRun(current, run)
      return { accepted: true, reservationId: entry.id, ownerToken, run, ...checks }
    })
  }
  const checkpointExecution = ({ reservationId, ownerToken, run: nextRun, completedIds = [], startedIds = [],
    checkBudget = false, budgetRun: affordabilityRun, ...options }) => {
    const run = checkedRun(nextRun, reservationId)
    const budgetRun = affordabilityRun === undefined ? run : checkedRun(affordabilityRun, reservationId)
    if (![completedIds, startedIds].every(ids => Array.isArray(ids) && ids.every(identifier))) throw new TypeError('检查点工作包 ID 无效。')
    return update(current => {
      const entry = ownedReservation(current, reservationId, ownerToken)
      const completed = new Set([...entry.completedIds, ...completedIds])
      const started = new Set(startedIds)
      const known = new Set([...entry.completedIds, ...entry.packages.map(item => item.id)])
      if ([...completed, ...started].some(id => !known.has(id))) throw new TypeError('检查点包含未预占的工作包。')
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:243-265](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/budget-reservations.mjs#L243-L265)

已开始未收到用量的中断状态不会变成已知零费用。

<details>
<summary>查看原文（23行）</summary>

```text
    entry.status = 'interrupted'
    entry.interruptedAt = at
    entry.updatedAt = at
    if (run) {
      run.status = 'interrupted'
      run.finishedAt = at
      for (const pending of entry.packages.filter(item => item.started)) {
        const item = [...run.packages, ...(run.reviews ?? [])].find(item => item.id === pending.id)
        if (!item || (!item.inFlight && !['pending', 'running'].includes(item.status))
          || amount(item.costUsd) || amount(item.knownCostUsd) || Array.isArray(item.qualityAttempts)) continue
        // We know a request began, but never observed its receipt. Keep that
        // uncertainty in the ledger as well as the durable estimate hold.
        item.status = 'interrupted'
        item.inFlight = false
        item.ran = true
        item.costUsd = null
        item.costSource = 'interrupted-usage-unknown'
        item.billing = pending.billing === 'subscription' || item.billing === 'subscription' ? 'subscription' : 'api'
        item.finishedAt = at
      }
      run.interruption = { at, unreconciled: true, pendingPackageIds: entry.packages.map(item => item.id),
        startedPackageIds: entry.packages.filter(item => item.started).map(item => item.id) }
    } else current.historyIncomplete = true
```

</details>

**依据 3 · 源码核查**：[packages/orchestration/src/funding-admission.mjs:8-35](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/funding-admission.mjs#L8-L35)

完整 Bot 托管资金对估算、未知用量及分层上限作硬拒绝。

<details>
<summary>查看原文（28行）</summary>

```text
export function assessFundingAdmission({store,state,botId,scopeId=null,projectId=null,policy,estimatedCostUsd,excludeRunId=null,previousRun=null,prospectiveRun=null,now=Date.now()}){
  if(!valid(estimatedCostUsd))return {accepted:false,reason:'funding-estimate-unknown'}
  const definitions=[
    {name:'bot',query:{botId},daily:policy.botDailyLimitUsd,monthly:policy.botMonthlyLimitUsd,match:owner=>owner.botId===null||owner.botId===botId},
    {name:'account',query:{scopeId},daily:policy.accountDailyLimitUsd,monthly:policy.accountMonthlyLimitUsd,match:owner=>owner.scopeId===null||owner.scopeId===scopeId},
    {name:'project',query:{projectId},daily:policy.projectDailyLimitUsd,monthly:policy.projectMonthlyLimitUsd,match:owner=>owner.projectId===null||owner.projectId===projectId},
  ]
  const checked=[]
  const old=previousRun?spending([previousRun],now):null,next=previousRun&&prospectiveRun?spending([prospectiveRun],now):null
  for(const entry of definitions){
    const limits=[['today','daily',entry.daily],['month','monthly',entry.monthly]].filter(([, ,value])=>value!==undefined&&value!==null)
    if(!limits.length)continue
    if(limits.some(([, ,value])=>!valid(value))||entry.name==='account'&&!scopeId||entry.name==='project'&&!projectId)fail('INVALID_FUNDING_POLICY')
    const totals=store.fundingTotals({...entry.query,at:now,includeUnassigned:true})
    const holds=Object.fromEntries(Object.entries(state.budgetReservations??{}).filter(([id,hold])=>{
      if(id===excludeRunId)return false
      const run=state.runs.find(value=>value.id===hold.runId)
      return !run||entry.match(store.fundingIdentity(run))
    }))
    const reserved=reservationSpending({budgetReservations:holds})
    for(const [period,label,limit] of limits){
      const unknownKey=period==='today'?'unknownToday':'unknownMonth'
      const unknown=totals[unknownKey]+(next?next[unknownKey]-old[unknownKey]:0)
      if(unknown>0||reserved[unknownKey]>0)return {accepted:false,reason:`${entry.name}-${label}-usage-unknown`,scope:entry.name}
      const spent=totals[period]+(next?next[period]-old[period]:0),required=spent+reserved[period]+estimatedCostUsd
      // No absolute epsilon: it would turn a zero cap into a small paid budget.
      if(!Number.isFinite(required)||required<0||required>limit)return {accepted:false,reason:`${entry.name}-${label}-limit`,scope:entry.name,limitUsd:limit,spentUsd:spent,reservedUsd:reserved[period]}
    }
```

</details>

**依据 4 · 源码核查**：[packages/orchestration/src/funded-router-state.mjs:12-41](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/funded-router-state.mjs#L12-L41)

托管资金限制为有报价的单个 API 工作包，并重验调用能力及身份。

<details>
<summary>查看原文（30行）</summary>

```text
  const configuration=async(execution=true)=>{
    const identity=policy.activeIdentity()
    if(!identity)return null
    if(identity.owner){if(execution)fail('OWNER_EXECUTION_FACADE_REQUIRED');return null}
    const config=structuredClone(await pricingFor({botId:identity.botId}))
    if(!config?.route?.provider||!config.route.model||config.funding!=='api'||!config.pricing||!positive(config.maxInputTokens)||!positive(config.maxOutputTokens))fail('MR_API_FUNDING_REQUIRED')
    for(const field of ['input','output','cacheRead','cacheWrite'])if(config.pricing[field]!==undefined&&(!Number.isFinite(config.pricing[field])||config.pricing[field]<0))fail('MODEL_PRICE_REQUIRED')
    if(config.pricing.input===undefined||config.pricing.output===undefined)fail('MODEL_PRICE_REQUIRED')
    authority.assertModel(identity.subject,config.route.provider,config.route.model);authority.assertTool(identity.subject,'model/infer')
    return{identity,config,hash:taskHash(config)}
  }
  const prepareExecutionFunding=async({packageEstimates,managedExecution})=>{
    const prepared=await configuration()
    if(!prepared)return null
    if(policy.financialRunActive())fail('FINANCIAL_CALL_ALREADY_ACTIVE')
    if(packageEstimates.length!==1||packageEstimates[0].billing==='subscription')fail('FUNDING_SINGLE_API_PACKAGE_REQUIRED')
    const {identity,config,hash}=prepared,task=managedExecution?.binding
    const marker={schemaVersion:1,botId:identity.botId,attemptId:task?.attemptId??`funding-${randomUUID()}`,operationId:task?.operationId??`operation-${randomUUID()}`,policyHash:hash,
      ...(config.scopeId?{fundingScopeId:config.scopeId}:{}),...(config.projectId?{fundingProjectId:config.projectId}:{})}
    const estimate=(config.maxInputTokens*config.pricing.input+config.maxOutputTokens*config.pricing.output)/1e6
    if(!Number.isFinite(estimate))fail('MODEL_ESTIMATE_REQUIRED')
    const adapted={...store,checkExecutionFunding:({current,run,packages,excludeRunId=null,previousRun=null})=>{
      authority.assertTool(identity.subject,'model/infer');authority.assertModel(identity.subject,config.route.provider,config.route.model)
      if(taskHash(run?.fundingExecution??null)!==taskHash(marker))fail('FUNDING_RUN_IDENTITY_CONFLICT')
      const total=packages.reduce((sum,item)=>sum+(item.estimatedCostUsd??NaN),0)
      return assessFundingAdmission({store,state:current,botId:identity.botId,scopeId:config.scopeId,projectId:config.projectId,policy:config,estimatedCostUsd:total,excludeRunId,previousRun,prospectiveRun:run,now:now()})
    }}
    return{state:adapted,packageEstimates:[{...packageEstimates[0],billing:'api',estimatedCostUsd:estimate}],
      stamp(run){run.fundingExecution={...marker};return run},
      bind(binding){policy.bindFinancialRun({...binding,...marker,taskId:task?.taskId??null,config})},
```

</details>

**依据 5 · 源码核查**：[.dsh-plugin/router-core.mjs:2644-2657](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/router-core.mjs#L2644-L2657)

本地预算参数由工具接口标明为估算。

<details>
<summary>查看原文（14行）</summary>

```text
  registerPolicyTool(ctx, config, defineTool({
    name: 'model_router_execute',
    description: 'Run a task on configured models and aggregate the results. Omit provider and model to route first. Supply both to use that one model and skip routing. With assignmentMode manual, use the packagePlanKey from model_router_plan and packageAssignmentsJson to pin each package to an exact API route or registered official tool. Manual tool failures do not fall back to API. Automatic profiles retain CLI/API billing policy. This call is read-only and does not apply file edits.',
    parameters: {
      task: { type: 'string', required: true, description: 'Task to execute.' },
      provider: { type: 'string', description: 'Configured provider. Pair with model to bypass routing.' },
      model: { type: 'string', description: 'Configured model. Pair with provider to bypass routing.' },
      planMode: { type: 'string', enum: ['single', 'team'], description: 'Used only when provider and model are omitted.' },
      assignmentMode: { type: 'string', enum: ['algorithm', 'manual'], description: 'Use algorithm recommendations, or pin every decomposed package to the user-selected API model or official tool.' },
      packagePlanKey: { type: 'string', description: 'Required for manual mode: the current decomposition key returned by model_router_plan for the same task and mode.' },
      packageAssignmentsJson: { type: 'string', description: 'Required for manual mode: JSON object keyed by every package id, values {kind:"api",provider,model} or {kind:"tool",toolId}. Tools use their configured default model. No commands or arguments.' },
      budgetUsd: { type: 'number', description: 'Optional local estimate ceiling when routing. Not a vendor billing cap.' },
      preset: { type: 'string', enum: ['economy', 'balanced', 'quality'], description: 'Optional routing preset for this call; defaults to the saved setting.' },
      confirmOverBudget: { type: 'boolean', description: 'Set only after the user agreed to exceed the daily/monthly budget. Triggers an approval prompt.' },
```

</details>

#### 缺口

- 没有并发、取消或厂商扣费对照的同版本执行记录
  **影响**：不能确认账单偏差与维护工时是否会抵消路由收益
  **进一步探讨**：人为制造断连，对照宿主预留、模型 receipt、厂商账单及人工处理时间

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 完整 Bot 如何派发持久任务，哪些故障仍需授权对账？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

完整版的任务编排由产品组合挂载模型、Bot turn 和远端后端。路由可由人指定 Bot，但仍走工具、机器和在线等资格检查，未提交机器授权时拒绝为普通执行 Bot 建立对应远端计划。计划可带验收要求、会话和目标信息。任务服务在执行前取得绑定到任务、尝试和目标的能力租约，在 journal 打开派发后才调用后端，并向后端提供执行引用检查点。失败若伴随已知执行引用却无结果，或原子准入无法证明未派发，保留未知结果。旧 runner 完成被拒会触发停止。对账入口仅受理待对账任务，检查主体、目标、能力、重放键和进行中状态，再在短租约下调用后端观察。

这比进程退出即重跑提供了更可核对的边界，但撤销本地租约只能制约实现相应协议的后端；远端是否接到命令、是否部分完成仍需对账。作者也明确说原生 CLI 进程使用当前系统用户权限，工作树用于归集改动。把权限限制完全交给工作树或 UI 状态会夸大隔离。完整版应另核查旧进程与远端操作，不因纯路由版作者挂载成功而推定迁移或远端安全。

#### 证据与依据

**依据 1 · 源码核查**：[packages/orchestration/src/bot-routing-dispatch.mjs:123-153](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/bot-routing-dispatch.mjs#L123-L153)

显式指定 Bot 仍走硬条件和授权确认。

<details>
<summary>查看原文（31行）</summary>

```text
  // A person may pin a Bot; the pin still passes the same hard requirements as an automatic pick,
  // so a disabled, unbound or unreachable Bot is refused by name instead of receiving work.
  if (typeof pinnedBotId === 'string' && pinnedBotId !== '') {
    const pinned = eligible.find(candidate => candidate?.botId === pinnedBotId)
    // The machine question is asked first, because "no grant for this machine" is the actionable
    // answer and the generic eligibility would only report the machine as offline.
    if (pinned) {
      const machineRefusal = pinnedMachineRefusal(pinned, focus)
      if (machineRefusal) fail(`BOT_ROUTING_PINNED_INELIGIBLE:${pinnedBotId}:${machineRefusal}`)
    }
    const reason = pinned ? botRejection(withMachineFact([pinned], focus)[0], focus) : null
    if (!pinned || reason) {
      const refusal = routeBot({ task: focus, candidates: withMachineFact(eligible, focus), preset: settings.preset })
      const known = refusal.rejected.find(row => row.botId === pinnedBotId)?.reason ?? reason ?? 'BOT_ROUTING_PINNED_UNKNOWN'
      fail(`BOT_ROUTING_PINNED_INELIGIBLE:${pinnedBotId}:${known}`)
    }
    const grant = workerMachineGrant(pinned, focus)
    if (grant?.refused) fail(grant.refused)
    // The Main Bot keeps everything it already had, pinned or not: routing must not re-grant or
    // narrow it, so its binding is reported as nothing rather than as a new grant.
    if (mainBotKeepsFullAccess(pinned.botId, mainBotIds)) {
      return { botId: pinned.botId, preset: settings.preset, pinned: true, binding: null, granted: false, decision: { chosen: { botId: pinned.botId }, ranked: [], rejected: [], reason: 'PINNED' }, mainBot: true }
    }
    const binding = grant ? bindingFor(pinned, grant, focus) : null
    if (focus.requiresMachine === true && !binding) fail('BOT_ROUTING_WORKER_CANNOT_REACH_MACHINE')
    const confirmed = await confirmBinding(binding, bindWorker, settings, { ...grantContext, requesterBotId })
    return {
      botId: pinned.botId, preset: settings.preset, pinned: true, binding,
      granted: confirmed.applied, bindingConfirmed: confirmed.confirmed,
      grant: workerGrantFact(binding, settings.autoGrant.machineTools, confirmed.applied),
      decision: { chosen: { botId: pinned.botId }, ranked: [], rejected: [], reason: 'PINNED' },
```

</details>

**依据 2 · 源码核查**：[packages/orchestration/src/bot-routing-dispatch.mjs:351-378](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/bot-routing-dispatch.mjs#L351-L378)

目标授权缺失时阻止创建远端计划，记录范围和验收要求。

<details>
<summary>查看原文（28行）</summary>

```text
export async function dispatchRoutedTask({
  routing, mainBotIds = [], requesterBotId = '', originBotId = '', task = {}, candidatesFor, bindWorker = null,
  submitPlan, subjectFor = null, requestKey = '', newTaskId = () => `task-${randomUUID()}`, caller = {},
  settle = null, deliver = null, pinnedBotId = '', grantContext = {}, executionBackend = null,
} = {}) {
  if (typeof submitPlan !== 'function') fail('ROUTING_REQUIRES_SUBMIT')
  if (typeof subjectFor !== 'function') fail('ROUTING_REQUIRES_SUBJECT')
  const focus = { ...task, requiredTools: Array.isArray(task.requiredTools) ? task.requiredTools : [] }
  const effectClass = routedEffectClass(focus)

  const routed = await routeTaskToBot({ routing, mainBotIds, requesterBotId, task: focus, candidatesFor, bindWorker, pinnedBotId, grantContext })
  const targetBotId = routed.botId
  const origin = originBotId !== '' ? originBotId : (requesterBotId !== '' ? requesterBotId : targetBotId)

  // A machine task whose grant was never committed must not become a plan: the worker would be
  // asked to reach a machine it cannot reach while the plan still looks accepted.
  if (focus.requiresMachine === true && routed.mainBot !== true && routed.bindingConfirmed !== true) {
    fail('BOT_ROUTING_WORKER_GRANT_REQUIRED')
  }

  const taskId = newTaskId()
  const plan = buildRoutedPlan({
    decision: routed.decision ?? { chosen: { botId: targetBotId } },
    text: focus.text, taskId, requesterBotId, originBotId: origin, sessionId: focus.sessionId ?? null,
    acceptance: Array.isArray(focus.acceptance) ? focus.acceptance : [], effectClass, executionBackend,
    executionTarget: focus.requiresMachine ? routed.binding ?? { machineId: focus.machineId, rootId: focus.rootId } : null,
  })
  const key = typeof requestKey === 'string' && requestKey !== '' ? requestKey : `route-${taskId}`
```

</details>

**依据 3 · 源码核查**：[packages/orchestration/src/product-composition.mjs:648-667](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/product-composition.mjs#L648-L667)

产品组合把远端、模型与 Bot 后端接到任务服务，并限制私有来源。

<details>
<summary>查看原文（20行）</summary>

```text
          cli: cliConfig?.entry ? { entry: cliConfig.entry, sessionFactory: cliSessionFactory ?? (await import('../../cli-runtime/src/codex-runtime.mjs')).createCodexSession } : null })
        const remoteWrite=createRemoteWriteBackend({machines:()=>machines,directory})
        const remoteCommand=createRemoteCommandBackend({machines:()=>machines,directory})
        turnBackends = createBotTurnBackends({ ctx, runtime: () => product?.rt, directory, authority, Database, storeFile: storageFile,
          bindingFor: botId => botSettings.get(botId, { publishChange: false }), machines: () => machines,
          readPlan: report => taskService.getPlan(directory.forBot(report.originBotId), { planId: report.planId }), now })
        if(cliConfig?.remote.length)remoteCliBackend=createRemoteCliReadBackend({machines:()=>machines,directory,store:funding.store,authority,profiles:cliConfig.remote,bindingFor:botId=>botSettings.get(botId,{publishChange:false})})
        const remoteBackends=[remoteWrite,remoteCommand,...(remoteCliBackend?[remoteCliBackend]:[])]
        taskBackends=Object.freeze({backends:Object.freeze([...modelBackends.backends,...remoteBackends]),catalog:()=>[...modelBackends.catalog(),...remoteBackends.map(backend=>({id:backend.id,version:backend.version,effect:backend.effect,location:'remote',capability:backend.capability,label:backend.id==='remote-codex-read'?'已授权远程官方 CLI 只读任务':backend.id==='remote-write'?'已授权远程文件写入任务':'已授权容器命令任务（仅别名argv）'}))]})
        taskService = createTaskService({ journal, authority, directory, backends: [...turnBackends.backends, ...taskBackends.backends],
          within: (subject, signal, work) => policy.executionContext(subject, signal, work),
          planTargetsFor: (subject,plan,caller) => {
            const id=authority.describe(subject).botId
            const bot=product?.lifecycle.committedBot(id)
            const privateSession=product?.rt.chatOf(id)??bot?.sessionId??bot?.id
            const privateCall=caller.owner===true||bot&&caller.sessionId===privateSession
            if(caller.sessionId!==undefined&&plan.origin.kind==='private'&&!privateCall)throw Object.assign(new Error('TASK_PLAN_ORIGIN_MISMATCH'),{code:'TASK_PLAN_ORIGIN_MISMATCH'})
            if(caller.owner===true&&plan.origin.kind==='private'&&plan.origin.sessionId!==null&&plan.origin.sessionId!==privateSession)throw Object.assign(new Error('TASK_PLAN_ORIGIN_MISMATCH'),{code:'TASK_PLAN_ORIGIN_MISMATCH'})
            return privateCall&&['private','handoff'].includes(plan.origin.kind)&&product?.lifecycle.committedMainBotIds().includes(id)?product.lifecycle.committedBots().map(bot=>bot.id):[id]
          },
```

</details>

**依据 4 · 源码核查**：[packages/orchestration/src/task-service.mjs:95-127](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/task-service.mjs#L95-L127)

能力租约绑定与 journal 派发、检查点真实接线。

<details>
<summary>查看原文（33行）</summary>

```text
    const timer=setTimeout(()=>controller.abort(new PolicyError('TASK_DEADLINE')),Math.max(1,task.deadlineAt-now()))
    try {
      if(backend.atomicAdmission===true)admission=journal.createAdmission(identity,task.ownerBotId,task.taskId,task.attemptId,now,()=>{
        controller.signal.throwIfAborted();executionSignal?.throwIfAborted();admit(subject,task.input)
      })
      decide('authorize',true,{effect:backend.effect,location:backend.location})
      try{
        lease=gate('execution/lease',()=>authority.issue(subject,{binding,tools:['task/execute',backend.capability],ttlMs:Math.max(1,Math.min(executionLeaseMs,task.deadlineAt-now()))}))
      }catch(error){decide('execution/lease',false,{code:error?.code??'LEASE_FAILED'});throw error}
      decide('execution/lease',true)
      renewal=setInterval(()=>{
        try{if(task.deadlineAt<=now())throw new PolicyError('TASK_DEADLINE');authority.renew(lease.token,binding,{ttlMs:Math.max(1,Math.min(executionLeaseMs,task.deadlineAt-now()))})}
        catch(error){controller.abort(error)}
      },Math.max(10,Math.floor(executionLeaseMs/3)));renewal.unref()
      result=await authority.run(lease.token,binding,backend.capability,({signal})=>within(subject,signal,async()=>{
        executionSignal=signal
        const run=()=>{
        // A delayed within/admission callback cannot dispatch after this
        // invocation has settled or after its authority was cancelled.
        if(backendClosed||backendStarted)fail('TASK_DISPATCH_CLOSED')
        signal.throwIfAborted()
        try{journal.beginDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now())}catch(error){decide('dispatch',false,{code:error?.code??'DISPATCH_REFUSED'});throw error}
        backendStarted=true;decide('dispatch',true)
        return backend.run({
        input:JSON.parse(canonicalTaskJson(task.input.input)),target:task.input.target,signal,binding,attemptNumber:task.attemptNumber,
        previous:task.attemptNumber>1?journal.get(task.ownerBotId,task.taskId).attempts.at(-2):null,
        legacyRunIds:task.legacyRunIds,
        operationId:task.operationId,targetHash:task.input.targetHash,
        ownerBotId:task.ownerBotId,
        checkpoint:reference=>admission?admission.checkpoint(reference):journal.linkExecution(identity,task.ownerBotId,task.taskId,task.attemptId,reference,now()),
        beforeAdmission:()=>admission?journal.assertPreparing(identity,task.ownerBotId,task.taskId,task.attemptId,now()):journal.assertDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now()),
        beforeRequest:()=>journal.assertDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now()),
        })}
```

</details>

**依据 5 · 源码核查**：[packages/orchestration/src/task-service.mjs:133-158](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/task-service.mjs#L133-L158)

未观察到已启动操作的结果时保留 unknown，并拦截过期 runner。

<details>
<summary>查看原文（26行）</summary>

```text
      if(!result||!['succeeded','failed','cancelled','unknown','waiting-budget'].includes(result.outcome))fail('INVALID_TASK_BACKEND_RESULT')
      canonicalTaskJson(result)
      outcome=result.outcome
    } catch(error) {
      backendClosed=true
      outcome=controller.signal.aborted||['GRANT_CHANGED','SUBJECT_REVOKED','LEASE_EXPIRED','AUTHORITY_CLOSED'].includes(error.code)?'cancelled':'failed'
      const hasReference=!!journal.get(task.ownerBotId,task.taskId).executionRef
      if(observedResult?.outcome==='unknown'||!observedResult&&hasReference)outcome='unknown'
      result={code:error instanceof PolicyError?error.code:'TASK_BACKEND_FAILED',
        ...(error?.gate?{gate:error.gate}:{}),
        ...(error?.rule?{rule:error.rule}:{}),
        ...(!backendStarted&&!hasReference?{notStarted:true}:{}),
        ...(observedResult?.legacyRunId?{legacyRunId:observedResult.legacyRunId}:{}),
        ...(observedResult?.summary?{summary:observedResult.summary}:{})}
    } finally {backendClosed=true;clearTimeout(timer);clearInterval(renewal);if(lease)authority.release(lease.token)}
    if(!backendStarted)journal.closeDispatch(identity,task.ownerBotId,task.taskId,task.attemptId,now())
    if(admission&&!admission.committed()){
      let proven=false;try{proven=admission.notDispatched()}catch{}
      if(!proven)outcome='unknown'
      else if(['unknown','succeeded'].includes(outcome))outcome=controller.signal.aborted?'cancelled':'failed'
      result={...result,admissionCommitted:false,notDispatched:proven}
    }
    decide('settle',true,{outcome,carriedOut:backendStarted})
    result={...result,authorization:Object.freeze({gates:Object.freeze(gates),carriedOut:backendStarted})}
    try {journal.finish(identity,task.ownerBotId,task.taskId,task.attemptId,outcome,result,now())}
    catch(error) {if(error.code==='STALE_TASK_RUNNER')stopRunner('STALE_TASK_RUNNER',{taskId:task.taskId,attemptId:task.attemptId});else{stopRunner(error?.code??'TASK_FINISH_FAILED',{taskId:task.taskId,attemptId:task.attemptId});throw error}}
```

</details>

**依据 6 · 源码核查**：[packages/orchestration/src/task-service.mjs:318-342](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/packages/orchestration/src/task-service.mjs#L318-L342)

对账需要目标和能力验证，不直接重跑。

<details>
<summary>查看原文（25行）</summary>

```text
    async reconcile(subject,request) {
      writable();const id=owner(subject,'task/reconcile'),parsed=parseTaskReconcile(request)
      const hash=taskHash({kind:'reconcile',taskId:parsed.taskId})
      const replay=journal.reconciliationReplay(identity,id,parsed.taskId,parsed.requestKey,hash,now())
      if(replay)return replay
      const task=journal.get(id,parsed.taskId),backend=registry.get(task.input.backend)
      if(task.state!=='needs-reconciliation')fail('TASK_RECONCILE_NOT_ALLOWED')
      if(!backend||typeof backend.reconcile!=='function'||!backend.reconcileCapability)fail('TASK_RECONCILER_UNAVAILABLE')
      const observeAllowed=backend.canObserve?backend.canObserve(subject,task.input.target,task.input.input):taskHash(target(backend))===task.input.targetHash
      if(!observeAllowed)fail('TASK_RECONCILER_UNAVAILABLE')
      authority.assertTool(subject,backend.reconcileCapability)
      const existing=observations.get(task.taskId)
      if(existing){if(existing.key!==parsed.requestKey)fail('TASK_RECONCILIATION_BUSY');return existing.work}
      if(observations.size>=4)fail('TASK_RECONCILIATION_BUSY')
      const controller=new AbortController()
      const work=(async()=>{
        const binding={taskId:task.taskId,attemptId:task.attemptId,machineId:task.input.target.machineId,workspaceId:task.input.target.workspaceId,location:task.input.target.location}
        let lease
        try{
          lease=authority.issue(subject,{binding,tools:['task/reconcile',backend.reconcileCapability],ttlMs:5000})
          const snapshot={taskId:task.taskId,attemptId:task.attemptId,operationId:task.operationId,input:{targetHash:task.input.targetHash}}
          const verdict=await authority.run(lease.token,binding,backend.reconcileCapability,({signal})=>backend.reconcile({task:snapshot,reference:task.executionRef,signal,ownerBotId:id}),{signal:controller.signal})
          canonicalTaskJson(verdict)
          const result=journal.reconcile(identity,id,task.taskId,task.attemptId,parsed.requestKey,hash,verdict,now());schedule();return result
        }finally{if(lease)authority.release(lease.token);observations.delete(task.taskId)}
```

</details>

**依据 7 · 作者声明**：[README.zh.md:110-120](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/README.zh.md#L110-L120)

作者明确工作树与系统用户权限的范围。

<details>
<summary>查看原文（11行）</summary>

```text
模型路由执行只读分析。需要修改文件时，选择 **团队分工 → 官方工具协作 → 编辑文件**，核对执行预览后启动。独立工作树用于归集改动，不限制工作树以外的系统访问。

<a id="official-tools"></a>
<a id="session-tools"></a>
<a id="team-lifecycle"></a>

### 使用各工具自己的账户与能力

工具注册表包含 **Kimi Code、Claude Code、Codex、MiniMax Code、MiMo Code、Grok Build、Gemini、OpenCode、StepCode、Pi、Hermes、ZCode 和 DSH TUI**。在 **官方工具** 中检测工具，选择可用安装方式，完成厂商登录，再检查所需执行模式的就绪状态。

交互终端提供已安装工具自身的工作方式与能力；托管单工具和团队执行使用受支持的适配器。安装或登录成功，仍需核对具体模式与模型是否可用。厂商原生进程使用当前系统用户权限；Provider 凭据和 coding-plan 端点保留在 Harness 设置中。
```

</details>

#### 缺口

- 没有同版本远端故障注入、迁移或撤权后遗留操作证据
  **影响**：不能确认各远端后端在失联后都可证明无副作用
  **进一步探讨**：在独立测试主机模拟派发后断连和撤权，对照本地 journal、远端操作 ID 与真实副作用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下值得继续观察，如何验证自动分派是否真正有收益？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前适合关注已有多模型路线、反复需要对带依赖的项目检查逐步审查的团队。可以在独立 profile 验证预览是否能看清模型、任务、权限与估算，开始只读执行前应先证明引导可完成，并用单条明确计价的路线确认账单归属。面板引导失效、费用处于未知、远端引用和宿主状态不一致时，停止提交新任务并保留账本，回到已有的固定路线。源码足以评估设计，纯路由界面引导和完整 Bot 故障恢复仍缺直接验收，当前采用判断为观察。

可验证的假设是，只有已验收的任务结果及明确结清的用量回执才进入特定任务族的质量校准，缺失回执和被人工否决的结果分别留下标签。当前求解接受不同来源的质量先验，并在无可行候选时放宽，因此用模型偏好或全局平均校准可能把失败路线错误抬高。固定同一批两步只读检查，给自动路由组和固定模型组相同预算，分别评估最终引用正确性、合格率、实际 API 费用和审阅工时。若相同预算下合格率没有提高且费用与审查工时也没有下降，或放宽质量门槛导致错过关键检查，假设不成立。

#### 证据与依据

**依据 1 · 源码核查**：[.dsh-plugin/shared/router.mjs:840-852](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/router.mjs#L840-L852)

实际存在质量门槛放宽，可对这一行为设计质量对照。

<details>
<summary>查看原文（13行）</summary>

```text
function candidatePool(rows, task, weights, text, complexity, cacheReadRatio, cacheWriteRatio, dependencySensitive = false) {
  const eligibleRows = eligibleRowsForTask(rows, task)
  const floor = Number(task.qualityFloor ?? 0)
  const feasible = eligibleRows.filter(row => qualityForTask(row, task.type) >= floor)
  const source = feasible.length > 0
    ? feasible
    : eligibleRows.slice().sort((left, right) => qualityForTask(right, task.type) - qualityForTask(left, task.type) || compareRowsStable(left, right)).slice(0, 3)
  const taskWeights = weightsForTask(weights, task)
  const scored = source.map(row => ({
    row,
    decision: candidateUtility(row, task, taskWeights, cacheReadRatio, cacheWriteRatio, text, complexity),
    cost: taskCost(row, task, text, complexity, cacheReadRatio, cacheWriteRatio),
  }))
```

</details>

**依据 2 · 源码核查**：[.dsh-plugin/shared/budget-reservations.mjs:249-264](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/.dsh-plugin/shared/budget-reservations.mjs#L249-L264)

费用缺失有独立持久标记，可从校准有效样本中分开。

<details>
<summary>查看原文（16行）</summary>

```text
      for (const pending of entry.packages.filter(item => item.started)) {
        const item = [...run.packages, ...(run.reviews ?? [])].find(item => item.id === pending.id)
        if (!item || (!item.inFlight && !['pending', 'running'].includes(item.status))
          || amount(item.costUsd) || amount(item.knownCostUsd) || Array.isArray(item.qualityAttempts)) continue
        // We know a request began, but never observed its receipt. Keep that
        // uncertainty in the ledger as well as the durable estimate hold.
        item.status = 'interrupted'
        item.inFlight = false
        item.ran = true
        item.costUsd = null
        item.costSource = 'interrupted-usage-unknown'
        item.billing = pending.billing === 'subscription' || item.billing === 'subscription' ? 'subscription' : 'api'
        item.finishedAt = at
      }
      run.interruption = { at, unreconciled: true, pendingPackageIds: entry.packages.map(item => item.id),
        startedPackageIds: entry.packages.filter(item => item.started).map(item => item.id) }
```

</details>

**依据 3 · 作者声明**：[docs/releases/0.66.4/publication.json:29-37](https://github.com/Alice-Marx/dsh-model-router/blob/288a7cd13a503379250acd159f22b4424336025e/docs/releases/0.66.4/publication.json#L29-L37)

作者回执的真实挂载证据有面板未通过的明确边界。

```text
  "installedInto": {"profile": "C:/Users/Jianw/.dsh/profiles/desktop", "from": "0.66.3", "to": "0.66.4", "verified": ["installed 0.66.4"]},
  "alsoClosedThisRound": [
    "Remote Agent rebuild is byte-identical (nothing to release); Windows desktop helpers compile with recorded SHA256 a1b66f2b… and d09eeb89…",
    "GitHub rendering of both READMEs verified through GitHub's own API, not a local approximation",
    "The router-only edition mounts in a real Host: 71 plugin descriptors, its 969 KB client bundle served, no Bot product API (404)"
  ],
  "notVerified": [
    "The router-only edition's routing panel itself was never opened: the fixture Host cannot persist the onboarding acknowledgement that gates it ('暂时无法保存确认状态'). Composition, mounting and the edition boundary are verified; the panel contents are not.",
    "Windows has no MSI/NSIS installer in this repo; the install entry point is deploy/remote-agent/install-windows.ps1."
```

#### 缺口

- 没有任务族质量与真实账单联合样本
  **影响**：无法量化算法增益或净成本
  **进一步探讨**：对比任务合格率、发票金额、未决账单数及审阅用时

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
