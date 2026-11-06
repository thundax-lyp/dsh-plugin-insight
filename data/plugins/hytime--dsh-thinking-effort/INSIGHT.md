# dsh-thinking-effort

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[de3262a](https://github.com/hytime/dsh-thinking-effort/tree/de3262adcf4f031cd4cda3bf3b54f40f857ab10e)

<!-- BEGIN META -->
[![GitHub ★ 57](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=57&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/hytime/dsh-thinking-effort) [![npm 30d 5,406](https://img.shields.io/static/v1?label=npm+30d&message=5%2C406&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hytime/dsh-thinking-effort) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@hytime/dsh-thinking-effort)
<!-- END META -->

> **功能**：为 DSH 自定义 pi-ai 模型配置思考档位，并设置子 Agent 默认思考强度与兼容选项。

> **亮点**：最小设置层写入、新旧宿主适配和子Agent档位控制减少配置工作；不改变推理算法或替代网关transport。见 [Q03](#research-q03)。

> **主要限制**：配置/点击不是生效证明，失败可继续原选择；默认补档也不证明网关支持，卸载不撤销持久写入。见 [Q02](#research-q02)、[Q03](#research-q03)。

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
  - [Q01 · 选择思考档位怎样改变模型声明与实际调用？](#detail-section-11)
  - [Q02 · 档位不生效、请求头与兼容失败有哪些可见边界？](#detail-section-12)
  - [Q03 · 相对直接编辑配置有什么增量和负担，卸载会恢复原设置吗？](#detail-section-13)
  - [Q04 · 什么用户可试用，下一步值得验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：自定义模型缺少原生档位声明时，管理映射和子Agent默认。见 [Q01](#research-q01)。

手工编辑reasoningEfforts和子Agent参数；内建模型原生控件已够时无需插件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自定义档位 | 补reasoningEfforts | 不证明网关支持 |
| 子Agent默认 | 覆盖继承档位 | 现代创建/旧请求两条路径 |
| slider | 选择宿主真实目录档位 | 无modelDirectories不注册 |
| 兼容设置 | 管理协议声明 | transport仍负责网络实现 |
| OpenCode Header | 按模型流生成会话头 | global fetch包装非域白名单 |
| 脚本格式 | 自定义会话值 | 动态载入可信本地JS |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH>=0.1.0-rc.7及settings/timer/llm | 必需 | 设置及钩子 | 包声明下限不代替实际能力探测；不满足则功能无法完整生效 |
| 可写mutate设置 | 补档必需 | 最小路径持久改写 | 留缺项，不钉整棵默认 |
| modelDirectories | slider所需 | 读宿主档位/选择 | 席位跳过，设置仍可用 |
| 支持目标参数的网关 | 结果必需 | 真正执行档位 | 声明不能使上游支持 |
| 可信JS脚本 | 仅script模式 | 定制Header | 动态import，不能当受限表达式 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份独立profile | 网关参数有依据 |
| 配置 | 补精确模型映射/子Agent默认 | 查实际持久字段 |
| 调用 | slider/子Agent走宿主 | 查最终请求非仅UI |
| 恢复 | 关闭覆盖并定向还原 | 卸载不自动撤销写入 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 未测 | profile备份、网关映射 | 单模型起步 |
| 持续使用 | token/时延变化未知 | 跟踪参数和默认 | 不把high当增效 |
| 失败恢复 | 无效调用费用未知 | 查日志、还原字段 | UI失败未必显式 |
| 退出 | 持久字段保留 | 定向恢复备份 | 不删其他配置 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 档位配置 | 用户层/模型映射写入 | 上游真正支持 |
| 子Agent默认 | 创建或旧请求覆盖 | 正确率/预算收益 |
| 选择控件 | 宿主目录与select | 点击实际成功 |
| Header适配 | 按流异步上下文改写 | 所有transport/域兼容 |

> **思考**：配置/点击不是生效证明，失败可继续原选择；默认补档也不证明网关支持，卸载不撤销持久写入。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：最小设置层写入、新旧宿主适配和子Agent档位控制减少配置工作；不改变推理算法或替代网关transport。见 [Q03](#research-q03)。

不把base-only数组物化及可选目录注入可借鉴；多层best-effort要有有效值核验，script模式应视为可信代码。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

配置/点击不是生效证明，失败可继续原选择；默认补档也不证明网关支持，卸载不撤销持久写入。见 [Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

独立profile单模型核请求再核子Agent，失败或超预算还原字段；不为内建模型重复增加控制。见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码已检查；模型实际参数接受与费用收益未验证，回执为未来假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/thinking-slider/index.ts、src/client/thinking-slider/slider.tsx、src/host/opencode-session-format.ts、src/host/opencode-session.ts、src/host/settings.ts、src/host/subagent.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查Host补档、子Agent新旧钩子、slider选择、fetch异步上下文和脚本格式加载。未全审全部compat/导入迁移/transport接管、所有设置UI；未运行目标。
- 下一步：固定Host/网关在独立profile核wire字段、错映射和子Agent继承，再记正确率/时延/全部费用；回执方案另核，未执行。

**分析版本**

- **仓库**：[hytime/dsh-thinking-effort](https://github.com/hytime/dsh-thinking-effort)
- **版本号**：0.3.12（[固定提交 de3262a](https://github.com/hytime/dsh-thinking-effort/tree/de3262adcf4f031cd4cda3bf3b54f40f857ab10e)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

验证从用户选择到最终transport参数的回执能否减少错映射和继承误判；宿主已等效或无改善即推翻。见 [Q04](#research-q04)。

固定Host/网关在独立profile核wire字段、错映射和子Agent继承，再记正确率/时延/全部费用；回执方案另核，未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 4242 | — | — | 70406 |
| .mjs | source | 4 | 688 | 463 | 180 | — |
| .mjs | test | 3 | 1138 | 1015 | 22 | — |
| .ts | source | 56 | 8238 | 5714 | 1811 | — |
| .tsx | source | 11 | 3214 | 2471 | 574 | — |
| .ts | test | 29 | 13015 | 10271 | 1685 | — |
| .tsx | test | 6 | 5775 | 4769 | 416 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/hytime/dsh-thinking-effort/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：档位控制怎样改变实际模型请求，哪些条件限制收益？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 选择思考档位怎样改变模型声明与实际调用？

**研究主题**：场景与需求、功能与机制

#### 完整回答

它主要服务于手工声明第三方pi-ai模型、但原生Composer缺少档位的DSH用户。原办法是直接编辑模型reasoningEfforts和子Agent配置；若内建模型原有控件已正常，插件本来就未必必要。合格结果应是预期模型/子Agent最终请求收到正确参数，而非界面出现high就视为更聪明。

Host启动设置watcher、会话Header适配和旧配置迁移，再监听agent/created与agent/request。默认补档只写用户层已有models数组中缺少的项，或者modelOverrides中的缺项；保留已有reasoningEfforts。基础层独有的models不物化到用户数组，避免覆盖整层默认。没有writable或路径mutate能力时不强行写整棵provider。它改变持久设置声明，网络wire参数仍由实际transport解释。

子Agent只认session.header.origin=subagent；新宿主有model.current/select就在创建时选择配置档位，旧式无该能力才在agent/request的next结果中改reasoningEffort。自定义线上值需能从精确provider/model的reasoningEfforts反查，否则不覆盖。客户端slider占conversation.input.model的较高优先级席位，读取宿主modelDirectories的真实模型和档位，通过普通select提交会话选择，而非自己伪造一组可用档位。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:17-30](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/index.ts#L17-L30)

Host接线。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: HostContext): void {
  mark('apply')
  installSettingsWatcher(ctx)
  installOpenCodeSession(ctx)
  installLegacyMigration(ctx)
  ctx.on('agent/created', (...args: unknown[]) => {
    handleAgentCreated(ctx, args[0])
  }, { global: true })
  ctx.on('agent/request', (...args: unknown[]) => {
    const payload = args[0]
    const next = args[1] as () => Promise<unknown>
    return handleAgentRequest(ctx, payload, next)
  }, { global: true })
}
```

</details>

**依据 2 · 源码核查**：[src/host/settings.ts:207-253](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/settings.ts#L207-L253)

用户模型/override默认补档。

<details>
<summary>查看原文（47行）</summary>

```text
export function fillProviderDefaults(
  providers: unknown,
  user: unknown,
): ProviderDefaultsResult & { readonly skipped: SkippedDefaults } {
  const skipped = { missing: 0, unmatched: 0 }
  if (!isUnknownRecord(providers)) return { ops: [], filled: 0, skipped }

  const userProviders = record(user)
  const ops: SettingsPathOp[] = []
  let filled = 0

  for (const [route, rawProfile] of Object.entries(providers)) {
    if (!isProviderProfile(rawProfile)) continue
    const userProfile = userProviders?.[route]
    const ownProfile = record(userProfile)

    const models = rawProfile.models
    const userModels = ownProfile?.models
    if (Array.isArray(models)) {
      // A route whose models exist only in a lower layer has no array to write
      // into at all, but its entries are still missing levels and still
      // unreachable, so they are counted rather than passed over.
      const merged = Array.isArray(userModels)
        ? withDefaultLevels(userModels, models, skipped)
        : countUnreachable(models, skipped)
      if (merged.changed > 0) {
        ops.push({ op: 'set', path: ['providers', route, 'models'], value: merged.models })
        filled += merged.changed
      }
    }

    const overrides = rawProfile.modelOverrides
    if (isUnknownRecord(overrides)) {
      for (const [id, rawEntry] of Object.entries(overrides)) {
        if (!isUnknownRecord(rawEntry) || rawEntry.reasoningEfforts !== undefined) continue
        skipped.missing += 1
        filled += 1
        ops.push({
          op: 'set',
          path: ['providers', route, 'modelOverrides', id, 'reasoningEfforts'],
          value: DEFAULT_LEVELS,
        })
      }
    }
  }

  return { ops, filled, skipped }
```

</details>

**依据 3 · 源码核查**：[src/host/settings.ts:306-344](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/settings.ts#L306-L344)

只在可写且mutate存在时写入。

<details>
<summary>查看原文（39行）</summary>

```text
async function fillDefaults(settings: HostSettings): Promise<FillOutcome> {
  if (settings.writable !== true) return { filled: 0 }
  // A section that is not readable yet (the namespace registers late, or the
  // entry-config form has not materialized) is retryable, not settled.
  const notYet: FillOutcome = { filled: 0 }

  const section = readSection(settings)
  if (!isUnknownRecord(section)) return notYet

  const user = readUserLayer(settings, SETTINGS_NAMESPACE)
  // The resolved section and the user's own layer are separate service reads
  // under the namespace model, so the resolved read can succeed while the layer
  // is still unavailable. Every entry then looks unreachable, and this fill
  // would settle on `remaining: 0` after one attempt where the old chain
  // re-checked; the retry is not speculative, it is the read the fill needs.
  if (!user.readable) return notYet

  const result = fillProviderDefaults(section.providers, user.providers)
  reportSkipped(result.skipped)
  // Every entry still missing a level that the user's own layer does not carry
  // is one a retry cannot reach either, so only the reachable remainder is
  // worth another attempt. `0` settles the startup chain.
  const reachable = result.skipped.missing - result.skipped.unmatched
  if (result.filled === 0) return { filled: 0, remaining: reachable }

  const mutate = settings.mutate
  if (typeof mutate !== 'function') {
    // A merge cannot address one element of an existing array, so a service
    // without `mutate` could only receive this fill by restating — and pinning
    // — the whole resolved provider subtree. Leave the levels alone instead.
    log('settings service cannot address paths; left', result.filled, 'model(s) unfilled')
    return { filled: 0, remaining: reachable }
  }

  await mutate.call(settings, SETTINGS_NAMESPACE, result.ops)
  mark(`filled-${result.filled}`)
  log('filled default thinking levels for', result.filled, 'model(s)')
  return { filled: result.filled, remaining: reachable }
}
```

</details>

**依据 4 · 源码核查**：[src/host/subagent.ts:97-127](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/subagent.ts#L97-L127)

档位反查及subagent识别。

<details>
<summary>查看原文（31行）</summary>

```text
  ownSectionId: string = PLUGIN_ENTRY_ID,
): StandardLevel | string | undefined {
  const subagentEffort = readSubagentEffort(settings, logger, ownSectionId)
  if (subagentEffort === undefined) return undefined
  if (STANDARD_LEVELS.includes(subagentEffort as StandardLevel)) return subagentEffort
  if (settings === undefined || !isAgentRequestConfig(config)) return undefined

  try {
    const model = findModel(settings, config)
    if (!isUnknownRecord(model) || !isUnknownRecord(model.reasoningEfforts)) return undefined
    for (const [level, wire] of Object.entries(model.reasoningEfforts)) {
      if (typeof wire === 'string' && wire === subagentEffort) return level
    }
    logger('subagent custom effort is not mapped for', `${String(config.provider)}/${String(config.model)}`)
  } catch (error) {
    logger('resolve subagent effort error:', error instanceof Error ? error.message : String(error))
  }
  return undefined
}

function subagentAgentOf(payload: unknown): Record<string, unknown> | undefined {
  if (!isUnknownRecord(payload) || !isUnknownRecord(payload.agent)) return undefined
  const agent = payload.agent
  const session = agent.session
  if (!isUnknownRecord(session) || !isUnknownRecord(session.header)) return undefined
  return session.header.origin === 'subagent' ? agent : undefined
}

function hasAgentModelSelection(agent: Record<string, unknown> | undefined): boolean {
  const model = agent?.model
  return isUnknownRecord(model) && typeof model.current === 'function' && typeof model.select === 'function'
```

</details>

**依据 5 · 源码核查**：[src/host/subagent.ts:130-180](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/subagent.ts#L130-L180)

新旧宿主两条真实覆盖路径。

<details>
<summary>查看原文（51行）</summary>

```text
/** Select a new-host subagent's configured effort before its first model step. */
export function handleAgentCreated(ctx: Pick<HostContext, 'settings' | 'fiber'>, payload: unknown): void {
  const agent = subagentAgentOf(payload)
  if (agent === undefined) return
  const model = isUnknownRecord(agent.model) ? agent.model : undefined
  const current = model?.current
  const select = model?.select
  if (model === undefined || typeof current !== 'function' || typeof select !== 'function') return

  try {
    const selection: unknown = Reflect.apply(current, model, [])
    if (!isAgentRequestConfig(selection)
      || typeof selection.provider !== 'string'
      || typeof selection.model !== 'string') return
    const effort = resolveSubagentEffort(
      ctx.settings,
      selection,
      log,
      settingsEntryId(ctx, OPENCODE_SESSION_NAMESPACE),
    )
    if (effort === undefined || effort === selection.reasoningEffort) return
    Reflect.apply(select, model, [{
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: effort,
    }])
  } catch (error) {
    log('subagent model selection error:', error instanceof Error ? error.message : String(error))
  }
}

export async function handleAgentRequest(
  ctx: Pick<HostContext, 'settings' | 'fiber'>,
  payload: unknown,
  next: () => Promise<unknown>,
): Promise<unknown> {
  const config = await next()
  try {
    const agent = subagentAgentOf(payload)
    if (agent === undefined || !isAgentRequestConfig(config) || hasAgentModelSelection(agent)) return config
    const effort = resolveSubagentEffort(
      ctx.settings,
      config,
      log,
      settingsEntryId(ctx, OPENCODE_SESSION_NAMESPACE),
    )
    return effort === undefined ? config : { ...config, reasoningEffort: effort }
  } catch (error) {
    log('agent/request override error:', error instanceof Error ? error.message : String(error))
    return config
  }
```

</details>

**依据 6 · 源码核查**：[src/client/thinking-slider/index.ts:53-124](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/client/thinking-slider/index.ts#L53-L124)

较高优先级控件与目录服务接入。

<details>
<summary>查看原文（72行）</summary>

```text
 * winner is the first entry in ASCENDING priority order, so a negative value
 * here WINS over the shipped `ModelSelect` (priority 0): this seat replaces the
 * official effort control on purpose, it does not yield to it.
 */
export const SEAT_PRIORITY = -10

/** The seat's injected business face ({@link SliderProps} minus `t`). */
export interface ComposerSeatInjected {
  readonly directory: Readonly<{ getSnapshot(): ModelDirectoryState; subscribe(fn: () => void): () => void }>
  readonly load: () => void
  readonly select: (selection: ModelSelection) => Promise<boolean>
}

/**
 * Register the composer model seat over a Cordis-style client context. The
 * optional `modelDirectories` service is a declared `inject` dependency, so the
 * seat registers only when the official ui-model-selection service is live; it
 * is skipped when that service is absent. The `inject` list includes
 * `remote.session` only on runtimes that expose it (modern DSH); older
 * runtimes register with the base list, which is enough because the directory
 * controller owns its own `connection` face there.
 * @param context - client root context (slots + locale + optional model service).
 */
export function apply(context: ClientContext): void {
  const translate = context.get('locale')
    ? (context.get('locale') as ClientLocale).bind(LOCALE_NS)
    : (key: string) => key
  let registered = false

  const registerWhenReady = (): void => {
    if (registered) return
    const modelDirectories = context.get('modelDirectories')
    if (!asModelDirectories(modelDirectories)) return

    const compatibility = modelDirectoryCompatibility(context)
    registered = true
    context.plugin({
      name: 'dsh-thinking-effort:composer-seat',
      inject: compatibility.inject,
      apply: (scope: ClientContext): void => {
        const scopedSlots = (scope as ClientContext & { slots?: ClientSlots }).slots
        if (scopedSlots === undefined) return
        const directories = asModelDirectories(scope.get('modelDirectories'))
        if (directories === undefined) return
        const resolveFace = createModelDirectoryFaceResolver(scope, directories)

        // Match the official ui-model-selection composition: slots.inject owns
        // the registration effect for the declaring plugin fiber and disposes
        // it when the fiber is unloaded or its slot declaration collapses.
        scopedSlots.inject(SEAT_NAME, () => scopedSlots.register(
          {
            name: SEAT_NAME,
            priority: SEAT_PRIORITY,
            locale: LOCALE_NS,
            inject: (sessionId: string) => resolveFace(sessionId),
          },
          (props: ComposerSeatInjected & { readonly locked?: boolean; readonly t: Translation }) => createElement(Slider, {
            directory: props.directory,
            load: props.load,
            select: props.select,
            locked: props.locked,
            t: props.t ?? translate,
          }),
        ))
      },
    })
  }

  // The official resolver is itself a plugin with service dependencies. It may
  // appear after this package's apply; probe now and retry on service updates.
  registerWhenReady()
  context.on('internal/service', (serviceName) => {
```

</details>

**依据 7 · 源码核查**：[src/client/thinking-slider/slider.tsx:253-275](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/client/thinking-slider/slider.tsx#L253-L275)

普通会话select提交。

<details>
<summary>查看原文（23行）</summary>

```text
  const submit = (selection: ModelSelection): void => {
    if (locked || select === undefined) return
    const pending = select(selection)
    void pending.then(() => {}, () => {})
  }

  const onRangeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (current === null) return
    const effort = efforts[Number(event.currentTarget.value)]
    if (effort === undefined) return
    submit({ provider: current.provider, model: current.model, reasoningEffort: effort.id })
  }

  const submitModel = (choice: ModelChoice): void => {
    const sameModel = choice.provider === current?.provider && choice.model.id === current?.model
    const reasoningEffort = sameModel
      ? current?.reasoningEffort ?? choice.model.reasoning?.defaultEffort
      : choice.model.reasoning?.defaultEffort
    submit({
      provider: choice.provider,
      model: choice.model.id,
      ...reasoningEffort === undefined ? {} : { reasoningEffort },
    })
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 档位不生效、请求头与兼容失败有哪些可见边界？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

档位声明不是上游支持实测。自动补出的off/high/max和用户映射仍须网关接受；插件不实现推理算法，也不能根据名字保证token预算或答案提升。现代子Agent在创建时调用Reflect.apply(select)，但没有await返回值：外层try只捕获同步抛错并记日志，不能据此保证Promise拒绝也被记录。本组件仅按current/select函数形状探测，未绑定Host model.select返回契约；若具体Host异步返回Promise，异步失败是否被上层处理是未知条件，本次未观察到实际拒绝。旧请求路径有await next，改写异常回原config。slider对select的resolve/reject都不显示本地错误，所以应观察实际宿主选择和网关请求，不能把点击当生效回执。

可选OpenCode会话Header是真实运行时改写：llm/stream按provider/model和session建立AsyncLocalStorage，包裹迭代生命周期，再patch globalThis.fetch；仅有active上下文时加Header/改user-agent，已有x-opencode-session不覆盖。结束、取消或异常会deactivate，卸载只在当前fetch仍是自己的包装时恢复，减少并发污染。但fetchWithSession没有按目标URL再次过滤，同一激活上下文内所有fetch可能带这些头；这说明作用域是一次模型流而非目的域白名单，本次没有复现错发。

格式配置支持脚本模式，会动态import用户指定JS；这与受限表达式模式不是同一安全边界，只应使用可信本地脚本。格式/验证错误有回退或warn/drop/send选择，回退成功不证明上游会接受。宿主API版本、设置层模型和可选transport仍可能决定最终参数；本次未全审导入迁移、所有compat字段与额外transport接管，不能泛称全版本协议兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/subagent.ts:150-180](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/subagent.ts#L150-L180)

覆盖失败继续原选择/请求。

<details>
<summary>查看原文（31行）</summary>

```text
    if (effort === undefined || effort === selection.reasoningEffort) return
    Reflect.apply(select, model, [{
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: effort,
    }])
  } catch (error) {
    log('subagent model selection error:', error instanceof Error ? error.message : String(error))
  }
}

export async function handleAgentRequest(
  ctx: Pick<HostContext, 'settings' | 'fiber'>,
  payload: unknown,
  next: () => Promise<unknown>,
): Promise<unknown> {
  const config = await next()
  try {
    const agent = subagentAgentOf(payload)
    if (agent === undefined || !isAgentRequestConfig(config) || hasAgentModelSelection(agent)) return config
    const effort = resolveSubagentEffort(
      ctx.settings,
      config,
      log,
      settingsEntryId(ctx, OPENCODE_SESSION_NAMESPACE),
    )
    return effort === undefined ? config : { ...config, reasoningEffort: effort }
  } catch (error) {
    log('agent/request override error:', error instanceof Error ? error.message : String(error))
    return config
  }
```

</details>

**依据 2 · 源码核查**：[src/client/thinking-slider/slider.tsx:253-257](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/client/thinking-slider/slider.tsx#L253-L257)

选择异常未在控件本地显示。

```text
  const submit = (selection: ModelSelection): void => {
    if (locked || select === undefined) return
    const pending = select(selection)
    void pending.then(() => {}, () => {})
  }
```

**依据 3 · 源码核查**：[src/host/opencode-session.ts:171-207](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/opencode-session.ts#L171-L207)

按流上下文添加头，无URL判断。

<details>
<summary>查看原文（37行）</summary>

```text
async function fetchWithSession(
  formatter: OpenCodeSessionFormatter,
  storage: AsyncLocalStorage<OpenCodeSessionRequest>,
  settingsSnapshot: unknown,
  originalFetch: FetchFunction,
  input: FetchInput,
  init: FetchInit | undefined,
): ReturnType<typeof fetch> {
  const request = storage.getStore()
  if (request === undefined || request.active !== true) return originalFetch(input, init)

  const headers = headersForFetch(input, init)

  if (request.userAgentValue !== undefined) {
    headers.set('user-agent', request.userAgentValue)
  }

  const sessionId = request.sessionId
  if (sessionId !== undefined && request.sessionEnabled && !headers.has(OPENCODE_SESSION_HEADER)) {
    let value: string | undefined
    try {
      value = await formatter.format(
        { provider: request.provider, model: request.model, sessionId },
        resolveFormatConfig(settingsSnapshot),
      )
    } catch (error) {
      console.warn(LOG_PREFIX, 'session format error:', error instanceof Error ? error.message : String(error))
      value = request.sessionId
    }
    if (value !== undefined) headers.set(OPENCODE_SESSION_HEADER, value)
  }

  return originalFetch(input, {
    ...init,
    headers: new Headers(headers),
  })
}
```

</details>

**依据 4 · 源码核查**：[src/host/opencode-session.ts:288-338](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/opencode-session.ts#L288-L338)

global fetch安装与卸载。

<details>
<summary>查看原文（51行）</summary>

```text
export function installOpenCodeSession(ctx: HostContext): void {
  let settingsSource: () => unknown = () => ({})
  let settingsSnapshot: unknown = {}

  installSettingsSectionCompat(ctx, {
    setSource(source) {
      settingsSource = source
    },
    onChange() {
      settingsSnapshot = settingsSource()
    },
  })

  ctx.effect(() => {
    const storage = new AsyncLocalStorage<OpenCodeSessionRequest>()
    const formatter = new OpenCodeSessionFormatter()
    const listenerDisposer = ctx.on('llm/stream', (...args: unknown[]) => {
      const next = args[1]
      if (typeof next !== 'function') return undefined
      const source = next as () => AsyncIterable<unknown>
      const request = requestContext(args[0], settingsSnapshot)
      const stream = source()
      return request === undefined ? stream : wrapStream(stream, storage, request)
    })

    const originalFetch = globalThis.fetch
    if (typeof originalFetch !== 'function') {
      console.warn(LOG_PREFIX, 'global fetch unavailable; OpenCode session Header disabled')
      return () => {
        if (typeof listenerDisposer === 'function') listenerDisposer()
        storage.disable()
      }
    }

    const patchedFetch: typeof fetch = (input, init) => fetchWithSession(
      formatter,
      storage,
      settingsSnapshot,
      originalFetch,
      input,
      init,
    )
    globalThis.fetch = patchedFetch

    return () => {
      if (typeof listenerDisposer === 'function') listenerDisposer()
      storage.disable()
      if (globalThis.fetch === patchedFetch) globalThis.fetch = originalFetch
    }
  }, 'dsh-thinking-effort: OpenCode session Header')
}
```

</details>

**依据 5 · 源码核查**：[src/host/opencode-session.ts:92-153](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/opencode-session.ts#L92-L153)

迭代结束/异常撤销active。

<details>
<summary>查看原文（62行）</summary>

```text
function wrapStream<T>(
  source: AsyncIterable<T>,
  storage: AsyncLocalStorage<OpenCodeSessionRequest>,
  request: OpenCodeSessionRequest,
): AsyncIterable<T> {
  return {
    [Symbol.asyncIterator](): AsyncIterableIterator<T> {
      const iterator = source[Symbol.asyncIterator]() as AsyncIterator<T, unknown, unknown>
      const iteratorRequest: OpenCodeSessionRequest = { ...request, active: true }
      const deactivate = (): void => {
        iteratorRequest.active = false
      }
      const run = <R>(operation: () => R): R => storage.run(iteratorRequest, operation)
      const wrapped: AsyncIterableIterator<T> = {
        next(value?: unknown): Promise<IteratorResult<T>> {
          return run(async () => {
            try {
              const result = await iterator.next(value)
              if (result.done) deactivate()
              return result
            } catch (error) {
              deactivate()
              throw error
            }
          })
        },
        return(value?: unknown): Promise<IteratorResult<T>> {
          if (iterator.return === undefined) {
            deactivate()
            return Promise.resolve({ done: true, value: value as T })
          }
          return run(async () => {
            try {
              const result = await iterator.return!(value)
              deactivate()
              return result
            } catch (error) {
              deactivate()
              throw error
            }
          })
        },
        throw(error?: unknown): Promise<IteratorResult<T>> {
          if (iterator.throw === undefined) {
            deactivate()
            return Promise.reject(error)
          }
          return run(async () => {
            try {
              const result = await iterator.throw!(error)
              if (result.done) deactivate()
              return result
            } catch (caught) {
              deactivate()
              throw caught
            }
          })
        },
        [Symbol.asyncIterator](): AsyncIterableIterator<T> {
          return this
        },
      }
```

</details>

**依据 6 · 源码核查**：[src/host/opencode-session-format.ts:493-500](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/opencode-session-format.ts#L493-L500)

脚本模式真实动态import。

```text
  private async importScript(path: string, mtimeMs: number): Promise<ScriptModule> {
    const url = `${pathToFileURL(path).href}?mtime=${mtimeMs}`
    const module = await import(url) as { format?: unknown; default?: unknown }
    const format = module.format ?? module.default
    if (typeof format !== 'function') {
      throw new Error('script must export a function named format (or a default function)')
    }
    return { format: (context: SessionFormatContext) => (format as (ctx: SessionFormatContext) => unknown)(context) }
```

#### 缺口

- 没有各网关请求回执与同任务结果，未穷尽compat/迁移/transport接管。
  **影响**：不能确定每个档位实际接受、费用与所有宿主兼容。
  **进一步探讨**：固定一个自定义provider，检查发出参数与返回，再对比已知任务的正确率/时延/费用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对直接编辑配置有什么增量和负担，卸载会恢复原设置吗？

**研究主题**：贡献与相对优势、依赖、兼容与流程、效果与总成本

#### 完整回答

价值是把手工模型档位映射、子Agent默认和兼容设置整理成可操作控制面，并适配新旧设置服务与宿主目录。默认补档只按用户层最小路径写，避免把schema/base默认永久钉住；这是比简单复制一份providers更细的工程取舍。推理本身、网关兼容传输和模型目录仍继承宿主/网关，不把增加选项算模型能力创新。

包0.3.12为Host与Web bundle，声明DSH>=0.1.0-rc.7，实际通过能力探测选择设置路径；现代设置按Loader Config，旧服务按命名空间。需要settings/timer/llm，slider还需modelDirectories，缺失时不注册该席位而设置页可继续。版本号声明不能替代实际Host能力与加载。

首次要备份profile和映射实际网关值，持续要跟踪网关参数、子Agent默认是否符合预算；提高思考档位可能增加token/时延，缺同任务费用数据，不说省钱。补档会持久改设置，卸载只解除监听/fetch包装，不自动撤销已写reasoningEfforts；退出应对照备份定向移除自己的字段，避免删其他模型配置。Header生成器脚本及映射增加维护负担，普通内建模型用户不必为界面变化采用。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/settings.ts:180-205](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/settings.ts#L180-L205)

不钉住默认值与数组层取舍。

<details>
<summary>查看原文（26行）</summary>

```text
 * No payload may quote `providers`, or the write pins the schema defaults the
 * entry took on (`input`, `compat`, `headers`, `thinkingBudgets`,
 * `defaultContextWindow`, …) into the user's document, and a later release
 * changing one of those defaults would never reach the user.
 *
 * A model array is addressed as a whole because the older settings service
 * walks paths through plain objects only: a numeric index would replace the
 * array with an object.
 *
 * That is also why a resolved entry the user's layer does not carry is reported
 * in `skipped` rather than materialized. The reason is not that the service
 * refuses the write: 0.1.7 accepts a `set` at `models[<userArrayLength>]` (its
 * bounds check allows an index equal to the length when the op is a `set` and
 * the path ends there), and a minimal `{ id, reasoningEfforts }` entry pins no
 * resolved field. The reason is the container. An array has no per-element
 * layer: `mergeLayers` replaces it wholesale (`if (!isPlainObject(under) ||
 * !isPlainObject(over)) return over`), so materializing a base-only entry in
 * the user's layer replaces the lower layer's copy of that entry. Its `name`,
 * `contextWindow`, `input`, `compat` and the rest are then lost from the
 * resolved section unless this fill restates them — the inflation this function
 * exists to avoid.
 *
 * A model override is a dict keyed by model id, so its partial entry does merge
 * over whatever a lower layer already describes. That asymmetry is the shape of
 * the two containers, not a preference: a lower-layer override is filled and
 * left minimal.
```

</details>

**依据 2 · 源码核查**：[src/host/settings.ts:306-344](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/settings.ts#L306-L344)

真实持久mutate。

<details>
<summary>查看原文（39行）</summary>

```text
async function fillDefaults(settings: HostSettings): Promise<FillOutcome> {
  if (settings.writable !== true) return { filled: 0 }
  // A section that is not readable yet (the namespace registers late, or the
  // entry-config form has not materialized) is retryable, not settled.
  const notYet: FillOutcome = { filled: 0 }

  const section = readSection(settings)
  if (!isUnknownRecord(section)) return notYet

  const user = readUserLayer(settings, SETTINGS_NAMESPACE)
  // The resolved section and the user's own layer are separate service reads
  // under the namespace model, so the resolved read can succeed while the layer
  // is still unavailable. Every entry then looks unreachable, and this fill
  // would settle on `remaining: 0` after one attempt where the old chain
  // re-checked; the retry is not speculative, it is the read the fill needs.
  if (!user.readable) return notYet

  const result = fillProviderDefaults(section.providers, user.providers)
  reportSkipped(result.skipped)
  // Every entry still missing a level that the user's own layer does not carry
  // is one a retry cannot reach either, so only the reachable remainder is
  // worth another attempt. `0` settles the startup chain.
  const reachable = result.skipped.missing - result.skipped.unmatched
  if (result.filled === 0) return { filled: 0, remaining: reachable }

  const mutate = settings.mutate
  if (typeof mutate !== 'function') {
    // A merge cannot address one element of an existing array, so a service
    // without `mutate` could only receive this fill by restating — and pinning
    // — the whole resolved provider subtree. Leave the levels alone instead.
    log('settings service cannot address paths; left', result.filled, 'model(s) unfilled')
    return { filled: 0, remaining: reachable }
  }

  await mutate.call(settings, SETTINGS_NAMESPACE, result.ops)
  mark(`filled-${result.filled}`)
  log('filled default thinking levels for', result.filled, 'model(s)')
  return { filled: result.filled, remaining: reachable }
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:8-15](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/index.ts#L8-L15)

硬依赖和Config导出。

```text
export const name = '@hytime/dsh-thinking-effort'
export const inject = ['settings', 'timer', 'llm'] as const

/**
 * The Loader entry's config schema. DSH 0.1.7 derives the settings form from
 * it, so it must stay exported from the package entry.
 */
export { Config } from './host/plugin-settings.js'
```

**依据 4 · 源码核查**：[src/client/thinking-slider/index.ts:84-124](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/client/thinking-slider/index.ts#L84-L124)

目录能力不满足时跳过。

<details>
<summary>查看原文（41行）</summary>

```text
    const modelDirectories = context.get('modelDirectories')
    if (!asModelDirectories(modelDirectories)) return

    const compatibility = modelDirectoryCompatibility(context)
    registered = true
    context.plugin({
      name: 'dsh-thinking-effort:composer-seat',
      inject: compatibility.inject,
      apply: (scope: ClientContext): void => {
        const scopedSlots = (scope as ClientContext & { slots?: ClientSlots }).slots
        if (scopedSlots === undefined) return
        const directories = asModelDirectories(scope.get('modelDirectories'))
        if (directories === undefined) return
        const resolveFace = createModelDirectoryFaceResolver(scope, directories)

        // Match the official ui-model-selection composition: slots.inject owns
        // the registration effect for the declaring plugin fiber and disposes
        // it when the fiber is unloaded or its slot declaration collapses.
        scopedSlots.inject(SEAT_NAME, () => scopedSlots.register(
          {
            name: SEAT_NAME,
            priority: SEAT_PRIORITY,
            locale: LOCALE_NS,
            inject: (sessionId: string) => resolveFace(sessionId),
          },
          (props: ComposerSeatInjected & { readonly locked?: boolean; readonly t: Translation }) => createElement(Slider, {
            directory: props.directory,
            load: props.load,
            select: props.select,
            locked: props.locked,
            t: props.t ?? translate,
          }),
        ))
      },
    })
  }

  // The official resolver is itself a plugin with service dependencies. It may
  // appear after this package's apply; probe now and retry on service updates.
  registerWhenReady()
  context.on('internal/service', (serviceName) => {
```

</details>

**依据 5 · 源码核查**：[package.json:1-8](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/package.json#L1-L8)

包版本与宿主声明。

```text
{
  "name": "@hytime/dsh-thinking-effort",
  "version": "0.3.12",
  "description": "为 DSH 的 pi-ai 第三方模型补充可配置的思考强度档位，并设置子 agent 默认思考强度。",
  "private": false,
  "engines": {
    "dsh": ">=0.1.0-rc.7"
  },
```

**依据 6 · 源码核查**：[src/host/opencode-session.ts:330-338](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/opencode-session.ts#L330-L338)

卸载只恢复自己包装。

```text
    globalThis.fetch = patchedFetch

    return () => {
      if (typeof listenerDisposer === 'function') listenerDisposer()
      storage.disable()
      if (globalThis.fetch === patchedFetch) globalThis.fetch = originalFetch
    }
  }, 'dsh-thinking-effort: OpenCode session Header')
}
```

#### 缺口

- 网关更新负担与整任务token/时延/人工费用未测。
  **影响**：无法判断净收益或单位合格答案成本。
  **进一步探讨**：备份profile后用同任务对比手改配置/插件，记录实际参数、正确答案、时延和总费用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么用户可试用，下一步值得验证什么？

**研究主题**：采用判断、新假设与验证

#### 完整回答

可试用于自己已知网关参数、愿意核请求的自定义模型用户。先用独立profile备份配置，只给一个provider/model补映射，做已知答案的小任务，再查子Agent是否使用预期档位；Header和脚本模式按需另开，内建模型不因多出选项就迁入。参数400、档位不符或费用超预期时停止覆盖，恢复备份或退原生控件/手改配置。

值得验证的是“有效推理设置回执”：显示用户选择、持久映射、实际子Agent选择和最终transport参数，区分未支持、被继承/覆盖以及网关拒绝。依据是当前多层声明与best-effort失败处理会让点击/配置看似成功；相对继续堆字段，增量是可核对的因果链。用故意错映射和子Agent继承场景比较错误识别、无效调用和人工排障时间；若宿主已有等效追踪或回执不能减少误判，则方向不成立。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/subagent.ts:130-180](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/subagent.ts#L130-L180)

选择/请求覆盖及失败日志动因。

<details>
<summary>查看原文（51行）</summary>

```text
/** Select a new-host subagent's configured effort before its first model step. */
export function handleAgentCreated(ctx: Pick<HostContext, 'settings' | 'fiber'>, payload: unknown): void {
  const agent = subagentAgentOf(payload)
  if (agent === undefined) return
  const model = isUnknownRecord(agent.model) ? agent.model : undefined
  const current = model?.current
  const select = model?.select
  if (model === undefined || typeof current !== 'function' || typeof select !== 'function') return

  try {
    const selection: unknown = Reflect.apply(current, model, [])
    if (!isAgentRequestConfig(selection)
      || typeof selection.provider !== 'string'
      || typeof selection.model !== 'string') return
    const effort = resolveSubagentEffort(
      ctx.settings,
      selection,
      log,
      settingsEntryId(ctx, OPENCODE_SESSION_NAMESPACE),
    )
    if (effort === undefined || effort === selection.reasoningEffort) return
    Reflect.apply(select, model, [{
      provider: selection.provider,
      model: selection.model,
      reasoningEffort: effort,
    }])
  } catch (error) {
    log('subagent model selection error:', error instanceof Error ? error.message : String(error))
  }
}

export async function handleAgentRequest(
  ctx: Pick<HostContext, 'settings' | 'fiber'>,
  payload: unknown,
  next: () => Promise<unknown>,
): Promise<unknown> {
  const config = await next()
  try {
    const agent = subagentAgentOf(payload)
    if (agent === undefined || !isAgentRequestConfig(config) || hasAgentModelSelection(agent)) return config
    const effort = resolveSubagentEffort(
      ctx.settings,
      config,
      log,
      settingsEntryId(ctx, OPENCODE_SESSION_NAMESPACE),
    )
    return effort === undefined ? config : { ...config, reasoningEffort: effort }
  } catch (error) {
    log('agent/request override error:', error instanceof Error ? error.message : String(error))
    return config
  }
```

</details>

**依据 2 · 源码核查**：[src/client/thinking-slider/slider.tsx:253-275](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/client/thinking-slider/slider.tsx#L253-L275)

UI动作和实际结果分离。

<details>
<summary>查看原文（23行）</summary>

```text
  const submit = (selection: ModelSelection): void => {
    if (locked || select === undefined) return
    const pending = select(selection)
    void pending.then(() => {}, () => {})
  }

  const onRangeChange = (event: ChangeEvent<HTMLInputElement>): void => {
    if (current === null) return
    const effort = efforts[Number(event.currentTarget.value)]
    if (effort === undefined) return
    submit({ provider: current.provider, model: current.model, reasoningEffort: effort.id })
  }

  const submitModel = (choice: ModelChoice): void => {
    const sameModel = choice.provider === current?.provider && choice.model.id === current?.model
    const reasoningEffort = sameModel
      ? current?.reasoningEffort ?? choice.model.reasoning?.defaultEffort
      : choice.model.reasoning?.defaultEffort
    submit({
      provider: choice.provider,
      model: choice.model.id,
      ...reasoningEffort === undefined ? {} : { reasoningEffort },
    })
```

</details>

**依据 3 · 源码核查**：[src/host/settings.ts:306-344](https://github.com/hytime/dsh-thinking-effort/blob/de3262adcf4f031cd4cda3bf3b54f40f857ab10e/src/host/settings.ts#L306-L344)

持久控制面路径。

<details>
<summary>查看原文（39行）</summary>

```text
async function fillDefaults(settings: HostSettings): Promise<FillOutcome> {
  if (settings.writable !== true) return { filled: 0 }
  // A section that is not readable yet (the namespace registers late, or the
  // entry-config form has not materialized) is retryable, not settled.
  const notYet: FillOutcome = { filled: 0 }

  const section = readSection(settings)
  if (!isUnknownRecord(section)) return notYet

  const user = readUserLayer(settings, SETTINGS_NAMESPACE)
  // The resolved section and the user's own layer are separate service reads
  // under the namespace model, so the resolved read can succeed while the layer
  // is still unavailable. Every entry then looks unreachable, and this fill
  // would settle on `remaining: 0` after one attempt where the old chain
  // re-checked; the retry is not speculative, it is the read the fill needs.
  if (!user.readable) return notYet

  const result = fillProviderDefaults(section.providers, user.providers)
  reportSkipped(result.skipped)
  // Every entry still missing a level that the user's own layer does not carry
  // is one a retry cannot reach either, so only the reachable remainder is
  // worth another attempt. `0` settles the startup chain.
  const reachable = result.skipped.missing - result.skipped.unmatched
  if (result.filled === 0) return { filled: 0, remaining: reachable }

  const mutate = settings.mutate
  if (typeof mutate !== 'function') {
    // A merge cannot address one element of an existing array, so a service
    // without `mutate` could only receive this fill by restating — and pinning
    // — the whole resolved provider subtree. Leave the levels alone instead.
    log('settings service cannot address paths; left', result.filled, 'model(s) unfilled')
    return { filled: 0, remaining: reachable }
  }

  await mutate.call(settings, SETTINGS_NAMESPACE, result.ops)
  mark(`filled-${result.filled}`)
  log('filled default thinking levels for', result.filled, 'model(s)')
  return { filled: result.filled, remaining: reachable }
}
```

</details>

#### 缺口

- 试用和回执对照未执行，最终transport可观察能力未全核。
  **影响**：新方向效果与必要性尚未证实。
  **进一步探讨**：先确认宿主现有回执，再做错映射检出与成本对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
