# dsh-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ae2c9d4](https://github.com/zhu1090093659/dsh-pet/tree/ae2c9d443eda35a6439597c1787c7607e988bbed)

<!-- BEGIN META -->
[![GitHub ★ 69](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=69&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-pet) [![npm 30d 140,192](https://img.shields.io/static/v1?label=npm+30d&message=140%2C192&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet)
<!-- END META -->

> **功能**：在 DSH Web 显示跟随会话活动的悬浮宠物，支持互动、亲密度和自定义素材。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是把宿主事件变为可常驻的交互提示，并通过可见性及请求顺序约束页面更新。

> **主要限制**：[Q02](#research-q02) 的轮询可能错过短事件。[Q03](#research-q03) 的客户端启动心跳位于启用判断之前，关闭宠物后仍需独立核查网络行为。

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
  - [Q01 · 多会话等待时，悬浮反馈相比会话状态有什么增量？](#detail-section-11)
  - [Q02 · 宠物从会话事件到 Web 渲染如何同步和停止？](#detail-section-12)
  - [Q03 · 关闭宠物时哪些本地与外部行为仍需注意？](#detail-section-13)
  - [Q04 · 如何验证提示能否减少来回查看且不会误导？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH Web 同时等待多轮任务且喜欢常驻反馈的人，用浮层查看哪条会话还在活动。

以原生会话状态和手工切页为参照。需要准确定位短暂失败时，仍回到会话和工具输出。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 悬浮宠物 | 在 Web 中显示会话活动并互动 | 启用且依赖齐备，短事件受轮询限制 |
| 状态与媒体路由 | 为浏览器供应快照和素材 | 插件启用才挂载 |
| 心跳 | 发送安装遥测 | 客户端加载时尝试，受存储、自动化和出网限制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 声明 DSH >=0.2.2-rc.1、Web 与 React 18 | 必需 | 加载宿主和浏览器入口 | 看 profile、Web 依赖注入和版本 |
| webServer 和会话事件 | 必需 | 暴露状态及映射活动 | 原生会话仍是核查入口 |
| 允许相应浏览器网络行为 | 按环境 | 管理心跳和隔离 | 先确认出网约束 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户查看目标 profile 及出网规则 | 仅在可控环境开始 |
| 核对 | 用户用空会话触发两种活动 | 浮层变化能与对应会话对上 |
| 停用 | 用户关闭浮层，再按需移除插件 | 分别核对同源请求与外发心跳 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 素材和浏览器资源未测 | 核对 profile、宿主与外联 | 目标版本未跑 |
| 持续 | 轮询、动画和网络开销未知 | 核对提示、处理遮挡 | 隐藏页面停定时轮询 |
| 恢复及退出 | 网络与重新加载开销未知 | 回到会话，移除插件并读回状态 | 关闭宠物不控制初次加载心跳 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 多会话提示 | 映射状态并按最新响应更新 | 短事件识别与切页节省 |
| 暂停 | 不可见时停止轮询，停用时清理 | 浏览器资源节省量 |
| 心跳 | 独立于启用状态发起 | 实际对端处理 |

> **思考**：[Q02](#research-q02) 的轮询可能错过短事件。[Q03](#research-q03) 的客户端启动心跳位于启用判断之前，关闭宠物后仍需独立核查网络行为。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 的增量是把宿主事件变为可常驻的交互提示，并通过可见性及请求顺序约束页面更新。

[Q02](#research-q02) 用可见性与请求顺序约束刷新，接管后清理旧 React 根和定时器。轮询顺序控制不能让历史短事件重新可见。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的轮询可能错过短事件。[Q03](#research-q03) 的客户端启动心跳位于启用判断之前，关闭宠物后仍需独立核查网络行为。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 建议在接受相应网络行为的临时 profile 对照两个空会话。先看活动能否归到正确会话，再分别核对关闭与移除后的页面请求。敏感环境先保留原生视图。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已查宿主事件、路由与浏览器生命周期，真实反馈及时性和心跳接收待核。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/routes.ts、package.json、src/index.ts、src/client/index.ts、src/client/telemetry.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定版本的宿主挂载、会话投影、状态路由、浏览器轮询和心跳发起。全部素材、真实出网与宿主交互未运行。
- 下一步：按 [Q04](#research-q04) 对照并行任务的正确识别和打扰，另区分关闭浮层与卸载客户端后的网络。

**分析版本**

- **仓库**：[zhu1090093659/dsh-pet](https://github.com/zhu1090093659/dsh-pet)
- **版本号**：0.4.16（[固定提交 ae2c9d4](https://github.com/zhu1090093659/dsh-pet/tree/ae2c9d443eda35a6439597c1787c7607e988bbed)）
- **版本日期**：2026-11-07（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提议在相同双会话任务里比较浮层和原会话状态。若正确识别无改善或遮挡、误判上升，则不支持这一使用方式。假设待验证。

按 [Q04](#research-q04) 对照并行任务的正确识别和打扰，另区分关闭浮层与卸载客户端后的网络。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 57 | 4318 | — | — | 64467 |
| .mjs | source | 1 | 150 | 109 | 34 | — |
| .mjs | test | 2 | 310 | 267 | 14 | — |
| .cjs | source | 1 | 169 | 138 | 21 | — |
| .ts | source | 56 | 13501 | 9141 | 3598 | — |
| .ts | test | 43 | 10263 | 8525 | 936 | — |
| .tsx | test | 10 | 3844 | 3136 | 431 | — |
| .tsx | source | 11 | 3951 | 2884 | 919 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：悬浮宠物能给同时等待多个 DSH 任务的人提供哪些可用反馈，哪些状态和副作用需要独立核对？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 多会话等待时，悬浮反馈相比会话状态有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

在 DSH Web 里同时等两个或更多任务的人，可以让常驻宠物显示模型和工具进展，减少为确认哪个会话仍忙而往返切页的操作。作者描述全局形象跟随最近的有效事件并给活动会话各自提示。服务端按 session 记录事件，浏览器传回当前会话以调整展示先后。相比直接读会话状态，变化是把注意力线索放到浮层，并加入摸头、投喂和亲密度交互。任务是否通过仍须打开对应会话检查工具结果。对习惯同时监看原生会话列表的人，额外浮层也可能遮挡内容或增加打扰。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-41](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/README.md#L20-L41)

作者界定交互和多会话提示。

<details>
<summary>查看原文（22行）</summary>

```text
While the AI model thinks, you wait — your desktop companion swims and interacts on screen. It dynamically tracks the official DeepSeek Harness session lifecycle, switching fluid animations during waiting, thinking, tool execution (Bash, code editing, web searches), reply generation, celebration on success, and alert on error; you can pat its head, feed it dried fish, and watch affinity grow. Pets are driven by an extensible asset registry rather than hard-coded logic: each pet consists of a `pet.json` manifest and an atlas image (or Live2D model pack), auto-discovered by the host at startup.

Re-engineered from desktop companion concepts into an official DSH cordis bundle (host backend + client frontend in a single integrated package).

## Features

| Feature | Description |
|---|---|
| Multi-pet registry | The host scans built-in `assets/`, the hatch-pet custom pets directory, and composed config entries; each pet is a manifest plus an atlas |
| Pet selection in settings | Visual preview cards list every registered pet (built-in assets plus user directories — the installed set); switching persists and the sprite swaps immediately. The page sits under Settings → Web Extensions → Pet, or in the standalone first-level Pet section without that parent |
| Per-pet naming | Rename from the hover panel; each pet keeps its own name (stored per pet id, migrated from the legacy flat name) |
| State animation | Official session activity → manifest-defined sequences of 9-state tracks; each track finishes its full duration before the sequence advances and the complete sequence loops |
| Head-pat interaction | Click the pet → bubble feedback + affinity +1 (10s cooldown) |
| Feeding | Hover panel 喂食 (Feed) → consumes 1 dried fish + affinity +5 (30s cooldown) |
| Treat economy | Dried-fish stock (cap 20): +1 every 30 rounds of work, +1 every 300 minutes (5 hours) — 10x rarer than the original cadence |
| Affinity | +1 per round completed; 9 levels: 幼鲸 → 伙伴 → 挚友 → 深海羁绊 → 心有灵犀 → 传说羁绊 → 神话羁绊 → 永恒之契 → 鲸生共渡 (capped at 999,999,999) |
| Dragging | Hold and drag the pet to reposition; position persisted |
| Hide/Summon | The hover panel sits below the pet (lifted above the status bubbles when there is no room below) and provides 隐藏 (Hide); after hiding, a 召唤{name} (Summon {name}) button appears |
| Witty remarks | Built-in remark library (10 lines per event) plus per-pet custom lines; success lines rotate by persisted success counts and cooldown lines by persisted rejection counts |
| Status bubbles | Only one top-level session speaks by default — the session the GUI is currently on when it is reported, otherwise the most recently active one — and the rest collapse behind a +N badge on the main bubble instead of stacking a tall column; hover the bubble (or tap the badge, for touch) to fan every session's bubble out above it and click one to jump to its session; subagent sessions report through their spawning conversation and never occupy a bubble of their own; transient interaction feedback temporarily takes priority. Bubble copy comes from generous rotating pools per scene (waiting / thinking / writing / done / failed...), tool calls map onto per-family witty lines carrying the real argument hint (e.g. 跑跑 npm test), and a long-lived scene re-phrases itself every few seconds. The pet's own status bubbles can be silenced in Settings > Pet > Status bubbles, which leaves the row to a plugin driving its own bubble surface; announcements pushed through `pet.announce` keep rendering either way |
| Inner whispers | 碎碎念: while a session streams, the pet occasionally speaks its inner voice through that session's own bubble — a fresh whisper takes over the bubble and marks it with 「」 quotes — sharing the same DeepSeek-blue glass as every status bubble, so stacked bubbles never clash — instead of stacking a second bubble — category lines woken by the SITUATION (thinking / writing / the running tool family) plus outcome lines woken only by structured results (test green from a passed test tool, error from a failed tool result, completion from a completed turn) — never from the model's words, so a discussion that merely mentions a keyword cannot wake a mood, and a whisper never quotes real content (no tool names, paths or model text); paced by cooldowns (9 s category, 5 s outcome) and an 8 s display TTL, the status copy returns after a few seconds |
| Multi-session activity | The pet is host-global: the most recent meaningful event drives the sprite animation while every active top-level session reports its own state in a separate bubble; completed turns from every session (subagents included) contribute affinity and treats |
```

</details>

**依据 2 · 源码核查**：[src/service.ts:641-669](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/service.ts#L641-L669)

按会话消费事件，处理传统输入与正式完成奖励。

<details>
<summary>查看原文（29行）</summary>

```text
        this.ctx.on('session/event', (session: Session, event: SessionEvent) => {
          const runtime = this.activityOf(session).runtime
          // `activity/status` is an optional compatibility input. It is not
          // declared as a durable event type by this package because current
          // Harness installations publish the official session vocabulary.
          if ((event.type as string) === 'activity/status') {
            const payload = ((event as unknown as { data?: unknown }).data ?? {}) as ActivityStatusEventLike
            if (typeof payload.phase !== 'string' || !isActivityPhase(payload.phase)) return
            this.applyActivity(session, {
              phase: payload.phase,
              ...(typeof payload.line === 'string' ? { line: payload.line } : {}),
              ...(typeof payload.phrase === 'string' ? { phrase: payload.phrase } : {}),
            })
            // On a legacy-only stream the compatibility event owns turn
            // rewards. Once any official activity is observed, turn/end owns
            // them and a derived legacy `done` cannot double-count.
            if (payload.phase === 'done' && !runtime.officialEventsSeen) {
              this.rewardLegacyTurn()
            }
            return
          }

          const transition = projectOfficialEvent(event, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:574-588](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/routes.ts#L574-L588)

状态查询接收当前会话，交互请求限制类别。

<details>
<summary>查看原文（15行）</summary>

```text
export function makePetRoutes(deps: { service: PetService; ctx: Context; assetCaps?: PetAssetCaps } & PetRuntimeRoots): WebRoute[] {
  const { service, ctx } = deps
  const apiRoutes: WebRoute[] = [
    getRoute(ctx, PET_API_PREFIX + '/state', (req) => {
      // The browser half reports the GUI's current session id so the bubble
      // stack can lead with the session the user is actually looking at.
      const current = new URL(req.url ?? '/', 'http://pet.local').searchParams.get('current')
      return service.state(current === null || current === '' ? undefined : current)
    }),
    getRoute(ctx, PET_API_PREFIX + '/pets', () => service.pets()),
    getRoute(ctx, PET_API_PREFIX + '/diagnostics', () => service.diagnostics()),
    postRoute(ctx, PET_API_PREFIX + '/interact', (body) => {
      const kind = body.kind as PetInteraction | undefined
      if (kind !== 'pet' && kind !== 'feed') return Promise.reject(new Error('invalid-kind'))
      return service.interact(kind)
```

</details>

#### 缺口

- 没有同时等待多会话时的对照。
  **影响**：无法推断切页、时间和注意力收益。
  **进一步探讨**：记录原生状态与浮层下的识别耗时和误判。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宠物从会话事件到 Web 渲染如何同步和停止？

**研究主题**：功能与机制、工程质量与复用、依赖、兼容与流程

#### 完整回答

清单将宿主和浏览器拆开，目标为 DSH Web，宿主强注入 webServer。在启用时，插件注册同源 API，由浏览器读取状态和宠物清单。宿主从正式会话事件和流帧投影活动，在会话释放时清掉登记。浏览器每两秒刷新，隐藏页暂停定时器，回到可见时立刻刷新。轮询、恢复可见和交互可能重叠，顺序号只允许最新发起的状态请求更新，旧响应会被忽略。失败时最新请求标记传输错误。关闭或被新实例接管时，页面会卸载 React 根、清理定时器和会话监听；宿主启用开关同时摘掉路由。这些措施缩小乱序与重复挂载的影响。两次轮询间的短事件可能只剩最新状态，不能把浮层当完整事件日志。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:51-76](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/package.json#L51-L76)

声明 DSH 版本、Web 依赖和注入。

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-workspace"
      ],
      "platform": "web"
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "~3.19.0",
    "clsx": "^2.1.1"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.2-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 2 · 源码核查**：[src/index.ts:398-413](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/index.ts#L398-L413)

启停切换注册或释放 API。

<details>
<summary>查看原文（16行）</summary>

```text
  const routes = makePetRoutes({ service, ctx })
  let disposeRoutes: (() => void) | undefined
  const syncRoutes = (): void => {
    const enabled = current().enabled ?? true
    if (disposeRoutes === undefined && enabled) {
      disposeRoutes = ctx.effect(
        () => {
          const disposers = routes.map((route) => ctx.webServer.register(route))
          return () => { for (const dispose of disposers) dispose() }
        },
        'pet: routes',
      )
    } else if (disposeRoutes !== undefined && !enabled) {
      disposeRoutes()
      disposeRoutes = undefined
    }
```

</details>

**依据 3 · 源码核查**：[src/service.ts:663-687](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/service.ts#L663-L687)

正式事件、流帧和会话释放。

<details>
<summary>查看原文（25行）</summary>

```text
          const transition = projectOfficialEvent(event, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
          }
        }),
        this.ctx.on('agent/assistant-stream', ({ agent, frame }: { agent: { session: Session }; frame: AssistantStreamFrame }) => {
          const session = agent.session
          const runtime = this.activityOf(session).runtime
          const transition = projectAssistantStreamFrame(frame, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
        }),
        this.ctx.on('session/disposed', (session: Session) => {
          this.ledger.forgetSession(String(session.id))
          this.officialEventSessions.delete(session)
          this.sessionActivity.delete(session)
          if (session !== this.displaySession) return
          // The display session is gone: fall back to the most recent
          // remaining session's last input, or settle to idle when none.
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:435-496](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/index.ts#L435-L496)

可见性、顺序号和轮询失败处理。

<details>
<summary>查看原文（62行）</summary>

```text
      // The registry list is fetched lazily with retries baked into the poll
      // cycle: until it lands, the dock entry renders nothing and every 2s
      // tick tries again. After it lands, one list feeds both the sprite and
      // the settings card's choices.
      let petsLoaded = false
      // Latest-wins guard: the 2s tick, visibility recovery, and
      // interaction-triggered refreshes can overlap; only the newest
      // response may publish, so a slow older one can never roll the
      // snapshot back.
      let stateSeq = 0
      const pollNow = (): void => {
        if (!petsLoaded) {
          petApi.pets().then((list) => {
            petsLoaded = true
            setPets(list)
          }, () => {
            // Retry on the next poll tick.
          })
        }
        const seq = stateSeq + 1
        stateSeq = seq
        petApi.state(currentSessionId()).then((snapshot) => {
          if (seq !== stateSeq) return
          setSnapshot(snapshot)
        }, () => {
          if (seq !== stateSeq) return
          setState('error', 'pet.state transport error')
        })
      }

      const disposePoll = ctx.effect(() => {
        // Poll only while the tab is visible: the host snapshot does not
        // change while the page is hidden, so a background interval would
        // only burn RPCs (browser throttling is an unreliable backstop).
        // Coming back to the tab refreshes the pet immediately instead of
        // waiting out the next 2 s cycle.
        let timer: number | undefined
        const stop = (): void => {
          if (timer !== undefined) {
            window.clearInterval(timer)
            timer = undefined
          }
        }
        const start = (): void => {
          if (timer === undefined && document.visibilityState === 'visible') {
            timer = window.setInterval(pollNow, POLL_MS)
          }
        }
        const onVisibility = (): void => {
          if (document.visibilityState === 'visible') {
            pollNow()
            start()
          } else {
            stop()
          }
        }
        start()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          stop()
          document.removeEventListener('visibilitychange', onVisibility)
        }
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:662-696](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/index.ts#L662-L696)

新实例接管及资源清理。

<details>
<summary>查看原文（35行）</summary>

```text
      let uiGone = false
      disposeUi = () => {
        if (uiGone) return
        uiGone = true
        clearUiTeardown?.()
        clearUiTeardown = undefined
        unsubscribeLocale()
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeSessionWatch()
        disposeUi = undefined
      }
      // The slot teardown is the takeover hook a later apply body runs; it
      // marks this instance terminal so a late settings callback from the
      // still-draining instance cannot remount a second pet.
      clearUiTeardown = registerPetUiTeardown(() => {
        uiDead = true
        disposeUi?.()
      })
    } else if (!uiDead && !enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
    }
  }
  // The settings subscription and the pet UI lifetime follow the fiber
  // (issue #785): disposal drops the subscription and tears the UI down
  // (terminal), so a hot-reloaded or re-injected bundle never leaves the
  // previous React root, container, or poll loop behind on document.body.
  const unsubscribeSettings = settingsForm.subscribe(syncUi)
  ctx.effect(
    () => () => {
      unsubscribeSettings()
      // Release the deferred form's retry timer and its mirror subscription so a
      // disposed fiber can never bind or publish after teardown.
```

</details>

#### 缺口

- 固定宿主和浏览器上的峰值、闪烁及热重载行为未验证。
  **影响**：无法判定多会话与快速切页下每个提示都能观察到。
  **进一步探讨**：在合成连续短事件和延迟响应下抓取页面变化与请求。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 关闭宠物时哪些本地与外部行为仍需注意？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

设置关闭会停止宠物界面、轮询和宿主 API，但客户端 apply 在读取启用状态前就尝试外发安装心跳。客户端在可用的本地存储中复用随机标识，发往 dsh-market.com 的载荷包括访客标识、包名和构建已提供的版本。载荷由安装项构造，代码所示没有会话文本。自动化浏览器和无法取得本地存储标识的环境会跳过，只有收到成功响应后才记当天已发送，离线失败可在后续挂载时重试。外部服务实际收到或保留什么、访问时间和网络开销没有实测。

普通 Web 用户若接受这项网络行为，可在临时 profile 用空会话试一个回合，检查禁用后的浮层与同源请求。要求应用静默外联的环境宜先观察并核实实际网络策略，不用宠物设置当心跳退出开关。要退出应移除客户端插件或通过符合环境要求的出网限制阻断该请求，并确认重载后没有遗留界面。安装与排障是人工投入，持续资源有轮询、渲染和素材，均未计量。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:359-395](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/index.ts#L359-L395)

客户端先触发心跳，随后处理启用状态。

<details>
<summary>查看原文（37行）</summary>

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-pet' }])

  ctx.effect(() => {
    try {
      return ctx.locale.register(NS, { zh, en })
    } catch {
      return () => {}
    }
  }, 'pet: dictionaries')

  // Built-in renderers dispatch through the plugin-wide registry (pet-center
  // M3). Registration is idempotent (id wins), so re-applies stay clean.
  defaultPetRendererRegistry.register(live2dRenderer)
  defaultPetRendererRegistry.register(frames2dRenderer)

  const settingsForm = new DeferredSettingsForm(ctx)
  const enabled = (): boolean => {
    const snapshot = settingsForm.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.enabled ?? true
      : snapshot.status === 'unavailable'
  }

  // One staged form follows the pet page between Web Extensions and the
  // standalone first-level section. Seat migration does not reset drafts.
  const petSettings = new PetSettingsCardController(settingsForm)
  const disposeSettingsRegistration = installPetSettingsRegistration(ctx, petSettings)
  ctx.effect(() => () => {
    disposeSettingsRegistration()
    petSettings.dispose()
  }, 'pet: settings page')

  // The global pet entry, its store, and the poll loop live while the plugin
  // is enabled; toggling the setting off hides the pet and stops polling.
```

</details>

**依据 2 · 源码核查**：[src/client/telemetry.ts:25-55](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/telemetry.ts#L25-L55)

目的地与本地随机标识。

<details>
<summary>查看原文（31行）</summary>

```text
const VISITOR_KEY = 'dsh-web-ui-telemetry-visitor'
const DAY_KEY_PREFIX = 'dsh-web-ui-telemetry-day:'
const ENDPOINT = 'https://dsh-market.com/api/telemetry/event'

// Baked into each client bundle by shared/tsdown.client.ts (the package's own
// package.json version at build time). Undefined in dev/test builds.
declare const __DSH_PKG_VERSION__: string | undefined

/** The building package's version, when the bundle carries it. */
function bakedVersion(): string | undefined {
  try {
    return typeof __DSH_PKG_VERSION__ === 'string' && __DSH_PKG_VERSION__ !== ''
      ? __DSH_PKG_VERSION__
      : undefined
  } catch {
    return undefined
  }
}

/** Read or lazily create the anonymous visitor id; null when storage is unavailable. */
function visitorId(): string | null {
  try {
    const existing = localStorage.getItem(VISITOR_KEY)
    if (existing && /^[A-Za-z0-9_-]{16,64}$/.test(existing)) return existing
    const fresh = crypto.randomUUID().replaceAll('-', '')
    localStorage.setItem(VISITOR_KEY, fresh)
    return fresh
  } catch {
    // Storage unavailable (privacy mode, sandboxed frame): report nothing.
    return null
  }
```

</details>

**依据 3 · 源码核查**：[src/client/telemetry.ts:75-104](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/telemetry.ts#L75-L104)

发出的实际字段、跳过条件及静默失败。

<details>
<summary>查看原文（30行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:662-696](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/index.ts#L662-L696)

停用移除界面和本地轮询。

<details>
<summary>查看原文（35行）</summary>

```text
      let uiGone = false
      disposeUi = () => {
        if (uiGone) return
        uiGone = true
        clearUiTeardown?.()
        clearUiTeardown = undefined
        unsubscribeLocale()
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeSessionWatch()
        disposeUi = undefined
      }
      // The slot teardown is the takeover hook a later apply body runs; it
      // marks this instance terminal so a late settings callback from the
      // still-draining instance cannot remount a second pet.
      clearUiTeardown = registerPetUiTeardown(() => {
        uiDead = true
        disposeUi?.()
      })
    } else if (!uiDead && !enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
    }
  }
  // The settings subscription and the pet UI lifetime follow the fiber
  // (issue #785): disposal drops the subscription and tears the UI down
  // (terminal), so a hot-reloaded or re-injected bundle never leaves the
  // previous React root, container, or poll loop behind on document.body.
  const unsubscribeSettings = settingsForm.subscribe(syncUi)
  ctx.effect(
    () => () => {
      unsubscribeSettings()
      // Release the deferred form's retry timer and its mirror subscription so a
      // disposed fiber can never bind or publish after teardown.
```

</details>

#### 缺口

- 未实测安装、禁用后的网络及对端存储行为。
  **影响**：不能从设置开关或作者说明推出隔离环境已经合规。
  **进一步探讨**：用临时 profile 记录初装、关闭与移除三种状态下的请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何验证提示能否减少来回查看且不会误导？

**研究主题**：新假设与验证

#### 完整回答

未验证假设是悬浮状态能减少等待多任务时的切页，同时不增加对完成或失败的错误判断。让同一用户以交叉顺序完成两组等价的双会话脚本，一组使用原会话状态，另一组打开宠物。每组加入一次短工具失败和一次隐藏页后回到可见，记录用户确认正确会话所需的切页数、错误完成判断和重新检查时间，并记录浮层遮挡。只统计能正确定位任务结果的样本作为完成。若误判或遮挡上升，即使切页更少也不能支持该用法。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:454-496](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/client/index.ts#L454-L496)

可见性与最近请求控制，提供实验条件。

<details>
<summary>查看原文（43行）</summary>

```text
        const seq = stateSeq + 1
        stateSeq = seq
        petApi.state(currentSessionId()).then((snapshot) => {
          if (seq !== stateSeq) return
          setSnapshot(snapshot)
        }, () => {
          if (seq !== stateSeq) return
          setState('error', 'pet.state transport error')
        })
      }

      const disposePoll = ctx.effect(() => {
        // Poll only while the tab is visible: the host snapshot does not
        // change while the page is hidden, so a background interval would
        // only burn RPCs (browser throttling is an unreliable backstop).
        // Coming back to the tab refreshes the pet immediately instead of
        // waiting out the next 2 s cycle.
        let timer: number | undefined
        const stop = (): void => {
          if (timer !== undefined) {
            window.clearInterval(timer)
            timer = undefined
          }
        }
        const start = (): void => {
          if (timer === undefined && document.visibilityState === 'visible') {
            timer = window.setInterval(pollNow, POLL_MS)
          }
        }
        const onVisibility = (): void => {
          if (document.visibilityState === 'visible') {
            pollNow()
            start()
          } else {
            stop()
          }
        }
        start()
        document.addEventListener('visibilitychange', onVisibility)
        return () => {
          stop()
          document.removeEventListener('visibilitychange', onVisibility)
        }
```

</details>

**依据 2 · 源码核查**：[src/service.ts:663-687](https://github.com/zhu1090093659/dsh-pet/blob/ae2c9d443eda35a6439597c1787c7607e988bbed/src/service.ts#L663-L687)

会话活动会因消息和释放变动，可设置识别任务。

<details>
<summary>查看原文（25行）</summary>

```text
          const transition = projectOfficialEvent(event, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
          }
        }),
        this.ctx.on('agent/assistant-stream', ({ agent, frame }: { agent: { session: Session }; frame: AssistantStreamFrame }) => {
          const session = agent.session
          const runtime = this.activityOf(session).runtime
          const transition = projectAssistantStreamFrame(frame, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.officialEventSessions.add(session)
          this.applyActivity(session, transition.input, transition.whisper)
        }),
        this.ctx.on('session/disposed', (session: Session) => {
          this.ledger.forgetSession(String(session.id))
          this.officialEventSessions.delete(session)
          this.sessionActivity.delete(session)
          if (session !== this.displaySession) return
          // The display session is gone: fall back to the most recent
          // remaining session's last input, or settle to idle when none.
```

</details>

#### 缺口

- 未做该行为实验。
  **影响**：不能宣称工作效率改进。
  **进一步探讨**：按相同任务记录四项指标和失败样本。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
