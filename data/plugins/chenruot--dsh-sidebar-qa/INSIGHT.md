# dsh-sidebar-qa

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[90dd930](https://github.com/ChenRuoT/dsh-sidebar-qa/tree/90dd930ca8e4239beb3559d53d0df7757747a11f)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ChenRuoT/dsh-sidebar-qa) [![npm 30d 2,314](https://img.shields.io/static/v1?label=npm+30d&message=2%2C314&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidebar-qa) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-sidebar-qa)
<!-- END META -->

> **功能**：在 DSH 右侧栏划选提问，按上下文策略创建同工作区独立追问会话，并可追加引文到草稿。

> **亮点**：把引文定位、上下文策略、同工作区子会话和侧栏连续问答接成一条阅读流程，相对手工复制和切换增加会话组织与装配，主会话执行队列不接收旁支prompt。净节时和正确率未实测，基础fork与模型能力来自宿主。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：回答出现不代表背景和模型按选择兑现。摘要失败可只保留近期文本却仍报未降级，回答模型选择失败只记录警告后继续；早期约束与费用敏感任务需核真实输入和路由。见 [Q02](#research-q02)。

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
  - [Q01 · 划选后怎样建立并持续派生问答，主会话是否被写入？](#detail-section-11)
  - [Q02 · 引用/摘要、跨会话状态与回填有哪些失败边界？](#detail-section-12)
  - [Q03 · 相比复制到新会话，实际增量、依赖和成本是什么？](#detail-section-13)
  - [Q04 · 对谁值得试用，哪个假设值得继续？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向阅读长DSH对话时需要解释一个片段的个人，直接在侧栏建立独立追问而保留主线。见 [Q01](#research-q01)。

替代是手工复制引文和背景到新会话，明确选择模型后再切回主线。宿主fork、会话存储与模型调用是复用能力，本次未对其他产品做源码级比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 划选提问 | 从会话片段发起侧栏问答 | 原生侧栏与会话Remote必需 |
| 全量继承 | fork父会话形成追问 | 沿用父模型，fork失败退压缩，不能保证缓存收益 |
| 背景压缩 | 早期摘要加近期原文 | 摘要失败可只留近期且未显式降级 |
| 机械裁切 | 提取最近窗口 | 不发摘要请求，但可能失早期约束 |
| 连续/嵌套追问 | 在独立子会话继续 | 不实时同步父会话后续背景 |
| 添加到对话 | 追加引文至已有草稿 | 不发送，重复点击会重复追加 |
| 追问记录 | 按工作区组织子会话 | 本机映射与宿主实际会话分开 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer/sessionQuery/llm/loader | 服务端必需 | 背景读取、摘要和API门禁 | 服务缺失无法完整加载 |
| 原生右侧栏、会话/工作区Remote | 侧栏问答必需 | 显示追问和创建提交子会话 | 老宿主可能只有划选与草稿追加 |
| 摘要与回答Provider/模型 | 压缩/回答必需 | 摘要背景和生成答案 | 摘要可降级，模型选择失败可能继续用其他实际路由 |
| 本机追问映射与宿主子会话 | 历史管理必需 | 同工作区记录和继续问答 | 映射与实际会话删除不等价 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核宿主、模型和工作区 | 侧栏可用且摘要/回答路由明确 |
| 发起 | 用户划选并选策略提问 | 子会话位于预期位置，fork失败显示策略改变 |
| 执行 | 插件装配背景引文并prompt子会话 | 检查实际输入和模型，不把回答出现当完整上下文保证 |
| 验收 | 用户用已知答案核关键约束 | 遗漏或模型不符就改手工新会话，主线无需回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主和模型资源 | 版本、路由、工作区核查 | 无配置耗时数据 |
| 持续使用 | 摘要、回答、标题模型调用与子会话存储 | 引文/背景/答案复核 | 裁切仅省摘要调用，全量不等于免费 |
| 失败恢复 | 可能重试和空子会话 | 检查模型选择、摘要缺失和孤立会话 | create/prompt不是事务 |
| 退出 | 保留宿主子会话 | 停用插件或整理映射与会话 | 清记录不等于删除对话 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主线分离 | prompt与模型选择指向子会话 | 共享资源是否完全无影响 |
| 背景装配 | fork、压缩及裁切路径存在 | 摘要语义完整性与缓存收益 |
| 草稿追加 | 保留原文后追加引文，不发送 | 重复点击需人自行处理 |
| 阅读效率 | 减少手工复制/切换的机制 | 正确率、端到端时间和全部费用 |

没有合格答案数与全部成本对照，不计算单位成本。

> **思考**：回答出现不代表背景和模型按选择兑现。摘要失败可只保留近期文本却仍报未降级，回答模型选择失败只记录警告后继续；早期约束与费用敏感任务需核真实输入和路由。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把引文定位、上下文策略、同工作区子会话和侧栏连续问答接成一条阅读流程，相对手工复制和切换增加会话组织与装配，主会话执行队列不接收旁支prompt。净节时和正确率未实测，基础fork与模型能力来自宿主。见 [Q01](#research-q01)、[Q03](#research-q03)。

主会话只读与子会话prompt分离、引文转义/定位、已有草稿追加、陈旧追问阻止提交都可借鉴；best-effort选择模型和无显式背景失败状态会弱化用户对真实输入的判断。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

回答出现不代表背景和模型按选择兑现。摘要失败可只保留近期文本却仍报未降级，回答模型选择失败只记录警告后继续；早期约束与费用敏感任务需核真实输入和路由。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用已知答案的小片段核子会话工作区、实际模型和背景；重要早期约束手工附原文。模型不符、背景遗漏或空会话反复出现时回到手工新会话，主线保持可继续。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查源码中的侧栏、子会话创建与提交、背景降级和草稿追加。独立会话组织贡献属于机制判断，回答质量和净收益未测；回执方案是未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/config.ts、src/trust-fence.ts、src/client/index.tsx、src/client/orchestrate.ts、src/client/AskPanel.tsx、src/client/injection.ts、src/client/quote-draft.ts、src/client/draft-insert.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查划选接线、侧栏编排、背景API、模型选择失败、引文和草稿追加及Host/Origin门禁。未全审所有宿主版本适配、模型菜单、历史分页/删除与前端样式；未执行安装、宿主和模型调用。
- 下一步：固定含早期约束的会话，在摘要/模型选择失败与正常路径比较真实子会话输入和路由，再测回答正确率、全部token和人工纠错。回执方案另做界面对照，均未执行。

**分析版本**

- **仓库**：[ChenRuoT/dsh-sidebar-qa](https://github.com/ChenRuoT/dsh-sidebar-qa)
- **版本号**：1.2.2（[固定提交 90dd930](https://github.com/ChenRuoT/dsh-sidebar-qa/tree/90dd930ca8e4239beb3559d53d0df7757747a11f)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可试验上下文来源与实际模型回执，在缺背景或路由不符时让用户确认后再发。固定正常/失败场景比较关键事实和错误模型发现率、人工时间与重试；若干扰大于收益，收窄到异常展示。尚未实现或验证。见 [Q04](#research-q04)。

固定含早期约束的会话，在摘要/模型选择失败与正常路径比较真实子会话输入和路由，再测回答正确率、全部token和人工纠错。回执方案另做界面对照，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 69 | 44 | 18 | — |
| .md | source | 5 | 1243 | — | — | 34955 |
| .ts | source | 39 | 7266 | 3764 | 3030 | — |
| .tsx | source | 10 | 2491 | 1719 | 636 | — |
| .ts | test | 32 | 5247 | 4096 | 600 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/ChenRuoT/dsh-sidebar-qa/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/ChenRuoT/dsh-sidebar-qa/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/ChenRuoT/dsh-sidebar-qa/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：侧栏追问如何隔离主会话，背景装配与实际模型是否按选择兑现？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 划选后怎样建立并持续派生问答，主会话是否被写入？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它服务于阅读长对话时临时问一个旁支问题的人，合格结果是在侧栏得到有引用来源的独立追问，不把主对话的模型执行队列改成旁支任务。替代办法是复制引文和必要背景到新会话再切回来；若只想把文字留到主对话草稿，插件还有单独的添加入口，两者不能混同。

客户端捕获当前会话的划选，把引文放进本会话store并打开追问tab。askFollowUp读取父会话工作区与模型，按策略fork或create子会话；普通创建保持同workspace，无法解析工作区时退到cwd或空目标。首条消息由说明、可选背景、带转义与定位属性的quoted_context和问题组成，再通过remote.session.prompt以queue模式提交给子会话；后续追问只发到该子会话。父会话未被prompt或selectModel，所谓不打断的源码边界成立于这个编排链路，不证明CPU/模型额度等共享资源完全不受影响。

全量继承策略尝试fork父会话，子会话沿用模型；fork失败退压缩而不是强行重试。压缩或裁切先读取父会话有效Surface再新建子会话。主对话继续生成后子会话不会自动取得新背景，因此追问绑定的是当时取得的上下文，不是实时同步的主会话镜像。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:163-182](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/index.tsx#L163-L182)

划选提问与添加草稿是不同动作。

<details>
<summary>查看原文（20行）</summary>

```text
  // Capture a selection → park the quote → open the ask tab. The quote goes on
  // the OPEN (not only into the store) because an external plugin may also open
  // this tab with a quote of its own; both ride the same channel.
  const onAsk = (quote: PendingQuote, sessionId: string): void => {
    store.setPendingQuote(sessionId, quote)
    sidebar.openAsk({ sessionId }, { quote: quote.text, messageId: quote.messageId, role: quote.role })
  }

  // Capture a selection → append it as a `>` blockquote to the CURRENT
  // session's MAIN composer and focus it, caret at the end. Deliberately does
  // NOT open (or expand) the sidebar — this is the lightweight sibling of 追问.
  // Returns false when the composer could not be reached, so the popover keeps
  // the selection and 提问 stays one click away.
  //
  // It runs DEFERRED because the session FEED may not have named a current session
  // yet, and because `uiWorkspace.openSession` refuses an id the controller cannot
  // resolve — both of which the next frame can cure.
  const onAddToConversation = (quote: PendingQuote, sessionId: string): boolean => {
    insertQuoteIntoComposerDeferred(ctx, sessionId, quote.text)
    return true
```

</details>

**依据 2 · 源码核查**：[src/client/orchestrate.ts:167-172](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L167-L172)

工作区和cwd解析决定创建目标。

```text
  // The parent's model is a local projection read now (no RPC), so only the
  // config call is awaited.
  const currentModel = currentModelOf(ctx, parentSessionId)
  const config = await loadConfig(ctx)
  const workspaceId = resolveWorkspaceId(ctx, parentSessionId)
  const cwd = workspaceId === undefined ? sessionCwd(ctx, parentSessionId) : undefined
```

**依据 3 · 源码核查**：[src/client/orchestrate.ts:181-240](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L181-L240)

fork或create并向子会话prompt，父会话只读。

<details>
<summary>查看原文（60行）</summary>

```text
  // ── inherit: fork the parent — full context, prefix-cache hits ──────────
  if (strategy === 'inherit') {
    let forkedId: string | undefined
    try {
      forkedId = await tryForkParent(ctx, parentSessionId)
    } catch (error) {
      // Mid-turn (fork-unavailable) or any fork failure → degrade to the
      // battle-tested compressed path; the ask still goes through. Only the
      // FORK is forgiven — later rename/prompt failures must surface, not
      // silently create a duplicate session.
      console.warn('[dsh-sidebar-qa] inherit fork failed, degrading to compressed:', error)
      strategy = 'compressed'
    }
    if (forkedId !== undefined) {
      const sideSessionId = forkedId
      await tryRename(ctx, sideSessionId, followUpTitle(topicFromQuote(quote.text, prompts.fallbackTopic)))
      // No selectModel: the child keeps the parent's model so the first
      // request shares the parent's message prefix (cache hits preserved).
      const text = buildFirstMessage(null, quote, question, label, locale)
      await tryPrompt(ctx, sideSessionId, text)
      store.addChild(parentSessionId, sideSessionId)
      onPhase?.('answering')
      return { sideSessionId, parentSessionId, degraded: false, strategy }
    }
  }

  // ── compressed / trim: assemble the context text + create a fresh session ─
  const contextPromise = sidebarqaApi.context({
    mainSessionId: parentSessionId,
    strategy,
    locale,
    ...(config.summarizeProvider !== ''
      ? { provider: config.summarizeProvider }
      : currentModel !== undefined
        ? { provider: currentModel.provider }
        : {}),
  }).catch((): ContextResult => ({ degraded: true, text: null, sourceSeq: -1, reason: 'network' }))

  const created = unwrapRemote(
    await ctx.remote.session.create(
      workspaceId !== undefined
        ? { workspaceId }
        : cwd !== undefined
          ? { cwd }
          : {},
    ),
    'create session',
  )
  const sideSessionId = created.sessionId
  const context = await contextPromise

  await tryRename(ctx, sideSessionId, followUpTitle(topicFromQuote(quote.text, prompts.fallbackTopic)))
  await trySelectModel(ctx, sideSessionId, config, input.modelOverride)

  const text = buildFirstMessage(context.text, quote, question, label, locale)
  await tryPrompt(ctx, sideSessionId, text)

  store.addChild(parentSessionId, sideSessionId)
  onPhase?.('answering')
  return { sideSessionId, parentSessionId, degraded: context.degraded, strategy }
```

</details>

**依据 4 · 源码核查**：[src/client/orchestrate.ts:131-143](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L131-L143)

真实prompt使用新requestId和目标子会话queue模式。

<details>
<summary>查看原文（13行）</summary>

```text
/** Prompt a side session with the assembled first message (throws on failure). */
async function tryPrompt(ctx: Context, sideSessionId: string, text: string): Promise<void> {
  unwrapRemote(
    await ctx.remote.session.prompt({
      // Client-minted identity the host persists on the accepted user message
      // (a required field since the Remote migration).
      requestId: mintRequestId(),
      sessionId: sideSessionId,
      mode: 'queue',
      content: [{ type: 'text', text }],
    }),
    'prompt',
  )
```

</details>

**依据 5 · 源码核查**：[src/client/injection.ts:70-89](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/injection.ts#L70-L89)

引文转义、来源及选择定位属性。

<details>
<summary>查看原文（20行）</summary>

```text
export function buildQuotedContext(quote: PendingQuote, label: string): string {
  const body = escapeXml(boundText(quote.text, QUOTE_MAX_LEN))
  const messageId = quote.messageId ?? ''
  const role = quote.role ?? 'assistant'
  const turn = quote.turn ?? ''
  const hasOffsets = quote.selectionStart !== undefined
    && quote.selectionEnd !== undefined
    && quote.messageId !== undefined
  const start = hasOffsets ? String(quote.selectionStart) : undefined
  const end = hasOffsets ? String(quote.selectionEnd) : undefined
  const attrs = [
    attr('source', 'agent-history'),
    attr('label', label),
    attr('message_id', messageId),
    attr('role', role),
    attr('turn', turn),
    attr('selection_start', start),
    attr('selection_end', end),
  ].join('')
  return `<quoted_context${attrs}>\n${body}\n</quoted_context>`
```

</details>

**依据 6 · 源码核查**：[src/client/injection.ts:116-130](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/injection.ts#L116-L130)

背景与引文组装首条用户消息。

<details>
<summary>查看原文（15行）</summary>

```text
export function buildFirstMessage(
  summary: string | null,
  quote: PendingQuote,
  question: string,
  label: string,
  locale: PromptLocale = 'zh',
): string {
  const prompts = promptsOf(locale)
  const parts: string[] = [prompts.followUpIntro]
  if (summary !== null && summary !== '') {
    parts.push(`${prompts.contextHeading}\n${boundText(summary, 12000)}`)
  }
  parts.push(buildQuotedContext(quote, label))
  parts.push(`${prompts.questionLabel}${sanitizeText(question)}`)
  return parts.join('\n\n')
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 引用/摘要、跨会话状态与回填有哪些失败边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最重要的边界是“问答继续成功”不代表所选上下文与模型完全兑现。后台压缩失败时仅保留近期原文，仍会在有近期文本时返回degraded=false并缓存；因此界面不一定知道较早背景已丢失。客户端对context接口失败也允许无背景继续问。模型选择函数同样仅记console.warn后继续prompt，选中的回答模型若未成功应用，不能据面板草稿宣称实际使用了它。这是源码可见的可用性优先取舍，直接影响依赖早期约束或预算的任务。

fork失败会退压缩并由AskPanel显示策略变化，已归档/删除等陈旧追问选择阻止提交，避免用户以为继续原子会话却新建会话。但创建子会话与prompt不是同一个事务，create后prompt失败可能留空子会话；本次没有把失败当作自动回滚。

添加到对话只写目标会话composer草稿，不调用发送。它会保留用户原草稿并追加一块引文，重复点击刻意追加两次，不能当幂等按钮。源码对XML边界转义和控制字符清理有处理，但文本仍作为模型输入，不能据标签认定彻底消除提示注入。

服务端接口有Host和同源浏览器标记门禁，明确cross-site拒绝，Origin缺失仍可通过已接受Host；这是本地信任边界，并未核实逐用户/逐会话授权。不能将其宣称成多租户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:368-395](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/index.ts#L368-L395)

背景压缩失败保留近期文本，非空时仍返回degraded=false并缓存。

<details>
<summary>查看原文（28行）</summary>

```text
      // Compress the background only when there is earlier content AND a provider.
      // Any failure here leaves the background empty — the verbatim recent window
      // still carries the current state, so the ask is never blocked.
      let background = ''
      if (earlierText.trim() !== '' && provider !== '') {
        try {
          const chunks = ctx.llm.stream({
            provider,
            model: await modelId(provider, model),
            messages: [userMessage(earlierText)],
            system: backgroundSystem(locale),
            maxTokens: budgetTokens,
            reasoningEffort: config.summarizeReasoningEffort,
            signal: AbortSignal.timeout(SUMMARIZE_TIMEOUT_MS),
          })
          const assembled = await assembleText(chunks)
          if (!assembled.failed) background = assembled.text.trim()
        } catch {
          // background stays empty; the recent window still carries the answer
        }
      }

      const text = composeSummary(background, recentText, locale)
      if (text.trim() === '') {
        return { degraded: true, text: null, sourceSeq, reason: 'empty-surface' }
      }
      cache.set(cacheKey, { sourceSeq, summary: text })
      return { degraded: false, text, sourceSeq }
```

</details>

**依据 2 · 源码核查**：[src/client/orchestrate.ts:78-100](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L78-L100)

selectModel失败记录警告，不阻止后续请求。

<details>
<summary>查看原文（23行）</summary>

```text
async function trySelectModel(
  ctx: Context,
  sideSessionId: string,
  config: SidebarqaConfigView,
  override?: SidebarqaModelSelection,
): Promise<void> {
  try {
    const result = await ctx.remote.session.selectModel({
      sessionId: sideSessionId,
      provider: override?.provider ?? config.answerProvider,
      model: override?.model ?? config.answerModel,
      // All-or-nothing on the effort axis: an override that deliberately carries
      // NO effort means "follow the provider default" and must not be topped up
      // with the configured effort (which would force `off` onto a thinking
      // model the user just picked).
      ...(override === undefined
        ? { reasoningEffort: config.answerReasoningEffort }
        : override.reasoningEffort === undefined ? {} : { reasoningEffort: override.reasoningEffort }),
    })
    if (!result.ok) console.warn('[dsh-sidebar-qa] selectModel failed:', result.error.message)
  } catch (error) {
    console.warn('[dsh-sidebar-qa] selectModel failed:', error)
  }
```

</details>

**依据 3 · 源码核查**：[src/client/orchestrate.ts:207-240](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L207-L240)

上下文失败可继续、create后prompt为分步动作。

<details>
<summary>查看原文（34行）</summary>

```text
  // ── compressed / trim: assemble the context text + create a fresh session ─
  const contextPromise = sidebarqaApi.context({
    mainSessionId: parentSessionId,
    strategy,
    locale,
    ...(config.summarizeProvider !== ''
      ? { provider: config.summarizeProvider }
      : currentModel !== undefined
        ? { provider: currentModel.provider }
        : {}),
  }).catch((): ContextResult => ({ degraded: true, text: null, sourceSeq: -1, reason: 'network' }))

  const created = unwrapRemote(
    await ctx.remote.session.create(
      workspaceId !== undefined
        ? { workspaceId }
        : cwd !== undefined
          ? { cwd }
          : {},
    ),
    'create session',
  )
  const sideSessionId = created.sessionId
  const context = await contextPromise

  await tryRename(ctx, sideSessionId, followUpTitle(topicFromQuote(quote.text, prompts.fallbackTopic)))
  await trySelectModel(ctx, sideSessionId, config, input.modelOverride)

  const text = buildFirstMessage(context.text, quote, question, label, locale)
  await tryPrompt(ctx, sideSessionId, text)

  store.addChild(parentSessionId, sideSessionId)
  onPhase?.('answering')
  return { sideSessionId, parentSessionId, degraded: context.degraded, strategy }
```

</details>

**依据 4 · 源码核查**：[src/client/AskPanel.tsx:401-445](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/AskPanel.tsx#L401-L445)

陈旧选择阻止提交，fork策略降级提示和错误呈现。

<details>
<summary>查看原文（45行）</summary>

```text
  const submit = async (): Promise<void> => {
    const q = question.trim()
    // A stale selection must never be pushed anywhere: `following` is null for
    // it, and falling through to the new-ask branch would silently START a new
    // follow-up from the parent while the user believes they are continuing the
    // selected one. The composer is disabled in that state as well.
    if (q === '' || phase === 'asking' || staleStatus) return
    setPhase('asking')
    setError(null)
    setStrategyNote(null)
    try {
      if (following === null) {
        const result = await askFollowUp(
          ctx,
          store,
          {
            parentSessionId: sessionId,
            quote: pendingQuote ?? { text: '' },
            question: q,
            strategy,
            modelOverride: pendingModel ?? undefined,
          },
          (next) => {
            if (next === 'answering') setPhase('answering')
          },
        )
        setActiveChildId(result.sideSessionId)
        // The inherit fork can degrade to compressed when the parent is
        // mid-turn; surface that so the user knows the context was not full.
        if (result.strategy !== strategy) {
          setStrategyNote(t('askDegradedToCompressed'))
        }
        store.setPendingQuote(sessionId, null)
        // Consume a meta-carried quote after it was sent, so refocusing the tab
        // (or a page reload, where the meta persists) never resurfaces it.
        consumeMeta()
        setPhase('answering')
      } else {
        await sendFollowUp(ctx, following, q)
        setPhase('answering')
      }
      setQuestion('')
    } catch (err) {
      setPhase('error')
      setError(err instanceof Error ? err.message : String(err))
```

</details>

**依据 5 · 源码核查**：[src/client/quote-draft.ts:56-73](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/quote-draft.ts#L56-L73)

保留原草稿并追加，重复点击不是幂等。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Plan the next draft for one inserted quote.
 *
 * The block is APPENDED — the user's existing text reads as a lead-in and is
 * never destroyed — separated by exactly one blank line however many newlines the
 * draft happened to end with. The result itself ends with a blank line so the
 * caret, which `setDraft` parks at the very end, lands on a fresh paragraph
 * BELOW the quote and OUTSIDE it: a line written directly under `> x` would be
 * a Markdown lazy continuation and stay inside the quote.
 *
 * Deliberately NOT idempotent: clicking twice appends two quotes.
 */
export function planQuoteInsert(draft: string, text: string): DraftInsertPlan {
  const block = blockquote(text)
  if (block === '') return { next: draft, changed: false }
  const head = draft.replace(/\s+$/, '')
  const next = head === '' ? `${block}\n\n` : `${head}\n\n${block}\n\n`
  return { next, changed: next !== draft }
```

</details>

**依据 6 · 源码核查**：[src/client/draft-insert.ts:131-150](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/draft-insert.ts#L131-L150)

实际只调用setDraft与focus，无发送。

<details>
<summary>查看原文（20行）</summary>

```text
function attemptInsert(ctx: Context, sessionId: string, text: string): ComposerInsertResult {
  try {
    const actx = ctx.sessions.scope(sessionId)
    if (actx === undefined) return { ok: false, failure: 'scope-unavailable' }
    // Inject-free runtime read (the one DSH's own plugins use): a value import
    // of @deepseek-ai/* would fail the client-bundle purity gate, and putting
    // `conversation` in `inject` would make ui-conversation a hard dependency
    // of the WHOLE plugin instead of just this one button.
    const conversation = ctx.get('conversation')
    if (conversation === undefined) return { ok: false, failure: 'no-conversation-service' }
    const input = conversation.input.for(actx)
    const plan = planQuoteInsert(input.state.getSnapshot().draft, text)
    // An identical write early-returns inside setDraft without moving the
    // caret, so skipping it here only removes noise.
    if (plan.changed) input.setDraft(plan.next)
    focusComposer(input)
    return { ok: true }
  } catch (error) {
    console.warn('[dsh-sidebar-qa] composer insert failed:', error)
    return { ok: false, failure: 'threw', error }
```

</details>

**依据 7 · 源码核查**：[src/trust-fence.ts:151-167](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/trust-fence.ts#L151-L167)

Host/Origin与浏览器跨站门禁，不是逐会话鉴权。

<details>
<summary>查看原文（17行）</summary>

```text
  const host = header(request.headers, 'host')
  if (host === undefined) return false
  const hostUrl = parseAuthority(host, protocol)
  if (hostUrl === undefined) return false
  if (!isLoopbackHostname(hostUrl.hostname)
    && !isTrustedAuthority(hostUrl, trustedHosts, protocol)
    && !isBindAddressAuthority(hostUrl, bindHost)) return false
  // Cross-site fence: modern browsers label the initiator relationship on every
  // fetch; an explicit cross-site marker is refused regardless of Origin.
  if (header(request.headers, 'sec-fetch-site') === 'cross-site') return false
  // Origin fence: when a browser attaches an Origin it must be exactly this
  // authority (compared through the same normalization as the Host). Absent
  // Origin is fine — the Host fence above already bound the request. The
  // literal "null" (sandboxed iframes, file: pages) is an opaque origin, refused.
  const origin = header(request.headers, 'origin')
  if (origin === undefined) return true
  return isSameAuthorityOrigin(origin, host)
```

</details>

#### 缺口

- 实际回答是否遗漏关键早期事实、是否使用预期模型未进行宿主对照。
  **影响**：不能以回答生成完成认定上下文完整或费用符合所选模型。
  **进一步探讨**：固定含早期约束的对话，诱发摘要与模型选择失败，检查真实子会话路由、首条输入和回答是否准确显示降级。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相比复制到新会话，实际增量、依赖和成本是什么？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

贡献是把引文定位、上下文策略、同工作区独立会话和侧栏连续追问接成一个流程，主线不用来回切页面；这比仅加复制按钮多了会话组织与上下文装配。基础fork、模型流、会话存储和右侧栏来自宿主，本插件不提供新模型或新的摘要算法，作者类比其他产品不能证明原创首创。

依赖不只是“无额外依赖”一句话。宿主服务端要求webServer、sessionQuery、llm和loader，客户端依赖会话/工作区远程接口与原生右侧栏服务。旧宿主可能只有浮层添加而没有问答tab；模型路由与设置接口的结构兼容仍需在目标版本核对。压缩会把较早文本送给配置的摘要模型，回答由子会话模型生成，标题还可能另发一次短请求；裁切不调用摘要模型但回答仍有模型成本，全量继承不等于总输入免费或必然命中缓存。

首次要确认宿主、摘要/回答模型与当前工作区；持续需要核引文、上下文策略和答案。成本包括摘要、回答、标题、失败重试及历史子会话管理，具体费用和耗时未知。摘要cache按session/策略/语言及sourceSeq复用，但本实现Map没有淘汰，不能据复用推恒定资源。退出可停用插件并继续使用宿主中的独立子会话，主会话不需回滚；清理追问映射与删除宿主会话是不同动作，不能盲删映射当删除数据。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:100-105](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/index.ts#L100-L105)

服务端必要服务。

```text
export const name = 'dsh-sidebar-qa'

/** Services required before mounting: the webserver routes, the session query engine, the llm runtime, and the loader's connection row (trust fence). */
export const inject = ['webServer', 'sessionQuery', 'llm', 'loader']

/** How long a summarize call may run before degrading. */
```

**依据 2 · 源码核查**：[src/config.ts:77-89](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/config.ts#L77-L89)

默认压缩/回答/标题模型与窗口预算。

<details>
<summary>查看原文（13行）</summary>

```text
export const SIDEBARQA_DEFAULTS: SidebarqaConfig = {
  historyStrategy: 'compressed',
  trimWindowMessages: 10,
  summarizeProvider: '',
  summarizeModel: 'deepseek-v4-flash',
  summarizeReasoningEffort: 'off',
  summarizeBudgetTokens: 160,
  recentWindowMessages: 2,
  backgroundWindowMessages: 12,
  answerProvider: 'deepseek-official',
  answerModel: 'deepseek-v4-flash',
  answerReasoningEffort: 'off',
  titleBudgetTokens: 64,
```

</details>

**依据 3 · 源码核查**：[src/index.ts:337-395](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/index.ts#L337-L395)

裁切无摘要调用、压缩有模型调用及无淘汰Map说明。

<details>
<summary>查看原文（59行）</summary>

```text
      // Read the main session's current model surface (excludes tool/reasoning noise).
      const surface = await ctx.sessionQuery.readSurface(mainSessionId)
      const sourceSeq = surface.capturedThroughSeq ?? -1

      // `trim`: the last N segments verbatim — deterministic and free, no model.
      if (strategy === 'trim') {
        const text = buildTrimContext(extractSegments(surface.events), config.trimWindowMessages, undefined, locale)
        if (text === '') return { degraded: true, text: null, sourceSeq, reason: 'empty-surface' }
        return { degraded: false, text, sourceSeq }
      }

      // `compressed`: asymmetric window — the RECENT messages pass through
      // near-verbatim (they anchor the follow-up to the latest state); only the
      // EARLIER background goes to the fast model for compression.
      // The locale is part of the key: without it a zh→en switch would keep
      // serving the cached Chinese summary until the parent produces a new
      // message. (This Map has no eviction policy; the axis at most doubles it,
      // and each entry is a single summary string.)
      const cacheKey = `${strategy}:${locale}:${mainSessionId}`
      const cached = cache.get(cacheKey)
      if (cached !== undefined && cached.sourceSeq === sourceSeq) {
        return { degraded: false, text: cached.summary, sourceSeq }
      }

      const { earlier, recent } = splitRecent(extractSegments(surface.events), config.recentWindowMessages)
      const recentText = formatSegments(recent, RECENT_SEGMENT_MAX, locale)
      // Hand the background to the model NEWEST-FIRST so the current progress
      // (the tail of `earlier`, just before the verbatim recent band) sits at
      // the strongest attention position instead of the opening topic.
      const earlierText = formatBackground(earlier, config.backgroundWindowMessages, BACKGROUND_SEGMENT_MAX, locale)

      // Compress the background only when there is earlier content AND a provider.
      // Any failure here leaves the background empty — the verbatim recent window
      // still carries the current state, so the ask is never blocked.
      let background = ''
      if (earlierText.trim() !== '' && provider !== '') {
        try {
          const chunks = ctx.llm.stream({
            provider,
            model: await modelId(provider, model),
            messages: [userMessage(earlierText)],
            system: backgroundSystem(locale),
            maxTokens: budgetTokens,
            reasoningEffort: config.summarizeReasoningEffort,
            signal: AbortSignal.timeout(SUMMARIZE_TIMEOUT_MS),
          })
          const assembled = await assembleText(chunks)
          if (!assembled.failed) background = assembled.text.trim()
        } catch {
          // background stays empty; the recent window still carries the answer
        }
      }

      const text = composeSummary(background, recentText, locale)
      if (text.trim() === '') {
        return { degraded: true, text: null, sourceSeq, reason: 'empty-surface' }
      }
      cache.set(cacheKey, { sourceSeq, summary: text })
      return { degraded: false, text, sourceSeq }
```

</details>

**依据 4 · 源码核查**：[src/client/orchestrate.ts:271-277](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L271-L277)

回答后标题模型调用是另一成本来源。

```text
/**
 * One-shot post-answer retitle: after the side session's FIRST turn completes,
 * fold the question + answer into a compact input, ask the fast no-thinking
 * title model (the summarize route: fixed flash / thinking off) for a ≤15-char
 * subject, and overwrite the placeholder `❓<topicFromQuote>` title.
 * Fires at most once per side session (the store flag), never blocks the
 * panel, and degrades silently to the placeholder on any failure.
```

**依据 5 · 作者声明**：[README.md:80-92](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/README.md#L80-L92)

作者宿主兼容与原生侧栏前提，不作为运行证明。

<details>
<summary>查看原文（13行）</summary>

```text
## 前置条件

| 宿主 DSH | 侧边栏 tab | 划选浮层 / 添加到对话 |
|---|---|---|
| ≥ `0.2.0` | ✅ 注册进 DSH 自带右侧栏 | ✅ |
| ≥ `0.1.5-alpha.1`（推荐） | ✅ 注册进 DSH 自带右侧栏 | ✅ |
| `0.1.2-alpha.1` ~ `0.1.4.x` | ❌ 不注册（记一条 `console.warn`） | ✅ |

- **侧边栏 tab 需要 DSH ≥ `0.1.5-alpha.1`**：原生右侧栏（`@deepseek-ai/dsh-client-ui-sidebar-right`）从该版本起提供。
- 探测是**运行期结构探测**（服务在不在），不是版本号比对：`sidebarRightTabs` / `sidebarRight` / `slots` 三件套齐备才注册。
- `engines.dsh` 声明 `>=0.1.7-alpha.1`（如实反映设置接缝与图标改名两个世代）。
- **装载闸有两代，写法不同**：DSH `0.2.0` 校验的是 `peerDependencies` 里的每个 `@deepseek-ai/dsh*` 区间；DSH `0.2.1-alpha.3+` 改为**只看 `engines.dsh`**——只要有这个字段，peer 就完全不读。两代都用 `semver.satisfies(运行时, 区间, { includePrerelease: true })`，任一不满足就**跳过整个 bundle patch 层**（插件不加载，只在 stderr 留一行）。本插件因此把**两种区间都写成纯下限**（无 `<` 天花板）：`^0.1.0-rc.8` 这种带预发布的 caret 展开成 `>=0.1.0-rc.8 <0.2.0-0`，在 0.2.x 上会把插件整层挡掉（1.1.0 修的正是它）。回归：`tests/dsh-compat.spec.ts`（两代闸门都复刻，并校验 `package.json` / `dsh.plugin.json` 的 `engines.dsh` 同步）。
- **设置项在 ≥ `0.1.7-alpha.1` 的宿主上按「插件自有 `Config` + profile 条目 id」持久化**：可编辑字段来自本插件导出的 `Config` schema（12 个字段全部 `volatile()`），写入经 DSH 的 settings 服务落到插件自己的 profile 行（`cordis.patch.yml` 里 `id: sidebar-qa` 的 `config:`），插件读的是运行期就地更新的活引用（不重挂）；1.2.0 起**设置页可直接保存**。老宿主（`dsh-settings` ≤ `0.1.6`，仍提供命名空间注册）走原来的 `sidebarqa` 命名空间，行为不变；两种形态由接缝**结构探测**互斥选择，都不会写错地方（[issue #21](https://github.com/ChenRuoT/dsh-sidebar-qa/issues/21) / [issue #19](https://github.com/ChenRuoT/dsh-sidebar-qa/issues/19)）。
```

</details>

**依据 6 · 作者声明**：[README.md:113-117](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/README.md#L113-L117)

作者说明继承、裁切和追问记录与会话管理的区别。

```text
4. 每个追问仍是同工作区的独立会话（`❓<主题>`），主对话零打断；追问可以**嵌套**（在追问对话里再划选提问会生成新的子追问）。发起新追问时，输入框左侧的**上下文策略** chip 可选择策略（默认取配置 `historyStrategy`）：
   - **全量继承**：`sessions.fork` 从主会话最近的已完成 turn 分叉子会话，完整历史随种子继承，首条请求复用主会话消息前缀 → DeepSeek **自动前缀缓存命中**、零压缩损失；子会话沿用主会话模型。主对话正在回答（无已完成 turn）时 fork 自动降级为「压缩」并提示。追问 tab 中，继承的父对话历史显示在**分割条上方**，默认视图锚定在本追问自己的「引用 + 提问」处，**向上滚动分页加载**父对话历史（与主对话「加载更早」体验一致）。
   - **压缩**：快速模型压缩较早窗口 + 近期原文保留（默认，省 token）。
   - **机械裁切**：最后 `trimWindowMessages` 条消息原文直取，零 LLM 成本、确定性输出。
5. 侧边栏「追问记录」tab 按根（主）会话分组，以分层树列出**当前工作区**内的所有（嵌套）追问（归属判定：当前会话所在工作区，见 `src/client/history-scope.ts`），点击跳转。有子追问的节点右侧有**折叠按钮**（箭头随折叠状态旋转）收纳子树，其左侧显示该对话组**最近访问时间**（相对标签，复用 DSH 左侧面板的样式与数据源 `sessions.list.updatedAt`）。跳转后目标会话的**追问记录 tab 保持开启**（本插件先把目标会话切到屏幕上——`ctx.uiWorkspace.openSession`——再把「追问记录」tab 开进它的右侧栏）。被**归档或删除**的追问（用户自行管理会话时）会**置灰并标注「已归档 / 已删除」**，不可再点击跳转，行尾的「移除」按钮将其从记录中清除（连同整棵子树清理 localStorage 映射，DSH 侧会话本身不受影响）。
```

#### 缺口

- 缺少同任务正确率、切换负担和全部模型账单对照。
  **影响**：不能把裁切无摘要成本或预期缓存命中写成端到端节省。
  **进一步探讨**：固定问题与早期事实，比较手工复制新会话、压缩、裁切和继承，记录正确率、全部token、人工纠错与切换时间。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 对谁值得试用，哪个假设值得继续？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可以给经常阅读长DSH对话、需要短暂解释一个片段的个人用户有条件试用，先选不依赖隐含背景的可核对问题。确认子会话位于预期工作区，实际模型和策略正确，再用已有答案检验背景是否足够。主对话不被prompt的机制使试用有退路，但共享模型额度仍会增加。重要决定、必须遵循早期约束或费用敏感任务，应显式检查子会话首条输入和实际模型，不能只看降级提示。发现答案忽略关键约束、子会话模型不符或反复留空会话时停止自动追问，改手工复制原文与明确模型的新会话。

由后台压缩失败仍返回未降级和模型选择失败只警告这两个事实，可以推导“上下文来源与实际路由回执”假设。首条问答显示确实纳入哪些近期/早期内容、摘要是否成功和最终生效模型，让用户确认后再发，可能减少无意缺背景与预算误判；代价是一次确认和更多界面信息。最小对照固定正常及失败注入场景，比较现界面与回执界面在关键事实遗漏发现率、错误路由发现率、人工用时和重试次数上的变化。若用户仍无法判断或确认步骤的干扰大于纠错收益，应缩小到异常时展示。它是未实现设计，不计入当前贡献。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:368-395](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/index.ts#L368-L395)

摘要失败可被近期文本掩盖，构成回执设计依据。

<details>
<summary>查看原文（28行）</summary>

```text
      // Compress the background only when there is earlier content AND a provider.
      // Any failure here leaves the background empty — the verbatim recent window
      // still carries the current state, so the ask is never blocked.
      let background = ''
      if (earlierText.trim() !== '' && provider !== '') {
        try {
          const chunks = ctx.llm.stream({
            provider,
            model: await modelId(provider, model),
            messages: [userMessage(earlierText)],
            system: backgroundSystem(locale),
            maxTokens: budgetTokens,
            reasoningEffort: config.summarizeReasoningEffort,
            signal: AbortSignal.timeout(SUMMARIZE_TIMEOUT_MS),
          })
          const assembled = await assembleText(chunks)
          if (!assembled.failed) background = assembled.text.trim()
        } catch {
          // background stays empty; the recent window still carries the answer
        }
      }

      const text = composeSummary(background, recentText, locale)
      if (text.trim() === '') {
        return { degraded: true, text: null, sourceSeq, reason: 'empty-surface' }
      }
      cache.set(cacheKey, { sourceSeq, summary: text })
      return { degraded: false, text, sourceSeq }
```

</details>

**依据 2 · 源码核查**：[src/client/orchestrate.ts:78-100](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/orchestrate.ts#L78-L100)

模型选择不成功仍继续，是实际路由回执的依据。

<details>
<summary>查看原文（23行）</summary>

```text
async function trySelectModel(
  ctx: Context,
  sideSessionId: string,
  config: SidebarqaConfigView,
  override?: SidebarqaModelSelection,
): Promise<void> {
  try {
    const result = await ctx.remote.session.selectModel({
      sessionId: sideSessionId,
      provider: override?.provider ?? config.answerProvider,
      model: override?.model ?? config.answerModel,
      // All-or-nothing on the effort axis: an override that deliberately carries
      // NO effort means "follow the provider default" and must not be topped up
      // with the configured effort (which would force `off` onto a thinking
      // model the user just picked).
      ...(override === undefined
        ? { reasoningEffort: config.answerReasoningEffort }
        : override.reasoningEffort === undefined ? {} : { reasoningEffort: override.reasoningEffort }),
    })
    if (!result.ok) console.warn('[dsh-sidebar-qa] selectModel failed:', result.error.message)
  } catch (error) {
    console.warn('[dsh-sidebar-qa] selectModel failed:', error)
  }
```

</details>

**依据 3 · 源码核查**：[src/client/AskPanel.tsx:427-432](https://github.com/ChenRuoT/dsh-sidebar-qa/blob/90dd930ca8e4239beb3559d53d0df7757747a11f/src/client/AskPanel.tsx#L427-L432)

当前只明确显示策略变化，不代表所有背景/路由降级。

```text
        setActiveChildId(result.sideSessionId)
        // The inherit fork can degrade to compressed when the parent is
        // mid-turn; surface that so the user knows the context was not full.
        if (result.strategy !== strategy) {
          setStrategyNote(t('askDegradedToCompressed'))
        }
```

#### 缺口

- 上下文/路由回执方案未实现且没有用户识别效果对照。
  **影响**：不能认定多一条确认必然提高正确率或改善效率。
  **进一步探讨**：固定失败场景测遗漏和路由发现、操作时间与纠错次数，再决定只在异常还是默认展示。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
