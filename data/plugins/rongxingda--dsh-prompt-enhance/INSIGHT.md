# DSH 提示词增强

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5e6f695](https://github.com/rongxingda/dsh-prompt-enhance/tree/5e6f69549f648fa52455c2b6a5692fd9a6b8af91)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/rongxingda/dsh-prompt-enhance) [![npm 30d 9,815](https://img.shields.io/static/v1?label=npm+30d&message=9%2C815&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt-enhance) [![最新发布 2026-11-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-prompt-enhance)
<!-- END META -->

> **功能**：在 DSH 草稿编辑器中调用宿主模型改写提示词，支持对比预览、填回和撤销。

> **亮点**：把模型改写接到当前 DSH 草稿，用户可以审阅、选择填回并立即撤销。见 [Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：过时结果仍可手工填回，用户需要核对最新草稿。上下文感知还可能把近期会话文本送给所选模型。见 [Q01](#research-q01)、[Q02](#research-q02)。

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
  - [Q01 · 增强草稿后用户何时失去当前编辑内容？](#detail-section-11)
  - [Q02 · 模型能看到哪些内容，失败怎样处理？](#detail-section-12)
  - [Q03 · HTTP 和命令入口能否共用限流与取消保证？](#detail-section-13)
  - [Q04 · 何时值得在现有编辑流程试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已在 DSH 中起草任务、需要整理输入并确认原约束的用户，可以从当前编辑器预览改写。见 [Q01](#research-q01)。

手工改写能保留直接控制，复制给其他会话也能生成改写。插件把原稿、结果和撤销留在原编辑器。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 草稿增强 | 在输入框旁预览模型改写 | 依赖宿主模型及人工审阅 |
| 填回与撤销 | 确认后替换并可立即恢复 | 后续编辑会使撤销失效 |
| 会话上下文 | 按条件使用近期对话 | 可关闭，启用时会随请求发送 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web、编辑器插槽 | GUI 功能需要 | 注册按钮和撤销栏 | 核宿主及入口兼容 |
| 已配置宿主 LLM 路由 | 改写需要 | 生成新稿 | 报缺少模型或路由 |
| 可访问的近期会话 | 上下文模式可用时 | 补充指代及任务信息 | 回退为单稿增强 |
| 用户审阅 | 填回需要 | 确认原约束未丢失 | 保留草稿并放弃输出 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户设明确模型，按需关上下文 | 知道哪些文本会送模型 |
| 请求 | 用无敏感内容的短稿触发增强 | 原稿保持，预览可读 |
| 核对 | 比较每项原约束，再决定填回 | 过时结果先核当前稿 |
| 退出 | 关闭预览或立即撤销 | 原稿内容正确且无意外发送 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试模型调用 | 配模型与上下文 | 接入时间未测 |
| 持续 | 每次改写的模型 token 与延迟 | 核事实和约束 | 净节省未知 |
| 恢复 | 重试可能再消耗模型 | 放弃结果或核原稿 | 取消后费用未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 原稿保护 | 预览与填回分开，立即撤销 | 多窗口、刷新及宿主行为 |
| 内容质量 | 使用宿主模型和可选历史 | 约束完整性与节省时间 |
| 限制与取消 | HTTP 并发和 AbortSignal | 提供方实际中止及费用 |

以保留全部关键约束的一次改写计量。

> **思考**：过时结果仍可手工填回，用户需要核对最新草稿。上下文感知还可能把近期会话文本送给所选模型。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把模型改写接到当前 DSH 草稿，用户可以审阅、选择填回并立即撤销。见 [Q01](#research-q01)、[Q02](#research-q02)。

宿主和客户端边界明确，流式输出与最终结果分开。撤销仅在草稿匹配时生效，HTTP 与命令的限流范围不同。

<a id="detail-section-5"></a>

### 1.4 主要限制

过时结果仍可手工填回，用户需要核对最新草稿。上下文感知还可能把近期会话文本送给所选模型。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可用一个不含敏感信息的短草稿试用。输出漏约束、引用旧稿或编造环境时放弃填回，回原稿手动改。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持预览、填回、撤销和宿主增强。约束保留、费用和真实宿主兼容仍未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、lib/index.js、src/client/index.tsx、src/client/EnhanceButton.tsx、src/client/UndoBar.tsx、src/enhancer.ts、src/orchestrate.ts、src/context.ts、src/loopback.ts、src/enhance-routes.ts、src/enhance-command.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核固定源码的 GUI、路由、模型与历史上下文、命令和失败路径。未运行插件或宿主，未衡量模型费用和改写质量。
- 下一步：用含否定约束的短样本核请求、预览、过时、填回和撤销，再测取消及发送给模型的实际内容。

**分析版本**

- **仓库**：[rongxingda/dsh-prompt-enhance](https://github.com/rongxingda/dsh-prompt-enhance)
- **版本号**：0.3.4（[固定提交 5e6f695](https://github.com/rongxingda/dsh-prompt-enhance/tree/5e6f69549f648fa52455c2b6a5692fd9a6b8af91)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可在预览中添加约束保留检查，对照是否减少漏项与人工修订。若无改善，则用原稿手工调整。见 [Q04](#research-q04)。

用含否定约束的短样本核请求、预览、过时、填回和撤销，再测取消及发送给模型的实际内容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 1508 | — | — | 27992 |
| .js | source | 2 | 2609 | 2508 | 108 | — |
| .mjs | source | 1 | 71 | 45 | 21 | — |
| .ts | source | 25 | 4084 | 2339 | 1514 | — |
| .tsx | source | 4 | 721 | 467 | 211 | — |
| .ts | test | 22 | 3115 | 2402 | 419 | — |
| .tsx | test | 2 | 462 | 334 | 79 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/rongxingda/dsh-prompt-enhance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 草稿增强能否在保留原稿和人工决定的前提下，减少结构化提示词的编辑工作？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 增强草稿后用户何时失去当前编辑内容？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适用任务是在 DSH 里把零散但有明确约束的草稿整理成一条提示词。相对复制给另一个聊天或手工改写，插件把请求、比较和填回放在原编辑器内。客户端进入增强前检查空白、长度、仅附件、已有引用占位和编辑状态，保存请求开始时的草稿，随后显示进度或结果。模型返回不会自动填回，也不会发送任务。结果来自旧草稿时标注过时，用户仍可主动选择填回。填回前保存当下草稿，而不是请求开始时的副本，所以请求期间的编辑也能用撤销恢复。若填回后又继续编辑，撤销栏失效，避免把更新覆盖。这适合作为短时人工确认，并不构成长期原稿备份。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:116-139](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/client/index.tsx#L116-L139)

编辑器和撤销槽注册。

<details>
<summary>查看原文（24行）</summary>

```text
    if (slots === undefined) return
    return slots.inject('conversation.input.right', () => {
      try {
        return slots.register(
          { name: 'conversation.input.right', id: 'prompt-enhance', order: 60, locale: NS },
          EnhanceButton as unknown as never,
        )
      } catch (error) {
        return report('composer enhance button slot', error)
      }
    })
  })

  ctx.inject(['slots'], (slotsCtx: ClientContext) => {
    const slots = (slotsCtx as unknown as { slots?: SlotsFace }).slots
    if (slots === undefined) return
    return slots.inject('conversation.input.dock', () => {
      try {
        return slots.register(
          { name: 'conversation.input.dock', id: 'prompt-enhance-undo', order: 90, locale: NS },
          UndoBar as unknown as never,
        )
      } catch (error) {
        return report('undo bar slot', error)
```

</details>

**依据 2 · 源码核查**：[src/client/EnhanceButton.tsx:94-142](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/client/EnhanceButton.tsx#L94-L142)

前置校验、原稿和网络请求。

<details>
<summary>查看原文（49行）</summary>

```text
    if (anyBusy) return
    if (!settings.enabled) {
      const disabled = t('error.disabled')
      ui.openError(uiKey, draft, { code: 'rejected', localized: disabled })
      return
    }
    if (attachmentCount > 0 && draft.trim() === '') {
      const attachmentsOnly = t('error.attachmentsOnly')
      ui.openError(uiKey, draft, { code: 'rejected', localized: attachmentsOnly })
      return
    }
    const check = checkInputText(draft, settings.maxInputChars)
    if (!check.ok) {
      const message = check.code === 'empty'
        ? t('error.empty')
        : t('error.tooLong', { count: check.count, max: check.max })
      ui.openError(uiKey, draft, { code: 'rejected', localized: message })
      return
    }
    if (occurrenceCount > 0) {
      const occurrences = t('error.occurrences')
      ui.openError(uiKey, draft, { code: 'rejected', localized: occurrences })
      return
    }
    if (phase !== 'plain') {
      const busyPhase = t('error.phase')
      ui.openError(uiKey, draft, { code: 'rejected', localized: busyPhase })
      return
    }
    const controller = new AbortController()
    ui.openLoading({ sessionId: uiKey, original: draft, abort: () => controller.abort() })
    const settle = (result: Parameters<typeof ui.settleResult>[1]): void => ui.settleResult(uiKey, result)
    const fail = (error: unknown): void => {
      const detail: EnhanceError = error instanceof EnhanceClientError
        ? error.detail
        : { code: 'internal', message: error instanceof Error ? error.message : String(error) }
      ui.settleError(uiKey, detail)
    }
    // Progressive display when enabled: the panel fills in as the model
    // writes, and degrades to the one-shot call on its own when the host or
    // the transport cannot stream.
    if (settings.streaming) {
      requestEnhanceStream({ sessionId: wireId, text: draft }, {
        signal: controller.signal,
        onDelta: (delta: string): void => ui.appendDelta(uiKey, delta),
      }).then(settle, fail)
      return
    }
    requestEnhance({ sessionId: wireId, text: draft }, controller.signal).then(settle, fail)
```

</details>

**依据 3 · 源码核查**：[src/client/EnhanceButton.tsx:160-177](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/client/EnhanceButton.tsx#L160-L177)

过时标记与保存填回前草稿。

<details>
<summary>查看原文（18行）</summary>

```text
  // Draft changed after the request started → flag (or clear) the result
  // panel's stale marker so the user knows the result is based on the
  // pre-enhance text.
  useEffect(() => {
    if (panel !== undefined && panel.sessionId === uiKey && panel.phase === 'result') {
      ui.setStale(uiKey, draft !== panel.original)
    }
  }, [draft, panel, uiKey])

  /** Apply the enhanced result: remember the CURRENT draft (pre-apply, so
   * undo restores exactly this state even if the user typed during the
   * request), then fill the enhanced text back. */
  const apply = useCallback((): void => {
    if (panel === undefined || panel.phase !== 'result' || panel.result === undefined) return
    ui.pushUndo(uiKey, { original: draft, applied: panel.result.text })
    inputActions.setDraft(panel.result.text)
    ui.closePanel()
  }, [draft, inputActions, panel, uiKey])
```

</details>

**依据 4 · 源码核查**：[src/client/UndoBar.tsx:32-48](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/client/UndoBar.tsx#L32-L48)

仅在稿仍匹配时显示撤销。

<details>
<summary>查看原文（17行）</summary>

```text
  useSyncExternalStore(ui.subscribe, ui.getVersion)
  const entry = ui.peekUndo(uiKey)

  // The draft moved on (user edited after applying): drop the stale entry.
  useEffect(() => {
    if (entry !== undefined && entry.applied !== draft) ui.popUndo(uiKey)
  }, [draft, entry, uiKey])

  if (entry === undefined || entry.applied !== draft) return null

  const undo = (): void => {
    inputActions.setDraft(entry.original)
    ui.popUndo(uiKey)
  }
  const dismiss = (): void => {
    ui.popUndo(uiKey)
  }
```

</details>

#### 缺口

- 未核真实宿主多窗口并发编辑或刷新后状态。
  **影响**：只能确认客户端内的恢复逻辑。
  **进一步探讨**：在隔离宿主比较请求中编辑、填回后编辑和切换会话。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 模型能看到哪些内容，失败怎样处理？

**研究主题**：功能与机制、依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

增强使用显式配置的 provider/model，其次当前会话路由，再退到宿主默认。找不到路由或 LLM 服务时返回错误。上下文感知开启时可按会话 ID 读宿主近期消息，对最近与草稿相同的用户消息去重，以消息数和字符预算截断；无可用历史时仅处理草稿。启用上下文会把实际选中的会话文本送给所选模型。插件的日志不保存草稿正文不等于模型没有收到。模型走宿主流接口，传播超时与取消；遇到明确不支持 reasoning effort 的错误可省略设置后再试一次。最终拒绝工具调用和空文本。输出约束未验证能逐条保留用户意图，尤其在历史有冲突或过长时。

#### 证据与依据

**依据 1 · 源码核查**：[src/enhancer.ts:59-68](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhancer.ts#L59-L68)

路由优先级。

<details>
<summary>查看原文（10行）</summary>

```text
export function resolveRoute(explicit: Partial<RoutePair> | undefined, session: RoutePair | undefined, fallback: RoutePair | undefined): RoutePair | undefined {
  // Defensive trim: the explicit pair may come from a hand-edited settings
  // document, and `readConfig` normalization is best-effort defense in depth.
  const provider = typeof explicit?.provider === 'string' ? explicit.provider.trim() : ''
  const model = typeof explicit?.model === 'string' ? explicit.model.trim() : ''
  if (provider !== '' && model !== '') {
    return { provider, model }
  }
  return session ?? fallback
}
```

</details>

**依据 2 · 源码核查**：[src/orchestrate.ts:183-201](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/orchestrate.ts#L183-L201)

上下文开关与历史读取。

<details>
<summary>查看原文（19行）</summary>

```text
export function conversationContextOf(ctx: Context, sessionId: string | undefined, config: Config, draft: string): string | undefined {
  if (!config.contextAware) return undefined
  if (sessionId === undefined || sessionId === '') return undefined
  const session = serviceEntry(ctx, 'sessions', sessionId) as ReturnType<SessionsFace['get']> | undefined
  if (session === undefined) return undefined
  let messages: readonly unknown[]
  try {
    const derived = session.deriveMessages?.()
    if (derived === undefined || !Array.isArray(derived)) return undefined
    messages = derived
  } catch {
    // A session-layer hiccup must not turn one enhance request into a 502.
    return undefined
  }
  return buildConversationContext(
    messages,
    { maxMessages: config.contextMaxMessages, maxChars: config.contextMaxChars },
    draft,
  )
```

</details>

**依据 3 · 源码核查**：[src/context.ts:111-149](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/context.ts#L111-L149)

去重、窗口和字符限制。

<details>
<summary>查看原文（39行）</summary>

```text
  // Some hosts re-derive a history that already ends with the text under the
  // cursor; feeding the draft back as its own context only wastes budget.
  // Match the LATEST user turn equal to the draft (not the very last turn —
  // an assistant reply between the draft and its user message is fine).
  if (draft !== undefined) {
    const trimmed = draft.trim()
    if (trimmed !== '') {
      for (let index = turns.length - 1; index >= 0; index--) {
        const candidate = turns[index]
        if (candidate !== undefined && candidate.role === 'user' && candidate.text === trimmed) {
          turns.splice(index, 1)
          break
        }
      }
    }
  }

  const windowed = turns.slice(-maxMessages)
  const kept: ContextTurn[] = []
  let used = 0
  for (let index = windowed.length - 1; index >= 0; index--) {
    const turn = windowed[index]!
    // Same gauge as `shared/validate.countText`, the input cap, and the host
    // logs: Unicode code points, not UTF-16 units. `turn.text.length` would
    // spend double budget on CJK/emoji-heavy history and make `maxChars`
    // disagree with the "characters" the UI reports.
    const length = countText(turn.text)
    if (used + length > maxChars) {
      const room = maxChars - used
      // One very long recent turn must not blank the window: keep its head,
      // marked as cut. The head is what names the task, the stack, and the
      // constraints the draft is shorthand for.
      if (kept.length === 0 && room > TRUNCATION_MARK.length + 40) {
        kept.unshift({ role: turn.role, text: `${cutToCodePoints(turn.text, room - TRUNCATION_MARK.length).trimEnd()}${TRUNCATION_MARK}` })
      }
      break
    }
    used += length
    kept.unshift(turn)
```

</details>

**依据 4 · 源码核查**：[src/orchestrate.ts:235-267](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/orchestrate.ts#L235-L267)

宿主 LLM 与实际输入。

<details>
<summary>查看原文（33行）</summary>

```text
  try {
    const route = resolveRoute(config, options.sessionRoute, defaultRouteOf(ctx))
    if (route === undefined) {
      // No detail line: the fix instructions are the localized primary copy.
      throw new EnhanceFailure({ code: 'unconfigured' })
    }
    const llm = ctx.get('llm')
    if (llm === undefined) {
      throw new EnhanceFailure({ code: 'internal' })
    }
    const context = options.context !== undefined
      ? options.context
      : conversationContextOf(ctx, options.sessionId, config, options.text)
    const result = await enhanceText(llm, {
      route,
      // The context rules ride along ONLY when there is context to reason
      // about, so a context-free call keeps byte-identical instructions.
      system: effectiveSystemPrompt(config, context === undefined ? DEFAULT_SYSTEM_PROMPT : withContextRules(DEFAULT_SYSTEM_PROMPT)),
      text: options.text,
      temperature: config.temperature,
      reasoningEffort: config.reasoningEffort,
      maxTokens: config.maxOutputTokens,
      timeoutMs: config.timeoutMs,
      signal: options.signal,
      ...(context !== undefined ? { context } : {}),
      ...(options.onDelta !== undefined ? { onDelta: options.onDelta } : {}),
      ...(options.sessionId !== undefined ? { sessionId: options.sessionId } : {}),
    })
    console.info(`[prompt-enhance] ${requestId} in=${countText(options.text)} out=${countText(result.text)} ctx=${context === undefined ? 0 : 1} ${result.elapsedMs}ms ok`)
    return result
  } catch (error) {
    const wire = toEnhanceError(error)
    console.info(`[prompt-enhance] ${requestId} in=${countText(options.text)} error=${wire.code} ${Date.now() - started}ms`)
```

</details>

**依据 5 · 源码核查**：[src/enhancer.ts:218-239](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhancer.ts#L218-L239)

有限重试。

<details>
<summary>查看原文（22行）</summary>

```text
    // The configured effort, and the one a downgrade retry falls back to:
    // `inherit` leaves the field off the request entirely.
    const requestedEffort: ReasoningEffortChoice = options.reasoningEffort
    // One model call per attempt; the loop exists only for the single effort
    // downgrade below, so it can never spin more than twice.
    let retriedWithoutEffort = false
    const readAttempt = async (): Promise<
      { ok: true; blocks: ReturnType<BlockAssembler['blocks']> } | { ok: false; detail: EnhanceError }
    > => {
      while (true) {
        let attempt: { assembler: BlockAssembler; exhausted: boolean }
        try {
          attempt = await readCall(retriedWithoutEffort ? 'inherit' : requestedEffort)
        } catch (error) {
          // Defence for a host that rejects the effort somewhere the harness's
          // own terminal conversion does not cover; on a current host this does
          // not fire (see the finish check right below).
          if (retriedWithoutEffort || requestedEffort === 'inherit' || !isEffortRejectionThrow(error)) throw error
          retriedWithoutEffort = true
          continue
        }
        signal.throwIfAborted()
```

</details>

**依据 6 · 源码核查**：[src/enhancer.ts:254-286](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhancer.ts#L254-L286)

输出校验、错误和取消。

<details>
<summary>查看原文（33行）</summary>

```text
        // of retried. The rejected attempt's assembler is discarded: reusing it
        // would splice its partial blocks into the retry.
        const rejected = isEffortRejectionFinish(attempt.assembler.finish)
        if (retriedWithoutEffort || requestedEffort === 'inherit' || !rejected) {
          const detail = finishToDetail(attempt.assembler.finish)
          return detail === undefined ? { ok: true, blocks: attempt.assembler.blocks() } : { ok: false, detail }
        }
        retriedWithoutEffort = true
      }
    }
    const outcome = await readAttempt()
    if (!outcome.ok) {
      return fail(outcome.detail)
    }
    const blocks = outcome.blocks
    if (blocks.some((block) => block.type === 'tool-call')) {
      fail({ code: 'upstream', params: { reason: 'tool-call' } })
    }
    const joined = blocks.filter((block) => block.type === 'text').map((block) => block.text).join('\n')
    const text = normalizeOutput(joined)
    if (text === '') {
      fail({ code: 'upstream', params: { reason: 'empty' } })
    }
    return { text, provider: options.route.provider, model: options.route.model, elapsedMs: Date.now() - started }
  } catch (error) {
    if (error instanceof EnhanceFailure) throw error
    if (timedOut) {
      throw new EnhanceFailure({ code: 'timeout', params: { seconds: Math.ceil(options.timeoutMs / 1000) } })
    }
    if (callerAborted || (error instanceof Error && error.name === 'AbortError')) {
      // Deliberately no detail line: the caller knows it cancelled.
      throw new EnhanceFailure({ code: 'internal' })
    }
```

</details>

#### 缺口

- 未用真实模型测约束保留或历史串入。
  **影响**：模型调用成功不能证明提示词更好。
  **进一步探讨**：用包含否定与专有名词的样本对照上下文开关。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · HTTP 和命令入口能否共用限流与取消保证？

**研究主题**：工程质量与复用、缺陷与关键质疑、效果与总成本

#### 完整回答

HTTP 端点先验证请求来源，只接受回环 socket，拒转发头，并在提供 Host 和 Origin 时检查本机来源。有效请求受 POST、输入格式、长度、并发和成功请求窗口限制。提前断开连接会触发取消；流式增量只是预览，最终文本以后续完成事件为准。限流统计成功调用，不能直接转成失败请求或供应商费用上限。命令入口取宿主实际会话并直接运行编排，也会检查启用、文本和信号，但不经过 HTTP 的并发窗口。边界包括本机进程、宿主权限以及不同模型的实际退出行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/loopback.ts:93-101](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/loopback.ts#L93-L101)

HTTP 回环、转发头与来源。

```text
export function isTrustedRequest(req: IncomingMessage): boolean {
  if (req.headers['x-forwarded-for'] !== undefined || req.headers.forwarded !== undefined) return false
  if (!isLoopbackRequest(req)) return false
  const host = req.headers.host
  if (typeof host !== 'string' || host.trim() === '') return true
  if (!TRUSTED_HOSTNAMES.has(hostnameOf(host))) return false
  const origin = req.headers.origin
  if (typeof origin === 'string' && origin.trim() !== '' && !isTrustedOrigin(origin, portOf(host))) return false
  return true
```

**依据 2 · 源码核查**：[src/enhance-routes.ts:61-109](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhance-routes.ts#L61-L109)

请求和输入限制。

<details>
<summary>查看原文（49行）</summary>

```text
async function serveEnhance(ctx: Context, readConfig: () => Config, gate: AdmissionGate, pathname: string, req: IncomingMessage, res: ServerResponse, stream: boolean): Promise<void> {
  if (!isTrustedRequest(req)) {
    writeJson(res, 403, { ok: false, error: { code: 'internal', message: 'forbidden: loopback-only' } })
    return
  }
  // One route, two exact endpoints (one-shot JSON / incremental SSE):
  // anything else under the prefix is unknown.
  if (pathname !== ENHANCE_ENDPOINT && pathname !== ENHANCE_STREAM_ENDPOINT) {
    writeJson(res, 404, { ok: false, error: { code: 'internal', message: 'not found' } })
    return
  }
  if (req.method !== 'POST') {
    writeJson(res, 405, { ok: false, error: { code: 'internal', message: 'only POST is allowed' } })
    return
  }
  const contentType = req.headers['content-type']
  if (contentType !== undefined && !String(contentType).toLowerCase().startsWith('application/json')) {
    writeJson(res, 415, { ok: false, error: { code: 'rejected', message: '仅支持 application/json 请求体。' } })
    return
  }
  let config: Config
  try {
    config = readConfig()
  } catch (error) {
    // resolveConfig fails loud on an invalid section — surface it instead of
    // letting the rejection escape the handler.
    writeJson(res, 500, { ok: false, error: { code: 'internal', message: `prompt-enhance 配置无效：${error instanceof Error ? error.message : String(error)}` } })
    return
  }
  // Fail before reading the body when the plugin is switched off.
  if (!config.enabled) {
    writeJson(res, 403, { ok: false, error: { code: 'rejected', message: '提示词增强已在设置中关闭。' } })
    return
  }
  // Fast reject on a declared body that already exceeds the cap: refuse before
  // reading a single byte. The streamed cap inside readBoundedJson stays as the
  // backstop for chunked bodies, which carry no Content-Length at all. A caller
  // that declares megabytes and dribbles them (or never sends them) must not
  // hold the connection open, so the socket is destroyed once the 413 lands.
  const cap = bodyCapOf(config.maxInputChars)
  const declaredLength = Number(req.headers['content-length'])
  if (Number.isFinite(declaredLength) && declaredLength > cap) {
    // `connection: close` instead of destroying the socket: the 413 still has
    // to reach the caller, and a blunt destroy also kills whatever else rides
    // this keep-alive connection. Declaring the connection non-reusable lets
    // Node discard the unread body and close on its own schedule.
    res.setHeader('connection', 'close')
    writeJson(res, 413, { ok: false, error: { code: 'rejected', message: '请求体超过大小上限。' } })
    return
```

</details>

**依据 3 · 源码核查**：[src/enhance-routes.ts:168-202](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhance-routes.ts#L168-L202)

成功窗口、并发、连接关闭。

<details>
<summary>查看原文（35行）</summary>

```text
  const stamps = gate.stamps
  const cut = now - 60000
  let validFrom = 0
  while (validFrom < stamps.length && (stamps[validFrom] ?? cut) < cut) validFrom++
  if (validFrom > 0) stamps.splice(0, validFrom)
  if (stamps.length >= config.rateLimitPerMinute) {
    // The window is bounded, so the oldest surviving stamp tells exactly when
    // a slot frees up — advertise it instead of making the user guess.
    const oldest = stamps[0] ?? now
    const retryAfterSeconds = Math.max(1, Math.ceil((60000 - (now - oldest)) / 1000))
    res.setHeader('Retry-After', String(retryAfterSeconds))
    writeJson(res, 429, {
      ok: false,
      error: { code: 'rate-limit', params: { limit: config.rateLimitPerMinute, retryAfterSeconds } },
    })
    return
  }
  // No Retry-After here: a busy slot frees whenever some in-flight call
  // settles, which is not a delay this route can predict.
  if (gate.active >= config.maxConcurrent) {
    writeJson(res, 429, {
      ok: false,
      error: { code: 'concurrency-limit', params: { max: config.maxConcurrent } },
    })
    return
  }
  gate.active += 1
  // Cancel the model call when the browser goes away mid-flight. `res.close`
  // also fires after a normal response completes, so guard with
  // `writableEnded` — only a premature close aborts the call.
  const callerAbort = new AbortController()
  const onConnectionClosed = (): void => {
    if (!res.writableEnded) callerAbort.abort()
  }
  res.on('close', onConnectionClosed)
```

</details>

**依据 4 · 源码核查**：[src/enhance-routes.ts:210-243](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhance-routes.ts#L210-L243)

流式和最终完成。

<details>
<summary>查看原文（34行）</summary>

```text
    if (stream) {
      // The stream already opens before the model call, so the client sees
      // the first token instead of waiting for the whole rewrite. Frames go
      // through the backpressure-aware writer: a slow reader pauses the delta
      // path instead of letting the socket buffer grow without bound.
      const sse = createSseWriter(res)
      try {
        sse.open()
        // Display-only normalization: withhold a fence the final body will not
        // have. The authoritative text still comes from `normalizeOutput` at
        // the end, so this cannot change what the user applies.
        const display = createStreamNormalizer()
        const value = await runEnhance(ctx, config, {
          ...runOptions,
          onDelta: async (delta: string): Promise<void> => {
            const safe = display.push(delta)
            if (safe === '') return
            await sse.write(`event: delta\ndata: ${JSON.stringify({ type: 'delta', text: safe })}\n\n`)
          },
        })
        // End the display stream: release whatever the fence heuristic was
        // still withholding, so the incremental view shows the same text the
        // done frame is about to carry (the model may end inside a fence).
        const tail = display.finish()
        if (tail !== '') {
          await sse.write(`event: delta\ndata: ${JSON.stringify({ type: 'delta', text: tail })}\n\n`)
        }
        await sse.write(`event: done\ndata: ${JSON.stringify({ type: 'done', value })}\n\n`)
        // Terminate the response. Without this the chunked body never receives
        // its closing `0\r\n\r\n`, so the connection stays half-open: a browser
        // client survives only because it returns on the `done` frame and
        // cancels the reader, but any whole-body reader (`response.text()`, a
        // curl, a proxy) waits forever, and the socket can never be reused.
        endResponse(res)
```

</details>

**依据 5 · 源码核查**：[src/enhance-command.ts:28-64](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhance-command.ts#L28-L64)

命令直接编排，不使用 HTTP 窗口。

<details>
<summary>查看原文（37行）</summary>

```text
export function registerEnhanceCommand(ctx: Context, readConfig: () => Config): void {
  const commands = ctx.get('commands') as unknown as CommandsFace | undefined
  if (commands === undefined) return
  const definition: CommandDefinition = {
    name: 'enhance',
    description: '提示词增强：/enhance <文本> —— 重写为结构化提示词，结果在此展示可复制，不进入对话历史',
    input: { hint: '要增强的文本（增强输入框草稿请用输入框按钮或快捷键）' },
    recordInput: false,
    async handler(invocation: CommandInvocation) {
      const raw = invocation.rawInput.trim()
      if (raw === '') {
        return { kind: 'error', text: '用法：/enhance <文本>。要增强输入框里的草稿，请用输入框右侧的「增强」按钮或快捷键。' }
      }
      // Everything below reads config, and `resolveConfig` throws on the
      // invariants the schema cannot express (provider without model, an
      // out-of-range value left by hand-editing). Reading it outside the try
      // turned those into an uncaught handler throw — the user got a raw
      // exception instead of the bilingual message the route already shows.
      try {
        const config = readConfig()
        if (!config.enabled) {
          return { kind: 'error', text: '提示词增强已在插件设置中关闭。' }
        }
        const check = checkInputText(raw, config.maxInputChars)
        if (!check.ok) {
          return { kind: 'error', text: formatInputCheckZh(check) }
        }
        const value = await runEnhance(ctx, config, {
          text: raw,
          sessionRoute: sessionRouteOf(ctx, invocation.agent.session.id),
          signal: invocation.signal,
          sessionId: invocation.agent.session.id,
        })
        return { kind: 'success', text: value.text }
      } catch (error) {
        return { kind: 'error', text: formatEnhanceError(toEnhanceError(error)) }
      }
```

</details>

#### 缺口

- 真实 Desktop、Web 与模型端取消是否同步未核。
  **影响**：请求中止可能仍产生成本。
  **进一步探讨**：比较 HTTP 断连和命令取消后提供方调用记录。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时值得在现有编辑流程试用？

**研究主题**：采用判断、新假设与验证、效果与总成本

#### 完整回答

先试一次不含敏感资料的短草稿，核对增强结果是否保留原约束、未臆造环境并能撤销。可以关闭上下文感知并选择明确模型，必要时仅复制结果。成本包括一次独立增强的模型请求、可选近期历史和人工审阅。出现漏掉约束、补写错误细节或旧结果覆盖风险时放弃结果，回原稿手动改。可验证的改进是在预览中提供原约束保留检查，以相同样本比较人工改写、现有增强和增强加核对三组的有效约束、修订时长与 token。若约束不更完整或审核比人工改写更慢，则保留手工编辑。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/EnhanceButton.tsx:160-177](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/client/EnhanceButton.tsx#L160-L177)

用户仍决定是否填回。

<details>
<summary>查看原文（18行）</summary>

```text
  // Draft changed after the request started → flag (or clear) the result
  // panel's stale marker so the user knows the result is based on the
  // pre-enhance text.
  useEffect(() => {
    if (panel !== undefined && panel.sessionId === uiKey && panel.phase === 'result') {
      ui.setStale(uiKey, draft !== panel.original)
    }
  }, [draft, panel, uiKey])

  /** Apply the enhanced result: remember the CURRENT draft (pre-apply, so
   * undo restores exactly this state even if the user typed during the
   * request), then fill the enhanced text back. */
  const apply = useCallback((): void => {
    if (panel === undefined || panel.phase !== 'result' || panel.result === undefined) return
    ui.pushUndo(uiKey, { original: draft, applied: panel.result.text })
    inputActions.setDraft(panel.result.text)
    ui.closePanel()
  }, [draft, inputActions, panel, uiKey])
```

</details>

**依据 2 · 源码核查**：[src/orchestrate.ts:183-201](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/orchestrate.ts#L183-L201)

上下文可关闭。

<details>
<summary>查看原文（19行）</summary>

```text
export function conversationContextOf(ctx: Context, sessionId: string | undefined, config: Config, draft: string): string | undefined {
  if (!config.contextAware) return undefined
  if (sessionId === undefined || sessionId === '') return undefined
  const session = serviceEntry(ctx, 'sessions', sessionId) as ReturnType<SessionsFace['get']> | undefined
  if (session === undefined) return undefined
  let messages: readonly unknown[]
  try {
    const derived = session.deriveMessages?.()
    if (derived === undefined || !Array.isArray(derived)) return undefined
    messages = derived
  } catch {
    // A session-layer hiccup must not turn one enhance request into a 502.
    return undefined
  }
  return buildConversationContext(
    messages,
    { maxMessages: config.contextMaxMessages, maxChars: config.contextMaxChars },
    draft,
  )
```

</details>

**依据 3 · 源码核查**：[src/enhancer.ts:154-170](https://github.com/rongxingda/dsh-prompt-enhance/blob/5e6f69549f648fa52455c2b6a5692fd9a6b8af91/src/enhancer.ts#L154-L170)

独立模型请求。

<details>
<summary>查看原文（17行）</summary>

```text
    const readCall = async (effort: ReasoningEffortChoice): Promise<{ assembler: BlockAssembler; exhausted: boolean }> => {
      const generate: GenerateOptions = {
        provider: options.route.provider,
        model: options.route.model,
        system: options.system,
        messages,
        temperature: options.temperature,
        maxTokens: options.maxTokens,
        signal,
        // `inherit` deliberately leaves the field unset, for a route that
        // rejects an explicit effort; `ReasoningEffortId` is a brand over the
        // effort id, hence the cast.
        ...effort === 'inherit' ? {} : { reasoningEffort: effort as NonNullable<GenerateOptions['reasoningEffort']> },
        ...options.sessionId !== undefined ? { sessionId: options.sessionId as GenerateOptions['sessionId'] } : {},
      }
      const assembler = new BlockAssembler()
      const iterator = llm.stream(generate)[Symbol.asyncIterator]()
```

</details>

#### 缺口

- 没有真实任务节时、模型费用或约束正确率。
  **影响**：只支持可逆的小范围试用。
  **进一步探讨**：固定一组带关键约束的草稿逐项测对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
