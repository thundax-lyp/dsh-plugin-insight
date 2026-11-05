# Anime Find

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[71b76ef](https://github.com/cocofhu/anime-find/tree/71b76efe604c7b3f875ffb97e6be13c707931a20)

<!-- BEGIN META -->
[![GitHub ★ 172](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=172&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/cocofhu/anime-find) [![npm 30d 941](https://img.shields.io/static/v1?label=npm+30d&message=941&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cocofhu/anime-find) [![最新发布 2026-08-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@cocofhu/anime-find)
<!-- END META -->

> **功能**：在 DSH 对话中搜索番剧并浏览字幕组、资源与可选播放源。

> **亮点**：[Q01](#research-q01) 把多源候选带进会话。

> **主要限制**：[Q03](#research-q03) 静态规则不能执行动态 WebView 站点。

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
  - [Q01 · 会话查番提供什么？](#detail-section-11)
  - [Q02 · 播放请求怎样限制重定向？](#detail-section-12)
  - [Q03 · 规则能覆盖动态站点吗？](#detail-section-13)
  - [Q04 · 如何控制试用范围？](#detail-section-14)
  - [Q05 · 显示结果的来源缺口能减少误判吗？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想在 DSH 讨论番剧资料的人可用会话搜索。

逐站查询能看原始结果，搬运需人工完成。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 聚合检索 | 查找标题与资源 | 依赖外部目录 |
| 媒体规则 | 读取授权播放源 | 静态规则有兼容边界 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Web profile | 必需 | 显示会话卡 | 改用网页 |
| 外部资源 API | 检索必需 | 返回资源 | 保留局部结果 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 先禁用播放规则 | 核对包 |
| 查询 | 测试一个授权条目 | 看来源错误 |
| 退出 | 禁用 | 回原站 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装开销未知 | 配置耗时未知 | 版本要求 |
| 持续 | 网络开销未知 | 规则维护未知 | 站点变化 |
| 恢复 | 重试未知 | 排障未知 | 可关闭播放 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多源结果 | 有并发和失败隔离 | 覆盖未测 |

> **思考**：[Q03](#research-q03) 静态规则不能执行动态 WebView 站点。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把多源候选带进会话。

媒体跳转逐跳复核域。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 静态规则不能执行动态 WebView 站点。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用搜索，再单独评估播放规则。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定检索、注册和规则源码，未运行宿主、源站或播放。

- 已检查：作者 README、包清单、源码路径 README.md、src/search.ts、src/host.ts、src/streaming.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定检索、注册和规则源码，未运行宿主、源站或播放。
- 下一步：模拟两类来源失败

**分析版本**

- **仓库**：[cocofhu/anime-find](https://github.com/cocofhu/anime-find)
- **版本号**：0.1.12（[固定提交 71b76ef](https://github.com/cocofhu/anime-find/tree/71b76efe604c7b3f875ffb97e6be13c707931a20)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 测试来源缺口提示。

模拟两类来源失败

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 354 | — | — | 3563 |
| .ts | source | 17 | 2870 | 2585 | 79 | — |
| .js | source | 1 | 1570 | 1490 | 49 | — |
| .ts | test | 12 | 1858 | 1666 | 144 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/cocofhu/anime-find/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查聚合检索与可选流媒体代理的机制和边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 会话查番提供什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

搜索结果可进入 DSH 结果卡，用户无需先在各站复制链接。不同来源分支单独捕捉错误，所以剩余候选仍可使用；空结果应先看来源错误。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-21](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/README.md#L9-L21)

作者描述聚合、卡片与详情

<details>
<summary>查看原文（13行）</summary>

```text
DeepSeek Harness 搜番插件。在对话中搜索番剧，以可点击卡片展示结果，并在详情面板中查看字幕组、磁力链接和种子文件。

## 功能

- 聚合 [Mikan](https://mikanani.me)、[AniBT](https://anibt.net) 和 [AnimeGarden](https://animes.garden)
- 在对话流中展示番剧封面、标题、评分、格式和资源数量
- 根据 Asia/Shanghai 时区识别当前新番季度
- 支持「还有吗」「换一批」等追问并分页展示更多结果
- 点击卡片后按字幕组和集数浏览资源，并可查看 Bangumi 介绍、评分和短评
- 支持复制磁力链接和打开 `.torrent` 文件
- 可选流媒体 Tab：按搜索结果显示用户规则解析出的可播源，并在同页选集播放
- 可在 Harness 插件设置中启用来源、调整结果数量和站点地址
- 在插件设置中查看当前版本，并手动检查 GitHub 正式 Release
```

</details>

**依据 2 · 源码核查**：[src/search.ts:42-66](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/search.ts#L42-L66)

多来源任务与错误处理

<details>
<summary>查看原文（25行）</summary>

```text
  }

  const jobs: Array<Promise<void>> = []
  if (sources.includes('mikan')) {
    jobs.push(
      searchMikan(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'mikan', message: messageOf(err) }) }),
    )
  }
  if (sources.includes('anibt')) {
    jobs.push(
      searchAniBT(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'anibt', message: messageOf(err) }) }),
    )
  }
  if (sources.includes('garden')) {
    jobs.push(
      searchGarden(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'garden', message: messageOf(err) }) }),
    )
  }
  await Promise.all(jobs)
```

</details>

**依据 3 · 源码核查**：[src/host.ts:68-94](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/host.ts#L68-L94)

注册查询工具

<details>
<summary>查看原文（27行）</summary>

```text
  ctx.tools.register(defineTool({
    name: 'anime_find_search',
    description:
      'Show clickable anime cards. ALWAYS call this instead of web_search for 动漫/番剧/新番/磁力. For a title, pass that title. For 最近好看的动漫 / 本季 / 还有吗, pass "本季"; the tool uses the host clock (Asia/Shanghai) and lists that season. If the user asks 还有吗 / 再来一些, call AGAIN with the same query and offset = number of cards already shown. Do NOT say there are no more without calling the tool. Do not fetch magnets yourself.',
    parameters: {
      query: { type: 'string', required: true, description: 'Anime title, or "本季" for the current season. Example: 无职转生' },
      sources: {
        type: 'array',
        items: { type: 'string' },
        description: 'Optional subset: mikan, anibt, garden',
      },
      limit: { type: 'number', description: 'Cards in this batch. Season default 36, title default from config.' },
      offset: { type: 'number', description: 'Skip this many already-shown cards when the user wants more.' },
    },
    output: {
      schema: { type: 'object', additionalProperties: true },
      render: (_args, value) => [{ type: 'text', text: renderSearch(value as unknown as SearchResult) }],
      presentationMeta: (_args, value) => ({ kind: 'anime-find-search', ...(value as object) }),
    },
    presentCall: (args) => ({ card: 'generic', title: `搜番 · ${args.query}`, kind: 'search', content: [] }),
    presentResult: (_args, { isError, meta }) => ({
      card: 'generic',
      title: isError ? '搜番失败' : `搜番 · ${(meta as SearchResult | undefined)?.items?.length ?? 0} 条`,
      content: [],
    }),
    timeoutMs: cfg.timeoutMs + 5000,
    async execute(args, exec) {
```

</details>

#### 缺口

- 未测试源站
  **影响**：不能判断结果覆盖
  **进一步探讨**：比较同一标题在各站和会话中的结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 播放请求怎样限制重定向？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

流媒体路径以规则为边界。每跳重查是否允许，重新构造头，并手动处理跳转。搜索规则及媒体规则有不同允许范围，用户配置的规则和请求头属于信任输入。

#### 证据与依据

**依据 1 · 源码核查**：[src/streaming.ts:74-101](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/streaming.ts#L74-L101)

逐跳检查和时限

<details>
<summary>查看原文（28行）</summary>

```text
  init: RequestInit = {},
  kind: AllowKind = 'page',
): Promise<Response> {
  let current = url
  const controller = new AbortController()
  const timer = setTimeout(() => controller.abort(), Math.min(cfg.timeoutMs, 15000))
  try {
    for (let redirects = 0; redirects <= MAX_REDIRECTS; redirects++) {
      if (!isAllowedForRule(current, rule, kind)) throw new Error('流媒体地址不在当前规则允许域内')
      // Recomputed per hop: a redirect can land on a CDN with different header
      // requirements than the host that issued it.
      const headers = new Headers(init.headers)
      headers.set('user-agent', cfg.userAgent)
      headers.set('referer', rule.baseURL)
      for (const [key, value] of Object.entries(requestHeaderOverrides(rule, current, kind))) {
        if (value === '') headers.delete(key)
        else headers.set(key, value)
      }
      const res = await fetch(current, { ...init, headers, signal: controller.signal, redirect: 'manual' })
      if (![301, 302, 303, 307, 308].includes(res.status)) return res
      const location = res.headers.get('location')
      if (!location) throw new Error('源站重定向缺少地址')
      current = new URL(location, current).toString()
    }
    throw new Error(`源站重定向超过 ${MAX_REDIRECTS} 次`)
  } finally {
    clearTimeout(timer)
  }
```

</details>

**依据 2 · 源码核查**：[src/host.ts:127-133](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/host.ts#L127-L133)

宿主媒体入口

```text
    const server = (c as unknown as { webServer: { register: (route: { kind: string; path: string; handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void> }) => void } }).webServer
    server.register({ kind: 'exact', path: '/anime-find', handler: (req, res) => handleApi(req, res, cfg, () => settingsWriter) })
    server.register({ kind: 'exact', path: '/anime-find/cover', handler: (req, res) => handleCover(req, res, cfg) })
    server.register({ kind: 'exact', path: '/anime-find/media', handler: (req, res) => handleMedia(req, res, cfg) })
    // DSH only exposes the declared client entry automatically. Serve hls.js explicitly
    // so the ToolView can load the package asset at /plugins/anime-find/hls.min.js.
    server.register({ kind: 'exact', path: '/plugins/anime-find/hls.min.js', handler: (_req, res) => handleHlsAsset(res) })
```

#### 缺口

- 未测试含代理/CDN 的真实规则
  **影响**：不能保证复杂重定向可用
  **进一步探讨**：用受控站点核对允许和拒绝

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 规则能覆盖动态站点吗？

**研究主题**：缺陷与关键质疑

#### 完整回答

规则导入校验必要字段与选择器。声明 useWebview 会提示静态能力有限，实际 searchRule 直接跳过。聚合只取部分候选并忽略失败任务，所以无播放源既可能是站点无内容，也可能是规则不可执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/streaming.ts:193-208](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/streaming.ts#L193-L208)

验证和静态聚合

<details>
<summary>查看原文（16行）</summary>

```text
  if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('规则必须是 JSON 对象')
  const rule = raw as StreamRule
  const required = ['name', 'baseURL', 'searchURL', 'searchList', 'searchName', 'searchResult', 'chapterRoads', 'chapterResult'] as const
  for (const key of required) if (!String(rule[key] || '').trim()) throw new Error(`规则缺少必要字段：${key}`)
  if (!/^https?:\/\//i.test(rule.baseURL)) throw new Error('baseURL 必须是 http 或 https 地址')
  for (const key of ['searchList', 'searchName', 'searchResult', 'chapterRoads', 'chapterResult'] as const) selector(String(rule[key]), key)
  return { rule, warning: rule.useWebview ? '该规则声明 useWebview；仅静态 XPath/CSS 解析可用，部分剧集可能无法播放。' : undefined }
}

export async function aggregateStreams(items: Array<{ title?: string; nameOrig?: string }>, cfg: PluginConfig): Promise<StreamSource[]> {
  if (!cfg.streamEnabled) return []
  const rules = cfg.streamRules.filter((rule) => rule.enabled)
  if (!rules.length) return []
  const tasks = items.slice(0, 12).flatMap((item) => rules.map((rule) => () => searchRule(item.title || item.nameOrig || '', rule, cfg)))
  const settled = await runWithConcurrency(tasks, STREAM_CONCURRENCY)
  return settled.flatMap((result) => result.status === 'fulfilled' ? result.value : []).slice(0, MAX_SOURCES)
```

</details>

**依据 2 · 源码核查**：[src/streaming.ts:228-243](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/streaming.ts#L228-L243)

跳过 WebView 规则

<details>
<summary>查看原文（16行）</summary>

```text
async function searchRule(title: string, rule: StreamRule, cfg: PluginConfig): Promise<StreamSource[]> {
  if (!title || rule.useWebview) return []
  const searchUrl = absolute(rule.baseURL, rule.searchURL.replace(/\{\{\s*(?:keyword|query)\s*\}\}/gi, encodeURIComponent(title)))
  const $ = cheerio.load(await getHtml(searchUrl, cfg, rule))
  const rows = $(selector(rule.searchList, 'searchList')).toArray().slice(0, 5)
  const result: StreamSource[] = []
  for (const row of rows) {
    const nameNode = $(row).find(selector(rule.searchName, 'searchName')).first()
    const urlNode = $(row).find(selector(rule.searchResult, 'searchResult')).first()
    const name = nameNode.text().trim() || $(row).text().trim()
    const href = urlNode.attr('href') || $(row).attr('href')
    if (!href || !name) continue
    const sourceUrl = absolute(searchUrl, href)
    const episodes = await parseEpisodes(sourceUrl, rule, cfg)
    result.push({
      id: id(rule.id, sourceUrl),
```

</details>

#### 缺口

- 未测真实播放器
  **影响**：无法确认播放与版权条件
  **进一步探讨**：只用授权测试资源验证静态规则

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何控制试用范围？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

先按 README 的包路径在测试 Web profile 验证搜索，不启用额外播放规则。需要 Node 22+ 及 Web 宿主。若包或源站不匹配，禁用并改用原站搜索；安装时间和来源维护开销未知。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:23-44](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/README.md#L23-L44)

安装与构建前提

<details>
<summary>查看原文（22行）</summary>

````text
## 环境要求

- Node.js 22 或更高版本
- DeepSeek Harness Web

## 安装

从 [npm](https://www.npmjs.com/package/@cocofhu/anime-find) 安装：

```sh
dsh plugin --profile web add @cocofhu/anime-find
```

本地开发：

```sh
dsh plugin --profile web add /absolute/path/to/anime-find
```

安装后重启 `dsh web`，并强制刷新浏览器页面。不要用 `github:cocofhu/anime-find`、`git+https://github.com/cocofhu/anime-find.git` 或无前缀的 `anime-find` 安装：`lib/` 不进仓库，git 源会跑 `prepare`，而 pnpm 会拦截该脚本。旧包名已迁到 `@cocofhu/anime-find`。

插件中心可能默认走 GitHub git 源。请改用上面的 npm 命令。安装过程中出现 `missing peer @deepseek-ai/...` 或 `react` 是预期警告（这些包由 Harness 宿主提供），只要命令成功退出即可。
````

</details>

**依据 2 · 源码核查**：[src/streaming.ts:202-208](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/streaming.ts#L202-L208)

关闭流媒体后不派发规则

```text
export async function aggregateStreams(items: Array<{ title?: string; nameOrig?: string }>, cfg: PluginConfig): Promise<StreamSource[]> {
  if (!cfg.streamEnabled) return []
  const rules = cfg.streamRules.filter((rule) => rule.enabled)
  if (!rules.length) return []
  const tasks = items.slice(0, 12).flatMap((item) => rules.map((rule) => () => searchRule(item.title || item.nameOrig || '', rule, cfg)))
  const settled = await runWithConcurrency(tasks, STREAM_CONCURRENCY)
  return settled.flatMap((result) => result.status === 'fulfilled' ? result.value : []).slice(0, MAX_SOURCES)
```

#### 缺口

- 未安装或联网
  **影响**：实际兼容未知
  **进一步探讨**：用授权条目检查检索、退出与回退

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显示结果的来源缺口能减少误判吗？

**研究主题**：新假设与验证

#### 完整回答

在有部分来源报错时，对照仅显示合并结果与提示失败来源。观察读者是否把漏查误认为无资源，以及额外阅读时间。若准确性无变化或遮挡结果则否定。

#### 证据与依据

**依据 1 · 源码核查**：[src/search.ts:42-66](https://github.com/cocofhu/anime-find/blob/71b76efe604c7b3f875ffb97e6be13c707931a20/src/search.ts#L42-L66)

各源失败已收集

<details>
<summary>查看原文（25行）</summary>

```text
  }

  const jobs: Array<Promise<void>> = []
  if (sources.includes('mikan')) {
    jobs.push(
      searchMikan(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'mikan', message: messageOf(err) }) }),
    )
  }
  if (sources.includes('anibt')) {
    jobs.push(
      searchAniBT(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'anibt', message: messageOf(err) }) }),
    )
  }
  if (sources.includes('garden')) {
    jobs.push(
      searchGarden(q, config, signal)
        .then((items) => { lists.push(items) })
        .catch((err) => { errors.push({ source: 'garden', message: messageOf(err) }) }),
    )
  }
  await Promise.all(jobs)
```

</details>

#### 缺口

- 无读者对照
  **影响**：提示收益未知
  **进一步探讨**：模拟两类来源失败

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
