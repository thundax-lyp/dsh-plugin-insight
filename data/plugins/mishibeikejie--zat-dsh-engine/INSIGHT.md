# Zat-DSH Engine

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[11d5b5f](https://github.com/mishibeikejie/zat-dsh-engine/tree/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a)

<!-- BEGIN META -->
[![GitHub ★ 77](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=77&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/mishibeikejie/zat-dsh-engine)
<!-- END META -->

> **功能**：提供DSH市场搜索、中文缓存、扩展安装体检及profile和会话管理界面。

> **亮点**：[Q01](#research-q01) 集中发现与状态；[Q02](#research-q02) 接元数据闸、安装校验和配置快照。

> **主要限制**：[Q02](#research-q02) 安全告警不阻安装且自动放行build，三文件恢复不是副作用回滚；[Q03](#research-q03) 删除后代计数不证明停止/磁盘成功。

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
  - [Q01 · 市场查询与中文说明实际来自哪里？](#detail-section-11)
  - [Q02 · 安装体检、构建放行和回滚到底覆盖什么？](#detail-section-12)
  - [Q03 · 永久删除会话是否原子且可恢复？](#detail-section-13)
  - [Q04 · 修复、令牌、启动与退出有哪些真实副作用？](#detail-section-14)
  - [Q05 · 显式构建授权能否降低误装代价？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：在可信本地DSH环境寻找并手工管理扩展的用户。

手查仓库、运行官方插件CLI和手工维护profile。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 扩展发现 | 搜索中文缓存与安装状态 | 缓存非实时质量证明 |
| 扩展管理 | 安装更新卸载与启用 | 脚本和镜像需审查 |
| profile体检修复 | 依赖冲突及挂载配置 | 可能启用已有包和装全局pnpm |
| 会话管理 | 列表及永久级联删除 | 整棵停止独立备份，不可逆 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH Web与remote | 必需 | 市场页面及host变更 | 权限依赖真实宿主 |
| 可写profile与pnpm | 包管理必需 | 安装启用依赖 | repair可能全局安装pnpm |
| Git及镜像网络 | Git/技能需要 | 动态HEAD源码获取 | 来源及版本需审查 |
| curl与代理 | GitHub认证API需要 | 固定API请求 | 失败需处理，不保证联网 |
| 独立备份 | 变更前必要 | 配置技能会话恢复 | 三文件快照不覆盖副作用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 复制profile并备份skills/sessions | 不含生产token |
| 浏览 | 核seed缓存与真实仓库元数据 | 不把体检当安全证明 |
| 安装 | 审查确定来源和构建脚本后单项变更 | 核bundle/insert和重启 |
| 退出 | 等任务结束后官方CLI移除自身 | 清token源，保留备份并核全局副作用 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 下载构建依赖占盘未测 | 审查脚本镜像及宿主权限 | 不自动承诺安全 |
| 持续 | 缓存和API请求资源未测 | 处理HEAD变化与兼容 | translate无现场推理 |
| 失败恢复 | 配置快照仅三文件 | 另查node_modules脚本与技能覆盖 | 并发任务非事务 |
| 不可逆操作 | 会话数据删除 | 必须另存备份核父子停止 | 计数不是删除证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 发现 | 缓存快照及实时查询分支 | 选型质量与完整性 |
| 兼容检查 | 元数据和注册冲突闸 | 真实兼容与误报 |
| 变更恢复 | 三文件快照及启用回读 | 系统副作用能否回退 |

> **思考**：[Q02](#research-q02) 安全告警不阻安装且自动放行build，三文件恢复不是副作用回滚；[Q03](#research-q03) 删除后代计数不证明停止/磁盘成功。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中发现与状态；[Q02](#research-q02) 接元数据闸、安装校验和配置快照。

[Q02](#research-q02) 检查失败退空和警告放行需显式理解，不能宣传安全安装保证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 安全告警不阻安装且自动放行build，三文件恢复不是副作用回滚；[Q03](#research-q03) 删除后代计数不证明停止/磁盘成功。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 先只读副本；单项审脚本后才开写操作。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态覆盖发现、安装、修复、技能覆盖、令牌和会话删除，未执行任何目标。

- 已检查：作者 README、包清单、源码路径 src/client/index.tsx、src/index.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根市场插件，含模型搜索、安装技能与包、修复及永久会话删除；未把第三方扩展能力计入自身。
- 下一步：副本验证并发恢复、构建放行、技能重名和后代删除故障，尚未运行。

**分析版本**

- **仓库**：[mishibeikejie/zat-dsh-engine](https://github.com/mishibeikejie/zat-dsh-engine)
- **版本号**：0.8.2（[固定提交 11d5b5f](https://github.com/mishibeikejie/zat-dsh-engine/tree/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a)）
- **版本日期**：2026-09-24（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 与固定版本绑定的构建授权能否降低误装需对照。

副本验证并发恢复、构建放行、技能重名和后代删除故障，尚未运行。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 3 | 29019 | 28657 | 1819 | — |
| .md | source | 2 | 537 | — | — | 8328 |
| .mjs | source | 22 | 2120 | 1699 | 219 | — |
| .tsx | source | 1 | 1694 | 1516 | 97 | — |
| .ts | source | 2 | 4462 | 3675 | 715 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/mishibeikejie/zat-dsh-engine/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：Zat怎样发现并管理DSH扩展，安装修复和会话删除的可恢复边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场查询与中文说明实际来自哪里？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

这是DSH host/client市场插件，模型find_plugin搜索工具和Web市场共享gateway，不是独立包管理器客户端。列表先读取24小时本地缓存并重新盖installed状态，再用内置快照首屏响应和后台刷新，缺省GitHub topic搜索，无结果时关键词可退广搜。因此source=seed不能当实时完整目录，星数和排序也不是质量证明。详情、版本和安装另走远端读取，不受列表缓存完全约束。

文件头仍说LLM翻译fallback，但实际translate只返回内置+本地缓存并固定llmUsable:false/pending0，新项英文保留，没有现场模型翻译调用。不能基于旧说明给“智能自动翻译”能力或推理成本。贡献是中文缓存、安装状态、搜索说明和操作集中入口，是否减少找插件时间仍未实测。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2619-2653](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2619-L2653)

缓存快照与后台刷新

<details>
<summary>查看原文（35行）</summary>

```text
  async list(page: number, sort: string, q: string, category: string): Promise<MarketListResult> {
    try {
      const sortKey = sort === 'updated' ? 'updated' : 'stars'
      const pageNum = Math.max(1, Number(page) || 1)
      const qText = String(q || '').trim()
      const cat = String(category || '全部')
      const catQuery = CATEGORY_QUERY[cat] || ''
      // 列表数据变化很慢:磁盘缓存(24h)让重启后同查询零请求;安装/卸载会清缓存,
      // 版本更新检测走独立的 versions() 通道,不受列表缓存影响。
      await this.loadListCache()
      const cacheKey = `list:${sortKey}:${pageNum}:${qText}:${cat}`
      // 先算当前 installedMap(纯本地):缓存命中也要重盖 installed 状态,否则会出现
      // "装了插件,列表里还显示安装按钮"这种状态不同步。
      let profile: JsonObject | null = null
      try { profile = await this.readProfile() } catch { profile = null }
      const inst = profile ? await this.installedMap(profile) : {}
      const cached = this.cacheGet(cacheKey) as MarketListResult | null
      if (cached) {
        return Array.isArray(cached.items)
          ? { ...cached, items: this.restampInstalled(cached.items, inst) }
          : cached
      }
      const query = 'topic:dsh-plugin' + (catQuery ? '+' + encodeQueryPart(catQuery) : '') + (qText ? '+' + encodeQueryPart(qText) : '')
      await this.loadZhCache()
      // 首次加载(无任何缓存)秒开:内置快照先顶上(零网络,按页返回与真实分页行为一致),
      // 只有第一页触发后台静默拉真实数据替换缓存。
      const seed = this.seedList(sortKey, qText, catQuery, inst, pageNum)
      if (seed) {
        if (pageNum === 1) void this.refreshListFromGitHub(cacheKey, sortKey, pageNum, qText, cat, catQuery, query, inst)
        return { ok: true, items: seed.items, total: seed.total, hasMore: pageNum * 100 < seed.total, page: pageNum, llmUsable: false, source: 'seed' }
      }
      return await this.fetchListPage(cacheKey, sortKey, pageNum, qText, cat, catQuery, query, inst)
    } catch (err) {
      return { ok: false, message: String((err as { message?: string })?.message || err) }
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2657-2673](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2657-L2673)

topic与广搜

<details>
<summary>查看原文（17行）</summary>

```text
  private async fetchListPage(cacheKey: string, sortKey: string, pageNum: number, qText: string, cat: string, catQuery: string, query: string, inst: InstalledMap, epoch?: number): Promise<MarketListResult> {
    const url = `https://api.github.com/search/repositories?q=${query}&sort=${sortKey}&order=desc&per_page=100&page=${pageNum}`
    let r = await this.ghSearch(url)
    // 有搜索词但 topic 精确匹配为空时,回退全文搜(没打 dsh-plugin 标签的仓库也能搜到)。
    if (r.status === 200 && qText) {
      try {
        const j = JSON.parse(r.body) as { items?: unknown[] } | null
        if (j && Array.isArray(j.items) && j.items.length === 0) {
          const broad = `https://api.github.com/search/repositories?q=${encodeQueryPart(qText)}+dsh-plugin&sort=${sortKey}&order=desc&per_page=100&page=${pageNum}`
          r = await this.ghSearch(broad)
        }
      } catch { /* 解析失败按原样 */ }
    }
    if (r.status !== 200) {
      const why = r.status === 403 || r.status === 429 ? '搜索太频繁被限流,稍后再试。' : r.status === 400 || r.status === 422 ? '搜索词无效,换个说法试试。' : '连不上 GitHub,请开代理或稍后重试。'
      return { ok: false, message: `搜索失败(${r.status})。${why}` }
    }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2840-2855](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2840-L2855)

实际无LLM翻译

<details>
<summary>查看原文（16行）</summary>

```text
  @Remote('translate')
  async translate(items: Array<{ fullName?: string; description?: string }>): Promise<{ ok: boolean; map: Record<string, string>; llmUsable: boolean; pending: number }> {
    // 自动翻译(LLM 现场生成中文简介)已移除:DeepSeek 峰谷定价下,高峰时段打开
    // 市场会对"没有缓存中文简介"的新插件批量调用当前模型,白烧大量余额。
    // 这里只返回已有缓存(内置快照 + 用户本地缓存),新插件保持英文简介、不再翻译。
    const list = Array.isArray(items) ? items : []
    const map: Record<string, string> = {}
    await this.loadZhCache()
    for (const it of list) {
      const key = String(it.fullName || '').toLowerCase()
      if (!key) continue
      const cached = this.zhCache.get(key)
      if (cached && Date.now() - cached.at < ZH_TTL) map[it.fullName || key] = cached.zh
    }
    return { ok: true, map, llmUsable: false, pending: 0 }
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:603-605](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L603-L605)

模型find_plugin入口

```text
    return defineTool({
      name: 'find_plugin',
      description: '在 DeepSeek Harness 插件市场里按需求搜索插件(中文或英文)。返回候选列表:名称、星数、简介、中文简介、是否可直接安装、安装命令,以及每个候选的「装前体检」(health)结果——体检检查入口文件是否真的存在、挂载补丁是否缺失、官方依赖是否写错、peer 依赖本机是否有、安装脚本是否要联网下载、是否依赖外部命令、仓库是否归档/停更,并对宿主和界面代码做安全扫描(混淆/动态执行、读取 SSH/云凭据/浏览器数据、可疑外发地址、外部网络去向清单)。用户描述一个能力需求时调用;用户选定后,用返回的 install 命令安装(装完提示重启 dsh),并建议用户在插件市场里点「一键检测」确认与已装插件没有冲突。重要:体检结果是让你判断"能不能推荐"用的——带 ❌/[error] 硬伤(包括安全问题)的候选,装了大概率用不了或根本不该装,必须把问题如实告诉用户,不要盲目推荐安装。',
```

#### 缺口

- GitHub/镜像当前覆盖及用户选型效果未验证
  **影响**：缓存和广搜可能含不适用项，不能做安全背书
  **进一步探讨**：标清seed并对照同一时点官方仓库与包元数据

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 安装体检、构建放行和回滚到底覆盖什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

安装先校验owner/repo/subdir、市场冲突和元数据：缺入口但有构建脚本只警告；有同源npm可改npm安装；官方core错误直依赖、OS/CPU和挂载服务冲突可硬拦。安全scanSecurity是文本正则，敏感路径、动态代码、可疑host等都转warn，不拦安装；fetchCandidateTexts失败也可返回空block，未查完不是安全通过。模型工具描述中的硬伤勿推荐不等于host安全闸。

addSpec可自动写allowBuilds并对被拦构建最多重试3轮，Git/npm脚本在安装时可能执行；Git候选和镜像未固定commit，检查HEAD与安装内容可能漂移。快照只有package.json/cordis.patch.yml/pnpm-lock.yaml，恢复不撤销node_modules、构建副作用、全局设置和外部下载。pnpm成功后加bundle并回读校验，client-only补insert；无bundle可保留依赖但disabled，失败并非总恢复。launchTask直接并发work，没有该方法层的全profile串行锁，多个变更及旧快照恢复可能交错，不能称事务。

技能安装另走浅clone（镜像优先），扫描SKILL后先rm目标目录再cp，最后写manifest；不是profile三文件快照事务，重名可覆盖已有技能，失败finally只清staging，不恢复被覆盖目录。先在副本profile验证，不把安全提示当恶意判定或无风险证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1454-1495](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L1454-L1495)

元数据闸及无法抓取退空block

<details>
<summary>查看原文（42行）</summary>

```text
  private async analyzeCandidateConflicts(owner: string, repo: string, subdir?: string): Promise<{ block: string[]; warn: string[]; usage: string[]; name?: string; scripts?: Record<string, string>; npmName?: string }> {
    const block: string[] = []
    const warn: string[] = []
    const f = await this.fetchCandidateTexts(owner, repo, subdir)
    if (!f) return { block, warn, usage: [] }
    const meta = f.meta
    let npmName: string | undefined
    // (0) Declared entry files must exist in the repo — a plugin pointing at
    // uncommitted build artifacts (dist not committed) installs but can never
    // load. BUT: a build script (prepare/preinstall/install/postinstall) can
    // generate those files at install time — such plugins are installable
    // (auto-allowBuilds handles the pnpm block), so only warn. AND: many dsh
    // plugins keep only source on GitHub and publish builds to npm (prepack
    // runs at publish time) — when npm has a same-source package, install
    // from npm instead of blocking.
    if (f.missingEntries.length > 0) {
      if (hasBuildScript(meta.scripts)) {
        warn.push(`入口文件缺失(${f.missingEntries.join('、')}),但声明了构建脚本会在安装时现场生成 — 会自动放行构建脚本,装完重启生效`)
      } else {
        const same = await this.sameSourceNpm(meta.name, owner, repo)
        if (same) {
          npmName = same.name
          warn.push(`GitHub 仓库只是源码(入口 ${f.missingEntries.join('、')} 未提交),npm 已有同源发布 ${same.name}@${same.version} — 将自动改用 npm 官方源安装,效果等同官方 dsh plugin add ${same.name}`)
        } else {
          block.push(`入口文件缺失:${f.missingEntries.join('、')} — 构建产物没提交到仓库,装了也加载不起来`)
        }
      }
    }
    // (1) Host-core official packages must be peers, never direct deps — a
    // direct dep installs a second copy and hijacks the official loader rows.
    // npm-published helper libs (@deepseek-ai/schemastery 等) are fine as deps.
    for (const d of Object.keys(meta.dependencies || {})) {
      if (isHostCorePackage(d)) block.push(`官方包${d}应为peer依赖`)
    }
    // (1b) System/CPU compatibility: a plugin that declares it does not support
    // this OS/arch would break dsh on the next restart — block up front.
    if (!fieldSupports(meta.os, process.platform)) {
      block.push(`不支持当前系统:该插件仅支持 ${(meta.os || []).join('、')},你当前是 ${process.platform},装了 dsh 大概率起不来`)
    }
    if (!fieldSupports(meta.cpu, process.arch)) {
      block.push(`不支持当前 CPU:该插件仅支持 ${(meta.cpu || []).join('、')},你当前是 ${process.arch}`)
    }
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1539-1551](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L1539-L1551)

安全仅警告

<details>
<summary>查看原文（13行）</summary>

```text
    } catch { /* best effort */ }
    // (6) 安全扫描是启发式检测,会误伤正经插件(比如"发通知到 Discord/Telegram"
    // 的插件就会命中 webhook/机器人钩子)。所以只提示、不拦截:用户装前能看见,
    // 装不装自己定。真正的硬拦截交给上面的客观项(官方包写错/入口缺失/系统不支持)。
    for (const sec of scanSecurity(f.hostText, '宿主代码')) {
      warn.push(`安全提示:${sec.title}`)
    }
    for (const sec of scanSecurity(f.clientText, '界面代码')) {
      warn.push(`安全提示:${sec.title}`)
    }
    return { block, warn, usage: describeUsage(f.hostText, f.clientText), name: meta.name, scripts: meta.scripts, npmName }
  }

```

</details>

**依据 3 · 源码核查**：[src/index.ts:2416-2440](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2416-L2440)

快照及自动构建放行

<details>
<summary>查看原文（25行）</summary>

```text
  private async addSpec(owner: string, repo: string, subdir?: string, taskId?: string, preAnalysis?: { block: string[]; warn: string[]; name?: string; scripts?: Record<string, string>; npmName?: string }): Promise<{ ok: boolean; packageName: string | null; message?: string; warning?: string; installedAsDisabled?: boolean; hotReload?: boolean }> {
    const o = safeSegment(owner)
    const repoName = safeSegment(repo)
    const s = subdir === undefined ? undefined : safeSubdir(subdir)
    if (!o || !repoName || s === null) return { ok: false, packageName: null, message: 'invalid repository name or subdirectory' }
    const dir = await this.getProfileDir()
    const gate = await this.checkMarketConflict(o, repoName)
    if (gate) return { ok: false, packageName: null, message: gate }
    const analysis = preAnalysis || await this.analyzeCandidateConflicts(o, repoName, s || undefined)
    if (analysis.block.length > 0) {
      return { ok: false, packageName: null, message: `安装已拦截:${analysis.block.join(';')}。确要强制安装请用官方命令。` }
    }
    // GitHub 仓库只是源码、npm 有同源发布:改用 npm 官方源安装(效果等同
    // 官方 dsh plugin add <name>),npm 包自带构建产物,装完即可加载。
    const npmSource = analysis.npmName || null
    const warnings = analysis.warn.length > 0 ? analysis.warn.join('; ') : undefined
    this.invalidateListCache()
    const snap = await this.snapshotProfile(dir)
    // 带构建脚本的 git 插件会被 pnpm 默认拦掉:先把包名放进 allowBuilds,争取一次装成。
    if (analysis.name && hasBuildScript(analysis.scripts)) {
      await this.ensureAllowBuilds(analysis.name)
    }
    if (taskId) {
      this.setTaskStep(taskId, 'download', npmSource ? `正在从 npm 下载 ${npmSource}…` : '正在下载安装包…')
      this.setTaskProgress(taskId, 12, npmSource ? `正在从 npm 下载 ${npmSource}…(已进行 0 秒)` : '正在下载安装包…(已进行 0 秒)')
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2477-2510](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2477-L2510)

镜像和构建重试

<details>
<summary>查看原文（34行）</summary>

```text
    } else {
      // 默认走官方 GitHub(开 VPN/代理的用户走官方渠道);已知直连不通时优先镜像;
      // 直连失败再依次尝试两个国内镜像,让没 VPN 的用户也能装。
      const spec = s ? `github:${o}/${repoName}#path:${s}` : 'github:' + o + '/' + repoName
      const candidates = this.directDown ? [...this.mirrorSpecs(spec), spec] : [spec, ...this.mirrorSpecs(spec)]
      let pnpmResult = await this.pnpmShell('pnpm add ' + candidates[0]!, dir, progress)
      for (let i = 1; i < candidates.length && pnpmResult.outcome.exitCode !== 0; i++) {
        const alt = await this.pnpmShell('pnpm add ' + candidates[i]!, dir, progress)
        if (alt.outcome.exitCode === 0) pnpmResult = alt
      }
      // 构建脚本被拦(PREPARE_NOT_ALLOWED):自动把包名/完整键写进 allowBuilds 再重试。
      // pnpm 11 对 git 依赖每次解析可能换路由(codeload tarball / git+clone),报错里
      // 的 allowBuilds 键会跟着变,所以循环处理:每轮从最新报错提取键并累计写入,最多 3 轮。
      if (pnpmResult.outcome.exitCode !== 0) {
        for (let round = 0; round < 3 && pnpmResult.outcome.exitCode !== 0; round++) {
          const firstErr = String(pnpmResult.stderr || pnpmResult.stdout || '')
          if (!/PREPARE_NOT_ALLOWED|allowBuilds|build script/i.test(firstErr)) break
          const allowedName = extractBuildName(firstErr) || analysis.name || null
          if (!allowedName) break
          await this.restoreProfile(dir, snap)
          await this.ensureAllowBuilds(allowedName)
          pnpmResult = await this.pnpmShell('pnpm add ' + candidates[0]!, dir, progress)
          for (let i = 1; i < candidates.length && pnpmResult.outcome.exitCode !== 0; i++) {
            const alt = await this.pnpmShell('pnpm add ' + candidates[i]!, dir, progress)
            if (alt.outcome.exitCode === 0) pnpmResult = alt
          }
        }
      }
      if (pnpmResult.outcome.exitCode !== 0) {
        await this.restoreProfile(dir, snap)
        const errText = String(pnpmResult.stderr || pnpmResult.stdout || '')
        if (/pnpm[^\n]*(?:不是内部或外部命令|无法识别|command not found|is not recognized)|corepack[^\n]*(?:不是内部或外部命令|无法识别|command not found|is not recognized)/i.test(errText)) {
          this.recordIssue('没装 pnpm', '装/更新插件都靠它。解决:终端跑 corepack enable(或 npm i -g pnpm)。')
          return { ok: false, packageName: null, message: '没装 pnpm。先跑一条: corepack enable(或 npm i -g pnpm),再重试。' }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:1080-1098](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L1080-L1098)

快照仅三文件

<details>
<summary>查看原文（19行）</summary>

```text
  private async snapshotProfile(dir: string): Promise<Record<string, string | null>> {
    const files = ['package.json', 'cordis.patch.yml', 'pnpm-lock.yaml']
    const out: Record<string, string | null> = {}
    for (const f of files) {
      try { out[f] = readFileSync(join(dir, f), 'utf8') } catch { out[f] = null }
    }
    return out
  }

  private async restoreProfile(dir: string, snap: Record<string, string | null>): Promise<void> {
    for (const f of Object.keys(snap)) {
      const content = snap[f]
      if (content === null) {
        try { unlinkSync(join(dir, f)) } catch { /* never existed */ }
      } else {
        await this.writeFileText(join(dir, f), content)
      }
    }
  }
```

</details>

**依据 6 · 源码核查**：[src/index.ts:2555-2616](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2555-L2616)

启用校验与disabled保留

<details>
<summary>查看原文（62行）</summary>

```text
    let clientOnly = false
    let matchedName: string | null = null
    for (const name of deps) {
      if (bundles.includes(name)) continue
      const specVal = String(((after.dependencies || {}) as Record<string, string>)[name] || '')
      if (npmSource) {
        // npm 源安装:依赖表里出现的就是裸包名(版本号 spec),按包名匹配。
        if (name.toLowerCase() !== npmSource.toLowerCase()) continue
      } else if (!specVal.toLowerCase().includes(o.toLowerCase() + '/' + repoName.toLowerCase())) {
        continue
      }
      matched = true
      matchedName = name
      try {
        const meta = JSON.parse(readFileSync(join(dir, 'node_modules', name, 'package.json'), 'utf8')) as { dsh?: { bundle?: { patch?: string }; client?: unknown } }
        if (meta.dsh?.bundle?.patch) { bundles.push(name); added = name }
        else { missingBundle = true; if (meta.dsh?.client) clientOnly = true }
      } catch { /* node_modules missing — treat as failure below */ }
    }
    if (added) {
      after.dsh = after.dsh || {}
      ;(after.dsh as JsonObject).profile = (after.dsh as JsonObject).profile || {}
      ;((after.dsh as JsonObject).profile as JsonObject).bundles = bundles
      await this.writeProfile(after)
      // Post-validation: the written profile must parse and carry the bundle.
      try {
        const check = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as JsonObject
        const checkBundles = ((check.dsh as JsonObject | undefined)?.profile as JsonObject | undefined)?.bundles
        if (!Array.isArray(checkBundles) || !checkBundles.includes(added)) throw new Error('bundles not persisted')
      } catch {
        await this.restoreProfile(dir, snap)
        return { ok: false, packageName: null, message: '安装成功但启用名单写入校验失败,已自动回滚到安装前状态。请重试或手动编辑 profile。' }
      }
      await this.saveLastKnownGood()
      if (taskId) this.setTaskProgress(taskId, 97, '写入完成,收尾中…')
      return { ok: true, packageName: added, warning: warnings }
    }
    if (missingBundle) {
      if (clientOnly && matchedName) {
        // Client-only surface plugin (theme/UI): register an `insert` row in
        // cordis.patch.yml so it loads after restart — the same one-shot
        // install experience as a bundle, no manual YAML editing.
        const inserted = await this.upsertClientInsert(matchedName)
        try {
          if (!(await this.clientInsertNames()).has(matchedName)) throw new Error('insert not persisted')
        } catch {
          await this.restoreProfile(dir, snap)
          return { ok: false, packageName: null, message: '安装成功但自动注册写入校验失败,已回滚。请重试或手动在 cordis.patch.yml 里加 insert 行。' }
        }
        await this.saveLastKnownGood()
        if (taskId) this.setTaskProgress(taskId, 97, '写入完成,收尾中…')
        return { ok: true, packageName: matchedName, warning: warnings, hotReload: true }
      }
      return { ok: false, packageName: matchedName, installedAsDisabled: true, message: '安装完成,但该仓库没有声明 dsh.bundle,无法作为插件加载——它可能只是普通库或代码仓库,不是 dsh 插件。已作为普通依赖保留,重启也不会生效。' }
    }
    if (matched) {
      return { ok: false, packageName: null, message: '安装记录已写入,但未能定位到已安装的包文件。请稍后重试,或检查 profile 的 node_modules。' }
    }
    return { ok: false, packageName: null, message: 'pnpm 报告成功,但依赖列表里没有出现该仓库。安装可能未完成,请重试。' }
  }

  // ── Remote methods ─────────────────────────────────────────────────────
```

</details>

**依据 7 · 源码核查**：[src/index.ts:1196-1203](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L1196-L1203)

异步任务无串行闸

```text
  private launchTask(work: (id: string) => Promise<JsonObject>, subject?: { owner: string; repo: string }): string {
    const id = 'task-' + (++this.taskSeq)
    this.tasks.set(id, { step: 'start', message: '准备中…', progress: 1, done: false, ...(subject ? { subject } : {}) })
    void work(id).then((result) => this.finishTask(id, result)).catch((err: unknown) => {
      this.finishTask(id, { ok: false, message: String((err as { message?: string })?.message || err) })
    })
    return id
  }
```

**依据 8 · 源码核查**：[src/index.ts:2043-2063](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2043-L2063)

技能覆盖与清单

<details>
<summary>查看原文（21行）</summary>

```text
        return { ok: false, message: '下载失败:连不上 GitHub。请换个网络或稍后重试。' }
      }
      this.setTaskStep(taskId, 'verify', '下载完成,正在扫描技能…')
      const skills = scanSkills(cloneDir)
      if (skills.length === 0) {
        return { ok: false, notPlugin: true, kind: 'none', message: '这个仓库里既没有插件声明,也没有可安装的技能(SKILL.md)。它不是 dsh 插件或技能,无法通过市场安装。' }
      }
      const skillsDir = await this.getSkillsDir()
      mkdirSync(skillsDir, { recursive: true })
      const dirs: string[] = []
      const names: string[] = []
      for (const s of skills) {
        rmSync(join(skillsDir, s.dir), { recursive: true, force: true }) // 重复安装 = 覆盖更新
        cpSync(join(cloneDir, s.dir), join(skillsDir, s.dir), { recursive: true })
        dirs.push(s.dir)
        names.push(s.name)
      }
      const manifest = await this.readSkillManifest()
      // 顺手抓一下仓库星数,存进清单,让"已安装"列表里星数不是 0。
      let stars: number | undefined
      try {
```

</details>

#### 缺口

- 真实pnpm生命周期、副作用与并发冲突未复现
  **影响**：回滚配置不能保证系统恢复，重名技能可能损失
  **进一步探讨**：副本中并发安装失败与技能重名测试并对照文件清单

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 永久删除会话是否原子且可恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

Web客户端有不可恢复确认，host验证id且拒绝running根会话；但idle agent scope dispose异常会忽略后继续删，随后从persistence找完整header，子会话不允许直接删。删除先按locate(header)的父目录和DSH_HOME/sessions扫描删除文件，再处理workspace归档/置顶、projcache与内存store。若locate/扫描没目标返回成功；registry或cache可best effort留下警告/残留，不是磁盘与内存事务。

之后按parentSession遍历所有子代理后代并purge。purge不先拒绝running子代理，ctx.dispose也未await，异常仍继续；removeSessionFiles返回错误未在purge检查，调用方仍递增removedDescendants，因而成功计数不能证明后代磁盘已删除或停止。不能推荐在有活动后代时删除根。真实宿主locate路径和dispose契约未实测，必须先导出/独立备份并确认整棵会话停止；删除本身不应作为常规退出或回退手段。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:1566-1573](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/client/index.tsx#L1566-L1573)

客户端不可逆确认

```text
    if (item.live) { setNotice(t('运行中的会话不能删除,等它跑完再删', 'A running session cannot be deleted — wait for it to finish')); return }
    if (item.subagent) { setNotice(t('子代理会话不能直接删除', 'Subagent sessions cannot be deleted directly')); return }
    if (!window.confirm(t(`确定永久删除会话 ${item.id}?此操作不可恢复。`, `Delete session ${item.id} permanently? This cannot be undone.`))) return
    setBusy(item.id)
    void pm.deleteSession(item.id).then((res) => {
      setBusy('')
      setNotice(res.ok ? String(res.value.message || '') : res.error.message)
      if (res.ok && res.value.ok) {
```

**依据 2 · 源码核查**：[src/index.ts:3427-3469](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L3427-L3469)

根运行拒绝及文件先删

<details>
<summary>查看原文（43行）</summary>

```text
  async deleteSession(sessionId: string): Promise<JsonObject> {
    try {
      const id = String(sessionId || '').trim()
      if (!/^[\w-]+$/.test(id)) return { ok: false, message: 'invalid session id' }
      const persistence = this.persistenceFace
      if (!persistence) return { ok: false, message: '当前环境不支持删除会话' }
      const agents = this.agentsFace
      const agent = agents ? agents.get(id) : undefined
      if (agent !== undefined && agent.status === 'running') {
        return { ok: false, message: '这个会话正在运行,不能删除。等它跑完再删。' }
      }
      // An idle-but-attached session stays in ctx.sessions and keeps
      // reappearing in the sidebar (drifting into the ungrouped bucket once
      // its workspace slot is gone). Dispose the agent's scope first so the
      // in-memory registry drops it for good.
      if (agent !== undefined) {
        try {
          const agentCtx = agent.ctx
          if (agentCtx && typeof agentCtx.dispose === 'function') agentCtx.dispose()
        } catch { /* proceed with the file/accounting delete regardless */ }
      }
      const header = (await persistence.list()).map(listHeader).find((c) => c?.id === id)
      const registry = this.workspaceRegistryFace
      if (header === undefined) {
        const accounted = registry !== undefined && ((registry.archivedSessionIds ?? []).includes(id)
          || registry.list().some((w) => (w.sessionIds as readonly string[]).includes(id)))
        if (!accounted) return { ok: false, message: '没有找到这个会话' }
        await this.forgetSessionCompat(registry, id)
        return { ok: true, message: `已清理会话 ${id} 的记账记录` }
      }
      if (header.origin === 'subagent') return { ok: false, message: '子代理会话不能直接删除' }
      // 删文件:locate 用完整 header(cwd 参与路径计算),另加 <DSH_HOME>/sessions
      // 扫描兜底——只信 locate 会"删掉一个不存在的目录、文件还在、会话复活"。
      const removeError = await this.removeSessionFiles(persistence, header)
      if (removeError !== undefined) return { ok: false, message: removeError }
      let warning = ''
      if (registry !== undefined) warning = await this.forgetSessionCompat(registry, id)
      try {
        const domain = this.storageDomainFace?.get('session_projcache')
        if (domain) await domain.table('sessions').delete(id)
      } catch { /* a stale cache row is harmless */ }
      // Drop any idle in-memory attachment so the sidebar row disappears
      // immediately: DSH has no public close API, so use the store's own
```

</details>

**依据 3 · 源码核查**：[src/index.ts:3489-3497](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L3489-L3497)

级联计数

```text
        await this.purgeSubagent(d.id, d.header)
        removedDescendants++
      }
      return { ok: true, message: `已删除会话 ${id}${removedDescendants > 0 ? ` 及其 ${removedDescendants} 个子代理` : ''}${warning ? '。' + warning : ''}` }
    } catch (err) {
      return { ok: false, message: String((err as { message?: string })?.message || err) }
    }
  }

```

**依据 4 · 源码核查**：[src/index.ts:3506-3532](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L3506-L3532)

locate扫描及错误返回

<details>
<summary>查看原文（27行）</summary>

```text
  private async removeSessionFiles(
    persistence: { locate(header: { id: string }): { kind: string; path: string } | undefined },
    header: StoredSessionHeader,
  ): Promise<string | undefined> {
    const targets = new Set<string>()
    try {
      const loc = persistence.locate(header)
      if (loc !== undefined && loc.path) targets.add(dirname(loc.path))
    } catch { /* locate 不存在/抛错 → 交给扫描兜底 */ }
    try {
      const root = join(await this.getHome(), 'sessions')
      if (existsSync(root)) {
        for (const sub of readdirSync(root)) {
          const dir = join(root, sub, header.id)
          if (existsSync(dir)) targets.add(dir)
        }
      }
    } catch { /* 扫描失败不影响 locate 结果 */ }
    if (targets.size === 0) return undefined
    let failed: string | undefined
    for (const dir of targets) {
      try { rmSync(dir, { recursive: true, force: true }) } catch (err) {
        failed = `删除会话文件失败:${(err as { message?: string })?.message || String(err)}`
      }
    }
    return failed
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:3567-3629](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L3567-L3629)

后代遍历与尽力删除

<details>
<summary>查看原文（63行）</summary>

```text
  private async subagentDescendants(rootId: string): Promise<Array<{ id: string; header: { id: string; origin?: string } }>> {
    const persistence = this.persistenceFace
    if (!persistence) return []
    const headers = (await persistence.list()).map(listHeader)
      .filter((h): h is StoredSessionHeader => h !== undefined)
    const childrenOf = new Map<string, Array<{ id: string; header: { id: string; origin?: string } }>>()
    for (const h of headers) {
      if (h.origin !== 'subagent') continue
      const pid = h.parentSession
      if (!pid) continue
      const list = childrenOf.get(pid) ?? []
      list.push({ id: h.id, header: h })
      childrenOf.set(pid, list)
    }
    const out: Array<{ id: string; header: { id: string; origin?: string } }> = []
    const seen = new Set<string>([rootId])
    const queue = [...(childrenOf.get(rootId) ?? [])]
    while (queue.length) {
      const node = queue.shift()!
      if (seen.has(node.id)) continue
      seen.add(node.id)
      out.push(node)
      for (const child of childrenOf.get(node.id) ?? []) queue.push(child)
    }
    return out
  }

  /** 删除一个子代理会话(文件 + 记账 + 内存),尽力而为,单个失败不中断级联。 */
  private async purgeSubagent(id: string, header: StoredSessionHeader): Promise<void> {
    const agents = this.agentsFace
    const agent = agents ? agents.get(id) : undefined
    if (agent !== undefined) {
      try {
        if (agent.ctx && typeof agent.ctx.dispose === 'function') agent.ctx.dispose()
      } catch { /* 继续删文件/记账 */ }
    }
    const persistence = this.persistenceFace
    if (persistence !== undefined) await this.removeSessionFiles(persistence, header)
    const registry = this.workspaceRegistryFace
    if (registry !== undefined) await this.forgetSessionCompat(registry, id)
    try {
      const domain = this.storageDomainFace?.get('session_projcache')
      if (domain) await domain.table('sessions').delete(id)
    } catch { /* 残留缓存行无害 */ }
    const sessionsStore = this.ctx.get('sessions') as { get(sessionId: string): unknown; store?: Map<string, unknown> } | undefined
    const liveSession = sessionsStore ? sessionsStore.get(id) : undefined
    if (liveSession !== undefined && sessionsStore?.store !== undefined) {
      try {
        sessionsStore.store.delete(id)
        ;(this.ctx as unknown as { emit(event: string, payload: unknown): void }).emit('session/disposed', liveSession)
        const agentsRegistry = this.ctx.get('agents') as { get(sessionId: string): unknown; store?: Map<string, unknown> } | undefined
        const liveAgent = agentsRegistry ? agentsRegistry.get(id) : undefined
        if (liveAgent !== undefined && agentsRegistry?.store !== undefined) {
          agentsRegistry.store.delete(id)
          ;(this.ctx as unknown as { emit(event: string, payload: unknown): void }).emit('agent/disposed', liveAgent)
        }
      } catch { /* best effort */ }
    }
  }

  /**
   * The "installed" filter is served by this endpoint instead of paging
   * through star-sorted search results: every installed plugin with a known
```

</details>

#### 缺口

- 宿主路径和活动后代停止/磁盘故障实际行为未知
  **影响**：部分成功可造成不可恢复丢失或遗留资源
  **进一步探讨**：仅副本会话故障注入，导出后确认父子idle再考虑删除

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 修复、令牌、启动与退出有哪些真实副作用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要DSH Web remote服务、本地profile可写、pnpm/git/curl等；Windows隐藏子进程另走node spawn，仍是系统权限下包安装。repair可先corepack enable或npm install -g pnpm，清无bundle启用项、启用已安装第三方bundle、补client insert、删除重复patch行、pnpm install补依赖，因此不是只诊断，也可能重新启用刻意禁用的包。配置修复局部读回校验，不能概括为全局原子。

GitHub读取可先镜像返回200/404，再直连/代理；安装另有镜像链，第三方镜像进入供应链但未做哈希来源核验。GitHub token由env→profile JSON→git credential helper缓存获取，配置setToken明文存zat-market.json；认证API固定api.github.com，starToggle另有外部账户写操作，用户搜索不等于授权star。报告不重复易变配额。

试用只在可丢弃profile先浏览缓存与查询，独立备份三配置文件、skills和会话，不点repair/delete/star、不填生产token；再逐项审查一个扩展构建脚本和真实来源后决定安装。安装和卸载大多需重启DSH，UI刷新不证明宿主已切换；自身不能从市场卸载，按官方CLI移除。退出确认后台任务完成后重启、备份需要的配置/技能/会话，再清本地token和凭据缓存源；包脚本、全局pnpm与会话删除的副作用需独立处理。未测安装耗时、磁盘量和供应链成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:4056-4073](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4056-L4073)

repair可装全局pnpm

<details>
<summary>查看原文（18行）</summary>

```text
  async repair(): Promise<JsonObject> {
    const fixed: string[] = []
    const remaining: string[] = []
    try {
      const dir = await this.getProfileDir()
      const p = await this.readProfile()
      const deps = Object.keys((p.dependencies || {}) as Record<string, string>)
      const profile = ((p.dsh as JsonObject | undefined)?.profile || {}) as JsonObject
      let bundles = Array.isArray(profile.bundles) ? [...(profile.bundles as string[])] : []
      // 0) 没 pnpm 就先装:corepack enable 优先(快、不联网),不行再 npm i -g pnpm。
      if (!(await this.pnpmAvailable())) {
        let installed = false
        for (const cmd of ['corepack enable', 'npm install -g pnpm']) {
          const r = await this.runShell(cmd)
          if (r.outcome.exitCode === 0) { installed = true; break }
        }
        if (installed && await this.pnpmAvailable()) fixed.push('已装好 pnpm')
        else remaining.push('没装 pnpm,本机也装不了(corepack/npm 都没有);请先装 Node.js 再点一次。')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:4098-4137](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4098-L4137)

repair启用已装及client插入

<details>
<summary>查看原文（40行）</summary>

```text
      }
      // 1) 装了但没启用的第三方 bundle 插件 → 启用(client-only 插件跳过,市场不自动塞)。
      const toEnable: string[] = []
      for (const name of deps) {
        if (name.startsWith('@deepseek-ai/')) continue
        if (bundles.includes(name)) continue
        if (!(await this.isBundlePackage(name))) continue
        toEnable.push(name)
      }
      if (toEnable.length > 0) {
        const snap = await this.snapshotProfile(dir)
        p.dsh = p.dsh || {}
        ;(p.dsh as JsonObject).profile = (p.dsh as JsonObject).profile || {}
        ;((p.dsh as JsonObject).profile as JsonObject).bundles = [...bundles, ...toEnable]
        await this.writeProfile(p)
        try {
          const check = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as JsonObject
          const checkBundles = ((check.dsh as JsonObject | undefined)?.profile as JsonObject | undefined)?.bundles
          if (!Array.isArray(checkBundles) || !toEnable.every((n) => checkBundles.includes(n))) throw new Error('bundles not persisted')
          fixed.push(`已启用 ${toEnable.join('、')}`)
        } catch {
          await this.restoreProfile(dir, snap)
          remaining.push('启用插件失败,已还原;请重启 dsh 后重试。')
        }
      }
      // 1.5) client-only 插件(主题/UI)没注册 insert → 自动注册,重启即生效。
      const clientNames = await this.clientInsertNames()
      const clientToInsert: string[] = []
      for (const name of deps) {
        // 注意:不能按 `@deepseek-ai/` 前缀跳过 —— 有些第三方主题(如 Aqua)故意
        // 借官方 scope 命名,跳过会让"一键修复"漏掉它们。isClientOnlyPackage
        // 已经只对真正的 client-only 插件放行。
        if (bundles.includes(name)) continue
        if (clientNames.has(name)) continue
        if (await this.isClientOnlyPackage(name)) clientToInsert.push(name)
      }
      for (const name of clientToInsert) {
        await this.upsertClientInsert(name)
        fixed.push(`已注册 ${name}(主题/界面插件,自动写入 cordis.patch.yml)`)
      }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:4141-4193](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4141-L4193)

修patch及补依赖

<details>
<summary>查看原文（53行）</summary>

```text
      if (ownedIds.size > 0) {
        const patches = await this.readPatches()
        let removedAny = false
        const removedIds: string[] = []
        const cleaned = patches.map((patch) => {
          if (!patch || typeof patch !== 'object') return patch
          const insert = (patch as { insert?: unknown[] }).insert
          if (!Array.isArray(insert)) return patch
          const kept = insert.filter((row) => {
            if (!(row && typeof row === 'object')) return true
            const rid = (row as { id?: unknown }).id
            if (typeof rid === 'string' && ownedIds.has(rid)) { removedIds.push(rid); removedAny = true; return false }
            return true
          })
          ;(patch as { insert: unknown[] }).insert = kept
          return patch
        }).filter((patch) => {
          if (!patch || typeof patch !== 'object') return true
          const insert = (patch as { insert?: unknown[] }).insert
          const hasOtherKeys = Object.keys(patch as object).some((k) => k !== 'insert')
          if (!Array.isArray(insert)) return true
          if (insert.length === 0 && !hasOtherKeys) return false
          return true
        })
        if (removedAny) {
          await this.writePatches(cleaned)
          fixed.push(`已删掉 cordis.patch.yml 里手抄重复的挂载行 id:${[...new Set(removedIds)].join('、')}(插件自带补丁会自动挂载)`)
        }
      }
      // 2) 缺失的 peer 依赖 / 缺包文件 → pnpm install 一次补全。
      const missingPeers = new Set<string>()
      let missingPkg = false
      for (const name of deps) {
        try {
          const meta = JSON.parse(readFileSync(join(dir, 'node_modules', name, 'package.json'), 'utf8')) as { peerDependencies?: Record<string, string>; peerDependenciesMeta?: Record<string, { optional?: boolean }> }
          for (const pd of Object.keys(meta.peerDependencies || {})) {
            if (meta.peerDependenciesMeta?.[pd]?.optional) continue
            if (pd.startsWith('@deepseek-ai/')) continue
            if (!(await this.moduleProvided(pd))) missingPeers.add(pd)
          }
        } catch { missingPkg = true }
      }
      if (missingPeers.size > 0 || missingPkg) {
        const r = await this.pnpmShell('pnpm install', dir)
        if (r.outcome.exitCode === 0) {
          fixed.push('已补装缺失依赖' + (missingPeers.size ? `:${[...missingPeers].join('、')}` : ''))
        } else {
          remaining.push(`依赖补装失败(网络或 pnpm 问题):${[...missingPeers].join('、') || '缺包文件'}。开代理后再点一次,或手动 dsh plugin add。`)
        }
      }
      this.invalidateListCache()
      // 修完再查一遍:把仍然存在、且修不了的问题,原样列给用户(详情在体检报告里)。
      const hc = await this.healthCheck()
```

</details>

**依据 4 · 源码核查**：[src/index.ts:2188-2205](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2188-L2205)

镜像优先读取

<details>
<summary>查看原文（18行）</summary>

```text
  private async ghGet(url: string): Promise<{ status: number; body: string; error?: string }> {
    let lastError = ''
    // 镜像优先:这台机器直连 GitHub 被墙、VPN 代理又可能"连着但超时",gh-proxy 镜像
    // 是不依赖 VPN 的稳路。直接 curl 镜像(不走那个可能超时的代理),4s 超时,连不通立刻换直连/代理。
    // 注意:只有 200 和 404 才算镜像的"确定答案";502/503/504(网关错误)、403/429
    // (限流/风控)都不是确定答案——直接返回会让自更新检查、列表、详情等静默失败。
    if (!this.mirrorDown) {
      const mr = await this.curlGet(MIRROR + url, null, '4')
      if (mr.status === 200) return mr
      if (mr.status === 404) return mr
      lastError = mr.error || ('mirror status ' + mr.status)
      this.mirrorDown = true
    }
    const r = await this.httpGet(url)
    if (r.status === 200) { this.mirrorDown = false; return r }
    if (r.status >= 400) return r
    return { status: 0, body: '', error: r.error || lastError }
  }
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4219-4231](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4219-L4231)

认证API固定目的地

<details>
<summary>查看原文（13行）</summary>

```text
  private async ghApi(method: string, path: string, token?: string): Promise<{ status: number; body: string; error?: string }> {
    const proxy = this.proxyDown ? null : await this.loadProxy()
    const proxyArgs = proxy ? ['--proxy', proxy] : []
    let curl = 'curl'
    try { curl = await this.subprocess.resolveExecutable('curl') } catch { curl = '' }
    if (!curl) return { status: 0, body: '', error: 'curl not available' }
    const argv = [curl, ...proxyArgs, '-s', '-L', '--max-time', '5', '-w', '\n%{http_code}', '-H', 'User-Agent: zat-dsh-engine/0.3.1', '-H', 'Accept: application/vnd.github+json', '-X', method]
    if (token) argv.push('-H', `Authorization: Bearer ${token}`)
    argv.push('https://api.github.com' + path)
    const handle = await this.winHiddenSpawn(argv, { graceMs: 60000 })
    const outcome = await handle.done
    let stdout = ''
    let stderr = ''
```

</details>

**依据 6 · 源码核查**：[src/index.ts:4276-4303](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4276-L4303)

token来源及缓存

<details>
<summary>查看原文（28行）</summary>

```text
  private async resolveConfiguredToken(): Promise<string | null> {
    try {
      const envTok = process.env.GITHUB_TOKEN || process.env.GH_TOKEN
      if (envTok && envTok.trim()) return envTok.trim()
      const dir = await this.getProfileDir()
      const cfg = JSON.parse(readFileSync(join(dir, 'zat-market.json'), 'utf8')) as JsonObject
      if (typeof cfg.githubToken === 'string' && cfg.githubToken.trim()) return cfg.githubToken.trim()
    } catch { /* no config */ }
    return null
  }

  /** Resolve a GitHub token: env → local profile config → git credential helper (non-interactive). Cached. */
  private resolveToken(): Promise<string | null> {
    if (this.tokenResolved) return Promise.resolve(this.tokenValue)
    if (this.tokenPromise) return this.tokenPromise
    this.tokenPromise = (async () => {
      try {
        const configured = await this.resolveConfiguredToken()
        if (configured) return configured
        return await this.gitCredentialToken()
      } catch { return null }
    })().then((t) => {
      this.tokenValue = t
      this.tokenResolved = true
      return t
    })
    return this.tokenPromise
  }
```

</details>

**依据 7 · 源码核查**：[src/index.ts:4365-4381](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L4365-L4381)

token明文写配置

<details>
<summary>查看原文（17行）</summary>

```text
  async setToken(token: string): Promise<JsonObject> {
    try {
      const t = String(token || '').trim()
      if (t.length > 200) return { ok: false, message: 'token too long' }
      const dir = await this.getProfileDir()
      const cfgPath = join(dir, 'zat-market.json')
      let cfg: JsonObject = {}
      try { cfg = JSON.parse(readFileSync(cfgPath, 'utf8')) as JsonObject } catch { /* new file */ }
      if (t) { cfg.githubToken = t } else { delete cfg.githubToken }
      await this.writeFileText(cfgPath, JSON.stringify(cfg, null, 2))
      this.tokenValue = null
      this.tokenResolved = false
      this.tokenPromise = null
      return { ok: true, hasToken: Boolean(t), message: t ? 'Token 已保存(只存在本机 profile 目录的 zat-market.json,不会上传)' : 'Token 已清除' }
    } catch (err) {
      return { ok: false, message: String((err as { message?: string })?.message || err) }
    }
```

</details>

**依据 8 · 源码核查**：[src/index.ts:3270-3282](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L3270-L3282)

核心与自身卸载拒绝

<details>
<summary>查看原文（13行）</summary>

```text
  async uninstall(name: string): Promise<JsonObject> {
    const n = safePackageName(name)
    if (!n) return { ok: false, message: 'invalid package name' }
    // Official Web-runtime core components are the GUI itself — refuse.
    if (isCoreComponent(n)) {
      return { ok: false, message: `${n} 是 dsh Web GUI 的运行时组件,不能卸载(卸了界面就没了)。这是显示为"已安装"的系统组件,不是市场装的插件。` }
    }
    // The market must not delete itself: even if a client finds a way past the
    // hidden card, the host refuses. Removal stays possible via the official CLI.
    if (n === 'zat-dsh-engine') {
      return { ok: false, message: '市场不能卸载自己,已阻止。如需移除,请用官方命令: dsh plugin --profile <你的profile> remove zat-dsh-engine' }
    }
    // 技能(skill)卸载:按 owner/repo 从技能清单里删目录,立即生效。
```

</details>

#### 缺口

- 真实宿主remote权限及镜像/安装兼容、任务停止未运行
  **影响**：不适合未经授权的共享宿主自动变更
  **进一步探讨**：仅独立profile核权限和真实写入，再逐项批准扩展操作

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 显式构建授权能否降低误装代价？

**研究主题**：新假设与验证

#### 完整回答

当前已有元数据拦截和风险警告，候选不是重新增加扫描器，而是在自动allowBuilds前显示确切将运行脚本及安装源，并要求与当前版本绑定的选择。比较现有自动放行与确认版在无构建、prepare联网、镜像变更和HEAD更新下的用户理解、误装率与完成时间。若确认仅被机械跳过、脚本仍可由传递依赖改变或显著阻碍可信包使用，则改版不支持收益结论。单独确认不能替代沙箱、审计或包版本固定。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2430-2440](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L2430-L2440)

构建自动放行

<details>
<summary>查看原文（11行）</summary>

```text
    const npmSource = analysis.npmName || null
    const warnings = analysis.warn.length > 0 ? analysis.warn.join('; ') : undefined
    this.invalidateListCache()
    const snap = await this.snapshotProfile(dir)
    // 带构建脚本的 git 插件会被 pnpm 默认拦掉:先把包名放进 allowBuilds,争取一次装成。
    if (analysis.name && hasBuildScript(analysis.scripts)) {
      await this.ensureAllowBuilds(analysis.name)
    }
    if (taskId) {
      this.setTaskStep(taskId, 'download', npmSource ? `正在从 npm 下载 ${npmSource}…` : '正在下载安装包…')
      this.setTaskProgress(taskId, 12, npmSource ? `正在从 npm 下载 ${npmSource}…(已进行 0 秒)` : '正在下载安装包…(已进行 0 秒)')
```

</details>

**依据 2 · 源码核查**：[src/index.ts:1539-1551](https://github.com/mishibeikejie/zat-dsh-engine/blob/11d5b5fb424b6d9dee7821c7c2f771bd42e7f46a/src/index.ts#L1539-L1551)

安全只警告

<details>
<summary>查看原文（13行）</summary>

```text
    } catch { /* best effort */ }
    // (6) 安全扫描是启发式检测,会误伤正经插件(比如"发通知到 Discord/Telegram"
    // 的插件就会命中 webhook/机器人钩子)。所以只提示、不拦截:用户装前能看见,
    // 装不装自己定。真正的硬拦截交给上面的客观项(官方包写错/入口缺失/系统不支持)。
    for (const sec of scanSecurity(f.hostText, '宿主代码')) {
      warn.push(`安全提示:${sec.title}`)
    }
    for (const sec of scanSecurity(f.clientText, '界面代码')) {
      warn.push(`安全提示:${sec.title}`)
    }
    return { block, warn, usage: describeUsage(f.hostText, f.clientText), name: meta.name, scripts: meta.scripts, npmName }
  }

```

</details>

#### 缺口

- 用户是否阅读授权与成本未知
  **影响**：增加摩擦不一定改善供应链风险
  **进一步探讨**：固定版本副本任务做构建源理解对照

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
