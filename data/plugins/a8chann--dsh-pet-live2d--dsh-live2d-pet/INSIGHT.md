# DSH Live2D Pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[053f083](https://github.com/A8Chann/dsh-pet-live2d/tree/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 56](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=56&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 10,317](https://img.shields.io/static/v1?label=npm+30d&message=10%2C317&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d)
<!-- END META -->

> **功能**：为 DSH 网页提供可拖动、跟随鼠标并随会话活动变化的 Live2D 桌宠。

> **亮点**：把宿主活动、用户互动优先与角色呈现接合，并有本机资源/跨端设置和显示owner设计；真实状态理解收益未测。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：manifest哈希不能保护所有同名用户资源；Hub无会话归属、断线也不自动标陈旧；跨端rev不是CAS且写入失败可只留本地变化。见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 原生入口、目标任务和实际增量？](#detail-section-11)
  - [Q02 · 活动如何到动作，归属及失败/断线怎样？](#detail-section-12)
  - [Q03 · 素材同步和Core缓存如何保护修改？](#detail-section-13)
  - [Q04 · 运行依赖、桌面协同与退出负担是什么？](#detail-section-14)
  - [Q05 · 谁值得怎样试用，什么设计值得继续验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望DSH长回合有视觉陪伴的个人用户，可观察粗粒度活动，不把动画当任务成果。见[Q01](#research-q01)。

原生文字/日志状态和不接任务的独立桌宠；Live2D渲染/模型来自上游，未证效率改善。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Live2D互动 | 拖动/跟随/装扮与陪伴 | WebGL、模型/Core与许可 |
| 活动相位 | 工具/审批/问答等转动作 | Host单相位，非选中会话/任务验收 |
| 素材/Core | 随包资源同步与运行时缓存 | manifest保护粒度、CDN内容非摘要锁定 |
| 跨端设置/显示 | 共享对象、心跳owner与按需桌面包 | rev非冲突锁，started非窗口可用 |

**流程与依赖**

网页引擎/Core/素材授权与可写目录必需，桌面平台包仅对应操作需要；表见[Q05](#research-q05)。

整目录备份、单网页静音小样，对照原生状态及重启/跨端回读，再核停用；步骤见[Q05](#research-q05)。

**效果与成本**

首次/常驻图形、轮询、完整素材恢复和升级成本未知；共享/桌面路径增加排障负担，表见[Q05](#research-q05)。

角色活动和互动链有依据，状态归属/保护/跨端效果不等于任务验收；效果见[Q05](#research-q05)。

> **思考**：manifest哈希不能保护所有同名用户资源；Hub无会话归属、断线也不自动标陈旧；跨端rev不是CAS且写入失败可只留本地变化。见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把宿主活动、用户互动优先与角色呈现接合，并有本机资源/跨端设置和显示owner设计；真实状态理解收益未测。见[Q01](#research-q01)、[Q02](#research-q02)。

活动/渲染分离、SSE快照、互动优先和owned进程清理可借鉴；manifest粒度、动态Core、普通共享读改写仍有维护代价。见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

manifest哈希不能保护所有同名用户资源；Hub无会话归属、断线也不自动标陈旧；跨端rev不是CAS且写入失败可只留本地变化。见[Q02](#research-q02)、[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有视觉陪伴偏好的个人用户可备份自定义目录后限单网页、静音试用，核穿透/状态/重启；误导、遮挡或跨端反复变化时停用，回原生状态并从完整备份恢复。见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持事件联动/资源/显示与共享设置设计，保护粒度和状态归属有明确边界；本轮不运行，网页单窗口有限试用，桌面/合并假设未验收。

- 已检查：作者 README、包清单、源码路径 dsh-live2d-pet/package.json、dsh-live2d-pet/README.md、dsh-live2d-pet/cordis.patch.yml、dsh-live2d-pet/lib/index.js、dsh-live2d-pet/lib/client.js、dsh-live2d-pet/lib/display.js、dsh-live2d-pet/lib/desktop.js、dsh-live2d-pet/lib/settings.js 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整复核旧报告五题/全部findings、证据版本和自身code依赖，仅作线索；本轮定向核Host事件/SSE/素材/Core与路由、client相位/清理/持久化、display与desktop下载和settings文件链。未通读vendor/全部模型或Rust壳，不执行/安装目标。
- 下一步：后续在授权环境做单窗口/双会话/断线对照、共享写失败/同组并发和临时素材矩阵；桌面平台另核摘要/心跳和退出归属。

**分析版本**

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.4.1（[固定提交 053f083](https://github.com/A8Chann/dsh-pet-live2d/tree/053f0837284c4997634842e77906c083b060f9d1)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是逐文件基线与显式冲突，补当前manifest整目录覆盖/漏更新；五类素材对照误覆盖、遗漏与人工冲突，负担更高或备份足够则停止。见[Q05](#research-q05)。

后续在授权环境做单窗口/双会话/断线对照、共享写失败/同组并发和临时素材矩阵；桌面平台另核摘要/心跳和退出归属。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1347 | — | — | 21223 |
| .js | source | 7 | 12869 | 8290 | 4042 | — |
| .ts | source | 1 | 32 | 18 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=5&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 5](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=5&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Live2D活动联动、素材保护和跨端状态的实际采用边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生入口、目标任务和实际增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是原生DSH插件。子包dsh-pet-live2d通过bundle挂载，Host apply建ActivityHub、显示层和资源/设置路由，client负责网页Live2D与设置；桌面二进制是可选平台依赖，不是本组件自身提供完整独立操作系统桌宠宿主。真实entry_type为plugin，不能按根仓库名把它当单一桌面应用。

目标是DSH长回合期间希望有视觉陪伴的个人用户，愿意用角色动作而非一直读文字观察活动。相对原生状态文字/日志，它增加低阅读量的角色呈现；相对不接任务事件的独立桌宠，它把工具、审批、问答、子Agent和结束相位映射到动作/表情/声音。自带模型和可调整槽位降低接线负担，Live2D/Pixi渲染与模型艺术来自上游，不把这些全部算为本组件原创。

合格结果是角色显示、透明处不挡操作、声效可控、相位不被误解且能关闭。它不验证任务成果，完成庆祝也不是业务验收。是否更快理解状态、减少等待焦虑或提升生产率，源码与作者功能描述都不能证明；没有需求对照时，只能把个人偏好和状态呈现作为试用目标。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/package.json:1-8](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/package.json#L1-L8)

子包身份与Host入口。

```text
{
  "name": "dsh-pet-live2d",
  "version": "3.4.1",
  "description": "Live2D 桌宠插件：为 DSH Web GUI 挂一只可拖动、会跟随鼠标、能换动作与表情的 Live2D 宠物。",
  "icon": "./icon.png",
  "type": "module",
  "main": "lib/index.js",
  "license": "MIT",
```

**依据 2 · 源码核查**：[dsh-live2d-pet/package.json:43-65](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/package.json#L43-L65)

bundle/Web客户端和可选桌面子包。

<details>
<summary>查看原文（23行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.1.5-rc.1"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [],
      "platform": "web"
    }
  },
  "optionalDependencies": {
    "dsh-pet-live2d-desktop-darwin-arm64": "3.4.1",
    "dsh-pet-live2d-desktop-win32-x64": "3.4.1"
  },
  "devDependencies": {
    "esbuild": "^0.25.10",
    "pixi.js": "8.19.0",
    "untitled-pixi-live2d-engine": "1.3.5"
  },
  "repository": {
    "type": "git",
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1563-1609](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L1563-L1609)

真实Host挂载。

<details>
<summary>查看原文（47行）</summary>

```text
export function apply(ctx) {
  const hub = new ActivityHub()
  attachActivityEvents(ctx, hub)
  ctx.effect(() => () => hub.dispose(), 'live2d-pet: activity hub')

  // 显示层：每秒一次"按偏好把两边摆正"。桌面端的二进制由平台子包带下来
  // （`lib/desktop.js`），没有就只是提示，不影响页面内那只。
  const display = createDisplayLayer({
    home: dshHome(),
    hint: desktopHint({ home: dshHome() }),
    resolveBinary: () => resolveDesktopBinary({ home: dshHome() }),
    log: (message) => console.log('[live2d-pet] ' + message),
  })
  // 宿主侧把它挂出来：设置路由与 `/api/live2d-pet/layer` 共用同一个控制器。
  display.binaryInfo = () => {
    const found = resolveDesktopBinary({ home: dshHome() })
    return {
      found: found !== undefined,
      path: found?.path ?? null,
      source: found?.source ?? null,
      supported: desktopSupported(),
      hint: desktopHint({ home: dshHome() }),
    }
  }
  const tick = setInterval(() => {
    try {
      display.reconcile()
    } catch (error) {
      console.log('[live2d-pet] 显示层 reconcile 失败：' + String(error && error.message))
    }
  }, 1000)
  tick.unref?.()
  ctx.effect(() => () => {
    clearInterval(tick)
    display.dispose()
  }, 'live2d-pet: display layer')

  ctx.inject(['webServer'], (host) => {
    for (const route of buildRoutes(hub, display, dshHome())) {
      try {
        host.effect(() => host.webServer.register(route), 'live2d-pet: route ' + route.path)
      } catch (error) {
        host.logger?.warn('live2d-pet: route ' + route.path + ' failed: ' + String(error))
      }
    }
  })
}
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/client.js:7210-7223](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/client.js#L7210-L7223)

事件到网页呈现入口。

<details>
<summary>查看原文（14行）</summary>

```text
    // ---- session activity (#4) -----------------------------------------
    // The host pushes the agent's coarse phase over same-origin SSE; each
    // transition drives a motion + expression so the pet visibly follows what
    // the assistant is doing. EventSource reconnects on its own.
    useEffect(() => {
      if (!ready || typeof window.EventSource === "undefined") return undefined;
      let source;
      try {
        source = new window.EventSource(API + "/events");
      } catch {
        return undefined;
      }
      /**
       * 一个相位的**抽签**：每个槽位在自己的池子里各掷一次，和摸鱼同一套。
```

</details>

#### 缺口

- 视觉陪伴是否降低误判或人工查看频率没有任务对照
  **影响**：限制采用必要性和净价值，不能用动画数量推定
  **进一步探讨**：同一长回合对比原生状态与桌宠，记录状态判断错误、查看次数和主观干扰。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 活动如何到动作，归属及失败/断线怎样？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

ActivityHub在Host实例保存一个phase/detail，snapshot只有phase/detail/at，事件hook没有按sessionId筛选。agent/status、tools/pre/post、approval/request、问答和subagent等会改变同一相位，agent/turn-stopping触发短促done再idle；多个会话/子Agent交错时，这表示最近被该Host接收的粗粒度活动，不能承诺是当前选中会话或全系统稳定汇总。

工具hook对瀑布链使用next，handler抛错也尝试继续原链，避免装饰状态中断工具；工具结束延迟回thinking降低连续工具抖动。子Agent结束只看当前是否helper，不是并发子Agent计数，因此一名结束不代表所有工作都完成。这个粒度适合陪伴，不能替代原生任务列表和日志。

/events先给snapshot再订阅hub并定时ping，断开清理监听。client在模型ready后建同源EventSource，解析phase，从加权池选择槽位/动作；用户刚点出的非phase动作优先，延后应用新phase。音频仅由当前显示owner播放，首snapshot与相同相位不响，可减少网页/桌面双声。

React effect卸载时close SSE、停上传声、清相位和sustain，这确有生命周期退路；但正常网络断线与effect卸载不同。本段没有error监听或过期计时去把已有phase改为未知，EventSource自动重连期间角色可能持续旧相位，重新连上才拿新snapshot。它不是可靠的在线/任务状态监测器，用户发现角色与当前任务不符时应回原生状态核对，而非从动作推断工具已成功。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:1112-1142](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L1112-L1142)

Host单phase和snapshot字段，无会话标识。

<details>
<summary>查看原文（31行）</summary>

```text
export class ActivityHub {
  constructor() {
    this.phase = 'idle'
    this.detail = ''
    this.listeners = new Set()
    this.holdTimer = undefined
  }

  /** Current snapshot (sent as the first frame of every stream). */
  snapshot() {
    return { phase: this.phase, detail: this.detail, at: Date.now() }
  }

  /** Subscribe one SSE response; returns the unsubscribe function. */
  subscribe(listener) {
    this.listeners.add(listener)
    return () => { this.listeners.delete(listener) }
  }

  set(phase, detail = '') {
    if (this.phase === phase && this.detail === detail) return
    this.phase = phase
    this.detail = detail
    this.emit()
  }

  /**
   * 演一个**短促反应**相位，过一会儿自动回落到 `fallback`。
   *
   * `done`（庆祝）和 `queued`（收到你排队的消息）都是这一类：宠物演一下，然后回到
   * 它该在的地方。回落之前会确认相位没被别人接管 —— 这段时间里工具开始了、或者
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1197-1260](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L1197-L1260)

事件归一、续链和工具计时。

<details>
<summary>查看原文（64行）</summary>

```text
export function attachActivityEvents(ctx, hub) {
  const on = (event, handler) => {
    try {
      ctx.on(event, handler)
    } catch {
      /* host without this event */
    }
  }
  // Waterfall events only continue if the handler resumes the chain, so a
  // throw here would silently break tool execution for the whole session.
  const onWaterfall = (event, handler) => {
    try {
      ctx.on(event, (...args) => {
        try {
          return handler(...args)
        } catch {
          // Never swallow the chain: hand control straight on.
          const next = args[args.length - 1]
          return typeof next === 'function' ? next() : undefined
        }
      })
    } catch {
      /* host without this event */
    }
  }
  on('agent/status', (payload) => {
    const status = payload?.status
    if (status === 'running') hub.set('thinking', '')
    else if (status === 'idle' && hub.phase !== 'done') hub.set('idle', '')
  })
  on('agent/turn-stopping', () => hub.celebrate())
  on('agent/error', () => hub.set('failed', ''))
  // approval/request is a waterfall event: it MUST resume the chain.
  on('approval/request', (_request, next) => {
    hub.set('waiting', '')
    return typeof next === 'function' ? next() : undefined
  })

  // Tool activity refines the generic 'thinking' phase while a turn runs.
  //
  // The obvious-looking event name for this is 'tool/call', but that is a
  // SESSION LOG event (a record appended to the transcript), not a cordis
  // lifecycle event — subscribing to it never fires, which is why the pet
  // appeared to ignore tool activity entirely. The live hooks are the
  // 'tools/*' waterfall events, which carry the ToolExecution itself.
  //
  // A turn usually runs MANY tools back to back, so reverting the instant one
  // returns would flap tool -> thinking -> tool several times a second, and each
  // transition restarts the pet's animation. The revert is therefore debounced:
  // it only happens once the tools actually stop arriving.
  let toolIdleTimer
  onWaterfall('tools/pre-execute', (exec, next) => {
    if (toolIdleTimer !== undefined) {
      clearTimeout(toolIdleTimer)
      toolIdleTimer = undefined
    }
    const name = exec?.name
    hub.set('tool', typeof name === 'string' ? name : '')
    return next()
  })
  onWaterfall('tools/post-execute', (_exec, _result, next) => {
    if (toolIdleTimer !== undefined) clearTimeout(toolIdleTimer)
    toolIdleTimer = setTimeout(() => {
      toolIdleTimer = undefined
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1285-1315](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L1285-L1315)

问答/子Agent/入队相位。

<details>
<summary>查看原文（31行）</summary>

```text
  onWaterfall('user-questions/request', (_request, next) => {
    hub.set('asking', '')
    const answered = typeof next === 'function' ? next() : undefined
    const back = () => {
      if (hub.phase === 'asking') hub.set('thinking', '')
    }
    if (answered !== null && typeof answered?.then === 'function') {
      answered.then(back, back)
      return answered
    }
    back()
    return answered
  })
  on('subagent/start', (info) => {
    const label = typeof info?.name === 'string'
      ? info.name
      : (typeof info?.label === 'string' ? info.label : '')
    hub.set('helper', label)
  })
  on('subagent/end', () => {
    if (hub.phase === 'helper') hub.set('thinking', '')
  })
  on('agent/inbox/inserted', () => {
    // 回到"刚才在演的那个"（可能是 tool / asking，也可能是 idle）——不要一律回 idle，
    // 那会让一个正在跑工具的回合看起来停了。
    const previous = hub.phase
    hub.hold('queued', QUEUED_HOLD_MS, previous === 'queued' ? 'thinking' : previous)
  })
}

/** The activity stream + snapshot route. */
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:1318-1367](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L1318-L1367)

SSE snapshot/ping及close处理。

<details>
<summary>查看原文（50行）</summary>

```text
    path: API + '/events',
    handler: (request, response) => {
      if (!loopbackOnly(request)) {
        response.writeHead(403)
        response.end()
        return
      }
      if (request.method !== 'GET' || hub === undefined) {
        response.writeHead(405, { allow: 'GET' })
        response.end()
        return
      }
      response.writeHead(200, {
        'content-type': 'text/event-stream; charset=utf-8',
        'cache-control': 'no-store',
        connection: 'keep-alive',
        'x-accel-buffering': 'no',
      })
      const frame = (payload) => {
        // Guard every write: the peer may have gone away mid-push.
        try {
          response.write('data: ' + JSON.stringify(payload) + '\n\n')
        } catch {
          /* stream already closed */
        }
      }
      frame(hub.snapshot())
      const unsubscribe = hub.subscribe(frame)
      const ping = setInterval(() => {
        try {
          response.write(': ping\n\n')
        } catch {
          /* stream already closed */
        }
      }, SSE_PING_MS)
      ping.unref?.()
      const close = () => {
        clearInterval(ping)
        unsubscribe()
      }
      request.on('close', close)
      response.on('close', close)
      response.on('error', close)
    },
  }
}

/**
 * 显示层路由：桌宠在页面内还是桌面上。
 *
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/client.js:7213-7223](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/client.js#L7213-L7223)

同源EventSource。

<details>
<summary>查看原文（11行）</summary>

```text
    // the assistant is doing. EventSource reconnects on its own.
    useEffect(() => {
      if (!ready || typeof window.EventSource === "undefined") return undefined;
      let source;
      try {
        source = new window.EventSource(API + "/events");
      } catch {
        return undefined;
      }
      /**
       * 一个相位的**抽签**：每个槽位在自己的池子里各掷一次，和摸鱼同一套。
```

</details>

**依据 6 · 源码核查**：[dsh-live2d-pet/lib/client.js:7410-7453](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/client.js#L7410-L7453)

相位更新、owner音频、用户动作优先和卸载清理。

<details>
<summary>查看原文（44行）</summary>

```text
        }
        const phase = payload?.phase;
        if (typeof phase !== "string") return;
        const initial = !receivedInitialPhase;
        receivedInitialPhase = true;
        setPhaseState(phase);
        if (phase === phaseRef.current) return;
        phaseRef.current = phase;
        // 只提示真正的新相位；首次 SSE 快照和相同相位重发都不响。
        //
        // 还要看"是不是我在显示"：页面与桌面窗口各收一份 SSE，两边都响就是每次响两遍
        // （issue #7）。这里读模块级 `layerStore`，**不能**读本 effect 闭包里的 `layer`
        // —— 依赖只有 [ready, applyExpressions]，闭包里那个 `layer` 是挂载时的旧值，
        // 会让让位永远慢一拍。
        if (!initial && isPhaseSoundOwner(layerStore.value.owner)) playPhaseSound(phase);
        // A phase animation may replace another phase animation, but must never
        // cut off something the user just triggered (tap / fidget / panel).
        const owner = motion.current.kind();
        if (motion.current.isPlaying() && owner !== "phase") {
          // Defer rather than drop: onDeferRedPhase re-applies it once the
          // current animation finishes, so the mirror never goes stale.
          pendingPhase.current = phase;
          return;
        }
        applyPhase(phase);
      };
      // A phase that persists would otherwise be re-applied after every
      // reaction; the ref remembers where we are so refires are no-ops.
      source.addEventListener("message", onMessage);
      return () => {
        source.close();
        stopUploadedSound();
        phaseRef.current = "idle";
        phasePinsRef.current = {};
        phaseSlotsRef.current = [];
        phaseChoicesRef.current = {};
        phaseSweepRef.current = null;
        applySweep();
        commitPinsRef.current();
        // A dropped stream must not leave the pet sustaining a phase forever.
        motion.current.setSustain(null);
        motion.current.setPhaseResolver(null);
      };
    }, [ready, applyExpressions]);
```

</details>

#### 缺口

- 多会话交错与断线期间相位陈旧程度没有独立测量
  **影响**：不能保证动画归属或实时性，影响状态理解收益
  **进一步探讨**：用两会话/两子Agent交错和断网重连对照原生记录，检查误归属、陈旧时长和声音。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 素材同步和Core缓存如何保护修改？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

“自己改过的一个字都不碰”必须按实际判据收窄。installBundledPets对pet.json计算哈希，目标不存在就复制；存在时以同步记录hash或已知历史manifest哈希识别为随包副本。若manifest哈希与新包相同直接跳过，若不同且仍被认定owned则cpSync整目录。只改同名贴图/动作/语音而pet.json没动时，后一次随包manifest发生变化仍可能覆盖这些用户资源；新增且包里不存在的文件才自然保留。

这是一条可从固定源码推出的覆盖条件，不是本轮实际用户丢数据报告。它还说明如果仅上游资源变、manifest内容不变，同hash短路可能不把资源更新带给用户。目录复制非整体事务，异常被catch吞下，可能留下部分同步状态；同步记录写失败也吞下，不能只凭启动没报错当素材已完整升级。备份必须包括完整模型目录及声音，不能只留pet.json。

Core无本地文件时从Live2D官方CDN fetch，检查HTTP、长度至少10000及包含Live2DCubismCore字符串，再缓存并返回；缓存写不下仍可服务本次，下次可能再取。它排除明显HTML替换，却不是固定内容摘要/签名验证，CDN动态变化影响复现。代码MIT不把专有Core或模型素材许可变成MIT；商业/再分发需分别按资源授权核对。本轮不取CDN或评估在线许可最新条款。

可迁移的是资源路径与渲染分离、缺运行时可诊断、以内容而非只版本号识别。但“整目录所有权”不足保护逐文件改动；下一步若做同步改良，要同时测试漏更新与误覆盖，不能只保证manifest不被改。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:653-660](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L653-L660)

判断只读manifest哈希。

```text
function isPristineBundledManifest(petId, manifestPath, fingerprints) {
  let hash
  try {
    hash = sha256(readFileSync(manifestPath))
  } catch {
    return false
  }
  return (fingerprints[petId] ?? []).includes(hash)
```

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:710-759](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L710-L759)

安装、same短路及整目录覆盖。

<details>
<summary>查看原文（50行）</summary>

```text
      const version = String(readJson(manifestPath)?.version ?? '')
      const targetManifest = join(target, 'pet.json')

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
      notes.push(name + '：宠物默认值更新到 ' + version + '（原先 ' + was + '）')
    } catch {
      /* 只读文件系统之类：让用户自己拷，别让整个目录扫描失败 */
    }
  }
  if (dirty) {
    try {
      writeSyncRecord(record)
    } catch {
      /* 记录写不进去只影响"下次少一次判定"，不影响这次已经装好的宠物 */
    }
  }
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:753-765](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L753-L765)

复制/记录错误未传播。

<details>
<summary>查看原文（13行）</summary>

```text
  if (dirty) {
    try {
      writeSyncRecord(record)
    } catch {
      /* 记录写不进去只影响"下次少一次判定"，不影响这次已经装好的宠物 */
    }
  }
  if (notes.length > 0 && options.quiet !== true) {
    for (const note of notes) console.log('[live2d-pet] ' + note)
  }
}

/** Build the live catalog from disk (fresh per request, so installs are picked up). */
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:993-1024](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L993-L1024)

Core校验和缓存失败边界。

<details>
<summary>查看原文（32行）</summary>

```text
/** 本地没有 Core 时：去 Live2D 官方 CDN 拿一份，顺手缓存到本地。 */
async function fetchCoreFromCdn(response, cachePath) {
  try {
    const upstream = await fetch(CORE_CDN, { redirect: 'follow' })
    if (!upstream.ok) throw new Error('HTTP ' + upstream.status)
    const bytes = Buffer.from(await upstream.arrayBuffer())
    // 拿回来的必须真是一份 JS：否则多半是被网关/登录页替换了。
    if (bytes.length < 10000 || !bytes.includes('Live2DCubismCore')) {
      throw new Error('unexpected payload: ' + bytes.length + ' bytes')
    }
    try {
      mkdirSync(dirname(cachePath), { recursive: true })
      writeFileSync(cachePath, bytes)
    } catch {
      /* 缓存写不进去不影响这一次：直接把它发出去 */
    }
    response.writeHead(200, {
      'content-type': 'text/javascript; charset=utf-8',
      'content-length': String(bytes.length),
      'cache-control': 'public, max-age=86400',
      'x-live2d-core-source': 'cdn',
    })
    response.end(bytes)
  } catch (error) {
    sendJson(response, 502, {
      ok: false,
      error: 'cubism-core-unavailable',
      detail: String(error?.message ?? error),
      hint: 'Cubism Core 是 Live2D 的专有运行时，本插件不内置。可以让这台机器能访问 '
        + CORE_CDN + '，或自行下载后放到 ' + join(runtimeDir(), 'live2dcubismcore.min.js'),
    })
  }
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/index.js:667-674](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L667-L674)

作者给出的模型与Core许可区别。

```text
 * 「看不见宠物」就是这么来的（插件包里有代码，没有模型）。
 *
 * 为什么模型能随包、Cubism Core 不能：模型是 CC BY-NC-SA 4.0，且 Live2D 作者
 * 已明确授权本项目转载与开源（见 pets/ds-whale-girl/LICENSE）；Core 是 Live2D Inc.
 * 的专有软件，只允许从官方渠道取，所以它走 CDN 兜底那条路。
 *
 * **升级这一半是补上的**（原来只有"目标不存在才拷"）：插件目录会随
 * `dsh plugin add` / npm 更新，用户的宠物目录不会 —— 于是宠物**自己的默认值
```

#### 缺口

- 不同素材修改和复制中断的实际文件结果未做对照
  **影响**：能识别保护粒度不足，但不能报告发生率/损失规模
  **进一步探讨**：临时目录构造只改manifest、只改贴图/声音、仅上游资源变和中断复制样本，核实际字节与恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 运行依赖、桌面协同与退出负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

网页路径需兼容DSH、WebGL、Live2D模型/引擎与Core，本机路由通过remoteAddress限制loopback，因此远程浏览器/反向代理可用性和权限不能直接外推。位置/尺寸留每个origin的localStorage，共享tuning/overrides/outfit走pet-settings.json，client定时轮询Host；不能把所有设置称全设备统一同步。

共享文件rev每次实际写加1，但没有expectedRev/CAS，tuning等每组整个对象替换而非组内深合并，直接writeFileSync没有temp/rename。两个进程/窗口同时修改同组仍可能覆盖。Host失败返回null并转500，client persistShared先写localStorage，再异步POST，失败不向调用者提供确认/重试队列；用户可能看到本地改了，但另一窗口仍旧，之后Host权威轮询又采用旧存档。不能把rev当冲突解决机制，写入和跨端确认应分开检查。

桌面显示由pet-desktop.json的6秒心跳和mode计算owner，网页让位而非两只都显示。Host每秒reconcile，desktop模式缺进程尝试启动；上游地址改变会收掉自己拉起的壳重拉。偏好合并写也是普通读改写，写错吞下；模式瞬时变化不保重启持久。dispose只结束它自己启动的子进程，不杀用户独立启动的壳，符合所有权退路，但跨进程心跳/路径与Rust counterpart未在本组件运行验证。

按需下载先回started，在后台取与本包版本对应npm tarball、解包指定平台文件后写DSH_HOME/bin并赋可执行权，之后才reconcile。started不是二进制已下载或窗口已显示；该手动下载链未校验dist.integrity或文件摘要，固定版本号不等于本轮已证明二进制来源完整。真实平台支持取决于解析器和平台子包，不能把网页核查升级为完整桌面验收。

首次负担是安装/重启、Core取回与素材许可，持续有GPU/内存/声音/SSE和轮询，失败要区分本地/Host状态与完整素材备份。现金、首载时间及常驻资源未知。停用释放客户端/Hub/自启进程的设计存在，但pets、缓存、bin、共享设置和用户输出仍是副本，退出不自动清空。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:865-868](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L865-L868)

远端地址loopback门。

```text
function loopbackOnly(request) {
  const address = request.socket?.remoteAddress ?? ''
  return address === '' || address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
}
```

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/settings.js:13-31](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/settings.js#L13-L31)

共享键与位置尺寸不共享。

<details>
<summary>查看原文（19行）</summary>

```text
// 三个键（与客户端的三类 shared 存档一一对应）：
//
//   tuning     ← `dsh-pet-live2d.settings.v1`  可调项（手感、池子节奏…）
//   overrides  ← `dsh-pet-live2d.settings.v2`  相位池子覆盖 + 开关 + 反应清空
//   outfit     ← `dsh-pet-live2d:outfit`       装扮槽位的选择
//
// **位置与大小不在里面**（`dsh-live2d-pet.state.v1`）：那个必须每个窗口各不相同
// （桌面上她贴屏幕右下角、DSH 页面里她贴面板右下角），共享了反而会打架。
//
// Rust 侧的对应实现见 `dsh-live2d-pet-desktop/src-tauri/src/host/settings.rs`：
// 独立模式下壳直接读写这个文件；挂载模式下页面读的仍是 DSH 的这条路由。
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

/** 存档里的键（客户端与 Rust 侧都按这三个名字读写）。 */
export const SETTINGS_KEYS = ['tuning', 'overrides', 'outfit']

export function settingsPath(home) {
  return join(home, 'pet-settings.json')
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/settings.js:60-98](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/settings.js#L60-L98)

rev和分组普通写入。

<details>
<summary>查看原文（39行）</summary>

```text
/**
 * 写共享设置（**合并写**：只动传进来的那几项，别把别的窗口写的擦掉）。
 *
 * 返回写好之后的那一份（含新的 `rev`）。写失败时返回 `null` —— 调用方要能区分
 * "没写成功"和"写成功了"，否则页面会以为同步好了。
 */
export function writeSettings(home, patch) {
  if (patch === null || typeof patch !== 'object') return null
  const current = readSettings(home)
  const next = {
    tuning: current.tuning,
    overrides: current.overrides,
    outfit: current.outfit,
    rev: current.rev + 1,
    at: Date.now(),
  }
  let touched = false
  for (const key of SETTINGS_KEYS) {
    const value = patch[key]
    if (value === null) continue          // 没传 = 不动这一项
    if (value === undefined) continue
    if (typeof value !== 'object' || Array.isArray(value)) continue
    next[key] = value
    touched = true
  }
  // **没有实际内容就不算一次写入**：不推进 `rev`、也不落盘。
  //
  // 这一条是防回环的：页面按 `rev` 判断"我这份是不是旧的"，如果"只带 rev 的空写"也推进
  // 版本号，另一个窗口就会以为有变化、于是回写一次 → 互相推着转。
  // （单元测试先红在这里，才有了这条注释。）
  if (!touched) return current
  try {
    mkdirSync(dirname(settingsPath(home)), { recursive: true })
    writeFileSync(settingsPath(home), JSON.stringify(next, null, 2) + '\n')
    return next
  } catch {
    return null
  }
}
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/client.js:3964-4023](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/client.js#L3964-L4023)

本地优先、静默POST和权威轮询。

<details>
<summary>查看原文（60行）</summary>

```text
  const persistShared = (patch) => {
    for (const [name, key] of Object.entries(sharedKeys())) {
      if (patch[name] === undefined) continue;
      writeLocal(key, patch[name]);
    }
    if (applyingHost) return;
    if (hostAvailable === false) return;
    try {
      void fetch(SETTINGS_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(patch),
        cache: "no-store",
      }).then((response) => {
        if (response.status === 404) { hostAvailable = false; return null; }
        if (!response.ok) return null;
        return response.json();
      }).then((payload) => {
        if (payload === null || payload === undefined) return;
        hostAvailable = true;
        if (typeof payload.rev === "number") sharedRev = payload.rev;
      }).catch(() => { /* 宿主不在就算了，本地那份已经写好了 */ });
    } catch {
      /* 同上 */
    }
  };

  /**
   * 拉一次宿主存档；有变化就灌进内存并广播。
   *
   * 这是"另一个窗口改了、这个窗口跟着变"的唯一途径 —— localStorage 的 `storage` 事件
   * **不会跨 origin 触发**，所以必须轮询（3 秒一次，代价可以忽略）。
   */
  const pullShared = async (apply) => {
    if (hostAvailable === false) return false;
    let payload = null;
    try {
      const response = await fetch(SETTINGS_URL, { cache: "no-store" });
      if (response.status === 404) { hostAvailable = false; return false; }
      if (!response.ok) return false;
      payload = await response.json();
    } catch {
      return false;
    }
    if (payload === null || typeof payload !== "object") return false;
    hostAvailable = true;
    const rev = typeof payload.rev === "number" ? payload.rev : 0;
    if (rev === sharedRev) return false;
    sharedRev = rev;
    cacheHost(payload);
    applyingHost = true;
    try {
      apply(payload);
    } finally {
      applyingHost = false;
    }
    return true;
  };

  /** 把一份共享存档灌进内存（tuning / overrides / outfit 各自的应用由调用方给）。 */
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/display.js:27-77](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/display.js#L27-L77)

心跳和owner计算。

<details>
<summary>查看原文（51行）</summary>

```text

export const MODES = ['auto', 'inline', 'desktop']

export function preferencePath(home) {
  return join(home, 'pet-desktop.json')
}

/** 读偏好文件；读不出来就当空（老装机本来就没有）。 */
export function readPreference(home) {
  try {
    const parsed = JSON.parse(readFileSync(preferencePath(home), 'utf8'))
    return parsed !== null && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

/** 写偏好文件（合并写：两端都在往里写，别把对方的东西擦掉）。 */
export function writePreference(home, patch) {
  const current = Object.assign(readPreference(home), patch)
  try {
    mkdirSync(home, { recursive: true })
    writeFileSync(preferencePath(home), JSON.stringify(current, null, 2) + '\n')
  } catch {
    /* 只读盘之类：这次生效，下次不记得 */
  }
  return current
}

export function normaliseMode(raw) {
  return typeof raw === 'string' && MODES.includes(raw) ? raw : 'auto'
}

export function heartbeatFresh(preference, now = Date.now()) {
  const at = typeof preference?.at === 'number' ? preference.at : 0
  const pid = typeof preference?.desktopPid === 'number' ? preference.desktopPid : 0
  return pid !== 0 && at !== 0 && now - at < HEARTBEAT_TTL_MS
}

/**
 * **判定规则**（唯一一条）。
 * @returns {'desktop'|'inline'}
 */
export function computeOwner(mode, heartbeatOk) {
  return mode !== 'inline' && heartbeatOk === true ? 'desktop' : 'inline'
}

/** 本机回环的几种写法 —— 它们指的是**同一台服务**。 */
const LOOPBACK_HOSTS = new Set(['localhost', '127.0.0.1', '::1', '[::1]'])

/**
```

</details>

**依据 6 · 源码核查**：[dsh-live2d-pet/lib/display.js:332-362](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/display.js#L332-L362)

reconcile和setMode。

<details>
<summary>查看原文（31行）</summary>

```text
  function reconcile() {
    const mode = normaliseMode(preference().mode)
    if (mode === 'desktop') {
      const alive = running()
      // **挂错上游的壳不会自愈**：`--attach` 定死在被拉起的那一刻，`setDshUrl()` 改不了
      // 已经在跑的那一只。收掉它，下一拍按新地址重拉 —— `stop()` 会把心跳清零，所以
      // 下一拍一定走下面的 `!alive`，正好把冷却绕开（冷却是给"起不来"用的，不是给这个）。
      if (needsReattach(alive, spawnedUrl, dshUrl)) {
        note('DSH 地址已变为 ' + dshUrl + '（当初用 ' + spawnedUrl + ' 拉的），重拉桌面端')
        stop()
        lastAttempt = 0
        return status()
      }
      if (!alive) {
        const result = start()
        if (result.reason === 'binary-missing') {
          // 说清楚"下一句该干什么"，而不是只报个失败。
          note(options.hint ?? '桌面端未安装')
        }
      }
      return status()
    }
    if (mode === 'inline' && childPid !== 0) stop()
    return status()
  }

  function setMode(mode) {
    const next = normaliseMode(mode)
    writePreference(home, { mode: next })
    note('显示层切换为 ' + next)
    return reconcile()
```

</details>

**依据 7 · 源码核查**：[dsh-live2d-pet/lib/display.js:373-397](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/display.js#L373-L397)

后台下载与自启进程dispose。

<details>
<summary>查看原文（25行）</summary>

```text
  function startDownload() {
    if (downloadState.state === 'downloading') return { started: false, reason: 'already-running' }
    downloadState = { state: 'downloading', at: Date.now() }
    note('开始下载桌面端二进制')
    downloadDesktopBinary({ home, log })
      .then((result) => {
        downloadState = result.ok === true
          ? { state: 'done', at: Date.now(), path: result.path, bytes: result.bytes }
          : { state: 'failed', at: Date.now(), reason: result.reason, detail: result.detail ?? null }
        note('下载结束：' + JSON.stringify(downloadState))
        // 下完就按当前 mode 摆正一次：mode 已经是 desktop 的话这里就把它拉起来了，
        // 用户不用再点第二次。
        if (result.ok === true) reconcile()
      })
      .catch((error) => {
        downloadState = { state: 'failed', at: Date.now(), reason: 'exception', detail: String(error && error.message) }
      })
    return { started: true }
  }

  function dispose() {
    // 插件停掉（DSH 退出 / 插件卸载）时，**不**杀掉用户自己在跑的桌面端；
    // 只收掉我们拉起来的那个 —— 那本来就是"插件的延伸"。
    stop()
  }
```

</details>

**依据 8 · 源码核查**：[dsh-live2d-pet/lib/desktop.js:242-301](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/desktop.js#L242-L301)

版本tarball下载解包直接写bin。

<details>
<summary>查看原文（60行）</summary>

```text
export async function downloadDesktopBinary(options = {}) {
  const { home, log } = options
  const name = desktopPackageName()
  if (name === undefined) return { ok: false, reason: 'unsupported-platform' }
  if (typeof home !== 'string' || home === '') return { ok: false, reason: 'no-home' }
  const version = ownVersion()
  const registry = options.registry ?? 'https://registry.npmjs.org'
  const note = (message) => { if (typeof log === 'function') log('[desktop] ' + message) }

  // 先问注册表要 tarball 地址（而不是拼 URL）：镜像/私有源都能跟着走。
  let tarballUrl = registry + '/' + name + '/-/' + name + '-' + version + '.tgz'
  try {
    const response = await fetch(registry + '/' + encodeURIComponent(name), { headers: { accept: 'application/json' } })
    if (response.ok) {
      const meta = await response.json()
      const url = meta?.versions?.[version]?.dist?.tarball
      if (typeof url === 'string' && url.startsWith('https://')) tarballUrl = url
    }
  } catch {
    /* 用上面拼的那个兜底 */
  }

  note('下载 ' + tarballUrl)
  let bytes
  try {
    const response = await fetch(tarballUrl)
    if (!response.ok) return { ok: false, reason: 'download-failed', status: response.status, url: tarballUrl }
    bytes = Buffer.from(await response.arrayBuffer())
  } catch (error) {
    return { ok: false, reason: 'download-failed', detail: String(error && error.message), url: tarballUrl }
  }

  // npm 的 tarball 是 gzip。绝大多数情况下它就是这样，但**别赌**：万一拿到的是未压缩的
  // tar（镜像/代理改过、或响应头骗人），gzip 解压会抛一个看不懂的错。这里按魔数认
  // （`1f 8b` 是 gzip），不是 gzip 就当成裸 tar 直接用。
  let tar
  try {
    tar = bytes[0] === 0x1f && bytes[1] === 0x8b ? await gunzipAsync(bytes) : bytes
  } catch (error) {
    return { ok: false, reason: 'extract-failed', detail: 'gunzip: ' + String(error && error.message) }
  }

  let inner
  try {
    inner = readFileFromTar(tar, 'package/bin/' + BINARY_NAME[process.platform])
  } catch (error) {
    return { ok: false, reason: 'extract-failed', detail: String(error && error.message) }
  }
  if (inner === undefined) return { ok: false, reason: 'binary-not-in-tarball', url: tarballUrl }

  const target = managedBinPath(home)
  try {
    mkdirSync(dirname(target), { recursive: true })
    writeFileSync(target, inner)
    if (process.platform !== 'win32') chmodSync(target, 0o755)
  } catch (error) {
    return { ok: false, reason: 'write-failed', detail: String(error && error.message), target }
  }
  note('已写入 ' + target + '（' + (inner.length / 1024 / 1024).toFixed(2) + ' MB）')
  return { ok: true, path: target, bytes: inner.length, url: tarballUrl }
```

</details>

#### 缺口

- 共享同组并发、持久失败及桌面二进制完整性/真实显示未独立核对
  **影响**：跨端一致与桌面采用成本更高，网页试用不能覆盖这些主张
  **进一步探讨**：先网页单窗口，再临时设置文件做并发/失败回读；桌面另核平台包摘要、心跳和退出归属。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 谁值得怎样试用，什么设计值得继续验证？

**研究主题**：采用判断、新假设与验证、工程质量与复用

#### 完整回答

有视觉陪伴偏好的个人用户可先限单窗口网页试用，采用前备份全部自定义宠物目录，用非敏感会话和可静音配置核角色/透明穿透/错误相位，不把桌宠done当任务完成。它比独立宠物多状态联动，但主要增益仍是偏好而非效率结论；桌面协同和共享状态应另做更高负担验证。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容DSH/WebGL及引擎 | 网页显示必需 | 加载与渲染 | 作者版本声明非本轮加载验收 |
| 宠物资源与单独许可 | 必需 | 动作/贴图/声音 | 缺资源或授权不明时不扩大使用 |
| Core缓存或首次CDN | 无本地Core时必需 | 专有运行时 | 失败502，内容检查非摘要锁定 |
| 可写pets/共享文件 | 同步持久化必需 | 升级/设置 | 本地看似生效不保证跨端保存 |
| 对应平台桌面包 | 桌面操作才必需 | 进程/心跳/窗口 | started非完成，网页可独立试用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户备份完整pets及所需设置 | 不只留manifest，保留原入口 |
| 网页小样 | 正确子包启用重启，先静音 | 模型可见/透明处不挡操作 |
| 状态核对 | 单会话工具/审批/错误与原生对照 | 归属不符回原生日志，不依赖动画 |
| 持久化 | 改一项后重开和另窗口回读 | 区分本地变化与Host确认 |
| 退出 | 停用并核声音/渲染及自启进程 | 用户独立壳与素材副本另处理 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 模型/Core下载、图形资源未知 | 安装、重启、备份及许可核对 | 首载时间/总资源未知 |
| 持续使用 | GPU/声音/SSE及轮询未知 | 检查遮挡、状态归属、音效 | 无常驻开销/效率对照 |
| 失败恢复 | 资源/设置副本空间未知 | 整目录恢复、核Host与本地差异 | manifest备份不足，共享rev不解冲突 |
| 升级退出 | 缓存/bin和历史素材空间未知 | 检查资源覆盖、清自启/私人数据 | stop不删除持久文件 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 活动联动 | 单Hub事件→SSE→相位/池子 | 多会话归属和断线实时性 |
| 用户互动 | 非phase动作优先与生命周期清理 | 真实资源/穿透与声音表现 |
| 素材升级 | manifest识别与整目录复制 | 逐文件保护/只改资源漏更新 |
| 跨端设置/显示 | Host共享文件、rev与心跳owner | 并发持久化和桌面实际可用 |

若动作与选中会话不符、断线仍持续“工作”、遮挡、噪声、资源负担明显或设置跨端反复变化，先停用并回原生状态/独立宠物；自定义素材先查完整备份，不盲删目录获取新版。

可借鉴的是Host活动归一与渲染/互动分离、状态流快照及显示owner。未验证方向选一个明确瓶颈：将素材所有权改为逐文件基线并显式列冲突，保留用户资源同时识别上游只改资源的更新。用未改、只改manifest、只改同名贴图/声音、用户新增、上游仅资源变五类样本比较误覆盖、漏更新与用户决策数；若复杂度导致更高人工冲突，或完整目录备份已足够，则停止独立同步引擎方向。这个假设未实现，不计当前保护效果。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:710-759](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/index.js#L710-L759)

素材所有权及短路/覆盖条件。

<details>
<summary>查看原文（50行）</summary>

```text
      const version = String(readJson(manifestPath)?.version ?? '')
      const targetManifest = join(target, 'pet.json')

      if (!existsSync(target)) {
        mkdirSync(dirname(target), { recursive: true })
        cpSync(source, target, { recursive: true })
        record[name] = { version, hash: sha256(readFileSync(targetManifest)) }
        dirty = true
        continue
      }

      const synced = record[name]
      const same = existsSync(targetManifest) ? sha256(readFileSync(targetManifest)) : undefined
      const ours = (synced !== undefined && synced.hash === same)
        || isPristineBundledManifest(name, targetManifest, fingerprints)
      if (!ours) {
        // 用户自己改过：不动它。**要说出来** —— 沉默地不升级，用户看到的是
        // "插件更新了但没有任何变化"，比报错更难查。
        if (compareVersions(version, readJson(targetManifest)?.version) > 0) {
          notes.push(name + '：宠物目录里这份被改过，跳过更新（随包版本 ' + version
            + '，本地 ' + String(readJson(targetManifest)?.version ?? '?') + '）')
        }
        continue
      }
      // **升级与否只看内容**，不看版本号：版本号是宠物自己声明的，随包那份在同一个
      // 版本号下改过（补默认值就是这么发生的），只比版本号会让这次修订永远发不出去。
      // 反过来，"版本相同 + 内容相同"在这里就短路了，不会做无谓的整份重写。
      const bundledHash = sha256(readFileSync(manifestPath))
      if (same === bundledHash) continue

      // cpSync 是逐文件覆盖 —— 用户额外放进去的文件（自己的贴图、备注）不在随包
      // 那份里，所以留得住。
      // 「原先」那个版本号要**在覆盖之前**读：覆盖之后再读只会读到新的，日志就成了
      // "更新到 1.1.0（原先 1.1.0）"（第一次跑就写成了这样）。
      const was = String(readJson(targetManifest)?.version ?? '?')
      cpSync(source, target, { recursive: true })
      record[name] = { version, hash: bundledHash }
      dirty = true
      notes.push(name + '：宠物默认值更新到 ' + version + '（原先 ' + was + '）')
    } catch {
      /* 只读文件系统之类：让用户自己拷，别让整个目录扫描失败 */
    }
  }
  if (dirty) {
    try {
      writeSyncRecord(record)
    } catch {
      /* 记录写不进去只影响"下次少一次判定"，不影响这次已经装好的宠物 */
    }
  }
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/client.js:7410-7453](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/client.js#L7410-L7453)

用户互动和清理。

<details>
<summary>查看原文（44行）</summary>

```text
        }
        const phase = payload?.phase;
        if (typeof phase !== "string") return;
        const initial = !receivedInitialPhase;
        receivedInitialPhase = true;
        setPhaseState(phase);
        if (phase === phaseRef.current) return;
        phaseRef.current = phase;
        // 只提示真正的新相位；首次 SSE 快照和相同相位重发都不响。
        //
        // 还要看"是不是我在显示"：页面与桌面窗口各收一份 SSE，两边都响就是每次响两遍
        // （issue #7）。这里读模块级 `layerStore`，**不能**读本 effect 闭包里的 `layer`
        // —— 依赖只有 [ready, applyExpressions]，闭包里那个 `layer` 是挂载时的旧值，
        // 会让让位永远慢一拍。
        if (!initial && isPhaseSoundOwner(layerStore.value.owner)) playPhaseSound(phase);
        // A phase animation may replace another phase animation, but must never
        // cut off something the user just triggered (tap / fidget / panel).
        const owner = motion.current.kind();
        if (motion.current.isPlaying() && owner !== "phase") {
          // Defer rather than drop: onDeferRedPhase re-applies it once the
          // current animation finishes, so the mirror never goes stale.
          pendingPhase.current = phase;
          return;
        }
        applyPhase(phase);
      };
      // A phase that persists would otherwise be re-applied after every
      // reaction; the ref remembers where we are so refires are no-ops.
      source.addEventListener("message", onMessage);
      return () => {
        source.close();
        stopUploadedSound();
        phaseRef.current = "idle";
        phasePinsRef.current = {};
        phaseSlotsRef.current = [];
        phaseChoicesRef.current = {};
        phaseSweepRef.current = null;
        applySweep();
        commitPinsRef.current();
        // A dropped stream must not leave the pet sustaining a phase forever.
        motion.current.setSustain(null);
        motion.current.setPhaseResolver(null);
      };
    }, [ready, applyExpressions]);
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/settings.js:60-98](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/settings.js#L60-L98)

持久化负担。

<details>
<summary>查看原文（39行）</summary>

```text
/**
 * 写共享设置（**合并写**：只动传进来的那几项，别把别的窗口写的擦掉）。
 *
 * 返回写好之后的那一份（含新的 `rev`）。写失败时返回 `null` —— 调用方要能区分
 * "没写成功"和"写成功了"，否则页面会以为同步好了。
 */
export function writeSettings(home, patch) {
  if (patch === null || typeof patch !== 'object') return null
  const current = readSettings(home)
  const next = {
    tuning: current.tuning,
    overrides: current.overrides,
    outfit: current.outfit,
    rev: current.rev + 1,
    at: Date.now(),
  }
  let touched = false
  for (const key of SETTINGS_KEYS) {
    const value = patch[key]
    if (value === null) continue          // 没传 = 不动这一项
    if (value === undefined) continue
    if (typeof value !== 'object' || Array.isArray(value)) continue
    next[key] = value
    touched = true
  }
  // **没有实际内容就不算一次写入**：不推进 `rev`、也不落盘。
  //
  // 这一条是防回环的：页面按 `rev` 判断"我这份是不是旧的"，如果"只带 rev 的空写"也推进
  // 版本号，另一个窗口就会以为有变化、于是回写一次 → 互相推着转。
  // （单元测试先红在这里，才有了这条注释。）
  if (!touched) return current
  try {
    mkdirSync(dirname(settingsPath(home)), { recursive: true })
    writeFileSync(settingsPath(home), JSON.stringify(next, null, 2) + '\n')
    return next
  } catch {
    return null
  }
}
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/display.js:393-397](https://github.com/A8Chann/dsh-pet-live2d/blob/053f0837284c4997634842e77906c083b060f9d1/dsh-live2d-pet/lib/display.js#L393-L397)

只结束自启进程。

```text
  function dispose() {
    // 插件停掉（DSH 退出 / 插件卸载）时，**不**杀掉用户自己在跑的桌面端；
    // 只收掉我们拉起来的那个 —— 那本来就是"插件的延伸"。
    stop()
  }
```

#### 缺口

- 逐文件合并与真实用户保护/维护收益尚无对照
  **影响**：不能把推导计作已解决，采用仍需完整备份
  **进一步探讨**：以临时文件矩阵和用户实际冲突数验证，收益不足即止于备份/提示。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
