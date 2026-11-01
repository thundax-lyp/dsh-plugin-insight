# DSH Plugin Hub

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[e391605](https://github.com/dshplugin/dsh-plugin-hub/tree/e3916054f490f59cc89ca593944b1f185131b20c)

<!-- BEGIN META -->
[![GitHub ★ 407](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=407&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dshplugin/dsh-plugin-hub) [![npm 30d 34,388](https://img.shields.io/static/v1?label=npm+30d&message=34%2C388&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览、搜索和安装社区插件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把发现、变更任务及状态反馈集中到设置页；执行仍由宿主和包管理器完成。

> **主要限制**：[Q03](#research-q03) 来源标记不能证明目录成员或包安全，自动构建放行改变 profile；[Q04](#research-q04) 旧缓存及取消状态不能证明实时或回滚。

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
  - [Q01 · 哪些用户用市场完成什么任务，与手动查目录和运行命令有什么区别？](#detail-section-11)
  - [Q02 · 目录与安装任务如何进入本机 profile，状态怎样返回？](#detail-section-12)
  - [Q03 · 来源标签、安装版本和构建授权是否能证明包安全？](#detail-section-13)
  - [Q04 · 离线缓存、并发、取消、加载和重启各有什么边界？](#detail-section-14)
  - [Q05 · 哪些前提、成本和回退决定是否值得采用？](#detail-section-15)
  - [Q06 · 能否通过强绑定安装计划改善来源和构建权限的决策？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：DSH Web 用户希望从设置中发现并安装社区插件。

用户可人工核对代码与版本，再通过 DSH 命令管理 profile。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 设置入口 | 浏览插件目录 | 依赖 Web slots 和 locale |
| 目录代理 | 获取目录及缓存 | 网络失败可能返回任意年龄缓存 |
| 变更队列 | 安装、更新或卸载 | 需包管理器、权限和目标核验 |
| 加载状态 | 提示刷新或重启 | 取决于 loader、UI 和操作类型 |

| 依赖或条件 | 是否必需 | 用途 | 不满足时 |
|---|---|---|---|
| DSH 宿主 webServer 和 loader | 对应服务需要 | 挂载路由与加载插件 | 市场或热加载可能不可用 |
| Web slots 和 locale | 界面需要 | 注册设置入口 | 界面无法加载 |
| 目录服务和缓存 | 浏览目录需要其一 | 获取列表 | 无可用缓存时请求失败 |
| npm、profile 写权限和网络 | 安装需要 | 下载并修改依赖 | 任务失败，需核实已有副作用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核实宿主、profile 与目标来源 | 来源或版本不明先停止 |
| 发现 | 在设置中浏览目录 | 注意网络失败可能显示旧缓存 |
| 安装 | 用户选择已核实目标并查看任务 | 入队成功不等于完成 |
| 验收 | 核对任务、依赖、构建许可和加载状态 | 失败或取消后检查实际文件再恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 宿主、下载和网络费用未知 | 核对包和 profile | 目录真实性未核验 |
| 持续 | 网络与更新成本未知 | 复核来源、更新和权限 | 实际节时未测 |
| 恢复 | 文件和可能构建资源未知 | 检查取消或失败后的依赖 | 副作用回滚未证明 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 目录浏览 | 设置槽位与服务端代理 | 目录真实规模、完整性和时效 |
| 安装 | 串行任务调用子进程 | 实际安装成功率与安全性 |
| 状态反馈 | 取消、加载和重启分支 | 所有取消都回滚或立即生效 |

> **思考**：[Q03](#research-q03) 来源标记不能证明目录成员或包安全，自动构建放行改变 profile；[Q04](#research-q04) 旧缓存及取消状态不能证明实时或回滚。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 把发现、变更任务及状态反馈集中到设置页；执行仍由宿主和包管理器完成。

[Q02](#research-q02) 解释路由与队列接线，[Q03](#research-q03) 显示来源与构建许可边界，[Q04](#research-q04) 区分缓存、取消和加载状态。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 来源标记不能证明目录成员或包安全，自动构建放行改变 profile；[Q04](#research-q04) 旧缓存及取消状态不能证明实时或回滚。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 有隔离 profile 的用户可先查找并核对一个已知包，再人工确认目标与任务状态；来源、版本或构建许可不明时停止并回到手动核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定版本目录、安装、队列与关键失败分支已核查；未运行宿主或网络。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.tsx、src/server/index.ts、src/server/http/catalog.ts、src/client/hooks/useTaskQueue.ts、src/server/http/install.ts、src/server/services/install/task-queue.ts、src/server/http/shared.ts、src/server/services/profile/profile.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交只读 package、README、设置入口、catalog 代理、install 路由、profile 和队列代表分支；未执行宿主、插件、模型或网络，未审计所有网络探针、依赖解析及供应链。
- 下一步：以隔离 profile 与假目录、registry 复现入队、过期缓存、版本变化、脚本许可和取消，对照直接命令并按 [Q06](#research-q06) 检验绑定方案。

**分析版本**

- **仓库**：[dshplugin/dsh-plugin-hub](https://github.com/dshplugin/dsh-plugin-hub)
- **版本号**：2.2.7（[固定提交 e391605](https://github.com/dshplugin/dsh-plugin-hub/tree/e3916054f490f59cc89ca593944b1f185131b20c)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 假设以目标版本、完整性和构建权限绑定的短期计划可降低误装及未经确认许可；尚未实现或验证。

以隔离 profile 与假目录、registry 复现入队、过期缓存、版本变化、脚本许可和取消，对照直接命令并按 [Q06](#research-q06) 检验绑定方案。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 73 | 2711 | — | — | 25632 |
| .js | source | 36 | 12320 | 10204 | 2191 | — |
| .mjs | source | 5 | 401 | 273 | 93 | — |
| .tsx | source | 26 | 5578 | 4439 | 976 | — |
| .ts | source | 56 | 9093 | 6299 | 2422 | — |
| .ts | test | 29 | 3214 | 2406 | 673 | — |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 477](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=477&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+created%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z) [![近30天关闭 473](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=473&color=737b86&logo=github)](https://github.com/dshplugin/dsh-plugin-hub/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T09%3A18%3A30.076Z..2026-11-01T09%3A18%3A30.076Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核对插件市场的发现、安装、来源及权限边界，并对照手动命令。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些用户用市场完成什么任务，与手动查目录和运行命令有什么区别？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH Web 用户需要查找、安装或更新社区插件时，README:27-29 称可在设置中浏览并操作。client/index.tsx:17-30 将界面注册到 settings.section；手动替代是核对来源后通过 DSH 命令修改 profile。插件将目录、任务反馈和加载提示集中到界面，实际包安装仍依赖宿主 CLI 和 npm，并非目录本身提供代码执行能力。README:7-9 声称收录 5686 项、全部人工验证，package.json:2-4 则描述 10000+ 项；没有可独立核验的清单、审核记录或截止时间，不能把任一规模或验证声明当成事实。是否节时、选到可靠插件比例或真实需求频率未做同任务比较。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-9](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/README.md#L7-L9)

作者对规模及审核的声明。

```text
# DSH Plugin 插件市场 - DeepSeek Harness Plugin (DSH) 下载与安装 · 插件大全

**DeepSeek Harness Plugin（DSH）插件市场与插件大全，收录 5,686 个插件、全部人工精选验证、每日更新，免费浏览、搜索并按分类发现、下载与安装 DSH 插件，人工验证、来源可溯。**
```

**依据 2 · 作者声明**：[README.md:27-29](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/README.md#L27-L29)

作者描述插件市场与独立身份。

```text
## 什么是 DSH Plugin Hub

DSH Plugin Hub 是 **DeepSeek Harness 社区插件市场**：一个遵循官方插件开发规范构建的开源插件，安装进「设置 → 插件市场」后，无需离开应用即可浏览、搜索并一键安装社区插件。本项目为独立社区项目，与 DeepSeek Harness 官方无隶属关系。
```

**依据 3 · 作者声明**：[package.json:1-4](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/package.json#L1-L4)

包说明与 README 数量不一致。

```text
{
  "name": "dsh-plugin",
  "version": "2.2.7",
  "description": "A community plugin marketplace for DeepSeek Harness, built to the official plugin spec — browse, search and install 10000+ human-curated community plugins without leaving the app. · DeepSeek Harness 社区插件市场（遵循官方开发规范）：10000+ 人工精选社区插件，每日更新。",
```

**依据 4 · 源码核查**：[src/client/index.tsx:17-30](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/client/index.tsx#L17-L30)

注册设置页入口。

<details>
<summary>查看原文（14行）</summary>

```text
export const name = NS
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

#### 缺口

- 无核验的目录规模、人工审核记录和同任务对照
  **影响**：无法把目录数量、审核和节时写成证实效果
  **进一步探讨**：固定目录时间与抽样规则核验记录，对照手动安装。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 目录与安装任务如何进入本机 profile，状态怎样返回？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

client/index.tsx:20-30 注册设置入口，服务端 index.ts:33-36 注入 webServer 并挂载路由；catalog.ts:103-123 代理目录与统计地址。useTaskQueue.ts:554-576 从用户选择发起 catalog 来源安装，install.ts:119-145 校验 npm 名称和可选固定版本，再从 148-155、184-211 对已安装项转更新、在网络探测后复查队列并启动变更任务。task-queue.ts:499-514 以指定 cwd、环境和参数启动子进程，结果依 loader 等情况区分刷新、重启或热挂载，不能把入队 200 当成安装完成。普通安装可以没有 pinVersion，更新采用 latest；未实测宿主执行与真实包。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/index.tsx:20-30](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/client/index.tsx#L20-L30)

设置页接入。

<details>
<summary>查看原文（11行）</summary>

```text
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

**依据 2 · 源码核查**：[src/server/index.ts:33-36](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/index.ts#L33-L36)

宿主注册 HTTP 路由。

```text
export function apply(ctx: HostContext, config: Config = {}): void {
  const profile = config.profile ?? readProfileArg('web')
  ctx.inject(['webServer'], (host) => {
    host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes')
```

**依据 3 · 源码核查**：[src/server/http/catalog.ts:103-123](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/catalog.ts#L103-L123)

服务端目录代理地址。

<details>
<summary>查看原文（21行）</summary>

```text
export function registerCatalogRoutes(webServer: WebServerService, profile: string): WebRoute[] {
  return [
    {
      kind: 'exact',
      path: '/dsh-plugin-hub/catalog',
      handler: async (request, response) => {
        if (!requireMethod(request, response, 'GET')) return
        // 目录/统计数据服务端代理：浏览器不直连 dsh-plugin.org，统一经此路由
        // 转发（curl 子进程注入代理 env），与 npm / git 安装通道走同一代理口径，
        // 「npm / git / 目录数据请求统一走该代理」的设置文案因此真实生效。
        const url = new URL(request.url ?? '/', 'http://localhost')
        const settings = loadSettings(profile)
        // 代理优先级与安装/诊断一致：设置里的代理 → 系统代理 → 环境变量 → 直连
        const proxy = settings.proxy !== ''
          ? settings.proxy
          : (systemProxy() ?? process.env.HTTPS_PROXY ?? process.env.https_proxy ?? '')
        const isStats = url.searchParams.get('stats') === '1'
        const lang = url.searchParams.get('lang') === 'en' ? 'en' : 'zh'
        const target = isStats
          ? 'https://api.dsh-plugin.org/stats.json'
          : `https://api.dsh-plugin.org/plugins.${lang}.json`
```

</details>

**依据 4 · 源码核查**：[src/client/hooks/useTaskQueue.ts:554-576](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/client/hooks/useTaskQueue.ts#L554-L576)

目录安装请求携带来源及版本。

<details>
<summary>查看原文（23行）</summary>

```text
    const repo = p.source?.repo ?? ''
    if (!repo) return
    // 目录条目必带 npm 包名：直接用包名安装（用户无感知）。
    const target = installTargetOf(p)
    if (!target) return
    await submitInstall({
      target,
      repo,
      desc: p.description,
      version: p.version,
      updatedAt: p.dates?.repoUpdatedAt,
      command: installCommandOf(p, true),
      source: 'catalog',
      update: opts?.update,
      pinVersion: opts?.pinVersion,
    })
  }

  /** 命令行安装：用户手输 npm 包名，走 custom 源（受安全开关控制）。
   *  update=true 时对已安装目标放行覆盖重装（与目录插件「更新」同一语义）。
   *  channel=入口渠道（NPM 包卡片）：上报服务端落日志，失败弹窗/通知据此精准溯源。
   *  队列展示/防重一律用归一化身份：与服务端 /active 合并、弹窗目标匹配同口径，
   *  npm 包名透传不受影响。 */
```

</details>

**依据 5 · 源码核查**：[src/server/http/install.ts:119-145](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L119-L145)

目标、可选版本与来源判断。

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

**依据 6 · 源码核查**：[src/server/http/install.ts:148-155](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L148-L155)

已安装处理和任务去重。

```text
          // 命中已安装目标时按「更新」执行（pnpm add 对已存在依赖即原位覆盖重装）：
          // 客户端已装列表可能与服务端不同步，覆盖重装比报错更友好且终态一致。
          const installed = readInstalled(profile)
          const already = installed[target] !== undefined ? target : null
          if (already !== null) mode = 'update'
          // 队列级去重：同一目标已在排队/执行中时拒绝，避免客户端防重竞态导致重复入队
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
```

**依据 7 · 源码核查**：[src/server/http/install.ts:184-211](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L184-L211)

入队与请求响应。

<details>
<summary>查看原文（28行）</summary>

```text
          // 入队前复检：网络探测的 await 期间并发请求可能已通过上方检查，而此处到 startPluginMutation
          // 之间无 await，JS 单线程保证同一目标至多一个任务，杜绝双击/并发双任务。
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
            return
          }
          // 后台启动 CLI；客户端轮询 /status 获取进度
          const task = startPluginMutation({
            // mode=update（已安装目标的覆盖更新）以 update 动作入队：
            // 日志按 update 类别落盘（update.start/done/fail），实际 CLI 执行仍是 add <target>@latest
            action: mode === 'update' ? 'update' : 'add',
            profile,
            target,
            // npm 安装时 target 是包名：displayTarget 固定展示仓库名，待重启行/前端恢复不因安装目标形态而变
            displayTarget: githubRepoOf(displayRepo) ?? undefined,
            // 覆盖更新：npm 命令显式 @latest（pnpm add 无版本对已存在依赖是幂等的，不加版本不会真更新）
            updateNpm: mode === 'update',
            // 运行中 loader：安装成功后把新插件热挂进 loader，非桌面端 + 纯服务端插件无需重启即生效
            loader,
            timeoutMs: COMMAND_TIMEOUT_MS,
            env: mutationEnv(settings),
            // 候选源（首选在前）：任务内遇到传输层失败时按顺序换源重试
            registries: ordered,
            installSpec: pinVersion !== '' ? `${target}@${pinVersion}` : undefined,
            // 自定义安装入口渠道：日志/报错据此溯源
            installChannel,
          })
          sendJson(response, 200, { ok: true, task: task.id })
```

</details>

**依据 8 · 源码核查**：[src/server/services/install/task-queue.ts:499-514](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L499-L514)

启动实际变更子进程。

<details>
<summary>查看原文（16行）</summary>

```text
      // invocation.env 是「必须叠加」的变量（打包桌面端的 ELECTRON_RUN_AS_NODE）：
      // 没有它时保持 env 原样透传，有它时必须基于完整环境叠加，否则子进程会丢掉 PATH。
      // registry 最后写入：换源重试只改这一层，pnpm/npm 都认 npm_config_registry。
      const childEnv: NodeJS.ProcessEnv = { ...(env ?? process.env), ...(invocation.env ?? {}) }
      if (registry !== undefined) {
        childEnv.npm_config_registry = registry
        childEnv.NPM_CONFIG_REGISTRY = registry
      }
      child = spawn(invocation.file, attemptArgs, {
        cwd: invocation.cwd,
        env: childEnv,
        shell: invocation.useShell,
        // detached 使子进程成为独立进程组组长：取消时能整组清理（见 stopChild），
        // 且宿主进程崩溃后安装任务不会被连带误杀
        detached: true,
        stdio: ['ignore', 'pipe', 'pipe'],
```

</details>

**依据 9 · 源码核查**：[src/server/services/install/task-queue.ts:685-711](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L685-L711)

加载与重启分支。

<details>
<summary>查看原文（27行）</summary>

```text
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
          }
        }
        // 子进程一个字节都没吐时在退出行上标注：日志面板与失败上报都能看出「没有输出可排查」
        const printedNothing = `${result.stdout}${result.stderr}`.trim() === ''
        pushLine(task, result.timedOut ? '[timed out]' : `[exit ${result.exitCode ?? '?'}]${printedNothing ? ' (no output captured)' : ''}`)
      }
    }
    // 带上最终生效的源：后续注解（如 [dsh-too-old]）读元数据必须与安装同源，
    // 否则换过源之后会去另一个源查，查不到就静默漏报
```

</details>

#### 缺口

- 未跑固定宿主、真实包与安装失败恢复
  **影响**：无法证明版本兼容、热挂载成功或用户收益
  **进一步探讨**：隔离 profile 对照 CLI，记录入队、子进程与加载结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 来源标签、安装版本和构建授权是否能证明包安全？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

install.ts:55-58 从请求体读取 source，119-145 对 source=catalog 时尝试核对 npm 包与展示仓库以记录映射，但校验不通过并不返回错误；仅 source 非 catalog 时检查 enableNpmInstall。因而该来源字段不是服务端目录成员证明，语法校验或同源限制也不是包内容与供应链审计。可信 POST 在 shared.ts:137-160、173-177 限制 loopback Host 和来源，但无 Origin 的请求被允许，不能把它当成独立用户授权。task-queue.ts:903-937 遇到指定 pnpm 构建拦截时，解析输出后写 profile 的 allowBuilds 并再次执行；这扩大构建许可，日志出现不等于用户逐项批准。是否发生恶意利用、目录内容可信和包脚本后果均未验证。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/install.ts:55-58](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L55-L58)

来源取自请求。

```text
          // 请求来源：目录插件安装（catalog）走目录白名单；命令行安装（custom）受安全开关控制
          const source = typeof body === 'object' && body !== null && typeof (body as { source?: unknown }).source === 'string'
            ? (body as { source: string }).source
            : ''
```

**依据 2 · 源码核查**：[src/server/http/install.ts:119-145](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L119-L145)

目录映射查询不作为失败门禁。

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

**依据 3 · 源码核查**：[src/server/http/shared.ts:137-160](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/shared.ts#L137-L160)

本机 Host、缺失 Origin 与允许的来源。

<details>
<summary>查看原文（24行）</summary>

```text
/** POST 变更只接受来自本地 web server 来源或桌面宿主页面。转出供测试（tests/routes.test.ts）使用 ——
 *  来源校验就是全部的 CSRF 防御。 */
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
```

</details>

**依据 4 · 源码核查**：[src/server/http/shared.ts:173-177](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/shared.ts#L173-L177)

变更路由来源检查。

```text
export function requireTrustedPost(request: IncomingMessage, response: ServerResponse): boolean {
  if (!requireMethod(request, response, 'POST')) return false
  if (isSameOrigin(request)) return true
  sendJson(response, 403, { error: 'untrusted origin' })
  return false
```

**依据 5 · 源码核查**：[src/server/services/install/task-queue.ts:903-937](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L903-L937)

写入构建许可并重试。

<details>
<summary>查看原文（35行）</summary>

```text
  let result = await spawnMutation(options)
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
```

</details>

**依据 6 · 源码核查**：[src/server/services/profile/profile.ts:156-164](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/profile/profile.ts#L156-L164)

profile 中 allowBuilds 被重写合并。

```text
/**
 * 向 profile 的 pnpm-workspace.yaml 追加一条 `allowBuilds` 记录：与已有条目合并，
 * 其余 yaml 保持不变；重写时丢弃损坏的占位条目（pnpm 安装失败的 bug 会写入
 * 字面量 `set this to true or false`）。
 *
 * 任何形态的既有 `allowBuilds` 都会被**整体替换**成规范化块：块写法、行内数组
 * `allowBuilds: ["a@1"]`、以及末尾无换行的 `allowBuilds:` 都算命中。否则会在文件里
 * 再多写一个同名键 —— pnpm 解析时直接报 `duplicated mapping key`，该 profile 里
 * 所有插件都装不上（#562）。
```

#### 缺口

- 未核查目录实际真实性、供应链及跨宿主攻击条件
  **影响**：不能判断发生利用或认证包的安全性
  **进一步探讨**：隔离 profile 以假目录和无害构建脚本验证边界。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 离线缓存、并发、取消、加载和重启各有什么边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

catalog.ts:124-151 在请求失败时用任意年龄的缓存返回 JSON，调用方不能从该响应路径直接区分实时数据和旧缓存；无法据显示的目录断定最新。task-queue.ts:118-135 将排队任务移出队列，运行任务设 cancelled 并终止子进程；已经发生的文件或脚本副作用没有在这些分支回滚。install.ts:184-188 在网络探测后再次检查同一目标，降低并发双入队；task-queue.ts:673-711 则按全局安装、卸载、loader 与 UI 分支设置刷新或待重启。README 中“刷新即生效”的概括需以实际分支和宿主为准；取消不等于事务回滚，进程退出也不保证最终运行效果。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/catalog.ts:124-151](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/catalog.ts#L124-L151)

缓存命中与无限期旧缓存回退。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/server/services/install/task-queue.ts:118-135](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L118-L135)

等待与运行中的取消路径。

<details>
<summary>查看原文（18行）</summary>

```text
export function cancelTask(id: number): boolean {
  const task = tasks.get(id)
  if (!task) return false
  if (task.status === 'pending') {
    const index = queue.findIndex((it) => it.task === task)
    if (index >= 0) queue.splice(index, 1)
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    return true
  }
  if (task.status === 'running') {
    task.status = 'cancelled'
    pushLine(task, '[cancelled]')
    const child = runningChildren.get(id)
    if (child) stopChild(child)
    return true
  }
  return false
```

</details>

**依据 3 · 源码核查**：[src/server/http/install.ts:184-188](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L184-L188)

探测后重复队列检查。

```text
          // 入队前复检：网络探测的 await 期间并发请求可能已通过上方检查，而此处到 startPluginMutation
          // 之间无 await，JS 单线程保证同一目标至多一个任务，杜绝双击/并发双任务。
          if (hasQueuedTarget(target)) {
            sendJson(response, 409, { error: `already queued: ${target}` })
            return
```

**依据 4 · 源码核查**：[src/server/services/install/task-queue.ts:673-711](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L673-L711)

不同安装和卸载的加载状态。

<details>
<summary>查看原文（39行）</summary>

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
          }
        }
        // 子进程一个字节都没吐时在退出行上标注：日志面板与失败上报都能看出「没有输出可排查」
        const printedNothing = `${result.stdout}${result.stderr}`.trim() === ''
        pushLine(task, result.timedOut ? '[timed out]' : `[exit ${result.exitCode ?? '?'}]${printedNothing ? ' (no output captured)' : ''}`)
      }
    }
    // 带上最终生效的源：后续注解（如 [dsh-too-old]）读元数据必须与安装同源，
    // 否则换过源之后会去另一个源查，查不到就静默漏报
```

</details>

**依据 5 · 作者声明**：[README.md:37-42](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/README.md#L37-L42)

作者对安装和生效的概括。

```text
**一键操作 · 全部可视化**

- **一键安装** — 点击即装：后台队列串行执行，弹窗实时显示安装进度，可随时取消；装完刷新页面即生效，无需重启
- **一键升级** — 目录检测到新版本自动提示，卡片按钮变为「更新」，覆盖安装一键完成
- **一键卸载** — 卸载全程可视化，实时进度一目了然，卸载成功即生效
- **任务留痕** — 每次安装 / 升级 / 卸载的成功与失败都会写入通知中心，随时回查
```

#### 缺口

- 未做联网、并发、强制终止及宿主加载实验
  **影响**：不能证明真实生效或撤销所有副作用
  **进一步探讨**：用隔离 profile 比较网络中断、队列取消与 profile 实际变化。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些前提、成本和回退决定是否值得采用？

**研究主题**：效果与总成本、采用判断

#### 完整回答

package.json:1-4、22-24、61-74 声明版本 2.2.7、Node >=22.6、Cordis peer 与 web 客户端；服务端注入 webServer，客户端注入 slots/locale。README 给出的 DSH CLI 可直接管理 profile，是替代基线；市场还依赖远端目录、可用 npm 源、本机权限与用户审核。首次需核实项目与包来源，持续需检查版本、构建许可和重启状态，失败后需比对 profile、日志和安装产物；人工时间与网络费用均未知。需要严控变更来源、脚本许可或无法核对目标的环境不适合直接点装，可退出并由有权限的人人工审阅精确包和版本。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-4](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/package.json#L1-L4)

包名版本与作者功能描述。

```text
{
  "name": "dsh-plugin",
  "version": "2.2.7",
  "description": "A community plugin marketplace for DeepSeek Harness, built to the official plugin spec — browse, search and install 10000+ human-curated community plugins without leaving the app. · DeepSeek Harness 社区插件市场（遵循官方开发规范）：10000+ 人工精选社区插件，每日更新。",
```

**依据 2 · 源码核查**：[package.json:22-24](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/package.json#L22-L24)

Node 版本声明。

```text
  "engines": {
    "node": ">=22.6"
  },
```

**依据 3 · 源码核查**：[package.json:61-74](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/package.json#L61-L74)

peer、客户端平台及注入声明。

<details>
<summary>查看原文（14行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots"
      ],
      "platform": "web"
    }
```

</details>

**依据 4 · 源码核查**：[src/server/index.ts:33-36](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/index.ts#L33-L36)

宿主 webServer 条件。

```text
export function apply(ctx: HostContext, config: Config = {}): void {
  const profile = config.profile ?? readProfileArg('web')
  ctx.inject(['webServer'], (host) => {
    host.effect(() => mountPluginHubRoutes(host.webServer, profile, host.loader), 'dsh-plugin: http routes')
```

**依据 5 · 作者声明**：[README.md:133-138](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/README.md#L133-L138)

作者提供安装命令。

````text
## 安装 DSH Plugin Hub

从 npm 安装（推荐）：

```bash
dsh plugin --profile web add dsh-plugin
````

**依据 6 · 源码核查**：[src/server/http/install.ts:119-145](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L119-L145)

实际可选固定版本与来源判断。

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

**依据 7 · 源码核查**：[src/server/services/install/task-queue.ts:903-937](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L903-L937)

恢复路径修改构建许可。

<details>
<summary>查看原文（35行）</summary>

```text
  let result = await spawnMutation(options)
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
```

</details>

#### 缺口

- 未验证全部 DSH 版本和插件来源真实性，也无实测人工成本
  **影响**：无法承诺安装兼容或比直接 CLI 节时
  **进一步探讨**：隔离 profile 试用已审查包并核对 profile 与加载状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 能否通过强绑定安装计划改善来源和构建权限的决策？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

现有路由已有目标语法、可选版本、来源标记与同源检查，队列也有去重、日志和自动构建许可；只增加确认框或日志不构成所需增量。未验证设想是在允许变更前由服务端生成短期安装计划，将目录条目身份及快照摘要、目标精确版本及包完整性摘要、profile 和预计构建许可绑定到一次用户确认；执行前重新解析并核对全部字段，变更或未能确认则停止，未知构建需求出现时再次要求明确许可。此方案依赖可信目录来源、可获取完整性元数据和可观察脚本清单；无法得到时标 unknown 并停止，不能声称代码无恶意。用同一隔离 profile 对照现有来源旗标、可选固定版本、自动许可与新计划，模拟伪造 catalog、过期目录、解析版本变化、恶意包同名、未知构建许可及取消；记录错误目标安装、未批准许可、误拦截、恢复时间和人工负担。若计划被替换仍执行、无法核验时默认放行、许可被绕过或在无安全改善时造成不可接受成本，则否定；尚未实现或证明。

#### 证据与依据

**依据 1 · 源码核查**：[src/server/http/install.ts:119-145](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/install.ts#L119-L145)

现有可选版本、来源字段及映射边界。

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

**依据 2 · 源码核查**：[src/server/http/catalog.ts:124-151](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/catalog.ts#L124-L151)

目录可能回退旧缓存。

<details>
<summary>查看原文（28行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/server/http/shared.ts:137-160](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/http/shared.ts#L137-L160)

现有来源检查边界。

<details>
<summary>查看原文（24行）</summary>

```text
/** POST 变更只接受来自本地 web server 来源或桌面宿主页面。转出供测试（tests/routes.test.ts）使用 ——
 *  来源校验就是全部的 CSRF 防御。 */
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
```

</details>

**依据 4 · 源码核查**：[src/server/services/install/task-queue.ts:903-937](https://github.com/dshplugin/dsh-plugin-hub/blob/e3916054f490f59cc89ca593944b1f185131b20c/src/server/services/install/task-queue.ts#L903-L937)

现有自动构建许可与重试。

<details>
<summary>查看原文（35行）</summary>

```text
  let result = await spawnMutation(options)
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
```

</details>

#### 缺口

- 尚无计划原型、可信目录绑定或攻击对照
  **影响**：不能证明减少误装与权限扩大
  **进一步探讨**：以假 registry 和可审计无害脚本做同条件对照。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
