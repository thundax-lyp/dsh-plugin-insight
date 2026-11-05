# dsh-smooth-stream

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[304f900](https://github.com/Laplace-bit/dsh-smooth-stream/tree/304f90066620316bd54190099ecbba56ece06316)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Laplace-bit/dsh-smooth-stream) [![npm 30d 3,813](https://img.shields.io/static/v1?label=npm+30d&message=3%2C813&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smooth-stream) [![最新发布 2026-10-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-smooth-stream)
<!-- END META -->

> **功能**：包装 DSH 消息 renderer，通过逐帧展示与滚动跟随调整流式阅读。

> **亮点**：[Q01](#research-q01) 把内容到达和可见节奏分开。

> **主要限制**：[Q02](#research-q02) renderer 与滚动所有权有兼容耦合，显示完成晚于模型完成。

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
  - [Q01 · 平滑输出怎样接入原生消息？](#detail-section-11)
  - [Q02 · 滚动控制与折叠有哪些兼容边界？](#detail-section-12)
  - [Q03 · 怎样证明阅读改善没有掩盖输出？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常阅读长篇代码与推理流的 DSH 用户。

宿主默认分块展示与滚动。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 展示 | 逐帧释放文本 | 增加显示滞后 |
| 跟随 | 平滑底部位移并在上滚时释放 | 底部重入依赖slack及交互状态 |
| 折叠策略 | 分别配置running/settled与turn override | follow沿宿主折叠；expanded/collapsed覆盖，需验收控件一致性 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH slots 与浏览器 rAF | 必需 | 接入 renderer 和动画 | 结构变化需适配 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 录制 | 固定文字和到达节奏 | 保存基线 |
| 比较 | 同尺寸回放和手动滚动 | 最终文本一致 |
| 卸载 | 切会话并恢复原 renderer | listener 和组件归还 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 浏览器资源未知 | 固定 profile 和录制流 | 核对 slots |
| 持续 | 主线程开销未知 | 关注宿主 renderer 变化 | 存在显示积压 |
| 失败 | 排查时间未知 | 禁用恢复原显示 | 确认尾部全部到达 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 显示机制 | 源码提供逐帧 drain 和 wrapper 恢复 | 实际阅读和帧性能 |
| 内容完整 | 源码按内容缓存展示 | 最终 DOM 一致性待验 |

> **思考**：[Q02](#research-q02) renderer 与滚动所有权有兼容耦合，显示完成晚于模型完成。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 把内容到达和可见节奏分开。

[Q02](#research-q02) transform 跟随不能证明全页面零布局。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) renderer 与滚动所有权有兼容耦合，显示完成晚于模型完成。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 录制流加手动交互对照。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对 wrapper 和 drain，未跑浏览器。

- 已检查：作者 README、包清单、源码路径 src/client/index.ts、src/client/useSmoothStreamContent.ts、src/client/teleprompterGlide.ts、src/fold-policy.ts、src/client/FollowHost.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 renderer、揭示和跟随源码，未执行浏览器。
- 下一步：最终文本、尾延迟、上滚、选区及卸载。

**分析版本**

- **仓库**：[Laplace-bit/dsh-smooth-stream](https://github.com/Laplace-bit/dsh-smooth-stream)
- **版本号**：0.8.0-rc.1（[固定提交 304f900](https://github.com/Laplace-bit/dsh-smooth-stream/tree/304f90066620316bd54190099ecbba56ece06316)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 同一录制流比较延迟、掉帧与回看。

最终文本、尾延迟、上滚、选区及卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 624 | — | — | 8225 |
| .ts | source | 32 | 9702 | 6792 | 2300 | — |
| .tsx | source | 16 | 5296 | 4333 | 626 | — |
| .js | source | 1 | 27812 | 27215 | 880 | — |
| .mjs | source | 41 | 5868 | 4942 | 707 | — |
| .tsx | test | 19 | 8106 | 6968 | 357 | — |
| .ts | test | 2 | 45 | 30 | 12 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Laplace-bit/dsh-smooth-stream/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=4&color=737b86&logo=github)](https://github.com/Laplace-bit/dsh-smooth-stream/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Laplace-bit/dsh-smooth-stream/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：缓冲和跟随能否改善长输出且保留内容与交互？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 平滑输出怎样接入原生消息？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

长篇分块输出的读者会看到离散字符和滚动跳跃。插件在 conversation.chat.node 的可包装 entry 上替换 component，并监听 slots/changed 包装后到的 renderer；退出仅当 entry 仍是自身 wrapper 时恢复，避免覆盖别的插件新值。实际文字经 StreamBuffer 与 useSmoothStreamContent 的逐帧展示，生产者完成后走有界 drain，不能假设模型结束时屏幕已经显示全部。相对原生分块渲染，它改变可见节奏和跟随，不改变模型速度或任务准确性。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:194-226](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/index.ts#L194-L226)

renderer 接入与恢复。

<details>
<summary>查看原文（33行）</summary>

```text
 * @returns Restorer that puts the original components back.
 */
function wrapAgentChatRows(
  ctx: ClientContext,
  useControlScroll: () => boolean,
): () => void {
  const restores: Array<() => void> = []
  const wrapped = new WeakSet<object>()

  const wrapAll = (): void => {
    for (const entry of ctx.slots.entries('conversation.chat.node')) {
      const key = entry.options.key
      if (key === undefined || SKIP_WRAP.has(key)) continue
      const current = entry.component
      if (!isWrappableComponent(current) || wrapped.has(current)) continue
      const inner = current as ComponentType<FollowWrapProps>
      const next = wrapFollowNodeView(inner, useControlScroll)
      wrapped.add(next)
      entry.component = next
      restores.push(() => {
        if (entry.component === next) entry.component = inner
      })
    }
  }

  wrapAll()
  const off = ctx.on('slots/changed', (key: string) => {
    if (key === 'conversation.chat.node') wrapAll()
  })
  return () => {
    off()
    for (const restore of restores) restore()
  }
```

</details>

**依据 2 · 源码核查**：[src/client/useSmoothStreamContent.ts:242-280](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/useSmoothStreamContent.ts#L242-L280)

揭示和完成 drain 计算。

<details>
<summary>查看原文（39行）</summary>

```text
/** Pure per-frame reveal decision shared by the loop and its tests. */
export function computeRevealStep(config: StreamSmoothingPresetConfig, input: RevealStepInput, dtSeconds: number): RevealStepResult {
  // Track the faster of the two EMAs and do not clamp to the old low maxCps
  // ceiling — that cap is why a fast model left hundreds of chars unrevealed.
  const trackedCps = Math.max(input.emaCps, input.arrivalCpsEma)
  const baseCps = clamp(trackedCps, config.minCps, config.maxFlushCps)
  const targetLagChars = input.inputActive
    ? Math.max(2, Math.round((baseCps * config.targetBufferMs) / 1000))
    : 0

  let currentCps: number
  if (input.steadyCps !== undefined) {
    currentCps = input.inputActive || input.settling
      ? clamp(
        input.steadyCps * (input.inputActive ? 1 : SETTLE_DRAIN_MULTIPLIER),
        config.minCps,
        config.maxFlushCps,
      )
      : 0
  } else if (input.inputActive) {
    const overflow = Math.max(0, input.backlog - LIVE_LAG_CHAR_CEILING)
    const catchup = overflow > 0 ? overflow / CATCHUP_SECONDS : 0
    currentCps = clamp(baseCps * 1.08 + catchup, config.minCps, config.maxFlushCps)
  } else if (input.settling) {
    currentCps = computeSettleDrain(config, input)
  } else {
    const idleFlushCps = Math.max(config.flushCps, baseCps * 1.8, input.arrivalCpsEma * 0.8)
    currentCps = clamp(idleFlushCps, config.flushCps, config.maxFlushCps)
  }

  const minRevealChars = input.inputActive ? 1 : 2
  return { revealChars: Math.max(minRevealChars, Math.round(currentCps * dtSeconds)), targetLagChars }
}

export interface UseSmoothStreamContentOptions {
  enabled?: boolean
  /** The producer has completed; drain queued text without live backpressure. */
  inputComplete?: boolean
  preset?: StreamSmoothingPreset
```

</details>

**依据 3 · 源码核查**：[src/client/useSmoothStreamContent.ts:409-448](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/useSmoothStreamContent.ts#L409-L448)

完成后的帧循环。

<details>
<summary>查看原文（40行）</summary>

```text
  // here. That single commit is a visible teleport whenever a fast stream
  // ends with standing backlog — hundreds of chars become thousands of px in
  // one frame, exactly the end-of-render jerk this plugin fights. The frame
  // loop's producer-complete branch already drains the queue at a bounded
  // constant velocity (computeCompletionDrain), which finishes near its
  // configured deadline and glides every px through the spring. Nothing is left
  // "typing" after the Agent stops; the tail just closes at drain speed.
  //
  // Non-append-only edits and disabled streams still sync immediately below.

  const startFrameLoop = useCallback(() => {
    if (rafRef.current !== null) return

    const tick = (now: number) => {
      const targetCount = targetCountRef.current
      const displayedCount = displayedCountRef.current
      const backlog = targetCount - displayedCount

      if (backlog <= 0) {
        queueDebtRef.current = 0
        settleCpsRef.current = null
        const speedOut = speedOutRef.current
        if (speedOut !== undefined) speedOut.current = seedCps
        debugRuntime.reportStream(streamIdRef.current, null)
        stopFrameLoop()
        return
      }

      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const frameIntervalMs = Math.max(0, now - lastFrameTsRef.current)
      const dtSeconds = Math.max(0.001, Math.min(frameIntervalMs / 1000, 0.12))
      // How much time this frame may reveal *for*: bounded by the visual
      // interval so an overrun cannot compound. Ramps that genuinely depend on
      // elapsed time keep the real dtSeconds.
      const growthMs = Math.max(1, Math.min(frameIntervalMs, REVEAL_MAX_GROWTH_MS))
```

</details>

#### 缺口

- 目标 Host、Markdown 和多个 renderer 未运行
  **影响**：不保证内容无丢失或首字延迟改善
  **进一步探讨**：固定完整文本比对最终 DOM 与宿主原输出

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 滚动控制与折叠有哪些兼容边界？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

包装需要宿主公开 slots 结构并可替换 entry.component，这比单纯 CSS 有更多版本耦合。跟随器将真实 scroll 与 transform 滞后结合。markGesture 将向上wheel或手指向下拖历史记为readerGestureIntent，并在短时窗口维持interacting。帧循环在following且有人类上滚意图时改为false，记录readerReleased/hold，handBackVisual后drop；只有回到底部slack范围且不再交互或确实returnedToFloor时才重入并清hold、速度和reserve。这说明实际让位与重新跟随有状态条件，选区、轨道滚动和多个控制器仍需浏览器验收。Think fold policy 将 running 和 settled 的配置分开，还定义 follow/expanded/collapsed，必须区别 Host 本身折叠状态和插件覆盖。作者“零重排”是跟随位移路径设计，不能扩大为所有 Markdown、ResizeObserver 和 React 更新都没有 layout。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/teleprompterGlide.ts:1-18](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/teleprompterGlide.ts#L1-L18)

跟随设计与浏览器锚定。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Conversation-port follow while an assistant reply streams.
 *
 * A sub-stepped spring physics engine drives a float `animatedH`, rather
 * than restarting native smooth-scroll animations as every glyph lands.
 * Remaining lag rides a small compositor transform while the real scrollport
 * stays at its floor. The transform is bounded by the measured paint gap
 * before conversation chrome. This follower:
 *
 * - marks programmatic writes via `data-follow-owned` for compatible hosts;
 * - sets `overflow-anchor: none` so CSS scroll-anchoring does not snap;
 * - restores `animatedH` in a ResizeObserver (before paint) so a layout
 *   pass cannot flash a snapped frame;
 * - expresses safe lag as a compositor transform on message rows;
 * - opens a speed-adaptive layout runway before fast output wraps, preserving
 *   the reference spring constants at every reveal speed;
 * - catches up any lag that cannot fit before turn status / composer chrome,
 *   so fixed chrome never has to counter-shift and the host stays at-bottom;
```

</details>

**依据 2 · 源码核查**：[src/client/teleprompterGlide.ts:2027-2050](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/teleprompterGlide.ts#L2027-L2050)

方向手势和交互窗口。

<details>
<summary>查看原文（24行）</summary>

```text
    const markGesture = (event: Event): void => {
      interacting = true
      if (event.type === 'wheel') {
        const deltaY = (event as WheelEvent).deltaY
        if (Number.isFinite(deltaY) && deltaY < 0) readerGestureIntent = true
      } else if (event.type === 'touchstart') {
        const touch = (event as TouchEvent).touches[0]
        touchStartY = touch?.clientY ?? null
      } else if (event.type === 'touchmove') {
        const touch = (event as TouchEvent).touches[0]
        if (touch !== undefined) {
          if (touchStartY === null) touchStartY = touch.clientY
          // A downward finger drag moves the transcript toward older content.
          if (touch.clientY - touchStartY > 1) readerGestureIntent = true
        }
      } else if (event.type === 'touchend' || event.type === 'touchcancel') {
        touchStartY = null
      }
      if (interactTimer !== null) clearTimeout(interactTimer)
      interactTimer = setTimeout(() => {
        interacting = false
        readerGestureIntent = false
        interactTimer = null
      }, FOLLOW_GESTURE_MS)
```

</details>

**依据 3 · 源码核查**：[src/client/teleprompterGlide.ts:2553-2577](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/teleprompterGlide.ts#L2553-L2577)

让位与底部重入的实际分支。

<details>
<summary>查看原文（25行）</summary>

```text
      const repinSlack = readerReleased ? FOLLOW_REPIN_PX : FOLLOW_SLACK_PX
      const returnedToFloor = readerReleased
        && !readerGestureIntent
        && reportedLag <= FOLLOW_REPIN_PX
      if (!following && (!interacting || returnedToFloor) && reportedLag <= repinSlack) {
        following = true
        readerReleased = false
        followReaderHolds.delete(nextPort)
        animatedH = extent
        reservePx = 0
        velocityPxPerSec = 0
        followScrollLedgers.set(nextPort, nextPort.scrollTop)
        hold(nextPort)
      } else if (following && interacting && (readerGestureIntent || readerScrolledUp(nextPort))) {
        // Directional wheel/touch intent is authoritative even when automatic
        // follow has already overwritten the small physical scroll delta.
        following = false
        readerGestureIntent = false
        readerReleased = true
        followReaderHolds.set(nextPort, { atMs: performance.now() })
        handBackVisual(nextPort)
        animatedH = nextPort.scrollHeight
        reservePx = 0
        velocityPxPerSec = 0
        drop(nextPort)
```

</details>

**依据 4 · 源码核查**：[src/fold-policy.ts:67-91](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/fold-policy.ts#L67-L91)

阶段和 override。

<details>
<summary>查看原文（25行）</summary>

```text
 * @returns 当前阶段的开合。
 */
export function foldStateFor(policy: ThinkFoldPolicy, running: boolean): FoldState {
  return running ? policy.running : policy.settled
}

/**
 * How the plugin treats the Turn-level process fold.
 *
 * The kernel folds a completed Turn's process into its `worked for X` line
 * according to the work-details policy. `follow` leaves that decision alone;
 * the other two answers override it once per Turn.
 */
export type FoldOverride = 'follow' | 'expanded' | 'collapsed'

/** Default keeps the kernel in charge, so the plugin changes nothing until asked. */
export const DEFAULT_TURN_FOLD: FoldOverride = 'follow'

/**
 * 判断一个未知值是否为合法的回合折叠覆盖。
 * @param value - 待判断的值。
 * @returns 是否为 {@link FoldOverride}。
 */
export function isFoldOverride(value: unknown): value is FoldOverride {
  return value === 'follow' || value === 'expanded' || value === 'collapsed'
```

</details>

**依据 5 · 源码核查**：[src/client/FollowHost.tsx:62-88](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/FollowHost.tsx#L62-L88)

增长观察与帧回调清理。

<details>
<summary>查看原文（27行）</summary>

```text
    if (onGrowth === undefined || typeof ResizeObserver === 'undefined') return
    const root = rootRef.current
    if (root === null) return
    let previousHeight: number | null = null
    let pendingGrowth = 0
    let growthFrame: number | null = null
    const flushGrowth = (): void => {
      growthFrame = null
      if (pendingGrowth <= 0) return
      const delta = pendingGrowth
      pendingGrowth = 0
      onGrowth(delta)
    }
    const observer = new ResizeObserver(entries => {
      const measuredHeight = entries[0]?.contentRect.height
      if (measuredHeight === undefined || !Number.isFinite(measuredHeight)) return
      const nextHeight = measuredHeight
      if (previousHeight !== null && nextHeight > previousHeight + 0.5) {
        pendingGrowth += nextHeight - previousHeight
        if (growthFrame === null) growthFrame = requestAnimationFrame(flushGrowth)
      }
      previousHeight = nextHeight
    })
    observer.observe(root)
    return () => {
      observer.disconnect()
      if (growthFrame !== null) cancelAnimationFrame(growthFrame)
```

</details>

#### 缺口

- 缺实际浏览器帧轨迹及选择操作
  **影响**：可能与宿主折叠或其它滚动插件竞争
  **进一步探讨**：同输出记录布局、掉帧、手动上滚和折叠点击

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样证明阅读改善没有掩盖输出？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

用同一段含中文、emoji、代码、表格和工具穿插的录制流，原生与插件在相同窗口大小和刷新率回放。合格结果为最终文本逐字一致，完成 drain 后工具按钮可操作；手动上滚不被拉回，选区不丢，切会话/卸载后 listener 和 wrapper 都恢复。记录首字、尾字、掉帧和手工回看次数，不把主观“丝滑”当性能结论。假设是较少视线跳跃值得增加有限显示延迟；若尾字明显延迟、长输出积压或交互冲突则证伪并禁用回原 renderer。资源成本是浏览器主线程和额外维护，未测不填零。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/useSmoothStreamContent.ts:409-448](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/useSmoothStreamContent.ts#L409-L448)

生产完成仍 drain。

<details>
<summary>查看原文（40行）</summary>

```text
  // here. That single commit is a visible teleport whenever a fast stream
  // ends with standing backlog — hundreds of chars become thousands of px in
  // one frame, exactly the end-of-render jerk this plugin fights. The frame
  // loop's producer-complete branch already drains the queue at a bounded
  // constant velocity (computeCompletionDrain), which finishes near its
  // configured deadline and glides every px through the spring. Nothing is left
  // "typing" after the Agent stops; the tail just closes at drain speed.
  //
  // Non-append-only edits and disabled streams still sync immediately below.

  const startFrameLoop = useCallback(() => {
    if (rafRef.current !== null) return

    const tick = (now: number) => {
      const targetCount = targetCountRef.current
      const displayedCount = displayedCountRef.current
      const backlog = targetCount - displayedCount

      if (backlog <= 0) {
        queueDebtRef.current = 0
        settleCpsRef.current = null
        const speedOut = speedOutRef.current
        if (speedOut !== undefined) speedOut.current = seedCps
        debugRuntime.reportStream(streamIdRef.current, null)
        stopFrameLoop()
        return
      }

      if (lastFrameTsRef.current === null) {
        lastFrameTsRef.current = now
        rafRef.current = requestAnimationFrame(tick)
        return
      }

      const frameIntervalMs = Math.max(0, now - lastFrameTsRef.current)
      const dtSeconds = Math.max(0.001, Math.min(frameIntervalMs / 1000, 0.12))
      // How much time this frame may reveal *for*: bounded by the visual
      // interval so an overrun cannot compound. Ramps that genuinely depend on
      // elapsed time keep the real dtSeconds.
      const growthMs = Math.max(1, Math.min(frameIntervalMs, REVEAL_MAX_GROWTH_MS))
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:219-226](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/index.ts#L219-L226)

退出恢复判据。

```text
  wrapAll()
  const off = ctx.on('slots/changed', (key: string) => {
    if (key === 'conversation.chat.node') wrapAll()
  })
  return () => {
    off()
    for (const restore of restores) restore()
  }
```

**依据 3 · 源码核查**：[src/client/FollowHost.tsx:62-88](https://github.com/Laplace-bit/dsh-smooth-stream/blob/304f90066620316bd54190099ecbba56ece06316/src/client/FollowHost.tsx#L62-L88)

观察与清理。

<details>
<summary>查看原文（27行）</summary>

```text
    if (onGrowth === undefined || typeof ResizeObserver === 'undefined') return
    const root = rootRef.current
    if (root === null) return
    let previousHeight: number | null = null
    let pendingGrowth = 0
    let growthFrame: number | null = null
    const flushGrowth = (): void => {
      growthFrame = null
      if (pendingGrowth <= 0) return
      const delta = pendingGrowth
      pendingGrowth = 0
      onGrowth(delta)
    }
    const observer = new ResizeObserver(entries => {
      const measuredHeight = entries[0]?.contentRect.height
      if (measuredHeight === undefined || !Number.isFinite(measuredHeight)) return
      const nextHeight = measuredHeight
      if (previousHeight !== null && nextHeight > previousHeight + 0.5) {
        pendingGrowth += nextHeight - previousHeight
        if (growthFrame === null) growthFrame = requestAnimationFrame(flushGrowth)
      }
      previousHeight = nextHeight
    })
    observer.observe(root)
    return () => {
      observer.disconnect()
      if (growthFrame !== null) cancelAnimationFrame(growthFrame)
```

</details>

#### 缺口

- 无当前宿主阅读或性能对照
  **影响**：只能条件试用，不能证明全场景顺滑
  **进一步探讨**：录制流对照和视觉/性能轨迹一起验收

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
