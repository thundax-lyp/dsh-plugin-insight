# dsh-effort-slider

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b9d3a8d](https://github.com/2768651338/dsh-effort-slider/tree/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2)

<!-- BEGIN META -->
[![GitHub ★ 20](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=20&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/2768651338/dsh-effort-slider) [![npm 30d 2,207](https://img.shields.io/static/v1?label=npm+30d&message=2%2C207&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@txc2768651338/dsh-effort-slider)
<!-- END META -->

> **功能**：为 DSH 模型目录补充可视化推理强度选择。

> **亮点**：[Q02](#research-q02) 配置补供与客户端最新选择合并。

> **主要限制**：[Q03](#research-q03) UI 档位不证明 provider 实际使用或计费。

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
  - [Q01 · 用户为何需要推理强度滑块？](#detail-section-11)
  - [Q02 · 宿主如何补供能力，客户端怎样避免竞态？](#detail-section-12)
  - [Q03 · 滑块已保存是否代表模型确实使用该档位？](#detail-section-13)
  - [Q04 · 何时启用、失败时怎样恢复？](#detail-section-14)
  - [Q05 · 如何帮助用户决定是否继续发送任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在 DSH 会话中调整模型推理强度的用户。

宿主模型菜单或手工配置可设置已支持的推理等级。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 滑块 | 选择目录等级 | 真实线路需验证 |
| 配置供给 | 补充缺失声明 | 已有原生能力跳过 |
| 合并写入 | 降低快速拖动积压 | 已提交请求仍可能完成 |
| 错误提示 | 提示失败 | 不回退滑块位置 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH、llm 和 settings | 必需 | 配置与目录 | 无法供给或选择 |
| 支持对应方言的 provider | 实际推理必需 | 解释强度字段 | 生效未知或失败 |
| 模型目录 | 选择必需 | 读取模型并提交 | 等待、报错或超时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、模型和 provider 方言 | 不兼容则停用 |
| 配置 | 宿主按路由补供声明 | 查看目录及日志 |
| 使用 | 用户在模型目录选择档位 | 写入失败时读回并核对 |
| 验收 | 用户对照实际请求与任务结果 | 不以滑块外观证明生效 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 设备及软件费用未知 | 模型和方言配置时间未知 | 需兼容宿主和 provider |
| 持续使用 | 模型计费与资源消耗未知 | 选择及复核时间未知 | 档位和实际线路需对照 |
| 失败恢复 | 重试模型费用未知 | 读回及配置排查时间未知 | 未测 provider 兼容 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 档位选择 | 客户端通过目录写入 | 请求实际生效率 |
| 并发选择 | 合并最新待写并重验模型 | 所有宿主竞态表现 |
| 模型效果 | 提供方言配置声明 | 质量、耗时与费用变化 |

> **思考**：[Q03](#research-q03) UI 档位不证明 provider 实际使用或计费。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 配置补供与客户端最新选择合并。

[Q02](#research-q02) 目录刷新等待、最新请求合并与 revision 条件写入；[Q03](#research-q03) 外观并非生效证据。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) UI 档位不证明 provider 实际使用或计费。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先验证模型与方言，再读回配置并检查真实请求。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定根源码静态检查；未运行宿主、provider 或模型。

- 已检查：作者 README、包清单、源码路径 README.md、src/index.ts、src/client/effort/directory.ts、src/client/effort/EffortPanel.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根源码静态研究；未运行 DSH、模型或 provider。
- 下一步：在受控 provider 测刷新、模型切换、写入失败、线路字段和计费。

**分析版本**

- **仓库**：[2768651338/dsh-effort-slider](https://github.com/2768651338/dsh-effort-slider)
- **版本号**：0.5.2（[固定提交 b9d3a8d](https://github.com/2768651338/dsh-effort-slider/tree/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 对照现有错误提示展示持久保存状态，测误判与负担。

在受控 provider 测刷新、模型切换、写入失败、线路字段和计费。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 2719 | — | — | 37324 |
| .js | source | 2 | 1838 | 1633 | 231 | — |
| .ts | source | 9 | 2007 | 1509 | 359 | — |
| .tsx | source | 1 | 454 | 344 | 90 | — |
| .mjs | test | 9 | 1508 | 1253 | 160 | — |
| .ts | test | 1 | 8 | 6 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/2768651338/dsh-effort-slider/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查模型能力供给、滑块写入竞态与实际线路边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 用户为何需要推理强度滑块？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用可配置推理等级模型的 DSH 用户可在模型目录中选择强度；原有模型菜单或手工配置也可能完成相同设置。可视化降低选择摩擦的价值取决于模型与 provider 实际支持，档位显示不证明输出质量、推理量或费用。

#### 证据与依据

**依据 1 · 源码核查**：[README.md:173-180](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/README.md#L173-L180)

作者说明数据范围及目录写入。

```text
| User data | Not read (no access to conversation content/messages/prompts; only the current session's provider/model/`reasoningEffort` through the shared model directory) |

## How It Works

| Half | File | Role |
| --- | --- | --- |
| Host | `lib/index.js` | Universal effort provisioning: locates the pi-ai profile entry (`llm-pi-ai`), reads it via `settings.describe()`, patches wire dialects (`buildProvisionOps`, idempotent, respects user declarations) via `settings.mutate`; listens to `llm/adapters-updated` / `settings/document-updated`. With `debugReport: true`, each provisioning run logs a per-route/per-model report (written fields or skip reason, plus a note where the wire dialect does not apply) instead of the one-line count, and each model call is traced as `[debug] request route=… model=… effort=…` through a read-only `llm/stream` passthrough |
| Browser | `lib/client.js` | Captures clicks on the model menu's Effort row → shows the Effort panel; reads `ctx.modelDirectories.directoryFor(sessionId)` and writes through `directory.select({ reasoningEffort })`; a MutationObserver keeps the menu-row level color alive after the panel closes |
```

#### 缺口

- 未比较相同任务质量、耗时或成本
  **影响**：不能断言节省费用或提升质量
  **进一步探讨**：相同模型、任务、预算下比较档位结果。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主如何补供能力，客户端怎样避免竞态？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主针对 pi-ai 路由构造配置操作，识别原生 reasoning 并跳过，提交前复查配置、用 entry revision mutate；模型枚举失败会记录并跳过本轮。客户端串行保存并只保留最新待写等级，等待目录刷新且重验 provider/model 与可路由性；旧请求已提交后仍可能结束。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:276-301](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/index.ts#L276-L301)

枚举失败与原生能力识别。

<details>
<summary>查看原文（26行）</summary>

```text
            .map((entryModel) => entryModel.id)
            .filter((id): id is string => typeof id === 'string' && id.length > 0)
        } catch (error) {
          // 纯目录路由枚举失败原先静默置空——表现为「该路由模型没有 Effort
          // 行」而日志无痕。失败路径必记日志（成功路径保持只有一行计数）。
          ctx.logger.warn(`effort-slider: listModels failed for route "${route}" — catalog route skipped this round`)
          ctx.logger.warn(error)
          catalogIds = []
        }
      }
      const decisionsBefore = report.length
      let newOps: PathOp[]
      if (catalogIds.length > 0) {
        // 目录模型需跳过已有原生 reasoning 的条目：先解析判定（有 memo），
        // 再作为谓词传入 buildProvisionOps——跳过发生在生成 ops 之前，
        // debugReport 才能把「原生 reasoning 已声明」如实报出来。
        const nativeIds = new Set<string>()
        for (const id of catalogIds) {
          // 已有 modelOverrides 时，目录中的 reasoning 可能正是我们上轮供给的
          // 结果。按原生能力跳过会让后续方言更新失效，交给纯逻辑识别声明归属。
          if (profile.modelOverrides?.[id]?.reasoningEfforts !== undefined) continue
          if (await hasNativeReasoning(route, id)) nativeIds.add(id)
        }
        newOps = await buildProvisionOps(route, profile, dialect, apiOf, catalogIds, (id) => nativeIds.has(id), onDecision)
      } else {
        newOps = await buildProvisionOps(route, profile, dialect, apiOf, catalogIds, undefined, onDecision)
```

</details>

**依据 2 · 源码核查**：[src/index.ts:328-344](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/index.ts#L328-L344)

配置复核和 revision 写入。

<details>
<summary>查看原文（17行）</summary>

```text
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
    } catch (error) {
      ctx.logger.warn('effort-slider: pi-ai entry mutate refused')
```

</details>

**依据 3 · 源码核查**：[src/client/effort/directory.ts:112-139](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L112-L139)

等待目录及超时。

<details>
<summary>查看原文（28行）</summary>

```text
/** Wait for a real catalog refresh without submitting against an unknown model. */
function readyForSelection(directory: ModelDirectoryLike): Promise<DirectoryState> {
  return new Promise((resolve, reject) => {
    let stop: (() => void) | undefined
    let settled = false
    const finish = (error?: Error, state?: DirectoryState): void => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      stop?.()
      if (error !== undefined) reject(error)
      else resolve(state!)
    }
    const read = (): void => {
      const state = snapshotOf(directory)
      if (state !== null && state.current !== null && state.routable !== null
        && (state.status !== 'error' || state.routable === true)
        && state.status !== 'loading' && state.status !== 'idle') {
        finish(undefined, state)
      } else if (state?.status === 'error') {
        finish(new Error(state.error ?? 'Model directory refresh failed'))
      }
    }
    const timeout = setTimeout(() => finish(new Error('Model directory refresh timed out')), 10000)
    stop = directory.store.subscribe(read)
    if (settled) stop()
    else read()
  })
```

</details>

**依据 4 · 源码核查**：[src/client/effort/directory.ts:142-178](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L142-L178)

最新请求队列与模型再校验。

<details>
<summary>查看原文（37行）</summary>

```text
/**
 * One active selection plus the latest requested value. Settings updates can
 * refresh the whole DSH catalog mid-drag; wait for it, then validate the actual
 * model again. Never replay a backlog of obsolete intermediate effort levels.
 * A committed request can finish after its panel closes, in its owning Session.
 */
export function effortWriter(directory: ModelDirectoryLike): (selection: DirectorySelection) => Promise<void> {
  let pending: DirectorySelection | undefined
  let active: Promise<void> | undefined
  const drain = async (): Promise<void> => {
    while (pending !== undefined) {
      let submitted = false
      try {
        const state = await readyForSelection(directory)
        const selection = pending
        pending = undefined
        submitted = true
        if (state.current?.provider !== selection.provider || state.current.model !== selection.model
          || state.routable === false) {
          throw new Error('The selected model changed before the effort could be saved')
        }
        await selectEffort(directory, selection)
      } catch (error) {
        if (!submitted) {
          pending = undefined
          throw error
        }
        // An older failure must not discard a newer pointer/keyboard request.
        if (pending === undefined) throw error
      }
    }
  }
  return (selection) => {
    pending = selection
    active ??= drain().finally(() => { active = undefined })
    return active
  }
```

</details>

#### 缺口

- 未运行宿主和真实 provider
  **影响**：不能证明所有方言和模型接受网络请求
  **进一步探讨**：隔离 provider 测配置变化、目录刷新和线路字段。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 滑块已保存是否代表模型确实使用该档位？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

写入目录和补齐 reasoning 声明为配置行为，真实协议由相应 adapter 和 provider 决定；provider 可能不支持或解释不同。模型变化、刷新失败或 10 秒超时使写入失败；面板显示短暂错误但不回退滑块，不能把滑块当前位置当持久成功或实际推理证据。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/effort/directory.ts:106-109](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L106-L109)

select 的错误结果转为异常。

```text
/** 兼容旧版 rejection 与 0.2.1 的 RemoteResult，且接住同步抛错。 */
export async function selectEffort(directory: ModelDirectoryLike, selection: DirectorySelection): Promise<void> {
  const result = await directory.select(selection)
  if (result?.ok === false) throw new Error(`${result.error.code}: ${result.error.message}`)
```

**依据 2 · 源码核查**：[src/client/effort/directory.ts:125-135](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L125-L135)

目录错误及超时。

<details>
<summary>查看原文（11行）</summary>

```text
    const read = (): void => {
      const state = snapshotOf(directory)
      if (state !== null && state.current !== null && state.routable !== null
        && (state.status !== 'error' || state.routable === true)
        && state.status !== 'loading' && state.status !== 'idle') {
        finish(undefined, state)
      } else if (state?.status === 'error') {
        finish(new Error(state.error ?? 'Model directory refresh failed'))
      }
    }
    const timeout = setTimeout(() => finish(new Error('Model directory refresh timed out')), 10000)
```

</details>

**依据 3 · 源码核查**：[src/client/effort/EffortPanel.tsx:278-291](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/EffortPanel.tsx#L278-L291)

写入异常及不回退显示。

<details>
<summary>查看原文（14行）</summary>

```text
    void saveEffort({
      provider: current.provider,
      model: current.model,
      reasoningEffort: effort.id,
    }).catch((error: unknown) => {
      console.warn('[effort-slider] selectModel failed:', error)
      // 已被更新的写入取代：旧写入的迟到拒绝不再显示。
      if (seq !== writeSeqRef.current) return
      writtenEffortRef.current = null
      // 不回退滑块位置（用户可直接重拖）；header 状态文字短暂切换为错误态。
      setWriteError(true)
      writeErrorTimerRef.current = setTimeout(() => {
        writeErrorTimerRef.current = null
        setWriteError(false)
```

</details>

#### 缺口

- 未抓真实请求和响应
  **影响**：不能证明线上档位生效或模型质量
  **进一步探讨**：用可控兼容 provider 检查请求字段、响应及 UI 重读。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 何时启用、失败时怎样恢复？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH 的 llm、settings、模型目录和支持方言的 provider。用户应先核对模型实际能力和费用，再选择档位；写入报错时重新查看目录状态，必要时停用插件并按宿主原有配置设置。模型计费、任务耗时、provider 兼容及恢复负担未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:46-50](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/index.ts#L46-L50)

宿主服务依赖。

```text
/** 稳定插件名（对应 cordis.patch.yml 的 insert id）。 */
export const name = 'ui-effort-slider'

/** 注入的宿主服务：llm（模型目录查询）、settings（profile 条目配置表单）。 */
export const inject = ['llm', 'settings']
```

**依据 2 · 源码核查**：[src/client/effort/directory.ts:148-178](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L148-L178)

写入前复核模型。

<details>
<summary>查看原文（31行）</summary>

```text
export function effortWriter(directory: ModelDirectoryLike): (selection: DirectorySelection) => Promise<void> {
  let pending: DirectorySelection | undefined
  let active: Promise<void> | undefined
  const drain = async (): Promise<void> => {
    while (pending !== undefined) {
      let submitted = false
      try {
        const state = await readyForSelection(directory)
        const selection = pending
        pending = undefined
        submitted = true
        if (state.current?.provider !== selection.provider || state.current.model !== selection.model
          || state.routable === false) {
          throw new Error('The selected model changed before the effort could be saved')
        }
        await selectEffort(directory, selection)
      } catch (error) {
        if (!submitted) {
          pending = undefined
          throw error
        }
        // An older failure must not discard a newer pointer/keyboard request.
        if (pending === undefined) throw error
      }
    }
  }
  return (selection) => {
    pending = selection
    active ??= drain().finally(() => { active = undefined })
    return active
  }
```

</details>

**依据 3 · 源码核查**：[src/client/effort/EffortPanel.tsx:278-291](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/EffortPanel.tsx#L278-L291)

短暂错误状态。

<details>
<summary>查看原文（14行）</summary>

```text
    void saveEffort({
      provider: current.provider,
      model: current.model,
      reasoningEffort: effort.id,
    }).catch((error: unknown) => {
      console.warn('[effort-slider] selectModel failed:', error)
      // 已被更新的写入取代：旧写入的迟到拒绝不再显示。
      if (seq !== writeSeqRef.current) return
      writtenEffortRef.current = null
      // 不回退滑块位置（用户可直接重拖）；header 状态文字短暂切换为错误态。
      setWriteError(true)
      writeErrorTimerRef.current = setTimeout(() => {
        writeErrorTimerRef.current = null
        setWriteError(false)
```

</details>

#### 缺口

- 无真实 provider、账单或模型任务
  **影响**：无法量化收益或费用
  **进一步探讨**：隔离环境先读回设置，再测实际请求和计费。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户决定是否继续发送任务？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有 writer 已串行合并待写请求、重验模型并在写入失败显示短暂错误，这是直接反证；假设在其基础上持续区分待保存、保存失败与已读回档位，帮助用户决定重试或开始任务。对照现有短暂错误，在目录刷新、模型切换、写入失败、迟到成功及正常输入下测误以为保存、漏提交、判断时长与视觉负担；若误判不降、误导或成本增加则否定。未穷尽其他宿主状态显示。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/effort/directory.ts:148-178](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/directory.ts#L148-L178)

合并与模型复核。

<details>
<summary>查看原文（31行）</summary>

```text
export function effortWriter(directory: ModelDirectoryLike): (selection: DirectorySelection) => Promise<void> {
  let pending: DirectorySelection | undefined
  let active: Promise<void> | undefined
  const drain = async (): Promise<void> => {
    while (pending !== undefined) {
      let submitted = false
      try {
        const state = await readyForSelection(directory)
        const selection = pending
        pending = undefined
        submitted = true
        if (state.current?.provider !== selection.provider || state.current.model !== selection.model
          || state.routable === false) {
          throw new Error('The selected model changed before the effort could be saved')
        }
        await selectEffort(directory, selection)
      } catch (error) {
        if (!submitted) {
          pending = undefined
          throw error
        }
        // An older failure must not discard a newer pointer/keyboard request.
        if (pending === undefined) throw error
      }
    }
  }
  return (selection) => {
    pending = selection
    active ??= drain().finally(() => { active = undefined })
    return active
  }
```

</details>

**依据 2 · 源码核查**：[src/client/effort/EffortPanel.tsx:278-291](https://github.com/2768651338/dsh-effort-slider/blob/b9d3a8d0e1fdcb753e811d9f6c6a64ca4fcaecf2/src/client/effort/EffortPanel.tsx#L278-L291)

既有错误状态。

<details>
<summary>查看原文（14行）</summary>

```text
    void saveEffort({
      provider: current.provider,
      model: current.model,
      reasoningEffort: effort.id,
    }).catch((error: unknown) => {
      console.warn('[effort-slider] selectModel failed:', error)
      // 已被更新的写入取代：旧写入的迟到拒绝不再显示。
      if (seq !== writeSeqRef.current) return
      writtenEffortRef.current = null
      // 不回退滑块位置（用户可直接重拖）；header 状态文字短暂切换为错误态。
      setWriteError(true)
      writeErrorTimerRef.current = setTimeout(() => {
        writeErrorTimerRef.current = null
        setWriteError(false)
```

</details>

#### 缺口

- 未实测新旧状态显示与 provider 请求
  **影响**：不能断言新显示有收益
  **进一步探讨**：用隔离目录实现对照并核查状态一致性。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
