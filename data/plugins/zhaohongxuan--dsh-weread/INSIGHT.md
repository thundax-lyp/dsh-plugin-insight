# dsh-weread

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[80fa890](https://github.com/zhaohongxuan/dsh-weread/tree/80fa890d43bb4810b61d1e1d55c3bc5279986a54)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhaohongxuan/dsh-weread) [![npm 30d 12](https://img.shields.io/static/v1?label=npm+30d&message=12&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-weread) [![最新发布 2026-08-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-weread)
<!-- END META -->

> **功能**：在 DSH 展示微信读书书架、划线回顾与统计，并通过内置模型生成笔记总结和画像。

> **亮点**：今日/回顾组织、按key增量缓存和本地面板减少笔记搬运；阅读事实来自Gateway，总结能力继承DSH模型。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：总结没有全书且按条数截取，画像书目来自有笔记子集；统计失败月可呈现为空，缓存有数据不等于同步完整。见 [Q01](#research-q01)、[Q02](#research-q02)。

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
  - [Q01 · 微信读书数据怎样进入回顾与 AI 总结，实际输入覆盖什么？](#detail-section-11)
  - [Q02 · 增量缓存、账号与统计失败如何影响用户看到的结论？](#detail-section-12)
  - [Q03 · 依赖与成本是什么，实际价值来自哪一层？](#detail-section-13)
  - [Q04 · 最有边界的试用是什么，下一步该验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：个人用户在 DSH 重看自己的微信读书划线与习惯，再核对笔记总结。见 [Q01](#research-q01)。

微信读书原App回顾，或手工导出笔记交模型；没有与其他阅读工具对比。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 今日/回顾 | 重看笔记 | 缓存时效与失败需核对 |
| 双书架 | 真实书架/有笔记书目 | 不同覆盖范围 |
| 笔记同步 | 增量、检查点、保留快照 | key身份不是用户隔离 |
| 阅读图表 | 显示上游统计 | 失败月份可能为空 |
| AI总结/画像 | 单次LLM分析 | 无全书、条数/标题截取 |
| Key设置 | Host保存及掩码 | 明文JSON，403有效性未独证 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| DSH Web connection | 路由与界面 | 必需 | 无fetch注册面板无数据 |
| 微信读书Gateway/key | 阅读数据 | 必需 | 上游可用性未测 |
| DSH llm/provider | 总结 | AI所需 | 默认模型不等于当前聊天模型 |
| 本地磁盘/可选代理 | 缓存及网络 | 按需 | 明文配置，权限尽力设置 |


| 阶段 | 操作 | 结果与边界 |
|---|---|---|
| 首次 | 配key、核已知书笔记 | 账号及数据来源核对 |
| 同步 | 读旧缓存并后台增量 | 未完成/失败不作完整统计 |
| AI | 点总结并对照原句 | 条数截取，无全书 |
| 异常 | 核error/时效、回原App | 空月或403不自行推断 |

**效果与成本**

| 阶段 | 现金 | 人工 | 未知及控制 |
|---|---|---|---|
| 首次 | 未测 | 构建、key、首次扫描 | 先用单书 |
| 持续 | 模型/网络费用未测 | 同步与结果核查 | ctx.llm非免费证明 |
| 失败恢复 | 重试费用未知 | 出口、快照、原App对照 | 不把缓存当新结果 |
| 退出 | 无独立测算 | 清key、缓存及远端授权分开 | 旧缓存不会因清key自动删 |


| 结果 | 源码支持 | 未验证 |
|---|---|---|
| 笔记回顾 | 持久增量与分页 | 上游完整性 |
| 数据隔开 | 按key哈希条目 | 多人Host隔离 |
| AI总结 | 真实LLM流及中断提示 | 正确率和全面理解 |
| 习惯统计 | 数据转换与图表入口 | 空月是否真零、总收益 |

> **思考**：总结没有全书且按条数截取，画像书目来自有笔记子集；统计失败月可呈现为空，缓存有数据不等于同步完整。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：今日/回顾组织、按key增量缓存和本地面板减少笔记搬运；阅读事实来自Gateway，总结能力继承DSH模型。见 [Q01](#research-q01)、[Q03](#research-q03)。

失败不晋升revision、保留旧快照、producer失效资格和原子缓存可借鉴；热力图吞月失败与AI覆盖需显式呈现。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

总结没有全书且按条数截取，画像书目来自有笔记子集；统计失败月可呈现为空，缓存有数据不等于同步完整。见 [Q01](#research-q01)、[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉的非敏感单书先核笔记数量日期再生成，逐条对照；同步失败或无依据结论时回原App。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码定向核查完成；未访问真实账号、Gateway或模型。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/aiPanel.tsx、src/host/ai/handler.ts、src/host/ai/llm.ts、src/host/ai/prompts.ts、src/host/config.ts、src/host/index.ts、src/host/routes.ts、src/host/store/cache.ts、src/host/store/journalCache.ts、src/host/weread/gateway.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查双端入口、Gateway、key配置、按key缓存/增量/失败、AI点击到prompt/流输出及热力图失败。未全审每个DTO解析、所有分页/跳转/统计图和宿主认证；未登录或运行目标。
- 下一步：已知笔记对照原App与插件，注入部分月份失败、缓存过期及key变化，再记录模型依据、纠错与全部成本；回执方向另做对照，均未执行。

**分析版本**

- **仓库**：[zhaohongxuan/dsh-weread](https://github.com/zhaohongxuan/dsh-weread)
- **版本号**：0.3.0（[固定提交 80fa890](https://github.com/zhaohongxuan/dsh-weread/tree/80fa890d43bb4810b61d1e1d55c3bc5279986a54)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证覆盖条数/截断/时效/失败月份与原句链接回执，能否减少误读和无依据总结；不能改善就推翻。见 [Q04](#research-q04)。

已知笔记对照原App与插件，注入部分月份失败、缓存过期及key变化，再记录模型依据、纠错与全部成本；回执方向另做对照，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 802 | — | — | 10671 |
| .mjs | source | 2 | 442 | 317 | 97 | — |
| .tsx | source | 12 | 3092 | 2486 | 389 | — |
| .ts | source | 23 | 3322 | 2393 | 673 | — |
| .mjs | test | 10 | 1132 | 1029 | 39 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/zhaohongxuan/dsh-weread/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查阅读数据覆盖、增量缓存和AI真实输入，形成个人回顾的采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 微信读书数据怎样进入回顾与 AI 总结，实际输入覆盖什么？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向同时使用微信读书与 DSH、希望重看自己划线和观察阅读习惯的个人用户。替代办法是在微信读书原界面回看，或导出笔记再交给模型。组件是侧栏和Host路由，不是模型可调用的自主阅读Agent；读取数据经Bearer key调用微信读书Agent Gateway，AI按钮再单次调用ctx.llm.stream。

Host向connection.fetch注册数据/设置/AI路由；无fetch registry时明确警告面板将无数据。今日/回顾读按账号的持久JSON缓存，书架则分真实书架和笔记书目两种来源。AI面板点击时请求，切换关闭会abort；Host先收集书籍信息、简介、划线和个人想法，组prompt后流式返回，头部标明实际provider/model。

单本“总结”不是读取全书：提示只取前120条划线、40条想法；主题分析取前150条。阅读画像书目来自fetchAllNotebooks，只有有笔记的书，即使界面切到真实书架也不因此变成全部在架书；画像prompt只列前60个标题。这些输入能支持个人笔记回顾，不能据标题宣称全面理解整本书或整个阅读史。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:43-65](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/index.ts#L43-L65)

实际路由注册与缺服务边界。

<details>
<summary>查看原文（23行）</summary>

```text
 */
export function apply(ctx: PluginContext): void {
  const logger = ctx.logger('dsh-weread')
  ctx.inject(['connection'], (scope) => {
    const connection = scope.get<HostConnection>('connection')
    const registry = connection?.fetch
    const register = registry?.register
    if (registry === undefined || typeof register !== 'function') {
      logger.warn('dsh-weread: host connection exposes no fetch registry; the panel will render without data')
      return
    }

    const cache = createCache()
    const deps: RouteDeps = { logger, cache, scope }

    for (const route of createRouter(deps)) {
      ctx.effect(
        () => register.call(registry, route.def),
        `dsh-weread: ${route.def.path}`,
      )
    }
  })
}
```

</details>

**依据 2 · 源码核查**：[src/host/weread/gateway.ts:55-85](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/weread/gateway.ts#L55-L85)

实际Gateway请求。

<details>
<summary>查看原文（31行）</summary>

```text
export async function callAgent<T = unknown>(
  apiName: string,
  params: Record<string, unknown> = {},
  signal?: AbortSignal,
): Promise<T> {
  const key = requireKey()
  const body = JSON.stringify({ api_name: apiName, skill_version: SKILL_VERSION, ...params })
  const agent = dispatcher()

  let response: Awaited<ReturnType<typeof undiciFetch>>
  try {
    response = await undiciFetch(GATEWAY_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        accept: 'application/json, text/plain, */*',
      },
      body,
      signal,
      ...(agent !== undefined ? { dispatcher: agent } : {}),
    })
  } catch (error) {
    throw new WereadError('weread/network', `请求微信读书失败：${String(error)}`, 502)
  }

  // 401 = bad/expired key; 403 = the key is accepted but the request is blocked
  // by weread's risk control (usually the egress IP), so they must not share a code
  // or the panel would wrongly say "API Key 无效".
  if (response.status === 401) {
    throw new WereadError('weread/unauthorized', 'API Key 无效或已过期', 401)
```

</details>

**依据 3 · 源码核查**：[src/client/aiPanel.tsx:100-139](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/client/aiPanel.tsx#L100-L139)

点击、流式显示及卸载取消。

<details>
<summary>查看原文（40行）</summary>

```text
export function AiPanel({ task, bookId, buttonLabel, hint, provider, model }: AiPanelProps): ReactNode {
  const [text, setText] = useState('')
  const [running, setRunning] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const abortRef = useRef<AbortController | null>(null)

  // Abort on unmount so a tab switch or drawer close cancels the stream.
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
    }
  }, [])

  const run = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setRunning(true)
    setError(null)
    setDone(false)
    setText('')
    try {
      const finalText = await streamAi(
        { task, bookId, provider, model, signal: controller.signal },
        (partial) => setText(partial),
      )
      setText(finalText)
      setDone(true)
    } catch (caught) {
      if (controller.signal.aborted) return
      const message = caught instanceof ApiError ? caught.message : String(caught)
      setError(message)
    } finally {
      if (abortRef.current === controller) {
        setRunning(false)
        abortRef.current = null
      }
    }
  }, [task, bookId, provider, model])
```

</details>

**依据 4 · 源码核查**：[src/host/ai/handler.ts:95-165](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/handler.ts#L95-L165)

总结和画像真实数据源。

<details>
<summary>查看原文（71行）</summary>

```text
  if (body.bookId === undefined || body.bookId === '') {
    throw new Error('缺少 bookId')
  }
  const key = `weread:ai:${PROMPT_VERSION}:${body.task}:${body.bookId}`
  return cache.get(key, 60 * 60_000, async () => {
    const bookId = body.bookId as string
    const [infoRaw, hlRaw, revRaw] = await Promise.all([
      callAgent('/book/info', { bookId }, signal),
      cache.get(`weread:highlights:${bookId}`, 10 * 60_000, () =>
        callAgent('/book/bookmarklist', { bookId }, signal),
      ),
      cache.get(`weread:reviews:${bookId}`, 10 * 60_000, () =>
        callAgent('/review/list/mine', { bookid: bookId, synckey: 0 }, signal),
      ),
    ])
    const info = (infoRaw ?? {}) as Record<string, unknown>
    const title = typeof info.title === 'string' ? info.title : '未知书名'
    const author = typeof info.author === 'string' ? info.author : ''
    const intro = typeof info.intro === 'string' ? info.intro : ''

    const highlights = parseHighlights(hlRaw).map((h) => h.markText)
    const reviews = parseReviews(revRaw).map((r) => r.content)

    if (body.task === 'highlights-themes') {
      return highlightsThemesPrompt({ title, highlights })
    }
    return summaryPrompt({ title, author, intro, highlights, reviews })
  })
}

/** Build the whole-shelf reading profile prompt from cached shelf + stats. */
async function buildShelfProfile(
  body: AiRequest,
  cache: Cache,
  signal?: AbortSignal,
): Promise<{ system: string; user: string }> {
  const key = `weread:ai:${PROMPT_VERSION}:shelf-profile`
  return cache.get(key, 60 * 60_000, async () => {
    const stats = await cache.get('weread:stats:overall:', 10 * 60_000, () =>
      callAgent('/readdata/detail', { mode: 'overall' }, signal),
    )
    const statsObj = (stats ?? {}) as Record<string, unknown>
    const preferCategory = Array.isArray(statsObj.preferCategory)
      ? (statsObj.preferCategory as Record<string, unknown>[])
      : []
    const preferAuthor = Array.isArray(statsObj.preferAuthor)
      ? (statsObj.preferAuthor as Record<string, unknown>[])
      : []
    const totalReadTime = Number(statsObj.totalReadTime) || 0
    const readDays = Number(statsObj.readDays) || 0

    const shelf = await cache.get('weread:shelf', 5 * 60_000, async () => {
      const { fetchAllNotebooks } = await import('../weread/paginate.js')
      return fetchAllNotebooks(signal)
    })
    const titles = shelf
      .map((b) => {
        const book = (b.book ?? {}) as Record<string, unknown>
        return typeof book.title === 'string' ? book.title : ''
      })
      .filter((t) => t !== '')

    void body
    return shelfProfilePrompt({
      bookCount: shelf.length,
      totalReadHours: totalReadTime / 3600,
      readDays,
      categories: preferCategory.map((c) => String(c.categoryTitle ?? '')).filter(Boolean),
      authors: preferAuthor.map((a) => String(a.name ?? '')).filter(Boolean),
      titles,
    })
```

</details>

**依据 5 · 源码核查**：[src/host/ai/prompts.ts:23-71](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/prompts.ts#L23-L71)

截取数量与提示要求。

<details>
<summary>查看原文（49行）</summary>

```text
export function summaryPrompt(input: {
  title: string
  author: string
  intro: string
  highlights: readonly string[]
  reviews: readonly string[]
}): PromptParts {
  const highlights = input.highlights.slice(0, 120).map((h, i) => `${i + 1}. ${h}`).join('\n')
  const reviews = input.reviews.slice(0, 40).map((r, i) => `${i + 1}. ${r}`).join('\n')
  const user =
    `请为下面这本书生成阅读总结。\n\n` +
    `《${input.title}》 作者：${input.author}\n` +
    `简介：${input.intro || '（无）'}\n\n` +
    `## 用户划线（共 ${input.highlights.length} 条）\n${highlights || '（无）'}\n\n` +
    `## 用户笔记/想法（共 ${input.reviews.length} 条）\n${reviews || '（无）'}\n\n` +
    `输出要求（Markdown）：\n` +
    `### 一句话总结\n### 核心观点（3-6 条）\n### 金句提炼（从我划线的角度提炼 3-5 句）\n### 我的关注点分析（基于划线/笔记推测用户最在意的主题）`
  return { system: SYSTEM, user }
}

/** Theme clustering over the user's highlights in one book. */
export function highlightsThemesPrompt(input: {
  title: string
  highlights: readonly string[]
}): PromptParts {
  const highlights = input.highlights.slice(0, 150).map((h, i) => `${i + 1}. ${h}`).join('\n')
  const user =
    `下面是用户在《${input.title}》中的划线。请把划线聚类成若干主题，并说明每个主题的含义。\n\n` +
    `${highlights || '（无）'}\n\n` +
    `输出（Markdown）：每个主题一个 ### 小标题，下面用要点列出该主题的代表划线（可引用原文），最后给一段「整体阅读关注点」小结。`
  return { system: SYSTEM, user }
}

/** Whole-shelf reading profile. */
export function shelfProfilePrompt(input: {
  bookCount: number
  totalReadHours: number
  readDays: number
  categories: readonly string[]
  authors: readonly string[]
  titles: readonly string[]
}): PromptParts {
  const user =
    `以下是用户的微信读书书架概况，请生成阅读画像。\n\n` +
    `书籍数：${input.bookCount}\n累计阅读：${input.totalReadHours.toFixed(1)} 小时，共 ${input.readDays} 天\n\n` +
    `## 偏好分类\n${input.categories.slice(0, 15).join('、') || '（无）'}\n\n` +
    `## 常读作者\n${input.authors.slice(0, 15).join('、') || '（无）'}\n\n` +
    `## 书架书目（节选）\n${input.titles.slice(0, 60).join('、')}\n\n` +
    `输出（Markdown）：\n### 阅读偏好画像\n### 主题分布\n### 阅读习惯观察\n### 下一步阅读建议（3-5 本方向或书目）`
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 增量缓存、账号与统计失败如何影响用户看到的结论？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

笔记缓存以API key的SHA256命名，临时文件同目录原子替换；这隔开不同key的磁盘条目，不是多人Host访问控制。后台同步每次请求前后检查key未变，路由改key先使weread内存缓存失效；旧producer只有仍持有inflight资格才能回填缓存。更换key会形成新的缓存身份，不能把key轮换当同一账号自动迁移。

增量根据笔记数量和更新时间等revision判断复用，分页失败不晋升该页revision，旧成功快照在刷新期间保留；首次扫描可写检查点。失败状态保留旧时间戳和error，返回缓存不表示同步成功。get触发后台任务并立即返回，不等扫描完；24小时有效期和5分钟重试是源码常量，不代表数据实时。revision未变化但内容实际变化能否被发现取决于上游字段，本次未验证。

统计有更隐蔽的降级：heatmap每个月请求失败会变成空对象，最终仍返回成功日表，因此某月无数据可能是失败而不是零阅读。AI输入缓存一小时，流中错误追加“生成中断”标记，客户端识别后显示提示；不能把部分流文本当完整总结。key校验遇403归blocked，保存路由却返回state=valid并写“有效”；403本身不能独立证明key有效，应按出口受阻、授权状态尚需复核理解。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/store/journalCache.ts:90-146](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/store/journalCache.ts#L90-L146)

key哈希身份及原子存储。

<details>
<summary>查看原文（57行）</summary>

```text
/** Hashes are storage identities only and never enter response DTOs. */
export function journalAccount(apiKey: string): string {
  return createHash('sha256').update(apiKey).digest('hex')
}

/** Restrict rename/unlink destinations to exactly the intended cache directory. */
function cachePath(directory: string, name: string): string {
  const path = resolve(directory, name)
  if (dirname(path) !== directory || !/^[a-f0-9]{64}(?:\.[a-f0-9-]+\.tmp)?\.json$/.test(name)) {
    throw new Error('Invalid journal cache path')
  }
  return path
}

function validState(value: unknown): value is JournalCacheState {
  if (value === null || typeof value !== 'object') return false
  const state = value as JournalCacheState
  return Array.isArray(state.notes) && state.notes.every((note) => note !== null && typeof note === 'object'
    && ['id', 'bookId', 'bookTitle', 'author', 'cover', 'chapterTitle', 'text'].every((key) => typeof (note as unknown as Record<string, unknown>)[key] === 'string')
    && (note.kind === 'highlight' || note.kind === 'thought') && Number.isFinite(note.createTime) && note.createTime > 0)
    && [state.totalBooks, state.scannedBooks, state.failedBooks, state.updatedAt].every((number) => Number.isFinite(number) && number >= 0)
    && typeof state.hasCache === 'boolean' && typeof state.error === 'string'
}

/** Atomic same-directory replacement, with no database or note truncation. */
export function createJournalFileStorage(configFile: string): JournalCacheStorage {
  const directory = resolve(dirname(configFile), 'journal-cache')
  return {
    async load(account) {
      const path = cachePath(directory, `${account}.json`)
      let record: JournalCacheRecord
      try {
        record = JSON.parse(await readFile(path, 'utf8')) as JournalCacheRecord
      } catch (error) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT' || error instanceof SyntaxError) return undefined
        throw error
      }
      if (record === null || typeof record !== 'object' || record.version !== 1 || !validState(record.state) || !Number.isFinite(record.lastAttempt)) return undefined
      const checkpoint = record.checkpoint
      if (checkpoint !== undefined && (!Array.isArray(checkpoint.books) || !Array.isArray(checkpoint.notes)
        || !Number.isSafeInteger(checkpoint.cursor) || checkpoint.cursor < 0 || checkpoint.cursor > checkpoint.books.length
        || !validState({ ...record.state, notes: checkpoint.notes }) || !Number.isFinite(checkpoint.scannedBooks) || !Number.isFinite(checkpoint.failedBooks))) {
        delete record.checkpoint
      }
      return record
    },
    async save(account, record) {
      const path = cachePath(directory, `${account}.json`)
      const temporary = cachePath(directory, `${account}.${randomUUID()}.tmp.json`)
      await mkdir(directory, { recursive: true, mode: 0o700 })
      await chmod(directory, 0o700)
      try {
        await writeFile(temporary, JSON.stringify(record), { encoding: 'utf8', mode: 0o600, flag: 'wx' })
        // Both resolved absolute paths were checked against the intended directory.
        await rename(temporary, path)
      } finally {
        await unlink(temporary).catch((error: NodeJS.ErrnoException) => { if (error.code !== 'ENOENT') throw error })
```

</details>

**依据 2 · 源码核查**：[src/host/routes.ts:115-129](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/routes.ts#L115-L129)

同步账号检查接线。

<details>
<summary>查看原文（15行）</summary>

```text
  // a settings change cannot mix another account's notes into an existing sync.
  const ensureAccount = (apiKey: string) => {
    if (readConfig().apiKey !== apiKey) throw new WereadError('weread/account-changed', '账号已更换，请重新同步', 409)
  }
  const accountCall = (apiKey: string) => (api: string, params: Record<string, unknown>) => {
    ensureAccount(apiKey)
    return callAgent(api, params, AbortSignal.timeout(30_000))
  }
  const journalCache = createJournalCache({
    storage: createJournalFileStorage(configPath()),
    assertAccount: ensureAccount,
    fetchBooks: async (apiKey) => journalBooks(await fetchAllNotebooks(undefined, accountCall(apiKey))),
    fetchPage: (books, cursor, apiKey) => fetchJournalPage(books, cursor, accountCall(apiKey)),
  })

```

</details>

**依据 3 · 源码核查**：[src/host/store/cache.ts:48-83](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/store/cache.ts#L48-L83)

旧producer回填资格撤销。

<details>
<summary>查看原文（36行）</summary>

```text
  return {
    async get<T>(key: string, ttlMs: number, produce: () => Promise<T>): Promise<T> {
      const now = Date.now()
      const hit = values.get(key) as Entry<T> | undefined
      if (hit !== undefined && hit.expiresAt > now) {
        touch(key, hit as Entry<unknown>)
        return hit.value
      }
      const running = inflight.get(key) as Promise<T> | undefined
      if (running !== undefined) return running

      const task = produce()
        .then((value) => {
          // Invalidating a key also revokes an older producer's right to cache.
          // This matters when credentials change while upstream work is in flight.
          if (inflight.get(key) === task) {
            touch(key, { value, expiresAt: Date.now() + ttlMs })
          }
          return value
        })
        .finally(() => {
          if (inflight.get(key) === task) inflight.delete(key)
        })
      inflight.set(key, task)
      return task
    },
    invalidate(key: string): void {
      values.delete(key)
      inflight.delete(key)
    },
    invalidatePrefix(prefix: string): void {
      for (const key of [...values.keys()]) if (key.startsWith(prefix)) values.delete(key)
      for (const key of [...inflight.keys()]) if (key.startsWith(prefix)) inflight.delete(key)
    },
    clear(): void {
      values.clear()
```

</details>

**依据 4 · 源码核查**：[src/host/store/journalCache.ts:199-287](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/store/journalCache.ts#L199-L287)

增量、失败、检查点、保留快照及立即返回。

<details>
<summary>查看原文（89行）</summary>

```text
      else for (const book of books) {
        const bookId = bookIdOf(book)
        const revision = revisionOf(book)
        const cached = grouped.get(bookId) ?? []
        const saved = entry.bookRevisions?.[bookId]
        // Older cache files have no manifest. Counts of dated notes are a
        // conservative migration check; any mismatch takes the normal fetch path.
        const reusable = revision !== undefined && (sameRevision(saved, revision)
          || (entry.bookRevisions === undefined && legacyMatches(cached, revision, previous.updatedAt)))
        if (reusable && revision !== undefined) {
          for (const note of cached) collected.set(note.id, note)
          nextRevisions[bookId] = revision
          scannedBooks += 1
        } else changed.push(book)
      }
      let cursor = resume?.cursor ?? 0
      let failedBooks = resume?.failedBooks ?? 0
      entry.state = { ...entry.state, totalBooks, scannedBooks, failedBooks }
      while (cursor < changed.length) {
        deps.assertAccount?.(apiKey)
        const page = await deps.fetchPage(changed, cursor, apiKey)
        deps.assertAccount?.(apiKey)
        for (const note of page.notes) collected.set(note.id, note)
        // Page failures are aggregate: promote no revisions from a failed page,
        // so none of its books can silently become permanently cached partials.
        if (page.failedBooks === 0) {
          for (const book of changed.slice(cursor, page.nextCursor ?? changed.length)) {
            const revision = revisionOf(book)
            if (revision !== undefined) nextRevisions[bookIdOf(book)] = revision
          }
        }
        scannedBooks += page.scannedBooks
        failedBooks += page.failedBooks
        const notes = [...collected.values()].sort((a, b) => b.createTime - a.createTime || a.id.localeCompare(b.id))
        entry.state = { ...entry.state, notes: keepGood ? previous.notes : notes, scannedBooks, failedBooks,
          hasCache: keepGood || notes.length > 0 }
        const next = page.nextCursor ?? changed.length
        if (!Number.isSafeInteger(next) || next <= cursor || next > changed.length) throw new Error('Invalid journal page cursor')
        cursor = next
        if (!keepGood) {
          entry.checkpoint = { books: changed, totalBooks, cursor, notes, scannedBooks, failedBooks, bookRevisions: nextRevisions }
          if (now() - checkpointAt >= CHECKPOINT_INTERVAL) {
            await deps.storage.save(account, recordOf(entry))
            checkpointAt = now()
          }
        }
      }
      delete entry.checkpoint
      entry.lastAttempt = now()
      if (failedBooks > 0) {
        if (!keepGood) entry.bookRevisions = nextRevisions
        entry.state = { ...entry.state, syncing: false, error: `${failedBooks} 本书的笔记未完整同步，请稍后重试`,
          hasCache: true }
      } else {
        entry.bookRevisions = nextRevisions
        entry.state = { notes: [...collected.values()].sort((a, b) => b.createTime - a.createTime || a.id.localeCompare(b.id)),
          totalBooks, scannedBooks, failedBooks: 0, syncing: false, updatedAt: now(), error: '', hasCache: true }
      }
      await deps.storage.save(account, recordOf(entry))
    } catch {
      // Upstream errors may contain credentials or request URLs. Expose only a
      // fixed message and retain the last good snapshot (including its timestamp).
      entry.lastAttempt = now()
      if (keepGood) {
        if (previousRevisions === undefined) delete entry.bookRevisions
        else entry.bookRevisions = previousRevisions
      }
      entry.state = { ...(keepGood ? previous : entry.state), updatedAt: previous.updatedAt, syncing: false, error: '笔记同步失败，已保留缓存，请稍后重试' }
      try { await deps.storage.save(account, recordOf(entry)) } catch {
        entry.state = { ...entry.state, error: '笔记缓存写入失败，已保留内存中的笔记，请稍后重试' }
      }
    }
  }
  return {
    async get(apiKey: string, force = false): Promise<JournalCacheState> {
      const account = journalAccount(apiKey)
      const entry = await entryFor(account)
      const time = now()
      const fresh = entry.state.updatedAt > 0 && time - entry.state.updatedAt < JOURNAL_TTL
      if (entry.inflight === undefined && (force || (!fresh && time - entry.lastAttempt >= JOURNAL_RETRY))) {
        entry.lastAttempt = time
        entry.state = { ...entry.state, syncing: true, error: '' }
        // Defer every upstream operation until after inflight is assigned. Even a
        // synchronous fake/throwing producer cannot race another GET or POST.
        entry.inflight = Promise.resolve().then(() => sync(account, apiKey, entry)).catch(() => {
          entry.state = { ...entry.state, syncing: false, error: '笔记同步失败，请稍后重试' }
        }).finally(() => { delete entry.inflight })
      }
      return { ...entry.state }
```

</details>

**依据 5 · 源码核查**：[src/host/routes.ts:460-490](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/routes.ts#L460-L490)

每月失败被空对象吸收。

<details>
<summary>查看原文（31行）</summary>

```text
        const value = await cache.get(cacheKey, 30 * 60_000, async () => {
          let targets: Date[]
          if (year !== undefined && Number.isFinite(year)) {
            targets = Array.from({ length: 12 }, (_, m) => new Date(year, m, 1))
          } else {
            const now = new Date()
            const anchor = new Date(now.getFullYear(), now.getMonth(), 1)
            targets = Array.from({ length: months }, (_, i) => new Date(anchor.getFullYear(), anchor.getMonth() - i, 1))
          }
          const days: Record<string, number> = {}
          await mapLimit(targets, 3, async (monthStart) => {
            const baseTime = Math.floor(monthStart.getTime() / 1000)
            const raw = await callAgent('/readdata/detail', { mode: 'monthly', baseTime }, request.signal).catch(
              () => ({}),
            )
            const readTimes = ((raw as Record<string, unknown>).readTimes ?? {}) as Record<string, unknown>
            for (const [ts, sec] of Object.entries(readTimes)) {
              const seconds = Number(sec)
              if (!Number.isFinite(seconds) || seconds <= 0) continue
              const d = new Date(Number(ts) * 1000)
              if (Number.isNaN(d.getTime())) continue
              // Only keep days inside the requested year, so a baseTime month that
              // spills into an adjacent year does not leak into this wall.
              if (year !== undefined && Number.isFinite(year) && d.getFullYear() !== year) continue
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              days[key] = (days[key] ?? 0) + seconds
            }
          })
          return days
        })
        return ok(value)
```

</details>

**依据 6 · 源码核查**：[src/host/routes.ts:513-534](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/routes.ts#L513-L534)

403保存为valid的可见状态。

<details>
<summary>查看原文（22行）</summary>

```text
      fetch: async (request) => {
        try {
          const body = (await request.json()) as { apiKey?: unknown }
          const apiKey = typeof body.apiKey === 'string' ? body.apiKey.trim() : ''
          cache.invalidatePrefix('weread:')
          const stored = setApiKey(apiKey)
          if (apiKey === '') return ok(stored)
          const verdict = await validateKey()
          if (verdict === 'valid') {
            return ok({ state: 'valid', masked: stored.masked })
          }
          if (verdict === 'blocked') {
            return ok({
              state: 'valid',
              masked: stored.masked,
              message: 'API Key 已保存且有效，但当前网络出口被微信读书风控拦截（403），请配置可访问微信读书的代理',
            })
          }
          if (verdict === 'invalid') {
            return ok({ state: 'invalid', masked: stored.masked, message: 'API Key 无效，请检查后重试' })
          }
          return ok({ state: 'unknown', masked: stored.masked, message: '无法确认 API Key 状态（网络异常），已保存，请稍后重试' })
```

</details>

**依据 7 · 源码核查**：[src/host/ai/handler.ts:46-78](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/handler.ts#L46-L78)

流中错误标记与模型响应头。

<details>
<summary>查看原文（33行）</summary>

```text
  if (llm === undefined || typeof llm.stream !== 'function') {
    return jsonError('weread/no-llm', '当前 dsh 未提供 LLM 服务，无法生成 AI 总结', 503)
  }

  try {
    const target = resolveTarget(llm, body.provider, body.model)
    const prompt = await buildPrompt(body, cache, request.signal)

    // Cache the assembled prompt inputs under a stable key is handled upstream;
    // here we stream directly. Chunked plain text keeps the client parse trivial.
    const encoder = new TextEncoder()
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        try {
          for await (const delta of streamText(target, prompt.system, prompt.user, request.signal)) {
            controller.enqueue(encoder.encode(delta))
          }
          controller.close()
        } catch (error) {
          logger.warn(`dsh-weread/ai: stream failed: ${String(error)}`)
          controller.enqueue(encoder.encode(`\n\n[生成中断：${String(error)}]`))
          controller.close()
        }
      },
    })

    return new Response(stream, {
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'cache-control': 'no-store',
        'x-weread-provider': target.provider,
        'x-weread-model': target.model,
      },
```

</details>

**依据 8 · 源码核查**：[src/client/aiPanel.tsx:88-90](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/client/aiPanel.tsx#L88-L90)

客户端识别中断标记。

```text
/** Detect the host's mid-stream failure marker. */
function isInterrupted(text: string): boolean {
  return text.includes(AI_INTERRUPT_MARKER)
```

#### 缺口

- 未做账号切换竞争、接口revision变化和真实统计失败实验，未审宿主权限实现。
  **影响**：不能宣称所有数据完整、403已授权或多用户隔离。
  **进一步探讨**：用测试账号模拟部分月份失败及key变化，检查缓存时间、错误提示和原App数据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 依赖与成本是什么，实际价值来自哪一层？

**研究主题**：依赖、兼容与流程、贡献与相对优势、效果与总成本

#### 完整回答

主要贡献是把分散的个人阅读记录组织成今日/回顾及统计面板，配合按key持久增量与笔记prompt。原始书架、进度、笔记、阅读时间由微信读书接口提供，模型总结由DSH服务完成；缓存并不生成新的阅读事实。日期、统计分桶及笔记来源差异必须保留，不能用日历推导完整阅读流水。

需要兼容的DSH Web connection/LLM、微信读书API key和能访问Gateway的网络；可选代理。package声明Node ^22.19.0或>=24、DSH>=0.2.0-rc.2。配置将key以明文JSON存Host，尝试600权限且chmod失败容忍；它是本地受权限保护存储，不是加密保管。模型选择按请求、配置、内建magpie/workbuddy默认依次解析，不是自动读取任意用户当前聊天模型；没有该provider/model就可能失败。个人笔记和画像输入发往选定模型，应在发送前判断是否适合该服务。

首次需要构建/配置、获取key、扫描笔记；持续有Gateway流量、磁盘缓存和模型调用费用，金额未测，复用ctx.llm不代表免费。失败恢复包括重连、检查快照时效与对照原App，清key不等于删除已有账号缓存，退出需分别清理本地凭据/缓存及远端授权。没有实际回顾效果、模型正确率和总成本对照，不声称节省时间或提高理解。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/config.ts:43-84](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/config.ts#L43-L84)

明文配置和尽力权限。

<details>
<summary>查看原文（42行）</summary>

```text
/** `$DSH_HOME`, else `~/.dsh`. */
function dshHome(): string {
  const raw = process.env.DSH_HOME?.trim()
  if (raw !== undefined && raw !== '') return raw
  return join(homedir(), '.dsh')
}

/** Absolute path of the plugin config file. */
export function configPath(): string {
  return join(dshHome(), 'storages', 'dsh-weread', 'config.json')
}

/** Read the persisted config, or the empty default when absent/corrupt. */
export function readConfig(): WereadConfig {
  const path = configPath()
  if (!existsSync(path)) return { ...EMPTY }
  try {
    const parsed = JSON.parse(readFileSync(path, 'utf8')) as Partial<WereadConfig>
    // Optional keys are attached only when the file actually carries them, so a
    // read never invents fields the on-disk file does not have.
    const config: WereadConfig = { apiKey: typeof parsed.apiKey === 'string' ? parsed.apiKey : '' }
    if (typeof parsed.proxy === 'string' && parsed.proxy !== '') config.proxy = parsed.proxy
    if (typeof parsed.aiProvider === 'string' && parsed.aiProvider !== '') config.aiProvider = parsed.aiProvider
    if (typeof parsed.aiModel === 'string' && parsed.aiModel !== '') config.aiModel = parsed.aiModel
    if (parsed.shelfMode === 'bookshelf' || parsed.shelfMode === 'notebooks') config.shelfMode = parsed.shelfMode
    return config
  } catch {
    return { ...EMPTY }
  }
}

/** Persist the config (creating the directory) with owner-only permissions. */
export function writeConfig(config: WereadConfig): void {
  const path = configPath()
  mkdirSync(dirname(path), { recursive: true })
  writeFileSync(path, JSON.stringify(config, null, 2), { encoding: 'utf8', mode: 0o600 })
  try {
    chmodSync(path, 0o600)
  } catch {
    // Best effort: some filesystems ignore mode bits.
  }
}
```

</details>

**依据 2 · 源码核查**：[src/host/ai/llm.ts:20-37](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/llm.ts#L20-L37)

实际模型解析优先级。

<details>
<summary>查看原文（18行）</summary>

```text
/** dsh profile default, used when neither the request nor config names one. */
const DEFAULT_PROVIDER = 'magpie'
const DEFAULT_MODEL = 'workbuddy/deepseek-v4.1-flash'

/**
 * Pick the provider/model for one call.
 * Precedence: explicit request > stored config > built-in default.
 */
export function resolveTarget(
  service: LlmService,
  requestProvider?: string,
  requestModel?: string,
): LlmTarget {
  const config = readConfig()
  const provider = requestProvider?.trim() || config.aiProvider?.trim() || DEFAULT_PROVIDER
  const model = requestModel?.trim() || config.aiModel?.trim() || DEFAULT_MODEL
  return { service, provider, model }
}
```

</details>

**依据 3 · 源码核查**：[src/host/ai/llm.ts:47-71](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/llm.ts#L47-L71)

数据发送到LLM流调用。

<details>
<summary>查看原文（25行）</summary>

```text
  target: LlmTarget,
  system: string | undefined,
  user: string,
  signal?: AbortSignal,
): AsyncGenerator<string> {
  const messages = [] as Array<{ role: 'system' | 'user'; content: Array<{ type: 'text'; text: string }> }>
  if (system !== undefined && system !== '') {
    messages.push({ role: 'system', content: [{ type: 'text', text: system }] })
  }
  messages.push({ role: 'user', content: [{ type: 'text', text: user }] })

  const stream = target.service.stream({
    provider: target.provider,
    model: target.model,
    messages,
    ...(signal !== undefined ? { signal } : {}),
  })

  for await (const chunk of stream) {
    if (signal?.aborted === true) return
    if (chunk.type === 'text-delta' && typeof chunk.text === 'string' && chunk.text !== '') {
      yield chunk.text
    }
  }
}
```

</details>

**依据 4 · 源码核查**：[package.json:26-43](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/package.json#L26-L43)

运行依赖和双端声明。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.0-rc.2"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4"
  },
  "scripts": {
    "build": "node scripts/build.mjs",
    "dev": "node scripts/build.mjs --watch",
```

</details>

**依据 5 · 源码核查**：[src/host/store/journalCache.ts:12-13](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/store/journalCache.ts#L12-L13)

刷新及失败重试常量。

```text
export const JOURNAL_TTL = 24 * 60 * 60_000
export const JOURNAL_RETRY = 5 * 60_000
```

#### 缺口

- 上游实际可用性、限流/授权政策和模型费用未验证。
  **影响**：无法保证持续同步或计算合格回顾单位成本。
  **进一步探讨**：固定已知笔记集记录扫描请求、模型输入/结果、人工纠错与全部费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 最有边界的试用是什么，下一步该验证什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议个人用户先选一本自己熟悉且非敏感的有笔记书，核对原App与插件划线数量、日期和跳转；在同步完成且无error后生成一次笔记总结，逐条检查是否有原句支持。用阅读画像时明确其书目取自笔记本子集，统计空月回原App复核。接口受阻、总结把未提供内容当事实或同步错误未消除时停止据此判断，退回原App和手工导出笔记。

值得验证的是“带覆盖回执的回顾”：总结前显示实际纳入的书/笔记条数、截断、缓存时间、失败月份及来源链接，结论回指具体划线。依据是当前prompt有截取且统计可吞失败；相对美观图表，增量是让用户知道缺什么并核验结论。最小实验用已知笔记集混入截断和月接口失败，对比现界面与回执版发现缺失/无依据结论的比例、纠错时间与总调用成本；如果现有提示已足够或回执不能改善识别，就推翻该方向。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/ai/prompts.ts:23-71](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/ai/prompts.ts#L23-L71)

输入截取动因。

<details>
<summary>查看原文（49行）</summary>

```text
export function summaryPrompt(input: {
  title: string
  author: string
  intro: string
  highlights: readonly string[]
  reviews: readonly string[]
}): PromptParts {
  const highlights = input.highlights.slice(0, 120).map((h, i) => `${i + 1}. ${h}`).join('\n')
  const reviews = input.reviews.slice(0, 40).map((r, i) => `${i + 1}. ${r}`).join('\n')
  const user =
    `请为下面这本书生成阅读总结。\n\n` +
    `《${input.title}》 作者：${input.author}\n` +
    `简介：${input.intro || '（无）'}\n\n` +
    `## 用户划线（共 ${input.highlights.length} 条）\n${highlights || '（无）'}\n\n` +
    `## 用户笔记/想法（共 ${input.reviews.length} 条）\n${reviews || '（无）'}\n\n` +
    `输出要求（Markdown）：\n` +
    `### 一句话总结\n### 核心观点（3-6 条）\n### 金句提炼（从我划线的角度提炼 3-5 句）\n### 我的关注点分析（基于划线/笔记推测用户最在意的主题）`
  return { system: SYSTEM, user }
}

/** Theme clustering over the user's highlights in one book. */
export function highlightsThemesPrompt(input: {
  title: string
  highlights: readonly string[]
}): PromptParts {
  const highlights = input.highlights.slice(0, 150).map((h, i) => `${i + 1}. ${h}`).join('\n')
  const user =
    `下面是用户在《${input.title}》中的划线。请把划线聚类成若干主题，并说明每个主题的含义。\n\n` +
    `${highlights || '（无）'}\n\n` +
    `输出（Markdown）：每个主题一个 ### 小标题，下面用要点列出该主题的代表划线（可引用原文），最后给一段「整体阅读关注点」小结。`
  return { system: SYSTEM, user }
}

/** Whole-shelf reading profile. */
export function shelfProfilePrompt(input: {
  bookCount: number
  totalReadHours: number
  readDays: number
  categories: readonly string[]
  authors: readonly string[]
  titles: readonly string[]
}): PromptParts {
  const user =
    `以下是用户的微信读书书架概况，请生成阅读画像。\n\n` +
    `书籍数：${input.bookCount}\n累计阅读：${input.totalReadHours.toFixed(1)} 小时，共 ${input.readDays} 天\n\n` +
    `## 偏好分类\n${input.categories.slice(0, 15).join('、') || '（无）'}\n\n` +
    `## 常读作者\n${input.authors.slice(0, 15).join('、') || '（无）'}\n\n` +
    `## 书架书目（节选）\n${input.titles.slice(0, 60).join('、')}\n\n` +
    `输出（Markdown）：\n### 阅读偏好画像\n### 主题分布\n### 阅读习惯观察\n### 下一步阅读建议（3-5 本方向或书目）`
```

</details>

**依据 2 · 源码核查**：[src/host/routes.ts:470-490](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/routes.ts#L470-L490)

失败月份缺口。

<details>
<summary>查看原文（21行）</summary>

```text
          await mapLimit(targets, 3, async (monthStart) => {
            const baseTime = Math.floor(monthStart.getTime() / 1000)
            const raw = await callAgent('/readdata/detail', { mode: 'monthly', baseTime }, request.signal).catch(
              () => ({}),
            )
            const readTimes = ((raw as Record<string, unknown>).readTimes ?? {}) as Record<string, unknown>
            for (const [ts, sec] of Object.entries(readTimes)) {
              const seconds = Number(sec)
              if (!Number.isFinite(seconds) || seconds <= 0) continue
              const d = new Date(Number(ts) * 1000)
              if (Number.isNaN(d.getTime())) continue
              // Only keep days inside the requested year, so a baseTime month that
              // spills into an adjacent year does not leak into this wall.
              if (year !== undefined && Number.isFinite(year) && d.getFullYear() !== year) continue
              const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
              days[key] = (days[key] ?? 0) + seconds
            }
          })
          return days
        })
        return ok(value)
```

</details>

**依据 3 · 源码核查**：[src/host/store/journalCache.ts:248-266](https://github.com/zhaohongxuan/dsh-weread/blob/80fa890d43bb4810b61d1e1d55c3bc5279986a54/src/host/store/journalCache.ts#L248-L266)

时间和错误字段可作回执输入。

<details>
<summary>查看原文（19行）</summary>

```text
      if (failedBooks > 0) {
        if (!keepGood) entry.bookRevisions = nextRevisions
        entry.state = { ...entry.state, syncing: false, error: `${failedBooks} 本书的笔记未完整同步，请稍后重试`,
          hasCache: true }
      } else {
        entry.bookRevisions = nextRevisions
        entry.state = { notes: [...collected.values()].sort((a, b) => b.createTime - a.createTime || a.id.localeCompare(b.id)),
          totalBooks, scannedBooks, failedBooks: 0, syncing: false, updatedAt: now(), error: '', hasCache: true }
      }
      await deps.storage.save(account, recordOf(entry))
    } catch {
      // Upstream errors may contain credentials or request URLs. Expose only a
      // fixed message and retain the last good snapshot (including its timestamp).
      entry.lastAttempt = now()
      if (keepGood) {
        if (previousRevisions === undefined) delete entry.bookRevisions
        else entry.bookRevisions = previousRevisions
      }
      entry.state = { ...(keepGood ? previous : entry.state), updatedAt: previous.updatedAt, syncing: false, error: '笔记同步失败，已保留缓存，请稍后重试' }
```

</details>

#### 缺口

- 试用及覆盖回执对照未执行。
  **影响**：用户回顾价值及新方向效果未证实。
  **进一步探讨**：已知笔记对照先量缺失识别与纠错，再决定开发。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
