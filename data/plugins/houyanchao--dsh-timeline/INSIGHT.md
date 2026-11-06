# dsh-timeline

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[599dfb4](https://github.com/houyanchao/dsh-timeline/tree/599dfb47934a2afb00c29e00d303acfb966ad2cd)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/houyanchao/dsh-timeline) [![npm 30d 1,481](https://img.shields.io/static/v1?label=npm+30d&message=1%2C481&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-timeline) [![最新发布 2026-09-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-timeline)
<!-- END META -->

> **功能**：在DSH会话中提供时间轴定位、收藏文件夹、提示词/闪记与多格式内容导出。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把定位、收藏和资料带走集中到原生槽位与输入草稿，减少手工拼入口。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)DOM不在可静默跳失败、历史stall仍部分导出、MD图片blob非自包含，localStorage写失败被吞且覆盖导入无事务；不适合作唯一知识档案。

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
  - [Q01 · 时间线为长会话整理者多做了什么？](#detail-section-11)
  - [Q02 · 时间点怎样对应原消息，导出是否拿全真实对话？](#detail-section-12)
  - [Q03 · 收藏/导入与导出持久有什么风险和日常成本？](#detail-section-13)
  - [Q04 · 怎样让整理入口形成可信资料链？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-timeline0.1.3是原生浏览器UI插件，Host apply为空，不注册模型工具或服务器资料库。适合经常回查长对话、把提问/结论收成可复用资料的人；时间轴、提问列表、收藏两级文件夹、闪记、提示词和导出集中在宿主入口。成功应是更少滚动找到正确原消息、收藏可重开且导出信息足够迁移，不是看到更多按钮。

原生会话/滚动/查找、手工复制与外部笔记/提示词库；chat/attachment是Host能力，UI布局移植不算新检索模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 时间轴/提问 | 回看原消息 | DOM存在才跳，非语义检索 |
| 收藏/提示词/笔记 | 本地整理复用 | 当前origin存储，失败可吞 |
| 导出 | 轮次内容带走 | 非完整事件日志/离线图片包保证 |
| 备份导入 | 自有前缀JSON迁移 | 覆盖先删再写非事务 |
| 草稿插入 | 快速复用提示词 | 不自动发送或模型记忆 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH客户端slots/sessions/theme/runtime | 必需 | UI/原始chat/附件 | 没有Host后端资料库替代 |
| Host DOM标记/渲染消息 | 导航必需 | 定位scroll/message元素 | 未渲染可不跳，需原生回查 |
| 当前origin的localStorage | 收藏/提示词必需 | 本地持久/跨tab同步 | quota/清浏览数据可丢，不跨设备 |
| 浏览器下载/打印与附件解析 | 导出必需 | 文本/PNG/PDF | 成功toast非最终文件/完整性验收 |
| 原会话及独立备份 | 本文前提 | 恢复和查漏 | 不作唯一资料副本 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 选无秘密有原件长会话 | 明确浏览器资料非Host同步 |
| 定位 | 时间点/收藏跳原消息 | 确认真滚到节点，不只高亮 |
| 整理 | 收藏/提示词/笔记后重载核 | 画面更新不等localStorage成 |
| 导出 | 对轮数/附件/离线文件 | 部分历史/blob链接不称完整 |
| 退出 | 独立备份核样本，停用回原生 | 不先清浏览器/覆盖唯一副本 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 机器/存储金额未知 | 入口和资料范围学习 | 发行包/Host兼容未验 |
| 持续 | localStorage/附件内存/文件未知 | 整理、备份与查完整 | 查找净节时无实测 |
| 故障 | 导入/部分文件资源未知 | 回原会话/备份恢复核对 | UI可成功但持久失败 |
| 退出 | JSON/导出留存未知 | 导出备份/核文件，停插件 | 浏览器清理需另授权/自行负责 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 定位 | chat items到DOM滚动 | 虚拟节点/Host改版成功率 |
| 整理 | 收藏/提示词本地CRUD | 持久失败恢复/跨设备 |
| 导出 | 分页/轮次/浏览器下载 | 完整历史/工具事件/图片离线包 |
| 体验 | 统一原生入口 | 真实查找/整理净效益 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)DOM不在可静默跳失败、历史stall仍部分导出、MD图片blob非自包含，localStorage写失败被吞且覆盖导入无事务；不适合作唯一知识档案。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)把定位、收藏和资料带走集中到原生槽位与输入草稿，减少手工拼入口。

Host chat/attachment比只爬DOM导出有依据，前缀限定避免清宿主全库可借鉴；需把DOM未就绪、分页部分与持久失败显式化，下载发起不等资料已验。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)DOM不在可静默跳失败、历史stall仍部分导出、MD图片blob非自包含，localStorage写失败被吞且覆盖导入无事务；不适合作唯一知识档案。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前观察；无秘密非唯一副本会话试定位/收藏，刷新核持久，导出对轮数和附件再离线打开。备份先验证再覆盖导入，任何资料不符回原会话和外部笔记，不当唯一档案。见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持原生UI定位/整理与下载接线，关键资料完整/持久缺口明确；当前观察，未做真实Host/导出或故障执行。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/conversationExport/ExportAction.tsx、src/client/conversationExport/collect.ts、src/client/conversationExport/exporters.ts、src/client/index.ts、src/client/panelModal/dataSync.ts、src/client/smartInputBox/PromptButton.tsx、src/client/smartInputBox/storage.ts、src/client/starred/storage.ts、src/client/timeline/TimelineAction.tsx、src/client/timeline/TimelineBar.tsx、src/client/timeline/TimelineRoot.tsx、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package/空Host、client槽注册、timeline items/DOM跳转、分页/collect/文本下载、提示词插草稿、收藏/提示词存储与备份导入；未全审PNG/PDF渲染、智能Enter/公式/提醒、全部UI和全部收藏操作。
- 下一步：只读固定源码，不build/运行Host/真实会话/导出/故障；一般冒烟为scope_boundary，完整性/持久和净收益缺独立结果。

**分析版本**

- **仓库**：[houyanchao/dsh-timeline](https://github.com/houyanchao/dsh-timeline)
- **版本号**：0.1.3（[固定提交 599dfb4](https://github.com/houyanchao/dsh-timeline/tree/599dfb47934a2afb00c29e00d303acfb966ad2cd)）
- **版本日期**：2026-08-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)提出未验证的定位/导出部分/持久失败状态链，用已知fixture与故障对照测误信和恢复，不以更多格式代完整性。

只读固定源码，不build/运行Host/真实会话/导出/故障；一般冒烟为scope_boundary，完整性/持久和净收益缺独立结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 144 | — | — | 1357 |
| .tsx | source | 29 | 10023 | 8283 | 1111 | — |
| .ts | source | 32 | 6083 | 4544 | 943 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/houyanchao/dsh-timeline/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/houyanchao/dsh-timeline/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/houyanchao/dsh-timeline/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核长会话定位与资料整理真实链及本地持久、导出完整边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 时间线为长会话整理者多做了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-timeline0.1.3是原生浏览器UI插件，Host apply为空，不注册模型工具或服务器资料库。适合经常回查长对话、把提问/结论收成可复用资料的人；时间轴、提问列表、收藏两级文件夹、闪记、提示词和导出集中在宿主入口。成功应是更少滚动找到正确原消息、收藏可重开且导出信息足够迁移，不是看到更多按钮。

基线是宿主原生会话列表/滚动查找、手工复制到笔记和外部提示词库。本组件增量在检索/整理交互与本地资料管理，宿主chat节点、附件和原生编辑器是依赖；代码明确移植原扩展布局/存储，不能当新检索算法或Agent长期记忆。提示词插入只是setDraft，不自动发送/新增推理能力。

作者“超级提效”及多格式声明没有本次独立任务结果，短会话/已有外部笔记者可能不值得增加另一份本地资料。固定git没有lib发布生成物，package prepublishOnly有bundle步骤；源码可研究，发行包和安装兼容仍未验。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-44](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/README.md#L20-L44)

作者长会话问题与功能。

<details>
<summary>查看原文（25行）</summary>

```text
## 📖 dsh-timeline 是什么？

dsh-timeline 是一款 [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/) 功能增强插件。

和 AI 的对话一长，翻找就成了负担：想回看某个提问要一路滚动，重要结论散落在各个会话里，公式、内容也不好带走。dsh-timeline 为此而生——它在会话右侧生成一条可视化时间轴，让你在长对话中一键跳转；并配套收藏文件夹、图钉标记、闪记、提示词库、多格式导出等能力，把"找、记、整理、带走"这一整套体验补齐。

插件深度贴合宿主界面：主题实时跟随、中英文界面、每个功能都可独立开关，装上即用，不打扰原有习惯。

## ✨ 功能特性

- 🧭 **时间轴导航** — 会话右侧轴条按提问定位，点击直达；紧凑模式、虚拟化渲染、`↑` / `↓` 键跳转
- 📌 **标记重点** — 长按时间轴节点打上图钉，重要提问一眼可见
- 📋 **问题列表** — 全部提问带序号列出，激活行随阅读位置联动
- ⭐ **收藏文件夹** — 整段对话、单条提问、闪记都能收进两级文件夹，拖拽整理、置顶、搜索
- 📝 **闪记** — 可拖拽缩放的快速笔记面板，随手记录灵感
- 💬 **提示词库** — 常用提示词存下来，在输入框旁一键调用
- ⌨️ **智能输入** — `Enter` 换行、双击 `Enter` 发送；选中文字快速追问；发送后保持阅读位置
- 📤 **对话导出** — Markdown / TXT / JSON / CSV / PNG / PDF，数学公式照常渲染
- 🧮 **公式复制** — 点击公式复制 LaTeX 或 MathML，可直接粘贴进 Word
- 🔔 **回复提醒** — 浏览历史时回复完成，弹窗 + 可选提示音
- 💾 **数据备份** — 插件数据一键导出 / 导入（JSON）
- 🎨 **贴合宿主** — 深浅主题实时跟随，中英文界面，逐功能开关

## 📦 安装

```

</details>

**依据 2 · 源码核查**：[src/index.ts:1-9](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/index.ts#L1-L9)

Host确为空。

```text
/**
 * dsh-timeline，Node 半：本插件只有浏览器 UI，host 侧无行为。
 * 浏览器半见 src/client/（由 package.json 的 dsh.client manifest 声明）。
 */

export const name = 'dsh-timeline'

/** Host plugin body — no host-side behavior for this UI-only plugin. */
export function apply(): void {}
```

**依据 3 · 源码核查**：[package.json:1-58](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/package.json#L1-L58)

真实包/双入口/打包脚本。

<details>
<summary>查看原文（58行）</summary>

```text
{
  "name": "dsh-timeline",
  "description": "DeepSeek Harness (DSH) plugin: timeline navigation, starred folders, conversation export, prompt library, and quick notes in one.",
  "version": "0.1.3",
  "keywords": [
    "dsh",
    "deepseek-harness",
    "dsh-plugin",
    "timeline",
    "conversation",
    "export",
    "bookmark"
  ],
  "homepage": "https://github.com/houyanchao/dsh-timeline#readme",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/houyanchao/dsh-timeline.git"
  },
  "bugs": {
    "url": "https://github.com/houyanchao/dsh-timeline/issues"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-theme"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "bundle": "tsdown && tsc -p tsconfig.types.json",
    "watch": "tsdown --watch",
    "typecheck": "tsc --noEmit",
    "prepublishOnly": "npm run bundle"
  },
  "license": "GPL-3.0-or-later",
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-client-locale": "*",
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:38-60](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/index.ts#L38-L60)

实际slots UI注册。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx: ClientContext): void {
  bindTheme(ctx)
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'dsh-timeline: dictionaries')
  ctx.slots.inject(
    'conversation.session.header.actions',
    () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'dsh-timeline',
      order: 40,
      locale: NS,
      store: createTimelineStore,
    }, TimelineAction),
  )
  // 命令式 UI 宿主（toast/tooltip/dropdown/popconfirm/inputModal/收藏编辑弹窗/设置面板）。
  ctx.slots.inject(
    'shell.overlay',
    () => ctx.slots.register({
      name: 'shell.overlay',
      id: 'dsh-timeline-ui',
      locale: NS,
      inject: () => ({
        openSession: (sessionId: string) => { ctx.sessions.open(sessionId as SessionId) },
      }),
```

</details>

**依据 5 · 源码核查**：[src/client/smartInputBox/PromptButton.tsx:149-163](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/smartInputBox/PromptButton.tsx#L149-L163)

提示词实际只写草稿/聚焦。

<details>
<summary>查看原文（15行）</summary>

```text
  /** 插入提示词（原 _insertPrompt → _defaultInsertText）。 */
  const insertPrompt = (prompt: Prompt): void => {
    if (prompt.content === '') return
    const finalText = appendPromptText(draftRef.current, prompt.content)
    inputActions.setDraft(finalText)
    // 延迟聚焦、光标到末尾并滚到底（原 setTimeout(50)）。
    setTimeout(() => {
      const input = document.querySelector<HTMLTextAreaElement>(INPUT_SELECTOR)
      if (input === null) return
      input.focus()
      input.selectionStart = input.value.length
      input.selectionEnd = input.value.length
      const scroll = input.closest('[data-input-scroll]')
      if (scroll !== null) scroll.scrollTop = scroll.scrollHeight
    }, 50)
```

</details>

#### 缺口

- 长会话回查/整理真实任务是否省时、发行包和具体Host兼容未验。
  **影响**：不把功能密度当生产率/知识可复用证明。
  **进一步探讨**：选一条真实无秘密长会话，对照原生滚动和手工笔记，核定位正确率与全部人审时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 时间点怎样对应原消息，导出是否拿全真实对话？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

时间线从useSession chat.order/nodes构造item：忽略visibility hidden，user/steering作为提问，随后assistant-step摘要给对应reply。滚动实际依data-conversation-scroll和data-chat-flow-key DOM元素，两者存在才smoothScroll；元素不在DOM时静默不动，没有这里的加载/虚拟列表定位回执。跨会话pending在items出现时consume后再查DOM，不能把节点已在store等同一定已渲染可跳。

导出通过ctx.sessions.binding(sessionId)读附件，并在hasMore时反复loadOlder；连续3次order长度无增长即停，返回当前快照，无complete/hasMore标记。ExportModal得到full或原先快照后collect，异常当空、空才报无会话，非空就进入内容选择。因此某页持续失败仍可能导出部分历史，不能将toast成功当“完整导出”。

collect按user/steering切轮，把assistant-step的text/image块合并；工具调用/完整内部事件、分支等不是逐字完整原始日志。附件失败保留unrendered，成功创建blob URL；Markdown直接写该src，所以含图片的MD可能只带当前浏览器临时blob引用，不是离线自包含图片包。PNG/PDF有另行渲染路径，本次不把文本路径的结论推广为其完整效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/timeline/TimelineAction.tsx:77-107](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/timeline/TimelineAction.tsx#L77-L107)

真实chat节点转items。

<details>
<summary>查看原文（31行）</summary>

```text
function collectItems(
  order: readonly string[],
  nodes: ChatNodeStore,
  t: TranslateNS<typeof NS>,
): TimelineItem[] {
  const items: TimelineItem[] = []
  let pendingReplyIndex = -1
  for (const key of order) {
    const node = nodes.get(key)
    if (node === undefined || node.visibility === 'hidden') continue
    if (USER_KINDS.has(node.kind)) {
      const data = node.data as UserLikeData
      const title = summarizeBlocks(data.content ?? [])
      items.push({
        key,
        title: title !== '' ? title : t('placeholder.attachment'),
        time: data.time ?? 0,
        reply: '',
      })
      pendingReplyIndex = items.length - 1
      continue
    }
    // 宿主 Chat 视图节点 kind 是 Definition 名：助手为 assistant-step，不是 data.kind。
    if (node.kind !== 'assistant-step' || pendingReplyIndex < 0) continue
    const reply = summarizeAssistantBlocks((node.data as AssistantLikeData).blocks ?? [])
    if (reply === '') continue
    const pending = items[pendingReplyIndex]
    if (pending !== undefined) items[pendingReplyIndex] = { ...pending, reply }
    pendingReplyIndex = -1
  }
  return items
```

</details>

**依据 2 · 源码核查**：[src/client/timeline/TimelineAction.tsx:115-147](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/timeline/TimelineAction.tsx#L115-L147)

真实useSession与items。

<details>
<summary>查看原文（33行）</summary>

```text
export function TimelineAction({ sessionId, useSession, useSessions, useStore, actions, t }: TimelineActionProps) {
  const order = useSession(s => s.chat.order)
  const nodes = useSession(s => s.chat.nodes)
  const running = useSession(s => s.running)
  const collapsed = useStore(s => s.collapsed)
  const chatViewPresent = useChatViewPresent()
  const displayTitle = useSessions(s => s.byId[sessionId]?.displayTitle)
  const settings = useSyncExternalStore(settingsStore.subscribe, () => settingsStore.get())

  // 收藏标记来自全局收藏存储（含文件夹归属），按会话过滤成节点映射。
  const starredState = useSyncExternalStore(starredStore.subscribe, () => starredStore.getState())
  const starred = useMemo(() => {
    const map: Record<string, StarRecord> = {}
    for (const item of starredState.items) {
      if (item.kind === 'node' && item.sessionId === sessionId) {
        map[item.nodeKey] = { title: item.title, time: item.timestamp }
      }
    }
    return map
  }, [starredState, sessionId])

  // 图钉标记（原 PinStorageManager.getByUrl 的会话过滤）。
  const pinsState = useSyncExternalStore(pinsStore.subscribe, () => pinsStore.getAll())
  const pinned = useMemo(() => {
    const set = new Set<string>()
    for (const pin of pinsState) {
      if (pin.sessionId === sessionId) set.add(pin.nodeKey)
    }
    return set
  }, [pinsState, sessionId])

  const items = useMemo(() => collectItems(order, nodes, t), [order, nodes, t])

```

</details>

**依据 3 · 源码核查**：[src/client/timeline/TimelineRoot.tsx:82-103](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/timeline/TimelineRoot.tsx#L82-L103)

DOM存在才滚动，pending消费顺序。

<details>
<summary>查看原文（22行）</summary>

```text
  const scrollToItem = useCallback((key: string) => {
    const port = findScrollContainer()
    const el = findMessageElement(key)
    if (port !== null && el !== null) {
      setActiveKey(key)
      smoothScrollTo(port, el)
    }
  }, [])

  // 跨会话导航后的待滚动目标（收藏树 setNavigateDataForUrl 的 DSH 等价物）：
  // 节点出现在列表里时消费并滚动。
  useEffect(() => {
    const tryConsume = (): void => {
      const pending = pendingNavigateStore.get()
      if (pending === null || pending.sessionId !== sessionId) return
      if (!itemsRef.current.some(item => item.key === pending.nodeKey)) return
      const key = pendingNavigateStore.consume(sessionId)
      if (key !== null) scrollToItem(key)
    }
    tryConsume()
    return pendingNavigateStore.subscribe(tryConsume)
  }, [sessionId, items, scrollToItem])
```

</details>

**依据 4 · 源码核查**：[src/client/timeline/TimelineBar.tsx:56-69](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/timeline/TimelineBar.tsx#L56-L69)

实际DOM选择器。

<details>
<summary>查看原文（14行）</summary>

```text
export function findScrollContainer(): HTMLElement | null {
  const el = document.querySelector('[data-conversation-scroll]')
  return el instanceof HTMLElement ? el : null
}

/**
 * 按 Chat 节点 key 查找消息元素。
 * @param key - Chat 节点 key。
 * @returns 消息元素；不存在时 null。
 */
export function findMessageElement(key: string): HTMLElement | null {
  const el = document.querySelector(`[data-chat-flow-key="${CSS.escape(key)}"]`)
  return el instanceof HTMLElement ? el : null
}
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:95-146](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/index.ts#L95-L146)

真实附件读取/历史分页及3次stall。

<details>
<summary>查看原文（52行）</summary>

```text
  ctx.slots.inject(
    'conversation.session.header.actions',
    () => ctx.slots.register({
      name: 'conversation.session.header.actions',
      id: 'dsh-timeline-export',
      order: 41,
      locale: NS,
      inject: () => ({
        resolveAttachment: async (sessionId: string, attachmentId: string) => {
          const session = ctx.sessions.binding(sessionId as SessionId)?.session
          if (session === undefined) return null
          const result = await session.readAttachment(attachmentId as Parameters<typeof session.readAttachment>[0])
          if (!result.ok) return null
          const { attachment, data } = result.value
          return {
            mediaType: attachment.mediaType,
            width: attachment.width,
            height: attachment.height,
            name: attachment.name,
            data,
          }
        },
        // 会话窗口按页装载（每页 50 条），导出前向前翻页拉全历史再返回最新快照。
        loadFullHistory: async (sessionId: string, options?: {
          readonly onProgress?: (count: number) => void
          readonly shouldCancel?: () => boolean
        }) => {
          const session = ctx.sessions.binding(sessionId as SessionId)?.session
          if (session === undefined) return null
          const countTurns = (): number => {
            const chat = session.getSnapshot().chat
            let count = 0
            for (const key of chat.order) {
              const kind = chat.nodes.get(key)?.kind
              if (kind === 'user' || kind === 'steering') count += 1
            }
            return count
          }
          let stall = 0
          while (session.getSnapshot().hasMore && stall < 3) {
            if (options?.shouldCancel?.() === true) break
            const before = session.getSnapshot().chat.order.length
            await session.loadOlder()
            // loadOlder 单页失败不改 hasMore：连续无进展即中止，避免死循环。
            stall = session.getSnapshot().chat.order.length > before ? 0 : stall + 1
            options?.onProgress?.(countTurns())
          }
          const chat = session.getSnapshot().chat
          return { order: chat.order, nodes: chat.nodes }
        },
      }),
    }, ExportAction),
```

</details>

**依据 6 · 源码核查**：[src/client/conversationExport/ExportAction.tsx:245-272](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/ExportAction.tsx#L245-L272)

collect/异常空/非空入内容阶段。

<details>
<summary>查看原文（28行）</summary>

```text
    closedRef.current = false
    void (async () => {
      let collected: ExportTurn[] = []
      try {
        const onProgress = (count: number): void => { setProgress(count) }
        const shouldCancel = (): boolean => cancelledRef.current || closedRef.current
        const full = await loadFullHistory({ onProgress, shouldCancel })
        collected = await collectAllTurns(
          full?.order ?? chatOrder,
          full?.nodes ?? nodes,
          resolveAttachment,
          { onProgress, shouldCancel },
        )
      } catch { /* 加载失败按空处理 */ }

      if (closedRef.current) return
      if (cancelledRef.current) {
        requestClose()
        return
      }
      if (collected.length === 0) {
        toast.error(texts.noConversation)
        requestClose()
        return
      }
      setTurns(collected)
      setPhase('content')
    })()
```

</details>

**依据 7 · 源码核查**：[src/client/conversationExport/collect.ts:94-142](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/collect.ts#L94-L142)

实际轮次与助手文本筛选。

<details>
<summary>查看原文（49行）</summary>

```text
    const node = nodes.get(key)
    if (node === undefined) continue

    if (USER_KINDS.has(node.kind)) {
      const data = node.data as UserLikeData
      const content = data.content ?? []
      const text = content.map(userBlockText).filter(t => t !== '').join('\n\n').trim()
      current = {
        order: mutables.length + 1,
        userText: text,
        userTime: data.time ?? 0,
        userImages: [],
        assistantParts: [],
        assistantImages: [],
      }
      mutables.push(current)
      // 用户消息中的图片块（image 类型 content block）。
      for (const block of content) {
        const b = block as TextishBlock
        if (typeof b === 'object' && b !== null && b.type === 'image' && b.attachment?.attachmentId !== undefined) {
          const image: ExportImage = {
            role: 'user',
            src: '',
            alt: b.attachment.name ?? '',
            width: b.attachment.width ?? null,
            height: b.attachment.height ?? null,
            fileId: b.attachment.attachmentId,
            unrendered: true,
          }
          const turn = current
          const index = turn.userImages.length
          turn.userImages.push(image)
          pendingImages.push({
            image,
            attachmentId: b.attachment.attachmentId,
            assign: (img) => { turn.userImages[index] = img },
          })
        }
      }
      options.onProgress?.(mutables.length)
      continue
    }

    // 助手内容挂在 'assistant-step' 节点（AssistantChatData.blocks），
    // 'assistant' 只是 legacy 投影（finalNode）里的 kind，Chat 视图节点没有它。
    if (node.kind === 'assistant-step' && current !== null) {
      const data = node.data as AssistantLikeData
      for (const block of data.blocks ?? []) {
        if (block.kind === 'text' && typeof block.text === 'string' && block.text.trim() !== '') {
```

</details>

**依据 8 · 源码核查**：[src/client/conversationExport/collect.ts:166-211](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/collect.ts#L166-L211)

附件blob/未渲染与轮次输出。

<details>
<summary>查看原文（46行）</summary>

```text

  // 解析图片为 blob URL（原 SCROLL 策略在此处等待 DOM 渲染，这里等待字节解析）。
  await Promise.all(pendingImages.map(async ({ image, attachmentId, assign }) => {
    if (options.shouldCancel?.() === true) return
    try {
      const resolved = await resolveAttachment(attachmentId)
      if (resolved === null) return
      const blob = new Blob([resolved.data as BlobPart], { type: resolved.mediaType })
      assign({
        ...image,
        src: URL.createObjectURL(blob),
        width: resolved.width,
        height: resolved.height,
        unrendered: false,
      })
    } catch { /* 解析失败保持 unrendered */ }
  }))

  if (options.shouldCancel?.() === true) return []

  const turns: ExportTurn[] = []
  for (const m of mutables) {
    // 过滤过小的装饰图（原 CE_MIN_IMAGE_SIZE：任一边 <48 且尺寸已知时跳过）。
    const userImages = m.userImages.filter(img => !isDecorativeImage(img))
    const assistantImages = m.assistantImages.filter(img => !isDecorativeImage(img))
    const markdown = normalizeMathDelimiters(m.assistantParts.join('\n\n')).trim()
    const text = markdownToPlainText(markdown)
    // 全空轮丢弃（原 extractTurn：文本与图片四者全空时返回 null），序号保持连续。
    if (m.userText === '' && userImages.length === 0 && text === '' && assistantImages.length === 0) continue
    turns.push({
      order: turns.length + 1,
      user: { text: m.userText, time: m.userTime, images: userImages },
      assistant: { markdown, text, images: assistantImages },
    })
  }
  return turns
}

/** 过小的装饰图判定（原 _extractImageInfo：尺寸未知时保留）。 */
const MIN_IMAGE_SIZE = 48

function isDecorativeImage(img: ExportImage): boolean {
  const width = img.width ?? 0
  const height = img.height ?? 0
  return width > 0 && height > 0 && (width < MIN_IMAGE_SIZE || height < MIN_IMAGE_SIZE)
}
```

</details>

**依据 9 · 源码核查**：[src/client/conversationExport/exporters.ts:25-34](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/exporters.ts#L25-L34)

Markdown直接写image.src。

<details>
<summary>查看原文（10行）</summary>

```text
/** 一张图片对应的 Markdown 行（原 _imageMarkdownLines）。 */
function imageMarkdownLines(image: ExportImage, texts: CeTexts): string[] {
  if (image.src !== '') {
    return [
      `![${image.alt}](${image.src})`,
      `> ${texts.imageListTitle}：${imageInfoLabel(image, texts)}`,
    ]
  }
  return [`> ${texts.imageListTitle}：${imageInfoLabel(image, texts)}（${texts.imageNotRendered}）`]
}
```

</details>

#### 缺口

- 不同Host虚拟DOM、失败分页后实际完整率及图片跨机器可用未执行。
  **影响**：不能称完整会话归档或所有节点可跳。
  **进一步探讨**：用含旧历史/工具/图片长会话测分页失败、未渲染节点跳转；离线另一浏览器打开MD逐项对账。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 收藏/导入与导出持久有什么风险和日常成本？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

收藏/提示词资料在浏览器localStorage，以dsh.timeline前缀管理，非Host多设备同步。save先bus.set更新内存，再setItem，容量/写失败吞掉；load解析损坏回空。于是界面已收藏不等刷新仍在，浏览器清理/切origin/profile会影响资料，不能把storage事件跨标签同步当跨用户/云备份。笔记/提示词和收藏标题可能含秘密，同origin其他脚本与导出JSON都能接触，插件没有独立加密账号层。

备份只取自有前缀，source指纹校验宽松且APP_VERSION固定0.1.0（包0.1.3），不是严格迁移schema证明。覆盖导入先删全部自有key再逐项写，失败可部分导入，未见事务回滚；合并也逐key写，虽不会清宿主非插件数据，却不保证导入原子或字段完全合法。必须先独立导出备份并验证可读，再选覆盖。对话下载通过Blob/a.click，toast只是发起下载，不证明文件最终保存/图片可离线。

首次需兼容Host和熟悉新增入口，持续是浏览器存储/导出图片内存、资料整理/备份及版本DOM复核；模型成本不由本插件新添，但现金/资源与人工未知不填0。退出前导出自有资料、确认下载与恢复样本，停用插件回原生列表/外部笔记；别为恢复先清浏览器数据。当前观察，用无秘密非唯一副本资料试功能，不能作唯一知识档案。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/starred/storage.ts:77-108](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/starred/storage.ts#L77-L108)

localStorage损坏空/先内存后忽略写失败。

<details>
<summary>查看原文（32行）</summary>

```text

function load(): StarredState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw === null) return { folders: [], items: [] }
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed === 'object' && parsed !== null) {
      const p = parsed as { folders?: unknown; items?: unknown }
      return {
        folders: Array.isArray(p.folders) ? p.folders as Folder[] : [],
        items: Array.isArray(p.items) ? p.items as StarItem[] : [],
      }
    }
  } catch { /* 损坏数据回退为空 */ }
  return { folders: [], items: [] }
}

const bus = new Bus<StarredState>(load())

function save(next: StarredState): void {
  bus.set(next)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch { /* 存储满时忽略 */ }
}

// 跨标签页同步（等价原 chrome.storage.onChanged）。
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) bus.set(load())
  })
}
```

</details>

**依据 2 · 源码核查**：[src/client/smartInputBox/storage.ts:16-38](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/smartInputBox/storage.ts#L16-L38)

提示词同样先内存/忽略写失败。

<details>
<summary>查看原文（23行）</summary>

```text
const STORAGE_KEY = 'dsh.timeline.prompts'

function load(): readonly Prompt[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw !== null) {
      const parsed: unknown = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed as Prompt[]
    }
  } catch { /* 损坏数据回退为空 */ }
  return []
}

const bus = new Bus<readonly Prompt[]>(load())

function save(next: readonly Prompt[]): void {
  bus.set(next)
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* 存储满时忽略 */ }
}

