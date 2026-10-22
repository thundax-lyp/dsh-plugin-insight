# dsh-soul

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[0a203cc](https://github.com/Aliuyanfeng/dsh-soul/tree/0a203cc24e39beea3d3c8cc00541b4709e87c49f)

<!-- BEGIN META -->
[![GitHub ★ 5](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=5&color=yellow&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul) [![npm 30d 2,337](https://img.shields.io/static/v1?label=npm+30d&message=2%2C337&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-soul) [![最新发布 2026-10-19](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-19&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-soul)
<!-- END META -->

> **实现功能**：为DSH提供可切换人格、会话与工作区范围绑定、提示注入和个性化界面。

> **核心亮点**：把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层。它相对“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：需要在不同项目或会话中稳定切换角色提示和个性设置的用户可用它管理人格配置并按全局、工作区或会话范围绑定，在提示装配时注入且提供命令、工具和界面入口；合格结果是当前人格和作用域可见、变更即时且可撤销，不在错误项目泄漏提示或历史。详见[Q01](#research-q01)。

基线是手工维护系统提示并在每个会话复制，或只使用宿主全局设置。本项的价值主要来自把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 人格配置与切换 | 创建、选择并更新个性化人格。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 多范围绑定 | 按全局、工作区和会话范围解析当前人格。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 提示与界面接线 | 把人格注入提示并通过命令、工具和多个UI入口管理。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH prompt/agent/working-directory 与客户端槽位 | 必需 | 解析作用域并注入人格/显示UI | 接口不兼容时禁用对应入口 |
| 人格配置、历史与作用域存储 | 必需 | 保存persona及全局/工作区/会话绑定 | 损坏时回到默认且保留备份 |
| 命令 soul 与 set_persona 工具权限 | 切换时必需 | 允许用户或Agent改变人格 | 未授权Agent不得跨作用域写入 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 创建/选择persona并预览最终提示差异 | 内容与来源明确，不含不应跨项目的秘密 |
| 2 | 绑定全局、工作区或会话并检查优先级 | 界面与实际装配结果一致 |
| 3 | 切换/撤销后新旧会话分别核对 | 历史可回滚，其他工作区不受影响 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地配置/素材存储 | 设计人格、审阅提示和作用域规则 | 建立persona所需小时未知 |
| 持续使用 | 提示token与客户端状态维护 | 切换、检查覆盖来源和处理宿主升级 | 每轮额外token与误绑率未知 |
| 失败恢复 | 历史/存储回放资源 | 恢复旧persona、清除错误绑定并重建装配 | 错误人格已影响输出需人工审计 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多作用域人格 | store/bindings/session/workspace模块存在 | 优先级在所有宿主版本的一致性 |
| 实时提示更新 | 注入与domain/changed接线存在 | 在进行中会话的生效时点 |
| 可管理界面 | 命令、工具和多个UI槽位存在 | 入口间状态漂移与撤销可靠性 |

> **思考**：多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层。它相对“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层。它相对“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 index.mjs 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“切换/撤销后新旧会话分别核对｜历史可回滚，其他工作区不受影响”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。

**分析版本**

- **仓库**：[Aliuyanfeng/dsh-soul](https://github.com/Aliuyanfeng/dsh-soul)
- **版本号**：0.9.0（[固定提交 0a203cc](https://github.com/Aliuyanfeng/dsh-soul/tree/0a203cc24e39beea3d3c8cc00541b4709e87c49f)）
- **版本日期**：2026-10-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可用显式优先级图展示每次提示的来源与覆盖关系，并为人格切换提供可回放的差异和撤销事务。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 23 | 26364 | 18429 | 6151 | — |
| .md | source | 9 | 3439 | — | — | 80903 |

</details>

**活跃度**

[![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/Aliuyanfeng/dsh-soul/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A46.072Z..2026-10-22T15%3A12%3A46.072Z)

暂未获取：Issue 未关闭、近30天关闭。

统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 dsh-soul 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是需要在不同项目或会话中稳定切换角色提示和个性设置的用户。反复任务是管理人格配置并按全局、工作区或会话范围绑定，在提示装配时注入且提供命令、工具和界面入口。原有办法为手工维护系统提示并在每个会话复制，或只使用宿主全局设置。合格结果必须达到“当前人格和作用域可见、变更即时且可撤销，不在错误项目泄漏提示或历史”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-soul

[简体中文](./README.md) | [English](./README_EN.md)

[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/aliuyanfeng/dsh-soul)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/Aliuyanfeng/badge.svg)](https://hub.xerj.org/contributors/Aliuyanfeng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Aliuyanfeng/dsh-soul?style=social)](https://github.com/Aliuyanfeng/dsh-soul/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/commits)
[![GitHub repo size](https://img.shields.io/github/repo-size/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul)
[![Verify](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml/badge.svg)](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dsh-soul)](https://www.npmjs.com/package/dsh-soul)
[![npm downloads](https://img.shields.io/npm/dm/dsh-soul)](https://www.npmjs.com/package/dsh-soul)

DeepSeek Harness 个性化设置插件，用于配置 Agent 的昵称、回复风格、语调和自定义指令。

## 功能

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

index.mjs 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“创建/选择persona并预览最终提示差异｜内容与来源明确，不含不应跨项目的秘密；绑定全局、工作区或会话并检查优先级｜界面与实际装配结果一致；切换/撤销后新旧会话分别核对｜历史可回滚，其他工作区不受影响”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-soul",
  "version": "0.9.0",
  "description": "为 DeepSeek Harness 添加个性化设置。",
  "icon": "./assets/icon.svg",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-soul",
    "deepseek",
    "deepseek-harness",
    "personalization",
    "persona",
    "system-prompt",
    "ai-assistant",
    "customization"
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "verify": "node scripts/verify-config.mjs && node scripts/verify-store.mjs && node scripts/verify-history.mjs && node scripts/verify-bindings.mjs && node scripts/verify-scope.mjs && node scripts/verify-session-scope.mjs && node scripts/verify-client.mjs && node scripts/verify-e2e-prompt.mjs && node scripts/verify-live-prompt.mjs && node scripts/verify-compat.mjs && node scripts/verify-trail.mjs && node scripts/verify-nav-icon.mjs",
    "verify:strict": "node scripts/verify-config.mjs --strict && node scripts/verify-store.mjs --strict && node scripts/verify-history.mjs --strict && node scripts/verify-bindings.mjs --strict && node scripts/verify-scope.mjs --strict && node scripts/verify-session-scope.mjs --strict && node scripts/verify-client.mjs --strict && node scripts/verify-e2e-prompt.mjs --strict && node scripts/verify-live-prompt.mjs --strict && node scripts/verify-compat.mjs --strict && node scripts/verify-trail.mjs --strict && node scripts/verify-nav-icon.mjs --strict",
    "verify:config": "node scripts/verify-config.mjs",
    "verify:store": "node scripts/verify-store.mjs",
    "verify:history": "node scripts/verify-history.mjs",
    "verify:bindings": "node scripts/verify-bindings.mjs",
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层。参照是“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-soul

[简体中文](./README.md) | [English](./README_EN.md)

[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/aliuyanfeng/dsh-soul)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/Aliuyanfeng/badge.svg)](https://hub.xerj.org/contributors/Aliuyanfeng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Aliuyanfeng/dsh-soul?style=social)](https://github.com/Aliuyanfeng/dsh-soul/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/commits)
[![GitHub repo size](https://img.shields.io/github/repo-size/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul)
[![Verify](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml/badge.svg)](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dsh-soul)](https://www.npmjs.com/package/dsh-soul)
[![npm downloads](https://img.shields.io/npm/dm/dsh-soul)](https://www.npmjs.com/package/dsh-soul)

DeepSeek Harness 个性化设置插件，用于配置 Agent 的昵称、回复风格、语调和自定义指令。

## 功能

```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

#### 缺口

- 缺少针对“多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH prompt/agent/working-directory 与客户端槽位｜必需｜解析作用域并注入人格/显示UI｜接口不兼容时禁用对应入口；人格配置、历史与作用域存储｜必需｜保存persona及全局/工作区/会话绑定｜损坏时回到默认且保留备份；命令 soul 与 set_persona 工具权限｜切换时必需｜允许用户或Agent改变人格｜未授权Agent不得跨作用域写入。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“切换/撤销后新旧会话分别核对｜历史可回滚，其他工作区不受影响”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-soul",
  "version": "0.9.0",
  "description": "为 DeepSeek Harness 添加个性化设置。",
  "icon": "./assets/icon.svg",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-soul",
    "deepseek",
    "deepseek-harness",
    "personalization",
    "persona",
    "system-prompt",
    "ai-assistant",
    "customization"
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "verify": "node scripts/verify-config.mjs && node scripts/verify-store.mjs && node scripts/verify-history.mjs && node scripts/verify-bindings.mjs && node scripts/verify-scope.mjs && node scripts/verify-session-scope.mjs && node scripts/verify-client.mjs && node scripts/verify-e2e-prompt.mjs && node scripts/verify-live-prompt.mjs && node scripts/verify-compat.mjs && node scripts/verify-trail.mjs && node scripts/verify-nav-icon.mjs",
    "verify:strict": "node scripts/verify-config.mjs --strict && node scripts/verify-store.mjs --strict && node scripts/verify-history.mjs --strict && node scripts/verify-bindings.mjs --strict && node scripts/verify-scope.mjs --strict && node scripts/verify-session-scope.mjs --strict && node scripts/verify-client.mjs --strict && node scripts/verify-e2e-prompt.mjs --strict && node scripts/verify-live-prompt.mjs --strict && node scripts/verify-compat.mjs --strict && node scripts/verify-trail.mjs --strict && node scripts/verify-nav-icon.mjs --strict",
    "verify:config": "node scripts/verify-config.mjs",
    "verify:store": "node scripts/verify-store.mjs",
    "verify:history": "node scripts/verify-history.mjs",
    "verify:bindings": "node scripts/verify-bindings.mjs",
```

</details>

**依据 2 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“当前人格和作用域可见、变更即时且可撤销，不在错误项目泄漏提示或历史”为合格单位。三阶段投入为：首次使用｜本地配置/素材存储｜设计人格、审阅提示和作用域规则｜建立persona所需小时未知；持续使用｜提示token与客户端状态维护｜切换、检查覆盖来源和处理宿主升级｜每轮额外token与误绑率未知；失败恢复｜历史/存储回放资源｜恢复旧persona、清除错误绑定并重建装配｜错误人格已影响输出需人工审计。当前源码只支持机制存在，效果维度为“多作用域人格｜store/bindings/session/workspace模块存在｜优先级在所有宿主版本的一致性；实时提示更新｜注入与domain/changed接线存在｜在进行中会话的生效时点；可管理界面｜命令、工具和多个UI槽位存在｜入口间状态漂移与撤销可靠性”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-soul

[简体中文](./README.md) | [English](./README_EN.md)

[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/aliuyanfeng/dsh-soul)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/Aliuyanfeng/badge.svg)](https://hub.xerj.org/contributors/Aliuyanfeng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Aliuyanfeng/dsh-soul?style=social)](https://github.com/Aliuyanfeng/dsh-soul/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/commits)
[![GitHub repo size](https://img.shields.io/github/repo-size/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul)
[![Verify](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml/badge.svg)](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dsh-soul)](https://www.npmjs.com/package/dsh-soul)
[![npm downloads](https://img.shields.io/npm/dm/dsh-soul)](https://www.npmjs.com/package/dsh-soul)

DeepSeek Harness 个性化设置插件，用于配置 Agent 的昵称、回复风格、语调和自定义指令。

## 功能

```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-soul",
  "version": "0.9.0",
  "description": "为 DeepSeek Harness 添加个性化设置。",
  "icon": "./assets/icon.svg",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-soul",
    "deepseek",
    "deepseek-harness",
    "personalization",
    "persona",
    "system-prompt",
    "ai-assistant",
    "customization"
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "verify": "node scripts/verify-config.mjs && node scripts/verify-store.mjs && node scripts/verify-history.mjs && node scripts/verify-bindings.mjs && node scripts/verify-scope.mjs && node scripts/verify-session-scope.mjs && node scripts/verify-client.mjs && node scripts/verify-e2e-prompt.mjs && node scripts/verify-live-prompt.mjs && node scripts/verify-compat.mjs && node scripts/verify-trail.mjs && node scripts/verify-nav-icon.mjs",
    "verify:strict": "node scripts/verify-config.mjs --strict && node scripts/verify-store.mjs --strict && node scripts/verify-history.mjs --strict && node scripts/verify-bindings.mjs --strict && node scripts/verify-scope.mjs --strict && node scripts/verify-session-scope.mjs --strict && node scripts/verify-client.mjs --strict && node scripts/verify-e2e-prompt.mjs --strict && node scripts/verify-live-prompt.mjs --strict && node scripts/verify-compat.mjs --strict && node scripts/verify-trail.mjs --strict && node scripts/verify-nav-icon.mjs --strict",
    "verify:config": "node scripts/verify-config.mjs",
    "verify:store": "node scripts/verify-store.mjs",
    "verify:history": "node scripts/verify-history.mjs",
    "verify:bindings": "node scripts/verify-bindings.mjs",
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 index.mjs 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“切换/撤销后新旧会话分别核对｜历史可回滚，其他工作区不受影响”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "dsh-soul",
  "version": "0.9.0",
  "description": "为 DeepSeek Harness 添加个性化设置。",
  "icon": "./assets/icon.svg",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "dsh-soul",
    "deepseek",
    "deepseek-harness",
    "personalization",
    "persona",
    "system-prompt",
    "ai-assistant",
    "customization"
  ],
  "type": "module",
  "main": "index.mjs",
  "scripts": {
    "verify": "node scripts/verify-config.mjs && node scripts/verify-store.mjs && node scripts/verify-history.mjs && node scripts/verify-bindings.mjs && node scripts/verify-scope.mjs && node scripts/verify-session-scope.mjs && node scripts/verify-client.mjs && node scripts/verify-e2e-prompt.mjs && node scripts/verify-live-prompt.mjs && node scripts/verify-compat.mjs && node scripts/verify-trail.mjs && node scripts/verify-nav-icon.mjs",
    "verify:strict": "node scripts/verify-config.mjs --strict && node scripts/verify-store.mjs --strict && node scripts/verify-history.mjs --strict && node scripts/verify-bindings.mjs --strict && node scripts/verify-scope.mjs --strict && node scripts/verify-session-scope.mjs --strict && node scripts/verify-client.mjs --strict && node scripts/verify-e2e-prompt.mjs --strict && node scripts/verify-live-prompt.mjs --strict && node scripts/verify-compat.mjs --strict && node scripts/verify-trail.mjs --strict && node scripts/verify-nav-icon.mjs --strict",
    "verify:config": "node scripts/verify-config.mjs",
    "verify:store": "node scripts/verify-store.mjs",
    "verify:history": "node scripts/verify-history.mjs",
    "verify:bindings": "node scripts/verify-bindings.mjs",
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把人格存储、范围继承、历史、命令/工具与多处 UI 接线组合为可管理的个性化层”和“多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确”推导的新方向是可用显式优先级图展示每次提示的来源与覆盖关系，并为人格切换提供可回放的差异和撤销事务。它不是当前能力。最小验证为建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。频繁切换项目角色者可在非敏感工作区试用，先验证作用域优先级、撤销和跨会话隔离。 试用成功标准是“当前人格和作用域可见、变更即时且可撤销，不在错误项目泄漏提示或历史”，并且 优先级在所有宿主版本的一致性、在进行中会话的生效时点、入口间状态漂移与撤销可靠性 有可接受结果；停止标准包括发生多级作用域和兼容接线增加状态复杂度；源码测试不能证明所有宿主版本的实时提示更新和隔离都正确所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“手工维护系统提示并在每个会话复制，或只使用宿主全局设置”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# dsh-soul

[简体中文](./README.md) | [English](./README_EN.md)

[![Listed on dsh-plugin.org](https://dsh-plugin.org/badges/listed.svg)](https://dsh-plugin.org/plugins/aliuyanfeng/dsh-soul)
[![XERJ Corpus Hub contributor](https://hub.xerj.org/contributors/Aliuyanfeng/badge.svg)](https://hub.xerj.org/contributors/Aliuyanfeng)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Aliuyanfeng/dsh-soul?style=social)](https://github.com/Aliuyanfeng/dsh-soul/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/issues)
[![GitHub last commit](https://img.shields.io/github/last-commit/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul/commits)
[![GitHub repo size](https://img.shields.io/github/repo-size/Aliuyanfeng/dsh-soul)](https://github.com/Aliuyanfeng/dsh-soul)
[![Verify](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml/badge.svg)](https://github.com/Aliuyanfeng/dsh-soul/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/dsh-soul)](https://www.npmjs.com/package/dsh-soul)
[![npm downloads](https://img.shields.io/npm/dm/dsh-soul)](https://www.npmjs.com/package/dsh-soul)

DeepSeek Harness 个性化设置插件，用于配置 Agent 的昵称、回复风格、语调和自定义指令。

## 功能

```

</details>

**依据 2 · 源码核查**：[index.mjs:462-479](https://github.com/Aliuyanfeng/dsh-soul/blob/0a203cc24e39beea3d3c8cc00541b4709e87c49f/index.mjs#L462-L479)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text

// ==================== 配置写入队列 ====================

// 所有配置写路径（HTTP 保存 / /soul 命令 / set_persona 工具 / soulConfig 服务）
// 统一经由该队列串行执行「读—改—写」，避免并发写入时各方都基于同一份旧配置合并、
// 后写覆盖前写（丢更新）。队列按提交顺序执行任务。
let configWriteQueue = Promise.resolve()

function enqueueConfigWrite(task) {
  const run = configWriteQueue.then(task)
  // 队列吞掉单次任务的失败，保证后续写入不会被一次磁盘错误卡死
  configWriteQueue = run.then(() => {}, () => {})
  return run
}

// 不影响提示词的字段：变更它们不需要刷新系统提示词，也不需要向活动会话注入快照；
// 但它们仍是实际配置变更，必须计入 changed（供调用方判断「已保存 / 无变化」并驱动前端 dirty）。
//
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：建立3个人格×3个工作区×新旧会话矩阵，连续切换并重启；比较最终提示来源、跨项目泄漏、撤销成功数和额外token，任何秘密跨工作区出现即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
