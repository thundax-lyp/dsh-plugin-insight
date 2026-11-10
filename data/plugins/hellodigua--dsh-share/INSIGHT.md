# dsh-share

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[b5212ef](https://github.com/hellodigua/dsh-share/tree/b5212ef748ac56aeb4d56c6f8a86be836921114f)

<!-- BEGIN META -->
[![GitHub ★ 43](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=43&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hellodigua/dsh-share) [![npm 30d 2,310](https://img.shields.io/static/v1?label=npm+30d&message=2%2C310&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-share) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-share)
<!-- END META -->

> **功能**：在 DSH Web 选择单轮或多轮问答，导出 PNG、Markdown 或 HTML，并支持分页图片打包。

> **亮点**：将可选择的问答快照、顺序、间隔提示和三个文件格式接入宿主界面，减少人工组装。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：隐藏过程按结构标记过滤。内容和文件名可能含敏感信息，生成 HTML 还可能请求消息图片 URL。导出或转发的副本需要在目的地处理。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 如何从 DSH 会话提取若干轮问答，交给同事复盘？](#detail-section-11)
  - [Q02 · 隐藏过程和 HTML 净化能约束哪些内容和网络请求？](#detail-section-12)
  - [Q03 · 长图、权限或资源失败时，用户能得到哪些替代输出？](#detail-section-13)
  - [Q04 · 在什么条件下试用，失败或退出要付出什么成本？](#detail-section-14)
  - [Q05 · 导出前展示实际内容清单是否值得做？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要定期向同事转交会话证据的 DSH Web 用户，希望把多轮不连续问答整理成一个可读附件。[Q01](#research-q01)

原办法是复制单条内容到文档，或截图并手工拼接。对照时使用同一组选定问答和文件格式。[Q01](#research-q01) [Q05](#research-q05)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多轮选择 | 按顺序提取非连续问答 | 只处理已渲染的完整轮次 |
| 文本导出 | 生成 Markdown 或离线 HTML | 需检查正文和资源 |
| 图片分页 | 下载 PNG 或 ZIP | 受尺寸和归档限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web 插槽及 DOM | 必需 | 发现并选择轮次 | 回原生复制 |
| 浏览器下载或剪贴板 | 按格式 | 保存本地附件 | 剪贴板失败改下载 |
| 图片可读 | 完整媒体所需 | 将栅格图带入输出 | 标记占位并核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择 | 用户加载历史并选三轮 | 核对顺序和省略标记 |
| 导出 | 用户检查附件和图像缺口 | 正文、标题和过程满足范围 |
| 退出 | 移除插件并检查已下载副本 | 宿主原生复制可用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 资源未测 | 安装、重启和兼容检查 | 先用合成会话 |
| 持续 | 内存、图片流量和时间未测 | 选轮及复核文件 | 按合格附件记录 |
| 失败 | 重做用时未测 | 缩小范围或改用文本 | 外发副本须另行处置 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 结构化附件 | 稳定轮次顺序和省略提示 | 实际少用多少编辑时间 |
| 可读长图 | 分页和缩放重试 | 各浏览器资源极限 |
| 离线 HTML | 白名单及内嵌图像 | 真实图像成功率和敏感内容覆盖 |

> **思考**：隐藏过程按结构标记过滤。内容和文件名可能含敏感信息，生成 HTML 还可能请求消息图片 URL。导出或转发的副本需要在目的地处理。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将可选择的问答快照、顺序、间隔提示和三个文件格式接入宿主界面，减少人工组装。[Q01](#research-q01) [Q03](#research-q03)

渲染任务用代次避免旧结果覆盖，长图按问答边界切分。HTML 另有资源时限、字节和标签约束。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

隐藏过程按结构标记过滤。内容和文件名可能含敏感信息，生成 HTML 还可能请求消息图片 URL。导出或转发的副本需要在目的地处理。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立 Web profile 用合成会话验证 Markdown 和 HTML，再试长图分页。加载历史后核对勾选范围。检查导出中的问题、答案、工具摘要、文件名和图片缺口，核对后才在外部发送。无法明确范围时停用并改为手动复制。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持选择、浏览器本地导出和失败回退。未验证真实浏览器、隐私检查覆盖和任务时间。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/client/index.ts、src/client/dom.ts、src/client/content.ts、src/client/runtime.ts、src/client/preview-dialog.ts、src/client/settings.ts、src/client/card.ts、src/client/markdown.ts、src/client/html.ts、src/client/pagination.ts、src/client/zip.ts、package.json、src/client/filename.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件源码和 Web 装配入口，未审计全部依赖或宿主。代码未执行，未打开导出或发出分享。
- 下一步：未运行固定浏览器和宿主，未核对实际网络、隐私过滤覆盖和资源占用。

**分析版本**

- **仓库**：[hellodigua/dsh-share](https://github.com/hellodigua/dsh-share)
- **版本号**：0.5.0（[固定提交 b5212ef](https://github.com/hellodigua/dsh-share/tree/b5212ef748ac56aeb4d56c6f8a86be836921114f)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

对比可确认的导出清单与现有操作，测错误披露、误删和人工时间。如果无净改善即放弃。[Q05](#research-q05)

未运行固定浏览器和宿主，未核对实际网络、隐私过滤覆盖和资源占用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 456 | — | — | 5050 |
| .js | source | 2 | 5782 | 5532 | 289 | — |
| .mjs | source | 2 | 150 | 134 | 2 | — |
| .ts | source | 21 | 3523 | 3227 | 87 | — |
| .ts | test | 22 | 2873 | 2582 | 35 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/hellodigua/dsh-share/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hellodigua/dsh-share/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 DSH 用户能否选择、检查并导出可分享的对话片段，界定内容暴露、失败及退出。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 如何从 DSH 会话提取若干轮问答，交给同事复盘？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合经常需要把多轮问答整理成同事可读附件的 DSH Web 用户。原办法是逐段复制到文档，或截图后手工拼接。Cordis 的宿主入口为空函数，负责让宿主发现 Web bundle。客户端注册会话头和回答动作两个官方插槽，通过 DOM 数据标记从本轮尾部回溯出问题、追问、回答和过程。会话头进入多选并默认全选，滚动加载的新轮次也会自动选中，直到用户改单轮选择或取消全选。轮次按钮可预选一轮，另有直出选项。只有页面已渲染、找得到起点及回答的轮次可选，较旧内容需先加载。导出按会话顺序重排不连续选择，在中间标注省略数。浏览器下载 Markdown、HTML 或 PNG，也能将图片写到剪贴板。查看权限取决于用户后续如何传文件，代码路径没有创建在线分享页或访问令牌。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-28](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/README.md#L15-L28)

作者描述交互与导出格式。

<details>
<summary>查看原文（14行）</summary>

```text
## 功能

- 从右上角进入问答选择模式，默认全选
- 每轮的分享按钮也会进入选择模式，并只预选当前问答
- 问题和回答两侧都有联动勾选框，也可直接点击内容整组选择，支持不连续选择
- 勾选框会在长内容滚动时吸附在页面上，到当前问题或回答末尾再移出
- 可复制图片、下载 PNG 或 Markdown
- 下载文件使用 `dsh-对话标题` 命名；多张图片添加 `-01`、`-02` 等页码。标题中的非法字符会被清理，过长标题截短，无标题时使用日期时间。
- 选择模式下使用“下载”旁的格式菜单选择 Markdown 或 HTML，再点击下载；“生成分享图片”独立保留。HTML 采用轻量会话布局、用户气泡及官方 Markdown 核心排版规则，保留可用的主题配色快照；文字、代码和表格可离线阅读，图片及表情尽量内嵌，无法内嵌的资源显示占位提示。不包含宿主脚本、交互控件或内部标识；SVG 等非栅格图片不内嵌。
- 保留 Markdown、代码块、表格、图片和工具调用摘要
- 可调整图片宽度和字号，长图支持滚动预览
- 按完整问答顺序分页：当前页不足 4096 CSS 像素时继续加入下一整组，达到或超过目标后再换页。支持翻页预览、复制和下载当前页；“下载全部”一次保存包含所有分页 PNG 的 ZIP，包内图片按页码命名，图片总大小上限为 512 MiB。末尾仅含一组且低于 1024 CSS 像素的短页并入前页，总共只选一组时保留单页。页面允许超过目标高度，不裁切内容
- 默认以 2 倍比例导出；图片过大或生成失败时，会尝试降低到 1 倍或 0.5 倍以保留完整内容。仍无法生成时明确提示失败，可减小字号、减少内容或导出 Markdown
- 可勾选“不展示过程”，只保留提问和最终回答
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/cordis.patch.yml#L1-L3)

Cordis 插件行。

```text
- insert:
    - id: dsh-share
      name: dsh-share
```

**依据 3 · 源码核查**：[src/index.ts:1-4](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/index.ts#L1-L4)

宿主入口不实现上传或模型功能。

```text
export const name = 'dsh-share'

// 插件功能全部运行在 Web 客户端；保留 Host 入口用于让 DSH 发现客户端 bundle。
export function apply(_ctx: unknown): void {}
```

**依据 4 · 源码核查**：[src/client/index.ts:82-130](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/index.ts#L82-L130)

两个 Web 插槽与共同运行时。

<details>
<summary>查看原文（49行）</summary>

```text
export function apply(ctx: Context): void {
  let sharedRuntime: ShareRuntime | undefined
  let registrations = 0
  const runtimeForRegistration = (): ShareRuntime => {
    sharedRuntime ??= createShareRuntime(document, {
      getLocale: () => normalizeShareLocale(ctx.locale.getLocale().active),
      subscribeLocale: listener => ctx.locale.subscribe(listener),
    })
    return sharedRuntime
  }
  const injectFace = (sessionId: unknown): ShareRuntimeInjected => {
    const runtime = runtimeForRegistration()
    return {
      hooks: {
        shareLocale: ctx.locale,
        shareSelection: runtime.selectionFor(String(sessionId)),
      },
      shareRuntime: runtime,
    }
  }
  const cleanup = (disposeRegistration: () => void): (() => void) => {
    registrations += 1
    return () => {
      disposeRegistration()
      registrations -= 1
      if (registrations === 0) {
        sharedRuntime?.dispose()
        sharedRuntime = undefined
      }
    }
  }
  ctx.slots.inject('conversation.chat.assistant-actions', () => {
    const disposeRegistration = ctx.slots.register({
      name: 'conversation.chat.assistant-actions',
      id: 'share',
      order: 20,
      inject: injectFace,
    }, ShareAction)
    return cleanup(disposeRegistration)
  })
  ctx.slots.inject('conversation.session.header.utilities', () => {
    const disposeRegistration = ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'share-conversation',
      order: -10,
      inject: injectFace,
    }, ShareConversationAction)
    return cleanup(disposeRegistration)
  })
```

</details>

**依据 5 · 源码核查**：[src/client/dom.ts:42-97](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/dom.ts#L42-L97)

仅当前已渲染、具问答结构的轮次。

<details>
<summary>查看原文（56行）</summary>

```text
export function findTurnContent(tail: HTMLElement): TurnContent | undefined {
  const flowTail = tail.closest<HTMLElement>(TURN_FLOW_SELECTOR)
  if (!flowTail) return undefined

  const prompts: HTMLElement[] = []
  const answers: HTMLElement[] = []
  let sibling = flowTail.previousElementSibling
  let foundStart = false

  while (sibling instanceof HTMLElement) {
    const kind = sibling.dataset.chatFlowKind

    if (kind === 'assistant-step' || kind === 'tool-call') {
      answers.unshift(sibling)
    } else if (sibling.hasAttribute('data-step-process')) {
      const members = sibling.querySelectorAll<HTMLElement>(
        '[data-step-process-content] > [data-chat-flow-kind]',
      )
      answers.unshift(...[...members].filter(member =>
        member.dataset.chatFlowKind === 'assistant-step' || member.dataset.chatFlowKind === 'tool-call',
      ))
    } else if (kind === 'steering') {
      prompts.unshift(sibling)
    } else if (kind === 'user') {
      prompts.unshift(sibling)
      foundStart = true
      break
    } else if (kind === 'turn-tail') {
      break
    }

    sibling = sibling.previousElementSibling
  }

  if (!foundStart || prompts.length === 0 || answers.length === 0) return undefined
  return { prompts, answers, tail }
}

/** 从官方 assistant-actions 插槽渲染的按钮定位并收集当前轮内容。 */
export function findTurnContentFromAction(action: HTMLElement): TurnContent | undefined {
  const tail = action.closest<HTMLElement>(TURN_TAIL_SELECTOR)
  return tail ? findTurnContent(tail) : undefined
}

/** 收集当前会话页面中已经渲染并完成的轮次，按 DSH 原始 turn 排序。 */
export function findRenderedTurns(root: ParentNode): RenderedTurn[] {
  return [...root.querySelectorAll<HTMLElement>(TURN_TAIL_SELECTOR)]
    .map((tail): RenderedTurn | undefined => {
      const turn = Number(tail.dataset.turnTail)
      if (!Number.isFinite(turn)) return undefined
      const content = findTurnContent(tail)
      return content ? { content, turn } : undefined
    })
    .filter((item): item is RenderedTurn => item !== undefined)
    .sort((left, right) => left.turn - right.turn)
}
```

</details>

**依据 6 · 源码核查**：[src/client/content.ts:24-53](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/content.ts#L24-L53)

按轮次排序、问答配对和省略标记。

<details>
<summary>查看原文（30行）</summary>

```text
export function selectedTurnsToShareMessages(selected: Iterable<SelectedTurn>): ShareMessage[] {
  const ordered = [...selected].sort((left, right) => left.turn - right.turn)
  return ordered.flatMap((item, index) => {
    const previous = ordered[index - 1]
    const messages = turnToShareMessages(item.content, item.turn)
    messages[0]!.omittedBefore = previous === undefined
      ? 0
      : Math.max(0, item.turn - previous.turn - 1)
    return messages
  })
}

/** 一轮问答转成连续的“用户消息 + 回答消息”渲染模型。 */
export function turnToShareMessages(content: TurnContent, turn: number): ShareMessage[] {
  return [
    {
      elements: content.prompts,
      omittedBefore: 0,
      order: turn * 2,
      role: 'user',
      turn,
    },
    {
      elements: content.answers,
      omittedBefore: 0,
      order: turn * 2 + 1,
      role: 'assistant',
      turn,
    },
  ]
```

</details>

**依据 7 · 源码核查**：[src/client/runtime.ts:690-719](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L690-L719)

会话切换及单轮直出分支。

<details>
<summary>查看原文（30行）</summary>

```text
  const enterSelection = (sessionId: string, source?: HTMLElement, initialTurn?: number, title?: string): void => {
    for (const [id, other] of selections) {
      if (id !== sessionId && other.snapshot.active) resetSelection(other)
    }
    const controller = selectionFor(sessionId)
    if (controller.snapshot.active) return
    resetSelection(controller)
    controller.title = title
    const root = source?.closest<HTMLElement>('[data-phase]')
    const scroll = root?.querySelector<HTMLElement>('[data-conversation-scroll]')
      ?? document.querySelector<HTMLElement>('[data-conversation-scroll]')
    if (!scroll) return
    if (initialTurn !== undefined && directSingleTurnEnabled()) {
      const selected = selectableTurns(scroll).find(turn => turn.turn === initialTurn)
      if (!selected) return
      const messages = selectedTurnsToShareMessages([{
        content: snapshotTurnContent(selected.content),
        id: selected.id,
        turn: selected.turn,
      }])
      activeContent = messages
      activeTitle = controller.title
      activeGroupCount = 1
      void renderContent(messages, activeGroupCount)
      return
    }
    subscribeSelectionLocale()
    const scrollTop = scroll.scrollTop
    controller.scroll = scroll
    controller.selectNewTurns = initialTurn === undefined
```

</details>

**依据 8 · 源码核查**：[src/client/preview-dialog.ts:67-85](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/preview-dialog.ts#L67-L85)

文本文件由浏览器 Blob 下载。

<details>
<summary>查看原文（19行）</summary>

```text
export function downloadMarkdownFile(document: Document, markdown: string, title?: string): void {
  if (!markdown) return
  const objectUrl = URL.createObjectURL(new Blob([markdown], { type: 'text/markdown;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = createDownloadFilename('md', title)
  anchor.click()
  document.defaultView?.setTimeout(() => URL.revokeObjectURL(objectUrl), 0)
}

/** 下载独立HTML文档，给宿主留出读取Blob的时间。 */
export function downloadHtmlFile(document: Document, html: string, title?: string): void {
  const url = URL.createObjectURL(new Blob([html], { type: 'text/html;charset=utf-8' }))
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = createDownloadFilename('html', title)
  anchor.click()
  document.defaultView?.setTimeout(() => URL.revokeObjectURL(url), 60000)
}
```

</details>

**依据 9 · 源码核查**：[src/client/runtime.ts:331-363](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L331-L363)

缓存首份快照，手动选择或取消全选影响后续自动选中。

<details>
<summary>查看原文（33行）</summary>

```text
  const snapshotTurn = (controller: SessionSelection, turn: SelectableTurn): SelectedTurn => {
    const existing = controller.snapshots.get(turn.id)
    if (existing) return existing
    const snapshot: SelectedTurn = {
      content: snapshotTurnContent(turn.content),
      id: turn.id,
      turn: turn.turn,
    }
    controller.snapshots.set(turn.id, snapshot)
    return snapshot
  }

  const toggleSelection = (controller: SessionSelection, turnId: string): void => {
    if (!controller.snapshot.active) return
    const turn = controller.available.get(turnId)
    if (!turn) return
    controller.selectNewTurns = false
    if (controller.selected.has(turnId)) controller.selected.delete(turnId)
    else controller.selected.set(turnId, snapshotTurn(controller, turn))
    publishSelection(controller, true)
  }

  const toggleAll = (controller: SessionSelection): void => {
    if (controller.snapshot.allSelected) {
      controller.selected.clear()
      controller.selectNewTurns = false
    } else {
      controller.selected = new Map(
        [...controller.available.values()].map(turn => [turn.id, snapshotTurn(controller, turn)]),
      )
      controller.selectNewTurns = true
    }
    publishSelection(controller, true)
```

</details>

**依据 10 · 源码核查**：[src/client/runtime.ts:461-472](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L461-L472)

全选状态自动加入新加载轮次。

<details>
<summary>查看原文（12行）</summary>

```text
  const refreshSelection = (controller: SessionSelection): void => {
    const scroll = controller.scroll
    if (!scroll || !controller.snapshot.active) return
    for (const turn of selectableTurns(scroll)) {
      const isNew = !controller.available.has(turn.id)
      controller.available.set(turn.id, turn)
      if (isNew && controller.selectNewTurns) {
        controller.selected.set(turn.id, snapshotTurn(controller, turn))
      }
      attachSelectionButtons(controller, turn)
    }
    publishSelection(controller, true)
```

</details>

#### 缺口

- 未在真实宿主比较旧历史、流式回答和原生操作。
  **影响**：无法量化截图、复制与插件的效率差异。
  **进一步探讨**：用固定宿主挑选三组不连续问答，回读三个格式的顺序和内容。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 隐藏过程和 HTML 净化能约束哪些内容和网络请求？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

轮次选择保存节点副本和主题；隐藏过程默认关闭，打开后按宿主标记去除工具和过程，优先显式最终回答，否则回退到可判断的非过程或末尾回答。问答正文、代码、图片 alt 和标题里的敏感信息仍可能留在结果或文件名，应逐项人工核对。文件名规范化和截短仅处理兼容性。Markdown 基于可见节点转换，未走 HTML 专用白名单。HTML 用独立文档、标签白名单和 CSP 处理脚本及资源，仍保留满足启发式条件的外链。生成时会尝试从消息图片地址取栅格，限制协议、尺寸字节、次数和时间，credentials omit、无 referrer、禁止重定向。图片读取不使用外链同一套私网与查询字段过滤，带参数的原图片 URL 仍可能被请求，浏览器自身限制是否拦截另需验证。失败用占位显示，输出文件只留内嵌数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/dom.ts:17-35](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/dom.ts#L17-L35)

选择快照保存节点与主题。

<details>
<summary>查看原文（19行）</summary>

```text
/** 立即克隆消息节点，后续滚动卸载原 DOM 也不会影响导出。 */
export function snapshotElements(elements: readonly HTMLElement[]): HTMLElement[] {
  return elements.map(element => {
    const snapshot = element.cloneNode(true) as HTMLElement
    saveExportTheme(element, snapshot)
    return snapshot
  })
}

/**
 * 在用户勾选一轮时立即保存消息节点，避免后续滚动加载或视图切换影响导出内容。
 * tail 保留原节点引用，只用于判断会话顺序；真正渲染的问答均使用脱离页面的副本。
 */
export function snapshotTurnContent(content: TurnContent): TurnContent {
  return {
    prompts: snapshotElements(content.prompts),
    answers: snapshotElements(content.answers),
    tail: content.tail,
  }
```

</details>

**依据 2 · 源码核查**：[src/client/settings.ts:22-30](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/settings.ts#L22-L30)

隐藏过程默认关闭。

```text
export const DEFAULT_SHARE_SETTINGS: ShareSettings = {
  width: 'tablet',
  fontSize: 'normal',
  hideProcess: false,
}

const WIDTH_STORAGE_KEY = 'dsh-share.width'
const FONT_SIZE_STORAGE_KEY = 'dsh-share.font-size'
const HIDE_PROCESS_STORAGE_KEY = 'dsh-share.hide-process'
```

**依据 3 · 源码核查**：[src/client/card.ts:95-129](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/card.ts#L95-L129)

移除已识别过程与宿主按钮。

<details>
<summary>查看原文（35行）</summary>

```text
  const clone = source.cloneNode(true) as HTMLElement
  clone.dataset.dshShareMessage = ''

  // 分享副本需要脱离页面的过程折叠状态。
  if (source.dataset.turnProcessMember === 'true' && clone.getAttribute('hidden') === 'until-found') {
    clone.removeAttribute('hidden')
  }
  clone.removeAttribute('data-turn-process-member')
  clone.removeAttribute('data-turn-process-hidden')
  clone.removeAttribute('data-turn-process-answer')

  if (hideReasoning) {
    for (const reasoning of clone.querySelectorAll<HTMLElement>('[data-turn-process-inline]')) {
      reasoning.remove()
    }
    for (const reasoning of clone.querySelectorAll<HTMLElement>('[data-variant="think"]')) {
      reasoning.remove()
    }
  } else {
    for (const reasoning of clone.querySelectorAll<HTMLElement>('[data-turn-process-inline]')) {
      if (reasoning.getAttribute('hidden') === 'until-found') reasoning.removeAttribute('hidden')
      reasoning.removeAttribute('data-turn-process-inline')
    }
  }

  // 删除 hover 操作区，避免复制、分支和本插件按钮出现在分享图里。
  for (const hoverRoot of clone.querySelectorAll<HTMLElement>('[data-time-hover-root]')) {
    const last = hoverRoot.lastElementChild
    if (last?.querySelector('button')) last.remove()
  }
  for (const element of clone.querySelectorAll<HTMLElement>(
    'button, input, textarea, select, [data-dsh-share-button], [role="tooltip"]',
  )) {
    element.remove()
  }
```

</details>

**依据 4 · 源码核查**：[src/client/card.ts:143-164](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/card.ts#L143-L164)

按宿主回答标记过滤。

<details>
<summary>查看原文（22行）</summary>

```text
/** 与图片和 Markdown 共用的回答过程过滤规则。 */
export function visibleAssistantElements(
  elements: readonly HTMLElement[],
  hideProcess: boolean,
): HTMLElement[] {
  if (!hideProcess) return [...elements]

  const assistantSteps = elements.filter(element =>
    element.dataset.chatFlowKind === 'assistant-step' && element.dataset.chatGroupPart !== 'reasoning',
  )
  const explicitAnswers = assistantSteps.filter(element => element.dataset.turnProcessAnswer === 'true')
  if (explicitAnswers.length > 0) return explicitAnswers

  const hasTurnProcessMembers = elements.some(element => element.dataset.turnProcessMember === 'true')
  if (hasTurnProcessMembers) {
    const answers = assistantSteps.filter(element => element.dataset.turnProcessMember !== 'true')
    if (answers.length > 0) return answers
  }

  // 未折叠的视图没有过程成员标记，以最后一个回答座位为准。
  return assistantSteps.slice(-1)
}
```

</details>

**依据 5 · 源码核查**：[src/client/markdown.ts:40-73](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/markdown.ts#L40-L73)

可见节点用 Turndown 转换。

<details>
<summary>查看原文（34行）</summary>

```text
function convertMessages(
  converter: TurndownService,
  messages: readonly HTMLElement[],
  locale: 'zh' | 'en',
  hideReasoning = false,
): string {
  return messages
    .map(message => converter.turndown(cloneShareMessage(message, locale, hideReasoning)).trim())
    .filter(Boolean)
    .join('\n\n')
}

/** 将与 PNG 相同的可见内容导出为按原会话顺序排列的 GFM Markdown。 */
export function createShareMarkdown(
  messages: readonly ShareMessage[],
  locale: 'zh' | 'en',
  settings: ShareSettings,
): string {
  const converter = createConverter()
  const parts = [locale === 'zh' ? '# 对话分享' : '# Shared conversation']

  for (const message of messages) {
    if (message.omittedBefore > 0) {
      parts.push(locale === 'zh'
        ? `> 中间省略 ${message.omittedBefore} 组对话`
        : `> ${message.omittedBefore} conversation ${message.omittedBefore === 1 ? 'group was' : 'groups were'} omitted`)
    }

    const elements = message.role === 'assistant'
      ? visibleAssistantElements(message.elements, settings.hideProcess)
      : message.elements
    const content = convertMessages(
      converter,
      elements,
```

</details>

**依据 6 · 源码核查**：[src/client/html.ts:7-22](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/html.ts#L7-L22)

外链过滤是规则匹配。

<details>
<summary>查看原文（16行）</summary>

```text
const TAGS = new Set('div p span br hr h1 h2 h3 h4 h5 h6 strong b em i u s del blockquote pre code ul ol li table thead tbody tfoot tr th td caption a sub sup details summary'.split(' '))
const DROP = new Set('script style link meta base iframe object embed form input button textarea select template svg canvas audio video source'.split(' '))
const IMAGE_TYPE = /^image\/(png|jpeg|gif|webp|avif)$/i
const MAX_IMAGE_BYTES = 8 * 1024 * 1024
const MAX_TOTAL_BYTES = 32 * 1024 * 1024

/** 只保留普通外部链接，排除宿主地址和携带认证参数的链接。 */
function publicLink(value: string): string | undefined {
  try {
    const url = new URL(value)
    if (!/^https?:$/.test(url.protocol) || url.username || url.password) return
    if (/^(localhost|127\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|\[|0\.)/i.test(url.hostname)
      || !url.hostname.includes('.') || /\.(local|internal)$/i.test(url.hostname)) return
    if ([...url.searchParams.keys()].some(key => /token|secret|auth|key|signature|credential/i.test(key))) return
    return url.href
  } catch { return }
```

</details>

**依据 7 · 源码核查**：[src/client/html.ts:32-56](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/html.ts#L32-L56)

离线文档与 CSP。

<details>
<summary>查看原文（25行）</summary>

```text
  const output = document.implementation.createHTMLDocument(locale === 'zh' ? '对话分享' : 'Shared conversation')
  output.documentElement.lang = locale === 'zh' ? 'zh-CN' : 'en'
  const charset = output.createElement('meta')
  charset.setAttribute('charset', 'utf-8')
  const csp = output.createElement('meta')
  csp.httpEquiv = 'Content-Security-Policy'
  csp.content = "default-src 'none'; img-src data:; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'"
  const viewport = output.createElement('meta')
  viewport.name = 'viewport'
  viewport.content = 'width=device-width, initial-scale=1'
  const style = output.createElement('style')
  style.textContent = HTML_STYLE
  output.head.prepend(charset, csp, viewport, style)
  const main = output.createElement('main')
  main.ariaLabel = output.title
  applyHtmlExportTheme(output.body, messages.flatMap(message => message.elements))
  output.body.append(main)
  // 在异步资源读取前固定选择内容，避免宿主更新改变导出结果。
  const snapshots = messages.map(message => ({
    role: message.role,
    omittedBefore: message.omittedBefore,
    elements: (message.role === 'assistant'
      ? visibleAssistantElements(message.elements, settings.hideProcess) : message.elements)
      .map(element => cloneShareMessage(element, locale, message.role === 'assistant' && settings.hideProcess)),
  }))
```

</details>

**依据 8 · 源码核查**：[src/client/html.ts:60-112](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/html.ts#L60-L112)

图片网络请求、字节预算和占位。

<details>
<summary>查看原文（53行）</summary>

```text
  const deadline = Date.now() + 30000
  const cache = new Map<string, { data: string, size: number }>()

  /** 限时限量读取栅格图片，不携带跨站认证信息或保留资源地址。 */
  async function embedImage(source: Element): Promise<Node> {
    const image = output.createElement('img')
    image.alt = source.getAttribute('alt') ?? ''
    try {
      const raw = source.getAttribute('src') ?? ''
      const url = new URL(raw, document.baseURI)
      if (!raw || !['http:', 'https:', 'blob:', 'data:', 'dsh-app:'].includes(url.protocol)) throw new Error('Unsupported image')
      if (url.username || url.password || ++imageCount > 100) throw new Error('Image budget exceeded')
      let cached = cache.get(url.href)
      if (!cached) {
        const remaining = deadline - Date.now()
        if (remaining <= 0) throw new Error('Image deadline exceeded')
        const response = await fetch(url.href, { credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: AbortSignal.timeout(Math.min(10000, remaining)) })
        const type = response.headers.get('content-type')?.split(';')[0] ?? ''
        if (!response.ok || !IMAGE_TYPE.test(type) || !response.body) throw new Error('Unsupported image')
        const reader = response.body.getReader()
        const chunks: Uint8Array<ArrayBuffer>[] = []
        let size = 0
        try {
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            size += value.byteLength
            if (size > MAX_IMAGE_BYTES || totalBytes + size > MAX_TOTAL_BYTES) throw new Error('Image budget exceeded')
            chunks.push(new Uint8Array(value))
          }
        } finally { await reader.cancel() }
        const blob = new Blob(chunks, { type })
        const data = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('Image encoding failed'))
          reader.readAsDataURL(blob)
        })
        cached = { data, size }
        cache.set(url.href, cached)
      }
      if (totalBytes + cached.size > MAX_TOTAL_BYTES) throw new Error('Image budget exceeded')
      totalBytes += cached.size
      image.src = cached.data
      const height = Number.parseFloat(source.getAttribute('height') ?? (source as HTMLElement).style?.height ?? '')
      if ((height > 0 && height <= 64) || source.getAttribute('src')?.includes('/api/dsh-emoji/assets/')) image.className = 'emoji'
      return image
    } catch {
      missingImages++
      const placeholder = output.createElement('span')
      placeholder.className = 'notice'
      placeholder.textContent = locale === 'zh' ? '[图片未能内嵌]' : '[Image could not be embedded]'
      return placeholder
```

</details>

**依据 9 · 源码核查**：[src/client/html.ts:117-145](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/html.ts#L117-L145)

标签白名单和有限属性。

<details>
<summary>查看原文（29行）</summary>

```text
  async function sanitize(node: Node): Promise<Node> {
    if (node.nodeType === 3) return output.createTextNode(node.textContent ?? '')
    if (node.nodeType !== 1) return output.createDocumentFragment()
    const source = node as Element
    const tag = source.localName.toLowerCase()
    if (DROP.has(tag)) return output.createDocumentFragment()
    if (tag === 'img') return embedImage(source)
    const result = TAGS.has(tag) ? output.createElement(tag) : output.createDocumentFragment()
    if (result.nodeType === 1) {
      const element = result as HTMLElement
      if (source.hasAttribute('data-code-block-banner')) element.className = 'code-banner'
      else if (source.classList.contains('md-code-block')) element.className = 'code-block'
      else if (source.getAttribute('data-variant') === 'think') element.className = 'reasoning'
      if (tag === 'span' && source.closest('pre')) {
        const color = (source as HTMLElement).style.color
        if (/^(?:#[\da-f]{3,8}|rgba?\([\d\s.,%]+\)|[a-z]+)$/i.test(color)) element.style.color = color
      }
    }
    if (tag === 'a' && result.nodeType === 1) {
      const href = publicLink(source.getAttribute('href') ?? '')
      if (href) (result as Element).setAttribute('href', href)
    }
    if (['td', 'th'].includes(tag)) {
      for (const attribute of ['colspan', 'rowspan']) {
        const value = source.getAttribute(attribute)
        if (value && /^\d{1,3}$/.test(value)) (result as Element).setAttribute(attribute, value)
      }
    }
    for (const child of source.childNodes) result.appendChild(await sanitize(child))
```

</details>

**依据 10 · 源码核查**：[src/client/filename.ts:1-18](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/filename.ts#L1-L18)

基于对话标题生成文件名，执行规范化、字符替换和字节截断。

<details>
<summary>查看原文（18行）</summary>

```text
/** 清理跨平台文件名，并为缺少标题的会话生成时间兜底。 */
export function createDownloadFilename(extension: 'png' | 'md' | 'html' | 'zip', title?: string, page?: number, now = new Date()): string {
  const clean = (title ?? '').normalize('NFC')
    .replace(/[<>:"/\\|?*\u0000-\u001f\u007f-\u009f\u202a-\u202e\u2066-\u2069]/g, ' ')
    .replace(/\s+/g, ' ').trim().replace(/^[. ]+|[. ]+$/g, '')
  let safe = ''
  let bytes = 0
  for (const character of clean) {
    const size = new TextEncoder().encode(character).length
    if (bytes + size > 180) break
    safe += character
    bytes += size
  }
  safe = safe.replace(/[. ]+$/g, '')
  const pad = (value: number): string => String(value).padStart(2, '0')
  const fallback = `${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`
  return `dsh-${safe || fallback}${page === undefined ? '' : `-${pad(page)}`}.${extension}`
}
```

</details>

#### 缺口

- 未捕获实际浏览器网络，也未枚举所有消息形态。
  **影响**：外链和媒体处理不能保证没有敏感内容。
  **进一步探讨**：用带合成秘密的选中项、内部地址和不可读图片检查输出文件与请求日志。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 长图、权限或资源失败时，用户能得到哪些替代输出？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

按整组问答分页，4096 CSS 像素是开始下一页的目标，单组可能超高。孤立短页可合并，不按像素切断轮次。PNG 对每页检查面积和边长，按比例从高到低试渲染。一页完全失败会拒绝该次图片结果，运行时保留错误提示，用户可缩小字号、少选或改用文本。画布任务串行，等待队列仅保留最新参数，旧请求不会覆盖预览，但正在渲染的任务无法取消。剪贴板缺权限可改下载，全部分页可打 ZIP，PNG 原始大小合计超过 512 MiB 则拒绝，ZIP 任务可取消。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/pagination.ts:1-10](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/pagination.ts#L1-L10)

分页阈值。

<details>
<summary>查看原文（10行）</summary>

```text
const PAGE_HEIGHT = 4096
const SHORT_PAGE_HEIGHT = 1024

interface SharePages {
  elements: HTMLElement[]
  dispose(): void
}

/** 只在已知的问答边界分组，省略标记随下一轮一起移动。 */
function collectTurnGroups(card: HTMLElement, footer: HTMLElement): HTMLElement[][] {
```

</details>

**依据 2 · 源码核查**：[src/client/pagination.ts:72-104](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/pagination.ts#L72-L104)

整组分页、短页合并及清理。

<details>
<summary>查看原文（33行）</summary>

```text
    let page = newPage()
    for (const group of groups) {
      // 当前页达到目标后才换页；不足目标时继续接纳下一完整问答。
      if (page.groups.length && page.element.getBoundingClientRect().height >= PAGE_HEIGHT) {
        page = newPage()
      }
      if (!page.groups.length) resetPageStart(group)
      page.element.lastElementChild!.before(...group)
      page.groups.push(group)
    }

    for (let index = 0; index < pages.length && pages.length > 1; index++) {
      const current = pages[index]!
      if (current.groups.length !== 1
        || current.element.getBoundingClientRect().height >= SHORT_PAGE_HEIGHT) continue
      // 优先合并后一整页；末尾孤立短组并入前页，保持对话顺序。
      const targetIndex = Math.min(index, pages.length - 2)
      const target = pages[targetIndex]!
      const following = pages[targetIndex + 1]!
      const first = following.groups[0]![0]!
      const style = starts.get(first)
      // 新页首重新成为组间边界时，恢复原分隔线或省略标记的样式。
      if (style == null) first.removeAttribute('style')
      else first.setAttribute('style', style)
      target.element.lastElementChild!.before(...following.groups.flat())
      target.groups.push(...following.groups)
      following.element.remove()
      pages.splice(targetIndex + 1, 1)
    }
    return { elements: pages.map(page => page.element), dispose }
  } catch (error) {
    dispose()
    throw error
```

</details>

**依据 3 · 源码核查**：[src/client/preview-dialog.ts:28-64](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/preview-dialog.ts#L28-L64)

尺寸预算、逐页重试和整体失败。

<details>
<summary>查看原文（37行）</summary>

```text
export async function renderShareImage(element: HTMLElement): Promise<Blob | Blob[]> {
  const options = {
    backgroundColor: shareExportBackground(element),
    imagePlaceholder: TRANSPARENT_IMAGE_PLACEHOLDER,
    skipFonts: true,
    skipAutoScale: true,
  }
  const cards = await createSharePages(element)
  const images: Blob[] = []
  try {
    for (const card of cards.elements) {
      const rect = card.getBoundingClientRect()
      const width = Math.ceil(rect.width)
      const height = Math.ceil(rect.height)
      let blob: Blob | null = null
      let cause: unknown
      for (const pixelRatio of IMAGE_PIXEL_RATIOS) {
        const imageWidth = Math.floor(width * pixelRatio)
        const imageHeight = Math.floor(height * pixelRatio)
        if (!Number.isFinite(imageWidth) || !Number.isFinite(imageHeight)
          || imageWidth < 1 || imageHeight < 1
          || imageWidth > MAX_IMAGE_SIDE || imageHeight > MAX_IMAGE_SIDE
          || imageWidth * imageHeight > MAX_IMAGE_AREA) continue
        try {
          blob = await toBlob(card, { ...options, width, height, pixelRatio })
          if (blob?.size) break
        } catch (error) {
          cause = error
        }
      }
      if (!blob?.size) throw new Error('Could not render a complete image within the export budget', { cause })
      images.push(blob)
    }
    return images.length === 1 ? images[0]! : images
  } finally {
    cards.dispose()
  }
```

</details>

**依据 4 · 源码核查**：[src/client/runtime.ts:591-622](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L591-L622)

旧结果隔离、串行队列与清理。

<details>
<summary>查看原文（32行）</summary>

```text
  const executeRender = async (request: RenderRequest): Promise<void> => {
    const preview = ensureDialog()
    const card = createShareCard(document, request.content, request.locale, request.settings)
    try {
      const blob = await renderImage(card.element)
      if (request.epoch === renderEpoch) {
        await preview.showResult(blob, () => request.epoch === renderEpoch)
      }
    } catch (error) {
      if (request.epoch === renderEpoch) {
        console.warn('[dsh-share] Failed to render conversation image', error)
        preview.showError(request.preservePreview)
      }
    } finally {
      card.dispose()
    }
  }

  /** 图片生成不可取消，因此只允许一个画布任务运行；等待中的请求只保留最新一次。 */
  const drainRenderQueue = async (): Promise<void> => {
    if (renderRunning) return
    renderRunning = true
    try {
      while (pendingRender) {
        const request = pendingRender
        pendingRender = undefined
        await executeRender(request)
      }
    } finally {
      renderRunning = false
      if (pendingRender) void drainRenderQueue()
    }
```

</details>

**依据 5 · 源码核查**：[src/client/preview-dialog.ts:536-596](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/preview-dialog.ts#L536-L596)

剪贴板、当前页下载、可取消 ZIP。

<details>
<summary>查看原文（61行）</summary>

```text
  private async copy(): Promise<void> {
    if (!this.blob) return
    const strings = t(this.options.getLocale())
    const clipboard = this.document.defaultView?.navigator.clipboard
    const ClipboardItemConstructor = this.document.defaultView?.ClipboardItem
    if (!clipboard?.write || !ClipboardItemConstructor) {
      this.status.textContent = strings.copyUnsupported
      return
    }

    try {
      await clipboard.write([new ClipboardItemConstructor({ 'image/png': this.blob })])
      this.status.textContent = strings.copied
    } catch (error) {
      console.warn('[dsh-share] Failed to copy image', error)
      this.status.textContent = strings.copyFailed
    }
  }

  private download(): void {
    if (!this.objectUrl) return
    const anchor = this.document.createElement('a')
    anchor.href = this.objectUrl
    anchor.download = createDownloadFilename('png', this.options.getConversationTitle?.(), this.pages.length > 1 ? this.pageIndex + 1 : undefined)
    anchor.click()
  }

  private cancelArchive(): void {
    this.archiveJob?.abort()
    this.archiveJob = undefined
  }

  /** 一次保存全部分页，避免多次自动下载被宿主丢弃。 */
  private async downloadAll(): Promise<void> {
    if (this.downloadAllButton.disabled || this.pages.length < 2 || this.archiveJob) return
    const job = new AbortController()
    this.archiveJob = job
    const pages = [...this.pages]
    const title = this.options.getConversationTitle?.()
    const now = new Date()
    this.downloadAllButton.disabled = true
    this.status.textContent = t(this.options.getLocale()).zipCreating
    try {
      const blob = await createPagesZip(pages, title, now, job.signal)
      if (job.signal.aborted || !this.element.isConnected) return
      const url = URL.createObjectURL(blob)
      const anchor = this.document.createElement('a')
      anchor.href = url
      anchor.download = createDownloadFilename('zip', title, undefined, now)
      try {
        anchor.click()
      } finally {
        this.document.defaultView?.setTimeout(() => URL.revokeObjectURL(url), 60000)
      }
      this.status.textContent = ''
    } catch {
      if (!job.signal.aborted) this.status.textContent = t(this.options.getLocale()).zipFailed
    } finally {
      if (this.archiveJob === job) {
        this.archiveJob = undefined
        this.downloadAllButton.disabled = this.pages.length < 2 || this.element.ariaBusy === 'true'
```

</details>

**依据 6 · 源码核查**：[src/client/zip.ts:8-34](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/zip.ts#L8-L34)

分块 CRC 和归档预算。

<details>
<summary>查看原文（27行）</summary>

```text
/** 分块校验原图，避免同时读取所有分页到内存。 */
async function crc32(blob: Blob, signal?: AbortSignal): Promise<number> {
  let crc = 0xffffffff
  for (let offset = 0; offset < blob.size; offset += 1024 * 1024) {
    signal?.throwIfAborted()
    const bytes = new Uint8Array(await blob.slice(offset, offset + 1024 * 1024).arrayBuffer())
    for (const byte of bytes) crc = (crc >>> 8) ^ CRC_TABLE[(crc ^ byte) & 255]!
  }
  signal?.throwIfAborted()
  return (crc ^ 0xffffffff) >>> 0
}

/** 以 ZIP Store 保存已压缩的 PNG，保留原始字节、UTF-8 文件名和页序。 */
export async function createPagesZip(pages: readonly Blob[], title?: string, now = new Date(), signal?: AbortSignal): Promise<Blob> {
  // 限制常规 ZIP 的条目数与总大小，同时给浏览器内存留出余量。
  if (!pages.length || pages.length > 10000 || pages.reduce((sum, page) => sum + page.size, 0) > 512 * 1024 * 1024) {
    throw new Error('Archive exceeds export budget')
  }
  const local: BlobPart[] = []
  const central: Uint8Array<ArrayBuffer>[] = []
  const date = ((Math.min(2107, Math.max(1980, now.getFullYear())) - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate()
  const time = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1)
  let offset = 0
  let directorySize = 0
  for (const [index, page] of pages.entries()) {
    const name = new TextEncoder().encode(createDownloadFilename('png', title, index + 1, now))
    const crc = await crc32(page, signal)
```

</details>

**依据 7 · 作者声明**：[README.md:25-28](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/README.md#L25-L28)

作者描述缩放与文本回退。

```text
- 可调整图片宽度和字号，长图支持滚动预览
- 按完整问答顺序分页：当前页不足 4096 CSS 像素时继续加入下一整组，达到或超过目标后再换页。支持翻页预览、复制和下载当前页；“下载全部”一次保存包含所有分页 PNG 的 ZIP，包内图片按页码命名，图片总大小上限为 512 MiB。末尾仅含一组且低于 1024 CSS 像素的短页并入前页，总共只选一组时保留单页。页面允许超过目标高度，不裁切内容
- 默认以 2 倍比例导出；图片过大或生成失败时，会尝试降低到 1 倍或 0.5 倍以保留完整内容。仍无法生成时明确提示失败，可减小字号、减少内容或导出 Markdown
- 可勾选“不展示过程”，只保留提问和最终回答
```

#### 缺口

- 未运行不同浏览器、超长对话和低内存环境。
  **影响**：不能确认耗时、峰值内存或某个浏览器的实际像素极限。
  **进一步探讨**：用同一长问答比较 PNG、HTML、Markdown 的完整性与失败用时。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 在什么条件下试用，失败或退出要付出什么成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

依赖 DSH Web 插槽、消息 DOM 数据标记和浏览器下载或剪贴板。固定包声明 DSH 客户端 peer 范围 ^0.1.7-rc.2 或 ^0.2.0-rc.2，声明范围需与真实宿主分别验证。先在可移除的 Web profile 选一段合成对话并导出，逐页核对选中轮次、过程状态和资源缺失。合格任务是得到可打开的附件，完整保存所选组和省略标记，并经过敏感字段人工核对。首次成本是安装、重启和兼容检查，持续成本是加载早期轮次、浏览器渲染或资源读取以及人工审阅。失败恢复成本是缩小范围、改导出格式并重新检查，或者退回原生复制。停用会移除插槽并释放运行时、观察器和预览，浏览器偏好和已复制、下载或转发的副本需另行处理。金额、人工分钟和浏览器内存未测。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:56-81](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/package.json#L56-L81)

Web 声明与客户端依赖。

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
  "peerDependencies": {
    "react-dom": "^18.2.0",
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/dsh-client-locale": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-store": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-chat": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-conversation": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "^0.1.7-rc.2 || ^0.2.0-rc.2",
    "react": "^18.2.0"
  },
```

</details>

**依据 2 · 作者声明**：[README.md:32-45](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/README.md#L32-L45)

作者给出的安装重启方法。

<details>
<summary>查看原文（14行）</summary>

````text
## 快速安装

使用 DSH CLI 把插件加入 Web Profile，然后重启 `dsh web`：

```sh
dsh plugin --profile web add dsh-share
```

## 其他安装方式

安装指定的 GitHub 版本：

```sh
dsh plugin --profile web add github:hellodigua/dsh-share#vX.Y.Z
````

</details>

**依据 3 · 作者声明**：[README.md:77-85](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/README.md#L77-L85)

兼容基线、浏览器权限和加载边界。

```text
## 兼容性

开发基线为 `@deepseek-ai/dsh 0.2.0-rc.2`，运行时依赖范围为 `^0.1.7-rc.2 || ^0.2.0-rc.2`。分享入口使用官方 `conversation.chat.assistant-actions` 和 `conversation.session.header.utilities` 插槽，不扫描或修改按钮栏 DOM。多选模式通过 `data-chat-flow-kind` 等稳定的 `data-*` 属性添加选择框，不依赖 CSS Module 生成的类名；DSH 调整对话结构后可能需要同步适配。

## 已知限制

- 复制图片需要浏览器授予剪贴板权限，权限不足时仍可下载图片。
- 无法读取的远程资源会以透明占位跳过。
- 只能选择页面已经加载的完整问答；需要更早内容时，请先向上滚动加载。
```

**依据 4 · 源码核查**：[src/client/runtime.ts:284-309](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L284-L309)

移除 DOM 标记、事件与观察器。

<details>
<summary>查看原文（26行）</summary>

```text
  const cleanupSelectionDom = (controller: SessionSelection): void => {
    const scroll = controller.scroll
    const scrollTop = scroll?.scrollTop
    controller.observer?.disconnect()
    controller.observer = undefined
    controller.resizeObserver?.disconnect()
    controller.resizeObserver = undefined
    controller.downloadFormat?.dispose()
    controller.downloadFormat = undefined
    controller.footer?.remove()
    controller.footer = undefined
    if (scroll) {
      if (controller.contentClickHandler) {
        scroll.removeEventListener('click', controller.contentClickHandler)
      }
      controller.contentClickHandler = undefined
      for (const region of scroll.querySelectorAll('[data-dsh-share-select-region]')) region.remove()
      for (const button of scroll.querySelectorAll('[data-dsh-share-turn-select]')) button.remove()
      for (const content of scroll.querySelectorAll<HTMLElement>('[data-dsh-share-select-content]')) {
        delete content.dataset.dshShareSelectContent
        delete content.dataset.dshShareSelectTurnId
      }
      for (const anchor of scroll.querySelectorAll<HTMLElement>('[data-dsh-share-select-anchor]')) {
        delete anchor.dataset.dshShareSelectAnchor
      }
      for (const root of scroll.querySelectorAll<HTMLElement>('[data-dsh-share-select-range-root]')) {
```

</details>

**依据 5 · 源码核查**：[src/client/runtime.ts:775-794](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L775-L794)

运行时销毁、清空选中和移除预览。

<details>
<summary>查看原文（20行）</summary>

```text
    dispose: () => {
      if (disposed) return
      disposed = true
      activeContent = undefined
      activeGroupCount = 0
      invalidateRenderQueue()
      for (const controller of selections.values()) {
        cleanupSelectionDom(controller)
        controller.listeners.clear()
        controller.available.clear()
        controller.selected.clear()
        controller.snapshots.clear()
      }
      selections.clear()
      unsubscribeLocale?.()
      unsubscribeLocale = undefined
      style.remove()
      dialog?.destroy()
      dialog = undefined
    },
```

</details>

**依据 6 · 源码核查**：[src/client/settings.ts:54-62](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/settings.ts#L54-L62)

偏好写入浏览器持久存储。

```text
export function saveShareSettings(storage: Storage | undefined, settings: ShareSettings): void {
  if (!storage) return
  try {
    storage.setItem(WIDTH_STORAGE_KEY, settings.width)
    storage.setItem(FONT_SIZE_STORAGE_KEY, settings.fontSize)
    storage.setItem(HIDE_PROCESS_STORAGE_KEY, String(settings.hideProcess))
  } catch {
    // localStorage 可能被浏览器策略禁用；设置仍在当前弹窗内有效。
  }
```

**依据 7 · 源码核查**：[src/client/index.ts:102-129](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/index.ts#L102-L129)

注销两个入口并释放运行时。

<details>
<summary>查看原文（28行）</summary>

```text
  const cleanup = (disposeRegistration: () => void): (() => void) => {
    registrations += 1
    return () => {
      disposeRegistration()
      registrations -= 1
      if (registrations === 0) {
        sharedRuntime?.dispose()
        sharedRuntime = undefined
      }
    }
  }
  ctx.slots.inject('conversation.chat.assistant-actions', () => {
    const disposeRegistration = ctx.slots.register({
      name: 'conversation.chat.assistant-actions',
      id: 'share',
      order: 20,
      inject: injectFace,
    }, ShareAction)
    return cleanup(disposeRegistration)
  })
  ctx.slots.inject('conversation.session.header.utilities', () => {
    const disposeRegistration = ctx.slots.register({
      name: 'conversation.session.header.utilities',
      id: 'share-conversation',
      order: -10,
      inject: injectFace,
    }, ShareConversationAction)
    return cleanup(disposeRegistration)
```

</details>

#### 缺口

- 未验收固定宿主、发行包和实际移除。
  **影响**：无法量化合格任务成本或宿主升级后可用性。
  **进一步探讨**：对照配置安装前、导出后和停用重启后的 DOM 与浏览器状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 导出前展示实际内容清单是否值得做？

**研究主题**：新假设与验证

#### 完整回答

候选是在导出前逐组预览并标记过程、外链、图片请求及敏感词提醒，允许只保留需要的组和图。和当前选择模式及手动复制对照，以同一组带不连续选择、虚构令牌和损坏图片的任务，人工标注必须保留和必须排除的项目。记录首次合格附件耗时、泄漏数、误删数和重做次数。若仅增加审查时间而未减少漏看，或删除必要的上下文使附件不可读，应推翻假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/content.ts:23-34](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/content.ts#L23-L34)

已有顺序与省略事实可用作清单基础。

<details>
<summary>查看原文（12行）</summary>

```text
/** 始终按会话顺序输出；一轮问答拆成连续的用户与回答消息供渲染器使用。 */
export function selectedTurnsToShareMessages(selected: Iterable<SelectedTurn>): ShareMessage[] {
  const ordered = [...selected].sort((left, right) => left.turn - right.turn)
  return ordered.flatMap((item, index) => {
    const previous = ordered[index - 1]
    const messages = turnToShareMessages(item.content, item.turn)
    messages[0]!.omittedBefore = previous === undefined
      ? 0
      : Math.max(0, item.turn - previous.turn - 1)
    return messages
  })
}
```

</details>

**依据 2 · 源码核查**：[src/client/html.ts:49-76](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/html.ts#L49-L76)

选择快照和资源读取是两个独立阶段。

<details>
<summary>查看原文（28行）</summary>

```text
  // 在异步资源读取前固定选择内容，避免宿主更新改变导出结果。
  const snapshots = messages.map(message => ({
    role: message.role,
    omittedBefore: message.omittedBefore,
    elements: (message.role === 'assistant'
      ? visibleAssistantElements(message.elements, settings.hideProcess) : message.elements)
      .map(element => cloneShareMessage(element, locale, message.role === 'assistant' && settings.hideProcess)),
  }))
  let missingImages = 0
  let totalBytes = 0
  let imageCount = 0
  const deadline = Date.now() + 30000
  const cache = new Map<string, { data: string, size: number }>()

  /** 限时限量读取栅格图片，不携带跨站认证信息或保留资源地址。 */
  async function embedImage(source: Element): Promise<Node> {
    const image = output.createElement('img')
    image.alt = source.getAttribute('alt') ?? ''
    try {
      const raw = source.getAttribute('src') ?? ''
      const url = new URL(raw, document.baseURI)
      if (!raw || !['http:', 'https:', 'blob:', 'data:', 'dsh-app:'].includes(url.protocol)) throw new Error('Unsupported image')
      if (url.username || url.password || ++imageCount > 100) throw new Error('Image budget exceeded')
      let cached = cache.get(url.href)
      if (!cached) {
        const remaining = deadline - Date.now()
        if (remaining <= 0) throw new Error('Image deadline exceeded')
        const response = await fetch(url.href, { credentials: 'omit', referrerPolicy: 'no-referrer', redirect: 'error', signal: AbortSignal.timeout(Math.min(10000, remaining)) })
```

</details>

**依据 3 · 源码核查**：[src/client/runtime.ts:539-564](https://github.com/hellodigua/dsh-share/blob/b5212ef748ac56aeb4d56c6f8a86be836921114f/src/client/runtime.ts#L539-L564)

导出触发点及现有状态反馈。

<details>
<summary>查看原文（26行）</summary>

```text
    download.addEventListener('click', async () => {
      if (download.dataset.busy === 'true') return
      const messages = selectedTurnsToShareMessages(controller.selected.values())
      if (!messages.length) return
      const locale = currentLocale()
      const title = controller.title
      if (format === 'markdown') {
        downloadMarkdownFile(document, createShareMarkdown(messages, locale, ensureDialog().settings), title)
        htmlStatus.textContent = ''
        return
      }
      download.dataset.busy = 'true'
      download.disabled = true
      controller.downloadFormat?.update(locale, true)
      htmlStatus.textContent = t(locale).htmlExporting
      try {
        const result = await createShareHtml(document, messages, locale, ensureDialog().settings)
        if (!footer.isConnected) return
        downloadHtmlFile(document, result.html, title)
        htmlStatus.textContent = result.missingImages ? t(currentLocale()).htmlMissingImages : ''
      } catch {
        if (footer.isConnected) htmlStatus.textContent = t(currentLocale()).htmlExportFailed
      } finally {
        delete download.dataset.busy
        download.disabled = controller.selected.size === 0
        if (controller.footer === footer) controller.downloadFormat?.update(currentLocale(), download.disabled)
```

</details>

#### 缺口

- 未实现清单和执行对照。
  **影响**：不能把假设计为现有隐私能力。
  **进一步探讨**：在同浏览器按交叉顺序检查三种流程的输出和复核成本。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
