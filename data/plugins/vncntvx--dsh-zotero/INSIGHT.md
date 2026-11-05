# dsh-zotero

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[043e4c8](https://github.com/Vncntvx/dsh-zotero/tree/043e4c8bc17c12ead6b718aa462eb149e31551d9)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Vncntvx/dsh-zotero) [![npm 30d 7,835](https://img.shields.io/static/v1?label=npm+30d&message=7%2C835&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zotero) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-zotero)
<!-- END META -->

> **功能**：让 DSH 通过本地 Zotero API 检索、读取、定位和导出文献，提供文献界面及可选审批写入。

> **亮点**：把检索、来源片段和稳定条目ref贯穿到DSH研究流程，有限预算与实例身份使结果范围可说明；不是新的文献数据库或模型推理能力。[Q01](#research-q01)

> **主要限制**：BM25与预算可能漏掉关键无词面重合段落，空结果不等于文献无证据；单项批准和版本保护也不意味着批量写全库可回滚。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 本地文献工具相对手工Zotero查找增加什么？](#detail-section-11)
  - [Q02 · 检索和证据如何从本地API到可追溯片段？](#detail-section-12)
  - [Q03 · 写入怎样经过批准，版本冲突是否能悄悄覆盖？](#detail-section-13)
  - [Q04 · 界面与部署条件怎样影响完整工作流程和成本？](#detail-section-14)
  - [Q05 · 怎样从词面与预算边界形成可证伪改进？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Zotero库的研究者可在对话中检索并回到条目和片段核对引用，最终论证仍由人负责。[Q01](#research-q01)

手工Zotero检索复制无需插件但跨应用传递引用；本组件集中对话与核对入口，不替代原库、全文质量或学术判断。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| zotero_search | 按库与范围发现候选 | 有限分页/筛选与补充组合限制 |
| zotero_get/get_batch | 读取已知条目 | 元数据和附件依赖本地库 |
| zotero_retrieve | 按问题提取来源片段 | BM25与预算有漏检/截断边界 |
| zotero_export | 生成引用或导出入口 | 导出质量仍需原库核对 |
| zotero_browse/changes/match_references | 浏览、变化与对账入口 | 本次不承诺所有边界均运行验证 |
| 审批写入 | 条件注册个人库修改工具 | 已核单项更新，不承诺批量全库回滚 |
| 文献界面 | 对话来源核对与侧栏浏览 | 依赖宿主Remote、配置表单和侧栏 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.2-alpha.2与所需Remote/侧栏服务 | 包声明及界面必需 | 工具、轨迹和面板 | 实际宿主接线另验 |
| Zotero本地API及已有库 | 本地读取必需 | 元数据与全文 | 连接/版本错误应停止并回原库 |
| 全文索引、附件和批注 | 相应证据必需 | 检索原文及页码 | 无匹配不代表无内容 |
| writeEnabled、Zotero写能力与两层批准 | 写入才必需 | 个人库修改 | 拒绝或缺通道不写 |
| scholarly组件与外部索引 | 可选且默认关闭 | 跨索引检索 | 不影响本地只读试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份文献库，启用本地API | 保持写入及scholarly关闭 |
| 加载 | 宿主注册工具、Remote与页签 | 核对配置版本和服务状态 |
| 检索 | Agent search后get/retrieve/export | 看ref、coverage与truncated，不把空匹配当无文献 |
| 核对与退出 | 用户回Zotero原文检查引用 | 定位不符或实例变化就停止引用并重查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机Zotero/DSH与构建资源未知 | API、版本与附件准备 | 源码与发布物分开验 |
| 持续使用 | 模型token、全文传输及本机计算未知 | 逐条核对片段/页码/引用 | 截断和词面漏检需补查 |
| 失败恢复 | 重查与恢复库资源未知 | 区分身份、连接、无匹配、冲突 | 批量写恢复未核查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 本地检索 | API范围解析与ref规范化 | 检索质量和任务节时 |
| 证据定位 | BM25、预算、来源与页码字段 | 语义召回与全文完备性 |
| 写入保护 | policy/plan批准和单项版本PATCH | 全库批量原子恢复 |
| 核对界面 | 轨迹页签和侧栏注册 | 实际浏览器/PDF办结 |

> **思考**：BM25与预算可能漏掉关键无词面重合段落，空结果不等于文献无证据；单项批准和版本保护也不意味着批量写全库可回滚。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把检索、来源片段和稳定条目ref贯穿到DSH研究流程，有限预算与实例身份使结果范围可说明；不是新的文献数据库或模型推理能力。[Q01](#research-q01)

领域provider与HTTP边界分离；实例412不重放原请求、并发和预算明确，单项写带版本可借鉴。它们仍不是学术结论正确性证明。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

BM25与预算可能漏掉关键无词面重合段落，空结果不等于文献无证据；单项批准和版本保护也不意味着批量写全库可回滚。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先做现有副本库的只读试用，保持写入与外部学术组件关闭；核对原文和截断后再使用引用。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

本地读取、片段定位、界面注册和单项写保护有源码依据；召回效果、宿主端到端和所有批量写恢复未验证；扩展检索为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/service.ts、src/tool-registration.ts、src/local/provider.ts、src/local/search-domain.ts、src/local/retrieve.ts、src/local/write-domain.ts、src/http-client.ts、src/config.ts、src/client/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查本地读取、检索预算、单项元数据写和界面注册；未运行Zotero/宿主，未核查全部批量写与外部学术服务，不把安全徽章当本次证据。
- 下一步：用标注文献问题验证召回/定位与截断，再在固定宿主做只读端到端；写与外部服务需独立核对授权和恢复。

**分析版本**

- **仓库**：[Vncntvx/dsh-zotero](https://github.com/Vncntvx/dsh-zotero)
- **版本号**：1.0.0-alpha.1（[固定提交 043e4c8](https://github.com/Vncntvx/dsh-zotero/tree/043e4c8bc17c12ead6b718aa462eb149e31551d9)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

让无匹配结果引导经用户确认的同义词扩展可能改善召回而不伪造证据；须比较漏检、错误引用与成本，尚未实现。[Q05](#research-q05)

用标注文献问题验证召回/定位与截断，再在固定宿主做只读端到端；写与外部服务需独立核对授权和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 26 | 4345 | — | — | 60793 |
| .mjs | source | 14 | 3761 | 2393 | 1147 | — |
| .ts | source | 236 | 49435 | 36630 | 9838 | — |
| .tsx | source | 59 | 10350 | 8654 | 1168 | — |
| .ts | test | 259 | 63603 | 54840 | 5753 | — |
| .tsx | test | 83 | 19438 | 16725 | 1458 | — |
| .md | test | 1 | 379 | — | — | 3511 |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Vncntvx/dsh-zotero/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=6&color=737b86&logo=github)](https://github.com/Vncntvx/dsh-zotero/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Vncntvx/dsh-zotero/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：本地文献链能否保留来源与写入边界，使对话研究可核对而非把片段当结论？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本地文献工具相对手工Zotero查找增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向已有Zotero库、需要在DSH对话中找文献和核对引用的研究者。合格结果是稳定ref可回到条目、检索片段标明来源和截断、引用由用户核对，而不是自动保证论证正确。相对手工在Zotero查找复制，本组件把search/get/retrieve/export等读取入口和会话文献轨迹接入宿主，保留从回答回原文的路径。文献与全文索引仍由Zotero提供，模型写作能力来自宿主；不能把二者归因于插件原创或宣称节时。可选外部学术组件默认disabled，不是每次本地检索都外发到七个索引。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-42](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/README.md#L24-L42)

作者本地工具与两界面定位。

<details>
<summary>查看原文（19行）</summary>

```text
dsh-zotero 是面向 DeepSeek Harness 的本地 Zotero 插件。Agent 在对话里检索、阅读、引用并按需修改文献库；你在文献面板里浏览整个库并复制引用；文献轨迹展示 Agent 在当前会话中查到的文献、原文片段与导出内容，方便核对。

所有操作均通过 Zotero 本地 API（`127.0.0.1:23119`）与桌面端交互，读取无需配置 API Key。

## 主要功能

- **对话检索**
  - 检索阅读：按标题、作者、年份或全文搜索文献，读取元数据、个人笔记与本地 PDF 全文。
  - 原文定位：围绕具体问题从全文、批注和笔记中提取相关段落，PDF 批注附带原始页码。
  - 引用导出：按 CSL 样式生成行内引用或参考文献表，支持导出 BibTeX、RIS 与 CSL-JSON。
  - 写入扩展（可选）：开启后可创建笔记、修改标签与合集（每次均需会话审批）；启用学术检索组件后可跨 7 个外部索引检索文献并核验引用。
- **文献轨迹**
  - 检索记录：会话顶部首屏显示每次调用的查询词、范围、筛选条件与命中数。
  - 原文核对：按文献条目整理提取出的段落与批注，标明出处与原始页码，方便核对。
  - 导出汇总：跨条目汇总当前会话生成的所有引用与 BibTeX，自动去重，可直接复制或下载。
- **文献面板**
  - 全库浏览：在右侧边栏浏览 Zotero 合集树、标签、保存的搜索与回收站，支持多条件组合筛选。
  - 详情与阅读：查看条目元数据、关联笔记与附件列表，支持在右侧阅读栏直接打开本地 PDF。
  - 引用与联动：动作行直接复制 BibTeX、CSL 引用或条目信息；支持将选中文献一键填入对话输入框。
```

</details>

**依据 2 · 源码核查**：[src/tool-registration.ts:31-46](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/tool-registration.ts#L31-L46)

八个读取入口注册。

<details>
<summary>查看原文（16行）</summary>

```text
export function registerReadTools(ctx: Context, service: ZoteroService): void {
  const delivery = new ResultDelivery(ctx, () => service.config)
  delivery.installJobs()
  registerResultRoute(ctx, delivery)
  // Every read tool registers through the same delivery envelope, explicitly:
  // the tool module still owns its schema and execute, and this is the one
  // place that wraps them.
  const wrap: ToolWrapper = (definition) => delivery.wrap(definition)
  registerSearchTool(ctx, service, wrap)
  registerGetTool(ctx, service, wrap)
  registerGetBatchTool(ctx, service, wrap)
  registerMatchReferencesTool(ctx, service, wrap)
  registerRetrieveTool(ctx, service, wrap)
  registerBrowseTool(ctx, service, wrap)
  registerExportTool(ctx, service, delivery, wrap)
  registerChangesTool(ctx, service, delivery, wrap)
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:7-21](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/cordis.patch.yml#L7-L21)

library与默认关闭scholarly。

<details>
<summary>查看原文（15行）</summary>

```text
    # The library component provides the library panel (collections tree,
    # multi-dimensional filters, item inspector, and approved personal-library writes).
    - id: library
      name: dsh-zotero/library
      config:
        rightSidebarEnabled: true
    # The scholarly component provides external academic literature retrieval
    # (arXiv, OpenAlex, Crossref, Semantic Scholar, PubMed, Europe PMC, DBLP).
    # It ships off. Its row's switch in the plugin manager's "Included
    # components" list is the only authorization: mounting the component
    # registers its seven tools and permits requests to the allowlisted
    # external indexes.
    - id: scholarly
      name: dsh-zotero/scholarly
      disabled: true
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 检索和证据如何从本地API到可追溯片段？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具服务选择provider，LocalApiProvider把search/retrieve交领域函数。search先解析库与合集等范围，再用getJson查询Zotero并规范化ref；带年份或附件条件走专门精确筛选路径，不能与补充笔记扫描任意组合。HTTP客户端有并发槽位、发请求后deadline、API版本与实例ID头，拒绝自动重定向；实例412不重放原请求而要求重查。retrieve把选定来源组成BM25语料，只返回得分大于0的片段，按passages和字符预算截断，并保留sourceRef、chunk、批注pageLabel等定位。空匹配不等于无内容，词面排序不能保证语义召回充分。

#### 证据与依据

**依据 1 · 源码核查**：[src/local/search-domain.ts:58-99](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/local/search-domain.ts#L58-L99)

真实范围解析与API查询。

<details>
<summary>查看原文（42行）</summary>

```text
export async function runSearch(
  deps: { client: ZoteroHttpClient; limits: LocalApiLimits; searchCaches: SearchIndexCaches },
  directory: ScopeDirectory,
  request: ZoteroSearchRequest,
  signal: AbortSignal | undefined,
  options: ZoteroSearchOptions,
): Promise<ZoteroSearchResult> {
  if (request.includeTrashed && request.scope.kind !== 'library') {
    throw new ZoteroError(INCLUDE_TRASHED_SCOPE_MESSAGE, ZOTERO_INVALID_ARGUMENT)
  }
  const scope = await resolveScope(directory, request.scope, request.library, {
    signal,
    itemLevel: request.itemLevel,
  })
  if (
    request.yearFrom !== undefined ||
    request.yearTo !== undefined ||
    request.hasAttachment !== undefined
  ) {
    // The exact path serves paged primary hits only and cannot scan note
    // bodies, so a caller that also asks for the supplement is refused.
    if (options.includeSupplemental) {
      throw new ZoteroError(FILTERED_SEARCH_SUPPLEMENT_MESSAGE, ZOTERO_INVALID_ARGUMENT)
    }
    return exactFilteredSearch(deps, scope, request, signal, options)
  }
  const { json, headers } = await deps.client.getJson<unknown>(
    scope.path,
    buildSearchParams(request),
    {
      signal,
      serverId: scope.serverId,
    },
  )
  const rows = requireArrayBody(json, 'items top listing')
  const responseServerId = serverIdFromHeaders(headers, scope.serverId)
  const libraryForItems = libraryOfResolvedScope(scope.resolved)
  const ctxForSearch: { library: SupportedLocalLibrary; serverId?: string } = {
    library: libraryForItems,
    serverId: responseServerId,
  }
  const items = rows.map((row) => normalizeSearchItem(row, ctxForSearch))
```

</details>

**依据 2 · 源码核查**：[src/http-client.ts:405-470](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/http-client.ts#L405-L470)

并发、deadline、身份和重定向边界。

<details>
<summary>查看原文（66行）</summary>

```text
  private async doGet(
    path: string,
    search: URLSearchParams | undefined,
    opts: ZoteroHttpGetOptions,
    isIdentityRefresh: boolean,
  ): Promise<ZoteroHttpResponse> {
    const url = new URL(path, this.baseUrlWithSlash)
    url.search = search?.toString() ?? ''
    // The identity refresh rides the slot of the request that triggered it
    // rather than taking one of its own: it is a single control request, and
    // a refresh that waited for a slot could sit behind the very holder it is
    // refreshing: with every slot held by a request whose 412 is waiting on
    // its own refresh, nothing would ever move.
    const release = isIdentityRefresh ? undefined : await acquireSlot(this.gate, opts.signal)
    try {
      return await this.send(url, opts, isIdentityRefresh)
    } finally {
      release?.()
    }
  }

  /** Send one request and read its body; the caller holds a slot for this. */
  private async send(
    url: URL,
    opts: ZoteroHttpGetOptions,
    isIdentityRefresh: boolean,
  ): Promise<ZoteroHttpResponse> {
    const startedAt = Date.now()
    // The debug request line is the only record that quotes the query string
    // (`relativePathOf` reads `url.href`), bounded by the ring's own clamps;
    // thrown errors and failure lines name the path alone.
    const target = `GET ${relativePathOf(url, this.baseUrlWithSlash)}`
    try {
      // The deadline fuses caller cancellation with the provider timeout; its
      // TimeoutReason later distinguishes our timeout from caller aborts. It
      // starts here, after the slot was taken, so time spent queued behind the
      // gate is never reported as Zotero failing to respond in time.
      using d = deadline(opts.signal, this.options.timeoutMs, ZOTERO_TIMEOUT)
      const headers: Record<string, string> = {
        [ZOTERO_API_VERSION_HEADER]: ZOTERO_LOCAL_API_VERSION,
      }
      const serverId =
        opts.serverId ?? (opts.sendServerId === false ? undefined : this.currentServerId)
      if (serverId !== undefined) headers[ZOTERO_SERVER_ID_HEADER] = serverId
      let response: Response
      try {
        response = await fetch(url, {
          method: 'GET',
          headers,
          redirect: 'manual',
          signal: d.signal,
        })
      } catch (error) {
        translateFetchError(error, d.signal, opts.signal, this.options.timeoutMs)
      }
      this.rememberServerId(response.headers)
      if (response.status === 412) {
        // The instance identity changed mid-session. Refresh the identity
        // record so later diagnostics are accurate, but never replay the
        // original request: the ref's provenance no longer matches, and the
        // caller must search again. A failed refresh must not mask the
        // mismatch itself: the original error stays stable and the refresh
        // error rides along as its cause. Caller cancellation still wins, so
        // an aborted refresh aborts the call like any other.
        // Single-refresh guard: the identity refresh runs with
        // `isIdentityRefresh`, so a refresh endpoint that also 412s fails loud
```

</details>

**依据 3 · 源码核查**：[src/local/retrieve.ts:516-565](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/local/retrieve.ts#L516-L565)

词面排名、预算和证据字段。

<details>
<summary>查看原文（50行）</summary>

```text
  const ranked = rankChunks(
    request.query,
    passages.map((passage, index) => ({ text: passage.rankText ?? passage.text, index })),
  )
  // Zero-score passages share nothing with the query; returning them as
  // "evidence" would present arbitrary excerpts as matches. A query with no
  // token overlap therefore yields an empty evidence array, which the
  // contract reads as "no match", not "no content".
  const matched = ranked.filter((entry) => entry.score > 0)
  const queryTerms = new Set(tokenize(request.query))
  const evidence: ZoteroEvidence[] = []
  let used = 0
  let truncated = matched.length > request.passages || fulltextWasCut || abstractWasCut
  for (const entry of matched.slice(0, request.passages)) {
    const passage = passages[entry.index]!
    // The budget charges every character the passage puts in front of the
    // model: the text and, for an annotation, its comment. Charging only the
    // text let a long comment ride in above the configured bound.
    const charged = passage.text.length + (passage.comment?.length ?? 0)
    if (used + charged > deps.limits.maxEvidenceChars) {
      truncated = true
      break
    }
    used += charged
    const matchedFields = matchedFieldsOf(queryTerms, passage)
    evidence.push({
      source: passage.source,
      sourceRef: passage.sourceRef,
      text: passage.text,
      ...(passage.chunkIndex !== undefined ? { chunkIndex: passage.chunkIndex } : {}),
      ...(passage.chunkCount !== undefined ? { chunkCount: passage.chunkCount } : {}),
      ...(passage.comment !== undefined ? { comment: passage.comment } : {}),
      ...(passage.pageLabel !== undefined ? { pageLabel: passage.pageLabel } : {}),
      ...(passage.attachmentRef !== undefined ? { attachmentRef: passage.attachmentRef } : {}),
      ...(matchedFields !== undefined ? { matchedFields } : {}),
    })
  }
  // A stable report order keeps the contract predictable: the sources the
  // caller asked for but the item could not provide, deduplicated.
  const sourcesSkipped = [...new Set(skipped)].sort(
    (a, b) => SOURCE_ORDER.indexOf(a) - SOURCE_ORDER.indexOf(b),
  )
  return {
    ref: refStringFor(ref.library as SupportedLocalLibrary, 'item', ref.key, serverId),
    ...(attachmentRef !== undefined ? { attachmentRef } : {}),
    ...(attachmentContentType !== undefined ? { attachmentContentType } : {}),
    ...(coverage !== undefined ? { coverage } : {}),
    ...(attachments !== undefined ? { attachments } : {}),
    evidence,
    truncated,
```

</details>

#### 缺口

- 没有目标研究问题的召回/定位准确率对照。
  **影响**：可能漏掉无词面重合的重要段落，不能把有限片段当穷尽证据。
  **进一步探讨**：用人工标注的同组文献问题核对漏检、来源定位及截断影响。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 写入怎样经过批准，版本冲突是否能悄悄覆盖？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

writeEnabled默认关闭；开启才注册写工具，service dispatchWrite先检查provider能力和方法再过approveWrite。批准分宿主policy和计划卡，两者不可用或拒绝时不调用provider。以updateItem为例，域层先读实例和条目版本，检查可改字段与条目类型；相同值返回unchanged，变更PATCH携带If-Unmodified-Since-Version。它降低该路径的并发覆盖风险，但不是跨多个写操作的全库事务，也不能把批准当用户已验证语义正确。README声明读取需Zotero7+、写需10，本次未核对实际运行API；重要库先备份，默认只读路径更容易限定影响。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:634-649](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/service.ts#L634-L649)

能力、方法、批准后调用。

<details>
<summary>查看原文（16行）</summary>

```text
  private async dispatchWrite<M extends ZoteroWriteMethod>(
    call: ZoteroWriteCall,
    methodName: M,
    request: Parameters<NonNullable<ZoteroProvider[M]>>[0],
  ): Promise<Awaited<ReturnType<NonNullable<ZoteroProvider[M]>>> | ZoteroWriteDeclined> {
    const provider = this.resolveProvider()
    this.requireCapability(provider, 'write')
    // Method presence before the plan card: a provider that cannot serve the
    // write must not spend the user's approval on a call that cannot run.
    const method = this.requireMethod(provider, methodName)
    if (!(await this.approveWrite(call))) return { kind: 'declined' }
    const invoke = method as (
      req: Parameters<NonNullable<ZoteroProvider[M]>>[0],
      signal?: AbortSignal,
    ) => Promise<Awaited<ReturnType<NonNullable<ZoteroProvider[M]>>>>
    return await invoke(request, call.exec.signal)
```

</details>

**依据 2 · 源码核查**：[src/service.ts:826-838](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/service.ts#L826-L838)

policy拒绝与缺通道报错，再计划卡。

<details>
<summary>查看原文（13行）</summary>

```text
  private async approveWrite(call: ZoteroWriteCall): Promise<boolean> {
    const policy = await requestWriteApproval(this.ctx, call)
    this.diagnostics.sink.info('write.gate', `write policy decision: ${policy}`, {
      tool: call.exec.name,
    })
    if (policy === 'declined') return false
    if (policy === 'unavailable') {
      this.diagnostics.sink.error('write.gate', 'approval channel unavailable; write refused', {
        tool: call.exec.name,
      })
      throw new ZoteroError(WRITE_APPROVAL_UNAVAILABLE_MESSAGE, ZOTERO_WRITE_APPROVAL_UNAVAILABLE)
    }
    const approved = await askPlanApproval(this.ctx, call)
```

</details>

**依据 3 · 源码核查**：[src/local/write-domain.ts:420-449](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/local/write-domain.ts#L420-L449)

实例、读版本到PATCH前提。

<details>
<summary>查看原文（30行）</summary>

```text
export async function withItemStateWrite<S, T>(
  deps: WriteDomainDeps,
  item: ZoteroObjectRef,
  signal: AbortSignal | undefined,
  readState: ItemStateReader<S>,
  plan: (context: ItemWriteContext<S>) => Promise<T>,
): Promise<T> {
  const serverId = await ensureServerId(deps, signal)
  const ref = requireWritableRefAtServer(item, ['item'], serverId)
  const snapshot = await readItem(deps, ref, serverId, readState, signal)
  // The read pins the serving instance and always reports it, so the write
  // carries the identity the item was actually read under.
  const send = (body: Record<string, unknown>): Promise<{ libraryVersion: number }> =>
    withWriteKey(
      deps,
      snapshot.serverId,
      signal,
      async (apiKey) =>
        await deps.writer.patch(`${libraryPrefix(PERSONAL_LIBRARY)}/items/${ref.key}`, body, {
          serverId: snapshot.serverId,
          apiKey,
          ifUnmodifiedSinceVersion: snapshot.version,
          signal,
        }),
    )
  return await plan({
    snapshot,
    serverId: snapshot.serverId,
    resultRef: itemRef(ref.key, snapshot.serverId),
    send,
```

</details>

**依据 4 · 源码核查**：[src/local/write-domain.ts:603-646](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/local/write-domain.ts#L603-L646)

字段适用检查和unchanged。

<details>
<summary>查看原文（44行）</summary>

```text
export async function updateItem(
  deps: WriteDomainDeps,
  request: ZoteroUpdateItemRequest,
  signal?: AbortSignal,
): Promise<ZoteroUpdateItemResult> {
  const localRef = requireWritableRef(request.item, ['item'])
  const updates = validateItemUpdateFields(request.set)
  return await withItemStateWrite(
    deps,
    localRef,
    signal,
    (data) => ({
      fields: Object.fromEntries(
        [...updates].map(([field]) => [wireFieldOf(field), data[wireFieldOf(field)]]),
      ),
    }),
    async ({ snapshot, serverId, resultRef, send }) => {
      const valid = await deps.itemTypeFields(snapshot.itemType, signal)
      const patch: Record<string, string> = {}
      const changed: string[] = []
      for (const [field, value] of updates) {
        const wire = wireFieldOf(field)
        if (!valid.has(wire)) {
          throw new ZoteroError(
            writeFieldNotForItemTypeMessage(field, snapshot.itemType),
            ZOTERO_INVALID_ARGUMENT,
          )
        }
        if (snapshot.fields[wire] !== value) {
          patch[wire] = value
          changed.push(field)
        }
      }
      if (changed.length === 0)
        return {
          kind: 'applied',
          ref: resultRef,
          version: snapshot.version,
          changed: [],
          unchanged: true,
          serverId,
        }
      changed.sort()
      const { libraryVersion } = await send(patch)
```

</details>

**依据 5 · 作者声明**：[README.md:73-76](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/README.md#L73-L76)

Zotero版本前提为作者声明。

```text
## 前置条件

1. 安装并运行 Zotero 7 及以上桌面版（写入功能需 Zotero 10）。
2. 在 Zotero 中开启本地 API：**设置 → 高级 → 勾选“允许此计算机上的其他应用程序与 Zotero 通信”**。
```

#### 缺口

- 未核查所有批量写操作的部分成功与恢复语义。
  **影响**：不能据单项版本保护承诺全库写入可原子回滚。
  **进一步探讨**：开启相应写工具前单独核对批次结果、冲突及备份恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 界面与部署条件怎样影响完整工作流程和成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

主服务注册读取工具、研究Skill和Remote通道；浏览器按webEnabled挂文献轨迹页签，经remote.zotero解析附件再打开右阅读栏。library面板另由bundle行提供，接入sidebarRightTabs并按开关显示；需要宿主对应远程、配置表单和侧栏服务。包声明DSH >=0.2.2-alpha.2，源码分支安装需构建，不能把release或npm产物等同于当前checkout已验收。首次需启用Zotero本地API并准备有全文/批注的库；持续有模型token、全文传输和人工引文复核成本，金额耗时未知。失败时应区分连接、实例变化、无匹配和截断，回Zotero核对，不盲目换成云上传。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:268-290](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/service.ts#L268-L290)

读取工具、Skill和remote注册。

<details>
<summary>查看原文（23行）</summary>

```text
    installShellWriteApproval(ctx, () => this.config, this.diagnostics)
    installToolDiagnostics(ctx, this.diagnostics)
    installParameterCorrection(ctx, ZOTERO_TOOL_NAMES)
    // Background-capable tools keep their parameters static; execution refuses
    // requests the current composition cannot serve.
    registerReadTools(ctx, this)
    registerResearchSkills(ctx, CORE_SOPS)
    // The status channel: the Remote service binds the wire namespace, and
    // the strict manifest claims its endpoints. See typert.ts for why the
    // manifest self-registers through ctx.inject(['typert']).
    new ZoteroRuntime(ctx)
    ctx.inject(['typert'], (host) => {
      // register() is itself a fiber-scoped effect: the manifest unwinds with
      // this inject fiber on unload, and no wrapper effect is needed.
      host.typert.register(TYPERT_MANIFEST)
    })
    // A plugin that ships its own settings page owns that page's presentation;
    // the automatic schema-generated one would be a second, conflicting
    // surface for the same namespace (`packages/settings/settings/README.md`).
    ctx.inject(['settings'], (settingsCtx) => {
      settingsCtx.effect(() => settingsCtx.settings.configure({ auto: false }, ctx.fiber))
    })
    this.reconcileWriteTools(this.config.writeEnabled)
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:354-407](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/client/index.ts#L354-L407)

文献轨迹开关、remote附件与阅读栏。

<details>
<summary>查看原文（54行）</summary>

```text
function registerConversationSurfaces(ctx: ClientContext, surfaces: UiSurfaces): void {
  const { form, probe } = surfaces

  // The dedicated Sources panel (a conversation tab) registers unless the
  // `webEnabled` namespace flag is explicitly off; before the first snapshot
  // the tab stays on, so a config hiccup never blocks it. The gate is live:
  // toggling the flag in the page hides or restores the tab without a reload.
  const tabT = ctx.locale.bind(NS)
  registerGatedSurfaces(
    ctx,
    'dsh-zotero: conversation tab',
    (onChange) => watchWebEnabled(form, onChange),
    () => {
      return ctx.slots.inject('conversation.view', () =>
        ctx.slots.register(
          {
            name: 'conversation.view',
            id: 'zotero',
            order: 30,
            locale: NS,
            registrant: REGISTRANT,
            label: () => tabT('nav'),
            // Read through the mutable binding, so a probe that arrives after
            // the tab was mounted is the one the strip actually calls.
            inject: (): SourcesTabFace => ({
              status: () => probe(),
              resolveAttachment: (ref: string) => ctx.remote.zotero.resolveAttachment(ref),
              // The tab owns the Session identity and the workspace root it
              // resolves against (`useSessions`), so it builds the whole
              // address and hands the entry a ready URL. This fiber cannot do
              // it: on the browser side the `ctx.sessions` Context key carries
              // the host `SessionStore`, not the client `ISessions` catalog.
              openResource: (url: string) => ctx.sidebarRight.openResource(url),
            }),
          },
          SourcesTab,
        ),
      )
    },
  )
}

/**
 * Whether the library sidebar surface is enabled: the root `webEnabled` flag
 * (false only when the snapshot says so) and the surface's own switch.
 */
function sidebarEnabledOf(
  form: ConfigForm<Record<string, unknown>>,
  libraryForm: ConfigForm<Record<string, unknown>>,
  key: 'rightSidebarEnabled',
): boolean {
  const snapshot = libraryForm.getSnapshot()
  const ownSwitchOn = snapshot.status !== 'ready' || snapshot.value?.[key] !== false
  return webEnabledOf(form) && ownSwitchOn
```

</details>

**依据 3 · 源码核查**：[src/config.ts:139-157](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/config.ts#L139-L157)

默认连接与预算上限。

<details>
<summary>查看原文（19行）</summary>

```text
  baseUrl: Schema.string().default('http://127.0.0.1:23119/api').volatile(),
  provider: Schema.string().default(LOCAL_PROVIDER_ID).volatile(),
  timeoutMs: Schema.number().default(5000).volatile(),
  maxInFlightRequests: Schema.number().default(8).volatile(),
  maxSearchResults: Schema.number().default(20).volatile(),
  maxNoteScanRecords: Schema.number().default(200).volatile(),
  searchConcurrency: Schema.number().default(4).volatile(),
  maxEvidenceChars: Schema.number().default(6000).volatile(),
  maxEvidencePassages: Schema.number().default(4).volatile(),
  maxNoteChars: Schema.number().default(2000).volatile(),
  maxNoteRecords: Schema.number().default(50).volatile(),
  maxAnnotationRecords: Schema.number().default(100).volatile(),
  maxAttachmentRecords: Schema.number().default(50).volatile(),
  fulltextChunkWords: Schema.number().default(200).volatile(),
  maxFulltextChars: Schema.number().default(250_000).volatile(),
  retrieveAttachmentCap: Schema.number().default(16).volatile(),
  graphConcurrency: Schema.number().default(4).volatile(),
  maxResponseBytes: Schema.number().default(DEFAULT_MAX_RESPONSE_BYTES).volatile(),
  maxExportChars: Schema.number().default(1_000_000).volatile(),
```

</details>

**依据 4 · 源码核查**：[package.json:39-41](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/package.json#L39-L41)

宿主版本声明。

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": ">=0.2.2-alpha.2"
```

#### 缺口

- 没有跨平台浏览器、全文附件和实际宿主的端到端验收。
  **影响**：不能保证界面、PDF打开与完整任务办结。
  **进一步探讨**：在已有副本库以只读检索到引用核对的链路检查当前宿主。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样从词面与预算边界形成可证伪改进？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q02的BM25零重合返回空与截断上限，可提出“无匹配时引导用户选择同义词或明确扩展检索，而不自动伪造证据”的未验证假设。用同组人工标注文献问题比较原词面查询和用户确认后的扩展，观察召回、错误引用、模型/人工成本；若漏检不降或错误引用增多则否定。当前可对已有库做只读小范围试用，保持写工具和外部学术组件关闭；先核对ref、页码、截断与完整原文，再把输出用于写作。不存在足够材料支持自动文献结论或无需复核的采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/local/retrieve.ts:520-565](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/src/local/retrieve.ts#L520-L565)

无词重合、预算及定位字段。

<details>
<summary>查看原文（46行）</summary>

```text
  // Zero-score passages share nothing with the query; returning them as
  // "evidence" would present arbitrary excerpts as matches. A query with no
  // token overlap therefore yields an empty evidence array, which the
  // contract reads as "no match", not "no content".
  const matched = ranked.filter((entry) => entry.score > 0)
  const queryTerms = new Set(tokenize(request.query))
  const evidence: ZoteroEvidence[] = []
  let used = 0
  let truncated = matched.length > request.passages || fulltextWasCut || abstractWasCut
  for (const entry of matched.slice(0, request.passages)) {
    const passage = passages[entry.index]!
    // The budget charges every character the passage puts in front of the
    // model: the text and, for an annotation, its comment. Charging only the
    // text let a long comment ride in above the configured bound.
    const charged = passage.text.length + (passage.comment?.length ?? 0)
    if (used + charged > deps.limits.maxEvidenceChars) {
      truncated = true
      break
    }
    used += charged
    const matchedFields = matchedFieldsOf(queryTerms, passage)
    evidence.push({
      source: passage.source,
      sourceRef: passage.sourceRef,
      text: passage.text,
      ...(passage.chunkIndex !== undefined ? { chunkIndex: passage.chunkIndex } : {}),
      ...(passage.chunkCount !== undefined ? { chunkCount: passage.chunkCount } : {}),
      ...(passage.comment !== undefined ? { comment: passage.comment } : {}),
      ...(passage.pageLabel !== undefined ? { pageLabel: passage.pageLabel } : {}),
      ...(passage.attachmentRef !== undefined ? { attachmentRef: passage.attachmentRef } : {}),
      ...(matchedFields !== undefined ? { matchedFields } : {}),
    })
  }
  // A stable report order keeps the contract predictable: the sources the
  // caller asked for but the item could not provide, deduplicated.
  const sourcesSkipped = [...new Set(skipped)].sort(
    (a, b) => SOURCE_ORDER.indexOf(a) - SOURCE_ORDER.indexOf(b),
  )
  return {
    ref: refStringFor(ref.library as SupportedLocalLibrary, 'item', ref.key, serverId),
    ...(attachmentRef !== undefined ? { attachmentRef } : {}),
    ...(attachmentContentType !== undefined ? { attachmentContentType } : {}),
    ...(coverage !== undefined ? { coverage } : {}),
    ...(attachments !== undefined ? { attachments } : {}),
    evidence,
    truncated,
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:14-21](https://github.com/Vncntvx/dsh-zotero/blob/043e4c8bc17c12ead6b718aa462eb149e31551d9/cordis.patch.yml#L14-L21)

外部组件默认关闭。

```text
    # (arXiv, OpenAlex, Crossref, Semantic Scholar, PubMed, Europe PMC, DBLP).
    # It ships off. Its row's switch in the plugin manager's "Included
    # components" list is the only authorization: mounting the component
    # registers its seven tools and permits requests to the allowlisted
    # external indexes.
    - id: scholarly
      name: dsh-zotero/scholarly
      disabled: true
```

#### 缺口

- 同义词扩展方案未实现且缺对照。
  **影响**：不能计入当前检索优势或召回保证。
  **进一步探讨**：独立原型做标注文献问题对照，记录引用错误和成本。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
