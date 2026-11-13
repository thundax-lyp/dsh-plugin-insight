# dsh-plugin-marketplace

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[5058287](https://github.com/AwesomeHou/dsh-plugin-marketplace/tree/50582874c5f28c373d785b187766600f52b0ed5e)

<!-- BEGIN META -->
[![GitHub ★ 34](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=34&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/AwesomeHou/dsh-plugin-marketplace) [![npm 30d 10,880](https://img.shields.io/static/v1?label=npm+30d&message=10%2C880&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-marketplace)
<!-- END META -->

> **功能**：在 DeepSeek Harness Web 浏览 GitHub 插件候选，并管理 profile 插件安装与更新。

> **亮点**：[Q01](#research-q01) 连接搜索、异步进度与配置管理，让用户在一个设置页观察发现和状态。

> **主要限制**：[Q02](#research-q02) 找到 spec 进入 shell 的解释风险、同名 npm 来源替代和部分写入风险。

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
  - [Q01 · 市场列表和安装动作各自读取什么并返回什么？](#detail-section-11)
  - [Q02 · 搜索结果进入安装时，宿主把信任交给了哪些输入？](#detail-section-12)
  - [Q03 · 如何观察发现能力，并验证改为可审计安装是否有效？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护 DSH Web 第三方插件的用户可以浏览 GitHub 话题结果和已装清单。

打开候选仓库并按固定版本手工核对，然后使用现有 CLI 安装和回读配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 市场发现 | 按 topic 和关键词浏览 | 范围随 GitHub API |
| 任务管理 | 观察安装状态及维护 | 写操作需要来源和参数验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web、tools、计时服务 | 是 | 挂载设置与 API | 保持 CLI |
| GitHub API 与网络 | 发现需要 | 搜索仓库和版本 | 改为手工核查 |
| 受控 profile、Git/pnpm 与来源确认 | 写操作需要 | 安装和构建 | 保持只读观察 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 浏览 | 用户在隔离环境查看市场 | 回查仓库固定版本 |
| 观察状态 | 查看已装和任务状态 | 不能核实来源时保持只读 |
| 退出 | 停用市场并回到 CLI | 核对 profile 和遗留依赖 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和工具链，费用未知 | 准备隔离环境与可信来源 | 兼容待验 |
| 持续 | API、Git 和包下载成本未知 | 复核版本、依赖和任务状态 | 构建耗时未知 |
| 失败恢复 | 重试、重建及缓存 | 检查部分写入并回读配置 | 回滚实际效果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 候选发现 | Topic 分页和搜索缓存 | 全量覆盖与可安装比例 |
| 安装进度 | 任务 ID、状态及超时策略 | 取消和恢复结果 |
| 维护集中 | 设置页签与宿主操作 | 常用环境授权边界 |

> **思考**：[Q02](#research-q02) 找到 spec 进入 shell 的解释风险、同名 npm 来源替代和部分写入风险。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 连接搜索、异步进度与配置管理，让用户在一个设置页观察发现和状态。

[Q02](#research-q02) 的 shell 字符串解释和多包阶段状态值得优先拆分验证，任务回执仍需与持久状态核对。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 找到 spec 进入 shell 的解释风险、同名 npm 来源替代和部分写入风险。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 先隔离观察只读能力，按 [Q02](#research-q02) 回避未核实写路径；需装固定版本时沿用已审查 CLI。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认市场与安装路径。真实宿主授权、加载、兼容与恢复尚待验证。

- 已检查：作者 README、包清单、源码路径 README.md、lib/client.js、lib/index.js 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查固定市场宿主与客户端、发现、安装参数和任务关键链；未执行目标代码、shell、安装或宿主。
- 下一步：隔离核对只读列表、固定来源、argv 字面性、暂停与取消后的部分状态及卸载。

**分析版本**

- **仓库**：[AwesomeHou/dsh-plugin-marketplace](https://github.com/AwesomeHou/dsh-plugin-marketplace)
- **版本号**：0.3.3（[固定提交 5058287](https://github.com/AwesomeHou/dsh-plugin-marketplace/tree/50582874c5f28c373d785b187766600f52b0ed5e)）
- **版本日期**：2026-09-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 提出用固定来源和 argv 展示完成用户核准，并记录逐包结果。

隔离核对只读列表、固定来源、argv 字面性、暂停与取消后的部分状态及卸载。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 2 | 3095 | 2436 | 575 | — |
| .md | source | 2 | 189 | — | — | 3043 |
| .mjs | test | 7 | 977 | 729 | 168 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AwesomeHou/dsh-plugin-marketplace/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/AwesomeHou/dsh-plugin-marketplace/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/AwesomeHou/dsh-plugin-marketplace/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：插件市场怎样将 GitHub 发现和 profile 安装连接起来，哪些边界使安装需要继续通过可审查的 CLI 流程？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场列表和安装动作各自读取什么并返回什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

在 Web 上维护第三方插件的用户可在两个设置页签发现候选、查看现有插件，并发起安装。宿主搜索按 GitHub topic 及词分页，缓存查询组合并返回仓库与描述；列表本身没有逐项检查真实 bundle。安装 POST 读取 spec，创建 job 并回传 ID，客户端可查状态。宿主根据 GitHub 根清单的声明选择常规安装或 checkout/workspace 构建链接；常规路径安装后检查新增依赖的可加载条件。与逐个开仓库、手写 CLI 相比，差异在把发现、任务进度、安装和维护集中在设置页，GitHub 数据和安装器能力来自上游。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:15-29](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/README.md#L15-L29)

作者描述搜索、任务与工作区。

<details>
<summary>查看原文（15行）</summary>

```text
## 功能

- **全量分页** — 完整 topic 按页拉取（默认 50 / 最大 100），UI 带"加载更多"按钮。不再有"只看 50 个"的硬限制：`total` 反映真实的 `total_count`。
- **搜索** — 关键词搜索走 GitHub 自己的 `q`（所以是在**整个 topic** 里搜，而不是只在已加载的页里过滤），UI 搜索框和 `market_search` 工具都用它。
- **Agent 工具**（Host 侧通过 `ctx.tools.register` 注册）：
  - `market_search(q?, page?, perPage?)` — 返回 topic 仓库的 JSON 列表（full name、star、语言、简介、URL）。
  - `market_install(spec)` — 通过 `dsh plugin --profile web add -w <spec>` 安装到 `web` profile。执行前会校验 spec 是否含 shell 元字符；完成后提示需要重启 harness。
  - `market_installed()` — 列出 `web` profile 已安装的**第三方**插件：启用状态、当前版本、最新版本与是否可更新（含市场自身的更新状态）。内置插件不在此列。
  - `market_update(name)` — 把某个已安装插件更新到最新版本（需重启 harness 生效）。
- **安装（默认：直装，优先 npm 包）** — 每个插件卡片都有 **安装** 按钮，点击后通过 `POST /api/market/install` 启动**确定性的异步安装任务**：host 侧 `planInstall` 先探测仓库形态——根 `package.json` 声明了 `dsh.bundle`/`dsh.client` 的**根级插件**走标准 `dsh plugin add -w <spec>`；**已发布到 npm 的插件优先用 `name@<latest>` 装 npm 版**（快、稳、免 GitHub 拉取，pnpm 把插件及运行时依赖如 `ws`/`node-pty` 一起装进 profile）；未发布到 npm 的用 github spec；monorepo/workspace 根则克隆到 `$DSH_HOME/marketplace-src`、corepack pnpm 构建后 `link:` 注册（沙箱内自带 node_modules，依赖可解析）。装完做**真实结果校验**（进入 `dsh.profile.bundles`、入口文件存在、**运行时依赖可解析**——后一条专门防“link 缺依赖导致启动失败”的历史回归）。**注意：不能用 `link:` 装根级插件**。卡片内联渲染 App Store 式进度条（阶段 / 百分比 / 已下载 / 速度 / ETA / 实时日志），可取消。
- **pnpm 兼容层（借鉴 dsh-market）** — 所有安装子进程注入 `CI=true`（pnpm ≥10 无 TTY 时不再无限等交互提示而卡死，遇错直接报错）；检测到 **pnpm 大版本漂移**（`ERR_PNPM_VIRTUAL_STORE_DIR_MAX_LENGTH_DIFF` / `PUBLIC_HOIST_PATTERN_DIFF`，即 modules 目录由别的 pnpm 大版本创建）会**自动 `pnpm install` 重建 modules 目录并重试一次**。失败分类 `classifyPnpmFailure` 覆盖：预发布 peer 解析、构建脚本拦截（`IGNORED_BUILDS`/`GIT_DEP_PREPARE_NOT_ALLOWED`）、幽灵依赖 404、发布新鲜度等待期、workspace 缺失、pnpm 缺失等，统一给**可操作文案**而不是裸报错。
- **安装卡住自动止损** — pnpm / git 在死网络或过慢的下载上可能**零输出挂死**（例如 GitHub 暂不可达时停在"正在解析依赖… 8%"）。host 侧带**停滞看门狗**：一段时间（默认 120s，可用 `DSH_MARKET_STALL_MS` 覆盖）没有任何进度（无输出行、无字节增长）就杀掉进程树 → 自动**直连重试一次**（去掉字节统计代理）→ 若再次停滞则**快速失败**并提示「检查网络后重试，或改用「让 agent 安装」」，不再无限转圈等到 10 分钟超时。
- **对等依赖失败识别** — 若插件声明了 `@deepseek-ai/*@^0.1.0-rc.6` 这类**预发布对等依赖**，`dsh plugin add` 可能以 `ERR_PNPM_NO_MATCHING_VERSION` 退出。host 侧会识别并给出**可操作的说明**（而不是裸的 "exit 1"），卡片同时提供 **「让 agent 安装」** 兜底按钮——agent 会按仓库 README / 安装脚本处理这类结构。
- **workspace 缺失的友好报错** — host 侧在安装/更新前检查 web profile：`package.json` 或 `pnpm-workspace.yaml` 缺失时，`market_install` / `/api/market/install` 会返回可操作的错误信息（告诉用户如何创建 `pnpm-workspace.yaml` 或重新初始化 profile），而不是 pnpm 那种晦涩的 `--workspace-root may only be used inside a workspace`。
- **agent 安装方案（兜底，专属工作区新开对话）** — 当直装失败时（尤其对等依赖 / 非标准结构场景），卡片上会出现 **「让 agent 安装」** 按钮。点击后 host 会确保一个**专属安装工作区**（`$DSH_HOME/marketplace-install`，经 `GET /api/market/install-workspace` 暴露），client 通过 runtime 的 `workspaces.create` / `sessions.create` / `sessions.open` 在该工作区**新开一个对话**并切过去，再把固定提示词 `session.prompt` 发给那个会话——由 agent 读 README 并自行决定安装方式，**不污染当前会话、无需手动选工作区**。若 runtime 服务不可用则回退为发给当前会话。代码在 `lib/client.js` 的 `installViaAgent`。更新/停用/卸载仍走 host 接口（`/api/market/update` 等）。
```

</details>

**依据 2 · 源码核查**：[lib/client.js:985-1003](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/client.js#L985-L1003)

Web 设置页签注册。

<details>
<summary>查看原文（19行）</summary>

```text
    function apply(ctx) {
      clientCtx = ctx
      ctx.effect(function () { ctx.locale.register(LOCALE_NS, MARKET_LOCALES) }, 'marketplace: dictionaries')
      T = ctx.locale.bind(LOCALE_NS)
      ctx.slots.inject('settings.plugins.tab', function () {
        return ctx.slots.register(
          { name: 'settings.plugins.tab', id: 'market', order: 5, label: function () { return T("marketTitle") } },
          MarketTab,
        )
      })
      ctx.slots.inject('settings.plugins.tab', function () {
        return ctx.slots.register(
          { name: 'settings.plugins.tab', id: 'installed', order: 6, label: function () { return T("installedTitle") } },
          InstalledTab,
        )
      })
    }

    exports.inject = inject
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1565-1599](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1565-L1599)

GitHub 搜索及缓存。

<details>
<summary>查看原文（35行）</summary>

```text
    async function fetchPage(q, page, perPage) {
      const params = new URLSearchParams({ q, per_page: String(perPage), page: String(page) })
      params.set('sort', 'stars')
      params.set('order', 'desc')
      const url = `${GITHUB_API}?${params.toString()}`
      const res = await fetch(url, {
        headers: { 'Accept': 'application/vnd.github+json', 'User-Agent': 'dsh-plugin-marketplace' },
        signal: AbortSignal.timeout(25000),
      })
      if (!res.ok) throw new Error(`GitHub API responded ${res.status}`)
      const data = await res.json()
      return {
        items: (Array.isArray(data.items) ? data.items : []).map((it) => ({
          fullName: String(it.full_name || ''),
          url: String(it.html_url || ''),
          description: String(it.description || ''),
          stars: typeof it.stargazers_count === 'number' ? it.stargazers_count : 0,
          language: String(it.language || ''),
          updatedAt: String(it.updated_at || ''),
          homepage: String(it.homepage || ''),
        })),
        total: typeof data.total_count === 'number' ? data.total_count : 0,
      }
    }

    async function ensurePage(q, page, perPage, force = false) {
      const key = `${q}|${page}|${perPage}`
      const cached = pageCache.get(key)
      const fresh = cached && Date.now() - cached.fetchedAt < REFRESH_MS
      if (!force && fresh) return cached
      const fetched = await fetchPage(q, page, perPage)
      const record = { ...fetched, fetchedAt: Date.now() }
      pageCache.set(key, record)
      if (!q) lastSync = Date.now()
      return record
```

</details>

**依据 4 · 源码核查**：[lib/index.js:1016-1044](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1016-L1044)

根清单分类和包来源选择。

<details>
<summary>查看原文（29行）</summary>

```text
async function planInstall(spec) {
  const gh = githubSpec(spec)
  if (!gh) return { type: 'standard' }
  try {
    const [owner, repo] = gh.split('/')
    const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`, {
      headers: { 'User-Agent': 'dsh-plugin-marketplace' },
      signal: AbortSignal.timeout(20000),
    })
    if (res.ok) {
      const pkg = await res.json()
      const isPlugin = !!(pkg && pkg.dsh && (pkg.dsh.bundle?.patch !== undefined || pkg.dsh.client !== undefined))
      if (isPlugin) {
        // 根级插件走标准 `dsh add -w <target>`：pnpm 会把插件及其运行时依赖
        // （ws、node-pty 等）一起装进 profile，保证 harness 启动时 require() 能解析。
        // 注意：不能改成 link 安装——link 只挂目录、不装依赖，插件运行时 require
        // 不到 ws 等包，harness 会启动失败（历史教训）。
        // 已发布到 npm 的插件优先装 npm 版（快、稳、免 GitHub），否则用 github spec。
        const pkgName = pkg && typeof pkg.name === 'string' ? pkg.name : null
        if (pkgName) {
          const npmSpec = await publishedSpec(pkgName)
          if (npmSpec) return { type: 'standard', gh, spec: npmSpec }
        }
        return { type: 'standard', gh, spec }
      }
      return { type: 'workspace', gh }
    }
  } catch { /* pre-check failed — fall back to standard add + verify */ }
  return { type: 'standard', gh, spec }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1655-1677](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1655-L1677)

发起安装和回读 job 状态。

<details>
<summary>查看原文（23行）</summary>

```text
    // ── POST /api/market/install — start an async install job ────────────
    const installHandler = async (req, res) => {
      try {
        if ((req.method || 'GET').toUpperCase() !== 'POST') { json(res, 405, { ok: false, error: 'method not allowed' }); return }
        const body = await readJsonBody(req)
        const spec = String((body && body.spec) || '').trim()
        const started = startInstall(spec)
        if (started.error) { json(res, 400, { ok: false, error: started.error }); return }
        json(res, 202, { ok: true, jobId: started.job.id })
      } catch (e) {
        json(res, 500, { ok: false, error: String((e && e.message) || e) })
      }
    }

    // ── GET /api/market/install/status?job=<id> — poll job progress ──────
    const installStatusHandler = async (req, res) => {
      try {
        const url = new URL(req.url ?? '/', 'http://localhost')
        const jobId = url.searchParams.get('job') || ''
        const job = JOBS.get(jobId)
        if (!job) { json(res, 404, { ok: false, error: 'job not found', done: true }); return }
        json(res, 200, { ok: true, job: snapshotOf(job) })
      } catch (e) {
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1210-1235](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1210-L1235)

标准安装及新增依赖的检查。

<details>
<summary>查看原文（26行）</summary>

```text
    } else if (job.kind === 'install') {
      const plan = await planInstall(job.spec)
      if (plan.type === 'workspace' && plan.gh) {
        // workspace root repo → install its real plugin sub-package(s)
        r = await installWorkspacePlugin(job, plan.gh, env, onLine)
      } else {
        const target = plan.spec || job.spec
        job.depsBefore = Object.keys((profileManifest() && profileManifest().dependencies) || {})
        r = await addStep(['add', '-w', target])
        if (!r.ok && job.proxy && !job.canceled && !job.timedOut) r = await directRetry(job, ['add', '-w', target], onLine)
        r = await recoverHoist(r, target)
        if (r.ok) {
          // Verify the install actually produced a loadable plugin: in bundles,
          // entry artifact present, AND runtime deps resolvable — the latter
          // catches the "bare link without deps" class that would fail at boot.
          const deps = (profileManifest() && profileManifest().dependencies) || {}
          const added = Object.keys(deps).filter((n) => !job.depsBefore.includes(n))
          const bad = added.filter((n) => !pluginLoadable(n) || !runtimeDepsReachable(n))
          if (bad.length > 0) {
            // cleanup the useless plain dependency, then try the workspace path
            for (const n of bad) { try { await runDshSimple(['remove', n]) } catch { /* best effort */ } }
            if (plan.gh) {
              r = await installWorkspacePlugin(job, plan.gh, env, onLine)
            } else {
              r = { ok: false, installed: job.spec, output: job.output, error: `安装的包（${bad.join(', ')}）未声明 dsh.bundle，不是可加载的 DSH 插件，已回滚。` }
            }
```

</details>

#### 缺口

- 线上搜索覆盖与真实宿主装载未验
  **影响**：列表不能用于证明仓库可装或搜索完整
  **进一步探讨**：使用隔离环境对照代表性仓库的固定版本和启动结果

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 搜索结果进入安装时，宿主把信任交给了哪些输入？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

HTTP 路由和模型工具都把输入交给 startInstall。它拒绝一组 shell 元字符，再进入 job。标准安装把 spec 置于双引号中拼成命令，并通过 shell:true 执行。在 POSIX shell，双引号仍允许反引号命令替换和美元变量展开，过滤表未覆盖这两类，源码存在把未可信 spec 交给命令解释器的路径。实际可达性取决于宿主工具批准、扩展路由身份校验和运行平台；本轮未发送请求或运行 shell 命令。GitHub 根包的 name 还可能被 registry 的同名最新版本替换，探测路径未见仓库、包发布者和字节摘要的绑定校验。workspace 路径会 clone 或 reset，并执行第三方 install 和 build；对多个子包依次 link，一项失败时已完成的前项可能仍在，安装 job 失败不表示无状态变更。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1281-1289](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1281-L1289)

spec 守卫及 job 入口。

```text
function startInstall(spec) {
  const clean = String(spec || '').trim()
  if (!clean) return { error: 'empty spec' }
  // Reject cmd.exe and POSIX-shell metacharacters: the spec is untrusted
  // (model or browser input) and is concatenated into a shell command line.
  if (/[&|<>^()%"'!]/.test(clean)) return { error: 'spec contains shell metacharacters and was refused' }
  const profErr = profileInstallError()
  if (profErr) return { error: profErr }
  return { job: startJob('install', clean, null) }
```

**依据 2 · 源码核查**：[lib/index.js:510-542](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L510-L542)

双引号拼接后通过 shell 解释。

<details>
<summary>查看原文（33行）</summary>

```text
/** Quote shell tokens into one command line (each wrapped in double quotes). */
function quote(args) {
  return args.map((a) => `"${a}"`).join(' ')
}

/**
 * Quote only the tokens that need it. The all-quoted form (`"corepack"
 * "pnpm" …`) is parsed wrongly by `cmd /s /c` for PATH-resolved bare commands,
 * so commands resolved through PATH (git, corepack/pnpm) must stay unquoted
 * unless a token actually contains whitespace or metacharacters.
 */
function quoteSmart(args) {
  return args.map((a) => (/[\s"&|<>^()%!]/.test(a) ? `"${a}"` : a)).join(' ')
}

/**
 * Run one shell command asynchronously, streaming each output line to
 * `onLine`. Returns `{ promise, kill }`; `kill()` aborts the whole tree
 * (timeout / cancel). Used for every subprocess (dsh, git, pnpm).
 */
function runProc(commandString, { cwd, env, onLine } = {}) {
  let child = null
  const promise = new Promise((resolve) => {
    child = spawn(commandString, [], {
      cwd,
      // CI=true: pnpm ≥10 blocks forever on a silent interactive prompt
      // without a TTY — non-interactive mode makes it act or fail instead
      // of hanging the install (borrowed from dsh-market's dsh-cli).
      env: { ...(env || process.env), CI: 'true' },
      shell: true,
      windowsHide: true,
      stdio: ['ignore', 'pipe', 'pipe'],
    })
```

</details>

**依据 3 · 源码核查**：[lib/index.js:571-578](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L571-L578)

add 参数进入 runProc。

```text
function runDshAsync(args, { env, onLine } = {}) {
  // Pin the pnpm store on every profile-pnpm op via `--config.store-dir` so it
  // can never drift between process contexts (see the store-pinning comment).
  // The flag is the one mechanism every pnpm version honors; skip it only if
  // the store path itself would break the shell command line.
  const storeArg = storeDirArg()
  const dshTokens = resolveDshCommand()
  return runProc(quote([...dshTokens, 'plugin', '--profile', 'web', ...(storeArg ? [...args, storeArg] : args)]), { env, onLine })
```

**依据 4 · 源码核查**：[lib/index.js:1016-1044](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1016-L1044)

仅按包名查 npm 并可替换来源。

<details>
<summary>查看原文（29行）</summary>

```text
async function planInstall(spec) {
  const gh = githubSpec(spec)
  if (!gh) return { type: 'standard' }
  try {
    const [owner, repo] = gh.split('/')
    const res = await fetch(`https://raw.githubusercontent.com/${owner}/${repo}/HEAD/package.json`, {
      headers: { 'User-Agent': 'dsh-plugin-marketplace' },
      signal: AbortSignal.timeout(20000),
    })
    if (res.ok) {
      const pkg = await res.json()
      const isPlugin = !!(pkg && pkg.dsh && (pkg.dsh.bundle?.patch !== undefined || pkg.dsh.client !== undefined))
      if (isPlugin) {
        // 根级插件走标准 `dsh add -w <target>`：pnpm 会把插件及其运行时依赖
        // （ws、node-pty 等）一起装进 profile，保证 harness 启动时 require() 能解析。
        // 注意：不能改成 link 安装——link 只挂目录、不装依赖，插件运行时 require
        // 不到 ws 等包，harness 会启动失败（历史教训）。
        // 已发布到 npm 的插件优先装 npm 版（快、稳、免 GitHub），否则用 github spec。
        const pkgName = pkg && typeof pkg.name === 'string' ? pkg.name : null
        if (pkgName) {
          const npmSpec = await publishedSpec(pkgName)
          if (npmSpec) return { type: 'standard', gh, spec: npmSpec }
        }
        return { type: 'standard', gh, spec }
      }
      return { type: 'workspace', gh }
    }
  } catch { /* pre-check failed — fall back to standard add + verify */ }
  return { type: 'standard', gh, spec }
```

</details>

**依据 5 · 源码核查**：[lib/index.js:1091-1127](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1091-L1127)

安装构建依赖并串行链接，早返回没有该函数的回滚。

<details>
<summary>查看原文（37行）</summary>

```text
  // 3) find plugin packages
  job.step = '查找插件包'
  const plugins = findPluginPackages(srcDir)
  if (plugins.length === 0) {
    return { ok: false, installed: gh, output: job.output, error: `${gh} 不是可安装的 DSH 插件：仓库中没有找到声明 dsh.bundle / dsh.client 的插件包` }
  }

  // 4) workspace install (deps) + build each plugin that needs it
  job.phase = 'installing'
  job.step = '安装构建依赖'
  r = await runStep([...pnpm, 'install', '--config.node-linker=hoisted'], srcDir)
  if (!r.ok) return { ok: false, installed: gh, output: job.output, error: `安装 ${gh} 构建依赖失败：${r.error || r.output.slice(-600)}` }
  for (const p of plugins) {
    if (needsBuild(p)) {
      job.phase = 'installing'
      job.step = `构建 ${p.name}`
      r = await runStep([...pnpm, '--filter', p.name, 'run', 'build'], srcDir)
      if (!r.ok) return { ok: false, installed: gh, output: job.output, error: `构建 ${p.name} 失败：${r.error || r.output.slice(-600)}` }
      if (needsBuild(p)) return { ok: false, installed: gh, output: job.output, error: `构建 ${p.name} 后仍未生成入口文件（${p.pkg.main}）` }
    }
  }

  // 5) link-install each plugin into the profile (reconcile puts them in bundles)
  const names = []
  for (const p of plugins) {
    job.phase = 'installing'
    job.step = `注册 ${p.name}`
    const linkSpec = 'link:' + p.dir.replace(/\\/g, '/')
    const linkRun = runDshAsync(['add', '-w', linkSpec], { env: spawnEnv, onLine })
    job.childKill = linkRun.kill
    r = await linkRun.promise
    if (!r.ok) return { ok: false, installed: gh, output: job.output, error: `注册 ${p.name} 到 profile 失败：${r.error || r.output.slice(-600)}` }
    names.push(p.name)
  }

  job.step = null
  return { ok: true, installed: names.join(', '), names, output: job.output }
```

</details>

**依据 6 · 源码核查**：[lib/index.js:1655-1665](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1655-L1665)

HTTP 请求进入同一入口。

<details>
<summary>查看原文（11行）</summary>

```text
    // ── POST /api/market/install — start an async install job ────────────
    const installHandler = async (req, res) => {
      try {
        if ((req.method || 'GET').toUpperCase() !== 'POST') { json(res, 405, { ok: false, error: 'method not allowed' }); return }
        const body = await readJsonBody(req)
        const spec = String((body && body.spec) || '').trim()
        const started = startInstall(spec)
        if (started.error) { json(res, 400, { ok: false, error: started.error }); return }
        json(res, 202, { ok: true, jobId: started.job.id })
      } catch (e) {
        json(res, 500, { ok: false, error: String((e && e.message) || e) })
```

</details>

**依据 7 · 源码核查**：[lib/index.js:1954-1957](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1954-L1957)

模型参数进入 installSpec。

```text
      async execute(args) {
        const spec = String((args && args.spec) || '').trim()
        if (!spec) throw new Error('market_install requires a non-empty spec')
        return await installSpec(spec)
```

#### 缺口

- 目标宿主对 Web 写路由与 model tool 的授权和 POSIX 路径可达性未知
  **影响**：决定潜在命令解释的攻击面
  **进一步探讨**：只在隔离环境先用无副作用参数替代器核对 argv，不加载未知插件

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 如何观察发现能力，并验证改为可审计安装是否有效？

**研究主题**：依赖、兼容与流程、效果与总成本、新假设与验证、采用判断

#### 完整回答

Web 需 webServer、tools 和计时服务，搜索还依赖 GitHub 网络和 API 配额。安装需维护 pnpm/Git 及目标 web profile，下载、构建和退出都可能留持久状态。建议先核对只读列表，写入口用不含真实项目和凭据的环境观察；常用 profile 用已核实的固定版本和现有 CLI，避免让 topic 名称或同名 npm 直接成为批准。改进假设是把实际 argv 与最终来源摘要展示给用户确认，子进程禁用 shell，完成后记录逐包的已装、已启动和失败状态。若夹带 shell 语法时 argv 仍保持原样、来源替代必须重新确认且中断能回读已装对象，就可继续试验，否则维持手工可审查流程。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:1553-1561](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1553-L1561)

宿主必需注入。

```text

export default {
  inject: ['webServer', 'timer', 'tools'],
  apply(ctx) {
    const webServer = ctx.webServer
    const tools = ctx.tools

    // ── GitHub sync cache ────────────────────────────────────────────────
    // pageCache[key] = { items, total, fetchedAt }; key = `${q}|${page}|${perPage}`.
```

**依据 2 · 源码核查**：[lib/index.js:1150-1186](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1150-L1186)

进度、超时与看门狗。

<details>
<summary>查看原文（37行）</summary>

```text
    // Loopback byte-counting proxy (best-effort; never blocks the install).
    try { job.proxy = await createByteProxy() } catch { job.proxy = null }
    const proxyUrl = job.proxy ? job.proxy.url : null
    const env = proxyUrl
      ? { ...process.env, HTTP_PROXY: proxyUrl, HTTPS_PROXY: proxyUrl, ALL_PROXY: proxyUrl, http_proxy: proxyUrl, https_proxy: proxyUrl, all_proxy: proxyUrl }
      : { ...process.env }
    estimateTotal(job).catch(() => {})
    const statTimer = setInterval(() => {
      if (!job.proxy) return
      const s = job.proxy.stats()
      if (s.bytesDown !== job.bytesDown) job.lastProgressAt = Date.now()
      job.bytesDown = s.bytesDown
      job.speedBps = s.speedBps
      if (s.expectedBytes > (job.bytesTotal || 0)) job.bytesTotal = s.expectedBytes
      updatePercent(job)
    }, 500)
    const timeoutTimer = setTimeout(() => {
      if (job.done) return
      job.timedOut = true
      job.error = '安装超时（超过 10 分钟），已终止'
      if (job.childKill) job.childKill()
    }, INSTALL_TIMEOUT_MS)
    // Stall watchdog: a pnpm/git child stuck on a dead or too-slow network
    // fetch can hang with zero output for minutes (the 10-min cap is too long
    // to sit at "解析依赖 8%"). If there is no observable progress for
    // STALL_MS, kill the tree — the resulting non-ok result flows into the
    // existing directRetry (once, no proxy), and a second stall fails fast
    // with a clear message instead of an indefinite spinner.
    const STALL_MS = (Number(process.env.DSH_MARKET_STALL_MS) || 120) * 1000
    const stallTimer = setInterval(() => {
      if (job.done || job.canceled || job.timedOut) return
      if (job.childKill && Date.now() - job.lastProgressAt > STALL_MS) {
        job.stalled = true
        job.error = '安装长时间无进展（可能网络/下载卡住），已终止本次尝试'
        job.childKill()
      }
    }, 10000)
```

</details>

**依据 3 · 源码核查**：[lib/index.js:1210-1235](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/lib/index.js#L1210-L1235)

标准安装检查与部分恢复。

<details>
<summary>查看原文（26行）</summary>

```text
    } else if (job.kind === 'install') {
      const plan = await planInstall(job.spec)
      if (plan.type === 'workspace' && plan.gh) {
        // workspace root repo → install its real plugin sub-package(s)
        r = await installWorkspacePlugin(job, plan.gh, env, onLine)
      } else {
        const target = plan.spec || job.spec
        job.depsBefore = Object.keys((profileManifest() && profileManifest().dependencies) || {})
        r = await addStep(['add', '-w', target])
        if (!r.ok && job.proxy && !job.canceled && !job.timedOut) r = await directRetry(job, ['add', '-w', target], onLine)
        r = await recoverHoist(r, target)
        if (r.ok) {
          // Verify the install actually produced a loadable plugin: in bundles,
          // entry artifact present, AND runtime deps resolvable — the latter
          // catches the "bare link without deps" class that would fail at boot.
          const deps = (profileManifest() && profileManifest().dependencies) || {}
          const added = Object.keys(deps).filter((n) => !job.depsBefore.includes(n))
          const bad = added.filter((n) => !pluginLoadable(n) || !runtimeDepsReachable(n))
          if (bad.length > 0) {
            // cleanup the useless plain dependency, then try the workspace path
            for (const n of bad) { try { await runDshSimple(['remove', n]) } catch { /* best effort */ } }
            if (plan.gh) {
              r = await installWorkspacePlugin(job, plan.gh, env, onLine)
            } else {
              r = { ok: false, installed: job.spec, output: job.output, error: `安装的包（${bad.join(', ')}）未声明 dsh.bundle，不是可加载的 DSH 插件，已回滚。` }
            }
```

</details>

**依据 4 · 作者声明**：[README.md:30-37](https://github.com/AwesomeHou/dsh-plugin-marketplace/blob/50582874c5f28c373d785b187766600f52b0ed5e/README.md#L30-L37)

作者的停用和安装状态边界。

```text
- **更新插件（有新版本提示）** — 每个已安装插件都会对照最新版本（npm registry 的 `latest`，或 GitHub 默认分支 `package.json` 的 `version`，GitHub 插件优先）。有新版本时在卡片上标 **可更新** 并给 **更新** 按钮（`/api/market/update`）。
- **区分内置 / 后安装** — `dsh.profile.bundles` 里来自 profile 模板的包是**内置**插件（随 harness 提供，不能停用 / 卸载），`dependencies` 里的是**后安装**插件。**已安装**标签页只展示后安装（第三方）插件，内置插件不列出（页面顶部有声明）。
- **后安装插件可停用 / 卸载** — **停用 / 启用**（`/api/market/set-enabled`）通过把它移出 / 移回 `dsh.profile.bundles` 实现（依赖保留）；**卸载**（`/api/market/uninstall`）通过 `dsh plugin --profile web remove <name>` 移除依赖并自动从 bundle 层摘除。两者都需重启 harness。
- **写 profile 的操作串行落盘（可放心同时卸载多个）** — 安装 / 更新 / 卸载 / 停用 / 启用都会**读改写同一份 profile `package.json`**（以及同一份 `node_modules`），host 侧把它们统一排进**一条 FIFO 队列**（`onProfileWrite`）。此前同时点多个插件的 **卸载**，两个 `dsh plugin remove` 会先各自读到旧 manifest 再写回，**最后一次写入把前一个插件的依赖又恢复了**——所以"同时卸载几个，最后只删掉一个"。现在它们依次执行，**批量卸载会全部生效**；对**同一个插件重复 / 重叠的卸载是幂等的无变化返回**，内置插件仍被明确拒绝（`内置插件不能卸载`），不会被误当成"已删除"而静默放行。
- **进行中只留一个按钮** — 某个插件正在执行某个操作时，卡片上**只保留它自己的那个按钮**并把文案改成 **更新中… / 停用中… / 启用中… / 卸载中…**，其余按钮隐藏；不再出现"原按钮 + 一个通用处理中按钮"两个按钮同时转圈的情况。停用状态标记为 **已停用**（此前显示为"已关闭"）。
- **市场自更新检查** — 插件市场（本插件）会检查自己的最新版本（从其 GitHub 仓库 `package.json` 读取）。有新版本时在"插件市场"和"已安装"两个标签页顶部显示横幅：`vX → vY · 立即更新`。
- **声明来源** — **插件市场**标签页顶部声明插件清单的来源：GitHub `dsh-plugin` 话题（`github.com/topics/dsh-plugin`），通过 GitHub Search API 实时同步。
- **并入插件设置** — 注册两个 `settings.plugins.tab`（`market` 插件市场、`installed` 已安装），与自带的"插件配置"、"插件列表"并列。
```

#### 缺口

- 真实安装、回滚耗时与兼容风险未复现
  **影响**：无法为常用 profile 推荐写操作
  **进一步探讨**：在合成隔离 profile 对照取消、部分成功和卸载回执

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
