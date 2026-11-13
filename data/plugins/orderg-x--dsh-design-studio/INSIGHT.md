# DSH Design Studio

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[09cc332](https://github.com/OrderG-X/dsh-design-studio/tree/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c)

<!-- BEGIN META -->
[![GitHub ★ 46](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=46&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/OrderG-X/dsh-design-studio) [![npm 30d 7,495](https://img.shields.io/static/v1?label=npm+30d&message=7%2C495&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-design-studio) [![最新发布 2026-11-12](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-12&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-design-studio)
<!-- END META -->

> **功能**：在 DSH 侧栏预览设计页面、标注反馈并检查或导出设计。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，会话定位和预览注册把页面检查接入设计对话，减少切到独立页面再传达位置的步骤。

> **主要限制**：[Q03](#research-q03) 指出，预览 iframe 按页面来源走不同策略，管理接口和手机接入也各自有信任条件。应先验证本地可信内容。

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
  - [Q01 · 相对外部浏览器，本地预览与反馈增量是什么？](#detail-section-11)
  - [Q02 · 文件与服务器如何变成会话的预览？](#detail-section-12)
  - [Q03 · 请求、预览及可选外部能力有哪些边界？](#detail-section-13)
  - [Q04 · 怎样验证完整设计反馈是否更省事？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：用 DSH 迭代网页设计的开发者，可在对话旁检查同一会话的本地页面。

外部浏览器可打开同样页面，也便于独立验证。插件增量是会话内呈现与反馈操作。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 本地预览 | 从会话查看页面 | 按实际根或代理端口启动 |
| 右侧栏 | 在对话旁呈现设计 | 依宿主客户端插槽 |
| 手机预览 | 在 LAN 查看测试页 | 独立监听及凭据 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主 webServer 与客户端侧栏 | 必需 | 挂载路由和预览 | 界面或能力不可用 |
| 可信工作区与有效页面 | 本地预览所需 | 解析目标和提供文件 | 报错或无页面 |
| 手机和市场外部条件 | 可选能力所需 | 分享或浏览外部资源 | 本地样例可跳过 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 建立可丢弃的本地设计页 | 仅含测试内容 |
| 检查 | 打开侧栏并确认会话和文件 | 改动反映在正确页面 |
| 退出 | 关闭预览与分享 | 核对服务并回到独立浏览器 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 本机与模型费用未知 | 准备兼容宿主及页面 | 时间未知 |
| 持续 | 预览和模型资源未知 | 核对版本和反馈 | 任务用时待测 |
| 故障 | 重启和重做成本未知 | 关闭额外监听及恢复外部流程 | 副作用需排查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 预览 | 会话目标和本地服务 | 实际渲染兼容 |
| 反馈 | 右侧栏与模型工作台接线 | 反馈准确性 |
| 退出 | 可关闭预览和手机分享 | 不同环境的完整恢复 |

> **思考**：[Q03](#research-q03) 指出，预览 iframe 按页面来源走不同策略，管理接口和手机接入也各自有信任条件。应先验证本地可信内容。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，会话定位和预览注册把页面检查接入设计对话，减少切到独立页面再传达位置的步骤。

按文件根与代理端口复用服务，权限围栏与文件根检查分工明确；手机预览是独立网络路径。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 指出，预览 iframe 按页面来源走不同策略，管理接口和手机接入也各自有信任条件。应先验证本地可信内容。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先用本地可信单页验证会话关联，退出时核对预览和分享状态。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持预览入口、路由和会话跟踪。未做实际宿主与设计效果验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、lib/client.js、lib/serve.js、lib/phone.js、lib/auto.js、lib/tool.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.18.0，检查本地预览、会话、请求边界和手机入口；导出、远端市场和像素校验未运行。
- 下一步：同任务对比侧栏与独立浏览器，记录准确性、时间、页面变化与监听状态。

**分析版本**

- **仓库**：[OrderG-X/dsh-design-studio](https://github.com/OrderG-X/dsh-design-studio)
- **版本号**：0.18.0（[固定提交 09cc332](https://github.com/OrderG-X/dsh-design-studio/tree/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c)）
- **版本日期**：2026-11-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 比较同一反馈任务是否减少错页与切换。若独立浏览器同样准确而总耗时更短，放弃假设。

同任务对比侧栏与独立浏览器，记录准确性、时间、页面变化与监听状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 3 | 2365 | 2138 | 195 | — |
| .md | source | 16 | 937 | — | — | 33600 |
| .js | source | 42 | 30632 | 26274 | 3662 | — |
| .mjs | test | 24 | 8533 | 7494 | 991 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/OrderG-X/dsh-design-studio/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：从 DSH 对话检视本地设计时，侧栏预览能缩短哪些步骤，浏览和导出需要承担什么权限与状态风险？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 相对外部浏览器，本地预览与反馈增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用 DSH 与模型修改网页设计的开发者，可以在同一对话侧栏看到页面，并从预览定位相关元素或屏幕。插件实际注册会话关联的右侧栏，作者描述支持点击标注回传。相对复制地址到独立浏览器，增量是预览保留在同一会话，并有自动发现入口；浏览器仍适合独立确认最终部署及交互。合格任务是一处指定改动能在正确页面与会话被复核。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:38-50](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/README.md#L38-L50)

作者说明页面预览、标注和可选业务规则。

<details>
<summary>查看原文（13行）</summary>

```text
## 能做什么

- **三个方向挑着做**：先出三个风格不同的首屏并排比，挑中再做全套；单独一屏也能「再出两版」。
- **点一下就改**：点元素或框一块区域，输入框里出现一个小标签（悬停看详情），你只要补一句怎么改；标注、调样式、风格、体检清单这些放进输入框的也都是小标签，不再是一大段字；发出去模型拿到完整的位置和样式。改过的地方在预览里闪一下。也能直接在页面上画圈、画箭头、写字，拼成一张图交给模型，或者复制下来贴到别处。
- **打开已有的页面**：首页输入框左边的「+」→「打开已有的 HTML…」选一个，或把 HTML 文件 / 文件夹拖进右侧栏就能预览（桌面版）；也能输路径或开发服务器端口。
- **设计体检**：一键查文字溢出、对比度不够、按钮太小、字太小，问题直接标在页面上；模型做完也会自己查一遍再改。
- **版本和对比**：每轮自动存一版，左右拖动对比，随时回到任意一版。
- **导出和手机上看**：导出展示图、PDF、PPT（屏和屏之间的跳转照样能点）；扫码在手机上按真机尺寸看。页面比默认画幅大的幻灯片、海报，画幅自动跟页面走；也可以在类型后面跟 `宽x高` 指定，比如 `<meta name="dsh-design" content="slides 1440x810">`。导出选项里可以选版面（16:9、4:3、A3 横向、自定义）、每页取景（一屏、整页、指定高度）和每页拼 2 屏；有内容会被裁时，导出前先给一张清单，可以一键按内容改画幅。
- **设计库和设计市场**：以前做过的设计、收的参考图和风格都在「设计库」里；市场里逛大家分享的模板、设计系统和风格卡，点「用这个开始」复制一份接着改。自己做的点「分享到设计市场」，查过打成 zip，在网页里交上去，审过就上架。市场目录从 npm 镜像取，签了名、核对过才用；不想让它联网，在插件页打开「设计库不联网」。
- **照品牌风格做、转成代码**：给官网地址，提一套品牌设计系统，以后都照它做；做好的设计转成 React / Vue / HTML，小程序直接转成 uni-app 或原生小程序代码（HBuilderX 建的项目也认得出），逐屏和设计稿比对。
- **自带照片库**：民宿酒店、餐饮、奶茶咖啡、健身、美妆、服饰、教育、旅行风景这些靠照片说话的设计，模型会直接用上照片，不再只画插画。第一次用到时下载约 8 MB。都是 AI 生成的示意图，上线前请换成真实照片。
- **按题材挑风格**：没定风格时，模型先按题材挑一张风格卡（配色、字体、圆角）再动手，民宿、奶茶店、复盘幻灯片不再都是一个米色调；你自己说了风格或配色就照你的。
- **业务标注（试验，默认关）**：在「插件」页的设计工作台里打开「业务标注」，模型做设计时同时写一份 `annotations.json`，记界面上看不出来的规则、状态和边界。页面上出编号，右侧栏列卡片，点哪边都能定位到另一边；转成代码时这些规则一起交给开发（#15）。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:10311-10324](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/client.js#L10311-L10324)

实际注册会话关联的标签体。

<details>
<summary>查看原文（14行）</summary>

```text
      ctx.effect(() => ctx.sidebarRightTabs.register({
        id: TAB_ID,
        kind: KIND,
        title: () => t('tabTitle'),
        keepMounted: true,
        guide: [{ id: 'open', order: 30, title: () => t('title'), description: () => t('guideDesc'), icon: GuideIcon }],
      }), 'dsh-design-studio: tab type')

      ctx.effect(() => ctx.slots.inject('sidebar.right.pane.tab', () => ctx.slots.register({
        name: 'sidebar.right.pane.tab',
        key: TAB_ID,
        locale: NS,
        inject: (sessionId) => ({ sid: sessionId, t }),
      }, PreviewTab)), 'dsh-design-studio: tab body')
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1389-1396](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L1389-L1396)

宿主订阅会话事件用于观察。

```text

  // ── 自动发现 ──────────────────────────────────────────────────────────────

  if (typeof ctx.on === 'function') {
    ctx.on('session/event', (session, event) => {
      try {
        if (session && event && session.id) tracker.observe(session.id, event)
      } catch (e) {
```

**依据 4 · 源码核查**：[lib/auto.js:5-13](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/auto.js#L5-L13)

自动打开预览有独立开关。

```text
import { studio } from './index.js'

export const name = 'dsh-design-studio-auto'

export function apply(ctx) {
  ctx.effect(() => {
    studio.autoOpen++
    return () => { studio.autoOpen-- }
  }, 'dsh-design-studio: auto open')
```

#### 缺口

- 未在实际宿主进行设计迭代
  **影响**：无法确认比浏览器反馈更快
  **进一步探讨**：用同一处文案和版式改动做一次对照

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 文件与服务器如何变成会话的预览？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 打开接口要求 session，按会话工作目录解析目标，并保存到该会话的 tracker。目录信息来自已记载的 tracker、活会话或存档；不能把相对路径理解为总是当前 shell 目录。预览 hub 分别按文件根或本地代理端口建服务，复用同一 key 的监听，默认监听 127.0.0.1。文件请求按所选根解析真实路径，拒绝根外链接，目录索引也再次检查。根内路径保护服务的是当前选定根，不意味着用户只能选项目内目录。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1051-1065](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L1051-L1065)

从请求到会话目标写入。

<details>
<summary>查看原文（15行）</summary>

```text
  async function openRoute(req, res) {
    if (!admit(req, res)) return
    if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
    let body
    try { body = await readBody(req) } catch (e) { return json(res, 400, { error: e.message }) }
    const session = String(body.session || '')
    if (!session) return json(res, 400, { error: '缺 session' })
    try {
      // 输入框里写的相对路径按会话目录算（新会话也问 DSH 要）
      const target = parseTarget(body.target, await sessionCwd(session))
      await tracker.setTarget(session, target, { source: 'user', popup: false })
      json(res, 200, { ...tracker.snapshot(session), ...annotsField(session) })
    } catch (e) {
      json(res, 400, { error: e.message })
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1353-1371](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L1353-L1371)

当前与存档会话工作目录查找。

<details>
<summary>查看原文（19行）</summary>

```text
  async function sessionCwd(id) {
    const known = tracker.cwdOf(id)
    if (known && path.resolve(known) !== path.resolve(os.homedir())) return known
    const ok = (c) => typeof c === 'string' && path.isAbsolute(c) ? c : ''
    try {
      const ss = ctx && typeof ctx.get === 'function' ? ctx.get('sessions') : null
      const live = ss && typeof ss.list === 'function' ? [...ss.list()].find((s) => s && s.id === id) : null
      const c = live && ok(live.header && live.header.cwd)
      if (c) return c
    } catch (e) { log(e) }
    try {
      const q = ctx && typeof ctx.get === 'function' ? ctx.get('sessionQuery') : null
      if (q && typeof q.listSessions === 'function') {
        const rec = (await q.listSessions()).find((r) => r && r.header && r.header.id === id)
        const c = rec && ok(rec.header.cwd)
        if (c) return c
      }
    } catch (e) { log(e) }
    return known
```

</details>

**依据 3 · 源码核查**：[lib/serve.js:707-751](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/serve.js#L707-L751)

按文件根或代理端口复用服务，监听回环。

<details>
<summary>查看原文（45行）</summary>

```text
  async function open(target, { port: want = 0 } = {}) {
    const key = target.kind === 'file' ? `file:${path.resolve(target.root)}` : `proxy:${target.port}`
    const have = servers.get(key)
    if (have) {
      touch(have)
      await have.ready
      if (have.kind === 'file' && !have.watcher) watch(have) // 先开的时候目录还没建（边写边看的第一屏）：现在补上监听
      return { key, origin: have.origin }
    }
    evict()
    const entry = {
      key,
      kind: target.kind,
      root: target.kind === 'file' ? path.resolve(target.root) : null,
      port: target.kind === 'proxy' ? Number(target.port) : null,
      clients: new Set(),
      sockets: new Set(),
      watcher: null,
      listenPort: 0,
      origin: '',
      used: Date.now(),
    }
    const server = http.createServer(handler(entry))
    server.on('upgrade', (req, socket, head) => {
      try { upgrade(req, socket, head, entry) } catch (e) { log(e); socket.destroy() }
    })
    server.on('connection', (s) => {
      entry.sockets.add(s)
      s.on('close', () => entry.sockets.delete(s))
    })
    server.on('clientError', (_e, s) => s.destroy())
    server.on('error', (e) => log(e)) // 一直挂着：没人接的 error 会让整个进程退出
    entry.server = server
    servers.set(key, entry)
    const listen = (p) => new Promise((resolve, reject) => {
      server.once('error', reject)
      server.listen(p, '127.0.0.1', () => {
        server.off('error', reject)
        resolve()
      })
    })
    const wanted = Number.isInteger(Number(want)) && want > 0 && want < 65536 ? Number(want) : 0
    entry.ready = (wanted ? listen(wanted).catch(() => listen(0)) : listen(0)).then(() => {
      entry.listenPort = server.address().port
      entry.origin = `http://127.0.0.1:${entry.listenPort}`
```

</details>

**依据 4 · 源码核查**：[lib/serve.js:161-180](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/serve.js#L161-L180)

真实路径限制。

<details>
<summary>查看原文（20行）</summary>

```text
/** 真实路径在不在根目录（也取真实路径）里面 */
function inRoot(root, real) {
  const realRoot = fs.realpathSync(root)
  return real === realRoot || real.startsWith(realRoot + path.sep)
}

/** URL 路径 → 根目录下的真实文件；跳出根目录（含软链接）返回 null */
export function resolveInRoot(root, pathname) {
  let rel
  try { rel = decodeURIComponent(pathname) } catch { return null }
  if (rel.includes('\0')) return null
  if (path.sep === '\\') rel = rel.replace(/\\/g, '/') // Windows：反斜杠也是分隔符，先换成 / 再去掉 ..（不然 ..\ 绕得出去）
  const abs = path.resolve(root, '.' + path.posix.normalize('/' + rel))
  const base = path.resolve(root)
  if (abs !== base && !abs.startsWith(base + path.sep)) return null // 文件还不存在（正在写的草稿）也不许出根目录
  let real
  try { real = fs.realpathSync(abs) } catch { return { abs, real: null } }
  if (!inRoot(root, real)) return null
  return { abs, real }
}
```

</details>

**依据 5 · 源码核查**：[lib/serve.js:443-457](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/serve.js#L443-L457)

实际服务文件及索引路径复核。

<details>
<summary>查看原文（15行）</summary>

```text
  function serveFile(req, res, entry, pathname) {
    const hit = resolveInRoot(entry.root, pathname)
    if (!hit) return send(res, 403, 'forbidden')
    let file = hit.real
    if (file) {
      let st
      try { st = fs.statSync(file) } catch { st = null }
      if (st && st.isDirectory()) {
        // 目录补 index.html：它自己也可能是指到根外的软链接，取真实路径再查一遍
        try { file = fs.realpathSync(path.join(file, 'index.html')) } catch { file = null }
        if (file && !inRoot(entry.root, file)) return send(res, 403, 'forbidden')
      }
    }
    if (!file) {
      const html = errorPage('找不到这个文件', String(pathname).replace(/[<>&]/g, ''), false)
```

</details>

#### 缺口

- 未运行本地服务、开发服务器和远程客户端
  **影响**：无法确认所有目标类型和网络环境都能正常预览
  **进一步探讨**：用隔离项目分别验证静态页面、缺文件和根外符号链接

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 请求、预览及可选外部能力有哪些边界？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

Host 管理接口可委托宿主 connection.requestRejection；缺服务时回退到回环地址及 Host、来源检查，符合回环条件的无 Origin 调用可通过该围栏。普通页面与严格来源页面的 iframe 策略不同，严格 src 页面仍允许脚本与同源能力但限制剪贴板，不宜把所有预览当作完全隔离的浏览器。主预览服务为回环，手机功能另会创建 LAN listener，通过独立 token 和 cookie 访问。离线市场、业务标注有独立补丁行，固定配置默认禁用离线行。试用可只看本地可信页面，避免并行启用手机与外部市场。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:727-742](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L727-L742)

无 Origin 与宿主服务存在性。

<details>
<summary>查看原文（16行）</summary>

```text
function fenceOk(req, own) {
  const host = String(req.headers.host || '')
  if (!LOOPBACK_HOST.test(host) && !(own && host === own)) return false
  if (req.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = req.headers.origin
  if (origin === undefined) return true
  try { return new URL(origin).host === host } catch { return false }
}

function connectionOf(ctx) {
  try {
    const c = ctx.get('connection')
    return c && typeof c.requestRejection === 'function' ? c : null
  } catch {
    return null
  }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:863-878](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L863-L878)

管理接口按宿主服务或回环围栏判定。

<details>
<summary>查看原文（16行）</summary>

```text
  function admit(req, res) {
    const conn = connectionOf(ctx)
    if (conn) {
      const rejected = conn.requestRejection(req)
      if (rejected) {
        json(res, rejected, { error: rejected === 401 ? 'unauthorized' : 'forbidden' })
        return false
      }
      return true
    }
    if (!LOOPBACK.has(req.socket.remoteAddress) || !fenceOk(req, ownHost(ctx))) {
      json(res, 403, { error: 'forbidden' })
      return false
    }
    return true
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.js:5724-5737](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/client.js#L5724-L5737)

严格和普通 iframe 条件。

<details>
<summary>查看原文（14行）</summary>

```text
        ...frames.map((f) => {
          // 别人做的设计（设计库来的、没改过）：沙盒里跑（不能弹窗、跳走整个 DSH、下载、交表单），也不给剪贴板
          const strict = typeof f.doc === 'string' ? !!f.strict : isStrict(f.src)
          return h('iframe', {
            key: f.id,
            ref: (el) => { if (el) wins.current.set(f.id, el); else wins.current.delete(f.id) },
            className: 'ddp-frame' + (f.id === cur ? ' cur' : f.id < cur ? ' old' : ''),
            ...(typeof f.doc === 'string' ? { srcDoc: f.doc, sandbox: strict ? 'allow-scripts' : 'allow-scripts allow-forms', referrerPolicy: 'no-referrer' }
              : strict ? { src: f.src, sandbox: 'allow-scripts allow-same-origin', referrerPolicy: 'no-referrer' } : { src: f.src }),
            title: props.label || '',
            tabIndex: f.id === cur ? 0 : -1,
            'aria-hidden': f.id === cur ? undefined : true,
            allow: strict ? 'fullscreen' : 'clipboard-read; clipboard-write; fullscreen',
            onLoad: () => onFrameLoad(f.id),
```

</details>

**依据 4 · 源码核查**：[lib/phone.js:114-150](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/phone.js#L114-L150)

手机服务选 LAN 地址和随机 token。

<details>
<summary>查看原文（37行）</summary>

```text
    const ip = address()
    if (!ip) return { on: false, error: 'no-lan' }
    const s = {
      session,
      ip,
      token: crypto.randomBytes(16).toString('base64url'),
      path: path || '/',
      port: 0,
      url: '',
      seen: 0,
      lastSeen: 0,
      started: now(),
      followers: new Set(),
      sockets: new Set(),
    }
    s.cookie = 'ddp_phone'
    // 出了意外也不让异常冒出去（DSH 遇到没接住的异常会整个退出）
    const server = http.createServer((req, res) => {
      try { handle(s, req, res) } catch (e) {
        log(e)
        try { if (!res.headersSent) deny(res, 500); else res.destroy() } catch { /* 连接已经没了 */ }
      }
    })
    server.on('upgrade', (req, socket, head) => {
      try { upgrade(s, req, socket, head) } catch (e) { log(e); socket.destroy() }
    })
    server.on('connection', (c) => { s.sockets.add(c); c.on('close', () => s.sockets.delete(c)) })
    server.on('clientError', (_e, c) => c.destroy())
    s.server = server
    shares.set(session, s)
    try {
      await new Promise((resolve, reject) => {
        server.once('error', reject)
        server.listen(0, ip, () => resolve())
      })
    } catch (e) {
      shares.delete(session)
```

</details>

**依据 5 · 源码核查**：[lib/phone.js:190-212](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/phone.js#L190-L212)

手机访问 token 与 cookie 验证。

<details>
<summary>查看原文（23行）</summary>

```text
  }

  // ── 入口 ──────────────────────────────────────────────────────────────────

  function authed(s, req) {
    return same(cookieOf(req.headers.cookie, s.cookie), s.token)
  }

  function handle(s, req, res) {
    if (String(req.headers.host || '').toLowerCase() !== `${s.ip}:${s.port}`) return deny(res)
    let url
    try { url = new URL(req.url, 'http://x') } catch { return deny(res) }
    const k = url.searchParams.get('k')
    if (k !== null) {
      if (!same(k, s.token)) return deny(res)
      // 口令换成 Cookie，再跳到不带口令的地址（口令不留在手机的地址栏和历史里）
      url.searchParams.delete('k')
      res.writeHead(302, {
        'Set-Cookie': `${s.cookie}=${s.token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=86400`,
        Location: url.pathname.replace(/^\/+/, '/') + url.search,
        'Cache-Control': 'no-store',
      })
      return res.end()
```

</details>

**依据 6 · 源码核查**：[cordis.patch.yml:7-18](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/cordis.patch.yml#L7-L18)

自动预览、离线、标注可单独配置。

<details>
<summary>查看原文（12行）</summary>

```text
    # 自动打开预览（模型写了设计用的 HTML、开发服务器起来时）
    - id: dsh-design-studio-auto
      name: dsh-design-studio/auto
    # 设计库不联网（默认关）：打开后「市场」不访问任何网址，只看下载过的。
    # 反着来是故意的：老版本升级上来没有这一行时，市场照常联网
    - id: dsh-design-studio-offline
      name: dsh-design-studio/offline
      disabled: true
    # 业务标注（试验，默认关）：打开后模型随设计写 annotations.json，右侧栏多一个按钮
    - id: dsh-design-studio-annotations
      name: dsh-design-studio/annotations
      disabled: true
```

</details>

#### 缺口

- 未验证反向代理、浏览器沙盒和手机撤销
  **影响**：不能断言所有页面隔离或预览只在本机
  **进一步探讨**：先验证本地管理拒绝与隔离效果，再单独核对手机监听

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样验证完整设计反馈是否更省事？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

使用可丢弃工作区准备一个静态 HTML，只开本地预览。分别在侧栏和独立浏览器定位同一处变更、把反馈交给模型并核对结果，计入首次挂载、每次操作、环境失败和退出。待验证假设是保持预览和对话相邻会减少错页或丢失反馈。若浏览器路径同样准确且更快，额外集成不值得使用。若预览对应错误会话、访问非预期目录或出现额外监听，就关闭预览与分享，禁用挂载并回到独立浏览器。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1051-1080](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L1051-L1080)

打开和视图更新可以独立验收。

<details>
<summary>查看原文（30行）</summary>

```text
  async function openRoute(req, res) {
    if (!admit(req, res)) return
    if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
    let body
    try { body = await readBody(req) } catch (e) { return json(res, 400, { error: e.message }) }
    const session = String(body.session || '')
    if (!session) return json(res, 400, { error: '缺 session' })
    try {
      // 输入框里写的相对路径按会话目录算（新会话也问 DSH 要）
      const target = parseTarget(body.target, await sessionCwd(session))
      await tracker.setTarget(session, target, { source: 'user', popup: false })
      json(res, 200, { ...tracker.snapshot(session), ...annotsField(session) })
    } catch (e) {
      json(res, 400, { error: e.message })
    }
  }

  async function viewRoute(req, res) {
    if (!admit(req, res)) return
    if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
    let body
    try { body = await readBody(req) } catch (e) { return json(res, 400, { error: e.message }) }
    const session = String(body.session || '')
    if (!session) return json(res, 400, { error: '缺 session' })
    const patch = {}
    for (const k of ['kind', 'size', 'view', 'focus']) if (typeof body[k] === 'string') patch[k] = body[k]
    try {
      await tracker.setView(session, patch)
      json(res, 200, { ...tracker.snapshot(session), ...annotsField(session) })
    } catch (e) {
```

</details>

**依据 2 · 源码核查**：[lib/index.js:1329-1344](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/lib/index.js#L1329-L1344)

手机入口可显式停止。

<details>
<summary>查看原文（16行）</summary>

```text
  async function phoneRoute(req, res) {
    if (!admit(req, res)) return
    if (req.method !== 'POST') return json(res, 405, { error: 'method not allowed' })
    let body
    try { body = await readBody(req) } catch (e) { return json(res, 400, { error: e.message }) }
    const session = String(body.session || '')
    if (!session) return json(res, 400, { error: '缺 session' })
    if (typeof body.follow === 'string') return json(res, 200, { ok: phone.follow(session, body.follow) })
    if (body.on === false) {
      phone.stop(session)
      return json(res, 200, phone.status(session))
    }
    if (!tracker.snapshot(session).origin) return json(res, 400, { error: '还没有在预览的页面' })
    const st = await phone.start(session, typeof body.path === 'string' && body.path.startsWith('/') ? body.path : '/')
    // 二维码一行一串 0 / 1，右侧栏画成 SVG
    json(res, 200, st.on ? { ...st, qr: qrMatrix(st.url).map((row) => row.map((c) => (c ? 1 : 0)).join('')) } : st)
```

</details>

**依据 3 · 作者声明**：[README.md:41-46](https://github.com/OrderG-X/dsh-design-studio/blob/09cc3325a8ccaf935c88293566bfb9eb0c8ac13c/README.md#L41-L46)

作者描述的本地预览与反馈任务。

```text
- **点一下就改**：点元素或框一块区域，输入框里出现一个小标签（悬停看详情），你只要补一句怎么改；标注、调样式、风格、体检清单这些放进输入框的也都是小标签，不再是一大段字；发出去模型拿到完整的位置和样式。改过的地方在预览里闪一下。也能直接在页面上画圈、画箭头、写字，拼成一张图交给模型，或者复制下来贴到别处。
- **打开已有的页面**：首页输入框左边的「+」→「打开已有的 HTML…」选一个，或把 HTML 文件 / 文件夹拖进右侧栏就能预览（桌面版）；也能输路径或开发服务器端口。
- **设计体检**：一键查文字溢出、对比度不够、按钮太小、字太小，问题直接标在页面上；模型做完也会自己查一遍再改。
- **版本和对比**：每轮自动存一版，左右拖动对比，随时回到任意一版。
- **导出和手机上看**：导出展示图、PDF、PPT（屏和屏之间的跳转照样能点）；扫码在手机上按真机尺寸看。页面比默认画幅大的幻灯片、海报，画幅自动跟页面走；也可以在类型后面跟 `宽x高` 指定，比如 `<meta name="dsh-design" content="slides 1440x810">`。导出选项里可以选版面（16:9、4:3、A3 横向、自定义）、每页取景（一屏、整页、指定高度）和每页拼 2 屏；有内容会被裁时，导出前先给一张清单，可以一键按内容改画幅。
- **设计库和设计市场**：以前做过的设计、收的参考图和风格都在「设计库」里；市场里逛大家分享的模板、设计系统和风格卡，点「用这个开始」复制一份接着改。自己做的点「分享到设计市场」，查过打成 zip，在网页里交上去，审过就上架。市场目录从 npm 镜像取，签了名、核对过才用；不想让它联网，在插件页打开「设计库不联网」。
```

#### 缺口

- 未测准确率、时延与资源使用
  **影响**：不能确定设计交付质量或节约
  **进一步探讨**：固定同页同任务重复比较反馈、效果与退出

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
