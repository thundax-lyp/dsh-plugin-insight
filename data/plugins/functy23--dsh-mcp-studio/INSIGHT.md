# dsh-mcp-studio

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6b4f5dd](https://github.com/functy23/dsh-mcp-studio/tree/6b4f5dd2c0de5f20d4625940060f714054bddbe3)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/functy23/dsh-mcp-studio) [![npm 30d 2,226](https://img.shields.io/static/v1?label=npm+30d&message=2%2C226&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-studio) [![最新发布 2026-10-03](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-03&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mcp-studio)
<!-- END META -->

> **功能**：在 DeepSeek Harness 管理 MCP 服务器和 Skills，并导入其他本地 Agent 的 MCP 配置。

> **亮点**：[Q01](#research-q01) 的单包把上游面板与宿主桥接到 DSH，并可集中选择和导入本地配置。

> **主要限制**：[Q02](#research-q02) 的连通性标签不能证明 MCP 握手，扫描包含配置字段，批量导入失败可能已有写入。

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
  - [Q01 · 其他 Agent 的 MCP 配置如何从扫描变为 profile 可用的条目？](#detail-section-11)
  - [Q02 · 连通性检测和导入结果分别说明什么？](#detail-section-12)
  - [Q03 · 怎样试用并检验更明确的导入确认是否有效？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多套本地 Agent 配置的开发者可扫描已有 MCP 并选择目标 profile。

用已有 MCP 配置与 CLI 手工迁移；原 Tauri 面板提供类似功能但依赖其宿主。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 配置扫描及导入 | 迁移其他 Agent 的 MCP | 保护配置中的 env/headers |
| 检测和管理 | 检查命令存在或网络响应 | 需独立确认真实 MCP 握手 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、connection 与 skills | 是 | 注册扩展和宿主路由 | 保留现有工具 |
| 可写 profile 与明确 scope | 导入需要 | 将选择写入补丁 | 停止并检查配置 |
| 无秘密的隔离样本 | 观察要求 | 核对命令、配置和权限 | 手工处理敏感内容 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 扫描 | 用户准备合成来源 | 核对来源及目标 scope |
| 观察 | 导入后回读补丁并重启 | 真实握手或恢复原配置 |
| 退出 | 恢复备份并禁用 | 工具列表与原状态一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 构建/宿主准备，费用未知 | 备份补丁并核对 scope | 固定产物未实测 |
| 持续 | 本地配置及网络，费用未知 | 审查凭据、命令和服务状态 | 实际节时未知 |
| 失败恢复 | 重启与重连资源 | 回读部分写入并恢复 | 实际退出成本未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 配置迁移 | 扫描、选择和写入逻辑 | 真实连接与稳定性 |
| 检测 | 命令存在及 HTTP 状态 | MCP 握手、鉴权和能力 |

> **思考**：[Q02](#research-q02) 的连通性标签不能证明 MCP 握手，扫描包含配置字段，批量导入失败可能已有写入。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的单包把上游面板与宿主桥接到 DSH，并可集中选择和导入本地配置。

[Q02](#research-q02) 的路由信任分支值得与目标宿主联验；状态检测和批量应用应给独立结果。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的连通性标签不能证明 MCP 握手，扫描包含配置字段，批量导入失败可能已有写入。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 只用隔离合成配置观察。按 [Q02](#research-q02) 实际握手并回读补丁，敏感配置保留现有管理方式。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持挂载、扫描及写入。真实宿主权限、安装字节和握手待验证。

- 已检查：作者 README、包清单、源码路径 README.md、scripts/build.mjs、src/panel/host/apply.ts、src/panel/host/service/agents.ts、src/panel/host/routes/import/apply/post.ts、src/panel/host/service/mcp.ts、src/panel/host/routes/import/scan/get.ts、src/vendor/dsh-tauri/host/routes/index.ts、src/panel/host/service/mcp.utils.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定构建映射、实际导入、连接探测和路由信任边界；未构建、安装、运行连接或宿主。
- 下一步：隔离对照伪造命令、HTTP 401、真实 MCP 握手、带标记字段扫描、批量写入失败和还原。

**分析版本**

- **仓库**：[functy23/dsh-mcp-studio](https://github.com/functy23/dsh-mcp-studio)
- **版本号**：1.0.6（[固定提交 6b4f5dd](https://github.com/functy23/dsh-mcp-studio/tree/6b4f5dd2c0de5f20d4625940060f714054bddbe3)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出屏蔽扫描中的秘密字段及导入前差异，验证能否减少错误写入和未授权读取。

隔离对照伪造命令、HTTP 401、真实 MCP 握手、带标记字段扫描、批量写入失败和还原。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .ts | source | 86 | 3873 | 3307 | 245 | — |
| .md | source | 12 | 2409 | — | — | 18699 |
| .mjs | source | 2 | 212 | 147 | 47 | — |
| .tsx | source | 9 | 1242 | 1158 | 29 | — |
| .ts | test | 7 | 813 | 664 | 31 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/functy23/dsh-mcp-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：把本机其他 Agent 的 MCP 配置导入 DSH 时，工作台能验证哪些事实，配置字段和请求边界如何保护？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 其他 Agent 的 MCP 配置如何从扫描变为 profile 可用的条目？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在本机维护多套工具配置的 DSH 用户可扫描 Claude、Codex、Cursor 和 Gemini 的本地配置，再按来源和名称选择服务器。包构建把原 Tauri 面板与两个框架依赖映射到宿主及客户端导出；实际 host 注册配置路由，扫描从用户 home 读取已知位置。应用导入时再次扫描、匹配选择、跳过已存在名称并校验格式，生成带 command/args/env 或 url/headers 的 MCP row 写到 profile 或全局补丁，回执提示重启。相较手工复制 YAML，贡献是单包提供同一导入和技能管理面板，底层界面与路由框架主要来自上游。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-40](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/README.md#L26-L40)

作者说明上游与整合归因。

<details>
<summary>查看原文（15行）</summary>

```text
## 📦 这是什么

Tauri 桌面版（[deepseek-harness-desktop](https://github.com/dsh-tauri-desk/deepseek-harness-desktop)）的扩展面板功能原本分散在**三个互相依赖的插件**里：

| 上游包 | 作用 | 依赖 |
| --- | --- | --- |
| `dsh-tauri-panel-extension` | 扩展面板本体：**Skills / MCP / 插件市场** 三个 tab + host 路由 | `dsh-tauri`、`dsh-tauri-ui` |
| `dsh-tauri` | 宿主/客户端框架桥：`defineRoutes`、`defineService`、`definePanel`、`defineRegister`、locale、store | — |
| `dsh-tauri-ui` | 面板用的组件库：Button/Chip/Modal/SegmentedControl/PanelPage/图标… | `dsh-tauri` |

要装 MCP 管理，就得把这三个一起装上，而且只在 Tauri 发行版里可用。

**dsh-mcp-studio 把它们整合成一个包**：上游源码原样搬运（`src/panel`、`src/vendor/dsh-tauri`、`src/vendor/dsh-tauri-ui`），
用构建期模块映射（`src/bridge`）把旧的裸包名 `dsh-tauri` / `dsh-tauri/client` / `dsh-tauri-ui/client` 指到本地文件，
再补上通用化所需的最小改造 —— **界面本身一行 UI 都没重写**。
```

</details>

**依据 2 · 源码核查**：[scripts/build.mjs:64-84](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/scripts/build.mjs#L64-L84)

host/client 构建入口。

<details>
<summary>查看原文（21行）</summary>

```text

// ---- host half -------------------------------------------------------------
await build({
  ...shared,
  entryPoints: ['src/panel/index.ts'],
  outfile: 'lib/index.js',
  format: 'esm',
  platform: 'node',
  banner: {
    js: "import { createRequire as __createRequire } from 'node:module'; const require = __createRequire(import.meta.url);",
  },
})

// ---- client half -----------------------------------------------------------
await build({
  ...shared,
  entryPoints: ['src/panel/client/index.ts'],
  outfile: 'lib/client.js',
  format: 'cjs',
  platform: 'browser',
  alias: clientAlias,
```

</details>

**依据 3 · 源码核查**：[src/panel/host/apply.ts:26-37](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/apply.ts#L26-L37)

宿主启动服务与路由。

<details>
<summary>查看原文（12行）</summary>

```text
export function apply(ctx: HostContext, config?: Config): void {
  ctx.inject(inject, (hostCtx) => {
    setCurrentHostInstance(hostCtx as unknown as PanelExtensionHost)
    resetProviderRuntime()
    const remountProvider = (): Promise<void> => provider.start(packagedSkillsDir())
    const profileDirPath = profile.peek(config?.profile ?? profile.resolve() ?? DEFAULT_PROFILE)
    ctx.effect(() => startProvider(remountProvider), 'dsh-mcp-studio: skill provider')
    ctx.effect(
      () => routes(hostCtx as unknown as HostContext, { profileDirPath, remountProvider }),
      'dsh-mcp-studio: routes',
    )
    return clearHostRuntime
```

</details>

**依据 4 · 源码核查**：[src/panel/host/service/agents.ts:19-25](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/agents.ts#L19-L25)

扫描四种来源。

```text
export const agents = defineService({
  resolve(home: string = homedir()): ImportedServer[] {
    return uniqBy(
      [...scanClaudeMcp(home), ...scanCodexMcp(home), ...scanCursorMcp(home), ...scanGeminiMcp(home)],
      server => `${server.agent}/${server.name}`,
    )
  },
```

**依据 5 · 源码核查**：[src/panel/host/routes/import/apply/post.ts:12-45](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/routes/import/apply/post.ts#L12-L45)

按选择逐条验证和写入。

<details>
<summary>查看原文（34行）</summary>

```text
  try {
    const wanted = new Set(
      (Array.isArray(body?.items) ? body.items : [])
        .filter((item): item is { agent: string, name: string } =>
          typeof item === 'object' && item !== null && typeof (item as { agent?: unknown }).agent === 'string' && typeof (item as { name?: unknown }).name === 'string')
        .map(item => `${item.agent}/${item.name}`),
    )
    const dir = mcpScopeDir(normalizeMcpScope(body?.scope), deps.profileDirPath)
    const results: Array<{ name: string, ok: boolean, error?: string }> = []
    for (const server of agents.resolve()) {
      if (!wanted.has(`${server.agent}/${server.name}`))
        continue
      const existing = mcp.list(deps.profileDirPath).servers.some(row => row.serverName === server.name)
      if (existing) {
        results.push({ name: server.name, ok: false, error: 'already in profile' })
        continue
      }
      const input: McpInput = {
        id: '',
        serverName: server.name,
        transport: server.transport,
        ...(server.transport === 'stdio'
          ? { command: server.command, args: server.args, env: server.env }
          : { url: server.url, headers: server.headers }),
      }
      const invalid = validateMcpInput(input)
      if (invalid !== null) {
        results.push({ name: server.name, ok: false, error: invalid })
        continue
      }
      mcp.save(dir, input)
      results.push({ name: server.name, ok: true })
    }
    return { ok: results.every(item => item.ok), results, restartNeeded: true }
```

</details>

**依据 6 · 源码核查**：[src/panel/host/service/mcp.ts:70-102](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/mcp.ts#L70-L102)

写入 YAML 配置。

<details>
<summary>查看原文（33行）</summary>

```text
    const stdio = normalizeStdioCommand(input.command ?? '', input.args)
    const config: Record<string, unknown> = input.transport === 'stdio'
      ? {
          serverName: input.serverName,
          transport: input.transport,
          command: stdio.command,
          ...(!isEmpty(stdio.args) ? { args: stdio.args } : {}),
          ...(!isEmpty(input.env) ? { env: input.env } : {}),
          ...(!isEmpty(input.cwd) ? { cwd: input.cwd } : {}),
        }
      : {
          serverName: input.serverName,
          transport: input.transport,
          url: input.url,
          ...(!isEmpty(input.headers) ? { headers: input.headers } : {}),
        }
    const row: Record<string, unknown> = { id, name: MCP_PLUGIN, config }
    if (input.disabled === true)
      row.disabled = true

    const node = toNode<YAMLMap>(row)
    if (existing === undefined) {
      list.add(node)
    }
    else if (existing.list !== undefined) {
      existing.list.items.splice(existing.list.items.indexOf(existing.node), 1, node)
    }
    else {
      rowSeq(doc).items.splice(rowSeq(doc).items.indexOf(existing.node), 1, node)
    }

    savePatch(dirPath, doc)
    return id
```

</details>

#### 缺口

- 目标 Web/桌面宿主的安装、重启和实际 MCP 连接
  **影响**：决定是否可替代现有迁移流程
  **进一步探讨**：在隔离 profile 导入无凭据测试项并核对宿主工具清单

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 连通性检测和导入结果分别说明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

stdio 检测只查命令文件是否存在，未启动和协商；HTTP 检测仅发带 Accept 的请求，不使用保存的 headers，也未检查 response.ok，因而 401 或 500 也能回 ok:true 及状态码。扫描端直接返回包含 env/headers 的解析结构；路由封装先询问宿主 connection.requestRejection，变更方法额外要求回环和同源，读取范围仍取决于实际连接门槛。导入将配置字段写入补丁，若第 N 项写入抛错，外层返回 500，而此前逐条写过的配置没有该函数内的回滚。读写前应限定环境和样本，并通过真实 MCP 连接复核。

#### 证据与依据

**依据 1 · 源码核查**：[src/panel/host/service/mcp.ts:136-158](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/mcp.ts#L136-L158)

检测仅文件存在或 HTTP 状态回执。

<details>
<summary>查看原文（23行）</summary>

```text
  async check(row: McpRow, options: McpCheckOptions = {}): Promise<McpCheckResult> {
    const pathEnv = options.pathEnv ?? process.env.PATH ?? ''
    if (row.transport === 'stdio') {
      const command = row.command ?? ''
      if (command === '')
        return { ok: false, detail: 'row has no command' }
      return resolveCommandOnPath(command, pathEnv, options.platform)
        ? { ok: true, detail: command }
        : { ok: false, detail: `${command} not found on PATH` }
    }
    if (row.url === undefined || !/^https?:\/\//.test(row.url))
      return { ok: false, detail: 'row has no http url' }
    try {
      const response = await fetch(row.url, {
        headers: { accept: 'application/json, text/event-stream' },
        signal: AbortSignal.timeout(options.timeoutMs ?? MCP_CHECK_TIMEOUT_MS),
      })
      return { ok: true, detail: `HTTP ${response.status}` }
    }
    catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      const cause = (error as { cause?: { code?: unknown } }).cause?.code
      return { ok: false, detail: cause !== undefined ? String(cause) : message }
```

</details>

**依据 2 · 源码核查**：[src/panel/host/service/agents.ts:61-86](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/agents.ts#L61-L86)

保留 env 及 headers。

<details>
<summary>查看原文（26行）</summary>

```text
function mapMcpServersEntry(agent: ImportedServer['agent'], name: string, entry: unknown): ImportedServer | null {
  if (!isObject(entry))
    return null
  const record = entry as Record<string, unknown>
  const type = isText(record.type) ? record.type : 'stdio'
  if (type === 'stdio') {
    if (!isText(record.command) || record.command === '')
      return null
    return {
      agent,
      name,
      transport: 'stdio',
      command: record.command,
      args: stringArray(record.args),
      env: stringEntries(record.env),
    }
  }
  if (type === 'http' || type === 'streamable-http') {
    if (!isText(record.url) || record.url === '')
      return null
    return {
      agent,
      name,
      transport: 'streamable-http',
      url: record.url,
      headers: stringEntries(record.headers),
```

</details>

**依据 3 · 源码核查**：[src/panel/host/routes/import/scan/get.ts:6-12](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/routes/import/scan/get.ts#L6-L12)

扫描结果直接作为响应。

```text
export default defineEventHandler((event): McpImportScanResponse | { error: string } => {
  const deps = dshRouteDepsOf<ExtensionRouteDeps>(event)!
  try {
    return {
      servers: agents.resolve(),
      existing: mcp.list(deps.profileDirPath).servers.map(row => row.serverName),
    }
```

**依据 4 · 源码核查**：[src/vendor/dsh-tauri/host/routes/index.ts:253-288](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/vendor/dsh-tauri/host/routes/index.ts#L253-L288)

宿主拒绝与变更调用的额外门槛。

<details>
<summary>查看原文（36行）</summary>

```text
function createHostHandler(connection: ConnectionGate | undefined, node: HostNodeHandler, group: RouteGroup): RouteHandler {
  const declared = group.methods
  const allowed = SUPPORTED_METHODS.filter(method =>
    method === 'OPTIONS'
    // 支持 GET 即隐含支持 HEAD（h3 会把 HEAD 自动匹配到 GET 路由），避免探测式 HEAD 被误判 405。
    || declared.has(method)
    || (method === 'HEAD' && declared.has('GET')))
  const allow = allowed.join(', ')

  return async (request, response) => {
    const rejection = connection?.requestRejection?.(request)
    if (rejection !== undefined) {
      respondJson(response, rejection, { error: rejection === 401 ? 'unauthorized' : 'forbidden' })
      return
    }

    const method = (request.method ?? 'GET').toUpperCase() as HttpMethod
    if (method === 'OPTIONS' && !declared.has('OPTIONS')) {
      response.writeHead(204, { allow })
      response.end()
      return
    }
    if (!allowed.includes(method)) {
      respondJson(response, 405, { error: `仅支持 ${allow} 请求` }, { allow })
      return
    }
    if (MUTATING_METHODS.has(method) && !isLoopback(request)) {
      respondJson(response, 403, { error: '变更操作仅限本机（127.0.0.1）调用' })
      return
    }
    // 回环地址挡不住「本机浏览器里的第三方页面」：CSRF / DNS rebinding 请求同样来自
    // 127.0.0.1。因此变更操作还要过一道来源校验——带 Origin 且与 Host 不符即拒绝。
    // 无 Origin 的非浏览器调用方（curl / 宿主内部）不受影响。
    if (MUTATING_METHODS.has(method) && isCrossOrigin(request)) {
      respondJson(response, 403, { error: 'cross-origin-request' })
      return
```

</details>

**依据 5 · 源码核查**：[src/panel/host/routes/import/apply/post.ts:19-49](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/routes/import/apply/post.ts#L19-L49)

逐项提交及外层错误。

<details>
<summary>查看原文（31行）</summary>

```text
    const dir = mcpScopeDir(normalizeMcpScope(body?.scope), deps.profileDirPath)
    const results: Array<{ name: string, ok: boolean, error?: string }> = []
    for (const server of agents.resolve()) {
      if (!wanted.has(`${server.agent}/${server.name}`))
        continue
      const existing = mcp.list(deps.profileDirPath).servers.some(row => row.serverName === server.name)
      if (existing) {
        results.push({ name: server.name, ok: false, error: 'already in profile' })
        continue
      }
      const input: McpInput = {
        id: '',
        serverName: server.name,
        transport: server.transport,
        ...(server.transport === 'stdio'
          ? { command: server.command, args: server.args, env: server.env }
          : { url: server.url, headers: server.headers }),
      }
      const invalid = validateMcpInput(input)
      if (invalid !== null) {
        results.push({ name: server.name, ok: false, error: invalid })
        continue
      }
      mcp.save(dir, input)
      results.push({ name: server.name, ok: true })
    }
    return { ok: results.every(item => item.ok), results, restartNeeded: true }
  }
  catch (error) {
    event.res.status = 500
    return { error: error instanceof Error ? error.message : String(error) }
```

</details>

#### 缺口

- 真实宿主的跨用户读取权限和所有目标服务器握手结果
  **影响**：关系到本机配置暴露与采用
  **进一步探讨**：隔离环境以无秘密配置核对拒绝、401/500 和 MCP 握手

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样试用并检验更明确的导入确认是否有效？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

先备份隔离 profile 的补丁，只使用可公开的本地样本。导入前核对程序、URL、目标 scope 和配置字段；用工具的真实 MCP 握手，而非面板连通性标签验收。失败时回读补丁，恢复隔离配置，重启后核对工具清单。依赖本地文件和宿主权限，人工审查凭据字段、命令及重启时间可能高于少量手工迁移。可检验的改进是扫描默认遮蔽 env/headers，导入前展示无需秘密的差异及确认摘要，再在写入后附逐条验证。以含标记字段、多项失败和 HTTP 401 对照实际可核对性。

#### 证据与依据

**依据 1 · 源码核查**：[src/panel/host/service/mcp.utils.ts:47-52](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/mcp.utils.ts#L47-L52)

scope 选择 profile 或 DSH_HOME。

```text
export function normalizeMcpScope(value: unknown): McpScope {
  return value === 'global' ? 'global' : 'profile'
}

export function mcpScopeDir(scope: McpScope, profileDirPath: string): string {
  return scope === 'global' ? DSH_HOME : profileDirPath
```

**依据 2 · 源码核查**：[src/panel/host/service/mcp.utils.ts:96-99](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/service/mcp.utils.ts#L96-L99)

同步写入补丁路径。

```text
export function savePatch(dirPath: string, doc: Document): void {
  mkdirSync(dirPath, { recursive: true })
  writeFileSync(join(dirPath, PATCH_FILE_NAME), String(doc), 'utf8')
}
```

**依据 3 · 源码核查**：[src/panel/host/routes/import/apply/post.ts:19-49](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/routes/import/apply/post.ts#L19-L49)

没有事务式整批回滚。

<details>
<summary>查看原文（31行）</summary>

```text
    const dir = mcpScopeDir(normalizeMcpScope(body?.scope), deps.profileDirPath)
    const results: Array<{ name: string, ok: boolean, error?: string }> = []
    for (const server of agents.resolve()) {
      if (!wanted.has(`${server.agent}/${server.name}`))
        continue
      const existing = mcp.list(deps.profileDirPath).servers.some(row => row.serverName === server.name)
      if (existing) {
        results.push({ name: server.name, ok: false, error: 'already in profile' })
        continue
      }
      const input: McpInput = {
        id: '',
        serverName: server.name,
        transport: server.transport,
        ...(server.transport === 'stdio'
          ? { command: server.command, args: server.args, env: server.env }
          : { url: server.url, headers: server.headers }),
      }
      const invalid = validateMcpInput(input)
      if (invalid !== null) {
        results.push({ name: server.name, ok: false, error: invalid })
        continue
      }
      mcp.save(dir, input)
      results.push({ name: server.name, ok: true })
    }
    return { ok: results.every(item => item.ok), results, restartNeeded: true }
  }
  catch (error) {
    event.res.status = 500
    return { error: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 4 · 源码核查**：[src/panel/host/apply.ts:18-37](https://github.com/functy23/dsh-mcp-studio/blob/6b4f5dd2c0de5f20d4625940060f714054bddbe3/src/panel/host/apply.ts#L18-L37)

服务及 profile 路径注入。

<details>
<summary>查看原文（20行）</summary>

```text
export const inject = ['webServer', 'skills', 'connection']

export { loadFilesystemSkillPlugin } from './service/provider.utils'

export function packagedSkillsDir(): string {
  return join(dirname(fileURLToPath(import.meta.url)), '..', 'skills')
}

export function apply(ctx: HostContext, config?: Config): void {
  ctx.inject(inject, (hostCtx) => {
    setCurrentHostInstance(hostCtx as unknown as PanelExtensionHost)
    resetProviderRuntime()
    const remountProvider = (): Promise<void> => provider.start(packagedSkillsDir())
    const profileDirPath = profile.peek(config?.profile ?? profile.resolve() ?? DEFAULT_PROFILE)
    ctx.effect(() => startProvider(remountProvider), 'dsh-mcp-studio: skill provider')
    ctx.effect(
      () => routes(hostCtx as unknown as HostContext, { profileDirPath, remountProvider }),
      'dsh-mcp-studio: routes',
    )
    return clearHostRuntime
```

</details>

#### 缺口

- 固定产物字节及实际宿主卸载回读待验
  **影响**：当前适用隔离观察
  **进一步探讨**：核对 host/client 导出并对照补丁、重启和禁用后的状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
