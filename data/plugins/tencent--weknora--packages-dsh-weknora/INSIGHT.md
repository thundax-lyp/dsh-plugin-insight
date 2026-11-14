# WeKnora DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[cbdceba](https://github.com/Tencent/WeKnora/tree/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora)

<!-- BEGIN META -->
[![GitHub ★ 37,399](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37%2C399&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 10,049](https://img.shields.io/static/v1?label=npm+30d&message=10%2C049&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)
<!-- END META -->

> **功能**：为 DeepSeek Harness 提供 WeKnora 知识库检索、文档补读和问答工具。

> **亮点**：[Q01](#research-q01) 把段落、文档补读和服务器综合带进处理同一任务的 Agent，[Q02](#research-q02) 用分页和完整流保留判断依据。

> **主要限制**：[Q03](#research-q03) 的默认库可以被调用覆盖，真实边界取决于凭据和服务；[Q04](#research-q04) 的服务器变化也会改变客户端拿到的材料。

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
  - [Q01 · 已有 WeKnora 的开发者在 DSH 查制度，比网页和裸 API 改变哪一步？](#detail-section-11)
  - [Q02 · 四个工具怎样从注册走到可复核的搜索、补读和 ask？](#detail-section-12)
  - [Q03 · 默认知识库和资源 URL 能否充当授权边界？](#detail-section-13)
  - [Q04 · 连接器树相同，为什么仍需复核服务端检索？](#detail-section-14)
  - [Q05 · 哪些任务值得先试，怎样区分无资料、限制和截断？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 WeKnora 部署的开发者可在 DSH 内核对一条制度并补读来源文档。[Q01](#research-q01)

网页和直接 REST 能完成相同查询，适配器在 DSH 对话内连接段落与文档 ID。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 检索 | 寻找证据段落和文档 | 范围由服务授权决定 |
| 补读 | 分页阅读全文 | 字符上限可裁剪 |
| 问答 | 让 WeKnora 归纳并返回引用 | 要求完整流，可能创建远程会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 工具契约和 Node | 是 | 加载适配器 | 回原工具 |
| 受限 WeKnora 凭据和服务 | 查询需要 | 获取授权材料 | 核对服务归属及授权 |
| chat 权限及服务端模型 | 仅问答 | 远端综合 | 直接检索并人工归纳 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者配置隔离用途和测试库 | 已知文档可复查 |
| 检索 | 开发者在当前会话找段落、补读 | ID、文本、区间都吻合 |
| 退出 | 移除适配层，查有无远端会话 | 按服务侧策略处理已保存材料 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 部署和依赖资源未测 | 核对索引、权限与包 | 基于已有服务器 |
| 持续 | 检索与模型资源未测 | 复查引用 | 按一条合格答案计 |
| 恢复 | 重试和补读用量未知 | 复查授权与对照网页 | 留意远端会话 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 段落复核 | 返回文档 ID 与片段 | 召回和引文质量 |
| 分页 | 内容裁剪与页码反馈 | 模型会否补读完整 |
| 问答 | 无 complete 报错 | 实际任务综合质量 |

> **思考**：[Q03](#research-q03) 的默认库可以被调用覆盖，真实边界取决于凭据和服务；[Q04](#research-q04) 的服务器变化也会改变客户端拿到的材料。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把段落、文档补读和服务器综合带进处理同一任务的 Agent，[Q02](#research-q02) 用分页和完整流保留判断依据。

[Q02](#research-q02) 的分页和 SSE 显式完成条件可复用，同时需验证接口版本及服务端诊断稳定性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 的默认库可以被调用覆盖，真实边界取决于凭据和服务；[Q04](#research-q04) 的服务器变化也会改变客户端拿到的材料。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在隔离配置用受限凭据复核一条规则；越界、引用错误或与网页矛盾时停止并回原文。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源已核查工具接线、服务检索和 SSE 边界。真实授权及版本更新后的检索效果待部署验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weknora/src/index.ts、packages/dsh-weknora/src/tools.ts、packages/dsh-weknora/package.json、packages/dsh-weknora/src/client.ts、internal/router/routes_chat.go、internal/handler/session/qa.go、internal/application/service/session_knowledge_qa.go、internal/application/service/chat_pipeline/search.go、internal/application/service/knowledgebase_search.go、internal/application/service/knowledgebase_search_results.go、packages/dsh-weknora/README_CN.md 及固定范围 inventory；组件：packages/dsh-weknora。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：统计仅覆盖 DSH 子包，定向查看与实际请求相连的服务源码。未运行目标、测试、宿主、模型或服务。
- 下一步：[Q05](#research-q05) 用两库、受限凭据和刻意切断的流对比现有输出与带诊断版本，记录误判及补读次数。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：0.1.0（[固定提交 cbdceba](https://github.com/Tencent/WeKnora/tree/cbdcebabf48c5ee2d6868b370326aa8341703f62)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 提议显示可信的检索诊断、有效范围和输出裁剪，让模型决定该补读还是停止。

[Q05](#research-q05) 用两库、受限凭据和刻意切断的流对比现有输出与带诊断版本，记录误判及补读次数。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 341 | — | — | 3438 |
| .ts | source | 6 | 1311 | 1068 | 151 | — |
| .mjs | test | 8 | 1618 | 1324 | 162 | — |

</details>

**活跃度**

[![Issue 未关闭 542](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=542&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 356](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=356&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 190](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=190&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：现有 WeKnora 用户如何在 DSH 获得可复核的原文，连接器不变时服务端版本会影响什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 WeKnora 的开发者在 DSH 查制度，比网页和裸 API 改变哪一步？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护者在对话中核对一条部署规则时，可以从段落的 knowledge_id 直接补读原文，合格结果要保留正确的库、文档和与代码情境对应的段落。相较打开网页或自行调用 REST，现有任务上下文可直接传给检索工具；索引、排序和综合仍在服务器。单段材料通常可直接复核，有多个文件需要归纳时才考虑让服务再生成答案。已经能在网页完成低频查阅的人增益有限。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/index.ts:22-36](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/index.ts#L22-L36)

注册工具和连接对象

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:243-250](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L243-L250)

原文检索和后续阅读 ID

```text
  if (config.tools.search) {
    definitions.push({
      name: name('search'),
      description: 'Search WeKnora knowledge bases and return the matching passages verbatim (hybrid vector + keyword '
        + 'retrieval, no model summarization). Use this to ground an answer in the organization\'s own documents, and '
        + 'also to locate a document by name — a query that reads like a title additionally returns the documents it '
        + 'names.' + scopeNote
        + ` Every hit carries a knowledge_id you can pass to ${name('read_document')} for the full document.`,
```

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:454-462](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L454-L462)

区分段落与远端综合

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

- 同问题切换成本未知
  **影响**：无法量化交接增益
  **进一步探讨**：固定原文、主问题和服务，比较网页与 DSH 至合格答案的耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 四个工具怎样从注册走到可复核的搜索、补读和 ask？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

补丁安装包名，manifest 的 dist/index.js 从 src 构建。apply 解析配置并通过 ctx.tools 注册启用的工具。list 调远端列库；search 并发查段落和题名，题名失败仍传段落，按条数和字符裁剪并提示截断。read_document 依 ID 取块，在首页另取元数据，按 chunk_index 排序并标注更多和截断，元数据失效仍可返回正文。ask 按调用传入或新建一个远端会话，指定 agent_id 选择 agent-chat，否则走 knowledge-chat，显式 web_search 才传 true。流解析汇集引文、文本、工具名和会话 ID。收到 error 或没有 complete 会报错，即使收过文字也不当成功。complete 也可能没有引文或引文被取前 N 条，仍须针对关键主张补查原文。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/package.json:30-59](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/package.json#L30-L59)

发布物的构建和挂载入口

<details>
<summary>查看原文（30行）</summary>

```text
  "type": "module",
  "main": "./dist/index.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "default": "./dist/index.js"
    },
    "./package.json": "./package.json"
  },
  "files": [
    "dist",
    "cordis.patch.yml",
    "README.md",
    "README_CN.md"
  ],
  "engines": {
    "node": ">=20.11"
  },
  "scripts": {
    "build": "tsc -p tsconfig.build.json",
    "prepare": "npm run build",
    "typecheck": "tsc -p tsconfig.json --noEmit",
    "test": "npm run build && node --test \"test/*.test.mjs\"",
    "e2e": "node test/e2e/run-in-dsh.mjs"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/index.ts:14-35](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/index.ts#L14-L35)

真实注册

<details>
<summary>查看原文（22行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:329-358](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L329-L358)

并发检索及题名降级

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:401-449](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L401-L449)

分块及裁剪

<details>
<summary>查看原文（49行）</summary>

```text
        render: (_args, value) => {
          const result = value as DocumentValue
          const label = result.title === '' ? result.knowledge_id : `${result.title} (${result.knowledge_id})`
          if (result.returned_chunks === 0) {
            return text(`Document ${label} has no passage on page ${result.page} `
              + `(${result.total_chunks} passage(s) in total).`)
          }
          // The summary lets the model judge a long document from page 1
          // instead of paging blindly to find out what it is holding.
          const summary = result.summary === '' ? '' : `\n\nSummary: ${result.summary}`
          const more = result.has_more ? `\n\n(more passages available: request page ${result.page + 1})` : ''
          const cut = result.truncated ? '\n(content truncated)' : ''
          return text(`Document ${label}, passages ${result.returned_chunks} of ${result.total_chunks} `
            + `(page ${result.page}):${summary}\n\n${result.content}${cut}${more}`)
        },
      },
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

**依据 5 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-548](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L518-L548)

会话和引文限制

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

**依据 6 · 源码核查**：[packages/dsh-weknora/src/client.ts:279-326](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L279-L326)

请求路由及处理

<details>
<summary>查看原文（48行）</summary>

```text
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
    }
    if (!response.ok) {
      const text = await response.text()
      throw new WeknoraApiError(`POST ${path} failed with HTTP ${response.status}: ${reasonOf(text)}`, response.status)
    }
    if (response.body === null) {
      throw new WeknoraApiError(`POST ${path} returned no response body`)
    }
    return await assembleStream(response.body, input.sessionId, path, signal)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-weknora/src/client.ts:369-432](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L369-L432)

流完整性和错误处理

<details>
<summary>查看原文（64行）</summary>

```text
  const consumeLine = (line: string): void => {
    if (!line.startsWith('data:')) return
    const payload = line.slice(5).trim()
    if (payload === '' || payload === '[DONE]') return
    let event: StreamEvent
    try {
      event = JSON.parse(payload) as StreamEvent
    } catch {
      return
    }
    if (typeof event.session_id === 'string' && event.session_id !== '') resolvedSessionId = event.session_id
    switch (event.response_type) {
      case 'answer':
        if (typeof event.content === 'string') answer.push(event.content)
        break
      case 'references':
        if (Array.isArray(event.knowledge_references)) references = event.knowledge_references
        break
      case 'tool_call':
        for (const call of event.tool_calls ?? []) {
          const name = call.function?.name ?? call.name
          if (typeof name === 'string' && name !== '' && !toolCalls.includes(name)) toolCalls.push(name)
        }
        break
      case 'error':
        throw new WeknoraApiError(`POST ${path} streamed an error: ${event.content ?? 'unknown error'}`)
      case 'complete':
        completed = true
        break
      default:
        break
    }
  }

  try {
    while (!completed) {
      const { done, value } = await reader.read()
      if (done) break
      buffer += decoder.decode(value, { stream: true })
      let newline = buffer.indexOf('\n')
      while (newline >= 0) {
        consumeLine(buffer.slice(0, newline).replace(/\r$/, ''))
        buffer = buffer.slice(newline + 1)
        if (completed) break
        newline = buffer.indexOf('\n')
      }
    }
    if (!completed && buffer !== '') consumeLine(buffer.replace(/\r$/, ''))
  } catch (cause) {
    if (cause instanceof WeknoraApiError) throw cause
    throw new WeknoraApiError(`POST ${path} stream failed: ${describeTransportFailure(cause, callerSignal)}`)
  } finally {
    await reader.cancel().catch(() => undefined)
  }

  // WeKnora ends every answer with a `complete` event. Without it the stream was
  // cut short, and handing the model the partial text would present a truncated
  // answer as a whole one.
  if (!completed) {
    throw new WeknoraApiError(`POST ${path} ended before WeKnora completed the answer; `
      + `${answer.join('').length} character(s) had streamed`)
  }

  return { answer: answer.join(''), references, sessionId: resolvedSessionId, toolCalls }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认知识库和资源 URL 能否充当授权边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

库参数可覆盖配置默认值，缺少库和文档 ID 时列出该凭据可见的库，成功结果在注册实例缓存；标题检索的出站请求缺少默认库参数，按文档 ID 的补读也不经默认库过滤。自定义 Agent 在没有明确配置与工具范围时由服务选择范围。权限依赖 WeKnora 侧 key、租户和文档授权，检索与聊天的路由有不同准入。精确到 public 资源模式的 403 会改用 handle 重发，实例随后保留 handle；普通 403 不走该分支。标题或元数据失败以及某些非数组 data 可产生空结果。要排除权限与响应结构问题，先通过受限凭据和服务审计验证实际请求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:158-183](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L158-L183)

范围顺序和可见库缓存

<details>
<summary>查看原文（26行）</summary>

```text
  const scopeNote = config.knowledgeBaseIds.length > 0
    ? ` Searches knowledge base(s) ${config.knowledgeBaseIds.join(', ')} unless you name others.`
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:329-357](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L329-L357)

题名请求不含库参数且结果再过滤

<details>
<summary>查看原文（29行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-430](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L417-L430)

按文档 ID 读块

<details>
<summary>查看原文（14行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:521-537](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L521-L537)

Agent 范围和会话

<details>
<summary>查看原文（17行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:122-191](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L122-L191)

凭据头和精确 403 回退

<details>
<summary>查看原文（70行）</summary>

```text
  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (this.config.apiKey !== undefined) headers['X-API-Key'] = this.config.apiKey
    if (this.config.tenantId !== undefined) headers['X-Tenant-ID'] = this.config.tenantId
    return headers
  }

  private resourceMode(): 'handle' | 'public' {
    return this.config.resourceUrls === 'public' && !this.publicModeBlocked ? 'public' : 'handle'
  }

  private url(path: string, query?: Record<string, string | number | undefined>): string {
    const url = new URL(`${this.config.baseUrl}${path}`)
    for (const [key, value] of Object.entries(query ?? {})) {
      if (value !== undefined) url.searchParams.set(key, String(value))
    }
    if (this.resourceMode() === 'public') url.searchParams.set('resource_urls', 'public')
    return url.toString()
  }

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
```

</details>

**依据 6 · 源码核查**：[packages/dsh-weknora/src/client.ts:195-240](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L195-L240)

查段落与标题的响应处理

<details>
<summary>查看原文（46行）</summary>

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
  }

  /**
   * Find documents by title or filename. Unlike `search` this spans every
   * knowledge base the credential can see and needs no scope, so it is what
   * answers "where is the document called X".
   */
  async findDocuments(
    input: { keyword: string, limit: number },
    signal: AbortSignal,
  ): Promise<DocumentRecord[]> {
    const envelope = await this.fetchJson<DocumentRecord[]>('/knowledge/search', {
      method: 'GET',
      query: { keyword: input.keyword, limit: input.limit },
    }, signal)
    return Array.isArray(envelope.data) ? envelope.data : []
  }

  /** A document's metadata, including the generated summary WeKnora stores as `description`. */
  async getDocument(knowledgeId: string, signal: AbortSignal): Promise<DocumentRecord> {
    const envelope = await this.fetchJson<DocumentRecord>(
      `/knowledge/${encodeURIComponent(knowledgeId)}`,
      { method: 'GET' },
      signal,
    )
    return envelope.data ?? {}
```

</details>

**依据 7 · 源码核查**：[internal/router/routes_chat.go:147-165](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/router/routes_chat.go#L147-L165)

服务区分检索和聊天授权

<details>
<summary>查看原文（19行）</summary>

```text
func RegisterChatRoutes(r *gin.RouterGroup, handler *session.Handler, g *rbacGuards) {
	// These POST routes append messages and run generation, so a scoped key
	// needs the explicit chat capability unless it has full tenant access.
	knowledgeChat := g.apiKeyGroup(r.Group("/knowledge-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		knowledgeChat.POST("/:session_id", handler.KnowledgeQA)
	}

	// Agent-based chat
	agentChat := g.apiKeyGroup(r.Group("/agent-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		agentChat.POST("/:session_id", handler.AgentQA)
	}

	// 新增知识检索接口，不需要session_id
	knowledgeSearch := g.apiKeyGroup(r.Group("/knowledge-search", g.Viewer()), apiKeyRetrieve(apiKeyFullAccess()))
	{
		knowledgeSearch.POST("", handler.SearchKnowledge)
	}
```

</details>

#### 缺口

- 现场凭据范围未经实测
  **影响**：配置默认值不能证明项目授权
  **进一步探讨**：用两库、受限 Key 和越界 ID 分别测试检索、补读和问答

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连接器树相同，为什么仍需复核服务端检索？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

最后完成 e3fb2335bf3f8cadd32142380c60b2677a27bf99 和本次 cbdcebabf48c5ee2d6868b370326aa8341703f62 的子树均为 a2b3e5c1e2051e7bef900f2ac1d090298c540abf，仍为 0.1.0。目标服务器是独立部署。当前 POST /knowledge-search 对应 SearchKnowledge，服务触发搜索、重排、合并和 top-K，向量及关键词实现调用 HybridSearch。旧版先截断到候选上限再装配，目前从有限原始候选池批量取知识对象，先排除不存在或解析取消的对象，再选主命中槽位，避免取消对象挤占候选或用于丰富。客户端读 data，未投影服务器返回的 meta，调用方不能区分缺候选和重排无命中。另有 KnowledgeQA 在未配置 rerank 时尝试解析可用的默认模型，实际排序还取决于服务端部署；这一行不能证明 agent-chat 同样生效。父仓文档解析变更可能间接改变重新入库的内容，未逐项核实部署中的解析结果。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/client.ts:201-215](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L201-L215)

客户端解析段落 data

<details>
<summary>查看原文（15行）</summary>

```text
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
  }
```

</details>

**依据 2 · 源码核查**：[internal/router/routes_chat.go:147-165](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/router/routes_chat.go#L147-L165)

路由绑定

<details>
<summary>查看原文（19行）</summary>

```text
func RegisterChatRoutes(r *gin.RouterGroup, handler *session.Handler, g *rbacGuards) {
	// These POST routes append messages and run generation, so a scoped key
	// needs the explicit chat capability unless it has full tenant access.
	knowledgeChat := g.apiKeyGroup(r.Group("/knowledge-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		knowledgeChat.POST("/:session_id", handler.KnowledgeQA)
	}

	// Agent-based chat
	agentChat := g.apiKeyGroup(r.Group("/agent-chat", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		agentChat.POST("/:session_id", handler.AgentQA)
	}

	// 新增知识检索接口，不需要session_id
	knowledgeSearch := g.apiKeyGroup(r.Group("/knowledge-search", g.Viewer()), apiKeyRetrieve(apiKeyFullAccess()))
	{
		knowledgeSearch.POST("", handler.SearchKnowledge)
	}
```

</details>

**依据 3 · 源码核查**：[internal/handler/session/qa.go:1014-1034](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/handler/session/qa.go#L1014-L1034)

服务查询响应带 meta

<details>
<summary>查看原文（21行）</summary>

```text
	// Directly call knowledge retrieval service without LLM summarization
	retrieval, err := h.sessionService.SearchKnowledge(
		ctx, knowledgeBaseIDs, request.KnowledgeIDs, tagScopes, request.Query, opts,
	)
	if err != nil {
		// Typed AppErrors (e.g. an unknown rerank model_id) keep their code.
		if appErr, ok := errors.IsAppError(err); ok {
			_ = c.Error(appErr)
			return
		}
		logger.ErrorWithFields(ctx, err, nil)
		c.Error(errors.NewInternalServerError(err.Error()))
		return
	}

	logger.Infof(ctx, "Knowledge search completed, found %d results", len(retrieval.Results))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rewriter.CopyReferences(ctx, retrieval.Results),
		"meta":    retrieval.Meta,
	})
```

</details>

**依据 4 · 源码核查**：[internal/application/service/session_knowledge_qa.go:973-992](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/application/service/session_knowledge_qa.go#L973-L992)

搜索事件链

<details>
<summary>查看原文（20行）</summary>

```text
// runKnowledgeSearchPipeline runs the retrieval-only pipeline stages and
// returns the merged results. An empty search or an all-rejecting rerank is
// an empty result, not an error.
func (s *sessionService) runKnowledgeSearchPipeline(
	ctx context.Context,
	chatManage *types.ChatManage,
	targetCount int,
) ([]*types.SearchResult, error) {
	if targetCount == 0 {
		logger.Warn(ctx, "No search targets available, returning empty results")
		return []*types.SearchResult{}, nil
	}

	// Use specific event list, only including retrieval-related events, not LLM summarization
	searchEvents := []types.EventType{
		types.CHUNK_SEARCH, // Vector search
		types.CHUNK_RERANK, // Rerank search results
		types.CHUNK_MERGE,  // Merge search results
		types.FILTER_TOP_K, // Filter top K results
	}
```

</details>

**依据 5 · 源码核查**：[internal/application/service/chat_pipeline/search.go:581-605](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/application/service/chat_pipeline/search.go#L581-L605)

对跨库候选调用 HybridSearch

<details>
<summary>查看原文（25行）</summary>

```text
			// Combined search: one HybridSearch call spanning all full-KB targets
			if len(fullKBIDs) > 0 {
				innerWg.Add(1)
				go func() {
					defer innerWg.Done()

					params := types.SearchParams{
						QueryText:             queryText,
						QueryEmbedding:        queryEmbedding,
						KnowledgeBaseIDs:      fullKBIDs,
						VectorThreshold:       chatManage.VectorThreshold,
						KeywordThreshold:      chatManage.KeywordThreshold,
						MatchCount:            chatManage.EmbeddingTopK,
						SkipContextEnrichment: true,
						DisableVectorMatch:    disableVector,
						DisableKeywordsMatch:  chatManage.DisableKeywordsMatch,
					}
					res, err := p.knowledgeBaseService.HybridSearch(ctx, fullKBIDs[0], params)
					if err != nil {
						pipelineWarn(ctx, "Search", "combined_kb_search_error", map[string]interface{}{
							"kb_ids": fullKBIDs,
							"error":  err.Error(),
						})
						recordError(err)
						return
```

</details>

**依据 6 · 源码核查**：[internal/application/service/knowledgebase_search.go:183-200](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/application/service/knowledgebase_search.go#L183-L200)

把上限交给候选组装

<details>
<summary>查看原文（18行）</summary>

```text
func (s *knowledgeBaseService) HybridSearch(ctx context.Context,
	id string,
	params types.SearchParams,
) ([]*types.SearchResult, error) {
	// Normalize once, before anything reads MatchCount. params is a value
	// copy, so this stays local to the call.
	params.MatchCount = normalizedMatchCount(params.MatchCount)

	chunks, err := s.hybridSearchCandidates(ctx, id, params)
	if err != nil || len(chunks) == 0 {
		return nil, err
	}

	recordImageRecallDecision(ctx, "fusion.candidate_selection", "",
		summarizeImageCandidateCut(chunks, params.MatchCount))

	return s.processSearchResults(ctx, chunks, params.MatchCount, params.SkipContextEnrichment)
}
```

</details>

**依据 7 · 源码核查**：[internal/application/service/knowledgebase_search_results.go:25-60](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/application/service/knowledgebase_search_results.go#L25-L60)

先过滤再限量

<details>
<summary>查看原文（36行）</summary>

```text
	chunks = chunks[:min(len(chunks), maxRetrievalPoolSize)]
	knowledgeIDs := make([]string, 0, len(chunks))
	seenKnowledge := make(map[string]bool, len(chunks))
	for _, chunk := range chunks {
		if !seenKnowledge[chunk.KnowledgeID] {
			knowledgeIDs = append(knowledgeIDs, chunk.KnowledgeID)
			seenKnowledge[chunk.KnowledgeID] = true
		}
	}

	// Batch fetch knowledge data (include shared KB so cross-tenant retrieval works)
	logger.Infof(ctx, "Fetching knowledge data for %d IDs", len(knowledgeIDs))
	knowledgeMap, err := s.fetchKnowledgeDataWithShared(ctx, tenantID, knowledgeIDs)
	if err != nil {
		return nil, err
	}

	// Cancellation preserves partial index data for a later retry. Exclude
	// those hits before they can take a result slot or supply enrichment.
	selected := make([]*types.IndexWithScore, 0, min(primaryLimit, len(chunks)))
	selectedKnowledge := make(map[string]*types.Knowledge)
	for _, chunk := range chunks {
		knowledge := knowledgeMap[chunk.KnowledgeID]
		if knowledge == nil || knowledge.ParseStatus == types.ParseStatusCancelled {
			continue
		}
		selected = append(selected, chunk)
		selectedKnowledge[knowledge.ID] = knowledge
		if len(selected) == primaryLimit {
			break
		}
	}
	if len(selected) == 0 {
		return nil, nil
	}
	index := s.buildChunkIndex(selected)
```

</details>

**依据 8 · 源码核查**：[internal/application/service/session_knowledge_qa.go:179-186](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/application/service/session_knowledge_qa.go#L179-L186)

RAG 默认重排模型解析

```text
	applyRequestReasoningEffort(
		req.ReasoningEffort, &chatManage.SummaryConfig.Thinking, &chatManage.SummaryConfig.ReasoningEffort,
	)

	// Fill the rerank model the same way the retrieval API path does when the
	// overrides left it empty (issue #1800): the rerank stage otherwise skips
	// with "empty_model_id" and the answer goes out in raw retrieval order.
	chatManage.RerankModelID = s.resolveKnowledgeQARerankModel(ctx, chatManage.RerankModelID)
```

#### 缺口

- 部署提交、索引与 rerank 配置未知
  **影响**：无法推出现场搜索排序改善
  **进一步探讨**：固定客户端和索引样本，对比新旧服务的过滤、meta 和返回段落

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些任务值得先试，怎样区分无资料、限制和截断？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

已有部署的开发者可用仅 retrieve 的凭据在隔离 profile 查一条已知制度，并按页验证。首次工作是核对宿主、服务、租户和测试文档；持续工作是确认可见范围、复核段落及归纳；出错需回到网页或原文，核对 Key 后移除测试插件。ask 对话可能在服务端保留，移除适配层不会删除远程会话。按一次合格制度答复分别记录现金、机器资源和人工，纳入失败重试。可试验在工具结果中加入服务诊断、有效范围、裁剪信号，让模型决定何时翻页或拒绝无证据归纳。在已知无资料、受限、SSE 断流和文本截断的固定场景比较现有输出和新诊断。若服务无可靠诊断或操作者并未减少错误，就继续用原文对证。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README_CN.md:117-130](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/README_CN.md#L117-L130)

服务、范围和超时设置

<details>
<summary>查看原文（14行）</summary>

```text
| 字段 | 默认值 | 说明 |
|---|---|---|
| `baseUrl` | `http://localhost:8080/api/v1` | 缺少 `/api/v1` 时自动补全 |
| `apiKey` | 未设置 | `X-API-Key`；不设表示部署无鉴权 |
| `tenantId` | 未设置 | `X-Tenant-ID`，平台级 Key 必填 |
| `knowledgeBaseIds` | `[]` | 调用未指定范围时的默认值；留空表示检索该凭据可见的全部知识库 |
| `agentId` | 未设置 | 让 `weknora_ask` 走 ReAct 流水线 |
| `maxResults` | `8` | 同时是 `max_results` 与引用条数的上限 |
| `maxChunkChars` | `1200` | 单个片段的字符预算 |
| `requestTimeoutMs` | `30000` | 检索与读文档 |
| `chatTimeoutMs` | `300000` | `weknora_ask`，要等 WeKnora 自己的模型调用 |
| `resourceUrls` | `public` | `public` 返回可直接加载的文件直链；`handle` 保留内部 `resource://` 引用。限定知识库的 API Key 会自动回退到 `handle`。可用 `WEKNORA_RESOURCE_URLS` 覆盖。 |
| `toolPrefix` | `weknora` | 工具名前缀，需匹配 `^[a-z][a-z0-9_]*$` |
| `tools.*` | 全部 `true` | 少注册几个工具就少占几分 prompt |
```

</details>

**依据 2 · 作者声明**：[packages/dsh-weknora/README_CN.md:156-160](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/README_CN.md#L156-L160)

作者兼容范围

```text
## 兼容性

已针对 dsh `0.1.0-rc.8` 与 WeKnora `0.8.0` 验证。dsh 处于 developer preview 并明确会有破坏性变更；本包因此**没有任何运行
时依赖**，交给 `ctx.tools.register()` 的只是一个普通对象，不锁定任何 harness 包版本。如果 harness 的工具定义契约发生变化，
请在本仓库提 issue。
```

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-548](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/tools.ts#L518-L548)

远程会话与引用限制

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/client.ts:424-432](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/packages/dsh-weknora/src/client.ts#L424-L432)

截断不返回成功

```text
  // WeKnora ends every answer with a `complete` event. Without it the stream was
  // cut short, and handing the model the partial text would present a truncated
  // answer as a whole one.
  if (!completed) {
    throw new WeknoraApiError(`POST ${path} ended before WeKnora completed the answer; `
      + `${answer.join('').length} character(s) had streamed`)
  }

  return { answer: answer.join(''), references, sessionId: resolvedSessionId, toolCalls }
```

**依据 5 · 源码核查**：[internal/handler/session/qa.go:1029-1034](https://github.com/Tencent/WeKnora/blob/cbdcebabf48c5ee2d6868b370326aa8341703f62/internal/handler/session/qa.go#L1029-L1034)

服务端诊断字段入口

```text
	logger.Infof(ctx, "Knowledge search completed, found %d results", len(retrieval.Results))
	c.JSON(http.StatusOK, gin.H{
		"success": true,
		"data":    rewriter.CopyReferences(ctx, retrieval.Results),
		"meta":    retrieval.Meta,
	})
```

#### 缺口

- 没有现场成本或增加诊断后的实测
  **影响**：不能认定能减少补读或改善引用
  **进一步探讨**：用相同的制度和凭据测试错误率、补读次数和实际资源

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
