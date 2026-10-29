# DSH Plugin Hub

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[15ad35f](https://github.com/dshplugin/dsh-plugin-hub/tree/15ad35fe565fbf2acf412d95b002dcc80f949429)

<!-- BEGIN META -->
[![GitHub ★ 386](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=386&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshplugin/dsh-plugin-hub) [![npm 30d 32,564](https://img.shields.io/static/v1?label=npm+30d&message=32%2C564&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)
<!-- END META -->

> **功能**：在 DSH 设置中浏览远端社区目录，并排队执行本机 dsh/npm 安装、更新和卸载，显示日志及重启状态。

> **亮点**：将发现、真实任务/日志与加载/重启提示集中，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

> **主要限制**：来源flag参与开关绕过而非独立目录证明，构建限制失败会自动写allowBuilds重试；安装成功不等可信且有效，见 [Q02](#research-q02)。

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
  - [Q01 · 市场入口是否真正接宿主安装，目录数量说明什么？](#detail-section-11)
  - [Q02 · 点击安装的权限、真实写入和失败恢复边界在哪里？](#detail-section-12)
  - [Q03 · 能否把它当安全安装中心，下一步产品价值如何验证？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：需要在DSH内找和管理社区插件的用户，减少查目录/切终端，见 [Q01](#research-q01)。

人工核仓库/npm固定版本后用官方CLI管理，目录是发现线索而非代码审计。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录 | 发现条目 | 外部API/陈旧cache非审计 |
| 队列 | 实装/卸载/更新 | 真实profile或全局副作用 |
| 恢复 | 日志/重试/loader | 自动许可不是回滚或安全证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配Host/webServer/slots | 必需 | 路由和设置 | 无法加载面板 |
| dsh/npm/Node与profile写权限 | 安装必需 | 下载/配置/全局CLI | 可能失败或改错范围 |
| 远端目录/registry/代理 | 下载必需 | 获取条目和目标包 | cache可旧，不能证明可装 |
| 构建/loader/重启 | 视目标 | 执行构建与生效 | 自动放行有持久副作用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 发现 | 用户查目录和来源 | 不凭数量/精选信任 |
| 安装 | route校验/队列spawn | 核实际包与profile/global范围 |
| 恢复 | worker日志与许可重试 | 人工核allowBuilds和残留 |
| 生效 | loader或重启 | 目标真实功能验收 |
| 退出 | 卸载Hub/目标分开 | 不留误认已撤全局包 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载/独立profile资源未知 | 核CLI与目标来源、备份 | 没有实装 |
| 持续使用 | registry/外部构建未知 | 更新/重启/兼容维护 | 无净节时对照 |
| 失败恢复 | 子进程/构建残留未知 | 查依赖/许可与配置差异 | 终止非事务回滚 |
| 退出 | 包/全局CLI资源留存未知 | Hub与所装目标分别卸 | 不等恢复全部变更 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 管理便利 | 目录/任务/日志集中 | 真实节时与选择正确 |
| 安装 | CLI与loader实际接线 | 目标安全/重启后可用 |
| 恢复 | 错误日志/重试 | 文件回滚/残留清理 |

> **思考**：来源flag参与开关绕过而非独立目录证明，构建限制失败会自动写allowBuilds重试；安装成功不等可信且有效，见 [Q02](#research-q02)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将发现、真实任务/日志与加载/重启提示集中，见 [Q01](#research-q01) 与 [Q02](#research-q02)。

[Q02](#research-q02) 任务/真实CLI/loader状态清晰，但客户端source标记不是目录认证，自动写allowBuilds应成为可见决策。

<a id="detail-section-5"></a>

### 1.4 主要限制

来源flag参与开关绕过而非独立目录证明，构建限制失败会自动写allowBuilds重试；安装成功不等可信且有效，见 [Q02](#research-q02)。

<a id="detail-section-6"></a>

### 1.5 使用建议

来源/构建许可先审，再隔离profile少量固定目标；现建议观察，见 [Q03](#research-q03)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定安装链已核，权限/构建副作用与真实加载仍需隔离验收，建议观察。

- 已检查：作者 README、包清单、源码路径 package.json、src/client/index.tsx、src/server/http/catalog.ts、src/server/http/install.ts、src/server/http/shared.ts、src/server/index.ts、src/server/services/install/task-queue.ts、src/server/services/profile/profile.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：四材料身份/固定revision一致，catalog identity无既有研究。核Host/client、catalog/cache、install route/queue、profile allowBuilds/loader状态；未全审全部网络探针/诊断/依赖解析，不执行目标。
- 下一步：本轮未运行；仍需固定版本目标的来源/构建配置差异/重试/重启/卸载隔离验收，不推断远端目录质量。

**分析版本**

- **仓库**：[dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)
- **版本号**：2.2.5（[固定提交 15ad35f](https://github.com/dshplugin/dsh-plugin-hub/tree/15ad35fe565fbf2acf412d95b002dcc80f949429)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

绑定身份/固定包版本与可见安装变更计划，服务端复算来源和构建许可，测错误/恢复时间，未实现，见 [Q03](#research-q03)。

本轮未运行；仍需固定版本目标的来源/构建配置差异/重试/重启/卸载隔离验收，不推断远端目录质量。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 71 | 2689 | — | — | 25426 |
| .js | source | 34 | 12234 | 10164 | 2145 | — |
| .mjs | source | 5 | 401 | 273 | 93 | — |
| .tsx | source | 26 | 5568 | 4434 | 971 | — |
| .ts | source | 54 | 9001 | 6261 | 2373 | — |
| .ts | test | 26 | 3060 | 2295 | 646 | — |

</details>

**活跃度**

[![Issue 未关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 440](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=440&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+created%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z) [![近30天关闭 427](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=427&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T03%3A03%3A10.741Z..2026-10-29T03%3A03%3A10.741Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：市场是否把正确来源与真实安装变更闭环，权限和失败状态能否支撑可信采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 市场入口是否真正接宿主安装，目录数量说明什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势、依赖、兼容与流程

#### 完整回答

固定dsh-plugin2.2.5是原生Host+Client插件。Host依webServer挂同源路由，client把PluginHubSection注册到settings.section。远端api.dsh-plugin.org按语言给plugins.json/stats，profile本地cache可在拉取失败时回退旧数据；它不是把所有条目代码放在本仓库。目录“人工精选/10000+”是作者描述，不说明来源审计或实际兼容。相对手工找仓库/跑CLI，它把浏览、安装任务和状态集中到界面，真正下载/安装仍交给本机dsh/npm与外部registry。注册UI不等本轮真实呈现验收。

#### 证据与依据

**依据 1 · 作者声明**：[package.json:2-4](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/package.json#L2-L4)

包名/版本与作者规模描述。

```text
  "name": "dsh-plugin",
  "version": "2.2.5",
  "description": "A community plugin marketplace for DeepSeek Harness, built to the official plugin spec — browse, search and install 10000+ human-curated community plugins without leaving the app. · DeepSeek Harness 社区插件市场（遵循官方开发规范）：10000+ 人工精选社区插件，每日更新。",
```

**依据 2 · 源码核查**：[src/server/index.ts:33-37](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/index.ts#L33-L37)

webServer真实挂载。

```text
export function apply(ctx: HostContext, config: Config = {}): void {
  const profile = config.profile ?? readProfileArg('web')
  ctx.inject(['webServer'], (host) => {
    host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes')
  })
```

**依据 3 · 源码核查**：[src/client/index.tsx:18-30](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/client/index.tsx#L18-L30)

实际设置slot注册。

<details>
<summary>查看原文（13行）</summary>

```text
export const inject = ['slots', 'locale']

export function apply(ctx: HubClientContext): void {
  ctx.effect(() => ctx.locale.register(NS, { zh, en }), `${NS}: dictionaries`)
  const t = ctx.locale.bind(NS)
  ctx.slots.inject('settings.section', () => ctx.slots.register({
    name: 'settings.section',
    id: NS,
    order: 60,
    label: () => t('nav'),
    locale: NS,
    inject: () => ({ t, locale: ctx.locale }),
  }, () => h(PluginHubSection, { t, locale: ctx.locale })))
```

</details>

**依据 4 · 源码核查**：[src/server/http/catalog.ts:122-156](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/http/catalog.ts#L122-L156)

远端目录、本地缓存和旧数据兜底。

<details>
<summary>查看原文（35行）</summary>

```text
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
        // 1 小时本地缓存：命中直接返回（跨重启生效，插件市场秒开），未命中才走 curl 拉远程。
        // refresh=1 跳过 TTL 缓存直接回源（「强制刷新」用）；成功后照样覆盖缓存，
        // 失败仍回退旧缓存，所以强制刷新不会把可用的旧数据弄丢。
        const cacheFile = catalogCacheFile(profile, isStats ? 'stats' : `plugins-${lang}`)
        const forceRefresh = url.searchParams.get('refresh') === '1'
        const cached = forceRefresh ? null : readCatalogCache(cacheFile, CATALOG_CACHE_TTL_MS)
        if (cached !== null) {
          try {
            sendJson(response, 200, JSON.parse(cached))
            return
          } catch {
            // 缓存正文损坏：忽略，走重新拉取并覆盖写盘
          }
        }
        const r = await fetchCatalogOnce(target, proxy)
        if (!r.ok || r.body === '') {
          // 实时拉取失败：退回任意年龄的本地缓存（上次成功数据），
          // 避免证书吊销受阻 / 网络抖动时整个插件市场打不开 —— 数据可能过期，但好过空白。
          const stale = readCatalogCache(cacheFile, Number.POSITIVE_INFINITY)
          if (stale !== null) {
            try {
              sendJson(response, 200, JSON.parse(stale))
              return
            } catch {
              // 兜底缓存也损坏：落到下面的 502
            }
          }
          sendJson(response, 502, { error: 'catalog fetch failed' })
          return
        }
        try {
          sendJson(response, 200, JSON.parse(r.body))
          writeCatalogCache(cacheFile, r.body)
```

</details>

#### 缺口

- 远端目录条目质量、当下服务可用和UI实装未核。
  **影响**：未核条目来源/质量与旧缓存，不能推荐将目录命中视为可信目标或当下可安装。
  **进一步探讨**：只读核少量目标来源/固定版本/包元数据，再在隔离profile确认界面实际挂载。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 点击安装的权限、真实写入和失败恢复边界在哪里？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

安装不是下载提示。route受本机Host/同源或dsh-app Origin检查，无Origin本机请求被信任；它是CSRF来源边界，非逐用户身份/代码审查。接收目标语法校验和队列去重，再spawn dsh plugin --profile add/remove，globalNpm分支直接npm install -g，超时/取消会杀进程但不提供完整文件事务回滚。默认npm安装/更新可能取latest，明确pin优先，不等目录显示的固定代码已审。

重要边界有两处：source===catalog来自请求body；仓库/包匹配成功只记录映射，false未在此处分支拒绝，而自定义NPM开关只约束source非catalog，不是服务端目录成员认证。其次失败ERR_PNPM_*构建限制会解析key写allowBuilds再自动重试，profile文件被真实改动，不应把包管理器拦截当始终保留的审批门。安装成功可热挂loader，否则登记待重启；更新因ESM缓存需重启。代码存在流程恢复，不证明目标插件可信、安装无残留或重启后可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/shared.ts:139-163](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/http/shared.ts#L139-L163)

本机来源信任规则。

<details>
<summary>查看原文（25行）</summary>

```text
export function isSameOrigin(request: IncomingMessage): boolean {
  // 服务只绑定本机回环地址：Host 不是回环（局域网 IP、被改写的域名）一律拒绝，
  // 顺带挡掉 DNS rebinding（Host 是攻击者域名，即便解析到 127.0.0.1）。
  const host = request.headers.host
  const hostKey = host === undefined ? null : loopbackAuthority(host)
  if (hostKey === null) return false
  const origin = request.headers.origin
  // 桌面端宿主把 `/dsh-plugin-hub/*` 转发给本地 http server 时可能不带 Origin 头，
  // 此时所有 POST 都会被判成 untrusted origin。浏览器对 POST 请求
  // 必定携带 Origin（含同源 POST 与跨站表单），能省略该头的只有本机原生客户端，
  // 而它们本来就能伪造任意 Origin，因此放行不扩大 CSRF 面。
  if (origin === undefined || origin === '') return true
  try {
    const url = new URL(origin)
    // 桌面端（Electron 宿主）的页面跑在宿主自定义协议下，origin 形如 `dsh-app://app`，
    // 与 Host（如 localhost:3081）必然不等，因此必须显式放行该协议，否则桌面端全部 POST
    // 都会被判成 untrusted origin。该协议只有宿主自身能产生，外部网页无法把 Origin
    // 伪造成 `dsh-app://…`，放行不扩大 CSRF 面。
    if (url.protocol === 'dsh-app:') return true
    // 按归一化后的「主机名:端口」比较：`localhost` / `127.0.0.1` / `[::1]` 不再互相拒绝，
    // 端口仍然必须一致（另一个本机进程不能被当成同一来源）。
    return loopbackAuthority(url.host) === hostKey
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[src/server/http/install.ts:55-64](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/http/install.ts#L55-L64)

source来自请求及settings。

<details>
<summary>查看原文（10行）</summary>

```text
          // 请求来源：目录插件安装（catalog）走目录白名单；命令行安装（custom）受安全开关控制
          const source = typeof body === 'object' && body !== null && typeof (body as { source?: unknown }).source === 'string'
            ? (body as { source: string }).source
            : ''
          // 自定义安装入口渠道（仅 NPM 包）：日志/报错据此溯源发起入口。
          const installChannel = (() => {
            const raw = body !== null && typeof body === 'object' ? (body as { installChannel?: unknown }).installChannel : undefined
            return raw === 'npm' ? 'npm' : undefined
          })()
          const settings = loadSettings(profile)
```

</details>

**依据 3 · 源码核查**：[src/server/http/install.ts:119-145](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/http/install.ts#L119-L145)

语法/版本、仓库映射而非false拒绝及source开关。

<details>
<summary>查看原文（27行）</summary>

```text
          // 自定义安装目标只接受 npm 包名（@scope/name 或 name）。
          if (!validPackageName(rawRepo)) {
            sendJson(response, 400, { error: 'unsupported install target: expected an npm package name' })
            return
          }
          const target = rawRepo
          // 钉住精确版本（Hub 自我更新）：最新版可能仍在 pnpm 供应链门禁内，
          // 客户端提示的是「已过门禁」的版本，服务端必须按该版本安装而不是 @latest。
          const pinVersion = typeof (body as { version?: unknown }).version === 'string'
            ? (body as { version: string }).version.trim()
            : ''
          if (pinVersion !== '' && !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.]+)?$/.test(pinVersion)) {
            sendJson(response, 400, { error: 'invalid version' })
            return
          }
          // 已尝试的安装方式（供失败提 Issue 预填）：保持为空
          const attempts: string[] = []
          // 目录插件安装：目录数据可能滞后于打包拆分，确认目录下发的 npm 目标确为该仓库的 DSH 包，
          // 命中则记录 repo → 包名映射，客户端据此把依赖 key 匹配回仓库、列表立即显示「已安装」。
          const catalogRepo = source === 'catalog' ? githubRepoOf(displayRepo) : null
          if (catalogRepo !== null) {
            const catalogTargetIsDsh = await isDshNpmPackageForRepo(rawRepo, catalogRepo, settings.npmRegistry, effectiveProxy)
            if (catalogTargetIsDsh) recordResolvedNpmPackage(profile, catalogRepo, rawRepo)
          }
          // 命令行安装（目录外）受「启用 NPM 安装」开关控制；目录插件安装走目录白名单，不受开关影响。
          if (source !== 'catalog' && !settings.enableNpmInstall) {
            sendJson(response, 403, { error: 'npm installs are disabled by the security settings' })
```

</details>

**依据 4 · 源码核查**：[src/server/services/install/task-queue.ts:425-450](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L425-L450)

真实dsh/npm命令、latest或pin。

<details>
<summary>查看原文（26行）</summary>

```text
  const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task, displayTarget, loader, globalNpm, updateNpm, registries, installSpec } = options
  // 全局 npm 安装：直接 spawn 本机 npm（`npm install -g <pkgs>`），不是 dsh plugin 命令
  const isGlobalNpm = (globalNpm ?? []).length > 0
  const invocation = isGlobalNpm
    ? { file: 'npm', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
    : cliInvocation(profile)
  // 打包桌面端却回退到 PATH 上的 dsh：说明 desktop CLI 引导路径没命中，desktop profile 必被宿主拒绝。
  // 留一行 ASCII 标记，后续同类上报可直接区分「用户自起 CLI」与「我们没走对引导路径」。
  if (task && task.status !== 'cancelled' && invocation.file === 'dsh'
    && (process.versions as Record<string, string | undefined>).electron !== undefined) {
    pushLine(task, '[desktop-cli-fallback] running inside Electron but no desktop CLI bootstrap was found — falling back to dsh on PATH (a desktop-managed profile will be rejected)')
  }
  // 安装/更新 npm 包都显式 @latest：pnpm add <pkg>（无版本）对已存在的精确 spec 是幂等的，
  // 会原样留用旧版本（更新不生效，普通安装也可能装回不支持当前宿主的旧包）。
  // update 动作同样执行 `add <target>@latest`，CLI 动词透传 add，不与官方 update 动词分叉。
  const isUpdate = action === 'update' || updateNpm === true
  const cliAction = action === 'update' ? 'add' : action
  // 钉住版本优先于 @latest：提示的是「已过门禁」的版本，装 latest 会被 pnpm 拒绝
  const npmUpdateTarget = npmInstallTargetOf(target, { update: isUpdate, global: isGlobalNpm, pinned: installSpec, add: cliAction === 'add' })
  const args = isGlobalNpm
    ? ['install', '-g', ...(globalNpm ?? [])]
    : [...invocation.prefixArgs, 'plugin', '--profile', profile, cliAction, npmUpdateTarget]
  // 记录实际执行的命令（显示包名），失败提 Issue 时作为「已尝试的安装方式」随附
  const executed = isGlobalNpm
    ? `npm install -g ${(globalNpm ?? []).join(' ')}`
    : `dsh plugin --profile ${profile} ${cliAction} ${npmUpdateTarget}`
```

</details>

**依据 5 · 源码核查**：[src/server/services/install/task-queue.ts:231-246](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L231-L246)

取消杀进程边界。

<details>
<summary>查看原文（16行）</summary>

```text
function stopChild(child: ReturnType<typeof spawn>): void {
  if (process.platform === 'win32' && child.pid !== undefined) {
    const killer = spawn('taskkill', ['/pid', String(child.pid), '/t', '/f'], { stdio: 'ignore' })
    killer.once('error', () => child.kill('SIGKILL'))
    return
  }
  if (child.pid !== undefined) {
    // POSIX：dsh 内部会 fork pnpm，只杀 dsh 会让 pnpm 变成孤儿继续攥着管道，
    // close 事件永不到来、队列卡死。detached 让子进程成为进程组组长，
    // 对整组 SIGKILL 才能把 dsh + pnpm（及后代）一起清掉，close 随即触发。
    try {
      process.kill(-child.pid, 'SIGKILL')
      return
    } catch { /* 进程已退出：忽略 */ }
  }
  child.kill('SIGKILL')
```

</details>

**依据 6 · 源码核查**：[src/server/services/install/task-queue.ts:889-925](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L889-L925)

构建拦截后自动放行/重试。

<details>
<summary>查看原文（37行）</summary>

```text
  // allowBuilds 放行 / 装后入口校验都是 profile 专属（pnpm 装进 profile 的场景）；
  // 全局 npm 安装直接走 npm，无 pnpm allowBuilds 拦截、也不进 profile，跳过这两类恢复
  // 安装与更新（同为 add 通道执行）共享同一套恢复路径；卸载不适用
  if (options.action !== 'remove' && result.exitCode !== 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const output = `${result.stderr}\n${result.stdout}`
    // git 源：pnpm 打印的 key@url 提示
    if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
      const key = parseAllowBuildsKey(output)
      if (key !== null) {
        if (options.task) {
          // 首次尝试已把任务标为失败；重置它，让重试重新以 running 任务形式流式输出进度。
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${key}`)
        }
        addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
    // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
    // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
    // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
    // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
    if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
      const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`)
      if (keys.length === 0 && githubRepoOf(options.target) === null) keys.push(options.target)
      if (keys.length > 0) {
        if (options.task) {
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${keys.join(', ')}`)
        }
        for (const key of keys) addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
  }
```

</details>

**依据 7 · 源码核查**：[src/server/services/profile/profile.ts:161-189](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/profile/profile.ts#L161-L189)

allowBuilds写profile文件。

<details>
<summary>查看原文（29行）</summary>

```text
export function addAllowBuildsKey(profile: string, key: string): void {
  const file = join(profileDirectory(profile), 'pnpm-workspace.yaml')
  let yaml = ''
  try { yaml = readFileSync(file, 'utf8') } catch { /* 文件不存在，下方创建 */ }
  const eol = /\r\n/.test(yaml) ? '\r\n' : '\n'
  const blockRe = /allowBuilds:[ \t]*\r?\n((?:[ \t]+[^\r\n]*\r?\n?)*)/g
  const map = new Map<string, string>()
  for (const match of Array.from(yaml.matchAll(blockRe))) {
    for (const line of match[1].split(/\r?\n/)) {
      const m = /^[ \t]+(\S.*?)\s*:\s*(true|false)?\s*$/.exec(line)
      if (m === null || m[1] === '') continue
      let k = m[1]
      if (k.length >= 2 && ((k[0] === "'" && k[k.length - 1] === "'") || (k[0] === '"' && k[k.length - 1] === '"'))) {
        k = k.slice(1, -1)
      }
      map.set(k, m[2] ?? 'true')
    }
  }
  map.set(key, 'true')
  const block = Array.from(map).map(([k, v]) => `  ${quoteYamlKey(k)}: ${v}`).join(eol)
  const blockText = `allowBuilds:${eol}${block}${eol}`
  let next: string
  if (/allowBuilds:[ \t]*\r?\n/.test(yaml)) {
    let seen = 0
    next = yaml.replace(blockRe, () => (seen++ === 0 ? blockText : ''))
  } else {
    next = `${yaml.replace(/\r?\n?$/, eol)}${blockText}`
  }
  writeFileSync(file, next)
```

</details>

**依据 8 · 源码核查**：[src/server/services/install/task-queue.ts:670-699](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L670-L699)

热挂/卸载/重启状态。

<details>
<summary>查看原文（30行）</summary>

```text
          if (isGlobalNpm) {
            // 全局 npm 安装：装的是本机 CLI 工具（如 dsh-tui），不进任何 profile，无需宿主重启
            task.needsRestart = false
          } else if (action === 'remove' && loader) {
            // 卸载成功 → 主动从运行中 loader 停用该包条目：
            //  - 停用成功：服务端即时卸载；带客户端 UI 的插件面板要页面刷新才摘除（无需重启宿主）
            //  - 停用失败 / 超时：回退「待重启」兜底清理（刷新解决不了，登记常驻提醒）
            const removal = await removeLoadedEntry(loader, target)
            task.needsRestart = !removal.ok
            task.needsReload = removal.ok && removal.live && task.hadClientUi === true
            if (task.needsRestart) addPendingRestart(displayTarget ?? target, 'uninstall')
            else clearPendingRestart(displayTarget ?? target)
          } else if (action !== 'remove' && !isUpdate && loader) {
            // 安装成功 → 尝试把新插件热挂进运行中 loader，让插件无需重启宿主即生效。
            // 挂上了：服务端即时生效；带客户端 UI 的插件还需页面重新加载（宿主按请求现场
            //   拼装 __DSH_BOOT__ 注入清单，网页端与桌面端一致，刷新即可）。
            // 挂不上 / 非 dsh 插件 / 无法定位包名：回退「待重启」提醒（保证不静默失效）。
            const { name } = verifyInstalledEntry(profile, target)
            if (name !== null && isDshPlugin(profile, name) && await mountLoadedEntry(loader, name)) {
              task.needsReload = hasClientUi(profile, name)
              task.needsRestart = false
            } else {
              task.needsRestart = true
              addPendingRestart(displayTarget ?? target, 'install')
            }
          } else {
            // 更新（ESM 缓存下热挂取不到新代码）/ 无 loader 的安装或卸载 → 登记待重启：
            // 插件要宿主重启才会挂载/卸载干净，重启前一直提醒；展示目标用 displayTarget（owner/repo）
            task.needsRestart = true
            addPendingRestart(displayTarget ?? target, action === 'remove' ? 'uninstall' : 'install')
```

</details>

#### 缺口

- 未验证来源flag/目录成员的全程约束、构建变更恢复与恶意/故障包边界。
  **影响**：来源flag与构建许可恢复未实测，不能把自定义安装关闭或进程取消当目录认证/无残留回滚。
  **进一步探讨**：专门隔离profile静态/受控审计来源判定和构建授权，核安装前后配置、依赖、进程、热挂/重启与卸载残留。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 能否把它当安全安装中心，下一步产品价值如何验证？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议观察，当前优势是省浏览/CLI切换与集中任务状态，不能把人工精选和安装成功当来源安全。首次需独立profile备份、匹配Host/Node/CLI、目录/registry网络与代理设置；持续付出外部包/构建/更新和宿主重启，失败应核依赖与allowBuilds变更而非只重试，退出卸载Hub不等卸已安装包或全局CLI。金额/人工与节时均未知，单个目标直接固定版本CLI可能更简单。

可证伪方向是把条目身份/包版本/来源证据与安装变更计划绑定，目录校验在服务端独立重算，构建许可变更向用户可见且能比对恢复；当前日志/任务状态是基础。对少量真实插件比较手动固定安装、当前Hub、带差异计划版本的错误目标率、残留、重启后可用率和人工排错时间，无改善则停止。未实现，不以目录规模证明需求。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/services/install/task-queue.ts:425-450](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L425-L450)

真实外部安装成本。

<details>
<summary>查看原文（26行）</summary>

```text
  const { action, profile, target, timeoutMs = 5 * 60 * 1000, env, task, displayTarget, loader, globalNpm, updateNpm, registries, installSpec } = options
  // 全局 npm 安装：直接 spawn 本机 npm（`npm install -g <pkgs>`），不是 dsh plugin 命令
  const isGlobalNpm = (globalNpm ?? []).length > 0
  const invocation = isGlobalNpm
    ? { file: 'npm', prefixArgs: [], cwd: process.cwd(), useShell: process.platform === 'win32' }
    : cliInvocation(profile)
  // 打包桌面端却回退到 PATH 上的 dsh：说明 desktop CLI 引导路径没命中，desktop profile 必被宿主拒绝。
  // 留一行 ASCII 标记，后续同类上报可直接区分「用户自起 CLI」与「我们没走对引导路径」。
  if (task && task.status !== 'cancelled' && invocation.file === 'dsh'
    && (process.versions as Record<string, string | undefined>).electron !== undefined) {
    pushLine(task, '[desktop-cli-fallback] running inside Electron but no desktop CLI bootstrap was found — falling back to dsh on PATH (a desktop-managed profile will be rejected)')
  }
  // 安装/更新 npm 包都显式 @latest：pnpm add <pkg>（无版本）对已存在的精确 spec 是幂等的，
  // 会原样留用旧版本（更新不生效，普通安装也可能装回不支持当前宿主的旧包）。
  // update 动作同样执行 `add <target>@latest`，CLI 动词透传 add，不与官方 update 动词分叉。
  const isUpdate = action === 'update' || updateNpm === true
  const cliAction = action === 'update' ? 'add' : action
  // 钉住版本优先于 @latest：提示的是「已过门禁」的版本，装 latest 会被 pnpm 拒绝
  const npmUpdateTarget = npmInstallTargetOf(target, { update: isUpdate, global: isGlobalNpm, pinned: installSpec, add: cliAction === 'add' })
  const args = isGlobalNpm
    ? ['install', '-g', ...(globalNpm ?? [])]
    : [...invocation.prefixArgs, 'plugin', '--profile', profile, cliAction, npmUpdateTarget]
  // 记录实际执行的命令（显示包名），失败提 Issue 时作为「已尝试的安装方式」随附
  const executed = isGlobalNpm
    ? `npm install -g ${(globalNpm ?? []).join(' ')}`
    : `dsh plugin --profile ${profile} ${cliAction} ${npmUpdateTarget}`
```

</details>

**依据 2 · 源码核查**：[src/server/services/install/task-queue.ts:889-925](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L889-L925)

构建许可写入成本。

<details>
<summary>查看原文（37行）</summary>

```text
  // allowBuilds 放行 / 装后入口校验都是 profile 专属（pnpm 装进 profile 的场景）；
  // 全局 npm 安装直接走 npm，无 pnpm allowBuilds 拦截、也不进 profile，跳过这两类恢复
  // 安装与更新（同为 add 通道执行）共享同一套恢复路径；卸载不适用
  if (options.action !== 'remove' && result.exitCode !== 0 && !result.timedOut && (options.globalNpm ?? []).length === 0) {
    const output = `${result.stderr}\n${result.stdout}`
    // git 源：pnpm 打印的 key@url 提示
    if (output.includes('ERR_PNPM_GIT_DEP_PREPARE_NOT_ALLOWED')) {
      const key = parseAllowBuildsKey(output)
      if (key !== null) {
        if (options.task) {
          // 首次尝试已把任务标为失败；重置它，让重试重新以 running 任务形式流式输出进度。
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${key}`)
        }
        addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
    // 依赖原生模块/构建脚本被 pnpm v11 拦截（ERR_PNPM_IGNORED_BUILDS）：git 与 npm 源都会出现。
    // allowBuilds 的 key 是输出里列出的 name@version（如 node-pty@1.1.0），逐个放行后重试一次；
    // 输出解析不到时回退用目标名（插件自身构建脚本被拦的 npm 场景）。
    // 用重试后的最终结果判断：git 源放行 prepare 后可能又在依赖层撞上原生构建拦截。
    if (result.exitCode !== 0 && !result.timedOut && `${result.stderr}\n${result.stdout}`.includes('ERR_PNPM_IGNORED_BUILDS')) {
      const keys = ignoredBuildKeys(`${result.stderr}\n${result.stdout}`)
      if (keys.length === 0 && githubRepoOf(options.target) === null) keys.push(options.target)
      if (keys.length > 0) {
        if (options.task) {
          options.task.status = 'running'
          options.task.exitCode = null
          pushLine(options.task, `[allow build] ${keys.join(', ')}`)
        }
        for (const key of keys) addAllowBuildsKey(options.profile, key)
        result = await spawnMutation(options)
      }
    }
  }
```

</details>

**依据 3 · 源码核查**：[src/server/services/install/task-queue.ts:670-699](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/services/install/task-queue.ts#L670-L699)

效果不能跳过热挂/重启。

<details>
<summary>查看原文（30行）</summary>

```text
          if (isGlobalNpm) {
            // 全局 npm 安装：装的是本机 CLI 工具（如 dsh-tui），不进任何 profile，无需宿主重启
            task.needsRestart = false
          } else if (action === 'remove' && loader) {
            // 卸载成功 → 主动从运行中 loader 停用该包条目：
            //  - 停用成功：服务端即时卸载；带客户端 UI 的插件面板要页面刷新才摘除（无需重启宿主）
            //  - 停用失败 / 超时：回退「待重启」兜底清理（刷新解决不了，登记常驻提醒）
            const removal = await removeLoadedEntry(loader, target)
            task.needsRestart = !removal.ok
            task.needsReload = removal.ok && removal.live && task.hadClientUi === true
            if (task.needsRestart) addPendingRestart(displayTarget ?? target, 'uninstall')
            else clearPendingRestart(displayTarget ?? target)
          } else if (action !== 'remove' && !isUpdate && loader) {
            // 安装成功 → 尝试把新插件热挂进运行中 loader，让插件无需重启宿主即生效。
            // 挂上了：服务端即时生效；带客户端 UI 的插件还需页面重新加载（宿主按请求现场
            //   拼装 __DSH_BOOT__ 注入清单，网页端与桌面端一致，刷新即可）。
            // 挂不上 / 非 dsh 插件 / 无法定位包名：回退「待重启」提醒（保证不静默失效）。
            const { name } = verifyInstalledEntry(profile, target)
            if (name !== null && isDshPlugin(profile, name) && await mountLoadedEntry(loader, name)) {
              task.needsReload = hasClientUi(profile, name)
              task.needsRestart = false
            } else {
              task.needsRestart = true
              addPendingRestart(displayTarget ?? target, 'install')
            }
          } else {
            // 更新（ESM 缓存下热挂取不到新代码）/ 无 loader 的安装或卸载 → 登记待重启：
            // 插件要宿主重启才会挂载/卸载干净，重启前一直提醒；展示目标用 displayTarget（owner/repo）
            task.needsRestart = true
            addPendingRestart(displayTarget ?? target, action === 'remove' ? 'uninstall' : 'install')
```

</details>

**依据 4 · 源码核查**：[src/server/http/catalog.ts:138-156](https://github.com/dshplugin/dsh-plugin-hub/blob/15ad35fe565fbf2acf412d95b002dcc80f949429/src/server/http/catalog.ts#L138-L156)

目录可能返回陈旧缓存。

<details>
<summary>查看原文（19行）</summary>

```text
        const r = await fetchCatalogOnce(target, proxy)
        if (!r.ok || r.body === '') {
          // 实时拉取失败：退回任意年龄的本地缓存（上次成功数据），
          // 避免证书吊销受阻 / 网络抖动时整个插件市场打不开 —— 数据可能过期，但好过空白。
          const stale = readCatalogCache(cacheFile, Number.POSITIVE_INFINITY)
          if (stale !== null) {
            try {
              sendJson(response, 200, JSON.parse(stale))
              return
            } catch {
              // 兜底缓存也损坏：落到下面的 502
            }
          }
          sendJson(response, 502, { error: 'catalog fetch failed' })
          return
        }
        try {
          sendJson(response, 200, JSON.parse(r.body))
          writeCatalogCache(cacheFile, r.body)
```

</details>

#### 缺口

- 没有独立安装/恢复验收和用户节时对照。
  **影响**：缺安装后真实加载/恢复与用户排错对照，无法判断省时是否抵消额外许可和维护成本。
  **进一步探讨**：先完成来源/构建许可评审，以少量可信插件的固定版本隔离profile测试再决定使用。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
