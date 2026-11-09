# WeKnora DSH 连接器

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e3fb233](https://github.com/Tencent/WeKnora/tree/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora)

<!-- BEGIN META -->
[![GitHub ★ 36,771](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36%2C771&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tencent/WeKnora) [![npm 30d 8,667](https://img.shields.io/static/v1?label=npm+30d&message=8%2C667&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@wxg-prc-cpg/dsh-weknora)
<!-- END META -->

> **功能**：让 DeepSeek Harness 在 WeKnora 知识库中检索片段、补读文档和请求综合问答。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持的贡献是把既有服务的搜索与补读接成可组合的宿主工具，保留文档标识、页与片段位置，让提问者能从短结果继续核对原文。嵌入、索引、重排及回答模型由服务端提供。

> **主要限制**：[Q03](#research-q03) 默认库可以被请求指定的范围覆盖，名称补充和元数据又可在请求失败后降级为空。若把默认库当授权白名单或把附加空结果当成资料不存在，就会误判覆盖范围。通过服务端受限凭据和正反例复核来约束试用。

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
  - [Q01 · 已有 WeKnora 的 DSH 用户用插件完成什么，和网页或直接 API 相比如何？](#detail-section-11)
  - [Q02 · 搜索、补读和 ask 如何从宿主注册走到请求及可复核结果？](#detail-section-12)
  - [Q03 · 默认库配置能否充当授权边界，什么情况会把缺证据当作无资料？](#detail-section-13)
  - [Q04 · 连接器投入、服务资源、重试和退出由谁承担？](#detail-section-14)
  - [Q05 · 哪些任务值得先试，怎样验证截断与越权不会混入回答？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已经维护 WeKnora 知识库、并在 DSH 中反复答内部资料问题的团队，需要少搬运片段，同时保留按文档定位的证据。[Q01](#research-q01)

使用者可在 WeKnora 网页搜索后复制片段，或手写请求取得文档标识再补读。只在本地文件中查证时，工作区搜索和打开文件也可交付同一原文依据。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 列知识库 | 获得后续搜索的名称和标识 | 服务返回范围取决于凭据 |
| 搜索片段与补充名称匹配 | 找相关内容与文档标识 | 附加名称搜索失败时仍返回主结果 |
| 读取文档分块 | 补查选定文档的上下文 | 分页和字符裁剪分别核对 |
| ask | 委托远端知识问答或 Agent | 需 chat 权限，会创建或复用远端会话 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Cordis 工具接口的 DSH 和 Node 20.11+ | 插件加载需要 | 导入 bundle 和注册工具 | 回网页或核对宿主版本 |
| 可达的 WeKnora 和可检索的库 | 核心功能需要 | 提供索引、分块和服务端授权 | 先查服务及索引状态 |
| 按库限制的 retrieve 凭据 | 受限试用需要 | 允许列库、搜索和分块读取 | 核查显式拒绝，不扩大凭据权限 |
| chat 能力和可用的问答模型 | ask 需要 | 创建会话并流式生成 | 保持 ask 关闭 |
| 资源句柄或获准公开链接 | 涉及资源时选择 | 控制返回图片等的表示方式 | 受限试用先使用内部句柄 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 选择服务与凭据 | 管理员限定测试库，设置服务地址和身份 | 确认授权库可检索，未授权库拒绝 |
| 加载宿主工具 | 用户在 DSH 配置 bundle 并关闭 ask | 检查三个读取工具及拒绝行为 |
| 搜索与补读 | 用户从命中结果取文档标识，按页查证 | 关键内容可定位到获准原文，裁剪时人工补读 |
| 停用并核对状态 | 用户禁用工具或移除 bundle | 没有后续调用，若试过 ask 则在平台另查会话和影响 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 已有服务也需保有存储和索引资源 | 接线、发放最小权限、检查版本 | 环境和配置耗时未知 |
| 持续 | 搜索请求、模型上下文、ask 的远端生成资源 | 检查命中和证据、维护索引与凭据 | 无费率或用量实测 |
| 失败恢复 | 重试请求、可能重复的生成 | 检查服务端会话、授权和失败状态 | 超时后的远端结果未知 |
| 退出 | 平台原有费用按实际保留 | 移除工具，核对已创建会话和原有工作流 | 插件停用与服务端清理分别验收 |

合格任务以关键判断能回查到允许的原文为准，把失败与人工复核计入总投入。[Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 在宿主继续补读 | 搜索与分块阅读共享文档标识 | 能否比网页更快验收 |
| 看见正文裁剪 | 搜索和补读提供标志 | 模型是否总能理解以及引用是否覆盖关键判断 |
| 委托远端综合问答 | 远端会话、答复和完成事件有接线 | 远端权限、生成质量、费用和断流副作用 |

> **思考**：[Q03](#research-q03) 默认库可以被请求指定的范围覆盖，名称补充和元数据又可在请求失败后降级为空。若把默认库当授权白名单或把附加空结果当成资料不存在，就会误判覆盖范围。通过服务端受限凭据和正反例复核来约束试用。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 支持的贡献是把既有服务的搜索与补读接成可组合的宿主工具，保留文档标识、页与片段位置，让提问者能从短结果继续核对原文。嵌入、索引、重排及回答模型由服务端提供。

[Q02](#research-q02) 接口调用与工具渲染分离，分页、字符裁剪和对话流完成有各自的判断。成功列库缓存缺自动过期，附加调用失败和真实无命中有时难区分，移植时需要明确权限范围更新及失败状态的传播。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 默认库可以被请求指定的范围覆盖，名称补充和元数据又可在请求失败后降级为空。若把默认库当授权白名单或把附加空结果当成资料不存在，就会误判覆盖范围。通过服务端受限凭据和正反例复核来约束试用。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 先用受限 retrieve 凭据和非敏感资料配置内部资源句柄，关闭 ask。用同名文档、长页和无权文档各做一次查询，只有关键内容能追到授权原文才继续。发现越权、范围不清或内容无法补齐时，停用工具并回平台查证。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码已核实四种宿主工具的接线、范围选择和部分状态投影。附加状态能否减少误判仍是待验证假设。真实宿主加载、服务端授权和任务收益尚需独立确认。

- 已检查：作者 README、包清单、源码路径 packages/dsh-weknora/README.md、packages/dsh-weknora/src/index.ts、packages/dsh-weknora/src/tools.ts、packages/dsh-weknora/package.json、packages/dsh-weknora/src/client.ts、internal/handler/session/qa.go、internal/router/routes_knowledge.go、packages/dsh-weknora/src/config.ts、internal/router/routes_chat.go、packages/dsh-weknora/cordis.patch.yml 及固定范围 inventory；组件：packages/dsh-weknora。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子目录 inventory 覆盖指定扩展名。抽读包清单、bundle、配置、注册、工具及客户端，根服务仅用于同提交的实际路由与 API key 目标检查。根平台与子包独立版本，未测试目标、宿主或后端。
- 下一步：在隔离环境用同一批问题比较宿主检索补读与网页人工查证。注入名称搜索失败、长文裁剪、凭据越权和过早断流，检查失败语义、权限边界、正确答案、复核工时和额外请求。[Q05](#research-q05)

**分析版本**

- **仓库**：[Tencent/WeKnora](https://github.com/Tencent/WeKnora)
- **版本号**：0.1.0（[固定提交 e3fb233](https://github.com/Tencent/WeKnora/tree/e3fb2335bf3f8cadd32142380c60b2677a27bf99)）
- **版本日期**：2026-11-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 将标题查找或补读元数据的失败独立写入工具结果，并在该状态下提示使用直接文档标识或网页核对。对照真实无命中与附加接口故障，检验这一状态是否减少错误放弃，同时计入新增上下文和复核开销。

在隔离环境用同一批问题比较宿主检索补读与网页人工查证。注入名称搜索失败、长文裁剪、凭据越权和过早断流，检查失败语义、权限边界、正确答案、复核工时和额外请求。[Q05](#research-q05)

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

[![Issue 未关闭 509](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=509&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 364](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=364&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 192](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=192&color=737b86&logo=github)](https://github.com/Tencent/WeKnora/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有 WeKnora 知识库的 DSH 使用者能否安全、完整地在宿主中获得可复核的检索证据，以及服务端综合回答需要哪些额外许可和验证？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已有 WeKnora 的 DSH 用户用插件完成什么，和网页或直接 API 相比如何？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 WeKnora 库并经常在 DSH 内答内部资料问题的用户，可在同一会话内搜索资料、读取指定文档的片段，并据此给出可复核的答案。以内部产品手册为例，合格结果需要给出文档标识和支持关键事实的内容，必要时还要核对原文版本。原办法是在 WeKnora 界面搜索后复制片段到 DSH，或手写 HTTP 请求、保存文档标识再读取分块。连接器将检索结果中的文档标识保留在模型可用的输出里，支持直接交给读文档工具。其贡献在于把两次操作接到 DSH 工具调用里。索引、排序和模型能力由远端 WeKnora 提供，只有工作区已有完整文档的用户可用本地文本搜索作轻量基线。源码可以证明调用编排与返回字段，尚无真实任务的搬运时间或合格答复率对照。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-weknora/README.md:7-12](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/README.md#L7-L12)

作者把已有 WeKnora 知识库接到 DSH，列出检索、补读与综合答复。

```text
A [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) (`dsh`) plugin that gives the harness agent
first-class access to a [WeKnora](https://github.com/Tencent/WeKnora) knowledge base: hybrid retrieval, full document
reading, and WeKnora's own composed answers with citations.

dsh ships no retrieval, embedding or knowledge-base capability of its own — its search tools (`grep`, `glob`) read the
workspace, and `web_search` reads the internet. This plugin fills that gap with your organization's documents.
```

**依据 2 · 源码核查**：[packages/dsh-weknora/src/index.ts:28-36](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/index.ts#L28-L36)

固定入口解析配置后逐个注册工具。

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

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:105-117](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L105-L117)

投影保留知识标识、片段索引和裁剪状态，支持进一步定位。

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-431](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L417-L431)

补读确实以知识标识发请求，第一页元数据是单独的附加调用。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 缺目标团队的重复任务与手工操作记录。
  **影响**：无法量化切换和复制负担是否值得多维护一个宿主适配。
  **进一步探讨**：同批手册问题分别用宿主连接器和 WeKnora 界面回答，记录证据定位、人工操作次数和验收结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索、补读和 ask 如何从宿主注册走到请求及可复核结果？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

包清单声明 DSH bundle 补丁，入口注入工具注册表并按配置注册列表、搜索、补读与 ask。搜索把查询和库／文档范围传给远端片段接口，同时调用文档名接口；前者的请求错误会使 Promise.all 失败，后者报错以空附加列表降级。片段返回先按本地 maxResults 限制条数，再按字符预算裁剪文本并保留 `truncated`。补读按文档标识和分页取存储中的解析块，排序拼接；`has_more` 根据页与总数计算，`truncated` 反映本页文本裁剪，两者分别判断。第一页标题和摘要请求失败时仍可返回片段。

ask 在缺会话 ID 时先创建远端会话，随后根据有效 Agent 标识走知识聊天或 Agent 聊天。流式解析器读 `data:` JSON，累加回答和工具名，采用收到的引用列表。服务端 error 会报错，提前结束且没有 complete 也会报错。工具返回还限制引用数量并裁剪引用正文，结构里没有逐条裁剪标记。用样本识别对话是否正确结束，还要独立核对引用是否实际支持回答。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/package.json:46-60](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/package.json#L46-L60)

声明 Node 下限及 DSH bundle 补丁。

<details>
<summary>查看原文（15行）</summary>

```text
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
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/index.ts:12-35](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/index.ts#L12-L35)

导出注入和 apply 的实际注册接线。

<details>
<summary>查看原文（24行）</summary>

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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/client.ts:201-215](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L201-L215)

检索实际 POST 查询与范围。

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/tools.ts:344-358](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L344-L358)

并行附加名称搜索，裁剪和返回结果发生在客户端。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 5 · 源码核查**：[packages/dsh-weknora/src/tools.ts:417-449](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L417-L449)

补读分页、排序、标题降级和独立截断状态。

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

**依据 6 · 源码核查**：[packages/dsh-weknora/src/client.ts:262-271](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L262-L271)

创建有持久服务端标识的会话。

<details>
<summary>查看原文（10行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[packages/dsh-weknora/src/client.ts:289-306](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L289-L306)

以 agentId 选择聊天路由并发起 SSE 请求。

<details>
<summary>查看原文（18行）</summary>

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
        })
```

</details>

**依据 8 · 源码核查**：[packages/dsh-weknora/src/client.ts:369-399](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L369-L399)

解析回答、引用、工具事件和错误或完成。

<details>
<summary>查看原文（31行）</summary>

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
```

</details>

**依据 9 · 源码核查**：[packages/dsh-weknora/src/client.ts:403-432](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L403-L432)

等待完成并在没有完成事件时失败，主动结束本地读取。

<details>
<summary>查看原文（30行）</summary>

```text
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

**依据 10 · 源码核查**：[packages/dsh-weknora/src/tools.ts:534-549](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L534-L549)

创建或复用会话并投影引用，裁剪字段未传回。

<details>
<summary>查看原文（16行）</summary>

```text
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
        }
```

</details>

#### 缺口

- 未验证当前宿主如何消费这些结构化字段和渲染信息。
  **影响**：无法保证宿主界面或模型始终发现分页、裁剪和流错误。
  **进一步探讨**：用支持版本的宿主分别发短文、超长页和缺 complete 的测试响应，检查模型看到的字段和界面渲染。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 默认库配置能否充当授权边界，什么情况会把缺证据当作无资料？

**研究主题**：缺陷与关键质疑

#### 完整回答

默认库只给客户端选范围。显式库参数优先，随后才用配置默认库；在两者都没有的情况下，显式文档 ID 可避免自动遍历全部库，其余请求缓存列库结果并复用。缓存属于该工具集合实例，失败清除，成功分支看不到期限或主动失效。Agent 模式下如果既未显式选库也未配置默认库，调用会把选择留给服务端；配置了默认库时仍会传出该列表。按标题查找的附加请求不带库范围，客户端只过滤返回项，传入文档 ID 时按文档集合过滤，其他情况按库过滤。补读直接传文档 ID。有效授权需由 WeKnora 对 API key、目标库或文档所属库执行，不能用插件默认值约束凭据。

主片段检索失败通常会抛错，但服务器若用成功 HTTP 返回没有数组的 data，客户端会读为空列表。标题附加请求和补读第一页元数据失败也会丢失对应信息，且不会单列降级原因。看到空结果时应区分实际无命中、未启用标题接口及意外响应结构。公开资源模式仅在特定 403 文案上退到内部句柄，并在当前客户端记住该决定。它没有替代资料授权，也无法为已建会话或远端动作提供补偿。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:168-184](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L168-L184)

列库的实例级 Promise 缓存和明确的默认范围优先级。

<details>
<summary>查看原文（17行）</summary>

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
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:126-150](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L126-L150)

名称结果仅在收到后按文档或库过滤。

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

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:521-533](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L521-L533)

Agent 仅跳过无配置情况下的自动列库，配置的默认库仍可传递。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[packages/dsh-weknora/src/client.ts:195-215](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L195-L215)

HTTP 成功响应中非数组 data 被映射为空列表。

<details>
<summary>查看原文（21行）</summary>

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
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/tools.ts:344-358](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L344-L358)

名称附加搜索失败无单独的错误字段。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 6 · 源码核查**：[internal/handler/session/qa.go:991-1017](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/handler/session/qa.go#L991-L1017)

同提交片段检索 handler 在调用服务前核对 API key 目标。

<details>
<summary>查看原文（27行）</summary>

```text
		return
	}
	if err := types.AuthorizeTenantAPIKeyKnowledgeTargets(ctx, knowledgeBaseIDs, request.KnowledgeIDs); err != nil {
		c.Error(err)
		return
	}
	opts, err := knowledgeSearchOptions(&request)
	if err != nil {
		_ = c.Error(errors.NewBadRequestError(err.Error()))
		return
	}
	opts.QueryImage = queryImage
	opts.QueryImageMediaType = queryImageType

	logger.Infof(
		ctx,
		"Knowledge search request, knowledge base IDs: %v, knowledge IDs: %v, tag scopes: %d, query: %s",
		secutils.SanitizeForLogArray(knowledgeBaseIDs),
		secutils.SanitizeForLogArray(request.KnowledgeIDs),
		len(tagScopes),
		secutils.SanitizeForLog(request.Query),
	)

	// Directly call knowledge retrieval service without LLM summarization
	retrieval, err := h.sessionService.SearchKnowledge(
		ctx, knowledgeBaseIDs, request.KnowledgeIDs, tagScopes, request.Query, opts,
	)
```

</details>

**依据 7 · 源码核查**：[internal/router/routes_knowledge.go:28-35](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/router/routes_knowledge.go#L28-L35)

同提交分块读取路由标注 retrieve 并按文档 ID 核查父库。

```text
func RegisterChunkRoutes(r *gin.RouterGroup, handler *handler.ChunkHandler, g *rbacGuards) {
	// 分块路由组。Scoped API key 需要 ingest 能力写内容，retrieve 能力读内容；
	// 两者仍受 KB 白名单约束。
	chunks := g.apiKeyGroup(r.Group("/chunks"), apiKeyIngest(apiKeyFullAccess()))
	chunkRead := chunks.With(apiKeyRetrieve(apiKeyFullAccess()))
	{
		// 获取分块列表 — Viewer+ 且对父 KB 有 read 权限（own / shared / via shared agent）
		chunkRead.GET("/:knowledge_id", g.Viewer(), g.KBAccessReadFromKnowledgeIDParam("knowledge_id"), handler.ListKnowledgeChunks)
```

**依据 8 · 源码核查**：[packages/dsh-weknora/src/client.ts:145-164](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L145-L164)

只对指定 public 资源 403 降级，不对所有拒绝重试。

<details>
<summary>查看原文（20行）</summary>

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

#### 缺口

- 未知实际平台版本和凭据设置在撤权、缓存及多租户请求时的行为。
  **影响**：不能从适配层范围选项判断越权能否被阻断。
  **进一步探讨**：为测试凭据仅授予库 A，显式请求库 B 和 B 文档，再撤销 A，逐条确认搜索与补读均拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 连接器投入、服务资源、重试和退出由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

插件需能加载 Cordis bundle 和工具接口的 DSH，包声明 Node 20.11 或更新。作者记录用 DSH 0.1.0-rc.8 与 WeKnora 0.8.0 核对兼容，本次未执行这组或其他版本。操作方还要提供能访问的 WeKnora 服务、有效索引和最小权限凭据，配置工作区标识及默认库。列库、检索与分块读取使用服务端 retrieve 路由；ask 另用 chat 能力，可发起服务端生成，选配 Agent 还会使用它自己的工具与范围。配置校验能发现字段类型、URL 协议或工具开关错误，凭据或索引能否使用要到请求时确认。发远程请求前要核对目的地和资料边界，服务端模型供应商及资料出站策略也需要由运营者确认。

首次投入有宿主接线、库和凭据配置，以及正反例验收。持续投入包括搜索 API、索引和远端模型资源、DSH 模型消化片段的上下文与复核时间，使用 ask 另计远端生成。客户端给普通请求和聊天分别设置超时，并合并宿主取消信号。超时、断流或取消只能说明客户端没有取得完成结果，远端可能已经创建会话或执行工作。核对服务端后再试，避免把超时当作可重复请求的授权。关闭 ask 或撤掉 bundle 可停止后续调用，已创建会话和远端影响需在服务端另查。现金、资源和人工成本均缺实际测量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/package.json:46-60](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/package.json#L46-L60)

运行时版本及 DSH 加载声明。

<details>
<summary>查看原文（15行）</summary>

```text
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
  },
```

</details>

**依据 2 · 作者声明**：[packages/dsh-weknora/README.md:168-173](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/README.md#L168-L173)

作者列出核查版本及宿主接口变化风险。

```text
## Compatibility

Verified against dsh `0.1.0-rc.8` and WeKnora `0.8.0`. dsh is in developer preview and states that breaking changes
will happen; this package deliberately has **no runtime dependencies** and hands `ctx.tools.register()` a plain object,
so it does not pin any harness package version. If a harness release changes the tool-definition contract, open an issue
against this repository.
```

**依据 3 · 源码核查**：[packages/dsh-weknora/src/config.ts:167-190](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/config.ts#L167-L190)

字段约束和实际默认开关，ask 默认开启，移除行可退出。

<details>
<summary>查看原文（24行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/client.ts:108-129](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L108-L129)

取消和超时合成；HTTP 请求可以携带 API key 与租户字段。

<details>
<summary>查看原文（22行）</summary>

```text
function deadline(signal: AbortSignal, timeoutMs: number): AbortSignal {
  return AbortSignal.any([signal, AbortSignal.timeout(timeoutMs)])
}

export class WeknoraClient {
  /**
   * A knowledge-base-restricted API key rejects `resource_urls=public` with
   * 403. After the first such refusal this client stays on handle mode so
   * later calls do not pay the same round trip.
   */
  private publicModeBlocked = false

  constructor(private readonly config: ResolvedConfig) {}

  private headers(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    }
    if (this.config.apiKey !== undefined) headers['X-API-Key'] = this.config.apiKey
    if (this.config.tenantId !== undefined) headers['X-Tenant-ID'] = this.config.tenantId
    return headers
```

</details>

**依据 5 · 源码核查**：[packages/dsh-weknora/src/client.ts:298-318](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/client.ts#L298-L318)

聊天使用独立期限，明确处理资源模式 403 重开。

<details>
<summary>查看原文（21行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[internal/router/routes_chat.go:48-54](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/router/routes_chat.go#L48-L54)

远端创建会话属于 chat 路由。

```text
	// Sessions are per-user chat state, not knowledge-base content. The
	// chat capability lets a scoped key run the full conversation flow
	// (create/manage its own sessions) without full tenant access.
	sessions := g.apiKeyGroup(r.Group("/sessions", g.Viewer()), apiKeyChat(apiKeyFullAccess()))
	{
		sessions.POST("", handler.CreateSession)
		sessions.DELETE("/batch", handler.BatchDeleteSessions)
```

**依据 7 · 源码核查**：[internal/router/routes_chat.go:145-163](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/internal/router/routes_chat.go#L145-L163)

检索与两种聊天使用不同服务端权限门槛。

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

- 缺真实部署的模型调用成本、任务时长和断流后会话结果。
  **影响**：不能证明总节时、停用可清理历史或一次超时没有远端动作。
  **进一步探讨**：固定数据和模型，记录请求、模型用量与复核时间，制造一次受控断流后查会话、消息和可能的外部动作。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些任务值得先试，怎样验证截断与越权不会混入回答？

**研究主题**：新假设与验证、采用判断

#### 完整回答

已有可用 WeKnora 库的 DSH 用户可先用受限 retrieve 凭据、非敏感资料和内部资源句柄试搜索与补读，关闭 ask。准备同名不同库、跨页证据和一个禁止读取的文档，逐条确认文档标识正确、截断可识别、关键句能追到原文以及越权被拒。对只需单份本地文件或现有网页能快速查证的用户，维持原流程也能满足任务。

待验证的工程假设是，为标题查找失败和第一页元数据缺失提供独立的可见状态，并在相应状态下明确提示改用直接文档标识或网页核对，能减少把降级空结果解释成资料不存在的误判。已有 `truncated` 可报告文本预算，却无法解释附加请求是否成功。固定同样的查询、凭据和文档，把当前投影与附加状态加人工退路的方案对照，测试真实空结果、附加接口超时和主检索成功三类，记录误判率、复核时间与新增模型上下文。若误判未下降或代价抵消改善，则不增加该状态。试用发现范围不明、越权、尾页被裁剪且无法补读时，停用插件工具并回到平台按原文审核。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-weknora/src/tools.ts:344-358](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L344-L358)

名称补充调用降级为空，结果本身没有附加调用状态。

<details>
<summary>查看原文（15行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-weknora/src/tools.ts:422-447](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L422-L447)

补读标题失败被吞掉，正文截断仍独立可见。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[packages/dsh-weknora/src/tools.ts:105-117](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/tools.ts#L105-L117)

现有搜索裁剪标识提供可复核的状态设计参照。

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

**依据 4 · 源码核查**：[packages/dsh-weknora/src/config.ts:179-189](https://github.com/Tencent/WeKnora/blob/e3fb2335bf3f8cadd32142380c60b2677a27bf99/packages/dsh-weknora/src/config.ts#L179-L189)

工具开关支持关闭 ask 并保留检索。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

#### 缺口

- 没有同任务的故障注入及带状态提示的可用性记录。
  **影响**：不能断言此改动改善采用收益。
  **进一步探讨**：保留命中、无命中和故障全样本，事先约定误判和单位合格任务的停止标准。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
