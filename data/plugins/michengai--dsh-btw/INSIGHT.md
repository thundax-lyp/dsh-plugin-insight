# DSH BTW

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[0966199](https://github.com/MichengAI/dsh-btw/tree/096619904ac7f9bbc50c808224803cbb44d8b978)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/MichengAI/dsh-btw) [![npm 30d 30,816](https://img.shields.io/static/v1?label=npm+30d&message=30%2C816&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-btw) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@michengai/dsh-btw)
<!-- END META -->

> **功能**：基于 DSH 会话上下文生成一次性旁问，在独立气泡显示答案，并限制子代理工具调用。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，可从主会话发起一次有上下文的提问，单独显示已完成的文本，省去手工准备第二个会话。

> **主要限制**：[Q03](#research-q03) 默认仍允许向父会话发消息。明确授权的要求依赖提示，执行门验证的是接收者。白名单可扩大工具范围。

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
  - [Q01 · 旁问比直接在主线提问增加什么？](#detail-section-11)
  - [Q02 · 如何从对话构建旁问并显示结果？](#detail-section-12)
  - [Q03 · 只读和不扰动主线的真实边界是什么？](#detail-section-13)
  - [Q04 · 如何使用及停止、恢复？](#detail-section-14)
  - [Q05 · 能否以同任务对照证实主线保持？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：正在阅读 DSH 长会话的用户，需要临时解释一个概念或总结局部内容，并尽量保留主任务流程。

直接插问主会话，或另开会话并手工复制必要上下文。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **用户命令**：btw 及内部运行、关闭命令
- **界面**：独立旁问气泡
- **事件监听**：子代理身份认领与生命周期

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明的 Node 和 DSH，Host Commands、Tools、Subagents | 启动必需 | 装载命令与守卫 | 插件可能无法运行 |
| 可继承上下文的 fork 与可用模型 | 提问必需 | 创建旁问和生成文字 | 返回错误或不完整 |
| Web 客户端相关服务 | 气泡必需 | 显示独立状态和关闭 | 入口或呈现不可用 |
| 工具白名单 | 可选 | 扩大可执行工具范围 | 仅保留限父会话回传例外 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择测试副本并留空白名单 | 已知父会话和可用模型 |
| 加载 | Host 装载插件，用户打开会话 | 旁问入口出现 |
| 执行 | 用户问与当前文本相关的简短问题 | 独立气泡得到完成文本 |
| 验收 | 用户核对父会话及工具事件 | 异常即关闭并回手工流程 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配 DSH、模型和测试会话 | 核对版本、工具设置与上下文 | 初始耗时及配置差异未知 |
| 持续使用 | 额外模型调用、浏览器状态及宿主并发配额 | 核对结果、复制要留存的答案 | 缓存和每问费用无实测 |
| 失败恢复 | 原会话、独立副本或手工新会话 | 关闭、核对工具事件和父会话，恢复原方法 | 取消后上游资源、人时未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 旁问呈现 | 固定源码区分父会话和气泡 | 真实模型解释准确性和任务节时 |
| 执行限制 | 有按身份与工具名的执行守卫 | 真实回传及主线影响 |
| 退出 | 有范围化关闭、墓碑及有界等待 | 资源是否及时释放、费用和恢复人时 |

> **思考**：[Q03](#research-q03) 默认仍允许向父会话发消息。明确授权的要求依赖提示，执行门验证的是接收者。白名单可扩大工具范围。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，可从主会话发起一次有上下文的提问，单独显示已完成的文本，省去手工准备第二个会话。

用户请求、父会话与子代理身份分别绑定。出错与关闭有独立时序，执行期工具守卫和提示授权的作用需分开核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认仍允许向父会话发消息。明确授权的要求依赖提示，执行门验证的是接收者。白名单可扩大工具范围。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 先在无敏感内容的副本问一项解释，核对气泡文本、父会话和工具记录。[Q03](#research-q03) 默认空白名单仍有回传例外，主会话不能接受任何非预期消息时继续使用另开会话的手工办法。[Q04](#research-q04) 若关闭失败，停用并重新核对状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 Host、浏览器旁问、子代理守卫和关闭接线。真实宿主、模型缓存、父会话回传及成本待验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client/bubbles.ts、src/client/index.tsx、src/server/jobs.ts、src/server/tool-guard.ts、src/locales.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的文本旁问、工具守卫、气泡和关闭。划词引用全部操作、宿主服务日志、缓存与任何上游效果均未完整审计。
- 下一步：仅固定源码。下一步在隔离宿主用受控模型比较纯文字、父会话回传、错目标回传和未列工具的事件，另关闭一个迟到结果的旁问核对终态。

**分析版本**

- **仓库**：[MichengAI/dsh-btw](https://github.com/MichengAI/dsh-btw)
- **版本号**：1.3.5（[固定提交 0966199](https://github.com/MichengAI/dsh-btw/tree/096619904ac7f9bbc50c808224803cbb44d8b978)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 同内容的主线和旁问对照可区分独立气泡、真实主线事件和缓存用量，检验无干扰和节省主张。

仅固定源码。下一步在隔离宿主用受控模型比较纯文字、父会话回传、错目标回传和未列工具的事件，另关闭一个迟到结果的旁问核对终态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1122 | — | — | 16114 |
| .js | source | 2 | 16265 | 14646 | 1487 | — |
| .mjs | source | 6 | 221 | 204 | 8 | — |
| .tsx | source | 9 | 1887 | 1618 | 117 | — |
| .ts | source | 17 | 1958 | 1644 | 175 | — |
| .ts | test | 30 | 5806 | 4969 | 276 | — |
| .mjs | test | 3 | 108 | 95 | 2 | — |
| .tsx | test | 1 | 88 | 85 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/MichengAI/dsh-btw/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 16](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=16&color=737b86&logo=github)](https://github.com/MichengAI/dsh-btw/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/MichengAI/dsh-btw/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断 DSH 用户能否从当前对话发出一次解释性旁问，并明确旁问对上下文、宿主工具、主会话和状态留存的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 旁问比直接在主线提问增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

正在阅读长对话并处理主任务的用户，可用 `/btw` 得到单次解释或总结。作者描述独立气泡与不打断主任务，根 DSH 包实际挂载命令和 Web 客户端。相对在主会话插入新问题或另开会话手工复制上下文，它将问题放到子代理，浏览器单独呈现。合格结果应有准确解释，并能确认主任务状态及主记录的预期变化。对简单问答，手开新对话也是可行替代。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:137-154](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/README.md#L137-L154)

作者的旁问交互及会话边界

<details>
<summary>查看原文（18行）</summary>

```text
| 目标 | 操作 |
| --- | --- |
| 提一个旁问 | 输入 `/btw 问题` 并提交，或从 `/` 菜单选择 `btw`。 |
| 查看答案 | 等待输入框上方的独立气泡返回回答。 |
| 复制答案 | 点击气泡右上角的复制图标。 |
| 收起或展开 | 点击气泡右上角的折叠或展开图标。 |
| 取消旁问 | 在回答过程中关闭对应气泡，不取消主任务。 |
| 移除答案 | 关闭已完成的气泡。 |
| 继续提问 | 再次输入 `/btw 问题`；每次都是独立旁问。 |

若需要执行命令、修改代码或继续主任务，请通过普通会话提交。BTW 只能依据已有上下文作答。

BTW 只接受文字。输入框中附带图片或普通文件时会拒绝旁问，并保留输入和附件，请移除附件后重试。

### 使用说明

- 每次旁问相互独立，参考的是提问时主会话已完成的内容，不包含正在生成的回答或之前的旁问。
- 刷新页面后气泡不会保留，需要保存的答案请先复制。
```

</details>

**依据 2 · 源码核查**：[package.json:41-56](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/package.json#L41-L56)

根 bundle 与 Web 注入

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-input-trigger",
        "@deepseek-ai/dsh-client-ui-primitives",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings"
      ]
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/cordis.patch.yml#L1-L3)

插件组合

```text
- insert:
    - id: michengai-btw
      name: '@michengai/dsh-btw'
```

**依据 4 · 源码核查**：[src/index.ts:184-205](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L184-L205)

实际旁问命令

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.effect(() => ctx.commands.register({
    name: 'btw',
    description: translate()('command.description'),
    input: { hint: translate()('command.hint') },
    recordInput: false,
    handler: invocation => {
      const question = invocation.rawInput.trim()
      if (!question) return { kind: 'error', text: translate()('error.empty') }
      if (question.length > MAX_QUESTION_LENGTH) return { kind: 'error', text: translate()('error.length') }
      return jobs.ask(invocation.agent.session.header.id, globalThis.crypto.randomUUID(), question, invocation.signal, invocation.agent)
    },
  }))
  ctx.effect(() => ctx.commands.register({
    name: RUN_COMMAND,
    description: translate()('command.internalRun'),
    recordInput: false,
    handler: invocation => {
      try {
        const request = parseRequest(invocation.rawInput)
        return jobs.ask(invocation.agent.session.header.id, request.id, questionWithReference(request.question, request.reference, request.locale), invocation.signal, invocation.agent, request.locale)
      } catch (error) { return { kind: 'error', text: error instanceof Error ? error.message : translate()('error.request') } }
    },
```

</details>

**依据 5 · 源码核查**：[src/client/bubbles.ts:75-94](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/client/bubbles.ts#L75-L94)

独立气泡呈现

<details>
<summary>查看原文（20行）</summary>

```text
    const id = newRequestId()
    const controller = new AbortController()
    this.active.set(id, controller)
    this.runEnd.set(id, 'pending')
    this.publish([...this.snapshot, { id, sessionId, question, ...(reference === undefined ? {} : { reference }), answer: '', phase: 'answering' }])
    void Promise.resolve().then(() => reference === undefined ? this.transport.run(sessionId, id, question, controller.signal) : this.transport.run(sessionId, id, question, controller.signal, reference)).then(result => {
      if (result.kind === 'success') {
        this.runEnd.set(id, 'success')
        if (!this.snapshot.some(item => item.id === id)) return
        const failedClose = this.closeFenced.has(id) || Boolean(this.snapshot.find(item => item.id === id)?.closeFailed)
        this.update(id, { phase: failedClose ? 'error' : this.closing.has(id) ? 'closing' : 'done', answer: result.text, ...(failedClose ? {} : { error: undefined }) })
        return
      }
      if (controller.signal.aborted) {
        if (this.runEnd.get(id) === 'pending') this.runEnd.set(id, 'aborted')
        this.dropIfCloseCannotFinish(id)
        return
      }
      this.runEnd.set(id, 'failed')
      if (!this.closing.has(id)) this.update(id, { phase: 'error', answer: '', error: result.text })
```

</details>

#### 缺口

- 没有主线与旁问的同任务对照。
  **影响**：无法估计节省了多少上下文复制、时间和主线干扰。
  **进一步探讨**：用一段可控上下文比较普通提问、手开会话与气泡。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从对话构建旁问并显示结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

浏览器将会话、ID、文字及可选引用经 DSH 远程命令送到 Host，输入含附件或已属子代理时 UI 可拒绝。Host 要求 `fork` provider 声明继承父上下文，按新旧宿主接口创建子代理。新路径预登记身份并设置 `delivery: caller`，后端只接受 completed 的文本并清理工具标记，浏览器按请求 ID 渲染独立气泡。输出预算有上限，但读取哪些历史事件与缓存是否命中取决于宿主 provider 和模型。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:117-151](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/client/index.tsx#L117-L151)

浏览器调用、会话参数及输入限制

<details>
<summary>查看原文（35行）</summary>

```text
export function apply(ctx: Context): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }))
  const t = ctx.locale.bind(NS)
  const slots = ctx.get('slots') as SlotRegistry
  const remote = ctx.get('remote') as TypertClientRemote
  const sessions = ctx.get('sessions') as unknown as ISessions
  // 普通分叉也有父会话；只使用宿主明确给出的子代理身份，不按 parentId 猜测。
  const isSubagent = (id: string): boolean => Boolean(sessions.subagentAddress?.(id as SessionId)) || sessions.list?.getSnapshot().byId[id as SessionId]?.origin === 'subagent'
  const execute = async (session: string, line: string, signal?: AbortSignal): Promise<SideResult> => {
    const response = await remote.commands.execute(session as SessionId, line, [], signal)
    if (!response.ok) {
      const failure = response.error
      const code: string = failure.code
      const details = failure.details
      const reason = details && typeof details === 'object' && 'reason' in details && typeof details.reason === 'string' ? details.reason : undefined
      const ownedBySubagent = (code === 'agent-busy' || code === 'session/agent-busy')
        && (reason === 'use subagent delivery for this child session' || failure.message === `session "${session}" is owned by subagent routing`)
      if (ownedBySubagent) throw new SideRequestNotStartedError(t('error.subagent'))
      throw new Error(failure.message)
    }
    if (!response.value) throw new Error(t('error.backend'))
    return { kind: response.value.result.kind, text: response.value.result.text ?? '' }
  }
  const store = new BubbleStore({
    run: (session, id, question, signal, reference) => execute(session, `/${RUN_COMMAND} ${JSON.stringify({ id, question, reference, locale: normalizeLocale(t('locale.id')) })}`, signal),
    close: (session, id) => execute(session, `/${CLOSE_COMMAND} ${id}`),
  }, t)
  const quoteStore = new QuoteStore()

  const claim = (sessionId: SessionId): PickOutcome => ({ claim: {
    name: 'btw', token: '/btw ', get hint() { return t('command.hint') },
    submit: async (args, _actx, attachments) => {
      if (isSubagent(sessionId)) return { kind: 'error', text: t('error.subagent') }
      if (attachments.length) return { kind: 'error', text: t('error.attachments') }
      try {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:67-82](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L67-L82)

fork provider 前提及提示内容

<details>
<summary>查看原文（16行）</summary>

```text
  const jobs = new SideJobs(async request => {
    // 0.2.1-rc.1 起只有 startActivation；0.2.0-rc.1 与 0.2.0-rc.2 仍只有 start。
    const provider = ctx.subagents.getProvider('fork')
    const t = translate(request.locale)
    if (!provider?.inheritsParentContext) {
      throw new Error(t('error.provider'))
    }
    const label = t('agent.name')
    retainLabel(label)
    const parentId = (request.context as Agent | undefined)?.session?.header?.id
    const settings = settingsNow()
    const replyHint = parentId === undefined ? '' : `\n\n${t('agent.replyHint', { parent: JSON.stringify(parentId) })}`
    // 自定义提示词替换内置前缀；工具权限句始终追加，配置不能让模型误以为「什么都能调」。
    const permissions = settings.allowedTools.length === 0 ? '' : `\n\n${t('agent.toolsAllowed', { tools: settings.allowedTools.join(', ') })}`
    const prefix = settings.promptPrefix === '' ? t('agent.promptPrefix') : settings.promptPrefix
    const promptText = `${prefix}${permissions}${replyHint}\n\n${request.question}`
```

</details>

**依据 3 · 源码核查**：[src/index.ts:100-139](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L100-L139)

新宿主子代理路径及身份

<details>
<summary>查看原文（40行）</summary>

```text
    const parentAgent = request.context as Agent | undefined
    const parentMaxTokens = parentAgent?.options?.maxTokens
    const maxTokens = typeof parentMaxTokens === 'number' && parentMaxTokens > 0
      ? Math.min(SIDE_MAX_OUTPUT_TOKENS, parentMaxTokens)
      : SIDE_MAX_OUTPUT_TOKENS
    if (typeof subagents.startActivation === 'function') {
      const childId = SessionId(globalThis.crypto.randomUUID())
      const releaseChildId = protection.ownId(childId)
      let childAgent: object | undefined
      try {
        const stopCreated = ctx.on('agent/created', ({ agent }) => {
          if (agent.id !== childId) return undefined
          childAgent = agent
          // 只挂执行期拦截，不改系统提示、不过滤工具定义：请求前缀与主会话逐字节一致，
          // 才能复用主会话的 prompt cache（与 Claude Code /btw 一致）。
          arm(agent as GuardedAgent)
          return undefined
        })
        let activation
        try {
          activation = await subagents.startActivation({
            provider: 'fork',
            label,
            childId,
            request: {
              parent: request.context as Agent,
              // 旁问只需一次性只读回答：收紧继承来的过大输出预算，避免长会话溢出；
              // 同时取 min 避免反向抬高小预算路由。
              agentOptions: { maxTokens },
              prompt: [{ type: 'text', text: promptText }],
            },
            signal: request.signal,
            delivery: 'caller',
          })
        } finally {
          stopCreated()
        }
        // 结果落地即释放预登记 id：dispose 可能因 cleanup 超时未被调用，
        // 释放放在两处（此处与 dispose）保证 ownedIds 不会只增不减；重复释放无副作用。
        void activation.result.then(() => releaseChildId(), () => releaseChildId())
```

</details>

**依据 4 · 源码核查**：[src/index.ts:156-174](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L156-L174)

旧宿主 start 兼容

<details>
<summary>查看原文（19行）</summary>

```text
    if (typeof subagents.start !== 'function') {
      releaseLabel(label)
      throw new Error(t('error.provider'))
    }
    try {
      // 不传 persona / toolFilter，理由同上；工具由 AnswerOnlyGuard 在执行期拒绝。
      const run = await subagents.start('fork', {
        parent: request.context as Agent,
        label,
        signal: request.signal,
        agentOptions: { maxTokens },
        prompt: [{ type: 'text', text: promptText }],
      })
      if (run.localAgent) arm(run.localAgent)
      return {
        result: run.result,
        dispose: async () => {
          try { await run.dispose() }
          finally { await releaseChild(run.localAgent); releaseLabel(label) }
```

</details>

**依据 5 · 源码核查**：[src/server/jobs.ts:134-149](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/jobs.ts#L134-L149)

只接受已完成文本与清理

<details>
<summary>查看原文（16行）</summary>

```text
      const run = await this.interruptible(starting, request.signal)
      const response = await this.interruptible(run.result, request.signal)
      request.signal.throwIfAborted()
      const rawText = response.output.filter(block => block.type === 'text').map(block => block.text ?? '').join('').trim()
      const text = sanitizeModelAnswer(rawText)
      if (response.stopReason !== 'completed') throw new Error(job.t('error.incomplete', { reason: response.stopReason, detail: text ? `\n\n${text}` : '' }))
      if (!text) throw new Error(job.t('error.noText'))
      result = { kind: 'success', text }
    } catch (error) { result = failure(error) }
    if (request.signal.aborted) {
      this.cleanupLater(job)
      return result
    }
    try { await this.cleanup(job) }
    catch (error) { this.report(job, error) }
    return result
```

</details>

**依据 6 · 源码核查**：[src/client/bubbles.ts:75-94](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/client/bubbles.ts#L75-L94)

请求 ID 和气泡更新

<details>
<summary>查看原文（20行）</summary>

```text
    const id = newRequestId()
    const controller = new AbortController()
    this.active.set(id, controller)
    this.runEnd.set(id, 'pending')
    this.publish([...this.snapshot, { id, sessionId, question, ...(reference === undefined ? {} : { reference }), answer: '', phase: 'answering' }])
    void Promise.resolve().then(() => reference === undefined ? this.transport.run(sessionId, id, question, controller.signal) : this.transport.run(sessionId, id, question, controller.signal, reference)).then(result => {
      if (result.kind === 'success') {
        this.runEnd.set(id, 'success')
        if (!this.snapshot.some(item => item.id === id)) return
        const failedClose = this.closeFenced.has(id) || Boolean(this.snapshot.find(item => item.id === id)?.closeFailed)
        this.update(id, { phase: failedClose ? 'error' : this.closing.has(id) ? 'closing' : 'done', answer: result.text, ...(failedClose ? {} : { error: undefined }) })
        return
      }
      if (controller.signal.aborted) {
        if (this.runEnd.get(id) === 'pending') this.runEnd.set(id, 'aborted')
        this.dropIfCloseCannotFinish(id)
        return
      }
      this.runEnd.set(id, 'failed')
      if (!this.closing.has(id)) this.update(id, { phase: 'error', answer: '', error: result.text })
```

</details>

#### 缺口

- 尚未运行实际宿主与上游模型。
  **影响**：不能确认前缀复用、缓存命中或上下文精确范围。
  **进一步探讨**：以唯一测试标记检查哪些消息被子代理看到，并对比缓存用量。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 只读和不扰动主线的真实边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

插件不从模型请求删除工具定义，主要用执行期守卫识别旁问。新路径预登记 ID，另用已认领对象或标签兜底；身份无法识别时守卫放行，以免影响普通主会话。默认白名单为空仍允许 `send_message` 发给自身父会话。只有用户明确要求才回传是提示要求，实际闸门只校验工具名和接收者，模型误触发的可能需实测。启用白名单时工具名匹配即可通过这层守卫，因此工具自身副作用由宿主继续决定。`recordInput:false` 和仅内存气泡描述的是两个具体边界，不能外推所有服务日志或父会话绝对不变。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:29-51](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L29-L51)

插件 guard 和子代理认领接线

<details>
<summary>查看原文（23行）</summary>

```text
  ctx.effect(() => hideInternalCommands(ctx.commands))
  const labels = new Set<string>()
  // 配置每读一次都重新解包：设置面板改完立即对下一次旁问生效，不需要重载插件。
  const settingsNow = () => readSettings(config)
  // 保护挂在子代理自己的上下文上，随子代理释放，不借用宿主根 fiber。
  // dsh-tui 会拒绝插件激活期间的 root.effect / root.events。
  const protection = createAnswerOnlyGuard(labels, identityOfFromContext(ctx), () => settingsNow().allowedTools)
  const releasePluginGuard = ctx.tools.guard(protection)
  const childGuards = new WeakMap<object, () => void | Promise<void>>()
  const arm = (agent: GuardedAgent) => {
    // child 级 guard 只是纵深防御：确定性拦截已由 ownId 预登记承担（agent.id === childId），
    // 因此 agent.ctx 尚未就绪时静默跳过不影响拦截能力；不要往这里加唯一的必要限制。
    protection.own(agent)
    if (!agent.ctx || childGuards.has(agent)) return
    childGuards.set(agent, agent.ctx.tools.guard(protection))
  }
  const releaseChild = async (agent: object | undefined) => {
    if (!agent) return
    const release = childGuards.get(agent)
    childGuards.delete(agent)
    await release?.()
  }
  const stopWatch = ctx.on('session/event', (session, event) => protection.recognize(session, event))
```

</details>

**依据 2 · 源码核查**：[src/index.ts:105-132](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L105-L132)

新接口预登记身份，保留继承工具定义

<details>
<summary>查看原文（28行）</summary>

```text
    if (typeof subagents.startActivation === 'function') {
      const childId = SessionId(globalThis.crypto.randomUUID())
      const releaseChildId = protection.ownId(childId)
      let childAgent: object | undefined
      try {
        const stopCreated = ctx.on('agent/created', ({ agent }) => {
          if (agent.id !== childId) return undefined
          childAgent = agent
          // 只挂执行期拦截，不改系统提示、不过滤工具定义：请求前缀与主会话逐字节一致，
          // 才能复用主会话的 prompt cache（与 Claude Code /btw 一致）。
          arm(agent as GuardedAgent)
          return undefined
        })
        let activation
        try {
          activation = await subagents.startActivation({
            provider: 'fork',
            label,
            childId,
            request: {
              parent: request.context as Agent,
              // 旁问只需一次性只读回答：收紧继承来的过大输出预算，避免长会话溢出；
              // 同时取 min 避免反向抬高小预算路由。
              agentOptions: { maxTokens },
              prompt: [{ type: 'text', text: promptText }],
            },
            signal: request.signal,
            delivery: 'caller',
```

</details>

**依据 3 · 源码核查**：[src/server/tool-guard.ts:59-73](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/tool-guard.ts#L59-L73)

父会话接收者检查

<details>
<summary>查看原文（15行）</summary>

```text
export const REPLY_TOOL = 'send_message'

/** 本次旁问所属父会话的 id；没有父会话时不存在回传通道。 */
export function parentSessionOf(agent: AgentIdentity | undefined): string | undefined {
  const parent = (agent?.session as { header?: { parentSession?: unknown } } | undefined)?.header?.parentSession
  return typeof parent === 'string' ? parent : undefined
}

/** 仅当工具是 `send_message` 且目标严格等于父会话 id 时放行，其余一律拒绝。 */
function isReplyToParent(name: string | undefined, args: unknown, agent: AgentIdentity | undefined): boolean {
  if (name !== REPLY_TOOL) return false
  const target = (args as { agent_id?: unknown } | undefined)?.agent_id
  const parent = parentSessionOf(agent)
  return parent !== undefined && typeof target === 'string' && target === parent
}
```

</details>

**依据 4 · 源码核查**：[src/server/tool-guard.ts:141-168](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/tool-guard.ts#L141-L168)

白名单和未识别身份的放行分支

<details>
<summary>查看原文（28行）</summary>

```text
  const guard: AnswerOnlyGuard = ({ agent, name, arguments: args }) => {
    if (!agent) return undefined
    // 放行集合：把答案发回自己的父会话，加上用户配置的白名单工具。
    // 其余工具、以及发给其它 agent 的 send_message 一律拒绝。
    // 三条认领路径（预登记 id / 已认领对象 / 投影或快照 label）都必须返回 verdict，
    // 否则 isOwnedId 先短路会让回传通道在生产主路径上失效。
    const allowed = allowedNow()
    // 白名单只覆盖普通工具；回传工具的父会话归属校验由 `isReplyToParent` 独占，
    // 配置无法把「只能交回自己的主会话」放宽成「发给任意 agent」。
    const permitted = isReplyToParent(name, args, agent)
      || (name !== undefined && allowed.includes(name))
    const verdict = permitted ? undefined : denyFor(allowed)
    if (isOwnedId(agent)) return verdict
    if (owned.has(agent) || (agent.session !== undefined && owned.has(agent.session))) return verdict
    const label = lastDescriptorLabel(agent.session, identityOf)
    if (!label || !labels.has(label)) return undefined
    claimAgent(agent)
    return verdict
  }
  guard.own = agent => { claimAgent(agent) }
  guard.ownId = id => {
    ownedIds.add(id)
    return () => { ownedIds.delete(id) }
  }
  guard.recognize = (session, event) => {
    if (event.type !== 'subagent/descriptor') return
    const label = descriptorLabel(event.data)
    if (label && labels.has(label)) claim(session)
```

</details>

**依据 5 · 源码核查**：[src/locales.ts:79-79](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/locales.ts#L79-L79)

明确请求才回传属于提示

```text
  'agent.replyHint': '回答默认只留在这个旁问气泡里，不会自动回到主对话。只有当用户在这次提问中明确要求把答案发回主对话时，才调用 send_message 把一份自足的完整答案发给主会话（agent_id 为 {parent}，主对话看不到这段旁问对话）。用户没有要求时不要调用它。',
```

**依据 6 · 源码核查**：[src/index.ts:184-205](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L184-L205)

命令关闭输入记录

<details>
<summary>查看原文（22行）</summary>

```text
  ctx.effect(() => ctx.commands.register({
    name: 'btw',
    description: translate()('command.description'),
    input: { hint: translate()('command.hint') },
    recordInput: false,
    handler: invocation => {
      const question = invocation.rawInput.trim()
      if (!question) return { kind: 'error', text: translate()('error.empty') }
      if (question.length > MAX_QUESTION_LENGTH) return { kind: 'error', text: translate()('error.length') }
      return jobs.ask(invocation.agent.session.header.id, globalThis.crypto.randomUUID(), question, invocation.signal, invocation.agent)
    },
  }))
  ctx.effect(() => ctx.commands.register({
    name: RUN_COMMAND,
    description: translate()('command.internalRun'),
    recordInput: false,
    handler: invocation => {
      try {
        const request = parseRequest(invocation.rawInput)
        return jobs.ask(invocation.agent.session.header.id, request.id, questionWithReference(request.question, request.reference, request.locale), invocation.signal, invocation.agent, request.locale)
      } catch (error) { return { kind: 'error', text: error instanceof Error ? error.message : translate()('error.request') } }
    },
```

</details>

**依据 7 · 源码核查**：[src/client/bubbles.ts:33-44](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/client/bubbles.ts#L33-L44)

浏览器仅内存状态

<details>
<summary>查看原文（12行）</summary>

```text
/** 仅内存 UI 状态；关闭请求与答案返回按请求身份分别收敛。 */
export class BubbleStore {
  private snapshot: readonly Bubble[] = []
  private readonly listeners = new Set<() => void>()
  private readonly active = new Map<string, AbortController>()
  private readonly closing = new Map<string, Promise<void>>()
  private readonly notStarted = new Set<string>()
  private readonly runEnd = new Map<string, 'pending' | 'success' | 'not-started' | 'aborted' | 'failed'>()
  private readonly closeFenced = new Set<string>()
  private readonly admitting = new Set<string>()
  private disposed = false
  constructor(private readonly transport: SideTransport, private readonly t: BtwTranslate = translate()) {}
```

</details>

#### 缺口

- 缺旁问执行、父会话追加和工具事件的真实对照。
  **影响**：不能把默认气泡解释为写隔离或零工具执行。
  **进一步探讨**：用受控模型分别尝试回自己父会话、回其他会话及调用未列工具，比较实际事件。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何使用及停止、恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需匹配的 DSH 命令、fork 子代理、Tools 服务和可用模型。关闭气泡向该父会话和 ID 发关闭请求，服务会触发 abort 并等待有界清理，关闭先到时留下短时墓碑。清理失败可返回错误，模型结果成功时清理异常也可能只记日志。气泡在浏览器内存，需保留的答案应手动核对并复制。只想不影响主线且无法承受回传时先在副本观察，发现父会话意外追加、工具外部状态变化或无法确认关闭，即停用并回手工解释。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:67-70](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/package.json#L67-L70)

Node 与 DSH 声明条件

```text
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.0-rc.1 <0.3.0-0"
  },
```

**依据 2 · 源码核查**：[src/index.ts:207-215](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L207-L215)

关闭命令绑定父会话和请求

```text
  ctx.effect(() => ctx.commands.register({
    name: CLOSE_COMMAND,
    description: translate()('command.internalClose'),
    recordInput: false,
    handler: invocation => {
      const id = invocation.rawInput.trim()
      if (!/^[a-zA-Z0-9-]{8,80}$/.test(id)) return { kind: 'error', text: translate()('error.id') }
      return jobs.close(invocation.agent.session.header.id, id)
    },
```

**依据 3 · 源码核查**：[src/server/jobs.ts:64-101](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/jobs.ts#L64-L101)

容量、超时、关闭和墓碑

<details>
<summary>查看原文（38行）</summary>

```text
  ask(scope: string, id: string, question: string, signal?: AbortSignal, context?: unknown, locale: BtwLocale = 'zh'): Promise<SideResult> {
    const key = JSON.stringify([scope, id])
    const t = translate(locale)
    this.prune()
    if (this.disposed) return Promise.resolve(failure(t('error.stopped')))
    if (this.jobs.has(key) || this.retired.has(key)) return Promise.resolve(failure(t('error.duplicate')))
    if (this.jobs.size >= 8) return Promise.resolve(failure(t('error.capacity')))
    const job: Job = { key, controller: new AbortController(), finished: Promise.resolve({ kind: 'success', text: '' }), t }
    this.jobs.set(key, job)
    const cancel = () => job.controller.abort(new Error(t('error.cancelled')))
    signal?.addEventListener('abort', cancel, { once: true })
    if (signal?.aborted) cancel()
    const timer = this.timeoutMs > 0
      ? setTimeout(() => job.controller.abort(new Error(t('error.timeout'))), this.timeoutMs)
      : undefined
    timer?.unref?.()
    job.finished = this.execute(job, { scope, id, question, signal: job.controller.signal, context, locale })
      .finally(() => {
        if (timer) clearTimeout(timer)
        signal?.removeEventListener('abort', cancel)
        this.release(job)
      })
    return job.finished
  }

  /** 关闭可先于启动到达；短期墓碑阻止网络乱序重新启动请求。 */
  async close(scope: string, id: string): Promise<SideResult> {
    const key = JSON.stringify([scope, id])
    this.retire(key)
    const job = this.jobs.get(key)
    if (!job) return { kind: 'success', text: '' }
    job.controller.abort(new Error(job.t('error.cancelled')))
    try {
      await this.cleanup(job)
      return { kind: 'success', text: '' }
    } catch (error) {
      this.report(job, error)
      return failure(job.t('error.cleanup', { detail: '' }).trim())
```

</details>

**依据 4 · 源码核查**：[src/server/jobs.ts:143-164](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/jobs.ts#L143-L164)

结果与有界清理分开

<details>
<summary>查看原文（22行）</summary>

```text
    if (request.signal.aborted) {
      this.cleanupLater(job)
      return result
    }
    try { await this.cleanup(job) }
    catch (error) { this.report(job, error) }
    return result
  }

  private async cleanup(job: Job): Promise<void> {
    if (job.starting) {
      // 启动失败表示没有句柄；超时则继续保留额度，接管以后到达的句柄。
      await this.bounded(job.starting.then(() => {}, () => {}), job)
    }
    if (!job.run) { this.release(job); return }
    if (!job.cleanup) {
      const run = job.run
      job.cleanup = Promise.resolve().then(() => run.dispose()).then(() => { job.run = undefined; this.release(job) })
        .catch(error => { job.cleanup = undefined; throw error })
    }
    // 等待超时不清空仍在运行的 Promise，避免重试时并发调用 dispose。
    await this.bounded(job.cleanup, job)
```

</details>

**依据 5 · 源码核查**：[src/client/bubbles.ts:116-130](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/client/bubbles.ts#L116-L130)

浏览器取消和关闭请求

<details>
<summary>查看原文（15行）</summary>

```text
  close(id: string): Promise<void> {
    const existing = this.closing.get(id)
    if (existing) return existing
    const item = this.snapshot.find(bubble => bubble.id === id)
    if (!item) return Promise.resolve()
    if (this.notStarted.has(id)) { this.remove(id); return Promise.resolve() }
    this.update(id, { phase: 'closing', error: undefined, closeFailed: false })
    this.active.get(id)?.abort()
    const operation = Promise.resolve().then(() => this.transport.close(item.sessionId, id)).then(result => {
      if (result.kind === 'error') throw new Error(result.text)
      this.remove(id)
    }).catch(error => {
      if (this.notStarted.has(id) || this.runEnd.get(id) === 'not-started') { this.remove(id); return }
      if (error instanceof SideRequestNotStartedError) {
        // 关闭被围栏拒绝只说明这次关闭没进 handler，不能说明启动没开始。
```

</details>

#### 缺口

- 缺真实宿主断线和清理人时。
  **影响**：取消回包不说明模型供应商何时停止及是否已计费。
  **进一步探讨**：关闭一个迟到结果的旁问，分别检查 Host、模型、主线和浏览器状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否以同任务对照证实主线保持？

**研究主题**：新假设与验证

#### 完整回答

在副本主会话放一个独特上下文标记，要求旁问解释，保持工具白名单为空。用受控模型先只返回文本，再尝试父会话回传、错目标回传和普通工具。记录旁问是否答对、主会话日志、工具执行、缓存用量与取消后的资源占用。若单纯解释步骤出现非预期主线写入或普通工具运行，就否定该条件下的主线保持假设。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:105-132](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/index.ts#L105-L132)

新旁问身份和调用者投递

<details>
<summary>查看原文（28行）</summary>

```text
    if (typeof subagents.startActivation === 'function') {
      const childId = SessionId(globalThis.crypto.randomUUID())
      const releaseChildId = protection.ownId(childId)
      let childAgent: object | undefined
      try {
        const stopCreated = ctx.on('agent/created', ({ agent }) => {
          if (agent.id !== childId) return undefined
          childAgent = agent
          // 只挂执行期拦截，不改系统提示、不过滤工具定义：请求前缀与主会话逐字节一致，
          // 才能复用主会话的 prompt cache（与 Claude Code /btw 一致）。
          arm(agent as GuardedAgent)
          return undefined
        })
        let activation
        try {
          activation = await subagents.startActivation({
            provider: 'fork',
            label,
            childId,
            request: {
              parent: request.context as Agent,
              // 旁问只需一次性只读回答：收紧继承来的过大输出预算，避免长会话溢出；
              // 同时取 min 避免反向抬高小预算路由。
              agentOptions: { maxTokens },
              prompt: [{ type: 'text', text: promptText }],
            },
            signal: request.signal,
            delivery: 'caller',
```

</details>

**依据 2 · 源码核查**：[src/server/tool-guard.ts:141-168](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/tool-guard.ts#L141-L168)

守卫是对照点

<details>
<summary>查看原文（28行）</summary>

```text
  const guard: AnswerOnlyGuard = ({ agent, name, arguments: args }) => {
    if (!agent) return undefined
    // 放行集合：把答案发回自己的父会话，加上用户配置的白名单工具。
    // 其余工具、以及发给其它 agent 的 send_message 一律拒绝。
    // 三条认领路径（预登记 id / 已认领对象 / 投影或快照 label）都必须返回 verdict，
    // 否则 isOwnedId 先短路会让回传通道在生产主路径上失效。
    const allowed = allowedNow()
    // 白名单只覆盖普通工具；回传工具的父会话归属校验由 `isReplyToParent` 独占，
    // 配置无法把「只能交回自己的主会话」放宽成「发给任意 agent」。
    const permitted = isReplyToParent(name, args, agent)
      || (name !== undefined && allowed.includes(name))
    const verdict = permitted ? undefined : denyFor(allowed)
    if (isOwnedId(agent)) return verdict
    if (owned.has(agent) || (agent.session !== undefined && owned.has(agent.session))) return verdict
    const label = lastDescriptorLabel(agent.session, identityOf)
    if (!label || !labels.has(label)) return undefined
    claimAgent(agent)
    return verdict
  }
  guard.own = agent => { claimAgent(agent) }
  guard.ownId = id => {
    ownedIds.add(id)
    return () => { ownedIds.delete(id) }
  }
  guard.recognize = (session, event) => {
    if (event.type !== 'subagent/descriptor') return
    const label = descriptorLabel(event.data)
    if (label && labels.has(label)) claim(session)
```

</details>

**依据 3 · 源码核查**：[src/server/jobs.ts:89-101](https://github.com/MichengAI/dsh-btw/blob/096619904ac7f9bbc50c808224803cbb44d8b978/src/server/jobs.ts#L89-L101)

关闭与复查边界

<details>
<summary>查看原文（13行）</summary>

```text
  /** 关闭可先于启动到达；短期墓碑阻止网络乱序重新启动请求。 */
  async close(scope: string, id: string): Promise<SideResult> {
    const key = JSON.stringify([scope, id])
    this.retire(key)
    const job = this.jobs.get(key)
    if (!job) return { kind: 'success', text: '' }
    job.controller.abort(new Error(job.t('error.cancelled')))
    try {
      await this.cleanup(job)
      return { kind: 'success', text: '' }
    } catch (error) {
      this.report(job, error)
      return failure(job.t('error.cleanup', { detail: '' }).trim())
```

</details>

#### 缺口

- 对照尚未运行。
  **影响**：源码不足以声称不会干扰或可节省计费。
  **进一步探讨**：先对比只输出文本与意外发给父会话两个输入的事件流。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
