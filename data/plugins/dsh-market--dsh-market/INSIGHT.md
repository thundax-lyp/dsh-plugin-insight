# DSH Market 插件市场

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8747e07](https://github.com/dsh-market/dsh-market/tree/8747e07367df7f16d6186e1c9047daecee3e8174)

<!-- BEGIN META -->
[![GitHub ★ 13,234](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=13%2C234&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 1,340,541](https://img.shields.io/static/v1?label=npm+30d&message=1%2C340%2C541&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-11-21](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-21&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **功能**：在 DSH 中浏览、搜索、安装和更新社区插件，提供 AI 查找、配置备份与恢复入口。

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) 与 [Q04](#research-q04) 将来源、当前profile、激活与中断恢复放进同一插件管理任务。[Q02](#research-q02) 的自然语言入口和 [Q07](#research-q07) 的固定意图等待机制扩大交互方式，但不替代用户对真实功能的核对。

> **主要限制**：[Q02](#research-q02) 的模型只能从本地截断候选中挑选，名字合法不代表适合；[Q04](#research-q04) 的请求超时不代表底层写入停止，[Q05](#research-q05) 的配置恢复不覆盖全部插件数据。发现、落盘、激活和业务成功仍必须分层判断。

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
  - [Q01 · 原生目录已能发现插件时，市场增加了哪些可核查选择依据？](#detail-section-11)
  - [Q02 · AI查找和个性化如何从请求变成卡片，能否证明所选插件适合？](#detail-section-12)
  - [Q03 · 安装请求如何绑定来源、宿主profile和实际激活？](#detail-section-13)
  - [Q04 · Desktop管理器迟迟不回答或拆旧后失败时如何保持可解释恢复？](#detail-section-14)
  - [Q05 · 热挂载和备份能恢复多少，哪些数据不在其中？](#detail-section-15)
  - [Q06 · 后台检查和提醒怎样处理来源变化与失败？](#detail-section-16)
  - [Q07 · 公开更新API和等待Agent空闲的变更有什么边界？](#detail-section-17)
  - [Q08 · 模型、遥测与备份增加什么持续成本和数据边界？](#detail-section-18)
  - [Q09 · 哪些人值得小范围试用，什么设计假设可检验？](#detail-section-19)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：维护多个社区包的 DSH 用户需要把“找到名字”推进到“这个来源的这个版本能装入当前 profile，并实际提供所需功能”。原生 Discover 或目录网页足够满足简单找包；市场的增量是将候选兼容声明、安装来源、已装状态和后续更新/恢复放在同一交互。bundle patch 挂载 dshmarket，package 导出宿主 lib/index.js 与客户端 client/client.js，入口注入 webServer/loader 后按宿主能力选择运行时，说明它确实是可加载插件，不只是独立目录。

原生Discover与Plugins页面、CLI维护及手工记录；只需目录发现者无需把市场全部管理机制作为必要条件。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录浏览、筛选和兼容提示 | 找到来源与声明匹配的候选 | unknown和静态披露不等于安全/可用 |
| AI查找与/find-plugin | 自然语言挑选并说明理由 | 用户模型和额度；前30候选限制 |
| 个性化推荐 | 从已装/收藏寻找补充候选 | 操作可向模型发送列表，同home授权需理解 |
| 安装、更新与卸载 | 维护当前profile的包 | 宿主运行时不同，落盘与功能分别验收 |
| 热切换与主题管理 | 调整插件加载状态 | 不兼容或缺产物不能靠重启保证修复 |
| 配置快照和备份恢复 | 恢复组合配置或迁移配置 | 包与第三方业务数据不完整包含 |
| 更新监视与提醒 | 常驻发现待维护包 | 默认不开自动检查，失败可保留旧状态 |
| 公开更新API及drain | 插件界面复用更新并等待Agent边界 | beta、能力协商及宿主hold条件 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 匹配的Cordis、webServer、loader及客户端插槽 | 组件必需 | 服务与市场页面 | 旧宿主缺原语时页面可不挂载 |
| 正确profile的CLI或Desktop manager | 包变更必需 | 下载、移除、安装 | 不同宿主路径与回执不可混同 |
| 可达目录、清单与下载来源 | 发现/安装必需 | 身份、兼容和包取得 | 兼容未知保留未知，不能判已可用 |
| llm与可用模型/凭据 | AI操作按需 | 候选重排、自然语言理由 | 无模型返回指引，基础市场仍可用 |
| Agent事件与maintenance hold | drain按需 | 等待安全变更边界 | 不兼容不提供该能力 |
| 浏览器存储和可装饰插槽 | 提醒按需 | 已读和红点 | 退回内存或原入口 |
| WebDAV/Gist权限 | 外部备份按需 | 上传配置 | 不影响本地配置备份，凭据与内容需核对 |


#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户复制profile并核对实际宿主运行时 | 确认包会装入本profile，留独立业务数据副本 |
| 选择 | 用户查来源/版本/兼容；AI仅按需调用 | 不把候选理由和扫描披露当验收 |
| 安装 | 市场在锁内调正确包管理器 | 区分落盘、激活与需要重启 |
| 验收 | 用户执行一次目标功能 | 来源版本相符且结果合格，否则停止 |
| 恢复 | 用户查未决写入、journal与副本 | 超时不盲重试；配置和业务数据分别核对 |
| 退出 | 用户卸载或退回原生/CLI | 先确认写入已结束，另处理本地记录与远端备份 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 目录、清单、插件及构建下载 | 核对profile、来源、兼容与数据副本 | 下载/构建耗时和费用未知 |
| 持续使用 | 检查网络、缓存、可选AI额度和遥测 | 决定升级并验收功能 | 模型预算不是实际账单 |
| 失败恢复 | 重取包、保留版本与备份 | 检查未决写入、重启、恢复和重测 | 配置恢复不包含全部业务数据 |
| 迁移退出 | 配置与搜索结果留存、外部备份 | 停止任务后卸载，核对遗留状态 | 全周期人工分钟未知 |


#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 查找与AI选择 | 限定候选并过滤非法模型名字 | 需求匹配率与真实可用性 |
| 安装管理 | 来源/profile/落盘/激活分别核对 | 功能成功率和同任务总耗时 |
| 中断处理 | 未决写入追踪与journal按状态修复 | 跨宿主故障恢复结果 |
| 更新提醒 | 身份核对、stale与已读目标分离 | 常驻误扰和人工节省 |
| 公开API | beta能力协商、执行前重查意图 | 实际宿主hold与外部副作用停止 |

> **思考**：[Q02](#research-q02) 的模型只能从本地截断候选中挑选，名字合法不代表适合；[Q04](#research-q04) 的请求超时不代表底层写入停止，[Q05](#research-q05) 的配置恢复不覆盖全部插件数据。发现、落盘、激活和业务成功仍必须分层判断。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01)、[Q03](#research-q03) 与 [Q04](#research-q04) 将来源、当前profile、激活与中断恢复放进同一插件管理任务。[Q02](#research-q02) 的自然语言入口和 [Q07](#research-q07) 的固定意图等待机制扩大交互方式，但不替代用户对真实功能的核对。

[Q04](#research-q04) 将HTTP等待与底层Promise生命周期分开，适合借鉴异步变更系统；[Q07](#research-q07) 执行前固定意图和Agent屏障复核有明确责任，但移植依赖真实宿主契约。[Q05](#research-q05) 配置快照范围清晰，[Q02](#research-q02) 大客户端职责拆分不能替代正确性验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 的模型只能从本地截断候选中挑选，名字合法不代表适合；[Q04](#research-q04) 的请求超时不代表底层写入停止，[Q05](#research-q05) 的配置恢复不覆盖全部插件数据。发现、落盘、激活和业务成功仍必须分层判断。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q09](#research-q09) 先复制Web profile，留关键数据副本，只改一个非关键包并固定来源版本；查落盘、激活和真实功能，验证能恢复。AI与后台按需开启，底层写入未结束时不盲目重试。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持集成管理、候选选择和恢复机制；宿主内部行为、目标包功能及端到端收益未由本次运行验证；任务凭证是假设。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、README.md、src/index.ts、src/discovery-compatibility.ts、src/registry.ts、src/find-plugin.ts、src/routes.ts、src/http.ts、src/official-desktop.ts、src/pending-updates.ts、src/hot.ts、src/snapshot.ts、src/backup.ts、src/update-notifications.ts、src/client/update-notifications.ts、src/client/MarketSection.tsx、src/drain.ts、src/telemetry.ts、tsdown.config.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库根，核查挂载/构建、发现兼容、AI查找与个性化、安装来源与profile分支、Desktop迟到写入/修复、热挂载/配置恢复、提醒、公开API/drain及遥测关键链路；不是所有模块安全审计。
- 下一步：只读取固定源码与旧正式证据、装配研究。未运行目标、构建、测试、宿主、模型或远端备份；无目标包功能、真实认证、效果和费用验收。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.80.0（[固定提交 8747e07](https://github.com/dsh-market/dsh-market/tree/8747e07367df7f16d6186e1c9047daecee3e8174)）
- **版本日期**：2026-11-23（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q09](#research-q09) 提出把AI相关理由、固定来源/版本和功能探针组成任务凭证的未验证设计。以同任务比较装错、合格率、排障总时间和请求成本；若探针不覆盖核心用途、误报增加或总负担不降，则不支持该设计。

只读取固定源码与旧正式证据、装配研究。未运行目标、构建、测试、宿主、模型或远端备份；无目标包功能、真实认证、效果和费用验收。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 10 | 1860 | — | — | 28051 |
| .js | source | 2 | 25549 | 22702 | 4431 | — |
| .mjs | source | 18 | 2669 | 1926 | 607 | — |
| .ts | source | 114 | 56018 | 36124 | 17603 | — |
| .tsx | source | 35 | 13221 | 10575 | 2345 | — |
| .ts | test | 140 | 61274 | 46731 | 10545 | — |
| .tsx | test | 18 | 18348 | 15317 | 1897 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 11 | 361 | 178 | 163 | — |

</details>

**活跃度**

[![Issue 未关闭 95](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=95&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 151](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=151&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+created%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z) [![近30天关闭 102](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=102&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-24T02%3A28%3A08.405Z..2026-11-23T02%3A28%3A08.405Z)



统计日期：2026-11-23。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：维护多个社区插件的DSH用户，能否把发现、安装、更新和恢复约束到正确来源与当前profile，并理解AI及后台负担？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生目录已能发现插件时，市场增加了哪些可核查选择依据？

**研究主题**：场景与需求、贡献与相对优势、依赖、兼容与流程

#### 完整回答

维护多个社区包的 DSH 用户需要把“找到名字”推进到“这个来源的这个版本能装入当前 profile，并实际提供所需功能”。原生 Discover 或目录网页足够满足简单找包；市场的增量是将候选兼容声明、安装来源、已装状态和后续更新/恢复放在同一交互。bundle patch 挂载 dshmarket，package 导出宿主 lib/index.js 与客户端 client/client.js，入口注入 webServer/loader 后按宿主能力选择运行时，说明它确实是可加载插件，不只是独立目录。

兼容事实分别从精确 npm release 或绑定包路径/归档的 GitHub 清单读取，再对当前宿主判断。找兼容旧版本只接受 confirmed compatible，unknown 不被冒充可装；普通发现的未知项仍需人判断，声明不覆盖浏览器插槽、生成产物或多个插件交互。静态能力披露来自目录扫描字段，类型明确区分未扫描与扫描未检出，它是披露而非安全裁决。本包不因“列出shell/network”就证明所选成品已全面审计，更不能证明业务功能运行成功。

#### 证据与依据

**依据 1 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/cordis.patch.yml#L1-L4)

实际挂载模块。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack.
- insert:
    - id: dsh-market
      name: 'dshmarket'
```

**依据 2 · 源码核查**：[src/index.ts:292-305](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/index.ts#L292-L305)

宿主加载与运行时选择起点。

<details>
<summary>查看原文（14行）</summary>

```text
export function apply(ctx: Context, config?: Config): void {
  ctx.inject(['webServer', 'loader'], (hostCtx: Context) => {
    const host = hostCtx as unknown as MarketEffectHost
    // Before any branch mounts: every host-version surface reads detection
    // through the anchor, so it has to be in place before those exist.
    host.effect(() => useLauncherInstallAnchor(ctx), 'dsh-market: launcher install anchor')
    const desktopProfiles = ctx.get('desktopProfiles') as DesktopProfilesLike | undefined
    if (desktopProfiles === undefined) {
      // An explicit `profile:` in cordis.yml is the operator speaking and
      // still wins; the launcher's own answer comes next, and only then the
      // flag-and-default guesswork. The launcher's directory rides along with
      // its name, and never with somebody else's.
      const profileContext = ctx.get('profileContext') as ProfileContextLike | undefined
      const launched = launchedProfile(profileContext)
```

</details>

**依据 3 · 源码核查**：[src/discovery-compatibility.ts:455-473](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/discovery-compatibility.ts#L455-L473)

精确版本清单查验避免latest代替目标。

<details>
<summary>查看原文（19行）</summary>

```text
  private async readNpmManifest(name: string, version: string, registry: string): Promise<unknown> {
    const response = await this.fetcher(`${registryFor(name, registry)}/${encodeURIComponent(name)}/${encodeURIComponent(version)}`, {
      signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
      headers: { accept: 'application/json', 'user-agent': 'dsh-market' },
    })
    if (!response.ok) throw new Error(`HTTP ${String(response.status)}`)
    return await response.json()
  }

  /**
   * Facts for ONE named release, rather than for `latest`.
   *
   * The install and update routes can name the release they are about to
   * install — the compatibility dialog resolves one for this host (#581), and
   * the update route resolves the channel's target — and judging those
   * against `latest` is wrong in both directions: it refuses the compatible
   * older release the dialog just found for this host (because the newest
   * release declares a range this host misses), and it would equally pass a
   * pinned release that is itself incompatible.
```

</details>

**依据 4 · 源码核查**：[src/discovery-compatibility.ts:571-603](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/discovery-compatibility.ts#L571-L603)

只接受声明兼容的候选版本。

<details>
<summary>查看原文（33行）</summary>

```text
export async function findCompatibleVersion(
  npmName: string,
  hostVersion: string,
  hostPackages: ReadonlySet<string>,
  registry: string,
  fetcher: FetchLike = marketFetch,
  minimumVersionExclusive: string | null = null,
  stableOnly = false,
): Promise<string | null> {
  let doc: unknown
  try {
    const res = await fetcher(
      `${registryFor(npmName, registry)}/${encodeURIComponent(npmName)}`,
      { signal: AbortSignal.timeout(15_000), headers: { accept: 'application/json', 'user-agent': 'dsh-market' } },
    )
    if (!res.ok) return null
    doc = await res.json()
  } catch {
    return null
  }
  const versions = record(record(doc)?.versions)
  if (versions === null) return null
  const candidates = Object.keys(versions)
    .filter(version => isSemver(version)
      && (!stableOnly || isStableReleaseVersion(version))
      && (minimumVersionExclusive === null || compareSemver(version, minimumVersionExclusive) > 0))
    .sort((left, right) => compareSemver(right, left))
  for (const version of candidates) {
    if (deriveHostCompatibility(manifestFacts(versions[version]), hostVersion, hostPackages).status === 'compatible') {
      return version
    }
  }
  return null
```

</details>

**依据 5 · 源码核查**：[src/registry.ts:123-138](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/registry.ts#L123-L138)

静态扫描披露的字段与未知语义。

<details>
<summary>查看原文（16行）</summary>

```text
  /**
   * Capability disclosure (#401): what a static scan of the artifact a user
   * would install reported touching — `shell`, `network`, `credentials`,
   * `fs-read`, `fs-write`, `env`, `llm`, `dynamic-code`, ...
   *
   * Disclosure, not a verdict, and the type says so by being ABSENT when the
   * entry was never scanned: `capabilities: []` means "scanned, nothing
   * detected" and `undefined` means "we could not look". The two render
   * differently (未检出 vs 未扫描) because they are different sentences, and
   * only one of them is a statement about the plugin.
   */
  capabilities?: string[]
  /** Combinations a reader should look at, in the scanner's own words. */
  capabilityRedLines?: string[]
  /** When the scan behind those fields ran (ISO 8601). */
  capabilityCheckedAt?: string | null
```

</details>

#### 缺口

- 没有相同宿主同任务的原生Discover与市场查找/安装结果对照
  **影响**：机制差异可解释但节时与误筛率未知
  **进一步探讨**：以同一非关键包和精确版本比较找到来源、确认兼容与实际功能的总时间和错误

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · AI查找和个性化如何从请求变成卡片，能否证明所选插件适合？

**研究主题**：功能与机制、贡献与相对优势、缺陷与关键质疑

#### 完整回答

AI查找先本地去套话、拆中文词段、扩展同义词，按名称/分类/描述等权重及词稀有度召回最多30项；不足用下载量和Star排序的其他条目补齐。接着以当前聊天模型或市场默认模型做一次独立流式调用，让模型在候选中选最多5项，结果名称必须在候选白名单，重复项被去掉。格式异常还会尝试从完整name字段恢复，文本为空时可解析reasoning内容；这些提高可展示性，不证明理由真实、任务匹配或包可用。若关键候选在前30之外，模型没有机会选；无词匹配时热门补位尤其不能冒充需求证据。

/find-plugin命令注册到commands，结果持久在同DSH home的find-plugin-results.json，最多200条，包含原请求与模型理由，不只是会话内临时卡片。搜索个性化开关同样按DSH home保存，开启后读取当前路由提供的已装和收藏条目，作为提示发送给用户配置的模型；它不是独立profile授权。独立“为我推荐”按钮路由直接读取当前profile的已装/收藏并调模型，此动作本身承担授权语义，与搜索开关不同。模型只做选择，不在此模块安装插件；卡片安装仍要走市场确认与安装边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/find-plugin.ts:159-173](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L159-L173)

前30候选与热门补位。

<details>
<summary>查看原文（15行）</summary>

```text
export function recall(registry: Registry, terms: string[], limit = CANDIDATE_LIMIT, exclude: ReadonlySet<string> = new Set()): { candidates: Candidate[]; matched: number } {
  const usable = registry.plugins.filter(plugin => plugin.deprecated !== true && plugin.npm !== 'dshmarket' && plugin.name !== 'dsh-market' && !exclude.has(plugin.name))
  const rarity = termRarity(usable, terms)
  const scored = usable
    .map(plugin => ({ plugin, score: terms.length === 0 ? 0 : scoreFor(plugin, terms, registry.categories, rarity) }))
  const byPopularity = (a: Candidate, b: Candidate): number =>
    downloadsOf(b.plugin) - downloadsOf(a.plugin) || starsOf(b.plugin) - starsOf(a.plugin) || a.plugin.name.localeCompare(b.plugin.name)
  const hits = scored.filter(item => item.score > 0).sort((a, b) => b.score - a.score || byPopularity(a, b))
  const candidates = hits.slice(0, limit)
  if (candidates.length < limit) {
    const taken = new Set(candidates.map(item => item.plugin.name))
    const rest = scored.filter(item => !taken.has(item.plugin.name)).sort(byPopularity)
    candidates.push(...rest.slice(0, limit - candidates.length))
  }
  return { candidates, matched: hits.length }
```

</details>

**依据 2 · 源码核查**：[src/find-plugin.ts:235-286](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L235-L286)

模型提示与白名单过滤。

<details>
<summary>查看原文（52行）</summary>

```text
export function buildPickPrompt(request: string, registry: Registry, found: { candidates: Candidate[]; matched: number }, have?: UserSeeds): { system: string; user: string } {
  const preferZh = /\p{Script=Han}/u.test(request)
  const weak = found.matched === 0
    ? 'None of the candidates matched the request\'s words; they are only the most-downloaded plugins. Return an empty list unless one genuinely fits.'
    : found.matched < found.candidates.length
      ? `Only the first ${found.matched} candidates matched the request\'s words; the rest are popular fillers.`
      : ''
  const system = [
    'You help a user pick plugins from the DSH plugin market. Answer ONLY with one JSON object, no prose around it:',
    '{"intro": string, "picks": [{"name": string, "why": string}]}',
    '- picks: the 1 to 5 candidates that best fit what the user actually wants, best first. Use names exactly as listed. Never include a name that is not in the list. Return [] if none fit.',
    '- why: one short sentence on why it fits THIS request (not a copy of its description).',
    '- intro: one short sentence framing the result, e.g. what you understood they want, or that nothing fits.',
    `- Write intro and why in ${preferZh ? 'Simplified Chinese' : 'the language of the request'}.`,
    weak,
    have === undefined ? '' : '- The user\'s installed and favorited plugins are listed too (installed ones are already left out of the candidates). Use them to judge what suits this user; skip near-duplicates of what they have.',
  ].filter(Boolean).join('\n')
  const mine = have === undefined ? [] : [
    '', 'Already installed:', ...(have.installed.length === 0 ? ['(none)'] : have.installed.map(plugin => `- ${plugin.name}: ${describe(plugin, preferZh).slice(0, 160)}`)),
    'Favorited:', ...(have.favorited.length === 0 ? ['(none)'] : have.favorited.map(plugin => `- ${plugin.name}: ${describe(plugin, preferZh).slice(0, 160)}`)),
  ]
  const user = [`Request: ${request}`, ...mine, '', 'Candidates:', ...found.candidates.map(({ plugin }, i) => catalogLine(plugin, i, registry, preferZh))].join('\n')
  return { system, user }
}

/** Pull the JSON object out of a model reply (it may wrap it in a code fence). */
export function parsePickReply(text: string, allowed: Set<string>, max = 5): { intro: string; picks: Array<{ name: string; why: string }> } {
  const start = text.indexOf('{'), end = text.lastIndexOf('}')
  let value: { intro?: unknown; picks?: unknown } | null = null
  if (start >= 0 && end > start) {
    try { value = JSON.parse(text.slice(start, end + 1)) as { intro?: unknown; picks?: unknown } } catch { value = null }
  }
  if (value === null) {
    // A reply cut off at the token limit (or with a stray character) still
    // names its picks: take every complete {"name": ..., "why": ...} in order.
    const found = [...text.matchAll(/"name"\s*:\s*"((?:[^"\\]|\\.)*)"(?:\s*,\s*"why"\s*:\s*"((?:[^"\\]|\\.)*)")?/gu)]
    if (found.length === 0) throw new Error('the model did not return JSON')
    const intro = /"intro"\s*:\s*"((?:[^"\\]|\\.)*)"/u.exec(text)?.[1] ?? ''
    value = { intro, picks: found.map(match => ({ name: match[1], why: match[2] ?? '' })) }
  }
  const picks: Array<{ name: string; why: string }> = []
  const seen = new Set<string>()
  if (Array.isArray(value.picks)) {
    for (const item of value.picks) {
      const name = typeof item?.name === 'string' ? item.name.trim() : ''
      if (!allowed.has(name) || seen.has(name)) continue
      seen.add(name)
      picks.push({ name, why: typeof item?.why === 'string' ? item.why.trim().slice(0, 300) : '' })
      if (picks.length === max) break
    }
  }
  return { intro: typeof value.intro === 'string' ? value.intro.trim().slice(0, 300) : '', picks }
```

</details>

**依据 3 · 源码核查**：[src/find-plugin.ts:331-382](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L331-L382)

流式模型调用、错误与reasoning回退。

<details>
<summary>查看原文（52行）</summary>

```text
    const stream = options.llm.stream({
      provider: selection.provider,
      model: selection.model,
      // Picking from a list needs little thought, and a model set to think
      // hard can spend the whole budget thinking and answer nothing (seen with
      // DeepSeek at "high"). A selection that names an effort supports
      // efforts, so it can be turned down; one that does not is left alone.
      ...(selection.reasoningEffort === undefined ? {} : { reasoningEffort: selection.reasoningEffort === 'off' ? 'off' : 'low' }),
      system: prompt.system,
      messages: [Object.freeze({
        id: randomUUID(), role: 'user',
        content: [{ type: 'text', text: prompt.user }],
        source: { kind: 'plugin:dshmarket' },
      })],
      maxTokens: options.maxTokens,
      temperature: options.temperature,
      ...(options.signal === undefined ? {} : { signal: options.signal }),
    })
    for await (const chunk of stream) {
      if (seen.length < 12) seen.push(JSON.stringify(chunk).slice(0, 300))
      if (chunk.type === 'text-delta' && typeof chunk.text === 'string') text += chunk.text
      else if (chunk.type === 'reasoning-delta' && typeof chunk.text === 'string') reasoning += chunk.text
      else if (chunk.type === 'finish') {
        // The host ends a failed call (no key, bad key, provider down) with a
        // finish whose reason is an error, rather than throwing.
        const reason = (chunk as { reason?: { kind?: unknown; failure?: { message?: unknown; code?: unknown } } }).reason
        if (reason?.kind === 'error') {
          const failure = reason.failure ?? {}
          throw Object.assign(new Error(typeof failure.message === 'string' ? failure.message : 'the model call failed'), typeof failure.code === 'string' ? { code: failure.code } : {})
        }
      } else if (chunk.type === 'error') {
        const failure = (chunk as { error?: unknown; message?: unknown }).error ?? (chunk as { message?: unknown }).message
        throw failure instanceof Error ? failure : Object.assign(new Error(typeof failure === 'string' ? failure : JSON.stringify(failure)), typeof failure === 'object' && failure !== null ? { cause: failure } : {})
      }
    }
  } catch (error) {
    const code = errorCode(error)
    if (code === 'MISSING_CREDENTIAL' || code === 'INVALID_CREDENTIAL') throw new FindPluginError('no-model', NO_MODEL)
    const reason = error instanceof Error ? error.message : String(error)
    throw new FindPluginError('model-failed', `模型这次没有回答（${reason}）。请稍后重试，或换一个模型。 / The model did not answer (${reason}). Try again, or switch models.`)
  }
  let parsed: ReturnType<typeof parsePickReply>
  try {
    const allowed = new Set(options.candidates.map(item => item.plugin.name))
    // Out of budget before the answer: the thinking often already holds it.
    parsed = text.trim() === '' && reasoning !== '' ? parsePickReply(reasoning, allowed, options.max) : parsePickReply(text, allowed, options.max)
  } catch {
    logEvent('warn', 'find-plugin', `unreadable model reply (${String(text.length)} chars, ${String(reasoning.length)} thinking): ${text.slice(0, 300)} … ${text.slice(-200)} | chunks: ${seen.join(' ')}`)
    throw new FindPluginError('model-failed', '模型的回答格式不对，没法整理成结果。请重试一次。 / The model\'s answer was not in the expected shape. Try again.')
  }
  const byName = new Map(options.candidates.map(item => [item.plugin.name, item.plugin]))
  return { intro: parsed.intro, picks: parsed.picks.map(({ name, why }) => ({ plugin: byName.get(name)!, why })) }
```

</details>

**依据 4 · 源码核查**：[src/find-plugin.ts:525-549](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L525-L549)

同home保留200条结果。

<details>
<summary>查看原文（25行）</summary>

```text
const RESULT_LIMIT = 200
let results: Map<string, FindResult> | null = null
export function resultsFile(home: string = resolveDshHome()): string {
  return join(home, 'dsh-market', 'find-plugin-results.json')
}
function loadResults(file: string): Map<string, FindResult> {
  if (results !== null) return results
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, FindResult>
    results = new Map(Object.entries(raw))
  } catch {
    results = new Map()
  }
  return results
}
export function rememberResult(id: string, result: FindResult, file: string = resultsFile()): void {
  const map = loadResults(file)
  map.delete(id)
  map.set(id, result)
  while (map.size > RESULT_LIMIT) map.delete(map.keys().next().value as string)
  try {
    mkdirSync(dirname(file), { recursive: true })
    const temp = `${file}.${process.pid}.tmp`
    writeFileSync(temp, JSON.stringify(Object.fromEntries(map)))
    renameSync(temp, file)
```

</details>

**依据 5 · 源码核查**：[src/find-plugin.ts:587-624](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L587-L624)

同home授权及已装/收藏读取。

<details>
<summary>查看原文（38行）</summary>

```text
/**
 * Whether AI search and `/find-plugin` may read the user's installed and
 * favorited plugins. Off until the user allows it from a result; one switch
 * for the whole DSH home, kept beside the saved results.
 */
export function consentFile(home: string = resolveDshHome()): string {
  return join(home, 'dsh-market', 'ai-consent.json')
}

export function usesMyPlugins(file: string = consentFile()): boolean {
  try {
    return (JSON.parse(readFileSync(file, 'utf8')) as { useMyPlugins?: unknown }).useMyPlugins === true
  } catch {
    return false
  }
}

export function setUsesMyPlugins(on: boolean, file: string = consentFile()): void {
  mkdirSync(dirname(file), { recursive: true })
  const temp = `${file}.${process.pid}.tmp`
  writeFileSync(temp, JSON.stringify({ useMyPlugins: on }))
  renameSync(temp, file)
}

export interface UserPluginLists { installed: string[]; favorites: string[] }
let readUserPlugins: () => UserPluginLists = () => ({ installed: [], favorites: [] })
/** Set by the routes, which know the active profile. */
export function setUserPluginsReader(next: () => UserPluginLists): void { readUserPlugins = next }

/** The user's own plugins for a search, or undefined when they have not allowed it. */
function allowedSeeds(registry: Registry): UserSeeds | undefined {
  if (!usesMyPlugins()) return undefined
  try {
    return userSeeds(registry, readUserPlugins())
  } catch (error) {
    logEvent('warn', 'find-plugin', `could not read the user's plugins: ${error instanceof Error ? error.message : String(error)}`)
    return undefined
  }
```

</details>

**依据 6 · 源码核查**：[src/find-plugin.ts:654-701](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L654-L701)

真实命令入口和当前模型选择。

<details>
<summary>查看原文（48行）</summary>

```text
/** Run one `/find-plugin`. The structured result is kept under the command id for the card renderer. */
export async function runFindPlugin(
  invocation: FindPluginInvocation,
  loadRegistry: () => Promise<Registry>,
  models: ModelAccess,
): Promise<FindPluginResult> {
  if (invocation.rawInput.trim() === '') return { kind: 'error', text: USAGE }
  let registry: Registry
  try {
    registry = await loadRegistry()
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error)
    return { kind: 'error', text: `暂时拿不到插件目录（${reason}），所以没法搜索。请稍后再试，或直接打开「插件」页的「插件市场」。 / Could not reach the plugin catalog (${reason}), so there is nothing to search. Try again in a moment, or open Plugins → Plugin Market.` }
  }
  // The model this chat is using, so the answer costs what the user expects;
  // the default model when the agent does not say.
  const own = invocation.agent.options
  const selection = own?.provider && own?.model ? { provider: own.provider, model: own.model } : models.defaultSelection()
  try {
    const have = allowedSeeds(registry)
    const result = await findPlugins({ request: invocation.rawInput, registry, llm: models.llm(), selection, ...(have === undefined ? {} : { have }), signal: invocation.signal })
    rememberResult(invocation.commandId, result)
    // Also as this session's latest: on a blank session the chat draws no
    // command row, and the client shows the result from here instead.
    if (typeof invocation.agent.id === 'string') rememberResult(`session:${invocation.agent.id}`, result)
    return { kind: 'success', text: resultText(result) }
  } catch (error) {
    return { kind: 'error', text: error instanceof FindPluginError ? error.message : String(error) }
  }
}

/** The slice of the host's `commands` service this uses. */
export interface CommandsServiceLike {
  register(definition: {
    name: string
    description: string
    input?: { hint: string }
    handler(invocation: FindPluginInvocation): FindPluginResult | Promise<FindPluginResult>
  }): () => void
}

/** Register `/find-plugin` on a host that has the command registry. */
export function registerFindPlugin(commands: CommandsServiceLike, loadRegistry: () => Promise<Registry>, models: ModelAccess): () => void {
  return commands.register({
    name: 'find-plugin',
    description: '用一句话在插件市场里找插件（用你的模型挑选） / Describe what you want; your model picks plugins from the market',
    input: { hint: '例如：通知类型的插件 · e.g. SEO writing' },
    handler: invocation => runFindPlugin(invocation, loadRegistry, models),
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:4334-4343](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L4334-L4343)

单独推荐动作读取当前profile列表。

<details>
<summary>查看原文（10行）</summary>

```text
        const body = await readJsonBody(request).catch(() => null) as { exclude?: unknown; lang?: unknown } | null
        const exclude = Array.isArray(body?.exclude) ? body.exclude.filter((name): name is string => typeof name === 'string').slice(0, 200) : []
        try {
          const result = await aiRecommend({
            installed: Object.keys(readInstalled(config.profile, activeProfileDir)),
            favorites: readMarketState(activeProfileDir).favorites ?? [],
            exclude,
            preferZh: body?.lang !== 'en' && body?.lang !== 'ja',
          }, () => loadRegistry())
          sendJson(response, 200, { result })
```

</details>

#### 缺口

- 缺少真实查询的候选召回率、模型理由质量与同home多profile授权体验
  **影响**：无法把自然语言便利升级为更准确推荐或严格profile隔离
  **进一步探讨**：用人工标注任务记录相关插件是否进前30、热门填充误选、发送内容和profile切换后的授权表现

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 安装请求如何绑定来源、宿主profile和实际激活？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

入口按显式配置与启动器profile信息选择普通Web、官方Desktop或第三方Desktop运行时。官方desktop名称走宿主pluginManager，不把CLI成功写到web误认为Desktop已安装；有desktopProfiles的宿主走对应运行时，依赖宿主提供稳定目录与服务。Web路由统一先咨询宿主request gate，缺gate时是透传；Desktop因未核实其协议认证而不启用该围栏。普通写请求另查Host、Origin和cross-site，但缺Origin可被非浏览器客户端接受，不能把同源检查当账号认证。

安装在变更锁内重读目录，要求候选URL存在并满足组织allow/pin，再解析明确版本和来源。别名去重区分相同仓库独立子包和真正重复包，失败遗留依赖可在同身份且未激活时重试。安装后分别核对声明与依赖、客户端可解析、热挂载及激活状态，检测风险时给回滚ID或明确不可用原因。包管理器exit0、磁盘存在、宿主加载与目标功能是不同层，真实功能还需用户在正确profile执行；不能因为HTTP返回200或UI刷新就判为可用。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:305-346](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/index.ts#L305-L346)

官方Desktop与profile/目录决策。

<details>
<summary>查看原文（42行）</summary>

```text
      const launched = launchedProfile(profileContext)
      // The official Electron app owns this profile. Its CLI refuses
      // `--profile desktop` (outright up to dsh 0.2.0-rc.1; from rc.2 it
      // admits only Desktop's own carrier, and only with Desktop fully quit —
      // never from inside the running app this market lives in), so use the
      // app's pluginManager service.
      // Looking it up at request time lets the market mount before the
      // service while still failing closed if it never becomes available.
      // The dsh CLI refuses a profile by NAME — `profile.toLowerCase() ===
      // "desktop"` (@deepseek-ai/dsh 0.1.7-alpha.2; from 0.2.0-rc.2 it lets
      // only Desktop's own carrier through, with the app quit) — so from
      // inside a running Desktop a launched profile with that name can never
      // be changed through `dsh plugin`, whatever the install layout. Detection follows the same rule rather than the
      // app.asar anchor shape an earlier draft keyed on: the official desktop
      // host is not published, its layout could not be checked, and a host
      // that missed the anchor test fell straight back to the CLI and failed
      // every install (#702). A third-party shell announces itself through
      // `desktopProfiles`, and this whole block runs only when that service
      // is absent, so this never takes a third-party shell's profile.
      const configured = config?.profile
      const configuredDesktop = configured !== undefined && configured.toLowerCase() === 'desktop'
      const officialElectron = launched !== undefined && launched.name.toLowerCase() === 'desktop'
      // An explicitly configured `profile: desktop` takes this branch too. The
      // CLI refuses that profile by NAME (see above — from inside the running
      // app on every version), so routing it there — which is what
      // an operator's own workaround for a host that hides `profileContext`
      // does (#744) — makes every install fail for certain. The configuration
      // still wins over the launcher for the name; it just cannot win a branch
      // that is guaranteed to fail.
      if (configuredDesktop || (configured === undefined && officialElectron)) {
        const profileName = configured ?? launched!.name
        // The launcher owns where a profile lives — and its directory rides
        // along only when the launcher is the one that named this profile.
        const profileDirectory = launched !== undefined && launched.name.toLowerCase() === profileName.toLowerCase()
          ? launched.dir
          : undefined
        const runtime = createOfficialDesktopRuntime(
          () => hostCtx.get('pluginManager') as OfficialPluginManagerLike | undefined,
          profileName,
          profileDirectory,
          // Hand the invocation to the runtime only. Do not register it
          // globally: other official-desktop installs still go through the
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:3471-3494](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L3471-L3494)

全路由宿主gate及Desktop例外。

<details>
<summary>查看原文（24行）</summary>

```text
  /**
   * Every market route goes through the host's own request gate first (#603).
   *
   * One entry for all of them, so a route added later cannot forget it: the
   * report's ask was a single place that holds for reads and writes alike. On a
   * host that publishes no gate this is a pass-through.
   *
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

**依据 3 · 源码核查**：[src/http.ts:213-256](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/http.ts#L213-L256)

Host/Origin/cross-site边界与缺Origin分支。

<details>
<summary>查看原文（44行）</summary>

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
  try {
    const originUrl = new URL(origin)
    if (originUrl.host === host) return true
    if (originUrl.port === '' && host !== undefined && loopbackAuthority(host)) {
      const hostUrl = parseAuthority(host)
      return hostUrl !== null && originUrl.hostname === hostUrl.hostname
    }
    return false
  } catch {
    return false
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:9236-9267](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L9236-L9267)

锁内目录、组织与来源检查。

<details>
<summary>查看原文（32行）</summary>

```text
          await withMutationLock(response, 'install', async () => {
            const force = body.force === true
            const url = typeof body.url === 'string' ? body.url : ''
            // A release the user picked from the refusal dialog's own search
            // (#581): it was confirmed compatible by /dsh-market/find-compatible,
            // so it is pinned below instead of resolving `latest` again.
            let requestedVersion = typeof body.version === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(body.version)
              ? body.version
              : null
            const registry = await loadRegistry()
            const entry = registry.plugins.find(p => p.url.toLowerCase() === url.toLowerCase())
            if (entry === undefined) {
              logEvent('warn', 'install-rejected', `not in curated registry: ${url.slice(0, 120)}`)
              sendJson(response, 400, { error: 'plugin is not in the curated registry' })
              return
            }
            // The list above is already narrowed by the policy's `allow`; asked
            // again here so this route does not depend on that happening
            // upstream (the check that matters is the one next to the install).
            if (!entryAllowed(entry, getPolicy().allow)) {
              logEvent('warn', 'install-rejected', `not allowed by policy: ${entry.name}`)
              sendJson(response, 403, { error: '你的组织不允许安装这个插件 / your organization does not allow installing this plugin' })
              return
            }
            // The organization fixed this package's version: that exact release
            // installs, whatever the page asked for.
            const orgPin = typeof entry.npm === 'string' ? pinnedVersion(entry.npm) : undefined
            if (orgPin !== undefined) requestedVersion = orgPin
            const plainTarget = installTargetFor(entry)
            if (plainTarget === null) {
              sendJson(response, 400, { error: 'unsupported source url' })
              return
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:9311-9346](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L9311-L9346)

别名和失败遗留重试判断。

<details>
<summary>查看原文（36行）</summary>

```text
            // Duplicate guard (#27): the same plugin listed under another name
            // (an alias entry pointing at the same repo) must never install
            // twice — two loader entries with one id brick the next boot.
            // Monorepo subpath entries (distinct plugins in one repo) pass:
            // their entry urls differ by subpath and identity is name-based.
            // A dependency left in package.json by a FAILED install (blocked
            // build scripts: pnpm writes the manifest, then exits 1) is NOT a
            // duplicate — it was never activated. Blocking the retry would
            // make the approve-builds flow dead-end, so a leftover that is the
            // SAME package/source (not a repo-only alias of a different entry)
            // and is not yet active (bundle layer or live mount) may be retried.
            const installedNow = readInstalled(config.profile, activeProfileDir)
            const aliasOf = findInstalledAlias(entry, installedNow)
            // When the duplicate guard allows a retry of a leftover dep, that
            // name must be treated as "newly added" by the post-install
            // validation and hot-mount below (it IS in package.json from the
            // failed attempt, so the plain before/after diff would miss it).
            let retryAlias: string | null = null
            if (aliasOf !== null) {
              // Same install? The leftover's own name/spec must match what we
              // are about to add — an npm entry retries under its npm name; a
              // github entry's package.json spec equals the target.
              // Compared as IDENTITIES, not as strings. One GitHub plugin has
              // several historical spellings — mutable or pinned `github:`
              // shortcuts and legacy proxied codeload tarballs — so a literal
              // comparison would call a leftover from before an upgrade or
              // region switch "a different source" and refuse the retry it
              // exists to allow. `repoOfTarget` returns null for npm names and file
              // links, which fall through to the string comparison below.
              const installedSpec = String(installedNow[aliasOf] ?? '').replace(/^file:/, '')
              const wantedSpec = String(target).replace(/^file:/, '')
              const installedRepo = repoOfTarget(installedSpec)
              const wantedRepo = repoOfTarget(wantedSpec)
              const sameSource = aliasOf.toLowerCase() === (entry.npm ?? '').toLowerCase()
                || (installedRepo !== null && installedRepo === wantedRepo)
                || installedSpec.toLowerCase() === wantedSpec.toLowerCase()
```

</details>

**依据 6 · 源码核查**：[src/routes.ts:9722-9769](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L9722-L9769)

激活核对、风险与回滚可用性。

<details>
<summary>查看原文（48行）</summary>

```text
                activation = {}
                const live = liveNames()
                // Same facts the mount decision above used, so the verdict
                // cannot disagree with it within one request.
                const hostFacts = defaultHostRuntimeFacts(activeProfileDir)
                for (const name of added) {
                  const result = verifyActivation(config.profile, name, live, activeProfileDir, disabled.has(name), hostFacts)
                  const failure = themeFailures.get(name)
                  activation[name] = failure === undefined
                    ? result
                    : { ...result, state: 'failed', hot: false, reasons: [failure] }
                }
              }
            }
            if (ok && addedPackages.length > 0) {
              const after = assessProfile(config.profile, activeProfileDir)
              const risks = introducedRisks(compatibilityBefore, after)
              // Cross-layer name shadowing this install introduced (#230).
              // Shares the rollback id with the peer risks when both fire:
              // one operation, one thing to undo.
              const shadowed = introducedDuplicateNames(compatibilityBefore, after)
              // A client bundle that no longer parses (#222): pnpm can leave
              // one half-written or patch-mangled, and today that surfaces
              // as a blank settings page long after the install reported
              // success, with nothing connecting the two.
              const brokenBundles = newlyBrokenBundles(
                bundlesBefore,
                [
                  ...addedPackages
                    .map(pkg => ({ name: pkg, check: checkClientBundle(config.profile, pkg, activeProfileDir) }))
                    .filter(entry => !entry.check.ok)
                    .map(entry => ({ name: entry.name, reason: entry.check.reason ?? 'parse failed' })),
                  ...brokenClientBundles(config.profile, activeProfileDir),
                ].filter((entry, index, all) => all.findIndex(other => other.name === entry.name) === index),
              )
              const needsRollback = risks.length > 0 || brokenBundles.length > 0
              if (needsRollback || shadowed.length > 0) {
                const rollbackId = needsRollback ? savePendingRollback({ kind: 'install', names: addedPackages }) : null
                compatibility = {
                  code: 'soft-incompatible',
                  risks,
                  shadowedNames: shadowed.length > 0 ? shadowed : undefined,
                  brokenBundles: brokenBundles.length > 0 ? brokenBundles : undefined,
                  ...(needsRollback
                    ? rollbackId !== null
                      ? { rollbackId }
                      : { rollbackUnavailable: '安装完成后无法安全捕获 profile 状态，因此自动回滚不可用；需要时请手工卸载新安装的插件。 / The post-install profile state could not be captured safely, so automatic rollback is unavailable. Remove the newly installed plugin manually if needed.' }
                    : {}),
```

</details>

#### 缺口

- 未独立核实各实际宿主manager、request gate与包管理器运行行为
  **影响**：本包接线不能证明认证或安装结果在所有宿主一致
  **进一步探讨**：固定Web和Desktop实际版本，分别核对目标profile、未认证请求、落盘包与可调用功能

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · Desktop管理器迟迟不回答或拆旧后失败时如何保持可解释恢复？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

官方Desktop先安装，遇already-installed时记下原/目标版本和来源，再移除旧包、安装新包；市场自身走原位更新避免卸载正在执行的恢复代码。remove或install等待上限为宿主10分钟静默看门狗再加1分钟余量，整次更新另有组合上限；这是源码选择的等待策略，不是本次测得所有宿主都恰好10分钟。超时返回operation-incomplete并要求重启协调，不能声称没写入或已回滚。

底层manager Promise独立保存在process global Set，直到真正settle才删除，市场重载不丢失“仍有包写入”的事实；route的busy判断同时考虑这个Set，避免等待结束就立刻放行下一次变更。如果宿主Promise永不结束，保守占用可能一直到进程重启，属于一致性与可用性的取舍。已进入restart-required的更新也记在进程级状态，后续bundle-in-use给重启优先提示。

启动修复依据磁盘版本与组合状态，不根据上次意图盲写：目标或原版本已加载可结清；其他已组合版本保留并报冲突；缺失或未组合时尝试重装，already-installed且manager支持remove时补拆换。错误分类区分kept-old、not-composed、timeout等，达到三次自动尝试上限交回用户。成功manager回执仍是外部依赖，修复记录不是业务功能探针。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-desktop.ts:55-81](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/official-desktop.ts#L55-L81)

管理器等待上限与宿主静默诊断余量。

<details>
<summary>查看原文（27行）</summary>

```text
 * to race pnpm's retry budget — a transient that resolves by itself must not
 * turn into a permanent failure.
 *
 * Their length is also not ours to pick: every call bounded here has the
 * host's own silence watchdog inside it (#1250). The plugin manager kills a
 * pnpm child that prints nothing for ten minutes (`idleTimeoutMs` of
 * `@deepseek-ai/dsh-plugin-manager`, the default #817 was reported against)
 * and answers `dsh: pnpm printed nothing for 600000ms and was terminated` —
 * the sentence `classifyPnpmFailure` turns into "the network stalled, nothing
 * was installed" (`./pnpm-compat.ts`). A market bound at or under that
 * instant is not a backstop for a silent host; it is the thing that decides
 * the answer, and the host's own diagnosis is replaced by
 * `operation-incomplete` — "the change may already be on disk", said about a
 * profile that a killed pnpm had not touched.
 */
const HOST_IDLE_WATCHDOG_MS = 600_000
/** Long enough for the host to turn a killed child into its answer. */
const DEADLINE_MARGIN_MS = 60_000
const REMOVE_DEADLINE_MS = HOST_IDLE_WATCHDOG_MS + DEADLINE_MARGIN_MS
const INSTALL_DEADLINE_MS = HOST_IDLE_WATCHDOG_MS + DEADLINE_MARGIN_MS
/**
 * The bound around a whole `add`, which may be an update and therefore holds
 * two bounded phases in a row. It has to stay strictly longer than their sum:
 * an outer bound equal to the inner one fires at the same instant and decides
 * the answer instead — that is how a timeout stopped being reported as
 * "the update did not finish" and started being reported as the plain
 * operation refusal (#928's spec caught it).
```

</details>

**依据 2 · 源码核查**：[src/official-desktop.ts:404-474](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/official-desktop.ts#L404-L474)

先记journal再拆换、失败与自更新分支。

<details>
<summary>查看原文（71行）</summary>

```text
async function installOrReinstall(
  manager: OfficialPluginManagerLike,
  spec: string,
  options: { requestId?: string; registry?: string },
  context?: UpdateContext,
): Promise<ManagedResult> {
  const install = (): Promise<ManagedResult> => trackManagerWrite(manager.installBundle(spec, options))
  let first: ManagedResult
  try {
    // Bounded like every other manager call: a plain install the host never
    // answers used to be bounded only by the whole-operation backstop, which
    // has to cover remove-then-install and is therefore twice as long (#1250).
    first = await withDeadline(install(), INSTALL_DEADLINE_MS, `install ${spec}`)
  } catch (error) {
    if (error instanceof DeadlineExceeded) return unanswered()
    if (managementCode(error) !== 'already-installed') throw error
    first = { application: 'failed', error }
  }
  if (first.application !== 'failed' || managementCode(first.error) !== 'already-installed') return first
  const name = registryNameOf(spec)
  // A refusal we cannot turn into a name is the manager's answer to give.
  if (name === undefined) return first
  // Removing the market would unload this very code before the reinstall runs
  // (#900). Overlay the version with the host's own pnpm instead — no remove.
  if (SELF_NAMES.has(name)) {
    return updateMarketInPlace(spec, name, options, context)
  }
  const record = context === undefined
    ? undefined
    : context.journal.begin({
      profile: context.profile,
      name,
      from: readInstalledVersion(context.profile, name, context.profileDirectory) ?? '',
      to: targetVersionOf(spec),
      spec,
    })
  progress.lastLine = '先移除旧版本，桌面端才能装新版本 / Removing the old version so the desktop app can install the new one'
  let removed: ManagedResult
  try {
    removed = await withDeadline(trackManagerWrite(manager.removeBundle(name)), REMOVE_DEADLINE_MS, `remove ${name}`)
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
    if (record !== undefined) context?.journal.finish(record.id)
    throw error
  }
  if (removed.application === 'failed' || removed.application === 'cancelled') {
    // Nothing was unloaded, so there is nothing for a later start to repair.
    if (record !== undefined) context?.journal.finish(record.id)
    // An update already landed behind a restart in this process, and the
    // host now says `bundle-in-use` for a plugin it put back itself (#1253).
    // It is the same wait for a restart, not a plugin that is really in use.
    if (removed.application === 'failed' && managementCode(removed.error) === 'bundle-in-use' && restartPending()) {
      return { ...removed, needsRestart: true }
    }
    return removed
  }
  if (record !== undefined) context?.journal.mark(record.id, 'installing')
  progress.lastLine = '正在安装新版本 / Installing the new version'
  try {
    const installed = await withDeadline(install(), INSTALL_DEADLINE_MS, `install ${spec}`)
    if (installed.application === 'failed' || installed.application === 'cancelled') {
      // The replacement did not land; the record stays so the next start can
      // put it back rather than leaving the package gone.
      return installed
    }
    if (record !== undefined) context?.journal.finish(record.id)
    if (installed.application === 'restart-required') markRestartPending()
    return installed
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
    throw error
```

</details>

**依据 3 · 源码核查**：[src/official-desktop.ts:490-525](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/official-desktop.ts#L490-L525)

进程级重启标记与真实写Promise追踪。

<details>
<summary>查看原文（36行）</summary>

```text
const RESTART_SLOT = Symbol.for('dshmarket.officialDesktop.restartPending')

/**
 * Whether an update in THIS host process already settled behind a restart.
 * On the global like the slots below: a market reload keeps the process, and
 * the process is what has to restart.
 */
function restartPending(): boolean {
  return (globalThis as { [RESTART_SLOT]?: boolean })[RESTART_SLOT] === true
}
function markRestartPending(): void {
  (globalThis as { [RESTART_SLOT]?: boolean })[RESTART_SLOT] = true
}
/** Test seam: a new host process starts with nothing pending. */
export function forgetRestartPending(): void {
  delete (globalThis as { [RESTART_SLOT]?: boolean })[RESTART_SLOT]
}

/** What the user reads when the host asks for a restart before the next update (#1253). */
const RESTART_FIRST_MESSAGE = '这一轮只能更新到这里。重启后再点「全部更新」继续。 / This run can only go this far. Restart, then click Update all to continue.'

const OPERATION_SLOT = Symbol.for('dshmarket.officialDesktop.operation')
const WRITE_SLOT = Symbol.for('dshmarket.officialDesktop.packageWrites')

/** Keep the native promises across a market reload, including after a route deadline. */
function pendingManagerWrites(): Set<Promise<ManagedResult>> {
  const processState = globalThis as { [WRITE_SLOT]?: Set<Promise<ManagedResult>> }
  return processState[WRITE_SLOT] ??= new Set()
}

function trackManagerWrite(work: Promise<ManagedResult>): Promise<ManagedResult> {
  const pending = pendingManagerWrites()
  pending.add(work)
  const remove = () => pending.delete(work)
  void work.then(remove, remove)
  return work
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:2399-2404](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L2399-L2404)

忙状态包含未settle的manager写入。

```text
    }
  }

  function checkoutCommandBusy(): boolean {
    return mutationBusy || commands.busy?.() === true || commands.packageWritesSettled?.() === false
  }
```

**依据 5 · 源码核查**：[src/pending-updates.ts:350-383](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/pending-updates.ts#L350-L383)

按磁盘与组合判定及自动次数上限。

<details>
<summary>查看原文（34行）</summary>

```text
export async function repairInterruptedUpdates(options: RepairOptions): Promise<RepairReport> {
  const journal = options.journal ?? PendingUpdateJournal.forProfile(options.profileDirectory)
  const report: RepairReport = { reinstalled: [], finished: [], failed: [], abandoned: [] }
  const pending = journal.list().filter(entry => entry.profile === options.profile)
  for (const entry of pending) {
    const installed = readInstalledVersion(options.profile, entry.name, options.profileDirectory)
    const settled = composed(options.profile, options.profileDirectory, entry.name)
    // Settled means every half agrees: the build is on disk, the profile
    // declares it, and a bundle-layer package is listed as one. "On disk but
    // no longer composed" is the interrupted removal itself, so it falls
    // through to the reinstall.
    if (installed !== null && settled && (entry.to === '' || installed === entry.to || installed === entry.from)) {
      journal.finish(entry.id)
      report.finished.push(entry.name)
      continue
    }
    if (installed !== null && settled) {
      journal.bump(entry.id)
      report.failed.push({
        name: entry.name,
        cause: 'version-changed',
        reason: `installed version ${installed} is neither ${entry.from || 'the previous build'} nor ${entry.to || 'the requested build'}`,
      })
      continue
    }
    if (entry.attempts >= MAX_AUTO_REPAIR_ATTEMPTS) {
      // Not bumped: the count is already the reason this start does nothing,
      // and growing it would re-log the same sentence on every boot.
      if (entry.attempts === MAX_AUTO_REPAIR_ATTEMPTS) {
        logEvent('error', 'update-repair', gaveUpCopy(entry.name, entry.attempts))
      }
      report.failed.push({ name: entry.name, reason: gaveUpCopy(entry.name, entry.attempts), cause: 'abandoned' })
      report.abandoned.push(entry.name)
      continue
```

</details>

**依据 6 · 源码核查**：[src/pending-updates.ts:393-460](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/pending-updates.ts#L393-L460)

重装拆换、保留旧版本与not-composed分类。

<details>
<summary>查看原文（68行）</summary>

```text
      const timeoutMs = options.timeoutMs ?? REPAIR_INSTALL_TIMEOUT_MS
      const install = (): ReturnType<RepairManager['installBundle']> => withDeadline(
        options.manager.installBundle(spec, { requestId: randomUUID() }), timeoutMs, `reinstall ${spec}`)
      let result: Awaited<ReturnType<RepairManager['installBundle']>>
      try {
        result = await install()
      } catch (error) {
        if (errorCodeOf(error) !== 'already-installed') throw error
        result = { application: 'failed', error }
      }
      if (result.application === 'failed' && errorCodeOf(result.error) === 'already-installed'
        && options.manager.removeBundle !== undefined) {
        // The same two steps the normal update takes (#896): the interrupted
        // update stopped before its removal landed, so the dependency is
        // still declared and `add` is refused. Finish the removal, then add.
        const removed = await withDeadline(options.manager.removeBundle(entry.name), timeoutMs, `remove ${entry.name}`)
        if (removed.application === 'failed' || removed.application === 'cancelled') {
          lastCode = errorCodeOf(removed.error)
          cause = 'refused'
          throw new Error(withCode(`the desktop app could not remove the old build first (${removed.application})`, lastCode))
        }
        journal.mark(entry.id, 'installing')
        result = await install()
      }
      lastCode = errorCodeOf(result.error)
      if (!managerSucceeded(result)) {
        // A failed application can still be a written package: pnpm may have
        // installed the new build while only the live start failed — which is
        // exactly the plugin whose teardown is still stuck. The disk is the
        // authority, not the application stage.
        const after = readInstalledVersion(options.profile, entry.name, options.profileDirectory)
        if (after === null || (entry.to !== '' && after !== entry.to)) {
          // The update never landed but the build from before is installed and
          // loaded: nothing is broken and nothing is left to repair, so this
          // is neither a refusal nor a reason to count toward giving up. The
          // user can run the update again from the market.
          if (entry.from !== '' && after === entry.from && composed(options.profile, options.profileDirectory, entry.name)) {
            journal.finish(entry.id)
            report.failed.push({
              name: entry.name,
              cause: 'kept-old',
              reason: withCode(`still on ${after}; the update to ${entry.to || spec} did not run (${result.application})`, lastCode),
            })
            logEvent('warn', 'update-repair',
              withCode(`${entry.name}: the interrupted update did not finish and ${after} is still installed and loaded; the update can be retried from the market (${result.application})`, lastCode))
            continue
          }
          cause = 'refused'
          throw new Error(withCode(`the desktop app refused the reinstall (${result.application})`, lastCode))
        }
        // The files landing is not the same answer as the plugin loading:
        // this manager failed at the application stage, which is the step
        // that writes `dsh.profile.bundles` (#928). Finishing here cleared
        // the record for a package the host still would not compose.
        if (!composed(options.profile, options.profileDirectory, entry.name)) {
          cause = 'not-composed'
          throw new Error(withCode(`the desktop app wrote ${after} but did not compose it — no dsh.profile.bundles row`, lastCode))
        }
        journal.finish(entry.id)
        report.reinstalled.push(entry.name)
        logEvent('warn', 'update-repair',
          `${entry.name}: the interrupted update had already written ${after}; recorded as finished`)
        continue
      }
      journal.finish(entry.id)
      report.reinstalled.push(entry.name)
      logEvent('warn', 'update-repair',
        `${entry.name}: the previous update was interrupted after removing it; reinstalled ${spec} on this start`)
```

</details>

#### 缺口

- 没有真实Desktop挂起、重载和重启后的故障注入记录
  **影响**：能说明防重入机制但不能证明恢复完成或真实等待合理
  **进一步探讨**：分别制造remove不返回、install迟返回和只落盘未组合，跨市场重载检查并发拒绝、journal与重启后实际功能

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 热挂载和备份能恢复多少，哪些数据不在其中？

**研究主题**：功能与机制、缺陷与关键质疑、效果与总成本

#### 完整回答

热挂载核对声明patch或纯客户端surface，再创建临时树并等激活；等待失败后尽力dispose并删临时文件，dispose不阻塞响应。不能由这段最佳努力清理保证所有副作用停止，重启也不能修复不兼容或缺产物。源码把待重启、配置冲突和运行异常分开显示，有利于用户知道何时应退出当前尝试。

配置快照只含package.json、cordis.patch.yml和市场state，恢复检查路径并对已写动作做补偿，包目录和第三方自写业务数据不在工件中。更广的Profile Backup递归导出配置文件，排除依赖/缓存，可含.env或其他凭据，内容为忠实恢复不原地遮盖；上传WebDAV或Gist前要按实际配置核对所含内容。restore先合并依赖和bundle，保留目标机器已有包，固定当前运行市场版本，再重新安装并报告不可迁移link或启动错误。即使配置恢复成功，包下载、第三方数据与功能验证仍需另行处理，不能称完整机器快照。

#### 证据与依据

**依据 1 · 源码核查**：[src/hot.ts:1381-1407](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/hot.ts#L1381-L1407)

缺patch拒绝与纯客户端分支。

<details>
<summary>查看原文（27行）</summary>

```text
    } else if (declared.length > 0) {
      // The declaration is VOID — one of its files cannot be read. The host
      // throws on a missing overlay file and skips the ENTIRE bundle, so no
      // part of this package can go live, now or after a restart.
      return {
        ok: false,
        reason: '声明的 patch 文件缺失或不可读,宿主会跳过整个 bundle,请修复或重装该包 / a declared patch file is unreadable; the host skips the whole bundle — fix or reinstall the package',
      }
    } else {
      // No host patch. Client-only packages (dsh.client, no dsh.bundle) never
      // get a loader entry — not even after a restart — so client-modules
      // would never serve their bundle. A shim entry under the package's name
      // is the whole activation.
      const dsh = readPkgDsh(profileDir, packageName)
      if (dsh === null || dsh.client === undefined || dsh.bundle !== undefined) {
        return {
          ok: false,
          reason: '该包无 bundle patch 且未声明 dsh.client,没有可热挂载的内容 / no bundle patch and no dsh.client surface — nothing to hot-mount',
        }
      }
      clientOnly = true
      rows = [{ id: `client-${packageName.replace(/[^A-Za-z0-9_.-]/g, '-')}`, name: packageName }]
    }
    // Recheck the patch even when a tree is already live, but retain its
    // handle. Registering another include here would orphan the original.
    if (mountedFile(packageName, profileDir) !== undefined) {
      return mountResult(hotMountFailure(packageName, profileDir))
```

</details>

**依据 2 · 源码核查**：[src/hot.ts:1422-1453](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/hot.ts#L1422-L1453)

实际挂载与失败尽力清理。

<details>
<summary>查看原文（32行）</summary>

```text
    const mountLog = watchMountLog(ctx)
    let handle: PluginHandle
    try {
      handle = ctx.plugin(HotTree, { path: pathToFileURL(file).href })
    } catch (error) {
      // `ctx.plugin()` bails out before creating anything when the fiber is no
      // longer active (a mount issued during teardown) or the plugin is
      // rejected. The sink is already registered by then, so release it here:
      // the outer catch reports the failure, it does not clean this up.
      mountLog.stop()
      throw error
    }
    try {
      await raceActivationTimeout(handle.await())
    } catch (error) {
      mountLog.stop()
      // A failed or wedged mount must leave NOTHING behind: the disposed
      // subtree stops retrying the import, and the input file is removed so
      // it cannot be re-imported by a later boot or replay (a leftover file
      // re-throwing the same resolve error on every composition replay
      // produced unbounded error-log growth on a closure-hosted loader).
      try { Promise.resolve(handle.dispose()).catch(() => {}) } catch { /* best effort */ }
      try { rmSync(file, { force: true }) } catch { /* best effort */ }
      hotTrees.delete(pathToFileURL(file).href)
      if (error instanceof ActivationTimeout) {
        // A wedged activation would otherwise hold this request open forever:
        // the route's `finally { installing = false }` never runs, so every
        // later install/update/uninstall gets 409'd until a host restart.
        // Unwind the half-mounted subtree best-effort; disposal never blocks
        // the reply, and the caller falls back to restart activation.
      }
      throw error
```

</details>

**依据 3 · 源码核查**：[src/snapshot.ts:1-18](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/snapshot.ts#L1-L18)

快照用途和保留范围。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Profile snapshots — issue #98 (phase 3), implementing the snapshot half of
 * #19: before any ordering / preset change is applied, the profile's
 * composition-critical files are captured as a timestamped snapshot; a failed
 * or unwanted change can be rolled back in one step.
 *
 * A snapshot is a single JSON document under `<profile>/.dsh-market/
 * snapshots/<timestamp>-<seq>.json` describing the files that define the
 * profile's composition: package.json (dependency + bundle list),
 * cordis.patch.yml (the user patch layer) and state.json (market disable
 * list + groups). Version 2 records optional-file absence explicitly;
 * restoring validates every path, reconciles writes and deletions, and rolls
 * completed actions back if a later action fails.
 *
 * Retention: after every create, snapshots are pruned to the most recent
 * `maxSnapshots` (default 20); the cap is configurable through the market
 * plugin config (`maxSnapshots`) and each snapshot can also be deleted
 * individually from the UI.
```

</details>

**依据 4 · 源码核查**：[src/snapshot.ts:40-43](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/snapshot.ts#L40-L43)

三份文件白名单。

```text

/** The files a snapshot captures, relative to the profile directory. */
const SNAPSHOT_FILES = ['package.json', 'cordis.patch.yml', '.dsh-market/state.json'] as const

```

**依据 5 · 源码核查**：[src/backup.ts:1-7](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/backup.ts#L1-L7)

备份是配置，不含已安装包。

```text
/**
 * Portable profile backups: configuration only, never installed packages.
 *
 * The profile directory is plain user data — aside from package.json it can
 * hold API keys (config.toml), tokens, or the WebDAV password when stored
 * server-side. Backups therefore behave like `dsh export` and carry the same
 * credential-warning disclaimer in the UI (review #63).
```

**依据 6 · 源码核查**：[src/backup.ts:46-58](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/backup.ts#L46-L58)

可能携带凭据且不修改值。

<details>
<summary>查看原文（13行）</summary>

```text
/** File names that routinely contain credentials (backup exports).
 *  Values are never masked in place — the export is one-to-one for
 *  faithful restores — but presence is surfaced by the UI warning. */
export const SECRET_FILE_HINTS = /(^|\/)(config\.toml|\.env(\.\w+)?|secrets?\.\w+t?j?s?o?n|pnpm-workspace\.yaml)$/i

/** Count of exported files whose names look like they carry credentials. */
export function secretFileCount(profile: string, explicitDir?: string): number {
  let count = 0
  for (const path of profileFiles(explicitDir ?? profileDir(profile))) {
    if (SECRET_FILE_HINTS.test(path)) count += 1
  }
  return count
}
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:2878-2922](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L2878-L2922)

合并恢复、固定自身版本与重装后的启动问题。

<details>
<summary>查看原文（45行）</summary>

```text
  async function restoreBackup(value: unknown): Promise<{ files: number; errors: { name: string; error: string }[]; unportable?: Array<{ name: string; spec: string }>; pinned?: Array<{ name: string; from: string; to: string }>; bootErrors?: string[] }> {
    if (!await probePnpm()) throw new Error('pnpm is required to restore plugins')
    // Snapshot the target's manifest BEFORE the backup files overwrite it, so
    // the restore can merge rather than replace: plugins the target already
    // has that are NOT in the backup stay installed instead of silently
    // dropping off the manifest (partial exports, issue #89). The mutation
    // lock is owned by withMutationLock now, so no `installing` flag here.
    const manifestBefore = JSON.parse(readFileSync(join(activeProfileDir, 'package.json'), 'utf8')) as Record<string, unknown>
    const restored = restoreProfileBackup(config.profile, value, activeProfileDir)
    try {
      // Merge: current deps stay, backup specs win on name conflicts; bundle
      // lists are unioned. Full exports merge to the backup view unchanged.
      const mergedManifest = mergeRestoreManifest(
        JSON.parse(readFileSync(join(activeProfileDir, 'package.json'), 'utf8')) as Record<string, unknown>,
        manifestBefore,
      )
      // This profile belongs to the process running the restore, and the
      // market is part of it: a backup written by another market version
      // would have the install below swap this package's files under the
      // live module — the mixed state the update route refuses (#608), and
      // here it also removes the code that is going to answer this request.
      // The running spec wins; the backup's is reported so the update flow
      // can apply it as its own restart-aware operation.
      const selfPins = pinRunningDeps(mergedManifest, manifestBefore, SELF_NAMES)
      mergedManifest.dependencies = selfPins.dependencies
      if (selfPins.pinned.length > 0) {
        logEvent('warn', 'restore', `kept the running market version — ${selfPins.pinned.map(dep => `${dep.name}: ${dep.from} -> ${dep.to}`).join('; ')}`)
      }
      writeFileSync(join(activeProfileDir, 'package.json'), `${JSON.stringify(mergedManifest, null, 2)}\n`)
      // Named BEFORE the install runs, because that is the install this
      // will make fail: a `link:/Users/…` spec from another machine points
      // at a path that does not exist here (#205). Reported rather than
      // rewritten — where those files should live is the operator's call.
      const unportable = unportableDeps(mergedManifest.dependencies)
      if (unportable.length > 0) {
        logEvent('warn', 'restore', `machine-specific dependency paths in the restored manifest — ${unportable.map(dep => `${dep.name}: ${dep.spec}`).join('; ')}`)
      }
      const result = await runPlugin(config.profile, ['install'])
      if (result.exitCode === 0 && !result.timedOut && !result.cancelled) {
        invalidateUpdates()
        const bootErrors = restoredBootErrors()
        if (bootErrors.length > 0) {
          logEvent('warn', 'restore', `restored profile will not boot as-is — ${bootErrors.join('; ')}`)
        }
        return { files: restored.files, errors: [], unportable, pinned: selfPins.pinned, ...(bootErrors.length > 0 ? { bootErrors } : {}) }
```

</details>

#### 缺口

- 缺少代表性插件业务数据的恢复验证
  **影响**：配置回滚不能证明用户数据完整或恢复代价可控
  **进一步探讨**：在副本profile和非关键插件上注入热挂载失败/配置恢复失败，分别核对配置、包、业务数据及实际任务

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 后台检查和提醒怎样处理来源变化与失败？

**研究主题**：功能与机制、工程质量与复用、效果与总成本

#### 完整回答

后台检查以profile及当前已装身份为基准，禁用时不安排定时任务；启用后延迟启动，间隔支持6/12/72/168小时，改间隔不等于启用。并发检查共享pending Promise，手工force遇到可缓存检查时只追加一次强制复查。返回时再读inventory，profile上下文或包身份变化就丢弃对应结果，失败保留旧数据并标stale，不能把旧可用状态当本次检查成功。

最新overlay在每次读时应用，因此一次更新发现需重启的profile级状态可立即反映，不必等下次轮询。客户端已读记录按scope与目标指纹维护，打开Plugins可去红点，但不会完成更新或删除待更新项；浏览器存储不可用会退回有限内存状态，不能承诺跨浏览器共享。更新提醒不自行安装，适合常驻且维护多包者；网络错误、切源和不同profile可能增加复核负担，实际请求量与提醒误扰尚未计量。

#### 证据与依据

**依据 1 · 源码核查**：[src/update-notifications.ts:78-115](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/update-notifications.ts#L78-L115)

inventory重整、启用调度与退避。

<details>
<summary>查看原文（38行）</summary>

```text
  const reconcile = (): UpdateNotificationInventory => {
    const current = deps.inventory()
    if (current.context !== identity.context) {
      updates = {}
      checkedAt = null
      lastSuccessAt = null
      error = null
      stale = true
    } else {
      const kept: Record<string, UpdateStatus> = {}
      for (const [name, status] of Object.entries(updates)) {
        if (current.packages[name] !== undefined && current.packages[name] === identity.packages[name]) kept[name] = status
        else stale = true
      }
      if (Object.keys(current.packages).some(name => current.packages[name] !== identity.packages[name])) stale = true
      updates = kept
    }
    identity = current
    return current
  }

  const stopTimer = (): void => {
    if (timer !== undefined) clearTimeout(timer)
    timer = undefined
    nextCheckAt = null
  }

  const schedule = (delay: number): void => {
    stopTimer()
    if (disposed || !enabled) return
    nextCheckAt = Date.now() + delay
    timer = setTimeout(() => { void runCheck(stale) }, delay)
    timer.unref?.()
  }

  const nextDelay = (): number => failures > 0
    ? Math.min(RETRY_MAX_MS, RETRY_BASE_MS * 2 ** Math.min(failures - 1, 5))
    : intervalHours * 60 * 60_000
```

</details>

**依据 2 · 源码核查**：[src/update-notifications.ts:123-176](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/update-notifications.ts#L123-L176)

single flight、force追查、身份校验与stale。

<details>
<summary>查看原文（54行）</summary>

```text
  const runCheck = (force = false): Promise<Record<string, UpdateStatus>> => {
    if (disposed) return Promise.resolve({ ...updates })
    if (pending !== null) {
      if (!force || pendingForced) return pending
      // A manual refresh arriving during a cache-eligible read must still
      // bypass that cache, once. Several such callers share the follow-up.
      queuedForce ??= pending.then(() => runCheck(true)).finally(() => { queuedForce = null })
      return queuedForce
    }
    stopTimer()
    const started = reconcile()
    pendingForced = force || stale
    // Scheduling into a microtask also makes simultaneous callers share the
    // promise before input gathering starts.
    pending = Promise.resolve().then(async () => {
      try {
        const result = await deps.check(pendingForced)
        if (disposed) return { ...updates }
        const current = reconcile()
        const next = { ...updates }
        let incomplete = result.error !== undefined
        for (const [name, status] of Object.entries(result.updates)) {
          if (current.context !== started.context || current.packages[name] === undefined
            || current.packages[name] !== started.packages[name]) {
            incomplete = true
            continue
          }
          if (status.checkFailed === true || status.checkError !== undefined) {
            incomplete = true
            next[name] = { ...(updates[name] ?? status), checkFailed: true, checkError: 'unavailable',
              ...(status.sourceMigration === undefined ? {} : { sourceMigration: status.sourceMigration }) }
          } else {
            next[name] = status
          }
        }
        if (Object.keys(current.packages).some(name => result.updates[name] === undefined
          || current.context !== started.context || current.packages[name] !== started.packages[name])) incomplete = true
        updates = next
        checkedAt = Date.now()
        stale = incomplete
        error = incomplete ? result.error ?? 'Some plugin updates could not be checked. Try again later.' : null
        if (!incomplete) lastSuccessAt = checkedAt
        failures = incomplete ? failures + 1 : 0
      } catch {
        if (disposed) return { ...updates }
        reconcile()
        updates = Object.fromEntries(Object.entries(updates).map(([name, status]) => [name, { ...status, checkFailed: true as const, checkError: 'unavailable' as const }]))
        checkedAt = Date.now()
        stale = true
        error = 'Plugin updates could not be checked. Try again later.'
        failures += 1
      } finally {
        pending = null
        if (!disposed) schedule(nextDelay())
```

</details>

**依据 3 · 源码核查**：[src/update-notifications.ts:183-210](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/update-notifications.ts#L183-L210)

overlay及设置/清理。

<details>
<summary>查看原文（28行）</summary>

```text
  schedule(UPDATE_CHECK_START_DELAY_MS)
  return {
    snapshot: () => {
      reconcile()
      return {
        enabled, intervalHours, checking: pending !== null, checkedAt, lastSuccessAt, nextCheckAt,
        stale, error, updates: view({ ...updates }), boot: deps.boot, ...deps.preferences(),
        ...(deps.profileKey === undefined ? {} : { profileKey: deps.profileKey }),
      }
    },
    check,
    setEnabled: value => {
      if (enabled === value || disposed) return
      enabled = value
      stopTimer()
      if (enabled && pending === null) schedule(UPDATE_CHECK_START_DELAY_MS)
    },
    setIntervalHours: value => {
      if (!isUpdateCheckIntervalHours(value) || intervalHours === value || disposed) return
      intervalHours = value
      // Keep a pending check single-flight; its completion uses the newest
      // choice. Changing a disabled monitor never opts the user in.
      if (pending === null) schedule(checkedAt === null ? UPDATE_CHECK_START_DELAY_MS : nextDelay())
    },
    dispose: () => {
      disposed = true
      stopTimer()
    },
```

</details>

**依据 4 · 源码核查**：[src/client/update-notifications.ts:69-112](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/client/update-notifications.ts#L69-L112)

已读存储失败降级。

<details>
<summary>查看原文（44行）</summary>

```text
// effective for this client lifetime; readable invalid records still fail open.
const seenInMemory = new Map<string, Set<string>>()
const unpersistedSeen = new Set<string>()

function seenScope(snapshot: UpdateNotificationSnapshot): SeenScope | null {
  const persistent = typeof snapshot.profileKey === 'string' && snapshot.profileKey !== ''
  if (!persistent && snapshot.boot === '') return null
  // The endpoint separates reverse-proxy deployments on the same origin;
  // profileKey is opaque and never stores the host's filesystem path here.
  return {
    key: SEEN_UPDATES_KEY_PREFIX + JSON.stringify([api('/dsh-market/update-notifications'),
      persistent ? 'profile' : 'boot', persistent ? snapshot.profileKey : snapshot.boot]),
    persistent,
  }
}

function seenStorage(scope: SeenScope): Storage {
  return scope.persistent ? localStorage : sessionStorage
}

function readSeen(scope: SeenScope): Set<string> {
  if (unpersistedSeen.has(scope.key)) return seenInMemory.get(scope.key) ?? new Set()
  try {
    const raw = seenStorage(scope).getItem(scope.key)
    if (raw === null) {
      seenInMemory.delete(scope.key)
      return new Set()
    }
    const saved: unknown = JSON.parse(raw)
    if (!isRecord(saved) || saved.version !== 1 || !Array.isArray(saved.fingerprints)
      || !saved.fingerprints.every(value => typeof value === 'string' && value !== '')) {
      seenInMemory.delete(scope.key)
      return new Set()
    }
    const fingerprints = new Set<string>(saved.fingerprints)
    seenInMemory.set(scope.key, fingerprints)
    return fingerprints
  } catch (error) {
    // A malformed JSON record is not evidence that an update was seen.
    if (error instanceof SyntaxError) {
      seenInMemory.delete(scope.key)
      return new Set()
    }
    return seenInMemory.get(scope.key) ?? new Set()
```

</details>

#### 缺口

- 没有常驻多profile下的提醒漏报、误扰与网络负担记录
  **影响**：无法把后台存在等同于更省人工
  **进一步探讨**：固定相同包的来源变化、强制检查和断网重连，记录通知目标、去红点后待更新状态及人工复核时间

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 公开更新API和等待Agent空闲的变更有什么边界？

**研究主题**：依赖、兼容与流程、功能与机制、缺陷与关键质疑

#### 完整回答

公开v1 capabilities返回beta、profile、bootId、运行时、更新/回滚/重启及agentDrain能力，并说明操作记录只保留当前进程。客户端应先协商能力，不能按路径存在就假设兼容稳定。POST校验包名、当前安装和并发操作；drain表示等待Agent到可维护边界，不是强行取消所有任务。

DrainCoordinator在第一次盘点前订阅创建/销毁事件，缺任一必要事件或Agent形状不兼容就不提供该模式；执行入口与每条包命令前再次assertCanMutate，重枚举Agent并确认hold仍有效。用户取消、市场卸载、屏障破坏或服务不可用会拒绝变更。等待前捕获目标，执行时核对kind/target/spec/version，GitHub快捷来源需固定提交，避免用户等待后装到另一个版本。这个机制把“等空闲”推进到“执行前仍是同一意图”，但真实性依赖宿主hold与事件契约，未证明正在执行的第三方副作用可撤销。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:3624-3675](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L3624-L3675)

公开beta能力协商与进程级保留。

<details>
<summary>查看原文（52行）</summary>

```text
    registerRoute({
      kind: 'exact',
      path: '/dsh-market/api/v1/capabilities',
      handler: (request, response) => {
        if (request.method !== 'GET') {
          response.writeHead(405, { allow: 'GET' })
          response.end()
          return
        }
        const canRestart = restartAllowed(config)
        sendJson(response, 200, {
          schema: UPDATE_API_V1_SCHEMA,
          apiVersion: 1,
          // Machine-readable, because a policy that lives only in a markdown
          // file is one a client never reads. `beta` says the shape may still
          // change; it becomes `stable` once a release stops moving it, and
          // that is the point at which the compatibility promise starts.
          stability: 'beta',
          marketVersion: marketVersion(),
          profile: config.profile,
          bootId: BOOT_ID,
          runtime: config.desktopHost === true ? 'desktop' : 'web',
          features: {
            check: true,
            update: true,
            progress: true,
            rollback: true,
            restart: canRestart,
            // A capability bit, not just an endpoint path: a client that
            // renders an update badge has to know the aggregate exists
            // without probing for it (#602).
            updatesSummary: true,
            // Whether this host can put live Agents under a maintenance hold
            // while a deferred mutation waits for a safe boundary (#411).
            agentDrain: drainCoordinator.support().supported,
          },
          busyPolicies: ['reject', 'drain'],
          restart: {
            supported: canRestart,
            managedBy: canRestart ? 'market' : config.desktopHost === true ? 'desktop-host' : 'operator',
            supervisor: detectedSupervisor(),
            debugger: detectedDebugger(),
          },
          operationRetention: 'current-process',
          operationLimit: MAX_UPDATE_OPERATIONS_V1,
          endpoints: {
            updates: '/dsh-market/api/v1/updates',
            updatesSummary: '/dsh-market/api/v1/updates/summary',
            operations: '/dsh-market/api/v1/operations',
            rollback: '/dsh-market/api/v1/rollback',
            restart: '/dsh-market/api/v1/restart',
          },
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:3761-3814](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L3761-L3814)

同源、并发、已装包和drain能力校验。

<details>
<summary>查看原文（54行）</summary>

```text
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'GET, POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { schema: UPDATE_API_V1_SCHEMA, error: 'untrusted origin' })
          return
        }
        try {
          const body = (await readJsonBody(request)) as { packageName?: unknown; force?: unknown; busyPolicy?: unknown }
          const packageName = typeof body.packageName === 'string' ? body.packageName : ''
          if (!NPM_NAME_RE.test(packageName)) {
            sendJson(response, 400, { schema: UPDATE_API_V1_SCHEMA, error: 'a valid package name is required' })
            return
          }
          if (operationsV1.hasActive() || drainCoordinator.hasActive() || mutationBusy) {
            sendJson(response, 409, {
              schema: UPDATE_API_V1_SCHEMA,
              error: 'another public update operation is already running',
              failure: {
                code: 'OPERATION_BUSY',
                message: 'another public update operation is already running',
                retryable: true,
              },
            })
            return
          }
          const installedVersion = readInstalledVersion(config.profile, packageName, activeProfileDir)
          if (installedVersion === null) {
            sendJson(response, 404, {
              schema: UPDATE_API_V1_SCHEMA,
              error: 'plugin is not installed',
              failure: {
                code: 'PLUGIN_NOT_INSTALLED',
                message: 'plugin is not installed in this profile',
                retryable: false,
              },
            })
            return
          }
          if (body.busyPolicy === 'drain') {
            const support = drainCoordinator.support()
            if (!support.supported) {
              sendJson(response, 400, {
                schema: UPDATE_API_V1_SCHEMA,
                error: `agent drain is unavailable on this host (${support.reason})`,
                failure: {
                  code: 'AGENT_DRAIN_UNSUPPORTED',
                  message: `agent drain is unavailable on this host (${support.reason})`,
                  retryable: false,
                },
              })
              return
```

</details>

**依据 3 · 源码核查**：[src/drain.ts:312-326](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/drain.ts#L312-L326)

盘点前事件订阅。

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

**依据 4 · 源码核查**：[src/drain.ts:348-390](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/drain.ts#L348-L390)

执行前复查及不兼容宿主拒绝。

<details>
<summary>查看原文（43行）</summary>

```text
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
      if (this.holds.has(agent.id) || this.claim(agent)) continue
      // Still in its factory's maintenance: no turn can start there, and
      // `claimAfterFactory` either holds it or stops the command when that ends.
      if (this.inFactory.has(agent.id) && agent.status !== 'running') continue
      unheld.push(agent.id)
    }
    if (unheld.length > 0) return { ok: false, reason: 'agent-active', ids: unheld }
    return { ok: true }
  }

  /**
   * Whether this request may use drain mode.
   *
   * Re-evaluated per request: a host that gains an incompatible Agent handle
   * after mount must not be treated as drain-capable just because the service
   * exists.
   */
  support(): { supported: boolean; reason: string; incompatibleIds: string[] } {
    if (this.disposeRequested) return { supported: false, reason: 'unloading', incompatibleIds: [] }
    if (!this.subscribed) return { supported: false, reason: 'no-agent-events', incompatibleIds: [] }
    let listed: unknown[] | null
    try {
      listed = this.host.list()
    } catch {
      listed = null
    }
    if (listed === null) return { supported: false, reason: 'no-agents-service', incompatibleIds: [] }
    const incompatibleIds: string[] = []
    for (const entry of listed) {
      if (drainableAgent(entry) === null) incompatibleIds.push(agentId(entry) ?? 'agent')
    }
    if (incompatibleIds.length > 0) return { supported: false, reason: 'incompatible-agents', incompatibleIds }
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:3057-3080](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L3057-L3080)

固定并对照目标意图。

<details>
<summary>查看原文（24行）</summary>

```text
  /** Whether the executor still sees the exact facts the user approved. */
  const drainIntentMatches = (expected: DrainIntent, actual: DrainIntent): boolean => {
    if (expected.kind !== actual.kind) return false
    if (expected.expected.target !== undefined && expected.expected.target !== actual.expected.target) return false
    if (expected.expected.spec !== undefined && expected.expected.spec !== actual.expected.spec) return false
    if (expected.expected.version !== undefined && expected.expected.version !== actual.expected.version) return false
    return true
  }

  /**
   * Pin a GitHub shortcut to its current commit when the region has no proxy.
   *
   * `acceleratedTarget` deliberately leaves global installs to pnpm, but a
   * deferred drain operation must name one immutable artifact. Without this, a
   * bare `github:owner/repo` (and a `#path:` selector) could never satisfy the
   * exact-target gate in the global region.
   */
  const pinDrainGithubTarget = async (target: string, region: Region): Promise<string> => {
    if (githubCommitOfTarget(target) !== null) return target
    const match = /^github:([A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+)/.exec(target)
    if (match === null) return target
    const sha = await resolveHeadCommit(match[1]!, region)
    if (sha === null) return target
    return githubTargetAtCommit(target, sha) ?? target
```

</details>

#### 缺口

- 没有宿主真实maintenance hold与多Agent竞争结果
  **影响**：不能证明所有Agent都被持有或失去屏障后无外部副作用
  **进一步探讨**：用固定宿主在验证期间创建Agent、取消和卸载，核对每条包命令前的hold及目标指纹，记录任何已发生写入

<a id="research-q08"></a>

<a id="detail-section-18"></a>

### Q08 · 模型、遥测与备份增加什么持续成本和数据边界？

**研究主题**：效果与总成本、缺陷与关键质疑

#### 完整回答

基础市场需要目录/清单、包管理器和网络，AI功能另耗用户配置模型额度。AI搜索单次最多6000输出token、推荐最多8000是请求上限，不是实际价格或总消耗；已装/收藏描述及用户请求可进入模型提示，结果与原请求还可留在同home文件中。关闭个性化不会删除既有搜索记录，也不会撤回已发送模型的内容。模型调用没有费用或节时实测，不能按候选数估出ROI。

遥测与自动更新检查是不同默认值。telemetry读取失败或缺文件时默认enabled=true，30秒后开始、每6小时检查，按UTC日限制成功的心跳和首次打开事件；正文发送随机持久ID、市场/宿主版本、desktop/web与region，打开页面额外opened=true。设置、组织策略、DSH_MARKET_TELEMETRY=0或DO_NOT_TRACK=1可关闭。它未发插件清单，不等于无联网或无法关联同一安装。备份则可能含配置凭据并可由用户主动上传外部存储。全周期成本还包括失败重试、重启、兼容复核和配置/业务数据恢复的人力，金额和分钟数均未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/find-plugin.ts:399-407](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L399-L407)

AI搜索模型调用预算。

```text
  const { have } = options
  const found = recall(registry, extractTerms(request), CANDIDATE_LIMIT, new Set((have?.installed ?? []).map(plugin => plugin.name)))
  const answer = await askForPicks({
    llm: llm!, selection, prompt: buildPickPrompt(request, registry, found, have), candidates: found.candidates,
    max: 5, maxTokens: 6000, temperature: 0.2, ...(options.signal === undefined ? {} : { signal: options.signal }),
  })
  const preferZh = /\p{Script=Han}/u.test(request)
  const picks = answer.picks.map(({ plugin, why }) => toPick(plugin, registry, preferZh, why))
  return { request, intro: answer.intro, picks, model: selection.model, at: new Date().toISOString(), personalized: have !== undefined }
```

**依据 2 · 源码核查**：[src/find-plugin.ts:501-513](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L501-L513)

推荐预算。

<details>
<summary>查看原文（13行）</summary>

```text
  const { llm, registry, selection, preferZh } = options
  const seeds = userSeeds(registry, options)
  if (seeds.installed.length + seeds.favorited.length === 0) throw new FindPluginError('no-seeds', NO_SEEDS)
  if (!hasModel(llm, selection)) throw new FindPluginError('no-model', NO_MODEL)
  let candidates = recommendCandidates(registry, [...seeds.installed, ...seeds.favorited], options.exclude ?? [])
  // "Show others" ran out of fresh entries: start over rather than show nothing.
  if (candidates.length < RECOMMEND_MAX && (options.exclude ?? []).length > 0) candidates = recommendCandidates(registry, [...seeds.installed, ...seeds.favorited])
  const answer = await askForPicks({
    llm: llm!, selection, prompt: buildRecommendPrompt(registry, seeds, candidates, preferZh), candidates,
    max: RECOMMEND_MAX, maxTokens: 8000, temperature: 0.5, ...(options.signal === undefined ? {} : { signal: options.signal }),
  })
  const picks = answer.picks.map(({ plugin, why }) => toPick(plugin, registry, preferZh, why))
  return { request: '', intro: answer.intro, picks, model: selection.model, at: new Date().toISOString() }
```

</details>

**依据 3 · 源码核查**：[src/find-plugin.ts:525-549](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L525-L549)

搜索结果持久化边界。

<details>
<summary>查看原文（25行）</summary>

```text
const RESULT_LIMIT = 200
let results: Map<string, FindResult> | null = null
export function resultsFile(home: string = resolveDshHome()): string {
  return join(home, 'dsh-market', 'find-plugin-results.json')
}
function loadResults(file: string): Map<string, FindResult> {
  if (results !== null) return results
  try {
    const raw = JSON.parse(readFileSync(file, 'utf8')) as Record<string, FindResult>
    results = new Map(Object.entries(raw))
  } catch {
    results = new Map()
  }
  return results
}
export function rememberResult(id: string, result: FindResult, file: string = resultsFile()): void {
  const map = loadResults(file)
  map.delete(id)
  map.set(id, result)
  while (map.size > RESULT_LIMIT) map.delete(map.keys().next().value as string)
  try {
    mkdirSync(dirname(file), { recursive: true })
    const temp = `${file}.${process.pid}.tmp`
    writeFileSync(temp, JSON.stringify(Object.fromEntries(map)))
    renameSync(temp, file)
```

</details>

**依据 4 · 源码核查**：[src/telemetry.ts:20-52](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/telemetry.ts#L20-L52)

目标、payload和默认开关。

<details>
<summary>查看原文（33行）</summary>

```text

export const TELEMETRY_URL = 'https://t.dshmarket.com/v1/ping'
const TIMEOUT_MS = 10_000
const START_DELAY_MS = 30_000
const RECHECK_MS = 6 * 60 * 60 * 1000

/** The whole payload. Adding a field here is a privacy change: update SECURITY.md. */
export interface Ping {
  id: string
  v: string
  hv: string | null
  kind: 'desktop' | 'web'
  region: string
  /** Present (and true) only on the day's first open of the market page. */
  opened?: true
}

interface TelemetryState { id?: string; lastDay?: string; lastOpenDay?: string; enabled: boolean }

export function telemetryFile(home: string = resolveDshHome()): string {
  return join(home, 'dsh-market', 'telemetry.json')
}

export function readTelemetryState(file: string = telemetryFile()): TelemetryState {
  try {
    const value = JSON.parse(readFileSync(file, 'utf8')) as Record<string, unknown>
    return {
      ...(typeof value.id === 'string' && /^[0-9a-f]{32}$/.test(value.id) ? { id: value.id } : {}),
      ...(typeof value.lastDay === 'string' ? { lastDay: value.lastDay } : {}),
      ...(typeof value.lastOpenDay === 'string' ? { lastOpenDay: value.lastOpenDay } : {}),
      enabled: value.enabled !== false,
    }
  } catch { return { enabled: true } }
```

</details>

**依据 5 · 源码核查**：[src/telemetry.ts:70-84](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/telemetry.ts#L70-L84)

组织与环境退出条件。

<details>
<summary>查看原文（15行）</summary>

```text
export function suppressedBy(env: Record<string, string | undefined>): string | null {
  // An organization that forbids the count wins over the user's own switch.
  if (getPolicy().telemetry === false) return 'organization policy'
  if (env.DSH_MARKET_TELEMETRY === '0') return 'DSH_MARKET_TELEMETRY=0'
  if (env.DO_NOT_TRACK === '1') return 'DO_NOT_TRACK=1'
  // Tests and CI never count, unless a test points the URL at its own server.
  const overridden = (env.DSH_MARKET_TELEMETRY_URL ?? '') !== ''
  if (!overridden && env.CI !== undefined && env.CI !== '' && env.CI !== '0' && env.CI !== 'false') return 'CI'
  if (!overridden && (env.VITEST !== undefined || env.NODE_ENV === 'test')) return 'test run'
  return null
}

export interface HeartbeatOptions {
  version: string
  hostVersion: () => string | null
```

</details>

**依据 6 · 源码核查**：[src/telemetry.ts:98-123](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/telemetry.ts#L98-L123)

发送内容及成功后每日记录。

<details>
<summary>查看原文（26行）</summary>

```text
    const state = readTelemetryState(file)
    if (!state.enabled) return 'skipped'
    const day = utcDay((options.now ?? Date.now)())
    if ((opened ? state.lastOpenDay : state.lastDay) === day) return 'skipped'
    const id = state.id ?? randomBytes(16).toString('hex')
    const ping: Ping = {
      id, v: options.version, hv: options.hostVersion(), kind: options.kind(), region: options.region(),
      ...(opened ? { opened: true as const } : {}),
    }
    const response = await (options.fetch ?? marketFetch)(env.DSH_MARKET_TELEMETRY_URL || TELEMETRY_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(ping),
      signal: AbortSignal.timeout(TIMEOUT_MS),
    })
    if (response.status < 200 || response.status > 299) return 'failed'
    // Re-read: the user may have turned it off while the request was in flight.
    // An open also counts as today's heartbeat: the server row is the same.
    writeState({ ...readTelemetryState(file), id, lastDay: day, ...(opened ? { lastOpenDay: day } : {}) }, file)
    return 'sent'
  } catch (error) {
    logEvent('info', 'telemetry', `not sent: ${error instanceof Error ? error.message : 'unknown'}`)
    return 'failed'
  }
}

```

</details>

**依据 7 · 源码核查**：[src/routes.ts:9904-9912](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L9904-L9912)

心跳实际启动与卸载停止。

```text
  const stopHeartbeat = startHeartbeat(telemetryOptions)
  instanceClaim = claimInstance(marketVersion())
  return async () => {
    disposed = true
    instanceClaim?.release()
    if (swappingSelf) forgetMarketVersion()
    resetHotState()
    stopHeartbeat()
    checkoutRepairRound = undefined
```

#### 缺口

- 没有真实请求账单、遥测送达及恢复人工量
  **影响**：无法给出单位合格安装总成本或更低成本结论
  **进一步探讨**：在副本profile记录基础、AI和后台分别开启后的实际请求、费用、失败与人工时间，不混算现金与小时

<a id="research-q09"></a>

<a id="detail-section-19"></a>

### Q09 · 哪些人值得小范围试用，什么设计假设可检验？

**研究主题**：采用判断、新假设与验证、场景与需求

#### 完整回答

建议给常驻DSH且维护多个已知社区包、能复制profile并保留关键数据的人做小范围试用。先在Web副本装一个固定来源的非关键插件，核对来源、目标profile、精确版本、激活及一次真实功能，再恢复预定状态。仅需按名字发现插件者可继续原生Discover；官方Desktop的拆换与重启状态需单独验证，不把Web试用结果套给Desktop。初次可关闭AI与不需要的后台功能，减少额外请求及数据边界。

待验证设计是把AI卡片的“为什么相关”、来源/版本兼容以及安装后的功能探针放进同一份可回查任务凭证。当前代码分别过滤模型名称、读取清单、判断激活和记录恢复，但“被模型选中”到“具体功能完成”仍有缺口；相对继续叠加排名，凭证可能降低装错与装上不工作后的排障。固定任务与模型预算，对照现卡片和附凭证界面，计合格安装数、找错来源、恢复总时间及多余请求；若探针不能覆盖用途、误报增加或总时间无改善，则无依据采用该设计。出现来源不明、真实功能与激活回执矛盾、在途写入未结束或无法确认恢复时停止，回副本或宿主管理入口。

#### 证据与依据

**依据 1 · 源码核查**：[src/find-plugin.ts:275-286](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/find-plugin.ts#L275-L286)

模型输出约束只到候选名字。

<details>
<summary>查看原文（12行）</summary>

```text
  const picks: Array<{ name: string; why: string }> = []
  const seen = new Set<string>()
  if (Array.isArray(value.picks)) {
    for (const item of value.picks) {
      const name = typeof item?.name === 'string' ? item.name.trim() : ''
      if (!allowed.has(name) || seen.has(name)) continue
      seen.add(name)
      picks.push({ name, why: typeof item?.why === 'string' ? item.why.trim().slice(0, 300) : '' })
      if (picks.length === max) break
    }
  }
  return { intro: typeof value.intro === 'string' ? value.intro.trim().slice(0, 300) : '', picks }
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:9722-9769](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/routes.ts#L9722-L9769)

安装激活与回滚回执。

<details>
<summary>查看原文（48行）</summary>

```text
                activation = {}
                const live = liveNames()
                // Same facts the mount decision above used, so the verdict
                // cannot disagree with it within one request.
                const hostFacts = defaultHostRuntimeFacts(activeProfileDir)
                for (const name of added) {
                  const result = verifyActivation(config.profile, name, live, activeProfileDir, disabled.has(name), hostFacts)
                  const failure = themeFailures.get(name)
                  activation[name] = failure === undefined
                    ? result
                    : { ...result, state: 'failed', hot: false, reasons: [failure] }
                }
              }
            }
            if (ok && addedPackages.length > 0) {
              const after = assessProfile(config.profile, activeProfileDir)
              const risks = introducedRisks(compatibilityBefore, after)
              // Cross-layer name shadowing this install introduced (#230).
              // Shares the rollback id with the peer risks when both fire:
              // one operation, one thing to undo.
              const shadowed = introducedDuplicateNames(compatibilityBefore, after)
              // A client bundle that no longer parses (#222): pnpm can leave
              // one half-written or patch-mangled, and today that surfaces
              // as a blank settings page long after the install reported
              // success, with nothing connecting the two.
              const brokenBundles = newlyBrokenBundles(
                bundlesBefore,
                [
                  ...addedPackages
                    .map(pkg => ({ name: pkg, check: checkClientBundle(config.profile, pkg, activeProfileDir) }))
                    .filter(entry => !entry.check.ok)
                    .map(entry => ({ name: entry.name, reason: entry.check.reason ?? 'parse failed' })),
                  ...brokenClientBundles(config.profile, activeProfileDir),
                ].filter((entry, index, all) => all.findIndex(other => other.name === entry.name) === index),
              )
              const needsRollback = risks.length > 0 || brokenBundles.length > 0
              if (needsRollback || shadowed.length > 0) {
                const rollbackId = needsRollback ? savePendingRollback({ kind: 'install', names: addedPackages }) : null
                compatibility = {
                  code: 'soft-incompatible',
                  risks,
                  shadowedNames: shadowed.length > 0 ? shadowed : undefined,
                  brokenBundles: brokenBundles.length > 0 ? brokenBundles : undefined,
                  ...(needsRollback
                    ? rollbackId !== null
                      ? { rollbackId }
                      : { rollbackUnavailable: '安装完成后无法安全捕获 profile 状态，因此自动回滚不可用；需要时请手工卸载新安装的插件。 / The post-install profile state could not be captured safely, so automatic rollback is unavailable. Remove the newly installed plugin manually if needed.' }
                    : {}),
```

</details>

**依据 3 · 源码核查**：[src/official-desktop.ts:514-525](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/official-desktop.ts#L514-L525)

在途写入不能由UI超时推断停止。

<details>
<summary>查看原文（12行）</summary>

```text
/** Keep the native promises across a market reload, including after a route deadline. */
function pendingManagerWrites(): Set<Promise<ManagedResult>> {
  const processState = globalThis as { [WRITE_SLOT]?: Set<Promise<ManagedResult>> }
  return processState[WRITE_SLOT] ??= new Set()
}

function trackManagerWrite(work: Promise<ManagedResult>): Promise<ManagedResult> {
  const pending = pendingManagerWrites()
  pending.add(work)
  const remove = () => pending.delete(work)
  void work.then(remove, remove)
  return work
```

</details>

**依据 4 · 源码核查**：[src/snapshot.ts:40-43](https://github.com/dsh-market/dsh-market/blob/8747e07367df7f16d6186e1c9047daecee3e8174/src/snapshot.ts#L40-L43)

恢复范围必须结合独立副本。

```text

/** The files a snapshot captures, relative to the profile directory. */
const SNAPSHOT_FILES = ['package.json', 'cordis.patch.yml', '.dsh-market/state.json'] as const

```

#### 缺口

- 没有端到端合格安装与恢复对照，也无凭证方案结果
  **影响**：只能给可逆试用与假设，不能建议持续安装或证明新界面增效
  **进一步探讨**：在同profile副本、同目标和任务下计入下载/重启/恢复/人工，再按结果决定是否继续

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
