# @99galaxy/dsh-plugin-market

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[2ecee1e](https://github.com/99galaxy/dsh-plugin-market/tree/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b)

<!-- BEGIN META -->
[![npm 30d 1,771](https://img.shields.io/static/v1?label=npm+30d&message=1%2C771&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)
<!-- END META -->

> **功能**：在 DSH 侧栏浏览社区插件目录并安装插件。

> **亮点**：[Q01](#research-q01) 集中发现与版本展示，[Q02](#research-q02) 将选择的规格接到包管理器。

> **主要限制**：[Q03](#research-q03) 格式和跨站检查不证明包安全；忽略脚本重试也不证明宿主加载成功。

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
  - [Q01 · 插件市场相对官方插件管理与手工安装改变什么？](#detail-section-11)
  - [Q02 · 目录与安装请求如何到包管理器？](#detail-section-12)
  - [Q03 · 跨站、重试和安装状态有哪些边界？](#detail-section-13)
  - [Q04 · 依赖、来源和采用退路是什么？](#detail-section-14)
  - [Q05 · 如何帮助用户决定安装后是否可启用？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH 用户需要发现、安装和更新社区插件。

手工查目录、审查仓库并运行宿主管理命令。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录 | 浏览搜索社区条目 | 外部来源不等于安全 |
| 安装 | 调用包管理器 | 修改 profile |
| 更新 | 比对版本与固定规格 | 仍需检查加载 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| 兼容 DSH Web 与 Node | 必需 | 提供市场 | 无法使用 |
| 目录网络或缓存 | 浏览需要 | 搜索版本 | 数据可能过时 |
| 包管理器 | 安装需要 | 修改 profile | 安装失败 |
| 审查过的插件来源 | 采用前重要 | 限制供应链风险 | 不应安装 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 备份并隔离 profile | 核版本与来源 |
| 选择 | 审查仓库、版本与权限 | 来源不明停止 |
| 安装 | 安装一项并查日志 | 忽略脚本时核依赖 |
| 验证 | 核宿主加载与功能 | 状态异常恢复备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 发现 | 网络与存储未知 | 审查来源 | 目录可信度未知 |
| 安装 | 下载与依赖成本未知 | 检查日志 | 可能忽略构建 |
| 恢复 | 备份成本未知 | 回退与复核 | 状态一致性未测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目录 | 多源获取和形状检查 | 项目安全 |
| 安装 | argv 调用包管理器 | 宿主加载成功 |
| 状态 | 成功后刷新 | 所有缓存一致 |

> **思考**：[Q03](#research-q03) 格式和跨站检查不证明包安全；忽略脚本重试也不证明宿主加载成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中发现与版本展示，[Q02](#research-q02) 将选择的规格接到包管理器。

[Q03](#research-q03) 缺 Origin 不被该检查拒绝，忽略脚本重试不证明依赖正常。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 格式和跨站检查不证明包安全；忽略脚本重试也不证明宿主加载成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 备份隔离 profile，先审查固定来源，再安装一项并核宿主加载。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已静态核查目录、安装、输入和重试代表路径；未运行网络或安装。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、market-core.mjs、index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定 README、清单、目录、路由及 helper 代表路径；未运行宿主、网络或包管理器。
- 下一步：[Q05](#research-q05) 先核现有页面，再对照脚本忽略及加载失败。

**分析版本**

- **仓库**：[99galaxy/dsh-plugin-market](https://github.com/99galaxy/dsh-plugin-market)
- **版本号**：1.2.1（[固定提交 2ecee1e](https://github.com/99galaxy/dsh-plugin-market/tree/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b)）
- **版本日期**：2026-10-31（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 假设安装到加载的分层收据可降低错误启用；未验证。

[Q05](#research-q05) 先核现有页面，再对照脚本忽略及加载失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1428 | 1154 | 187 | — |
| .md | source | 4 | 231 | — | — | 2680 |
| .mjs | source | 22 | 3546 | 2802 | 505 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/99galaxy/dsh-plugin-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/99galaxy/dsh-plugin-market/issues?q=is%3Aissue+created%3A2026-10-02T11%3A05%3A20.882Z..2026-11-01T11%3A05%3A20.882Z)

暂未获取：近30天关闭。

统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对目录获取、安装执行与供应链边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件市场相对官方插件管理与手工安装改变什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

README:3-10、14-29 面向想发现和更新 DSH 插件的用户，集中目录、搜索、版本和安装；相对手工查目录并运行命令，入口更集中。目录和插件来源由外部提供，市场不等于插件维护者或安全审计；目录数量与热度不证明可靠性，未测节时或安装成功率。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-10](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/README.md#L3-L10)

作者描述目录与入口。

```text
**从 DeepSeek Harness 的左侧栏打开插件市场，一键安装。**

> A sidebar plugin-market page for DeepSeek Harness: browse the community catalog,
> see what you already have on its own tab, and install with one click.

数据来自 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 维护的
官方目录 `plugins.json` —— 约 **4,400+ 个插件、23 个双语分类**，带 Star 数、下载量、收录日期，
以及每个条目的官方安装命令。
```

**依据 2 · 作者声明**：[README.md:14-29](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/README.md#L14-L29)

作者描述安装和更新。

<details>
<summary>查看原文（16行）</summary>

```text
## 它做什么

左侧栏新增 **「插件市场」** 入口，点击后在主区域打开独立页面。**页面内**有三个标签：

| 标签 | 内容 |
| --- | --- |
| **全部插件** | 完整目录。可按分类筛选、按 Star/下载量/名称/收录时间排序、搜索插件名或简介 |
| **已安装** | 只列出**你已经装过**的插件，标签上直接显示数量 |
| **可更新** | 只列出**装了但目录里有更新版本**的插件，标签上直接显示数量 |

- **一键安装**：点「安装」即执行该条目的官方安装命令，装到当前 profile
- **安装状态**：已安装的条目带绿色徽章；若目录名与你实际装的包名不同，会标出真实包名
- **更新检测**：拿目录里的 `version` 和 profile 里实际装的版本比对，有更新的挂橙色徽章
  「可更新 1.47.0（当前 1.46.1）」，按钮从「重新安装」变成「更新」
- **精确更新**：更新 npm 插件时直接安装目录中的目标版本，不会因为旧的 `^` 范围而误报
  「已是最新」；Git 来源更新则强制重新解析来源
```

</details>

**依据 3 · 源码核查**：[package.json:1-5](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/package.json#L1-L5)

包与功能描述。

```text
{
  "name": "@99galaxy/dsh-plugin-market",
  "version": "1.2.1",
  "type": "module",
  "description": "DSH 插件市场：从左侧栏浏览 awesome-dsh-plugin 目录并一键安装。Browse the awesome-dsh-plugin catalog from the sidebar and install plugins.",
```

#### 缺口

- 未运行市场或用户对照
  **影响**：不能证明目录可信与效率
  **进一步探讨**：隔离 profile 比较手工安装。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录与安装请求如何到包管理器？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

market-core.mjs:73-103 从配置地址及镜像、CDN、npm 依次取目录并检查数据形状；index.js:759-785 的安装路由要求 POST、JSON 和可解析安装命令。safeSpec:398-408 提取单个规格、拒绝前导破折号和 ..；market-core.mjs:327-356 以 argv 调 pnpm add。安装分支对普通安装未见目录成员校验；更新分支 790-799 才查匹配目录及版本。格式和来源判断不等于审查实际包及其依赖。

#### 证据与依据

**依据 1 · 源码核查**：[market-core.mjs:73-103](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L73-L103)

目录多源与形状检查。

<details>
<summary>查看原文（31行）</summary>

```text
async function fetchCatalog() {
  const custom = flags.url === undefined ? '' : String(flags.url).trim()
  const requested = custom !== '' ? custom : CATALOG_URL

  const attempts = [{ name: 'official', url: requested }]
  if (MIRROR !== '') attempts.push({ name: 'mirror', url: MIRROR + requested })
  if (CDN !== '') attempts.push({ name: 'cdn', url: CDN })
  attempts.push({ name: 'npm', url: 'npm:' + NPM_META })

  const tried = []
  for (const attempt of attempts) {
    try {
      let data = null
      let version = ''
      if (attempt.url.slice(0, 4) === 'npm:') {
        const meta = await getJson(attempt.url.slice(4))
        if (!meta.ok) { tried.push(attempt.name + '=' + meta.why); continue }
        const latest = meta.data['dist-tags'] && meta.data['dist-tags'].latest
        if (!latest) { tried.push(attempt.name + '=no-latest'); continue }
        const raw = 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog@' + latest + '/plugins.json'
        const file = await getJson(raw)
        if (!file.ok) { tried.push(attempt.name + '=' + file.why); continue }
        data = file.data
        version = latest
      } else {
        const got = await getJson(attempt.url)
        if (!got.ok) { tried.push(attempt.name + '=' + got.why); continue }
        data = got.data
        version = (data && data.updated) || ''
      }
      if (!data || !Array.isArray(data.plugins)) { tried.push(attempt.name + '=bad-shape'); continue }
```

</details>

**依据 2 · 源码核查**：[index.js:398-408](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L398-L408)

提取单一安装规格。

<details>
<summary>查看原文（11行）</summary>

```text
function safeSpec (install) {
  const m = /^dsh\s+plugin(?:\s+--profile\s+[A-Za-z0-9._-]+)?\s+add\s+([^\s].{0,299})$/.exec(textOf(install).trim())
  if (m === null) return null
  const spec = m[1].trim()
  if (spec === '' || spec.length > 300 || spec.indexOf('..') >= 0) return null
  // The spec is handed to pnpm as ONE argv element, never through a shell — so the
  // injection to refuse here is not shell metacharacters but a leading dash, which
  // pnpm would read as an OPTION (--global, --config.*, -C, --dir …). The catalog is
  // remote data; nothing in it has any business starting with '-'.
  if (spec.slice(0, 1) === '-') return null
  return spec
```

</details>

**依据 3 · 源码核查**：[index.js:759-799](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L759-L799)

路由校验与更新目录匹配。

<details>
<summary>查看原文（41行）</summary>

```text
      disposes.push(host.webServer.register({
        kind: 'exact',
        path: ROUTE_INSTALL,
        handler: async (request, response) => {
          // THE route that most needs this guard: it runs pnpm. See foreignCaller.
          const foreign = foreignCaller(request)
          if (foreign !== '') {
            sendJson(response, 403, { ok: false, message: '已拒绝跨站请求：' + foreign })
            return
          }
          if (request.method !== 'POST') {
            response.writeHead(405, { allow: 'POST' })
            response.end()
            return
          }
          try {
            if (!isJsonRequest(request)) {
              sendJson(response, 415, { ok: false, message: 'Content-Type 必须是 application/json' })
              return
            }
            const raw = await readBody(request)
            let body = {}
            try { body = raw === '' ? {} : JSON.parse(raw) } catch (e) { body = {} }
            const requestedSpec = safeSpec(body.install)
            if (requestedSpec === null) {
              sendJson(response, 400, { ok: false, message: '安装命令无法解析或不安全，已拒绝执行' })
              return
            }
            let spec = requestedSpec
            const update = body.update === true
            let forceUpdate = false
            if (update) {
              const catalog = readCatalog()
              const row = catalog.ok === true
                ? preparedCatalog(catalog.data, catalog.key).rows.find(candidate => candidate.install === body.install)
                : null
              if (row === null || row === undefined || versionParts(row.version) === null) {
                sendJson(response, 400, { ok: false, message: '目录中没有可用于更新的版本信息，请先重新获取目录' })
                return
              }
              spec = pinnedUpdateSpec(requestedSpec, row.version)
```

</details>

**依据 4 · 源码核查**：[market-core.mjs:327-356](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L327-L356)

参数化调用包管理器。

<details>
<summary>查看原文（30行）</summary>

```text
  const baseArgs = ['add', spec, '-w', '--dir', profileDir]
  const updateArgs = forceUpdate ? ['--force'] : []

  function runPnpm (extraArgs) {
    if (!ensureDir()) return { status: 1, error: null, output: '无法创建状态目录' }
    const runDir = join(STATE_DIR, '.runs')
    let ofd = 0
    let efd = 0
    const tag = 'install-' + Date.now() + '-' + process.pid
    const outPath = join(runDir, tag + '.out')
    const errPath = join(runDir, tag + '.err')
    try {
      mkdirSync(runDir, { recursive: true })
      ofd = openSync(outPath, 'w')
      efd = openSync(errPath, 'w')
    } catch (e) {
      if (ofd !== 0) closeSync(ofd)
      if (efd !== 0) closeSync(efd)
      return { status: 1, error: null, output: '无法创建运行目录：' + (e && e.message) }
    }
    let r
    try {

      const commandArgs = manager.npmCli
        ? manager.args.concat(['--package=' + pnpmSpec, '--', 'pnpm'])
        : manager.args
      r = spawnSync(
        manager.command,
        commandArgs.concat(baseArgs).concat(extraArgs || []),
        { cwd: profileDir, stdio: ['ignore', ofd, efd], env: Object.assign({}, env, manager.env) },
```

</details>

#### 缺口

- 未运行包管理或网络
  **影响**：无法证明目标包安全和安装成功
  **进一步探讨**：在隔离 profile 核目标和实际安装。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 跨站、重试和安装状态有哪些边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

index.js:375-395 拒绝明确 cross-site、比较 Origin/Host 并要求 JSON，但缺 Origin 时该检查放行，不能据此宣称身份鉴权或包安全。market-core.mjs:369-377 在 ERR_PNPM_IGNORED_BUILDS 时用 --ignore-scripts 重试，可能安装未构建依赖；index.js:823-827 根据退出状态报告成功并刷新本地安装状态，不能证明插件加载或功能正常。格式校验与脚本限制降低部分风险，供应链、依赖和运行效果仍需核查。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:375-395](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L375-L395)

跨站和 JSON 条件。

<details>
<summary>查看原文（21行）</summary>

```text
function foreignCaller (request) {
  const headers = request.headers === undefined ? {} : request.headers
  if (textOf(headers['sec-fetch-site']) === 'cross-site') return 'Sec-Fetch-Site: cross-site'
  const origin = textOf(headers.origin)
  if (origin === '') return ''
  let host = ''
  try {
    host = new URL(origin).host
  } catch (e) {
    return 'Origin 无法解析：' + origin
  }
  const self = textOf(headers.host)
  if (self !== '' && host !== self) return 'Origin ' + host + ' 与本机 ' + self + ' 不符'
  return ''
}

/** The install route accepts JSON only. A cross-origin page cannot send this
 *  content type without a preflight, and this server answers no preflight. */
function isJsonRequest (request) {
  const headers = request.headers === undefined ? {} : request.headers
  return textOf(headers['content-type']).toLowerCase().indexOf('application/json') === 0
```

</details>

**依据 2 · 源码核查**：[index.js:398-408](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L398-L408)

规格校验边界。

<details>
<summary>查看原文（11行）</summary>

```text
function safeSpec (install) {
  const m = /^dsh\s+plugin(?:\s+--profile\s+[A-Za-z0-9._-]+)?\s+add\s+([^\s].{0,299})$/.exec(textOf(install).trim())
  if (m === null) return null
  const spec = m[1].trim()
  if (spec === '' || spec.length > 300 || spec.indexOf('..') >= 0) return null
  // The spec is handed to pnpm as ONE argv element, never through a shell — so the
  // injection to refuse here is not shell metacharacters but a leading dash, which
  // pnpm would read as an OPTION (--global, --config.*, -C, --dir …). The catalog is
  // remote data; nothing in it has any business starting with '-'.
  if (spec.slice(0, 1) === '-') return null
  return spec
```

</details>

**依据 3 · 源码核查**：[market-core.mjs:369-377](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L369-L377)

忽略脚本重试。

```text
  let result = runPnpm(updateArgs)

  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(updateArgs.concat(['--ignore-scripts']))
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
```

**依据 4 · 源码核查**：[index.js:823-827](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L823-L827)

成功响应及刷新状态。

```text
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                const refreshed = await refreshInstalled(true)
                if (refreshed.ok !== true) invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
```

#### 缺口

- 未做请求安全和安装故障测试
  **影响**：无法保证授权、包安全或实际运行
  **进一步探讨**：审查包并验证完整加载状态。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 依赖、来源和采用退路是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:28-39 声明 DSH、Node 与 Web 入口；目录联网及包管理会修改当前 profile，远端包的代码和依赖需要自行审查。下载量、缓存及目录版本不证明安全，运行资源、维护与恢复时间未知。先在隔离 profile 查看目标仓库、固定版本和权限，再安装一项并核对宿主加载；来源不明、重试忽略脚本或状态不一致时停止继续，按宿主管理流程恢复备份。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:28-39](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/package.json#L28-L39)

宿主和 Node 要求。

<details>
<summary>查看原文（12行）</summary>

```text
  "engines": {
    "dsh": ">=0.1.5-rc.1 <0.3.0",
    "node": ">=22.19"
  },
  "dsh": {
    "manifestVersion": 1,
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[market-core.mjs:73-103](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L73-L103)

目录获取与回退。

<details>
<summary>查看原文（31行）</summary>

```text
async function fetchCatalog() {
  const custom = flags.url === undefined ? '' : String(flags.url).trim()
  const requested = custom !== '' ? custom : CATALOG_URL

  const attempts = [{ name: 'official', url: requested }]
  if (MIRROR !== '') attempts.push({ name: 'mirror', url: MIRROR + requested })
  if (CDN !== '') attempts.push({ name: 'cdn', url: CDN })
  attempts.push({ name: 'npm', url: 'npm:' + NPM_META })

  const tried = []
  for (const attempt of attempts) {
    try {
      let data = null
      let version = ''
      if (attempt.url.slice(0, 4) === 'npm:') {
        const meta = await getJson(attempt.url.slice(4))
        if (!meta.ok) { tried.push(attempt.name + '=' + meta.why); continue }
        const latest = meta.data['dist-tags'] && meta.data['dist-tags'].latest
        if (!latest) { tried.push(attempt.name + '=no-latest'); continue }
        const raw = 'https://cdn.jsdelivr.net/npm/dsh-plugin-catalog@' + latest + '/plugins.json'
        const file = await getJson(raw)
        if (!file.ok) { tried.push(attempt.name + '=' + file.why); continue }
        data = file.data
        version = latest
      } else {
        const got = await getJson(attempt.url)
        if (!got.ok) { tried.push(attempt.name + '=' + got.why); continue }
        data = got.data
        version = (data && data.updated) || ''
      }
      if (!data || !Array.isArray(data.plugins)) { tried.push(attempt.name + '=bad-shape'); continue }
```

</details>

**依据 3 · 源码核查**：[market-core.mjs:369-377](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L369-L377)

忽略构建脚本重试。

```text
  let result = runPnpm(updateArgs)

  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(updateArgs.concat(['--ignore-scripts']))
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
```

**依据 4 · 源码核查**：[index.js:823-827](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L823-L827)

安装响应与状态刷新。

```text
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                const refreshed = await refreshInstalled(true)
                if (refreshed.ok !== true) invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
```

#### 缺口

- 未验证包、安全和宿主
  **影响**：无法保证兼容及恢复成本
  **进一步探讨**：隔离 profile 审查固定目标后试用。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 如何帮助用户决定安装后是否可启用？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

已有安装日志、更新徽章和退出码，增加成功提示并无新增。设想以一次安装为单位展示用户核验过的来源及版本、是否忽略脚本、包管理退出、宿主加载结果和未知项，并明确由用户决定启用或回退；不将安装退出码当加载证明。对照现有日志与徽章，测试脚本被忽略、包解析成功但宿主加载失败、缓存过期和版本改变，测错误启用及恢复时间；若来源无法可靠绑定、未知被显示成功或增加误判则否定。先核现有 UI 是否已有等价逐层摘要。

#### 证据与依据

**依据 1 · 源码核查**：[market-core.mjs:369-377](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/market-core.mjs#L369-L377)

已有脚本忽略和重试日志。

```text
  let result = runPnpm(updateArgs)

  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(updateArgs.concat(['--ignore-scripts']))
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
```

**依据 2 · 源码核查**：[index.js:823-827](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/index.js#L823-L827)

已有退出状态及刷新。

```text
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                const refreshed = await refreshInstalled(true)
                if (refreshed.ok !== true) invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
```

**依据 3 · 作者声明**：[README.md:24-33](https://github.com/99galaxy/dsh-plugin-market/blob/2ecee1e3b32e83c2fcfba4bfcf873135ee8c961b/README.md#L24-L33)

作者描述已有版本和重载提示。

<details>
<summary>查看原文（10行）</summary>

```text
- **一键安装**：点「安装」即执行该条目的官方安装命令，装到当前 profile
- **安装状态**：已安装的条目带绿色徽章；若目录名与你实际装的包名不同，会标出真实包名
- **更新检测**：拿目录里的 `version` 和 profile 里实际装的版本比对，有更新的挂橙色徽章
  「可更新 1.47.0（当前 1.46.1）」，按钮从「重新安装」变成「更新」
- **精确更新**：更新 npm 插件时直接安装目录中的目标版本，不会因为旧的 `^` 范围而误报
  「已是最新」；Git 来源更新则强制重新解析来源
- **中英切换**：简介可切中文/英文
- **本地缓存**：目录存到本地，**1 小时内直接复用**；过期时先显示本地内容并在后台更新，
  不再用下载阻塞首屏；要立即等待最新版可点「强制重新获取」
- **一键重载 profile**：装完插件点「重载 profile」，通过 DSH 的 HMR 重新组合当前 profile，不必重启；没有 HMR 的 profile 会提示你重启
```

</details>

#### 缺口

- 未穷尽 UI 和无原型
  **影响**：无法确认新增性及收益
  **进一步探讨**：先核现有显示再对照故障样例。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
