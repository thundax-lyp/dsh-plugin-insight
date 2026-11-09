# Bloom for DSH

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[4070f9d](https://github.com/webkubor/dsh-bloom-theme/tree/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f)

<!-- BEGIN META -->
[![GitHub ★ 126](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=126&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/webkubor/dsh-bloom-theme) [![npm 30d 10,188](https://img.shields.io/static/v1?label=npm+30d&message=10%2C188&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bloom-theme) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-bloom-theme)
<!-- END META -->

> **功能**：用 DSH 顶栏选择色板、明暗和玻璃样式的 Web 客户端主题插件，提供宿主版本探测。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 确认顶栏色板、材质与宿主明暗路径可从同一会话触达，带来额外外观控制。

> **主要限制**：[Q03](#research-q03) 色板对比度仅检查原始配对。半透明效果、宿主选择器与焦点需要实际界面复查，停用后也可能要恢复宿主明暗偏好。

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
  - [Q01 · 相对内置明暗模式增加哪些可辨识设置？](#detail-section-11)
  - [Q02 · 主题如何从选项进入页面？](#detail-section-12)
  - [Q03 · 浏览器存储或宿主变化时会怎样？](#detail-section-13)
  - [Q04 · 谁适合试用，如何恢复原外观？](#detail-section-14)
  - [Q05 · 固定界面对照能否验证辨识收益？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：每天使用 DSH Web 的用户，希望在长会话中分辨正文、状态与操作，同时保留原生明暗设置的退路。

使用 DSH 内置明暗模式，保留原生状态色、布局及焦点样式。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：顶栏主题切换与客户端样式
- **Host 路由**：只读宿主版本探测

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| manifest 声明 DSH 0.2.2-rc.1 及以上 | 启动条件 | 装载 bundle 和浏览器模块 | 实际兼容需按 Host 版本核对 |
| Web 插槽与对应浏览器接口 | 主题入口必需 | 顶栏与样式注入 | 控件或样式可能缺失 |
| Host theme 服务 | 可选 | 使用宿主明暗偏好 | 依本地属性与存储条件退回旧路径 |
| 浏览器本地存储 | 持久化需要 | 保存色板和部分偏好 | 切换可只在本页生效 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户记下原生明暗，选择测试 profile | 有可回到的基线 |
| 加载 | Host 启用插件，用户打开顶栏按钮 | 色板选择和页面状态同步 |
| 验收 | 用户核对正文、错误色、按钮及焦点 | 出现退化即停用或恢复原样 |
| 退出 | 用户停用并刷新，必要时恢复宿主偏好 | 插件标记和控件清除，外观可读 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 兼容 DSH Web、测试 profile | 选择色板并检查焦点和关键按钮 | 耗时及浏览器适配未知 |
| 持续使用 | CSS 合成与动效资源、浏览器偏好存储 | 宿主升级后重新核对状态与显示 | 性能、频率及人时未测 |
| 失败恢复 | 原生主题与备份偏好 | 停用、重载和手工恢复原明暗 | 清理完整性与恢复时长未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 外观选择 | 固定源码有顶栏切换及主题标记 | 真实宿主上所有控件的表现 |
| 可读性 | 主色和底色的对比配置与部分适配规则 | 合成效果、焦点和长会话可读性 |
| 退出 | 已注册停用清理，宿主明暗由独立路径处理 | 各浏览器退出后的残留和恢复负担 |

> **思考**：[Q03](#research-q03) 色板对比度仅检查原始配对。半透明效果、宿主选择器与焦点需要实际界面复查，停用后也可能要恢复宿主明暗偏好。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 确认顶栏色板、材质与宿主明暗路径可从同一会话触达，带来额外外观控制。

按生命周期清理插件样式和监听，同时把宿主偏好与浏览器色板分开。原始色板配对与浏览器合成后的界面需要分别观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 色板对比度仅检查原始配对。半透明效果、宿主选择器与焦点需要实际界面复查，停用后也可能要恢复宿主明暗偏好。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 日常使用 DSH Web 的用户可在测试 profile 先试一种实色并核对正文、状态和键盘焦点。[Q03](#research-q03) 发生显示或焦点退化时先停用、刷新，再从宿主恢复原明暗。[Q04](#research-q04) 如不需要按钮使用统计，可在面板关闭并核对重载后的开关。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认主题安装和清理路径、宿主明暗接线及对比度配置范围。未运行宿主、界面矩阵或性能测试。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/client.ts、src/index.ts、src/dom.ts、src/switcher.ts、src/appearance.ts、src/teardown.ts、contrast.config.json、src/css/surfaces.ts、src/track.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 主题包、主题应用与清理、对比度配置及相关按钮事件。分享、自动更新、全部动效和外部服务不作完整审计。
- 下一步：仅固定源码。下一步在同一 Web profile 比较原生、实色和玻璃下的相同错误、代码、发送按钮和键盘焦点，切换明暗并停用复查，记录渲染和退出结果。

**分析版本**

- **仓库**：[webkubor/dsh-bloom-theme](https://github.com/webkubor/dsh-bloom-theme)
- **版本号**：0.27.0（[固定提交 4070f9d](https://github.com/webkubor/dsh-bloom-theme/tree/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f)）
- **版本日期**：2026-11-08（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用同一页面比较宿主样式、实色和玻璃模式，按状态和操作测量差异，可验证主题在具体条件下的辨识收益。

仅固定源码。下一步在同一 Web profile 比较原生、实色和玻璃下的相同错误、代码、发送按钮和键盘焦点，切换明暗并停用复查，记录渲染和退出结果。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 17 | 2456 | — | — | 33282 |
| .js | source | 14 | 9318 | 7679 | 1495 | — |
| .mjs | source | 16 | 2358 | 1551 | 668 | — |
| .mjs | test | 36 | 5372 | 4729 | 343 | — |
| .ts | source | 33 | 8364 | 6133 | 1878 | — |
| .mjs | example | 1 | 28 | 27 | 1 | — |

</details>

**活跃度**

[![Issue 未关闭 6](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=6&color=737b86&logo=github)](https://github.com/webkubor/dsh-bloom-theme/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 19](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=19&color=737b86&logo=github)](https://github.com/webkubor/dsh-bloom-theme/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/webkubor/dsh-bloom-theme/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断常用 DSH 的用户能否用可退出的 Web 客户端主题改善工作界面辨识，明确宿主升级、持久化与可读性边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对内置明暗模式增加哪些可辨识设置？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

长期看 DSH 会话的用户可从顶栏选择主题色板和材质，宿主原有明暗选择之外又多了风格控制。README 声明 15 套配色和三类玻璃质感。包的 DSH 组合和客户端注入成立，Host 侧还实际注册只读版本接口。界面入口由插槽注册。可辨识的合格结果是能读状态和正文、能通过键盘找到控件并顺利回到原外观。色板数量与美观偏好不能替代界面任务验证。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:30-38](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/README.md#L30-L38)

作者的色板、材质与可读性主张

```text
### 为什么选择 Bloom？

| 15 套配色 · 12 套精选 | ≥ 4.5:1 | 0 个运行时依赖 |
| :-- | :-- | :-- |
| 朱砂、青莲、黛蓝……低饱和中国风配色，明暗各有一套 | 15 套配色的明暗主色与底色，共 30 组对比度均 ≥ 4.5:1 | 无额外运行时依赖，顶栏一键切换 |

- **颜色既耐看，也清楚。** 用 OKLCH 调色，把文字和按钮的可读颜色与大面积氛围色分开；换色时，面板、输入区和背景一起变化。
- **玻璃和背景，自由搭配。** 液态、磨砂、毛玻璃三种材质；浅色水彩与深色背景分别记忆。夜晚打开「漫天星辰」，星辉与流星跟随主题色变化。
- **细节不打扰工作。** 输入和思考时有轻柔的主题色动效；系统启用减少动态效果时，支持相应的静态处理。
```

**依据 2 · 源码核查**：[package.json:23-34](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/package.json#L23-L34)

DSH bundle 和 Web 客户端注入

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web",
      "immediately": true
    }
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:7-10](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/cordis.patch.yml#L7-L10)

Cordis 组合真实装载

```text
# 本插件是纯客户端主题：不禁用任何官方插件，只把自己插进去。
- insert:
    - id: bloom-theme
      name: "dsh-bloom-theme"
```

**依据 4 · 源码核查**：[src/client.ts:634-642](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/client.ts#L634-L642)

顶栏和 overlay 插槽

```text
      ctx.effect(() => installSkin(), 'dsh-bloom-theme: skin')
      bindBloomInspect(ctx)
      ctx.slots.inject('conversation.header.leading', () => ctx.slots.register({
        name: 'conversation.header.leading',
      }, Switcher))
      ctx.slots.inject('shell.overlay', () => ctx.slots.register({
        name: 'shell.overlay', id: 'dsh-bloom-theme.decorations', order: -100,
      }, Decorations))
      ctx.effect?.(() => initTypingGlow(), 'dsh-bloom-theme: typing glow')
```

**依据 5 · 源码核查**：[src/index.ts:112-140](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/index.ts#L112-L140)

服务端注册版本只读接口

<details>
<summary>查看原文（29行）</summary>

```text
function apply(ctx: BloomCtx) {
  ctx.effect?.(() => ctx.webServer?.register({
    kind: 'exact',
    path: DSH_VERSION_PATH,
    handler: (request, response) => {
      if (request.method !== 'GET' && request.method !== 'HEAD') {
        response.writeHead(405, { allow: 'GET, HEAD' })
        response.end()
        return
      }
      const detected = detectPlatform()
      const result = readDshVersion(detected)
      // 形态未知时**不下发** platform：浏览器侧还能用桌面桥兜底。
      // 下发一个错的 'web' 反而会把桌面端标成 Web（Codex PR #72 P2）。
      const platform = detected.platform === 'unknown' ? {} : { platform: detected.platform }
      const body = JSON.stringify(
        result.version !== undefined
          ? { ok: true as const, version: result.version, ...platform }
          : { ok: false as const, reason: result.error ?? 'unknown', ...platform }
      )
      response.writeHead(200, { 'content-type': 'application/json; charset=utf-8' })
      response.end(body)
    }
  }, 'dsh-bloom-theme: dsh version route'))
}

export const inject = ['webServer']

export { apply, name }
```

</details>

#### 缺口

- 没有同任务用户辨识与可用性对照。
  **影响**：无法判断个性化是否减少实际阅读摩擦。
  **进一步探讨**：用同一会话测查找错误状态、代码和发送键。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 主题如何从选项进入页面？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端通过 Host 模块入口装载，安装皮肤时读浏览器保存的变体并注入带标识的样式表，再把色板落到 body 数据属性。顶栏选择写回该属性及本地存储，标签和选中状态同步。明暗偏好有独立路径，宿主 theme 服务可用时调用其 setTheme，无服务或调用失败时走旧的 body 属性与本地记录。旧路径在启动时如已检测到宿主标记会跳过初始写入，具体主题所有权取决于宿主服务和标记。

#### 证据与依据

**依据 1 · 源码核查**：[src/client.ts:605-619](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/client.ts#L605-L619)

Host 浏览器模块入口及可选服务绑定

<details>
<summary>查看原文（15行）</summary>

```text
window.__ModuleLoader__.load({
  id: PLUGIN_ID,
  factory: (require: (name: string) => unknown) => {
    const React = require('react') as HostReact
    const { Switcher, Decorations } = createBloomComponents(React, installUpdateCheck)
    const exports: Record<string, unknown> = {}
    Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' })
    exports.inject = ['slots']
    exports.apply = function apply(ctx) {
      if (typeof document === 'undefined') return
      // 语言是体系配置，走 DSH 的 locale 服务 —— 必须在任何 tr() 渲染之前接上。
      bindLocaleToHost(ctx)
      // 深浅状态交给 DSH 的 theme 服务持有，面板只做入口。
      bindThemeToHost(ctx)
      // 接上宿主的插件管理服务：横幅据此提供「应用内一键更新」。
```

</details>

**依据 2 · 源码核查**：[src/client.ts:87-113](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/client.ts#L87-L113)

主题样式注入、生命周期与撤销接线

<details>
<summary>查看原文（27行）</summary>

```text
function installSkin(): () => void {
  let disposed = false
  const controller = new AbortController()
  const boot = () => {
    if (disposed) return
    const variant = readVariant()
    injectCSS(buildBloomCSS(), 'bloom.css')
    injectCSS(COMPONENT_CSS, 'components.css')
    injectCSS(GLASS_CSS + BACKGROUND_CSS + BUTTON_CSS, 'glass.css')
    injectCSS(ADAPTIVE_CSS + SURFACES_CSS, 'adaptive.css')
    document.body.dataset.bloomVariant = variant
    initAppearanceSync()
    initAmbience()
    window.__dshBloomGlassOff__ ??= initGlassMode()
    setVersionUpdatesActive(true)
    void checkUpdate(controller.signal)
    watchThinkTags()
    watchCursorGlow()
    window.__BLOOM_DEBUG__ = { dump: collectDiagnostics, copy: () => copyDiagnostics() }
  }
  if (document.body) boot()
  else document.addEventListener('DOMContentLoaded', boot, { once: true })
  return () => {
    disposed = true
    controller.abort()
    document.removeEventListener('DOMContentLoaded', boot)
    teardownBloom()
```

</details>

**依据 3 · 源码核查**：[src/dom.ts:127-142](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/dom.ts#L127-L142)

色板读取、默认回退和样式标签

<details>
<summary>查看原文（16行）</summary>

```text
export function readVariant() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return VARIANTS.includes(v) ? v : 'mist'
  } catch { return 'mist' }
}

export function injectCSS(css, idSuffix) {
  const tagId = PLUGIN_ID + '/' + idSuffix
  if (document.querySelector<HTMLElement>('style[data-plugin-css="' + tagId + '"]')) return
  const tag = document.createElement('style')
  tag.dataset.plugin = PLUGIN_ID
  tag.dataset.pluginCss = tagId
  tag.textContent = css
  document.head.appendChild(tag)
}
```

</details>

**依据 4 · 源码核查**：[src/switcher.ts:73-93](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/switcher.ts#L73-L93)

切换色板及浏览器持久化

<details>
<summary>查看原文（21行）</summary>

```text
export function applyVariant(variant) {
  if (!VARIANTS.includes(variant)) variant = 'mist'
  // 应用变体本身的所有副作用（写 body 属性 / 同步下拉胶囊 / 写 localStorage）。
  // 拆出来单独跑，让 View Transition 在它前后各捕一帧：CSS 变量整体替换的
  // 「瞬切」变成整页 cross-fade，让颜色"流过去"。动画时长 / 缓动由
  // css/component.ts 的 ::view-transition-* 控制（320ms）。
  const apply = () => {
    document.body.dataset.bloomVariant = variant
    try { window.localStorage.setItem(STORAGE_KEY, variant) } catch {}
    resetRotationTimer()
    const root = document.querySelector<HTMLElement>('.dsh-bloom-switcher')
    if (!root) return
    root.querySelectorAll<HTMLElement>('.dsh-bloom-option').forEach((el) => {
      const on = el.dataset.variant === variant
      el.setAttribute('data-active', String(on))
      el.setAttribute('aria-selected', String(on))
    })
    const name = root.querySelector<HTMLElement>('.dsh-bloom-trigger__name')
    if (name) name.textContent = variantName(variant)
    const dot = root.querySelector<HTMLElement>('.dsh-bloom-trigger .dsh-bloom-dot')
    if (dot) dot.setAttribute('style', dotStyle(variant))
```

</details>

**依据 5 · 源码核查**：[src/appearance.ts:131-177](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/appearance.ts#L131-L177)

宿主明暗写入、异常回退和系统监听

<details>
<summary>查看原文（47行）</summary>

```text
export function setMode(mode: AppearanceMode): void {
  if (hasHostTheme()) {
    try {
      hostTheme?.setTheme?.(mode)
      return
    } catch {
      // 宿主 setTheme 失败（老版本签名不同）：落到旧路径，别让切换变成死键。
    }
  }
  applyModeLegacy(mode)
  try { localStorage.setItem(LEGACY_MODE_KEY, mode) } catch {}
}

let legacyMq: MediaQueryList | null = null
let legacyMqHandler: (() => void) | null = null

export function clearAppearanceSync(): void {
  if (legacyMq && legacyMqHandler) {
    legacyMq.removeEventListener('change', legacyMqHandler)
    legacyMq = null
    legacyMqHandler = null
  }
}

/**
 * 启动时对齐深浅状态。
 *
 * 有宿主服务时**什么都不用做** —— 宿主在插件之前就 boot 完了，属性早就是对的。
 * 这里只做一件防御性的事：万一快照还没到（例如插件先于 ui-layout materialize），
 * 就按宿主的当前偏好补一次，让首屏不闪。
 *
 * 没有宿主服务时，走旧路径：重放本地档位，并在「跟随系统」下监听 OS 偏好变化。
 */
export function initAppearanceSync(): void {
  if (hasHostTheme()) {
    clearAppearanceSync()
    syncHostScheme()
    return
  }
  clearAppearanceSync()
  if (hostBootOwnsScheme()) return
  applyModeLegacy(readLegacyMode())
  legacyMq = window.matchMedia('(prefers-color-scheme: dark)')
  legacyMqHandler = () => {
    if (readLegacyMode() === 'system') applyModeLegacy('system')
  }
  legacyMq.addEventListener('change', legacyMqHandler)
```

</details>

#### 缺口

- 尚无不同 DSH 版本和浏览器的冷启动切换矩阵。
  **影响**：无法确认主题插件与宿主选择在所有设备同步。
  **进一步探讨**：固定一个 profile，分别在宿主服务正常、缺失和抛错时切换再刷新。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 浏览器存储或宿主变化时会怎样？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

色板读不到时回到 mist，当前页面仍可切换，写失败被吞掉，因此重载可丢选择。清理入口移除插件样式、标记、监听和节点，但不会清除本地色板或恢复经 Host 修改的明暗偏好。旧明暗回退直接写 `data-ds-dark-theme`，清理只卸监听和插件属性，此路径也可能留属性。皮肤选择器有宿主 class 片段依赖，升级可影响布局。对比度配置仅检查色板的主色与底色，样式还叠加透明背景和滤镜，因此应在实际状态和背景上验证文字、焦点、操作控件。

#### 证据与依据

**依据 1 · 源码核查**：[src/dom.ts:127-132](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/dom.ts#L127-L132)

存储读取失败回退

```text
export function readVariant() {
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return VARIANTS.includes(v) ? v : 'mist'
  } catch { return 'mist' }
}
```

**依据 2 · 源码核查**：[src/switcher.ts:73-83](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/switcher.ts#L73-L83)

选择状态和存储写失败分离

<details>
<summary>查看原文（11行）</summary>

```text
export function applyVariant(variant) {
  if (!VARIANTS.includes(variant)) variant = 'mist'
  // 应用变体本身的所有副作用（写 body 属性 / 同步下拉胶囊 / 写 localStorage）。
  // 拆出来单独跑，让 View Transition 在它前后各捕一帧：CSS 变量整体替换的
  // 「瞬切」变成整页 cross-fade，让颜色"流过去"。动画时长 / 缓动由
  // css/component.ts 的 ::view-transition-* 控制（320ms）。
  const apply = () => {
    document.body.dataset.bloomVariant = variant
    try { window.localStorage.setItem(STORAGE_KEY, variant) } catch {}
    resetRotationTimer()
    const root = document.querySelector<HTMLElement>('.dsh-bloom-switcher')
```

</details>

**依据 3 · 源码核查**：[src/teardown.ts:18-46](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/teardown.ts#L18-L46)

插件清理范围

<details>
<summary>查看原文（29行）</summary>

```text
/** Bloom 写在 body / 消息节点上的 data-* 属性。 */
const BODY_ATTRS = ['data-bloom-variant', 'data-bloom-glass', 'data-bloom-ambience-dark', 'data-bloom-ambience-light', 'data-bloom-typing', 'data-bloom-update']
const NODE_ATTRS = ['data-bloom-think', 'data-bloom-think-body', 'data-bloom-live-turn']

export function teardownBloom(): void {
  if (typeof document === 'undefined') return
  setVersionUpdatesActive(false)
  cleanupSwitcher()
  clearAppearanceSync()

  window.__dshBloomThinkOff__?.()
  window.__dshBloomThinkObserver__?.disconnect()
  window.__dshBloomThinkObserver__ = undefined
  window.__dshBloomCursorOff__?.()
  window.__dshBloomGlassOff__?.()
  window.__dshBloomGlassOff__ = undefined
  stopRotation()
  delete window.__BLOOM_DEBUG__

  document.querySelectorAll(`style[data-plugin="${PLUGIN_ID}"]`).forEach((n) => n.remove())
  document.querySelectorAll('.dsh-bloom-switcher, #dsh-bloom-sparkles, #dsh-bloom-starlight, #dsh-bloom-update-banner')
    .forEach((n) => n.remove())

  const body = document.body
  if (body) for (const a of BODY_ATTRS) body.removeAttribute(a)
  for (const a of NODE_ATTRS) document.querySelectorAll(`[${a}]`).forEach((n) => n.removeAttribute(a))
  const root = document.documentElement
  root.style.removeProperty('--bloom-cursor-x')
  root.style.removeProperty('--bloom-cursor-y')
```

</details>

**依据 4 · 源码核查**：[src/appearance.ts:87-103](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/appearance.ts#L87-L103)

旧路径改明暗属性

<details>
<summary>查看原文（17行）</summary>

```text
function applyModeLegacy(mode: AppearanceMode): void {
  legacyOwnsScheme = true
  if (mode === 'system') {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    document.body.toggleAttribute('data-ds-dark-theme', prefersDark)
  } else {
    document.body.toggleAttribute('data-ds-dark-theme', mode === 'dark')
  }
}

/** 读旧宿主的本地档位；无存档或值非法回退 system。 */
function readLegacyMode(): AppearanceMode {
  try {
    const stored = localStorage.getItem(LEGACY_MODE_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {}
  return 'system'
```

</details>

**依据 5 · 源码核查**：[contrast.config.json:1-8](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/contrast.config.json#L1-L8)

检查只覆盖两类色板配对

```text
{
  "files": ["src/palette.ts"],
  "groups": true,
  "pairs": [
    { "fg": "accentL", "bg": "bgL", "min": 4.5, "label": "浅色主色" },
    { "fg": "accentD", "bg": "bgD", "min": 4.5, "label": "深色主色" }
  ]
}
```

**依据 6 · 源码核查**：[src/css/surfaces.ts:39-61](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/css/surfaces.ts#L39-L61)

透明背景和滤镜合成

<details>
<summary>查看原文（23行）</summary>

```text
${scope()} {
  position: relative;
  z-index: 0;
  background: transparent;
  background-image: none;
  border-color: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
${scope('::before')} {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border: 0;
  border-radius: inherit;
  background-color: var(--bloom-surface-fill);
  background-image: var(--bloom-surface-image);
  box-shadow: var(--bloom-surface-edge);
  backdrop-filter: var(--bloom-surface-filter);
  -webkit-backdrop-filter: var(--bloom-surface-filter);
```

</details>

**依据 7 · 源码核查**：[src/css/surfaces.ts:72-85](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/css/surfaces.ts#L72-L85)

宿主 class 与媒体查询边界

<details>
<summary>查看原文（14行）</summary>

```text
${ROOT} [class*="_composerSeat"] {
  border-right-color: transparent;
  border-left-color: transparent;
}
/* [LES-36] */
html body[data-bloom-variant][data-ds-dark-theme] [class*="_frame"]:not([data-sidebar-drawer]) [class*="_sidebarCol"] {
  background: transparent;
}
@media (prefers-reduced-transparency: reduce) {
  ${ROOT}:not([data-bloom-glass]) {
    --bloom-surface-filter: none;
    --bloom-surface-fill: var(--dsw-alias-bg-layer-1, #fff);
    --bloom-surface-image: none;
  }
```

</details>

#### 缺口

- 缺各宿主布局下合成色与键盘焦点的独立测量。
  **影响**：不能从色板门槛推出界面整体可访问性。
  **进一步探讨**：以同一文本和操作控件检查明暗、材质及键盘导航，再停用确认原外观。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 谁适合试用，如何恢复原外观？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

manifest 声明 DSH 0.2.2-rc.1 起的版本条件及 Web 插槽。适合对原主题辨识不满意且能在测试 profile 观察的用户。外观切换只需界面，但宿主升级后需重查插槽和控件。诊断等白名单按钮事件默认可发送项目、事件、版本和语言，浏览器本地保存 off，写失败时仅本次状态有效。若切换消失、控件不可读或焦点无法返回，停用插件并重载，必要时在原生设置恢复明暗偏好。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:6-8](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/package.json#L6-L8)

宿主声明版本下限

```text
  "engines": {
    "dsh": ">=0.2.2-rc.1"
  },
```

**依据 2 · 源码核查**：[package.json:23-34](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/package.json#L23-L34)

客户端注入条件

<details>
<summary>查看原文（12行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web",
      "immediately": true
    }
```

</details>

**依据 3 · 源码核查**：[src/track.ts:5-28](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/track.ts#L5-L28)

有限事件、默认开关与本地失效退路

<details>
<summary>查看原文（24行）</summary>

```text
const ENDPOINT = 'https://www.webkubor.online/api/event'
const OPT_OUT_KEY = 'bloom-telemetry'
const EVENTS = ['vote', 'feedback', 'share', 'changelog', 'version-open', 'diagnose'] as const
export type PanelEvent = typeof EVENTS[number]
let sessionEnabled: boolean | undefined

export function telemetryEnabled(): boolean {
  if (sessionEnabled !== undefined) return sessionEnabled
  try { return localStorage.getItem(OPT_OUT_KEY) !== 'off' } catch { return false }
}

/** In-memory preference takes effect even if storage is denied or full. */
export function setTelemetryEnabled(enabled: boolean): void {
  sessionEnabled = enabled
  try { localStorage.setItem(OPT_OUT_KEY, enabled ? 'on' : 'off') } catch { /* session choice survives */ }
}

export function track(event: PanelEvent): void {
  if (!(EVENTS as readonly string[]).includes(event) || !telemetryEnabled()) return
  try {
    const body = JSON.stringify({ project: 'bloom', event, params: { v: PLUGIN_VERSION, lang: getLang() } })
    // sendBeacon cannot specify credentials; keepalive fetch can.
    void fetch(ENDPOINT, { method: 'POST', body, keepalive: true, mode: 'no-cors', credentials: 'omit' }).catch(() => {})
  } catch { /* counters must never prevent a UI action */ }
```

</details>

**依据 4 · 源码核查**：[src/switcher.ts:576-589](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/switcher.ts#L576-L589)

开关和被跟踪动作实际接线

<details>
<summary>查看原文（14行）</summary>

```text
  el.addEventListener('change', (e) => {
    const control = (e.target as HTMLElement).closest<HTMLSelectElement>('.dsh-bloom-rotation__select')
    if (control) { setRotationMinutes(Number(control.value)); return }
    const box = (e.target as HTMLElement).closest<HTMLInputElement>('.dsh-bloom-telemetry__box')
    if (box) {
      setTelemetryEnabled(box.checked)
    }
  })

  el.addEventListener('click', (e) => {
    const target = e.target as HTMLElement
    // 埋点：链接用 data-track 声明；按钮在各自分支里打。sendBeacon 不阻塞跳转。
    const tracked = target.closest<HTMLElement>('[data-track]')
    if (tracked?.dataset.track) track(tracked.dataset.track as PanelEvent)
```

</details>

**依据 5 · 源码核查**：[src/teardown.ts:22-46](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/teardown.ts#L22-L46)

皮肤停用可执行清理

<details>
<summary>查看原文（25行）</summary>

```text
export function teardownBloom(): void {
  if (typeof document === 'undefined') return
  setVersionUpdatesActive(false)
  cleanupSwitcher()
  clearAppearanceSync()

  window.__dshBloomThinkOff__?.()
  window.__dshBloomThinkObserver__?.disconnect()
  window.__dshBloomThinkObserver__ = undefined
  window.__dshBloomCursorOff__?.()
  window.__dshBloomGlassOff__?.()
  window.__dshBloomGlassOff__ = undefined
  stopRotation()
  delete window.__BLOOM_DEBUG__

  document.querySelectorAll(`style[data-plugin="${PLUGIN_ID}"]`).forEach((n) => n.remove())
  document.querySelectorAll('.dsh-bloom-switcher, #dsh-bloom-sparkles, #dsh-bloom-starlight, #dsh-bloom-update-banner')
    .forEach((n) => n.remove())

  const body = document.body
  if (body) for (const a of BODY_ATTRS) body.removeAttribute(a)
  for (const a of NODE_ATTRS) document.querySelectorAll(`[${a}]`).forEach((n) => n.removeAttribute(a))
  const root = document.documentElement
  root.style.removeProperty('--bloom-cursor-x')
  root.style.removeProperty('--bloom-cursor-y')
```

</details>

#### 缺口

- 宿主停用事件和重载后的样式恢复未经观察。
  **影响**：现有代码只能核查清理意图与作用范围。
  **进一步探讨**：在测试 profile 比较停用、刷新和恢复宿主偏好后的页面。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 固定界面对照能否验证辨识收益？

**研究主题**：新假设与验证

#### 完整回答

在同一宿主、同一会话内容和窗口尺寸比较宿主原样、Bloom 实色和玻璃效果。至少测正文、错误、输入按钮和键盘焦点的可读性，记录阅读错误、完成时间、合成颜色及停用后有无残留。在系统明暗和减少透明度模式各重做一次。若使用者未更容易辨识，或关键控件退化，则不能支持该条件下改善辨识的假设。

#### 证据与依据

**依据 1 · 源码核查**：[contrast.config.json:1-8](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/contrast.config.json#L1-L8)

静态配色对照的起点

```text
{
  "files": ["src/palette.ts"],
  "groups": true,
  "pairs": [
    { "fg": "accentL", "bg": "bgL", "min": 4.5, "label": "浅色主色" },
    { "fg": "accentD", "bg": "bgD", "min": 4.5, "label": "深色主色" }
  ]
}
```

**依据 2 · 源码核查**：[src/css/surfaces.ts:39-61](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/css/surfaces.ts#L39-L61)

合成表面的变量

<details>
<summary>查看原文（23行）</summary>

```text
${scope()} {
  position: relative;
  z-index: 0;
  background: transparent;
  background-image: none;
  border-color: transparent;
  box-shadow: none;
  backdrop-filter: none;
  -webkit-backdrop-filter: none;
}
${scope('::before')} {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  pointer-events: none;
  border: 0;
  border-radius: inherit;
  background-color: var(--bloom-surface-fill);
  background-image: var(--bloom-surface-image);
  box-shadow: var(--bloom-surface-edge);
  backdrop-filter: var(--bloom-surface-filter);
  -webkit-backdrop-filter: var(--bloom-surface-filter);
```

</details>

**依据 3 · 源码核查**：[src/css/surfaces.ts:77-85](https://github.com/webkubor/dsh-bloom-theme/blob/4070f9d6fba8ef579e8d7faa73dde90da4cbec8f/src/css/surfaces.ts#L77-L85)

减少透明度分支

```text
html body[data-bloom-variant][data-ds-dark-theme] [class*="_frame"]:not([data-sidebar-drawer]) [class*="_sidebarCol"] {
  background: transparent;
}
@media (prefers-reduced-transparency: reduce) {
  ${ROOT}:not([data-bloom-glass]) {
    --bloom-surface-filter: none;
    --bloom-surface-fill: var(--dsw-alias-bg-layer-1, #fff);
    --bloom-surface-image: none;
  }
```

#### 缺口

- 当前没有对照测量。
  **影响**：不能量化阅读或键盘导航收益。
  **进一步探讨**：固定一份含错误与代码的测试会话，先比较原生与一种实色模式。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
