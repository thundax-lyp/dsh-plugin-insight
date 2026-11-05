# Plugin Manager

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/whyihaveyou/dsh-suite) [![npm 30d 1,244](https://img.shields.io/static/v1?label=npm+30d&message=1%2C244&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-manager) [![最新发布 2026-09-01](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-01&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@dsh-suite/plugin-manager)
<!-- END META -->

> **功能**：在 DSH Web 商店浏览目录、查看兼容信息并调用官方 CLI 安装和更新插件

> **亮点**：[Q01](#research-q01) 将发现、确认、真实日志和已装/更新集中到Web面板；[Q02](#research-q02) Host缓存和压缩减少重复目录传输。兼容徽章是外部元数据，不等于本机已验。

> **主要限制**：[Q03](#research-q03) 断流自动重发安装且Host无幂等/锁，原操作结果未知时可能并发副作用；仅包在盘可标mounted，timeout也不证明后代停止。便利界面尚缺可靠事务状态。

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
  - [Q01 · 为谁把什么工作连接起来？](#detail-section-11)
  - [Q02 · 目录、兼容与更新数据如何得到？](#detail-section-12)
  - [Q03 · 成功、流式失败和超时代表什么？](#detail-section-13)
  - [Q04 · 采用、权限和全周期成本如何判断？](#detail-section-14)
  - [Q05 · 怎样把便利安装改成可恢复操作？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web用户从查找插件到确认安装/管理更新，见 [Q01](#research-q01)。

原生只读清单、手查社区目录与手工dsh plugin CLI；安装协议和包管理继承宿主，不是独立安全包商店。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
|---|---|---|
| 商店目录 | 搜索分类与兼容展示 | 外部元数据非本机验收 |
| 安装/日志 | 调官方CLI并显示进度 | 断流重发非幂等，需重启验证 |
| 更新 | npm源版本检查/安装 | 简化semver与可变bare spec |
| 已装/卸载 | loader/包版本投影及remove | 卸载不撤销副作用 |

**流程与依赖**

#### 启动与依赖

| 条件 | 用途 | 边界 |
|---|---|---|
| DSH webServer/loader与Web slots | Host/UI接线 | 版本范围非运行验收 |
| PATH的dsh/npm及包管理器 | 安装/查询 | 进程树和生命周期副作用 |
| GH Pages/registry网络 | 目录/版本/包 | 缓存不证明实时兼容 |
| profile写权限 | 更改包与配置 | 服务器授权依赖外层宿主 |

#### 启动步骤

| 步骤 | 动作 | 判据/恢复 |
|---|---|---|
| 准备 | 隔离profile、备份package/lock/config | 核包来源和实际spec |
| 浏览 | 目录搜索并看兼容版本/日期 | 徽章不替本机验收 |
| 安装 | 确认一次并留日志 | 断流先查进程和落盘，不重发 |
| 生效 | 重启后查loader和真实功能 | dump子串不等于运行 |
| 退出 | 确认卸载与副作用 | 必要时从备份恢复profile |

**效果与成本**

#### 成本

| 阶段 | 现金资源 | 人工时间/未知 |
|---|---|---|
| 首次 | 网络、依赖磁盘 | profile备份、包审阅与接线，工时未知 |
| 持续 | 目录/npm查询、升级空间 | 重启及逐插件兼容，净节时未测 |
| 失败 | 可能继续子进程/重复生命周期 | 对账部分安装，恢复锁文件 |
| 退出 | 缓存和业务副作用可留存 | 卸载与恢复分开处理 |

#### 效果

| 效果 | 支持 | 未知 |
|---|---|---|
| 发现便利 | UI→Host→CLI链存在 | 用户成功率和节时 |
| 进度 | 真stdout/stderr NDJSON | 断流后的权威结果 |
| 兼容 | catalog版本/日期显示 | 当前宿主是否可用 |
| 安装成功 | 包在盘/配置子串检查 | active与真实业务验收 |

> **思考**：[Q03](#research-q03) 断流自动重发安装且Host无幂等/锁，原操作结果未知时可能并发副作用；仅包在盘可标mounted，timeout也不证明后代停止。便利界面尚缺可靠事务状态。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将发现、确认、真实日志和已装/更新集中到Web面板；[Q02](#research-q02) Host缓存和压缩减少重复目录传输。兼容徽章是外部元数据，不等于本机已验。

Host复用官方CLI、目录压缩/缓存与UI增量渲染是具体工程便利；stream异常fallback越过未知状态、进程终止无树证据、在盘/挂载混用削弱恢复。无本组件内auth不自动推出外层宿主无保护。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 断流自动重发安装且Host无幂等/锁，原操作结果未知时可能并发副作用；仅包在盘可标mounted，timeout也不证明后代停止。便利界面尚缺可靠事务状态。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议观察，先读目录并手工固定spec在隔离profile安装。安装断流先核操作状态与进程，避免界面重试；未补幂等/分层结果前不用于并发或批量重要profile。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码支持商店和官方CLI接线；安装状态、未知重试和资源停止有具体边界，未运行当前服务。

- 已检查：作者 README、包清单、源码路径 packages/plugins/plugin-manager/package.json、packages/plugins/plugin-manager/cordis.patch.yml、packages/plugins/plugin-manager/lib/client.js、packages/plugins/plugin-manager/lib/index.js 及固定范围 inventory；组件：packages/plugins/plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读取完整Host、browser流式安装/目录降级/确认及关键结果展示，未全审1074行布局/样式、外部目录生产和宿主认证实现。
- 下一步：本轮未安装、spawn目标CLI、访问目录/registry或运行浏览器。静态发现的重复副作用是可能路径，不称已复现事故。

**分析版本**

- **仓库**：[whyihaveyou/dsh-suite](https://github.com/whyihaveyou/dsh-suite)
- **版本号**：0.8.7（[固定提交 3073bd8](https://github.com/whyihaveyou/dsh-suite/tree/3073bd8895d2f8478b9cb06f6b265977d7511d65)）
- **版本日期**：2026-11-05（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 未验证的持久operation、profile串行、流重连与分层验收，可用断流/并发/未挂载在盘包反例推翻。

本轮未安装、spawn目标CLI、访问目录/registry或运行浏览器。静态发现的重复副作用是可能路径，不称已复现事故。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1484 | 1287 | 143 | — |
| .md | source | 1 | 124 | — | — | 2470 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/whyihaveyou/dsh-suite/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查商店便利与安装终态、重试及权限边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 为谁把什么工作连接起来？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH Web用户在Settings Plugins商店搜索社区目录、看描述/兼容徽章、确认后安装，再管理已装包/更新。双半插件：Host注册HTTP路由并spawn官方dsh plugin命令，browser通过module loader接UI slot；不另写包管理器。相对官网只读列表与复制CLI，增量是发现到安装、流式日志、组合串行安装和反馈入口。兼容/星标/风险来自外部目录，不是运行时审核；安装后仍需重启与真实功能验收。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-manager/package.json:1-46](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/package.json#L1-L46)

双半client与bundle入口声明。

<details>
<summary>查看原文（46行）</summary>

```text
{
  "name": "@dsh-suite/plugin-manager",
  "version": "0.8.7",
  "description": "DSH Web UI 插件应用商店：目录浏览/搜索/一键安装/兼容徽章/已装列表。A plugin store for DSH Web UI — catalog browse, search, one-click install, compat badges, installed list.",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "README.md",
    "cordis.patch.yml"
  ],
  "keywords": [
    "deepseek-harness",
    "dsh-plugin",
    "plugin-manager",
    "plugin-store",
    "dsh"
  ],
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/whyihaveyou/dsh-suite.git",
    "directory": "packages/plugins/plugin-manager"
  },
  "engines": {
    "node": "^22.19 || >=24"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ],
      "platform": "web"
    }
  }
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-manager/cordis.patch.yml:1-8](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/cordis.patch.yml#L1-L8)

Host注册composition。

```text
# @dsh-suite/plugin-manager bundle patch. Installed via:
#   dsh plugin --profile web add @dsh-suite/plugin-manager
# The node half (exports ".") provides the /plugin-manager/* HTTP routes
# (install + installed list); the browser half (exports "./client", declared in
# package.json dsh.client) injects the "Store" tab into Settings > Plugins.
- insert:
    - id: plugin-manager
      name: '@dsh-suite/plugin-manager'
```

**依据 3 · 源码核查**：[packages/plugins/plugin-manager/lib/client.js:502-565](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/client.js#L502-L565)

流式与buffered安装操作。

<details>
<summary>查看原文（64行）</summary>

```text
      // v0.8 ②: 流式安装 —— /install-stream NDJSON 首选项；读流异常静默回退 buffered /install，
      // 不硬造假进度（回退时面板仅常驻「安装中」，无伪行）。
      async function streamInstall(spec, onLine) {
        const res = await fetch('/plugin-manager/install-stream', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pkg: spec }),
        })
        const ctype = res.headers.get('content-type') || ''
        if (!res.body || !ctype.includes('application/x-ndjson')) { const e = new Error('no-stream'); e.noStream = true; throw e }
        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let buf = ''
        let result = null
        for (;;) {
          const rd = await reader.read()
          if (rd.done) break
          buf += dec.decode(rd.value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() || ''
          for (const ln of lines) {
            if (!ln.trim()) continue
            try {
              const ev = JSON.parse(ln)
              if (ev.t === 'log' && onLine) onLine(ev.line)
              else if (ev.t === 'done') result = ev.result
            } catch { /* 忽略半行残片 */ }
          }
        }
        if (!result) { const e = new Error('stream-ended-early'); throw e }
        return result
      }

      async function doInstall(p) {
        const spec = pkgSpec(p.installCmd)
        if (!spec) return
        setInstalling(p.name)
        setResults((r) => ({ ...r, [p.name]: null }))
        try {
          setInstallLog([])
          let data
          try {
            data = await streamInstall(spec, (line) => setInstallLog((l) => (l.length >= 80 ? l.slice(-79) : l).concat(line)))
          } catch (_streamErr) {
            setInstallLog([])
            const res = await fetch('/plugin-manager/install', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ pkg: spec }),
            })
            data = await res.json()
          }
          setResults((r) => ({ ...r, [p.name]: data }))
          if (data.ok) {
            const list = await fetchJson('/plugin-manager/list').then(unwrapList).catch(() => [])
            setInstalled(list)
          }
        } catch (e) {
          setResults((r) => ({ ...r, [p.name]: { ok: false, log: String(e) } }))
        } finally {
          setInstalling(null)
        }
      }

      // v0.7 F-H: 场景组合一键装 —— 逐包串行调既有 /plugin-manager/install，
      // 单个失败不中断后续包；结果逐包落到 sceneResults。不新造 preset 通道。
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:263-306](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L263-L306)

Host install和stream路由。

<details>
<summary>查看原文（44行）</summary>

```text
      path: '/plugin-manager/install',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        json(res, await runInstall(pkg, profile))
      },
    })

    // v0.8 ②: 流式安装 —— 原生 res 分块 NDJSON（{t:start}/{t:log}/{t:done,result}）。
    // 不放行缓存/压缩，x-accel-buffering 防代理缓冲。buffered /install 保持不变作回退。
    const disposeInstallStream = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/install-stream',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        try { req.socket.setNoDelay(true) } catch { /* noop */ }
        res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache, no-transform', 'x-accel-buffering': 'no' })
        const send = (obj) => { try { res.write(JSON.stringify(obj) + '\n') } catch { /* client gone */ } }
        send({ t: 'start', spec: pkg })
        const r = await runInstall(pkg, profile, (line) => send({ t: 'log', line }))
        send({ t: 'done', result: r })
        res.end()
      },
    })

    const disposeList = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/list',
      handler: (_req, res) => {
        const value = []
        for (const entry of ctx.loader.entries()) {
          if (entry.options.group) continue
          value.push({ name: entry.options.name, id: entry.id, enabled: !entry.disabled })
        }
        json(res, { ok: true, value })
      },
    })

    const disposeCatalog = ctx.webServer.register({
```

</details>

#### 缺口

- 当前提交和外部目录/registry没有本次实际运行或服务验证。
  **影响**：不能确认兼容、安装成功率与成本收益。
  **进一步探讨**：先实现幂等与状态分层，再在隔离profile执行断流/并发/部分成功反例。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、兼容与更新数据如何得到？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host从硬编码GH Pages取目录，60秒fetch timeout，裁剪字段并缓存1小时，可gzip/deflate；browser优先Host代理，失败才直接取全目录，因此README说不代理已落后实现。compatStatus/版本/验证日仅展示和筛选，broken仍可装，Host install不校验目录身份或compat。更新只检查npm源依赖，npm view version并发4和6小时缓存；简化semver仅前三整数比较，不能正确区分1.0.0-beta到1.0.0等预发行，更新徽章也不证明与当前DSH兼容。/update先确认有pending再runInstall(name)，但实际安装bare name而非查询时的确切latest，registry变化可使to字段和实际版本不同。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:158-188](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L158-L188)

裁剪catalog字段与缓存fetch。

<details>
<summary>查看原文（31行）</summary>

```text
  return {
    id: p.id, name: p.name,
    desc_en: p.desc_en, desc_zh: p.desc_zh,
    author: p.author, stars: p.stars,
    category: p.category, compatStatus: p.compatStatus,
    compatDshVersion: p.compatDshVersion || null, compatLastVerified: p.compatLastVerified || null,
    installCmd: p.installCmd, repo: p.repo, license: p.license,
    featured: !!p.featured,
    lastPush: p.lastPush || null,
    ogLocal: p.ogLocal || null,
  }
}

async function fetchCatalog() {
  if (catalogCache.plugins && Date.now() - catalogCache.at < CATALOG_TTL_MS) return catalogCache.plugins
  const res = await fetch(CATALOG_URL, { signal: AbortSignal.timeout(60_000) })
  if (!res.ok) throw new Error('catalog fetch HTTP ' + res.status)
  const full = await res.json()
  const plugins = (full.plugins || []).map(trimPlugin)
  catalogCache.at = Date.now()
  catalogCache.plugins = plugins
  catalogCache.watchMeta = summarizeWatchlist(full)
  return plugins
}

// ---- update check (npm-source only, concurrency <= 4, cache 1h) ----

const updateCache = new Map()

function isNpmSpec(spec) {
  const s = String(spec || '').trim()
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-manager/lib/client.js:629-644](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/client.js#L629-L644)

Host优先目录降级。

<details>
<summary>查看原文（16行）</summary>

```text
      async function fetchCatalogPlugins() {
        // host trimmed route first (fast, gzip); fall back to the full GH Pages copy
        try {
          const r = await fetch('/plugin-manager/catalog')
          if (r.ok) {
            const c = await r.json()
            if (c && Array.isArray(c.plugins) && c.plugins.length) return { plugins: c.plugins, watchMeta: c.watchMeta || null }
          }
        } catch { /* fall through */ }
        const c = await fetch(CATALOG_URL).then((r) => r.json())
        // v0.8.3: 完整 catalog.json 自带 watchlist 真实口径，现场聚合（与 host summarizeWatchlist 同口径）
        const wl = Array.isArray(c.watchlist) ? c.watchlist : []
        const byReason = {}
        for (const w of wl) { const k = (w && w.watchReason) || 'other'; byReason[k] = (byReason[k] || 0) + 1 }
        const totals = c.totals || {}
        const total = typeof totals.watchlistCount === 'number' ? totals.watchlistCount
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:222-260](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L222-L260)

npm缓存、简化比较与并发检查。

<details>
<summary>查看原文（39行）</summary>

```text
  if (version) updateCache.set(name, { at: Date.now(), version })
  return version
}

// v0.6: 轻量 semver 比较（严格大于才算有更新）——本地 dev/link 高版本
// （如开发中 0.6.0 > 已发布 0.5.0）不应被误报「update → 旧版」
function semverGt(a, b) {
  const pa = String(a).split('.').map((x) => parseInt(x, 10) || 0)
  const pb = String(b).split('.').map((x) => parseInt(x, 10) || 0)
  for (let i = 0; i < 3; i++) { if (pa[i] !== pb[i]) return pa[i] > pb[i] }
  return false
}

async function runPool(items, limit, fn) {
  const results = new Array(items.length)
  let i = 0
  const workers = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) { const idx = i++; results[idx] = await fn(items[idx]) }
  })
  await Promise.all(workers)
  return results
}

async function computeUpdates(profile) {
  const pkg = readProfilePkg(profile)
  const deps = pkg ? { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) } : {}
  const npmDeps = Object.keys(deps).filter((n) => isNpmSpec(deps[n]))
  const checked = await runPool(npmDeps, UPDATE_CONCURRENCY, async (name) => {
    try {
      const installed = installedVersion(profile, name)
      const latest = await npmViewVersion(name)
      return { name, installed, latest, hasUpdate: !!(installed && latest && semverGt(latest, installed)) }
    } catch { return { name, installed: null, latest: null, hasUpdate: false } }
  })
  return checked.filter((c) => c.hasUpdate)
}

export function apply(ctx) {
  ctx.effect(() => {
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:350-371](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L350-L371)

pending后安装bare name。

<details>
<summary>查看原文（22行）</summary>

```text
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        // Only allow upgrading a package a pending update actually exists for —
        // otherwise we would churn pnpm for nothing (or worse, install an
        // arbitrary package name the caller typed in).
        try {
          const pending = await computeUpdates(profile)
          const hit = pending.find((u) => u.name === name)
          if (!hit) return json(res, { ok: false, error: 'no pending update for ' + name }, 409)
          const r = await runInstall(name, profile)
          if (r.ok) updateCache.delete(name)
          json(res, { ...r, name, from: hit.installed, to: hit.latest })
        } catch (e) {
          json(res, { ok: false, error: String(e && e.message ? e.message : e) }, 500)
        }
      },
    })

    const disposeInstalled = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/installed',
      handler: (_req, res) => {
        const profile = currentProfile()
```

</details>

#### 缺口

- 当前提交和外部目录/registry没有本次实际运行或服务验证。
  **影响**：不能确认兼容、安装成功率与成本收益。
  **进一步探讨**：先实现幂等与状态分层，再在隔离profile执行断流/并发/部分成功反例。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 成功、流式失败和超时代表什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

runInstall先dsh plugin add；新增输出解析后dump-config子串命中仅表示可能挂载，dump失败或无命中仍返回ok:true和mounted:false。没有新增输出时，只要profile node_modules包版本存在就mounted:true，未核配置行或当前loader活跃，这会把仅依赖在盘当已挂载。browser读流失败或缺done即自动再发/install；原请求断开Host没有取消runInstall，也无请求幂等键/互斥，第一次可能仍安装或已完成，重发可并行修改profile并重复生命周期副作用。这是确认的未知结果重试设计缺口，不等于每次必重复安装。spawn超时SIGKILL直接child后立刻resolve，不等待close/后代进程，故timedOut不证明整个包管理器树已停，也无事务回滚。输出累计无大小上限，UI只显示80行不限制Host内存。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:68-100](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L68-L100)

child输出累积、timeout直接resolve。

<details>
<summary>查看原文（33行）</summary>

```text

function spawnCmd(cmd, args, timeoutMs, onLine) {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { env: process.env, stdio: ['ignore', 'pipe', 'pipe'] })
    let out = ''
    let err = ''
    // v0.8 ②: onLine 逐行增量回调 —— 真增量（data 事件行缓冲），无行回调时零开销
    let rest = ''
    const feed = (d) => {
      if (!onLine) return
      rest += d.toString('utf8')
      const lines = rest.split('\n')
      rest = lines.pop() || ''
      for (const l of lines) if (l.trim()) onLine(l)
    }
    const flush = () => { if (onLine && rest.trim()) { onLine(rest); rest = '' } }
    child.stdout.on('data', (d) => { out += d; feed(d) })
    child.stderr.on('data', (d) => { err += d; feed(d) })
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      resolve({ ok: false, out, log: (out + err).trim() || cmd + ' timed out', exitCode: null, timedOut: true })
    }, timeoutMs)
    child.on('error', (e) => {
      clearTimeout(timer)
      resolve({ ok: false, out, log: 'spawn failed: ' + e.message, exitCode: null, timedOut: false })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      flush()
      resolve({ ok: code === 0, out, log: (out + err).trim(), exitCode: code, timedOut: false })
    })
  })
}
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:115-139](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L115-L139)

