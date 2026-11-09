# dsh-mnemon

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

源码版本：[e9da7d1](https://github.com/omdsh-dev/dsh-mnemon/tree/e9da7d1d717737defc088ac9afd32c4ca99ff9ef)

<!-- BEGIN META -->
[![GitHub ★ 922](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=922&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/omdsh-dev/dsh-mnemon) [![npm 30d 105,336](https://img.shields.io/static/v1?label=npm+30d&message=105%2C336&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-mnemon)
<!-- END META -->

> **功能**：为 DSH 提供可组合的分层记忆、按回合固定的视图及受控读写。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相对手工附加上下文，Starter 让常用偏好和按需证据共享回合级组合入口。根 Host 接 DSH 生命周期并固定 View，具体来源和 Provider 分包实现。

> **主要限制**：[Q03](#research-q03) 固定 View 和 ReadGrant 约束单回合调用。默认全局存储下，两个工作区可能共享数据。无记忆回合、检索预算耗尽和未提交写入都有不同表现，用户需要对照来源及凭据核验。

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
  - [Q01 · 哪类任务适合让插件管理分层记忆？](#detail-section-11)
  - [Q02 · 一次正常对话如何确定并使用固定的记忆视图？](#detail-section-12)
  - [Q03 · 范围、路由拒绝和记录留存各保护什么？](#detail-section-13)
  - [Q04 · 启动、模型与存储成本由谁承担？](#detail-section-14)
  - [Q05 · 怎样检验记忆复用能否减少人工且避免串项目？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：反复使用 DSH 处理同一项目的用户，希望跨会话重用短偏好、项目资料和旧决策，并能核对来源、存储范围及写入结果。[Q01](#research-q01)

用户可手工维护项目说明并在新会话提供相关段落。简单项目接入成本低，重复资料选择和版本核对由人承担。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 分层记忆视图 | 为回合组合常驻和按需信息 | 策略、来源与范围显式配置，默认存储可共享 |
| 模型读写 | 召回证据、维护 Runtime | 受来源、预算和授权限制，复核提交凭据 |
| 用户命令 | 查看状态和直接管理 | 手工入口的策略需单独核对 |
| 备份与同步 | 保留或迁移数据 | 作者区分 ZIP、Git 与完整本地备份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容的 DSH、Node 和宿主工具等服务 | 根入口必需 | 加载 bundle 与 Agent 生命周期 | 核对当前版本和加载状态 |
| 主策略、已启用来源与数据目录 | 分层复用需要 | 组成固定 View 和保存数据 | 回合可能没有记忆 |
| 工作区存储与显式隔离目录 | 本轮试用需要 | 核对跨项目边界 | 停止写入，重新选择范围 |
| 第三方 Provider、嵌入、Git | 对应功能需要 | 远程召回、向量或同步 | 首轮可只用本地功能 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备两项目 | 操作者选择独立工作区存储，放两条互斥虚构决策 | 确认两个实际目录和当前来源 |
| 开新会话 | 操作者执行相同问题，检查常驻、按需和外部空间 | 能回指原始记录并拒绝越界 |
| 试一次写入 | 选授权来源并复核 receipt | 只有 committed 且源记录一致才计成功 |
| 停用并清点 | 操作者退回项目说明，核对数据和备份 | 不把插件停用当作数据删除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | DSH 运行环境和本地存储 | 配置策略、工作区和来源 | 实际安装耗时未知 |
| 持续 | 上下文 token、磁盘、可选远程服务 | 维护、核对来源和修正旧资料 | 净节省未测 |
| 失败恢复 | 备份、潜在重查和模型调用 | 分辨范围、预算、未提交和资料错误 | 恢复时间未知 |
| 退出 | 保留所需备份及历史记录 | 停用并清点本地、备份、远程副本 | 各后端的删除能力未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 跨会话偏好和证据 | Runtime 常驻、文档和长期空间按需 | 实际召回质量与节省时间 |
| 回合级权限 | 固定 ReadGrant，按预算限制来源读 | 全部 Provider 及项目实际隔离 |
| 写入验收 | 区分授权、候选、未知与提交凭据 | 全部来源的持久化及恢复表现 |

> **思考**：[Q03](#research-q03) 固定 View 和 ReadGrant 约束单回合调用。默认全局存储下，两个工作区可能共享数据。无记忆回合、检索预算耗尽和未提交写入都有不同表现，用户需要对照来源及凭据核验。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 相对手工附加上下文，Starter 让常用偏好和按需证据共享回合级组合入口。根 Host 接 DSH 生命周期并固定 View，具体来源和 Provider 分包实现。

[Q02](#research-q02) 回合租住 generation，读检查 route 与 ReadGrant 并计预算，写在固定 offer 上重新授权。[Q03](#research-q03) 视图范围与物理存储边界由不同配置和代码决定。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 固定 View 和 ReadGrant 约束单回合调用。默认全局存储下，两个工作区可能共享数据。无记忆回合、检索预算耗尽和未提交写入都有不同表现，用户需要对照来源及凭据核验。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在两个隔离工作区用虚构资料比较现有项目说明。先禁外部来源及 Git，同步记录 View、授权、证据与提交。出现串项目、未提交结果被报成功或目录不明时停止自动写入并人工核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持回合视图、读取边界和写入凭据。默认全局数据图需与回合 scope 区分。工作区隔离、真实召回质量和人工节省未实测。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/host/plugin.ts、src/host/lifecycle.ts、src/host/memory-executions.ts、src/core/turns.ts、src/core/composition.ts、plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts、src/host/tools.ts、src/host/subagent.ts、src/host/config.ts、src/host/runtime.ts、src/host/agent-memory-turn.ts、plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts、docs/en/guides/operations.md、package.json、src/host/commands.ts、src/host/guidance.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 Host、Starter 和默认三层策略，按代表性模型读写复核原 findings。未运行目标，未审计第三方 Provider、技能演化或 Git 同步全路径。
- 下一步：[Q05](#research-q05) 双工作区合成事实对照手工说明，记录当前 View、被拒来源、写凭据、词元和人工。用有意产生的过期事实比较是否添加来源及复核日期。

**分析版本**

- **仓库**：[omdsh-dev/dsh-mnemon](https://github.com/omdsh-dev/dsh-mnemon)
- **版本号**：0.5.43（[固定提交 e9da7d1](https://github.com/omdsh-dev/dsh-mnemon/tree/e9da7d1d717737defc088ac9afd32c4ca99ff9ef)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 给高频决策附原始来源及最近核验时间，并在用户验收步骤检查，可能减少过期引用。用同一问题集比较陈旧引用、上下文 token 和人工核对。

[Q05](#research-q05) 双工作区合成事实对照手工说明，记录当前 View、被拒来源、写凭据、词元和人工。用有意产生的过期事实比较是否添加来源及复核日期。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 669 | 42367 | — | — | 879616 |
| .mjs | source | 61 | 6615 | 5959 | 456 | — |
| .mts | source | 2 | 253 | 207 | 28 | — |
| .ts | source | 311 | 50166 | 41754 | 4978 | — |
| .js | source | 4 | 67 | 60 | 7 | — |
| .ts | test | 223 | 47147 | 42454 | 1506 | — |
| .tsx | source | 73 | 13480 | 11408 | 1266 | — |
| .tsx | test | 32 | 13076 | 11666 | 471 | — |
| .mjs | example | 36 | 4508 | 4042 | 337 | — |
| .cjs | example | 2 | 30 | 22 | 7 | — |
| .ts | example | 17 | 1097 | 1012 | 40 | — |
| .tsx | example | 2 | 181 | 167 | 6 | — |
| .mjs | test | 16 | 1946 | 1725 | 116 | — |
| .md | example | 4 | 40 | — | — | 217 |

</details>

**活跃度**

[![Issue 未关闭 24](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=24&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 88](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=88&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 70](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=70&color=737b86&logo=github)](https://github.com/omdsh-dev/dsh-mnemon/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH 用户怎样跨会话使用经核实的记忆，并确认工作区范围、上下文预算和写入结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类任务适合让插件管理分层记忆？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

常在 DSH 为同一项目开新会话、重复说明偏好和查旧决策的人，可把短偏好放 Runtime，把文档和长期事实分别交给对应来源。验收应能在新会话获得正确偏好和可人工追溯的决策，并拒绝另一项目的资料。手工维护项目说明能降低接入成本，但通常需要操作者挑选材料与再次提供。Starter 补丁实际挂 Host、运行时来源、文档、Memory Spaces 和默认三层策略。根 Host 提供组合和工具接线，独立来源及 Provider 拥有记忆操作。Skills 实验来源的补丁明确不加入模型 View。偶发查询或小项目已有一页准确说明时，手工入口可作为低摩擦基线。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-75](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/README.md#L67-L75)

作者区分常驻工作记忆、按需文档和长期空间。

```text
## Three kinds of memory

| Memory | Keep here | How it reaches the Agent |
|---|---|---|
| **Runtime memory** | Preferences, working agreements, facts needed on the next turn | Injected every turn as compact USER.md and MEMORY.md |
| **Project Documents** | Designs, investigations, procedures and handoffs | Searched first, then read when relevant |
| **Memory Spaces** | Durable facts, decisions, entities and their relationships | Recalled on demand from the enabled Providers |

The default **Layered strategy** keeps runtime memory resident and reads the other two on demand. The **General strategy** offers every available source within one budget and lets the model decide how to use each. A **memory space** is one named, Provider-backed scope for long-term evidence; the Chinese product term is 记忆空间.
```

**依据 2 · 源码核查**：[cordis.patch.yml:21-38](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/cordis.patch.yml#L21-L38)

根入口启用生命周期、引导、写入及受限远程入口。

<details>
<summary>查看原文（18行）</summary>

```text
        - id: mnemon
          # Core/Host and default settings. Sources own their independent Entries.
          name: dsh-mnemon
          config:
            routingGuidance: true
            lifecycleEnabled: true
            recallMode: guided
            writebackMode: guided
            idleReviewMs: 30000
            tabEnabled: true
            writeEnabled: true
            remoteAccess: read-only
            timeoutMs: 10000
            defaultRecallLimit: 10
            embedding:
              enabled: false
              endpoint: http://localhost:11434
              model: nomic-embed-text
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:47-60](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/cordis.patch.yml#L47-L60)

补丁加载来源并列出默认 Native 等 Provider。

<details>
<summary>查看原文（14行）</summary>

```text
        - id: mnemon-source-runtime
          name: dsh-mnemon-source-runtime
        - id: mnemon-source-documents
          name: dsh-mnemon-source-documents
        - id: mnemon-source-memory-spaces
          name: dsh-mnemon-source-memory-spaces
          config:
            # Every default Provider is an
            # explicit child. A custom parent composition may choose a subset.
            providers:
              - use: dsh-mnemon-provider-mnemon-native
                instanceId: mnemon-native
              - use: dsh-mnemon-provider-openviking
                instanceId: openviking
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:75-89](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/cordis.patch.yml#L75-L89)

独立 Skills 以及默认和可选策略的启用关系。

<details>
<summary>查看原文（15行）</summary>

```text
        # Skills keep DSH's own files and their evolution data; the page lives
        # in the Memory System and nothing joins a model View.
        - id: mnemon-source-skills
          name: dsh-mnemon-source-skills
        - id: mnemon-strategy-default-three-tier
          name: dsh-mnemon-strategy-default-three-tier
        # A second main Strategy; memoryView.strategyTypeId selects which one
        # composes the View. It stays off until selected.
        - id: mnemon-strategy-general
          name: dsh-mnemon-strategy-general
          disabled: true
        # v0.5 ships these narrowly scoped enhancements with the Starter so the
        # Settings switches are always available. They remain opt-in.
        - id: mnemon-strategy-auto-capture
          name: dsh-mnemon-strategy-auto-capture
```

</details>

#### 缺口

- 无真实团队的重复工作和交付记录。
  **影响**：无法确定人工基线和插件的净收益。
  **进一步探讨**：以同一批跨会话问题对照，计量验证和纠错时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 一次正常对话如何确定并使用固定的记忆视图？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

根入口导出 apply。Host 的生命周期接现有或新 Agent，监听提示装配和 pre-step。提示装配准备当前回合，若中间件跳过该钩子，接受的 pre-step 也会准备并形成 Wake。执行槽从 Agent 会话 cwd 与配置推导 scope，Core 为正常 root turn 租用当前 generation。Core 先按权限筛掉来源能力、route 和 action，然后两次调用策略检查确定性并规范化。三层策略在 runtime 可投影时给它 90% 的字符预算（下取整及最少 1），其余可投影来源按需；Core 进行有预算的投影并冻结 View。`mnemon_recall` 注册后仍需来源参与并要求当前 View；协调器绑定回合执行，Core 核对 route 与 ReadGrant、限制每次和累计调用，并调用 Source。默认策略从 grant 取可选空间，越范围请求拒绝；相同已接纳的查询可回放，超预算的新查询明确未执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1-1](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/index.ts#L1-L1)

发布入口导出根 Host apply。

```text
export { name, inject, provide, Config, apply } from './host/plugin.ts'
```

**依据 2 · 源码核查**：[src/host/plugin.ts:179-192](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/plugin.ts#L179-L192)

apply 实际启动生命周期并挂工具和命令。

<details>
<summary>查看原文（14行）</summary>

```text
    const stop = lifecycle.start()
    return async () => {
      stop()
      skills.dispose()
      await coordinator.dispose()
      runtime.dispose()
    }
  }, 'dsh-mnemon.lifecycle-root()')
  ctx.effect(() => {
    const loader = ctx.get('loader') as { await?(): Promise<unknown> } | undefined
    return registerTools(ctx, runtime, coordinator, extensions, loader?.await?.())
  }, 'dsh-mnemon: Source tool lifecycle')
  registerCommands(ctx.commands, runtime, coordinator)
  registerGuidance(ctx, resolved)
```

</details>

**依据 3 · 源码核查**：[src/host/lifecycle.ts:847-858](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/lifecycle.ts#L847-L858)

监听创建事件并接入已有 Agent。

<details>
<summary>查看原文（12行）</summary>

```text
  start(): () => void {
    // DSH creates a new Agent for startup, resume, clear and compaction alike.
    const stopChanged = this.runtimeSource?.onChanged?.(() => {
      for (const { lifecycle } of this.owners.values()) lifecycle.configurationChanged()
    })
    const stopCreated = this.ctx.on('agent/created', (({ agent, source }: SessionStartPayload) => { this.install(agent, source) }) as never)
    for (const agent of rootAgents(this.ctx.agents, this.ctx.subagents)) this.install(agent, 'adopted')
    return () => {
      stopChanged?.()
      stopCreated()
      for (const dispose of [...this.children.values()].reverse()) dispose()
      for (const owner of [...this.owners.values()].reverse()) owner.dispose()
```

</details>

**依据 4 · 源码核查**：[src/host/lifecycle.ts:356-373](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/lifecycle.ts#L356-L373)

pre-step 接受后备选准备 View 并规划 Wake。

<details>
<summary>查看原文（18行）</summary>

```text
  private async preStep(payload: PreStepPayload, next: () => Promise<HostPreStepDecision>): Promise<HostPreStepDecision> {
    this.pendingSnapshot = undefined
    if (payload.step === 1) this.cancelIdleReview(true)
    const decision = await next()
    if (decision.kind === 'reject' || payload.signal.aborted) {
      this.releaseView(payload.turn)
      return decision
    }
    // Prompt middleware can return its assembly without visiting later hooks,
    // or Mnemon can load while that waterfall is already running. The accepted
    // Agent step still needs its own durable turn's View before tools or Wake.
    if (!this.disposed && openAgentTurn(this.agent) === payload.turn) await this.memoryTurn?.begin(payload.turn, payload.signal)
    // Retirement is independent of injection gates: a disabled/absent View or
    // changed authority must not leave old snapshots in an accepted request.
    const update = prepareMemorySnapshot(this.agent.session,
      this.config.lifecycleEnabled ? this.memoryWake()?.text : undefined,
      this.config.lifecycleEnabled ? memorySnapshotState(this.memoryTurn?.current?.context.view) : undefined)
    this.pendingSnapshot = { turn: payload.turn, step: payload.step, signal: payload.signal, update }
```

</details>

**依据 5 · 源码核查**：[src/host/lifecycle.ts:405-418](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/lifecycle.ts#L405-L418)

提示装配前 begin，随后按 View 提供引导。

<details>
<summary>查看原文（14行）</summary>

```text
  private async assemblePrompt(assembly: PromptAssembly, context: PromptAssemblyContext, next: () => Promise<PromptAssembly>): Promise<PromptAssembly> {
    if (context.agent !== undefined && context.agent.id !== this.agent.id) return next()
    const turn = openAgentTurn(this.agent)
    if (turn === undefined) return next()
    // Cancel idle work before prompt assembly; the execution owner drains it.
    this.cancelIdleReview(true)
    if (context.signal?.aborted === true || openAgentTurn(this.agent) !== turn) return next()
    await this.memoryTurn?.begin(turn, context.signal)
    const assembled = await next()
    return applyMemoryViewGuidance(assembled, this.memoryTurn?.current?.context.view, this.config.routingGuidance)
  }

  private releaseView(turn?: number): void {
    this.memoryTurn?.end(turn)
```

</details>

**依据 6 · 源码核查**：[src/host/memory-executions.ts:119-137](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/memory-executions.ts#L119-L137)

执行槽绑定 Agent、scope、graph 与 Core turn。

<details>
<summary>查看原文（19行）</summary>

```text
      await previous?.done
      slot.controller.signal.throwIfAborted()
      this.assertOpen()
      const graph = delegation?.graph ?? (independent ? this.runtime.forAgent(agent, { independent: true }) : this.runtime.forAgent(agent))
      const manager = graph.composableTurns
      const scope = delegation === undefined ? agentScope(agent, graph.config)
        : { ...delegation.scope, sessionId: agent.id, agentId: agent.id }
      const releaseRuntime = delegation === undefined ? this.runtime.bindAgentRuntime(agent.id, graph) : undefined
      let context: ComposableMemoryTurn | undefined
      const release = () => {
        try { if (context !== undefined && manager.turn(context.turnId) === context) manager.endTurn(context.turnId) }
        finally { releaseRuntime?.() }
      }
      try {
        context = delegation?.viewId === undefined
          ? await manager.beginTurn(turnId, scope, purpose, slot.controller.signal)
          : manager.pinTurn(turnId, scope, delegation.viewId)
        slot.controller.signal.throwIfAborted()
        execution = { graph, context, release }
```

</details>

**依据 7 · 源码核查**：[src/core/turns.ts:89-107](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/turns.ts#L89-L107)

同 ID 的 scope 必须一致，持有 generation 租约。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 8 · 源码核查**：[src/core/composition.ts:613-642](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L613-L642)

来源能力过滤，策略确定性检查及规范化。

<details>
<summary>查看原文（30行）</summary>

```text
    const entries = await Promise.all([...this.sources.values()].map(async source => {
      const value = structuredClone(await this.sourceFacts(source, request, diagnostics, signal))
      const permissions = this.permissions.get(source.installed.instanceKey)
      if (permissions !== undefined) {
        value.capabilities = value.capabilities.filter(capability => permissions.includes(capability))
        value.routeIds = value.routeIds.filter(id => source.installed.definition.manifest.routes?.some(route => route.id === id && permissions.includes(route.capability)))
        value.actionIds = value.actionIds.filter(id => source.installed.definition.manifest.actions?.some(action => action.id === id && permissions.includes(action.capability)))
        if (value.capabilities.length === 0) value.availability = 'unavailable'
      }
      const manifest = source.installed.definition.manifest
      const routes = (manifest.routes ?? []).filter(route => value.availability !== 'unavailable' && value.routeIds.includes(route.id) && value.capabilities.includes(route.capability))
      const actions = (manifest.actions ?? []).filter(action => value.availability !== 'unavailable' && value.actionIds.includes(action.id) && value.capabilities.includes(action.capability))
      const descriptor: MemoryAvailableSource = { ...value, routes, actions, routeIds: routes.map(route => route.id), actionIds: actions.map(action => action.id) }
      return [source.installed.instanceKey, descriptor] as const
    }))
    signal.throwIfAborted()
    const facts = new Map(entries)
    const factsList = deepFreeze([...facts.values()].map(value => jsonClone(value, 'memory Source facts')))
    const contributions = this.strategyContributions(request, factsList)
    const replayedContributions = this.strategyContributions(request, factsList)
    if (canonicalMemoryJson(contributions) !== canonicalMemoryJson(replayedContributions)) {
      throw new Error(`memory Strategy extensions are not deterministic: ${this.extensions.map(extension => extension.instanceKey).join(', ')}`)
    }
    const proposed = this.strategy.definition.compose(request, factsList, contributions)
    const replayed = this.strategy.definition.compose(request, factsList, replayedContributions)
    if (canonicalMemoryJson(proposed, 'memory ViewSpec') !== canonicalMemoryJson(replayed, 'replayed memory ViewSpec')) {
      throw new Error(`memory Strategy is not deterministic: ${this.strategy.instanceKey}`)
    }
    let spec: MemoryViewSpec
    try { spec = normalizeViewSpec(proposed, this.strategy, facts, request.budget) }
```

</details>

**依据 9 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts:103-125](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/plugins/dsh-mnemon-strategy-default-three-tier/src/strategy.ts#L103-L125)

三层分配常驻与按需投影及允许 route。

<details>
<summary>查看原文（23行）</summary>

```text
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
```

</details>

**依据 10 · 源码核查**：[src/core/composition.ts:698-715](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L698-L715)

组合来源结果并冻结 View。

<details>
<summary>查看原文（18行）</summary>

```text
      runtimeGeneration: this.id,
      strategyInstanceKey: this.strategy.instanceKey,
      strategyTypeId: this.strategy.definition.manifest.typeId,
      ...(contributions.length === 0 ? {} : { strategyExtensions: contributions.map(({ value, ...identity }) => ({ ...identity, digest: digest(value) })) }),
      scope: request.scope,
      projection,
      ...(sourcePresentations.length === 0 ? {} : { sourcePresentations }),
      routes,
      readGrants: grants,
      actionOffers: actions,
      consistency,
      explanation: spec.explanation,
      ...(spec.guidance === undefined ? {} : { guidance: spec.guidance }),
      ...(allDiagnostics.length === 0 ? {} : { diagnostics: allDiagnostics.sort((a, b) =>
        (a.contributionInstanceKey ?? '').localeCompare(b.contributionInstanceKey ?? '') || a.code.localeCompare(b.code)) }),
    }
    const viewDigest = digest(body)
    return deepFreeze({ id: `view:${viewDigest}`, digest: viewDigest, createdAt: this.now().toISOString(), ...body })
```

</details>

**依据 11 · 源码核查**：[src/host/tools.ts:82-94](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/tools.ts#L82-L94)

来源挂载和 loader 就绪才发布相应工具。

<details>
<summary>查看原文（13行）</summary>

```text
  const reconcile = (snapshot: ReturnType<MemoryRuntime['contributionSnapshot']>) => {
    const types = new Set(snapshot.sources.map(source => source.definition.manifest.typeId))
    for (const tool of definitions) {
      const type = memoryTool(tool.name)?.sourceTypeId
      const available = type === undefined || (ready && types.has(type))
      if (!available) {
        registered.get(tool.name)?.()
        registered.delete(tool.name)
      } else if (!registered.has(tool.name)) {
        const dispose = ctx.tools.register(tool)
        if (typeof dispose !== 'function') throw new Error('dsh-mnemon tool registration did not return a disposer: ' + tool.name)
        registered.set(tool.name, dispose as () => unknown)
      }
```

</details>

**依据 12 · 源码核查**：[src/host/tools.ts:248-252](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/tools.ts#L248-L252)

命名召回执行确实要求固定 View。

```text
    async execute(args: { query: string; mode?: 'smart' | 'keyword' | 'basic'; limit?: number; memoryBodyIds?: string[] }, exec: ToolExecution) {
      requireSource(exec, 'memory-spaces', 'recall')
      const agent = requireAgent(exec)
      return coordinator.recall(agent, args, exec.signal, { requirePinnedView: true })
    },
```

**依据 13 · 源码核查**：[src/host/subagent.ts:435-452](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/subagent.ts#L435-L452)

协调器取执行槽并沿作用域路由到来源。

<details>
<summary>查看原文（18行）</summary>

```text
  private async readRoute(parent: HostAgent, typeId: string, routeId: string, input: unknown, signal: AbortSignal, required: boolean): Promise<MemoryEvidence> {
    signal.throwIfAborted()
    const graph = this.runtimeSource.forAgent(parent)
    if (required && graph.composableTurns.activeTurn(parent.id) === undefined) throw new Error('Recall requires the View pinned to the current turn')
    const execution = await this.runtimeSource.executions.workflow(parent, routeId, signal)
    try {
      const turn = execution.context
      const evidence = await execution.graph.source(typeId, turn.scope).forTurn(turn).route(routeId, input, execution.signal)
      // A read the Strategy did not run, past its turn budget or from an insight the turn never
      // admitted, is no recall (#389).
      if (typeId === 'memory-spaces' && ['recall', 'related'].includes(routeId) && optionalObject(evidence.output)?.notRun !== true) {
        const observed = this.observedReads.get(turn) ?? new Set<string>()
        if (!observed.has(evidence.id)) { this.recordRecall(); observed.add(evidence.id) }
        this.observedReads.set(turn, observed)
      }
      return evidence
    } catch (error) { this.counters.failures += 1; throw error }
    finally { execution.release() }
```

</details>

**依据 14 · 源码核查**：[src/core/composition.ts:818-832](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L818-L832)

当前 generation、route 与 ReadGrant 核验。

<details>
<summary>查看原文（15行）</summary>

```text
  async executeRoute(view: ComposableMemoryView, routeId: string, input: MemoryJsonValue, signal?: AbortSignal, budget: MemoryViewBudget = DEFAULT_MEMORY_VIEW_BUDGET, execution: object = view): Promise<MemoryEvidence> {
    this.assertOpen()
    if (view.runtimeGeneration !== this.id) throw new Error('memory View belongs to a different runtime generation')
    const route = view.routes.find(candidate => candidate.id === routeId)
    if (route === undefined) throw new Error(`memory View Route is unavailable: ${routeId}`)
    const grant = view.readGrants.find(candidate => candidate.id === route.readGrantId && candidate.sourceInstanceKey === route.sourceInstanceKey)
    if (grant === undefined) throw new Error(`memory View Route has no valid ReadGrant: ${routeId}`)
    assertInputSchema(route.inputSchema, input, 'memory Route input')
    const executionBudget = normalizeBudget(budget)
    const maxCharacters = Math.min(route.maxCharacters ?? executionBudget.maxEvidenceCharacters, executionBudget.maxEvidenceCharacters)
    const maxResults = Math.min(route.maxResults ?? executionBudget.maxEvidenceResults, executionBudget.maxEvidenceResults)
    const boundedRoute = deepFreeze({ ...route, maxCharacters, maxResults })
    signal?.throwIfAborted()
    const source = this.sources.get(route.sourceInstanceKey)
    if (source?.runtime.query === undefined) throw new Error(`memory Source cannot execute Route: ${route.sourceInstanceKey}`)
```

</details>

**依据 15 · 源码核查**：[src/core/composition.ts:843-864](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L843-L864)

按执行绑定读取预算，策略可决定是否执行读取。

<details>
<summary>查看原文（22行）</summary>

```text
      // Equal View digests do not make independent turns share execution state.
      let ledger = this.routeCalls.get(execution)
      if (ledger === undefined) { ledger = new Map(); this.routeCalls.set(execution, ledger) }
      const counter = `${view.id}\u0000${route.id}`
      const calls = ledger.get(counter) ?? 0
      if (calls >= route.maxCalls) throw new Error(`memory View Route call budget is exhausted: ${route.id}`)
      ledger.set(counter, calls + 1)
      // A dispatched failure consumed a call; Core never guesses safe retry.
      const value = await source.runtime.query!({
        view: this.sourceView(view, route.sourceInstanceKey, execution), route: selectedRoute, grant,
        input: jsonClone(selectedInput, 'memory Route input'), ...(signal === undefined ? {} : { signal }),
      })
      return normalizeEvidence(value, view, selectedRoute, executionBudget, this.now)
    }
    try {
      let policy = this.strategyTurns.get(execution)
      if (policy === undefined && this.strategy.definition.createTurn !== undefined) {
        policy = this.strategy.definition.createTurn(view)
        if (typeof policy?.query !== 'function') throw new Error('memory Strategy returned an invalid turn policy')
        this.strategyTurns.set(execution, policy)
      }
      const value = policy === undefined ? await read(input) : await policy.query({
```

</details>

**依据 16 · 源码核查**：[src/host/lifecycle.ts:456-472](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/lifecycle.ts#L456-L472)

step/start 只匹配同一会话和回合，turn/end 释放固定 View。

<details>
<summary>查看原文（17行）</summary>

```text
  private sessionEvent(session: HostAgent['session'], event: HostSessionEvent): void {
    if (session !== this.agent.session) return
    const turn = eventTurn(event)
    if (event.type === 'step/start') {
      const pending = this.pendingSnapshot
      if (pending === undefined || pending.turn !== turn || pending.step !== event.data.step) return
      this.pendingSnapshot = undefined
      this.queueSnapshotRetirement(pending)
      return
    }
    if (event.type !== 'turn/end') return
    if (this.pendingSnapshot?.turn === turn) this.pendingSnapshot = undefined
    const current = this.memoryTurn?.current
    const pinned = turn === undefined || current?.turn !== turn ? undefined : current
    if (pinned === undefined) return
    this.releaseView(turn)
  }
```

</details>

#### 缺口

- 没有 DSH 实际请求和 Provider 测试日志。
  **影响**：分配规则有代码，实际模型使用与服务表现未知。
  **进一步探讨**：记录当前 View、调用路径、命中来源和模型答复。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 范围、路由拒绝和记录留存各保护什么？

**研究主题**：缺陷与关键质疑

#### 完整回答

Agent 回合有独立范围和执行状态，但没有显式存储配置或旧目录时根默认是 global。在全局和自定义存储模式，不同 cwd 不必然获得不同数据图；选择工作区存储后缺 cwd 会拒绝。组合不可用的特定错误允许回合无记忆继续，不能把普通回复当作召回成功。默认策略从固定 ReadGrant 提取 Memory Space 范围，传未知空间 ID 会拒绝；同回合超预算的新查询返回 notRun。写工具要检查写权限、来源参与和固定 View，写入还需当前 offer 授权，确认结果应看 receipt 的 completion 而不是工具成功标题；accepted、candidate 或 unknown 不能当作 committed。记忆正文仍需对照原件核验，授权不判断事实真伪。作者明确停用组件不清除记忆，ZIP 也有范围边界；已有远程副本须另行清点。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/config.ts:385-393](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/config.ts#L385-L393)

未配置路径或包时默认全局，USER 范围可分开配置。

```text
  const legacyDataDir = optionalText(config.dataDir)
  const legacyPacks = resolveCustomPacks(config.customPacks, legacyDataDir)
  const requestedPackId = optionalText(config.customPackId)
  if (requestedPackId !== undefined && !CUSTOM_PACK_ID.test(requestedPackId)) throw new Error('dsh-mnemon: customPackId is invalid')
  const store = optionalText(config.store)
  const storageScope = config.storageScope ?? (legacyDataDir === undefined && legacyPacks.length === 0 ? 'global' : 'custom')
  if (!['global', 'workspace', 'custom', 'workspaces'].includes(storageScope)) throw new Error('dsh-mnemon: unsupported storageScope')
  const runtimeUserScope = config.runtimeUserScope ?? 'storage'
  if (runtimeUserScope !== 'storage' && runtimeUserScope !== 'global') throw new Error(`dsh-mnemon: unsupported Runtime USER.md scope: ${String(runtimeUserScope)}`)
```

**依据 2 · 源码核查**：[src/host/runtime.ts:268-281](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/runtime.ts#L268-L281)

复用固定图，非工作区模式返回当前图；工作区缺 cwd 时失败。

<details>
<summary>查看原文（14行）</summary>

```text
    this.assertOpen()
    // User continuation in old task history starts against current configuration;
    // a historical parent link must not borrow an unrelated retained generation.
    if (!options.independent) {
      const pinned = this.agentGraphs.get(agent.id)
      if (pinned !== undefined) return pinned.graph
      const parentSession = agent.session.header?.origin === 'subagent' ? agent.session.header.parentSession?.trim() : undefined
      const inherited = parentSession === undefined || parentSession === '' ? undefined : this.agentGraphs.get(parentSession)
      if (inherited !== undefined) return inherited.graph
    }
    if (!isWorkspaceStorageScope(this.current.config.storageScope)) return this.current
    const cwd = agent.session.header?.cwd?.trim()
    if (cwd === undefined || cwd === '') throw new Error('the current DSH session has no workspace for Mnemon')
    return this.forWorkspacePath(cwd)
```

</details>

**依据 3 · 源码核查**：[src/host/agent-memory-turn.ts:100-119](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/agent-memory-turn.ts#L100-L119)

特定组合不可用时本回合继续且无 View。

<details>
<summary>查看原文（20行）</summary>

```text
  async begin(turn: number, signal?: AbortSignal): Promise<void> {
    if (this.closed) throw new Error('memory Agent lifetime has ended')
    signal?.throwIfAborted()
    if (this.pinned?.turn === turn || this.unavailable?.turn === turn) return
    if (this.pending?.turn === turn) return this.pending.result
    this.end()
    const generation = this.generation
    const controller = new AbortController()
    const abort = () => controller.abort(signal!.reason)
    signal?.addEventListener('abort', abort, { once: true })
    const result = this.pin(turn, generation, controller.signal).catch((error: unknown) => {
      // Memory is optional for a conversation. With no composition serving,
      // the turn runs without a View: nothing revives a disabled policy, and
      // the turn itself does not fail. It stays that way until the turn ends.
      if (!isMemoryCompositionUnavailable(error) || this.closed || this.generation !== generation) throw error
      this.unavailable = { turn, reason: error.message }
      this.clearInspection()
      if (this.warned !== error.message) console.warn(`[dsh-mnemon] this turn runs without memory: ${error.message}`)
      this.warned = error.message
    })
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts:35-39](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts#L35-L39)

显式 ID 须落在固定来源。

```text
function scopeRecall(request: SearchRequest, authority: RecallAuthority): SearchRequest {
  const requested = [...new Set((request.memoryBodyIds ?? []).map(id => id.trim()).filter(Boolean))]
  if (requested.some(id => !authority.memoryBodyIds.includes(id))) throw new Error('Recall requested a Memory Space outside pinned Source ' + authority.viewId)
  return { ...request, memoryBodyIds: requested.length === 0 ? [...authority.memoryBodyIds] : requested }
}
```

**依据 5 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts:169-186](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts#L169-L186)

查询策略使用固定 grant 提取空间，进入 recall 或 related。

<details>
<summary>查看原文（18行）</summary>

```text
  constructor(private readonly view: ComposableMemoryView) {}
  async query(request: MemoryStrategyReadRequest, read: MemoryStrategyRead): Promise<MemoryEvidence> {
    const grant = this.view.readGrants.find(grant => grant.id === request.route.readGrantId && grant.sourceInstanceKey === request.route.sourceInstanceKey)!
    const input = object(request.input, 'three-tier read')
    if (grant.schema === 'dsh-mnemon.documents/v1' && request.route.sourceRouteId === 'search') return this.documents(request, read)
    if (grant.schema !== 'dsh-mnemon.memory-spaces/v1' || !['recall', 'related', 'inspect'].includes(request.route.sourceRouteId)) return read(request.input)
    if (request.route.sourceRouteId === 'inspect') {
      const evidence = await read(request.input)
      // Catalog is already bounded and sanitized by its Source. Never split JSON.
      return evidence.items.length === 1 ? { ...evidence, output: JSON.parse(evidence.items[0]!.text) as MemoryJsonValue } : evidence
    }
    const value = object(grant.value, 'Memory Spaces grant')
    if (!Array.isArray(value.memoryBodyIds) || value.memoryBodyIds.some(id => typeof id !== 'string')) throw new Error('Invalid Memory Spaces read scope')
    const authority = { viewId: this.view.id, sourceInstanceKey: request.route.sourceInstanceKey, memoryBodyIds: [...new Set(value.memoryBodyIds as string[])] }
    const signal = request.signal ?? new AbortController().signal
    const result = request.route.sourceRouteId === 'recall'
      ? await this.recall(input as unknown as SearchRequest, read, signal, authority)
      : await this.related(input.id as string, input.memoryBodyId as string | undefined, read, signal, authority, input)
```

</details>

**依据 6 · 源码核查**：[plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts:255-285](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/plugins/dsh-mnemon-strategy-default-three-tier/src/retrieval.ts#L255-L285)

相同请求重放、预算耗尽的新请求未执行。

<details>
<summary>查看原文（31行）</summary>

```text
    const scoped = scopeRecall(limited, authority)
    const digest = recallQueryDigest(scoped, authority.sourceInstanceKey)
    const retrieval = this.state
    const repeated = retrieval.recallAttempts.find(attempt => attempt.queryDigest === digest)
    if (repeated !== undefined) {
      const previous = repeated.result ?? await repeated.pending
      return {
        query: previous?.query ?? scoped.query,
        mode: previous?.mode ?? scoped.mode ?? 'smart',
        ...replayEvidence(previous, scoped.memoryBodyIds, authority.sourceInstanceKey),
        hint: retrieval.recallAttempts.length === MODEL_RECALL_ATTEMPT_LIMIT
          ? 'This Recall query already ran. The Host replayed its admitted evidence without another Provider query. The turn Recall budget is closed; stop retrieval and answer from the evidence or state what remains unknown.'
          : 'This Recall query already ran. The Host replayed its admitted evidence without another Provider query. If this evidence is insufficient, use at most one materially different focused query; otherwise stop retrieval.',
      }
    }
    if (retrieval.recallAttempts.length >= MODEL_RECALL_ATTEMPT_LIMIT) {
      // A query holding the budget can still fail and give its slot back, so a parallel call
      // waits for the queries in flight and asks again before it says the budget is spent.
      const inflight = retrieval.recallAttempts.flatMap(entry => entry.pending === undefined ? [] : [entry.pending])
      if (inflight.length > 0) {
        await Promise.allSettled(inflight)
        signal.throwIfAborted()
        return this.recall(request, read, signal, authority)
      }
      // Another query's evidence must never read as this one's answer (#389): a new
      // query past the budget runs nothing and returns nothing, and says so.
      return {
        query: scoped.query,
        mode: scoped.mode ?? 'smart',
        results: [],
        notRun: true,
```

</details>

**依据 7 · 源码核查**：[src/host/tools.ts:405-417](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/tools.ts#L405-L417)

命名 Runtime 写工具重核写开关、来源和回合。

<details>
<summary>查看原文（13行）</summary>

```text
    execute: (args: { action: 'add' | 'replace' | 'remove'; target: RuntimeMemoryTarget; content?: string; old_text?: string; importance?: RuntimeMemoryImportance; branches?: string[] }, exec: ToolExecution) => {
      if (!config.writeEnabled) throw new Error('dsh-mnemon is configured read-only (writeEnabled: false)')
      requireSource(exec, 'runtime', 'write')
      composableTurn(exec)
      const request = {
        action: args.action,
        target: args.target,
        ...(args.content === undefined ? {} : { content: args.content }),
        ...(args.old_text === undefined ? {} : { oldText: args.old_text }),
        ...(args.importance === undefined ? {} : { importance: args.importance }),
        ...(args.branches === undefined || (args.target === 'user' && Array.isArray(args.branches) && args.branches.length === 0) ? {} : { branches: args.branches }),
      }
      return coordinator.runtime(requireAgent(exec), request, exec.signal)
```

</details>

**依据 8 · 源码核查**：[src/host/subagent.ts:574-595](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/subagent.ts#L574-L595)

选择固定的写 offer，缺失或歧义时拒绝，返回完成凭据。

<details>
<summary>查看原文（22行）</summary>

```text
    const authority = this.turnAuthority(parent, false)
    if (authority !== undefined) {
      const lease = authority.graph.memoryComposition.acquire(authority.context.view.runtimeGeneration)
      const instances = lease.generation.sourceInstances().filter(source => source.sourceTypeId === 'runtime')
      lease.release()
      const offers = authority.context.view.actionOffers.filter(offer => offer.sourceActionId === 'mutate'
        && instances.some(source => source.sourceInstanceKey === offer.sourceInstanceKey))
      if (offers.length === 0) throw new Error('Source Action is not offered by the current View: runtime/mutate')
      // The tool runs the offer of the instance the View binds it to, the Starter instance's when a
      // profile mounts another runtime Source beside it (#397), and otherwise the only runtime
      // Source the View lets it write to, as a Scoped composition can make it. The others keep
      // their exact offers, which the View lists for mnemon_view_action.
      const bound = namedToolInstance(instances, 'runtime')
      const offer = offers.find(item => item.sourceInstanceKey === bound?.sourceInstanceKey) ?? (offers.length === 1 ? offers[0] : undefined)
      if (offer === undefined) {
        throw new Error('Several runtime Sources offer mutate and none is the Starter instance this tool writes to; use mnemon_view_action with one of: '
          + offers.map(item => item.id).join(', '))
      }
      const result = await this.viewAction(parent, authority, offer.id, request as unknown as MemoryJsonValue, signal)
      return { ...result.details as unknown as CoordinatedRuntimeMemoryResult,
        ...(result.revision === undefined ? {} : { revision: result.revision }),
        memoryReceipt: { status: result.status, completion: result.completion, ...(result.committedAt === undefined ? {} : { committedAt: result.committedAt }) } }
```

</details>

**依据 9 · 源码核查**：[src/core/composition.ts:884-908](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L884-L908)

执行前再核授权，核对完成类型和提交时间。

<details>
<summary>查看原文（25行）</summary>

```text
  async executeAction(view: ComposableMemoryView, offerId: string, input: MemoryJsonValue, authorize: (offer: MemoryActionOffer) => boolean | Promise<boolean>, signal?: AbortSignal, execution: object = view): Promise<MemoryMutationReceipt> {
    this.assertOpen()
    if (view.runtimeGeneration !== this.id) throw new Error('memory View belongs to a different runtime generation')
    const offer = view.actionOffers.find(candidate => candidate.id === offerId)
    if (offer === undefined) throw new Error(`memory ActionOffer is unavailable: ${offerId}`)
    assertInputSchema(offer.inputSchema, input, 'memory Action input')
    if (!await authorize(offer)) throw new Error(`memory ActionOffer is not currently authorized: ${offer.id}`)
    const source = this.sources.get(offer.sourceInstanceKey)
    if (source?.runtime.mutate === undefined) throw new Error(`memory Source cannot execute ActionOffer: ${offer.sourceInstanceKey}`)
    signal?.throwIfAborted()
    const grant = view.readGrants.find(candidate => candidate.sourceInstanceKey === offer.sourceInstanceKey)
    const receipt = await source.runtime.mutate({
      view: this.sourceView(view, offer.sourceInstanceKey, execution), offer,
      ...(grant === undefined ? {} : { grant }),
      input: jsonClone(input, 'memory Action input'), ...(signal === undefined ? {} : { signal }),
    })
    if (receipt.viewId !== view.id || receipt.offerId !== offer.id || receipt.sourceInstanceKey !== offer.sourceInstanceKey) {
      throw new Error('memory mutation Receipt is not bound to the requested ActionOffer')
    }
    if (!['succeeded', 'partial', 'failed', 'cancelled'].includes(receipt.status)) throw new Error('memory mutation Receipt has an invalid status')
    if (!['accepted', 'candidate', 'committed', 'partial', 'failed', 'unknown'].includes(receipt.completion)) throw new Error('memory mutation Receipt has an invalid completion')
    if (receipt.completion === 'committed') {
      if (receipt.status !== 'succeeded' || typeof receipt.committedAt !== 'string' || !Number.isFinite(Date.parse(receipt.committedAt))) throw new Error('committed memory Receipt requires successful status and an explicit commit timestamp')
    } else if (receipt.committedAt !== undefined) throw new Error('uncommitted memory Receipt cannot claim a commit timestamp')
    if (receipt.completion === 'failed' && receipt.status === 'succeeded') throw new Error('failed memory completion cannot have successful status')
```

</details>

**依据 10 · 作者声明**：[docs/en/guides/operations.md:225-232](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/docs/en/guides/operations.md#L225-L232)

作者说明整组停用不移除数据。

````text
The legacy `mnemon` Entry remains the lifecycle switch for the complete Starter. To disable Mnemon without leaving its Source or Strategy Entries waiting on the missing Host service, add this profile patch and restart DSH:

```yaml
- id: mnemon
  disabled: true
```

This disables the Core/Host, all three bundled Sources, both main Strategies, and all three optional Strategy enhancements together. It does not remove installed packages or delete memory data. Remove the override, or change it to `false`, and restart DSH to enable the Starter again.
````

**依据 11 · 源码核查**：[src/host/subagent.ts:633-647](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/subagent.ts#L633-L647)

Host 授权回调重新核对当前回合和两层写开关。

<details>
<summary>查看原文（15行）</summary>

```text
  private async viewAction(parent: HostAgent, authority: { graph: MnemonRuntimeGraph; context: ComposableMemoryTurn }, offerId: string, input: MemoryJsonValue, signal: AbortSignal): Promise<MemoryMutationReceipt> {
    input = JSON.parse(JSON.stringify(input)) as MemoryJsonValue
    const { graph, context: turn } = authority
    const lease = graph.memoryComposition.acquire(turn.view.runtimeGeneration)
    try {
      const offer = turn.view.actionOffers.find(candidate => candidate.id === offerId)
      const source = lease.generation.sourceInstances().find(candidate => candidate.sourceInstanceKey === offer?.sourceInstanceKey)
      const authorize = () => {
        if (graph.composableTurns.turn(turn.turnId) !== turn) throw new Error('Memory operation belongs to an ended turn')
        return graph.config.writeEnabled && this.runtimeSource.config.writeEnabled && offer?.authority === undefined
      }
      let receipt: MemoryMutationReceipt | undefined
      const commit = async () => {
        receipt = await graph.composableTurns.executeAction(turn.turnId, offerId, input, authorize, signal)
        return receipt.details as unknown as RuntimeMemoryMutationResult
```

</details>

#### 缺口

- 没有跨工作区实测或所有 Provider 的读写审计。
  **影响**：配置错误和第三方行为可能扩大实际数据暴露。
  **进一步探讨**：用隔离目录与可识别虚构事实测试允许项、越界、禁写和停用残留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 启动、模型与存储成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

根清单的 dsh-mnemon 0.5.43 依赖 Node >=20，声明两段 DSH 兼容区间；包的 DSH bundle 指向补丁，实际 apply 依赖 tools、settings、commands、agents、subagents，Web 服务为条件注入。Starter 可使用本地 Runtime 文件和 Native，默认 embedding 关闭；第三方服务、嵌入调用和 Git sync 是另外的配置及费用边界。上下文仍进入实际 DSH 对话模型，模型 token、来源维护、复核人工、备份和数据清理按部署变化。备份文档说明 ZIP 含私人记忆，凭据和部分本地归档需独立处理。首次建议用虚构数据和工作区存储，不连接外部 Provider 或 Git。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/package.json#L1-L4)

固定包名、版本和用途。

```text
{
  "name": "dsh-mnemon",
  "version": "0.5.43",
  "description": "Composable, view-based context for DeepSeek Harness. Pluggable sources and strategies, with layered memory and self-evolving skills out of the box.",
```

**依据 2 · 源码核查**：[package.json:50-56](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/package.json#L50-L56)

兼容范围与实际包入口。

```text
  "engines": {
    "node": ">=20",
    "dsh": ">=0.2.0-rc.2 <0.2.1-0 || >=0.2.1-rc.1 <0.3.0-0"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/src/index.d.ts",
```

**依据 3 · 源码核查**：[package.json:114-130](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/package.json#L114-L130)

DSH bundle 和 Web 客户端注入清单。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[src/host/plugin.ts:29-34](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/plugin.ts#L29-L34)

宿主的基础服务声明。

```text
export const provide = ['mnemonMemory']
export const inject = ['tools', 'settings', 'commands', 'agents', 'subagents']
export { LiveConfig as Config } from './live-config.ts'
export type { MnemonConfig }

/** Resolve the optional Web workspace service at call time, not plugin-mount time. */
```

**依据 5 · 源码核查**：[src/host/plugin.ts:187-202](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/plugin.ts#L187-L202)

工具和条件 Web 接入。

<details>
<summary>查看原文（16行）</summary>

```text
  ctx.effect(() => {
    const loader = ctx.get('loader') as { await?(): Promise<unknown> } | undefined
    return registerTools(ctx, runtime, coordinator, extensions, loader?.await?.())
  }, 'dsh-mnemon: Source tool lifecycle')
  registerCommands(ctx.commands, runtime, coordinator)
  registerGuidance(ctx, resolved)
  ctx.inject(['connection', 'webServer'], (webContext) => {
    // `inject` guarantees the service at runtime; retain the defensive guard
    // because HostContextShape also models profiles where it is absent.
    // Connection's RPC getter keeps its provider's injection scope. Carry
    // the explicitly injected server on our own Context so late registration
    // works without changing or restarting the shared Connection plugin.
    const connection = Context.is(webContext)
      ? webContext.extend({ webServer: webContext.get('webServer') }).connection
      : webContext.connection
    if (connection === undefined) return
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:25-38](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/cordis.patch.yml#L25-L38)

默认写开启，远程只读，嵌入关闭。

<details>
<summary>查看原文（14行）</summary>

```text
            routingGuidance: true
            lifecycleEnabled: true
            recallMode: guided
            writebackMode: guided
            idleReviewMs: 30000
            tabEnabled: true
            writeEnabled: true
            remoteAccess: read-only
            timeoutMs: 10000
            defaultRecallLimit: 10
            embedding:
              enabled: false
              endpoint: http://localhost:11434
              model: nomic-embed-text
```

</details>

**依据 7 · 作者声明**：[docs/en/guides/operations.md:73-86](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/docs/en/guides/operations.md#L73-L86)

作者说明备份范围、凭据排除和 Git 默认关闭。

<details>
<summary>查看原文（14行）</summary>

```text

If a merge of two valid MEMORY files exceeds the working-memory limit, Mnemon keeps higher-importance entries first, then newer entries (stable text ordering breaks ties). It preserves each excluded entry, including timestamps, branch scope and provenance, as a JSON record under `<dataDir>/runtime/archived/import-overflow/`. The import commits the archive and hot memory together; an archive write failure leaves the original data intact. Repeating the same merge reuses those records. Archival does not publish a deletion; explicit user removals still do.

Sync and Safe import report the number saved to the local archive separately from the remote entries admitted to hot memory. Inspect the JSON files to recover selected entries through Runtime memory after freeing space or increasing its limit. Like the existing Runtime archive, this directory is local and is **not included in ZIP or Git payloads**; include it in a full offline backup. USER capacity and malformed or individually over-limit input files retain their existing validation.


Import is governed by `writeEnabled` and is rejected in read-only deployments. A ZIP contains private memory—encrypt it, restrict access, and rehearse recovery. Provider credentials live in `state/memory-providers.json` with mode `0600`; they are excluded from ZIP. Saved credential values are not returned through management responses either. Protect the entire `state/` directory in the offline snapshot below if connections must be backed up.

![A verified backup preview before Safe import](../../assets/webui-v0.5.32/en/plugin-backup-preview.jpg)

### Git repository sync

**Storage → Git sync** publishes the same payload as ZIP backup to a Git repository, so another machine can pull it. The switch is off by default, and while it is off the row shows only its title and the switch: no status is read and no Git command runs. Switched on, the row opens one card that reads in the order it is set up: **Repository**, **Sync**, **Automatic sync**, **Backup history** and **Advanced**. The remote holds readable files; the storage root is never made a Git work tree.

```

</details>

**依据 8 · 作者声明**：[README.md:150-157](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/README.md#L150-L157)

作者区分本地、第三方及数据传播。

```text
## Data and trust

- Runtime memory and Project Documents are local files; Mnemon Native is local. Third-party Providers use their own services and scopes.
- Turning a component off does not erase its memory, and changing the storage location does not move data. Use ZIP backup to carry it.
- Skills keeps its evolution data (suggestions, test cases and the conversations reviews read, with secrets redacted) in the local storage root, outside backups. An Agent follows a skill from the market as written, so preview it before installing.
- Git sync publishes the same Mnemon Pack payload as readable files to a repository you own, so another machine can pull it, with **Sync now**, **Check remote** before anything is written, or **Automatic sync**. When two machines wrote one subject differently, both wordings stay until you accept and apply a **Memory reconciliation** plan; see [Git repository sync](https://github.com/omdsh-dev/dsh-mnemon/blob/main/docs/en/guides/operations.md#git-repository-sync).
- Saved Provider credentials stay on the Host and are never exported. Backups still contain private memory; protect them.
- Sources and Strategies are trusted in-process JavaScript, not sandboxed code. Remembered history never outranks current instructions.
```

**依据 9 · 源码核查**：[src/host/commands.ts:105-118](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/commands.ts#L105-L118)

实际注册 mnemon 用户命令。

<details>
<summary>查看原文（14行）</summary>

```text
export function createMnemonCommand(service: MnemonAgentRuntimeSource, coordinator: MnemonSubagentCoordinator): CommandDefinition {
  return {
    name: 'mnemon',
    description: '查看、召回或管理 Mnemon 外置记忆',
    input: { hint: '[status|recall <查询>|related <ID>|remember <内容>|forget <ID>]' },
    handler: invocation => execute(service, coordinator, invocation).catch((reason: unknown) => ({
      kind: 'error',
      text: reason instanceof Error ? reason.message : String(reason),
    })),
  }
}

export function registerCommands(commands: CommandService, service: MnemonAgentRuntimeSource, coordinator: MnemonSubagentCoordinator): void {
  commands.register(createMnemonCommand(service, coordinator))
```

</details>

#### 缺口

- 目标宿主加载结果、实际开销和恢复时长未知。
  **影响**：不能从清单推断版本可用或成本节省。
  **进一步探讨**：记录主机版本、工具状态、token、检索成本、备份与恢复人工。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样检验记忆复用能否减少人工且避免串项目？

**研究主题**：新假设与验证、采用判断

#### 完整回答

选两个隔离工作区及两条相似但互斥的虚构决策。分别用手工项目说明和分层插件，在同一个模型和问题集上比较跨会话命中、证据可追溯性、用量和人工纠错分钟。记录 View 的来源及 scope，测未给空间、错误空间、预算耗尽、禁写和停用后残留。对照组的插件条件加上决策来源和最近复核时间，先检查是否降低陈旧事实被引用，同时量化引入的字符和维护。若异项目事实出现、未提交的变更被当成功，或隔离目录不明，停止自动写入，回到人工项目说明，检查本地及备份副本。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/runtime.ts:46-54](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/runtime.ts#L46-L54)

可分辨会话范围、数据目录和独立用户记忆范围。

```text
export function agentScope(agent: HostAgent, config: ResolvedConfig): MemoryOperationScope {
  const workspaceId = agent.session.header?.cwd?.trim()
  return { storage: config.storageScope, ...(workspaceId ? { workspaceId: resolve(workspaceId) } : {}), sessionId: agent.id, agentId: agent.id }
}

/** Shared by production graphs and read-only View previews. */
export function memoryGenerationOptions(config: ResolvedConfig, workspaceRoot: string | undefined): CompileMemoryGenerationOptions {
  const directory = createStorageRoot(config, workspaceRoot).effectiveDataDir()
  const userDirectory = config.runtimeUserScope === 'global' ? createStorageRoot({ storageScope: 'global' }).effectiveDataDir() : directory
```

**依据 2 · 源码核查**：[src/host/guidance.ts:8-22](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/host/guidance.ts#L8-L22)

已有快照更新和路由指导，事实验证需对照。

<details>
<summary>查看原文（15行）</summary>

```text
export const SNAPSHOT_GUIDANCE = 'Mnemon memory snapshots are complete projections in chronological order. The latest snapshot supersedes earlier snapshots as the current projected state; do not treat older versions as additional current facts or authority. Absence may reflect filtering or projection budgets and does not imply deletion from storage.'
export const ROUTING_GUIDANCE = 'Use memory only when needed. Follow the current Mnemon View: use mnemon_view_route or mnemon_view_action only for offered ids. Installed tools do not imply an available Source. Never infer missing historical facts. An action offer is not authorization; a write exists only after its receipt.'

/** A View is an own-plugin message, never part of the shared context snapshot. */
export function withoutMemoryViewContext<T extends { contexts: Array<{ name: string; text: string }> }>(assembly: T): T {
  return { ...assembly, contexts: assembly.contexts.filter(context => context.name !== RUNTIME_MEMORY_CONTEXT_NAME) }
}

/** Inject trusted Strategy instructions after interpolation; Source text stays quoted in the Wake. */
export function applyMemoryViewGuidance<T extends { sections: Array<{ name: string; text: string }>; contexts: Array<{ name: string; text: string }> }>(assembly: T, view: ComposableMemoryView | undefined, routingEnabled = true): T {
  if (view === undefined) return withoutMemoryViewContext({ ...assembly, sections: assembly.sections.filter(section => section.name !== 'mnemon:snapshot-history') })
  const sections = assembly.sections.filter(section => ![GUIDANCE_SECTION_NAME, STRATEGY_SECTION_NAME, 'mnemon:runtime-memory-protocol', 'mnemon:snapshot-history'].includes(section.name))
  sections.push({ name: 'mnemon:snapshot-history', text: SNAPSHOT_GUIDANCE })
  if (view.guidance?.system) sections.push({ name: STRATEGY_SECTION_NAME, text: view.guidance.system })
  if (routingEnabled) sections.push({ name: GUIDANCE_SECTION_NAME, text: view.guidance?.routing ?? ROUTING_GUIDANCE })
```

</details>

**依据 3 · 源码核查**：[src/core/composition.ts:900-908](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/src/core/composition.ts#L900-L908)

可分别验收 unknown 与 committed。

```text
    if (receipt.viewId !== view.id || receipt.offerId !== offer.id || receipt.sourceInstanceKey !== offer.sourceInstanceKey) {
      throw new Error('memory mutation Receipt is not bound to the requested ActionOffer')
    }
    if (!['succeeded', 'partial', 'failed', 'cancelled'].includes(receipt.status)) throw new Error('memory mutation Receipt has an invalid status')
    if (!['accepted', 'candidate', 'committed', 'partial', 'failed', 'unknown'].includes(receipt.completion)) throw new Error('memory mutation Receipt has an invalid completion')
    if (receipt.completion === 'committed') {
      if (receipt.status !== 'succeeded' || typeof receipt.committedAt !== 'string' || !Number.isFinite(Date.parse(receipt.committedAt))) throw new Error('committed memory Receipt requires successful status and an explicit commit timestamp')
    } else if (receipt.committedAt !== undefined) throw new Error('uncommitted memory Receipt cannot claim a commit timestamp')
    if (receipt.completion === 'failed' && receipt.status === 'succeeded') throw new Error('failed memory completion cannot have successful status')
```

**依据 4 · 作者声明**：[docs/en/guides/operations.md:225-232](https://github.com/omdsh-dev/dsh-mnemon/blob/e9da7d1d717737defc088ac9afd32c4ca99ff9ef/docs/en/guides/operations.md#L225-L232)

停用可作试验停止条件，数据仍需独立处理。

````text
The legacy `mnemon` Entry remains the lifecycle switch for the complete Starter. To disable Mnemon without leaving its Source or Strategy Entries waiting on the missing Host service, add this profile patch and restart DSH:

```yaml
- id: mnemon
  disabled: true
```

This disables the Core/Host, all three bundled Sources, both main Strategies, and all three optional Strategy enhancements together. It does not remove installed packages or delete memory data. Remove the override, or change it to `false`, and restart DSH to enable the Starter again.
````

#### 缺口

- 添加来源和复核时间的收益尚未实测。
  **影响**：更多字段也可能增加注入量和维护。
  **进一步探讨**：固定问题、数据、模型版本，比较错误数、token 及人工耗时。

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
