# @hyzyn/dsh-search

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search)

<!-- BEGIN META -->
[![GitHub ★ 62](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=62&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hyzyn/dsh-plugin-kit) [![npm 30d 4,254](https://img.shields.io/static/v1?label=npm+30d&message=4%2C254&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-search) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hyzyn/dsh-search)
<!-- END META -->

> **功能**：在 DSH Web 界面统一搜索历史会话、Prompt、MCP 工具与设置，并导航到命中对象。

> **亮点**：贡献是把四类既有资源和导航组织为一个键盘入口，并兼顾本地候选、旧响应丢弃及可见会话过滤；净找回效果未测，见[Q01](#research-q01)和[Q02](#research-q02)。

> **主要限制**：FTS和回退扫描的事件范围、排序与覆盖不同，内部超时截断未进入公开结果；空清单不能证明没有记录，见[Q03](#research-q03)。

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
  - [Q01 · 统一入口带来什么增量？](#detail-section-11)
  - [Q02 · 查询与跳转怎样接线？](#detail-section-12)
  - [Q03 · 全文索引与回退扫描是否等价？](#detail-section-13)
  - [Q04 · 本地访问和缓存有何边界？](#detail-section-14)
  - [Q05 · 采用与全周期成本如何判断？](#detail-section-15)
  - [Q06 · 什么改进值得小样本验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：可信本机DSH用户需要找回既有消息、Prompt或设置位置，可用统一面板减少跨入口寻找，合格交付仍须正确打开和回看上下文，见[Q01](#research-q01)。

原办法是分别用会话历史、Prompt管理和设置导航。统一入口组织现有查询和视图跳转，不提供新全文索引。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件与边界 |
| --- | --- | --- |
| 历史会话 | 全文查消息并导航 | FTS与有限回退不等价，非完整性证明 |
| Prompt | 搜索托管版本内容 | 片段可能来自非当前版本 |
| MCP名称 | 查已加载工具描述并转配置 | 不执行工具、不查任意server |
| 设置目录 | 统一查一级分类与已知卡片 | 硬编码卡目录需维护，DOM跳转可失效 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必需性 | 用途 | 不满足时 |
| --- | --- | --- | --- |
| 兼容Node/DSH Web与共享kit | 必需 | Host与客户端挂载 | 包声明不代替安装验收 |
| sessionQuery与可见会话服务 | 会话检索必需 | FTS或有限原始事件扫描 | 无服务/列表可用时可能空结果 |
| prompts.yml托管格式 | Prompt检索必需 | 只读所有版本 | 缺失或解析失败不证明没有Prompt |
| 工具schemas及设置注册 | 对应类别必需 | 名称与目录枚举 | 不检索任意未加载工具 |
| 可信本机访问 | 当前围栏条件 | 回环/Host/Origin检查 | 非多主体授权，不保证代理兼容 |

#### 使用流程

| 步骤 | 动作 | 判据/退路 |
| --- | --- | --- |
| 准备 | 用已知冷热会话和设置样本核对 | 记录原入口基线 |
| 输入 | 至少两字符才请求Host | 先看到最近快照非全文完成 |
| 查看 | 分组命中并点击导航 | 核对上下文与Prompt版本 |
| 未命中 | 回原入口查找并核对扫描范围 | 不当资源不存在 |
| 退出 | 停用插件或公告 | 路由释放，回原生入口 |

**效果与成本**

#### 成本

| 阶段 | 资源/现金 | 人工 | 未知 |
| --- | --- | --- | --- |
| 首次 | 本地安装资源，无专用外部搜索API调用 | 核对宿主、文件和快捷键 | 时间未知 |
| 持续 | 解压扫描、模块缓存；可选公告占提示上下文 | 维护硬编码卡片目录 | CPU/内存峰值、净费用未知 |
| 失败 | 重试/冷扫描资源 | 区分漏检、缓存与导航失败 | 恢复耗时未知 |
| 退出 | 本地配置保留量未知 | 停用并回原入口 | 无迁移耗时测量 |

#### 效果

| 效果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 统一入口 | 四类资源分组并跳转 | 净找回率和节时 |
| 响应组织 | 本地先渲染、取消旧请求与缓存 | 零延迟、严格内存上限 |
| 全文降级 | 有限扫描维持部分可用 | 与FTS覆盖/排序完全一致 |

> **思考**：FTS和回退扫描的事件范围、排序与覆盖不同，内部超时截断未进入公开结果；空清单不能证明没有记录，见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是把四类既有资源和导航组织为一个键盘入口，并兼顾本地候选、旧响应丢弃及可见会话过滤；净找回效果未测，见[Q01](#research-q01)和[Q02](#research-q02)。

请求序列、取消及可见集合过滤有实际实现；有限扫描避免等待无界，但超时状态被响应层丢弃，事件口径也与FTS有差异。模块缓存不含ctx身份，隔离需依宿主实例方式验证，见[Q03](#research-q03)和[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

FTS和回退扫描的事件范围、排序与覆盖不同，内部超时截断未进入公开结果；空清单不能证明没有记录，见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

可信本机用户先用已知冷热会话、旧Prompt版本和设置卡样本核对查询及导航；空结果回原入口确认。持续漏关键历史、跳错卡或快捷键干扰时停用，不扩到敏感多主体部署，见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

统一查询与视图接线有源码支持；找回率、跨宿主兼容、资源峰值未测。覆盖状态设计为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/search/README.md、packages/search/package.json、packages/search/src/index.ts、packages/search/client.js 及固定范围 inventory；组件：packages/search。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：INVENTORY覆盖子包；定向检查Prompt解析、FTS/扫描/缓存/可见集合、目录过滤、回环路由、客户端请求与跳转。未执行宿主或测试，未审计宿主索引实现和所有DOM兼容分支。
- 下一步：- 固定源码检查，无目标执行。
- 未安装、未跑性能或宿主验收。
- 回退口径和截断差异是静态结果，未复现。
- 多上下文缓存复用是待核部署条件，不声称已泄露。

**分析版本**

- **仓库**：[hyzyn/dsh-plugin-kit](https://github.com/hyzyn/dsh-plugin-kit)
- **版本号**：0.4.18（[固定提交 44554d7](https://github.com/hyzyn/dsh-plugin-kit/tree/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是将检索模式、覆盖与失败状态传到界面，并统一FTS/回退口径；应以冷历史和失败样本比较漏检误判与额外负担，见[Q06](#research-q06)。

- 固定源码检查，无目标执行。
- 未安装、未跑性能或宿主验收。
- 回退口径和截断差异是静态结果，未复现。
- 多上下文缓存复用是待核部署条件，不声称已泄露。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 3131 | 2538 | 421 | — |
| .md | source | 2 | 247 | — | — | 3547 |
| .mjs | source | 2 | 1213 | 962 | 152 | — |
| .ts | source | 1 | 996 | 794 | 135 | — |
| .ts | test | 6 | 691 | 487 | 125 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+created%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z) [![近30天关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/hyzyn/dsh-plugin-kit/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T02%3A09%3A31.809Z..2026-11-06T02%3A09%3A31.809Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：统一检索是否帮助用户找回既有资源，回退与跳转在哪些条件下失效？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一入口带来什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户要找回既有会话的一句话、已保存Prompt、MCP工具名称或配置位置，原办法是在会话列表、Prompt管理和设置里分别定位。组件用同一个键盘面板分组返回这些对象，并将命中转成视图导航；候选价值在减少跨入口寻找，不是新的搜索算法，也不是找到MCP名称后直接执行工具。合格交付是命中能打开正确对象、片段可回到上下文；没有结果不能替代资源不存在的证据。

最近会话先由客户端快照显示，非远端全文搜索已完成；工具检索枚举当前tools.schemas的mcp__名称与描述，不覆盖任意未加载server或工具调用结果。设置目录包含硬编码卡片与客户端实时一级slots，目录维护遗漏会造成卡片可见但搜不到。已满意于原生搜索或只用少量设置的用户，统一入口增量可能有限。

#### 证据与依据

**依据 1 · 作者声明**：[packages/search/README.md:5-12](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/README.md#L5-L12)

作者统一入口定位。

```text
> DSH 侧边栏「全局搜索」入口（**⌘ / Ctrl + K** 同样唤出）：命令面板式搜索，一处找到历史会话、Prompt、MCP 工具与设置。

## 特性

- **本地缓存先出结果**：不发请求、零延迟——先用缓存渲染，再补齐远端结果。
- **四类目标统一检索**：历史会话、Prompt、MCP 工具、设置面板在同一面板内分组呈现。
- **键盘优先**：⌘/Ctrl+K 唤出；行 = 图标 + 标题（可带副标题）+ 右侧元信息 + 快捷键胶囊。
- **结果可直接跳转**：命中即跳，不必先定位它在哪个设置页。
```

**依据 2 · 源码核查**：[packages/search/src/index.ts:592-610](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L592-L610)

MCP仅枚举schema，不执行。

<details>
<summary>查看原文（19行）</summary>

```text
function searchMcpTools(ctx: Context, rawQuery: string, limit: number): McpToolHit[] {
  const query = normalizeQuery(rawQuery)
  if (query === '') return []
  const tools = getService(ctx, 'tools') as {
    schemas?(scope?: unknown): Array<{ name: string; description?: string }>
  } | undefined
  if (tools?.schemas === undefined) return []
  const schemas = tools.schemas()
  const hits: McpToolHit[] = []
  for (const schema of schemas) {
    if (hits.length >= limit) break
    if (!schema.name.startsWith('mcp__')) continue
    if (!includesText(schema.name, query) && !includesText(schema.description, query)) continue
    hits.push({ name: schema.name, description: schema.description ?? '' })
  }
  return hits
}

/* ------------------------------------------------------------------ *
```

</details>

**依据 3 · 源码核查**：[packages/search/src/index.ts:793-828](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L793-L828)

面板来自有限目录。

<details>
<summary>查看原文（36行）</summary>

```text
function listPanels(ctx: Context): PanelEntry[] {
  const loaded = getLoadedRegistryNames(ctx)
  const items: PanelEntry[] = []
  for (const panel of PANEL_DIRECTORY) {
    if (panel.registryName !== undefined && !loaded.has(panel.registryName)) continue
    items.push({
      id: panel.id,
      kind: panel.kind,
      name: panel.titles[0],
      titles: panel.titles,
      keywords: panel.keywords,
      description: panel.description,
    })
  }
  return items
}

function searchPanels(ctx: Context, rawQuery: string, limit: number): PanelHit[] {
  const query = normalizeQuery(rawQuery)
  if (query === '') return []
  const hits: PanelHit[] = []
  for (const panel of listPanels(ctx)) {
    if (hits.length >= limit) break
    const searchable = [...panel.titles, ...panel.keywords, panel.description].map(normalizeQuery)
    const matched = searchable.some((text) => text.includes(query))
    if (!matched) continue
    hits.push({
      id: panel.id,
      kind: panel.kind,
      name: panel.name,
      titles: panel.titles,
      description: panel.description,
      snippet: makeSnippet([...panel.titles, panel.description].join('，'), query),
    })
  }
  return hits
```

</details>

**依据 4 · 源码核查**：[packages/search/client.js:779-802](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L779-L802)

客户端枚举一级settings.section。

<details>
<summary>查看原文（24行）</summary>

```text
     * 实时枚举设置一级大类（settings.section 槽）。
     * 这是拿到第三方大类的唯一来源——皮肤 / 宠物 / 侧边卡片 / Web 插件 这些
     * 插件注册的大类在宿主静态目录里根本不存在。顺序与设置窗导航一致（按 order 排序），
     * 因此第 N 条对应导航第 N 个按钮。
     */
    function liveSections() {
      const slots = slotsService()
      if (slots === undefined) return []
      let entries
      try {
        entries = slots.entries('settings.section')
      } catch {
        return []
      }
      if (!Array.isArray(entries)) return []
      const rows = []
      for (const entry of entries) {
        const options = entry && typeof entry.options === 'object' && entry.options !== null ? entry.options : {}
        const label = slotLabel(options.label)
        const id = typeof options.id === 'string' ? options.id : ''
        if (label === '' && id === '') continue
        rows.push({
          id: id || label,
          order: typeof options.order === 'number' ? options.order : 0,
```

</details>

#### 缺口

- 没有找回任务的原生入口对照。
  **影响**：不能证明统一入口节时或增加找回率。
  **进一步探讨**：用已知会话/Prompt/设置任务比较正确打开率和总耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 查询与跳转怎样接线？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

Web client输入后延迟发GET/query，先中止旧请求并用递增序列丢弃过期响应。Host并行调用会话服务、只读prompts.yml托管区块、MCP schemas和面板目录，按类最多默认8条、配置上限50。Prompt搜索查全部版本的内容/标签/备注，active标记只表示Prompt被选中，不表示片段来自当前生效版本。

会话点击优先uiWorkspace.openSession，兼容旧sessions.open，随后在DOM虚拟列表里逐屏向上找文字；找不到会恢复原滚动位置，因此“能打开”不保证精确定位。Prompt/MCP点击转设置卡，Prompt无法跳转时可复制片段；设置定位仍有DOM标题/宿主形态依赖。运行需兼容Web宿主、sessions与可用查询/持久化服务；Prompt托管格式与配置目录需匹配。只有Host导出与Web接线确认是DSH插件，不将包发布声明当安装成功。

#### 证据与依据

**依据 1 · 源码核查**：[packages/search/src/index.ts:199-220](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L199-L220)

Prompt遍历所有版本并标记Prompt是否active。

<details>
<summary>查看原文（22行）</summary>

```text
function searchPrompts(rawQuery: string, limit: number): PromptHit[] {
  const query = normalizeQuery(rawQuery)
  if (query === '') return []
  const managed = readPromptStore()
  const hits: PromptHit[] = []
  for (const prompt of managed.store.prompts) {
    if (hits.length >= limit) break
    const nameHit = includesText(prompt.name, query)
    const descriptionHit = includesText(prompt.description, query)
    const version = prompt.versions.find((item) =>
      includesText(item.content, query) || includesText(item.label, query) || includesText(item.note, query),
    )
    if (!nameHit && !descriptionHit && version === undefined) continue
    const snippet = version !== undefined
      ? makeSnippet(version.content, query)
      : (prompt.description ?? prompt.name)
    hits.push({
      id: prompt.id,
      name: prompt.name,
      ...(prompt.description !== undefined ? { description: prompt.description } : {}),
      snippet,
      active: prompt.id === managed.store.activePromptId,
```

</details>

**依据 2 · 源码核查**：[packages/search/src/index.ts:885-947](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L885-L947)

实际路由并行查询与结果限额。

<details>
<summary>查看原文（63行）</summary>

```text
function makeRoutes(ctx: Context, config: Config): Array<{ kind: 'exact'; path: string; handler: RouteHandler }> {
  const maxResults = Math.max(1, Math.min(50, config.maxResults ?? 8))
  const maxScanSessions = Math.max(1, Math.min(500, config.maxScanSessions ?? MAX_SCAN_SESSIONS))
  return [
    {
      kind: 'exact',
      path: '/api/dsh-search/catalog',
      handler: async (req, res) => {
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        if (req.method !== 'GET') {
          writeJson(res, 405, { error: 'method not allowed: ' + String(req.method) })
          return
        }
        // 目录是静态清单（不含用户数据），开关只受 includePanels 控制
        writeJson(res, 200, { ok: true, panels: config.includePanels !== false ? listPanels(ctx) : [] })
      },
    },
    {
      kind: 'exact',
      path: '/api/dsh-search/query',
      handler: async (req, res) => {
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        if (req.method !== 'GET') {
          writeJson(res, 405, { error: 'method not allowed: ' + String(req.method) })
          return
        }
        let query = ''
        try {
          query = new URL('http://localhost' + (req.url ?? '/')).searchParams.get('q') ?? ''
        } catch {
          writeJson(res, 400, { error: 'invalid query string' })
          return
        }
        const q = query.trim()
        if (q === '') {
          writeJson(res, 200, { ok: true, query: '', sessions: [], prompts: [], tools: [], panels: [] })
          return
        }
        const controller = new AbortController()
        const reqEvents = req as unknown as {
          once(event: string, listener: () => void): void
          removeListener(event: string, listener: () => void): void
        }
        const onClose = () => controller.abort()
        reqEvents.once('close', onClose)
        try {
          const [sessions, prompts, tools, panels] = await Promise.all([
            config.includeSessions !== false ? searchSessions(ctx, q, maxResults, controller.signal, maxScanSessions) : Promise.resolve([]),
            config.includePrompts !== false ? Promise.resolve(searchPrompts(q, maxResults)) : Promise.resolve([]),
            config.includeMcpTools !== false ? Promise.resolve(searchMcpTools(ctx, q, maxResults)) : Promise.resolve([]),
            config.includePanels !== false ? Promise.resolve(searchPanels(ctx, q, maxResults)) : Promise.resolve([]),
          ])
          writeJson(res, 200, { ok: true, query: q, sessions, prompts, tools, panels })
        } catch (error) {
          writeJson(res, 500, { error: '搜索失败: ' + (error instanceof Error ? error.message : String(error)) })
        } finally {
          reqEvents.removeListener('close', onClose)
```

</details>

**依据 3 · 源码核查**：[packages/search/client.js:1194-1241](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L1194-L1241)

中止旧请求及序列保护。

<details>
<summary>查看原文（48行）</summary>

```text
    async function runSearch() {
      const query = state.query.trim()
      const seq = ++searchSeq
      if (query === '') {
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
        state.error = ''
        state.loading = false
        render()
        return
      }
      // 取消上一个仍在途的请求，避免服务器端堆积扫描
      activeCtl?.abort()
      const controller = new AbortController()
      activeCtl = controller
      // 最少 2 个字符才发起查询（按码点计，CJK 单字不触发全量扫描）
      if ([...query].length < 2) {
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
        state.error = ''
        state.loading = false
        render()
        return
      }
      state.loading = true
      state.error = ''
      render()
      try {
        const data = await api('/api/dsh-search/query?q=' + encodeURIComponent(query), controller.signal)
        if (seq !== searchSeq) return
        state.server = {
          sessions: data.sessions || [],
          prompts: data.prompts || [],
          tools: data.tools || [],
          panels: data.panels || [],
        }
      } catch (error) {
        if (seq !== searchSeq) return
        if (error && error.name === 'AbortError') return
        state.error = error.message || String(error)
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
      } finally {
        if (seq === searchSeq) {
          state.loading = false
          render()
        }
      }
    }

    /* ================================ 面板开关 ================================ */
```

</details>

**依据 4 · 源码核查**：[packages/search/client.js:1103-1156](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L1103-L1156)

打开会话与设置卡、Prompt复制退路。

<details>
<summary>查看原文（54行）</summary>

```text
    function openSession(id) {
      const query = state.query
      const uiWorkspace = uiWorkspaceService()
      const sessions = activeCtx && activeCtx.sessions
      const canOpenViaWorkspace = uiWorkspace !== undefined && typeof uiWorkspace.openSession === 'function'
      const canOpenViaSessions = sessions !== undefined && sessions !== null && typeof sessions.open === 'function'
      if (!canOpenViaWorkspace && !canOpenViaSessions) {
        toast(t('error.openSessionUnavailable'), 'error')
        return
      }
      try {
        if (canOpenViaWorkspace) uiWorkspace.openSession(id)
        else sessions.open(id)
        closePalette()
        jumpToSessionText(query)
      } catch (error) {
        toast(error && error.message ? error.message : t('error.openSession'), 'error')
      }
    }

    async function activateEntry(entry) {
      if (!entry) return
      if (entry.kind === 'session') {
        openSession(entry.payload.id)
        return
      }
      if (entry.kind === 'action') {
        const action = QUICK_ACTIONS.find((item) => item.id === entry.payload.actionId)
        closePalette()
        if (action) await action.run()
        return
      }
      if (entry.kind === 'prompt') {
        const copy = entry.payload.copy
        closePalette()
        const jumped = await openSettingsCard(['Prompt 管理', 'Prompt Management'])
        if (jumped) {
          toast(t('msg.openedCard', { name: t('card.prompt') }), 'ok')
        } else {
          copyText(copy)
        }
        return
      }
      if (entry.kind === 'tool') {
        const name = entry.payload.name
        closePalette()
        const jumped = await openSettingsCard(['MCP 服务器配置', 'MCP Server Configuration'])
        if (jumped) {
          toast(t('msg.openedCard', { name: t('card.mcp') }), 'ok')
        } else {
          copyText(name)
        }
        return
      }
```

</details>

**依据 5 · 源码核查**：[packages/search/client.js:1809-1882](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L1809-L1882)

有限时间DOM定位与失败恢复。

<details>
<summary>查看原文（74行）</summary>

```text
    async function jumpToSessionText(query) {
      const q = String(query || '').trim()
      if (q === '') return
      const lowerQuery = q.toLowerCase()
      const startedAt = Date.now()
      // 注意：sessions.open 会触发会话视图重挂载，滚动容器节点会被替换——
      // 每一轮都必须重新 query，绝不能缓存节点引用（detached 节点上写 scrollTop 无效）。
      const getScroller = () => document.querySelector('[data-conversation-scroll]')
      let scroller = null
      while (Date.now() - startedAt < 8000) {
        scroller = getScroller()
        if (scroller !== null) break
        await sleep(200)
      }
      if (scroller === null) return
      // 切换会话时旧内容可能还挂在容器里：等一次内容签名变化再开始找
      //（同会话跳转时内容不变，很快放行）
      const signatureOf = (el) => el.innerHTML.length + ':' + el.scrollHeight
      const signature = signatureOf(scroller)
      for (let i = 0; i < 6; i += 1) {
        await sleep(200)
        const current = getScroller()
        if (current !== null && signatureOf(current) !== signature) break
      }
      const initialScroll = getScroller()?.scrollTop ?? null
      let lastHeight = scroller.scrollHeight
      while (Date.now() - startedAt < 15000) {
        const box = getScroller()
        if (box === null) {
          await sleep(250)
          continue
        }
        const target = findTextInScroller(box, lowerQuery)
        if (target !== null) {
          try {
            // behavior 用 auto（瞬时）：smooth 的动画过程会被会话视图的
            // 吸底滚动逻辑逐帧弹回底部，导致定位无效。
            target.scrollIntoView({ block: 'center', behavior: 'auto' })
            target.style.outline = '2px solid var(--dsw-alias-state-warn-primary)'
            target.style.borderRadius = '8px'
            setTimeout(() => {
              target.style.outline = ''
              target.style.borderRadius = ''
            }, 3000)
          } catch {
            /* 滚动失败不阻塞 */
          }
          return
        }
        const atTop = box.scrollTop <= 4
        const grew = box.scrollHeight !== lastHeight
        lastHeight = box.scrollHeight
        // 到顶且内容不再增长才判定穷尽；冷打开的会话内容是逐步渲染的，
        // 空容器 / 短容器上「到顶且未增长」只是还没加载完，必须继续等。
        const rendered = box.scrollHeight > box.clientHeight * 1.2
        if (atTop && !grew && rendered) break
        if (!atTop) {
          box.scrollTop = Math.max(0, box.scrollTop - Math.max(240, box.clientHeight * 0.85))
        }
        await sleep(320)
      }
      const endBox = getScroller()
      if (endBox !== null && initialScroll !== null) {
        try {
          endBox.scrollTop = initialScroll
        } catch {
          /* 恢复失败不阻塞 */
        }
      }
    }

    /* ================================ 插件入口 ================================ */

    exports.inject = ['sessions']
```

</details>

**依据 6 · 源码核查**：[packages/search/src/index.ts:959-996](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L959-L996)

Host路由和能力公告接线。

<details>
<summary>查看原文（38行）</summary>

```text

const plugin = definePlugin<Config>({
  name: 'global-search',
  inject: [],
  apply(ctx: Context, config?: Config) {
    if (config?.enabled === false) return
    const routes = makeRoutes(ctx, config ?? {})

    ctx.inject(['webServer'], (webCtx: Context) => {
      webCtx.effect(() => {
        const server = (webCtx as unknown as { webServer: { register(route: { kind: string; path: string; handler: RouteHandler }): () => void } }).webServer
        const disposers = routes.map((route) => server.register(route))
        return () => {
          for (const dispose of disposers) {
            try {
              dispose()
            } catch {
              /* 释放失败不阻塞 */
            }
          }
        }
      }, 'dsh-global-search: routes')
    })

    if (config?.announceToAgent !== false) {
      ctx.inject(['systemPrompt'], (promptCtx: Context) => {
        promptCtx.effect(() => {
          const systemPrompt = (promptCtx as unknown as { systemPrompt: { section(options: { name: string; order?: number; text: string }): () => void } }).systemPrompt
          return registerLiteralSection(systemPrompt, { name: 'plugin:dsh-global-search', order: 170, text: SEARCH_GUIDANCE })
        }, 'dsh-global-search: announcement')
      })
    }

    console.log('[dsh-global-search] mounted, prompt file: ' + promptFilePath())
  },
})

export const { name, inject, apply } = plugin
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全文索引与回退扫描是否等价？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

不等价。FTS显式限制user/message、assistant/message与current surface；失败时回退按最近会话截到maxScanSessions（默认80，上限500），并发6个扫描，10秒超时先返回已收集命中，后台仍可能填缓存。结果按时间排序而非FTS相关度；1字符会话查询直接空。故冷历史、大库或短查询漏检不能当没有记录。

scanOneSession先找当前用户/助手消息，但未找到会再查任意事件，不再限制type/surface；同一词只在工具输出或非current事件里时，回退可能命中而FTS不会。这是源码路径差异，不是已复现泄露。超时truncated只用于决定不缓存，公开/query仍只返回sessions数组，没有把不完整状态交给客户端；单会话读失败也静默跳过。调用者会看到类似正常空/短结果，难以区别搜完与没扫全。可见会话过滤降低打不开的问题，但不弥补检索覆盖差异。

#### 证据与依据

**依据 1 · 源码核查**：[packages/search/src/index.ts:331-385](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L331-L385)

FTS过滤、单字符限制和回退。

<details>
<summary>查看原文（55行）</summary>

```text
async function searchSessions(ctx: Context, rawQuery: string, limit: number, signal?: AbortSignal, maxScanSessions = MAX_SCAN_SESSIONS): Promise<SessionHit[]> {
  const query = rawQuery.trim()
  if (query === '') return []
  // 1 字符查询（含 CJK 单字）命中面极小却要付出全量扫描成本，直接不搜会话
  if ([...query].length < 2) return []
  const sessionQuery = getService(ctx, 'sessionQuery') as SessionQueryLike | undefined
  if (sessionQuery === undefined) return []
  const cacheKey = query + '|' + limit
  const cached = getCachedResult(cacheKey)
  if (cached !== undefined) return filterVisibleSessionHits(ctx, cached, signal)
  let hits: SessionHit[] = []
  if (typeof sessionQuery.searchSessions === 'function') {
    try {
      const page = await sessionQuery.searchSessions({
        query,
        eventFilters: [
          { kind: 'type', values: ['user/message', 'assistant/message'] },
          { kind: 'surface', values: ['current'] },
        ],
        limit,
      }, { signal })
      hits = (page.items ?? []).slice(0, limit).flatMap((hit) => {
        const id = hit.header?.id
        if (!id) return []
        if (isSubagentHeader(hit.header)) return []
        return [{
          id,
          snippet: hit.bestMatch?.snippet ?? '',
          time: hit.bestMatch?.time ?? 0,
        }]
      })
      const visible = await filterVisibleSessionHits(ctx, hits, signal)
      // 空结果不写缓存：回退扫描被超时截断时可能暂时为空，
      // 缓存会让 30s 内的重试一直为空（后台扫描仍在填充文档缓存）。
      if (visible.length > 0) setCachedResult(cacheKey, visible)
      return visible
    } catch (error) {
      // openAt: "never" 等场景会禁用全文索引；退化为逐会话扫描原始事件。
      // 这样即使 session search 被禁用，Prompt / MCP 搜索也不会被拖垮。
      if (!warnedSearchFallback) {
        warnedSearchFallback = true
        console.info('[dsh-global-search] session full-text search is disabled (openAt: "never"); falling back to per-session scan.')
      }
    }
  }
  const scanned = await searchSessionsByScan(sessionQuery, query, limit, signal, maxScanSessions)
  const visible = await filterVisibleSessionHits(ctx, scanned.hits, signal)
  // 空结果不写缓存（超时截断的空结果会被 30s 固化）——同理，**被切走的非空部分结果**
  // 也不写：它只是「还没扫完」，缓存会让立刻重试拿到同一份不完整清单（后台扫描仍在
  // 补文档缓存，不缓存时重试很快就能拿全）。
  if (!scanned.truncated && visible.length > 0) setCachedResult(cacheKey, visible)
  return visible
}

/**
```

</details>

**依据 2 · 源码核查**：[packages/search/src/index.ts:434-494](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L434-L494)

最近上限、超时与后台扫描。

<details>
<summary>查看原文（61行）</summary>

```text
export async function searchSessionsByScan(
  sessionQuery: SessionQueryLike,
  query: string,
  limit: number,
  signal?: AbortSignal,
  maxScanSessions = MAX_SCAN_SESSIONS,
): Promise<{ hits: SessionHit[]; truncated: boolean }> {
  if (typeof sessionQuery.listSessions !== 'function' || typeof sessionQuery.filterEvents !== 'function')
    return { hits: [], truncated: false }
  let records: Array<{ header: { id: string } }> = []
  try {
    records = await sessionQuery.listSessions(signal)
  } catch (error) {
    console.warn('[dsh-global-search] session list unavailable for fallback scan:', error instanceof Error ? error.message : String(error))
    // 会话清单都拿不到：这是「没扫成」，不是「扫完没有命中」——同样按 truncated 处理，
    // 免得这个空结果被缓存 30s
    return { hits: [], truncated: true }
  }
  const filter = compileLocalTextFilter(query)
  // subagent 会话排除在扫描之外（打不开，也不占结果名额）；
  // 最近优先：先按记录时间降序，再截断到 maxScanSessions。
  const sessions = sortRecordsByTimeDesc(records.filter((record) => !isSubagentHeader(record?.header))).slice(0, maxScanSessions)
  const collected: SessionHit[] = []

  const scanPromise = (async () => {
    let next = 0
    const workers = Array.from({ length: Math.min(SESSION_SCAN_CONCURRENCY, sessions.length) }, async () => {
      while (next < sessions.length && collected.length < limit) {
        if (signal?.aborted) return
        const index = next
        next += 1
        const hit = await scanOneSession(sessionQuery, sessions[index].header.id, filter, query)
        if (hit !== undefined) collected.push(hit)
      }
    })
    await Promise.all(workers)
  })()

  // 整体超时：返回已收集的部分结果，避免最坏情况长时间无响应；
  // 即使被切走，后台任务仍在为下一个查询填充会话缓存。
  let scanTimeout: ReturnType<typeof setTimeout> | undefined
  // 注意：计时器在竞态构造时就已创建，所以 `scanTimeout !== undefined` 不能用来判断
  // 「是否被超时切走」——必须由回调自己置标志位
  let timedOut = false
  await Promise.race([
    scanPromise,
    new Promise<void>((resolve) => {
      scanTimeout = setTimeout(() => {
        timedOut = true
        resolve()
      }, SCAN_TIMEOUT_MS)
    }),
  ])
  // 扫描先结束时清掉超时定时器：后台扫描不受影响，但不留 ref 计时器拖住进程退出。
  if (scanTimeout !== undefined) clearTimeout(scanTimeout)
  // 命中按时间倒序返回（同一时间保持收集顺序稳定）；只影响回退扫描路径，
  // 宿主 FTS 正常返回时仍保持其相关度排序。
  collected.sort((a, b) => b.time - a.time)
  // truncated：这次是**被超时切走的**部分结果，不是扫完了的全部命中。
  // 调用方据此决定不写缓存——部分结果一旦缓存，立刻重试也拿不到更全的清单。
  return { hits: collected.slice(0, limit), truncated: timedOut }
```

</details>

**依据 3 · 源码核查**：[packages/search/src/index.ts:498-534](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L498-L534)

优先事件失败后回退任意事件。

<details>
<summary>查看原文（37行）</summary>

```text
async function scanOneSession(
  sessionQuery: SessionQueryLike,
  sessionId: string,
  filter: RegExp,
  query: string,
): Promise<SessionHit | undefined> {
  try {
    if (typeof sessionQuery.filterEvents !== 'function') return undefined
    let cached = getCachedDocs(sessionId)
    if (cached === undefined) {
      const docs = await sessionQuery.filterEvents(sessionId, [])
      let bytes = 0
      const docsOut = docs.map((doc) => {
        if (typeof doc.text === 'string') bytes += doc.text.length
        return {
          text: doc.text,
          time: doc.time,
          ...(doc.type !== undefined ? { type: doc.type } : {}),
          ...(doc.surface !== undefined ? { surface: doc.surface } : {}),
        }
      })
      cached = { docs: docsOut, bytes, at: Date.now() }
      setCachedDocs(sessionId, cached)
    }
    const doc = cached.docs.find((item) =>
      filter.test(item.text) && item.surface === 'current' && (item.type === 'user/message' || item.type === 'assistant/message'),
    ) ?? cached.docs.find((item) => filter.test(item.text))
    if (doc === undefined) return undefined
    return {
      id: sessionId,
      snippet: makeSnippet(doc.text, query),
      time: doc.time,
    }
  } catch {
    // 单个会话读取失败不阻塞其它会话
    return undefined
  }
```

</details>

**依据 4 · 源码核查**：[packages/search/src/index.ts:934-945](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L934-L945)

公开响应未带truncated或模式。

<details>
<summary>查看原文（12行）</summary>

```text
        const onClose = () => controller.abort()
        reqEvents.once('close', onClose)
        try {
          const [sessions, prompts, tools, panels] = await Promise.all([
            config.includeSessions !== false ? searchSessions(ctx, q, maxResults, controller.signal, maxScanSessions) : Promise.resolve([]),
            config.includePrompts !== false ? Promise.resolve(searchPrompts(q, maxResults)) : Promise.resolve([]),
            config.includeMcpTools !== false ? Promise.resolve(searchMcpTools(ctx, q, maxResults)) : Promise.resolve([]),
            config.includePanels !== false ? Promise.resolve(searchPanels(ctx, q, maxResults)) : Promise.resolve([]),
          ])
          writeJson(res, 200, { ok: true, query: q, sessions, prompts, tools, panels })
        } catch (error) {
          writeJson(res, 500, { error: '搜索失败: ' + (error instanceof Error ? error.message : String(error)) })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本地访问和缓存有何边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

路由检查socket回环地址、Host为localhost/回环、拒绝cross-site并比较Origin host；无Origin的本地请求允许。它是本机访问围栏，不含用户/工作区主体校验，不能描述成多租户权限隔离。本轮没有网络攻击复现，反向代理和远程Web部署也不能直接假定可用。客户端高亮先转义文本再包mark，不能因此推导所有宿主DOM都安全。

会话文档缓存90秒，结果30秒，可见集合5秒；缓存均模块级，结果键只有query与limit，不含ctx/profile。若同模块实例承载不同服务上下文，重用范围需要宿主验证，不能承诺跨实例隔离；本轮未证明该部署条件成立。缓存能减少重复解压但可能短期漏新消息或保留旧片段，可见集合仍重新过滤结果。文档字节预算用JS字符长度估算，且保留至少一条，192MiB常量不能称严格内存上限。Prompt缓存按mtime和size指纹，文件stat失败按不存在处理，因此空结果也可能是读取条件问题。

#### 证据与依据

**依据 1 · 源码核查**：[packages/search/src/index.ts:856-875](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L856-L875)

回环、Host和Origin检查，无主体授权。

<details>
<summary>查看原文（20行）</summary>

```text
function isLoopbackRequest(request: ReqLike): boolean {
  const address = request.socket.remoteAddress
  if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (hostUrl.hostname !== '127.0.0.1' && hostUrl.hostname !== 'localhost' && hostUrl.hostname !== '[::1]') return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[packages/search/src/index.ts:248-289](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L248-L289)

文档缓存TTL、字符估量和至少留一条。

<details>
<summary>查看原文（42行）</summary>

```text
const TEXT_CACHE_TTL_MS = 90_000
const TEXT_CACHE_MAX_BYTES = 192 * 1024 * 1024
const RESULT_CACHE_TTL_MS = 30_000
const RESULT_CACHE_MAX_ENTRIES = 64
let warnedSearchFallback = false

/* ------------------------------------------------------------------ *
 * 会话文档缓存（P0 优化：同一会话只解压一次，90s 内重复查询直接内存扫描）
 * ------------------------------------------------------------------ */

interface CachedSessionDocs {
  docs: Array<{ text: string; time: number; type?: string; surface?: string }>
  bytes: number
  at: number
}

const sessionDocCache = new Map<string, CachedSessionDocs>()
let sessionDocBytes = 0

function getCachedDocs(sessionId: string): CachedSessionDocs | undefined {
  const entry = sessionDocCache.get(sessionId)
  if (entry === undefined) return undefined
  if (Date.now() - entry.at > TEXT_CACHE_TTL_MS) {
    sessionDocCache.delete(sessionId)
    sessionDocBytes -= entry.bytes
    return undefined
  }
  return entry
}

function setCachedDocs(sessionId: string, entry: CachedSessionDocs): void {
  const previous = sessionDocCache.get(sessionId)
  if (previous !== undefined) sessionDocBytes -= previous.bytes
  sessionDocCache.set(sessionId, entry)
  sessionDocBytes += entry.bytes
  // LRU 淘汰：超出字节预算时从最旧条目起淘汰
  while (sessionDocBytes > TEXT_CACHE_MAX_BYTES && sessionDocCache.size > 1) {
    const oldestKey = sessionDocCache.keys().next().value as string | undefined
    if (oldestKey === undefined || oldestKey === sessionId) break
    const oldest = sessionDocCache.get(oldestKey)
    sessionDocCache.delete(oldestKey)
    if (oldest !== undefined) sessionDocBytes -= oldest.bytes
```

</details>

**依据 3 · 源码核查**：[packages/search/src/index.ts:304-318](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L304-L318)

结果缓存实现。

<details>
<summary>查看原文（15行）</summary>

```text
function getCachedResult(key: string): SessionHit[] | undefined {
  const entry = resultCache.get(key)
  if (entry === undefined) return undefined
  if (Date.now() - entry.at > RESULT_CACHE_TTL_MS) {
    resultCache.delete(key)
    return undefined
  }
  return entry.hits
}

function setCachedResult(key: string, hits: SessionHit[]): void {
  if (resultCache.size >= RESULT_CACHE_MAX_ENTRIES) {
    const oldestKey = resultCache.keys().next().value
    if (oldestKey !== undefined) resultCache.delete(oldestKey)
  }
```

</details>

**依据 4 · 源码核查**：[packages/search/src/index.ts:338-340](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L338-L340)

键不含上下文。

```text
  const cacheKey = query + '|' + limit
  const cached = getCachedResult(cacheKey)
  if (cached !== undefined) return filterVisibleSessionHits(ctx, cached, signal)
```

**依据 5 · 源码核查**：[packages/search/src/index.ts:546-586](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L546-L586)

可见集合缓存与过滤。

<details>
<summary>查看原文（41行）</summary>

```text
async function getVisibleSessionIds(ctx: Context, signal?: AbortSignal): Promise<Set<string>> {
  const cached = visibleSessionIdsCache
  if (cached !== undefined && Date.now() - cached.at <= VISIBLE_CACHE_TTL_MS) return cached.ids
  const ids = new Set<string>()
  const sessions = getService(ctx, 'sessions') as { list?: () => Array<{ id: string }> } | undefined
  try {
    for (const session of sessions?.list?.() ?? []) ids.add(session.id)
  } catch {
    /* 忽略 live 列表读取失败 */
  }
  const persistence = getService(ctx, 'sessionPersistence') as {
    list?(signal?: AbortSignal): Promise<Array<{ id?: string; cwd?: string; header?: { id?: string; cwd?: string } }>>
  } | undefined
  if (persistence?.list !== undefined) {
    try {
      const cold = await persistence.list(signal)
      for (const meta of cold) {
        // 宿主实际返回快照形状 { header: { id, cwd }, revision, ... }；
        // 兼容旧的扁平 { id, cwd } 形状。cwd 缺失视为不可跳转，跳过。
        const header = meta.header
        if (isSubagentHeader(header) || isSubagentHeader(meta)) continue
        const id = meta.id ?? header?.id
        const cwd = meta.cwd ?? header?.cwd
        if (id !== undefined && cwd !== undefined) ids.add(id)
      }
    } catch {
      /* 忽略持久化列表读取失败 */
    }
  }
  // 空集合不写缓存（下次查询重算），避免新会话上线后被空集缓存挡住。
  if (ids.size > 0) visibleSessionIdsCache = { ids, at: Date.now() }
  return ids
}

async function filterVisibleSessionHits(ctx: Context, hits: SessionHit[], signal?: AbortSignal): Promise<SessionHit[]> {
  const visible = await getVisibleSessionIds(ctx, signal)
  // 拿不到可见会话列表时不再返回可能无法跳转的会话，避免“能搜到但点不开”。
  if (visible.size === 0) return []
  return hits.filter((hit) => visible.has(hit.id))
}

```

</details>

**依据 6 · 源码核查**：[packages/search/src/index.ts:86-105](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L86-L105)

Prompt stat失败/指纹缓存。

<details>
<summary>查看原文（20行）</summary>

```text
function promptFileFingerprint(file: string): string | undefined {
  try {
    const stat = statSync(file)
    return stat.mtimeMs + ':' + stat.size
  } catch {
    return undefined
  }
}

function readPromptStore(): ManagedRead {
  const file = promptFilePath()
  const fingerprint = promptFileFingerprint(file)
  const key = file + '|' + (fingerprint ?? 'missing')
  const cached = promptStoreCache
  if (cached !== undefined && cached.key === key) return cached.value
  const result = parsePromptStore(file, fingerprint !== undefined)
  promptStoreCache = { key, value: result }
  return result
}

```

</details>

**依据 7 · 源码核查**：[packages/search/client.js:293-325](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L293-L325)

命中文本转义后高亮。

<details>
<summary>查看原文（33行）</summary>

```text
    function highlightText(text, query) {
      const value = String(text == null ? '' : text)
      const words = String(query == null ? '' : query)
        .trim()
        .split(/\s+/)
        .filter((word) => word !== '')
      if (words.length === 0) return esc(value)
      // 正则元字符转义后用 | 连接，一次全局扫描逐段拼接
      const pattern = words.map((word) => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')
      let regex
      try {
        regex = new RegExp(pattern, 'giu')
      } catch {
        return esc(value)
      }
      const parts = []
      let lastIndex = 0
      let match = regex.exec(value)
      while (match !== null) {
        if (match[0] === '') {
          // 空匹配兜底：只推进扫描位置，避免死循环
          regex.lastIndex = match.index + 1
          match = regex.exec(value)
          continue
        }
        parts.push(esc(value.slice(lastIndex, match.index)))
        parts.push('<mark class="gs_highlight">' + esc(match[0]) + '</mark>')
        lastIndex = match.index + match[0].length
        regex.lastIndex = lastIndex
        match = regex.exec(value)
      }
      parts.push(esc(value.slice(lastIndex)))
      return parts.join('')
```

</details>

#### 缺口

- 未核对宿主是否同模块多profile复用，也无远程部署验收。
  **影响**：不能据模块缓存宣称已发生跨主体泄露，亦不能保证隔离。
  **进一步探讨**：用隔离测试profile与不同会话集验证同查询不混用，另验真实代理拓扑。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用与全周期成本如何判断？

**研究主题**：效果与总成本、采用判断

#### 完整回答

适合可信本机DSH、已积累会话和配置、经常找回既有信息的人小范围试用。先准备已知当前消息、冷历史、仅工具输出、旧Prompt版本和第三方设置卡片样本，对照原入口核对搜索和点击；不要把统一面板空结果当不存在。默认检索是只读查资源，点击是打开视图，工具结果不执行MCP；快捷新会话/文件夹操作仍有实际UI动作，试用应只选择已知查询与导航。

首次成本是版本兼容、托管文件和快捷键冲突核对；持续成本来自扫描解压、内存和目录更新，不涉及本组件专用外部搜索API或LLM摘要调用。可选公告仍占系统提示上下文，费用金额与实际CPU/内存峰值未知。失败恢复需回原入口、检查服务/缓存/扫描范围；关闭插件撤路由，关闭公告可停能力说明。若关键冷历史连续漏检、跳错卡或快捷键干扰，先停用并用原入口，不扩大到敏感多主体环境。

#### 证据与依据

**依据 1 · 源码核查**：[packages/search/src/index.ts:434-534](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L434-L534)

扫描和缓存资源来源。

<details>
<summary>查看原文（101行）</summary>

```text
export async function searchSessionsByScan(
  sessionQuery: SessionQueryLike,
  query: string,
  limit: number,
  signal?: AbortSignal,
  maxScanSessions = MAX_SCAN_SESSIONS,
): Promise<{ hits: SessionHit[]; truncated: boolean }> {
  if (typeof sessionQuery.listSessions !== 'function' || typeof sessionQuery.filterEvents !== 'function')
    return { hits: [], truncated: false }
  let records: Array<{ header: { id: string } }> = []
  try {
    records = await sessionQuery.listSessions(signal)
  } catch (error) {
    console.warn('[dsh-global-search] session list unavailable for fallback scan:', error instanceof Error ? error.message : String(error))
    // 会话清单都拿不到：这是「没扫成」，不是「扫完没有命中」——同样按 truncated 处理，
    // 免得这个空结果被缓存 30s
    return { hits: [], truncated: true }
  }
  const filter = compileLocalTextFilter(query)
  // subagent 会话排除在扫描之外（打不开，也不占结果名额）；
  // 最近优先：先按记录时间降序，再截断到 maxScanSessions。
  const sessions = sortRecordsByTimeDesc(records.filter((record) => !isSubagentHeader(record?.header))).slice(0, maxScanSessions)
  const collected: SessionHit[] = []

  const scanPromise = (async () => {
    let next = 0
    const workers = Array.from({ length: Math.min(SESSION_SCAN_CONCURRENCY, sessions.length) }, async () => {
      while (next < sessions.length && collected.length < limit) {
        if (signal?.aborted) return
        const index = next
        next += 1
        const hit = await scanOneSession(sessionQuery, sessions[index].header.id, filter, query)
        if (hit !== undefined) collected.push(hit)
      }
    })
    await Promise.all(workers)
  })()

  // 整体超时：返回已收集的部分结果，避免最坏情况长时间无响应；
  // 即使被切走，后台任务仍在为下一个查询填充会话缓存。
  let scanTimeout: ReturnType<typeof setTimeout> | undefined
  // 注意：计时器在竞态构造时就已创建，所以 `scanTimeout !== undefined` 不能用来判断
  // 「是否被超时切走」——必须由回调自己置标志位
  let timedOut = false
  await Promise.race([
    scanPromise,
    new Promise<void>((resolve) => {
      scanTimeout = setTimeout(() => {
        timedOut = true
        resolve()
      }, SCAN_TIMEOUT_MS)
    }),
  ])
  // 扫描先结束时清掉超时定时器：后台扫描不受影响，但不留 ref 计时器拖住进程退出。
  if (scanTimeout !== undefined) clearTimeout(scanTimeout)
  // 命中按时间倒序返回（同一时间保持收集顺序稳定）；只影响回退扫描路径，
  // 宿主 FTS 正常返回时仍保持其相关度排序。
  collected.sort((a, b) => b.time - a.time)
  // truncated：这次是**被超时切走的**部分结果，不是扫完了的全部命中。
  // 调用方据此决定不写缓存——部分结果一旦缓存，立刻重试也拿不到更全的清单。
  return { hits: collected.slice(0, limit), truncated: timedOut }
}

/** 单会话扫描：优先使用缓存文档；未缓存则一次拉取全部文档并缓存（消除重复解压）。 */
async function scanOneSession(
  sessionQuery: SessionQueryLike,
  sessionId: string,
  filter: RegExp,
  query: string,
): Promise<SessionHit | undefined> {
  try {
    if (typeof sessionQuery.filterEvents !== 'function') return undefined
    let cached = getCachedDocs(sessionId)
    if (cached === undefined) {
      const docs = await sessionQuery.filterEvents(sessionId, [])
      let bytes = 0
      const docsOut = docs.map((doc) => {
        if (typeof doc.text === 'string') bytes += doc.text.length
        return {
          text: doc.text,
          time: doc.time,
          ...(doc.type !== undefined ? { type: doc.type } : {}),
          ...(doc.surface !== undefined ? { surface: doc.surface } : {}),
        }
      })
      cached = { docs: docsOut, bytes, at: Date.now() }
      setCachedDocs(sessionId, cached)
    }
    const doc = cached.docs.find((item) =>
      filter.test(item.text) && item.surface === 'current' && (item.type === 'user/message' || item.type === 'assistant/message'),
    ) ?? cached.docs.find((item) => filter.test(item.text))
    if (doc === undefined) return undefined
    return {
      id: sessionId,
      snippet: makeSnippet(doc.text, query),
      time: doc.time,
    }
  } catch {
    // 单个会话读取失败不阻塞其它会话
    return undefined
  }
```

</details>

**依据 2 · 源码核查**：[packages/search/src/index.ts:959-990](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L959-L990)

enabled与公告开关、卸载路由。

<details>
<summary>查看原文（32行）</summary>

```text

const plugin = definePlugin<Config>({
  name: 'global-search',
  inject: [],
  apply(ctx: Context, config?: Config) {
    if (config?.enabled === false) return
    const routes = makeRoutes(ctx, config ?? {})

    ctx.inject(['webServer'], (webCtx: Context) => {
      webCtx.effect(() => {
        const server = (webCtx as unknown as { webServer: { register(route: { kind: string; path: string; handler: RouteHandler }): () => void } }).webServer
        const disposers = routes.map((route) => server.register(route))
        return () => {
          for (const dispose of disposers) {
            try {
              dispose()
            } catch {
              /* 释放失败不阻塞 */
            }
          }
        }
      }, 'dsh-global-search: routes')
    })

    if (config?.announceToAgent !== false) {
      ctx.inject(['systemPrompt'], (promptCtx: Context) => {
        promptCtx.effect(() => {
          const systemPrompt = (promptCtx as unknown as { systemPrompt: { section(options: { name: string; order?: number; text: string }): () => void } }).systemPrompt
          return registerLiteralSection(systemPrompt, { name: 'plugin:dsh-global-search', order: 170, text: SEARCH_GUIDANCE })
        }, 'dsh-global-search: announcement')
      })
    }
```

</details>

**依据 3 · 源码核查**：[packages/search/client.js:1103-1166](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L1103-L1166)

导航/复制实际动作。

<details>
<summary>查看原文（64行）</summary>

```text
    function openSession(id) {
      const query = state.query
      const uiWorkspace = uiWorkspaceService()
      const sessions = activeCtx && activeCtx.sessions
      const canOpenViaWorkspace = uiWorkspace !== undefined && typeof uiWorkspace.openSession === 'function'
      const canOpenViaSessions = sessions !== undefined && sessions !== null && typeof sessions.open === 'function'
      if (!canOpenViaWorkspace && !canOpenViaSessions) {
        toast(t('error.openSessionUnavailable'), 'error')
        return
      }
      try {
        if (canOpenViaWorkspace) uiWorkspace.openSession(id)
        else sessions.open(id)
        closePalette()
        jumpToSessionText(query)
      } catch (error) {
        toast(error && error.message ? error.message : t('error.openSession'), 'error')
      }
    }

    async function activateEntry(entry) {
      if (!entry) return
      if (entry.kind === 'session') {
        openSession(entry.payload.id)
        return
      }
      if (entry.kind === 'action') {
        const action = QUICK_ACTIONS.find((item) => item.id === entry.payload.actionId)
        closePalette()
        if (action) await action.run()
        return
      }
      if (entry.kind === 'prompt') {
        const copy = entry.payload.copy
        closePalette()
        const jumped = await openSettingsCard(['Prompt 管理', 'Prompt Management'])
        if (jumped) {
          toast(t('msg.openedCard', { name: t('card.prompt') }), 'ok')
        } else {
          copyText(copy)
        }
        return
      }
      if (entry.kind === 'tool') {
        const name = entry.payload.name
        closePalette()
        const jumped = await openSettingsCard(['MCP 服务器配置', 'MCP Server Configuration'])
        if (jumped) {
          toast(t('msg.openedCard', { name: t('card.mcp') }), 'ok')
        } else {
          copyText(name)
        }
        return
      }
      if (entry.kind === 'panel') {
        const isSection = entry.payload.section === true
        const titles = entry.payload.titles
        const label = titles[0] || t('panel.untitled')
        closePalette()
        const jumped = isSection ? await openSettingsSection(titles, entry.payload.index) : await openSettingsCard(titles)
        if (jumped) {
          toast(isSection ? t('msg.openedSection', { name: label }) : t('msg.openedCard', { name: label }), 'ok')
        } else {
          copyText(label)
```

</details>

**依据 4 · 源码核查**：[packages/search/client.js:1194-1241](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/client.js#L1194-L1241)

输入最少两字符限制。

<details>
<summary>查看原文（48行）</summary>

```text
    async function runSearch() {
      const query = state.query.trim()
      const seq = ++searchSeq
      if (query === '') {
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
        state.error = ''
        state.loading = false
        render()
        return
      }
      // 取消上一个仍在途的请求，避免服务器端堆积扫描
      activeCtl?.abort()
      const controller = new AbortController()
      activeCtl = controller
      // 最少 2 个字符才发起查询（按码点计，CJK 单字不触发全量扫描）
      if ([...query].length < 2) {
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
        state.error = ''
        state.loading = false
        render()
        return
      }
      state.loading = true
      state.error = ''
      render()
      try {
        const data = await api('/api/dsh-search/query?q=' + encodeURIComponent(query), controller.signal)
        if (seq !== searchSeq) return
        state.server = {
          sessions: data.sessions || [],
          prompts: data.prompts || [],
          tools: data.tools || [],
          panels: data.panels || [],
        }
      } catch (error) {
        if (seq !== searchSeq) return
        if (error && error.name === 'AbortError') return
        state.error = error.message || String(error)
        state.server = { sessions: [], prompts: [], tools: [], panels: [] }
      } finally {
        if (seq === searchSeq) {
          state.loading = false
          render()
        }
      }
    }

    /* ================================ 面板开关 ================================ */
```

</details>

#### 缺口

- 无真实任务速度、资源峰值和宿主验收。
  **影响**：只能建议可信本机已知样本试用，不能承诺零延迟或无成本。
  **进一步探讨**：固定冷热会话对照正确率、响应时间、CPU/内存及失败恢复时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 什么改进值得小样本验证？

**研究主题**：新假设与验证

#### 完整回答

未验证设计是让会话响应显式携带searchMode、scanned/eligible范围、truncated与读取失败数，并让回退事件范围与FTS配置一致，客户端显示“仅检索最近N项/尚未搜完”而不是无差别空清单。简单增加maxScanSessions会提高扫描负担，仍无法解决事件口径和完成状态不透明。

最小对照准备当前用户消息、仅工具事件、超扫描范围冷历史、单会话读取失败和超时样本，比较现状与候选响应的漏检误判、错误定位及重试次数。代价是接口/客户端兼容、状态记录和更明确的降级策略；若用户仍不能更准确判断覆盖，或状态噪声与延迟超过收益，就否定改进。未验证用户需求，不将它宣传为新搜索产品。

#### 证据与依据

**依据 1 · 源码核查**：[packages/search/src/index.ts:434-494](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L434-L494)

当前内部truncated仅超时。

<details>
<summary>查看原文（61行）</summary>

```text
export async function searchSessionsByScan(
  sessionQuery: SessionQueryLike,
  query: string,
  limit: number,
  signal?: AbortSignal,
  maxScanSessions = MAX_SCAN_SESSIONS,
): Promise<{ hits: SessionHit[]; truncated: boolean }> {
  if (typeof sessionQuery.listSessions !== 'function' || typeof sessionQuery.filterEvents !== 'function')
    return { hits: [], truncated: false }
  let records: Array<{ header: { id: string } }> = []
  try {
    records = await sessionQuery.listSessions(signal)
  } catch (error) {
    console.warn('[dsh-global-search] session list unavailable for fallback scan:', error instanceof Error ? error.message : String(error))
    // 会话清单都拿不到：这是「没扫成」，不是「扫完没有命中」——同样按 truncated 处理，
    // 免得这个空结果被缓存 30s
    return { hits: [], truncated: true }
  }
  const filter = compileLocalTextFilter(query)
  // subagent 会话排除在扫描之外（打不开，也不占结果名额）；
  // 最近优先：先按记录时间降序，再截断到 maxScanSessions。
  const sessions = sortRecordsByTimeDesc(records.filter((record) => !isSubagentHeader(record?.header))).slice(0, maxScanSessions)
  const collected: SessionHit[] = []

  const scanPromise = (async () => {
    let next = 0
    const workers = Array.from({ length: Math.min(SESSION_SCAN_CONCURRENCY, sessions.length) }, async () => {
      while (next < sessions.length && collected.length < limit) {
        if (signal?.aborted) return
        const index = next
        next += 1
        const hit = await scanOneSession(sessionQuery, sessions[index].header.id, filter, query)
        if (hit !== undefined) collected.push(hit)
      }
    })
    await Promise.all(workers)
  })()

  // 整体超时：返回已收集的部分结果，避免最坏情况长时间无响应；
  // 即使被切走，后台任务仍在为下一个查询填充会话缓存。
  let scanTimeout: ReturnType<typeof setTimeout> | undefined
  // 注意：计时器在竞态构造时就已创建，所以 `scanTimeout !== undefined` 不能用来判断
  // 「是否被超时切走」——必须由回调自己置标志位
  let timedOut = false
  await Promise.race([
    scanPromise,
    new Promise<void>((resolve) => {
      scanTimeout = setTimeout(() => {
        timedOut = true
        resolve()
      }, SCAN_TIMEOUT_MS)
    }),
  ])
  // 扫描先结束时清掉超时定时器：后台扫描不受影响，但不留 ref 计时器拖住进程退出。
  if (scanTimeout !== undefined) clearTimeout(scanTimeout)
  // 命中按时间倒序返回（同一时间保持收集顺序稳定）；只影响回退扫描路径，
  // 宿主 FTS 正常返回时仍保持其相关度排序。
  collected.sort((a, b) => b.time - a.time)
  // truncated：这次是**被超时切走的**部分结果，不是扫完了的全部命中。
  // 调用方据此决定不写缓存——部分结果一旦缓存，立刻重试也拿不到更全的清单。
  return { hits: collected.slice(0, limit), truncated: timedOut }
```

</details>

**依据 2 · 源码核查**：[packages/search/src/index.ts:498-534](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L498-L534)

事件口径差异。

<details>
<summary>查看原文（37行）</summary>

```text
async function scanOneSession(
  sessionQuery: SessionQueryLike,
  sessionId: string,
  filter: RegExp,
  query: string,
): Promise<SessionHit | undefined> {
  try {
    if (typeof sessionQuery.filterEvents !== 'function') return undefined
    let cached = getCachedDocs(sessionId)
    if (cached === undefined) {
      const docs = await sessionQuery.filterEvents(sessionId, [])
      let bytes = 0
      const docsOut = docs.map((doc) => {
        if (typeof doc.text === 'string') bytes += doc.text.length
        return {
          text: doc.text,
          time: doc.time,
          ...(doc.type !== undefined ? { type: doc.type } : {}),
          ...(doc.surface !== undefined ? { surface: doc.surface } : {}),
        }
      })
      cached = { docs: docsOut, bytes, at: Date.now() }
      setCachedDocs(sessionId, cached)
    }
    const doc = cached.docs.find((item) =>
      filter.test(item.text) && item.surface === 'current' && (item.type === 'user/message' || item.type === 'assistant/message'),
    ) ?? cached.docs.find((item) => filter.test(item.text))
    if (doc === undefined) return undefined
    return {
      id: sessionId,
      snippet: makeSnippet(doc.text, query),
      time: doc.time,
    }
  } catch {
    // 单个会话读取失败不阻塞其它会话
    return undefined
  }
```

</details>

**依据 3 · 源码核查**：[packages/search/src/index.ts:934-945](https://github.com/hyzyn/dsh-plugin-kit/blob/44554d7fec9c5ced884d7579c25f7ea1b67cb5c2/packages/search/src/index.ts#L934-L945)

响应不传覆盖信息。

<details>
<summary>查看原文（12行）</summary>

```text
        const onClose = () => controller.abort()
        reqEvents.once('close', onClose)
        try {
          const [sessions, prompts, tools, panels] = await Promise.all([
            config.includeSessions !== false ? searchSessions(ctx, q, maxResults, controller.signal, maxScanSessions) : Promise.resolve([]),
            config.includePrompts !== false ? Promise.resolve(searchPrompts(q, maxResults)) : Promise.resolve([]),
            config.includeMcpTools !== false ? Promise.resolve(searchMcpTools(ctx, q, maxResults)) : Promise.resolve([]),
            config.includePanels !== false ? Promise.resolve(searchPanels(ctx, q, maxResults)) : Promise.resolve([]),
          ])
          writeJson(res, 200, { ok: true, query: q, sessions, prompts, tools, panels })
        } catch (error) {
          writeJson(res, 500, { error: '搜索失败: ' + (error instanceof Error ? error.message : String(error)) })
```

</details>

#### 缺口

- 没有完成状态提示的用户对照。
  **影响**：不能确认新增状态改善决策。
  **进一步探讨**：用上述失败样本记录错误判断与额外操作。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
