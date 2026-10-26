# @luziyang2026/dsh-question-nav

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[29e7e48](https://github.com/AbelKeithsun/dsh-question-nav/tree/29e7e487235bdbcba13768f1a009ecd2089d6faa)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=yellow&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav) [![npm 30d 1,224](https://img.shields.io/static/v1?label=npm+30d&message=1%2C224&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@luziyang2026/dsh-question-nav)
<!-- END META -->

> **实现功能**：在DSH会话侧边以圆点和悬停卡片索引用户提问，点击按需加载历史并跳转到对应轮次。

> **核心亮点**：将完整问题投影与轻量条带、按需历史加载联结，减少长会话手工翻找。详见[Q01](#research-q01)。

> **风险与缺陷**：只索引首内容块，异步分页没有取消/强制截止，所谓nearest回退实际取最早行，跨会话点击可能陈旧滚动。详见[Q03](#research-q03)。

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
  - [Q01 · 长对话导航提供什么便利？](#detail-section-11)
  - [Q02 · 索引、界面与分页怎样接线？](#detail-section-12)
  - [Q03 · 哪些文字与跳转边界会影响使用？](#detail-section-13)
  - [Q04 · 工程结构和成本有什么证据？](#detail-section-14)
  - [Q05 · 采用条件和进一步探讨入口是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web长会话用户需要回看早先问题和时间。详见[Q01](#research-q01)。

浏览器查找、手动滚动和宿主时间线是替代，插件提供问题导向入口但不保证所有SDK与多块消息完整。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 问题投影 | 跨窗口索引 | 首文本块与宿主持久化 |
| 圆点/卡片 | 轮次和时间预览 | 同屏隐私及SDK耦合 |
| 点击分页定位 | 找旧上下文 | 多任务/隐藏目标有边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| 对应stable SDK与React | snapshot/slots | alpha API不同 |
| sessionProjections可选 | 全历史索引 | 缺失只live窗口 |
| settingsScope可选 | 位置/页大小 | 缺失默认偏好 |
| DOM anchor/GUI | 滚动目标 | 结构变化无法定位 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 选择匹配SDK包 | 用户 | stable/alpha对齐 |
| 重启并设置位置 | 用户 | 条带不遮挡 |
| 悬停再点击旧问题 | 用户 | 文字/轮次与目标相符 |
| 异常回手工导航 | 用户 | 原会话保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配SDK/预构建包 | 安装重启、条带偏好 | 需SDK/预构建匹配；安装与偏好准备工时未知 |
| 持续使用 | 全问题投影/React刷新 | 定位节时未知，文字隐私需留意 | 无独立API/key；全索引复制/分组随问题数增长，延迟未知 |
| 失败恢复 | 刷新/停用/版本回退 | 手工回看与宿主投影清理 | 旧跳转可重复分页；手工回看/投影清理工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 提问索引 | 全事件投影与live合并 | 只取首块文字 |
| 少预展开 | 点击才loadOlder | 无强制取消/截止 |
| 轻量回看 | 点/时间/悬停卡片 | 误跳和SDK需核对 |

> **思考**：只索引首内容块，异步分页没有取消/强制截止，所谓nearest回退实际取最早行，跨会话点击可能陈旧滚动。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将完整问题投影与轻量条带、按需历史加载联结，减少长会话手工翻找。详见[Q01](#research-q01)。

将完整问题投影与轻量条带、按需历史加载联结，减少长会话手工翻找。详见[Q01](#research-q01)。

纯core与端口便于审阅，订阅/observer多有清理；测试分页名义不等真实分页覆盖，导航任务需会话代次。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

只索引首内容块，异步分页没有取消/强制截止，所谓nearest回退实际取最早行，跨会话点击可能陈旧滚动。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

个人匹配SDK长会话试用；单文本之外不保证完整卡片，重要上下文保留手工回看，切会话避免连点旧任务。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

投影/分组/按需跳转源码可查；首块文字、跨会话任务与SDK API存在限制，可取消导航为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/projection.ts、src/client/index.ts、src/client/QuestionNavStrip.tsx、src/client/settings.ts、src/settings.ts、src/core/turn-dots.ts、src/core/nodes.ts、src/core/jump.ts、tests/jump.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定宿主/浏览器入口、投影、分组、跳转、节点逻辑、设置控制器和界面关键生命周期及jump测试；不运行插件。
- 下一步：进一步从双点、切会话、挂起loadOlder、隐藏目标和多内容块探讨误跳与真实回退。

**分析版本**

- **仓库**：[AbelKeithsun/dsh-question-nav](https://github.com/AbelKeithsun/dsh-question-nav)
- **版本号**：0.7.8（[固定提交 29e7e48](https://github.com/AbelKeithsun/dsh-question-nav/tree/29e7e487235bdbcba13768f1a009ecd2089d6faa)）
- **版本日期**：2026-09-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究带会话/代次的取消导航和多块文字索引，以切会话、双点击和挂起反例比较误跳与延迟。当前未验证。详见[Q05](#research-q05)。

进一步从双点、切会话、挂起loadOlder、隐藏目标和多内容块探讨误跳与真实回退。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 431 | — | — | 4321 |
| .ts | source | 19 | 1552 | 910 | 517 | — |
| .tsx | source | 2 | 782 | 563 | 180 | — |
| .ts | test | 8 | 751 | 625 | 39 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav/issues?q=is%3Aissue+created%3A2026-09-22T05%3A29%3A53.287Z..2026-10-22T05%3A29%3A53.287Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AbelKeithsun/dsh-question-nav/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A29%3A53.287Z..2026-10-22T05%3A29%3A53.287Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本问题投影和按需导航如何帮助长会话回看，文字、SDK及跳转生命周期有何边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长对话导航提供什么便利？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向在DSH Web长会话内反复回看自己提问的用户。合格交互是按含用户消息的turn呈现圆点，悬停看到文字/时间，点击抵达对应问题，不能把点数等同所有执行turn数，也不是语义识别“疑问句”。简单替代是浏览器查找、手动滚动或宿主已有时间线。

贡献是宿主完整事件投影建立问题索引、客户端轻量缩略图与按需加载历史的配合，避免为了画导航先展开全部聊天窗口。它没有新的搜索或语义索引算法，价值是减少跨历史定位步骤；节省定位时间尚无对照。一次turn有多个用户消息会合为一点、跳向第一条，hover卡片同时列出各文字，不能理解一条消息一个点。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:39-62](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/README.md#L39-L62)

完整投影和按需跳转的作者说明。

<details>
<summary>查看原文（24行）</summary>

```text
- **One dot = one turn that asked a question** (strictly aligned with the
  Trajectory view's turn numbering), with a small count above the dot column.
- **Full history, persisted, no render-window expansion**: the plugin's host
  half registers a `questionIndex` session projection — the projection
  registry folds the whole event log (read-only, the chat's paged window is
  never touched), the official projection cache persists it across restarts,
  and push frames deliver new questions live.
- **Hover (focus)**: the dot and its **two neighbors on each side** magnify
  progressively (selected largest), the rail scrolls the selection into view
  only when clipped by the band's edges, and a
  **vertical cascade of five crisp question cards** (portal-rendered, no
  native-title delay) appears beside the rail — one card per window dot,
  stacked top-to-bottom without overlap and centered on the selected dot. Each
  card shows the turn's **full question text** (all of them, when one turn
  batched several) and the question's **sent time** (`HH:MM` on the same day,
  `MM-DD HH:MM` across days, `YYYY-MM-DD HH:MM` across years). The hierarchy
  is two-tier: the **center card is the focus** — full-contrast text, a brand
  accent bar and a raised shadow — while the four neighbors are clean
  **context cards** (same surface, narrower, fewer lines) that light up on
  hover to show they are clickable too. **Clicking any card jumps to that
  question** exactly like clicking its dot.
- **Click**: jumps to that question. Only then does the jump loop page the
  window (`loadOlder()`) to bring that specific page into view — never the
  whole history up front.
```

</details>

**依据 2 · 源码核查**：[src/core/turn-dots.ts:59-82](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/turn-dots.ts#L59-L82)

同turn合并且首问为key。

<details>
<summary>查看原文（24行）</summary>

```text
export function groupQuestionsByTurn(entries: readonly QuestionEntry[]): TurnDot[] {
  const sorted = isSortedBySeq(entries) ? entries : [...entries].sort((a, b) => a.seq - b.seq)
  const dots: TurnDot[] = []
  for (const entry of sorted) {
    const key = questionKey(entry.id)
    const last = dots.at(-1)
    if (last !== undefined && last.turn === entry.turn) {
      dots[dots.length - 1] = {
        ...last,
        texts: [...last.texts, entry.text],
        memberKeys: [...last.memberKeys, key],
      }
      continue
    }
    dots.push({
      turn: entry.turn,
      key,
      anchorSeq: entry.seq,
      time: entry.time,
      texts: [entry.text],
      memberKeys: [key],
    })
  }
  return dots
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 索引、界面与分页怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

宿主通过可选sessionProjections注册questionIndex、settings注册question-nav命名空间。投影按turn/start更新时间，只取append且source.kind=user的user/message，保存id/seq/time/首内容块文字；持久化、重放和推送由宿主projection seam承担，不是插件自建数据库。客户端通过shell.overlay挂条带，合并投影和当前窗口消息，已有投影key优先，临时新问补点，订阅在切会话时清理。

点击把捕获的sessionId接到snapshot/loadOlder，但DOM查找是document全局data-chat-anchor-key。跳转先向前翻历史，默认100页/15秒预算，找到窗口后再等DOM8秒；缺投影只显示live窗口，索引不是全历史保证。版本需按SDK线选择，固定版0.7.8客户端读snap.chat.nodes，README明确该stable API在alpha移除，不能安装后默认跨所有DSH版本。Node实际manifest比README>=20更严格为^22.19或>=24，源码构建需依赖/编译，Git树不含lib不能据此断言npm包缺入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:25-31](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/index.ts#L25-L31)

两可选注册。

```text
export function apply(ctx: Context): void {
  ctx.inject(['sessionProjections'], (inner) => {
    inner.sessionProjections.register(questionIndexProjectionDefinition)
  })
  ctx.inject(['settings'], (settingsCtx) => {
    settingsCtx.settings.register(questionNavSettingsNamespace, QuestionNavSettingsSchema)
  })
```

**依据 2 · 源码核查**：[src/projection.ts:72-96](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/projection.ts#L72-L96)

事件过滤和wire view。

<details>
<summary>查看原文（25行）</summary>

```text
  apply: (state, event) => {
    // Every uninteresting event returns the same reference (Object.is gates
    // the change feed and the persisted-cache dirty check).
    switch (event.type) {
      case 'turn/start':
        return event.data.turn === state.turn ? state : { ...state, turn: event.data.turn }
      case 'user/message': {
        if (event.surfaceOp !== 'append') return state
        if (event.data.source?.kind !== 'user') return state
        const entry: QuestionEntry = {
          turn: state.turn,
          id: String(event.data.id),
          seq: event.seq,
          time: event.time,
          text: messageText(event.data.content),
        }
        return { ...state, questions: [...state.questions, entry] }
      }
      default:
        return state
    }
  },
  wire: {
    viewSchema: questionIndexViewSchema,
    view: state => state.questions,
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:67-94](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/index.ts#L67-L94)

session端口与全局DOM。

<details>
<summary>查看原文（28行）</summary>

```text
function jumpPortsFor(ctx: ClientContext, sessionId: SessionId): JumpPorts {
  return {
    snapshot: () => {
      const binding = ctx.sessions.binding(sessionId)
      const snap = binding?.session.getSnapshot()
      if (snap === undefined) return undefined
      return {
        openState: snap.openState,
        hasMore: snap.hasMore,
        loadingOlder: snap.loadingOlder,
        rows: snap.chat.nodes.values(),
      }
    },
    loadOlder: async () => {
      const binding = ctx.sessions.binding(sessionId)
      if (binding === undefined) throw new Error('session unavailable')
      await binding.session.loadOlder()
    },
    isViewActive: () => document.querySelector('[data-chat-flow]') !== null,
    findRow: (key: string) => {
      for (const candidate of Array.from(document.querySelectorAll<HTMLElement>('[data-chat-anchor-key]'))) {
        if (candidate.dataset.chatAnchorKey === key) return candidate
      }
      return null
    },
    scrollIntoView: (row) => row.scrollIntoView({ block: 'start' }),
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
```

</details>

**依据 4 · 源码核查**：[src/client/QuestionNavStrip.tsx:277-298](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/QuestionNavStrip.tsx#L277-L298)

合并及取消订阅。

<details>
<summary>查看原文（22行）</summary>

```text
    const sessionId = current
    const face = props.questionProjection(sessionId)
    const refresh = (): void => {
      const grouped = groupQuestionsByTurn(projectionEntries(face))
      const next = mergeLiveQuestions(grouped, props.readQuestions(sessionId))
      // Identical content (a streaming update that added no question): re-use
      // the previous array reference so React bails out of re-rendering the
      // strip — the common case during assistant streaming.
      if (sameDots(next, lastDotsRef.current)) {
        setDots(lastDotsRef.current)
        return
      }
      lastDotsRef.current = next
      setDots(next)
    }
    refresh()
    const unsubProjection = face?.subscribe(refresh) ?? (() => {})
    const unsubContent = props.subscribeContent(sessionId, refresh)
    return () => {
      unsubProjection()
      unsubContent()
    }
```

</details>

**依据 5 · 作者声明**：[README.md:85-97](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/README.md#L85-L97)

stable和alpha快照差异。

<details>
<summary>查看原文（13行）</summary>

```text
| npm dist-tag | Version | Targets the DSH | Status |
|---|---|---|---|
| `latest` | `0.7.x` | `0.1.1-rc.1` SDK line | **Stable** — recommended for everyday use |
| `alpha` | `0.8.0-alpha.x` | `0.1.2-alpha.2` SDK line | **Alpha** — for the Alpha GUI build |

- **Most users install the `latest` (stable) line** — it tracks the stable DSH
  release and is safe for daily use.
- **Running the DSH Alpha GUI (`0.1.2-alpha.2`)?** Install the `alpha`
  dist-tag instead. The stable build reads a chat snapshot API
  (`session.getSnapshot().chat`) that was **removed** in the Alpha SDK; the
  `alpha` build reads the live chat through the new conversation service
  instead. Installing the stable line on an Alpha GUI would leave the strip
  degraded (projection-only dots).
```

</details>

**依据 6 · 源码核查**：[package.json:7-11](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/package.json#L7-L11)

实际Node范围和lib入口。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些文字与跳转边界会影响使用？

**研究主题**：缺陷与关键质疑

#### 完整回答

投影与live messageText都只读取content[0].text，所以多文本块余下内容、首块是图片而后面有文字时，不能显示完整用户消息；README full text只适用于单首文本块。投影把完整首块文本复制为宿主持久索引，含敏感提问的悬停卡片也会暴露给同屏查看者；这是本地会话数据的额外派生视图，没有证据表明向第三方传输，不要夸大成外泄。

跳转预算在await loadOlder前检查，单次loadOlder无超时race，若该promise挂起15秒不是强制上限。查找只筛renderable行，hidden target可能在第一阶段就NOT_FOUND；第二阶段fallback名为nearest但实现选择最小anchorSeq，不能叫距离目标最近。客户端void调用没catch，多次点击没有取消或互斥；切换会话时旧分页任务仍可能运行，DOM liveness仅检查任一chat-flow，存在陈旧滚动/错误提示条件。它会读历史并滚动，不能承诺每点准确或失败时无视觉扰动。

#### 证据与依据

**依据 1 · 源码核查**：[src/projection.ts:57-61](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/projection.ts#L57-L61)

只取第一块。

```text
/** First text block of a user message; empty string when absent. */
function messageText(content: readonly { type?: string; text?: string }[] | undefined): string {
  if (content === undefined || content.length === 0) return ''
  const first = content[0]
  return typeof first?.text === 'string' ? first.text : ''
```

**依据 2 · 源码核查**：[src/core/nodes.ts:46-51](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/nodes.ts#L46-L51)

live同样首块。

```text
/** First text block of a user message; falls back to the raw first block. */
export function messageText(content: readonly { type?: string; text?: string }[] | undefined): string {
  if (content === undefined || content.length === 0) return ''
  const first = content[0]
  if (typeof first?.text === 'string') return first.text
  return ''
```

**依据 3 · 源码核查**：[src/core/jump.ts:99-123](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/jump.ts#L99-L123)

预算检查与await loadOlder。

<details>
<summary>查看原文（25行）</summary>

```text
  // Phase 1: page older until the key appears in the loaded window.
  while (true) {
    const snap = ports.snapshot()
    if (snap === undefined) return fail('VIEW_INACTIVE')
    const rows = renderable(snap.rows)
    if (rows.some((r) => r.key === key)) break
    if (snap.openState !== 'open') {
      if (snap.openState === 'error' || ports.now() > deadline) {
        return fail(snap.openState === 'error' ? 'VIEW_INACTIVE' : 'TIMEOUT')
      }
      await ports.sleep(cfg.pollMs)
      continue
    }
    if (snap.hasMore !== true) return fail('NOT_FOUND')
    if (pages >= cfg.maxPages || ports.now() > deadline) return fail('TIMEOUT')
    if (snap.loadingOlder) {
      await ports.sleep(cfg.pollMs)
      continue
    }
    const before = minAnchorSeq(rows)
    await ports.loadOlder()
    pages += 1
    const afterSnap = ports.snapshot()
    const after = minAnchorSeq(afterSnap === undefined ? [] : afterSnap.rows)
    if (after === null || (before !== null && after >= before)) return fail('NOT_FOUND')
```

</details>

**依据 4 · 源码核查**：[src/core/jump.ts:137-152](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/jump.ts#L137-L152)

第二阶段fallback。

<details>
<summary>查看原文（16行）</summary>

```text
  const row = await waitedFor(key)
  if (row !== null) {
    ports.scrollIntoView(row)
    return { ok: true }
  }

  const snap = ports.snapshot()
  const fallback = nearestRenderable(snap === undefined ? [] : snap.rows, key)
  if (fallback !== null) {
    const fbRow = await waitedFor(fallback.key)
    if (fbRow !== null) {
      ports.scrollIntoView(fbRow)
      return fail('TARGET_HIDDEN', true)
    }
  }
  return fail('TARGET_HIDDEN', false)
```

</details>

**依据 5 · 源码核查**：[src/core/nodes.ts:86-97](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/nodes.ts#L86-L97)

所谓nearest实际最早序号。

<details>
<summary>查看原文（12行）</summary>

```text
/** Nearest renderable row for a key that is absent or hidden (compaction, windowing). */
export function nearestRenderable(
  nodes: Iterable<{ key: string; anchorSeq: number; visibility?: string }>,
  excludeKey: string | undefined,
): { key: string; anchorSeq: number } | null {
  let best: { key: string; anchorSeq: number } | null = null
  for (const node of nodes) {
    if (node.visibility === 'hidden') continue
    if (node.key === excludeKey) continue
    if (best === null || node.anchorSeq < best.anchorSeq) best = { key: node.key, anchorSeq: node.anchorSeq }
  }
  return best
```

</details>

**依据 6 · 源码核查**：[src/client/index.ts:125-133](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/index.ts#L125-L133)

void跳转无并发取消。

```text
    questionProjection: (sessionId) => questionProjectionOf(ctx, sessionId),
    jump: (sessionId, key) => {
      const ports = jumpPortsFor(ctx, sessionId)
      ports.report = (code: JumpFailureCode) => {
        // Surface the failure through the component via a DOM event the
        // strip listens for; simplest reliable cross-boundary channel here.
        window.dispatchEvent(new CustomEvent('question-nav:jump-failed', { detail: code }))
      }
      void jumpToQuestion(ports, key)
```

#### 缺口

- 宿主projection缓存对派生问题文本的删除/导出生命周期不在插件内闭合
  **影响**：不能断言卸载即移除额外问题索引
  **进一步探讨**：按匹配宿主投影缓存契约核对清理和会话删除行为

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程结构和成本有什么证据？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

core以纯函数拆出分组、key、窗口合并、定位和时间格式，jump注入端口方便测试；React事件/ResizeObserver/订阅部分有清理。jump测试覆盖inactive、已呈现精确行和not-found，但名为pages older的用例初始就含目标，只读文本不能认为已验证真实翻页到旧目标，更不能由测试名字宣称完整分页验收。

初次是对齐SDK、安装构建产物、重启GUI并选择条带位置；持续无需独立API或key，事件投影储存全部首块文字，逐条追加复制数组、客户端refresh又按全索引分组，因此很长会话仍有随问题数增长的内存/CPU，而非恒定成本。点选后只加载所需历史降低预展开成本，但多个旧跳转并发可增加重复分页。恢复主要是停用界面、刷新客户端、回到兼容版本，并按宿主规则处理投影数据；实际定位时间和长会话延迟未知，不填写性能提升百分比。

#### 证据与依据

**依据 1 · 源码核查**：[tests/jump.spec.ts:27-58](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/tests/jump.spec.ts#L27-L58)

跳转mock范围及初始已有目标的所谓分页用例。

<details>
<summary>查看原文（32行）</summary>

```text
describe('jumpToQuestion', () => {
  it('fails when the view is inactive', async () => {
    const result = await jumpToQuestion(ports({ isViewActive: () => false }), 'k')
    expect(result).toEqual({ ok: false, code: 'VIEW_INACTIVE' })
  })

  it('scrolls to the exact row when it is rendered', async () => {
    let scrolled = ''
    const result = await jumpToQuestion(ports({
      snapshot: () => snapshot({ rows: [{ key: 'k', anchorSeq: 1, visibility: 'visible' }] }),
      findRow: (key) => ({ tagName: 'DIV' } as HTMLElement),
      scrollIntoView: (row) => { scrolled = row.tagName },
    }), 'k')
    expect(result.ok).toBe(true)
    expect(scrolled).toBe('DIV')
  })

  it('pages older content until the key is in the window', async () => {
    const seen: string[] = []
    const snap = snapshot({ hasMore: true, rows: [{ key: 'k', anchorSeq: 5, visibility: 'visible' }] })
    await jumpToQuestion(ports({
      snapshot: () => { seen.push('read'); return snap },
      findRow: (key) => ({ tagName: 'DIV' } as HTMLElement),
    }), 'k')
    expect(seen.length).toBeGreaterThan(0)
  })

  it('returns NOT_FOUND when the key never loads and no more history exists', async () => {
    const result = await jumpToQuestion(ports({
      snapshot: () => snapshot({ rows: [{ key: 'other', anchorSeq: 1, visibility: 'visible' }] }),
    }), 'missing')
    expect(result).toEqual({ ok: false, code: 'NOT_FOUND' })
```

</details>

**依据 2 · 源码核查**：[src/client/QuestionNavStrip.tsx:404-420](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/QuestionNavStrip.tsx#L404-L420)

ResizeObserver与窗口事件清理。

<details>
<summary>查看原文（17行）</summary>

```text
    observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(wake)
    if (observer !== null) {
      const panel = panelRef.current
      const frame = panel?.closest('[data-shell-overlay]')?.parentElement ?? null
      const convRoot = findConvRoot()
      if (frame !== null) { observer.observe(frame, { box: 'border-box' }); observed.frame = frame }
      if (convRoot !== null) { observer.observe(convRoot, { box: 'border-box' }); observed.convRoot = convRoot }
    }

    // Initial alignment; the loop keeps correcting through layout transitions.
    wake()
    window.addEventListener('resize', wake)
    return () => {
      stopped = true
      if (raf !== 0) cancelAnimationFrame(raf)
      observer?.disconnect()
      window.removeEventListener('resize', wake)
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:81-88](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/projection.ts#L81-L88)

保存文本并数组追加复制。

```text
        const entry: QuestionEntry = {
          turn: state.turn,
          id: String(event.data.id),
          seq: event.seq,
          time: event.time,
          text: messageText(event.data.content),
        }
        return { ...state, questions: [...state.questions, entry] }
```

**依据 4 · 源码核查**：[src/core/turn-dots.ts:59-82](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/turn-dots.ts#L59-L82)

全索引分组成本。

<details>
<summary>查看原文（24行）</summary>

```text
export function groupQuestionsByTurn(entries: readonly QuestionEntry[]): TurnDot[] {
  const sorted = isSortedBySeq(entries) ? entries : [...entries].sort((a, b) => a.seq - b.seq)
  const dots: TurnDot[] = []
  for (const entry of sorted) {
    const key = questionKey(entry.id)
    const last = dots.at(-1)
    if (last !== undefined && last.turn === entry.turn) {
      dots[dots.length - 1] = {
        ...last,
        texts: [...last.texts, entry.text],
        memberKeys: [...last.memberKeys, key],
      }
      continue
    }
    dots.push({
      turn: entry.turn,
      key,
      anchorSeq: entry.seq,
      time: entry.time,
      texts: [entry.text],
      memberKeys: [key],
    })
  }
  return dots
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用条件和进一步探讨入口是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

建议在明确对应stable SDK的个人DSH长会话中试用，敏感提问留意同屏卡片；先以几条单文本问题和较早历史验证自己的导航预期，不以点击视觉反馈代替实际定位。多块消息/多会话切换和连续点击是具体限制，现阶段不把它作为唯一查找重要上下文手段。出现旧会话滚动、点与消息不一致或加载卡住时刷新/停用，保留原始会话以便手工回看。

可继续讨论带session与任务代次的可取消导航、按anchorSeq距离的真实回退以及多块文字索引。基线是手工滚动/当前jump循环，固定反例包含旧任务后切会话、双点不同目标、loadOlder不返回、hidden target和首图片后文字；衡量误跳、完成延迟和完整文字可见率。它是待验证方向，不以已有纯函数或悬停效果夸称新交互算法。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:67-94](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/client/index.ts#L67-L94)

会话端口和全局DOM之间的边界。

<details>
<summary>查看原文（28行）</summary>

```text
function jumpPortsFor(ctx: ClientContext, sessionId: SessionId): JumpPorts {
  return {
    snapshot: () => {
      const binding = ctx.sessions.binding(sessionId)
      const snap = binding?.session.getSnapshot()
      if (snap === undefined) return undefined
      return {
        openState: snap.openState,
        hasMore: snap.hasMore,
        loadingOlder: snap.loadingOlder,
        rows: snap.chat.nodes.values(),
      }
    },
    loadOlder: async () => {
      const binding = ctx.sessions.binding(sessionId)
      if (binding === undefined) throw new Error('session unavailable')
      await binding.session.loadOlder()
    },
    isViewActive: () => document.querySelector('[data-chat-flow]') !== null,
    findRow: (key: string) => {
      for (const candidate of Array.from(document.querySelectorAll<HTMLElement>('[data-chat-anchor-key]'))) {
        if (candidate.dataset.chatAnchorKey === key) return candidate
      }
      return null
    },
    scrollIntoView: (row) => row.scrollIntoView({ block: 'start' }),
    now: () => Date.now(),
    sleep: (ms) => new Promise((resolve) => window.setTimeout(resolve, ms)),
```

</details>

**依据 2 · 源码核查**：[src/core/jump.ts:87-123](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/core/jump.ts#L87-L123)

当前无取消参数。

<details>
<summary>查看原文（37行）</summary>

```text
export async function jumpToQuestion(ports: JumpPorts, key: string, options: JumpOptions = {}): Promise<JumpResult> {
  const cfg = { ...DEFAULTS, ...options }
  const fail = (code: JumpFailureCode, fallback = false): JumpResult => {
    ports.report?.(code, fallback)
    return fallback ? { ok: false, code, fallback: true } : { ok: false, code }
  }

  if (!ports.isViewActive()) return fail('VIEW_INACTIVE')

  const deadline = ports.now() + cfg.totalTimeoutMs
  let pages = 0

  // Phase 1: page older until the key appears in the loaded window.
  while (true) {
    const snap = ports.snapshot()
    if (snap === undefined) return fail('VIEW_INACTIVE')
    const rows = renderable(snap.rows)
    if (rows.some((r) => r.key === key)) break
    if (snap.openState !== 'open') {
      if (snap.openState === 'error' || ports.now() > deadline) {
        return fail(snap.openState === 'error' ? 'VIEW_INACTIVE' : 'TIMEOUT')
      }
      await ports.sleep(cfg.pollMs)
      continue
    }
    if (snap.hasMore !== true) return fail('NOT_FOUND')
    if (pages >= cfg.maxPages || ports.now() > deadline) return fail('TIMEOUT')
    if (snap.loadingOlder) {
      await ports.sleep(cfg.pollMs)
      continue
    }
    const before = minAnchorSeq(rows)
    await ports.loadOlder()
    pages += 1
    const afterSnap = ports.snapshot()
    const after = minAnchorSeq(afterSnap === undefined ? [] : afterSnap.rows)
    if (after === null || (before !== null && after >= before)) return fail('NOT_FOUND')
```

</details>

**依据 3 · 源码核查**：[src/projection.ts:57-61](https://github.com/AbelKeithsun/dsh-question-nav/blob/29e7e487235bdbcba13768f1a009ecd2089d6faa/src/projection.ts#L57-L61)

当前单块索引。

```text
/** First text block of a user message; empty string when absent. */
function messageText(content: readonly { type?: string; text?: string }[] | undefined): string {
  if (content === undefined || content.length === 0) return ''
  const first = content[0]
  return typeof first?.text === 'string' ? first.text : ''
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
