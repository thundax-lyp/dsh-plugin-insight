# dsh-reasoning-effort

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[33a2bea](https://github.com/HanaAyane/dsh-reasoning-effort/tree/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30)

<!-- BEGIN META -->
[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/HanaAyane/dsh-reasoning-effort) [![npm 30d 1,442](https://img.shields.io/static/v1?label=npm+30d&message=1%2C442&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ayanehana/dsh-reasoning-effort) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@ayanehana/dsh-reasoning-effort)
<!-- END META -->

> **功能**：在 DSH 原生模型选择器中用滑杆选择模型定义的推理档位，并提供自定义模型配置指引。

> **亮点**：[Q01](#research-q01) 用离散 ID 与刷新后投影确认支撑滑杆交互，保留原生搜索。增量在选择表达和状态同步，模型能力和实际推理由宿主/供应商提供。

> **主要限制**：[Q02](#research-q02) 本地取消或超时不撤销已发 RPC，目录选中不等于端点支持。原生 React 菜单形状及知识库协议提示仍需维护和人工核对。

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
  - [Q01 · 滑杆如何从模型定义得到级别并写到实际会话？](#detail-section-11)
  - [Q02 · 自定义模型、默认值和会话切换会怎样影响选择可信度？](#detail-section-12)
  - [Q03 · 安装与使用的边界和成本是什么？](#detail-section-13)
  - [Q04 · 能否让配置成功与供应商实际支持之间的差异可见？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：目录已暴露多个推理档位的 DSH 用户，可在原生模型入口中反复切档；目标是选值清楚，不是自动优化推理质量。

原生推理菜单与 /model 是同一宿主选择能力的替代入口，插件以滑杆和确认流程表达，不增加模型算法。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 推理档位滑杆 | 按当前模型级别切换强度 | 至少两档，不能创造供应商能力 |
| 选择确认 | 刷新目录、核对竞争和持久投影 | 不证明端点执行；本地取消不撤远程 |
| 配置指引 | 辅助缺档自定义模型声明 | 只读提示，协议需人工核对 |
| 外观开关 | 动画或普通按钮及原生入口退回 | RC 菜单树升级需适配 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=22.19、匹配 DSH RC | 启动必需声明 | bundle 与客户端 API | 不保证 alpha/未来 RC 兼容 |
| modelDirectories、sessions 与原生槽 | 交互必需 | 目录与会话选择 | 缺服务退出加载，树不匹配保留原界面 |
| 当前模型至少两档 | 滑杆必需 | 级别数量、名称和顺序 | 不自动创造档位，按需给设置指引 |
| settings/llm/connection | 指引时必需 | 读取配置与复用宿主请求边界 | 配置建议不能代替端点文档 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对作用域包与匹配 profile，去除重复旧插件 | 包身份、profile 与固定安装明确 |
| 加载 | 用户安装并重启对应 Host/桌面应用 | 原生模型入口仍可用 |
| 选择 | 用户在非关键会话切档，插件刷新并等投影 | /model 与目录最终值一致，错误不视为取消远端 |
| 退出 | 用户关闭滑杆恢复原生，必要时恢复手工配置 | 重新读取实际选择，勿只信本地预览 |

**效果与成本**

[Q03](#research-q03) 记录安装、持续、失败和退出成本，模型请求金额和操作耗时无实测。

[Q03](#research-q03) 分开选择便利、目录状态、配置辅助与模型结果，没有输出质量或节费结论。

> **思考**：[Q02](#research-q02) 本地取消或超时不撤销已发 RPC，目录选中不等于端点支持。原生 React 菜单形状及知识库协议提示仍需维护和人工核对。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 用离散 ID 与刷新后投影确认支撑滑杆交互，保留原生搜索。增量在选择表达和状态同步，模型能力和实际推理由宿主/供应商提供。

[Q01](#research-q01) 捕获 ID、刷新后二次复核和等投影有利于避免目录竞态误选。 [Q02](#research-q02) 保留本地取消与远端结果的区别；React 树包装是兼容负担，固定形状不匹配时保留原界面。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 本地取消或超时不撤销已发 RPC，目录选中不等于端点支持。原生 React 菜单形状及知识库协议提示仍需维护和人工核对。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 匹配 RC 且目录已有多档的个人会话可试用。先对照 /model 与刷新后目录，不在未确认时连点；超时、不支持或入口冲突就关闭滑杆并回原生核对，手工模型配置单独备份。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定代码的原生包装、选值确认与诊断链路已核；供应商执行、RC 兼容和使用收益未运行，假设保持未验证。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/effort-selection.ts、src/client/index.tsx、src/index.ts、src/knowledge.ts、src/client/native-selector.tsx、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件统计；定向读取宿主指引、知识库匹配、模型目录选择、原生菜单树包装、安装声明和客户端清理。未执行目标代码、构建、测试、宿主或模型调用；知识库条目不是当前供应商事实。
- 下一步：按 [Q03](#research-q03) 对照原生选值；按 [Q02](#research-q02) 记录取消后的迟到投影与去敏实际请求，独立核查协议和模型任务效果。

**分析版本**

- **仓库**：[HanaAyane/dsh-reasoning-effort](https://github.com/HanaAyane/dsh-reasoning-effort)
- **版本号**：0.9.1（[固定提交 33a2bea](https://github.com/HanaAyane/dsh-reasoning-effort/tree/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30)）
- **版本日期**：2026-10-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 设想把目录确认与同路由请求接受证据分层显示，减少配置误读；不偷偷触发付费探针，是否减少返工需实际对照。

按 [Q03](#research-q03) 对照原生选值；按 [Q02](#research-q02) 记录取消后的迟到投影与去敏实际请求，独立核查协议和模型任务效果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 19 | 1501 | — | — | 18638 |
| .js | source | 3 | 2758 | 2620 | 231 | — |
| .mjs | source | 3 | 531 | 484 | 12 | — |
| .ts | source | 6 | 1721 | 1471 | 177 | — |
| .tsx | source | 2 | 1490 | 1328 | 65 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=8&color=737b86&logo=github)](https://github.com/HanaAyane/dsh-reasoning-effort/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本插件怎样在原生模型选择器中提供可信的推理强度选择，何时只是模型元数据提示？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 滑杆如何从模型定义得到级别并写到实际会话？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

目标用户是在同一 DSH 会话中反复调整模型推理档位的人，合格结果是选中该模型确实声明的档位，且原生会话目录最终投影与之相符。原有办法是原生模型/推理菜单或 /model 命令，本插件保留原生搜索和模型列表，把推理页变成带名称和刻度的离散滑杆；动画只改外观，不是新推理机制。

sliderLevels 只使用当前 provider/model 的 reasoning.efforts，至少两档才提供滑杆。提交捕获 provider、model 和档位 ID，先拒绝忙碌或模型变化，再 directory.load 刷新；同时核对返回快照与当前 store，要求模型和原选择未被他人改动、目标档位仍存在。随后调用 directory.select，RPC 确认后仍等待 store 的 ready、无 pending 和相同档位投影。失败、超时、目录变动有明确错误，不按新目录中的数字位置误选另一档。

因此增量是更直观的操作与更谨慎的选择确认，选择能力和模型元数据仍来自宿主。选择投影只证明宿主状态同步，不证明下一次端点请求一定被供应商接受，也不证明更高档位在某任务更好。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-24](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/README.md#L19-L24)

作者定位是原生选择器内的滑杆和模型定义档位。

```text
模型列表、搜索和徽标沿用 DSH 原生界面；进入“推理等级”，用带圆点刻度与档位名称的滑块调整强度。八帧“大肥鱼”随拖动加速，调整后弹窗保持打开，选择结果与 `/model` 命令保持同步。

- **跟随模型档位**：自动适配档数、名称和顺序，提交失败时回滚。
- **贴合 DSH 界面**：支持深浅主题，简体中文与英文跟随 DSH 语言即时切换。
- **可选动态外观**：默认启用大肥鱼，支持普通按钮及系统“减少动态效果”设置。
- **按需配置指引**：缺少档位时优先展示图形界面设置路径；手工步骤和复制操作折叠到高级配置，已有有效档位不再提示。
```

**依据 2 · 源码核查**：[src/client/effort-selection.ts:12-25](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L12-L25)

档位来自当前模型，不创造统一固定档位。

<details>
<summary>查看原文（14行）</summary>

```text
export function currentModel(state: ModelDirectoryState) {
  const current = state.current
  return state.groups.find((group) => group.id === current?.provider)
    ?.models.find((model) => model.id === current?.model)
}

export function sliderLevels(state: ModelDirectoryState): readonly EffortLevel[] {
  const efforts = currentModel(state)?.reasoning?.efforts
  return efforts !== undefined && efforts.length >= 2 ? efforts : []
}

export function effortIndex(levels: readonly EffortLevel[], id: string | undefined): number {
  return levels.findIndex((level) => level.id === id)
}
```

</details>

**依据 3 · 源码核查**：[src/client/effort-selection.ts:99-134](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L99-L134)

刷新后复核模型、原选择和目标档位，再提交并等待。

<details>
<summary>查看原文（36行）</summary>

```text
/** Revalidate a captured route and effort ID, never a position in a new catalog. */
export async function selectEffort(
  directory: ModelDirectory,
  target: EffortSelection,
  signal: AbortSignal,
  t: ReasoningEffortTranslate,
  timeoutMs = 5000,
): Promise<ModelDirectoryState> {
  signal.throwIfAborted()
  const initial = directory.store.getSnapshot()
  const originalEffort = initial.current?.reasoningEffort
  if (!sameModel(initial.current, target)) throw new Error(t('effort.modelChanged'))
  if (initial.status === 'loading' || initial.status === 'selecting' || initial.pending !== null) {
    throw new Error(t('effort.busy'))
  }

  const fresh = await abortable(directory.load(), signal)
  signal.throwIfAborted()
  // load() returns a snapshot; a newer selection can start before this continuation.
  for (const state of [fresh, directory.store.getSnapshot()]) {
    if (!sameModel(state.current, target)) throw new Error(t('effort.modelChanged'))
    if (state.status === 'error') throw new Error(state.error ?? t('effort.unconfirmed'))
    if (state.status !== 'ready' || state.pending !== null) throw new Error(t('effort.busy'))
    if (state.current?.reasoningEffort !== originalEffort) {
      throw new Error(t('effort.selectionChanged'))
    }
    if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
      throw new Error(t('effort.unsupported', { effort: target.reasoningEffort }))
    }
  }

  const result = await abortable(directory.select(target), signal)
  signal.throwIfAborted()
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
  return waitForSelection(directory, target, signal, t, timeoutMs)
}
```

</details>

**依据 4 · 源码核查**：[src/client/effort-selection.ts:73-95](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L73-L95)

RPC 后以持久投影确认，并处理竞争变化与错误。

<details>
<summary>查看原文（23行）</summary>

```text
    const check = () => {
      if (signal.aborted) return abort()
      const state = directory.store.getSnapshot()
      if (state.pending !== null && (
        !sameModel(state.pending, target) || state.pending.reasoningEffort !== target.reasoningEffort
      )) {
        finish(undefined, new Error(t('effort.selectionChanged')))
      } else if (state.current !== null && !sameModel(state.current, target)) {
        finish(undefined, new Error(t('effort.modelChanged')))
      } else if (state.status === 'error') {
        finish(undefined, new Error(state.error ?? t('effort.unconfirmed')))
      } else if (sameModel(state.current, target) && state.status === 'ready' && state.pending === null) {
        if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
          finish(undefined, new Error(t('effort.unsupported', { effort: target.reasoningEffort })))
        } else if (state.current?.reasoningEffort === target.reasoningEffort) {
          finish(state)
        }
      }
    }
    unsubscribe = directory.store.subscribe(check)
    signal.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => finish(undefined, new Error(t('effort.unconfirmed'))), timeoutMs)
    check()
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:601-641](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/index.tsx#L601-L641)

真实滑杆提交调用 selectEffort，确认后才更新提交引用。

<details>
<summary>查看原文（41行）</summary>

```text
  const commit = useCallback(async (raw: number) => {
    if (committingRef.current || busy || directoryState.current === null) return
    const index = clampIndex(raw, levels.length)
    const next = levels[index]?.id
    if (next === undefined) return
    const target = {
      provider: directoryState.current.provider,
      model: directoryState.current.model,
      reasoningEffort: next,
    }
    const operation = new AbortController()
    selectionAbortRef.current = operation
    committingRef.current = true
    setDragging(false)
    setCommitting(true)
    setLocalError(null)
    previewRef.current = index
    setPreview(index)
    setEffort(next)

    try {
      const confirmed = await selectEffort(directory, target, operation.signal, t)
      if (selectionAbortRef.current !== operation) return
      const confirmedIndex = effortIndex(sliderLevels(confirmed), next)
      committedRef.current = next
      previewRef.current = confirmedIndex
      setEffort(next)
      setPreview(confirmedIndex)
    } catch (cause) {
      if (!operation.signal.aborted) {
        setLocalError(cause instanceof Error ? cause.message : String(cause))
      }
    } finally {
      if (selectionAbortRef.current === operation) {
        selectionAbortRef.current = null
        committingRef.current = false
        // Synchronization below resumes with the current directory, including
        // after a failed selection or a route change during the round-trip.
        if (!operation.signal.aborted) setCommitting(false)
      }
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 自定义模型、默认值和会话切换会怎样影响选择可信度？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

核心边界是模型声明、宿主选择、供应商执行三个层次。Host 指引只诊断用户自定义且完全缺少档位的模型；已有非空目录即使与知识库不同也信任，显式 reasoningEfforts:false 视作用户意图。它不自动写配置，而给出可复制字段或完整条目，复杂条目只提供插入块。复制指南不是端点兼容证明。

知识库按 provider/model 模式匹配，内置示例使用通配 provider 并带 OpenAI 风格 compat。源文件本身警告兼容块只适用于相应协议，而生成器不能检查所有路由协议；因此自定义端点应按实际协议核对，不因模型同名就照抄。这里没有请求端点，不能验证某示例是否会被当前供应商拒绝。Host 指引路由复用 connection.requestRejection，保留与宿主 API 相同的请求边界，不是自建一个无鉴权配置写接口。

会话/模型切换以及模型目录变动会中止本地等待并报错，但 abortable 的注释和实现明确不能取消已发出的 RPC。本地回到原显示或等待超时不能证明远端未改变，用户须重新读取目录或 /model。界面包装还依赖原生 React 菜单的 aria-label、三个子 pane 和行结构，结构不匹配时返回原树，这是安全退回的反证；它同时留下随宿主升级失效的维护耦合。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:355-409](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/index.ts#L355-L409)

只对缺档的自定义模型给指引，已有目录受信任，给出条目/字段片段。

<details>
<summary>查看原文（55行）</summary>

```text
  async function diagnose(provider: string, model: string): Promise<Guidance> {
    const storeShape = readStore()
    const entry = matchEntry(knowledgeOf(storeShape), provider, model)
    const current = await currentLevels(provider, model)
    const expected = entry === undefined ? [] : displayLevels(entry)
    const { declared, entryLine, entry: userEntry } = userDeclaredModel(provider, model)
    const path = await settingsPath()

    let reason: Guidance['reason'] = 'none'
    // Explicitly disabling reasoning is intentional. Trust every nonempty
    // catalog level set, even when it differs from our knowledge base.
    if (userEntry?.reasoningEfforts !== false && current.length === 0) {
      reason = 'missing'
    }

    // Guidance targets custom-provider declarations only; the built-in
    // catalog's data — including deliberately sparse level sets — is trusted.
    const needsGuide = declared && reason !== 'none'

    const modelIndent = usesProfileConfig ? 10 : 8
    const block = entry === undefined ? null : fieldBlock(entry, modelIndent)

    // Replace mode carries the complete entry head and declared levels, so the
    // whole-entry replacement cannot drop user data.
    // Insert mode: the entry carries fields this plugin cannot round-trip,
    // so only the field block is offered, to paste under the existing line.
    const head = entryHead(userEntry, model, modelIndent)
    const mode: Guidance['mode'] = head.complete ? 'replace' : 'insert'
    const builtIn = entry !== undefined && BUILTIN_ENTRIES.includes(entry)
    const noteKey = builtIn ? entry.noteKey ?? null : null
    const note = entry !== undefined && !builtIn ? entry.note ?? null : null

    const warning = endpointWarning(provider)

    return {
      provider,
      model,
      userDeclared: declared,
      needsGuide,
      reason,
      current,
      expected,
      matched: entry !== undefined,
      mode,
      noteKey,
      note,
      warning,
      entryHead: head.complete ? head.lines.join('\n') : null,
      fieldBlock: block,
      entryLine,
      entryPath: usesProfileConfig
        ? `[id: ${LLM_NS}].config.providers.${provider}.models`
        : `${LLM_NS}.providers.${provider}.models`,
      modelIndent,
      settingsPath: path ?? null,
```

</details>

**依据 2 · 源码核查**：[src/knowledge.ts:10-20](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/knowledge.ts#L10-L20)

知识库只生成配置提示，compat 与路由协议的限制被明确记录。

<details>
<summary>查看原文（11行）</summary>

```text
 * The Host half uses these entries ONLY to generate copy-ready YAML for
 * custom-provider models the directory does not describe. It never writes
 * settings itself and never overrides catalog-declared levels.
 *
 * A `compat` block is written verbatim into the generated snippet, and the
 * generator never sees the route's protocol: it cannot withhold the block from
 * a model whose wire protocol refuses those fields (`llm-pi-ai` rejects the
 * whole route instead of ignoring them). Set `compat` only where every route an
 * entry can match speaks `openai-completions`, and prefer leaving it out: an
 * absent block lets the adapter read the endpoint address, which is right for
 * an unrecognized endpoint and for a recognized vendor alike.
```

</details>

**依据 3 · 源码核查**：[src/knowledge.ts:56-94](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/knowledge.ts#L56-L94)

通配 provider 的内置字段仍需要用户核对实际端点协议。

<details>
<summary>查看原文（39行）</summary>

```text
/** Built-in entries; user entries (settings.yaml) take precedence. */
export const BUILTIN_ENTRIES: readonly KnowledgeEntry[] = [
  {
    id: 'glm-5.2',
    provider: '*',
    model: 'glm-5.2',
    noteKey: 'glm52',
    efforts: {
      minimal: 'minimal',
      low: 'low',
      medium: 'medium',
      high: 'high',
    },
    compat: { thinkingFormat: 'openai', supportsReasoningEffort: true },
  },
  {
    id: 'kimi-k3',
    provider: '*',
    model: 'kimi/kimi-k3',
    noteKey: 'kimiK3',
    efforts: {
      low: 'low',
      high: 'high',
      max: 'max',
    },
    compat: { thinkingFormat: 'openai', supportsReasoningEffort: true },
  },
  {
    id: 'kimi-k3-plain',
    provider: '*',
    model: 'kimi-k3',
    noteKey: 'kimiK3',
    efforts: {
      low: 'low',
      high: 'high',
      max: 'max',
    },
    compat: { thinkingFormat: 'openai', supportsReasoningEffort: true },
  },
```

</details>

**依据 4 · 源码核查**：[src/index.ts:448-476](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/index.ts#L448-L476)

指引路由复用宿主 connection 的身份/来源拒绝边界。

<details>
<summary>查看原文（29行）</summary>

```text
  ctx.inject(['connection', 'webServer'], (routeCtx) => {
    // `ctx.get` rather than the property proxy: both services are declared
    // above, so the callback only runs once they are active, and the global
    // store read is not sensitive to where in the fiber tree they were
    // provided.
    const connection = routeCtx.get('connection') as HostConnection | undefined
    const webServer = routeCtx.get('webServer') as HostWebServer | undefined
    if (connection === undefined || webServer === undefined) return
    routeCtx.effect(() => webServer.register({
      kind: 'prefix',
      path: RPC_CHANNEL,
      handler: async (request, response) => {
        const rejection = connection.requestRejection(request)
        if (rejection !== undefined) {
          response.writeHead(rejection)
          response.end(rejection === 401 ? 'unauthorized' : 'forbidden')
          return
        }
        const endpoint = endpointOf(request.url)
        if (request.method !== 'POST' || endpoint === undefined) {
          response.writeHead(404)
          response.end('not found')
          return
        }
        const mediaType = String(request.headers['content-type'] ?? '').split(';')[0]?.trim().toLowerCase()
        if (mediaType !== 'application/json') {
          response.writeHead(415)
          response.end('content type must be application/json')
          return
```

</details>

**依据 5 · 源码核查**：[src/client/effort-selection.ts:35-48](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L35-L48)

取消只停止本地等待，已经发送的 RPC 不可撤销。

<details>
<summary>查看原文（14行）</summary>

```text
/** Stop waiting locally; the directory API cannot cancel an already-sent RPC. */
function abortable<T>(promise: Promise<T>, signal: AbortSignal): Promise<T> {
  return new Promise((resolve, reject) => {
    const abort = () => reject(signal.reason)
    signal.addEventListener('abort', abort, { once: true })
    promise.then(
      (value) => { signal.removeEventListener('abort', abort); resolve(value) },
      (error: unknown) => { signal.removeEventListener('abort', abort); reject(error) },
    )
    if (signal.aborted) {
      signal.removeEventListener('abort', abort)
      abort()
    }
  })
```

</details>

**依据 6 · 源码核查**：[src/client/native-selector.tsx:25-67](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/native-selector.tsx#L25-L67)

包装依赖特定菜单树形状，不符合即保留原树。

<details>
<summary>查看原文（43行）</summary>

```text
export function wrapNativeSelector(Native: (props: NativeProps) => ReactNode, renderPanel: (props: NativeProps) => ReactNode) {
  return function NativeReasoningSelector(props: NativeProps) {
    const [effort, setEffort] = useState(false)
    const panelRef = useRef<HTMLDivElement>(null)
    // Always invoke the same native function, including all its hooks.
    const native = Native(props)
    let menuOpen = false
    const output = mapNativeTree(native, element => {
      if (element.props['aria-label'] !== props.t('menu.aria') || !Array.isArray(element.props.children)) return element
      const panes = element.props.children
      if (panes.length !== 3) return element
      menuOpen = true
      if (effort) return cloneElement(element, { role: 'group' },
        <div className="re-native-pane" ref={panelRef} tabIndex={-1} onBlur={event => {
          // Disabling the focused range during submission produces a blur with
          // no next target. Do not let the host interpret this as leaving the menu.
          // Outside clicks still close through the native document listener.
          if (event.relatedTarget === null) event.stopPropagation()
        }} onKeyDown={event => {
          if (event.key === 'Escape' || (event.key === 'Tab' && event.shiftKey && event.target === event.currentTarget)) {
            event.preventDefault(); event.stopPropagation(); setEffort(false)
          }
        }}>
          {renderPanel(props)}
        </div>)
      const root = panes[0]
      if (!isValidElement<{ children: ReactNode[] }>(root) || !Array.isArray(root.props.children)) return element
      const [modelRow, effortRow] = root.props.children
      if (!isValidElement<ElementProps>(modelRow)) return element
      const row = isValidElement<ElementProps>(effortRow)
        ? cloneElement(effortRow, { onClick: () => setEffort(true) })
        : cloneElement(modelRow, { key: 'reasoning-effort', ref: null, disabled: props.locked, onClick: () => setEffort(true) } as ElementProps,
            <span>{props.t('menu.effort')}</span>, <span aria-hidden="true">›</span>)
      return cloneElement(element, {
        onKeyDown: (event: KeyboardEvent<HTMLElement>) => {
          if (event.key !== 'ArrowDown' && event.key !== 'ArrowUp') return
          const rows = Array.from(event.currentTarget.querySelectorAll<HTMLButtonElement>('button[role="menuitem"]:not(:disabled)'))
          if (rows.length === 0) return
          event.preventDefault(); event.stopPropagation()
          const index = rows.indexOf(event.target as HTMLButtonElement)
          rows[(index + (event.key === 'ArrowDown' ? 1 : rows.length - 1) + rows.length) % rows.length]?.focus()
        },
      }, cloneElement(root, {}, modelRow, row), panes[1], panes[2])
```

</details>

#### 缺口

- 未核实际供应商协议和请求字段，也未观察取消后的迟到选择。
  **影响**：目录声明可用不等于端点执行成功，超时不能解释为没发生改变。
  **进一步探讨**：在固定宿主和隔离会话中记录取消/切模型后的最终目录与实际请求，不保留密钥，再按供应商对应协议文档核对字段。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装与使用的边界和成本是什么？

**研究主题**：采用判断、效果与总成本、依赖、兼容与流程

#### 完整回答

本轮建议匹配作者支持 RC、模型目录已有至少两档的个人会话小范围试用，目标是更清楚地选择已有档位。不要为出现更多滑杆位置而先给不明端点加配置。包声明 Node >=22.19、DSH >=0.2.1-rc.2 且 <0.3.0；固定 README 列出的支持版本是作者声明，不是本轮运行结果。带作用域包是本仓库发布身份，无作用域同名包被作者明确区分。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件下载与已有宿主环境；金额未知 | 核 profile、旧包冲突、重启与档位；耗时未知 | Web/Desktop 安装激活独立 |
| 持续使用 | 模型请求和所选档位的真实费用未知 | 比较目录/命令与滑杆，维护宿主兼容 | 无节费或推理收益对照 |
| 失败恢复 | 迟到请求的成本与作用未知 | 超时/取消后重读目录，再决定提交 | 本地 abort 不撤销 RPC |
| 升级与退出 | 保存自定义模型配置 | 关闭插件恢复原生入口，另行撤销手工配置 | 原生树适配须随版本核验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 选择表达 | 当前模型动态档位、离散提交 | 是否减少误选或缩短操作 |
| 状态确认 | 刷新、竞争复核、等待投影 | 供应商实际请求执行与迟到结果 |
| 配置辅助 | 只读诊断和复制片段 | 每个端点协议与模型能力 |
| 任务结果 | 沿用宿主选择与模型 | 质量、节时、成本收益均无对照 |

先在非关键会话对照原生目录或 /model，切换两档并观察刷新后的最终值；不应在提交未确认时连续补点。提示不支持、超时、原生入口冲突或显示与目录不符就停用滑杆，回原生选择器核对，并保留手工配置的备份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:31-34](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/package.json#L31-L34)

运行时和 DSH 版本条件应以固定声明读取，非全面兼容结果。

```text
  "engines": {
    "node": ">=22.19",
    "dsh": ">=0.2.1-rc.2 <0.3.0"
  },
```

**依据 2 · 作者声明**：[README.md:41-55](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/README.md#L41-L55)

作者支持 RC 范围，不泛化全部未来版本。

<details>
<summary>查看原文（15行）</summary>

```text
## 版本支持政策

本插件仅针对相对稳定的 **DSH RC 版本**进行适配、测试和问题修复，**不单独维护 alpha 版本**。alpha 阶段的客户端 API、依赖结构和插件加载机制可能频繁发生破坏性变更；持续兼容多个过渡版本会增加维护成本，也难以保证可靠性。

当前发行版为 **插件 `v0.9.1`**，支持 DSH `0.2.1-rc.2`、`0.2.1-rc.3` 和 `0.2.1-rc.5`，最低版本仍为 `0.2.1-rc.2`，适用于 Web 和 Desktop Profile。DSH `0.2.0` RC 用户请继续使用 [v0.8.1](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.8.1)。桌面端使用 DSH 的 Web 客户端界面，但有独立的插件安装与激活状态。DSH `0.1.x` 用户请继续使用 [v0.7.3](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.7.3)。RC 仍属于候选发布版本，不代表所有历史或未来 RC 都自动兼容。

| 项目 | 当前说明 |
| --- | --- |
| 插件发行版 | [v0.9.1](https://github.com/HanaAyane/dsh-reasoning-effort/releases/tag/v0.9.1) |
| Web | DSH `0.2.1-rc.2`、`0.2.1-rc.3`、`0.2.1-rc.5`；使用 `web` Profile |
| 桌面端 | DSH Desktop `0.2.1-rc.2`、`0.2.1-rc.3`、`0.2.1-rc.5`；使用 `desktop` Profile |
| 升级说明 | 安装 `v0.9.1` 后重新启动对应的 Web Host 或桌面应用 |
| alpha 版本 | 不单独适配，请自行临时修复或切换至目标 RC |

DSH `0.2.1-rc.5` 继续使用插件 `v0.9.1`。根据实际使用反馈，本次客户端升级后未发现兼容性问题，无需额外适配。
```

</details>

**依据 3 · 作者声明**：[README.md:61-78](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/README.md#L61-L78)

作用域包身份、旧包卸载与 profile 安装检查。

<details>
<summary>查看原文（18行）</summary>

````text
### Web：安装固定发行版

推荐从 npm 安装官方包 `@ayanehana/dsh-reasoning-effort@0.9.1`。无作用域的同名包由其他维护者发布。

[npm 包页面](https://www.npmjs.com/package/@ayanehana/dsh-reasoning-effort) · [下载 v0.9.1 插件包](https://github.com/HanaAyane/dsh-reasoning-effort/releases/download/v0.9.1/dsh-reasoning-effort-0.9.1.tgz)。桌面端可直接使用下方的包名安装步骤。

如果此前已通过 GitHub 安装旧的 `dsh-reasoning-effort`，切换到带作用域的新包前请先卸载旧包；Web 使用 `dsh plugin --profile web remove dsh-reasoning-effort`，桌面端在 **插件** 页面卸载，避免重复加载。

在你启动 DSH 时使用的终端环境执行：

```powershell
dsh plugin --profile web add @ayanehana/dsh-reasoning-effort@0.9.1
dsh --profile web --dump-config
```

确认输出中出现 `name: '@ayanehana/dsh-reasoning-effort'`（引号形式可能不同）。已有 npm 安装也使用同一条 `add` 命令更新。

GitHub 安装地址仍为 `github:HanaAyane/dsh-reasoning-effort#v0.9.1`，本版本包名为 `@ayanehana/dsh-reasoning-effort`。开发体验可将 `#v0.9.1` 换成 `#main`，但主分支可能包含未发布改动。
````

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:1291-1328](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/index.tsx#L1291-L1328)

实际宿主目录依赖、样式与偏好事件清理。

<details>
<summary>查看原文（38行）</summary>

```text
export function apply(ctx: ClientContext) {
  const modelDirectories = ctx.get('modelDirectories') as ModelDirectoryResolver | undefined
  if (modelDirectories === undefined) return

  const connection = ctx.get('connection') as { rpc?: HostRpc } | undefined
  const adapt = makeAdaptationService(connection?.rpc)
  if (adapt !== null) {
    ctx.effect(() => ctx.remote.$on('settings/document-updated', adapt.invalidate), 'reasoning-effort: settings updates')
    ctx.effect(() => ctx.remote.$on('llm/adapters-updated', adapt.invalidate), 'reasoning-effort: adapter updates')
    ctx.effect(() => ctx.remote.$on('credentials/record-updated', adapt.invalidate), 'reasoning-effort: credential updates')
    ctx.effect(() => ctx.remote.$on('credentials/reference-updated', adapt.invalidate), 'reasoning-effort: credential reference updates')
    ctx.on('connection/reset', adapt.invalidate)
  }
  const sessions = ctx.get('sessions') as { subagentAddress(sessionId: SessionId): unknown } | undefined
  if (sessions === undefined) return
  const locale = ctx.get('locale') as LocaleRuntimeLike | undefined

  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'reasoning-effort: dictionaries')

  ctx.effect(() => {
    const style = document.createElement('style')
    style.dataset.plugin = 'dsh-reasoning-effort'
    style.textContent = CSS
    document.head.appendChild(style)
    return () => style.remove()
  }, 'reasoning-effort: styles')

  ctx.effect(() => {
    const syncStorage = (event: StorageEvent) => {
      if (event.key === ENABLED_STORAGE_KEY) {
        enabledStore.set(event.newValue !== 'false', false)
      } else if (event.key === CHIBI_THUMB_STORAGE_KEY) {
        chibiThumbStore.set(event.newValue === 'true', false)
      }
    }
    window.addEventListener('storage', syncStorage)
    return () => window.removeEventListener('storage', syncStorage)
  }, 'reasoning-effort: preference sync')
```

</details>

**依据 5 · 源码核查**：[src/client/effort-selection.ts:99-134](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L99-L134)

等待确认和错误处理约束试用步骤。

<details>
<summary>查看原文（36行）</summary>

```text
/** Revalidate a captured route and effort ID, never a position in a new catalog. */
export async function selectEffort(
  directory: ModelDirectory,
  target: EffortSelection,
  signal: AbortSignal,
  t: ReasoningEffortTranslate,
  timeoutMs = 5000,
): Promise<ModelDirectoryState> {
  signal.throwIfAborted()
  const initial = directory.store.getSnapshot()
  const originalEffort = initial.current?.reasoningEffort
  if (!sameModel(initial.current, target)) throw new Error(t('effort.modelChanged'))
  if (initial.status === 'loading' || initial.status === 'selecting' || initial.pending !== null) {
    throw new Error(t('effort.busy'))
  }

  const fresh = await abortable(directory.load(), signal)
  signal.throwIfAborted()
  // load() returns a snapshot; a newer selection can start before this continuation.
  for (const state of [fresh, directory.store.getSnapshot()]) {
    if (!sameModel(state.current, target)) throw new Error(t('effort.modelChanged'))
    if (state.status === 'error') throw new Error(state.error ?? t('effort.unconfirmed'))
    if (state.status !== 'ready' || state.pending !== null) throw new Error(t('effort.busy'))
    if (state.current?.reasoningEffort !== originalEffort) {
      throw new Error(t('effort.selectionChanged'))
    }
    if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
      throw new Error(t('effort.unsupported', { effort: target.reasoningEffort }))
    }
  }

  const result = await abortable(directory.select(target), signal)
  signal.throwIfAborted()
  if (!result.ok) throw new Error(`${result.error.code}: ${result.error.message}`)
  return waitForSelection(directory, target, signal, t, timeoutMs)
}
```

</details>

#### 缺口

- 没有与原生菜单同条件的操作和模型任务对照。
  **影响**：可判断接线与控制逻辑，不能声称更快、更省费或输出更好。
  **进一步探讨**：以同模型、任务和预算比较误选率、切档耗时、最终请求与合格结果，分开记录设置便利与模型效果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 能否让配置成功与供应商实际支持之间的差异可见？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

可研究的假设是将目录已确认与“最近一次同路由请求已接受该档位”分开提示，可能减少自定义模型配置后把滑杆可见当成端点能力的误读。依据是现有 selectEffort 已等待目录投影，而 Host 指引仍只提供配置声明；它不是缺少选择确认。

相对现有提示，新增的是固定 provider/model/协议与实际请求结果的证据时间和范围，不能靠模型名知识库直接标记通过，也不能悄悄发送付费探针。最小对照可由用户已有授权请求提供去敏结果，在同一自定义路由配置正确、字段被拒、字段被忽略的条件中，比较当前指引与两层提示对用户下一步决策、错误重复请求和排障时间的影响。若没有改善或新增日志、隐私与维护负担超过收益，应否定该方案。单次接受也不证明所有任务效果更好。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/effort-selection.ts:84-95](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/client/effort-selection.ts#L84-L95)

现有机制已经等待目录状态，不应假称缺确认。

<details>
<summary>查看原文（12行）</summary>

```text
      } else if (sameModel(state.current, target) && state.status === 'ready' && state.pending === null) {
        if (effortIndex(currentModel(state)?.reasoning?.efforts ?? [], target.reasoningEffort) < 0) {
          finish(undefined, new Error(t('effort.unsupported', { effort: target.reasoningEffort })))
        } else if (state.current?.reasoningEffort === target.reasoningEffort) {
          finish(state)
        }
      }
    }
    unsubscribe = directory.store.subscribe(check)
    signal.addEventListener('abort', abort, { once: true })
    timer = setTimeout(() => finish(undefined, new Error(t('effort.unconfirmed'))), timeoutMs)
    check()
```

</details>

**依据 2 · 源码核查**：[src/index.ts:355-375](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/index.ts#L355-L375)

指引根据目录及声明生成，而非端点试验。

<details>
<summary>查看原文（21行）</summary>

```text
  async function diagnose(provider: string, model: string): Promise<Guidance> {
    const storeShape = readStore()
    const entry = matchEntry(knowledgeOf(storeShape), provider, model)
    const current = await currentLevels(provider, model)
    const expected = entry === undefined ? [] : displayLevels(entry)
    const { declared, entryLine, entry: userEntry } = userDeclaredModel(provider, model)
    const path = await settingsPath()

    let reason: Guidance['reason'] = 'none'
    // Explicitly disabling reasoning is intentional. Trust every nonempty
    // catalog level set, even when it differs from our knowledge base.
    if (userEntry?.reasoningEfforts !== false && current.length === 0) {
      reason = 'missing'
    }

    // Guidance targets custom-provider declarations only; the built-in
    // catalog's data — including deliberately sparse level sets — is trusted.
    const needsGuide = declared && reason !== 'none'

    const modelIndent = usesProfileConfig ? 10 : 8
    const block = entry === undefined ? null : fieldBlock(entry, modelIndent)
```

</details>

**依据 3 · 源码核查**：[src/knowledge.ts:14-20](https://github.com/HanaAyane/dsh-reasoning-effort/blob/33a2beaf758b3da24b4bc6d1ded5560d11c5dc30/src/knowledge.ts#L14-L20)

路由协议约束为独立层次，给出新增提示的依据。

```text
 * A `compat` block is written verbatim into the generated snippet, and the
 * generator never sees the route's protocol: it cannot withhold the block from
 * a model whose wire protocol refuses those fields (`llm-pi-ai` rejects the
 * whole route instead of ignoring them). Set `compat` only where every route an
 * entry can match speaks `openai-completions`, and prefer leaving it out: an
 * absent block lets the adapter read the endpoint address, which is right for
 * an unrecognized endpoint and for a recognized vendor alike.
```

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
