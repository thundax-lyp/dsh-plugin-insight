# DSH 插件市场

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[52d44fb](https://github.com/99galaxy/dsh-plugin-market/tree/52d44fba2b12453fa1b22a1453f9287fa3b33821)

<!-- BEGIN META -->
[![npm 30d 1,557](https://img.shields.io/static/v1?label=npm+30d&message=1%2C557&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)
<!-- END META -->

> **功能**：从 DSH 侧栏浏览社区目录，查看已安装和可更新插件，并执行安装与 profile 重载。

> **亮点**：将浏览目录、核对已装版本和执行安装集中到同一宿主页面；目录内容和包管理由上游提供，贡献是profile感知的接线与状态整理，而非新包管理技术。[Q01](#research-q01) [Q02](#research-q02)

> **主要限制**：安装退出成功不等于原来源被保留或新插件已加载；目录命令可能把固定Git来源变为npm，恢复也未形成完整事务。[Q03](#research-q03) [Q04](#research-q04)

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
  - [Q01 · 对哪个用户任务，相比复制目录安装命令增加了什么？](#detail-section-11)
  - [Q02 · 目录、当前profile和安装状态如何串成实际调用链？](#detail-section-12)
  - [Q03 · 同源拦截和安全参数是否足以保证更新符合用户意图？](#detail-section-13)
  - [Q04 · 首次、日常和失败恢复需要由谁承担什么成本？](#detail-section-14)
  - [Q05 · 哪些设计可借鉴，哪些不能当可靠性保证？](#detail-section-15)
  - [Q06 · 如何验证带来源审阅与结果核对的安装事务是否更有用？](#detail-section-16)
  - [Q07 · 当前值得谁在什么范围试用，何时退出？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供已有 DSH profile 的个人用户集中发现、安装及管理扩展；固定来源或少量偶发安装仍可保留手工命令。[Q01](#research-q01)

基线是读社区目录、查看profile依赖并手工执行固定包命令；无需为偶发安装引入市场。没有开展同条件耗时对照。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 市场页 | 搜索分类与已装状态 | 依赖目录和profile映射 |
| 安装 | 调用包管理器并补bundle | 可写profile；不保证加载 |
| 重载 | 调用宿主HMR | 缺失或pending时需重启 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH及Node声明范围 | 启动必需 | 加载bundle和client | 兼容未知需核对 |
| webServer与slots | 启动必需 | 路由与市场页 | 无页面或接口 |
| 可写profile及包管理器 | 安装必需 | 改依赖和bundles | 停止安装 |
| HMR | 可选 | 重载profile | 重启DSH |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户备份profile并加市场bundle | profile目标明确 |
| 选择 | 用户搜索并核对来源 | spec符合预期 |
| 安装 | host调用包管理器 | 失败检查日志与清单 |
| 验收 | 用户重载或重启后检查功能 | 来源、profile、加载一致 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 宿主、包管理器和网络；金额未知 | 配置bundle与核对profile；耗时未知 | 需可写profile |
| 持续使用 | 目录访问和目标包依赖；用量未知 | 审阅来源、确认加载 | 缓存不证明目录可信 |
| 失败恢复 | 重试和备份空间；金额未知 | 对照清单、锁文件及进程；耗时未知 | 没有完整自动回滚 |

以正确来源安装并加载为合格任务，不以按钮成功计数。[Q04](#research-q04)

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 发现与状态对照 | 市场页及已装/更新/未知分类 | 实际节时和目录质量 |
| 安装到当前profile | 宿主环境继承、包管理器调用 | 各发行版兼容和加载效果 |
| 故障恢复 | 日志与旧目录降级 | 部分安装原子恢复 |

> **思考**：安装退出成功不等于原来源被保留或新插件已加载；目录命令可能把固定Git来源变为npm，恢复也未形成完整事务。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将浏览目录、核对已装版本和执行安装集中到同一宿主页面；目录内容和包管理由上游提供，贡献是profile感知的接线与状态整理，而非新包管理技术。[Q01](#research-q01) [Q02](#research-q02)

环境继承、未知状态显式化、HMR事务值得复用；需同时适配宿主API及包管理器。模块级互斥不是跨进程锁，统计中生成helper不能另算原创。[Q05](#research-q05)

<a id="detail-section-5"></a>

### 1.4 主要限制

安装退出成功不等于原来源被保留或新插件已加载；目录命令可能把固定Git来源变为npm，恢复也未形成完整事务。[Q03](#research-q03) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

建议在独立测试profile对一个可信包试用；先备份清单与锁文件，确认目标和来源，安装后核对加载；来源替换或恢复状态不清即停止并退回固定命令。[Q07](#research-q07)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

目录发现与状态对照机制有固定源码支持；安装加载、跨发行版兼容与故障恢复未执行验证。安装事务属于未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、client/client.js、market-core.mjs、tools/market-core.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交只读检查 README、host、helper源与生成物、client、包声明和统计；未执行第三方代码、安装、测试或宿主验收。
- 下一步：未来经授权在可丢弃profile测试单一可信包，记录来源变化、断网后清单与进程状态、加载和退出；不将计划写为通过。[Q06](#research-q06)

**分析版本**

- **仓库**：[99galaxy/dsh-plugin-market](https://github.com/99galaxy/dsh-plugin-market)
- **版本号**：1.2.0（[固定提交 52d44fb](https://github.com/99galaxy/dsh-plugin-market/tree/52d44fba2b12453fa1b22a1453f9287fa3b33821)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是加入来源审阅、依赖快照与安装后加载核对；用来源替换、断网和需重启三类故障检验是否减少误改和恢复负担。[Q06](#research-q06)

未来经授权在可丢弃profile测试单一可信包，记录来源变化、断网后清单与进程状态、加载和退出；不将计划写为通过。[Q06](#research-q06)

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1364 | 1101 | 180 | — |
| .md | source | 3 | 210 | — | — | 2174 |
| .mjs | source | 21 | 3411 | 2670 | 503 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/99galaxy/dsh-plugin-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/99galaxy/dsh-plugin-market/issues?q=is%3Aissue+created%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/99galaxy/dsh-plugin-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T04%3A59%3A15.812Z..2026-10-27T04%3A59%3A15.812Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本中的插件市场能否把目录发现、安装与更新整理成可控流程，哪些安全和恢复条件限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对哪个用户任务，相比复制目录安装命令增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 DSH profile、需要反复寻找和管理扩展的个人用户，是本插件的明确对象。作者把分类搜索、已装列表和可更新列表放在一个市场页面；客户端确实注册 sidebar.panellist 与 main，合格结果应是选定来源安装到正在使用的 profile，并确认扩展加载。与手工浏览目录、查本地依赖和运行包管理器相比，增量是将发现及状态对照集中在宿主页面，而不是新增目录数据或包管理能力。目录维护者提供描述和版本，pnpm 完成依赖安装；不能把这两者计为插件原创。只有偶尔安装且固定 Git 提交的用户，直接查看来源并执行命令可能更透明，市场不必然降低总负担。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-37](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/README.md#L15-L37)

作者列出三标签、安装与更新语义；目录规模属于作者声明。

<details>
<summary>查看原文（23行）</summary>

````text

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
- **中英切换**：简介可切中文/英文
- **本地缓存**：目录存到本地，**1 小时内直接复用**；要最新的点「强制重新获取」
- **一键重载 profile**：装完插件点「重载 profile」，通过 DSH 的 HMR 重新组合当前 profile，不必重启；没有 HMR 的 profile 会提示你重启
- **四级降级**：官方域名 → 镜像 → CDN → npm，任一条通即可

## 安装

这是一个 **DSH bundle**：装进 profile 后**重启 DSH 自动加载**。

```bash
````

</details>

**依据 2 · 源码核查**：[client/client.js:496-508](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/client/client.js#L496-L508)

源码注册一对市场侧栏入口和主页面。

<details>
<summary>查看原文（13行）</summary>

```text
    function apply (ctx) {
      ctx.effect(() => insertCss(), '@99galaxy/dsh-plugin-market: styles')
      // The host selects main views by the matching sidebar entry id / view key.
      ctx.slots.inject('main', () => ctx.slots.register({
        name: 'main',
        key: 'dsh-plugin-market',
      }, MarketView))
      ctx.slots.inject('sidebar.panellist', () => ctx.slots.register({
        name: 'sidebar.panellist',
        id: 'dsh-plugin-market',
        order: 25,
        label: '插件市场',
      }, MarketIcon))
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、当前profile和安装状态如何串成实际调用链？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

浏览器调用本插件 HTTP 路由，host 在 webServer 出现后注册列表、安装及重载接口；列表取得缓存目录，刷新当前 profile 的依赖快照，再按包名或仓库映射形成已装与可更新状态。configureRuntime 从 profileContext 取 profile 名和宿主包管理器，不再可以将目标概括成固定 web。目录缓存一小时、已装快照短期缓存，更新判定依赖目录版本与本地版本可比较。未知版本单列 unknownTotal，不能读作已是最新。依赖 webServer、slots、可写 profile、Node 以及可用包管理器；只有重载要求 HMR，缺失时明确要求重启。源码链完整但没有证明所有桌面发行版均提供兼容的 profileContext。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:53-81](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L53-L81)

从宿主上下文继承 profile 和包管理器。

<details>
<summary>查看原文（29行）</summary>

```text
function configureRuntime (ctx) {
  const profileContext = typeof ctx.get === 'function' ? ctx.get('profileContext') : null
  if (!profileContext || typeof profileContext !== 'object') return
  if (typeof profileContext.name === 'string' && profileContext.name !== '') runtime.profile = profileContext.name
  const manager = profileContext.packageManager
  if (manager && typeof manager === 'object' && typeof manager.command === 'string' && manager.command !== '') {
    runtime.packageManager = {
      command: manager.command,
      args: Array.isArray(manager.args) ? manager.args.slice() : [],
      env: manager.env && typeof manager.env === 'object' ? Object.assign({}, manager.env) : {},
    }
  }
}

const profileName = () => runtime.profile

function helperEnvironment () {
  const env = Object.assign({}, process.env, { DSH_PROFILE: profileName() })
  const manager = runtime.packageManager
  if (manager) {
    env.DSH_PACKAGE_MANAGER_COMMAND = manager.command
    env.DSH_PACKAGE_MANAGER_ARGS = JSON.stringify(manager.args)
    env.DSH_PACKAGE_MANAGER_ENV = JSON.stringify(manager.env)
  } else {
    delete env.DSH_PACKAGE_MANAGER_COMMAND
    delete env.DSH_PACKAGE_MANAGER_ARGS
    delete env.DSH_PACKAGE_MANAGER_ENV
  }
  return env
```

</details>

**依据 2 · 源码核查**：[index.js:628-667](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L628-L667)

状态映射、版本未知与未收录bundle计数。

<details>
<summary>查看原文（40行）</summary>

```text
            // Refresh the inventory so the installed badges are current.
            await refreshInstalled(bypass)
            const snapshot = readInstalled()
            const maps = installedMaps(snapshot)
            const versions = snapshot && snapshot.versions ? snapshot.versions : {}

            const catalog = readCatalog()
            if (catalog.ok !== true) {
              sendJson(response, 500, { ok: false, message: catalog.message })
              return
            }
            const prepared = preparedCatalog(catalog.data, catalog.key)
            const all = prepared.rows

            // 'unknown' is its own answer, not a silent "up to date": a plugin the
            // catalog does not carry a version for cannot be judged either way.
            const verdictOf = (row) => {
              const owner = installedOwner(row, maps)
              if (owner === '') return { owner, state: '' }
              return { owner, state: updateState(textOf(versions[owner]), row.version) }
            }

            let installedTotal = 0
            let updatableTotal = 0
            let unknownTotal = 0
            const claimed = new Set()
            for (const row of all) {
              const v = verdictOf(row)
              if (v.owner === '') continue
              claimed.add(v.owner.toLowerCase())
              installedTotal += 1
              if (v.state === 'update') updatableTotal += 1
              else if (v.state === 'unknown') unknownTotal += 1
            }
            // Unlisted bundles are also unknown. Other profile dependencies are not
            // necessarily plugins, so they must not inflate this count.
            const bundles = snapshot && Array.isArray(snapshot.bundles) ? snapshot.bundles : []
            for (const name of bundles) {
              if (!claimed.has(textOf(name).toLowerCase())) unknownTotal += 1
            }
```

</details>

**依据 3 · 源码核查**：[index.js:812-831](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L812-L831)

HMR专用事务与需重启结果。

<details>
<summary>查看原文（20行）</summary>

```text
            // HMR is the supported way to apply a newly installed bundle without a
            // restart: it reads the same profile patches the launcher booted, replaces
            // changed modules, and reconciles new entries. Headless profiles disable
            // it; there the caller must restart DSH instead.
            const hmr = typeof host.get === 'function' ? host.get('hmr') : null
            if (!hmr || typeof hmr.runExclusive !== 'function' || typeof hmr.reconcileProfile !== 'function') {
              sendJson(response, 503, { ok: false, message: '当前 profile 未启用 HMR，无法一键重载；请重启 DSH。' })
              return
            }
            reloadInProgress = true
            try {
              // reconcileProfile throws unless it runs inside runExclusive: HMR uses
              // that transaction to serialize module replacement with its file watches.
              const result = await hmr.runExclusive(() => hmr.reconcileProfile())
              invalidateInstalled()
              sendJson(response, 200, {
                ok: true,
                warnings: result && Array.isArray(result.warnings) ? result.warnings : [],
                pending: result && Array.isArray(result.pending) ? result.pending : [],
                restartReason: result && result.restartReason ? String(result.restartReason) : '',
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 同源拦截和安全参数是否足以保证更新符合用户意图？

**研究主题**：缺陷与关键质疑

#### 完整回答

不足。安装入口检验同源、JSON、可接受 spec 并以 argv 调用 helper，减少浏览器跨站及 shell 字符串注入风险；安装和重载互斥也避免正常页面内的交叉操作。但这些措施不证明来源可信或更新保持原来来源。作者明确说明更新仍执行目录安装命令，Git 安装可能换为 npm；固定 commit 用户因此应停用更新按钮并保留手工流程。包管理器退出成功后 host 返回成功，并未在同一链中验证新插件真实加载、任务合格或可回滚。安装可能改变 profile 依赖与 bundles，浏览器同源也不是多用户授权证明。最关键质疑是用户把“更新成功”理解为原来源的安全升级，而实现只证明安装过程退出成功。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:719-764](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L719-L764)

路由检查与安装成功只依据helper退出结果。

<details>
<summary>查看原文（46行）</summary>

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
            const spec = safeSpec(body.install)
            if (spec === null) {
              sendJson(response, 400, { ok: false, message: '安装命令无法解析或不安全，已拒绝执行' })
              return
            }
            if (installInProgress) {
              sendJson(response, 409, { ok: false, message: '已有插件正在安装，请等待完成后重试' })
              return
            }
            if (reloadInProgress) {
              sendJson(response, 409, { ok: false, message: '正在重载 profile，完成后再安装插件' })
              return
            }
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', profileName()], 900000)
              const took = Math.round((Date.now() - started) / 1000)
              // `install` prints no result marker, so the exit code is the verdict.
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
```

</details>

**依据 2 · 作者声明**：[README.md:89-101](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/README.md#L89-L101)

作者披露更新来源替换与版本不可判断。

<details>
<summary>查看原文（13行）</summary>

````text
```
┌─ 浏览器半边 ────────────────────────────────────────────────┐
│  window.__ModuleLoader__.load({ id, factory(require) })     │
│  require('react')；槽位服务由 ctx 注入                       │
│  sidebar.panellist → 左侧栏「插件市场」入口                  │
│  main → 独立的「DSH 插件市场」页面                          │
│      页面内三个标签：全部插件 / 已安装 / 可更新              │
│  筛选、排序、分页、更新比对全部在宿主侧完成                  │
└───────────────┬─────────────────────────────────────────────┘
                │ fetch()  ← 不是动态插件的私有 RPC，也不是 ctx.remote
┌───────────────▼─────────────────────────────────────────────┐
│  宿主半边  index.js                                          │
│  ctx.inject(['webServer']) →                                │
````

</details>

**依据 3 · 源码核查**：[tools/market-core.mjs:457-478](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/tools/market-core.mjs#L457-L478)

安装后写入bundle清单，未在该段进行运行验收。

<details>
<summary>查看原文（22行）</summary>

```text
  const after = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bundles = (after.dsh && after.dsh.profile && after.dsh.profile.bundles) || []
  let changed = false
  for (const name of installTargetNames(spec, before, after)) {
    let isBundle = false
    try {
      const m = JSON.parse(readFileSync(join(profileDir, 'node_modules', name, 'package.json'), 'utf8'))
      isBundle = !!(m.dsh && m.dsh.bundle)
    } catch (e) {
      isBundle = false
    }
    if (isBundle && bundles.indexOf(name) < 0) {
      bundles.push(name)
      changed = true
    }
  }
  if (changed) {
    after.dsh = Object.assign({}, after.dsh, {
      profile: Object.assign({}, after.dsh && after.dsh.profile, { bundles }),
    })
    writeFileSync(manifestPath, JSON.stringify(after, null, 2) + '\n')
    console.log('market: updated dsh.profile.bundles')
```

</details>

#### 缺口

- 未核定目标包安装脚本及宿主加载后的副作用。
  **影响**：无法保证市场安装的第三方包安全或功能通过。
  **进一步探讨**：选单一可信包，以来源、修改清单和加载结果共同核对。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、日常和失败恢复需要由谁承担什么成本？

**研究主题**：效果与总成本

#### 完整回答

以一次“装入正确 profile 且加载确认的扩展”为合格任务，不能以安装按钮返回成功计数。首次投入包括加载市场 bundle、核对 profile 与包管理器、审阅目标包；持续使用会访问远端目录并修改本地依赖，需要用户确认来源。helper 将目录抓取失败降级到旧缓存并给出 note，避免把暂时网络失败等同没有目录。安装失败则需要核对 package.json、锁文件与已安装内容；源码展示日志但没有覆盖所有部分完成的原子恢复。host 超时只调用 child.kill，不能据此证明包管理器后代均终止。现金、时间、合格率均未实测，现有材料只支持负担路径而不能计算节时或单位成本。

#### 证据与依据

**依据 1 · 源码核查**：[tools/market-core.mjs:160-193](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/tools/market-core.mjs#L160-L193)

旧缓存降级并提示数据年龄。

<details>
<summary>查看原文（34行）</summary>

```text
async function doCatalog() {
  const force = String(flags.force || '') === '1'
  let cache = loadCache()
  const ageMs = cache ? Date.now() - (cache.fetchedAt || 0) : Infinity
  const isFresh = cache && !force && ageMs < CACHE_MS
  let note = ''
  let source = 'local'
  let tried = []
  let bytes = 0

  if (!isFresh) {
    const got = await fetchCatalog()
    tried = got.tried || []
    if (got.ok) {
      source = got.source
      bytes = got.bytes
      cache = loadCache()
    } else if (cache) {
      // Re-fetch failed but there is still usable data: keep serving it, and say so.
      source = 'local'
      note = '目录重新获取失败，继续使用本地目录（已保存 ' + Math.round(ageMs / 60000) + ' 分钟；' + tried.join(' | ') + '）'
    } else {
      return { ok: false, message: '无法获取插件目录：' + tried.join(' | ') }
    }
  }
  if (!cache) cache = loadCache()
  if (!cache) return { ok: false, message: '目录缓存不可读' }
  try { bytes = statSync(CATALOG_PATH).size } catch (e) { bytes = 0 }
  return {
    ok: true, source, tried, fromCache: !!isFresh, version: cache.version || '',
    updated: cache.updated || '', fetchedAt: cache.fetchedAt || 0,
    ageMs: isFinite(ageMs) ? ageMs : 0, count: (cache.plugins || []).length,
    path: CATALOG_PATH, bytes, note,
  }
```

</details>

**依据 2 · 源码核查**：[index.js:201-215](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L201-L215)

超时终止直接child并清理输出文件。

<details>
<summary>查看原文（15行）</summary>

```text
    let settled = false
    const finish = (value) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      cleanup()
      resolve(value)
    }
    const timer = setTimeout(() => {
      try { child.kill() } catch (e) { /* already gone */ }
      finish({
        ok: false,
        message: '辅助脚本超时（' + Math.round(timeoutMs / 1000) + ' 秒）',
        stderr: readFile(errPath).slice(-2000),
      })
```

</details>

**依据 3 · 源码核查**：[tools/market-core.mjs:428-455](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/tools/market-core.mjs#L428-L455)

仅在忽略构建脚本错误时重试，仍可能要求人工处理构建。

<details>
<summary>查看原文（28行）</summary>

```text
  let result = runPnpm([])

  // strictDepBuilds defaults to true, so pnpm EXITS NON-ZERO when any dependency has
  // an unreviewed build script (ERR_PNPM_IGNORED_BUILDS) — a profile that merely
  // contains such a package (node-pty, say) would then fail EVERY market install.
  //
  // pnpm 12 does not honour --config.strict-dep-builds / npm_config_strict_dep_builds
  // for this, so the fallback is --ignore-scripts. That is only reached when pnpm
  // would otherwise refuse: an install whose builds ARE approved still runs them,
  // because the first attempt succeeds. And it approves nothing — the scripts stay
  // unrun, which is the same posture pnpm already enforces for unapproved packages.
  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(['--ignore-scripts'])
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
    }
  }

  // Surface the full log either way: the host returns it as the job's output.
  if (result.output !== '') console.log(result.output)
  if (result.error) {
    console.error('market: spawn failed: ' + result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status === null ? 1 : result.status)
```

</details>

#### 缺口

- 缺少部分安装、网络中断与后代进程存活的实际状态记录。
  **影响**：恢复耗时和并发修改风险未知。
  **进一步探讨**：在可丢弃profile中中断一次安装，对照进程树、依赖及锁文件。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些设计可借鉴，哪些不能当可靠性保证？

**研究主题**：工程质量与复用

#### 完整回答

值得借鉴的是继承宿主 profile 与包管理器而非重猜环境、把已安装未知状态与最新分开、用 HMR 的 runExclusive/reconcileProfile 完成宿主层重组。它们分别约束目标环境、避免误报最新，并减少与热更新监听的竞争。实现有 host/helper/client 分层，helper生成物和 tools 源码重复纳入统计，代码规模不能当原创规模。副作用链尚缺安装前后清单快照与明确回滚，两个模块级互斥布尔值也只约束当前进程；不能推广为跨进程锁。迁移该设计需要宿主提供 profileContext、webServer 和 HMR接口，并替换平台相关包管理器发现逻辑；复用代价主要是环境适配和故障路径验证。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:53-81](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L53-L81)

环境由宿主注入。

<details>
<summary>查看原文（29行）</summary>

```text
function configureRuntime (ctx) {
  const profileContext = typeof ctx.get === 'function' ? ctx.get('profileContext') : null
  if (!profileContext || typeof profileContext !== 'object') return
  if (typeof profileContext.name === 'string' && profileContext.name !== '') runtime.profile = profileContext.name
  const manager = profileContext.packageManager
  if (manager && typeof manager === 'object' && typeof manager.command === 'string' && manager.command !== '') {
    runtime.packageManager = {
      command: manager.command,
      args: Array.isArray(manager.args) ? manager.args.slice() : [],
      env: manager.env && typeof manager.env === 'object' ? Object.assign({}, manager.env) : {},
    }
  }
}

const profileName = () => runtime.profile

function helperEnvironment () {
  const env = Object.assign({}, process.env, { DSH_PROFILE: profileName() })
  const manager = runtime.packageManager
  if (manager) {
    env.DSH_PACKAGE_MANAGER_COMMAND = manager.command
    env.DSH_PACKAGE_MANAGER_ARGS = JSON.stringify(manager.args)
    env.DSH_PACKAGE_MANAGER_ENV = JSON.stringify(manager.env)
  } else {
    delete env.DSH_PACKAGE_MANAGER_COMMAND
    delete env.DSH_PACKAGE_MANAGER_ARGS
    delete env.DSH_PACKAGE_MANAGER_ENV
  }
  return env
```

</details>

**依据 2 · 源码核查**：[index.js:747-777](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L747-L777)

互斥位于当前模块进程。

<details>
<summary>查看原文（31行）</summary>

```text
            if (installInProgress) {
              sendJson(response, 409, { ok: false, message: '已有插件正在安装，请等待完成后重试' })
              return
            }
            if (reloadInProgress) {
              sendJson(response, 409, { ok: false, message: '正在重载 profile，完成后再安装插件' })
              return
            }
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', profileName()], 900000)
              const took = Math.round((Date.now() - started) / 1000)
              // `install` prints no result marker, so the exit code is the verdict.
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
                return
              }
              const code = typeof result.exitCode === 'number' ? result.exitCode : null
              sendJson(response, 500, {
                ok: false,
                spec,
                seconds: took,
                message: code === null ? (result.message || '安装失败') : ('安装失败：pnpm 退出码 ' + String(code)),
                log: (textOf(result.stderr) + '\n' + textOf(result.stdout)).slice(-4000),
              })
            } finally {
              installInProgress = false
            }
```

</details>

**依据 3 · 源码核查**：[index.js:812-835](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L812-L835)

重载串行化使用宿主API。

<details>
<summary>查看原文（24行）</summary>

```text
            // HMR is the supported way to apply a newly installed bundle without a
            // restart: it reads the same profile patches the launcher booted, replaces
            // changed modules, and reconciles new entries. Headless profiles disable
            // it; there the caller must restart DSH instead.
            const hmr = typeof host.get === 'function' ? host.get('hmr') : null
            if (!hmr || typeof hmr.runExclusive !== 'function' || typeof hmr.reconcileProfile !== 'function') {
              sendJson(response, 503, { ok: false, message: '当前 profile 未启用 HMR，无法一键重载；请重启 DSH。' })
              return
            }
            reloadInProgress = true
            try {
              // reconcileProfile throws unless it runs inside runExclusive: HMR uses
              // that transaction to serialize module replacement with its file watches.
              const result = await hmr.runExclusive(() => hmr.reconcileProfile())
              invalidateInstalled()
              sendJson(response, 200, {
                ok: true,
                warnings: result && Array.isArray(result.warnings) ? result.warnings : [],
                pending: result && Array.isArray(result.pending) ? result.pending : [],
                restartReason: result && result.restartReason ? String(result.restartReason) : '',
              })
            } finally {
              reloadInProgress = false
            }
```

</details>

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 如何验证带来源审阅与结果核对的安装事务是否更有用？

**研究主题**：新假设与验证

#### 完整回答

未验证的设计假设是把安装改为“展示旧来源与新来源、保存依赖快照、执行、核对实际加载”四阶段，尤其在 Git 固定来源被目录 npm 命令覆盖前要求用户明确选择。由 Q03 的来源变化与 Q04 的部分安装状态缺口推导，该设计可能减少误升级及故障后的人工重建，而不是提高目录数量。最小实验选同一个可丢弃 profile，比较现流程与事务原型，分别注入来源替换、网络中断及需重启模块；记录未被识别的来源改变、人工恢复步骤、耗时和最终加载正确性。只有错误改变被提前拦住且恢复更少人工才支持假设；若仍发生无提示替换或快照无法恢复，就否定当前事务实现。尚无真实需求、收益或付费验证，不把它称为已实现功能。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:89-94](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/README.md#L89-L94)

来源转换是作者明确披露的真实条件。

````text
```
┌─ 浏览器半边 ────────────────────────────────────────────────┐
│  window.__ModuleLoader__.load({ id, factory(require) })     │
│  require('react')；槽位服务由 ctx 注入                       │
│  sidebar.panellist → 左侧栏「插件市场」入口                  │
│  main → 独立的「DSH 插件市场」页面                          │
````

**依据 2 · 源码核查**：[index.js:758-764](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L758-L764)

当前成功判定与真实加载之间存在可解释缺口。

```text
              const result = await runHelper(['install', spec, '--profile', profileName()], 900000)
              const took = Math.round((Date.now() - started) / 1000)
              // `install` prints no result marker, so the exit code is the verdict.
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
```

#### 缺口

- 事务审阅能否减少误升级尚无对照结果。
  **影响**：只能作为待验证设计方向。
  **进一步探讨**：按所列三类故障与同一目标包进行对照。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前值得谁在什么范围试用，何时退出？

**研究主题**：采用判断

#### 完整回答

有独立测试 profile、理解目录与包来源区别的 DSH 用户可对一个可信扩展试用市场的发现和状态整理。先备份 profile 清单与锁文件，确认市场识别正确 profile，再装单一包；安装后使用重载结果判断是否还需重启，并到真实功能入口确认加载。相对复制命令，优势是搜索与已装状态集中而非效果已经证明。若来源将从 Git 转 npm、目标profile不符、安装日志不清或重载仍需重启而用户不能安排，应停止并回到固定命令与备份恢复。仅源码检查不能给持续安装结论；采用为有限 trial，成功标准是来源、目标profile和实际加载三者一致，不以Star或安装退出码代替。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:80-101](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/README.md#L80-L101)

操作流程与更新边界。

<details>
<summary>查看原文（22行）</summary>

````text
> 一个用 `github:` 装的插件，如果目录对应的条目是 npm 包名，更新后会变成 npm 包。
> 想留在固定 commit 上就别点更新。
>
> **判断不了的插件**：目录里没有 `version`、或目录根本没收录的插件，无法判断有没有更新。
> 它们不会出现在「可更新」标签里，但标签内会单独说明有多少个 ——
> 免得把「判断不了」误读成「已经是最新」。

## 架构

```
┌─ 浏览器半边 ────────────────────────────────────────────────┐
│  window.__ModuleLoader__.load({ id, factory(require) })     │
│  require('react')；槽位服务由 ctx 注入                       │
│  sidebar.panellist → 左侧栏「插件市场」入口                  │
│  main → 独立的「DSH 插件市场」页面                          │
│      页面内三个标签：全部插件 / 已安装 / 可更新              │
│  筛选、排序、分页、更新比对全部在宿主侧完成                  │
└───────────────┬─────────────────────────────────────────────┘
                │ fetch()  ← 不是动态插件的私有 RPC，也不是 ctx.remote
┌───────────────▼─────────────────────────────────────────────┐
│  宿主半边  index.js                                          │
│  ctx.inject(['webServer']) →                                │
````

</details>

**依据 2 · 源码核查**：[index.js:758-777](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L758-L777)

安装响应及失败日志。

<details>
<summary>查看原文（20行）</summary>

```text
              const result = await runHelper(['install', spec, '--profile', profileName()], 900000)
              const took = Math.round((Date.now() - started) / 1000)
              // `install` prints no result marker, so the exit code is the verdict.
              if (result.ok === true || result.exitCode === 0) {
                // The badge must not stay stale for the TTL after a successful install.
                invalidateInstalled()
                sendJson(response, 200, { ok: true, spec, seconds: took, log: textOf(result.stdout).slice(-4000) })
                return
              }
              const code = typeof result.exitCode === 'number' ? result.exitCode : null
              sendJson(response, 500, {
                ok: false,
                spec,
                seconds: took,
                message: code === null ? (result.message || '安装失败') : ('安装失败：pnpm 退出码 ' + String(code)),
                log: (textOf(result.stderr) + '\n' + textOf(result.stdout)).slice(-4000),
              })
            } finally {
              installInProgress = false
            }
```

</details>

**依据 3 · 源码核查**：[index.js:816-831](https://github.com/99galaxy/dsh-plugin-market/blob/52d44fba2b12453fa1b22a1453f9287fa3b33821/index.js#L816-L831)

重载成功仍可能存在pending或restartReason。

<details>
<summary>查看原文（16行）</summary>

```text
            const hmr = typeof host.get === 'function' ? host.get('hmr') : null
            if (!hmr || typeof hmr.runExclusive !== 'function' || typeof hmr.reconcileProfile !== 'function') {
              sendJson(response, 503, { ok: false, message: '当前 profile 未启用 HMR，无法一键重载；请重启 DSH。' })
              return
            }
            reloadInProgress = true
            try {
              // reconcileProfile throws unless it runs inside runExclusive: HMR uses
              // that transaction to serialize module replacement with its file watches.
              const result = await hmr.runExclusive(() => hmr.reconcileProfile())
              invalidateInstalled()
              sendJson(response, 200, {
                ok: true,
                warnings: result && Array.isArray(result.warnings) ? result.warnings : [],
                pending: result && Array.isArray(result.pending) ? result.pending : [],
                restartReason: result && result.restartReason ? String(result.restartReason) : '',
```

</details>

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
