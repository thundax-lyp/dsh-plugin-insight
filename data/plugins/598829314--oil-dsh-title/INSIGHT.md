# oil-dsh-title

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[f384454](https://github.com/598829314/oil-dsh-title/tree/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4)

<!-- BEGIN META -->
[![GitHub ★ 1](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1&color=yellow&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title)
<!-- END META -->

> **实现功能**：按最近用户消息异步维护DSH会话标题，采用emoji与对象/持续目标格式并调用官方rename。

> **核心亮点**：继承oil-codex-title命名政策，新增DSH官方事件/rename适配和有界消息抽取。详见[Q01](#research-q01)。

> **风险与缺陷**：生成中缺用户seq和标题CAS，新意图可能被丢/覆盖；Windows hint与隐私校验仅有限模式。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 持续标题维护解决什么问题，哪些贡献来自上游？](#detail-section-11)
  - [Q02 · 从用户消息到rename怎样调度，结果是否仍对应当前意图？](#detail-section-12)
  - [Q03 · 有界输入和标题校验能否保证隐私、语言与冲突？](#detail-section-13)
  - [Q04 · 工程测试和三阶段成本有哪些可靠依据？](#detail-section-14)
  - [Q05 · 怎样采用，新的设计假设如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长会话与多会话主线变化后，减少手工改标题。详见[Q01](#research-q01)。

手工rename与宿主首轮标题，以及明确继承的oil-codex-title命名政策；本轮未审上游全部历史，不宣称新政策首创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 会话事件命名 | 主线变化后维护标题 | 不提供独立Skill/模型工具 |
| 格式校验 | 类别emoji/对象/目标 | 语义、隐私为有限筛查 |
| 异步rename | 不写原会话命名消息 | 无用户seq/人工标题CAS |

**流程与依赖**

#### 启动与依赖

| 条件 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Node/固定DSH peers | host事件/rename/stream | 按0.1.2rc1契约核对 |
| session选定模型route | 独立命名 | 继承隐私/价格，可能旧header |
| sessions/title服务 | 当前标题与冲突 | 只取16个冲突且无CAS |


#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 选择非敏感试验profile | 用户 | 能接受同route额外请求 |
| 发实质消息 | 用户/宿主 | route与事件可用 |
| 异步命名并核结果 | 插件/用户 | 不覆手改/不泄露片段 |
| 异常停用并改回 | 用户 | 核在途与当前标题 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配Node/DSH及已有模型路线；金额未知 | 核标题政策、敏感会话与自动改名范围，工时未知 | 无插件独立Key不等没有模型费；组件无逐会话开关 |
| 持续使用 | 每次触发额外命名LLM请求，输出maxTokens256；扫描会话事件并读其他标题 | 观察标题是否过时/误改，必要时手改 | 输入五条各600字符非token总预算；同一消息可触发不止一次，真实费用/命名质量未知 |
| 失败恢复 | 生成失败保旧标题；重试或后续消息仍会产生调用 | 核手工标题与新消息后改回；外发输入不能靠卸载撤回 | 60秒abort依模型适配器；无持久改名历史/原子恢复收据，恢复时间未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 持续标题更新 | 事件→模型→rename | 语义准确与稳定不硬保证 |
| 不污染原会话 | 独立命名messages | 额外调用费用/隐私仍在 |
| 有限格式保护 | emoji/分隔/字节与模式 | 非全面隐私/语言核验 |

> **思考**：生成中缺用户seq和标题CAS，新意图可能被丢/覆盖；Windows hint与隐私校验仅有限模式。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：继承oil-codex-title命名政策，新增DSH官方事件/rename适配和有界消息抽取。详见[Q01](#research-q01)。

继承oil-codex-title命名政策，新增DSH官方事件/rename适配和有界消息抽取。详见[Q01](#research-q01)。

分离core/host、失败保旧与双流形态组装值得复用，需补并发当前性和隐私反例。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

生成中缺用户seq和标题CAS，新意图可能被丢/覆盖；Windows hint与隐私校验仅有限模式。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；敏感/重要会话应先有人工命名保护与最小输入策略。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

持续命名接线与有限格式筛查可查；稳定/隐私/最新意图并非强保证，未来版本化命名假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/core.js、test/plugin.test.mjs、test/core.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整178行发布host/127行core/55行plugin测试/35行core测试、package/README；不扩展Python Codex归档为DSH能力，不运行目标/模型。
- 下一步：从新意图/人工rename竞争、Windows路径和有限秘密模式证伪版本化最小命名上下文假设。

**分析版本**

- **仓库**：[598829314/oil-dsh-title](https://github.com/598829314/oil-dsh-title)
- **版本号**：0.1.1（[固定提交 f384454](https://github.com/598829314/oil-dsh-title/tree/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

从丢弃式互斥推导版本化最小上下文、最后意图单飞与人工让权，按具体竞争/隐私反例比较误改和成本；未验证。详见[Q05](#research-q05)。

从新意图/人工rename竞争、Windows路径和有限秘密模式证伪版本化最小命名上下文假设。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 714 | — | — | 15962 |
| .js | source | 2 | 305 | 281 | 1 | — |
| .mjs | test | 2 | 90 | 80 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+created%3A2026-09-22T09%3A21%3A39.761Z..2026-10-22T09%3A21%3A39.761Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/598829314/oil-dsh-title/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T09%3A21%3A39.761Z..2026-10-22T09%3A21%3A39.761Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**持续会话标题怎样保持准确且不抢人工意图，DSH适配与上游政策、隐私及额外模型成本如何区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 持续标题维护解决什么问题，哪些贡献来自上游？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向长期会话/多会话并行的DSH用户，初始问题生成的标题随工作主线变化会过时，插件尝试按最近用户消息维护“类别emoji+对象｜持续目标”，便于从标题辨认任务。合格结果应是对象和主线准确、语言合适、不会抢走人工命名或泄露资料，而不只是格式通过。基线是手改标题或内置首轮命名；本项新增持续事件驱动的官方rename接线，不修改核心也不注册自己的首轮provider。

README明确命名政策和原Codex实现继承oil-codex-title，不能把仓库保留的Python归档/Skill脚本算作DSH发布入口能力。当前package只发布lib与指定文档，host只监听并命名，没有注册Skill/模型工具/归档命令。持续稳定/主导语言和不重复项目名主要由SYSTEM_PROMPT要求，未等同算法保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-4](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/README.md#L3-L4)

明确继承归属。

```text
A DeepSeek Harness plugin that keeps session titles useful as the work evolves.
It adapts the naming rules from [oil-codex-title](https://github.com/oil-oil/oil-codex-title) to DSH's official session APIs.
```

**依据 2 · 作者声明**：[README.md:38-42](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/README.md#L38-L42)

官方rename和首轮provider共存主张。

```text
## DSH integration

This is a host-only Cordis bundle. It listens to `session/event` for all live sessions and updates titles with the official `sessionTitle.rename()` API.

It deliberately does **not** call `sessionTitle.register()` and does not disable DSH's built-in first-prompt provider. That makes it safe to install alongside the default title stack and avoids modifying DSH core files.
```

**依据 3 · 源码核查**：[package.json:35-44](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/package.json#L35-L44)

发布边界。

<details>
<summary>查看原文（10行）</summary>

```text
    "lib",
    "cordis.patch.yml",
    "docs/DSH安装与验证.md",
    "docs/命名与回归规范.md",
    "README.md",
    "README.zh.md",
    "LICENSE"
  ],
  "exports": {
    ".": "./lib/index.js",
```

</details>

**依据 4 · 源码核查**：[lib/index.js:162-178](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L162-L178)

真实事件入口。

<details>
<summary>查看原文（17行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (stopped || !session || !event) return
    if (event.type === 'user/message') {
      if (event.data?.source?.kind !== 'user') return
      pending.add(session.id)
      const route = routeFromSession(session)
      if (route) schedule(session, route)
      return
    }
    if (event.type !== 'request/header' || !pending.has(session.id)) return
    pending.delete(session.id)
    const config = event.data?.header?.config
    if (config?.provider && config?.model) schedule(session, { provider: config.provider, model: config.model })
  })
}

export { apply, inject, name }
```

</details>

**依据 5 · 源码核查**：[lib/core.js:3-11](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js#L3-L11)

标题政策由提示词指定。

```text
export const SYSTEM_PROMPT = `你是 DeepSeek Harness 会话标题编辑器。只依据输入 JSON 返回一个 JSON 对象，不调用工具，不输出其它文字。

标题结构：一个类别 emoji + 空格 + 对象 + 全角分隔符「｜」+ 核心目标。恰好一个「｜」，两侧非空；不要使用半角竖线、斜线或破折号代替。
类别按持续产物或对象选择：🎬内容制作、🧩工具开发、🔎对比调研、🎨页面设计、📝方法整理、📅日程安排、⚙️环境配置、💬一般讨论。emoji 只出现一个。
对象具体且稳定，目标表达持续主线；不要把最后一句“继续、测试、提交、推送、截图”单独当成新主线。旧标题格式不对时允许迁移；已有标题准确时返回 keep 并原样保留。
根据最近几轮用户消息的主导语言命名，保留产品名、工具名、模型名和代码标识符。project_hint 只是弱线索，默认不要重复；conflicting_titles 中的完整标题不要重复，证据不足时 keep。
标题总长不超过 48 个 Unicode 字符；不得输出换行、Markdown、引号、绝对路径、密钥、邮箱、电话、网址或任务完成宣称。
只输出 JSON 对象，字段为 action、title、reason；action 只能是 keep 或 rename。`

```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从用户消息到rename怎样调度，结果是否仍对应当前意图？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

user/message仅接受source.kind=user，先pending.add，有session.requestHeader当前路由便排微任务；随后request/header若pending存在则删除pending并用其provider/model再排。update按session.id互斥，取完整snapshotEvents里的用户文本后留最后五条、各600字符；输入还含当前标题、项目hint和最多16个其他live标题。LLM只作独立purpose=session-title请求，不写命名消息进原会话，256输出token、60秒AbortController。

互斥能抑制重叠，却不是最后意图队列。生成中遇新消息及header的update直接返回，结束不自动消费最新pending；若旧路由已存在，用户消息可能先按旧route调用，新的request/header在忙时被丢。反之header晚到、首请求已结束可为同一消息再次调用。rename前只检查stop/abort、标题格式/冲突和sessions.get同对象，没有重比最新用户seq或标题revision，所以生成时用户手改标题/任务变化可被旧候选覆盖，与原内置首轮provider也无所有权仲裁。

依赖Node ^22.19或>=24、Cordis4.0.2和固定DSH llm/session/title0.1.2rc1及sessions服务。requestHeader/rename事件契约应版本匹配；不因官方API就推并发安全。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:9-16](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L9-L16)

读取当前route。

```text
function routeFromSession(session) {
  try {
    const header = session.requestHeader?.()
    const config = header?.config
    if (config?.provider && config?.model) return { provider: config.provider, model: config.model }
  } catch {}
  return undefined
}
```

**依据 2 · 源码核查**：[lib/index.js:41-77](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L41-L77)

输入和独立模型请求。

<details>
<summary>查看原文（37行）</summary>

```text
function recentUserMessages(session) {
  const messages = []
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'user/message') continue
    if (event.data?.source?.kind !== 'user') continue
    const text = (Array.isArray(event.data.content) ? event.data.content : [])
      .filter(block => block?.type === 'text' && typeof block.text === 'string')
      .map(block => block.text)
      .join('\n')
    const cleaned = cleanText(text)
    if (cleaned) messages.push({ seq: event.seq, text: cleaned.slice(0, 600) })
  }
  return messages.slice(-5)
}

async function generateTitle(ctx, route, input, sessionId, signal) {
  const message = {
    id: randomUUID(),
    role: 'user',
    content: [{ type: 'text', text: JSON.stringify(input) }],
    source: { kind: 'plugin', plugin: name },
  }
  const stream = ctx.llm.stream({
    provider: route.provider,
    model: route.model,
    messages: [message],
    system: SYSTEM_PROMPT,
    maxTokens: 256,
    purpose: 'session-title',
    sessionId,
    signal,
  })
  const assembler = createTextAssembler()
  for await (const chunk of stream) assembler.push(chunk)
  const result = assembler.finish()
  if (result.finish.kind !== 'stop') throw new Error(`title stream finished with ${result.finish.kind}`)
  if (!result.text) throw new Error('title stream returned no text')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:93-147](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L93-L147)

互斥/生成/缺seq及title CAS。

<details>
<summary>查看原文（55行）</summary>

```text
  async function update(session, suppliedRoute) {
    if (stopped || !session || inFlight.has(session.id)) return
    inFlight.add(session.id)
    const controller = new AbortController()
    controllers.set(session.id, controller)
    const timeout = setTimeout(() => controller.abort(new Error('oil-dsh-title timeout')), TITLE_TIMEOUT_MS)
    try {
      const messages = recentUserMessages(session)
      const route = suppliedRoute || routeFromSession(session)
      if (messages.length === 0 || !route) {
        logFailure(ctx, 'missing input or route')
        return
      }
      let currentTitle = ''
      try {
        currentTitle = ctx.sessionTitle.get(session)?.title || ''
      } catch {}
      const input = {
        current_title: currentTitle,
        project_hint: projectHint(session.header?.cwd),
        conflicting_titles: conflictingTitles(ctx, session),
        user_messages: messages,
      }
      let raw
      try {
        raw = await generateTitle(ctx, route, input, session.id, controller.signal)
      } catch {
        logFailure(ctx, 'model generation')
        return
      }
      if (stopped || controller.signal.aborted) return
      const parsed = parseModelResult(raw)
      let action = 'keep'
      let candidate = ''
      if (parsed && typeof parsed === 'object') {
        if (parsed.action === 'rename' || parsed.action === 'keep') action = parsed.action
        if (typeof parsed.title === 'string') candidate = parsed.title
      } else if (validateTitle(raw)) {
        action = 'rename'
        candidate = raw
      }
      if (action !== 'rename') return
      const title = normalizeTitle(candidate)
      if (!validateTitle(title) || title === currentTitle) return
      if (conflictingTitles(ctx, session).includes(title)) return
      if (ctx.sessions.get(session.id) !== session) return
      try {
        ctx.sessionTitle.rename(session, title)
      } catch {
        logFailure(ctx, 'rename')
      }
    } finally {
      clearTimeout(timeout)
      controllers.delete(session.id)
      inFlight.delete(session.id)
```

</details>

**依据 4 · 源码核查**：[lib/index.js:155-175](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L155-L175)

清理与双触发。

<details>
<summary>查看原文（21行）</summary>

```text
  ctx.effect(() => () => {
    stopped = true
    pending.clear()
    for (const controller of controllers.values()) controller.abort(new Error('oil-dsh-title stopped'))
    controllers.clear()
  }, 'oil-dsh-title teardown')

  ctx.on('session/event', (session, event) => {
    if (stopped || !session || !event) return
    if (event.type === 'user/message') {
      if (event.data?.source?.kind !== 'user') return
      pending.add(session.id)
      const route = routeFromSession(session)
      if (route) schedule(session, route)
      return
    }
    if (event.type !== 'request/header' || !pending.has(session.id)) return
    pending.delete(session.id)
    const config = event.data?.header?.config
    if (config?.provider && config?.model) schedule(session, { provider: config.provider, model: config.model })
  })
```

</details>

**依据 5 · 源码核查**：[package.json:28-30](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/package.json#L28-L30)

Node。

```text
    "node": "^22.19.0 || >=24.0.0"
  },
  "scripts": {
```

**依据 6 · 源码核查**：[package.json:56-61](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/package.json#L56-L61)

宿主peer。

```text
    "@deepseek-ai/dsh-session": "0.1.2-rc.1",
    "@deepseek-ai/dsh-session-title": "0.1.2-rc.1"
  },
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
```

#### 缺口

- 宿主requestHeader更新时机与内置首轮provider/人工rename并发契约
  **影响：**决定旧路线/旧候选覆盖或重复调用在具体宿主的触发条件
  **进一步探讨：**对照同版本宿主事件顺序与title更新语义，用延迟生成、换路由和人工改名反例核最后意图

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 有界输入和标题校验能否保证隐私、语言与冲突？

**研究主题：**缺陷与关键质疑

#### 完整回答

输入清洗删除控制/不可见字符，但没有秘密/邮箱/电话脱敏，最近消息和其他会话标题仍交选中的模型。projectHint只用“/”切分，Windows反斜线cwd可能整个路径被当叶名截前64字符；因此README“never full path”只在相应路径形式成立。即使Unix叶名也可能敏感。上下文只限最近五条每条600 UTF16字符，不限制current_title/其他标题合计字节，遍历全历史也不因最终输入限量而有界。

输出先normalize到80 UTF8字节，再验4–48 Unicode字符、八类emoji和唯一全角分隔符。80字节可使中文更短并截语义；validate只拒http(s)、/Users/、sk-、PEM开头、引号/反引号等少量模式，没显式阻C盘或/home路径、邮箱、电话、非该前缀密钥，也不核主导语言/完成宣称或语义一致。它是格式和有限模式筛查，不能支持绝对隐私保证。

冲突只对ctx.sessions.list前16个不同标题精确相等，可能漏后面的会话或语义近似；生成前后再查同样上限虽降低常见冲突却非全局唯一。assembler兼容delta和block-end避免重复文本、拒tool-call是正面，但缺finish事件默认stop，也没有输出字节硬限额，maxTokens需上游履约。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:18-38](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L18-L38)

hint分隔和16标题上限。

<details>
<summary>查看原文（21行）</summary>

```text
function projectHint(cwd) {
  if (typeof cwd !== 'string' || cwd.length === 0) return ''
  const parts = cwd.split('/').filter(Boolean)
  const name = parts.at(-1) || ''
  const ignored = new Set(['desktop', 'documents', 'downloads', 'tmp', 'temp', 'project', 'projects', 'users', 'home', 'workspace'])
  if (!name || ignored.has(name.toLowerCase())) return ''
  return name.slice(0, 64)
}

function conflictingTitles(ctx, session) {
  const titles = new Set()
  try {
    for (const other of ctx.sessions.list()) {
      if (other.id === session.id) continue
      try {
        const snapshot = ctx.sessionTitle.get(other)
        if (typeof snapshot?.title === 'string' && snapshot.title.trim()) titles.add(snapshot.title)
      } catch {}
    }
  } catch {}
  return [...titles].slice(0, 16)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:41-54](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L41-L54)

全历史遍历后截用户输入。

<details>
<summary>查看原文（14行）</summary>

```text
function recentUserMessages(session) {
  const messages = []
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'user/message') continue
    if (event.data?.source?.kind !== 'user') continue
    const text = (Array.isArray(event.data.content) ? event.data.content : [])
      .filter(block => block?.type === 'text' && typeof block.text === 'string')
      .map(block => block.text)
      .join('\n')
    const cleaned = cleanText(text)
    if (cleaned) messages.push({ seq: event.seq, text: cleaned.slice(0, 600) })
  }
  return messages.slice(-5)
}
```

</details>

**依据 3 · 源码核查**：[lib/core.js:13-22](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js#L13-L22)

只清控制字符。

<details>
<summary>查看原文（10行）</summary>

```text
  if (typeof value !== 'string') return ''
  let out = ''
  for (const ch of value) {
    const cp = ch.codePointAt(0)
    if (cp < 32 || (cp >= 127 && cp <= 159)) continue
    if ((cp >= 0x200b && cp <= 0x200f) || (cp >= 0x202a && cp <= 0x202e) || (cp >= 0x2060 && cp <= 0x206f) || cp === 0xfeff) continue
    out += ch
  }
  return out.replaceAll('\n', ' ').replaceAll('\r', ' ').replaceAll('\t', ' ').split(' ').filter(Boolean).join(' ').trim()
}
```

</details>

**依据 4 · 源码核查**：[lib/core.js:28-64](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js#L28-L64)

80字节与有限隐私模式。

<details>
<summary>查看原文（37行）</summary>

```text
export function normalizeTitle(value, maxBytes = 80) {
  const text = cleanText(value)
  if (utf8Bytes(text) <= maxBytes) return text
  let out = ''
  let used = 0
  for (const ch of text) {
    const size = utf8Bytes(ch)
    if (used + size > maxBytes) break
    out += ch
    used += size
  }
  return out.trimEnd()
}

export function validateTitle(value) {
  if (typeof value !== 'string') return false
  const title = cleanText(value)
  const length = Array.from(title).length
  if (length < 4 || length > 48) return false
  let emoji = ''
  for (const candidate of CATEGORY_EMOJI) {
    if (title.startsWith(`${candidate} `)) {
      emoji = candidate
      break
    }
  }
  if (!emoji) return false
  const body = title.slice(emoji.length + 1)
  const divider = body.indexOf('｜')
  if (divider <= 0 || divider !== body.lastIndexOf('｜') || divider >= body.length - 1) return false
  if (body.includes('|') || body[divider - 1] === ' ' || body[divider + 1] === ' ') return false
  for (const category of CATEGORY_EMOJI) {
    if (body.includes(category)) return false
  }
  if (title.includes('http://') || title.includes('https://') || title.includes('/Users/') || title.includes('sk-') || title.includes('-----BEGIN')) return false
  if (title.includes('`') || title.includes('"')) return false
  return true
```

</details>

**依据 5 · 源码核查**：[lib/core.js:92-127](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js#L92-L127)

流组装/默认finish。

<details>
<summary>查看原文（36行）</summary>

```text
  const closed = new Set()
  let finishReason

  function partFor(index) {
    if (!parts.has(index)) {
      parts.set(index, '')
      order.push(index)
    }
    return parts.get(index)
  }

  return {
    push(chunk) {
      if (!chunk || typeof chunk !== 'object') return
      if (chunk.type === 'text-delta') {
        const current = partFor(chunk.index)
        if (!closed.has(chunk.index) && typeof chunk.text === 'string') parts.set(chunk.index, current + chunk.text)
        return
      }
      if (chunk.type === 'block-end') {
        if (chunk.block?.type === 'tool-call') throw new Error('title model requested a tool')
        const current = partFor(chunk.index)
        if (!closed.has(chunk.index) && current === '' && chunk.block?.type === 'text') parts.set(chunk.index, chunk.block.text || '')
        closed.add(chunk.index)
        return
      }
      if (chunk.type === 'finish') finishReason = chunk.reason
    },
    finish() {
      return {
        text: order.map(index => parts.get(index) || '').join(' ').trim(),
        finish: finishReason || { kind: 'stop' },
      }
    },
  }
}
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程测试和三阶段成本有哪些可靠依据？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

核心文本/JSON/流组装与宿主调度分离，生产test直接导入lib；core测试覆盖基本结构/重复分隔、HTTPS、UTF8边界、fence/嵌入JSON和两种流形态，plugin测试mock事件与官方rename。它有可借鉴的失败保旧、不追加会话消息、流tool-call拒绝、abort与teardown。测试仅一个顺畅改名事件序列，不覆盖忙时新意图、人工命名竞争、Windows hint、超16冲突或任意秘密模式；本次只读不执行，不把mock或上游Python命名评估当本DSH运行效果。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配Node/DSH及已有模型路线；金额未知 | 核标题政策、敏感会话与自动改名范围，工时未知 | 无插件独立Key不等没有模型费；组件无逐会话开关 |
| 持续使用 | 每次触发额外命名LLM请求，输出maxTokens256；扫描会话事件并读其他标题 | 观察标题是否过时/误改，必要时手改 | 输入五条各600字符非token总预算；同一消息可触发不止一次，真实费用/命名质量未知 |
| 失败恢复 | 生成失败保旧标题；重试或后续消息仍会产生调用 | 核手工标题与新消息后改回；外发输入不能靠卸载撤回 | 60秒abort依模型适配器；无持久改名历史/原子恢复收据，恢复时间未知 |

每次用户消息先扫描snapshotEvents并clean全文再截600，长历史/巨大单条输入仍有CPU/分配成本。模型错误只写相位debug而不带敏感正文，有利日志最小化但不提供改名审计/恢复记录。停用abort进行中请求且阻止之后rename，网络费用是否已发生由适配器/供应商决定，不能把abort当撤账。

#### 证据与依据

**依据 1 · 源码核查**：[test/core.test.mjs:1-35](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/test/core.test.mjs#L1-L35)

生产纯逻辑样例。

<details>
<summary>查看原文（35行）</summary>

````text
import test from 'node:test'
import assert from 'node:assert/strict'

import { createTextAssembler, normalizeTitle, parseModelResult, validateTitle } from '../lib/core.js'

test('accepts the oil title structure and rejects unsafe output', () => {
  assert.equal(validateTitle('🧩 DSH插件｜验证自动改名'), true)
  assert.equal(validateTitle('🧩 DSH插件｜验证｜重复分隔符'), false)
  assert.equal(validateTitle('🧩 DSH插件｜https://example.com'), false)
  assert.equal(validateTitle('DSH插件｜缺少类别'), false)
})

test('normalizes whitespace and enforces the UTF-8 byte boundary', () => {
  assert.equal(normalizeTitle('🧩   DSH插件\n｜\t验证自动改名'), '🧩 DSH插件｜验证自动改名')
  assert.ok(new TextEncoder().encode(normalizeTitle('🧩 ' + '中文'.repeat(100))).length <= 80)
})

test('parses fenced and embedded JSON model output', () => {
  const result = parseModelResult('```json\n{"action":"rename","title":"🧩 DSH插件｜验证自动改名"}\n```')
  assert.deepEqual(result, { action: 'rename', title: '🧩 DSH插件｜验证自动改名' })
  assert.deepEqual(parseModelResult('prefix {"action":"keep","title":"旧标题"} suffix'), { action: 'keep', title: '旧标题' })
})

test('assembles both text-delta and block-end output without duplication', () => {
  const deltaAssembler = createTextAssembler()
  deltaAssembler.push({ type: 'text-delta', index: 0, text: '{"action":"rename"}' })
  deltaAssembler.push({ type: 'block-end', index: 0, block: { type: 'text', text: '{"action":"rename"}' } })
  deltaAssembler.push({ type: 'finish', reason: { kind: 'stop' } })
  assert.equal(deltaAssembler.finish().text, '{"action":"rename"}')

  const finalBlockAssembler = createTextAssembler()
  finalBlockAssembler.push({ type: 'block-end', index: 0, block: { type: 'text', text: '{"action":"keep"}' } })
  finalBlockAssembler.push({ type: 'finish', reason: { kind: 'stop' } })
  assert.equal(finalBlockAssembler.finish().text, '{"action":"keep"}')
})
````

</details>

**依据 2 · 源码核查**：[test/plugin.test.mjs:1-55](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/test/plugin.test.mjs#L1-L55)

单一顺序mock。

<details>
<summary>查看原文（55行）</summary>

```text
import test from 'node:test'
import assert from 'node:assert/strict'

import { apply } from '../lib/index.js'

test('renames a live session after user/message and request/header', async () => {
  let listener
  let cleanup
  let renamed
  const session = {
    id: 'session-test',
    header: { cwd: '/tmp/oil-dsh-title' },
    requestHeader: () => ({ config: { provider: 'test-provider', model: 'test-model' } }),
    snapshotEvents: () => [{
      seq: 1,
      type: 'user/message',
      data: {
        source: { kind: 'user' },
        content: [{ type: 'text', text: '请验证 DSH 标题插件的事件监听和自动改名。' }],
      },
    }],
  }
  let title = { title: '旧标题' }
  const ctx = {
    sessionTitle: {
      get: () => title,
      rename: (_session, value) => {
        renamed = value
        title = { title: value }
      },
    },
    llm: {
      stream: async function* () {
        yield { type: 'block-end', index: 0, block: { type: 'text', text: '{"action":"rename","title":"🧩 DSH插件｜验证自动改名"}' } }
        yield { type: 'finish', reason: { kind: 'stop' } }
      },
    },
    sessions: {
      list: () => [session],
      get: id => id === session.id ? session : undefined,
    },
    on: (_event, handler) => { listener = handler },
    effect: factory => { cleanup = factory() },
    logger: { debug: () => {} },
  }

  apply(ctx)
  listener(session, { type: 'user/message', data: { source: { kind: 'user' } } })
  listener(session, { type: 'request/header', data: { header: { config: { provider: 'test-provider', model: 'test-model' } } } })
  await new Promise(resolve => setImmediate(resolve))
  await new Promise(resolve => setImmediate(resolve))

  assert.equal(renamed, '🧩 DSH插件｜验证自动改名')
  cleanup?.()
})
```

</details>

**依据 3 · 源码核查**：[lib/index.js:41-77](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L41-L77)

扫描与额外模型请求。

<details>
<summary>查看原文（37行）</summary>

```text
function recentUserMessages(session) {
  const messages = []
  for (const event of session.snapshotEvents()) {
    if (event.type !== 'user/message') continue
    if (event.data?.source?.kind !== 'user') continue
    const text = (Array.isArray(event.data.content) ? event.data.content : [])
      .filter(block => block?.type === 'text' && typeof block.text === 'string')
      .map(block => block.text)
      .join('\n')
    const cleaned = cleanText(text)
    if (cleaned) messages.push({ seq: event.seq, text: cleaned.slice(0, 600) })
  }
  return messages.slice(-5)
}

async function generateTitle(ctx, route, input, sessionId, signal) {
  const message = {
    id: randomUUID(),
    role: 'user',
    content: [{ type: 'text', text: JSON.stringify(input) }],
    source: { kind: 'plugin', plugin: name },
  }
  const stream = ctx.llm.stream({
    provider: route.provider,
    model: route.model,
    messages: [message],
    system: SYSTEM_PROMPT,
    maxTokens: 256,
    purpose: 'session-title',
    sessionId,
    signal,
  })
  const assembler = createTextAssembler()
  for await (const chunk of stream) assembler.push(chunk)
  const result = assembler.finish()
  if (result.finish.kind !== 'stop') throw new Error(`title stream finished with ${result.finish.kind}`)
  if (!result.text) throw new Error('title stream returned no text')
```

</details>

**依据 4 · 源码核查**：[lib/index.js:80-84](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L80-L84)

日志最小字段。

```text

function logFailure(ctx, phase) {
  try {
    ctx.logger?.debug?.(`oil-dsh-title: ${phase} skipped`)
  } catch {}
```

**依据 5 · 源码核查**：[lib/index.js:155-160](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L155-L160)

清理与abort。

```text
  ctx.effect(() => () => {
    stopped = true
    pending.clear()
    for (const controller of controllers.values()) controller.abort(new Error('oil-dsh-title stopped'))
    controllers.clear()
  }, 'oil-dsh-title teardown')
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样采用，新的设计假设如何证伪？

**研究主题：**采用判断、新假设与验证

#### 完整回答

先观察。持续标题对多任务辨认有潜力，但当前自动改名无逐会话开关，缺最后意图/CAS保护，Windows hint和隐私输出筛查覆盖有限，妨碍在重要或敏感会话直接启用。读者若继续试用，应限制到可公开命名、能接受额外同route模型请求的独立profile，核每次结果及手工标题；不把格式合法或独立命名请求当隐私隔离。

从旧候选覆盖和有限输出筛查可推“版本化最小命名上下文”方向——只读授权字段、跨平台提取不敏感hint、按新用户seq合并单飞队列，并在rename时比较用户seq/原title版本，对手工命名明确让权。基线为当前inFlight丢弃与直接rename。最小反例包括生成延迟时新任务/手工改名、旧header→新header、16外同名、反斜线路径、邮箱/非sk密钥和模型无finish。若仍覆手改/最新意图、私密片段外发未降低或调用次数/人工纠错反增，则否定该方向的收益假设；比较误改率、敏感片段、调用token与人工恢复时间，不将此未实现设计计入已有贡献。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:93-147](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L93-L147)

互斥与rename基线。

<details>
<summary>查看原文（55行）</summary>

```text
  async function update(session, suppliedRoute) {
    if (stopped || !session || inFlight.has(session.id)) return
    inFlight.add(session.id)
    const controller = new AbortController()
    controllers.set(session.id, controller)
    const timeout = setTimeout(() => controller.abort(new Error('oil-dsh-title timeout')), TITLE_TIMEOUT_MS)
    try {
      const messages = recentUserMessages(session)
      const route = suppliedRoute || routeFromSession(session)
      if (messages.length === 0 || !route) {
        logFailure(ctx, 'missing input or route')
        return
      }
      let currentTitle = ''
      try {
        currentTitle = ctx.sessionTitle.get(session)?.title || ''
      } catch {}
      const input = {
        current_title: currentTitle,
        project_hint: projectHint(session.header?.cwd),
        conflicting_titles: conflictingTitles(ctx, session),
        user_messages: messages,
      }
      let raw
      try {
        raw = await generateTitle(ctx, route, input, session.id, controller.signal)
      } catch {
        logFailure(ctx, 'model generation')
        return
      }
      if (stopped || controller.signal.aborted) return
      const parsed = parseModelResult(raw)
      let action = 'keep'
      let candidate = ''
      if (parsed && typeof parsed === 'object') {
        if (parsed.action === 'rename' || parsed.action === 'keep') action = parsed.action
        if (typeof parsed.title === 'string') candidate = parsed.title
      } else if (validateTitle(raw)) {
        action = 'rename'
        candidate = raw
      }
      if (action !== 'rename') return
      const title = normalizeTitle(candidate)
      if (!validateTitle(title) || title === currentTitle) return
      if (conflictingTitles(ctx, session).includes(title)) return
      if (ctx.sessions.get(session.id) !== session) return
      try {
        ctx.sessionTitle.rename(session, title)
      } catch {
        logFailure(ctx, 'rename')
      }
    } finally {
      clearTimeout(timeout)
      controllers.delete(session.id)
      inFlight.delete(session.id)
```

</details>

**依据 2 · 源码核查**：[lib/index.js:162-175](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/index.js#L162-L175)

双事件基线。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.on('session/event', (session, event) => {
    if (stopped || !session || !event) return
    if (event.type === 'user/message') {
      if (event.data?.source?.kind !== 'user') return
      pending.add(session.id)
      const route = routeFromSession(session)
      if (route) schedule(session, route)
      return
    }
    if (event.type !== 'request/header' || !pending.has(session.id)) return
    pending.delete(session.id)
    const config = event.data?.header?.config
    if (config?.provider && config?.model) schedule(session, { provider: config.provider, model: config.model })
  })
```

</details>

**依据 3 · 源码核查**：[lib/core.js:42-64](https://github.com/598829314/oil-dsh-title/blob/f384454dfbed3ac3f263e7f09e1bc0c210c1abc4/lib/core.js#L42-L64)

筛查基线。

<details>
<summary>查看原文（23行）</summary>

```text
export function validateTitle(value) {
  if (typeof value !== 'string') return false
  const title = cleanText(value)
  const length = Array.from(title).length
  if (length < 4 || length > 48) return false
  let emoji = ''
  for (const candidate of CATEGORY_EMOJI) {
    if (title.startsWith(`${candidate} `)) {
      emoji = candidate
      break
    }
  }
  if (!emoji) return false
  const body = title.slice(emoji.length + 1)
  const divider = body.indexOf('｜')
  if (divider <= 0 || divider !== body.lastIndexOf('｜') || divider >= body.length - 1) return false
  if (body.includes('|') || body[divider - 1] === ' ' || body[divider + 1] === ' ') return false
  for (const category of CATEGORY_EMOJI) {
    if (body.includes(category)) return false
  }
  if (title.includes('http://') || title.includes('https://') || title.includes('/Users/') || title.includes('sk-') || title.includes('-----BEGIN')) return false
  if (title.includes('`') || title.includes('"')) return false
  return true
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
