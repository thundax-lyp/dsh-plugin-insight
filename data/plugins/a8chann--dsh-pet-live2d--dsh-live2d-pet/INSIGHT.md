# dsh-pet-live2d

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[9b7cd8e](https://github.com/A8Chann/dsh-pet-live2d/tree/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet)

<!-- BEGIN META -->
[![GitHub ★ 69](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=69&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A8Chann/dsh-pet-live2d) [![npm 30d 10,552](https://img.shields.io/static/v1?label=npm+30d&message=10%2C552&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-pet-live2d)
<!-- END META -->

> **功能**：为 DSH Web GUI 提供可拖动、随鼠标和会话状态变化的 Live2D 宠物。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示其将宿主事件映射为角色反馈；没有证明效率或用户效果改善。

> **主要限制**：[Q03](#research-q03) 显示同步只比较 pet.json，不能保证其他同名用户修改不被复制覆盖。

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
  - [Q01 · 桌宠面向什么场景，相对静态装饰和宿主状态有什么增量？](#detail-section-11)
  - [Q02 · 宿主事件如何到页面动画，生命周期边界是什么？](#detail-section-12)
  - [Q03 · 更新宠物文件是否真的保护所有本地更改？](#detail-section-13)
  - [Q04 · 访问、运行时及素材许可带来什么成本和退出条件？](#detail-section-14)
  - [Q05 · 能否更可靠地避免更新覆盖用户素材？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 用户希望在界面中以可互动角色查看会话阶段和个性化装扮。

宿主原生状态提示可提供任务状态，静态桌宠提供装饰；两者不必具备本组件的相位映射。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 会话相位 | 映射状态到动作 | 真实宿主未验 |
| 模型素材 | 读取引用闭包 | 路由与外层鉴权未全面审计 |
| 更新同步 | 根据 manifest 指纹同步 | 其他同名文件可能覆盖 |

**流程与依赖**

| 依赖 | 条件 | 用途 | 缺失影响 |
|---|---|---|---|
| 兼容 DSH 与 webServer | 必需 | 注入路由和客户端 | 无宿主接线 |
| WebGL、Live2D Core | 渲染需要 | 角色模型 | 渲染失败 |
| CDN 或本地 Core | 首次需要 | 获取专有运行时 | 两者不可用时 502 |
| 模型许可 | 使用内置素材 | 授权范围 | 商业用途须另核授权 |

| 步骤 | 执行者与动作 | 判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、素材许可并备份目录 | 权限或许可不符则停止 |
| 加载 | 宿主注入路由及页面 | 缺 Core 时检查网络和本地缓存 |
| 使用 | 用户观察角色及状态 | 状态不同步时回原生提示 |
| 更新 | 用户备份后检查模型目录 | 冲突或异常时恢复备份 |

**效果与成本**

| 阶段 | 资源 | 人工 | 未知 |
|---|---|---|---|
| 首次 | 宿主、图形环境、Core | 配置与许可核对 | 可用性未知 |
| 持续 | 渲染及事件连接 | 排查影响、备份 | 资源消耗未测 |
| 恢复 | 宠物目录备份 | 处理覆盖及卸载残留 | 恢复未测 |

| 效果 | 支持依据 | 未知 |
|---|---|---|
| 相位反馈 | 事件映射和客户端源码 | 识别效果和干扰 |
| 本地素材服务 | 引用集合及 realpath | 外层宿主安全 |
| 升级保护 | pet.json 指纹 | 非 manifest 素材可能覆盖 |

> **思考**：[Q03](#research-q03) 显示同步只比较 pet.json，不能保证其他同名用户修改不被复制覆盖。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 显示其将宿主事件映射为角色反馈；没有证明效率或用户效果改善。

[Q02](#research-q02) waterfall 异常时尝试继续链路，事件间退回使用延迟；[Q03](#research-q03) 同步粒度与目录级保护声明不一致。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示同步只比较 pet.json，不能保证其他同名用户修改不被复制覆盖。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 有兴趣者先核对许可、备份整个宠物目录并在隔离环境观察；若数据保护或连接边界不可接受则停止。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

只检查固定版本代表性源码与作者文档，未安装或运行目标。

- 已检查：作者 README、包清单、源码路径 dsh-live2d-pet/README.md、dsh-live2d-pet/package.json、dsh-live2d-pet/lib/index.js、dsh-live2d-pet/lib/client.js 及固定范围 inventory；组件：dsh-live2d-pet。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查包声明、宿主事件、客户端 SSE、素材同步与访问边界；未完整审计客户端、大型 vendor、全部路由及桌面二进制。
- 下一步：在隔离宿主测试事件到渲染、CDN 失败、文件升级冲突及备份恢复；本次均未执行。

**分析版本**

- **仓库**：[A8Chann/dsh-pet-live2d](https://github.com/A8Chann/dsh-pet-live2d)
- **版本号**：3.5.0（[固定提交 9b7cd8e](https://github.com/A8Chann/dsh-pet-live2d/tree/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设逐文件指纹与冲突提示可减少误覆盖，需按受控样本证伪。

在隔离宿主测试事件到渲染、CDN 失败、文件升级冲突及备份恢复；本次均未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 5 | 1374 | — | — | 21930 |
| .js | source | 7 | 13342 | 8622 | 4170 | — |
| .ts | source | 1 | 32 | 18 | 13 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+created%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z) [![近30天关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/A8Chann/dsh-pet-live2d/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-05T13%3A26%3A04.262Z..2026-11-04T13%3A26%3A04.262Z)



统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查桌宠的宿主状态链、资源保护和采用边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌宠面向什么场景，相对静态装饰和宿主状态有什么增量？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向使用 DSH Web GUI 并希望持续看到陪伴式状态的用户；普通页面状态提示已能提供任务状态，静态桌宠也能提供装饰。本组件将会话阶段映射到角色动作、表情与气泡，并提供交互与装扮；这是视觉反馈和个性化而非更准确的任务执行。是否帮助发现等待审批、是否分散注意力以及真实用户频率均缺直接比较。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-live2d-pet/README.md:1-6](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/README.md#L1-L6)

作者描述目标宿主与角色。

```text
# dsh-pet-live2d

给 **DSH**（DeepSeek Harness）Web GUI 用的 **Live2D 桌宠插件**：一只可以拖动、跟着鼠标看、
点她会害羞、还会跟着会话状态换动作的桌宠。

自带 **DS鲸鱼娘**（8 组动作 + 44 个表情/道具），开箱即用。
```

**依据 2 · 作者声明**：[dsh-live2d-pet/README.md:15-26](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/README.md#L15-L26)

列出互动、会话相位与装扮。

<details>
<summary>查看原文（12行）</summary>

```text
## 功能

- **拖动 / 缩放**：位置和大小记在 localStorage，重启还在
- **跟随鼠标**：视线和头部跟着指针，移开（或窗口失焦）自动回正
- **点击反应**：点**头部**才挥锤撒娇，点身上其它地方只出气泡
- **事件穿透**：只有角色剪影吃鼠标事件，方形画布的透明处**穿透**到底下的页面，不挡 DSH 的 UI
- **跟着会话走**：订阅 DSH 的真实事件（`tools/*` 等），思考/工具/等待/完成/出错换动作与表情，
  长任务持续播放对应动画
- **待机摸鱼**：静置一会儿自己演一段（不会演「点击」「出错」这类专属动作）
- **都会自己收尾**：动作、定格、表情到点全部回到初始待机，不会卡住
- **全都可配**：20 个互斥槽位（装扮 + 表情），每个槽位一张可增删、带权重的条目表，
  条目之间还能配「同时 / 前提」关系；会话相位是同一套池子机制
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1266-1276](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L1266-L1276)

订阅状态与审批并保留回调。

<details>
<summary>查看原文（11行）</summary>

```text
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
```

</details>

#### 缺口

- 没有用户研究与状态提示对照
  **影响**：不能证明陪伴价值或减少漏审批
  **进一步探讨**：对比原有通知，记录识别率、干扰与负担。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主事件如何到页面动画，生命周期边界是什么？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

package 声明 web 客户端、bundle patch 和宿主入口。apply 创建 ActivityHub 并订阅事件，通过 webServer 注册路由；agent/status 在 running 时设 thinking，approval/request 设 waiting 并继续 waterfall；tools/pre/post 将 tool 名称写入相位并延迟退回，避免短间隔抖动。页面 ready 且支持 EventSource 时连接同源 events，再按相位配置选择槽位；不能由代码存在断言真实宿主调用、动画渲染或事件兼容已通过。注册异常被捕获，可能缺少状态而非中断程序。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/package.json:30-53](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/package.json#L30-L53)

宿主入口、客户端及最低 DSH 版本。

<details>
<summary>查看原文（24行）</summary>

```text
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": "./lib/client.js",
    "./desktop": "./lib/desktop.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./locale/*.json": "./locale/*.json",
    "./package.json": "./package.json"
  },
  "scripts": {
    "build:vendor": "esbuild src/vendor-entry.ts --bundle --format=iife --outfile=lib/live2d-vendor.js --minify --target=es2020"
  },
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
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:1241-1308](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L1241-L1308)

事件映射、waterfall 继续和延迟退回。

<details>
<summary>查看原文（68行）</summary>

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
      // Only step down if nothing else has taken over in the meantime.
      if (hub.phase === 'tool') hub.set('thinking', '')
    }, TOOL_IDLE_MS)
    return next()
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:1599-1610](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L1599-L1610)

路由集合及活动 hub 注册。

<details>
<summary>查看原文（12行）</summary>

```text
export function buildRoutes(hub, display, home) {
  const routes = [catalogRoute(), assetRoute(), runtimeRoute(), eventsRoute(hub)]
  if (display !== undefined) routes.push(layerRoute(display))
  // 共享设置：不依赖显示层（测试里也可能只给 home）。
  if (typeof home === 'string' && home !== '') routes.push(settingsRoute(home), soundRoute(home))
  return routes
}

export function apply(ctx) {
  const hub = new ActivityHub()
  attachActivityEvents(ctx, hub)
  ctx.effect(() => () => hub.dispose(), 'live2d-pet: activity hub')
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:1639-1652](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L1639-L1652)

清理与宿主路由注入。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/client.js:7589-7619](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/client.js#L7589-L7619)

ready 后同源 SSE 与相位选择。

<details>
<summary>查看原文（31行）</summary>

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
       *
       * 用户的原话是"相位跟摸鱼是一样的功能"，所以数据结构和抽法都照搬摸鱼：
       *   - 每个槽位一张条目表，条目有权重；权重 0 / 被删掉的条目不参与；
       *   - 抽中的条目把它自己的表情点亮，并且**先把 `pairs` 一起点亮**；
       *   - `requires` 是"播放的前提"：前提不成立的条目不参与这一轮抽（跳过）。
       *
       * 前提可能要靠**别的槽位这一轮的选择**才成立（挤番茄酱 要 蛋包饭），所以抽到
       * 稳定为止：第一轮把没有前提、或前提已经成立的槽位抽出来，第二轮再看剩下的，
       * 三轮不动就收手。
       */
      const applyPhase = (phase) => {
        // 相位名记在这里（而不是只记在 SSE 回调里）：`effectiveSlotChoice` 靠它判断
        // "会话进行中"，而诊断读口 `phaseNow()` 是直接调这个函数的 —— 分开写的话，
        // 诊断走的相位不会让槽位让位，测出来的行为跟真实路径不一样。
        phaseRef.current = phase;
        const slotById = new Map((pet?.expressionSlots ?? []).map((slot) => [slot.id, slot]));
        const pools = phasePoolsFor(phase);
```

</details>

#### 缺口

- 未运行固定宿主和浏览器
  **影响**：事件是否实际触发及视觉同步未知
  **进一步探讨**：隔离宿主中记录订阅、SSE、审批与断线重连。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 更新宠物文件是否真的保护所有本地更改？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

README 声称改过的目录不会覆盖。源码实际仅对目标 pet.json 计算 SHA-256，与同步记录或内置旧清单指纹比较；认可为原版且新清单哈希不同时，对整个目录执行递归 cpSync。因而仅改同名贴图等非 manifest 文件、未改 pet.json 的用户，在匹配文件名且触发更新时可能被覆盖；额外文件不在源中时可保留。此静态路径揭示文档保证与实际判据的差距，并非已发生的数据损失；升级前应备份整个宠物目录。

#### 证据与依据

**依据 1 · 作者声明**：[dsh-live2d-pet/README.md:8-11](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/README.md#L8-L11)

作者称用户修改不会覆盖。

```text
> **宠物会跟着插件一起更新**：随包的那只（以及它的默认设置：台词、互动反应、
> 会话相位、摸鱼槽位）在插件升级时**自动同步**到 `%DSH_HOME%\pets\ds-whale-girl\`。
> 你自己改过的那份**不会被覆盖**（判定是内容指纹，改过就一个字都不碰），
> 想拿回随包版本就把目录删掉、重启 `dsh web`，它会重新装一份。更新日志见 [CHANGELOG.md](CHANGELOG.md)。
```

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:743-768](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L743-L768)

只对 pet.json 计算与比较哈希。

<details>
<summary>查看原文（26行）</summary>

```text
  const record = readSyncRecord()
  const notes = []
  let dirty = false
  for (const name of names) {
    const source = join(bundled, name)
    const target = join(petsRoot(), name)
    try {
      if (!statSync(source).isDirectory()) continue
      const manifestPath = join(source, 'pet.json')
      if (!existsSync(manifestPath)) continue
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
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:777-789](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L777-L789)

清单改变后递归复制。

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:808-810](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L808-L810)

构建目录前触发安装同步。

```text
/** Build the live catalog from disk (fresh per request, so installs are picked up). */
export function buildCatalog() {
  installBundledPets()
```

#### 缺口

- 未在真实文件系统运行升级
  **影响**：不能推断实际用户已丢失文件或所有平台 cpSync 行为
  **进一步探讨**：备份后在隔离副本只改同名素材，换 manifest 后观察结果。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 访问、运行时及素材许可带来什么成本和退出条件？

**研究主题**：效果与总成本、采用判断

#### 完整回答

需要 DSH 兼容宿主和支持 WebGL 的环境；首次缺 Cubism Core 时服务器从官方 CDN 获取，检查长度和标记字符串后缓存，失败返回 502，此检查不验证固定哈希或签名。资产路由要求模型引用集合及 realpath 包含，且 loopbackOnly 对空 remoteAddress 也放行，不能把本机限制当鉴权。代码 MIT，而作者说明内置模型及图标为 CC BY-NC-SA 4.0，商业授权需另行确认。首次配置、运行资源、CDN 和后续维护耗时未知；先备份宠物目录，许可不适合或安全边界不满足则停用并复核残留数据。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/package.json:43-57](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/package.json#L43-L57)

宿主最低版本与可选桌面包。

<details>
<summary>查看原文（15行）</summary>

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
    "dsh-pet-live2d-desktop-darwin-arm64": "3.5.0",
    "dsh-pet-live2d-desktop-win32-x64": "3.5.0"
```

</details>

**依据 2 · 源码核查**：[dsh-live2d-pet/lib/index.js:127-166](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L127-L166)

相对路径校验与模型引用集合。

<details>
<summary>查看原文（40行）</summary>

```text
export function safeRel(raw) {
  if (typeof raw !== 'string' || raw.trim() === '') return undefined
  const value = raw.trim()
  if (value.includes('\\') || /^[a-z][a-z0-9+.-]*:/i.test(value) || /^[\\/]/.test(value)) return undefined
  const segments = value.split('/').filter((segment) => segment !== '')
  if (segments.length === 0) return undefined
  if (segments.some((segment) => segment === '.' || segment === '..' || !/^[A-Za-z0-9._-]+$/.test(segment))) return undefined
  return segments.join('/')
}

/**
 * The reference closure of one Cubism model3.json — exactly the files the
 * asset route may serve for the pet that declares it.
 */
export function modelClosure(model3) {
  const out = new Set()
  if (typeof model3 !== 'object' || model3 === null) return out
  const refs = model3.FileReferences
  if (typeof refs !== 'object' || refs === null) return out
  const push = (raw) => {
    const safe = safeRel(raw)
    if (safe !== undefined) out.add(safe)
  }
  if (refs.Moc !== undefined) push(refs.Moc)
  if (Array.isArray(refs.Textures)) refs.Textures.forEach(push)
  for (const key of ['Physics', 'Pose', 'DisplayInfo', 'UserData']) if (refs[key] !== undefined) push(refs[key])
  if (Array.isArray(refs.Expressions)) {
    for (const expression of refs.Expressions) {
      if (typeof expression === 'object' && expression !== null) push(expression.File)
    }
  }
  if (typeof refs.Motions === 'object' && refs.Motions !== null) {
    for (const motions of Object.values(refs.Motions)) {
      if (!Array.isArray(motions)) continue
      for (const motion of motions) {
        if (typeof motion === 'object' && motion !== null) push(motion.File)
      }
    }
  }
  return out
```

</details>

**依据 3 · 源码核查**：[dsh-live2d-pet/lib/index.js:834-841](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L834-L841)

realpath 包含。

```text
/** realpath containment; a symlink escaping its root is refused. */
function contained(base, candidate) {
  try {
    const realBase = realpathSync(base)
    const realCandidate = realpathSync(candidate)
    return realCandidate === realBase || realCandidate.startsWith(realBase + sep) ? realCandidate : undefined
  } catch {
    return undefined
```

**依据 4 · 源码核查**：[dsh-live2d-pet/lib/index.js:907-910](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L907-L910)

loopback 检查接受空地址。

```text
/** Loopback-only fence: the pet API never answers a non-local peer. */
function loopbackOnly(request) {
  const address = request.socket?.remoteAddress ?? ''
  return address === '' || address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1'
```

**依据 5 · 源码核查**：[dsh-live2d-pet/lib/index.js:1035-1063](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L1035-L1063)

CDN 下载检查内容与失败返回。

<details>
<summary>查看原文（29行）</summary>

```text
const CORE_CDN = 'https://cubism.live2d.com/sdk-web/cubismcore/live2dcubismcore.min.js'

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
```

</details>

**依据 6 · 作者声明**：[dsh-live2d-pet/README.md:398-409](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/README.md#L398-L409)

代码及模型许可声明。

<details>
<summary>查看原文（12行）</summary>

```text
## 许可

- 插件代码：MIT
- vendor 分包：pixi.js（MIT）+ untitled-pixi-live2d-engine（MIT），可随包分发
- Cubism Core：Live2D 专有，**不随包分发**；缺失时由宿主半区从 Live2D 官方 CDN 取一份并缓存到本地
- DS鲸鱼娘模型：**CC BY-NC-SA 4.0**（署名 · **非商业** · 相同方式共享），见
  [`pets/ds-whale-girl/LICENSE`](pets/ds-whale-girl/LICENSE)。
  **插件图标 `icon.png` 同属这一许可**（由模型待机画面裁切缩放而来，属于改编）。

  版权链：**上善无形**（鲸鱼娘角色原作，原创 OC「溟月」）→ **ZipZipPipe**（DeepSeek 女仆二创）
  → **氵六青**（本模型）。氵六青已授权本项目转载开源，但该授权**不解除基础版权**，
  所以 **NC / SA 依然有效**；商业使用需分别取得三人授权。完整说明见 [`../NOTICE.md`](../NOTICE.md)。
```

</details>

#### 缺口

- 未运行 CDN、桌面和安全边界
  **影响**：无法确认具体宿主兼容、真实资源或退出残留
  **进一步探讨**：离线隔离复核下载、权限与卸载，并向权利方确认许可。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否更可靠地避免更新覆盖用户素材？

**研究主题**：新假设与验证

#### 完整回答

基于 Q03 的单文件清单哈希与目录递归覆盖，假设同步记录中按文件保存原版指纹、逐文件比较，遇到本地修改则保留并报告冲突，可减少非 manifest 修改被覆盖。也需检查新增/删除文件、原版升级和中途失败，比较整目录备份与现有逻辑；若修改保留率无提升、误判或人工处理显著增加则否定。该方案是未验证的设计假设，不是已存在能力。

#### 证据与依据

**依据 1 · 源码核查**：[dsh-live2d-pet/lib/index.js:764-789](https://github.com/A8Chann/dsh-pet-live2d/blob/9b7cd8ed0d16bd23fb098bc0c4fdbac63d89de75/dsh-live2d-pet/lib/index.js#L764-L789)

单 manifest 判定与递归复制构成假设依据。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

#### 缺口

- 逐文件同步方案未实现也未评估
  **影响**：不能保证更安全或更省时间
  **进一步探讨**：用受控目录和冲突矩阵对照恢复成功率及人工处理量。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
