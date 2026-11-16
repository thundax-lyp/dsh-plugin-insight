# dsh-session-notification

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[005dfd7](https://github.com/dingyi222666/dsh-session-notification/tree/005dfd7b355cab3cc0924a18acca783d8a7d0a6a)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingyi222666/dsh-session-notification) [![npm 30d 3,134](https://img.shields.io/static/v1?label=npm+30d&message=3%2C134&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dingyi222666/dsh-session-notification) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dingyi222666/dsh-session-notification)
<!-- END META -->

> **功能**：为 DSH Web 会话结束、失败、提问和授权请求提供通知。

> **亮点**：[Q01](#research-q01) 将完成、失败、提问和授权提示集成进 DSH Web 设置及会话客户端。[Q02](#research-q02) 对运行结束做延迟分类，并为子 agent 等待和标签页提示提供策略。

> **主要限制**：[Q02](#research-q02) 分类依赖宿主状态快照和 settle 逻辑；[Q03](#research-q03) 系统通知、跨标签去重及浏览器存储均依赖客户端能力，未运行验证。

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
  - [Q01 · 通知面向什么任务，四类状态覆盖了什么事件？](#detail-section-11)
  - [Q02 · 插件怎样从会话事件分类并避免重复提示？](#detail-section-12)
  - [Q03 · 通知权限、偏好持久化和跨标签协调有哪些条件与失效边界？](#detail-section-13)
  - [Q04 · 什么小范围试用能检验通知是否有用，何时应停用？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要监看多个 DSH Web 会话或离开当前标签页的使用者，希望及时发现完成、失败以及等待人工操作的会话。

手动查看 DSH 标签页和会话状态；本轮没有与系统原生通知或其他监视方案做可靠性/节时对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 结束与失败提示 | 离开当前会话时仍能看到已结束或失败 | 依赖实际宿主状态与延迟复核 |
| 提问与授权提示 | 提醒用户返回仍等待人工动作的会话 | 需要宿主提供 pending interaction 状态 |
| 标签页协调 | 尝试让同一浏览器中的可见标签优先提示 | 依赖 BroadcastChannel，缺少时可能重复 |
| 声音和系统通知 | 配置音量、每类提示及浏览器通知 | 浏览器权限与后台策略分别约束 |

**流程与依赖**

| 依赖或条件 | 是否必需 | 用途及失败边界 |
| --- | --- | --- |
| 兼容 DSH Web 的 sessions 与 uiSession | 事件判断需要 | 读取会话状态和等待处理的交互，宿主状态或接口不完整时分类可能缺失 |
| 宿主客户端 slots | 设置界面需要 | 注册通知设置区，缺少相应插槽时不能依赖面板配置 |
| 浏览器 Notification 与授权 | 仅系统通知需要 | 未授权或 API 缺少时无法显示系统通知 |
| Web Audio、localStorage、BroadcastChannel | 分别影响声音、偏好与协调 | 声音可能被拦，偏好写失败或跨标签竞争时需人工看会话列表 |

| 阶段 | 操作 | 验收或退回 |
| --- | --- | --- |
| 启用 | 在测试 Web profile 安装并开两个会话，保持系统通知关闭 | 先核对设置及页面内可见状态，初次载入不为旧状态报警 |
| 对照 | 用已标记的完成、失败、提问、待授权和暂停事件核对四类提示 | 发现缺少待授权、误报完成或重复提示即回会话列表 |
| 扩展与退出 | 需要时再试浏览器授权、两个标签和自定义声音；停用插件 | 核对撤掉通知并注意浏览器本地偏好仍可能保留 |

**效果与成本**

| 阶段 | 资源与人工投入 | 未验证 |
| --- | --- | --- |
| 首次 | 准备兼容 Web profile、配置通知范围及浏览器权限 | 安装和授权用时 |
| 持续 | 浏览器监听状态及tab协调，用户仍处理会话交互 | 后台资源、漏报或打扰频率 |
| 失败与退出 | 回看会话列表，按需停用声音与系统授权及管理本地偏好 | 睡眠后恢复、停用后偏好保留范围 |

| 效果 | 固定源码支持 | 尚不能确定 |
| --- | --- | --- |
| 任务状态提示 | 对比运行边沿并分派完成、失败或等待交互 | 真实状态的漏报率和暂停误报率 |
| 减少跨标签重复 | 优先可见标签声明事件，没有通道时各标签各自响应 | 浏览器后台节流、竞争和重复率 |

> **思考**：[Q02](#research-q02) 分类依赖宿主状态快照和 settle 逻辑；[Q03](#research-q03) 系统通知、跨标签去重及浏览器存储均依赖客户端能力，未运行验证。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将完成、失败、提问和授权提示集成进 DSH Web 设置及会话客户端。[Q02](#research-q02) 对运行结束做延迟分类，并为子 agent 等待和标签页提示提供策略。

客户端先给已存在的会话快照建立基线，以免页面加载即报警。完成提示先等待宿主状态稳定，并在选定范围下考虑仍运行的子代理或待续任务。标签协调按会话和事件类型认领，通道不可用时回到各标签独立处理，不能保证全局只通知一次。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 分类依赖宿主状态快照和 settle 逻辑；[Q03](#research-q03) 系统通知、跨标签去重及浏览器存储均依赖客户端能力，未运行验证。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 对需要多会话提醒的人有明确目标；[Q02](#research-q02) 与 [Q03](#research-q03) 的事件分类和浏览器依赖未运行核验。先在测试 profile 用已知事件验证无重复漏报，若权限、通知可达或分类不可靠则关闭提醒并回到会话列表。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认 DSH Web client 注入、会话/交互事件分类、浏览器通知及本地偏好设置。没有执行构建或宿主验收，事件正确率、通知可达率、跨标签去重和节省时间均未知。

- 已检查：作者 README、包清单、源码路径 package.json、README.md、src/client/notification-service.ts、src/client/index.ts、src/client/local-settings.ts、src/client/browser-notify.ts、src/client/tab-coordinator.ts、src/settings.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：阅读固定提交 README、package.json、lib/index.js 和 lib/client.js；核对 DSH bundle/client 接入、历史回填、live fold、KV 别名、余额子进程和 HTTP 路由。未执行安装、测试、宿主验收、外部 API 请求或计时。
- 下一步：用两个测试会话和两个标签，分别制造正常结束、失败、等待回答、授权和仍有待处理工作的暂停，记录出现次数、分类、可见延迟。分开检验声音、系统通知授权、停用以及无通道时的行为。

**分析版本**

- **仓库**：[dingyi222666/dsh-session-notification](https://github.com/dingyi222666/dsh-session-notification)
- **版本号**：0.2.8（[固定提交 005dfd7](https://github.com/dingyi222666/dsh-session-notification/tree/005dfd7b355cab3cc0924a18acca783d8a7d0a6a)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 若正确提示减少用户轮询会话的次数而不过度重复，可能改善多会话监看；当前尚无任务频率或误报数据。

用两个测试会话和两个标签，分别制造正常结束、失败、等待回答、授权和仍有待处理工作的暂停，记录出现次数、分类、可见延迟。分开检验声音、系统通知授权、停用以及无通道时的行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 222 | — | — | 3883 |
| .ts | source | 18 | 2874 | 1926 | 767 | — |
| .mjs | source | 1 | 57 | 42 | 9 | — |
| .tsx | source | 1 | 455 | 374 | 61 | — |
| .ts | test | 8 | 1444 | 1215 | 77 | — |
| .tsx | test | 2 | 311 | 260 | 22 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-16），可前往 [GitHub Issues](https://github.com/dingyi222666/dsh-session-notification/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本如何将 DSH Web 会话与待处理交互变成通知，分类、权限及偏好持久化的边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 通知面向什么任务，四类状态覆盖了什么事件？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它适合同时运行多个 DSH Web 会话、切换标签或离开浏览器时仍想知道任务是否结束、失败或等待人工输入的人。插件监听 session running 状态和 pending interaction；通知类型为 completed、failed、question、permission。比轮询标签页更直接，但并不替用户处理问题或授权，也不覆盖后台通知一定可达。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-8](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/README.md#L7-L8)

作者说明网页端会话结束、错误、提问和权限请求时提供提示。

```text
A notification plugin for the dsh web GUI. When a session finishes, hits an error, asks you a question, or needs your permission, you get a heads-up: a sound plays, and when you step away from the tab a system notification keeps you in the loop.

```

**依据 2 · 作者声明**：[README.md:30-40](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/README.md#L30-L40)

文档列出四种事件和默认提示。

<details>
<summary>查看原文（11行）</summary>

```text
## The four notification kinds

| Kind | When it fires | Default sound |
| --- | --- | --- |
| Session completed | A turn ends normally (`turn/end` completed) | chime |
| Session failed | A turn breaks with an error, or the host reports an agent error | fault |
| Question asked | The agent is waiting for your answer (`question/requested`) | pop |
| Permission requested | The agent requests an authorized operation (`approval/requested`) | alert |

Each kind can be enabled or disabled and reassigned to any of the four built-in sound effects (or muted). The four sounds are synthesized with Web Audio — no audio files are shipped — and the master volume is adjustable with the official-style slider (0–100%). A fixed loudness boost (~+6 dB) with a soft limiter on the playback chain makes every sound noticeably louder without distortion; custom audio feeds the same chain. The shared AudioContext is suspended as soon as playback is over and resumed by the next sound, so an idle notification never keeps the system audio stream (or a macOS sleep assertion) open.

```

</details>

**依据 3 · 源码核查**：[package.json:30-45](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/package.json#L30-L45)

包声明 bundle 与 web client 接线。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-session"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[src/client/index.ts:337-345](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/index.ts#L337-L345)

客户端将 Notifications 设置节注册到宿主 slots。

```text
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'notifications',
    order: 40,
    label: () => t('nav'),
    store,
    locale: NS,
    inject: injected,
  }, NotificationsSection))
```

#### 缺口

- 本轮未运行目标 DSH 宿主或真实浏览器，也没有用户任务记录。
  **影响**：不能确认接口兼容、事件准确率、跨标签重复率或实际节省。
  **进一步探讨**：在隔离 profile 对已知事件序列测试完成/失败/问题/授权，比较前后台标签、拒绝权限及重载后的通知和偏好。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 插件怎样从会话事件分类并避免重复提示？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端先对现有 session 列表建立基线，避免刚加载页面就为旧状态报警；running 从 true 变 false 后等待 settle，再对比本轮前后的错误序号和 agent 错误文本，区分完成与失败。pendingInteraction 的 key 或类型改变时触发提问/权限事件。main-wait 模式会等子 agent 全部结束再发完成提示；跨标签页 coordinator 争取让可见标签优先领到事件。若宿主服务不可用、状态快照尚未加载或跨标签通道不支持，源码不能保证分类/去重结果。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/notification-service.ts:116-121](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/notification-service.ts#L116-L121)

Engine 的状态边沿与 pending interaction 分类定义。

```text
/**
 * Classifies session lifecycle edges into notification events. Running
 * true→false transitions arm a classification (completed vs failed) after the
 * settle window; a pending-interaction arrival raises the question/permission
 * kinds (observed through the uiSession pending map). A session that was
 * already idle when observation started raises nothing.
```

**依据 2 · 源码核查**：[src/client/notification-service.ts:198-204](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/notification-service.ts#L198-L204)

只对 running 状态转换作判断。

```text
      const prevRunning = this.prevRunning.get(id) ?? false
      if (prevRunning && !summary.running) {
        void this.settleRun(id)
      } else if (!prevRunning && summary.running) {
        this.armRun(id)
      }
      this.prevRunning.set(id, summary.running)
```

**依据 3 · 源码核查**：[src/client/notification-service.ts:267-314](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/notification-service.ts#L267-L314)

settle、错误比较、子 agent 等待和派发逻辑。

<details>
<summary>查看原文（48行）</summary>

```text
  /** Classify a finished run after the settle window (completed vs failed). */
  private async settleRun(id: SessionId): Promise<void> {
    const run = this.runs.get(id)
    if (run === undefined || this.settling.has(id)) return
    this.runs.delete(id)
    this.settling.add(id)
    try {
      await this.ports.settle()
      // A newer run armed while settling will classify itself; skip the stale one.
      if (this.runs.has(id)) return
      // The filter may have changed while settling (e.g. main-only re-enabled):
      // never emit for a session that is now silenced.
      if (this.silenced(id)) {
        this.prevRunning.delete(id)
        return
      }
      // A session the user never opened has no loaded history, so its chat
      // view holds no nodes yet; materialize it best-effort before reading.
      try {
        await this.ports.ensureDetail?.(id)
      } catch {
        // Best effort only: classify from whatever snapshot reads exist.
      }
      const detail = this.ports.detailOf(id)
      const failed = detail !== undefined && (
        detail.maxTurnErrorSeq > run.baselineErrorSeq ||
        (detail.lastAgentError !== null && detail.lastAgentError !== run.baselineAgentError)
      )
      const message = failed
        ? (detail?.failureMessage ?? detail?.lastAgentError ?? '')
        : (detail?.finalText ?? '')
      if (failed) {
        // A failure is actionable now: never hold it behind subagents.
        this.heldCompletions.delete(id)
        this.ports.emit({ kind: 'failed', sessionId: id, title: this.label(id, detail), detail: message })
        return
      }
      // The host resumes the session by itself: this idle edge is a pause, and
      // the continuation's own end classifies instead. Never hold the notice —
      // a superseded run has nothing left to announce.
      if (this.ports.hasUnfinishedWork?.(id) === true) return
      // Hold the completion while descendants still run: the session only
      // paused between subagent waves, so alert when the whole fan-out ends.
      if (this.waitsFor(id)) {
        this.heldCompletions.set(id, message)
        return
      }
      this.ports.emit({ kind: 'completed', sessionId: id, title: this.label(id, detail), detail: message })
```

</details>

**依据 4 · 源码核查**：[src/client/notification-service.ts:239-253](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/notification-service.ts#L239-L253)

pending key 变化触发问题/权限通知。

<details>
<summary>查看原文（15行）</summary>

```text
  observePending(pending: ReadonlyMap<SessionId, PendingFacts>): void {
    for (const [id, facts] of pending) {
      if (this.silenced(id)) {
        this.pendingKeys.delete(id)
        continue
      }
      const prevKey = this.pendingKeys.get(id)
      if (prevKey === undefined || prevKey !== facts.key) {
        this.raise(facts.kind, id, facts.detail)
      }
      this.pendingKeys.set(id, facts.key)
    }
    for (const id of this.pendingKeys.keys()) {
      if (!pending.has(id)) this.pendingKeys.delete(id)
    }
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:233-239](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/index.ts#L233-L239)

标签页 coordinator 对同一事件做 claim。

```text
    emit: (event) => {
      // One tab wins the event (a visible tab ahead of a background one); the
      // others stay silent for it. Without BroadcastChannel every tab claims
      // its own event, i.e. the pre-coordination behavior.
      void coordinator.claim(`${event.sessionId}:${event.kind}`).then((owned) => {
        if (owned) dispatcher.dispatch(event)
      })
```

#### 缺口

- 本轮未运行目标 DSH 宿主或真实浏览器，也没有用户任务记录。
  **影响**：不能确认接口兼容、事件准确率、跨标签重复率或实际节省。
  **进一步探讨**：在隔离 profile 对已知事件序列测试完成/失败/问题/授权，比较前后台标签、拒绝权限及重载后的通知和偏好。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 通知权限、偏好持久化和跨标签协调有哪些条件与失效边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、效果与总成本

#### 完整回答

需要 DSH Web 的 sessions、uiSession、conversation 和 slots API；浏览器通知还依赖用户授予 Notification permission，声音依赖 Web Audio 和页面权限。用户偏好由插件在 localStorage 保存，储存不可用时退化为当前页面内存；storage 事件用于跨标签同步，但设置写入异常被吞掉，因此偏好未必持久。浏览器通知 API 不可用时包装器退化为空操作；没有 BroadcastChannel 时每个标签页各自 claim，可能重复。声音偏好、音量和每类开关可调整，但跨设备同步、睡眠后恢复及浏览器策略效果未在本轮运行验证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:30-45](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/package.json#L30-L45)

依赖 client renderer/locale/settings 和 Web 会话 API，并声明 web platform。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-session"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[src/client/local-settings.ts:31-48](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/local-settings.ts#L31-L48)

浏览器 storage 失败或 JSON 无效退化处理。

<details>
<summary>查看原文（18行）</summary>

```text
/** Read the browser storage when present (absent in Node/SSR). */
function storage(): Storage | undefined {
  try {
    return typeof localStorage === 'undefined' ? undefined : localStorage
  } catch {
    // Access denied (e.g. privacy mode) — the scope still works in memory.
    return undefined
  }
}

/** Parse one stored section; anything malformed resolves to the defaults. */
function parseStored(raw: string | null): unknown {
  if (raw === null) return undefined
  try {
    return JSON.parse(raw) as unknown
  } catch {
    return undefined
  }
```

</details>

**依据 3 · 源码核查**：[src/client/local-settings.ts:76-95](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/local-settings.ts#L76-L95)

localStorage 写入及 storage 事件跨标签同步。

<details>
<summary>查看原文（20行）</summary>

```text
  const commit = (next: NotificationSettings, persist: boolean): void => {
    value = next
    revision += 1
    if (persist) {
      try {
        storage()?.setItem(LOCAL_STORAGE_KEY, JSON.stringify(next))
      } catch {
        // Quota/access errors keep the in-memory value; nothing else to do.
      }
    }
    notify()
  }

  // Writes from other tabs arrive through the browser storage event, keeping
  // the "sync across tabs" behavior the host-document path used to provide.
  if (typeof window !== 'undefined') {
    window.addEventListener('storage', (event) => {
      if (event.key !== LOCAL_STORAGE_KEY) return
      commit(resolveNotificationSettings(parseStored(event.newValue)), false)
    })
```

</details>

**依据 4 · 源码核查**：[src/client/browser-notify.ts:1-18](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/browser-notify.ts#L1-L18)

Notification wrapper 声明不支持环境无声退化。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Browser `Notification` API wrapper. Every call is guarded so non-browser
 * or permission-less environments degrade to a no-op instead of throwing.
 */

/** Notification permission state, with `unsupported` for non-browser runs. */
export type BrowserPermission = 'granted' | 'denied' | 'default' | 'unsupported'

/**
 * Notification options carrying the spec's `renotify`, which the DOM lib
 * typings do not declare yet. With a `tag` set, `renotify: true` re-alerts
 * when a same-tag notification is replaced; without it, Windows/Chromium
 * swap the card in the action centre silently and no banner replays.
 */
interface RenotifyOptions extends NotificationOptions {
  renotify?: boolean
}

```

</details>

**依据 5 · 源码核查**：[src/client/tab-coordinator.ts:93-110](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/tab-coordinator.ts#L93-L110)

协调窗口和 BroadcastChannel 可配置。

<details>
<summary>查看原文（18行）</summary>

```text
export function createTabCoordinator(options: TabCoordinatorOptions = {}): TabCoordinator {
  const arbitrationMs = options.arbitrationMs ?? DEFAULT_ARBITRATION_MS
  const visibleGraceMs = options.visibleGraceMs ?? DEFAULT_VISIBLE_GRACE_MS
  const dedupeWindowMs = options.dedupeWindowMs ?? DEFAULT_DEDUPE_WINDOW_MS
  const now = options.now ?? ((): number => Date.now())
  const visible = options.visible ?? defaultVisible
  const tabId = options.tabId ?? `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  const channel = options.channel === undefined ? defaultChannel() : (options.channel ?? undefined)

  const recent = new Map<string, number>()
  const rivals = new Map<string, { at: number; tabId: string }>()
  const wins = new Set<string>()

  /** Earlier claim wins; equal timestamps fall back to the tab id. */
  const beats = (a: { at: number; tabId: string }, b: { at: number; tabId: string }): boolean =>
    a.at < b.at || (a.at === b.at && a.tabId < b.tabId)

  const onMessage = (event: { data: unknown }): void => {
```

</details>

#### 缺口

- 本轮未运行目标 DSH 宿主或真实浏览器，也没有用户任务记录。
  **影响**：不能确认接口兼容、事件准确率、跨标签重复率或实际节省。
  **进一步探讨**：在隔离 profile 对已知事件序列测试完成/失败/问题/授权，比较前后台标签、拒绝权限及重载后的通知和偏好。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么小范围试用能检验通知是否有用，何时应停用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

适合在多个测试会话并行、经常离开当前标签页的用户；可先只启用一个测试 profile，用人工标记的完成、失败和等待授权事件对照提示是否正确、是否重复及可见延迟，再决定是否开启系统通知和自定义声音。若通知漏掉待授权事件、把暂停报成完成、不同标签重复提示，或偏好在重载后丢失，应先关闭浏览器通知并回到 DSH 会话列表人工查看。频次、节省的切换时间、浏览器通知可靠率均未测。

#### 证据与依据

**依据 1 · 源码核查**：[src/settings.ts:11-35](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/settings.ts#L11-L35)

四种通知和当前会话/子 agent 范围模式。

<details>
<summary>查看原文（25行）</summary>

```text
/** The four notification kinds the plugin can raise. */
export const NOTIFICATION_TYPES = ['completed', 'failed', 'question', 'permission'] as const

/** One selectable notification kind. */
export type NotificationType = typeof NOTIFICATION_TYPES[number]

/**
 * When the currently active (viewed) session alerts:
 * - `hidden`: only when the tab is backgrounded or the window minimized (default);
 * - `unfocused`: also alerts when focus switches to another application (even if still on screen);
 * - `always`: always alerts, even while actively viewing the foreground session.
 */
export const CURRENT_NOTIFICATION_MODES = ['hidden', 'unfocused', 'always'] as const

/** One current-session notification mode. */
export type CurrentNotificationMode = typeof CURRENT_NOTIFICATION_MODES[number]

/**
 * Which sessions alert, and whether a main session waits for its subagents:
 * - `all`: every session alerts, including subagents;
 * - `main`: only the main session alerts, as soon as it goes idle;
 * - `main-wait`: only the main session alerts, held until every subagent it
 *   spawned has finished (the fan-out, not a pause between waves).
 */
export const NOTIFICATION_MODES = ['all', 'main', 'main-wait'] as const
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:303-327](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/src/client/index.ts#L303-L327)

授权请求、声音/通知测试操作。

<details>
<summary>查看原文（25行）</summary>

```text
      setBrowserEnabled: async (enabled) => {
        if (enabled) {
          let permission = browserPermission()
          if (permission === 'default') {
            permission = await requestBrowserPermission()
            bound?.setPermission(permission)
          }
          if (permission !== 'granted') return
        }
        persist('browserEnabled', enabled)
      },
      setCurrentNotificationMode: (mode) => { persist('currentNotificationMode', mode) },
      setNotificationMode: (mode) => { persist('notificationMode', mode) },
      setSoundEnabled: (enabled) => { persist('soundEnabled', enabled) },
      setVolume: (volume) => { persist('volume', Math.min(1, Math.max(0, volume))) },
      setType: (kind, patch) => { persistType(kind, patch) },
      testSound: (sound, customUrl) => { playEffective(sound, customUrl) },
      requestPermission: async () => {
        bound?.setPermission(await requestBrowserPermission())
      },
      testBrowserNotification: () => {
        showBrowserNotification(t('test.notification.title'), t('test.notification.body'), `${NOTIFICATION_TAG_PREFIX}:test`)
      },
      uploadCustomSound: async (kind, file) => {
        if (file.size > MAX_CUSTOM_AUDIO_BYTES) return
```

</details>

**依据 3 · 作者声明**：[README.md:36-46](https://github.com/dingyi222666/dsh-session-notification/blob/005dfd7b355cab3cc0924a18acca783d8a7d0a6a/README.md#L36-L46)

浏览器通知、音量和自定义声音的作者说明。

<details>
<summary>查看原文（11行）</summary>

```text
| Question asked | The agent is waiting for your answer (`question/requested`) | pop |
| Permission requested | The agent requests an authorized operation (`approval/requested`) | alert |

Each kind can be enabled or disabled and reassigned to any of the four built-in sound effects (or muted). The four sounds are synthesized with Web Audio — no audio files are shipped — and the master volume is adjustable with the official-style slider (0–100%). A fixed loudness boost (~+6 dB) with a soft limiter on the playback chain makes every sound noticeably louder without distortion; custom audio feeds the same chain. The shared AudioContext is suspended as soon as playback is over and resumed by the next sound, so an idle notification never keeps the system audio stream (or a macOS sleep assertion) open.

## Custom audio

Beyond the four built-in sounds, each kind accepts **your own audio file** (mp3/ogg/wav, up to 1 MB): pick Custom audio on a kind's row to upload one, and it replaces the built-in for that kind — with a Replace and remove affordance, plus the Custom audio in use tag. Custom files are stored browser-locally (they are device media, not shared preferences).

## Browser notifications & the quiet default

```

</details>

#### 缺口

- 本轮未运行目标 DSH 宿主或真实浏览器，也没有用户任务记录。
  **影响**：不能确认接口兼容、事件准确率、跨标签重复率或实际节省。
  **进一步探讨**：在隔离 profile 对已知事件序列测试完成/失败/问题/授权，比较前后台标签、拒绝权限及重载后的通知和偏好。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