仅在盘mounted:true和dump子串/ok。

<details>
<summary>查看原文（25行）</summary>

```text
  if (!add.ok) {
    return { ok: false, log: add.log || '(no output)', exitCode: add.exitCode, needRestart: false, timedOut: add.timedOut, profile }
  }
  const added = parseAdded(add.out)
  if (added.length === 0) {
    // v0.5: pnpm prints no "+ pkg" section when the dependency spec already
    // matches (e.g. "Already up to date" after a previously half-applied or
    // repeated install) — exit 0 then means the goal state is already on
    // disk. Treat that as success instead of a false failure; verify by
    // reading the package's own package.json from the profile.
    const present = installedVersion(profile, pkg)
    if (present) {
      return { ok: true, log: (add.log + `\nℹ already present on disk (${pkg}@${present}) — nothing to add`).trim(), exitCode: 0, needRestart: true, timedOut: false, installed: [pkg], mounted: true, profile }
    }
    return { ok: false, log: (add.log + '\n⚠ exit 0 but pnpm reported no added dependency — install did not take effect').trim(), exitCode: 0, needRestart: false, timedOut: false, profile }
  }
  const dump = await spawnCmd('dsh', ['--profile', profile, '--dump-config'], VERIFY_TIMEOUT_MS, onLine)
  const mounted = added.some((name) => dump.out.includes(name))
  return { ok: true, log: add.log, exitCode: 0, needRestart: true, timedOut: false, installed: added, mounted, profile }
}

// ---- trimmed catalog (cached 1h, panel-only fields) ----

const catalogCache = { at: 0, plugins: null, watchMeta: null }

```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:280-301](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L280-L301)

