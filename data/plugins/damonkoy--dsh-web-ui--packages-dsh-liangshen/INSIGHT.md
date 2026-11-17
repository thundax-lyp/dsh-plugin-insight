# 梁神模式

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen)

<!-- BEGIN META -->
[![GitHub ★ 31](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=31&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui) [![npm 30d 104,387](https://img.shields.io/static/v1?label=npm+30d&message=104%2C387&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-liangshen) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-liangshen)
<!-- END META -->

> **功能**：在 DSH 提供梁神预设，将首阶段双工具切换到后续 Code Mode。

> **亮点**：把首步工具约束和后续工具恢复合入同一会话，额外引入事件门控与延迟，见 [Q01](#research-q01)。

> **主要限制**：首轮过滤会否省略项目指令，预设同步会否覆盖已有修改？英语推理短语和少量作者成绩不足以解释成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

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
  - [Q01 · 两阶段怎样改变模型可见内容？](#detail-section-11)
  - [Q02 · 预设如何安装、覆盖和撤销？](#detail-section-12)
  - [Q03 · 怎样区分推理词触发和真实任务收益？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合研究同一模型在不同 DSH 预设下首轮行为的开发者，见 [Q01](#research-q01)。

对照完整 Minimal 与 Standard/Code Mode，在同任务比较指令遵守、成功和成本，见 [Q03](#research-q03)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 梁神预设 | 比较首步与后续工具策略 | 首轮暂缺工作区指令 |
| 目录同步 | 向宿主提供预设文件 | 会覆盖维护目录，不自动撤销 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH systemPrompt 和 Agent 预设机制 | 必需 | 同步后读取 preset，注册提示 | 无法使用预设 |
| 主目录可写 | 启用时需要 | 落预设和清理旧目录 | 提示日志警告 |
| 宿主工具和 PTC 支持 | 实际执行所需 | 首尾切换 | 首阶段可能配置报错 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 复制 DSH_HOME | 保留原预设 |
| 观察 | 比较首轮和晋升后的请求 | 核对工具与指令恢复 |
| 退出 | 停用并检查持久预设 | 使用原生预设 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 预设资产和宿主 | 检查旧目录及权限 | 耗时未知 |
| 持续 | 请求 token 与缓存 | 对照工具和项目约定 | 未测净值 |
| 退出 | 持久文件 | 核对残留与还原 | 卸载不自动把同步撤回 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 首尾差异 | 配置和事件控制可核查 | 真实模型轨迹 |
| 可验收编码 | 能比较预设 | 完成率和成本 |

> **思考**：首轮过滤会否省略项目指令，预设同步会否覆盖已有修改？英语推理短语和少量作者成绩不足以解释成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把首步工具约束和后续工具恢复合入同一会话，额外引入事件门控与延迟，见 [Q01](#research-q01)。

依靠事件重算晋升状态，将宿主安装与模型视图分开，文件同步仍需检查持久副作用，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-5"></a>

### 1.4 主要限制

首轮过滤会否省略项目指令，预设同步会否覆盖已有修改？英语推理短语和少量作者成绩不足以解释成功，见 [Q02](#research-q02) 与 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在隔离 home 观察预设文件和请求边界。没有完整指令与任务对照前不把英语触发词作为成效，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码显示文件同步及两阶段切换。预设稳定性和效果未执行验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-liangshen/package.json、packages/dsh-liangshen/cordis.patch.yml、packages/dsh-liangshen/presets/liangshen/preset.yml、packages/dsh-liangshen/presets/liangshen/agent.cordis.yml、packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs、packages/dsh-liangshen/src/index.ts、packages/dsh-liangshen/src/sync.ts、packages/dsh-liangshen/README.md 及固定范围 inventory；组件：packages/dsh-liangshen。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子包源码、preset 及同步逻辑，未运行目标代码或模型测试。
- 下一步：在同任务对照三预设，并记录首轮指令、实际操作和恢复，见 [Q03](#research-q03)。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

用包含关键首轮工作区指令的任务对照三种模式，可以检验分段是否保留收益且不牺牲指令遵守，见 [Q03](#research-q03)。

在同任务对照三预设，并记录首轮指令、实际操作和恢复，见 [Q03](#research-q03)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 649 | 468 | 132 | — |
| .md | source | 2 | 158 | — | — | 2690 |
| .ts | source | 5 | 466 | 292 | 135 | — |
| .ts | test | 5 | 944 | 826 | 11 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/DamonKoy/dsh-web-ui/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：两阶段工具和提示切换是否值得用于编码任务，怎样验证执行边界和撤销预设？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 两阶段怎样改变模型可见内容？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

编码用户在对比 Minimal 和 Standard 时可能希望首轮保持简洁，后续仍能使用完整工具。该实现先只暴露持久 bash 与 str_replace_editor，过滤所有其他提示段、运行时上下文及非用户消息，默认首阶段设置 1024 输出额度。宿主的沙箱执行与模型看到的运行时提示是不同层。工具丢失或选中多个 shell 时在装配直接抛错。晋升依据已记录工具调用与英语推理词启发式，还可由步数、回合结束或无工具响应放行。随后切换为 Code Mode，并给工作区指令和技能目录多留一步缓冲。任意失败的持久 tool/call 也可推动该条件，分类器不能证明推理质量。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-liangshen/presets/liangshen/agent.cordis.yml:45-70](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/presets/liangshen/agent.cordis.yml#L45-L70)

固定双工具、阶段和延迟配置。

<details>
<summary>查看原文（26行）</summary>

```text
# Two-phase input bootstrap with the exact Minimal phase-1 tools. Before the
# first durable tool/call event the model sees only persistent `bash` plus
# `str_replace_editor`, only the `persona` prompt section, no runtime
# contexts, and only direct user messages. `anchorGate` holds the promotion
# open until the first reasoning block is minimal-like (four-step fallback);
# `promoteAfterFirstResponse` avoids a permanent two-tool session after a
# tool-less first response, and releases an anchor-gated session once its
# first turn ends (`turn/end`). After promotion the catalog is presented as
# Code Mode (PTC): a single `run_code` tool on the wire, switched at the step
# boundary; workspace instructions and the skill catalog are deferred one
# step after promotion. `bootstrapMaxTokens` caps the phase-1 request output
# budget (community-observed "We need" trigger window, 1024) and is stripped
# again after promotion so the cap never solders into later requests.
- id: tool-bootstrap
  name: ./tool-bootstrap.mjs
  config:
    shellTools: [bash]
    commonTools: [str_replace_editor]
    messageSources: [user]
    anchorGate: true
    maxBootstrapSteps: 4
    promoteAfterFirstResponse: true
    bootstrapMaxTokens: 1024
    deferredSources: [agent-instructions, skill-catalog]
    deferredGraceSteps: 1
    promotedPresentation: code
```

</details>

**依据 2 · 源码核查**：[packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs:90-112](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs#L90-L112)

词语判定实现。

<details>
<summary>查看原文（23行）</summary>

```text
 * minimal-like when it contains `we` and no `let me`; a block with any
 * `let me` is standard-like; everything else is ambiguous. This is a
 * deliberate relaxation of the modeltest identity probe: the gate decides
 * trajectory surface, not model identity, and `we` presence without
 * first-person execution phrases is the stable surface marker.
 */
export function classifyReasoning(text) {
  const trimmed = String(text ?? '').trim()
  const we = countWord(trimmed, /\bwe\b/gi)
  const letMe = countWord(trimmed, /\blet me\b/gi)
  const metrics = { we, letMe }
  if (we > 0 && letMe === 0) return { label: 'minimal-like', score: 4, metrics }
  if (letMe > 0) return { label: 'standard-like', score: -4, metrics }
  return { label: 'ambiguous', score: 0, metrics }
}

/**
 * Whether the FIRST reasoning block of an assistant message classifies as
 * minimal-like. Later blocks do not override an earlier standard-like first
 * block.
 */
export function hasAnchoredReasoning(content) {
  if (!Array.isArray(content)) return false
```

</details>

**依据 3 · 源码核查**：[packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs:182-220](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs#L182-L220)

历史事件与晋升。

<details>
<summary>查看原文（39行）</summary>

```text
function decidePromotion(state, config) {
  if (state.toolCalled && config.anchorGate !== true) return true
  if (state.toolCalled && config.anchorGate === true && (state.anchored || state.steps >= config.maxBootstrapSteps)) return true
  if (state.toolCalled && config.anchorGate === true && config.promoteAfterFirstResponse === true && state.turnEnded) return true
  if (!state.toolCalled && state.responded && config.promoteAfterFirstResponse === true) return true
  return false
}

/** Scan newly appended session events and update promotion state. */
function scanEvents(state, session) {
  const events = session.events
  for (; state.next < events.length; state.next += 1) {
    const event = events[state.next]
    if (event === undefined) continue
    if (event.type === 'tool/call') {
      state.toolCalled = true
    } else if (event.type === 'step/start') {
      state.steps += 1
    } else if (event.type === 'turn/end') {
      state.turnEnded = true
    } else if (event.type === 'assistant/message') {
      state.responded = true
      if (!state.anchored) state.anchored = hasAnchoredReasoning(event.data?.message?.content)
    }
  }
}

/** Update one agent's promotion state and apply its post-promotion presentation. */
function refresh(agent, policy) {
  const session = agent?.session
  if (session === undefined) return undefined
  const state = stateFor(session)
  agentBySession.set(session, agent)
  if (!state.promoted) {
    scanEvents(state, session)
    if (decidePromotion(state, policy)) state.promoted = true
  }
  if (state.promoted) applyPresentation(agent, state, policy)
  return state
```

</details>

**依据 4 · 源码核查**：[packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs:290-359](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs#L290-L359)

过滤、报错、延迟和输出 cap。

<details>
<summary>查看原文（70行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const agent = context.agent
    if (agent === undefined) return assembled
    const state = refresh(agent, policy)
    if (state.promoted) return withWorkspaceLine(assembled, agent)

    const available = new Set(assembled.tools.map(tool => tool.name))
    const selectedShells = shellTools.filter(toolName => available.has(toolName))
    const missingCommon = commonTools.filter(toolName => !available.has(toolName))
    if (selectedShells.length !== 1 || missingCommon.length > 0) {
      throw new Error(
        `${name}: expected exactly one bootstrap shell and every common tool; `
        + `shells=${JSON.stringify(selectedShells)}, missing=${JSON.stringify(missingCommon)}`,
      )
    }

    const bootstrap = new Set([...selectedShells, ...commonTools])
    return {
      ...assembled,
      tools: assembled.tools.filter(tool => bootstrap.has(tool.name)),
      contexts: [],
      ...(Array.isArray(assembled.sections)
        ? { sections: assembled.sections.filter(section => PERSONA_SECTION_NAMES.has(section?.name)) }
        : {}),
    }
  }, { prepend: true })

  ctx.on('agent/pre-step', async (payload, next) => {
    const decision = await next()
    const agent = payload.agent
    if (agent === undefined || decision.kind !== 'enter') return decision
    const state = refresh(agent, policy)
    if (state === undefined) return decision

    if (!state.promoted) {
      return {
        ...decision,
        messages: decision.messages.filter(message => isAllowedMessage(message, messageSources)),
      }
    }
    if (state.deferredSteps < policy.deferredGraceSteps) {
      state.deferredSteps += 1
      return {
        ...decision,
        messages: decision.messages.filter(message => !isDeferredMessage(message, deferredSources)),
      }
    }
    return decision
  }, { prepend: true })

  // Phase 1 caps the next request output budget to bootstrapMaxTokens, the
  // community-observed We-need trigger window (dsh-anchored-standard issue 6),
  // and strips the cap again after promotion. The strip is mandatory:
  // requestProposal(persistedHeader) carries a plain maxTokens from the
  // previous header into the next request unless the adapter marked it a
  // default, so an un-stripped cap would be soldered into every request.
  ctx.on('agent/request', async (payload, next) => {
    const resolved = await next()
    const agent = payload?.agent
    if (agent === undefined || policy.bootstrapMaxTokens === undefined) return resolved
    const state = refresh(agent, policy)
    if (state.promoted) {
      if (resolved.maxTokens !== policy.bootstrapMaxTokens) return resolved
      const rest = { ...resolved }
      delete rest.maxTokens
      return rest
    }
    return { ...resolved, maxTokens: policy.bootstrapMaxTokens }
  }, { prepend: true })
```

</details>

#### 缺口

- 无同固定模型与宿主请求样本
  **影响**：无法确认两种阶段的实际线形和收益
  **进一步探讨**：用脱敏消息记录前两次请求的工具、提示及结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 预设如何安装、覆盖和撤销？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用、效果与总成本

#### 完整回答

DSH bundle 挂载依赖 systemPrompt 的宿主包。启用时把预设写进 DSH_HOME 的 .agent-presets，配置可以关闭整个同步或只关闭提示声明。针对自己的预设目录，同步先比较源文件和目标，发现差异会清理额外文件再覆盖复制，并在完成复制后验证配置。旧 liangshen-exact 目录可被递归清理。它没有事务式回滚这一批文件，验证失败只记警告，卸载 effect 只摘提示，不撤所有预设。宿主的现有配置与文件改动应在独立 DSH_HOME 试用，记录版本和复制前后差异。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-liangshen/src/index.ts:27-43](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/src/index.ts#L27-L43)

宿主服务及启用条件。

<details>
<summary>查看原文（17行）</summary>

```text
export const name = 'liangshen'

/** Prompt assembly must exist before the announcement section can register. */
export const inject = ['systemPrompt']

/** Plugin config, validated by the same-named schemastery schema. */
export interface Config {
  /** Master switch: when false, neither sync nor announcement runs. */
  enabled?: boolean
  /** When true (default), a system-prompt section announces the plugin. */
  announceToAgent?: boolean
}

export const Config: z<Config> = z.object({
  enabled: z.boolean().default(true),
  announceToAgent: z.boolean().default(true),
})
```

</details>

**依据 2 · 源码核查**：[packages/dsh-liangshen/src/index.ts:71-112](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/src/index.ts#L71-L112)

同步、旧预设退役及只卸提示。

<details>
<summary>查看原文（42行）</summary>

```text
export function apply(ctx: Context, config?: Config): void {
  const resolve = (): Config => ({
    announceToAgent: config?.announceToAgent ?? DEFAULT_ANNOUNCE,
    enabled: config?.enabled ?? true,
  })

  const sync = (): void => {
    const targetRoot = join(dshHome(), '.agent-presets')
    try {
      mkdirSync(targetRoot, { recursive: true })
      const result = syncPresetTrees(bundledPresetsRoot(), targetRoot, ['liangshen-exact'])
      for (const { id, error } of result.failed) {
        ctx.logger?.warn?.(`dsh-liangshen: preset ${id} sync failed: ${error}`)
      }
      if (result.synced.length > 0) {
        ctx.logger?.info?.(`dsh-liangshen: presets synced into ${targetRoot}: ${result.synced.join(', ')}`)
      }
      if (result.retired.length > 0) {
        ctx.logger?.info?.(`dsh-liangshen: retired stale presets from ${targetRoot}: ${result.retired.join(', ')}`)
      }
    } catch (error) {
      ctx.logger?.warn?.(`dsh-liangshen: preset sync failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  let disposeSection: (() => void) | undefined
  const refresh = (): void => {
    disposeSection?.()
    disposeSection = undefined
    if (!resolve().enabled) return
    sync()
    if (resolve().announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-liangshen',
        order: SECTION_ORDER,
        text: LIANGSHEN_GUIDANCE,
      })
    }
  }

  refresh()
  ctx.effect(() => () => { disposeSection?.(); disposeSection = undefined }, 'dsh-liangshen: announcement')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-liangshen/src/sync.ts:103-139](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/src/sync.ts#L103-L139)

现有目录同步及清理额外文件。

<details>
<summary>查看原文（37行）</summary>

```text
export function syncOnePreset(sourceDir: string, targetDir: string): 'synced' | 'current' {
  const sourceFiles = filesUnder(sourceDir)
  const sourceSet = new Set(sourceFiles.map(file => relative(sourceDir, file)))

  if (existsSync(targetDir) && !statSync(targetDir).isDirectory()) {
    rmSync(targetDir, { recursive: true, force: true })
  }
  if (!existsSync(targetDir)) {
    cpSync(sourceDir, targetDir, { recursive: true, preserveTimestamps: true })
    pruneExtras(targetDir, sourceSet)
    return 'synced'
  }

  let dirty = false
  for (const file of sourceFiles) {
    const dest = join(targetDir, relative(sourceDir, file))
    if (!existsSync(dest) || !sameFile(file, dest)) {
      dirty = true
      break
    }
  }
  if (!dirty) {
    for (const file of filesUnder(targetDir)) {
      if (!sourceSet.has(relative(targetDir, file))) {
        dirty = true
        break
      }
    }
  }
  if (!dirty) return 'current'

  // Drop target-only entries first so file/dir type clashes never reach cpSync,
  // then copy and prune again per the post-copy contract.
  pruneExtras(targetDir, sourceSet)
  cpSync(sourceDir, targetDir, { recursive: true, preserveTimestamps: true })
  pruneExtras(targetDir, sourceSet)
  return 'synced'
```

</details>

**依据 4 · 源码核查**：[packages/dsh-liangshen/src/sync.ts:156-194](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/src/sync.ts#L156-L194)

先写后验证及退役。

<details>
<summary>查看原文（39行）</summary>

```text
export function syncPresetTrees(sourceRoot: string, targetRoot: string, retire: string[] = []): SyncResult {
  const result: SyncResult = { synced: [], current: [], failed: [], retired: [] }
  mkdirSync(targetRoot, { recursive: true })
  if (existsSync(sourceRoot)) {
    for (const entry of readdirSync(sourceRoot)) {
      const source = join(sourceRoot, entry)
      if (!statSync(source).isDirectory()) continue
      const id = basename(source)
      const targetDir = join(targetRoot, id)
      let outcome: 'synced' | 'current'
      try {
        outcome = syncOnePreset(source, targetDir)
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) })
        continue
      }
      try {
        const problems = validatePresetAgentFile(targetDir)
        if (problems.length > 0) {
          result.failed.push({ id, error: `agent.cordis.yml failed validation: ${problems.join('; ')}` })
        } else if (outcome === 'synced') {
          result.synced.push(id)
        } else {
          result.current.push(id)
        }
      } catch (error) {
        result.failed.push({ id, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  for (const id of retire) {
    if (existsSync(join(sourceRoot, id))) continue
    const stale = join(targetRoot, id)
    if (existsSync(stale) && statSync(stale).isDirectory()) {
      rmSync(stale, { recursive: true, force: true })
      result.retired.push(id)
    }
  }
  return result
```

</details>

#### 缺口

- 未验证磁盘错误恢复和重装
  **影响**：持久同步的影响需手动判断
  **进一步探讨**：在隔离 home 复制带自定义文件和只读目录的样例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样区分推理词触发和真实任务收益？

**研究主题**：采用判断、新假设与验证

#### 完整回答

作者引用上游实验的两次成绩和英语短语观察，该证据无法说明此固定包跨模型稳定提升。相比直接用 Minimal 或 Code Mode，它追加的收益条件是首步简化后仍在任务需要时恢复足够工具及工作区约定。建议继续观察，先在无真实仓库影响的沙箱记录请求形状，并将首轮必须读项目约定的任务加入对照。随机交叉使用三种预设，记录准确完成、首轮误操作、缓存和等待，盲化只用某个词作胜利判据的倾向。若更多得分仅来自少量样例或遗漏约定增加错误，停用预设回到原模式。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-liangshen/README.md:7-26](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/README.md#L7-L26)

作者报告社区观察和首阶段策略。

<details>
<summary>查看原文（20行）</summary>

```text
## Why

DeepSeek V4 Pro conditions strongly on the API tool catalog visible in the FIRST request when choosing its execution trajectory. In the community eval ([xiaobright/modeltest](https://github.com/xiaobright/modeltest)), Standard / PTC scored 91/92 while Minimal reached 99/96 — but Minimal keeps only two tools. This two-phase approach separates the first-trajectory choice from full later capability:

1. The first model request exposes only the builtin Minimal preset's exact two tools (persistent `bash` plus `str_replace_editor`), keeps only the `deployment:persona` prompt section, empties runtime contexts, and passes only the user's own messages;
2. After the session's first durable `tool/call`, promotion waits until the first reasoning block is minimal-like (contains `we` and no `let me`), with a four-step fallback; the wire then switches to Code Mode (PTC) — a single `run_code` tool backed by the full tool registry SDK — and every assembled prompt section plus the ordinary workspace-instruction, skill-catalog, and runtime-context injections return;
3. The phase derives from persisted session events, so resume / reload never lose state.

Measured on native Windows (DeepSeek V4 Pro, max, V4.1b task): 98 / 99, mean 98.5, zero `let me` traces in the second run — reproducible, not a lucky draw, and no tool capability sacrificed. Original experiment: [xiaobright/dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard).

## Stabilization controls

The preset ships with extra safeguards on top of the reference mechanism, all configured in `agent.cordis.yml` under `tool-bootstrap`:

- `anchorGate` — after the first `tool/call`, the catalog stays two-tool until the first reasoning block classifies minimal-like, so a `Let me` first block does not immediately earn the full catalog;
- `maxBootstrapSteps` — fallback promotion after N steps when no anchored block appeared;
- `promoteAfterFirstResponse` — a tool-less first response promotes once it has responded; an anchor-gated session also releases when its first turn ends (`turn/end`), so the next user turn already sees the promoted catalog;
- `promotedPresentation: code` — after promotion the wire is Code Mode (PTC): one `run_code` tool with the full registry available through the generated SDK, switched at the step boundary so the current step's native calls are never interrupted;
- `deferredSources` + `deferredGraceSteps` — workspace instructions and the skill catalog wait one extra step after promotion, so the tool-catalog switch and the injection shock do not land in the same step;
- `bootstrapMaxTokens` — caps the phase-1 request output budget (community measurements put `max_tokens=1024` in the high-hit "We need" window, versus 0/5 at the 256k DSH default), and the cap is stripped again after promotion so `requestProposal` never solders 1024 into every later request.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs:290-337](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-liangshen/presets/liangshen/tool-bootstrap.mjs#L290-L337)

第一轮过滤与后续恢复的风险来源。

<details>
<summary>查看原文（48行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    const assembled = await next()
    const agent = context.agent
    if (agent === undefined) return assembled
    const state = refresh(agent, policy)
    if (state.promoted) return withWorkspaceLine(assembled, agent)

    const available = new Set(assembled.tools.map(tool => tool.name))
    const selectedShells = shellTools.filter(toolName => available.has(toolName))
    const missingCommon = commonTools.filter(toolName => !available.has(toolName))
    if (selectedShells.length !== 1 || missingCommon.length > 0) {
      throw new Error(
        `${name}: expected exactly one bootstrap shell and every common tool; `
        + `shells=${JSON.stringify(selectedShells)}, missing=${JSON.stringify(missingCommon)}`,
      )
    }

    const bootstrap = new Set([...selectedShells, ...commonTools])
    return {
      ...assembled,
      tools: assembled.tools.filter(tool => bootstrap.has(tool.name)),
      contexts: [],
      ...(Array.isArray(assembled.sections)
        ? { sections: assembled.sections.filter(section => PERSONA_SECTION_NAMES.has(section?.name)) }
        : {}),
    }
  }, { prepend: true })

  ctx.on('agent/pre-step', async (payload, next) => {
    const decision = await next()
    const agent = payload.agent
    if (agent === undefined || decision.kind !== 'enter') return decision
    const state = refresh(agent, policy)
    if (state === undefined) return decision

    if (!state.promoted) {
      return {
        ...decision,
        messages: decision.messages.filter(message => isAllowedMessage(message, messageSources)),
      }
    }
    if (state.deferredSteps < policy.deferredGraceSteps) {
      state.deferredSteps += 1
      return {
        ...decision,
        messages: decision.messages.filter(message => !isDeferredMessage(message, deferredSources)),
      }
    }
```

</details>

#### 缺口

- 没有同固定包真实任务对照
  **影响**：采用判断仅观察
  **进一步探讨**：以项目指令冲突、非英语推理和工具失败默认样例做对照

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
