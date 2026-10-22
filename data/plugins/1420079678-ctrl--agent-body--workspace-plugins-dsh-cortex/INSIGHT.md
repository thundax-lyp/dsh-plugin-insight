# dsh-cortex

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

分析版本：[9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex)

<!-- BEGIN META -->
[![GitHub ★ 17](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=17&color=yellow&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body)
<!-- END META -->

> **实现功能**：按会话静默相位巩固工具经历成长期记忆卡，跨会话召回并对重复告警降噪。

> **核心亮点**：将会话间的工具事件压缩为可复用提示，且无巩固模型调用。详见[Q01](#research-q01)、[Q02](#research-q02)。

> **风险与缺陷**：统一 DSH_HOME 记忆库无项目/会话作用域，错误文本可持久化；写失败静默且非原子，全局召回可能跨任务误导。详见[Q03](#research-q03)。

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
  - [Q01 · 睡眠和长期记忆解决何种工作流问题？](#detail-section-11)
  - [Q02 · 经历如何变成记忆并在新命令时召回？](#detail-section-12)
  - [Q03 · 持久化、隔离和静默失败怎样影响可靠性？](#detail-section-13)
  - [Q04 · 如何试用并判断它是否比人工记忆更有价值？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：长期运行的 DSH Agent 想复用过去工具调用中的失败、成功链路和告警模式。

依靠会话文本或手工笔记保存经验；插件把工具事件转为规则卡并主动召回。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 睡眠巩固 | 持久化工具模式 | 规则不懂任务语义 |
| 主动召回 | 跨会话提示 | 全局库缺作用域 |
| 降噪 | 压低重复告警 | 错误收敛可能掩盖变化 |

**流程与依赖**

#### 条件

| 条件 | 用途 | 缺失时 |
| --- | --- | --- |
| DSH agent/tools 事件 | 记录与召回 | 无经历数据 |
| 可写 DSH_HOME | 长期保存 | 错误被静默吞掉 |
| 审慎的错误文本 | 卡片内容 | 可能保留敏感值 |
| 项目隔离 | 避免交叉召回 | 不同任务混用 |

#### 隔离试验

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 隔离 | 单独 DSH_HOME/无秘密日志 | 范围明确 |
| 生成 | 设计失败/成功链路 | 卡片类别符合预期 |
| 召回 | 同/异任务验证 | 有用且不过度提醒 |
| 故障 | 注入只读盘/损坏文件 | 失败可识别和恢复 |

**效果与成本**

#### 成本

| 阶段 | 资源与人工 | 边界 |
| --- | --- | --- |
| 初次 | DSH 事件兼容、隔离 DSH_HOME | 默认召回开启 |
| 持续 | 检查卡片、误提醒与敏感错误文本 | 全局 JSONL |
| 运维 | 备份/恢复与磁盘错误处理 | 源码静默失败 |

#### 效果

| 项 | 源码支持 | 未知 |
| --- | --- | --- |
| 巩固 | 固定阈值制四类卡 | 经验是否正确 |
| 召回 | 关键词匹配并注入 | 对任务净帮助 |
| 持久化 | 本地 JSONL/状态文件 | 失败后的可恢复性 |

> **思考**：统一 DSH_HOME 记忆库无项目/会话作用域，错误文本可持久化；写失败静默且非原子，全局召回可能跨任务误导。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将会话间的工具事件压缩为可复用提示，且无巩固模型调用。详见[Q01](#research-q01)、[Q02](#research-q02)。

将会话间的工具事件压缩为可复用提示，且无巩固模型调用。详见[Q01](#research-q01)、[Q02](#research-q02)。

计时器、事件钩子与三工具由 ctx.effect 管理；JSONL 全量覆盖、错误静默。相同 DSH_HOME 的所有会话共享记忆，卡片不含作用域。

<a id="detail-section-5"></a>

### 1.4 主要限制

统一 DSH_HOME 记忆库无项目/会话作用域，错误文本可持久化；写失败静默且非原子，全局召回可能跨任务误导。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在个人隔离目录试验，先检查错误消息是否可持久化，关闭或限制召回并追踪误命中。共享环境暂不建议。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可核实确定性睡眠与记忆流程；记忆正确性、跨项目隔离和落盘成功缺少保证。

- 已检查：作者 README、包清单、源码路径 workspace/plugins/dsh-cortex/README.md、workspace/plugins/dsh-cortex/package.json、workspace/plugins/dsh-cortex/src/index.ts 及固定范围 inventory；组件：workspace/plugins/dsh-cortex。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态阅读固定组件 README、package、src/index.ts；未加载 DSH 宿主、执行插件或写入用户记忆。
- 下一步：用带标签的真实任务评估卡片准确率和误提醒；多项目共用 DSH_HOME、敏感错误、权限/磁盘故障及崩溃写测试。

**分析版本**

- **仓库**：[1420079678-ctrl/agent-body](https://github.com/1420079678-ctrl/agent-body)
- **版本号**：0.1.1（[固定提交 9403444](https://github.com/1420079678-ctrl/agent-body/tree/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66)）
- **版本日期**：2026-09-30（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

加入作用域与脱敏、可靠写盘和按任务效果评估，可把启发式记忆变为可信辅助；现版未实现。详见[Q04](#research-q04)。

用带标签的真实任务评估卡片准确率和误提醒；多项目共用 DSH_HOME、敏感错误、权限/磁盘故障及崩溃写测试。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 1 | 1014 | 936 | 86 | — |
| .md | source | 1 | 128 | — | — | 1659 |
| .mjs | source | 1 | 220 | 162 | 29 | — |
| .ts | source | 1 | 1115 | 890 | 140 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+created%3A2026-09-22T05%3A49%3A54.083Z..2026-10-22T05%3A49%3A54.083Z) [![近30天关闭 1](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/1420079678-ctrl/agent-body/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A49%3A54.083Z..2026-10-22T05%3A49%3A54.083Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核实 dsh-cortex 以会话节律、工具经历形成跨会话记忆的机制，以及持久化和召回的边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 睡眠和长期记忆解决何种工作流问题？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

作者目标是将工具使用的重复失败、成功链路、低成功率热点和未解失败转成可跨会话复用的卡片，并降低反复心跳告警噪声。源码不以“有工具调用”作为清醒活动，而以 agent/pre-step 的会话推进刷新活动时间；超过阈值后定时器入深睡，有新工具经历才巩固。相比每次会话从零分析，规则式卡片可提前提示相似命令；但只基于工具名、成功标记和短错误文本，不理解任务结果或判断建议是否正确。README 的真实宿主测试和 58 项回归是作者报告，本轮未复跑。

#### 证据与依据

**依据 1 · 作者声明**：[workspace/plugins/dsh-cortex/README.md:3-58](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/README.md#L3-L58)

作者说明睡眠、四类记忆和主动召回目标。

<details>
<summary>查看原文（56行）</summary>

```text
给这具身体装上**时间**与**记忆**的器官。

## 为什么需要它

`dsh-organism` 给了身体「器官 + 心跳 + 反射 + 自愈 + 自训练」，但它只有**此刻**：心跳均匀地跳、器官各干各的、经验随会话一起漂走。一个从不睡觉的身体有两处硬伤：

- **学到的留不住** —— 突触长期停在个位数，干过的活没有沉淀成可复用的东西；
- **忘不掉的甩不掉** —— 同一条离线告警每跳刷一次，真异常被噪音淹没。

皮层补的正是生物体区别于机器的这两件事：**静默即入睡、睡中巩固经历、醒来带着记忆**。

## 三大机制

### ⓪ 睡眠周期 Sleep-Wake Cycle

**清醒信号取「会话是否在推进」（`agent/pre-step`），不是「有没有工具在跑」。** 这个判据是实测逼出来的：系统内部的后台工具（如零驻留的维护调用 `zr_fast`）会周期性自触发，若按工具调用计时，`lastActivityAt` 每十几秒被刷新一次，身体**永远睡不着**——而且是静默失败，看起来一切正常。同理，organism 的心跳每 15 秒一跳，也只记入独立的 `beats` 计数、**不参与睡意计算**：心脏自动跳动不代表身体在干活。

静默越久越困：

| 静默时长 | 相位 | 行为 |
|---|---|---|
| < 2 分钟 | ☀️ 清醒 | 正常采集经历 |
| ≥ 2 分钟 | 🌙 浅睡 | 停止采集，等待更深 |
| ≥ 5 分钟 | 😴 深睡 | **执行巩固**（每 2 分钟一轮，有新经历才跑） |

任何活动立刻唤醒，并给上一段睡眠写一份报告（睡了多久、整理出什么）。手动入口：`cortex_sleep action=enter`。

`cortex_sleep action=status` 会显示**最近清醒信号的来源**（如 `session-step`）——睡不着时先看它，就知道是谁在刷活动。

### ① 长期记忆 Long-term Memory

巩固把经历提炼成四类**记忆卡**：

| 类型 | 触发条件 | 价值 |
|---|---|---|
| 坑 `pitfall` | 同一工具连续失败 ≥3 次 | 下次别在同一个地方摔 |
| 打法 `playbook` | 跨工具成功链路重复出现 ≥2 次 | 同类任务直接复用顺序 |
| 薄弱环节 `hotspot` | 调用 ≥8 次且成功率 <70% | 知道哪里该多留一步校验 |
| 未解 `unresolved` | 最后一次成功之后累计 ≥3 次失败 | 死路标记，下次换路径 |
| 事实 `fact` | 手工写入 | 稳定结论 |

记忆卡带权重与使用计数，跨会话持久化（`memory.jsonl`）。**新命令一进来，皮层按关键词主动召回最相关的几张卡注入上下文**——不必等大脑自己想起来（零 token 的确定性打分：标签 > 标题 > 正文，乘权重）。

遗忘也是机制的一部分：久未使用的卡按 168 小时半衰期衰减，权重低于 0.08 自动归档（不物理删除，`cortex_memory action=revive` 可召回）。

### ② 稳态降噪 Homeostatic Noise Control

接住 `organism/heartbeat` 泵来的全身稳态告警，做两件事：

- **窗口内重复**（默认 60 秒）只计数不刷屏；
- **反复出现且从未自愈**（默认 5 次）收敛为「已知稳态偏移」并静默——之后再重复既不计入抑制也不刷屏，把音量还给真正的异常。

纯函数内核 `reduceNoise()`，16 项断言覆盖。

## 工具

```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:693-779](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L693-L779)

定时相位与工具结果、会话推进事件监听。

<details>
<summary>查看原文（87行）</summary>

```text
  ctx.effect(() => {
    const timer = setInterval(() => {
      if (stopped) return
      try {
        const idle = clock() - state.lastActivityAt
        const prev = state.phase
        let next: Phase = 'awake'
        if (idle >= config.deepAfterMs) next = 'deep'
        else if (idle >= config.sleepAfterMs) next = 'light'
        if (!config.autoSleep && next !== 'awake') next = state.phase === 'awake' ? 'awake' : state.phase

        if (prev === 'awake' && next !== 'awake') {
          state.sleepStartedAt = clock()
          pushRhythmNote(`🌙 入睡（${next === 'deep' ? '深睡' : '浅睡'}）`)
        }
        state.phase = next

        if (state.phase === 'deep' && clock() - state.lastConsolidateAt >= config.consolidateGapMs) {
          const hasNew = buffer.some(e => e.t > state.lastConsolidateAt)
          if (hasNew) consolidate('深睡巩固', state.sleepStartedAt || clock(), 'deep')
        }
        persistState()
      } catch { /* 节律钟绝不因单次异常停摆 */ }
    }, Math.max(1000, config.tickMs))
    return () => { clearInterval(timer); stopped = true }
  }, 'cortex: sleep-wake pacemaker')

  // ═══════════ 信号接入 ═══════════

  // 信号 A：每次工具结果 = 清醒信号 + 经历记录
  ctx.effect(() => ctx.on('tools/result', ((exec: unknown, result: unknown) => {
    try {
      const ex = exec as { name?: unknown; callId?: unknown }
      const toolName = String(ex?.name ?? '')
      if (!toolName) return
      const r = result as { isError?: unknown; error?: { message?: unknown } }
      const isError = Boolean(r?.isError)
      buffer.push({
        t: clock(),
        tool: toolName,
        ok: !isError,
        ms: 0,
        err: String(r?.error?.message ?? '').slice(0, 240),
      })
      if (buffer.length > config.bufferMax) buffer.splice(0, buffer.length - config.bufferMax)
      // 工具调用**不算清醒信号**——只记录成经历。定义「醒着」的是会话推进（见信号 A0）：
      // 系统内部的后台工具（如零驻留的维护调用）会周期性自触发，若按它们计时，皮层永远睡不着。
    } catch { /* 皮层绝不影响主流程 */ }
  }) as never), 'cortex: tools/result listener')

  // 信号 A2：时延观测（只测不改）
  ctx.effect(() => ctx.on('tools/post-execute', (async (exec: unknown, _result: unknown, next: () => Promise<unknown>) => {
    const started = clock()
    try {
      return await next()
    } finally {
      const name = String((exec as { name?: unknown })?.name ?? '')
      const ms = clock() - started
      for (let i = buffer.length - 1; i >= 0 && i > buffer.length - 6; i--) {
        const e = buffer[i]
        if (e && e.tool === name && e.ms === 0) { e.ms = ms; break }
      }
    }
  }) as never), 'cortex: latency probe')

  // 信号 B：接上 organism 的心跳——血液包里带着全身稳态告警，皮层对它做降噪
  ctx.effect(() => (ctx.on as any)('organism/heartbeat', (blood: unknown) => {
    try {
      const b = blood as { alerts?: unknown; beat?: unknown }
      ingestAlerts(b?.alerts)
      // 心跳**不算清醒活动**：心脏是自动跳的，不代表身体在干活。
      // 若把心跳当活动，每 15 秒就刷新一次「最后一次活动」——皮层将永远睡不着。
      // 只记一个独立的搏动计数，供观测「心跳确实通到皮层」，不参与睡意计算。
      state.beats = (state.beats ?? 0) + 1
    } catch { /* 忽略 */ }
  }), 'cortex: heartbeat listener (noise control)')

  // 信号 A0：**会话推进 = 身体醒着**。这是唯一的清醒信号。
  // 判据取「会话是否在推进」而不是「有没有工具在跑」——后者会被系统内部的后台工具
  // （零驻留维护、各种自触发调用）周期性刷成永不静默，身体就再也睡不着了。
  ctx.effect(() => ctx.on('agent/pre-step' as never, (async (_payload: unknown, next: () => Promise<unknown>) => {
    try { markActivity('session-step') } catch { /* 皮层绝不影响主流程 */ }
    return await next()
  }) as never), 'cortex: wake on session step')

  // 信号 C：命令进来 → 主动召回记忆
  if (config.memoryRecall) {
```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:301-418](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L301-L418)

四类模式按固定阈值从工具事件提取。

<details>
<summary>查看原文（118行）</summary>

```text
export function extractPatterns(evs: Ev[], since: number, now: number): PatternResult {
  const pitfalls: MemoryCard[] = []
  const playbooks: MemoryCard[] = []
  const hotspots: MemoryCard[] = []
  const unresolved: MemoryCard[] = []

  // ── 坑：同一工具连续失败 ≥3 ──
  let run: { tool: string; count: number; err: string; at: number } | null = null
  const failRuns: Array<{ tool: string; count: number; err: string; at: number }> = []
  const flush = (): void => {
    if (run && run.count >= 3) failRuns.push(run)
    run = null
  }
  for (const e of evs) {
    if (!e.ok) {
      if (run && run.tool === e.tool) { run.count += 1; run.err = e.err || run.err; run.at = e.t }
      else { flush(); run = { tool: e.tool, count: 1, err: e.err, at: e.t } }
    } else flush()
  }
  flush()
  for (const f of failRuns) {
    if (f.at <= since) continue
    pitfalls.push({
      id: cardId('pitfall', f.tool),
      t: f.at,
      kind: 'pitfall',
      title: `${f.tool} 连续失败 ${f.count} 次`,
      body: `错误：${f.err || '（无错误信息）'}\n处置：先核参数与路径，再换工具或换器官；不要原地重试。`,
      tags: [f.tool, ...tokens(f.err).slice(0, 8)],
      weight: 1 + Math.min(2, f.count / 3),
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 打法：重复出现的成功链路（n-gram，n=2..4） ──
  const okEvs = evs.filter(e => e.ok)
  const grams = new Map<string, { count: number; last: number }>()
  for (let n = 2; n <= 4; n++) {
    for (let i = 0; i + n <= okEvs.length; i++) {
      const slice = okEvs.slice(i, i + n)
      const g = slice.map(e => e.tool).join(' → ')
      const lastT = slice[slice.length - 1]?.t ?? now
      const cur = grams.get(g) ?? { count: 0, last: 0 }
      cur.count += 1
      cur.last = Math.max(cur.last, lastT)
      grams.set(g, cur)
    }
  }
  const plays = [...grams.entries()]
    .filter(([g, v]) => {
      if (v.count < 2 || v.last <= since) return false
      // 排除「同一个工具连做几次」这类平凡链路——它们不含可复用的顺序信息
      return new Set(g.split(' → ')).size >= 2
    })
    .sort((a, b) => {
      const distinct = (g: string): number => new Set(g.split(' → ')).size
      return (distinct(b[0]) - distinct(a[0])) || (b[1].count - a[1].count)
    })
    .slice(0, 5)
  for (const [g, v] of plays) {
    playbooks.push({
      id: cardId('playbook', g),
      t: v.last,
      kind: 'playbook',
      title: `链路 ${g}`,
      body: `这条链路在一次经历中跑通 ${v.count} 次。同类任务可直接复用，不必重新摸索顺序。`,
      tags: tokens(g),
      weight: 1 + Math.min(2, v.count / 3),
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 薄弱环节：高频但成功率偏低 ──
  const perTool = new Map<string, { ok: number; fail: number; ms: number }>()
  for (const e of evs) {
    const s = perTool.get(e.tool) ?? { ok: 0, fail: 0, ms: 0 }
    if (e.ok) s.ok += 1; else s.fail += 1
    s.ms += e.ms
    perTool.set(e.tool, s)
  }
  for (const [tool, s] of perTool) {
    const total = s.ok + s.fail
    if (total < 8) continue
    const rate = s.ok / total
    if (rate >= 0.7) continue
    hotspots.push({
      id: cardId('hotspot', tool),
      t: now,
      kind: 'hotspot',
      title: `${tool} 是薄弱环节（成功率 ${(rate * 100).toFixed(0)}%）`,
      body: `共调用 ${total} 次：成功 ${s.ok}、失败 ${s.fail}，平均 ${Math.round(s.ms / total)}ms。\n用法上多留一步校验，或考虑换能力重叠的其他器官。`,
      tags: [tool],
      weight: 1.2,
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 未解：最后一次成功之后，再没走通过 ──
  const tail = evs.slice(-60)
  const lastOkAt = tail.filter(e => e.ok).reduce((acc, e) => Math.max(acc, e.t), 0)
  const dangling = tail.filter(e => !e.ok && e.t > lastOkAt)
  if (dangling.length >= 3) {
    const names = [...new Set(dangling.map(e => e.tool))].join('、')
    unresolved.push({
      id: cardId('unresolved', names),
      t: dangling[dangling.length - 1]?.t ?? now,
      kind: 'unresolved',
      title: `悬而未决：${names}`,
      body: `最后一次成功之后累计 ${dangling.length} 次失败，始终没有走通。\n下次遇到先换路径，别沿着这条死路再走一遍。`,
      tags: tokens(names),
      weight: 1.5,
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  return { pitfalls, playbooks, hotspots, unresolved }
}

```

</details>

#### 缺口

- 未在目标 DSH 宿主复现睡眠、记忆或提醒收益。
  **影响**：不能把作者测试记录当独立效果证明。
  **进一步探讨**：隔离会话重放同类/异类任务并观察提示准确率及干扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 经历如何变成记忆并在新命令时召回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

工具结果事件只记录工具名、成功与否、耗时和最多 240 字错误；巩固用连续失败≥3、跨工具成功链重复、调用≥8 且成功率<70%、末端多次失败四条规则制卡。卡按 ID upsert，使用与重复出现增权，按半衰期归档；命令到来时对最新真人输入分词，标签/标题/正文匹配后按权重排序，在 agent/pre-step 追加来源标记为插件的 user 消息。它不调用模型，故可审计且成本低；但同一工具的多种任务被合并为同一坑/热点，成功链路也可能只是偶然顺序，召回属于启发式相似而非已验证经验。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:301-418](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L301-L418)

提取四类卡的阈值和 ID 构造。

<details>
<summary>查看原文（118行）</summary>

```text
export function extractPatterns(evs: Ev[], since: number, now: number): PatternResult {
  const pitfalls: MemoryCard[] = []
  const playbooks: MemoryCard[] = []
  const hotspots: MemoryCard[] = []
  const unresolved: MemoryCard[] = []

  // ── 坑：同一工具连续失败 ≥3 ──
  let run: { tool: string; count: number; err: string; at: number } | null = null
  const failRuns: Array<{ tool: string; count: number; err: string; at: number }> = []
  const flush = (): void => {
    if (run && run.count >= 3) failRuns.push(run)
    run = null
  }
  for (const e of evs) {
    if (!e.ok) {
      if (run && run.tool === e.tool) { run.count += 1; run.err = e.err || run.err; run.at = e.t }
      else { flush(); run = { tool: e.tool, count: 1, err: e.err, at: e.t } }
    } else flush()
  }
  flush()
  for (const f of failRuns) {
    if (f.at <= since) continue
    pitfalls.push({
      id: cardId('pitfall', f.tool),
      t: f.at,
      kind: 'pitfall',
      title: `${f.tool} 连续失败 ${f.count} 次`,
      body: `错误：${f.err || '（无错误信息）'}\n处置：先核参数与路径，再换工具或换器官；不要原地重试。`,
      tags: [f.tool, ...tokens(f.err).slice(0, 8)],
      weight: 1 + Math.min(2, f.count / 3),
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 打法：重复出现的成功链路（n-gram，n=2..4） ──
  const okEvs = evs.filter(e => e.ok)
  const grams = new Map<string, { count: number; last: number }>()
  for (let n = 2; n <= 4; n++) {
    for (let i = 0; i + n <= okEvs.length; i++) {
      const slice = okEvs.slice(i, i + n)
      const g = slice.map(e => e.tool).join(' → ')
      const lastT = slice[slice.length - 1]?.t ?? now
      const cur = grams.get(g) ?? { count: 0, last: 0 }
      cur.count += 1
      cur.last = Math.max(cur.last, lastT)
      grams.set(g, cur)
    }
  }
  const plays = [...grams.entries()]
    .filter(([g, v]) => {
      if (v.count < 2 || v.last <= since) return false
      // 排除「同一个工具连做几次」这类平凡链路——它们不含可复用的顺序信息
      return new Set(g.split(' → ')).size >= 2
    })
    .sort((a, b) => {
      const distinct = (g: string): number => new Set(g.split(' → ')).size
      return (distinct(b[0]) - distinct(a[0])) || (b[1].count - a[1].count)
    })
    .slice(0, 5)
  for (const [g, v] of plays) {
    playbooks.push({
      id: cardId('playbook', g),
      t: v.last,
      kind: 'playbook',
      title: `链路 ${g}`,
      body: `这条链路在一次经历中跑通 ${v.count} 次。同类任务可直接复用，不必重新摸索顺序。`,
      tags: tokens(g),
      weight: 1 + Math.min(2, v.count / 3),
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 薄弱环节：高频但成功率偏低 ──
  const perTool = new Map<string, { ok: number; fail: number; ms: number }>()
  for (const e of evs) {
    const s = perTool.get(e.tool) ?? { ok: 0, fail: 0, ms: 0 }
    if (e.ok) s.ok += 1; else s.fail += 1
    s.ms += e.ms
    perTool.set(e.tool, s)
  }
  for (const [tool, s] of perTool) {
    const total = s.ok + s.fail
    if (total < 8) continue
    const rate = s.ok / total
    if (rate >= 0.7) continue
    hotspots.push({
      id: cardId('hotspot', tool),
      t: now,
      kind: 'hotspot',
      title: `${tool} 是薄弱环节（成功率 ${(rate * 100).toFixed(0)}%）`,
      body: `共调用 ${total} 次：成功 ${s.ok}、失败 ${s.fail}，平均 ${Math.round(s.ms / total)}ms。\n用法上多留一步校验，或考虑换能力重叠的其他器官。`,
      tags: [tool],
      weight: 1.2,
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  // ── 未解：最后一次成功之后，再没走通过 ──
  const tail = evs.slice(-60)
  const lastOkAt = tail.filter(e => e.ok).reduce((acc, e) => Math.max(acc, e.t), 0)
  const dangling = tail.filter(e => !e.ok && e.t > lastOkAt)
  if (dangling.length >= 3) {
    const names = [...new Set(dangling.map(e => e.tool))].join('、')
    unresolved.push({
      id: cardId('unresolved', names),
      t: dangling[dangling.length - 1]?.t ?? now,
      kind: 'unresolved',
      title: `悬而未决：${names}`,
      body: `最后一次成功之后累计 ${dangling.length} 次失败，始终没有走通。\n下次遇到先换路径，别沿着这条死路再走一遍。`,
      tags: tokens(names),
      weight: 1.5,
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }

  return { pitfalls, playbooks, hotspots, unresolved }
}

```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:579-669](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L579-L669)

upsert、衰减归档和关键词加权召回。

<details>
<summary>查看原文（91行）</summary>

```text
  function upsert(card: MemoryCard, reinforce: boolean): boolean {
    const cur = memories.find(m => m.id === card.id)
    if (cur) {
      if (reinforce) cur.weight = Math.min(10, cur.weight + 1)
      cur.body = card.body
      if (cur.archived) cur.archived = false
      return false
    }
    memories.push(card)
    return true
  }

  /**
   * 巩固：把一段经历提炼成长期记忆。全程确定性，零模型调用。
   * 四类产物——反复踩的坑 / 跑通的链路 / 高频低成功率的薄弱环节 / 失败后悬空的未解之事。
   */
  function consolidate(reason: string, enteredAt: number, deepest: Phase): SleepReport {
    const now = clock()
    const evs = buffer.slice()
    const notes: string[] = []
    let created = 0
    let reinforced = 0
    const since = state.lastConsolidateAt

    // 提炼：四类模式全部交给确定性内核（纯函数，可离线回归）
    const pat = extractPatterns(evs, since, now)

    for (const card of pat.pitfalls) {
      if (upsert(card, true)) { created += 1; notes.push(`坑：${card.title}`) } else reinforced += 1
    }
    for (const card of pat.playbooks) {
      if (upsert(card, true)) { created += 1; notes.push(`打法：${card.title}`) } else reinforced += 1
    }
    for (const card of pat.hotspots) {
      if (upsert(card, false)) { created += 1; notes.push(`薄弱：${card.title}`) } else reinforced += 1
    }
    for (const card of pat.unresolved) {
      if (upsert(card, true)) { created += 1; notes.push(`未解：${card.title}`) } else reinforced += 1
    }

    // ── 遗忘：久未使用的记忆按半衰期衰减，越线归档 ──
    let archived = 0
    for (const m of memories) {
      if (m.archived) continue
      const anchor = m.lastUsed || m.t
      const dt = Math.max(0, now - anchor)
      m.weight *= Math.pow(0.5, dt / config.memoryHalfLifeMs)
      if (m.weight < config.archiveBelow) { m.archived = true; archived += 1 }
    }

    persistMemories()
    state.lastConsolidateAt = clock()
    state.stats.consolidations += 1
    state.stats.cardsCreated += created

    const report: SleepReport = {
      t: now, enteredAt, wokeAt: 0, deepest,
      durationMs: 0, scanned: evs.length, created, reinforced, archived, notes: notes.slice(0, 12),
    }
    state.reports.push(report)
    if (state.reports.length > 20) state.reports.splice(0, state.reports.length - 20)
    persistState(true)

    pushRhythmNote(`😴 巩固（${reason}）：扫描 ${evs.length} 段经历 → 新建 ${created} / 强化 ${reinforced} / 归档 ${archived}`)
    return report
  }

  // ═══════════ ③ 召回 ═══════════

  /** 按文本召回最相关的记忆卡（确定性打分：标签 > 标题 > 正文，再乘权重） */
  function recall(text: string, limit: number): MemoryCard[] {
    const q = tokens(text)
    if (!q.length) return []
    const scored: Array<{ m: MemoryCard; s: number }> = []
    for (const m of memories) {
      if (m.archived) continue
      let s = 0
      for (const tk of q) {
        if (m.tags.some(x => x === tk)) s += 3
        else if (m.tags.some(x => x.length >= 3 && (x.includes(tk) || tk.includes(x)))) s += 1.5
        if (m.title.toLowerCase().includes(tk)) s += 2
        else if (m.body.toLowerCase().includes(tk)) s += 1
      }
      if (s <= 0) continue
      scored.push({ m, s: s * (0.5 + m.weight) })
    }
    return scored.sort((a, b) => b.s - a.s).slice(0, Math.max(1, limit)).map(x => x.m)
  }

  // ═══════════ ④ 稳态降噪 ═══════════

```

</details>

**依据 3 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:779-820](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L779-L820)

新命令召回并插入带插件来源的消息。

<details>
<summary>查看原文（42行）</summary>

```text
  if (config.memoryRecall) {
    ctx.effect(() => ctx.on('agent/pre-step' as never, (async (payload: unknown, next: () => Promise<unknown>) => {
      const decision = await next() as { kind?: unknown; messages?: unknown[] } | null
      if (!decision || decision.kind !== 'enter') return decision
      try {
        const p = payload as { agent?: unknown }
        const agent = p?.agent
        if (agent === undefined) return decision
        const session = (agent as { session?: { id?: unknown; snapshotEvents?: () => unknown } }).session
        const sid = String(session?.id ?? 'default')
        const human = latestHuman(session?.snapshotEvents?.())
        if (!human) return decision
        // 同一条命令只注入一次。关键：**只有真注入了才记账**——
        // 若在「没命中」时也记账，那条命令就永久失去召回机会（记忆库是随睡眠慢慢长出来的，
        // 一条命令进来时库里可能还没有对应经验，不该被一次性判死）。
        const turn = Number((p as { turn?: unknown })?.turn ?? NaN)
        const key = Number.isFinite(turn) ? `turn:${turn}` : `seq:${human.seq}`
        if (recalledKeyBySession.get(sid) === key) return decision

        const hits = recall(human.text, config.recallLimit)
        if (!hits.length) return decision
        recalledKeyBySession.set(sid, key)
        const now = clock()
        for (const h of hits) { h.uses += 1; h.lastUsed = now; h.weight = Math.min(10, h.weight + 0.2) }
        persistMemories(true)
        state.stats.recalls += 1
        persistState(true)

        const lines = [
          '【皮层记忆】这类事以前有过记录，先看一眼再动手：',
          ...hits.map(h => `- [${KIND_LABEL[h.kind] ?? h.kind}] ${h.title}${h.body ? ` —— ${h.body.split('\n')[0]}` : ''}（用过 ${h.uses} 次）`),
          '（cortex_memory action=search 看全文；与本次无关就忽略）',
        ]
        return {
          ...decision,
          messages: [...(Array.isArray(decision.messages) ? decision.messages : []), createUserMessage({
            source: { kind: 'plugin:@dsh-external/dsh-cortex' },
            content: [{ type: 'text', text: lines.join('\n') }],
          })],
        }
      } catch { return decision }
    }) as never), 'cortex: memory recall on pre-step')
```

</details>

#### 缺口

- 没有已标注任务集衡量误召回/漏召回。
  **影响**：可能将不同上下文中的同名工具错误泛化。
  **进一步探讨**：跨项目分组测试同名工具、错误消息变化及实际建议帮助率。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 持久化、隔离和静默失败怎样影响可靠性？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

全部卡片写到统一 $DSH_HOME/plugins/dsh-cortex/memory.jsonl，状态写 state.json，数据结构不带 project/session/用户范围；读取时会加载所有卡并对所有会话的真人命令搜索，因此在共用 DSH_HOME 的多项目环境会交叉召回。卡片可能含工具错误文本，错误中若有敏感内容会持久化；普通 writeFileSync 没显式权限、原子写或版本检查。读写异常被 catch 后静默吞掉，调用方无法分辨“记忆已持久化”与“磁盘失败”。这些风险都可由静态源码看到，真实泄露/损坏是否发生未验证。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:103-112](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L103-L112)

单一全局数据目录和 JSONL/状态文件。

<details>
<summary>查看原文（10行）</summary>

```text
function dshHome(): string {
  return process.env.DSH_HOME || join(homedir(), '.dsh')
}
function dataDir(): string {
  const d = join(dshHome(), 'plugins', 'dsh-cortex')
  if (!existsSync(d)) mkdirSync(d, { recursive: true })
  return d
}
function memoryFile(): string { return join(dataDir(), 'memory.jsonl') }
function stateFile(): string { return join(dataDir(), 'state.json') }
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:193-201](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L193-L201)

state 写盘失败静默吞掉。

```text
function readJson<T>(file: string, fallback: T): T {
  try {
    if (!existsSync(file)) return fallback
    return JSON.parse(readFileSync(file, 'utf8')) as T
  } catch { return fallback }
}
function writeJson(file: string, data: unknown): void {
  try { writeFileSync(file, JSON.stringify(data, null, 2), 'utf8') } catch { /* 稳态优先：落盘失败不抛 */ }
}
```

**依据 3 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:471-513](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L471-L513)

memory.jsonl 全量读写、异常静默且未设置权限。

<details>
<summary>查看原文（43行）</summary>

```text
  function loadMemories(): void {
    memories = []
    try {
      if (!existsSync(memoryFile())) return
      for (const line of readFileSync(memoryFile(), 'utf8').split('\n')) {
        const s = line.trim()
        if (!s) continue
        try { memories.push(JSON.parse(s) as MemoryCard) } catch { /* 跳过坏行，记忆不许拖垮皮层 */ }
      }
    } catch { /* 忽略 */ }
  }
  /**
   * 记忆落盘。throttled=true 时 30 秒内只写一次——召回是**读操作**，
   * 只更新「用过几次」，不该每读一次就落一次盘（否则外部清理会被立刻写回）。
   */
  function persistMemories(throttled = false): void {
    if (throttled && clock() - lastMemoryPersistAt < 30000) return
    lastMemoryPersistAt = clock()
    try {
      writeFileSync(memoryFile(), memories.map(m => JSON.stringify(m)).join('\n') + (memories.length ? '\n' : ''), 'utf8')
    } catch { /* 忽略 */ }
  }
  function loadState(): void {
    const s = readJson<Partial<CortexState>>(stateFile(), {})
    state = {
      phase: 'awake',
      lastActivityAt: clock(),
      lastConsolidateAt: Number(s.lastConsolidateAt ?? 0),
      sleepStartedAt: 0,
      reports: Array.isArray(s.reports) ? (s.reports as SleepReport[]).slice(-20) : [],
      rhythm: (s.rhythm && typeof s.rhythm === 'object') ? s.rhythm as Record<string, number[]> : {},
      noise: (s.noise && typeof s.noise === 'object') ? s.noise as Record<string, NoiseEntry> : {},
      stats: {
        consolidations: Number(s.stats?.consolidations ?? 0),
        cardsCreated: Number(s.stats?.cardsCreated ?? 0),
        recalls: Number(s.stats?.recalls ?? 0),
        noiseSuppressed: Number(s.stats?.noiseSuppressed ?? 0),
      },
    }
  }
  function persistState(force = false): void {
    if (!force && clock() - lastPersistAt < 10000) return
    lastPersistAt = clock()
```

</details>

**依据 4 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:324-333](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L324-L333)

pitfall 正文与标签取自错误文本。

<details>
<summary>查看原文（10行）</summary>

```text
      id: cardId('pitfall', f.tool),
      t: f.at,
      kind: 'pitfall',
      title: `${f.tool} 连续失败 ${f.count} 次`,
      body: `错误：${f.err || '（无错误信息）'}\n处置：先核参数与路径，再换工具或换器官；不要原地重试。`,
      tags: [f.tool, ...tokens(f.err).slice(0, 8)],
      weight: 1 + Math.min(2, f.count / 3),
      uses: 0, lastUsed: 0, source: 'sleep',
    })
  }
```

</details>

#### 缺口

- 未在多用户/项目与失败注入环境复现交叉召回或写丢失。
  **影响**：风险范围取决于 DSH_HOME 共享方式和宿主文件权限。
  **进一步探讨**：隔离多会话并注入权限/磁盘错误，核查状态可见性和文件权限。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何试用并判断它是否比人工记忆更有价值？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

只建议在个人、隔离的 DSH_HOME 试验。先审阅历史错误信息是否含敏感值，关闭自动召回或控制卡片，再执行跨会话同/异任务测试，记录有效提醒、误提醒和错误持久化。若用于团队或多个项目，应先按项目/会话分区或显式作用域、对卡片脱敏并将写失败报给操作者，同时用原子写/备份降低损坏风险；这些不是当前实现。成本主要是持续监看误判、存储与失效卡清理，而非模型 token。

#### 证据与依据

**依据 1 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:70-83](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L70-L83)

默认自动睡眠/召回与阈值配置。

<details>
<summary>查看原文（14行）</summary>

```text
export const Config = z.object({
  enabled: z.boolean().default(true),
  sleepAfterMs: z.number().default(120000),
  deepAfterMs: z.number().default(300000),
  autoSleep: z.boolean().default(true),
  consolidateGapMs: z.number().default(120000),
  tickMs: z.number().default(3000),
  memoryRecall: z.boolean().default(true),
  recallLimit: z.number().default(3),
  memoryHalfLifeMs: z.number().default(604800000),
  archiveBelow: z.number().default(0.08),
  bufferMax: z.number().default(400),
  noiseWindowMs: z.number().default(60000),
  noiseConvergeAt: z.number().default(5),
```

</details>

**依据 2 · 源码核查**：[workspace/plugins/dsh-cortex/src/index.ts:486-492](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/src/index.ts#L486-L492)

每次持久化全量覆盖 memory.jsonl。

```text
  function persistMemories(throttled = false): void {
    if (throttled && clock() - lastMemoryPersistAt < 30000) return
    lastMemoryPersistAt = clock()
    try {
      writeFileSync(memoryFile(), memories.map(m => JSON.stringify(m)).join('\n') + (memories.length ? '\n' : ''), 'utf8')
    } catch { /* 忽略 */ }
  }
```

**依据 3 · 作者声明**：[workspace/plugins/dsh-cortex/README.md:85-119](https://github.com/1420079678-ctrl/agent-body/blob/9403444d87d5e962f9a4f0c4c10fdb48f37f7d66/workspace/plugins/dsh-cortex/README.md#L85-L119)

作者说明配置、数据目录和试验报告。

<details>
<summary>查看原文（35行）</summary>

````text
$DSH_HOME/plugins/dsh-cortex/
├── memory.jsonl    # 长期记忆（一行一张卡）
└── state.json      # 相位 / 昼夜节律 / 告警账本 / 睡眠报告 / 统计
```

## 与 organism 的分工

- **organism 侧根治**：申报器官的来源插件不在时标 `installed=false`，判为「未安装」而非「离线」——告警只报「装了却坏了」的，不再每跳刷一个永远好不了的僵尸告警。
- **cortex 侧兜底**：即使 organism 真的发出告警，皮层也会去重、收敛、静默。

两层互补：一层不产生噪音，一层即使有噪音也不让它变噪音。

## 构建与重放

```powershell
& <DSH_CHECKOUT>\workspace\plugins\dsh-cortex\scripts\replay-cortex.ps1
# junction 依赖 → tsc 编译 → 58 项离线确定性回归
```

注入：`dev_inject_plugin dir=<DSH_CHECKOUT>\workspace\plugins\dsh-cortex`
已注入后改代码：`dev_reload_package dsh-cortex`（**只编译不重载 = 跑的还是旧代码**）

已 `dev_install_package` 进 profile bundles，**随 DSH 重启自动上线**。

## 实测口径（2026-09-11）

| 机制 | 验证方式 | 结果 |
|---|---|---|
| **自动入睡 → 深睡 → 自动巩固** | 节律临时压到 6s/15s，真静默 36 秒全程采样 | `awake → light(12.9s) → deep(18.9s)`，深睡中自动巩固（次数 1→2），零人工干预 |
| **醒来报告** | 下次会话活动唤醒后看 history | `12:20:52 最深 deep 时长 32 秒 扫描 4 段经历` |
| **心跳不干扰睡眠** | 同期观察心跳计数与相位 | 心跳 1→2（通道在），相位保持 deep、静默时长持续增长到 40s |
| **遗忘归档** | 半衰期临时压到 1 秒 + 关召回 16 秒后巩固 | 真实触发 `归档遗忘：1`，`cortex_memory action=revive` 可召回 |
| **降噪收敛** | 造真实告警（内脏感觉连续失败 3 次），逐 11 秒采样 | count 爬到 6 时 `silenced=True`，此后彻底安静 |
| **降噪抑制** | 默认 60 秒窗口下重复告警 | 抑制计数 2→4→7→9，窗口内重复只计数不刷屏 |
| **命令级召回** | 写入记忆卡后发下一条命令 | 输入里出现《皮层记忆》注入，召回计数 +1，卡权重 2.00→2.20 |
````

</details>

#### 缺口

- 缺少真实任务的收益、误提醒成本和增长规模测量。
  **影响**：无法估算长期净效益。
  **进一步探讨**：在受控任务集按周衡量召回命中、误引导、人工纠错和卡片增长。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
