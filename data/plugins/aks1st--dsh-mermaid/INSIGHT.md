# dsh-mermaid

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[2708cdf](https://github.com/AKS1st/dsh-mermaid/tree/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48)

<!-- BEGIN META -->
[![GitHub ★ 9](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9&color=yellow&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid) [![npm 30d 4,196](https://img.shields.io/static/v1?label=npm+30d&message=4%2C196&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-mermaid) [![最新发布 2026-10-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-15&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-mermaid)
<!-- END META -->

> **实现功能**：在DSH Web会话中把Mermaid代码围栏显示为SVG图，支持主题跟随、放大和错误查看。

> **核心亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](#research-q02)。

> **风险与缺陷**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](#research-q02)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 谁需要会话内图表，源码怎样成为SVG？](#detail-section-11)
  - [Q02 · 相对原始代码或外部渲染有什么增量，关键边界是什么？](#detail-section-12)
  - [Q03 · 启动依赖与退出、错误恢复流程是什么？](#detail-section-13)
  - [Q04 · 首次、持续及失败恢复成本和效果如何判断？](#detail-section-14)
  - [Q05 · 哪些设计可复用，真正可取消渲染假设怎样检验？](#detail-section-15)
  - [Q06 · 谁适合受控试用，什么情况应停止？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：帮助开发者/研究者就地阅读流程与架构图，保留源码核对，渲染不等业务逻辑正确。

可读Mermaid源码或复制到独立渲染器，插件把展示放进DSH消息；语法和业务正确性仍需读者核对。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| SVG就地渲染 | 阅读定格Mermaid围栏 | 依赖宿主DOM与Mermaid，业务正确性未验证 |
| 视口队列/主题 | 推迟离屏工作并同步亮暗 | 不中断单图同步CPU |
| 放大与复制 | 查看复杂图并保留源码 | 展示交互不是图内执行 |
| 错误/修复入口 | 保留源码并复制或发AI | 发AI可能覆盖现有输入，需自行判断 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/DSH webServer与client加载 | 启动必需 | host route和DOM观察器 | 缺任一半部会加载/渲染失败 |
| Mermaid依赖UMD | 渲染必需 | 布局和SVG生成 | 加载失败保留错误/源码；promise失败可能需刷新 |
| DSH消息DOM选择器 | 识别必需 | 查定格围栏和输入 | 宿主DOM改变可能漏渲染或修复动作失配 |
| IntersectionObserver | 性能可选 | 视口惰性调度 | 缺失回到较积极渲染 |
| 模型会话 | 仅AI修复动作需要 | 发送源码与错误供模型修改 | 可能改草稿并产生模型调用，默认阅读不需要 |



#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本和适量大小限制 | 安装产物与依赖可解析 |
| 加载 | 安装重启web并刷新浏览器 | 简单定格围栏变SVG，源码仍可复制 |
| 阅读/恢复 | 放大或复制错误，在复杂图失败时回源码 | 优先复制后自行决定是否发给模型 |
| 退出 | 禁用/卸载并刷新页面 | 路由和观察器卸载，原消息源码仍在宿主 |

README称Git安装prepare自动构建，但package的scripts未见prepare；仓库已含lib，不能把该文案当安装生命周期保证。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装Mermaid和首次UMD传输，金额未知 | 核对宿主DOM/配置及简单图 | 作者包体大小不是本轮网络测量 |
| 持续使用 | 浏览器渲染、主题刷新、观察器与SVG内存 | 阅读、放大、回看源码 | 实际峰值内存/卡顿未知 |
| 失败恢复 | 复制或可选模型修复及重复渲染 | 查语法、保护已有草稿并核对修改 | AI动作不保证真实发送成功 |



#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少切工具 | 就地SVG与放大存在 | 复杂图理解准确性与净节时 |
| 延迟非视口工作 | 队列/IntersectionObserver存在 | 单图CPU卡顿与大批图尾延迟 |
| 失败可恢复 | 原文保留和错误复制存在 | AI修复成功率与草稿覆盖影响 |

费用未知不填零，性能判断需真实浏览器图集，不能从单线程队列推断页面永不卡顿。

> **思考**：Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](#research-q02)。

把成熟Mermaid布局接入DSH定格消息，补视口排队、主题、放大与源码回退，减少复制到外部站点；上游布局和消毒不属插件原创。详见[Q02](#research-q02)。

可复用的是host/client共用协议和严格配置、固定文件白名单、source保存在WeakMap、第一次失败回原pre、串行队列与可见性调度，分别控制配置漂移、过宽静态路由、主题重渲染及批量负担。测试覆盖strict、失败fallback和never-settling Promise超时，但不能用mock的异步挂起证明同步病态CPU可中断，本轮未运行。

<a id="detail-section-5"></a>

### 1.4 主要限制

Promise超时不能中断主线程CPU，离视口只丢结果；发送AI修复会写全局首个输入框并模拟Enter，可能覆盖已有草稿，均为静态边界未复现。strict不能代替完整安全验收。详见[Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

适合经常看Mermaid图的人先用小图试用，保留strict和合理限制，报错先复制后决定是否发AI；卡顿、异常交互或草稿覆盖就停相关路径。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持就地惰性图表集成贡献；性能和SVG安全未独立运行验证。隔离渲染及安全修复草稿为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/protocol.ts、src/client/index.ts、src/client/dom.ts、tests/client-dom.spec.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取固定host/client/protocol及DOM测试定义；不加载目标脚本、浏览器或测试，性能与安全仅源码边界。
- 下一步：进一步探讨可从正常/病态/错误图及非空草稿样本入手，核对可响应时间、取消后CPU、SVG行为和修复输入保持。

**分析版本**

- **仓库**：[AKS1st/dsh-mermaid](https://github.com/AKS1st/dsh-mermaid)
- **版本号**：0.5.0（[固定提交 2708cdf](https://github.com/AKS1st/dsh-mermaid/tree/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48)）
- **版本日期**：2026-08-17（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨可终止渲染隔离和绑定会话的可预览修复草稿，比较病态图响应及原草稿保留；受DOM依赖与通信开销约束，未验证。详见[Q05](#research-q05)。

进一步探讨可从正常/病态/错误图及非空草稿样本入手，核对可响应时间、取消后CPU、SVG行为和修复输入保持。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 9 | 2419 | 1723 | 712 | — |
| .md | source | 3 | 204 | — | — | 1917 |
| .mjs | source | 3 | 277 | 215 | 42 | — |
| .ts | source | 6 | 1331 | 837 | 409 | — |
| .ts | test | 4 | 1097 | 926 | 82 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid/issues?q=is%3Aissue+created%3A2026-09-22T05%3A07%3A35.249Z..2026-10-22T05%3A07%3A35.249Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/AKS1st/dsh-mermaid/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A07%3A35.249Z..2026-10-22T05%3A07%3A35.249Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查DSH Mermaid就地渲染的阅读价值、资源/交互边界和采用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要会话内图表，源码怎样成为SVG？

**研究主题**：场景与需求、功能与机制

#### 完整回答

适合在DSH里读架构、流程和关系图的开发者与研究者，输入是消息中已定格且infostring恰为mermaid的围栏，交付是就地SVG、保留源码复制和可放大阅读。合格结果是图形与源码语义一致、失败保留原文、不会因输出仍在流式变化而频繁渲染。它不检查图中业务逻辑是否正确，也不替代独立图形编辑器。

host通过固定前缀提供自身mermaid依赖UMD和有效config，client按需插入同源script，DOM观察器扫描已定格围栏；视口观察器仅把附近图送入单图队列，每次渲染之间让出主线程。renderBlock应用strict/主题/大小参数，取得SVG后替换pre并保存源码，主题变化只更新相应图，首次失败恢复pre和错误条。放大浮层是展示交互，不是Mermaid图内点击功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:19-32](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/README.md#L19-L32)

作者描述主链和阅读目标。

<details>
<summary>查看原文（14行）</summary>

```text
## 工作方式

- **Host 半部**（`src/index.ts`）：注册 `webServer` 前缀路由 `/mermaid-dist`，从插件自己的 `node_modules/mermaid` 惰性提供 UMD 构建，并提供固定的 `config.json` 端点。
- **Client 半部**（`src/client/`）：监听会话 DOM，把 infostring 为 `mermaid` 的围栏渲染为 SVG：
  1. 只处理**已定格**的围栏（流式输出期间不渲染）；
  2. 首次遇到围栏才惰性加载 mermaid（浏览器缓存一次）；
  3. **视口驱动渲染**：围栏进入视口（带 300px 预加载余量）才开始渲染，滚到哪渲染到哪；还在排队/加载中离开视口的图会停止渲染，回到视口再继续；
  4. **异步队列渲染**：多图时逐个渲染并在渲染之间让出主线程，页面不卡顿；首次渲染期间围栏位置显示加载动画，渲染完成后替换为 SVG；
  5. `mermaid.render()` 产出 SVG，替换围栏的 `<pre>` 主体，语言横幅与复制按钮保留（复制仍复制源码）；
  6. `securityLevel` 恒为 `strict`，标签经 mermaid 内置 DOMPurify 消毒，且从不绑定点击处理；
  7. 主题跟随 GUI：`theme: auto` 读取 `body[data-ds-dark-theme]`，属性翻转时自动重渲染**视口内**的既有图表（视口外的图在重新进入视口时更新）；
  8. 横幅放大按钮打开**全屏浮层**：图表打开时自动适配屏幕（接近全屏、四周留白、垂直/水平居中），滚轮在此基础上缩放，**按住左键或中键拖动**可平移画面（不放大也能拖，边界自动限制不让图跑丢），背景点击或 Esc 关闭；
  9. **渲染失败可见化**：首次渲染失败时保留源码块，并在图框下方显示错误摘要（超长自动截断、悬停查看全文），支持一键**复制报错**或**发送给 AI 修复**（自动把报错+源码填入输入框并发送，模拟用户将报错发给 AI）。

```

</details>

**依据 2 · 源码核查**：[src/index.ts:86-107](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/index.ts#L86-L107)

host仅提供固定构建和配置路由。

<details>
<summary>查看原文（22行）</summary>

```text
export function apply(ctx: MermaidHostContext, rawConfig: Record<string, unknown> | undefined): void {
  const config: MermaidConfig = validateConfig(rawConfig)
  const distRoot = resolveMermaidDist()
  ctx.effect(() => ctx.webServer.register({
    kind: 'prefix',
    path: DIST_PREFIX,
    handler: (req, res) => {
      const pathname = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname)
      // The prefix route matches DIST_PREFIX and DIST_PREFIX/<anything>; serve
      // the bare file name (strip the prefix, keep the leading slash).
      const rel = pathname.startsWith(DIST_PREFIX) ? pathname.slice(DIST_PREFIX.length) : pathname
      return serveDistFile(distRoot, rel, res)
    },
  }), 'dsh-mermaid: dist route')
  ctx.effect(() => ctx.webServer.register({
    kind: 'exact',
    path: CONFIG_ROUTE,
    handler: (_req, res) => {
      res.writeHead(200, { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-cache' })
      res.end(JSON.stringify(config))
    },
  }), 'dsh-mermaid: config route')
```

</details>

**依据 3 · 源码核查**：[src/client/dom.ts:61-85](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L61-L85)

围栏判定和有效配置应用。

<details>
<summary>查看原文（25行）</summary>

```text
/** Whether `block` is a mermaid fence (infostring text is exactly `mermaid`). */
export function isMermaidBlock(block: HTMLElement): boolean {
  const info = block.querySelector<HTMLElement>(`[class*="${INFOSTRING_SEGMENT}"]`)
  return info?.textContent?.trim() === 'mermaid'
}

/** The fence source: the `<pre>` text minus the trailing newline CodeBlock trims on display. */
export function fenceSource(block: HTMLElement): string {
  return block.querySelector('pre')?.textContent?.replace(/\n$/, '') ?? ''
}

/** Resolve the mermaid theme from config + the GUI's dark-mode attribute. */
export function resolveTheme(config: MermaidConfig, dark: boolean): string {
  if (config.theme !== 'auto') return config.theme
  return dark ? 'dark' : 'default'
}

/** Apply the effective theme to the mermaid singleton before rendering. */
export function applyTheme(mermaid: MermaidApi, config: MermaidConfig, dark: boolean): void {
  mermaid.initialize({
    startOnLoad: false,
    securityLevel: config.securityLevel,
    theme: resolveTheme(config, dark),
    maxTextSize: config.maxTextSize,
    maxEdges: config.maxEdges,
```

</details>

**依据 4 · 源码核查**：[src/client/dom.ts:206-225](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L206-L225)

视口和串行渲染队列。

<details>
<summary>查看原文（20行）</summary>

```text
async function drainQueue(): Promise<void> {
  if (queueRunning) return
  queueRunning = true
  try {
    while (renderQueue.length > 0) {
      const item = renderQueue.shift()
      if (item === undefined) break
      const { block, kind } = item
      // Let the browser paint (loading placeholders) and give the observer a
      // chance to deliver scroll-away entries before starting this render.
      await yieldToMainThread()
      if (!document.contains(block)) continue
      if (block.hasAttribute(ERROR_ATTR)) continue
      if (!isVisible(block)) continue
      const source = kind === 'initial' ? pendingSources.get(block) : renderedSources.get(block)
      if (source === undefined || source === '') continue
      if (kind === 'initial' && block.hasAttribute(RENDERED_ATTR)) continue
      if (activeEnv === undefined) continue
      const ok = await renderBlock(block, source, activeEnv, { loading: kind === 'initial' })
      if (ok && kind === 'refresh') needsRefresh.delete(block)
```

</details>

**依据 5 · 源码核查**：[src/client/dom.ts:289-330](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L289-L330)

SVG替换与失败保留源码。

<details>
<summary>查看原文（42行）</summary>

```text
export async function renderBlock(
  block: HTMLElement,
  source: string,
  env: MermaidRenderEnv,
  options: { loading?: boolean } = {},
): Promise<boolean> {
  if (block.hasAttribute(ERROR_ATTR)) return false
  if (options.loading === true) showLoading(block)
  try {
    const mermaid = await env.loadMermaid()
    applyTheme(mermaid, env.config, document.body.hasAttribute('data-ds-dark-theme'))
    const { svg } = await withTimeout(mermaid.render(`dsh-mermaid-${++renderCounter}`, source), RENDER_TIMEOUT_MS)
    // The block scrolled out of the preload margin while this render was in
    // flight: drop the result and let the observer re-enqueue on re-entry.
    if (options.loading === true && !isVisible(block)) return false
    const host = document.createElement('div')
    host.className = HOST_CLASS
    host.innerHTML = svg
    // Replace, in order: the loading placeholder, an existing SVG host
    // (re-render), otherwise the `<pre>`.
    const placeholder = block.querySelector(`.${HOST_CLASS}.${LOADING_CLASS}`)
    const oldHost = block.querySelector(`.${HOST_CLASS}:not(.${LOADING_CLASS})`)
    const pre = block.querySelector('pre')
    if (placeholder !== null) placeholder.replaceWith(host)
    else if (oldHost !== null) oldHost.replaceWith(host)
    else if (pre !== null) pre.replaceWith(host)
    renderedSources.set(block, source)
    pendingSources.delete(block)
    pendingPre.delete(block)
    block.setAttribute(RENDERED_ATTR, '1')
    ensureZoomButton(block)
    return true
  } catch (error) {
    const hadSvg = block.querySelector(`.${HOST_CLASS} svg`) !== null
    if (!hadSvg) {
      // First render failed: restore the plain code block as the fallback
      // (untrusted content must not render error HTML) and stop retrying,
      // then surface an error summary below the block with copy / send-to-AI.
      restorePre(block)
      block.setAttribute(ERROR_ATTR, '1')
      forgetBlock(block)
      showErrorBar(block, source, error)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 相对原始代码或外部渲染有什么增量，关键边界是什么？

**研究主题**：贡献与相对优势、缺陷与关键质疑

#### 完整回答

已有贡献是将成熟Mermaid嵌进DSH消息阅读，补齐惰性同源加载、视口排队、主题同步、放大和可见错误，不需要用户复制到其他站点。Mermaid解析布局和消毒来自上游，不把其图形算法或DOMPurify归为本插件原创。strict配置被host/client契约固定，且不调用返回的bindFunctions，支持收窄图内交互面；不能据此宣布所有SVG安全已独立验证。

关键性能边界是15秒Promise超时无法打断浏览器主线程同步CPU工作，只有事件循环可运行时timer才触发，队列也只在两图之间让出。因此一张病态图仍可能卡顿，离开视口只是丢弃完成结果，不是真正取消计算。maxTextSize/maxEdges交给上游执行，配置只检查正有限数没有合理上限，管理员可削弱资源保护。

错误条“发送给AI修复”是实际写输入并模拟Enter，不是只复制。它选择全局首个textarea[data-phase]，未检查原有非空草稿或确认会话，成功只证明值非空和Enter事件发出，不能证明提交成功。点击可能覆盖读者草稿，静态路径未复现。

#### 证据与依据

**依据 1 · 源码核查**：[src/protocol.ts:50-71](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/protocol.ts#L50-L71)

安全级别固定，大小参数只有正数校验。

<details>
<summary>查看原文（22行）</summary>

```text
export function validateConfig(raw: Record<string, unknown> | undefined): MermaidConfig {
  const input = raw ?? {}
  let theme: MermaidTheme
  if (input['theme'] === undefined) {
    theme = DEFAULT_CONFIG.theme
  } else if (typeof input['theme'] === 'string' && THEMES.has(input['theme'])) {
    theme = input['theme'] as MermaidTheme
  } else {
    throw new Error(`dsh-mermaid: invalid theme "${String(input['theme'])}" (expected one of ${[...THEMES].join(', ')})`)
  }
  const maxTextSize = input['maxTextSize'] === undefined ? DEFAULT_CONFIG.maxTextSize : Number(input['maxTextSize'])
  if (!Number.isFinite(maxTextSize) || maxTextSize <= 0) {
    throw new Error(`dsh-mermaid: invalid maxTextSize "${String(input['maxTextSize'])}" (expected a positive number)`)
  }
  const maxEdges = input['maxEdges'] === undefined ? DEFAULT_CONFIG.maxEdges : Number(input['maxEdges'])
  if (!Number.isFinite(maxEdges) || maxEdges <= 0) {
    throw new Error(`dsh-mermaid: invalid maxEdges "${String(input['maxEdges'])}" (expected a positive number)`)
  }
  if (input['securityLevel'] !== undefined && input['securityLevel'] !== 'strict') {
    throw new Error(`dsh-mermaid: securityLevel "${String(input['securityLevel'])}" is not allowed (only "strict")`)
  }
  return { theme, maxTextSize, maxEdges, securityLevel: 'strict' }
```

</details>

**依据 2 · 源码核查**：[src/client/dom.ts:112-125](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L112-L125)

Promise timeout不提供CPU中断。

<details>
<summary>查看原文（14行）</summary>

```text
/** Cap one mermaid.render call; a hostile or pathological diagram must never hang the queue. */
const RENDER_TIMEOUT_MS = 15000

/** How far outside the viewport a block still counts as "wanted" (preload margin). */
const OBSERVER_MARGIN = '300px'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`dsh-mermaid: render timed out after ${ms}ms`)), ms)
    promise.then(
      value => { window.clearTimeout(timer); resolve(value) },
      error => { window.clearTimeout(timer); reject(error) },
    )
  })
```

</details>

**依据 3 · 源码核查**：[src/client/dom.ts:298-318](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L298-L318)

渲染后才检查视口，不调用bindFunctions。

<details>
<summary>查看原文（21行）</summary>

```text
    const mermaid = await env.loadMermaid()
    applyTheme(mermaid, env.config, document.body.hasAttribute('data-ds-dark-theme'))
    const { svg } = await withTimeout(mermaid.render(`dsh-mermaid-${++renderCounter}`, source), RENDER_TIMEOUT_MS)
    // The block scrolled out of the preload margin while this render was in
    // flight: drop the result and let the observer re-enqueue on re-entry.
    if (options.loading === true && !isVisible(block)) return false
    const host = document.createElement('div')
    host.className = HOST_CLASS
    host.innerHTML = svg
    // Replace, in order: the loading placeholder, an existing SVG host
    // (re-render), otherwise the `<pre>`.
    const placeholder = block.querySelector(`.${HOST_CLASS}.${LOADING_CLASS}`)
    const oldHost = block.querySelector(`.${HOST_CLASS}:not(.${LOADING_CLASS})`)
    const pre = block.querySelector('pre')
    if (placeholder !== null) placeholder.replaceWith(host)
    else if (oldHost !== null) oldHost.replaceWith(host)
    else if (pre !== null) pre.replaceWith(host)
    renderedSources.set(block, source)
    pendingSources.delete(block)
    pendingPre.delete(block)
    block.setAttribute(RENDERED_ATTR, '1')
```

</details>

**依据 4 · 源码核查**：[src/client/dom.ts:428-446](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L428-L446)

全局输入覆盖和Enter派发边界。

<details>
<summary>查看原文（19行）</summary>

```text
export async function sendToAI(report: string): Promise<boolean> {
  const textarea = document.querySelector<HTMLTextAreaElement>('textarea[data-phase]')
  if (textarea === null || textarea.disabled || textarea.readOnly) {
    await copyText(report)
    return false
  }
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  if (setter !== undefined) setter.call(textarea, report)
  else textarea.value = report
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  // Let React/onChange flush the draft; if the machine rejected it (locked or
  // busy), the controlled value snaps back empty — hand the user a copy.
  await new Promise<void>(resolve => window.setTimeout(resolve, 30))
  if (textarea.value === '') {
    await copyText(report)
    return false
  }
  textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true }))
  return true
```

</details>

#### 缺口

- 真实浏览器病态图耗时及SVG安全未独立实测。
  **影响**：不能承诺15秒内恢复响应或对所有不可信图无风险。
  **进一步探讨**：可用受控大图/异常语法与安全夹具，记录主线程阻塞和SVG行为，并绑定Mermaid实际版本。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 启动依赖与退出、错误恢复流程是什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

包要求Node ^22.19或>=24，运行依赖mermaid ^11.16.0，host需webServer，client需浏览器DOM/React宿主模块加载能力。UMD来自本插件依赖目录并经同源路由提供，不依赖外部CDN；但复用既有window.mermaid时实际实例可能来自同页其他模块，版本共存需核对。

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node/DSH webServer与client加载 | 启动必需 | host route和DOM观察器 | 缺任一半部会加载/渲染失败 |
| Mermaid依赖UMD | 渲染必需 | 布局和SVG生成 | 加载失败保留错误/源码；promise失败可能需刷新 |
| DSH消息DOM选择器 | 识别必需 | 查定格围栏和输入 | 宿主DOM改变可能漏渲染或修复动作失配 |
| IntersectionObserver | 性能可选 | 视口惰性调度 | 缺失回到较积极渲染 |
| 模型会话 | 仅AI修复动作需要 | 发送源码与错误供模型修改 | 可能改草稿并产生模型调用，默认阅读不需要 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认版本和适量大小限制 | 安装产物与依赖可解析 |
| 加载 | 安装重启web并刷新浏览器 | 简单定格围栏变SVG，源码仍可复制 |
| 阅读/恢复 | 放大或复制错误，在复杂图失败时回源码 | 优先复制后自行决定是否发给模型 |
| 退出 | 禁用/卸载并刷新页面 | 路由和观察器卸载，原消息源码仍在宿主 |

README称Git安装prepare自动构建，但package的scripts未见prepare；仓库已含lib，不能把该文案当安装生命周期保证。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:46-64](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/package.json#L46-L64)

构建/依赖/引擎声明，未见prepare。

<details>
<summary>查看原文（19行）</summary>

```text
  "scripts": {
    "build": "tsc -p tsconfig.json && tsdown -c tsdown.config.mjs",
    "check": "tsc -p tsconfig.json --noEmit --pretty false",
    "test": "vitest run"
  },
  "dependencies": {
    "mermaid": "^11.16.0"
  },
  "devDependencies": {
    "@types/node": "^22.0.0",
    "jsdom": "^26.0.0",
    "playwright": "^1.62.1",
    "tsdown": "^0.22.14",
    "typescript": "^6.0.3",
    "vitest": "^3.2.4"
  },
  "engines": {
    "node": "^22.19 || >=24"
  },
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:51-69](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/index.ts#L51-L69)

同源UMD与window.mermaid复用。

<details>
<summary>查看原文（19行）</summary>

```text
function loadMermaid(): Promise<MermaidApi> {
  mermaidPromise ??= new Promise<MermaidApi>((resolveLoad, rejectLoad) => {
    const existing = window.mermaid
    if (existing !== undefined) {
      resolveLoad(existing)
      return
    }
    const script = document.createElement('script')
    script.src = `${DIST_PREFIX}/${MERMAID_BUNDLE}`
    script.async = true
    script.onload = () => {
      const api = window.mermaid
      if (api === undefined) rejectLoad(new Error('dsh-mermaid: mermaid loaded but window.mermaid is missing'))
      else resolveLoad(api)
    }
    script.onerror = () => rejectLoad(new Error('dsh-mermaid: failed to load mermaid bundle'))
    document.head.append(script)
  })
  return mermaidPromise
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:96-125](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/index.ts#L96-L125)

DOM观察器和effect清理。

<details>
<summary>查看原文（30行）</summary>

```text
  void loadConfig().then((config) => {
    const env: MermaidRenderEnv = { loadMermaid, config }

    // Initial pass covers already-settled messages (session replay, history).
    scan(env)
    // Clear any mermaid error-render artifacts older versions left stuck in
    // the page body (the bottom-left "Syntax error in text" popup).
    removeStrayErrorElements()

    // Settled messages mount new DOM (or swap streaming → settled nodes), so
    // watch the whole document for added nodes and re-scan.
    const observer = new MutationObserver(() => scan(env))
    observer.observe(document.body, { childList: true, subtree: true })

    // Theme: re-render existing diagrams when light/dark flips.
    const themeObserver = new MutationObserver(() => {
      void loadMermaid().then((mermaid) => {
        applyTheme(mermaid, config, document.body.hasAttribute('data-ds-dark-theme'))
        reRenderAll(env)
      })
    })
    themeObserver.observe(document.body, { attributes: true, attributeFilter: ['data-ds-dark-theme'] })

    ctx.effect(() => () => {
      observer.disconnect()
      themeObserver.disconnect()
      // Full module teardown: any open overlay, the lazy viewport observer,
      // and the pending render queue.
      dispose()
    }, 'dsh-mermaid: fence observer + theme observer + dispose')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:42-62](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/index.ts#L42-L62)

host只允许UMD与map目标。

<details>
<summary>查看原文（21行）</summary>

```text
export async function serveDistFile(distRoot: string, pathname: string, res: ServerResponse): Promise<void> {
  const target = resolve(normalize(join(distRoot, pathname)))
  // Traversal rejection: the target must stay under distRoot (sep, not '/':
  // resolve() emits backslash paths on Windows).
  if (target !== distRoot && !target.startsWith(distRoot + sep)) {
    res.writeHead(403)
    res.end()
    return
  }
  if (pathname !== `/${MERMAID_BUNDLE}` && pathname !== `/${MERMAID_BUNDLE}.map`) {
    res.writeHead(404)
    res.end()
    return
  }
  try {
    const body = await readFile(target)
    res.writeHead(200, {
      'content-type': MIME[extname(target)] ?? 'application/octet-stream',
      'cache-control': 'no-cache',
    })
    res.end(body)
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续及失败恢复成本和效果如何判断？

**研究主题**：效果与总成本

#### 完整回答

合格任务是读者正确理解一张图及其限制，不能把SVG生成视为业务完成。默认阅读不调用模型，但下载本地依赖、浏览器布局/内存、DOM扫描与主题重渲染都有资源成本；仅点击AI修复才追加模型/对话成本。

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 安装Mermaid和首次UMD传输，金额未知 | 核对宿主DOM/配置及简单图 | 作者包体大小不是本轮网络测量 |
| 持续使用 | 浏览器渲染、主题刷新、观察器与SVG内存 | 阅读、放大、回看源码 | 实际峰值内存/卡顿未知 |
| 失败恢复 | 复制或可选模型修复及重复渲染 | 查语法、保护已有草稿并核对修改 | AI动作不保证真实发送成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 少切工具 | 就地SVG与放大存在 | 复杂图理解准确性与净节时 |
| 延迟非视口工作 | 队列/IntersectionObserver存在 | 单图CPU卡顿与大批图尾延迟 |
| 失败可恢复 | 原文保留和错误复制存在 | AI修复成功率与草稿覆盖影响 |

费用未知不填零，性能判断需真实浏览器图集，不能从单线程队列推断页面永不卡顿。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/dom.ts:206-225](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L206-L225)

图间让出而非图内中断。

<details>
<summary>查看原文（20行）</summary>

```text
async function drainQueue(): Promise<void> {
  if (queueRunning) return
  queueRunning = true
  try {
    while (renderQueue.length > 0) {
      const item = renderQueue.shift()
      if (item === undefined) break
      const { block, kind } = item
      // Let the browser paint (loading placeholders) and give the observer a
      // chance to deliver scroll-away entries before starting this render.
      await yieldToMainThread()
      if (!document.contains(block)) continue
      if (block.hasAttribute(ERROR_ATTR)) continue
      if (!isVisible(block)) continue
      const source = kind === 'initial' ? pendingSources.get(block) : renderedSources.get(block)
      if (source === undefined || source === '') continue
      if (kind === 'initial' && block.hasAttribute(RENDERED_ATTR)) continue
      if (activeEnv === undefined) continue
      const ok = await renderBlock(block, source, activeEnv, { loading: kind === 'initial' })
      if (ok && kind === 'refresh') needsRefresh.delete(block)
```

</details>

**依据 2 · 源码核查**：[src/client/dom.ts:321-330](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L321-L330)

失败回原文和错误条。

<details>
<summary>查看原文（10行）</summary>

```text
  } catch (error) {
    const hadSvg = block.querySelector(`.${HOST_CLASS} svg`) !== null
    if (!hadSvg) {
      // First render failed: restore the plain code block as the fallback
      // (untrusted content must not render error HTML) and stop retrying,
      // then surface an error summary below the block with copy / send-to-AI.
      restorePre(block)
      block.setAttribute(ERROR_ATTR, '1')
      forgetBlock(block)
      showErrorBar(block, source, error)
```

</details>

**依据 3 · 源码核查**：[src/client/dom.ts:379-389](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L379-L389)

AI修复报告内容包含完整源码。

<details>
<summary>查看原文（11行）</summary>

````text
export function buildErrorReport(source: string, message: string): string {
  return [
    'mermaid 渲染失败，请帮我修复。',
    '',
    '错误信息：',
    message,
    '',
    '图表源码：',
    '```mermaid',
    source,
    '```',
````

</details>

#### 缺口

- 没有同图集与外部渲染/原文阅读的理解正确率、耗时和资源对照。
  **影响**：无法量化净收益或默认限制是否足够。
  **进一步探讨**：可按简单/复杂/错误图分别记录阅读任务准确率、长任务时间、内存和修复人时。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可复用，真正可取消渲染假设怎样检验？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可复用的是host/client共用协议和严格配置、固定文件白名单、source保存在WeakMap、第一次失败回原pre、串行队列与可见性调度，分别控制配置漂移、过宽静态路由、主题重渲染及批量负担。测试覆盖strict、失败fallback和never-settling Promise超时，但不能用mock的异步挂起证明同步病态CPU可中断，本轮未运行。

新假设是“渲染隔离与安全修复草稿”。对资源重图探索可终止的独立渲染环境或更早复杂度拒绝，同时将修复动作先形成可预览草稿，绑定正确会话并保留现有文本。相对当前Promise timeout和全局textarea，增量是计算与用户输入所有权，不是额外按钮。隔离受Mermaid DOM依赖限制，也增加通信/布局成本。最小对照可比较正常/病态图和已有非空草稿场景，记录可响应时间、取消后的CPU、草稿保持和用户误发；若隔离不能中断或正常图开销过高，应否定收益。

#### 证据与依据

**依据 1 · 源码核查**：[src/protocol.ts:8-15](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/protocol.ts#L8-L15)

两半部共用固定路由。

```text
/** Host route prefix serving the mermaid UMD build. */
export const DIST_PREFIX = '/mermaid-dist'
/** Fixed endpoint returning the effective client config as JSON. */
export const CONFIG_ROUTE = `${DIST_PREFIX}/config.json`
/** The mermaid browser bundle file served under {@link DIST_PREFIX}. */
export const MERMAID_BUNDLE = 'mermaid.min.js'
/** Full package path of the UMD build, for `require.resolve` inside the installed mermaid dependency. */
export const MERMAID_DIST_FILE = 'mermaid/dist/mermaid.min.js'
```

**依据 2 · 源码核查**：[src/client/dom.ts:112-125](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L112-L125)

当前timeout提供隔离需求起点。

<details>
<summary>查看原文（14行）</summary>

```text
/** Cap one mermaid.render call; a hostile or pathological diagram must never hang the queue. */
const RENDER_TIMEOUT_MS = 15000

/** How far outside the viewport a block still counts as "wanted" (preload margin). */
const OBSERVER_MARGIN = '300px'

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = window.setTimeout(() => reject(new Error(`dsh-mermaid: render timed out after ${ms}ms`)), ms)
    promise.then(
      value => { window.clearTimeout(timer); resolve(value) },
      error => { window.clearTimeout(timer); reject(error) },
    )
  })
```

</details>

**依据 3 · 源码核查**：[tests/client-dom.spec.ts:208-251](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/tests/client-dom.spec.ts#L208-L251)

strict、错误与异步超时静态测试范围。

<details>
<summary>查看原文（44行）</summary>

```text
  it('replaces the pre with the SVG host and marks the block rendered', async () => {
    const block = mermaidBlock('graph TD; A-->B')
    await renderBlock(block, 'graph TD; A-->B', env())
    expect(block.querySelector('pre')).toBeNull()
    const host = block.querySelector(`.${HOST_CLASS}`)
    expect(host).not.toBeNull()
    expect(host!.innerHTML).toContain('<svg')
    expect(block.hasAttribute(RENDERED_ATTR)).toBe(true)
    expect(fakeMermaid.lastInit?.['securityLevel']).toBe('strict')
    // mermaid must never render its built-in error diagram into the page.
    expect(fakeMermaid.lastInit?.['suppressErrorRendering']).toBe(true)
  })

  it('keeps the plain text and marks an error when mermaid throws', async () => {
    const block = mermaidBlock('this is not a diagram')
    const throwing: MermaidApi = {
      ...fakeMermaid,
      async render(): Promise<{ svg: string }> { throw new Error('parse failed') },
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      await renderBlock(block, 'this is not a diagram', env({ loadMermaid: async () => throwing }))
      expect(block.querySelector('pre')).not.toBeNull()
      expect(block.hasAttribute(ERROR_ATTR)).toBe(true)
      expect(block.hasAttribute(RENDERED_ATTR)).toBe(false)
      // An error summary bar appears below the block with the message + actions.
      const bar = block.querySelector<HTMLElement>(`.${ERROR_BAR_CLASS}`)
      expect(bar).not.toBeNull()
      expect(bar!.textContent).toContain('parse failed')
      expect(bar!.querySelector('button')?.textContent).toBe('复制报错')
      expect([...(bar!.querySelectorAll('button') ?? [])].map(b => b.textContent)).toContain('发送给 AI 修复')
    } finally {
      spy.mockRestore()
    }
  })

  it('marks an error when mermaid.render never settles (timeout guard)', async () => {
    const block = mermaidBlock('graph TD; A-->B')
    const hanging: MermaidApi = {
      ...fakeMermaid,
      render(): Promise<{ svg: string }> { return new Promise(() => { /* never settles */ }) },
    }
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
```

</details>

**依据 4 · 源码核查**：[src/client/dom.ts:428-446](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L428-L446)

修复动作输入所有权不足。

<details>
<summary>查看原文（19行）</summary>

```text
export async function sendToAI(report: string): Promise<boolean> {
  const textarea = document.querySelector<HTMLTextAreaElement>('textarea[data-phase]')
  if (textarea === null || textarea.disabled || textarea.readOnly) {
    await copyText(report)
    return false
  }
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  if (setter !== undefined) setter.call(textarea, report)
  else textarea.value = report
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  // Let React/onChange flush the draft; if the machine rejected it (locked or
  // busy), the controlled value snaps back empty — hand the user a copy.
  await new Promise<void>(resolve => window.setTimeout(resolve, 30))
  if (textarea.value === '') {
    await copyText(report)
    return false
  }
  textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true }))
  return true
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 谁适合受控试用，什么情况应停止？

**研究主题**：采用判断

#### 完整回答

推荐trial。经常阅读Mermaid流程/架构图的DSH web用户可先用小图试用，保持strict和合理大小限制，优先复制错误报告而非直接发送给AI。已有源码保留、局部展示和同源加载形成明确可回退价值，但不宣称可安全承载任意不可信大型图。

若出现明显主线程卡顿、SVG异常交互、主题切换重复失败或修复动作覆盖草稿，应停止相关操作并回到源代码或独立渲染工具。重要图形仍核对业务逻辑，不以渲染成功作为设计正确。没有本轮宿主和浏览器验收，不能升为install。限制回指Q02，退出与操作依据Q03。

#### 证据与依据

**依据 1 · 源码核查**：[src/protocol.ts:34-38](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/protocol.ts#L34-L38)

默认strict/大小限制。

```text
export const DEFAULT_CONFIG: MermaidConfig = {
  theme: 'auto',
  maxTextSize: 50000,
  maxEdges: 2000,
  securityLevel: 'strict',
```

**依据 2 · 源码核查**：[src/client/dom.ts:321-330](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L321-L330)

失败回退路径。

<details>
<summary>查看原文（10行）</summary>

```text
  } catch (error) {
    const hadSvg = block.querySelector(`.${HOST_CLASS} svg`) !== null
    if (!hadSvg) {
      // First render failed: restore the plain code block as the fallback
      // (untrusted content must not render error HTML) and stop retrying,
      // then surface an error summary below the block with copy / send-to-AI.
      restorePre(block)
      block.setAttribute(ERROR_ATTR, '1')
      forgetBlock(block)
      showErrorBar(block, source, error)
```

</details>

**依据 3 · 源码核查**：[src/client/dom.ts:428-446](https://github.com/AKS1st/dsh-mermaid/blob/2708cdf2e2eb1c0cd15448c3d3d680b8fba58d48/src/client/dom.ts#L428-L446)

修复按钮副作用需用户注意。

<details>
<summary>查看原文（19行）</summary>

```text
export async function sendToAI(report: string): Promise<boolean> {
  const textarea = document.querySelector<HTMLTextAreaElement>('textarea[data-phase]')
  if (textarea === null || textarea.disabled || textarea.readOnly) {
    await copyText(report)
    return false
  }
  const setter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set
  if (setter !== undefined) setter.call(textarea, report)
  else textarea.value = report
  textarea.dispatchEvent(new Event('input', { bubbles: true }))
  // Let React/onChange flush the draft; if the machine rejected it (locked or
  // busy), the controlled value snaps back empty — hand the user a copy.
  await new Promise<void>(resolve => window.setTimeout(resolve, 30))
  if (textarea.value === '') {
    await copyText(report)
    return false
  }
  textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true }))
  return true
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
