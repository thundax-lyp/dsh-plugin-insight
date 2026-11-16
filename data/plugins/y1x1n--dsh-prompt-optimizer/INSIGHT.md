# dsh-prompt-optimizer

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d15924d](https://github.com/Y1X1n/dsh-prompt-optimizer/tree/d15924ddcc3c098d04856118c7704cfdd66695ae)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Y1X1n/dsh-prompt-optimizer) [![npm 30d 2,408](https://img.shields.io/static/v1?label=npm+30d&message=2%2C408&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y1x1n/dsh-prompt-optimizer) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@y1x1n/dsh-prompt-optimizer)
<!-- END META -->

> **功能**：在 DSH 输入框旁提供流式提示词改写，并可参考当前会话近期对话。

> **亮点**：[Q01](#research-q01) 把优化动作嵌入发送栏，并将会话模型与近期对话纳入请求。[Q02](#research-q02) 以 SSE 展示分段结果并提供快/完整模式、重试与可回写草稿的交互。

> **主要限制**：[Q01](#research-q01) 上下文含近期用户与助手文本并发送给所选模型，隐私及长度边界需由用户确认。[Q02](#research-q02) 输出仍是模型生成，源码规则不能证明事实准确或严格保真，且流式部分结果在失败时可能已被用户看到。

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
  - [Q01 · 用户从哪里发起优化，草稿、会话模型与对话上下文如何到达模型？](#detail-section-11)
  - [Q02 · 流式生成、取消、超时和备用模型如何处理，失败时用户看到什么？](#detail-section-12)
  - [Q03 · 相对手工改写的增量和实际效果是否有证据？](#detail-section-13)
  - [Q04 · 采用前应验证哪些隐私与内容风险，什么结果足以支持试用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在发送前把提示词草稿整理为更明确指令的 DSH 用户，尤其是已有上下文约束但希望避免重复说明的人。

手动改写草稿或直接发送；固定提交没有与人工改写的质量、耗时或模型成本对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 提示词优化 | 对草稿作结构化改写或意图润色 | 模型输出需人工核对，不保证事实准确 |
| 会话上下文 | 帮助改写理解近期目标与约束 | 可关闭；传入内容会随请求发送给所选模型 |
| 流式交互 | 展示部分输出、重试或回写草稿 | 网络失败、超时可能中止生成 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 插件 Host/Client API | 是 | 注册路由并挂载按钮、设置卡片 | 版本或槽位不兼容会影响入口 |
| 可用模型路由与凭据 | 是 | 通过 ctx.llm 生成结果 | 路由无效时返回错误 |
| 会话历史与模型目录服务 | 否 | 提供上下文和会话级模型选择 | 客户端会分别告警并回退或不带上下文 |
| 网络与模型服务 | 是 | 承载流式生成 | 超时或中断可取消请求 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 安装并启用 | 用户安装插件、配置模型 | 输入区显示优化入口；宿主加载状态需现场确认 |
| 发起优化 | 用户提交草稿；客户端可读会话模型和近期对话 | Host 返回 SSE；无模型路由时显示错误 |
| 审阅结果 | 用户检查输出并选择复制或替换草稿 | 用户负责事实与约束核对；失败可重试或调整设置 |

**效果与成本**

现金成本随模型和输入/上下文 token 变化，来源与计价未固定。首次配置和持续审阅均需人工时间；没有耗时基线。失败恢复包括重试或切换路由，部分流式内容可能已经展示。

已实现的功能是输入区触发、会话相关请求和流式反馈；作者文档列出优化策略及模式。未观察真实用户效果，不能确认输出更准确、节省时间或降低成本。

> **思考**：[Q01](#research-q01) 上下文含近期用户与助手文本并发送给所选模型，隐私及长度边界需由用户确认。[Q02](#research-q02) 输出仍是模型生成，源码规则不能证明事实准确或严格保真，且流式部分结果在失败时可能已被用户看到。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把优化动作嵌入发送栏，并将会话模型与近期对话纳入请求。[Q02](#research-q02) 以 SSE 展示分段结果并提供快/完整模式、重试与可回写草稿的交互。

路由匹配失败先回 409。已有路由失败时，超时、断开或任何流回调都会禁止备用，即使第一段是被过滤的思考内容。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 上下文含近期用户与助手文本并发送给所选模型，隐私及长度边界需由用户确认。[Q02](#research-q02) 输出仍是模型生成，源码规则不能证明事实准确或严格保真，且流式部分结果在失败时可能已被用户看到。

<a id="detail-section-6"></a>

### 1.5 使用建议

从非敏感草稿开始并关闭携带上下文，确认所选提供方及会话标注处理。逐项审查约束，再决定是否替换原文；若结果改变实体、数字或原意，保留原稿并停用自动优化。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认客户端读取当前会话模型及有限近期对话，Host 以 SSE 调用模型并实现超时、断连取消和备用路由。提示规则要求保留原意并标记缺失信息，但输出质量、隐私接受度、节省时间及模型成本未实测。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/client/controller.ts、src/prompt.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定提交中的 README、package、Host 路由、客户端控制器与提示模板。未安装或运行插件，未向模型发送请求，未测质量、隐私、费用、延迟或宿主兼容。
- 下一步：在隔离 DSH profile 使用非敏感草稿，分别测试上下文开关、会话换模型、零输出回退、流中断与超时；记录原稿及输出，逐项比较实体、数字、约束、语气和新增内容。

**分析版本**

- **仓库**：[Y1X1n/dsh-prompt-optimizer](https://github.com/Y1X1n/dsh-prompt-optimizer)
- **版本号**：0.6.4（[固定提交 d15924d](https://github.com/Y1X1n/dsh-prompt-optimizer/tree/d15924ddcc3c098d04856118c7704cfdd66695ae)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 结合会话上下文的意图提炼可能减少缺失约束的重复输入；没有用户试验或质量对照，仍属未验证假设。

在隔离 DSH profile 使用非敏感草稿，分别测试上下文开关、会话换模型、零输出回退、流中断与超时；记录原稿及输出，逐项比较实体、数字、约束、语气和新增内容。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 20 | 3363 | — | — | 60460 |
| .cjs | source | 3 | 504 | 438 | 41 | — |
| .mjs | source | 3 | 328 | 268 | 44 | — |
| .ts | source | 6 | 2348 | 1671 | 548 | — |
| .tsx | source | 6 | 1280 | 1078 | 162 | — |
| .mjs | test | 5 | 2420 | 1968 | 305 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Y1X1n/dsh-prompt-optimizer/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Y1X1n/dsh-prompt-optimizer/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定提交如何将 DSH 草稿、会话上下文和模型路由组合成提示词优化流程，何种条件下可安全有用地采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户从哪里发起优化，草稿、会话模型与对话上下文如何到达模型？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

点击输入栏按钮后，控制器按是否固定模型决定读取会话模型目录。若携带上下文已关闭，历史路径在进入事件窗口和旧会话查询前返回 undefined，上轮优化稿也不会加入。开启时先读本地会话窗口，失败或没有可用对话时探测旧连接查询。POST 总会带当前草稿与 sessionId，路由建议、上下文和上轮结果有值才序列化。宿主检查非空草稿和当前路由；即使客户端仍发送历史，Host 在读取到 includeContext=false 后丢弃 context 与 previous，再构造模型输入。关闭时仍发草稿，并在调用选项保留用于计量或适配器的会话标注。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-15](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/README.md#L12-L15)

作者描述输入区入口、两条 Host 路由和会话模型路由。

```text
DeepSeek Harness 插件:在会话输入框(发送栏)旁提供一个「优化」按钮(✨ 图标),一键分析并优化当前输入的提示词草稿,**结果经 SSE 流式逐段上屏**。优化调用默认复用当前会话的模型路由(每次点击实时读取,会话里切换模型立即生效)。

- **Host 半侧**:注册 `POST /dsh-prompt-optimizer/optimize`(SSE 流式)与 `POST /dsh-prompt-optimizer/test-model`(连通性探活)两条路由,调用 `ctx.llm` 完成「分析 + 改写」。
- **Client 半侧**:向 `conversation.input.right` 槽位注入按钮,向 `conversation.input.dock` 注入结果面板(输入卡上方整行、与 TodoDock 同族,新会话界面也渲染,且不遮挡输入框),向 `settings.plugin.item` 注入可折叠的设置卡片(设置页自动获得配置界面,无需单独开发页面)。界面文案跟随 DSH 界面语言(中文 / English)。
```

**依据 2 · 源码核查**：[src/client/controller.ts:202-280](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/client/controller.ts#L202-L280)

点击后读取会话模型目录和近期对话，再准备优化请求。

<details>
<summary>查看原文（79行）</summary>

```text
  async function optimize(text: string, sessionId: SessionId) {
    // 斜杠命令只优化正文;前缀记入 last,「替换输入框」时拼回(ResultDock 负责)。
    const split = splitCommandPrefix(text)
    const { prefix, body: draft } = split
    if (!draft || state.status === 'loading') return
    // O11:只有命令没有正文——把命令词拿去优化只会得到垃圾输出,直接提示不发请求。
    if (split.commandOnly) {
      set({
        open: true,
        status: 'error',
        error: '检测到斜杠命令但没有正文:请先输入要优化的内容。',
        live: null,
        last: { text: draft, sessionId },
      })
      return
    }
    // 轻量记忆链:同一会话已有优化结果、且本轮草稿较上轮发生了变化(用户在我们
    // 的产物上继续编辑)时,把上轮结果作为延续参考传给模型;发送即关闭面板会清掉
    // result,记忆链自然归零。同文重试(retry)不带——那是重新生成,不是迭代。
    // 跟随「携带上下文」开关:关闭后不带任何会话衍生材料;上轮格式退化
    // (wellFormed=false,可能混入多余文字)的结果也不传,避免噪声延续。
    // 注意:必须在下面 set(loading) 之前读旧 state。
    const previous =
      state.result &&
      state.result.wellFormed &&
      state.last?.sessionId === sessionId &&
      state.last.text !== draft &&
      (opts.isContextEnabled?.() ?? true)
        ? state.result.optimized
        : undefined
    abort?.abort()
    clearLiveTimer()
    liveRaw = ''
    frozenAnalysis = ''
    frozenOptimized = ''
    const controller = new AbortController()
    abort = controller
    // R21 客户端超时看门狗:Host 进程挂死或网络黑洞时,SSE 可能永远不返回首字节,
    // 客户端不能无限转圈。超时触发 abort 并落 error;用户主动取消走 cancel()/close()。
    const watchdogMs = Math.max(1_000, opts.getWatchdogMs?.() ?? 125_000)
    let clientTimedOut = false
    const watchdog = setTimeout(() => {
      clientTimedOut = true
      controller.abort()
    }, watchdogMs)
    // 看门狗触发的超时落明确错误(fetch 抛异常与读流静默结束两条路都要覆盖);
    // 用户主动取消/关闭的状态由 cancel()/close() 负责。
    const failTimeout = () => {
      clearLiveTimer()
      const seconds = Math.round(watchdogMs / 1000)
      set({
        status: 'error',
        live: null,
        error: `请求超时(客户端 ${seconds} 秒无响应,Host 可能未运行)。可在 设置的插件页「提示词优化」 中调高「超时时间」。`,
      })
    }
    // 从点击起计时(含会话查询与首 token 前的等待),done 时记入 result 展示。
    const startedAt = Date.now()
    set({ open: true, status: 'loading', error: null, live: { analysis: '', optimized: '' }, last: { text: draft, sessionId, prefix }, applied: null })
    try {
      // 复用当前会话的模型选择(每次点击实时查询,会话里换模型立即生效);
      // 查询失败时交给 Host 端回退解析。设置里固定了模型时跳过:Host 端
      // 固定值优先,查询结果用不上,省一次 RPC 往返。
      // 会话近期对话作为优化上下文(避免脱离语境「南辕北辙」);与模型查询
      // 相互独立,并行拉取,各自失败各自降级,不阻塞主流程。
      const [selection, context] = await Promise.all([
        (async (): Promise<{ provider?: string; model?: string; reasoningEffort?: string } | undefined> => {
          if (opts.isModelPinned?.()) return undefined
          try {
            // 官方会话模型目录服务(dsh-client-ui-model-selection)与 /model 弹窗
            // 共用同一份目录:`current` 即该会话实际将使用的模型(会话内持久
            // 选择,回落宿主默认)。服务缺席(旧版宿主)时走 Host 回退。
            const directories = opts.getSessionModelDirectories?.()
            if (!directories) {
              console.warn('[dsh-prompt-optimizer] 会话模型目录服务在当前 dsh 版本缺席,改用 Host 回退')
              return undefined
            }
            const state = await directories.directoryFor(sessionId).load()
            const current = state.current
```

</details>

**依据 3 · 源码核查**：[src/index.ts:525-557](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L525-L557)

Host 解析请求文本、模型配置、路由及上下文开关。

<details>
<summary>查看原文（33行）</summary>

```text
  async function handleOptimize(req: IncomingMessage, res: ServerResponse) {
      // 客户端在响应结束前断开连接时,中止模型调用。
      // 注意:必须用 res 的 close;req 的 close 在请求体读完就会触发,不代表断连。
      const abort = new AbortController()
      res.on('close', () => {
        if (!res.writableEnded) abort.abort()
      })

      try {
        const body = await readBodyOrReply(req, res)
        if (!body) return
        const text = asOptionalString(body.text)
        // 会话标注:客户端带来的会话 id(发起优化的会话)优先;缺席(旧版宿主
        // 槽位不投递 sessionId、CLI 直调等)回落合成 id——标注恒存在,保证
        // opencode 等要求会话头的提供方在任何路径上都能路由成功。
        const sessionId = asOptionalString(body.sessionId) ?? ONESHOT_SESSION_ID
        if (!text) {
          writeJson(res, 400, { ok: false, error: '提示词内容为空' })
          return
        }

        const cfg = current()
        // 宽松 schema 的配套归一化:未知枚举值一律回落默认,保证旧版设置文档可用
        //(非法值会先告警一次,见 warnUnknownEnumConfig)。
        warnUnknownEnumConfig(warnedConfigValues, cfg)
        const language: OutputLanguage = cfg.language === 'en' ? 'en' : 'zh'
        const mode: OptimizerMode = cfg.mode === 'fast' ? 'fast' : 'full'
        const route = await resolveRoute(ctx.llm, cfg.model, asOptionalString(body.provider), asOptionalString(body.model))
        if (!route) {
          writeJson(res, 409, {
            ok: false,
            error: '未找到可用模型:请先在 设置 → 模型 中配置提供方,或在 设置的插件页「提示词优化」 中固定一个模型',
          })
```

</details>

**依据 4 · 源码核查**：[src/client/controller.ts:218-231](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/client/controller.ts#L218-L231)

上轮结果要同会话、不同草稿且开关开启。

<details>
<summary>查看原文（14行）</summary>

```text
    // 轻量记忆链:同一会话已有优化结果、且本轮草稿较上轮发生了变化(用户在我们
    // 的产物上继续编辑)时,把上轮结果作为延续参考传给模型;发送即关闭面板会清掉
    // result,记忆链自然归零。同文重试(retry)不带——那是重新生成,不是迭代。
    // 跟随「携带上下文」开关:关闭后不带任何会话衍生材料;上轮格式退化
    // (wellFormed=false,可能混入多余文字)的结果也不传,避免噪声延续。
    // 注意:必须在下面 set(loading) 之前读旧 state。
    const previous =
      state.result &&
      state.result.wellFormed &&
      state.last?.sessionId === sessionId &&
      state.last.text !== draft &&
      (opts.isContextEnabled?.() ?? true)
        ? state.result.optimized
        : undefined
```

</details>

**依据 5 · 源码核查**：[src/client/controller.ts:267-336](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/client/controller.ts#L267-L336)

关开关先跳过历史读取；草稿及会话 ID 继续发给宿主。

<details>
<summary>查看原文（70行）</summary>

```text
      const [selection, context] = await Promise.all([
        (async (): Promise<{ provider?: string; model?: string; reasoningEffort?: string } | undefined> => {
          if (opts.isModelPinned?.()) return undefined
          try {
            // 官方会话模型目录服务(dsh-client-ui-model-selection)与 /model 弹窗
            // 共用同一份目录:`current` 即该会话实际将使用的模型(会话内持久
            // 选择,回落宿主默认)。服务缺席(旧版宿主)时走 Host 回退。
            const directories = opts.getSessionModelDirectories?.()
            if (!directories) {
              console.warn('[dsh-prompt-optimizer] 会话模型目录服务在当前 dsh 版本缺席,改用 Host 回退')
              return undefined
            }
            const state = await directories.directoryFor(sessionId).load()
            const current = state.current
            if (current?.provider && current.model) {
              return { provider: current.provider, model: current.model, reasoningEffort: current.reasoningEffort }
            }
            console.warn('[dsh-prompt-optimizer] 会话没有可用的模型选择,改用 Host 回退:', state.error ?? current)
          } catch (cause) {
            console.warn('[dsh-prompt-optimizer] 会话模型查询失败,改用 Host 回退:', cause)
          }
          return undefined
        })(),
        (async (): Promise<ConversationTurn[] | undefined> => {
          if (!(opts.isContextEnabled?.() ?? true)) return undefined
          // 历史读取先走 0.2.x 的本地事件窗口(ctx.sessions.binding().eventSource),
          // 再退回更早宿主上探测过的 legacy connection.api.sessions.history。
          // 窗口里已由宿主灌入尾部页(500 条 / 至少 2 个 turn / 50 条消息),
          // 足够采样最近 4 条用户输入(见 sampleContextTurns)。
          try {
            const entries = sessionEventEntries(opts.getSessions?.(), sessionId)
            if (entries?.length) {
              const turns = extractContextTurns(entries)
              if (turns.length) return turns
              // 窗口有内容但榨不出可用的 user/assistant 对话(例如只有 transient
              // 实时块、或全是 runtime-context 注入)。**继续**往下降级,不能在这里
              // 直接 return undefined——那会让下面的 legacy 分支变成死代码。
              console.warn('[dsh-prompt-optimizer] 会话事件窗口里没有可用的对话,尝试旧查询面')
            } else {
              console.warn('[dsh-prompt-optimizer] 当前会话没有可读的事件窗口,尝试旧查询面')
            }
          } catch (cause) {
            console.warn('[dsh-prompt-optimizer] 读取会话事件窗口失败,尝试旧查询面:', cause)
          }
          try {
            const history = legacyQueryFace(ctx.connection)?.sessions?.history
            if (!history) {
              console.warn('[dsh-prompt-optimizer] 会话历史查询面在当前 dsh 版本缺席,按无上下文优化')
              return undefined
            }
            const result = await history({ sessionId, maxMessages: 24 }, controller.signal)
            if (result.ok) {
              const turns = extractContextTurns(result.value.events ?? [])
              return turns.length ? turns : undefined
            }
            console.warn('[dsh-prompt-optimizer] 会话历史查询被拒绝,按无上下文优化:', result.error)
          } catch (cause) {
            console.warn('[dsh-prompt-optimizer] 会话历史查询失败,按无上下文优化:', cause)
          }
          return undefined
        })(),
      ])
      const resp = await fetch(ROUTE, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        // sessionId 随请求带给 Host:Host 把它标注到 llm 调用上,要求会话头
        // 的提供方(如 opencode 的 x-opencode-session)才能路由成功,同时
        // 会话级计量会把这次调用归属到当前会话。
        body: JSON.stringify({ text: draft, sessionId, provider: selection?.provider, model: selection?.model, reasoningEffort: selection?.reasoningEffort, context, previous }),
        signal: controller.signal,
```

</details>

**依据 6 · 源码核查**：[src/index.ts:573-589](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L573-L589)

宿主再丢弃历史与前次优化结果。

<details>
<summary>查看原文（17行）</summary>

```text
        // 设置里关掉「携带上下文」时,即使客户端带了 context 也忽略(Host 侧硬开关)。
        const context = cfg.includeContext === false ? undefined : parseContextInput(body.context)
        // 轻量记忆链:上一轮优化结果,截断到 1500 字符(它只是延续参考,不是优化对象)。
        // 与 context 一样跟随「携带上下文」开关——关闭后不带任何会话衍生材料。
        const previousRaw = cfg.includeContext === false ? undefined : asOptionalString(body.previous)
        const previous = previousRaw ? (previousRaw.length > 1500 ? `${previousRaw.slice(0, 1500)}…` : previousRaw) : undefined
        // 0.2.0 把消息源联合收窄为 user/model/tool/system-prompt,但运行时按
        // merge-extensible 容忍未知源(插件署名仍是最直接的审计信息);保留
        // kind:'plugin' 形状,以结构断言跨过两代类型定义。
        const message = {
          id: `prompt-optimizer-${crypto.randomUUID()}`,
          role: 'user',
          content: [{ type: 'text', text: buildUserPayload(text, language, context, previous) }],
          source: { kind: 'plugin', plugin: name },
        } as unknown as Message
        // 策略分叉:有上下文走「提炼目的 + 润色」(不套模板),无上下文走「结构模板」改写。
        const system = buildSystemPrompt(language, mode, context?.length ? 'intent' : 'template')
```

</details>

**依据 7 · 源码核查**：[src/index.ts:632-649](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L632-L649)

经所选 llm 路由发送形成的消息与会话标注。

<details>
<summary>查看原文（18行）</summary>

```text
          for (const attempt of routes) {
            used = attempt
            try {
              const options: GenerateOptions = {
                provider: attempt.provider,
                model: attempt.model,
                system,
                messages: [message],
                maxTokens,
                temperature: cfg.temperature ?? 0.2,
                signal: abort.signal,
                // 会话标注恒存在:客户端会话 id 优先(会话级计量正确归属),
                // 缺席回落合成 id。opencode 等提供方要求会话头(x-opencode-session,
                // 由 pi-ai 适配器按 GenerateOptions.sessionId 注入),缺失会被
                // API 以「缺少请求头」拒绝;其余适配器仅作模型不可见的传输
                // 元数据处理,不外发。
                sessionId: sessionId as GenerateOptions['sessionId'],
              }
```

</details>

#### 缺口

- 未在真实 DSH 宿主确认接口注入和会话历史读取。
  **影响**：影响实际采用或结论范围。
  **进一步探讨**：在隔离宿主及经确认的模型政策下核验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 流式生成、取消、超时和备用模型如何处理，失败时用户看到什么？

**研究主题**：工程质量与复用、效果与总成本

#### 完整回答

Host 在缺少实际主路由时返回 409，不进入 fallback 链。只有有效的备用 provider/model 与主路由不同才追加。模型开始流出文本回调后，先把 sentAny 设为真再过滤思考段，因而即使第一次回调是隐藏内容也会阻止回退。只有无任何回调、未超时且未被取消的失败才尝试下一路由。Host 超时或异常发 SSE error，用户可能已看到部分内容；提前关闭响应触发 abort，客户端也有独立超时。保持草稿原样，待验证实际 provider 与宿主中止行为。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:606-660](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L606-L660)

实现 SSE 心跳、超时取消，并配置首个 delta 前的备用路由重试。

<details>
<summary>查看原文（55行）</summary>

```text
          'content-type': 'text/event-stream; charset=utf-8',
          'cache-control': 'no-cache, no-transform',
          'x-accel-buffering': 'no',
        })
        const send = (event: Record<string, unknown>) => {
          if (!res.destroyed && !res.writableEnded) res.write(`data: ${JSON.stringify(event)}\n\n`)
        }
        // SSE 心跳:首 token 前可能长时间无字节,反代/隧道会按空闲超时掐连接。
        // 注释帧(`:` 开头)被现有客户端解析器忽略(它只认 `data:` 行)。
        const heartbeat = setInterval(() => {
          if (!res.destroyed && !res.writableEnded) res.write(': ping\n\n')
        }, SSE_HEARTBEAT_MS)
        // 超时兜底:模型挂死时中止调用并通知客户端(timedOut 与客户端断连共用 abort,靠标志位区分)。
        const timeoutSec = cfg.timeoutSeconds ?? 120
        let timedOut = false
        const timer = setTimeout(() => {
          timedOut = true
          abort.abort()
        }, timeoutSec * 1000)
        try {
          let sentAny = false
          let used = routes[0]
          let raw: { text: string; truncated: boolean } | null = null
          let lastError: unknown = null
          // O12:主路由零产出失败而启用回退时,把失败原因带给客户端(徽章 tooltip 展示)。
          let fallbackReason: string | undefined
          for (const attempt of routes) {
            used = attempt
            try {
              const options: GenerateOptions = {
                provider: attempt.provider,
                model: attempt.model,
                system,
                messages: [message],
                maxTokens,
                temperature: cfg.temperature ?? 0.2,
                signal: abort.signal,
                // 会话标注恒存在:客户端会话 id 优先(会话级计量正确归属),
                // 缺席回落合成 id。opencode 等提供方要求会话头(x-opencode-session,
                // 由 pi-ai 适配器按 GenerateOptions.sessionId 注入),缺失会被
                // API 以「缺少请求头」拒绝;其余适配器仅作模型不可见的传输
                // 元数据处理,不外发。
                sessionId: sessionId as GenerateOptions['sessionId'],
              }
              let effort = sessionEffort
              if (!preferSessionEffort) {
                effort = (await resolveLowestEffortCached(ctx.llm, attempt.provider, attempt.model)) ?? sessionEffort
              }
              if (effort) {
                options.reasoningEffort = effort as GenerateOptions['reasoningEffort']
              }
              // 思考块过滤:推理模型把 <think>…</think> 当正文输出(内含复述的
              // 标记字样),剥掉后客户端的实时预览与最终解析都只见到真实内容。
              const thinkFilter = createThinkFilter()
              raw = await collectText(ctx.llm.stream(options), (delta) => {
```

</details>

**依据 2 · 源码核查**：[src/client/controller.ts:260-315](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/client/controller.ts#L260-L315)

客户端管理加载与响应流状态。

<details>
<summary>查看原文（56行）</summary>

```text
    set({ open: true, status: 'loading', error: null, live: { analysis: '', optimized: '' }, last: { text: draft, sessionId, prefix }, applied: null })
    try {
      // 复用当前会话的模型选择(每次点击实时查询,会话里换模型立即生效);
      // 查询失败时交给 Host 端回退解析。设置里固定了模型时跳过:Host 端
      // 固定值优先,查询结果用不上,省一次 RPC 往返。
      // 会话近期对话作为优化上下文(避免脱离语境「南辕北辙」);与模型查询
      // 相互独立,并行拉取,各自失败各自降级,不阻塞主流程。
      const [selection, context] = await Promise.all([
        (async (): Promise<{ provider?: string; model?: string; reasoningEffort?: string } | undefined> => {
          if (opts.isModelPinned?.()) return undefined
          try {
            // 官方会话模型目录服务(dsh-client-ui-model-selection)与 /model 弹窗
            // 共用同一份目录:`current` 即该会话实际将使用的模型(会话内持久
            // 选择,回落宿主默认)。服务缺席(旧版宿主)时走 Host 回退。
            const directories = opts.getSessionModelDirectories?.()
            if (!directories) {
              console.warn('[dsh-prompt-optimizer] 会话模型目录服务在当前 dsh 版本缺席,改用 Host 回退')
              return undefined
            }
            const state = await directories.directoryFor(sessionId).load()
            const current = state.current
            if (current?.provider && current.model) {
              return { provider: current.provider, model: current.model, reasoningEffort: current.reasoningEffort }
            }
            console.warn('[dsh-prompt-optimizer] 会话没有可用的模型选择,改用 Host 回退:', state.error ?? current)
          } catch (cause) {
            console.warn('[dsh-prompt-optimizer] 会话模型查询失败,改用 Host 回退:', cause)
          }
          return undefined
        })(),
        (async (): Promise<ConversationTurn[] | undefined> => {
          if (!(opts.isContextEnabled?.() ?? true)) return undefined
          // 历史读取先走 0.2.x 的本地事件窗口(ctx.sessions.binding().eventSource),
          // 再退回更早宿主上探测过的 legacy connection.api.sessions.history。
          // 窗口里已由宿主灌入尾部页(500 条 / 至少 2 个 turn / 50 条消息),
          // 足够采样最近 4 条用户输入(见 sampleContextTurns)。
          try {
            const entries = sessionEventEntries(opts.getSessions?.(), sessionId)
            if (entries?.length) {
              const turns = extractContextTurns(entries)
              if (turns.length) return turns
              // 窗口有内容但榨不出可用的 user/assistant 对话(例如只有 transient
              // 实时块、或全是 runtime-context 注入)。**继续**往下降级,不能在这里
              // 直接 return undefined——那会让下面的 legacy 分支变成死代码。
              console.warn('[dsh-prompt-optimizer] 会话事件窗口里没有可用的对话,尝试旧查询面')
            } else {
              console.warn('[dsh-prompt-optimizer] 当前会话没有可读的事件窗口,尝试旧查询面')
            }
          } catch (cause) {
            console.warn('[dsh-prompt-optimizer] 读取会话事件窗口失败,尝试旧查询面:', cause)
          }
          try {
            const history = legacyQueryFace(ctx.connection)?.sessions?.history
            if (!history) {
              console.warn('[dsh-prompt-optimizer] 会话历史查询面在当前 dsh 版本缺席,按无上下文优化')
              return undefined
```

</details>

**依据 3 · 源码核查**：[src/index.ts:553-570](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L553-L570)

路由未定拒绝，备用只在有效且不同的条件加入。

<details>
<summary>查看原文（18行）</summary>

```text
        if (!route) {
          writeJson(res, 409, {
            ok: false,
            error: '未找到可用模型:请先在 设置 → 模型 中配置提供方,或在 设置的插件页「提示词优化」 中固定一个模型',
          })
          return
        }
        // 回退模型链:设置里配了 fallbackModel('provider/model')时追加一条备用路由。
        // 仅当某次尝试还没向客户端推送过任何 delta 就失败时才换路由重试——
        // 客户端已经看到部分内容后再换路由,输出会变成两个模型的拼接。
        const routes = [route]
        const fallbackRaw = asOptionalString(cfg.fallbackModel)
        if (fallbackRaw) {
          const slash = fallbackRaw.indexOf('/')
          if (slash > 0 && slash < fallbackRaw.length - 1) {
            const fb = { provider: fallbackRaw.slice(0, slash), model: fallbackRaw.slice(slash + 1) }
            if (fb.provider !== route.provider || fb.model !== route.model) routes.push(fb)
          }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:657-675](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L657-L675)

sentAny 在过滤前标记，隐藏增量亦能阻止备用。

<details>
<summary>查看原文（19行）</summary>

```text
              // 思考块过滤:推理模型把 <think>…</think> 当正文输出(内含复述的
              // 标记字样),剥掉后客户端的实时预览与最终解析都只见到真实内容。
              const thinkFilter = createThinkFilter()
              raw = await collectText(ctx.llm.stream(options), (delta) => {
                sentAny = true
                const clean = thinkFilter.push(delta)
                if (clean) send({ type: 'delta', text: clean })
              })
              const thinkTail = thinkFilter.flush()
              if (thinkTail) send({ type: 'delta', text: thinkTail })
              lastError = null
              break
            } catch (error) {
              lastError = error
              if (timedOut || abort.signal.aborted || sentAny) break
              if (attempt !== routes[routes.length - 1]) {
                fallbackReason = error instanceof Error ? error.message : String(error)
                console.error(`[${name}] 主路由 ${attempt.provider}/${attempt.model} 失败,尝试回退路由:`, error)
              }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:679-703](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L679-L703)

结果、超时与失败事件按分支终结。

<details>
<summary>查看原文（25行）</summary>

```text
            const parsed = parseOptimizerOutput(raw.text, mode)
            send({
              type: 'done',
              ...parsed,
              truncated: raw.truncated,
              provider: used.provider,
              model: used.model,
              fallbackUsed: used !== routes[0],
              ...(fallbackReason ? { fallbackReason } : {}),
            })
          } else if (timedOut) {
            send({
              type: 'error',
              error: `优化超时:${timeoutSec} 秒内未生成完毕。可在 设置的插件页「提示词优化」 中调高「超时时间」。`,
            })
          } else if (!abort.signal.aborted && lastError) {
            const message = lastError instanceof Error ? lastError.message : String(lastError)
            console.error(`[${name}] optimize failed:`, lastError)
            send({ type: 'error', error: message })
          }
        } finally {
          clearTimeout(timer)
          clearInterval(heartbeat)
        }
        res.end()
```

</details>

#### 缺口

- 未测反向代理、请求取消及超时实际效果。
  **影响**：影响实际采用或结论范围。
  **进一步探讨**：在隔离宿主及经确认的模型政策下核验。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对手工改写的增量和实际效果是否有证据？

**研究主题**：新假设与验证、贡献与相对优势、效果与总成本

#### 完整回答

源码提供结构模板和意图提炼两类指令，也有长度与保真约束；这些是设计规则而不是输出质量证据。可用基线是用户手工改写或直接发送，但固定材料没有相同任务对照、节时数据、成本账单或用户评价。因此只能确认流程集成和提示策略，不能断言更好、更快或更便宜。

#### 证据与依据

**依据 1 · 源码核查**：[src/prompt.ts:40-75](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/prompt.ts#L40-L75)

定义结构模板及结合会话意图的改写策略。

<details>
<summary>查看原文（36行）</summary>

```text
const STRATEGY_TEMPLATE_ZH = `# 优化方式(结构模板)
将草稿改写为结构完整的提示词,要求:
- 使用与草稿相同的语言
- 忠实保留原意,不臆造用户未表达的需求
- 按结构模板组织(角色 / 任务 / 背景 / 约束 / 输出格式等,内容较长时用 Markdown 小节)
- 缺失但关键的信息不要编造,在文中以 [待补充:……] 标出`

const STRATEGY_TEMPLATE_EN = `# How to optimize (structured template)
Rewrite the draft into a well-structured prompt. Requirements:
- Same language as the draft
- Faithful to the original intent; never invent requirements
- Organize with the structure template (role / task / background / constraints / output format; use Markdown sections for longer prompts)
- Mark missing critical information as [TODO: ...] instead of fabricating it`

// 策略二:有会话上下文 —— 先提炼目的再润色,不套模板。
const STRATEGY_INTENT_ZH = `# 优化方式(提炼目的 + 润色)
用户消息附带 <conversation-context>(该会话的近期对话)。先通读它、提炼用户的真实目的,再围绕该目的对草稿做润色:
- 不要套用模板结构:保留草稿的原始表达框架,顺势打磨、补全细节
- 充分利用上下文已明确的信息(对象、约束、偏好),让优化稿可以直接落地;不要重复追问上下文已经给出的内容
- 识别上下文中已被用户否决或推翻的方向(禁入集合),优化稿不得重复提出
- 草稿与上下文冲突时,以草稿为最终意图,可在优化稿中调和表述
- 上下文仅供理解意图:严禁回答、延续或引用其中的内容;你唯一要优化的对象是 <prompt-draft> 里的草稿
- 使用与草稿相同的语言;草稿与上下文都未提供的关键信息以 [待补充:……] 标出`

const STRATEGY_INTENT_EN = `# How to optimize (distill intent, then polish)
The user message includes <conversation-context> (recent messages of this session). Read it first, distill what the user is really trying to achieve, then polish the draft toward that goal:
- Do NOT force a template structure: keep the draft's original framing, refine it in place and fill the gaps
- Exploit what the context already establishes (subject, constraints, preferences) so the optimized prompt is directly actionable; never re-ask what the context already answers
- Identify directions the user has already rejected or overruled in the context (the do-not-enter set); never propose them again
- If the draft conflicts with the context, the draft wins as the final intent; you may reconcile the wording in the rewrite
- The context only explains intent: never answer, continue, or quote it. The only thing you optimize is the draft inside <prompt-draft>
- Same language as the draft; mark information missing from both draft and context as [TODO: ...]`

// 两种策略共用:保真与明确化纪律(借鉴 Fishsb/dsh-prompt-enhancer 的保真自检/来源可回溯/长度纪律)。
const RULES_ZH = `# 保真与明确化原则(全程遵守)
- 理解优先:先逐条列出草稿已明确的信息(对象、动作、约束、范围、术语、数字、语气),区分「草稿明确表达的」与「你的推测」——推测只可用于措辞,绝不写入结果
```

</details>

**依据 2 · 作者声明**：[README.md:12-15](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/README.md#L12-L15)

README 声称优化草稿并流式输出，但未给对照数据。

```text
DeepSeek Harness 插件:在会话输入框(发送栏)旁提供一个「优化」按钮(✨ 图标),一键分析并优化当前输入的提示词草稿,**结果经 SSE 流式逐段上屏**。优化调用默认复用当前会话的模型路由(每次点击实时读取,会话里切换模型立即生效)。

- **Host 半侧**:注册 `POST /dsh-prompt-optimizer/optimize`(SSE 流式)与 `POST /dsh-prompt-optimizer/test-model`(连通性探活)两条路由,调用 `ctx.llm` 完成「分析 + 改写」。
- **Client 半侧**:向 `conversation.input.right` 槽位注入按钮,向 `conversation.input.dock` 注入结果面板(输入卡上方整行、与 TodoDock 同族,新会话界面也渲染,且不遮挡输入框),向 `settings.plugin.item` 注入可折叠的设置卡片(设置页自动获得配置界面,无需单独开发页面)。界面文案跟随 DSH 界面语言(中文 / English)。
```

#### 缺口

- 无相同任务人工基线和独立质量评价。
  **影响**：影响实际采用或结论范围。
  **进一步探讨**：在隔离宿主及经确认的模型政策下核验。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用前应验证哪些隐私与内容风险，什么结果足以支持试用？

**研究主题**：采用判断、缺陷与关键质疑

#### 完整回答

会话近期对话和草稿可在 includeContext 开启时进入模型请求，且模型可跟随当前会话或固定选择；需要用户确认提供方处理边界。提示模板要求避免臆造并标记待补充，但模型仍可能遗漏或新增内容。建议仅对非敏感样本逐项核验实体、数字、边界及语气，并测试关闭上下文后的结果；任何敏感信息传输不符合预期或关键约束被改写时停止使用。源码不能回答数据保留或服务端训练策略。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:551-557](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/index.ts#L551-L557)

Host 可按配置排除上下文。

```text
        const mode: OptimizerMode = cfg.mode === 'fast' ? 'fast' : 'full'
        const route = await resolveRoute(ctx.llm, cfg.model, asOptionalString(body.provider), asOptionalString(body.model))
        if (!route) {
          writeJson(res, 409, {
            ok: false,
            error: '未找到可用模型:请先在 设置 → 模型 中配置提供方,或在 设置的插件页「提示词优化」 中固定一个模型',
          })
```

**依据 2 · 源码核查**：[src/prompt.ts:40-75](https://github.com/Y1X1n/dsh-prompt-optimizer/blob/d15924ddcc3c098d04856118c7704cfdd66695ae/src/prompt.ts#L40-L75)

提示指令要求保持原意并标记缺失信息。

<details>
<summary>查看原文（36行）</summary>

```text
const STRATEGY_TEMPLATE_ZH = `# 优化方式(结构模板)
将草稿改写为结构完整的提示词,要求:
- 使用与草稿相同的语言
- 忠实保留原意,不臆造用户未表达的需求
- 按结构模板组织(角色 / 任务 / 背景 / 约束 / 输出格式等,内容较长时用 Markdown 小节)
- 缺失但关键的信息不要编造,在文中以 [待补充:……] 标出`

const STRATEGY_TEMPLATE_EN = `# How to optimize (structured template)
Rewrite the draft into a well-structured prompt. Requirements:
- Same language as the draft
- Faithful to the original intent; never invent requirements
- Organize with the structure template (role / task / background / constraints / output format; use Markdown sections for longer prompts)
- Mark missing critical information as [TODO: ...] instead of fabricating it`

// 策略二:有会话上下文 —— 先提炼目的再润色,不套模板。
const STRATEGY_INTENT_ZH = `# 优化方式(提炼目的 + 润色)
用户消息附带 <conversation-context>(该会话的近期对话)。先通读它、提炼用户的真实目的,再围绕该目的对草稿做润色:
- 不要套用模板结构:保留草稿的原始表达框架,顺势打磨、补全细节
- 充分利用上下文已明确的信息(对象、约束、偏好),让优化稿可以直接落地;不要重复追问上下文已经给出的内容
- 识别上下文中已被用户否决或推翻的方向(禁入集合),优化稿不得重复提出
- 草稿与上下文冲突时,以草稿为最终意图,可在优化稿中调和表述
- 上下文仅供理解意图:严禁回答、延续或引用其中的内容;你唯一要优化的对象是 <prompt-draft> 里的草稿
- 使用与草稿相同的语言;草稿与上下文都未提供的关键信息以 [待补充:……] 标出`

const STRATEGY_INTENT_EN = `# How to optimize (distill intent, then polish)
The user message includes <conversation-context> (recent messages of this session). Read it first, distill what the user is really trying to achieve, then polish the draft toward that goal:
- Do NOT force a template structure: keep the draft's original framing, refine it in place and fill the gaps
- Exploit what the context already establishes (subject, constraints, preferences) so the optimized prompt is directly actionable; never re-ask what the context already answers
- Identify directions the user has already rejected or overruled in the context (the do-not-enter set); never propose them again
- If the draft conflicts with the context, the draft wins as the final intent; you may reconcile the wording in the rewrite
- The context only explains intent: never answer, continue, or quote it. The only thing you optimize is the draft inside <prompt-draft>
- Same language as the draft; mark information missing from both draft and context as [TODO: ...]`

// 两种策略共用:保真与明确化纪律(借鉴 Fishsb/dsh-prompt-enhancer 的保真自检/来源可回溯/长度纪律)。
const RULES_ZH = `# 保真与明确化原则(全程遵守)
- 理解优先:先逐条列出草稿已明确的信息(对象、动作、约束、范围、术语、数字、语气),区分「草稿明确表达的」与「你的推测」——推测只可用于措辞,绝不写入结果
```

</details>

#### 缺口

- 提供方保留策略、数据使用政策和真实输出保真率未核查。
  **影响**：影响实际采用或结论范围。
  **进一步探讨**：在隔离宿主及经确认的模型政策下核验。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