流断仍执行安装。

<details>
<summary>查看原文（22行）</summary>

```text
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        try { req.socket.setNoDelay(true) } catch { /* noop */ }
        res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache, no-transform', 'x-accel-buffering': 'no' })
        const send = (obj) => { try { res.write(JSON.stringify(obj) + '\n') } catch { /* client gone */ } }
        send({ t: 'start', spec: pkg })
        const r = await runInstall(pkg, profile, (line) => send({ t: 'log', line }))
        send({ t: 'done', result: r })
        res.end()
      },
    })

    const disposeList = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/list',
      handler: (_req, res) => {
        const value = []
        for (const entry of ctx.loader.entries()) {
          if (entry.options.group) continue
          value.push({ name: entry.options.name, id: entry.id, enabled: !entry.disabled })
        }
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-manager/lib/client.js:505-554](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/client.js#L505-L554)

任何stream异常重发buffered请求。

<details>
<summary>查看原文（50行）</summary>

```text
        const res = await fetch('/plugin-manager/install-stream', {
          method: 'POST', headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ pkg: spec }),
        })
        const ctype = res.headers.get('content-type') || ''
        if (!res.body || !ctype.includes('application/x-ndjson')) { const e = new Error('no-stream'); e.noStream = true; throw e }
        const reader = res.body.getReader()
        const dec = new TextDecoder()
        let buf = ''
        let result = null
        for (;;) {
          const rd = await reader.read()
          if (rd.done) break
          buf += dec.decode(rd.value, { stream: true })
          const lines = buf.split('\n')
          buf = lines.pop() || ''
          for (const ln of lines) {
            if (!ln.trim()) continue
            try {
              const ev = JSON.parse(ln)
              if (ev.t === 'log' && onLine) onLine(ev.line)
              else if (ev.t === 'done') result = ev.result
            } catch { /* 忽略半行残片 */ }
          }
        }
        if (!result) { const e = new Error('stream-ended-early'); throw e }
        return result
      }

      async function doInstall(p) {
        const spec = pkgSpec(p.installCmd)
        if (!spec) return
        setInstalling(p.name)
        setResults((r) => ({ ...r, [p.name]: null }))
        try {
          setInstallLog([])
          let data
          try {
            data = await streamInstall(spec, (line) => setInstallLog((l) => (l.length >= 80 ? l.slice(-79) : l).concat(line)))
          } catch (_streamErr) {
            setInstallLog([])
            const res = await fetch('/plugin-manager/install', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ pkg: spec }),
            })
            data = await res.json()
          }
          setResults((r) => ({ ...r, [p.name]: data }))
          if (data.ok) {
            const list = await fetchJson('/plugin-manager/list').then(unwrapList).catch(() => [])
```

</details>

#### 缺口

- 当前提交和外部目录/registry没有本次实际运行或服务验证。
  **影响**：不能确认兼容、安装成功率与成本收益。
  **进一步探讨**：先实现幂等与状态分层，再在隔离profile执行断流/并发/部分成功反例。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 采用、权限和全周期成本如何判断？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

需要DSH Web的webServer/loader、浏览器slots/locale/runtime，以及PATH中的dsh/npm和实际底层包管理器、网络目录/registry。Node版本声明不证明当前宿主接缝兼容。Host允许请求提供pkg/profile并直接传CLI；当前文件没有method/auth/profile归属校验，安全边界依赖外层宿主，不把局部缺失夸成已验证远程漏洞。UI确认框是用户意图展示，不能代替服务器授权。首次需隔离profile、备份package/lock与配置、审阅包来源；持续需重启和逐插件验收、目录/registry访问；失败查进程与真实落盘状态后再重试。卸载不撤销插件生命周期与业务副作用，bulk安装部分失败也不是整体回滚。建议观察，尤其断流别再次点装，先核profile/进程；可先用只读目录和手工固定spec安装，待幂等和状态层次补齐再扩大。金额/节时/真实安装成功率未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:25-36](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L25-L36)

Host依赖与timeout/cache。

<details>
<summary>查看原文（12行）</summary>

```text
export const name = 'plugin-manager'
export const inject = ['webServer', 'loader']

// v0.5: bumped 120s → 300s — dependency downloads on slow networks (and
// registry mirrors under load) can legitimately exceed two minutes; the
// update path reuses runInstall, so a short timeout would report false
// failures while pnpm was still making progress.
const INSTALL_TIMEOUT_MS = 300_000
const VERIFY_TIMEOUT_MS = 60_000
const CATALOG_URL = 'https://whyihaveyou.github.io/dsh-suite/catalog.json'
const CATALOG_TTL_MS = 60 * 60 * 1000
const UPDATE_TTL_MS = 6 * 60 * 60 * 1000
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:263-294](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L263-L294)