if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY) bus.set(load())
```

</details>

**依据 3 · 源码核查**：[src/client/panelModal/dataSync.ts:26-42](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/panelModal/dataSync.ts#L26-L42)

前缀/指纹/硬编码版本。

<details>
<summary>查看原文（17行）</summary>

```text
/** 来源指纹（原 'AIChatTimeline'；DSH 存储结构不同，用独立指纹防止混导）。 */
const BACKUP_SOURCE = 'AIChatTimeline-DSH'
/** 插件版本（原 chrome.runtime.getManifest().version）。 */
const APP_VERSION = '0.1.0'

/** 插件自有存储 key 前缀（导出/覆盖清理的圈定范围）。 */
const KEY_PREFIXES = ['dsh.timeline.'] as const

/** 各 key 的合并策略所需的字段名（原 mergeByKey 的 DSH key 映射）。 */
const STARRED_KEY = 'dsh.timeline.starred'
const PINS_KEY = 'dsh.timeline.pins'
const PROMPTS_KEY = 'dsh.timeline.prompts'
const SETTINGS_KEY = 'dsh.timeline.settings'

/** 是否插件自有 key。 */
function isPluginKey(key: string): boolean {
  return KEY_PREFIXES.some(prefix => key.startsWith(prefix))
```

</details>

**依据 4 · 源码核查**：[src/client/panelModal/dataSync.ts:60-94](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/panelModal/dataSync.ts#L60-L94)

备份范围和宽松校验。

<details>
<summary>查看原文（35行）</summary>

```text
export function getAllStorageData(): Record<string, unknown> {
  const data: Record<string, unknown> = {}
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key === null || !isPluginKey(key)) continue
    const raw = localStorage.getItem(key)
    if (raw !== null) data[key] = parseValue(raw)
  }
  return data
}

