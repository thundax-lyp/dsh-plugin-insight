# WeKnora DSH 插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[256a3f2](https://github.com/Tencent/WeKnora/tree/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora)

<!-- BEGIN META -->
[![GitHub ★ 35,641](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C641&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 5,203](https://img.shields.io/static/v1?label=npm+30d&message=5%2C203&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)
<!-- END META -->

> **功能**：为 DSH 提供 WeKnora 知识库检索、文档阅读与综合问答工具

> **亮点**：该包把检索片段、文档补读和服务端问答拆成可组合的 DSH 工具，并保留可追踪文档 ID 和截断信息，减少自行接 API 的工程负担；其增量属于适配层而非检索算法。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：分页结束不代表文本未被裁剪，默认库范围也不是强制白名单；ask 会写会话状态，不能以“知识内容只读”推导无副作用。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 已有知识平台的团队为什么需要这个适配层？](#detail-section-11)
  - [Q02 · 调用怎样从 DSH 到达知识库并形成可复核结果？](#detail-section-12)
  - [Q03 · 默认范围与失败处理能否保证完整且最小范围的证据？](#detail-section-13)
  - [Q04 · 采用需要承担哪些责任，如何限定试用与退出？](#detail-section-14)
  - [Q05 · 哪些工程改进值得继续验证而不冒充已有贡献？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向已有 WeKnora 的 DSH 团队，把组织文档检索、原文补读与跨文档问答接回当前任务。

基线为直接使用已部署的 WeKnora 网页或手写 API 请求。插件新增 DSH 工具适配与结果投影，不将服务端检索和模型能力算作自身贡献。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 搜索与补读 | 获取原文和邻近上下文 | 有后端与权限，注意裁剪 |
| 服务端问答 | 跨文档综合 | chat 权限并创建会话，额外模型消耗未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH tools 注册服务 | 启动必需 | 注入并注册四类工具 | 无法加载；实际宿主兼容未实测 |
| WeKnora 与已有可检索语料 | 必需 | 检索、分块、模型与权限后端 | 适配层不能独立产生答案 |
| API key 与可选 tenantId | 受保护部署必需 | 选择凭证可读范围 | HTTP 错误或无可见库 |
| chat 权限与服务端模型 | ask 必需 | 建会话并综合答案 | 先禁用 ask，保留搜索补读 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 管理员配置 URL、受限 key 与库范围 | 直接平台能读同一资料 |
| 加载 | 用户添加包并启用工具 | tools 注册且配置校验通过 |
| 取证 | Agent 搜索后按文档 ID 补读 | 引用指向原文并解释裁剪 |
| 验收恢复 | 人工核对答案和范围 | 不符则回平台复核，排查响应与权限 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 现有后端或新增部署资源，金额未知 | 配置凭证与范围，耗时未知 | 不提供入库与 embedding |
| 持续使用 | 检索和 ask 模型消耗未知 | 维护语料和复核引用，频率未知 | 未测合格任务成本 |
| 失败恢复 | 重试和额外会话消耗未知 | 核对状态、权限和截断 | 不盲目重放 ask |
| 退出 | 后端会话清理资源未知 | 撤销插件与权限、另行清理会话 | 撤销工具不删除后端状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 知识接入 | 原生注册并调用后端 API | 当前宿主端到端可用性 |
| 证据交接 | 段落 ID、补读与截断标志 | 召回率及引用正确率 |
| 综合问答 | 创建会话并接 SSE | 质量、延迟与额外费用 |

> **思考**：分页结束不代表文本未被裁剪，默认库范围也不是强制白名单；ask 会写会话状态，不能以“知识内容只读”推导无副作用。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：该包把检索片段、文档补读和服务端问答拆成可组合的 DSH 工具，并保留可追踪文档 ID 和截断信息，减少自行接 API 的工程负担；其增量属于适配层而非检索算法。[Q01](#research-q01) [Q02](#research-q02)

入口、配置、HTTP 客户端、结构化工具与渲染分离，可复用的是职责分层与显式截断；成功缓存无 TTL 和错误 data 归为空集合要求用户特别验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

分页结束不代表文本未被裁剪，默认库范围也不是强制白名单；ask 会写会话状态，不能以“知识内容只读”推导无副作用。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

先禁用 ask，以受限库比较网页与插件的相同问题；要求能回到原文并识别裁剪。明确需要跨文档综合后再开放 chat；若引用与范围核对失败，停止并回平台直接查询。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

工具注册、请求接线、范围选择与裁剪机制有固定源码支持；采用价值为条件性分析。自动证据预算是尚未实现的研究假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weknora/package.json、packages/dsh-weknora/README.md、packages/dsh-weknora/src/index.ts、packages/dsh-weknora/src/config.ts、packages/dsh-weknora/src/tools.ts、packages/dsh-weknora/src/client.ts 及固定范围 inventory；组件：packages/dsh-weknora。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查本组件 package、README、index、config、tools 与 client 的入口、调用、输出和失败分支；未穷尽根平台所有算法。
- 下一步：源码证据支持适配层的条件性判断；召回、引用正确性、端到端耗时与额外服务端消耗需要固定题集对照。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：0.1.0（[固定提交 256a3f2](https://github.com/Tencent/WeKnora/tree/256a3f2966866337f7dc3c5fcc10037f2ae18d52)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：在当前搜索与补读接口之上增加显式证据预算，当引用覆盖不足才升级 ask，可能减少额外模型调用；同时把 truncated 与 has_more 的组合视为不完整信号，避免把分页结束误认为证据齐全。推导来自片段查询与综合问答分离、以及独立裁剪标志，不意味着插件已有自动路由。最小验证应比较只检索、始终 ask 和预算升级三组，固定知识库、问题、模型与验收人员，并记录引用准确性、漏答、总延迟、重试及模型费用。若升级组降低引用正确性或端到端负担没有下降，则推翻优势；不能仅靠减少调用次数接受假设。 [Q05](#research-q05)

源码证据支持适配层的条件性判断；召回、引用正确性、端到端耗时与额外服务端消耗需要固定题集对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 341 | — | — | 3438 |
| .ts | source | 6 | 1311 | 1068 | 151 | — |
| .mjs | test | 8 | 1618 | 1324 | 162 | — |

</details>

**活跃度**

[![Issue 未关闭 404](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=404&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 322](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=322&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z) [![近30天关闭 236](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=236&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-28T01%3A52%3A52.223Z..2026-10-28T01%3A52%3A52.223Z)



统计日期：2026-10-28。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 WeKnora 的团队能否借助此适配层可靠地交接组织文档证据？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有知识平台的团队为什么需要这个适配层？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标人群是在 DSH 内处理组织文档问题、且已经维护 WeKnora 的研发或研究人员。原办法是转到平台网页搜索后复制内容，或自行编写 API 请求；合格结果应有命中段落、文档标识和可继续阅读的邻近上下文，而不是只有生成结论。该包把已有平台的检索、文档分块与问答投影为四种宿主工具，增量在调用协议和证据交接。向量检索、重排、入库与模型能力属于服务端，不能计为适配层发明。只有偶发查询、没有现成后端时，直接平台网页通常已足够，部署整套知识平台不能仅由这个入口便利来辩护。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/package.json:1-20](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/package.json#L1-L20)

作者定义知识检索工具包的用途。

<details>
<summary>查看原文（20行）</summary>

```text
{
  "name": "@wxg-prc-cpg/dsh-weknora",
  "version": "0.1.0",
  "publishConfig": {
    "access": "public",
    "registry": "https://registry.npmjs.org/"
  },
  "description": "WeKnora knowledge retrieval tools for DeepSeek Harness (dsh): semantic search, document reading and RAG/agent answers over your own knowledge bases.",
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "cordis",
    "weknora",
    "rag",
    "retrieval",
    "knowledge-base"
  ],
  "license": "MIT",
  "author": "WeKnora",
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/index.ts:28-36](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/index.ts#L28-L36)

apply 创建客户端并注册工具，确认原生插件身份。

```text
export function apply(ctx: HarnessContext, config: unknown): void {
  const resolved = resolveConfig(config as never)
  const client = new WeknoraClient(resolved)
  const registered: string[] = []
  for (const definition of createTools(client, resolved)) {
    ctx.tools.register(definition)
    registered.push(definition.name)
  }
  ctx.logger?.info(`dsh-weknora: registered ${registered.join(', ')} against ${resolved.baseUrl}`)
```

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:243-260](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L243-L260)

搜索结果的用途是组织文档片段和后续文档阅读。

<details>
<summary>查看原文（18行）</summary>

```text
  if (config.tools.search) {
    definitions.push({
      name: name('search'),
      description: 'Search WeKnora knowledge bases and return the matching passages verbatim (hybrid vector + keyword '
        + 'retrieval, no model summarization). Use this to ground an answer in the organization\'s own documents, and '
        + 'also to locate a document by name — a query that reads like a title additionally returns the documents it '
        + 'names.' + scopeNote
        + ` Every hit carries a knowledge_id you can pass to ${name('read_document')} for the full document.`,
      parameters: {
        type: 'object',
        properties: {
          query: { type: 'string', description: 'Natural-language query; a full question retrieves better than keywords.' },
          knowledge_base_ids: { ...STRING_ARRAY, description: 'Restrict the search to these knowledge base ids.' },
          knowledge_ids: { ...STRING_ARRAY, description: 'Restrict the search to these document ids.' },
          max_results: { type: 'integer', description: `Maximum passages to return (default ${config.maxResults}).` },
        },
        required: ['query'],
        additionalProperties: false,
```

</details>

#### 缺口

- 缺少具体团队重复查询与网页切换的实测记录
  **影响**：需求强度和节省交接时间不能确定
  **进一步探讨**：同一人员以现有网页和插件完成相同文档任务，记录合格结果与交接次数。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 调用怎样从 DSH 到达知识库并形成可复核结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口声明 inject tools，apply 先校验配置，再生成 WeknoraClient 并逐个注册定义。search 校验 query，解析显式文档或知识库范围，并行调用段落检索与按名找文档；后者出错只取消补充结果，不丢段落。命中保留 knowledge_id、分块位置和截断标志，read_document 据此分页读取并按 chunk_index 排序重组。ask 则创建或复用服务端会话，按 agent_id 选择服务端 RAG 或 agent 路由，最后返回答案、引用与会话标识。这样的搜索→补读→综合是可组合工具链，不是已实现的自动质量门控；宿主模型仍须决定取证是否足够。输出结构和渲染分离便于其他调用模式复用，但不证明宿主实际接受所有定义。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/index.ts:12-36](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/index.ts#L12-L36)

注入与注册构成入口。

<details>
<summary>查看原文（25行）</summary>

```text
export const name = 'dsh-weknora'

/** Cordis waits for the tool registry before applying this plugin. */
export const inject = ['tools'] as const

export type { Config } from './config.ts'
export { ConfigError, normalizeBaseUrl, resolveConfig } from './config.ts'
export { WeknoraApiError, WeknoraClient } from './client.ts'
export { createTools } from './tools.ts'

/**
 * Register the configured tools. Each registration is an effect, so unloading
 * or reconfiguring the plugin withdraws the tools without a restart.
 * @param ctx - the Cordis context, with `ctx.tools` injected.
 * @param config - the plugin's `config` row; validated here so a typo fails the load.
 */
export function apply(ctx: HarnessContext, config: unknown): void {
  const resolved = resolveConfig(config as never)
  const client = new WeknoraClient(resolved)
  const registered: string[] = []
  for (const definition of createTools(client, resolved)) {
    ctx.tools.register(definition)
    registered.push(definition.name)
  }
  ctx.logger?.info(`dsh-weknora: registered ${registered.join(', ')} against ${resolved.baseUrl}`)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:329-358](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L329-L358)

实际搜索请求和标题补充降级。

<details>
<summary>查看原文（30行）</summary>

```text
      async execute(args, exec): Promise<SearchValue> {
        const toolName = name('search')
        const query = requiredString(args, 'query', toolName)
        const knowledgeIds = stringArrayArg(args, 'knowledge_ids')
        const knowledgeBaseIds = await resolveScope(
          stringArrayArg(args, 'knowledge_base_ids'),
          knowledgeIds,
          exec.signal,
        )
        // Fail here rather than let WeKnora answer 400: the model can act on a
        // message naming the argument to supply, not on a transport error.
        if (knowledgeBaseIds.length === 0 && knowledgeIds.length === 0) {
          throw new Error(`${toolName}: this WeKnora credential can see no knowledge base, so there is `
            + 'nothing to search. Check the deployment\'s API key scope.')
        }
        const limit = boundedIntArg(args, 'max_results', config.maxResults, config.maxResults)
        const [hits, named] = await Promise.all([
          client.search({ query, knowledgeBaseIds, knowledgeIds }, exec.signal),
          // By-name matching is an enrichment, and older WeKnora builds may not
          // route it. Losing it must not cost the model its passages.
          client.findDocuments({ keyword: query, limit }, exec.signal).catch(() => []),
        ])
        const results = hits.slice(0, limit).map((hit, index) => projectHit(hit, index + 1, config.maxChunkChars))
        return {
          query,
          knowledge_base_ids: knowledgeBaseIds,
          count: results.length,
          results,
          documents: projectNamedDocuments(named, results, knowledgeBaseIds, knowledgeIds),
        }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-449](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L417-L449)

文档分页、排序和裁剪。

<details>
<summary>查看原文（33行）</summary>

```text
      async execute(args, exec): Promise<DocumentValue> {
        const toolName = name('read_document')
        const knowledgeId = requiredString(args, 'knowledge_id', toolName)
        const page = boundedIntArg(args, 'page', 1, 10_000)
        const pageSize = boundedIntArg(args, 'page_size', 20, 100)
        const [result, metadata] = await Promise.all([
          client.listChunks({ knowledgeId, page, pageSize }, exec.signal),
          // Only page 1 is worth the extra call and the summary's tokens: by
          // page 2 the model has already seen what this document is. Metadata
          // is context, not the payload, so a deployment that cannot serve it
          // must still hand over the text.
          page === 1
            ? client.getDocument(knowledgeId, exec.signal).catch(() => ({}) as DocumentRecord)
            : Promise.resolve({} as DocumentRecord),
        ])
        const ordered = [...result.chunks].sort(orderByChunkIndex)
        const joined = ordered.map(chunk => typeof chunk.content === 'string' ? chunk.content : '').join('\n\n')
        const clipped = clip(joined, config.maxChunkChars * Math.max(1, Math.min(ordered.length, 10)))
        const title = typeof metadata.title === 'string' && metadata.title.trim() !== ''
          ? metadata.title.trim()
          : typeof metadata.file_name === 'string' ? metadata.file_name.trim() : ''
        return {
          knowledge_id: knowledgeId,
          title,
          summary: clip(typeof metadata.description === 'string' ? metadata.description.trim() : '', config.maxChunkChars).text,
          page: result.page,
          page_size: result.pageSize,
          total_chunks: result.total,
          returned_chunks: ordered.length,
          has_more: result.page * result.pageSize < result.total,
          truncated: clipped.truncated,
          content: clipped.text,
        }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-548](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L518-L548)

ask 实际创建会话并获取服务端生成结果。

<details>
<summary>查看原文（31行）</summary>

```text
      async execute(args, exec): Promise<AskValue> {
        const toolName = name('ask')
        const query = requiredString(args, 'query', toolName)
        const requested = stringArrayArg(args, 'knowledge_base_ids')
        const agentId = optionalStringArg(args, 'agent_id') ?? config.agentId
        // A custom agent resolves its own scope server-side from its
        // KBSelectionMode, and ids sent here would override that as an explicit
        // mention. The RAG pipeline has no such default: it retrieves only what
        // the request names, and answers from nothing when it names nothing.
        const knowledgeBaseIds = agentId === undefined
          ? await resolveScope(requested, [], exec.signal)
          : requested.length > 0 ? requested : config.knowledgeBaseIds
        if (agentId === undefined && knowledgeBaseIds.length === 0) {
          throw new Error(`${toolName}: this WeKnora credential can see no knowledge base, so there is `
            + 'nothing to answer from. Check the deployment\'s API key scope.')
        }
        const webSearch = argRecord(args)['web_search'] === true
        const sessionId = optionalStringArg(args, 'session_id')
          ?? await client.createSession(`dsh: ${clip(query, 60).text}`, exec.signal)
        const streamed = await client.ask({ sessionId, query, knowledgeBaseIds, agentId, webSearch }, exec.signal)
        return {
          answer: streamed.answer.trim(),
          session_id: streamed.sessionId,
          pipeline: agentId === undefined ? 'rag' : 'agent',
          tool_calls: streamed.toolCalls,
          references: streamed.references.slice(0, config.maxResults).map(reference => ({
            knowledge_id: typeof reference.knowledge_id === 'string' ? reference.knowledge_id : '',
            document: documentLabel(reference),
            chunk_index: typeof reference.chunk_index === 'number' ? reference.chunk_index : -1,
            content: clip(typeof reference.content === 'string' ? reference.content : '', config.maxChunkChars).text,
          })),
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:289-305](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/client.ts#L289-L305)

agent 与 RAG 路由及 SSE 请求。

<details>
<summary>查看原文（17行）</summary>

```text
    const route = input.agentId === undefined ? 'knowledge-chat' : 'agent-chat'
    const path = `/${route}/${encodeURIComponent(input.sessionId)}`
    const body = {
      query: input.query,
      channel: 'api',
      ...input.knowledgeBaseIds.length > 0 ? { knowledge_base_ids: input.knowledgeBaseIds } : {},
      ...input.agentId === undefined ? {} : { agent_id: input.agentId, agent_enabled: true },
      ...input.webSearch ? { web_search_enabled: true } : {},
    }
    const open = async (): Promise<Response> => {
      const combined = deadline(signal, this.config.chatTimeoutMs)
      try {
        return await fetch(this.url(path), {
          method: 'POST',
          headers: { ...this.headers(), Accept: 'text/event-stream' },
          body: JSON.stringify(body),
          signal: combined,
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认范围与失败处理能否保证完整且最小范围的证据？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不能保证。未显式指定范围时，插件缓存凭证能看见的全部知识库列表，缓存失败会清除以便下次重试，但成功缓存没有过期策略，运行期间新增库可能要重载才进入默认范围。按名查找跨租户可见库，输出再次按请求库或文档 ID 过滤，这提供结果范围约束；它不是服务端授权替代，也不让配置知识库变成强制白名单，调用参数仍可覆盖默认库。read_document 会把多块文本合并后裁剪到至多十块的字符预算；即便 has_more 为 false，truncated 仍可能为 true，不能据此宣称已经完整读完。public 资源模式只对带特定错误文本的 403 自动降级，其他权限错误继续抛出。网络、HTTP 和非 JSON 有不同错误，但有效 JSON 的 data 缺失可被归为空数组，因此“没有结果”不一定说明文档不存在。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:168-183](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L168-L183)

成功缓存无 TTL，显式参数优先于默认配置。

<details>
<summary>查看原文（16行）</summary>

```text
  let everyId: Promise<string[]> | undefined
  const allKnowledgeBaseIds = async (signal: AbortSignal): Promise<string[]> => {
    everyId ??= client.listKnowledgeBases(signal).then(
      bases => bases.map(kb => typeof kb.id === 'string' ? kb.id : '').filter(id => id !== ''),
      (error: unknown) => {
        everyId = undefined
        throw error
      },
    )
    return await everyId
  }
  const resolveScope = async (requested: string[], knowledgeIds: string[], signal: AbortSignal): Promise<string[]> => {
    if (requested.length > 0) return requested
    if (config.knowledgeBaseIds.length > 0) return config.knowledgeBaseIds
    if (knowledgeIds.length > 0) return []
    return await allKnowledgeBaseIds(signal)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:126-150](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L126-L150)

按名结果依据请求范围再次过滤。

<details>
<summary>查看原文（25行）</summary>

```text
function projectNamedDocuments(
  named: DocumentRecord[],
  passages: SearchHit[],
  knowledgeBaseIds: string[],
  knowledgeIds: string[],
): DocumentMatch[] {
  const already = new Set(passages.map(hit => hit.knowledge_id))
  const scope = new Set(knowledgeBaseIds)
  const wanted = new Set(knowledgeIds)
  const out: DocumentMatch[] = []
  for (const document of named) {
    const id = typeof document.id === 'string' ? document.id : ''
    const kbId = typeof document.knowledge_base_id === 'string' ? document.knowledge_base_id : ''
    if (id === '' || already.has(id)) continue
    if (wanted.size > 0 ? !wanted.has(id) : !scope.has(kbId)) continue
    const title = typeof document.title === 'string' && document.title.trim() !== ''
      ? document.title.trim()
      : typeof document.file_name === 'string' ? document.file_name : id
    out.push({
      knowledge_id: id,
      title,
      knowledge_base_id: kbId,
      knowledge_base: typeof document.knowledge_base_name === 'string' ? document.knowledge_base_name : kbId,
    })
    already.add(id)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:432-448](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L432-L448)

裁剪预算与分页结束相互独立。

<details>
<summary>查看原文（17行）</summary>

```text
        const ordered = [...result.chunks].sort(orderByChunkIndex)
        const joined = ordered.map(chunk => typeof chunk.content === 'string' ? chunk.content : '').join('\n\n')
        const clipped = clip(joined, config.maxChunkChars * Math.max(1, Math.min(ordered.length, 10)))
        const title = typeof metadata.title === 'string' && metadata.title.trim() !== ''
          ? metadata.title.trim()
          : typeof metadata.file_name === 'string' ? metadata.file_name.trim() : ''
        return {
          knowledge_id: knowledgeId,
          title,
          summary: clip(typeof metadata.description === 'string' ? metadata.description.trim() : '', config.maxChunkChars).text,
          page: result.page,
          page_size: result.pageSize,
          total_chunks: result.total,
          returned_chunks: ordered.length,
          has_more: result.page * result.pageSize < result.total,
          truncated: clipped.truncated,
          content: clipped.text,
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/client.ts:145-192](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/client.ts#L145-L192)

仅针对特定 403 降级并区分传输与响应错误。

<details>
<summary>查看原文（48行）</summary>

```text
  private isPublicModeForbidden(error: unknown): boolean {
    return error instanceof WeknoraApiError
      && this.config.resourceUrls === 'public'
      && !this.publicModeBlocked
      && error.status === 403
      && error.message.includes('resource_urls=public')
  }

  private async fetchJson<T>(
    path: string,
    init: { method: 'GET' | 'POST', body?: unknown, query?: Record<string, string | number | undefined> },
    signal: AbortSignal,
  ): Promise<Envelope<T>> {
    try {
      return await this.fetchJsonOnce(path, init, signal)
    } catch (error) {
      if (!this.isPublicModeForbidden(error)) throw error
      this.publicModeBlocked = true
      return await this.fetchJsonOnce(path, init, signal)
    }
  }

  private async fetchJsonOnce<T>(
    path: string,
    init: { method: 'GET' | 'POST', body?: unknown, query?: Record<string, string | number | undefined> },
    signal: AbortSignal,
  ): Promise<Envelope<T>> {
    const url = this.url(path, init.query)
    let response: Response
    try {
      response = await fetch(url, {
        method: init.method,
        headers: this.headers(),
        ...init.body === undefined ? {} : { body: JSON.stringify(init.body) },
        signal: deadline(signal, this.config.requestTimeoutMs),
      })
    } catch (cause) {
      throw new WeknoraApiError(`${init.method} ${path} failed: ${describeTransportFailure(cause, signal)}`)
    }
    const text = await response.text()
    if (!response.ok) {
      throw new WeknoraApiError(`${init.method} ${path} failed with HTTP ${response.status}: ${reasonOf(text)}`, response.status)
    }
    try {
      return JSON.parse(text) as Envelope<T>
    } catch {
      throw new WeknoraApiError(`${init.method} ${path} returned a non-JSON body: ${snippet(text)}`, response.status)
    }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:195-214](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/client.ts#L195-L214)

data 非数组返回空集合。

<details>
<summary>查看原文（20行）</summary>

```text
  /** List the knowledge bases this credential can retrieve from. */
  async listKnowledgeBases(signal: AbortSignal): Promise<KnowledgeBaseSummary[]> {
    const envelope = await this.fetchJson<KnowledgeBaseSummary[]>('/knowledge-bases', { method: 'GET' }, signal)
    return Array.isArray(envelope.data) ? envelope.data : []
  }

  /** Hybrid (vector + keyword) retrieval across one or more knowledge bases. */
  async search(
    input: { query: string, knowledgeBaseIds: string[], knowledgeIds: string[] },
    signal: AbortSignal,
  ): Promise<SearchResult[]> {
    const envelope = await this.fetchJson<SearchResult[]>('/knowledge-search', {
      method: 'POST',
      body: {
        query: input.query,
        ...input.knowledgeBaseIds.length > 0 ? { knowledge_base_ids: input.knowledgeBaseIds } : {},
        ...input.knowledgeIds.length > 0 ? { knowledge_ids: input.knowledgeIds } : {},
      },
    }, signal)
    return Array.isArray(envelope.data) ? envelope.data : []
```

</details>

#### 缺口

- 当前后端响应与存量 API 契约是否一致未独立实测
  **影响**：空集合可能掩盖兼容变化，影响漏检解释
  **进一步探讨**：对空库、权限错误和缺失 data 的固定响应做实际宿主验收，核对错误是否可区分。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用需要承担哪些责任，如何限定试用与退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

已有 WeKnora 部署和可读知识库是效果前提；插件只提供适配，不负责语料质量或向量索引。URL、凭证、可选租户与知识库范围由管理员配置，启动时错误会阻止加载。搜索与读文档可先用 retrieve 权限；ask 还依赖 chat 和服务端模型。虽然不改知识内容，ask 的 POST /sessions 会创建持久会话，超时后用户需要核对服务端状态而非无限重试。现金费用由现有服务、向量检索和额外模型调用决定，人工成本由配置、引用复核和故障处理决定，目前均没有可用金额或耗时测量。建议先禁用 ask，在小范围资料上比较插件检索补读与直接网页流程；合格结果必须定位原文且正确解释截断。发现越出任务范围的结果、持续空结果或引用不符时停止依赖回答，回到平台核对；卸载工具不等于删除服务端会话。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/config.ts:133-190](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/config.ts#L133-L190)

配置校验、范围和工具开关。

<details>
<summary>查看原文（58行）</summary>

```text
export function resolveConfig(raw: Config | undefined): ResolvedConfig {
  const violations: string[] = []
  const config = raw ?? {}
  if (typeof config !== 'object' || Array.isArray(config)) {
    throw new ConfigError(['config must be an object'])
  }

  const baseUrlInput = optionalString(config.baseUrl, 'baseUrl', violations) ?? DEFAULTS.baseUrl
  let baseUrl: string = DEFAULTS.baseUrl
  try {
    const url = new URL(normalizeBaseUrl(baseUrlInput))
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      violations.push(`baseUrl must use http or https, received ${url.protocol}`)
    }
    baseUrl = url.toString().replace(/\/+$/, '')
  } catch {
    violations.push(`baseUrl must be an absolute URL, received ${JSON.stringify(baseUrlInput)}`)
  }

  const resourceUrls = config.resourceUrls ?? DEFAULTS.resourceUrls
  if (resourceUrls !== 'handle' && resourceUrls !== 'public') {
    violations.push(`resourceUrls must be "handle" or "public", received ${JSON.stringify(resourceUrls)}`)
  }

  const toolPrefix = optionalString(config.toolPrefix, 'toolPrefix', violations) ?? DEFAULTS.toolPrefix
  if (!TOOL_PREFIX.test(toolPrefix)) {
    violations.push(`toolPrefix must match ${String(TOOL_PREFIX)}, received ${JSON.stringify(toolPrefix)}`)
  }

  const toolToggles = config.tools ?? {}
  if (typeof toolToggles !== 'object' || Array.isArray(toolToggles)) {
    violations.push('tools must be an object of booleans')
  }

  const resolved: ResolvedConfig = {
    baseUrl,
    apiKey: optionalString(config.apiKey, 'apiKey', violations),
    tenantId: optionalString(config.tenantId, 'tenantId', violations),
    knowledgeBaseIds: stringList(config.knowledgeBaseIds, 'knowledgeBaseIds', violations) ?? [],
    agentId: optionalString(config.agentId, 'agentId', violations),
    maxResults: positiveInt(config.maxResults, 'maxResults', violations) ?? DEFAULTS.maxResults,
    maxChunkChars: positiveInt(config.maxChunkChars, 'maxChunkChars', violations) ?? DEFAULTS.maxChunkChars,
    requestTimeoutMs: positiveInt(config.requestTimeoutMs, 'requestTimeoutMs', violations) ?? DEFAULTS.requestTimeoutMs,
    chatTimeoutMs: positiveInt(config.chatTimeoutMs, 'chatTimeoutMs', violations) ?? DEFAULTS.chatTimeoutMs,
    resourceUrls: resourceUrls === 'public' ? 'public' : 'handle',
    toolPrefix,
    tools: {
      listKnowledgeBases: toggle(toolToggles.listKnowledgeBases, 'tools.listKnowledgeBases', true, violations),
      search: toggle(toolToggles.search, 'tools.search', true, violations),
      readDocument: toggle(toolToggles.readDocument, 'tools.readDocument', true, violations),
      ask: toggle(toolToggles.ask, 'tools.ask', true, violations),
    },
  }

  if (!Object.values(resolved.tools).some(Boolean)) {
    violations.push('at least one tool must stay enabled; remove the plugin row instead of disabling all of them')
  }
  if (violations.length > 0) throw new ConfigError(violations)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/client.ts:122-129](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/client.ts#L122-L129)

API key 与租户由请求头发送。

```text
  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (this.config.apiKey !== undefined) headers['X-API-Key'] = this.config.apiKey
    if (this.config.tenantId !== undefined) headers['X-Tenant-ID'] = this.config.tenantId
    return headers
```

**依据 3 · 源码核查**：[packages/dsh-weknora/src/client.ts:261-270](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/client.ts#L261-L270)

创建会话有服务端状态副作用。

<details>
<summary>查看原文（10行）</summary>

```text
  /** Create a conversation container to hold one or more asked questions. */
  async createSession(title: string, signal: AbortSignal): Promise<string> {
    const envelope = await this.fetchJson<{ id?: string }>('/sessions', {
      method: 'POST',
      body: { title },
    }, signal)
    const id = envelope.data?.id
    if (typeof id !== 'string' || id === '') {
      throw new WeknoraApiError('POST /sessions returned no session id')
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-537](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L518-L537)

ask 会建立会话并运行服务端生成。

<details>
<summary>查看原文（20行）</summary>

```text
      async execute(args, exec): Promise<AskValue> {
        const toolName = name('ask')
        const query = requiredString(args, 'query', toolName)
        const requested = stringArrayArg(args, 'knowledge_base_ids')
        const agentId = optionalStringArg(args, 'agent_id') ?? config.agentId
        // A custom agent resolves its own scope server-side from its
        // KBSelectionMode, and ids sent here would override that as an explicit
        // mention. The RAG pipeline has no such default: it retrieves only what
        // the request names, and answers from nothing when it names nothing.
        const knowledgeBaseIds = agentId === undefined
          ? await resolveScope(requested, [], exec.signal)
          : requested.length > 0 ? requested : config.knowledgeBaseIds
        if (agentId === undefined && knowledgeBaseIds.length === 0) {
          throw new Error(`${toolName}: this WeKnora credential can see no knowledge base, so there is `
            + 'nothing to answer from. Check the deployment\'s API key scope.')
        }
        const webSearch = argRecord(args)['web_search'] === true
        const sessionId = optionalStringArg(args, 'session_id')
          ?? await client.createSession(`dsh: ${clip(query, 60).text}`, exec.signal)
        const streamed = await client.ask({ sessionId, query, knowledgeBaseIds, agentId, webSearch }, exec.signal)
```

</details>

#### 缺口

- 尚无相同任务的总成本与引用正确性对照
  **影响**：只支持受控试用，不能建议持续安装
  **进一步探讨**：使用固定文档题集，计入所有重试、人工核对、服务端会话和模型消耗后比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程改进值得继续验证而不冒充已有贡献？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在当前搜索与补读接口之上增加显式证据预算，当引用覆盖不足才升级 ask，可能减少额外模型调用；同时把 truncated 与 has_more 的组合视为不完整信号，避免把分页结束误认为证据齐全。推导来自片段查询与综合问答分离、以及独立裁剪标志，不意味着插件已有自动路由。最小验证应比较只检索、始终 ask 和预算升级三组，固定知识库、问题、模型与验收人员，并记录引用准确性、漏答、总延迟、重试及模型费用。若升级组降低引用正确性或端到端负担没有下降，则推翻优势；不能仅靠减少调用次数接受假设。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:434-448](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L434-L448)

裁剪标志和分页结果为门控提供候选信号。

<details>
<summary>查看原文（15行）</summary>

```text
        const clipped = clip(joined, config.maxChunkChars * Math.max(1, Math.min(ordered.length, 10)))
        const title = typeof metadata.title === 'string' && metadata.title.trim() !== ''
          ? metadata.title.trim()
          : typeof metadata.file_name === 'string' ? metadata.file_name.trim() : ''
        return {
          knowledge_id: knowledgeId,
          title,
          summary: clip(typeof metadata.description === 'string' ? metadata.description.trim() : '', config.maxChunkChars).text,
          page: result.page,
          page_size: result.pageSize,
          total_chunks: result.total,
          returned_chunks: ordered.length,
          has_more: result.page * result.pageSize < result.total,
          truncated: clipped.truncated,
          content: clipped.text,
```

</details>

**依据 2 · 作者声明**：[packages/dsh-weknora/src/tools.ts:454-462](https://github.com/Tencent/WeKnora/blob/256a3f2966866337f7dc3c5fcc10037f2ae18d52/packages/dsh-weknora/src/tools.ts#L454-L462)

作者明确将综合问答留给跨文档问题。

```text
  if (config.tools.ask) {
    const pipeline = config.agentId === undefined ? 'RAG' : 'agent'
    definitions.push({
      name: name('ask'),
      description: `Ask WeKnora a question and get its own composed answer with citations (${pipeline} pipeline runs `
        + 'server-side: query rewriting, retrieval, reranking and summarization). Reserve it for broad or '
        + 'synthesis questions whose answer spans many documents, where retrieving passages yourself would take '
        + `several rounds. For anything you can answer from specific passages, prefer ${name('search')}: it is far `
        + 'faster and leaves you the evidence to reason over rather than another model\'s conclusion.',
```

#### 缺口

- 证据预算阈值与自动路由尚未实现和验证
  **影响**：不能计为本插件已交付的创新
  **进一步探讨**：先离线标注覆盖是否充分，再设计阈值并以上述对照检验。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
