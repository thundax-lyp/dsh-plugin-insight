# @zzerx/dsh-plugin-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 2,378](https://img.shields.io/static/v1?label=npm+30d&message=2%2C378&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)
<!-- END META -->

> **功能**：保存跨会话偏好与项目约定，结合模型提炼、作用域召回、原文审计和关系管理。

> **亮点**：连接原文、模型提炼/判定、作用域召回及图谱管理，形成跨会话辅助流程。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：目录小写、scope默认global、可变原文与宽catch多表降级，都要求明确确认/恢复契约。见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 跨会话偏好与项目记忆应交付什么？](#detail-section-11)
  - [Q02 · 域存储、模型提炼和注入怎样连接？](#detail-section-12)
  - [Q03 · 本地、项目分区与删除是不是可靠边界？](#detail-section-13)
  - [Q04 · 合并、后台超时和审计成功能说明什么？](#detail-section-14)
  - [Q05 · 采用要准备什么，成本与效果怎样算？](#detail-section-15)
  - [Q06 · 为何先观察，什么方向值得验证？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复重述偏好/项目约定的单用户；以正确复用并可纠错为交付。见[Q01](#research-q01)。

手工指引/Markdown更直接可审阅；插件增加自动形成和管理，也增加来源及多状态维护。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 手工条目/关键词检索 | 管理偏好与约定 | 子串检索，save可能判定外发 |
| 轮末提炼 | 自动形成候选 | 原文先留档，模型scope非法默认global |
| 动态提示 | 复用高重要性内容 | global/项目筛选；默认新条目3低于阈值4 |
| 原文/审计 | 检查形成过程 | 同session原文可覆盖，ok非有效产物证明 |
| 实体关系/GUI | 发现与整理关联 | 不是事实校验，多表失败需核 |
| 删除/reset | 管理遗忘 | 单删不清raw，reset分步清同scope原文，非全副本收据 |

**流程与依赖**

storageDomain及对应宿主桥必需，LLM路线决定自动链与手工判重输入去向，lib为构建交付。详表见[Q05](#research-q05)。

维护者先关闭自动链、无敏感条目核scope/来源/关系失败，再决定是否扩大；手工写入仍可能判重。步骤见[Q05](#research-q05)。

**效果与成本**

上限约束单调用/条数，不是总费用；把原文版本和多表清理核验计入一次正确复用。完整表见[Q05](#research-q05)。

可减少重复说明的机制成立，净节时、事实质量和长期证据完整性未验。保留/否定条件见[Q06](#research-q06)。

> **思考**：目录小写、scope默认global、可变原文与宽catch多表降级，都要求明确确认/恢复契约。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：连接原文、模型提炼/判定、作用域召回及图谱管理，形成跨会话辅助流程。见[Q01](#research-q01)、[Q02](#research-q02)。

分层原文/审计/关系和桥降级可借鉴；分数、确认、模型执行成功与事实正确需不同状态。见[Q02](#research-q02)、[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

目录小写、scope默认global、可变原文与宽catch多表降级，都要求明确确认/恢复契约。见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察，重要约定留指引；限定维护者无敏感独立库研究，非直接迁入长期记忆。见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持记忆流程，不能证明事实质量；默认阈值收窄即时注入风险，但来源/身份/多表恢复缺口仍妨碍长期采用。

- 已检查：作者 README、包清单、源码路径 packages/plugin-memory/README.md、packages/plugin-memory/package.json、packages/plugin-memory/src/agent/capture.ts、packages/plugin-memory/src/agent/judge.ts、packages/plugin-memory/src/agent/prompt.ts、packages/plugin-memory/src/conflicts.ts、packages/plugin-memory/src/domain.ts、packages/plugin-memory/src/index.ts、packages/plugin-memory/src/service.ts、packages/plugin-memory/src/settings.ts、packages/plugin-memory/src/types.ts 及固定范围 inventory；组件：packages/plugin-memory。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定组件入口/域/配置、存储与提炼/判定输入、范围/默认阈值、检索/动态提示、合并宽catch/多表删除和可变来源；未完整审GUI/工具参数、宿主后端或运行大库。
- 下一步：未执行目标；宿主/发布加载为范围边界，身份、来源版本、部分失败和净效果保留实质缺口。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.4.3（[固定提交 9fac17c](https://github.com/0x7A7A6572/dsh-forge-studio/tree/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

确认候选与稳定项目/版本来源、合并前提和遗忘收据，能否减少错复用及总纠错成本待验证。见[Q06](#research-q06)。

未执行目标；宿主/发布加载为范围边界，身份、来源版本、部分失败和净效果保留实质缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 1250 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 25 | 6528 | 5384 | 651 | — |
| .tsx | source | 10 | 1596 | 1436 | 107 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-29），可前往 [GitHub Issues](https://github.com/0x7A7A6572/dsh-forge-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：长期记忆如何在明确项目、来源版本、确认与删除边界内可靠复用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话偏好与项目记忆应交付什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向反复向 DSH 说明偏好、身份和项目约定的单用户。作者提供本地条目、原文、审计、实体关系和设置面板，后台模型提炼/判重，随后上下文复用。合格结果是被认可的信息在正确项目出现，错误能纠正和停止复用，来源确实支持结论；不是越聊越准或图谱更多。

手工项目指引、Markdown记忆和关键词搜索是较轻基线。插件多出轮末提炼、作用域/重要度筛选及管理入口，可能减少重复说明；本身仍要支付确认和删除成本。检索代码是子串匹配，关系图表达已存关联，不是事实校验或新向量算法。

本轮已核11个旧引用路径与旧版字节相同，但只覆盖审查材料，不能推整组件、宿主或发布包全无变化。重名冲突探测主要认工具名，不能覆盖仅提示注入的其他插件，不能当完整生态互斥。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-memory/README.md:1-20](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/README.md#L1-L20)

作者本地记忆、自动形成和双作用域定位。

<details>
<summary>查看原文（20行）</summary>

````text
# @zzerx/dsh-plugin-memory

dsh 的**记忆**插件：跨会话记住你的偏好、身份与项目决策，对话越多它越懂你。记忆只存在本地。入口是**设置面板里的一级「记忆」分区**。

![记忆面板](assets/memory-entry.png)

## 安装

```bash
dsh plugin --profile <你的 profile 名> add @zzerx/dsh-plugin-memory
```

## 能做什么

| 能力 | 说明 |
|---|---|
| **自动形成记忆** | 开关打开后，每轮对话结束时用模型提炼值得长期记住的内容（偏好、身份、项目决策、经验），自动入库；用的模型可在面板里指定（缺省跟随会话自己的模型）。 |
| **后台模型可选** | 面板「高级 · 后台模型与自动提炼」里从 dsh 已配置的模型里挑一个，专跑记忆的两条后台流程（对话提炼、写入判定）—— 例如用便宜快的小模型提炼、用强模型判定。留空 = 跟随会话默认。 |
| **全局 / 项目双作用域** | 普适的东西（语气、格式、身份、职业）进**全局**；只对某个工作区成立的进**项目**（以工作区目录为键）。 |
| **开场自动注入** | 新会话开局把「全局 + 当前工作区」的高重要性记忆注入，不必每次重新提醒。 |
````

</details>

**依据 2 · 源码核查**：[packages/plugin-memory/src/index.ts:49-70](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/index.ts#L49-L70)

存储/服务/判定/桥与设置装配。

<details>
<summary>查看原文（22行）</summary>

```text
export async function apply(ctx: Context, config: Config): Promise<void> {
  // storageDomain 已在静态 inject 声明，apply 时已就绪，无需再包一层 ctx.inject。
  const domain = await ctx.storageDomain.open(memoryDomain)
  try {
    // 域由本 fiber 负责 close。
    ctx.effect(() => () => { void domain.close() })
    const settings = installMemorySettings(ctx, config)
    // 用 new（而非 ctx.plugin）：把 memory 服务 provide 在本 apply 的 fiber 上，
    // 后续 ctx.inject(['tools'], ...) 子 fiber 才能沿祖先链读到 ctx.memory。
    const service = new MemoryService(ctx, {
      domain,
      settings,
      knownWorkspaces: () => readKnownWorkspaces(ctx),
    })
    // 写入判定（方案 C）：路由与 llm 都在调用时才取，所以这里装配不影响启动顺序。
    // 后台模型走面板配置（设置里的 llmProvider / llmModel，空 = 跟随默认）。
    service.setJudge(createMemoryJudge(ctx, { route: () => configuredRoute(settings.get()) }))
    // 面板「后台模型」下拉的候选：dsh 已配置且可路由的模型目录（读取失败退化成空目录）。
    service.setModelCatalog(() => listModelGroups(ctx))
    installMemoryAgentBridgeWhenReady(ctx, service, settings)
    // 本插件自带设置页面（settings.section），关掉宿主按 schema 自建页面的策略。
    configureMemorySettingsPage(ctx)
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:493-512](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L493-L512)

关键词子串检索。

<details>
<summary>查看原文（20行）</summary>

```text
  async list(query: MemoryQuery): Promise<MemoryRecord[]> {
    const keyword = query.keyword?.trim().toLowerCase()
    const pathKey = query.projectPath !== undefined ? normalizeProjectKey(query.projectPath) : undefined
    const out = this.collect().filter((record) => {
      if (query.includeArchived !== true && record.archived) return false
      if (query.scope !== undefined && record.scope !== query.scope) return false
      if (query.kind !== undefined && record.kind !== query.kind) return false
      if (pathKey !== undefined) {
        if (record.scope !== 'project') return false
        if (normalizeProjectKey(record.projectPath) !== pathKey) return false
      }
      if (keyword !== undefined && keyword !== '') {
        const hay = (record.title + '\n' + record.summary + '\n' + record.content
          + '\n' + record.aliases.join(' ') + '\n' + record.tags.join(' ')).toLowerCase()
        if (!hay.includes(keyword)) return false
      }
      return true
    })
    out.sort(compareMemories)
    return query.limit !== undefined && query.limit > 0 ? out.slice(0, query.limit) : out
```

</details>

**依据 4 · 源码核查**：[packages/plugin-memory/src/conflicts.ts:1-12](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/conflicts.ts#L1-L12)

工具名冲突探测边界。

<details>
<summary>查看原文（12行）</summary>

```text
/**
 * 与其它记忆插件的冲突探测。
 *
 * 为什么必须有：tools 服务在同一层重名注册会**直接抛错**。装了 mneme 之后再装本
 * 插件，7 个 memory_* 里有 6 个重名，第一个 register 就会抛，整条 tools 桥被打崩，
 * 用户只看到「工具莫名其妙没了」。所以注册前先探测、跳过、上报。
 *
 * 能力边界（诚实说明）：
 * - 能探测**重名工具**——两个记忆插件都要给模型 memory_save 时，这是唯一会真正
 *   打架的地方，也是 100% 可靠的信号。
 * - 探测不到「只注入提示词、不注册工具」的记忆插件，也探测不到别人的面板分区
 *   （settings.section 是纯 client 侧注册，host 看不到）。
```

</details>

#### 缺口

- 缺真实跨会话复述、错召回与纠错任务对照。
  **影响**：不能把自动形成和图谱推成更懂用户或净节时。
  **进一步探讨**：对照手工指引，测正确复用、错误复用、修正与总人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 域存储、模型提炼和注入怎样连接？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

入口硬依赖storageDomain，打开memory域并提供MemoryService。域分memories、raw_documents、audits、entities、edges；具体存储耐久/权限依宿主实现，本轮未审宿主域后端。tools和systemPrompt分别晚就绪挂桥，缺桥会降级，不等全部能力可用。

轮末根据autoCapture、频率和同session inFlight门禁提炼最近有限对话。流程先归档转录，即使拿不到模型路由也可能已有原文；之后LLM stream接收转录，解析候选再逐条service.save，链接原文并记录调用审计。后台提炼与判重沿同一对provider/model配置，不能从README例子推成两个流程可分别独立选模型。

注入是systemPrompt.context的动态callback，根据global或归一项目路径相等、未归档、置顶/重要度筛选排序后取上限，不是只监听新会话。render说明当前指令优先并转义模板变量，但这不是对记忆内容的事实或指令安全证明。关闭autoInject只关动态条目，静态使用指南仍注册。

默认autoCapture/autoInject均开，但默认捕获条目importance=3、注入阈值4。因此新提炼条目不会仅因刚保存便默认注入；检索仍可找到，置顶/提高重要度、合并已有高重要度或改阈值后才可能进入动态提示。这个差别既限制即时错误放大，也要求用户理解“已形成”与“已使用”两种状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/index.ts:25-28](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/index.ts#L25-L28)

storageDomain硬依赖。

```text
export const name = '@zzerx/dsh-plugin-memory'
export const inject = ['storageDomain']
/** 插件配置 schema（settings 分区的命名空间就是本条目 id，见 settings.ts）。 */
export { Config } from './settings.ts'
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/domain.ts:114-129](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/domain.ts#L114-L129)

五表域布局。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * memory 域：memories（记忆条目）+ raw_documents（原文留档）+ audits（模型调用审计）
 * + entities（实体）+ edges（边）。后两张是 wiki 图层，同域新增表不动已存记录。
 */
export const memoryDomain = defineDomain({
  name: 'memory',
  version: 1,
  layout: 'per-record',
  tables: {
    memories: domainTable<MemoryId, MemoryRecord>(memoryRecordSchema),
    raw_documents: domainTable<MemoryRawId, MemoryRawDocument>(rawDocumentSchema),
    audits: domainTable<string, MemoryAuditEntry>(auditEntrySchema),
    entities: domainTable<MemoryEntityId, MemoryEntity>(memoryEntitySchema),
    edges: domainTable<string, MemoryEdge>(memoryEdgeSchema),
  },
})
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/src/index.ts:81-112](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/index.ts#L81-L112)

各桥降级和卸载事件监听。

<details>
<summary>查看原文（32行）</summary>

```text
export function installMemoryAgentBridgeWhenReady(
  ctx: Context,
  service: MemoryService,
  settings: ReturnType<typeof installMemorySettings>,
): void {
  void ctx.inject(['tools'], (toolsCtx) => {
    try {
      installMemoryTools(toolsCtx, {
        onConflicts: (conflicts) => {
          service.setConflicts(conflicts)
          if (conflicts.length === 0) return
          toolsCtx.logger.warn('[plugin-memory] ' + describeConflicts(conflicts))
        },
      })
    } catch (error) {
      toolsCtx.logger.error('[plugin-memory] agent tools install failed — memory_* unavailable to sessions:', error)
    }
  })
  void ctx.inject(['systemPrompt'], (promptCtx) => {
    try {
      installMemoryPrompt(promptCtx, service, settings)
    } catch (error) {
      promptCtx.logger.warn('[plugin-memory] prompt injection disabled:', error)
    }
  })
  // 自动提炼不依赖 ctx.llm 的就绪时机（调用时才取），但整体包一层保险。
  try {
    const dispose = installMemoryCapture(ctx, service, settings)
    ctx.effect(() => () => { dispose() })
  } catch (error) {
    ctx.logger.warn('[plugin-memory] conversation capture disabled:', error)
  }
```

</details>

**依据 4 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:449-476](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L449-L476)

轮末频率、锁及inFlight门禁。

<details>
<summary>查看原文（28行）</summary>

```text
export function installMemoryCapture(
  ctx: Context,
  service: MemoryService,
  settings: MemorySettingsAccess,
): () => void {
  const inFlight = new Set<string>()
  const disposer = ctx.on('session/event', (session: unknown, event: unknown) => {
    try {
      const record = asRecord(event)
      if (record?.type !== 'turn/end') return
      const config = settings.get()
      if (!config.autoCapture) return
      if (service.isLocked()) return
      const turnValue = asRecord(record.data)?.turn
      const turn = typeof turnValue === 'number' ? turnValue : undefined
      if (!shouldCaptureNow(turn, config.captureEveryTurns)) return
      const id = (session as { id?: unknown } | undefined)?.id
      if (typeof id !== 'string' || id === '' || inFlight.has(id)) return
      inFlight.add(id)
      const route = configuredRoute(config)
      void captureOne(ctx, service, session, {
        maxTurns: config.captureMaxTurns,
        maxChars: config.captureMaxChars,
        includeAssistant: config.captureIncludeAssistant,
        ...(route !== undefined ? { route } : {}),
      })
        .catch((error: unknown) => { ctx.logger?.warn?.('[plugin-memory] capture failed: ' + String(error)) })
        .finally(() => { inFlight.delete(id) })
```

</details>

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:289-326](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L289-L326)

原文先存、无路由审计失败。

<details>
<summary>查看原文（38行）</summary>

```text
  let rawId: MemoryRawId | undefined
  try {
    const raw = await service.storeRawDocument({
      text: transcript,
      origin: 'capture',
      scope: cwd === undefined ? 'global' : 'project',
      ...(cwd !== undefined ? { projectPath: cwd } : {}),
      ...(sessionId !== undefined ? { sessionId } : {}),
      note: 'turn/end 对话转录',
    })
    rawId = raw.id
  } catch (error) {
    ctx.logger?.warn?.('[plugin-memory] capture archive skipped: ' + errorText(error))
  }

  const route = resolveRoute(ctx, session, options.route)
  const llm = serviceOf<{ stream?: (options: unknown) => AsyncIterable<unknown> }>(ctx, 'llm')
  if (route === undefined || llm?.stream === undefined) {
    const reason = route === undefined ? '拿不到模型路由，本次未提炼' : 'llm 服务不可用，本次未提炼'
    ctx.logger?.warn?.('[plugin-memory] capture skipped: ' + reason)
    try {
      await service.recordAudit({
        kind: 'capture',
        provider: route?.provider ?? 'unknown',
        model: route?.model ?? 'unknown',
        ok: false,
        durationMs: 0,
        inputChars: transcript.length,
        outputChars: 0,
        recordIds: [],
        ...(rawId !== undefined ? { rawId } : {}),
        ...(sessionId !== undefined ? { sessionId } : {}),
        error: reason,
      })
    } catch (error) {
      ctx.logger?.warn?.('[plugin-memory] capture audit skipped: ' + errorText(error))
    }
    return
```

</details>

**依据 6 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:394-407](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L394-L407)

保存模型scope候选，默认importance3。

<details>
<summary>查看原文（14行）</summary>

```text
  for (const item of items) {
    if (item.scope === 'project' && cwd === undefined) continue
    try {
      const saved = await service.save({
        title: item.title,
        content: item.content,
        kind: item.kind,
        scope: item.scope,
        ...(item.scope === 'project' && cwd !== undefined ? { projectPath: cwd } : {}),
        importance: 3,
        source: 'capture',
        ...(sessionId !== undefined ? { sessionId } : {}),
      })
      recordIds.push(saved.id)
```

</details>

**依据 7 · 源码核查**：[packages/plugin-memory/src/types.ts:479-489](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/types.ts#L479-L489)

开关、重要度阈值4和同一模型配置默认。

<details>
<summary>查看原文（11行）</summary>

```text
export const MEMORY_CONFIG_BASE: MemoryConfig = {
  autoCapture: true,
  autoInject: true,
  maxInjected: 6,
  importanceThreshold: 4,
  captureEveryTurns: 3,
  captureMaxTurns: 4,
  captureMaxChars: 4000,
  captureIncludeAssistant: false,
  llmProvider: '',
  llmModel: '',
```

</details>

**依据 8 · 源码核查**：[packages/plugin-memory/src/service.ts:679-691](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L679-L691)

作用域/重要性筛选。

<details>
<summary>查看原文（13行）</summary>

```text
  injectCandidates(sessionCwd: string | undefined, options: { maxItems: number; threshold: number }): MemoryRecord[] {
    // 被锁时一条都不注入。
    if (this.isLocked()) return []
    const cwdKey = sessionCwd === undefined ? undefined : normalizeProjectKey(sessionCwd)
    const live = this.collect().filter((record) => !record.archived)
    const scoped = live.filter((record) => {
      if (record.scope === 'global') return true
      if (cwdKey === undefined) return false
      return normalizeProjectKey(record.projectPath) === cwdKey
    })
    const eligible = scoped.filter((record) => record.pinned || record.importance >= options.threshold)
    eligible.sort(compareMemories)
    return eligible.slice(0, Math.max(1, options.maxItems))
```

</details>

**依据 9 · 源码核查**：[packages/plugin-memory/src/agent/prompt.ts:70-83](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/prompt.ts#L70-L83)

背景说明和转义。

<details>
<summary>查看原文（14行）</summary>

```text
/** 渲染注入块；无候选返回空串（不占用提示词预算）。 */
export function renderMemoryBlock(records: readonly MemoryRecord[], sessionCwd: string | undefined): string {
  if (records.length === 0) return ''
  const lines = ['[记忆] 来自 plugin-memory 的本地记忆库（跨会话）。它是背景信息，若与用户当前指令冲突，以当前指令为准：']
  for (const record of records) {
    const where = record.scope === 'global' ? '全局' : '项目:' + projectLabelOf(record.projectPath)
    const label = MEMORY_KIND_LABELS[record.kind]
    lines.push('- [' + label + ' | ' + where + ' | ' + importanceLabel(record.importance) + '] ' + record.title + '：'
      + record.content.replace(/\n/g, '\n  '))
  }
  if (sessionCwd !== undefined && sessionCwd.trim() !== '') {
    lines.push('当前工作区：' + sessionCwd.trim() + '（scope=project 的记忆默认记到这里）')
  }
  return escapePromptVars(lines.join('\n'))
```

</details>

**依据 10 · 源码核查**：[packages/plugin-memory/src/agent/prompt.ts:98-120](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/prompt.ts#L98-L120)

静态指南与动态上下文分开注册。

<details>
<summary>查看原文（23行）</summary>

```text
export function installMemoryPrompt(ctx: Context, service: MemoryService, settings: MemorySettingsAccess): void {
  ctx.systemPrompt.section({
    name: MEMORY_USAGE_SECTION,
    order: 2940,
    text: MEMORY_USAGE_TEXT,
  })
  ctx.systemPrompt.context({
    name: MEMORY_RECALL_CONTEXT,
    order: 95,
    text: (renderCtx: unknown) => {
      try {
        const config = settings.get()
        if (!config.autoInject) return ''
        const cwd = sessionCwdOf(renderCtx)
        const records = service.injectCandidates(cwd, {
          maxItems: config.maxInjected,
          threshold: config.importanceThreshold,
        })
        return renderMemoryBlock(records, cwd)
      } catch {
        return ''
      }
    },
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地、项目分区与删除是不是可靠边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

README的本地描述只支持存储位置，不能解释为提炼/判重离线。capture把原始转录作为LLM输入，judge把新内容和候选发送配置模型；若路由远程，内容会交给对应服务。提示不记密钥不等发送前脱敏；关autoCapture也不等手工save完全无模型调用，因为近邻判定仍可能走judge。

项目key无条件转小写并调整分隔，区分大小写文件系统中的不同目录可能合并；别名/重命名又可能拆分。它是选择键，不是多用户授权。parseCapturedItems把非project scope都转global，未经用户确认的错误归属会扩大检索范围；默认importance3低于阈值4，不应再推断所有此类错误立即自动注入。

单条removeMemory只删条目和相关边，不同时清raw正文或audit引用。reset另有同作用域raw删除，不能笼统说任何删除都不清原文；它也不是跨表原子操作或完整审计清除。需要遗忘时分别核memory/raw/audit/关系，不能把返回true当全副本遗忘收据。

原文也不是不可变证据：相同session的capture覆盖已有raw.text，markExtracted却累计recordIds。较早记忆仍可关联到已换成最近窗口的同一rawId，当前原文不一定仍含早期推导依据。这是源码结构推断，不是已复现来源丢失；如需可追溯应保留版本化源件。

#### 证据与依据

**依据 1 · 作者声明**：[packages/plugin-memory/README.md:1-3](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/README.md#L1-L3)

作者本地存储表述。

```text
# @zzerx/dsh-plugin-memory

dsh 的**记忆**插件：跨会话记住你的偏好、身份与项目决策，对话越多它越懂你。记忆只存在本地。入口是**设置面板里的一级「记忆」分区**。
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:350-364](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L350-L364)

原始转录交配置模型。

<details>
<summary>查看原文（15行）</summary>

```text
    const stream = llm.stream({
      provider: route.provider,
      model: route.model,
      // 自定义 purpose 越界（封闭联合），提示词只能走 system 槽。
      system: systemText,
      maxTokens: 2048,
      signal: controller.signal,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: transcript }],
          source: { kind: 'plugin', plugin: '@zzerx/dsh-plugin-memory' },
        },
      ],
    })
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/src/agent/judge.ts:134-157](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/judge.ts#L134-L157)

判定payload交模型。

<details>
<summary>查看原文（24行）</summary>

```text
    const route = resolveRoute(ctx, undefined, preferred)
    const llm = serviceOf<{ stream?: (options: unknown) => AsyncIterable<unknown> }>(ctx, 'llm')
    if (route === undefined || llm?.stream === undefined) return undefined
    const payload = renderJudgeInput(request)
    const controller = new AbortController()
    const started = Date.now()
    let text = ''
    let failure: string | undefined
    let tokensIn: number | undefined
    let tokensOut: number | undefined
    const run = (async (): Promise<MemoryJudgeVerdict> => {
      try {
        const stream = llm.stream!({
          provider: route.provider,
          model: route.model,
          system: JUDGE_PROMPT,
          maxTokens: JUDGE_MAX_TOKENS,
          signal: controller.signal,
          messages: [
            {
              role: 'user',
              content: [{ type: 'text', text: payload }],
              source: { kind: 'plugin', plugin: '@zzerx/dsh-plugin-memory' },
            },
```

</details>

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:47-48](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L47-L48)

项目key无条件小写。

```text
export function normalizeProjectKey(path: string): string {
  return path.trim().replace(/[\\/]+$/, '').replace(/\\/g, '/').toLowerCase()
```

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:190-196](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L190-L196)

非法/非project scope默认global。

```text
    if (isStatusSnapshot(content)) {
      dropped.push({ title, reason: 'status-snapshot' })
      continue
    }
    const kind = MEMORY_KINDS.includes(record.kind as MemoryKind) ? (record.kind as MemoryKind) : 'fact'
    const scope: MemoryScope = record.scope === 'project' ? 'project' : 'global'
    items.push({ title, content, kind, scope })
```

**依据 6 · 源码核查**：[packages/plugin-memory/src/service.ts:1454-1479](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1454-L1479)

单删与reset的不同清理路径。

<details>
<summary>查看原文（26行）</summary>

```text
  async removeMemory(id: MemoryId): Promise<boolean> {
    const current = await this.memories.get(id)
    if (current === undefined) return false
    await this.memories.delete(id)
    await this.removeEdgesFor({ kind: 'memory', id })
    return true
  }

  async reset(scope: MemoryScope, projectPath?: string): Promise<number> {
    const pathKey = normalizeProjectKey(projectPath ?? '')
    const targets = this.collect().filter((record) => {
      if (record.scope !== scope) return false
      if (scope === 'global') return true
      return normalizeProjectKey(record.projectPath) === pathKey
    })
    for (const record of targets) {
      await this.memories.delete(record.id)
      await this.removeEdgesFor({ kind: 'memory', id: record.id })
    }
    // 同作用域的留档一起清，否则留下孤儿原文。
    for (const doc of this.collectRaw()) {
      if (doc.scope !== scope) continue
      if (scope === 'project' && normalizeProjectKey(doc.projectPath) !== pathKey) continue
      await this.rawDocs.delete(doc.id)
    }
    return targets.length
```

</details>

**依据 7 · 源码核查**：[packages/plugin-memory/src/service.ts:785-799](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L785-L799)

同session覆盖raw正文。

<details>
<summary>查看原文（15行）</summary>

```text
    // 转录按会话归并，后一轮覆盖前一轮（转录本身是累积的）。
    if (input.origin === 'capture' && input.sessionId !== undefined) {
      const existing = this.collectRaw().find((doc) =>
        doc.origin === 'capture' && doc.sessionId === input.sessionId)
      if (existing !== undefined) {
        const merged: MemoryRawDocument = {
          ...existing,
          title,
          text: input.text,
          textLength: input.text.length,
          updatedAt: now,
          ...(input.note !== undefined ? { note: input.note } : {}),
        }
        await this.rawDocs.put(merged.id, merged)
        return merged
```

</details>

**依据 8 · 源码核查**：[packages/plugin-memory/src/service.ts:820-827](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L820-L827)

同rawId累计关联recordIds。

```text
  async markExtracted(rawId: MemoryRawId, recordIds: readonly string[]): Promise<MemoryRawDocument | undefined> {
    const current = await this.rawDocs.get(rawId)
    if (current === undefined) return undefined
    const merged = [...current.recordIds]
    for (const id of recordIds) if (!merged.includes(id)) merged.push(id)
    const next: MemoryRawDocument = { ...current, recordIds: merged, extractedAt: Date.now() }
    await this.rawDocs.put(next.id, next)
    return next
```

#### 缺口

- 跨目录错召回、原文覆盖后的来源完整性和删除半失败缺运行验证。
  **影响**：不能保证严格项目隔离、稳定证据链或全副本遗忘。
  **进一步探讨**：无敏感库构造大小写目录、跨轮窗口、单删/reset半失败，核全部记录/关联及后续召回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 合并、后台超时和审计成功能说明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

save先同scope/kind的title/alias合并，再重合度，近邻才可送模型judge。正文合并长度上限320，标题/重合路径超限直接抛；judge-update分支的catch覆盖mergeRecord、attachEntities和syncAutoEdges全部await，任意异常都会继续后面的新建路径，不只注释写的“合并撞上限”。若旧记录已put而关系步骤失败，可能再建一条，不能把降级简单描述成安全去重或只处理超长。

候选读取后有模型/存储await，服务未展示版本比较或互斥；同题并发重复/后写覆盖仍需实测。条目写、实体连接、自动边同步和删除是分步操作，单表耐久不证明跨表事务。判定失败退新建有保留输入的意图，也可能增加清重和部分恢复成本。

capture非法JSON返回空items却不设置failure；audit.ok取failure是否为空，所以ok=true可能零产物。零产物本来也可合法，必须连recordIds/output和解析情况看，不当提炼准确率或有效记忆数量。60秒timer只发abort，流若不响应可能仍不结束；卸载处仅解除监听，不证明取消已有capture。上述是源码边界，未复现并发或模型挂起。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/service.ts:1272-1298](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1272-L1298)

合并上限在put前检查。

<details>
<summary>查看原文（27行）</summary>

```text
  private async mergeRecord(
    existing: MemoryRecord,
    incoming: {
      title?: string
      content: string
      summary?: string
      aliases?: readonly string[]
      importance?: number
      tags?: readonly string[]
      pinned?: boolean
    },
  ): Promise<MemoryRecord> {
    const mergedContent = mergeContent(existing.content, incoming.content)
    assertContentWithinLimit(mergedContent)
    const merged: MemoryRecord = {
      ...existing,
      content: mergedContent,
      summary: existing.summary !== '' ? existing.summary : (incoming.summary?.trim() ?? ''),
      aliases: mergeAliases(existing, incoming.title, incoming.aliases),
      importance: Math.max(existing.importance, clampImportance(incoming.importance)),
      tags: normalizeTags([...existing.tags, ...(incoming.tags ?? [])]),
      pinned: incoming.pinned ?? existing.pinned,
      archived: false,
      updatedAt: Date.now(),
    }
    await this.memories.put(merged.id, merged)
    return merged
```

</details>

**依据 2 · 源码核查**：[packages/plugin-memory/src/service.ts:1301-1368](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1301-L1368)

标题/重合/judge分支与宽catch。

<details>
<summary>查看原文（68行）</summary>

```text
  async saveWithOutcome(input: MemorySaveInput): Promise<MemorySaveOutcome> {
    const title = input.title.trim()
    if (title === '') throw new Error('memory title is required')
    const content = input.content.trim()
    if (content === '') throw new Error('memory content is required')
    const scope: MemoryScope = input.scope ?? 'global'
    const projectPath = scope === 'project' ? (input.projectPath ?? '').trim() : ''
    if (scope === 'project' && projectPath === '') {
      throw new Error('project-scoped memory requires a project path (workspace directory)')
    }
    const kind: MemoryKind = input.kind ?? 'fact'
    assertContentWithinLimit(content)
    const summary = input.summary?.trim() ?? ''
    const mergeInput = {
      title,
      content,
      ...(summary !== '' ? { summary } : {}),
      ...(input.aliases !== undefined ? { aliases: input.aliases } : {}),
      ...(input.importance !== undefined ? { importance: input.importance } : {}),
      ...(input.tags !== undefined ? { tags: input.tags } : {}),
      ...(input.pinned !== undefined ? { pinned: input.pinned } : {}),
    }
    const existing = this.findByTitle(title, scope, projectPath, kind)
    if (existing !== undefined) {
      const record = await this.mergeRecord(existing, mergeInput)
      await this.attachEntities(record, input.entities)
      await this.syncAutoEdges()
      return { record, created: false, mergedBy: 'title' }
    }
    const overlapped = this.findOverlap({ title, content }, scope, projectPath)
    if (overlapped !== undefined) {
      const record = await this.mergeRecord(overlapped, mergeInput)
      await this.attachEntities(record, input.entities)
      await this.syncAutoEdges()
      return { record, created: false, mergedBy: 'overlap' }
    }
    const near = this.findNearest({ title, content }, scope, projectPath, MEMORY_JUDGE_FLOOR)
    let judged: MemorySaveOutcome['judged']
    // source=import 不判定：批量导入会放大调用次数。
    const judgeAllowed = (input.source ?? 'agent') !== 'import'
    if (judgeAllowed && near !== undefined && this.judgeReady()) {
      const verdict = await this.runJudge({
        title, content, summary, scope, projectPath, candidates: near.candidates,
      })
      if (verdict !== undefined) {
        judged = {
          decision: verdict.decision,
          ...(verdict.targetId !== undefined ? { targetId: verdict.targetId } : {}),
          ...(verdict.reason !== undefined ? { reason: verdict.reason } : {}),
        }
        await this.recordJudgeAudit(verdict, input.sessionId)
        const target = verdict.targetId !== undefined
          ? this.findInScope(verdict.targetId, scope, projectPath)
          : undefined
        if (verdict.decision === 'update' && target !== undefined) {
          try {
            const record = await this.mergeRecord(target, mergeInput)
            await this.attachEntities(record, input.entities)
            await this.syncAutoEdges()
            return { record, created: false, mergedBy: 'judge', judged }
          } catch {
            // 合并撞上限就退化成新建，不丢掉这次写入。
          }
        }
        if (verdict.decision === 'skip' && target !== undefined) {
          // 不写入，record 回已有那条。
          return { record: target, created: false, mergedBy: 'judge', skipped: true, judged }
        }
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:1371-1404](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1371-L1404)

catch后继续新建及分步关系写。

<details>
<summary>查看原文（34行）</summary>

```text
    // 判定成功即以判定结论为准，不再提示疑似。
    const suspect: MemorySuspect | undefined = judged === undefined
      && near !== undefined && near.score >= MEMORY_NEAR_FLOOR
      ? { id: near.record.id, title: near.record.title, score: near.score }
      : undefined
    const now = Date.now()
    const record: MemoryRecord = {
      id: brandString<MemoryId>(randomUUID()),
      kind,
      scope,
      projectPath,
      title,
      content,
      summary,
      aliases: mergeAliases({ title, aliases: [] }, undefined, input.aliases),
      importance: clampImportance(input.importance),
      tags: normalizeTags(input.tags),
      pinned: input.pinned ?? false,
      archived: false,
      createdAt: now,
      updatedAt: now,
      source: input.source ?? 'agent',
      ...(input.sessionId !== undefined ? { sessionId: input.sessionId } : {}),
    }
    await this.memories.put(record.id, record)
    // 先挂显式实体再重算自动边，共现边才算得上这条。
    await this.attachEntities(record, input.entities)
    await this.syncAutoEdges()
    // 判定跑过就带回结论，调用方能区分「模型看过」与「附近没有像的」。
    return {
      record,
      created: true,
      ...(judged !== undefined ? { judged } : {}),
      ...(suspect !== undefined ? { suspect } : {}),
```

</details>

**依据 4 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:157-168](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L157-L168)

非法JSON空items。

<details>
<summary>查看原文（12行）</summary>

```text
export function parseCapturedItems(text: string): CaptureParseResult {
  const trimmed = text.trim()
  if (trimmed === '') return { items: [], dropped: [] }
  const start = trimmed.indexOf('[')
  const end = trimmed.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return { items: [], dropped: [] }
  let parsed: unknown
  try {
    parsed = JSON.parse(trimmed.slice(start, end + 1))
  } catch {
    return { items: [], dropped: [] }
  }
```

</details>

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:342-385](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L342-L385)

abort计时、流及解析分支。

<details>
<summary>查看原文（44行）</summary>

```text
  const startedAt = Date.now()
  const controller = new AbortController()
  const timer = setTimeout(() => { controller.abort() }, 60_000)
  let text = ''
  let failure: string | undefined
  let tokensIn: number | undefined
  let tokensOut: number | undefined
  try {
    const stream = llm.stream({
      provider: route.provider,
      model: route.model,
      // 自定义 purpose 越界（封闭联合），提示词只能走 system 槽。
      system: systemText,
      maxTokens: 2048,
      signal: controller.signal,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: transcript }],
          source: { kind: 'plugin', plugin: '@zzerx/dsh-plugin-memory' },
        },
      ],
    })
    for await (const raw of stream) {
      const chunk = asRecord(raw)
      if (chunk === undefined) continue
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') text += chunk.text
      const usage = readUsage(chunk)
      if (usage.inputTokens !== undefined) tokensIn = usage.inputTokens
      if (usage.outputTokens !== undefined) tokensOut = usage.outputTokens
      if (chunk.type === 'finish') {
        const reason = asRecord(chunk.reason)
        const kind = reason?.kind ?? chunk.kind
        if (kind === 'error' || kind === 'aborted') failure = 'stream ' + String(kind)
      }
    }
  } catch (error) {
    failure = errorText(error)
  } finally {
    clearTimeout(timer)
  }

  const parsed: CaptureParseResult = failure === undefined
    ? parseCapturedItems(text)
```

</details>

**依据 6 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:420-435](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L420-L435)

审计ok与failure关系。

<details>
<summary>查看原文（16行）</summary>

```text
  try {
    await service.recordAudit({
      kind: 'capture',
      provider: route.provider,
      model: route.model,
      ok: failure === undefined,
      durationMs: Date.now() - startedAt,
      inputChars: transcript.length,
      outputChars: text.length,
      ...(tokensIn !== undefined ? { tokensIn } : {}),
      ...(tokensOut !== undefined ? { tokensOut } : {}),
      recordIds,
      ...(rawId !== undefined ? { rawId } : {}),
      ...(sessionId !== undefined ? { sessionId } : {}),
      ...(failure !== undefined ? { error: failure } : {}),
      ...(dropped.length > 0 ? { dropped } : {}),
```

</details>

**依据 7 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:449-482](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L449-L482)

inFlight与仅返回监听disposer。

<details>
<summary>查看原文（34行）</summary>

```text
export function installMemoryCapture(
  ctx: Context,
  service: MemoryService,
  settings: MemorySettingsAccess,
): () => void {
  const inFlight = new Set<string>()
  const disposer = ctx.on('session/event', (session: unknown, event: unknown) => {
    try {
      const record = asRecord(event)
      if (record?.type !== 'turn/end') return
      const config = settings.get()
      if (!config.autoCapture) return
      if (service.isLocked()) return
      const turnValue = asRecord(record.data)?.turn
      const turn = typeof turnValue === 'number' ? turnValue : undefined
      if (!shouldCaptureNow(turn, config.captureEveryTurns)) return
      const id = (session as { id?: unknown } | undefined)?.id
      if (typeof id !== 'string' || id === '' || inFlight.has(id)) return
      inFlight.add(id)
      const route = configuredRoute(config)
      void captureOne(ctx, service, session, {
        maxTurns: config.captureMaxTurns,
        maxChars: config.captureMaxChars,
        includeAssistant: config.captureIncludeAssistant,
        ...(route !== undefined ? { route } : {}),
      })
        .catch((error: unknown) => { ctx.logger?.warn?.('[plugin-memory] capture failed: ' + String(error)) })
        .finally(() => { inFlight.delete(id) })
    } catch (error) {
      ctx.logger?.warn?.('[plugin-memory] capture hook failed: ' + String(error))
    }
  })
  return disposer
}
```

</details>

#### 缺口

- 合并并发、关系写入失败降级和不响应abort的模型行为未复现。
  **影响**：不能量化重复、部分状态或后台悬挂概率。
  **进一步探讨**：隔离存储注入关系失败/交错save/忽略abort流，核旧条目、新条目、关系、审计及退出。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用要准备什么，成本与效果怎样算？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

#### 条件

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| storageDomain和匹配宿主包 | 核心必需 | 多表存储与服务 | 打不开域无法启动，后端耐久/权限另核 |
| tools/systemPrompt/settings/Typert客户端 | 对应入口必需 | 模型管理工具、上下文和GUI | 分别挂桥，不能以面板可见推全链可用 |
| 已配置LLM路由 | 提炼/判定必需 | 后台自动形成与近邻判定 | 原文可能先存；远程路线会披露输入 |
| 可备份独立无敏感库 | 当前研究试验必需 | 验证scope、合并、删除 | 重要约定仍留可审阅指引 |
| 构建产物或已核发布包 | 加载必需 | package指向lib入口 | 当前checkout无lib，不把源码目录当可直接安装制品 |

组件0.4.3、MIT，peer范围按package声明；源码main为lib/index.js，build/prepublish调用scripts/build.mjs。本轮没有构建、安装、加载或核发布字节；缺lib是交付形态边界，不是源码不可研究。

#### 步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 维护者独立profile备份域数据，关autoCapture/autoInject | 核路由和权限，手工save也可能判重外发 |
| 手工 | 写无敏感global/project反例并检索 | 核实际项目key与冲突，重要约定留Markdown |
| 来源 | 做两轮不同窗口并看raw/recordIds | 识别原文覆盖，不把rawId当不可变原件 |
| 故障 | 临时库测试同题合并、单删/reset及关系半失败 | 全表核对，失败先留现场，不循环重试掩盖重复 |
| 扩展 | 仅在前项可解释后观察提炼/注入 | 分清importance3与阈值4，审计ok不代表有效产物 |
| 退出 | 停捕获/注入并核原文/审计残留 | 回手工指引；需要遗忘另做全表清理核验 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 构建/宿主、域存储、模型路线 | 核scope/隐私/工具冲突 | 兼容、工时和金额未测 |
| 持续使用 | 额外提炼/判定请求、上下文、原文/图谱IO | 审核、改scope、纠错去重 | 提炼2048、判定256输出上限不是总token/费用预算 |
| 失败恢复 | 多表备份、重复/部分写修复 | 查宽catch、关系、audit/raw及后台流 | raw200/audit500是条数上限，不是字节/恢复保证 |
| 升级退出 | 存储与原件版本备份 | 全副本核验、迁移/清理 | 单删与reset不同，不推完整遗忘 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 减少重复说明 | scope/重要度动态召回 | 约定仍正确、总节时和错误复用率 |
| 自动形成 | 轮末模型提炼/判定与审计 | 语义质量、成本和错误global频率 |
| 回看来源 | raw与recordIds可关联 | 同session覆盖后是否仍支持早期记忆 |
| 管理与清理 | 条目/原文/审计/关系分层 | 并发一致性、全副本遗忘和恢复工时 |

单位应是一次正确复用的约定及全部复核/纠错，不是一次模型成功或条目数量。当前不能给ROI、免费记忆或更懂用户的验证结论。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/package.json:2-4](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/package.json#L2-L4)

组件版本。

```text
  "name": "@zzerx/dsh-plugin-memory",
  "version": "0.4.3",
  "description": "dsh 记忆与进化插件：跨会话记住你的偏好与项目习惯（全局 / 项目双作用域），自动注入、自动整理，设置面板一级「记忆」分区可视化管理。",
```

**依据 2 · 源码核查**：[packages/plugin-memory/package.json:18-34](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/package.json#L18-L34)

许可及lib主/客户端入口。

<details>
<summary>查看原文（17行）</summary>

```text
  "license": "MIT",
  "author": "0x7A7A",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/0x7A7A6572/dsh-forge-studio.git",
    "directory": "packages/plugin-memory"
  },
  "type": "module",
  "main": "./lib/index.js",
  "types": "./lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/package.json:47-65](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/package.json#L47-L65)

构建命令与peer范围。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "prepublishOnly": "node scripts/build.mjs",
    "build": "node scripts/build.mjs",
    "push:npm": "npm publish --registry=https://registry.npmjs.org",
    "typecheck": "tsc -p tsconfig.json --noEmit"
  },
  "publishConfig": {
    "access": "public"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.4",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.5",
    "@deepseek-ai/dsh-brand": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-storage-domain": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-system-prompt": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-tools": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/dsh-typert-protocol": ">=0.1.7-alpha.0 <0.3.0-0",
    "@deepseek-ai/schemastery": "^3.18.4"
```

</details>

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:29-41](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L29-L41)

条数、正文与相似度限制。

<details>
<summary>查看原文（13行）</summary>

```text
export const MEMORY_RAW_LIMIT = 200
export const MEMORY_AUDIT_LIMIT = 500
export const MEMORY_CONTENT_LIMIT = 320
export const IMPORT_IMPORTANCE = 4
/** 正文 Dice 达到此值即视为同一条。 */
export const MEMORY_OVERLAP_CONTENT = 0.7
/** 标题 Dice 达到此值即视为同一条。 */
export const MEMORY_OVERLAP_TITLE = 0.9
/** 「疑似同一条」提示的下限。 */
export const MEMORY_NEAR_FLOOR = 0.4
/** 交给模型判定的相似度下限。 */
export const MEMORY_JUDGE_FLOOR = 0.2
export const MEMORY_JUDGE_MAX_CANDIDATES = 3
```

</details>

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:350-364](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/capture.ts#L350-L364)

提炼输出上限与输入。

<details>
<summary>查看原文（15行）</summary>

```text
    const stream = llm.stream({
      provider: route.provider,
      model: route.model,
      // 自定义 purpose 越界（封闭联合），提示词只能走 system 槽。
      system: systemText,
      maxTokens: 2048,
      signal: controller.signal,
      messages: [
        {
          role: 'user',
          content: [{ type: 'text', text: transcript }],
          source: { kind: 'plugin', plugin: '@zzerx/dsh-plugin-memory' },
        },
      ],
    })
```

</details>

**依据 6 · 源码核查**：[packages/plugin-memory/src/agent/judge.ts:30-35](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/agent/judge.ts#L30-L35)

判定输出/超时上限。

```text
/** 输出上限：一行 JSON，给足余量即可。 */
export const JUDGE_MAX_TOKENS = 256
/** 单次判定超时：超了就退化成「新建」，不能拖住写入。 */
export const JUDGE_TIMEOUT_MS = 15000
/** 候选正文截断长度（判定看语义，不需要全文）。 */
export const JUDGE_MAX_CANDIDATE_CHARS = 200
```

**依据 7 · 源码核查**：[packages/plugin-memory/src/settings.ts:40-58](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/settings.ts#L40-L58)

配置和共用后台路由。

<details>
<summary>查看原文（19行）</summary>

```text
export const Config = Schema.object({
  autoCapture: Schema.boolean().default(MEMORY_CONFIG_BASE.autoCapture).volatile(),
  autoInject: Schema.boolean().default(MEMORY_CONFIG_BASE.autoInject).volatile(),
  maxInjected: Schema.natural().min(1).max(20).default(MEMORY_CONFIG_BASE.maxInjected).volatile(),
  importanceThreshold: Schema.natural().min(1).max(5).default(MEMORY_CONFIG_BASE.importanceThreshold).volatile(),
  captureEveryTurns: Schema.natural().min(1).max(20).default(MEMORY_CONFIG_BASE.captureEveryTurns).volatile(),
  captureMaxTurns: Schema.natural().min(1).max(24).default(MEMORY_CONFIG_BASE.captureMaxTurns).volatile(),
  captureMaxChars: Schema.natural().min(500).max(12000).default(MEMORY_CONFIG_BASE.captureMaxChars).volatile(),
  captureIncludeAssistant: Schema.boolean().default(MEMORY_CONFIG_BASE.captureIncludeAssistant).volatile(),
  // 后台模型：空串 = 不指定（沿用会话自身 / agentDefaultModel）。目录由面板下拉给出，
  // 这里只存值 —— provider / model 被删时调用失败仍是 fail-safe，不做启动期校验。
  llmProvider: Schema.string()
    .description('后台流程（对话提炼 / 写入判定）使用的模型 provider；与 llmModel 一起留空表示跟随会话默认。')
    .default(MEMORY_CONFIG_BASE.llmProvider)
    .volatile(),
  llmModel: Schema.string()
    .description('后台流程使用的模型 id；需与 llmProvider 同时填写，面板里用下拉选择。')
    .default(MEMORY_CONFIG_BASE.llmModel)
    .volatile(),
```

</details>

#### 缺口

- 缺端到端调用、纠错和恢复成本及真实任务收益。
  **影响**：无法定量净价值或接受其为唯一约定来源。
  **进一步探讨**：同任务对照Markdown与插件，计输入输出、人工修正、错召回和全部恢复。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 为何先观察，什么方向值得验证？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先观察，重要偏好/项目约定继续放可审阅指引。跨会话形成、检索与管理有机制增量，但目录身份、模型归属、可变原文和合并/删除部分状态可能放大纠错成本。维护者可在无敏感独立库关闭自动捕获/动态注入研究手工路径，仍要核判定模型；这不是建议直接迁入真实长期约定。若项目串库、错误约定重复出现、来源不再支持、删除后再形成或费用异常，停自动链并备份全表核验。

可研究带确认状态和版本来源的候选记忆：scope绑定稳定项目身份，提炼先待确认，原文保留不可变版本；合并比较旧版本，遗忘列出memory/raw/audit/edges并返回部分完成收据。当前默认importance3低于阈值4仅是分数筛选，不等用户确认队列；现有图谱与审计也不等这个方案已存在。

以当前直接保存/阈值注入与人工Markdown为基线，构造大小写目录、同题矛盾、跨轮原文覆盖、judge-update关系失败、删除后再提炼反例。比较错复用、证据完整、重复、纠错和总成本；若确认/版本负担超过减少的错误，或仍出现同量串项目与来源断裂，则否定优势。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/service.ts:47-48](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L47-L48)

目录身份基线。

```text
export function normalizeProjectKey(path: string): string {
  return path.trim().replace(/[\\/]+$/, '').replace(/\\/g, '/').toLowerCase()
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/service.ts:785-799](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L785-L799)

来源版本化对应当前覆盖。

<details>
<summary>查看原文（15行）</summary>

```text
    // 转录按会话归并，后一轮覆盖前一轮（转录本身是累积的）。
    if (input.origin === 'capture' && input.sessionId !== undefined) {
      const existing = this.collectRaw().find((doc) =>
        doc.origin === 'capture' && doc.sessionId === input.sessionId)
      if (existing !== undefined) {
        const merged: MemoryRawDocument = {
          ...existing,
          title,
          text: input.text,
          textLength: input.text.length,
          updatedAt: now,
          ...(input.note !== undefined ? { note: input.note } : {}),
        }
        await this.rawDocs.put(merged.id, merged)
        return merged
```

</details>

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:820-827](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L820-L827)

累积关联。

```text
  async markExtracted(rawId: MemoryRawId, recordIds: readonly string[]): Promise<MemoryRawDocument | undefined> {
    const current = await this.rawDocs.get(rawId)
    if (current === undefined) return undefined
    const merged = [...current.recordIds]
    for (const id of recordIds) if (!merged.includes(id)) merged.push(id)
    const next: MemoryRawDocument = { ...current, recordIds: merged, extractedAt: Date.now() }
    await this.rawDocs.put(next.id, next)
    return next
```

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:1355-1363](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1355-L1363)

版本/部分失败方案对应宽catch。

```text
        if (verdict.decision === 'update' && target !== undefined) {
          try {
            const record = await this.mergeRecord(target, mergeInput)
            await this.attachEntities(record, input.entities)
            await this.syncAutoEdges()
            return { record, created: false, mergedBy: 'judge', judged }
          } catch {
            // 合并撞上限就退化成新建，不丢掉这次写入。
          }
```

**依据 5 · 源码核查**：[packages/plugin-memory/src/service.ts:1454-1479](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/service.ts#L1454-L1479)

遗忘收据对应多步删除。

<details>
<summary>查看原文（26行）</summary>

```text
  async removeMemory(id: MemoryId): Promise<boolean> {
    const current = await this.memories.get(id)
    if (current === undefined) return false
    await this.memories.delete(id)
    await this.removeEdgesFor({ kind: 'memory', id })
    return true
  }

  async reset(scope: MemoryScope, projectPath?: string): Promise<number> {
    const pathKey = normalizeProjectKey(projectPath ?? '')
    const targets = this.collect().filter((record) => {
      if (record.scope !== scope) return false
      if (scope === 'global') return true
      return normalizeProjectKey(record.projectPath) === pathKey
    })
    for (const record of targets) {
      await this.memories.delete(record.id)
      await this.removeEdgesFor({ kind: 'memory', id: record.id })
    }
    // 同作用域的留档一起清，否则留下孤儿原文。
    for (const doc of this.collectRaw()) {
      if (doc.scope !== scope) continue
      if (scope === 'project' && normalizeProjectKey(doc.projectPath) !== pathKey) continue
      await this.rawDocs.delete(doc.id)
    }
    return targets.length
```

</details>

**依据 6 · 源码核查**：[packages/plugin-memory/src/types.ts:479-489](https://github.com/0x7A7A6572/dsh-forge-studio/blob/9fac17c8eb36ab46b1cd7647ccc18dc8b65c3ca6/packages/plugin-memory/src/types.ts#L479-L489)

分数阈值不等确认状态。

<details>
<summary>查看原文（11行）</summary>

```text
export const MEMORY_CONFIG_BASE: MemoryConfig = {
  autoCapture: true,
  autoInject: true,
  maxInjected: 6,
  importanceThreshold: 4,
  captureEveryTurns: 3,
  captureMaxTurns: 4,
  captureMaxChars: 4000,
  captureIncludeAssistant: false,
  llmProvider: '',
  llmModel: '',
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
