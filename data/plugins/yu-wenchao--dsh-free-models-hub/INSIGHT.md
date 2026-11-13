# DSH Free Models Hub

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[3c98fc5](https://github.com/yu-wenchao/dsh-free-models-hub/tree/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4)

<!-- BEGIN META -->
[![GitHub ★ 36](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=36&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/yu-wenchao/dsh-free-models-hub) [![npm 30d 2,621](https://img.shields.io/static/v1?label=npm+30d&message=2%2C621&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-models-hub) [![最新发布 2026-08-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-free-models-hub)
<!-- END META -->

> **功能**：从配置的目录浏览免费模型并在 DSH 中设置供应商，可使用本地密钥轮换。

> **亮点**：目录条目可带入 provider 配置，循环代理在同一地址换 key。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：代理仅监听 loopback，通配 CORS 的池接口可以读取真实密钥并写目标，转发对失败 key 不做自动健康处理。[Q02](#research-q02)

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
  - [Q01 · 目录接入比手工设置供应商多了什么？](#detail-section-11)
  - [Q02 · 轮换会跳过坏 key 吗，谁能读写密钥池？](#detail-section-12)
  - [Q03 · 何时适合直接配置上游，怎样验证更窄的代理控制面？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望从一个界面发现并配置多个兼容模型端点的 DSH 用户。

直接在宿主配置可验证模型端点与凭据。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录面板 | 浏览并配置模型 | 目录内容待核 |
| 代理轮换 | 按 provider 轮换 key | 本地读写接口需要独立保护 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| DSH settingsScope | 配置条件 | 创建 provider | 直接配置 |
| 目录和本地代理 | 浏览及轮换条件 | 发现模型、轮换 | 使用固定端点 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 隔离 profile 和假 key | 确认浏览器连接 |
| 退出 | 恢复 provider 并核对池文件 | 确认密钥和进程状态 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 目录及代理资源未知 | 配置端点 | 代理只监听本机 |
| 持续 | 模型服务按实际计费 | 排查坏 key 与目录 | 无用量或价格验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 轮换 | 按请求替换 key | 无健康和自动重试验证 |

> **思考**：代理仅监听 loopback，通配 CORS 的池接口可以读取真实密钥并写目标，转发对失败 key 不做自动健康处理。[Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：目录条目可带入 provider 配置，循环代理在同一地址换 key。[Q01](#research-q01) [Q02](#research-q02)

直接转发状态可以观察上游失败，轮换和清理均需要独立验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

代理仅监听 loopback，通配 CORS 的池接口可以读取真实密钥并写目标，转发对失败 key 不做自动健康处理。[Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

用模拟目录和假 key 观察。需要生产模型时优先直接配置可信端点。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持配置与轮换，真实目录、权限和账单待验。

- 已检查：作者 README、包清单、源码路径 lib/client.cjs、lib/core.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：查固定 Host 代理、目录规范化与配置 UI。未运行代理和服务。
- 下一步：隔离账号对照读写池、错误 key、端口和真实落盘清除。

**分析版本**

- **仓库**：[yu-wenchao/dsh-free-models-hub](https://github.com/yu-wenchao/dsh-free-models-hub)
- **版本号**：0.3.1（[固定提交 3c98fc5](https://github.com/yu-wenchao/dsh-free-models-hub/tree/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4)）
- **版本日期**：2026-08-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

将密钥控制面接到宿主认证并只提供摘要，可能减少凭据暴露。[Q03](#research-q03)

隔离账号对照读写池、错误 key、端口和真实落盘清除。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1365 | — | — | 14830 |
| .cjs | source | 3 | 2848 | 2404 | 345 | — |
| .js | source | 7 | 3004 | 2395 | 427 | — |
| .mjs | source | 1 | 105 | 69 | 26 | — |
| .js | test | 1 | 399 | 333 | 55 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-13），可前往 [GitHub Issues](https://github.com/yu-wenchao/dsh-free-models-hub/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：用目录和轮换代理配置免费模型时，谁能访问本地密钥、改写转发目标与核对额度？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 目录接入比手工设置供应商多了什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

用户可以从配置的目录选择模型和申请入口，再通过宿主 settingsScope 配置 provider。目录读取不携带浏览器凭据，规范化模型和 URL；浏览器能否连到 Host 的 loopback 是启用轮换的条件。客户端先寻找本地代理，再把池和目标写入设置及文件，随后把 provider 改到代理地址。相对手工整理列表和地址省去重复填表；目录有模型或 ping 成功不证明凭据可用或额度免费。

#### 证据与依据

**依据 1 · 源码核查**：[lib/client.cjs:859-872](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/client.cjs#L859-L872)

客户端查询目录端点。

<details>
<summary>查看原文（14行）</summary>

```text

  /* ---- data ---- */
  let seq = 0
  let timer = null
  let apiEndpoint = '' // remembered once a candidate validates

  async function fetchModels(endpoint, signal) {
    const res = await fetch(endpoint, { signal, credentials: 'omit', headers: { Accept: 'application/json' } })
    if (!res.ok) throw Object.assign(new Error(`HTTP ${res.status}`), { fmhTryNext: res.status >= 400 && res.status < 500 })
    const payload = await res.json()
    const data = parseModelsResponse(payload, state.pageSize) // throws on non-JSON / bad shape
    return { data, endpoint }
  }

```

</details>

**依据 2 · 源码核查**：[lib/core.js:247-277](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/core.js#L247-L277)

整理模型行和 URL 字段。

<details>
<summary>查看原文（31行）</summary>

```text
 * Canonical item: { id, title, apiBase, modelIds, keyUrl, badge, pinned }
 */
export function parseModelsResponse(payload, pageSize) {
  if (!payload || typeof payload !== 'object' || payload.ok !== true) {
    throw new TypeError('response is not a valid models payload')
  }
  const total = clampInt(payload.total, 0, Number.MAX_SAFE_INTEGER, 0)
  const totalPages = clampInt(payload.total_pages, 1, Number.MAX_SAFE_INTEGER, 1)
  const page = clampInt(payload.page, 1, totalPages, 1)
  const size = clampInt(payload.page_size, 1, 50, clampInt(pageSize, 1, 50, 10))
  const rawItems = Array.isArray(payload.items) ? payload.items : []
  const items = []
  for (const row of rawItems.slice(0, size)) {
    if (!row || typeof row !== 'object') continue
    const id = Number(row.id)
    const title = typeof row.title === 'string' ? row.title.trim().slice(0, 200) : ''
    const apiBase = safeHttpUrl(row.api_base_url)
    // model_name may be a string (legacy), an array, or missing.
    let modelIds = []
    if (Array.isArray(row.model_name)) {
      modelIds = row.model_name.filter((m) => typeof m === 'string' && m.trim() !== '').map((m) => m.trim().slice(0, 120))
    } else if (typeof row.model_name === 'string' && row.model_name.trim() !== '') {
      modelIds = [row.model_name.trim().slice(0, 120)]
    }
    // A missing key application link degrades the button, not the row.
    const keyUrl = safeHttpUrl(row.key_apply_url)
    const badge = row.badge === 'hot' || row.badge === 'rec' ? row.badge : ''
    const pinned = row.pinned === 1 || row.pinned === true
    if (!Number.isFinite(id) || !title || !apiBase || modelIds.length === 0) continue
    items.push({ id, title, apiBase, modelIds, keyUrl, badge, pinned })
  }
```

</details>

**依据 3 · 源码核查**：[lib/client.cjs:998-1014](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/client.cjs#L998-L1014)

客户端在本地端口探测。

<details>
<summary>查看原文（17行）</summary>

```text
  /* ---- proxy probe ---- */
  async function probeProxy() {
    for (let port = cfg.proxyPort; port < cfg.proxyPort + 10; port++) {
      try {
        const ctrl = new AbortController()
        const timer = setTimeout(() => ctrl.abort(), 800)
        const res = await fetch(`http://127.0.0.1:${port}/p/ping`, {
          signal: ctrl.signal, mode: 'cors', credentials: 'omit',
        })
        clearTimeout(timer)
        if (res.ok) return port
      } catch { /* try next */ }
    }
    return null
  }

  /* ---- readField helpers ---- */
```

</details>

**依据 4 · 源码核查**：[lib/client.cjs:1057-1109](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/client.cjs#L1057-L1109)

保存池、目标并改写 provider。

<details>
<summary>查看原文（53行）</summary>

```text
    if (!ok) { toast(STR.proxyOffline, 'err'); return }

    // Save to settings scope (live, in-memory)
    const hub = await getBoundNamespace('free-models-hub')
    const lp = await getBoundNamespace('llm-pi-ai')
    let poolsSaved = false

    if (hub && typeof hub.set === 'function') {
      try {
        const pools = readField(hub, 'keyPools', {})
        const targets = readField(hub, 'targets', {})
        pools[pid] = keys
        targets[pid] = item.apiBase
        await hub.set('keyPools', pools)
        await hub.set('targets', targets)
        poolsSaved = true
      } catch { /* fall through */ }
    }

    // Also persist to proxy file (survives restart)
    const port = await probeProxy()
    if (port) {
      try {
        const existingRes = await fetch(`http://127.0.0.1:${port}/p/load-pools`, { mode: 'cors', credentials: 'omit' }).catch(() => null)
        if (!existingRes || !existingRes.ok) {
          toast(STR.proxyOffline, 'err')
          return
        }
        const existing = await existingRes.json().catch(() => ({}))
        const mergedPools = { ...(existing.keyPools || {}), [pid]: keys }
        const mergedTargets = { ...(existing.targets || {}), [pid]: item.apiBase }
        await fetch(`http://127.0.0.1:${port}/p/save-pools`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ keyPools: mergedPools, targets: mergedTargets }),
        })
      } catch { /* best effort */ }
    }

    // Rewrite only this provider's baseURL to proxy (immediate, DSH in-memory)
    if (port) {
      try {
        const bound = await getBoundNamespace('llm-pi-ai')
        if (bound && typeof bound.set === 'function') {
          const allProviders = await readProviders(bound)
          if (allProviders[pid]) {
            allProviders[pid] = { ...allProviders[pid], baseURL: `http://127.0.0.1:${port}/p/${pid}` }
            await bound.set('providers', allProviders)
          }
        }
      } catch { /* best effort */ }
      toast(STR.poolSaved(keys.length), 'ok')
    } else {
```

</details>

#### 缺口

- 未连接目录后端或实际创建 provider
  **影响**：不能确认目录新鲜度、地址及宿主写入
  **进一步探讨**：用空测试 profile 和模拟目录验证新增、失败和原地址恢复

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 轮换会跳过坏 key 吗，谁能读写密钥池？

**研究主题**：功能与机制、缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

代理监听 127.0.0.1，按 provider 计数轮换非空 key，为单次请求写 Authorization。上游响应状态直接返回，没有针对 401 或 429 的健康标记及自动重试。更关键的是 handler 为全部路径设置通配 CORS，save-pools 接收并写池和目标，load-pools 返回实际 keyPools，分支中没有检查调用者身份。数据写入普通 JSON，调用是否成功与落盘回读要分开。循环地址不等于网页访问控制：浏览器是否还受 Private Network Access 等约束未测，任一能连到端口的本地程序可构造请求。用过真实 key 的环境需核对密钥轮换和退出。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:91-113](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L91-L113)

持久化池和目标，异常只记录。

<details>
<summary>查看原文（23行）</summary>

```text
  function writePoolFile(pools, targets) {
    try {
      if (Object.keys(pools).length === 0 && fs.existsSync(poolFilePath)) {
        const diskPools = JSON.parse(fs.readFileSync(poolFilePath, 'utf8')).keyPools || {}
        if (Object.keys(diskPools).length > 0) {
          console.warn(LOG_PREFIX, 'refusing to replace non-empty pool file with empty; keeping existing pools')
          return
        }
      }
      fs.writeFileSync(poolFilePath, JSON.stringify({ keyPools: pools, targets }, null, 2), 'utf8')
      filePools = pools
      fileTargets = targets
      // Update dummy env vars for all pooled providers
      for (const [pid, keys] of Object.entries(pools)) {
        if (Array.isArray(keys) && keys.length > 0) {
          const envName = pid.replace(/-/g, '_').toUpperCase() + '_API_KEY'
          if (!process.env[envName]) process.env[envName] = 'dsh-proxy-pool'
        }
      }
      console.log(LOG_PREFIX, `saved key pools to ${poolFilePath} (${Object.keys(pools).length} providers)`)
    } catch (err) {
      console.warn(LOG_PREFIX, 'pool file write failed:', err && err.message)
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:123-167](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L123-L167)

通配 CORS、读写路径及回传池内容。

<details>
<summary>查看原文（45行）</summary>

```text
  function handleProxy(req, res) {
    console.log(LOG_PREFIX, `REQUEST: ${req.method} ${req.url}`)
    // CORS for browser probes (panel ping / pool-check).
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

    const url = new URL(req.url, `http://127.0.0.1:${actualPort}`)
    const parts = url.pathname.replace(/^\/+/, '').split('/')
    // URL format: /p/<action> or /p/<pid>/<api-path...>
    const ns = parts[0] // always 'p' (namespace prefix)
    const action = parts[1] || ''
    const rest = parts.slice(2).join('/')

    // health probe  /p/ping
    if (ns === 'p' && action === 'ping' && !rest) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('ok')
      return
    }

    // save pools from client  POST /p/save-pools
    if (ns === 'p' && action === 'save-pools' && !rest && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          writePoolFile(data.keyPools || {}, data.targets || {})
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'invalid json' }))
        }
      })
      return
    }

    // load pools from file  GET /p/load-pools
    if (ns === 'p' && action === 'load-pools' && !rest) {
      readPoolFile()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ keyPools: filePools, targets: fileTargets }))
```

</details>

**依据 3 · 源码核查**：[lib/index.js:190-219](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L190-L219)

池和目标合并，按请求替换 Authorization。

<details>
<summary>查看原文（30行）</summary>

```text
    const pid = action

    // Merge file-based pools with settings-section pools
    const src = sectionSource()
    const sTargets = src && typeof src.targets === 'object' ? src.targets : {}
    const sPools = src && typeof src.keyPools === 'object' ? src.keyPools : {}
    const targets = { ...fileTargets, ...sTargets }
    const pools = { ...filePools, ...sPools }
    const targetBase = targets[pid]

    if (!targetBase) {
      res.writeHead(404, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ error: 'unknown provider', pid }))
      return
    }

    const target = targetBase.replace(/\/+$/, '') + '/' + rest + url.search
    console.log(LOG_PREFIX, `proxy ${pid}: ${req.method} ${target}`)
    const upHeaders = { ...req.headers }
    delete upHeaders.host
    delete upHeaders.connection

    // Round-robin key rotation when a pool is configured
    const pool = pools[pid]
    const keyPool = Array.isArray(pool) ? pool.filter((k) => typeof k === 'string' && k.trim()) : []
    if (keyPool.length > 0) {
      if (!counters.has(pid)) counters.set(pid, { count: 0 })
      const key = pickRotatedKey(keyPool, counters.get(pid))
      if (key) upHeaders.authorization = `Bearer ${key}`
    }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:237-261](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L237-L261)

