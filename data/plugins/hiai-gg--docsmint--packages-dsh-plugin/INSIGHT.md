# DocsMint for DSH

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e88abdc](https://github.com/HiAi-gg/docsmint/tree/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin)

<!-- BEGIN META -->
[![GitHub ★ 81](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=81&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HiAi-gg/docsmint) [![npm 30d 559](https://img.shields.io/static/v1?label=npm+30d&message=559&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hiai-gg/dsh-docsmint) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hiai-gg/dsh-docsmint)
<!-- END META -->

> **功能**：在 DSH 侧栏浏览编辑 DocsMint，并用四个模型工具通过 REST 或 MCP 检索读写文档。

> **亮点**：双端面板与固定四工具、连接/OAuth和双传输适配减少配置与搬运；文档存储、混合检索和权限继承外部服务。见 [Q01](#research-q01)、[Q03](#research-q03)。

> **主要限制**：edit卡片不是本组件的批准流程，写请求没有本地版本前置条件与幂等核验；网络失败可能已写入，MCP逐次取消也未证实。见 [Q02](#research-q02)。

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
  - [Q01 · 怎样把 DSH 中的检索、阅读和保存实际接到 DocsMint？](#detail-section-11)
  - [Q02 · 权限、并发修改、超时和失败结果的边界在哪里？](#detail-section-12)
  - [Q03 · 双传输和云端/自建授权需要什么，插件的增量如何归因？](#detail-section-13)
  - [Q04 · 哪些具体任务可试用，值得验证的生产方向是什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 DocsMint 文档的个人用户在 DSH 研究写作中检索、引用和保存 Markdown。见 [Q01](#research-q01)。

DocsMint原界面手工搜索复制保存，或手工接入其MCP；未测其他文档工具。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 搜索/读取 | 从文档库取得片段与全文 | 搜索质量依赖服务 |
| 创建/更新 | 保存Markdown | 无本地条件写或幂等核验 |
| 侧栏 | 筛选浏览及编辑 | 与工具共用连接，参数不全同 |
| REST/MCP | 双传输接入 | 工具发现映射需兼容 |
| 云OAuth | 免手工API key接入MCP | 凭据存储与回调必需 |

**流程与依赖**

| 依赖 | 作用 | 必要性 | 条件与边界 |
|---|---|---|---|
| DSH Web/Host | 工具及侧栏 | 必需 | 包声明>=0.2.1-rc.5 <0.3.0 |
| DocsMint服务 | 存储与检索 | 必需 | 云端或自建，质量未测 |
| 凭据/账号 | OAuth或API认证 | 必需 | 云MCP需OAuth及凭据存储 |
| Node | Host执行 | 必需 | >=22 |


| 阶段 | 操作 | 结果与边界 |
|---|---|---|
| 首次 | 固定端点、模式、工作区并授权 | 连接在插件上下文共享 |
| 查阅 | 搜索后按id读取 | 片段不代替全文 |
| 保存 | 创建/更新后按id核对 | 无本地条件写保护 |
| 异常 | 先确认远端状态再重连/重试 | 网络失败可能已写入 |

**效果与成本**

| 阶段 | 现金 | 人工 | 未知与控制 |
|---|---|---|---|
| 首次 | 套餐/自建费用未知 | 授权与工作区配置 | 测试库起步 |
| 持续 | 模型、存储/索引未知 | 核对正文与版本维护 | 不估单位收益 |
| 失败恢复 | 重试调用未知 | 找重复与恢复原文 | 先回读再重试 |
| 退出 | 远端服务费用独立 | 撤插件授权及卸载 | 远端文档保留 |


| 结果 | 源码支持 | 未验证 |
|---|---|---|
| 检索阅读 | 请求与正文/id链接返回 | 命中质量 |
| 创建更新 | REST/MCP真实写调用 | 并发安全及未知结果恢复 |
| 连接便利 | OAuth、凭据和侧栏 | 真实授权兼容 |
| 效率 | 减少搬运机制 | 合格文档成本与人工收益 |

> **思考**：edit卡片不是本组件的批准流程，写请求没有本地版本前置条件与幂等核验；网络失败可能已写入，MCP逐次取消也未证实。见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：双端面板与固定四工具、连接/OAuth和双传输适配减少配置与搬运；文档存储、混合检索和权限继承外部服务。见 [Q01](#research-q01)、[Q03](#research-q03)。

Host授权缺服务拒绝、generation与刷新合并、响应限长可借鉴；不能将edit呈现、HTTP成功或工具名匹配等同可靠交付。见 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

edit卡片不是本组件的批准流程，写请求没有本地版本前置条件与幂等核验；网络失败可能已写入，MCP逐次取消也未证实。见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

测试工作区做已知搜索与小文档回读，更新保留原文；失败先查远端，异常停写回原界面。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码核查完成；未连接实际服务或执行目标测试。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin/README.md、packages/dsh-plugin/client.js、packages/dsh-plugin/index.js、packages/dsh-plugin/mcp.js、packages/dsh-plugin/package.json 及固定范围 inventory；组件：packages/dsh-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整消费分配组件的入口材料，定向核查四工具、双传输、面板保存、Host授权、OAuth启动/刷新与请求失败。未审整仓服务端、完整OAuth回调/工具别名语义、所有UI筛选和外部服务权限；未运行目标。
- 下一步：测试库对照搜索-阅读-保存及并发/响应丢失/取消，回读实际结果并记录总调用与修复；先核服务端条件写能力，均未执行。

**分析版本**

- **仓库**：[HiAi-gg/docsmint](https://github.com/HiAi-gg/docsmint)
- **版本号**：1.0.0（[固定提交 e88abdc](https://github.com/HiAi-gg/docsmint/tree/e88abdc17d0b565428c36793533939a50152b0d3)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证带版本前置条件、目标差异和写后回读的可靠保存；若外部服务已有同等保护或不能减少错误就不成立。见 [Q04](#research-q04)。

测试库对照搜索-阅读-保存及并发/响应丢失/取消，回读实际结果并记录总调用与修复；先核服务端条件写能力，均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 339 | — | — | 2772 |
| .js | source | 3 | 4277 | 3396 | 699 | — |
| .mjs | test | 3 | 1082 | 975 | 66 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/HiAi-gg/docsmint/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/HiAi-gg/docsmint/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/HiAi-gg/docsmint/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：区分文档桥接增量、外部服务能力与可靠写入限制。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 怎样把 DSH 中的检索、阅读和保存实际接到 DocsMint？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它面向已经在 DocsMint 管理文档、希望在 DSH 研究或写作时直接查阅与保存的人。替代办法是浏览器搜索、打开文档再复制 Markdown，或手工配置原 DocsMint MCP；新增是 Host/客户端双端插件、连接面板、筛选浏览及四个固定 Agent 工具，不是另造文档库和搜索引擎。

apply 注册搜索、读取、创建和更新工具，左侧面板通过 Host RPC 使用同一组 run 操作。runSearch/runRead 按当前连接分流 REST 或 MCP；runCreate/runUpdate 同样分流并校验标题、id、空修改。REST 实际 POST /documents 或 PATCH 指定文档，MCP 初始化并发现工具，按名称/输入 schema 映射后 tools/call。工具成功返回文档 id、标题和链接，读取/更新还返回正文；合格结果必须能按 id 再读取核对，不能只看“Created”卡片。

面板保存正文以返回文档更新当前显示，再刷新列表；列表刷新失败被视为不影响已保存。模型工具与面板共用操作并不意味着所有参数完全相同：工具创建入口只暴露 title/content/folderId，没有面板的全部 workspace/category 选择。搜索的 hybrid 效果来自服务端，适配器不负责重新计算相关性。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:595-663](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L595-L663)

四种操作按连接分流。

<details>
<summary>查看原文（69行）</summary>

```text
async function runSearch(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  if (connection.mode !== 'mcp') return searchDocuments(ctx, config, options)
  const query = str(options.query)
  if (!query) return failure('empty-query', 'Search text is required.', 400)
  return mcpInvoke(ctx, config, connection, 'search', { query, limit: options.limit, workspaceId: str(options.workspaceId), categoryId: str(options.categoryId) })
}

/**
 * @param {any} ctx - registrant context.
 * @param {Record<string, unknown> | undefined} config - the Loader row config.
 * @param {{ id?: unknown, signal?: AbortSignal }} [options] - document id.
 * @returns {Promise<any>} the read outcome on the active transport.
 */
async function runRead(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  if (connection.mode !== 'mcp') return readDocument(ctx, config, options)
  const id = str(options.id)
  if (!id) return failure('missing-id', 'A DocsMint document id is required.', 400)
  return mcpInvoke(ctx, config, connection, 'get', { id })
}

/**
 * @param {any} ctx - registrant context.
 * @param {Record<string, unknown> | undefined} config - the Loader row config.
 * @param {{ title?: unknown, content?: unknown, folderId?: unknown, signal?: AbortSignal }} [options] - new document.
 * @returns {Promise<any>} the create outcome on the active transport.
 */
async function runCreate(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  if (connection.mode !== 'mcp') return createDocument(ctx, config, options)
  const title = str(options.title)
  if (!title) return failure('missing-title', 'A document title is required.', 400)
  return mcpInvoke(ctx, config, connection, 'create', {
    title,
    content: typeof options.content === 'string' ? options.content : '',
    folderId: str(options.folderId),
    workspaceId: str(options.workspaceId),
    categoryId: str(options.categoryId),
  })
}

/**
 * Update a document's title and Markdown body.
 *
 * @param {any} ctx - registrant context.
 * @param {Record<string, unknown> | undefined} config - the Loader row config.
 * @param {{ id?: unknown, title?: unknown, content?: unknown, signal?: AbortSignal }} [options] - the edit.
 * @returns {Promise<any>} the update outcome on the active transport.
 */
async function runUpdate(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  const id = str(options.id)
  if (!id) return failure('missing-id', 'A DocsMint document id is required.', 400)
  /** @type {Record<string, unknown>} */
  const body = {}
  const title = str(options.title)
  if (title) body.title = title
  if (typeof options.content === 'string') body.content = options.content
  if (Object.keys(body).length === 0) return failure('empty-update', 'Nothing to update.', 400)

  if (connection.mode !== 'mcp') {
    return docsmintRequest(ctx, config, `/documents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body,
      signal: options.signal,
    })
  }
  return mcpInvoke(ctx, config, connection, 'update', { id, title: body.title, content: body.content })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:1390-1427](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1390-L1427)

创建工具的参数、调用和结果。

<details>
<summary>查看原文（38行）</summary>

```text
      name: 'docsmint_create_document',
      description:
        'Create a DocsMint document in the user\'s workspace from Markdown content. Returns the new document id and its link. Use it when the user asks to save findings into DocsMint.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', description: 'Document title.' },
          content: { type: 'string', description: 'Markdown body of the new document.' },
          folderId: { type: 'string', description: 'Optional DocsMint folder id to place the document in.' },
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'title', 'url'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: `Created DocsMint document "${value?.title ?? ''}" (${value?.id ?? ''}) at ${value?.url ?? ''}.` }],
      },
      presentCall: (args) => ({ card: 'generic', title: `Create DocsMint document: ${str(args?.title) ?? ''}`, kind: 'edit', rawInput: args }),
      async execute(args, exec) {
        const input = toolArgs(args)
        const result = await runCreate(ctx, config, {
          title: input.title,
          content: input.content,
          folderId: input.folderId,
          signal: exec?.signal,
        })
        if (!result.ok) throwFailure(result)
        const document = await normalizeWithLink(ctx, config, await resolveConnection(ctx, config), result.data)
        return { id: document.id, title: document.title, url: document.url }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:1431-1477](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1431-L1477)

更新工具真实接线。

<details>
<summary>查看原文（47行）</summary>

```text
      name: 'docsmint_update_document',
      description:
        'Update the title and/or Markdown body of an existing DocsMint document. Returns the stored document. Use it when the user asks to fix, extend or retitle a DocsMint document.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['id'],
        properties: {
          id: { type: 'string', description: 'Document id from docsmint_search.' },
          title: { type: 'string', description: 'New title; omit to keep the current one.' },
          content: { type: 'string', description: 'New Markdown body; omit to keep the current one.' },
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'title', 'content', 'url'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            content: { type: 'string' },
            url: { type: 'string' },
            folder: { type: 'string' },
            category: { type: 'string' },
            visibility: { type: 'string' },
            updatedAt: { type: 'string' },
            createdAt: { type: 'string' },
            tags: { type: 'array', items: { type: 'string' } },
          },
        },
        render: (_args, value) => [
          { type: 'text', text: `Updated DocsMint document "${value?.title ?? ''}" (${value?.id ?? ''}) at ${value?.url ?? ''}.` },
        ],
      },
      presentCall: (args) => ({ card: 'generic', title: `Update DocsMint document ${str(args?.id) ?? ''}`, kind: 'edit', rawInput: args }),
      async execute(args, exec) {
        const input = toolArgs(args)
        const result = await runUpdate(ctx, config, {
          id: input.id,
          title: input.title,
          content: input.content,
          signal: exec?.signal,
        })
        if (!result.ok) throwFailure(result)
        return await normalizeWithLink(ctx, config, await resolveConnection(ctx, config), result.data)
      },
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/index.js:1536-1542](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1536-L1542)

注册四个工具。

```text
export function apply(ctx, config) {
  const state = stateFor(ctx)
  state.active = true
  ctx.effect(() => () => invalidateContext(ctx, true), 'docsmint:connection-state')
  for (const definition of toolDefinitions(ctx, config)) {
    ctx.effect(() => ctx.tools.register(definition), `docsmint:${definition.name}`)
  }
```

**依据 5 · 源码核查**：[packages/dsh-plugin/mcp.js:664-707](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/mcp.js#L664-L707)

发现、匹配、参数映射及tools/call。

<details>
<summary>查看原文（44行）</summary>

```text
  async function ensure() {
    if (tools) return { ok: true, tools, server }
    const initialized = await rpc('initialize', {
      protocolVersion: PROTOCOL_VERSION,
      capabilities: {},
      clientInfo: { name: CLIENT_NAME, version: '1.0.0' },
    })
    if (!initialized.ok) return initialized
    server = initialized.result?.serverInfo
    const listed = await rpc('tools/list', {})
    if (!listed.ok) return listed
    tools = Array.isArray(listed.result?.tools) ? listed.result.tools : []
    return { ok: true, tools, server }
  }

  return {
    info: () => ({ tools: tools ? tools.length : null, server: str(server?.name) ?? null }),
    async invoke(kind, input) {
      const ready = await ensure()
      if (!ready.ok) return ready
      let tool = pickTool(ready.tools, kind)
      if (!tool && kind === 'list') {
        // A single `find_documents` tool usually serves both listing and search.
        tool = pickTool(ready.tools, 'search')
      }
      if (!tool) {
        return failure(
          'mcp-tool-missing',
          `The DocsMint MCP server exposes no tool for "${kind}" (available: ${ready.tools.map((entry) => entry.name).join(', ') || 'none'}).`,
          404,
        )
      }
      const mapped = mapArgs(tool, kind, input)
      if (mapped.missing.length > 0) {
        const declared = Object.keys(tool.inputSchema?.properties ?? {}).join(', ')
        return failure(
          'mcp-tool-args',
          `The DocsMint MCP tool "${tool.name}" requires ${mapped.missing.join(', ')}, which this plugin could not derive (its arguments: ${declared || 'undeclared'}).`,
          400,
        )
      }
      const called = await rpc('tools/call', { name: tool.name, arguments: mapped.args })
      if (!called.ok) return called
      return shape(kind, called.result, input)
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin/client.js:740-759](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/client.js#L740-L759)

文档保存与列表刷新分开。

<details>
<summary>查看原文（20行）</summary>

```text
        async function saveDraft() {
          if (!document || !editDraft) return
          setBusy(true)
          setNotice('')
          setSavedHint('')
          try {
            const result = await rpc('update', {
              id: document.id,
              title: editDraft.title,
              content: editDraft.content,
            })
            setDocument(result.document)
            setEditDraft(null)
            setSavedHint(t('doc.saved'))
            try {
              const list = await fetchFirstPage()
              if (!list) return
            } catch {
              // The save already succeeded; a stale list is only cosmetic.
            }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 权限、并发修改、超时和失败结果的边界在哪里？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 面板接口要求宿主 connection.requestRejection 可用且授权通过，缺服务返回503，授权失败拒绝，且只接受POST。REST 使用Bearer和工作区头，redirect:error，响应限制1MiB，并拒绝直接包含API key的响应；这些减少非预期暴露，不证明整个云端或所有OAuth路径已安全审计。连接切换/卸载的generation检查也能阻止旧授权继续被正常使用。

插件里的创建/更新直接调用外部服务，edit卡片只是呈现，本组件未接入单独approval服务；不能把卡片当逐次用户批准。PATCH只带标题/正文，没有expectedVersion或If-Match条件，因此这里没有可核查的并发冲突保护。两个用户或面板/Agent同时编辑时不能假定自动合并，本次未确认服务端是否另有保护。

REST网络失败返回network，取消返回aborted，但写请求可能已到服务端而客户端尚未收到响应；没有幂等键或写后核验，不能据失败盲目重建。MCP仅在401时强制刷新授权并重发一次，同样不是通用安全重试承诺。传入exec.signal只在REST操作下游使用；MCP会话绑定的signal来自会话构造，invoke不接受逐次signal，本次没有证明工具取消可以中断单次MCP请求。REST也未设置内部超时，等待时长取决于外部signal/网络。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:1544-1564](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1544-L1564)

Host授权门禁。

<details>
<summary>查看原文（21行）</summary>

```text
  const handleRpc = async (req, res) => {
    const connection = /** @type {any} */ (ctx.get('connection'))
    if (!connection || typeof connection.requestRejection !== 'function') {
      sendJson(res, 503, { ok: false, code: 'authorization-unavailable', message: 'The Host authorization service is unavailable.' })
      return
    }
    if (connection && typeof connection.requestRejection === 'function') {
      let rejection
      try {
        rejection = connection.requestRejection({ headers: req.headers })
      } catch {
        rejection = 401
      }
      if (rejection) {
        sendJson(res, rejection, { ok: false, code: 'unauthorized', message: 'This page is not authorized to reach DocsMint.' })
        return
      }
    }
    if (req.method !== 'POST') {
      sendJson(res, 405, { ok: false, code: 'method-not-allowed', message: 'Use POST.' })
      return
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:918-975](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L918-L975)

REST实际请求、重定向、失败、大小和凭据响应拒绝。

<details>
<summary>查看原文（58行）</summary>

```text
async function docsmintRequest(ctx, config, path, options = {}) {
  const connection = await resolveConnection(ctx, config)
  if (!connection.apiKey) {
    return failure(
      'no-credential',
      'No DocsMint API key is configured. Add one in the DocsMint sidebar panel, or set the DOCSMINT_API_KEY environment variable.',
      401,
    )
  }
  /** @type {Record<string, string>} */
  const headers = { accept: 'application/json', authorization: `Bearer ${connection.apiKey}` }
  if (str(options.workspaceId) ?? connection.workspace) headers['x-docsmint-workspace'] = str(options.workspaceId) ?? connection.workspace
  /** @type {{ method: string, headers: Record<string, string>, signal?: AbortSignal, body?: string }} */
  const init = { method: options.method ?? 'GET', headers, redirect: 'error' }
  if (options.signal) init.signal = options.signal
  if (options.body !== undefined) {
    headers['content-type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }

  let response
  try {
    if (connection.generation !== stateFor(ctx).generation || !stateFor(ctx).active) return failure('connection-changed', 'The DocsMint connection changed.', 409)
    response = await fetch(connection.apiBase + path, init)
  } catch (error) {
    if (options.signal?.aborted) return failure('aborted', 'The DocsMint request was cancelled.', 0)
    return failure('network', 'Could not reach the configured DocsMint server.', 0)
  }

  let text = ''
  try {
    if (Number(response.headers.get('content-length')) > 1_048_576) { await response.body?.cancel(); return failure('response-too-large', 'The DocsMint response was too large.', 502) }
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let size = 0
    if (reader) while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 1_048_576) { await reader.cancel(); return failure('response-too-large', 'The DocsMint response was too large.', 502) }
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
  } catch { return failure('response-read', 'The DocsMint response could not be read.', 502) }
  if (text.includes(connection.apiKey)) return failure('response-rejected', 'The DocsMint response contained private credentials.', 502)
  /** @type {any} */
  let data
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = undefined
    }
  }
  if (!response.ok) {
    return failure(codeForStatus(response.status), `DocsMint returned HTTP ${response.status}.`, response.status)
  }
  return { ok: true, status: response.status, data: data ?? {} }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:645-663](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L645-L663)

更新请求没有版本前置条件。

<details>
<summary>查看原文（19行）</summary>

```text
async function runUpdate(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  const id = str(options.id)
  if (!id) return failure('missing-id', 'A DocsMint document id is required.', 400)
  /** @type {Record<string, unknown>} */
  const body = {}
  const title = str(options.title)
  if (title) body.title = title
  if (typeof options.content === 'string') body.content = options.content
  if (Object.keys(body).length === 0) return failure('empty-update', 'Nothing to update.', 400)

  if (connection.mode !== 'mcp') {
    return docsmintRequest(ctx, config, `/documents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body,
      signal: options.signal,
    })
  }
  return mcpInvoke(ctx, config, connection, 'update', { id, title: body.title, content: body.content })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/index.js:1416-1427](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1416-L1427)

edit呈现及直接写调用，无本地审批。

<details>
<summary>查看原文（12行）</summary>

```text
      presentCall: (args) => ({ card: 'generic', title: `Create DocsMint document: ${str(args?.title) ?? ''}`, kind: 'edit', rawInput: args }),
      async execute(args, exec) {
        const input = toolArgs(args)
        const result = await runCreate(ctx, config, {
          title: input.title,
          content: input.content,
          folderId: input.folderId,
          signal: exec?.signal,
        })
        if (!result.ok) throwFailure(result)
        const document = await normalizeWithLink(ctx, config, await resolveConnection(ctx, config), result.data)
        return { id: document.id, title: document.title, url: document.url }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin/mcp.js:643-661](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/mcp.js#L643-L661)

会话signal与401刷新重发。

<details>
<summary>查看原文（19行）</summary>

```text
export function createMcpSession(options) {
  const { endpoint, authorize, signal } = options
  /** @type {string | undefined} */
  let sessionId
  /** @type {any[] | undefined} */
  let tools
  /** @type {any} */
  let server

  async function rpc(method, params) {
    const auth = await authorize(false)
    if (!auth?.headers) return auth?.error ?? failure('mcp-no-credential', 'No DocsMint MCP credential is configured.', 401)
    let result = await rpcOnce(endpoint, auth, sessionId, method, params, signal)
    if (!result.ok && (result.status === 401 || result.code === 'mcp-401')) {
      const renewed = await authorize(true)
      if (renewed?.headers) result = await rpcOnce(endpoint, renewed, sessionId, method, params, signal)
    }
    if (result.sessionId) sessionId = result.sessionId
    return result
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin/index.js:414-444](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L414-L444)

MCP会话与invoke接口。

<details>
<summary>查看原文（31行）</summary>

```text
function mcpSessionFor(ctx, config, connection) {
  const endpoint = `${connection.webBase}/mcp`
  const cacheKey = `${endpoint}|${connection.deployment}`
  const cached = stateFor(ctx).sessions.get(cacheKey)
  if (cached) return cached
  const session = createMcpSession({
    endpoint,
    authorize: (force) => ensureMcpAuth(ctx, config, connection, force),
  })
  stateFor(ctx).sessions.set(cacheKey, session)
  return session
}

/**
 * @param {any} ctx - registrant context.
 * @param {Record<string, unknown> | undefined} config - the Loader row config.
 * @param {any} connection - resolved connection.
 * @param {'search' | 'list' | 'get' | 'create'} kind - operation.
 * @param {Record<string, any>} input - canonical input.
 * @returns {Promise<any>} the REST-shaped operation outcome.
 */
async function mcpInvoke(ctx, config, connection, kind, input) {
  return mcpSessionFor(ctx, config, connection).invoke(kind, input)
}

/**
 * Whether the deployment has the credential MCP needs, without a network call.
 *
 * @param {any} ctx - registrant context.
 * @param {Record<string, unknown> | undefined} config - the Loader row config.
 * @param {any} connection - resolved connection.
```

</details>

#### 缺口

- 未核查DocsMint服务端的并发控制、写幂等、权限模型及真实取消。
  **影响**：不能确认冲突不会覆盖、失败没有写入或取消已停止。
  **进一步探讨**：在测试工作区并发编辑、丢弃写响应、取消MCP，按id回读实际内容。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 双传输和云端/自建授权需要什么，插件的增量如何归因？

**研究主题**：依赖、兼容与流程、效果与总成本、贡献与相对优势

#### 完整回答

云端 MCP 使用动态客户端注册、PKCE/state与回调，令牌经宿主凭据服务存储；API模式使用key，自建MCP使用实例key。OAuth开始前要求凭据存储和Web origin，缺失就明确拒绝；刷新时合并并发请求，generation变更后拒绝写入旧连接令牌。它降低手工配置协议认证的负担，但模型、文档持久化、检索排序与服务可用性都在外部。

连接由插件上下文保存，共享所配置工作区与凭据，不是按每个Agent会话单独连接；工具没有逐次选择不同工作区的完整参数。因此适合一个受信使用环境，不能据Host授权门禁推断多人数据隔离。包声明Node>=22、DSH>=0.2.1-rc.5且<0.3.0；作者称测试过指定服务和协议版本，本次未运行这些测试，不保证任意MCP实现的工具名映射正确。

首次成本是账号/自建实例、连接授权和选择工作区；持续有模型调用、云端套餐或自建主机/索引维护，具体金额未知。失败恢复要先搜索/回读确认写结果，再处理授权、冲突和重连，避免重复创建；卸载插件不删除远端文档，需要单独处理其授权。没有完整任务和费用对照，不计算单位文档成本，也不把免手工复制等同业务创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:752-812](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L752-L812)

云端OAuth开始条件与PKCE。

<details>
<summary>查看原文（61行）</summary>

```text
async function startOAuth(ctx, config) {
  const generation = stateFor(ctx).generation
  const connection = await resolveConnection(ctx, config)
  if (connection.deployment !== 'cloud') {
    return failure(
      'oauth-cloud-only',
      'OAuth is the DocsMint Cloud flow. A self-hosted instance authenticates MCP with its own API key.',
      400,
    )
  }
  const credentials = /** @type {any} */ (ctx.get('credentials'))
  if (!credentials || typeof credentials.set !== 'function') {
    return failure('no-credential-store', 'This profile has no credential store, so the OAuth token cannot be kept.', 409)
  }

  let origin
  try {
    origin = String(ctx.webServer.getOrigin()).replace(/\/+$/, '')
  } catch {
    return failure('no-origin', 'The Web server has not bound its port yet; retry in a moment.', 503)
  }

  const discovery = await discoverAuthorization(connection.webBase)
  if (!discovery.ok) return discovery

  const redirectUri = `${origin}${OAUTH_PATH}`
  const scope = discovery.scopes.length > 0 ? discovery.scopes.join(' ') : undefined
  const registration = await registerOAuthClient(discovery.metadata, { redirectUri, scope })
  if (!registration.ok) return registration

  for (const [key, entry] of stateFor(ctx).pending) {
    if (Date.now() - entry.createdAt > 10 * 60_000) stateFor(ctx).pending.delete(key)
  }

  const state = randomToken(24)
  const { verifier, challenge } = await pkcePair()
  if (!stateFor(ctx).active || stateFor(ctx).generation !== generation) return failure('connection-changed', 'The DocsMint connection changed.', 409)
  stateFor(ctx).pending.set(state, {
    verifier,
    clientId: registration.clientId,
    redirectUri,
    resource: discovery.resource,
    metadata: discovery.metadata,
    tokenEndpoint: str(discovery.metadata.token_endpoint),
    createdAt: Date.now(),
  })

  return {
    ok: true,
    authorizeUrl: authorizationUrl(discovery.metadata, {
      clientId: registration.clientId,
      redirectUri,
      scope,
      resource: discovery.resource,
      state,
      challenge,
    }),
    redirectUri,
    scopes: discovery.scopes,
    resource: discovery.resource,
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:356-397](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L356-L397)

刷新合并和generation检查。

<details>
<summary>查看原文（42行）</summary>

```text
async function ensureMcpAuth(ctx, config, connection, force = false) {
  if (stateFor(ctx).blocked || connection.generation !== stateFor(ctx).generation) return { error: failure('connection-changed', 'The DocsMint connection changed.', 409) }
  if (!stateFor(ctx).active) return { error: failure('context-unloaded', 'The DocsMint profile was unloaded.', 409) }
  if (connection.deployment === 'cloud') {
    const record = await readOAuthRecord(ctx)
    if (connection.generation !== stateFor(ctx).generation) return { error: failure('connection-changed', 'The DocsMint connection changed.', 409) }
    if (!record?.access_token) {
      return {
        error: failure(
          'mcp-needs-oauth',
          'DocsMint Cloud MCP is authorized through the OAuth flow. Press "Connect with OAuth" in the DocsMint panel.',
          401,
        ),
      }
    }
    const expiresAt = Number(record.expires_at) || 0
    if (!force && expiresAt - Date.now() > 60_000) {
      return { headers: { authorization: `Bearer ${record.access_token}` } }
    }
    if (!record.refresh_token) {
      if (expiresAt > Date.now() && !force) return { headers: { authorization: `Bearer ${record.access_token}` } }
      return {
        error: failure('mcp-token-expired', 'The DocsMint Cloud OAuth token expired. Reconnect it in the DocsMint panel.', 401),
      }
    }
    const state = stateFor(ctx)
    if (!state.active) return { error: failure('context-unloaded', 'The DocsMint profile was unloaded.', 409) }
    if (state.refresh) return state.refresh
    const generation = state.generation
    const refresh = (async () => {
      const refreshed = await refreshOAuthToken(
        { token_endpoint: record.token_endpoint },
        { clientId: record.client_id, refreshToken: record.refresh_token, resource: record.resource },
      )
      if (!refreshed.ok) return { error: refreshed }
      if (!state.active || state.generation !== generation) return { error: failure('connection-changed', 'The DocsMint connection changed. Retry the request.', 409) }
      const next = { ...record, access_token: refreshed.tokens.accessToken, refresh_token: refreshed.tokens.refreshToken ?? record.refresh_token, expires_at: refreshed.tokens.expiresAt }
      await writeOAuthRecord(ctx, next)
      return { headers: { authorization: `Bearer ${next.access_token}` } }
    })()
    state.refresh = refresh
    try { return await refresh } finally { if (state.refresh === refresh) state.refresh = null }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:251-279](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L251-L279)

连接/工作区为上下文解析。

<details>
<summary>查看原文（29行）</summary>

```text
async function resolveConnection(ctx, config) {
  return mutateCredentials(ctx, () => resolveConnectionSnapshot(ctx, config))
}
async function resolveConnectionSnapshot(ctx, config) {
  const generation = stateFor(ctx).generation
  const endpoint = await resolveEndpoint(ctx, config)
  const mode = await resolveMode(ctx, config)
  const key = await resolveCredential(ctx, KEY_REF, str(config?.apiKey))
  const workspace = await resolveCredential(ctx, WORKSPACE_REF, str(config?.workspace))
  const webBase = (str(config?.webBaseUrl) ?? deriveWebBase(endpoint.apiBase)).replace(/\/+$/, '')
  const pinnedDeployment = str(config?.deployment)
  const deployment =
    pinnedDeployment === 'cloud' || pinnedDeployment === 'self-hosted' ? pinnedDeployment : endpoint.deployment
  return {
    generation,
    apiBase: endpoint.apiBase,
    webBase,
    deployment,
    endpointSource: endpoint.source,
    endpointLocked: endpoint.locked,
    endpointWarning: endpoint.warning,
    mode: mode.mode,
    modeSource: mode.source,
    modeLocked: mode.locked,
    pageSize: defaultPageSize(config),
    apiKey: stateFor(ctx).blocked ? undefined : key?.value,
    keySource: key?.source,
    workspace: workspace?.value,
    workspaceSource: workspace?.source,
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin/index.js:414-424](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L414-L424)

上下文MCP缓存。

<details>
<summary>查看原文（11行）</summary>

```text
function mcpSessionFor(ctx, config, connection) {
  const endpoint = `${connection.webBase}/mcp`
  const cacheKey = `${endpoint}|${connection.deployment}`
  const cached = stateFor(ctx).sessions.get(cacheKey)
  if (cached) return cached
  const session = createMcpSession({
    endpoint,
    authorize: (force) => ensureMcpAuth(ctx, config, connection, force),
  })
  stateFor(ctx).sessions.set(cacheKey, session)
  return session
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin/package.json:1-29](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/package.json#L1-L29)

版本许可与宿主范围。

<details>
<summary>查看原文（29行）</summary>

```text
{
  "name": "@hiai-gg/dsh-docsmint",
  "version": "1.0.0",
  "description": "DocsMint for DeepSeek Harness: a left-sidebar panel and four agent tools over the DocsMint REST API or the DocsMint MCP server (OAuth for DocsMint Cloud, API key for self-hosted).",
  "license": "Apache-2.0",
  "author": "DocsMint (https://docsmint.com)",
  "homepage": "https://docsmint.com",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/HiAi-gg/docsmint.git",
    "directory": "packages/dsh-plugin"
  },
  "bugs": {
    "url": "https://github.com/HiAi-gg/docsmint/issues"
  },
  "keywords": [
    "dsh",
    "dsh-plugin",
    "deepseek-harness",
    "docsmint",
    "mcp",
    "model-context-protocol",
    "knowledge-base"
  ],
  "type": "module",
  "engines": {
    "node": ">=22",
    "dsh": ">=0.2.1-rc.5 <0.3.0"
  },
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin/README.md:43-55](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/README.md#L43-L55)

卸载不删除远端文档的作者说明。

<details>
<summary>查看原文（13行）</summary>

````text
Then open the **DocsMint** icon in the left sidebar and connect.

## Updating and removing

Install a specific newer version in the same profile with the profile-scoped
`dsh plugin --profile web add` command above. To remove it:

```bash
dsh plugin --profile web remove @hiai-gg/dsh-docsmint
```

Removing the bundle does not delete DocsMint documents. Disconnect the plugin's
own authorization before removal when needed; other integrations are unaffected.
````

</details>

#### 缺口

- 外部服务定价、可用性、检索质量与真实任务成本未验证。
  **影响**：无法确认净收益或自建维护负担。
  **进一步探讨**：固定测试工作区做相同检索-阅读-保存任务，记录命中、回读一致、调用和人工成本。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些具体任务可试用，值得验证的生产方向是什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议已有DocsMint知识库的个人用户先在测试工作区放几篇已知内容，搜索后按id读取核对，创建一篇小Markdown并回读，更新前保留正文副本，避免多人同时修改。先固定端点和工作区，再核对面板与工具看到的内容；失败时先确认远端是否已经写入。工作区错误、正文不一致或并发覆盖时停止写工具，保留id和原文，回DocsMint原界面处理。

值得验证的增量是带版本和写后回读的受控保存：先显示目标工作区/id与差异，提交时使用服务端支持的版本前置条件或拒绝覆盖，未知结果用操作标识查询而不是盲重试。依据是当前适配器已把读写集中，但没有本地冲突前置条件和幂等核验。它相对普通MCP桥接增加可靠保存，不把语义检索当原创。最小实验用并发编辑、响应丢失和错误工作区三类故障比较误覆盖、重复文档、恢复工时及全部调用；若服务端/现有工具已经同样保护，或新增确认显著拖慢却不减错误，方向被推翻。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin/index.js:645-663](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L645-L663)

版本前置条件的缺口。

<details>
<summary>查看原文（19行）</summary>

```text
async function runUpdate(ctx, config, options = {}) {
  const connection = await resolveConnection(ctx, config)
  const id = str(options.id)
  if (!id) return failure('missing-id', 'A DocsMint document id is required.', 400)
  /** @type {Record<string, unknown>} */
  const body = {}
  const title = str(options.title)
  if (title) body.title = title
  if (typeof options.content === 'string') body.content = options.content
  if (Object.keys(body).length === 0) return failure('empty-update', 'Nothing to update.', 400)

  if (connection.mode !== 'mcp') {
    return docsmintRequest(ctx, config, `/documents/${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body,
      signal: options.signal,
    })
  }
  return mcpInvoke(ctx, config, connection, 'update', { id, title: body.title, content: body.content })
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin/index.js:918-975](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L918-L975)

未知网络结果和直接写边界。

<details>
<summary>查看原文（58行）</summary>

```text
async function docsmintRequest(ctx, config, path, options = {}) {
  const connection = await resolveConnection(ctx, config)
  if (!connection.apiKey) {
    return failure(
      'no-credential',
      'No DocsMint API key is configured. Add one in the DocsMint sidebar panel, or set the DOCSMINT_API_KEY environment variable.',
      401,
    )
  }
  /** @type {Record<string, string>} */
  const headers = { accept: 'application/json', authorization: `Bearer ${connection.apiKey}` }
  if (str(options.workspaceId) ?? connection.workspace) headers['x-docsmint-workspace'] = str(options.workspaceId) ?? connection.workspace
  /** @type {{ method: string, headers: Record<string, string>, signal?: AbortSignal, body?: string }} */
  const init = { method: options.method ?? 'GET', headers, redirect: 'error' }
  if (options.signal) init.signal = options.signal
  if (options.body !== undefined) {
    headers['content-type'] = 'application/json'
    init.body = JSON.stringify(options.body)
  }

  let response
  try {
    if (connection.generation !== stateFor(ctx).generation || !stateFor(ctx).active) return failure('connection-changed', 'The DocsMint connection changed.', 409)
    response = await fetch(connection.apiBase + path, init)
  } catch (error) {
    if (options.signal?.aborted) return failure('aborted', 'The DocsMint request was cancelled.', 0)
    return failure('network', 'Could not reach the configured DocsMint server.', 0)
  }

  let text = ''
  try {
    if (Number(response.headers.get('content-length')) > 1_048_576) { await response.body?.cancel(); return failure('response-too-large', 'The DocsMint response was too large.', 502) }
    const reader = response.body?.getReader()
    const decoder = new TextDecoder()
    let size = 0
    if (reader) while (true) {
      const { done, value } = await reader.read()
      if (done) break
      size += value.byteLength
      if (size > 1_048_576) { await reader.cancel(); return failure('response-too-large', 'The DocsMint response was too large.', 502) }
      text += decoder.decode(value, { stream: true })
    }
    text += decoder.decode()
  } catch { return failure('response-read', 'The DocsMint response could not be read.', 502) }
  if (text.includes(connection.apiKey)) return failure('response-rejected', 'The DocsMint response contained private credentials.', 502)
  /** @type {any} */
  let data
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = undefined
    }
  }
  if (!response.ok) {
    return failure(codeForStatus(response.status), `DocsMint returned HTTP ${response.status}.`, response.status)
  }
  return { ok: true, status: response.status, data: data ?? {} }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin/index.js:1390-1427](https://github.com/HiAi-gg/docsmint/blob/e88abdc17d0b565428c36793533939a50152b0d3/packages/dsh-plugin/index.js#L1390-L1427)

创建返回id但不回读。

<details>
<summary>查看原文（38行）</summary>

```text
      name: 'docsmint_create_document',
      description:
        'Create a DocsMint document in the user\'s workspace from Markdown content. Returns the new document id and its link. Use it when the user asks to save findings into DocsMint.',
      parameters: {
        type: 'object',
        additionalProperties: false,
        required: ['title', 'content'],
        properties: {
          title: { type: 'string', description: 'Document title.' },
          content: { type: 'string', description: 'Markdown body of the new document.' },
          folderId: { type: 'string', description: 'Optional DocsMint folder id to place the document in.' },
        },
      },
      output: {
        schema: {
          type: 'object',
          additionalProperties: false,
          required: ['id', 'title', 'url'],
          properties: {
            id: { type: 'string' },
            title: { type: 'string' },
            url: { type: 'string' },
          },
        },
        render: (_args, value) => [{ type: 'text', text: `Created DocsMint document "${value?.title ?? ''}" (${value?.id ?? ''}) at ${value?.url ?? ''}.` }],
      },
      presentCall: (args) => ({ card: 'generic', title: `Create DocsMint document: ${str(args?.title) ?? ''}`, kind: 'edit', rawInput: args }),
      async execute(args, exec) {
        const input = toolArgs(args)
        const result = await runCreate(ctx, config, {
          title: input.title,
          content: input.content,
          folderId: input.folderId,
          signal: exec?.signal,
        })
        if (!result.ok) throwFailure(result)
        const document = await normalizeWithLink(ctx, config, await resolveConnection(ctx, config), result.data)
        return { id: document.id, title: document.title, url: document.url }
```

</details>

#### 缺口

- 试用和可靠保存对照均未执行，服务端条件写能力未知。
  **影响**：不能宣称方案已可实现或有需求。
  **进一步探讨**：先核服务端版本/操作查询能力，再做受控故障对照。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
