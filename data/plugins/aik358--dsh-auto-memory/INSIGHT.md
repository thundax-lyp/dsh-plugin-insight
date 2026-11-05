# dsh-auto-memory

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[a244cf0](https://github.com/Aik358/dsh-auto-memory/tree/a244cf03f6f409b655d86e02d6c0a7b86d7496f4)

<!-- BEGIN META -->
[![GitHub ★ 186](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=186&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Aik358/dsh-auto-memory) [![npm 30d 13,497](https://img.shields.io/static/v1?label=npm+30d&message=13%2C497&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-auto-memory) [![最新发布 2026-10-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@a9i5k4/dsh-auto-memory)
<!-- END META -->

> **功能**：为 DSH 提供主动记忆召回、整理与跨上下文交接。

> **亮点**：[Q01](#research-q01) 以会话和上下文身份保护投影复用，并在请求前带入资料。

> **主要限制**：[Q02](#research-q02) 敏感规则依赖标题和来源定位，无法覆盖无标记机密与其他注入路径。

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
  - [Q01 · 何时装配联想内容？](#detail-section-11)
  - [Q02 · 敏感过滤能排除什么？](#detail-section-12)
  - [Q03 · 如何试用并控制退出成本？](#detail-section-13)
  - [Q04 · 如何降低敏感误注入？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在 DSH 中持续做长任务并需复用历史背景的用户。

手工更新交接文件，或在需要时主动搜索笔记。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 自动召回 | 在提示准备时带入可复用资料 | 受投影身份、来源和预算约束 |
| 敏感过滤 | 阻挡可识别的敏感段 | 依赖标题及命中位置 |
| 语义检索 | 按内容匹配资料 | 有模型与依赖成本 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH | 挂载必需 | 读取上下文并注入 | 用手动交接 |
| 可读本地资料 | 召回必需 | 提供提示来源 | 保留空或常驻提示 |
| 语义引擎 | 语义召回可选 | 提供向量检索 | 先试词法 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户建立测试 profile 和合成笔记 | 无真实敏感信息 |
| 核查 | 操作者运行固定会话并观测提示 | 出现跨工作区内容即停 |
| 退出 | 用户禁用插件并单独核查资料 | 确认残留范围 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 引擎下载与磁盘资源 | 配置作用域 | 未测 |
| 持续 | 索引与提示 token | 复核注入和保留 | 真实消耗未知 |
| 失败恢复 | 重新整理费用未知 | 检查资料及配置残留 | 不能由禁用推断清除 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 提示召回 | 复用与预算分层 | 任务质量和效率 |
| 敏感排除 | 标题与行号规则 | 无标记敏感项 |
| 部署选择 | 可选引擎 | 本机性能 |

> **思考**：[Q02](#research-q02) 敏感规则依赖标题和来源定位，无法覆盖无标记机密与其他注入路径。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 以会话和上下文身份保护投影复用，并在请求前带入资料。

[Q01](#research-q01) 将投影复用、准入和提示预算分开。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 敏感规则依赖标题和来源定位，无法覆盖无标记机密与其他注入路径。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 从词法引擎和合成语料开始，依照 [Q02](#research-q02) 检查敏感标题及无标题材料。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表注入、过滤和分发路径。未验证宿主、召回指标或真实数据安全。

- 已检查：作者 README、包清单、源码路径 README.md、lib/index.js、lib/injection-policy.js、package.json 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件的代表宿主及策略源码，未执行插件、下载或模型。
- 下一步：在隔离 profile 验证提示内容、工作区隔离、开销与清理。

**分析版本**

- **仓库**：[Aik358/dsh-auto-memory](https://github.com/Aik358/dsh-auto-memory)
- **版本号**：3.3.17（[固定提交 a244cf0](https://github.com/Aik358/dsh-auto-memory/tree/a244cf03f6f409b655d86e02d6c0a7b86d7496f4)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 用不含正文的注入预览帮助发现普通章节中的敏感风险。

在隔离 profile 验证提示内容、工作区隔离、开销与清理。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 135 | 78660 | 55301 | 21256 | — |
| .md | source | 644 | 119440 | — | — | 1854648 |
| .mjs | source | 21 | 6042 | 4674 | 1215 | — |
| .mjs | test | 452 | 77148 | 60309 | 12556 | — |
| .md | test | 6 | 37 | — | — | 121 |

</details>

**活跃度**

[![Issue 未关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/Aik358/dsh-auto-memory/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 261](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=261&color=737b86&logo=github)](https://github.com/Aik358/dsh-auto-memory/issues?q=is%3Aissue+created%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z) [![近30天关闭 267](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=267&color=737b86&logo=github)](https://github.com/Aik358/dsh-auto-memory/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T02%3A01%3A36.775Z..2026-11-05T02%3A01%3A36.775Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自动联想相比显式检索减少哪些操作，又怎样划定提示注入和数据保留边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 何时装配联想内容？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

需要跨轮处理长任务的 DSH 用户通常自行维护交接或主动搜索旧笔记。此插件会在宿主 pre-step 观察会话身份及消息，在构造提示时根据 sessionId、工作区、上下文版本和内存版本判断是否复用投影，再用字符、token 预算与来源排除配置装配。已有投影无法复用时可只保留常驻目录，并记录降级。价值在把复查资料提前到准备请求，材料未证明用户能以更少 token 完成任务，也未覆盖全部宿主组装顺序。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:153-167](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/README.md#L153-L167)

作者区分主动召回与手动提示

<details>
<summary>查看原文（15行）</summary>

```text
### The first · She takes notes, and she says welcome back

The earliest version of this plugin learned two small things: after every conversation, it wrote down what was worth keeping, unprompted; and when you returned from time away, or in the morning, afternoon, and late-night hours, it greeted you in a fitting tone. Simple — but these two acts set her character: memory is not a database, a greeting is not a notification chime; it is what a colleague who remembers you says when you walk back in. Everything else grew on that character. We call this plugin "she" throughout — not marketing polish, but because from the very first feature, she was doing the things a person does.

### The second · Not "look it up when I remember", but remembering while doing

Humans use memory two ways: deliberately retracing what was done before — and, far more often, having the right memory surface on its own in the middle of doing. The last major release gave her the second kind. We put a Transformers model next to the memory stores so that, mid-conversation, she judges two things: whether anything is worth recalling right now, and which memory it should be — judging from the very material of the dialogue: what you're thinking, what you said, what she answered. The relevant memory thus walks into place, through a fixed boundary into the next turn, before the model even opens its mouth. It never depends on the model "remembering to look" — forget once, and the memory might as well not exist. **She remembers to think for you.**

### The third · Like riding a bicycle — no need to think about how

Once a person learns to ride, they never replay the tutorial — muscle memory takes over, and the skill transfers to the next road on its own. She grows that kind of memory too: after watching your corrections a few times, or doing the same kind of thing again and again, a workflow crystallizes into a skill; next time something similar shows up, the checklist attaches itself — no one reminding. What was learned deliberately becomes something done casually — her procedural memory, the part you can review, pin, and watch grow in the Memory Hub tab.

### The fourth · Handoff, not compression

When the context fills, she no longer burns the whole book for a one-line summary; she writes a four-part handoff note — state, goals, dead ends and why, progress and next step — closes this window, and opens the next. The full history stays archived and searchable; details can always be looked back up. The newest of the four, and the last piece of a complete memory — see [How she hands off](#how-she-hands-off).
```

</details>

**依据 2 · 源码核查**：[lib/index.js:17438-17470](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/index.js#L17438-L17470)

宿主 pre-step 的身份与请求判据

<details>
<summary>查看原文（33行）</summary>

```text
  // pre-step 是 waterfall(可 await),在放行每个 step 前条件性刷新:
  // 首轮(loadedAt=0)必定 await 完 → 模型从第一个 token 起就看到记忆;之后每 15s 跟进轮间新写入。
  ctx.on('agent/pre-step', async (payload, next) => {
    try {
      const agent = payload && payload.agent   // M1: 精确取当前 agent 的 runtime,不猜
      // ★2026-10-18（注入交付根治 · 请求键）：**在本 step 的 pre-step 记录请求身份**。
      //   ⚠️ 本段必须在**子代理早退之前**执行：下方套娃防护会 `return next()`，
      //     若把请求键写入放在其后，子代理永远拿不到键 ⇒ 幂等闸对子代理失效
      //     （子代理恰恰是「多步长任务」的主要场景，必须覆盖）。
      //   ⚠️ stateFor 对未登记 runtime 的 agent 亦返回状态对象；写入纯内存、无副作用。
      //   宿主契约（实测 dsh-agent-loop/lib/index.js:902-1073）：每个 step 会调用
      //   systemPrompt.context() 的 text() **恰好两次** —— ①preStep 的 assemble(:907) 结果被
      //   准入逻辑**结构性丢弃**(:1067-1073 只 append refreshContext 那一份)；②step() 的
      //   refreshContext(:1053) 才是模型真正收到的。两次之间宿主会 append step/start(:970)。
      //   ⇒ 若用 step/start 事件派生「当前请求」，两次调用必然拿到不同编号(实测差 1)，任何
      //   「同请求保真」判据都会在**投影帧**失效 ⇒ 完整版被后一帧的精简版覆盖。
      //   改以 pre-step 的 (turn, step) 作请求身份：它在两次调用之前写入、两次之间不变。
      try {
        // ★2026-10-19 修复（P0 · 匿名 runtime 泄漏）：**stateFor 必须受严格身份守卫**。
        //   缺陷成因（v3.3.6 `e564a9c` 引入，本轮二分实测确认）：本段是在「无 session 身份不登记 runtime」
        //   的套娃防护**之前**新增的，而 stateFor → runtimeFor(agent) 对匿名 agent 会经
        //   `runtimeFor(agent || currentRuntime().agent)` 的兜底落到 default runtime 并**登记新条目**，
        //   于是每来一个无身份 agent 就多一个 runtime。原注释「写入纯内存、无副作用」是**错的**。
        //   实测症状：smoke-test-context-observer 的 P5e 断言
        //   `anonymous lifecycle created runtimes (delayed)` 失败（a6061ad 通过 / e564a9c 起失败）。
        //   修法：与本文件既有纪律同源 —— 身份不可靠时**不碰 state/runtime**，直接跳过本段。
        const stP = (agent && engine.hasReliableSessionIdentity(agent)) ? engine.stateFor(agent) : null
        const rawT = payload ? payload.turn : undefined
        const rawS = payload ? payload.step : undefined
        // ⚠ Number(null)===0：不能用 Number() 直接判有效，否则 turn/step 缺失会退化成 `0#0`，
        //   且第一轮与第二轮可能撞键 ⇒ 幂等闸把上一轮的文本当成本轮定稿。
        const okNum = (v) => v !== undefined && v !== null && v !== '' && Number.isFinite(Number(v))
        if (stP && okNum(rawT) && okNum(rawS)) {
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8058-8096](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/index.js#L8058-L8096)

复用、来源准入、预算与降级

<details>
<summary>查看原文（39行）</summary>

```text
      // 可能对已 dispose 的 agent 执行，用 `runtimeFor` 会**复活已销毁的 runtime** ——
      // 实测病症：smoke-test-context-observer 的 P3f 报 `runtime B survived dispose`。
      const rtForCv = this.peekRuntime(agent)
      const reuse = selectReusableTierHitsPre({
        projection: gh,
        now: Date.now(),
        sessionId: agentSessionId,
        workspaceKey: canonicalize(s.ws),
        contextVersion: rtForCv ? rtForCv.contextVersion : undefined,
        miv: this.tierCurrentMivPre(),
      })
      // ★#257 SEC-01：**准入** —— 旧实现把 `reuse.hits` 直接交给装配器，Tier-0 常驻目录
      //   （上面 `sources` 的原文）更是**一路不经 stripSensitiveSections** ⇒ 「## 敏感/凭据/密钥」
      //   段落的原文被当成无敏感内容拼进最终 prompt（同方法下方的常规正文路径却明确过滤）。
      //   现在两处一起收口：① 来源正文先剥离敏感段（`preserveLines` 保行号，命中定位不失真）；
      //   ② 命中逐条过准入（无行号的投影在来源含敏感段时 fail closed，宁缺不漏）。
      const admitted = filterSensitiveHits(reuse.reuse ? reuse.hits : [], sources)
      const hits = admitted.kept
      const question = reuse.reuse ? String(reuse.question || '') : ''
      // 不复用必须有据可查（I7：降级不静默）——但**只在"本来有投影却不给用"时**才记，
      // 免得"从未发生投递"这种常态每轮刷一条噪声。原因码与可读文本都进 tier0Meta，供面板/排障。
      const reuseBlocked = !!gh && !reuse.reuse && reuse.reason !== 'no-projection' ? reuse.reason : null
      const dg = (this._indexDegradeBySession && agentSessionId
        ? (this._indexDegradeBySession.get(agentSessionId) || null)
        : null) || this._lastIndexDegrade || null
      // 多工作区适配(2026-09-17):优先按**当前会话**取降级记录。旧实现只读全局单槽 + 10 分钟窗
      // ⇒ B 会话的"未就绪"会把 A 会话污染十分钟(跨会话假降级)。现在各会话只看到自己的记录。
      const indexNotReady = dg && Date.now() - (Number(dg.at) || 0) < 10 * 60000 ? dg.reason : null
      const semanticArm = (typeof this._jsSemanticRank === 'function') ? true : 'unavailable'
      const res = composeTieredInjectionPre({
        sources: sources.map(source => ({ ...source, text: stripSensitiveSections(source.text, { preserveLines: true }) })),
        maxTokens, maxTotalChars, hits, question, indexNotReady, semanticArm,
        // 群反馈第 4 条：用户排除的来源在注入闸门之前挡下（见 injectExcludeSources 注释）。
        excludeSources: Array.isArray(cfg.injectExcludeSources) ? cfg.injectExcludeSources : [],
        extraDegradations: [
          ...(reuseBlocked ? ['命中投影未复用（' + describeReuseReasonPre(reuseBlocked) + '）· 本轮不下探 Tier-1，仅常驻目录'] : []),
          ...(admitted.dropped.length ? ['敏感来源准入已挡下 ' + admitted.dropped.length + ' 条命中（仅计数，不含正文）'] : []),
        ],
      })
```

</details>

#### 缺口

- 未观察实际发送给模型的上下文和真实任务
  **影响**：无法确认召回精度、跨工作区隔离及任务收益
  **进一步探讨**：用独立工作区和虚拟笔记记录提示、重复引用和任务结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 敏感过滤能排除什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

过滤依据 Markdown 二级标题是否包含敏感词。识别后会隐藏该段内容，对来源含敏感段的命中要求有效行范围，命中允许时重新从原文安全行构造摘要字段。实际分层调用同时过滤来源正文与命中。但算法不是对任意文本的凭据检测，也不擦除源文件；普通标题下的敏感内容可能仍进入提示。调用路径的过滤无法保证不同检索、外部导入或其他交付路径同样隔离。

#### 证据与依据

**依据 1 · 源码核查**：[lib/injection-policy.js:1-25](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/injection-policy.js#L1-L25)

二级标题策略与正文过滤

<details>
<summary>查看原文（25行）</summary>

```text
// Automatic injection policy only. Source files, anchors, digests and explicit
// user-authorized full-file reads remain intact.
export function sensitiveSections(text) {
  const lines = String(text || '').split('\n')
  const blocked = []
  const ranges = []
  let skip = false, byte = 0
  for (const line of lines) {
    // A supported UTF-8 BOM belongs to the source bytes, not the first heading.
    // Ignore it only for recognition; keep lines and byte coordinates intact.
    const heading = blocked.length === 0 ? line.replace(/^\uFEFF/, '') : line
    if (/^## /.test(heading)) skip = /敏感|凭据|令牌|口令|token|密钥|secret|password|credential|pat\b|api\s*key/i.test(heading)
    blocked.push(skip)
    const end = byte + Buffer.byteLength(line + '\n', 'utf8')
    if (skip) ranges.push({ start: byte, end })
    byte = end
  }
  return { lines, blocked, ranges }
}

export function stripSensitiveSections(text, { preserveLines = false } = {}) {
  const { lines, blocked } = sensitiveSections(text)
  const safe = lines.map((line, i) => blocked[i] ? '' : line).join('\n')
  return preserveLines ? safe : safe.replace(/\n{3,}/g, '\n\n').trim()
}
```

</details>

**依据 2 · 源码核查**：[lib/injection-policy.js:31-62](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/injection-policy.js#L31-L62)

来源定位、行范围和摘要重建

<details>
<summary>查看原文（32行）</summary>

```text
// A summarized hit no longer carries its parent section. Require its original
// line range when its source has excluded sections; old unlocated projections
// fail closed for that source, while entirely ordinary sources stay compatible.
export function filterSensitiveHits(hits, sources) {
  const entries = sources.map(s => ({ ...s, policy: sensitiveSections(s.text) }))
  const kept = [], dropped = []
  for (const h of Array.isArray(hits) ? hits : []) {
    if (!h) continue
    const ref = String(h.sourceRef || h.path || '')
    const source = entries.find(s => ref && (ref === s.path || ref === s.sourceRef))
      || entries.find(s => s.layer === h.layer)
    let allowed = true, admitted = h
    if (source && source.policy.ranges.length) {
      const start = Number(h.lineStart), end = Number(h.lineEnd)
      allowed = Number.isInteger(start) && Number.isInteger(end) && start > 0 && end >= start
        && end <= source.policy.lines.length
        && !source.policy.blocked.slice(start - 1, end).some(Boolean)
      if (allowed) {
        // Do not trust an old derived summary merely because its locator is safe.
        // Rebuild drilldown from admitted original lines before rendering.
        const text = source.policy.lines.slice(start - 1, end).join('\n')
        admitted = { ...h, excerpt: text, excerptFull: text, text, oneLine: '', summary: '', title: '' }
      }
    }
    // Covers complete self-contained blocks from other sources, too.
    if (allowed) allowed = !['excerptFull', 'excerpt', 'text', 'heading', 'title', 'summary', 'oneLine']
      .some(key => admitted[key] && sensitiveSections(admitted[key]).ranges.length)
    if (allowed) kept.push(admitted)
    else dropped.push(h)
  }
  return { kept, dropped }
}
```

</details>

**依据 3 · 源码核查**：[lib/index.js:8069-8095](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/index.js#L8069-L8095)

策略确实用于分层注入

<details>
<summary>查看原文（27行）</summary>

```text
      // ★#257 SEC-01：**准入** —— 旧实现把 `reuse.hits` 直接交给装配器，Tier-0 常驻目录
      //   （上面 `sources` 的原文）更是**一路不经 stripSensitiveSections** ⇒ 「## 敏感/凭据/密钥」
      //   段落的原文被当成无敏感内容拼进最终 prompt（同方法下方的常规正文路径却明确过滤）。
      //   现在两处一起收口：① 来源正文先剥离敏感段（`preserveLines` 保行号，命中定位不失真）；
      //   ② 命中逐条过准入（无行号的投影在来源含敏感段时 fail closed，宁缺不漏）。
      const admitted = filterSensitiveHits(reuse.reuse ? reuse.hits : [], sources)
      const hits = admitted.kept
      const question = reuse.reuse ? String(reuse.question || '') : ''
      // 不复用必须有据可查（I7：降级不静默）——但**只在"本来有投影却不给用"时**才记，
      // 免得"从未发生投递"这种常态每轮刷一条噪声。原因码与可读文本都进 tier0Meta，供面板/排障。
      const reuseBlocked = !!gh && !reuse.reuse && reuse.reason !== 'no-projection' ? reuse.reason : null
      const dg = (this._indexDegradeBySession && agentSessionId
        ? (this._indexDegradeBySession.get(agentSessionId) || null)
        : null) || this._lastIndexDegrade || null
      // 多工作区适配(2026-09-17):优先按**当前会话**取降级记录。旧实现只读全局单槽 + 10 分钟窗
      // ⇒ B 会话的"未就绪"会把 A 会话污染十分钟(跨会话假降级)。现在各会话只看到自己的记录。
      const indexNotReady = dg && Date.now() - (Number(dg.at) || 0) < 10 * 60000 ? dg.reason : null
      const semanticArm = (typeof this._jsSemanticRank === 'function') ? true : 'unavailable'
      const res = composeTieredInjectionPre({
        sources: sources.map(source => ({ ...source, text: stripSensitiveSections(source.text, { preserveLines: true }) })),
        maxTokens, maxTotalChars, hits, question, indexNotReady, semanticArm,
        // 群反馈第 4 条：用户排除的来源在注入闸门之前挡下（见 injectExcludeSources 注释）。
        excludeSources: Array.isArray(cfg.injectExcludeSources) ? cfg.injectExcludeSources : [],
        extraDegradations: [
          ...(reuseBlocked ? ['命中投影未复用（' + describeReuseReasonPre(reuseBlocked) + '）· 本轮不下探 Tier-1，仅常驻目录'] : []),
          ...(admitted.dropped.length ? ['敏感来源准入已挡下 ' + admitted.dropped.length + ' 条命中（仅计数，不含正文）'] : []),
        ],
```

</details>

#### 缺口

- 未审查所有内存来源和注入分支
  **影响**：无法保证涉及真实凭据或客户数据时安全
  **进一步探讨**：用不同标题、来源、未定位旧投影和并行工作区进行虚拟凭据测试

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何试用并控制退出成本？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包提供宿主、客户端和组合补丁，并声明 transformers 为可选依赖。作者区分词法、JS 和 Python 语义引擎，语义模式涉及模型下载和额外运行时，文档尺寸属于作者报告。首次适合独立 profile 与纯合成资料，从词法路径核对注入和退出。持续使用需承担整理及注入的模型资源、索引和本地数据维护。移除高级语义引擎保留记忆和配置，禁用插件也应单独检查落盘数据，不能视为清除。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:4-20](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/package.json#L4-L20)

宿主、客户端与分发文件

<details>
<summary>查看原文（17行）</summary>

```text
  "version": "3.3.17",
  "type": "module",
  "main": "lib/index.js",
  "icon": "./icon.svg",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
  "files": [
    "lib",
    "python",
    "skins",
    "icon.svg",
    "locale",
    "cordis.patch.yml",
```

</details>

**依据 2 · 源码核查**：[package.json:28-41](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/package.json#L28-L41)

组合与宿主客户端注入

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-sidebar"
      ],
      "platform": "web"
```

</details>

**依据 3 · 源码核查**：[package.json:55-61](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/package.json#L55-L61)

可选推理依赖

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1"
  },
  "optionalDependencies": {
    "@huggingface/transformers": "^3.7.6"
  },
  "license": "BSD-3-Clause"
```

**依据 4 · 作者声明**：[README.md:434-451](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/README.md#L434-L451)

安装与重启条件

<details>
<summary>查看原文（18行）</summary>

````text
## Install (one command)

> Prerequisite: install [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) and start `dsh web` at least once.

Run in the **profile directory** (`~/.dsh/profiles/web`):

```bash
cd ~/.dsh/profiles/web
pnpm add @a9i5k4/dsh-auto-memory@latest
```

Then edit `package.json` in that directory and append to the `dsh.profile.bundles` array:

```json
"@a9i5k4/dsh-auto-memory"
```

Restart **dsh web** (the 「Memory」entry appears in the sidebar).
````

</details>

**依据 5 · 作者声明**：[README.md:456-480](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/README.md#L456-L480)

语义引擎成本与卸载后保留数据

<details>
<summary>查看原文（25行）</summary>

````text
### Semantic engine (optional but recommended)

The built-in JS semantic tier (e5-small q8, ~130MB) needs the `@huggingface/transformers` inference library, installed automatically as an optional dependency of the main package. If your pnpm security policy blocked its native scripts (you see `ERR_PNPM_IGNORED_BUILDS` / `Ignored build scripts: onnxruntime-node, sharp`), approve and reinstall once:

```bash
# approve the onnxruntime-node / sharp native install scripts, then reinstall transformers
pnpm approve-builds
pnpm add @huggingface/transformers
```

Restart `dsh web` — the welcome tour's semantic-engine step auto-detects readiness (SHA256 verify + inference self-test).

Three retrieval tiers, switchable in Settings → Semantic engine:/n/n- **Lexical (C1, 0GB)** — the always-on floor, BM25 over full text.
- **Built-in semantic (C2, ~130MB)** — the default, auto-downloaded on first launch. Recall is layered (L0 summaries + rank-space fusion), so long memories no longer get truncated by the model's token limit.
- **Advanced Python (C3, ~563MB)** — BGE-M3, for power users; install it in the same settings step and it also serves `memory_recall`, not just proactive association.

Retrieval is time-aware too: ask for "last week" or "three days ago" and the matching memories rise to the top. Lexical retrieval (0GB) always works as a fallback; skipping the engine only lowers recall precision.

**Removing the advanced engine**: Settings → Semantic engine has an "Uninstall and reclaim disk" button that deletes the whole `~/.dsh/python-engine/` directory (venv ~280-400MB + model ~539MB, about 850MB total). The same thing by hand:

```bash
rm -rf ~/.dsh/python-engine    # Windows: rmdir /s /q %USERPROFILE%\.dsh\python-engine
```

Only that directory is touched — memories and `embedding-config.json` stay where they are.
````

</details>

#### 缺口

- 未执行安装、下载、清理或模型请求
  **影响**：不能估计真实资源、提示负担和退出成本
  **进一步探讨**：在临时 profile 核对模型输入、落盘位置、禁用和数据清理

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何降低敏感误注入？

**研究主题**：新假设与验证

#### 完整回答

在保留现有标题和行范围过滤的基础上，可给用户一个只展示来源、行号和准入原因的预览，在合成语料中检测到普通章节里的虚拟密钥就提示用户为来源加排除规则。避免把原文复制到审查面板。对照当前过滤与预览，用隐含敏感、已命名敏感及普通笔记比较错误注入、正常召回损失和操作时间。若隐含项错误注入没有下降或正常召回损失明显，撤回。

#### 证据与依据

**依据 1 · 源码核查**：[lib/injection-policy.js:8-17](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/injection-policy.js#L8-L17)

当前识别依赖标题

<details>
<summary>查看原文（10行）</summary>

```text
  for (const line of lines) {
    // A supported UTF-8 BOM belongs to the source bytes, not the first heading.
    // Ignore it only for recognition; keep lines and byte coordinates intact.
    const heading = blocked.length === 0 ? line.replace(/^\uFEFF/, '') : line
    if (/^## /.test(heading)) skip = /敏感|凭据|令牌|口令|token|密钥|secret|password|credential|pat\b|api\s*key/i.test(heading)
    blocked.push(skip)
    const end = byte + Buffer.byteLength(line + '\n', 'utf8')
    if (skip) ranges.push({ start: byte, end })
    byte = end
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:8087-8095](https://github.com/Aik358/dsh-auto-memory/blob/a244cf03f6f409b655d86e02d6c0a7b86d7496f4/lib/index.js#L8087-L8095)

已有来源排除和命中计数

```text
      const res = composeTieredInjectionPre({
        sources: sources.map(source => ({ ...source, text: stripSensitiveSections(source.text, { preserveLines: true }) })),
        maxTokens, maxTotalChars, hits, question, indexNotReady, semanticArm,
        // 群反馈第 4 条：用户排除的来源在注入闸门之前挡下（见 injectExcludeSources 注释）。
        excludeSources: Array.isArray(cfg.injectExcludeSources) ? cfg.injectExcludeSources : [],
        extraDegradations: [
          ...(reuseBlocked ? ['命中投影未复用（' + describeReuseReasonPre(reuseBlocked) + '）· 本轮不下探 Tier-1，仅常驻目录'] : []),
          ...(admitted.dropped.length ? ['敏感来源准入已挡下 ' + admitted.dropped.length + ' 条命中（仅计数，不含正文）'] : []),
        ],
```

#### 缺口

- 未核对所有面板或测试预览
  **影响**：无法确认预览有增量
  **进一步探讨**：先走查现有审查面板，再做固定语料实验

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
