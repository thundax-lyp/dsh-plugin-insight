# dsh-claude-style

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[f3f6e4c](https://github.com/Nwflower/dsh-claude-style/tree/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a)

<!-- BEGIN META -->
[![GitHub ★ 541](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=541&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Nwflower/dsh-claude-style) [![npm 30d 44,941](https://img.shields.io/static/v1?label=npm+30d&message=44%2C941&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style) [![最新发布 2026-11-09](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-09&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-claude-style)
<!-- END META -->

> **功能**：为 DeepSeek Harness 网页界面提供 Claude Code Desktop 风格主题与交互。

> **亮点**：用一套 Web 主题把过程组收纳、用户消息折叠和长对话布局调整接入同一界面。过程组已结束且有后续内容接续才自动收拢，原生结构仍承担实际的消息呈现。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：权限预设直接调用宿主命令，归档删除可以递归移除会话目录。Sodium 也会改写宿主样式，遇到共同写入时无法保证仅靠关闭开关恢复。[Q03](#research-q03) [Q02](#research-q02)

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
  - [Q01 · 在 DSH Web 回看长对话时，这个主题相对宿主原生界面提供什么？](#detail-section-11)
  - [Q02 · 长会话跳过排版和 Sodium 改写分别改哪里，收益要如何计量？](#detail-section-12)
  - [Q03 · 主题中的权限切换与归档删除会产生什么写入，失败时能否回退？](#detail-section-13)
  - [Q04 · 谁可以试用，实际接入和退出有哪些前提？](#detail-section-14)
  - [Q05 · 可否把长会话优化收敛为低风险的可独立验收方案？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常回看长会话的 DSH Web 用户需要尽快找到最终回答，也需要在出错时能展开关键过程。[Q01](#research-q01)

原生 DSH Web 界面及其手动披露、权限确认和归档流程。聊天区存在专门插件时，此主题部分功能退让。[Q01](#research-q01) [Q03](#research-q03)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Web 主题与消息折叠 | 阅读长对话时突出最终答案与按需回看过程 | 依赖宿主消息结构，检测到 dsh-chat-ux 时折叠模块退让 |
| 离屏排版与 Sodium | 减少热切换时的重复布局，适配特定宿主样式 | 行高随布局签名失效，Sodium 有共享 CSS 退出风险 |
| 权限选择与归档操作 | 触发宿主预设和归档会话动作 | 真实写入需单独验收，删除可移除磁盘数据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 0.2.2-rc.1 或更高 | 作者声明必需 | 挂载客户端与界面部件 | 使用原生界面，最低版本未实装核验 |
| webServer 和连接层 | 私有路由需要 | 服务端资源、归档操作及请求拒绝 | 路由可能缺失，缺连接钩子走环回检查 |
| 独立测试 profile 和可丢弃会话 | 本试用需要 | 验收折叠及退出 | 避免触及正式会话 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户记录宿主和浏览器版本并选择独立配置 | 原生页面可正常打开同一测试会话 |
| 试用 | 用户仅启用这一主题，切换会话并展开已结束过程 | 可找到答案和工具失败，焦点和滚动保持可控 |
| 退出 | 用户停用并重载，核对原生菜单和会话 | 样式残留或权限异常时用原生配置复核 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 浏览器资源用量和现金支出未核实 | 建立独立 profile 并准备长对话 | 版本声明不等于兼容验收 |
| 持续使用 | 行高缓存、观察与布局开销未实测 | 升级后复查折叠、焦点与设置 | 同浏览器的单位任务数据缺失 |
| 失败恢复 | 正式会话误删可能造成数据损失 | 停用重载并核对真实会话和权限状态 | 软件退出不能还原已完成的写入 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 回看长对话 | 结束组按同轮后续内容收拢 | 定位答案和反查工具步骤是否更快 |
| 热切换 | 已见行高用于离屏布局快路径 | 帧耗时、锚点偏移与峰值内存 |
| 停用恢复 | 功能退订与样式拆除有明确入口 | 共写样式以及设置、数据写入后的实际残留 |

> **思考**：权限预设直接调用宿主命令，归档删除可以递归移除会话目录。Sodium 也会改写宿主样式，遇到共同写入时无法保证仅靠关闭开关恢复。[Q03](#research-q03) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：用一套 Web 主题把过程组收纳、用户消息折叠和长对话布局调整接入同一界面。过程组已结束且有后续内容接续才自动收拢，原生结构仍承担实际的消息呈现。[Q01](#research-q01) [Q02](#research-q02)

按功能声明运行顺序、设置和同类退让，客户端通过生命周期统一管理。延迟模块到达时重验资格，调度器失败整体回收。薄弱点集中在宿主 DOM 契约、CSS 共享写入及删除前后缺少联合提交边界。[Q02](#research-q02) [Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

权限预设直接调用宿主命令，归档删除可以递归移除会话目录。Sodium 也会改写宿主样式，遇到共同写入时无法保证仅靠关闭开关恢复。[Q03](#research-q03) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先在独立 profile 选一个已有最终回答且有工具过程的测试会话，记录原生界面的展开与定位结果。仅在相同浏览器条件下复核本主题的可操作性，出现异常就停用并重载。涉及权限或删除时另用可丢弃会话与数据目录，退出后核对实际状态。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持折叠、离屏排版和真实写入路径。独立优化的收益与故障恢复表现仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、packages/client/src/features/chat-fold/chat-fold.ts、packages/client/src/features/chat-fold/process-fold.ts、packages/client/src/features/chat-fold/chat-fold.manifest.ts、packages/client/src/entry.ts、packages/client/src/features/row-skip/row-heights.ts、packages/client/src/features/row-skip/row-skip.ts、packages/client/src/features/row-skip/row-skip.css、packages/engine/src/scheduler.ts、packages/client/src/features/sodium/sodium.ts、packages/client/src/features/sodium/members.ts、packages/client/src/features/sodium/sodium-engine.ts、packages/engine/src/sheet-rewrite.ts、packages/client/src/features/permissions/permissions.ts、packages/client/src/features/workspace/archived-list.ts、packages/client/src/features/workspace/workspace-view.ts、packages/client/src/features/workspace/archived-actions.ts、packages/engine/node/http.ts、packages/host/src/routes.ts、package.json、cordis.patch.yml、packages/host/src/index.ts、packages/client/src/features/row-skip/row-skip.manifest.ts、packages/client/src/features/sodium/sodium.manifest.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定提交的包和 Web 接线、宿主入口、折叠、行高缓存、Sodium、权限与归档删除相关源码。仓库其他特性及作者测试脚本未作覆盖声明。
- 下一步：已静态核查版本与代码路径。未安装目标插件，未执行测试、宿主加载或用户比较。性能和退出方案见 [Q05](#research-q05)。

**分析版本**

- **仓库**：[Nwflower/dsh-claude-style](https://github.com/Nwflower/dsh-claude-style)
- **版本号**：0.20.2（[固定提交 f3f6e4c](https://github.com/Nwflower/dsh-claude-style/tree/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a)）
- **版本日期**：2026-11-10（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

待验证方向是让离屏排版与选择器改写分别通过性能与恢复验收。如果只保留前者也能减少长会话热切换的布局耗时，就可以减少直接改写宿主样式的场景。[Q05](#research-q05)

已静态核查版本与代码路径。未安装目标插件，未执行测试、宿主加载或用户比较。性能和退出方案见 [Q05](#research-q05)。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 38 | 6336 | — | — | 142655 |
| .mjs | source | 116 | 21551 | 16334 | 4298 | — |
| .ts | source | 387 | 55909 | 37310 | 14839 | — |
| .js | source | 56 | 7967 | 6131 | 1765 | — |
| .mjs | test | 68 | 6832 | 5187 | 1207 | — |
| .mjs | example | 9 | 491 | 364 | 93 | — |
| .ts | example | 11 | 274 | 195 | 49 | — |
| .ts | test | 82 | 9259 | 7310 | 1112 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 187](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=187&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+created%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z) [![近30天关闭 190](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=190&color=737b86&logo=github)](https://github.com/Nwflower/dsh-claude-style/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-11T02%3A28%3A35.946Z..2026-11-10T02%3A28%3A35.946Z)



统计日期：2026-11-10。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户使用这套 Claude Code Desktop 风格主题整理长对话时，能获得哪些可追溯的交互增量，又必须承担哪些宿主兼容与实际写入风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 在 DSH Web 回看长对话时，这个主题相对宿主原生界面提供什么？

**研究主题**：场景与需求、贡献与相对优势、功能与机制

#### 完整回答

对反复从长对话找回最终回答、再按需回看工具过程的个人开发者，增量是把主题、过程收纳和消息折叠组织在同一套 Web 界面里。作者把项目定位为 Claude Code Desktop 风格复刻。折叠入口同时接上推理行、过程组、长用户消息与过渡动画。过程组仅在已结束且同轮后续组或回答能接续时自动收拢，最后一组仍承担信息展示时保留，当前阶段内读者亲手改变过的状态也保留。它利用宿主已有的披露按钮及消息结构自动安排可见性，合格结果应是答案能先看到，关键失败步骤仍能展开。原生界面可手动收放，已有 dsh-chat-ux 时本折叠模块按存在检测退让，因此不会同时提供两套折叠策略。外观偏好、操作数和可达性仍需观察。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-5](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/README.md#L3-L5)

作者明确将项目定位为 Web 主题与交互复刻。

```text
# DSH Claude Style

**为 DeepSeek Harness 复刻 Claude Code Desktop 风格与交互体验的主题插件。**
```

**依据 2 · 源码核查**：[packages/client/src/features/chat-fold/chat-fold.ts:19-37](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/chat-fold/chat-fold.ts#L19-L37)

安装推理、过程、摘要与用户消息折叠，并把忙状态暴露给其他交互。

<details>
<summary>查看原文（19行）</summary>

```text
/* One preference controls every fold behaviour. Install only while dsh-chat-ux is absent (D72);
   ui.chatFold lets the follow guard exclude an active glide and disappears on teardown. */
export function install(ctx: HostContext, ui: FeatureUi<typeof manifest>) {
  document.body.setAttribute(CHAT_FOLD_ATTR, '')
  const stream = createReasoningStream()
  const stopReasoning = createReasoningFold(rows => {
    for (const row of rows) stream.queueRow(row)
  })
  const stopProcess = createProcessFold()
  const summary = createProcessSummary()
  const messageFold = createMessageFold(() => ui.schedule?.())
  const stopGlide = installChatFoldGlide()
  ui.chatFold = {
    isBusy: isChatFoldBusy,
    measure: () => messageFold.measure(),
    sync: () => messageFold.sync(),
    // Assistant text cannot change a user bubble; structural and size changes
    // request their own full pass from message-fold's registries.
    skipOnContentOnly: true,
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/chat-fold/process-fold.ts:85-115](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/chat-fold/process-fold.ts#L85-L115)

根据阶段、用户已触达状态及后续内容决定是否收拢。

<details>
<summary>查看原文（31行）</summary>

```text
    for (const group of groups) {
      // A frame sits between collecting and settling, and the group may be gone by then.
      if (!group.isConnected) continue
      // The detailed and fully-expanded tiers do not cap the body, and the
      // host keeps the header in the DOM there (wrapped in a hidden shell), so
      // pressing it would only flip the host's own open state with nothing for
      // the reader to see.
      if (group.hasAttribute(PROCESS_EXPANDED_MODE_ATTRIBUTE)) continue
      const header = group.querySelector(PROCESS_ACTIVITY_SELECTOR)
      const body = group.querySelector(PROCESS_BODY_SELECTOR)
      if (!(header instanceof HTMLElement) || body === null) continue
      const phase = header.querySelector(SHIMMER_SELECTOR) === null ? PROCESS_CLOSED : RUNNING_STATE
      const closed = phase === PROCESS_CLOSED
      // The reader has decided this group's state in this phase: leave it.
      if (touchedIn.get(group) === phase) continue
      // A closed group folds once a later group of its turn or the turn's answer
      // takes its place. The last group of a stopped turn has neither, and the
      // host folds it itself at the end; this is the press that opens it again,
      // so the work stays on screen.
      const flow = group.closest(CHAT_FLOW_SELECTOR)
      const desiredHidden = closed && (flow === null || followedInTurn(group, flow) || showsAnswer(group, flow))
      if (body.hasAttribute('hidden') === desiredHidden) continue
      // A group the reader folded by hand stays folded.
      if (!desiredHidden && touchedIn.has(group)) continue
      // A press that changed nothing will not change anything next time either.
      // Both sides name the state the body stands in, so the host's own fold
      // later in the turn is a state this module has not pressed from.
      const standing = `${phase}:${body.hasAttribute('hidden') ? 'shut' : 'open'}`
      if (attemptedIn.get(group) === standing) continue
      // The reader is part-way through an input-method composition. The press
      // below takes the focus off the editor and hands it back, and a focus or
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/chat-fold/chat-fold.manifest.ts:3-12](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/chat-fold/chat-fold.manifest.ts#L3-L12)

折叠模块以聊天动画偏好为门槛，并声明退让对象。

<details>
<summary>查看原文（10行）</summary>

```text
export default {
  id: 'chatFold',
  order: 200,
  contracts: ['chat.assistant-step-kind', 'chat.flow', 'chat.follow-threshold', 'chat.group-part', 'chat.group-part-reasoning', 'chat.message-bubble', 'chat.motion-scope', 'chat.phase', 'chat.process-member', 'chat.reasoning-text', 'chat.scroller', 'chat.shimmer', 'chat.shimmer-attribute', 'chat.streaming-attribute', 'chat.think-row', 'chat.think-running', 'chat.tool-call-kind', 'chat.turn-attribute', 'chat.user-kind', 'chat.user-row', 'composer.composing', 'composer.echo', 'fold.disclosure', 'fold.disclosure-header', 'fold.expanded', 'fold.skipped', 'fold.toggle', 'process.activity', 'process.body', 'process.expanded-mode', 'process.group', 'process.header-label'],
  pref: 'chatAnimations',
  yieldsTo: 'dsh-chat-ux',
  stylesheets: [
    { file: 'fold.css', rank: 170 },
    { file: 'message-fold.css', rank: 205 },
    { file: 'fold-motion.css', rank: 210 },
```

</details>

**依据 5 · 源码核查**：[packages/client/src/entry.ts:48-59](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L48-L59)

退让声明实际进入功能启用判断。

<details>
<summary>查看原文（12行）</summary>

```text
const isLive = (feature: Feature) => feature.pref !== undefined || feature.yieldsTo !== undefined

/** Boolean switches default on; choice switches require a listed value and no yielding peer. */
function isWanted(feature: Feature) {
  if (feature.pref !== undefined) {
    const value = readPrefs()[feature.pref]
    const on = feature.prefValues === undefined
      ? value !== false
      : typeof value === 'string' && feature.prefValues.includes(value)
    if (!on) return false
  }
  return feature.yieldsTo === undefined || !peerPresent(feature.yieldsTo)
```

</details>

#### 缺口

- 没有原生界面与主题的同任务对照。
  **影响**：无法判定找回答案或过程的操作数和耗时是否减少。
  **进一步探讨**：对同一测试对话测定位答案、找回工具失败并复述原因的完成率与耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 长会话跳过排版和 Sodium 改写分别改哪里，收益要如何计量？

**研究主题**：效果与总成本、工程质量与复用、功能与机制

#### 完整回答

离屏排版与选择器改写是两个独立机制。前者观察消息行，按节点键、行类别及消息组分段保留最多 4096 个已见高度。重挂时命中缓存就先写入固有尺寸并标记，CSS 让符合条件的离屏行跳过布局。列宽取整值或界面字体设置变化会清空缓存，用户行和若干隐藏状态不进入快路径。同一客户端的调度器还把读尺寸与写 DOM 分开，仅内容变化可跳过明确允许的功能，因此开销取决于实际突变类型。实验性 Sodium 在设置仍未决定时探测命中再尝试保存为开，显式关会保留关。当前适配表针对宿主 ChatView 样式，结合版本、样式所有者和路径识别待改规则。写回同一 CSSOM 规则保留级联位置，关闭时只恢复还等于插件上次写入的选择器。其他写入者若改过同一规则，恢复会留下变更并报错，刷新原生页面才有机会重建样式。标记维护、选择器遍历和缓存也消耗浏览器资源。用同一长对话的热切换和持续输出测试帧耗时、内存与滚动锚点，并把冷启动单列，才能判断是否减少每次合格回看任务的代价。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/row-skip/row-heights.ts:10-23](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-heights.ts#L10-L23)

缓存上限和按消息行分辨的键。

<details>
<summary>查看原文（14行）</summary>

```text
/** How many rows keep their height; a long session holds a few hundred, and the oldest leave first. */
export const ROW_HEIGHT_CACHE_LIMIT = 4096

/**
 * The key a row's height is kept under: its node key says which message, and
 * the kind and group part say which row of that message (a reasoning row and
 * the answer row of one step share the node key).
 */
export function rowHeightKey(row: Element) {
  const node = row.getAttribute(CHAT_NODE_KEY_ATTRIBUTE)
  if (node === null) return null
  const kind = row.getAttribute(FLOW_KIND_ATTRIBUTE) ?? ''
  const part = row.getAttribute(CHAT_GROUP_PART_ATTRIBUTE) ?? ''
  return `${node}|${kind}|${part}`
```

</details>

**依据 2 · 源码核查**：[packages/client/src/features/row-skip/row-heights.ts:33-54](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-heights.ts#L33-L54)

读写更新近用顺序并淘汰超限项。

<details>
<summary>查看原文（22行）</summary>

```text
/** Keep the most recently touched heights, dropping the oldest past the limit. */
export function createRowHeightCache(limit = ROW_HEIGHT_CACHE_LIMIT): RowHeightCache {
  const heights = new Map<string, number>()
  const touch = (key: string, height: number) => {
    heights.delete(key)
    heights.set(key, height)
  }
  return {
    get(key) {
      const height = heights.get(key)
      if (height !== undefined) touch(key, height)
      return height
    },
    set(key, height) {
      if (!Number.isFinite(height) || height <= 0) return
      touch(key, height)
      while (heights.size > limit) {
        const oldest = heights.keys().next().value
        if (oldest === undefined) break
        heights.delete(oldest)
      }
    },
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/row-skip/row-skip.ts:52-86](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-skip.ts#L52-L86)

布局签名失效、缓存命中和行标记。

<details>
<summary>查看原文（35行）</summary>

```text
  const heights = createRowHeightCache()
  let layoutSignature = ''

  /** The things a kept height stands for: the column's width and the interface text's size. */
  const currentSignature = () => `${Math.round(width)}|${document.body.getAttribute(INTERFACE_FONT_SIZE_ATTR) ?? ''}`

  /** A kept height holds only for the layout it was taken at. */
  const syncSignature = () => {
    const next = currentSignature()
    if (next === layoutSignature) return
    layoutSignature = next
    heights.clear()
  }

  /** Take the mark and the kept height off a row whose layout is about to change. */
  const unmark = (row: Element) => {
    row.removeAttribute(LAID_OUT_ATTR)
    row.removeAttribute(ROW_HEIGHT_ATTR)
    if (row instanceof HTMLElement) row.style.removeProperty('contain-intrinsic-size')
  }

  /**
   * Mark a row the cache already holds the height of, before its first layout.
   * @returns whether the row was marked.
   */
  const applyCached = (row: HTMLElement) => {
    if (row.hasAttribute(LAID_OUT_ATTR)) return false
    const key = rowHeightKey(row)
    if (key === null) return false
    const height = heights.get(key)
    if (height === undefined) return false
    row.style.setProperty('contain-intrinsic-size', `auto ${height}px`)
    row.setAttribute(ROW_HEIGHT_ATTR, '')
    row.setAttribute(LAID_OUT_ATTR, '')
    return true
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/row-skip/row-skip.css:9-21](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-skip.css#L9-L21)

标记驱动 CSS 跳过离屏布局，排除特定行。

<details>
<summary>查看原文（13行）</summary>

```text
body[data-dsh-claude-style] [data-chat-flow-kind]:not([data-chat-flow-kind='user']):not([data-chat-flow-kind='assistant-step']:not([data-turn-process-member]), [data-turn-process-hidden], [data-disclosure-row] [hidden], [hidden], [data-dsh-claude-holds~='hidden-row']) {
  contain-intrinsic-size: auto 240px;
}

body[data-dsh-claude-style] [data-chat-flow-kind][data-dsh-claude-laid-out]:not([data-chat-flow-kind='user']):not([data-chat-flow-kind='assistant-step']:not([data-turn-process-member]), [data-turn-process-hidden], [data-disclosure-row] [hidden], [hidden], [data-dsh-claude-holds~='hidden-row']) {
  content-visibility: auto;
}

/* The row carries the height it had when it was last mounted, so the stylesheet
   may skip it before its first layout of this mount, answer rows included. */
body[data-dsh-claude-style] [data-chat-flow-kind][data-dsh-claude-laid-out][data-dsh-claude-row-height]:not([data-chat-flow-kind='user']):not([data-turn-process-hidden], [data-disclosure-row] [hidden], [hidden], [data-dsh-claude-holds~='hidden-row']) {
  content-visibility: auto;
}
```

</details>

**依据 5 · 源码核查**：[packages/engine/src/scheduler.ts:340-375](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/engine/src/scheduler.ts#L340-L375)

同一帧分开读写，并可略过不关心内容变化的功能。

<details>
<summary>查看原文（36行）</summary>

```text
    passContentOnly = options?.contentOnly === true
    // The pass measures in the read phase and writes in the write phase, so a
    // feature that reads a box reads the layout the frame started with, and
    // every measurement happens before any feature's write can invalidate it
    // (D40). The flag says whether this frame's read phase ran, so a task
    // cancelled between the phases writes from the previous measurements.
    let measured = false
    cancelPass = requestFrame({
      read() {
        measured = true
        if (stopped) return
        const content = passContentOnly
        for (const name of features) {
          if (content && handleOf(name)?.skipOnContentOnly === true) continue
          runMeasure(name)
        }
      },
      write() {
        scheduled = false
        cancelPass = null
        if (stopped) return
        const content = passContentOnly
        passContentOnly = false
        if (!measured) {
          // The write phase is running without this frame's read phase (the
          // task was queued after the frame's reads): measure now, before any
          // feature writes.
          for (const name of features) {
            if (content && handleOf(name)?.skipOnContentOnly === true) continue
            runMeasure(name)
          }
        }
        for (const name of features) {
          if (content && handleOf(name)?.skipOnContentOnly === true) continue
          runSync(name)
        }
```

</details>

**依据 6 · 源码核查**：[packages/client/src/features/sodium/sodium.ts:20-45](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/sodium.ts#L20-L45)

设置未定时的探测自动开与显式开关分支。

<details>
<summary>查看原文（26行）</summary>

```text
export function install(ctx: HostContext) {
  const engine = createSodiumEngine(ctx)
  let disposed = false
  /** A probe's write is on its way: the next look waits for the form to answer. */
  let probing = false

  function probe() {
    if (probing || !prefsFromForm() || readPrefs().sodium !== SODIUM_UNDECIDED) return
    probing = true
    engine.survey().then((count) => {
      if (disposed || count === 0 || readPrefs().sodium !== SODIUM_UNDECIDED) return null
      return savePrefs({ sodium: SODIUM_ON })
    }).finally(() => { probing = false })
  }

  function follow() {
    if (readPrefs().sodium === SODIUM_ON) engine.start()
    else engine.stop()
    probe()
  }

  const stopPrefs = subscribePrefs(follow)
  const stopHead = subscribeMutations(document.head, { childList: true, subtree: true }, () => {
    engine.refresh()
    probe()
  })
```

</details>

**依据 7 · 源码核查**：[packages/client/src/features/sodium/members.ts:95-105](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/members.ts#L95-L105)

固定的样式表所有者、路径、规则形状及最低版本。

<details>
<summary>查看原文（11行）</summary>

```text
const CHAT_FLOW: SodiumAdapter = {
  id: 'chat-flow',
  owner: '@deepseek-ai/dsh-client-ui-chat',
  sheet: '@deepseek-ai/dsh-client-ui-chat/ChatView.module.css',
  rewrite: firstShape([GAP, GAP_AFTER_RESPONSE, GAP_AFTER_PROCESS]),
  maintain: (captured) => keepFlowChildMark(captured.get('column') ?? [], FLOW_CHILD_ATTR),
}

export const SODIUM_MEMBERS: readonly SodiumMember[] = [
  { id: 'DeepSeek Harness', release: 'host', since: '0.2.2-alpha.3', adapters: [CHAT_FLOW] },
]
```

</details>

**依据 8 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:39-47](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/sodium-engine.ts#L39-L47)

按真实标签和已装载样式匹配。

```text
/** The sheets on the page that one adapter names, as the loader tagged them. */
function sheetsOf(adapter: SodiumAdapter) {
  const sheets: CSSStyleSheet[] = []
  for (const node of document.head.querySelectorAll<HTMLStyleElement>(PLUGIN_SHEET_SELECTOR)) {
    if (node.getAttribute(PLUGIN_SHEET_OWNER_ATTRIBUTE) !== adapter.owner || node.getAttribute(PLUGIN_SHEET_PATH_ATTRIBUTE) !== adapter.sheet) continue
    if (node.sheet !== null) sheets.push(node.sheet)
  }
  return sheets
}
```

**依据 9 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:166-175](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/sodium-engine.ts#L166-L175)

关停时报告被第三方改写而未恢复的规则。

<details>
<summary>查看原文（10行）</summary>

```text
    stop() {
      if (!on) return
      on = false
      // A rule another writer changed since keeps its rewritten selector, and the
      // marks come off below: from here on it matches nothing, so it is named.
      const stranded = held.flatMap(({ adapter, rules }) => restoreRewrite(rules).map((entry) => `${adapter.sheet} · ${entry.rewritten}`))
      held = []
      keep([])
      publish()
      if (stranded.length > 0) reportError(new Error(`sodium: ${stranded.join('; ')} no longer read as the rewrite left them and stay written`))
```

</details>

**依据 10 · 源码核查**：[packages/engine/src/sheet-rewrite.ts:68-94](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/engine/src/sheet-rewrite.ts#L68-L94)

选择器原地写入和带所有权比较的恢复。

<details>
<summary>查看原文（27行）</summary>

```text
export function applyRewrite(planned: readonly RewrittenRule[]): RewrittenRule[] {
  const written: RewrittenRule[] = []
  for (const entry of planned) {
    const original = entry.rule.selectorText
    entry.rule.selectorText = entry.rewritten
    if (entry.rule.selectorText === original) {
      restoreRewrite(written)
      throw new Error(`sheet-rewrite: the sheet refused the selector ${entry.rewritten}`)
    }
    written.push({ ...entry, original, rewritten: entry.rule.selectorText })
  }
  return written
}

/**
 * Write each rule's own selector back. A rule whose selector no longer reads as
 * this rewrite left it was changed since by someone else, and stays theirs.
 * @returns the rules left as they are, which the caller no longer holds.
 */
export function restoreRewrite(rewritten: readonly RewrittenRule[]): RewrittenRule[] {
  const left: RewrittenRule[] = []
  for (const entry of rewritten) {
    if (entry.rule.selectorText === entry.rewritten) entry.rule.selectorText = entry.original
    else left.push(entry)
  }
  return left
}
```

</details>

#### 缺口

- 没有同浏览器、同宿主版本下的重复采样及样式保持检查。
  **影响**：两种优化均可能把开销转移到预处理，且首次进入与热切换不能混测。
  **进一步探讨**：分别量冷启动、暖缓存切换和流式输出，采样布局耗时、内存峰值、锚点偏移与折叠后内容可达性。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 主题中的权限切换与归档删除会产生什么写入，失败时能否回退？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

权限选项点击后向已有会话发送宿主 /permission 命令，插件本身没有等第二次确认。点击已生效的预设不重复发命令，返回拒绝或没有匹配时会留错误给同步流程。沙箱和审批的具体变更仍由宿主执行，原生确认对话的内部实现只见作者代码说明。归档列表的删除动作与取消归档分开，删除直接从当前行取 ID 向同源路由发 POST。服务端先过宿主连接的拒绝检查，缺该接口时要求环回对端，对提供的 Host、Fetch Metadata 与 Origin 继续约束。其后限制请求体和 ID，按磁盘编码查找目录，拒绝根外解析路径，并两次检查会话活跃状态。活跃状态接口缺失时当作没有打开的会话，服务存在而读不出集合时倾向拒绝。末次检查与实际删除之间没有这里可见的锁。递归删除先于清理归档记录，所以后者抛错时，客户端可能收到失败而磁盘已删。停用皮肤只释放 UI，已改变的权限预设或已删除的历史不会跟着恢复。含正式历史的 profile 不适合用来探测这些分支。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/permissions/permissions.ts:114-148](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/permissions/permissions.ts#L114-L148)

实际宿主命令、拒绝分支与相同值跳过。

<details>
<summary>查看原文（35行）</summary>

```text
  /**
   * Request the preset switch through the host's `/permission` command —
   * the same write the shipped picker's confirmation dialog ends in, minus
   * the dialog. The command validates the preset against the host's own
   * catalog, writes the sandbox mode and the approval policy, and appends
   * the preset event, so the next sync re-renders the control from the
   * projection alone.
   */
  function submitPreset(preset: string, session: HostSession) {
    const settled = session.command(`/permission ${preset}`)
    if (settled === undefined || settled === null) return
    settled.then((result) => {
      if (result === null || typeof result !== 'object' || result.ok !== true) {
        submitError = new Error(`permission: the /permission ${preset} command was refused`)
      } else if (result.value === null || typeof result.value !== 'object' || result.value.matched !== true) {
        submitError = new Error('permission: the host offers no /permission command')
      } else {
        submitError = null
      }
      ui.schedule!()
    }, () => {
      submitError = new Error(`permission: the /permission ${preset} command failed`)
      ui.schedule!()
    })
  }

  /**
   * Request the switch for every row, gated presets included. A same-value
   * pick writes nothing.
   */
  function pick(preset: string | null, session: HostSession | null) {
    if (session === null || preset === null) return
    if (preset === currentPreset(session)) return
    submitPreset(preset, session)
  }
```

</details>

**依据 2 · 源码核查**：[packages/client/src/features/workspace/archived-list.ts:361-371](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/workspace/archived-list.ts#L361-L371)

删除按钮直接进入删除动作，和取消归档分开。

<details>
<summary>查看原文（11行）</summary>

```text
  function onAction(event: Event) {
    const target = event.target instanceof Element ? event.target : null
    if (target === null || container === null) return
    const button = target.closest('button')
    const row = target.closest(`.${ROW_CLASS}`)
    if (button === null || row === null || !container.contains(row)) return
    const id = row.getAttribute('data-session-id')
    if (id === null) return
    event.stopPropagation()
    if (button.classList.contains(UNARCHIVE_CLASS)) deps.actions.unarchive(id)
    else if (button.classList.contains(DELETE_CLASS)) deps.actions.remove(id)
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/workspace/workspace-view.ts:65-76](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/workspace/workspace-view.ts#L65-L76)

归档注册表的取消动作与浏览器删除请求路径分离。

<details>
<summary>查看原文（12行）</summary>

```text
      /** Take the conversation back to 进行中 through the host's workspace service; the archive set's own subscription drops the row. */
      unarchive(id) {
        const service = workspaces
        if (service === null || typeof service.unarchiveSession !== 'function') throw new Error('workspace: host unarchiveSession is unavailable')
        service.unarchiveSession(id).then(() => {
          list.sync()
        }).catch((reason: unknown) => {
          console.warn('dsh-claude-style: session unarchive rejected:', reason)
        })
      },
      remove: (id) => actions.removeArchived(id),
    },
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/workspace/archived-actions.ts:34-58](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/workspace/archived-actions.ts#L34-L58)

POST、成功刷新与 409/异常呈现。

<details>
<summary>查看原文（25行）</summary>

```text
  /**
   * Delete one stored session. A missing directory or an old host's JSON 404
   * counts as already gone; 409 keeps the row because the agent still holds it,
   * and every other refusal shows the route's message.
   */
  function removeArchived(id: string) {
    fetch(SESSION_DELETE_ROUTE, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ sessionId: id }),
    }).then(response => response.json().then((result: HostAnswer) => ({ status: response.status, result }))).then(({ status, result }) => {
      if (result?.ok === true || (status === 404 && result?.error === 'session not found')) {
        refreshSessions()
        return
      }
      const refusal: Error & { status?: number } = new Error(String(result?.error || `HTTP ${status}`))
      refusal.status = status
      throw refusal
    }).catch((reason: { status?: number, message?: string }) => {
      console.warn('dsh-claude-style: session delete rejected:', reason)
      notifyToast(reason?.status === 409
        ? copy('archiveDeleteOpen')
        : copy('archiveDeleteFailed', { detail: reason?.message ?? String(reason) }))
    })
```

</details>

**依据 5 · 源码核查**：[packages/engine/node/http.ts:7-29](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/engine/node/http.ts#L7-L29)

连接层优先和环回降级边界。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Plugin routes do not inherit `/api` authentication. Prefer `connection.requestRejection`;
 * without it require a loopback peer and Host, same-site marker and matching Origin.
 * The socket peer is mandatory because request headers alone cannot establish locality.
 */
export function refusalOf(ctx: DshContext, req: DshRequest) {
  const connection = ctx.get('connection')
  if (typeof connection?.requestRejection === 'function') return connection.requestRejection(req)
  if (!isLoopbackPeer(req.socket.remoteAddress)) return 403
  const host = req.headers.host
  if (host !== undefined) {
    // A Host header that is no host name at all is refused.
    if (!URL.canParse(`http://${host}`)) return 403
    const name = new URL(`http://${host}`).hostname
    if (name !== 'localhost' && name !== '[::1]' && !/^127\.\d+\.\d+\.\d+$/.test(name)) return 403
  }
  const site = req.headers['sec-fetch-site']
  if (site !== undefined && site !== 'same-origin' && site !== 'none') return 403
  const origin = req.headers.origin
  if (origin === undefined) return undefined
  if (!URL.canParse(origin)) return 403
  return new URL(origin).host === host ? undefined : 403
}
```

</details>

**依据 6 · 源码核查**：[packages/host/src/routes.ts:136-151](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/routes.ts#L136-L151)

会话服务缺失与状态不可读分别有不同处理。

<details>
<summary>查看原文（16行）</summary>

```text
function sessionIsLive(ctx: DshContext, sessionId: string): boolean {
  const sessions = ctx.get('sessions')
  // A host with no sessions service holds nothing open.
  if (sessions === null || sessions === undefined) return false
  if (typeof sessions.get === 'function') {
    const found = sessions.get(sessionId)
    return found !== undefined && found !== null
  }
  if (typeof sessions.list === 'function') {
    const listed = sessions.list()
    if (Array.isArray(listed)) {
      return listed.some((item) => (typeof item === 'string' ? item : item?.id ?? item?.sessionId) === sessionId)
    }
  }
  return true
}
```

</details>

**依据 7 · 源码核查**：[packages/host/src/routes.ts:181-210](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/routes.ts#L181-L210)

鉴权、请求体、ID 与初次活跃检查。

<details>
<summary>查看原文（30行）</summary>

```text
async function deleteSession(ctx: DshContext, req: DshRequest, res: DshResponse) {
  const refused = refusalOf(ctx, req)
  if (refused !== undefined) {
    sendJson(res, refused, { ok: false, error: refused === 401 ? 'unauthorized' : 'forbidden' })
    return
  }
  const raw = await readRequestBody(req, DELETE_BODY_MAX)
  if (raw === null) {
    // An oversized body leaves its remainder unread: the socket is ended once
    // this request's answer is out, never before it.
    res.once('finish', () => req.destroy())
  }
  let request = null
  try {
    request = raw === null ? null : JSON.parse(raw.toString('utf8'))
  } catch {
    // A body that is not JSON is the client's error: the id check below answers 400.
    request = null
  }
  const sessionId = request !== null && typeof request.sessionId === 'string' ? request.sessionId : ''
  if (!SESSION_ID_RE.test(sessionId)) {
    sendJson(res, 400, { ok: false, error: 'invalid session id' })
    return
  }
  // The id is looked up under the name the storage holds it under, never under
  // its own spelling: `:` and `@` in a plugin-generated id are escaped there.
  const storedName = sessionDirectoryName(sessionId)
  if (sessionIsLive(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'session is open' })
    return
```

</details>

**依据 8 · 源码核查**：[packages/host/src/routes.ts:224-247](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/routes.ts#L224-L247)

根目录实路径检查、二次活跃检查、删除后才清理归档。

<details>
<summary>查看原文（24行）</summary>

```text
  if (dir === null) {
    await unarchiveSession(ctx, sessionId)
    sendJson(res, 200, { ok: true, ghost: true })
    return
  }
  // The comparison has to be between resolved paths: an entry inside the root
  // that is itself a symlink carries a recursive removal out of it, and
  // `resolve` only normalizes the spelling (D75).
  const realRoot = realpathSync(root)
  if (!realpathSync(dir).startsWith(realRoot + sep)) {
    sendJson(res, 403, { ok: false, error: 'session directory outside the sessions root' })
    return
  }
  // A session opened while the scan above ran is live by now, and the first
  // check could not see it: asking again leaves only the gap between this check
  // and the removal.
  if (sessionIsLive(ctx, sessionId)) {
    sendJson(res, 409, { ok: false, error: 'session is open' })
    return
  }
  // A storage fault propagates to the route's 500 answer, carrying the OS error.
  rmSync(dir, { recursive: true, force: true })
  await unarchiveSession(ctx, sessionId)
  sendJson(res, 200, { ok: true, ghost: false })
```

</details>

**依据 9 · 源码核查**：[packages/host/src/routes.ts:460-469](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/routes.ts#L460-L469)

路由只允许 POST，失败走通用错误响应。

<details>
<summary>查看原文（10行）</summary>

```text
    register('session delete', {
      kind: 'exact',
      path: SESSION_DELETE_PATH,
      handler: (req: DshRequest, res: DshResponse) => {
        // POST only: the browser half sends one id, and a GET must never
        // reach the filesystem.
        if (methodRefused(req, res, ['POST'])) return
        // A fault anywhere in the deletion answers 500 with its message.
        void deleteSession(ctx, req, res).catch((error: unknown) => fail(res, error))
      },
```

</details>

#### 缺口

- 未核对目标宿主版本的连接授权、共享部署及会话 reopen 并发行为。
  **影响**：不能从插件边界推断多用户部署隔离，也不能保证 500 代表未删。
  **进一步探讨**：在独立数据目录核对未授权请求、活跃会话、并发 reopen 和删除后归档清理失败四类路径。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁可以试用，实际接入和退出有哪些前提？

**研究主题**：依赖、兼容与流程、采用判断

#### 完整回答

可控对象是独立本地 Web profile 中反复看长对话、愿意保留原生界面作退路的 DSH 用户。包配置声明宿主最低 0.2.2-rc.1，Cordis patch 把客户端加入 Web roster，宿主 apply 另注册路由、设置与用量。没有 webServer 或某条路径被占用时路由可能单独缺失。客户端读取官方设置服务，负责主题样式、部件标记、延迟功能与调度器。单项安装失败可被隔离，调度器启动失败则撤回皮肤。卸载顺序先停偏好监听，再逆序拆功能并移除主题属性与样式。其他皮肤接管时可选择保留少量功能，所以退让与全停用应分别验收。首次成本在建立隔离 profile、记录宿主及浏览器版本、先核对相同测试会话。持续成本在宿主升级后复查 DOM、浮层和按键，以及留意 Sodium 的改写状态。遇到焦点、权限或会话列表异常就禁用插件、重载并回原生界面核对；若发生实际数据写入，则需另核对宿主记录和备份，不能把主题退出当作数据恢复。固定材料未支持持续安装结论。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:67-80](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/README.md#L67-L80)

作者给出安装方式、重启和仅启用一个主题的条件。

<details>
<summary>查看原文（14行）</summary>

````text
官方插件页添加这个包名，或从终端安装：

```
dsh-claude-style
```

```bash
dsh plugin --profile web add dsh-claude-style                    # npm 包（推荐）
dsh plugin --profile web add Nwflower/dsh-claude-style#dist      # GitHub 发布分支
```

也可从[插件市场](https://github.com/dsh-market/dsh-market)或 dsh-web-all 的皮肤中心安装。同一时刻只启用一个主题；

需要 dsh ≥ 0.2.2-rc.1，装好后重启 DeepSeek Harness。
````

</details>

**依据 2 · 源码核查**：[package.json:33-49](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/package.json#L33-L49)

客户端导出、宿主版本门槛及 Web 平台。

<details>
<summary>查看原文（17行）</summary>

```text
  "exports": {
    ".": "./lib/host/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json",
    "./locale/*": "./locale/*"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.2-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/cordis.patch.yml#L1-L4)

向 Web roster 插入客户端条目。

```text
# Claude Code Desktop theme bundle patch: inserts its dsh.client row into the web roster.
- insert:
    - id: ui-skin-claude-style
      name: 'dsh-claude-style'
```

**依据 4 · 源码核查**：[packages/host/src/index.ts:21-38](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/index.ts#L21-L38)

独立挂载宿主路由、设置与用量。

<details>
<summary>查看原文（18行）</summary>

```text
export const name = PACKAGE_NAME
export { Config } from './settings.js'

/**
 * Register the plugin's host surfaces.
 * @param ctx - host plugin context.
 */
export function apply(ctx: DshContext) {
  // The property read inside registerRoutes (`scope.webServer`) is gated by the
  // fiber's inject declaration, and the host half re-applies while the web
  // server is already running (a hot relink after a client-bundle rebuild), so
  // the scope comes from inject; a host without it still activates the skin.
  if (typeof ctx.inject === 'function') ctx.inject(['webServer'], (scope: DshScope) => { registerRoutes(ctx, scope) })
  else registerRoutes(ctx, ctx as DshScope)

  registerSettings(ctx)
  registerWidgetUsage(ctx)
}
```

</details>

**依据 5 · 源码核查**：[packages/host/src/routes.ts:269-304](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/host/src/routes.ts#L269-L304)

webServer 缺失和单路由注册错误的隔离。

<details>
<summary>查看原文（36行）</summary>

```text
  scope.effect(() => {
    const disposers: (() => void)[] = []
    const report = (message: string, error: unknown) => ctx.logger?.warn?.(`${PACKAGE_NAME}: ${message}: ${(error as { message?: string } | null)?.message ?? String(error)}`)

    /**
     * Register one route. The web server refuses a path another plugin already
     * holds by throwing; that refusal is reported and the other routes still
     * register, because a throw here would fail this fiber and drop the client
     * bundle — the whole skin — with it (D12). A host without a web server
     * registers nothing, and nothing below is built for it.
     */
    const server = scope.webServer
    if (server === undefined || server === null) {
      report('web server unavailable', new Error('the host carries no webServer service, so no route of this plugin is registered'))
      return
    }
    const usage = createUsage(ctx)
    const hdsl = createHdslAccount(ctx)
    const sessionSearch = createSessionSearch(ctx)
    const peakrate = createPeakRate(ctx)
    const prices = createPrices(ctx)
    const sessionCost = createSessionCost(ctx, prices)
    // The listener is what makes a total O(1) after the first read; the
    // snapshot loads on the first ask, so a reader who never opens the figures
    // never reaches the repository.
    sessionCost.ensure()

    const register = (label: string, route: DshRoute) => {
      try {
        const dispose = server.register(route)
        // A register that answers nothing has nothing to dispose; a rejection
        // is what the catch below reports.
        if (typeof dispose === 'function') disposers.push(dispose as () => void)
      } catch (error) {
        report(`${label} route unavailable`, error)
      }
```

</details>

**依据 6 · 源码核查**：[packages/client/src/entry.ts:109-148](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L109-L148)

退出逆序清理和移除主题样式。

<details>
<summary>查看原文（40行）</summary>

```text
  function release(keep: string[] = []) {
    // First, so no preference flip installs a feature mid-release.
    if (offSwitches !== null) {
      offSwitches()
      offSwitches = null
    }
    const kept = []
    for (let i = installed.length - 1; i >= 0; i--) {
      if (keep.includes(installed[i].id)) {
        kept.push(installed[i])
        continue
      }
      // One teardown must not block the rest (D12); a failing one is reported.
      try { installed[i].stop() } catch (error) { reportError(error) }
    }
    installed = kept.reverse()
    // Each body attribute goes with whoever writes it: a feature's own with
    // its teardown above, the preference mirror's here, the stamps last.
    clearPrefsAttributes()
    body.removeAttribute('data-dsh-claude-style')
    body.removeAttribute(HANDOFF_ATTR)
    // The visibility mark is the sheet's to read, so it goes before the sheet does.
    if (stopVisibility !== null) {
      stopVisibility()
      stopVisibility = null
    }
    // This generation's own sheet, handed over rather than taken away when a
    // newer generation has mounted after it (mountStylesheet). The carried layer
    // goes with it: it is this sheet's own zoom those cards are carried under.
    if (stopScale !== null) {
      stopScale()
      stopScale = null
    }
    if (stopStylesheet !== null) {
      stopStylesheet()
      stopStylesheet = null
    }
    if (stopWebfonts !== null) {
      stopWebfonts()
      stopWebfonts = null
```

</details>

**依据 7 · 源码核查**：[packages/client/src/entry.ts:163-189](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L163-L189)

宿主 effect 绑定整代回收并关闭订阅。

<details>
<summary>查看原文（27行）</summary>

```text
  function teardown() {
    if (disposed) return
    disposed = true
    if (offOwnerWatch !== null) {
      offOwnerWatch()
      offOwnerWatch = null
    }
    release()
    if (offPeerWatch !== null) {
      offPeerWatch()
      offPeerWatch = null
    }
    if (stopExternalControls !== null) {
      stopExternalControls()
      stopExternalControls = null
    }
    // The seats' shared body watch belongs to this generation: a page handed
    // back keeps no subscription, and a later generation opens its own.
    closeHostSeats()
    setHostContext(null)
    disposePrefsBinding()
  }

  // Registered before anything is installed: registered last, a feature that
  // threw half-way through left the stylesheet and every listener installed
  // so far on the page with no teardown the host could ever run.
  ctx.effect(() => teardown, 'dsh-claude-style: Claude Code desktop theme')
```

</details>

**依据 8 · 源码核查**：[packages/client/src/entry.ts:269-289](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L269-L289)

异步加载后再检查是否应继续安装。

<details>
<summary>查看原文（21行）</summary>

```text
  function belongs(feature: Feature) {
    if (disposed || failed.has(feature.id) || installed.some(entry => entry.id === feature.id)) return false
    if (owner !== null && !KEPT_FOR[owner].includes(feature.id)) return false
    return !isLive(feature) || isWanted(feature)
  }

  /**
   * Fetch a deferred feature's chunk once and install the feature on arrival
   * if it still belongs. A chunk that cannot load is the feature failing to
   * install: reported once, and the feature retires (D12).
   */
  function awaitFeature(feature: Feature, chunk: string) {
    if (awaited.has(feature.id)) return
    awaited.add(feature.id)
    loadFeatureChunk(chunk).then((run) => {
      awaited.delete(feature.id)
      arrived.set(feature.id, run)
      if (!belongs(feature)) return
      install(feature.id, handleName(feature), () => run(ctx, ui))
      // The feature's handle joins the next pass, which nothing else asks for.
      if (typeof ui.schedule === 'function') ui.schedule()
```

</details>

**依据 9 · 源码核查**：[packages/client/src/entry.ts:336-343](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L336-L343)

向其他皮肤让渡时显式保留部分功能。

```text
  function yieldTo(next: PageOwner) {
    const keep = KEPT_FOR[next]
    for (const feature of FEATURES) {
      if (!keep.includes(feature.id) || failed.has(feature.id) || installed.some(entry => entry.id === feature.id)) continue
      installFeature(feature)
    }
    release(keep)
  }
```

**依据 10 · 源码核查**：[packages/client/src/entry.ts:391-417](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/entry.ts#L391-L417)

功能接线、调度失败整体回收、设置服务绑定。

<details>
<summary>查看原文（27行）</summary>

```text
    for (const feature of FEATURES) {
      if (failed.has(feature.id) || installed.some(entry => entry.id === feature.id)) continue
      if (isLive(feature)) applySwitch(feature)
      else installFeature(feature)
    }
    if (offSwitches === null) {
      offSwitches = subscribePrefs(() => {
        for (const feature of live) applySwitch(feature)
        if (typeof ui.schedule === 'function') ui.schedule()
      })
    }
    // Last: its passes read the `ui` handles lazily. Without it nothing syncs,
    // and a live stylesheet over overrides that never run is worse than no
    // skin at all — so if it cannot install, the whole skin rolls back.
    if (installed.some(entry => entry.id === 'scheduler')) return
    if (!install('scheduler', null, () => installScheduler(ctx, ui, handleNames))) teardown()
  }

  setHostContext(ctx)
  stopExternalControls = installExternalControls({ 'model-picker': options => mountModelPicker(ctx, options) })
  // Bind the official settings form before anything reads a preference:
  // the host serves namespaces through `ctx.configForms`. Bound once here,
  // and retried when the settings page installs.
  adoptSettingsForm(ctx)
  // The service can mount after this plugin: wait for it declaratively and
  // bind then, so the first settings change never meets an unbound store.
  if (typeof ctx.inject === 'function') ctx.inject(['configForms'], () => { adoptSettingsForm(ctx) })
```

</details>

#### 缺口

- 未验证安装、卸载、设置故障或与第三方界面插件共存。
  **影响**：功能可见性和恢复步骤只能作为试用验收条件。
  **进一步探讨**：固定版本并用隔离 profile 检查冷启动、开关切换、主题交接和全停用后的焦点、菜单、会话状态。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可否把长会话优化收敛为低风险的可独立验收方案？

**研究主题**：新假设与验证

#### 完整回答

一个待检验的方向是把记忆离屏行高度和改写宿主 CSS 分开验收，以宿主恢复成本决定是否启用后者。现有行高跳过没有独立用户开关，Sodium 已有实验性设置，需在实验分支加入行高开关才能独立估计效应。固定相同宿主、浏览器、长对话和切换脚本，比较原生、主题两项关闭、仅行高优化、仅 Sodium 和两项皆开。分别记录冷进入、暖切换和持续生成的布局时间及峰值内存，另验收展开工具行、焦点、滚动锚点和停用后样式。测量时故意更换窗口宽度和制造同表外部改写，验证缓存失效与恢复边界。如果单行高方案与两项同开差异落在重复采样噪声内，或后者无法恢复可操作性，保留更窄的适配范围。如果行高方案也引起可重复跳位，假设同样不成立。

#### 证据与依据

**依据 1 · 源码核查**：[packages/client/src/features/row-skip/row-skip.manifest.ts:3-9](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-skip.manifest.ts#L3-L9)

行高功能在当前版本无单项开关。

```text
export default {
  id: 'rowSkip',
  order: 257,
  contracts: ['chat.user-row', 'chat.process-answer', 'chat.node-key', 'chat.group-part', 'chat.streaming'],
  ungated: '离屏的对话行按它上一次真实排版的高度跳过排版，切换回同一个会话时不会因估算高度跳位；它是长会话的性能基础，不交给读者开关',
  stylesheets: [{ file: 'row-skip.css', rank: 55 }],
  cases: [],
```

**依据 2 · 源码核查**：[packages/client/src/features/sodium/sodium.manifest.ts:9-19](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/sodium.manifest.ts#L9-L19)

改写模块已暴露实验性偏好和状态。

<details>
<summary>查看原文（11行）</summary>

```text
  stylesheets: [{ file: 'sodium.css', rank: 255 }],
  settingsRows: [{
    tab: 'general',
    rank: 50,
    pref: 'sodium',
    title: 'sodiumTitle',
    desc: 'sodiumDesc',
    switch: { on: SODIUM_ON, off: SODIUM_OFF },
    status: 'sodium-rules',
    experimental: true,
  }],
```

</details>

**依据 3 · 源码核查**：[packages/client/src/features/row-skip/row-skip.ts:55-64](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/row-skip/row-skip.ts#L55-L64)

提供可用于故障注入的签名失效边界。

<details>
<summary>查看原文（10行）</summary>

```text
  /** The things a kept height stands for: the column's width and the interface text's size. */
  const currentSignature = () => `${Math.round(width)}|${document.body.getAttribute(INTERFACE_FONT_SIZE_ATTR) ?? ''}`

  /** A kept height holds only for the layout it was taken at. */
  const syncSignature = () => {
    const next = currentSignature()
    if (next === layoutSignature) return
    layoutSignature = next
    heights.clear()
  }
```

</details>

**依据 4 · 源码核查**：[packages/client/src/features/sodium/sodium-engine.ts:166-175](https://github.com/Nwflower/dsh-claude-style/blob/f3f6e4c8f74c1fd63f4ee0cab2e3e80f41ab725a/packages/client/src/features/sodium/sodium-engine.ts#L166-L175)

共享样式被其他写入者改动后有恢复反例。

<details>
<summary>查看原文（10行）</summary>

```text
    stop() {
      if (!on) return
      on = false
      // A rule another writer changed since keeps its rewritten selector, and the
      // marks come off below: from here on it matches nothing, so it is named.
      const stranded = held.flatMap(({ adapter, rules }) => restoreRewrite(rules).map((entry) => `${adapter.sheet} · ${entry.rewritten}`))
      held = []
      keep([])
      publish()
      if (stranded.length > 0) reportError(new Error(`sodium: ${stranded.join('; ')} no longer read as the rewrite left them and stay written`))
```

</details>

#### 缺口

- 无拆分实验，也无两种优化在不同浏览器上的等价性材料。
  **影响**：无法确定可以在何种环境只保留一项机制。
  **进一步探讨**：按五组固定输入重复采样，先设交互一致性验收，再比较布局耗时和内存。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