请求pkg/profile未经本组件权限校验。

<details>
<summary>查看原文（32行）</summary>

```text
      path: '/plugin-manager/install',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        json(res, await runInstall(pkg, profile))
      },
    })

    // v0.8 ②: 流式安装 —— 原生 res 分块 NDJSON（{t:start}/{t:log}/{t:done,result}）。
    // 不放行缓存/压缩，x-accel-buffering 防代理缓冲。buffered /install 保持不变作回退。
    const disposeInstallStream = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/install-stream',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        try { req.socket.setNoDelay(true) } catch { /* noop */ }
        res.writeHead(200, { 'content-type': 'application/x-ndjson; charset=utf-8', 'cache-control': 'no-cache, no-transform', 'x-accel-buffering': 'no' })
        const send = (obj) => { try { res.write(JSON.stringify(obj) + '\n') } catch { /* client gone */ } }
        send({ t: 'start', spec: pkg })
        const r = await runInstall(pkg, profile, (line) => send({ t: 'log', line }))
        send({ t: 'done', result: r })
        res.end()
      },
    })

    const disposeList = ctx.webServer.register({
      kind: 'exact',
```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:387-408](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L387-L408)

卸载与dispose路由。

<details>
<summary>查看原文（22行）</summary>

```text
        json(res, { ok: true, value })
      },
    })

    const disposeUninstall = ctx.webServer.register({
      kind: 'exact',
      path: '/plugin-manager/uninstall',
      handler: async (req, res) => {
        const body = await readJsonBody(req)
        const pkg = body && typeof body.pkg === 'string' && body.pkg.trim() ? body.pkg.trim() : null
        if (!pkg) return json(res, { ok: false, error: 'missing pkg' }, 400)
        const profile = typeof body.profile === 'string' && body.profile ? body.profile : currentProfile()
        // `dsh plugin` is a thin pnpm forwarder: `remove <pkg>` == `pnpm remove <pkg>` + reconcile
        const r = await spawnCmd('dsh', ['plugin', '--profile', profile, 'remove', pkg], INSTALL_TIMEOUT_MS)
        json(res, { ok: r.ok, log: r.log, exitCode: r.exitCode, needRestart: r.ok, profile })
      },
    })

    // warm the catalog cache in the background so the first Store open is fast
    fetchCatalog().catch(() => {})

    return () => { disposeInstall(); disposeInstallStream(); disposeList(); disposeCatalog(); disposeUpdates(); disposeInstalled(); disposeUninstall(); disposeUpdate() }
```

