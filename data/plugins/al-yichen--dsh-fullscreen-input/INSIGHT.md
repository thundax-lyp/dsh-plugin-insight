# dsh-fullscreen-input

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0e21159](https://github.com/AL-Yichen/dsh-fullscreen-input/tree/0e211595f4f07289ba3b713b67d47b90498fa082)

<!-- BEGIN META -->
[![GitHub ★ 4](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=4&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AL-Yichen/dsh-fullscreen-input) [![npm 30d 748](https://img.shields.io/static/v1?label=npm+30d&message=748&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fullscreen-input) [![最新发布 2026-10-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-fullscreen-input)
<!-- END META -->

> **功能**：为DSH增加可移动缩放的全屏草稿编辑面板，共用引用与附件，Enter换行、Ctrl/Cmd+Enter发送。

> **亮点**：大编辑区与共享草稿接线，减少窄框滚动和普通Enter发送入口。详见[Q01](#research-q01)。

> **主要限制**：引用恢复可无声放弃，文件选择依赖首个DOM input，submit未等待异步结果即关闭面板。详见[Q03](#research-q03)。

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
  - [Q01 · 全屏输入解决什么问题？](#detail-section-11)
  - [Q02 · 怎样共享草稿、引用和附件？](#detail-section-12)
  - [Q03 · 发送和文件选择有哪些具体边界？](#detail-section-13)
  - [Q04 · 工程实现与三阶段成本是什么？](#detail-section-14)
  - [Q05 · 采用建议和继续探讨方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长提示词和多行中文输入需要更大编辑空间。详见[Q01](#research-q01)。

原输入框或外部编辑器复制，便利不等新增模型能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 全屏编辑 | 长文输入 | 共享宿主草稿无独立备份 |
| 引用/附件 | 保持输入语义 | 恢复API与DOM适配 |
| 明确发送键 | 普通Enter换行 | IME/异步回执 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 匹配DSH客户端slot/API | 共享输入 | 版本敏感 |
| insertReference/draftRev | 富文本恢复 | 缺少则降纯文本 |
| 宿主file input | 文件选择 | DOM顺序风险 |
| localStorage | 外观记忆 | 禁用仅运行期 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| F2/按钮打开 | 用户 | 会话正确 |
| 编辑小草稿 | 用户 | 主框/引用同步 |
| 核附件再发送 | 用户 | 宿主收到/错误可见 |
| 异常回主框 | 用户 | 保留正文与引用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配客户端宿主 | 学键位/核引用附件 | 需匹配客户端和键位/引用理解；准备工时未知 |
| 持续使用 | 浏览器草稿更新/引用重建；发送沿用宿主模型 | 核草稿/引用及多tab偏好 | 无插件新增LLM请求但发送仍计宿主费用；长草稿重建延迟未知 |
| 失败恢复 | 主输入框和宿主状态 | 核引用/异步失败，重要文另备份 | 无独立正文备份；引用/附件/异步发送核对与恢复时间未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 更大编辑区 | 可缩放移动面板 | 可见倍数未测 |
| 少普通Enter误发 | 精确组合键 | IME事件差异 |
| 共用正文引用 | setDraft和恢复 | 缺API/竞态可降级 |

> **思考**：引用恢复可无声放弃，文件选择依赖首个DOM input，submit未等待异步结果即关闭面板。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：大编辑区与共享草稿接线，减少窄框滚动和普通Enter发送入口。详见[Q01](#research-q01)。

scope适配、revision坐标恢复和effect释放可借鉴，语法检查不证明交互完整。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

引用恢复可无声放弃，文件选择依赖首个DOM input，submit未等待异步结果即关闭面板。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

固定宿主长文编辑可试用，先小草稿检查引用附件。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

纯客户端编辑与键位控制可查，引用恢复/DOM选择和异步发送回执存在具体适配边界。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、src/client.js、lib/client.js、build-client.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host空入口、源客户端共享草稿/引用恢复/键位/DOM选择/偏好与注册、构建包装；不穷尽全部外观和拖拽分支。
- 下一步：进一步从多引用/恢复中输入、DOM多控件和async拒绝探讨语义API。

**分析版本**

- **仓库**：[AL-Yichen/dsh-fullscreen-input](https://github.com/AL-Yichen/dsh-fullscreen-input)
- **版本号**：1.2.4（[固定提交 0e21159](https://github.com/AL-Yichen/dsh-fullscreen-input/tree/0e211595f4f07289ba3b713b67d47b90498fa082)）
- **版本日期**：2026-10-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究语义原子草稿/文件API、revision事务和异步发送收据，比较误发与引用丢失。当前未验证。详见[Q05](#research-q05)。

进一步从多引用/恢复中输入、DOM多控件和async拒绝探讨语义API。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 715 | — | — | 17435 |
| .mjs | source | 1 | 46 | 19 | 23 | — |
| .js | source | 3 | 6178 | 3886 | 2025 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AL-Yichen/dsh-fullscreen-input/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AL-Yichen/dsh-fullscreen-input/issues?q=is%3Aissue+created%3A2026-09-22T06%3A16%3A14.744Z..2026-10-22T06%3A16%3A14.744Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AL-Yichen/dsh-fullscreen-input/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A16%3A14.744Z..2026-10-22T06%3A16%3A14.744Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：全屏共享草稿如何保持发送/引用语义，客户端适配与成本如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 全屏输入解决什么问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向长提示词、多行中文输入和附件/引用较多的用户，提供可移动缩放的textarea面板，编辑同一宿主会话草稿，避免在窄输入框来回滚。Enter/Shift+Enter留给换行，明确Ctrl/Cmd+Enter或按钮发送，减少普通Enter误发入口。贡献是独立编辑视图与宿主草稿/引用/附件接线，不是新编辑协议或模型能力。

README说一次可见十几倍文本和原输入法10毫秒问题是作者场景说明，本次没有测屏幕和输入法时序，不能作为量化效率或所有IME无误发保证。成功要同时满足正文、引用芯片、附件和发送目标与主输入框一致，而不是textarea内容看起来相同。替代为原输入框或外部编辑器复制。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-23](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/README.md#L7-L23)

作者场景与效果主张。

<details>
<summary>查看原文（17行）</summary>

```text
给 DSH 的输入框加一个**全屏输入面板**：点开它，在整屏空间里写多行文本，写完点按钮发送。`Enter` 只换行、只有 `Ctrl+Enter` 才发送；面板可以移动、可以拖边框改大小，引用与附件都与主输入框共用同一份草稿。

## 为什么需要一个全屏输入框

DSH 自带的输入框只有**窄窄一条**：写长提示词时只能在一个很扁的区域里翻来覆去，引用、附件、正文全挤在一起，想通读一遍自己写了什么几乎做不到。

这个面板把输入区**放大到整屏**：一次能看到的文本量是原来的十几倍；写完之后还能拖标题栏把它挪到别处、拖边框改成想要的宽高，把背后的会话露出来对照着看。**它不是只读预览，而是替换掉那条窄输入框的编辑场所**——草稿是同一份，在面板里改完关掉，主输入框里就是新内容。

![深色主题下的全屏输入面板：标题栏可拖动、四边可调整大小，正文上方是引用与附件栏](docs/shots/panel-dark.jpg)

*深色主题。面板背后那份草稿就是主输入框里的同一份——面板里写得开，主输入框里会因高度受限被截断。*

## 顺带解决的问题

DSH 原有输入框的 `Shift+Enter` 换行判定依赖一个很短的宽容窗口——输入法组合结束后的 **10 毫秒**内仍算「正在组合」。中文输入法频繁使用 Shift / Enter（切换中英、确认候选词），很容易落进这个窗口，于是 `Shift+Enter` 被误判成发送，多行文本根本写不舒服。

**面板里没有「Enter 发送」这条路径**，所以这个问题在这里不存在。但它是**顺带**解决的：即使没有这个毛病，一个全屏的输入场所本身也是需要的。
```

</details>

**依据 2 · 源码核查**：[src/client.js:2081-2113](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2081-L2113)

共享草稿与附件计数。

<details>
<summary>查看原文（33行）</summary>

```text
  const input = typeof useInput === 'function' ? useInput((s) => s) : undefined
  const draft = draftTextOf(input === undefined || input === null ? '' : input.draft)
  const phase = input === undefined || input === null ? 'inert' : input.phase
  const busy = phase === 'adjudicating' || phase === 'submitting'
  const writable = inputActions !== undefined && inputActions !== null && typeof inputActions.setDraft === 'function'
  const sendable = inputActions !== undefined && inputActions !== null && typeof inputActions.submit === 'function'
  const attachmentIds = input !== undefined && input !== null && Array.isArray(input.attachmentIds) ? input.attachmentIds : EMPTY_IDS
  const attachmentCount = attachmentIds.length
  // The chip view of the editor document. Sorted by offset by the host; empty
  // whenever the draft has no references -- or whenever a programmatic
  // `setDraft` has just flattened them into plain text (see rebuildReferences).
  const occurrences = input !== undefined && input !== null && Array.isArray(input.occurrences) ? input.occurrences : EMPTY_OCCURRENCES
  /** Monotonic editor revision; `insertReference` compares the span against it. */
  const draftRev = input !== undefined && input !== null && typeof input.draftRev === 'number' ? input.draftRev : 0

  // The store keeps attachment **ids only** ("browser objects stay in
  // ConversationController"), so the descriptors -- and with them an image's
  // preview URL -- have to be asked for by id. That lookup is a read: nothing
  // about the host's own behaviour changes.
  const attachmentKey = attachmentIds.join('\u0000')
  const [attachments, setAttachments] = React.useState(EMPTY_ATTACHMENTS)
  React.useEffect(() => {
    if (typeof resolveAttachments !== 'function' || attachmentIds.length === 0) {
      setAttachments(EMPTY_ATTACHMENTS)
      return
    }
    setAttachments(resolveAttachments(attachmentIds))
  }, [attachmentKey, resolveAttachments])

  /** The image currently shown in the lightbox, if any. */
  const [preview, setPreview] = React.useState(null)
  const empty = draft.trim() === '' && attachmentCount === 0
  const blocked = !writable || sessionId === undefined || phase === 'inert'
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1-8](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/lib/index.js#L1-L8)

host为空。

```text
/**
 * dsh-fullscreen-input — host half.
 *
 * The whole feature lives in the browser: it reads and writes the composer's own
 * draft through the client plugin API. The host half exists because a bundle has
 * to mount a row, not because there is anything for Node to do.
 */
export function apply() {}
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 怎样共享草稿、引用和附件？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端slot conversation.input.left按session注入props，用useInput读当前draft/phase/occurrences，inputActions.setDraft整份写回，submit走宿主action而不拼消息。附件通过conversation.resolveDraftAttachments按ID读描述符，预设没有新增模型工具或服务端网络。引用是富文本芯片而draft仅剪贴板投影，setDraft会扁平化，因此先拍occurrences，再按draftRev单个insertReference恢复，计算detect坐标漂移，尝试保持引用语义。

此机制需sessions.scope、会话conversation.input.for和insertReference，版本适配面比单纯textarea大。缺少insertReference直接放弃待恢复，文本仍可见但引用语义不一定保留。package约束DSH 0.2候选范围及Node>=20，客户端依赖locale/conversation/primitives/slots与React；lib为source外包ModuleLoader，固定构建脚本不需bundler。实际宿主富文本坐标/修订行为需匹配，不能仅凭作者注释认定全部兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:1610-1650](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L1610-L1650)

会话API解析。

<details>
<summary>查看原文（41行）</summary>

```text
function sessionApiFor(conversation, sessions, sessionId) {
  const api = {}

  if (conversation !== null && conversation !== undefined
    && typeof conversation.resolveDraftAttachments === 'function') {
    api.resolveAttachments = (ids) => {
      try {
        const resolved = conversation.resolveDraftAttachments(ids)
        return Array.isArray(resolved) ? resolved : EMPTY_ATTACHMENTS
      } catch (error) {
        return EMPTY_ATTACHMENTS
      }
    }
  }

  if (sessions === null || sessions === undefined || typeof sessions.scope !== 'function') return api
  let actx
  try {
    actx = sessions.scope(sessionId)
  } catch (error) {
    return api
  }
  if (actx === null || actx === undefined || typeof actx.get !== 'function') return api
  let scoped
  try {
    scoped = actx.get('conversation')
  } catch (error) {
    return api
  }
  const resolver = scoped === null || scoped === undefined ? undefined : scoped.input
  if (resolver === null || resolver === undefined || typeof resolver.for !== 'function') return api
  let target
  try {
    target = resolver.for(actx)
  } catch (error) {
    return api
  }
  if (target === null || target === undefined || typeof target.insertReference !== 'function') return api
  api.insertReference = (reference, span) => {
    try {
      return target.insertReference(reference, span) === true
```

</details>

**依据 2 · 源码核查**：[src/client.js:2520-2542](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2520-L2542)

整份写与引用拍照。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Write the whole draft through the composer's own action face.
   *
   * `setDraft` rebuilds the editor document out of plain-text lines and does no
   * `@` parsing, so **every reference chip in the draft is destroyed by this
   * write**. That is invisible in the textarea — the clipboard projection reads
   * the same before and after — but it is real loss for the host: `occurrences`
   * empties and the composer stops treating those paths as references. So
   * photograph the chips first, and let the effect below put them back.
   */
  const writeDraft = React.useCallback(
    (next) => {
      if (!writable) return
      if (occurrences.length > 0) {
        pendingRestoreRef.current = { occurrences: occurrences.slice() }
      }
      try {
        inputActions.setDraft(next)
      } catch (error) {
        console.warn('fullscreen-input: setDraft refused the write', error)
      }
    },
    [inputActions, writable, occurrences],
```

</details>

**依据 3 · 源码核查**：[src/client.js:2618-2672](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2618-L2672)

逐修订恢复和失败放弃。

<details>
<summary>查看原文（55行）</summary>

```text
   * `insertReference` is revision-guarded — the span carries the `draftRev` it
   * was planned against — so each insertion invalidates the span of the next.
   * Rather than guess how the host advances that counter, this inserts a single
   * chip per pass and lets the next revision re-enter the effect.
   *
   * **The span is in the host's *detect* coordinates, not the clipboard ones the
   * plan is built in.** A chip is one character (`U+FFFC`) in the detect
   * projection but its whole `@path` in the clipboard projection
   * (`$composerLayout` pushes exactly that pair), so every chip already put back
   * has shortened detect space by `length - 1` relative to the offsets the plan
   * holds. Carrying that drift is not an optimisation: without it the second
   * insertion aims past its text, `selectSpan` refuses the range, and the pass
   * ends — the first reference comes back and every later one stays plain text.
   */
  React.useEffect(() => {
    const pending = pendingRestoreRef.current
    if (pending === null) return
    if (typeof insertReference !== 'function') {
      pendingRestoreRef.current = null
      return
    }
    if (pending.plan === undefined) {
      pending.plan = planReferenceRebuild(draft, pending.occurrences)
      pending.index = 0
      pending.drift = 0
    }
    if (pending.index >= pending.plan.length) {
      pendingRestoreRef.current = null
      return
    }
    const step = pending.plan[pending.index]
    let applied = false
    try {
      applied = insertReference(step.insert, {
        start: step.start - pending.drift,
        end: step.end - pending.drift,
        draftRev,
      }) === true
    } catch (error) {
      applied = false
    }
    if (!applied) {
      pendingRestoreRef.current = null
      return
    }
    // The host also appends a separating space when the span is not already
    // followed by one, which lengthens the clipboard projection instead — so it
    // cancels one unit of drift the other way. Read from the plan's own draft,
    // which is the text the host saw when it made that decision.
    const tail = draft.charAt(step.end)
    const chip = step.insert.clipboardText
    pending.drift += (chip.length - 1) - (tail === ' ' ? 0 : 1)
    pending.index += 1
    if (pending.index >= pending.plan.length) pendingRestoreRef.current = null
  }, [draft, draftRev, insertReference])
```

</details>

**依据 4 · 源码核查**：[src/client.js:3047-3057](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L3047-L3057)

slot会话注入。

<details>
<summary>查看原文（11行）</summary>

```text
    slots.inject('conversation.input.left', () =>
      slots.register({
        name: 'conversation.input.left',
        id: DOCK_ID,
        order: DOCK_ORDER,
        locale: NS,
        // Session-scoped props. This callback is the supported way for a slot
        // component to reach its session's service scope, and it is how the
        // panel gets the one verb `inputActions` does not carry.
        inject: (sessionId) => sessionApiFor(conversation, sessions, sessionId),
      }, FullscreenInputDock),
```

</details>

**依据 5 · 源码核查**：[package.json:45-64](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/package.json#L45-L64)

版本和客户端声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": ">=0.2.0-rc.1 <0.3.0-0"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-slots"
      ]
    }
```

</details>

**依据 6 · 源码核查**：[build-client.mjs:1-20](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/build-client.mjs#L1-L20)

构建包装契约。

<details>
<summary>查看原文（20行）</summary>

```text
/**
 * Rebuild lib/client.js from src/client.js.
 *
 * The browser artifact is the source wrapped in the shell's module-loader call.
 * Keeping the build here — rather than in a bundler — is deliberate: this half
 * imports nothing at build time (React arrives through the factory's `require`,
 * and the optional primitives lookup is guarded at runtime), so there is nothing
 * to resolve and nothing to tree-shake. The wrapper is the whole build.
 *
 *   node build-client.mjs
 *
 * The emitted shape is the one the shell's dynamic module table expects: the
 * factory body is source that assigns `module.exports`, and the wrapper returns
 * it. This is the same contract the shipped client bundles use.
 *
 *   window.__ModuleLoader__.load({ id: "<package name>", factory: (require) => {
 *   var module = { exports: {} }; var exports = module.exports;
 *   <src/client.js verbatim>
 *   return module.exports; } });
 */
```

</details>

#### 缺口

- 宿主对应版本insertReference坐标、同步返回值与draftRev更新时序
  **影响**：普通文本一致不能证明多引用与并发编辑时语义完整
  **进一步探讨**：按宿主契约核对多引用、快速输入/切会话与缺API降级

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发送和文件选择有哪些具体边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

keydown先检查native isComposing/keyCode229，再只允许Ctrl/Cmd+Enter且无Shift/Alt，不处理普通Enter，repeat拦截减少长按重复发送；但其IME判断依赖浏览器事件，组合结束后已清标的Enter不一定可由该分支识别，不能给绝对不误发结论。send检查blocked/busy/empty后调用submit，不等待返回promise就关面板，catch仅捕获同步throw；异步拒绝需宿主负责状态与提示，面板关闭不是发送成功收据。

引用恢复失败或缺API会清pending，无显式降级提示；多芯片恢复逐render，与新的整份写相交需核对。添加文件不走稳定插件API，而查询document中第一个可用input[type=file][multiple]，多面板/其他插件文件控件时可能选错目标，DOM顺序变化也会失效。它复用宿主上传/引用语义，无自建上传后端，但不能声称完全不依赖宿主DOM。面板开时Ctrl/Cmd+0全document拦截，会覆盖浏览器/宿主原重置快捷键，是明确交互取舍。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:2720-2768](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2720-L2768)

submit和键位分支。

<details>
<summary>查看原文（49行）</summary>

```text
   * `inputActions.submit()` is the composer's shell action
   * (`shell.actions.submit` -> `shell.submit("queue")`), i.e. the same path the
   * shipped Send button uses. Nothing is assembled here and no lower layer is
   * touched, so queueing, steering, attachments and references keep their
   * meaning. The panel closes after the attempt; the text is not cleared by the
   * close, it is cleared by the submit itself.
   */
  const send = React.useCallback(() => {
    if (!sendable || blocked || busy || empty) return
    try {
      inputActions.submit()
    } catch (error) {
      console.warn('fullscreen-input: submit threw', error)
      return
    }
    setOpen(false)
  }, [inputActions, sendable, blocked, busy, empty])

  /**
   * The panel's only key handling, and the only keyboard route to `send`.
   *
   * The accelerator is the EXACT chord Ctrl+Enter (Cmd+Enter on macOS) and
   * nothing else:
   *
   *   - Plain Enter and Shift+Enter fall through to the textarea's native
   *     newline, so Shift keeps meaning "newline" everywhere in the panel and
   *     Ctrl+Shift+Enter cannot become a send by accident.
   *   - Alt/AltGraph combinations are left alone (AltGraph is how many layouts
   *     compose characters).
   *   - The composition guard runs FIRST and returns before the chord test, so
   *     an IME-confirming Enter can never reach the submit path even with Ctrl
   *     held. That ordering is the entire safety argument for shipping a
   *     keyboard route at all.
   */
  const onKeyDown = React.useCallback(
    (event) => {
      if (event.key !== 'Enter') return
      const native = event.nativeEvent
      const composing = native !== undefined && native !== null
        && (native.isComposing === true || native.keyCode === 229)
      if (composing) return
      const cmdOrCtrl = event.ctrlKey === true || event.metaKey === true
      if (!cmdOrCtrl) return
      if (event.shiftKey === true || event.altKey === true) return
      event.preventDefault()
      if (event.repeat === true) return
      send()
    },
    [send],
```

</details>

**依据 2 · 源码核查**：[src/client.js:2632-2661](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2632-L2661)

恢复放弃路径。

<details>
<summary>查看原文（30行）</summary>

```text
  React.useEffect(() => {
    const pending = pendingRestoreRef.current
    if (pending === null) return
    if (typeof insertReference !== 'function') {
      pendingRestoreRef.current = null
      return
    }
    if (pending.plan === undefined) {
      pending.plan = planReferenceRebuild(draft, pending.occurrences)
      pending.index = 0
      pending.drift = 0
    }
    if (pending.index >= pending.plan.length) {
      pendingRestoreRef.current = null
      return
    }
    const step = pending.plan[pending.index]
    let applied = false
    try {
      applied = insertReference(step.insert, {
        start: step.start - pending.drift,
        end: step.end - pending.drift,
        draftRev,
      }) === true
    } catch (error) {
      applied = false
    }
    if (!applied) {
      pendingRestoreRef.current = null
      return
```

</details>

**依据 3 · 源码核查**：[src/client.js:1835-1858](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L1835-L1858)

全document文件input。

<details>
<summary>查看原文（24行）</summary>

```text
function findHostFilePicker() {
  try {
    const candidates = document.querySelectorAll('input[type="file"][multiple]')
    for (const node of candidates) {
      if (node.disabled === true) continue
      return node
    }
  } catch (error) {
    // Fall through to null.
  }
  return null
}

/**
 * Open the host's own file dialog.
 *
 * There is no plugin-facing API for this. `pickFiles` lives on an input hub that
 * the slot props never expose, and the command menu entry that reaches it would
 * open *behind* this full-screen panel anyway — so driving the menu would mean
 * clicking an invisible item and hoping.
 *
 * What the host ultimately does is simpler than that: its own "+" flow ends in
 * `fileInputRef.current.click()` on a hidden `<input type="file" multiple>` it
 * renders right beside the add button. Clicking that element runs exactly the
```

</details>

**依据 4 · 源码核查**：[src/client.js:2483-2487](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2483-L2487)

全局reset拦截。

```text
      if ((event.ctrlKey || event.metaKey) && !event.altKey && event.key === '0') {
        event.preventDefault()
        event.stopPropagation()
        resetPlacement()
        return
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程实现与三阶段成本是什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

host apply空函数，所有功能在浏览器，不新增服务器/模型请求；样式/语言注册与键监听大多有effect清理，引用重建专门处理坐标和revision，比裸setDraft更细致。package check仅node --check源和产物语法，不是输入法、焦点、富文本/附件语义测试；仓库未见自动交互测试。本次只读代码/构建脚本，没有运行。

首次需要匹配宿主版本并学F2/Esc/CtrlEnter，外观、尺寸/位置存localStorage而不另存正文；存储拒绝时偏好只留当前运行。持续每次编辑整份草稿可能触发引用重建，长文本/多引用的延迟未知，没有LLM费用由插件新增，但发送仍按宿主模型计费。恢复时先关闭面板查看主草稿和引用/附件是否仍在，再核宿主发送状态；本插件没有独立草稿备份，重要长文不应只依赖视图未丢失。偏好跨tab无storage事件合并，多个标签设置可能互相覆盖。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1-8](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/lib/index.js#L1-L8)

纯客户端。

```text
/**
 * dsh-fullscreen-input — host half.
 *
 * The whole feature lives in the browser: it reads and writes the composer's own
 * draft through the client plugin API. The host half exists because a bundle has
 * to mount a row, not because there is anything for Node to do.
 */
export function apply() {}
```

**依据 2 · 源码核查**：[src/client.js:709-768](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L709-L768)

偏好存储。

<details>
<summary>查看原文（60行）</summary>

```text
function readSettings() {
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY)
    if (raw === null) return { ...DEFAULT_SETTINGS }
    const parsed = JSON.parse(raw)
    if (parsed === null || typeof parsed !== 'object') return { ...DEFAULT_SETTINGS }
    return {
      glass: parsed.glass === true,
      solid: parsed.solid === true,
      mask: parsed.mask !== false,
      maskOpacity: clampNumber(parsed.maskOpacity, 0, 100, DEFAULT_SETTINGS.maskOpacity),
      maskFog: clampNumber(parsed.maskFog, 0, 100, DEFAULT_SETTINGS.maskFog),
      glassOpacity: clampNumber(parsed.glassOpacity, 0, 100, DEFAULT_SETTINGS.glassOpacity),
      solidOpacity: clampNumber(parsed.solidOpacity, 0, 100, DEFAULT_SETTINGS.solidOpacity),
      // Accept any literal colour, not just the presets: the custom picker
      // produces arbitrary `#rrggbb` values, and validating against
      // `GLASS_COLORS` alone would silently discard them on the next read.
      glassColor: parsed.glassColor === 'theme' || isGlassLiteral(parsed.glassColor)
        ? parsed.glassColor
        : DEFAULT_SETTINGS.glassColor,
      glassFog: clampNumber(parsed.glassFog, 0, 100, DEFAULT_SETTINGS.glassFog),
      panelWidth: clampNumber(parsed.panelWidth, 0, MAX_PANEL_SIDE, 0),
      panelHeight: clampNumber(parsed.panelHeight, 0, MAX_PANEL_SIDE, 0),
      rememberSize: parsed.rememberSize !== false,
      rememberPosition: parsed.rememberPosition === true,
      panelOffsetX: clampNumber(parsed.panelOffsetX, -MAX_PANEL_SIDE, MAX_PANEL_SIDE, 0),
      panelOffsetY: clampNumber(parsed.panelOffsetY, -MAX_PANEL_SIDE, MAX_PANEL_SIDE, 0),
      hotkey: isUsableHotkeyName(parsed.hotkey) ? parsed.hotkey : DEFAULT_SETTINGS.hotkey,
      hintMuted: parsed.hintMuted === true,
    }
  } catch (error) {
    return { ...DEFAULT_SETTINGS }
  }
}

/** Current settings, kept as one immutable object so React can compare identity. */
let currentSettings = readSettings()
const settingsListeners = new Set()

function getSettings() {
  return currentSettings
}

/** Subscribe to settings changes; returns the unsubscribe. */
function subscribeSettings(listener) {
  settingsListeners.add(listener)
  return () => {
    settingsListeners.delete(listener)
  }
}

/** Merge a patch, publish it, and persist it (a refused write is non-fatal). */
function writeSettings(patch) {
  currentSettings = { ...currentSettings, ...patch }
  for (const listener of [...settingsListeners]) listener()
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(currentSettings))
  } catch (error) {
    /* the choice simply does not survive a reload */
  }
```

</details>

**依据 3 · 源码核查**：[src/client.js:2508-2511](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2508-L2511)

键监听释放。

```text
    document.addEventListener('keydown', onKeyDownCapture, true)
    return () => {
      document.removeEventListener('keydown', onKeyDownCapture, true)
    }
```

**依据 4 · 源码核查**：[src/client.js:3019-3044](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L3019-L3044)

样式/语言释放。

<details>
<summary>查看原文（26行）</summary>

```text
function contribute(ctx) {
  const removeSheet = installSheet()
  if (removeSheet !== null) {
    // No "already installed" flag is kept: `installSheet` decides that itself by
    // looking for the tag, so a flag here would be written and never read.
    ctx.effect(() => removeSheet, 'dsh-fullscreen-input: panel sheet teardown')
  }

  const register = (slots, locale, sessions, conversation) => {
    if (slots === undefined || slots === null || typeof slots.inject !== 'function') {
      console.warn('fullscreen-input: the slots service is unavailable; no toolbar button was added')
      return
    }
    if (locale !== undefined && locale !== null && typeof locale.register === 'function') {
      // The single-locale form is the one for a namespace outside the merge
      // table: the built-in ids are exactly 'zh' and 'en'.
      ctx.effect(
        () => {
          const offZh = locale.register(NS, 'zh', DICT.zh)
          const offEn = locale.register(NS, 'en', DICT.en)
          return () => {
            offEn()
            offZh()
          }
        },
        'dsh-fullscreen-input: locale dictionaries',
```

</details>

**依据 5 · 源码核查**：[package.json:66-69](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/package.json#L66-L69)

语法检查。

```text
  "scripts": {
    "build": "node build-client.mjs",
    "check": "node --check lib/client.js && node --check lib/index.js && node --check src/client.js"
  }
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用建议和继续探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

长文本编辑场景可试用，先用无敏感短草稿核对主框同步、多引用与附件，然后扩展日常使用；针对固定DSH版本，不把纯文本显示等同富文本完整。若引用变文本、选文件落错会话或面板关了但发送失败，回宿主输入框核实际草稿/状态。需要可靠离线草稿归档、多窗并发编辑或严格发送回执时，当前插件不能独自承担。

进一步可研究宿主提供语义保留的原子草稿编辑/文件选择API、基于修订号的事务更新和异步submit完成回执；缺引用恢复API时明确提示并阻止无声语义降级。基线为当前全量setDraft后逐引用恢复/首DOM文件输入，反例包括多同名引用、快速连打、恢复中切会话、多file input、async拒绝和不同IME组合尾键。比较误发、引用丢失、错目标、编辑延迟与恢复工时，当前未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.js:2520-2542](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2520-L2542)

编辑基线。

<details>
<summary>查看原文（23行）</summary>

```text
  /**
   * Write the whole draft through the composer's own action face.
   *
   * `setDraft` rebuilds the editor document out of plain-text lines and does no
   * `@` parsing, so **every reference chip in the draft is destroyed by this
   * write**. That is invisible in the textarea — the clipboard projection reads
   * the same before and after — but it is real loss for the host: `occurrences`
   * empties and the composer stops treating those paths as references. So
   * photograph the chips first, and let the effect below put them back.
   */
  const writeDraft = React.useCallback(
    (next) => {
      if (!writable) return
      if (occurrences.length > 0) {
        pendingRestoreRef.current = { occurrences: occurrences.slice() }
      }
      try {
        inputActions.setDraft(next)
      } catch (error) {
        console.warn('fullscreen-input: setDraft refused the write', error)
      }
    },
    [inputActions, writable, occurrences],
```

</details>

**依据 2 · 源码核查**：[src/client.js:2632-2672](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2632-L2672)

恢复基线。

<details>
<summary>查看原文（41行）</summary>

```text
  React.useEffect(() => {
    const pending = pendingRestoreRef.current
    if (pending === null) return
    if (typeof insertReference !== 'function') {
      pendingRestoreRef.current = null
      return
    }
    if (pending.plan === undefined) {
      pending.plan = planReferenceRebuild(draft, pending.occurrences)
      pending.index = 0
      pending.drift = 0
    }
    if (pending.index >= pending.plan.length) {
      pendingRestoreRef.current = null
      return
    }
    const step = pending.plan[pending.index]
    let applied = false
    try {
      applied = insertReference(step.insert, {
        start: step.start - pending.drift,
        end: step.end - pending.drift,
        draftRev,
      }) === true
    } catch (error) {
      applied = false
    }
    if (!applied) {
      pendingRestoreRef.current = null
      return
    }
    // The host also appends a separating space when the span is not already
    // followed by one, which lengthens the clipboard projection instead — so it
    // cancels one unit of drift the other way. Read from the plan's own draft,
    // which is the text the host saw when it made that decision.
    const tail = draft.charAt(step.end)
    const chip = step.insert.clipboardText
    pending.drift += (chip.length - 1) - (tail === ' ' ? 0 : 1)
    pending.index += 1
    if (pending.index >= pending.plan.length) pendingRestoreRef.current = null
  }, [draft, draftRev, insertReference])
```

</details>

**依据 3 · 源码核查**：[src/client.js:2727-2736](https://github.com/AL-Yichen/dsh-fullscreen-input/blob/0e211595f4f07289ba3b713b67d47b90498fa082/src/client.js#L2727-L2736)

发送回执。

<details>
<summary>查看原文（10行）</summary>

```text
  const send = React.useCallback(() => {
    if (!sendable || blocked || busy || empty) return
    try {
      inputActions.submit()
    } catch (error) {
      console.warn('fullscreen-input: submit threw', error)
      return
    }
    setOpen(false)
  }, [inputActions, sendable, blocked, busy, empty])
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
