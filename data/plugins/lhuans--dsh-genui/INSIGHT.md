# dsh-genui

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[6328c64](https://github.com/lhuans/dsh-genui/tree/6328c64a0f0c4728a79ec5fe90818e0866f57045)

<!-- BEGIN META -->
[![GitHub ★ 47](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=47&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lhuans/dsh-genui) [![npm 30d 87,139](https://img.shields.io/static/v1?label=npm+30d&message=87%2C139&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-genui) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-genui)
<!-- END META -->

> **功能**：在 DSH 回复内渲染 GenUI 图表、表单和小卡片，并把卡片动作与状态作为后续消息提交。

> **亮点**：把OpenTiny材料/renderer接入DSH回复与推理slot，并把卡片状态回传会话，减少手动拼接前端；SDK组件/Host模型执行不归本项原创，见 [Q01](#research-q01)-[Q03](#research-q03)。

> **主要限制**：动作立即提交整state/覆盖draft且无本层去重/回执；SDK安全未审，off只关提示，保存先内存后异步失败可200，runtime失败空卡，见 [Q02](#research-q02)-[Q04](#research-q04)。

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
  - [Q01 · 它生成并执行应用，还是把回答变成卡片？](#detail-section-11)
  - [Q02 · 提示词到可见卡片的真实链和失败路径是什么？](#detail-section-12)
  - [Q03 · 卡片点击实际发什么，是否有会话/权限/结果保证？](#detail-section-13)
  - [Q04 · 提示档位保存在什么范围，保存失败/卸载会怎样？](#detail-section-14)
  - [Q05 · 谁值得怎样试，成本和退路是什么？](#detail-section-15)
  - [Q06 · 剩余可证伪方向是什么，哪些已有能力不应重提？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要同会话小图表和脱敏输入的DSH用户，隔离Host先一静态图表再单次动作，见 [Q01](#research-q01)/[Q05](#research-q05)。

Markdown图表/手打选项、手工已验证表单或前端页面。本包提供会话嵌入，外部审批/计算/事实正确仍另核。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 卡片 | 回复内结构化展示 | SDK/模型正确性未验 |
| continueChat | state发下一轮 | 立即submit/非业务受理 |
| 流式/主题 | partial repair与图表主题 | 非安全/事实验证 |
| prompt档位 | mini/standard/plus/off | renderer材料仍plus/共享mode |
| 保存/退出 | settings/section与slot清理 | 异步可假成功，off仍渲染旧卡 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 边界 |
| --- | --- | --- |
| Node>=20/匹配DSH slots/prompt/Web | 原生Host/Web | peer/README口径需成品验证 |
| 模型/系统prompt上下文 | 生成schema | 文本约束非事实验证 |
| 随包Vue/OpenTiny runtime | 实际卡片组件 | SDK内部安全未审 |
| Host inputActions | 动作发下一轮 | 依Host会话/权限/回执 |
| settings/可写profile | 档位持久 | 内存先改/失败可能200 |

#### 步骤

| 阶段 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 隔离profile/备份/off文字基线 | 核runtime/Host版本 |
| 静态 | 脱敏小图表/明确原数据 | 核数字/单位/Mock |
| 动作 | 无危险工具单次按钮 | 查draft/真实聊天与费用 |
| 失败 | 看原schema/Host日志/持久值 | 未确认不重复点 |
| 退出 | off/卸载/刷新 | 恢复官方renderer/手打 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工与未知 |
| --- | --- | --- |
| 首次 | Host/runtime/模型生成 | 兼容/数据核对，未测 |
| 持续 | 提示Token/schema/状态消息/DOM | 数值/交互/隐私检查 |
| 失败 | 重载/重复消息可能耗费 | 原schema/保存/路由排障 |
| 退出 | 聊天/配置保留 | 刷新卸载/脱敏导出，state恢复未知 |

#### 效果

| 项目 | 当前支持 | 未验证 |
| --- | --- | --- |
| 展示 | schema→真实SDK renderer | 计算/图形/无障碍正确 |
| 交互 | state→setDraft/submit | 接收一次/正确目标/后续结果 |
| 档位 | system prompt替换/删除 | 持久成功/多客户端一致 |
| 兼容 | 借官方reasoning/slot清理 | 所有Host版本/SDK沙箱 |
| 使用收益 | 同会话少手打 | 净Token/时间/错误率 |

> **思考**：动作立即提交整state/覆盖draft且无本层去重/回执；SDK安全未审，off只关提示，保存先内存后异步失败可200，runtime失败空卡，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把OpenTiny材料/renderer接入DSH回复与推理slot，并把卡片状态回传会话，减少手动拼接前端；SDK组件/Host模型执行不归本项原创，见 [Q01](#research-q01)-[Q03](#research-q03)。

Host/client/分离runtime和SDK适配接线明确；动作与持久确认、运行时错误和Host全局权限边界是核心限制，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

动作立即提交整state/覆盖draft且无本层去重/回执；SDK安全未审，off只关提示，保存先内存后异步失败可200，runtime失败空卡，见 [Q02](#research-q02)-[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离会话从一张脱敏静态图表开始，核原数据；动作只单次且查真实聊天，不把表单按钮当外部批准，费用/草稿/保存未知就停退文字，见 [Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定原生Host/Web0.3.1/source，46文件定向主链。核system prompt档位/生命周期、schema分段/SDK真render、runtime加载/失败、continueChat实际submit、prompt共享状态/异步持久与路由；未运行或审全部SDK材料/表达式安全、Host认证/输入回执/业务提交和成品兼容。

- 已检查：作者 README、包清单、源码路径 README.zh-CN.md、cordis.patch.yml、package.json、src/authoring-prompt.ts、src/client/GenuiAssistantNodeView.tsx、src/client/GenuiTextBody.tsx、src/client/GenuiVueCard.tsx、src/client/assistant-props.ts、src/client/genui-card-element.ts、src/client/genui-theme.ts、src/client/index.ts、src/client/load-genui-runtime.ts、src/client/prompt-toggle-button.tsx、src/client/split-assistant-text.ts、src/index.ts、src/prompt-control.ts、src/serve-genui-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根package/patch、Host apply/提示生成与控制路由；Web shadow/推理借slot、schema文本分段、React properties→Vue/OpenTiny真render/主题；runtime读取/script/错误；continueChat完整state/draft/submit；settings旧新适配/异步失败/卸载。未运行/全SDK材料/表达式安全、所有UI功能、Host认证/输入接受队列/模型权限/成品兼容。
- 下一步：- 下一步隔离静态脱敏图表与文字基线核数字/Mock/可读性，再单次动作查真实聊天。
- 禁写settings/缺runtime/旧卡双击只副本，区分内存/落盘/受理/结果。
- 未运行浏览器/模型/安装，费用/资源和效果未知。

**分析版本**

- **仓库**：[lhuans/dsh-genui](https://github.com/lhuans/dsh-genui)
- **版本号**：0.3.1（[固定提交 6328c64](https://github.com/lhuans/dsh-genui/tree/6328c64a0f0c4728a79ec5fe90818e0866f57045)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

runtime失败卡保留原schema/明确未渲染与手动重试，对照当前空error与整页重载；已有外层回退充分或净恢复无改善即否定，见 [Q06](#research-q06)。

- 下一步隔离静态脱敏图表与文字基线核数字/Mock/可读性，再单次动作查真实聊天。
- 禁写settings/缺runtime/旧卡双击只副本，区分内存/落盘/受理/结果。
- 未运行浏览器/模型/安装，费用/资源和效果未知。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 485 | — | — | 4031 |
| .ts | source | 25 | 1770 | 1304 | 329 | — |
| .tsx | source | 7 | 962 | 870 | 38 | — |
| .ts | test | 12 | 937 | 829 | 15 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/lhuans/dsh-genui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核原生提示/slot→runtime/SDK卡片→真实会话动作，区分SDK能力、身份/保存/失败与数据成本。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它生成并执行应用，还是把回答变成卡片？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定dsh-genui 0.3.1是原生DSH Host/Web插件：Host提供卡片创作提示与runtime静态路由，Web shadow官方assistant-step，把schemaJson嵌在回复中交Vue/OpenTiny渲染。不是独立站点部署器/表单后端，也不直接提供模型tool或第三方业务提交API。适合需要在同一会话看结构化小图表/填脱敏数据后继续问模型的用户；纯Markdown表格/手打选项是简单基线。

增量是DSH会话slot、SDK卡片与输入动作接线，组件/图表/表单能力主要来自OpenTiny GenUI材料与renderer。README截图/计算器/申请表是作者展示，未独立运行核所有组件/计算正确/业务提交；“提交申请”在本插件实际是继续对话，不是审批系统已经收件。根46文件定向主链，网站和SDK内部安全未全审。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-10](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/package.json#L1-L10)

真实包版本和功能描述。

<details>
<summary>查看原文（10行）</summary>

```text
{
  "name": "dsh-genui",
  "version": "0.3.1",
  "packageManager": "pnpm@11.21.0",
  "description": "GenUI for DeepSeek Harness: interactive charts, forms, calculators, dashboards, and mini apps rendered inline in assistant replies, with actions that flow back to the model.",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/lhuans/dsh-genui.git"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:33-52](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/package.json#L33-L52)

Host/client exports与files/Node。

<details>
<summary>查看原文（20行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "lib/genui-runtime.js",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=20"
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-8](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/cordis.patch.yml#L1-L8)

原生Host行。

```text
# GenUI prompt + card rendering for DeepSeek Harness Web.
# Install: dsh plugin --profile web add dsh-genui
- insert:
    - id: genui
      name: dsh-genui
      config:
        sectionOrder: 80
        sectionName: genui:cards
```

**依据 4 · 源码核查**：[src/index.ts:125-153](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/index.ts#L125-L153)

实际提示控制与默认模式。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // systemPrompt is provided by the web/base profile; typed loosely for out-of-tree builds.
  const systemPrompt = (ctx as Context & {
    systemPrompt: { section: (section: { name: string; order: number; text: string }) => () => void }
  }).systemPrompt
  const promptControl = createGenuiPromptControl({
    name: config.sectionName,
    order: config.sectionOrder,
    texts: {
      mini: genuiPromptText(miniMaterialsMeta),
      standard: genuiPromptText(materialsMeta),
      plus: genuiPromptText(plusMaterialsMeta),
    },
  }, systemPrompt)

  // The endpoint must read through this indirection because settings attach
  // asynchronously after the web route has already been registered.
  let currentControl: Pick<GenuiPromptControl, 'mode' | 'set'> = promptControl
  let persistedAttached = false
  const endpointControl: Pick<GenuiPromptControl, 'mode' | 'set'> & { persisted(): boolean } = {
    mode: () => currentControl.mode(),
    set: mode => currentControl.set(mode),
    persisted: () => persistedAttached,
  }

  // Authoring starts at standard; disposal keeps a reloaded plugin from leaking the section.
  ctx.effect(() => {
    promptControl.set(DEFAULT_PROMPT_MODE)
    return () => promptControl.set('off')
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:25-47](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/index.ts#L25-L47)

真实Web slot接线。

<details>
<summary>查看原文（23行）</summary>

```text
  prefetchGenuiRuntime()
  const locale = (ctx as Context & { locale: LocaleHost }).locale
  const host = ctx as Context & { slots: AssistantSlotLedger & {
    inject(name: string, register: () => () => void): () => void
  } }
  ctx.effect(() => locale.register('dsh-genui', { zh, en }), 'dsh-genui: prompt mode copy')
  host.slots.inject('conversation.input.left', () => host.slots.register({
    name: 'conversation.input.left',
    id: 'genui-prompt-toggle',
    order: 0,
    locale: 'dsh-genui',
  }, PromptToggleButton))
  // ui-chat owns assistant-step renderers and uses the `chat` locale namespace.
  // Omitting `locale` leaves `t` undefined and the view crashes; the slot then
  // abdicates to the built-in assistant-step (schemaJson shows as a Markdown
  // code fence — the failure mode users hit).
  host.slots.inject('conversation.chat.node', () => registerAssistantStep(host))
}

/** Ledger face used to find the shadow entry after it registers. */
interface AssistantSlotLedger {
  register(options: object, component: unknown): () => void
  entries?(name: string): readonly (BorrowableSlotEntry & AssistantStepEntry)[]
```

</details>

**依据 6 · 源码核查**：[src/client/genui-card-element.ts:55-67](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/genui-card-element.ts#L55-L67)

实际把schema交SDK材料/renderer。

<details>
<summary>查看原文（13行）</summary>

```text
    return () => h(GenuiConfigProvider, {
      materials: plusMaterials,
      id,
      theme: themeMode.value,
    }, {
      default: () => h(GenuiRenderer, {
        content: themedContent.value.content,
        generating: props.generating,
        isJsonComplete: themedContent.value.isJsonComplete,
        customActions: props.customActions,
      }),
    })
  },
```

</details>

**依据 7 · 作者声明**：[README.zh-CN.md:17-35](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/README.zh-CN.md#L17-L35)

作者截图/计算器/表单展示，未视为独立验证。

<details>
<summary>查看原文（19行）</summary>

```text
## 先看三个真实例子

下面三张都是 DSH 里的实际截图，不是效果图。

### 说「生成一个计算器」

![DSH 对话里渲染出的计算器](./public/computer.webp)

数字键、四则运算、括号、退格、清空，全都能按。算出来的 666 是真按出来的，不是 AI 写在文字里的。

### 说「生成一个表单」

![DSH 对话里渲染出的项目立项申请表](./public/form.webp)

一句话生成一整张立项申请表：必填校验、单选按钮组、下拉框、人数步进器、日期选择、开关、多选框、长文本，一次到位。

填完点「提交申请」，你填的内容会带回对话里，AI 可以接着帮你判断优先级、生成排期，或者直接写成一份立项说明。

### 说「用折线图展示最近 7 天访问量」
```

</details>

#### 缺口

- 未运行DSH/模型/SDK组件/实际表单业务，也未审全部网站与SDK。
  **影响**：只能确认会话渲染整合，不能保证计算/提交业务正确。
  **进一步探讨**：隔离会话生成脱敏静态图表，核数字/原数据/是否仍能正常文字回复，再单独验证动作。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提示词到可见卡片的真实链和失败路径是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Host从GenUI genPrompt+materials元数据生成mini/standard/plus文本并替换强制全卡/Mock说明，注册systemPrompt.section；普通问答应文字、缺数据示例要显式标示、未做动作不得称已完成都是提示约束，不是程序事实验证。默认standard、off只移除创作提示，已存在schema仍会渲染，renderer材料实际总是plusMaterials，所以mini不是运行时权限白名单。

Web shadow assistant-step，reasoning仍借官方renderer/slot，回复text经splitAssistantText提取反引号或XML schemaJson，完整/未闭合流式段分开，连续无prose的卡合成数组；这只是文本结构解析，不是schema/计算安全验证。GenuiTextBody将段交React GenuiVueCard，runtime共享Promise动态module script加载同源/dsh-genui/runtime.js并确认custom element定义；idle预取也会加载，不是必须首卡才开始。

card通过properties传content/generating/isJsonComplete/customActions，Vue custom element用light DOM，parseThemedContent调用SDK repairJson并递归改图表主题，再h GenuiConfigProvider/GenuiRenderer真实渲染。无iframe安全边界；SDK内部表达式/材料/网络能力未审，不据README“塞不进HTML/脚本”给绝对安全承诺。runtime缺文件404→loader reject，card只渲染空error div且console error，没有这里的原schema文本/可读错误/重试按钮；loader允许未来新调用重试，但已error组件effect不再loading，不能承诺本卡自动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:114-139](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/index.ts#L114-L139)

真实genPrompt生成各档及control。

<details>
<summary>查看原文（26行）</summary>

```text
 * priority, so each tier is rewritten with the same DSH replacements.
 */
function genuiPromptText(meta: IMaterialsMeta): string {
  return adjustAuthoringPrompt(genPrompt('Vue', meta, CONTINUE_CHAT))
}

/**
 * Register the GenUI runtime and the authoring prompt toggle.
 * @param ctx - Cordis context with `systemPrompt` injected.
 * @param config - validated plugin config.
 */
export function apply(ctx: Context, config: Config): void {
  // systemPrompt is provided by the web/base profile; typed loosely for out-of-tree builds.
  const systemPrompt = (ctx as Context & {
    systemPrompt: { section: (section: { name: string; order: number; text: string }) => () => void }
  }).systemPrompt
  const promptControl = createGenuiPromptControl({
    name: config.sectionName,
    order: config.sectionOrder,
    texts: {
      mini: genuiPromptText(miniMaterialsMeta),
      standard: genuiPromptText(materialsMeta),
      plus: genuiPromptText(plusMaterialsMeta),
    },
  }, systemPrompt)

```

</details>

**依据 2 · 源码核查**：[src/authoring-prompt.ts:7-31](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/authoring-prompt.ts#L7-L31)

提示替换/Mock标示/禁止虚报均为文本规则。

<details>
<summary>查看原文（25行）</summary>

```text
const TASK_REPLACEMENT = `# 任务说明

按任务类型选择输出格式：

- 需要卡片时：任务适合用卡片、图表、表格、表单来展示数据、展示结构化信息或收集输入，或用户明确要求生成卡片时，只输出一个 \`\`\`schemaJson 代码块，代码块前后不添加额外说明。
- 不需要卡片时：写代码、排查问题、执行命令、解释原理、日常问答、方案讨论等普通任务，直接用文字回答，不要输出 schemaJson，也不要把文字内容塞进卡片里。
- 不要为了满足格式把普通回答改写成卡片，也不要生成只有标题没有内容的空卡片。`

const COMPONENT_LINE = '根据用户输入，挑选合适的组件生成对应卡片的 schemaJSON。请尽量使用丰富的 UI 组件生成漂亮的卡片。'

const COMPONENT_REPLACEMENT = '需要生成卡片时，根据用户输入挑选合适的组件生成对应卡片的 schemaJSON。请尽量使用丰富的 UI 组件生成漂亮的卡片。'

const MOCK_LINE = '- 如果上下文或者工具调用结果中没有可用数据，可以使用Mock数据来完成会话'

const MOCK_REPLACEMENT = '- 如果上下文或者工具调用结果中没有可用数据，可以使用 Mock 数据来完成会话，但必须在卡片内用可见文字标注「示例数据」'

const PRIORITY_LINES = `- 如果有信息要展示，请主动生成卡片
- 如果需要用户提供更多信息补充，请主动生成表单卡片`

const PRIORITY_REPLACEMENT = `- 只有适合用卡片展示的信息才生成卡片；写代码、排查问题、执行命令、解释原理、日常问答直接用文字回答，不要输出 schemaJson
- 需要用户补充信息且适合用表单收集时，再生成表单卡片；不适合时直接用文字追问
- 禁止在 schemaJson 中断言未实际执行的动作（如「已验证」「已安装」「已生效」）；未执行的只能写「待执行」`

/**
 * Rewrite the stock GenUI authoring prompt.
```

</details>

**依据 3 · 源码核查**：[src/prompt-control.ts:155-183](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/prompt-control.ts#L155-L183)

实际section替换/删除。

<details>
<summary>查看原文（29行）</summary>

```text
export function createGenuiPromptControl(
  section: {
    name: string
    order: number
    texts: Record<GenuiActivePromptMode, string>
  },
  systemPrompt: GenuiSystemPrompt,
): GenuiPromptControl {
  let disposer: (() => void) | undefined
  let mode: GenuiPromptMode = 'off'
  return {
    mode: () => mode,
    isEnabled: () => mode !== 'off',
    set(next) {
      if (next === mode) return mode
      disposer?.()
      disposer = undefined
      mode = next
      if (next !== 'off') {
        disposer = systemPrompt.section({
          name: section.name,
          order: section.order,
          text: section.texts[next],
        })
      }
      return mode
    },
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:25-47](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/index.ts#L25-L47)

idle预取与shadow注册。

<details>
<summary>查看原文（23行）</summary>

```text
  prefetchGenuiRuntime()
  const locale = (ctx as Context & { locale: LocaleHost }).locale
  const host = ctx as Context & { slots: AssistantSlotLedger & {
    inject(name: string, register: () => () => void): () => void
  } }
  ctx.effect(() => locale.register('dsh-genui', { zh, en }), 'dsh-genui: prompt mode copy')
  host.slots.inject('conversation.input.left', () => host.slots.register({
    name: 'conversation.input.left',
    id: 'genui-prompt-toggle',
    order: 0,
    locale: 'dsh-genui',
  }, PromptToggleButton))
  // ui-chat owns assistant-step renderers and uses the `chat` locale namespace.
  // Omitting `locale` leaves `t` undefined and the view crashes; the slot then
  // abdicates to the built-in assistant-step (schemaJson shows as a Markdown
  // code fence — the failure mode users hit).
  host.slots.inject('conversation.chat.node', () => registerAssistantStep(host))
}

/** Ledger face used to find the shadow entry after it registers. */
interface AssistantSlotLedger {
  register(options: object, component: unknown): () => void
  entries?(name: string): readonly (BorrowableSlotEntry & AssistantStepEntry)[]
```

</details>

**依据 5 · 源码核查**：[src/client/split-assistant-text.ts:43-121](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/split-assistant-text.ts#L43-L121)

实际文本分段/合并/partial处理。

<details>
<summary>查看原文（79行）</summary>

```text
 * @returns ordered segments for mixed markdown + GenUI rendering.
 */
export function splitAssistantText(text: string, streaming: boolean, interrupted = false): TextSegment[] {
  const live = streaming || interrupted
  const segments: TextSegment[] = []

  // Collect matches from both formats, deduplicated by position.
  const matches: Array<{ index: number; end: number; text: string }> = []

  // Check for backtick-fence format
  COMPLETE_FENCE.lastIndex = 0
  for (const match of text.matchAll(COMPLETE_FENCE)) {
    matches.push({ index: match.index ?? 0, end: (match.index ?? 0) + match[0].length, text: match[1] ?? '' })
  }

  // Check for XML-tag format
  COMPLETE_TAG.lastIndex = 0
  for (const match of text.matchAll(COMPLETE_TAG)) {
    matches.push({ index: match.index ?? 0, end: (match.index ?? 0) + match[0].length, text: match[1] ?? '' })
  }

  // Sort by position and deduplicate (if both formats overlap, first wins — backtick fence format was found first above)
  matches.sort((a, b) => a.index - b.index)
  const unique: typeof matches = []
  let lastEnd = -1
  for (const m of matches) {
    if (m.index >= lastEnd) {
      unique.push(m)
      lastEnd = m.end
    }
  }

  // Build segments from unique matches, merging consecutive schema blocks
  // into a JSON array so the Vue renderer mounts a single card (avoiding
  // the DSH client streaming-reconciliation crash that happens when
  // multiple cards are mounted in one turn).
  let last = 0
  let schemaBuffer: string[] = []
  function flushSchemaBuffer() {
    if (schemaBuffer.length === 0) return
    const merged = schemaBuffer.length === 1
      ? schemaBuffer[0]
      : '[' + schemaBuffer.join(',') + ']'
    segments.push({ kind: 'schema', text: merged, complete: true })
    schemaBuffer = []
  }
  for (const { index, end, text: content } of unique) {
    if (index > last) {
      flushSchemaBuffer()
      segments.push({ kind: 'markdown', text: text.slice(last, index) })
    }
    schemaBuffer.push(content)
    last = end
  }
  flushSchemaBuffer()

  const rest = text.slice(last)
  if (rest.length === 0) return segments
  if (live) {
    // Check for open backtick fence
    const open = OPEN_FENCE.exec(rest)
    if (open !== null && open.index !== undefined) {
      const before = rest.slice(0, open.index)
      if (before.length > 0) segments.push({ kind: 'markdown', text: before })
      segments.push({ kind: 'schema', text: open[1] ?? '', complete: false })
      return segments
    }
    // Check for open XML tag
    const openTag = OPEN_TAG.exec(rest)
    if (openTag !== null && openTag.index !== undefined) {
      const before = rest.slice(0, openTag.index)
      if (before.length > 0) segments.push({ kind: 'markdown', text: before })
      segments.push({ kind: 'schema', text: openTag[1] ?? '', complete: false })
      return segments
    }
  }
  segments.push({ kind: 'markdown', text: rest })
  return segments
}
```

</details>

**依据 6 · 源码核查**：[src/client/GenuiTextBody.tsx:23-60](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiTextBody.tsx#L23-L60)

实际段传给card。

<details>
<summary>查看原文（38行）</summary>

```text
/** Render markdown segments and schemaJson fences as GenUI cards. */
export const GenuiTextBody = memo(function GenuiTextBody({
  text, streaming, interrupted, labels, mentions, customActions,
}: GenuiTextBodyProps) {
  const segments = useMemo(
    () => splitAssistantText(text, streaming, interrupted),
    [text, streaming, interrupted],
  )
  const nodes: ReactNode[] = []
  for (let i = 0; i < segments.length; i++) {
    const segment = segments[i]
    if (segment === undefined) continue
    if (segment.kind === 'markdown') {
      if (segment.text.trim().length === 0) continue
      nodes.push(
        <MarkdownText
          key={`md-${i}`}
          text={segment.text}
          streaming={streaming}
          labels={labels}
          fileMentions={mentions}
        />,
      )
      continue
    }
    nodes.push(
      <GenuiVueCard
        key={`schema-${i}`}
        className={css.card}
        content={segment.text}
        generating={streaming && !segment.complete}
        isJsonComplete={segment.complete}
        customActions={customActions}
      />,
    )
  }
  return <>{nodes}</>
})
```

</details>

**依据 7 · 源码核查**：[src/client/load-genui-runtime.ts:14-49](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/load-genui-runtime.ts#L14-L49)

真实script请求/共享loading/错误与idle预取。

<details>
<summary>查看原文（36行）</summary>

```text
export function loadGenuiRuntime(): Promise<void> {
  if (alreadyDefined()) return Promise.resolve()
  if (loading !== undefined) return loading
  if (typeof document === 'undefined') {
    return Promise.reject(new Error('dsh-genui: Vue runtime requires a document'))
  }
  loading = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.type = 'module'
    script.src = GENUI_RUNTIME_URL
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => {
      loading = undefined
      script.remove()
      reject(new Error(`dsh-genui: failed to load ${GENUI_RUNTIME_URL}`))
    }, { once: true })
    document.head.appendChild(script)
  }).then(() => {
    if (!alreadyDefined()) {
      loading = undefined
      throw new Error('dsh-genui: Vue runtime loaded but <dsh-genui-card> was not defined')
    }
  })
  return loading
}

/** Kick off {@link loadGenuiRuntime} without blocking plugin registration. */
export function prefetchGenuiRuntime(): void {
  const start = (): void => {
    void loadGenuiRuntime().catch(() => {
      // First-card render will retry; boot must not surface a rejected idle task.
    })
  }
  if (typeof requestIdleCallback === 'function') requestIdleCallback(start)
  else setTimeout(start, 0)
}
```

</details>

**依据 8 · 源码核查**：[src/client/GenuiVueCard.tsx:37-80](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiVueCard.tsx#L37-L80)

属性传递与空error/pending/ready节点。

<details>
<summary>查看原文（44行）</summary>

```text
  ))

  useEffect(() => {
    if (status !== 'loading') return
    let cancelled = false
    void loadGenuiRuntime().then(
      () => { if (!cancelled) setStatus('ready') },
      (err: unknown) => {
        console.error(err)
        if (!cancelled) setStatus('error')
      },
    )
    return () => { cancelled = true }
  }, [status])

  useLayoutEffect(() => {
    if (status !== 'ready') return
    const el = ref.current
    if (el === null) return
    el.content = content
    el.generating = generating
    el.isJsonComplete = isJsonComplete
    el.customActions = customActions
  }, [status, content, generating, isJsonComplete, customActions])

  if (status === 'error') {
    return createElement('div', {
      className,
      'data-dsh-genui-card-error': '',
    })
  }
  if (status !== 'ready') {
    return createElement('div', {
      className,
      'data-dsh-genui-card-pending': '',
      'aria-busy': true,
    })
  }
  return createElement(DSH_GENUI_CARD_TAG, {
    ref,
    className,
    'data-dsh-genui-card': '',
  })
})
```

</details>

**依据 9 · 源码核查**：[src/client/genui-card-element.ts:32-71](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/genui-card-element.ts#L32-L71)

真实SDK render、材料固定plus/lightDOM。

<details>
<summary>查看原文（40行）</summary>

```text
  },
  setup(props) {
    const id = `dsh-genui-card-${++cardSeq}`
    const themeMode = ref<'light' | 'dark'>(isDarkMode() ? 'dark' : 'light')
    const themedContent = computed(() => (
      parseThemedContent(props.content, themeMode.value === 'dark', props.isJsonComplete)
    ))

    // Follow DSH host theme switches live (Settings → Appearance, or OS when
    // preference is "system"). body[data-ds-dark-theme] is the stable signal.
    let observer: MutationObserver | undefined
    onMounted(() => {
      observer = new MutationObserver(() => {
        const dark = isDarkMode()
        const next = dark ? 'dark' : 'light'
        if (themeMode.value !== next) {
          themeMode.value = next
        }
      })
      observer.observe(document.body, { attributes: true, attributeFilter: [DARK_ATTR] })
    })
    onUnmounted(() => void observer?.disconnect())

    return () => h(GenuiConfigProvider, {
      materials: plusMaterials,
      id,
      theme: themeMode.value,
    }, {
      default: () => h(GenuiRenderer, {
        content: themedContent.value.content,
        generating: props.generating,
        isJsonComplete: themedContent.value.isJsonComplete,
        customActions: props.customActions,
      }),
    })
  },
})

/** Vue 3.5: light DOM so TinyVue popovers/teleports and theme CSS work. */
export const DshGenuiCardElement = defineCustomElement(DshGenuiCard, { shadowRoot: false })
```

</details>

**依据 10 · 源码核查**：[src/client/genui-theme.ts:50-69](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/genui-theme.ts#L50-L69)

真实repairJson/主题处理，非安全验证。

<details>
<summary>查看原文（20行）</summary>

```text
export function parseThemedContent(
  content: string | Record<string, unknown>,
  dark: boolean,
  isJsonComplete = true,
): { content: string | Record<string, unknown>; isJsonComplete: boolean } {
  if (typeof content !== 'string') {
    return { content: applyChartTheme(content, dark) as Record<string, unknown>, isJsonComplete }
  }
  if (!content.trim()) return { content: {}, isJsonComplete: true }

  const repaired = repairJson(content)
  if (!repaired.value || typeof repaired.value !== 'object') {
    return { content, isJsonComplete }
  }

  return {
    content: applyChartTheme(repaired.value, dark) as Record<string, unknown>,
    isJsonComplete: repaired.state === RepairJsonState.SUCCESS,
  }
}
```

</details>

**依据 11 · 源码核查**：[src/serve-genui-runtime.ts:28-46](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/serve-genui-runtime.ts#L28-L46)

实际读artifact/方法/404。

<details>
<summary>查看原文（19行）</summary>

```text
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      res.writeHead(405)
      res.end()
      return
    }
    try {
      const body = await readFile(filePath)
      res.writeHead(200, {
        'content-type': contentType,
        'cache-control': 'no-cache',
      })
      res.end(req.method === 'HEAD' ? undefined : body)
    } catch {
      res.writeHead(404)
      res.end()
    }
  }
```

</details>

#### 缺口

- 未运行流式/中断/多卡、SDK解析/表达式/材料安全和所有Host版本slot兼容。
  **影响**：render函数调用不证明内容正确/可访问性与安全，空error可能丢可读答复。
  **进一步探讨**：可信schema正常/半截/坏runtime三副本对照原Markdown，核实际显示/恢复/主题；不将Mock提示视为硬约束。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 卡片点击实际发什么，是否有会话/权限/结果保证？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

本项唯一显式custom action continueChat从params.message取String、context.state JSON.stringify，组合短消息和整份state，然后inputActions.setDraft并立刻submit。message空/无inputActions静默return；state循环等序列化失败静默改{}仍可提交。它不是仅把值填入草稿让人再按发送，可能覆盖当前draft并立即触发模型后续工具流程和Token费用。表单里隐含/未展示的state也可能进入下一轮，不能填真实秘密/个人数据。

本组件没有对动作加原生成turn/来源id绑定校验、幂等requestId、重复点击去重、单独发送预览或执行权限确认；实际会话路由依Host给的inputActions，sessionId在此文件另用于file mentions，不是动作授权。不能据此断言跨会话已利用，也不能以按钮标签当用户授权了后续任意Host工具；原Host工具权限/审批仍要保留。callback同步void，不await submit/检查受理回执/显示失败，点击不等新一轮已经被接受、更不等业务结果完成。

生成中/中断schema可作为partial传SDK，custom action回调自己未按turn status/complete检查；是否SDK会禁用这些状态的动作未审。旧卡继续可交互、重复点与草稿冲突需单独核，不以生成中灰态想象保证。最小试用只无敏感数据，先静态卡，再在无危险工具隔离Host单次按钮核聊天记录/真实调用。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/GenuiAssistantNodeView.tsx:41-52](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiAssistantNodeView.tsx#L41-L52)

真实node状态/props与sessionId来源。

<details>
<summary>查看原文（12行）</summary>

```text
  const {
    node, renderMessageImages, fileMentions, loadImage, t, useTurnData, openFile, inputActions, groupPart,
    renderSlot,
  } = props
  const sessionId = (props as { sessionId?: unknown }).sessionId
  const data = node.data
  const streaming = data.status === 'running'
  const interrupted = data.status === 'interrupted'
  const turn = node.location.kind === 'turn' || node.location.kind === 'step'
    ? node.location.turn
    : undefined
  const tail = useTurnData('turn-tail')
```

</details>

**依据 2 · 源码核查**：[src/client/GenuiAssistantNodeView.tsx:78-99](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiAssistantNodeView.tsx#L78-L99)

完整动作：message/state→setDraft→立即submit，无回执。

<details>
<summary>查看原文（22行）</summary>

```text
  const customActions = useMemo<Record<string, ICustomAction>>(() => ({
    continueChat: {
      name: 'continueChat',
      description: 'Continue the chat with a follow-up user message.',
      // Match GenUI Chat: short button label + card state (formData, …) for the model.
      execute: (params, context) => {
        const message = typeof params === 'object' && params !== null && 'message' in params
          ? String((params as { message: unknown }).message)
          : ''
        if (message.trim().length === 0 || inputActions === undefined) return
        let stateJson = '{}'
        try {
          stateJson = JSON.stringify(context?.state ?? {})
        } catch {
          stateJson = '{}'
        }
        const draft = `${message},相关参数为：${stateJson}`
        inputActions.setDraft(draft)
        inputActions.submit()
      },
    },
  }), [inputActions])
```

</details>

**依据 3 · 源码核查**：[src/client/GenuiAssistantNodeView.tsx:111-122](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiAssistantNodeView.tsx#L111-L122)

实际customActions传给text/card。

<details>
<summary>查看原文（12行）</summary>

```text
        rendered.push(
          <GenuiTextBody
            key={i}
            text={text}
            streaming={streaming}
            interrupted={interrupted}
            labels={labels}
            mentions={mentions}
            customActions={customActions}
          />,
        )
        break
```

</details>

**依据 4 · 源码核查**：[src/client/GenuiTextBody.tsx:45-57](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiTextBody.tsx#L45-L57)

流式/complete和actions分别传SDK。

<details>
<summary>查看原文（13行）</summary>

```text
      )
      continue
    }
    nodes.push(
      <GenuiVueCard
        key={`schema-${i}`}
        className={css.card}
        content={segment.text}
        generating={streaming && !segment.complete}
        isJsonComplete={segment.complete}
        customActions={customActions}
      />,
    )
```

</details>

**依据 5 · 源码核查**：[src/client/GenuiVueCard.tsx:53-61](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiVueCard.tsx#L53-L61)

真实custom element属性接线。

```text
    if (status !== 'ready') return
    const el = ref.current
    if (el === null) return
    el.content = content
    el.generating = generating
    el.isJsonComplete = isJsonComplete
    el.customActions = customActions
  }, [status, content, generating, isJsonComplete, customActions])

```

**依据 6 · 源码核查**：[src/client/assistant-props.ts:25-29](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/assistant-props.ts#L25-L29)

Host输入面返回void契约。

```text
/** Session-kit input face (setDraft + submit) from conversation session provide. */
export interface GenuiInputActions {
  readonly setDraft: (text: string) => void
  readonly submit: () => void
}
```

#### 缺口

- 未核当前Host输入队列/接收回执/会话身份、SDK生成中动作禁用或后续模型工具审批。
  **影响**：本项可证动作提交意图，不能保证一次/正确会话/后续动作完成。
  **进一步探讨**：副本已有draft/双击/旧卡/中断四样本看真实会话请求数与丢字段；敏感状态或未确认路由立即停动作退手打。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 提示档位保存在什么范围，保存失败/卸载会怎样？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

Host每个插件apply持一promptControl，endpoint GET/POST共享该mode；没有session参数，所以输入框菜单是profile/实例共享提示状态，不是每卡/每会话独立模式。apply先standard，settings异步附加后读旧register scope或0.2 describe/update；entry选择优先genui/dsh-genui、没有唯一匹配回genui。Host服务适配是duck-typing，真实volatile/settings版本兼容未运行验收。

createPersistedPromptControl先改内存section，再void settings.update.catch仅日志，handler立即200 mode；GET persisted只代表settings附加，不能说本次已耐久。菜单POST失败会回前值/disable，但异步写盘失败已经200时UI不会获知，重启可能回旧mode；本轮未复现、不承诺保存成功。连续多个客户端可写同一共享mode，未见本层串行/版本冲突控制。

handler只判方法、mode枚举和256字节JSON上限，注释same-origin-only未落实socket/Host/Origin/token检查；它依赖Host整体认证，不能称本包自带同源授权或远程不可改。本轮不审Host，亦不声称已利用。卸载effect移除section与routes，settings detach不保存cleanup off；Web清shadow/borrow/订阅，但customElements定义、已加载module script和样式属document级，本项无撤销注册机制，不把off当卸载/安全隔离。表单临时state是否持久/刷新恢复依SDK未验。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:141-181](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/index.ts#L141-L181)

共享mode/标准初始化/异步settings附加/卸载cleanup。

<details>
<summary>查看原文（41行）</summary>

```text
  // asynchronously after the web route has already been registered.
  let currentControl: Pick<GenuiPromptControl, 'mode' | 'set'> = promptControl
  let persistedAttached = false
  const endpointControl: Pick<GenuiPromptControl, 'mode' | 'set'> & { persisted(): boolean } = {
    mode: () => currentControl.mode(),
    set: mode => currentControl.set(mode),
    persisted: () => persistedAttached,
  }

  // Authoring starts at standard; disposal keeps a reloaded plugin from leaking the section.
  ctx.effect(() => {
    promptControl.set(DEFAULT_PROMPT_MODE)
    return () => promptControl.set('off')
  }, 'dsh-genui: prompt mode state')

  ctx.inject(['settings'], (settingsCtx) => {
    const settings = (settingsCtx as Context & { settings: PromptSettingsHost }).settings
    const scope = openPromptSettings(settings, {
      configMode: config.promptMode,
      configEnabled: config.promptEnabled !== false,
      schema: PromptSettings,
    })
    if (scope === undefined) {
      ctx.logger.warn('dsh-genui: prompt mode will not persist')
      return
    }
    ctx.logger.debug('dsh-genui: settings service attached')
    settingsCtx.effect(() => {
      // Persist explicit choices, but never write the unload-time cleanup state.
      const persistedControl = createPersistedPromptControl(promptControl, scope, DEFAULT_PROMPT_MODE, error => {
        ctx.logger.warn('dsh-genui: failed to persist prompt state', error)
      }, mode => {
        ctx.logger.debug('dsh-genui: persisting prompt state mode=%s', mode)
      })
      currentControl = persistedControl
      persistedAttached = true
      return () => {
        currentControl = promptControl
        persistedAttached = false
      }
    }, 'dsh-genui: persisted prompt control')
```

</details>

**依据 2 · 源码核查**：[src/prompt-control.ts:66-115](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/prompt-control.ts#L66-L115)

实际legacy/register与describe/update entry选择。

<details>
<summary>查看原文（50行）</summary>

```text
export function findPromptSettingsEntry(descriptors: readonly PromptSettingsDescriptor[]): string | undefined {
  const matches = descriptors.filter(mentionsPromptSettings)
  for (const id of PROMPT_ENTRY_PREFERENCE) {
    if (matches.some(descriptor => descriptor.ns === id)) return id
  }
  return matches.length === 1 ? matches[0]?.ns : undefined
}

function mentionsPromptSettings(descriptor: PromptSettingsDescriptor): boolean {
  const value = descriptor.value
  if (value !== null && typeof value === 'object') {
    if ('promptEnabled' in value || 'promptMode' in value) return true
  }
  const schema = JSON.stringify(descriptor.schema ?? null)
  return schema.includes('"promptEnabled"') || schema.includes('"promptMode"')
}

/**
 * Open the settings scope for the prompt mode.
 * @param settings - host settings service.
 * @param options.configMode - resolved Config `promptMode`, when one was stored.
 * @param options.configEnabled - resolved Config `promptEnabled`.
 * @param options.schema - legacy `settings.register` schema.
 * @returns A get/update scope, or undefined when this host cannot persist the choice.
 */
export function openPromptSettings(
  settings: PromptSettingsHost,
  options: { configMode?: unknown; configEnabled: boolean; schema: unknown },
): GenuiPromptSettingsScope | undefined {
  if (typeof settings.register === 'function') {
    return settings.register('dsh-genui', options.schema)
  }
  if (typeof settings.update !== 'function') return undefined
  const update = settings.update.bind(settings)
  return {
    get: () => ({
      mode: isGenuiPromptMode(options.configMode) ? options.configMode : undefined,
      enabled: options.configEnabled,
    }),
    update(patch) {
      const described = typeof settings.describe === 'function' ? settings.describe() : []
      const ns = findPromptSettingsEntry(described) ?? 'genui'
      return update(ns, {
        promptMode: patch.mode,
        promptEnabled: patch.mode !== 'off',
      })
    },
  }
}

```

</details>

**依据 3 · 源码核查**：[src/prompt-control.ts:129-146](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/prompt-control.ts#L129-L146)

先改内存再fire-and-forget持久失败仅回调。

<details>
<summary>查看原文（18行）</summary>

```text
export function createPersistedPromptControl(
  control: GenuiPromptControl,
  settings: GenuiPromptSettingsScope,
  initialMode: GenuiPromptMode,
  onError?: (error: unknown) => void,
  onPersist?: (mode: GenuiPromptMode) => void,
): GenuiPromptControl {
  control.set(resolvePromptMode(settings.get(), initialMode))
  return {
    mode: control.mode,
    isEnabled: control.isEnabled,
    set(mode) {
      const next = control.set(mode)
      onPersist?.(next)
      void settings.update({ mode: next, enabled: next !== 'off' }).catch(error => onError?.(error))
      return next
    },
  }
```

</details>

**依据 4 · 源码核查**：[src/prompt-control.ts:190-245](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/prompt-control.ts#L190-L245)

真实handler无额外身份门，256B解析和返回。

<details>
<summary>查看原文（56行）</summary>

```text
export function createGenuiPromptControlHandler(
  control: Pick<GenuiPromptControl, 'mode' | 'set'> & { persisted?: () => boolean },
): (req: IncomingMessage, res: ServerResponse) => Promise<void> {
  return async (req, res) => {
    if (req.method === 'GET') {
      respond(res, 200, {
        mode: control.mode(),
        ...(control.persisted === undefined ? {} : { persisted: control.persisted() }),
      })
      return
    }
    if (req.method !== 'POST') {
      respond(res, 405, { error: 'method-not-allowed' })
      return
    }
    try {
      const payload = await readJsonObject(req)
      if (!isGenuiPromptMode(payload.mode)) {
        respond(res, 400, { error: 'mode-must-be-known' })
        return
      }
      respond(res, 200, { mode: control.set(payload.mode) })
    } catch {
      respond(res, 400, { error: 'invalid-json' })
    }
  }
}

async function readJsonObject(req: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = []
  let total = 0
  for await (const chunk of req) {
    const buffer = Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk)
    total += buffer.length
    if (total > 256) throw new Error('body-too-large')
    chunks.push(buffer)
  }
  if (chunks.length === 0) return {}
  const parsed: unknown = JSON.parse(Buffer.concat(chunks).toString('utf8'))
  if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('body-must-be-object')
  }
  return parsed as Record<string, unknown>
}

function respond(
  res: ServerResponse,
  status: number,
  body: Record<string, unknown>,
): void {
  res.writeHead(status, {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store',
  })
  res.end(JSON.stringify(body))
}
```

</details>

**依据 5 · 源码核查**：[src/client/prompt-toggle-button.tsx:82-109](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/prompt-toggle-button.tsx#L82-L109)

实际POST与仅HTTP错误回滚。

<details>
<summary>查看原文（28行）</summary>

```text
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: next }),
      })
      if (!response.ok) throw new Error(String(response.status))
      const state = await response.json() as { mode?: unknown }
      if (!isGenuiPromptMode(state.mode)) throw new Error('bad-mode')
      setMode(state.mode)
      setAvailable(true)
    } catch {
      setMode(previous)
      setAvailable(false)
    } finally {
      setBusy(false)
    }
  }, [available, busy, mode])

  const placeMenu = useCallback(() => {
    const button = buttonRef.current
    if (button === null) return
    const rect = button.getBoundingClientRect()
    setMenuPoint({ left: rect.left, top: rect.top - 4 })
  }, [])

  useLayoutEffect(() => {
    if (!open) return
    placeMenu()
    window.addEventListener('resize', placeMenu)
    window.addEventListener('scroll', placeMenu, true)
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:64-89](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/index.ts#L64-L89)

shadow/borrow/订阅真实disposer。

<details>
<summary>查看原文（26行）</summary>

```text
    key: 'assistant-step',
    priority: ASSISTANT_STEP_PRIORITY,
    locale: 'chat',
  }, GenuiAssistantNodeView)
  const entry = slots.entries?.('conversation.chat.node')?.find((item) =>
    item.component === GenuiAssistantNodeView && item.options.key === 'assistant-step')
  const syncBuiltin = (): void => {
    const entries = slots.entries?.('conversation.chat.node')
    if (entries !== undefined) captureBuiltinAssistant(entries, GenuiAssistantNodeView)
  }
  const disposeWatch = ctx.effect(() => {
    syncBuiltin()
    return slots.subscribe?.('conversation.chat.node', syncBuiltin) ?? (() => {})
  }, 'dsh-genui: built-in assistant view')
  const disposeBorrow = ctx.effect(() => {
    if (entry !== undefined) borrowReasoningBody(entry)
    return () => {
      if (entry !== undefined) releaseBorrowedReasoningBody(entry)
    }
  }, 'dsh-genui: borrow reasoning body slot')
  return () => {
    disposeBorrow()
    disposeWatch()
    disposeEntry()
  }
}
```

</details>

**依据 7 · 源码核查**：[src/client/genui-card-element.ts:70-80](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/genui-card-element.ts#L70-L80)

document级customElements定义。

<details>
<summary>查看原文（11行）</summary>

```text
/** Vue 3.5: light DOM so TinyVue popovers/teleports and theme CSS work. */
export const DshGenuiCardElement = defineCustomElement(DshGenuiCard, { shadowRoot: false })

/** Register `dsh-genui-card` once per browser document. */
export function ensureDshGenuiCardDefined(): void {
  if (typeof customElements === 'undefined') return
  if (customElements.get(DSH_GENUI_CARD_TAG) !== undefined) return
  customElements.define(DSH_GENUI_CARD_TAG, DshGenuiCardElement)
}

ensureDshGenuiCardDefined()
```

</details>

#### 缺口

- 未验Host认证/全settings写盘/多浏览器冲突、SDKstate持久和完整document资源退出。
  **影响**：mode/section生效、持久与UI回执要区分，不能把off等同撤掉卡片。
  **进一步探讨**：副本禁写settings、双客户端改mode再重启看真实值；退出清卡/卸插件后刷新页面核原renderer，必要恢复原配置。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得怎样试，成本和退路是什么？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要同会话小图表/脱敏输入的用户，可隔离DSH profile固定0.3.1，核实际Host slot/系统prompt/Web服务与成品runtime，先off保留普通回复基线，再mini/standard生成一张来源明确的小静态图表。数字/单位/Mock标记由人对原数据核，生成卡不证明计算正确。之后无危险工具/无敏感数据单次continueChat核草稿/聊天记录，重复/旧卡/生成中动作首试不做。

首次依赖匹配Host/Node>=20、React宿主和随包Vue/OpenTiny runtime；源码peer范围/README Host0.2.2建议有不同口径，实际支持需按当前成品验证，不推包宽范围都可用。持续authoring prompt档位占上下文、模型生成schema和动作整state追加会消耗Token，SDK/图表/DOM和idle预取有浏览器带宽/CPU/内存；价格/Prompt长度/成功率/工时未测。mini只缩创作提示，不把renderer材料权限缩到mini，也不是整会话最便宜保证。

失败包含slot回退/raw schema、runtime空错误、保存假成功、动作未接收，需核真实聊天/Host日志而非点按钮感觉。退出先off并确认持久，再卸载/刷新恢复官方renderer；保留必要聊天/配置，state恢复未知时先导出脱敏内容。若阅读/数值/草稿安全不满足或净交互负担更大，退Markdown/手动输入/外部已验证表单，本轮未运行模型/浏览器/安装。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:33-52](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/package.json#L33-L52)

入口/成品files/Node。

<details>
<summary>查看原文（20行）</summary>

```text
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/index.js",
    "lib/client.js",
    "lib/genui-runtime.js",
    "cordis.patch.yml",
    "README.md",
    "README.zh-CN.md",
    "LICENSE"
  ],
  "engines": {
    "node": ">=20"
  },
```

</details>

**依据 2 · 源码核查**：[package.json:73-84](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/package.json#L73-L84)

Host peer兼容声明范围。

<details>
<summary>查看原文（12行）</summary>

```text
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-system-prompt": ">=0.0.1-rc.1 <0.1.0 || >=0.1.0-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
```

</details>

**依据 3 · 作者声明**：[README.zh-CN.md:125-130](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/README.zh-CN.md#L125-L130)

作者当前安装Host建议。

```text
### 准备工作

- 装好 Node.js
- 装好 `pnpm`（DSH 管理插件时要用它）。没有的话执行 `corepack enable` 或 `npm i -g pnpm`，然后**新开一个终端**，确认 `pnpm -v` 有输出
- DSH **0.2.2 及以上、0.3 之前**（`dsh --version` 为 `0.2.2-rc.1` 或同系列更新版本）
- DSH 能跑起来：`npx @deepseek-ai/dsh web`，默认地址 `http://127.0.0.1:3080`
```

**依据 4 · 源码核查**：[src/index.ts:131-139](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/index.ts#L131-L139)

提示档位从不同materials元数据生成。

```text
    name: config.sectionName,
    order: config.sectionOrder,
    texts: {
      mini: genuiPromptText(miniMaterialsMeta),
      standard: genuiPromptText(materialsMeta),
      plus: genuiPromptText(plusMaterialsMeta),
    },
  }, systemPrompt)

```

**依据 5 · 源码核查**：[src/client/genui-card-element.ts:55-67](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/genui-card-element.ts#L55-L67)

renderer仍plusMaterials。

<details>
<summary>查看原文（13行）</summary>

```text
    return () => h(GenuiConfigProvider, {
      materials: plusMaterials,
      id,
      theme: themeMode.value,
    }, {
      default: () => h(GenuiRenderer, {
        content: themedContent.value.content,
        generating: props.generating,
        isJsonComplete: themedContent.value.isJsonComplete,
        customActions: props.customActions,
      }),
    })
  },
```

</details>

**依据 6 · 源码核查**：[src/client/GenuiAssistantNodeView.tsx:78-99](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiAssistantNodeView.tsx#L78-L99)

动作发整state并立即submit有费用/数据边界。

<details>
<summary>查看原文（22行）</summary>

```text
  const customActions = useMemo<Record<string, ICustomAction>>(() => ({
    continueChat: {
      name: 'continueChat',
      description: 'Continue the chat with a follow-up user message.',
      // Match GenUI Chat: short button label + card state (formData, …) for the model.
      execute: (params, context) => {
        const message = typeof params === 'object' && params !== null && 'message' in params
          ? String((params as { message: unknown }).message)
          : ''
        if (message.trim().length === 0 || inputActions === undefined) return
        let stateJson = '{}'
        try {
          stateJson = JSON.stringify(context?.state ?? {})
        } catch {
          stateJson = '{}'
        }
        const draft = `${message},相关参数为：${stateJson}`
        inputActions.setDraft(draft)
        inputActions.submit()
      },
    },
  }), [inputActions])
```

</details>

**依据 7 · 源码核查**：[src/client/load-genui-runtime.ts:41-49](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/load-genui-runtime.ts#L41-L49)

idle预取非无资源。

```text
export function prefetchGenuiRuntime(): void {
  const start = (): void => {
    void loadGenuiRuntime().catch(() => {
      // First-card render will retry; boot must not surface a rejected idle task.
    })
  }
  if (typeof requestIdleCallback === 'function') requestIdleCallback(start)
  else setTimeout(start, 0)
}
```

#### 缺口

- 未核实时价格/Token/浏览器资源、成品Host兼容/视觉可用性和真实需求收益。
  **影响**：不推省时/省Token或全部无需账户成本。
  **进一步探讨**：先一静态图表与文字基线，记录原数据准确/交互错误/Token和恢复时间；动作有明确收益再扩大。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 剩余可证伪方向是什么，哪些已有能力不应重提？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

贡献是把SDK schema卡片和DSH回复/推理slot/输入动作接起来，mixed markdown、partial repair、主题跟随、提示档位与卸载section已有。不能把“流式渲染/普通回答不全卡/示例标记”当新机制，而且这些提示文本不是强验证。

候选聚焦runtime失败时保留可读回答：当前GenuiVueCard.error只有空div，可在失败卡位置展示原schema/明确未渲染状态与一次手动重试，避免用户以为空回复或误点另一旧卡；不伪装“已验证组件”。对照现有空error/console和重载整页，用缺runtime、runtime未定义element、正常卡三隔离样本，测丢失信息/重复提交/恢复时间及误报。若Host外层已完整保留内容并明确错误，或原schema展示更干扰且恢复无改善，则推翻。未实现/实验，不计本版创新；动作发送回执/敏感state则需另审，不能借显示修复包办。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/GenuiVueCard.tsx:37-78](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiVueCard.tsx#L37-L78)

runtime加载失败只置error并渲染空div。

<details>
<summary>查看原文（42行）</summary>

```text
  ))

  useEffect(() => {
    if (status !== 'loading') return
    let cancelled = false
    void loadGenuiRuntime().then(
      () => { if (!cancelled) setStatus('ready') },
      (err: unknown) => {
        console.error(err)
        if (!cancelled) setStatus('error')
      },
    )
    return () => { cancelled = true }
  }, [status])

  useLayoutEffect(() => {
    if (status !== 'ready') return
    const el = ref.current
    if (el === null) return
    el.content = content
    el.generating = generating
    el.isJsonComplete = isJsonComplete
    el.customActions = customActions
  }, [status, content, generating, isJsonComplete, customActions])

  if (status === 'error') {
    return createElement('div', {
      className,
      'data-dsh-genui-card-error': '',
    })
  }
  if (status !== 'ready') {
    return createElement('div', {
      className,
      'data-dsh-genui-card-pending': '',
      'aria-busy': true,
    })
  }
  return createElement(DSH_GENUI_CARD_TAG, {
    ref,
    className,
    'data-dsh-genui-card': '',
```

</details>

**依据 2 · 源码核查**：[src/client/load-genui-runtime.ts:23-38](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/load-genui-runtime.ts#L23-L38)

加载/未定义element失败会重置loading。

<details>
<summary>查看原文（16行）</summary>

```text
    script.src = GENUI_RUNTIME_URL
    script.addEventListener('load', () => resolve(), { once: true })
    script.addEventListener('error', () => {
      loading = undefined
      script.remove()
      reject(new Error(`dsh-genui: failed to load ${GENUI_RUNTIME_URL}`))
    }, { once: true })
    document.head.appendChild(script)
  }).then(() => {
    if (!alreadyDefined()) {
      loading = undefined
      throw new Error('dsh-genui: Vue runtime loaded but <dsh-genui-card> was not defined')
    }
  })
  return loading
}
```

</details>

**依据 3 · 源码核查**：[src/client/GenuiTextBody.tsx:45-57](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/client/GenuiTextBody.tsx#L45-L57)

schema段不另保留Markdown显示。

<details>
<summary>查看原文（13行）</summary>

```text
      )
      continue
    }
    nodes.push(
      <GenuiVueCard
        key={`schema-${i}`}
        className={css.card}
        content={segment.text}
        generating={streaming && !segment.complete}
        isJsonComplete={segment.complete}
        customActions={customActions}
      />,
    )
```

</details>

**依据 4 · 源码核查**：[src/authoring-prompt.ts:24-31](https://github.com/lhuans/dsh-genui/blob/6328c64a0f0c4728a79ec5fe90818e0866f57045/src/authoring-prompt.ts#L24-L31)

示例/未执行声明只是现有提示约束。

```text
- 如果需要用户提供更多信息补充，请主动生成表单卡片`

const PRIORITY_REPLACEMENT = `- 只有适合用卡片展示的信息才生成卡片；写代码、排查问题、执行命令、解释原理、日常问答直接用文字回答，不要输出 schemaJson
- 需要用户补充信息且适合用表单收集时，再生成表单卡片；不适合时直接用文字追问
- 禁止在 schemaJson 中断言未实际执行的动作（如「已验证」「已安装」「已生效」）；未执行的只能写「待执行」`

/**
 * Rewrite the stock GenUI authoring prompt.
```

#### 缺口

- 未真实复现Host整体错误呈现/用户误解与恢复需求。
  **影响**：只能提出局部可读性假设，不断言真实用户丢数据或必须新增模块。
  **进一步探讨**：先缺runtime三样本核外层是否已有可读回退，只有净恢复改善才做显示/重试小原型。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
