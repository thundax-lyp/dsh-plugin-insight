# dsh-desktop-pet

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[5f00606](https://github.com/xiaoshihou514/dsh-desktop-pet/tree/5f0060620d3b25c37c1d725af877f78708672ef5)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/xiaoshihou514/dsh-desktop-pet)
<!-- END META -->

> **功能**：将 whale-girl 的状态与角色资源显示在 Linux 和 Windows 桌面窗口，支持托盘、移动和宠物互动。

> **亮点**：将已有网页宠物协议适配为独立桌面展示，增加置顶位置、托盘和窗口移动，角色与状态服务归属上游，不称原创任务监控机制。[Q01](#research-q01)

> **主要限制**：桌面shim不提供服务或启动进程，上游接口版本又未固定，显示正确性取决于两端契约；Wayland和心跳恢复也有明确环境边界。[Q03](#research-q03)

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
  - [Q01 · 桌面伴侣替代网页宠物的哪部分，是否本身提供DSH能力？](#detail-section-11)
  - [Q02 · 状态如何成为动画，断线如何恢复？](#detail-section-12)
  - [Q03 · 上游和桌面环境失效时有哪些边界？](#detail-section-13)
  - [Q04 · 桌面常驻是否值得，下一步验证什么？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望不用持续盯网页的DSH用户可观察桌面宠物的工作与等待状态，审批和任务结果仍回原网页核对。[Q01](#research-q01)

直接看DSH网页及whale-girl无需单独桌面进程；本组件增加置顶和托盘，但保留上游依赖。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 独立桌面显示 | 脱离网页观察工作状态 | 需上游whale-girl；不处理审批 |
| 断线重连 | 显示离线并重新取快照 | 上游协议匹配才有有效状态 |
| 托盘与窗口移动 | 显示隐藏、定位和退出 | Wayland程序移动受限 |
| feed/play互动 | 向上游发送宠物动作 | 不代表业务任务动作 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 本机DSH及whale-girl服务 | 必需 | 状态、资产与互动接口 | 显示离线或资源错误 |
| Electron发行物与桌面环境 | 所查链路必需 | 独立窗口与托盘 | 实际系统兼容未知 |
| loopback HTTP/HTTPS地址 | 必需 | 连接上游 | 非本机地址被拒绝 |
| 窗口定位能力 | 移动功能条件 | 拖拽与游走 | Wayland禁用程序移动 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定上游版本并启动DSH | 接口与角色资产可读取 |
| 启动 | OS单独启动桌面客户端 | 不是安装空shim即启动 |
| 展示 | 主进程读快照，渲染器选择动画 | 在线状态和工作状态可区分 |
| 退出 | 用户退出伴侣回网页 | 心跳离线best-effort，需核对网页恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载与DSH运行资源未知 | 安装上游和选择发行物 | 两端版本须匹配 |
| 持续使用 | 常驻动画、SSE与轮询资源未知 | 观察状态和处理桌面干扰 | 无电量/延迟对照 |
| 失败恢复 | 重连请求与重启资源未知 | 核查地址、协议和桌面后端 | 回网页可继续原任务 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 桌面状态展示 | 窗口、SSE、IPC和状态映射 | 实际延迟和准确性 |
| 断线处理 | 离线状态与指数退避 | 上游恢复及多系统表现 |
| 宠物互动 | 仅feed/play允许POST | 上游效果与服务兼容 |

> **思考**：桌面shim不提供服务或启动进程，上游接口版本又未固定，显示正确性取决于两端契约；Wayland和心跳恢复也有明确环境边界。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将已有网页宠物协议适配为独立桌面展示，增加置顶位置、托盘和窗口移动，角色与状态服务归属上游，不称原创任务监控机制。[Q01](#research-q01)

主进程限定本机地址、渲染隔离与固定IPC通道值得借鉴；状态表在shared与renderer镜像，维护需同步，浅校验无法替代协议版本核对。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

桌面shim不提供服务或启动进程，上游接口版本又未固定，显示正确性取决于两端契约；Wayland和心跳恢复也有明确环境边界。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认上游固定版本和目标系统，不用桌面表情代替审批或任务验收；出错就退出回网页。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

桌面读取、动画和退避有源码依据；上游协议与发行物运行未验证，协商设计为假设。

- 已检查：作者 README、包清单、源码路径 src/main.cjs、src/preload.cjs、src/shared.cjs、src/renderer/renderer.js、dsh-plugin.mjs、cordis.patch.yml、package.json、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查Electron主进程、preload、shared与renderer关键链；Tauri原生实现和上游whale-girl未固定，不继承其运行能力。
- 下一步：固定上游协议后测试上线、SSE断线、资产缺失、崩溃恢复及Wayland/X11窗口行为，并记录资源与延迟。

**分析版本**

- **仓库**：[xiaoshihou514/dsh-desktop-pet](https://github.com/xiaoshihou514/dsh-desktop-pet)
- **版本号**：0.1.0（[固定提交 5f00606](https://github.com/xiaoshihou514/dsh-desktop-pet/tree/5f0060620d3b25c37c1d725af877f78708672ef5)）
- **版本日期**：2026-08-21（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

协议能力协商和可见状态时间戳可能减少版本错配误导；需比较错配恢复与配置成本，尚未实现。[Q04](#research-q04)

固定上游协议后测试上线、SSE断线、资产缺失、崩溃恢复及Wayland/X11窗口行为，并记录资源与延迟。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 2 | 35 | 24 | 5 | — |
| .md | source | 2 | 39 | — | — | 248 |
| .cjs | source | 3 | 432 | 351 | 47 | — |
| .js | source | 2 | 762 | 649 | 75 | — |
| .cjs | test | 2 | 134 | 112 | 4 | — |

</details>

**活跃度**

[![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/xiaoshihou514/dsh-desktop-pet/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/xiaoshihou514/dsh-desktop-pet/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：独立桌面伴侣能否在上游协议和系统窗口限制明确时可靠展示DSH工作状态？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 桌面伴侣替代网页宠物的哪部分，是否本身提供DSH能力？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它是单独启动的Linux/Windows桌面客户端，目标是在不用一直看DSH网页时显示工作、等待、完成等状态并提供宠物互动。README要求另装vlln/whale-girl；本包的DSH shim apply为空，不能凭bundle登记认为桌面程序已启动或上游状态服务已提供。相对网页里的宠物，增量是透明置顶窗口、托盘和桌面位置；状态语义、角色资产及互动服务继承上游。显示等待状态也不是处理审批，本客户端没有审批回答IPC。合格结果是可辨的在线/离线状态和正确动画，不是任务完成保证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:8-18](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/README.md#L8-L18)

作者适配归属和上游安装条件。

<details>
<summary>查看原文（11行）</summary>

````text
感谢 @vlln 的付出！这是大肥鱼的 Linux / Windows 桌面版适配~

```shell
npm i -g @deepseek-ai/dsh
dsh plugin --profile web add "github:vlln/whale-girl#main"

# 随后在发行版页面下载 AppImage、RPM 或 Windows 安装包：
# https://github.com/xiaoshihou514/dsh-desktop-pet/releases
```

可爱的同时可以显示干活进度、是否需要审批等等
````

</details>

**依据 2 · 源码核查**：[dsh-plugin.mjs:1-5](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/dsh-plugin.mjs#L1-L5)

shim为空，运行归Electron进程。

```text
/** DSH bundle entry that makes the separately launched desktop companion installable. */
export const name = 'desktop-pet-companion'

/** The Electron process owns runtime behavior; the Harness-side shim is intentionally inert. */
export function apply() {}
```

**依据 3 · 源码核查**：[src/preload.cjs:5-17](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/preload.cjs#L5-L17)

暴露互动、移动和读取接口，无审批回复接口。

<details>
<summary>查看原文（13行）</summary>

```text
contextBridge.exposeInMainWorld('desktopPet', {
  bootstrap: () => ipcRenderer.invoke('pet:get-bootstrap'),
  manifest: () => ipcRenderer.invoke('pet:get-manifest'),
  config: () => ipcRenderer.invoke('pet:get-config'),
  sessions: () => ipcRenderer.invoke('pet:get-sessions'),
  refresh: () => ipcRenderer.invoke('pet:refresh'),
  interact: action => ipcRenderer.invoke('pet:interact', action),
  setClickThrough: ignored => ipcRenderer.send('pet:set-click-through', ignored),
  dragStart: point => ipcRenderer.send('pet:drag-start', point),
  dragMove: point => ipcRenderer.send('pet:drag-move', point),
  dragEnd: () => ipcRenderer.send('pet:drag-end'),
  walkMove: dx => ipcRenderer.invoke('pet:walk-move', dx),
  quit: () => ipcRenderer.send('pet:quit'),
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 状态如何成为动画，断线如何恢复？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

主进程限制DSH地址为loopback的HTTP/HTTPS，建立SSE后刷新state；每个data事件再GET状态，经apiVersion=1等最低结构校验后发IPC。渲染端收到快照后按优先级选择拖拽、短暂事件、等待、庆祝、工作等动画，角色资源来自上游manifest。SSE断开显示未连接并指数退避1到15秒，离线动画为sleep；重连再取快照，不依赖补齐每个历史事件。窗口启用contextIsolation、sandbox并关闭nodeIntegration，preload只暴露固定通道；这是本地隔离设置而非整体安全验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/shared.cjs:18-40](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/shared.cjs#L18-L40)

loopback地址与最低快照校验。

<details>
<summary>查看原文（23行）</summary>

```text
function normalizeDshUrl(value = 'http://127.0.0.1:3080') {
  const url = new URL(value)
  if (!['http:', 'https:'].includes(url.protocol)) throw new Error('DSH 地址必须使用 HTTP 或 HTTPS')
  if (!LOOPBACK_HOSTS.has(url.hostname)) throw new Error('DSH 地址必须指向本机')
  url.pathname = url.pathname.replace(/\/$/, '')
  url.search = ''
  url.hash = ''
  return url.toString().replace(/\/$/, '')
}

function endpoint(base, path) {
  return `${normalizeDshUrl(base)}${path}`
}

function validateSnapshot(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) return null
  if (value.apiVersion !== 1) return null
  const activity = value.activity
  const pet = value.pet
  if (activity === null || typeof activity !== 'object') return null
  if (pet === null || typeof pet !== 'object') return null
  if (typeof activity.name !== 'string') return null
  return value
```

</details>

**依据 2 · 源码核查**：[src/main.cjs:123-168](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/main.cjs#L123-L168)

刷新、SSE与退避。

<details>
<summary>查看原文（46行）</summary>

```text
async function readJson(path) {
  const response = await fetch(endpoint(dshUrl, path), { signal: AbortSignal.timeout(5000) })
  if (!response.ok) throw new Error(`HTTP ${response.status}`)
  return response.json()
}

async function refresh() {
  const snapshot = validateSnapshot(await readJson('/whale-girl/state'))
  if (snapshot === null) throw new Error('鲸鱼娘状态数据版本不受支持')
  send('pet:snapshot', snapshot)
  send('pet:connection', { connected: true, dshUrl })
  return snapshot
}

async function followEvents() {
  streamAbort?.abort()
  streamAbort = new AbortController()
  const response = await fetch(endpoint(dshUrl, '/whale-girl/events'), { signal: streamAbort.signal })
  if (!response.ok || response.body === null) throw new Error(`SSE HTTP ${response.status}`)
  retryMs = RETRY_MIN_MS
  await refresh()
  const decoder = new TextDecoder()
  let buffered = ''
  for await (const chunk of response.body) {
    buffered += decoder.decode(chunk, { stream: true })
    let boundary
    while ((boundary = buffered.indexOf('\n\n')) !== -1) {
      const event = buffered.slice(0, boundary)
      buffered = buffered.slice(boundary + 2)
      if (event.split('\n').some(line => line.startsWith('data:'))) await refresh()
    }
  }
  throw new Error('SSE connection closed')
}

async function connectionLoop() {
  while (!stopped) {
    try {
      await followEvents()
    } catch (error) {
      if (stopped) return
      send('pet:connection', { connected: false, dshUrl, message: error.message })
      await new Promise(resolve => setTimeout(resolve, retryMs))
      retryMs = Math.min(RETRY_MAX_MS, retryMs * 2)
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/renderer/renderer.js:85-102](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/renderer/renderer.js#L85-L102)

动画优先级。

<details>
<summary>查看原文（18行）</summary>

```text
function pickState(now = Date.now()) {
  if (!connected) return 'sleep'
  const activity = snapshot?.activity ?? {}
  if (dragging) return 'drag'
  if (dragReleaseUntil > now) return 'idle'
  if (BURST_NAMES.includes(activity.name) && activity.until > now) return activity.name
  if (transient === 'eat') return 'eat'
  if (transient === 'play') return 'play'
  if (transient === 'wake') return 'wake'
  if (activity.sessionWait === true) return 'wait'
  const celebrateUntil = Math.max(activity.turnCompletedUntil ?? 0, levelUpUntil)
  if (celebrateUntil > now) return 'celebrate'
  if (activity.name === 'working') return 'working'
  if (activity.sessionThink === true) return 'think'
  if (joyUntil > now) return 'joy'
  if (sleeping) return 'sleep'
  if (walking) return 'walk'
  return 'idle'
```

</details>

**依据 4 · 源码核查**：[src/main.cjs:90-95](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/main.cjs#L90-L95)

Electron隔离设置。

```text
    webPreferences: {
      preload: join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      sandbox: true,
      nodeIntegration: false,
    },
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 上游和桌面环境失效时有哪些边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

本组件不提供whale-girl/state、events、assets或presence的服务端实现；当前固定checkout未含上游精确版本，不能证明这些接口现在线上匹配。validateSnapshot只做浅层结构校验，角色清单另行检查states。Wayland禁用程序拖拽移动，避免不被窗口系统允许的定位；这意味着Linux不同合成器行为不能一概保证。存在心跳每15秒POST presence，干净退出尽力标offline；崩溃后上游是否按45秒TTL恢复网页宠物是注释中的契约，本次未核查服务端，不能当已验证恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/main.cjs:226-234](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/main.cjs#L226-L234)

Wayland禁用程序拖动。

```text
ipcMain.on('pet:drag-start', (_event, point) => {
  if (mainWindow === null || !Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return
  if (displayBackend === 'wayland') return
  const [windowX, windowY] = mainWindow.getPosition()
  dragOrigin = { pointerX: point.x, pointerY: point.y, windowX, windowY }
})
ipcMain.on('pet:drag-move', (_event, point) => {
  if (displayBackend === 'wayland') return
  if (mainWindow === null || dragOrigin === null || !Number.isFinite(point?.x) || !Number.isFinite(point?.y)) return
```

**依据 2 · 源码核查**：[src/main.cjs:262-287](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/main.cjs#L262-L287)

presence心跳和退出best-effort。

<details>
<summary>查看原文（26行）</summary>

```text
// 在场心跳：在线期间 whale-girl 隐藏网页端宠物；退出/崩溃后 TTL 过期自动恢复。
// DSH 未启动/断线时静默失败，下一轮重试（不阻塞主流程）。
function pokePresence(online) {
  fetch(endpoint(dshUrl, '/whale-girl/presence'), {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ online }),
    signal: AbortSignal.timeout(5000),
  }).catch(() => {})
}

app.whenReady().then(() => {
  createWindow()
  createTray().catch(() => {})
  connectionLoop()
  pokePresence(true)
  presenceTimer = setInterval(() => pokePresence(true), PRESENCE_INTERVAL_MS)
})

app.on('before-quit', () => {
  stopped = true
  streamAbort?.abort()
  clearInterval(presenceTimer)
  // 干净退出即时恢复网页端宠物（best-effort；进程被杀时由 TTL 兜底恢复）。
  pokePresence(false)
  saveWindowState()
```

</details>

**依据 3 · 源码核查**：[src/renderer/renderer.js:696-711](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/renderer/renderer.js#L696-L711)

角色清单错误的用户状态。

<details>
<summary>查看原文（16行）</summary>

```text
async function loadCharacter() {
  manifest = await window.desktopPet.manifest()
  if (manifest === null) throw new Error('DSH 尚未启动')
  character = manifest.characters?.[manifest.default]
  if (!character?.states) throw new Error('鲸鱼娘资源清单无效')
  if (typeof cfg.size !== 'number') stageSize = desktopStage(character.meta?.stageSize ?? 128)
  render()
}

function showAssetError(error) {
  connection.textContent = '资源加载失败'
  status.textContent = '鲸鱼娘暂时不可用'
  detail.textContent = error.message
  note.textContent = ''
  note.hidden = true
  pet.dataset.attention = 'true'
```

</details>

#### 缺口

- vlln/whale-girl的精确版本及presence/SSE服务实现未作为材料固定。
  **影响**：可能无法加载资产、显示正确状态或按期恢复网页宠物。
  **进一步探讨**：固定上游版本，逐项对照state/events/manifest/presence契约及断线恢复。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 桌面常驻是否值得，下一步验证什么？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需运行DSH、安装上游插件并取得桌面发行物；源码默认Electron38，另有Tauri开发脚本，两条发行链不能混作已核验。持续成本是常驻进程、动画、SSE及会话轮询，CPU/内存/电量与注意力干扰均无实测。位置保存写userData，失败忽略，退出并不停止DSH或撤回业务操作。当前建议观察，先核实上游版本和目标桌面环境；若状态滞后、离线仍误导或桌面干扰过高，应退出伴侣回到DSH网页。由Q03可提出带协议能力协商与状态时间戳的假设，比较版本不匹配时误显示和恢复耗时，若增加配置而没有减少误导则否定。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:24-37](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/package.json#L24-L37)

Electron与Tauri构建路径。

<details>
<summary>查看原文（14行）</summary>

```text
  "scripts": {
    "start": "electron .",
    "test": "node --test tests/*.test.cjs",
    "dev": "tauri dev",
    "build": "tauri build",
    "pack:linux": "electron-builder --linux --x64 --dir",
    "dist:linux": "electron-builder --linux AppImage rpm --x64 --publish never",
    "pack:win": "electron-builder --win --x64 --dir",
    "dist:win": "electron-builder --win nsis portable --x64 --publish never"
  },
  "devDependencies": {
    "@tauri-apps/cli": "^2",
    "electron": "^38.0.0",
    "electron-builder": "^26.0.12"
```

</details>

**依据 2 · 源码核查**：[src/main.cjs:49-64](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/main.cjs#L49-L64)

本地窗口位置持久化。

<details>
<summary>查看原文（16行）</summary>

```text
function stateFile() {
  return join(app.getPath('userData'), 'window-state.json')
}

function loadWindowState() {
  try {
    const value = JSON.parse(readFileSync(stateFile(), 'utf8'))
    if (Number.isFinite(value.x) && Number.isFinite(value.y)) return { x: value.x, y: value.y }
  } catch {}
  return {}
}

function saveWindowState() {
  if (mainWindow === null || mainWindow.isDestroyed()) return
  const [x, y] = mainWindow.getPosition()
  try { writeFileSync(stateFile(), JSON.stringify({ x, y })) } catch {}
```

</details>

**依据 3 · 源码核查**：[src/renderer/renderer.js:714-731](https://github.com/xiaoshihou514/dsh-desktop-pet/blob/5f0060620d3b25c37c1d725af877f78708672ef5/src/renderer/renderer.js#L714-L731)

启动和定时循环。

<details>
<summary>查看原文（18行）</summary>

```text
async function start() {
  const bootstrap = await window.desktopPet.bootstrap()
  assetsUrl = bootstrap.assetsUrl
  try {
    const body = await window.desktopPet.config()
    if (body !== null && typeof body === 'object' && body.config) applyConfig(body.config)
  } catch {}
  try { await loadCharacter() } catch {}
  try { snapshot = await window.desktopPet.refresh() } catch {}
  try {
    const saved = localStorage.getItem('pet:bubble-mode')
    if (MODES.includes(saved)) bubbleMode = saved
  } catch {}
  tickTimer = setInterval(tick, TICK_MS)
  sessionPollTimer = setInterval(pollSessions, SESSION_POLL_MS)
  pollSessions()
  render()
  syncWindowSize()
```

</details>

#### 缺口

- 没有目标桌面下资源消耗、状态延迟和协商原型结果。
  **影响**：不能证明比网页查看更省资源或更及时。
  **进一步探讨**：同一任务测状态延迟、资源和误显示；协议协商另做固定版本对照。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
