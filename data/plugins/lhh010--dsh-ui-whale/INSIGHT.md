# DSH Whale

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4fbb196](https://github.com/lhh010/dsh-ui-whale/tree/4fbb196304201b8919bc8e3085f07ea825c1c457)

<!-- BEGIN META -->
[![GitHub ★ 45](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=45&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lhh010/dsh-ui-whale)
<!-- END META -->

> **功能**：在 DSH Web 会话标题栏渲染会随运行、思考与工具调用活动的像素鲸鱼，并附带宿主更新入口。

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 将会话快照转换为常驻像素反馈，覆盖空闲、思考、工作、运行、停止及点按动作。

> **主要限制**：[Q03](#research-q03) 停止边沿不区分成功、失败或取消。浏览器启动会访问外部版本服务，宿主 POST 的访问和版本边界需独立核验。减少动画媒体规则仍使用相同缩放。

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
  - [Q01 · 哪类用户会使用桌宠，增量是什么？](#detail-section-11)
  - [Q02 · 服务端和浏览器怎样注册、触发、清理桌宠？](#detail-section-12)
  - [Q03 · 兼容、请求和故障有何边界？](#detail-section-13)
  - [Q04 · 要什么宿主、安装方式和维护成本？](#detail-section-14)
  - [Q05 · 如何测这类界面增量和干扰？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：等待 DSH Web 会话的用户希望在当前视图看到活动反馈。[Q01](#research-q01)

原生会话状态与消息流可直接查看。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 标题栏鲸鱼 | 状态动画和爱心 | 依赖 Web 槽位与快照 |
| 版本提示 | 显示可用、部分、阻止或离线 | 兼容未知会显示普通提示 |
| 宿主更新 | 点击请求调用 pnpm | 改变 Web profile，访问边界须验 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 相容 DSH Web、Cordis、React | 需要 | 加载 Host 和 Web 槽位 | 兼容横幅或缺席 |
| GitHub 网络、Git | 版本服务需要 | 查询 tag 与兼容表 | 离线或降级 |
| pnpm 与 Web profile 写权限 | 点按安装需要 | 换 tag | 报错或手动恢复 |
| DSH 源码快照 | 本地重建需要 | 解析 link 依赖 | 补齐快照 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 核对包及宿主版本 | 匹配精确字符串 |
| 挂载 | 临时 Web profile | 标题栏出现，原生操作正常 |
| 观察 | 运行、停止、取消和点击 | 区分停止与真实结果 |
| 退出 | 停用或还原 profile | 检查槽位和更新提示 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 宿主与包 | 选版本并检查槽位 | 安装未测 |
| 持续 | 绘制和外部查询 | 观察网络和界面 | 性能未测 |
| 恢复 | 可能重装和重启 | 核对 profile 和进程 | 回滚耗时未测 |
| 退出 | 临时 profile 快照 | 核对停用与还原 | 提示清理待验 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话反馈 | 状态到动画 | 辨识增益 |
| 易用性 | 标签和点按 | 窄窗和减少动画表现 |
| 换版 | 兼容提示及 pnpm 路由 | 访问、回滚和实际兼容 |

> **思考**：[Q03](#research-q03) 停止边沿不区分成功、失败或取消。浏览器启动会访问外部版本服务，宿主 POST 的访问和版本边界需独立核验。减少动画媒体规则仍使用相同缩放。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) [Q02](#research-q02) 将会话快照转换为常驻像素反馈，覆盖空闲、思考、工作、运行、停止及点按动作。

[Q02](#research-q02) 动画状态机与更新路径独立。[Q03](#research-q03) 更新提示版本判断和 POST 安装边界分离。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 停止边沿不区分成功、失败或取消。浏览器启动会访问外部版本服务，宿主 POST 的访问和版本边界需独立核验。减少动画媒体规则仍使用相同缩放。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 只在临时 profile 做合成对照，先拦截外网和安装进程。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码与分发出口支持 DSH 界面扩展和更新入口。真实兼容、外层网络边界、绘制开销和用户价值未验收。

- 已检查：作者 README、包清单、源码路径 README.md、src/client/WhalePet.tsx、cordis.patch.yml、src/index.ts、src/client/index.ts、src/client/animation.ts、src/update-endpoint.ts、lib/client.js、src/client/compat.ts、src/client/update-check.ts、lib/index.js、src/client/WhalePet.module.css、package.json、dsh.plugin.json、INSTALL.md、compatibility.json、src/client/update-chip.ts、tests/browser-plugin.spec.tsx、tests/update-decision.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根 DSH 插件，核对宿主和浏览器产物及代表状态和更新路径。未运行目标、测试或外部服务。
- 下一步：[Q05](#research-q05) 对照停止、失败与取消、窄窗、减少动画、出站、伪造更新请求及卸载。

**分析版本**

- **仓库**：[lhh010/dsh-ui-whale](https://github.com/lhh010/dsh-ui-whale)
- **版本号**：0.3.36（[固定提交 4fbb196](https://github.com/lhh010/dsh-ui-whale/tree/4fbb196304201b8919bc8e3085f07ea825c1c457)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 若对照中用户更快辨识状态且可区分停止与成功，同时不引入干扰，标题栏视觉才可能有持续价值。

[Q05](#research-q05) 对照停止、失败与取消、窄窗、减少动画、出站、伪造更新请求及卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 684 | — | — | 10902 |
| .js | source | 3 | 2017 | 1764 | 266 | — |
| .ts | source | 13 | 2046 | 1592 | 348 | — |
| .tsx | source | 1 | 109 | 65 | 34 | — |
| .mjs | source | 1 | 75 | 53 | 15 | — |
| .ts | test | 3 | 443 | 358 | 50 | — |
| .tsx | test | 1 | 172 | 136 | 22 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lhh010/dsh-ui-whale/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/lhh010/dsh-ui-whale/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lhh010/dsh-ui-whale/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：确认鲸鱼桌宠怎样接入 DSH 浏览器界面、响应什么信号，以及部署和更新会改变哪些页面行为。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪类用户会使用桌宠，增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

需要在等待 DSH Web 会话时通过标题栏快速感知活动的人，可选择把状态提示呈现为像素鲸鱼。相对原生会话状态，它添加常驻拟人反馈和点按爱心。运行结束喷水由 running 边沿触发，组件不判断任务结果。模型请求和工具 schema 属于作者所述的非目标范围。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:147-153](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/README.md#L147-L153)

作者定义目标交互和状态。

```text
## 它做什么

- **平时（空闲）**：隔一会儿眨一次眼（约 5 秒）；偶尔摆一下尾巴（约 11 秒一次，0-1-2-3-4-3-2-1-0 来回）；偶尔动动胸鳍（约 7 秒一次，0-1-2-1-0 来回）。
- **睡觉**：连续空闲 **10 秒**后入睡——头顶灰色「Z」按 **0-1-2-3-4-5-1-2-3-4-5-1-…** 循环（先静止姿态 0 一次，再上浮→渐小→淡出 1-5 反复）；睡觉期间动鱼鳍和甩尾巴照常；一有活动（思考 / 工作 / 运行 / 喷水庆祝）立即醒来。
- **思考 / 运行 / 工作中**：尾巴持续摆动 + 胸鳍持续扑动 + 眨眼更频繁。
- **回合完成时**：头顶喷水庆祝——水花按**单向 0-1-2-3-4-5-6** 喷起散开（不反向），喷完结束。
- **点击鲸鱼**：左上角冒出一颗粉色爱心，从小变大再消失（**单向 0-1-2-3-0**），期间其它动作照常进行；再点一次会重新从小爱心开始。
```

**依据 2 · 作者声明**：[README.md:198-200](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/README.md#L198-L200)

作者区分浏览器体验与模型请求。

```text
## Model Experience

无——纯浏览器端 UI 呈现：不进入模型请求、不增加提示词内容、不改任何工具 schema。
```

**依据 3 · 源码核查**：[src/client/WhalePet.tsx:49-52](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L49-L52)

三个快照信号供视觉反馈。

```text
export function WhalePet({ useSession, useConversation, t }: WhalePetProps) {
  const running = useSession(s => s.running)
  const thinking = useConversation(isThinking)
  const toolRunning = useConversation(hasRunningTool)
```

**依据 4 · 源码核查**：[src/client/WhalePet.tsx:65-79](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L65-L79)

运行落沿即触发喷水，不读取任务结果。

<details>
<summary>查看原文（15行）</summary>

```text
  useEffect(() => {
    // A completed turn (running true → false) arms the spout celebration.
    if (prevRunningRef.current && !running && spoutLeftRef.current <= 0) {
      spoutLeftRef.current = SPOUT_DURATION
    }
    prevRunningRef.current = running

    const timer = setInterval(() => {
      spoutLeftRef.current = Math.max(0, spoutLeftRef.current - 1)
      const base = moodOf(running, thinking, toolRunning)
      const mood: WhaleMood = spoutLeftRef.current > 0 ? 'spouting' : base
      setAnim(prev => advance(prev, mood))
    }, TICK_MS)
    return () => { clearInterval(timer) }
  }, [running, thinking, toolRunning])
```

</details>

**依据 5 · 源码核查**：[src/client/WhalePet.tsx:94-106](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L94-L106)

画面及辅助名称，点按推进爱心。

<details>
<summary>查看原文（13行）</summary>

```text
  const mood = anim.mood
  return (
    <div
      className={css.pet}
      data-mood={mood}
      data-heart={frame.heart}
      data-whale-pet
      role="img"
      aria-label={`${t('title')} · ${t(moodKey(mood))}`}
      title={t(moodKey(mood))}
      onClick={() => setAnim(prev => advance(prev, prev.mood, true))}
    >
      <span className={css.pixels} style={{ '--whale-shadows': shadows.body } as CSSProperties} />
```

</details>

#### 缺口

- 实际用户识别时间、主观偏好与误判未测。
  **影响**：常驻视觉有可能提升可感知性或增加干扰。
  **进一步探讨**：在固定会话脚本比较无插件与有插件的状态识别。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 服务端和浏览器怎样注册、触发、清理桌宠？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

profile 补丁挂 Cordis Host apply，Host 提供更新路由；客户端包在浏览器注册词典和会话标题栏槽位。React 从 Session 和 Conversation 的 Chat legacy 投影读取 running、partial reasoning、running calls，工作优先于思考。120ms tick 推导动作，连续约 10 秒 idle 后睡，点按触发爱心，帧组合成为单个 span 的 CSS box-shadow；卸载清 interval，Host effect 返回两个路由 disposer。更新提示自行创建 DOM，与槽位生命周期分开。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/cordis.patch.yml#L1-L4)

profile 插入插件。

```text
# The dsh-ui-whale bundle adds the pixel-whale companion to a DSH Web profile. Installed as one profile layer: the loader row scans for the dshClient declaration and mounts the client bundle in the browser.
- insert:
    - id: dsh-ui-whale
      name: '@dsh-external/dsh-ui-whale'
```

**依据 2 · 源码核查**：[src/index.ts:12-21](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/index.ts#L12-L21)

宿主需要 webServer 并注册路由。

<details>
<summary>查看原文（10行）</summary>

```text
/** The web server is required before the update endpoint can register. */
export const inject = ['webServer']

/**
 * Host plugin body: register the update endpoint.
 * @param ctx - host context carrying the webServer service.
 */
export function apply(ctx: Context): void {
  registerUpdateEndpoint(ctx)
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:50-57](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/index.ts#L50-L57)

浏览器 apply 先启动更新检查。

```text
import { startUpdateChip } from './update-chip.ts'

export function apply(ctx: ClientContext): void {
  startUpdateChip()
  // Graceful compatibility: if the running DSH lacks the client APIs this
  // plugin needs (e.g. an older DSH without ctx.slots.inject), render a
  // remediation banner instead of throwing.
  applyWithCompat(
```

**依据 4 · 源码核查**：[src/client/index.ts:65-79](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/index.ts#L65-L79)

检查服务后注册词典和槽位。

<details>
<summary>查看原文（15行）</summary>

```text
    [
      ['slots.inject', ctx?.slots?.inject],
      ['slots.register', ctx?.slots?.register],
      ['locale.register', ctx?.locale?.register],
    ],
    () => {
      ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-whale: dictionaries')

      ctx.slots.inject('conversation.session.header.actions', () => ctx.slots.register(
        { name: 'conversation.session.header.actions', id: 'whale', order: 30, locale: NS },
        WhalePet,
      ))
    },
  )
}
```

</details>

**依据 5 · 源码核查**：[src/client/WhalePet.tsx:33-42](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L33-L42)

Chat legacy 投影到推理和工具状态。

<details>
<summary>查看原文（10行）</summary>

```text
/** Whether the Chat view shows the model emitting reasoning with no tool in flight. */
function isThinking(snapshot: ConversationSnapshot): boolean {
  const chat = snapshot.views.get('chat')
  return chat?.legacy.partial?.blocks.some(block => block.kind === 'reasoning') ?? false
}

/** Whether the Chat view shows at least one running tool call. */
function hasRunningTool(snapshot: ConversationSnapshot): boolean {
  return (snapshot.views.get('chat')?.legacy.runningCalls.length ?? 0) > 0
}
```

</details>

**依据 6 · 源码核查**：[src/client/WhalePet.tsx:65-79](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L65-L79)

边沿、tick 和清理。

<details>
<summary>查看原文（15行）</summary>

```text
  useEffect(() => {
    // A completed turn (running true → false) arms the spout celebration.
    if (prevRunningRef.current && !running && spoutLeftRef.current <= 0) {
      spoutLeftRef.current = SPOUT_DURATION
    }
    prevRunningRef.current = running

    const timer = setInterval(() => {
      spoutLeftRef.current = Math.max(0, spoutLeftRef.current - 1)
      const base = moodOf(running, thinking, toolRunning)
      const mood: WhaleMood = spoutLeftRef.current > 0 ? 'spouting' : base
      setAnim(prev => advance(prev, mood))
    }, TICK_MS)
    return () => { clearInterval(timer) }
  }, [running, thinking, toolRunning])
```

</details>

**依据 7 · 源码核查**：[src/client/animation.ts:29-37](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/animation.ts#L29-L37)

定时节奏与入睡阈值。

```text

/** One animation tick = one advance call (component drives the cadence). */
export const TICK_MS = 120

/** Continuous idle before the whale falls asleep (10 s). */
export const SLEEP_DELAY_MS = 10_000

/** Continuous idle ticks before sleep starts: the first tick past the delay. */
export const SLEEP_DELAY_TICKS = Math.ceil(SLEEP_DELAY_MS / TICK_MS)
```

**依据 8 · 源码核查**：[src/client/animation.ts:186-191](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/animation.ts#L186-L191)

工作优先于思考。

```text
export function moodOf(running: boolean, thinking: boolean, toolRunning: boolean): WhaleMood {
  if (!running) return 'idle'
  if (toolRunning) return 'working'
  if (thinking) return 'thinking'
  return 'running'
}
```

**依据 9 · 源码核查**：[src/client/animation.ts:250-263](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/animation.ts#L250-L263)

连续 idle 决定睡眠，活动唤醒。

<details>
<summary>查看原文（14行）</summary>

```text
export function advance(state: WhaleAnimationState, mood: WhaleMood, heartRequested = false): WhaleAnimationState {
  // The input mood is a base mood (idle/thinking/working/running/spouting);
  // 'sleeping' is derived below from the continuous-idle streak and can only
  // arrive as an input when the component re-feeds its own effective mood.
  const base = mood === 'sleeping' ? 'idle' : mood
  const idle = base === 'idle'
  // Cap the streak: once the sleep threshold is reached, extra idle ticks add
  // nothing (the whale is already asleep).
  const idleStreak = idle ? Math.min(state.idleStreak + 1, SLEEP_DELAY_TICKS) : 0
  // Sleep is sticky while idle: once asleep, a click (or any idle re-feed)
  // must not wake the whale; only activity (a non-idle base) wakes it.
  const asleep = state.sleepStep >= 0
  const effective: WhaleMood = idle && (asleep || idleStreak >= SLEEP_DELAY_TICKS) ? 'sleeping' : base
  const continuous = continuousMotion(effective)
```

</details>

**依据 10 · 源码核查**：[src/client/WhalePet.tsx:83-106](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L83-L106)

逐帧组合成一个 box-shadow span。

<details>
<summary>查看原文（24行）</summary>

```text
  const frame: WhaleFrame = frameOf(anim)
  const shadows = useMemo(() => {
    const all = framePixelsFor(frame)
    // Split by palette value so each shadow string carries its own color:
    // group consecutive pixels is unnecessary — one box-shadow per pixel is
    // fine at this size and keeps the mapping trivially correct.
    return {
      body: boxShadow(all),
    }
  }, [frame])

  const mood = anim.mood
  return (
    <div
      className={css.pet}
      data-mood={mood}
      data-heart={frame.heart}
      data-whale-pet
      role="img"
      aria-label={`${t('title')} · ${t(moodKey(mood))}`}
      title={t(moodKey(mood))}
      onClick={() => setAnim(prev => advance(prev, prev.mood, true))}
    >
      <span className={css.pixels} style={{ '--whale-shadows': shadows.body } as CSSProperties} />
```

</details>

**依据 11 · 源码核查**：[src/update-endpoint.ts:198-202](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L198-L202)

卸载清除两个路由。

```text
      },
    })
    return () => { dispose(); latestDispose() }
  }, 'ui-whale: update endpoint')
}
```

**依据 12 · 源码核查**：[lib/client.js:1599-1621](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/lib/client.js#L1599-L1621)

实际浏览器出口包含同一 apply 和标题栏槽位。

<details>
<summary>查看原文（23行）</summary>

```text
		function apply(ctx) {
			startUpdateChip();
			applyWithCompat("@dsh-external/dsh-ui-whale", "当前 DSH 客户端 API 与插件不匹配", [
				"将 DSH 升级到已适配的版本（dsh-v0.1.2-alpha.1，源码构建安装）。",
				"或将插件更新到适配当前 DSH 的版本（仓库最新 tag）。",
				"如仍显示，请在插件目录执行 pnpm run build 后刷新页面。"
			], [
				["slots.inject", ctx?.slots?.inject],
				["slots.register", ctx?.slots?.register],
				["locale.register", ctx?.locale?.register]
			], () => {
				ctx.effect(() => ctx.locale.register(NS, {
					zh,
					en
				}), "ui-whale: dictionaries");
				ctx.slots.inject("conversation.session.header.actions", () => ctx.slots.register({
					name: "conversation.session.header.actions",
					id: "whale",
					order: 30,
					locale: NS
				}, WhalePet));
			});
		}
```

</details>

#### 缺口

- 宿主热重载时提示 DOM 与会话切换时动画连续性未验。
  **影响**：用户可能看到残留提示、旧状态或过多绘制。
  **进一步探讨**：在真实匹配宿主切换会话、卸载重载和检查计时器与提示。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 兼容、请求和故障有何边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

客户端 apply 开始时并行请求同源 latest、GitHub tags 和 raw package.json，即使同源成功仍发两个外部查询。服务端比较本地 DSH 版本与远程兼容表，前端缺兼容信息时显示普通升级；POST 只在该路由验证方法、固定 click 头、Origin 和 tag 格式，Origin 缺失可过，未在该点复核兼容或认证；接受后在 web profile 启动 pnpm add，链接安装提前拒绝。直接可达性需在宿主隔离环境实测。另有 reduced-motion 规则只重复默认 scale，CSS 帧仍由 React 写入。API 探测只在 apply 内运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/compat.ts:59-86](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/compat.ts#L59-L86)

检查 null/undefined 和同步注册异常。

<details>
<summary>查看原文（28行）</summary>

```text
/** Fail-closed feature check: every required capability must be present. */
export function requireCapabilities(
  checks: readonly (readonly [string, unknown])[],
): string[] {
  const missing: string[] = []
  for (const [label, value] of checks) {
    if (value === undefined || value === null) missing.push(label)
  }
  return missing
}

/** Wrapper: run a plugin body, and on any missing capability or thrown error
 * render the remediation banner instead of crashing. */
export function applyWithCompat(
  pluginName: string,
  cause: string,
  steps: readonly string[],
  checks: readonly [string, unknown][],
  body: () => void,
): void {
  const missing = requireCapabilities(checks)
  if (missing.length > 0) {
    renderCompatBanner(pluginName, pluginName, `${cause}(缺失：${missing.join('、')})`, steps)
    return
  }
  try {
    body()
  } catch (error) {
```

</details>

**依据 2 · 源码核查**：[src/client/update-check.ts:23-44](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/update-check.ts#L23-L44)

同源与两个浏览器侧外部请求端点。

<details>
<summary>查看原文（22行）</summary>

```text
async function latestFromHost(): Promise<HostLatest | undefined> {
  try {
    const res = await fetch(`/${UPDATE_ID}/latest`, { method: 'GET', signal: AbortSignal.timeout(9000) })
    if (!res.ok) return undefined
    const b: unknown = await res.json()
    const raw = b as { latest?: unknown; dshVersion?: unknown; latestSupported?: unknown; compat?: unknown }
    const latest = typeof raw.latest === 'string' && /^v\d+\.\d+\.\d+$/.test(raw.latest) ? raw.latest : undefined
    if (latest === undefined) return undefined
    return {
      latest,
      dshVersion: typeof raw.dshVersion === 'string' && raw.dshVersion !== '' ? raw.dshVersion : undefined,
      latestSupported: typeof raw.latestSupported === 'string' && /^v\d+\.\d+\.\d+$/.test(raw.latestSupported) ? raw.latestSupported : undefined,
      compat: raw.compat === true,
    }
  } catch { return undefined }
}
async function latestFromTags(): Promise<string | undefined> {
  try { const res = await fetch(`https://api.github.com/repos/${MIRROR}/tags?per_page=10`, { headers: { accept: 'application/vnd.github+json' }, signal: AbortSignal.timeout(8000) }); if (!res.ok) return undefined; const tags: unknown = await res.json(); if (!Array.isArray(tags)) return undefined; const stable = tags.map((e) => (e as GithubTag).name).filter((n): n is string => typeof n === 'string' && /^v\d+\.\d+\.\d+$/.test(n)); if (stable.length === 0) return undefined; return stable.reduce((newest, t) => (compareSemver(t, newest) > 0 ? t : newest)) } catch { return undefined }
}
async function latestFromRaw(): Promise<string | undefined> {
  try { const res = await fetch(`https://raw.githubusercontent.com/${MIRROR}/main/package.json`, { signal: AbortSignal.timeout(8000) }); if (!res.ok) return undefined; const pkg: unknown = await res.json(); const version = (pkg as { version?: unknown }).version; return typeof version === 'string' && /^\d+\.\d+\.\d+$/.test(version) ? `v${version}` : undefined } catch { return undefined }
}
```

</details>

**依据 3 · 源码核查**：[src/client/update-check.ts:55-64](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/update-check.ts#L55-L64)

Promise.all 并行，host 返回优先用于判定。

<details>
<summary>查看原文（10行）</summary>

```text
export async function fetchUpdateInfo(): Promise<UpdateInfo | undefined> {
  // All sources race in parallel: total latency is the slowest one instead of
  // their sum, so an offline machine shows the failure chip within seconds.
  // Only the host endpoint carries the DSH-version gating fields; the tag/raw
  // fallbacks degrade to the legacy plain-update behavior.
  const [host, tags, raw] = await Promise.all([latestFromHost(), latestFromTags(), latestFromRaw()])
  const latest = host?.latest ?? tags ?? raw
  if (latest === undefined) return undefined
  return { latest, dshVersion: host?.dshVersion, latestSupported: host?.latestSupported, compat: host?.compat }
}
```

</details>

**依据 4 · 源码核查**：[src/client/update-check.ts:73-83](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/update-check.ts#L73-L83)

兼容不明会显示可用更新。

<details>
<summary>查看原文（11行）</summary>

```text
export function decideUpdate(local: string, info: UpdateInfo): UpdateNotice {
  const { latest } = info
  if (compareSemver(latest, local) <= 0) return { kind: 'current', tag: latest }
  const dshVersion = info.dshVersion
  if (dshVersion === undefined || info.compat !== true) return { kind: 'available', tag: latest }
  // Newest release this DSH version can run; undefined means the map knows no
  // tag (newer than nothing) that supports the running DSH version.
  const supported = info.latestSupported !== undefined && compareSemver(info.latestSupported, local) > 0 ? info.latestSupported : undefined
  if (supported === undefined) return { kind: 'blocked', tag: latest, dshVersion }
  if (compareSemver(supported, latest) >= 0) return { kind: 'available', tag: latest }
  return { kind: 'partial', tag: supported, blocked: latest, dshVersion }
```

</details>

**依据 5 · 源码核查**：[src/update-endpoint.ts:119-138](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L119-L138)

link 检查、进程及超时。

<details>
<summary>查看原文（20行）</summary>

```text
function isLinkInstall(): boolean {
  try {
    const p = resolve(dshHomePath('profiles', 'web', 'node_modules', '@dsh-external'), 'dsh-ui-whale')
    return realpathSync(p) !== resolve(p)
  } catch { return false }
}

function runInstall(tag: string): Promise<{ ok: boolean; output: string; link: boolean }> {
  return new Promise((resolve) => {
    if (isLinkInstall()) { resolve({ ok: false, output: '', link: true }); return }
    const child = spawn('pnpm', ['add', `${PACKAGE_SPEC}@github:${MIRROR}#${tag}`], { cwd: dshHomePath('profiles', 'web'), shell: true })
    let output = ''
    let settled = false
    const settle = (value: { ok: boolean; output: string; link: boolean }): void => { if (settled) return; settled = true; resolve(value) }
    const timer = setTimeout(() => { try { child.kill() } catch { /* gone */ }; settle({ ok: false, output: `${output}安装超时（120s）`, link: false }) }, 120_000)
    child.stdout?.on('data', (c: Buffer) => { output += c.toString() })
    child.stderr?.on('data', (c: Buffer) => { output += c.toString() })
    child.on('error', (e) => { clearTimeout(timer); settle({ ok: false, output: `${output}${String(e)}`, link: false }) })
    child.on('close', (code) => { clearTimeout(timer); settle({ ok: code === 0, output, link: false }) })
  })
```

</details>

**依据 6 · 源码核查**：[src/update-endpoint.ts:161-176](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L161-L176)

GET 依据版本表精确匹配。

<details>
<summary>查看原文（16行）</summary>

```text
void Promise.all([latestFromGit(), compatFromRaw()]).then(([latest, compat]) => {
            const dshVersion = detectDshVersion()
            // Newest tag whose supported-DSH list contains the running DSH version;
            // clamped to the newest tag the git remote actually knows (the raw CDN
            // can lag behind a fresh push, and installing an unseen tag would fail).
            let latestSupported: string | undefined
            if (compat !== undefined && dshVersion !== undefined) {
              for (const [tag, dsh] of compat) {
                if (!dsh.includes(dshVersion)) continue
                if (latestSupported === undefined || semverCompare(tag, latestSupported) > 0) latestSupported = tag
              }
              if (latestSupported !== undefined && latest !== undefined && semverCompare(latestSupported, latest) > 0) latestSupported = latest
            }
            const body = `${JSON.stringify({ latest: latest ?? null, dshVersion: dshVersion ?? null, latestSupported: latestSupported ?? null, compat: compat !== undefined })}\n`
            res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' })
            res.end(body)
```

</details>

**依据 7 · 源码核查**：[src/update-endpoint.ts:180-197](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L180-L197)

更新 POST 检查与副作用，未在该分支重新匹配版本。

<details>
<summary>查看原文（18行）</summary>

```text
    const dispose = ctx.webServer.register({
      kind: 'exact', path: UPDATE_PATH,
      handler: async (req, res) => {
        const send = (status: number, value: unknown): void => { const body = `${JSON.stringify(value)}\n`; res.writeHead(status, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' }); res.end(body) }
        if (req.method !== 'POST') { send(405, { ok: false, error: 'method not allowed' }); return }
        // R-12 边界：宿主路由无鉴权，安装动作要求客户端专用头 + 同源 Origin 双保险。
        const clickToken = req.headers['x-dsh-plugin-update']
        const originHeader = req.headers.origin
        const sameOrigin = originHeader === undefined || (typeof originHeader === 'string' && originHeader === `http://${ctx.webServer.host}:${String(ctx.webServer.port)}`)
        if (clickToken !== 'click' || !sameOrigin) { send(403, { ok: false, error: 'forbidden: update requires the same-origin click header' }); return }
        try {
          const parsed: unknown = JSON.parse(await readBody(req))
          const tag = (parsed as { tag?: unknown }).tag
          if (typeof tag !== 'string' || !/^v\d+\.\d+\.\d+$/.test(tag)) { send(400, { ok: false, error: 'invalid tag' }); return }
          const hashBefore = hostBundleHash()
          const result = await runInstall(tag)
          send(result.link ? 200 : (result.ok ? 200 : 500), { ok: result.ok, link: result.link, output: result.output.slice(-4000), tag, hostChanged: result.ok && hashBefore !== hostBundleHash(), ...(result.ok ? {} : { recovery: `dsh plugin --profile web add '${PACKAGE_SPEC}@github:${MIRROR}#${tag}'` }) })
        } catch (e) { send(400, { ok: false, error: String((e as Error)?.message ?? e) }) }
```

</details>

**依据 8 · 源码核查**：[lib/index.js:313-330](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/lib/index.js#L313-L330)

分发 Host 产物含同样更新入口。

<details>
<summary>查看原文（18行）</summary>

```text
				const clickToken = req.headers["x-dsh-plugin-update"];
				const originHeader = req.headers.origin;
				const sameOrigin = originHeader === void 0 || typeof originHeader === "string" && originHeader === `http://${ctx.webServer.host}:${String(ctx.webServer.port)}`;
				if (clickToken !== "click" || !sameOrigin) {
					send(403, {
						ok: false,
						error: "forbidden: update requires the same-origin click header"
					});
					return;
				}
				try {
					const tag = JSON.parse(await readBody(req)).tag;
					if (typeof tag !== "string" || !/^v\d+\.\d+\.\d+$/.test(tag)) {
						send(400, {
							ok: false,
							error: "invalid tag"
						});
						return;
```

</details>

**依据 9 · 源码核查**：[src/client/WhalePet.module.css:14-21](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.module.css#L14-L21)

默认缩放 2。

```text
  --whale-c6: #808080;
  --whale-scale: 2;

  position: relative;
  flex: none;
  width: calc(40px * var(--whale-scale));
  height: calc(25px * var(--whale-scale));
  cursor: pointer;
```

**依据 10 · 源码核查**：[src/client/WhalePet.module.css:38-45](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.module.css#L38-L45)

reduce 仍只设置同样的缩放。

```text
/* prefers-reduced-motion: the pet holds its resting pose; React still
   re-renders frames but CSS shows the same result (blink/wag/flutter/spout
   are all style-driven box-shadow swaps, so nothing visibly animates). */
@media (prefers-reduced-motion: reduce) {
  .pet {
    --whale-scale: 2;
  }
}
```

**依据 11 · 源码核查**：[src/client/WhalePet.tsx:94-106](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L94-L106)

像素帧仍写入实际样式。

<details>
<summary>查看原文（13行）</summary>

```text
  const mood = anim.mood
  return (
    <div
      className={css.pet}
      data-mood={mood}
      data-heart={frame.heart}
      data-whale-pet
      role="img"
      aria-label={`${t('title')} · ${t(moodKey(mood))}`}
      title={t(moodKey(mood))}
      onClick={() => setAnim(prev => advance(prev, prev.mood, true))}
    >
      <span className={css.pixels} style={{ '--whale-shadows': shadows.body } as CSSProperties} />
```

</details>

#### 缺口

- Host 外层访问限制、浏览器 CORS、退出时进程及真实 reduced-motion 表现均未测试。
  **影响**：网络要求、Web profile 改写与无障碍预期影响采用。
  **进一步探讨**：用出站拦截、mock pnpm 和临时 profile 验证受控 HTTP、断网及减少动画模式。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 要什么宿主、安装方式和维护成本？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

package.json 0.3.36 导出 lib Node 和 Web 客户端、包含 Cordis 补丁；保留的 dsh.plugin.json 报 0.3.9，INSTALL.md 的旧版本和空 Node 描述与本提交出口不一致。以固定包、补丁和 compatibility.json 的精确版本列表为准，安装步骤为作者陈述。运行需要相容 Web 槽位、会话快照、Cordis 和 React。外部更新检查依赖网络和 Git，安装依赖可执行 pnpm 与 profile 写入；开发构建另有 DSH 源码快照 link。失败时界面可以给恢复命令、复制提示或请求重启。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-25](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/package.json#L2-L25)

当前版本、宿主和浏览器出口及 Web 元数据。

<details>
<summary>查看原文（24行）</summary>

```text
  "name": "@dsh-external/dsh-ui-whale",
  "version": "0.3.36",
  "private": true,
  "type": "module",
  "description": "DSH Web UI 像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，思考运行时持续动起来，回合完成头顶喷水，点击冒爱心，零核心改动。",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./invariant": "./lib/invariant.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-session-controller",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-chat",
        "@deepseek-ai/dsh-client-ui-conversation"
      ],
      "platform": "web"
```

</details>

**依据 2 · 源码核查**：[package.json:33-54](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/package.json#L33-L54)

开发命令、宿主 peer 和本地源码链接。

<details>
<summary>查看原文（22行）</summary>

```text
  "scripts": {
    "build": "tsdown",
    "typecheck": "tsc -p tsconfig.json",
    "test": "vitest run"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.1",
    "react": "^18.2.0"
  },
  "devDependencies": {
    "@deepseek-ai/dsh-api-session-controller": "link:../.dsh/source/current/packages/api/session-controller",
    "@deepseek-ai/dsh-client-locale": "link:../.dsh/source/current/packages/client/locale",
    "@deepseek-ai/dsh-client-store": "link:../.dsh/source/current/packages/client/store",
    "@deepseek-ai/dsh-client-test-runtime": "link:../.dsh/source/current/packages/test-support/client-runtime",
    "@deepseek-ai/dsh-client-ui-chat": "link:../.dsh/source/current/packages/client/ui-chat",
    "@deepseek-ai/dsh-client-ui-conversation": "link:../.dsh/source/current/packages/client/ui-conversation",
    "@deepseek-ai/dsh-client-ui-renderer": "link:../.dsh/source/current/packages/client/ui-renderer",
    "@deepseek-ai/dsh-client-ui-session": "link:../.dsh/source/current/packages/client/ui-session",
    "@deepseek-ai/dsh-client-ui-slots": "link:../.dsh/source/current/packages/client/ui-slots",
    "@deepseek-ai/dsh-invariants": "link:../.dsh/source/current/packages/runtime-diagnostics/invariants",
    "@deepseek-ai/dsh-home-paths": "link:../.dsh/source/current/packages/util/home-paths",
    "@deepseek-ai/dsh-host-webserver": "link:../.dsh/source/current/packages/host/webserver",
```

</details>

**依据 3 · 源码核查**：[dsh.plugin.json:2-8](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/dsh.plugin.json#L2-L8)

旧清单版本不同。

```text
  "id": "@dsh-external/dsh-ui-whale",
  "version": "0.3.9",
  "main": "./lib/index.js",
  "description": "DSH Web UI 像素鲸鱼伙伴插件：会话标题栏常驻，平时眨眼/偶尔摆尾/动胸鳍，空闲 10 秒后入睡（头顶 Z 循环），思考运行时持续动起来，回合完成头顶喷水，点击冒爱心，零核心改动。",
  "client": {
    "main": "./lib/client.js",
    "inject": [
```

**依据 4 · 作者声明**：[INSTALL.md:9-15](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/INSTALL.md#L9-L15)

旧说明把 Node half 称为空。

```text
> **npm 发版**：`v0.3.3` 兼容 DSH npm 发版 `@deepseek-ai/dsh@0.0.1-rc.5`（dist-tag `next`，即最终快照 snapshot0812 的 npm 发版）与 `@deepseek-ai/dsh@0.0.1-rc.2`（snapshot0811 的 npm 发版），实测运行/类型/启动清单通过。0811 起 vendored cordis 更名为 `@deepseek-ai/cordis`——本插件已把类型导入与 peer 迁移至 `@deepseek-ai/cordis`（`^4.0.1-rc.1`，npm rc.5 基线上为 `4.0.1-rc.4`），纯 `npm install` 不再报 ERESOLVE。经 `dsh plugin`/pnpm 安装自动处理。

前置：**DSH 已构建快照**（`~/.dsh/source/current` 指向含 `lib/` 产物的快照——`cordis` 与各 `@deepseek-ai/dsh-client-*` 的 `link:` 开发依赖从该快照解析）+ `dsh web` 运行中。本插件是**纯客户端插件包**（`dshClient` 行，Node half 为空），安装 = ① 包可被配置树解析 + ② 配置里加一行。

## 当前默认安装（dsh-v0.1.2-alpha.1，v0.3.5）

**最新版默认安装**：`v0.3.5` 面向 `dsh-v0.1.2-alpha.1`（GitHub tag，源码构建安装，不发布 npm；同为 `0.1.1-rc.1` 之后的最新版本）。
```

**依据 5 · 作者声明**：[README.md:23-35](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/README.md#L23-L35)

作者所述 profile 安装和 link 入口。

<details>
<summary>查看原文（13行）</summary>

````text
## 安装

> **安装方式（v0.3.27 起自动挂载）**：本包自 v0.3.27 起自带 `cordis.patch.yml` 并声明 `dsh.bundle.patch`——`dsh plugin --profile web add` 安装后**自动注册 profile 层并挂载**，不再需要手写 `insert` 配置行（固定旧 tag 的部署仍需）。**GUI 注意**：插件页「添加插件」只接受注册表包名或本地目录路径；`name@github:owner/repo#tag` 是 pnpm 别名规格（CLI 专用），粘进 GUI 会报 `ERR_PNPM_INVALID_PACKAGE_NAME`——GUI 请克隆后用本地目录路径，或等 npm 发布后用包名。


```sh
# 方式一：git 依赖固定 tag（公开镜像，推荐；也可用 github:lhh010/dsh-ui-whale）
dsh plugin --profile web add '@dsh-external/dsh-ui-whale@github:lhh010/dsh-ui-whale#v0.3.31'

# 方式二：本地 link（开发）
git clone https://github.com/lhh010/dsh-ui-whale.git
cd dsh-ui-whale && pnpm install && pnpm run build
dsh plugin --profile web add link:/path/to/dsh-ui-whale
````

</details>

**依据 6 · 源码核查**：[compatibility.json:2-9](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/compatibility.json#L2-L9)

版本表格式与 v0.3.36 开始条目。

```text
  "schema": 1,
  "note": "Machine-readable plugin-version -> supported DSH versions map. Maintained alongside the README compatibility table at every release. Exact string match; snapshot-era ids never match a live host version and are kept for history.",
  "versions": {
    "v0.3.36": {
      "dsh": [
        "0.1.2-alpha.1",
        "0.1.2-alpha.2",
        "0.1.2-alpha.3",
```

**依据 7 · 源码核查**：[compatibility.json:32-40](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/compatibility.json#L32-L40)

v0.3.36 固定版本表末段。

```text
        "0.2.1-rc.1",
        "0.2.1-rc.2",
        "0.2.1-rc.3",
        "0.2.1-rc.4",
        "0.2.2-alpha.2",
        "0.2.2-alpha.3",
        "0.2.2-rc.1"
      ]
    },
```

**依据 8 · 源码核查**：[src/update-endpoint.ts:37-53](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L37-L53)

服务端 Git 查询和失败缓存。

<details>
<summary>查看原文（17行）</summary>

```text
function latestFromGit(): Promise<string | undefined> {
  if (latestCache !== undefined && Date.now() - latestCache.at < CACHE_TTL_MS) return Promise.resolve(latestCache.latest)
  if (latestInflight !== undefined) return latestInflight
  latestInflight = new Promise((resolve) => {
    execFile('git', ['ls-remote', '--tags', REPO_GIT], { encoding: 'utf8', maxBuffer: 1024 * 1024, timeout: GIT_TIMEOUT_MS, killSignal: 'SIGKILL' }, (error, stdout) => {
      latestInflight = undefined
      let latest: string | undefined
      if (error === null && typeof stdout === 'string') {
        for (const line of stdout.split('\n')) {
          const trimmed = line.trim()
          if (trimmed.length === 0) continue
          const match = trimmed.match(/refs\/tags\/(v\d+\.\d+\.\d+)$/)
          if (match !== null && (latest === undefined || semverCompare(match[1]!, latest) > 0)) latest = match[1]!
        }
      }
      latestCache = { at: Date.now(), latest }
      resolve(latest)
```

</details>

**依据 9 · 源码核查**：[src/client/update-chip.ts:61-80](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/update-chip.ts#L61-L80)

更新成功、link 与失败分支。

<details>
<summary>查看原文（20行）</summary>

```text
  el.addEventListener('click', () => {
    label.textContent = '更新中…'
    void runUpdate(tag).then((result) => {
      if (result.ok) {
        label.textContent = result.hostChanged === true ? `已更新到 ${tag}（含宿主侧变更），请重启 dsh 生效` : `已更新到 ${tag}，客户端自动刷新生效（未见变化可硬刷新 Ctrl/Cmd+Shift+R）`
        el.setAttribute('title', '已更新，硬刷新生效')
        return
      }
      if (result.link) {
        void navigator.clipboard?.writeText(updatePrompt(tag))
          .then(() => { label.textContent = `本地 link 安装：已跳过自动更新，更新提示词已复制到剪贴板` })
          .catch(() => { label.textContent = `本地 link：请手动执行 pnpm add '${PACKAGE_SPEC}@github:${MIRROR}#${tag}'` })
        el.setAttribute('title', '悬停查看本地 link 说明')
        return
      }
      void navigator.clipboard?.writeText(updatePrompt(tag))
        .then(() => { label.textContent = `自动更新失败（详见剪贴板提示词）：${result.detail.slice(0, 80)}` })
        .catch(() => { label.textContent = `自动更新失败：${result.detail.slice(0, 80)}` })
      el.setAttribute('title', result.recovery !== undefined ? `${result.detail}\n恢复命令：${result.recovery}` : result.detail)
    })
```

</details>

#### 缺口

- 目标 profile、pnpm 政策、GitHub 可达性和回滚耗时未测。
  **影响**：构建与换版需要核验固定宿主，直接用旧安装示例可能选错版本。
  **进一步探讨**：先比对 package 与兼容表，再隔离验证安装、卸载和离线展示。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何测这类界面增量和干扰？

**研究主题**：新假设与验证、采用判断

#### 完整回答

在绑定环回的临时 Web profile 预置合成任务，开关插件对照原生状态。检查标题栏注册和清理、运行到停止的动画与耗时、窄窗和减少动画模式、错误/取消被误判为成功。拦截 GitHub 并在测试桩记录 GET/POST 与 pnpm 调用；真实安装动作要用隔离 profile 审核。若更新可绕过预期入口、干扰观察或无法还原，继续使用原生状态。

#### 证据与依据

**依据 1 · 源码核查**：[tests/browser-plugin.spec.tsx:85-98](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/tests/browser-plugin.spec.tsx#L85-L98)

仓库提供槽位注册和卸载测试，未执行。

<details>
<summary>查看原文（14行）</summary>

```text
describe('ui-whale browser plugin', () => {
  it('registers the whale header action with the documented id and order', async () => {
    const b = bench()
    await b.fiber.await()
    expect(b.entry()).toMatchObject({ id: 'whale', order: 30, locale: 'whale' })
  })

  it('disposal removes the registration (HMR safety)', async () => {
    const b = bench()
    await b.fiber.await()
    expect(b.entry()).toBeDefined()
    await b.dispose()
    expect(b.entry()).toBeUndefined()
  })
```

</details>

**依据 2 · 源码核查**：[tests/browser-plugin.spec.tsx:110-118](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/tests/browser-plugin.spec.tsx#L110-L118)

仓库路由测试只查登记，未执行。

```text

  it('node half registers the update endpoints', () => {
    const ctx = new Context()
    const registered: string[] = []
    ctx.provide('webServer', { register: (route: { path: string }) => { registered.push(route.path); return () => {} } } as never)
    nodeApply(ctx)
    expect(registered).toContain('/dsh-ui-whale/latest')
    expect(registered).toContain('/dsh-ui-whale/update')
  })
```

**依据 3 · 源码核查**：[tests/update-decision.spec.ts:12-34](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/tests/update-decision.spec.ts#L12-L34)

仓库验证兼容决策函数场景，未执行。

<details>
<summary>查看原文（23行）</summary>

```text
  it('no compat data or no dsh version -> legacy plain update', () => {
    expect(decideUpdate('v0.10.2', { latest: 'v0.10.3' })).toEqual({ kind: 'available', tag: 'v0.10.3' })
    expect(decideUpdate('v0.10.2', { latest: 'v0.10.3', dshVersion: '0.1.7-alpha.1' })).toEqual({ kind: 'available', tag: 'v0.10.3' })
    expect(decideUpdate('v0.10.2', { latest: 'v0.10.3', dshVersion: '0.1.7-alpha.1', compat: false })).toEqual({ kind: 'available', tag: 'v0.10.3' })
  })

  it('latest supports the running dsh -> available', () => {
    expect(decideUpdate('v0.10.2', { latest: 'v0.10.3', dshVersion: '0.1.7-alpha.1', latestSupported: 'v0.10.3', compat: true }))
      .toEqual({ kind: 'available', tag: 'v0.10.3' })
  })

  it('latest needs a newer dsh and an intermediate update exists -> partial', () => {
    expect(decideUpdate('v0.10.2', { latest: 'v0.11.0', dshVersion: '0.1.6-alpha.2', latestSupported: 'v0.10.3', compat: true }))
      .toEqual({ kind: 'partial', tag: 'v0.10.3', blocked: 'v0.11.0', dshVersion: '0.1.6-alpha.2' })
  })

  it('latest needs a newer dsh and nothing newer supports this dsh -> blocked', () => {
    expect(decideUpdate('v0.10.3', { latest: 'v0.11.0', dshVersion: '0.1.6-alpha.2', latestSupported: 'v0.10.3', compat: true }))
      .toEqual({ kind: 'blocked', tag: 'v0.11.0', dshVersion: '0.1.6-alpha.2' })
  })

  it('latestSupported at or below local is treated as no supported update (blocked, not partial)', () => {
    expect(decideUpdate('v0.10.3', { latest: 'v0.11.0', dshVersion: '0.1.5-rc.2', latestSupported: 'v0.10.1', compat: true }))
```

</details>

**依据 4 · 源码核查**：[src/client/WhalePet.tsx:65-79](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/client/WhalePet.tsx#L65-L79)

实际停止边沿和清理，可固定用例。

<details>
<summary>查看原文（15行）</summary>

```text
  useEffect(() => {
    // A completed turn (running true → false) arms the spout celebration.
    if (prevRunningRef.current && !running && spoutLeftRef.current <= 0) {
      spoutLeftRef.current = SPOUT_DURATION
    }
    prevRunningRef.current = running

    const timer = setInterval(() => {
      spoutLeftRef.current = Math.max(0, spoutLeftRef.current - 1)
      const base = moodOf(running, thinking, toolRunning)
      const mood: WhaleMood = spoutLeftRef.current > 0 ? 'spouting' : base
      setAnim(prev => advance(prev, mood))
    }, TICK_MS)
    return () => { clearInterval(timer) }
  }, [running, thinking, toolRunning])
```

</details>

**依据 5 · 源码核查**：[src/update-endpoint.ts:184-196](https://github.com/lhh010/dsh-ui-whale/blob/4fbb196304201b8919bc8e3085f07ea825c1c457/src/update-endpoint.ts#L184-L196)

负向覆盖应包含无 Origin/固定头和模拟安装。

<details>
<summary>查看原文（13行）</summary>

```text
        if (req.method !== 'POST') { send(405, { ok: false, error: 'method not allowed' }); return }
        // R-12 边界：宿主路由无鉴权，安装动作要求客户端专用头 + 同源 Origin 双保险。
        const clickToken = req.headers['x-dsh-plugin-update']
        const originHeader = req.headers.origin
        const sameOrigin = originHeader === undefined || (typeof originHeader === 'string' && originHeader === `http://${ctx.webServer.host}:${String(ctx.webServer.port)}`)
        if (clickToken !== 'click' || !sameOrigin) { send(403, { ok: false, error: 'forbidden: update requires the same-origin click header' }); return }
        try {
          const parsed: unknown = JSON.parse(await readBody(req))
          const tag = (parsed as { tag?: unknown }).tag
          if (typeof tag !== 'string' || !/^v\d+\.\d+\.\d+$/.test(tag)) { send(400, { ok: false, error: 'invalid tag' }); return }
          const hashBefore = hostBundleHash()
          const result = await runInstall(tag)
          send(result.link ? 200 : (result.ok ? 200 : 500), { ok: result.ok, link: result.link, output: result.output.slice(-4000), tag, hostChanged: result.ok && hashBefore !== hostBundleHash(), ...(result.ok ? {} : { recovery: `dsh plugin --profile web add '${PACKAGE_SPEC}@github:${MIRROR}#${tag}'` }) })
```

</details>

#### 缺口

- 用户可读性和故障归因缺对照。
  **影响**：采用价值取决于反馈辨识度能否超过附加界面与更新成本。
  **进一步探讨**：合成轮次记录状态识别正确率、识别时间、遮挡、请求及退出结果。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
