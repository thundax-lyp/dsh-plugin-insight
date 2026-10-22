# dsh-effort-slider

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[97bf5c1](https://github.com/2768651338/dsh-effort-slider/tree/97bf5c1e5881ea0fcfb543844346fe86b87ff620)

<!-- BEGIN META -->
[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=yellow&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider) [![npm 30d 1,403](https://img.shields.io/static/v1?label=npm+30d&message=1%2C403&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)
<!-- END META -->

> **实现功能**：给DSH模型思考档位提供滑块反馈，并向pi-ai缺失声明的模型补写reasoningEfforts与方言配置。

> **核心亮点**：把可视滑块和宿主模型方言声明接合，少手动改配置。详见[Q01](#research-q01)。

> **风险与缺陷**：显示五档不证明端点支持，供给持久配置无卸载恢复，值等推归属与快速选择乱序需核。详见[Q03](#research-q03)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 滑块只是外观吗？](#detail-section-11)
  - [Q02 · 配置供给怎样避免覆盖用户？](#detail-section-12)
  - [Q03 · 持久变更和滑块写入有哪些边界？](#detail-section-13)
  - [Q04 · 工程与分阶段成本有什么证据？](#detail-section-14)
  - [Q05 · 采用和继续探讨方向是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：频繁调档且需要自定义模型在目录显示思考选项。详见[Q01](#research-q01)。

官方思考菜单与手配pi-ai方言，视觉便利不等提升推理能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 滑块 | 会话调档 | 宿主选择成功需核 |
| 方言供给 | 自定义目录/参数 | 非所有端点保证 |
| 快照防护 | 降覆盖 | 值等归属与恢复缺口 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 失效影响 |
| --- | --- | --- |
| DSH SettingsForms/llm | 供给 | 版本契约 |
| pi-ai方言与端点 | 真请求 | 显示不证明支持 |
| directory.select | 会话选择 | 并发顺序依宿主 |
| 原配置备份 | 恢复 | 卸载不还原 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份并选单route | 用户 | 方言可核 |
| 看供给日志 | 用户 | 不覆盖自定义 |
| 拖档核目录/请求 | 用户 | 最后值与端点一致 |
| 停用后查配置 | 用户 | 注入仍可能保留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 匹配宿主/原配置备份 | 核route端点方言 | 先备份pi-ai与核方言；初配工时未知 |
| 持续使用 | UI/WebGL与选择请求；所选模型档位另计 | 核最后档位/请求与错误态 | 插件不新增模型调用；所选档位的供应商费用/时延另计且未知 |
| 失败恢复 | 原pi-ai设置 | 人工撤注入/残compat | 卸载不还原持久供给；人工撤字段/残compat工时未知 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 调档可见 | 滑块/颜色/错误态 | 显示不等选择成功 |
| 自定义供给 | reasoningEfforts/compat | 端点可忽略/拒绝 |
| 降配置覆盖 | revision重核 | 旧宿主无CAS窗口 |

> **思考**：显示五档不证明端点支持，供给持久配置无卸载恢复，值等推归属与快速选择乱序需核。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把可视滑块和宿主模型方言声明接合，少手动改配置。详见[Q01](#research-q01)。

把可视滑块和宿主模型方言声明接合，少手动改配置。详见[Q01](#research-q01)。

生产纯逻辑测试与revision防旧轮可借鉴，需真实所有权/可恢复配置。详见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

显示五档不证明端点支持，供给持久配置无卸载恢复，值等推归属与快速选择乱序需核。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

备份后单route试用，核实际请求及最后选择。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

配置供给/revision与UI错误处理可查；端点真实效果、持久回滚和并发最终选择有限制。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/effort-core.ts、src/client/effort/EffortPanel.tsx、src/client/effort/directory.ts、test/host.spec.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定host供给/快照/卸载、effort-core映射/归属/合并、client选择错误与节流、代表生产纯逻辑测试；未穷尽WebGL与菜单DOM。
- 下一步：进一步从同值手配/残键/无CAS与select乱序核所有权和最后意图。

**分析版本**

- **仓库**：[2768651338/dsh-effort-slider](https://github.com/2768651338/dsh-effort-slider)
- **版本号**：0.5.1（[固定提交 97bf5c1](https://github.com/2768651338/dsh-effort-slider/tree/97bf5c1e5881ea0fcfb543844346fe86b87ff620)）
- **版本日期**：2026-10-20（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

研究注入所有权/原值比较恢复、端点能力契约及最后意图选择队列，比较错档与恢复成本。当前未验证。详见[Q05](#research-q05)。

进一步从同值手配/残键/无CAS与select乱序核所有权和最后意图。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2697 | — | — | 36270 |
| .js | source | 2 | 1760 | 1562 | 223 | — |
| .ts | source | 9 | 1938 | 1450 | 351 | — |
| .tsx | source | 1 | 426 | 321 | 85 | — |
| .mjs | test | 8 | 1416 | 1167 | 156 | — |
| .ts | test | 1 | 8 | 6 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=grey&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+created%3A2026-09-22T06%3A49%3A58.749Z..2026-10-22T06%3A49%3A58.749Z) [![近30天关闭 2](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=grey&logo=github&style=flat)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A49%3A58.749Z..2026-10-22T06%3A49%3A58.749Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**推理滑块怎样供给真实配置，显示/请求/模型行为和恢复责任如何区分？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 滑块只是外观吗？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

面向经常切模型思考档位的DSH用户，滑块连续拖动、松手吸附离散档，菜单/模型座位颜色和火焰反馈提高档位可见性。host另会对pi-ai配置中缺reasoning声明的自定义模型写reasoningEfforts/compat或目录modelOverrides，使宿主目录显示档位并交适配器翻译线上参数。贡献是UI加配置供给，不是增强模型本身推理能力。

“任何第三方模型真实生效”不能由能显示滑块或请求options含reasoningEffort推出，端点可能忽略/拒绝参数，off多数方言为null即不发参数而不一定关闭服务默认思考。Ultracode仅max显示名，不是新推理算法。成功应分别核UI选中、宿主选择保存、实际请求参数和目标端点行为，效率/正确率增益需要独立任务对照。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:33-37](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/README.md#L33-L37)

作者版本与效果主张。

```text
> 🔧 **v0.5.1** — DSH **0.2.1-rc.2** compatibility: volatile settings with live updates, revision-checked provisioning, resolved `RemoteResult` failures, nested model-label slots, menu focus/blur integration, and safe handling of unavailable models and Session changes. The bundle patch and client registration now use the same scoped package name. Live provisioning queues settings writes outside the active HMR transaction; CSS names and source maps stay stable across checkout paths. Includes real DSH browser validation.
>
> 🆕 **v0.5.0** — Evaluation-fix batch. Reliability: the panel splits loading / load-failed / unsupported into three states with a retry button; failed slider writes surface a transient red status instead of failing silently; user config edits made mid-provision are detected (the entry is re-read before `mutate`, conflicting rounds defer); every host provisioning failure path now logs a warning, and an unrecognized Effort row produces a one-time diagnostic. Panel UX: re-anchors on scroll/resize, closes on Esc / outside click / anchor unmount, and clicking the Effort row toggles it; tick dots and labels align with the real snap points; the slider carries `aria-label` / `aria-valuetext`; UI text is bilingual (zh/en, follows `<html lang>`). New `debugReport` option: per-route/per-model provisioning detail plus an optional read-only `llm/stream` tracer logging route/model/effort per request; a `?` help hint in the panel header points at `enabled` / dialect / `debugReport`. Also: GitHub Actions CI (typecheck + tests + build + stale-artifact gate), the WebGL fire no longer burns at 60 fps while invisible, and the npm package is renamed to `@txc2768651338/dsh-effort-slider` (the old unscoped `dsh-effort-slider` name is retired).
>
> 🆕 **v0.4.0** — Ported to DSH **0.2.0**: DSH replaced its settings service with `SettingsForms` (settings are now profile entry configs; `installSection` / `settings.get` / `settings/updated` are gone). The host half now locates the pi-ai profile entry (`llm-pi-ai`), reads it via `settings.describe()`, writes via `settings.mutate()`, and listens to `settings/document-updated`. The client half derives the current session from `retainedBy.mainView` (`SessionListState.current` was removed). Plugin options (`enabled` / `defaultDialect` / `routes`) live in the plugin's entry config, editable in the DSH settings page. DSH ≤ 0.1.5 is no longer supported (use v0.3.0 there).
```

**依据 2 · 源码核查**：[src/effort-core.ts:20-49](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L20-L49)

通用档与off映射。

<details>
<summary>查看原文（30行）</summary>

```text
/** 通用 5 档刻度 id（与客户端兜底刻度一致；pi-ai 原生词汇的子集）。 */
export const UNIVERSAL_EFFORT_IDS = ['off', 'low', 'medium', 'high', 'max'] as const

/** 通用 reasoning 元数据（注入给未声明 reasoning 的适配器模型）。 */
export function universalReasoning(defaultEffort: string = 'off'): {
  efforts: Array<{ id: string; name: string }>
  defaultEffort: string
} {
  return {
    efforts: [
      { id: 'off', name: 'OFF' },
      { id: 'low', name: 'Low' },
      { id: 'medium', name: 'Medium' },
      { id: 'high', name: 'High' },
      { id: 'max', name: 'Ultracode' },
    ],
    defaultEffort,
  }
}

/**
 * 每个线方言的线级映射：reasoningEfforts 字典（pi-ai THINKING_LEVELS 词汇），
 * off 恒为 null（pi-ai 语义：声明支持、不发参数），其余档位为线上拼写。
 */
const WIRE: Record<string, string | null> = {
  off: null,
  low: 'low',
  medium: 'medium',
  high: 'high',
  max: 'max',
```

</details>

**依据 3 · 源码核查**：[src/index.ts:391-403](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L391-L403)

只能追踪options非线上请求。

<details>
<summary>查看原文（13行）</summary>

```text
  // ——档位是否随请求下发（llm/stream 瀑布，只读透传）。线上翻译发生在
  // pi-ai 适配器内部、请求体不可见，因此只记录事实、不推断方言对错：
  // 追踪能证明「档位已下发」，剩下的嫌疑才收敛到线上翻译层。
  let traceInstalled = false
  const installRequestTrace = (): void => {
    if (!readConfig().debugReport || traceInstalled) return
    traceInstalled = true
    ctx.on('llm/stream', (options, next) => {
      if (readConfig().debugReport) {
        const purpose = options.purpose === undefined ? '' : ` purpose=${options.purpose}`
        ctx.logger.info(`effort-slider: [debug] request route=${options.provider} model=${options.model} effort=${options.reasoningEffort ?? '(none)'}${purpose}`)
      }
      return next()
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 配置供给怎样避免覆盖用户？

**研究主题：**功能与机制、依赖、兼容与流程

#### 完整回答

host用settings.describe定位llm-pi-ai条目，失配时以listConfigurableProviders的settingsNs交叉找；目录能力解析用于避原生reasoning，失败不缓存为无能力。纯逻辑对false/自定义字典跳过，缺失或“与任一插件方言字典完全相等”则当可供给，openai-completions才补compat。显式models必须整个数组set以适应宿主path规则，目录路由则按modelOverrides写。

提交前重读revision或deepEqual快照，配置/停用变化也放弃旧轮；mutate带expected revision，队列与HMR外执行用于避自触发重挂。支持八方言不代表所有端点语义均测。依赖DSH0.2.1系SettingsForms mutate/volatile、llm目录和pi-ai协议翻译；package只有开发依赖/无engines提示，实际运行来自打包和宿主，安装应按固定匹配版本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:130-156](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L130-L156)

条目定位。

<details>
<summary>查看原文（27行）</summary>

```text
  const forms = (): SettingsForm[] => {
    try {
      return (settings.describe() ?? []) as SettingsForm[]
    } catch {
      return []
    }
  }

  /**
   * 定位 pi-ai 条目 id。优先按约定 id 直配；失配（条目被改名）时用 llm 的
   * 可配置提供方目录交叉定位——pi-ai 目录条目携带它自己的 settingsNs。
   */
  let piAiNs: string | undefined
  const findPiAiNs = (): string | undefined => {
    const all = forms()
    const direct = all.find((form) => form.ns === PI_AI_DEFAULT_NS)
    if (direct !== undefined && isPiAiValue(direct.value)) return direct.ns
    let directoryNs: Set<string> | undefined
    try {
      directoryNs = new Set(llm.listConfigurableProviders().map((entry) => entry.settingsNs))
    } catch {
      directoryNs = undefined
    }
    for (const form of all) {
      if (directoryNs?.has(form.ns) === true && isPiAiValue(form.value)) return form.ns
    }
    return undefined
```

</details>

**依据 2 · 源码核查**：[src/index.ts:191-206](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L191-L206)

能力判定。

<details>
<summary>查看原文（16行）</summary>

```text
  // ---- 1. 线级供给：为 pi-ai 自定义模型补写 reasoningEfforts / compat ----
  const nativeReasoning = new Map<string, boolean>()
  const hasNativeReasoning = async (route: string, modelId: string): Promise<boolean> => {
    const key = `${route}\u0000${modelId}`
    const memo = nativeReasoning.get(key)
    if (memo !== undefined) return memo
    try {
      const info = await llm.resolveModelInfo(route, modelId)
      const result = info?.reasoning !== undefined
      nativeReasoning.set(key, result)
      return result
    } catch (error) {
      // 解析异常 ≠ 确认无原生 reasoning：异常不进缓存（否则网络抖动期间会把
      // 原生 reasoning 模型永久误判，进而向它写 modelOverrides），只记日志并
      // 按「本轮未知」处理。
      ctx.logger.warn(`effort-slider: resolveModelInfo(${route}, ${modelId}) failed — treated as no native reasoning for this round`)
```

</details>

**依据 3 · 源码核查**：[src/effort-core.ts:192-234](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L192-L234)

用户声明/整数组。

<details>
<summary>查看原文（43行）</summary>

```text
export function injectedModels(
  profile: PiAiProfile,
  dialect: WireDialect,
  apiOf: (modelId: string) => string | undefined,
  onDecision?: InjectedModelDecision,
): { models: Array<Record<string, unknown>>; changed: boolean } {
  const models = profile.models ?? []
  let changed = false
  const next = models.map((entry) => {
    const result: Record<string, unknown> = { ...(entry as Record<string, unknown>) }
    // 用户显式声明（false 或自定义字典）一律尊重，原样保留。
    if (entry.reasoningEfforts === false) {
      onDecision?.(entry.id, 'skip-user-false')
      return result
    }
    if (entry.reasoningEfforts !== undefined && !isOurInjection(entry.reasoningEfforts)) {
      onDecision?.(entry.id, 'skip-user-custom')
      return result
    }
    const api = apiOf(entry.id) ?? profile.api
    const injection = wireFor(dialect, api === 'openai-completions')
    const fields: Array<'reasoningEfforts' | 'compat'> = []
    if (!deepEqualJson(entry.reasoningEfforts, injection.reasoningEfforts)) {
      result.reasoningEfforts = injection.reasoningEfforts
      changed = true
      fields.push('reasoningEfforts')
    }
    if (injection.compat !== undefined) {
      const compat = (entry.compat ?? {}) as Record<string, unknown>
      const patch: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(injection.compat)) {
        if (compat[key] !== value) patch[key] = value
      }
      if (Object.keys(patch).length > 0) {
        result.compat = { ...compat, ...patch }
        changed = true
        fields.push('compat')
      }
    }
    onDecision?.(entry.id, fields.length > 0 ? 'write' : 'skip-current', fields.length > 0 ? fields : undefined, api)
    return result
  })
  return { models: next, changed }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:316-342](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L316-L342)

revision提交。

<details>
<summary>查看原文（27行）</summary>

```text
    // 竞态防御：上面的 ops 基于先前快照计算，而 models 只能整数组替换——
    // 若快照读取后用户恰好在设置页编辑了 pi-ai 条目，这次写入会覆盖用户的
    // 修改，且写入后的幂等回声会掩盖丢失。mutate 前重读一次，快照已前移
    // （revision 变化或值不再一致）就放弃本轮：用户的编辑会触发
    // document-updated，下一轮供给基于新快照自然重来。
    const reread = forms().find((form) => form.ns === targetNs)
    const unchanged = entry !== undefined && reread !== undefined && (
      (typeof entry.revision === 'number' && typeof reread.revision === 'number')
        ? reread.revision === entry.revision
        : deepEqualJson(entry.value, reread.value)
    )
    if (!unchanged) {
      ctx.logger.info('effort-slider: pi-ai entry changed during provisioning — deferring to the newer edit')
      return true
    }
    // volatile 配置可在等待模型目录期间原地更新；停用/切换方言后不提交旧轮次。
    if (disposed || !deepEqualJson(cfg, readConfig())) return true
    if (cfg.debugReport) {
      // 明细替代单行计数（P3-1）：逐路由逐模型报告写入了什么、为何跳过。
      emitDebugReport(report, ops.length)
    } else {
      ctx.logger.info(`effort-slider: provisioning ${ops.length} field(s) across pi-ai models`)
    }
    try {
      await settings.mutate(targetNs, ops, typeof entry.revision === 'number' ? entry.revision : undefined)
      // 目录模型的原生 reasoning 判定可能因刚写入的声明而过期，下次重新解析。
      nativeReasoning.clear()
```

</details>

**依据 5 · 源码核查**：[src/effort-core.ts:8-17](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L8-L17)

八方言。

<details>
<summary>查看原文（10行）</summary>

```text
export const DIALECT_KEYS = [
  'effort',
  'deepseek',
  'openrouter',
  'together',
  'zai',
  'qwen',
  'string-thinking',
  'ant-ling',
] as const
```

</details>

**依据 6 · 源码核查**：[package.json:39-65](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/package.json#L39-L65)

宿主开发版本。

<details>
<summary>查看原文（27行）</summary>

```text
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.5",
    "@deepseek-ai/cordis-plugin-group": "1.0.5",
    "@deepseek-ai/cordis-plugin-include": "1.0.10",
    "@deepseek-ai/cordis-plugin-loader": "1.0.6",
    "@deepseek-ai/dsh-api-session-controller": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-store": "0.2.1-rc.2",
    "@deepseek-ai/dsh-client-ui-model-selection": "0.2.1-rc.2",
    "@deepseek-ai/dsh-llm": "0.2.1-rc.2",
    "@deepseek-ai/dsh-settings": "0.2.1-rc.2",
    "@deepseek-ai/schemastery": "^3.18.5",
    "@types/node": "^24.13.4",
    "@types/react": "^18.3.31",
    "@types/react-dom": "^18.3.7",
    "immer": "^10.2.0",
    "jsdom": "^30.0.1",
    "lightningcss": "^1.33.0",
    "playwright": "^1.64.1",
    "react": "18.3.1",
    "react-dom": "18.3.1",
    "tsdown": "^0.22.14",
    "typescript": "^5.9.3",
    "yaml": "^2.9.1",
    "zustand": "~4.5.7"
  },
  "repository": {
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久变更和滑块写入有哪些边界？

**研究主题：**缺陷与关键质疑

#### 完整回答

供给直接持久改其他pi-ai条目，dispose只停retry/disposed，不回滚已写reasoningEfforts/compat；enabled=false停止新供给不恢复旧配置。isOurInjection靠值相等推归属，用户手工写了恰好相同字典也会被当插件注入而随方言更新，缺明确所有权/原值备份。compat按当前注入合并，方言切换时旧方言额外键不一定删除，不能把换路由方言当干净配置替换。无revision时重读deepEqual到mutate之间仍有窗口，强CAS要宿主支持。

客户端每16ms最多写一次但不串行等待，pointerup/blur再补发；writeSeq只压旧错误显示，不取消旧select或防服务端乱序落地。失败时不回退滑块，header短暂红色提示，所以显示位置不等实际选择成功。共享directory.select返回RemoteResult有显式错误转换，是积极改进；快速拖动/切会话的真实最终排序仍依宿主。

#### 证据与依据

**依据 1 · 源码核查**：[src/effort-core.ts:146-150](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L146-L150)

值等推归属。

```text
/** 判断一个 reasoningEfforts 值是否与我们任一方言的注入一致（即由本插件写入）。 */
export function isOurInjection(reasoningEfforts: unknown): boolean {
  if (reasoningEfforts === null || typeof reasoningEfforts !== 'object') return false
  return DIALECT_KEYS.some((dialect) =>
    deepEqualJson(reasoningEfforts, wireFor(dialect, true).reasoningEfforts)
```

**依据 2 · 源码核查**：[src/effort-core.ts:219-228](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L219-L228)

compat合并。

<details>
<summary>查看原文（10行）</summary>

```text
    if (injection.compat !== undefined) {
      const compat = (entry.compat ?? {}) as Record<string, unknown>
      const patch: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(injection.compat)) {
        if (compat[key] !== value) patch[key] = value
      }
      if (Object.keys(patch).length > 0) {
        result.compat = { ...compat, ...patch }
        changed = true
        fields.push('compat')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:316-342](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L316-L342)

弱快照与强revision。

<details>
<summary>查看原文（27行）</summary>

```text
    // 竞态防御：上面的 ops 基于先前快照计算，而 models 只能整数组替换——
    // 若快照读取后用户恰好在设置页编辑了 pi-ai 条目，这次写入会覆盖用户的
    // 修改，且写入后的幂等回声会掩盖丢失。mutate 前重读一次，快照已前移
    // （revision 变化或值不再一致）就放弃本轮：用户的编辑会触发
    // document-updated，下一轮供给基于新快照自然重来。
    const reread = forms().find((form) => form.ns === targetNs)
    const unchanged = entry !== undefined && reread !== undefined && (
      (typeof entry.revision === 'number' && typeof reread.revision === 'number')
        ? reread.revision === entry.revision
        : deepEqualJson(entry.value, reread.value)
    )
    if (!unchanged) {
      ctx.logger.info('effort-slider: pi-ai entry changed during provisioning — deferring to the newer edit')
      return true
    }
    // volatile 配置可在等待模型目录期间原地更新；停用/切换方言后不提交旧轮次。
    if (disposed || !deepEqualJson(cfg, readConfig())) return true
    if (cfg.debugReport) {
      // 明细替代单行计数（P3-1）：逐路由逐模型报告写入了什么、为何跳过。
      emitDebugReport(report, ops.length)
    } else {
      ctx.logger.info(`effort-slider: provisioning ${ops.length} field(s) across pi-ai models`)
    }
    try {
      await settings.mutate(targetNs, ops, typeof entry.revision === 'number' ? entry.revision : undefined)
      // 目录模型的原生 reasoning 判定可能因刚写入的声明而过期，下次重新解析。
      nativeReasoning.clear()
```

</details>

**依据 4 · 源码核查**：[src/index.ts:415-422](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L415-L422)

卸载不撤持久字段。

```text
  ctx.effect(
    () => () => {
      disposed = true
      if (retryTimer !== null) clearTimeout(retryTimer)
      retryTimer = null
    },
    'ui-effort-slider: provisioning retry cleanup',
  )
```

**依据 5 · 源码核查**：[src/client/effort/EffortPanel.tsx:250-294](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/client/effort/EffortPanel.tsx#L250-L294)

并发写/错误/commit。

<details>
<summary>查看原文（45行）</summary>

```text
    // 新一笔写入开始：上一笔的失败态就此过时。
    setWriteError(false)
    if (writeErrorTimerRef.current !== null) {
      clearTimeout(writeErrorTimerRef.current)
      writeErrorTimerRef.current = null
    }
    void selectEffort(directory, {
      provider: current.provider,
      model: current.model,
      reasoningEffort: effort.id,
    }).catch((error: unknown) => {
      console.warn('[effort-slider] selectModel failed:', error)
      // 已被更新的写入取代：旧写入的迟到拒绝不再显示。
      if (seq !== writeSeqRef.current) return
      // 不回退滑块位置（用户可直接重拖）；header 状态文字短暂切换为错误态。
      setWriteError(true)
      writeErrorTimerRef.current = setTimeout(() => {
        writeErrorTimerRef.current = null
        setWriteError(false)
      }, WRITE_ERROR_VISIBLE_MS)
    })
  }
  const lastWriteRef = useRef(0)

  const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
    if (!usable) return
    const v = Number((event.target as HTMLInputElement).value)
    setRawValue(v)
    // 每帧最多一次写入，避免拖动中请求堆积造成尾部延迟。
    const now = performance.now()
    if (now - lastWriteRef.current >= 16) {
      lastWriteRef.current = now
      writeEffort(v)
    }
  }

  /** 松手/失焦/键盘结束时吸附到最近档位并补发一次确认。 */
  const commit = (event: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!usable) return
    const v = Number((event.target as HTMLInputElement).value)
    const idx = Math.round(v / step100)
    setRawValue(idx * step100)
    setDragging(false)
    writeEffort(v)
  }
```

</details>

**依据 6 · 源码核查**：[src/client/effort/directory.ts:106-109](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/client/effort/directory.ts#L106-L109)

RemoteResult拒绝。

```text
/** 兼容旧版 rejection 与 0.2.1 的 RemoteResult，且接住同步抛错。 */
export async function selectEffort(directory: ModelDirectoryLike, selection: DirectorySelection): Promise<void> {
  const result = await directory.select(selection)
  if (result?.ok === false) throw new Error(`${result.error.code}: ${result.error.message}`)
```

#### 缺口

- 真实宿主对并发select的排序/最后一次意图与端点档位语义
  **影响：**滑块显示和请求选项不能单独证明实际最后档位与模型效果
  **进一步探讨：**用延迟乱序select和固定端点请求样例对照，核最终目录与实际请求

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 工程与分阶段成本有什么证据？

**研究主题：**效果与总成本、工程质量与复用

#### 完整回答

纯effort-core、host provisioning和client directory分离，测试直接导入纯逻辑检查false/custom跳过与整数组补丁，比复制实现更能守契约。宿主revision快照检查、配置旧轮失效和错误显示是值得复用的工程细节；README真实浏览器验证为作者声称，本次只读关键测试不执行。

首次需备份pi-ai配置、按route明确方言并确认端点支持，不只是改外观。持续拖动频繁select调用及WebGL渲染占客户端资源，host目录枚举/能力解析和配置更新亦有开销；开启debug记录route/model/effort，不记录请求正文但可能包含项目服务名。插件不新增模型请求，所选高档位可能改变真实延迟/token与供应商收费，未提供统一效果/成本对照。失败恢复需比对原配置/当前字段并人工撤销注入，卸载不会还原；错误方言可能使模型调用失败。

#### 证据与依据

**依据 1 · 源码核查**：[test/host.spec.mjs:1-40](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/test/host.spec.mjs#L1-L40)

导入生产纯逻辑测试。

<details>
<summary>查看原文（40行）</summary>

```text
/**
 * 宿主侧纯逻辑单测（node 原生类型剥离直接导入 TS 源码）。
 * 运行：node test/host.spec.mjs
 */
import {
  DIALECT_KEYS,
  buildProvisionOps,
  dialectAppliesNote,
  isOurInjection,
  universalReasoning,
  wireFor,
} from '../src/effort-core.ts'

let failures = 0
function assert(cond, msg) {
  if (!cond) { failures++; console.error('FAIL:', msg) }
  else console.log('ok:', msg)
}
const json = (v) => JSON.stringify(v)

// ---- universalReasoning ----
const u = universalReasoning('off')
assert(json(u.efforts.map((e) => e.id)) === json(['off', 'low', 'medium', 'high', 'max']), 'universal ids are off/low/medium/high/max')
assert(u.efforts[u.efforts.length - 1].name === 'Ultracode', 'max level is named Ultracode')
assert(u.defaultEffort === 'off', 'default effort off')

// ---- wireFor dialects ----
assert(json(wireFor('effort', true)) === json({ reasoningEfforts: { off: null, low: 'low', medium: 'medium', high: 'high', max: 'max' }, compat: { supportsReasoningEffort: true } }), 'effort dialect: verbatim levels + supportsReasoningEffort')
assert(wireFor('effort', false).compat === undefined, 'effort dialect: no compat on non-openai-completions')
assert(json(wireFor('deepseek', true).compat) === json({ thinkingFormat: 'deepseek', supportsReasoningEffort: true }), 'deepseek dialect compat')
assert(wireFor('openrouter', true).reasoningEfforts.off === 'none', 'openrouter off maps to none')
assert(json(wireFor('qwen', true).compat) === json({ thinkingFormat: 'qwen' }), 'qwen dialect compat')
assert(DIALECT_KEYS.length === 8, '8 dialects')

// ---- buildProvisionOps: models array ----
const profile = { models: [{ id: 'm1' }, { id: 'm2', reasoningEfforts: false }, { id: 'm3', reasoningEfforts: { off: null, low: 'x' } }] }
const ops = await buildProvisionOps('rt', profile, 'effort', (id) => id === 'm1' ? 'openai-completions' : undefined)
const paths = ops.map((o) => o.path.join('/'))
assert(paths.length === 1 && paths[0] === 'providers/rt/models', 'models branch emits ONE whole-array set op (path has no array index)')
const injected = ops[0].value
```

</details>

**依据 2 · 源码核查**：[src/index.ts:398-403](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L398-L403)

debug日志字段。

```text
    ctx.on('llm/stream', (options, next) => {
      if (readConfig().debugReport) {
        const purpose = options.purpose === undefined ? '' : ` purpose=${options.purpose}`
        ctx.logger.info(`effort-slider: [debug] request route=${options.provider} model=${options.model} effort=${options.reasoningEffort ?? '(none)'}${purpose}`)
      }
      return next()
```

**依据 3 · 源码核查**：[src/index.ts:415-422](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/index.ts#L415-L422)

恢复责任。

```text
  ctx.effect(
    () => () => {
      disposed = true
      if (retryTimer !== null) clearTimeout(retryTimer)
      retryTimer = null
    },
    'ui-effort-slider: provisioning retry cleanup',
  )
```

**依据 4 · 作者声明**：[README.md:33-35](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/README.md#L33-L35)

作者验证与UI工程说明。

```text
> 🔧 **v0.5.1** — DSH **0.2.1-rc.2** compatibility: volatile settings with live updates, revision-checked provisioning, resolved `RemoteResult` failures, nested model-label slots, menu focus/blur integration, and safe handling of unavailable models and Session changes. The bundle patch and client registration now use the same scoped package name. Live provisioning queues settings writes outside the active HMR transaction; CSS names and source maps stay stable across checkout paths. Includes real DSH browser validation.
>
> 🆕 **v0.5.0** — Evaluation-fix batch. Reliability: the panel splits loading / load-failed / unsupported into three states with a retry button; failed slider writes surface a transient red status instead of failing silently; user config edits made mid-provision are detected (the entry is re-read before `mutate`, conflicting rounds defer); every host provisioning failure path now logs a warning, and an unrecognized Effort row produces a one-time diagnostic. Panel UX: re-anchors on scroll/resize, closes on Esc / outside click / anchor unmount, and clicking the Effort row toggles it; tick dots and labels align with the real snap points; the slider carries `aria-label` / `aria-valuetext`; UI text is bilingual (zh/en, follows `<html lang>`). New `debugReport` option: per-route/per-model provisioning detail plus an optional read-only `llm/stream` tracer logging route/model/effort per request; a `?` help hint in the panel header points at `enabled` / dialect / `debugReport`. Also: GitHub Actions CI (typecheck + tests + build + stale-artifact gate), the WebGL fire no longer burns at 60 fps while invisible, and the npm package is renamed to `@txc2768651338/dsh-effort-slider` (the old unscoped `dsh-effort-slider` name is retired).
```

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 采用和继续探讨方向是什么？

**研究主题：**新假设与验证、采用判断

#### 完整回答

熟悉模型provider配置且匹配宿主者可试用，先备份并只给已确认方言的单route用，不把未声明reasoning等同实际支持五档。OFF核真实请求/端点默认；快速拖动后回官方模型目录看最终值，失败红色提示不能忽略。重要稳定profile、无法手工恢复配置或要求所有第三方保证生效时暂缓。

进一步可研究明确注入所有权与原值快照、停用/卸载compare-before-restore，route能力先经端点契约而非显示声明；客户端last-intent队列/取消或服务端revision选择。基线为当前值等归属/merge和多并发select，反例包括手工同值字典、切方言残键、供给时外部编辑、无CAS宿主、select乱序与OFF端点默认思考。比较配置覆盖/恢复工时、最终错档率、请求参数与同任务质量/耗时，方向尚未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/effort-core.ts:146-150](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L146-L150)

归属基线。

```text
/** 判断一个 reasoningEfforts 值是否与我们任一方言的注入一致（即由本插件写入）。 */
export function isOurInjection(reasoningEfforts: unknown): boolean {
  if (reasoningEfforts === null || typeof reasoningEfforts !== 'object') return false
  return DIALECT_KEYS.some((dialect) =>
    deepEqualJson(reasoningEfforts, wireFor(dialect, true).reasoningEfforts)
```

**依据 2 · 源码核查**：[src/effort-core.ts:219-228](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/effort-core.ts#L219-L228)

合并基线。

<details>
<summary>查看原文（10行）</summary>

```text
    if (injection.compat !== undefined) {
      const compat = (entry.compat ?? {}) as Record<string, unknown>
      const patch: Record<string, unknown> = {}
      for (const [key, value] of Object.entries(injection.compat)) {
        if (compat[key] !== value) patch[key] = value
      }
      if (Object.keys(patch).length > 0) {
        result.compat = { ...compat, ...patch }
        changed = true
        fields.push('compat')
```

</details>

**依据 3 · 源码核查**：[src/client/effort/EffortPanel.tsx:250-294](https://github.com/2768651338/dsh-effort-slider/blob/97bf5c1e5881ea0fcfb543844346fe86b87ff620/src/client/effort/EffortPanel.tsx#L250-L294)

选择基线。

<details>
<summary>查看原文（45行）</summary>

```text
    // 新一笔写入开始：上一笔的失败态就此过时。
    setWriteError(false)
    if (writeErrorTimerRef.current !== null) {
      clearTimeout(writeErrorTimerRef.current)
      writeErrorTimerRef.current = null
    }
    void selectEffort(directory, {
      provider: current.provider,
      model: current.model,
      reasoningEffort: effort.id,
    }).catch((error: unknown) => {
      console.warn('[effort-slider] selectModel failed:', error)
      // 已被更新的写入取代：旧写入的迟到拒绝不再显示。
      if (seq !== writeSeqRef.current) return
      // 不回退滑块位置（用户可直接重拖）；header 状态文字短暂切换为错误态。
      setWriteError(true)
      writeErrorTimerRef.current = setTimeout(() => {
        writeErrorTimerRef.current = null
        setWriteError(false)
      }, WRITE_ERROR_VISIBLE_MS)
    })
  }
  const lastWriteRef = useRef(0)

  const onInput = (event: React.FormEvent<HTMLInputElement>): void => {
    if (!usable) return
    const v = Number((event.target as HTMLInputElement).value)
    setRawValue(v)
    // 每帧最多一次写入，避免拖动中请求堆积造成尾部延迟。
    const now = performance.now()
    if (now - lastWriteRef.current >= 16) {
      lastWriteRef.current = now
      writeEffort(v)
    }
  }

  /** 松手/失焦/键盘结束时吸附到最近档位并补发一次确认。 */
  const commit = (event: React.SyntheticEvent<HTMLInputElement>): void => {
    if (!usable) return
    const v = Number((event.target as HTMLInputElement).value)
    const idx = Math.round(v / step100)
    setRawValue(idx * step100)
    setDragging(false)
    writeEffort(v)
  }
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
