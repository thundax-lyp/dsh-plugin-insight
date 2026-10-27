# dsh-plugin-manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 9,494](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C494&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 78,704](https://img.shields.io/static/v1?label=npm+30d&message=78%2C704&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-20](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-20&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：在 DSH 官方插件页检查更新与宿主兼容，并通过官方通道或本机网关管理插件生命周期。

> **亮点**：核心增量是把版本检查、宿主最低版本判断、官方写入通道与更新后的 profile 核对接成一个流程，按运行时选择官方通道、CLI 或应用内 manager，避免再造一个独立包写入器。串行变更和只处理本次新增重复挂载的防护值得借鉴，实际安装机制仍来自 DSH 与包管理器。[Q02](#research-q02)

> **主要限制**：“安全回滚”不能解释为更新一定可用。兼容声明只覆盖包所写的版本要求，--dump-config 不导入插件，运行期 import/apply 失败仍在真实重启才暴露；网关队列只串行化本实例任务，也不能据此宣称阻止外部 CLI 并发。收益需按重启后功能与恢复结果判断。[Q03](#research-q03)

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
  - [Q01 · 版本管理解决什么任务，交付应怎样验收？](#detail-section-11)
  - [Q02 · 如何统一不同写入通道，并确认变更真实落盘？](#detail-section-12)
  - [Q03 · profile 预检与回滚是否保证下一启动可用？](#detail-section-13)
  - [Q04 · 不同运行时的依赖与更新成本由谁承担？](#detail-section-14)
  - [Q05 · 怎样减少“更新完成”与“功能生效”的歧义，谁应先试？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为管理多个 DSH 扩展的本机用户，在官方 Plugins 页面检查版本、判断宿主兼容、逐项更新及安排重启。交付是 profile 实际出现目标依赖并能在下一次启动加载，更新按钮成功不等于运行验收。

官方 Plugins 页面与 dsh plugin 命令是基线；本项目将版本、兼容和更新进度集中，不证明比原生命令有更低故障率。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 版本与兼容检查 | 选择可更新候选 | 依赖 registry、宿主版本及包声明 |
| 插件生命周期网关 | 安装、更新、移除和下一启动启停 | 本机边界，使用官方写入器；安装会执行第三方代码 |
| 批量更新 | 逐项推进多个候选 | 首个失败停止；官方包不批量更新 |
| 预检及回退 | 核对依赖、版本与配置组合 | 不导入插件，真实启动故障仍需恢复 |

<a id="dependencies-and-flow"></a>

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| DSH >=0.2.1-rc.3 与本机 Web UI | 启动必需 | 挂载更新入口与本地控制 | 远程浏览器拒绝写入 |
| npm registry 与版本声明 | npm 更新必需 | 查询目标版本及兼容要求 | 无法核实要求时应停止更新 |
| 官方 installer、CLI 或应用内 manager | 对应运行时必需 | 以官方写入器修改 profile | 无可用写入器时不能安装更新 |
| profile 目录写权限及重启能力 | 生效必需 | 写回依赖与加载新代码 | 无自动重启条件时人工重启 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 1 | 本机用户安装包、重启并进入 Plugins | 已安装 bundle 页面出现检查入口 |
| 2 | 用户检查候选版本和最低宿主要求 | 不满足或无法验证时不启动更新 |
| 3 | 用户逐项或批量更新 | 串行核对 profile；首项失败停止批量 |
| 4 | 用户按提示重启并验收插件核心功能 | profile done 仍需加载验证；失败保留诊断并人工恢复 |

<a id="cost-and-value"></a>

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 本机安装与构建资源；金额未知 | 核对运行时通道与 profile | 本轮未实际安装 |
| 持续使用 | registry 请求、包下载及更新进程 | 兼容判断、重启及核心功能复核 | 更新频率和耗时未知 |
| 失败恢复 | 重装旧版本、保留备份与日志 | 对账 profile、实际加载版本和错误 | 包可再次获取及真实回滚成功率未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 更新交接 | 通道统一与真实依赖核对 | 人工时间相对 CLI 是否下降 |
| 组合保护 | 新增重复挂载检测与预检 | import/apply 故障及外部并发的覆盖 |
| 生命周期管理 | 下一启动 enablement 和重启计划 | 目标宿主中的最终加载与恢复成功率 |

> **思考**：“安全回滚”不能解释为更新一定可用。兼容声明只覆盖包所写的版本要求，--dump-config 不导入插件，运行期 import/apply 失败仍在真实重启才暴露；网关队列只串行化本实例任务，也不能据此宣称阻止外部 CLI 并发。收益需按重启后功能与恢复结果判断。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：核心增量是把版本检查、宿主最低版本判断、官方写入通道与更新后的 profile 核对接成一个流程，按运行时选择官方通道、CLI 或应用内 manager，避免再造一个独立包写入器。串行变更和只处理本次新增重复挂载的防护值得借鉴，实际安装机制仍来自 DSH 与包管理器。[Q02](#research-q02)

可借鉴单实例变更队列、官方写入器优先、变更前后回读及只处理新增重复项的守卫。代价是需要维护多个宿主通道与 profile 识别语义；组合预检仍需真实启动补足。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

“安全回滚”不能解释为更新一定可用。兼容声明只覆盖包所写的版本要求，--dump-config 不导入插件，运行期 import/apply 失败仍在真实重启才暴露；网关队列只串行化本实例任务，也不能据此宣称阻止外部 CLI 并发。收益需按重启后功能与恢复结果判断。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

插件数量较多且愿意在每次重启后检查核心功能的本机用户，可在独立 profile 试用一项非关键扩展更新。先记录旧版本和可恢复来源，再验证更新、禁用与卸载；远程运维、关键生产 profile 或不能接受重启中断的场景先观察。若出现 profile 与加载版本不一致，停止批量操作并按实际状态恢复。[Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查固定源码的通道、队列和变更核对；未验证真实宿主更新、跨重启功能及恢复成功率；跨重启验收为未验证假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/README.md、packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/src/index.ts、packages/dsh-plugin-manager/src/core/service.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/bundle-guard.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查宿主网关、profile 接线、服务契约与重复挂载防护，未完整审计所有客户端、profile 写回和重启实现；不执行任何目标安装或更新。
- 下一步：临时 profile 逐项测更新、拒绝不兼容版本、导入异常、禁用及卸载，并在每次重启后核对真实加载版本。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.8（[固定提交 6b984b1](https://github.com/zhu1090093659/dsh-web/tree/6b984b10950f78f1f4a5b5adf4c16636b5e6113d)）
- **版本日期**：2026-10-26（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是把依赖落盘、组合预检、重启与核心功能冒烟分成可回读状态，并在重启后续接验收，避免把 done 混同已生效。由现有 profile 核对与未导入预检的边界推导；在临时 profile 对正常、组合失败、导入失败与外部并发更新各做对照，比较误报成功、恢复时间和多余重启。若记录状态不能减少误判或增加不可恢复状态，则否定。[Q05](#research-q05)

临时 profile 逐项测更新、拒绝不兼容版本、导入异常、禁用及卸载，并在每次重启后核对真实加载版本。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

统计范围：partial inspected snapshot; not whole-plugin LOC；组件：packages/dsh-plugin-manager；内容摘要：f3dc9c694d00b3072d8e1c5972154fc94cff1267efc222f39d9c32c4b9c30d52。sloc 0.3.2，TypeScript 5.9.3。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 99 | — | — | 2918 |
| .ts | source | 5 | 3063 | 1823 | 1103 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-26），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查多通道生命周期管理的真实增量及安全回滚、兼容和重启边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 版本管理解决什么任务，交付应怎样验收？

**研究主题**：场景与需求

#### 完整回答

该组件增加官方 Plugins 页面上的版本比较和批量更新工具条，面向本机已安装多个扩展的用户。简单替代是逐个查看 npm 版本并执行 dsh plugin 命令，再手动重启。其合格结果至少包括目标依赖版本落入正确 profile、宿主重启成功及插件核心功能生效。作者说明官方包不批量更新、逐项运行并在首个失败停止，这把运行时本身升级与第三方扩展更新分开。未独立核实真实用户的版本管理频率。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-manager/README.md:18-27](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/README.md#L18-L27)

作者描述场景、通道、批量限制与预检

<details>
<summary>查看原文（10行）</summary>

```text
An update and lifecycle manager for DeepSeek Harness (DSH) Web GUI and official desktop client: adds real-time registry version comparisons with DSH runtime compatibility checks directly into the official Plugins page, providing list-level batch updates, safe rollback mechanisms, and restart-to-apply workflows.

## What it does

- Contributes a check-for-updates block into the official Plugins page (the `plugins.detail.section` seat that page declares), rendered on an installed bundle's page and nowhere else. There is no tab of its own in the Plugins settings section.
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows one at a time with per-row progress and stops at the first failure, leaving the rest listed; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
- Detects the legacy aggregate `@linxin666/dsh-web-ui-all` and converts its update action into a transactional migration to `@linxin666/dsh-web-all`; the gateway removes the legacy package, installs the current package at an exact version, restores the legacy layer position, and verifies `--dump-config` before reporting success.
- Verifies DSH runtime compatibility before npm updates (issue #754): update checks read the declared minimum DSH version from the latest manifest (`dsh.engines.dsh` with a top-level `engines.dsh` fallback), evaluate it as a node-semver range with the call the official boot gate makes — `semver.satisfies(host, range, { includePrerelease: true })` — so `||` alternatives, `^` and `~`, whitespace-separated comparators and x-ranges decide here exactly as they decide at boot, and show the requirement beside the update action. A requirement the running DSH does not satisfy disables the action and says to upgrade DSH. A requirement the host could not verify — an unreadable running version, or a declaration that is not a range node-semver parses — is a different verdict with its own copy: it names no cause and never sends the user to upgrade a DSH that was never compared. Neither verdict lets the update run, and the host update route answers 412 before starting any CLI job in both cases.
- Protects the next boot on the npm runtime: after each install the gateway verifies the dependency actually landed, rejects duplicate entry-id claims and insert rows naming unresolvable packages, and composes the profile with the CLI's `--dump-config` preflight; a conflicting or failing install is rolled back through the official remove path and the existing plugins are never touched.
```

</details>

#### 缺口

- 缺真实用户频率和手动流程基线
  **影响**：场景清楚但收益大小未知
  **进一步探讨**：记录多插件用户一轮手动检查、更新、重启和复核耗时

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何统一不同写入通道，并确认变更真实落盘？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

宿主先解析实际启动 profile，存在才构造 CliGateway，并把应用内官方 manager 作为可选依赖。网关用 Promise 队列串行化本实例的变更，失败恢复队列尾，避免一个失败阻塞后续。迁移路径在 CLI 返回后回读依赖、处理本次新增重复挂载、保留原顺序、执行 dump-config，并核对目标版本才报 done。这里的增量是流程与核对，不能归功为新的安装器。duplicateMountBundles 只比对 before/after 新增项，并用变更前已挂载包集合过滤，避免误删用户已有 bundles。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:71-99](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/index.ts#L71-L99)

profile 与可选官方 manager 接线

<details>
<summary>查看原文（29行）</summary>

```text
function applyImpl(ctx: Context): void {
  // Gateway mode needs the boot profile; the launched profile the Host
  // publishes is authoritative when the launcher passed no flag and no
  // environment override (the packaged Desktop client). Without either fact
  // the official installer channels serve the browser half instead.
  let facts
  const launched = launchedProfile(ctx)
  try {
    facts = resolveProfile(process.argv, process.env, launched)
  } catch (error) {
    console.error('[plugin-manager]', error instanceof Error ? error.message : String(error))
    return
  }
  if (!profileExists(facts.profileDir)) return

  const gateway = new CliGateway(facts, process.env, { nativeManager: () => officialManager(ctx) })
  const cliAvailable = (): boolean => findDshBinary() !== null
  // The running installation's own manifest is the version source the
  // compatibility gate prefers: it needs no CLI, which is the only way a
  // packaged Desktop host can answer at all (issue #1819). The anchor is read
  // from the same published profile facts the profile resolution already used.
  const installAnchor = launchedInstallAnchor(launched)

  ctx.effect(() => {
    const disposers = makeGatewayRoutes({ facts, gateway, cliAvailable, installAnchor })
      .map(route => ctx.webServer.register(route))
    return () => {
      for (const dispose of disposers) dispose()
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:783-823](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/gateway.ts#L783-L823)

单实例写入队列及失败后续接

<details>
<summary>查看原文（41行）</summary>

```text
/** The gateway: serializes CLI operations through one job table and one mutation queue. */
export class CliGateway {
  private readonly jobs = new Map<string, GatewayJob>()
  /** Settlement order of finished jobs: the eviction ring keeps the newest {@link MAX_FINISHED_JOBS}. */
  private readonly finishedOrder: string[] = []
  private counter = 0
  /** Mutation queue: two CLI runs must never interleave their before/after captures. */
  private queue: Promise<void> = Promise.resolve()

  /**
   * @param facts - resolved profile locations.
   * @param env - process environment.
   * @param deps - spawn/binary seams (tests only; production uses the real CLI).
   */
  constructor(
    private readonly facts: ProfileFacts,
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly deps: {
      spawnImpl?: typeof spawnDsh
      findBinary?: (env: NodeJS.ProcessEnv) => string | null
      /** The official in-process manager, when the runtime publishes one. */
      nativeManager?: () => NativePluginManager | undefined
    } = {},
  ) {}

  /**
   * Run one profile mutation after every mutation already queued. The returned
   * promise keeps the task's own result or rejection, while the queue tail is
   * always recovered so one failed write cannot block later work. Routes that
   * edit profile files directly must use this seam so they cannot overlap the
   * CLI install/remove writer.
   */
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
  }

  /** Chain one fire-and-forget CLI mutation onto the shared queue. */
  private enqueue(task: () => Promise<void>): void {
    void this.withMutationLock(task).catch(() => {})
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:943-998](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/gateway.ts#L943-L998)

迁移后回读、预检和版本核对

<details>
<summary>查看原文（56行）</summary>

```text
      after = await this.capture()
    }
    if (!after.dependencies.includes(targetId)) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 未出现在 profile 中`
      return
    }
    const stripped = await this.stripDuplicateMounts(job, before, after)
    if (stripped === undefined) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      return
    }
    if (stripped.length > 0) {
      job.notices = stripped.map(name => ({ id: name, name, from: 'enabled', to: 'uninstalled' }))
      after = await this.capture()
    }
    if (oldIndex >= 0) await reorderProfileBundle(this.facts.packageJsonPath, targetId, oldIndex)
    after = await this.capture()

    const verify = await this.runCli(
      binary,
      ['--profile', this.facts.profileName, '--dump-config'],
      90_000,
    )
    if (verify.code !== 0) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: 迁移后的启动预检失败${verify.output === '' ? '' : `：\n${verify.output}`}`
      return
    }
    // The migration replaces the row-id universe the same way an update does:
    // an override for a row only the retired aggregate declared is an orphan
    // from here on.
    if (await this.pruneOrphanOverrides(job, verify.output) === undefined) return
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(
      this.facts,
      targetId,
      manifest.dependencies[targetId] ?? targetSpec,
      after.layer.rows,
    )
    // A local repository link is the developer checkout source: its version is
    // whatever the checked-out tree contains, not the registry release, so the
    // exact-version gate applies only to npm registry migrations.
    if (!/^(?:link:|file:)/.test(targetSpec) && updated.version !== targetVersion) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: 迁移后 ${targetId} 版本为 ${updated.version}，预期 ${targetVersion}`
      return
    }
    job.plugin = updated
    job.conflicts = significantChanges(diffLayer(before.layer, after.layer)).map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    job.phase = 'done'
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/bundle-guard.ts:103-112](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/bundle-guard.ts#L103-L112)

只删除本次新增且重复的 bundles

<details>
<summary>查看原文（10行）</summary>

```text
export async function duplicateMountBundles(
  facts: ProfileFacts,
  before: GuardSnapshot,
  beforeBundles: readonly string[],
  afterBundles: readonly string[],
): Promise<string[]> {
  const added = newlyAddedBundles(beforeBundles, afterBundles)
  if (added.length === 0) return []
  const mounted = await rowMountedPackageNames(facts, before)
  return added.filter(name => mounted.has(name))
```

</details>

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · profile 预检与回滚是否保证下一启动可用？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

最强支持是比退出码更严格的依赖和精确版本回读，并且新增冲突通过官方 remove 回退，而非覆盖已有 owner。限制是 --dump-config 的组合检查不导入条目，所以无法据此排除运行时 import 或 apply 故障；作者也明确承认。兼容检查依赖作者声明，未声明最低版本的包不会得到该层保护。源码队列是进程内 Promise，研究中没有看到它约束用户另开的 CLI，故需把“本实例变更串行”与“整个 profile 无并发”分开。未运行这些失败条件，不宣称已复现缺陷。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-manager/README.md:72-88](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/README.md#L72-L88)

兼容、真实启动与网关权力边界

<details>
<summary>查看原文（17行）</summary>

```text
- Compatibility gating applies only when the target manifest declares a minimum DSH version; packages without `dsh.engines.dsh` update unchecked, and official-installer runtimes (DSHCode and the checkout web) are not gated here because their updates go through the official installer. The running DSH version is read from the installation's own `@deepseek-ai/dsh` manifest, which the launcher publishes as the profile's install anchor — no subprocess, no PATH, and therefore an answer on a packaged Desktop host — with `dsh --version` kept as the fallback for a runtime that publishes no anchor. A requirement the host cannot verify at all is reported as unverified rather than as a version below the minimum: both hold the update back, but only the second sends the user to upgrade DSH.
- Enablement on the npm runtime reports the effective next-start value: a profile override row wins where present, otherwise the installed bundle's own `disabled` rows decide (the aggregate's inactive-by-default families), and rows no layer mentions are enabled. Enabling a row the bundle disables writes an explicit `disabled: false` override, because deleting the user row would only restore the bundle default; the runtime's loader honors these rows at the next start, but this path is less exercised than the official desktop writer's.
- Restart is explicit, user-clicked and three-mode. The route is method-aware: `GET /api/plugin-manager/restart` reads the plan (no side effects, so a prefetch or a typed URL can never stop a host) and `POST` carries it out; every other method is refused with 405. The toolbar reads the plan first, so the confirmation names the same consequence the host will produce. On a terminal launch (`dsh web`) the host starts a detached helper that waits for the outgoing process to exit and then re-executes the same command line, so the port is free before the replacement binds it, and the replacement's output goes to `$DSH_HOME/logs/plugin-manager-restart.log`. Under the packaged Desktop app the plugin cannot relaunch anything — Electron owns the process tree, a detached respawn would fight the shell for the same port, and the official shell answers a host exit with `fail("dsh desktop host stopped")` and an error page, because it exposes no way to ask the shell to restart — so the host exits there only when the shell exports `DSH_SHELL_RESTARTS_HOST=1`, its own declaration that an exiting host is brought back. Without that guarantee the restart panel states that this process cannot restart itself, names the manual way out (quit DeepSeek Harness and open it again), and offers no confirmation button: that path would not restart anything. A launch with no terminal (a supervisor, an editor task) is left running and the toolbar says to restart manually. Without a restart, updated plugin code is loaded at the next start.
- On the npm runtime, duplicate insert-id claims are detected after install and the new plugin is rolled back automatically (a shared id can never be `disabled` away: the loader's duplicate check has no disabled exemption).
- The npm runtime's boot preflight (`--dump-config`) catches composition failures, and the static insert check catches insert rows naming packages that resolve nowhere; runtime import/apply failures still surface only at the next real start.
- Duplicate-mount safeguard (gateway mode): the official CLI's bundle reconciliation re-adds every bundle-declaring dependency to `dsh.profile.bundles` after any install/remove — including packages the composition already mounts through a patch row (a bundle that mounts an external plugin by row), which would double-mount and fail the next boot (`duplicate prefix route`). After every successful CLI mutation the gateway strips exactly the newly added, already-row-mounted bundles entries back out (the manifest write goes through backup + tmp + atomic rename), reports one notice per stripped entry on the job result, and leaves normal installs' bundles entries — and every entry the user had before — untouched.
- The wire shapes mirror the official installer protocol; on drift the tolerant parsers degrade to error rows rather than misbehaving.

## Security model

- Trust boundary is the loopback fence: every gateway route requires a loopback socket address, a loopback Host header, and a non-cross-site origin (socket + Host + Origin + `sec-fetch-site`), the same authority the official installer channels enforce. There is no browser-reachable path from a remote origin; rejected requests receive HTTP 403 with `{ ok: false, error: "forbidden: loopback-only" }`.
- Mutation routes (install / update / remove / set-enabled / restart) carry no token: the loopback authority *is* the local user, matching the official channels. The restart route is the one route whose effect is process-level: it never invents a command line (it re-executes this process's own `execPath` + argv, dropping inspector flags), it refuses to relaunch anything it cannot identify as a terminal launch, and under the packaged Desktop app it stops this process only when the shell declares `DSH_SHELL_RESTARTS_HOST=1`. Any local process can therefore drive plugin installs and removals, and npm installs run package install scripts — treat the gateway as local code execution by design and never expose it beyond loopback.
- Install specs and package ids are rejected when they contain command-shell expansion characters or control characters. On Windows, npm shims are resolved to `node.exe` plus the package `bin.js`; packaged Desktop shims have no adjacent npm layout, so they run through `cmd.exe /d /s /c` with a pre-quoted, verbatim argument envelope. That command processor is addressed by absolute path (`ComSpec`, otherwise `%SystemRoot%\System32\cmd.exe`) instead of by bare name, so a host whose PATH omits the system directories still runs the shim; a spawn that still fails settles as a failed job carrying the reason instead of taking the dsh host process down. Desktop profile discovery reads the packaged launcher's profile environment value or persisted profile selection, and application-owned profile installs, updates and removals run in the host half through the mounted official `pluginManager` service — the same writer that profile's official Plugins page drives through its own RPC face — under the same loopback fence and user click.
- Mutations are serialized through one queue, so concurrent jobs never interleave their before/after profile captures. An install is only `done` when the new dependency actually landed in the profile (and a removal only when it is gone); a success exit code alone is never trusted.
- Enablement re-reads the current profile manifest under that mutation queue and rejects stale or unknown package ids with `404` before writing, so a panel row left behind by an uninstall cannot create an orphan `disabled` override.
- Conflict handling is owner-aware: a duplicate entry id or an insert row naming an unresolvable package rolls the *new* package back through the official remove path. The gateway never writes `disabled` rows for a shared id (such rows cannot stop the loader's duplicate check and would flag the existing owner).
- The boot preflight (`--dump-config`) composes patch layers without importing entries: it catches composition failures, not import-time failures, which still surface at the first real boot.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:789-818](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/gateway.ts#L789-L818)

内存队列范围

<details>
<summary>查看原文（30行）</summary>

```text
  /** Mutation queue: two CLI runs must never interleave their before/after captures. */
  private queue: Promise<void> = Promise.resolve()

  /**
   * @param facts - resolved profile locations.
   * @param env - process environment.
   * @param deps - spawn/binary seams (tests only; production uses the real CLI).
   */
  constructor(
    private readonly facts: ProfileFacts,
    private readonly env: NodeJS.ProcessEnv = process.env,
    private readonly deps: {
      spawnImpl?: typeof spawnDsh
      findBinary?: (env: NodeJS.ProcessEnv) => string | null
      /** The official in-process manager, when the runtime publishes one. */
      nativeManager?: () => NativePluginManager | undefined
    } = {},
  ) {}

  /**
   * Run one profile mutation after every mutation already queued. The returned
   * promise keeps the task's own result or rejection, while the queue tail is
   * always recovered so one failed write cannot block later work. Routes that
   * edit profile files directly must use this seam so they cannot overlap the
   * CLI install/remove writer.
   */
  withMutationLock<T>(task: () => Promise<T>): Promise<T> {
    const result = this.queue.then(task)
    this.queue = result.then(() => undefined, () => undefined)
    return result
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1001-1026](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/gateway.ts#L1001-L1026)

迁移回滚也有二次失败和条件边界

<details>
<summary>查看原文（26行）</summary>

```text
  /** Restore the original legacy package after a failed migration. */
  private async rollbackMigration(
    job: GatewayJob,
    sourceId: string,
    targetId: string,
    oldSpec: string,
    oldIndex: number,
    targetPreviouslyInstalled: boolean,
  ): Promise<void> {
    const binary = this.binary()
    if (binary === null) {
      job.phase = 'error'
      job.error = 'plugin-manager: 迁移失败且无法回滚：dsh CLI not found on PATH'
      return
    }
    const current = await this.capture()
    if (!targetPreviouslyInstalled && current.dependencies.includes(targetId)) {
      await this.runCli(binary, ['plugin', '--profile', this.facts.profileName, 'remove', targetId], REMOVE_TIMEOUT_MS)
    }
    // If the current aggregate already existed before this migration, the
    // profile already had both bundles and was unusable. Keep the single
    // current aggregate on rollback instead of re-adding the legacy duplicate.
    if (targetPreviouslyInstalled) {
      job.phase = 'error'
      job.error = 'plugin-manager: 聚合包迁移失败，已保留当前聚合包并移除旧包'
      return
```

</details>

#### 缺口

- 未验证导入失败与外部 CLI 同时变更后的恢复
  **影响**：不能把预检或回滚称为最终运行保证
  **进一步探讨**：临时 profile 注入导入异常与并发修改，回读落盘和实际加载状态

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 不同运行时的依赖与更新成本由谁承担？

**研究主题**：依赖、兼容与流程、效果与总成本

#### 完整回答

包声明 DSH >=0.2.1-rc.3，浏览器平台使用官方 connection 与 renderer。宿主必须识别正确 profile 和可用写入通道；CLI 路径依赖本机程序，应用拥有的 profile 使用官方进程内 manager。更新写入与代码生效分开，setEnabled 的接口注释也明确下一启动才生效。用户需要承担重启和回归，而不是仅按一次点击计成本。

首次需识别运行时写入通道与profile，持续成本含下载、重启和核心功能复核，失败成本含旧包重取与实际加载状态对账。费用及耗时未知；单位应是重启后功能通过的一次更新。分阶段表见[成本与效果](#cost-and-value)，通道条件见[依赖与流程](#dependencies-and-flow)。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:21-34](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/package.json#L21-L34)

声明的宿主与 client 条件

<details>
<summary>查看原文（14行）</summary>

```text
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-renderer"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/core/service.ts:37-47](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/core/service.ts#L37-L47)

enablement 的下一启动语义

<details>
<summary>查看原文（11行）</summary>

```text
   * Read the recorded plugin boot-failure ring (plugin id, message, stack,
   * install path). On runtimes without a failure ring the host answers an
   * empty snapshot.
   */
  failures(): Promise<PluginFailuresSnapshot>
  /**
   * Flip one plugin's next-start enablement through the active channel (the
   * official installer RPC when available, else the loopback gateway's patch
   * `disabled` override row). The change takes effect after the host restart;
   * a running plugin is not stopped.
   */
```

</details>

**依据 3 · 作者声明**：[packages/dsh-plugin-manager/README.md:69-74](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/README.md#L69-L74)

不同通道与重启限制

```text
- Loopback-only: on a LAN or remote browser the update block renders a local-only notice (the same boundary the official installer page enforces; the gateway refuses non-loopback requests with 403).
- On the npm-published web runtime, gateway writes go through the official CLI. The gateway resolves `dsh` from the host process PATH first, then from `node_modules/.bin` project roots above the running host entry, then from the running host package's own `lib/bin.js`, and finally from the packaged Desktop install's own CLI launcher under the Electron resource directory (`runtime/cli/bin/dsh.cmd` on Windows, `runtime/cli/bin/dsh` elsewhere) — the last one covers a packaged Desktop, where the host runs from inside `app.asar`, the private host package ships no `lib/bin.js`, every `.bin` shim directory is stripped from the installer, and the launcher puts only the bundled `node` on the host's PATH. A Node-script CLI (an npm or homebrew shim, a `.bin` symlink, a `lib/bin.js`) runs under an interpreter resolved without PATH: the `node` installed beside the CLI when the installation ships one, otherwise the host's own interpreter. The CLI's own directory goes first on the child PATH, so the `dsh plugin` run finds the pnpm installed beside it. If no source contains the CLI, CLI-backed writes remain unavailable — an application-owned profile writes through the official in-process manager and needs no binary, so its install, update and removal routes never demand one. CLI output is decoded as bytes in one pass, so a Windows console's code page (CP936/GBK) renders as readable text instead of replacement characters. Installs of git sources can take minutes and run as background jobs. Gateway updates apply only to npm registry sources, resolve the latest version on the host, and succeed only after the same installed package reports that exact version.
- An application-owned profile (the packaged Desktop client) runs installs, updates and removals through the official in-process plugin manager the host mounts, the same writer that profile's official Plugins page drives: the CLI refuses `--profile desktop` outright, and the launcher hands that manager its bundled package-manager invocation. The job, its status polling and its verification are identical to the CLI path — an install must add a dependency the profile did not carry, a removal must drop one, and an update must still report the version the route resolved — while the CLI-specific guards (duplicate-mount stripping, insert-row and boot preflight) stay with the CLI writer, because there the official manager validates and applies the bundle itself. The manager's own verdict is read before the profile is: it resolves a refused run with `application: 'failed'` instead of rejecting, so the job reports that run's real reason (the pnpm diagnostic, or the packages an incompatible-version refusal names) rather than a no-op after an unchanged profile. Since 0.2.1-rc.2 that manager also refuses to install a dependency the profile already carries while the host mounts `hmr` — every profile host — so an update there runs as its two phases instead: remove the installed bundle, then install the target spec through the same manager, and a second phase that fails reinstalls the spec the profile carried before the run, so a failed update leaves a working plugin rather than an empty slot. The single call stays first, so an upstream in-place update would need no change here. Every other runtime keeps the CLI as the single writer of installs, updates and removals.
- Compatibility gating applies only when the target manifest declares a minimum DSH version; packages without `dsh.engines.dsh` update unchecked, and official-installer runtimes (DSHCode and the checkout web) are not gated here because their updates go through the official installer. The running DSH version is read from the installation's own `@deepseek-ai/dsh` manifest, which the launcher publishes as the profile's install anchor — no subprocess, no PATH, and therefore an answer on a packaged Desktop host — with `dsh --version` kept as the fallback for a runtime that publishes no anchor. A requirement the host cannot verify at all is reported as unverified rather than as a version below the minimum: both hold the update back, but only the second sends the user to upgrade DSH.
- Enablement on the npm runtime reports the effective next-start value: a profile override row wins where present, otherwise the installed bundle's own `disabled` rows decide (the aggregate's inactive-by-default families), and rows no layer mentions are enabled. Enabling a row the bundle disables writes an explicit `disabled: false` override, because deleting the user row would only restore the bundle default; the runtime's loader honors these rows at the next start, but this path is less exercised than the official desktop writer's.
- Restart is explicit, user-clicked and three-mode. The route is method-aware: `GET /api/plugin-manager/restart` reads the plan (no side effects, so a prefetch or a typed URL can never stop a host) and `POST` carries it out; every other method is refused with 405. The toolbar reads the plan first, so the confirmation names the same consequence the host will produce. On a terminal launch (`dsh web`) the host starts a detached helper that waits for the outgoing process to exit and then re-executes the same command line, so the port is free before the replacement binds it, and the replacement's output goes to `$DSH_HOME/logs/plugin-manager-restart.log`. Under the packaged Desktop app the plugin cannot relaunch anything — Electron owns the process tree, a detached respawn would fight the shell for the same port, and the official shell answers a host exit with `fail("dsh desktop host stopped")` and an error page, because it exposes no way to ask the shell to restart — so the host exits there only when the shell exports `DSH_SHELL_RESTARTS_HOST=1`, its own declaration that an exiting host is brought back. Without that guarantee the restart panel states that this process cannot restart itself, names the manual way out (quit DeepSeek Harness and open it again), and offers no confirmation button: that path would not restart anything. A launch with no terminal (a supervisor, an editor task) is left running and the toolbar says to restart manually. Without a restart, updated plugin code is loaded at the next start.
```

#### 缺口

- 没有更新任务和失败恢复的时间样本
  **影响**：不能估计单位合格更新成本或节时率
  **进一步探讨**：按更新后核心功能通过数分摊下载、重启、人工复核和恢复投入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样减少“更新完成”与“功能生效”的歧义，谁应先试？

**研究主题**：新假设与验证、采用判断

#### 完整回答

现有模型把 profile 变更核验做得比单纯 CLI 退出码严格，但终点仍早于真实启动。由此提出跨重启验收状态的未验证假设：保存目标版本、profile 摘要和当前阶段，下一启动回读加载版本及最小核心功能信号，失败只提示恢复而不盲目重放安装。对照应包括组合失败、import/apply 失败和外部同时变更。临时 profile 的单插件试用可控；不可中断的生产环境应等待同版本验证。收益若只体现在多一个状态标签、没有降低误报或恢复投入，则无需扩大方案。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:962-998](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/src/host/gateway.ts#L962-L998)

当前 done 前的组合预检和版本核对边界

<details>
<summary>查看原文（37行）</summary>

```text
    const verify = await this.runCli(
      binary,
      ['--profile', this.facts.profileName, '--dump-config'],
      90_000,
    )
    if (verify.code !== 0) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: 迁移后的启动预检失败${verify.output === '' ? '' : `：\n${verify.output}`}`
      return
    }
    // The migration replaces the row-id universe the same way an update does:
    // an override for a row only the retired aggregate declared is an orphan
    // from here on.
    if (await this.pruneOrphanOverrides(job, verify.output) === undefined) return
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(
      this.facts,
      targetId,
      manifest.dependencies[targetId] ?? targetSpec,
      after.layer.rows,
    )
    // A local repository link is the developer checkout source: its version is
    // whatever the checked-out tree contains, not the registry release, so the
    // exact-version gate applies only to npm registry migrations.
    if (!/^(?:link:|file:)/.test(targetSpec) && updated.version !== targetVersion) {
      await this.rollbackMigration(job, sourceId, targetId, oldSpec, oldIndex, targetPreviouslyInstalled)
      job.error = `plugin-manager: 迁移后 ${targetId} 版本为 ${updated.version}，预期 ${targetVersion}`
      return
    }
    job.plugin = updated
    job.conflicts = significantChanges(diffLayer(before.layer, after.layer)).map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    job.phase = 'done'
```

</details>

**依据 2 · 作者声明**：[packages/dsh-plugin-manager/README.md:74-88](https://github.com/zhu1090093659/dsh-web/blob/6b984b10950f78f1f4a5b5adf4c16636b5e6113d/packages/dsh-plugin-manager/README.md#L74-L88)

作者明确重启和不导入预检的限制

<details>
<summary>查看原文（15行）</summary>

```text
- Restart is explicit, user-clicked and three-mode. The route is method-aware: `GET /api/plugin-manager/restart` reads the plan (no side effects, so a prefetch or a typed URL can never stop a host) and `POST` carries it out; every other method is refused with 405. The toolbar reads the plan first, so the confirmation names the same consequence the host will produce. On a terminal launch (`dsh web`) the host starts a detached helper that waits for the outgoing process to exit and then re-executes the same command line, so the port is free before the replacement binds it, and the replacement's output goes to `$DSH_HOME/logs/plugin-manager-restart.log`. Under the packaged Desktop app the plugin cannot relaunch anything — Electron owns the process tree, a detached respawn would fight the shell for the same port, and the official shell answers a host exit with `fail("dsh desktop host stopped")` and an error page, because it exposes no way to ask the shell to restart — so the host exits there only when the shell exports `DSH_SHELL_RESTARTS_HOST=1`, its own declaration that an exiting host is brought back. Without that guarantee the restart panel states that this process cannot restart itself, names the manual way out (quit DeepSeek Harness and open it again), and offers no confirmation button: that path would not restart anything. A launch with no terminal (a supervisor, an editor task) is left running and the toolbar says to restart manually. Without a restart, updated plugin code is loaded at the next start.
- On the npm runtime, duplicate insert-id claims are detected after install and the new plugin is rolled back automatically (a shared id can never be `disabled` away: the loader's duplicate check has no disabled exemption).
- The npm runtime's boot preflight (`--dump-config`) catches composition failures, and the static insert check catches insert rows naming packages that resolve nowhere; runtime import/apply failures still surface only at the next real start.
- Duplicate-mount safeguard (gateway mode): the official CLI's bundle reconciliation re-adds every bundle-declaring dependency to `dsh.profile.bundles` after any install/remove — including packages the composition already mounts through a patch row (a bundle that mounts an external plugin by row), which would double-mount and fail the next boot (`duplicate prefix route`). After every successful CLI mutation the gateway strips exactly the newly added, already-row-mounted bundles entries back out (the manifest write goes through backup + tmp + atomic rename), reports one notice per stripped entry on the job result, and leaves normal installs' bundles entries — and every entry the user had before — untouched.
- The wire shapes mirror the official installer protocol; on drift the tolerant parsers degrade to error rows rather than misbehaving.

## Security model

- Trust boundary is the loopback fence: every gateway route requires a loopback socket address, a loopback Host header, and a non-cross-site origin (socket + Host + Origin + `sec-fetch-site`), the same authority the official installer channels enforce. There is no browser-reachable path from a remote origin; rejected requests receive HTTP 403 with `{ ok: false, error: "forbidden: loopback-only" }`.
- Mutation routes (install / update / remove / set-enabled / restart) carry no token: the loopback authority *is* the local user, matching the official channels. The restart route is the one route whose effect is process-level: it never invents a command line (it re-executes this process's own `execPath` + argv, dropping inspector flags), it refuses to relaunch anything it cannot identify as a terminal launch, and under the packaged Desktop app it stops this process only when the shell declares `DSH_SHELL_RESTARTS_HOST=1`. Any local process can therefore drive plugin installs and removals, and npm installs run package install scripts — treat the gateway as local code execution by design and never expose it beyond loopback.
- Install specs and package ids are rejected when they contain command-shell expansion characters or control characters. On Windows, npm shims are resolved to `node.exe` plus the package `bin.js`; packaged Desktop shims have no adjacent npm layout, so they run through `cmd.exe /d /s /c` with a pre-quoted, verbatim argument envelope. That command processor is addressed by absolute path (`ComSpec`, otherwise `%SystemRoot%\System32\cmd.exe`) instead of by bare name, so a host whose PATH omits the system directories still runs the shim; a spawn that still fails settles as a failed job carrying the reason instead of taking the dsh host process down. Desktop profile discovery reads the packaged launcher's profile environment value or persisted profile selection, and application-owned profile installs, updates and removals run in the host half through the mounted official `pluginManager` service — the same writer that profile's official Plugins page drives through its own RPC face — under the same loopback fence and user click.
- Mutations are serialized through one queue, so concurrent jobs never interleave their before/after profile captures. An install is only `done` when the new dependency actually landed in the profile (and a removal only when it is gone); a success exit code alone is never trusted.
- Enablement re-reads the current profile manifest under that mutation queue and rejects stale or unknown package ids with `404` before writing, so a panel row left behind by an uninstall cannot create an orphan `disabled` override.
- Conflict handling is owner-aware: a duplicate entry id or an insert row naming an unresolvable package rolls the *new* package back through the official remove path. The gateway never writes `disabled` rows for a shared id (such rows cannot stop the loader's duplicate check and would flag the existing owner).
- The boot preflight (`--dump-config`) composes patch layers without importing entries: it catches composition failures, not import-time failures, which still surface at the first real boot.
```

</details>

#### 缺口

- 跨重启验收的用户价值和实现接口未知
  **影响**：新方案不能算当前能力或成熟恢复保证
  **进一步探讨**：用同版本临时 profile 比较误报、恢复与多余重启，并确认宿主可提供可靠加载状态

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
