# CCPG One

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[7f291a9](https://github.com/chumingjun/dsh-harness-one/tree/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/chumingjun/dsh-harness-one) [![npm 30d 2,469](https://img.shields.io/static/v1?label=npm+30d&message=2%2C469&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-harness-one) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-harness-one)
<!-- END META -->

> **功能**：以单包安装 Workflow One 的 DSH 插件组合与可选集成。

> **亮点**：CCPG One 的增量是发行与装配层：manifest 将 Workflow One 的四个核心插件和多个可选集成组成一个 bundle，环境变量控制 preview、Lark、guard；安装器先为 pnpm 11 原生依赖预置 allowBuilds 再调用 DSH CLI。它降低逐包选择和配置的步骤，但 DAG 编排、画布和工具能力属于子插件，聚合壳没有独立实现这些功能，也未证明运行质量提升。 依据 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：双挂载是直接启动风险：patch 明确提示重复插入子插件会导致 boot failure，而 better-sidebar 已由依赖自身 bundle 挂载。安装器还会改目标 profile 的 pnpm-workspace.yaml 并增删插件；源码声称幂等且保留用户条目，但本轮未在真实 profile 检验 YAML 变体、失败回滚或移除完整性。应先做 profile 快照差异，并确认核心与可选插件各自唯一挂载；也要意识到关闭 preview/Lark/guard 会丢失相应集成或保护。 细节见 [Q03](#research-q03)。

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
  - [Q01 · 聚合包面向什么工作流任务，单包组合相对逐个安装改变了什么？](#detail-section-11)
  - [Q02 · 包怎样把子插件挂进 profile，安装脚本解决什么问题？](#detail-section-12)
  - [Q03 · 重复挂载、安装副作用和可选组件如何影响安全/可靠性？](#detail-section-13)
  - [Q04 · 谁适合安装该组合包，如何权衡维护与退出成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向在 DSH 中通过自然语言构建和运行可视化 DAG、多 Agent 工作流的用户。该组件不是单独实现编排功能，而是聚合 tools、orchestrator、web、canvas UI、document preview、Lark auth、LLM guard 等多个包，提供统一 profile 挂载和安装体验。相对用户逐一选择与配置多个包，减少安装步骤并给出一套默认组合；核心能力和效果归各子插件及模型，而非聚合壳本身。

对应的宿主原生能力、手工操作或逐项安装；没有本轮同条件效率/质量测试。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 核心功能 | 完成 [Q01](#research-q01) 所述任务 | 依赖、限制见 [Q02](#research-q02) [Q03](#research-q03) |
| 配置与管理 | 用户查看/调整运行方式 | 仅源码可见，真实部署需核验 |

**流程与依赖**

| 依赖 | 用途 | 边界 |
| --- | --- | --- |
| DSH/Node 宿主 | 加载并提供服务 | 目标版本未启动验收 |
| 组件特定依赖 | 见 [Q02](#research-q02) | 权限/数据边界见 [Q03](#research-q03) |
| 模型、文件或子插件 | 支持任务 | 使用前核实来源和配置 |

| 阶段 | 操作 | 失败/退出处理 |
| --- | --- | --- |
| 首次 | 在隔离 profile 按 [Q04](#research-q04) 设定最小配置 | 发现越界修改/依赖不明即停 |
| 使用 | 验收 [Q01](#research-q01) 所述任务 | 留存必要日志并人工核对 |
| 退出 | 停用并检查持久化/服务残留 | 按 [Q03](#research-q03) 回退 |

**效果与成本**

| 阶段 | 资源/现金 | 人工投入 | 未知 |
| --- | --- | --- | --- |
| 首次 | 依赖和运行环境，金额未知 | 安装/配置/核对 | 无同条件计时 |
| 持续 | 模型/存储/网络或维护资源 | 监督、更新和纠错 | 实际用量未计 |
| 恢复/退出 | 可能重试或清理 | 核账与回滚 | 未做故障演练 |

| 效果项 | 固定源码支持 | 未验证 |
| --- | --- | --- |
| 核心任务 | 入口/机制如逐题所述 | 真实质量及可用性 |
| 管理与恢复 | 存在源码路径/提示 | 真实环境错误恢复 |

> **思考**：双挂载是直接启动风险：patch 明确提示重复插入子插件会导致 boot failure，而 better-sidebar 已由依赖自身 bundle 挂载。安装器还会改目标 profile 的 pnpm-workspace.yaml 并增删插件；源码声称幂等且保留用户条目，但本轮未在真实 profile 检验 YAML 变体、失败回滚或移除完整性。应先做 profile 快照差异，并确认核心与可选插件各自唯一挂载；也要意识到关闭 preview/Lark/guard 会丢失相应集成或保护。 细节见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：CCPG One 的增量是发行与装配层：manifest 将 Workflow One 的四个核心插件和多个可选集成组成一个 bundle，环境变量控制 preview、Lark、guard；安装器先为 pnpm 11 原生依赖预置 allowBuilds 再调用 DSH CLI。它降低逐包选择和配置的步骤，但 DAG 编排、画布和工具能力属于子插件，聚合壳没有独立实现这些功能，也未证明运行质量提升。 依据 [Q01](#research-q01) 与 [Q02](#research-q02)。

聚合、持久化或界面机制均按固定源码解释；源码测试/作者基准不等于本轮运行。主要兼容和恢复缺口见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

双挂载是直接启动风险：patch 明确提示重复插入子插件会导致 boot failure，而 better-sidebar 已由依赖自身 bundle 挂载。安装器还会改目标 profile 的 pnpm-workspace.yaml 并增删插件；源码声称幂等且保留用户条目，但本轮未在真实 profile 检验 YAML 变体、失败回滚或移除完整性。应先做 profile 快照差异，并确认核心与可选插件各自唯一挂载；也要意识到关闭 preview/Lark/guard 会丢失相应集成或保护。 细节见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先按 [Q04](#research-q04) 的小范围和停止试用；在 [Q03](#research-q03) 的数据/权限/恢复边界无法核实前，不扩大部署。

采用建议：先按 [Q04](#research-q04) 的小范围和停止试用；在 [Q03](#research-q03) 的数据/权限/恢复边界无法核实前，不扩大部署。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交源码可支持入口和机制判断；真实宿主、端到端效果、性能/成本和恢复均未在本轮执行验证。

- 已检查：作者 README、包清单、源码路径 dsh-plugins/dsh-ccpg-one/package.json、dsh-plugins/dsh-ccpg-one/cordis.patch.yml、dsh-plugins/dsh-ccpg-one/bin/install.js、dsh-plugins/dsh-ccpg-one/lib/index.js 及固定范围 inventory；组件：dsh-plugins/dsh-ccpg-one。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取 chumingjun/dsh-harness-one dsh-plugins/dsh-ccpg-one 固定提交 7f291a98a7f9497ddb98f79b96e51b660033b76f 的 manifest、使用说明及入口/关键实现；未安装、运行目标插件、启动真实 DSH、调用 LLM/API 或外部依赖。
- 下一步：按 [Q04](#research-q04) 在临时 profile/合成数据上完成隔离小样本；记录启动、核心任务、故障恢复、权限边界和退出，未确认结果不视为通过。

**分析版本**

- **仓库**：[chumingjun/dsh-harness-one](https://github.com/chumingjun/dsh-harness-one)
- **版本号**：0.12.1（[固定提交 7f291a9](https://github.com/chumingjun/dsh-harness-one/tree/7f291a98a7f9497ddb98f79b96e51b660033b76f)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可检验的假设是：统一 bundle 加 pnpm 前置配置可降低 DSH 用户从零搭建 Workflow One 的安装失败率和人工排错时间，且 profile 修改、依赖升级与启动风险不会抵消收益。用干净及已有配置的临时 profile 对比逐包安装与 CCPG One，记录成功率、配置差异、耗时、重启/回滚和重复路由；验证通过前不能把“单包”视为更可靠或更省成本。 验证设计见 [Q04](#research-q04)。

按 [Q04](#research-q04) 在临时 profile/合成数据上完成隔离小样本；记录启动、核心任务、故障恢复、权限边界和退出，未确认结果不视为通过。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 150 | 102 | 32 | — |
| .mjs | test | 1 | 81 | 63 | 10 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/chumingjun/dsh-harness-one/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/chumingjun/dsh-harness-one/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/chumingjun/dsh-harness-one/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：CCPG One 聚合 bundle 是否以可维护的单命令安装方式交付 Workflow One 的多插件工作流，同时其安装前置修改、双挂载和可选依赖风险是否可控？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 聚合包面向什么工作流任务，单包组合相对逐个安装改变了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在 DSH 中通过自然语言构建和运行可视化 DAG、多 Agent 工作流的用户。该组件不是单独实现编排功能，而是聚合 tools、orchestrator、web、canvas UI、document preview、Lark auth、LLM guard 等多个包，提供统一 profile 挂载和安装体验。相对用户逐一选择与配置多个包，减少安装步骤并给出一套默认组合；核心能力和效果归各子插件及模型，而非聚合壳本身。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-plugins/dsh-ccpg-one/package.json:1-9](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/package.json#L1-L9)

manifest 的项目描述和独立发布身份。

```text
{
  "name": "dsh-harness-one",
  "version": "0.12.1",
  "description": "Workflow One - Visual AI workflow orchestrator for DeepSeek Harness (dsh), with multi-agent DAGs, live execution, recovery, and Feishu integration",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/chumingjun/dsh-harness-one.git",
    "directory": "dsh-plugins/dsh-ccpg-one"
```

**依据 2 · 源码核查**：[dsh-plugins/dsh-ccpg-one/package.json:48-56](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/package.json#L48-L56)

声明七个子插件依赖。

```text
  "dependencies": {
    "dsh-better-sidebar": "0.25.0",
    "dsh-ccpg-canvasui": "0.9.0",
    "dsh-ccpg-document-preview": "0.9.0",
    "dsh-ccpg-larkauth": "0.9.0",
    "dsh-ccpg-llm-guard": "0.9.0",
    "dsh-ccpg-orchestrator": "0.9.0",
    "dsh-ccpg-tools": "0.9.0",
    "dsh-ccpg-web": "0.9.0"
```

**依据 3 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:1-8](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L1-L8)

说明单包装卸及双挂载会导致启动失败。

```text
# dsh-ccpg-one 聚合 bundle patch：一条命令装齐 Workflow One 七个默认插件。
#
# 安装：dsh plugin --profile <name> add dsh-ccpg-one
# （本地目录安装：dsh plugin --profile <name> add <repo>/dsh-plugins/dsh-ccpg-one）
# 卸载：dsh plugin --profile <name> remove dsh-ccpg-one —— 七个默认插件随依赖一并移除。
#
# ⚠ 双挂载警告：装本包后不要再单独 add dsh-ccpg-* 子包或手写 insert 行，
#   两层都生效 = duplicate prefix route，boot 失败。
```

**依据 4 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:21-40](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L21-L40)

明确核心和可选插件组成。

<details>
<summary>查看原文（20行）</summary>

```text
- insert:
    # ---- 核心（不可关）：引擎 + 画布 + 官方 UI 集成 ----
    - id: dsh-ccpg-tools
      name: 'dsh-ccpg-tools'
    - id: dsh-ccpg-orchestrator
      name: 'dsh-ccpg-orchestrator'
    - id: dsh-ccpg-web
      name: 'dsh-ccpg-web'
    - id: dsh-ccpg-canvasui
      name: 'dsh-ccpg-canvasui'
    # ---- 可选 ----
    - id: dsh-ccpg-document-preview
      name: 'dsh-ccpg-document-preview'
      disabled: !!js "Boolean(process.env.CCPG_NO_PREVIEW || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-larkauth
      name: 'dsh-ccpg-larkauth'
      disabled: !!js "Boolean(process.env.CCPG_NO_LARK || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-llm-guard
      name: 'dsh-ccpg-llm-guard'
      disabled: !!js "Boolean(process.env.CCPG_NO_GUARD || process.env.CCPG_ONLY_CORE)"
```

</details>

#### 缺口

- 本轮未运行完整 Workflow One，也无逐个安装与聚合安装的用户对照。
  **影响**：不能量化安装简化或工作流质量
  **进一步探讨**：在临时 profile 验证 DAG 创建/执行，并记录安装和排错步骤。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 包怎样把子插件挂进 profile，安装脚本解决什么问题？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

manifest 作为独立 DSH bundle 引用 cordis.patch.yml；patch 插入四个核心插件，按环境变量禁用预览、Lark 和 guard，better-sidebar 通过依赖自带 bundle 层挂载。安装 CLI 在 dsh plugin add 前预写 pnpm workspace allowBuilds/minimumReleaseAgeExclude，规避 pnpm 11 strict-dep-builds 拦截原生依赖。运行依赖 Node、DSH CLI、profile pnpm 和所有子包；安装成功后需重启 DSH。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/dsh-ccpg-one/package.json:30-46](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/package.json#L30-L46)

Node 版本、入口、CLI 和打包清单。

<details>
<summary>查看原文（17行）</summary>

```text
  "engines": {
    "node": ">=22.15.0"
  },
  "type": "module",
  "private": false,
  "main": "lib/index.js",
  "bin": {
    "dsh-harness-one": "./bin/install.js"
  },
  "exports": {
    ".": "./lib/index.js",
    "./install": "./bin/install.js"
  },
  "files": [
    "lib",
    "bin",
    "cordis.patch.yml"
```

</details>

**依据 2 · 源码核查**：[dsh-plugins/dsh-ccpg-one/package.json:48-65](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/package.json#L48-L65)

依赖列表和 dsh bundle patch 声明。

<details>
<summary>查看原文（18行）</summary>

```text
  "dependencies": {
    "dsh-better-sidebar": "0.25.0",
    "dsh-ccpg-canvasui": "0.9.0",
    "dsh-ccpg-document-preview": "0.9.0",
    "dsh-ccpg-larkauth": "0.9.0",
    "dsh-ccpg-llm-guard": "0.9.0",
    "dsh-ccpg-orchestrator": "0.9.0",
    "dsh-ccpg-tools": "0.9.0",
    "dsh-ccpg-web": "0.9.0"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 3 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:21-47](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L21-L47)

核心/可选包的插入、环境变量门控和 sidebar 单点挂载。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    # ---- 核心（不可关）：引擎 + 画布 + 官方 UI 集成 ----
    - id: dsh-ccpg-tools
      name: 'dsh-ccpg-tools'
    - id: dsh-ccpg-orchestrator
      name: 'dsh-ccpg-orchestrator'
    - id: dsh-ccpg-web
      name: 'dsh-ccpg-web'
    - id: dsh-ccpg-canvasui
      name: 'dsh-ccpg-canvasui'
    # ---- 可选 ----
    - id: dsh-ccpg-document-preview
      name: 'dsh-ccpg-document-preview'
      disabled: !!js "Boolean(process.env.CCPG_NO_PREVIEW || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-larkauth
      name: 'dsh-ccpg-larkauth'
      disabled: !!js "Boolean(process.env.CCPG_NO_LARK || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-llm-guard
      name: 'dsh-ccpg-llm-guard'
      disabled: !!js "Boolean(process.env.CCPG_NO_GUARD || process.env.CCPG_ONLY_CORE)"
    # better-sidebar 不在此 insert：聚合包把 dsh-better-sidebar 声明为依赖，dsh plugin add
    # 会依据其自带 dsh.bundle.patch 自动注册进 bundles 层挂载——聚和层再 insert 一行就是
    # 双挂载（duplicate prefix route "/sidebar/api"，boot 失败）。此前版本的防双挂载
    # disabled: !!js 表达式在双注册现场会经 loader evaluate 无限递归（栈溢出），且上游
    # 包 0.16.1 自带的同款表达式也有同样缺陷，双向退让都不可靠——唯一稳态是单点挂载。
    # CCPG_NO_SIDEBAR / CCPG_ONLY_CORE 开关改由 bin/install.js 在安装层处理
    # （检测到开关时不把 better-sidebar 装进 profile）。
```

</details>

**依据 4 · 源码核查**：[dsh-plugins/dsh-ccpg-one/bin/install.js:45-77](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/bin/install.js#L45-L77)

定位 dsh、初始化 profile、幂等预写 pnpm 放行并执行 plugin add。

<details>
<summary>查看原文（33行）</summary>

```text
// --- 1. 定位 dsh：优先 PATH，其次已安装 profile 的扁平兜底目录（--prewrite 不需要 dsh）---
const prewriteOnly = process.argv.includes('--prewrite');
const dshCandidates = ['dsh', join(DSH_HOME, 'profiles/node_modules/@deepseek-ai/dsh/lib/bin.js')];
const dsh = prewriteOnly ? null : dshCandidates.find((c) => spawnSync(c, ['--version']).status === 0);
if (!prewriteOnly && !dsh) die('未找到 dsh（先 npm i -g @deepseek-ai/dsh）');

// --- 2. 让 dsh 先初始化 profile（其模板含 pnpm-workspace.yaml），再预写放行 ---
if (!prewriteOnly && !existsSync(join(DSH_HOME, 'profiles', PROFILE, 'package.json'))) {
  const ls = spawnSync(dsh, ['plugin', '--profile', PROFILE, 'ls'], { encoding: 'utf8' });
  // initProfile 在首次 plugin 调用时完成；ls 本身可能因 pnpm 环境差异非零，目录在即可
  if (!existsSync(join(DSH_HOME, 'profiles', PROFILE, 'package.json'))) {
    die(`profile ${PROFILE} 初始化失败（可先跑一次：${dsh} plugin --profile ${PROFILE} ls）`);
  }
}
const wsPath = join(DSH_HOME, 'profiles', PROFILE, 'pnpm-workspace.yaml');
const original = existsSync(wsPath) ? readFileSync(wsPath, 'utf8') : 'packages:\n  - .\n';
let text = normalizePlaceholders(original);
text = ensureMapping(text, 'allowBuilds', ['node-pty', 'protobufjs', 'koffi']);
text = ensureSequence(text, 'minimumReleaseAgeExclude', [PKG, ...SUBPLUGINS]);
if (text !== original) writeFileSync(wsPath, text);
say(text !== original ? `已预写 ${wsPath}（allowBuilds + minimumReleaseAgeExclude）` : 'workspace 放行已就绪，跳过');

// --prewrite：只修放行后退出（setup.sh --one 在 dsh plugin add 之前复用）
if (process.argv.includes('--prewrite')) process.exit(0);

// --- 3. 安装 ---
say(`dsh plugin --profile ${PROFILE} add ${PKG} …`);
const add = spawnSync(dsh, ['plugin', '--profile', PROFILE, 'add', PKG], { stdio: 'inherit' });
if (add.status !== 0) {
  console.error(`[dsh-harness-one] 安装失败（exit ${add.status}）。
若上面有 ERR_PNPM_IGNORED_BUILDS：重试无效（pnpm 会反复拦截）——重跑本命令即可，
它会先把 profile pnpm-workspace.yaml 的放行修正（allowBuilds: node-pty: true）再安装。`);
  process.exit(add.status ?? 1);
```

</details>

#### 缺口

- 未在实际 pnpm 11 profile 验证脚本对多种 YAML 排版/用户配置的修改效果。
  **影响**：可能造成依赖批准与配置意外变化
  **进一步探讨**：用临时 profile 对已有 allowBuilds、重跑和预写模式做快照对比。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重复挂载、安装副作用和可选组件如何影响安全/可靠性？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

双挂载同一子插件会造成重复 loader/route 并导致 boot 失败；sidebar 单独依赖自动挂载，不能再由聚合层插入。安装器会修改目标 profile 的 pnpm-workspace.yaml 并调用 dsh plugin add/remove；即使幂等且声称不删用户条目，失败或移除 sidebar 时仍应核对差异。可选关掉 document preview 会失去预览、关掉 Lark 会失去扫码登录/技能种子，关掉 guard 会降低工具调用完整性保护。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:7-20](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L7-L20)

双挂载启动风险和各环境开关语义。

<details>
<summary>查看原文（14行）</summary>

```text
# ⚠ 双挂载警告：装本包后不要再单独 add dsh-ccpg-* 子包或手写 insert 行，
#   两层都生效 = duplicate prefix route，boot 失败。
#
# 可选件门控（disabled: !!js 在 loader ctx eval，读进程环境变量）：
#   export CCPG_NO_LARK=1     → 不加载 larkauth（飞书扫码登录/技能种子）
#   export CCPG_NO_PREVIEW=1  → 不加载 document-preview（文档预览退化为下载）
#   export CCPG_NO_GUARD=1    → 不加载 llm-guard（空工具调用防护，不建议关）
#   export CCPG_ONLY_CORE=1   → 只留核心四件（tools/orchestrator/web/canvasui，其余全关）
# 注意 CCPG_NO_SIDEBAR 已不在本层：better-sidebar 挂载由它自己的 bundle 层提供
# （见下方 better-sidebar 注释）。npm 安装渠道用 npx dsh-ccpg-one 且带
# CCPG_NO_SIDEBAR/CCPG_ONLY_CORE 时由 bin/install.js 移除该依赖实现关闭。
# 以下变量可写进工作区 .env（DSH_ 前缀被禁止，CCPG_ 前缀合法）。
# 挂载名说明：loader 与 client-modules 都从 profile 根按包名解析 entry——
# 子插件必须作为 registry 依赖装在 profile node_modules（publish-npm.sh 已发布为公共包）。
```

</details>

**依据 2 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:21-47](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L21-L47)

插入列表避免 sidebar 双挂载并说明依赖安装门控。

<details>
<summary>查看原文（27行）</summary>

```text
- insert:
    # ---- 核心（不可关）：引擎 + 画布 + 官方 UI 集成 ----
    - id: dsh-ccpg-tools
      name: 'dsh-ccpg-tools'
    - id: dsh-ccpg-orchestrator
      name: 'dsh-ccpg-orchestrator'
    - id: dsh-ccpg-web
      name: 'dsh-ccpg-web'
    - id: dsh-ccpg-canvasui
      name: 'dsh-ccpg-canvasui'
    # ---- 可选 ----
    - id: dsh-ccpg-document-preview
      name: 'dsh-ccpg-document-preview'
      disabled: !!js "Boolean(process.env.CCPG_NO_PREVIEW || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-larkauth
      name: 'dsh-ccpg-larkauth'
      disabled: !!js "Boolean(process.env.CCPG_NO_LARK || process.env.CCPG_ONLY_CORE)"
    - id: dsh-ccpg-llm-guard
      name: 'dsh-ccpg-llm-guard'
      disabled: !!js "Boolean(process.env.CCPG_NO_GUARD || process.env.CCPG_ONLY_CORE)"
    # better-sidebar 不在此 insert：聚合包把 dsh-better-sidebar 声明为依赖，dsh plugin add
    # 会依据其自带 dsh.bundle.patch 自动注册进 bundles 层挂载——聚和层再 insert 一行就是
    # 双挂载（duplicate prefix route "/sidebar/api"，boot 失败）。此前版本的防双挂载
    # disabled: !!js 表达式在双注册现场会经 loader evaluate 无限递归（栈溢出），且上游
    # 包 0.16.1 自带的同款表达式也有同样缺陷，双向退让都不可靠——唯一稳态是单点挂载。
    # CCPG_NO_SIDEBAR / CCPG_ONLY_CORE 开关改由 bin/install.js 在安装层处理
    # （检测到开关时不把 better-sidebar 装进 profile）。
```

</details>

**依据 3 · 源码核查**：[dsh-plugins/dsh-ccpg-one/bin/install.js:10-13](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/bin/install.js#L10-L13)

安装前修复位置、幂等原则和不删用户条目声明。

```text
// 包内 postinstall 不可用（它本身也在被拦的构建脚本之列），所以唯一可靠的
// 修复位置在安装之前：先把 profile 的 workspace 放行写好，再交给 dsh plugin。
//
// 幂等：已正确的条目不动；pnpm 写入的占位符归位为 true。全程不删用户条目。
```

**依据 4 · 源码核查**：[dsh-plugins/dsh-ccpg-one/bin/install.js:80-88](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/bin/install.js#L80-L88)

禁用 sidebar 时调用宿主 plugin remove，失败仅提示手动移除。

```text
// 可选件开关（安装层）：侧栏挂载由上游 dsh-better-sidebar 自己的 bundle 层提供，
// 聚合 patch 不再 insert（双 insert = duplicate route；!!js 退让在双注册现场会递归爆栈），
// 因此 CCPG_NO_SIDEBAR / CCPG_ONLY_CORE 在此落为移除依赖本身。
if (process.env.CCPG_NO_SIDEBAR || process.env.CCPG_ONLY_CORE) {
  say('CCPG_NO_SIDEBAR/CCPG_ONLY_CORE 生效：移除 dsh-better-sidebar …');
  const rm = spawnSync(dsh, ['plugin', '--profile', PROFILE, 'remove', 'dsh-better-sidebar'], { stdio: 'inherit' });
  if (rm.status !== 0) console.error('[dsh-harness-one] better-sidebar 移除失败（可手动：dsh plugin --profile ' + PROFILE + ' remove dsh-better-sidebar）');
}
say('安装完成，重启 dsh 生效。独立画布: http://127.0.0.1:4021/wf1/');
```

**依据 5 · 源码核查**：[dsh-plugins/dsh-ccpg-one/lib/index.js:1-8](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/lib/index.js#L1-L8)

聚合包空 apply，功能由子插件提供。

```text
// dsh-ccpg-one：聚合壳（无运行时代码）。
// 职责只有两件：dependencies 拉齐七个默认 dsh-ccpg-* 插件（+ better-sidebar），
// cordis.patch.yml 把它们一次性挂载。真正的实现全在各插件包内。
// 可选件（larkauth/document-preview/better-sidebar）用 disabled: !!js 表达式按
// CCPG_* 环境变量门控；brand 保留为独立插件，不进入聚合包。
export const name = 'dsh-ccpg-one';
export const inject = [];
export function apply() {}
```

#### 缺口

- 没有实测故障回滚、profile 配置保留或每个可选插件关闭后的功能降级。
  **影响**：实际失败恢复及子插件权限未知
  **进一步探讨**：在可销毁 profile 按核心/可选组合测试 boot、卸载和残留路由。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合安装该组合包，如何权衡维护与退出成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合希望在 DSH 内构建可视化多节点/多 Agent 工作流，且接受一组插件依赖的用户。先在专用 profile 通过安装 CLI 安装，保持默认组合；检查 pnpm-workspace.yaml diff、启动日志、画布和一个非敏感流程，再按需关闭可选件。单包减少分别配置成本的假设与七个子插件的升级、原生依赖和安全审查负担并存。若无法审计依赖、安装修改超出预期、重复路由或退出后子插件残留，移除聚合包并核对 profile。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-plugins/dsh-ccpg-one/package.json:48-56](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/package.json#L48-L56)

子插件和原生/服务依赖规模。

```text
  "dependencies": {
    "dsh-better-sidebar": "0.25.0",
    "dsh-ccpg-canvasui": "0.9.0",
    "dsh-ccpg-document-preview": "0.9.0",
    "dsh-ccpg-larkauth": "0.9.0",
    "dsh-ccpg-llm-guard": "0.9.0",
    "dsh-ccpg-orchestrator": "0.9.0",
    "dsh-ccpg-tools": "0.9.0",
    "dsh-ccpg-web": "0.9.0"
```

**依据 2 · 源码核查**：[dsh-plugins/dsh-ccpg-one/bin/install.js:31-41](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/bin/install.js#L31-L41)

安装用法、pnpm 失败处理说明及开关条件。

<details>
<summary>查看原文（11行）</summary>

```text
  console.log(`用法：npx ${PKG} [profile] [--prewrite]
在 ~/.dsh/profiles/<profile> 预写 pnpm 11 放行（allowBuilds: node-pty/protobufjs/koffi、
minimumReleaseAgeExclude: dsh-ccpg-*），然后 dsh plugin add ${PKG}。

--prewrite   只做预写后退出（setup.sh --one 复用；不执行安装）。

pnpm 11 用户直接 \`dsh plugin add ${PKG}\` 遇 ERR_PNPM_IGNORED_BUILDS 时，重跑 install
无效（pnpm 反复拦截，见 issue #24）——用本命令安装，它会先把放行写对。

CCPG_NO_SIDEBAR=1 / CCPG_ONLY_CORE=1：装完后 dsh plugin remove dsh-better-sidebar
（侧栏挂载是上游包自己的 bundle 层；聚合层不再 insert，关闭须移除依赖本身）。`);
```

</details>

**依据 3 · 源码核查**：[dsh-plugins/dsh-ccpg-one/bin/install.js:59-88](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/bin/install.js#L59-L88)

配置预写、安装、可选移除及用户恢复提示。

<details>
<summary>查看原文（30行）</summary>

```text
const wsPath = join(DSH_HOME, 'profiles', PROFILE, 'pnpm-workspace.yaml');
const original = existsSync(wsPath) ? readFileSync(wsPath, 'utf8') : 'packages:\n  - .\n';
let text = normalizePlaceholders(original);
text = ensureMapping(text, 'allowBuilds', ['node-pty', 'protobufjs', 'koffi']);
text = ensureSequence(text, 'minimumReleaseAgeExclude', [PKG, ...SUBPLUGINS]);
if (text !== original) writeFileSync(wsPath, text);
say(text !== original ? `已预写 ${wsPath}（allowBuilds + minimumReleaseAgeExclude）` : 'workspace 放行已就绪，跳过');

// --prewrite：只修放行后退出（setup.sh --one 在 dsh plugin add 之前复用）
if (process.argv.includes('--prewrite')) process.exit(0);

// --- 3. 安装 ---
say(`dsh plugin --profile ${PROFILE} add ${PKG} …`);
const add = spawnSync(dsh, ['plugin', '--profile', PROFILE, 'add', PKG], { stdio: 'inherit' });
if (add.status !== 0) {
  console.error(`[dsh-harness-one] 安装失败（exit ${add.status}）。
若上面有 ERR_PNPM_IGNORED_BUILDS：重试无效（pnpm 会反复拦截）——重跑本命令即可，
它会先把 profile pnpm-workspace.yaml 的放行修正（allowBuilds: node-pty: true）再安装。`);
  process.exit(add.status ?? 1);
}

// 可选件开关（安装层）：侧栏挂载由上游 dsh-better-sidebar 自己的 bundle 层提供，
// 聚合 patch 不再 insert（双 insert = duplicate route；!!js 退让在双注册现场会递归爆栈），
// 因此 CCPG_NO_SIDEBAR / CCPG_ONLY_CORE 在此落为移除依赖本身。
if (process.env.CCPG_NO_SIDEBAR || process.env.CCPG_ONLY_CORE) {
  say('CCPG_NO_SIDEBAR/CCPG_ONLY_CORE 生效：移除 dsh-better-sidebar …');
  const rm = spawnSync(dsh, ['plugin', '--profile', PROFILE, 'remove', 'dsh-better-sidebar'], { stdio: 'inherit' });
  if (rm.status !== 0) console.error('[dsh-harness-one] better-sidebar 移除失败（可手动：dsh plugin --profile ' + PROFILE + ' remove dsh-better-sidebar）');
}
say('安装完成，重启 dsh 生效。独立画布: http://127.0.0.1:4021/wf1/');
```

</details>

**依据 4 · 源码核查**：[dsh-plugins/dsh-ccpg-one/cordis.patch.yml:1-20](https://github.com/chumingjun/dsh-harness-one/blob/7f291a98a7f9497ddb98f79b96e51b660033b76f/dsh-plugins/dsh-ccpg-one/cordis.patch.yml#L1-L20)

统一安装/卸载、冲突警告和环境门控。

<details>
<summary>查看原文（20行）</summary>

```text
# dsh-ccpg-one 聚合 bundle patch：一条命令装齐 Workflow One 七个默认插件。
#
# 安装：dsh plugin --profile <name> add dsh-ccpg-one
# （本地目录安装：dsh plugin --profile <name> add <repo>/dsh-plugins/dsh-ccpg-one）
# 卸载：dsh plugin --profile <name> remove dsh-ccpg-one —— 七个默认插件随依赖一并移除。
#
# ⚠ 双挂载警告：装本包后不要再单独 add dsh-ccpg-* 子包或手写 insert 行，
#   两层都生效 = duplicate prefix route，boot 失败。
#
# 可选件门控（disabled: !!js 在 loader ctx eval，读进程环境变量）：
#   export CCPG_NO_LARK=1     → 不加载 larkauth（飞书扫码登录/技能种子）
#   export CCPG_NO_PREVIEW=1  → 不加载 document-preview（文档预览退化为下载）
#   export CCPG_NO_GUARD=1    → 不加载 llm-guard（空工具调用防护，不建议关）
#   export CCPG_ONLY_CORE=1   → 只留核心四件（tools/orchestrator/web/canvasui，其余全关）
# 注意 CCPG_NO_SIDEBAR 已不在本层：better-sidebar 挂载由它自己的 bundle 层提供
# （见下方 better-sidebar 注释）。npm 安装渠道用 npx dsh-ccpg-one 且带
# CCPG_NO_SIDEBAR/CCPG_ONLY_CORE 时由 bin/install.js 移除该依赖实现关闭。
# 以下变量可写进工作区 .env（DSH_ 前缀被禁止，CCPG_ 前缀合法）。
# 挂载名说明：loader 与 client-modules 都从 profile 根按包名解析 entry——
# 子插件必须作为 registry 依赖装在 profile node_modules（publish-npm.sh 已发布为公共包）。
```

</details>

#### 缺口

- 没有长期升级兼容、实际安装耗时或用户排障数据。
  **影响**：在一次性 profile 比较一次安装/卸载成本和工作流验收
  **进一步探讨**：无法确认配置差异或卸载后残留就停止采用。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