/** 构建备份文件元数据（原 _buildMeta）。 */
function buildMeta(): BackupMeta {
  return {
    source: BACKUP_SOURCE,
    appVersion: APP_VERSION,
    exportTime: new Date().toISOString(),
    exportTimestamp: Date.now(),
  }
}

/**
 * 校验是否是合法的本插件备份（原 _isValidBackup）。
 * - data 必须是对象；
 * - 若带 _meta，则 source 必须为本插件指纹（缺 _meta 时放行，兼容早期备份）。
 */
export function isValidBackup(importData: unknown): importData is BackupFile {
  if (importData === null || typeof importData !== 'object') return false
  const candidate = importData as { data?: unknown; _meta?: { source?: unknown } }
  if (candidate.data === null || typeof candidate.data !== 'object') return false
  const meta = candidate._meta
  if (meta !== undefined && meta.source !== undefined && meta.source !== BACKUP_SOURCE) return false
  return true
}

```

</details>

**依据 5 · 源码核查**：[src/client/panelModal/dataSync.ts:191-223](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/panelModal/dataSync.ts#L191-L223)

覆盖先删/逐写及合并。

<details>
<summary>查看原文（33行）</summary>

```text
  return newValue
}

/** 覆盖模式：清空插件数据并写入新数据（原 overwriteData，clear 圈定插件前缀）。 */
export function overwriteData(newData: Record<string, unknown>): void {
  // 先清空插件自有 key（等价原 chrome.storage.local.clear 的插件作用域版）。
  const toRemove: string[] = []
  for (let i = 0; i < localStorage.length; i += 1) {
    const key = localStorage.key(i)
    if (key !== null && isPluginKey(key)) toRemove.push(key)
  }
  for (const key of toRemove) localStorage.removeItem(key)

  // 再写入（忽略非本插件前缀的 key，防止污染宿主存储）。
  for (const [key, value] of Object.entries(newData)) {
    if (!isPluginKey(key)) continue
    localStorage.setItem(key, serializeValue(value))
  }
}

