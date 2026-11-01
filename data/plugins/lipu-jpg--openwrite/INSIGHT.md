# dsh-Openwrite

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)

源码版本：[a8b9e78](https://github.com/LiPu-jpg/Openwrite/tree/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b)

<!-- BEGIN META -->
[![GitHub ★ 906](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=906&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiPu-jpg/Openwrite) [![npm 30d 8,040](https://img.shields.io/static/v1?label=npm+30d&message=8%2C040&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openwrite)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中规划、写作、审稿和管理长篇小说。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示套件整合 DSH、工作区及小说 Core；原生能力和领域算法分别归其提供者。

> **主要限制**：[Q04](#research-q04) 已有锁和检查点仍不能证明模型、正文和任务结算跨步骤一致；[Q05](#research-q05) 历史验收不可套用当前包。

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
  - [Q01 · 长篇作者为什么需要 DSH 写作工作台，手工文件有何替代？](#detail-section-11)
  - [Q02 · 工作区与授权如何到达 Core 具体操作？](#detail-section-12)
  - [Q03 · 托管 Core 如何固定和校验，哪些失败仍不可恢复？](#detail-section-13)
  - [Q04 · 章节任务跨模型、落盘与后续操作中断时有什么保护？](#detail-section-14)
  - [Q05 · 模型、部署、隐私、工作量及回退条件是什么？](#detail-section-15)
  - [Q06 · 能否让作者在恢复前辨明最后真实状态及安全下一步？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长篇作者需要组织设定、章节和审稿，并在受控作品中持续写作。

作者可用普通编辑器、文件和模型对话手工管理章节。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 小说工具 | 调用 Core 的写作与资料功能 | 需工作区、策略和可用后端 |
| 工作区隔离 | 解析浏览器选择的作品 | ID 或注册服务缺失时拒绝 |
| 托管运行时 | 验证并启动 Core | 平台、下载、Python 条件未实测 |
| 恢复路径 | 定稿历史恢复与任务续接 | 各步骤存在保护，跨步骤未验证 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH、Node 与工作区注册 | 插件运行需要 | 注入工具和选择作品 | 可能无法加载或请求被拒 |
| Core 5.8.22 或匹配外部服务 | 领域功能需要 | 工作流与稿件操作 | 后端不可用或版本不符 |
| Python、uv、锁定依赖 | 托管环境需要 | 运行 Core | 下载或安装失败 |
| 配置模型 | 生成和审稿需要 | 处理作品上下文 | 费用、外发及可用性依配置而异 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 作者备份并选择隔离作品 | 确认可信 workspace 和模型目标 |
| 环境 | 准备托管环境或外部 Core | 摘要、健康与版本匹配才继续 |
| 创作 | 作者生成单章并检查设定和原稿 | 质量由作者验收 |
| 恢复 | 对照稿件、checkpoint 和任务状态 | 不一致或未知先暂停并备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 运行时下载、存储、模型费用未知 | 配置宿主、模型和备份 | 跨平台安装未验收 |
| 持续 | 模型调用和算力支出未知 | 审稿和一致性核对 | 文学收益未对照 |
| 恢复 | 备份和可能的重试费用未知 | 核对版本、稿件和状态 | 故障点重复消费未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 工作区 | 解析 ID 并拒绝未知工作区 | 所有宿主权限配置 |
| 运行时 | 清单摘要和健康版本检查 | 各平台真实安装 |
| 恢复 | Core 有锁、revision 与检查点 | 全链跨故障点一致性 |

> **思考**：[Q04](#research-q04) 已有锁和检查点仍不能证明模型、正文和任务结算跨步骤一致；[Q05](#research-q05) 历史验收不可套用当前包。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示套件整合 DSH、工作区及小说 Core；原生能力和领域算法分别归其提供者。

[Q02](#research-q02) 明确宿主身份与工具策略，[Q03](#research-q03) 对 artifacts 校验；[Q04](#research-q04) 区分 Core 既有恢复与未证实的跨步骤一致性。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 已有锁和检查点仍不能证明模型、正文和任务结算跨步骤一致；[Q05](#research-q05) 历史验收不可套用当前包。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 有备份能力的作者可先在隔离副本试用单章；模型目的地或恢复状态不清时停止，使用备份与手工编辑。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定提交桥接及 Core wheel 代表性源码已查；未运行宿主、模型和故障恢复。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/openwrite-bridge/src/preset-tools.ts、packages/openwrite-bridge/src/index.ts、packages/openwrite-bridge/src/domain.ts、packages/openwrite-bridge/src/tool-policy.ts、packages/openwrite-bridge/src/client.ts、release/runtime-manifest.json、packages/openwrite-bridge/src/managed-runtime.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交 README、包清单、DSH 工具桥、workspace 校验、托管运行时代码以及 Core 5.8.22 wheel 的六个成员只读核查；未运行目标、宿主、模型或故障实验，不代表所有 UI、模型和后端路径已审计。
- 下一步：固定宿主和模型对照隔离作品，故障注入生成、写入与状态结算之间的中断，并按 [Q06](#research-q06) 记录恢复决策。

**分析版本**

- **仓库**：[LiPu-jpg/Openwrite](https://github.com/LiPu-jpg/Openwrite)
- **版本号**：0.2.29（[固定提交 a8b9e78](https://github.com/LiPu-jpg/Openwrite/tree/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设读取式一致性预览可帮助作者选择恢复动作；尚未排除现有 UI 等价能力或验证。

固定宿主和模型对照隔离作品，故障注入生成、写入与状态结算之间的中断，并按 [Q06](#research-q06) 记录恢复决策。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 108 | 10572 | — | — | 164594 |
| .mjs | source | 34 | 5090 | 4546 | 352 | — |
| .mjs | test | 13 | 3467 | 2769 | 570 | — |
| .ts | source | 39 | 14937 | 13625 | 710 | — |
| .ts | test | 16 | 1566 | 1378 | 93 | — |
| .tsx | test | 23 | 6884 | 6184 | 148 | — |
| .tsx | source | 28 | 13398 | 12309 | 485 | — |
| .js | source | 5 | 170 | 150 | 5 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-01），可前往 [GitHub Issues](https://github.com/LiPu-jpg/Openwrite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 长篇工作台、Core 托管和章节恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 长篇作者为什么需要 DSH 写作工作台，手工文件有何替代？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:9-10 和 package.json:1-4 将本套件定位为在 DSH 中规划、写作、审稿与管理长篇；用户也可以在编辑器中管理设定、章节和模型对话。套件的可归因增量是把预设、界面、工作区约束与小说领域后端组织到 DSH；会话来自宿主、领域逻辑来自 Core，不能把这些分别归给桥的算法原创。是否真正提高文学质量或节省核对时间仍无同任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:9-10](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/README.md#L9-L10)

作者描述长篇任务。

```text
<h1 align="center">dsh-Openwrite</h1>
<p align="center">在 DeepSeek Harness 中规划、写作、审稿和管理长篇小说。</p>
```

**依据 2 · 源码核查**：[package.json:1-4](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/package.json#L1-L4)

项目描述及版本。

```text
{
  "name": "dsh-openwrite",
  "version": "0.2.29",
  "description": "OpenWrite 长篇小说领域后端接入 DeepSeek Harness：统一创作 Agent 预设 + 原生创作工作台",
```

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/preset-tools.ts:9-20](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/preset-tools.ts#L9-L20)

注册领域工具与政策。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = '@dsh-novel/openwrite-tools'
export const inject = ['novelDomain', 'tools']

export const Config = z.object({ presentation: z.union(['native', 'ptc', 'both']).default('native') })

/** This row belongs in an Agent preset, never in the host bundle. */
export function apply(ctx: Context, config: { presentation?: 'native' | 'ptc' | 'both' } = {}): void {
  if (config.presentation && config.presentation !== 'native') ctx.effect(() => ctx.tools.presentAs(config.presentation!), 'openwrite: tool presentation')
  ctx.effect(() => ctx.tools.guard(execution => novelPolicyDenial(ctx, execution)), 'openwrite: execution policy')
  registerNovelTools(ctx, ctx.novelDomain.clientFactory(), {
    timeoutMs: ctx.novelDomain.toolOptions.timeoutMs,
    outputDir: ctx.novelDomain.toolOptions.outputDir ?? join(tmpdir(), 'openwrite-exports'),
```

</details>

#### 缺口

- 无作者任务、普通编辑器与 DSH 工作流对照
  **影响**：不能量化文学效果或人工节时
  **进一步探讨**：固定长篇设定与章节，盲评作品和作者耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 工作区与授权如何到达 Core 具体操作？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

index.ts:52-60 从宿主 workspaceRegistry 按 ID 解析根目录；domain.ts:329-348 对缺失、无 registry 或未知工作区拒绝，355-359 可通过宿主授权回调检查浏览器请求。preset-tools.ts:9-20 注入 novelDomain 与 tools，安装执行 guard 后注册工具；tool-policy.ts:36-43 将未知和部分预览默认视作写入，按具体 effect 交由策略。client.ts:164-175 为请求派生工作区范围客户端，243-250 在调用时合并调用者取消、超时与连接 token。可见桥接与保护的设计，但未跑真实宿主，且授权服务、外部 Core 配置及每个工具的完整路径未穷尽。

#### 证据与依据

**依据 1 · 源码核查**：[packages/openwrite-bridge/src/index.ts:52-60](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/index.ts#L52-L60)

从宿主工作区登记解析。

```text
export function apply(ctx: Context, config: Config) {
  // The web host process mounts ctx.workspaceRegistry. Resolve it lazily on
  // every call: plugin start order must not strand the lookup, an absent
  // registry (null) fails closed in the domain, and ctx.inject(['webServer',
  // ...]) would silently never fire if we inject-required a second service.
  const resolveWorkspace = (workspaceId: string): string | undefined | null => {
    const registry = ctx.get('workspaceRegistry')
    if (registry === undefined) return null
    return registry.get(workspaceId as WorkspaceId)?.path
```

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/domain.ts:329-348](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/domain.ts#L329-L348)

浏览器工作区缺失或不认识时拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
  /**
   * Resolve a browser-supplied workspace id through the host registry, failing
   * closed per the contract: missing id → 400 WORKSPACE_CONTEXT_MISSING, no
   * registry → 503 WORKSPACE_REGISTRY_UNAVAILABLE, unknown id → 400 WORKSPACE_UNKNOWN.
   */
  private resolveBrowserWorkspace(id: string | undefined): { root: string, id: string } | { rejection: WorkspaceRejection } {
    if (id === undefined) {
      return { rejection: { status: 400, code: 'WORKSPACE_CONTEXT_MISSING', message: 'missing workspace id (x-dsh-workspace-id header or ?workspace= param)' } }
    }
    if (this.resolveWorkspace === undefined) {
      return { rejection: { status: 503, code: 'WORKSPACE_REGISTRY_UNAVAILABLE', message: 'host workspaceRegistry service is not available' } }
    }
    const root = this.resolveWorkspace(id)
    if (root === null) {
      return { rejection: { status: 503, code: 'WORKSPACE_REGISTRY_UNAVAILABLE', message: 'host workspaceRegistry service is not available' } }
    }
    if (root === undefined) {
      return { rejection: { status: 400, code: 'WORKSPACE_UNKNOWN', message: `workspace id is not registered: ${id}` } }
    }
    return { root, id }
```

</details>

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/domain.ts:355-359](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/domain.ts#L355-L359)

浏览器请求授权回调。

```text
  registerWebRoutes(ctx: Context): void {
    const register: typeof ctx.webServer.register = route => ctx.webServer.register({ ...route, handler: (req, res) => {
      const rejection = this.authorizeRequest?.(req.headers)
      if (rejection !== undefined) { sendJson(res, rejection, { error: 'dsh browser authentication required' }); return }
      return route.handler(req, res)
```

**依据 4 · 源码核查**：[packages/openwrite-bridge/src/preset-tools.ts:9-20](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/preset-tools.ts#L9-L20)

工具服务注册与 guard。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = '@dsh-novel/openwrite-tools'
export const inject = ['novelDomain', 'tools']

export const Config = z.object({ presentation: z.union(['native', 'ptc', 'both']).default('native') })

/** This row belongs in an Agent preset, never in the host bundle. */
export function apply(ctx: Context, config: { presentation?: 'native' | 'ptc' | 'both' } = {}): void {
  if (config.presentation && config.presentation !== 'native') ctx.effect(() => ctx.tools.presentAs(config.presentation!), 'openwrite: tool presentation')
  ctx.effect(() => ctx.tools.guard(execution => novelPolicyDenial(ctx, execution)), 'openwrite: execution policy')
  registerNovelTools(ctx, ctx.novelDomain.clientFactory(), {
    timeoutMs: ctx.novelDomain.toolOptions.timeoutMs,
    outputDir: ctx.novelDomain.toolOptions.outputDir ?? join(tmpdir(), 'openwrite-exports'),
```

</details>

**依据 5 · 源码核查**：[packages/openwrite-bridge/src/tool-policy.ts:36-48](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/tool-policy.ts#L36-L48)

操作效果分类与保守默认。

<details>
<summary>查看原文（13行）</summary>

```text
/** Unknown and preview operations fail closed: previews can persist confirmation records. */
export function novelEffect(name: string, args: unknown): NovelEffect {
  if (reads.has(name)) return 'read'
  const values = args && typeof args === 'object' ? args as Record<string, unknown> : {}
  if (name === 'novel_write_chapter' && values.dry_run === true) return 'read'
  if (readActions[name]?.includes(String(values.action))) return 'read'
  if (name === 'novel_model_benchmark' && values.action === 'run') return 'generate'
  return generates.has(name) ? 'generate' : 'write'
}

export function novelPolicyDenial(ctx: Context, execution: Readonly<ToolExecution>): string | undefined {
  if (!execution.name.startsWith('novel_')) return
  const effect = novelEffect(execution.name, execution.arguments)
```

</details>

**依据 6 · 源码核查**：[packages/openwrite-bridge/src/client.ts:164-175](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/client.ts#L164-L175)

按工作区派生客户端。

<details>
<summary>查看原文（12行）</summary>

```text
   * Derive a lightweight request-scoped client sharing baseUrl/timeout/onMutation.
   * Every request it makes carries the §3 context headers, and mutation
   * notifications report this context so invalidation stays per-root.
   */
  scoped(context: WorkspaceContext): StudioClient {
    return new StudioClient({ connect: this.connect, baseUrl: this.baseUrl, timeoutMs: this.timeoutMs, onMutation: this.onMutation, context })
  }

  /** §3 context headers; empty for a legacy (unscoped) client. */
  private contextHeaders(): Record<string, string> {
    const context = this.context
    if (context === undefined) return {}
```

</details>

**依据 7 · 源码核查**：[packages/openwrite-bridge/src/client.ts:243-250](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/client.ts#L243-L250)

请求 timeout、取消及 token。

```text
  /** One fetch honoring both the caller's abort signal and the configured timeout. */
  private async request(url: URL, init: RequestInit, signal: AbortSignal | undefined): Promise<Response> {
    const signals = [AbortSignal.timeout(this.timeoutMs)]
    if (signal !== undefined) signals.push(signal)
    try {
      const connection = await this.connect?.()
      const target = connection ? new URL(url.pathname + url.search, connection.baseUrl) : url
      const headers = connection?.token ? { ...(init.headers as Record<string, string>), Authorization: `Bearer ${connection.token}` } : init.headers
```

#### 缺口

- 未运行宿主及所有工具策略
  **影响**：无法证明用户权限、错误和模型链实际行为
  **进一步探讨**：用隔离 workspace、无权限和未知 ID 做请求对照。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 托管 Core 如何固定和校验，哪些失败仍不可恢复？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

runtime-manifest.json:1-7、58-64 固定 Core 5.8.22、合约 1、Python 版本及 wheel/锁文件摘要；managed-runtime.ts:545-558 在准备时比对 wheel、requirements 与平台依赖 SHA-256，600-610 安装后检查运行接口，686-694 对健康响应版本和协议再校验。固定 Git 对象中的 Core wheel 经只读提取实际 SHA-256 与 manifest 匹配，成员原文及各自摘要保存在 CORE-WHEEL-INSPECTION.json；这证明所读包对应清单，不能证明下载渠道、目标环境安全、模型可用或生成写作无误。作者说明首次可能下载运行环境，网络与平台受限时仍可能失败。

#### 证据与依据

**依据 1 · 源码核查**：[release/runtime-manifest.json:1-7](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/release/runtime-manifest.json#L1-L7)

固定 Core 与协议版本。

```text
{
  "schema": 1,
  "dsh": "0.1.2-rc.1",
  "uv_version": "0.11.19",
  "python_version": "3.12.13",
  "core_version": "5.8.22",
  "contract_version": 1,
```

**依据 2 · 源码核查**：[release/runtime-manifest.json:58-64](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/release/runtime-manifest.json#L58-L64)

wheel 和依赖锁摘要。

```text
  "wheel": {
    "file": "openwrite-5.8.22-py3-none-any.whl",
    "sha256": "13d48e14f95d61de3e4e503121326cb3be7d00b9eff874a2b0931a41aa2f5bc0"
  },
  "requirements": {
    "file": "requirements.lock",
    "sha256": "322d28b184dc3bf00a3a05986ac7d60a9cc1bcf61d3ffea0ace6e0906f474973"
```

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:545-558](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/managed-runtime.ts#L545-L558)

准备时验证 artifacts 摘要。

<details>
<summary>查看原文（14行）</summary>

```text
    const manifest = JSON.parse(await readFile(join(this.artifacts, 'runtime-manifest.json'), 'utf8')) as RuntimeManifest
    const platform = manifest.platforms[`${process.platform}-${process.arch}`]
    if (this.pythonPath && !isAbsolute(this.pythonPath)) throw new Error('pythonPath / OPENWRITE_PYTHON must be an absolute path to a Python executable, without command-line arguments')
    if (this.pythonModulePaths.length && !this.pythonPath) throw new Error('pythonModulePaths requires pythonPath or OPENWRITE_PYTHON')
    if (this.pythonModulePaths.some(path => !isAbsolute(path))) throw new Error('pythonModulePaths must contain absolute dependency directory paths')
    if (!this.pythonPath && !platform) throw new UnsupportedRuntimePlatformError(`${process.platform}/${process.arch}`)
    if (!manifest.wheel || !manifest.requirements) throw new Error('The package is missing Core or dependency checksums')
    const wheel = join(this.artifacts, manifest.wheel.file)
    const requirements = join(this.artifacts, manifest.requirements.file)
    if (await sha256(wheel) !== manifest.wheel.sha256 || await sha256(requirements) !== manifest.requirements.sha256) {
      throw new Error('Package verification failed; reinstall OpenWrite')
    }
    for (const artifact of manifest.dependency_wheels ?? []) {
      if (await sha256(join(this.artifacts, artifact.file)) !== artifact.sha256) throw new Error('Platform dependency verification failed; reinstall OpenWrite')
```

</details>

**依据 4 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:600-610](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/managed-runtime.ts#L600-L610)

依赖安装及 API 检查。

<details>
<summary>查看原文（11行）</summary>

```text
        if (await readFile(join(destination, '.complete'), 'utf8').catch(() => '') !== generation) {
          const uv = await this.extract(platform.uv, signal)
          const basePython = await this.extract(platform.python, signal)
          this.update('installing', 'Installing isolated dependencies; first use may take several minutes')
          await rm(destination, { recursive: true, force: true })
          try {
            await this.command(uv, ['venv', '--python', basePython, destination], signal)
            await this.command(uv, ['pip', 'sync', '--python', python, '--require-hashes', '--only-binary', ':all:',
              ...(manifest.dependency_wheels?.length ? ['--find-links', join(this.artifacts, 'wheels')] : []), requirements], signal)
            await this.command(uv, ['pip', 'install', '--python', python, '--no-deps', wheel], signal)
            await this.command(python, ['-I', '-c', 'from tools.studio_http import health_payload; from tools.studio import create_server; assert health_payload()["contract_version"] == 1'], signal)
```

</details>

**依据 5 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:686-694](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/managed-runtime.ts#L686-L694)

健康结果检查版本和协议。

```text
      const connection = { baseUrl: `http://127.0.0.1:${port}`, token }
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
```

**依据 6 · 作者声明**：[README.md:85-88](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/README.md#L85-L88)

作者描述运行时下载与成本。

````text
不要调用写作模型做安装检查，不要自动升级宿主或放宽 pnpm 构建授权。
```

首次使用会下载固定版本的 uv、Python 3.12 和锁定依赖，保存在当前 dsh 的专属目录。无需预装 Python，也无需克隆两个分支。目标平台为 macOS arm64/x64、Linux x64、Windows x64；各平台通过情况以发布验收报告为准。模型费用另计。
````

#### 缺口

- 未运行下载、安装、外部模式或模型
  **影响**：不能断言跨平台部署成功或全流程安全
  **进一步探讨**：固定平台用隔离目录验证摘要不匹配、下载中断和健康失败。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 章节任务跨模型、落盘与后续操作中断时有什么保护？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

固定 Core 5.8.22 wheel 内 tools/manuscript_editing.py:181-211 的恢复路径要求显式确认、项目写锁和当前 revision 匹配，先保存恢复前 checkpoint，再原子替换正文；tools/task_runner.py:190-220 的任务重试保留已有 drafted run 和 completed_chapters；tools/chapter_run_v2.py:181-191 拒绝缺失或过期 revision。这些直接检查同一 wheel 内成员，完整成员与哈希由附加原件 CORE-WHEEL-INSPECTION.json 保全。保护的存在不证明模型生成、正文替换、后续状态结算跨步骤原子，也不证明所有故障点不会重复模型调用或丢失其他状态；必须按当前真实状态回读，不能简单重试。

固定 wheel 的关键原文如下，成员行号对应自包含补充原件中的源码：

`tools/manuscript_editing.py:190-211`：

```python
        if not confirm:
            raise ManuscriptEditingError("恢复版本需要显式确认", code="CONFIRMATION_REQUIRED")
        clean_chapter = self._chapter_id(chapter_id)
        clean_version = self._version_id(version_id)
        try:
            with ProjectWriteLock(
                self.project_root,
                self.novel_id,
                operation=f"manuscript_restore:{clean_chapter}:{clean_version}",
            ):
                path = self.chapter_path(clean_chapter)
                current = path.read_bytes().decode("utf-8")
                if not self.revision_matches(current_revision, self.fingerprint(current)):
                    raise ManuscriptEditingError("当前正文已变化", code="STALE_REVISION")
                version, content = self.load(clean_chapter, clean_version)
                self.checkpoint(
                    clean_chapter,
                    reason="restore",
                    label=f"恢复前: {clean_version}",
                    content=current,
                )
                self._atomic_text(path, content)
```

`tools/task_runner.py:204-218`：

```python

        runs = ChapterRunV2Store(self.project_root, self.novel_id)
        if previous.get("type") == "chapter_write":
            latest = runs.latest_for_chapter(
                str(previous.get("chapter_id") or payload.get("chapter_id") or "")
            )
            if latest and latest.status == "drafted":
                payload["run_id_v2"] = latest.run_id
        if previous.get("type") == "continuous_write":
            payload["_resume_runs"] = {
                run.chapter_id: run.run_id
                for run in reversed(runs.list(statuses={"drafted"}, limit=200))
            }
        if result.get("completed_chapters"):
            payload["_already_completed"] = list(result["completed_chapters"])
```

`tools/chapter_run_v2.py:181-191`：

```python
    def require_revision(self, manifest: ChapterRunV2Manifest, expected_revision: str) -> None:
        expected = str(expected_revision or "").strip()
        if not expected:
            raise ChapterRunV2Error(
                "修改 Chapter Run V2 前必须提供 revision",
                code="REVISION_REQUIRED",
            )
        if expected != self.revision(manifest):
            raise ChapterRunV2Error(
                "Chapter Run V2 已变化，请重新读取后再操作",
                code="STALE_REVISION",
```

#### 证据与依据

**依据 1 · 源码核查**：[release/runtime-manifest.json:1-7](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/release/runtime-manifest.json#L1-L7)

固定所检查 Core 版本。

```text
{
  "schema": 1,
  "dsh": "0.1.2-rc.1",
  "uv_version": "0.11.19",
  "python_version": "3.12.13",
  "core_version": "5.8.22",
  "contract_version": 1,
```

**依据 2 · 源码核查**：[release/runtime-manifest.json:58-60](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/release/runtime-manifest.json#L58-L60)

固定 wheel 名称及摘要。

```text
  "wheel": {
    "file": "openwrite-5.8.22-py3-none-any.whl",
    "sha256": "13d48e14f95d61de3e4e503121326cb3be7d00b9eff874a2b0931a41aa2f5bc0"
```

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:545-555](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/managed-runtime.ts#L545-L555)

托管路径验证 wheel 与锁文件摘要。

<details>
<summary>查看原文（11行）</summary>

```text
    const manifest = JSON.parse(await readFile(join(this.artifacts, 'runtime-manifest.json'), 'utf8')) as RuntimeManifest
    const platform = manifest.platforms[`${process.platform}-${process.arch}`]
    if (this.pythonPath && !isAbsolute(this.pythonPath)) throw new Error('pythonPath / OPENWRITE_PYTHON must be an absolute path to a Python executable, without command-line arguments')
    if (this.pythonModulePaths.length && !this.pythonPath) throw new Error('pythonModulePaths requires pythonPath or OPENWRITE_PYTHON')
    if (this.pythonModulePaths.some(path => !isAbsolute(path))) throw new Error('pythonModulePaths must contain absolute dependency directory paths')
    if (!this.pythonPath && !platform) throw new UnsupportedRuntimePlatformError(`${process.platform}/${process.arch}`)
    if (!manifest.wheel || !manifest.requirements) throw new Error('The package is missing Core or dependency checksums')
    const wheel = join(this.artifacts, manifest.wheel.file)
    const requirements = join(this.artifacts, manifest.requirements.file)
    if (await sha256(wheel) !== manifest.wheel.sha256 || await sha256(requirements) !== manifest.requirements.sha256) {
      throw new Error('Package verification failed; reinstall OpenWrite')
```

</details>

#### 缺口

- 未做模型响应、原子替换和任务结算之间的崩溃注入
  **影响**：无法证明端到端一致性或不重复消费
  **进一步探讨**：在隔离作品逐故障点注入并核对正文、任务和实际模型调用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 模型、部署、隐私、工作量及回退条件是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-4、34-35、55-70 声明 suite 0.2.29、Node >=22.19 和精确 DSH 版本列表；这只是清单，README:57-61 的验收声明针对 0.2.28，不能转写为当前提交 0.2.29 通过。README:85-88 描述首次获取固定 Python、uv 和依赖以及模型另计；index.ts:40-49 允许 managed/external、外部地址、密钥和 600 秒工具预算。模型可向所配服务发送作品上下文，确切出站和保留政策取决于配置，未审计所有路径。适合愿意维护备份的作者先用隔离作品和非敏感数据试单章，核对正文、任务状态与成本；安装、模型输出或恢复不明时暂停并以备份和手工编辑回退。现金、人工校订和恢复时间未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/package.json#L1-L4)

固定包版本。

```text
{
  "name": "dsh-openwrite",
  "version": "0.2.29",
  "description": "OpenWrite 长篇小说领域后端接入 DeepSeek Harness：统一创作 Agent 预设 + 原生创作工作台",
```

**依据 2 · 源码核查**：[package.json:34-35](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/package.json#L34-L35)

Node 版本。

```text
  "engines": {
    "node": ">=22.19.0"
```

**依据 3 · 源码核查**：[package.json:55-70](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/package.json#L55-L70)

宿主兼容声明。

<details>
<summary>查看原文（16行）</summary>

```text
    "displayName": "小说创作（OpenWrite）",
    "pluginType": "suite",
    "compatibility": {
      "dsh": "0.1.2-rc.1 || 0.1.5-alpha.1 || 0.2.0-rc.2 || 0.2.1-rc.2 || 0.2.1-rc.3",
      "profiles": [
        "web",
        "desktop"
      ],
      "dshReleases": {
        "0.1.2-rc.1": "compatible",
        "0.1.3-alpha.1": "unknown",
        "0.1.3-alpha.2": "unknown",
        "0.1.5-alpha.1": "compatible",
        "0.2.0-rc.2": "compatible",
        "0.2.1-rc.2": "compatible",
        "0.2.1-rc.3": "compatible"
```

</details>

**依据 4 · 作者声明**：[README.md:57-61](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/README.md#L57-L61)

历史发行版本验收声明。

```text
## 快速安装

**0.2.28 标准插件包**兼容精确 dsh 版本 **0.1.2-rc.1 / 0.1.5-alpha.1 / 0.2.0-rc.2 / 0.2.1-rc.2 / 0.2.1-rc.3**。五个版本均已完成 Web 工作台渲染与 DoG 数据读取验证；三系统原生安装和 Electron 回归通过，报告者也补齐了 Windows 历史会话恢复实测。可下载版本、各平台验收结果和 SHA-256 以 [GitHub Release](https://github.com/LiPu-jpg/Openwrite/releases/latest) 附件为准；验收方法见 [发布验收](docs/RELEASE_ACCEPTANCE.md)。商城所需的精确预览版兼容性、验证范围和安装限制见 [DSH STORE 接入](docs/DSH_STORE.md)。

正式发行状态以 [npm 版本列表](https://www.npmjs.com/package/dsh-openwrite?activeTab=versions) 和 [GitHub Release](https://github.com/LiPu-jpg/Openwrite/releases/latest) 为准。以下是 0.2.28 精确版本的安装命令；发布时两处使用同一份验收产物：
```

**依据 5 · 作者声明**：[README.md:85-88](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/README.md#L85-L88)

运行时与费用声明。

````text
不要调用写作模型做安装检查，不要自动升级宿主或放宽 pnpm 构建授权。
```

首次使用会下载固定版本的 uv、Python 3.12 和锁定依赖，保存在当前 dsh 的专属目录。无需预装 Python，也无需克隆两个分支。目标平台为 macOS arm64/x64、Linux x64、Windows x64；各平台通过情况以发布验收报告为准。模型费用另计。
````

**依据 6 · 源码核查**：[packages/openwrite-bridge/src/index.ts:40-49](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/index.ts#L40-L49)

运行模式、外部地址与 timeout 配置。

<details>
<summary>查看原文（10行）</summary>

```text
export const Config: Schema<Config> = Schema.object({
  mode: Schema.union(['managed', 'external']),
  runtimeRoot: Schema.string(),
  artifacts: Schema.string(),
  pythonPath: Schema.string(),
  pythonModulePaths: Schema.array(Schema.string()),
  baseUrl: Schema.string().default('http://127.0.0.1:4567'),
  authToken: Schema.string().role('secret'),
  timeoutMs: Schema.number().default(600000),
  outputDir: Schema.string().default(join(tmpdir(), 'openwrite-exports')),
```

</details>

#### 缺口

- 未验证各宿主、模型出站、备份和真实写作
  **影响**：不能保证发布包兼容、隐私或单位任务成本
  **进一步探讨**：隔离工作区先核模型目标与文件备份，再人工验收单章。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否让作者在恢复前辨明最后真实状态及安全下一步？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

Core 已有写锁、revision、恢复前 checkpoint、drafted run 和 completed_chapters，不能把继续任务本身当新功能。未验证设想：为作者提供一次读取式恢复一致性预览，关联当前正文章节 hash、最后 checkpoint、run 的阶段与完成清单，显示冲突或未知，并在用户确认前阻止可能重复写入的恢复；预览期间任一 revision 改变必须重新读取，读取不到则显示 unknown。此设想依赖 Core 暴露可靠一致的版本证据，尚未穷尽界面是否已有等价展示，不能声称尚不存在。对照现有任务恢复和作者手动核对，在隔离作品注入模型响应后、替换前/后、run 标记前中断及并发改稿，衡量错误重试、重复模型调用、漏稿、误拦截和作者耗时；若旧状态被当最新、未知被自动覆盖、误拦截过多或无改善则否定。

#### 证据与依据

**依据 1 · 源码核查**：[release/runtime-manifest.json:1-7](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/release/runtime-manifest.json#L1-L7)

固定受检 Core 版本。

```text
{
  "schema": 1,
  "dsh": "0.1.2-rc.1",
  "uv_version": "0.11.19",
  "python_version": "3.12.13",
  "core_version": "5.8.22",
  "contract_version": 1,
```

**依据 2 · 源码核查**：[packages/openwrite-bridge/src/managed-runtime.ts:686-694](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/managed-runtime.ts#L686-L694)

服务健康和版本检查。

```text
      const connection = { baseUrl: `http://127.0.0.1:${port}`, token }
      const health = await fetch(connection.baseUrl + '/api/health', {
        headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.any([signal, AbortSignal.timeout(10_000)]),
      })
      const result = await health.json() as Record<string, unknown>
      if (!health.ok || result.core_version !== manifest.core_version || result.contract_version !== manifest.contract_version) {
        throw new Error('Writing backend version or API mismatch; reinstall OpenWrite')
      }
      this.connection = connection
```

**依据 3 · 源码核查**：[packages/openwrite-bridge/src/tool-policy.ts:36-43](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/tool-policy.ts#L36-L43)

写/读操作效果分类。

```text
/** Unknown and preview operations fail closed: previews can persist confirmation records. */
export function novelEffect(name: string, args: unknown): NovelEffect {
  if (reads.has(name)) return 'read'
  const values = args && typeof args === 'object' ? args as Record<string, unknown> : {}
  if (name === 'novel_write_chapter' && values.dry_run === true) return 'read'
  if (readActions[name]?.includes(String(values.action))) return 'read'
  if (name === 'novel_model_benchmark' && values.action === 'run') return 'generate'
  return generates.has(name) ? 'generate' : 'write'
```

**依据 4 · 源码核查**：[packages/openwrite-bridge/src/preset-tools.ts:14-20](https://github.com/LiPu-jpg/Openwrite/blob/a8b9e782a9d27c50edbea1e9beb36b8d45d47f5b/packages/openwrite-bridge/src/preset-tools.ts#L14-L20)

工具 guard 与注册。

```text
/** This row belongs in an Agent preset, never in the host bundle. */
export function apply(ctx: Context, config: { presentation?: 'native' | 'ptc' | 'both' } = {}): void {
  if (config.presentation && config.presentation !== 'native') ctx.effect(() => ctx.tools.presentAs(config.presentation!), 'openwrite: tool presentation')
  ctx.effect(() => ctx.tools.guard(execution => novelPolicyDenial(ctx, execution)), 'openwrite: execution policy')
  registerNovelTools(ctx, ctx.novelDomain.clientFactory(), {
    timeoutMs: ctx.novelDomain.toolOptions.timeoutMs,
    outputDir: ctx.novelDomain.toolOptions.outputDir ?? join(tmpdir(), 'openwrite-exports'),
```

#### 缺口

- 界面是否已有等价一致性预览尚未全面核查，且没有原型或故障实验
  **影响**：不能确认方案增量及收益
  **进一步探讨**：先追踪任务恢复 UI，再以隔离作品做故障注入对照。

[返回分类](../../views/categories/CONTENT-CREATION.md) · [返回首页](../../../README.md)
