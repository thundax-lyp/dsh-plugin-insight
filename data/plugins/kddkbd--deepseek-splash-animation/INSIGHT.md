# dsh-splash-animation

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[bd82a57](https://github.com/KDDKBD/DeepSeek-splash-animation/tree/bd82a5718507ecb752f04492d9639058ee9291d8)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/KDDKBD/DeepSeek-splash-animation)
<!-- END META -->

> **功能**：在 DSH 启动时播放随包或指定的本地媒体，可设置跳过、渐隐并清除开屏。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将自定义媒体、启动遮罩和跳过整合到 DSH 设置。首帧和交互收益未测。

> **主要限制**：[Q03](#research-q03) Host 保护只处理预置遮罩。挂起的异步配置和没有媒体时长事件仍需检查输入恢复，媒体路径也依宿主保护。

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
  - [Q01 · 哪种开屏任务值得引入插件，与原启动相比多了什么？](#detail-section-11)
  - [Q02 · 默认片、用户路径与清除怎样走到客户端？](#detail-section-12)
  - [Q03 · 视频失败、输入捕获和本地媒体边界怎样退让？](#detail-section-13)
  - [Q04 · 安装、媒体兼容和退出代价在哪里？](#detail-section-14)
  - [Q05 · 分段测首帧和输入恢复能否改善启动可见性？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 需要定制桌面启动过渡的用户。与原生启动相比加入可跳过的视觉内容。

[Q01](#research-q01) 用相同宿主、主题和素材比较无插件启动与正常、跳过两种路径。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 开屏媒体 | 自定义启动过渡 | 由宿主和浏览器共同加载 |
| 本机媒体路由 | 按当前设置播放 | 依赖访问栅栏、路径和编解码 |
| 清除与跳过 | 返回原生界面 | 挂起分支需另行核对 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 20+、兼容 DSH Web | 是 | bundle 与开屏 | 核对 profile |
| 可读且可解码媒体 | 播放需要 | 提供画面 | 保留默认片或清除 |
| 平台文件选择器 | 可选 | 原生选择路径 | 手动填路径 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户选择默认短片或本地媒体 | 确认权限及编解码 |
| 播放 | Host 注入，客户端读取并播放 | 能跳过且恢复输入 |
| 退出 | 用户清除或停用 | 后续加载直接进宿主 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 媒体、解码与存储，实际未知 | 安装重启并选片 | 随包含默认片 |
| 持续使用 | 每次解码和读取资源未知 | 看片或跳过 | 可加启动时间，未测 |
| 失败恢复 | 重新读媒体或清除，实际未知 | 检查格式及恢复输入 | 某些挂起分支无独立上限 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 开屏定制 | 三态、渐隐及跳过逻辑 | 真实启动体验和收益 |
| 本机媒体 | 当前文件和 Range 路由 | 浏览器解码和宿主访问控制 |
| 故障退让 | 遮罩计时和播放失败分支 | 所有挂起能否恢复 |

> **思考**：[Q03](#research-q03) Host 保护只处理预置遮罩。挂起的异步配置和没有媒体时长事件仍需检查输入恢复，媒体路径也依宿主保护。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 将自定义媒体、启动遮罩和跳过整合到 DSH 设置。首帧和交互收益未测。

[Q02](#research-q02) 区分未设、清除、无效路径。[Q03](#research-q03) 分开 Host 遮罩、客户端输入和文件访问。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) Host 保护只处理预置遮罩。挂起的异步配置和没有媒体时长事件仍需检查输入恢复，媒体路径也依宿主保护。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先试内置短片与跳过，核对首帧和输入恢复。若状态不能确认，清除开屏再回到原生启动。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持安装、选择、视频流和常见错误退让。真实宿主、首帧、输入恢复和代理边界未验证。

- 已检查：作者 README、包清单、源码路径 README.md、index.js、client.js、package.json、cordis.patch.yml 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：查固定 Host、客户端、配置和媒体入口。未安装或执行目标、媒体、测试和 DSH，也未测浏览器和硬件。
- 下一步：[Q05](#research-q05) 对相同短片和故障注入比较首帧前、正常播放及输入恢复时间。

**分析版本**

- **仓库**：[KDDKBD/DeepSeek-splash-animation](https://github.com/KDDKBD/DeepSeek-splash-animation)
- **版本号**：0.4.5（[固定提交 bd82a57](https://github.com/KDDKBD/DeepSeek-splash-animation/tree/bd82a5718507ecb752f04492d9639058ee9291d8)）
- **版本日期**：2026-10-03（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 给首帧等待单独设限并记录输入恢复可能降低失败时黑屏。以当前计时为对照，计入健康慢片误截。

[Q05](#research-q05) 对相同短片和故障注入比较首帧前、正常播放及输入恢复时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 2021 | 1208 | 706 | — |
| .md | source | 1 | 184 | — | — | 2275 |
| .mjs | source | 6 | 2067 | 1435 | 474 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KDDKBD/DeepSeek-splash-animation/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/KDDKBD/DeepSeek-splash-animation/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/KDDKBD/DeepSeek-splash-animation/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：自定义开屏对 DSH 的首帧、输入恢复和本机媒体访问做了什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪种开屏任务值得引入插件，与原启动相比多了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常打开 DSH 且想有视觉定制的桌面用户，可用自带或本地媒体覆盖启动过渡，默认可跳过，播放后渐隐。原生启动直接进入宿主界面，插件加入一段显示和输入占用时间。Host 在存在可解析素材时提前注入遮罩，客户端按设置挂载实际画面，没素材时只保留设置。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-7](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/README.md#L3-L7)

作者说明开屏和默认视频。

```text
给 [DeepSeek Harness](https://github.com/deepseek-ai/deepseek-harness) 加一段**自定义开屏动画**：启动时播放你指定的视频，播完后 0.3 秒渐隐，露出 DSH 界面。

插件自带一段默认视频，**装上就能用**，也可以在设置里换成自己的。

![开屏动画：视频铺满画面，右下角是跳过按钮](assets/screenshot-splash.png)
```

**依据 2 · 作者声明**：[README.md:72-94](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/README.md#L72-L94)

作者区分三态、输入和跳过。

<details>
<summary>查看原文（23行）</summary>

````text
## 行为

| 状态 | 表现 |
|---|---|
| 没设置过 | 播放插件自带的视频 |
| 设置了路径 | 播放该视频。路径无效则**不播放**（不会回退到自带视频），原因显示在设置页 |
| 点过「清除」 | **不播放**，DSH 与未安装插件时一致 |

视频播完会停在最后一帧，然后渐隐消失。默认渐隐 0.3 秒。

### 启动过程

```
原生启动窗 → 黑屏（本插件已接管）→ 播放视频 → 渐隐 → 界面
```

插件来不及显示画面的那一两秒里，屏幕是**黑的**而不是先露出界面：插件在页面第一帧就把应用内容盖住，等自己的画面挂上才放开。所以启动时看不到"界面闪一下再出现动画"。

**开屏期间画面拥有输入。** 那段黑屏和视频是覆盖在整个界面上的，点击不会穿透到下面的应用；跳过之后立即恢复。

### 退出方式

默认右下角有一个「跳过」按钮，按 `Esc`、空格或回车也可以提前退出。想改成点任意位置跳过、固定时长自动退出、或干脆不让退出，见下面的 `skip`。
````

</details>

**依据 3 · 源码核查**：[index.js:731-740](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L731-L740)

Host 只在媒体可解析时注入。

<details>
<summary>查看原文（10行）</summary>

```text
  ctx.on('webserver/index-inject', (table) => {
    try {
      if (!Array.isArray(table)) return
      const effective = settings()
      const media = resolveEffectiveMedia(effective.src, dshHome)
      // Nothing to play (or nothing playable) means the shell's own boot screen is
      // the only thing the user would see: leave it alone.
      if (media.configured !== true || media.problem !== undefined) return
      const alreadyPresent = table.some((row) => row && row.kind === 'style' && typeof row.text === 'string' && row.text.includes('dsh-splash-animation-boot'))
      if (alreadyPresent) return
```

</details>

**依据 4 · 源码核查**：[client.js:990-998](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L990-L998)

设置始终注册。

```text
    return {
      inject: ['slots'],
      apply(ctx) {
        // The settings page is always registered: it is how a video gets chosen
        // in the first place.
        ctx.slots.inject(TAB_SLOT, () => ctx.slots.register(
          { name: TAB_SLOT, id: ROW_ID, order: 50, label: () => strings().tab },
          SplashSettings,
        ))
```

**依据 5 · 源码核查**：[client.js:1020-1035](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L1020-L1035)

客户端有可用素材才注册播放层。

<details>
<summary>查看原文（16行）</summary>

```text
        const initial = payloadSync()
        const initialMedia = (initial && initial.media) || { kind: 'none' }
        const initialProblem = (initial && initial.problem) || null
        if (initialMedia.kind !== 'none' && initialProblem === null) {
          ctx.slots.inject(OVERLAY_SLOT, () => ctx.slots.register(
            { name: OVERLAY_SLOT, id: ROW_ID, order: 900 },
            SplashAnimation,
          ))
        } else {
          // Nothing will be mounted, so nothing will take the Host's cover off. The
          // cover is only injected when the Host believes media is playable, which
          // normally agrees with the read above — but the two halves read the same
          // file at different moments, and a disagreement here would leave the
          // application hidden with no splash to replace it. Releasing is idempotent
          // and harmless when no cover was injected at all.
          releaseCover()
```

</details>

#### 缺口

- 未测首帧、启动中断或点击恢复，作者首帧说法未独立复现。
  **影响**：视觉连续性有接线依据，启动速度与读者偏好仍未知。
  **进一步探讨**：同宿主、同素材比较默认启动、正常播放及跳过，量首帧与首次可输入。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 默认片、用户路径与清除怎样走到客户端？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

DSH bundle 注入 Host，即时 Web 客户端用同步 XHR 决定开屏挂载，组件挂载后再异步读一遍新配置。宿主每请求合并 patch 和持久设置，未设置尝试随包片，空字符串是清除，显式无效路径报告问题且不回默认。设置 POST 限制载荷并通过临时文件重命名保存路径。媒体 GET/HEAD 只服务当前配置文件且 URL 名称要匹配，视频支持部分字节与无效 Range 返回 416。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:63-75](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/package.json#L63-L75)

bundle、即时 Web 和运行时声明。

<details>
<summary>查看原文（13行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "immediately": true,
      "inject": []
    }
  },
  "engines": {
    "node": ">=20"
  }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:21-23](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/cordis.patch.yml#L21-L23)

实际插入条目。

```text
- insert:
    - id: dsh-splash-animation
      name: dsh-splash-animation
```

**依据 3 · 源码核查**：[index.js:72-84](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L72-L84)

区分未设、清除和自选。

<details>
<summary>查看原文（13行）</summary>

```text
export function resolveEffectiveMedia(src, dshHome) {
  if (typeof src === 'string') {
    const trimmed = src.trim()
    if (trimmed === '') return { configured: false, source: 'cleared' }
    return { ...resolveMedia(trimmed, dshHome), source: 'chosen' }
  }
  if (!existsSync(BUNDLED_MEDIA)) return { configured: false, source: 'unset' }
  const bundled = resolveMedia(BUNDLED_MEDIA, dshHome)
  // A packaged file that will not resolve is a packaging fault, not a user error;
  // report it as "not engaging" so DSH still boots cleanly.
  if (bundled.configured !== true) return { configured: false, source: 'unset' }
  return { ...bundled, source: 'bundled' }
}
```

</details>

**依据 4 · 源码核查**：[index.js:705-712](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L705-L712)

设置文件覆盖 patch。

```text
  const settings = () => {
    const stored = readState(dshHome)
    const merged = { ...patchConfig }
    for (const [key, value] of Object.entries(stored)) {
      if (key in DEFAULTS) merged[key] = value
    }
    return normalizeConfig(merged)
  }
```

**依据 5 · 源码核查**：[index.js:366-374](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L366-L374)

临时写和重命名。

```text
function writeState(dshHome, src) {
  const dir = join(dshHome, STATE_DIRNAME)
  mkdirSync(dir, { recursive: true })
  const file = stateFile(dshHome)
  const temporary = `${file}.tmp`
  const next = { ...readState(dshHome), src }
  writeFileSync(temporary, `${JSON.stringify(next, null, 2)}\n`, 'utf8')
  renameSync(temporary, file)
}
```

**依据 6 · 源码核查**：[index.js:879-905](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L879-L905)

配置保存、边界及清除。

<details>
<summary>查看原文（27行）</summary>

```text
      handler: async (req, res) => {
        if (guard(req, res)) return
        if (req.method !== 'POST') {
          res.writeHead(405, { Allow: 'POST' })
          res.end()
          return
        }
        const body = await readJsonBody(req, 16 * 1024)
        if (body === undefined || typeof body.src !== 'string') {
          res.writeHead(400, { 'Content-Type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ ok: false, error: 'invalid-body' }))
          return
        }
        const src = body.src.trim().slice(0, MAX_SRC_LENGTH)
        try {
          writeState(dshHome, src)
        } catch (error) {
          ctx.logger.warn(`dsh-splash-animation: could not write the state file (${error.code ?? error.message})`)
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ ok: false, error: 'write-failed' }))
          return
        }
        // Saving — including saving an empty path — records an explicit choice, so
        // the bundled default no longer applies afterwards. That is what makes
        // "clear it and it stops playing" true.
        const media = resolveEffectiveMedia(src, dshHome)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
```

</details>

**依据 7 · 源码核查**：[client.js:247-256](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L247-L256)

同步 XHR 失败按不参与。

<details>
<summary>查看原文（10行）</summary>

```text
    function payloadSync() {
      try {
        const request = new XMLHttpRequest()
        request.open('GET', CONFIG_URL, false)
        request.send(null)
        if (request.status !== 200) return { settings: {}, media: { kind: 'none' }, problem: 'load-failed' }
        return JSON.parse(request.responseText)
      } catch {
        return { settings: {}, media: { kind: 'none' }, problem: 'load-failed' }
      }
```

</details>

**依据 8 · 源码核查**：[client.js:401-411](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L401-L411)

挂载后另取 fresh 配置。

<details>
<summary>查看原文（11行）</summary>

```text
      React.useEffect(() => {
        let cancelled = false
        payload().then((result) => {
          if (cancelled) return
          const settings = { ...FALLBACK, ...((result && result.settings) || {}) }
          setSession({ phase: 'ready', settings, media: (result && result.media) || { kind: 'none' } })
        })
        return () => {
          cancelled = true
        }
      }, [])
```

</details>

**依据 9 · 源码核查**：[index.js:950-978](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L950-L978)

当前媒体及方法限制。

<details>
<summary>查看原文（29行）</summary>

```text
    scoped.effect(() => scoped.webServer.register({
      kind: 'prefix',
      path: MEDIA_ROUTE,
      handler: (req, res) => {
        if (guard(req, res)) return
        if (req.method !== 'GET' && req.method !== 'HEAD') {
          res.writeHead(405, { Allow: 'GET, HEAD' })
          res.end()
          return
        }
        const media = resolveEffectiveMedia(settings().src, dshHome)
        if (media.configured !== true || media.problem !== undefined) {
          notFound(res)
          return
        }
        let requested
        try {
          requested = decodeURIComponent(String(req.url ?? '').slice(MEDIA_ROUTE.length).replace(/^\//, '').split('?')[0])
        } catch {
          notFound(res)
          return
        }
        // Only the currently configured file is ever served.
        if (requested !== media.name) {
          notFound(res)
          return
        }
        serveMedia(req, res, media)
      },
```

</details>

**依据 10 · 源码核查**：[index.js:416-454](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L416-L454)

ETag、Range、HEAD 和读失败分支。

<details>
<summary>查看原文（39行）</summary>

```text
  if (req.headers['if-none-match'] === headers.ETag) {
    res.writeHead(304, headers)
    res.end()
    return
  }

  const seekable = SEEKABLE.has(media.mime)
  const range = seekable ? parseRange(req.headers.range, media.bytes) : undefined
  if (seekable && req.headers.range !== undefined && range === undefined) {
    res.writeHead(416, { ...headers, 'Content-Range': `bytes */${media.bytes}` })
    res.end()
    return
  }

  const start = range === undefined ? 0 : range.start
  const end = range === undefined ? media.bytes - 1 : range.end
  res.writeHead(range === undefined ? 200 : 206, {
    ...headers,
    'Content-Length': String(end - start + 1),
    ...range === undefined ? {} : { 'Content-Range': `bytes ${start}-${end}/${media.bytes}` },
  })

  if (req.method === 'HEAD') {
    res.end()
    return
  }

  const stream = createReadStream(media.path, { start, end })
  let failed = false
  stream.on('error', () => {
    failed = true
    try {
      res.destroy()
    } catch { /* the socket may already be gone */ }
  })
  res.on('close', () => {
    if (!failed) stream.destroy()
  })
  stream.pipe(res)
```

</details>

#### 缺口

- 未运行跨 profile 更新、浏览器同步读取或播放器快进。
  **影响**：能确认选择顺序和接线，不能保证每种格式都有解码能力。
  **进一步探讨**：用默认、无效路径、清除与更换路径分别验证配置、路由和首帧。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 视频失败、输入捕获和本地媒体边界怎样退让？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Host 的十秒计时只清理注入遮罩，客户端组件挂载就解除它并捕获点击。媒体播放失败会静音重试，再失败则淡出。配置异步请求没有显式截止，若挂起，加载态遮罩与指针捕获可持续，按键跳过只在 ready。视频 watchdog 只由 metadata 或 durationchange 事件启动，完全无这两个事件时没有看到独立的未知长度计时，因此不能凭 120 秒常量断言会退出。Host 本机路径支持绝对、家目录与相对路径，仅查文件、扩展名及大小。媒体由当前配置限制，connection 缺失或不可用时 guard 不拒绝，实际网络可达性依宿主。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:787-800](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L787-L800)

Host 注入十秒计时。

<details>
<summary>查看原文（14行）</summary>

```text
      table.push({
        kind: 'script',
        placement: 'head',
        text: '/* dsh-splash-animation-guard */'
          + 'try{'
          + 'var m=["dsh-splash-animation-cover","dsh-splash-animation-base"];'
          + 'var go=function(){try{'
          + 'var ss=document.head?document.head.getElementsByTagName("style"):[],doomed=[];'
          + 'for(var i=0;i<ss.length;i++){var x=ss[i].textContent||"";'
          + 'for(var j=0;j<m.length;j++){if(x.indexOf(m[j])!==-1){doomed.push(ss[i]);break}}}'
          + 'for(var k=0;k<doomed.length;k++){doomed[k].remove()}}catch(e){}};'
          + 'var t=setTimeout(go,10000);'
          + 'globalThis.__DSH_SPLASH_COVER_GUARD__={release:go,clear:function(){clearTimeout(t)}}'
          + '}catch(e){}',
```

</details>

**依据 2 · 源码核查**：[client.js:106-116](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L106-L116)

客户端解除 Host 计时。

<details>
<summary>查看原文（11行）</summary>

```text
    function releaseCover() {
      if (coverReleased || typeof document === 'undefined') return
      coverReleased = true
      try {
        // Disarm the Host's guard first. It exists only for the case where this
        // module never runs; once the release has happened its timer has nothing
        // left to do, and leaving it armed would keep a pending task alive for the
        // rest of the session.
        const guard = globalThis.__DSH_SPLASH_COVER_GUARD__
        if (guard !== undefined && guard !== null && typeof guard.clear === 'function') guard.clear()
      } catch { /* an absent guard is the normal case when the Host injected none */ }
```

</details>

**依据 3 · 源码核查**：[client.js:367-383](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L367-L383)

挂载时从 Host 遮罩交接。

<details>
<summary>查看原文（17行）</summary>

```text
    function SplashAnimation() {
      const [session, setSession] = React.useState({ phase: 'loading' })
      const [phase, setPhase] = React.useState('in')
      const [failed, setFailed] = React.useState(false)
      /**
       * Reveal the application, in the same commit that mounts the splash.
       *
       * `useLayoutEffect`, not `useEffect`: the Host's cover has `#root` hidden, and
       * an effect runs after the browser has painted. Removing the cover then would
       * show the application for a frame BEFORE the splash covers it — the same flash
       * this whole mechanism exists to remove. A layout effect runs after the DOM is
       * updated and before paint, so the cover comes off with the splash already
       * mounted and nothing is ever visible uncovered.
       */
      React.useLayoutEffect(() => {
        releaseCover()
      }, [])
```

</details>

**依据 4 · 源码核查**：[client.js:223-230](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L223-L230)

异步请求未传截止信号。

```text
    async function payload() {
      try {
        const response = await fetch(CONFIG_URL, { credentials: 'same-origin', cache: 'no-store' })
        if (!response.ok) return { settings: {}, media: { kind: 'none' }, problem: 'load-failed' }
        return await response.json()
      } catch {
        return { settings: {}, media: { kind: 'none' }, problem: 'load-failed' }
      }
```

**依据 5 · 源码核查**：[client.js:459-481](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L459-L481)

捕获点击至会话 done。

<details>
<summary>查看原文（23行）</summary>

```text
      const capturingInput = session.phase !== 'done'
      React.useEffect(() => {
        if (!capturingInput) return undefined
        // Read from `session`, not from the render-scoped `settings`, because hooks
        // must run on every render — including the first, where the payload has not
        // arrived and this is still the one-frame cover.
        const skipMode = (session.settings && session.settings.skip) || 'button'
        const onPointer = (event) => {
          event.stopPropagation()
        }
        const onClick = (event) => {
          event.stopPropagation()
          const target = event.target
          const onSkip = target !== null && target !== undefined
            && typeof target.closest === 'function'
            && target.closest('[data-dsh-splash-skip]') !== null
          if (onSkip || skipMode === 'click') dismiss()
        }
        window.addEventListener('pointerdown', onPointer, true)
        window.addEventListener('click', onClick, true)
        return () => {
          window.removeEventListener('pointerdown', onPointer, true)
          window.removeEventListener('click', onClick, true)
```

</details>

**依据 6 · 源码核查**：[client.js:543-560](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L543-L560)

计时仅在事件后启动及静音重试。

<details>
<summary>查看原文（18行）</summary>

```text
          const armFallback = () => {
            if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
            fadeTimer = after(fadeDelayFor(element.duration, settings), dismiss)
          }

          element.addEventListener('loadedmetadata', armFallback)
          element.addEventListener('durationchange', armFallback)

          const started = element.play()
          if (started !== undefined && typeof started.catch === 'function') {
            // Autoplay refused, or the codec failed after metadata. A muted retry
            // satisfies every autoplay policy; if that also fails the media itself
            // is the problem, and the splash gets out of the way.
            started.catch(() => {
              element.muted = true
              const retry = element.play()
              if (retry !== undefined && typeof retry.catch === 'function') retry.catch(() => dismiss())
            })
```

</details>

**依据 7 · 源码核查**：[client.js:578-604](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L578-L604)

异常、可绘制条件与监听清理。

<details>
<summary>查看原文（27行）</summary>

```text
          const onError = () => dismiss()
          /**
           * Reveal the video once it can actually paint.
           *
           * `loadeddata` means the first frame is decoded. Until this fires the
           * overlay keeps painting its opaque cover, so the application never shows
           * through the gap between mounting the element and its first frame.
           */
          const onPaintable = () => setPaintable(true)
          element.addEventListener('ended', onEnded)
          element.addEventListener('error', onError)
          element.addEventListener('loadeddata', onPaintable)
          element.addEventListener('canplay', onPaintable)

          // No `armFallback()` here on purpose: at this point `element.duration` is
          // still NaN, and arming from an unknown length is what truncated
          // playback. `loadedmetadata`/`durationchange` arm it, and a video that
          // never reports a length is covered by UNKNOWN_LENGTH_TIMEOUT_MS.

          return () => {
            clearAll()
            element.removeEventListener('loadedmetadata', armFallback)
            element.removeEventListener('durationchange', armFallback)
            element.removeEventListener('ended', onEnded)
            element.removeEventListener('error', onError)
            element.removeEventListener('loadeddata', onPaintable)
            element.removeEventListener('canplay', onPaintable)
```

</details>

**依据 8 · 源码核查**：[client.js:622-638](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L622-L638)

键盘跳过只在 ready，淡出后结束。

<details>
<summary>查看原文（17行）</summary>

```text
      React.useEffect(() => {
        if (session.phase !== 'ready') return undefined
        if (session.settings.skip === 'never' || session.settings.skip === 'auto') return undefined
        const onKey = (event) => {
          if (event.key === 'Escape' || event.key === ' ' || event.key === 'Enter') {
            event.preventDefault()
            dismiss()
          }
        }
        window.addEventListener('keydown', onKey)
        return () => window.removeEventListener('keydown', onKey)
      }, [session, dismiss])

      React.useEffect(() => {
        if (phase !== 'out') return undefined
        const fade = num(session.settings && session.settings.fadeOutMs, FALLBACK.fadeOutMs)
        const id = window.setTimeout(() => setSession({ phase: 'done' }), fade)
```

</details>

**依据 9 · 源码核查**：[client.js:642-660](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L642-L660)

加载态遮罩阻隔指针。

<details>
<summary>查看原文（19行）</summary>

```text
      if (session.phase === 'done') return null

      if (session.phase === 'loading') {
        // A bare cover for one microtask, so the application is never visible
        // mid-animation. Portalled like the splash itself, and it must carry the
        // SAME z-index — this is not cosmetic.
        //
        // A `position: fixed` element with `z-index: auto` sits at level 0 of the
        // root stacking context, so anything positioned with a positive z-index
        // paints over it. Other plugins mount body-level overlays with z-index values
        // in the thousands (the wallet widget uses 9999 through 22000), and while
        // this cover lacked a z-index they were painted on top of it. Measured on a
        // live page: the cover was on screen and `elementFromPoint` at the viewport
        // centre returned the application's input box, for the two frames between
        // this cover mounting and the real overlay replacing it.
        return topLayer(React.createElement('div', {
          'aria-hidden': true,
          style: { position: 'fixed', inset: 0, zIndex: TOP_Z, background: '#000000', pointerEvents: 'auto' },
        }))
```

</details>

**依据 10 · 源码核查**：[index.js:243-246](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L243-L246)

路径解析无需处于 DSH 目录。

```text
function toAbsolutePath(reference, dshHome) {
  if (reference.startsWith('~/') || reference.startsWith('~\\')) return join(homedir(), reference.slice(2))
  if (isAbsolute(reference)) return resolve(reference)
  return resolve(dshHome, reference)
```

**依据 11 · 源码核查**：[index.js:272-290](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L272-L290)

检查路径、扩展名及大小。

<details>
<summary>查看原文（19行）</summary>

```text
  const path = toAbsolutePath(reference, dshHome)
  const extension = extensionOf(path)
  const mime = FORMATS[extension]

  // Existence and file-ness are checked BEFORE the extension: they are the more
  // fundamental facts, and checking the extension first makes a directory or a
  // typo'd path report "unsupported format", which sends the user to the wrong
  // problem. Only a path that really is a file can have a meaningful format.
  if (!existsSync(path)) return { configured: true, problem: 'missing-file', extension, path }

  let stats
  try {
    stats = statSync(path)
  } catch {
    return { configured: true, problem: 'unreadable-file', extension, path }
  }
  if (!stats.isFile()) return { configured: true, problem: 'not-a-file', extension, path }
  if (mime === undefined) return { configured: true, problem: 'unsupported-format', extension, path }
  if (stats.size > MAX_MEDIA_BYTES) return { configured: true, problem: 'file-too-large', extension, path }
```

</details>

**依据 12 · 源码核查**：[index.js:805-824](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L805-L824)

无法取得宿主栅栏时无本地拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
  ctx.inject(['webServer'], (scoped) => {
    /** The trust fence needs the request, so each handler asks per request. */
    const rejectionFor = (req) => {
      let connection
      try {
        connection = scoped.get('connection')
      } catch {
        connection = undefined
      }
      if (connection === undefined || typeof connection.requestRejection !== 'function') return undefined
      return connection.requestRejection(req)
    }

    /** Reject anything that is not this machine's own authenticated client. */
    const guard = (req, res) => {
      const rejection = rejectionFor(req)
      if (rejection === undefined) return false
      res.writeHead(rejection)
      res.end()
      return true
```

</details>

#### 缺口

- 未在浏览器复现挂起，也未验证宿主 connection、代理暴露及媒体内容可信性。
  **影响**：失败可检测时有退出，但没有证据支持所有挂起都自动恢复。
  **进一步探讨**：故障注入悬挂配置、无 metadata、静音重试失败及缺 connection，分别量输入恢复和拒绝。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装、媒体兼容和退出代价在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

manifest 声明 Node 20+ 与即时 Web，作者安装后重启。可先保留默认静音与按钮跳过，在隔离 profile 用短片。Host 优先 Electron 文件框，其次 Windows PowerShell、macOS 脚本或 Linux zenity，选择器不可用时返回明确错误并可手填。容器通过扩展名初检，实际编解码由浏览器决定。清除记录空字符串并在下次加载不播放，保留用户视频，卸载后设置状态是否由宿主保留未测。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:52-70](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/README.md#L52-L70)

作者重启、卸载和清除路径。

<details>
<summary>查看原文（19行）</summary>

````text
以上方式装完都**重启 DSH** 生效。`--profile web` 只用于命令行；DSH 桌面版虽然内部也是 `web`
profile，但它自己决定，不需要你指定。

卸载：在 **设置 → 插件** 里停用或卸载，或者

```bash
dsh plugin --profile web remove dsh-splash-animation
```

> 界面里的插件市场只收录社区精选列表里的插件。如果那里搜不到本插件，用上面的方式安装即可。
> 通过 GitHub 安装需要本机装有 `git`。

## 使用

装好重启后就有开屏动画，播放的是插件自带的视频。

要换成自己的：打开 **设置 → 插件 → 开屏动画**，点「选择文件…」在弹出的文件框里挑一个视频，点「保存」。也可以直接把路径粘进输入框。

要彻底关掉：在同一个页面点「清除」。
````

</details>

**依据 2 · 作者声明**：[README.md:136-151](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/README.md#L136-L151)

作者说明容器与编解码区别。

<details>
<summary>查看原文（16行）</summary>

````text
## 支持的格式

视频用 `<video>` 播放：`mp4`、`m4v`、`webm`、`mov`、`mkv`、`ogv`、`ogm`、`mpg`、`mpeg`、`ts`

动图与静态图用 `<img>` 显示：`gif`、`apng`、`webp`、`avif`、`png`、`jpg`、`jpeg`、`svg`、`bmp`、`ico`

**推荐 `webm`(VP9) 或 `mp4`(H.264)**，这两个在所有平台上都能播放。

`mov` 和 `mkv` 只是容器，能否播放取决于内部编码：装 ProRes 或 DNxHD 就无法解码。转码命令：

```bash
ffmpeg -i input.mov -c:v libx264 -crf 20 -pix_fmt yuv420p -movflags +faststart -an opening.mp4
ffmpeg -i input.mov -c:v libvpx-vp9 -crf 32 -b:v 0 -an opening.webm
```

`-movflags +faststart` 把索引移到文件开头，播放器不必下完整个文件就能起播。
````

</details>

**依据 3 · 源码核查**：[package.json:26-36](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/package.json#L26-L36)

包包含默认资产与 Windows 文件选择脚本。

<details>
<summary>查看原文（11行）</summary>

```text
  "files": [
    "index.js",
    "client.js",
    "assets",
    "cordis.patch.yml",
    "icon.svg",
    "tools/pick-media-file.ps1",
    "README.md",
    "LICENSE"
  ],
  "//": "tools/ 里只有 pick-media-file.ps1 进包：宿主半在运行时按路径读取它来弹原生文件对话框，漏掉它会让文件选择静默降级成只能手输路径。其余 tools/ 是仓库自带的验证脚本，使用者不需要。",
```

</details>

**依据 4 · 源码核查**：[index.js:509-515](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L509-L515)

按平台选择文件框。

```text
async function pickMediaFile(ctx, initial) {
  const electronResult = await pickViaElectron(initial)
  if (electronResult !== undefined) return electronResult
  if (process.platform === 'win32') return pickViaPowerShell(ctx, initial)
  if (process.platform === 'darwin') return pickViaOsa(initial)
  return pickViaZenity(initial)
}
```

**依据 5 · 源码核查**：[index.js:930-947](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L930-L947)

选择器不可用时返回错误。

<details>
<summary>查看原文（18行）</summary>

```text
    // Opens a native dialog in the Host process; the browser cannot read a local
    // file path, so the pick has to happen here.
    scoped.effect(() => scoped.webServer.register({
      kind: 'exact',
      path: PICK_ROUTE,
      handler: async (req, res) => {
        if (guard(req, res)) return
        if (req.method !== 'POST') {
          res.writeHead(405, { Allow: 'POST' })
          res.end()
          return
        }
        const chosen = await pick(settings().src)
        // `undefined` means this host has no dialog at all; the settings page
        // then says so and points at the text field.
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
        res.end(JSON.stringify(chosen === undefined ? { ok: false, error: 'picker-unavailable' } : { ok: true, path: chosen }))
      },
```

</details>

**依据 6 · 源码核查**：[index.js:892-905](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L892-L905)

清除是持久选择。

<details>
<summary>查看原文（14行）</summary>

```text
        const src = body.src.trim().slice(0, MAX_SRC_LENGTH)
        try {
          writeState(dshHome, src)
        } catch (error) {
          ctx.logger.warn(`dsh-splash-animation: could not write the state file (${error.code ?? error.message})`)
          res.writeHead(500, { 'Content-Type': 'application/json; charset=utf-8' })
          res.end(JSON.stringify({ ok: false, error: 'write-failed' }))
          return
        }
        // Saving — including saving an empty path — records an explicit choice, so
        // the bundled default no longer applies afterwards. That is what makes
        // "clear it and it stops playing" true.
        const media = resolveEffectiveMedia(src, dshHome)
        res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
```

</details>

#### 缺口

- 未测真实首帧、解码 CPU/内存、各平台选择器与退出。
  **影响**：常规试用可撤回，但无输入故障时可能需要另路恢复配置。
  **进一步探讨**：记录首帧、到可输入时间、资源与清除/重启分钟，并覆盖挂起与格式错误。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 分段测首帧和输入恢复能否改善启动可见性？

**研究主题**：新假设与验证

#### 完整回答

现有计时分属 Host 遮罩与播放器。可以试验把首帧前等待与正常播放分开设定上限，并记录媒体首帧、异常类型和输入恢复时刻。与当前设置用同一浏览器，分别注入慢配置、无 metadata、健康长片和已解码后停滞，比较恢复延迟、提前误截和可诊断性。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:787-800](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/index.js#L787-L800)

已有 Host 遮罩定时器。

<details>
<summary>查看原文（14行）</summary>

```text
      table.push({
        kind: 'script',
        placement: 'head',
        text: '/* dsh-splash-animation-guard */'
          + 'try{'
          + 'var m=["dsh-splash-animation-cover","dsh-splash-animation-base"];'
          + 'var go=function(){try{'
          + 'var ss=document.head?document.head.getElementsByTagName("style"):[],doomed=[];'
          + 'for(var i=0;i<ss.length;i++){var x=ss[i].textContent||"";'
          + 'for(var j=0;j<m.length;j++){if(x.indexOf(m[j])!==-1){doomed.push(ss[i]);break}}}'
          + 'for(var k=0;k<doomed.length;k++){doomed[k].remove()}}catch(e){}};'
          + 'var t=setTimeout(go,10000);'
          + 'globalThis.__DSH_SPLASH_COVER_GUARD__={release:go,clear:function(){clearTimeout(t)}}'
          + '}catch(e){}',
```

</details>

**依据 2 · 源码核查**：[client.js:291-315](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L291-L315)

现有播放器迟到兜底算法。

<details>
<summary>查看原文（25行）</summary>

```text
    const FALLBACK_SLACK_MS = 5000

    /** Rescue timeout when a video never reports a length at all. */
    const UNKNOWN_LENGTH_TIMEOUT_MS = 120000

    /**
     * Delay, in milliseconds, before the rescue timer may dismiss the overlay.
     *
     * Pure and exported to the test hooks because this single expression caused a
     * real defect: an earlier version armed the timer before metadata existed,
     * where `length` is `NaN`, and fell back to the readiness floor — cutting an
     * 8-second clip off at 2.5 seconds. The rule that prevents it is "never let a
     * guessed duration beat a known one", and that is what this encodes.
     * @param lengthSeconds - the media length, or `NaN`/`0` when unknown.
     * @param settings - the effective settings.
     * @returns the delay in milliseconds.
     */
    function fadeDelayFor(lengthSeconds, settings) {
      const known = typeof lengthSeconds === 'number' && Number.isFinite(lengthSeconds) && lengthSeconds > 0
      if (!known) return UNKNOWN_LENGTH_TIMEOUT_MS
      // An explicit shorter runtime is a deliberate cut, so it fires exactly on
      // time and is the primary exit rather than a rescue.
      if (settings.duration > 0 && settings.duration < lengthSeconds * 1000) return settings.duration
      return lengthSeconds * 1000 + FALLBACK_SLACK_MS
    }
```

</details>

**依据 3 · 源码核查**：[client.js:543-549](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L543-L549)

现有计时依赖事件。

```text
          const armFallback = () => {
            if (fadeTimer !== undefined) window.clearTimeout(fadeTimer)
            fadeTimer = after(fadeDelayFor(element.duration, settings), dismiss)
          }

          element.addEventListener('loadedmetadata', armFallback)
          element.addEventListener('durationchange', armFallback)
```

**依据 4 · 源码核查**：[client.js:635-640](https://github.com/KDDKBD/DeepSeek-splash-animation/blob/bd82a5718507ecb752f04492d9639058ee9291d8/client.js#L635-L640)

实际输入恢复前的淡出计时。

```text
      React.useEffect(() => {
        if (phase !== 'out') return undefined
        const fade = num(session.settings && session.settings.fadeOutMs, FALLBACK.fadeOutMs)
        const id = window.setTimeout(() => setSession({ phase: 'done' }), fade)
        return () => window.clearTimeout(id)
      }, [phase, session.settings])
```

#### 缺口

- 未知显式首帧上限是否会打断健康慢片。
  **影响**：若提前误截大于输入恢复收益，计时应由实际首帧数据校准。
  **进一步探讨**：用预先定义的故障记录和健康片时长作对照，区分无故障结束与失败退让。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