/** 合并模式：智能合并数据（原 mergeData）。 */
export function mergeData(newData: Record<string, unknown>): void {
  const existingData = getAllStorageData()

  for (const [key, newValue] of Object.entries(newData)) {
    if (!isPluginKey(key)) continue
    const existingValue = existingData[key]

    // 本地不存在，直接使用新值；否则按 key 类型合并。
    const merged = existingValue === undefined ? newValue : mergeByKey(key, existingValue, newValue)
    localStorage.setItem(key, serializeValue(merged))
  }
}
```

</details>

**依据 6 · 源码核查**：[src/client/conversationExport/exporters.ts:227-245](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/exporters.ts#L227-L245)

真实Blob/下载/回收而非保存验收。

<details>
<summary>查看原文（19行）</summary>

```text
 */
export function ceTriggerDownload(filenameBase: string, format: ExportFormat, content: string | Blob): void {
  const blob = content instanceof Blob
    ? content
    : new Blob([content], { type: `${format.mime};charset=utf-8` })

  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = `${filenameBase}${format.ext}`
  anchor.style.display = 'none'
  document.body.appendChild(anchor)
  anchor.click()

  setTimeout(() => {
    anchor.remove()
    URL.revokeObjectURL(url)
  }, 1000)
}
```

</details>

**依据 7 · 源码核查**：[src/client/conversationExport/ExportAction.tsx:314-342](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/conversationExport/ExportAction.tsx#L314-L342)

实际导出分支和成功toast。

<details>
<summary>查看原文（29行）</summary>

```text
          platformId: 'deepseek',
          platformName: 'DeepSeek',
          exportTime: new Date(),
        },
        options: { showTime, showConversationTime, rangeId, formatId },
        turns: selectedTurns,
      }

      const filenameBase = ceSanitizeFilename(job.meta.title, texts.defaultTitle)

      if (formatId === 'png') {
        const blob = await new CEPngExporter().export(job, themeId, texts)
        ceTriggerDownload(filenameBase, format, blob)
      } else if (formatId === 'pdf') {
        // 文字排版方案：构建 HTML → 浏览器打印为 PDF（复用 PNG 的 markdown 解析）
        await new CEPdfExporter().export(job, themeId, texts, new CEPngExporter())
      } else {
        let content: string
        if (formatId === 'markdown') content = buildMarkdown(job, texts)
        else if (formatId === 'txt') content = buildTxt(job, texts)
        else if (formatId === 'csv') content = buildCsv(job, texts)
        else content = buildJson(job, texts)
        ceTriggerDownload(filenameBase, format, content)
      }

      toast.success(texts.done)
      requestClose()
    } catch {
      toast.error(texts.failed)
```

</details>

#### 缺口

- quota/损坏/覆盖中断恢复、多设备迁移、PNG/PDF完整性与净整理成本未验。
  **影响**：唯一副本/完整档案采用不成立，风险不能用UI成功覆盖。
  **进一步探讨**：隔离origin注入quota失败/坏JSON/覆盖中断，先核备份样本和导出文件，再决定是否日常使用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样让整理入口形成可信资料链？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可检验方向是在导航/导出/本地资料上显示不同的可核状态：原会话ID+节点ID定位成功与DOM未就绪分开，导出带hasMore/分页错误/未渲染附件清单，持久失败保旧并让用户导出恢复副本。基线是当前items/DOM无回执、stall后普通返回、localStorage失败吞掉，不是再增加文件格式。

最小实验用已知轮数、工具/图片与跨会话星标fixture，对照现版与状态版，在旧消息不在DOM、loadOlder连失败3次、quota满和导入中断后核定位成功率、导出缺失是否明确、资料丢失和恢复时间。合格需要未知/部分不冒充完整且人审开销可接受；可沿用宿主session/attachment API和浏览器事务存储，不必发明云知识库。

若操作者只需临时跳转而不归档，全面资料链可能成本过高；若宿主已有完整定位/导出覆盖需求，优先组合原生能力。方向未实现、未计当前创新或潜在经济节时。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/timeline/TimelineRoot.tsx:82-103](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/timeline/TimelineRoot.tsx#L82-L103)

导航无明确回执基线。

<details>
<summary>查看原文（22行）</summary>

```text
  const scrollToItem = useCallback((key: string) => {
    const port = findScrollContainer()
    const el = findMessageElement(key)
    if (port !== null && el !== null) {
      setActiveKey(key)
      smoothScrollTo(port, el)
    }
  }, [])

  // 跨会话导航后的待滚动目标（收藏树 setNavigateDataForUrl 的 DSH 等价物）：
  // 节点出现在列表里时消费并滚动。
  useEffect(() => {
    const tryConsume = (): void => {
      const pending = pendingNavigateStore.get()
      if (pending === null || pending.sessionId !== sessionId) return
      if (!itemsRef.current.some(item => item.key === pending.nodeKey)) return
      const key = pendingNavigateStore.consume(sessionId)
      if (key !== null) scrollToItem(key)
    }
    tryConsume()
    return pendingNavigateStore.subscribe(tryConsume)
  }, [sessionId, items, scrollToItem])
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:118-143](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/index.ts#L118-L143)

历史stall没有完整性标记基线。

<details>
<summary>查看原文（26行）</summary>

```text
        loadFullHistory: async (sessionId: string, options?: {
          readonly onProgress?: (count: number) => void
          readonly shouldCancel?: () => boolean
        }) => {
          const session = ctx.sessions.binding(sessionId as SessionId)?.session
          if (session === undefined) return null
          const countTurns = (): number => {
            const chat = session.getSnapshot().chat
            let count = 0
            for (const key of chat.order) {
              const kind = chat.nodes.get(key)?.kind
              if (kind === 'user' || kind === 'steering') count += 1
            }
            return count
          }
          let stall = 0
          while (session.getSnapshot().hasMore && stall < 3) {
            if (options?.shouldCancel?.() === true) break
            const before = session.getSnapshot().chat.order.length
            await session.loadOlder()
            // loadOlder 单页失败不改 hasMore：连续无进展即中止，避免死循环。
            stall = session.getSnapshot().chat.order.length > before ? 0 : stall + 1
            options?.onProgress?.(countTurns())
          }
          const chat = session.getSnapshot().chat
          return { order: chat.order, nodes: chat.nodes }
```

</details>

**依据 3 · 源码核查**：[src/client/starred/storage.ts:95-103](https://github.com/houyanchao/dsh-timeline/blob/599dfb47934a2afb00c29e00d303acfb966ad2cd/src/client/starred/storage.ts#L95-L103)

持久失败基线。

```text

function save(next: StarredState): void {
  bus.set(next)
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  } catch { /* 存储满时忽略 */ }
}

// 跨标签页同步（等价原 chrome.storage.onChanged）。
```

#### 缺口

- 状态回执能否降低实际资料误信而不增过重流程未知。
  **影响**：不是已实现可信归档或已证实需求。
  **进一步探讨**：先有界故障集/原生对照；无显著误信改善或已有原生能力就停止。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
