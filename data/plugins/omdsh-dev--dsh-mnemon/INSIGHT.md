# dsh-mnemon

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[7cbdefc](https://github.com/omdsh-dev/dsh-mnemon/tree/7cbdefc64c019a073cfdb493b0b516b5b7177bb6)

<!-- BEGIN META -->
[![GitHub ★ 815](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=815&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 69,103](https://img.shields.io/static/v1?label=npm+30d&message=69%2C103&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-10-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)
<!-- END META -->

> **功能**：为 DSH 提供可组合的分层记忆视图、读取与写入。

> **亮点**：[Q02](#research-q02) 把多个来源按固定视图组合并区分常驻与按需读取，相比单一记忆文件提供可配置路由，但不保证内容真实。

> **主要限制**：[Q03](#research-q03) 作用域约束不能证明事实正确或全 Provider 隔离；关闭组件也不删除数据。

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
  - [Q01 · 适合谁，依赖什么？](#detail-section-11)
  - [Q02 · 视图如何进入回合并支持读写？](#detail-section-12)
  - [Q03 · 作用域、可信性和数据残留风险是什么？](#detail-section-13)
  - [Q04 · 成本和可验证改进假设？](#detail-section-14)
  - [Q05 · 如何试用及退出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 跨会话反复使用偏好和项目资料的 DSH 用户需要正确范围的可核验记忆。

手工维护项目文件和 MEMORY 文件，并在需要时人工检索和更新。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 分层视图 | 常驻工作记忆和按需读取资料 | 来源、策略与作用域必须可用，内容仍需核验 |
| 路由及动作 | 按当前视图读写记忆 | 写入需授权和回执，不保证事实正确 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 与所注入服务 | 必需 | 挂载运行时、工具与生命周期 | 无法通过此路径使用记忆 |
| 已启用来源和策略 | 使用对应记忆必需 | 生成视图与读写操作 | 来源不可用或视图无法组合 |
| 第三方 Provider 凭据与网络 | 对该来源有条件必需 | 远程保存和召回 | 调用可能失败且数据范围取决于服务 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 配置 | 用户选择独立存储和来源 | 范围、权限与备份已确认 |
| 验收 | 用虚构资料检查视图、读写和回执 | 资料与工作区匹配 |
| 维护 | 用户核对过期事实与费用 | 纠正错误来源 |
| 异常 | 禁用异常来源并手工核查 | 单独处理残留和备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本地存储或远程服务 | 配置来源和范围 | 耗时未知 |
| 持续使用 | 上下文 token 和服务费用 | 核实及更新记忆 | 实测消耗未知 |
| 失败恢复 | 检索、排查和备份成本 | 追踪错误事实和作用域 | 损失未知 |
| 退出 | 数据与备份清理 | 禁用并清点残留 | 关闭不等于删除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 分层视图 | 固定回合来源与预算路由 | 召回准确率和答案正确性 |
| 写入控制 | action 需授权并返回 receipt | 所有 Provider 的实际持久与隔离 |

> **思考**：[Q03](#research-q03) 作用域约束不能证明事实正确或全 Provider 隔离；关闭组件也不删除数据。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 把多个来源按固定视图组合并区分常驻与按需读取，相比单一记忆文件提供可配置路由，但不保证内容真实。

[Q02](#research-q02) View 固定 generation 和作用域，[Q03](#research-q03) 来源歧义与残留数据构成边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 作用域约束不能证明事实正确或全 Provider 隔离；关闭组件也不删除数据。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 用虚构项目和本地独立存储试用；串项目或旧错误持续出现时停用并核查数据。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持回合固定视图和分层路由；真实召回质量、Provider 隔离和成本未验证。

- 已检查：作者 README、包清单、源码路径 package.json、src/host/plugin.ts、README.zh-CN.md、src/host/lifecycle.ts、src/core/turns.ts、plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts、src/host/guidance.ts、src/host/tools.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定源码静态检查默认策略和 Host 通路，未审计所有来源或验证 Provider。
- 下一步：在隔离 DSH 试验来源视图、读写回执、切换工作区和删除恢复，记录召回及 token 指标。

**分析版本**

- **仓库**：[omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon)
- **版本号**：0.5.37（[固定提交 7cbdefc](https://github.com/omdsh-dev/dsh-mnemon/tree/7cbdefc64c019a073cfdb493b0b516b5b7177bb6)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 对高频注入事实提示来源和最近核验时间或可减少过期引用，需对照验证。

在隔离 DSH 试验来源视图、读写回执、切换工作区和删除恢复，记录召回及 token 指标。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 592 | 38928 | — | — | 795846 |
| .mjs | source | 57 | 6314 | 5676 | 442 | — |
| .mts | source | 2 | 253 | 207 | 28 | — |
| .ts | source | 296 | 47496 | 39453 | 4736 | — |
| .js | source | 4 | 67 | 60 | 7 | — |
| .ts | test | 205 | 41133 | 36836 | 1427 | — |
| .tsx | source | 73 | 13207 | 11159 | 1252 | — |
| .tsx | test | 30 | 11849 | 10508 | 467 | — |
| .mjs | example | 35 | 4493 | 4029 | 336 | — |
| .cjs | example | 2 | 30 | 22 | 7 | — |
| .ts | example | 16 | 1081 | 999 | 38 | — |
| .tsx | example | 2 | 177 | 165 | 4 | — |
| .mjs | test | 16 | 1944 | 1724 | 115 | — |
| .md | example | 4 | 40 | — | — | 217 |

</details>

**活跃度**

[![Issue 未关闭 22](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=22&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 69](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=69&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 51](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=51&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 每回合的记忆视图如何组合、读写及其作用域、数据和可靠性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 适合谁，依赖什么？

**研究主题**：场景与需求、依赖、兼容与流程

#### 完整回答

dsh-mnemon 是 DSH 的可组合记忆插件，面向跨会话反复使用偏好与项目资料且愿意维护事实的用户；合格结果是正确范围内的相关事实可用、过期内容可识别和纠正。包声明 Node 与 DSH 版本范围，Host 入口注入 tools、settings、commands、agents 和 subagents。默认本地运行时记忆、项目档案和 Native 记忆空间；第三方 Provider 另有配置与数据范围。包版本和源码声明不证明目标 Host 已安装或数据召回有效。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-4](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/package.json#L2-L4)

包名、版本和定位。

```text
  "name": "dsh-mnemon",
  "version": "0.5.37",
  "description": "Composable, view-based context for DeepSeek Harness. Pluggable sources and strategies, with layered memory and self-evolving skills out of the box.",
```

**依据 2 · 源码核查**：[package.json:49-52](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/package.json#L49-L52)

运行时版本声明。

```text
  },
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0"
```

**依据 3 · 源码核查**：[src/host/plugin.ts:28-30](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/plugin.ts#L28-L30)

DSH 服务依赖。

```text
export const name = 'dsh-mnemon'
export const provide = ['mnemonMemory']
export const inject = ['tools', 'settings', 'commands', 'agents', 'subagents']
```

**依据 4 · 作者声明**：[README.zh-CN.md:68-76](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L68-L76)

三类记忆与默认策略。

```text
## 三类记忆

| 记忆 | 适合保存 | 如何进入 Agent 上下文 |
|---|---|---|
| **运行时记忆** | 偏好、协作约定、下一轮就需要的事实 | 每轮以紧凑的 USER.md 与 MEMORY.md 注入 |
| **项目档案** | 设计、调查、流程与交接材料 | 先检索，相关时再阅读全文 |
| **记忆空间** | 长期事实、决策、实体及其关系 | 按需从已启用的 Provider 召回 |

默认的**分层策略**让运行时记忆常驻，另外两类按需读取；**通用策略**在同一份预算内提供全部可用来源，由模型决定如何使用。**记忆空间**是由 Provider 承载、可以独立命名和激活的长期证据范围，英文界面称 memory space。
```

**依据 5 · 作者声明**：[README.zh-CN.md:151-157](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L151-L157)

本地和远程数据边界。

```text
## 数据与信任

- 运行时记忆与项目档案是本地文件，Mnemon Native 也在本地；第三方 Provider 使用各自的服务与作用域。
- 关闭组件不会删除其中的记忆，更换存储位置也不会搬移数据；需要迁移时使用 ZIP 备份。
- 技能管理的进化数据（建议、测试用例以及复盘读过的对话，机密已替换）保存在本地存储根目录，不在备份之内。来自市场的技能会被 Agent 按原文执行，安装前请先预览。
- Git 同步把同一份 Mnemon Pack 载荷以可读文件发布到你自己的仓库，另一台机器可以拉取；可以**立即同步**、在写入前**检查远端**，或按间隔**自动同步**。两台设备对同一主题写法不同时，两种写法都会保留，直到你接受并执行**记忆整理**给出的方案，见 [Git 仓库同步](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/zh-CN/guides/operations.md#git-仓库同步)。
- 已保存的 Provider 凭据只留在宿主上，不会被导出；但备份仍包含私有记忆，请妥善保护。
```

#### 缺口

- 目标 DSH 与记忆来源是否启用
  **影响**：影响实际可用性
  **进一步探讨**：在隔离配置中核查版本、来源和有效工作区

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 视图如何进入回合并支持读写？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

Host 入口提供记忆运行时并注册生命周期、工具及提示指导；Agent 创建后挂载回合相关监听。beginTurn 按存储、工作区、会话和 agent 范围取得 generation，compose 视图后固定本回合的 view；同一 turn 不能换成别的 scope，失败释放 lease。默认三层策略将可投影工作记忆按预算 eager 投影，文档与长期证据按预算 routed 暴露，并仅列可用路由与动作。提示装配使用视图指导，按需读取通过 mnemon_view_route 核对视图所给 ID；写操作经 action 和授权得到 receipt，offer 本身不是授权。相比把所有资料持续塞入单一文件，它可在固定视图下拆分常驻与按需读取；并不保证模型选择正确路由或内容真实。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/plugin.ts:84-94](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/plugin.ts#L84-L94)

Host 提供运行时。

<details>
<summary>查看原文（11行）</summary>

```text
/** DSH owns assembly; this Host only wires scope, phases and user preferences. */
export function apply(rawContext: unknown, rawConfig: MnemonConfig | LiveHostConfig = {}): void {
  const ctx = rawContext as unknown as HostContextShape
  const config = plainHostConfig(rawConfig)
  const hostSettings = new ProfileMnemonSettings(ctx, rawConfig)
  registerMnemonSubagentTokenUsageProjection(ctx)
  const extensions = provideMemoryRuntime(ctx)
  const memoryPlugins = new MemoryPluginManagement(ctx, extensions, hostSettings)
  const pluginInstallation = new MemoryPluginInstallation(ctx)
  const effectiveConfig = (value: MnemonConfig) => memoryPlugins.resolveConfig(resolveConfig(value), value.memoryView ?? { entries: {} })
  const settings = hostSettings.register<MnemonConfig>('mnemon', PlainConfig, {
```

</details>

**依据 2 · 源码核查**：[src/host/plugin.ts:162-187](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/plugin.ts#L162-L187)

生命周期、工具与指导注册。

<details>
<summary>查看原文（26行）</summary>

```text
  const lifecycle = new MnemonLifecycle(ctx, coordinator, runtime.config, runtime)
  const skills = new SkillEvolution({
    settings: () => skillSettings.get(),
    source: agent => skillsSourceFor(runtime, agent),
    runTask: (workspaceRoot, signal, operation, route) => lifecycle.runSkillTask(workspaceRoot, signal, operation, route),
    skillTask: (parent, label, prompt, schema, persona, signal) => coordinator.skillTask(parent, label, prompt, schema, persona, signal, taskRoute(parent)),
  })
  lifecycle.useSkillEvolution(skills)
  // Registered before the lifecycle root so teardown runs the other way round:
  // the timer stops first, and only then does the runtime it reads go away.
  ctx.effect(() => {
    const stop = autoBackup.start()
    return () => { stop() }
  }, 'dsh-mnemon: automatic Git backup')
  ctx.effect(() => {
    const stop = lifecycle.start()
    return async () => {
      stop()
      skills.dispose()
      await coordinator.dispose()
      runtime.dispose()
    }
  }, 'dsh-mnemon.lifecycle-root()')
  registerTools(ctx, runtime, coordinator)
  registerCommands(ctx.commands, runtime, coordinator)
  registerGuidance(ctx, resolved)
```

</details>

**依据 3 · 源码核查**：[src/host/lifecycle.ts:250-257](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/lifecycle.ts#L250-L257)

Agent 生命周期监听。

```text
      this.agent.ctx.on('system-prompt/assemble', ((assembly: PromptAssembly, context: PromptAssemblyContext, next: () => Promise<PromptAssembly>) => this.assemblePrompt(assembly, context, next)) as never),
      // `prepend: true` makes this the outermost pre-step participant, so it
      // observes the fully assembled batch and appends after every other
      // contributor's context. The snapshot therefore has no byte-stable
      // context behind it, and `recordTurnMessages` sees the complete batch
      // rather than a partial one.
      this.agent.ctx.on('agent/pre-step', ((payload: PreStepPayload, next: () => Promise<HostPreStepDecision>) => this.preStep(payload, next)) as never, { prepend: true }),
      this.agent.ctx.on('agent/turn-stopping', ((payload: TurnStoppingPayload) => this.finishTurn(payload)) as never),
```

**依据 4 · 源码核查**：[src/host/lifecycle.ts:680-690](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/lifecycle.ts#L680-L690)

Agent 创建安装。

<details>
<summary>查看原文（11行）</summary>

```text
    if (this.skillEvolution === undefined) throw new Error('skill evolution is unavailable')
    return this.skillEvolution.reviewNow(this.liveAgent(sessionId))
  }

  start(): () => void {
    // DSH creates a new Agent for startup, resume, clear and compaction alike.
    const stopCreated = this.ctx.on('agent/created', (({ agent, source }: SessionStartPayload) => { this.install(agent, source) }) as never)
    for (const agent of this.ctx.agents.roots()) this.install(agent, 'adopted')
    return () => {
      stopCreated()
      for (const dispose of [...this.children.values()].reverse()) dispose()
```

</details>

**依据 5 · 源码核查**：[src/core/turns.ts:84-115](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L84-L115)

turn 作用域、compose 和失败释放。

<details>
<summary>查看原文（32行）</summary>

```text
  async beginTurn(turnId: string, scope: MemoryOperationScope, scenario = 'agent.root-turn', signal?: AbortSignal): Promise<ComposableMemoryTurn> {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    signal?.throwIfAborted()
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const existing = this.turns.get(id)
    const beginning = this.beginnings.get(id)
    const previousScope = existing?.context.scope ?? beginning?.scope
    if (previousScope !== undefined && (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => previousScope[key] !== scope[key])) {
      throw new Error('Composable Memory turn id is already bound to another scope')
    }
    if (existing !== undefined) return existing.context
    if (beginning !== undefined) return beginning.promise
    const lease = this.generations.acquire()
    const pending = { scope: { ...scope }, controller: new AbortController(), promise: undefined as unknown as Promise<ComposableMemoryTurn> }
    const abort = () => pending.controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    this.beginnings.set(id, pending)
    pending.promise = (async () => {
      try {
        const view = await lease.generation.compose({ scope: pending.scope, scenario, budget: { ...DEFAULT_MEMORY_VIEW_BUDGET } }, pending.controller.signal)
        pending.controller.signal.throwIfAborted()
        const context = Object.freeze({ turnId: id, view, scope: Object.freeze(pending.scope), startedAt: new Date().toISOString() })
        this.turns.set(id, { context, lease })
        return context
      } catch (error) {
        lease.release()
        throw error
      } finally {
        signal?.removeEventListener('abort', abort)
        if (this.beginnings.get(id) === pending) this.beginnings.delete(id)
      }
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:54-95](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L54-L95)

三层投影、预算和路由。

<details>
<summary>查看原文（42行）</summary>

```text
function composeThreeTier(request: MemoryViewRequest, sources: readonly MemorySourceFacts[]): MemoryViewSpec {
    const runtime = soleSource(sources, 'working-context')
    const documents = soleSource(sources, 'narrative')
    const memorySpaces = soleSource(sources, 'durable-evidence')
    const durable = memorySpaces?.sourceTypeId === 'memory-spaces'
    // The guidance names mnemon_recall only while Memory Spaces offer recall, and
    // archiving into them only while one takes writes here (#336). Both follow the
    // View's facts, after the layer's participation settings.
    const recall = durable && memorySpaces.routeIds.includes('recall')
    const hints = memorySpaces?.hints
    const count = (key: string): number | undefined => {
      const value = hints !== null && typeof hints === 'object' && !Array.isArray(hints) ? hints[key] : undefined
      return typeof value === 'number' ? value : undefined
    }
    const archivable = count('archivableCount') ?? count('activeCount')
    const archive = durable && memorySpaces.actionIds.includes('remember') && (archivable === undefined || archivable > 0)
    const classicSources = runtime?.sourceTypeId === 'runtime' && documents?.sourceTypeId === 'documents' && durable
    const selected = [runtime, documents, memorySpaces].filter((source): source is MemorySourceFacts => source !== undefined)
    const projectionBudget = request.budget.maxProjectionCharacters
    const runtimeBudget = runtime === undefined || !runtime.capabilities.includes('project') ? 0 : Math.max(1, Math.floor(projectionBudget * 0.9))
    let remaining = Math.max(0, projectionBudget - runtimeBudget)
    const documentsBudget = documents === undefined || !documents.capabilities.includes('project') || remaining === 0 ? 0 : Math.max(1, Math.floor(remaining / (memorySpaces === undefined ? 1 : 2)))
    remaining -= documentsBudget
    const memorySpacesBudget = memorySpaces === undefined || !memorySpaces.capabilities.includes('project') ? 0 : remaining
    const allocation = new Map<string, { mode: 'eager' | 'routed'; maxCharacters: number }>()
    if (runtime !== undefined && runtimeBudget > 0) allocation.set(runtime.sourceInstanceKey, { mode: 'eager', maxCharacters: runtimeBudget })
    if (documents !== undefined && documentsBudget > 0) allocation.set(documents.sourceInstanceKey, { mode: 'routed', maxCharacters: documentsBudget })
    if (memorySpaces !== undefined && memorySpacesBudget > 0) allocation.set(memorySpaces.sourceInstanceKey, { mode: 'routed', maxCharacters: memorySpacesBudget })
    return {
      strategyTypeId: 'default-three-tier',
      guidance: {
        ...(classicSources ? recall ? { routing: ROUTING_GUIDANCE, reminders: THREE_TIER_REMINDERS } : { routing: ROUTING_GUIDANCE_WITHOUT_RECALL, reminders: THREE_TIER_REMINDERS_WITHOUT_RECALL } : {}),
        ...(runtime?.sourceTypeId === 'runtime' && runtime.capabilities.includes('project') ? { system: boundedRuntimeMemoryProtocol({ recall, archive }) } : {}),
      },
      sources: selected.map(source => ({
        sourceInstanceKey: source.sourceInstanceKey,
        required: false,
        ...(allocation.get(source.sourceInstanceKey) === undefined ? {} : { projection: allocation.get(source.sourceInstanceKey)! }),
        routeIds: source.routeIds.filter(route => route === 'inspect' || route === 'search' || route === 'recall' || route === 'related'),
        actionIds: [...source.actionIds],
      })),
      explanation: 'Project exact working context eagerly, expose bounded narrative and durable-evidence covers, then route reads through View-pinned grants.',
```

</details>

**依据 7 · 源码核查**：[src/host/guidance.ts:8-21](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/guidance.ts#L8-L21)

提示、View 和写入回执语义。

<details>
<summary>查看原文（14行）</summary>

```text
export const ROUTING_GUIDANCE = 'Use memory only when needed. Follow the current Mnemon View: use mnemon_view_route or mnemon_view_action only for offered ids. Installed tools do not imply an available Source. Never infer missing historical facts. An action offer is not authorization; a write exists only after its receipt.'

/** A View is an own-plugin message, never part of the shared context snapshot. */
export function withoutMemoryViewContext<T extends { contexts: Array<{ name: string; text: string }> }>(assembly: T): T {
  return { ...assembly, contexts: assembly.contexts.filter(context => context.name !== RUNTIME_MEMORY_CONTEXT_NAME) }
}

/** Inject trusted Strategy instructions after interpolation; Source text stays quoted in the Wake. */
export function applyMemoryViewGuidance<T extends { sections: Array<{ name: string; text: string }>; contexts: Array<{ name: string; text: string }> }>(assembly: T, view: ComposableMemoryView | undefined, routingEnabled = true): T {
  if (view === undefined) return withoutMemoryViewContext(assembly)
  const sections = assembly.sections.filter(section => ![GUIDANCE_SECTION_NAME, STRATEGY_SECTION_NAME, 'mnemon:runtime-memory-protocol'].includes(section.name))
  if (view.guidance?.system) sections.push({ name: STRATEGY_SECTION_NAME, text: view.guidance.system })
  if (routingEnabled) sections.push({ name: GUIDANCE_SECTION_NAME, text: view.guidance?.routing ?? ROUTING_GUIDANCE })
  return withoutMemoryViewContext({ ...assembly, sections })
```

</details>

**依据 8 · 源码核查**：[src/host/tools.ts:110-134](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/tools.ts#L110-L134)

按 View 提供的 route ID 执行读取。

<details>
<summary>查看原文（25行）</summary>

```text

type ToolHelpers = ReturnType<typeof toolHelpers>

/** The two generic View tools, which run whichever Route or Action of the turn's View a call names. */
function registerViewTools(ctx: HostContextShape, { runtimeFor, config, composableTurn }: ToolHelpers, coordinator: MnemonSubagentCoordinator): void {
  ctx.tools.register(definition({
    name: 'mnemon_view_route',
    description: 'Execute one exact Route offered in the current MNEMON VIEW ROUTES envelope. Use only ids present in that envelope; the Host binds the request to its hidden ReadGrant, enforces call/result/character budgets, and returns Evidence.',
    parameters: {
      type: 'object',
      properties: {
        routeId: { type: 'string', description: 'Exact View Route id.' },
        input: { type: 'object', additionalProperties: true, description: 'Route-specific JSON input described by the offered Route.' },
      },
      required: ['routeId', 'input'],
    },
    output: { schema: JSON_OBJECT_OUTPUT, render: (_args: unknown, value: unknown) => text(value),
      presentationMeta: memoryReadPresentation(undefined, 'view-route', 'routeId') },
    execute: async (args: { routeId: string; input: MemoryJsonValue }, exec: ToolExecution) => {
      const { manager, turn } = composableTurn(exec)
      // An id the View does not offer names only what the envelope shows (#390).
      const refusal = unofferedViewId(runtimeFor(exec), turn, 'route', args.routeId)
      if (refusal !== undefined) throw new Error(refusal)
      const evidence = await manager.executeRoute(turn.turnId, args.routeId, args.input, exec.signal)
      return evidence.output ?? evidence
```

</details>

**依据 9 · 源码核查**：[src/core/turns.ts:181-198](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L181-L198)

route 和 action 执行及授权回调。

<details>
<summary>查看原文（18行）</summary>

```text
  async executeRoute(turnId: string, routeId: string, input: MemoryJsonValue, signal?: AbortSignal): Promise<MemoryEvidence> {
    const stored = this.requireTurn(turnId)
    const operation = this.generations.acquire(stored.lease.id)
    try { return await operation.generation.executeRoute(stored.context.view, routeId, input, signal, DEFAULT_MEMORY_VIEW_BUDGET, stored.context) }
    finally { operation.release() }
  }

  async executeAction(
    turnId: string,
    offerId: string,
    input: MemoryJsonValue,
    authorize: (offer: MemoryActionOffer) => boolean | Promise<boolean>,
    signal?: AbortSignal,
  ): Promise<MemoryMutationReceipt> {
    const stored = this.requireTurn(turnId)
    const operation = this.generations.acquire(stored.lease.id)
    try { return await operation.generation.executeAction(stored.context.view, offerId, input, authorize, signal) }
    finally { operation.release() }
```

</details>

#### 缺口

- 目标 Host 是否实际运行以上链路及来源返回正确内容
  **影响**：决定检索和写入有效性
  **进一步探讨**：用虚构项目试验视图、读取证据与写入回执

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 作用域、可信性和数据残留风险是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

源码对固定 turn 的 scope 不匹配拒绝，对子视图限制存储和工作区；这不是事实真实性或跨所有 Provider 隔离的证明。策略在同一角色有多个可用来源时可能拒绝组合，来源或策略异常可能影响视图；读取不到并不等于历史不存在。作者声明关闭组件不删除数据、迁移位置不搬移；备份包含私有记忆，第三方 Provider 按其服务处理数据，Source 和 Strategy 为受信任的进程内代码而非沙箱。旧错误会在后续被重复引入，用户应核验出处并纠正。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/turns.ts:84-111](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L84-L111)

同一 turn scope 检查及 compose 异常释放。

<details>
<summary>查看原文（28行）</summary>

```text
  async beginTurn(turnId: string, scope: MemoryOperationScope, scenario = 'agent.root-turn', signal?: AbortSignal): Promise<ComposableMemoryTurn> {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    signal?.throwIfAborted()
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const existing = this.turns.get(id)
    const beginning = this.beginnings.get(id)
    const previousScope = existing?.context.scope ?? beginning?.scope
    if (previousScope !== undefined && (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => previousScope[key] !== scope[key])) {
      throw new Error('Composable Memory turn id is already bound to another scope')
    }
    if (existing !== undefined) return existing.context
    if (beginning !== undefined) return beginning.promise
    const lease = this.generations.acquire()
    const pending = { scope: { ...scope }, controller: new AbortController(), promise: undefined as unknown as Promise<ComposableMemoryTurn> }
    const abort = () => pending.controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    this.beginnings.set(id, pending)
    pending.promise = (async () => {
      try {
        const view = await lease.generation.compose({ scope: pending.scope, scenario, budget: { ...DEFAULT_MEMORY_VIEW_BUDGET } }, pending.controller.signal)
        pending.controller.signal.throwIfAborted()
        const context = Object.freeze({ turnId: id, view, scope: Object.freeze(pending.scope), startedAt: new Date().toISOString() })
        this.turns.set(id, { context, lease })
        return context
      } catch (error) {
        lease.release()
        throw error
```

</details>

**依据 2 · 源码核查**：[src/core/turns.ts:155-165](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L155-L165)

委托视图的存储和工作区约束。

<details>
<summary>查看原文（11行）</summary>

```text
  /** Each execution owns its own pin and budget while sharing immutable authority. */
  pinTurn(turnId: string, scope: MemoryOperationScope, viewId: string): ComposableMemoryTurn {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const view = this.get(viewId)
    if (view === undefined) throw new Error(`Composable Memory View is not pinned: ${viewId}`)
    if (view.scope.storage !== scope.storage || view.scope.workspaceId !== scope.workspaceId) throw new Error('Delegated View cannot change its storage scope')
    const existing = this.turns.get(id)
    if (existing !== undefined) {
      if (existing.context.view.id !== viewId || (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => existing.context.scope[key] !== scope[key])) throw new Error('Composable Memory turn authority changed while pinned')
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:7-15](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L7-L15)

多来源歧义拒绝。

```text
const VIEW_ROLES = ['working-context', 'narrative', 'durable-evidence'] as const

function soleSource(sources: readonly MemorySourceFacts[], role: typeof VIEW_ROLES[number]): MemorySourceFacts | undefined {
  const matches = sources
    .filter(source => source.role === role && source.availability !== 'unavailable')
    .sort((left, right) => left.sourceInstanceKey.localeCompare(right.sourceInstanceKey))
  if (matches.length > 1) throw new Error(`default-three-tier View Strategy found ambiguous ${role} Sources; select an explicit Strategy`)
  return matches[0]
}
```

**依据 4 · 作者声明**：[README.zh-CN.md:151-158](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L151-L158)

作者声明数据残留、备份和信任边界。

```text
## 数据与信任

- 运行时记忆与项目档案是本地文件，Mnemon Native 也在本地；第三方 Provider 使用各自的服务与作用域。
- 关闭组件不会删除其中的记忆，更换存储位置也不会搬移数据；需要迁移时使用 ZIP 备份。
- 技能管理的进化数据（建议、测试用例以及复盘读过的对话，机密已替换）保存在本地存储根目录，不在备份之内。来自市场的技能会被 Agent 按原文执行，安装前请先预览。
- Git 同步把同一份 Mnemon Pack 载荷以可读文件发布到你自己的仓库，另一台机器可以拉取；可以**立即同步**、在写入前**检查远端**，或按间隔**自动同步**。两台设备对同一主题写法不同时，两种写法都会保留，直到你接受并执行**记忆整理**给出的方案，见 [Git 仓库同步](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/zh-CN/guides/operations.md#git-仓库同步)。
- 已保存的 Provider 凭据只留在宿主上，不会被导出；但备份仍包含私有记忆，请妥善保护。
- Source 与 Strategy 是受信任的进程内 JavaScript，**不是沙箱代码**；历史记忆永远不会凌驾于当前指令之上。
```

#### 缺口

- Provider 实际隔离、事实正确性及备份生命周期
  **影响**：影响隐私和错误传播
  **进一步探讨**：在虚构数据上分别验证作用域、删除与恢复

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 成本和可验证改进假设？

**研究主题**：效果与总成本、新假设与验证

#### 完整回答

投入包括维护和纠正记忆、管理存储与备份、审阅第三方 Provider，模型上下文和远程服务也可能产生成本。没有本次固定任务的召回准确率、答题质量、耗时和 token 对照，不可宣称节约或提高准确率。假设对高频注入事实展示最近核验时间和来源并提示过期，可降低过期事实引用；会增加标注与审阅成本。比较同一组跨会话虚构任务中的过期引用率和核验时间，若错误率未降或维护负担过高则否定。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh-CN.md:68-76](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L68-L76)

作者说明三层进入上下文方式。

```text
## 三类记忆

| 记忆 | 适合保存 | 如何进入 Agent 上下文 |
|---|---|---|
| **运行时记忆** | 偏好、协作约定、下一轮就需要的事实 | 每轮以紧凑的 USER.md 与 MEMORY.md 注入 |
| **项目档案** | 设计、调查、流程与交接材料 | 先检索，相关时再阅读全文 |
| **记忆空间** | 长期事实、决策、实体及其关系 | 按需从已启用的 Provider 召回 |

默认的**分层策略**让运行时记忆常驻，另外两类按需读取；**通用策略**在同一份预算内提供全部可用来源，由模型决定如何使用。**记忆空间**是由 Provider 承载、可以独立命名和激活的长期证据范围，英文界面称 memory space。
```

**依据 2 · 源码核查**：[src/core/turns.ts:102-107](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L102-L107)

每回合构造并固定视图。

```text
    pending.promise = (async () => {
      try {
        const view = await lease.generation.compose({ scope: pending.scope, scenario, budget: { ...DEFAULT_MEMORY_VIEW_BUDGET } }, pending.controller.signal)
        pending.controller.signal.throwIfAborted()
        const context = Object.freeze({ turnId: id, view, scope: Object.freeze(pending.scope), startedAt: new Date().toISOString() })
        this.turns.set(id, { context, lease })
```

**依据 3 · 作者声明**：[README.zh-CN.md:151-157](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L151-L157)

存储、备份和同步边界。

```text
## 数据与信任

- 运行时记忆与项目档案是本地文件，Mnemon Native 也在本地；第三方 Provider 使用各自的服务与作用域。
- 关闭组件不会删除其中的记忆，更换存储位置也不会搬移数据；需要迁移时使用 ZIP 备份。
- 技能管理的进化数据（建议、测试用例以及复盘读过的对话，机密已替换）保存在本地存储根目录，不在备份之内。来自市场的技能会被 Agent 按原文执行，安装前请先预览。
- Git 同步把同一份 Mnemon Pack 载荷以可读文件发布到你自己的仓库，另一台机器可以拉取；可以**立即同步**、在写入前**检查远端**，或按间隔**自动同步**。两台设备对同一主题写法不同时，两种写法都会保留，直到你接受并执行**记忆整理**给出的方案，见 [Git 仓库同步](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/zh-CN/guides/operations.md#git-仓库同步)。
- 已保存的 Provider 凭据只留在宿主上，不会被导出；但备份仍包含私有记忆，请妥善保护。
```

#### 缺口

- 实际检索命中率、token 和维护耗时
  **影响**：不能量化效益
  **进一步探讨**：同任务对照手工文件与该插件并记录指标

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何试用及退出？

**研究主题**：采用判断

#### 完整回答

已有 DSH 且能维护资料的用户可在独立本地存储和虚构项目试用：验证工作区隔离、记录一条事实、检查读取证据及写入回执，再测试禁用来源后的表现。相较手工 MEMORY 文件，其优势是固定来源视图和按需读写，但召回与写入不保证答案正确。若发现跨项目串记忆、旧错误持续注入或成本不可控，应关闭相关来源并回到手工文件，同时单独核查底层数据和备份；关闭不等于删除。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/turns.ts:84-111](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/core/turns.ts#L84-L111)

视图作用域与生命周期。

<details>
<summary>查看原文（28行）</summary>

```text
  async beginTurn(turnId: string, scope: MemoryOperationScope, scenario = 'agent.root-turn', signal?: AbortSignal): Promise<ComposableMemoryTurn> {
    if (this.closed) throw new Error('Composable Memory turn manager is disposed')
    signal?.throwIfAborted()
    const id = turnId.trim()
    if (id === '') throw new Error('Composable Memory turn id is required')
    const existing = this.turns.get(id)
    const beginning = this.beginnings.get(id)
    const previousScope = existing?.context.scope ?? beginning?.scope
    if (previousScope !== undefined && (['storage', 'workspaceId', 'sessionId', 'agentId'] as const).some(key => previousScope[key] !== scope[key])) {
      throw new Error('Composable Memory turn id is already bound to another scope')
    }
    if (existing !== undefined) return existing.context
    if (beginning !== undefined) return beginning.promise
    const lease = this.generations.acquire()
    const pending = { scope: { ...scope }, controller: new AbortController(), promise: undefined as unknown as Promise<ComposableMemoryTurn> }
    const abort = () => pending.controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    this.beginnings.set(id, pending)
    pending.promise = (async () => {
      try {
        const view = await lease.generation.compose({ scope: pending.scope, scenario, budget: { ...DEFAULT_MEMORY_VIEW_BUDGET } }, pending.controller.signal)
        pending.controller.signal.throwIfAborted()
        const context = Object.freeze({ turnId: id, view, scope: Object.freeze(pending.scope), startedAt: new Date().toISOString() })
        this.turns.set(id, { context, lease })
        return context
      } catch (error) {
        lease.release()
        throw error
```

</details>

**依据 2 · 源码核查**：[src/host/guidance.ts:5-8](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/src/host/guidance.ts#L5-L8)

指导说明 offer 和 receipt。

```text
export const GUIDANCE_SECTION_NAME = 'mnemon:routing'
export const RUNTIME_MEMORY_CONTEXT_NAME = 'mnemon:runtime-memory'
export const STRATEGY_SECTION_NAME = 'mnemon:strategy'
export const ROUTING_GUIDANCE = 'Use memory only when needed. Follow the current Mnemon View: use mnemon_view_route or mnemon_view_action only for offered ids. Installed tools do not imply an available Source. Never infer missing historical facts. An action offer is not authorization; a write exists only after its receipt.'
```

**依据 3 · 作者声明**：[README.zh-CN.md:151-158](https://github.com/omdsh-dev/dsh-mnemon/blob/7cbdefc64c019a073cfdb493b0b516b5b7177bb6/README.zh-CN.md#L151-L158)

作者说明关闭、备份及信任边界。

```text
## 数据与信任

- 运行时记忆与项目档案是本地文件，Mnemon Native 也在本地；第三方 Provider 使用各自的服务与作用域。
- 关闭组件不会删除其中的记忆，更换存储位置也不会搬移数据；需要迁移时使用 ZIP 备份。
- 技能管理的进化数据（建议、测试用例以及复盘读过的对话，机密已替换）保存在本地存储根目录，不在备份之内。来自市场的技能会被 Agent 按原文执行，安装前请先预览。
- Git 同步把同一份 Mnemon Pack 载荷以可读文件发布到你自己的仓库，另一台机器可以拉取；可以**立即同步**、在写入前**检查远端**，或按间隔**自动同步**。两台设备对同一主题写法不同时，两种写法都会保留，直到你接受并执行**记忆整理**给出的方案，见 [Git 仓库同步](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/zh-CN/guides/operations.md#git-仓库同步)。
- 已保存的 Provider 凭据只留在宿主上，不会被导出；但备份仍包含私有记忆，请妥善保护。
- Source 与 Strategy 是受信任的进程内 JavaScript，**不是沙箱代码**；历史记忆永远不会凌驾于当前指令之上。
```

#### 缺口

- 用户的具体范围配置、存储与 Provider
  **影响**：决定实际隔离和退出清理
  **进一步探讨**：使用无敏感虚构数据实测与清查

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
