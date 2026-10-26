# Qiushi DSH Evidence Audit

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[94fae13](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit) [![npm 30d 1,150](https://img.shields.io/static/v1?label=npm+30d&message=1%2C150&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit) [![最新发布 2026-08-14](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-14&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
<!-- END META -->

> **实现功能**：监听会话与工具结果，写入规范化、哈希串联的只观察证据回执。

> **核心亮点**：以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。它相对“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

> **风险与缺陷**：哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

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

> **用途**：需要对 DSH 会话和工具结果保留可检测篡改记录的审计人员与开发团队可用它监听 session/event 与 tools/result，把规范化事件写成带前序哈希的追加式证据回执；合格结果是回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性。详见[Q01](#research-q01)。

基线是保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件。本项的价值主要来自以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰；尚无同任务、同资源与同验收口径的运行对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话事件回执 | 把会话事件规范化后追加到证据流。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 工具结果回执 | 记录工具结果及其关联上下文。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |
| 哈希链校验 | 通过前序哈希和规范序列化检测链内修改。 | 仅确认固定源码存在；运行效果、规模与兼容范围未做宿主验收 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH session/event 与 tools/result事件 | 必需 | 采集会话和工具回执 | 事件未发出时无法证明遗漏 |
| 可写且受约束的输出目录 | 必需 | 追加规范JSON回执 | 路径越界或写失败时告警且不影响业务事件 |
| 稳定canonical JSON与前序链头 | 必需 | 复算哈希并检测修改 | 序列化规则变化需显式迁移 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 为会话/工具事件构造规范字段和前序hash | 同输入序列化字节稳定 |
| 2 | 以包含性路径检查后追加回执并更新链头 | 写入原子，失败留下可诊断错误 |
| 3 | 离线复算全链并对照事件计数 | 断链/修改被定位；缺失事件单独报告 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地磁盘与备份空间 | 选择输出目录、保留期与验证流程 | 日志增长率未知 |
| 持续使用 | 每事件序列化/哈希/I/O与存储 | 定期验链、轮转和审阅异常 | 每万事件延迟与存储量未知 |
| 失败恢复 | 重建索引/链验证资源 | 隔离损坏文件、从可信链头恢复并核遗漏 | 没有外部锚时链尾删除难发现 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 篡改检测 | canonical JSON和前序哈希形成链 | 对链尾删除、主机攻陷的抵抗力 |
| 低侵入采集 | observe-only监听两个事件 | 高负载下遗漏/阻塞率 |
| 事实边界 | README明确不能证明事件真实性 | 审计人员是否正确理解限制 |

> **思考**：哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。它相对“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。它相对“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”减少接线或重复操作，但未建立同条件效果优势。详见[Q03](#research-q03)。

固定源码把关键职责收敛到 src/index.ts 及其相邻模块，便于追踪入口与状态。可借鉴的是显式宿主接线与配置边界；移植仍需重做 API 兼容、权限、持久化和“离线复算全链并对照事件计数｜断链/修改被定位；缺失事件单独报告”验证。详见[Q07](#research-q07)。

<a id="detail-section-5"></a>

### 1.4 主要限制

哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。这会影响贡献能否转化为端到端收益，需以故障注入和同条件对照改变判断。详见[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 采用结论是试用，不是安装保证；成功与停止标准见[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献为源码支持的宿主接线与流程组合；效果、兼容和恢复没有真实宿主证据。未来方向保持未验证，不计入当前贡献。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅核查固定提交的作者材料、包清单、关键源码和完整组件 inventory；未运行插件、测试、安装、外部服务或真实宿主任务。
- 下一步：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。

**分析版本**

- **仓库**：[030611/qiushi-dsh-evidence-audit](https://github.com/030611/qiushi-dsh-evidence-audit)
- **版本号**：0.1.0（[固定提交 94fae13](https://github.com/030611/qiushi-dsh-evidence-audit/tree/94fae130b2845309e1dcabac14696fddb18f8f3a)）
- **版本日期**：2026-08-14（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未来可探索：可将周期性链头锚定到独立存储，并给每类事件增加覆盖率计数，从而同时检测篡改和采集缺口。该方向由现有贡献与限制推导，尚未实现；失败或恢复负担不改善即应否定。详见[Q08](#research-q08)。

生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 323 | — | — | 4549 |
| .mjs | source | 5 | 212 | 196 | 0 | — |
| .ts | source | 4 | 481 | 404 | 35 | — |
| .ts | test | 5 | 467 | 428 | 0 | — |
| .mjs | example | 1 | 27 | 24 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+created%3A2026-09-22T15%3A12%3A57.015Z..2026-10-22T15%3A12%3A57.015Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/030611/qiushi-dsh-evidence-audit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T15%3A12%3A57.015Z..2026-10-22T15%3A12%3A57.015Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认 Qiushi DSH Evidence Audit 在固定版本中实际实现了什么、相对基线的贡献与关键限制，并给出有证据边界的采用和未来验证结论。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目标用户、反复任务、原有办法与合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

目标用户是需要对 DSH 会话和工具结果保留可检测篡改记录的审计人员与开发团队。反复任务是监听 session/event 与 tools/result，把规范化事件写成带前序哈希的追加式证据回执。原有办法为保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件。合格结果必须达到“回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性”，不能以安装成功、工具注册或一次演示替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/README.md#L1-L19)

作者材料限定目标任务和操作入口；研究回答另加合格交付标准。

<details>
<summary>查看原文（19行）</summary>

````text
# Qiushi DSH Evidence Audit

English | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/qiushi-dsh-evidence-audit.svg)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
[![CI](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/qiushi-dsh-evidence-audit.svg)](LICENSE)
[![featured on dsh-suite](https://img.shields.io/badge/featured%20on-dsh--suite-4d6bfe)](https://whyihaveyou.github.io/dsh-suite/)

![Qiushi DSH Evidence Audit social preview](docs/social-preview.jpg)

**Leave a locally checkable execution trail without storing prompts, tool arguments, tool results, or session IDs in plaintext.**

```sh
dsh plugin --profile web add qiushi-dsh-evidence-audit
```

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor), [Verification Receipt](https://github.com/030611/dsh-verification-receipt), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

````

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、调用链、数据和状态如何实现核心能力？

**研究主题**：功能与机制

#### 完整回答

src/index.ts 中的固定片段显示关键入口、注册或生命周期接线，包清单限定加载组件。实际链路围绕“为会话/工具事件构造规范字段和前序hash｜同输入序列化字节稳定；以包含性路径检查后追加回执并更新链头｜写入原子，失败留下可诊断错误；离线复算全链并对照事件计数｜断链/修改被定位；缺失事件单独报告”推进，状态发生在插件配置、宿主服务或外部目标中。静态路径只能证明机制存在，不能证明注册后所有分支可运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

关键源码片段支持入口、注册或生命周期接线。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/package.json#L1-L26)

包清单绑定版本、入口和宿主声明。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "qiushi-dsh-evidence-audit",
  "version": "0.1.0",
  "packageManager": "pnpm@11.19.0",
  "description": "Observe-only hash-chained evidence receipts for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/030611/qiushi-dsh-evidence-audit.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./dsh.plugin.json": "./dsh.plugin.json",
    "./dsh.plugin.schema.json": "./docs/dsh.plugin.schema.json",
    "./package.json": "./package.json"
  },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比宿主原生能力和简单替代，具体增量与归属是什么？

**研究主题**：贡献与相对优势

#### 完整回答

研究者识别的增量是以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰。参照是“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”。贡献归属于本插件的集成、状态编排或工作流封装，不把外部服务、上游算法或子组件能力重复算作原创，也不从功能数量推断用户收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

源码证明本插件承担接线或编排，而非仅有文字描述。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

**依据 2 · 作者声明**：[README.md:1-19](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/README.md#L1-L19)

README 提供作者主张，用于与源码可见机制分开比较。

<details>
<summary>查看原文（19行）</summary>

````text
# Qiushi DSH Evidence Audit

English | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/qiushi-dsh-evidence-audit.svg)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
[![CI](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/qiushi-dsh-evidence-audit.svg)](LICENSE)
[![featured on dsh-suite](https://img.shields.io/badge/featured%20on-dsh--suite-4d6bfe)](https://whyihaveyou.github.io/dsh-suite/)

![Qiushi DSH Evidence Audit social preview](docs/social-preview.jpg)

**Leave a locally checkable execution trail without storing prompts, tool arguments, tool results, or session IDs in plaintext.**

```sh
dsh plugin --profile web add qiushi-dsh-evidence-audit
```

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor), [Verification Receipt](https://github.com/030611/dsh-verification-receipt), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

````

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么前提最可能使核心贡献无法转化为端到端价值？

**研究主题**：缺陷与关键质疑

#### 完整回答

最有力支持是固定源码确有相应接线；最关键反例或其他解释是哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实。若失败后不能判断副作用是否已发生，局部自动化可能把恢复负担转移给用户。该问题不直接否定插件，但会把适用范围收窄到可隔离、可回读的任务。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

源码显示关键状态边界，也说明为什么需要运行时故障验证。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

#### 缺口

- 缺少针对“哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实”的固定版本故障注入记录
  **影响**：无法确认核心贡献在异常路径仍成立
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 本题重点观察异常是否改变贡献结论。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续生效和失败恢复各依赖什么，操作负担由谁承担？

**研究主题**：依赖、兼容与流程

#### 完整回答

关键依赖分别是：DSH session/event 与 tools/result事件｜必需｜采集会话和工具回执｜事件未发出时无法证明遗漏；可写且受约束的输出目录｜必需｜追加规范JSON回执｜路径越界或写失败时告警且不影响业务事件；稳定canonical JSON与前序链头｜必需｜复算哈希并检测修改｜序列化规则变化需显式迁移。启动者负责版本与权限，使用者负责输入和验收，维护者负责外部服务/API 漂移。失败恢复按“离线复算全链并对照事件计数｜断链/修改被定位；缺失事件单独报告”执行；包依赖存在或工具可注册都不表示业务已经办结。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:1-26](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/package.json#L1-L26)

包清单提供运行时、依赖和分发边界。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "qiushi-dsh-evidence-audit",
  "version": "0.1.0",
  "packageManager": "pnpm@11.19.0",
  "description": "Observe-only hash-chained evidence receipts for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/030611/qiushi-dsh-evidence-audit.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./dsh.plugin.json": "./dsh.plugin.json",
    "./dsh.plugin.schema.json": "./docs/dsh.plugin.schema.json",
    "./package.json": "./package.json"
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

源码提供实际宿主接线，用于区分声明依赖与调用依赖。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

#### 缺口

- 真实宿主中的依赖失效顺序与部分成功状态未观测
  **影响**：无法确认重试是否会重复副作用
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 另逐项切断依赖并回读部分成功状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 完成一个合格任务的首次、持续和失败恢复成本与效果是什么？

**研究主题**：效果与总成本

#### 完整回答

成本必须以“回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性”为合格单位。三阶段投入为：首次使用｜本地磁盘与备份空间｜选择输出目录、保留期与验证流程｜日志增长率未知；持续使用｜每事件序列化/哈希/I/O与存储｜定期验链、轮转和审阅异常｜每万事件延迟与存储量未知；失败恢复｜重建索引/链验证资源｜隔离损坏文件、从可信链头恢复并核遗漏｜没有外部锚时链尾删除难发现。当前源码只支持机制存在，效果维度为“篡改检测｜canonical JSON和前序哈希形成链｜对链尾删除、主机攻陷的抵抗力；低侵入采集｜observe-only监听两个事件｜高负载下遗漏/阻塞率；事实边界｜README明确不能证明事件真实性｜审计人员是否正确理解限制”。没有合格数、总尝试、人工分钟与现金/资源量，因此不能计算单位成本、节时或ROI。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/README.md#L1-L19)

作者材料支持操作范围，不提供同条件成本或合格率。

<details>
<summary>查看原文（19行）</summary>

````text
# Qiushi DSH Evidence Audit

English | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/qiushi-dsh-evidence-audit.svg)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
[![CI](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/qiushi-dsh-evidence-audit.svg)](LICENSE)
[![featured on dsh-suite](https://img.shields.io/badge/featured%20on-dsh--suite-4d6bfe)](https://whyihaveyou.github.io/dsh-suite/)

![Qiushi DSH Evidence Audit social preview](docs/social-preview.jpg)

**Leave a locally checkable execution trail without storing prompts, tool arguments, tool results, or session IDs in plaintext.**

```sh
dsh plugin --profile web add qiushi-dsh-evidence-audit
```

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor), [Verification Receipt](https://github.com/030611/dsh-verification-receipt), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

````

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/package.json#L1-L26)

包清单支持本地/外部资源与依赖边界的定性判断。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "qiushi-dsh-evidence-audit",
  "version": "0.1.0",
  "packageManager": "pnpm@11.19.0",
  "description": "Observe-only hash-chained evidence receipts for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/030611/qiushi-dsh-evidence-audit.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./dsh.plugin.json": "./dsh.plugin.json",
    "./dsh.plugin.schema.json": "./docs/dsh.plugin.schema.json",
    "./package.json": "./package.json"
  },
```

</details>

#### 缺口

- 缺少按合格任务统计的总尝试、失败、人工分钟与现金/资源量
  **影响**：无法比较总成本与净收益
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 同时按合格交付数汇总总尝试、人工分钟和资源量。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现是否可靠可维护，哪些设计可复用，移植代价是什么？

**研究主题**：工程质量与复用

#### 完整回答

固定源码把核心职责落在 src/index.ts 及相邻模块，入口可追踪；inventory 仅作规模和静态候选索引。可复用的是“以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰”的显式接线方式。移植必须重做宿主API、权限、状态持久化和“离线复算全链并对照事件计数｜断链/修改被定位；缺失事件单独报告”验证，不能从测试脚本存在推断当前环境可靠。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

固定源码用于评价职责和宿主耦合。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

**依据 2 · 作者声明**：[package.json:1-26](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/package.json#L1-L26)

包清单用于确认版本、分发与依赖面。

<details>
<summary>查看原文（26行）</summary>

```text
{
  "name": "qiushi-dsh-evidence-audit",
  "version": "0.1.0",
  "packageManager": "pnpm@11.19.0",
  "description": "Observe-only hash-chained evidence receipts for DeepSeek Harness",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/030611/qiushi-dsh-evidence-audit.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "sideEffects": false,
  "publishConfig": {
    "access": "public"
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./dsh.plugin.json": "./dsh.plugin.json",
    "./dsh.plugin.schema.json": "./docs/dsh.plugin.schema.json",
    "./package.json": "./package.json"
  },
```

</details>

#### 缺口

- 未执行仓库测试、安装和真实宿主压力/升级验证
  **影响**：维护性和异常恢复只能作源码级判断
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 在此之外记录构建、卸载和宿主升级后的回归面积。

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 由贡献与反例可推导什么未验证方向，如何证伪？

**研究主题**：新假设与验证

#### 完整回答

由“以 observe-only 方式把 DSH 事件转成规范 JSON 与哈希链回执，降低对业务执行路径的干扰”和“哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实”推导的新方向是可将周期性链头锚定到独立存储，并给每类事件增加覆盖率计数，从而同时检测篡改和采集缺口。它不是当前能力。最小验证为生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 若合格结果不改善、误差/副作用越界或恢复负担高于“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”，即削弱或推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

假设只以已实现机制和边界为推导起点，不表示源码已经实现新方向。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

#### 缺口

- 假设尚无实现、需求频率或效果数据
  **影响**：不能计入插件贡献、创新效果或商业机会
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 只验证最小原型，不改变当前能力状态。

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得观察或试用，成功与停止标准是什么？

**研究主题**：采用判断

#### 完整回答

当前结论为小范围试用。需要本地防篡改线索者可在非关键环境试用，但必须把它视为检测记录而非事件真实性或完整性的证明。 试用成功标准是“回执顺序和内容可复算，断链或修改能被检测，同时明确记录不证明事件真实性”，并且 对链尾删除、主机攻陷的抵抗力、高负载下遗漏/阻塞率、审计人员是否正确理解限制 有可接受结果；停止标准包括发生哈希链只能检测已记录内容的后续变更，不能证明事件未遗漏、主机可信或记录中的业务事实真实所述核心风险、出现未知副作用自动重试，或总人工/资源成本高于“保存普通日志文件，或由外部采集器事后抓取没有链式关系的事件”。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-19](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/README.md#L1-L19)

作者材料限定可操作范围；采用结论由研究者结合限制给出。

<details>
<summary>查看原文（19行）</summary>

````text
# Qiushi DSH Evidence Audit

English | [简体中文](README.zh-CN.md)

[![npm version](https://img.shields.io/npm/v/qiushi-dsh-evidence-audit.svg)](https://www.npmjs.com/package/qiushi-dsh-evidence-audit)
[![CI](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml/badge.svg)](https://github.com/030611/qiushi-dsh-evidence-audit/actions/workflows/ci.yml)
[![license](https://img.shields.io/npm/l/qiushi-dsh-evidence-audit.svg)](LICENSE)
[![featured on dsh-suite](https://img.shields.io/badge/featured%20on-dsh--suite-4d6bfe)](https://whyihaveyou.github.io/dsh-suite/)

![Qiushi DSH Evidence Audit social preview](docs/social-preview.jpg)

**Leave a locally checkable execution trail without storing prompts, tool arguments, tool results, or session IDs in plaintext.**

```sh
dsh plugin --profile web add qiushi-dsh-evidence-audit
```

> Community-maintained and not an official DeepSeek project. Related trust-layer plugins: [Telemetry Redactor](https://github.com/030611/dsh-telemetry-redactor), [Verification Receipt](https://github.com/030611/dsh-verification-receipt), and [Context Provenance](https://github.com/030611/dsh-context-provenance).

````

</details>

**依据 2 · 源码核查**：[src/index.ts:62-79](https://github.com/030611/qiushi-dsh-evidence-audit/blob/94fae130b2845309e1dcabac14696fddb18f8f3a/src/index.ts#L62-L79)

源码证据只支撑窄范围试用/观察，不构成安装验收。

<details>
<summary>查看原文（18行）</summary>

```text

interface EvidenceContext {
  readonly logger: { warn(message: string): void }
  on(name: 'session/event', listener: (session: SessionLike, event: SessionEventLike) => void): () => void
  on(name: 'tools/result', listener: (exec: ToolExecutionLike, result: ToolResultLike) => void): () => void
  effect(execute: () => () => Promise<void>, label?: string): unknown
}

/** Resolve the configured path without ever defaulting to the working directory. */
export function resolveOutputPath(
  configuredPath: string | undefined,
  dshHome: string | undefined = process.env.DSH_HOME,
  _cwd: string = process.cwd(),
): string {
  if (configuredPath !== undefined) {
    if (!isAbsolute(configuredPath)) {
      throw new TypeError(`qiushi-evidence-audit: outputPath must be absolute, got ${JSON.stringify(configuredPath)}`)
    }
```

</details>

#### 缺口

- 未有真实用户频率、迁移意愿与固定版本宿主验收
  **影响**：不能升级为持续安装或生产采用
  **进一步探讨**：生成1万条固定事件，注入单字节修改、重排、截断、写满磁盘和进程中断；测检测率、每万条延迟/磁盘、漏记数，任何修改未报或业务被阻塞即停止。 试用结束还需访谈目标用户的重复频率与退出意愿。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
