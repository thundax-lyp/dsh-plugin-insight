# dsh-pet-remielle

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[b502cf8](https://github.com/Gin-7/dsh-pet-remielle/tree/b502cf886707647fef2ac27320ae03b80d75223f)

<!-- BEGIN META -->
[![GitHub ★ 63](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=63&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Gin-7/dsh-pet-remielle) [![npm 30d 3,042](https://img.shields.io/static/v1?label=npm+30d&message=3%2C042&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-remielle) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-remielle)
<!-- END META -->

> **功能**：以 DSH 会话事件驱动桌宠气泡和提醒，提供会话跳转、可选桌面窗与余额显示。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持真实事件、未读生命周期和集中角色提示的组合增量。状态机、SSE、轮询与Electron是既有技术，价值在DSH多会话接线，不等于更强推理或业务交付。

> **主要限制**：[Q02](#research-q02)、[Q03](#research-q03)的关键边界是提示状态不等于宿主事实。无事件3分钟可合成已停止，审批广播delivered和DOM点击不等最终批准，且未绑定原始request key；重要操作应回原生页面确认。

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
  - [Q01 · 事件桌宠相对动画皮肤与会话列表增加什么？](#detail-section-11)
  - [Q02 · 断线、结束与无事件状态如何恢复？](#detail-section-12)
  - [Q03 · 允许一次按钮是否意味着对应审批已成功？](#detail-section-13)
  - [Q04 · 桌面、余额与一键更新有哪些额外成本和副作用？](#detail-section-14)
  - [Q05 · 什么人值得小范围试用，怎样证明通知确实有用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：面向同时运行多个会话、容易漏掉待处理状态的DSH用户，把真实事件摘要集中到宠物气泡；动画和完成提示不代替原生任务验收。

相对静态动画皮肤有真实会话来源，相对轮流查看原生列表集中待处理提示；原生会话仍是状态和审批结果核对入口，见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 事件气泡与会话汇总 | 集中多会话待处理提示 | 完成是回合状态，不代替业务验收 |
| 状态SSE与轮询 | 断线后收敛显示 | 超时看门狗可推断停止，需原生核对 |
| 会话跳转与审批快捷入口 | 打开对应会话并点原生按钮 | 广播和点击不等最终审批，未绑定请求key |
| 可选桌面浮窗 | 离开网页时展示宠物 | 默认关，依赖Electron与ready握手 |
| 可选余额与用量 | 显示账户观测值 | ledger/旧值不等单会话精确账单 |
| 一键更新 | 修改本机插件安装 | git/pnpm有副作用，失败不保证自动回滚 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH sessions与Web服务 | 网页提示必需 | 事件订阅、状态与SSE | 不可把静态动画当真实任务状态 |
| 原生会话DOM和审批按钮 | 快捷审批才需 | 跳转后查找允许一次 | 本地广播不等审批成功，失败回原生操作 |
| Electron及认证URL | 桌面模式才需 | 独立置顶窗 | 默认关闭，无ready保留网页显示 |
| 平台账户或token | 余额/精确用量才需 | 查询余额与用量 | 失败可能退ledger或旧值，非单会话账单 |
| Git/pnpm及本机安装权限 | 一键更新才需 | 修改安装 | 会停桌面并写磁盘，失败可能需手动重装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 接入 | 用户仅先启用Web提示 | 原生会话与气泡一致，不先开全部扩展 |
| 运行 | Host消费事件并推送 | 断线轮询/重连，长静默需回原生核对 |
| 处理 | 用户点提示打开会话 | 核对具体请求，再在原生面板审批 |
| 退出 | 关闭桌面并禁用插件 | 核对窗口消失且原生会话继续可访问 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 网页素材与可选Electron下载未知 | 装包、核对事件与默认配置 | 桌面默认关闭 |
| 持续 | SSE/轮询/动画资源未知；余额不等单任务成本 | 响应提示与原生核对，工时未测 | 未证实减少漏处理 |
| 失败恢复 | 重连、窗口和排障资源未知 | 核对启发式停止、实际审批和安装状态 | 不能从delivered推断成功 |
| 升级退出 | git/pnpm写安装，可需重装 | 先停窗、重启和禁用核对 | 没有完整自动回滚保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 多会话关注 | 真实事件到气泡和跳转有接线 | 漏处理、响应延迟与干扰改善 |
| 状态恢复 | 重连、轮询与超时收尾 | 长静默误判率与实际任务状态一致性 |
| 余额和审批 | 有来源退路与操作入口 | 精确账单和原生请求最终成功 |

> **思考**：[Q02](#research-q02)、[Q03](#research-q03)的关键边界是提示状态不等于宿主事实。无事件3分钟可合成已停止，审批广播delivered和DOM点击不等最终批准，且未绑定原始request key；重要操作应回原生页面确认。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)支持真实事件、未读生命周期和集中角色提示的组合增量。状态机、SSE、轮询与Electron是既有技术，价值在DSH多会话接线，不等于更强推理或业务交付。

纯reducer、真实事件、未读清理、SSE/轮询双通道和不延迟重放审批值得借鉴；启发式看门狗状态与有回执的宿主事实须区分。更新失败自检是提示边界而非回滚，见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02)、[Q03](#research-q03)的关键边界是提示状态不等于宿主事实。无事件3分钟可合成已停止，审批广播delivered和DOM点击不等最终批准，且未绑定原始request key；重要操作应回原生页面确认。

<a id="detail-section-6"></a>

### 1.5 使用建议

先在无重要副作用的并发任务上只试网页提示，保留原生列表作为核对入口。不要从宠物已停止推断宿主已取消，也不要从投递成功推断审批通过；关键操作回原生面板看清请求。桌面、余额和一键更新逐项另验；发生误示、跳错或打断则关闭桌面并禁用插件。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码事件、呈现、审批桥和可选扩展；没有实际宿主、平台或任务效果测试。状态证据分离是未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/client.core.js、src/pet-reducer.js、src/turn-watchdog.js、src/local-access.js、src/desktop-window.js、src/balance.js、src/self-update.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：源码抽读会话事件接线、客户端状态与审批桥、超时看门狗、本机路由、桌面ready、余额和更新关键路径；未逐一验证所有宠物素材和平台代码。
- 下一步：未运行插件、目标测试、安装、桌面窗口、账户查询、审批或更新；无宿主与多任务效果证据。源码推断的长静默误示条件未实际复现。

**分析版本**

- **仓库**：[Gin-7/dsh-pet-remielle](https://github.com/Gin-7/dsh-pet-remielle)
- **版本号**：0.4.7（[固定提交 b502cf8](https://github.com/Gin-7/dsh-pet-remielle/tree/b502cf886707647fef2ac27320ae03b80d75223f)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05)提出未验证方向，将真实事件确认结束与长时间未收事件明确区分，后者显示来源时间和未知状态。用长静默、断线、重启任务对照误判、响应延迟与打断次数；无改善或新增噪声更高则否定，不计入已有贡献。

未运行插件、目标测试、安装、桌面窗口、账户查询、审批或更新；无宿主与多任务效果证据。源码推断的长静默误示条件未实际复现。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 839 | — | — | 22771 |
| .js | source | 14 | 12568 | 10185 | 2024 | — |
| .mjs | source | 2 | 499 | 310 | 174 | — |
| .cjs | source | 9 | 1919 | 1416 | 421 | — |
| .js | test | 35 | 7608 | 6176 | 914 | — |
| .mjs | test | 2 | 370 | 332 | 28 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Gin-7/dsh-pet-remielle/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断事件桌宠能否帮助多会话用户发现待处理状态及操作与恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 事件桌宠相对动画皮肤与会话列表增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

Remielle面向同时运行多个DSH会话、容易错过待审批、提问或后台结束的用户。它订阅真实session/event与session/disposed，将事件交给reducer，再通过状态快照/SSE送到网页桌宠和可选桌面窗。相对静态宠物皮肤，表情和气泡有会话事件来源；相对用户轮流查看会话列表，它把待处理状态集中到一个可点击的可见入口，合格结果应是及时找到正确会话并在原生页面确认，而不是宠物动画代表业务任务正确完成。

完成通知在新turn/start或tool/call时被清除，错误在当前会话可能直接视为已读；这体现提示生命周期与宿主事件的关联。底层状态机、SSE、轮询和Electron是成熟技术，本组件增量是把事件优先级、未读与角色形象接到DSH工作界面，不是更强Agent推理。

单会话且始终盯着原生页面的人可能只得到装饰价值；多会话通知是否真的降低漏处理、桌宠是否反而干扰专注，需要同条件记录，不能由真实事件来源直接推导用户效率提升。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-16](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/README.md#L7-L16)

作者说明真实会话事件、SSE和可选桌面窗定位。

<details>
<summary>查看原文（10行）</summary>

```text
由 **DSH 真实会话事件**驱动的多宠物网页桌宠：桌宠实时跟随 DeepSeek Harness 的任务进展，以贴纸动画 + 状态气泡呈现。

- 多宠物注册表 + 状态气泡（项目 / 阶段 / 待办 / 进度实时汇报）
- SSE 实时推送 + 可选的桌面悬浮窗（随包 Electron，透明置顶）
- 双击画画联动：粗笔刷揭示作品图（绘制中 → 得意中 → 淡出）
- 一键版本检查 + 增量更新
- 设置页与插件详情页共用设置（外观 / 宠物 / 行为 / 桌面悬浮 / 关于）

> 兼容 DeepSeek Harness（含其分支）的 web profile；桌面悬浮模式默认关闭，可按需开启。桌面模式要求 DSH `>= 0.1.2-alpha.1`，以提供带 token 的认证根 URL。

```

</details>

**依据 2 · 源码核查**：[src/index.js:1313-1343](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L1313-L1343)

事件订阅、reducer、完成清理和错误已读接线。

<details>
<summary>查看原文（31行）</summary>

```text
  const offEvent = eventCtx.on('session/event', (session, event) => {
    const eventType = String(event?.type ?? '')
    // 子会话 id 记账：供「响应子 Agent」关闭时清理残留完成卡（见 subagentSessionIds）。
    if (isSubagent(session)) {
      const subagentId = completionSessionIdOf(session)
      if (subagentId) subagentSessionIds.add(subagentId)
    }
    // 看门狗活跃度：任何事件都刷新该会话的「最近活动」时间戳；
    // turn/end 已收尾回合，条目随之移除，不再参与悬挂判定。
    watchdog.feed(completionSessionIdOf(session))
    if (eventType === 'turn/end') watchdog.end(completionSessionIdOf(session))
    if (eventType === 'turn/start' || eventType === 'tool/call') dropCompletion(session)
    const outgoing = [...reducer.handle(session, event)]
    const sessionId = completionSessionIdOf(session)
    const currentFailed = eventType === 'turn/end'
      && sessionId
      && sessionId === currentSessionNow()
      && reducer.states().some((entry) => entry.sessionId === sessionId && entry.state === PetState.ERROR)
    // 失败发生时人已经在这个对话里：当场已读，不进粉圈提醒。
    if (currentFailed) outgoing.push(...reducer.dismissError(sessionId))
    for (const message of outgoing) onMessage(message)
    if (outgoing.length || currentFailed || eventType === 'session/title') hub.broadcast()
  }, { global: true })
  const offDisposed = eventCtx.on('session/disposed', (session) => {
    dropCompletion(session)
    watchdog.end(completionSessionIdOf(session))
    for (const message of reducer.disposeSession(session)) {
      onMessage(message)
      hub.broadcast()
    }
  }, { global: true })
```

</details>

**依据 3 · 源码核查**：[src/client.core.js:2180-2201](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/client.core.js#L2180-L2201)

顶层任务与其余会话的汇总背板呈现。

<details>
<summary>查看原文（22行）</summary>

```text
    // 文字与图标——同级会话的 updatedAt 轮转因此不会造成背景卡闪换。
    // 点击背板时按当帧排序动态解析第 2 名并跳转，这里只需记住它是谁。
    var visibleEntries = ordered.slice(0, 1)
    if (ordered.length > 1) {
      backboardStabilizer.update(
        targetSessionOf(ordered[1]) || '',
        __tip.backboardTipText(ordered[1].project, ordered[1].title),
      )
      visibleEntries.push({
        sessionId: BUBBLE_BACKBOARD_ID,
        state: 'IDLE',
        message: '',
        detail: '',
        phase: '',
        updatedAt: 0,
        backboard: true,
        summaryCount: ordered.length - 1,
        backboardTip: backboardStabilizer.tip(),
      })
    } else {
      backboardStabilizer.update('', '')
    }
```

</details>

#### 缺口

- 没有多会话用户漏处理与任务切换的对照记录。
  **影响**：不能把事件驱动视为已验证效率收益。
  **进一步探讨**：用相同并发任务比较原生列表和桌宠，记录正确会话响应延迟、漏处理及干扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 断线、结束与无事件状态如何恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端用EventSource消费JSON快照，断线立即补poll并依靠EventSource重连，较慢轮询继续收敛；bootId变化会触发插件消失清理，避免把新宿主生命周期当旧连接。Host订阅结束与销毁事件并清理完成/看门狗记录，消息状态并非单靠DOM猜测。

但它也存在启发式状态。每个事件刷新最近活跃时间，看门狗每30秒检查THINKING/WORKING，3分钟没有事件便合成aborted的turn/end，让宠物回到已停止；WAITING和ERROR排除。这个动作只更改插件reducer的呈现，不是向宿主取消实际工作。长时间无事件的合法工具可能使宠物提前显示停止，这属于可由源码推断的误判条件，未在真实宿主复现。

因此SSE连通、动画待机或“已停止”都不能单独当Agent任务最终结果；用户应回到原生会话核对。事件精确与超时猜测应分开解释，尤其模型慢调用、工具静默和宿主重启时。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.core.js:2569-2598](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/client.core.js#L2569-L2598)

真实SSE、错误补poll及较慢轮询机制。

<details>
<summary>查看原文（30行）</summary>

```text
  /** Subscribe to the host SSE stream; slow the poll down to a fallback. */
  function startStream() {
    if (stream || typeof EventSource === 'undefined') return
    var source
    try {
      source = new EventSource(STREAM_ENDPOINT)
    } catch (e) {
      return
    }
    stream = source
    source.onmessage = function (e) {
      if (disposed) return
      var snapshot
      try {
        snapshot = JSON.parse(e.data)
      } catch (err) {
        return
      }
      applySnapshot(snapshot, true)
    }
    // 连接一断就立刻补一次轮询（issue #34）：插件停用时 hub.close() 掐断 SSE，
    // onerror 即时触发，配合 404 藏匿把「关插件→桌宠消失」压到一个轮询周期内，
    // 不必干等下一次 3s 定时轮询。瞬时网络抖动也只是多一次无害的 /state 请求。
    source.onerror = function () {
      if (!disposed) poll()
    }
    // EventSource reconnects on its own; the slower poll keeps convergence
    // (registry changes, dead streams) without spamming the server.
    window.clearInterval(intervalId)
    intervalId = window.setInterval(poll, STABLE_POLL_MS)
```

</details>

**依据 2 · 源码核查**：[src/client.core.js:2411-2421](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/client.core.js#L2411-L2421)

bootId变化清理及会话操作分派。

<details>
<summary>查看原文（11行）</summary>

```text
      if (seenBootId == null) seenBootId = snapshot.bootId
      else if (snapshot.bootId !== seenBootId) {
        runPluginGoneTeardown('boot-changed')
        return
      }
    }
    if (snapshot.kind === 'session-action') {
      if (snapshot.sessionId && snapshot.approve) approveSession(snapshot.sessionId)
      // 桌面悬浮窗点击气泡卡（approve=false）：仅跳转到该对话；完成卡顺带 ack。
      else if (snapshot.sessionId) openSession(snapshot.sessionId, snapshot.completed === true)
      return
```

</details>

**依据 3 · 源码核查**：[src/index.js:1345-1366](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L1345-L1366)

看门狗合成aborted事件只进入reducer。

<details>
<summary>查看原文（22行）</summary>

```text
  // Turn 悬挂看门狗：GUI 强杀会话时 DSH 不向 live 总线补发 turn/end（仅
  // 冷读日志时 repair），事件流戛然而止，reducer 永远停在 THINKING「分析阶段」。
  // 每 30 秒扫描一次：THINKING/WORKING 的会话超过 3 分钟无任何事件，即合成
  // turn/end{kind:'aborted'} 复用现有收尾路径回 IDLE「已停止」（不传 seq，
  // record.lastSeq 保持不变；stopped 文案种子经 status-copy 的 seedNumber 稳定回落）。
  // WAITING/ERROR 可合法等待很久（审批/等待回答），不判悬挂。
  // turn 序号硬编码 0 是安全的：reducer 的 aborted 分支只读 reason.kind、
  // 不校验 turn 序号（见 pet-reducer.js 的 turn/end 分支）。
  const watchdog = createTurnWatchdog()
  const watchdogTimer = setInterval(() => {
    for (const sessionId of watchdog.tick(reducer.states())) {
      watchdog.end(sessionId)
      logger.info?.(`dsh-pet-remielle: turn hung with no events, force-ending session ${sessionId} as aborted`)
      for (const message of reducer.handle(
        { header: { id: sessionId } },
        { type: 'turn/end', data: { turn: 0, reason: { kind: 'aborted' } } },
      )) {
        onMessage(message)
        hub.broadcast()
      }
    }
  }, TURN_WATCHDOG_INTERVAL_MS)
```

</details>

**依据 4 · 源码核查**：[src/turn-watchdog.js:14-55](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/turn-watchdog.js#L14-L55)

3分钟阈值、30秒周期和仅THINKING/WORKING的条件。

<details>
<summary>查看原文（42行）</summary>

```text
/** 正常流式期间 chunk 事件频繁，3 分钟无任何事件即视为 turn 悬挂。 */
export const TURN_STALL_THRESHOLD_MS = 180_000

/** 看门狗扫描周期（index.js 里 setInterval 的间隔）。 */
export const TURN_WATCHDOG_INTERVAL_MS = 30_000

function isStallProne(state) {
  return state === 'THINKING' || state === 'WORKING'
}

/**
 * 创建看门狗。`now` 可注入以便单测；`tick` 只读不写，
 * 命中列表由调用方收尾（合成 turn/end）后逐个调用 `end` 移除条目。
 */
export function createTurnWatchdog({ thresholdMs = TURN_STALL_THRESHOLD_MS, now = Date.now } = {}) {
  const lastSeenMs = new Map()
  return {
    /** 任一 session/event 到达时刷新该会话的活跃时间戳。 */
    feed(sessionId) {
      if (!sessionId) return
      lastSeenMs.set(String(sessionId), now())
    },
    /** turn/end 或 session/disposed 后回合已收尾，条目随之移除。 */
    end(sessionId) {
      if (!sessionId) return
      lastSeenMs.delete(String(sessionId))
    },
    /**
     * 扫描 reducer.states() 快照，返回超阈值且仍处 THINKING/WORKING 的
     * 会话 id 列表；未 feed 过或已 end 的会话天然不会命中。
     */
    tick(states, at = now()) {
      const stalled = []
      for (const entry of Array.isArray(states) ? states : []) {
        const sessionId = String(entry?.sessionId ?? '')
        const seen = lastSeenMs.get(sessionId)
        if (seen === undefined) continue
        if (!isStallProne(entry.state)) continue
        if (at - seen < thresholdMs) continue
        stalled.push(sessionId)
      }
      return stalled
```

</details>

#### 缺口

- 合法长静默任务、断线与重启时状态准确性未实测。
  **影响**：不能保证“已停止”对应宿主真实取消，通知可靠性尚待验证。
  **进一步探讨**：在后续授权环境模拟长静默、断网与重启，对照原生会话日志和宠物提示时间。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 允许一次按钮是否意味着对应审批已成功？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

Host的会话操作POST携带sessionId、approve和completed，广播后仅返回ok和delivered；delivered表示有接收者，不是原生审批已通过。无网页接收时只暂存跳转，不暂存approve，避免离线很久后批准旧请求，这个失败策略值得保留。

客户端收到approve后先打开目标会话，再最多约4秒尝试寻找该会话DOM中的审批面板，匹配“允许一次”或“allow once”的按钮并click。会话ID检查与多面板退路减少跨会话误点，但操作没有绑定原始approval request key，也没有在Host返回中等待原生审批结果。如果同会话请求在投递到点击之间发生变化，sessionId本身不能证明点的是最初那条请求。不能把成功广播或DOM点击当目标副作用已确认。

本地路由限制socket peer为回环或可选监听本机地址，并检查Host及Origin，防范部分跨站调用；它不是多租户用户身份隔离方案。首次使用应只把宠物当提示和跳转入口，审批仍在原生面板核对实际请求和结果；看不到请求、发生超时或重复提示时不从桌宠盲目重试。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:366-395](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L366-L395)

Host动作广播、delivered及不重放approve的边界。

<details>
<summary>查看原文（30行）</summary>

```text
export function createSessionOpenHandler({ notify, onUndelivered }) {
  return async (req, res) => {
    if (!localOnly(req, res)) return
    if (req.method !== 'POST') {
      jsonResponse(res, 405, { ok: false, error: 'method not allowed' })
      return
    }
    try {
      const body = await readJsonBody(req)
      const sessionId = typeof body.sessionId === 'string' ? body.sessionId : ''
      if (!sessionId) throw new Error('sessionId must be a non-empty string')
      const action = {
        protocolVersion: 1,
        kind: 'session-action',
        sessionId,
        approve: body.approve === true,
        // 完成卡点击：网页端需要 completed 决定是否顺带 ack
        completed: body.completed === true,
      }
      // delivered=false：当前没有任何网页客户端订阅 SSE，桌面“允许一次”的
      // 广播无人接收——调用方可以此区分成功与静默丢失。
      const delivered = notify(action) > 0
      // 没人在线：暂存最新一条，下一个 SSE 订阅者握手时重放（拉起兜底）。
      // approve:true 不暂存——审批动作时效性强，网页长时间离线后重连时
      // 自动批准可能已过时的请求，风险大于收益；宁可不重放（桌面端可重新
      // 发起），也不延迟执行。跳转类（approve:false）无此风险，照常暂存。
      if (!delivered && !action.approve && typeof onUndelivered === 'function') onUndelivered(action)
      jsonResponse(res, 200, { ok: true, delivered })
    } catch (error) {
      jsonResponse(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
```

</details>

**依据 2 · 源码核查**：[src/index.js:1687-1700](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L1687-L1700)

该handler真实注册到会话打开/审批桥。

<details>
<summary>查看原文（14行）</summary>

```text
      httpCtx.effect(
        () => registerRoute({
          kind: 'exact',
          path: SESSION_OPEN_ENDPOINT,
          handler: createSessionOpenHandler({
            notify: (payload) => {
              const delivered = hub.notify(payload)
              if (payload?.sessionId) dismissErrorIfNeeded(payload.sessionId)
              return delivered
            },
            onUndelivered: (action) => pendingActions.stash(action),
          }),
        }),
        'dsh-pet-remielle: desktop session open/approve bridge',
```

</details>

**依据 3 · 源码核查**：[src/client.core.js:1820-1866](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/client.core.js#L1820-L1866)

原生DOM审批按钮查找、会话检查和有限重试，没有request-key绑定。

<details>
<summary>查看原文（47行）</summary>

```text
  function approvalPanels(sessionId) {
    if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return []
    var roots = document.querySelectorAll('[data-conversation-session]')
    if (roots.length > 0) {
      var scoped = []
      for (var r = 0; r < roots.length; r++) {
        var root = roots[r]
        var rootSession = typeof root.getAttribute === 'function' ? root.getAttribute('data-conversation-session') : ''
        if (sessionId && rootSession !== sessionId) continue
        var found = typeof root.querySelectorAll === 'function' ? root.querySelectorAll('[data-approval-key]') : []
        for (var f = 0; f < found.length; f++) scoped.push(found[f])
      }
      return scoped
    }
    var panels = document.querySelectorAll('[data-approval-key]')
    return panels.length === 1 ? panels : []
  }
  function clickNativeAllowOnce(sessionId) {
    if (sessionId && currentSessionIdOf() !== sessionId) return false
    var panels = approvalPanels(sessionId)
    for (var p = 0; p < panels.length; p++) {
      var nodes = panels[p].querySelectorAll('button, [role="button"]')
      for (var i = 0; i < nodes.length; i++) {
        if (/(允许一次|allow once)/i.test(controlLabel(nodes[i]))) {
          nodes[i].click()
          return true
        }
      }
    }
    return false
  }
  function approveSession(sessionId) {
    // Open the conversation so ApprovalPanel mounts, then click native 「允许一次」.
    if (!sessionId || !ctx) return
    var workspace = optionalService('uiWorkspace')
    var canOpen = workspace && typeof workspace.openSession === 'function'
      || ctx.sessions && typeof ctx.sessions.open === 'function'
    if (!canOpen) return
    openSession(sessionId)
    var attempts = 80
    var tryClick = function () {
      var current = currentSessionIdOf()
      if (current === sessionId && clickNativeAllowOnce(sessionId)) return
      if (current !== sessionId) openSession(sessionId)
      if (attempts-- > 0) window.setTimeout(tryClick, 50)
    }
    window.setTimeout(tryClick, 50)
```

</details>

**依据 4 · 源码核查**：[src/local-access.js:41-54](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/local-access.js#L41-L54)

peer、Host与Origin条件，不是最终业务认证。

<details>
<summary>查看原文（14行）</summary>

```text
export function localHostOk(req, { allowLocalAddress = false } = {}) {
  const peer = req.socket?.remoteAddress
  const local = allowLocalAddress ? bareAddress(req.socket?.localAddress) : ''
  const sameMachine = isLoopback(peer) || (local !== '' && bareAddress(peer) === local)
  if (!sameMachine) return false
  const host = req.headers?.host || ''
  if (!hostMatches(host, local === '' ? '' : authorityOf(local))) return false
  const origin = req.headers?.origin
  if (origin) {
    let originHost
    try { originHost = new URL(origin).host } catch { return false }
    if (!originHost || originHost !== host) return false
  }
  return true
```

</details>

#### 缺口

- 未执行真实审批、确认回执和同会话请求切换场景。
  **影响**：不能把按钮便利升级为已验证可靠审批代理。
  **进一步探讨**：只用无副作用审批样本核对session与request标识、原生回执和超时，确认前保留原生操作。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 桌面、余额与一键更新有哪些额外成本和副作用？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

网页宠物依赖DSH会话服务和Web端，桌面模式默认关闭，需可用Electron、认证URL及本机窗口环境。Host区分进程启动和窗口ready握手；未ready会保留网页宠物，不应把进程存在当用户可见。后台窗口、素材、网络、token与平台兼容都可能增加资源和排障负担，本次未测CPU、内存或耗时。

余额有两种含义。ledger模式累计观测到的余额正向下降，可能漏掉采样间变化或混入账户其他使用；token模式查询实际平台用量，失败则回ledger。暂时网络失败会沿用旧余额并标stale，所以显示金额不能当本次会话精确成本或实时余额保证。

一键更新是本机写操作，严格POST且本地访问；更新前停桌面窗口，本地link安装执行git pull，registry执行pnpm update --latest，可越过原版本约束并运行依赖流程。失败会检查安装完整性并提示手动重装，没有完整自动回滚保证。首次只用网页提示、不开桌面/余额/自动更新可减少依赖；退出时关闭桌面模式、禁用插件并核对窗口消失及原生会话仍可访问。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:90-94](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L90-L94)

平台token与desktopMode默认false的配置。

```text
  showBubbleUsage: Schema.boolean().default(false).description('气泡中显示 DeepSeek 余额/今日已用').volatile(),
  usageMode: Schema.string().default('ledger').description('今日已用统计模式：小鲸鱼记账（ledger，免令牌）或 实时·令牌（token，需平台会话令牌）').volatile(),
  platformToken: Schema.string().default('').role('secret').description('DEEPSEEK_PLATFORM_TOKEN 平台会话令牌（实时·令牌模式需要，留空时回落到 DSH 凭据服务）').volatile(),
  desktopMode: Schema.boolean().default(false).description('桌面悬浮模式：用独立置顶窗口显示宠物（打开时如无 Electron 会自动下载运行时，下载失败则回落页面内）').volatile(),
  posX: Schema.number().default(null).description('宠物 X 位置（null = 使用默认位置）').volatile(),
```

**依据 2 · 源码核查**：[src/index.js:1400-1414](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L1400-L1414)

窗口ready后才切desktopActive，进程启动不等可见。

<details>
<summary>查看原文（15行）</summary>

```text
      // 桌面窗可见性握手：进程启动 ≠ 用户看得见。desktopActive 只在窗口主进程
      // POST /desktop/ready 后才置位；超时未回报则放弃本次启动、保留页面宠物，
      // 避免「网页宠物已隐藏、透明窗又永远不显示」的双端皆无。
      let desktopReadyTimer
      let desktopReadyReported = false
      const clearDesktopReadyTimer = () => {
        if (desktopReadyTimer !== undefined) clearTimeout(desktopReadyTimer)
        desktopReadyTimer = undefined
      }
      const markDesktopReady = () => {
        if (!desktop) return false
        desktopReadyReported = true
        clearDesktopReadyTimer()
        if (!desktopActive) { desktopActive = true; hub.broadcast() }
        return true
```

</details>

**依据 3 · 源码核查**：[src/desktop-window.js:145-178](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/desktop-window.js#L145-L178)

独立窗口进程、可选后端和renderer准入头。

<details>
<summary>查看原文（34行）</summary>

```text
/**
 * Manages the spawned pet window process. `start()` is a no-op when the
 * window already runs or when no backend was found (the browser pet stays
 * as the fallback). `stop()` tears the process down; `running` reflects whether
 * a window process is alive; `onExit` fires when the window dies and receives this instance.
 */
export class DesktopWindow {
  constructor({
    url,
    webUrl,
    backend = resolveBackend(),
    parentPid = process.pid,
    logger = console,
    spawnImpl = spawn,
    onExit,
    posX = null,
    posY = null,
    rendererHeader = null,
  } = {}) {
    if (!url) throw new Error('DesktopWindow requires a --url')
    this.url = url
    this.webUrl = webUrl
    this.backend = backend
    this.parentPid = parentPid
    this.logger = logger
    this.spawnImpl = spawnImpl
    this.onExit = onExit
    // 可选的渲染进程准入头：仅私有/下游 DSH Desktop 构建会提供（公开 DSH 没有
    // desktopBrowserAccess 服务）。存在时经 env 交给 pet-window.cjs 自注入到
    // 同源请求；缺失时窗口按普通浏览器直连宿主，公开宿主本就放行。
    this.rendererHeader = rendererHeader && typeof rendererHeader.name === 'string' && rendererHeader.name
      && typeof rendererHeader.value === 'string' && rendererHeader.value
      ? { name: rendererHeader.name, value: rendererHeader.value }
      : null
```

</details>

**依据 4 · 源码核查**：[src/balance.js:196-214](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/balance.js#L196-L214)

ledger按余额下降累计而非单会话账单。

<details>
<summary>查看原文（19行）</summary>

```text
  /** 记账模式：每次观测到余额后，用余额正差值累计当天用量（跨天自动归零并归档）。 */
  function recordLedgerUsage(currentBalance) {
    const t = todayKey()
    const led = readUsageLedger()
    if (led.date !== t) {
      if (led.date && typeof led.todayUsage === 'number') {
        led.history = led.history || {}
        led.history[led.date] = led.todayUsage
      }
      led.date = t
      led.lastBalance = currentBalance
      led.todayUsage = 0
    } else {
      const prev = typeof led.lastBalance === 'number' ? led.lastBalance : currentBalance
      if (typeof prev === 'number' && typeof currentBalance === 'number' && currentBalance < prev) {
        led.todayUsage = (typeof led.todayUsage === 'number' ? led.todayUsage : 0) + (prev - currentBalance)
      }
      led.lastBalance = currentBalance
    }
```

</details>

**依据 5 · 源码核查**：[src/balance.js:238-265](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/balance.js#L238-L265)

平台失败退ledger，临时失败旧余额标stale。

<details>
<summary>查看原文（28行）</summary>

```text
    // token：尝试平台令牌实时计算
    const u = await fetchUsage()
    if (u && u.amount !== undefined) {
      full.todayUsage = u.amount
      full.usageMode = 'token'
      return full
    }
    // 无令牌或令牌失败：回落记账模式
    full.todayUsage = led.todayUsage
    full.usageMode = 'ledger'
    return full
  }

  async function getBalance(usageMode) {
    const at = now()
    if (balanceCache && at - balanceCache.at < BALANCE_TTL_MS) {
      return balanceCache.payload
    }
    if (balanceInFlight) return balanceInFlight
    balanceInFlight = getBalancePayload(usageMode)
      .then((payload) => {
        if (payload.ok) {
          balanceCache = { at: now(), payload }
          return payload
        }
        if (payload.transient && balanceCache) {
          // transient network/API blip: keep serving the last known balance
          return { ...balanceCache.payload, stale: true, error: payload.error }
```

</details>

**依据 6 · 源码核查**：[src/self-update.js:530-571](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/self-update.js#L530-L571)

本地POST、更新互斥、停窗及git/pnpm写操作。

<details>
<summary>查看原文（42行）</summary>

```text
export async function updateHandler(req, res) {
  if (!localHostOk(req)) {
    json(res, 403, { ok: false, output: 'forbidden: update route is local-only' })
    return
  }
  // 方法必须钉死：Fetch 规范下跨源 GET/HEAD（<img src=...>、<form method=GET>）不带
  // Origin 头，mode 是 no-cors 而非 cors，于是上面三项守卫全部通过。不钉方法的话，
  // 恶意页面一个 <img> 就能触发 git pull / pnpm update（后者会跑依赖 lifecycle scripts）。
  if (req.method !== 'POST') {
    json(res, 405, { ok: false, output: 'method not allowed (POST only)' })
    return
  }
  if (updateProgress.running) {
    json(res, 409, { ok: false, output: '更新正在进行，请等待当前更新完成后再试。' })
    return
  }
  // 首次 await 前占用更新状态，覆盖停窗、执行和收尾；拒绝的请求不能重置进度。
  beginUpdateProgress()
  // 全量兜底：更新链路上任何意外异常（如包目录正处于被替换的中间态）
  // 都必须落成 500 响应——异步路由抛未处理拒绝会直接拖垮宿主进程
  try {
    const info = hooks.resolveInstall()
    // 仅版本 < 0.3.0（包名已变更）需彻底卸载重装；>= 0.3.0 的 link 与 registry 安装
    // 都支持一键增量更新（link→git pull，registry→pnpm update --latest）。
    if (needsCleanReinstallFor(info.version)) {
      json(res, 500, {
        ok: false,
        needsCleanReinstall: true,
        output: '版本低于 0.3.0，包名/行 id 已变更，无法自动增量更新。\n请先卸载当前安装、再重装最新版：\n  · 若旧版为 0.2.0 及之前：dsh plugin --profile web remove @dsh-external/dsh-client-ui-pet-remielle\n  · 若旧版为 0.2.0–0.3.0：dsh plugin --profile web remove dsh-pet-remielle\n  然后：dsh plugin --profile web add dsh-pet-remielle\n（详见 README 的升级说明。）',
      })
      return
    }
    // 先停掉桌面宠物窗并等待其退出：electron.exe 运行中会锁住插件目录内的文件，
    // 否则 pnpm/git 替换包内容时报 EPERM（link 模式的 git pull 同理）
    await quiesceDesktopWindow()
    let result
    if (info.mode === 'link' && info.repoDir) {
      result = await hooks.run('git', ['-C', info.repoDir, 'pull'], info.repoDir)
    } else if (info.profileDir && existsSync(info.profileDir)) {
      // --latest：跨出 package.json 里可能被钉死的精确版本号（如 "0.3.3"）。
      // 普通 pnpm update 只在声明范围内升级，精确锁会永远原地重装旧版却报成功。
      result = await hooks.run('pnpm', ['update', '--latest', PKG], info.profileDir)
```

</details>

**依据 7 · 源码核查**：[src/self-update.js:584-601](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/self-update.js#L584-L601)

失败完整性自检提示，不是事务回滚。

<details>
<summary>查看原文（18行）</summary>

```text
    // 失败自检：pnpm 中途被杀可能留下半成品 node_modules——旧版当下不受影响
    // （代码已加载进内存），但要立刻告诉用户磁盘上的旧安装是否还能撑到下次重启
    if (!result.ok) {
      try {
        const pkgDir = info.mode === 'link' && info.repoDir
          ? info.repoDir
          : info.profileDir
            ? `${info.profileDir}/node_modules/${PKG}`
            : null
        if (pkgDir) {
          const integrity = verifyInstallIntegrity(pkgDir)
          result.output += integrity.ok
            ? '\n\n✅ 自检：当前安装完好，旧版本可继续正常使用，稍后可重试更新。'
            : `\n\n⚠️ 自检：当前安装完整性异常（${integrity.problems.join('；')}）——旧版本重启后可能无法加载，建议到 GitHub Releases 按指引手动重装。`
        }
      } catch { /* 自检失败不影响原有错误响应 */ }
    }
    json(res, result.ok ? 200 : 500, { ok: result.ok, output: result.output.slice(-6000) })
```

</details>

#### 缺口

- 未实测桌面跨平台、余额准确性与更新失败恢复。
  **影响**：不能承诺卸载无残留、账单准确或一键升级总能恢复。
  **进一步探讨**：先以网页只读状态为基线，逐项另验桌面关闭、账户账单对齐和中断更新后的可恢复性。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么人值得小范围试用，怎样证明通知确实有用？

**研究主题**：采用判断、新假设与验证

#### 完整回答

建议有并发会话且经常需手动切回查看状态的用户，在不含敏感操作的任务上小范围试网页提示。相对原生列表，源码给出真实事件到集中提示和会话跳转的解释性增量，足以提出有条件试用；审批快捷、桌面模式、余额和更新不是试用成立的必要条件。成功应是提示对应正确会话、原生页面状态一致且待处理响应更及时，停止条件包括错误会话跳转、合法长任务被误示停止、提醒消失或桌宠明显打断工作。

由看门狗启发式与真实事件共用外观，可以提出未验证假设：将“事件确认结束”和“长时间未收到事件”在气泡中用不同文字与来源时间显示，或后者只标未知而不标停止，可能减少用户误判断。相对现状改变的是状态证据表达，不是增加桌宠动画。需要维护状态来源字段并避免新增噪声。

同一组正常结束、长静默、断线与重启任务比较当前呈现与明确未知呈现，记录误判停止次数、正确响应延迟和被提示打断次数；如果误判不减少或提示使用户更难处理任务，就否定方案。该假设未实现，也不计入插件已有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:1313-1335](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/index.js#L1313-L1335)

真实事件链路提供通知试用依据。

<details>
<summary>查看原文（23行）</summary>

```text
  const offEvent = eventCtx.on('session/event', (session, event) => {
    const eventType = String(event?.type ?? '')
    // 子会话 id 记账：供「响应子 Agent」关闭时清理残留完成卡（见 subagentSessionIds）。
    if (isSubagent(session)) {
      const subagentId = completionSessionIdOf(session)
      if (subagentId) subagentSessionIds.add(subagentId)
    }
    // 看门狗活跃度：任何事件都刷新该会话的「最近活动」时间戳；
    // turn/end 已收尾回合，条目随之移除，不再参与悬挂判定。
    watchdog.feed(completionSessionIdOf(session))
    if (eventType === 'turn/end') watchdog.end(completionSessionIdOf(session))
    if (eventType === 'turn/start' || eventType === 'tool/call') dropCompletion(session)
    const outgoing = [...reducer.handle(session, event)]
    const sessionId = completionSessionIdOf(session)
    const currentFailed = eventType === 'turn/end'
      && sessionId
      && sessionId === currentSessionNow()
      && reducer.states().some((entry) => entry.sessionId === sessionId && entry.state === PetState.ERROR)
    // 失败发生时人已经在这个对话里：当场已读，不进粉圈提醒。
    if (currentFailed) outgoing.push(...reducer.dismissError(sessionId))
    for (const message of outgoing) onMessage(message)
    if (outgoing.length || currentFailed || eventType === 'session/title') hub.broadcast()
  }, { global: true })
```

</details>

**依据 2 · 源码核查**：[src/turn-watchdog.js:45-55](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/turn-watchdog.js#L45-L55)

无事件阈值提供状态证据分离假设的依据。

<details>
<summary>查看原文（11行）</summary>

```text
    tick(states, at = now()) {
      const stalled = []
      for (const entry of Array.isArray(states) ? states : []) {
        const sessionId = String(entry?.sessionId ?? '')
        const seen = lastSeenMs.get(sessionId)
        if (seen === undefined) continue
        if (!isStallProne(entry.state)) continue
        if (at - seen < thresholdMs) continue
        stalled.push(sessionId)
      }
      return stalled
```

</details>

**依据 3 · 源码核查**：[src/client.core.js:1820-1866](https://github.com/Gin-7/dsh-pet-remielle/blob/b502cf886707647fef2ac27320ae03b80d75223f/src/client.core.js#L1820-L1866)

审批依赖DOM和重试，收窄试用到提示跳转。

<details>
<summary>查看原文（47行）</summary>

```text
  function approvalPanels(sessionId) {
    if (typeof document === 'undefined' || typeof document.querySelectorAll !== 'function') return []
    var roots = document.querySelectorAll('[data-conversation-session]')
    if (roots.length > 0) {
      var scoped = []
      for (var r = 0; r < roots.length; r++) {
        var root = roots[r]
        var rootSession = typeof root.getAttribute === 'function' ? root.getAttribute('data-conversation-session') : ''
        if (sessionId && rootSession !== sessionId) continue
        var found = typeof root.querySelectorAll === 'function' ? root.querySelectorAll('[data-approval-key]') : []
        for (var f = 0; f < found.length; f++) scoped.push(found[f])
      }
      return scoped
    }
    var panels = document.querySelectorAll('[data-approval-key]')
    return panels.length === 1 ? panels : []
  }
  function clickNativeAllowOnce(sessionId) {
    if (sessionId && currentSessionIdOf() !== sessionId) return false
    var panels = approvalPanels(sessionId)
    for (var p = 0; p < panels.length; p++) {
      var nodes = panels[p].querySelectorAll('button, [role="button"]')
      for (var i = 0; i < nodes.length; i++) {
        if (/(允许一次|allow once)/i.test(controlLabel(nodes[i]))) {
          nodes[i].click()
          return true
        }
      }
    }
    return false
  }
  function approveSession(sessionId) {
    // Open the conversation so ApprovalPanel mounts, then click native 「允许一次」.
    if (!sessionId || !ctx) return
    var workspace = optionalService('uiWorkspace')
    var canOpen = workspace && typeof workspace.openSession === 'function'
      || ctx.sessions && typeof ctx.sessions.open === 'function'
    if (!canOpen) return
    openSession(sessionId)
    var attempts = 80
    var tryClick = function () {
      var current = currentSessionIdOf()
      if (current === sessionId && clickNativeAllowOnce(sessionId)) return
      if (current !== sessionId) openSession(sessionId)
      if (attempts-- > 0) window.setTimeout(tryClick, 50)
    }
    window.setTimeout(tryClick, 50)
```

</details>

#### 缺口

- 尚无通知对照和明确未知呈现的用户结果。
  **影响**：试用不是长期安装或更高任务成功率承诺。
  **进一步探讨**：比较正确响应延迟、误判、漏处理和注意力成本；无改善或干扰更高则退出。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
