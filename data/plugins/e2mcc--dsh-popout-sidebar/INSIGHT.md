# Popout Sidebar

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[f2c72d6](https://github.com/e2mcc/dsh-popout-sidebar/tree/f2c72d6b39df536072c075b1f0c55eff84b12e77)

<!-- BEGIN META -->
[![GitHub ★ 205](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=205&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/e2mcc/dsh-popout-sidebar) [![npm 30d 1,267](https://img.shields.io/static/v1?label=npm+30d&message=1%2C267&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-popout-sidebar) [![最新发布 2026-08-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-08-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-popout-sidebar)
<!-- END META -->

> **功能**：在 DSH Web 中展示产物和文件树，并可弹出到独立浏览器标签页预览。

> **亮点**：[Q01](#research-q01) 支持将直接/间接文件观察与独立窗口查看整合，减少手工定位；不是新的文件生成或权限机制。

> **主要限制**：[Q02](#research-q02) 全局path列表/有界成功命令扫描不保证完整归因，读取路由未显式绑定会话策略；[Q03](#research-q03) Markdown链接协议未筛选，可信预览不等不可信内容安全。

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
  - [Q01 · 谁需要弹出产物，较手工文件查看多什么？](#detail-section-11)
  - [Q02 · 产物发现和文件读取会遗漏/混淆什么？](#detail-section-12)
  - [Q03 · 预览、依赖与全周期负担是什么？](#detail-section-13)
  - [Q04 · 什么范围值得采用，新假设怎么证伪？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常查看Agent生成文件并需要独立大窗口的DSH Web用户，可通过侧栏找产物与文件树。

文件管理器、外部编辑器与已有宿主侧栏是直接替代；预览便利不等生成质量或完整审计。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 产物列表 | 汇集直接和shell间接生成文件 | 有界/成功命令观察，不完整审计 |
| 文件树 | 按会话工作区浏览 | 读取端仍需宿主授权核查 |
| 弹出标签页 | 在独立窗口查看产物 | 同源同步和轮询，不能当隔离 |
| 多格式预览 | 文本/图/PDF/HTML等查看 | 文本截断，主动内容需可信 |
| 移除条目 | 清理观察列表 | 不删除磁盘或撤销文件变更 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| Node>=20与匹配DSH Web | 启动必需 | host/client及界面 | 宿主API变化可能失效 |
| 宿主fs/webServer/session | 文件功能必需 | 路由读取与会话根 | 根选择不等授权隔离 |
| 浏览器同源/localStorage | 弹出页/设置必需 | 同步会话和布局 | 多标签行为需核 |
| 可信文件或明确内容策略 | 预览前提 | Markdown/HTML等主动内容 | 不信任文件不应直接当安全预览 |
| 可接受扫描/轮询资源 | 持续使用前提 | 产物发现 | 大目录/并行写入会增加负担 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 安装 | 用户加载bundle重启并刷新 | 核实际host/client和会话 |
| 观察 | host监听工具，shell前后扫描 | 理解跳过/上限，不把未见当不存在 |
| 查看 | 浏览器取列表/内容或弹出页 | 路径/会话/内容可信，注意截断 |
| 清理/退出 | 用户移条目或关面板/插件 | 仅移列表不删文件，核路由监听退出 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 宿主/浏览器资源 | 兼容和会话/内容核对 | 安装耗时未知 |
| 持续使用 | shell扫描、轮询、媒体/渲染I/O | 核正确文件和未完整观察 | 性能/内存未测 |
| 失败恢复 | 原文件和可能重查资源 | 回文件管理器，核漏报/错会话 | 不提供磁盘回滚 |
| 退出 | 保留原文件 | 关插件核路由监听，设置可留存 | 内存产物记录重启会丢 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 产物发现 | write/edit和成功shell快照 | 失败/并行/跳过目录完整性 |
| 文件树 | 命名session不回退其他workspace | 读取端完整权限隔离 |
| 弹出预览 | HTTP内容与iframe/Markdown | 不可信内容/CSP真实边界 |
| 查看便利 | 路径聚合与独立窗口 | 真实节时、错误率与I/O代价 |

> **思考**：[Q02](#research-q02) 全局path列表/有界成功命令扫描不保证完整归因，读取路由未显式绑定会话策略；[Q03](#research-q03) Markdown链接协议未筛选，可信预览不等不可信内容安全。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 支持将直接/间接文件观察与独立窗口查看整合，减少手工定位；不是新的文件生成或权限机制。

[Q02](#research-q02) 命名会话解析失败不随意跳到其他workspace值得借鉴；有界快照控制部分资源，但静默遗漏与全局path合并要显式说明。[Q03](#research-q03) escape不能替代URL净化。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 全局path列表/有界成功命令扫描不保证完整归因，读取路由未显式绑定会话策略；[Q03](#research-q03) Markdown链接协议未筛选，可信预览不等不可信内容安全。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 观察共享/不可信内容采用，先以可信本地副本核路径和收益；错会话或非预期行为即关闭预览回文件管理器。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核实际host/client生成入口及规范源关键路径，未运行目标、构建或载荷。建议观察共享/不可信预览采用，覆盖收据为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.js、src/host.js、src/client.js、src/host/core.js、src/host/routes.js、src/client/core.js、src/client/preview.js、src/shared/markdown.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：读实际src/index/host.js/client.js关键段及规范host/core/routes、Markdown/预览源，未执行构建或目标。未审宿主fs/外层认证、全部PDF依赖或浏览器CSP，不声称复现越界/XSS。
- 下一步：独立profile核两会话读取范围、可控主动内容、失败shell/并行写者/扫描上限；比较正确定位与全部I/O和人工时间。

**分析版本**

- **仓库**：[e2mcc/dsh-popout-sidebar](https://github.com/e2mcc/dsh-popout-sidebar)
- **版本号**：1.0.1（[固定提交 f2c72d6](https://github.com/e2mcc/dsh-popout-sidebar/tree/f2c72d6b39df536072c075b1f0c55eff84b12e77)）
- **版本日期**：2026-10-11（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提议在已有sessionId/时间上补观察来源与扫描覆盖收据；若误归因/漏报判断不改善或I/O/理解负担过高即否定，不能代替授权和内容净化。

独立profile核两会话读取范围、可控主动内容、失败shell/并行写者/扫描上限；比较正确定位与全部I/O和人工时间。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 157 | — | — | 2200 |
| .js | source | 17 | 6083 | 5243 | 564 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-02），可前往 [GitHub Issues](https://github.com/e2mcc/dsh-popout-sidebar/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查产物发现与预览如何减少定位动作，以及扫描/会话/主动内容边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要弹出产物，较手工文件查看多什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它给DSH Web的单用户文件工作流增加产物列表、文件树和独立弹出预览页，适合模型经常生成图片/文档、用户需要在另一显示器查看结果的场景。合格结果是打开预期工作区的当前文件，知道是否完整/过时，而不只是右上角有按钮。相对手工在文件管理器找路径或把Chat里的文件名复制到浏览器，工具事件关联能省去定位步骤；只偶尔看一份文件或已有宿主侧栏满足需求时，额外面板可能多余。

真实入口src/index.js读固定host.js并构造插件，生成host/client才是运行材料，不能仅研究模板源就宣称已接线。host监听write/edit成功结果，另外在bash/pwsh执行前后比较工作区快照补充间接文件，列表可移除但不删磁盘；弹出页复用HTTP读取与会话同步。贡献是产物发现和查看界面的组合，不是生成文件、数据库或新的Agent能力。没有用户对照，不能由窗口更大就推出任务效率或更好交付。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:1-7](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/README.md#L1-L7)

作者定位产物/文件树与独立标签页。

```text
# 可弹出式侧边栏 · Popout Sidebar

**可弹出式侧边栏**：侧边栏展示产物与文件树，支持多种文件预览形式；并可弹出为独立浏览器标签页（可拖至另一显示器上更大更清晰的观看）；兼容其他 sidebar 插件，可以同时显示。

> **Popout Sidebar**: a sidebar that lists the agent's artifacts and a file tree, with multiple preview formats, and pops out into a separate browser tab (drag it to another monitor for a larger, clearer view) — coexisting with other sidebar plugins at the same time.

给 [DeepSeek Harness](https://github.com/deepseek-ai/DeepSeek-Harness) Web UI 增加一个展示**产物（artifacts）**与**文件树**的侧边栏，并可一键弹出为**独立浏览器标签页**。
```

**依据 2 · 源码核查**：[src/index.js:10-20](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/index.js#L10-L20)

实际加载生成host.js。

<details>
<summary>查看原文（11行）</summary>

```text
import { readFileSync } from 'node:fs'

// The body is a `return { ... }` statement; wrap it in a function and call
// it, exactly like the dynamic runner evaluates `code.host`.
// eslint-disable-next-line no-new-func
const makePlugin = new Function(readFileSync(new URL('./host.js', import.meta.url), 'utf8'))
const plugin = makePlugin()

export const name = 'dsh-popout-sidebar'
export const inject = plugin.inject ?? []
export const apply = plugin.apply
```

</details>

**依据 3 · 源码核查**：[src/host/core.js:132-145](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L132-L145)

write/edit成功事件入口。

<details>
<summary>查看原文（14行）</summary>

```text
    ctx.on('tools/result', (exec, result) => {
      try {
        if (!exec || !result || result.isError === true) return
        // Capture the session working directory on ANY successful tool result,
        // so the file tree roots at the real workspace (not the process cwd).
        const agent = exec.agent
        if (agent && agent.session && agent.session.header && typeof agent.session.header.cwd === 'string' && agent.session.header.cwd) {
          lastCwd = agent.session.header.cwd
        }
        const name = exec.name
        if (name !== 'write' && name !== 'edit') return
        const args = exec.arguments
        const path = args && typeof args.file_path === 'string' ? args.file_path : ''
        if (!path) return
```

</details>

**依据 4 · 源码核查**：[src/host/core.js:162-184](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L162-L184)

shell执行前后快照入口。

<details>
<summary>查看原文（23行）</summary>

```text
    // Fill the gap the `tools/result` whitelist leaves open: `bash`/`pwsh` write
    // files as a side effect of the shell command, never through a `write`/`edit`
    // result. Snapshot the workspace before and after the body and record the
    // new/changed files. `tools/execute` is the around-dispatch wrapper, so
    // `next()` runs the body — the "before" is taken pre-body, "after" post-body.
    ctx.on('tools/execute', async (exec, next) => {
      if (!exec || !WATCH_TOOLS[exec.name]) return next()
      const cwd = execCwd(exec)
      const before = await snapshotWorkspace(cwd)
      let outcome
      try {
        outcome = await next()
        return outcome
      } finally {
        if (before && outcome && outcome.isError !== true) {
          try {
            const after = await snapshotWorkspace(cwd)
            if (after) recordSnapshotDiff(before, after, exec)
          } catch (e) {
            console.error('[artifacts] snapshot diff failed', e)
          }
        }
      }
```

</details>

**依据 5 · 源码核查**：[src/host.js:249-256](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L249-L256)

移除只改列表。

```text
    // Remove a single tracked artifact entry (metadata only — never touches the
    // file on disk).
    const removeFile = (path) => {
      if (typeof path !== 'string' || !path) return { ok: false, error: 'missing path' }
      const idx = artifacts.findIndex((a) => a.path === path)
      if (idx < 0) return { ok: false, error: 'not found' }
      artifacts.splice(idx, 1)
      return { ok: true }
```

#### 缺口

- 缺少查找同一产物与原文件管理器/宿主侧栏的对照。
  **影响**：不能证明节时或新增面板值得维护。
  **进一步探讨**：按固定生成任务记录找到正确文件、版本误认和人工切换时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 产物发现和文件读取会遗漏/混淆什么？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

产物记录是进程内数组，最多1000项，按path合并并覆盖最近sessionId。bash/pwsh快照最多5000文件/16层，跳过隐藏目录以及dist/build/out等，读不了目录静默跳过；仅在next成功且有outcome时采集后快照，失败命令已产生的文件可能不入账。前后不同时间快照也不能把并行其他写者的变化可靠归因到这一条shell命令。它是有界观察列表，不是完整产物审计或文件历史。

文件树有较好的会话根处理：命名session先查live与持久sessionQuery，解析不了不换成别的workspace；无名请求才用最新会话/lastCwd等回退。但是读取文本/媒体的HTTP接口只收path，文本readFile用全局sandboxPolicy.workspaceRoot作cwd并fs.resolve/readText，没有随请求携session并显式resolve会话policy。列表snapshot本身也不按session过滤。这不能仅凭前端切换就当会话或租户隔离，实际文件权限仍取决宿主fs服务和外层web认证。本轮没有审宿主实现或尝试越界，不声称已复现任意文件读取。

文本读取后才截到200000字符，因而预览截断不等读盘/内存从一开始有同样上限；媒体读有25MiB限额。单用户可信本地文件可以先核正确路径，但共享/远程或不可信工作区要先核实际拒绝，不能把目录根选择当授权。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:63-96](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L63-L96)

扫描边界、全局数组和按path合并。

<details>
<summary>查看原文（34行）</summary>

```text
    const WATCH_TOOLS = { bash: 1, pwsh: 1 }
    // Directories never walked during a snapshot: VCS / cache / dependency
    // trees that are huge and never contain the artifacts the agent cares about.
    const SKIP_DIRS = new Set([
      'node_modules', 'venv', '.venv', 'env', '__pycache__', '.pytest_cache',
      '.mypy_cache', '.ruff_cache', '.tox', '.cache', '.next', '.nuxt',
      'dist', 'build', 'out', 'target', '.git', '.svn', '.hg', '.idea',
      '.vscode', '.dsh', '.workbuddy',
    ])
    const SNAPSHOT_MAX_FILES = 5000
    const SNAPSHOT_MAX_DEPTH = 16

    // Clip a diff snippet so the list payload stays bounded even when the
    // agent replaces a huge region in one edit.
    const clip = (s, n) => (s.length > n ? s.slice(0, n) + '\n…' : s)

    const snapshot = () => artifacts.slice().sort((a, b) => b.seq - a.seq)

    const recordFile = (path, kind, sessionId, diff) => {
      seq += 1
      const at = Date.now()
      const existing = artifacts.find((a) => a.path === path)
      if (existing) {
        existing.kind = kind
        existing.sessionId = sessionId
        existing.at = at
        existing.seq = seq
        existing.type = extType(path)
        if (diff) existing.diff = diff
      } else {
        const entry = { id: 'a' + seq, path: path, kind: kind, type: extType(path), sessionId: sessionId, at: at, seq: seq }
        if (diff) entry.diff = diff
        artifacts.push(entry)
        if (artifacts.length > 1000) artifacts = artifacts.slice(-1000)
```

</details>

**依据 2 · 源码核查**：[src/host/core.js:76-105](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L76-L105)

递归上限、跳过与失败目录旁路。

<details>
<summary>查看原文（30行）</summary>

```text
    const snapshotWorkspace = async (cwd) => {
      const fs = ctx.get('fs')
      if (!fs || typeof fs.listDir !== 'function' || typeof fs.resolve !== 'function') return null
      if (typeof cwd !== 'string' || !cwd) return null
      const childPath = (target, parent, name) => (typeof fs.processPath === 'function' ? fs.processPath(target) : parent.replace(/\/+$/, '') + '/' + name)
      const map = new Map()
      let count = 0
      const walk = async (dirPath, depth) => {
        if (count >= SNAPSHOT_MAX_FILES || depth > SNAPSHOT_MAX_DEPTH) return
        let entries
        try {
          const target = await fs.resolve(dirPath)
          entries = await fs.listDir(target)
        } catch (e) {
          return // unreadable directory — skip it, never fatal
        }
        if (!entries) return
        for (const e of entries) {
          if (count >= SNAPSHOT_MAX_FILES) return
          if (e.type === 'directory') {
            if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue
            await walk(childPath(e.target, dirPath, e.name), depth + 1)
          } else if (e.type === 'file') {
            count += 1
            map.set(childPath(e.target, dirPath, e.name), e.version !== undefined ? String(e.version) : 'size:' + (e.size ?? ''))
          }
        }
      }
      await walk(cwd, 0)
      return map
```

</details>

**依据 3 · 源码核查**：[src/host/core.js:167-184](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L167-L184)

失败执行不纳入后快照。

<details>
<summary>查看原文（18行）</summary>

```text
    ctx.on('tools/execute', async (exec, next) => {
      if (!exec || !WATCH_TOOLS[exec.name]) return next()
      const cwd = execCwd(exec)
      const before = await snapshotWorkspace(cwd)
      let outcome
      try {
        outcome = await next()
        return outcome
      } finally {
        if (before && outcome && outcome.isError !== true) {
          try {
            const after = await snapshotWorkspace(cwd)
            if (after) recordSnapshotDiff(before, after, exec)
          } catch (e) {
            console.error('[artifacts] snapshot diff failed', e)
          }
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/host/core.js:270-310](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L270-L310)

命名会话根解析保护及fs.resolve。

<details>
<summary>查看原文（41行）</summary>

```text
    const resolveCwd = async (sessionId) => {
      const live = sessionCwd(sessionId)
      if (live) return live
      if (typeof sessionId === 'string' && sessionId) {
        try {
          const query = ctx.get('sessionQuery')
          if (query && typeof query.listSessions === 'function') {
            const records = await query.listSessions()
            if (records) {
              for (const rec of records) {
                const h = rec && rec.header
                if (h && h.id === sessionId && typeof h.cwd === 'string' && h.cwd) return h.cwd
              }
            }
          }
        } catch (e) {}
        return undefined // named but unresolvable — never substitute another workspace
      }
      const def = await defaultSessionCwd()
      if (def) return def
      if (typeof lastCwd === 'string' && lastCwd) return lastCwd
      try {
        const policy = ctx.get('sandboxPolicy')
        return policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : undefined
      } catch (e) {}
      return undefined
    }

    // List one directory level for the file-tree (文件树) view: directories
    // first, then files, case-insensitive name order.
    const listDir = async (path, sessionId) => {
      const fs = ctx.get('fs')
      if (!fs) return { ok: false, error: 'filesystem unavailable' }
      try {
        const cwd = await resolveCwd(sessionId)
        let p = path
        if (typeof p !== 'string' || !p) {
          if (!cwd) return { ok: false, error: 'workspace unavailable' }
          p = cwd
        }
        const target = await fs.resolve(p, cwd ? { cwd: cwd } : undefined)
```

</details>

**依据 5 · 源码核查**：[src/host.js:231-243](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L231-L243)

读取使用全局cwd，读后才截文本。

<details>
<summary>查看原文（13行）</summary>

```text
    const readFile = async (path) => {
      const fs = ctx.get('fs')
      if (!fs) return { ok: false, error: 'filesystem unavailable' }
      if (typeof path !== 'string' || !path) return { ok: false, error: 'missing path' }
      try {
        const policy = ctx.get('sandboxPolicy')
        const cwd = policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : undefined
        const target = await fs.resolve(path, cwd ? { cwd: cwd } : undefined)
        const info = await fs.stat(target)
        if (!info || info.type !== 'file') return { ok: false, error: 'not a readable file' }
        const text = await fs.readText(target)
        const cap = 200000
        return { ok: true, type: extType(path), content: text.slice(0, cap), truncated: text.length > cap, size: info.size }
```

</details>

**依据 6 · 源码核查**：[src/host/routes.js:17-32](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/routes.js#L17-L32)

content请求只传path。

<details>
<summary>查看原文（16行）</summary>

```text
      ctx.effect(() => webServer.register({
        kind: 'exact',
        path: '/popout-sidebar/content',
        handler: async (req, res) => {
          const qs = (req.url || '').split('?')[1] || ''
          let path = ''
          const parts = qs.split('&')
          for (let i = 0; i < parts.length; i += 1) {
            const pair = parts[i]
            const eq = pair.indexOf('=')
            const k = decodeURIComponent(eq < 0 ? pair : pair.slice(0, eq))
            if (k === 'path') path = decodeURIComponent(eq < 0 ? '' : pair.slice(eq + 1))
          }
          const out = await readFile(path)
          res.writeHead(200, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' })
          res.end(JSON.stringify(out))
```

</details>

**依据 7 · 源码核查**：[src/host/routes.js:54-68](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/routes.js#L54-L68)

媒体读取25MiB限额。

<details>
<summary>查看原文（15行）</summary>

```text
          try {
            const policy = ctx.get('sandboxPolicy')
            const cwd = policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : undefined
            const target = await fs.resolve(path, cwd ? { cwd: cwd } : undefined)
            const info = await fs.stat(target)
            if (!info || info.type !== 'file') {
              res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' })
              res.end('not found')
              return
            }
            const bytes = await fs.readBytes(target, undefined, 25 * 1024 * 1024)
            const ext = (() => { const m = /\.([^.]+)$/.exec(String(path || '')); return m ? m[1].toLowerCase() : '' })()
            const mime = MIME[ext] || 'application/octet-stream'
            res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store', 'Content-Length': bytes.byteLength })
            res.end(Buffer.from(bytes))
```

</details>

#### 缺口

- 宿主fs/HTTP外层授权和跨会话实际边界未核。
  **影响**：不能保证共享/远程部署隔离或完整产物归因。
  **进一步探讨**：在独立宿主用两个session和只读测试目录核允许/拒绝路径，另造失败shell/并行写者和扫描上限任务比较遗漏。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 预览、依赖与全周期负担是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、工程质量与复用

#### 完整回答

依赖Node>=20、DSH Web客户端/宿主文件和webServer接口；安装后需要重启与浏览器刷新，设置在localStorage，弹出页通过同源HTTP和localStorage同步会话。原生扩展API和生成产物要与宿主匹配；本轮未运行构建，不把模板与生成物同名当构建一致性验收。

HTML在iframe srcDoc中允许脚本但没有allow-same-origin，给了一个隔离基线，不能因此认定所有内容和网络都安全。Markdown先转义HTML文本，再用正则生成img src和a href；没有协议白名单，且图片可向外部URL发请求。实际客户端用dangerouslySetInnerHTML放入渲染结果，因此“文本已escape”不等所有链接/图片已被净化；本轮未点击恶意链接或执行载荷，浏览器/CSP行为未验证。可信自有内容与外部不可信文档应分开评估。

首次是安装/兼容、宽度和会话核对；持续有每次shell前后扫描、前端轮询、读文件/媒体与浏览器渲染，目录大或并发命令会增加I/O。没有时延/内存或用户任务数据，不能说轻量或零成本。失败后可关预览/插件回文件管理器，列表不持久化意味着宿主重启会失去观察记录，但磁盘文件保留；退出应核路由/事件撤下，不把移除条目当删除文件或撤销生成。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:34-51](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/package.json#L34-L51)

Node和Web客户端条件。

<details>
<summary>查看原文（18行）</summary>

```text
  "engines": {
    "node": ">=20"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-runtime",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-theme",
        "@deepseek-ai/dsh-client-ui-conversation"
      ]
    }
  }
}
```

</details>

**依据 2 · 源码核查**：[src/client.js:1042-1064](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/client.js#L1042-L1064)

实际HTML iframe与Markdown插入。

<details>
<summary>查看原文（23行）</summary>

```text
    const renderPreview = (p) => {
      if (p.loading) return React.createElement('div', { className: 'artifacts-hint' }, '加载中…')
      if (p.ok === false) return React.createElement('div', { className: 'artifacts-error' }, p.error || '读取失败')
      const type = p.type || 'text'
      const body = []
      if (type === 'image') {
        body.push(React.createElement('img', {
          key: 'img', className: 'artifacts-img',
          src: '/popout-sidebar/media?path=' + encodeURIComponent(p.path || ''),
          alt: p.path || '',
        }))
      } else if (type === 'html') {
        body.push(React.createElement('iframe', {
          key: 'iframe', className: 'artifacts-iframe',
          sandbox: 'allow-scripts', srcDoc: p.content || '', title: p.path || '',
        }))
      } else if (type === 'pdf') {
        body.push(React.createElement(PdfView, { key: 'pdf', path: p.path || '' }))
      } else if (type === 'markdown') {
        body.push(React.createElement('div', {
          key: 'md', className: 'artifacts-markdown',
          dangerouslySetInnerHTML: { __html: mdToHtml(p.content) },
        }))
```

</details>

**依据 3 · 源码核查**：[src/shared/markdown.js:5-15](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/shared/markdown.js#L5-L15)

转义但URL协议没有筛选。

<details>
<summary>查看原文（11行）</summary>

```text
function mdEscape(s) {
  return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function mdInline(s) {
  s = s.replace(/\x60([^\x60]+)\x60/g, function (m, c) { return '<code>' + c + '</code>'; });
  s = s.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, '<img alt="$1" src="$2">');
  s = s.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');
  s = s.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/\*([^*\n]+)\*/g, '<em>$1</em>');
  return s;
```

</details>

**依据 4 · 源码核查**：[src/client/core.js:85-103](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/client/core.js#L85-L103)

浏览器本地设置。

<details>
<summary>查看原文（19行）</summary>

```text
    // Feature settings, persisted in localStorage so they survive reloads.
    const SETTINGS_KEY = 'dsh-popout-sidebar:settings'
    const DEFAULT_SETTINGS = {
      autoRefresh: true,       // poll the artifact list while the panel is open
      minPanelWidth: 20,       // minimum panel width as % of window width
      showFileTree: true,      // show the 文件树 (file tree) tab in the panel
      defaultOpen: true,       // expand the sidebar by default on load
      previewHeight: 70,       // default preview area height as % of the panel
    }

    function loadSettings() {
      try {
        const raw = localStorage.getItem(SETTINGS_KEY)
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed && typeof parsed === 'object') return Object.assign({}, DEFAULT_SETTINGS, parsed)
        }
      } catch (e) {}
      return Object.assign({}, DEFAULT_SETTINGS)
```

</details>

**依据 5 · 源码核查**：[src/host.js:1258-1274](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L1258-L1274)

弹出页跨标签同步与可见性刷新。

<details>
<summary>查看原文（17行）</summary>

```text
    function watchSession() {
      var sid = currentSessionId();
      if (sid !== _lastTreeSession) {
        _lastTreeSession = sid;
        if (treeRoot !== null) loadTreeRoot();
      }
    }
    window.addEventListener('storage', function (e) {
      if (e.key === SESSION_KEY) watchSession();
    });
    // Background tabs throttle setInterval, so a tab left in the background can
    // show stale artifacts for up to a minute. Refresh immediately whenever the
    // user returns to (or focuses) this tab.
    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) load();
    });
    window.addEventListener('focus', load);
```

</details>

**依据 6 · 源码核查**：[src/host/core.js:162-184](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L162-L184)

每个shell前后额外扫描。

<details>
<summary>查看原文（23行）</summary>

```text
    // Fill the gap the `tools/result` whitelist leaves open: `bash`/`pwsh` write
    // files as a side effect of the shell command, never through a `write`/`edit`
    // result. Snapshot the workspace before and after the body and record the
    // new/changed files. `tools/execute` is the around-dispatch wrapper, so
    // `next()` runs the body — the "before" is taken pre-body, "after" post-body.
    ctx.on('tools/execute', async (exec, next) => {
      if (!exec || !WATCH_TOOLS[exec.name]) return next()
      const cwd = execCwd(exec)
      const before = await snapshotWorkspace(cwd)
      let outcome
      try {
        outcome = await next()
        return outcome
      } finally {
        if (before && outcome && outcome.isError !== true) {
          try {
            const after = await snapshotWorkspace(cwd)
            if (after) recordSnapshotDiff(before, after, exec)
          } catch (e) {
            console.error('[artifacts] snapshot diff failed', e)
          }
        }
      }
```

</details>

#### 缺口

- 没有CSP/不可信链接行为、宿主卸载与大目录性能记录。
  **影响**：不能承诺预览安全或低开销。
  **进一步探讨**：在独立profile以可控内容核链接/网络/iframe边界、扫描耗时和禁用后路由/监听状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 什么范围值得采用，新假设怎么证伪？

**研究主题**：采用判断、新假设与验证

#### 完整回答

当前建议观察共享/不可信内容采用；单用户本地可信产物可用测试副本先核面板找文件是否有价值，但不把它当审计或权限隔离。对外部Markdown/HTML、远程公开宿主或多个工作区，应先确定读路径授权和主动内容规则。若出现错误会话文件、扫描漏产物、非预期网络请求或内容执行，关闭预览并回文件管理器，保全原文件后停用插件。

有依据的新方向是给每个产物显示“观察来源、所属session、扫描是否截断/失败、读取版本”的覆盖收据。当前条目已有sessionId/时间，不能说完全无归属；增量是把全局path合并、扫描上限/失败和前后竞态明确呈现，不再把未见等同没有文件。它不能替代服务器授权或URL净化，那些应先解决。最小对照用两个并发session、失败命令但写出文件、build目录和超过5000文件四组，比较当前列表与覆盖说明的误归因/漏报发现、人工定位时间、额外I/O与界面理解负担。若收据不能改善决策、已有信息等价或让用户更混淆，就否定该方向。未实现未验证，不计现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.js:79-96](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L79-L96)

已有sessionId/全局path合并是基线。

<details>
<summary>查看原文（18行）</summary>

```text
    const snapshot = () => artifacts.slice().sort((a, b) => b.seq - a.seq)

    const recordFile = (path, kind, sessionId, diff) => {
      seq += 1
      const at = Date.now()
      const existing = artifacts.find((a) => a.path === path)
      if (existing) {
        existing.kind = kind
        existing.sessionId = sessionId
        existing.at = at
        existing.seq = seq
        existing.type = extType(path)
        if (diff) existing.diff = diff
      } else {
        const entry = { id: 'a' + seq, path: path, kind: kind, type: extType(path), sessionId: sessionId, at: at, seq: seq }
        if (diff) entry.diff = diff
        artifacts.push(entry)
        if (artifacts.length > 1000) artifacts = artifacts.slice(-1000)
```

</details>

**依据 2 · 源码核查**：[src/host/core.js:76-105](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L76-L105)

扫描失败/截断需要覆盖说明。

<details>
<summary>查看原文（30行）</summary>

```text
    const snapshotWorkspace = async (cwd) => {
      const fs = ctx.get('fs')
      if (!fs || typeof fs.listDir !== 'function' || typeof fs.resolve !== 'function') return null
      if (typeof cwd !== 'string' || !cwd) return null
      const childPath = (target, parent, name) => (typeof fs.processPath === 'function' ? fs.processPath(target) : parent.replace(/\/+$/, '') + '/' + name)
      const map = new Map()
      let count = 0
      const walk = async (dirPath, depth) => {
        if (count >= SNAPSHOT_MAX_FILES || depth > SNAPSHOT_MAX_DEPTH) return
        let entries
        try {
          const target = await fs.resolve(dirPath)
          entries = await fs.listDir(target)
        } catch (e) {
          return // unreadable directory — skip it, never fatal
        }
        if (!entries) return
        for (const e of entries) {
          if (count >= SNAPSHOT_MAX_FILES) return
          if (e.type === 'directory') {
            if (e.name.startsWith('.') || SKIP_DIRS.has(e.name)) continue
            await walk(childPath(e.target, dirPath, e.name), depth + 1)
          } else if (e.type === 'file') {
            count += 1
            map.set(childPath(e.target, dirPath, e.name), e.version !== undefined ? String(e.version) : 'size:' + (e.size ?? ''))
          }
        }
      }
      await walk(cwd, 0)
      return map
```

</details>

**依据 3 · 源码核查**：[src/host/core.js:167-184](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host/core.js#L167-L184)

失败命令可能产生结果但未观察的边界。

<details>
<summary>查看原文（18行）</summary>

```text
    ctx.on('tools/execute', async (exec, next) => {
      if (!exec || !WATCH_TOOLS[exec.name]) return next()
      const cwd = execCwd(exec)
      const before = await snapshotWorkspace(cwd)
      let outcome
      try {
        outcome = await next()
        return outcome
      } finally {
        if (before && outcome && outcome.isError !== true) {
          try {
            const after = await snapshotWorkspace(cwd)
            if (after) recordSnapshotDiff(before, after, exec)
          } catch (e) {
            console.error('[artifacts] snapshot diff failed', e)
          }
        }
      }
```

</details>

**依据 4 · 源码核查**：[src/host.js:231-243](https://github.com/e2mcc/dsh-popout-sidebar/blob/f2c72d6b39df536072c075b1f0c55eff84b12e77/src/host.js#L231-L243)

读取与版本/会话绑定仍需核。

<details>
<summary>查看原文（13行）</summary>

```text
    const readFile = async (path) => {
      const fs = ctx.get('fs')
      if (!fs) return { ok: false, error: 'filesystem unavailable' }
      if (typeof path !== 'string' || !path) return { ok: false, error: 'missing path' }
      try {
        const policy = ctx.get('sandboxPolicy')
        const cwd = policy && typeof policy.workspaceRoot === 'string' ? policy.workspaceRoot : undefined
        const target = await fs.resolve(path, cwd ? { cwd: cwd } : undefined)
        const info = await fs.stat(target)
        if (!info || info.type !== 'file') return { ok: false, error: 'not a readable file' }
        const text = await fs.readText(target)
        const cap = 200000
        return { ok: true, type: extType(path), content: text.slice(0, cap), truncated: text.length > cap, size: info.size }
```

</details>

#### 缺口

- 覆盖收据没有实现或用户对照，服务器与主动内容边界也未验。
  **影响**：不能把新增提示当安全修复或净效率提升。
  **进一步探讨**：先核授权/内容策略，再做覆盖任务对照，计入性能与误导。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
