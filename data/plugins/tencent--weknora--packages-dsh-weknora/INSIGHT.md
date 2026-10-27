# WeKnora DSH 插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e1f9a61](https://github.com/Tencent/WeKnora/tree/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora)

<!-- BEGIN META -->
[![GitHub ★ 35,257](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=35%2C257&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 4,785](https://img.shields.io/static/v1?label=npm+30d&message=4%2C785&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 WeKnora 知识库检索、文档阅读及带引用的问答。

> **亮点**：它把平台检索包装成可继续阅读、可核对引用的 DSH 工具协议，并通过标题补召回和范围过滤减少模型自行拼 API 的负担；检索算法属于 WeKnora 平台。[Q03](#research-q03)

> **主要限制**：ask 会创建会话并触发服务端模型，完全只读仅适用于知识内容；默认全可见库范围也需按任务收窄。[Q02](#research-q02) [Q03](#research-q03)

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程亮点](#detail-section-4)
  - [1.4 使用建议](#detail-section-5)
  - [1.5 核查说明与分析版本](#detail-section-6)
- [2 未来设计假设（未验证）](#detail-section-7)
- [3 辅助信息](#detail-section-8)
- [4 研究问题与完整回答](#detail-section-9)
  - [Q01 · 已有 WeKnora 的团队如何在 DSH 中取得可审查的知识结果？](#detail-section-10)
  - [Q02 · 工具从注册到 REST/SSE 如何运作，默认范围和权限是什么？](#detail-section-11)
  - [Q03 · 检索包装的具体增量能否支撑完全只读的表述？](#detail-section-12)
  - [Q04 · 什么试用范围可控，总成本和效果还缺什么？](#detail-section-13)
  - [Q05 · 哪些接口设计可复用，如何验证按证据充分性升级 ask 的假设？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目标用户是已维护组织知识库、又在 DSH 中处理研发或研究任务的团队。

目标用户是已维护组织知识库、又在 DSH 中处理研发或研究任务的团队。合格结果应包含原始段落、knowledge_id 和可继续阅读的上下文，而非只收到另一模型的结论。原有办法是切换到 WeKnora 网页或手工请求 REST API；插件将检索、全文和综合问答分开，让宿主模型自行决定推理还是委托。该包不提供文档入库、向量索引或 embedding，根平台的知识生产能力不能算作本适配层贡献。

替代基线为直接调用 WeKnora REST、切换平台网页或只检索工作区文件；后两者分别增加应用切换或缺少组织知识范围。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| weknora_list_knowledge_bases | 列出凭证可见知识库以确定范围 | 需 retrieve；不是只显示本任务授权库 |
| weknora_search | 返回排序片段并补充标题匹配文档 | 默认全可见库；片段按 maxChunkChars 截断并标记 |
| weknora_read_document | 按 knowledge_id 分页阅读完整文档上下文 | 需继续处理 has_more，不能将单页当整篇 |
| weknora_ask | 委托 WeKnora RAG 或自定义 Agent 回答并返回引用 | 需 chat，可创建会话并额外调用服务端模型 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| WeKnora 地址与 API key | 必需（无鉴权部署除外） | retrieve 访问检索；ask 另需 chat | 401/403 或无法访问知识 |
| DSH tools 服务 | 必需 | 注册四工具 | 插件无工具入口 |
| knowledgeBaseIds | 可选但敏感场景建议配置 | 固定默认搜索范围 | 为空则使用凭证所有可见库 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认可用 WeKnora，签发 retrieve key 并固定库 ID | 先核对库范围；不需问答时关闭 ask |
| 安装 | 用户 dsh plugin --profile web add @wxg-prc-cpg/dsh-weknora | 配置 URL/key 后加载，错误配置会拒绝加载 |
| 取证 | 模型 search 得到 knowledge_id，再 read_document 补上下文 | 检查 truncated 和 has_more；不足时继续读 |
| 委托与复核 | 必要时 ask 并保留 session_id，用户核对引用 | 失败先检查会话和权限，不盲目重复问答 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 已有后端的服务资源；新增金额未知 | 安装包、配置 URL/key 和库范围；耗时未知 | 不自带入库与 embedding |
| 持续使用 | 搜索后端资源，ask 另用服务端模型；金额未知 | 维护权限、语料并复核引用；频率未知 | 截断可能要求追加全文读取 |
| 失败恢复 | 失败重试与可能重复问答消耗；金额未知 | 检查 403、超时和已建会话；耗时未知 | public 被拒绝可降级 handle；未保证所有错误可重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 搜索证据链 | 命中提供 knowledge_id、段落和截断标志 | 召回率与答案正确率未测 |
| 全文补充 | 文档元信息与分页分块可用于继续阅读 | 分页总延迟和模型上下文成本未测 |
| 委托问答 | SSE 汇总服务端答案、引用及工具记录 | 服务端模型质量、额外消耗与引用正确性未测 |

> **思考**：ask 会创建会话并触发服务端模型，完全只读仅适用于知识内容；默认全可见库范围也需按任务收窄。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把平台检索包装成可继续阅读、可核对引用的 DSH 工具协议，并通过标题补召回和范围过滤减少模型自行拼 API 的负担；检索算法属于 WeKnora 平台。[Q03](#research-q03)

可借鉴的是结构化结果与渲染分离、截断显式化、超时和取消共同约束，以及失败后可重建的知识库范围缓存。移植到别的后端时需重新适配分页、权限及 SSE 事件，不是替换 URL 即可。

<a id="detail-section-5"></a>

### 1.4 使用建议

已有 WeKnora 的团队可先用受限库和 retrieve key 试用搜索、读文档，再决定是否开放 ask；核对会话保存和额外模型消耗。[Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 核查说明与分析版本

**核查状态**：已检查源码。

- 已检查源码，固定提交 [e1f9a616](https://github.com/Tencent/WeKnora/tree/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7)；研究范围为packages/dsh-weknora的入口和本文列出的关键机制。
- 未安装、未运行目标代码或测试，未完成真实宿主与模型任务验收。
- 固定提交的源码级研究，覆盖上述核心入口与机制；不是全项目所有功能的穷尽核查。
- 根项目工程统计按工具现有规则记录 JS/TS 与 Markdown，Go/Rust 后端语义来自列出的人工源码核查，不把这些统计当作全语言 LOC。

<a id="detail-section-7"></a>

## 2 未来设计假设（未验证）

未验证假设是先搜索和全文取证、证据不足才升级 ask，以固定题集的质量、延迟和消耗对照检验，不能当作现有自动路由。[Q05](#research-q05)

<a id="detail-section-8"></a>

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

[![Issue 未关闭 417](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=417&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 322](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=322&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z) [![近30天关闭 250](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=250&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-24T10%3A26%3A52.933Z..2026-10-24T10%3A26%3A52.933Z)



统计日期：2026-10-24。

<a id="detail-section-9"></a>

## 4 研究问题与完整回答

**插件研究总目标**：WeKnora DSH 插件 如何在明确边界内形成可采用能力，且贡献与依赖如何区分？

<a id="research-q01"></a>

<a id="detail-section-10"></a>

### Q01 · 已有 WeKnora 的团队如何在 DSH 中取得可审查的知识结果？

**研究主题**：场景与需求

#### 完整回答

目标用户是已维护组织知识库、又在 DSH 中处理研发或研究任务的团队。合格结果应包含原始段落、knowledge_id 和可继续阅读的上下文，而非只收到另一模型的结论。原有办法是切换到 WeKnora 网页或手工请求 REST API；插件将检索、全文和综合问答分开，让宿主模型自行决定推理还是委托。该包不提供文档入库、向量索引或 embedding，根平台的知识生产能力不能算作本适配层贡献。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README.md:7-14](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/README.md#L7-L14)

作者定位为组织知识访问适配层。

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that gives the harness agent
first-class access to a [WeKnora](https://github.com/Tencent/WeKnora) knowledge base: hybrid retrieval, full document
reading, and WeKnora's own composed answers with citations.

dsh ships no retrieval, embedding or knowledge-base capability of its own — its search tools (`grep`, `glob`) read the
workspace, and `web_search` reads the internet. This plugin fills that gap with your organization's documents.

## Install
```

**依据 2 · 作者声明**：[packages/dsh-weknora/README.md:73-96](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/README.md#L73-L96)

四类工具及检索与委托问答的区别。

<details>
<summary>查看原文（24行）</summary>

```text
## Tools

| Tool | WeKnora endpoint | What the model gets |
|---|---|---|
| `weknora_list_knowledge_bases` | `GET /knowledge-bases` | Knowledge base names and ids, to report what exists or to narrow a later search |
| `weknora_search` | `POST /knowledge-search` + `GET /knowledge/search` | Ranked passages verbatim, each with a `knowledge_id`, score and chunk index, plus any document the query names |
| `weknora_read_document` | `GET /chunks/:knowledge_id` + `GET /knowledge/:id` | One document's passages reassembled in order, led by its title and summary, with paging |
| `weknora_ask` | `POST /sessions` + `POST /knowledge-chat/:id` or `POST /agent-chat/:id` | WeKnora's own answer, its citations, the server-side tools it used, and a resumable `session_id` |

`weknora_search` is the workhorse: it returns the source text for the agent to reason over, which keeps the agent's own
reasoning auditable. It answers two questions the model cannot always tell apart — *where is this discussed* and *where
is the document called X* — by matching passage content and document names in the same call. A query that reads like a
title additionally reports the documents it names, so a document whose wording differs from its own title is still
reachable.

Scope works without configuration. An unscoped call is refused by the retrieval endpoint and answered from nothing by
the RAG one, so when `knowledgeBaseIds` is empty the plugin resolves every knowledge base the credential can see and
uses all of them, resolving that list once per process and sharing it between `weknora_search` and `weknora_ask`.
Making the model choose first would be worse: knowledge bases are frequently named too poorly to choose between.

`weknora_ask` delegates the whole question to WeKnora. Reserve it for broad or synthesis questions spanning many
documents, where retrieving passages yourself would take several rounds — it runs another model server-side, so it is
slow, and it returns a conclusion rather than the evidence behind it. With `agentId` set it leaves the scope alone: a
custom agent resolves its own from its KB selection mode, and ids sent from here would override that.
```

</details>

<a id="research-q02"></a>

<a id="detail-section-11"></a>

### Q02 · 工具从注册到 REST/SSE 如何运作，默认范围和权限是什么？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

apply 验证配置后创建 WeknoraClient，再将 createTools 的定义注册到 ctx.tools。未指定知识库时，搜索和普通 RAG 问答共享一次可见知识库列表解析；失败会清缓存供重试。显式 knowledge_ids 可以进入文档范围。客户端发送 X-API-Key 和可选 X-Tenant-ID，将宿主取消信号与请求超时合并。ask 建立或复用 session_id，再选择 knowledge-chat 或 agent-chat，读取 SSE 汇总答案、引用和服务端工具记录。基础检索需 retrieve 权限，ask 还需 chat。所有可见库的默认范围并不等于最小必要范围，敏感团队应显式配置知识库。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/index.ts:25-37](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/index.ts#L25-L37)

真实注册入口。

<details>
<summary>查看原文（13行）</summary>

```text
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
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:160-193](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/tools.ts#L160-L193)

范围缓存和优先级。

<details>
<summary>查看原文（34行）</summary>

```text
    : ' Searches every knowledge base this credential can see unless you narrow it with knowledge_base_ids.'

  // An unscoped call reaches WeKnora as a refusal on the retrieval route and as
  // an answer grounded in nothing on the RAG route, so an unconfigured
  // deployment resolves the full visible set once and reuses it. Making the
  // model pick a scope first is worse: knowledge bases are often named too
  // poorly to choose between, and fanning out across them is cheap while they
  // share a vector store.
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
  }

  const definitions: ToolDefinition[] = []

  if (config.tools.listKnowledgeBases) {
    definitions.push({
      name: name('list_knowledge_bases'),
      description: 'List the WeKnora knowledge bases this deployment can retrieve from, with their ids. '
        + `${name('search')} already spans them all, so reach for this only to report what is available or to `
        + 'narrow a later search to one of them.',
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/client.ts:262-317](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/client.ts#L262-L317)

会话创建与 SSE 请求。

<details>
<summary>查看原文（56行）</summary>

```text
  async createSession(title: string, signal: AbortSignal): Promise<string> {
    const envelope = await this.fetchJson<{ id?: string }>('/sessions', {
      method: 'POST',
      body: { title },
    }, signal)
    const id = envelope.data?.id
    if (typeof id !== 'string' || id === '') {
      throw new WeknoraApiError('POST /sessions returned no session id')
    }
    return id
  }

  /**
   * Ask a question and assemble the streamed answer. `agentId` selects the
   * ReAct pipeline (`/agent-chat`); without it the RAG pipeline answers
   * (`/knowledge-chat`).
   */
  async ask(
    input: {
      sessionId: string
      query: string
      knowledgeBaseIds: string[]
      agentId: string | undefined
      webSearch: boolean
    },
    signal: AbortSignal,
  ): Promise<StreamedAnswer> {
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
        })
      } catch (cause) {
        throw new WeknoraApiError(`POST ${path} failed: ${describeTransportFailure(cause, signal)}`)
      }
    }
    let response = await open()
    if (!response.ok) {
      const text = await response.text()
      const error = new WeknoraApiError(`POST ${path} failed with HTTP ${response.status}: ${reasonOf(text)}`, response.status)
      if (!this.isPublicModeForbidden(error)) throw error
      this.publicModeBlocked = true
      response = await open()
```

</details>

<a id="research-q03"></a>

<a id="detail-section-12"></a>

### Q03 · 检索包装的具体增量能否支撑完全只读的表述？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

相对直接 API 调用，增量在于同一次搜索结合段落与标题匹配、用 knowledge_id 串起全文阅读，并显式标识截断；它把已有 RAG 能力整理成适合模型多步调用的证据协议，混合检索算法仍来自平台。projectNamedDocuments 对标题结果再次按知识库或文档集合过滤，避免租户级标题查询直接扩大展示范围。README 的 only reads 应限于不改知识内容，不能解释为无持久副作用，因为 ask 会 POST /sessions 并写入会话流程。默认 public 引用可能被服务端策略拒绝，客户端只在特定 403 原因下降级 handle；这意味着图片可展示性依赖权限与可达地址。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:126-159](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/tools.ts#L126-L159)

标题结果的范围过滤。

<details>
<summary>查看原文（34行）</summary>

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
  }
  return out
}

/** Assemble the four tool definitions for one configured deployment. */
export function createTools(client: WeknoraClient, config: ResolvedConfig): ToolDefinition[] {
  const name = (suffix: string): string => `${config.toolPrefix}_${suffix}`
  const scopeNote = config.knowledgeBaseIds.length > 0
    ? ` Searches knowledge base(s) ${config.knowledgeBaseIds.join(', ')} unless you name others.`
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/client.ts:144-164](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/client.ts#L144-L164)

特定 public 403 降级。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/client.ts:262-272](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/client.ts#L262-L272)

ask 的服务端会话副作用。

<details>
<summary>查看原文（11行）</summary>

```text
  async createSession(title: string, signal: AbortSignal): Promise<string> {
    const envelope = await this.fetchJson<{ id?: string }>('/sessions', {
      method: 'POST',
      body: { title },
    }, signal)
    const id = envelope.data?.id
    if (typeof id !== 'string' || id === '') {
      throw new WeknoraApiError('POST /sessions returned no session id')
    }
    return id
  }
```

</details>

<a id="research-q04"></a>

<a id="detail-section-13"></a>

### Q04 · 什么试用范围可控，总成本和效果还缺什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合已有可用 WeKnora、能签发受限 API key 的团队先试用搜索与阅读，再按需要开启 ask。对少量静态文件，工作区搜索或手工引用更简单；为这个适配层单独部署整套平台未必合算。首次成本包含宿主安装配置和权限核对，持续成本包括检索服务、embedding 基础设施及 ask 额外模型调用，金额和耗时取决于部署且未实测。失败恢复需区分超时、权限拒绝、截断及服务端已创建会话，避免无条件重试问答带来重复消耗。效果只能确认有段落和引用传输机制，不能给出回答准确率或节时比例。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README.md:17-35](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/README.md#L17-L35)

安装与环境依赖。

<details>
<summary>查看原文（19行）</summary>

````text
# from npm (recommended: installs prebuilt code, no build permission needed)
dsh plugin --profile web add @wxg-prc-cpg/dsh-weknora

# or from a checkout of this repository
dsh plugin --profile web add ./packages/dsh-weknora
```

Then point it at your deployment. The shipped configuration layer reads environment variables, so the quickest start is:

```sh
export WEKNORA_BASE_URL=https://weknora.example.com   # or http://localhost:8080
export WEKNORA_API_KEY=sk-...                          # a WeKnora API key with `retrieve` (+ `chat` for ask)
export WEKNORA_KNOWLEDGE_BASE_IDS=kb-123,kb-456        # optional default scope
export WEKNORA_RESOURCE_URLS=public                    # default; `handle` keeps internal file refs
dsh web
```

For anything beyond that, override the row from your profile's `cordis.patch.yml`
(`$DSH_HOME/profiles/<name>/cordis.patch.yml`):
````

</details>

**依据 2 · 作者声明**：[packages/dsh-weknora/README.md:91-98](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/README.md#L91-L98)

作者明确 ask 的额外模型与延迟。

```text
Making the model choose first would be worse: knowledge bases are frequently named too poorly to choose between.

`weknora_ask` delegates the whole question to WeKnora. Reserve it for broad or synthesis questions spanning many
documents, where retrieving passages yourself would take several rounds — it runs another model server-side, so it is
slow, and it returns a conclusion rather than the evidence behind it. With `agentId` set it leaves the scope alone: a
custom agent resolves its own from its KB selection mode, and ids sent from here would override that.

`weknora_read_document` exists because retrieval returns fragments: once a passage looks right, the agent usually needs
```

#### 缺口

- 缺少同语料任务的搜索、全文与 ask 对照数据。
  **影响**：不能确定哪类问题值得支付额外问答成本。
  **进一步探讨**：对固定题集记录正确引用率、延迟、模型消耗与人工复核时间。

<a id="research-q05"></a>

<a id="detail-section-14"></a>

### Q05 · 哪些接口设计可复用，如何验证按证据充分性升级 ask 的假设？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是结构化结果与渲染分离、截断显式化、超时和取消共同约束，以及失败后可重建的知识库范围缓存。移植到别的后端时需重新适配分页、权限及 SSE 事件，不是替换 URL 即可。由搜索提供片段、ask 另行调用模型这一分层，推导出未验证假设：先用片段与全文达到证据门槛，只有覆盖不足时才升级 ask，可能减少额外调用同时保留质量。最小对照是在固定题集比较总是 ask、只搜索、门槛升级三组，若门槛组引用质量下降或总延迟更高则推翻优势；这不是当前已实现的自动路由。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/client.ts:111-116](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/client.ts#L111-L116)

取消与超时组合。

```text

export class WeknoraClient {
  /**
   * A knowledge-base-restricted API key rejects `resource_urls=public` with
   * 403. After the first such refusal this client stays on handle mode so
   * later calls do not pay the same round trip.
```

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:110-124](https://github.com/Tencent/WeKnora/blob/e1f9a6166a593a4804a2f99f1d942919c9cc8ea7/packages/dsh-weknora/src/tools.ts#L110-L124)

截断状态随结构化命中返回。

<details>
<summary>查看原文（15行）</summary>

```text
    knowledge_id: typeof result.knowledge_id === 'string' ? result.knowledge_id : '',
    document: documentLabel(result),
    chunk_index: typeof result.chunk_index === 'number' ? result.chunk_index : -1,
    // 0 rather than NaN: the canonical value must stay lossless JSON.
    score: typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0,
    content: clipped.text,
    truncated: clipped.truncated,
  }
}

/**
 * Keep the by-name matches worth showing: inside the scope the caller asked
 * for, and not already represented by a passage hit. WeKnora's by-name search
 * spans the whole tenant, so the scope filter is what stops a narrowed call
 * from reporting documents outside it.
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