发一次上游请求并直接传回状态。

<details>
<summary>查看原文（25行）</summary>

```text
    // Read full request body first, then forward to upstream
    const chunks = []
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => {
      const body = Buffer.concat(chunks)
      // Set correct content-length for upstream
      opts.headers['content-length'] = body.length
      delete opts.headers['transfer-encoding']

      const proxyReq = upstream.request(opts, (proxyRes) => {
        try {
          const fwdHeaders = { ...proxyRes.headers }
          delete fwdHeaders['connection']
          res.writeHead(proxyRes.statusCode, fwdHeaders)
          proxyRes.pipe(res)
        } catch (err) {
          try { res.writeHead(502); res.end('proxy pipe error') } catch {}
        }
      })
      proxyReq.on('error', (err) => {
        console.warn(LOG_PREFIX, 'upstream error:', err && err.message)
        try { if (!res.headersSent) res.writeHead(502); res.end('upstream error') } catch {}
      })
      proxyReq.write(body)
      proxyReq.end()
```

</details>

**依据 5 · 源码核查**：[lib/index.js:277-289](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L277-L289)

监听 127.0.0.1，端口占用时递增。

<details>
<summary>查看原文（13行）</summary>

```text
    const server = http.createServer(handleProxy)
    server.on('error', (err) => {
      if (err && err.code === 'EADDRINUSE' && port < cfg.proxyPort + 20) {
        log(cfg.debug, `port ${port} in use, trying ${port + 1}`)
        startProxy(port + 1)
      } else {
        warn(`rotation proxy failed to bind port ${port}:`, err && err.message)
      }
    })
    server.listen(port, '127.0.0.1', () => {
      actualPort = port
      proxyServer = server
      console.log(LOG_PREFIX, `rotation proxy listening on 127.0.0.1:${port} (pool file: ${poolFilePath})`)
```

