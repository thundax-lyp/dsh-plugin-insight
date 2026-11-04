# dsh-hacker-news

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[682f993](https://github.com/heartleo/hn-cli/tree/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news)

<!-- BEGIN META -->
[![GitHub ★ 51](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=51&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/heartleo/hn-cli) [![npm 30d 707](https://img.shields.io/static/v1?label=npm+30d&message=707&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hacker-news) [![最新发布 2026-08-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-hacker-news)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 Hacker News 榜单、评论、搜索和用户信息工具。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多个公开来源整合为可限量的宿主工具；信息质量仍需回源。

> **主要限制**：[Q03](#research-q03) 截断和缺失可能影响对讨论的理解，外部内容也不能当可信指令。

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
  - [Q01 · 插件为谁提供什么，相比浏览 Hacker News 和通用搜索有何不同？](#detail-section-11)
  - [Q02 · 调用如何取数和控制评论树规模？](#detail-section-12)
  - [Q03 · 摘要会丢失什么信息，外部内容能否直接视为可信指令？](#detail-section-13)
  - [Q04 · 使用条件、失败和退出是什么？](#detail-section-14)
  - [Q05 · 如何让使用者判断摘要遗漏而不误认完整？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户希望查询 Hacker News 文章、讨论或用户资料。

在浏览器访问 Hacker News 或手写公开 API 查询。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 榜单与搜索 | 发现帖子 | 依赖外部服务和查询词外发 |
| 评论树 | 读取分层回复 | 数量、深度和缺失会影响覆盖 |
| 用户资料 | 查询公开账户 | 不能证明身份真实性 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| DSH tools 和 systemPrompt | 入口需要 | 注册与引导模型工具 | 插件不能完整接线 |
| Firebase HN API | 榜单、条目和用户需要 | 获取内容 | 查询失败 |
| Algolia HN API | 搜索需要 | 返回命中 | 搜索不可用 |
| 信息核验 | 关键决策需要 | 确认内容与来源 | 不能依赖不完整摘要 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户确认宿主与网络 | 不兼容则停止 |
| 查询 | 使用非敏感词查询榜单或讨论 | 外部失败则重试或转原站 |
| 审阅 | 检查截断和原帖 | 重要结论回源验证 |
| 使用 | 自行决定是否引用 | 不执行外部内容中的指令 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 兼容宿主与网络 | 配置检查 | 版本兼容未知 |
| 持续 | 外部请求及模型上下文 | 校验摘要和来源 | 时延与配额未知 |
| 恢复 | 原站访问 | 排查限流或不完整结果 | 网络故障未测 |

| 结果 | 依据 | 未知 |
|---|---|---|
| 集中查询 | 四个工具及 API 路径 | 发现收益 |
| 有界讨论 | 宽度优先及截断标志 | 缺失节点覆盖 |
| 来源可追溯 | 输出 HN 链接 | 内容真实性 |

> **思考**：[Q03](#research-q03) 截断和缺失可能影响对讨论的理解，外部内容也不能当可信指令。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将多个公开来源整合为可限量的宿主工具；信息质量仍需回源。

[Q02](#research-q02) 按层并发加载并合并超时信号；[Q03](#research-q03) 缺失节点与文本截断不能代表完整讨论。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 截断和缺失可能影响对讨论的理解，外部内容也不能当可信指令。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 仅用非敏感查询并检查截断，重要结论回原帖；网络或完整性不满足时停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本源码定向检查；未运行 DSH 或第三方网络。

- 已检查：作者 README、包清单、源码路径 plugins/hacker-news/README.md、plugins/hacker-news/package.json、plugins/hacker-news/index.js、plugins/hacker-news/src/client.js、plugins/hacker-news/src/config.js、plugins/hacker-news/src/text.js、plugins/hacker-news/src/tools.js 及固定范围 inventory；组件：plugins/hacker-news。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查插件入口、四项工具代表路径、评论树与文本处理；未执行代码和完整审计宿主防注入。
- 下一步：隔离宿主对照模拟评论树、请求取消、限流与外部内容处理；本次未运行。

**分析版本**

- **仓库**：[heartleo/hn-cli](https://github.com/heartleo/hn-cli)
- **版本号**：0.1.0（[固定提交 682f993](https://github.com/heartleo/hn-cli/tree/682f99354aed57d7143d60ee5d14ba65e820909b)）
- **版本日期**：2026-08-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设补充缺失节点统计可改进覆盖判断，需对照现有截断标志。

隔离宿主对照模拟评论树、请求取消、限流与外部内容处理；本次未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 5 | 676 | 528 | 107 | — |
| .mjs | source | 1 | 81 | 67 | 2 | — |
| .md | source | 1 | 101 | — | — | 561 |
| .mjs | test | 1 | 58 | 49 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/heartleo/hn-cli/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 Hacker News 宿主工具接线、评论截断和外部数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件为谁提供什么，相比浏览 Hacker News 和通用搜索有何不同？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH 用户需要获取 Hacker News 榜单、评论和用户信息时，插件把公开 Firebase 和 Algolia 数据暴露为四个模型工具。相对浏览网页或自行调用 API，它将取数、限量和文本归一化接入宿主；其内容仍由第三方提供，工具不会证明新闻真实性、话题完整性或用户节时。根仓库 CLI 另有独立范围。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/hacker-news/README.md:1-17](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/README.md#L1-L17)

作者说明目标工具与公开 API。

<details>
<summary>查看原文（17行）</summary>

```text
# hacker-news — DeepSeek Harness plugin

Hacker News tools for [DeepSeek Harness](https://deepseek-harness.github.io/deepseek-harness/): browse the ranked feeds, read a thread with its reply tree, search the Algolia index, and look up a user.

The plugin is published as [`dsh-hacker-news`](https://www.npmjs.com/package/dsh-hacker-news) and listed in the [awesome-dsh-plugin community registry](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin).

Plain ESM JavaScript, no build step and no runtime dependency on the `hn` binary — it talks to the public HN APIs directly (`https://hacker-news.firebaseio.com/v0` and `https://hn.algolia.com/api/v1`).

## Tools

| Tool | Arguments | Returns |
|------|-----------|---------|
| `hn_stories` | `feed` (`top`/`new`/`best`/`ask`/`show`/`job`), `limit`, `offset` | Ranked stories with id, score, comment count, URLs |
| `hn_item` | `id` (required), `comment_limit`, `max_depth` | The item plus its reply tree in reading order, with `depth` and `truncated` |
| `hn_search` | `query` (required), `sort` (`relevance`/`date`), `tags`, `limit` | Algolia hits normalised to the story shape |
| `hn_user` | `id` (required) | `found`, karma, account age, bio, submission count |

```

</details>

**依据 2 · 源码核查**：[plugins/hacker-news/index.js:17-27](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/index.js#L17-L27)

系统提示与工具注册入口。

<details>
<summary>查看原文（11行）</summary>

```text
export function apply(ctx, config) {
  ctx.systemPrompt.section({
    name: 'tool:hacker-news',
    order: 112,
    text: [
      'Use Hacker News tools for requests about Hacker News instead of general web search.',
      'Use hn_stories for ranked feeds, hn_item for a story or comment thread,',
      'hn_search for full-text search, and hn_user for user profiles.',
    ].join(' '),
  })
  registerTools(ctx, new HnClient(config), config)
```

</details>

**依据 3 · 源码核查**：[plugins/hacker-news/src/tools.js:96-109](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/tools.js#L96-L109)

榜单调用及结果。

<details>
<summary>查看原文（14行）</summary>

```text
    async execute(args, exec) {
      const feed = args.feed ?? 'top'
      const limit = boundedCount(args.limit, config.defaultStoryLimit, config.maxStoryLimit)
      const offset = args.offset === undefined ? 0 : args.offset
      if (!Number.isInteger(offset) || offset < 0) {
        throw new Error(`offset must be a non-negative integer, received ${JSON.stringify(args.offset)}.`)
      }
      const ids = await client.feedIds(feed, exec.signal)
      const items = await client.items(ids.slice(offset, offset + limit), exec.signal)
      return {
        feed,
        offset,
        total: ids.length,
        stories: items.map((item) => toStory(item, config.maxTextLength)),
```

</details>

#### 缺口

- 没有用户任务与浏览器搜索对照
  **影响**：无法量化节时和信息覆盖
  **进一步探讨**：固定几个新闻任务，对比来源命中、耗时及遗漏。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调用如何取数和控制评论树规模？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 依赖 tools 和 systemPrompt，注册客户端与模型工具；榜单先读取 ID，再在并发上限内取所选区间，搜索发送 query、tags、排序与数量到 Algolia。评论树按层加载且每层按剩余额度截断，再按树顺序输出；删除或 dead 父节点的存活后代提升至最近存活祖先。深度/数量导致截断时设置 truncated；缺失 item 会跳过，不能将 truncated=false 解释为外部源完整。每个请求合并宿主 signal 和超时，非成功 HTTP 抛错。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/hacker-news/index.js:7-27](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/index.js#L7-L27)

宿主依赖及注册。

<details>
<summary>查看原文（21行）</summary>

```text
export const name = 'hacker-news'

export const inject = ['tools', 'systemPrompt']

export { Config }

/**
 * @param {import('@deepseek-ai/cordis').Context} ctx
 * @param {import('./src/config.js').HackerNewsConfig} config
 */
export function apply(ctx, config) {
  ctx.systemPrompt.section({
    name: 'tool:hacker-news',
    order: 112,
    text: [
      'Use Hacker News tools for requests about Hacker News instead of general web search.',
      'Use hn_stories for ranked feeds, hn_item for a story or comment thread,',
      'hn_search for full-text search, and hn_user for user profiles.',
    ].join(' '),
  })
  registerTools(ctx, new HnClient(config), config)
```

</details>

**依据 2 · 源码核查**：[plugins/hacker-news/src/client.js:45-66](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L45-L66)

请求取消与并发执行器。

<details>
<summary>查看原文（22行）</summary>

```text
/**
 * Combine a caller signal with the configured per-request timeout. The caller
 * signal stays authoritative: aborting it aborts the request either way.
 */
function requestSignal(signal, timeoutMs) {
  const timeout = AbortSignal.timeout(timeoutMs)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

/** Run `task` over `inputs` with at most `limit` in flight, preserving order. */
export async function mapConcurrent(inputs, limit, task) {
  const results = new Array(inputs.length)
  let next = 0
  const workers = new Array(Math.max(1, Math.min(limit, inputs.length))).fill(null).map(async () => {
    for (;;) {
      const index = next++
      if (index >= inputs.length) return
      results[index] = await task(inputs[index], index)
    }
  })
  await Promise.all(workers)
  return results
```

</details>

**依据 3 · 源码核查**：[plugins/hacker-news/src/client.js:76-88](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L76-L88)

HTTP 及错误处理。

<details>
<summary>查看原文（13行）</summary>

```text
  /**
   * Fetch one JSON document. Network, HTTP-status, and parse failures throw,
   * because they are infrastructure failures rather than domain outcomes.
   */
  async fetchJson(url, signal) {
    const response = await fetch(url, {
      signal: requestSignal(signal, this.config.requestTimeoutMs),
      headers: { accept: 'application/json', 'user-agent': this.config.userAgent },
    })
    if (!response.ok) {
      throw new Error(`Hacker News request failed: ${response.status} ${response.statusText} (${url})`)
    }
    return response.json()
```

</details>

**依据 4 · 源码核查**：[plugins/hacker-news/src/client.js:110-127](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L110-L127)

批量及搜索请求。

<details>
<summary>查看原文（18行）</summary>

```text
  /** Fetch many items concurrently, dropping ids the API no longer serves. */
  async items(ids, signal) {
    const fetched = await mapConcurrent(ids, this.config.concurrency, (id) => this.item(id, signal))
    return /** @type {HnItem[]} */ (fetched.filter((item) => item !== null && item !== undefined))
  }

  /**
   * Search through Algolia. `sort: 'date'` uses the chronological endpoint;
   * `tags` is passed through verbatim (`story`, `comment`, `author_pg`, ...).
   */
  async search({ query, tags, sort, limit }, signal) {
    const endpoint = sort === 'date' ? 'search_by_date' : 'search'
    const url = new URL(`${this.config.algoliaBaseUrl}/${endpoint}`)
    url.searchParams.set('query', query)
    url.searchParams.set('hitsPerPage', String(limit))
    if (tags) url.searchParams.set('tags', tags)
    const payload = await this.fetchJson(url.toString(), signal)
    return Array.isArray(payload?.hits) ? payload.hits : []
```

</details>

**依据 5 · 源码核查**：[plugins/hacker-news/src/client.js:139-189](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L139-L189)

宽度优先及裁剪、缺失节点。

<details>
<summary>查看原文（51行）</summary>

```text
  async commentTree(root, { maxComments, maxDepth }, signal) {
    /** @type {Map<number, Array<HnItem & { depth: number }>>} */
    const childrenOf = new Map()
    // Replies of a skipped node attach to its nearest surviving ancestor.
    /** @type {Map<number, number>} */
    const liftedTo = new Map()
    const anchorFor = (id) => {
      let anchor = id
      while (liftedTo.has(anchor)) anchor = liftedTo.get(anchor)
      return anchor
    }
    let frontier = (root?.kids ?? []).map((id) => ({ id, depth: 0 }))
    let collected = 0
    let truncated = false

    while (frontier.length > 0 && collected < maxComments) {
      const room = maxComments - collected
      const batch = frontier.slice(0, room)
      if (batch.length < frontier.length) truncated = true

      const fetched = await mapConcurrent(batch, this.config.concurrency, (entry) => this.item(entry.id, signal))
      /** @type {Array<{ id: number, depth: number }>} */
      const nextFrontier = []

      for (const [index, item] of fetched.entries()) {
        if (!item) continue
        const depth = batch[index].depth
        const parent = anchorFor(item.parent ?? root.id)
        // Dead and deleted nodes stay out of the result but keep their subtree
        // reachable: HN keeps live replies under removed parents.
        if (item.deleted || item.dead) {
          liftedTo.set(item.id, parent)
        } else {
          const siblings = childrenOf.get(parent) ?? []
          siblings.push({ ...item, depth })
          childrenOf.set(parent, siblings)
          collected++
        }
        const kids = item.kids ?? []
        if (kids.length === 0) continue
        if (depth + 1 > maxDepth) {
          truncated = true
          continue
        }
        for (const kid of kids) nextFrontier.push({ id: kid, depth: depth + 1 })
      }

      frontier = nextFrontier
    }

    if (frontier.length > 0) truncated = true
```

</details>

**依据 6 · 源码核查**：[plugins/hacker-news/src/tools.js:164-184](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/tools.js#L164-L184)

item 调用与截断输出。

<details>
<summary>查看原文（21行）</summary>

```text
    async execute(args, exec) {
      const commentLimit = boundedCount(args.comment_limit, config.defaultCommentLimit, config.maxCommentLimit)
      const maxDepth = boundedCount(args.max_depth, config.defaultCommentDepth, config.maxCommentDepth)
      const item = await client.item(args.id, exec.signal)
      if (!item) throw new Error(`Hacker News item ${args.id} does not exist.`)
      const { comments, truncated } = await client.commentTree(
        item,
        { maxComments: commentLimit, maxDepth },
        exec.signal,
      )
      return {
        item: toStory(item, config.maxTextLength),
        truncated,
        comments: comments.map((comment) => ({
          id: comment.id,
          by: comment.by ?? 'unknown',
          time: comment.time ?? 0,
          depth: comment.depth,
          parent: comment.parent ?? item.id,
          hnUrl: itemUrl(comment.id),
          text: clip(htmlToText(comment.text ?? ''), config.maxTextLength),
```

</details>

#### 缺口

- 未运行网络、宿主与多层删除评论
  **影响**：不能确认真实取消、API 兼容及极端树结构
  **进一步探讨**：使用固定 mock 树和宿主网络模拟超时、缺失及不同层数。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 摘要会丢失什么信息，外部内容能否直接视为可信指令？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

返回文本将 HTML 转为纯文本并按长度截断；评论树按数量/深度限制，缺失节点直接跳过，结果不一定是完整讨论。外部作者文字及链接经网络进入模型上下文，其内容是待审阅的数据，不证明作者或站点指令可信；源码未展示完整提示注入防护，也未证明发生攻击。未授权时不将帖子或链接中的指令当成用户要求执行。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/hacker-news/src/text.js:31-56](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/text.js#L31-L56)

HTML 转换和文本截断。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Convert an HN HTML fragment to plain text: paragraphs become blank lines,
 * links keep their label followed by the target, remaining tags are dropped.
 */
export function htmlToText(html) {
  if (!html) return ''
  const withBreaks = html
    .replace(/<\s*br\s*\/?\s*>/gi, '\n')
    .replace(/<\s*\/?\s*p\s*>/gi, '\n\n')
    .replace(/<\s*a\b[^>]*href="([^"]*)"[^>]*>(.*?)<\s*\/\s*a\s*>/gis, (_match, href, label) => {
      const text = label.replace(/<[^>]+>/g, '').trim()
      const target = decodeEntities(href)
      return text === '' || text === target ? target : `${text} (${target})`
    })
  return decodeEntities(withBreaks.replace(/<[^>]+>/g, ''))
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

/** Clip long text on a whitespace boundary and mark the cut. */
export function clip(text, maxLength) {
  if (text.length <= maxLength) return text
  const head = text.slice(0, maxLength)
  const boundary = head.lastIndexOf(' ')
  return `${(boundary > maxLength * 0.6 ? head.slice(0, boundary) : head).trimEnd()}… [truncated]`
```

</details>

**依据 2 · 源码核查**：[plugins/hacker-news/src/client.js:159-180](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L159-L180)

缺失、删除和深度截断。

<details>
<summary>查看原文（22行）</summary>

```text
      const fetched = await mapConcurrent(batch, this.config.concurrency, (entry) => this.item(entry.id, signal))
      /** @type {Array<{ id: number, depth: number }>} */
      const nextFrontier = []

      for (const [index, item] of fetched.entries()) {
        if (!item) continue
        const depth = batch[index].depth
        const parent = anchorFor(item.parent ?? root.id)
        // Dead and deleted nodes stay out of the result but keep their subtree
        // reachable: HN keeps live replies under removed parents.
        if (item.deleted || item.dead) {
          liftedTo.set(item.id, parent)
        } else {
          const siblings = childrenOf.get(parent) ?? []
          siblings.push({ ...item, depth })
          childrenOf.set(parent, siblings)
          collected++
        }
        const kids = item.kids ?? []
        if (kids.length === 0) continue
        if (depth + 1 > maxDepth) {
          truncated = true
```

</details>

**依据 3 · 源码核查**：[plugins/hacker-news/src/tools.js:174-184](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/tools.js#L174-L184)

评论文本进入返回结果。

<details>
<summary>查看原文（11行）</summary>

```text
      return {
        item: toStory(item, config.maxTextLength),
        truncated,
        comments: comments.map((comment) => ({
          id: comment.id,
          by: comment.by ?? 'unknown',
          time: comment.time ?? 0,
          depth: comment.depth,
          parent: comment.parent ?? item.id,
          hnUrl: itemUrl(comment.id),
          text: clip(htmlToText(comment.text ?? ''), config.maxTextLength),
```

</details>

**依据 4 · 源码核查**：[plugins/hacker-news/src/tools.js:240-257](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/tools.js#L240-L257)

搜索 query 与外部命中。

<details>
<summary>查看原文（18行）</summary>

```text
    presentCall: (args) => ({ card: 'generic', title: `Hacker News · Search: ${args.query}`, kind: 'search', rawInput: args }),
    async execute(args, exec) {
      const query = args.query.trim()
      if (query === '') throw new Error('query must not be empty.')
      const sort = args.sort ?? 'relevance'
      const limit = boundedCount(args.limit, config.defaultStoryLimit, config.maxStoryLimit)
      const hits = await client.search({ query, sort, tags: args.tags, limit }, exec.signal)
      return {
        query,
        sort,
        tags: args.tags ?? null,
        hits: hits.map((hit) => {
          const id = Number(hit.objectID)
          return {
            id,
            title: hit.title ?? hit.story_title ?? '(comment)',
            url: hit.url ?? hit.story_url ?? null,
            hnUrl: itemUrl(id),
```

</details>

#### 缺口

- 没有全链提示注入评估或原文重建
  **影响**：无法保证模型解释完整和安全
  **进一步探讨**：隔离宿主测试截断标记、外部指令识别与原帖对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 使用条件、失败和退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 的 tools/systemPrompt、Node 和 Firebase/Algolia 网络；搜索词通过查询参数发送搜索服务，帖子及评论请求发送到 Firebase。并发与请求超时可调，但一个 batch 的请求失败会通过 Promise.all 拒绝整个批次；无缓存或离线保证不能从源码片段推导。读者应避免在搜索词中放敏感信息、对关键结果回原帖核对；网络不可达或需要完整证据时停止工具并改用可信来源。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/hacker-news/package.json:23-24](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/package.json#L23-L24)

Node 版本声明。

```text
  "engines": {
    "node": ">=20.3"
```

**依据 2 · 源码核查**：[plugins/hacker-news/package.json:37-41](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/package.json#L37-L41)

宿主 peer 版本。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1 <5.0.0",
    "@deepseek-ai/schemastery": ">=3.18.1 <4.0.0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.0-rc.1 <0.2.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.0-rc.1 <0.2.0-0"
```

**依据 3 · 源码核查**：[plugins/hacker-news/src/config.js:22-35](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/config.js#L22-L35)

默认地址、并发、超时和长度。

<details>
<summary>查看原文（14行）</summary>

```text
export const Config = Schema.object({
  firebaseBaseUrl: Schema.string().default('https://hacker-news.firebaseio.com/v0'),
  algoliaBaseUrl: Schema.string().default('https://hn.algolia.com/api/v1'),
  requestTimeoutMs: Schema.number().default(15000),
  concurrency: Schema.number().default(20),
  defaultStoryLimit: Schema.number().default(20),
  maxStoryLimit: Schema.number().default(100),
  defaultCommentLimit: Schema.number().default(50),
  maxCommentLimit: Schema.number().default(400),
  defaultCommentDepth: Schema.number().default(5),
  maxCommentDepth: Schema.number().default(10),
  maxTextLength: Schema.number().default(2000),
  userAgent: Schema.string().default('dsh-hacker-news/0.1.0 (+https://github.com/heartleo/hn-cli)'),
})
```

</details>

**依据 4 · 源码核查**：[plugins/hacker-news/src/client.js:49-66](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L49-L66)

超时与 Promise.all。

<details>
<summary>查看原文（18行）</summary>

```text
function requestSignal(signal, timeoutMs) {
  const timeout = AbortSignal.timeout(timeoutMs)
  return signal ? AbortSignal.any([signal, timeout]) : timeout
}

/** Run `task` over `inputs` with at most `limit` in flight, preserving order. */
export async function mapConcurrent(inputs, limit, task) {
  const results = new Array(inputs.length)
  let next = 0
  const workers = new Array(Math.max(1, Math.min(limit, inputs.length))).fill(null).map(async () => {
    for (;;) {
      const index = next++
      if (index >= inputs.length) return
      results[index] = await task(inputs[index], index)
    }
  })
  await Promise.all(workers)
  return results
```

</details>

**依据 5 · 源码核查**：[plugins/hacker-news/src/client.js:120-127](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L120-L127)

查询参数发送到搜索端点。

```text
  async search({ query, tags, sort, limit }, signal) {
    const endpoint = sort === 'date' ? 'search_by_date' : 'search'
    const url = new URL(`${this.config.algoliaBaseUrl}/${endpoint}`)
    url.searchParams.set('query', query)
    url.searchParams.set('hitsPerPage', String(limit))
    if (tags) url.searchParams.set('tags', tags)
    const payload = await this.fetchJson(url.toString(), signal)
    return Array.isArray(payload?.hits) ? payload.hits : []
```

#### 缺口

- 未实测外部服务、限流与宿主加载
  **影响**：无法保证延迟、配额或退出后状态
  **进一步探讨**：在隔离环境测试网络失败与请求内容。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何让使用者判断摘要遗漏而不误认完整？

**研究主题**：新假设与验证

#### 完整回答

Q02 已有数量或深度导致的 truncated 标志，不能声称完全没有截断提示；对于 API 返回 null 的缺失节点，假设增加 skipped IDs/count 和原因区分，能让读者更准确判断覆盖。需对照现有 truncated，在缺失、删除、深度限制和超时混合的固定树中测试遗漏识别、响应体积与可解释性；如果用户并不受益或 API 不足以区分原因，则否定。该方案未实现。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/hacker-news/src/client.js:154-180](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L154-L180)

裁剪标志、空节点和删除节点处理。

<details>
<summary>查看原文（27行）</summary>

```text
    while (frontier.length > 0 && collected < maxComments) {
      const room = maxComments - collected
      const batch = frontier.slice(0, room)
      if (batch.length < frontier.length) truncated = true

      const fetched = await mapConcurrent(batch, this.config.concurrency, (entry) => this.item(entry.id, signal))
      /** @type {Array<{ id: number, depth: number }>} */
      const nextFrontier = []

      for (const [index, item] of fetched.entries()) {
        if (!item) continue
        const depth = batch[index].depth
        const parent = anchorFor(item.parent ?? root.id)
        // Dead and deleted nodes stay out of the result but keep their subtree
        // reachable: HN keeps live replies under removed parents.
        if (item.deleted || item.dead) {
          liftedTo.set(item.id, parent)
        } else {
          const siblings = childrenOf.get(parent) ?? []
          siblings.push({ ...item, depth })
          childrenOf.set(parent, siblings)
          collected++
        }
        const kids = item.kids ?? []
        if (kids.length === 0) continue
        if (depth + 1 > maxDepth) {
          truncated = true
```

</details>

**依据 2 · 源码核查**：[plugins/hacker-news/src/client.js:186-201](https://github.com/heartleo/hn-cli/blob/682f99354aed57d7143d60ee5d14ba65e820909b/plugins/hacker-news/src/client.js#L186-L201)

返回评论和截断状态。

<details>
<summary>查看原文（16行）</summary>

```text
      frontier = nextFrontier
    }

    if (frontier.length > 0) truncated = true

    /** @type {Array<HnItem & { depth: number }>} */
    const ordered = []
    const visit = (parentId) => {
      for (const child of childrenOf.get(parentId) ?? []) {
        ordered.push(child)
        visit(child.id)
      }
    }
    visit(root.id)

    return { comments: ordered, truncated }
```

</details>

#### 缺口

- 未实现并测试缺失统计
  **影响**：不能宣称覆盖判断已改善
  **进一步探讨**：比较标志与计数在模拟缺失树上的理解准确率和成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
