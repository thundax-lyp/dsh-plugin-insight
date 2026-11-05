# dsh-startup-secret

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f159b63](https://github.com/huzhengcai471-crypto/dsh-startup-secret/tree/f159b63dc38c2b85e8c18554c7a40213e8663c1a)

<!-- BEGIN META -->
[![GitHub ★ 190](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=190&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/huzhengcai471-crypto/dsh-startup-secret)
<!-- END META -->

> **功能**：为 DSH 提供可配置的主题启动动画、声音、立绘和演出式身份确认界面。

> **亮点**：它把主题动画、持久配置与设置预览组合成启动过程，提供个人化呈现而未新增任务交付能力。[Q01](#research-q01)、[Q02](#research-q02)

> **主要限制**：访问密码保存在配置并由浏览器比较，自动播放与跳过可以绕开，不应当作工作台安全认证。[Q03](#research-q03)

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
  - [Q01 · 启动动画改变什么流程，适合什么任务？](#detail-section-11)
  - [Q02 · 宿主和浏览器如何共同接入，配置怎样落盘？](#detail-section-12)
  - [Q03 · 访问密码是否形成真实的访问控制？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复有什么实际代价？](#detail-section-14)
  - [Q05 · 什么范围可以试用，下一步最有价值的设计验证是什么？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：喜欢主题化开场的 DSH 用户，可配置身份文案、图案和声音，并在动画结束后进入工作台。

直接启动工作台不承担额外动画等待；本组件的价值是个人化呈现，并非任务结果或真实认证。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 主题动画与声音 | 个人化开场呈现 | 浏览器与素材可用；效果未运行核实 |
| 设置保存和重播 | 调整文案、模式和音量 | 配置API和文件可写 |
| 演出式口令确认 | 动画中的身份互动 | 浏览器比较，可跳过，不是认证 |
| 跳过与退出清理 | 返回工作台 | 正常路径有清理，任意失败保证未知 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node >=20、DSH web客户端 | 必需 | 加载包与浏览器界面 | 兼容需实际检查 |
| webServer路由与tapIndex | Host接入必需 | 提供配置、资源和首屏注入 | Host跳过，客户端自举仍需资源可达 |
| slots设置区 | 设置界面必需 | 调整文案与动画 | 无设置入口 |
| 浏览器音频与语音能力 | 声音操作条件 | 播放素材或朗读 | 声音效果和回退需核实 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装并备份配置，保持可跳过 | 路由与设置页可访问 |
| 配置 | 用户保存模式、文案和音量 | API返回保存成功 |
| 播放 | 浏览器加载动画并交互推进 | 结束回工作台且能滚动 |
| 恢复 | 用户跳过或禁用插件 | 原启动流程恢复；备份配置可恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 包与素材本地存储，金额未知 | 安装、重启和偏好调整，耗时未知 | 不使用真实认证口令 |
| 持续 | 动画、音频与语音资源未测 | 每次或每日等待，时间未知 | 不代表提高任务效率 |
| 失败恢复 | 排障资源未测 | 跳过、禁用、配置恢复 | 9秒兜底并非任意动画故障保证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 主题化启动 | Host注入和客户端设置已接线 | 目标宿主的完整呈现与满意度 |
| 结束后交还工作台 | 正常结束清理滚动锁与节点 | 所有异常下都可恢复 |
| 身份确认演出 | 浏览器比较口令与跳过入口存在 | 不形成服务端访问控制 |

> **思考**：访问密码保存在配置并由浏览器比较，自动播放与跳过可以绕开，不应当作工作台安全认证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：它把主题动画、持久配置与设置预览组合成启动过程，提供个人化呈现而未新增任务交付能力。[Q01](#research-q01)、[Q02](#research-q02)

[Q02](#research-q02) 配置临时文件后rename及输入规范化值得复用，但共享DSH_HOME配置影响隔离。[Q04](#research-q04) 释放锁的清理不能被宽泛解释为任意失败都可恢复。

<a id="detail-section-5"></a>

### 1.4 主要限制

访问密码保存在配置并由浏览器比较，自动播放与跳过可以绕开，不应当作工作台安全认证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

只以个性化呈现试用，保持可跳过、口令为空，先检查退出后滚动与原工作台；不要把它当安全屏障。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持主题呈现和配置机制；启动体验收益未知，安全认证不成立，未来释放机制仍为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/client.js、lib/splash.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向检查Host路由、配置、客户端接入与splash口令、跳过及结束；未执行目标代码或全部素材。
- 下一步：在可恢复profile检查播放、跳过、配置保存和滚动释放，再对照脚本接管后失败的恢复行为。

**分析版本**

- **仓库**：[huzhengcai471-crypto/dsh-startup-secret](https://github.com/huzhengcai471-crypto/dsh-startup-secret)
- **版本号**：1.5.2（[固定提交 f159b63](https://github.com/huzhengcai471-crypto/dsh-startup-secret/tree/f159b63dc38c2b85e8c18554c7a40213e8663c1a)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可将口令明确标为演出用途，并验证动画接管后独立释放机制是否减少阻塞；尚未实现或验证。[Q05](#research-q05)

在可恢复profile检查播放、跳过、配置保存和滚动释放，再对照脚本接管后失败的恢复行为。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 11 | 1187 | — | — | 11749 |
| .js | source | 4 | 3186 | 2582 | 531 | — |
| .mjs | test | 6 | 1825 | 1535 | 155 | — |

</details>

**活跃度**

[![近30天新建 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=2&color=737b86&logo=github)](https://github.com/huzhengcai471-crypto/dsh-startup-secret/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/huzhengcai471-crypto/dsh-startup-secret/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：主题启动过程能否在可恢复的边界内提供个人化呈现，访问密码的实际边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 启动动画改变什么流程，适合什么任务？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是 DSH web/desktop 的启动仪式与个性化界面组件，适合偏好主题化开场、身份文案、语音和立绘的个人用户。作者描述黑幕、徽章、交互授权到揭幕的顺序；相对直接进入工作台，它增加一段可配置的呈现过程，合格结果是动画结束后完整交还工作台。它没有为用户新增办公交付物，也没有证据表明开场动画改善任务质量。对于追求最短启动路径的人，直接工作台反而更贴合目标。二次创作素材不等于本组件原创能力，素材使用条件还需按作者声明理解。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-10](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/README.md#L1-L10)

作者描述场景与二次创作边界。

<details>
<summary>查看原文（10行）</summary>

```text
# dsh-startup-secret

DSH 的启动界面与启动动画插件（二次创作版）。

长征机主题开机动画：黑幕徽章标识 → 过曝洗白 → 暗色「技术档案」底板 →
五步交互式访问授权 → 色散故障揭幕。右下角配赛博电子风人物立绘（可切换，也可设为「空」）。
播放方式可三档设置：完全自动播放 / 仅需点击一次进入 / 不自动播放。
安装后首次启动还会弹出一次「降世」事件窗口（可在设置里改成每次都弹）。

> 本作品为二次创作，仅用于学习交流，没有任何商业用途。如有侵权，请联系移除。
```

</details>

**依据 2 · 源码核查**：[lib/index.js:38-76](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L38-L76)

默认模式、声音、主题与身份配置。

<details>
<summary>查看原文（39行）</summary>

```text
const DEFAULTS = {
  enabled: true,
  mode: 'session',            // session | daily（原 always 已删除，自动迁移到 session）
  theme: 'dark',             // light | dark
  speed: 1,
  autoPlay: 'off',           // full=完全自动播放 / once=仅需点击一次进入（需空密码）/ off=不自动播放
  requireInteraction: true,   // 旧字段：仅用于把老配置迁移到 autoPlay
  allowSkip: true,
  sound: true,                // 界面音效（WebAudio 合成，无音频文件）
  soundVolume: 0.5,
  voice: true,                // 女声播报（Web Speech API）
  voiceLang: 'en',            // en | zh | both
  voiceName: 'zhixing-cn',              // '' = 自动挑（按分数优先神经网络女声）；另有 zhixing-cn / cm-zh / calmlady-jp / pessimistic-ru / rm-ru / announcer-kr 六档真声音色
  voiceRate: 0.88,            // 电影旁白档：比朗读慢，字与字之间才有重量
  voicePitch: 0.85,           // 压低音调，深沉的 AI 女声
  voiceVolume: 0.9,
  voiceCue: true,             // 念台词前的一声轻提示
  sfx: 'audio',               // 音效来源：audio=lib/assets 里的真素材 / synth=现场合成
  voiceSource: 'asset',       // 语音来源：asset=优先用真声素材（拿不到自动回落 TTS）/ tts=全 TTS
  voiceLead: 240,             // 提示音之后留一小段空白再开口
  mascot: 0,                  // 右下角人物立绘：0=水手服 1=中山装 2=J装 3=最美好的主唱 -1=空（不显示）
  emblem: 1,                  // 中央/终幕图案：0=徽章 1=东亚防御倡议（默认）
  eventWindow: false,         // 降世事件窗口：默认关闭；开启后每次动画结束都弹出（另：首次启动弹一次）
  identity: 'Chunhua',        // ← 设置页里可改的「身份名称」
  identityId: 'A000001',
  accessLevel: '最高权限',
  identityPassword: '',       // ← 第二步身份确认的访问密码（空 = 不启用密码校验）
  brand1: '银河意识体',
  brand2: 'LONG MARCH',
  brand3a: '长征机',
  brand3b: '量子跃迁态',
  orgZh: '伟大智能统辖',
  orgEn: 'GREAT INTELLIGENT OVERLORDSHIP',
  orgSub: '效率高于一切',
  welcomeBox: '亚洲人民统辖体',
  footer: 'Powered By LONG MARCH',
  accent: '#c70000',
  glitchA: '#ff3b30',
  glitchB: '#ce0912'
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 宿主和浏览器如何共同接入，配置怎样落盘？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 注册配置、样式、脚本及内联素材路由，并用 tapIndex 将首屏遮罩、配置和运行时注入网页；客户端另注册设置区，读写同一配置接口并可重播。配置由 DSH_HOME 或 ~/.dsh 下的 dsh-startup.json 承担，写入先生成临时文件再 rename，数值与枚举经 normalize 收敛。无路由能力时 Host 返回而不抛错；客户端自举仍从 /dsh-startup 拉配置与静态文件，故“无 webServer 也能自举”并不证明无 HTTP 载体完整可用。路由缺失可能导致自举加载失败后放行主界面。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:160-175](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L160-L175)

配置读写和临时文件替换。

<details>
<summary>查看原文（16行）</summary>

```text
function readConfig() {
  try {
    const raw = fs.readFileSync(CONFIG_FILE, 'utf8')
    return normalize(JSON.parse(raw))
  } catch (err) {
    return { ...DEFAULTS }
  }
}

function writeConfig(next) {
  const cfg = normalize(next)
  fs.mkdirSync(path.dirname(CONFIG_FILE), { recursive: true })
  const tmp = CONFIG_FILE + '.tmp'
  fs.writeFileSync(tmp, JSON.stringify(cfg, null, 2), 'utf8')
  fs.renameSync(tmp, CONFIG_FILE)
  return cfg
```

</details>

**依据 2 · 源码核查**：[lib/index.js:272-311](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L272-L311)

无路由返回及浏览器信任检查包装。

<details>
<summary>查看原文（40行）</summary>

```text
function apply(ctx) {
  const disposers = []
  const webServer = resolveWebServer(ctx)

  /** 没有可注册路由的 HTTP 载体：桌面端若走 IPC 下发前端就是这种形态。
      什么都不注册（plugin 仍然 APPLIED，不报错），页面由客户端半侧自举。 */
  if (!hasRoutes(webServer)) {
    try {
      ctx.logger?.warn?.(
        '[' + NS + '] 当前 profile 没有可用的 webServer（桌面端可能用 file:// + IPC 下发前端）；' +
        'Host 半侧跳过路由与首屏注入，改由浏览器半侧自举启动界面。'
      )
    } catch (err) { /* 日志失败不影响加载 */ }
    return
  }

  /** 浏览器信任栅栏：自定义路由必须过一遍，否则可被任意网页读写。 */
  function rejected(req, res) {
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') return false
      const code = conn.requestRejection(req)
      if (code === undefined || code === null || code === false) return false
      res.statusCode = typeof code === 'number' ? code : 403
      res.end()
      return true
    } catch (err) {
      return false
    }
  }

  function registerRoute(route) {
    const inner = route && route.handler
    const wrapped = Object.assign({}, route, {
      handler: async (req, res) => {
        if (rejected(req, res)) return
        return inner(req, res)
      }
    })
    return webServer.register(wrapped)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:373-408](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L373-L408)

配置API读写流程。

<details>
<summary>查看原文（36行）</summary>

```text
disposers.push(registerRoute({
    kind: 'exact',
    path: ROUTE_BASE + '/config',
    handler: async (req, res) => {
      const method = (req.method || 'GET').toUpperCase()
      if (method === 'GET') {
        sendJson(res, 200, { ok: true, version: PLUGIN_VERSION, config: readConfig(), defaults: DEFAULTS, file: CONFIG_FILE })
        return
      }
      if (method !== 'POST') {
        sendJson(res, 405, { ok: false, error: 'method not allowed' })
        return
      }
      const text = await readBody(req)
      let payload = {}
      try {
        payload = text ? JSON.parse(text) : {}
      } catch (err) {
        sendJson(res, 400, { ok: false, error: 'invalid json' })
        return
      }
      try {
        if (payload && payload.action === 'reset') {
          const cfgNow = writeConfig(DEFAULTS)
          sendJson(res, 200, { ok: true, version: PLUGIN_VERSION, config: cfgNow, defaults: DEFAULTS })
          return
        }
        const current = readConfig()
        const patch = payload && typeof payload.patch === 'object' && payload.patch ? payload.patch : payload
        const cfgNow = writeConfig({ ...current, ...patch })
        sendJson(res, 200, { ok: true, version: PLUGIN_VERSION, config: cfgNow, defaults: DEFAULTS })
      } catch (err) {
        sendJson(res, 500, { ok: false, error: String((err && err.message) || err) })
      }
    }
  }))
```

</details>

**依据 4 · 源码核查**：[lib/client.js:786-825](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/client.js#L786-L825)

自举仍依赖配置与路由，并挂设置区。

<details>
<summary>查看原文（40行）</summary>

```text
    function selfBoot() {
      try {
        if (typeof window === 'undefined' || typeof document === 'undefined') return
        if (!document.body) return
        if (window.__DSH_STARTUP_BOOT__) return          /* 已被 Host 或本侧接管 */
        if (window.__DSH_STARTUP__) return               /* 配置已在页面上：Host 注入过 */
        if (document.getElementById('dsh-startup-root')) return
        /* 已经出过错的地方不要再扑一次 */
        if (window.__DSH_STARTUP_FAILED__ === true) return
        markBooted()
        fetch(API, { headers: { Accept: 'application/json' } })
          .then(function (r) { return r.json() })
          .then(function (j) { return j && j.ok === true ? j.config : null })
          .catch(function () { return null })
          .then(function (cfg) {
            cfg = cfg || { enabled: true, mode: 'session', speed: 1 }
            if (cfg.enabled === false) return
            var today = new Date().toISOString().slice(0, 10)
            if (cfg.mode === 'session' && readFlag('sessionStorage', 'dsh-startup-screen:shown') === '1') return
            if (cfg.mode === 'daily' && readFlag('localStorage', 'dsh-startup-screen:day') === today) return
            /* 回填判定标记，保证与 Host 侧同款语义（splash.js 会读这两个键） */
            if (cfg.mode === 'session') writeFlag('sessionStorage', 'dsh-startup-screen:shown', '1')
            if (cfg.mode === 'daily') writeFlag('localStorage', 'dsh-startup-screen:day', today)
            return injectRoot(cfg)
          })
          .catch(function () { /* 自举失败就算了，页面本来就是好的 */ })
      } catch (e) { /* 自举是兜底，绝不许把宿主带崩 */ }
    }

    /* ── 插件 ────────────────────────────────────────────────────────────── */
    var inject = ['slots']

    function apply(ctx) {
      /* 桌面端兜底：Host 的 index 注入不生效时，由这里自举启动界面。
         正常 web 流程下 __DSH_STARTUP__/__DSH_STARTUP_BOOT__ 已就位，本调用直接返回。 */
      selfBoot()
      ctx.slots.inject('settings.section', function () {
        return ctx.slots.register(
          { name: 'settings.section', id: 'startup-screen', order: 26, label: '启动动画' },
          function () { return h(Panel, {}) }
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 访问密码是否形成真实的访问控制？

**研究主题**：缺陷与关键质疑

#### 完整回答

不能把它当作账号或工作台的安全认证。密码在配置 JSON 中保存，GET /config 返回完整配置，tapIndex 也把配置放进 window；splash.js 在浏览器直接比较输入与 C.identityPassword。全自动模式直接推进、once 模式跳过密码闸，允许跳过时 Escape 可结束，且全局 API 暴露 skip/finish/config。它适合演出中的身份确认，不能保护会话、路由或设备。Host 的 connection.requestRejection 只是另一层浏览器请求信任检查，缺少服务或检查异常会返回false；这个前置条件不能用动画密码替代。未在实际网络环境复现访问，以上是固定源码可见的边界。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:288-300](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L288-L300)

浏览器信任检查缺失或异常时不拒绝。

<details>
<summary>查看原文（13行）</summary>

```text
  /** 浏览器信任栅栏：自定义路由必须过一遍，否则可被任意网页读写。 */
  function rejected(req, res) {
    try {
      const conn = (typeof ctx.get === 'function' ? ctx.get('connection') : undefined) || ctx.connection
      if (!conn || typeof conn.requestRejection !== 'function') return false
      const code = conn.requestRejection(req)
      if (code === undefined || code === null || code === false) return false
      res.statusCode = typeof code === 'number' ? code : 403
      res.end()
      return true
    } catch (err) {
      return false
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:373-379](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L373-L379)

配置GET返回完整配置。

```text
disposers.push(registerRoute({
    kind: 'exact',
    path: ROUTE_BASE + '/config',
    handler: async (req, res) => {
      const method = (req.method || 'GET').toUpperCase()
      if (method === 'GET') {
        sendJson(res, 200, { ok: true, version: PLUGIN_VERSION, config: readConfig(), defaults: DEFAULTS, file: CONFIG_FILE })
```

**依据 3 · 源码核查**：[lib/index.js:423-430](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L423-L430)

完整配置被注入window。

```text
    const body =
      /* 首屏黑幕层：纯 CSS 覆盖全屏，由 html.dsu-lock 驱动，不依赖任何脚本。
         即便挂载点还没被解析到、splash.js 还没下载完，用户看到的也是黑幕而不是白底工作台。 */
      '<div id="dsh-startup-veil" aria-hidden="true"></div>' +
      '<div id="dsh-startup-root" class="dsu-root dsu-boot"></div>' +
      '<script>window.__DSH_STARTUP_BOOT__="index";window.__DSH_STARTUP_VERSION__=' + safeJson(PLUGIN_VERSION) + ';window.__DSH_STARTUP_CONFIG_URL__=' + safeJson(ROUTE_BASE + '/config') + ';window.__DSH_STARTUP__=' + safeJson(cfg) + ';' + BOOTSTRAP_JS + '</script>' +
      '<script defer src="' + ROUTE_BASE + '/asset-data.js"></script>' +
      '<script defer src="' + ROUTE_BASE + '/splash.js"></script>'
```

**依据 4 · 源码核查**：[lib/splash.js:775-809](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/splash.js#L775-L809)

自动模式与浏览器明文比较。

<details>
<summary>查看原文（35行）</summary>

```text
         off ：第 1、2 步都等（grant/confirm 两步）。
         第二步的密码校验只在「不自动播放」档启用，所以用 needPwd 兜住，
         保证「仅需点击一次进入」不会漏一道密码闸。 */
      var isWaitStep = step && (step.action === 'grant' || step.action === 'confirm')
      if (C.autoPlay === 'full') return resolve()
      if (C.autoPlay === 'once' && !(step && step.action === 'grant')) return resolve()
      if (C.autoPlay === 'off' && !isWaitStep) return resolve()
      /* 第二步密码校验：设置了 identityPassword 才拦截，输对才推进 */
      var needPwd = step && step.action === 'confirm' && C.identityPassword
      /* 「仅需点击一次进入」要求空密码；万一配置里还留着密码，这里跳过密码闸，
         否则等一次点击就变成「必须先输对密码」，与选项描述不符。 */
      if (C.autoPlay === 'once') needPwd = false
      /* 空档里刚按过 Enter（「不自动播放」连按两下）→ 这一步直接放行。
         有密码时不这么做：密码必须真的输进去。 */
      if (!needPwd && consumeRecentPress()) return resolve()
      if (needPwd && ui.pwdInput) {
        ui.pwdInput.value = ''
        if (ui.pwdErr) ui.pwdErr.textContent = ''
        ui.pwdInput.classList.remove('dsu-pwd-shake')
        try { ui.pwdInput.focus() } catch (e) {}
      }
      var done = false
      function fin() {
        if (done) return
        if (needPwd) {
          var input = ui.pwdInput ? ui.pwdInput.value : ''
          if (input !== C.identityPassword) {
            if (ui.pwdErr) ui.pwdErr.textContent = '密码错误，无法进入'
            if (ui.pwdInput) {
              ui.pwdInput.classList.add('dsu-pwd-shake')
              ui.pwdInput.value = ''
              try { ui.pwdInput.focus() } catch (e) {}
            }
            audio.deny()
            return
```

</details>

**依据 5 · 源码核查**：[lib/splash.js:1806-1832](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/splash.js#L1806-L1832)

跳过及全局控制API。

<details>
<summary>查看原文（27行）</summary>

```text
  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') requestSkip()
    })
  } else if (ui.skip) {
    ui.skip.hidden = true
  }

  /* 对外 API：settings 面板里的"立即预览"按钮和重播都走它 */
  window.__DSH_STARTUP_API__ = {
    /* 设置页试听与冒烟测试用：直接念一行 */
    speak: function (en, zh) { voice.say(en, zh) },
    speakName: function (n) { return voice.speakName(n) },
    get voice() { return voice.current() },
    replay: replayLatest,
    skip: requestSkip,
    finish: finish,
    config: C
```

</details>

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复有什么实际代价？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

需要 Node >=20 的包加载环境、DSH web 客户端和可达的本组件路由；设置页面依赖 slots，声音效果取决于浏览器音频/语音与素材加载条件。用户首次安装、重启并设置文案和播放方式，持续使用要承担动画等待与可能的声音干扰；没有启动耗时、资源或满意度对照数据。失败路径有 9 秒的未接管检测以及正常结束清理滚动锁和遮罩，但该检测只针对仍带 dsu-boot 的根节点，动画接管后的任意故障不属于这条兜底保证。故障恢复可以跳过或禁用插件，配置文件需用户自行备份，不应在其中填真实认证密码。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:38-50](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/package.json#L38-L50)

Node与客户端设置依赖。

<details>
<summary>查看原文（13行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:234-246](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/index.js#L234-L246)

Host未接管超时只检查boot类。

<details>
<summary>查看原文（13行）</summary>

```text
const BOOTSTRAP_JS = `(function(){try{
var d=document.documentElement;
/* 第一件事：先锁住并铺黑。后面无论走哪条分支、哪怕抛异常，这一行都已经生效，
   所以不会再出现「白底闪一下」的窗口期。 */
d.classList.add('dsu-lock');
var c=window.__DSH_STARTUP__||{};
var root=document.getElementById('dsh-startup-root');
var off=!c.enabled;
if(!off&&c.mode==='session'&&sessionStorage.getItem('dsh-startup-screen:shown')==='1')off=true;
if(!off&&c.mode==='daily'&&localStorage.getItem('dsh-startup-screen:day')===new Date().toISOString().slice(0,10))off=true;
if(off){window.__DSH_STARTUP_SKIP__=true;d.classList.remove('dsu-lock');if(root&&root.parentNode)root.parentNode.removeChild(root);}
else{/* 兜底：连 splash.js 都没跑起来（404/被拦/语法错）时，9 秒后无条件放行，绝不锁黑屏 */setTimeout(function(){try{var r=document.getElementById('dsh-startup-root');if(r&&r.className&&r.className.indexOf('dsu-boot')!==-1){if(r.parentNode)r.parentNode.removeChild(r);var v=document.getElementById('dsh-startup-veil');if(v&&v.parentNode)v.parentNode.removeChild(v);document.documentElement.classList.remove('dsu-lock');if(document.body)document.body.style.overflow='';window.__DSH_STARTUP_FAILED__=true;}}catch(e){}},9000);}
}catch(e){} })()`
```

</details>

**依据 3 · 源码核查**：[lib/client.js:756-781](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/client.js#L756-L781)

自举资源加载与同类9秒判断。

<details>
<summary>查看原文（26行）</summary>

```text
      loadCss(BOOT_ROUTE + '/splash.css', function (err) {
        if (err) { guard(err); return }
        cssReady = true
        guard(null)
      })

      /* 配置先落 window：splash.js 载入时直接读它 */
      /* 与 Host 注入保持一致，供立即预览在重播前读取最新保存配置。 */
      window.__DSH_STARTUP_CONFIG_URL__ = API
      window.__DSH_STARTUP__ = cfg || {}
      try {
        delete window.__DSH_STARTUP_LOADED__
      } catch (e) { window.__DSH_STARTUP_LOADED__ = undefined }
      /* 音频素材内联脚本，先于 splash.js 载入，供其读取 window.__DSA_ASSETS__ */
      loadScript(BOOT_ROUTE + '/asset-data.js', function () {})
      loadScript(BOOT_ROUTE + '/splash.js?t=' + Date.now(), function (err) {
        if (err) { guard(err); return }
        scriptReady = true
        guard(null)
      })

      /* 自愈：样式与脚本都拿到了、这个标记还在，就说明动画没接管，放行 */
      setTimeout(function () {
        try {
          var r = document.getElementById('dsh-startup-root')
          if (r && r.className && r.className.indexOf('dsu-boot') !== -1) release(false)
```

</details>

**依据 4 · 源码核查**：[lib/splash.js:1778-1803](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/splash.js#L1778-L1803)

正常结束释放锁、移除根和遮罩。

<details>
<summary>查看原文（26行）</summary>

```text
    voice.stop()
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    try {
      if (C.mode === 'session') window.sessionStorage.setItem('dsh-startup-screen:shown', '1')
      if (C.mode === 'daily') {
        window.localStorage.setItem('dsh-startup-screen:day', new Date().toISOString().slice(0, 10))
      }
    } catch (err) { /* 隐私模式下不可写，忽略 */ }
    /* 解锁：Host 注入的关键样式用 html.dsu-lock 锁滚动，这里必须一并摘掉，
       否则揭幕后主界面会永远滚不动。 */
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    /* 首屏黑幕层：dsu-lock 撤掉后它已不可见，这里顺手把节点清掉别留垃圾 */
    var veil = document.getElementById('dsh-startup-veil')
    if (veil && veil.parentNode) veil.parentNode.removeChild(veil)
    root.classList.remove('dsu-boot')
    /* 退场：直接摘掉，不做长淡出。
       以前是「620ms 淡出 + 再等 900ms 才移除」，中间那段时间 root 仍是一块
       z-index 2147483000 的全屏层（只是越来越透明），视觉上就是
       「动画结束/按 Enter 之后还要黑一会儿」（2026-10-19 用户反馈）。
       揭幕那一帧 root 已经整体淡到接近全透明（dsu-handoff 的 780ms 过渡跑完才会走到这里），
       所以这里直接移除不会有突兀的跳变。 */
    root.classList.add('dsu-gone')
    if (root.parentNode) root.parentNode.removeChild(root)
    try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
```

</details>

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么范围可以试用，下一步最有价值的设计验证是什么？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可以仅作为本地个性化开场试用，先保持允许跳过、密码为空及音量可控，验收一次播放、设置保存、重播和回到主界面后的滚动。任何黑屏、滚动锁残留或启动影响都应停用，并从备份恢复配置。由客户端比较和自动绕过可推导一个设计方向，将“演出用口令”明确改名并移除真实安全暗示，同时给动画接管后的步骤增加独立释放看门狗。该方向尚未实现；用脚本加载后抛错、语音不返回及配置接口失败的对照场景检查恢复时间，若新增兜底误结束正常动画且没有减少阻塞，则否定其价值。

#### 证据与依据

**依据 1 · 源码核查**：[lib/splash.js:775-809](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/splash.js#L775-L809)

口令不是认证边界，支持重命名假设。

<details>
<summary>查看原文（35行）</summary>

```text
         off ：第 1、2 步都等（grant/confirm 两步）。
         第二步的密码校验只在「不自动播放」档启用，所以用 needPwd 兜住，
         保证「仅需点击一次进入」不会漏一道密码闸。 */
      var isWaitStep = step && (step.action === 'grant' || step.action === 'confirm')
      if (C.autoPlay === 'full') return resolve()
      if (C.autoPlay === 'once' && !(step && step.action === 'grant')) return resolve()
      if (C.autoPlay === 'off' && !isWaitStep) return resolve()
      /* 第二步密码校验：设置了 identityPassword 才拦截，输对才推进 */
      var needPwd = step && step.action === 'confirm' && C.identityPassword
      /* 「仅需点击一次进入」要求空密码；万一配置里还留着密码，这里跳过密码闸，
         否则等一次点击就变成「必须先输对密码」，与选项描述不符。 */
      if (C.autoPlay === 'once') needPwd = false
      /* 空档里刚按过 Enter（「不自动播放」连按两下）→ 这一步直接放行。
         有密码时不这么做：密码必须真的输进去。 */
      if (!needPwd && consumeRecentPress()) return resolve()
      if (needPwd && ui.pwdInput) {
        ui.pwdInput.value = ''
        if (ui.pwdErr) ui.pwdErr.textContent = ''
        ui.pwdInput.classList.remove('dsu-pwd-shake')
        try { ui.pwdInput.focus() } catch (e) {}
      }
      var done = false
      function fin() {
        if (done) return
        if (needPwd) {
          var input = ui.pwdInput ? ui.pwdInput.value : ''
          if (input !== C.identityPassword) {
            if (ui.pwdErr) ui.pwdErr.textContent = '密码错误，无法进入'
            if (ui.pwdInput) {
              ui.pwdInput.classList.add('dsu-pwd-shake')
              ui.pwdInput.value = ''
              try { ui.pwdInput.focus() } catch (e) {}
            }
            audio.deny()
            return
```

</details>

**依据 2 · 源码核查**：[lib/splash.js:1778-1832](https://github.com/huzhengcai471-crypto/dsh-startup-secret/blob/f159b63dc38c2b85e8c18554c7a40213e8663c1a/lib/splash.js#L1778-L1832)

结束清理及手动逃生入口。

<details>
<summary>查看原文（55行）</summary>

```text
    voice.stop()
    if (clockTimer) { clearInterval(clockTimer); clockTimer = null }
    try {
      if (C.mode === 'session') window.sessionStorage.setItem('dsh-startup-screen:shown', '1')
      if (C.mode === 'daily') {
        window.localStorage.setItem('dsh-startup-screen:day', new Date().toISOString().slice(0, 10))
      }
    } catch (err) { /* 隐私模式下不可写，忽略 */ }
    /* 解锁：Host 注入的关键样式用 html.dsu-lock 锁滚动，这里必须一并摘掉，
       否则揭幕后主界面会永远滚不动。 */
    document.documentElement.classList.remove('dsu-lock')
    document.documentElement.style.overflow = ''
    if (document.body) document.body.style.overflow = ''
    /* 首屏黑幕层：dsu-lock 撤掉后它已不可见，这里顺手把节点清掉别留垃圾 */
    var veil = document.getElementById('dsh-startup-veil')
    if (veil && veil.parentNode) veil.parentNode.removeChild(veil)
    root.classList.remove('dsu-boot')
    /* 退场：直接摘掉，不做长淡出。
       以前是「620ms 淡出 + 再等 900ms 才移除」，中间那段时间 root 仍是一块
       z-index 2147483000 的全屏层（只是越来越透明），视觉上就是
       「动画结束/按 Enter 之后还要黑一会儿」（2026-10-19 用户反馈）。
       揭幕那一帧 root 已经整体淡到接近全透明（dsu-handoff 的 780ms 过渡跑完才会走到这里），
       所以这里直接移除不会有突兀的跳变。 */
    root.classList.add('dsu-gone')
    if (root.parentNode) root.parentNode.removeChild(root)
    try { window.dispatchEvent(new CustomEvent('dsh-startup:done')) } catch (err) { /* noop */ }
  }

  function requestSkip() {
    if (skipped || finished) return
    skipped = true
    releaseAll()
    finish()
  }

  if (C.allowSkip && ui.skip) {
    ui.skip.hidden = false
    ui.skip.addEventListener('click', function (e) { e.stopPropagation(); requestSkip() })
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') requestSkip()
    })
  } else if (ui.skip) {
    ui.skip.hidden = true
  }

  /* 对外 API：settings 面板里的"立即预览"按钮和重播都走它 */
  window.__DSH_STARTUP_API__ = {
    /* 设置页试听与冒烟测试用：直接念一行 */
    speak: function (en, zh) { voice.say(en, zh) },
    speakName: function (n) { return voice.speakName(n) },
    get voice() { return voice.current() },
    replay: replayLatest,
    skip: requestSkip,
    finish: finish,
    config: C
```

</details>

#### 缺口

- 没有同条件的启动等待和使用偏好研究。
  **影响**：不能证明新增动画值得持续等待，采用结论仅限喜欢主题开场的个人试用。
  **进一步探讨**：对照直接启动和动画启动，记录能否顺利进入、等待时长及用户是否继续保留。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
