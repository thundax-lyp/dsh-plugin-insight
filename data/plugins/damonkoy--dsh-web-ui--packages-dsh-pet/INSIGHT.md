# dsh-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/DamonKoy/dsh-web-ui)
<!-- END META -->

> **功能**：在 DeepSeek Harness 网页显示随会话活动变化的宠物，可换宠物、改名、拖动和喂食。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，插件用同一全局浮层呈现宿主活动并接入本地互动记录，新建会话时也可显示，样式资产由注册表统一加载。

> **主要限制**：[Q01](#research-q01) 显示，多个会话的有效事件竞争同一个最近状态。页面收到的快照没有会话来源标识，不能用动画判断当前会话已完成。

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
  - [Q01 · 任务事件怎样成为网页上的宠物动画，用户看到了谁的进度？](#detail-section-11)
  - [Q02 · 摸宠物、喂食和模型完成轮次分别怎样记账？](#detail-section-12)
  - [Q03 · 安装和更换宠物需要哪些配套，隐藏和关闭分别停在哪里？](#detail-section-13)
  - [Q04 · 哪类用户可以试用，怎样验证活动来源提示是否更好？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢宠物动画的 DSH Web 用户可在等待模型时查看宿主最近活动，并通过摸头、喂食和更换形象进行互动。

原有 DSH 会话与工具状态可以核对具体任务进展。静态浮层可以装饰页面，本插件把宠物动作与实际会话阶段接起来。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 状态动画 | 以宠物动作表达最近会话活动 | 全局共享，短事件可能被覆盖 |
| 资产注册与更换 | 用内置或自定义图集显示宠物 | 资产需匹配 manifest，顺序影响同 ID |
| 互动和养成 | 摸头、喂食、显示亲密度 | 依帐本冷却和库存，回执不保证写盘 |
| 显示与布局 | 隐藏、召唤、拖动和更改设置 | 彻底停服务需关闭 enabled |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 支持 Cordis bundle、webServer 和设置的 DSH | 宿主加载需要 | 挂载服务和路由 | 不能完整加载 |
| DSH Web 客户端服务和组插槽 | 浮层及设置卡使用 | 挂载前端和配置 | 可能缺少设置入口 |
| 可识别宠物 manifest 及图集 | 至少一份有效资产 | 驱动动画渲染 | 无有效条目时服务抛错 |
| 宿主数据目录可写 | 跨重启保存需要 | 保存名字、库存、选择和显示设置 | 可能只保留内存变化 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者在独立环境核对插件与 Web 客户端 | 设置入口、同源资源与显示可用 |
| 观察 | 用户驱动一个测试会话的等待和工具阶段 | 对照会话状态，不凭动画确认完成 |
| 互动 | 用户试摸头、隐藏与召唤 | 确认回执和设置，必要时重启回读 |
| 退出 | 用户关闭 enabled 并按宿主界面再次核对 | 浮层和相应路由退出，留意本地数据仍在 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 安装包和图集占网络及存储 | 配置宿主与选择资产 | 环境与耗时未测 |
| 持续 | 每可见页面轮询及精灵渲染 | 确认它是否干扰或误导 | 没有 CPU、网络及体验实测 |
| 失败恢复 | 重复拉取、重载客户端和磁盘检查 | 恢复设置或禁用，核对旧记录 | 回读和恢复耗时未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 等待提示 | 官方会话事件映射动画，网页读取快照 | 不同任务同时活动时的可理解性 |
| 自定义 | 按 manifest 注册图集与显示名称 | 实际套件与资产兼容范围 |
| 持久互动 | 宿主结算且尝试保存 | 错误恢复与跨重启实际一致性 |

> **思考**：[Q01](#research-q01) 显示，多个会话的有效事件竞争同一个最近状态。页面收到的快照没有会话来源标识，不能用动画判断当前会话已完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示，插件用同一全局浮层呈现宿主活动并接入本地互动记录，新建会话时也可显示，样式资产由注册表统一加载。

将会话投影、经济规则和资产注册拆开。状态读取不会落盘；交互和轮次奖励驱动写入。自定义资产复用同一图集读法，持久化写失败时内存还能工作，但该回执无法证明跨重启已保存。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q01](#research-q01) 显示，多个会话的有效事件竞争同一个最近状态。页面收到的快照没有会话来源标识，不能用动画判断当前会话已完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议在独立 DSH Web 环境先观察一个测试会话，试隐藏、召唤与停用。需要区分多会话，或浮层遮挡界面时，关闭 enabled，用宿主会话状态确认进度。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持事件投影、全局轮询、资产选择和本地账本。当前宿主装载、显示准确性和用户体验未实测。

- 已检查：作者 README、包清单、源码路径 packages/dsh-pet/README.md、packages/dsh-pet/package.json、packages/dsh-pet/cordis.patch.yml、packages/dsh-pet/tsdown.prepare.config.ts、packages/dsh-pet/src/event-projection.ts、packages/dsh-pet/src/service.ts、packages/dsh-pet/src/client/index.ts、packages/dsh-pet/src/ledger.ts、packages/dsh-pet/src/treats.ts、packages/dsh-pet/src/persist.ts、packages/dsh-pet/src/registry.ts、packages/dsh-pet/src/routes.ts、packages/dsh-pet/src/index.ts 及固定范围 inventory；组件：packages/dsh-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：覆盖固定包的宿主与 Web 接线、事件读取、资产和本地账本。未确认实际 npm 包、宿主版本兼容、共享部署访问控制或用户体验。
- 下一步：同一个宿主开两个测试会话，交错等待、工具、完成和取消，对照可见动画和原有状态，再核对启停、可写和不可写数据目录下重启前后的快照。

**分析版本**

- **仓库**：[DamonKoy/dsh-web-ui](https://github.com/DamonKoy/dsh-web-ui)
- **版本号**：0.1.16（[固定提交 3647a33](https://github.com/DamonKoy/dsh-web-ui/tree/3647a33fa467e0335260468614f6eed04b196c38)）
- **版本日期**：2026-08-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出为宿主全局活动增加最小来源提示，用双会话对照试验判断它是否减少错认。

同一个宿主开两个测试会话，交错等待、工具、完成和取消，对照可见动画和原有状态，再核对启停、可写和不可写数据目录下重启前后的快照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 298 | — | — | 3447 |
| .ts | test | 10 | 1394 | 1232 | 42 | — |
| .ts | source | 20 | 3381 | 2339 | 784 | — |
| .tsx | source | 4 | 1033 | 803 | 190 | — |
| .tsx | test | 1 | 210 | 174 | 21 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-18），可前往 [GitHub Issues](https://github.com/DamonKoy/dsh-web-ui/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：想在 DSH Web 执行任务时快速感知宿主活动的用户，能从宠物动画读到什么，什么条件会使活动来源或养成记录失真？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 任务事件怎样成为网页上的宠物动画，用户看到了谁的进度？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

同时开着 DSH Web 和其他工作页面的用户，可能希望从浮层知道宿主正在等待、读写工具还是刚结束一轮。与回到会话看宿主的原有状态提示相比，浮层在新建会话或切换会话时也可以留在页面。与普通静态宠物相比，它由工具调用、输出和终态等真实事件驱动。合格结果只需提示宿主活动，具体任务完成仍须回到会话核对。

服务为每个会话保存投影上下文。工具调用把 call ID 加入集合，工具返回移除对应 ID；还有未完工具时保留工具阶段，全部返回且遇到失败时才产生失败阶段。官方 turn/end 按完成、阻塞、异常等结果转译并触发完成轮次积分；最近一次产生转换的会话覆盖全局的可见状态。快照有阶段、气泡文字和会话是否活跃，但没有当前前台会话的标识，所以另一个会话的工具或结束事件可能使眼前的宠物动画改变。当前显示会话销毁会重置状态，没有搜索另一个活跃会话恢复显示的分支。

浏览器以全局 React 根挂载，约两秒一次读取快照，隐藏浏览器页时停定时器，回来立即查询。短状态可能在两次读取间被覆盖。因此该浮层适合感知活跃度，不能作为某次调用已成功或等待你输入的唯一依据。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pet/src/event-projection.ts:75-118](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/event-projection.ts#L75-L118)

实际工具 ID 统计、失败信号和官方 turn/end 转换。

<details>
<summary>查看原文（44行）</summary>

```text
    case 'assistant/message':
      return { input: { phase: 'review', line: '整理回复中' } }
    case 'tool/call':
      runtime.activeTools.add(String(event.data.callId))
      return {
        input: {
          phase: 'tool',
          line: `正在使用 ${displayToolName(event.data.name)}`,
        },
      }
    case 'tool/result': {
      const block = event.data.message.content[0]
      runtime.activeTools.delete(String(event.data.message.source.callId))
      runtime.stepHadFailure ||= event.data.error !== undefined || block.isError === true
      if (runtime.activeTools.size > 0) {
        return {
          input: {
            phase: 'tool',
            line: `还有 ${runtime.activeTools.size} 个工具运行中`,
          },
        }
      }
      return runtime.stepHadFailure
        ? { input: { phase: 'failed', line: '工具执行失败' } }
        : { input: { phase: 'thinking', line: '处理工具结果' } }
    }
    case 'turn/end': {
      runtime.activeTools.clear()
      switch (event.data.reason.kind) {
        case 'completed':
          return {
            input: { phase: 'done', line: '完成啦' },
            completedTurn: event.data.turn,
          }
        case 'error':
          return { input: { phase: 'failed', line: '执行失败' } }
        case 'max-tokens':
          return { input: { phase: 'failed', line: '达到输出上限' } }
        case 'interrupted':
          return { input: { phase: 'failed', line: '执行意外中断' } }
        case 'blocked':
          return { input: { phase: 'waiting', line: '等待继续' } }
        case 'aborted':
          return { input: { phase: 'idle', line: '已停止' } }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pet/src/service.ts:268-301](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L268-L301)

最近事件覆盖全局状态，投影上下文仍按会话独立，销毁只处理当前来源。

<details>
<summary>查看原文（34行）</summary>

```text
          const transition = projectOfficialEvent(event, runtime)
          if (transition === undefined) return
          runtime.officialEventsSeen = true
          this.applyActivity(session, transition.input)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
          }
        }),
        this.ctx.on('session/disposed', (session: Session) => {
          if (session !== this.displaySession) return
          this.displaySession = undefined
          this.machine.onSessionDisposed()
        }),
      ]
      return () => { for (const dispose of disposers) dispose() }
    })()
  }

  /** Return the projection state associated with one live session. */
  private activityRuntime(session: Session): ProjectionRuntime {
    let runtime = this.sessionActivity.get(session)
    if (runtime === undefined) {
      runtime = emptyProjectionRuntime()
      this.sessionActivity.set(session, runtime)
    }
    return runtime
  }

  /** Commit one activity as the host-global pet's most recent display state. */
  private applyActivity(session: Session, input: PetStateInput): void {
    this.displaySession = session
    this.machine.onActivityStatus(input)
    this.machine.onSessionActive()
  }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-pet/src/service.ts:390-412](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L390-L412)

快照返回阶段和气泡，没有会话标识；读取不触发写盘。

<details>
<summary>查看原文（23行）</summary>

```text
  private view(): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // Read-only: the ledger settles on economic events only, never on a read,
    // so polling the state cannot trigger pet.json writes.
    return {
      animation: snapshot.animation,
      ...(snapshot.bubble === undefined ? {} : { bubble: snapshot.bubble }),
      phase: snapshot.phase,
      sessionActive: snapshot.sessionActive,
      affinity: this.ledger.affinityView(Date.now()),
      display: { ...this.ledger.snapshot.display },
      pet: {
        id: entry.id,
        displayName: entry.displayName,
        description: entry.description,
      },
      name: this.petName(),
      treats: {
        stocked: this.ledger.snapshot.treats.treats,
        max: this.ledger.treatMax,
      },
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-pet/src/client/index.ts:174-212](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/client/index.ts#L174-L212)

可见页面轮询与切回刷新，失败记录传输错误。

<details>
<summary>查看原文（39行）</summary>

```text
        petApi.state().then((snapshot) => {
          setSnapshot(snapshot)
        }, () => {
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

**依据 5 · 源码核查**：[packages/dsh-pet/src/client/index.ts:278-294](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/client/index.ts#L278-L294)

根节点直接挂到 body，并可卸载。

<details>
<summary>查看原文（17行）</summary>

```text
      // React root for the page lifetime: PetSprite portals itself to body
      // when visible, and the hidden-state summon button is fixed-positioned.
      const container = document.createElement('div')
      container.dataset.dshPetRoot = ''
      document.body.appendChild(container)
      const petRoot = createRoot(container)
      petRoot.render(createElement(PetDockEntry, { ...injected(), t }))

      disposeUi = () => {
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeUi = undefined
      }
    } else if (!enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
```

</details>

#### 缺口

- 未测双会话并发时可见过渡覆盖比例。
  **影响**：无法承诺短事件可见或用户能辨认变化来源。
  **进一步探讨**：在两个无敏感会话安排错开的工具和完成事件，对照快照、画面及宿主原状态。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 摸宠物、喂食和模型完成轮次分别怎样记账？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

宠物账本持有亲密度、库存和展示设置。新完成的官方轮次按会话 ID 与轮次数字比较，只接受大于该会话已处理的最大值。乱序的较旧轮次也会被忽略，去重表只在内存中；重启后持久化的只有累计计数和库存等快照，能否重复计奖还依赖宿主是否重放历史事件。只有旧活动流时则用短时间窗口压制重复 done，官方活动进入后优先用官方完成信号。

喂食先按工作轮数和时间锚点结算库存，再判断冷却；未通过冷却时不消耗库存。可喂但无库存也不增加亲密度。读快照不结算库存，所以闲置时间到达阈值并不保证正在显示的计数立刻刷新。用户可继续工作或在获准的交互路径上重新结算，不能据动物停顿判断时间尚未到。

正常变更把快照写临时文件，再以 rename 更新 pet.json。保存异常被宿主服务吞掉，内存交互仍可返回反馈；重启或读取损坏文件时可能恢复旧值或默认值。因此在意养成记录的用户应以重启后读回为成功条件。轮询取数、动画渲染和交互触发的磁盘更新各有成本，真实负载和人工恢复工时未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pet/src/ledger.ts:48-61](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/ledger.ts#L48-L61)

最大已计轮次和旧事件去重是内存字段。

<details>
<summary>查看原文（14行）</summary>

```text
export class PetLedger {
  private readonly affinityConfig: AffinityConfig
  private readonly treatConfig: TreatConfig
  private current: PetPersist
  /** Completed turns already rewarded, per session (turn numbers are per-session). */
  private rewardedTurns = new Map<string, number>()
  private lastLegacyTurnRewardAt = 0
  private dirty = false

  constructor(persist: PetPersist, config: LedgerConfig = {}) {
    this.affinityConfig = { ...defaultAffinityConfig, ...(config.affinity ?? {}) }
    this.treatConfig = { ...defaultTreatConfig, ...(config.treats ?? {}) }
    this.current = persist
  }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pet/src/ledger.ts:128-144](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/ledger.ts#L128-L144)

官方按会话单调轮次去重，旧流按五秒跨度。

<details>
<summary>查看原文（17行）</summary>

```text
  rewardTurn(sessionId: string, turn: number, nowMs: number): boolean {
    const last = this.rewardedTurns.get(sessionId) ?? 0
    if (turn <= last) return false
    this.rewardedTurns.set(sessionId, turn)
    let changed = this.applyTurnReward()
    if (this.settleTreats(nowMs)) changed = true
    return changed
  }

  /** Preserve turn rewards for installations that only emit legacy activity. */
  rewardLegacyTurn(nowMs: number): boolean {
    // A legacy done snapshot may repeat during the celebration window.
    if (nowMs - this.lastLegacyTurnRewardAt < 5_000) return false
    this.lastLegacyTurnRewardAt = nowMs
    let changed = this.applyTurnReward()
    if (this.settleTreats(nowMs)) changed = true
    return changed
```

</details>

**依据 3 · 源码核查**：[packages/dsh-pet/src/service.ts:251-274](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L251-L274)

兼容事件与官方事件的计奖切换。

<details>
<summary>查看原文（24行）</summary>

```text
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
          this.applyActivity(session, transition.input)
          if (transition.completedTurn !== undefined) {
            this.rewardTurn(String(session.id), transition.completedTurn)
          }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-pet/src/ledger.ts:161-183](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/ledger.ts#L161-L183)

喂食结算、拒绝冷却、扣库存和亲密度更新的顺序。

<details>
<summary>查看原文（23行）</summary>

```text
  interact(kind: PetInteraction, nowMs: number): LedgerInteractionResult {
    if (kind === 'feed') this.settleTreats(nowMs)
    const outcome = applyInteraction(this.current.affinity, kind, nowMs, this.affinityConfig)
    if (kind === 'feed' && !outcome.accepted) {
      return { reaction: outcome.reaction, delta: 0, affinity: this.affinityView(nowMs) }
    }
    if (kind === 'feed') {
      const consume = consumeTreat(this.current.treats)
      if (!consume.ok) {
        return {
          reaction: '没有小鱼干了，多陪我工作一会儿吧～',
          delta: 0,
          affinity: this.affinityView(nowMs),
        }
      }
      this.current = { ...this.current, treats: consume.ledger }
      this.dirty = true
    }
    if (outcome.accepted) {
      this.current = { ...this.current, affinity: outcome.affinity }
      this.dirty = true
    }
    return { reaction: outcome.reaction, delta: outcome.delta, affinity: this.affinityView(nowMs) }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-pet/src/treats.ts:74-100](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/treats.ts#L74-L100)

两类计时锚点独立并限制库存。

<details>
<summary>查看原文（27行）</summary>

```text
  const turnDelta = Math.max(0, turns - ledger.turnsAtLastTreatGrant)
  const workGrants = Math.floor(turnDelta / config.turnsPerTreat)
  // The time clock starts at the first settlement (no backfill of pre-first
  // idle history); thereafter only time grants move it forward.
  const timeAnchor = ledger.lastTreatGrantAt === 0 ? nowMs : ledger.lastTreatGrantAt
  const timeGrants = Math.floor(Math.max(0, nowMs - timeAnchor) / config.timeTreatMs)
  const gained = workGrants + timeGrants
  if (gained <= 0) {
    if (ledger.lastTreatGrantAt === 0) {
      // Zero-gain first settlement: persist the clock start anyway, so the
      // 30-minute time output can begin. Before this fix the anchor stayed 0
      // forever (the deadlock: no grant means no anchor write means no grant).
      return { ledger: { ...ledger, lastTreatGrantAt: nowMs }, gained: 0 }
    }
    return { ledger, gained: 0 }
  }
  return {
    ledger: {
      treats: cap(ledger.treats + gained, config.maxTreats),
      lastTreatGrantAt: timeGrants > 0
        ? timeAnchor + timeGrants * config.timeTreatMs
        : timeAnchor,
      turnsAtLastTreatGrant: workGrants > 0
        ? turns - (turnDelta % config.turnsPerTreat)
        : ledger.turnsAtLastTreatGrant,
    },
    gained,
```

</details>

**依据 6 · 源码核查**：[packages/dsh-pet/src/service.ts:390-420](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L390-L420)

读不触发结算保存；持久化失败不使内存回执报错。

<details>
<summary>查看原文（31行）</summary>

```text
  private view(): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // Read-only: the ledger settles on economic events only, never on a read,
    // so polling the state cannot trigger pet.json writes.
    return {
      animation: snapshot.animation,
      ...(snapshot.bubble === undefined ? {} : { bubble: snapshot.bubble }),
      phase: snapshot.phase,
      sessionActive: snapshot.sessionActive,
      affinity: this.ledger.affinityView(Date.now()),
      display: { ...this.ledger.snapshot.display },
      pet: {
        id: entry.id,
        displayName: entry.displayName,
        description: entry.description,
      },
      name: this.petName(),
      treats: {
        stocked: this.ledger.snapshot.treats.treats,
        max: this.ledger.treatMax,
      },
    }
  }

  private flush(): void {
    try {
      savePetPersist(this.ledger.snapshot, this.persistDir)
    } catch {
      // Persistence is best-effort; the in-memory ledger keeps working.
    }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-pet/src/persist.ts:147-165](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/persist.ts#L147-L165)

持久化字段及读取失败的默认值，保存以临时文件替换。

<details>
<summary>查看原文（19行）</summary>

```text
    return {
      petId,
      names,
      affinity,
      treats,
      display,
    }
  } catch {
    return emptyPersist()
  }
}

/** Atomically persist state (write temp + rename). */
export function savePetPersist(data: PetPersist, dir: string = petHomeDir()): void {
  mkdirSync(dir, { recursive: true })
  const target = join(dir, 'pet.json')
  const tmp = `${target}.tmp`
  writeFileSync(tmp, JSON.stringify(data, null, 2), 'utf8')
  renameSync(tmp, target)
```

</details>

#### 缺口

- 未核实重启后宿主会否发送已有轮次以及磁盘不可写时真实反馈。
  **影响**：内存去重和写成功都不能由动画推定。
  **进一步探讨**：在独立数据目录注入重复、乱序和重放完成事件，再对比正常和不可写两次重启后的数据。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装和更换宠物需要哪些配套，隐藏和关闭分别停在哪里？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

包的宿主出口依赖 webServer 和设置服务，Web 客户端需要 runtime、locale、slots 等宿主服务。设置卡实际注册到 Web UI 插件组的 web-ui.plugin.item，包内使用可选组设置绑定器或官方 settingsScope。生产 profile 是否已提供这些服务和父插槽要逐一核对，不能从根包名推导设置页必然出现。固定提交公开导出生成后的宿主和客户端文件，本轮只核了构建接线。

宿主启动时扫描内置资产、Codex 自定义宠物目录及组合配置。自定义与组合条目可覆盖已有 ID，找不到选中条目时退回注册表默认值，没有任何有效条目时服务不能启动。资产请求只按注册条目提供 manifest、图集和对应的预览文件。自定义宠物需要兼容的 manifest 和图集；更换注册表来源后要考虑启动时重扫及客户端此前缓存。

隐藏只是把可见字段改为 false，保留召唤和客户页轮询。设置 enabled 关闭会让服务解绑会话监听，卸载路由，也让客户端撤下浮层并停定时器。原有养成文件没有在这些清理调用里被删除。浏览器使用同源请求，当前包的 POST 包装器核 HTTP 方法与 JSON，并未自行验证调用者身份；共享或远程部署的可达性与授权要核查宿主边界。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pet/package.json:44-56](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/package.json#L44-L56)

包明示 DSH Web 前端依赖与 profile 补丁。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-pet/src/client/index.ts:120-142](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/client/index.ts#L120-L142)

设置卡实际挂在组插槽，设置绑定器先看可选组服务。

<details>
<summary>查看原文（23行）</summary>

```text
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'pet: dictionaries')

  const binder = ctx.get('webUiSettings') ?? ctx.settingsScope
  const settingsScope = binder.bind<PetSettings>({ namespace: PET_SETTINGS_NS })
  const enabled = (): boolean => {
    const snapshot = settingsScope.getSnapshot()
    return snapshot.status === 'ready'
      ? snapshot.value?.enabled ?? true
      : snapshot.status === 'unavailable'
  }

  // Plugin configuration card: one staged form over the 'pet' settings
  // namespace, contributed to the Web UI plugin group. The controller loads
  // the petId choices from the registry endpoint itself.
  const petSettings = new PetSettingsCardController(settingsScope)
  ctx.slots.inject('web-ui.plugin.item', () => ctx.slots.register({
    name: 'web-ui.plugin.item',
    id: 'pet-settings',
    order: 140,
    locale: NS,
    inject: () => petSettings.inject(),
  }, PetSettingsCard))
```

</details>

**依据 3 · 源码核查**：[packages/dsh-pet/src/registry.ts:333-372](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/registry.ts#L333-L372)

内置、自定义、组合的覆盖顺序与默认资产。

<details>
<summary>查看原文（40行）</summary>

```text
export function loadPetRegistry(options: PetRegistryOptions): PetRegistry {
  const { packageRoot, assetPrefix = '/pet' } = options
  const warnings: string[] = []
  const byId = new Map<string, PetEntry>()
  const builtinIds = new Set<string>()

  for (const entry of scanPetDir(join(packageRoot, 'assets'), { assetPrefix, warnings })) {
    if (byId.has(entry.id)) {
      warnings.push('duplicate built-in pet id ' + entry.id + '; the first one wins')
      continue
    }
    byId.set(entry.id, entry)
    builtinIds.add(entry.id)
  }

  const petsDir = options.petsDir ?? codexPetsDir()
  if (petsDir !== '') {
    for (const entry of scanPetDir(petsDir, { assetPrefix, warnings })) {
      if (byId.has(entry.id)) warnings.push('custom pet ' + entry.id + ' overrides the built-in one')
      byId.set(entry.id, entry)
    }
  }

  for (const manifest of options.extra ?? []) {
    const dir = manifest.spritesheetPath === undefined || isAbsolute(manifest.spritesheetPath)
      ? join(packageRoot, 'assets', 'extra')
      : dirname(resolve(packageRoot, manifest.spritesheetPath))
    const entry = resolvePetManifest(manifest, dir, { assetPrefix, warnings })
    if (entry === undefined) continue
    if (byId.has(entry.id)) warnings.push('composed pet ' + entry.id + ' overrides an earlier registration')
    byId.set(entry.id, entry)
  }

  const entries = [...byId.values()]
  return {
    entries,
    warnings,
    byId: (id: string) => byId.get(id),
    defaultEntry: () => entries.find(entry => builtinIds.has(entry.id)) ?? entries[0]!,
  }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-pet/src/service.ts:152-176](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L152-L176)

无有效资产时抛错，已选条目缺失则退回默认。

<details>
<summary>查看原文（25行）</summary>

```text
  constructor(ctx: Context, config: PetConfig = {}) {
    super(ctx, 'pet')
    this.persistDir = config.persistDir ?? petHomeDir()
    this.registry = config.registry
      ?? loadPetRegistry({
        packageRoot: petPackageRoot(import.meta.url),
        ...(config.pets === undefined ? {} : { extra: config.pets }),
      })
    if (this.registry.entries.length === 0) {
      throw new Error('[dsh-pet] no valid pet manifests found; nothing to render')
    }
    let persist = loadPetPersist(this.persistDir)
    if (this.registry.byId(persist.petId) === undefined) {
      // The selected pet no longer exists (removed or a fresh install with a
      // copied pet.json): fall back to the registry default.
      persist = { ...persist, petId: this.registry.defaultEntry().id }
    }
    const ledgerConfig: LedgerConfig = { affinity: config.affinity, treats: config.treats }
    this.ledger = new PetLedger(persist, ledgerConfig)
    this.machine = new PetStateMachine({
      ...defaultPetStateConfig,
      ...(config.state ?? {}),
    })
    this.enabled = config.enabled ?? true

```

</details>

**依据 5 · 源码核查**：[packages/dsh-pet/src/routes.ts:108-120](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/routes.ts#L108-L120)

POST 适配层检查方法和 JSON，未自行验证调用者身份。

<details>
<summary>查看原文（13行）</summary>

```text
    handler: (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (!requireMethod(req, res, 'POST')) return Promise.resolve()
      return readJsonBody(req).then((body) => {
        const record = (typeof body === 'object' && body !== null) ? body as Record<string, unknown> : {}
        return run(record).then(
          (value) => json(res, 200, value),
          (error) => {
            json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
          },
        )
      }, (error) => {
        json(res, 400, { ok: false, error: error instanceof Error ? error.message : String(error) })
      })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-pet/src/routes.ts:189-220](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/routes.ts#L189-L220)

媒体路径按已注册条目的资源白名单选择。

<details>
<summary>查看原文（32行）</summary>

```text
    const rel = rest.join('/')
    let file: string | undefined
    let synthesized = false
    if (rest.length === 1 && rest[0] === MANIFEST_FILE) {
      const manifestFile = join(entry.dir, MANIFEST_FILE)
      file = existsSync(manifestFile) ? manifestFile : undefined
      if (file === undefined) synthesized = true
    } else if (rest.length > 0 && rel === entry.spritesheetPath) {
      file = join(entry.dir, entry.spritesheetPath)
    } else if (rest.length === 2 && rest[0] === PREVIEW_DIR && PREVIEW_PATTERN.test(rest[1]!)) {
      const preview = join(entry.dir, PREVIEW_DIR, rest[1]!)
      file = existsSync(preview) ? preview : undefined
    }
    if (synthesized) {
      const body = Buffer.from(JSON.stringify(petEntryView(entry), null, 2), 'utf8')
      res.writeHead(200, {
        'content-type': 'application/json; charset=utf-8',
        'content-length': String(body.byteLength),
        'cache-control': 'no-cache',
      })
      if (req.method === 'HEAD') {
        res.end()
        return
      }
      res.end(body)
      return
    }
    if (file === undefined) {
      res.writeHead(404)
      res.end()
      return
    }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-pet/src/index.ts:159-189](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/index.ts#L159-L189)

设置回调通知活动服务并注册或卸载路由。

<details>
<summary>查看原文（31行）</summary>

```text
  const routes = makePetRoutes({ service })
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
  }
  installSettingsSection(
    ctx,
    settingsNamespace(PET_SETTINGS_NAMESPACE),
    makePetSettingsSchema(service.selectedPetId()),
    base,
    {
      setSource: (source) => { current = source },
      onChange: () => {
        const section = current()
        service.applySettingsSection(section)
        service.setEnabled(section.enabled ?? true)
        syncRoutes()
      },
    },
```

</details>

**依据 8 · 源码核查**：[packages/dsh-pet/src/service.ts:233-245](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L233-L245)

禁用先卸载活动监听，不再注册。

<details>
<summary>查看原文（13行）</summary>

```text
  setEnabled(enabled: boolean): void {
    this.enabled = enabled
    this.syncActivity()
  }

  private syncActivity(): void {
    if (this.disposeActivity !== undefined) {
      this.disposeActivity()
      this.disposeActivity = undefined
    }
    if (!this.enabled) return
    this.disposeActivity = (() => {
      const disposers = [
```

</details>

**依据 9 · 源码核查**：[packages/dsh-pet/src/client/index.ts:278-298](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/client/index.ts#L278-L298)

UI 清理及轮询销毁。

<details>
<summary>查看原文（21行）</summary>

```text
      // React root for the page lifetime: PetSprite portals itself to body
      // when visible, and the hidden-state summon button is fixed-positioned.
      const container = document.createElement('div')
      container.dataset.dshPetRoot = ''
      document.body.appendChild(container)
      const petRoot = createRoot(container)
      petRoot.render(createElement(PetDockEntry, { ...injected(), t }))

      disposeUi = () => {
        petRoot.unmount()
        container.remove()
        disposePoll()
        disposeUi = undefined
      }
    } else if (!enabled() && disposeUi !== undefined) {
      disposeUi()
      disposeUi = undefined
    }
  }
  settingsScope.subscribe(syncUi)
  syncUi()
```

</details>

**依据 10 · 源码核查**：[packages/dsh-pet/src/routes.ts:251-261](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/routes.ts#L251-L261)

隐藏和显示设置为独立字段更新。

<details>
<summary>查看原文（11行）</summary>

```text
    postRoute(PET_API_PREFIX + '/set-visible', (body) => {
      const visible = body.visible
      if (typeof visible !== 'boolean') return Promise.reject(new Error('invalid-visible'))
      return service.setVisible(visible)
    }),
    postRoute(PET_API_PREFIX + '/set-config', (body) => service.setConfig({
      ...(typeof body.size === 'number' ? { size: body.size } : {}),
      ...(typeof body.right === 'number' ? { right: body.right } : {}),
      ...(typeof body.bottom === 'number' ? { bottom: body.bottom } : {}),
      ...(typeof body.visible === 'boolean' ? { visible: body.visible } : {}),
    })),
```

</details>

#### 缺口

- 未在单装、套件和远程宿主上核实父插槽与入口访问控制。
  **影响**：无法确认配置界面是否完整露出或远端调用边界。
  **进一步探讨**：在实际目标宿主检查设置卡、禁用后路由和调用权限，确认资产通过已授权入口读取。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪类用户可以试用，怎样验证活动来源提示是否更好？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

喜欢伴随动画的 DSH Web 用户可以用独立环境，让一个测试会话依次等待、调用工具并完成，再试隐藏、召唤和禁用。宿主自有会话状态仍可确认各次任务，宠物提供跨界面的直观反馈和轻量互动。已有足够通知，或需要可靠区分同时运行的任务时，直接保留宿主自己的会话状态就够。显示内容、设置项或文件恢复不符合预期时先关 enabled，再在原有会话看状态。首次成本主要是版本和设置验证，持续成本包括每个可见客户端定时取状态、动画和主动互动；帮助用户少切换窗口还是多了干扰，暂无实测。

由全局最近事件覆盖和快照没有来源，可推导将来源以最小信息提示给操作者，例如仅标记当前会话、其他会话或无会话。可以同时保留全局挂载，用双会话可重复脚本比较原动画、加来源标记及宿主状态栏三个条件。记录能否识别正在运行的任务、误把另一次完成当作自己完成的次数、核对耗时与信息暴露。若标记没有减少错认，或为此泄露不必要的身份信息，则该假设无法支持启用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-pet/src/service.ts:296-301](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L296-L301)

当前只保留最新活动来源，优先级跟事件流而非当前页面。

```text
  /** Commit one activity as the host-global pet's most recent display state. */
  private applyActivity(session: Session, input: PetStateInput): void {
    this.displaySession = session
    this.machine.onActivityStatus(input)
    this.machine.onSessionActive()
  }
```

**依据 2 · 源码核查**：[packages/dsh-pet/src/service.ts:390-412](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/service.ts#L390-L412)

展示链使用没有会话身份的单一快照，可据此定义最小提示方案。

<details>
<summary>查看原文（23行）</summary>

```text
  private view(): PetStateView {
    const snapshot = this.machine.render()
    const entry = this.activeEntry()
    // Read-only: the ledger settles on economic events only, never on a read,
    // so polling the state cannot trigger pet.json writes.
    return {
      animation: snapshot.animation,
      ...(snapshot.bubble === undefined ? {} : { bubble: snapshot.bubble }),
      phase: snapshot.phase,
      sessionActive: snapshot.sessionActive,
      affinity: this.ledger.affinityView(Date.now()),
      display: { ...this.ledger.snapshot.display },
      pet: {
        id: entry.id,
        displayName: entry.displayName,
        description: entry.description,
      },
      name: this.petName(),
      treats: {
        stocked: this.ledger.snapshot.treats.treats,
        max: this.ledger.treatMax,
      },
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-pet/src/client/index.ts:181-212](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/src/client/index.ts#L181-L212)

定时拉取依可见性启停，资源与样本节奏需结合实测。

<details>
<summary>查看原文（32行）</summary>

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
```

</details>

**依据 4 · 作者声明**：[packages/dsh-pet/README.md:5-9](https://github.com/DamonKoy/dsh-web-ui/blob/3647a33fa467e0335260468614f6eed04b196c38/packages/dsh-pet/README.md#L5-L9)

作者明确面向等待反馈与养成，既有 Codex 机制为设计参照。

```text
> A registry-driven desktop companion for DeepSeek Harness — the built-in whale girl plus any pet you drop in.

While the model thinks, you wait — your pet swims. It follows official session activity and switches animations while waiting, thinking, using tools, composing a reply, celebrating completion, or reporting failure; you can also pat its head, feed it dried fish, and watch its affinity grow. Pets are registry entries, not code: every pet is one `pet.json` manifest plus one atlas image, and the host discovers them at startup.

Re-implemented from the pet feature of the Codex desktop app, as an official DSH plugin shape (cordis bundle: host half + client half in one package).
```

#### 缺口

- 没有带来源提示的版本及独立操作者数据。
  **影响**：不能量化任务辨认或体验增益。
  **进一步探讨**：在固定宿主中邀请操作者完成同一双会话判定，记录误认、人工核对和展示偏好。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
