# dsh-any-background

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[c9b9490](https://github.com/Tkingxiao/dsh-any-background/tree/c9b9490ba2118a4048df8e10961194a8a427bf5d)

<!-- BEGIN META -->
[![GitHub ★ 54](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=54&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Tkingxiao/dsh-any-background) [![npm 30d 8,509](https://img.shields.io/static/v1?label=npm+30d&message=8%2C509&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-any-background) [![最新发布 2026-11-02](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-02&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-any-background)
<!-- END META -->

> **功能**：为DSH提供主题色、图片/视频/生成背景及逐界面透明度、模糊和字体外观定制。

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)统一精细外观控制与Host文件持久、背景类型和主题恢复，用户不必改宿主CSS。

> **主要限制**：[Q03](#research-q03)媒体读开放/网络取图资源和nearest CSS适配有边界，可读性/卡顿需实测；[Q02](#research-q02)保存失败仅重试/日志，不能因即时变化认定持久。

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
  - [Q01 · 谁需要这层外观，原生主题之外改变什么？](#detail-section-11)
  - [Q02 · 编辑如何到磁盘与画面，保存失败是什么状态？](#detail-section-12)
  - [Q03 · 媒体与兼容接管有哪些采用和退出成本？](#detail-section-13)
  - [Q04 · 怎样把精细外观变成可检验而非审美口号？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：dsh-any-background0.4.3是原生双面外观插件：Host保存主题/媒体，客户端注册主题设置和背景层。面向愿意主动调整长期工作界面的个人，提供自选主题色、图片/视频/生成背景及逐表面透明/模糊控制；成功是其常用消息、工具、代码和设置在所选背景上仍可辨认、刷新恢复同一设置，而非控件数量或截图漂亮。

宿主内置主题/明暗和手工CSS；浏览器媒体渲染/Host主题令牌为既有能力，不新增Agent执行。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 背景/色彩 | 个性观感 | 需逐样本核可读性，不证效率 |
| 表面/字体 | 细粒度观感 | CSS/Host与第三方依赖 |
| 持久恢复 | 刷新恢复配置/媒体 | 即时画面不等保存成，失败日志 |
| 版本fallback | 未知Host尽量显示 | nearest不是已验兼容 |
| 上传/取图 | 本地媒体落盘 | GET开放，网络/资源边界需核 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Host connection/webServer | 持久必需 | RPC/媒体/身份围栏 | 不自建认证，外层需可信 |
| theme/store/settings等客户端模块 | 按功能必需 | 主题与设置 | 缺store可无设置区，不等全插件不运行 |
| 专用本地素材/数据目录 | 本文前提 | 背景/字体/配置 | 媒体GET不是秘密仓库 |
| Host DOM/CSS适配 | 视觉效果必需 | 表面令牌/选择器 | 新版nearest是猜测，须回退 |
| betterSidebar/原生右侧栏 | 额外入口可选 | 同一外观面板 | 不改变Host持久真相源 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 个人备份配置，选本地无敏感图片 | 不送不可信网络URL |
| 调整 | 设置主题/透明/模糊 | 长消息/代码/菜单仍可读 |
| 持久核 | 停止拖动后刷新重启查一致 | 即时渲染不代磁盘保存 |
| 升级核 | 新Host/插件表面复核 | nearest/第三方变化即回原生 |
| 退出 | 停用并核清样式，按归属处理媒体 | 生命周期清理不删所有持久文件 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 素材/机器金额未知 | 调配色/背景/界面 | 无业务收益实测 |
| 持续 | 视频/GPU/媒体磁盘未知 | 兼容/可读性复核 | 性能不能填零 |
| 故障 | 临时文件/失败重试资源未知 | 查日志/磁盘/刷新一致 | 页隐藏不等写入事务完成 |
| 退出 | 配置/媒体留存未知 | 回原生/按归属清理 | 不需恢复业务数据副作用 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个人外观 | 真背景分支/设置/主题恢复 | 偏好与辨认效果 |
| 持久 | tmp/rename/布尔失败与客户端重试 | 双窗口/掉盘/快速退出 |
| 兼容 | 版本分档与nearest退化 | 新版实际CSS和第三方全覆盖 |
| 成本 | dispose/启动清留存机制 | GPU/耗电/长期调整时间 |

> **思考**：[Q03](#research-q03)媒体读开放/网络取图资源和nearest CSS适配有边界，可读性/卡顿需实测；[Q02](#research-q02)保存失败仅重试/日志，不能因即时变化认定持久。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q02](#research-q02)统一精细外观控制与Host文件持久、背景类型和主题恢复，用户不必改宿主CSS。

单配置临时写rename、媒体URL小RPC、保存失败重试与主题生命周期dispose可借鉴；CSS接管/多窗口整对象写需要明确兼容及恢复状态，别把watchdog当稳定公有接口。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03)媒体读开放/网络取图资源和nearest CSS适配有边界，可读性/卡顿需实测；[Q02](#research-q02)保存失败仅重试/日志，不能因即时变化认定持久。

<a id="detail-section-6"></a>

### 1.5 使用建议

用个人本地非敏感素材先试，逐一核常用消息/代码/菜单的可读性并重启查设置。网络URL/未来Host/多窗口另验，不把开放媒体当保密存储。视觉或持久不符立即停用回原生主题。见[Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态支持双面外观持久与恢复机制，个人本地非敏感素材受限试用；性能、可读性及真实Host兼容未验。

- 已检查：作者 README、包清单、源码路径 README.zh.md、package.json、src/client/index.tsx、src/client/rpc.ts、src/client/wallpaper.ts、src/host-compat/channel.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核README/package、客户端slot/背景/主题恢复/保存、Host RPC/真实配置写入/认证与媒体读开放、网络图片读取、启动清理及版本fallback；未全审所有视频/字体/导入/生成算法、样式选择器和第三方表面。
- 下一步：只读固定源码，无Host/浏览器/目标脚本或性能/视觉验收；一般冒烟为scope_boundary，可读性/资源和特定故障为研究缺口。

**分析版本**

- **仓库**：[Tkingxiao/dsh-any-background](https://github.com/Tkingxiao/dsh-any-background)
- **版本号**：0.4.3（[固定提交 c9b9490](https://github.com/Tkingxiao/dsh-any-background/tree/c9b9490ba2118a4048df8e10961194a8a427bf5d)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04)提出未验证的可读性样本预检/未知Host降级与原生回退，用辨认错误/调整时间/偏好与资源对照决定价值。

只读固定源码，无Host/浏览器/目标脚本或性能/视觉验收；一般冒烟为scope_boundary，可读性/资源和特定故障为研究缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 862 | — | — | 18221 |
| .js | source | 2 | 14212 | 11811 | 2902 | — |
| .mjs | source | 1 | 281 | 204 | 56 | — |
| .tsx | source | 17 | 3984 | 2941 | 858 | — |
| .ts | source | 33 | 11224 | 6680 | 4038 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Tkingxiao/dsh-any-background/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Tkingxiao/dsh-any-background/issues?q=is%3Aissue+created%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z) [![近30天关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/Tkingxiao/dsh-any-background/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T05%3A16%3A47.587Z..2026-11-06T05%3A16%3A47.587Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核外观定制的真实持久/渲染与兼容/媒体边界，判断个人采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要这层外观，原生主题之外改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

dsh-any-background0.4.3是原生双面外观插件：Host保存主题/媒体，客户端注册主题设置和背景层。面向愿意主动调整长期工作界面的个人，提供自选主题色、图片/视频/生成背景及逐表面透明/模糊控制；成功是其常用消息、工具、代码和设置在所选背景上仍可辨认、刷新恢复同一设置，而非控件数量或截图漂亮。

基线是宿主内置明暗/主题与系统壁纸。本插件增加应用内背景与精细表面控制，使用者不用自行改宿主CSS，但没有新增模型工具、业务执行或生产率证据。媒体渲染/主题令牌依赖浏览器和Host，色轮/模糊不是新算法。个人偏好可有价值而无需被夸成业务创新；不需要视觉定制或易分心者可直接留原生主题。

设置页通过slots/store注册；store缺失只禁设置区，外观半部仍运行。兼容表声明多个构建和未来放行，不是本次独立Host测试。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:14-16](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/README.zh.md#L14-L16)

作者外观定位和兼容主张。

```text

一个 **DeepSeek Harness** 外观插件：自定义主题色、背景壁纸（图片 / 视频 / 算法生成），以及逐表面的透明度与模糊度控制。兼容 **DSH `0.2.0-rc.1` 直至 `0.2.1-rc.3`，其上所有版本一并放行**。

```

**依据 2 · 源码核查**：[package.json:1-40](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/package.json#L1-L40)

包版本/许可及双入口。

<details>
<summary>查看原文（40行）</summary>

```text
{
  "name": "dsh-any-background",
  "version": "0.4.3",
  "description": "Appearance plugin for DeepSeek Harness: custom theme color (PS-style color wheel), background wallpaper with opacity/blur controls, and separate main/settings interface opacity.",
  "keywords": [
    "deepseek-harness",
    "dsh",
    "plugin",
    "dsh-plugin",
    "theme",
    "wallpaper",
    "web-ui"
  ],
  "homepage": "https://github.com/Tkingxiao/dsh-any-background#readme",
  "bugs": {
    "url": "https://github.com/Tkingxiao/dsh-any-background/issues"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Tkingxiao/dsh-any-background.git"
  },
  "license": "MIT",
  "author": "Tkingxiao",
  "type": "module",
  "engines": {
    "dsh": "0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || >=0.2.0-rc.1"
  },
  "exports": {
    ".": {
      "default": "./lib/index.js"
    },
    "./client": {
      "default": "./lib/client.js"
    },
    "./package.json": "./package.json"
  },
  "main": "lib/index.js",
  "directories": {
    "lib": "lib"
  },
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:1058-1066](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/index.tsx#L1058-L1066)

设置区缺store降级/实际slot。

```text
    // No host store module (see runtime.ts): the section needs one to bind its
    // props, so register nothing. The theme/wallpaper half above still works.
    console.error('dsh-any-background: settings panel disabled on this host (no store module)')
  } else {
    ctx.slots.inject('settings.section', () => ctx.slots.register({
      name: 'settings.section', id: 'dsh-any-background', order: 35,
      label: () => ctx.locale.bind(NS)('nav'),
      locale: NS, store, inject: sectionInject,
    }, ThemeSection as any))
```

**依据 4 · 源码核查**：[src/client/wallpaper.ts:3432-3471](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/wallpaper.ts#L3432-L3471)

真实视频/生成/图片背景分支。

<details>
<summary>查看原文（40行）</summary>

```text
export function applyWp(): void {
  const url = rWp()
  if (cfg.backgroundType === 'video') {
    // The frame snapshot (rWp's video branch) is preview-only; the layer plays
    // the video from its own slot.
    const vurl = rWpVideo()
    if (vurl) {
      applyVideoWp(vurl)
    } else {
      clearDynamicBg()
      clearVideoEl()
      wpEl?.remove(); wpEl = null
      // An empty video slot must not keep the previous wallpaper's brightness
      // verdict alive: nothing is on screen to justify it, and a stale verdict
      // would flip the next background's font direction the wrong way. The
      // no-background branch below does the same.
      wpVerdict = null
      setBgDark(null)
    }
  } else if (cfg.backgroundType !== 'image' && cfg.generatedBg) {
    // Recreate the live canvas from saved params if one is not active yet
    // (boot or after import).
    clearVideoEl()
    if (!wpController) {
      applyGeneratedBg(cfg.generatedBg)
      return
    }
    ensureWpContainer()
    if (wpController.canvas.parentElement !== wpEl) wpEl!.appendChild(wpController.canvas)
    applyWpEffects()
  } else if (url) {
    applyImageWp(url)
  } else {
    // No background: tear down the layer but keep tokens/blur intact.
    clearDynamicBg()
    clearVideoEl()
    wpEl?.remove(); wpEl = null
    wpVerdict = null
    setBgDark(null)
  }
```

</details>

#### 缺口

- 对特定操作者的可读性/分心、性能与多Host兼容未独立测。
  **影响**：不推生产率或所有主题改善。
  **进一步探讨**：对照原生主题，在真实长消息/代码/工具/设置中记录辨认错误、偏好和恢复一致。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 编辑如何到磁盘与画面，保存失败是什么状态？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

客户端配置经rpcCall到同源dshAnyBackground通道，Host RPC read并行取配置/图片视频字体URL和Host版本，writeConfig返回真实布尔。媒体以serve URL给浏览器，不把整段base64塞每次read。客户端配置250ms尾沿合并保存，失败重试一次，再console.warn近期改动可能重载丢失；即时画面与持久成功不同，pagehide仅发flush，不是等待服务器写成的退出事务。

Host writeConfig先归一化，再写theme-config.json.tmp后rename，失败清tmp/返回false。它保护单次配置主文件不被中途截断，但固定tmp名及整对象写不构成多窗口版本事务，不宣称并发无覆盖。背景applyWp按type选择video/canvas/image，空槽删背景并清亮度判定；客户端300/1500ms延迟恢复与每秒watchdog检测主题丢失/未激活后重新注册/设主题，解决宿主晚初始化覆盖，但也代表有持续兼容接管责任。

真正初始化RPC/Host连接与theme/store模块均属依赖，缺模块会局部降级；CSS/DOM选择器并非Host稳定公有协议。没有运行测帧率/持久故障或所有界面，不把定时器与rename称完整可靠性证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/rpc.ts:20-48](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/rpc.ts#L20-L48)

实际RPC调用/失败和250ms合并常量。

<details>
<summary>查看原文（29行）</summary>

```text

let rpcCallFn: ((endpoint: string, payload: unknown) => Promise<RpcResultLike | undefined>) | null = null

/** Serve URL of the persisted custom font, filled by loadPersisted. */
export let fontServeUrl: string | null = null

export function initRpc(call: (endpoint: string, payload: unknown) => Promise<RpcResultLike | undefined>): void {
  rpcCallFn = call
}

async function rpcCall(method: string, payload: unknown): Promise<unknown> {
  if (!rpcCallFn) return undefined
  try {
    const res = await rpcCallFn(rpcEndpoint(method), payload)
    if (res && res.ok === true) return res.value
    console.warn(`dsh-any-background: rpc "${method}" failed`, res?.error)
    return undefined
  } catch (e) {
    console.warn(`dsh-any-background: rpc "${method}" threw`, e)
    return undefined
  }
}

// Slider drags fire dozens of events per second; coalesce writes to a trailing
// debounce and flush the last pending write on pagehide so a quick close never
// loses it.
const SAVE_DEBOUNCE_MS = 250
let saveTimer: number | undefined

```

</details>

**依据 2 · 源码核查**：[src/client/rpc.ts:55-89](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/rpc.ts#L55-L89)

writeNow布尔、一次重试/flush。

<details>
<summary>查看原文（35行）</summary>

```text
let writeRetryQueued = false
async function writeNow(): Promise<void> {
  const ok = (await rpcCall('writeConfig', { config: cfg })) === true
  if (ok) {
    writeRetryQueued = false
    return
  }
  if (!writeRetryQueued) {
    writeRetryQueued = true
    window.setTimeout(() => { void writeNow() }, 1000)
    return
  }
  writeRetryQueued = false
  console.warn('dsh-any-background: the host could not persist the config — recent settings may be lost on reload (see the host log for the write error)')
}

export function saveConfig(): void {
  if (saveTimer !== undefined) window.clearTimeout(saveTimer)
  saveTimer = window.setTimeout(() => {
    saveTimer = undefined
    void writeNow()
  }, SAVE_DEBOUNCE_MS)
}

export function flushSave(): void {
  if (saveTimer === undefined) return
  window.clearTimeout(saveTimer)
  saveTimer = undefined
  void writeNow()
}

/** Persist the current config immediately (import path — no debounce). */
export function persistConfig(): void {
  void writeNow()
}
```

</details>

**依据 3 · 源码核查**：[src/index.ts:1630-1662](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L1630-L1662)

实际read/writeConfig分发。

<details>
<summary>查看原文（33行）</summary>

```text
async function handleRpcMethod(
  endpoint: string,
  payload: unknown,
  hostInfo: Promise<HostInfo>,
): Promise<{ ok: boolean; value?: unknown; error?: { code: string; message: string; details: object } }> {
  const method = endpoint.slice(`${NS}/`.length)
  try {
    switch (method) {
      case 'read': {
        // Advance a due rotation BEFORE reading the wallpaper slot, so the
        // restore on (re)load paints the new picture from the first apply.
        const rotated = await advanceRotationIfDue()
        // Image, video and font all travel as serve URLs, never as bytes.
        const config = await readConfig()
        // First run: no theme-config.json has ever been written. The CLIENT
        // owns the first persist — it writes the browser half's full default
        // set and re-reads once on this flag. The server used to write its own
        // defaults here too, which made every fresh install do two full-config
        // writes before the first paint finished.
        const firstRun = !(await exists(configPath()))
        // The three slot probes are independent — resolve them concurrently
        // instead of paying three sequential stat/read round-trips. (The locals
        // cannot reuse the probe function names `videoUrl`/`fontUrl`.)
        const [wpServeUrl, vidServeUrl, fntServeUrl, host] = await Promise.all([wallpaperServeUrl(), videoUrl(), fontUrl(), hostInfo])
        // `host` is the front door's verdict; the client picks a per-version
        // adapter from it and lets the DOM arbitrate when the release is
        // undetermined. See `host-compat/`.
        return { ok: true, value: { config, wallpaperUrl: wpServeUrl, videoUrl: vidServeUrl, fontUrl: fntServeUrl, rotated, firstRun, host } }
      }
      case 'writeConfig':
        return { ok: true, value: await writeConfig((payload as { config?: unknown } | null)?.config as ThemeConfig ?? {}) }
      case 'setWallpaper':
        return { ok: true, value: await writeWallpaper(((payload as { dataUrl?: unknown } | null)?.dataUrl ?? null) as string | null) }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:731-753](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L731-L753)

真实tmp写/rename/失败false。

<details>
<summary>查看原文（23行）</summary>

```text
async function writeConfig(config: ThemeConfig): Promise<boolean> {
  await ensureDir()
  // Drop the cache BEFORE writing: callers mutate the object readConfig handed
  // out (rotation add/remove, the MIME write-backs below), so a FAILED write
  // would leave the cache describing changes the disk never got — and with the
  // file's mtime unchanged (or under the coarse mtime granularity some
  // filesystems hand back for back-to-back writes), that stale entry keeps
  // hitting until the next successful write.
  dropConfigCache()
  const tmp = `${configPath()}.tmp`
  try {
    const normalized = normalizeConfig(config)
    warnUnknownConfigKeys(config, normalized)
    await writeFile(tmp, JSON.stringify(normalized, null, 2), 'utf8')
    await rename(tmp, configPath())
    return true
  } catch (e) {
    console.error(`dsh-any-background: failed to write "${CONFIG_FILE}"`, e)
    // A failed write must not leave a half-written temp file next to the real
    // config: it would be picked up by any later scan of the data directory.
    try { await rm(tmp, { force: true }) } catch { /* best effort */ }
    return false
  }
```

</details>

**依据 5 · 源码核查**：[src/client/wallpaper.ts:3432-3471](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/wallpaper.ts#L3432-L3471)

实际媒体背景选择/空槽清理。

<details>
<summary>查看原文（40行）</summary>

```text
export function applyWp(): void {
  const url = rWp()
  if (cfg.backgroundType === 'video') {
    // The frame snapshot (rWp's video branch) is preview-only; the layer plays
    // the video from its own slot.
    const vurl = rWpVideo()
    if (vurl) {
      applyVideoWp(vurl)
    } else {
      clearDynamicBg()
      clearVideoEl()
      wpEl?.remove(); wpEl = null
      // An empty video slot must not keep the previous wallpaper's brightness
      // verdict alive: nothing is on screen to justify it, and a stale verdict
      // would flip the next background's font direction the wrong way. The
      // no-background branch below does the same.
      wpVerdict = null
      setBgDark(null)
    }
  } else if (cfg.backgroundType !== 'image' && cfg.generatedBg) {
    // Recreate the live canvas from saved params if one is not active yet
    // (boot or after import).
    clearVideoEl()
    if (!wpController) {
      applyGeneratedBg(cfg.generatedBg)
      return
    }
    ensureWpContainer()
    if (wpController.canvas.parentElement !== wpEl) wpEl!.appendChild(wpController.canvas)
    applyWpEffects()
  } else if (url) {
    applyImageWp(url)
  } else {
    // No background: tear down the layer but keep tokens/blur intact.
    clearDynamicBg()
    clearVideoEl()
    wpEl?.remove(); wpEl = null
    wpVerdict = null
    setBgDark(null)
  }
```

</details>

**依据 6 · 源码核查**：[src/client/index.tsx:1139-1178](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/index.tsx#L1139-L1178)

延迟恢复和每秒主题watchdog及dispose。

<details>
<summary>查看原文（40行）</summary>

```text
  const restoreSaved = (): void => {
    if (rHasColor()) {
      const snapshot = ctx.theme.getTheme()
      if (!snapshot.themes.some(t => t.id === CUSTOM_ID)) {
        // Theme missing (host adoption dropped it): re-register + activate.
        const [h, s, l] = rColor()
        registerCustom(h, s, l)
      } else if (snapshot.preference !== CUSTOM_ID) {
        // Theme present but inactive: just re-assert the preference. Calling
        // registerCustom here would dispose + re-create the skin, flashing the
        // interface back to the system theme for a frame on every boot.
        ctx.theme.setTheme(CUSTOM_ID)
      }
    }
    applyWp()
  }
  const restoreTimers = [300, 1500].map(delay => window.setTimeout(restoreSaved, delay))
  ctx.effect(() => () => { restoreTimers.forEach(id => window.clearTimeout(id)) }, 'dsh-any-background: boot restore')

  // 8. Theme watchdog: the theme service keeps only built-in preferences in
  // memory, so ANY host-scope adoption can silently drop the custom theme —
  // reverting the label colors (white/black) and the inner surfaces to the
  // system palette. While the skin has anything to say (a color, a brightness
  // verdict, or a forced scheme), re-register and re-assert the custom theme
  // on a slow interval so the theme state always matches it, independent of
  // which event resets it.
  const watchdogId = window.setInterval(() => {
    if (!rHasColor() && rBgDark() === null && rSchemeOverride() === 'auto') return
    const snapshot = ctx.theme.getTheme()
    let changed = false
    if (!snapshot.themes.some(t => t.id === CUSTOM_ID)) {
      registerCustom()
      changed = true
    } else if (snapshot.preference !== CUSTOM_ID) {
      ctx.theme.setTheme(CUSTOM_ID)
      changed = true
    }
    if (changed) applyWp()
  }, 1000)
  ctx.effect(() => () => { window.clearInterval(watchdogId) }, 'dsh-any-background: theme watchdog')
```

</details>

#### 缺口

- 多窗口整对象保存、掉盘/快速退出和主题反复重置真实结果未知。
  **影响**：不能把即时滑块或刷新一次成功当所有更改持久。
  **进一步探讨**：可丢弃配置测写失败/双窗口/快速关闭，分别查磁盘、刷新与当前画面。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 媒体与兼容接管有哪些采用和退出成本？

**研究主题**：缺陷与关键质疑、效果与总成本、采用判断

#### 完整回答

RPC和POST上传经Host connection.requestRejection，身份/Host/Origin保护委托宿主，插件不自造账号；GET/HEAD媒体路由故意开放以供img/video加载，因此不适合把秘密素材当受鉴权文件库。网络壁纸只限http/https并跟重定向，没有此路径的私网地址拒绝；下载arrayBuffer后才查长度/嗅探，header fetch定时器已清，不能把长度阈值说成全流量/内存硬限或整个body读取硬时限。应优先本地可信素材，别让不可信配置驱动Host内网取图。

版本判定对未核新线用nearest适配，不因包放行未来版本就保证DOM/CSS接管正确。透明/模糊/视频可能降可读性、耗GPU/电量，字体/第三方插件表面仍需人工检查；本次不虚构性能或安全攻击。

首次需兼容Host/客户端模块、挑背景和逐界面调整；持续是媒体磁盘/视频渲染和升级复核，金额/耗电未知，人工与现金分开。Host启动扫崩溃临时文件、保留最近3份损坏配置及清10分钟外未引用轮播文件，是有界维护而非备份恢复保证。客户端dispose移除背景/令牌/样式和定时监听；停用/回原生主题后配置媒体仍需按归属清理，不会因卸载自动消失。可在个人非敏感素材上受限试用，发现遮挡、闪屏/卡顿或重载不一致即回原生。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1759-1772](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L1759-L1772)

RPC真正requestRejection。

<details>
<summary>查看原文（14行）</summary>

```text
  // `requestRejection`, then bridge the JSON envelope inline.
  ctx.inject(['connection', 'webServer'], (webCtx: any) => {
    webCtx.effect(
      () => webCtx.webServer.register({
        kind: 'prefix',
        path: RPC_CHANNEL,
        handler: async (req: any, res: any) => {
          const rejection = webCtx.connection.requestRejection(req)
          if (rejection !== undefined) {
            res.writeHead(rejection)
            res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
            return
          }
          if (req.method !== 'POST') {
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1832-1845](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L1832-L1845)

媒体GET开放/上传套Host围栏。

<details>
<summary>查看原文（14行）</summary>

```text
    // Longest prefix wins over the RPC channel's shorter one; exact beats
    // prefix, so uploads land in the upload handler even though UPLOAD_ROUTE
    // sits inside VIDEO_ROUTE. Effects auto-dispose with the injected scope.
    // The GET/HEAD serve routes stay open (the browser's <img>/<video> fetches
    // carry no auth headers); the POST upload routes get the same Host/Origin
    // fence as the RPC channel so a stray cross-origin page cannot write files.
    const fenceUpload = (handler: (req: any, res: any) => Promise<void>) => (req: any, res: any): void => {
      const rejection = webCtx.connection.requestRejection(req)
      if (rejection !== undefined) {
        res.writeHead(rejection)
        res.end(rejection === 401 ? 'unauthorized' : 'forbidden')
        return
      }
      void handler(req, res)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:811-849](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L811-L849)

网络URL实际跟随/timeout/arrayBuffer后查大小。

<details>
<summary>查看原文（39行）</summary>

```text
async function writeWallpaperFromUrl(url: string | null): Promise<{ ok: boolean; wallpaperUrl?: string | null; error?: string }> {
  if (url === null) {
    const ok = await writeWallpaper(null)
    return { ok, wallpaperUrl: null, error: ok ? undefined : 'remove failed' }
  }
  let u: URL
  try { u = new URL(url) } catch { return { ok: false, error: 'invalid url' } }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') return { ok: false, error: 'unsupported scheme' }
  let res: Response
  try {
    const ctl = new AbortController()
    const timer = setTimeout(() => ctl.abort(), WALLPAPER_FETCH_TIMEOUT)
    try { res = await fetch(url, { redirect: 'follow', signal: ctl.signal }) }
    finally { clearTimeout(timer) }
  } catch (e) {
    return { ok: false, error: e instanceof Error && e.name === 'AbortError' ? 'timeout' : 'network error' }
  }
  if (!res.ok) return { ok: false, error: `http ${res.status}` }
  const ct = res.headers.get('content-type') ?? ''
  if (ct && !/^image\//.test(ct)) return { ok: false, error: 'not an image' }
  let buf: Buffer
  try {
    const arr = await res.arrayBuffer()
    if (arr.byteLength === 0) return { ok: false, error: 'empty response' }
    if (arr.byteLength > WALLPAPER_FETCH_MAX) return { ok: false, error: 'too large' }
    buf = Buffer.from(arr)
  } catch {
    return { ok: false, error: 'read failed' }
  }
  // The declared Content-Type said image/*, but the bytes must agree: a
  // mismatched or hostile payload gets a clear error instead of a slot that
  // later renders as a broken image.
  if (!isImageBytes(buf)) return { ok: false, error: 'not an image' }
  // Write the downloaded bytes straight to disk — no base64 string round-trip.
  await ensureDir()
  try {
    await writeFile(wallpaperPath(), buf)
  } catch (e) {
    console.error('dsh-any-background: failed to write the downloaded wallpaper', e)
```

</details>

**依据 4 · 源码核查**：[src/host-compat/channel.ts:203-235](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/host-compat/channel.ts#L203-L235)

实际exact/line/nearest fallback。

<details>
<summary>查看原文（33行）</summary>

```text
export function classifyRelease(version: string | null): HostVerdict {
  const host = version === null ? null : parse(version)
  if (host === null) return { channel: 'unknown', match: 'unresolved' }

  const sameLine = TABLE.filter(row => cmpCore(row.parsed.core, host.core) === 0)
  if (sameLine.length > 0) {
    // `exact` names THE BUILD the row was checked against, not its channel: a
    // channel-only test would call `0.2.1-alpha.3` exact against a table verified
    // at `alpha.2`, and `line` exists precisely so an unverified build says so.
    const exact = sameLine.find(row => row.release === version)
    if (exact !== undefined) return { channel: exact.channel, match: 'exact' }
    // A patch line may carry several verified builds AND several channels, so take
    // the highest row at or below the host: an unverified newer build gets the
    // newest verification that precedes it, whichever folder that was
    // (`0.2.0-rc.3` → the rc.2 facts, not the rc.1 ones), and one older than every
    // row falls back to the line's first, since the folder's facts were derived from
    // that shape.
    const atOrBelow = sameLine.filter(row => cmp(row.parsed, host) <= 0)
    const chosen = atOrBelow.length > 0 ? atOrBelow[atOrBelow.length - 1]! : sameLine[0]!
    return { channel: chosen.channel, match: 'line' }
  }

  const older = TABLE.filter(row => cmp(row.parsed, host) < 0)
  if (older.length === 0) return { channel: TABLE[0]!.channel, match: 'nearest' }
  const newer = TABLE.filter(row => cmp(row.parsed, host) > 0)
  if (newer.length === 0) return { channel: TABLE[TABLE.length - 1]!.channel, match: 'nearest' }
  return { channel: older[older.length - 1]!.channel, match: 'nearest' }
}

/** The channel a release maps onto — the verdict's answer without the confidence. */
export function channelOf(version: string | null): HostChannel {
  return classifyRelease(version).channel
}
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1698-1736](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/index.ts#L1698-L1736)

启动sweep真实范围/宽限和失败忽略。

<details>
<summary>查看原文（39行）</summary>

```text
const KEEP_CORRUPT_ARCHIVES = 3
const ORPHAN_GRACE_MS = 10 * 60 * 1000

async function sweepDataDir(): Promise<void> {
  try {
    const entries = await readdir(dataDir())
    for (const name of entries) {
      if (name === UPLOAD_TMP || name === VIDEO_UPLOAD_TMP || name === FONT_UPLOAD_TMP || name === VIDEO_DOWNLOAD_TMP) {
        await rm(dshHomePath(DATA_DIR, name), { force: true })
      }
    }
    // Newest-first by mtime; everything past the keep-count goes.
    const corrupts: Array<{ name: string; mtime: number }> = []
    for (const name of entries) {
      if (!/^theme-config\.json\.corrupt-\d+$/.test(name)) continue
      try {
        const st = await stat(dshHomePath(DATA_DIR, name))
        corrupts.push({ name, mtime: st.mtimeMs })
      } catch { /* vanished mid-sweep */ }
    }
    corrupts.sort((a, b) => b.mtime - a.mtime)
    for (const c of corrupts.slice(KEEP_CORRUPT_ARCHIVES)) {
      await rm(dshHomePath(DATA_DIR, c.name), { force: true })
    }
    if (await exists(rotationDir())) {
      const referenced = new Set((await readConfig()).rotation.items.map(it => it.file))
      const now = Date.now()
      for (const name of await readdir(rotationDir())) {
        if (referenced.has(name)) continue
        const p = dshHomePath(DATA_DIR, ROTATION_DIR, name)
        try {
          if (now - (await stat(p)).mtimeMs < ORPHAN_GRACE_MS) continue
        } catch { continue }
        await rm(p, { force: true })
      }
    }
  } catch {
    // A sweep failure is never worth failing the boot over.
  }
```

</details>

**依据 6 · 源码核查**：[src/client/index.tsx:450-458](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/index.tsx#L450-L458)

生命周期teardown注册。

```text
  const scheduleTimer = window.setInterval(scheduleTick, 30_000)
  schemeMq?.addEventListener?.('change', scheduleTick)
  ctx.effect(() => () => {
    window.clearInterval(scheduleTimer)
    schemeMq?.removeEventListener?.('change', scheduleTick)
  }, 'dsh-any-background: schedule timer')
  ctx.effect(() => () => { teardownWp() }, 'dsh-any-background: wp cleanup')
  ctx.effect(() => startBetterSidebarWatch(), 'dsh-any-background: better-sidebar watch')
  ctx.effect(() => startThirdPartyWatch(), 'dsh-any-background: third-party scan')
```

**依据 7 · 源码核查**：[src/client/wallpaper.ts:3505-3533](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/wallpaper.ts#L3505-L3533)

真实背景/令牌/样式退出清理。

<details>
<summary>查看原文（29行）</summary>

```text
export function teardownWp(): void {
  clearDynamicBg()
  clearVideoEl()
  disposeVideoObjectUrl()
  setBgDark(null)
  wpVerdict = null
  wpEl?.remove(); wpEl = null
  clearCustomTokens()
  tokenStyleEl?.remove(); tokenStyleEl = null
  removeViewCards()
  document.body.removeAttribute('data-ds-dark-theme')
  document.body.style.removeProperty('color-scheme')
  document.documentElement.style.removeProperty('--dsh-any-bg-settings-surface')
  document.documentElement.style.removeProperty('--dsh-any-bg-settings-layer-1')
  document.documentElement.style.removeProperty('--dsh-any-bg-settings-layer-2')
  document.documentElement.style.removeProperty('--dsh-any-bg-settings-layer-3')
  document.documentElement.style.removeProperty('--dsh-any-traj-layer-1')
  document.documentElement.style.removeProperty('--dsh-any-traj-layer-2')
  document.documentElement.style.removeProperty('--dsh-any-traj-layer-3')
  document.documentElement.style.removeProperty('--dsh-any-bg-settings-card-surface')
  document.documentElement.style.removeProperty('--dsh-any-blur-settings')
  document.documentElement.style.removeProperty('--dsh-any-blur-card-panels')
  document.documentElement.style.removeProperty('--dsh-any-input-blur')
  document.documentElement.style.removeProperty('--dsh-any-part-blur-global')
  for (const set of [PANEL_LAYER_VARS, PROD_PANEL_LAYER_VARS, PROD_LAYER_VARS]) {
    for (const k of LAYER_KEYS) {
      const name = set[k]
      if (name) document.documentElement.style.removeProperty(name)
    }
```

</details>

#### 缺口

- Host外层媒体暴露、全部上传/视频/字体/导入路径、GPU耗用与未来CSS兼容未全审。
  **影响**：不适合秘密素材托管，也不保证全部版本可读/低资源。
  **进一步探讨**：用本地素材和独立profile核停止/升级后的界面，出现问题停用并保留配置作线索。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样把精细外观变成可检验而非审美口号？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

可检验方向是提供可读性预检/安全回退预设：使用者选定真实消息/代码/弹层样本，在自定义背景/透明/字体上测文本对比与遮挡，未知Host适配先提示降级并一键恢复原生令牌。基线是当前精细滑块、亮度主题接管与nearest版本猜测，不是把颜色控件增加当创新。

最小实验在相同Host/任务比较原生、自定义手调、带预检方案，记录文字辨认/点击错误、调整时间、主观偏好、帧率/资源及恢复次数。改进需可读性不劣且目标人群愿保留；若仅满足偏好而预检增加麻烦，保留简单外观即可。测量算法也不能替代视力差异/动态画面人测，未核新Host只显示未知，不称自动无障碍通过。

方向未实现、未验证，不计本插件现有贡献或经济创新；若实际用户不需要，停止而不强造生产插件需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/wallpaper.ts:3432-3471](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/wallpaper.ts#L3432-L3471)

实际动态/图片背景与亮度状态基线。

<details>
<summary>查看原文（40行）</summary>

```text
export function applyWp(): void {
  const url = rWp()
  if (cfg.backgroundType === 'video') {
    // The frame snapshot (rWp's video branch) is preview-only; the layer plays
    // the video from its own slot.
    const vurl = rWpVideo()
    if (vurl) {
      applyVideoWp(vurl)
    } else {
      clearDynamicBg()
      clearVideoEl()
      wpEl?.remove(); wpEl = null
      // An empty video slot must not keep the previous wallpaper's brightness
      // verdict alive: nothing is on screen to justify it, and a stale verdict
      // would flip the next background's font direction the wrong way. The
      // no-background branch below does the same.
      wpVerdict = null
      setBgDark(null)
    }
  } else if (cfg.backgroundType !== 'image' && cfg.generatedBg) {
    // Recreate the live canvas from saved params if one is not active yet
    // (boot or after import).
    clearVideoEl()
    if (!wpController) {
      applyGeneratedBg(cfg.generatedBg)
      return
    }
    ensureWpContainer()
    if (wpController.canvas.parentElement !== wpEl) wpEl!.appendChild(wpController.canvas)
    applyWpEffects()
  } else if (url) {
    applyImageWp(url)
  } else {
    // No background: tear down the layer but keep tokens/blur intact.
    clearDynamicBg()
    clearVideoEl()
    wpEl?.remove(); wpEl = null
    wpVerdict = null
    setBgDark(null)
  }
```

</details>

**依据 2 · 源码核查**：[src/host-compat/channel.ts:203-235](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/host-compat/channel.ts#L203-L235)

未知/nearest版本基线。

<details>
<summary>查看原文（33行）</summary>

```text
export function classifyRelease(version: string | null): HostVerdict {
  const host = version === null ? null : parse(version)
  if (host === null) return { channel: 'unknown', match: 'unresolved' }

  const sameLine = TABLE.filter(row => cmpCore(row.parsed.core, host.core) === 0)
  if (sameLine.length > 0) {
    // `exact` names THE BUILD the row was checked against, not its channel: a
    // channel-only test would call `0.2.1-alpha.3` exact against a table verified
    // at `alpha.2`, and `line` exists precisely so an unverified build says so.
    const exact = sameLine.find(row => row.release === version)
    if (exact !== undefined) return { channel: exact.channel, match: 'exact' }
    // A patch line may carry several verified builds AND several channels, so take
    // the highest row at or below the host: an unverified newer build gets the
    // newest verification that precedes it, whichever folder that was
    // (`0.2.0-rc.3` → the rc.2 facts, not the rc.1 ones), and one older than every
    // row falls back to the line's first, since the folder's facts were derived from
    // that shape.
    const atOrBelow = sameLine.filter(row => cmp(row.parsed, host) <= 0)
    const chosen = atOrBelow.length > 0 ? atOrBelow[atOrBelow.length - 1]! : sameLine[0]!
    return { channel: chosen.channel, match: 'line' }
  }

  const older = TABLE.filter(row => cmp(row.parsed, host) < 0)
  if (older.length === 0) return { channel: TABLE[0]!.channel, match: 'nearest' }
  const newer = TABLE.filter(row => cmp(row.parsed, host) > 0)
  if (newer.length === 0) return { channel: TABLE[TABLE.length - 1]!.channel, match: 'nearest' }
  return { channel: older[older.length - 1]!.channel, match: 'nearest' }
}

/** The channel a release maps onto — the verdict's answer without the confidence. */
export function channelOf(version: string | null): HostChannel {
  return classifyRelease(version).channel
}
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:1139-1178](https://github.com/Tkingxiao/dsh-any-background/blob/c9b9490ba2118a4048df8e10961194a8a427bf5d/src/client/index.tsx#L1139-L1178)

主题恢复机制基线。

<details>
<summary>查看原文（40行）</summary>

```text
  const restoreSaved = (): void => {
    if (rHasColor()) {
      const snapshot = ctx.theme.getTheme()
      if (!snapshot.themes.some(t => t.id === CUSTOM_ID)) {
        // Theme missing (host adoption dropped it): re-register + activate.
        const [h, s, l] = rColor()
        registerCustom(h, s, l)
      } else if (snapshot.preference !== CUSTOM_ID) {
        // Theme present but inactive: just re-assert the preference. Calling
        // registerCustom here would dispose + re-create the skin, flashing the
        // interface back to the system theme for a frame on every boot.
        ctx.theme.setTheme(CUSTOM_ID)
      }
    }
    applyWp()
  }
  const restoreTimers = [300, 1500].map(delay => window.setTimeout(restoreSaved, delay))
  ctx.effect(() => () => { restoreTimers.forEach(id => window.clearTimeout(id)) }, 'dsh-any-background: boot restore')

  // 8. Theme watchdog: the theme service keeps only built-in preferences in
  // memory, so ANY host-scope adoption can silently drop the custom theme —
  // reverting the label colors (white/black) and the inner surfaces to the
  // system palette. While the skin has anything to say (a color, a brightness
  // verdict, or a forced scheme), re-register and re-assert the custom theme
  // on a slow interval so the theme state always matches it, independent of
  // which event resets it.
  const watchdogId = window.setInterval(() => {
    if (!rHasColor() && rBgDark() === null && rSchemeOverride() === 'auto') return
    const snapshot = ctx.theme.getTheme()
    let changed = false
    if (!snapshot.themes.some(t => t.id === CUSTOM_ID)) {
      registerCustom()
      changed = true
    } else if (snapshot.preference !== CUSTOM_ID) {
      ctx.theme.setTheme(CUSTOM_ID)
      changed = true
    }
    if (changed) applyWp()
  }, 1000)
  ctx.effect(() => () => { window.clearInterval(watchdogId) }, 'dsh-any-background: theme watchdog')
```

</details>

#### 缺口

- 预检是否降低真实辨认错误且用户愿承担调整成本未知。
  **影响**：不是已达无障碍或已验证需求。
  **进一步探讨**：先小规模同任务交叉对照；无可读性/偏好收益就不推进。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
