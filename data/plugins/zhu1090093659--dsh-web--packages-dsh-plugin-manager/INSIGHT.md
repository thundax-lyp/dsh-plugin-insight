# DSH Plugin Manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 10,353](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C353&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 102,054](https://img.shields.io/static/v1?label=npm+30d&message=102%2C054&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-11-07](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-07&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：在 DSH 官方插件页检查已装插件版本、兼容性并执行更新。

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 说明，固定插件将包源版本、宿主要求和执行渠道呈现在同一管理任务中，包写入复用宿主现有能力。

> **主要限制**：[Q03](#research-q03) 显示，本地网关允许符合回环条件的无 Origin 调用，超时也不能说明包状态。部署及失败恢复都需要核对实际边界。

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
  - [Q01 · 原生管理页和 CLI 已存在时，增量是什么？](#detail-section-11)
  - [Q02 · 如何取得版本、判断宿主兼容并选择执行渠道？](#detail-section-12)
  - [Q03 · 本地网关的信任和失败边界是什么？](#detail-section-13)
  - [Q04 · 如何比较一次合格更新的成本和收益？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常维护多个社区插件的 DSH 用户，可在官方插件页检查兼容更新并查看处理结果。

已有官方管理页或显式 CLI 可更新已知包，增量主要是集中检查和逐项状态。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 版本检查 | 查看可选更新与宿主要求 | 依赖可取得的 npm 清单 |
| 包操作 | 更新、安装或移除 | 由可用宿主管理渠道执行 |
| 重启计划 | 应用已写入的改动 | 取决于实际启动环境 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH 对应版本与客户端插槽 | 必需 | 显示更新检查 | 不能挂载或不显示 |
| 官方渠道或本地网关 | 执行必需 | 读写 profile | 无适用渠道时失败 |
| npm registry | 查直接发布包 | 读取版本和兼容声明 | 查询失败可能不显示候选 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 操作者备份并固定一个包版本 | 目标 profile 与服务可辨认 |
| 操作 | 单包检查兼容再提交 | 记录网关或官方返回 |
| 验收 | 回读包、bundle 与重启后的加载 | 超时先核实状态再恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 下载和环境开销未知 | 建立本机隔离 profile | 耗时未知 |
| 持续 | 注册表请求及包下载未知 | 核对版本与兼容 | 批量实际节省未知 |
| 恢复 | 重新下载资源未知 | 对账状态、重启或恢复备份 | 外部脚本影响需另查 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 检查 | 集中比较并标示兼容 | 所有来源和版本是否覆盖 |
| 执行 | 按宿主选择写入渠道 | 真实成功率 |
| 后验 | 检查新增依赖和组合声明 | 完整回滚效果 |

> **思考**：[Q03](#research-q03) 显示，本地网关允许符合回环条件的无 Origin 调用，超时也不能说明包状态。部署及失败恢复都需要核对实际边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 和 [Q02](#research-q02) 说明，固定插件将包源版本、宿主要求和执行渠道呈现在同一管理任务中，包写入复用宿主现有能力。

回环围栏、客户端轮询截止、CLI 子进程截止和 profile 后验彼此独立。网关与宿主不同路径的结果需要分别验证。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 显示，本地网关允许符合回环条件的无 Origin 调用，超时也不能说明包状态。部署及失败恢复都需要核对实际边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定本机隔离单包更新，超时先对账，确认原生管理和备份可用后再扩大试用。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持插槽、版本检查和网关后验。真实宿主、完整回滚与任务效益待验证。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/cordis.patch.yml、packages/dsh-plugin-manager/tsdown.config.ts、packages/dsh-plugin-manager/src/index.ts、packages/dsh-plugin-manager/src/client/index.ts、packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/loopback.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/host/restart.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 0.4.16 子包，覆盖主要更新和信任路径，未运行代码，未展开所有 Windows 与迁移例外。
- 下一步：在本机隔离 profile 固定一个通过和一个被拒绝的版本，记录执行渠道、状态、重启和恢复。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.16（[固定提交 971cc3e](https://github.com/zhu1090093659/dsh-web/tree/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 可比较兼容预检能否减少重启后才发现不兼容的返工。若节约被网关与重启排查抵消，放弃假设。

在本机隔离 profile 固定一个通过和一个被拒绝的版本，记录执行渠道、状态、重启和恢复。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 342 | — | — | 11462 |
| .ts | source | 30 | 7756 | 4286 | 3066 | — |
| .tsx | source | 5 | 1348 | 898 | 354 | — |
| .ts | test | 29 | 8465 | 6020 | 1461 | — |
| .tsx | test | 4 | 1778 | 1165 | 336 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-12），可前往 [GitHub Issues](https://github.com/zhu1090093659/dsh-web/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在官方插件页更新一个固定版本时，组件如何决定可更新、由谁执行、怎样核对结果？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 原生管理页和 CLI 已存在时，增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多个社区包的使用者可以在官方插件页集中检查版本、看兼容结论并顺序更新。固定补丁保留官方插件页的 ID，另外插入自己的管理组件。列表工具条依作者说明插在现有页面 DOM，详情使用已声明的扩展位置。相对逐个打开条目或查包后执行 CLI，增量是把批量检查、阻断理由和重启入口聚到同一管理任务；执行仍委托官方接口或 CLI。只有一个已知目标包且能手工查版本时，原生管理路径更直接。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-manager/README.md:18-28](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/README.md#L18-L28)

作者区分更新界面、工具条、渠道及兼容流程。

<details>
<summary>查看原文（11行）</summary>

```text
An update and lifecycle manager for DeepSeek Harness (DSH) Web GUI and official desktop client: adds real-time registry version comparisons with DSH runtime compatibility checks directly into the official Plugins page, providing list-level batch updates, safe rollback mechanisms, and restart-to-apply workflows.

## What it does

- Contributes a check-for-updates block into the official Plugins page (the `plugins.detail.section` seat that page declares), rendered on an installed bundle's page and nowhere else. There is no tab of its own in the Plugins settings section.
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows one at a time with per-row progress and stops at the first failure, leaving the rest listed; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
- Detects the legacy aggregate `@linxin666/dsh-web-ui-all` and converts its update action into a transactional migration to `@linxin666/dsh-web-all`; the gateway removes the legacy package, installs the current package at an exact version, restores the legacy layer position, and verifies `--dump-config` before reporting success.
- Verifies DSH runtime compatibility before npm updates (issue #754): update checks read the declared minimum DSH version from the latest manifest (`dsh.engines.dsh` with a top-level `engines.dsh` fallback), evaluate it as a node-semver range with the call the official boot gate makes — `semver.satisfies(host, range, { includePrerelease: true })` — so `||` alternatives, `^` and `~`, whitespace-separated comparators and x-ranges decide here exactly as they decide at boot, and show the requirement beside the update action. A requirement the running DSH does not satisfy disables the action and says to upgrade DSH. A requirement the host could not verify — an unreadable running version, or a declaration that is not a range node-semver parses — is a different verdict with its own copy: it names no cause and never sends the user to upgrade a DSH that was never compared. Neither verdict lets the update run, and the host update route answers 412 before starting any CLI job in both cases.
- Protects the next boot on the npm runtime: after each install the gateway verifies the dependency actually landed, rejects duplicate entry-id claims and insert rows naming unresolvable packages, and composes the profile with the CLI's `--dump-config` preflight; a conflicting or failing install is rolled back through the official remove path and the existing plugins are never touched.
- Adds a "Built-in plugins" group at the bottom of the official Plugins page list; as the page declares no bottom extension slot, this group is inserted directly into the page DOM as a dedicated container with an independent React root (matching the update toolbar) and automatically resets or detaches on page rerenders and panel switches. By default the group lists only Loader rows not inserted by patches of any installed bundle (8 rows in this deployment), using a subtraction formula that surfaces rows declared in profile patch insert blocks (such as Computer Use's `computer-use` and `computer-use-cua-driver-native`) that were previously invisible in the official page; a control beside the group heading can expand it to append all remaining Loader rows (230 rows in this deployment) into the same list, where each owned row displays "From <bundle package name>" to indicate that it also appears on that bundle's details page. Expanding and collapsing only switches between the two already-read collections without re-reading, writing, or changing the enabled state of any row; switch behavior is identical across both scopes: each row provides a toggle switch calling official `pluginManager` remote `setPluginEnabled` to write the profile patch layer with hot-application (profiles with HMR require no restart); rows judged read-only by the official manager (`management-required` or `unaddressable`) render disabled switches with the lock type explained rather than maintaining a custom whitelist; accepted toggles re-read the Loader to verify state, and failures display copy mapped from official `error.code`.
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/cordis.patch.yml:6-20](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/cordis.patch.yml#L6-L20)

为保留官方页面使用不同 ID 和按包名挂载。

<details>
<summary>查看原文（15行）</summary>

```text
# The row id lives in the loader's GLOBAL id space, one entry per id with
# later-wins and no diagnostic. The official @deepseek-ai/dsh-web-app bundle
# already claims `ui-plugin-manager` for its own plugin page (the half that
# registers the sidebar "Plugins" entry), so this package claims its own id
# instead; sharing the official id dropped the official row silently and the
# sidebar entry disappeared with the whole plugin management page.
#
# The row `name` must stay exactly the package name: the official
# @deepseek-ai/dsh-client-modules mounts a package's browser half on the loader
# row whose specifier resolves to that package's own manifest, so a subpath
# name (the aggregate's `@linxin666/dsh-web-all/plugin-manager` shape) would
# mount the host half only.
- insert:
    - id: ui-plugin-manager-update-check
      name: '@linxin666/dsh-client-ui-plugin-manager'
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:441-459](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/client/index.ts#L441-L459)

详情扩展注册到原生页面。

<details>
<summary>查看原文（19行）</summary>

```text
  }, 'plugin-manager: built-in plugin group')

  // The official Plugins page declares this seat on its main-panel entry and
  // renders one section per contribution on each bundle / row / plugin page;
  // `inject` waits for that declaration, exactly like the family plugin cards
  // that register into `plugins.bundle.config`.
  ctx.slots.inject('plugins.detail.section', () => {
    try {
      return ctx.slots.register({
        name: 'plugins.detail.section',
        id: 'family-update-check',
        order: 30,
        locale: NS,
        inject: () => face,
      }, PluginUpdatePatch)
    } catch {
      return () => {}
    }
  })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx:158-176](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/client/PluginListToolbar.tsx#L158-L176)

批次内串行逐项，遇到失败停止。

<details>
<summary>查看原文（19行）</summary>

```text
    setError(undefined)
    void (async () => {
      const done: string[] = []
      for (const [index, row] of queue.entries()) {
        setCursor({ name: row.id, index: index + 1, total: queue.length })
        try {
          const result = await update(row.id)
          // The update landed; when this process cannot load it, the run still
          // counts as applied and continues, and the panel names the restart.
          if (result.restartRequired.length > 0) {
            setRestartRequired(current => [...current, { id: row.id, version: result.plugin.version }])
          }
        } catch (reason) {
          // Stop at the first failure: the remaining rows stay listed with their
          // versions, so the user sees exactly what did not go through.
          setError(t('failed', { reason: messageOf(reason) }))
          break
        }
        done.push(row.id)
```

</details>

#### 缺口

- 未测固定宿主的实际页面挂载和管理用时
  **影响**：不能确定 DOM 工具条在所有宿主都出现
  **进一步探讨**：比较同一宿主的一组固定第三方包用原生页和插件维护

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 如何取得版本、判断宿主兼容并选择执行渠道？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

客户端先询问网关模式，必要时探测官方安装通道，选择官方 RPC 或本地网关。固定网关仅对可识别的直接 npm 来源取清单，普通更新对比清单版本与当前值，不能把所有出现的差异都理解为更高版本。清单声明 dsh 要求时检查宿主版本，无法比较和明确不兼容均会阻断对应网关更新。官方桌面应用 profile 据作者说明经原生管理服务，普通 Web 网关走 DSH CLI；不能把本地网关的所有检查当作官方路径自身实现。确认是否完成须再看 profile 和运行状态。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:273-295](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/client/index.ts#L273-L295)

网关模式和官方探测。

<details>
<summary>查看原文（23行）</summary>

```text
  let modePromise: Promise<'official' | 'gateway'> | undefined
  const ensureMode = (): Promise<'official' | 'gateway'> => {
    if (modePromise === undefined) {
      modePromise = (async () => {
        // Prefer the host verdict: the gateway's /mode route reports whether
        // the official installer channels exist, so the direct channel probe
        // below (which 405s into the browser console on the npm web runtime)
        // only runs when the host half is absent or explicitly returns null
        // for a desktop runtime whose services are registered in-process.
        try {
          const mode = await gatewayJson(`${GATEWAY_PREFIX}/mode`) as { official?: boolean | null }
          if (mode.official === true) return 'official' as const
          if (mode.official === false) return 'gateway' as const
        } catch {
          // Host half absent (an official runtime without a boot profile):
          // fall back to the direct channel probe.
        }
        try {
          const result = await connection.rpc.call(CHANNEL, LIST_ENDPOINT, {})
          return result.ok ? 'official' as const : 'gateway' as const
        } catch {
          return 'gateway' as const
        }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:320-341](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/client/index.ts#L320-L341)

统一 facade 按模式调用具体安装或更新。

<details>
<summary>查看原文（22行）</summary>

```text
    list: async () => (await ensureMode()) === 'official' ? official.list() : gateway.list(),
    install: async spec => {
      const item = await ((await ensureMode()) === 'official' ? official.install(spec) : gateway.install(spec))
      notifyChange()
      return item
    },
    update: async id => {
      const item = await ((await ensureMode()) === 'official' ? official.update(id) : gateway.update(id))
      notifyChange()
      return item
    },
    uninstall: async id => {
      const rows = await ((await ensureMode()) === 'official' ? official.uninstall(id) : gateway.uninstall(id))
      notifyChange()
      return rows
    },
    setEnabled: async (id, enabled) => {
      const item = await ((await ensureMode()) === 'official' ? official.setEnabled(id, enabled) : gateway.setEnabled(id, enabled))
      notifyChange()
      return item
    },
    checkUpdates: async () => (await ensureMode()) === 'official' ? official.checkUpdates() : gateway.checkUpdates(),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:603-617](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/routes.ts#L603-L617)

直接 npm 项获取清单并填兼容结果。

<details>
<summary>查看原文（15行）</summary>

```text
      if (plugin.source.kind !== 'npm' || !isDirectRegistrySpec(plugin.source.spec)) continue
      const manifest = await fetchManifest(plugin.id).catch(() => undefined)
      if (manifest === undefined || manifest.version === plugin.version) continue
      const update: { id: string; current: string; latest: string; requiresDsh?: string; compatible?: boolean; hostVersion?: string } =
        { id: plugin.id, current: plugin.version, latest: manifest.version }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        update.requiresDsh = requiresDsh
        const verdict = await compatibleVerdict(requiresDsh)
        update.compatible = verdict.compatible
        if (verdict.hostVersion !== undefined) update.hostVersion = verdict.hostVersion
      }
      updates.push(update)
    }
    writeJson(res, 200, { updates })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:388-408](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/routes.ts#L388-L408)

网关更新对指定目标清单重新检查宿主要求。

<details>
<summary>查看原文（21行）</summary>

```text
      // the profile at the target with the update itself unsettled (see
      // gateway.ts verifyBoot). Answering that retry with "already at latest" is
      // a dead end the panel cannot leave: the row already carries the newest
      // version, so the only way out was a reinstall run by hand. Only a
      // recorded failure of this plugin's newest update at this exact version
      // re-runs the install — the same job, preflight included — so a plugin
      // that is genuinely up to date keeps its 409 and writes nothing.
      if (row.version === latest && !gateway.lastUpdateFailed(target, latest)) {
        return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
      }
      const requiresDsh = dshRequirementOf(manifest)
      if (requiresDsh !== undefined) {
        const { hostVersion, compatible } = await compatibleVerdict(requiresDsh)
        if (!compatible) {
          return {
            status: 412,
            error: hostVersion === undefined
              ? `plugin-manager: cannot verify the running DSH version for ${target} against the declared requirement ${requiresDsh}; check the declaration and the DSH runtime before updating`
              : `plugin-manager: ${target} requires DSH ${requiresDsh} (current DSH ${hostVersion}); upgrade DSH before updating`,
          }
        }
```

</details>

**依据 5 · 作者声明**：[packages/dsh-plugin-manager/README.md:23-27](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/README.md#L23-L27)

作者说明双通道与桌面 writer。

```text
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows one at a time with per-row progress and stops at the first failure, leaving the rest listed; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
- Detects the legacy aggregate `@linxin666/dsh-web-ui-all` and converts its update action into a transactional migration to `@linxin666/dsh-web-all`; the gateway removes the legacy package, installs the current package at an exact version, restores the legacy layer position, and verifies `--dump-config` before reporting success.
- Verifies DSH runtime compatibility before npm updates (issue #754): update checks read the declared minimum DSH version from the latest manifest (`dsh.engines.dsh` with a top-level `engines.dsh` fallback), evaluate it as a node-semver range with the call the official boot gate makes — `semver.satisfies(host, range, { includePrerelease: true })` — so `||` alternatives, `^` and `~`, whitespace-separated comparators and x-ranges decide here exactly as they decide at boot, and show the requirement beside the update action. A requirement the running DSH does not satisfy disables the action and says to upgrade DSH. A requirement the host could not verify — an unreadable running version, or a declaration that is not a range node-semver parses — is a different verdict with its own copy: it names no cause and never sends the user to upgrade a DSH that was never compared. Neither verdict lets the update run, and the host update route answers 412 before starting any CLI job in both cases.
- Protects the next boot on the npm runtime: after each install the gateway verifies the dependency actually landed, rejects duplicate entry-id claims and insert rows naming unresolvable packages, and composes the profile with the CLI's `--dump-config` preflight; a conflicting or failing install is rolled back through the official remove path and the existing plugins are never touched.
```

#### 缺口

- 未运行多个宿主或注册表镜像
  **影响**：不能确认客户端选择的模式、镜像最新清单及版本检测效果
  **进一步探讨**：先在隔离 profile 验证一个允许和一个阻断样例

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地网关的信任和失败边界是什么？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

网关检查连接源与 Host 为回环、拒绝携带转发头和跨站标志，请求无 Origin 仍可通过，因此它把合格本地进程当作管理者，没有独立用户 token。代理移除转发头并重写为本地地址时，入口是否仍受保护需由部署验证。客户端轮询超时仅退出等待，没有在该分支取消任务。网关的 CLI 超时只对记录的子进程发送 kill 并等待退出，不能据此确认包脚本的外部副作用已撤回。固定安装路径会检查新增依赖与 bundle，冲突时尝试走回退；前置失败或其他错误是否留下修改要看实际状态，不能把提示或退出码当作完整回滚。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/loopback.ts:72-92](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/loopback.ts#L72-L92)

本地 fence 允许无 Origin，拒绝可识别代理。

<details>
<summary>查看原文（21行）</summary>

```text
export function isLoopbackRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket.remoteAddress)) return false
  if (isProxiedRequest(request)) return false
  const host = request.headers.host
  if (typeof host !== 'string') return false
  let hostUrl: URL
  try {
    hostUrl = new URL('http://' + host)
  } catch {
    return false
  }
  if (!isLoopbackHostname(hostUrl.hostname)) return false
  if (request.headers['sec-fetch-site'] === 'cross-site') return false
  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    return new URL(origin).host === hostUrl.host
  } catch {
    return false
  }
}
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:271-283](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/routes.ts#L271-L283)

网关路由应用回环检查。

<details>
<summary>查看原文（13行）</summary>

```text
  /** Wrap a handler with the loopback fence and JSON error reporting. */
  const guard = (handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>) =>
    async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
      if (!isLoopbackRequest(req)) {
        writeJson(res, 403, { ok: false, error: 'forbidden: loopback-only' })
        return
      }
      try {
        await handler(req, res)
      } catch (error) {
        writeJson(res, 500, { error: messageOf(error) })
      }
    }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:184-197](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/client/index.ts#L184-L197)

客户端轮询截止后抛错，没有取消。

<details>
<summary>查看原文（14行）</summary>

```text
  /** Wait for one gateway job to settle, returning its wire state. */
  const waitJob = async (jobId: string): Promise<GatewayJobWire> => {
    const deadline = Date.now() + JOB_WAIT_MS
    for (;;) {
      const body = await gatewayJson(`${GATEWAY_PREFIX}/status?job=${encodeURIComponent(jobId)}`) as { job?: GatewayJobWire }
      const job = body.job
      if (job === undefined) throw new Error('plugin-manager: gateway job vanished')
      if (job.phase === 'done') return job
      if (job.phase === 'error') throw new Error(job.error ?? 'plugin-manager: gateway job failed')
      if (Date.now() > deadline) throw new Error('plugin-manager: gateway job timed out')
      await new Promise(resolve => { setTimeout(resolve, JOB_POLL_MS) })
    }
  }

```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:625-637](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/gateway.ts#L625-L637)

CLI 超时尝试终止子进程并等待关闭。

<details>
<summary>查看原文（13行）</summary>

```text
export async function awaitCliExit(
  child: ChildProcess,
  output: OutputCapture,
  timeoutMs?: number,
): Promise<number | null> {
  const timer = timeoutMs === undefined ? undefined : setTimeout(() => { child.kill() }, timeoutMs)
  try {
    const exit = await awaitChildExit(child)
    if (exit.spawnError !== undefined) capture(Buffer.from(exit.spawnError + '\n'), output)
    return exit.code
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1882-1928](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/gateway.ts#L1882-L1928)

普通错误结算与安装后验、冲突回退。

<details>
<summary>查看原文（47行）</summary>

```text
    const tolerated: TolerableExit | undefined =
      code !== 0 && reportsIgnoredBuilds(tail) ? { code, output: tail } : undefined
    if (code !== 0 && tolerated === undefined) {
      job.phase = 'error'
      job.error = tail === '' ? `plugin-manager: dsh plugin ${job.action} exited with code ${String(code)}` : tail
      return
    }
    let after = await this.capture()
    // The selection the CLI's own run left behind. Read here, before the
    // duplicate-mount strip below removes any of its entries back out: that
    // strip is this gateway's correction, not evidence of what the run landed.
    const reconciledBundles = after.bundles
    // B9: the CLI's bundle reconciliation re-adds every bundle-declaring
    // dependency to dsh.profile.bundles — including packages the composition
    // already mounts through a patch row (the aggregate's better-sidebar
    // row), which double-mounts and kills the next boot. Strip exactly the
    // newly added, already-row-mounted entries back out before anything else
    // validates or preflights the result.
    const stripped = await this.stripDuplicateMounts(job, before, after)
    if (stripped === undefined) return
    if (stripped.length > 0) {
      job.notices = stripped.map(name => ({ id: name, name, from: 'enabled', to: 'uninstalled' }))
      after = await this.capture()
    }
    const conflicts = significantChanges(diffLayer(before.layer, after.layer))
    if (job.action === 'install') {
      const name = this.newDependency(before, after)
      if (name === undefined) {
        // B8: neither a success exit code nor a tolerated one is proof the
        // install landed.
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin add 报告成功，但 profile 未新增任何依赖（安装未生效）'
        return
      }
      // B10: a dependency written without its bundle selection is a half mount,
      // and the tolerance for pnpm's exit changes nothing about that.
      if (await this.bundleSelectionMissing(name, reconciledBundles)) {
        job.phase = 'error'
        job.error = this.halfMountError(name, 'dsh plugin add 只写入了依赖，', tolerated)
        return
      }
      // B5: a duplicate entry id is boot-blocking. Never write disabled rows
      // for a shared id (they cannot stop the loader's duplicate check and
      // they flag the existing owner) — roll the NEW package back instead.
      const duplicate = await this.detectDuplicateClaims(before, after)
      if (duplicate !== undefined) {
        await this.rollbackInstall(job, name, `与现有插件的入口 id 冲突（${duplicate.ids.join(', ')}）`, conflicts)
```

</details>

#### 缺口

- 未验证反向代理、子进程树和并发外部 CLI
  **影响**：无法保证回环围栏适合暴露或超时后没有残留
  **进一步探讨**：隔离 profile 模拟失联，回读包、bundle、进程与宿主状态后再决定重试

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何比较一次合格更新的成本和收益？

**研究主题**：效果与总成本、新假设与验证、采用判断

#### 完整回答

在专用本机隔离 profile 记录已知包的当前版本、目标版本和原配置，先检查兼容声明，再只更新一个非关键包。轮询丢失或等待超时时，先查网关任务与盘面，避免直接重试；若宿主无法自行重启则用原生方式重启并验证加载。对照原生管理或显式 CLI 的同目标升级，把准备、检查、操作等待、重启和恢复分别计入。待验证假设是预检与集中界面能减少启动后才发现不兼容的返工。若未减少失败或重启及兼容排查抵消节约，放弃假设。若无法限制网关为本机用途或恢复到原版，退出试用并用原生管理和独立备份。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-plugin-manager/README.md:23-27](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/README.md#L23-L27)

作者说明批量更新和后验预检。

```text
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows one at a time with per-row progress and stops at the first failure, leaving the rest listed; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
- Detects the legacy aggregate `@linxin666/dsh-web-ui-all` and converts its update action into a transactional migration to `@linxin666/dsh-web-all`; the gateway removes the legacy package, installs the current package at an exact version, restores the legacy layer position, and verifies `--dump-config` before reporting success.
- Verifies DSH runtime compatibility before npm updates (issue #754): update checks read the declared minimum DSH version from the latest manifest (`dsh.engines.dsh` with a top-level `engines.dsh` fallback), evaluate it as a node-semver range with the call the official boot gate makes — `semver.satisfies(host, range, { includePrerelease: true })` — so `||` alternatives, `^` and `~`, whitespace-separated comparators and x-ranges decide here exactly as they decide at boot, and show the requirement beside the update action. A requirement the running DSH does not satisfy disables the action and says to upgrade DSH. A requirement the host could not verify — an unreadable running version, or a declaration that is not a range node-semver parses — is a different verdict with its own copy: it names no cause and never sends the user to upgrade a DSH that was never compared. Neither verdict lets the update run, and the host update route answers 412 before starting any CLI job in both cases.
- Protects the next boot on the npm runtime: after each install the gateway verifies the dependency actually landed, rejects duplicate entry-id claims and insert rows naming unresolvable packages, and composes the profile with the CLI's `--dump-config` preflight; a conflicting or failing install is rolled back through the official remove path and the existing plugins are never touched.
```

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1906-1928](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/gateway.ts#L1906-L1928)

检查依赖、bundle 和重复声明。

<details>
<summary>查看原文（23行）</summary>

```text
    const conflicts = significantChanges(diffLayer(before.layer, after.layer))
    if (job.action === 'install') {
      const name = this.newDependency(before, after)
      if (name === undefined) {
        // B8: neither a success exit code nor a tolerated one is proof the
        // install landed.
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin add 报告成功，但 profile 未新增任何依赖（安装未生效）'
        return
      }
      // B10: a dependency written without its bundle selection is a half mount,
      // and the tolerance for pnpm's exit changes nothing about that.
      if (await this.bundleSelectionMissing(name, reconciledBundles)) {
        job.phase = 'error'
        job.error = this.halfMountError(name, 'dsh plugin add 只写入了依赖，', tolerated)
        return
      }
      // B5: a duplicate entry id is boot-blocking. Never write disabled rows
      // for a shared id (they cannot stop the loader's duplicate check and
      // they flag the existing owner) — roll the NEW package back instead.
      const duplicate = await this.detectDuplicateClaims(before, after)
      if (duplicate !== undefined) {
        await this.rollbackInstall(job, name, `与现有插件的入口 id 冲突（${duplicate.ids.join(', ')}）`, conflicts)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:240-259](https://github.com/zhu1090093659/dsh-web/blob/971cc3e1f6f5b52bbcd86802a9be0e0c50fc32f1/packages/dsh-plugin-manager/src/host/restart.ts#L240-L259)

重启计划对宿主启动环境做条件判断。

<details>
<summary>查看原文（20行）</summary>

```text
  // a host started by an Electron shell (the packaged Desktop sets it; a
  // command-line launch never does). Owning the tree is not the same as
  // replacing it, though: without the shell's restart guarantee, exiting here
  // leaves the user with a stopped host and an error page, so keep serving.
  if (facts.desktop === true || facts.env.ELECTRON_RUN_AS_NODE === '1') {
    return shellRestartIsSupported(facts.env) ? { mode: 'shell' } : { mode: 'manual' }
  }
  // A systemd service has a manager that owns the process tree and restarts the
  // unit on request, so re-executing in place would fight it. Only the user
  // manager is used: the system manager needs privileges this process does not
  // have, and a request it would refuse is worse than the honest manual answer.
  if (facts.systemd?.scope === 'user') return { mode: 'systemd', unit: facts.systemd.unit }
  // Without a terminal this process was started by something that watches it
  // (a supervisor, an editor task, another app's child process). Re-executing
  // ourselves there would duplicate a server the watcher believes it owns.
  if (!facts.interactive) return { mode: 'manual' }
  // argv[0] is the script the interpreter runs (the dsh CLI entry); without it
  // there is no command line worth re-executing.
  const script = facts.argv[0]
  if (script === undefined || script === '') return { mode: 'manual' }
```

</details>

#### 缺口

- 未测真实更新时间、恢复耗时和重启结果
  **影响**：不能量化成功率或节省
  **进一步探讨**：记录一个允许目标和一个拒绝目标的完整用时与盘面差异

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
