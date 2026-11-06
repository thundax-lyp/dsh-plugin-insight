# DeepSeek Pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b9b61a3](https://github.com/keleus/deepseek-pet/tree/b9b61a35c3b2443ecdeab0ed442d6b33c603d343)

<!-- BEGIN META -->
[![GitHub ★ 60](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=60&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/keleus/deepseek-pet)
<!-- END META -->

> **功能**：在 DSH 网页中显示随会话和工具状态变化的桌宠表情、气泡及活跃会话入口。

> **亮点**：贡献是把分散客户端状态重组为陪伴式展示，并按累计时长稳定切换完整图；价值在感知与偏好，净效率未测，见 [Q01](#research-q01)和 [Q02](#research-q02)。

> **主要限制**：README称气泡可批准/作答，但当前实现只有回原会话提醒；完成由running边沿推导，图片能力也写死，不能用表情替代任务验收，见 [Q03](#research-q03)。

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
  - [Q01 · 谁需要状态桌宠、实际类型与增量是什么？](#detail-section-11)
  - [Q02 · 三类宿主状态如何合成？](#detail-section-12)
  - [Q03 · 表情和批准文案能证明什么？](#detail-section-13)
  - [Q04 · 持续成本与适合的试用是什么？](#detail-section-14)
  - [Q05 · 什么改进值得验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢陪伴表达、同时关注多会话的Web用户可从表情和会话条观察已有状态；须回原任务核实结果与批准，见 [Q01](#research-q01)。

原会话列表、聊天状态和批准界面已完成任务控制。桌宠增加视觉表达/导航，不执行任务或增强模型。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态桌宠 | 表情/气泡感知会话活动 | 启发式，非交付验收 |
| 会话导航 | 找到聚焦/执行/等待会话 | 原任务完成批准，非气泡批准 |
| 展示设置 | 动作/位置/大小与页内置顶 | 同源保存，可能遮挡弹窗 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容DSH Web、slots/sessions及React | 展示必需 | overlay及订阅 | 包声明非加载验收 |
| uiConversation/uiSession | 完整提示条件 | 正文/工具/等待 | 降级空值可能难分无状态与缺来源 |
| uiWorkspace | 导航条件 | 打开原会话 | 缺服务可无动作 |
| 浏览器localStorage | 记住设置可选 | 位置/动作/模式 | 失败会不持久，非跨设备 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 匹配宿主版本，保留原会话UI | 不依赖批准承诺 |
| 展示试用 | 默认模式核已知运行/等待/图片状态 | 和原会话核对 |
| 定制 | 调动作/位置与模式 | 页内置顶不遮挡操作 |
| 退出 | 最小化或停插件 | 任务仍由原UI管理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装/构建资源未知 | 客户端API匹配 | 未宿主验收 |
| 持续 | 图片/订阅/定时渲染，量未知 | 注意力与状态核对 | 无专用模型调用不等于零成本 |
| 失败恢复 | 重载/重绑资源未知 | 识别缺服务与错误提示 | 可回原UI |
| 退出 | 同源配置残留量未知 | 最小化/停用 | 不取消原任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 陪伴展示 | 状态到表情/气泡映射 | 情绪价值和注意力收益 |
| 多会话入口 | 点击原会话 | 漏待办是否减少 |
| 任务判断 | 读取部分原状态 | 表情不是结果/能力验收 |

> **思考**：README称气泡可批准/作答，但当前实现只有回原会话提醒；完成由running边沿推导，图片能力也写死，不能用表情替代任务验收，见 [Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：贡献是把分散客户端状态重组为陪伴式展示，并按累计时长稳定切换完整图；价值在感知与偏好，净效率未测，见 [Q01](#research-q01)和 [Q02](#research-q02)。

三来源合成与订阅撤销、稳定轮换值得参考。空值降级需区分来源：chat可随新binding重取，uiSession statuses只在bridge创建时绑定，binding换代不能补回，状态文案不能冒充结果或模型能力，见 [Q02](#research-q02)与 [Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

README称气泡可批准/作答，但当前实现只有回原会话提醒；完成由running边沿推导，图片能力也写死，不能用表情替代任务验收，见 [Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

喜欢桌宠者先默认页内模式核已知状态，等待批准回原任务处理。遮挡、分心或状态误导时最小化/停用，保留原会话UI；不把气泡当批准或验收入口，见 [Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

Web状态展示/导航和本地设置有源码支持；直接批准主张不受当前接线支持。宿主/性能/陪伴效果未测，假设未验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/DeepSeekPet.jsx、src/client/index.jsx、src/client/pet-display.js、src/client/pet-reactions.js、src/client/pet-session.js、src/client/pet-state.js、src/host/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对Host/client入口、会话bridge、状态机、实际JSX气泡/导航、显示模式与动作保存。未逐图审资产、全部动画/样式和宿主实现；未运行构建或目标。
- 下一步：- 固定源码与README检查。
- 未安装/启动宿主、测试性能或用户效果。
- 当前界面不含README所称直接批准控件；状态语义限制为静态核查。
- 缺服务恢复需区分chat新binding重取与uiSession仅bridge创建时绑定；宿主时序未复现。

**分析版本**

- **仓库**：[keleus/deepseek-pet](https://github.com/keleus/deepseek-pet)
- **版本号**：0.2.1（[固定提交 b9b61a3](https://github.com/keleus/deepseek-pet/tree/b9b61a35c3b2443ecdeab0ed442d6b33c603d343)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是区分来源缺失、宿主事实与情绪文案，避免未知能力或停止运行被说成事实成功；须比较误读与干扰，见 [Q05](#research-q05)。

- 固定源码与README检查。
- 未安装/启动宿主、测试性能或用户效果。
- 当前界面不含README所称直接批准控件；状态语义限制为静态核查。
- 缺服务恢复需区分chat新binding重取与uiSession仅bridge创建时绑定；宿主时序未复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 11 | 1009 | 771 | 181 | — |
| .md | source | 1 | 169 | — | — | 1627 |
| .mjs | source | 2 | 68 | 60 | 1 | — |
| .jsx | source | 3 | 709 | 632 | 28 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/keleus/deepseek-pet/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/keleus/deepseek-pet/issues?q=is%3Aissue+created%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/keleus/deepseek-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T03%3A54%3A04.696Z..2026-11-06T03%3A54%3A04.696Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：桌宠如何把会话状态变成可理解的陪伴提示，是否会误导任务/批准判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要状态桌宠、实际类型与增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是DSH原生插件，Host apply为空，实际行为由声明的Web client与shell.overlay/settings.section注册完成；不是系统桌面独立宠物、Live2D骨骼模型或额外Agent。面向喜欢陪伴表达、希望同时感知聚焦与后台会话的Web用户。原办法是查看会话列表和聊天状态，新增的是把已有事实映射到表情、气泡和可点击会话条，不提高模型推理或工具执行能力。

合格结果是表情不遮挡主要操作、提醒与原任务状态一致、可回原会话核实。完整图切换与累计时长轮换降低部件错位/重渲染跳图，是展示取舍；用户若不喜欢动画或只做单会话任务，原UI可能更清楚。作者称可在气泡批准工具/回答问题，但当前实现需另核，不能直接列正向能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:8-29](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/package.json#L8-L29)

Host/client声明。

<details>
<summary>查看原文（22行）</summary>

```text
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-session",
        "@deepseek-ai/dsh-client-ui-workspace",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[src/host/index.js:1-5](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/host/index.js#L1-L5)

Host为空。

```text
/**
 * Host half of the DeepSeek Pet Web surface. The browser half is discovered from
 * package.json's dsh.client declaration and owns all visible behavior.
 */
export function apply() {}
```

**依据 3 · 源码核查**：[src/client/index.jsx:6-31](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/index.jsx#L6-L31)

overlay与设置注册。

<details>
<summary>查看原文（26行）</summary>

```text
export const inject = ['slots', 'sessions']

/** Register the pet as an additive, frame-wide Harness Web overlay. */
export function apply(ctx) {
  ctx.effect(installStyles, 'ui-live2d: styles')
  const bridge = createSessionBridge(ctx)

  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'deepseek-pet',
    order: 90,
    label: 'DeepSeek Pet 插件',
    inject: () => ({
      resolveSession: sessionId => bridge.view(sessionId),
      openSession: sessionId => bridge.open(sessionId),
      statusSource: bridge.statuses,
    }),
  }, DeepSeekPetEntry))

  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: 'deepseek-pet',
    order: 90,
    label: '桌宠设置',
  }, DeepSeekPetSettings))
}
```

</details>

**依据 4 · 作者声明**：[README.md:3-18](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/README.md#L3-L18)

作者定位与直接交互主张。

<details>
<summary>查看原文（16行）</summary>

```text
DeepSeek Pet 是一个嵌入 DeepSeek Harness 网页的交互式桌宠插件。它会跟随当前任务、
工具调用、上下文占用和活跃会话自动切换 DeepSeek 表情，并通过呼吸、弹跳、倾斜、
视差和淡入动画呈现 Live2D 风格效果。

角色使用完整表情图切换，不拆分头部、手脚或五官图层，避免部件错位和表情突变。

<img src="./docs/deepseek-pet-preview.png" alt="DeepSeek Pet 网页内运行效果" width="560">

## 功能

- 角色上方用与 Pet 等宽的气泡轮播状态短句，并以单行横向打字机效果跟随最新输出；无任务活动时 10 秒后自动隐藏；
- 角色下方用横条显示聚焦会话并以亮边标记，正在执行的会话向下排列，超过三个时自动层叠收起；
- 多个会话并行执行时进入“忙疯了”状态；
- 根据分析、回答、编码、网络搜索、子 Agent、完成和失败等场景切换表情；回答阶段轮换敲电脑、思考和认真核对等工作形象，思考阶段轮换不同状态标签；
- 工具等待批准时，可直接在气泡中允许或拒绝；
- 用户问题支持选项、自定义输入、提交和拒绝；
```

</details>

#### 缺口

- 没有陪伴价值和注意力成本的真实用户对照。
  **影响**：不能确认表情更易读或值得持续开启。
  **进一步探讨**：在同样多会话任务比较漏等候、干扰和主动保留率。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 三类宿主状态如何合成？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

桥接读取sessions生命周期、uiConversation chat target的legacy正文/工具和uiSession pendingInteraction，再合成供React订阅的统一快照；聚焦会话按retainedBy.mainView，点击调用uiWorkspace.openSession。createSessionView按三个输入对象身份缓存，订阅分别撤销，保留正文/等待与生命周期分工。缺uiConversation时正文变空，缺uiSession时只剩running回退，能降级显示，但缺失与“没有等待/正文”可能难区分。

bridge按sessionId缓存view，binding对象换代才重建并重新取得chat。uiSession的statuses则仅在createSessionBridge创建时绑定一次；即使会话binding换代也不重新取得uiSession，创建时缺席就持续使用空状态源，通常需重建bridge才能恢复。chat若晚到且binding未变也不会重取。宿主是否出现这些服务时序未运行复现。显示依兼容DSH客户端服务与共享React，不能只按版本声明保证所有分支可用。该桥接不自行调用模型或批准API，点击会话是导航。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/pet-session.js:127-162](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-session.js#L127-L162)

三面合成与chat可选。

<details>
<summary>查看原文（36行）</summary>

```text
export function mergePetSnapshot(base, legacy, status) {
  const lifecycle = base ?? {}
  const conversation = legacy ?? {}
  const interaction = status?.pendingInteraction
  return {
    ...lifecycle,
    running: status?.running ?? lifecycle.running ?? false,
    pendingInteraction: interaction ?? null,
    pending: interaction === undefined || interaction === null ? [] : [interaction],
    nodes: Array.isArray(conversation.nodes) ? conversation.nodes : [],
    partial: conversation.partial ?? null,
    runningCalls: Array.isArray(conversation.runningCalls) ? conversation.runningCalls : [],
    queue: pendingSubmissionQueue(lifecycle),
  }
}

/** Resolve the conversation `chat` target source, or undefined while it cannot be bound. */
function chatSource(ctx, sessionId) {
  const conversation = optionalService(ctx, 'uiConversation')
  if (conversation === undefined || typeof conversation.binding !== 'function') return undefined
  try {
    const target = conversation.binding(sessionId).target(CHAT_TARGET)
    return typeof target?.getSnapshot === 'function' && typeof target.subscribe === 'function'
      ? target
      : undefined
  } catch {
    // Unknown / not-yet-retained session: the pet simply has no transcript yet.
    return undefined
  }
}

/**
 * One session's observable view for the pet.
 * @param session - client `Session` object (`getSnapshot`/`subscribe`/`projections`).
 * @param sessionId - its identity.
 * @param chat - conversation `chat` target source, when available.
```

</details>

**依据 2 · 源码核查**：[src/client/pet-session.js:173-204](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-session.js#L173-L204)

快照身份缓存与订阅清理。

<details>
<summary>查看原文（32行）</summary>

```text
  const getSnapshot = () => {
    const base = session.getSnapshot()
    const legacy = chat?.getSnapshot()?.legacy
    const status = statuses?.getSnapshot?.()?.get(sessionId)
    if (primed && base === lastBase && legacy === lastLegacy && status === lastStatus) return merged
    primed = true
    lastBase = base
    lastLegacy = legacy
    lastStatus = status
    merged = mergePetSnapshot(base, legacy, status)
    return merged
  }
  const subscribe = listener => {
    const stops = [session.subscribe(listener)]
    if (typeof statuses?.subscribe === 'function') stops.push(statuses.subscribe(listener))
    if (typeof chat?.subscribe === 'function') stops.push(chat.subscribe(listener))
    return () => {
      for (const stop of stops) {
        try {
          stop()
        } catch {}
      }
    }
  }
  return {
    getSnapshot,
    subscribe,
    projections: { faceOf: key => session.projections?.faceOf?.(key) },
  }
}

/**
```

</details>

**依据 3 · 源码核查**：[src/client/pet-session.js:212-241](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-session.js#L212-L241)

statuses仅bridge创建时绑定；chat随新binding重取，导航使用uiWorkspace。

<details>
<summary>查看原文（30行）</summary>

```text
export function createSessionBridge(ctx) {
  const views = new Map()
  const statuses = bindObservable(optionalService(ctx, 'uiSession')?.sessionStatus, emptyObservable(EMPTY_STATUS))

  const view = sessionId => {
    if (typeof sessionId !== 'string' || sessionId === '') return undefined
    const sessions = optionalService(ctx, 'sessions')
    const binding = sessions?.binding?.(sessionId)
    const session = binding?.session
    if (session === undefined || session === null) return undefined
    const cached = views.get(sessionId)
    if (cached !== undefined && cached.binding === binding) return cached.view
    const next = createSessionView({
      session,
      sessionId,
      chat: chatSource(ctx, sessionId),
      statuses,
    })
    views.set(sessionId, { binding, view: next })
    return next
  }

  /** Reveal one session in the main view. */
  const open = sessionId => {
    if (typeof sessionId !== 'string' || sessionId === '') return
    optionalService(ctx, 'uiWorkspace')?.openSession?.(sessionId)
  }

  return { view, open, statuses }
}
```

</details>

**依据 4 · 源码核查**：[src/client/DeepSeekPet.jsx:92-125](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L92-L125)

实际读取与展示使用。

<details>
<summary>查看原文（34行）</summary>

```text
  const storedMode = useDisplayMode()
  const mode = displayMode ?? storedMode
  const list = useSessions(value => value)
  // Running / pending-interaction facts live in the uiSession status map now;
  // the catalog rows only carry the running bit.
  const statuses = useSyncExternalStore(statusSource.subscribe, statusSource.getSnapshot, statusSource.getSnapshot)
  const sessionId = currentSessionId(list)
  const focusedSession = sessionId ? list.byId?.[sessionId] : undefined
  const focusedStatus = sessionStatusOf(statuses, focusedSession)
  const runningSessions = useMemo(() => (Array.isArray(list?.ids) ? list.ids : [])
      .map(id => list.byId?.[id])
      .filter(item => {
        if (!item || item.id === sessionId) return false
        const status = sessionStatusOf(statuses, item)
        return status.running || Boolean(status.pendingInteraction)
      })
      .map(item => ({ id: item.id, label: sessionLabel(item), updatedAt: item.updatedAt ?? 0, ...sessionStatusOf(statuses, item) }))
      .sort((a, b) => Number(b.running) - Number(a.running) || b.updatedAt - a.updatedAt), [list, sessionId, statuses])
  const busySessions = runningSessions.filter(item => item.running).length + Number(Boolean(focusedStatus.running))
  const session = useMemo(() => sessionId ? resolveSession(sessionId) : undefined, [resolveSession, sessionId])
  const subscribe = useCallback(listener => session?.subscribe(listener) ?? (() => {}), [session])
  const getSnapshot = useCallback(() => session?.getSnapshot() ?? EMPTY_SNAPSHOT, [session])
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getSnapshot)
  const pressureFace = useMemo(() => session?.projections?.faceOf?.('contextPressure'), [session])
  const subscribePressure = useCallback(listener => pressureFace?.subscribe(listener) ?? (() => {}), [pressureFace])
  const getPressure = useCallback(() => pressureFace?.getSnapshot() ?? EMPTY_PRESSURE, [pressureFace])
  const pressure = useSyncExternalStore(subscribePressure, getPressure, getPressure)
  const reactionSettings = useSyncExternalStore(
    typeof window !== 'undefined' ? subscribeReactionSettings : NOOP_SUBSCRIBE,
    getReactionSettingsSnapshot,
    getReactionSettingsSnapshot,
  )
  const immediate = stateFromSnapshot(session ? snapshot : null)
  const taskActive = Boolean(snapshot.running || snapshot.runningCalls?.length || snapshot.partial || snapshot.pending?.length || snapshot.queue?.length)
```

</details>

#### 缺口

- 宿主可选服务实际出现时序与bridge重建条件未验证。
  **影响**：uiSession创建时缺席后即使binding换代仍不重取，chat仅新binding重取，恢复需区分来源。
  **进一步探讨**：受控宿主分别延迟uiSession与uiConversation，核同binding、新binding和bridge重建三种行为。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 表情和批准文案能证明什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

当前只能提醒回任务交互，不能据README称气泡内直接批准/拒绝或提交答案。stateFromSnapshot把approval、plan-review和question统一标waiting并写“请在任务中确认”；实际aside气泡只有文本，快捷操作是最小化，活跃会话按钮负责打开原会话，没有对应回答控件或respond接线。不能因为包内文案/状态名带approval就记为批准能力。

“任务完成”由running从真变假且即时状态回idle触发8秒庆祝，不检查用户任务交付物；工具错误只扫最近最多4节点且遇用户/助手消息停，故状态是提醒而非独立验收。图片一出现便固定说“DeepSeek当前不支持视觉”，并未查询所选模型能力；疑问数/纠正正则同样是启发式。用户应以原会话/工具结果为准，不能让表情决定批准或成功。这里确认代码条件，不声称已复现错批或特定模型误报。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/pet-state.js:49-59](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-state.js#L49-L59)

pending只提示回任务。

<details>
<summary>查看原文（11行）</summary>

```text
  const pending = Array.isArray(snapshot.pending) ? snapshot.pending : []
  if (pending.length > 0) {
    // `uiSession.sessionStatus` pending interactions: 'approval' | 'plan-review' | 'question'.
    const kind = pending[0]?.kind
    if (kind === 'approval') return state('waiting', '等你确认工具调用', '请在任务中确认，我会在这里等你')
    if (kind === 'plan-review') return state('waiting', '等你确认计划', '请在任务中确认计划，我会在这里等你')
    return state('waiting', '等待你的回答', kind === 'question' ? '请在任务中回答问题' : '请在任务中完成交互')
  }

  if (hasRecentImage(snapshot)) {
    return state('vision', '图片暂时看不见', 'DeepSeek 当前不支持视觉输入')
```

</details>

**依据 2 · 源码核查**：[src/client/DeepSeekPet.jsx:464-503](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L464-L503)

气泡文本、最小化与会话导航。

<details>
<summary>查看原文（40行）</summary>

```text
      data-reaction-pending={reactionPending ? 'true' : 'false'} data-tapped={tapText ? 'true' : 'false'}
      style={{ '--pet-drag-x': `${offset.x}px`, '--pet-drag-y': `${offset.y}px`, '--pet-scale': scale }} aria-label="DeepSeek 任务状态助手">
      <div className="dsh-live2d-bubble" data-visible={bubbleVisible || taskActive || tapText ? 'true' : 'false'} data-stream={showStream ? 'true' : 'false'} role="status" aria-live="polite">
        <span>{bubbleTitle}</span><small ref={streamLineRef} title={showStream ? streamTarget : bubbleDetail}>{bubbleDetail}{showStream && <i aria-hidden="true" />}</small>
      </div>
      <div className="dsh-live2d-stage">
        <button ref={characterRef} className="dsh-live2d-character" type="button" aria-label={collapsed ? '双击展开 DeepSeek 状态助手' : '拖动 DeepSeek 状态助手'}
          onClick={tap} onDoubleClick={() => { if (collapsed) setCollapsed(false) }} onPointerDown={pointerDown}
          onPointerMove={pointerMove} onPointerUp={pointerUp} onPointerCancel={pointerUp} onWheel={wheelScale}>
          <span className="dsh-live2d-sprites" aria-hidden="true">
            {Object.entries(REACTIONS).map(([name, src]) => <img key={name} src={src} alt="" draggable="false" data-active={name === (collapsed ? 'idle' : activeReaction) ? 'true' : 'false'} />)}
            {Object.entries(REACTION_FRAMES).map(([name, src]) => <img key={name} src={src} alt="" draggable="false" data-frame="true" data-active={name === visibleFrame ? 'true' : 'false'} />)}
          </span>
        </button>
      </div>
      <nav className="dsh-live2d-tools" aria-label="Pet 快捷操作">
        <button type="button" title="最小化 Pet" aria-label="最小化 Pet" onClick={() => setCollapsed(true)}><b>−</b><span>最小化</span></button>
      </nav>
      <section className="dsh-live2d-sessions" data-visible={focusedSession || runningSessions.length ? 'true' : 'false'} aria-label="活跃会话">
        {focusedSession && <button className="dsh-live2d-session-focus" type="button" data-current="true" onClick={() => openSession?.(focusedSession.id)}>
          <i data-running={focusedStatus.running ? 'true' : 'false'} /><span>{sessionLabel(focusedSession)}</span><small>聚焦</small>
        </button>}
        <div className="dsh-live2d-session-list" data-visible={runningSessions.length ? 'true' : 'false'}>
          {runningSessions.slice(0, 7).map((item, index) => <button key={item.id} type="button" data-stacked={index >= 3 ? 'true' : 'false'} onClick={() => openSession?.(item.id)}>
            <i data-running={item.running ? 'true' : 'false'} /><span>{item.label}</span><small>{item.pendingInteraction ? '等待操作' : '执行中'}</small>
          </button>)}
          {runningSessions.length > 7 && <footer>还有 {runningSessions.length - 7} 个会话</footer>}
        </div>
      </section>
    </aside>
  )
  // Page-top placement portals to <body> so the pet escapes the shell overlay
  // layer's stacking context and sits above every page element. It is a pure
  // in-page placement: no window or tab is ever opened.
  if (mode === 'page-top' && typeof document !== 'undefined') {
    return createPortal(petSurface, document.body)
  }
  return petSurface
}

```

</details>

**依据 3 · 源码核查**：[src/client/DeepSeekPet.jsx:174-190](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L174-L190)

running结束到idle触发庆祝。

<details>
<summary>查看原文（17行）</summary>

```text

  useEffect(() => {
    let transitionTimer
    let completionTimer
    const commit = next => setVisual(current => sameVisual(current, next) ? current : next)
    if (snapshot.running) {
      wasRunning.current = true
      transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    } else if (wasRunning.current) {
      wasRunning.current = false
      if (immediate.kind !== 'idle') commit(immediate)
      else {
        commit(completionState())
        completionTimer = window.setTimeout(() => commit(immediate), 8000)
      }
    } else transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    return () => { window.clearTimeout(transitionTimer); window.clearTimeout(completionTimer) }
```

</details>

**依据 4 · 源码核查**：[src/client/pet-state.js:140-156](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-state.js#L140-L156)

有限错误扫描及完成标签。

<details>
<summary>查看原文（17行）</summary>

```text
function recentToolFailure(snapshot) {
  const nodes = Array.isArray(snapshot?.nodes) ? snapshot.nodes : []
  for (let index = nodes.length - 1; index >= Math.max(0, nodes.length - 4); index -= 1) {
    const node = nodes[index]
    if (node?.kind === 'assistant' || node?.kind === 'user' || node?.kind === 'steering') break
    if (node?.kind === 'tool-result' && node.isError) return node.call?.name || node.error?.name || 'tool'
    if (node?.kind === 'command' && node.outcome?.kind === 'error') return node.name || 'command'
  }
  return ''
}

/** A successful running→idle edge is shown temporarily as completion. */
export function completionState() {
  return state('success', '任务完成', '完成啦！')
}

function state(kind, label, detail) {
```

</details>

**依据 5 · 源码核查**：[src/client/pet-state.js:58-60](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-state.js#L58-L60)

图片直接固定视觉文案。

```text
  if (hasRecentImage(snapshot)) {
    return state('vision', '图片暂时看不见', 'DeepSeek 当前不支持视觉输入')
  }
```

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 持续成本与适合的试用是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

喜欢桌宠且愿保留原任务UI的用户，可先默认页内模式试用，核已知运行/等待/结束、切换会话和图片输入，不依赖气泡完成批准。页面置顶只把同一surface portal到body，不是OS全局置顶；它会浮于设置/弹窗上方，遮挡或分心时先最小化或禁用插件。主会话操作仍回原UI，停用不会替用户取消后台任务。

首次要匹配客户端API与安装构建，持续有图片、React订阅和定时动画渲染；本组件未见专用LLM请求，不能据此把CPU/内存、注意力和维护成本填0。位置/比例/显示模式/动作选择用同源localStorage保存，跨窗口同步显示设置，不是跨设备配置；存储失败部分吞掉会导致刷新后不保留。退出回原会话列表/状态，不涉及迁移聊天记录。未做宿主/性能或用户效果实验，建议仅展示试用，不升级安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/DeepSeekPet.jsx:495-503](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L495-L503)

页内portal，非OS窗。

```text
  // Page-top placement portals to <body> so the pet escapes the shell overlay
  // layer's stacking context and sits above every page element. It is a pure
  // in-page placement: no window or tab is ever opened.
  if (mode === 'page-top' && typeof document !== 'undefined') {
    return createPortal(petSurface, document.body)
  }
  return petSurface
}

```

**依据 2 · 源码核查**：[src/client/DeepSeekPet.jsx:174-199](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L174-L199)

定时状态与轮换。

<details>
<summary>查看原文（26行）</summary>

```text

  useEffect(() => {
    let transitionTimer
    let completionTimer
    const commit = next => setVisual(current => sameVisual(current, next) ? current : next)
    if (snapshot.running) {
      wasRunning.current = true
      transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    } else if (wasRunning.current) {
      wasRunning.current = false
      if (immediate.kind !== 'idle') commit(immediate)
      else {
        commit(completionState())
        completionTimer = window.setTimeout(() => commit(immediate), 8000)
      }
    } else transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    return () => { window.clearTimeout(transitionTimer); window.clearTimeout(completionTimer) }
  }, [immediate.kind, immediate.label, immediate.detail, snapshot.running])

  useEffect(() => {
    setPhase(0)
    const interval = window.setInterval(() => setPhase(value => value + 1), 12_000)
    return () => window.clearInterval(interval)
  }, [effectiveVisual.kind, effectiveVisual.reaction])

  useEffect(() => {
```

</details>

**依据 3 · 源码核查**：[src/client/pet-display.js:95-128](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-display.js#L95-L128)

localStorage与事件同步/清理。

<details>
<summary>查看原文（34行）</summary>

```text
export function getDisplayModeSnapshot() {
  return current
}

/**
 * Persist and broadcast a new display mode. Same-document subscribers update
 * synchronously; other windows of the same origin follow through `storage`.
 */
export function setDisplayMode(mode) {
  if (!isValidDisplayMode(mode) || mode === current) return
  current = mode
  try {
    window.localStorage?.setItem(DISPLAY_MODE_KEY, mode)
  } catch {}
  try {
    window.dispatchEvent(new CustomEvent(DISPLAY_MODE_CHANGED_EVENT, { detail: { mode } }))
  } catch {
    notify()
  }
}

/**
 * Subscribe to display-mode changes (same document and cross-window).
 * @param listener - change callback.
 * @returns unsubscribe.
 */
export function subscribeDisplayMode(listener) {
  listeners.add(listener)
  attachWindowListeners()
  return () => {
    listeners.delete(listener)
    if (listeners.size === 0) detachWindowListeners()
  }
}
```

</details>

**依据 4 · 源码核查**：[src/client/pet-reactions.js:121-145](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-reactions.js#L121-L145)

动作最少一张与保存。

<details>
<summary>查看原文（25行）</summary>

```text
export function setReactionEnabled(groupId, reaction, enabled) {
  const item = GROUPS_BY_ID.get(groupId)
  if (!item || !item.options.some(entry => entry.id === reaction)) return false
  const selected = new Set(current[groupId] ?? item.defaultEnabled)
  if (enabled) selected.add(reaction)
  else {
    if (!selected.has(reaction) || selected.size <= 1) return false
    selected.delete(reaction)
  }
  const next = normalizeReactionSettings({ ...current, [groupId]: [...selected] })
  current = next
  try { window.localStorage?.setItem(REACTION_SETTINGS_KEY, JSON.stringify(next)) } catch {}
  try {
    window.dispatchEvent(new CustomEvent(REACTION_SETTINGS_CHANGED_EVENT, { detail: { settings: next } }))
  } catch {
    notify()
  }
  return true
}

export function resetReactionSettings() {
  const next = defaultReactionSettings()
  current = next
  try { window.localStorage?.setItem(REACTION_SETTINGS_KEY, JSON.stringify(next)) } catch {}
  try {
```

</details>

#### 缺口

- 没有实际宿主兼容、渲染资源和干扰效果数据。
  **影响**：小范围展示试用有退路，持续采用价值未知。
  **进一步探讨**：记录多会话等待识别、资源与遮挡，和原UI对照。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么改进值得验证？

**研究主题**：新假设与验证

#### 完整回答

未验证方向是把“缺来源数据”“宿主事实”“情绪表达”在气泡文案中区分，服务缺席/图片能力未知时显示未知而非断言，完成时说“本轮停止运行”并让用户点回结果。它来自服务降级丢信息、固定视觉断言和运行边沿等于完成的映射；简单增加表情不会修复这些语义。

候选只改变解释和来源状态，不增加批准权；用合成等待、取消、缺服务、支持/不支持图片模型和工具失败样本，对比误读完成/能力、漏待办与干扰。维护代价是来源元数据、文案和宿主模型能力接口；若误读没下降或未知提示让用户更难识别重点，就否定方案。不宣称真实需求或商业机会。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/pet-session.js:127-145](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-session.js#L127-L145)

缺来源被空值归一。

<details>
<summary>查看原文（19行）</summary>

```text
export function mergePetSnapshot(base, legacy, status) {
  const lifecycle = base ?? {}
  const conversation = legacy ?? {}
  const interaction = status?.pendingInteraction
  return {
    ...lifecycle,
    running: status?.running ?? lifecycle.running ?? false,
    pendingInteraction: interaction ?? null,
    pending: interaction === undefined || interaction === null ? [] : [interaction],
    nodes: Array.isArray(conversation.nodes) ? conversation.nodes : [],
    partial: conversation.partial ?? null,
    runningCalls: Array.isArray(conversation.runningCalls) ? conversation.runningCalls : [],
    queue: pendingSubmissionQueue(lifecycle),
  }
}

/** Resolve the conversation `chat` target source, or undefined while it cannot be bound. */
function chatSource(ctx, sessionId) {
  const conversation = optionalService(ctx, 'uiConversation')
```

</details>

**依据 2 · 源码核查**：[src/client/DeepSeekPet.jsx:174-190](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/DeepSeekPet.jsx#L174-L190)

完成来自运行边沿。

<details>
<summary>查看原文（17行）</summary>

```text

  useEffect(() => {
    let transitionTimer
    let completionTimer
    const commit = next => setVisual(current => sameVisual(current, next) ? current : next)
    if (snapshot.running) {
      wasRunning.current = true
      transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    } else if (wasRunning.current) {
      wasRunning.current = false
      if (immediate.kind !== 'idle') commit(immediate)
      else {
        commit(completionState())
        completionTimer = window.setTimeout(() => commit(immediate), 8000)
      }
    } else transitionTimer = window.setTimeout(() => commit(immediate), immediate.kind === 'error' ? 100 : 720)
    return () => { window.clearTimeout(transitionTimer); window.clearTimeout(completionTimer) }
```

</details>

**依据 3 · 源码核查**：[src/client/pet-state.js:58-60](https://github.com/keleus/deepseek-pet/blob/b9b61a35c3b2443ecdeab0ed442d6b33c603d343/src/client/pet-state.js#L58-L60)

固定视觉文案。

```text
  if (hasRecentImage(snapshot)) {
    return state('vision', '图片暂时看不见', 'DeepSeek 当前不支持视觉输入')
  }
```

#### 缺口

- 未实现或比较来源明确的文案。
  **影响**：不知道是否值得额外提示。
  **进一步探讨**：用上述状态样本对照用户判断正确率和注意力负担。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
