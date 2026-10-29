# HarmonyOS NEXT Skills

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[0243a77](https://github.com/linhay/harmony-next.skills/tree/0243a77451a2ffa97a43114c6b39232544704101)

<!-- BEGIN META -->
[![GitHub ★ 366](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=366&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/linhay/harmony-next.skills)
<!-- END META -->

> **功能**：通过 DSH 单技能 provider 提供离线 HarmonyOS 资料导航及 DevEco/HDC 证据脚本。

> **亮点**：分层本地导航、版本提示和带目标约束/ledger的有界设备动作，内容与工具链统一入口。见[Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：API26主要为声明快照，不是完整行为指南；动作completed只证命令/采集完成，未验业务目标，rawSensitiveContentStored说明原始证据仍敏感。见[Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 实际入口、离线开发价值和基线是什么？](#detail-section-11)
  - [Q02 · provider和版本检索链怎样工作？](#detail-section-12)
  - [Q03 · 设备/UI动作如何选目标、留证和判断成功？](#detail-section-13)
  - [Q04 · 使用成本、采用建议和下一步假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：HarmonyOS开发者查固定版本API或准备DevEco/设备证据；先区分普通参考与实际自动化。见[Q01](#research-q01)。

手工浏览官方资料、核API版本并拼HDC采集命令；本包减少索引/证据接线但不证明检索正确或任务节时。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 使用边界 |
|---|---|---|
| 离线参考导航 | ArkTS/ArkUI/NDK/API检索 | 版本快照，API26声明不等于全指南 |
| DSH单Skill注册 | resourceBase和版本元数据 | 模块缓存需重载，无MCP/tools新服务 |
| HDC采集 | 设备状态、layout/截图/日志 | 明确target，原始材料敏感 |
| 有界UI动作 | 单tap/swipe/key与before/after | completed不证明业务目标达成 |

**流程与依赖**

本地参考、目标SDK与特定脚本环境分开准备；完整表见[Q04](#research-q04)。

确认版本/根，查最小页面；设备先doctor再单动作留证，最后独立读业务状态；步骤见[Q04](#research-q04)。

**效果与成本**

资料/SDK、模型和设备准备、兼容升级与证据脱敏成本未知；阶段表见[Q04](#research-q04)。

索引和证据接线有实现，代码正确性和业务动作成功率未验证；效果见[Q04](#research-q04)。

> **思考**：API26主要为声明快照，不是完整行为指南；动作completed只证命令/采集完成，未验业务目标，rawSensitiveContentStored说明原始证据仍敏感。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：分层本地导航、版本提示和带目标约束/ledger的有界设备动作，内容与工具链统一入口。见[Q01](#research-q01)、[Q03](#research-q03)。

明确resourceBase、目标选择/歧义阻止、原始坐标及ledger可借鉴；模块级冻结定义需重载，completed不能代替后置条件。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

API26主要为声明快照，不是完整行为指南；动作completed只证命令/采集完成，未验业务目标，rawSensitiveContentStored说明原始证据仍敏感。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可先试固定版本普通参考，自动化仅在无外部副作用测试页确认before/after；版本不明、敏感采集不可控或动作状态未知时停止，回官方资料/IDE与手工读回。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

provider、版本目录及代表脚本动作/采集链已核查；宿主加载、代码编译、真实设备和所有私有接口未执行。限参考与无副作用页面试用，假设不计收益。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、index.js、cordis.patch.yml、harmony-next/SKILL.md、harmony-next/references/harmonyos-releases/api-26-release.md、harmony-next/references/JsEtsAPIReference/api26/hms-js/@hms.health.store.d.ts.md、harmony-next/scripts/device_ui_action.py、harmony-next/scripts/device_evidence_bundle.py 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整核index provider，阅读Skill核心路由/版本与API26说明/代表声明页；定向核device_ui_action和device_evidence_bundle目标、动作、采集失败及敏感输出。不通读全部离线页/私有接口，不连设备/执行目标。
- 下一步：后续固定SDK问题做最小编译，并在测试页对照正常/遮挡/无响应与多目标，核ledger和原始材料，再决定扩大自动化。

**分析版本**

- **仓库**：[linhay/harmony-next.skills](https://github.com/linhay/harmony-next.skills)
- **版本号**：1.3.37（[固定提交 0243a77](https://github.com/linhay/harmony-next.skills/tree/0243a77451a2ffa97a43114c6b39232544704101)）
- **版本日期**：2026-09-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是基于before/after增加期望后置条件，把动作完成与业务验证分开；用遮挡/无响应/正常样本比较误报和回看时间，用户简单回看足够则仅改善提示。见[Q04](#research-q04)。

后续固定SDK问题做最小编译，并在测试页对照正常/遮挡/无响应与多目标，核ledger和原始材料，再决定扩大自动化。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4278 | 1693982 | — | — | 9789162 |
| .ts | source | 2 | 12 | 10 | 0 | — |
| .js | source | 1 | 127 | 108 | 6 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/linhay/harmony-next.skills/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/linhay/harmony-next.skills/issues?q=is%3Aissue+created%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/linhay/harmony-next.skills/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T01%3A33%3A21.476Z..2026-10-29T01%3A33%3A21.476Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：离线知识与设备自动化的真实能力、版本和结果边界在哪里？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 实际入口、离线开发价值和基线是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

根包不是只有一份可手工复制的Skill。index.js有apply，注册dsh-harmony-next provider，cordis.patch插入对应行；因此固定DSH根入口真实entry_type是plugin，承载一个harmony-next Skill。跨Agent直接安装该目录是另外一条使用方式，不能据README的filesystem skill说法忽略真实provider，也不能把它当新增MCP/tools/apps执行服务。

目标是HarmonyOS开发者在Agent内找ArkTS/ArkUI/NDK资料，或准备DevEco/设备自动化证据。基线是浏览官方文档、按API版本查资料和手写HDC采集命令；此包贡献在离线索引、按任务路由、明确脚本与证据结构，减少寻找/接线。无需联网查询资料的场景有明确入口，但离线并不意味着模型调用、下载SDK或设备流程也离线。

普通API问答应SKILL→KITS/TASK_MAP→INDEX→具体页，IDE私有接口只在对应任务读，不把数千页一次塞上下文。文档规模不是检索正确率或生成代码可编译的证据；自动化脚本是Agent可调用的程序，provider自身不循环规划和验收任务。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:105-127](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/index.js#L105-L127)

真实provider注册入口。

<details>
<summary>查看原文（23行）</summary>

```text
const definition = Object.freeze(readSkill())
const candidate = Object.freeze({
  ...definition,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_PATH,
})

const provider = {
  name: PROVIDER_NAME,
  async list() {
    return [candidate]
  },
  async get() {
    return { ...definition }
  },
}

export const name = PROVIDER_NAME
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/cordis.patch.yml#L1-L3)

bundle挂载。

```text
- insert:
    - id: harmony-next-skill
      name: dsh-harmony-next
```

**依据 3 · 源码核查**：[harmony-next/SKILL.md:37-66](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/SKILL.md#L37-L66)

按任务/索引最小读取。

<details>
<summary>查看原文（30行）</summary>

```text

## Routing

1. **Classify the user request**
   - API, component, error, or code example: use `KITS.md`, `TASK_MAP.md`, and `INDEX.md`; do not read the DevEco playbooks.
   - Minimal project fixture, Empty Ability scaffold, HDC/uitest smoke app, or copyable HarmonyOS test project: use `references/quickStart/ets/minimal-project-scaffold.md` and `references/templates/empty-ability-app/`.
   - DevEco Studio IDE, plugins, local services, CodeGenie, MCP, LanceDB, `devecostudio://`, UxTestService, or offline UI/UX audit: read the IDE playbook.
   - HarmonyOS Command Line Tools download, archive install, PATH setup, or `codelinter -v` validation: read `references/ideGuides/独立命令行工具配置手册.md` and use `scripts/commandline_tools_manager.py`.
   - HarmonyOS Emulator, HVD, hdc, uitest, aa, bm, hilog, or hidumper automation: read the Emulator playbook.
   - ArkWeb/WebView DevTools forwarding, CDP `Runtime.evaluate`, or H5 bridge field-arrival proof: read `references/ideGuides/ArkWeb WebView CDP调试与字段到达证明.md`.
   - Unknown domain: start with `references/TASK_MAP.md`, then refine through `references/INDEX.md`.

2. **Choose the smallest index**
   - Kit 导航：`references/KITS.md`
   - 任务导向：`references/TASK_MAP.md`

3. **Find the target file**
   - 全库路径清单：`references/INDEX.md`
   - JS/ETS API 分桶清单：`references/JsEtsAPIReference/INDEX.md`

4. **Open only target references**
   `references/JsEtsAPIReference/` 目前以 `modules/`、`topics/`、`types/`、`errors/`、`guides/` 为主。
   - `guides/` contains offline guide pages that replace common official online guide links.

## Lookup Commands

After resolving `HARMONY_NEXT_SKILL_DIR` from this `SKILL.md`:

- 先按关键词命中路径：`rg -n "UIAbility|AbilityStage|Want" "$HARMONY_NEXT_SKILL_DIR/references/INDEX.md" | head`
- 查某个 `@ohos.*` 模块：`rg -n "@ohos\\.app\\.ability\\.|@ohos\\.ability\\." "$HARMONY_NEXT_SKILL_DIR/references/INDEX.md" | rg "JsEtsAPIReference/" | head`
```

</details>

**依据 4 · 源码核查**：[README.md:78-85](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/README.md#L78-L85)

多Agent入口与作者filesystem说明。

````text
- [API 26 发布与同步记录](./harmony-next/references/harmonyos-releases/api-26-release.md)
- [问题反馈指南](./harmony-next/ISSUE_GUIDE.md)

兼容安装路径：`npx skills add linhay/harmony-next.skills --list`、`$HOME/.agents/skills/harmony-next`、`DSH_SOURCE=/path/to/harmony-next.skills`、`.dsh/skills/harmony-next`、`dsh-harmony-next`。

API 26 声明快照可从新版 DevEco Studio 重新生成：

```bash
````

#### 缺口

- 未在DSH加载和开发任务里比较检索结果
  **影响**：不能承诺离线代码正确或节时比例
  **进一步探讨**：用固定API版本问题和可编译小例子对比官方手工查找。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · provider和版本检索链怎样工作？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

index.js模块加载时readSkill同步读固定SKILL_PATH，解析此包自有的小型frontmatter形状，校验name/description并构造resourceBase与invocation。随后freeze definition/candidate，list返回单候选、rank600，get直接复制定义。无需递归扫所有参考，但也没有重读、watch、invalidate或按注册signal取消的逻辑，更新SKILL.md后要重新加载模块才能取得新正文，不能把参考目录变更当实时同步。

candidate展开definition连content也一起带上，get忽略传入candidate，因此不是动态检索API的引擎；索引选择与打开页面交给宿主Agent执行。rank600不独立证明和用户已有同名Skill冲突时一定哪份胜出，取决于宿主排序和来源规则，安装后应确认provider/版本实际命中。

版本范围必须区分：当前Skill说旧指南是API12–23离线快照，api26为SDK声明页，完整指南和示例仍待补齐。实际api26页有d.ts签名和来源版本标头，支持存在性/签名核对，不能仅因有声明就断言目标设备行为、权限和兼容性。api-26-release.md前段仍写“接口正文未提供”，后段又说明声明已导入，口径有历史残留；最准确读法是已纳入声明，完整说明未齐，不能用README API12–26徽章概括同深度覆盖。

本轮不在线核对华为最新发行或SDK行为；所述日期/版本是固定包作者快照。遇到“最新”和新API精确行为应到官方当前材料核对，再与本地页面版本比，不把离线库当实时真相。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:69-118](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/index.js#L69-L118)

同步定义缓存与单候选。

<details>
<summary>查看原文（50行）</summary>

```text
function readSkill() {
  const source = readFileSync(SKILL_PATH, 'utf8')
  const match = FRONTMATTER_PATTERN.exec(source)
  if (match === null) throw new Error(`${SKILL_PATH} is missing YAML frontmatter`)

  const frontmatter = parseFrontmatter(match[1])
  if (frontmatter === null || typeof frontmatter !== 'object' || Array.isArray(frontmatter)) {
    throw new TypeError(`${SKILL_PATH} frontmatter must be a YAML object`)
  }

  const name = frontmatter.name
  const description = frontmatter.description
  if (name !== SKILL_NAME) throw new Error(`expected skill name ${SKILL_NAME}, got ${String(name)}`)
  if (typeof description !== 'string' || description.trim() === '') {
    throw new Error(`${SKILL_PATH} requires a non-empty description`)
  }

  const metadata = frontmatter.metadata
  const definition = {
    name: SKILL_NAME,
    description,
    invocation: {
      modelInvocable: !booleanValue(frontmatter['disable-model-invocation'], false, 'disable-model-invocation'),
      userInvocable: booleanValue(frontmatter['user-invocable'], true, 'user-invocable'),
    },
    source: 'bundled',
    provider: PROVIDER_NAME,
    resourceBase: { kind: 'directory', path: SKILL_ROOT },
    path: SKILL_PATH,
    content: source.slice(match[0].length),
    ...(typeof frontmatter.whenToUse === 'string' ? { whenToUse: frontmatter.whenToUse } : {}),
    ...(metadata !== null && typeof metadata === 'object' && !Array.isArray(metadata) ? { metadata } : {}),
  }
  return definition
}

const definition = Object.freeze(readSkill())
const candidate = Object.freeze({
  ...definition,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_PATH,
})

const provider = {
  name: PROVIDER_NAME,
  async list() {
    return [candidate]
  },
  async get() {
    return { ...definition }
```

</details>

**依据 2 · 源码核查**：[index.js:4-9](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/index.js#L4-L9)

固定目录、rank及前导模式。

```text
const PROVIDER_NAME = 'dsh-harmony-next'
const SKILL_NAME = 'harmony-next'
const BUNDLED_SKILL_RANK = 600
const SKILL_ROOT = fileURLToPath(new URL('./harmony-next/', import.meta.url))
const SKILL_PATH = fileURLToPath(new URL('./harmony-next/SKILL.md', import.meta.url))
const FRONTMATTER_PATTERN = /^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/
```

**依据 3 · 源码核查**：[harmony-next/SKILL.md:21-29](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/SKILL.md#L21-L29)

快照及API26声明边界。

```text
## Version

Current local skill version: `v1.3.37`.

Reference snapshot: bundled `references/` are an offline HarmonyOS API 12-23 snapshot, not live web docs. HarmonyOS SDK 26.0.0 (API 26.0.0) reached Release on 2026-08-29; API 26 declaration pages are bundled under `references/JsEtsAPIReference/api26/`; full guides and examples remain pending.

For "latest", "current", new API, or online-doc parity questions, compare this local version with GitHub Releases or nightly, and verify API behavior against Huawei online docs when precision matters.

API 26 release tracking and adaptation notes: `references/harmonyos-releases/api-26-release.md`.
```

**依据 4 · 源码核查**：[harmony-next/references/harmonyos-releases/api-26-release.md:8-18](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/references/harmonyos-releases/api-26-release.md#L8-L18)

历史口径与声明适用范围。

<details>
<summary>查看原文（11行）</summary>

```text

华为开发者文档中心列出的 **HarmonyOS SDK 26.0.0 Release** 于 2026-08-29 发布，底座为 OpenHarmony SDK `Ohos_sdk_public 26.0.0.105`，对应 API Version `26.0.0 Release`。

本仓库的 `references/` 仍是 API 12–23 的离线快照，因此本文件是版本追踪和适配入口，不代表 API 26 的接口正文已经随包提供。涉及 API 26 新增、变更或废弃接口时，应先查华为在线 API Change List，再回到本地索引确认是否存在对应页面。

## 本地 SDK 取证

提供的 SDK 清单确认：`apiVersion=26`、`platformVersion=26.0.0`、`releaseType=Release`、构建版本 `26.0.0.105`。该 SDK 包含 4,174 个 TypeScript 声明文件，其中 `openharmony/js/api/` 下有 470 个公共 JS/ETS 声明入口；这些声明可用于 API 存在性和签名比对，但不包含本仓库 Markdown 快照中的完整中文说明、示例和兼容性段落。

因此本轮先完成版本证据和检索入口同步；API 26 声明快照已从本地 SDK 导入至 `JsEtsAPIReference/api26/`，可用于离线检索 API 名称、签名和类型；官方完整说明、示例和兼容性段落仍需后续补齐。

```

</details>

**依据 5 · 源码核查**：[harmony-next/references/JsEtsAPIReference/api26/hms-js/@hms.health.store.d.ts.md:1-20](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/references/JsEtsAPIReference/api26/hms-js/%40hms.health.store.d.ts.md#L1-L20)

实际声明页来源与类型。

<details>
<summary>查看原文（20行）</summary>

````text
# @hms.health.store.d.ts

> API 26.0.0 Release declaration snapshot from DevEco Studio SDK 26.0.0.105.

```ts
/*
 * Copyright (c) Huawei Technologies Co., Ltd. 2026-2026. All rights reserved.
 */
/**
 * @file Defines the capabilities of HealthServiceKit.
 * @kit HealthServiceKit
 */
import { Callback } from '@ohos.base';
/**
 * This module provides the health storage function.
 *
 * @syscap SystemCapability.Health.HealthStore.Lite
 * @famodelonly
 * @since 6.1.1(24)
 */
````

</details>

#### 缺口

- 同名技能优先级与当前SDK行为未独立验证
  **影响**：不能称所有API26指南完整或目标版本运行通过
  **进一步探讨**：确认实际provider与SDK版本，最小编译/设备案例核对行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 设备/UI动作如何选目标、留证和判断成功？

**研究主题**：依赖、兼容与流程、工程质量与复用

#### 完整回答

检查代表性的device_ui_action和device_evidence_bundle，而不泛化所有私有接口脚本已验证。action先检查hdc、建指定artifact目录、列connected targets；多目标不指定就blocked，指定不在线也blocked。tap必须只选一种定位方式，layout多节点需match-index，使用原始device bounds/截图尺寸计算，不直接把缩略图坐标当真实坐标。这些约束减少误目标和坐标接线错误，但不是业务权限确认。

执行链是before布局/截图/日志→解析动作→HDC uitest命令→检查exitCode→等待settle→after采集→ledger和summary。必需命令非0或必需文件为空会blocked，并保留失败证据。最终decision=completed表示此有界动作和采集链完成，没有比较期望页面/文字或业务数据是否改变。点下去被遮挡、无响应或业务拒绝仍可能命令0并成功采集，因此不能把completed当“登录/保存/下单已成功”。动作与结果必须分别验收，关键写动作结果未知时先读页面和业务状态，不能盲点第二次。

before/after保留原始截图、layout和日志，summary明确rawSensitiveContentStored=True；redactionPolicy字段是策略说明，不是自动抹除所有原始敏感内容。doctor的public选项只对目标标识等做限定脱敏，不能推定截图已脱敏。远端临时文件可清理，但本地artifact、实际UI动作和可能外部请求不会因停用插件撤销。设备/IDE版本、HDC路径、屏幕状态与输出目录都是运行前提；UX审计/私有API还需相应DevEco包和Python依赖，不能从普通查文档成功外推全部自动化能力。

#### 证据与依据

**依据 1 · 源码核查**：[harmony-next/scripts/device_evidence_bundle.py:313-346](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_evidence_bundle.py#L313-L346)

明确target选择与多目标阻止。

<details>
<summary>查看原文（34行）</summary>

```text
def choose_target(hdc: Path, requested_target: str | None, timeout: float) -> tuple[str, list[dict[str, str]], dict[str, object]]:
    output, targets, command_info = list_targets(hdc, timeout)
    if requested_target:
        if not targets:
            block(
                "no connected HDC target found",
                missing_config=["target"],
                connectedTargets=[],
                hdcListOutput=output[:2000],
            )
        if requested_target not in {item["target"] for item in targets}:
            block(
                f"requested target is not connected: {requested_target}",
                missing_config=["target"],
                connectedTargets=targets,
                hdcListOutput=output[:2000],
            )
        return requested_target, targets, command_info
    if len(targets) == 1:
        return targets[0]["target"], targets, command_info
    if not targets:
        block(
            "no connected HDC target found",
            missing_config=["target"],
            connectedTargets=[],
            hdcListOutput=output[:2000],
        )
    block(
        "multiple connected HDC targets found; pass --target explicitly",
        missing_config=["target"],
        connectedTargets=targets,
        hdcListOutput=output[:2000],
    )
    raise AssertionError("unreachable")
```

</details>

**依据 2 · 源码核查**：[harmony-next/scripts/device_ui_action.py:88-146](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L88-L146)

布局匹配与歧义。

<details>
<summary>查看原文（59行）</summary>

```text
def resolve_layout_target(
    layout_path: Path,
    text: str | None,
    resource_id: str | None,
    contains: bool,
    match_index: int | None,
) -> dict[str, object]:
    try:
        layout = json.loads(layout_path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as error:
        evidence.block("before layout is not valid JSON", missing_config=["layout"], errorDetail=str(error))

    text_keys = ("text", "content", "description", "accessibilityText", "hint", "value")
    resource_keys = ("id", "resourceId", "resource-id", "key", "inspectorKey")
    matches: list[dict[str, object]] = []
    for node in walk_nodes(layout):
        bounds = node_bounds(node)
        if not bounds:
            continue
        if text is not None:
            values = node_values(node, text_keys)
            matched = any(text in value for value in values) if contains else text in values
        else:
            values = node_values(node, resource_keys)
            matched = any(resource_id in value for value in values) if contains else resource_id in values
        if matched:
            matches.append(
                {
                    "bounds": bounds,
                    "type": node.get("type"),
                    "id": next(iter(node_values(node, resource_keys)), None),
                    "text": next(iter(node_values(node, text_keys)), None),
                }
            )

    if not matches:
        evidence.block(
            "no layout node matched the requested selector",
            missing_config=["actionTarget"],
            selector={"text": text, "resourceId": resource_id, "contains": contains},
        )
    if match_index is None and len(matches) > 1:
        evidence.block(
            "multiple layout nodes matched the requested selector; pass --match-index",
            missing_config=["matchIndex"],
            matchCount=len(matches),
            candidates=matches[:20],
        )
    selected_index = match_index or 0
    if not 0 <= selected_index < len(matches):
        evidence.block(
            "--match-index is outside the matched node range",
            missing_config=["matchIndex"],
            matchCount=len(matches),
        )
    selected = matches[selected_index]
    selected["matchCount"] = len(matches)
    selected["matchIndex"] = selected_index
    return selected
```

</details>

**依据 3 · 源码核查**：[harmony-next/scripts/device_ui_action.py:317-350](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L317-L350)

单定位方式和原始坐标。

<details>
<summary>查看原文（34行）</summary>

```text
def resolve_action(args: argparse.Namespace, before: dict[str, object]) -> tuple[list[str], dict[str, object]]:
    dimensions = dict(before["screenshotDimensions"])
    if args.command == "tap":
        raw_point = args.x is not None or args.y is not None
        selectors = [raw_point, args.text is not None, args.resource_id is not None, args.bounds is not None]
        if sum(bool(item) for item in selectors) != 1 or raw_point and (args.x is None or args.y is None):
            evidence.block(
                "tap requires exactly one target: --x/--y, --text, --resource-id, or --bounds",
                missing_config=["actionTarget"],
            )
        target_summary: dict[str, object]
        if raw_point:
            point = (args.x, args.y)
            target_summary = {"source": "explicit-raw-device-coordinates", "point": {"x": point[0], "y": point[1]}}
        elif args.bounds:
            bounds = parse_bounds(args.bounds)
            if not bounds or not valid_bounds(bounds):
                evidence.block("--bounds must define a valid x1,y1,x2,y2 rectangle", missing_config=["bounds"])
            point = center(bounds)
            target_summary = {"source": "explicit-raw-device-bounds", "bounds": bounds}
        else:
            selected = resolve_layout_target(
                Path(str(before["layout"])),
                args.text,
                args.resource_id,
                args.contains,
                args.match_index,
            )
            bounds = tuple(selected["bounds"])
            point = center(bounds)
            target_summary = {"source": "dumpLayout-bounds", **selected}
        validate_point(point, dimensions, "tap")
        target_summary["point"] = {"x": point[0], "y": point[1]}
        return ["shell", "uitest", "uiInput", "click", str(point[0]), str(point[1])], target_summary
```

</details>

**依据 4 · 源码核查**：[harmony-next/scripts/device_ui_action.py:386-416](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L386-L416)

先probe、目标和before采集。

<details>
<summary>查看原文（31行）</summary>

```text
    elif args.command == "key" and not SAFE_KEY_PATTERN.fullmatch(args.key):
        evidence.block("key name contains unsupported characters", missing_config=["key"])


def run_action(args: argparse.Namespace) -> dict[str, object]:
    validate_action_config(args)
    probe = evidence.probe_hdc(args.hdc, args.deveco_app)
    if not probe.exists:
        evidence.block(f"hdc was not found: {probe.path}", missing_config=["hdc"], hdc=probe.to_json())
    if not probe.executable:
        evidence.block(f"hdc is not executable: {probe.path}", missing_config=["hdcExecutable"], hdc=probe.to_json())
    assert probe.path is not None

    artifact_dir = evidence.prepare_artifact_dir(args.artifact_dir)
    target, connected_targets, list_command = evidence.choose_target(probe.path, args.target, args.timeout)
    commands: list[dict[str, object]] = [list_command]
    artifacts: list[dict[str, object]] = []
    remote_files: list[str] = []
    run_id = f"{evidence.timestamp()}-{uuid.uuid4().hex[:8]}"

    before = capture_state(
        "before",
        probe.path,
        target,
        artifact_dir,
        args.timeout,
        args.hilog_lines,
        run_id,
        commands,
        artifacts,
        remote_files,
```

</details>

**依据 5 · 源码核查**：[harmony-next/scripts/device_ui_action.py:446-484](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L446-L484)

动作返回码再after，没有业务后置条件。

<details>
<summary>查看原文（39行）</summary>

```text
    action_record = evidence.run_hdc_capture_command(
        probe.path,
        target,
        action_args,
        f"ui-action.{args.command}",
        artifact_dir,
        args.timeout,
        "ui_action.txt",
        snippet=True,
    )
    commands.append(action_record)
    evidence.require_command_success(
        action_record,
        ["uiAction"],
        artifact_dir,
        commands,
        artifacts,
        cleanup_hdc=probe.path,
        cleanup_target=target,
        cleanup_remote_files=remote_files,
        cleanup_timeout=args.timeout,
        no_cleanup=args.no_cleanup,
    )
    if args.settle_seconds > 0:
        time.sleep(args.settle_seconds)

    after = capture_state(
        "after",
        probe.path,
        target,
        artifact_dir,
        args.timeout,
        args.hilog_lines,
        run_id,
        commands,
        artifacts,
        remote_files,
        args.no_cleanup,
    )
```

</details>

**依据 6 · 源码核查**：[harmony-next/scripts/device_ui_action.py:500-534](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L500-L534)

completed及敏感原始材料。

<details>
<summary>查看原文（35行）</summary>

```text
    ledger_path = artifact_dir / "command_ledger.json"
    ledger_path.write_text(json.dumps(commands, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    artifacts.append(evidence.artifact_record("command-ledger", ledger_path, "summary-safe"))
    payload: dict[str, object] = {
        "decision": "completed",
        "operation": f"device.ui-action.{args.command}",
        "riskLevel": "automation",
        "policy": "automation",
        "redactionPolicy": args.redaction_policy,
        "target": target,
        "connectedTargets": connected_targets,
        "hdc": probe.to_json(),
        "coordinateSpace": before["screenshotDimensions"],
        "action": target_summary,
        "before": before,
        "after": after,
        "artifactDir": str(artifact_dir),
        "artifacts": artifacts,
        "commandLedger": str(ledger_path),
        "rawSensitiveContentStored": True,
        "notes": [
            "Coordinates are raw device pixels from dumpLayout bounds or explicit device-space input.",
            "Preview-image coordinates must not be used unless converted back to the raw screenshot dimensions.",
            "Before/after screenshots, layouts, and logs can contain private content and must be redacted before sharing.",
        ],
        "feedback": evidence.feedback_payload(
            "redacted summary JSON",
            "redacted command ledger",
            "before/after layout summaries and screenshot dimensions",
        ),
    }
    summary_path = artifact_dir / "summary.json"
    payload["summary"] = str(summary_path)
    summary_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload
```

</details>

**依据 7 · 源码核查**：[harmony-next/scripts/device_evidence_bundle.py:458-512](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_evidence_bundle.py#L458-L512)

命令和文件必需项检查。

<details>
<summary>查看原文（55行）</summary>

```text
def require_command_success(
    record: dict[str, object],
    missing_config: list[str],
    artifact_dir: Path,
    commands: list[dict[str, object]],
    artifacts: list[dict[str, object]],
    cleanup_hdc: Path | None = None,
    cleanup_target: str | None = None,
    cleanup_remote_files: list[str] | None = None,
    cleanup_timeout: float = 10,
    no_cleanup: bool = False,
) -> None:
    if record.get("exitCode") == 0:
        return
    block_required_capture_failure(
        f"required HDC command failed: {record.get('purpose')}",
        missing_config=missing_config,
        artifact_dir=artifact_dir,
        commands=commands,
        artifacts=artifacts,
        cleanup_hdc=cleanup_hdc,
        cleanup_target=cleanup_target,
        cleanup_remote_files=cleanup_remote_files,
        cleanup_timeout=cleanup_timeout,
        no_cleanup=no_cleanup,
        failedCommand=record,
    )


def require_artifact_file(
    path: Path,
    kind: str,
    missing_config: list[str],
    artifact_dir: Path,
    commands: list[dict[str, object]],
    artifacts: list[dict[str, object]],
    cleanup_hdc: Path | None = None,
    cleanup_target: str | None = None,
    cleanup_remote_files: list[str] | None = None,
    cleanup_timeout: float = 10,
    no_cleanup: bool = False,
) -> None:
    if path.is_file() and path.stat().st_size > 0:
        return
    block_required_capture_failure(
        f"required {kind} artifact was not captured",
        missing_config=missing_config,
        artifact_dir=artifact_dir,
        commands=commands,
        artifacts=artifacts,
        cleanup_hdc=cleanup_hdc,
        cleanup_target=cleanup_target,
        cleanup_remote_files=cleanup_remote_files,
        cleanup_timeout=cleanup_timeout,
        no_cleanup=no_cleanup,
```

</details>

#### 缺口

- 未连接设备复现误点击、遮挡、HDC超时与私有接口版本
  **影响**：只证明脚本检查/留证存在，不证明业务动作成功率
  **进一步探讨**：用无外部副作用测试页验证命令0/画面不变与真实目标达成，并检查artifact内容。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用成本、采用建议和下一步假设？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

普通离线参考可在确认目标API版本后有限试用；自动化先限无外部副作用测试页，读回before/after与业务目标。它比手工找资料与拼HDC命令更统一，但没有本轮编译/设备运行证据，不据此升级持续采用。

#### 启动与依赖

| 条件 | 是否必需 | 用途 | 缺失边界 |
|---|---|---|---|
| 兼容DSH skills与bundle | DSH入口必需 | 注册单Skill | 跨Agent手工安装是另外路径 |
| 本地资料和正确skill根 | 问答必需 | 最小索引检索 | 不保证最新或全版本同深度 |
| HDC、明确设备、artifact目录 | 动作/采集必需 | 目标绑定和证据 | 多设备不明确blocked |
| DevEco/SDK/模型和领域Python依赖 | 对应任务必需 | 编译、私有接口或UX审计 | 查文档成功不代表工具齐备 |

#### 步骤

| 步骤 | 动作 | 判据 |
|---|---|---|
| 参考试用 | 确认命中provider/version，查一个固定API | 页面版本及代码可核对 |
| 采集准备 | doctor后选明确设备与非敏感目录 | 缺配置先处理，不猜端口 |
| 动作小样 | 测试页执行一个无外部副作用动作 | before/after真实目标符合 |
| 验收 | 区分completed与业务状态 | 重要写入独立回读 |
| 退出 | 停用provider、按需处理artifact/进程 | 原始证据和设备变化另管理 |

#### 成本

| 阶段 | 现金与资源 | 人工时间 | 当前边界 |
|---|---|---|---|
| 首次 | 本地文档/SDK/模型资源未知 | 版本、路径、设备配置 | 离线库不等于全流程离线 |
| 持续 | 模型查询、设备/采集资源未知 | 核对API与业务后置条件 | 无节时量化 |
| 升级 | SDK及私有接口兼容未知 | 重载provider、重查路径 | 声明快照不是行为保证 |
| 恢复退出 | artifact存储与脱敏未知 | 核对未知动作、清进程/副本 | stop不回滚UI或网络写 |

#### 效果

| 效果 | 已查实现 | 不能确认 |
|---|---|---|
| 离线索引 | 单Skill与分层导航 | 检索准确/代码编译 |
| 定位约束 | 多目标阻止、原始坐标和匹配 | 实际当前页面与业务权限 |
| 失败可见 | 命令/文件检查与ledger | 所有脚本/平台恢复 |
| 结果证据 | before/after材料 | completed不等于业务目标成功 |

路径不符、API版本不明、采集敏感内容无法控制、动作后状态不清时应停自动链，用官方资料/IDE和手工读回确认。不要因脚本completed便重复重要操作。

未验证方向是为这些有界动作增加“期望后置条件”层：保持动作状态与业务验证状态分别返回，用无响应/遮挡/目标页面变化样本比较当前completed与新增验证的误报、遗漏、人工回看时间。已有before/after可复用；若简单用户回看已足够，止于清晰结果提示，不另造一个自动化Agent。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:105-127](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/index.js#L105-L127)

真实安装入口。

<details>
<summary>查看原文（23行）</summary>

```text
const definition = Object.freeze(readSkill())
const candidate = Object.freeze({
  ...definition,
  rank: BUNDLED_SKILL_RANK,
  locator: SKILL_PATH,
})

const provider = {
  name: PROVIDER_NAME,
  async list() {
    return [candidate]
  },
  async get() {
    return { ...definition }
  },
}

export const name = PROVIDER_NAME
export const inject = ['skills']

export function apply(ctx) {
  ctx.skills.registerProvider(() => provider)
}
```

</details>

**依据 2 · 源码核查**：[harmony-next/SKILL.md:21-29](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/SKILL.md#L21-L29)

版本条件。

```text
## Version

Current local skill version: `v1.3.37`.

Reference snapshot: bundled `references/` are an offline HarmonyOS API 12-23 snapshot, not live web docs. HarmonyOS SDK 26.0.0 (API 26.0.0) reached Release on 2026-08-29; API 26 declaration pages are bundled under `references/JsEtsAPIReference/api26/`; full guides and examples remain pending.

For "latest", "current", new API, or online-doc parity questions, compare this local version with GitHub Releases or nightly, and verify API behavior against Huawei online docs when precision matters.

API 26 release tracking and adaptation notes: `references/harmonyos-releases/api-26-release.md`.
```

**依据 3 · 源码核查**：[harmony-next/scripts/device_evidence_bundle.py:313-346](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_evidence_bundle.py#L313-L346)

设备约束。

<details>
<summary>查看原文（34行）</summary>

```text
def choose_target(hdc: Path, requested_target: str | None, timeout: float) -> tuple[str, list[dict[str, str]], dict[str, object]]:
    output, targets, command_info = list_targets(hdc, timeout)
    if requested_target:
        if not targets:
            block(
                "no connected HDC target found",
                missing_config=["target"],
                connectedTargets=[],
                hdcListOutput=output[:2000],
            )
        if requested_target not in {item["target"] for item in targets}:
            block(
                f"requested target is not connected: {requested_target}",
                missing_config=["target"],
                connectedTargets=targets,
                hdcListOutput=output[:2000],
            )
        return requested_target, targets, command_info
    if len(targets) == 1:
        return targets[0]["target"], targets, command_info
    if not targets:
        block(
            "no connected HDC target found",
            missing_config=["target"],
            connectedTargets=[],
            hdcListOutput=output[:2000],
        )
    block(
        "multiple connected HDC targets found; pass --target explicitly",
        missing_config=["target"],
        connectedTargets=targets,
        hdcListOutput=output[:2000],
    )
    raise AssertionError("unreachable")
```

</details>

**依据 4 · 源码核查**：[harmony-next/scripts/device_ui_action.py:446-534](https://github.com/linhay/harmony-next.skills/blob/0243a77451a2ffa97a43114c6b39232544704101/harmony-next/scripts/device_ui_action.py#L446-L534)

动作与证据边界。

<details>
<summary>查看原文（89行）</summary>

```text
    action_record = evidence.run_hdc_capture_command(
        probe.path,
        target,
        action_args,
        f"ui-action.{args.command}",
        artifact_dir,
        args.timeout,
        "ui_action.txt",
        snippet=True,
    )
    commands.append(action_record)
    evidence.require_command_success(
        action_record,
        ["uiAction"],
        artifact_dir,
        commands,
        artifacts,
        cleanup_hdc=probe.path,
        cleanup_target=target,
        cleanup_remote_files=remote_files,
        cleanup_timeout=args.timeout,
        no_cleanup=args.no_cleanup,
    )
    if args.settle_seconds > 0:
        time.sleep(args.settle_seconds)

    after = capture_state(
        "after",
        probe.path,
        target,
        artifact_dir,
        args.timeout,
        args.hilog_lines,
        run_id,
        commands,
        artifacts,
        remote_files,
        args.no_cleanup,
    )

    if remote_files and not args.no_cleanup:
        commands.append(
            evidence.run_hdc_capture_command(
                probe.path,
                target,
                ["shell", "rm", "-f", *remote_files],
                "cleanup.remote-artifacts",
                artifact_dir,
                args.timeout,
                "cleanup_remote.txt",
                snippet=True,
            )
        )

    ledger_path = artifact_dir / "command_ledger.json"
    ledger_path.write_text(json.dumps(commands, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    artifacts.append(evidence.artifact_record("command-ledger", ledger_path, "summary-safe"))
    payload: dict[str, object] = {
        "decision": "completed",
        "operation": f"device.ui-action.{args.command}",
        "riskLevel": "automation",
        "policy": "automation",
        "redactionPolicy": args.redaction_policy,
        "target": target,
        "connectedTargets": connected_targets,
        "hdc": probe.to_json(),
        "coordinateSpace": before["screenshotDimensions"],
        "action": target_summary,
        "before": before,
        "after": after,
        "artifactDir": str(artifact_dir),
        "artifacts": artifacts,
        "commandLedger": str(ledger_path),
        "rawSensitiveContentStored": True,
        "notes": [
            "Coordinates are raw device pixels from dumpLayout bounds or explicit device-space input.",
            "Preview-image coordinates must not be used unless converted back to the raw screenshot dimensions.",
            "Before/after screenshots, layouts, and logs can contain private content and must be redacted before sharing.",
        ],
        "feedback": evidence.feedback_payload(
            "redacted summary JSON",
            "redacted command ledger",
            "before/after layout summaries and screenshot dimensions",
        ),
    }
    summary_path = artifact_dir / "summary.json"
    payload["summary"] = str(summary_path)
    summary_path.write_text(json.dumps(payload, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return payload
```

</details>

#### 缺口

- 净成本、真实设备/编译结果及后置条件方案均未验证
  **影响**：试用限参考和可丢弃页面，未来收益不计当前分
  **进一步探讨**：固定问题/SDK和测试页比较正确率、误报与复核时间。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
