# DSH Pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4def8a8](https://github.com/zhu1090093659/dsh-pet/tree/4def8a84622304da67c750fd35dfdb3a2aac7c69)

<!-- BEGIN META -->
[![GitHub ★ 71](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=71&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-pet) [![npm 30d 136,499](https://img.shields.io/static/v1?label=npm+30d&message=136%2C499&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet) [![最新发布 2026-11-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-16&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-pet)
<!-- END META -->

> **功能**：在 DSH Web 显示随会话活动变化的浮动宠物，支持宠物切换、命名、投喂与亲密度。

> **亮点**：[Q01](#research-q01) 在跨会话等待时把需要关注的顶层活动放进可回跳的浮层。[Q02](#research-q02) 可见性控制和请求序号减小无效刷新与响应倒序影响。[Q03](#research-q03) 包内双语卡片让支持该机制的插件列表可以直接读取本地化介绍。

> **主要限制**：[Q02](#research-q02) 气泡读的是当前快照，短暂活动可能落在采样间隔内。[Q04](#research-q04) 功能停用的路由和轮询开关位于心跳的独立触发之后，不能单从页面上宠物消失判断浏览器请求。

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
  - [Q01 · 谁能从常驻气泡获得什么？](#detail-section-11)
  - [Q02 · 宿主事件如何走到气泡，哪些情况会漏显？](#detail-section-12)
  - [Q03 · 双语插件列表介绍依赖哪些发布条件？](#detail-section-13)
  - [Q04 · 如何确认停用与撤出，哪些成本和网络行为需要单独看？](#detail-section-14)
  - [Q05 · 如何验证常驻气泡在双会话任务上有帮助？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合在 DSH Web 同时等待两条任务、希望从当前页面找回需要处理的会话的人。

[Q01](#research-q01) 原生会话列表和会话页提供任务历史与工具回执。浮层可作为同一浏览器页面里的回查入口，是否遗漏或节省查看时间取决于活动长度、页面可见性和持有的会话数。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 顶层活动气泡 | 查看当前和近期活动，跳到对应会话 | 周期采样且气泡限量，最终结果仍回原会话确认 |
| 宠物互动和设置 | 切换、命名、投喂与调整浮层 | 依赖宿主客户端服务、资源和设置 |
| 双语插件卡片 | 在插件列表介绍包的用途 | 宿主与发布文件都支持相应 locale 机制 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH >=0.2.2-rc.2、Web 所需连接、会话、设置与工作区服务 | 对本代表任务必需 | 挂载插件及导航到具体会话 | 旧宿主需先核对声明版本和 Web 注入 |
| Node >=24.9.0、React 18 peer 和双入口产物 | 按包声明必需 | 运行构建后的宿主与客户端 | 核对实际发布包和宿主环境 |
| 可读取的宠物清单与资源 | 界面所需 | 生成宠物内容和媒体资源 | 试用先核对一个内置素材 |
| 可接受启动心跳的网络条件 | 本轮试用条件 | 数据流涉及浏览器本地标识与外部请求 | 不符合时沿用原生会话视图 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在临时 DSH Web profile 核对宿主、拟用包与网络条件 | 能辨认宿主挂载条目和预期会话 |
| 使用 | 启动两个无敏感数据的会话，切换后点击对应气泡 | 回到正确的仍可用会话，关键结果回原页查看 |
| 复核 | 观察前后台轮询与普通浏览器请求，再单独切换 enabled | 宿主路由和显示按预期变化，心跳单独判定 |
| 退出 | 移除临时 profile 里的插件并重载 | 核对插件客户端和请求状态，保留所需布局数据 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包和宠物资源，费用未知 | 核查版本、建立临时 profile、审阅网络 | 旧宿主可能增加升级工作 |
| 持续使用 | 前台轮询、素材解码和浏览器资源，量未测 | 核对短活动、会话归属及显示遮挡 | 没有端到端耗时实测 |
| 失败恢复 | 重新加载与资源请求，成本未知 | 退回会话视图，回查短事件或错误归属 | 轮询无法补读所有状态历史 |
| 退出 | 持久化和浏览器标识占用未知 | 分别检查停用、移除和所需数据保留 | 真实卸载尚未验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 活动回查 | 顶层会话状态和有效会话导航 | 正确找到目标的速度和短状态漏看率 |
| 页面资源 | 隐藏标签页暂停周期请求，返回立即刷新 | 浏览器负荷和不同素材的开销 |
| 列表发现 | 包内可读的中英文标题和描述来源 | 指定版本发布归档和宿主是否展示 |

> **思考**：[Q02](#research-q02) 气泡读的是当前快照，短暂活动可能落在采样间隔内。[Q04](#research-q04) 功能停用的路由和轮询开关位于心跳的独立触发之后，不能单从页面上宠物消失判断浏览器请求。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 在跨会话等待时把需要关注的顶层活动放进可回跳的浮层。[Q02](#research-q02) 可见性控制和请求序号减小无效刷新与响应倒序影响。[Q03](#research-q03) 包内双语卡片让支持该机制的插件列表可以直接读取本地化介绍。

[Q02](#research-q02) 以服务实例管理事件和主视图投影，浏览器侧用请求序号拒绝过期响应。[Q03](#research-q03) 发布时同时维护静态词典、导出和白名单，源码中的断言能对三者做一致性检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 气泡读的是当前快照，短暂活动可能落在采样间隔内。[Q04](#research-q04) 功能停用的路由和轮询开关位于心跳的独立触发之后，不能单从页面上宠物消失判断浏览器请求。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 只在兼容且允许该外部请求的临时 DSH Web profile 试用。观察两个空会话，核对气泡回跳和前后台请求。遇到误归属、漏掉关键状态或不满足网络要求，移除插件并回到原生会话视图。分别检查隐藏、停用和移除，三者的运行条件不同。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持双入口、活动快照和可回跳气泡。已核到双语元数据与 rc.2 宿主门槛。网络和真实页面行为待确认，双会话收益待对照。

- 已检查：作者 README、包清单、源码路径 README.md、src/service.ts、src/client/index.ts、package.json、cordis.patch.yml、tsdown.config.ts、shared/tsdown.client.ts、src/index.ts、src/routes.ts、locale/en.json、locale/zh.json、tests/display-metadata.spec.ts、docs/release-notes/v0.4.19.md、src/client/telemetry.ts、src/persist.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定版本双入口、活动投影、同源路由、轮询、遥测发起和插件列表元数据。未运行目标包、真实宿主、外部服务或目标测试，未核实所有素材和市场端处理。
- 下一步：[Q05](#research-q05) 用两个有固定状态记录的空会话对照原生列表与浮层，并在普通浏览器单独观察加载、隐藏、停用和移除。用固定包验证列表语言切换。

**分析版本**

- **仓库**：[zhu1090093659/dsh-pet](https://github.com/zhu1090093659/dsh-pet)
- **版本号**：0.4.19（[固定提交 4def8a8](https://github.com/zhu1090093659/dsh-pet/tree/4def8a84622304da67c750fd35dfdb3a2aac7c69)）
- **版本日期**：2026-11-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用两条已知活动的会话比较常驻气泡与原生列表对回查速度和误归属的影响，并单列短活动与页面遮挡。若识别没有改善且会打断工作，常驻展示在该任务中不成立。

[Q05](#research-q05) 用两个有固定状态记录的空会话对照原生列表与浮层，并在普通浏览器单独观察加载、隐藏、停用和移除。用固定包验证列表语言切换。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 62 | 4519 | — | — | 70902 |
| .mjs | source | 1 | 150 | 109 | 34 | — |
| .mjs | test | 2 | 310 | 267 | 14 | — |
| .cjs | source | 1 | 169 | 138 | 21 | — |
| .ts | source | 56 | 13501 | 9141 | 3598 | — |
| .ts | test | 44 | 10355 | 8599 | 946 | — |
| .tsx | test | 10 | 3844 | 3136 | 431 | — |
| .tsx | source | 11 | 3951 | 2884 | 919 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+created%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z) [![近30天关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-18T02%3A10%3A05.734Z..2026-11-17T02%3A10%3A05.734Z)



统计日期：2026-11-17。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：对 DSH Web 内并行等待的用户，活动气泡能否补足原会话视图，试用要满足哪些宿主、网络和退出条件？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁能从常驻气泡获得什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

适合在 DSH Web 同时等待两条任务、愿意用页面常驻反馈提醒自己查看结果的人。例如先发起较长的一轮代码调查，再切到另一条会话核对需求。当前视图可将当前会话排在气泡首位，其他有气泡的顶层会话按活动排序。成员不包含子代理独立气泡，也会滤掉限量之外或已经平息的会话。点选时会先查询会话是否仍在可用列表，再交给工作区导航。

原生会话列表及打开具体会话能确认真实历史、工具回执和最终答复。浮层的增量是在新建对话和切换会话时持续提示可见活动，并提供回到相应会话的入口。若用户只专注一条会话，或需要可靠提醒所有短任务，常驻动画与额外判断的负担可能超过收益。合格结果是一眼找到需要回查的那条会话，并在原会话里确认结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-41](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/README.md#L20-L41)

作者介绍多会话、养成、状态气泡和返回会话。

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

**依据 2 · 源码核查**：[src/service.ts:1058-1096](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/service.ts#L1058-L1096)

状态视图过滤非顶层和静止活动，限制气泡数，以当前会话优先。

<details>
<summary>查看原文（39行）</summary>

```text
  private view(currentSessionId?: string): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // One bubble per concurrently active TOP-LEVEL session. The GUI's current
    // session leads the stack when reported (the browser half passes its
    // session list's 'current'); everything else keeps the most recent
    // meaningful event order. Subagent children render no bubble of their own
    // (their activity already shows through the spawning conversation's
    // bubble/display, and the bubble buttons navigate to GUI sessions, which
    // subagents are not). Sessions whose own machine has settled (no bubble
    // copy) drop out, so a finished turn does not leave a stale bubble behind.
    const sessions: PetSessionView[] = []
    for (const [session, activity] of [...this.sessionActivity.entries()].reverse()) {
      if (sessions.length >= MAX_SESSION_BUBBLES) break
      if (session.header?.origin === 'subagent') continue
      const perSession = activity.machine.render()
      if (perSession.bubble === undefined) continue
      // Each session's whisper rides its own bubble while fresh; an expired
      // whisper simply stops appearing (the client's 2 s poll drops it).
      const whisper = activity.whisper
      const freshWhisper = whisper !== undefined && Date.now() - whisper.at < WHISPER_TTL_MS
        ? whisper.text
        : undefined
      sessions.push({
        sessionId: String(session.id),
        animation: perSession.animation,
        bubble: perSession.bubble,
        phase: perSession.phase,
        ...(freshWhisper === undefined ? {} : { whisper: freshWhisper }),
      })
    }
    // The browser half reports the session the user is currently on; that
    // session's bubble leads the stack (its whisper then speaks on the
    // collapsed single bubble). An unreported or absent session keeps the
    // legacy most-recent-first order.
    if (currentSessionId !== undefined) {
      const index = sessions.findIndex(session => session.sessionId === currentSessionId)
      if (index > 0) sessions.unshift(sessions.splice(index, 1)[0]!)
    }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:509-515](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L509-L515)

只在目标仍存在于会话列表时触发工作区导航。

```text
      const openSession = (sessionId: string): void => {
        const list = sessions.list.getSnapshot()
        if ((list.byId as any)[sessionId] === undefined) return
        // Navigation belongs to the workspace UI since the multi-instance Client
        // Session model; the Session Controller no longer opens one.
        ctx.uiWorkspace.openSession(sessionId as never)
      }
```

#### 缺口

- 缺使用强度和切换收益资料。
  **影响**：只能说明常驻入口的任务，无法判断收益的普遍性。
  **进一步探讨**：比较双会话的回查耗时与误归属。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主事件如何走到气泡，哪些情况会漏显？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

根包用 Cordis patch 把自身加入 profile，宿主从根导出加载模块。清单还声明 Web 客户端依赖，通过 ./client 导出与构建配置选中 src/client/index.ts。宿主 apply 先实例化 PetService，再按 enabled 注册同源路由；状态路由读取浏览器给出的 current 参数并调用服务生成快照。Web 客户端依赖连接、会话、设置和工作区服务，缺相应注入时无法推出界面可挂载。固定清单的 DSH 门槛是 >=0.2.2-rc.2，React peer 是 18，Node 清单为 >=24.9.0。

PetService 从官方会话事件和流帧提取活动，将旧 activity/status 作为兼容输入。发现官方事件后旧 done 不再发放回合奖励，避免两种事件重复计入。会话销毁会清理该会话及相应显示状态。浏览器取得最新快照后在全局 React 界面显示气泡；按可见性开启约 2 秒的周期请求，恢复前台立即刷新，当前会话变化也会触发。序号使旧请求的迟到响应无法覆盖新请求，失败通过状态进入错误分支。序号并不重放两个快照之间的状态，短事件、服务器排序上限及页面恢复时机均会影响呈现。禁用、页签不可见和实例销毁属于不同条件，禁用应单独核对本地 API 与监听器。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:11-19](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/package.json#L11-L19)

包声明 Node 门槛及构建。

```text
  "engines": {
    "node": ">=24.9.0"
  },
  "scripts": {
    "build": "tsc -b && tsdown",
    "test": "vitest run",
    "pet:cli": "node scripts/dsh-pet.cjs",
    "typecheck": "tsc -b --pretty false && tsc -p tsconfig.test.json --pretty false",
    "prepare": "tsdown --config tsdown.prepare.config.ts"
```

**依据 2 · 源码核查**：[package.json:21-31](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/package.json#L21-L31)

根及 client 入口导出。

<details>
<summary>查看原文（11行）</summary>

```text
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
```

</details>

**依据 3 · 源码核查**：[package.json:54-79](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/package.json#L54-L79)

DSH 版本、patch、Web 注入、React peer。

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.2"
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
    "@deepseek-ai/dsh": ">=0.2.2-rc.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 4 · 源码核查**：[cordis.patch.yml:8-10](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/cordis.patch.yml#L8-L10)

挂载本包。

```text
- insert:
    - id: pet
      name: '@linxin666/dsh-pet'
```

**依据 5 · 源码核查**：[tsdown.config.ts:1-17](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/tsdown.config.ts#L1-L17)

配置真实宿主入口。

<details>
<summary>查看原文（17行）</summary>

```text
import { clientBundle } from './shared/tsdown.client.ts'
import { live2dVendorBundle } from './tsdown.live2d-vendor.ts'

export default clientBundle('@linxin666/dsh-pet', [
  'src/index.ts',
], {
  companions: [live2dVendorBundle()],
  libExternal: [
    '@deepseek-ai/dsh-client-locale',
    '@deepseek-ai/dsh-client-ui-conversation',
    '@deepseek-ai/dsh-client-ui-settings',
    '@deepseek-ai/dsh-client-ui-slots',
    '@deepseek-ai/dsh-host-webserver',
    '@deepseek-ai/dsh-session',
    '@deepseek-ai/dsh-settings',
  ],
})
```

</details>

**依据 6 · 源码核查**：[shared/tsdown.client.ts:150-160](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/shared/tsdown.client.ts#L150-L160)

存在源 client 时作为入口。

<details>
<summary>查看原文（11行）</summary>

```text
  const lib = clientLibraryConfig(id, libEntry, options.lib, options.libExternal)
  return ({ env }) => {
    const face = buildFace(env?.DSH_BUILD_FACE)
    // Host-only plugins (no src/client entry) skip the browser face entirely.
    const hasClient = existsSync(resolvePath(process.cwd(), 'src/client/index.ts'))
    const client = hasClient ? clientConfig(id, face === undefined
      ? 'src/client/index.ts'
      : 'lib/types/client/index.js', options.clientPlugins) : undefined
    const node = [lib, ...(options.companions ?? [])]
    if (face === 'host') return options.hostPhase === true ? node : [SKIP_WORKSPACE_BUILD]
    if (face === 'client') return options.hostPhase === true ? (client ? [client] : []) : (client ? [...node, client] : node)
```

</details>

**依据 7 · 源码核查**：[src/index.ts:359-376](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/index.ts#L359-L376)

apply 通过 registry 生成 PetService。

<details>
<summary>查看原文（18行）</summary>

```text
export const apply = mountOnce('@linxin666/dsh-pet', applyImpl)

/** Plugin config: the tuning block a profile may declare plus the pet's settings fields. */
export type PetPluginConfig = Omit<PetConfig, 'enabled' | 'decorationEnabled'> & PetFormConfig

function applyImpl(ctx: Context, config: PetPluginConfig = {}): void {
  const registry = config.registry
    ?? loadPetRegistry({
      packageRoot: petPackageRoot(import.meta.url),
      ...(config.pets === undefined ? {} : { extra: config.pets }),
    })
  const service = new PetService(ctx, {
    ...config,
    enabled: readLive(config.enabled, PET_FORM_DEFAULTS.enabled),
    decorationEnabled: readLive(config.decorationEnabled, PET_FORM_DEFAULTS.decorationEnabled),
    statusBubbles: statusBubbleMode(readLive<PetStatusBubbleMode | undefined>(config.statusBubbles, undefined)),
    registry,
  })
```

</details>

**依据 8 · 源码核查**：[src/index.ts:398-413](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/index.ts#L398-L413)

Web 路由按开关注册和释放。

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

**依据 9 · 源码核查**：[src/service.ts:633-701](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/service.ts#L633-L701)

注册活动回调，识别兼容与官方事件并清理已销毁会话。

<details>
<summary>查看原文（69行）</summary>

```text
  private syncActivity(): void {
    if (this.disposeActivity !== undefined) {
      this.disposeActivity()
      this.disposeActivity = undefined
    }
    if (!this.enabled) return
    this.disposeActivity = (() => {
      const disposers = [
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
          this.displaySession = undefined
          const remaining = [...this.sessionActivity.entries()].at(-1)
          if (remaining !== undefined) {
            const [nextSession, activity] = remaining
            this.displaySession = nextSession
            if (activity.lastInput !== undefined) this.machine.onActivityStatus(activity.lastInput)
            this.machine.onSessionActive()
          } else {
            this.machine.onSessionDisposed()
          }
        }),
      ]
      return () => { for (const dispose of disposers) dispose() }
    })()
```

</details>

**依据 10 · 源码核查**：[src/routes.ts:574-588](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/routes.ts#L574-L588)

状态路由读取当前会话，互动路由检查动词。

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

**依据 11 · 源码核查**：[src/client/index.ts:101-108](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L101-L108)

声明轮询间隔与实际注入。

```text
/** Poll interval for the host snapshot. */
const POLL_MS = 2000

/** Settings namespace of the pet's settings page. It is the profile entry id the Host serves a form for. */
const PET_SETTINGS_NS = 'pet'

/** Required services (sessions powers bubble-to-session navigation). */
export const inject = ['slots', 'locale', 'connection', 'configForms', 'remote', 'sessions', 'uiWorkspace']
```

**依据 12 · 源码核查**：[src/client/index.ts:445-507](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L445-L507)

按文档可见性刷新，在请求序号变化时忽略旧响应。

<details>
<summary>查看原文（63行）</summary>

```text
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
      }, 'pet: poll')

      // A current-session switch should re-order the bubble stack right away,
      // not on the next 2s tick. Poll only while the tab is visible, as the
      // poll loop itself does.
      const disposeSessionWatch = ctx.effect(() => {
        const unsubscribe = sessions.list.subscribe(() => {
          if (document.visibilityState === 'visible') pollNow()
        })
        return unsubscribe
      }, 'pet: current-session watch')
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 双语插件列表介绍依赖哪些发布条件？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

本包在 locale/en.json 与 locale/zh.json 提供 meta.title 和 meta.description，清单为两者提供子路径导出，并把 locale 目录列入发布范围。英文和中文值相异，列表在支持该契约的宿主中因此有直接可读的标题与用途来源。作者发行说明称宿主会先解析英文文件，再通过相同导出机制读取目录下各语言，缺文件、导出或打包项时会回退。没有独立查验宿主加载器的真实回退分支，故将回退归为作者说明。

源码中的契约测试检查磁盘词典与导出键匹配、元数据格式、中文和英文差别，并检查打包白名单与图标；本轮未运行。清单同时把 DSH 要求提高到 rc.2，影响仍使用较早宿主的人。双语词典只为插件列表提供信息，养成、拖拽及状态映射没有依赖这些 meta 值的证据。是否展示取决于真实 tarball 与宿主版本，不能从文件存在推导旧版宿主或所有安装都成功。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:23-51](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/package.json#L23-L51)

两项 locale 导出及白名单实际写入清单。

<details>
<summary>查看原文（29行）</summary>

```text
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "files": [
    "lib/**/*.js",
    "lib/**/*.js.map",
    "lib/**/*.d.ts",
    "lib/**/*.d.ts.map",
    "src",
    "cordis.patch.yml",
    "assets/whale",
    "assets/whale-refined",
    "assets/ouo-neko",
    "assets/blue-throated-bee-eater",
    "assets/decorations",
    "contracts",
    "locale",
    "icon.svg"
```

</details>

**依据 2 · 源码核查**：[package.json:54-79](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/package.json#L54-L79)

声明新版 DSH floor。

<details>
<summary>查看原文（26行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.2"
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
    "@deepseek-ai/dsh": ">=0.2.2-rc.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
```

</details>

**依据 3 · 源码核查**：[locale/en.json:1-6](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/locale/en.json#L1-L6)

英文卡片标题与描述。

```text
{
  "meta": {
    "title": "Desktop pet",
    "description": "An interactive pet on the desktop."
  }
}
```

**依据 4 · 源码核查**：[locale/zh.json:1-6](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/locale/zh.json#L1-L6)

中文卡片标题与描述。

```text
{
  "meta": {
    "title": "桌面宠物",
    "description": "桌面上的互动宠物"
  }
}
```

**依据 5 · 源码核查**：[tests/display-metadata.spec.ts:41-90](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/tests/display-metadata.spec.ts#L41-L90)

仓库中的合约断言覆盖双语、导出集合与发布配置。

<details>
<summary>查看原文（50行）</summary>

```text
  it('ships the languages the plugin page renders', () => {
    for (const language of REQUIRED_LANGUAGES) {
      expect(existsSync(join(ROOT, 'locale', language + '.json')), language).toBe(true)
    }
  })

  it('exports every locale file on disk and ships no key without a file', () => {
    const exported = Object.keys(MANIFEST.exports ?? {})
      .filter((key) => key.startsWith('./locale/'))
      .map((key) => key.slice('./locale/'.length))
      .sort()
    expect(exported).toEqual(localeFiles())
  })

  it('carries only a non-empty title and description per language', () => {
    for (const file of localeFiles()) {
      const doc = JSON.parse(readFileSync(join(ROOT, 'locale', file), 'utf8')) as Record<string, unknown>
      expect(Object.keys(doc), file).toEqual(['meta'])
      const meta = doc.meta as Record<string, unknown>
      for (const field of ['title', 'description']) {
        expect(typeof meta[field], file + ' meta.' + field).toBe('string')
        expect((meta[field] as string).trim(), file + ' meta.' + field).not.toBe('')
      }
    }
  })

  it('writes Chinese copy that differs from English and stays short', () => {
    const en = metaOf('en')
    const zh = metaOf('zh')
    expect(zh.title).not.toBe(en.title)
    expect(zh.description).not.toBe(en.description)
    const han = zh.description?.match(HAN) ?? []
    expect(han.length).toBeGreaterThan(0)
    expect(han.length).toBeLessThanOrEqual(MAX_ZH_DESCRIPTION_HAN)
  })

  it('publishes the locale directory and the card icon', () => {
    expect(Array.isArray(MANIFEST.files)).toBe(true)
    const files = MANIFEST.files as string[]
    expect(files).toContain('locale')
    const icon = MANIFEST.icon
    expect(typeof icon).toBe('string')
    expect(isAbsolute(icon as string)).toBe(false)
    const iconPath = resolve(ROOT, icon as string)
    const inside = relative(ROOT, iconPath).replaceAll('\\', '/')
    expect(inside.length).toBeGreaterThan(0)
    expect(inside.startsWith('..')).toBe(false)
    expect(statSync(iconPath).isFile()).toBe(true)
    expect(ICON_EXTENSIONS).toContain(extname(iconPath).toLowerCase())
    expect(files).toContain(inside)
```

</details>

**依据 6 · 作者声明**：[docs/release-notes/v0.4.19.md:5-21](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/docs/release-notes/v0.4.19.md#L5-L21)

作者解释宿主查找流程及缺项的回退；未验证宿主。

<details>
<summary>查看原文（17行）</summary>

```text
### 新功能

- 插件页显示元数据（`a465df5`）：npm 包清单自带的 `description` 只有一句英文、标题只能落到包名，插件列表因此一直显示 `@linxin666/dsh-pet` 与那句英文描述。本版补上宿主已经在读的本地化通道：
  - `locale/en.json`：`meta.title` 为 `Desktop pet`，`meta.description` 为 `An interactive pet on the desktop.`
  - `locale/zh.json`：`meta.title` 为 `桌面宠物`，`meta.description` 为 `桌面上的互动宠物`
  - `package.json` 的 `exports` 增加 `./locale/en.json` 与 `./locale/zh.json` 两条映射，`files` 白名单增加 `locale` 目录
- 三处必须在场，缺一不可：宿主先解析 `locale/en.json`，再枚举该目录下每个 `*.json` 并经本包自己的 `exports` 映射逐个解析。文件在而导出键缺、导出键在而文件缺、或者 `locale` 目录被 npm 的 `files` 白名单漏掉（打包时整个目录不进 tarball），任何一种都会让整次元数据读取失败，页面静默退回包名与英文描述，且不给任何报错
- 影响面只在显示层：宠物注册表、渲染、拖拽、交互与持久化一条都不经过这条通道，运行时行为与 0.4.18 逐条一致
- 文案本身也受约束：中文标题与描述必须与英文不同，中文描述的汉字数不超过 20，两条标题都非空——这几条写在测试里，不是口头约定

### 修复

- 无缺陷修复：本区间唯一的提交只新增两份 locale 文件、两条导出键、一条 `files` 条目与一支测试，没有一行改动既有行为代码、资产或契约

### 其他改动

- 新增测试 `tests/display-metadata.spec.ts`（92 行，vitest，五条断言）：`en` / `zh` 两个文件都在；`exports` 里以 `./locale/` 开头的键与磁盘上的 `locale/*.json` 双向完全相等（有键无文件、有文件无键都失败）；每份文件顶层只有 `meta`，且 `title` / `description` 都是非空字符串；中文标题与描述分别不同于英文，且中文描述的汉字数落在 1 到 20 之间；`files` 含 `locale`，`icon` 是包内相对路径、文件真实存在、扩展名在 `.svg` / `.png` / `.jpg` / `.jpeg` / `.webp` 之内，并且已经写进 `files`
```

</details>

#### 缺口

- 真实归档及宿主卡片处置未验。
  **影响**：无法保证目标版本列表会显示或如何回退。
  **进一步探讨**：检查固定发布产物并在隔离 profile 切换语言。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何确认停用与撤出，哪些成本和网络行为需要单独看？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

宿主的 enabled 判断控制状态和媒体路由的注册，服务禁用时撤掉活动订阅并清理瞬态状态。浏览器也依据 enabled 控制全局 UI 和轮询；面板里的隐藏只是把显示位置交给召唤入口。浏览器 apply 进入时却先调用独立的心跳，之后才建立设置与 enabled 的判断。隐藏界面或关闭宠物功能仍得另行检查客户端是否随 profile 继续装载。

心跳尝试向 dsh-market.com 发送 POST，正文包含访客随机标识和插件包名，可带构建时版本。该代码使用 localStorage 存放访客标志，当日已成功、自动化 webdriver 标志存在或存储出错时不发；成功后写 UTC 日标记，网络错误静默，在以后装载时可能重试。消息形状未包含会话字段，市场终端的保留、网络层可见数据和端到端送达不从本插件推定。自动化环境因明确跳过，单靠无人浏览器抓不到请求并不能替代对正常浏览器的验证。

只建议接受这一网络边界且已有兼容 DSH Web 的用户在临时 profile 试用。首次人工成本包括核对版本和临时配置、准备双会话与审阅网络，持续成本包括轮询、图像解码和页面资源，实际现金、内存和耗时未知。若气泡将行动引到错误会话、短回合遗漏影响决策或网络要求不合适，退回原生会话视图。移除 profile 中的插件、重载页面并核对客户端和请求；需要保留布局或养成状态时先检查 DSH_HOME 下的 pet.json。功能关闭、profile 移除与浏览器持久化清理要分别验收。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:398-413](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/index.ts#L398-L413)

宿主禁用时撤路由。

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

**依据 2 · 源码核查**：[src/service.ts:630-641](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/service.ts#L630-L641)

停用重置活动并移除活动监听。

<details>
<summary>查看原文（12行）</summary>

```text
    if (!enabled) this.resetActivity()
  }

  private syncActivity(): void {
    if (this.disposeActivity !== undefined) {
      this.disposeActivity()
      this.disposeActivity = undefined
    }
    if (!this.enabled) return
    this.disposeActivity = (() => {
      const disposers = [
        this.ctx.on('session/event', (session: Session, event: SessionEvent) => {
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:359-383](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L359-L383)

在设置开关计算前发起心跳。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:394-417](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L394-L417)

受 enabled 和实例终止控制的 UI。

<details>
<summary>查看原文（24行）</summary>

```text
  // The global pet entry, its store, and the poll loop live while the plugin
  // is enabled; toggling the setting off hides the pet and stops polling.
  // 'uiDead' marks a terminal teardown (takeover by a later bundle instance
  // or fiber disposal): a taken-over or disposed instance must never remount
  // from a late settings callback (issue #785).
  let disposeUi: (() => void) | undefined
  let clearUiTeardown: (() => void) | undefined
  let uiDead = false
  const killUi = (): void => {
    if (uiDead) return
    uiDead = true
    clearUiTeardown?.()
    clearUiTeardown = undefined
    disposeUi?.()
    disposeUi = undefined
  }
  const syncUi = (): void => {
    if (!uiDead && enabled() && disposeUi === undefined) {
      // ONE store instance for the whole app, owned by this apply body. The
      // pet is host-global (state/display/interactions are /api/pet/*
      // endpoints with no session dimension), so the slot system's per-session
      // store scoping would only reset the pet on session switches and leave
      // it stateless on the new-conversation screen (no session to scope by).
      const petStore: PetStoreInstance = createPetStore().create()
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:543-548](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L543-L548)

隐藏只调用 setVisible。

```text
        hide: () => {
          petApi.setVisible(false).then(() => {
            pollNow()
          }, () => {
            // Ignore; next poll resyncs.
          })
```

**依据 6 · 源码核查**：[src/client/telemetry.ts:25-31](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/telemetry.ts#L25-L31)

标志键、目标端点和可选构建版本。

```text
const VISITOR_KEY = 'dsh-web-ui-telemetry-visitor'
const DAY_KEY_PREFIX = 'dsh-web-ui-telemetry-day:'
const ENDPOINT = 'https://dsh-market.com/api/telemetry/event'

// Baked into each client bundle by shared/tsdown.client.ts (the package's own
// package.json version at build time). Undefined in dev/test builds.
declare const __DSH_PKG_VERSION__: string | undefined
```

**依据 7 · 源码核查**：[src/client/telemetry.ts:44-55](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/telemetry.ts#L44-L55)

随机访客标识可持久化，存储失败时不报。

<details>
<summary>查看原文（12行）</summary>

```text
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

**依据 8 · 源码核查**：[src/client/telemetry.ts:75-104](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/telemetry.ts#L75-L104)

自动化标志、日去重和实际 POST 的字段及成功标记。

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

**依据 9 · 源码核查**：[src/persist.ts:275-279](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/persist.ts#L275-L279)

持久化目标是该目录中的 pet.json。

```text
export function savePetPersist(data: PetPersist, dir: string = petHomeDir()): void {
  mkdirSync(dir, { recursive: true })
  const target = join(dir, 'pet.json')
  const tmp = `${target}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
```

#### 缺口

- 实际网络传输、市场服务端储存和客户端资源消耗未知。
  **影响**：不能承诺关闭或重载后的真实出网状态，也无法给出实际成本。
  **进一步探讨**：分别观察正常浏览器中的载入、隐藏、停用、移除，并比较页面资源。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何验证常驻气泡在双会话任务上有帮助？

**研究主题**：新假设与验证

#### 完整回答

假设是显示可回跳的前台会话及其他活动，能使用户更快找到需要处理的并行会话，且不增加误归属。当前提供以 current 参数排序的顶层气泡和经过真实列表检查的导航。约两秒轮询以及筛掉子代理或无气泡活动，意味着用户可能错过短状态。两类作用应在同任务内一起比较。

随机交换两份相同任务脚本的显示顺序，在同一宿主记录两个顶层会话的已知状态。交替使用原生列表和宠物气泡，任务是从任一对话快速跳到指定会话查实际回执。包括持续活动、短于轮询的动作、切回前台和状态已结束的反例；测正确找到会话的耗时、误归属、漏看、额外点击和遮挡。若正确率没有改善，且耗时、误归属或遮挡恶化，则不支持该任务的常驻使用。实验本身尚未执行。

#### 证据与依据

**依据 1 · 源码核查**：[src/service.ts:1058-1096](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/service.ts#L1058-L1096)

顶层可见气泡集合和当前会话排序提供试验输入。

<details>
<summary>查看原文（39行）</summary>

```text
  private view(currentSessionId?: string): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // One bubble per concurrently active TOP-LEVEL session. The GUI's current
    // session leads the stack when reported (the browser half passes its
    // session list's 'current'); everything else keeps the most recent
    // meaningful event order. Subagent children render no bubble of their own
    // (their activity already shows through the spawning conversation's
    // bubble/display, and the bubble buttons navigate to GUI sessions, which
    // subagents are not). Sessions whose own machine has settled (no bubble
    // copy) drop out, so a finished turn does not leave a stale bubble behind.
    const sessions: PetSessionView[] = []
    for (const [session, activity] of [...this.sessionActivity.entries()].reverse()) {
      if (sessions.length >= MAX_SESSION_BUBBLES) break
      if (session.header?.origin === 'subagent') continue
      const perSession = activity.machine.render()
      if (perSession.bubble === undefined) continue
      // Each session's whisper rides its own bubble while fresh; an expired
      // whisper simply stops appearing (the client's 2 s poll drops it).
      const whisper = activity.whisper
      const freshWhisper = whisper !== undefined && Date.now() - whisper.at < WHISPER_TTL_MS
        ? whisper.text
        : undefined
      sessions.push({
        sessionId: String(session.id),
        animation: perSession.animation,
        bubble: perSession.bubble,
        phase: perSession.phase,
        ...(freshWhisper === undefined ? {} : { whisper: freshWhisper }),
      })
    }
    // The browser half reports the session the user is currently on; that
    // session's bubble leads the stack (its whisper then speaks on the
    // collapsed single bubble). An unreported or absent session keeps the
    // legacy most-recent-first order.
    if (currentSessionId !== undefined) {
      const index = sessions.findIndex(session => session.sessionId === currentSessionId)
      if (index > 0) sessions.unshift(sessions.splice(index, 1)[0]!)
    }
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:465-507](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L465-L507)

可见性和轮询间隔让短活动成为重要反例。

<details>
<summary>查看原文（43行）</summary>

```text
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
      }, 'pet: poll')

      // A current-session switch should re-order the bubble stack right away,
      // not on the next 2s tick. Poll only while the tab is visible, as the
      // poll loop itself does.
      const disposeSessionWatch = ctx.effect(() => {
        const unsubscribe = sessions.list.subscribe(() => {
          if (document.visibilityState === 'visible') pollNow()
        })
        return unsubscribe
      }, 'pet: current-session watch')
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:509-515](https://github.com/zhu1090093659/dsh-pet/blob/4def8a84622304da67c750fd35dfdb3a2aac7c69/src/client/index.ts#L509-L515)

入口可回到尚存在的目标会话。

```text
      const openSession = (sessionId: string): void => {
        const list = sessions.list.getSnapshot()
        if ((list.byId as any)[sessionId] === undefined) return
        // Navigation belongs to the workspace UI since the multi-instance Client
        // Session model; the Session Controller no longer opens one.
        ctx.uiWorkspace.openSession(sessionId as never)
      }
```

#### 缺口

- 尚无受控用户结果。
  **影响**：减少回查时间和误归属只是推演。
  **进一步探讨**：用同一事件记录做原生列表与浮层的随机对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