</details>

**依据 4 · 源码核查**：[packages/plugins/plugin-manager/lib/client.js:906-925](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/client.js#L906-L925)

前端确认安装。

<details>
<summary>查看原文（20行）</summary>

```text
      // confirm dialog
      let modal = null
      if (confirmPkg) {
        const p = confirmPkg
        const spec = pkgSpec(p.installCmd)
        modal = h('div', { style: C.modalBack, onClick: () => setConfirmPkg(null) },
          h('div', { style: C.modal, onClick: (e) => e.stopPropagation() },
            h('div', { style: { fontSize: '15px', fontWeight: '600', color: 'var(--dsw-alias-label-primary)', marginBottom: '10px' } }, t('confirmTitle')),
            h('div', { style: C.desc, marginBottom: '6px' }, p.name),
            p.repo ? h('div', { style: C.meta, marginBottom: '6px' }, h('span', null, 'repo: ' + p.repo)) : null,
            h('div', { style: C.meta, marginBottom: '6px' },
              h('span', null, (p.stars || 0) + '★'),
              p.license ? h('span', null, p.license) : h('span', { style: C.warn }, t('unknownLicense'))),
            (spec && updN(spec)) ? h('div', { style: { color: 'var(--dsw-alias-state-success-primary)', fontSize: '12px', marginBottom: '6px' } }, t('updateHint') + ' (v' + ((updN(spec).installed) || '?') + ' → v' + updN(spec).latest + ')') : null,
            h('div', { style: { ...C.desc, marginBottom: '14px', wordBreak: 'break-all' } }, spec),
            h('div', { style: { display: 'flex', gap: '8px', justifyContent: 'flex-end' } },
              h('button', { style: C.btnGhost, onClick: () => setConfirmPkg(null) }, t('cancel')),
              h('button', { style: C.btn, onClick: () => { setConfirmPkg(null); doInstall(p) } }, t('confirm'))),
          ))
      }
```

</details>

#### 缺口

- 当前提交和外部目录/registry没有本次实际运行或服务验证。
  **影响**：不能确认兼容、安装成功率与成本收益。
  **进一步探讨**：先实现幂等与状态分层，再在隔离profile执行断流/并发/部分成功反例。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样把便利安装改成可恢复操作？

**研究主题**：新假设与验证、采用判断

#### 完整回答

由Q03推导未验证的持久安装事务假设：请求绑定用户/profile/确切spec摘要和幂等键，Host单profile串行；客户端断流只重连日志/查询operation，不自动重发安装。状态分已接收、包已落盘、配置已挂载、重启后active、功能验收，超时保存unknown直到进程树静止证据。更新固定查询到版本并核lockfile，失败保留before/after差异供恢复。最小实验断在首次add成功done未到、两个客户端同profile、包已在盘未挂载、dump失败和kill后子进程仍运行；若出现第二次add、误标active或未知被写失败可重试，即推翻充分性。持久日志/锁和恢复增加实现成本，收益需与手工CLI同条件比较，不是当前已有能力。

#### 证据与依据

**依据 1 · 源码核查**：[packages/plugins/plugin-manager/lib/client.js:539-552](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/client.js#L539-L552)

断流重发反例。

<details>
<summary>查看原文（14行）</summary>

```text
        try {
          setInstallLog([])
          let data
          try {
            data = await streamInstall(spec, (line) => setInstallLog((l) => (l.length >= 80 ? l.slice(-79) : l).concat(line)))
          } catch (_streamErr) {
            setInstallLog([])
            const res = await fetch('/plugin-manager/install', {
              method: 'POST', headers: { 'content-type': 'application/json' },
              body: JSON.stringify({ pkg: spec }),
            })
            data = await res.json()
          }
          setResults((r) => ({ ...r, [p.name]: data }))
```

</details>

**依据 2 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:126-137](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L126-L137)

在盘与挂载混淆。

<details>
<summary>查看原文（12行）</summary>

```text
    if (present) {
      return { ok: true, log: (add.log + `\nℹ already present on disk (${pkg}@${present}) — nothing to add`).trim(), exitCode: 0, needRestart: true, timedOut: false, installed: [pkg], mounted: true, profile }
    }
    return { ok: false, log: (add.log + '\n⚠ exit 0 but pnpm reported no added dependency — install did not take effect').trim(), exitCode: 0, needRestart: false, timedOut: false, profile }
  }
  const dump = await spawnCmd('dsh', ['--profile', profile, '--dump-config'], VERIFY_TIMEOUT_MS, onLine)
  const mounted = added.some((name) => dump.out.includes(name))
  return { ok: true, log: add.log, exitCode: 0, needRestart: true, timedOut: false, installed: added, mounted, profile }
}

// ---- trimmed catalog (cached 1h, panel-only fields) ----

```

</details>

**依据 3 · 源码核查**：[packages/plugins/plugin-manager/lib/index.js:85-91](https://github.com/whyihaveyou/dsh-suite/blob/3073bd8895d2f8478b9cb06f6b265977d7511d65/packages/plugins/plugin-manager/lib/index.js#L85-L91)

timeout无树静止证据。

```text
    child.stderr.on('data', (d) => { err += d; feed(d) })
    const timer = setTimeout(() => {
      child.kill('SIGKILL')
      resolve({ ok: false, out, log: (out + err).trim() || cmd + ' timed out', exitCode: null, timedOut: true })
    }, timeoutMs)
    child.on('error', (e) => {
      clearTimeout(timer)
```

#### 缺口

- 当前提交和外部目录/registry没有本次实际运行或服务验证。
  **影响**：不能确认兼容、安装成功率与成本收益。
  **进一步探讨**：先实现幂等与状态分层，再在隔离profile执行断流/并发/部分成功反例。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
