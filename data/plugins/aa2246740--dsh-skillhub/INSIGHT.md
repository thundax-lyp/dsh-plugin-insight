# DSH SkillHub

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[7ecc5ab](https://github.com/aa2246740/dsh-skillhub/tree/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba)

<!-- BEGIN META -->
[![GitHub ★ 44](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=44&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/aa2246740/dsh-skillhub) [![npm 30d 1,922](https://img.shields.io/static/v1?label=npm+30d&message=1%2C922&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aa2246740/dsh-skillhub) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@aa2246740/dsh-skillhub)
<!-- END META -->

> **功能**：统一管理 DeepSeek Harness 本地 Skills 和 MCP 服务的全局、项目及会话可见性。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 通过修订与作用域链表达跨会话覆盖，并将有效值接到声明和调用检查。

> **主要限制**：[Q03](#research-q03) 前缀和作用域归属不明时拒绝隐藏，进程仍可常驻。可见性不能覆盖其他客户端或删除已有历史。

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
  - [Q01 · 谁会需要三层 MCP 开关？](#detail-section-11)
  - [Q02 · 如何传导并限制工具？](#detail-section-12)
  - [Q03 · 关闭开关能否当作全面隔离？](#detail-section-13)
  - [Q04 · 怎样试用与回退？](#detail-section-14)
  - [Q05 · 影响预览能否减少意外覆盖？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：跨项目工作的 DSH 使用者，可为不同会话控制可见的技能与 MCP 工具。

手工改宿主配置或停止 MCP 服务，容易同时影响其他会话。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| MCP 分层控制 | 选择工具可见范围 | 近次修订可覆盖旧子级 |
| 调用检查 | 拒绝已关闭的可归属工具 | 不是服务器进程或全局权限隔离 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 和 tools 服务 | 必需 | 声明及调用限制 | 保留宿主配置 |
| 可归属 MCP 命名 | 隐藏时必需 | 确定服务与工具关系 | 歧义时拒绝 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份并建立测试服务 | 确认两会话可观察 |
| 设置 | 用户分层修改并试调用 | 只预期作用域变更 |
| 退出 | 用户恢复配置并核对 | 声明和调用符合预期 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 测试服务与宿主资源 | 配置、备份和检查 | 耗时未测 |
| 持续 | MCP 服务仍常驻 | 维护作用域 | 净收益未知 |
| 失败 | 保留原配置 | 恢复并核对既有会话 | 重载开销未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 作用域 | 按最新修订计算有效状态 | 实际误操作率 |
| 调用检查 | 为支持的 MCP 工具加 guard | 多客户端与宿主兼容 |

> **思考**：[Q03](#research-q03) 前缀和作用域归属不明时拒绝隐藏，进程仍可常驻。可见性不能覆盖其他客户端或删除已有历史。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 通过修订与作用域链表达跨会话覆盖，并将有效值接到声明和调用检查。

[Q02](#research-q02) 按查询链算作用域，[Q03](#research-q03) 对歧义服务有明确拒绝条件。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 前缀和作用域归属不明时拒绝隐藏，进程仍可常驻。可见性不能覆盖其他客户端或删除已有历史。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 使用无敏感权限的测试服务验证项目和会话隔离；必要时回到宿主管理。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码的 MCP 作用域、工具限制和歧义处理。宿主行为未运行。

- 已检查：作者 README、包清单、源码路径 src/propagation.ts、src/mcp-runtime.ts、src/mcp.ts、README.md、src/dsh-skillhub.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：聚焦 MCP 传播与守卫，不全面审计技能安装、文件同步和所有权限入口。
- 下一步：同版本宿主试用测试 MCP，核对新旧会话、命名歧义与调用拒绝。

**分析版本**

- **仓库**：[aa2246740/dsh-skillhub](https://github.com/aa2246740/dsh-skillhub)
- **版本号**：1.0.9（[固定提交 7ecc5ab](https://github.com/aa2246740/dsh-skillhub/tree/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 上层修改前提供覆盖预览，可测试用户是否更容易维持细粒度设置。

同版本宿主试用测试 MCP，核对新旧会话、命名歧义与调用拒绝。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 13 | 715 | — | — | 7779 |
| .js | source | 2 | 3239 | 3111 | 255 | — |
| .mjs | source | 1 | 30 | 25 | 2 | — |
| .ts | source | 12 | 2567 | 2249 | 170 | — |
| .tsx | source | 3 | 701 | 673 | 10 | — |
| .mjs | test | 16 | 2295 | 2115 | 39 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/aa2246740/dsh-skillhub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/aa2246740/dsh-skillhub/issues?q=is%3Aissue+created%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/aa2246740/dsh-skillhub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-12T01%3A54%3A58.798Z..2026-11-11T01%3A54%3A58.798Z)



统计日期：2026-11-11。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 使用者能否按全局、项目和会话管理 MCP 工具暴露，并看清实际约束？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁会需要三层 MCP 开关？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在多个项目切换的 DSH 使用者，有时需要让一个会话看到检索工具而另一会话保留更小的工具集合。手工维护多个配置或停用服务会影响其他会话。面板的增量是保存全局、项目、会话范围，并能按当前会话刷新工具暴露。合格结果是声明和调用的实际行为一致，其他项目不受误伤。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:22-36](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/README.md#L22-L36)

作者说明三层技能与 MCP 控制。

<details>
<summary>查看原文（15行）</summary>

```text
**dsh-skillhub** 是专为 DeepSeek Harness 设计的本地技能与 MCP 统一开关管理面板。

它能自动扫描并列出磁盘上已有的所有 Skills（`~/.agents/skills` 与 `$DSH_HOME/skills`）以及运行中的 MCP 工具服务，提供 **全局 (Global) / 本项目 (Project) / 本对话 (Chat)** 三层独立开关控制与智能向下传导能力。

无需手动修改配置，安装后自动挂载，纯可见性控制，绝不修改或删除任何原始磁盘文件。

---

## ✨ 特性

- ⚡ **一键即用**：严格遵循 DSH 官方 Bundle 规范，一行命令自动挂载，无需繁琐接线。
- 🗂️ **本地技能即插即用**：自动读取 Agent 目录与 DSH 目录技能，原生安全，不增删改磁盘文件。
- 🎯 **三层作用范围**：全局设置机器默认值、项目管理工程级偏好、单对话按需微调，互不干扰。
- 🔄 **智能向下传导**：全局操作同步覆盖所有层，项目操作同步所属对话，对话临时覆盖，新会话自动继承。
- 🔌 **MCP 服务联动支持**：独立的 MCP 页签，按服务动态隐藏/暴露工具，进程常驻。
```

</details>

**依据 2 · 源码核查**：[src/mcp.ts:213-242](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp.ts#L213-L242)

分层文件和有效值链。

<details>
<summary>查看原文（30行）</summary>

```text
  private globalPath(): string {
    return join(this.paths.storeDir, 'mcp-global.json')
  }

  private projectPath(folder: string): string {
    return join(this.paths.storeDir, 'mcp-projects', `${folderKey(normalizeFolder(folder))}.json`)
  }

  private sessionPath(sessionId: string): string {
    assertSessionId(sessionId)
    return join(this.paths.storeDir, 'mcp-sessions', `${sessionId}.json`)
  }

  private documentPath(layer: McpLayer, sessionId?: string, folder?: string): string {
    if (!['global', 'project', 'session'].includes(layer)) throw new Error('invalid MCP layer')
    if (layer === 'global') return this.globalPath()
    if (layer === 'project') {
      if (folder === undefined || folder === '') throw new Error('folder required for Project visibility')
      return this.projectPath(folder)
    }
    if (sessionId === undefined || sessionId === '') throw new Error('sessionId required for Session visibility')
    return this.sessionPath(sessionId)
  }

  effectiveGate(server: string, sessionId?: string, folder?: string): { gate: McpGate; source: McpLayer } {
    const normalizedFolder = optionalFolder(folder)
    const global = readDoc(this.globalPath(), 'global')
    const project = normalizedFolder === undefined ? undefined : readDoc(this.projectPath(normalizedFolder), 'project')
    const session = sessionId === undefined || sessionId === '' ? undefined : readDoc(this.sessionPath(sessionId), 'session')
    return propagatedGate(server, [['global', global], ['project', project], ['session', session]])
```

</details>

#### 缺口

- 需求频率和对模型表现的影响未测。
  **影响**：无法证明减少工具声明会提高完成率。
  **进一步探讨**：对同任务比较工具干扰与合格结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何传导并限制工具？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

每个变化使用持久修订；读取相关全局、项目及会话文档后选最近的显式值，同修订时保留更深层的旧行为。运行时以代理会话和目录算 deny 列表并应用 restrict，执行时又依实时服务器集合归属并查有效开关。工具变更和新代理创建都会触发更新。

#### 证据与依据

**依据 1 · 源码核查**：[src/propagation.ts:40-54](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/propagation.ts#L40-L54)

写入持久修订时钟。

<details>
<summary>查看原文（15行）</summary>

```text
/** Synchronous Host mutations share a durable clock, including across hot reloads. */
export function nextPropagationRevision(storeDir: string): number {
  mkdirSync(storeDir, { recursive: true })
  const path = join(storeDir, 'propagation-clock.json')
  const previous: unknown = existsSync(path) ? JSON.parse(readFileSync(path, 'utf8')) : 0
  if (!Number.isSafeInteger(previous) || (previous as number) < 0) {
    throw new Error('Invalid SkillHub visibility document propagation clock')
  }
  const revision = Math.max(Date.now(), (previous as number) + 1)
  if (!Number.isSafeInteger(revision)) throw new Error('SkillHub propagation clock exhausted')
  const temp = `${path}.${randomUUID()}.tmp`
  writeFileSync(temp, `${revision}\n`, { mode: 0o600 })
  renameSync(temp, path)
  return revision
}
```

</details>

**依据 2 · 源码核查**：[src/propagation.ts:56-81](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/propagation.ts#L56-L81)

选最近作用域值。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Newer ancestor operations replace older local values, without copying or
 * enumerating sessions. A later local operation changes only that scope.
 * Only the queried project's chain participates; siblings can never win.
 */
export function propagatedGate(
  id: string | undefined,
  layers: readonly (readonly [Layer, Document | undefined])[],
): { gate: Gate; source: Layer } {
  let gate: Gate = 'on'
  let source: Layer = 'global'
  let latest = -1
  for (const [layer, doc] of layers) {
    if (doc === undefined) continue
    const explicit = id !== undefined && Object.hasOwn(doc.gates, id)
    const value = explicit ? doc.gates[id] : doc.default
    if (value === undefined || value === 'inherit') continue
    const revision = explicit ? (doc.gateRevisions?.[id] ?? 0) : (doc.defaultRevision ?? 0)
    // Equal legacy revisions preserve the existing deeper-layer setting.
    if (revision >= latest) {
      gate = value
      source = layer
      latest = revision
    }
  }
  return { gate, source }
```

</details>

**依据 3 · 源码核查**：[src/mcp.ts:237-242](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp.ts#L237-L242)

仅组合当前链。

```text
  effectiveGate(server: string, sessionId?: string, folder?: string): { gate: McpGate; source: McpLayer } {
    const normalizedFolder = optionalFolder(folder)
    const global = readDoc(this.globalPath(), 'global')
    const project = normalizedFolder === undefined ? undefined : readDoc(this.projectPath(normalizedFolder), 'project')
    const session = sessionId === undefined || sessionId === '' ? undefined : readDoc(this.sessionPath(sessionId), 'session')
    return propagatedGate(server, [['global', global], ['project', project], ['session', session]])
```

**依据 4 · 源码核查**：[src/mcp-runtime.ts:53-94](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp-runtime.ts#L53-L94)

声明过滤和执行 guard。

<details>
<summary>查看原文（42行）</summary>

```text
  const refresh = () => {
    if (refreshing || disposed) return
    refreshing = true
    try {
      const servers = discover()
      const all = names()
      for (const [agent, state] of agents) {
        const id = identity(agent)
        const denied = computeDenyList(all, hub.hiddenServers(id.sessionId, id.folder, servers), servers).sort()
        const signature = JSON.stringify(denied)
        if (signature === state.signature) continue
        const scoped = agent.ctx.get('tools') as Tools
        const next = denied.length ? scoped.restrict({ deny: denied }) : () => {}
        const previous = state.lift
        state.lift = next
        state.signature = signature
        previous()
      }
    } finally { refreshing = false }
  }
  const attach = (agent: Agent) => {
    if (disposed || !agent?.ctx || agents.has(agent)) return
    const scoped = agent.ctx.get('tools') as Tools | undefined
    if (!scoped) return
    const state = { lift: () => {}, guard: () => {}, signature: '[]', dispose: () => {} }
    agents.set(agent, state)
    state.guard = scoped.guard(exec => {
      // discover() runs on every exec so attribution always sees the live
      // server set, not a snapshot from attach time.
      const owner = attributeMcpTool(exec.name, discover())
      const id = identity(agent)
      return owner && hub.effectiveGate(owner, id.sessionId, id.folder).gate === 'off'
        ? 'This MCP service is hidden by SkillHub for this session.' : undefined
    })
    state.dispose = agent.ctx.effect(() => () => { agents.delete(agent); state.lift(); state.guard() }, 'skillhub MCP agent cleanup')
    refresh()
  }
  const on = ctx.on.bind(ctx) as (event: string, fn: (...args: any[]) => void) => () => void
  const offChange = on('tools/change', refresh)
  const offCreated = on('agent/created', ({ agent }: { agent: Agent }) => attach(agent))
  const registry = ctx.get('agents') as { list(): Agent[] } | undefined
  for (const agent of registry?.list() ?? []) attach(agent)
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭开关能否当作全面隔离？

**研究主题**：缺陷与关键质疑

#### 完整回答

MCP 进程无需随面板开关停止。对已纳入宿主代理工具链且能归属的工具，guard 会阻止关闭状态下的后续调用。命名空间前缀冲突或作用域内工具被覆盖时，运行时标为有歧义，并拒绝新增隐藏操作。代码所示范围不涵盖已发出的调用、其他客户端和服务器侧权限；已经进入对话历史的技能文本也无法通过可见性开关删除。

#### 证据与依据

**依据 1 · 源码核查**：[src/mcp-runtime.ts:37-51](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp-runtime.ts#L37-L51)

识别前缀和作用域归属歧义。

<details>
<summary>查看原文（15行）</summary>

```text
  const identity = (agent: Agent) => ({ sessionId: agent.session?.id ?? agent.session?.header?.id ?? agent.id, folder: agent.session?.header?.cwd })
  const problematic = (server: string, servers: string[]) => {
    if (servers.some(other => other !== server && (server.startsWith(`${other}__`) || other.startsWith(`${server}__`)))) return true
    for (const agent of agents.keys()) {
      // A disposing agent context can throw here; "cannot prove clean" means
      // the server is reported problematic rather than trusted.
      try {
        for (const tool of (agent.ctx.get('tools') as Tools).schemas(agent)) {
          if (tool.name.startsWith(`mcp__${server}__`) && tools.get(tool.name) !== tools.get(tool.name, agent)) return true
        }
      } catch {
        return true
      }
    }
    return false
```

</details>

**依据 2 · 源码核查**：[src/mcp-runtime.ts:79-86](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp-runtime.ts#L79-L86)

执行时按实时服务器归属限制。

```text
    state.guard = scoped.guard(exec => {
      // discover() runs on every exec so attribution always sees the live
      // server set, not a snapshot from attach time.
      const owner = attributeMcpTool(exec.name, discover())
      const id = identity(agent)
      return owner && hub.effectiveGate(owner, id.sessionId, id.folder).gate === 'off'
        ? 'This MCP service is hidden by SkillHub for this session.' : undefined
    })
```

**依据 3 · 源码核查**：[src/mcp-runtime.ts:103-116](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp-runtime.ts#L103-L116)

拒绝无法完整隐藏的服务器。

<details>
<summary>查看原文（14行）</summary>

```text
    catalog(query: McpCatalogQuery = {}) {
      const servers = discover()
      const result = hub.catalog(query, names(), servers)
      return { ...result, servers: result.servers.map(server => ({ ...server, supported: !problematic(server.name, servers) })) }
    },
    mutate(query: McpCatalogQuery, server: string, onValue?: boolean) {
      const servers = discover()
      if (!servers.includes(server)) throw new Error('MCP service is no longer registered; refresh the list')
      if (onValue === false && problematic(server, servers)) throw new Error('Cannot fully hide this service: ambiguous namespace or scope-local tools')
      const request = { ...query, layer: query.layer ?? 'global', server }
      if (onValue === undefined) hub.inherit(request)
      else hub.toggle({ ...request, on: onValue })
      refresh()
      return this.catalog(query)
```

</details>

**依据 4 · 作者声明**：[README.md:35-36](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/README.md#L35-L36)

作者说明 MCP 进程常驻。

```text
- 🔄 **智能向下传导**：全局操作同步覆盖所有层，项目操作同步所属对话，对话临时覆盖，新会话自动继承。
- 🔌 **MCP 服务联动支持**：独立的 MCP 页签，按服务动态隐藏/暴露工具，进程常驻。
```

**依据 5 · 作者声明**：[README.md:142-144](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/README.md#L142-L144)

技能正文历史仍保留。

```text
<summary><b>Q: 为什么开启了某个 Skill，输入框输入 <code>/</code> 没有立刻补全？</b></summary>

A: SkillHub 保存开关后，会通过官方 Cordis 生命周期重新挂载技能补全插件，清掉其旧目录缓存。重新打开 `/` 即可看到新列表，不需要 Cmd+R、F5 或重启桌面端。也可点击技能面板右上角“更多操作 → 刷新 / 补全”手动重试。模型下一次请求使用新设置；已经读入历史的技能正文不会被删除。
```

#### 缺口

- 未验证同版本宿主工具表与 guard 的实际执行。
  **影响**：不能把插件当成权限或数据隔离系统。
  **进一步探讨**：使用无敏感本地测试服务检查声明、调用拒绝及直接连接。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样试用与回退？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

在隔离 DSH profile 配置一个没有敏感权限的测试 MCP，设置项目和会话开关，分别看工具是否列出、调用是否拒绝及同项目其他会话效果。全局改变可能覆盖既有细粒度偏好，改前保存原配置。出现不支持或调用与声明不一致时先恢复配置，必要时通过宿主停用对应服务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:42-44](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/README.md#L42-L44)

兼容版本声明。

```text
## 📦 安装

支持 DeepSeek Harness **0.2.0-rc.2**。GitHub 和 npm 使用同一个包名 `@aa2246740/dsh-skillhub`，安装时不要设置 npm 别名。
```

**依据 2 · 作者声明**：[README.md:106-113](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/README.md#L106-L113)

作者给出三层操作传播。

```text
## ⚙️ 开关传导规则

| 操作层级 | 影响范围 | 说明 |
|---|---|---|
| **全局 (Global)** | 全局 + 所有项目 + 所有对话 | 统一设定基准，覆盖旧选项（重复设同值也同步） |
| **本项目 (Project)** | 当前项目 + 该项目下所有对话 | 仅作用于本项目，不影响其他项目及其会话 |
| **本对话 (Chat)** | 仅当前对话 | 临时调整，不影响其他会话 |
| **新建继承** | 自动向下继承 | 新建项目继承全局状态；新开会话继承所属项目状态 |
```

**依据 3 · 源码核查**：[src/mcp-runtime.ts:103-116](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/mcp-runtime.ts#L103-L116)

实际返回支持状态。

<details>
<summary>查看原文（14行）</summary>

```text
    catalog(query: McpCatalogQuery = {}) {
      const servers = discover()
      const result = hub.catalog(query, names(), servers)
      return { ...result, servers: result.servers.map(server => ({ ...server, supported: !problematic(server.name, servers) })) }
    },
    mutate(query: McpCatalogQuery, server: string, onValue?: boolean) {
      const servers = discover()
      if (!servers.includes(server)) throw new Error('MCP service is no longer registered; refresh the list')
      if (onValue === false && problematic(server, servers)) throw new Error('Cannot fully hide this service: ambiguous namespace or scope-local tools')
      const request = { ...query, layer: query.layer ?? 'global', server }
      if (onValue === undefined) hub.inherit(request)
      else hub.toggle({ ...request, on: onValue })
      refresh()
      return this.catalog(query)
```

</details>

#### 缺口

- 宿主加载、重载和撤销耗时未测。
  **影响**：无法估计复杂设置的长期维护。
  **进一步探讨**：测试两项目两会话与插件卸载，核对恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 影响预览能否减少意外覆盖？

**研究主题**：新假设与验证

#### 完整回答

可试验保存上层开关前显示会话样例与将覆盖的旧值，让用户看到哪些更深层设置会失效。现有修订比较能直接计算这类预览，但跨任意未枚举会话仍需解释。对照直接保存和预览，用相同的交错修改测误关、恢复步骤及时间。若规则已经清晰且预览增加摩擦而无误关改善，方案价值不足。

#### 证据与依据

**依据 1 · 源码核查**：[src/propagation.ts:56-81](https://github.com/aa2246740/dsh-skillhub/blob/7ecc5ab2a05bd7f411edaf631fcb52a9c1dc63ba/src/propagation.ts#L56-L81)

较新祖先值覆盖较旧本地值，提供计算依据。

<details>
<summary>查看原文（26行）</summary>

```text
/**
 * Newer ancestor operations replace older local values, without copying or
 * enumerating sessions. A later local operation changes only that scope.
 * Only the queried project's chain participates; siblings can never win.
 */
export function propagatedGate(
  id: string | undefined,
  layers: readonly (readonly [Layer, Document | undefined])[],
): { gate: Gate; source: Layer } {
  let gate: Gate = 'on'
  let source: Layer = 'global'
  let latest = -1
  for (const [layer, doc] of layers) {
    if (doc === undefined) continue
    const explicit = id !== undefined && Object.hasOwn(doc.gates, id)
    const value = explicit ? doc.gates[id] : doc.default
    if (value === undefined || value === 'inherit') continue
    const revision = explicit ? (doc.gateRevisions?.[id] ?? 0) : (doc.defaultRevision ?? 0)
    // Equal legacy revisions preserve the existing deeper-layer setting.
    if (revision >= latest) {
      gate = value
      source = layer
      latest = revision
    }
  }
  return { gate, source }
```

</details>

#### 缺口

- 没有影响预览的用户对照。
  **影响**：误操作减少量未知。
  **进一步探讨**：在两个项目的合成配置下做盲测。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
