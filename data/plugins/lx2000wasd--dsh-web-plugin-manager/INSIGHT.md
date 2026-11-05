# dsh-web-plugin-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[43a8725](https://github.com/LX2000WASD/dsh-web-plugin-manager/tree/43a8725a1636e13f4ba1fb75507d34d7f4bea674)

<!-- BEGIN META -->
[![GitHub ★ 64](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=64&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LX2000WASD/dsh-web-plugin-manager) [![npm 30d 466](https://img.shields.io/static/v1?label=npm+30d&message=466&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-plugin-manager) [![最新发布 2026-09-13](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-13&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-web-plugin-manager)
<!-- END META -->

> **功能**：为旧版 DSH 提供 Web 插件管理、环境和市场入口，安装后做质量检查；作者已停止维护。

> **亮点**：在旧宿主范围内把安装、挂载、诊断和界面集中，并为质量问题提供明确失败路径；不把局部清理扩为任意副作用回滚。[Q02](#research-q02)

> **主要限制**：作者已停止维护，补丁固定占用plugin-manager并遮蔽原inventory；质量门又发生在安装后，不能支撑跨版本无损管理或完整回滚保证。[Q03](#research-q03)

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
  - [Q01 · 旧版宿主中的管理器解决什么，当前定位有何限制？](#detail-section-11)
  - [Q02 · 界面和代理怎样走到受保护安装链？](#detail-section-12)
  - [Q03 · 质量门和请求围栏能保证什么，不能保证什么？](#detail-section-13)
  - [Q04 · 是否应继续使用，哪些设计可借鉴？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：仍维护作者指定旧DSH环境的人可研究其管理链；新的部署不应据历史功能介绍安装。[Q01](#research-q01)

宿主原生管理通道拥有当前profile写入语义；本包原先补旧版只读页，但作者声明新宿主已提供管理能力。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 旧版管理界面 | 集中列表、启停和安装入口 | 作者限定旧DSH，已停维护 |
| 保护安装链 | 安装后检查并尝试清理 | 不是任意副作用事务回滚 |
| REST与代理入口 | 将操作交同服务 | 依赖宿主与本机访问边界 |
| 环境管理入口 | 列profile并组织变更 | 未核查全部迁移/备份细节，不承诺完整恢复 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 作者限定DSH <=0.1.5-rc.2 | 适用范围 | 避免与官方管理器冲突 | 0.1.6-alpha.2后作者要求不要安装 |
| loader与旧Web客户端接口 | 启动及界面必需 | 挂载/遮蔽/动态变更 | 跨版本不可推断 |
| dsh CLI、包管理器与网络 | 安装时必需 | 下载和构建 | 失败需看具体步骤 |
| 可写profile和备份 | 变更必需 | 包/patch修改 | 不具备则停止 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 判断范围 | 用户先核对宿主版本 | 新部署停止安装本包 |
| 备份 | 旧环境维护者保存profile和数据 | 可人工恢复后才评估 |
| 变更 | 服务调用CLI、质量门与挂载 | 分清安装成功、门通过和功能成功 |
| 失败与退出 | 维护者核对清理结果并停用 | 任意脚本副作用另行处理，不宣称全回滚 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 下载、构建与宿主资源未知 | 旧版本对齐与备份 | 停止维护 |
| 持续使用 | 市场查询与包更新资源未知 | 保留版本、诊断和人工复核 | 质量门非安全审计 |
| 失败恢复 | 重装或清理资源未知 | 对照包/patch/用户数据恢复 | 外部脚本副作用不在局部回滚内 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 旧版集中管理 | 服务/页签/安装链源码 | 旧宿主实际完整可用 |
| 质量失败处理 | 安装后扫描与remove清理 | 任意副作用完整回滚 |
| 现代兼容 | 作者明确停止并报告冲突 | 本次没有运行复现 |

> **思考**：作者已停止维护，补丁固定占用plugin-manager并遮蔽原inventory；质量门又发生在安装后，不能支撑跨版本无损管理或完整回滚保证。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：在旧宿主范围内把安装、挂载、诊断和界面集中，并为质量问题提供明确失败路径；不把局部清理扩为任意副作用回滚。[Q02](#research-q02)

effect管理路由、工具和watcher的释放，有明确状态所有权；但遮蔽原管理页和同名服务使世代耦合强，迁移应减少双写权。[Q02](#research-q02)

<a id="detail-section-5"></a>

### 1.4 主要限制

作者已停止维护，补丁固定占用plugin-manager并遮蔽原inventory；质量门又发生在安装后，不能支撑跨版本无损管理或完整回滚保证。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

新的部署使用自身原生管理通道；旧环境研究先备份，不能为了本包降级宿主或把清理结果当无损回滚。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

旧版管理接线和局部质量门有源码依据；现代兼容不成立的边界由作者明确报告，未复现；后继分工为未验证假设。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、cordis.patch.yml、src/index.ts、src/client/index.ts、src/rest.ts、src/installFlow.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：检查固定入口、patch、REST、安装保护与客户端注册的关键子集；未做市场全量、所有修复或安全审计，不运行目标。
- 下一步：旧环境确有维护需求时固定宿主和依赖副本，测试安装失败后包、patch和数据恢复；后继项目另独立研究。

**分析版本**

- **仓库**：[LX2000WASD/dsh-web-plugin-manager](https://github.com/LX2000WASD/dsh-web-plugin-manager)
- **版本号**：0.6.3（[固定提交 43a8725](https://github.com/LX2000WASD/dsh-web-plugin-manager/tree/43a8725a1636e13f4ba1fb75507d34d7f4bea674)）
- **版本日期**：2026-09-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

只读诊断与宿主写通道分工可能避免重复拥有profile状态；需独立固定实现并用同失败轨迹比恢复完整性，不能继承后继项目的宣传。[Q04](#research-q04)

旧环境确有维护需求时固定宿主和依赖副本，测试安装失败后包、patch和数据恢复；后继项目另独立研究。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 6 | 473 | — | — | 13204 |
| .ts | source | 29 | 12443 | 8468 | 3456 | — |
| .tsx | source | 7 | 3214 | 2644 | 430 | — |
| .mjs | test | 24 | 6437 | 5023 | 966 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-05），可前往 [GitHub Issues](https://github.com/LX2000WASD/dsh-web-plugin-manager/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：停止维护的旧版插件管理器还适合哪些任务，其保护链能证明到哪一步？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 旧版宿主中的管理器解决什么，当前定位有何限制？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

它面向作者声明的DSH <=0.1.5-rc.2环境，集中插件列表、启停、安装、环境和市场。相对命令行改profile，它把安装质量检查、挂载和界面操作接在一起；完成标准是目标profile正确变更且失败能被诊断，不是市场条目都可靠。固定README明确停止维护，并称0.1.6-alpha.2后官方管理器与本包行ID和服务名冲突，要求不要安装。该后继项目未在本次材料中核查，不能把“改用后继”当已验证推荐；现代环境应先用自身官方管理通道。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-16](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/README.md#L3-L16)

作者停止维护与版本边界。

<details>
<summary>查看原文（14行）</summary>

```text
> ## ⚠️ 本仓库已停止维护（对应 DSH <= 0.1.5-rc.2）
>
> **DSH 0.1.6-alpha.2 起请改用 [dsh-plugin-manager-companion](https://github.com/LX2000WASD/dsh-plugin-manager-companion)。**
>
> 原因：官方 0.1.6-alpha.2 自带完整插件管理页（`@deepseek-ai/dsh-client-ui-plugin-manager` +
> `@deepseek-ai/dsh-plugin-manager` 宿主服务），本仓库原先"遮蔽官方只读页 + 自建 profile 写权"的
> 路线不再成立。而且官方在 `dsh-base` bundle 里新增了 `id: plugin-manager` 行，与本仓库
> `cordis.patch.yml` 的行 id 撞车，**在 0.1.6-alpha.2 上会让 profile 完全无法启动**
> （`TypeError: duplicate loader entry id: plugin-manager`），服务名也与官方同名冲突。
>
> 新仓库改为**伴生补强**路线：当前环境的写操作全部交还官方通道，只补官方明说不做的部分
> （多环境管理、agent 预设组合、普通插件模块的文件操作、版本/更新、安装前质量门、深度诊断）。
>
> 本仓库的 0.6.x 仍可用于 DSH <= 0.1.5-rc.2；**在 0.1.6-alpha.2 及以上请勿安装**。
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:4-14](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/cordis.patch.yml#L4-L14)

固定补丁占用plugin-manager并禁用原inventory。

<details>
<summary>查看原文（11行）</summary>

```text
- insert:
    - id: plugin-manager
      name: 'dsh-web-plugin-manager'
      config:
        profile: 'web'
# Shadow the official read-only plugin list: our catalog tab (same slot id
# 'all') takes over this profile's Plugins settings page. The bundle patch
# layer applies only while this plugin is installed — removing it restores
# the official inventory automatically.
- id: ui-settings-plugin-inventory
  disabled: true
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 界面和代理怎样走到受保护安装链？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

apply实例化pluginManager服务，等待webServer后注册路由并把disposer交给effect；等待tools后注册工具和裸安装守卫，systemPrompt存在时注入使用规则。客户端用settings.plugins.tab的all槽位遮蔽原只读列表，并提供manager、环境和市场入口。安装服务调用installWithSource，再由installProtected走官方dsh add、恢复内置bundle、解析真实包名并扫描质量问题；发现问题后remove和清理挂载行，再返回失败。这是安装后有限静态门，并不撤销第三方安装脚本已经产生的任意外部副作用，也不证明核心功能运行。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2303-2355](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/index.ts#L2303-L2355)

真实服务、路由、工具与prompt注册。

<details>
<summary>查看原文（53行）</summary>

```text
/** Plugin entry: mount the service, routes, and (when present) agent tools. */
export const name = 'plugin-manager'
export const inject = ['loader']

export function apply(ctx: Context, config: PluginManagerConfig): void {
  const service = new PluginManagerService(ctx)
  // Plugin-owned watcher for the running profile's patch file: manual edits
  // keep applying live even after a toggle unloads the platform HMR service
  // (its own patch watcher is an effect of HMR and does not come back).
  const host = hostProfileName()
  if (host !== null) {
    ensurePatchWatcher(ctx, patchPath(profileDir(host)))
    // Final unload must stop the watcher too: the fs handle would otherwise
    // outlive the plugin and keep recomposing into a dead loader tree.
    ctx.effect(() => () => { closePatchWatcher() }, 'dsh-web-plugin-manager: patch watcher')
  }
  // webServer is a sibling include-group row; ctx.inject waits for it like
  // the official agent-tool-presentation waits for codeRuntime.
  ctx.inject(['webServer'], (webCtx: Context) => {
    webCtx.effect(() => {
      const disposers = registerRoutes(webCtx, service)
      return () => { for (const dispose of disposers) dispose() }
    }, 'dsh-web-plugin-manager: routes')
  })
  // V2-E: agent tools + install guard, when the host provides the tools
  // service (web profiles do; headless may not — inject simply never fires).
  // The guard denies raw dsh plugin/pnpm mutations from the agent so every
  // install goes through the protected flow (quality gate + rollback).
  ctx.inject(['tools'], (toolsCtx: Context) => {
    toolsCtx.effect(() => {
      // Parameter-order adapter: the service takes (profile, refresh), the
      // tool host takes (refresh, profile).
      const disposers = registerTools(toolsCtx, {
        list: (profile) => service.list(profile),
        setEnabled: (profile, entryId, enabled) => service.setEnabled(profile, entryId, enabled),
        install: (profile, spec) => service.install(profile, spec),
        remove: (profile, name) => service.remove(profile, name),
        removeInsert: (profile, rowId) => service.removeInsert(profile, rowId),
        marketplace: (refresh, profile) => service.marketplace(profile, refresh),
      }, config.profile)
      const guardDisposer = registerPluginGuard(toolsCtx)
      if (guardDisposer !== null) disposers.push(guardDisposer)
      return () => { for (const dispose of disposers) dispose() }
    }, 'dsh-web-plugin-manager: tools')
  })
  // V2-E: the install-rule prompt section, so the model prefers the
  // protected surface before it attempts the raw path.
  ctx.inject(['systemPrompt'], (promptCtx: Context) => {
    promptCtx.effect(() => {
      const sectionDisposer = registerPluginRulePrompt(promptCtx)
      return () => { if (sectionDisposer !== null) sectionDisposer() }
    }, 'dsh-web-plugin-manager: prompt rule')
  })
```

</details>

**依据 2 · 源码核查**：[src/client/index.ts:174-193](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/client/index.ts#L174-L193)

遮蔽与管理页槽位。

<details>
<summary>查看原文（20行）</summary>

```text
  // Shadow the official read-only inventory: same slot id 'all', lower
  // priority wins per the slots shadowing contract (lowest renders).
  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'all',
    order: 10,
    priority: -1,
    label: () => t('catalogTab'),
    locale: NS,
    inject: catalogInjected,
  }, PluginCatalogTab))

  ctx.slots.inject('settings.plugins.tab', () => ctx.slots.register({
    name: 'settings.plugins.tab',
    id: 'manager',
    order: 20,
    label: () => t('tab'),
    locale: NS,
    inject: managerInjected,
  }, PluginManagerSettingsTab))
```

</details>

**依据 3 · 源码核查**：[src/installFlow.ts:977-1018](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/installFlow.ts#L977-L1018)

安装、质量门与清理分支。

<details>
<summary>查看原文（42行）</summary>

```text
export async function installProtected(ctx: Context | null, profile: string, spec: string, env?: NodeJS.ProcessEnv): Promise<CommandResult> {
  const before = readBundles(profile)
  const result = await runDshPlugin(profile, 'add', [spec], process.cwd(), env)
  if (!result.ok) return result
  restoreInBoxBundles(profile, before)
  const installed = resolveInstalledName(profile, spec)
  if (installed === null) return { ...result, installed: [] }

  // Quality gate: scan the installed package entry for imports its manifest
  // does not declare and the loader does not provide. Undeclared deps fail
  // at boot (ERR_MODULE_NOT_FOUND) and take the whole profile down.
  const issues = qualityIssues(profile, installed)
  if (issues.length > 0) {
    // Roll back: remove the dependency and any insert row written below.
    await runDshPlugin(profile, 'remove', [installed], process.cwd())
    restoreInBoxBundles(profile, before)
    await cleanupInsertRows(ctx, profile, installed)
    return {
      ok: false,
      exitCode: 1,
      output: result.output
        + "\n[plugin-manager] QUALITY CHECK FAILED for " + installed + ":"
        + issues.map(issue => "\n  - " + issue).join("")
        + "\n[plugin-manager] rolled back the install to keep the profile bootable.",
      installed: [],
    }
  }

  // Every return below leaves the package installed (bundle layer, live
  // mount, or a failed mount that keeps the dependency): drop the cached
  // installed index so the next marketplace request sees the new package
  // immediately. The quality-gate path above rolled back to the previous
  // state and returns before reaching this line.
  invalidateInstalledIndex(profile)

  const isBundle = exportsBundlePatch(profile, installed)
  // Post-install entry verification: warn when the load entries are missing
  // (source-only repos), so "installed but not working" is caught up front.
  const entryNote = entryWarning(profile, installed)
  // Post-install analysis summary: dependency/conflict/compatibility issues
  // between the new package and the profile (warnings — the install itself
  // already passed the quality gate).
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 质量门和请求围栏能保证什么，不能保证什么？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

REST辅助层按Host白名单、cross-site和Origin同源检查，带body上限；这是浏览器请求围栏，不是本机调用者认证，无Origin的本机调用允许通过。运行依赖loader以及可用webServer、tools和旧客户端接口；包peer固定旧0.1.5世代，不能跨宿主版本推断兼容。质量门在官方安装完成之后做，真实包名解析为空时直接返回installed空列表，不能把所有安装都视作经过扫描。现代宿主的冲突属于作者明确报告，本次未执行复现，应保留该边界而非承诺安全升级。

#### 证据与依据

**依据 1 · 源码核查**：[src/rest.ts:64-85](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/rest.ts#L64-L85)

请求围栏允许无Origin调用。

<details>
<summary>查看原文（22行）</summary>

```text
export function isTrustedRequest(req: { headers?: Record<string, string | string[] | undefined> }): boolean {
  const rawHost = headerValue(req.headers, 'host')
  if (rawHost.length === 0) {
    const secFetch = headerValue(req.headers, 'sec-fetch-site').toLowerCase()
    if (secFetch === 'cross-site') return false
    if (headerValue(req.headers, 'origin').length > 0) return false
    return true
  }
  const host = hostnameOf(rawHost)
  if (!LOOPBACK_HOSTS.has(host) && !extraTrustedHosts().has(host)) return false
  const secFetch = headerValue(req.headers, 'sec-fetch-site').toLowerCase()
  if (secFetch === 'cross-site') return false
  const origin = headerValue(req.headers, 'origin')
  if (origin.length === 0) return true
  try {
    const url = new URL(origin)
    const originPort = url.port === '' ? (url.protocol === 'https:' ? '443' : '80') : url.port
    const reqPort = portOf(rawHost) === '' ? '80' : portOf(rawHost)
    return url.hostname.toLowerCase() === host && originPort === reqPort
  } catch {
    return false
  }
```

</details>

**依据 2 · 源码核查**：[src/rest.ts:101-115](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/rest.ts#L101-L115)

请求体界限。

<details>
<summary>查看原文（15行）</summary>

```text
/** Default JSON body cap: 1 MB covers every op except the backup ones. */
const BODY_LIMIT_BYTES = 1_000_000

/**
 * Body cap for the backup ops. backupRestore embeds the whole uploaded
 * backup file inside the JSON body (and backupDiff the same for a preview),
 * and a profile with a few dozen plugins — each dependency a git URL or
 * source string — legitimately exceeds 1 MB. 16 MB keeps the fence bounded
 * while letting a real backup through.
 */
const BACKUP_BODY_LIMIT_BYTES = 16_000_000

/** The body cap for one route (backup ops carry a whole backup file). */
export function bodyLimitFor(op: string): number {
  return op === 'backupRestore' || op === 'backupDiff' ? BACKUP_BODY_LIMIT_BYTES : BODY_LIMIT_BYTES
```

</details>

**依据 3 · 源码核查**：[src/installFlow.ts:977-988](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/installFlow.ts#L977-L988)

先安装后扫描与解析为空分支。

<details>
<summary>查看原文（12行）</summary>

```text
export async function installProtected(ctx: Context | null, profile: string, spec: string, env?: NodeJS.ProcessEnv): Promise<CommandResult> {
  const before = readBundles(profile)
  const result = await runDshPlugin(profile, 'add', [spec], process.cwd(), env)
  if (!result.ok) return result
  restoreInBoxBundles(profile, before)
  const installed = resolveInstalledName(profile, spec)
  if (installed === null) return { ...result, installed: [] }

  // Quality gate: scan the installed package entry for imports its manifest
  // does not declare and the loader does not provide. Undeclared deps fail
  // at boot (ERR_MODULE_NOT_FOUND) and take the whole profile down.
  const issues = qualityIssues(profile, installed)
```

</details>

**依据 4 · 源码核查**：[package.json:64-81](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/package.json#L64-L81)

旧peer和客户端依赖声明。

<details>
<summary>查看原文（18行）</summary>

```text
    "@deepseek-ai/dsh-tools": "^0.1.5-rc.2",
    "@deepseek-ai/schemastery": "^3.18.2",
    "js-yaml": "^4.3.1"
  },
  "dependencies": {
    "undici": "^7.29.0"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "^4.0.2",
    "@deepseek-ai/cordis-plugin-loader": "^1.0.3",
    "@deepseek-ai/dsh-client-locale": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-store": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-ui-primitives": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-ui-renderer": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.5-rc.2",
    "@deepseek-ai/dsh-client-ui-slots": "0.1.5-rc.2",
    "@deepseek-ai/dsh-host-webserver": "0.1.5-rc.2",
    "@deepseek-ai/dsh-llm": "0.1.5-rc.2",
```

</details>

#### 缺口

- 未固定现代宿主及旧版宿主的实际运行原件。
  **影响**：无法确认旧环境完整可用，也不能复现作者所述新环境启动冲突。
  **进一步探讨**：仅在确需维护旧profile时固定完整宿主与依赖副本，检查启动、变更和退出。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 是否应继续使用，哪些设计可借鉴？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

对新的DSH部署不推荐安装这一停止维护并遮蔽原管理页的组件；不要为了管理便利降级现有宿主。旧环境维护者也要备份profile、包清单和用户数据，质量门不是完整事务回滚，外部脚本副作用和恢复成本需另计。现金/资源主要是网络包下载、构建、子进程和市场查询，实际时间费用未知。值得借鉴的是把变更队列、明确失败报告和界面状态放同一路径；从Q01/Q03可提出只保留只读诊断、把当前环境写操作委托宿主的假设，但后继项目是否实现和有效需独立研究。用同一安装失败轨迹比较恢复完整性，收益不成立就不增加第二管理器。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:3-16](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/README.md#L3-L16)

停止维护与路线失效声明。

<details>
<summary>查看原文（14行）</summary>

```text
> ## ⚠️ 本仓库已停止维护（对应 DSH <= 0.1.5-rc.2）
>
> **DSH 0.1.6-alpha.2 起请改用 [dsh-plugin-manager-companion](https://github.com/LX2000WASD/dsh-plugin-manager-companion)。**
>
> 原因：官方 0.1.6-alpha.2 自带完整插件管理页（`@deepseek-ai/dsh-client-ui-plugin-manager` +
> `@deepseek-ai/dsh-plugin-manager` 宿主服务），本仓库原先"遮蔽官方只读页 + 自建 profile 写权"的
> 路线不再成立。而且官方在 `dsh-base` bundle 里新增了 `id: plugin-manager` 行，与本仓库
> `cordis.patch.yml` 的行 id 撞车，**在 0.1.6-alpha.2 上会让 profile 完全无法启动**
> （`TypeError: duplicate loader entry id: plugin-manager`），服务名也与官方同名冲突。
>
> 新仓库改为**伴生补强**路线：当前环境的写操作全部交还官方通道，只补官方明说不做的部分
> （多环境管理、agent 预设组合、普通插件模块的文件操作、版本/更新、安装前质量门、深度诊断）。
>
> 本仓库的 0.6.x 仍可用于 DSH <= 0.1.5-rc.2；**在 0.1.6-alpha.2 及以上请勿安装**。
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2307-2355](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/index.ts#L2307-L2355)

注册与释放归属。

<details>
<summary>查看原文（49行）</summary>

```text
export function apply(ctx: Context, config: PluginManagerConfig): void {
  const service = new PluginManagerService(ctx)
  // Plugin-owned watcher for the running profile's patch file: manual edits
  // keep applying live even after a toggle unloads the platform HMR service
  // (its own patch watcher is an effect of HMR and does not come back).
  const host = hostProfileName()
  if (host !== null) {
    ensurePatchWatcher(ctx, patchPath(profileDir(host)))
    // Final unload must stop the watcher too: the fs handle would otherwise
    // outlive the plugin and keep recomposing into a dead loader tree.
    ctx.effect(() => () => { closePatchWatcher() }, 'dsh-web-plugin-manager: patch watcher')
  }
  // webServer is a sibling include-group row; ctx.inject waits for it like
  // the official agent-tool-presentation waits for codeRuntime.
  ctx.inject(['webServer'], (webCtx: Context) => {
    webCtx.effect(() => {
      const disposers = registerRoutes(webCtx, service)
      return () => { for (const dispose of disposers) dispose() }
    }, 'dsh-web-plugin-manager: routes')
  })
  // V2-E: agent tools + install guard, when the host provides the tools
  // service (web profiles do; headless may not — inject simply never fires).
  // The guard denies raw dsh plugin/pnpm mutations from the agent so every
  // install goes through the protected flow (quality gate + rollback).
  ctx.inject(['tools'], (toolsCtx: Context) => {
    toolsCtx.effect(() => {
      // Parameter-order adapter: the service takes (profile, refresh), the
      // tool host takes (refresh, profile).
      const disposers = registerTools(toolsCtx, {
        list: (profile) => service.list(profile),
        setEnabled: (profile, entryId, enabled) => service.setEnabled(profile, entryId, enabled),
        install: (profile, spec) => service.install(profile, spec),
        remove: (profile, name) => service.remove(profile, name),
        removeInsert: (profile, rowId) => service.removeInsert(profile, rowId),
        marketplace: (refresh, profile) => service.marketplace(profile, refresh),
      }, config.profile)
      const guardDisposer = registerPluginGuard(toolsCtx)
      if (guardDisposer !== null) disposers.push(guardDisposer)
      return () => { for (const dispose of disposers) dispose() }
    }, 'dsh-web-plugin-manager: tools')
  })
  // V2-E: the install-rule prompt section, so the model prefers the
  // protected surface before it attempts the raw path.
  ctx.inject(['systemPrompt'], (promptCtx: Context) => {
    promptCtx.effect(() => {
      const sectionDisposer = registerPluginRulePrompt(promptCtx)
      return () => { if (sectionDisposer !== null) sectionDisposer() }
    }, 'dsh-web-plugin-manager: prompt rule')
  })
```

</details>

**依据 3 · 源码核查**：[src/installFlow.ts:988-1002](https://github.com/LX2000WASD/dsh-web-plugin-manager/blob/43a8725a1636e13f4ba1fb75507d34d7f4bea674/src/installFlow.ts#L988-L1002)

局部清理而非全部副作用回滚。

<details>
<summary>查看原文（15行）</summary>

```text
  const issues = qualityIssues(profile, installed)
  if (issues.length > 0) {
    // Roll back: remove the dependency and any insert row written below.
    await runDshPlugin(profile, 'remove', [installed], process.cwd())
    restoreInBoxBundles(profile, before)
    await cleanupInsertRows(ctx, profile, installed)
    return {
      ok: false,
      exitCode: 1,
      output: result.output
        + "\n[plugin-manager] QUALITY CHECK FAILED for " + installed + ":"
        + issues.map(issue => "\n  - " + issue).join("")
        + "\n[plugin-manager] rolled back the install to keep the profile bootable.",
      installed: [],
    }
```

</details>

#### 缺口

- 委托宿主的后继实现及效果未核查。
  **影响**：不能将其能力或恢复保证写入本项建议。
  **进一步探讨**：独立固定后继版本研究，只比较相同失败任务的恢复与维护负担。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
