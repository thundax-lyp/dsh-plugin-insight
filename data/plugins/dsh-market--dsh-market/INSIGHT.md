# DSH Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[43530b1](https://github.com/dsh-market/dsh-market/tree/43530b15f0712ec5b506f584a335698cc9ac54b1)

<!-- BEGIN META -->
[![GitHub ★ 10,030](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C030&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 776,009](https://img.shields.io/static/v1?label=npm+30d&message=776%2C009&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。

> **亮点**：[Q02](#research-q02) 显示它将目录选择和安装后盘面检查连成操作链，相比手工 CLI 补上可加载入口与冲突判断；这是组合与防护机制，未证明全球首创或实测省时。

> **主要限制**：[Q04](#research-q04) 表明取消不等于全事务回滚，且执行中失去 Agent hold 时会请求取消；用户仍需检查剩余状态。只有在恢复负担受控时，集中管理才能兑现价值。

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
  - [Q01 · 谁需要额外市场，原生 Discover 是否已足够？](#detail-section-11)
  - [Q02 · 安装从客户端到后验检查怎样接线？](#detail-section-12)
  - [Q03 · 目录失联、来源及兼容判断如何影响安装？](#detail-section-13)
  - [Q04 · 备份恢复和运行中的 Agent 如何影响文件修改？](#detail-section-14)
  - [Q05 · 安装、持续维护和退出有哪些前提与负担？](#detail-section-15)
  - [Q06 · 相对宿主和 CLI，增量是否足以试用？](#detail-section-16)
  - [Q07 · 独立 profile 的验证计划能否降低恢复负担？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个社区插件的 DSH 用户可集中发现、安装和整理插件；偶发安装者可先使用原生 Discover 与 CLI。

作者说明同一目录也可加入宿主 Discover；本次将其加 CLI 和手工备份作为参照，不把搜索结果本身归为市场独有。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 市场安装 | 选择目录条目并执行安装后检查 | 来源需可达，部分成功及取消需人工核对 |
| Agent 排空 | 支持的宿主中等待活动任务后执行包操作 | 需要 Agent 服务和创建／销毁事件，等待不跨宿主持久执行 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH webServer 与 loader | 启动必需 | 注入路由和加载 | 插件无法按此入口挂载 |
| 目录与包来源可访问 | 查询或安装时需要 | 查找与下载 | 目录查询或安装失败 |
| Agent 服务与事件 | 延迟排空时需要 | 安全等待活动任务 | 不支持时拒绝排空 |
| 宿主 request gate | 非所有宿主提供 | 请求准入 | 旧宿主或 Desktop 不可据此假设受保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户确认实际 profile 并备份 | 确认可恢复副本 |
| 加载 | 宿主注入服务并挂载市场 | 可访问市场；失败检查服务与 profile |
| 安装 | 用户选择目录条目，路由执行并校验 | 至少一项通过检查；部分成功需复核 |
| 验收 | 用户核对启用和宿主启动 | 失败或取消后检查残留并按备份恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 网络与存储用量未知 | 确认宿主和 profile，耗时未知 | 环境和下载条件不同 |
| 持续使用 | 下载和存储成本未知 | 更新、维护备份及检查兼容，耗时未知 | 目录和来源需可达 |
| 失败恢复 | 重试资源未知 | 检查磁盘、manifest 和锁，耗时未知 | 取消可保留部分状态 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 安装后检查 | 固定源码检查 manifest、入口及冲突 | 同宿主成功率和误判率 |
| 多插件维护 | 作者声明分组及统一界面 | 相对 CLI 的任务耗时与合格率 |

> **思考**：[Q04](#research-q04) 表明取消不等于全事务回滚，且执行中失去 Agent hold 时会请求取消；用户仍需检查剩余状态。只有在恢复负担受控时，集中管理才能兑现价值。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 显示它将目录选择和安装后盘面检查连成操作链，相比手工 CLI 补上可加载入口与冲突判断；这是组合与防护机制，未证明全球首创或实测省时。

入口按宿主运行时分支接入，安装后以磁盘差异校验，避免只信进程退出码；这依赖目标宿主和磁盘布局，且移除或回滚也可能失败。[Q02](#research-q02) 与 [Q04](#research-q04) 可定位关键分支。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q04](#research-q04) 表明取消不等于全事务回滚，且执行中失去 Agent hold 时会请求取消；用户仍需检查剩余状态。只有在恢复负担受控时，集中管理才能兑现价值。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q06](#research-q06) 建议维护多个插件且已备份 profile 的用户先在隔离副本试装；发现取消后状态不清或无法恢复时停止并退回宿主 Discover 与 CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已有机制仅按固定源码核查；效果和宿主运行未验证。未来设计为假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/MarketSection.tsx、src/index.ts、src/routes.ts、src/install.ts、src/registry.ts、src/backup.ts、src/drain.ts、src/drain-journal.ts、src/http.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定版本的核心入口、安装、目录、备份和 Agent 排空相关源码；未执行插件、目标测试或宿主验收，抽读不等于全仓审计。
- 下一步：在独立 profile 对照原生 Discover 和 CLI，覆盖安装后冲突、执行中取消、崩溃恢复与卸载，记录可启动性、遗留状态、人工时间及环境版本。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.73.7（[固定提交 43530b1](https://github.com/dsh-market/dsh-market/tree/43530b15f0712ec5b506f584a335698cc9ac54b1)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q07](#research-q07) 提出先在独立 profile 试装并生成迁移计划的未验证假设；若状态无法可靠迁移或恢复负担反增，应放弃。

在独立 profile 对照原生 Discover 和 CLI，覆盖安装后冲突、执行中取消、崩溃恢复与卸载，记录可启动性、遗留状态、人工时间及环境版本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1210 | — | — | 19560 |
| .js | source | 1 | 18489 | 16235 | 3530 | — |
| .mjs | source | 12 | 1644 | 1061 | 484 | — |
| .ts | source | 76 | 39970 | 24508 | 13910 | — |
| .tsx | source | 12 | 12854 | 10001 | 2599 | — |
| .ts | test | 103 | 46776 | 35290 | 8424 | — |
| .tsx | test | 10 | 12630 | 10253 | 1540 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 4 | 244 | 72 | 155 | — |

</details>

**活跃度**

[![Issue 未关闭 54](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=54&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 165](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=165&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 167](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=167&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本中，多插件维护者能否以可控代价发现、安装与恢复插件，相比宿主 Discover 和 CLI 增加了什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要额外市场，原生 Discover 是否已足够？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

固定版本 README.md:12-14 将市场定位为宿主内搜索和安装，同时明确同一目录可添加到 DSH 0.2.1+ 的 Discover，因此目录浏览并非独占贡献。README.md:69-89 描述收藏、分组、更新、备份与诊断，针对反复管理多个插件的用户，合格结果是选定插件可用且 profile 仍可维护，而不仅是包命令返回成功。对于只需搜索和偶尔安装的用户，原生 Discover 和 CLI 可能已足够；这是场景比较而非实测结果。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-14](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/README.md#L12-L14)

作者说明同一目录可进入宿主 Discover。

```text
The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 2 · 作者声明**：[README.md:69-76](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/README.md#L69-L76)

作者描述收藏、分组和主题等场景。

```text
- **Browse & search** the full community catalog (4200+ plugins, growing daily) — category filters, star counts, top/new sorting, bilingual descriptions that follow your UI language
- **Host-aware discovery** — cards show the DSH requirement declared by `engines.dsh` or lockstep `@deepseek-ai/dsh-*` peers; the compatibility filter hides only confirmed mismatches with the running host. GitHub-only entries read the linked package's manifest, including monorepo subdirectories; Release downloads read the selected release tag, including the current tag behind `latest/download`. Undeclared, malformed or unavailable requirements stay unknown and visible. Public manifest facts are cached; compatibility is evaluated against the running host
- **Screenshots** — AppStore-style screenshots, auto-carousel when there's more than one, click to preview full-size: author-curated shots show right on the card (zero extra requests); plugins without curated shots fall back to automatic README extraction once you open the install dialog. Images load from GitHub hosting only
- **Comments** — every card opens the plugin's discussion thread in place. It is the same thread its pages on [dshmarket.com](https://dshmarket.com) and the [catalog](https://awesome-dsh-plugin.com) show, so a plugin has one conversation rather than three. Backed by GitHub Discussions through giscus: it loads when you open it, needs a GitHub account only to post, and the note above it says plainly that opening it contacts giscus.app and GitHub. On local dsh web, reading stays embedded while a dedicated GitHub action opens the exact discussion in a new tab for sign-in and posting, so the cross-site return never carries or depends on the host session
- **Favorites** — bookmark plugins and themes from Discover or the Themes tab; a dedicated Favorites tab lists them with search, sort, and install actions. Bookmarks persist in the profile's market state (`state.json`); entries that leave the catalog can be cleared in one click
- **Groups** — organise installed plugins into named groups (rename, delete, and per-group search); a plugin lives in one group and ungrouped is the default. A group carries its own switch: all-on, all-off, or the mixed state its members are really in, so a working set can be switched as a unit without touching the rest. A group holds at most one theme. The grouping itself is local state in the profile's `state.json`
- **Notes** — write your own one-line description for any installed plugin and it replaces the author's on that row, so a shelf of forty plugins answers "why did I install this" in your words. Stored locally beside groups and favorites, never sent anywhere
- **Themes** — a dedicated tab for community themes and skins: install → active immediately, switch with one click (themes are mutually exclusive, your choice survives restarts), uninstall to revert
```

#### 缺口

- 没有同条件维护案例
  **影响**：重复需求及相对收益仍不确定
  **进一步探讨**：在相同插件组对比宿主 Discover 与市场的安装、更新和恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装从客户端到后验检查怎样接线？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

固定提交的 `src/index.ts:249-250` 显示 apply 依赖 webServer 与 loader；Desktop 分支在 279-321 行配置 pluginManager 运行时。`src/routes.ts:7753-7786` 的安装路径在特定 tarball 校验失败时可切到源码；退出失败时尝试恢复 manifest 和 lockfile。`src/routes.ts:7798-7815` 在包命令成功或特定端口冲突已落盘时调用 validateAddedPlugins；没有可保留项则判失败，集合中部分通过则判成功。`src/install.ts:842-880` 根据安装前后差异检查 manifest、可加载入口及既有 bundle ID 冲突，并移除不合格项。该逻辑比单纯报告进程退出码更严格，但部分成功不代表全部组件都成功，移除也可能失败（同文件 904-924 行）。

`src/client/MarketSection.tsx:4002-4028` 的 doInstall 以插件 URL POST 到安装端点，若状态支持且用户没有选择拒绝策略则请求 drain；`src/routes.ts:7413-7465` 要求 POST、同源，重新读取目录并按 URL 找条目，不存在或来源不支持即拒绝。`src/routes.ts:7617-7648` 对延迟执行要求可确认精确目标且执行前重比，变化则拒绝。特别是 7658-7664 行明确取消操作故意保留部分状态以让用户检查，因此不能将取消等同事务回滚。上述为源码检查，跨宿主实测仍未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MarketSection.tsx:4002-4028](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/client/MarketSection.tsx#L4002-L4028)

客户端提交 URL 与可选排空策略。

<details>
<summary>查看原文（27行）</summary>

```text
  const doInstall = useCallback((plugin: RegistryPlugin, force = false, version?: string, preferReject = false) => {
    setBuildsSkipped(null)
    setConfirming(null)
    setInstallError(null)
    setActivationWarnings([])
    setBusyUrl(plugin.url)
    // One record per attempt. A retry appends rather than reusing the old
    // one, so the card resolves to the newest and its Install button returns.
    const recordId = nextRecordId()
    setRecords(list => enqueue(list, {
      id: recordId, kind: 'install', name: plugin.name, url: plugin.url, state: 'running',
    }))
    sessionStorage.setItem('dshm-pending', JSON.stringify({ url: plugin.url, name: plugin.name }))
    fetch(api('/dsh-market/install'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // `version` when the refusal dialog found a release this host supports:
      // the route pins THAT release instead of resolving the newest one —
      // which is the release that was just refused (#581).
      body: JSON.stringify({
        url: plugin.url,
        ...(force ? { force: true } : {}),
        ...(version !== undefined ? { version } : {}),
        ...(statusRef.current.agentDrain && !preferReject ? { busyPolicy: 'drain' } : {}),
      }),
    })
      .then(res => res.json().then(body => ({ status: res.status, body })))
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7413-7465](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7413-L7465)

服务端检查方法、来源并匹配实时目录。

<details>
<summary>查看原文（53行）</summary>

```text
    registerRoute(captureLegacy('/dsh-market/install', {
      kind: 'exact',
      path: '/dsh-market/install',
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }
        try {
          const body = (await readJsonBody(request)) as {
            url?: unknown
            force?: unknown
            version?: unknown
            busyPolicy?: unknown
          }
          const drainCall = drainCallOf(request)
          if (drainCall === undefined && body.busyPolicy === 'drain') {
            const requestedUrl = typeof body.url === 'string' ? body.url : ''
            await handleDrainRequest(
              response,
              request,
              'install',
              body as Record<string, unknown>,
              requestedUrl === '' ? 'install' : requestedUrl,
              requestedUrl === '' ? undefined : requestedUrl,
            )
            return
          }
          await withMutationLock(response, 'install', async () => {
            const force = body.force === true
            const url = typeof body.url === 'string' ? body.url : ''
            // A release the user picked from the refusal dialog's own search
            // (#581): it was confirmed compatible by /dsh-market/find-compatible,
            // so it is pinned below instead of resolving `latest` again.
            const requestedVersion = typeof body.version === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(body.version)
              ? body.version
              : null
            const registry = await loadRegistry()
            const entry = registry.plugins.find(p => p.url.toLowerCase() === url.toLowerCase())
            if (entry === undefined) {
              logEvent('warn', 'install-rejected', `not in curated registry: ${url.slice(0, 120)}`)
              sendJson(response, 400, { error: 'plugin is not in the curated registry' })
              return
            }
            const plainTarget = installTargetFor(entry)
            if (plainTarget === null) {
              sendJson(response, 400, { error: 'unsupported source url' })
              return
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:7658-7673](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7658-L7673)

快照状态并执行添加，取消保留中间状态。

<details>
<summary>查看原文（16行）</summary>

```text
            // Exact manifest snapshot for failure rollback (#65, #339): the
            // host writes dependencies and dsh.profile.bundles before the
            // build-script check / registry fetches run. Either residue can
            // break every later operation or the next boot. Cancelled runs
            // keep their partial state on purpose (the user sees the diff
            // and decides).
            const manifestBefore = readProfileManifestSnapshot(config.profile, activeProfileDir)
            // The lockfile too (#701): pnpm writes it before it links, so a
            // run that dies in between — a native crash, a kill — leaves a
            // lock that names a package the manifest never got. The update
            // route has always restored both; a fresh install restored only
            // the manifest and left the half for the next pnpm run to trip on.
            const lockfileBefore = captureProfileLockfile()
            const pinned = target === pinnedTarget && pinnedTarget !== plainTarget
            if (!assertDrainMutation(request, response)) return
            let result = await (pinned ? runPluginKeepingReleaseAge : runPlugin)(config.profile, ['add', target])
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:7798-7815](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7798-L7815)

校验新增条目并区分部分成功和无可用项。

<details>
<summary>查看原文（18行）</summary>

```text
            if ((result.exitCode === 0 || portCollisionLanded) && !cancelled) {
              if (!assertDrainMutation(request, response)) return
              const validated = await validateAddedPlugins(runPlugin, config.profile, before, activeProfileDir)
              removedBroken = validated.removedBroken
              conflicts = validated.conflicts
              if (removedBroken.length > 0) {
                logEvent('warn', 'install', `${target}: removed uninstallable pieces (no dsh manifest or missing build artifacts): ${removedBroken.join(', ')}`)
              }
              if (validated.keep.length === 0) {
                ok = false
                notAPlugin = true
                addedNothing = validated.added.length === 0
                logEvent('error', 'install', addedNothing
                  ? `${target}: the plugin command reported success but added nothing to the profile`
                  : `${target}: nothing installable survived validation (added: ${validated.added.join(', ')})`)
              } else {
                // Partial success across a collection still counts as success.
                ok = true
```

</details>

**依据 5 · 源码核查**：[src/install.ts:842-880](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/install.ts#L842-L880)

检查入口、manifest 和冲突。

<details>
<summary>查看原文（39行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
}

/**
```

</details>

#### 缺口

- 未执行实际安装
  **影响**：不同宿主的包执行和恢复表现未知
  **进一步探讨**：在隔离 profile 核对安装和取消后的磁盘、manifest 和启动状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目录失联、来源及兼容判断如何影响安装？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

`src/registry.ts:231-250` 说明设计上每次请求重新验证目录，网络失败不直接返回已有缓存；`src/registry.ts:277-306` 显示依区域依序尝试目录源，npm 源按版本复用已获数据，只有来源确认未变时才返回缓存。此设计用更显式的失败换取避免将旧目录冒充新目录；并不能保证目录本身准确或安全。

`src/registry.ts:315-359` 对 HTTP 304 仅在已持有同源缓存时复用，否则把错误累计并最终抛出；`src/client/MarketSection.tsx:3355-3388` 显示客户端的无缓存请求、错误文本处理。注意客户端维护 cachedRegistry，不能据此推断错误时 UI 必然清空已有显示。`src/routes.ts:7455-7465` 在安装时重新取得目录并按 URL 精确匹配，再由目标解析器取安装目标；目录成员约束不是恶意代码审计。`src/routes.ts:2470-2475` 的兼容筛选只阻止可确认的不匹配，未知声明不会自动被当作不兼容。

#### 证据与依据

**依据 1 · 源码核查**：[src/registry.ts:277-306](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/registry.ts#L277-L306)

依次请求来源并仅在版本确认未变时复用。

<details>
<summary>查看原文（30行）</summary>

```text
  const ownSources = routesFor(region).catalog.length
  const catalogSources = catalogSourcesFor(region)
  for (const [sourceIndex, source] of catalogSources.entries()) {
    const key = sourceKey(source)
    const servedBy = <T>(data: T): T => {
      if (sourceIndex >= ownSources) {
        logEvent('warn', 'registry', `catalog: the ${region} sources did not answer; read the catalog package from ${key} instead (#891)`)
      }
      return data
    }
    // Two attempts each. A catalog fetch crossing a long, lossy path fails
    // transiently often enough that one retry is worth more than the second
    // or two it costs — and with nothing behind this call any more, a
    // transient failure is a market with no plugins in it.
    for (let attempt = 0; attempt < 2; attempt++) {
      attempts += 1
      try {
        // A validator only ever goes back to the source that issued it.
        // Carried across a region switch it could earn a "not modified" from
        // an origin whose body we have never seen.
        const reusable = served?.key === key ? served : null
        if (source.kind === 'npm') {
          const { version, data } = await catalogFromPackage(
            source.registry, source.pkg, reusable?.version ?? undefined,
          )
          // `data === null` means the published version is the one in hand.
          if (data === null && reusable !== null) return servedBy(reusable.data)
          if (data === null) throw new Error('the catalog package reported no change with nothing to reuse')
          const parsed = asRegistry(data)
          served = { key, etag: null, modified: null, version, data: parsed }
```

</details>

**依据 2 · 源码核查**：[src/registry.ts:335-359](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/registry.ts#L335-L359)

HTTP 304 条件复用，来源全部失败则抛错。

<details>
<summary>查看原文（25行）</summary>

```text
        if (res.status === 304) {
          // Only reachable when we sent a validator, so `reusable` is present.
          // Guarded anyway: answering a 304 with nothing to reuse would
          // otherwise surface as a confusing parse error on an empty body.
          if (reusable === null) throw new Error('the catalog answered "not modified" with nothing to revalidate')
          return servedBy(reusable.data)
        }
        if (!res.ok) throw new Error(`HTTP ${String(res.status)}`)
        const data = asRegistry(JSON.parse(new TextDecoder().decode(
          await readBodyWhileProgressing(res, BODY_STALL_TIMEOUT_MS),
        )))
        served = {
          key, etag: res.headers.get('etag'), modified: res.headers.get('last-modified'), version: null, data,
        }
        return servedBy(data)
      } catch (error) {
        last = error
        failures.push({
          source: sourceKey(source),
          reason: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }
  throw new Error(describeFetchFailure(last, Date.now() - started, attempts, failures))
```

</details>

**依据 3 · 源码核查**：[src/client/MarketSection.tsx:3355-3388](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/client/MarketSection.tsx#L3355-L3388)

客户端处理返回值与错误；存在本地缓存变量。

<details>
<summary>查看原文（34行）</summary>

```text
  const loadCatalog = useCallback(() => {
    setLoadError(null)
    return fetch(api('/dsh-market/registry'), { cache: 'no-store' })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          registry?: Registry
          hostVersion?: string | null
          error?: string
        }
        if (res.status === 404) {
          noteMarketGone()
          throw new Error(t('marketGoneTitle'))
        }
        if (!res.ok) throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${String(res.status)}`)
        return body
      })
      .then((body) => {
        if (body.registry === undefined) throw new Error('the catalog response carried no data')
        if (body.registry.updated !== cachedRegistry?.updated) {
          resetScreenshotsCache()
          resetThemePreviewCache()
        }
        cachedRegistry = body.registry
        setData(body.registry)
        const catalogDate = body.registry.updated
        setCatalogUpdated(typeof catalogDate === 'string' && catalogDate.trim() !== '' ? catalogDate : null)
        setHostVersion(typeof body.hostVersion === 'string' ? body.hostVersion : null)
        setLoadError(null)
      })
      // Report WHY. An unreachable catalog used to be answered with a
      // bundled copy, so "cannot reach the registry" and "the catalog is
      // smaller today" looked identical on screen — and the second reading
      // is the one users reached.
      .catch((error: unknown) => { setLoadError(error instanceof Error ? error.message : String(error)) })
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:7452-7465](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7452-L7465)

安装重新加载目录并匹配 URL。

<details>
<summary>查看原文（14行）</summary>

```text
            const requestedVersion = typeof body.version === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(body.version)
              ? body.version
              : null
            const registry = await loadRegistry()
            const entry = registry.plugins.find(p => p.url.toLowerCase() === url.toLowerCase())
            if (entry === undefined) {
              logEvent('warn', 'install-rejected', `not in curated registry: ${url.slice(0, 120)}`)
              sendJson(response, 400, { error: 'plugin is not in the curated registry' })
              return
            }
            const plainTarget = installTargetFor(entry)
            if (plainTarget === null) {
              sendJson(response, 400, { error: 'unsupported source url' })
              return
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:7600-7613](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7600-L7613)

只阻止确认不兼容的声明。

<details>
<summary>查看原文（14行）</summary>

```text
            }
            // Fresh installs ask the host requirement too (#404/#473: the
            // update route refuses a declared-incompatible release before
            // installing; an unguarded fresh install would hit exactly the
            // same "装上才炸" wall. Same derivation and same cache as the
            // update route: only a CONFIRMED mismatch stops an install;
            // undeclared, unreadable, and unknown host versions all pass
            // (absence of a claim is not a verdict). force is the escape
            // hatch for a bundled host that misreports its version.
            const npmName = typeof entry.npm === 'string' && NPM_NAME_RE.test(entry.npm) ? entry.npm : null
            // Judged on the release being installed: passing null here would
            // re-read `latest`'s manifest and refuse the very version the
            // dialog just found for this host — a loop with the user in it.
            if (npmName !== null && await refuseHostIncompatible(npmName, entry.name, requestedVersion, force, response, region, 'install-compat')) return
```

</details>

#### 缺口

- 没有对目录维护流程和插件恶意行为作独立审计
  **影响**：目录收录不能证明代码安全，未知兼容性也不能证明可用
  **进一步探讨**：核查目标插件及宿主版本并按需进行隔离验证。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 备份恢复和运行中的 Agent 如何影响文件修改？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

`src/backup.ts:187-217` 检验目标位于 profile 下、检查父路径和文件类型，逐个将临时文件重命名为目标；异常时按此前内容回滚。它是逐文件替换，不能证明多文件的崩溃原子性，回滚写入本身也可能失败。`src/routes.ts:579-612` 为活动 profile 创建排空协调器，订阅 Agent 创建与销毁并绑定取消包操作。`src/drain.ts:293-307` 要求两个事件均可订阅；327-340 行在变更前重新枚举并尝试持有 Agent，无法读取或仍有运行 Agent 则拒绝。835-840 行若操作中丢失 hold 则调用取消。这是源码中的条件性防护，不证明所有宿主支持，也不能证明取消后文件状态自动恢复。

`src/drain-journal.ts:1-10` 指明延迟变更不跨宿主重启持久执行，日志仅保留终态报告；71-86 行实际只追加终态及有限字段。因此不能将日志视为重启后自动恢复操作。源码中的安全边界仍未获得故障注入验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/backup.ts:187-217](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/backup.ts#L187-L217)

逐文件 rename 和内存中异常回滚。

<details>
<summary>查看原文（31行）</summary>

```text
/** Atomically overwrite backed-up files and return a rollback for install failure. */
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
```

</details>

**依据 2 · 源码核查**：[src/drain.ts:293-307](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/drain.ts#L293-L307)

需要订阅两个 Agent 事件。

<details>
<summary>查看原文（15行）</summary>

```text
  constructor(options: DrainCoordinatorOptions) {
    this.host = options.host
    this.journal = options.journal
    this.bootId = options.bootId
    this.now = options.now ?? Date.now
    this.maxRetained = options.maxRetained ?? MAX_RETAINED
    this.log = options.log ?? (() => {})
    this.abortMutation = options.abortMutation
    // Subscribe before the first inventory snapshot (FR-4). A host without
    // both events cannot close the creation race, so drain stays unsupported.
    const created = this.host.onCreated(agent => this.onAgentCreated(agent))
    const disposed = this.host.onDisposed(agent => this.onAgentDisposed(agent))
    if (created !== null) this.subscriptions.push(created)
    if (disposed !== null) this.subscriptions.push(disposed)
    this.subscribed = created !== null && disposed !== null
```

</details>

**依据 3 · 源码核查**：[src/drain.ts:315-340](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/drain.ts#L315-L340)

变更前重新检查并尝试持有 Agent。

<details>
<summary>查看原文（26行）</summary>

```text
  /**
   * Whether the executor may still change files right now.
   *
   * Called under the mutation lock at the route entrance and again
   * immediately before every package command. The second call is the
   * load-bearing one: the validation between the two can take seconds on the
   * network, during which an Agent can become active, the user can cancel, or
   * the market can unload. It also re-enumerates live Agents and claims any
   * idle one that the creation subscription missed, so an undelivered
   * `agent/created` cannot let a turn start between the last wait and the file
   * change.
   */
  assertCanMutate(): DrainMutationGate {
    if (this.disposeRequested) return { ok: false, reason: 'market-unloaded', ids: [] }
    const active = this.active
    if (active === null || active.settled || active.cancelRequested) {
      return { ok: false, reason: 'cancelled', ids: [] }
    }
    if (this.barrierBroken) return { ok: false, reason: 'barrier-broken', ids: [] }
    const live = this.liveAgents()
    if (live === null) return { ok: false, reason: 'agents-service-unavailable', ids: [] }
    const unheld: string[] = []
    for (const agent of live) {
      if (!this.holds.has(agent.id) && !this.claim(agent)) unheld.push(agent.id)
    }
    if (unheld.length > 0) return { ok: false, reason: 'agent-active', ids: unheld }
```

</details>

**依据 4 · 源码核查**：[src/drain.ts:828-841](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/drain.ts#L828-L841)

运行期间失去持有时请求取消。

<details>
<summary>查看原文（14行）</summary>

```text
  private onHoldLost(hold: Hold): void {
    if (this.holds.get(hold.id) === hold) this.holds.delete(hold.id)
    const active = this.active
    if (active === null || active.settled) {
      this.notifyActivity()
      return
    }
    if (active.state === 'running' || active.state === 'verifying') {
      // The package command is already replacing files. Stop it rather than
      // leaving a turn running against them; the operation reports failure.
      this.barrierBroken = true
      this.abortMutation?.()
      this.log('error', 'drain', 'maintenance hold was lost during the package operation; aborting it')
    }
```

</details>

**依据 5 · 源码核查**：[src/drain-journal.ts:1-10](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/drain-journal.ts#L1-L10)

终态报告不等于跨重启的持久执行。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Terminal-only journal for deferred plugin operations (#411).
 *
 * A deferred mutation is deliberately not durable across a Host restart: the
 * maintenance holds and the package command die with the process. What has to
 * survive is the *report* — "the install you started last time failed" — so a
 * user coming back after a restart is not left guessing. This file stores
 * exactly the bounded terminal facts: id, kind, package name, state, Agent
 * counts and time. No prompts, transcripts, tool input, environment values, or
 * paths.
```

</details>

#### 缺口

- 未开展中断和故障注入
  **影响**：跨文件崩溃状态及取消后副作用不可推定
  **进一步探讨**：在隔离 profile 中分别中断写入、安装和 Agent hold 后核验恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 安装、持续维护和退出有哪些前提与负担？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

README.md:20-46 指定 Desktop 用应用内安装，web 与自定义 profile 使用对应 profile 名称；将命令装到 web 不会自动进入 Desktop profile。package.json:39-58 声明运行依赖、peer 和 web 客户端注入。src/index.ts:249-250 依赖 webServer 和 loader；其 326-343 与 349-381 行分别在官方 Desktop 和普通 host 挂载不同执行方式。首次需确认宿主实际 profile 和包管理环境，持续要处理插件版本、目录可达性与备份，失败需检查 manifest、锁文件和磁盘实际状态。src/http.ts:70-87 在宿主提供 request gate 时采用其拒绝结果，gate 抛错以 403 拒绝；gate 缺失时该函数不拒绝，因此不能将该宿主登录保护外推至旧宿主。权限、网络、存储及备份中凭据增加运维责任；README.md:100-105 的安全说明是作者声明。

`src/routes.ts:2548-2564` 在 `desktopHost` 下不套用该 host gate；源码注释说真实 Desktop 会话行为未测，不能把 web 的 gate 约束外推到 Desktop。`src/http.ts:155-166, 213-246` 显示同源检查允许缺失 Origin（并按条件检查 Host），所以它并非针对非浏览器调用者的身份验证。具体网络暴露和宿主保护尚需针对部署环境核实。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-46](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/README.md#L20-L46)

不同宿主对应不同安装 profile。

<details>
<summary>查看原文（27行）</summary>

````text
## Install

- **Official DSH Desktop:** Open **Settings → Plugins** in the app, search for
  `dshmarket`, and install it through the app's plugin manager. No command line
  is needed.
- **Regular `dsh web`:** Run this command, then restart `dsh web`:

  ```sh
  dsh plugin --profile web add dshmarket
  ```

- **Custom profile:** Replace `web` in that command with your host's actual
  profile name: `dsh plugin --profile <profile> add dshmarket`. Follow your
  host's restart instructions.

- **From the GitHub source (no build):** `add github:dsh-market/dsh-market`
  makes pnpm ask before running the package's build scripts. The prebuilt
  tarball attached to the same release installs without that step:

  ```sh
  dsh plugin --profile <profile> add https://github.com/dsh-market/dsh-market/releases/download/v<version>/dshmarket-<version>.tgz
  ```

On a machine with DSH Desktop, running `dsh plugin --profile web add dshmarket`
may report success but installs the market into `profiles/web`, **not** the
profile used by the Desktop app. It will not appear in Desktop. Install through
the app's **Settings → Plugins** instead; Desktop's profile is managed by the app.
````

</details>

**依据 2 · 源码核查**：[package.json:39-58](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/package.json#L39-L58)

依赖与客户端注入声明。

<details>
<summary>查看原文（20行）</summary>

```text
  "dependencies": {
    "js-yaml": "^4.3.2",
    "undici": "^7.29.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.7 || ^0.1.1-rc.2 || ^0.1.2-alpha.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.1-rc.1",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-theme"
      ],
      "platform": "web"
```

</details>

**依据 3 · 源码核查**：[src/index.ts:249-250](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/index.ts#L249-L250)

服务注入条件。

```text
export function apply(ctx: Context, config?: Config): void {
  ctx.inject(['webServer', 'loader'], (hostCtx: Context) => {
```

**依据 4 · 源码核查**：[src/http.ts:70-87](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/http.ts#L70-L87)

宿主 gate 的存在与异常处理。

<details>
<summary>查看原文（18行）</summary>

```text
export function refuseUnadmitted(request: IncomingMessage, response: ServerResponse): boolean {
  const gate = requestGateSource()
  if (gate === undefined) return false
  let status: number | undefined
  try {
    status = gate(request)
  } catch {
    // A gate that throws has not admitted anything. Failing open here would
    // turn a host bug into the exposure this exists to close.
    status = 403
  }
  if (status === undefined) return false
  sendJson(response, status, {
    error: status === 401
      ? '需要先登录 DSH：请重新打开 dsh web 启动时打印的那个网址。 / DSH login required: reopen the URL dsh web printed at startup.'
      : '这个请求来自不受信任的地址，已拒绝。 / This request came from an untrusted origin and was refused.',
  })
  return true
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:2548-2564](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L2548-L2564)

Desktop 不套用这一宿主 gate。

<details>
<summary>查看原文（17行）</summary>

```text
   * Not on a Desktop host yet. Its page loads from `dsh-app://` through the
   * app's own protocol handler, and whether those requests carry the session
   * the host's gate checks has not been measured on a real Desktop; enforcing
   * it blind could lock the market's own page out of its API. #603's exposure
   * is `dsh web` reached through a proxy or a tunnel, which this covers.
   */
  const enforceHostGate = config.desktopHost !== true
  const registerRoute = (route: Parameters<WebServerService['register']>[0]): (() => void) => {
    if (!enforceHostGate) return host.webServer.register(route)
    const handler = route.handler
    return host.webServer.register({
      ...route,
      handler: (request: IncomingMessage, response: ServerResponse) => {
        if (refuseUnadmitted(request, response)) return
        return handler(request, response)
      },
    })
```

</details>

**依据 6 · 源码核查**：[src/http.ts:213-246](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/http.ts#L213-L246)

同源逻辑允许缺失 Origin 且仍有 Host 检查。

<details>
<summary>查看原文（34行）</summary>

```text
export function sameOrigin(request: IncomingMessage): boolean {
  // The rebinding defence (#678): a page on `evil.com` aimed at 127.0.0.1
  // sends a matching Origin/Host pair, so the equality below cannot see the
  // attack — Host is what it cannot forge.
  //
  // An ABSENT Host is a different statement. Every browser sends Host, so a
  // request without one did not come from a page at all — the same argument
  // the Origin rule above rests on — while a stripping proxy (the Desktop
  // build's, #648) may remove it and must not be refused for it. So the
  // authority is only checked when it is present, and a rebinding page can
  // never reach the branch that skips it.
  const host = request.headers.host
  if (host !== undefined && !loopbackAuthority(host) && !trustedAuthority(host, trustedHostsSource())) return false
  // A browser states when IT considers a request cross-site, and the host's
  // own fence refuses that outright. Cheap, and it covers what the Origin
  // equality cannot: a cross-site request whose Origin happens to match.
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  // Chrome 151+ serializes a loopback Origin WITHOUT its explicit port
  // (#1031): the page at `http://127.0.0.1:3080` now states `Origin:
  // http://127.0.0.1` on its same-origin POSTs, so the strict `host` equality
  // below refuses installs and updates from the newest browsers. Mirror the
  // dsh core rule (`isSameAuthorityOrigin`): the hostname must match, and the
  // omitted port is honoured only on the loopback fence — `loopbackAuthority`
  // above has already decided the Host names loopback, a cross-site page still
  // fails the hostname test, and a rebinding page still cannot get its own
  // name through both. Declared LAN names and proxies keep needing the exact
  // port, as before.
  const origin = request.headers.origin
  // A missing Origin is not a cross-site request: browsers send it on every
  // POST, same-origin included, so its absence means the caller is not a
  // page — and a non-browser client can set any Origin it likes, so
  // refusing the absence bought nothing while breaking the Desktop proxy,
  // which strips it (#648).
  if (origin === undefined) return true
```

</details>

#### 缺口

- 耗时、支出和退出后的副作用均未计量
  **影响**：无法保证收益覆盖维护和恢复成本
  **进一步探讨**：以相同工作负载记录现金资源、人工时间及卸载还原结果。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 相对宿主和 CLI，增量是否足以试用？

**研究主题**：贡献与相对优势、采用判断

#### 完整回答

同一目录可直接供宿主 Discover 使用（README.md:12-14），所以基本查找并非该组件专属。实际增量之一是把目录选择、包操作和安装后磁盘校验串联：src/client/MarketSection.tsx:4002-4028 发起请求，src/routes.ts:7413-7465 检查同源及目录成员，7798-7815 和 src/install.ts:842-880 对新增包进行入口和冲突验证。对重复维护多个插件且能承担 profile 恢复责任的人，该组合提供具体试用价值；对偶发安装者则不能确认额外维护负担值得。取消可保留中间状态（src/routes.ts:7658-7664），目录成员也不证明包安全，不能直接推荐无准备地用于唯一生产 profile。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-14](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/README.md#L12-L14)

作者说明宿主可以直接使用同一索引。

```text
The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 2 · 源码核查**：[src/client/MarketSection.tsx:4002-4028](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/client/MarketSection.tsx#L4002-L4028)

客户端请求安装。

<details>
<summary>查看原文（27行）</summary>

```text
  const doInstall = useCallback((plugin: RegistryPlugin, force = false, version?: string, preferReject = false) => {
    setBuildsSkipped(null)
    setConfirming(null)
    setInstallError(null)
    setActivationWarnings([])
    setBusyUrl(plugin.url)
    // One record per attempt. A retry appends rather than reusing the old
    // one, so the card resolves to the newest and its Install button returns.
    const recordId = nextRecordId()
    setRecords(list => enqueue(list, {
      id: recordId, kind: 'install', name: plugin.name, url: plugin.url, state: 'running',
    }))
    sessionStorage.setItem('dshm-pending', JSON.stringify({ url: plugin.url, name: plugin.name }))
    fetch(api('/dsh-market/install'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // `version` when the refusal dialog found a release this host supports:
      // the route pins THAT release instead of resolving the newest one —
      // which is the release that was just refused (#581).
      body: JSON.stringify({
        url: plugin.url,
        ...(force ? { force: true } : {}),
        ...(version !== undefined ? { version } : {}),
        ...(statusRef.current.agentDrain && !preferReject ? { busyPolicy: 'drain' } : {}),
      }),
    })
      .then(res => res.json().then(body => ({ status: res.status, body })))
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:7798-7815](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7798-L7815)

安装后检查并处理无可用结果。

<details>
<summary>查看原文（18行）</summary>

```text
            if ((result.exitCode === 0 || portCollisionLanded) && !cancelled) {
              if (!assertDrainMutation(request, response)) return
              const validated = await validateAddedPlugins(runPlugin, config.profile, before, activeProfileDir)
              removedBroken = validated.removedBroken
              conflicts = validated.conflicts
              if (removedBroken.length > 0) {
                logEvent('warn', 'install', `${target}: removed uninstallable pieces (no dsh manifest or missing build artifacts): ${removedBroken.join(', ')}`)
              }
              if (validated.keep.length === 0) {
                ok = false
                notAPlugin = true
                addedNothing = validated.added.length === 0
                logEvent('error', 'install', addedNothing
                  ? `${target}: the plugin command reported success but added nothing to the profile`
                  : `${target}: nothing installable survived validation (added: ${validated.added.join(', ')})`)
              } else {
                // Partial success across a collection still counts as success.
                ok = true
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:7658-7664](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/routes.ts#L7658-L7664)

取消保留部分状态。

```text
            // Exact manifest snapshot for failure rollback (#65, #339): the
            // host writes dependencies and dsh.profile.bundles before the
            // build-script check / registry fetches run. Either residue can
            // break every later operation or the next boot. Cancelled runs
            // keep their partial state on purpose (the user sees the diff
            // and decides).
            const manifestBefore = readProfileManifestSnapshot(config.profile, activeProfileDir)
```

#### 缺口

- 没有目标用户同任务对照或真实宿主验收
  **影响**：节时、完成率和持续采用价值未得到证明
  **进一步探讨**：在已备份副本完成一次安装、禁用和恢复并对照原流程。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 独立 profile 的验证计划能否降低恢复负担？

**研究主题**：新假设与验证

#### 完整回答

未验证假设：在独立 profile 中先执行变更、校验加载及用户确认，再向目标 profile 提供可审查迁移计划，有可能减少直接试装导致的人工救援。源自安装后检查（src/install.ts:842-880）和逐文件恢复（src/backup.ts:187-217）的现有边界；该设想并非本次确认已经实现的功能，也不保证隔离 profile 的结果可以迁移。以同一组缺入口、冲突和进程中断故障，对照直接安装和独立 profile 计划，比较结果可启动性、遗留状态、人工恢复时间。如果状态无法可靠迁移、漏掉原环境故障或额外成本超过收益，应放弃该方案。

#### 证据与依据

**依据 1 · 源码核查**：[src/install.ts:842-880](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/install.ts#L842-L880)

新增包检查可作为待验证计划的启发。

<details>
<summary>查看原文（39行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
}

/**
```

</details>

**依据 2 · 源码核查**：[src/backup.ts:187-217](https://github.com/dsh-market/dsh-market/blob/43530b15f0712ec5b506f584a335698cc9ac54b1/src/backup.ts#L187-L217)

既有逐文件替换与回滚的边界。

<details>
<summary>查看原文（31行）</summary>

```text
/** Atomically overwrite backed-up files and return a rollback for install failure. */
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
```

</details>

#### 缺口

- 没有该设计的原型和迁移试验
  **影响**：不能把假设当作已实现能力或收益
  **进一步探讨**：对相同故障集记录可启动性、遗留状态及人工恢复时间。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
