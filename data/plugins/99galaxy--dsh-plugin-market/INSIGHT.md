# dsh-plugin-market

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

分析版本：[b976645](https://github.com/99galaxy/dsh-plugin-market/tree/b97664510aafd55a74f17e304e271956f1c07659)

<!-- BEGIN META -->
[![npm 30d 1,454](https://img.shields.io/static/v1?label=npm+30d&message=1%2C454&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market) [![最新发布 2026-09-23](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-23&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/@99galaxy/dsh-plugin-market)
<!-- END META -->

> **实现功能**：在 DSH 设置页展示社区目录、已安装与可更新项，并触发插件安装。

> **核心亮点**：把手工查目录、比版本、复制命令整合到一页；上游目录和 pnpm 是依赖，本插件的增量是 UI/host/helper 接线及状态整理。效果取决于 profile 与来源是否符合预期。详见[Q01](#research-q01)。

> **风险与缺陷**：host 把读取和安装目标固定为 web，更新又执行目录命令，可能把固定 Git 来源替换为 npm；目录多源回退未核同一性，pnpm 成功未验证重启加载。详见[Q03](#research-q03)。

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
  - [Q01 · 市场界面为谁完成什么任务，核心增量与合格交付是什么？](#detail-section-11)
  - [Q02 · 目录、已安装清单和安装命令如何流转，哪些状态被缓存？](#detail-section-12)
  - [Q03 · “当前 profile”和“更新”是否保留使用者原有的目标与来源约束？](#detail-section-13)
  - [Q04 · 首次、持续和失败恢复成本分别落在哪里？](#detail-section-14)
  - [Q05 · 哪些工程设计可借鉴，怎样验证更可靠的来源/目标保护？](#detail-section-15)
  - [Q06 · 现在可以怎样使用，哪些动作需要人工审阅？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：供 web profile 用户在设置页浏览和安装插件；合格结果需要明确目标、来源、重启及真实加载。详见[Q01](#research-q01)。

手工查看目录并执行 dsh plugin add/pnpm 可完成安装；本包缩短入口，但并未替代来源审阅、目标确认和加载测试。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 目录浏览 | 分类、搜索、排序社区条目 | 来源可回退，质量未验证 |
| 已装/可更新 | 对照 web profile 和目录版本 | 其他 profile 不自动跟随，来源可能变更 |
| 一键安装 | 解析命令并执行 pnpm | 需审阅 spec、写权限、重启后检加载 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH webServer/settings 与 web profile | 必需 | 宿主路由、设置页与目标 | 无入口或安装目标不符 |
| Node/npm CLI/pnpm 和写权限 | 安装必需 | 执行 pnpm 并写 profile | 失败且需查日志 |
| 目录源与网络或旧缓存 | 浏览需要其一 | 获取插件清单 | 新数据不可用或继续旧目录 |
| 重启与人工验证 | 合格使用需要 | 确认插件实际加载 | 退出码不足以证明成功 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 管理者确认 web profile 与 bundle 配置 | 重启后设置入口出现 |
| 浏览 | 用户按分类搜索并看来源/版本 | 知道目录可能来自缓存或回退 |
| 审阅 | 用户核旧 spec、目录 install、目标 | 固定来源不被意外更新 |
| 安装验收 | helper 执行，用户重启检插件 | 实际加载和功能通过；否则回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH/Node/npm/pnpm、可写 web profile 与网络；金额未知 | 配 bundles、重启、确认来源；耗时未知 | 目标固定 web |
| 持续使用 | 目录获取、缓存、依赖安装；资源未知 | 审阅更新和测试加载；频率未知 | 镜像内容同一性未验 |
| 失败恢复 | 旧包/manifest 回滚；金额未知 | 定位安装日志、恢复来源和重启；耗时未知 | 没有跨进程事务或自动加载验收 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 插件发现 | 分类/搜索/排序及缓存链 | 当前目录数量、质量和搜索命中率 |
| 已装/更新显示 | web 清单与目录版本对照 | 非 web profile 正确性及源变更影响 |
| 一键安装 | pnpm helper 与日志返回 | 重启后插件加载、功能与恢复耗时 |

> **思考**：host 把读取和安装目标固定为 web，更新又执行目录命令，可能把固定 Git 来源替换为 npm；目录多源回退未核同一性，pnpm 成功未验证重启加载。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把手工查目录、比版本、复制命令整合到一页；上游目录和 pnpm 是依赖，本插件的增量是 UI/host/helper 接线及状态整理。效果取决于 profile 与来源是否符合预期。详见[Q01](#research-q01)。

把手工查目录、比版本、复制命令整合到一页；上游目录和 pnpm 是依赖，本插件的增量是 UI/host/helper 接线及状态整理。效果取决于 profile 与来源是否符合预期。详见[Q01](#research-q01)。

单 argv、拒选项、同源/JSON 检查及 unknown 版本状态可借鉴；profile 与目录来源仍需端到端固定和验收。详见[Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

host 把读取和安装目标固定为 web，更新又执行目录命令，可能把固定 Git 来源替换为 npm；目录多源回退未核同一性，pnpm 成功未验证重启加载。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察；web profile 中可浏览目录，但点击安装/更新前须核来源、版本、目标，完成后重启检加载。详见[Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码证实目录、列表和安装接线；当前 profile 声称与 web 硬编码不符，更新可改变来源，安装后的加载未验证；改进假设未实现。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、index.js、market-core.mjs、client/client.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读检查固定提交 README、包声明、host/helper/client；未抓当前目录、安装包、执行目标代码/测试或宿主验收；旧 META 仅复用。
- 下一步：隔离 web/custom profile、Git 固定来源转 npm、不同镜像内容、脚本跳过和安装后加载失败；测目标正确率、误更新、加载成功、回滚及人工成本。

**分析版本**

- **仓库**：[99galaxy/dsh-plugin-market](https://github.com/99galaxy/dsh-plugin-market)
- **版本号**：1.1.1（[固定提交 b976645](https://github.com/99galaxy/dsh-plugin-market/tree/b97664510aafd55a74f17e304e271956f1c07659)）
- **版本日期**：2026-09-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是从宿主明确取得目标 profile，安装前审阅旧/新 spec、来源与摘要，跨源目录校验同一性并在重启后确认加载；用错 profile 和来源漂移夹具评估。详见[Q05](#research-q05)。

隔离 web/custom profile、Git 固定来源转 npm、不同镜像内容、脚本跳过和安装后加载失败；测目标正确率、误更新、加载成功、回滚及人工成本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 1180 | 932 | 174 | — |
| .mjs | source | 19 | 2881 | 2201 | 469 | — |
| .md | source | 1 | 157 | — | — | 1459 |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/99galaxy/dsh-plugin-market/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：dsh-plugin-market 是否能让用户可靠地从社区目录选择、安装和更新插件，尤其在 profile 与来源版本约束上？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场界面为谁完成什么任务，核心增量与合格交付是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户在 DSH 设置里搜索社区目录、查看 web profile 的已安装/可更新项，点击后由宿主执行安装。合格交付不止按钮成功，还要明确目标 profile、来源和版本，重启后插件真实加载。相较手工查目录并复制 dsh plugin add 或 pnpm 命令，增量是把目录、profile 清单、版本对照与安装 UI 接成一条流程；目录数据和包管理能力属于上游。作者写“当前 profile”，但源码将 PROFILE 固定为 web，故只对 web profile 有相应语义。目录约 3500 项与分类数是作者当时宣称，本轮未在线抓取，不能当当前规模或质量证据。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-30](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/README.md#L3-L30)

作者描述三标签、目录规模、一键安装与当前 profile 说法。

<details>
<summary>查看原文（28行）</summary>

```text
**在 DeepSeek Harness 的设置面板里逛插件市场，一键安装。**

> A plugin-market settings page for DeepSeek Harness: browse the community catalog,
> see what you already have on its own tab, and install with one click.

数据来自 [awesome-dsh-plugin](https://github.com/awesome-dsh-plugin/awesome-dsh-plugin) 维护的
官方目录 `plugins.json` —— 约 **3,500+ 个插件、23 个双语分类**，带 Star 数、下载量、收录日期，
以及每个条目的官方安装命令。

---

## 它做什么

设置面板里新增一节 **「DSH 插件市场」**，**页面内**有三个标签：

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
- **四级降级**：官方域名 → 镜像 → CDN → npm，任一条通即可
```

</details>

**依据 2 · 源码核查**：[index.js:25-27](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L25-L27)

PROFILE 固定为 web。

```text
const PROFILE = 'web'
const ROUTE_LIST = '/dsh-plugin-market/list'
const ROUTE_INSTALL = '/dsh-plugin-market/install'
```

**依据 3 · 源码核查**：[client/client.js:375-402](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/client/client.js#L375-L402)

UI 卡片显示安装与更新状态、按钮触发安装。

<details>
<summary>查看原文（28行）</summary>

```text
        if (it.installed) tags.push(el('span', { key: 'in', className: 'dsxpm-chip dsxpm-installed' }, ['已安装' + (it.installedAs && it.installedAs !== spec ? '：' + String(it.installedAs) : '')]))
        tags.push(el('span', { key: 'cat', className: 'dsxpm-chip dsxpm-cat' }, [String(catLabels[it.category] || it.category || '未分类')]))
        if (it.stars) tags.push(el('span', { key: 'st', className: 'dsxpm-chip' }, ['★ ' + fmt(it.stars)]))
        if (it.downloads) tags.push(el('span', { key: 'dl', className: 'dsxpm-chip' }, ['↓ ' + fmt(it.downloads)]))
        // One version chip, not two: when there is an update it carries both sides.
        if (it.update) {
          tags.push(el('span', { key: 'v', className: 'dsxpm-chip dsxpm-update' }, [
            '可更新 ' + String(it.version) + (it.installedVersion ? '（当前 ' + String(it.installedVersion) + '）' : ''),
          ]))
        } else if (it.version) {
          tags.push(el('span', { key: 'v', className: 'dsxpm-chip' }, ['v' + String(it.version)]))
        }
        if (it.added) tags.push(el('span', { key: 'ad', className: 'dsxpm-chip' }, ['收录 ' + String(it.added)]))
        tags.push(el('a', { key: 'lk', className: 'dsxpm-link', href: String(it.page || it.url || LIST_URL), target: '_blank', rel: 'noreferrer' }, [it.page ? '详情页 ↗' : 'GitHub ↗']))
        const desc = zh ? (it.zh || it.en || '（无简介）') : (it.en || it.zh || '(no description)')
        return el('div', { key: spec + '#' + String(idx), className: 'dsxpm-card' + (it.installed ? ' dsxpm-card-on' : '') }, [
          el('div', { className: 'dsxpm-info' }, [
            el('div', { className: 'dsxpm-name' }, [spec]),
            el('div', { className: 'dsxpm-desc' }, [String(desc)]),
            el('div', { className: 'dsxpm-tags' }, tags),
          ]),
          el('button', {
            className: 'dsxpm-btn' + (it.installed && !it.update ? '' : ' dsxpm-btn-on'),
            disabled: busy !== '',
            onClick: function () { install(it) },
          }, [isBusy
            ? (it.update ? '更新中…' : '安装中…')
            : (it.update ? '更新' : it.installed ? '重新安装' : '安装')]),
```

</details>

#### 缺口

- 未在宿主验证 web 与其他 profile 的展示/写入效果
  **影响**：不能声称适配任意当前 profile
  **进一步探讨**：隔离两个 profile，分别观察清单、安装目标和重启加载

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录、已安装清单和安装命令如何流转，哪些状态被缓存？

**研究主题**：功能与机制

#### 完整回答

host GET /list 从本地目录缓存或 helper 拉目录，helper 依序访问官方域、镜像、CDN、npm 元数据指定的 CDN；只检查顶层 plugins 数组，然后瘦身并写本地 catalog.json。一小时缓存命中跳过 helper；刷新失败仍可能回退旧缓存并用 note 提示。清单由 helper 读取 web profile，host 将目录条目与安装版本比较、分类/搜索/排序/分页后给 UI。POST /install 验 JSON、解析 dsh plugin add 形式为单一 spec，拒绝前导选项和 ..，串行调用 helper，后者用 npm exec pnpm add 写 web profile 并补 bundle 列表。安装返回以进程退出码为主、使清单缓存失效，不包含重启后加载校验。

#### 证据与依据

**依据 1 · 源码核查**：[market-core.mjs:74-122](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L74-L122)

四级目录来源及仅顶层形状检查、缓存写入。

<details>
<summary>查看原文（49行）</summary>

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
      const payload = {
        version,
        updated: data.updated || '',
        fetchedAt: Date.now(),
        categories: data.categories || {},
        plugins: data.plugins.map(slim),
      }
      if (!ensureDir()) { tried.push(attempt.name + '=no-state-dir'); continue }
      writeFileSync(CATALOG_PATH, JSON.stringify(payload))
      return {
        ok: true, source: attempt.name, tried, version, updated: payload.updated,
        count: payload.plugins.length, path: CATALOG_PATH, bytes: statSync(CATALOG_PATH).size,
      }
    } catch (e) {
      tried.push(attempt.name + '=' + (e && e.message ? e.message : 'error'))
    }
  }
  return { ok: false, tried }
```

</details>

**依据 2 · 源码核查**：[market-core.mjs:136-169](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L136-L169)

一小时缓存与失败旧缓存回退。

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

**依据 3 · 源码核查**：[index.js:543-670](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L543-L670)

GET 列表刷新清单、比较版本并过滤。

<details>
<summary>查看原文（128行）</summary>

```text
      disposes.push(host.webServer.register({
        kind: 'exact',
        path: ROUTE_LIST,
        handler: async (request, response) => {
          const foreign = foreignCaller(request)
          if (foreign !== '') {
            sendJson(response, 403, { ok: false, message: '已拒绝跨站请求：' + foreign })
            return
          }
          if (request.method !== 'GET') {
            response.writeHead(405, { allow: 'GET' })
            response.end()
            return
          }
          try {
            const url = new URL(request.url, 'http://127.0.0.1')
            const bypass = url.searchParams.get('bypass') === '1'
            const category = textOf(url.searchParams.get('category')).trim()
            const q = textOf(url.searchParams.get('q')).trim().toLowerCase()
            const sort = safeSort(url.searchParams.get('sort'))
            const only = safeOnly(url.searchParams.get('only'))
            const limit = safeInt(url.searchParams.get('limit'), 100, 1, 5000)
            const offset = safeInt(url.searchParams.get('offset'), 0, 0, 1000000)

            // A fresh cache is exactly what the helper would have decided; spawning it
            // (~150 ms on Windows) only to be told so is pure cost. There is no
            // `sourceUrl` parameter: the UI never sent one, and taking a URL to fetch
            // from a query string is an open door on a route that has no session.
            const cached = readCatalog()
            let summary
            if (!bypass && cached.ok === true && Date.now() - numOf(cached.data.fetchedAt) < CATALOG_CACHE_MS) {
              summary = cachedSummary(cached.data)
            } else {
              summary = await runHelper(bypass ? ['catalog', '--force', '1'] : ['catalog'], 300000)
              if (summary.ok !== true) {
                sendJson(response, 502, {
                  ok: false,
                  message: summary.message || '无法获取插件目录',
                  detail: (summary.tried || []).join(' | ') || summary.stderr || '',
                })
                return
              }
            }

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

            let rows = all
            if (category !== '') rows = rows.filter((r) => r.category === category)
            if (only === 'installed') rows = rows.filter((r) => installedOwner(r, maps) !== '')
            if (only === 'notinstalled') rows = rows.filter((r) => installedOwner(r, maps) === '')
            if (only === 'updatable') rows = rows.filter((r) => verdictOf(r).state === 'update')
            if (q !== '') {
              rows = rows.filter((r) =>
                r.name.toLowerCase().indexOf(q) >= 0 ||
                r.zh.toLowerCase().indexOf(q) >= 0 ||
                r.en.toLowerCase().indexOf(q) >= 0 ||
                r.owner.toLowerCase().indexOf(q) >= 0)
            }
            const matched = rows.length
            const sorted = rows.slice().sort((a, b) => {
              if (sort === 'downloads') return b.downloads - a.downloads
              if (sort === 'name') return a.name.localeCompare(b.name)
              if (sort === 'added') return b.added.localeCompare(a.added)
              return b.stars - a.stars
            })
            const page = sorted.slice(offset, offset + limit).map((r) => itemOf(r, installedOwner(r, maps), versions))

            sendJson(response, 200, {
              ok: true,
              payload: {
                items: page,
                categories: prepared.categories,
                count: page.length,
                total: numOf(summary.count) || all.length,
                matched,
                installedTotal,
                updatableTotal,
                unknownTotal,
                offset,
                sort,
                only,
                category,
                q,
                catalogFromCache: summary.fromCache === true,
                fetchedAt: numOf(summary.fetchedAt),
                catalogUpdated: textOf(summary.updated),
                source: textOf(summary.source),
                note: textOf(summary.note),
              },
```

</details>

**依据 4 · 源码核查**：[index.js:678-731](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L678-L731)

POST 验证、串行安装及以退出码返回。

<details>
<summary>查看原文（54行）</summary>

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
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', PROFILE], 900000)
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
```

</details>

**依据 5 · 源码核查**：[market-core.mjs:243-361](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L243-L361)

helper 用 pnpm 安装并更新 bundles。

<details>
<summary>查看原文（119行）</summary>

```text
function doInstall() {
  const spec = parsed.rest[1] || ''
  const profile = flags.profile || PROFILE_DEFAULT
  const profileDir = join(HOME, 'profiles', profile)
  if (!existsSync(join(profileDir, 'package.json'))) {
    console.error('market: no profile at ' + profileDir)
    process.exit(2)
  }
  if (spec === '') {
    console.error('market: no spec')
    process.exit(2)
  }
  const npmCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
  if (!existsSync(npmCli)) {
    console.error('market: npm-cli.js not found: ' + npmCli)
    process.exit(3)
  }
  const manifestPath = join(profileDir, 'package.json')
  const before = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const beforeDeps = new Set(Object.keys(before.dependencies || {}))

  const env = Object.assign({}, process.env, {
    npm_config_yes: 'true',
    npm_config_update_notifier: 'false',
    npm_config_fund: 'false',
    npm_config_audit: 'false',

    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'url.https://github.com/.insteadOf',
    GIT_CONFIG_VALUE_0: 'git+ssh://git@github.com/',
  })

  const recorded = modulesYaml(profileDir)
  const major = /pnpm@(\d+)\./.exec(recorded)
  const pnpmSpec = major === null ? 'pnpm' : 'pnpm@' + major[1]

  const baseArgs = ['add', spec, '-w', '--dir', profileDir]

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
      r = spawnSync(
        process.execPath,
        [npmCli, 'exec', '--yes', '--package=' + pnpmSpec, '--', 'pnpm'].concat(baseArgs).concat(extraArgs || []),
        { cwd: profileDir, stdio: ['ignore', ofd, efd], env },
      )
    } finally {
      closeSync(ofd)
      closeSync(efd)
    }
    const read = (p) => { try { return readFileSync(p, 'utf8') } catch (e) { return '' } }
    const output = read(outPath) + read(errPath)
    try { rmSync(outPath, { force: true }) } catch (e) {  }
    try { rmSync(errPath, { force: true }) } catch (e) {  }
    return { status: r.status, error: r.error, output }
  }

  let result = runPnpm([])

  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(['--ignore-scripts'])
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
    }
  }

  if (result.output !== '') console.log(result.output)
  if (result.error) {
    console.error('market: spawn failed: ' + result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status === null ? 1 : result.status)

  const after = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bundles = (after.dsh && after.dsh.profile && after.dsh.profile.bundles) || []
  let changed = false
  for (const name of Object.keys(after.dependencies || {})) {
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
  }
  const added = Object.keys(after.dependencies || {}).filter((n) => !beforeDeps.has(n))
  console.log('market: installed=[' + added.join(', ') + ']')
  console.log('market: bundles=[' + bundles.join(', ') + ']')
  process.exit(0)
```

</details>

#### 缺口

- 目录镜像与安装包未联网抓取，目标代码未执行
  **影响**：不能确认真实数据同一性、安装时间或成功率
  **进一步探讨**：在隔离 profile 固定目录快照并测试安装、重启和加载

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · “当前 profile”和“更新”是否保留使用者原有的目标与来源约束？

**研究主题**：缺陷与关键质疑

#### 完整回答

host 常量 PROFILE=web，同时清单查询与安装都传该常量；即使 UI 位于其他 profile，源码也没有读取当前 profile 的接线。UI 的更新按钮仍 POST 目录给出的 install 字符串，safeSpec 忽略命令中可选的 --profile，最终总以 web 为参数；且更新仅根据目录 version 与已装 version 比较。作者 README 明示 Git 来源安装项可被 npm 目录命令替换，固定 commit 会丢失。目录下载/星标和版本高不能证明包可信或兼容；四级回退只验 JSON 形状，未看到不同源签名/摘要一致性检查。安全上单 argv/拒前导 dash 避免一类命令注入，但不校验远端包内容。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-27](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L25-L27)

固定 web profile。

```text
const PROFILE = 'web'
const ROUTE_LIST = '/dsh-plugin-market/list'
const ROUTE_INSTALL = '/dsh-plugin-market/install'
```

**依据 2 · 源码核查**：[index.js:353-364](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L353-L364)

解析安装串并仅取 spec。

<details>
<summary>查看原文（12行）</summary>

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
}
```

</details>

**依据 3 · 源码核查**：[index.js:491-510](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L491-L510)

清单查询固定传 PROFILE。

<details>
<summary>查看原文（20行）</summary>

```text
    const st = statSync(join(home(), 'profiles', PROFILE, 'package.json'))
    return String(st.size) + ':' + String(st.mtimeMs)
  } catch (e) {
    return 'absent'
  }
}

/**
 * Re-read the profile's inventory, at most once per INSTALLED_TTL_MS — and
 * immediately whenever the manifest changes, so an install is never reported
 * against a snapshot taken before it.
 */
async function refreshInstalled (force) {
  const now = Date.now()
  const key = profileKey()
  if (!force && installedMemo.result !== null && installedMemo.key === key && now - installedMemo.at < INSTALLED_TTL_MS) {
    return installedMemo.result
  }
  const result = await runHelper(['installed', '--profile', PROFILE], 60000)
  installedMemo = { at: Date.now(), key, result }
```

</details>

**依据 4 · 源码核查**：[index.js:678-731](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L678-L731)

安装固定传 PROFILE。

<details>
<summary>查看原文（54行）</summary>

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
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', PROFILE], 900000)
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
```

</details>

**依据 5 · 作者声明**：[README.md:73-81](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/README.md#L73-L81)

作者明确说明更新可能改变来源且未知版本不列可更新。

```text
「已安装」标签里可以确认某个插件是否已经在你的 profile 里；「可更新」标签里是可以升级的那些。

> **关于「更新」**：它执行的仍是**目录里那条安装命令**，所以装的是目录指定的那个来源 ——
> 一个用 `github:` 装的插件，如果目录对应的条目是 npm 包名，更新后会变成 npm 包。
> 想留在固定 commit 上就别点更新。
>
> **判断不了的插件**：目录里没有 `version`、或目录根本没收录的插件，无法判断有没有更新。
> 它们不会出现在「可更新」标签里，但标签内会单独说明有多少个 ——
> 免得把「判断不了」误读成「已经是最新」。
```

**依据 6 · 源码核查**：[market-core.mjs:104-116](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L104-L116)

目录回退仅检查 plugins 数组后存盘。

<details>
<summary>查看原文（13行）</summary>

```text
      if (!data || !Array.isArray(data.plugins)) { tried.push(attempt.name + '=bad-shape'); continue }
      const payload = {
        version,
        updated: data.updated || '',
        fetchedAt: Date.now(),
        categories: data.categories || {},
        plugins: data.plugins.map(slim),
      }
      if (!ensureDir()) { tried.push(attempt.name + '=no-state-dir'); continue }
      writeFileSync(CATALOG_PATH, JSON.stringify(payload))
      return {
        ok: true, source: attempt.name, tried, version, updated: payload.updated,
        count: payload.plugins.length, path: CATALOG_PATH, bytes: statSync(CATALOG_PATH).size,
```

</details>

#### 缺口

- 尚未用不同 profile、固定提交和不一致镜像构造实际复现
  **影响**：不能量化错装/漂移发生率
  **进一步探讨**：隔离运行对照目标 profile、旧新 spec 与镜像摘要

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 首次、持续和失败恢复成本分别落在哪里？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

首次需安装 DSH bundle、修改目标 profile 的 bundles、重启，且宿主需要 webServer/settings 槽位、Node/npm CLI、pnpm 和可写 profile。运行时目录请求涉及官方域/镜像/CDN/npm 以及本地状态目录；每次安装可执行依赖构建脚本，helper 对未批准 build script 报错时改用 --ignore-scripts 重试，可能得到已安装但未构建的包，用户仍需确认功能。持续成本包括目录更新、来源审核、版本误判、重启与安装后测试。失败恢复需查安装日志、恢复旧 spec/profile manifest、移除误装或坏包，耗时和金额未测。host 有 15 分钟安装等待上限与串行锁，可避免同一进程并发安装，但不是跨进程事务或回滚。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:32-71](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/README.md#L32-L71)

安装、bundle 配置与重启步骤。

<details>
<summary>查看原文（40行）</summary>

````text
## 安装

这是一个 **DSH bundle**：装进 profile 后**重启 DSH 自动加载**。

```bash
cd ~/.dsh/profiles/web          # 换成你的 profile 目录
pnpm add github:99galaxy/dsh-plugin-market
```

也可以显式用 HTTPS 地址：

```bash
pnpm add https://github.com/99galaxy/dsh-plugin-market
```

装进来的**包名**是 `@99galaxy/dsh-plugin-market` —— 与仓库名不同，所以下面层列表里要写这个
带 scope 的名字。

然后把它加进 `package.json` 的层列表 —— **声明了 `dsh.bundle` 的依赖才会被加载**：

```json
{
  "dsh": {
    "profile": {
      "bundles": ["...", "@99galaxy/dsh-plugin-market"]
    }
  }
}
```

重启 DSH。

> `github:` 前缀在部分 git 配置下会被解析成 `git+ssh`，而匿名 HTTPS 不需要任何凭据。
> 若 pnpm 报找不到仓库或索要 SSH 密钥，改用上面的 HTTPS 形式。

## 使用

1. 打开设置 → **DSH 插件市场**
2. 浏览或搜索；点卡片右侧「安装」
3. 安装完成后**重启 DSH**，插件才会加载
````

</details>

**依据 2 · 源码核查**：[market-core.mjs:243-279](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L243-L279)

profile、npm CLI 和 pnpm 前提。

<details>
<summary>查看原文（37行）</summary>

```text
function doInstall() {
  const spec = parsed.rest[1] || ''
  const profile = flags.profile || PROFILE_DEFAULT
  const profileDir = join(HOME, 'profiles', profile)
  if (!existsSync(join(profileDir, 'package.json'))) {
    console.error('market: no profile at ' + profileDir)
    process.exit(2)
  }
  if (spec === '') {
    console.error('market: no spec')
    process.exit(2)
  }
  const npmCli = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js')
  if (!existsSync(npmCli)) {
    console.error('market: npm-cli.js not found: ' + npmCli)
    process.exit(3)
  }
  const manifestPath = join(profileDir, 'package.json')
  const before = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const beforeDeps = new Set(Object.keys(before.dependencies || {}))

  const env = Object.assign({}, process.env, {
    npm_config_yes: 'true',
    npm_config_update_notifier: 'false',
    npm_config_fund: 'false',
    npm_config_audit: 'false',

    GIT_CONFIG_COUNT: '1',
    GIT_CONFIG_KEY_0: 'url.https://github.com/.insteadOf',
    GIT_CONFIG_VALUE_0: 'git+ssh://git@github.com/',
  })

  const recorded = modulesYaml(profileDir)
  const major = /pnpm@(\d+)\./.exec(recorded)
  const pnpmSpec = major === null ? 'pnpm' : 'pnpm@' + major[1]

  const baseArgs = ['add', spec, '-w', '--dir', profileDir]
```

</details>

**依据 3 · 源码核查**：[market-core.mjs:316-361](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L316-L361)

build script 拒绝时 ignore-scripts 重试与 manifest 改写。

<details>
<summary>查看原文（46行）</summary>

```text
  let result = runPnpm([])

  if (result.error === null || result.error === undefined) {
    if (result.status !== 0 && result.output.includes('ERR_PNPM_IGNORED_BUILDS')) {
      console.log('market: pnpm refused because a dependency has an unreviewed build script.')
      console.log('market: retrying with --ignore-scripts (nothing gets built, nothing is approved).')
      console.log('market: to build such a package deliberately, run `pnpm approve-builds` in the profile.')
      const retry = runPnpm(['--ignore-scripts'])
      result = { status: retry.status, error: retry.error, output: result.output + '\n' + retry.output }
    }
  }

  if (result.output !== '') console.log(result.output)
  if (result.error) {
    console.error('market: spawn failed: ' + result.error.message)
    process.exit(1)
  }
  if (result.status !== 0) process.exit(result.status === null ? 1 : result.status)

  const after = JSON.parse(readFileSync(manifestPath, 'utf8'))
  const bundles = (after.dsh && after.dsh.profile && after.dsh.profile.bundles) || []
  let changed = false
  for (const name of Object.keys(after.dependencies || {})) {
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
  }
  const added = Object.keys(after.dependencies || {}).filter((n) => !beforeDeps.has(n))
  console.log('market: installed=[' + added.join(', ') + ']')
  console.log('market: bundles=[' + bundles.join(', ') + ']')
  process.exit(0)
```

</details>

**依据 4 · 源码核查**：[index.js:706-731](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L706-L731)

单进程安装锁、900 秒调用与结果日志。

<details>
<summary>查看原文（26行）</summary>

```text
            if (installInProgress) {
              sendJson(response, 409, { ok: false, message: '已有插件正在安装，请等待完成后重试' })
              return
            }
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', PROFILE], 900000)
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
```

</details>

#### 缺口

- 未量化网络、安装、复核和回滚资源
  **影响**：无法推导每次合格安装总成本
  **进一步探讨**：隔离 profile 记录首次、升级、失败恢复各阶段耗时和人工动作

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些工程设计可借鉴，怎样验证更可靠的来源/目标保护？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

host 侧参数上限、同源检查、JSON Content-Type、单 argv spec、拒前导 dash 与安装串行锁是有用的边界；已装版本无法判断时给 unknown 也避免误报“最新”。但它的边界围绕请求/命令形状，并未端到端固定 profile 与目录来源。待验证设计是假设从宿主明确取目标 profile，安装前显示旧 spec、目录新 spec、包来源/版本/摘要，用户确认后只对选定 profile 写入；对多源目录用签名或固定摘要确认同一版本内容，重启后检查加载。最小测试覆盖 web/custom profile、Git 固定提交转 npm、镜像不一致、依赖脚本跳过及安装成功但加载失败；看目标正确率、误更新拒绝率、恢复耗时和额外确认负担。设计尚未实现，不能把它算现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:319-364](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L319-L364)

同源/JSON/safeSpec 防线。

<details>
<summary>查看原文（46行）</summary>

```text
 * channels registered through the connection service, i.e. paths under `/api`. A
 * route registered straight on `webServer` gets none of it — and `POST /install`
 * runs pnpm with a spec taken from a remote catalog, so without this any page the
 * user happens to have open could trigger a real install.
 *
 * `Sec-Fetch-Site: cross-site` is what a browser sends with another site's fetch.
 * The Origin/Host comparison catches what that header does not: older browsers, and
 * a different local port — which is same-site but not same-origin.
 *
 * @returns a reason to refuse, or '' to proceed.
 */
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
}

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
}
```

</details>

**依据 2 · 源码核查**：[index.js:601-625](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L601-L625)

unknown 版本和未收录 bundle 的显式计数。

<details>
<summary>查看原文（25行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[index.js:678-731](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L678-L731)

安装流程结束点未含重启后加载。

<details>
<summary>查看原文（54行）</summary>

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
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', PROFILE], 900000)
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
```

</details>

**依据 4 · 源码核查**：[market-core.mjs:74-116](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/market-core.mjs#L74-L116)

多源目录只做形状检查。

<details>
<summary>查看原文（43行）</summary>

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
      const payload = {
        version,
        updated: data.updated || '',
        fetchedAt: Date.now(),
        categories: data.categories || {},
        plugins: data.plugins.map(slim),
      }
      if (!ensureDir()) { tried.push(attempt.name + '=no-state-dir'); continue }
      writeFileSync(CATALOG_PATH, JSON.stringify(payload))
      return {
        ok: true, source: attempt.name, tried, version, updated: payload.updated,
        count: payload.plugins.length, path: CATALOG_PATH, bytes: statSync(CATALOG_PATH).size,
```

</details>

#### 缺口

- 来源绑定、目标选择与加载确认没有原型评估
  **影响**：不能声明降低供应链风险或不增加操作负担
  **进一步探讨**：固定夹具原型对比误装、误更、拒绝、耗时和回滚

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 现在可以怎样使用，哪些动作需要人工审阅？

**研究主题**：采用判断

#### 完整回答

在明确使用 web profile、且愿意逐项审阅来源和版本的场景，可把页面当目录浏览与安装入口观察。安装前核目录命令是否改变原有 Git/commit 约束；对非 web profile、固定版本依赖和敏感工作环境，先不要直接点更新。pnpm 返回成功后重启并核实际加载与功能，目录收录、下载量和列表徽章不等于推荐。当前采用建议为 observe：关键原因是错 profile 与来源漂移可能使一键操作偏离用户预期；未运行目标插件、目录抓取、安装或宿主验收。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:25-27](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L25-L27)

固定 web profile。

```text
const PROFILE = 'web'
const ROUTE_LIST = '/dsh-plugin-market/list'
const ROUTE_INSTALL = '/dsh-plugin-market/install'
```

**依据 2 · 源码核查**：[index.js:678-731](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/index.js#L678-L731)

安装成功仅依赖 helper 退出状态。

<details>
<summary>查看原文（54行）</summary>

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
            installInProgress = true
            try {
              const started = Date.now()
              const result = await runHelper(['install', spec, '--profile', PROFILE], 900000)
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
```

</details>

**依据 3 · 作者声明**：[README.md:67-81](https://github.com/99galaxy/dsh-plugin-market/blob/b97664510aafd55a74f17e304e271956f1c07659/README.md#L67-L81)

作者解释重启和更新来源变化。

<details>
<summary>查看原文（15行）</summary>

```text
## 使用

1. 打开设置 → **DSH 插件市场**
2. 浏览或搜索；点卡片右侧「安装」
3. 安装完成后**重启 DSH**，插件才会加载

「已安装」标签里可以确认某个插件是否已经在你的 profile 里；「可更新」标签里是可以升级的那些。

> **关于「更新」**：它执行的仍是**目录里那条安装命令**，所以装的是目录指定的那个来源 ——
> 一个用 `github:` 装的插件，如果目录对应的条目是 npm 包名，更新后会变成 npm 包。
> 想留在固定 commit 上就别点更新。
>
> **判断不了的插件**：目录里没有 `version`、或目录根本没收录的插件，无法判断有没有更新。
> 它们不会出现在「可更新」标签里，但标签内会单独说明有多少个 ——
> 免得把「判断不了」误读成「已经是最新」。
```

</details>

#### 缺口

- 实际安装与加载成功率、profile 错误率未测
  **影响**：不能给普遍值得安装建议
  **进一步探讨**：隔离目标 profile 逐项记录安装/重启/加载证据

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
