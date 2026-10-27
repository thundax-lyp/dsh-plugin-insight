# AnySearch for DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[d20ab97](https://github.com/anysearch-team/anysearch-dsh/tree/d20ab97727b36b4341977e53d7c9b7d2e93d3d03)

<!-- BEGIN META -->
[![GitHub ★ 663](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=663&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/anysearch-team/anysearch-dsh) [![npm 30d 10,592](https://img.shields.io/static/v1?label=npm+30d&message=10%2C592&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh) [![最新发布 2026-10-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@anysearch/anysearch-dsh)
<!-- END META -->

> **功能**：在 DSH 原生网页搜索与抓取接口接入 AnySearch，并提供垂直检索和有限并发批量搜索。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持保留宿主原生入口同时新增可发现垂直参数及有界并发，减少手工安排多次查询；实际检索效果未测。

> **主要限制**：[Q03](#research-q03) 远端额度和索引质量决定最终效果，五项并发仍是五次请求；无URL结构数据不能被当作可引用网页证据。

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
  - [Q01 · 相对原生搜索或直接HTTP新增什么？](#detail-section-11)
  - [Q02 · 检索与批量失败怎样交付给模型？](#detail-section-12)
  - [Q03 · 匿名额度、外部服务和引用有什么边界？](#detail-section-13)
  - [Q04 · 谁值得试用，如何验证覆盖改善？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH研究用户需要并行获取多个角度的公开网页与垂直领域材料，最终事实仍需来源核对。

原生现有搜索provider和直接HTTP脚本；远端索引及清洗质量不算插件原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 原生搜索与抓取 | 查网页及清洗URL | 依赖AnySearch服务 |
| 能力发现与垂直搜索 | 确认tag与参数再查询 | 服务响应不等于事实正确 |
| 有限批量搜索 | 并发一至五项 | 单项失败保留，主动取消可中断整体 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH、Node22.19或24+与pnpm | 必需 | 原生provider和工具安装 | 无法加载 |
| AnySearch服务 | 查询必需 | 索引和清洗 | 限流或请求失败 |
| API key | 可选 | 账号额度 | 使用匿名额度，非无限保证 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 接入 | 用户安装并核provider | web_search和web_fetch可用 |
| 发现 | Agent查垂直域能力 | tag和参数来自实际服务 |
| 查询 | Agent发最多五项 | 核独立结果、失败和截断 |
| 验收 | 用户核来源与费用 | 缺证回原搜索 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主与插件资源 | 安装及可选凭据 | 用时未知 |
| 持续使用 | 每项搜索请求与结果token | 来源与日期核查 | 当期价格和费用未知 |
| 失败恢复 | 必要项重试 | 按requestId核错和降级 | 不重复整批成功项 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 接口整合 | 原生搜索抓取加高级工具 | 相对现有provider质量 |
| 批量检索 | 有限并发及逐项错误 | 有效来源覆盖和总成本 |

> **思考**：[Q03](#research-q03) 远端额度和索引质量决定最终效果，五项并发仍是五次请求；无URL结构数据不能被当作可引用网页证据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 支持保留宿主原生入口同时新增可发现垂直参数及有界并发，减少手工安排多次查询；实际检索效果未测。

[Q02](#research-q02) 凭据按请求解析、原生入口复用及取消区别于部分失败值得借鉴；需要维护远端响应契约。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 远端额度和索引质量决定最终效果，五项并发仍是五次请求；无URL结构数据不能被当作可引用网页证据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 非敏感问题先比原provider与批量结果，以有效引用而非命中数决定继续；限流或缺证回人工。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

provider、HTTP、超时和部分失败结构有源码支持；服务质量、当期额度与任务收益未知。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client.ts、src/tools/batch.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本注册、HTTP与批量错误，未实际访问搜索服务或验证领域内容。
- 下一步：用固定事实题核出处、日期、失败与总请求，比较原provider和手工HTTP；未执行。

**分析版本**

- **仓库**：[anysearch-team/anysearch-dsh](https://github.com/anysearch-team/anysearch-dsh)
- **版本号**：0.1.8（[固定提交 d20ab97](https://github.com/anysearch-team/anysearch-dsh/tree/d20ab97727b36b4341977e53d7c9b7d2e93d3d03)）
- **版本日期**：2026-10-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出按来源独立性和可引用性汇合批结果并呈现缺证，尚未验证；若只增加重复结果或人工核对则否定。

用固定事实题核出处、日期、失败与总请求，比较原provider和手工HTTP；未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 1133 | — | — | 9955 |
| .js | source | 10 | 1329 | 1267 | 63 | — |
| .mjs | source | 6 | 624 | 570 | 29 | — |
| .ts | source | 10 | 1819 | 1569 | 99 | — |
| .ts | test | 5 | 1735 | 1546 | 62 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/anysearch-team/anysearch-dsh/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=13&color=737b86&logo=github)](https://github.com/anysearch-team/anysearch-dsh/issues?q=is%3Aissue+created%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z) [![近30天关闭 15](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=15&color=737b86&logo=github)](https://github.com/anysearch-team/anysearch-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T08%3A34%3A14.025Z..2026-10-27T08%3A34%3A14.025Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：原生搜索与有限批量检索能否形成可核查的研究来源？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对原生搜索或直接HTTP新增什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要多角度网页与垂直领域检索的DSH用户，可保留web_search/web_fetch原生名称，另用能力发现、结构参数搜索和最多五项批量搜索。原生搜索已解决普通网页查找，本组件的独立增量是接上AnySearch来源并提供可发现垂直参数与有限并发；搜索索引、网页清洗质量来自远端服务，不能归插件原创。只做单个普通搜索的人未必需要替换原服务，直接HTTP脚本也可完成同类请求。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-11](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L9-L11)

作者描述任务与服务归属。

```text
`@anysearch/anysearch-dsh` connects [AnySearch](https://anysearch.com) to [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) as a plugin. Keep using Harness's native `web_search` and `web_fetch` while gaining real-time web search, cleaned URL content, vertical search, and concurrent batch search.

AnySearch is search infrastructure for AI agents, covering the public web and specialized data sources across code, finance, academia, law, security, and more.
```

**依据 2 · 作者声明**：[README.md:38-44](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L38-L44)

原生接口与高级搜索增量。

```text
## What you get

- Through Harness's built-in `web_search`, AnySearch returns results with titles, snippets, and URLs for easy citation.
- Through Harness's built-in `web_fetch`, AnySearch Extract retrieves and cleans the content of a specific public HTTP(S) URL.
- Discover searchable domains, vertical categories, and supported parameters in real time, then run advanced searches using tags, regions, languages, and structured parameters.
- Run one to five searches concurrently; an individual failure does not affect the other results.
- Advanced search preserves useful structured results without source URLs, while page-backed results can return cleaned content on demand.
```

**依据 3 · 源码核查**：[src/index.ts:160-176](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/index.ts#L160-L176)

搜索、抓取provider和高级工具注册。

<details>
<summary>查看原文（17行）</summary>

```text
  const client = new AnySearchClient({
    resolveApiKey: async () => (await ctx.credentials.resolve(apiKeyEnv))?.value,
    apiKeyReference: resolved.apiKeyEnv,
    baseURL: resolved.baseURL,
  })
  ctx.web.registerSearchProvider(new AnySearchProvider(client))
  ctx.web.registerFetchProvider(new AnySearchFetchProvider(client))
  if (ctx.tools.get('web_fetch') === undefined) {
    applyWebFetchTool(ctx, DEFAULT_WEB_TOOL_TIMEOUT_MS, DEFAULT_FETCH_MAX_OUTPUT_CHARS)
  }
  registerCapabilitiesTool(ctx, client)
  registerBatchSearchTool(ctx, client, resolved.maxRenderedContentChars)
  registerAdvancedSearchTool(
    ctx,
    client,
    resolved.maxRenderedContentChars,
  )
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索与批量失败怎样交付给模型？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply 将受管凭据的解析函数传入client，再注册搜索与抓取provider，只有web_fetch缺失时才补挂原生工具，避免重复定义。client.search把query/tag/params等映射到/v1/search，extract到/v1/extract；HTTP请求有超时和取消组合。batch对已校验的一到五项并发执行，逐项保留输入index和requestId，非取消异常变失败行，成功不被丢弃；用户主动取消则抛出，并不承诺返回部分批结果。渲染正文总字符有预算，但结构化结果与引用质量仍需调用者核查。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:160-176](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/index.ts#L160-L176)

provider和工具真实接线。

<details>
<summary>查看原文（17行）</summary>

```text
  const client = new AnySearchClient({
    resolveApiKey: async () => (await ctx.credentials.resolve(apiKeyEnv))?.value,
    apiKeyReference: resolved.apiKeyEnv,
    baseURL: resolved.baseURL,
  })
  ctx.web.registerSearchProvider(new AnySearchProvider(client))
  ctx.web.registerFetchProvider(new AnySearchFetchProvider(client))
  if (ctx.tools.get('web_fetch') === undefined) {
    applyWebFetchTool(ctx, DEFAULT_WEB_TOOL_TIMEOUT_MS, DEFAULT_FETCH_MAX_OUTPUT_CHARS)
  }
  registerCapabilitiesTool(ctx, client)
  registerBatchSearchTool(ctx, client, resolved.maxRenderedContentChars)
  registerAdvancedSearchTool(
    ctx,
    client,
    resolved.maxRenderedContentChars,
  )
```

</details>

**依据 2 · 源码核查**：[src/client.ts:102-124](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/client.ts#L102-L124)

实际服务路径与参数。

<details>
<summary>查看原文（23行）</summary>

```text
  /** Execute one search and validate its complete response. */
  async search(request: AnySearchSearchRequest, signal?: AbortSignal): Promise<AnySearchSearchResponse> {
    const envelope = await this.request('/v1/search', 'search', {
      method: 'POST',
      body: JSON.stringify({
        query: request.query,
        ...request.maxResults !== undefined ? { max_results: request.maxResults } : {},
        ...request.tag !== undefined ? { tag: request.tag } : {},
        ...request.params !== undefined ? { params: request.params } : {},
        ...request.zone !== undefined ? { zone: request.zone } : {},
        ...request.language !== undefined ? { language: request.language } : {},
      }),
    }, signal)
    return parseOperationData('search', envelope, parseSearchData)
  }

  /** Extract and validate the cleaned content of one public HTTP(S) URL. */
  async extract(request: AnySearchExtractRequest, signal?: AbortSignal): Promise<AnySearchExtractResponse> {
    const envelope = await this.request('/v1/extract', 'extract', {
      method: 'POST',
      body: JSON.stringify({ url: request.url }),
    }, signal)
    return parseOperationData('extract', envelope, parseExtractData)
```

</details>

**依据 3 · 源码核查**：[src/client.ts:163-186](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/client.ts#L163-L186)

凭据头、超时与取消。

<details>
<summary>查看原文（24行）</summary>

```text
      'x-anysearch-client': ANYSEARCH_DSH_CLIENT_ID,
    }
    if (init.body !== undefined) headers['content-type'] = 'application/json'
    if (apiKey !== undefined) headers.authorization = `Bearer ${apiKey}`

    const timeoutController = new AbortController()
    const timeout = setTimeout(() => {
      timeoutController.abort(new DOMException('AnySearch HTTP request timed out', 'TimeoutError'))
    }, ANYSEARCH_HTTP_TIMEOUT_MS)
    const requestSignal = signal === undefined
      ? timeoutController.signal
      : AbortSignal.any([signal, timeoutController.signal])

    let response: Response
    try {
      response = await fetch(url, {
        method: init.method,
        redirect: 'error',
        headers,
        ...init.body === undefined ? {} : { body: init.body },
        signal: requestSignal,
      })
    } catch (error: unknown) {
      clearTimeout(timeout)
```

</details>

**依据 4 · 源码核查**：[src/tools/batch.ts:233-264](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/tools/batch.ts#L233-L264)

并发、逐项错误及取消特殊处理。

<details>
<summary>查看原文（32行）</summary>

```text
export async function executeBatchSearch(
  client: AnySearchClient,
  parsed: AnySearchBatchItem[],
  signal: AbortSignal,
  maxRenderedContentChars: number,
): Promise<AnySearchBatchOutput> {
  const items = await Promise.all(parsed.map(async (item, index): Promise<AnySearchBatchSuccess | AnySearchBatchFailure> => {
    try {
      const response = await client.search(item.request, signal)
      return {
        index,
        query: item.request.query,
        ok: true,
        ...response.requestId === undefined ? {} : { requestId: response.requestId },
        results: canonicalSearchResults(response.results, item.includeContent),
        metadata: response.metadata,
      }
    } catch (error: unknown) {
      if (error instanceof AnySearchClientError && error.kind === 'aborted') throw error
      return batchFailure(index, item.request.query, error)
    }
  }))
  const failed = items.filter(item => !item.ok).length
  return {
    items,
    summary: { total: items.length, succeeded: items.length - failed, failed },
    renderedContentTruncated: parsed.reduce((total, item, index) => {
      const result = items[index]
      if (result === undefined || !result.ok) return total
      return total + renderableContentCharacters(result.results, item.includeContent)
    }, 0) > maxRenderedContentChars,
  }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 匿名额度、外部服务和引用有什么边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

启动依赖DSH、Node及pnpm，查询需要AnySearch网络服务，API key可选但匿名额度并非无限或长期保证。README中的每日免费额度是固定作者说明，本轮没有当前计费查询，不作为费用承诺。普通搜索有标题URL便于追溯，高级结果允许无URL结构数据，不能对这类结果虚构出处；网页摘录也不保证事实准确、日期有效。并行五项是五个服务请求，可能减少等待但不自动省调用费或模型token。失败按requestId核对并只重试必要项，若服务限流应降为单项或回原provider。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:36-58](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L36-L58)

匿名与凭据条件，额度为作者声明。

<details>
<summary>查看原文（23行）</summary>

````text
No API key is required for a quick start. Requests use AnySearch's anonymous quota until you configure one.

## What you get

- Through Harness's built-in `web_search`, AnySearch returns results with titles, snippets, and URLs for easy citation.
- Through Harness's built-in `web_fetch`, AnySearch Extract retrieves and cleans the content of a specific public HTTP(S) URL.
- Discover searchable domains, vertical categories, and supported parameters in real time, then run advanced searches using tags, regions, languages, and structured parameters.
- Run one to five searches concurrently; an individual failure does not affect the other results.
- Advanced search preserves useful structured results without source URLs, while page-backed results can return cleaned content on demand.

## Optional API key

Try it without an API key.

Sign up for an AnySearch account and configure an API key to get 1,000 free search calls per day.

Sign up or sign in at [anysearch.com](https://anysearch.com), then visit [API Keys](https://www.anysearch.com/console/api-keys) to get one. Store the key in `$DSH_HOME/.credentials.yaml` (`~/.dsh/.credentials.yaml` by default):

```yaml
ANYSEARCH_API_KEY: "as_sk_your_key"
```

The plugin resolves the managed credential for every operation, so credential rotation reaches the next request without restarting DSH. A launching `ANYSEARCH_API_KEY` environment variable has higher priority.
````

</details>

**依据 2 · 作者声明**：[README.md:78-86](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L78-L86)

安装依赖与默认provider选择。

```text
## Environment requirements

Requires Node.js 22.19 or Node.js 24+, pnpm 11.7, and DeepSeek Harness. The DSH plugin command uses pnpm to manage profile dependencies, so `pnpm` must be available on `PATH`.

Windows, Linux, and macOS use the same installation command. Before installing, ensure that Node.js, `npx`, and `pnpm` can all be run directly from `PATH`.

## Configuration

The bundled profile layer automatically selects AnySearch as the existing `ctx.web` search and fetch provider, enables `web_fetch`, and mounts the advanced tools, so no changes are required by default.
```

**依据 3 · 源码核查**：[src/tools/batch.ts:233-263](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/tools/batch.ts#L233-L263)

每项独立HTTP及截断标记。

<details>
<summary>查看原文（31行）</summary>

```text
export async function executeBatchSearch(
  client: AnySearchClient,
  parsed: AnySearchBatchItem[],
  signal: AbortSignal,
  maxRenderedContentChars: number,
): Promise<AnySearchBatchOutput> {
  const items = await Promise.all(parsed.map(async (item, index): Promise<AnySearchBatchSuccess | AnySearchBatchFailure> => {
    try {
      const response = await client.search(item.request, signal)
      return {
        index,
        query: item.request.query,
        ok: true,
        ...response.requestId === undefined ? {} : { requestId: response.requestId },
        results: canonicalSearchResults(response.results, item.includeContent),
        metadata: response.metadata,
      }
    } catch (error: unknown) {
      if (error instanceof AnySearchClientError && error.kind === 'aborted') throw error
      return batchFailure(index, item.request.query, error)
    }
  }))
  const failed = items.filter(item => !item.ok).length
  return {
    items,
    summary: { total: items.length, succeeded: items.length - failed, failed },
    renderedContentTruncated: parsed.reduce((total, item, index) => {
      const result = items[index]
      if (result === undefined || !result.ok) return total
      return total + renderableContentCharacters(result.results, item.includeContent)
    }, 0) > maxRenderedContentChars,
```

</details>

**依据 4 · 作者声明**：[README.md:40-44](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L40-L44)

有URL与无URL结果的不同边界。

```text
- Through Harness's built-in `web_search`, AnySearch returns results with titles, snippets, and URLs for easy citation.
- Through Harness's built-in `web_fetch`, AnySearch Extract retrieves and cleans the content of a specific public HTTP(S) URL.
- Discover searchable domains, vertical categories, and supported parameters in real time, then run advanced searches using tags, regions, languages, and structured parameters.
- Run one to five searches concurrently; an individual failure does not affect the other results.
- Advanced search preserves useful structured results without source URLs, while page-backed results can return cleaned content on demand.
```

#### 缺口

- 当前额度、价格与领域召回质量未知
  **影响**：不能保证免费或优于原搜索
  **进一步探讨**：用固定问题集核对来源日期、相关性和实际请求账单

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁值得试用，如何验证覆盖改善？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有DSH且确需多领域查询的研究用户可对非敏感问题试用，先查capabilities再用精确tag，普通单查询保留原服务作对照。未验证方向是批量结果按独立来源与可引用性合并，显式保留失败和无URL数据，让研究者知道缺证在哪里，而不是把多查询命中数当覆盖。相同问题比较原provider、手工HTTP与批量模式，验收关键事实可追溯、相关重复率、缺失来源、全部调用与人工核查时间。若来源不可验证、限流明显或费用超预算，停用批量并回原provider与人工检索。

#### 证据与依据

**依据 1 · 源码核查**：[src/tools/batch.ts:239-258](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/src/tools/batch.ts#L239-L258)

输入序号和部分失败可支撑缺证呈现。

<details>
<summary>查看原文（20行）</summary>

```text
  const items = await Promise.all(parsed.map(async (item, index): Promise<AnySearchBatchSuccess | AnySearchBatchFailure> => {
    try {
      const response = await client.search(item.request, signal)
      return {
        index,
        query: item.request.query,
        ok: true,
        ...response.requestId === undefined ? {} : { requestId: response.requestId },
        results: canonicalSearchResults(response.results, item.includeContent),
        metadata: response.metadata,
      }
    } catch (error: unknown) {
      if (error instanceof AnySearchClientError && error.kind === 'aborted') throw error
      return batchFailure(index, item.request.query, error)
    }
  }))
  const failed = items.filter(item => !item.ok).length
  return {
    items,
    summary: { total: items.length, succeeded: items.length - failed, failed },
```

</details>

**依据 2 · 作者声明**：[README.md:68-76](https://github.com/anysearch-team/anysearch-dsh/blob/d20ab97727b36b4341977e53d7c9b7d2e93d3d03/README.md#L68-L76)

能力发现与垂直查询操作。

```text
| Use case | Harness tool |
|---|---|
| Ordinary web search | `web_search` |
| Fetch and clean a specific URL | `web_fetch` |
| Discover available domains and tags | `anysearch_capabilities` |
| Vertical or parameterized search | `anysearch_search` |
| Run one to five searches together | `anysearch_batch_search` |

For ordinary prompts, let Harness select the tool. Models can discover live domain and parameter definitions before making a specialized search.
```

#### 缺口

- 来源合并是否改善研究质量未知
  **影响**：仍为流程假设
  **进一步探讨**：用人工核对的事实题集比较有效引用与缺证识别

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
