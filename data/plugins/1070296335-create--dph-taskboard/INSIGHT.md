# DPH 任务看板

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ceda7a3](https://github.com/1070296335-create/dph-taskboard/tree/ceda7a378b713afdfcae4d94b670b026f2e24100)

<!-- BEGIN META -->
[![GitHub ★ 7](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=7&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/1070296335-create/dph-taskboard)
<!-- END META -->

> **功能**：把真实DSH会话组织为四列任务看板，支持建会话、拖拽状态、备注、回收站和导入导出。

> **亮点**：把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转。它相对“使用宿主会话列表、命名约定和外部看板手工同步会话进度”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **主要限制**：主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：同时推进多个 DSH 会话、需要可视化归类和复盘的个人或小团队可用它把真实 DSH 会话作为看板卡片，提供状态拖拽、新建会话、回收站、备注、搜索和导入导出；合格结果是看板状态与真实会话一致，删除可恢复，导出导入不丢关联，Agent快照不泄漏或误覆盖状态。详见[Q01](#research-q01)。

基线是使用宿主会话列表、命名约定和外部看板手工同步会话进度。本项的价值主要来自把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话化看板 | 把真实会话归入待办、进行中、评审中和已完成。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 会话与回收站操作 | 新建、打开、归档和恢复会话。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 备注与迁移 | 保存描述、优先级、标签并导入导出看板数据。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH客户端sessions/workspaces/connection注入 | 必需 | 读取、创建、归档和打开真实会话 | 服务未就绪时不得用空快照覆盖 |
| 浏览器 localStorage dph.taskboard.v1 | 必需 | 保存列、备注、标签和新会话标记 | 清理浏览器会丢本地元数据 |
| 宿主 taskboard.json快照与UI挂载补丁 | Agent读取/入口必需 | 将看板投影给模型并插入侧栏 | 补丁漂移时UI可能不可达 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 读取真实会话并与localStorage元数据合并 | 不显示的归档/子Agent规则一致 |
| 2 | 拖拽/新建/归档后先更新真实会话再持久化元数据 | 失败不形成假状态卡 |
| 3 | 导出或宿主快照后做导入/恢复演练 | 覆盖前确认，冲突能选择而非静默覆盖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 浏览器/宿主本地存储 | 运行部署脚本、打UI补丁、重启和备份 | 补丁适配时间未知 |
| 持续使用 | localStorage与宿主快照I/O | 维护列/备注、处理跨浏览器差异 | 每百会话渲染与同步耗时未知 |
| 失败恢复 | 导入导出和会话反归档操作 | 核真实会话、localStorage、taskboard.json三方状态 | 错误覆盖可能丢备注或把卡片放错列 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 会话即卡片 | 客户端直接读取/操作sessions服务 | 大量会话下同步与渲染正确率 |
| 看板元数据 | localStorage保存列/备注/标签 | 跨设备、清缓存和版本迁移可靠性 |
| Agent快照 | 宿主侧写taskboard.json | 浏览器与宿主投影冲突处理 |

> **思考**：主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转。它相对“使用宿主会话列表、命名约定和外部看板手工同步会话进度”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 src/client/index.js 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“导出或宿主快照后做导入/恢复演练｜覆盖前确认，冲突能选择而非静默覆盖”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

多会话用户可观察，试用前先验证localStorage与宿主快照冲突、补丁卸载和导入覆盖恢复。 采用结论是观察，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。

**分析版本**

- **仓库**：[1070296335-create/dph-taskboard](https://github.com/1070296335-create/dph-taskboard)
- **版本号**：0.1.0（[固定提交 ceda7a3](https://github.com/1070296335-create/dph-taskboard/tree/ceda7a378b713afdfcae4d94b670b026f2e24100)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可把状态变更设计为带版本的单一事件日志，由浏览器和宿主快照共同投影并对冲突提供显式选择。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 231 | — | — | 1675 |
| .js | source | 2 | 1188 | 1076 | 105 | — |
| .mjs | source | 4 | 396 | 303 | 56 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A58.561Z..2026-10-22T15%3A12%3A58.561Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/1070296335-create/dph-taskboard/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A12%3A58.561Z..2026-10-22T15%3A12%3A58.561Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 DPH 任务看板 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是同时推进多个 DSH 会话、需要可视化归类和复盘的个人或小团队。反复任务是把真实 DSH 会话作为看板卡片，提供状态拖拽、新建会话、回收站、备注、搜索和导入导出。原有办法为使用宿主会话列表、命名约定和外部看板手工同步会话进度。合格结果必须达到“看板状态与真实会话一致，删除可恢复，导出导入不丢关联，Agent快照不泄漏或误覆盖状态”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

```text
# DPH 任务看板（@dph/taskboard）— DeepSeek Harness 客户端插件

在 Harness 侧边栏「工作区」**搜索图标左侧**提供任务看板入口（与搜索按钮同款样式）。

**完全会话化**：看板上的每一张卡片就是一个真实会话（harness session），卡片 = 会话，
拖拽归类 = 给会话打状态标记，新建卡片 = 真正新建一个会话。

![任务看板截图（占位，发布前请替换为真实界面截图）](docs/screenshot.png)

## 功能

- **侧边栏入口**：工作区搜索图标左侧的看板按钮（wide / 窄栏 rail 两种形态）
- **四列状态看板**：待办 / 进行中 / 评审中 / 已完成，拖拽归类，彩色状态标识
- **会话总览列**：未归类会话集中显示，点击卡片进入会话
- **完全会话化**：
  - 卡片 = 会话；看板显示与侧边栏一致（隐藏子代理 / 归档 / 空白会话）
  - **新建会话**：命名 + 选模型 + 推理强度 + 开始消息 + 选择分组（跟随当前 / 已有分组 / 新建分组）
  - 删除会话 → 进回收站（可恢复，恢复后回到原列）
  - 运行状态点：正在处理的会话卡片右上角有呼吸闪烁的「处理中」标记
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

src/client/index.js 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“读取真实会话并与localStorage元数据合并｜不显示的归档/子Agent规则一致；拖拽/新建/归档后先更新真实会话再持久化元数据｜失败不形成假状态卡；导出或宿主快照后做导入/恢复演练｜覆盖前确认，冲突能选择而非静默覆盖”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@dph/taskboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness 任务看板插件：侧边栏看板入口、会话化四列状态看板（拖拽归类）、新建会话（模型/推理强度/分组）、回收站恢复、备注、导出导入",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src"
  ],
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "taskboard",
    "kanban",
    "plugin"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转。参照是“使用宿主会话列表、命名约定和外部看板手工同步会话进度”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

```text
# DPH 任务看板（@dph/taskboard）— DeepSeek Harness 客户端插件

在 Harness 侧边栏「工作区」**搜索图标左侧**提供任务看板入口（与搜索按钮同款样式）。

**完全会话化**：看板上的每一张卡片就是一个真实会话（harness session），卡片 = 会话，
拖拽归类 = 给会话打状态标记，新建卡片 = 真正新建一个会话。

![任务看板截图（占位，发布前请替换为真实界面截图）](docs/screenshot.png)

## 功能

- **侧边栏入口**：工作区搜索图标左侧的看板按钮（wide / 窄栏 rail 两种形态）
- **四列状态看板**：待办 / 进行中 / 评审中 / 已完成，拖拽归类，彩色状态标识
- **会话总览列**：未归类会话集中显示，点击卡片进入会话
- **完全会话化**：
  - 卡片 = 会话；看板显示与侧边栏一致（隐藏子代理 / 归档 / 空白会话）
  - **新建会话**：命名 + 选模型 + 推理强度 + 开始消息 + 选择分组（跟随当前 / 已有分组 / 新建分组）
  - 删除会话 → 进回收站（可恢复，恢复后回到原列）
  - 运行状态点：正在处理的会话卡片右上角有呼吸闪烁的「处理中」标记
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

#### 缺口

- 缺少针对“主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH客户端sessions/workspaces/connection注入｜必需｜读取、创建、归档和打开真实会话｜服务未就绪时不得用空快照覆盖；浏览器 localStorage dph.taskboard.v1｜必需｜保存列、备注、标签和新会话标记｜清理浏览器会丢本地元数据；宿主 taskboard.json快照与UI挂载补丁｜Agent读取/入口必需｜将看板投影给模型并插入侧栏｜补丁漂移时UI可能不可达。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“导出或宿主快照后做导入/恢复演练｜覆盖前确认，冲突能选择而非静默覆盖”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@dph/taskboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness 任务看板插件：侧边栏看板入口、会话化四列状态看板（拖拽归类）、新建会话（模型/推理强度/分组）、回收站恢复、备注、导出导入",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src"
  ],
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "taskboard",
    "kanban",
    "plugin"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“看板状态与真实会话一致，删除可恢复，导出导入不丢关联，Agent快照不泄漏或误覆盖状态”为合格单位。三阶段投入为：首次使用｜浏览器/宿主本地存储｜运行部署脚本、打UI补丁、重启和备份｜补丁适配时间未知；持续使用｜localStorage与宿主快照I/O｜维护列/备注、处理跨浏览器差异｜每百会话渲染与同步耗时未知；失败恢复｜导入导出和会话反归档操作｜核真实会话、localStorage、taskboard.json三方状态｜错误覆盖可能丢备注或把卡片放错列。当前源码只支持机制存在，效果维度为“会话即卡片｜客户端直接读取/操作sessions服务｜大量会话下同步与渲染正确率；看板元数据｜localStorage保存列/备注/标签｜跨设备、清缓存和版本迁移可靠性；Agent快照｜宿主侧写taskboard.json｜浏览器与宿主投影冲突处理”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

```text
# DPH 任务看板（@dph/taskboard）— DeepSeek Harness 客户端插件

在 Harness 侧边栏「工作区」**搜索图标左侧**提供任务看板入口（与搜索按钮同款样式）。

**完全会话化**：看板上的每一张卡片就是一个真实会话（harness session），卡片 = 会话，
拖拽归类 = 给会话打状态标记，新建卡片 = 真正新建一个会话。

![任务看板截图（占位，发布前请替换为真实界面截图）](docs/screenshot.png)

## 功能

- **侧边栏入口**：工作区搜索图标左侧的看板按钮（wide / 窄栏 rail 两种形态）
- **四列状态看板**：待办 / 进行中 / 评审中 / 已完成，拖拽归类，彩色状态标识
- **会话总览列**：未归类会话集中显示，点击卡片进入会话
- **完全会话化**：
  - 卡片 = 会话；看板显示与侧边栏一致（隐藏子代理 / 归档 / 空白会话）
  - **新建会话**：命名 + 选模型 + 推理强度 + 开始消息 + 选择分组（跟随当前 / 已有分组 / 新建分组）
  - 删除会话 → 进回收站（可恢复，恢复后回到原列）
  - 运行状态点：正在处理的会话卡片右上角有呼吸闪烁的「处理中」标记
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@dph/taskboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness 任务看板插件：侧边栏看板入口、会话化四列状态看板（拖拽归类）、新建会话（模型/推理强度/分组）、回收站恢复、备注、导出导入",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src"
  ],
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "taskboard",
    "kanban",
    "plugin"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 src/client/index.js 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“导出或宿主快照后做导入/恢复演练｜覆盖前确认，冲突能选择而非静默覆盖”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "@dph/taskboard",
  "version": "0.1.0",
  "description": "DeepSeek Harness 任务看板插件：侧边栏看板入口、会话化四列状态看板（拖拽归类）、新建会话（模型/推理强度/分组）、回收站恢复、备注、导出导入",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src"
  ],
  "keywords": [
    "deepseek",
    "harness",
    "dsh",
    "taskboard",
    "kanban",
    "plugin"
  ],
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“把卡片直接绑定真实会话，减少外部看板与 DSH 会话之间的双录和跳转”和“主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险”推导的新方向是可把状态变更设计为带版本的单一事件日志，由浏览器和宿主快照共同投影并对冲突提供显式选择。它不是当前能力。最小验证为创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“使用宿主会话列表、命名约定和外部看板手工同步会话进度”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为继续观察。多会话用户可观察，试用前先验证localStorage与宿主快照冲突、补丁卸载和导入覆盖恢复。 试用成功标准是“看板状态与真实会话一致，删除可恢复，导出导入不丢关联，Agent快照不泄漏或误覆盖状态”，并且 大量会话下同步与渲染正确率、跨设备、清缓存和版本迁移可靠性、浏览器与宿主投影冲突处理 有可接受结果；停止标准包括发生主要元数据保存在浏览器 localStorage，另有宿主快照；双存储同步、补丁安装和跨浏览器恢复是核心可靠性风险所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“使用宿主会话列表、命名约定和外部看板手工同步会话进度”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

```text
# DPH 任务看板（@dph/taskboard）— DeepSeek Harness 客户端插件

在 Harness 侧边栏「工作区」**搜索图标左侧**提供任务看板入口（与搜索按钮同款样式）。

**完全会话化**：看板上的每一张卡片就是一个真实会话（harness session），卡片 = 会话，
拖拽归类 = 给会话打状态标记，新建卡片 = 真正新建一个会话。

![任务看板截图（占位，发布前请替换为真实界面截图）](docs/screenshot.png)

## 功能

- **侧边栏入口**：工作区搜索图标左侧的看板按钮（wide / 窄栏 rail 两种形态）
- **四列状态看板**：待办 / 进行中 / 评审中 / 已完成，拖拽归类，彩色状态标识
- **会话总览列**：未归类会话集中显示，点击卡片进入会话
- **完全会话化**：
  - 卡片 = 会话；看板显示与侧边栏一致（隐藏子代理 / 归档 / 空白会话）
  - **新建会话**：命名 + 选模型 + 推理强度 + 开始消息 + 选择分组（跟随当前 / 已有分组 / 新建分组）
  - 删除会话 → 进回收站（可恢复，恢复后回到原列）
  - 运行状态点：正在处理的会话卡片右上角有呼吸闪烁的「处理中」标记
```

</details>

**依据 2 · 源码核查**：[src/client/index.js:16-33](https://github.com/1070296335-create/dph-taskboard/blob/ceda7a378b713afdfcae4d94b670b026f2e24100/src/client/index.js#L16-L33)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text
const __dph_h = (type, props, ...children) => __dph_react.createElement(type, props ?? null, ...children);

// ── 常量 ──────────────────────────────────────────────────────────────
const __dph_STORAGE_KEY = "dph.taskboard.v1";
const __dph_COLUMNS = [
	{ id: "todo", title: "待办", accent: "#5b8def" },
	{ id: "doing", title: "进行中", accent: "#e8a13a" },
	{ id: "review", title: "评审中", accent: "#9b7bf0" },
	{ id: "done", title: "已完成", accent: "#3fbf8f" }
];
const __dph_PRIORITIES = [
	{ id: "low", label: "低", color: "#8a94a6" },
	{ id: "medium", label: "中", color: "#5b8def" },
	{ id: "high", label: "高", color: "#e8a13a" },
	{ id: "urgent", label: "紧急", color: "#e5534b" }
];

// ── 数据层：会话归类 + 会话备注（浏览器 localStorage）─────────────────────
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：创建100个含归档/子Agent/空白的会话，在两个浏览器导出导入并注入写失败/重启；记录丢卡、错列、重复、备注丢失和恢复分钟，任何静默覆盖真实会话状态即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
