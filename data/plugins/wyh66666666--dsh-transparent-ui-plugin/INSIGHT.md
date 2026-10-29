# Aqua / Transparent UI

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[d94431a](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/tree/d94431a95bd147c11ef3fe95fa1915d1e96b028b)

<!-- BEGIN META -->
[![GitHub ★ 428](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=428&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin)
<!-- END META -->

> **功能**：为 DSH Web 提供可开关的玻璃材质、布局、流体或壁纸背景及动效，设置保存在浏览器本地。

> **亮点**：统一视觉层/设置与撤销生命周期，把外观调节放进原生界面，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：包名/patch/bundle分发描述不一致且作者提醒API适配滞后，内存生效不等持久；媒体持久也不随禁用删除，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

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
  - [Q01 · 这是什么类型的主题，安装声明和固定源码一致吗？](#detail-section-11)
  - [Q02 · 主题如何生效与撤销，设置和壁纸保存有什么边界？](#detail-section-12)
  - [Q03 · 能否推荐使用，什么验证比再加效果更重要？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：偏好磨砂玻璃和自定义背景的Web用户可调外观层；任务仍是清晰阅读与操作，非模型性能提升，见 [Q01](#research-q01)。

原生深浅主题与手动CSS；本项目增加可调玻璃和背景效果，依赖原生token/slots和浏览器渲染。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Aqua层 | 可调材质/布局 | 匹配Host服务，未验视觉 |
| 偏好 | 浏览器持久开关/旋钮 | 写失败可只内存 |
| 壁纸/视频 | 个性背景 | IDB/handle权限与残留另管 |
| 禁用 | token/动画/DOM撤销 | 不擦持久媒体或保证跨主题恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Host客户端theme/slots/locale | 必需 | 层和设置 | 作者提示新API可能需修 |
| 正确包/patch/client分发 | 加载必需 | Loader发现 | 当前名称/元数据不一致待核 |
| localStorage/IDB | 持久偏好/媒体必需 | 跨刷新重用 | 写失败仅内存，handle可失权 |
| GPU/WebGL/浏览器媒体 | 动效可选 | 流体/视频等 | 可读/资源必须实测 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 核包 | 维护者查名称/出口/配置 | 不猜latest/同名包 |
| 启用 | 已匹配profile加载client层 | 设置入口/实际页面可读 |
| 调节 | 用户逐项改材质/背景 | 分核内存与持久 |
| 退出 | 关闭/dispose、媒体另清 | 原生恢复并查本地残留 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 包/备份金额未知 | 核交付、Host与视觉配置 | 不一致待解决 |
| 持续使用 | GPU/视频/IDB空间未知 | API/CSS与可读性适配 | 无性能节时实证 |
| 失败恢复 | 重载/媒体资源未知 | 关层、查保存和权限 | 禁用不擦持久媒体 |
| 退出 | 本地媒体保留未知 | 明确profile及清理范围 | 原生主题可退 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 个性化 | token/属性/多背景 | 真实可读与观感 |
| 回退 | 层/动画dispose | 共存主题/Host实际恢复 |
| 保存 | 浏览器偏好/媒体 | 配额/权限失败后重启行为 |

> **思考**：包名/patch/bundle分发描述不一致且作者提醒API适配滞后，内存生效不等持久；媒体持久也不随禁用删除，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：统一视觉层/设置与撤销生命周期，把外观调节放进原生界面，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) token层和effect清理可借鉴；保存失败内存兜底须让用户辨识，分发错配不能用漂亮截图覆盖。

<a id="detail-section-5"></a>

### 1.4 主要限制

包名/patch/bundle分发描述不一致且作者提醒API适配滞后，内存生效不等持久；媒体持久也不随禁用删除，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

先观察固定交付与Host，不对重要profile直接套安装描述；匹配环境独立核可读/持久/恢复，基础外观可回原生，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码UI机制已核，交付/宿主与视觉重要缺口使建议观察。实际未安装/运行，未来预设未验证。

- 已检查：作者 README、包清单、源码路径 README.zh.md、cordis.patch.yml、package.json、src/client/index.ts、src/client/theme-layer.ts、src/client/wallpaper-store.ts、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：完整inventory；assignment baseline不存在且index identity无正式命中，按新对象。读package/Host/client、layer token/存储/清理、wallpaper store及README；未全审着色器/所有样式，不执行。
- 下一步：先核固定产物及匹配Host，再独立profile逐页可读性/性能/存储配额/撤权限/禁用清理；本轮无视觉或运行验收。

**分析版本**

- **仓库**：[WYH66666666/DSH-Transparent-UI-Plugin](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin)
- **版本号**：1.3.0（[固定提交 d94431a](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/tree/d94431a95bd147c11ef3fe95fa1915d1e96b028b)）
- **版本日期**：2026-08-22（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

以真实页面可读/性能预设和持久状态反馈改善回退，原生对照无收益则否定，未实现，见 [Q03](#research-q03)。

先核固定产物及匹配Host，再独立profile逐页可读性/性能/存储配额/撤权限/禁用清理；本轮无视觉或运行验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 243 | — | — | 3081 |
| .js | source | 3 | 3895 | 3419 | 555 | — |
| .tsx | source | 3 | 568 | 398 | 154 | — |
| .ts | source | 19 | 3844 | 2859 | 710 | — |

</details>

**活跃度**

[![Issue 未关闭 25](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=25&color=737b86&logo=github)](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 8](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=8&color=737b86&logo=github)](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定主题的交付接线、生效/撤销及本地媒体状态能否支持可恢复外观采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 这是什么类型的主题，安装声明和固定源码一致吗？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定仓库是WYH66666666/DSH-Transparent-UI-Plugin，package自报@deepseek-ai/dsh-client-ui-aqua 1.3.0。它是纯UI原生插件：Host apply为空占位以进入Loader，实际client用theme/slots/locale服务挂AquaLayer、插件开关和外观行；不是独立DSH客户端，也不能因包使用deepseek命名空间就认定官方发布。目标是偏好磨砂玻璃、背景及动效的Web用户，相对原生主题提供可调材质/布局/壁纸，不改变模型与业务工作流。

采用首先遇到交付不一致：README推荐未作用域dsh-client-ui-aqua且称dsh.bundle自动加载，cordis.patch行也用未作用域名；当前package却是有作用域名，dsh仅client无bundle声明，files也未列patch。README更明确提醒新API适配可能不及时。固定源码足以确认界面机制，不能据此给出已验可安装命令；不能把声明名、另一个npm包、旧手动配置当同一成品。先由维护者核实际包/生成出口/profile接线。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-18](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/package.json#L2-L18)

身份、版本和主入口。

<details>
<summary>查看原文（17行）</summary>

```text
  "name": "@deepseek-ai/dsh-client-ui-aqua",
  "description": "Aqua: a highly customizable glassmorphism theme for the Web surface — adjustable blur, frost, fluid or wallpaper backdrop, unified corners, and motion",
  "version": "1.3.0",
  "publishConfig": {
    "access": "public"
  },
  "repository": {
    "type": "git",
    "url": "git+https://github.com/WYH66666666/DSH.git"
  },
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
```

</details>

**依据 2 · 源码核查**：[package.json:31-47](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/package.json#L31-L47)

client元数据无bundle。

<details>
<summary>查看原文（17行）</summary>

```text
  "dsh": {
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-primitives"
      ],
      "platform": "web"
    }
  },
  "scripts": {
    "bundle": "tsdown",
    "watch": "tsdown --watch"
  },
```

</details>

**依据 3 · 源码核查**：[package.json:77-82](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/package.json#L77-L82)

分发files范围。

```text
  "files": [
    "lib/index.js",
    "lib/invariant.js",
    "lib/client.js",
    "lib/types/**/*.d.ts"
  ]
```

**依据 4 · 源码核查**：[src/index.ts:1-10](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/index.ts#L1-L10)

空Host与实际client分工。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Aqua theme-layer plugin, node half. Pure UI plugin: the empty apply exists
 * so the plugin appears in the host cordis.yml / Loader; the browser half
 * ships via exports["./client"], discovered through the package.json
 * dsh.client declaration. The enable flag is a browser-local preference
 * (localStorage) — a client-only visual layer owns no host configuration.
 */

/** Host plugin body — no host-side behavior for this surface plugin. */
export function apply(): void {}
```

</details>

**依据 5 · 源码核查**：[src/client/index.ts:29-40](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/index.ts#L29-L40)

client所需服务与AquaLayer。

<details>
<summary>查看原文（12行）</summary>

```text
export const inject = ['theme', 'slots', 'locale']

/**
 * Client plugin body.
 * @param ctx - client cordis context.
 */
export function apply(ctx: ClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), 'ui-aqua: settings dictionaries')

  // The layer owns its lifecycle: enable flag, token stack, and CSS attribute
  // are all effects released on disable/dispose.
  const layer = new AquaLayer(ctx)
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:7-9](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/cordis.patch.yml#L7-L9)

patch未作用域行。

```text
- insert:
    - id: ui-aqua
      name: 'dsh-client-ui-aqua'
```

**依据 7 · 作者声明**：[README.zh.md:5-7](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/README.zh.md#L5-L7)

维护兼容提醒。

```text
# 注意⚠️⚠️⚠️（务必仔细阅读）：随着DSH版本更新，本人因学业繁忙无法及时为该插件适配新的API，请自行使用其他agent更换或修理，以免在安装该插件时出现崩溃问题

Aqua 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片,你还可以添加视频和图片作为背景。关掉开关就回到原生界面，不改 DSH 任何一行源码。
```

**依据 8 · 作者声明**：[README.zh.md:29-35](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/README.zh.md#L29-L35)

作者安装/自动加载声明。

````text
### 方式一：npm 一键安装（推荐）

```sh
dsh plugin --profile web add dsh-client-ui-aqua
```

从 npm 安装最新版，自动注册为 profile 插件层（`dsh.bundle` 补丁），所有平台通用。刷新 Web 界面即可。
````

#### 缺口

- 实际发行包、Host接线和当前兼容版本未核，元数据与安装描述有差异。
  **影响**：不从主题源码或作者截图推导当前宿主安装兼容、视觉可读性和恢复成功。
  **进一步探讨**：固定已知匹配宿主与包内容，逐一核名称、client出口和patch加载，不替换为latest或猜命令。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题如何生效与撤销，设置和壁纸保存有什么边界？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

Client建AquaLayer并镜像到两个设置store，主题change同步开关；层用html属性和theme.overrideTokens叠加，再挂背景/流体/鲸鱼/边缘等效果。unmount撤属性、dispose动画/token、revoke视频object URL并拆场景，这支持“关闭可回原生”的生命周期设计，但不同主题/样式共存和真实视觉尚未验收。不是全局重写Host配置，原生业务仍靠宿主。

开关与旋钮保存在浏览器localStorage，读失败用默认、写失败保留内存效果；用户当前看见设置生效不等刷新后持久。大视频blob放IndexedDB，小设置只存idb标记，另可存File System Access handle以便重读原文件，失败返回false/null；浏览器配额、权限撤回、同源数据清理和重启行为影响恢复。unmount撤object URL不等删除已持久blob/handle，禁用与擦除本地媒体是两件事。不见Host读会话链不等整体浏览器同源数据是安全沙箱。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.ts:42-81](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/index.ts#L42-L81)

两个store与主题同步。

<details>
<summary>查看原文（40行）</summary>

```text
  // Two store mirrors of the same layer state: one for the Plugins card
  // (master switch) and one for the General section's Appearance row (knobs).
  const pluginStore = createAquaRowStore()
  const appearanceStore = createAquaRowStore()
  let pluginBound: BoundActions<typeof pluginStore> | undefined
  let appearanceBound: BoundActions<typeof appearanceStore> | undefined
  let revision = 0
  const payload = (): AquaSettingsPayload => {
    const s = layer.getSettings()
    return {
      enabled: layer.getEnabled(),
      mode: s.mode,
      blur: s.blur,
      frost: s.frost,
      fluidHue: s.fluidHue,
      fluidDepth: s.fluidDepth,
      bgBrightness: s.bgBrightness,
      dark: layer.getDark(),
      background: s.background,
      wallpaper: s.wallpaper,
      whale: s.whale,
      critters: s.critters,
      mesh: s.mesh,
      spotlight: s.spotlight,
      press: s.press,
      wallpaperBlur: s.wallpaperBlur,
      wallpaperFrost: s.wallpaperFrost,
      videoBlur: s.videoBlur,
      videoBrightness: s.videoBrightness,
    }
  }
  const sync = (): void => {
    const next = payload()
    pluginBound?.sync(next, revision)
    appearanceBound?.sync(next, revision)
    revision += 1
  }
  // The Appearance switch flips the brightness knob's half-range; re-sync
  // both stores so the row re-renders with the new range.
  ctx.effect(() => ctx.on('theme/change', () => { sync() }), 'ui-aqua: appearance scheme sync')
```

</details>

**依据 2 · 源码核查**：[src/client/theme-layer.ts:198-214](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L198-L214)

开关读默认/写失败内存仍生效。

<details>
<summary>查看原文（17行）</summary>

```text
/** Read the persisted enable flag (absent storage means on). */
function readEnabled(): boolean {
  try {
    const raw = localStorage.getItem(AQUA_ENABLED_KEY)
    return raw === null ? DEFAULT_ENABLED : raw === 'true'
  } catch {
    return DEFAULT_ENABLED
  }
}

/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

</details>

**依据 3 · 源码核查**：[src/client/theme-layer.ts:318-323](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L318-L323)

旋钮保存失败同样不保证持久。

```text
function writeSetting(key: NumericKey, value: number): void {
  try {
    localStorage.setItem(NUMERIC_KEYS[key], String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

**依据 4 · 源码核查**：[src/client/theme-layer.ts:934-950](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L934-L950)

token覆盖和实际mount。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Apply the mode's token layer (floating palette, or translucent compat). */
  private applyTokens(): void {
    this.tokenDisposer?.()
    this.tokenDisposer = this.ctx.theme.overrideTokens(
      OVERRIDE_SOURCE,
      this.settings.mode === 'compat' ? COMPAT_TOKEN_OVERRIDES : AQUA_TOKEN_OVERRIDES,
    )
  }

  private mount(): void {
    document.documentElement.setAttribute(AQUA_ATTRIBUTE, '')
    ensureAmbientScene()
    ensurePageFades()
    this.applySettings()
    this.applyTokens()
    this.mountFluid()
    this.startSeamStamper()
```

</details>

**依据 5 · 源码核查**：[src/client/theme-layer.ts:982-1007](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L982-L1007)

撤销效果与object URL。

<details>
<summary>查看原文（26行）</summary>

```text
  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    document.documentElement.removeAttribute('data-dsh-float')
    document.documentElement.removeAttribute('data-dsh-compat')
    document.documentElement.removeAttribute('data-dsh-aqua-wallpaper')
    document.documentElement.removeAttribute('data-dsh-aqua-media')
    document.documentElement.removeAttribute(SPOTLIGHT_ATTRIBUTE)
    document.documentElement.removeAttribute(PRESS_ATTRIBUTE)
    this.spotlightDisposer?.()
    this.spotlightDisposer = undefined
    this.whaleHandle?.dispose()
    this.whaleHandle = undefined
    this.meshHandle?.dispose()
    this.meshHandle = undefined
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    if (this.videoObjectUrl !== undefined) {
      URL.revokeObjectURL(this.videoObjectUrl)
      this.videoObjectUrl = undefined
      this.videoBlobId = undefined
    }
    this.teardownFluid()
    removeAmbientScene()
    removePageFades()
    this.seamDisposer?.()
    this.seamDisposer = undefined
```

</details>

**依据 6 · 源码核查**：[src/client/wallpaper-store.ts:1-14](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/wallpaper-store.ts#L1-L14)

blob/handle持久介质。

<details>
<summary>查看原文（14行）</summary>

```text
/**
 * Large wallpaper storage: videos too big for localStorage (its ~5MB quota)
 * go into IndexedDB as raw blobs, while the setting keeps a tiny `idb:<id>`
 * marker. On boot the layer loads the blob, wraps it in an object URL and
 * hands it to the <video> element — no quota trouble, survives restarts.
 */

const DB_NAME = 'dsh-aqua-media'
const STORE = 'wallpaper'
const DB_VERSION = 1

/** Fixed key holding the File System Access handle (the browser's remembered
 *  file authorization — the closest the web allows to "remember the path"). */
const HANDLE_KEY = 'videoHandle'
```

</details>

**依据 7 · 源码核查**：[src/client/wallpaper-store.ts:91-120](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/wallpaper-store.ts#L91-L120)

handle保存/读取失败反馈。

<details>
<summary>查看原文（30行）</summary>

```text
/** Persist a File System Access handle so the next visit can re-read the
 *  ORIGINAL file without the user picking it again. */
export async function saveVideoHandle(handle: FileSystemFileHandle): Promise<boolean> {
  try {
    const db = await openDb()
    await new Promise<void>((resolve, reject) => {
      const request = tx(db, 'readwrite').put(handle, HANDLE_KEY)
      request.onsuccess = () => { resolve() }
      request.onerror = () => { reject(request.error ?? new Error('handle put failed')) }
    })
    db.close()
    return true
  } catch {
    return false
  }
}

/** Load the remembered file handle (null when absent or storage fails). */
export async function loadVideoHandle(): Promise<FileSystemFileHandle | null> {
  try {
    const db = await openDb()
    const handle = await new Promise<FileSystemFileHandle | undefined>((resolve, reject) => {
      const request = tx(db, 'readonly').get(HANDLE_KEY) as IDBRequest<FileSystemFileHandle | undefined>
      request.onsuccess = () => { resolve(request.result) }
      request.onerror = () => { reject(request.error ?? new Error('handle get failed')) }
    })
    db.close()
    return handle ?? null
  } catch {
    return null
```

</details>

#### 缺口

- 存储配额/权限撤回、禁用后媒体清理及共存样式恢复未验证。
  **影响**：不从主题源码或作者截图推导当前宿主安装兼容、视觉可读性和恢复成功。
  **进一步探讨**：无敏感壁纸副本测试存储拒绝/重启/撤权限/禁用卸载，核DOM/token、动画句柄和IndexedDB残留。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能否推荐使用，什么验证比再加效果更重要？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察，先解决固定包/接线与Host版本差异；已有可恢复匹配环境的维护者可离线检查，不把源码注册当实装成功。首次有原配置备份、包名/出口核对和视觉设置，持续有CSS/API升级、WebGL/动画/视频与GPU/内存、电量，失败要处理看不清/低性能/本地存储恢复；金额与耗时未知。若只需基础深浅色，原生主题更省配置。退出先关层、核原生可读，再明确是否清本地壁纸/handle，不清错误profile数据。

可证伪方向是提供基于真实页面的可读性/性能预设和安全回退，分开视觉启用与设置已持久、背景媒体可用状态。当前效果撤销与存储降级是起点，增量应测不同字体缩放、深浅背景、减少动态效果和低GPU下的文本识别、误点/帧时与恢复；对照原生/当前/预设，若无改善或主题维护成本超过个人化价值则停止。没有测试不能声称无障碍合格或提高工作效率，假设未实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:5-7](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/README.zh.md#L5-L7)

兼容维护限制。

```text
# 注意⚠️⚠️⚠️（务必仔细阅读）：随着DSH版本更新，本人因学业繁忙无法及时为该插件适配新的API，请自行使用其他agent更换或修理，以免在安装该插件时出现崩溃问题

Aqua 是一层高自由度的玻璃质感主题，套在 DeepSeek Harness 网页端。顶栏、侧边栏、输入框、统计行、轨迹视图都成了磨砂玻璃片,你还可以添加视频和图片作为背景。关掉开关就回到原生界面，不改 DSH 任何一行源码。
```

**依据 2 · 源码核查**：[src/client/theme-layer.ts:934-950](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L934-L950)

实际视觉层机制。

<details>
<summary>查看原文（17行）</summary>

```text
  /** Apply the mode's token layer (floating palette, or translucent compat). */
  private applyTokens(): void {
    this.tokenDisposer?.()
    this.tokenDisposer = this.ctx.theme.overrideTokens(
      OVERRIDE_SOURCE,
      this.settings.mode === 'compat' ? COMPAT_TOKEN_OVERRIDES : AQUA_TOKEN_OVERRIDES,
    )
  }

  private mount(): void {
    document.documentElement.setAttribute(AQUA_ATTRIBUTE, '')
    ensureAmbientScene()
    ensurePageFades()
    this.applySettings()
    this.applyTokens()
    this.mountFluid()
    this.startSeamStamper()
```

</details>

**依据 3 · 源码核查**：[src/client/theme-layer.ts:982-1007](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L982-L1007)

可恢复生命周期依据。

<details>
<summary>查看原文（26行）</summary>

```text
  private unmount(): void {
    document.documentElement.removeAttribute(AQUA_ATTRIBUTE)
    document.documentElement.removeAttribute('data-dsh-float')
    document.documentElement.removeAttribute('data-dsh-compat')
    document.documentElement.removeAttribute('data-dsh-aqua-wallpaper')
    document.documentElement.removeAttribute('data-dsh-aqua-media')
    document.documentElement.removeAttribute(SPOTLIGHT_ATTRIBUTE)
    document.documentElement.removeAttribute(PRESS_ATTRIBUTE)
    this.spotlightDisposer?.()
    this.spotlightDisposer = undefined
    this.whaleHandle?.dispose()
    this.whaleHandle = undefined
    this.meshHandle?.dispose()
    this.meshHandle = undefined
    this.tokenDisposer?.()
    this.tokenDisposer = undefined
    if (this.videoObjectUrl !== undefined) {
      URL.revokeObjectURL(this.videoObjectUrl)
      this.videoObjectUrl = undefined
      this.videoBlobId = undefined
    }
    this.teardownFluid()
    removeAmbientScene()
    removePageFades()
    this.seamDisposer?.()
    this.seamDisposer = undefined
```

</details>

**依据 4 · 源码核查**：[src/client/theme-layer.ts:208-214](https://github.com/WYH66666666/DSH-Transparent-UI-Plugin/blob/d94431a95bd147c11ef3fe95fa1915d1e96b028b/src/client/theme-layer.ts#L208-L214)

持久/内存区别。

```text
/** Persist the enable flag (storage failures keep the in-memory state). */
function writeEnabled(value: boolean): void {
  try {
    localStorage.setItem(AQUA_ENABLED_KEY, String(value))
  } catch {
    /* in-memory state still applies for this tab */
  }
```

#### 缺口

- 没有视觉、无障碍、性能或恢复对照，也没有需求强度证据。
  **影响**：不从主题源码或作者截图推导当前宿主安装兼容、视觉可读性和恢复成功。
  **进一步探讨**：在已确认交付的独立profile逐页检验阅读/输入/设置与低性能回退，再决定是否持续使用。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