</details>

**依据 6 · 源码核查**：[lib/core.js:35-46](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/core.js#L35-L46)

计数轮换只筛除空字符串。

<details>
<summary>查看原文（12行）</summary>

```text
 * Round-robin key picker for the local rotation proxy.
 * counter is mutated by the caller (kept in memory inside the proxy).
 * Returns undefined for an empty/invalid pool so callers can fall back to
 * passing through whatever authorization the inbound request already had.
 */
export function pickRotatedKey(pool, counterRef) {
  if (!Array.isArray(pool)) return undefined
  const keys = pool.filter((k) => typeof k === 'string' && k.trim() !== '')
  if (keys.length === 0) return undefined
  const n = clampInt(counterRef.count, 0, Number.MAX_SAFE_INTEGER, 0)
  counterRef.count = n + 1
  return keys[n % keys.length]
```

</details>

#### 缺口

- 未验真实浏览器到回环的限制及账号额度
  **影响**：不能推断任意网页均可调用或免费额度稳定
  **进一步探讨**：用假 key 和两个本地 origin 检查预检、GET、POST 与上游收到的请求

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 何时适合直接配置上游，怎样验证更窄的代理控制面？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

现有固定版优先观察，不把真实 key 放入轮换池。要复核可用假 key、隔离测试用户、受控端点，模拟失效 key、端口冲突和清空池。没有真实付费或账户任务数据，目录维护、模型额度及处理失败的人工成本均未知。假设将读写密钥控制面移回宿主认证路径，返回只含数量和状态，能保留轮换便利并减少可见密钥和改写目标；若合法调用仍必须把 key 返回浏览器，或写入失败后无法确认撤销，则方案不能满足试用要求。退出时恢复原 provider 地址，核对磁盘池和本地监听。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:91-113](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L91-L113)

