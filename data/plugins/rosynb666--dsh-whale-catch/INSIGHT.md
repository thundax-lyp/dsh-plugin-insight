# dsh-whale-catch

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[cbd5491](https://github.com/Rosynb666/dsh-whale-catch/tree/cbd54910234128193c359465fe2fb008cfcfd73d)

<!-- BEGIN META -->
[![GitHub ★ 101](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=101&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Rosynb666/dsh-whale-catch) [![npm 30d 1,968](https://img.shields.io/static/v1?label=npm+30d&message=1%2C968&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-catch) [![最新发布 2026-11-04](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-04&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-whale-catch)
<!-- END META -->

> **功能**：在 DSH 侧栏收集会话产物，提供预览、差异、交付台账、体检、归档和还原。

> **亮点**：把显式产物、宿主改动和mtime扫描汇为常驻工作台，并连到hash归档清单与历史回看，减少入口分散；收益尚无同任务对照。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：自动集合既不证明完整也不证明归属；敏感体检只是有界提示，还原可能部分成功，界面预览未在Host绑定计划。[Q01](#research-q01) [Q02](#research-q02)

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
  - [Q01 · 三路收集如何形成侧栏文件集合，相比手动目录多什么？](#detail-section-11)
  - [Q02 · 归档、体检和恢复如何限制敏感数据及覆盖副作用？](#detail-section-12)
  - [Q03 · 全周期成本与可控试用是什么，能推导什么假设？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：会话内产物较多的交付者可集中查看并复制归档；完整性仍由显式清单核对。[Q01](#research-q01)

人工翻目录打包与宿主单次产物卡片可完成部分任务；插件增加会话级汇聚和本地交付记录，扫描归属为启发式。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 会话候选收集 | 聚合产物与文件改动 | mtime扫描不保证完整或归属 |
| 归档复制 | 保存文件与hash清单 | 逐项失败，不是整批事务 |
| 交付体检 | 提示缺失、大小和敏感模式 | 文件头扫描为warn，不能证明无秘密 |
| 归档还原 | 按skip、rename或overwrite回写cwd | 先预览、备份并核对部分结果 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node ^22.19或>=24、DSH Web服务 | 必需，声明/源码 | 文件I/O及HTTP路由 | 后端无法提供工作台 |
| 侧栏slots、locale与tabs | 界面必需 | 查看及操作 | 无对应界面入口 |
| agents、workspaceChanges | 对应信息可选 | cwd、时间和改动摘要 | 收集范围或信息降级 |
| 可读cwd、可写归档和备份 | 交付操作必需 | 扫描、复制与恢复 | 逐项跳过或失败 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户安装、选会话和归档目录 | 面板列出候选与扫描限制 |
| 筛选 | 用户核对清单并查看体检 | 敏感warn人工处理，不当无风险结论 |
| 归档 | 后端复制并保存hash清单 | 核对copied和failed，不能只看通知 |
| 恢复 | 用户先预览再在备份下确认 | 逐项核对restored/skipped/failed，部分失败人工恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地目录与安装资源，量未知 | 配置cwd、归档及清单，时间未知 | 无额外模型服务链 |
| 持续 | 扫描I/O、hash和归档副本 | 人工确认归属、漏收和敏感内容 | 未测单位交付成本 |
| 失败恢复 | 备份副本与重复复制 | 核对部分结果及还原错误 | 默认可备份，但配置可关闭 |
| 退出 | 归档与台账仍占空间 | 停用插件，按清单人工管理副本 | 不假定自动删除历史 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 候选汇聚 | 三路来源合入集合 | 归属和完整性 |
| 归档 | 文件hash清单及逐项失败 | 是否减少漏交与时间 |
| 体检还原 | 有界敏感提示、预览与备份机制 | 全面秘密检测和整批原子恢复 |

> **思考**：自动集合既不证明完整也不证明归属；敏感体检只是有界提示，还原可能部分成功，界面预览未在Host绑定计划。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把显式产物、宿主改动和mtime扫描汇为常驻工作台，并连到hash归档清单与历史回看，减少入口分散；收益尚无同任务对照。[Q01](#research-q01) [Q03](#research-q03)

来源聚合与扫描模块分离、归档hash和逐项失败有助可追溯；COPYFILE_EXCL与真实父目录检查值得借鉴。恢复并非事务，API预览未绑定，不能以界面步骤推出强服务端门禁。

<a id="detail-section-5"></a>

### 1.4 主要限制

自动集合既不证明完整也不证明归属；敏感体检只是有界提示，还原可能部分成功，界面预览未在Host绑定计划。[Q01](#research-q01) [Q02](#research-q02)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用含旧mtime复制件的固定目录核对漏收，仅复制归档；还原放在可丢弃目录并逐项确认，异常退回人工打包。[Q03](#research-q03)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

采集、归档、体检和还原链路已有源码支持；完整交付收益未测，摘要绑定是未实现假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、lib/index.js、lib/scan.js、lib/routes.js、lib/preflight.js、lib/restore.js、lib/client.js、lib/ledger.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查收集事件、扫描、主要归档/还原路径、体检和客户端恢复入口；未完整审计所有预览、搜索与ZIP实现，不把作者支持列表当全部运行确认。
- 下一步：用明确预期清单比较人工和插件，额外测试预览后改文件及部分恢复失败；本次未执行。

**分析版本**

- **仓库**：[Rosynb666/dsh-whale-catch](https://github.com/Rosynb666/dsh-whale-catch)
- **版本号**：0.4.0（[固定提交 cbd5491](https://github.com/Rosynb666/dsh-whale-catch/tree/cbd54910234128193c359465fe2fb008cfcfd73d)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是预览时固定清单及hash，在应用前拒绝版本漂移，减少错版本交付；以预览后改文件的对照检验，不降错配或等待过大就放弃。[Q03](#research-q03)

用明确预期清单比较人工和插件，额外测试预览后改文件及部分恢复失败；本次未执行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 9 | 2524 | — | — | 24012 |
| .js | source | 16 | 6883 | 5249 | 1247 | — |
| .js | test | 13 | 2700 | 2314 | 139 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Rosynb666/dsh-whale-catch/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=1&color=737b86&logo=github)](https://github.com/Rosynb666/dsh-whale-catch/issues?q=is%3Aissue+created%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z) [![近30天关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/Rosynb666/dsh-whale-catch/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T13%3A09%3A40.123Z..2026-11-05T13%3A09%3A40.123Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话产物自动收集能否形成可核对交付，哪些扫描和恢复边界必须由用户承担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 三路收集如何形成侧栏文件集合，相比手动目录多什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

它面向在DSH会话里生成或修改多种文件、需要集中交付的人，合格结果是选定成果可核对并归档，而非列表条数增加。宿主监听deliverables/presented把描述写台账，workspace/changes通过可选服务取得改动，turn/end安排扫描；扫描结果合入同一Basket。相对单次present卡片与人工翻目录，增量是会话级汇聚及为bash等外部写文件兜底。扫描只按cwd内mtime和深度/数量/体积门槛推断，跳过点文件、符号链接、默认目录和不可读分支，因此既可能漏掉旧mtime复制件，也可能收进其他进程同时改过的文件。“零登记”降低声明负担，但不证明文件由此会话产生或集合完整。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:410-462](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/index.js#L410-L462)

present、workspace changes和turn/end的事件接线。

<details>
<summary>查看原文（53行）</summary>

```text
    if (typeof sessionId !== 'string' || event === null || typeof event !== 'object') return
    let record
    try {
      record = ensure(sessionId, session?.header?.cwd)
    } catch {
      return
    }

    if (event.type === 'deliverables/presented') {
      const files = event.data?.files
      const turn = event.data?.turn
      record.basket.addPresented(files, turn)
      // 描述与轮次只活在内存里，重启就没了；这里顺手写进台账，下次打开再回填。
      if (config.ledger) {
        const payload = []
        for (const file of Array.isArray(files) ? files : []) {
          if (file === null || typeof file !== 'object' || typeof file.path !== 'string') continue
          const abs = path.resolve(record.basket.cwd, file.path)
          const rel = path.isAbsolute(file.path)
            ? toPosix(path.normalize(file.path))
            : toPosix(path.relative(record.basket.cwd, abs))
          if (rel === '' || rel.startsWith('../')) continue
          payload.push({ rel, desc: typeof file.description === 'string' ? file.description : '' })
        }
        if (payload.length > 0) {
          appendEvent(ledgerDir, sessionId, {
            v: 1,
            t: 'present',
            at: Date.now(),
            turn: Number.isFinite(turn) ? turn : null,
            files: payload,
          }).catch(() => {})
        }
      }
      return
    }
    if (event.type === 'workspace/changes') {
      const seq = typeof event.seq === 'number' ? event.seq : undefined
      if (seq === undefined) return
      let summary
      try {
        summary = changesOf()?.summary?.(sessionId, seq)
      } catch {
        summary = undefined
      }
      if (summary !== undefined && Array.isArray(summary?.files)) {
        record.basket.addChanged(summary.files, event.data?.turn, seq)
      }
      return
    }
    if (event.type === 'turn/end') {
      scheduleScan(sessionId)
    }
```

</details>

**依据 2 · 源码核查**：[lib/index.js:284-303](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/index.js#L284-L303)

按会话cwd和since扫描再合入Basket。

<details>
<summary>查看原文（20行）</summary>

```text
  async function scan(sessionId, force = false) {
    const record = ensure(sessionId)
    if (!force && Date.now() - record.lastScanAt < 1500) return
    if (record.scanning !== null) return record.scanning
    record.scanning = (async () => {
      const result = await scanWorkspace({
        cwd: record.basket.cwd,
        sinceMs: record.basket.sinceMs,
        ignore: config.ignore,
        ignorePaths: [config.archiveDir],
        maxDepth: config.maxDepth,
        maxFiles: config.maxFiles,
        maxFileBytes: config.maxFileBytes,
      })
      record.basket.addScan(result)
      record.lastScanAt = Date.now()
    })().finally(() => {
      record.scanning = null
    })
    return record.scanning
```

</details>

**依据 3 · 源码核查**：[lib/scan.js:93-147](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/scan.js#L93-L147)

扫描的跳过、mtime和截断条件。

<details>
<summary>查看原文（55行）</summary>

```text
  async function walk(dir, depth, relBase) {
    if (truncated || depth > maxDepth) return
    let entries
    try {
      entries = await fs.readdir(dir, { withFileTypes: true })
    } catch {
      // 权限不足 / 目录已被删：跳过这一支，不要让整次扫描失败
      return
    }
    // 目录项按名称排序，让结果稳定（也方便测试）
    entries.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0))

    for (const entry of entries) {
      if (truncated) return
      const name = entry.name
      if (name.startsWith('.')) continue
      if (entry.isDirectory() && ignoreDirs.has(name)) continue

      const abs = path.join(dir, name)
      if (ignoreAbs.has(abs)) continue
      const rel = relBase === '' ? name : `${relBase}/${name}`

      if (++visited > maxVisited) {
        truncated = true
        return
      }

      if (entry.isSymbolicLink()) continue
      if (entry.isDirectory()) {
        await walk(abs, depth + 1, rel)
        continue
      }
      if (!entry.isFile()) continue

      let stat
      try {
        stat = await fs.stat(abs)
      } catch {
        continue
      }
      if (!stat.isFile()) continue
      if (stat.size > maxFileBytes) continue
      if (stat.mtimeMs < since) continue

      files.push({
        path: abs,
        rel,
        name,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      })

      if (files.length >= maxFiles) {
        truncated = true
        return
```

</details>

**依据 4 · 作者声明**：[README.md:49-56](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/README.md#L49-L56)

作者目标交付场景。

```text
在 DSH 里连续干上几轮活之后，「文件到底产出到哪了」几乎是日常问题：

- 🪟 内核的**产出物卡片**只在当前这一轮出现，往下翻几屏就散了；
- 🐚 在 `bash` 里跑 `python build_doc.py`、`npm run build` 写出来的 docx / pdf / zip，既不算「文件工具改动」，也没调 `present`，两套机制都不认；
- 📦 攒了十几个交付物想一次发给别人，只能回目录里翻，还要担心漏掉；
- 🔍 改过的文件想看看「改了多少、改了什么」，得切回 git 或翻历史。

鱼篓现在管一条线：**自动收**、**一处看**、**交付前体检**、**打包 / 归档 / 回执**、**历史可回看可还原**。改过的文件能就地展开 unified diff、按轮次翻版本、搜正文，都在同一个侧栏里完成。
```

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 归档、体检和恢复如何限制敏感数据及覆盖副作用？

**研究主题**：缺陷与关键质疑、工程质量与复用、依赖、兼容与流程

#### 完整回答

插件强制依赖webServer，agents和workspaceChanges缺失会使会话定位或改动信息降级。路由做同源和写请求JSON检查；归档复制选中文件、保存sha256及逐项失败，不是全批原子事务。体检中敏感模式只扫描文件头，默认64KiB，命中为warn并不排除文件；未命中不能证明无秘密。还原计划拒绝不安全相对路径与目标符号链接，执行时检查真实父目录留在cwd，新建用COPYFILE_EXCL避免覆盖竞争；overwrite可先备份，但配置能关闭备份，逐项失败不自动回滚前面已恢复文件。界面确实先dry-run再确认；Host API只看本次dryRun布尔值，没绑定已审阅计划，所以“必须先预览”是界面流程而不是服务端强约束。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:41-42](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/index.js#L41-L42)

强制webServer依赖。

```text
/** 只强制依赖 webServer：没有它这个插件没有意义。其余服务全部可选。 */
export const inject = ['webServer']
```

**依据 2 · 源码核查**：[lib/routes.js:434-440](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/routes.js#L434-L440)

同源和JSON检查。

```text
    if (!isSameOrigin(req, allowHosts)) {
      sendError(res, 403, 'cross-origin', '只接受同源请求')
      return
    }
    if (method !== 'GET' && method !== 'HEAD' && !hasJsonContentType(req)) {
      sendError(res, 415, 'unsupported-media-type', '写操作需要用 application/json')
      return
```

**依据 3 · 源码核查**：[lib/preflight.js:154-194](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/preflight.js#L154-L194)

有界文件头扫描与warn结果。

<details>
<summary>查看原文（41行）</summary>

```text
export async function scanSensitive(files, options = {}) {
  const maxFileBytes = Number(options.maxFileBytes) || 64 * 1024 * 1024
  const maxScanBytes = Math.max(1024, Number(options.maxScanBytes) || DEFAULT_SCAN_BYTES)
  const concurrency = Math.max(1, Math.min(8, Number(options.concurrency) || 4))
  const signal = options.signal
  const candidates = (files ?? []).filter(
    (file) => file && !file.missing && Number(file.size) > 0 && Number(file.size) <= maxFileBytes,
  )

  /** @type {any[]} */
  const issues = []
  let cursor = 0

  const worker = async () => {
    while (cursor < candidates.length) {
      if (signal?.aborted) return
      const index = cursor
      cursor += 1
      const file = candidates[index]
      let handle
      try {
        handle = await fsp.open(file.path, 'r')
        const length = Math.min(maxScanBytes, Number(file.size) || maxScanBytes)
        const buffer = Buffer.alloc(length)
        const { bytesRead } = await handle.read(buffer, 0, length, 0)
        const head = buffer.subarray(0, bytesRead)
        if (!looksLikeText(head)) continue
        const text = head.toString('utf8')
        for (const pattern of SENSITIVE_CONTENT_PATTERNS) {
          const match = pattern.re.exec(text)
          if (match === null) continue
          const line = text.slice(0, match.index).split('\n').length
          issues.push({
            code: 'sensitive-content',
            level: 'warn',
            rel: file.rel,
            path: file.path,
            pattern: pattern.id,
            line,
            detail: '文件头命中密钥模式（内容未回传）',
          })
```

</details>

**依据 4 · 源码核查**：[lib/restore.js:91-147](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/restore.js#L91-L147)

路径及目标类型计划。

<details>
<summary>查看原文（57行）</summary>

```text
export async function planRestore({ manifest, baseDir, cwd, mode = 'skip', paths }) {
  const wanted = Array.isArray(paths) && paths.length > 0 ? new Set(paths) : null
  const files = Array.isArray(manifest?.files) ? manifest.files : []
  const entries = []
  const blocked = []

  for (const file of files) {
    if (file === null || typeof file !== 'object') continue
    const rel = safeRelative(file.rel)
    const stored = safeRelative(file.stored ?? file.rel)
    if (rel === undefined || stored === undefined) {
      blocked.push({ rel: String(file.rel ?? '—'), reason: 'unsafe-path' })
      continue
    }
    if (wanted !== null && !wanted.has(file.rel) && !wanted.has(rel)) continue
    const source = path.resolve(baseDir, ...stored.split('/'))
    const sourceRoot = path.resolve(baseDir)
    const normalizedRoot = process.platform === 'win32' ? sourceRoot.toLowerCase() : sourceRoot
    const normalizedSource = process.platform === 'win32' ? source.toLowerCase() : source
    if (normalizedSource !== normalizedRoot && !normalizedSource.startsWith(normalizedRoot + path.sep)) {
      blocked.push({ rel, reason: 'unsafe-source' })
      continue
    }
    const target = targetWithin(cwd, rel)
    if (target === undefined) {
      blocked.push({ rel, reason: 'unsafe-target' })
      continue
    }

    const sourceStat = await lstatOrUndefined(source)
    if (sourceStat === undefined || !sourceStat.isFile()) {
      entries.push({ rel, stored, source, target, action: 'missing', reason: '归档里没有这个文件' })
      continue
    }
    const targetStat = await lstatOrUndefined(target)
    if (targetStat === undefined) {
      entries.push({ rel, stored, source, target, action: 'create' })
      continue
    }
    if (targetStat.isSymbolicLink()) {
      entries.push({ rel, stored, source, target, action: 'conflict', reason: '目标是符号链接' })
      continue
    }
    if (!targetStat.isFile()) {
      entries.push({ rel, stored, source, target, action: 'conflict', reason: '目标不是普通文件' })
      continue
    }
    if (mode === 'skip') {
      entries.push({ rel, stored, source, target, action: 'skip', reason: '目标已存在' })
    } else if (mode === 'rename') {
      entries.push({ rel, stored, source, target: await uniqueTarget(target), action: 'create', renamed: true })
    } else {
      entries.push({ rel, stored, source, target, action: 'overwrite' })
    }
  }

  return { entries, blocked }
```

</details>

**依据 5 · 源码核查**：[lib/restore.js:163-218](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/restore.js#L163-L218)

执行逐项结果、真实父目录、新建EXCL和可选备份。

<details>
<summary>查看原文（56行）</summary>

```text
export async function applyRestore({ manifest, baseDir, cwd, mode = 'skip', dryRun = false, backupRoot, paths }) {
  const { entries, blocked } = await planRestore({ manifest, baseDir, cwd, mode, paths })
  const restored = []
  const skipped = []
  const failed = []
  const backups = []

  if (dryRun) {
    return { dryRun: true, plan: entries, blocked, restored, skipped, failed, backups }
  }

  for (const entry of entries) {
    if (entry.action === 'skip' || entry.action === 'missing' || entry.action === 'conflict') {
      skipped.push(entry)
      continue
    }
    try {
      const parent = path.dirname(entry.target)
      await fsp.mkdir(parent, { recursive: true })
      const parentReal = await fsp.realpath(parent)
      const cwdReal = await fsp.realpath(cwd)
      const normalizedCwd = process.platform === 'win32' ? cwdReal.toLowerCase() : cwdReal
      const normalizedParent = process.platform === 'win32' ? parentReal.toLowerCase() : parentReal
      if (normalizedParent !== normalizedCwd && !normalizedParent.startsWith(normalizedCwd + path.sep)) {
        failed.push({ ...entry, reason: 'parent-outside-cwd' })
        continue
      }

      if (entry.action === 'overwrite' && typeof backupRoot === 'string' && backupRoot !== '') {
        const backup = path.resolve(backupRoot, ...entry.rel.split('/'))
        await fsp.mkdir(path.dirname(backup), { recursive: true })
        await fsp.copyFile(entry.target, backup)
        backups.push(entry.rel)
      }

      if (entry.action === 'overwrite') {
        await fsp.copyFile(entry.source, entry.target)
      } else {
        // 新建用 EXCL，避免检查与写入之间被别人抢了同一个名字
        try {
          await fsp.copyFile(entry.source, entry.target, fsConstants.COPYFILE_EXCL)
        } catch (error) {
          if (error?.code === 'EEXIST') {
            skipped.push({ ...entry, action: 'skip', reason: '目标已存在' })
            continue
          }
          throw error
        }
      }
      restored.push(entry)
    } catch (error) {
      failed.push({ ...entry, reason: String(error?.message ?? error) })
    }
  }

  return { dryRun: false, plan: entries, blocked, restored, skipped, failed, backups }
```

</details>

**依据 6 · 源码核查**：[lib/client.js:1794-1829](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/client.js#L1794-L1829)

界面先预览再应用。

<details>
<summary>查看原文（36行）</summary>

```text
        function openRestore(event) {
          setRestore({ run: event.run, mode: 'skip', loading: true, plan: [] })
          postJson('archive/restore', { session: sessionId, run: event.run, mode: 'skip', dryRun: true })
            .then(function (value) {
              if (!mounted.current) return
              setRestore({ run: event.run, mode: 'skip', loading: false, plan: value.plan || [], blocked: value.blocked || [] })
            })
            .catch(function (cause) {
              if (!mounted.current) return
              setRestore({ run: event.run, loading: false, error: String((cause && cause.message) || cause), plan: [] })
            })
        }

        function changeRestoreMode(mode) {
          if (restore === null) return
          setRestore(Object.assign({}, restore, { mode: mode, loading: true }))
          postJson('archive/restore', { session: sessionId, run: restore.run, mode: mode, dryRun: true })
            .then(function (value) {
              if (!mounted.current) return
              setRestore({ run: restore.run, mode: mode, loading: false, plan: value.plan || [], blocked: value.blocked || [] })
            })
            .catch(function (cause) {
              if (!mounted.current) return
              setRestore(Object.assign({}, restore, { mode: mode, loading: false, error: String((cause && cause.message) || cause) }))
            })
        }

        function applyRestore() {
          if (restore === null) return
          var mode = restore.mode
          setRestore(Object.assign({}, restore, { loading: true }))
          postJson('archive/restore', { session: sessionId, run: restore.run, mode: mode, dryRun: false })
            .then(function (value) {
              if (!mounted.current) return
              setRestore({ run: restore.run, done: true, result: value, plan: restore.plan || [] })
              setNotice(format(t('restore.done'), { count: (value.restored || []).length }))
```

</details>

**依据 7 · 源码核查**：[lib/routes.js:772-787](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/routes.js#L772-L787)

API直接接受dryRun请求，没有计划摘要绑定。

<details>
<summary>查看原文（16行）</summary>

```text
      if (route === 'archive/restore' && method === 'POST') {
        const body = await readJsonBody(req, maxBodyBytes)
        const session = typeof body.session === 'string' ? body.session : ''
        const run = typeof body.run === 'string' ? body.run : ''
        if (!SAFE_ID.test(session)) {
          sendError(res, 400, 'bad-session', '缺少或非法的 session 参数')
          return
        }
        const value = await store.restoreRun(session, {
          run,
          paths: Array.isArray(body.paths) ? body.paths.filter((item) => typeof item === 'string') : undefined,
          mode: body.mode,
          dryRun: body.dryRun === true,
          cwd: typeof body.cwd === 'string' ? body.cwd : undefined,
        })
        sendJson(res, 200, { ok: true, value })
```

</details>

**依据 8 · 源码核查**：[lib/index.js:603-618](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/index.js#L603-L618)

overwrite备份取决于restoreBackup配置。

<details>
<summary>查看原文（16行）</summary>

```text
    const mode = input.mode === 'overwrite' || input.mode === 'rename' ? input.mode : 'skip'
    const dryRun = input.dryRun === true
    let backupRoot
    if (!dryRun && mode === 'overwrite' && config.restoreBackup) {
      const stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\..+$/, '').replace('T', '-')
      backupRoot = path.join(config.archiveDir, sessionId, '_whale-catch', 'backups', stamp)
    }
    const result = await applyRestore({
      manifest: hit.manifest,
      baseDir: hit.baseDir,
      cwd: record.basket.cwd,
      mode,
      dryRun,
      backupRoot,
      paths: Array.isArray(input.paths) ? input.paths : undefined,
    })
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 全周期成本与可控试用是什么，能推导什么假设？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

首次需要匹配的DSH Web服务、侧栏客户端及Node运行时，用户要设定cwd和归档位置，准备包含一个漏收候选的文件清单。持续代价是目录扫描I/O、归档副本、hash计算和人工筛选；没有额外模型链路但不等于无资源成本，金额与耗时未知。失败恢复要核对逐项failed/blocked/skipped，不能只看成功数量，也不能把已交付勾选视为接收方收到文件。适合有备份且能人工核对清单的本地交付者试用，先只预览/归档复制，再在可丢弃目录测试还原；敏感文件或清单不齐就退回人工打包。由mtime归属与预览不绑定可提出未验证假设：显式记录预览清单摘要并在应用前比对文件hash，可减少预览后改动造成的交付偏差。对照现流程与摘要绑定流程，若遗漏/错版本不减少或hash等待过大，就推翻它。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:62-78](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/index.js#L62-L78)

扫描、打包、台账与备份配置决定资源边界。

<details>
<summary>查看原文（17行）</summary>

```text
export const Config = Schema.object({
  archiveDir: Schema.string().description('归档目录；缺省 $DSH_HOME/whale-catch/archive'),
  ignore: Schema.array(Schema.string()).default([]).description('额外忽略的目录名'),
  maxFileBytes: Schema.number().default(64 * 1024 * 1024).description('单文件上限（字节）'),
  maxFiles: Schema.number().default(800).description('最多收录多少个文件'),
  maxDepth: Schema.number().default(6).description('目录遍历深度'),
  lookbackMinutes: Schema.number().default(720).description('拿不到会话创建时间时，往回看多少分钟'),
  maxZipBytes: Schema.number().default(512 * 1024 * 1024).description('打包总量上限（字节）'),
  maxBodyBytes: Schema.number().default(1024 * 1024).description('请求体上限（字节）'),
  archiveKeep: Schema.number().default(0).description('归档保留批次数；> 0 时每次归档写入独立批次目录，只保留最近 N 批'),
  allowHosts: Schema.array(Schema.string()).default([]).description('额外允许的 Host 名；默认只放行 localhost 与 IP 字面量'),
  ledger: Schema.boolean().default(true).description('是否写交付台账索引（清单始终写，索引可重建）'),
  ledgerDir: Schema.string().description('台账索引目录；缺省 $DSH_HOME/whale-catch/ledger'),
  searchMaxBytes: Schema.number().default(64 * 1024).description('内容搜索每个文件最多读多少字节'),
  searchTimeoutMs: Schema.number().default(3000).description('内容搜索总预算（毫秒）'),
  restoreBackup: Schema.boolean().default(true).description('还原覆盖前是否备份原文件'),
  sensitivePatterns: Schema.array(Schema.string()).default([]).description('额外的敏感文件名通配符'),
```

</details>

**依据 2 · 源码核查**：[lib/routes.js:1017-1068](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/routes.js#L1017-L1068)

逐文件拷贝、hash、清单和失败结果。

<details>
<summary>查看原文（52行）</summary>

```text
        for (const file of selected) {
          // 归档是拷贝，不像 zip 那样占内存，但同样不该把 2 GB 的临时文件
          // 悄悄搬进归档目录；与 zip 使用同一个单文件上限。
          if (file.size > config.maxFileBytes) {
            failed.push({ path: file.rel, reason: 'too-large' })
            manifestFailed.push({ rel: file.rel, reason: 'too-large' })
            continue
          }
          // cwd 之外的文件（`present` 声明的绝对路径）没有相对位置可言：
          // 统一收进 `_external/<文件名>`。0.1.2 会把它按绝对路径镜像成
          // `Users/…`（Windows 上还有盘符目录），既丑又可能撞名。
          const dest = path.isAbsolute(file.rel)
            ? path.join(root, '_external', path.basename(file.rel))
            : path.join(root, ...toPosix(file.rel).split('/'))
          if (!dest.startsWith(root + path.sep)) {
            failed.push({ path: file.rel, reason: 'unsafe-path' })
            manifestFailed.push({ rel: file.rel, reason: 'unsafe-path' })
            continue
          }
          let target = ''
          try {
            await fsp.mkdir(path.dirname(dest), { recursive: true })
            // 归档根目录下如果被人放了指向外部的符号链接，mkdir/copyFile 会跟着
            // 跑出去；用 realpath 再确认一次父目录仍在根内。
            if (!withinRoot(await fsp.realpath(path.dirname(dest)))) {
              failed.push({ path: file.rel, reason: 'unsafe-path' })
              manifestFailed.push({ rel: file.rel, reason: 'unsafe-path' })
              continue
            }
            const exists = await fsp.lstat(dest).then(() => true, () => false)
            if (exists && (await fsp.lstat(dest)).isSymbolicLink()) {
              failed.push({ path: file.rel, reason: 'unsafe-path' })
              manifestFailed.push({ rel: file.rel, reason: 'unsafe-path' })
              continue
            }
            target = exists ? await uniquePath(dest) : dest
            const sha256 = await copyWithHash(file.path, target)
            const stat = await fsp.stat(target)
            copied.push(toPosix(path.relative(snapshot.archiveDir, target)))
            manifestFiles.push({
              rel: toPosix(file.rel),
              stored: toPosix(path.relative(root, target)),
              size: stat.size,
              mtimeMs: file.mtimeMs ?? stat.mtimeMs,
              sha256,
              turn: Number.isFinite(file.turn) ? file.turn : null,
              desc: typeof file.description === 'string' ? file.description : null,
            })
          } catch (error) {
            if (target !== '') await fsp.rm(target, { force: true }).catch(() => {})
            failed.push({ path: file.rel, reason: String(error?.message ?? error) })
            manifestFailed.push({ rel: file.rel, reason: String(error?.message ?? error) })
```

</details>

**依据 3 · 源码核查**：[lib/restore.js:163-218](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/restore.js#L163-L218)

部分执行结果需要人工核对。

<details>
<summary>查看原文（56行）</summary>

```text
export async function applyRestore({ manifest, baseDir, cwd, mode = 'skip', dryRun = false, backupRoot, paths }) {
  const { entries, blocked } = await planRestore({ manifest, baseDir, cwd, mode, paths })
  const restored = []
  const skipped = []
  const failed = []
  const backups = []

  if (dryRun) {
    return { dryRun: true, plan: entries, blocked, restored, skipped, failed, backups }
  }

  for (const entry of entries) {
    if (entry.action === 'skip' || entry.action === 'missing' || entry.action === 'conflict') {
      skipped.push(entry)
      continue
    }
    try {
      const parent = path.dirname(entry.target)
      await fsp.mkdir(parent, { recursive: true })
      const parentReal = await fsp.realpath(parent)
      const cwdReal = await fsp.realpath(cwd)
      const normalizedCwd = process.platform === 'win32' ? cwdReal.toLowerCase() : cwdReal
      const normalizedParent = process.platform === 'win32' ? parentReal.toLowerCase() : parentReal
      if (normalizedParent !== normalizedCwd && !normalizedParent.startsWith(normalizedCwd + path.sep)) {
        failed.push({ ...entry, reason: 'parent-outside-cwd' })
        continue
      }

      if (entry.action === 'overwrite' && typeof backupRoot === 'string' && backupRoot !== '') {
        const backup = path.resolve(backupRoot, ...entry.rel.split('/'))
        await fsp.mkdir(path.dirname(backup), { recursive: true })
        await fsp.copyFile(entry.target, backup)
        backups.push(entry.rel)
      }

      if (entry.action === 'overwrite') {
        await fsp.copyFile(entry.source, entry.target)
      } else {
        // 新建用 EXCL，避免检查与写入之间被别人抢了同一个名字
        try {
          await fsp.copyFile(entry.source, entry.target, fsConstants.COPYFILE_EXCL)
        } catch (error) {
          if (error?.code === 'EEXIST') {
            skipped.push({ ...entry, action: 'skip', reason: '目标已存在' })
            continue
          }
          throw error
        }
      }
      restored.push(entry)
    } catch (error) {
      failed.push({ ...entry, reason: String(error?.message ?? error) })
    }
  }

  return { dryRun: false, plan: entries, blocked, restored, skipped, failed, backups }
```

</details>

**依据 4 · 源码核查**：[lib/scan.js:127-146](https://github.com/Rosynb666/dsh-whale-catch/blob/cbd54910234128193c359465fe2fb008cfcfd73d/lib/scan.js#L127-L146)

mtime与上限不构成完整性证明。

<details>
<summary>查看原文（20行）</summary>

```text
      let stat
      try {
        stat = await fs.stat(abs)
      } catch {
        continue
      }
      if (!stat.isFile()) continue
      if (stat.size > maxFileBytes) continue
      if (stat.mtimeMs < since) continue

      files.push({
        path: abs,
        rel,
        name,
        size: stat.size,
        mtimeMs: stat.mtimeMs,
      })

      if (files.length >= maxFiles) {
        truncated = true
```

</details>

#### 缺口

- 无同条件交付遗漏率、人工时间和空间增长记录。
  **影响**：不能确认比人工打包总负担更低。
  **进一步探讨**：固定混合文件集合对比人工清单与插件，记录漏收、错版本、敏感提示和恢复时间。
- 预览摘要绑定假设没有实现或验证。
  **影响**：不能宣称当前预览防止检查后文件变化。
  **进一步探讨**：在预览与应用间修改文件，对比版本错配与等待成本。

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
