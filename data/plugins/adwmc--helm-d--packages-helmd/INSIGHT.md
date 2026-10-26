# @adwmc/helm-d

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b2f3778](https://github.com/ADWMC/helm-d/tree/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd)

<!-- BEGIN META -->
[![GitHub ★ 431](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=431&color=yellow&logo=github&style=flat)](https://github.com/ADWMC/helm-d) [![npm 30d 372](https://img.shields.io/static/v1?label=npm+30d&message=372&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d) [![最新发布 2026-10-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-21&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@adwmc/helm-d)
<!-- END META -->

> **实现功能**：为安全分析任务提供知识路由、参考资料、工具门控、案例记录和多类分析脚本。

> **核心亮点**：把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台。它相对“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：需要在 DSH 内组织授权安全分析材料和工具流程的研究者可用它围绕移动端、Web 与原生安全分析提供参考路由、案例台账、解锁门控、提示注入和脚本工作台；合格结果是任务被路由到适当参考与工具，授权范围可见，分析过程与结论能回写案例。详见[Q01](#research-q01)。

基线是手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具。本项的价值主要来自把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 任务与参考路由 | 按任务提示选择知识目录、参考文件与后续动作。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 工具解锁与记忆 | 提供显式解锁、工具记忆和会话级门控。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 案例分析工作台 | 把安全分析过程、脚本和结果组织到案例结构。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH提示/工具/客户端钩子与声明版本 | 必需 | 挂载路由、门控、案例和侧栏 | 接口漂移时禁用对应面 |
| 安全分析工具链与目标授权 | 按任务必需 | 运行Frida/Android/Web/原生脚本 | 无书面授权或工具缺失时只读参考 |
| 参考库与sealed资源 | 路由必需 | 按任务读取362篇参考和脚本 | 来源/版本不可核时不作为结论证据 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 创建带授权范围和目标版本的case | 范围、停止条件和证据目录明确 |
| 2 | route_task/skill_catalog选择参考，helmd_unlock显式解锁高风险动作 | 每次路由和解锁有记录 |
| 3 | 执行脚本并把原始输出与分析写回case | 脚本失败不改写为阴性结论，人工复核后关闭 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 分析工具链、设备/模拟器和存储 | 安装依赖、审阅大量脚本/参考与授权规则 | 按平台准备小时未知 |
| 持续使用 | 设备、LLM、动态插桩和日志资源 | 选择路线、执行、解释与证据整理 | 每个合格case总工时未知 |
| 失败恢复 | 目标重置、会话/工具重启与重复采集 | 确认脚本副作用、恢复设备和case状态 | 目标被修改后的恢复成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 知识路由 | 源码注册skill_catalog/read_reference/route_task | 路由准确率和减少搜索时间 |
| 安全门控 | helmd_unlock与提示/会话生命周期组合 | 是否覆盖所有危险脚本与旁路 |
| 案例闭环 | case/ledger/session log组织过程 | 最终漏洞结论正确率与可复现性 |

> **思考**：大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台。它相对“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台。它相对“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 packages/helmd/src/router.ts 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“执行脚本并把原始输出与分析写回case｜脚本失败不改写为阴性结论，人工复核后关闭”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有授权安全研究流程的专业用户可观察，正式试用前需逐项核对脚本来源、目标授权、工具链和失败恢复。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、packages/helmd/package.json、packages/helmd/src/router.ts 及固定范围 inventory；组件：packages/helmd。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。

**分析版本**

- **仓库**：[ADWMC/helm-d](https://github.com/ADWMC/helm-d)
- **版本号**：0.5.1（[固定提交 b2f3778](https://github.com/ADWMC/helm-d/tree/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可把每次路由、解锁和脚本执行绑定到案例的授权范围与证据哈希，形成可审计的安全分析执行图。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 7 | 1943 | 1506 | 290 | — |
| .md | source | 366 | 95337 | — | — | 522873 |
| .mjs | source | 3 | 581 | 430 | 113 | — |
| .ts | source | 35 | 5665 | 4514 | 750 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-22），可前往 [GitHub Issues](https://github.com/ADWMC/helm-d/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 @adwmc/helm-d 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是需要在 DSH 内组织授权安全分析材料和工具流程的研究者。反复任务是围绕移动端、Web 与原生安全分析提供参考路由、案例台账、解锁门控、提示注入和脚本工作台。原有办法为手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具。合格结果必须达到“任务被路由到适当参考与工具，授权范围可见，分析过程与结论能回写案例”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-21](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/README.md#L3-L21)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# helm-d

<p align="center"><strong>Version 0.5.1</strong></p>

**DeepSeek Harness 破甲安全分析插件**

多破甲热切换 · 证据强制入链 · 34 工具 · 362 篇按需参考 · Android / Web / Native / Protocol / Malware / AI-Security 六域即开即用

**求 Star 收藏 ⭐** 如要二开请看 [致谢](#致谢)

[![Telegram](https://img.shields.io/badge/Telegram-@helm__xD-26A5E4?style=flat&logo=telegram)](https://t.me/helm_xD)
官方QQ群：**213266664**
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2ea44f)](https://github.com/topics/dsh-plugin)
[![topic: deepseek-harness](https://img.shields.io/badge/topic-deepseek-harness-2ea44f)](https://github.com/topics/deepseek-harness)
[![Node >=22.19](https://img.shields.io/badge/Node-%3E%3D22.19.0-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[安装](#安装) · [八题实测](#八题实测) · [多破甲](#多破甲) · [34 工具](#34-工具) · [架构](#架构) · [工作台](#安全分析工作台) · [更新日志](CHANGELOG.md)

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

packages/helmd/src/router.ts 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“创建带授权范围和目标版本的case｜范围、停止条件和证据目录明确；route_task/skill_catalog选择参考，helmd_unlock显式解锁高风险动作｜每次路由和解锁有记录；执行脚本并把原始输出与分析写回case｜脚本失败不改写为阴性结论，人工复核后关闭”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

**依据 2 · 作者声明**：[packages/helmd/package.json:1-26](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.1",
  "type": "module",
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./client.js",
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "payload.dat",
    "references.dat",
    "client.js",
    "cordis.patch.yml",
    "preset.generated.patch.yml",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台。参照是“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

**依据 2 · 作者声明**：[README.md:3-21](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/README.md#L3-L21)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# helm-d

<p align="center"><strong>Version 0.5.1</strong></p>

**DeepSeek Harness 破甲安全分析插件**

多破甲热切换 · 证据强制入链 · 34 工具 · 362 篇按需参考 · Android / Web / Native / Protocol / Malware / AI-Security 六域即开即用

**求 Star 收藏 ⭐** 如要二开请看 [致谢](#致谢)

[![Telegram](https://img.shields.io/badge/Telegram-@helm__xD-26A5E4?style=flat&logo=telegram)](https://t.me/helm_xD)
官方QQ群：**213266664**
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2ea44f)](https://github.com/topics/dsh-plugin)
[![topic: deepseek-harness](https://img.shields.io/badge/topic-deepseek-harness-2ea44f)](https://github.com/topics/deepseek-harness)
[![Node >=22.19](https://img.shields.io/badge/Node-%3E%3D22.19.0-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[安装](#安装) · [八题实测](#八题实测) · [多破甲](#多破甲) · [34 工具](#34-工具) · [架构](#架构) · [工作台](#安全分析工作台) · [更新日志](CHANGELOG.md)

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

#### 缺口

- 缺少针对“大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH提示/工具/客户端钩子与声明版本｜必需｜挂载路由、门控、案例和侧栏｜接口漂移时禁用对应面；安全分析工具链与目标授权｜按任务必需｜运行Frida/Android/Web/原生脚本｜无书面授权或工具缺失时只读参考；参考库与sealed资源｜路由必需｜按任务读取362篇参考和脚本｜来源/版本不可核时不作为结论证据。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“执行脚本并把原始输出与分析写回case｜脚本失败不改写为阴性结论，人工复核后关闭”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[packages/helmd/package.json:1-26](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.1",
  "type": "module",
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./client.js",
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "payload.dat",
    "references.dat",
    "client.js",
    "cordis.patch.yml",
    "preset.generated.patch.yml",
```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“任务被路由到适当参考与工具，授权范围可见，分析过程与结论能回写案例”为合格单位。三阶段投入为：首次使用｜分析工具链、设备/模拟器和存储｜安装依赖、审阅大量脚本/参考与授权规则｜按平台准备小时未知；持续使用｜设备、LLM、动态插桩和日志资源｜选择路线、执行、解释与证据整理｜每个合格case总工时未知；失败恢复｜目标重置、会话/工具重启与重复采集｜确认脚本副作用、恢复设备和case状态｜目标被修改后的恢复成本未知。当前源码只支持机制存在，效果维度为“知识路由｜源码注册skill_catalog/read_reference/route_task｜路由准确率和减少搜索时间；安全门控｜helmd_unlock与提示/会话生命周期组合｜是否覆盖所有危险脚本与旁路；案例闭环｜case/ledger/session log组织过程｜最终漏洞结论正确率与可复现性”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-21](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/README.md#L3-L21)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# helm-d

<p align="center"><strong>Version 0.5.1</strong></p>

**DeepSeek Harness 破甲安全分析插件**

多破甲热切换 · 证据强制入链 · 34 工具 · 362 篇按需参考 · Android / Web / Native / Protocol / Malware / AI-Security 六域即开即用

**求 Star 收藏 ⭐** 如要二开请看 [致谢](#致谢)

[![Telegram](https://img.shields.io/badge/Telegram-@helm__xD-26A5E4?style=flat&logo=telegram)](https://t.me/helm_xD)
官方QQ群：**213266664**
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2ea44f)](https://github.com/topics/dsh-plugin)
[![topic: deepseek-harness](https://img.shields.io/badge/topic-deepseek-harness-2ea44f)](https://github.com/topics/deepseek-harness)
[![Node >=22.19](https://img.shields.io/badge/Node-%3E%3D22.19.0-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[安装](#安装) · [八题实测](#八题实测) · [多破甲](#多破甲) · [34 工具](#34-工具) · [架构](#架构) · [工作台](#安全分析工作台) · [更新日志](CHANGELOG.md)

```

</details>

**依据 2 · 作者声明**：[packages/helmd/package.json:1-26](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.1",
  "type": "module",
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./client.js",
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "payload.dat",
    "references.dat",
    "client.js",
    "cordis.patch.yml",
    "preset.generated.patch.yml",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 packages/helmd/src/router.ts 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“执行脚本并把原始输出与分析写回case｜脚本失败不改写为阴性结论，人工复核后关闭”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

**依据 2 · 作者声明**：[packages/helmd/package.json:1-26](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@adwmc/helm-d",
  "version": "0.5.1",
  "type": "module",
  "main": "dist/health.js",
  "types": "dist/health.d.ts",
  "exports": {
    ".": {
      "types": "./dist/health.d.ts",
      "default": "./dist/health.js"
    },
    "./agent": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./client": "./client.js",
    "./dist/*": "./dist/*",
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "payload.dat",
    "references.dat",
    "client.js",
    "cordis.patch.yml",
    "preset.generated.patch.yml",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把知识路由、工具闸门、案例账本与宿主提示生命周期组合为面向安全分析的工作台”和“大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确”推导的新方向是可把每次路由、解锁和脚本执行绑定到案例的授权范围与证据哈希，形成可审计的安全分析执行图。它不是当前能力。最小验证为选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。有授权安全研究流程的专业用户可观察，正式试用前需逐项核对脚本来源、目标授权、工具链和失败恢复。 试用成功标准是“任务被路由到适当参考与工具，授权范围可见，分析过程与结论能回写案例”，并且 路由准确率和减少搜索时间、是否覆盖所有危险脚本与旁路、最终漏洞结论正确率与可复现性 有可接受结果；停止标准包括发生大量参考和脚本扩大能力面也扩大授权、依赖和版本维护面；静态存在不证明目标环境可用或分析结论正确所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“手工维护安全分析笔记、脚本目录和任务清单，再由研究者自行选择工具”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-21](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/README.md#L3-L21)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# helm-d

<p align="center"><strong>Version 0.5.1</strong></p>

**DeepSeek Harness 破甲安全分析插件**

多破甲热切换 · 证据强制入链 · 34 工具 · 362 篇按需参考 · Android / Web / Native / Protocol / Malware / AI-Security 六域即开即用

**求 Star 收藏 ⭐** 如要二开请看 [致谢](#致谢)

[![Telegram](https://img.shields.io/badge/Telegram-@helm__xD-26A5E4?style=flat&logo=telegram)](https://t.me/helm_xD)
官方QQ群：**213266664**
[![topic: dsh-plugin](https://img.shields.io/badge/topic-dsh--plugin-2ea44f)](https://github.com/topics/dsh-plugin)
[![topic: deepseek-harness](https://img.shields.io/badge/topic-deepseek-harness-2ea44f)](https://github.com/topics/deepseek-harness)
[![Node >=22.19](https://img.shields.io/badge/Node-%3E%3D22.19.0-green)](https://nodejs.org)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[安装](#安装) · [八题实测](#八题实测) · [多破甲](#多破甲) · [34 工具](#34-工具) · [架构](#架构) · [工作台](#安全分析工作台) · [更新日志](CHANGELOG.md)

```

</details>

**依据 2 · 源码核查**：[packages/helmd/src/router.ts:197-214](https://github.com/ADWMC/helm-d/blob/b2f3778cba8fc98772279aaa0969eb8f0ecc2a4a/packages/helmd/src/router.ts#L197-L214)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text

const refRoot = resolve(fileURLToPath(new URL('.', import.meta.url)), '../references')

export function registerRouterTools(ctx: Context): void {
  ctx.tools.register(defineTool({
    name: 'skill_catalog',
    description: 'List available reference topics and when to read them.',
    parameters: {
      domain: { type: 'string', description: 'Optional domain filter.' },
    },
    output: { schema: { type: 'string' }, render: (_a: unknown, v: string) => [{ type: 'text', text: v }] },
    async execute(args: { domain?: string }, exec?: { agent?: { id?: string } }) {
      const { domain } = args
      if (domain) return catalog[domain] ?? `unknown domain: ${domain}`
      const entries = Object.entries(catalog).map(([k, v]) => `${k}: ${v}`)
      entries.unshift(renderContract(getLevel(exec?.agent?.id)))
      return entries.join('\n')
    },
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：选8个已有真值的授权样本，和“目录+人工选脚本”基线对照；记录找到正确路线时间、无效脚本次数、证据完整率和目标恢复时间，出现未授权动作或假阴性写入case即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
