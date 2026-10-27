# @zzerx/dsh-plugin-memory

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/0x7A7A6572/dsh-forge-studio) [![npm 30d 1,810](https://img.shields.io/static/v1?label=npm+30d&message=1%2C810&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory) [![最新发布 2026-10-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@zzerx/dsh-plugin-memory)
<!-- END META -->

> **实现功能**：提供全局/项目记忆库、九工具、自动提炼与注入、原文审计、实体关系及可视化管理。

> **核心亮点**：将原文、后台提炼/判定、记忆工具与scope注入/图谱管理接为跨会话流程。详见[Q01](#research-q01)。

> **风险与缺陷**：本地存储不等离线提炼，项目全小写可串目录，模型scope默认global，合并/遗忘多副本非事务。详见[Q03](#research-q03)。

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
  - [Q01 · 跨会话记忆带来什么实际工作流？](#detail-section-11)
  - [Q02 · 存储、提炼和注入如何流动？](#detail-section-12)
  - [Q03 · 本地记忆和项目分区为何仍需隐私核对？](#detail-section-13)
  - [Q04 · 合并和后台失败怎样影响事实可靠性？](#detail-section-14)
  - [Q05 · 首次、持续与失败恢复分别付出什么？](#detail-section-15)
  - [Q06 · 当前采用建议和继续探讨方向是什么？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向希望跨会话复用偏好与项目约定的 DSH 单用户。合格结果需作用域正确、错误可纠正、来源可回看；原文与关系图不自动保证事实正确。

手工项目指引和 Markdown 记忆是直接基线；它们少自动提炼与图谱，但不引入额外模型判重及隐藏原文副本。两者应以相同项目事实、错误修正和跨会话合格任务比较。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 多表记忆/图谱 | 偏好项目复用 | 关系不等真值 |
| 提炼与判重 | 自动减少重复录入 | 模型外发/错记 |
| scope注入 | 后续对话带背景 | 目录身份和阈值需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH storageDomain 与 settings | 必需 | 记忆、原文、审计持久化 | 域无法打开则不能启动 |
| tools/systemPrompt | 会话能力必需 | 存取工具和动态召回 | 单桥失败会降级 |
| LLM 路由 | 自动提炼/语义判重必需 | 转录与候选处理 | 无路由保留失败审计，不形成提炼 |
| 项目身份、敏感数据许可 | 效果前提 | 限定作用域与模型披露 | 小写路径和 global 回退须人工核对 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 建试验库 | 用户用独立 profile，关闭自动提炼/注入 | 无生产秘密，留原始指引备份 |
| 手工写入 | 用户写 global 与 project 各一条 | 两个大小写目录分别核召回 |
| 自动处理 | 用户明确选模型后按需启用 | 核原文、候选、审计及额外 token |
| 纠错/退出 | 用户导出并逐副本清理 | memory/raw/audit/edges 分别核对 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 独立profile/模型路线 | scope、隐私、冲突核对 | 提炼/判重需既有模型路线；初始化金额和工时未知 |
| 持续使用 | 额外提炼/判重与注入token | 纠错、去重和冲突复核 | 捕获/判定token上限不是总费用预算；净收益未知 |
| 失败恢复 | 导出/原文/审计备份 | 全副本遗忘和部分写修复 | raw/audit可能保留旧内容；全副本遗忘与修复工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 少重复说明 | 阈值scope召回 | 不等正确/相关 |
| 形成记忆 | LLM提炼/判重 | 外发/误global/费用 |
| 管理关系 | 原文/审计/实体边 | 多副本与跨表恢复 |

> **思考**：本地存储不等离线提炼，项目全小写可串目录，模型scope默认global，合并/遗忘多副本非事务。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将原文、后台提炼/判定、记忆工具与scope注入/图谱管理接为跨会话流程。详见[Q01](#research-q01)。

将原文、后台提炼/判定、记忆工具与scope注入/图谱管理接为跨会话流程。详见[Q01](#research-q01)。

原文、审计与派生关系分离以及可降级的工具/提示桥可借鉴；同题并发合并和多表清理仍需版本及恢复收据，详见 [Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

本地存储不等离线提炼，项目全小写可串目录，模型scope默认global，合并/遗忘多副本非事务。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察；无敏感库关autoCapture/autoInject，手工条目与独立profile对照，重要约定保留原始指引。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有贡献由固定提交源码支持；端到端报告或记忆质量未经运行对照；未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 packages/plugin-memory/README.md、packages/plugin-memory/package.json、packages/plugin-memory/src/index.ts、packages/plugin-memory/src/domain.ts、packages/plugin-memory/src/conflicts.ts、packages/plugin-memory/src/service.ts、packages/plugin-memory/src/settings.ts、packages/plugin-memory/src/agent/prompt.ts、packages/plugin-memory/src/agent/capture.ts、packages/plugin-memory/src/agent/judge.ts、packages/plugin-memory/src/agent/tools.ts 及固定范围 inventory；组件：packages/plugin-memory。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定monorepo packages/plugin-memory入口、存储schema、服务关键合并/删除/项目/注入、agent捕获/判定/工具桥与设置；未穷尽GUI或宿主，未执行目标。
- 下一步：可研究待确认候选、身份/来源版本合并及全副本遗忘收据，以串项目和并发反例比较错召回与恢复。当前未验证。详见[Q06](#research-q06)。

进一步从大小写项目、矛盾同题、并发合并、错误global、原文再提炼和跨表半失败探讨候选确认与遗忘收据。

**分析版本**

- **仓库**：[0x7A7A6572/dsh-forge-studio](https://github.com/0x7A7A6572/dsh-forge-studio)
- **版本号**：0.4.3（[固定提交 be18a39](https://github.com/0x7A7A6572/dsh-forge-studio/tree/be18a392f0c5c60a5253eb267b2f622d3a0e6555)）
- **版本日期**：2026-10-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可研究待确认候选、身份/来源版本合并及全副本遗忘收据，以串项目和并发反例比较错召回与恢复。当前未验证。详见[Q06](#research-q06)。

可研究待确认候选、身份/来源版本合并及全副本遗忘收据，以串项目和并发反例比较错召回与恢复。当前未验证。详见[Q06](#research-q06)。

进一步从大小写项目、矛盾同题、并发合并、错误global、原文再提炼和跨表半失败探讨候选确认与遗忘收据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 67 | — | — | 1250 |
| .mjs | source | 1 | 31 | 16 | 10 | — |
| .ts | source | 25 | 6528 | 5384 | 651 | — |
| .tsx | source | 10 | 1596 | 1436 | 107 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+created%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z) [![近30天关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/0x7A7A6572/dsh-forge-studio/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-26T01%3A59%3A33.546Z..2026-10-26T01%3A59%3A33.546Z)



统计日期：2026-10-26。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定组件跨会话记忆链如何工作，模型外发/项目身份/合并和遗忘成本如何影响采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 跨会话记忆带来什么实际工作流？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望DSH跨会话保留偏好与项目约定的单用户，提供全局/目录项目记忆、原文留档、模型提炼、搜索、实体和边、GUI管理及导入导出。合格结果是经用户认可的长期信息能在相同项目召回，错误/过时可修正，不是自动越聊越准确。简单替代是手工项目指引、Markdown记忆和关键词搜索。

贡献是宿主storage-domain、九工具、动态提示注入和turn/end后台提炼/判重/审计的联结，不是向量索引、新LLM记忆算法或事实校验器。源码list用子串匹配；图谱连边表达已有关系，不提供独立真实性证据。同类插件重名检测保护注册，但不能检查所有隐形提示注入，因此“互斥”只在可探测工具冲突范围成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/index.ts:49-70](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/index.ts#L49-L70)

存储/服务/桥/设置装配。

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

**依据 2 · 源码核查**：[packages/plugin-memory/src/service.ts:493-512](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L493-L512)

子串字段检索。

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

**依据 3 · 源码核查**：[packages/plugin-memory/src/conflicts.ts:1-12](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/conflicts.ts#L1-L12)

重名探测边界。

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

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 存储、提炼和注入如何流动？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

入口硬依赖storageDomain，打开memory域后提供MemoryService，settings读volatile，tools/systemPrompt晚就绪时分别挂桥。域按memories、raw_documents、audits、entities、edges记录和schema，持久化具体原子性/权限由宿主storage-domain负责。每轮结束按频率开关触发，单session inFlight避免同时提炼，读取最近有限轮/字符真人消息及可选assistant，先存原文，再调用配置或会话模型得到最多三条200字候选，逐条保存、关联原文并记usage/失败审计。

注入从global+归一目录精确相等project中筛未归档、置顶或重要性阈值条目，排序取maxItems，render加背景/当前指令优先说明并转义{{}}；配置控制是否注入，静态usage指导仍告诉模型如何使用工具。它是每次context装配读取，不只新会话开场。工具可显式project_path，目录是选择键而非授权围栏；依赖0.2.0-rc.1宿主相关包及匹配llm/tools/settings/Typert客户端，缺桥不等全部能力可用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/index.ts:25-28](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/index.ts#L25-L28)

域依赖。

```text
export const name = '@zzerx/dsh-plugin-memory'
export const inject = ['storageDomain']
/** 插件配置 schema（settings 分区的命名空间就是本条目 id，见 settings.ts）。 */
export { Config } from './settings.ts'
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/index.ts:81-112](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/index.ts#L81-L112)

晚挂桥和失败降级。

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

**依据 3 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:449-476](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L449-L476)

频率/inFlight与后台。

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

**依据 4 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:289-326](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L289-L326)

原文先落/缺路由审计。

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

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:350-364](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L350-L364)

真实模型输入。

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

**依据 6 · 源码核查**：[packages/plugin-memory/src/service.ts:679-691](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L679-L691)

scope与阈值取候选。

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

**依据 7 · 源码核查**：[packages/plugin-memory/src/agent/prompt.ts:98-120](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/prompt.ts#L98-L120)

动态context。

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

### Q03 · 本地记忆和项目分区为何仍需隐私核对？

**研究主题**：缺陷与关键质疑

#### 完整回答

README“只存在本地”适合描述存储位置，不能理解提炼与判重完全离线。capture将原始最近对话作为llm.stream user输入；judge将待写内容和附近候选送给所配模型，路由若远程即对该模型服务披露。提示“不要记密钥”只约束输出意图，不在发送前脱敏，原文先存包含敏感对话仍可能留本地；归档/删除单条memory不同时删除raw原文或audit关联，删除结果不是全副本遗忘。

项目key无条件小写、去尾分隔，Linux区分大小写目录可被合并，未realpath的别名/重命名又可能拆成不同项目，不能称严格项目身份隔离。parseCapturedItems非法scope默认global，模型错选可能把项目事实全局注入；importance3也只是保存默认而非用户确认。跨作用域的显式工具/GUI管理要由宿主授权，当前过滤是选择功能，未证明多用户隔离。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:350-362](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L350-L362)

原文发模型。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[packages/plugin-memory/src/agent/judge.ts:134-157](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/judge.ts#L134-L157)

候选送模型判定。

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

**依据 3 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:190-196](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L190-L196)

错误scope落global。

```text
    if (isStatusSnapshot(content)) {
      dropped.push({ title, reason: 'status-snapshot' })
      continue
    }
    const kind = MEMORY_KINDS.includes(record.kind as MemoryKind) ? (record.kind as MemoryKind) : 'fact'
    const scope: MemoryScope = record.scope === 'project' ? 'project' : 'global'
    items.push({ title, content, kind, scope })
```

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:47-48](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L47-L48)

目录全小写。

```text
export function normalizeProjectKey(path: string): string {
  return path.trim().replace(/[\\/]+$/, '').replace(/\\/g, '/').toLowerCase()
```

**依据 5 · 源码核查**：[packages/plugin-memory/src/service.ts:1454-1459](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1454-L1459)

单memory删除仅清边。

```text
  async removeMemory(id: MemoryId): Promise<boolean> {
    const current = await this.memories.get(id)
    if (current === undefined) return false
    await this.memories.delete(id)
    await this.removeEdgesFor({ kind: 'memory', id })
    return true
```

**依据 6 · 源码核查**：[packages/plugin-memory/src/service.ts:849-859](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L849-L859)

raw另行删除/裁剪。

<details>
<summary>查看原文（11行）</summary>

```text
  async removeRawDocument(rawId: MemoryRawId): Promise<boolean> {
    const current = await this.rawDocs.get(rawId)
    if (current === undefined) return false
    await this.rawDocs.delete(rawId)
    return true
  }

  async pruneRawDocuments(limit: number): Promise<number> {
    const ids = prunableRawIds(this.collectRaw(), limit)
    for (const id of ids) await this.rawDocs.delete(id)
    return ids.length
```

</details>

#### 缺口

- 匹配宿主模型服务的远程数据政策和storage-domain/Typert主体授权未由组件闭合
  **影响**：不能保证敏感数据全本机或多用户项目隔离
  **进一步探讨**：按实际模型路线/宿主存储与remote访问契约核对，先关闭自动提炼并用无敏感库

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 合并和后台失败怎样影响事实可靠性？

**研究主题**：工程质量与复用

#### 完整回答

save按同scope/kind/title或alias先合，再Dice重合，低相似近邻可交judge判add/update/skip；judge失败默认新建避免丢输入，但不保证不重，语义错误也不会因入库而校正。标题合并/重合合并可能把矛盾观点串接，合并总长320超限直接失败；judge-update分支超限才降级新建，和直接title/overlap路径不同。并发save读候选后await模型/存储，代码未见服务级互斥或版本比较，可能同题新建两条或后写覆盖合并。

Memory put、挂实体、syncAutoEdges是多次await，失败可留下条目已写而关系未补的部分状态；delete/reset也多表顺序，宿主单table持久不等跨表事务。capture解析输出非法JSON会得到items空、failure仍undefined，审计ok可为true但未产条目，不能看ok判语义提炼成功。capture定时60秒只abort信号，忽略信号的模型stream仍可能不结束，卸载只去事件listener不取消已开任务。原文按session覆盖最近转录，不是永久保留所有历史片段。

需要区分 reset 与单条删除。reset 会尝试同作用域原文清理（service.ts 1473–1477），因此不能笼统断言所有删除操作均不处理原文；这里质疑的是单条 removeMemory 及多表顺序清理失败后的完整遗忘。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/service.ts:1301-1368](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1301-L1368)

标题/重合/模型判定路径。

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

**依据 2 · 源码核查**：[packages/plugin-memory/src/service.ts:1272-1298](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1272-L1298)

合并长度及put。

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

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:1395-1399](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1395-L1399)

多步骤持久。

```text
    await this.memories.put(record.id, record)
    // 先挂显式实体再重算自动边，共现边才算得上这条。
    await this.attachEntities(record, input.entities)
    await this.syncAutoEdges()
    // 判定跑过就带回结论，调用方能区分「模型看过」与「附近没有像的」。
```

**依据 4 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:157-168](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L157-L168)

非法JSON变空。

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

**依据 5 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:342-385](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L342-L385)

60秒协作abort。

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

**依据 6 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:420-435](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L420-L435)

审计ok仅failure标记。

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

**依据 7 · 源码核查**：[packages/plugin-memory/src/service.ts:785-799](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L785-L799)

同session原文替换。

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

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 首次、持续与失败恢复分别付出什么？

**研究主题**：效果与总成本

#### 完整回答

首次要建立无敏感试验库、核对global/project归属、选择自动提炼/注入和后台模型，确认与现有memory工具不冲突；core数据/GUI可本地但提炼和判重增加LLM调用。持续每次捕获最多2048输出token，判定最多256，查询片段与候选还占输入，注入条目增加每次上下文；原文200/审计500上限约束条数，不是字节或费用总预算。实际调用量随轮频、近邻判定和模型费变化，不能写免费记忆。

恢复需用户纠正错误global、错误合并、归档/删除和导出备份，核查raw/audit是否仍保留旧内容；判定故障退新建提高不丢率也增加清重工时。每轮syncAutoEdges扫描/重建涉及库规模，大小库的耗时与任务改善未知。组件未发现对应独立测试文件，仓库其他测试未穷尽，因此只报告源码和配置约束，不把monorepo总体检查当该组件效果验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:350-356](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L350-L356)

capture输出预算。

```text
    const stream = llm.stream({
      provider: route.provider,
      model: route.model,
      // 自定义 purpose 越界（封闭联合），提示词只能走 system 槽。
      system: systemText,
      maxTokens: 2048,
      signal: controller.signal,
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/agent/judge.ts:30-35](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/judge.ts#L30-L35)

judge预算/候选限制。

```text
/** 输出上限：一行 JSON，给足余量即可。 */
export const JUDGE_MAX_TOKENS = 256
/** 单次判定超时：超了就退化成「新建」，不能拖住写入。 */
export const JUDGE_TIMEOUT_MS = 15000
/** 候选正文截断长度（判定看语义，不需要全文）。 */
export const JUDGE_MAX_CANDIDATE_CHARS = 200
```

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:29-41](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L29-L41)

条数/正文/相似阈值。

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

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:1323-1368](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1323-L1368)

合并与失败默认策略。

<details>
<summary>查看原文（46行）</summary>

```text
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

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 当前采用建议和继续探讨方向是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

先观察。机制完整但自动提炼的对话外发与原文留存、目录小写冲突、未经用户确认的global归属、并发合并和跨表部分写使错误可能跨会话放大。维护者可关闭autoCapture/autoInject，用无敏感手工条目和独立profile对照工具/图谱，不宜直接把唯一重要项目约定交自动进化。停止条件包括项目串库、错误global反复召回、合并丢关键限定、删除后仍被raw再提炼或后台费用超预期。

可继续探讨带来源/确认状态的候选记忆与版本合并，自动提炼先进入待确认，scope与源会话/目录身份绑定；遗忘计划统一列出memory/raw/audit/edges，提交前比较版本，失败保留可恢复收据。基线为当前直接写入、阈值合并和人工Markdown，反例含大小写目录、同题矛盾、并发写、模型返回global、删除后重提炼和存储半失败。比较错召回/跨项目误用、重复与总成本，假设未验证，不把现有图谱等同知识正确。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugin-memory/src/service.ts:47-48](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L47-L48)

项目身份现状。

```text
export function normalizeProjectKey(path: string): string {
  return path.trim().replace(/[\\/]+$/, '').replace(/\\/g, '/').toLowerCase()
```

**依据 2 · 源码核查**：[packages/plugin-memory/src/agent/capture.ts:194-196](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/agent/capture.ts#L194-L196)

scope现状。

```text
    const kind = MEMORY_KINDS.includes(record.kind as MemoryKind) ? (record.kind as MemoryKind) : 'fact'
    const scope: MemoryScope = record.scope === 'project' ? 'project' : 'global'
    items.push({ title, content, kind, scope })
```

**依据 3 · 源码核查**：[packages/plugin-memory/src/service.ts:1301-1368](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1301-L1368)

直接合并现状。

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

**依据 4 · 源码核查**：[packages/plugin-memory/src/service.ts:1454-1478](https://github.com/0x7A7A6572/dsh-forge-studio/blob/be18a392f0c5c60a5253eb267b2f622d3a0e6555/packages/plugin-memory/src/service.ts#L1454-L1478)

删除/重置不同副本范围。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
