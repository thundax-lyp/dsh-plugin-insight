# dsh-gotify-notify

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[6fe1631](https://github.com/AhYi8/dsh-gotify-notify/tree/6fe16310caa4233bb09086cd76c8dfb4b3e871c7)

<!-- BEGIN META -->
[![npm 30d 398](https://img.shields.io/static/v1?label=npm+30d&message=398&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify) [![最新发布 2026-10-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-13&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-gotify-notify)
<!-- END META -->

> **实现功能**：按 DSH 轮次结束和可选提问事件向自管 Gotify 推送通知，并提供设置页测试入口。

> **核心亮点**：将 DSH 回合状态/待答问题推给 Gotify，提供 UI 配置与测试。详见[Q01](#research-q01)。

> **风险与缺陷**：凭据换人但 URL 不变时缓存旧 token；提问推送失败后去重抑制再试；测试路由信同机进程。详见[Q02](#research-q02)至[Q04](#research-q04)。

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
  - [Q01 · 通知准确覆盖哪些会话事件？](#detail-section-11)
  - [Q02 · 凭据与 Gotify token 是怎样获取的？](#detail-section-12)
  - [Q03 · 失败重试与问题去重的实际语义是什么？](#detail-section-13)
  - [Q04 · 设置页测试按钮的权限边界与反馈是什么？](#detail-section-14)
  - [Q05 · 何时值得采用并怎样避免误报漏报？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合自管 Gotify 的单用户桌面消息提醒；对关键告警须另有可靠链路。详见[Q01](#research-q01)。

手工查看 DSH 会话无需推送；Gotify 通用 webhook/脚本也能发消息，但插件集成了事件过滤和配置面板。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 事件过滤 | 控制提醒量 | 审批不覆盖 |
| 凭据 | 托管密码/直接 token | 缓存仅绑 URL |
| 推送 | Gotify 通知 | 无持久送达 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH 会话事件 | 必需 | 触发 | 无通知 |
| Gotify 服务 | 必需 | 送达 | 日志错误 |
| 凭据或 token | 必需 | 认证 | 推送失败 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | URL/凭据/原因 | 保存配置 |
| 测试 | 发送测试通知 | 看 Gotify 与 body |
| 观察 | 轮次/提问事件 | 查通知与日志 |
| 故障 | 轮换凭据/重启 | 重新验证缓存 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 搭 Gotify、配置 URL/凭据/token、测试事件筛选 | 服务主机/网络资源；订阅或硬件现金费用未知 | 凭据权限、原因/minTurn、测试矩阵设置工时未知 | 配错 URL/密钥需重配并核消息 |
| 持续 | 每触发事件发 HTTP，缓存 token/内存去重 | 网络请求与服务存储；实际收费/流量未知 | 过滤误报、核送达和凭据轮换工时未知 | 通知量/误报率未知 |
| 失败恢复 | 断网/401/重启后重取 token，人工补漏报 | 额外请求和可能漏关键动作的业务损失，金额未知 | 查日志、轮换 token、联系用户/重建待答状态，工时未知 | 无持久队列，最终送达率与恢复时间未知 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 结束提醒 | turn/end 过滤 | 完整事件覆盖 |
| 待答提醒 | 两类 tool/call | 审批未覆盖 |
| 推送 | Gotify HTTP | 最终送达 |

> **思考**：凭据换人但 URL 不变时缓存旧 token；提问推送失败后去重抑制再试；测试路由信同机进程。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将 DSH 回合状态/待答问题推给 Gotify，提供 UI 配置与测试。详见[Q01](#research-q01)。

将 DSH 回合状态/待答问题推给 Gotify，提供 UI 配置与测试。详见[Q01](#research-q01)。

配置 getter 每次求值、超时和一次鉴权重试设计明确；URL-only token cache 和内存去重牺牲轮换/可靠性。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

凭据换人但 URL 不变时缓存旧 token；提问推送失败后去重抑制再试；测试路由信同机进程。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先用测试按钮核凭据与服务，再逐类事件矩阵验证；关键告警不能仅依赖此尽力推送。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码可核事件过滤与尽力推送；URL-only token 缓存、问题先登记后发送和同机测试路由是重要边界。目标运行未测。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、client/client.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.md、lib/index.js、client/client.js 和包声明；未执行目标插件或 Gotify。旧 META 仅复用。
- 下一步：目标 DSH/Gotify 上测各 reason、提问重放、断网、401、同 URL 凭据轮换、本机测试接口和日志令牌。

**分析版本**

- **仓库**：[AhYi8/dsh-gotify-notify](https://github.com/AhYi8/dsh-gotify-notify)
- **版本号**：2.4.0（[固定提交 6fe1631](https://github.com/AhYi8/dsh-gotify-notify/tree/6fe16310caa4233bb09086cd76c8dfb4b3e871c7)）
- **版本日期**：2026-10-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未实现的改进为按凭据身份重建缓存、持久送达队列与同机路由身份授权。详见[Q05](#research-q05)。

目标 DSH/Gotify 上测各 reason、提问重放、断网、401、同 URL 凭据轮换、本机测试接口和日志令牌。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1598 | 1044 | 457 | — |
| .md | source | 1 | 179 | — | — | 2656 |
| .mjs | source | 3 | 1350 | 1091 | 203 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/AhYi8/dsh-gotify-notify/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**Gotify 通知插件的触发覆盖、凭据轮换和送达保证是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 通知准确覆盖哪些会话事件？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

插件从 session/event 仅接 turn/end 与两个 tool/call 名称 ask_user_question、request_user_input；默认排除 forked 原因及子 Agent，会话轮次低于 minTurn 跳过。提问通知默认关闭，审批请求不在这两个事件里。原因支持未知值但需配置显式包含；不存在“所有需要注意的状态都会提醒”的保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-16](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/README.md#L5-L16)

作者功能声明

<details>
<summary>查看原文（12行）</summary>

```text
## 功能

- 监听会话的 `turn/end` 事件，按「成功 / 其它结果」分别使用两套标题模板。
- 支持占位符：`{id}`（会话短 id）、`{title}`（会话标题，与侧边栏一致）、`{turn}`（轮次）、`{reason}`（结束原因的**中文标签**）、`{reasonRaw}`（结束原因的原始标识）、`{error}`（失败原因，仅在出错时有内容）、`{cwd}`（工作目录名）、`{time}`（本地时间）；未知占位符原样保留。
- **触发原因多选**（`notifyReasons`）：勾选哪些结束原因才推送 —— 成功、失败、被阻断、已中止、已中断、超出长度上限、分支继承；默认除「分支继承」外全选，一个都不勾等于关闭通知。
- **分档优先级**：成功（`priorityCompleted`，默认 3）与非成功（`priorityError`，默认 8）各一档，失败比成功更醒目。
- **最低轮次门槛**（`minTurn`，默认 0）：轮次低于该值不推送，快速小问答不打扰；轮次缺失时不拦截（宁可多推）。
- 默认跳过子 Agent 会话，可开关。
- **等待用户决定通知**（`notifyQuestion`，默认关）：模型调用 `ask_user_question`（选择框）或 `request_user_input`（输入框）等用户做决定时也推送一条，使用独立的标题/正文/优先级；同一问题按调用 id 去重，只推一次（默认值见下）。权限审批提示不走会话事件，不在覆盖范围内。
- 推送失败只写日志，绝不影响会话本身。
- 插件管理页提供「发送测试通知」按钮，配好之后可以先验证再启用。
- 口令存在 **DSH 凭据库**里（和模型设置页写 API Key 是同一个地方），配置文件里只留一个引用名（`passwordEnv`，默认 `GOTIFY_PASSWORD`），所以 `cordis.patch.yml` 里不含任何机密；用户名不是机密，仍放在设置里。详见下面的「凭据」一节。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:63-85](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L63-L85)

原因集合与默认值

<details>
<summary>查看原文（23行）</summary>

```text
export const REASON_KINDS = [
  'completed',
  'error',
  'blocked',
  'aborted',
  'interrupted',
  'max-tokens',
  'forked',
]

/** `notifyReasons` 的默认值：除 `forked`（内部行为，用户无感知）外全选。 */
export const DEFAULT_NOTIFY_REASONS = REASON_KINDS.filter((kind) => kind !== 'forked')
/** 结束原因到中文标签的映射；未收录的取值原样保留，避免凭空编造语义。 */
const REASON_LABELS = {
  completed: '成功',
  blocked: '被阻断',
  aborted: '已中止',
  interrupted: '已中断',
  error: '失败',
  'max-tokens': '超出长度上限',
  forked: '分支继承',
  // 提问通知专用：不是 TurnEndReasonMap 的取值，仅用于渲染 {reason} 占位符。
  'awaiting-input': '等待用户输入',
```

</details>

**依据 3 · 源码核查**：[lib/index.js:667-745](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L667-L745)

事件过滤与推送分支

<details>
<summary>查看原文（79行）</summary>

```text
export function apply(ctx, config) {
  const logger = ctx.logger?.('gotify-notify') ?? ctx.logger
  const client = new GotifyClient(logger)

  // 提问通知的 callId 去重表：同一问题（超时 pending → continued 重开）只推一次。
  // 内存态，随进程生命周期；超上限整表清空（与重启同语义，代价最多重推一次），
  // 避免长期运行的宿主进程里条目随历史提问次数无界增长。
  const notifiedQuestions = new Set()
  const NOTIFIED_QUESTIONS_LIMIT = 500

  ctx.on('session/event', (session, event) => {
    // 先做最廉价的类型过滤：绝大多数事件既不是 turn/end 也不是提问工具调用。
    const isTurnEnd = event?.type === 'turn/end'
    const isQuestionCall = event?.type === 'tool/call' && QUESTION_TOOLS.has(event.data?.name)
    if (!isTurnEnd && !isQuestionCall) return
    const header = session?.header ?? {}
    // 子 Agent 会话不通知：origin 标记或存在父会话都视为子 Agent。
    if (!bool(config, 'includeSubagents') && (header.origin === 'subagent' || header.parentSession !== undefined)) return
    let resolved
    try {
      resolved = resolveConfig(config)
    } catch (error) {
      client.report(error)
      return
    }
    if (isQuestionCall) {
      // 「等待用户决定」通知：独立开关 + 独立标题/正文/优先级，与轮次结果互不影响。
      if (!resolved.notifyQuestion) return
      const callId = event.data?.callId
      const questionTurn = event.data?.turn
      if (!shouldNotifyQuestion(questionTurn, resolved)) return
      if (typeof callId === 'string' && callId !== '') {
        // 去重要在推之前登记：即使本轮推送失败，也不为同一次提问重试轰炸。
        // 门槛拦下的提问不登记，不占用条目；键里带上完整会话 id（不是短 id，
        // 短 id 会被截断到 8 字符），避免不同会话的同名字符串互相压制。
        const sessionKey = typeof session?.id === 'string' ? session.id : ''
        const key = `${sessionKey}\u0000${callId}`
        if (notifiedQuestions.has(key)) return
        if (notifiedQuestions.size >= NOTIFIED_QUESTIONS_LIMIT) notifiedQuestions.clear()
        notifiedQuestions.add(key)
      }
      const questionVars = {
        id: shortId(session),
        title: latestTitle(session, ctx),
        turn: questionTurn ?? '',
        reason: reasonLabel('awaiting-input'),
        reasonRaw: 'awaiting-input',
        error: '',
        cwd: cwdBasename(header.cwd),
        time: new Date().toLocaleString('zh-CN'),
      }
      void notify(client, config, {
        title: render(resolved.titleQuestion, questionVars),
        message: render(resolved.questionMessage, questionVars),
        priority: resolved.priorityQuestion,
      }, ctx)
      return
    }
    // turn/end：结束原因判定只用原始标识，模板里 `{reason}` 用中文标签、`{reasonRaw}` 用标识。
    const reasonKind = event.data?.reason?.kind ?? 'unknown'
    const turn = event.data?.turn
    if (!shouldNotify(reasonKind, turn, resolved)) return
    const target = reasonKind === 'completed' ? resolved.titleCompleted : resolved.titleOther
    const vars = {
      id: shortId(session),
      title: latestTitle(session, ctx),
      turn: turn ?? '',
      reason: reasonLabel(reasonKind),
      reasonRaw: reasonKind,
      error: reasonError(event.data?.reason),
      cwd: cwdBasename(header.cwd),
      time: new Date().toLocaleString('zh-CN'),
    }
    void notify(client, config, {
      title: render(target, vars),
      message: render(resolved.message, vars),
      priority: priorityFor(reasonKind, resolved),
    }, ctx)
  })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 凭据与 Gotify token 是怎样获取的？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

token 字段可直接指定且声明 secret 角色；否则用凭据引用名解析 DSH 凭据/环境中的口令，与用户名 Basic 调 /application 查名为 DSH 的应用，找不到就创建，然后将 token 缓存于进程。缓存键只包含服务器 URL；同 URL 更改用户名或口令仍复用旧 token，直到 401/403 或重启。直接 token 无法自动更新。消息发送使用 /message?token=...，token 在 URL 查询串中，代理/服务器访问日志可能留痕；源码自身错误日志不主动打印 token。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:124-140](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L124-L140)

配置与 secret/credential-ref

<details>
<summary>查看原文（17行）</summary>

```text
export const Config = z.object({
  url: z.string().default(DEFAULT_URL).volatile(),
  token: z.string().role('secret').default('').volatile(),
  user: z.string().default('').volatile(),
  passwordEnv: z.string().role('credential-ref').default(DEFAULT_PASSWORD_REF).volatile(),
  titleCompleted: z.string().default(DEFAULT_TITLE_COMPLETED).volatile(),
  titleOther: z.string().default(DEFAULT_TITLE_OTHER).volatile(),
  titleQuestion: z.string().default(DEFAULT_TITLE_QUESTION).volatile(),
  message: z.string().default(DEFAULT_MESSAGE).volatile(),
  questionMessage: z.string().default(DEFAULT_QUESTION_MESSAGE).volatile(),
  notifyReasons: z.array(z.string()).default(DEFAULT_NOTIFY_REASONS).volatile(),
  priorityCompleted: z.number().step(1).min(0).max(10).default(3).volatile(),
  priorityError: z.number().step(1).min(0).max(10).default(8).volatile(),
  priorityQuestion: z.number().step(1).min(0).max(10).default(8).volatile(),
  minTurn: z.number().step(1).min(0).default(0).volatile(),
  notifyQuestion: z.boolean().default(false).volatile(),
  includeSubagents: z.boolean().default(false).volatile(),
```

</details>

**依据 2 · 源码核查**：[lib/index.js:278-315](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L278-L315)

凭据回退

<details>
<summary>查看原文（38行）</summary>

```text
async function storedPassword(ref, ctx, environment) {
  if (!isCredentialRefName(ref)) return environmentValue(environment, ref)
  const credentials = ctx?.get?.('credentials')
  if (credentials === undefined || typeof credentials.resolve !== 'function') {
    return environmentValue(environment, ref)
  }
  try {
    // 引用在运行时只是被 brand 过的字符串，官方 resolve() 不校验品牌，可直接传原名。
    const hit = await credentials.resolve(ref)
    return typeof hit?.value === 'string' ? hit.value.trim() : ''
  } catch {
    // 服务拒绝解析（例如被只读来源遮蔽）时退回启动环境，与「服务缺席」同一处理。
    return environmentValue(environment, ref)
  }
}

/**
 * 求值 Gotify 登录凭据。
 *
 * 取值顺序与官方适配器一致 —— 凭据服务优先，服务给不出值时读启动环境：
 * 1. 凭据服务按 `passwordEnv` 解析（该服务自己的顺序是「继承环境 > 托管文档」，
 *    所以环境变量通常也从这一条读出）；
 * 2. 服务缺席、拒绝解析、或未命中该引用时，读启动环境里与 `passwordEnv` 同名的变量。
 *
 * 用户名不是机密，取面板 `user`，留空则取启动环境 `GOTIFY_USER`。
 * @param config - 归一化后的配置。
 * @param ctx - 插件上下文（可为空，此时只读进程环境）。
 * @returns 用户名/密码对，或 null（由调用方决定报错文案）。
 */
export async function resolveCredentials(config, ctx) {
  const environment = launchEnvironmentOf(ctx)
  const user = config.user !== '' ? config.user : environmentValue(environment, 'GOTIFY_USER')
  if (user === '') return null
  const stored = await storedPassword(config.passwordEnv, ctx, environment)
  const password = stored !== '' ? stored : environmentValue(environment, config.passwordEnv)
  if (password === '') return null
  return { user, password }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:538-603](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L538-L603)

获取 token、URL 缓存及查询串发送

<details>
<summary>查看原文（66行）</summary>

```text
  /**
   * 取（并缓存）推送用的 token：设置里直接给了 token 就用它，否则用
   * Basic 认证列出 `/application` 找名为 `DSH` 的应用并复用其 token，
   * 没有同名应用时创建一个。
   */
  async obtainToken(config, credentials) {
    if (config.token !== '') return config.token
    const cached = this.tokenCache
    if (cached !== undefined && cached.url === config.url) return await cached.promise
    const entry = { url: config.url, promise: undefined }
    entry.promise = this.#createToken(config, credentials).catch((error) => {
      // 只清自己这一条：等待期间可能已经换了服务器并写入了新缓存。
      if (this.tokenCache === entry) this.tokenCache = undefined
      throw error
    })
    this.tokenCache = entry
    return await entry.promise
  }

  async #createToken(config, credentials) {
    if (credentials === undefined) {
      throw new Error('gotify-notify: 未配置推送 token，也没有可用的用户名/密码')
    }
    const headers = {
      authorization: `Basic ${Buffer.from(`${credentials.user}:${credentials.password}`).toString('base64')}`,
      accept: 'application/json',
      'accept-encoding': 'identity',
    }
    const listed = await fetch(`${config.url}/application`, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    if (!listed.ok) {
      throw new Error(`gotify-notify: 读取应用列表失败（HTTP ${listed.status}）`)
    }
    const applications = await listed.json()
    const existing = Array.isArray(applications)
      ? applications.find((item) => item?.name === APP_NAME)
      : undefined
    if (existing !== undefined && typeof existing.token === 'string') return existing.token
    const created = await fetch(`${config.url}/application`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ name: APP_NAME, description: 'DSH 会话轮次结束通知' }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!created.ok) {
      throw new Error(`gotify-notify: 创建应用失败（HTTP ${created.status}）`)
    }
    const application = await created.json()
    if (typeof application?.token !== 'string' || application.token === '') {
      throw new Error('gotify-notify: 应用响应里没有 token')
    }
    return application.token
  }

  /** 用当前 token 发起一次推送请求（不判定状态码）。 */
  async #send(config, credentials, payload) {
    const token = await this.obtainToken(config, credentials)
    return await fetch(`${config.url}/message?token=${encodeURIComponent(token)}`, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
        accept: 'application/json',
        'accept-encoding': 'identity',
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
```

</details>

**依据 4 · 源码核查**：[lib/index.js:607-619](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L607-L619)

401/403 重取

<details>
<summary>查看原文（13行）</summary>

```text
  async push(config, credentials, payload) {
    const response = await this.#send(config, credentials, payload)
    if (response.ok) return { status: response.status }
    // 缓存的 token 可能属于旧服务器或已被吊销：清缓存重取一次再试。
    // 直接配置的 token 无法重取，只能原样报错。
    if (config.token === '' && (response.status === 401 || response.status === 403)) {
      this.tokenCache = undefined
      const retried = await this.#send(config, credentials, payload)
      if (retried.ok) return { status: retried.status }
      throw new Error(`gotify-notify: 推送失败（HTTP ${retried.status}）`)
    }
    throw new Error(`gotify-notify: 推送失败（HTTP ${response.status}）`)
  }
```

</details>

#### 缺口

- Gotify/代理日志设置未知
  **影响：**同 URL 凭据切换可能继续用旧身份，URL 令牌可在日志出现
  **进一步探讨：**目标环境轮换凭据并核服务端日志策略

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败重试与问题去重的实际语义是什么？

**研究主题：**工程质量与复用、缺陷与关键质疑

#### 完整回答

所有网络请求设置 10 秒超时，push 仅在账号派生 token 收到 401/403 后清缓存重取一次；其他网络/HTTP 失败只记录日志，轮次本身不受影响。提问用 sessionId+callId 内存集合去重，在推送前登记，因此初次推送失败不会为同一问题再尝试；500 项满后全清、重启也清。没有持久队列或送达确认，语义是尽力通知而非可靠交付。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:19-24](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L19-L24)

请求超时

```text
/**
 * 单次 HTTP 请求的超时（毫秒）。没有它，一台「TCP 连得上但不回包」的 Gotify
 * 服务器会让请求永久挂起，token 缓存停在 pending，之后所有通知都静默排队发不出。
 */
const REQUEST_TIMEOUT_MS = 10_000

```

**依据 2 · 源码核查**：[lib/index.js:607-630](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L607-L630)

响应处理和日志

<details>
<summary>查看原文（24行）</summary>

```text
  async push(config, credentials, payload) {
    const response = await this.#send(config, credentials, payload)
    if (response.ok) return { status: response.status }
    // 缓存的 token 可能属于旧服务器或已被吊销：清缓存重取一次再试。
    // 直接配置的 token 无法重取，只能原样报错。
    if (config.token === '' && (response.status === 401 || response.status === 403)) {
      this.tokenCache = undefined
      const retried = await this.#send(config, credentials, payload)
      if (retried.ok) return { status: retried.status }
      throw new Error(`gotify-notify: 推送失败（HTTP ${retried.status}）`)
    }
    throw new Error(`gotify-notify: 推送失败（HTTP ${response.status}）`)
  }

  /** 记录一次失败，不抛出。 */
  report(error) {
    const detail = error instanceof Error ? error.message : String(error)
    if (this.logger === undefined) return
    // 网络层的 `fetch failed` 自身没有信息量，把底层 errno（如 ECONNREFUSED）带上；
    // 只取错误码，不碰请求体/token/口令，避免日志泄露机密。
    const code = error?.cause?.code ?? error?.code
    const suffix = typeof code === 'string' && code !== '' ? `（${code}）` : ''
    this.logger.error(`推送失败：${detail}${suffix}`)
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:671-707](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L671-L707)

提问去重先登记与满表清空

<details>
<summary>查看原文（37行）</summary>

```text
  // 提问通知的 callId 去重表：同一问题（超时 pending → continued 重开）只推一次。
  // 内存态，随进程生命周期；超上限整表清空（与重启同语义，代价最多重推一次），
  // 避免长期运行的宿主进程里条目随历史提问次数无界增长。
  const notifiedQuestions = new Set()
  const NOTIFIED_QUESTIONS_LIMIT = 500

  ctx.on('session/event', (session, event) => {
    // 先做最廉价的类型过滤：绝大多数事件既不是 turn/end 也不是提问工具调用。
    const isTurnEnd = event?.type === 'turn/end'
    const isQuestionCall = event?.type === 'tool/call' && QUESTION_TOOLS.has(event.data?.name)
    if (!isTurnEnd && !isQuestionCall) return
    const header = session?.header ?? {}
    // 子 Agent 会话不通知：origin 标记或存在父会话都视为子 Agent。
    if (!bool(config, 'includeSubagents') && (header.origin === 'subagent' || header.parentSession !== undefined)) return
    let resolved
    try {
      resolved = resolveConfig(config)
    } catch (error) {
      client.report(error)
      return
    }
    if (isQuestionCall) {
      // 「等待用户决定」通知：独立开关 + 独立标题/正文/优先级，与轮次结果互不影响。
      if (!resolved.notifyQuestion) return
      const callId = event.data?.callId
      const questionTurn = event.data?.turn
      if (!shouldNotifyQuestion(questionTurn, resolved)) return
      if (typeof callId === 'string' && callId !== '') {
        // 去重要在推之前登记：即使本轮推送失败，也不为同一次提问重试轰炸。
        // 门槛拦下的提问不登记，不占用条目；键里带上完整会话 id（不是短 id，
        // 短 id 会被截断到 8 字符），避免不同会话的同名字符串互相压制。
        const sessionKey = typeof session?.id === 'string' ? session.id : ''
        const key = `${sessionKey}\u0000${callId}`
        if (notifiedQuestions.has(key)) return
        if (notifiedQuestions.size >= NOTIFIED_QUESTIONS_LIMIT) notifiedQuestions.clear()
        notifiedQuestions.add(key)
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:718-745](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L718-L745)

fire-and-forget

<details>
<summary>查看原文（28行）</summary>

```text
      void notify(client, config, {
        title: render(resolved.titleQuestion, questionVars),
        message: render(resolved.questionMessage, questionVars),
        priority: resolved.priorityQuestion,
      }, ctx)
      return
    }
    // turn/end：结束原因判定只用原始标识，模板里 `{reason}` 用中文标签、`{reasonRaw}` 用标识。
    const reasonKind = event.data?.reason?.kind ?? 'unknown'
    const turn = event.data?.turn
    if (!shouldNotify(reasonKind, turn, resolved)) return
    const target = reasonKind === 'completed' ? resolved.titleCompleted : resolved.titleOther
    const vars = {
      id: shortId(session),
      title: latestTitle(session, ctx),
      turn: turn ?? '',
      reason: reasonLabel(reasonKind),
      reasonRaw: reasonKind,
      error: reasonError(event.data?.reason),
      cwd: cwdBasename(header.cwd),
      time: new Date().toLocaleString('zh-CN'),
    }
    void notify(client, config, {
      title: render(target, vars),
      message: render(resolved.message, vars),
      priority: priorityFor(reasonKind, resolved),
    }, ctx)
  })
```

</details>

#### 缺口

- 断网/重启时最终送达率未知
  **影响：**用户可能漏掉重要待答问题
  **进一步探讨：**目标故障注入核重试和重复计数

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 设置页测试按钮的权限边界与反馈是什么？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

测试通知走本机 POST /gotify-notify/test，检查回环 socket/Host、拒跨站标记并在有 Origin 时比对 Host；无 Origin 的同机请求被放行，属于本机进程信任边界，不是 DSH 用户授权。测试调用实际发送 Gotify 消息，会产生通知和可能创建 DSH 应用；失败返回 HTTP 200 的 ok:false JSON，调用方必须读 body。源码测试通知变量里 reason=completed 字面英语，可能与正式通知中文原因不同，不过默认测试正文固定。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:138-141](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/README.md#L138-L141)

作者测试路由声明

```text
- token 只在内存里缓存，进程重启后重新换取；缓存**绑定服务器地址**，改了 `url` 会自动重新换取，推送遇到 `401/403` 也会清缓存重取一次（token 被吊销的场景）；直接填写的 `token` 无法重取，只会原样报错。
- 每个 HTTP 请求都有 10 秒超时：服务器「连得上但不回包」时不会让通知链路永久挂起；卡片上的「发送测试通知」另有 60 秒兜底（宿主路由最多串 3 次 Gotify 请求，各 10 秒），超时会提示「等待服务器响应超时」，不会让按钮永久停在「发送中…」。
- 推送是 fire-and-forget：失败时只在 DSH 日志里记一条 `推送失败：…`（网络层错误会附上 `ECONNREFUSED` 之类的错误码，日志里不含 token 与口令）。
- 「发送测试通知」由宿主侧路由 `/gotify-notify/test` 处理，围栏是「回环 socket + 回环 Host」：DSH 桌面壳转发页面请求时会删掉 `Origin` 与 `Sec-Fetch-Site`，所以不能靠浏览器同源标记判定，只能以回环连接本身为权威边界（带了 `Origin` 时仍要求与 `Host` 同权威，`Sec-Fetch-Site: cross-site` 一律拒绝）。
```

**依据 2 · 源码核查**：[lib/index.js:747-785](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L747-L785)

测试路由行为

<details>
<summary>查看原文（39行）</summary>

```text
  // 「发送测试通知」按钮的宿主通道：浏览器半的 fetch 与页面同源，这里再用回环围栏复核一次。
  ctx.inject?.(['webServer'], (scope) => {
    scope.effect(
      () => scope.webServer.register({
        kind: 'exact',
        path: TEST_ROUTE,
        handler: async (req, res) => {
          if (!sameOriginRequest(req)) {
            writeJson(res, 403, { error: '不受信任的来源' })
            return
          }
          if (req.method !== 'POST') {
            writeJson(res, 405, { error: '不支持的请求方法' })
            return
          }
          try {
            const resolved = resolveConfig(config)
            const credentials = await resolveCredentials(resolved, ctx)
            if (credentials === null && resolved.token === '') {
              throw new Error(missingCredentialMessage(resolved))
            }
            const sent = await client.push(resolved, credentials ?? undefined, {
              title: render(resolved.titleCompleted, {
                id: 'test',
                title: '测试通知',
                turn: '1',
                reason: 'completed',
                reasonRaw: 'completed',
                error: '',
                cwd: '',
                time: new Date().toLocaleString('zh-CN'),
              }),
              message: '这是一条来自 DSH 设置页的测试通知。',
              priority: resolved.priorityCompleted,
            })
            writeJson(res, 200, { ok: true, status: sent.status })
          } catch (error) {
            writeJson(res, 200, { ok: false, error: error instanceof Error ? error.message : String(error) })
          }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:817-845](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L817-L845)

回环围栏

<details>
<summary>查看原文（29行）</summary>

```text
/**
 * 校验测试通知请求确实来自本机 Web GUI。
 *
 * 权威边界是「回环 socket + 回环 Host」。注意 DSH 桌面壳把 GUI 页面
 * （dsh-app://app/）发出的请求转发给宿主时会删掉 origin 与 sec-fetch-site，
 * 所以**没有任何浏览器标记的请求也必须放行**，否则桌面端必然 403。
 * 跨站标记一律拒绝；带了 Origin 时必须与 Host 同权威。
 * 语义与官方 dsh-web-shared 的 isLoopbackRequest 一致。
 */
export function sameOriginRequest(req) {
  if (!isLoopbackAddress(req?.socket?.remoteAddress)) return false
  const host = req?.headers?.host
  if (typeof host !== 'string' || host === '') return false
  let hostUrl
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:557-588](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L557-L588)

可能创建应用

<details>
<summary>查看原文（32行）</summary>

```text
  async #createToken(config, credentials) {
    if (credentials === undefined) {
      throw new Error('gotify-notify: 未配置推送 token，也没有可用的用户名/密码')
    }
    const headers = {
      authorization: `Basic ${Buffer.from(`${credentials.user}:${credentials.password}`).toString('base64')}`,
      accept: 'application/json',
      'accept-encoding': 'identity',
    }
    const listed = await fetch(`${config.url}/application`, { headers, signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) })
    if (!listed.ok) {
      throw new Error(`gotify-notify: 读取应用列表失败（HTTP ${listed.status}）`)
    }
    const applications = await listed.json()
    const existing = Array.isArray(applications)
      ? applications.find((item) => item?.name === APP_NAME)
      : undefined
    if (existing !== undefined && typeof existing.token === 'string') return existing.token
    const created = await fetch(`${config.url}/application`, {
      method: 'POST',
      headers: { ...headers, 'content-type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ name: APP_NAME, description: 'DSH 会话轮次结束通知' }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    })
    if (!created.ok) {
      throw new Error(`gotify-notify: 创建应用失败（HTTP ${created.status}）`)
    }
    const application = await created.json()
    if (typeof application?.token !== 'string' || application.token === '') {
      throw new Error('gotify-notify: 应用响应里没有 token')
    }
    return application.token
```

</details>

#### 缺口

- 宿主本机多用户/代理场景未测
  **影响：**同机调用者可触发外部通知和应用创建
  **进一步探讨：**目标本机权限矩阵与测试按钮反馈

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 何时值得采用并怎样避免误报漏报？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

适合有自管 Gotify、希望轮次结束/模型提问被动提醒的单用户 DSH。接入前核凭据来源和 Gotify 应用，逐类测试通知原因、minTurn、子 Agent 与提问；重点检查漏报容忍度。若需关键任务可靠告警，应另建持久队列/回执与可观察重试；当前插件只尽力推送。若共用主机，要考虑本机测试接口与 token 查询串日志。成本包括 Gotify 服务、凭据维护和误报调参，实际量未测。 假设推导：现有源码仅在指定事件触发、URL-only 缓存 Gotify token，并在提问推送前登记去重；故网络失败和同 URL 凭据轮换可分别造成漏报和旧身份使用。相对固定版，按凭据身份/版本分桶缓存、先入持久待发送队列再以 Gotify 成功响应标记送达，并给本机测试路由绑定用户身份，可能在保持低打扰过滤的同时降低漏报/错账号推送。条件是 DSH 提供稳定事件 ID、凭据版本与本机认证上下文；代价是磁盘队列、重复通知去重、保留期和隐私管理。以正常、断网10分钟、进程重启、401、同 URL 换账号、两种提问事件与不在覆盖内审批为受控矩阵，比较固定版/原型的送达率、重复率、错账号率、恢复延迟和额外请求。若恢复后仍漏关键事件、产生大量重复、或认证路由仍可由无权限同机用户触发，则假设被证伪；即使改善也不应声称覆盖未监听事件。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:53-94](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/README.md#L53-L94)

安装/凭据说明

<details>
<summary>查看原文（42行）</summary>

```text
## 配置

打开 **设置 → 插件 → 找到 `dsh-gotify-notify` → 配置**（插件管理页的行内配置卡）。

| 字段 | 说明 | 默认 |
| --- | --- | --- |
| `url` | Gotify 服务器地址，必须以 `http://` 或 `https://` 开头 | `https://gotify.21zys.com` |
| `user` | Gotify 用户名（用于自动创建/复用名为 `DSH` 的应用并换取 token）；留空则读启动环境变量 `GOTIFY_USER` | 空 |
| `passwordEnv` | **口令的凭据引用名**：口令存在凭据库的哪个名字下（同时是环境变量名） | `GOTIFY_PASSWORD` |
| `token` | 直接指定应用 token，填了就不再需要账号密码 | 空 |
| `titleCompleted` | 正常结束时的通知标题模板 | `DSH 任务完成` |
| `titleOther` | 非正常结束时的标题模板 | `DSH 轮次结束（{reason}）` |
| `notifyQuestion` | 模型弹出选择框/输入框等你做决定时也通知 | 关 |
| `titleQuestion` | 等待决定时的标题模板 | `DSH 等待你的决定` |
| `questionMessage` | 等待决定时的正文模板 | 见下 |
| `message` | 通知正文模板 | 见下 |
| `notifyReasons` | 哪些结束原因才推送（多选） | 除 `forked` 外全部 |
| `priorityCompleted` | 成功时的优先级，0–10 的整数 | `3` |
| `priorityError` | 非成功时的优先级，0–10 的整数 | `8` |
| `priorityQuestion` | 等待决定时的优先级，0–10 的整数 | `8` |
| `minTurn` | 最低轮次门槛，低于该值不推送 | `0` |
| `includeSubagents` | 连子 Agent 的轮次结束也通知 | 关 |

两点使用说明：

- **`token` 在面板上没有控件**：它是留给「手写配置 / 脚本装机」的字段，只能改 `cordis.patch.yml`（或删掉它，改用账号 + 口令换 token）。面板不提供控件是为了避免界面上出现两条互相冲突的取 token 路径。
- **写入时机分两种**：`notifyReasons` 多选与 `notifyQuestion`、`includeSubagents` 两个开关是**勾选即写入**（立刻落盘）；文本与数字字段要点「保存」才写盘。卡片上的「发送测试通知」打的是**已保存**的配置，有未保存修改时会先提示保存。

### 凭据

口令**不写进配置文件**。插件管理页里的口令控件走
`ctx.remote.credentials.set(ref, value)` 把值写进 DSH 的凭据库
（`$DSH_HOME/.credentials.yaml`，与模型 API Key 同一个库），配置文件里只留下
`passwordEnv` 这个引用名。是否已配置由 `describe()` 回读判定 —— 值永不回传。

插件求值时按下面的顺序找口令，前一条拿到就用前一条：

1. 凭据域按 `passwordEnv`（默认 `GOTIFY_PASSWORD`）解析 —— 凭据库与启动环境都走这一条；
2. 凭据域缺席、拒绝解析、或未命中该引用时，直接读启动环境里与 `passwordEnv` 同名的变量。

凭据域是**软探测**的：profile 没组合凭据服务时插件照常工作，直接从启动环境读，
不会因为缺一个服务就起不来。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:350-378](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L350-L378)

过滤门槛和优先级

<details>
<summary>查看原文（29行）</summary>

```text
export function shouldNotify(reasonKind, turn, config) {
  const selected = Array.isArray(config?.notifyReasons) ? config.notifyReasons : DEFAULT_NOTIFY_REASONS
  if (!selected.includes(reasonKind)) return false
  if (typeof turn === 'number' && Number.isInteger(turn) && turn < (config.minTurn ?? 0)) return false
  return true
}

/**
 * 判定一次提问（`tool/call` 且工具名在 `QUESTION_TOOLS` 里）是否应当推送：
 * 轮次达到门槛即推；开关本身（`notifyQuestion`）与 callId 去重由调用方处理。
 * 轮次缺失或非整数时放行，与 `shouldNotify` 同一口径（宁可多推）。
 * @param turn - 本轮轮次（`event.data.turn`），可能缺失。
 * @param config - 归一化后的配置。
 * @returns 是否放行。
 */
export function shouldNotifyQuestion(turn, config) {
  if (typeof turn === 'number' && Number.isInteger(turn) && turn < (config?.minTurn ?? 0)) return false
  return true
}

/**
 * 按结束原因取推送优先级：`completed` 用成功档，其余（含未知取值）用异常档。
 * 未知取值偏向异常档 —— 新增的结束原因多半值得被看见。
 * @param reasonKind - 结束原因标识。
 * @param config - 归一化后的配置。
 * @returns 0–10 的整数优先级。
 */
export function priorityFor(reasonKind, config) {
  return reasonKind === 'completed' ? config.priorityCompleted : config.priorityError
```

</details>

**依据 3 · 源码核查**：[lib/index.js:643-660](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L643-L660)

通知失败处理

<details>
<summary>查看原文（18行）</summary>

```text
export async function notify(client, rawConfig, payload, ctx) {
  try {
    const config = resolveConfig(rawConfig)
    const credentials = await resolveCredentials(config, ctx)
    if (credentials === null && config.token === '') {
      throw new Error(missingCredentialMessage(config))
    }
    await client.push(config, credentials ?? undefined, payload ?? {
      title: config.titleCompleted,
      message: config.message,
      priority: config.priorityCompleted,
    })
    return true
  } catch (error) {
    client.report(error)
    return false
  }
}
```

</details>

**依据 4 · 源码核查**：[lib/index.js:667-745](https://github.com/AhYi8/dsh-gotify-notify/blob/6fe16310caa4233bb09086cd76c8dfb4b3e871c7/lib/index.js#L667-L745)

实际触发

<details>
<summary>查看原文（79行）</summary>

```text
export function apply(ctx, config) {
  const logger = ctx.logger?.('gotify-notify') ?? ctx.logger
  const client = new GotifyClient(logger)

  // 提问通知的 callId 去重表：同一问题（超时 pending → continued 重开）只推一次。
  // 内存态，随进程生命周期；超上限整表清空（与重启同语义，代价最多重推一次），
  // 避免长期运行的宿主进程里条目随历史提问次数无界增长。
  const notifiedQuestions = new Set()
  const NOTIFIED_QUESTIONS_LIMIT = 500

  ctx.on('session/event', (session, event) => {
    // 先做最廉价的类型过滤：绝大多数事件既不是 turn/end 也不是提问工具调用。
    const isTurnEnd = event?.type === 'turn/end'
    const isQuestionCall = event?.type === 'tool/call' && QUESTION_TOOLS.has(event.data?.name)
    if (!isTurnEnd && !isQuestionCall) return
    const header = session?.header ?? {}
    // 子 Agent 会话不通知：origin 标记或存在父会话都视为子 Agent。
    if (!bool(config, 'includeSubagents') && (header.origin === 'subagent' || header.parentSession !== undefined)) return
    let resolved
    try {
      resolved = resolveConfig(config)
    } catch (error) {
      client.report(error)
      return
    }
    if (isQuestionCall) {
      // 「等待用户决定」通知：独立开关 + 独立标题/正文/优先级，与轮次结果互不影响。
      if (!resolved.notifyQuestion) return
      const callId = event.data?.callId
      const questionTurn = event.data?.turn
      if (!shouldNotifyQuestion(questionTurn, resolved)) return
      if (typeof callId === 'string' && callId !== '') {
        // 去重要在推之前登记：即使本轮推送失败，也不为同一次提问重试轰炸。
        // 门槛拦下的提问不登记，不占用条目；键里带上完整会话 id（不是短 id，
        // 短 id 会被截断到 8 字符），避免不同会话的同名字符串互相压制。
        const sessionKey = typeof session?.id === 'string' ? session.id : ''
        const key = `${sessionKey}\u0000${callId}`
        if (notifiedQuestions.has(key)) return
        if (notifiedQuestions.size >= NOTIFIED_QUESTIONS_LIMIT) notifiedQuestions.clear()
        notifiedQuestions.add(key)
      }
      const questionVars = {
        id: shortId(session),
        title: latestTitle(session, ctx),
        turn: questionTurn ?? '',
        reason: reasonLabel('awaiting-input'),
        reasonRaw: 'awaiting-input',
        error: '',
        cwd: cwdBasename(header.cwd),
        time: new Date().toLocaleString('zh-CN'),
      }
      void notify(client, config, {
        title: render(resolved.titleQuestion, questionVars),
        message: render(resolved.questionMessage, questionVars),
        priority: resolved.priorityQuestion,
      }, ctx)
      return
    }
    // turn/end：结束原因判定只用原始标识，模板里 `{reason}` 用中文标签、`{reasonRaw}` 用标识。
    const reasonKind = event.data?.reason?.kind ?? 'unknown'
    const turn = event.data?.turn
    if (!shouldNotify(reasonKind, turn, resolved)) return
    const target = reasonKind === 'completed' ? resolved.titleCompleted : resolved.titleOther
    const vars = {
      id: shortId(session),
      title: latestTitle(session, ctx),
      turn: turn ?? '',
      reason: reasonLabel(reasonKind),
      reasonRaw: reasonKind,
      error: reasonError(event.data?.reason),
      cwd: cwdBasename(header.cwd),
      time: new Date().toLocaleString('zh-CN'),
    }
    void notify(client, config, {
      title: render(target, vars),
      message: render(resolved.message, vars),
      priority: priorityFor(reasonKind, resolved),
    }, ctx)
  })
```

</details>

#### 缺口

- 目标告警量、误报率、运维成本未测
  **影响：**不适合作为唯一关键告警链路
  **进一步探讨：**小样本事件矩阵与断网恢复测试

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