旧池保存逻辑会拒绝空替换，清理需回读。

<details>
<summary>查看原文（23行）</summary>

```text
  function writePoolFile(pools, targets) {
    try {
      if (Object.keys(pools).length === 0 && fs.existsSync(poolFilePath)) {
        const diskPools = JSON.parse(fs.readFileSync(poolFilePath, 'utf8')).keyPools || {}
        if (Object.keys(diskPools).length > 0) {
          console.warn(LOG_PREFIX, 'refusing to replace non-empty pool file with empty; keeping existing pools')
          return
        }
      }
      fs.writeFileSync(poolFilePath, JSON.stringify({ keyPools: pools, targets }, null, 2), 'utf8')
      filePools = pools
      fileTargets = targets
      // Update dummy env vars for all pooled providers
      for (const [pid, keys] of Object.entries(pools)) {
        if (Array.isArray(keys) && keys.length > 0) {
          const envName = pid.replace(/-/g, '_').toUpperCase() + '_API_KEY'
          if (!process.env[envName]) process.env[envName] = 'dsh-proxy-pool'
        }
      }
      console.log(LOG_PREFIX, `saved key pools to ${poolFilePath} (${Object.keys(pools).length} providers)`)
    } catch (err) {
      console.warn(LOG_PREFIX, 'pool file write failed:', err && err.message)
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:123-167](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/index.js#L123-L167)

可作为认证和响应内容实验对照。

<details>
<summary>查看原文（45行）</summary>

```text
  function handleProxy(req, res) {
    console.log(LOG_PREFIX, `REQUEST: ${req.method} ${req.url}`)
    // CORS for browser probes (panel ping / pool-check).
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return }

    const url = new URL(req.url, `http://127.0.0.1:${actualPort}`)
    const parts = url.pathname.replace(/^\/+/, '').split('/')
    // URL format: /p/<action> or /p/<pid>/<api-path...>
    const ns = parts[0] // always 'p' (namespace prefix)
    const action = parts[1] || ''
    const rest = parts.slice(2).join('/')

    // health probe  /p/ping
    if (ns === 'p' && action === 'ping' && !rest) {
      res.writeHead(200, { 'Content-Type': 'text/plain; charset=utf-8' })
      res.end('ok')
      return
    }

    // save pools from client  POST /p/save-pools
    if (ns === 'p' && action === 'save-pools' && !rest && req.method === 'POST') {
      let body = ''
      req.on('data', (chunk) => { body += chunk })
      req.on('end', () => {
        try {
          const data = JSON.parse(body)
          writePoolFile(data.keyPools || {}, data.targets || {})
          res.writeHead(200, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ ok: true }))
        } catch {
          res.writeHead(400, { 'Content-Type': 'application/json' })
          res.end(JSON.stringify({ error: 'invalid json' }))
        }
      })
      return
    }

    // load pools from file  GET /p/load-pools
    if (ns === 'p' && action === 'load-pools' && !rest) {
      readPoolFile()
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify({ keyPools: filePools, targets: fileTargets }))
```

</details>

**依据 3 · 源码核查**：[lib/client.cjs:1135-1161](https://github.com/yu-wenchao/dsh-free-models-hub/blob/3c98fc5dfba7d69a2b96713739b5bdea99c9b5f4/lib/client.cjs#L1135-L1161)

UI 尝试清池并恢复 provider URL。

<details>
<summary>查看原文（27行）</summary>

```text
    // Also clear from file-based pools via proxy
    const port = await probeProxy()
    if (port) {
      try {
        const existingRes = await fetch(`http://127.0.0.1:${port}/p/load-pools`, { mode: 'cors', credentials: 'omit' }).catch(() => null)
        if (existingRes && existingRes.ok) {
          const existing = await existingRes.json().catch(() => ({}))
          const mergedPools = { ...(existing.keyPools || {}) }
          const mergedTargets = { ...(existing.targets || {}) }
          delete mergedPools[pid]
          delete mergedTargets[pid]
          await fetch(`http://127.0.0.1:${port}/p/save-pools`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ keyPools: mergedPools, targets: mergedTargets }),
          })
        }
      } catch { /* best effort */ }
    }
    // Restore original baseURL via settingsScope
    try {
      const bound = await getBoundNamespace('llm-pi-ai')
      if (bound && typeof bound.set === 'function') {
        const allProviders = await readProviders(bound)
        if (allProviders[pid]) {
          allProviders[pid] = { ...allProviders[pid], baseURL: item.apiBase }
          await bound.set('providers', allProviders)
```

</details>

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
