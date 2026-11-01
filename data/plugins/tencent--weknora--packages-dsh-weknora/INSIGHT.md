# WeKnora DSH 插件

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[80e8345](https://github.com/Tencent/WeKnora/tree/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora)

<!-- BEGIN META -->
[![GitHub ★ 36,141](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C141&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 5,698](https://img.shields.io/static/v1?label=npm+30d&message=5%2C698&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)
<!-- END META -->

> **功能**：为 DSH 提供 WeKnora 知识库检索、文档补读与综合问答工具。

> **亮点**：把服务端检索、文档补读和综合问答接成可组合的 DSH 工具，保留文档定位和部分截断信息；检索算法及索引能力归根服务。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：默认库不是白名单，缓存和降级空结果可能使范围或证据不清；分页结束不代表无裁剪，ask 还会写服务端会话。[Q03](#research-q03)

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
  - [Q01 · 谁需要适配器，和根服务及直接 API 有何区别？](#detail-section-11)
  - [Q02 · 如何从注册、配置到 HTTP 与工具结果？](#detail-section-12)
  - [Q03 · 默认范围、缓存、分页、错误与写操作有哪些限制？](#detail-section-13)
  - [Q04 · 部署与退出要付出什么，何时停止？](#detail-section-14)
  - [Q05 · 哪个未验证改进值得和现有能力比较？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已维护 WeKnora 知识库的用户希望在 DSH 中检索资料并补读原文，减少在服务网页和宿主之间手动搬运。[Q01](#research-q01)

直接使用 WeKnora 网页或 API 能完成类似任务；适配器组织宿主工具与结果投影，根服务负责检索和模型。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 搜索 | 输出命中及文档 ID | 默认范围不是授权白名单 |
| 补读 | 按页拼接文档片段 | has_more 和 truncated 分别检查 |
| ask | 获取服务端综合回答 | 会写会话；引用可能裁剪 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 与 Node | 插件必需 | 注册工具 | 无法假定可加载 |
| WeKnora 与受限 API key | 必需 | 请求知识库 | 回退网页或直接 API |
| chat 权限和模型 | ask 需要 | 服务端综合问答 | 保持 ask 关闭 |
| 知识库权限与原文 | 业务需要 | 防止越权并核对证据 | 不接入敏感资料 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
| --- | --- | --- |
| 准备 | 确认服务版本及受限凭据，禁用 ask | 非敏感库与权限一致 |
| 检索 | 输入固定问题并核对库范围和片段 | 空结果先核服务状态 |
| 补读 | 依据文档 ID 分页并检查 truncated | 被裁剪时回原文 |
| 综合 | 仅必要时启用 ask 并核对引用 | 失败先核服务会话，不盲目重放 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 服务、索引和模型资源未知 | 安装配置、权限核验 | 宿主及服务兼容未测 |
| 持续 | 请求、模型和存储费用未知 | 维护语料并核对引用 | 总节时未知 |
| 恢复 | 重试及会话成本未知 | 检查服务端状态和范围 | 取消不能撤销副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 检索补读 | 适配层投影文档 ID 和部分裁剪状态 | 实际召回与引用质量 |
| 服务端回答 | 创建会话并解析流结束 | 成本、答案正确与外部动作 |

> **思考**：默认库不是白名单，缓存和降级空结果可能使范围或证据不清；分页结束不代表无裁剪，ask 还会写服务端会话。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把服务端检索、文档补读和综合问答接成可组合的 DSH 工具，保留文档定位和部分截断信息；检索算法及索引能力归根服务。[Q01](#research-q01) [Q02](#research-q02)

工具注册与 HTTP 客户端分离，搜索及补读保留部分裁剪标志，SSE 缺 complete 明确报错；成功范围缓存无 TTL，ask 引文未附逐条裁剪状态。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

默认库不是白名单，缓存和降级空结果可能使范围或证据不清；分页结束不代表无裁剪，ask 还会写服务端会话。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先以受限 API key 和匿名资料关闭 ask 试验检索与补读；核对库范围、原文和裁剪，异常时停用工具并回平台。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持适配器工具、HTTP、流结束及裁剪代表路径；固定宿主、目标服务及效果未运行；引用提示为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weknora/README.md、packages/dsh-weknora/package.json、packages/dsh-weknora/src/index.ts、packages/dsh-weknora/src/config.ts、packages/dsh-weknora/src/client.ts、packages/dsh-weknora/src/tools.ts、internal/application/service/knowledgebase_search.go 及固定范围 inventory；组件：packages/dsh-weknora。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件根 packages/dsh-weknora 的完整指定扩展名 inventory；抽读 package、README、注册、配置、客户端及工具，根服务仅用于同提交授权边界参考；未运行目标、宿主或服务。
- 下一步：固定 DSH 与 WeKnora 服务，在隔离环境测范围扩张、权限撤销、空 data、分页裁剪、流中断及会话状态，比较网页与 API。

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：0.1.0（[固定提交 80e8345](https://github.com/Tencent/WeKnora/tree/80e8345903ce4af970497de8359b8b4ea4ce4917)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设为 ask 引用补充逐条裁剪标志与补读提示，可减少片段被当成完整证据的误判；对照现有 search/read 标志及人工补读，测错误、token 和时间，收益不足则否定。[Q05](#research-q05)

固定 DSH 与 WeKnora 服务，在隔离环境测范围扩张、权限撤销、空 data、分页裁剪、流中断及会话状态，比较网页与 API。

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

[![Issue 未关闭 423](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=423&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 311](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=311&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z) [![近30天关闭 237](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=237&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T08%3A13%3A08.475Z..2026-11-01T08%3A13%3A08.475Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 适配器如何接入 WeKnora 检索、补读及问答，范围、完整性和副作用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要适配器，和根服务及直接 API 有何区别？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

该组件是 WeKnora 仓库内的 DSH 插件，面向已拥有或可部署 WeKnora 服务、希望在 DSH 会话中检索组织资料的用户；它注册工具而不部署知识平台。相对直接打开 WeKnora 网页或手写 HTTP 请求，它把搜索片段、补读和服务端综合问答投影为模型工具并传递文档 ID；检索、索引和模型能力归根服务，不是该适配器发明。根服务在同一固定提交的候选层对库逐一授权并检验模型空间，但实际目标服务可能运行别的版本或配置，不能视为端到端验证。所节约时间与回答质量未知。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README.md:5-12](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/README.md#L5-L12)

作者描述 DSH 插件用途及 WeKnora 依赖。

```text
[npm](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)

A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that gives the harness agent
first-class access to a [WeKnora](https://github.com/Tencent/WeKnora) knowledge base: hybrid retrieval, full document
reading, and WeKnora's own composed answers with citations.

dsh ships no retrieval, embedding or knowledge-base capability of its own — its search tools (`grep`, `glob`) read the
workspace, and `web_search` reads the internet. This plugin fills that gap with your organization's documents.
```

**依据 2 · 源码核查**：[packages/dsh-weknora/package.json:19-25](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/package.json#L19-L25)

npm 子包与仓库目录。

```text
  "license": "MIT",
  "author": "WeKnora",
  "homepage": "https://github.com/Tencent/WeKnora/tree/main/packages/dsh-weknora",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Tencent/WeKnora.git",
    "directory": "packages/dsh-weknora"
```

**依据 3 · 源码核查**：[packages/dsh-weknora/package.json:30-47](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/package.json#L30-L47)

构建入口、包文件及 Node。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[internal/application/service/knowledgebase_search.go:230-262](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/internal/application/service/knowledgebase_search.go#L230-L262)

同提交根平台候选层逐库授权及模型空间校验。

<details>
<summary>查看原文（33行）</summary>

```text
	// Batch-load every KB in scope. Required for store grouping,
	// embedding-model consistency validation, and FAQ type detection.
	// GetKnowledgeBaseByIDs is intentionally tenant-agnostic at the
	// repository layer so that Organization-shared KBs (owned by a
	// different tenant) can be loaded here; authorization for each
	// returned row is enforced explicitly below.
	kbs, err := s.repo.GetKnowledgeBaseByIDs(ctx, searchKBIDs)
	if err != nil {
		logger.ErrorWithFields(ctx, err, map[string]interface{}{
			"knowledge_base_ids": searchKBIDs,
		})
		return nil, err
	}
	if len(kbs) == 0 {
		return nil, apperrors.NewNotFoundError("knowledge base not found")
	}

	// Authorize every KB for the original caller, using exact upstream
	// grants or organization permissions. Execution in a shared tenant
	// does not grant access to its other KBs. Without this guard, a
	// caller could pass arbitrary KB UUIDs in params.KnowledgeBaseIDs
	// and reach foreign tenants' bound vector stores via the per-group
	// engine resolution downstream.
	if err := s.authorizeKBAccess(ctx, kbs); err != nil {
		return nil, err
	}

	// Explicit embedding-model consistency check. Multi-KB searches that
	// span different embedding spaces would otherwise silently produce
	// meaningless cross-model scores. Same-model wiki/graph KBs are
	// tolerated — see validateSameEmbeddingModel for the carve-out.
	if err := s.validateSameEmbeddingModel(ctx, kbs); err != nil {
		return nil, err
```

</details>

#### 缺口

- 实际部署服务版本、宿主及对照任务未核验
  **影响**：不能将同仓源码当作目标部署或净收益证明
  **进一步探讨**：固定双方版本及权限，在隔离语料比较网页、API 和插件

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何从注册、配置到 HTTP 与工具结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

插件 apply 解析配置、创建客户端并按开关把工具注册到 DSH；搜索以显式 ID、配置默认值或缓存的可见库解析范围，并并行请求正文检索及可选的文档标题检索。正文命中投影包含文档与 chunk ID、排序、分数和截断标志；标题检索失败被吞并为无标题命中，正文仍可能成功。HTTP 调用携带 API key/租户头，将宿主 signal 和超时合并；特定 public URL 拒绝可退回 handle。ask 若没有 session_id 先创建服务端会话，再选择 RAG 或 agent 流式路径；流的 error 和缺少 complete 事件都会抛错，而非把半截回答当完整。实际宿主注册和 API 兼容未运行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/index.ts:12-36](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/index.ts#L12-L36)

解析配置并向宿主注册工具。

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

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:169-184](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L169-L184)

范围选择与缓存。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:329-357](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L329-L357)

并行请求与搜索投影。

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:105-117](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L105-L117)

逐命中保留标识和截断。

<details>
<summary>查看原文（13行）</summary>

```text
function projectHit(result: SearchResult, rank: number, maxChunkChars: number): SearchHit {
  const clipped = clip(typeof result.content === 'string' ? result.content : '', maxChunkChars)
  return {
    rank,
    chunk_id: typeof result.id === 'string' ? result.id : '',
    knowledge_id: typeof result.knowledge_id === 'string' ? result.knowledge_id : '',
    document: documentLabel(result),
    chunk_index: typeof result.chunk_index === 'number' ? result.chunk_index : -1,
    // 0 rather than NaN: the canonical value must stay lossless JSON.
    score: typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0,
    content: clipped.text,
    truncated: clipped.truncated,
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:108-109](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L108-L109)

超时和取消信号组合。

```text
function deadline(signal: AbortSignal, timeoutMs: number): AbortSignal {
  return AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
```

**依据 6 · 源码核查**：[packages/dsh-weknora/src/client.ts:122-129](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L122-L129)

认证和租户头。

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

**依据 7 · 源码核查**：[packages/dsh-weknora/src/client.ts:145-163](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L145-L163)

仅特定 public 403 退回 handle。

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-548](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L518-L548)

ask 创建会话与返回投影。

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

**依据 9 · 源码核查**：[packages/dsh-weknora/src/client.ts:389-397](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L389-L397)

流式错误与 complete 处理。

```text
          const name = call.function?.name ?? call.name
          if (typeof name === 'string' && name !== '' && !toolCalls.includes(name)) toolCalls.push(name)
        }
        break
      case 'error':
        throw new WeknoraApiError(`POST ${path} streamed an error: ${event.content ?? 'unknown error'}`)
      case 'complete':
        completed = true
        break
```

**依据 10 · 源码核查**：[packages/dsh-weknora/src/client.ts:423-432](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L423-L432)

缺少 complete 拒绝半截结果。

<details>
<summary>查看原文（10行）</summary>

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

</details>

#### 缺口

- 未运行固定 DSH 与服务，且 HTTP 接口可能存在版本差异
  **影响**：不能证明注册、流式处理和证据交接在目标环境成立
  **进一步探讨**：隔离假数据验证取消、超时、拒绝和服务中断

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认范围、缓存、分页、错误与写操作有哪些限制？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

显式请求的知识库 ID 优先于配置默认值，所以默认列表不是强制白名单；未配置时缓存首次成功获取的全部可见库，失败才清除缓存，代码未为成功缓存设置 TTL。应依服务端真实凭据授权收窄，而不是依赖默认值。read_document 以页码和总 chunk 算 has_more；同一页的拼接文本又按字符预算裁剪并返回 truncated，因此 has_more=false 不意味着无内容裁剪。文档元数据和标题匹配失败可被降级成空数据，成功 HTTP 的 data 非数组也转为空，不能把空输出一概解释为资料不存在。ask 会创建或复用服务端会话且可能调用 agent 工具，是有状态操作；取消或失败不证明服务端没有副作用。ask 的引用内容也截断，但其引用投影未提供逐条 truncated 字段。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:169-184](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L169-L184)

显式范围优先、成功缓存无 TTL。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/client.ts:195-214](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L195-L214)

空或非数组 data 变为空数组。

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

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:345-351](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L345-L351)

标题检索失败降级。

```text
        const [hits, named] = await Promise.all([
          client.search({ query, knowledgeBaseIds, knowledgeIds }, exec.signal),
          // By-name matching is an enrichment, and older WeKnora builds may not
          // route it. Losing it must not cost the model its passages.
          client.findDocuments({ keyword: query, limit }, exec.signal).catch(() => []),
        ])
        const results = hits.slice(0, limit).map((hit, index) => projectHit(hit, index + 1, config.maxChunkChars))
```

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-448](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L417-L448)

分页和字符裁剪两个状态、元数据降级。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:261-271](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/client.ts#L261-L271)

创建服务端会话。

<details>
<summary>查看原文（11行）</summary>

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
    return id
```

</details>

**依据 6 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-548](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L518-L548)

问答及引用裁剪投影。

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

#### 缺口

- 服务端实际权限、缓存生命周期与失败后状态未运行
  **影响**：不能推断实际数据泄露、完整性或副作用已撤销
  **进一步探讨**：测试权限撤销、范围扩张、裁剪及中断后服务端会话

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署与退出要付出什么，何时停止？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

用户需兼容 DSH 和 Node 的包、可达的 WeKnora 服务、合适 API key 与库权限；ask 还涉及服务端 chat 能力和模型调用。首次要部署或确认服务、配置凭据和范围；持续负担包括索引、模型、网络、引用核对和凭据维护；失败时应核对会话及外部操作，再决定是否重试。服务端部署费用、模型调用与人工时间未知。建议先关闭 ask，用受限凭据、非敏感库和相同问题对照网页与插件，核对命中、原文、截断与拒绝；若范围、来源或服务状态不明，停止使用并回到直接查询。撤销插件工具不等于删除已存在的服务端会话。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README.md:24-30](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/README.md#L24-L30)

服务地址、凭据和默认范围。

````text
Then point it at your deployment. The shipped configuration layer reads environment variables, so the quickest start is:

```sh
export WEKNORA_BASE_URL=https://weknora.example.com   # or http://localhost:8080
export WEKNORA_API_KEY=sk-...                          # a WeKnora API key with `retrieve` (+ `chat` for ask)
export WEKNORA_KNOWLEDGE_BASE_IDS=kb-123,kb-456        # optional default scope
export WEKNORA_RESOURCE_URLS=public                    # default; `handle` keeps internal file refs
````

**依据 2 · 作者声明**：[packages/dsh-weknora/README.md:73-80](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/README.md#L73-L80)

各工具服务端接口。

```text
## Tools

| Tool | WeKnora endpoint | What the model gets |
|---|---|---|
| `weknora_list_knowledge_bases` | `GET /knowledge-bases` | Knowledge base names and ids, to report what exists or to narrow a later search |
| `weknora_search` | `POST /knowledge-search` + `GET /knowledge/search` | Ranked passages verbatim, each with a `knowledge_id`, score and chunk index, plus any document the query names |
| `weknora_read_document` | `GET /chunks/:knowledge_id` + `GET /knowledge/:id` | One document's passages reassembled in order, led by its title and summary, with paging |
| `weknora_ask` | `POST /sessions` + `POST /knowledge-chat/:id` or `POST /agent-chat/:id` | WeKnora's own answer, its citations, the server-side tools it used, and a resumable `session_id` |
```

**依据 3 · 源码核查**：[packages/dsh-weknora/package.json:40-58](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/package.json#L40-L58)

Node 要求及 DSH bundle。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:518-537](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L518-L537)

ask 可新建服务端会话。

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

**依据 5 · 源码核查**：[packages/dsh-weknora/src/config.ts:59-66](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/config.ts#L59-L66)

默认限制和超时。

```text
const DEFAULTS = {
  baseUrl: 'http://localhost:8080/api/v1',
  maxResults: 8,
  maxChunkChars: 1200,
  requestTimeoutMs: 30_000,
  chatTimeoutMs: 300_000,
  resourceUrls: 'public',
  toolPrefix: 'weknora',
```

#### 缺口

- 固定部署、账号权限、模型账单和恢复未测
  **影响**：无法证明总成本和禁用后的服务端状态
  **进一步探讨**：试点前确认服务版本、凭据、回退流程及费用

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪个未验证改进值得和现有能力比较？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 search 已对每个片段输出 truncated，read_document 已分别暴露页码、has_more 与整页 truncated；但 ask 对引用只截取内容而不附逐条裁剪状态。未验证假设：为每个 ask 引用补充裁剪状态、原始长度和可继续读取的文档标识，并在可控上下文预算内优先提示用户补读，可减少将部分引文当成完整证据的错误。它需要服务端数据和宿主展示配合，也可能增加延迟与阅读负担；与现有 search/read 显式标志和人工补读对照，测截断识别率、错误结论、token 和人工时间。如果没有改善、标志不准确或成本超过收益则否定。该方案尚未实现或运行。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:105-117](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L105-L117)

search 现有逐条截断标志。

<details>
<summary>查看原文（13行）</summary>

```text
function projectHit(result: SearchResult, rank: number, maxChunkChars: number): SearchHit {
  const clipped = clip(typeof result.content === 'string' ? result.content : '', maxChunkChars)
  return {
    rank,
    chunk_id: typeof result.id === 'string' ? result.id : '',
    knowledge_id: typeof result.knowledge_id === 'string' ? result.knowledge_id : '',
    document: documentLabel(result),
    chunk_index: typeof result.chunk_index === 'number' ? result.chunk_index : -1,
    // 0 rather than NaN: the canonical value must stay lossless JSON.
    score: typeof result.score === 'number' && Number.isFinite(result.score) ? result.score : 0,
    content: clipped.text,
    truncated: clipped.truncated,
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-448](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L417-L448)

read_document 现有 has_more 和 truncated。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:538-548](https://github.com/Tencent/WeKnora/blob/80e8345903ce4af970497de8359b8b4ea4ce4917/packages/dsh-weknora/src/tools.ts#L538-L548)

ask 引用截断但未输出逐条截断状态。

<details>
<summary>查看原文（11行）</summary>

```text
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

#### 缺口

- 引用原始长度、展示交互与对照效果未知
  **影响**：不能证明自动提示改善证据完整性
  **进一步探讨**：模拟长引用与短引用，比较错误判断、token 和人工时间

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
