# dsh-smart-prompt

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[201a022](https://github.com/Arrosam/dsh-smart-prompt/tree/201a022a53499dc59389b4e97006cbc7850d2d6e)

<!-- BEGIN META -->
[![GitHub ★ 2](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=2&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Arrosam/dsh-smart-prompt) [![npm 30d 815](https://img.shields.io/static/v1?label=npm+30d&message=815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smart-prompt)
<!-- END META -->

> **功能**：在 DSH 输入框中改写草稿，支持追问、模式切换和恢复原文。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示发送前澄清、备份和字面检查组合；相对于只靠模型提示保留细节，其可检查字面项有具体机制，未证明任务更正确。

> **主要限制**：[Q03](#research-q03) 的匹配只检查有限字面项，围栏代码不列入 anchor；否定、权限和验收语义仍需用户对照原稿。 [Q07](#research-q07) 显示成功写回不检查请求期间的草稿变化；宿主允许编辑时可覆盖新增内容，原稿备份不能恢复该增量。

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
  - [Q01 · 发送前改写适合谁，相对直接让 Agent 追问增加了什么？](#detail-section-11)
  - [Q02 · 原稿、追问和恢复如何组成一次改写？](#detail-section-12)
  - [Q03 · 硬事实与长度检查能否证明没有改变用户意图？](#detail-section-13)
  - [Q04 · 模型会接收哪些材料，费用和隐私由什么决定？](#detail-section-14)
  - [Q05 · 显式比较权限和否定变化是否值得增加一步？](#detail-section-15)
  - [Q06 · 如何试用并在什么情况恢复原稿？](#detail-section-16)
  - [Q07 · 改写请求期间继续编辑，会不会被后到结果覆盖？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：写模糊或口语化需求的 DSH 用户可以先检查改写草稿，再决定是否发送给 Agent。

直接向 Agent 发送原文并追问，或手工整理需求，均可完成澄清；实际效率差异未知。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 草稿改写 | 生成可审阅的输入文本 | 依赖模型与宿主，不保证语义不变 |
| 追问 | 在发送前补充用户条件 | 需要可交互会话，跳过策略依模式变化 |
| 字面检查 | 找出有限可识别细节的丢失 | 不覆盖围栏代码或否定权限关系 |
| 附件上下文 | 把可读取内容交给改写模型 | 文件有截取上限，读取失败可能省略 |
| 恢复原稿 | 改写不合适时回退 | 真实宿主交互本次未验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH Host 与 Web 客户端 | 使用需要 | 模型服务、HTTP 与输入框 | 无法假定插件加载 |
| 可用模型 | 改写需要 | 生成改写和追问 | 无路由时拒绝 |
| 会话与追问面板 | 交互追问需要 | 接收用户答案 | 不可用时不能交互追问 |
| 附件服务 | 使用附件时需要 | 读取图像或文件片段 | 读取失败可能降级为空 |
| Web 搜索服务 | 可选 | Stardea 查找建议 | 未启用或缺服务时不搜索 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户选择模型、非敏感草稿与模式 | 确认上下文和附件外发范围 |
| 改写 | 用户发起并按需回答问题 | 错误或取消时核对原稿 |
| 审核 | 用户比较否定、授权、代码与验收 | 不符时恢复原稿 |
| 发送 | 用户确认改写后提交 | 有疑点则直接使用原文 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 兼容宿主及模型费用未知 | 设置模式与外发范围 | 未验证宿主 |
| 持续 | 生成、追问、搜索与修复调用费用未知 | 回答并对照原稿 | 缓存和总耗时未测 |
| 失败恢复 | 重试可能再次收费 | 恢复原文并复核语义 | 具体体验未运行 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 字面检查 | 有有限 anchor 检查、修复和补回 | 全部代码与语义保真 |
| 追问 | 有预算及回答后续生成 | 问题是否必要、任务是否改善 |
| 长度控制 | Light 默认比例与最小预算 | Standard 默认长度及事实补回后的上限 |

> **思考**：[Q03](#research-q03) 的匹配只检查有限字面项，围栏代码不列入 anchor；否定、权限和验收语义仍需用户对照原稿。 [Q07](#research-q07) 显示成功写回不检查请求期间的草稿变化；宿主允许编辑时可覆盖新增内容，原稿备份不能恢复该增量。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示发送前澄清、备份和字面检查组合；相对于只靠模型提示保留细节，其可检查字面项有具体机制，未证明任务更正确。

[Q03](#research-q03) 将字面检查和长度逻辑拆成可定位步骤；该检查有数量、代码块及语义边界，不能升级为保证意图不变。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的匹配只检查有限字面项，围栏代码不列入 anchor；否定、权限和验收语义仍需用户对照原稿。 [Q07](#research-q07) 显示成功写回不检查请求期间的草稿变化；宿主允许编辑时可覆盖新增内容，原稿备份不能恢复该增量。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 建议先用非关键草稿试 Light，并对照原文核权限和否定；不符时恢复原稿。 [Q07](#research-q07) 请求中应停止编辑并备份草稿，取消是手动操作，不构成自动并发保护。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有条件的改写和检查机制；语义保真、任务效果及真实宿主体验未经本次验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/orchestrate.ts、src/anchors.ts、src/length-gate.ts、src/attachments.ts、src/client/refine.ts、src/config.ts、src/client/components.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查 Host 路由、客户端草稿替换、追问、附件、字面和长度 gate；未全面审计所有 UI、会话服务或提供商，不执行目标代码或模型。
- 下一步：以包含路径、长代码、否定、权限和附件的匿名样本比较直接发送、现有改写及人工审核，记录语义错误、费用与时间。

**分析版本**

- **仓库**：[Arrosam/dsh-smart-prompt](https://github.com/Arrosam/dsh-smart-prompt)
- **版本号**：1.2.0（[固定提交 201a022](https://github.com/Arrosam/dsh-smart-prompt/tree/201a022a53499dc59389b4e97006cbc7850d2d6e)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提出显式提示权限、否定和验收差异的未验证假设；若误报负担超过人工对照收益则不推广。

以包含路径、长代码、否定、权限和附件的匿名样本比较直接发送、现有改写及人工审核，记录语义错误、费用与时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 1175 | — | — | 17261 |
| .js | source | 25 | 6121 | 4292 | 1839 | — |
| .mjs | source | 1 | 193 | 163 | 20 | — |
| .ts | source | 38 | 7201 | 4370 | 2212 | — |
| .mjs | test | 30 | 12995 | 10580 | 1181 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-smart-prompt/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-smart-prompt/issues?q=is%3Aissue+created%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Arrosam/dsh-smart-prompt/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T08%3A22%3A39.587Z..2026-11-04T08%3A22%3A39.587Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查发送前改写、追问、字面保留与恢复是否支持有条件使用。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 发送前改写适合谁，相对直接让 Agent 追问增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

写口语化需求或不确定约束的 DSH 用户可以在发送前审阅更清晰的草稿；原办法是直接发送并在对话中追问，或手工整理。包声明 Web 客户端与 Host，客户端将草稿送往 Host 并在成功时替换输入框，保存原文供恢复。增量是发送前加入澄清与可回退的字面检查，不是证明后续任务更正确；项目注明来自已有提示词插件，不能把基础改写归为首创。已精确或涉及严格权限的草稿可能不需要改写。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-6](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/README.md#L1-L6)

作者定位输入框改写。

```text
# dsh-smart-prompt [![Awesome DSH Plugin](https://awesome-dsh-plugin.com/badge.svg)](https://awesome-dsh-plugin.com)

A DSH plugin that turns a rough composer draft into a clear prompt an agent can act on, in one click.

Type your request the way you would say it, click the **✦** button next to Send, and the draft is replaced with a cleaner version. Paths, names, numbers, URLs and code from your draft are kept exactly as you wrote them.

```

**依据 2 · 源码核查**：[package.json:1-14](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/package.json#L1-L14)

包身份和 Host 入口。

<details>
<summary>查看原文（14行）</summary>

```text
{
  "name": "dsh-smart-prompt",
  "version": "1.2.0",
  "description": "Rewrite the composer draft into a clearer, agent-ready prompt in one click, with Revert and Retry. 一键把输入框草稿改写为更清晰、更贴 Agent 执行的提示词。",
  "icon": "./assets/icon.svg",
  "publishConfig": {
    "access": "public"
  },
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "files": [
    "lib",
    "prompts",
```

</details>

**依据 3 · 源码核查**：[package.json:66-85](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/package.json#L66-L85)

客户端注入和导出声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
```

</details>

**依据 4 · 源码核查**：[src/client/refine.ts:152-166](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L152-L166)

成功替换输入框，失败走错误。

<details>
<summary>查看原文（15行）</summary>

```text
/** Apply one refine reply: `/improve` and `/answer` answer in the same shapes. */
function settle(sessionId: string, data: ApiResponse, actions: InputActionsFace, t: TFn): void {
  if (data.ok === true && typeof data.text === 'string' && data.text !== '') {
    const latest = storeFor(sessionId)
    latest.enhanced = data.text
    latest.meta = data.meta !== undefined ? data.meta : null
    latest.phase = 'done'
    latest.controller = null
    actions.setDraft(data.text)
    notify(sessionId)
    return
  }
  const ask = data.ok === true ? parseAsk(data.ask) : null
  if (ask !== null) openAsk(sessionId, ask, actions, t)
  else fail(sessionId, failureText(data, t))
```

</details>

**依据 5 · 源码核查**：[src/client/refine.ts:191-224](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L191-L224)

保存原稿并向 Host 发送请求。

<details>
<summary>查看原文（34行）</summary>

```text
export function runImprove(sessionId: string, text: string, actions: InputActionsFace, t: TFn): void {
  if (splitCommand(text).body === '') return
  const current = storeFor(sessionId)
  const controller = new AbortController()
  current.controller = controller
  current.phase = 'busy'
  current.error = null
  current.backup = text
  current.meta = null
  current.enhanced = ''
  // A new refine gets its own success bubble.
  current.doneBubbleOwner = null
  notify(sessionId)

  // The attachments in the composer now: they stay there whatever the refine does.
  const attachmentIds = current.attachmentIds
  const serialize = current.serialize

  void (async () => {
    let attachments: readonly unknown[] = []
    try {
      if (attachmentIds.length > 0 && serialize !== null) attachments = await serialize(attachmentIds)
    } catch {
      // Typically a file still uploading: refining without it would ignore what the user attached.
      fail(sessionId, controller.signal.aborted ? t('err_ABORTED') : t('err_ATTACHMENTS'))
      return
    }
    // No mode: the host reads it from the plugin settings page.
    await send(sessionId, controller, ENDPOINT.improve, {
      sessionId,
      text,
      ...(attachments.length > 0 ? { attachments } : {}),
      ...(publisher !== null ? { interactive: true } : {}),
    }, actions, t)
```

</details>

#### 缺口

- 没有同任务与直接对话的用户对照
  **影响**：无法量化省时、任务成功或需求频率
  **进一步探讨**：用相同草稿比较直接对话和发送前改写的任务及审阅时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 原稿、追问和恢复如何组成一次改写？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端备份原稿、序列化附件并发起 Host 请求；Host 路由取会话及设置后调用 orchestrator。orchestrator 拒绝空文本、无正文命令或过长输入，按会话或默认配置选择模型，将草稿、上下文和附件送入同一轮改写。存在可交互面板时可在预算内追问，用户回答后继续生成；跳过时 Light 可保留初稿，而 Standard 和 Detailed 可请求猜测补充。成功结果写入输入框，失败路径保留原草稿；这些行为依赖实际宿主和模型，源码不证明 UI 一定加载或结果语义正确。 请求期间新编辑的草稿没有版本比较保护，详见 [Q07](#research-q07)。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/refine.ts:191-224](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L191-L224)

备份草稿并提交 Host。

<details>
<summary>查看原文（34行）</summary>

```text
export function runImprove(sessionId: string, text: string, actions: InputActionsFace, t: TFn): void {
  if (splitCommand(text).body === '') return
  const current = storeFor(sessionId)
  const controller = new AbortController()
  current.controller = controller
  current.phase = 'busy'
  current.error = null
  current.backup = text
  current.meta = null
  current.enhanced = ''
  // A new refine gets its own success bubble.
  current.doneBubbleOwner = null
  notify(sessionId)

  // The attachments in the composer now: they stay there whatever the refine does.
  const attachmentIds = current.attachmentIds
  const serialize = current.serialize

  void (async () => {
    let attachments: readonly unknown[] = []
    try {
      if (attachmentIds.length > 0 && serialize !== null) attachments = await serialize(attachmentIds)
    } catch {
      // Typically a file still uploading: refining without it would ignore what the user attached.
      fail(sessionId, controller.signal.aborted ? t('err_ABORTED') : t('err_ATTACHMENTS'))
      return
    }
    // No mode: the host reads it from the plugin settings page.
    await send(sessionId, controller, ENDPOINT.improve, {
      sessionId,
      text,
      ...(attachments.length > 0 ? { attachments } : {}),
      ...(publisher !== null ? { interactive: true } : {}),
    }, actions, t)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:350-369](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/index.ts#L350-L369)

Host 解析会话、模式与追问设置并调用。

<details>
<summary>查看原文（20行）</summary>

```text
  function startRefine(input: Record<string, unknown>, signal: AbortSignal): Promise<Exchange> {
    // One settings snapshot per refinement: a save landing mid-refinement cannot mix values.
    const settings = readLiveSettings(rawConfig)
    const draft = typeof input.text === 'string' ? input.text : ''
    const sessionId = typeof input.sessionId === 'string' && input.sessionId !== '' ? input.sessionId : ''
    const attachments = Array.isArray(input.attachments) ? input.attachments as unknown[] : []
    // The settings page owns the mode; a request may still name one explicitly.
    const mode: Mode = isOneOf(input.mode, MODE_VALUES) ? input.mode : settings.mode
    const interactive = input.interactive === true && sessionId !== ''
    return desk.start(sessionId, signal, (ask, runSignal) => improveDraft(
      { ...deps(settings), askUser: interactive ? () => ask : undefined },
      config,
      {
        draft, sessionId, mode, signal: runSignal, attachments,
        maxQuestions: settings.maxQuestions,
        lookupRounds: settings.sessionLookupRounds,
        stardeaIdeas: settings.stardeaIdeas,
        stardeaRounds: settings.stardeaRounds,
        stardeaWebSearch: settings.stardeaWebSearch,
      },
```

</details>

**依据 3 · 源码核查**：[src/orchestrate.ts:242-265](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L242-L265)

输入检查和模型路由。

<details>
<summary>查看原文（24行）</summary>

```text
export async function improveDraft(deps: ImproveDeps, cfg: ResolvedConfig, input: ImproveInput): Promise<ImproveOutcome> {
  // ---- local guards: refuse before any model traffic ----
  if (input.draft.trim() === '') return refuse(ERR.EMPTY, MESSAGE.EMPTY)
  // A leading slash token is the harness's command: rewrite only what follows it,
  // then put the prefix back verbatim. A command with no body has nothing to do.
  const split = splitCommand(input.draft)
  if (split.command !== '' && split.body === '') {
    return refuse(ERR.COMMAND, MESSAGE.COMMAND)
  }
  const draft = split.body
  if (charLength(draft) > cfg.maxInputChars) {
    return refuse(ERR.TOO_LONG, MESSAGE.tooLong(charLength(draft), cfg.maxInputChars))
  }
  const llm = deps.llm
  if (llm === undefined) return refuse(ERR.NO_ROUTE, MESSAGE.NO_LLM)

  let route: Route
  try {
    route = resolveRoute({
      dedicated: deps.dedicated,
      conversation: input.sessionId !== '' && deps.conversationModel !== undefined ? deps.conversationModel(input.sessionId) : undefined,
      defaults: deps.selection,
      lastSeen: deps.lastRoute ?? null,
    })
```

</details>

**依据 4 · 源码核查**：[src/orchestrate.ts:311-357](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L311-L357)

追问条件和首次模型请求。

<details>
<summary>查看原文（47行）</summary>

```text
  // Answers survive a failed refinement so its retry skips the question panel. Keyed by
  // session, so a request without one (scripts) never shares answers.
  const memory = input.sessionId !== '' ? deps.answers : undefined
  let memo = memory?.recall(input.sessionId, draft)
  const policy = FOLLOW_UP_POLICY[input.mode]
  // Questions a recalled memo already used count against the cap.
  const recalledAsked = memo?.asked ?? 0
  let questionsLeft = Math.max(0, maxQuestions - recalledAsked)
  // Only invite questions when someone can answer them; otherwise the rewrite stays as before.
  // A recalled memo ends the asking, except in a mode that asks again after answers.
  const canAsk = maxQuestions > 0 && input.sessionId !== '' && deps.askUser !== undefined
    && (memo === undefined || (policy.askAgain && questionsLeft > 0))
  const ask = canAsk ? deps.askUser?.(input.sessionId) : undefined

  // ---- the refinement's one conversation: system prompt and tools fixed from here on ----
  const sources = lookupSources(deps, input, ask !== undefined)
  const instructions = ask !== undefined
    ? [questionsPrompt(maxQuestions), stardeaPrompt(stardeaIdeas, stardeaRounds), answersPrompt()]
    : memo !== undefined ? [answersPrompt()] : []
  const chat = new RefineChat({
    llm, route, config: cfg,
    lookups: new Lookups([...sources.session, ...sources.web]),
    system: (withTools) => buildSystemPrompt(input.mode, cfg, [...instructions, ...attachmentExtra, ...(withTools ? [lookupPrompt(lookupRounds)] : [])]),
  })
  // The rewrite steps share one round budget; the web serves Stardea ideas only.
  const rewriteBudget = new RoundBudget(lookupRounds)
  const rewriteTools = Lookups.namesOf(sources.session)
  const noTools: ReadonlySet<string> = new Set()

  let anchors = cfg.fidelityGate ? extractAnchors(draft) : []
  const maxRatio = maxRatioFor(cfg, input.mode)
  let enhanced = ''
  // Questions asked in this refinement; a recalled memo's are counted in `recalledAsked`.
  let askedCount = 0

  // Standard and Detailed end every user turn with where the questions stand; Light sends none.
  const statusNote = (state: FollowUpState): string => (policy.roundRules ? '\n\n' + followUpStatus(state) : '')
  const askState = (ended: 'limit' | 'unavailable'): FollowUpState =>
    (ask !== undefined && questionsLeft > 0 ? { kind: 'open', questionsLeft } : { kind: ended })

  // ---- first rewrite: may list missing information; a recalled memo answers it at once ----
  const first = await chat.step({
    // The knowledge opens the conversation, ahead of the task, like workspace instructions do.
    text: [knowledgeBlock(knowledge?.text ?? ''), buildUserMessage(draft, contextBlock, '', memo !== undefined ? formatAnswers(memo.answered) : '')]
      .filter((part) => part !== '').join('\n\n') + statusNote(askState(memo !== undefined ? 'limit' : 'unavailable')),
    content: attachmentContent,
  }, rewriteBudget, rewriteTools, input.signal)
```

</details>

**依据 5 · 源码核查**：[src/orchestrate.ts:363-410](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L363-L410)

追问、回答及跳过后的策略。

<details>
<summary>查看原文（48行）</summary>

```text
  // ---- follow-up rounds, with Stardea ideas on request ----
  // Light runs one round; Standard and Detailed ask one question per round until nothing is
  // missing or the cap is reached (FOLLOW_UP_POLICY).
  const ideaTools = Lookups.namesOf([...sources.session, ...sources.web])
  while (ask !== undefined && parsed.questions.length > 0) {
    const asked = parsed.questions
    askedCount += asked.length
    questionsLeft -= asked.length
    const questions = asked.map((question, index) => ({ id: questionId(index), question, header: QUESTION_HEADER }))
    // Settling the questions stops any idea request still running, so the rewrite never waits for one.
    const asking = new AbortController()
    const ideas = new IdeaBook()
    const stardea: Stardea = async (id, signal) => {
      const question = questions.find((candidate) => candidate.id === id)
      if (question === undefined || asking.signal.aborted) return refuse(ERR.NO_RUN, MESSAGE.NO_RUN)
      const result = await chat.step({ text: stardeaTurn(id, question.question, ideas.has(id), stardeaIdeas) },
        new RoundBudget(stardeaRounds), ideaTools, AbortSignal.any([signal, input.signal, asking.signal]))
      if (!result.ok) return failureOf(result.failure, cfg)
      const found = parseIdeas(result.text)
      if (found.length === 0) return refuse(ERR.EMPTY_OUTPUT, MESSAGE.NO_IDEAS)
      return { ok: true, ideas: ideas.add(id, found, stardeaIdeas) } satisfies StardeaOutcome
    }
    let reply: SeamAnswer | undefined
    try {
      reply = await ask(questions, input.signal, stardea)
    } catch {
      // Dismissed: the refinement is cancelled (checked below).
      reply = undefined
    } finally {
      asking.abort()
    }
    const answered = reply !== undefined ? answeredQuestions(asked, reply) : []
    // Remembered before the abort check: answers given just before a cancel still count.
    if (answered.length > 0) {
      memo = { asked: recalledAsked + askedCount, answered: [...(memo?.answered ?? []), ...answered] }
      memory?.remember(input.sessionId, draft, memo)
    }
    if (input.signal.aborted) return aborted()

    // Nothing answered (Skip): Light keeps the rewrite; Standard and Detailed rewrite with guesses.
    if (answered.length === 0 && !policy.guessOnSkip) break

    // ---- rewrite once more, in the same conversation ----
    const state: FollowUpState = answered.length === 0 ? { kind: 'skipped' } : policy.askAgain ? askState('limit') : { kind: 'limit' }
    const turn = answered.length > 0 ? answersTurn(formatAnswers(answered)) : skippedTurn()
    const next = await chat.step({ text: turn + statusNote(state) }, rewriteBudget, rewriteTools, input.signal)
    if (!next.ok) return failureOf(next.failure, cfg)
    parsed = parseRewrite(next.text, state.kind === 'open' ? questionsForReply(policy, questionsLeft) : 0)
```

</details>

**依据 6 · 源码核查**：[src/client/refine.ts:152-175](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L152-L175)

成功替换及失败路径。

<details>
<summary>查看原文（24行）</summary>

```text
/** Apply one refine reply: `/improve` and `/answer` answer in the same shapes. */
function settle(sessionId: string, data: ApiResponse, actions: InputActionsFace, t: TFn): void {
  if (data.ok === true && typeof data.text === 'string' && data.text !== '') {
    const latest = storeFor(sessionId)
    latest.enhanced = data.text
    latest.meta = data.meta !== undefined ? data.meta : null
    latest.phase = 'done'
    latest.controller = null
    actions.setDraft(data.text)
    notify(sessionId)
    return
  }
  const ask = data.ok === true ? parseAsk(data.ask) : null
  if (ask !== null) openAsk(sessionId, ask, actions, t)
  else fail(sessionId, failureText(data, t))
}

/** Send one refine request and apply its reply; aborting `controller` cancels the refine. */
async function send(sessionId: string, controller: AbortController, endpoint: Endpoint, body: unknown, actions: InputActionsFace, t: TFn): Promise<void> {
  try {
    settle(sessionId, await postJson(endpoint, body, controller.signal), actions, t)
  } catch (error) {
    fail(sessionId, transportFailureText(error, t))
  }
```

</details>

#### 缺口

- 未运行宿主、模型及追问面板
  **影响**：无法确认具体版本的交互和失败体验
  **进一步探讨**：在隔离会话测试回答、跳过、取消、错误与原文恢复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 硬事实与长度检查能否证明没有改变用户意图？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。匹配器提取路径、URL、标识符和短内联代码等可识别字面片段，默认最多 200 个；围栏代码块被占用但不记为 anchor，长度超过 120 的片段也不记录。保留检查采用原文或去空白后的包含匹配，不验证否定、权限、对象关系或语义。缺失片段或超长触发最多一次修复，仍缺失时把字面项追加；有追加时最终长度上限让位。Light 默认比例为 2，预算至少 600 字符，Standard 默认不设比例上限。因此报告的保留数量只覆盖提取规则，不是语义合格率或全部代码保留证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/anchors.ts:20-27](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L20-L27)

数量与长度边界。

```text
}

/** Maximum anchors tracked; beyond this the gate reports honestly rather than growing unbounded. */
const MAX_ANCHORS = 200
/** Anchors shorter than this are noise (single letters, one-digit numbers). */
const MIN_LENGTH = 2
/** Cap for one kept span. */
const MAX_CODE_LENGTH = 120
```

**依据 2 · 源码核查**：[src/anchors.ts:37-53](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L37-L53)

围栏代码块只占用不记录。

<details>
<summary>查看原文（17行）</summary>

````text
interface Matcher {
  readonly kind: AnchorKind
  readonly pattern: RegExp
  /** Claim the span without recording it: used for fenced blocks, which are payload, not a fact. */
  readonly claimOnly?: boolean
}

/**
 * Ordered matchers; earlier matchers claim their spans so later ones cannot re-read
 * them. A fenced code block is CLAIMED but not recorded — it is normally the payload
 * the user pasted, not a fact the surrounding prose must reproduce — while an inline
 * \`code\` span is short, specific, and always recorded.
 */
const MATCHERS: ReadonlyArray<Matcher> = [
  { kind: 'code', pattern: /```[\s\S]*?```/g, claimOnly: true },
  { kind: 'code', pattern: /`[^`\n]+`/g },
  { kind: 'url', pattern: /https?:\/\/[^\s<>()[\]"'`]+/g },
````

</details>

**依据 3 · 源码核查**：[src/anchors.ts:97-117](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L97-L117)

提取、长度与数量处理。

<details>
<summary>查看原文（21行）</summary>

```text
  for (const { kind, pattern, claimOnly } of MATCHERS) {
    const re = new RegExp(pattern.source, pattern.flags)
    let match: RegExpExecArray | null
    while ((match = re.exec(text)) !== null) {
      if (match[0] === '') { re.lastIndex += 1; continue }
      const start = match.index
      const end = start + match[0].length
      let free = true
      for (let i = start; i < end; i += 1) {
        if (claimed[i] === true) { free = false; break }
      }
      if (!free) continue
      for (let i = start; i < end; i += 1) claimed[i] = true
      if (claimOnly === true) continue
      const value = unwrap(kind, match[0])
      if (value.length < MIN_LENGTH || value.length > MAX_CODE_LENGTH) continue
      const key = kind + '\u0000' + value
      if (seen.has(key)) continue
      seen.add(key)
      out.push({ text: value, kind })
      if (out.length >= limit) return out
```

</details>

**依据 4 · 源码核查**：[src/anchors.ts:148-157](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L148-L157)

字面及空白归一匹配。

<details>
<summary>查看原文（10行）</summary>

```text
export function anchorSurvives(
  anchor: Anchor,
  normalizedEnhanced: string,
  rawEnhanced: string,
  strippedEnhanced?: string,
): boolean {
  if (rawEnhanced.includes(anchor.text)) return true
  if (normalizedEnhanced.includes(normalizeForMatch(anchor.text))) return true
  const stripped = strippedEnhanced !== undefined ? strippedEnhanced : stripWhitespace(rawEnhanced)
  return stripped.includes(stripWhitespace(anchor.text))
```

</details>

**依据 5 · 源码核查**：[src/orchestrate.ts:416-454](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L416-L454)

检查、一次修复、重注入和长度例外。

<details>
<summary>查看原文（39行）</summary>

```text
  // The length budget covers what the user supplied: the draft plus their answers.
  const lengthBase = memo !== undefined ? draft + '\n' + memo.answered.map((a) => a.answer).join('\n') : draft
  if (memo !== undefined && cfg.fidelityGate) anchors = extractAnchors(lengthBase)

  // ---- gates ----
  let fidelity = checkFidelity(anchors, enhanced)
  const verdict = cfg.lengthGate ? lengthVerdict(lengthBase, enhanced, maxRatio) : { kind: 'ok' as const, ratio: 1 }

  if ((fidelity.missing.length > 0 || verdict.kind === 'converge') && !input.signal.aborted) {
    const clauses: string[] = []
    if (verdict.kind === 'converge') clauses.push(lengthRepairClause(charLength(enhanced), verdict.charBudget))
    if (fidelity.missing.length > 0) clauses.push(repairClause(fidelity.missing))

    // The repair runs no lookups: it only reworks the rewrite already in the conversation.
    const repair = await chat.step({ text: clauses.join('\n').trim() }, new RoundBudget(0), noTools, input.signal)
    if (repair.ok) {
      const repaired = cleanRewrite(repair.text)
      if (repaired !== '') {
        enhanced = repaired
        fidelity = checkFidelity(anchors, enhanced)
      }
    }
  }
  if (input.signal.aborted) return aborted()

  // ---- deterministic last resort: never silently lose a fact ----
  let reinjected = 0
  if (cfg.fidelityGate && fidelity.missing.length > 0) {
    const block = reinjectionBlock(fidelity.missing)
    if (block !== '') {
      enhanced = enhanced + block
      reinjected = fidelity.missing.length
    }
  }

  // ---- final length judgement: a re-appended fact outranks the ceiling ----
  const final = lengthVerdict(lengthBase, enhanced, maxRatio)
  if (cfg.lengthGate && reinjected === 0 && final.kind === 'converge') {
    return refuse(ERR.LENGTH_EXCEEDED, MESSAGE.lengthExceeded(charLength(enhanced), final.charBudget, formatRatio(final.ratio)))
```

</details>

**依据 6 · 源码核查**：[src/length-gate.ts:15-22](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/length-gate.ts#L15-L22)

最小长度预算。

```text
/**
 * Absolute character budget below which the ratio does not apply.
 *
 * Sized so a terse draft can still come back as a short structured prompt
 * (deliverable + constraints + acceptance) rather than being refused its own
 * improvement.
 */
export const MIN_BUDGET_CHARS = 600
```

**依据 7 · 源码核查**：[src/config.ts:40-46](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/config.ts#L40-L46)

模式默认比例。

```text
/** Light-mode length ceiling: the rewrite may reach this multiple of the draft. */
export const DEFAULT_LIGHT_MAX_RATIO = 2
/**
 * Standard-mode length ceiling. 0 = uncapped (user decision): restructuring a draft
 * that needed follow-up answers was refused too often; set a positive ratio to cap it.
 */
export const DEFAULT_STANDARD_MAX_RATIO = 0
```

#### 缺口

- 未测约束、否定与代码重写的同条件样本
  **影响**：不能估计语义越界或误报率
  **进一步探讨**：以授权、否定和长代码样本对照原稿逐项审核。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 模型会接收哪些材料，费用和隐私由什么决定？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

Host 需要模型和 Web 服务；设置允许使用会话模型或默认模型。orchestrator 可读取工作区知识、近期消息并按条件搜索会话；附件服务可把图像和文件文本加入模型输入，单文件文本上限 20000 字符、合计 60000。附件读取失败时除取消外会降级为空，可能让模型缺少用户以为已提供的内容；客户端上传序列化失败则拒绝请求。网络搜索仅在可追问、启用相应选项并有服务时用于 Stardea。生成、追问、检索和修复可能增加调用；费用、供应商缓存命中及数据政策取决于实际模型与设置，不能据调用次数推金额。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:59-63](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/index.ts#L59-L63)

Host 必需服务。

```text
/** Cordis plugin name. */
export const name = 'dsh-smart-prompt'

/** Required services: the model registry and the HTTP carrier. */
export const inject = ['llm', 'webServer']
```

**依据 2 · 源码核查**：[src/orchestrate.ts:217-224](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L217-L224)

会话查询及可选 Stardea 网络搜索。

```text
function lookupSources(deps: ImproveDeps, input: ImproveInput, canAsk: boolean): { session: LookupSource[]; web: LookupSource[] } {
  const stardeaSearches = canAsk && (input.stardeaRounds ?? 0) > 0
  const load = deps.sessionMessages
  const sessionUsed = (input.lookupRounds ?? 0) > 0 || stardeaSearches
  return {
    session: sessionUsed && input.sessionId !== '' && load !== undefined ? [new SessionLookup(() => load(input.sessionId))] : [],
    web: stardeaSearches && input.stardeaWebSearch === true && deps.web !== undefined ? [new WebLookup(deps.web)] : [],
  }
```

**依据 3 · 源码核查**：[src/orchestrate.ts:272-305](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L272-L305)

知识、会话和附件读取及失败退化。

<details>
<summary>查看原文（34行）</summary>

```text
  // ---- workspace knowledge: read first, like workspace instructions ----
  const store = cfg.knowledgeChars > 0 && input.sessionId !== '' ? deps.knowledge?.(input.sessionId) : undefined
  const knowledge = store !== undefined ? await loadKnowledge(store, cfg.knowledgeChars) : undefined

  // ---- context: the last turn always; more turns only when the draft cannot stand alone ----
  const trigger = cfg.smartContext && cfg.contextTurns > 0
    ? contextTrigger(draft)
    : { needed: false, reason: 'none' as const }
  const turnCount = trigger.needed ? cfg.contextTurns : Math.min(ALWAYS_KEPT_TURNS, cfg.contextTurns)
  let turns: HistoryTurn[] = []
  if (turnCount > 0 && input.sessionId !== '' && deps.sessions !== undefined) {
    // Context is an optimization, never a precondition: a broken session store
    // degrades to no context instead of failing the enhancement.
    try {
      turns = collectTurns(liveMessages(deps.sessions, input.sessionId), turnCount, cfg.contextChars)
    } catch { turns = [] }
  }
  const contextBlock = formatHistoryBlock(turns)
  const contextReason = trigger.needed ? trigger.reason : 'last-turn'

  // ---- attachments: the draft's own, then images of the turns kept above ----
  let current: readonly unknown[] = []
  if (input.attachments !== undefined && input.attachments.length > 0 && deps.readAttachments !== undefined) {
    // Like context, attachments only inform the rewrite (the agent receives them anyway),
    // so one that cannot be read is left out rather than failing the refinement.
    try {
      current = await deps.readAttachments(input.sessionId, input.attachments, input.signal)
    } catch {
      if (input.signal.aborted) return aborted()
      current = []
    }
  }
  const attachmentContent = buildAttachmentContent(turns, current)
  const attachmentExtra = attachmentContent.length > 0 ? [attachmentsPrompt()] : []
```

</details>

**依据 4 · 源码核查**：[src/attachments.ts:33-38](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/attachments.ts#L33-L38)

文件文本截取上限。

```text
/** Bytes read from one file; the rest is left to the agent, who gets the whole file. */
const FILE_BYTES = 64 * 1024
/** Characters of one file's text shown to the refinement model. */
const FILE_CHARS = 20000
/** Characters of file text across all attachments of one draft. */
const TOTAL_FILE_CHARS = 60000
```

**依据 5 · 源码核查**：[src/attachments.ts:66-90](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/attachments.ts#L66-L90)

附件准入和文本或图片块。

<details>
<summary>查看原文（25行）</summary>

```text
export async function readAttachments(services: AttachmentServices, sessionId: string, wire: readonly unknown[], signal: AbortSignal): Promise<unknown[]> {
  const parts = wire.map((raw): unknown => {
    const item = asRecord(raw) as WireItem
    if (item.type === 'image' && typeof item.mediaType === 'string' && typeof item.data === 'string') {
      return { type: 'image', mediaType: item.mediaType, data: item.data, ...(typeof item.name === 'string' && item.name !== '' ? { name: item.name } : {}) }
    }
    if (item.type === 'file' && typeof item.receiptId === 'string') {
      const attachment = services.resolveFile(sessionId, item.receiptId)
      if (attachment === undefined || attachment === null) throw new Error('an attached file is no longer available; attach it again')
      return receiptPart(attachment)
    }
    throw new Error('unsupported attachment')
  })
  const admitted = await services.admit(parts)
  const blocks: unknown[] = []
  let budget = TOTAL_FILE_CHARS
  for (const raw of admitted) {
    const part = (raw ?? {}) as AdmittedPart
    if (part.type === 'image') {
      blocks.push(Object.freeze({ type: 'image', attachment: part.attachment }))
    } else if (part.type === 'file') {
      const text = await fileText(services, part.attachment, signal, budget)
      budget -= text.shown
      blocks.push(Object.freeze({ type: 'text', text: text.block }))
    }
```

</details>

**依据 6 · 源码核查**：[src/client/refine.ts:205-224](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L205-L224)

上传序列化失败与请求提交。

<details>
<summary>查看原文（20行）</summary>

```text
  // The attachments in the composer now: they stay there whatever the refine does.
  const attachmentIds = current.attachmentIds
  const serialize = current.serialize

  void (async () => {
    let attachments: readonly unknown[] = []
    try {
      if (attachmentIds.length > 0 && serialize !== null) attachments = await serialize(attachmentIds)
    } catch {
      // Typically a file still uploading: refining without it would ignore what the user attached.
      fail(sessionId, controller.signal.aborted ? t('err_ABORTED') : t('err_ATTACHMENTS'))
      return
    }
    // No mode: the host reads it from the plugin settings page.
    await send(sessionId, controller, ENDPOINT.improve, {
      sessionId,
      text,
      ...(attachments.length > 0 ? { attachments } : {}),
      ...(publisher !== null ? { interactive: true } : {}),
    }, actions, t)
```

</details>

#### 缺口

- 未验证真实服务、附件权限及费用
  **影响**：不能确认外发范围、成本与附件完整性
  **进一步探讨**：核模型数据政策，用公开文本和非敏感附件对照实际请求。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式比较权限和否定变化是否值得增加一步？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可提出未验证假设：改写后把新增权限、被移除的否定条件和改变的验收标准列为待确认差异，让用户逐项接受或回退；可与现有字面 anchor 互补，但语义差异检测本身可能误报或漏报，还要承担额外确认时间。用固定样本比较现有原稿人工对照、候选差异提示及直接发送，测量越权变化发现率、漏报、误报和总审核时间；若原有人工对照已同样有效或误报成本抵消收益，就不引入。当前没有原型和实验。

#### 证据与依据

**依据 1 · 源码核查**：[src/anchors.ts:148-157](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L148-L157)

现有检查只作字面包含。

<details>
<summary>查看原文（10行）</summary>

```text
export function anchorSurvives(
  anchor: Anchor,
  normalizedEnhanced: string,
  rawEnhanced: string,
  strippedEnhanced?: string,
): boolean {
  if (rawEnhanced.includes(anchor.text)) return true
  if (normalizedEnhanced.includes(normalizeForMatch(anchor.text))) return true
  const stripped = strippedEnhanced !== undefined ? strippedEnhanced : stripWhitespace(rawEnhanced)
  return stripped.includes(stripWhitespace(anchor.text))
```

</details>

**依据 2 · 源码核查**：[src/orchestrate.ts:420-447](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L420-L447)

缺失字面内容修复与补回。

<details>
<summary>查看原文（28行）</summary>

```text
  // ---- gates ----
  let fidelity = checkFidelity(anchors, enhanced)
  const verdict = cfg.lengthGate ? lengthVerdict(lengthBase, enhanced, maxRatio) : { kind: 'ok' as const, ratio: 1 }

  if ((fidelity.missing.length > 0 || verdict.kind === 'converge') && !input.signal.aborted) {
    const clauses: string[] = []
    if (verdict.kind === 'converge') clauses.push(lengthRepairClause(charLength(enhanced), verdict.charBudget))
    if (fidelity.missing.length > 0) clauses.push(repairClause(fidelity.missing))

    // The repair runs no lookups: it only reworks the rewrite already in the conversation.
    const repair = await chat.step({ text: clauses.join('\n').trim() }, new RoundBudget(0), noTools, input.signal)
    if (repair.ok) {
      const repaired = cleanRewrite(repair.text)
      if (repaired !== '') {
        enhanced = repaired
        fidelity = checkFidelity(anchors, enhanced)
      }
    }
  }
  if (input.signal.aborted) return aborted()

  // ---- deterministic last resort: never silently lose a fact ----
  let reinjected = 0
  if (cfg.fidelityGate && fidelity.missing.length > 0) {
    const block = reinjectionBlock(fidelity.missing)
    if (block !== '') {
      enhanced = enhanced + block
      reinjected = fidelity.missing.length
```

</details>

#### 缺口

- 没有语义差异原型和人工对照
  **影响**：不能证明降低越权或缩短审核
  **进一步探讨**：用包含否定、授权与验收的匿名样本进行盲测。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何试用并在什么情况恢复原稿？

**研究主题**：采用判断、效果与总成本

#### 完整回答

愿意逐字审阅的用户可先用非关键、非敏感需求和 Light 模式，确认模型、上下文与附件范围，再对照原稿核否定、路径、授权和验收条件。成功标准是相同任务下澄清有效且模型费用与审阅时间可接受；不是草稿变长或 anchor 数量高。若出现新增授权、改变否定、缺失长代码、附件未被读取或猜测混成事实，应停止发送改写，恢复原稿并手工说明；精确命令可直接保留。实际质量、调用费用和恢复体验未测。 请求中不要继续编辑或发送草稿，先复制保留新编辑；原稿恢复只回到请求开始时的文本，不包含等待期间的新改动，详见 [Q07](#research-q07)。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/refine.ts:152-166](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L152-L166)

成功写入和失败处理。

<details>
<summary>查看原文（15行）</summary>

```text
/** Apply one refine reply: `/improve` and `/answer` answer in the same shapes. */
function settle(sessionId: string, data: ApiResponse, actions: InputActionsFace, t: TFn): void {
  if (data.ok === true && typeof data.text === 'string' && data.text !== '') {
    const latest = storeFor(sessionId)
    latest.enhanced = data.text
    latest.meta = data.meta !== undefined ? data.meta : null
    latest.phase = 'done'
    latest.controller = null
    actions.setDraft(data.text)
    notify(sessionId)
    return
  }
  const ask = data.ok === true ? parseAsk(data.ask) : null
  if (ask !== null) openAsk(sessionId, ask, actions, t)
  else fail(sessionId, failureText(data, t))
```

</details>

**依据 2 · 源码核查**：[src/client/refine.ts:191-199](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L191-L199)

保留原稿作为恢复目标。

```text
export function runImprove(sessionId: string, text: string, actions: InputActionsFace, t: TFn): void {
  if (splitCommand(text).body === '') return
  const current = storeFor(sessionId)
  const controller = new AbortController()
  current.controller = controller
  current.phase = 'busy'
  current.error = null
  current.backup = text
  current.meta = null
```

**依据 3 · 源码核查**：[src/anchors.ts:40-53](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/anchors.ts#L40-L53)

围栏代码不列入 anchor。

<details>
<summary>查看原文（14行）</summary>

````text
  /** Claim the span without recording it: used for fenced blocks, which are payload, not a fact. */
  readonly claimOnly?: boolean
}

/**
 * Ordered matchers; earlier matchers claim their spans so later ones cannot re-read
 * them. A fenced code block is CLAIMED but not recorded — it is normally the payload
 * the user pasted, not a fact the surrounding prose must reproduce — while an inline
 * \`code\` span is short, specific, and always recorded.
 */
const MATCHERS: ReadonlyArray<Matcher> = [
  { kind: 'code', pattern: /```[\s\S]*?```/g, claimOnly: true },
  { kind: 'code', pattern: /`[^`\n]+`/g },
  { kind: 'url', pattern: /https?:\/\/[^\s<>()[\]"'`]+/g },
````

</details>

**依据 4 · 源码核查**：[src/orchestrate.ts:402-410](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/orchestrate.ts#L402-L410)

跳过后的模式行为。

```text
    // Nothing answered (Skip): Light keeps the rewrite; Standard and Detailed rewrite with guesses.
    if (answered.length === 0 && !policy.guessOnSkip) break

    // ---- rewrite once more, in the same conversation ----
    const state: FollowUpState = answered.length === 0 ? { kind: 'skipped' } : policy.askAgain ? askState('limit') : { kind: 'limit' }
    const turn = answered.length > 0 ? answersTurn(formatAnswers(answered)) : skippedTurn()
    const next = await chat.step({ text: turn + statusNote(state) }, rewriteBudget, rewriteTools, input.signal)
    if (!next.ok) return failureOf(next.failure, cfg)
    parsed = parseRewrite(next.text, state.kind === 'open' ? questionsForReply(policy, questionsLeft) : 0)
```

#### 缺口

- 没有真实交互、费用与任务对照
  **影响**：不能保证试用净收益或所有故障均可恢复
  **进一步探讨**：隔离会话检查撤回、猜测和原文对照并记录时间与费用。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 改写请求期间继续编辑，会不会被后到结果覆盖？

**研究主题**：功能与机制、缺陷与关键质疑、采用判断

#### 完整回答

客户端 busy 状态只改变改写按钮为取消，插件没有在普通请求期间禁用或锁定宿主编辑器；用户能否编辑仍受宿主自身行为影响。点击时保存的是当时的 text，异步请求成功后直接对捕获的 actions 调用 setDraft(data.text)，没有比较当前草稿、版本或请求身份，也没有因草稿变化自动取消。因此若宿主允许请求期间编辑，后到结果会覆盖这些新编辑；Revert 使用请求开始时备份，不能恢复请求后新增的文字。用户可再次点忙碌按钮主动 abort 请求或取消追问，但这是手动取消，不是编辑并发保护；响应与取消竞态及宿主 UI 尚未实际验证。追问面板占据 composer seat 时的可编辑性另依宿主，不能将其推广为整个请求期间必然不可编辑。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/components.ts:171-219](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/components.ts#L171-L219)

busy 改变按钮的取消行为，未锁定编辑器。

<details>
<summary>查看原文（49行）</summary>

```text
/**
 * Composer button: one click replaces the draft in place; a second click while
 * busy cancels. Disabled on an empty composer or a slash command. While the composer
 * still holds the refined text it renders as the Revert | Retry capsule instead.
 */
export function ImproveButton(props: SeatProps): React.ReactElement | null {
  const t = props.t
  const sessionId = props.sessionId
  useSessionState(sessionId)
  const modeState = useModeState()
  const slide = useModeSlide()
  const draft = readDraft(props)
  const attachmentIds = readAttachmentIds(props)
  // A leading slash token belongs to the harness; only the text after it is ours.
  // A command with no body therefore has nothing to enhance — but a command WITH a
  // body is exactly the case worth enhancing.
  const split = splitCommand(draft)
  const commandOnly = split.command !== '' && split.body === ''
  const blocked = split.body === ''
  const state = sessionId !== undefined ? storeFor(sessionId) : null
  const busy = state !== null && state.phase === 'busy'
  const actions = props.inputActions !== undefined ? props.inputActions : (state !== null ? state.actions : null)

  // Keep the store's composer faces fresh so Revert/Retry can write the draft and every
  // refine sends the attachments the composer holds now.
  if (state !== null) {
    if (props.inputActions !== undefined && state.actions !== props.inputActions) state.actions = props.inputActions
    state.attachmentIds = attachmentIds
    if (props.serializeAttachments !== undefined) state.serialize = props.serializeAttachments
  }

  const onClick = React.useCallback((event?: React.MouseEvent) => {
    // The click that ends a slide on the star only picked the mode.
    if (event !== undefined && slide.endsSlide(event)) return
    dismissOnboarding()
    if (sessionId === undefined || actions === null) return
    if (storeFor(sessionId).phase === 'busy') {
      cancelRefine(sessionId, t)
      return
    }
    runImprove(sessionId, draft, actions, t)
  }, [sessionId, actions, draft, t, slide.endsSlide])

  const action = busy
    ? t('buttonTitleBusy')
    : commandOnly ? t('commandOnlyTitle') : split.command !== '' ? t('buttonTitleCommand') : t('buttonTitle')
  const title = modeState.switchable ? action + '\n' + t('starDragHint') : action

  const isDisabled = !busy && (blocked || actions === null)
```

</details>

**依据 2 · 源码核查**：[src/client/refine.ts:152-175](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L152-L175)

成功直接写回，异步流程没有比较当前草稿。

<details>
<summary>查看原文（24行）</summary>

```text
/** Apply one refine reply: `/improve` and `/answer` answer in the same shapes. */
function settle(sessionId: string, data: ApiResponse, actions: InputActionsFace, t: TFn): void {
  if (data.ok === true && typeof data.text === 'string' && data.text !== '') {
    const latest = storeFor(sessionId)
    latest.enhanced = data.text
    latest.meta = data.meta !== undefined ? data.meta : null
    latest.phase = 'done'
    latest.controller = null
    actions.setDraft(data.text)
    notify(sessionId)
    return
  }
  const ask = data.ok === true ? parseAsk(data.ask) : null
  if (ask !== null) openAsk(sessionId, ask, actions, t)
  else fail(sessionId, failureText(data, t))
}

/** Send one refine request and apply its reply; aborting `controller` cancels the refine. */
async function send(sessionId: string, controller: AbortController, endpoint: Endpoint, body: unknown, actions: InputActionsFace, t: TFn): Promise<void> {
  try {
    settle(sessionId, await postJson(endpoint, body, controller.signal), actions, t)
  } catch (error) {
    fail(sessionId, transportFailureText(error, t))
  }
```

</details>

**依据 3 · 源码核查**：[src/client/refine.ts:191-224](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L191-L224)

请求起始时备份 text，并通过异步路径发送。

<details>
<summary>查看原文（34行）</summary>

```text
export function runImprove(sessionId: string, text: string, actions: InputActionsFace, t: TFn): void {
  if (splitCommand(text).body === '') return
  const current = storeFor(sessionId)
  const controller = new AbortController()
  current.controller = controller
  current.phase = 'busy'
  current.error = null
  current.backup = text
  current.meta = null
  current.enhanced = ''
  // A new refine gets its own success bubble.
  current.doneBubbleOwner = null
  notify(sessionId)

  // The attachments in the composer now: they stay there whatever the refine does.
  const attachmentIds = current.attachmentIds
  const serialize = current.serialize

  void (async () => {
    let attachments: readonly unknown[] = []
    try {
      if (attachmentIds.length > 0 && serialize !== null) attachments = await serialize(attachmentIds)
    } catch {
      // Typically a file still uploading: refining without it would ignore what the user attached.
      fail(sessionId, controller.signal.aborted ? t('err_ABORTED') : t('err_ATTACHMENTS'))
      return
    }
    // No mode: the host reads it from the plugin settings page.
    await send(sessionId, controller, ENDPOINT.improve, {
      sessionId,
      text,
      ...(attachments.length > 0 ? { attachments } : {}),
      ...(publisher !== null ? { interactive: true } : {}),
    }, actions, t)
```

</details>

**依据 4 · 源码核查**：[src/client/refine.ts:228-236](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/refine.ts#L228-L236)

手动取消请求或追问。

```text
/**
 * Cancel the session's running refine, whatever it waits on: the open panel's run through
 * `/cancel`, otherwise the request in flight. Both end with the cancelled failure bubble.
 */
export function cancelRefine(sessionId: string, t: TFn): void {
  const current = storeFor(sessionId)
  if (current.ask !== null) void cancelAsk(sessionId, t)
  else if (current.controller !== null) current.controller.abort()
}
```

**依据 5 · 源码核查**：[src/client/components.ts:221-242](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/components.ts#L221-L242)

Revert 使用开始时备份，非请求期间新编辑。

<details>
<summary>查看原文（22行）</summary>

```text
  // Refined = the composer still holds exactly the text we wrote. Editing or sending
  // the draft changes it, which returns the chip to the star with no extra bookkeeping.
  const refined = state !== null && !busy && state.phase === 'done' && state.enhanced !== '' && draft === state.enhanced

  // The first-use window explains the slide, so it opens only once the star is on screen and the
  // slide works.
  const starSwitchable = modeState.switchable && !refined
  React.useEffect(() => { if (starSwitchable) claimOnboarding() }, [starSwitchable])

  const onRevert = React.useCallback(() => {
    if (sessionId === undefined) return
    const current = storeFor(sessionId)
    const backup = current.backup
    clear(sessionId)
    if (actions !== null) actions.setDraft(backup)
  }, [sessionId, actions])

  // Retry regenerates from the ORIGINAL draft (the Revert target), not from the
  // current refined text, so repeated retries never compound rewrites.
  const onRetry = React.useCallback(() => {
    if (sessionId === undefined || actions === null) return
    runImprove(sessionId, storeFor(sessionId).backup, actions, t)
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:4-11](https://github.com/Arrosam/dsh-smart-prompt/blob/201a022a53499dc59389b4e97006cbc7850d2d6e/src/client/index.ts#L4-L11)

追问面板使用 composer seat，范围不同。

```text
 * Slot entries:
 * - `conversation.input.right` — the sparkle button in the composer tool row.
 * - `conversation.input.overlay` — the floating "improved · certificate" bubble, and the
 *   first-use window that explains the star's mode slide. The host pins this slot's anchor at
 *   zero height to the top edge of the composer card, so neither takes layout space (the
 *   `conversation.input.dock` row the bubble used to sit in did).
 * - `conversation.composer` (chain) — the follow-up panel, which takes the composer seat while
 *   a refine waits for answers. Only on hosts with the `uiSession` pending-interaction registry.
```

#### 缺口

- 未运行目标宿主或注入响应与取消竞态
  **影响**：无法断言具体宿主实际编辑状态或复现覆盖
  **进一步探讨**：在隔离宿主延迟响应并中途输入，核写回、取消和撤销。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
