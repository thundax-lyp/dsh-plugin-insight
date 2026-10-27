# dsh-anchored-standard

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[ad2de74](https://github.com/xiaobright/dsh-anchored-standard/tree/ad2de749a3574e58d126324288ce5e90af66e1ce)

<!-- BEGIN META -->
[![GitHub ★ 3,739](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3%2C739&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaobright/dsh-anchored-standard)
<!-- END META -->

> **功能**：提供实验性DSH预设，通过首轮上下文门控、工具分阶段暴露与历史种子控制模型轨迹。

> **亮点**：相对重复写“认真思考”提示，实际增量是工具与上下文暴露的结构控制，晋升状态还能跨压缩重建。相对原生Minimal，它允许后续恢复较完整目录。该设计可用于研究首轮条件，但锚定改善任务质量仍依赖具体模型和试验，不能把API表面变化当作通用认知提升。 依据[Q03](#research-q03)。

> **主要限制**：最强反证来自作者冻结说明：原目标V4 Pro退役，后继V4.1 Flash未在该任务条件下测量，先前flash家族探针不能代替后继实测。首轮清空contexts也包含自动工作区和策略快照，门控行为不等于宿主权限检查被移除，但可能使模型缺少任务指引。includeSubagents与其他phase插件配置不一致还会让实验条件漂移。 依据[Q04](#research-q04)。

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
  - [Q01 · 谁在什么场景需要它，合格结果是什么？](#detail-section-11)
  - [Q02 · 入口、处理链及状态如何实现？](#detail-section-12)
  - [Q03 · 相对简单替代的实质增量是什么？](#detail-section-13)
  - [Q04 · 什么限制最可能使贡献不成立？](#detail-section-14)
  - [Q05 · 启动、持续与恢复依赖哪些条件？](#detail-section-15)
  - [Q06 · 全周期成本和实际效果支持到哪里？](#detail-section-16)
  - [Q07 · 实现有哪些可借鉴处和维护边界？](#detail-section-17)
  - [Q08 · 什么新假设值得验证，怎样推翻它？](#detail-section-18)
  - [Q09 · 对谁值得采用，何时停止？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：对象是研究模型对首轮工具与上下文敏感性的预设实验者。原办法是使用原生Minimal或Standard并手工改提示；合格结果是固定模型和任务下可重放的轨迹及质量成本对照。README已冻结项目且主调优模型退役，不应将历史样本直接用于当前模型的生产推荐。

相对重复写“认真思考”提示，实际增量是工具与上下文暴露的结构控制，晋升状态还能跨压缩重建。相对原生Minimal，它允许后续恢复较完整目录。该设计可用于研究首轮条件，但锚定改善任务质量仍依赖具体模型和试验，不能把API表面变化当作通用认知提升。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 上下文门控 | 控制首轮输入 | 可能隐藏自动任务指引 |
| epoch晋升 | 压缩后重建阶段 | 依赖宿主持久事件 |
| 变体预设 | 对照额外锚定轮次 | 部分模式多调用 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配宿主事件 | 必需 | 门控与恢复 | 实验条件失效 |
| 固定模型及任务 | 效果研究必需 | 可比实验 | 不得继承历史收益 |
| 维护能力 | 持续采用必需 | 冻结后适配 | 回原生预设 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 隔离profile选择预设 | 保留原生配置 |
| 2 | 核对首轮wire与晋升 | 指引缺失停止 |
| 3 | 比较同条件合格结果 | 无改善回原生 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 实验模型费用未知 | 预设配置与输入核对 | 项目冻结 |
| 持续使用 | 部分模式额外调用 | 模型换代需重测 | 历史收益不可移用 |
| 失败恢复 | 已发生调用不退回 | 恢复原生预设 | 保留实验记录 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 输入控制 | 源码可见contexts与消息过滤 | 当前模型质量提升 |
| 恢复阶段 | 持久事件epoch | 跨宿主语义一致 |

> **思考**：最强反证来自作者冻结说明：原目标V4 Pro退役，后继V4.1 Flash未在该任务条件下测量，先前flash家族探针不能代替后继实测。首轮清空contexts也包含自动工作区和策略快照，门控行为不等于宿主权限检查被移除，但可能使模型缺少任务指引。includeSubagents与其他phase插件配置不一致还会让实验条件漂移。 依据[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：相对重复写“认真思考”提示，实际增量是工具与上下文暴露的结构控制，晋升状态还能跨压缩重建。相对原生Minimal，它允许后续恢复较完整目录。该设计可用于研究首轮条件，但锚定改善任务质量仍依赖具体模型和试验，不能把API表面变化当作通用认知提升。 依据[Q03](#research-q03)。

可复用的是按压缩epoch从持久事件推导状态，以及过滤器自身异常时保留上下文的降级。移植需核对claimed对象/ID语义与事件顺序，不可仅复制pre-step过滤器。配置未知键在apply即拒绝，有助避免悄悄改变实验条件；这些工程机制可借鉴而不必采用旧模型调优参数。

<a id="detail-section-5"></a>

### 1.4 主要限制

最强反证来自作者冻结说明：原目标V4 Pro退役，后继V4.1 Flash未在该任务条件下测量，先前flash家族探针不能代替后继实测。首轮清空contexts也包含自动工作区和策略快照，门控行为不等于宿主权限检查被移除，但可能使模型缺少任务指引。includeSubagents与其他phase插件配置不一致还会让实验条件漂移。 依据[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

当前生产采用不推荐，研究者可只借鉴epoch门控实现做隔离实验。相比人工改提示，它能精确控制输入条件，但冻结与目标模型退役使持续采用依据不足。若模型或宿主与历史条件不同，返回原生预设并重新做同条件实验，不沿用旧轨迹增益结论。 依据[Q09](#research-q09)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

贡献为固定源码支持的机制判断；效果未实测，未来设计假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、preset/context-gate.mjs、preset/compaction-epoch.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：仅检查固定版本的作者说明、注册入口和下列实际源码；未执行目标代码、安装或真实宿主验收。
- 下一步：- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

**分析版本**

- **仓库**：[xiaobright/dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard)
- **版本号**：0.1.0（[固定提交 ad2de74](https://github.com/xiaobright/dsh-anchored-standard/tree/ad2de749a3574e58d126324288ce5e90af66e1ce)）
- **版本日期**：2026-10-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把首轮门控从固定模型补丁改成显式实验开关，自动记录门控前后输入差异，能更便宜地区分提示面效应与额外思考轮次。固定当前模型、任务、预算，比较原生Minimal、Standard和门控Standard；同时记录指引漏读、合格率和调用费。若门控只增加轮次或漏掉关键指引且无质量改善，应停止这一模型上的调优。 依据[Q08](#research-q08)。

- 已检查固定提交的README及source_paths列明的源码。
- 本轮不执行第三方代码；源码机制不等于安装、兼容或实际效果通过。
- 逐题缺口影响采用的范围已在相关回答与建议保留。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 7 | 1853 | — | — | 21043 |
| .mjs | source | 75 | 15124 | 9596 | 4584 | — |
| .mjs | test | 20 | 3488 | 3053 | 89 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/xiaobright/dsh-anchored-standard/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对象是研究模型对首轮工具与上下文敏感性的预设实验者，采用价值是否由固定机制与边界支持？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁在什么场景需要它，合格结果是什么？

**研究主题**：场景与需求

#### 完整回答

对象是研究模型对首轮工具与上下文敏感性的预设实验者。原办法是使用原生Minimal或Standard并手工改提示；合格结果是固定模型和任务下可重放的轨迹及质量成本对照。README已冻结项目且主调优模型退役，不应将历史样本直接用于当前模型的生产推荐。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-33](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/README.md#L20-L33)

作者冻结与目标模型变化。

<details>
<summary>查看原文（14行）</summary>

```text
## Project status (frozen 2026-09-10)

**This project is frozen.** On 2026-09-10 DeepSeek released V4.1 Flash and announced that
V4 Pro — the model these presets were measured on and tuned for — is retired on
2026-09-14 12:00, with its traffic routed to V4.1 Flash. The presets exist to re-anchor a
trajectory that the successor does not appear to need patched: the flash family anchored
under every condition in our first-round dose-response probes (32/32), which is why the
project never tuned for it. V4.1 Flash's own first-round trajectory has NOT been measured
(no API budget in maintenance mode), so treat that as an inference from the earlier
flash data, not a result. The model the work was built around is going away, so the
maintenance period ends here. **New issues and pull requests are no longer accepted or
handled.** The repository stays online with its history, data and acknowledgement record
intact.

```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 入口、处理链及状态如何实现？

**研究主题**：功能与机制

#### 完整回答

context-gate在system-prompt/assemble调用next后清空未晋升会话的contexts；pre-step保留claimed批次与kind白名单，过滤后来追加的消息。promotion通过session/event追踪持久tool/call或assistant/message，compaction/end重置为未晋升；冷启动扫描耐久历史以恢复阶段。子代理默认视为已晋升。机制是控制可见输入面，而不是模型一定深思的保证。

#### 证据与依据

**依据 1 · 源码核查**：[preset/context-gate.mjs:154-190](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/context-gate.mjs#L154-L190)

真实上下文和claimed过滤。

<details>
<summary>查看原文（37行）</summary>

```text
  // Path (a): blank the dynamic runtime-context contributions while the
  // session is unpromoted. Covers the whole SystemPrompt.context() family
  // without enumerating it; the loop's snapshot projection then stays silent
  // and diffs exactly ONE fresh snapshot in at the first promoted request.
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    // Downstream errors propagate untouched; only this filter's own logic is guarded.
    const assembled = await next()
    if (enabled === false) return assembled
    try {
      if (promotion.status(context.agent).promoted) return assembled
      if (!Array.isArray(assembled.contexts) || assembled.contexts.length === 0) return assembled
      return { ...assembled, contexts: [] }
    } catch (error) {
      // A gate bug must never break assembly: degrade to the assembled value.
      warnOnce(`${name}: runtime-context suppression failed, keeping contexts: ${String((error && error.message) || error)}`)
      return assembled
    }
  })

  // Path (b): claimed-baseline deny on the pre-step waterfall. The payload's
  // `messages` is the batch this step CLAIMED from the inbox — the baseline
  // every injection appends to. Keep that baseline plus the kind allowlist,
  // strip every appended message regardless of its source identity.
  ctx.on('agent/pre-step', async ({ agent, messages: claimed }, next) => {
    // Downstream errors propagate untouched; only this filter's own logic is guarded.
    const decision = await next()
    if (decision.kind === 'reject') return decision
    if (enabled === false) return decision
    try {
      if (promotion.status(agent).promoted) return decision
      if (!Array.isArray(decision.messages)) return decision
      if (!Array.isArray(claimed)) return decision
      const baseline = new Set(claimed)
      const baselineIds = new Set(claimed
        .map((message) => message?.id)
        .filter((id) => id !== undefined && id !== null))
      const kept = decision.messages.filter((message) =>
```

</details>

**依据 2 · 源码核查**：[preset/compaction-epoch.mjs:33-47](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/compaction-epoch.mjs#L33-L47)

冷启动扫描持久事件。

<details>
<summary>查看原文（15行）</summary>

```text
  const scan = (session) => {
    let boundary = -1
    let promoted = false
    for (const event of (session.snapshotEvents ? session.snapshotEvents() : (session.events ?? []))) {
      const seq = event.seq ?? 0 // events without a seq are treated as post-boundary
      if (event.type === 'compaction/end') {
        boundary = seq
        promoted = false
        continue
      }
      if (promote.has(event.type) && seq > boundary) promoted = true
    }
    const entry = { boundary, promoted }
    state.set(session.id, entry)
    return entry
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 相对简单替代的实质增量是什么？

**研究主题**：贡献与相对优势

#### 完整回答

相对重复写“认真思考”提示，实际增量是工具与上下文暴露的结构控制，晋升状态还能跨压缩重建。相对原生Minimal，它允许后续恢复较完整目录。该设计可用于研究首轮条件，但锚定改善任务质量仍依赖具体模型和试验，不能把API表面变化当作通用认知提升。

#### 证据与依据

**依据 1 · 源码核查**：[preset/compaction-epoch.mjs:68-77](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/compaction-epoch.mjs#L68-L77)

压缩后重置与晋升。

<details>
<summary>查看原文（10行）</summary>

```text
    observe(session, event) {
      const entry = state.get(session.id)
      if (entry === undefined) return
      const seq = event.seq ?? 0
      if (event.type === 'compaction/end') {
        state.set(session.id, { boundary: seq, promoted: false })
        return
      }
      if (promote.has(event.type) && seq > entry.boundary && !entry.promoted) {
        state.set(session.id, { ...entry, promoted: true })
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么限制最可能使贡献不成立？

**研究主题**：缺陷与关键质疑

#### 完整回答

最强反证来自作者冻结说明：原目标V4 Pro退役，后继V4.1 Flash未在该任务条件下测量，先前flash家族探针不能代替后继实测。首轮清空contexts也包含自动工作区和策略快照，门控行为不等于宿主权限检查被移除，但可能使模型缺少任务指引。includeSubagents与其他phase插件配置不一致还会让实验条件漂移。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-33](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/README.md#L20-L33)

后继模型尚未测量。

<details>
<summary>查看原文（14行）</summary>

```text
## Project status (frozen 2026-09-10)

**This project is frozen.** On 2026-09-10 DeepSeek released V4.1 Flash and announced that
V4 Pro — the model these presets were measured on and tuned for — is retired on
2026-09-14 12:00, with its traffic routed to V4.1 Flash. The presets exist to re-anchor a
trajectory that the successor does not appear to need patched: the flash family anchored
under every condition in our first-round dose-response probes (32/32), which is why the
project never tuned for it. V4.1 Flash's own first-round trajectory has NOT been measured
(no API budget in maintenance mode), so treat that as an inference from the earlier
flash data, not a result. The model the work was built around is going away, so the
maintenance period ends here. **New issues and pull requests are no longer accepted or
handled.** The repository stays online with its history, data and acknowledgement record
intact.

```

</details>

#### 缺口

- 当前后继模型在相同任务的锚定效果未测。
  **影响**：无法支持生产采用增益。
  **进一步探讨**：对固定后继版本重新做同预算合格任务比较。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 启动、持续与恢复依赖哪些条件？

**研究主题**：依赖、兼容与流程

#### 完整回答

每个预设目录自包含并独立安装，必须保持context-gate在组合顺序前面及promotion配置一致；依赖对应宿主事件语义。启用失败过滤器会保留原上下文而非丢弃，但效果实验仍要核对实际wire输入。生产使用者没有持续维护支持，退出应恢复原生预设并保留实验记录。

#### 证据与依据

**依据 1 · 源码核查**：[preset/context-gate.mjs:129-141](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/context-gate.mjs#L129-L141)

配置校验与监听。

<details>
<summary>查看原文（13行）</summary>

```text
  const unknown = Object.keys(source).filter((key) => !ALLOWED_KEYS.has(key))
  if (unknown.length > 0) {
    throw new TypeError(
      `${name}: unknown config key(s) ${unknown.join(', ')} — allowed keys: ${[...ALLOWED_KEYS].sort().join(', ')}`,
    )
  }
  const promoteEvents = parsePromoteOn(source.promoteOn)
  const includeSubagents = booleanOption(source.includeSubagents, 'includeSubagents', false)
  const enabled = booleanOption(source.enabled, 'enabled', true)
  const allowKinds = allowKindList(source.allowKinds, 'allowKinds')

  const promotion = createEpochPromotion(promoteEvents, { includeSubagents })
  ctx.on('session/event', (session, event) => promotion.observe(session, event))
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 全周期成本和实际效果支持到哪里？

**研究主题**：效果与总成本

#### 完整回答

基础模式不额外调用，zero/whoami及combo等变体增加模型轮次，wire模式还会导致前缀缓存变化。首次要理解预设配置，持续成本在模型换代后的重复测量与失效适配；实际金额和端到端人工未在本轮计算。项目冻结正说明不能把过去效果当持续收益。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:70-80](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/README.md#L70-L80)

模式与额外调用成本。

<details>
<summary>查看原文（11行）</summary>

```text
| Mode | Directory | First model request | Anchor mechanism | Promotion signal | Cost |
|---|---|---|---|---|---|
| Anchored Standard | `preset/` | 2 tools (the Minimal pair) | Minimal tool schema | first durable `tool/call` **or** `assistant/message` (`promoteOn: either`) | none |
| Zero-Anchored Standard | `zero-anchored-standard/` | 0 tools | one fixed anchor turn | the anchor reply (`assistant/message`) | +1 model call |
| Whoami Standard | `whoami-standard/` | 0 tools | one "你是谁" self-introduction turn | the self-introduction reply (`assistant/message`) | +1 model call |
| Prefab Anchored Standard | `prefab/` | seeded rolled history | bundled successful trajectory | already promoted in the seed | no model call to instantiate |
| Eternal Minimal | `eternal-minimal/` | 2 tools, forever | the visible catalog never grows; heavier tools run via the `dshx` bash gateway | none (no phases) | none |
| Wire Think-Execute Standard | `wire-think-standard/` | tools present, `tool_choice: none` on the wire | sibling provider route per think step | per-turn: the steer itself | +1 model call/turn, prefix-cache churn |
| Combo Anchored | `combo-anchored/` | 0 tools, on every user turn | think/execute split + depth gate + deliberation drip as three independent rows | per-mechanism | +1 model call/turn |

Every mode directory is self-contained and installs alone under whatever id
```

</details>

#### 缺口

- 变体额外轮次和维护成本缺完整当前账单。
  **影响**：不能声称当前经济优势。
  **进一步探讨**：记录完整调用、失败和人工重测时间。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 实现有哪些可借鉴处和维护边界？

**研究主题**：工程质量与复用

#### 完整回答

可复用的是按压缩epoch从持久事件推导状态，以及过滤器自身异常时保留上下文的降级。移植需核对claimed对象/ID语义与事件顺序，不可仅复制pre-step过滤器。配置未知键在apply即拒绝，有助避免悄悄改变实验条件；这些工程机制可借鉴而不必采用旧模型调优参数。

#### 证据与依据

**依据 1 · 源码核查**：[preset/context-gate.mjs:158-169](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/context-gate.mjs#L158-L169)

自身错误保留contexts。

<details>
<summary>查看原文（12行）</summary>

```text
  ctx.on('system-prompt/assemble', async (_assembly, context, next) => {
    // Downstream errors propagate untouched; only this filter's own logic is guarded.
    const assembled = await next()
    if (enabled === false) return assembled
    try {
      if (promotion.status(context.agent).promoted) return assembled
      if (!Array.isArray(assembled.contexts) || assembled.contexts.length === 0) return assembled
      return { ...assembled, contexts: [] }
    } catch (error) {
      // A gate bug must never break assembly: degrade to the assembled value.
      warnOnce(`${name}: runtime-context suppression failed, keeping contexts: ${String((error && error.message) || error)}`)
      return assembled
```

</details>

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 什么新假设值得验证，怎样推翻它？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是把首轮门控从固定模型补丁改成显式实验开关，自动记录门控前后输入差异，能更便宜地区分提示面效应与额外思考轮次。固定当前模型、任务、预算，比较原生Minimal、Standard和门控Standard；同时记录指引漏读、合格率和调用费。若门控只增加轮次或漏掉关键指引且无质量改善，应停止这一模型上的调优。

#### 证据与依据

**依据 1 · 源码核查**：[preset/context-gate.mjs:135-138](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/preset/context-gate.mjs#L135-L138)

enabled允许固定条件实验。

```text
  const promoteEvents = parsePromoteOn(source.promoteOn)
  const includeSubagents = booleanOption(source.includeSubagents, 'includeSubagents', false)
  const enabled = booleanOption(source.enabled, 'enabled', true)
  const allowKinds = allowKindList(source.allowKinds, 'allowKinds')
```

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 对谁值得采用，何时停止？

**研究主题**：采用判断

#### 完整回答

当前生产采用不推荐，研究者可只借鉴epoch门控实现做隔离实验。相比人工改提示，它能精确控制输入条件，但冻结与目标模型退役使持续采用依据不足。若模型或宿主与历史条件不同，返回原生预设并重新做同条件实验，不沿用旧轨迹增益结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-33](https://github.com/xiaobright/dsh-anchored-standard/blob/ad2de749a3574e58d126324288ce5e90af66e1ce/README.md#L20-L33)

冻结和模型条件限制采用。

<details>
<summary>查看原文（14行）</summary>

```text
## Project status (frozen 2026-09-10)

**This project is frozen.** On 2026-09-10 DeepSeek released V4.1 Flash and announced that
V4 Pro — the model these presets were measured on and tuned for — is retired on
2026-09-14 12:00, with its traffic routed to V4.1 Flash. The presets exist to re-anchor a
trajectory that the successor does not appear to need patched: the flash family anchored
under every condition in our first-round dose-response probes (32/32), which is why the
project never tuned for it. V4.1 Flash's own first-round trajectory has NOT been measured
(no API budget in maintenance mode), so treat that as an inference from the earlier
flash data, not a result. The model the work was built around is going away, so the
maintenance period ends here. **New issues and pull requests are no longer accepted or
handled.** The repository stays online with its history, data and acknowledgement record
intact.

```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
