# DSH QQ2006 皮肤

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[ddde58e](https://github.com/LaplaceYoung/dsh-qq2006/tree/ddde58e2cb8d1ff62543cc195f58a507605b7845)

<!-- BEGIN META -->
[![GitHub ★ 32](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=32&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LaplaceYoung/dsh-qq2006)
<!-- END META -->

> **功能**：为 DSH Web 添加可切换的 QQ2006 视觉主题；npm 发行包只覆盖 shell 级换肤，组件级复刻需源码 monorepo 补丁。

> **亮点**：通过可切换 token/CSS 提供 shell 视觉层；npm 包不含组件级复刻。[Q01](#research-q01)

> **主要限制**：皮肤开关与卸载的撤销路径不同。旧接口只在切回设置时显式尝试还原上次主题，直接卸载只做注销。组件级复刻另随宿主构建，视觉覆盖和兼容风险都需核验。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · QQ2006 皮肤服务什么审美场景，相比 DSH 原生主题增加了什么？](#detail-section-11)
  - [Q02 · 设置开关怎样同步主题偏好并将样式限制在皮肤开启状态？](#detail-section-12)
  - [Q03 · 发行版限制、素材来源及宿主兼容对采用造成什么影响？](#detail-section-13)
  - [Q04 · 包边界和实现维护成本是否支持长期复用？](#detail-section-14)
  - [Q05 · 最小可验证的采用假设是什么，适合怎样试用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：想为 DSH Web 加复古 QQ2006 壳层的个人用户；npm 版能力有限，完整复刻需 fork。[Q01](#research-q01)

使用 DSH 原生 light/dark/system，或自行修改宿主 UI 源码。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件 |
| --- | --- | --- |
| 壳层换肤 | 切换色彩与皮肤样式 | 依赖宿主客户端主题和样式选择器 |
| 状态设置 | 就绪时同步宿主设置 | 否则使用浏览器本地存储，需核对重载 |

**流程与依赖**

| 依赖 | 作用与失败边界 |
| --- | --- |
| DSH Web 和 Cordis | 加载客户端模块，受宿主主题插槽代际约束 |
| 宿主主题与设置 | 主题 API 不可用会影响 token，设置可走本地存储 |
| 源码构建 | 完整复刻才需要维护宿主改动 |

| 阶段 | 操作及核对 |
| --- | --- |
| 加载 | 在测试 profile 记录当前主题和视口 |
| 使用 | 启用后看标题栏、侧栏和输入区是否符合壳层预期 |
| 还原 | 先关闭确认原偏好，再卸载并检查 body 标记和样式 |

**效果与成本**

| 阶段 | 资源与人工投入 |
| --- | --- |
| 首次 | 测试主题接口和素材用途，耗时未测 |
| 持续 | 宿主升级后复核壳层和重载，不确定维护量 |
| 退出 | 设置关闭和卸载分别核对；另打补丁时需恢复对应构建 |

| 效果 | 固定源码支持 | 未验证 |
| --- | --- | --- |
| 壳层外观 | 绑定主题 token 与 body 标记 | 实际视觉覆盖 |
| 退出 | 普通关闭和组件卸载清理有独立逻辑 | 旧宿主主题是否保持与重载回归 |

> **思考**：皮肤开关与卸载的撤销路径不同。旧接口只在切回设置时显式尝试还原上次主题，直接卸载只做注销。组件级复刻另随宿主构建，视觉覆盖和兼容风险都需核验。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：通过可切换 token/CSS 提供 shell 视觉层；npm 包不含组件级复刻。[Q01](#research-q01)

实际客户端将宿主设置与主题运行时分开。新版用可释放 token 覆盖，旧版走主题 id 和偏好；二者承担不同退出检查。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

皮肤开关与卸载的撤销路径不同。旧接口只在切回设置时显式尝试还原上次主题，直接卸载只做注销。组件级复刻另随宿主构建，视觉覆盖和兼容风险都需核验。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

只在非生产 Web profile 查看壳层效果，记录原主题，然后用皮肤开关先恢复原设置，再卸载并重开一页确认。出现旧主题残留、设置不可恢复或超出素材用途时退出。[Q03](#research-q03) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持可切换主题开关与 shell 级样式入口。组件级 QQ2006 复刻仅适用于源码 monorepo 路径；未执行目标宿主视觉验收。

- 已检查：作者 README、包清单、源码路径 README.md、README.package.md、package.json、src/index.ts、src/client/index.ts、lib/client.js、cordis.patch.yml、src/invariant.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定插件组件源码、发布清单与 README；npm 构建产物作为实际客户端实现线索。未运行 DSH，也未审计 monorepo patch 全部差异。
- 下一步：对照原生 light、dark、system 与皮肤开启结果，在新旧接口分别验证先关再卸载、直接卸载和浏览器重载。

**分析版本**

- **仓库**：[LaplaceYoung/dsh-qq2006](https://github.com/LaplaceYoung/dsh-qq2006)
- **版本号**：0.1.2（[固定提交 ddde58e](https://github.com/LaplaceYoung/dsh-qq2006/tree/ddde58e2cb8d1ff62543cc195f58a507605b7845)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设官方 UI slots 可承载组件级主题，减少 fork 维护；对照版本升级成本与视觉覆盖验证。[Q05](#research-q05)

对照原生 light、dark、system 与皮肤开启结果，在新旧接口分别验证先关再卸载、直接卸载和浏览器重载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 4 | 517 | — | — | 6640 |
| .js | source | 7 | 920 | 780 | 120 | — |
| .mjs | source | 2 | 248 | 217 | 14 | — |
| .ts | source | 3 | 122 | 41 | 66 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/LaplaceYoung/dsh-qq2006/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用户能否仅通过插件稳定获得 QQ2006 视觉效果，同时保持默认皮肤无影响并理解发行版与源码版能力差异？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · QQ2006 皮肤服务什么审美场景，相比 DSH 原生主题增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

希望在 DSH Web 使用复古 QQ2006 外观的用户，可通过插件设置启用主题 token 和 shell 样式。作者列举标题栏、侧栏、输入区、设置窗、复古字体和控件；不过 npm 发行版缺少登录窗、好友面板、聊天窗口 chrome、列表消息和素材等组件级改造。完整效果需要单独的源码 monorepo fork/patch，不是 npm 插件装上即可得到。原生 light/dark/system 更轻且无需外部图像资产，适用于只需基础主题的用户。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:24-33](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L24-L33)

作者列出视觉目标、切换预设及交互效果。

<details>
<summary>查看原文（10行）</summary>

```text
## ✨ 特性

- **可切换皮肤**：设置 → 通用 → **QQ2006 皮肤**（当前 DSH 外观行仍是浅色 / 深色 / 跟随系统三个色块，插件自带开关）；偏好持久化，刷新/重启保持；随时切回默认皮肤，**零污染契约**（所有补丁锚定 `body[data-ds-skin='qq2006']`）
- **QQ2006 登录窗**：九宫格窗口框、三态按钮、记住密码/自动登录联动、连接中动态点动画
- **主面板**：用户头部（50×50 蓝描边头像 + 6 个 mini 钮）、面板栏 10 钮（27×37 原版底条格）、分组/好友行（原版行高与 hover）、右键菜单
- **聊天窗口**：标题栏 4 钮（含 65×24 原版"菜单"文字钮）、大工具栏 12 钮、小工具栏 8 钮（全部原版素材、原生尺寸）
- **原版消息形式**：列表式消息（自己绿色昵称 / 对方深蓝紫昵称 + HH:MM:SS 时间 + 黑色正文），宋体渲染
- **QQ 秀右侧栏**：对方形象 / 个人空间（真实会话统计）/ 我的形象，默认展开
- **换肤 4 预设**：经典蓝 / 粉红 / 薄荷绿 / 紫罗兰，窗口内实时切换
- **真实交互**：Alt+S 发送、右键复制、hover 操作行（复制/引用/转发）、提示音、QQ 黄色反馈 tip
```

</details>

**依据 2 · 作者声明**：[README.md:42-59](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L42-L59)

npm 安装产生的能力和组件级能力限制。

<details>
<summary>查看原文（18行）</summary>

````text
### 方式一：npm 发行版（dsh plugin 安装）

仓库已包含预构建产物（`lib/`），发行版用户可直接从 GitHub 安装：

```sh
dsh plugin --profile web add https://github.com/LaplaceYoung/dsh-qq2006
```

安装后**重启 `dsh web`**，然后：

1. 打开 **设置 → 通用**
2. 找到 **QQ2006 皮肤**，点 **开启**

DSH 0.1.0-rc.7+ 还会在 **设置 → 插件 → 插件配置** 里出现同名卡片。当前上游外观行（到 `dsh-v0.1.2-alpha.1`）仍然只渲染浅色 / 深色 / 跟随系统，**不会出现第 4 个色块**——这是上游硬编码，不是安装失败。0.1.2 起开关文案走第三方 UI 语言注册（中 / 英）。

启用后获得：**可见的 QQ2006 壳层**（经典蓝标题栏、侧栏、输入区、设置窗）+ 珊瑚蓝 `--dsw-alias-*` / `--dsw-specific-*` token 叠加 + 插件注入的全局皮肤表（复古字体、滚动条、九宫格工具类、`.qq-btn` 三态钮）。

> 能力边界：组件级皮肤（登录窗、面板栏、聊天窗 chrome、列表式消息、QQ 秀右栏）改的是宿主 UI 包的源码，npm 发行版是预构建产物，无法通过插件机制注入。这些效果需要方式二。
````

</details>

**依据 3 · 作者声明**：[README.md:78-87](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L78-L87)

对比 npm 发行版与源码 monorepo 的功能范围。

<details>
<summary>查看原文（10行）</summary>

```text
| 能力 | npm 发行版（方式一） | 源码 monorepo（方式二） |
|---|---|---|
| 设置里的 QQ2006 皮肤开关 | ✅ | ✅ |
| 珊瑚蓝 token 换肤 | ✅ | ✅ |
| 全局皮肤表（字体/滚动条/九宫格类） | ✅ | ✅ |
| 登录窗 / 主面板 / 聊天窗 chrome | ❌ | ✅ |
| 原版列表式消息 / QQ 秀右栏 / 消息操作 | ❌ | ✅ |
| 素材（按钮图标/头像/提示音） | ❌ | ✅ |

后续计划：待 DSH 官方提供客户端插件的静态资源与 UI 槽位机制后，把组件级皮肤完整迁入插件包，使发行版获得全部效果。
```

</details>

#### 缺口

- 没有在当前 DSH 版本安装包复测视觉覆盖范围。
  **影响**：无法确认当前宿主壳层选择器与样式呈现是否一致。
  **进一步探讨**：在干净 Web profile 启用/禁用插件，截取相同页面并检查默认主题差异。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 设置开关怎样同步主题偏好并将样式限制在皮肤开启状态？

**研究主题**：功能与机制

#### 完整回答

宿主尝试安装设置 namespace，客户端先从本地存储读取开关，再用就绪的设置 scope 更新状态。实际 lib/client.js 注入样式标签，按开关增删对应 body 标记。新主题接口通过 overrideTokens 返回的 disposer 一次次撤销覆盖，再在开关开启时装上新的 token；老接口会记住 getTheme 返回的旧偏好并调用 setTheme，关开关时尝试写回。主题 API 错误会被捕获，不能用开关可见来推断 token 已应用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:11-15](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/index.ts#L11-L15)

Host settings namespace 与插件 Cordis 名称。

```text
/** Settings namespace shared with the browser card (`settings.plugin.item` key). */
export const SETTINGS_NS = 'qq2006'

/** Cordis plugin name (matches the bundle patch id). */
export const name = 'ui-skin-qq2006'
```

**依据 2 · 源码核查**：[src/index.ts:29-46](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/index.ts#L29-L46)

可选设置服务，默认关闭；缺 peer 时不使 Host 崩溃。

<details>
<summary>查看原文（18行）</summary>

```text
export async function apply(ctx: Context, config: Partial<Qq2006Settings> = {}): Promise<void> {
  const base: Qq2006Settings = { enabled: config.enabled === true }
  try {
    const [{ installSettingsSection, settingsNamespace }, schemastery] = await Promise.all([
      import('@deepseek-ai/dsh-settings'),
      import('@deepseek-ai/schemastery'),
    ])
    const z = schemastery.default
    const Config = z.object({
      enabled: z.boolean().default(false),
    })
    installSettingsSection(ctx, settingsNamespace(SETTINGS_NS), Config, base, {
      setSource: () => {},
      onChange: () => {},
    })
  } catch {
    // Host without the settings peer: the client persists via localStorage.
  }
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:7-20](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/client/index.ts#L7-L20)

客户端注入 CSS、偏好存储、body 标记和 token API 的设计说明。

<details>
<summary>查看原文（14行）</summary>

```text
 * On current DSH (through 0.1.2-alpha.1) Appearance still hardcodes light /
 * dark / system, so this plugin owns its own enable path:
 *
 * 1. Inject `qq2006.css` for the plugin lifetime (npm installs never see
 *    the monorepo `base.css` import).
 * 2. Persist enablement in `dsh.qq2006.enabled` (and Host settings when the
 *    `qq2006` namespace is served).
 * 3. When on: set `body[data-ds-skin=qq2006]` and apply coral-blue tokens
 *    via `theme.overrideTokens` (rc.7+) or `theme.register` + `setTheme`
 *    (rc.5/rc.6). The injected sheet also restyles the live DSH 0.1.2
 *    shell (title bar, sidebar, composer, settings dialog).
 * 4. Register 设置 → 通用 → QQ2006 皮肤, plus 设置 → 插件 card on rc.7+.
 * 5. Register zh/en copy through `ctx.locale` (0.1.2 third-party UI language).
 */
```

</details>

**依据 4 · 源码核查**：[lib/client.js:135-155](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L135-L155)

本地存储读取并写回 enablement。

<details>
<summary>查看原文（21行）</summary>

```text
    const raw = localStorage.getItem(STORE_KEY)
    if (raw === '1' || raw === 'true') return true
    if (raw === '0' || raw === 'false') return false
    if (localStorage.getItem(LEGACY_THEME_KEY) === THEME_ID) return true
  } catch {
    // Privacy-mode storage failure: treat as off.
  }
  return false
}

function writeLocalEnabled(enabled) {
  try {
    localStorage.setItem(STORE_KEY, enabled ? '1' : '0')
  } catch {
    // Privacy-mode storage failure: in-memory state still works this session.
  }
}

function createEnabledStore() {
  let enabled = typeof localStorage === 'undefined' ? false : readLocalEnabled()
  let scope = null
```

</details>

**依据 5 · 源码核查**：[lib/client.js:209-240](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L209-L240)

启用时设置 body 属性并调用主题覆盖 API。

<details>
<summary>查看原文（32行）</summary>

```text
  if (enabled) document.body.setAttribute(SKIN_ATTRIBUTE, THEME_ID)
  else if (document.body.getAttribute(SKIN_ATTRIBUTE) === THEME_ID) {
    document.body.removeAttribute(SKIN_ATTRIBUTE)
  }
}

function ensureRegistered(theme) {
  if (!theme || typeof theme.register !== 'function') return () => {}
  try {
    return theme.register({
      id: THEME_ID,
      colorScheme: 'light',
      tokens: { ...QQ2006_TOKENS },
    })
  } catch {
    return () => {}
  }
}

function applyTokens(theme, enabled, state) {
  if (state.overrideDispose) {
    try { state.overrideDispose() } catch { /* already gone */ }
    state.overrideDispose = null
  }
  if (!theme) return
  if (enabled) {
    if (typeof theme.overrideTokens === 'function') {
      // DSH 0.1.0-rc.7+ / 0.1.1: overlay tokens on light/dark/system.
      // Do not setTheme('qq2006') — Appearance only persists the built-in trio.
      try {
        state.overrideDispose = theme.overrideTokens(OVERRIDE_SOURCE, toModes(QQ2006_TOKENS))
      } catch {
```

</details>

**依据 6 · 源码核查**：[lib/client.js:133-190](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L133-L190)

从本地存储起步，设置 ready 后映射其真值并订阅。

<details>
<summary>查看原文（58行）</summary>

```text
function readLocalEnabled() {
  try {
    const raw = localStorage.getItem(STORE_KEY)
    if (raw === '1' || raw === 'true') return true
    if (raw === '0' || raw === 'false') return false
    if (localStorage.getItem(LEGACY_THEME_KEY) === THEME_ID) return true
  } catch {
    // Privacy-mode storage failure: treat as off.
  }
  return false
}

function writeLocalEnabled(enabled) {
  try {
    localStorage.setItem(STORE_KEY, enabled ? '1' : '0')
  } catch {
    // Privacy-mode storage failure: in-memory state still works this session.
  }
}

function createEnabledStore() {
  let enabled = typeof localStorage === 'undefined' ? false : readLocalEnabled()
  let scope = null
  const listeners = new Set()
  const emit = () => {
    for (const fn of [...listeners]) fn()
  }
  const adoptScope = () => {
    if (!scope || typeof scope.getSnapshot !== 'function') return
    const snap = scope.getSnapshot()
    if (!snap || snap.status !== 'ready' || !snap.value || typeof snap.value !== 'object') return
    if (typeof snap.value.enabled !== 'boolean' || snap.value.enabled === enabled) return
    enabled = snap.value.enabled
    writeLocalEnabled(enabled)
    emit()
  }
  return {
    get: () => enabled,
    subscribe(fn) {
      listeners.add(fn)
      return () => { listeners.delete(fn) }
    },
    set(next) {
      if (enabled === next) return
      enabled = next
      writeLocalEnabled(next)
      if (scope && typeof scope.set === 'function') {
        try { void scope.set('enabled', next) } catch { /* revision conflict: local still wins this session */ }
      }
      emit()
    },
    attachScope(nextScope) {
      scope = nextScope
      adoptScope()
      if (scope && typeof scope.subscribe === 'function') {
        return scope.subscribe(() => { adoptScope() })
      }
      return () => {}
```

</details>

**依据 7 · 源码核查**：[lib/client.js:195-213](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L195-L213)

注入与卸载样式标签，开关只移除属于自己的 body 标记。

<details>
<summary>查看原文（19行）</summary>

```text
function installStyles(ctx) {
  if (typeof document === 'undefined') return
  ctx.effect(() => {
    const tag = document.createElement('style')
    tag.dataset.plugin = PACKAGE_ID
    tag.dataset.pluginCss = PACKAGE_ID + '/qq2006.css'
    tag.textContent = QQ2006_CSS + '\n' + SETTINGS_CSS
    document.head.appendChild(tag)
    return () => { tag.remove() }
  })
}

function syncSkinAttribute(enabled) {
  if (typeof document === 'undefined') return
  if (enabled) document.body.setAttribute(SKIN_ATTRIBUTE, THEME_ID)
  else if (document.body.getAttribute(SKIN_ATTRIBUTE) === THEME_ID) {
    document.body.removeAttribute(SKIN_ATTRIBUTE)
  }
}
```

</details>

**依据 8 · 源码核查**：[lib/client.js:228-261](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L228-L261)

新式 token disposer 与旧主题偏好恢复分别执行。

<details>
<summary>查看原文（34行）</summary>

```text
function applyTokens(theme, enabled, state) {
  if (state.overrideDispose) {
    try { state.overrideDispose() } catch { /* already gone */ }
    state.overrideDispose = null
  }
  if (!theme) return
  if (enabled) {
    if (typeof theme.overrideTokens === 'function') {
      // DSH 0.1.0-rc.7+ / 0.1.1: overlay tokens on light/dark/system.
      // Do not setTheme('qq2006') — Appearance only persists the built-in trio.
      try {
        state.overrideDispose = theme.overrideTokens(OVERRIDE_SOURCE, toModes(QQ2006_TOKENS))
      } catch {
        state.overrideDispose = null
      }
      return
    }
    // DSH 0.1.0-rc.5/rc.6: custom theme id + setTheme is the only write path.
    if (typeof theme.getTheme === 'function' && state.previousPreference == null) {
      try {
        const snap = theme.getTheme()
        if (snap && typeof snap.preference === 'string' && snap.preference !== THEME_ID) {
          state.previousPreference = snap.preference
        }
      } catch { /* ignore */ }
    }
    if (typeof theme.setTheme === 'function') {
      try { theme.setTheme(THEME_ID) } catch { /* unknown id on a host that rejected register */ }
    }
    return
  }
  if (typeof theme.overrideTokens !== 'function' && typeof theme.setTheme === 'function' && state.previousPreference) {
    try { theme.setTheme(state.previousPreference) } catch { /* ignore */ }
  }
```

</details>

#### 缺口

- 没有检查完整 CSS 选择器或跨版本宿主主题 service。
  **影响**：零污染契约尚未由本轮真实默认皮肤对照证明。
  **进一步探讨**：静态扫描所有选择器作用域，并在目标 DSH 版本开启、关闭、刷新和重启后比较主题 DOM/CSS。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 发行版限制、素材来源及宿主兼容对采用造成什么影响？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本

#### 完整回答

需要 DSH Web 的主题与设置接口代际、Cordis profile 插件加载以及包声明的 peer；README 特别指出当前 Appearance 行仍硬编码三个原生选项，因此插件需自带开关。组件级复刻需要 fork DSH monorepo 或应用 patch，成本远高于安装 npm 包。作者标注图像/声音来自腾讯 QQ2006 资源并提醒仅供学习、勿商用；这构成明确的商业使用边界。主体贡献偏视觉定制，不能宣称消息或聊天功能本身更强。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:50-59](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L50-L59)

安装需重启；宿主外观行仍是三项，且 npm 包不能注入组件级皮肤。

<details>
<summary>查看原文（10行）</summary>

```text
安装后**重启 `dsh web`**，然后：

1. 打开 **设置 → 通用**
2. 找到 **QQ2006 皮肤**，点 **开启**

DSH 0.1.0-rc.7+ 还会在 **设置 → 插件 → 插件配置** 里出现同名卡片。当前上游外观行（到 `dsh-v0.1.2-alpha.1`）仍然只渲染浅色 / 深色 / 跟随系统，**不会出现第 4 个色块**——这是上游硬编码，不是安装失败。0.1.2 起开关文案走第三方 UI 语言注册（中 / 英）。

启用后获得：**可见的 QQ2006 壳层**（经典蓝标题栏、侧栏、输入区、设置窗）+ 珊瑚蓝 `--dsw-alias-*` / `--dsw-specific-*` token 叠加 + 插件注入的全局皮肤表（复古字体、滚动条、九宫格工具类、`.qq-btn` 三态钮）。

> 能力边界：组件级皮肤（登录窗、面板栏、聊天窗 chrome、列表式消息、QQ 秀右栏）改的是宿主 UI 包的源码，npm 发行版是预构建产物，无法通过插件机制注入。这些效果需要方式二。
```

</details>

**依据 2 · 作者声明**：[README.md:61-87](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L61-L87)

完整效果需源码 fork/patch，且未来迁移 UI slot 是计划而非现有能力。

<details>
<summary>查看原文（27行）</summary>

````text
### 方式二：源码 monorepo（完整效果）

完整皮肤实现位于 fork 的 `skin/qq2006` 分支：

```sh
git clone https://github.com/LaplaceYoung/deepseek-harness.git
cd deepseek-harness
git checkout skin/qq2006
pnpm install
pnpm run build
node --import tsx/esm apps/cli/src/bin.ts web
```

打开 `http://127.0.0.1:3080` → 设置 → 外观 → **QQ2006 皮肤**。

已有 DSH 源码 checkout 的用户，也可以直接应用补丁文件：`git apply patches/qq2006-skin.patch`（基于上游 `deepseek-ai/deepseek-harness` master）。

| 能力 | npm 发行版（方式一） | 源码 monorepo（方式二） |
|---|---|---|
| 设置里的 QQ2006 皮肤开关 | ✅ | ✅ |
| 珊瑚蓝 token 换肤 | ✅ | ✅ |
| 全局皮肤表（字体/滚动条/九宫格类） | ✅ | ✅ |
| 登录窗 / 主面板 / 聊天窗 chrome | ❌ | ✅ |
| 原版列表式消息 / QQ 秀右栏 / 消息操作 | ❌ | ✅ |
| 素材（按钮图标/头像/提示音） | ❌ | ✅ |

后续计划：待 DSH 官方提供客户端插件的静态资源与 UI 槽位机制后，把组件级皮肤完整迁入插件包，使发行版获得全部效果。
````

</details>

**依据 3 · 作者声明**：[README.md:22-22](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L22-L22)

作者披露素材来源及非商业使用提醒。

```text
> ⚠️ 素材来自 [mengkunsoft/QQ2006](https://github.com/mengkunsoft/QQ2006)，为腾讯原版素材，**仅供学习交流、请勿商用**（出处见 `assets/qq2006/README.txt`）。
```

**依据 4 · 源码核查**：[package.json:28-37](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/package.json#L28-L37)

主题、settings、Cordis 等 peer 依赖范围。

<details>
<summary>查看原文（10行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1",
    "@deepseek-ai/dsh-client-ui-theme": ">=0.0.1",
    "@deepseek-ai/dsh-client-ui-slots": ">=0.0.1",
    "@deepseek-ai/dsh-client-locale": ">=0.0.1",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.0-rc.7",
    "@deepseek-ai/dsh-client-ui-settings-plugins": ">=0.1.0-rc.7",
    "@deepseek-ai/dsh-settings": ">=0.1.0-rc.7",
    "@deepseek-ai/schemastery": ">=3.16.0",
    "@deepseek-ai/dsh-invariants": ">=0.0.1-rc.1"
```

</details>

#### 缺口

- 没有法律审查或当前 DSH 版本兼容复测。
  **影响**：商用许可与宿主更新后的视觉兼容性仍是采用限制。
  **进一步探讨**：核对素材授权和目标宿主 peer/API，再决定仅个人学习试用或停止分发。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 包边界和实现维护成本是否支持长期复用？

**研究主题**：工程质量与复用

#### 完整回答

关开关、卸载插件和撤掉另行打的 monorepo 补丁是三条路径。普通关闭保留插件管理样式标签，撤销 token，移除皮肤 body 标记。卸载时 effect 销毁撤样式、退订、清 override 或注册并删标记，但该清理闭包没有调用旧接口的 setTheme(旧偏好)。如果用户仍开着皮肤而直接卸载，旧宿主选中主题会怎样取决于注销行为，本轮未运行。改过宿主私有组件的重建包还需恢复原构建。把视觉回归和卸载分开核验，不能从一个开关推断整套复刻已退出。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:65-86](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/package.json#L65-L86)

包发布客户端注入与产物文件范围。

<details>
<summary>查看原文（22行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-settings-plugins"
      ],
      "platform": "web"
    }
  },
  "files": [
    "lib",
    "assets/qq2006",
    "cordis.patch.yml",
    "dsh.plugin.json",
    "README.md",
    "LICENSE"
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:32-44](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/client/index.ts#L32-L44)

客户端声明 theme service 接线和已构建实现边界。

<details>
<summary>查看原文（13行）</summary>

```text
/** Required services: theme registry (overrideTokens or register/setTheme). */
export const inject = ['theme']

/** Coral-blue alias-token overrides (see `src/qq2006-tokens.json`). */
export const QQ2006_TOKENS: Readonly<Record<string, string>> = Object.freeze({})

/**
 * Client plugin body. Implementation is the published ModuleLoader factory.
 * @param ctx - client cordis context.
 */
export function apply(ctx: Context): void {
  void ctx
}
```

</details>

**依据 3 · 源码核查**：[src/invariant.ts:17-23](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/invariant.ts#L17-L23)

invariant companion 无额外 runtime invariant，视觉行为依赖主题服务规格。

```text
/**
 * No runtime invariant: the skin is a pure presentation overlay — theme
 * registration and the body attribute mirror are exercised by the theme
 * registry's own behavior specs plus the web e2e snapshots.
 */
const install: InvariantInstaller = () => {}

```

**依据 4 · 作者声明**：[README.md:108-116](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L108-L116)

作者维护契约和推荐的包级测试方式。

````text
## 🛠 开发

组件级补丁规则（见 [README.package.md](README.package.md)）：皮肤段只追加在组件自己的 `.module.css` 尾部，全部以 `body[data-ds-skin='qq2006']` 为祖先作用域；素材用原生尺寸；默认皮肤零回归由测试锁定。

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle   # 单包重建
pnpm --filter @deepseek-ai/dsh-web-frontend build              # 前端重建
pnpm vitest run packages/client/ui-conversation                # 皮肤相关测试
```
````

**依据 5 · 源码核查**：[lib/client.js:358-386](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/lib/client.js#L358-L386)

插件卸载闭包清订阅、覆盖及注册，没有调用旧偏好的恢复函数。

<details>
<summary>查看原文（29行）</summary>

```text
function apply(ctx) {
  const theme = ctx.get ? (ctx.get('theme') ?? ctx.theme) : ctx.theme
  const store = createEnabledStore()
  const tokenState = { overrideDispose: null, previousPreference: null }

  installStyles(ctx)
  registerLocale(ctx)
  const unregister = ensureRegistered(theme)

  const sync = () => {
    const enabled = store.get()
    syncSkinAttribute(enabled)
    applyTokens(theme, enabled, tokenState)
  }
  ctx.effect(() => {
    const stop = store.subscribe(sync)
    return () => {
      stop()
      if (tokenState.overrideDispose) {
        try { tokenState.overrideDispose() } catch { /* ignore */ }
      }
      if (typeof unregister === 'function') {
        try { unregister() } catch { /* ignore */ }
      }
      syncSkinAttribute(false)
    }
  })
  sync()
  registerSettings(ctx, store)
```

</details>

#### 缺口

- 未检查 monorepo patch 完整差异或执行发行包测试。
  **影响**：无法量化跟随宿主升级的维护工时及默认主题回归风险。
  **进一步探讨**：在相邻两个 DSH Web 版本构建并对比 CSS 覆盖、开关持久化和默认主题截图。
- 未在旧主题接口与新版 token 覆盖接口分别验证
  **影响**：直接卸载可能留下旧主题选择，实际宿主可能自行回退
  **进一步探讨**：在两个支持的宿主配置对照先关闭再卸载和开着直接卸载，观察主题与 body 标记

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 最小可验证的采用假设是什么，适合怎样试用？

**研究主题**：新假设与验证、采用判断

#### 完整回答

假设：如果 DSH 官方提供稳定的客户端静态资源与 UI slots，QQ2006 可将当前 fork 专属的组件级样式迁入插件，而不用维护宿主源码分叉。依据是 README 明确区分可通过插件注入的 shell 样式与只能改 monorepo 的组件级效果；这只是未来方向。个人可在非生产 DSH Web profile 试用已发布 shell 皮肤，确认开关可逆、默认主题回归和素材用途；若需求是完整 2006 UI，则需评估维护 fork 的成本后再试，不应误购 npm 插件期待完整复刻。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:78-87](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L78-L87)

能力对照及官方 UI slot 是后续迁移条件。

<details>
<summary>查看原文（10行）</summary>

```text
| 能力 | npm 发行版（方式一） | 源码 monorepo（方式二） |
|---|---|---|
| 设置里的 QQ2006 皮肤开关 | ✅ | ✅ |
| 珊瑚蓝 token 换肤 | ✅ | ✅ |
| 全局皮肤表（字体/滚动条/九宫格类） | ✅ | ✅ |
| 登录窗 / 主面板 / 聊天窗 chrome | ❌ | ✅ |
| 原版列表式消息 / QQ 秀右栏 / 消息操作 | ❌ | ✅ |
| 素材（按钮图标/头像/提示音） | ❌ | ✅ |

后续计划：待 DSH 官方提供客户端插件的静态资源与 UI 槽位机制后，把组件级皮肤完整迁入插件包，使发行版获得全部效果。
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:10-18](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/src/client/index.ts#L10-L18)

客户端依赖全局 CSS 和 theme API 实现 shell 级效果。

```text
 * 1. Inject `qq2006.css` for the plugin lifetime (npm installs never see
 *    the monorepo `base.css` import).
 * 2. Persist enablement in `dsh.qq2006.enabled` (and Host settings when the
 *    `qq2006` namespace is served).
 * 3. When on: set `body[data-ds-skin=qq2006]` and apply coral-blue tokens
 *    via `theme.overrideTokens` (rc.7+) or `theme.register` + `setTheme`
 *    (rc.5/rc.6). The injected sheet also restyles the live DSH 0.1.2
 *    shell (title bar, sidebar, composer, settings dialog).
 * 4. Register 设置 → 通用 → QQ2006 皮肤, plus 设置 → 插件 card on rc.7+.
```

**依据 3 · 作者声明**：[README.md:110-115](https://github.com/LaplaceYoung/dsh-qq2006/blob/ddde58e2cb8d1ff62543cc195f58a507605b7845/README.md#L110-L115)

作者要求皮肤作用域约束并给出回归验证方式。

````text
组件级补丁规则（见 [README.package.md](README.package.md)）：皮肤段只追加在组件自己的 `.module.css` 尾部，全部以 `body[data-ds-skin='qq2006']` 为祖先作用域；素材用原生尺寸；默认皮肤零回归由测试锁定。

```sh
pnpm --filter @deepseek-ai/dsh-client-ui-conversation bundle   # 单包重建
pnpm --filter @deepseek-ai/dsh-web-frontend build              # 前端重建
pnpm vitest run packages/client/ui-conversation                # 皮肤相关测试
````

#### 缺口

- 没有目标用户偏好反馈或版本升级维护数据。
  **影响**：假设是否值得推进取决于上游 slot 能否覆盖组件需求以及样式维护成本。
  **进一步探讨**：对比纯插件版与 fork 版在同一 Web 版本中的视觉覆盖、升级成本和默认主题回归。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
