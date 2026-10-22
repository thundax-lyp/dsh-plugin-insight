# dsh-anchored-monitor

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)

分析版本：[086bd05](https://github.com/Aik358/dsh-anchored-monitor/tree/086bd05e1e3035ddf23133f3a0ee479291a4b237)

<!-- BEGIN META -->
[![GitHub ★ 13](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13&color=yellow&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor) [![npm 30d 973](https://img.shields.io/static/v1?label=npm+30d&message=973&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor) [![最新发布 2026-09-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-05&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@a9i5k4/dsh-anchored-monitor)
<!-- END META -->

> **实现功能**：对 DSH reasoning 流做词形波段监控，独立进程可自动中断并重置会话。

> **核心亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](#research-q02)。

> **风险与缺陷**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 监控实际测量什么，能否代表模型能力/效率？](#detail-section-11)
  - [Q02 · 独立监控进程与宿主如何把信号变成干预？](#detail-section-12)
  - [Q03 · README 的“默认只监测”是否符合固定版本默认配置？](#detail-section-13)
  - [Q04 · 本机 HTTP 与日志暴露面如何影响部署？](#detail-section-14)
  - [Q05 · 怎样证明监控有效且避免误中断用户任务？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：研究某模型推理表达轨迹并可视化；自动干预需极严格验证。

普通 DSH 会话不读取/改变推理轨迹；此包加入实时词形监控和自动控制。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| 词形 | 轨迹代理 | 非能力真值 |
| L2/L3 | 重置/续跑 | 误中断 |
| API | 仪表与设置 | 无鉴权 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| DSH llm/session/agents | 推送与干预 | 无监控/续跑 |
| monitor 进程 | 分段/日志 | watchdog 重启 |
| loopback HTTP | 数据/API | 数据与控制边界 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 隔离 | 关干预 | 无 cancel/followup |
| 回放 | 词形/任务结果对照 | 有效相关 |
| 审批 | 人审 L2/L3 | 无误中断 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 部署 | 常驻 monitor/配置 | DSH 版本适配 |
| 使用 | 50ms 轮询、流推送/日志 | 性能与误判 |
| 治理 | 会话隐私、干预审批 | 误中断恢复 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 波段 | 词形比例 | 能力质量 |
| 默认 | 干预 true | README 只读声明相反 |
| L2/L3 | cancel/followup | 安全恢复 |

> **思考**：默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](#research-q02)。

将流式推理指纹、窗口和实验日志做成实时仪表与可配置状态机。详见[Q02](#research-q02)。

host 自动拉 monitor，流/日志推送；默认 intervention true，HTTP CORS 通配且无鉴权；设置允许任意 http(s) monitorUrl。

<a id="detail-section-5"></a>

### 1.4 主要限制

默认启用会话打断/自动续跑，README 却称默认仅监测；HTTP CORS:* 无鉴权且配置可改 monitorUrl。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅隔离 profile 显式关闭干预，先回放验证代理指标；真实使用前需默认只读、身份鉴权及人审。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码明确默认自动干预，与 README“默认只可视化”冲突；词形与能力关系无独立验证，本机 API 边界薄。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、config/default.yaml、src/shared/config-loader.ts、src/monitor/session-manager.ts、src/monitor/server.ts、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交静态审阅 README、package、默认配置、监控和宿主源码；未运行目标进程/模型。
- 下一步：离线样本盲评质量相关、隔离假会话测默认配置/中断/续跑与 CORS/配置边界。

**分析版本**

- **仓库**：[Aik358/dsh-anchored-monitor](https://github.com/Aik358/dsh-anchored-monitor)
- **版本号**：0.3.1（[固定提交 086bd05](https://github.com/Aik358/dsh-anchored-monitor/tree/086bd05e1e3035ddf23133f3a0ee479291a4b237)）
- **版本日期**：2026-09-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

默认只读、受保护的统计摘要和人工批准干预能降低误打断；尚未实现。详见[Q05](#research-q05)。

离线样本盲评质量相关、隔离假会话测默认配置/中断/续跑与 CORS/配置边界。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 778 | — | — | 8614 |
| .js | source | 7 | 5473 | 5083 | 241 | — |
| .mjs | source | 5 | 476 | 396 | 53 | — |
| .ts | source | 31 | 3506 | 2946 | 265 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor/issues?q=is%3Aissue+created%3A2026-09-22T06%3A08%3A15.558Z..2026-10-22T06%3A08%3A15.558Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/Aik358/dsh-anchored-monitor/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T06%3A08%3A15.558Z..2026-10-22T06%3A08%3A15.558Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**验证词形代理指标、默认干预与会话/HTTP 数据边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 监控实际测量什么，能否代表模型能力/效率？

**研究主题：**场景与需求

#### 完整回答

监控抓取 reasoning/text 流与会话事件，按 we/let’s/let me 词形计数和窗口比值分 spec/mixed/react，展示波段/强度并触发规则。词语比例是表达方式代理指标，不能单独证明推理质量、能力或任务效率；README 把波段称“高能力/低效率”、引用 Project2 分数，是作者/社区报告，本轮没有独立数据验证。与仅做可视化不同，默认配置还允许自动干预。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-14](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/README.md#L5-L14)

作者能力表述。

<details>
<summary>查看原文（10行）</summary>

```text
> **In one sentence (一句话说清): it's a whip for DeepSeek V4 Pro.**
> When the model falls from the focused, high-capability mode
> ("We need…" / "I will…") into the scattered, low-focus mode ("let me…"),
> the whip cracks — and pulls it back.
> 这是给 DeepSeek V4 Pro 加的一根鞭子——当它从「We need / I will」的高专注、高能力模式，
> 跌落到「let me」的发散、低专注、低效率模式时，就抽它一鞭，让它改回去。

> Real-time chain-of-thought anchoring monitor & intervention for DeepSeek Harness.
> Watch the we / let's / let me fingerprint of every reasoning block, stay in the
> spec band, and pull the model back automatically when the trajectory drifts.
```

</details>

**依据 2 · 作者声明**：[README.md:73-97](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/README.md#L73-L97)

作者基准和分段声称。

<details>
<summary>查看原文（25行）</summary>

```text
## Why this exists

DeepSeek V4 Pro conditions heavily on what the **first request** shows it. The
community measured the consequence: the official Minimal preset (46-character
persona + `bash`/`str_replace_editor`) anchors a collective "we" trajectory
and scores 99/96 on Project2, while the full Standard preset anchors an
actor-style "let me" trajectory and scores 91. Behavior is **path-committed**:
once anchored, expanding the tool catalog perturbs at most one reasoning block —
the mode never flips back on its own.

Anchored presets ([dsh-anchored-standard](https://github.com/xiaobright/dsh-anchored-standard))
solve the *bootstrap*. This plugin solves what happens **after** anchoring:
external factors (imperative hints, oversized injected context) can drag the
trajectory out of the spec band, and nothing detects or repairs that drift —
until now.

## What it does

- **Live fingerprinting** — every reasoning block is scored for the spec
  trajectory markers (`we`, `let's`, `we'll`, `we need`, …) versus the
  react marker (`let me`), over a sliding window.
- **Three-band model** — exactly the quantization measured by
  [dsh-router-standard](https://github.com/yjh051108/dsh-router-standard):
  `persona_ratio < 0.2 → spec`, `0.2–0.5 → mixed` (the unstable transition
  band), `≥ 0.5 → react`.
```

</details>

**依据 3 · 源码核查**：[config/default.yaml:13-61](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/config/default.yaml#L13-L61)

词典和分段阈值。

<details>
<summary>查看原文（49行）</summary>

```text
features:
  lexicon:
    # 正向词典: spec 轨迹的集体/规划措辞指纹
    # 口径来自 dsh-anchored-flash verify/count-pronouns.mjs: we / let's 整词大小写不敏感
    positive:
      - { term: "we", weight: 2.0, match: word }
      - { term: "let's", weight: 1.5, match: word }
      - { term: "we'll", weight: 1.2, match: word }
      - { term: "we need", weight: 1.2, match: word }   # router-standard classifier.mjs: 首行 "we need" +3
      - { term: "our", weight: 0.8, match: word }
    # 负向词典: 仅保留 react 轨迹指纹 "let me"
    # 锚定纠偏(2026-08-17): i will / i'll / i need 为规划标记, 已移入中性, 不算负向
    negative:
      - { term: "let me", weight: 3.0, match: word }
    # 中性词典: 规划标记(第一人称将来时/需求陈述, 非行动者措辞) + 验证类
    neutral:
      - { term: "i will", weight: 1.0, match: word }
      - { term: "i'll", weight: 1.0, match: word }
      - { term: "i need", weight: 0.8, match: word }
      - { term: "check", weight: 0.4, match: word }
      - { term: "verify", weight: 0.4, match: word }
  regex_features:
    - { name: "question_marks", pattern: "\\?", weight: 0.2 }
    - { name: "bullet_list", pattern: "^(\\s*[-*]\\s)", weight: 0.3 }

window:
  type: "sliding"           # sliding | decay
  size: 20
  decay_lambda: 0.05

scoring:
  type: "weighted_ratio"    # weighted_ratio | percentile | composite
  weights:
    alpha: 2.0              # 正向聚合权重
    beta: 0.5               # 中性聚合权重
    gamma: 1.5              # 负向聚合惩罚
    epsilon: 1.0            # 平滑项
  normalize: true           # 分位数归一化到 0-100
  percentile_window: 200

bands:
  # 三波段量化 — 严格按 dsh-router-standard router-core.mjs bandOf():
  #   persona_ratio < 0.2            → spec  (实测稳定区 0..0.15)
  #   0.2 <= persona_ratio < 0.5     → mixed (过渡带, 实测不稳定且得分低于任一稳定带, 必须避开)
  #   persona_ratio >= 0.5           → react (实测稳定区 0.5..1.0)
  # persona_ratio = 窗口内 "let me" 数 / (正向词数 + "let me" 数)
  mode: "persona_ratio"
  spec_max: 0.2
  react_min: 0.5
```

</details>

**依据 4 · 源码核查**：[src/monitor/session-manager.ts:137-140](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/session-manager.ts#L137-L140)

波段计算入口。

```text
  private bandOf(ratio: number | null, baseline: BaselineCalculator): Band {
    if (ratio === null || baseline.mean === null) return 'unknown'
    if (ratio < this.opts.config.bands.spec_max) return 'spec'
    if (ratio < this.opts.config.bands.react_min) return 'mixed'
```

#### 缺口

- 未取得对照任务数据/独立验证。
  **影响：**指标与真实质量相关性未知。
  **进一步探讨：**按任务结果盲测及对照实验。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 独立监控进程与宿主如何把信号变成干预？

**研究主题：**功能与机制、贡献与相对优势

#### 完整回答

host 插件通过 llm/stream 与 session/event 推送增量到独立 monitor，watchdog 每 15 秒保活，monitor 做特征/窗口/阈值/冷却后生成 L1/L2/L3 signal。宿主轮询 sent 信号，L1 followup 提示；L2/L3 设置重置载荷、agent.cancel 当前回合并以 role:user 的 followup 自动续跑。这是强作用于会话的控制链，不只是边栏仪表。若 session 识别或词形误判，可打断用户原任务。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:152-190](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L152-L190)

独立进程与 watchdog。

<details>
<summary>查看原文（39行）</summary>

```text
  // ── 1) 监控进程生命周期: 自动拉起 + watchdog ──
  let monitorProc = null
  let monitorBusy = false
  const isMonitorOnline = async (url) => {
    try {
      const r = await fetch(url + '/api/health', { signal: AbortSignal.timeout(1500) })
      return r.ok
    } catch {
      return false
    }
  }
  const ensureMonitorRunning = async () => {
    if (monitorBusy) return
    monitorBusy = true
    try {
      if (!config.enabled || !config.autoStart) return
      if (await isMonitorOnline(config.monitorUrl)) return
      try {
        await mkdir(homeFile(), { recursive: true })
        await writeFile(overridesPath(), JSON.stringify(config.monitorOverrides ?? {}, null, 2), 'utf8')
      } catch (err) {
        warnOnce('anchored-monitor: overrides 文件写入失败: ' + String(err && err.message ? err.message : err))
      }
      monitorProc = spawn(process.execPath, [MONITOR_ENTRY, '--profile', config.profile, '--overrides', overridesPath()], {
        detached: true,
        stdio: 'ignore',
        windowsHide: true,
        cwd: PACKAGE_ROOT
      })
      monitorProc.unref()
      for (let i = 0; i < 12; i++) {
        await new Promise((r) => setTimeout(r, 500))
        if (await isMonitorOnline(config.monitorUrl)) return
      }
      warnOnce('anchored-monitor: 监控进程已拉起但未就绪: ' + config.monitorUrl)
    } finally {
      monitorBusy = false
    }
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:239-327](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L239-L327)

流/事件推送。

<details>
<summary>查看原文（89行）</summary>

```text
  // 流式增量推送: 订阅 llm/stream 的 reasoning-delta 与 text-delta, 按 ~1s 节流分别实时推给监控进程——
  // 图表/变阻器条在模型推理过程中就能连续跳动, 不必等整轮结束。
  // 计数线性可加, 增量切块与整块推送在窗口聚合上完全等价。
  const STREAM_THROTTLE_MS = 1000
  const streamBuffers = new Map() // sessionId → { text, last, active }  (reasoning 信道)
  const textStreamBuffers = new Map() // sessionId → { text, last, active }  (text 信道, 供 CoT 守卫)
  ctx.on('llm/stream', (options, next) => {
    const sessionId = options && typeof options.sessionId === 'string' ? options.sessionId : undefined
    if (!sessionId || !config.enabled) return next()
    const meta0 = sessionMetaBySession.get(sessionId)
    if (meta0 && meta0.subagent) return next()
    // 规矩(2026-08-18 事故后立下):
    //   llm/stream 是"流透传"waterfall —— 链上前面的监听器会直接迭代本监听器的返回值。
    //   ①生产方(本文件): 监听器必须是普通函数, 返回 async generator; 禁止 async 函数
    //     (async 会把 generator 包成 Promise, 上游 for await 迭代时抛
    //     "next(...) is not a function or its return value is not async iterable")。
    //   ②消费方(所有插件): 一律 for await (const c of await next()) —— 先 await 再迭代,
    //     下游返回 Promise 或流都能安全透传(dsh-draw-gacha 已加该防御)。
    //   agent/pre-step、system-prompt/assemble 属"值传递"事件, async + await next() 是安全的。
    return (async function* () {
      for await (const chunk of next()) {
        yield chunk
        if (!chunk || typeof chunk.text !== 'string' || chunk.text === '') continue
        if (chunk.type === 'reasoning-delta') {
          let buf = streamBuffers.get(sessionId)
          if (!buf) {
            buf = { text: '', last: 0, active: true }
            streamBuffers.set(sessionId, buf)
          }
          buf.text += chunk.text
          buf.active = true
          const now = Date.now()
          if (now - buf.last >= STREAM_THROTTLE_MS) {
            buf.last = now
            const delta = buf.text
            buf.text = ''
            void pushReasoning(sessionId, delta)
          }
        } else if (chunk.type === 'text-delta') {
          let tbuf = textStreamBuffers.get(sessionId)
          if (!tbuf) {
            tbuf = { text: '', last: 0, active: true }
            textStreamBuffers.set(sessionId, tbuf)
          }
          tbuf.text += chunk.text
          tbuf.active = true
          const now = Date.now()
          if (now - tbuf.last >= STREAM_THROTTLE_MS) {
            tbuf.last = now
            const delta = tbuf.text
            tbuf.text = ''
            void pushText(sessionId, delta)
          }
        }
      }
    })()
  })
  ctx.on('session/event', (session, event) => {
    if (!session) return
    try {
      const ws = (session.header && session.header.cwd) ? session.header.cwd : (session.workspace || '')
      const sub = !!(session.header && session.header.parentSession)
      if (ws || sub) sessionMetaBySession.set(session.id, { workspace: ws, subagent: sub })
    } catch (e) { /* 无 header 的会话忽略元数据 */ }
    // 子代理会话不参与监控(header.parentSession 非空 = subagent, 由 dsh-subagent childSessionMeta 写入)
    if (sessionMetaBySession.get(session.id) && sessionMetaBySession.get(session.id).subagent) return
    if (event?.type !== 'assistant/message') return
    // 若本轮已通过流式增量推送, 只冲掉尾部残留; 否则整段推送(适配器无 reasoning-delta 时兜底)
    const buf = streamBuffers.get(session.id)
    if (buf && buf.active) {
      if (buf.text) void pushReasoning(session.id, buf.text)
      buf.text = ''
      buf.active = false
      // text 信道残留也一并冲掉(CoT 守卫数据)
      const tbuf = textStreamBuffers.get(session.id)
      if (tbuf) {
        if (tbuf.active && tbuf.text) void pushText(session.id, tbuf.text)
        tbuf.text = ''
        tbuf.active = false
      }
      return
    }
    const text = reasoningOf(event)
    if (text) void pushReasoning(session.id, text)
    // 无流式增量时, 正文从事件消息的 content 里取(兜底)
    const content = event && event.data && event.data.message && event.data.message.content
    if (Array.isArray(content)) {
      const body = content.filter((c) => c && c.type === 'text' && typeof c.text === 'string').map((c) => c.text).join('\n')
      if (body) void pushText(session.id, body)
```

</details>

**依据 3 · 源码核查**：[src/monitor/session-manager.ts:288-345](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/session-manager.ts#L288-L345)

阈值到信号。

<details>
<summary>查看原文（58行）</summary>

```text
    const decision = decideIntervention({
      phase: state.phase,
      trend,
      anomalyTriggered: anomaly.triggered,
      anomalySeverity: anomaly.severity,
      bandHit: anomaly.bandHit,
      recovered,
      l2Attempts: state.l2Attempts,
      config: cfg.intervention
    })
    if (!this.interventionsEnabled && decision.level !== 'none') {
      // 干预总开关关闭: 只监控不干预(评分/波段/阈值事件照常, 决策被拦截)
      decision.level = 'none'
      decision.nextPhase = 'healthy'
      decision.resetL2Attempts = true
      decision.reason = 'interventions disabled'
    }
    state.lastNormalized = scored.normalized
    if (decision.resetL2Attempts) state.l2Attempts = 0

    if (decision.level !== 'none' && state.phase !== 'restart') {
      if (!state.cooldowns.isReady(decision.level, block.timestamp)) {
        this.opts.emit({
          type: 'intervention_executed',
          sessionId: block.sessionId,
          timestamp: block.timestamp,
          sequence: seq,
          level: decision.level,
          status: 'cooldown'
        })
      } else {
        const signal = this.buildSignal(state, decision.level, decision.reason, block.timestamp)
        state.cooldowns.markSent(decision.level, block.timestamp)
        state.phase = decision.nextPhase
        if (decision.level === 'L2') {
          state.l2Attempts += 1
          this.resetWindow(state)
        }
        if (decision.level === 'L3') state.phase = 'restart'
        state.interventions.push({
          level: decision.level,
          reason: decision.reason,
          timestamp: block.timestamp,
          sequence: seq,
          status: 'sent',
          payload: signal.payload
        })
        this.opts.emit({
          type: 'intervention_triggered',
          sessionId: block.sessionId,
          timestamp: block.timestamp,
          sequence: seq,
          level: decision.level,
          reason: decision.reason,
          payload: signal.payload
        })
        void this.opts.sender.send(signal)
      }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:365-427](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L365-L427)

取消、followup 和重置。

<details>
<summary>查看原文（63行）</summary>

```text
   * L2/L3: 强制停掉当前正在运行的回合(agent.cancel, 保留 inbox 队列),
   * 相当于在输入框里重新注入一段上下文——软重启对话。
   */
  const cancelCurrentTurn = (sessionId, reason) => {
    try {
      const agent = agentFor(sessionId)
      if (agent && typeof agent.cancel === 'function') {
        agent.cancel({ kind: 'hook', reason: reason }, { keepInbox: true })
        return true
      }
    } catch (err) {
      warnOnce('anchored-monitor: 回合取消失败: ' + String(err && err.message ? err.message : err))
    }
    return false
  }
  /** 自动续跑: 把干预消息写入 agent inbox 并唤醒驱动(agent.followup) */
  const submitContinuation = (sessionId, text) => {
    let delivered = false
    try {
      const agent = agentFor(sessionId)
      if (agent && typeof agent.followup === 'function') {
        agent.followup({
          role: 'user',
          content: [{ type: 'text', text }],
          source: { kind: 'anchored-monitor', form: 'continuation' }
        })
        delivered = true
      }
    } catch (err) {
      warnOnce('anchored-monitor: 自动续跑失败, 回退为下一轮注入: ' + String(err && err.message ? err.message : err))
    }
    if (!delivered) pendingHints.set(sessionId, text)
    return delivered
  }
  const executeSignal = (signal) => {
    const label = 'anchored-monitor: L' + signal.level + ' #' + (signal.sequence ?? '?') + ' @' + signal.sessionId
    try {
      let delivered = false
      let note = ''
      if (signal.level === 'L1') {
        delivered = submitContinuation(signal.sessionId, signal.payload && signal.payload.hintText ? signal.payload.hintText : '')
        note = 'L1 提示'
      } else if (signal.level === 'L2') {
        // L2 = 软重启: ①取消当前运行中的回合(保留 inbox); ②设置重置载荷(下一轮 assemble 消费);
        // ③followup 注入"重新输入"的上下文——以 Minimal persona + 双工具继续任务
        pendingResets.set(signal.sessionId, (signal.payload && signal.payload.reset) || { systemPrompt: '', tools: [] })
        const cancelled = cancelCurrentTurn(signal.sessionId, 'anchored-monitor L2 reset')
        delivered = submitContinuation(signal.sessionId, 'anchored-monitor: react-band trajectory detected (' + (signal.reason || '') + '). An L2 soft-restart is applied — the running turn was stopped and this request continues under the minimal 46-character persona with the bash and str_replace_editor bootstrap pair. Continue the task from where you left off, in a plan-first collective style (we will …). 锚定监控已执行 L2 强制重置: 当前回合已停止, 本轮以 Minimal 46 字符句 + 双工具软重启, 请以规划式风格(we will / we need)从刚才的位置继续任务。')
        note = 'L2 重置' + (cancelled ? '' : '(cancel 未命中)')
      } else if (signal.level === 'L3') {
        // L3 = 软重启 + 重启建议
        pendingResets.set(signal.sessionId, (signal.payload && signal.payload.reset) || { systemPrompt: '', tools: [] })
        const cancelled = cancelCurrentTurn(signal.sessionId, 'anchored-monitor L3 restart advice')
        delivered = submitContinuation(signal.sessionId, 'anchored-monitor: L2 retries exhausted (' + (signal.reason || '') + '). A full session restart is recommended for the cleanest state; the running turn was stopped and the reset condition is applied — continue the task in a plan-first style. 锚定监控提示: L2 重试已耗尽, 建议全新会话; 当前回合已停止并应用重置条件, 请以规划式风格继续任务。')
        note = 'L3 重启建议' + (cancelled ? '' : '(cancel 未命中)')
      }
      const status = delivered ? 'executed' : 'failed: agents.followup 不可用 (' + note + ' 已排队待注入)'
      logInfo(label + ' → ' + (delivered ? 'executed' : status))
      ackSignal(signal, status)
    } catch (err) {
      ackSignal(signal, 'failed: ' + String(err && err.message ? err.message : err))
    }
  }
```

</details>

#### 缺口

- 未运行目标会话。
  **影响：**误打断/自动续跑恢复率未知。
  **进一步探讨：**模拟多会话与误判故障注入。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · README 的“默认只监测”是否符合固定版本默认配置？

**研究主题：**缺陷与关键质疑、工程质量与复用

#### 完整回答

README 明说不操作时只是 live gauge、默认无干预；但 host 配置默认 profile=default，config loader 将 default 对应 config/default.yaml，该文件 intervention.enabled:true，SessionManager 把它读成启用。插件安装后自动拉进程，故无用户显式关闭/覆盖时有自动 L1/L2/L3 干预路径。README 后文虽然提醒只给 V4 Pro 0813 开干预，默认值却与安全建议相反。此差异应作为上线阻断条件核实，不能依 README 认为监测专用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:25-35](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/README.md#L25-L35)

默认仅可视化的作者声明。

<details>
<summary>查看原文（11行）</summary>

```text
## What it is, in one line

**Don't touch a thing and it's simply a live gauge of how hard your model is
thinking right now.** Thinking intensity, three-band state and the ECG-style
curve, tucked into the corner of your screen — a real-time visualization of
your model's thinking efficiency / capability intensity.

- **Visualization first (default — no intervention until you want it)**: a
  real-time thinking-efficiency / capability-intensity gauge.
- **Intervention when you need the whip**: only cracks when the trajectory
  drifts into the scattered "let me" band — and it auto-continues the task.
```

</details>

**依据 2 · 作者声明**：[README.md:58-71](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/README.md#L58-L71)

其他模型应关干预建议。

<details>
<summary>查看原文（14行）</summary>

```text
> ⚠️ One caveat: if the session was never anchored in the first place, it stays
> in the react band and L2 keeps firing — that's a fight loop, not monitoring.
> Keep interventions **OFF (monitor-only)** unless you're on the model this whip
> was tuned for.

**When to turn interventions on / off** — the whip is tuned for
**DeepSeek V4 Pro 0813**:

- ✅ DeepSeek V4 Pro 0813 → interventions **ON** (recommended).
- ❌ Any other model → interventions **OFF** (monitor-only) — keep it as a pure live gauge.

This exact advice is shown right inside the plugin's panels:

> ℹ Tip: keep interventions on only for DeepSeek V4 Pro 0813; turn them off (monitor-only) for other models.
```

</details>

**依据 3 · 源码核查**：[lib/index.js:114-129](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L114-L129)

host 默认 profile 与启用。

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx) {
  let config = { monitorUrl: DEFAULT_MONITOR_URL, enabled: true, autoStart: true, profile: 'default', monitorOverrides: {} }
  const reload = async () => {
    let parsed = {}
    try {
      parsed = JSON.parse(await readFile(configPath(), 'utf8'))
    } catch {
      parsed = {}
    }
    config = {
      monitorUrl: typeof parsed.monitorUrl === 'string' && parsed.monitorUrl !== '' ? parsed.monitorUrl : (process.env.ANCHORED_MONITOR_URL || DEFAULT_MONITOR_URL),
      enabled: parsed.enabled !== false,
      autoStart: parsed.autoStart !== false,
      profile: typeof parsed.profile === 'string' && parsed.profile !== '' ? parsed.profile : 'default',
      monitorOverrides: parsed.monitorOverrides && typeof parsed.monitorOverrides === 'object' ? parsed.monitorOverrides : {}
    }
```

</details>

**依据 4 · 源码核查**：[src/shared/config-loader.ts:49-68](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/shared/config-loader.ts#L49-L68)

default 配置装载。

<details>
<summary>查看原文（20行）</summary>

```text
  const cfgPath = opts.configPath
    ? resolveFromRoot(opts.root, opts.configPath)
    : join(opts.root, 'config', 'default.yaml')
  const sources: string[] = [cfgPath]

  const baseRaw = await readFile(cfgPath, 'utf8')
  let config = parseYaml(baseRaw) as Record<string, unknown>
  let profileName = 'default'

  if (opts.profile) {
    profileName = opts.profile.replace(/\.yaml$/i, '')
    // 'default' 就是主配置本身(不传 --profile 也是它), 跳过重复合并, 幂等
    if (profileName !== 'default') {
      const profPath = join(opts.root, 'config', profileName + '.yaml')
      const profRaw = await readFile(profPath, 'utf8')
      config = deepMerge(config, parseYaml(profRaw))
      sources.push(profPath)
    }
  }
  if (opts.overrides) config = deepMerge(config, opts.overrides)
```

</details>

**依据 5 · 源码核查**：[config/default.yaml:80-101](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/config/default.yaml#L80-L101)

干预 true 与规则。

<details>
<summary>查看原文（22行）</summary>

```text
intervention:
  enabled: true             # 干预总开关: 关闭=只监控不打断(面板/设置可运行时一键切换, 无需重启)
  cooldowns:
    L1_ms: 30000
    L2_ms: 120000
    L3_ms: 0
  max_L2_attempts: 2
  rules:
    - { when: warning, trend: falling, action: L1 }
    - { when: critical, L2_attempts_lt: 2, action: L2 }
    - { when: critical, L2_attempts_gte: 2, action: L3 }
  hint_templates:
    # 措辞纪律 — dsh-anchored-flash 实验 E1/E1.5: 仅中性声明/建议式,
    # 禁止命令式(must/first/follow), 命令式会把 we 轨迹打回 let me
    - "reading the index is recommended — it is short"
    - "reviewing the context might be helpful"
    - "consider checking the relevant documentation"
  # L2 重置载荷 — 逐字节对齐官方 Minimal 预设:
  #   persona 46 字符 + bash/str_replace_editor 精确双工具
  # (tool-bootstrap.mjs DEFAULT_BOOTSTRAP_TOOLS; 首轮锚定 5/5, 其余 schema 11/11 翻车)
  bootstrap_tools: ["bash", "str_replace_editor"]
  bootstrap_system_prompt: "You are a helpful software engineer assistant."
```

</details>

**依据 6 · 源码核查**：[src/monitor/session-manager.ts:112-125](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/session-manager.ts#L112-L125)

启用状态初始化。

<details>
<summary>查看原文（14行）</summary>

```text
export class SessionManager {
  private sessions = new Map<string, SessionState>()
  private interventionsEnabled: boolean

  constructor(private readonly opts: SessionManagerOptions) {
    this.interventionsEnabled = opts.config.intervention.enabled !== false
  }

  /** 运行时切换干预总开关(关闭=只监控不干预, 不丢会话状态) */
  setInterventionsEnabled(enabled: boolean): void {
    if (this.interventionsEnabled === enabled) return
    this.interventionsEnabled = enabled
    this.opts.emit({ type: 'intervention_toggle', timestamp: Date.now(), enabled })
    if (!enabled) {
```

</details>

#### 缺口

- 未安装目标包或读用户 overrides。
  **影响：**特定已有安装可能另有关闭覆盖。
  **进一步探讨：**按发布 tarball/新 profile 检查有效配置。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 本机 HTTP 与日志暴露面如何影响部署？

**研究主题：**依赖、兼容与流程、效果与总成本

#### 完整回答

monitor 默认绑定 127.0.0.1:9301，但 HTTP server 对所有路由设 Access-Control-Allow-Origin:*、允许 GET/POST/OPTIONS，未见身份认证；包括读取事件/会话、切干预、forceReset 与 shutdown。host 代理路由仅核 socket/Host 环回，设置接口可写 monitorUrl（任意 http/https）并持久化，后续宿主会向它推 reasoning/text 与会话信息。真实远程可达/浏览器私网保护取决于部署，但本机同源外脚本及 URL 配置权限必须审查；会话内容和实验 JSONL 也需当敏感数据。常驻进程、50ms 日志轮询与 15s watchdog 增加资源开销。

#### 证据与依据

**依据 1 · 源码核查**：[config/default.yaml:120-133](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/config/default.yaml#L120-L133)

日志与监听默认。

<details>
<summary>查看原文（14行）</summary>

```text
experiment_log:
  path: "./logs/experiment.jsonl"
  max_file_size_mb: 50
  rotate: true

ipc:
  protocol: "http"
  host: "127.0.0.1"
  port: 9301

dashboard:
  host: "127.0.0.1"
  port: 9301
  web_root: "./web"
```

</details>

**依据 2 · 源码核查**：[src/monitor/server.ts:54-58](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/server.ts#L54-L58)

通配 CORS。

```text
function setCors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}
```

**依据 3 · 源码核查**：[src/monitor/server.ts:129-170](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/server.ts#L129-L170)

路由无身份校验。

<details>
<summary>查看原文（42行）</summary>

```text
  const server = createServer((req, res) => {
    setCors(res)
    if (req.method === 'OPTIONS') {
      res.writeHead(204)
      res.end()
      return
    }
    const url = new URL(req.url ?? '/', 'http://localhost')
    const path = url.pathname
    void (async () => {
      try {
        if (path === '/api/health' && req.method === 'GET') {
          return json(res, 200, {
            ok: true,
            uptimeMs: Math.round(process.uptime() * 1000),
            version: opts.config.version,
            sessions: opts.manager.listSummaries().length
          })
        }
        if (path === '/api/shutdown' && req.method === 'POST') {
          const address = req.socket.remoteAddress ?? ''
          if (address !== '127.0.0.1' && address !== '::1' && address !== '::ffff:127.0.0.1') {
            return json(res, 403, { ok: false, error: 'loopback-only' })
          }
          json(res, 200, { ok: true })
          setTimeout(() => process.exit(0), 150)
          return
        }
        if (path === '/api/config' && req.method === 'GET') {
          return json(res, 200, opts.config)
        }
        if (path === '/api/intervention' && req.method === 'GET') {
          return json(res, 200, { ok: true, enabled: opts.manager.isInterventionsEnabled() })
        }
        if (path === '/api/intervention' && req.method === 'POST') {
          const body = await readJsonBody(req, 1024 * 16)
          if (!body || typeof body.enabled !== 'boolean') {
            return json(res, 400, { ok: false, error: '需要 { enabled: boolean }' })
          }
          opts.manager.setInterventionsEnabled(body.enabled)
          return json(res, 200, { ok: true, enabled: opts.manager.isInterventionsEnabled() })
        }
```

</details>

**依据 4 · 源码核查**：[src/monitor/server.ts:284-308](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/server.ts#L284-L308)

reset 等可变更端点。

<details>
<summary>查看原文（25行）</summary>

```text
        const registerMatch = path.match(/^\/api\/sessions\/([^/]+)\/register$/)
        if (registerMatch && req.method === 'POST') {
          const sessionId = decodeURIComponent(registerMatch[1])
          const body = await readJsonBody(req, 1024 * 1024)
          const logPath = typeof body.logPath === 'string' ? body.logPath : undefined
          opts.manager.registerSession(sessionId, 'log_tail')
          await opts.registerSource?.(sessionId, logPath)
          return json(res, 200, { ok: true, sessionId })
        }
        const ackMatch = path.match(/^\/api\/sessions\/([^/]+)\/ack$/)
        if (ackMatch && req.method === 'POST') {
          const sessionId = decodeURIComponent(ackMatch[1])
          const body = await readJsonBody(req, 1024 * 1024)
          const level = body.level
          if (level !== 'L1' && level !== 'L2' && level !== 'L3') {
            return json(res, 400, { ok: false, error: 'level 必须是 L1/L2/L3' })
          }
          const ok = opts.manager.ack(sessionId, level, typeof body.status === 'string' ? body.status : 'executed')
          return json(res, ok ? 200 : 404, { ok })
        }
        const resetMatch = path.match(/^\/api\/sessions\/([^/]+)\/reset$/)
        if (resetMatch && req.method === 'POST') {
          const signal = opts.manager.forceReset(decodeURIComponent(resetMatch[1]))
          if (!signal) return json(res, 404, { ok: false, error: 'session not found' })
          return json(res, 200, { ok: true, signal })
```

</details>

**依据 5 · 源码核查**：[lib/index.js:204-238](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L204-L238)

推送 reasoning/text。

<details>
<summary>查看原文（35行）</summary>

```text
  const pushReasoning = async (sessionId, text) => {
    if (!config.enabled) return
    const seq = (seqBySession.get(sessionId) ?? 0) + 1
    seqBySession.set(sessionId, seq)
    const meta = sessionMetaBySession.get(sessionId)
    if (meta && meta.subagent) return
    try {
      await fetch(config.monitorUrl + '/api/push', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'reasoning_block', sessionId, sequence: seq, text, timestamp: Date.now(), workspace: meta ? meta.workspace : undefined })
      })
    } catch {
      // 离线时丢弃(监控进程就绪后继续); 每块最多丢一次
    }
  }
  // CoT 守卫(0.2.9): 把 text 信道(可见正文)增量也推给监控进程做泄漏/停摆检测。
  // 与 reasoning 独立的序号空间(textSeq), 不干扰推理窗口聚合。
  const textSeqBySession = new Map()
  const pushText = async (sessionId, text) => {
    if (!config.enabled) return
    const seq = (textSeqBySession.get(sessionId) ?? 0) + 1
    textSeqBySession.set(sessionId, seq)
    const meta = sessionMetaBySession.get(sessionId)
    if (meta && meta.subagent) return
    try {
      await fetch(config.monitorUrl + '/api/push-text', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ type: 'text_chunk', sessionId, sequence: seq, text, timestamp: Date.now(), workspace: meta ? meta.workspace : undefined })
      })
    } catch {
      // 离线时丢弃
    }
  }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:595-620](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L595-L620)

可改 monitorUrl 配置。

<details>
<summary>查看原文（26行）</summary>

```text
      {
        kind: 'exact',
        path: API_PREFIX + '/config',
        handler: async (req, res) => {
          if (!guard(req, res)) return
          if (req.method === 'GET') {
            await reload()
            return writeJson(res, 200, { ok: true, ...config })
          }
          if (req.method === 'POST') {
            const payload = await readJsonBody(req)
            if (!payload || typeof payload !== 'object') return writeJson(res, 400, { ok: false, error: 'invalid JSON body' })
            const next = { ...config }
            if (typeof payload.monitorUrl === 'string' && /^https?:\/\//.test(payload.monitorUrl)) next.monitorUrl = payload.monitorUrl
            if (typeof payload.enabled === 'boolean') next.enabled = payload.enabled
            if (typeof payload.autoStart === 'boolean') next.autoStart = payload.autoStart
            if (typeof payload.profile === 'string' && payload.profile !== '') next.profile = payload.profile
            if (payload.monitorOverrides && typeof payload.monitorOverrides === 'object') next.monitorOverrides = payload.monitorOverrides
            try {
              await mkdir(homeFile(), { recursive: true })
              await writeFile(configPath(), JSON.stringify(next, null, 2), 'utf8')
            } catch (err) {
              return writeJson(res, 500, { ok: false, error: 'config write failed: ' + String(err && err.message ? err.message : err) })
            }
            config = next
            return writeJson(res, 200, { ok: true, ...config })
```

</details>

#### 缺口

- 未做实际浏览器/反代安全复现。
  **影响：**跨源触发与外部可达性受网络/浏览器限制。
  **进一步探讨：**隔离假会话测认证、CORS、绑定及 URL 控制。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证明监控有效且避免误中断用户任务？

**研究主题：**新假设与验证、采用判断

#### 完整回答

不建议按默认配置接入真实任务。先在隔离 DSH profile 显式 intervention.enabled:false，核 monitor 不会调用 cancel/followup，再用无敏感数据的回放对照“词形分段 vs 实际任务成功/耗时”；确认有效性之后仍应让 L2/L3 人工批准、会话 ID 严格匹配、保护本地 API 与 monitorUrl。用于通用模型时需重新校准词典与阈值，不能套用 V4 Pro 作者报告。若只要仪表展示，应使默认只读且后端只监听/推送统计摘要；这些是改进设想。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-71](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/README.md#L58-L71)

作者限定模型。

<details>
<summary>查看原文（14行）</summary>

```text
> ⚠️ One caveat: if the session was never anchored in the first place, it stays
> in the react band and L2 keeps firing — that's a fight loop, not monitoring.
> Keep interventions **OFF (monitor-only)** unless you're on the model this whip
> was tuned for.

**When to turn interventions on / off** — the whip is tuned for
**DeepSeek V4 Pro 0813**:

- ✅ DeepSeek V4 Pro 0813 → interventions **ON** (recommended).
- ❌ Any other model → interventions **OFF** (monitor-only) — keep it as a pure live gauge.

This exact advice is shown right inside the plugin's panels:

> ℹ Tip: keep interventions on only for DeepSeek V4 Pro 0813; turn them off (monitor-only) for other models.
```

</details>

**依据 2 · 源码核查**：[config/default.yaml:80-101](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/config/default.yaml#L80-L101)

当前自动干预默认。

<details>
<summary>查看原文（22行）</summary>

```text
intervention:
  enabled: true             # 干预总开关: 关闭=只监控不打断(面板/设置可运行时一键切换, 无需重启)
  cooldowns:
    L1_ms: 30000
    L2_ms: 120000
    L3_ms: 0
  max_L2_attempts: 2
  rules:
    - { when: warning, trend: falling, action: L1 }
    - { when: critical, L2_attempts_lt: 2, action: L2 }
    - { when: critical, L2_attempts_gte: 2, action: L3 }
  hint_templates:
    # 措辞纪律 — dsh-anchored-flash 实验 E1/E1.5: 仅中性声明/建议式,
    # 禁止命令式(must/first/follow), 命令式会把 we 轨迹打回 let me
    - "reading the index is recommended — it is short"
    - "reviewing the context might be helpful"
    - "consider checking the relevant documentation"
  # L2 重置载荷 — 逐字节对齐官方 Minimal 预设:
  #   persona 46 字符 + bash/str_replace_editor 精确双工具
  # (tool-bootstrap.mjs DEFAULT_BOOTSTRAP_TOOLS; 首轮锚定 5/5, 其余 schema 11/11 翻车)
  bootstrap_tools: ["bash", "str_replace_editor"]
  bootstrap_system_prompt: "You are a helpful software engineer assistant."
```

</details>

**依据 3 · 源码核查**：[lib/index.js:399-427](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/lib/index.js#L399-L427)

实际取消/续跑。

<details>
<summary>查看原文（29行）</summary>

```text
  const executeSignal = (signal) => {
    const label = 'anchored-monitor: L' + signal.level + ' #' + (signal.sequence ?? '?') + ' @' + signal.sessionId
    try {
      let delivered = false
      let note = ''
      if (signal.level === 'L1') {
        delivered = submitContinuation(signal.sessionId, signal.payload && signal.payload.hintText ? signal.payload.hintText : '')
        note = 'L1 提示'
      } else if (signal.level === 'L2') {
        // L2 = 软重启: ①取消当前运行中的回合(保留 inbox); ②设置重置载荷(下一轮 assemble 消费);
        // ③followup 注入"重新输入"的上下文——以 Minimal persona + 双工具继续任务
        pendingResets.set(signal.sessionId, (signal.payload && signal.payload.reset) || { systemPrompt: '', tools: [] })
        const cancelled = cancelCurrentTurn(signal.sessionId, 'anchored-monitor L2 reset')
        delivered = submitContinuation(signal.sessionId, 'anchored-monitor: react-band trajectory detected (' + (signal.reason || '') + '). An L2 soft-restart is applied — the running turn was stopped and this request continues under the minimal 46-character persona with the bash and str_replace_editor bootstrap pair. Continue the task from where you left off, in a plan-first collective style (we will …). 锚定监控已执行 L2 强制重置: 当前回合已停止, 本轮以 Minimal 46 字符句 + 双工具软重启, 请以规划式风格(we will / we need)从刚才的位置继续任务。')
        note = 'L2 重置' + (cancelled ? '' : '(cancel 未命中)')
      } else if (signal.level === 'L3') {
        // L3 = 软重启 + 重启建议
        pendingResets.set(signal.sessionId, (signal.payload && signal.payload.reset) || { systemPrompt: '', tools: [] })
        const cancelled = cancelCurrentTurn(signal.sessionId, 'anchored-monitor L3 restart advice')
        delivered = submitContinuation(signal.sessionId, 'anchored-monitor: L2 retries exhausted (' + (signal.reason || '') + '). A full session restart is recommended for the cleanest state; the running turn was stopped and the reset condition is applied — continue the task in a plan-first style. 锚定监控提示: L2 重试已耗尽, 建议全新会话; 当前回合已停止并应用重置条件, 请以规划式风格继续任务。')
        note = 'L3 重启建议' + (cancelled ? '' : '(cancel 未命中)')
      }
      const status = delivered ? 'executed' : 'failed: agents.followup 不可用 (' + note + ' 已排队待注入)'
      logInfo(label + ' → ' + (delivered ? 'executed' : status))
      ackSignal(signal, status)
    } catch (err) {
      ackSignal(signal, 'failed: ' + String(err && err.message ? err.message : err))
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/monitor/server.ts:54-58](https://github.com/Aik358/dsh-anchored-monitor/blob/086bd05e1e3035ddf23133f3a0ee479291a4b237/src/monitor/server.ts#L54-L58)

开放 CORS。

```text
function setCors(res: ServerResponse): void {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
}
```

[返回分类](../../views/categories/RESEARCH-KNOWLEDGE.md) · [返回首页](../../../README.md)
