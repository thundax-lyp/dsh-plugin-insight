# dsh-minigames

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[394138a](https://github.com/lhh010/dsh-minigames/tree/394138a8c0b89c5d931ae7d30763f659510bba7a)

<!-- BEGIN META -->
[![GitHub ★ 37](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=37&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/lhh010/dsh-minigames)
<!-- END META -->

> **功能**：在 DSH Web 页面挂载可收起、拖动的小游戏面板，并保留本地最高分。

> **亮点**：[Q01](#research-q01) 的增量是把短局小游戏纳入当前页面并记住面板及分数，减少窗口切换。游戏实例接口与聚焦检查为多款玩法提供共同挂载条件。

> **主要限制**：[Q02](#research-q02) 的更新 POST 可以改 web profile 的依赖。客户端的兼容显示可能降级，宿主安装按 tag 格式校验，实际访问控制需进一步确认。[Q01](#research-q01) 的主动聚焦亦须与聊天快捷键对照。

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
  - [Q01 · 游戏如何在同一 Web 窗口运行，能否保留聊天输入与游戏状态？](#detail-section-11)
  - [Q02 · 离线小游戏是否需要网络，自更新有哪些宿主写入与访问条件？](#detail-section-12)
  - [Q03 · 什么时候值得试用，怎样验证同窗收益足以覆盖宿主负担？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：等待模型回复时想玩一局的 DSH Web 用户，可以在当前页面打开游戏并保留聊天视野。

独立网页游戏也能满足短局娱乐，但需要切标签或窗口。插件添加同窗面板、状态保留及局部暂停。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 浮动面板 | 在聊天页内玩本地游戏 | 需兼容 Web 宿主，焦点待验 |
| 分数保存 | 记住最高分 | 依赖浏览器本地存储 |
| 更新 | 查询及安装指定标签 | 涉及 Web profile 依赖，权限需核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH Web、React 与宿主服务 | 是 | 挂载面板和更新路由 | 回到独立游戏页 |
| Git、pnpm 与固定兼容版本 | 安装及更新需要 | 安装到 profile | 跳过自动更新并检查构建 |

#### 操作流程

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 先比较 | 用户 | 先用独立游戏页做等待基准 | 不需要额外安装则保留原办法 |
| 验证边界 | 用户 | 隔离 profile 检查兼容、焦点和更新请求 | 端点或兼容未知时停止 |
| 退出 | 用户 | 卸载后复查面板和浮标 | 保留原 profile 备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 构建下载和隔离 profile | 核对版本与安装来源 | 实际耗时未知 |
| 持续 | 游戏循环及更新网络 | 维护兼容和浏览器焦点 | CPU 与带宽未测 |
| 失败和退出 | 恢复 profile 依赖 | 重启、硬刷新及核对浮标 | 回滚未验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 同窗短局 | 宿主挂载及代表游戏循环 | 全面游戏和浏览器覆盖 |
| 保留状态 | 面板和分数持久化 | 真实用户回到任务速度 |
| 更新 | 查询、点击、依赖安装 | 真实访问范围和回滚 |

> **思考**：[Q02](#research-q02) 的更新 POST 可以改 web profile 的依赖。客户端的兼容显示可能降级，宿主安装按 tag 格式校验，实际访问控制需进一步确认。[Q01](#research-q01) 的主动聚焦亦须与聊天快捷键对照。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 的增量是把短局小游戏纳入当前页面并记住面板及分数，减少窗口切换。游戏实例接口与聚焦检查为多款玩法提供共同挂载条件。

[Q01](#research-q01) 的游戏注册和销毁责任容易复用。[Q02](#research-q02) 的兼容建议、服务端安装校验及卸载清理需要独立检查。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的更新 POST 可以改 web profile 的依赖。客户端的兼容显示可能降级，宿主安装按 tag 格式校验，实际访问控制需进一步确认。[Q01](#research-q01) 的主动聚焦亦须与聊天快捷键对照。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先比较独立游戏页。若确有同窗需求，再在隔离 profile 核对 [Q01](#research-q01) 的焦点及 [Q02](#research-q02) 的更新权限后决定。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持面板、代表游戏、存分和更新接线。真实宿主兼容、更新时间、焦点与长期收益仍待验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/client/games/index.ts、src/client/games/registry.ts、src/client/games/snake/index.ts、src/client/index.tsx、src/client/panel/Panel.tsx、src/client/update-check.ts、src/client/update-chip.ts、src/index.ts、src/update-endpoint.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核对固定根插件、浏览器面板、贪吃蛇代表实例、注册表及更新端点。未穷尽所有游戏、浏览器或宿主外层网络鉴权。
- 下一步：以隔离 Web profile 比较聊天焦点、游戏隐藏和关闭，另用模拟安装器核对请求来源、重复更新和退出。

**分析版本**

- **仓库**：[lhh010/dsh-minigames](https://github.com/lhh010/dsh-minigames)
- **版本号**：0.12.4（[固定提交 394138a](https://github.com/lhh010/dsh-minigames/tree/394138a8c0b89c5d931ae7d30763f659510bba7a)）
- **版本日期**：2026-11-13（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出在同一等待任务比较独立游戏页与同窗面板的回复感知、误触和 CPU，验证减少窗口切换是否带来更快的回到工作。

以隔离 Web profile 比较聊天焦点、游戏隐藏和关闭，另用模拟安装器核对请求来源、重复更新和退出。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 88185 | 78323 | 10099 | — |
| .md | source | 2 | 1122 | — | — | 15928 |
| .mjs | source | 3 | 136 | 91 | 37 | — |
| .ts | source | 419 | 101835 | 77681 | 17346 | — |
| .tsx | source | 2 | 636 | 538 | 60 | — |
| .ts | test | 138 | 23784 | 20645 | 1881 | — |

</details>

**活跃度**

[![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/lhh010/dsh-minigames/issues?q=is%3Aissue+created%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/lhh010/dsh-minigames/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T02%3A05%3A03.217Z..2026-11-13T02%3A05%3A03.217Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：等待模型回复时，DSH Web 用户能否在不打断会话的情况下玩一局本地小游戏，安装与更新对宿主有什么代价？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 游戏如何在同一 Web 窗口运行，能否保留聊天输入与游戏状态？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

适合等待模型输出时想短暂玩一局的 Web 用户。与另开单独游戏页相比，插件把可收起的面板放到当前页面，用户可保持聊天结果可见。客户端通过 Cordis effect 在 body 挂 React 根，释放时卸载组件并移除 DOM。游戏列表是构建时显式注册的定义，重复 ID 会报错，内置启动先查存在以便重复执行。作者给出 103 款，根 manifest 简介仍写 18 款。本题以注册调用和贪吃蛇实现作为能力证据，未逐项运行清单。

面板切换游戏时创建实例并将焦点移到游戏容器，卸载时调用 destroy。隐藏标签、手动暂停和提示层能触发 pause。贪吃蛇的窗口按键监听先检查游戏焦点才处理方向、暂停等键，释放时关闭循环和监听。此链表明焦点隔离和退出机制有实现，但初次挂载会主动 focus，不能推广成所有场景从不影响聊天输入。面板用 localStorage 保存最高分，存储失败时初始化仍可继续。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-15](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/README.md#L5-L15)

作者描述同窗浮动和游戏清单。

<details>
<summary>查看原文（11行）</summary>

```text
DSH Web UI 浮动小游戏窗口：等待模型回复或修 bug 时的摸鱼神器。

- **折叠态**：窗口隐藏后留下一个圆形浮动 🎮 按钮（默认右下角），**可自由拖动**并记住位置，
  按住拖动（位移超过 5px）松手不会打开窗口；**单击**才重新打开面板。
- **展开态**：浮动小游戏窗口，**拖动标题栏**可随意移动，松手靠近屏幕边缘自动**吸附**
  （左右停靠/上下贴边），位置、停靠状态与宽度均持久化，刷新后自动恢复；默认宽度
  min(50vw, 640px)，可拖左缘调整 360px–80vw，面板内自由选择游戏。
- **游戏**（**共 103 款**，全部离线、零资源文件、Canvas 绘制）：
  1. 🦖 **恐龙跳一跳** —— Chrome 经典小恐龙（昼夜/雨天）；
  2. 🧱 **俄罗斯方块** —— 经典下落消除；
  3. 🛡️ **坦克大战（带 AI）** —— 2D 坦克对战，敌军追踪 + 视线开火，共 3 波；
```

</details>

**依据 2 · 源码核查**：[package.json:2-10](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/package.json#L2-L10)

根简介的旧数量和固定导出。

```text
  "name": "@dsh-external/dsh-minigames",
  "version": "0.12.4",
  "private": true,
  "type": "module",
  "description": "DSH Web UI 浮动小游戏窗口：18 款离线小游戏，可扩展游戏注册表。等待模型回复或修 bug 时的摸鱼神器。",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
```

**依据 3 · 源码核查**：[src/client/index.tsx:27-45](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/index.tsx#L27-L45)

挂载及面板释放。

<details>
<summary>查看原文（19行）</summary>

```text
export function apply(ctx: Context): void {
  startUpdateChip()
  ctx.effect(() => {
    const host = document.createElement('div')
    host.setAttribute('data-dsh-minigames', '')
    document.body.appendChild(host)
    let root: Root | undefined
    try {
      root = createRoot(host)
      root.render(createElement(MiniGamePanel))
    } catch (error) {
      ctx.logger.error('[dsh-minigames] panel mount failed:', error)
    }
    return () => {
      root?.unmount()
      host.remove()
    }
  }, 'dsh-minigames: panel mount')
}
```

</details>

**依据 4 · 源码核查**：[src/client/games/registry.ts:9-31](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/games/registry.ts#L9-L31)

重复 ID 和读取快照。

<details>
<summary>查看原文（23行）</summary>

```text
const games = new Map<string, MiniGameDefinition>()

/**
 * Register a game definition. Duplicate ids fail loud so a name collision
 * cannot silently shadow an existing game.
 * @param definition - the game to add.
 * @returns the same definition (for chaining in index files).
 */
export function registerGame(definition: MiniGameDefinition): MiniGameDefinition {
  if (games.has(definition.id)) {
    throw new Error(`dsh-minigames: game "${definition.id}" is already registered`)
  }
  games.set(definition.id, definition)
  return definition
}

/**
 * All registered games, in registration order.
 * @returns a fresh snapshot array (callers may sort/filter freely).
 */
export function getGames(): MiniGameDefinition[] {
  return [...games.values()]
}
```

</details>

**依据 5 · 源码核查**：[src/client/games/index.ts:148-160](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/games/index.ts#L148-L160)

内置注册与幂等设计。

<details>
<summary>查看原文（13行）</summary>

```text
export function registerBuiltinGames(): void {
  // Idempotent: the bundle factory re-executes on client-plugin HMR reloads,
  // so a second pass must not trip the registry's duplicate guard.
  for (const game of [
    dinoGame, tetrisGame, tanksGame, match3Game, snakeGame,
    game2048, minesweeperGame, memoryGame, gomokuGame, hopGame, breakoutGame,
    whackGame, othelloGame, flappyGame, sudokuGame, pacmanGame, aimTrackGame,
    simonGame, sokobanGame, asteroidsGame,
    pipesGame, colorLinesGame, dodgerGame, typingGame,
    lightsOutGame, pongGame, stackGame, wordleGame,
    nonogramGame, pegGame, hanoiGame, fifteenGame, mastermindGame, mazeGame,
    schulteGame,
    hashiGame, miniGoGame, connect4Game, slitherlinkGame,
```

</details>

**依据 6 · 源码核查**：[src/client/games/index.ts:181-192](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/games/index.ts#L181-L192)

实际注册调用。

<details>
<summary>查看原文（12行）</summary>

```text
    stroopGame, yahtzeeGame, juggleGame, spotdiffGame,
    game24Game, tangramGame, sailingGame, trafficGame,
    rhythmGame, elevatorGame, iceslideGame, linkGame,
    balloonGame, sorterGame, rivercrossGame, shutboxGame,
    balanceGame, tideGame, burgerGame, missileGame,
    bridgeGame, jugsGame, knightourGame, nimgameGame,
    queens8Game, kenkenGame, futoshikiGame, ricochetGame,
    tiltmazeGame, morseGame, dartsGame, onestrokeGame,
  ]) {
    if (getGame(game.id) === undefined) registerGame(game)
  }
}
```

</details>

**依据 7 · 源码核查**：[src/client/panel/Panel.tsx:138-155](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/panel/Panel.tsx#L138-L155)

浏览器存分和失败处理。

<details>
<summary>查看原文（18行）</summary>

```text
  })
  const [dock, setDock] = useState<DockState>(() => loadDock())
  const [launcherPos, setLauncherPos] = useState<{ x: number; y: number }>(() => {
    const saved = loadLauncherPos()
    if (saved !== null) return clampLauncherPos(saved)
    return { x: window.innerWidth - LAUNCHER_SIZE - 18, y: window.innerHeight - LAUNCHER_SIZE - 18 }
  })
  const [best, setBest] = useState<Record<string, number>>(() => {
    const out: Record<string, number> = {}
    for (const game of getGames()) {
      try {
        const value = localStorage.getItem(LS_BEST_PREFIX + game.id)
        if (value !== null) out[game.id] = Number(value)
      } catch {
        // Storage unavailable; the panel works without persisted bests.
      }
    }
    return out
```

</details>

**依据 8 · 源码核查**：[src/client/panel/Panel.tsx:503-548](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/panel/Panel.tsx#L503-L548)

实例生命周期、主动聚焦和暂停。

<details>
<summary>查看原文（46行）</summary>

```text
  // Create/destroy the game instance per game.
  useEffect(() => {
    const host = hostRef.current
    if (host === null) return undefined
    const instance = game.create(host, { onScore })
    instanceRef.current = instance
    instance.start()
    host.focus({ preventScroll: true })
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
  }, [game])

  // Reset the announcement when switching games.
  useEffect(() => {
    setAnnouncing(true)
  }, [game.id])

  // Auto-dismiss the announcement after 10 seconds.
  useEffect(() => {
    if (!announcing) return undefined
    const timer = window.setTimeout(() => { setAnnouncing(false) }, 10_000)
    return () => { window.clearTimeout(timer) }
  }, [announcing])

  // Any key dismisses the announcement (the click handler lives on the
  // overlay itself).
  useEffect(() => {
    if (!announcing) return undefined
    const onKey = (): void => { setAnnouncing(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [announcing])

  // Pause/resume on visibility, user pause, and the announcement.
  useEffect(() => {
    const apply = (): void => {
      const instance = instanceRef.current
      if (instance === null) return
      if (userPaused || document.hidden || announcing) instance.pause()
      else instance.resume()
    }
    apply()
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
```

</details>

**依据 9 · 源码核查**：[src/client/games/snake/index.ts:43-65](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/games/snake/index.ts#L43-L65)

代表游戏按焦点处理键盘。

<details>
<summary>查看原文（23行）</summary>

```text
  const onKeyDown = (event: KeyboardEvent): void => {
    if (!gameHasFocus(host)) return
    switch (event.code) {
      case 'ArrowUp':
      case 'KeyW':
        event.preventDefault(); turn(state, 0); break
      case 'ArrowDown':
      case 'KeyS':
        event.preventDefault(); turn(state, 2); break
      case 'ArrowLeft':
      case 'KeyA':
        event.preventDefault(); turn(state, 3); break
      case 'ArrowRight':
      case 'KeyD':
        event.preventDefault(); turn(state, 1); break
      case 'KeyR':
        event.preventDefault()
        reset()
        break
      case 'KeyP':
        event.preventDefault()
        togglePause()
        break
```

</details>

**依据 10 · 源码核查**：[src/client/games/snake/index.ts:103-116](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/games/snake/index.ts#L103-L116)

代表游戏释放循环和监听。

<details>
<summary>查看原文（14行）</summary>

```text
  window.addEventListener('keydown', onKeyDown)
  focusGameHost(host)
  loop.start()
  renderSnake(ctx, state, false)

  return {
    start: resume,
    pause,
    resume,
    destroy: () => {
      loop.destroy()
      fit.dispose()
      window.removeEventListener('keydown', onKeyDown)
    },
```

</details>

#### 缺口

- 未逐项验证游戏规则、快捷键冲突、内存及掉帧。
  **影响**：可确认代表实现，不能声称全部游戏或所有浏览器行为均成立。
  **进一步探讨**：用一款方向键游戏和一款鼠标游戏对照聊天输入、焦点、隐藏及关闭。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 离线小游戏是否需要网络，自更新有哪些宿主写入与访问条件？

**研究主题**：依赖、兼容与流程、工程质量与复用、缺陷与关键质疑

#### 完整回答

游戏实例本地运行，浏览器入口同时启动更新检测。检测并行查询宿主版本入口、GitHub tag 和原始数据，网络失败能显示离线提示。宿主查询通过当前 DSH 与兼容表筛选候选，但兼容数据或宿主版本缺失时，客户端会退回显示最新版为可用。更新推荐的兼容判断并非安装强制门槛。

点击更新时浏览器发送带固定 click 头的 POST。宿主处理器要求 POST 和该固定头，Origin 缺失也通过比较，对存在的 Origin 则要求匹配宿主地址。服务端仅校验 tag 格式便进入安装，不核对该 tag 是当前兼容版本。安装在 web profile 下用 shell 启动 pnpm add，固定仓库和受格式约束的 tag，直接修改依赖；本地链接安装跳过，超时发 kill，输出中会给恢复命令。完成后比较 Host 文件哈希，提示是否需重启。固定头是源码可见常量，无权把它当用户认证；实际端点暴露取决于宿主监听与外层权限。卸载面板清理在 Cordis effect，更新 chip 自己写 body，入口没有拿到对应卸载回调，仍需验证热卸载是否有残留。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:25-45](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/index.tsx#L25-L45)

启动时检测独立于面板 effect。

<details>
<summary>查看原文（21行）</summary>

```text
import { startUpdateChip } from './update-chip.ts'

export function apply(ctx: Context): void {
  startUpdateChip()
  ctx.effect(() => {
    const host = document.createElement('div')
    host.setAttribute('data-dsh-minigames', '')
    document.body.appendChild(host)
    let root: Root | undefined
    try {
      root = createRoot(host)
      root.render(createElement(MiniGamePanel))
    } catch (error) {
      ctx.logger.error('[dsh-minigames] panel mount failed:', error)
    }
    return () => {
      root?.unmount()
      host.remove()
    }
  }, 'dsh-minigames: panel mount')
}
```

</details>

**依据 2 · 源码核查**：[src/client/update-check.ts:55-83](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/update-check.ts#L55-L83)

并行联网及缺兼容数据的普通更新分支。

<details>
<summary>查看原文（29行）</summary>

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

export type UpdateNotice =
  | { readonly kind: 'current'; readonly tag: string }
  | { readonly kind: 'available'; readonly tag: string }
  | { readonly kind: 'partial'; readonly tag: string; readonly blocked: string; readonly dshVersion: string }
  | { readonly kind: 'blocked'; readonly tag: string; readonly dshVersion: string }

/** Decide the update-chip message from the local version and the gated remote info. */
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

**依据 3 · 源码核查**：[src/client/update-check.ts:98-105](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/update-check.ts#L98-L105)

实际 POST 及固定请求头。

```text
export interface UpdateResult { readonly ok: boolean; readonly detail: string; readonly link?: boolean; readonly recovery?: string; readonly hostChanged?: boolean }
export async function runUpdate(tag: string): Promise<UpdateResult> {
  try {
    const res = await fetch(`/${UPDATE_ID}/update`, { method: 'POST', headers: { 'content-type': 'application/json', 'x-dsh-plugin-update': 'click' }, body: JSON.stringify({ tag }), signal: AbortSignal.timeout(130000) })
    const body: unknown = await res.json().catch(() => ({}))
    const parsed = body as { ok?: boolean; output?: string; error?: string; link?: boolean; recovery?: string; hostChanged?: boolean }
    return { ok: res.ok && parsed.ok === true, detail: typeof parsed.output === 'string' ? parsed.output : (parsed.error ?? String(res.status)), link: parsed.link === true, ...(typeof parsed.recovery === 'string' ? { recovery: parsed.recovery } : {}), ...(parsed.hostChanged === true ? { hostChanged: true } : {}) }
  } catch (e) { return { ok: false, detail: String((e as Error)?.message ?? e) } }
```

**依据 4 · 源码核查**：[src/client/update-chip.ts:61-83](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/update-chip.ts#L61-L83)

点击安装、重启与错误提示及独立 DOM。

<details>
<summary>查看原文（23行）</summary>

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
  })
  document.body.appendChild(el)
  relayout()
```

</details>

**依据 5 · 源码核查**：[src/update-endpoint.ts:126-138](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/update-endpoint.ts#L126-L138)

本地链接、pnpm 安装及超时。

<details>
<summary>查看原文（13行）</summary>

```text
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

**依据 6 · 源码核查**：[src/update-endpoint.ts:158-175](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/update-endpoint.ts#L158-L175)

只在查询路由使用兼容表。

<details>
<summary>查看原文（18行）</summary>

```text
    const latestDispose = ctx.webServer.register({
      kind: 'exact', path: LATEST_PATH,
      handler: (_req, res) => {
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
```

</details>

**依据 7 · 源码核查**：[src/update-endpoint.ts:180-201](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/update-endpoint.ts#L180-L201)

安装端点真实校验和写入。

<details>
<summary>查看原文（22行）</summary>

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
      },
    })
    return () => { dispose(); latestDispose() }
  }, 'ui-whale: update endpoint')
```

</details>

#### 缺口

- 未实测共享 profile 的外层鉴权、失败回滚、客户端重载或网络断开。
  **影响**：不宜在有生产会话的 profile 依赖一键更新。
  **进一步探讨**：隔离 profile 用假 pnpm 观察无 Origin、错误版本和重复点击，同时检查网络断开与热卸载。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 什么时候值得试用，怎样验证同窗收益足以覆盖宿主负担？

**研究主题**：新假设与验证、采用判断、效果与总成本

#### 完整回答

当前建议观察。需要在模型等待间歇玩短局的用户，可先比较已有浏览器游戏页与插件演示，单独游戏页无需给 DSH 添加更新端点。插件潜在增量是减少窗口切换、记忆面板位置和保留本地成绩，但实际是否更容易及时回到任务，需要在同一等待时长下验证。项目为私有包，作者提供 Git tag 或本地构建方式；构建的开发依赖含相对路径，源码 checkout 未必能直接复制作者环境。清单与 README 安装示例的版本也有差距，应按固定工件和兼容表核对。

可检验的假设是，如果面板挂载不会截走聊天焦点且隐藏时停止循环，用户恢复工作所需的切换和定位动作会减少。隔离测试比较两种方案的回复感知时间、聊天误触和浏览器 CPU。若浏览器页已足够，或确认更新端点及热卸载的工作超过减少的操作，就保留独立页面。未确认端点可见范围或安装后无法稳定回到聊天时，应停止在常用 profile 采用。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:56-75](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/README.md#L56-L75)

作者的安装前提和 Git tag 示例。

<details>
<summary>查看原文（20行）</summary>

````text
## 安装

前置：已构建的 DSH 20260808+ 快照、`pnpm`。

```sh
# 方式一：git 依赖固定 tag（公开镜像，推荐；也可用 github:lhh010/dsh-minigames）
dsh plugin --profile web add '@dsh-external/dsh-minigames@github:lhh010/dsh-minigames#v0.3.27'

# 方式二：本地安装
git clone https://github.com/lhh010/dsh-minigames.git   # 或直接使用本目录
cd dsh-minigames
pnpm install
pnpm build

# 装入当前 web profile（自动写入依赖并加入 dsh.profile.bundles）
dsh plugin --profile web add /绝对路径/to/dsh-minigames

# 可选：确认组合配置只出现一个插件行
dsh --profile web --dump-config | grep dsh-minigames
```
````

</details>

**依据 2 · 源码核查**：[package.json:29-50](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/package.json#L29-L50)

构建步骤和开发链接依赖。

<details>
<summary>查看原文（22行）</summary>

```text
  "scripts": {
    "build": "node -e \"require('node:fs').rmSync('lib',{recursive:true,force:true})\" && tsc -p tsconfig.build.json && tsdown",
    "typecheck": "tsc --noEmit",
    "test": "vitest run"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1-rc.1",
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/node": "^22.20.0",
    "@types/react": "~18.3.31",
    "@types/react-dom": "^18.3.7",
    "@deepseek-ai/cordis": "link:../test-lhh010/vendor/cordis",
    "@deepseek-ai/dsh-home-paths": "link:../.dsh/source/current/packages/util/home-paths",
    "@deepseek-ai/dsh-host-webserver": "link:../.dsh/source/current/packages/host/webserver",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "tsdown": "^0.22.2",
    "typescript": "^6.0.3",
    "vitest": "^4.1.8"
```

</details>

**依据 3 · 源码核查**：[src/client/panel/Panel.tsx:503-548](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/client/panel/Panel.tsx#L503-L548)

焦点、暂停及清理可观察点。

<details>
<summary>查看原文（46行）</summary>

```text
  // Create/destroy the game instance per game.
  useEffect(() => {
    const host = hostRef.current
    if (host === null) return undefined
    const instance = game.create(host, { onScore })
    instanceRef.current = instance
    instance.start()
    host.focus({ preventScroll: true })
    return () => {
      instance.destroy()
      instanceRef.current = null
    }
  }, [game])

  // Reset the announcement when switching games.
  useEffect(() => {
    setAnnouncing(true)
  }, [game.id])

  // Auto-dismiss the announcement after 10 seconds.
  useEffect(() => {
    if (!announcing) return undefined
    const timer = window.setTimeout(() => { setAnnouncing(false) }, 10_000)
    return () => { window.clearTimeout(timer) }
  }, [announcing])

  // Any key dismisses the announcement (the click handler lives on the
  // overlay itself).
  useEffect(() => {
    if (!announcing) return undefined
    const onKey = (): void => { setAnnouncing(false) }
    window.addEventListener('keydown', onKey)
    return () => { window.removeEventListener('keydown', onKey) }
  }, [announcing])

  // Pause/resume on visibility, user pause, and the announcement.
  useEffect(() => {
    const apply = (): void => {
      const instance = instanceRef.current
      if (instance === null) return
      if (userPaused || document.hidden || announcing) instance.pause()
      else instance.resume()
    }
    apply()
    document.addEventListener('visibilitychange', apply)
    return () => document.removeEventListener('visibilitychange', apply)
```

</details>

**依据 4 · 源码核查**：[src/update-endpoint.ts:180-196](https://github.com/lhh010/dsh-minigames/blob/394138a8c0b89c5d931ae7d30763f659510bba7a/src/update-endpoint.ts#L180-L196)

导致采用暂缓的宿主更新能力。

<details>
<summary>查看原文（17行）</summary>

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
```

</details>

#### 缺口

- 没有安装、宿主可用性、用户时间或运行资源数据。
  **影响**：只能给观察条件，无法证明游玩或工作效率。
  **进一步探讨**：以可丢弃 Web profile 和独立游戏页做同一等待任务对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
