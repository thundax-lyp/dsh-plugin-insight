# DSH Sidenote

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[765d22e](https://github.com/g-yixuan/dsh-sidenote/tree/765d22e021c69fcea062ae2470da06b502e53228)

<!-- BEGIN META -->
[![GitHub ★ 42](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=42&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/g-yixuan/dsh-sidenote) [![npm 30d 6,840](https://img.shields.io/static/v1?label=npm+30d&message=6%2C840&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidenote) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidenote)
<!-- END META -->

> **功能**：在 DSH Web 划选批注、打开侧边会话并把选定问答带回主线。

> **亮点**：把支线继承、原文批注和选择性回流接进同一评审流程，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：侧聊有仅快照退路，等待提交失败也需回查宿主消息，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

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
  - [Q01 · 在评审中追问细节时，侧聊比复制到新会话多做什么？](#detail-section-11)
  - [Q02 · 批注与原草稿怎样一起送进主线，失败能保留什么？](#detail-section-12)
  - [Q03 · 宿主版本和数据流如何影响采用？](#detail-section-13)
  - [Q04 · 怎样用一次可回退的评审判断价值？](#detail-section-14)
  - [Q05 · 显示支线切点与发出内容能否减少错引？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合需要在 DSH 评审长方案时局部追问并把结论带回主线的人，见 [Q01](#research-q01)。

另开会话只复制必要片段，并把审阅后结论手工带回。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 侧聊 | 在独立会话追问 | 首轮可退快照 |
| 批注和回流 | 把选定内容送入主线 | 等待期间改稿会阻止提交 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明版本的 DSH 与 Node | 必需 | 挂载 Web 面与会话能力 | 分支或设置不可用 |
| 宿主投影与 Web 服务 | 对应路径所需 | 提供会话与回流 | 部分功能改随正文提交 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制脱敏会话 | 有明确引用和基线 |
| 操作 | 追问一个局部问题并带回 | 核对引文和提交 |
| 退出 | 失败后查宿主再手工回流 | 不盲重送 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主环境 | 核对兼容与上下文 | 时间未知 |
| 持续 | 模型和会话存储 | 检查切点与引用 | 未测缓存和总费用 |
| 恢复 | 可能重跑对话 | 回查草稿、附件和宿主 | 重复消息需核对 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 侧聊 | fork 与仅快照降级 | 真实切点 |
| 引用 | 同次提交与失败清理 | 真实异常恢复 |

> **思考**：侧聊有仅快照退路，等待提交失败也需回查宿主消息，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把支线继承、原文批注和选择性回流接进同一评审流程，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

同次发送配合草稿版本比较，保护准备期间的编辑，异常后仍要检查宿主消息，见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

侧聊有仅快照退路，等待提交失败也需回查宿主消息，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在独立 profile 先做一次脱敏引文的局部评审，检查最后正文及引用后再扩大，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持挂载、分支和同次提交。宿主切点与输入异常状态待验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/sidechat/lifecycle.ts、src/client/annotations/send.ts、package.json、src/client/index.tsx、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对双面挂载、分支、批注提交及回流；未运行目标包和宿主。
- 下一步：在三种主线状态核对侧聊边界，比较正常回流及等待期间改稿。

**分析版本**

- **仓库**：[g-yixuan/dsh-sidenote](https://github.com/g-yixuan/dsh-sidenote)
- **版本号**：0.8.5（[固定提交 765d22e](https://github.com/g-yixuan/dsh-sidenote/tree/765d22e021c69fcea062ae2470da06b502e53228)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

显示实际继承边界与最终回流内容，比较能否减少错引，见 [Q05](#research-q05)。

在三种主线状态核对侧聊边界，比较正常回流及等待期间改稿。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1282 | — | — | 26898 |
| .ts | source | 55 | 6725 | 5034 | 1182 | — |
| .mjs | source | 8 | 1037 | 835 | 157 | — |
| .tsx | source | 24 | 2814 | 2437 | 247 | — |
| .tsx | test | 8 | 1010 | 915 | 23 | — |
| .ts | test | 56 | 8594 | 7726 | 326 | — |
| .mjs | test | 4 | 238 | 215 | 17 | — |
| .js | example | 2 | 38 | 36 | 2 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/g-yixuan/dsh-sidenote/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对侧聊继承与回流写入边界，判断它何时能让评审更易追溯。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在评审中追问细节时，侧聊比复制到新会话多做什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合边读 DSH 长方案边验证多个局部问题的人。正常会话以宿主 fork 继承边界前历史，侧聊暂不进入主列表，随后可以选择把问答带回主线。直接复制到新会话更容易限制传入信息，但要手工补背景。主线忙时会尝试按可用切点 fork，如果首轮无可分叉内容则创建新会话并标记仅快照，故不能用侧栏出现推断一定继承全部历史。合格结果是支线只承载指定问题，主会话只接收经选择的结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-56](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/README.md#L42-L56)

作者说明局部追问、引用与回流。

<details>
<summary>查看原文（15行）</summary>

```text
## 一个任务，容得下更多思路

### 有疑问，在旁边聊透

评审方案时想追问一个细节，读代码时想弄清一种实现，都可以从当前对话开一个侧聊。**完整历史随 fork 保留**，不用再交代一遍背景。

### 有想法，直接落在原文上

划选主对话或侧聊中的一段回复，写下问题或修改意见。**原文和注释一起保留**，可累积多条，发送前预览、移除，正文草稿照常编辑。

读到「提示“未找到”，并给出放宽条件建议」，就选中这一句，追问「给一版可直接使用的空状态」。

### 有结论，带回正在做的事

点击侧聊回答操作栏右侧的「带回主对话」图标，**问题与回答成对带回**，出现在主输入框上方，随下一条消息送入主线。也可以整段回流，或将值得保留的侧聊保存为正式会话。
```

</details>

**依据 2 · 源码核查**：[src/client/sidechat/lifecycle.ts:81-118](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/sidechat/lifecycle.ts#L81-L118)

宿主 fork、仅快照降级和隐藏子会话。

<details>
<summary>查看原文（38行）</summary>

```text
export async function forkAndRegister(ctx: Context, parentSessionId: string, tabId: string, signal?: AbortSignal): Promise<string> {
  if (signal?.aborted === true) throw new DOMException('side chat fork aborted', 'AbortError')
  const compactionCut = unfinishedCompactionCut(ctx.sessions.binding(parentSessionId)?.session)
  const busy = sessionBusyOf(ctx, parentSessionId) || compactionCut !== undefined
  let boundarySeq: number | undefined
  // The slot-provided context a panel receives has a narrower inject list than the
  // plugin root context, so host calls go through the root context (see native.ts).
  const owner = rootContext(ctx)

  let forked: string
  let snapshotOnly = false
  const visibility = sessionVisibilityOf(owner)
  const finishVisibility = visibility.begin(owner.sessions.list.getSnapshot())
  try {
    if (!busy) {
      forked = await ctx.sessions.fork({ sessionId: parentSessionId })
    } else {
      try {
        forked = await ctx.sessions.fork({ sessionId: parentSessionId, ...(compactionCut === undefined ? {} : { atSeq: compactionCut }) })
      } catch (error) {
        if (!isForkUnavailable(error)) throw error
        forked = await createSideSession(owner, parentSessionId)
        snapshotOnly = true
      }
    }
    // Register identity before releasing provisional new rows, including create fallback.
    visibility.hide(forked)
    // The host's default cut also includes standalone compactions after turn/end.
    // Read the resulting child marker; neither parent message seqs nor a cached
    // turn/end can establish this boundary without a race.
    const reference = retainSession(ctx, forked)
    try {
      await reference?.ready
      const binding = reference?.binding ?? ctx.sessions.binding(forked)
      await openSessionWindow(binding?.session)
      boundarySeq = inheritedBoundarySource(binding?.session)?.getSnapshot()
      if (binding && !snapshotOnly) await clearForkQueue(binding)
    } finally { reference?.release() }
```

</details>

#### 缺口

- 运行中切点包含的上下文还未与真实宿主消息核对
  **影响**：支线可能缺理解当前问题的背景
  **进一步探讨**：分别从空、忙、已完成主线分支，并检查实际继承边界

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 批注与原草稿怎样一起送进主线，失败能保留什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

批注被序列化为协议块，回流和首发上下文作为前导块，随正文用同一次宿主提交。准备时快照草稿及附件，等待后变更则报错保留，避免把已过期引用塞进新草稿。代码先加文本与图片再提交，等 outcome 后标记当时内容未变的批注，成功才清掉回流。异常尝试回滚前缀、卸下自己加入的图片并暴露错误。它减小引用与正文分开发送的竞态，但仍要核查宿主队列反馈，不能把客户端错误直接当未收到。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/annotations/send.ts:23-53](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/annotations/send.ts#L23-L53)

构建协议块与同次提交。

<details>
<summary>查看原文（31行）</summary>

```text
  const { ctx, store, sessionId, input, annotations } = options
  cancelInputRollback(input)
  const parts = [...(options.leadingBlocks ?? [])]
  if (annotations.length > 0) parts.push(buildProtocolBlock(annotations))
  // 拼块瞬间的编号；发送窗口内若发生删除重排，冻结仍沿用这里的编号。
  const wireNumbers = new Map(annotations.map(annotation => [annotation.id, annotation.number] as const))
  const block = parts.join('\n\n')
  if (block === '') return false
  const draftBeforeWait = input.state.getSnapshot()
  const attachmentsBeforeWait = [...inputAttachmentIds(input)]
  let prefix = ''
  let images: Awaited<ReturnType<typeof prepareContextImages>> | undefined
  let staged = false
  let receipt: Awaited<ReturnType<typeof prepareSubmission>> | undefined
  try {
    if (options.contextImages) images = await prepareContextImages(ctx, sessionId, options.contextImages)
    receipt = await prepareSubmission(ctx, sessionId, input, block)
    const draft = input.state.getSnapshot()
    if (draft.draft !== draftBeforeWait.draft || draft.draftRev !== draftBeforeWait.draftRev || JSON.stringify(inputAttachmentIds(input)) !== JSON.stringify(attachmentsBeforeWait)) {
      throw new Error('等待会话就绪期间草稿已改变；正文和注释已保留，请重新发送')
    }
    prefix = block + (draft.draft === '' ? '' : '\n\n')
    if (!prependInputText(input, prefix)) throw new Error('宿主输入尚未就绪，无法安全加入引用；内容已保留')
    if (images) {
      if (!addInputAttachments(input, images.ids)) throw new Error('无法加入主线上下文图片，内容已保留')
      staged = true
    }
    receipt.submit(options.mode)
    await receipt.outcome
    // Edits/new quotes made while admission was in flight remain active. A
    // concurrent delete re-numbers the remaining quotes (new objects, same
```

</details>

**依据 2 · 源码核查**：[src/client/annotations/send.ts:56-74](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/annotations/send.ts#L56-L74)

发送成功标记与错误回滚。

<details>
<summary>查看原文（19行）</summary>

```text
    store.markSent(annotations.filter(annotation => {
      const current = store.get(annotation.id)
      return current !== undefined && current.state === 'active'
        && (current === annotation || (current.note === annotation.note && current.text === annotation.text))
    }).map(annotation => annotation.id), wireNumbers)
    return true
  } catch (error) {
    rollbackInputPrefix(input, prefix, staged ? () => {
      for (const id of images!.ids) removeInputAttachment(input, id)
      images!.release()
    } : undefined)
    if (!staged) images?.release()
    const text = error instanceof Error ? error.message : String(error)
    store.setSubmission(sessionId, { pending: false, error: text })
    // The shared chip already exposes this failure; a cosmetic host notice
    // must not reject the completion promise or lose the retained batch.
    try { if (typeof input.notify === 'function') input.notify('error', text) } catch { /* Shared error remains visible. */ }
    return false
  } finally { receipt?.dispose() }
```

</details>

**依据 3 · 源码核查**：[src/client/annotations/send.ts:78-108](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/annotations/send.ts#L78-L108)

回流、前导块和成功清理。

<details>
<summary>查看原文（31行）</summary>

```text
export async function submitControlledInput(ctx: Context, store: AnnotationStore, reflow: ReflowStore, sessionId: string, mode?: 'queue' | 'steer'): Promise<boolean> {
  if (store.getSubmission(sessionId).pending) return false
  const input = resolveInput(ctx, sessionId)
  if (!input) { store.setSubmission(sessionId, { pending: false, error: t('inputUnavailable') }); return false }
  const draft = input.state.getSnapshot()
  if (draft.phase !== 'plain' || draft.draft.trimStart().startsWith('/')) return false
  const active = store.listActive(sessionId)
  const reflows = reflow.list(sessionId)
  if (draft.draft.trim() === '' && inputAttachmentIds(input).length === 0 && active.length === 0 && reflows.length === 0) return false
  const extras = submissionExtrasOf(sessionId)
  store.setSubmission(sessionId, { pending: true })
  try {
    const prefix = await extras?.firstSendPrefix()
    const current = input.state.getSnapshot()
    if (current.draft !== draft.draft || current.draftRev !== draft.draftRev) throw new Error('加载上下文期间草稿已改变；内容已保留，请重新发送')
    // Context and body must share one host admission and delivery window.
    // An independent inject can run before a queued message or be repeated
    // when its acknowledgement arrives after the client timeout.
    const accepted = await submitAnnotations({ ctx, store, sessionId, input, annotations: active, leadingBlocks: [...(prefix ? [prefix.text] : []), ...reflows.map(buildReflowBlock)], contextImages: prefix?.images, mode })
    if (accepted) {
      for (const item of reflows) reflow.remove(item.id)
      extras?.onSubmitText(draft.draft)
      extras?.onAccepted()
    }
    return accepted
  } catch (error) {
    store.setSubmission(sessionId, { pending: false, error: error instanceof Error ? error.message : String(error) })
    return false
  } finally {
    store.setSubmission(sessionId, { ...store.getSubmission(sessionId), pending: false })
  }
```

</details>

#### 缺口

- 客户端等待失败时真实宿主是否已有消息未实测
  **影响**：盲目重送可能重复引用
  **进一步探讨**：制造等待期间改稿或宿主断开并逐条回查消息

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 宿主版本和数据流如何影响采用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

固定清单声明 Node 20 及 DSH 0.2.2-rc.1 到 0.2.3-0 之前的窗口。客户端需要 sessions、workspaces、slots、connection 等，宿主动态注入会话投影和 Web 服务。缺 Web 服务时不注册该路由，客户端仍可能走随消息发送的路线。侧聊列表隐藏是展示处理，已经 fork 出真实会话。引用及上下文随消息传入模型，不能用隐藏状态推断没有传输或保存。对带敏感内容的主线应先查实际进入支线的上下文。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-37](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/package.json#L8-L37)

版本与双入口。

<details>
<summary>查看原文（30行）</summary>

```text
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
    "./src/*": "./src/*",
    "./package.json": "./package.json"
  },
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.2-rc.1 <0.2.3-0"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-sidebar-right"
      ],
      "platform": "web"
```

</details>

**依据 2 · 源码核查**：[src/client/index.tsx:16-48](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/index.tsx#L16-L48)

客户端服务与实际功能接线。

<details>
<summary>查看原文（33行）</summary>

```text
export const inject = ['sessions', 'workspaces', 'slots', 'connection', 'locale', 'configForms']

export function apply(ctx: Context): void {
  // 侧栏 Tab 的原生面（better-sidebar >= 0.19）与宿主调用都要用插件根 ctx：
  // 面板拿到的是 slot 注入的收缩 ctx（inject 里没有 workspaces），见 native.ts。
  // fiber 撤销即清场（registry/openings/birthOrder 全模块级，重激活不得带病存活）。
  ctx.effect(() => {
    setRootContext(ctx)
    return () => { clearNativeRuntime() }
  }, 'dsh-sidenote: native bridge')
  // 跟随 DSH 通用设置里的语言（locale.preference，Host-backed，实时切换）。
  attachLocale(ctx.locale as LocaleServiceLike | undefined)
  registerCompatibilityStatus(ctx)
  registerSideSessionVisibility(ctx)
  // 撤掉旧页面 meta 的活身份，避免把孤键当仍存活的 tab。宿主真的恢复
  // tab 时，由其 navigation revision 与挂载记录认领原 child。
  sweepOrphanedSideChatMeta()
  // 回流 store 两个模块共享：sidechat 生产（回流按钮），annotate 消费
  // （chip + 发送拦截器序列化）。
  const reflow = createReflowStore()
  const annotations = createAnnotationStore()
  const forms = ctx.get('configForms') as {
    get(namespace: 'side-chat'): SidenoteConfigForm & ReplyDefaultsForm<{ finalRepliesDefaultAttempted?: boolean }>
    get(namespace: 'ui-chat'): ReplyDefaultsForm<{ foldedReplies: 'all' | 'final' }>
  }
  // The host configuration namespace is the entry id in cordis.patch.yml.
  const form = forms.get('side-chat')
  const preferences = createSidenotePreferences(form)
  ctx.effect(() => () => { preferences.dispose() }, 'dsh-sidenote: preferences')
  ctx.effect(() => initializeFinalReplies(form, forms.get('ui-chat')), 'dsh-sidenote: final replies default')
  registerSidenoteSettings(ctx, preferences)
  registerSideChat(ctx, reflow, annotations)
  registerAnnotations(ctx, reflow, annotations, preferences)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:159-187](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/index.ts#L159-L187)

缺动态注入时不挂路由，存在时注册投影与路由。

<details>
<summary>查看原文（29行）</summary>

```text
export function apply(ctx: unknown): void {
  const host = ctx as HostContext
  // webServer 面的获取必须走动态 inject（等服务）：cordis 的 ctx.get 对未在
  // inject 清单里的服务不可达（真机实证：静态 get 探测拿到 undefined，
  // 路由静默不注册）。webServer 在 headless/CLI 形态缺席——inject 回调永不
  // 触发即降级（客户端回落搭车），不阻塞插件装载。
  const injectDyn = (host as { inject?: (deps: string[], cb: (injected: { get(name: string): unknown }) => void | (() => void)) => unknown }).inject
  if (typeof injectDyn !== 'function') {
    console.warn('[dsh-sidenote] 宿主半包：ctx.inject 面缺席，reflow 路由未注册（客户端回落搭车）')
    return
  }
  injectDyn.call(ctx, ['sessionProjections'], (injected) => {
    const registry = injected.get('sessionProjections') as { register(definition: typeof contextProjection): () => void }
    return registry.register(contextProjection)
  })
  injectDyn.call(ctx, ['settings'], (injected) => {
    const settings = injected.get('settings') as { configure(options: { auto: boolean }, owner: unknown): () => void }
    return settings.configure({ auto: false }, host.fiber)
  })
  injectDyn.call(ctx, ['webServer'], (injected) => {
    const webServer = injected.get('webServer') as WebServerLike | undefined
    if (webServer === undefined || typeof webServer.register !== 'function') return
    console.log('[dsh-sidenote] 宿主半包已装载，注册 /sidenote/reflow')
    return webServer.register({
      kind: 'exact',
      path: '/sidenote/reflow',
      handler: makeReflowHandler(host),
    })
  })
```

</details>

**依据 4 · 源码核查**：[src/client/sidechat/lifecycle.ts:91-118](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/sidechat/lifecycle.ts#L91-L118)

实际 fork 与列表隐藏是两步。

<details>
<summary>查看原文（28行）</summary>

```text
  let snapshotOnly = false
  const visibility = sessionVisibilityOf(owner)
  const finishVisibility = visibility.begin(owner.sessions.list.getSnapshot())
  try {
    if (!busy) {
      forked = await ctx.sessions.fork({ sessionId: parentSessionId })
    } else {
      try {
        forked = await ctx.sessions.fork({ sessionId: parentSessionId, ...(compactionCut === undefined ? {} : { atSeq: compactionCut }) })
      } catch (error) {
        if (!isForkUnavailable(error)) throw error
        forked = await createSideSession(owner, parentSessionId)
        snapshotOnly = true
      }
    }
    // Register identity before releasing provisional new rows, including create fallback.
    visibility.hide(forked)
    // The host's default cut also includes standalone compactions after turn/end.
    // Read the resulting child marker; neither parent message seqs nor a cached
    // turn/end can establish this boundary without a race.
    const reference = retainSession(ctx, forked)
    try {
      await reference?.ready
      const binding = reference?.binding ?? ctx.sessions.binding(forked)
      await openSessionWindow(binding?.session)
      boundarySeq = inheritedBoundarySource(binding?.session)?.getSnapshot()
      if (binding && !snapshotOnly) await clearForkQueue(binding)
    } finally { reference?.release() }
```

</details>

#### 缺口

- 不同宿主加载和权限环境中的上下文可见性未验证
  **影响**：不能推断隐藏等于访问隔离
  **进一步探讨**：在无敏感记录的 profile 查分支列表、消息与上下文范围

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样用一次可回退的评审判断价值？

**研究主题**：效果与总成本、采用判断

#### 完整回答

有独立 profile 且常在评审时追问局部理由的人，可从一段脱敏方案选两句，侧聊验证一个细节后只带回一对问答。人工基线是新建会话后复制必要文字再将结论手工贴回。按一次已验收的引文与结论记录时间、模型费用和更正数。作者提到上下文缓存复用，这不保证每次都命中或降低总费用。若 fork 缺关键背景、主线引用不匹配或重复出现，停止回流，人工核对后按普通消息提交。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:68-79](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/README.md#L68-L79)

作者介绍缓存和恢复。

<details>
<summary>查看原文（12行）</summary>

```text
## 用起来顺手的细节

| 你关心的事 | Sidenote 如何处理 |
|---|---|
| 同时探索几个问题 | 右栏可开多个独立侧聊标签，随时切换，也可重开已关闭的原会话。 |
| 之前聊过的内容 | 侧聊继承完整历史，默认折叠，按需展开。 |
| 侧聊的输入开销 | 支持上下文缓存复用，减少缓存命中部分的输入开销。 |
| 熟悉的聊天体验 | 输入框与消息展示对齐原生体验，支持图片、工具卡和面板内审批。 |
| 一次有多处意见 | 多条注释可以一起发送，也能逐条预览和移除。 |
| 发不出去怎么办 | 发送失败保留注释与正文，便于重试。 |
| 刷新后继续 | 保留侧聊问答与上下文分区；侧栏未恢复时，可从 `/side` 重开。 |
| 不想让支线堆满列表 | 侧聊默认不进入会话列表和搜索，保存为正式会话后才列出。 |
```

</details>

**依据 2 · 源码核查**：[src/client/annotations/send.ts:36-51](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/annotations/send.ts#L36-L51)

核对等候期间的草稿与提交。

<details>
<summary>查看原文（16行）</summary>

```text
  let receipt: Awaited<ReturnType<typeof prepareSubmission>> | undefined
  try {
    if (options.contextImages) images = await prepareContextImages(ctx, sessionId, options.contextImages)
    receipt = await prepareSubmission(ctx, sessionId, input, block)
    const draft = input.state.getSnapshot()
    if (draft.draft !== draftBeforeWait.draft || draft.draftRev !== draftBeforeWait.draftRev || JSON.stringify(inputAttachmentIds(input)) !== JSON.stringify(attachmentsBeforeWait)) {
      throw new Error('等待会话就绪期间草稿已改变；正文和注释已保留，请重新发送')
    }
    prefix = block + (draft.draft === '' ? '' : '\n\n')
    if (!prependInputText(input, prefix)) throw new Error('宿主输入尚未就绪，无法安全加入引用；内容已保留')
    if (images) {
      if (!addInputAttachments(input, images.ids)) throw new Error('无法加入主线上下文图片，内容已保留')
      staged = true
    }
    receipt.submit(options.mode)
    await receipt.outcome
```

</details>

**依据 3 · 源码核查**：[src/client/sidechat/lifecycle.ts:95-118](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/sidechat/lifecycle.ts#L95-L118)

创建与复用边界。

<details>
<summary>查看原文（24行）</summary>

```text
    if (!busy) {
      forked = await ctx.sessions.fork({ sessionId: parentSessionId })
    } else {
      try {
        forked = await ctx.sessions.fork({ sessionId: parentSessionId, ...(compactionCut === undefined ? {} : { atSeq: compactionCut }) })
      } catch (error) {
        if (!isForkUnavailable(error)) throw error
        forked = await createSideSession(owner, parentSessionId)
        snapshotOnly = true
      }
    }
    // Register identity before releasing provisional new rows, including create fallback.
    visibility.hide(forked)
    // The host's default cut also includes standalone compactions after turn/end.
    // Read the resulting child marker; neither parent message seqs nor a cached
    // turn/end can establish this boundary without a race.
    const reference = retainSession(ctx, forked)
    try {
      await reference?.ready
      const binding = reference?.binding ?? ctx.sessions.binding(forked)
      await openSessionWindow(binding?.session)
      boundarySeq = inheritedBoundarySource(binding?.session)?.getSnapshot()
      if (binding && !snapshotOnly) await clearForkQueue(binding)
    } finally { reference?.release() }
```

</details>

#### 缺口

- 当前宿主版本的耗时、缓存与合格率无对照
  **影响**：无法量化采用收益
  **进一步探讨**：以相同方案和引文分别走侧聊与手工

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显示支线切点与发出内容能否减少错引？

**研究主题**：新假设与验证

#### 完整回答

可以在支线和回流预览上显示宿主切点或仅快照状态，并把预览中选中的问答与最终发送内容关联。当前底层已有边界和回执，新增的是操作者在发送前看到差异。对照正常 fork、首轮仅快照和准备过程中改稿三种情形，记录用户识别遗漏和错引次数。若现有提示足够或额外展示让正常评审更慢而无准确性提升，就不推广。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/sidechat/lifecycle.ts:95-117](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/sidechat/lifecycle.ts#L95-L117)

源码有不同继承分支和实际切点。

<details>
<summary>查看原文（23行）</summary>

```text
    if (!busy) {
      forked = await ctx.sessions.fork({ sessionId: parentSessionId })
    } else {
      try {
        forked = await ctx.sessions.fork({ sessionId: parentSessionId, ...(compactionCut === undefined ? {} : { atSeq: compactionCut }) })
      } catch (error) {
        if (!isForkUnavailable(error)) throw error
        forked = await createSideSession(owner, parentSessionId)
        snapshotOnly = true
      }
    }
    // Register identity before releasing provisional new rows, including create fallback.
    visibility.hide(forked)
    // The host's default cut also includes standalone compactions after turn/end.
    // Read the resulting child marker; neither parent message seqs nor a cached
    // turn/end can establish this boundary without a race.
    const reference = retainSession(ctx, forked)
    try {
      await reference?.ready
      const binding = reference?.binding ?? ctx.sessions.binding(forked)
      await openSessionWindow(binding?.session)
      boundarySeq = inheritedBoundarySource(binding?.session)?.getSnapshot()
      if (binding && !snapshotOnly) await clearForkQueue(binding)
```

</details>

**依据 2 · 源码核查**：[src/client/annotations/send.ts:36-60](https://github.com/g-yixuan/dsh-sidenote/blob/765d22e021c69fcea062ae2470da06b502e53228/src/client/annotations/send.ts#L36-L60)

准备到完成已区分发送边界。

<details>
<summary>查看原文（25行）</summary>

```text
  let receipt: Awaited<ReturnType<typeof prepareSubmission>> | undefined
  try {
    if (options.contextImages) images = await prepareContextImages(ctx, sessionId, options.contextImages)
    receipt = await prepareSubmission(ctx, sessionId, input, block)
    const draft = input.state.getSnapshot()
    if (draft.draft !== draftBeforeWait.draft || draft.draftRev !== draftBeforeWait.draftRev || JSON.stringify(inputAttachmentIds(input)) !== JSON.stringify(attachmentsBeforeWait)) {
      throw new Error('等待会话就绪期间草稿已改变；正文和注释已保留，请重新发送')
    }
    prefix = block + (draft.draft === '' ? '' : '\n\n')
    if (!prependInputText(input, prefix)) throw new Error('宿主输入尚未就绪，无法安全加入引用；内容已保留')
    if (images) {
      if (!addInputAttachments(input, images.ids)) throw new Error('无法加入主线上下文图片，内容已保留')
      staged = true
    }
    receipt.submit(options.mode)
    await receipt.outcome
    // Edits/new quotes made while admission was in flight remain active. A
    // concurrent delete re-numbers the remaining quotes (new objects, same
    // content) and is NOT an edit, so identity alone must not decide this:
    // the number frozen below is the one written into the message.
    store.markSent(annotations.filter(annotation => {
      const current = store.get(annotation.id)
      return current !== undefined && current.state === 'active'
        && (current === annotation || (current.note === annotation.note && current.text === annotation.text))
    }).map(annotation => annotation.id), wireNumbers)
```

</details>

#### 缺口

- 能否稳定展示准确宿主切点未验证
  **影响**：错误提示可能扩大误判
  **进一步探讨**：先核切点与真实继承序列，再测对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
