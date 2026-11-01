# DSH Plugin Manager

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager)

<!-- BEGIN META -->
[![GitHub ★ 9,896](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C896&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 85,019](https://img.shields.io/static/v1?label=npm+30d&message=85%2C019&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager) [![最新发布 2026-10-31](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-31&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-client-ui-plugin-manager)
<!-- END META -->

> **功能**：在 DSH 官方插件页面检查更新与兼容声明，并提供更新和重启入口。

> **亮点**：组件将多通道版本检查、目标版本回读与重启入口接入官方页面，队列和写后校验有明确接线；不证明插件已加载或更新更省时。[Q02](#research-q02) [Q03](#research-q03)

> **主要限制**：客户端更新只传 ID，服务端重新读取 latest，用户先前看到的版本未绑定；启动修复不走普通队列，退出码或 done 也不能证明磁盘、进程与功能完全恢复。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 谁使用它，相对官方插件管理增加什么？](#detail-section-11)
  - [Q02 · 用户更新如何通过双通道到版本写入与读取？](#detail-section-12)
  - [Q03 · 失败补偿、并发和重启保证什么？](#detail-section-13)
  - [Q04 · 安装权限与总成本如何影响采用？](#detail-section-14)
  - [Q05 · 哪些接缝可借鉴，未来如何证伪？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：熟悉 profile 的本机用户管理多个 DSH 扩展时，可以集中检查更新；实际维护收益尚无同条件对照。[Q01](#research-q01)

用户可用官方插件页面或指定版本的 CLI 手工检查、安装和回归；该组件提供集中入口但不替代人工确认。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 更新查询 | 汇总可查询的插件版本和兼容声明 | registry 获取失败的项可能被跳过 |
| 更新任务 | 通过官方通道或 gateway 写入目标版本 | gateway 重新解析 latest，写后版本不等于已加载 |
| 重启计划 | 按运行方式决定重启或手动操作 | helper 启动不证明新实例健康 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与宿主 Web 服务 | 必需 | 注册页面与 gateway | 不满足时无法假定加载 |
| 正确 profile 与写入权限 | 写操作需要 | 安装、更新和启停 | 目标错误或无权限应停止 |
| Registry 与官方 CLI 或 writer | 对应更新路径需要 | 查询和写入包 | 查询或 writer 不可用应检查错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 维护者备份并确认隔离 profile | 目标不明不写入 |
| 检查 | 用户查看更新及兼容声明 | 查询缺失不视为没有更新 |
| 更新 | 用户选择可信插件并核对实际版本 | 版本漂移或错误时停后续操作 |
| 验收 | 用户按需要重启并测试核心功能 | 未加载或状态不明时核对磁盘并恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 安装和 registry 资源未知 | 备份与核实 profile | 兼容未实测 |
| 持续使用 | 下载与磁盘成本未知 | 审阅版本、重启和回归 | 不推算节时 |
| 失败恢复 | 重试和恢复资源未知 | 核查文件、实例与功能 | 回滚退出码不证明完全恢复 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 更新管理 | 客户端与 gateway 写后核对目标版本 | 实际运行加载与功能正确性 |
| 重启 | 根据进程形态计划手工或重启 | 新进程健康和插件功能 |

> **思考**：客户端更新只传 ID，服务端重新读取 latest，用户先前看到的版本未绑定；启动修复不走普通队列，退出码或 done 也不能证明磁盘、进程与功能完全恢复。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：组件将多通道版本检查、目标版本回读与重启入口接入官方页面，队列和写后校验有明确接线；不证明插件已加载或更新更省时。[Q02](#research-q02) [Q03](#research-q03)

单进程队列、写后版本读取及条件化重启划分有用接缝；启动修复、外部 writer 和重启后的真实加载仍需独立协调与验收。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

客户端更新只传 ID，服务端重新读取 latest，用户先前看到的版本未绑定；启动修复不走普通队列，退出码或 done 也不能证明磁盘、进程与功能完全恢复。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

熟悉 profile 的维护者先在备份过的可弃置环境试更新一个可信非关键包；版本、目标或恢复不明时停下并人工核对，再用官方固定版本命令和回归。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持代表路径机制；未执行插件、实际写入或重启，未来设计为假设。

- 已检查：作者 README、包清单、源码路径 packages/dsh-plugin-manager/package.json、packages/dsh-plugin-manager/README.md、packages/dsh-plugin-manager/src/client/index.ts、packages/dsh-plugin-manager/src/host/routes.ts、packages/dsh-plugin-manager/src/host/gateway.ts、packages/dsh-plugin-manager/src/index.ts、packages/dsh-plugin-manager/src/host/restart.ts、packages/dsh-plugin-manager/src/host/loopback.ts 及固定范围 inventory；组件：packages/dsh-plugin-manager。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本检查客户端 face、gateway 更新、启动修复、回滚、loopback 和重启代表路径；未全审官方 writer、所有脚本、HMR 和进程树，未执行目标。
- 下一步：在备份的隔离 profile 验证预览后 registry 变更、修复并发、超时、重启及实际功能，逐步读回文件与实例。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.13（[固定提交 68a78d0](https://github.com/zhu1090093659/dsh-web/tree/68a78d05a6c8c27305671cfc42c30cbbec8014f5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：把用户看到的 expectedVersion 绑定到更新、协调启动修复并在重启后回读加载版本与核心功能，可能减少版本漂移及半完成误判；对照官方固定 spec 与人工清单测错误率和总成本，若无额外收益则否定。[Q05](#research-q05)

在备份的隔离 profile 验证预览后 registry 变更、修复并发、超时、重启及实际功能，逐步读回文件与实例。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 335 | — | — | 11011 |
| .ts | source | 30 | 7244 | 4087 | 2774 | — |
| .tsx | source | 5 | 1323 | 889 | 340 | — |
| .ts | test | 28 | 7301 | 5308 | 1171 | — |
| .tsx | test | 4 | 1778 | 1165 | 336 | — |

</details>

**活跃度**

[![Issue 未关闭 2](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=2&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 170](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=170&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z) [![近30天关闭 173](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=173&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T06%3A31%3A34.186Z..2026-11-01T06%3A31%3A34.186Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 DSH 插件管理界面的双通道、版本更新和恢复边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁使用它，相对官方插件管理增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

维护多个 DSH 扩展且熟悉 profile 的本机用户，可以在官方插件页面检查已安装项的更新及兼容声明。它是 DSH host/client bundle 插件，客户端在详情插槽注册更新区，并在页面工具栏接入查询和更新；官方页面和安装器仍属于宿主。相对逐项使用官方命令检查与安装，插件将版本查询、逐项操作和重启入口集中；这不证明节省时间，也不替代确认目标 profile 与实际功能。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:1-23](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/package.json#L1-L23)

子包声明 host/client 入口及版本。

<details>
<summary>查看原文（23行）</summary>

```text
{
  "name": "@linxin666/dsh-client-ui-plugin-manager",
  "description": "Update checking for the dsh web GUI's official Plugins page: compares installed plugins against the version their registry source serves, gates the update on the DSH runtime minimum the release declares, and drives the update through the official installer channel or this package's loopback CLI gateway.",
  "version": "0.4.13",
  "icon": "icon.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/client.js"
    },
    "./src/*": "./src/*",
    "./locale/en.json": "./locale/en.json",
    "./locale/zh.json": "./locale/zh.json",
    "./package.json": "./package.json"
  },
  "dsh": {
```

</details>

**依据 2 · 作者声明**：[packages/dsh-plugin-manager/README.md:18-24](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/README.md#L18-L24)

作者描述官方页面增强、批量操作和通道。

```text
An update and lifecycle manager for DeepSeek Harness (DSH) Web GUI and official desktop client: adds real-time registry version comparisons with DSH runtime compatibility checks directly into the official Plugins page, providing list-level batch updates, safe rollback mechanisms, and restart-to-apply workflows.

## What it does

- Contributes a check-for-updates block into the official Plugins page (the `plugins.detail.section` seat that page declares), rendered on an installed bundle's page and nowhere else. There is no tab of its own in the Plugins settings section.
- Adds a list-level toolbar beside that page's **Installed** heading. The heading is the page's own chrome and the page declares no seat beside it (its extension points are `plugins.detail.*`, `plugins.item`, `plugins.bundle.config`, `plugins.row.config` and `plugins.bundle.activation`), so the toolbar is inserted into that element and kept in place through the family's shared body-mutation hub. One click checks every installed plugin; the panel lists the third-party rows that have a newer release, with the declared DSH minimum for any row this runtime is too old for; **Update all** applies the eligible rows one at a time with per-row progress and stops at the first failure, leaving the rest listed; **Restart now** then makes the update effective (see the restart note under Known limitations). Official `@deepseek-ai/` packages are never updated in bulk — their version belongs to the DSH installation.
- Dual-channel transport: on runtimes with the official installer services (DSHCode and the 1.0.4 checkout web), every operation rides the official `/plugin-installer` and `/plugin-control` loopback RPC channels; on the npm-published web runtime those channels do not exist, so the package's host half mounts a loopback-fenced HTTP gateway that spawns the official `dsh plugin` CLI for installs/removals (the single writer) and writes `disabled` override rows for enablement. An application-owned profile (a packaged Desktop launch) takes the third writer for installs, updates and removals: the official in-process plugin manager the host mounts, because the CLI refuses to write that profile at all.
```

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:386-403](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/client/index.ts#L386-L403)

工具栏接入查询、更新及重启。

<details>
<summary>查看原文（18行）</summary>

```text
  // The list-level toolbar rides the page's own "Installed" heading: the
  // official page declares no seat beside it, so the entry is inserted into
  // the heading element itself and tracks the page through the shared body
  // mutation hub. Its translate function is rebuilt on every render so a
  // language switch reaches copy that no slot outlet owns.
  ctx.effect(() => {
    try {
      return mountPluginListToolbar({
        props: () => ({
          isLoopback: face.isLoopback,
          checkUpdates: face.checkUpdates,
          update: face.update,
          restartPlan: face.restartPlan,
          restart: face.restart,
          t: ctx.locale.bind(NS),
        }),
        subscribe: listener => ctx.locale.subscribe(listener),
      })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:440-453](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/client/index.ts#L440-L453)

详情区实际注册更新组件。

<details>
<summary>查看原文（14行）</summary>

```text
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
```

</details>

#### 缺口

- 缺少同批插件维护任务的用户与时间对照
  **影响**：不能推断净节时或长期采用价值
  **进一步探讨**：固定 profile 和插件批次，对比官方命令及界面流程的正确率与人工时间。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 用户更新如何通过双通道到版本写入与读取？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

客户端共享 face 根据探测结果选择官方 RPC 或 gateway；gateway 的更新请求只提交 ID。服务端在 mutation lock 中重新读取 profile，向 registry 获取当前 latest，检查声明的 DSH 范围后用该版本建立更新任务；未提供要求时不会得到同样的兼容性证明。gateway 将任务排队，普通 profile 经官方 CLI，应用拥有的桌面 profile 可走宿主官方 manager。两条所读更新路径都在写后读取 profile 与目标版本，错误条件中不把成功返回直接当作版本已落地。用户此前列表里看到的 latest 没有作为 expectedVersion 传给此请求，所以列表到点击之间 registry 变化可能改变目标版本；当前仍需确认用户期望。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:215-229](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/client/index.ts#L215-L229)

gateway 更新只发送插件 ID 并等待任务。

<details>
<summary>查看原文（15行）</summary>

```text
    update: async (id: string): Promise<PluginUpdateResult> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/update`, {
          method: 'POST',
          body: JSON.stringify({ id }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway update returned no job')
        const job = await waitJob(started.jobId)
        return {
          plugin: parseInstalledPlugin({ plugin: job.plugin }),
          // The job is done either way; this is the difference between an
          // update this process serves and one only a restart loads.
          restartRequired: parseRestartRequired(job.restartRequired),
        }
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:313-338](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/client/index.ts#L313-L338)

共享 face 按通道选择并通知。

<details>
<summary>查看原文（26行）</summary>

```text
  // The shared face.

  return {
    isLoopback: connection.isLoopback,
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

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:331-351](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/routes.ts#L331-L351)

更新校验 ID 并锁内重读 profile。

<details>
<summary>查看原文（21行）</summary>

```text
  const updateHandler = async (req: IncomingMessage, res: ServerResponse): Promise<void> => {
    const body = (await readJsonBody(req, { maxBytes: 64 * 1024, objectOnly: true }) ?? {}) as Record<string, unknown>
    const id = body['id']
    if (typeof id !== 'string' || id.trim() === '') {
      writeJson(res, 400, { error: 'plugin-manager: update needs an id' })
      return
    }
    const target = id.trim()
    const unsafe = unsafeSpecReason(target)
    if (unsafe !== undefined) {
      writeJson(res, 400, { error: unsafe })
      return
    }
    if (!deps.cliAvailable() && !gateway.usesNativeWriter()) {
      writeJson(res, 500, { error: 'plugin-manager: dsh CLI not found on PATH' })
      return
    }
    const outcome = await gateway.withMutationLock(async () => {
      const patchText = await readPatchText(facts.patchPath)
      const row = (await snapshotGateway(facts, patchText)).plugins.find(plugin => plugin.id === target)
      if (row === undefined) return { status: 404, error: `plugin-manager: plugin ${target} is not installed` }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-400](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/routes.ts#L378-L400)

重新获取 latest、检查兼容并提交版本。

<details>
<summary>查看原文（23行）</summary>

```text
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
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
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:867-882](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L867-L882)

mutation 队列顺序与失败后恢复队列尾。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1162-1187](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L1162-L1187)

根据目标版本选择官方 manager 或 CLI。

<details>
<summary>查看原文（26行）</summary>

```text
  update(id: string, version: string): { jobId: string } {
    const spec = `${id}@${version}`
    const job: GatewayJob = {
      id: `job-${++this.counter}`,
      action: 'update',
      spec,
      targetId: id,
      targetVersion: version,
      phase: 'running',
    }
    this.jobs.set(job.id, job)
    const unsafe = unsafeSpecReason(spec)
    if (unsafe !== undefined) {
      job.phase = 'error'
      job.error = unsafe
      this.retainFinished(job.id)
      return { jobId: job.id }
    }
    // An application-owned profile takes the official writer; everything else
    // keeps the CLI, whose reconciliation guards this gateway compensates for.
    const native = this.nativeManager()
    if (native !== undefined) {
      this.enqueueNativeUpdate(job, native)
      return { jobId: job.id }
    }
    this.enqueue(() => this.run(job, ['plugin', '--profile', this.facts.profileName, 'add', spec], ADD_TIMEOUT_MS))
```

</details>

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1301-1317](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L1301-L1317)

native 路径回读依赖和版本。

<details>
<summary>查看原文（17行）</summary>

```text
    if (refusal !== undefined) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器更新失败：${refusal}`
      return
    }
    const after = await this.capture()
    if (!after.dependencies.includes(targetId)) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但目标插件未保留在 profile 中（更新未生效）`
      return
    }
    const manifest = await readProfileManifest(this.facts.packageJsonPath)
    const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
    if (updated.version !== targetVersion) {
      job.phase = 'error'
      job.error = `plugin-manager: 官方插件管理器报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
      return
```

</details>

**依据 8 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1784-1809](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L1784-L1809)

CLI 更新回读目标版本和启动预检。

<details>
<summary>查看原文（26行）</summary>

```text
    } else if (job.action === 'update') {
      const targetId = job.targetId
      const targetVersion = job.targetVersion
      if (targetId === undefined || targetVersion === undefined || !after.dependencies.includes(targetId)) {
        job.phase = 'error'
        job.error = tolerated?.output ?? 'plugin-manager: dsh plugin add 报告成功，但目标插件未保留在 profile 中（更新未生效）'
        return
      }
      const manifest = await readProfileManifest(this.facts.packageJsonPath)
      const updated = await buildPluginRow(this.facts, targetId, manifest.dependencies[targetId] ?? job.spec, after.layer.rows)
      if (updated.version !== targetVersion) {
        job.phase = 'error'
        job.error = tolerated?.output ?? `plugin-manager: dsh plugin add 报告成功，但 ${targetId} 仍为 ${updated.version}，预期 ${targetVersion}（更新未生效）`
        return
      }
      // B10 (update): the replacement must not drop the selection it found. A
      // package the profile mounts through a patch row was never selected, so
      // its absence is the state the run found, not a loss.
      if (await this.bundleSelectionMissing(targetId, reconciledBundles, before.bundles.includes(targetId))) {
        job.phase = 'error'
        job.error = this.halfMountError(targetId, 'dsh plugin add 更新了版本，但 ', tolerated)
        return
      }
      job.plugin = updated
      const dump = await this.verifyBoot(job, before, after, conflicts)
      if (job.phase === 'error') return
```

</details>

#### 缺口

- 官方 RPC 分支的 writer 和真实 profile 行为未在宿主验收
  **影响**：不能证明所有运行形态的写后状态及版本一致
  **进一步探讨**：分别使用隔离 CLI 和应用拥有 profile，记录版本漂移及实际写入结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 失败补偿、并发和重启保证什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

普通 gateway 任务通过内部队列串行，但启动时还会定时调用 repairProfileRowNames，它直接读取并在需要时写 patch，所读调用不经过同一队列；外部 CLI 或其他进程也不受此进程队列控制。新安装发生特定冲突时尝试调用 CLI 移除，回滚成功判断依据该移除命令退出码，失败报告手动操作；这不证明磁盘或已加载代码完全恢复。工具更新任务可标记 done 并报告需要重启，但版本落盘和预检不是当前进程已加载、功能正常的证据。重启计划对非交互式进程选择 manual，对受支持桌面 shell 或可重新启动的交互模式另做处理；helper 启动也不等于新进程健康。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:867-882](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L867-L882)

队列保护本 gateway 提交的任务。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/index.ts:102-118](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/index.ts#L102-L118)

启动定时调用修复。

<details>
<summary>查看原文（17行）</summary>

```text
  // A bundle that renamed a row's package leaves every profile row that named
  // the old one dead (issue #1901 moved the aggregate's family rows from the
  // `@linxin666/dsh-web-all/<family>` subpath to the real package, and the
  // loader skips a row whose name does not match the inserted row). The repair
  // runs once the boot settled, so the rewrite cannot race the composition,
  // and it writes only when a row actually changed.
  ctx.effect(() => {
    const timer = setTimeout(() => {
      void gateway.repairProfileRowNames().then((repaired) => {
        if (repaired.length === 0) return
        console.warn('[plugin-manager] 已修复 profile 中失效的行名：' + repaired.map(row => `${row.id}（${row.from} → ${row.to}）`).join('、'))
      }).catch((error: unknown) => {
        console.error('[plugin-manager] profile 行名修复失败：' + (error instanceof Error ? error.message : String(error)))
      })
    }, 1500)
    return () => { clearTimeout(timer) }
  }, 'plugin-manager: stale row name repair')
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2015-2034](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L2015-L2034)

修复直接读取并写 patch，未在此经队列。

<details>
<summary>查看原文（20行）</summary>

```text
  async repairProfileRowNames(): Promise<Array<{ id: string; from: string; to: string }>> {
    const names = await this.liveEntryNames()
    if (names === undefined || names.size === 0) return []
    let text: string
    try {
      text = await readFile(this.facts.patchPath, 'utf8')
    } catch {
      return []
    }
    let repaired: RepairedRowNames
    try {
      repaired = repairStaleRowNames(text, this.facts.patchPath, names)
    } catch {
      // A patch file this gateway cannot parse is not its to repair: the CLI
      // owns that file and reports its own parse error.
      return []
    }
    if (repaired.repaired.length === 0) return []
    await writePatchAtomic(this.facts.patchPath, repaired.text)
    return repaired.repaired
```

</details>

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2117-2135](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L2117-L2135)

冲突回滚依 CLI 退出码并报告失败。

<details>
<summary>查看原文（19行）</summary>

```text
  private async rollbackInstall(job: GatewayJob, name: string, reason: string, conflicts: LayerChange[]): Promise<void> {
    let rolledBack = false
    let tail = ''
    const binary = this.binary()
    if (binary !== null) {
      const output = createOutputCapture(MAX_OUTPUT_BYTES)
      const child = this.spawnCli(binary, ['plugin', '--profile', this.facts.profileName, 'remove', name])
      child.stdout?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      child.stderr?.on('data', (chunk: Buffer) => { capture(chunk, output) })
      const code = await awaitCliExit(child, output, REMOVE_TIMEOUT_MS)
      rolledBack = code === 0
      tail = output.read().trim()
    }
    job.phase = 'error'
    job.error = rolledBack
      ? `plugin-manager: ${reason}，已自动回滚 ${name}`
      : `plugin-manager: ${reason}；自动回滚失败，请手动执行 dsh plugin --profile ${this.facts.profileName} remove ${name}${tail === '' ? '' : `：\n${tail}`}`
    conflicts.push({ id: name, from: 'enabled', to: 'uninstalled' })
    job.conflicts = conflicts.map(change => ({ id: change.id, name: change.id, from: change.from, to: change.to }))
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:1323-1333](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L1323-L1333)

版本落地和重启要求与任务 done 的关系。

<details>
<summary>查看原文（11行）</summary>

```text
    job.plugin = updated
    job.conflicts = significantChanges(diffLayer(before.layer, after.layer)).map(change => ({
      id: change.id,
      name: change.id,
      from: change.from,
      to: change.to,
    }))
    // The version landed, so the job is `done`; this names what only a restart
    // can load, which is exactly the fact an in-place success does not carry.
    if (restartRequired) job.restartRequired = [targetId]
    job.phase = 'done'
```

</details>

**依据 6 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:113-131](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/restart.ts#L113-L131)

根据进程形态决定手工或 shell 重启。

<details>
<summary>查看原文（19行）</summary>

```text
export function planRestart(facts: RestartFacts): RestartPlan {
  // The Desktop shell owns this process tree: it is the only party that can
  // relaunch the application, and it already offers that action when the host
  // stops. ELECTRON_RUN_AS_NODE is the second, launcher-independent signal for
  // a host started by an Electron shell (the packaged Desktop sets it; a
  // command-line launch never does). Owning the tree is not the same as
  // replacing it, though: without the shell's restart guarantee, exiting here
  // leaves the user with a stopped host and an error page, so keep serving.
  if (facts.desktop === true || facts.env.ELECTRON_RUN_AS_NODE === '1') {
    return shellRestartIsSupported(facts.env) ? { mode: 'shell' } : { mode: 'manual' }
  }
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

**依据 7 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:251-268](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/restart.ts#L251-L268)

helper 无法启动时回退手工；响应与退出之间有时序。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Carry out one restart plan.
 * @param plan - the verdict from {@link planRestart}.
 * @param runtime - effect seams; the defaults spawn the helper and exit.
 * @returns the mode actually used: 'relaunch' degrades to 'manual' when the
 * helper could not be started, so a process that cannot be replaced stays up.
 */
export function performRestart(plan: RestartPlan, runtime: RestartRuntime = {}): RestartMode {
  if (plan.mode === 'manual') return 'manual'
  const startHelper = runtime.startHelper ?? ((command: RelaunchCommand) => startRelaunchHelper(command))
  const schedule = runtime.schedule ?? ((run: () => void, delayMs: number) => { setTimeout(run, delayMs) })
  const exit = runtime.exit ?? (() => { process.exit(0) })
  if (plan.mode === 'relaunch') {
    if (plan.command === undefined || !startHelper(plan.command)) return 'manual'
  }
  // The response must reach the browser before this process disappears.
  schedule(exit, RESTART_EXIT_DELAY_MS)
  return plan.mode
```

</details>

#### 缺口

- 没有并发 writer、超时和进程退出的故障注入
  **影响**：不能保证所有失败无副作用或新版本已加载
  **进一步探讨**：隔离 profile 模拟修复与更新并发、CLI 中断及重启后版本功能读回。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 安装权限与总成本如何影响采用？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

包依赖兼容 DSH 和宿主 Web 服务，gateway 每条处理器先检查 loopback socket、Host 及浏览器来源标记；这是一条本机信任边界，不是针对本机其他进程的身份认证。安装会运行官方 CLI 或宿主 writer，并可能运行包安装脚本；需先信任来源和目标 profile。首次使用需要准备隔离 profile、备份与 registry；持续使用包括审阅版本、处理不完整查询、重启和回归；失败恢复需核磁盘、实例和功能，资源、费用与时间均无实测。对要求精确预览版本、不可中断生产或不了解恢复的人，应先保留官方固定 spec 与人工回归流程。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/package.json:24-48](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/package.json#L24-L48)

bundle、客户端与宿主依赖声明。

<details>
<summary>查看原文（25行）</summary>

```text
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
  },
  "scripts": {
    "build": "tsc -b tsconfig.build.json && tsdown",
    "prepare": "tsdown",
    "watch": "tsdown --watch",
    "test": "vitest run",
    "typecheck": "tsgo --noEmit"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": ">=0.2.1-rc.3",
    "react": "^18.2.0"
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:271-283](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/routes.ts#L271-L283)

每个 gateway handler 的 loopback guard。

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

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/loopback.ts:64-91](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/loopback.ts#L64-L91)

socket、Host、转发标记及来源判定。

<details>
<summary>查看原文（28行）</summary>

```text
/**
 * Request-level trust fence: a loopback socket address AND a loopback Host
 * header, plus browser same-origin markers. The socket address is
 * authoritative for a direct connection; a request that carries a forwarding
 * header is refused outright, because a proxy in front of the host makes both
 * the socket address and the Host header describe the proxy rather than the
 * client. X-Forwarded-For is therefore never evidence *for* loopback.
 */
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
```

</details>

**依据 4 · 作者声明**：[packages/dsh-plugin-manager/README.md:84-87](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/README.md#L84-L87)

作者说明本机权限与安装脚本的安全边界。

```text
## Security model

- Trust boundary is the loopback fence: every gateway route requires a loopback socket address, a loopback Host header, and a non-cross-site origin (socket + Host + Origin + `sec-fetch-site`), the same authority the official installer channels enforce. There is no browser-reachable path from a remote origin; rejected requests receive HTTP 403 with `{ ok: false, error: "forbidden: loopback-only" }`.
- Mutation routes (install / update / remove / set-enabled / restart) carry no token: the loopback authority *is* the local user, matching the official channels. The restart route is the one route whose effect is process-level: it never invents a command line (it re-executes this process's own `execPath` + argv, dropping inspector flags), it refuses to relaunch anything it cannot identify as a terminal launch, and under the packaged Desktop app it stops this process only when the shell declares `DSH_SHELL_RESTARTS_HOST=1`. Any local process can therefore drive plugin installs and removals, and npm installs run package install scripts — treat the gateway as local code execution by design and never expose it beyond loopback.
```

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:593-605](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/routes.ts#L593-L605)

不可获取 manifest 时跳过更新项。

<details>
<summary>查看原文（13行）</summary>

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
```

</details>

#### 缺口

- 未执行真实宿主、第三方包脚本和失败恢复
  **影响**：无法量化总成本或保证所有本机程序可信
  **进一步探讨**：在可弃置 DSH_HOME 中核对单个可信包的写入、进程、重启和恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些接缝可借鉴，未来如何证伪？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴单一进程内的顺序队列、目标版本写后核对、异常时保留明确错误和根据启动来源选择重启计划；这些不是跨进程锁，也不能证明功能加载。未验证假设是让确认请求绑定用户看到的 expectedVersion，将启动修复纳入相同写入协调，并在重启后回读实际加载版本与一项核心功能，可减少版本漂移和半完成误判；这引入更多状态、失败恢复与验收成本。应对同一批包括 registry 版本变化与并发修复的更新任务，对比当前流程和绑定方案的错误版本、漏报、人工恢复与总时间；若官方固定版本命令加清单同样可靠且成本更低则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-plugin-manager/src/client/index.ts:215-223](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/client/index.ts#L215-L223)

当前客户端只传 ID。

```text
    update: async (id: string): Promise<PluginUpdateResult> => {
      gatewayInflight = true
      try {
        const started = await gatewayJson(`${GATEWAY_PREFIX}/update`, {
          method: 'POST',
          body: JSON.stringify({ id }),
        }) as { jobId?: string }
        if (started.jobId === undefined) throw new Error('plugin-manager: gateway update returned no job')
        const job = await waitJob(started.jobId)
```

**依据 2 · 源码核查**：[packages/dsh-plugin-manager/src/host/routes.ts:378-400](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/routes.ts#L378-L400)

服务端重新解析 latest 并建任务。

<details>
<summary>查看原文（23行）</summary>

```text
      if (row.source.kind !== 'npm' || !isDirectRegistrySpec(row.source.spec)) {
        return { status: 400, error: `plugin-manager: ${target} is not a direct npm registry plugin` }
      }
      const manifest = await fetchManifest(target).catch(() => undefined)
      if (manifest === undefined) return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const latest = manifest.version
      if (latest === '') return { status: 502, error: `plugin-manager: cannot resolve the latest version for ${target}` }
      const unsafeLatest = unsafeSpecReason(`${target}@${latest}`)
      if (unsafeLatest !== undefined) return { status: 502, error: unsafeLatest }
      if (row.version === latest) return { status: 409, error: `plugin-manager: ${target} is already at ${latest}` }
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
      }
      return { status: 200, job: gateway.update(target, latest) }
```

</details>

**依据 3 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:867-882](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L867-L882)

内部队列。

<details>
<summary>查看原文（16行）</summary>

```text
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

**依据 4 · 源码核查**：[packages/dsh-plugin-manager/src/host/gateway.ts:2015-2034](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/gateway.ts#L2015-L2034)

直接修复写入。

<details>
<summary>查看原文（20行）</summary>

```text
  async repairProfileRowNames(): Promise<Array<{ id: string; from: string; to: string }>> {
    const names = await this.liveEntryNames()
    if (names === undefined || names.size === 0) return []
    let text: string
    try {
      text = await readFile(this.facts.patchPath, 'utf8')
    } catch {
      return []
    }
    let repaired: RepairedRowNames
    try {
      repaired = repairStaleRowNames(text, this.facts.patchPath, names)
    } catch {
      // A patch file this gateway cannot parse is not its to repair: the CLI
      // owns that file and reports its own parse error.
      return []
    }
    if (repaired.repaired.length === 0) return []
    await writePatchAtomic(this.facts.patchPath, repaired.text)
    return repaired.repaired
```

</details>

**依据 5 · 源码核查**：[packages/dsh-plugin-manager/src/host/restart.ts:251-268](https://github.com/zhu1090093659/dsh-web/blob/68a78d05a6c8c27305671cfc42c30cbbec8014f5/packages/dsh-plugin-manager/src/host/restart.ts#L251-L268)

重启 helper 与手工回退。

<details>
<summary>查看原文（18行）</summary>

```text
/**
 * Carry out one restart plan.
 * @param plan - the verdict from {@link planRestart}.
 * @param runtime - effect seams; the defaults spawn the helper and exit.
 * @returns the mode actually used: 'relaunch' degrades to 'manual' when the
 * helper could not be started, so a process that cannot be replaced stays up.
 */
export function performRestart(plan: RestartPlan, runtime: RestartRuntime = {}): RestartMode {
  if (plan.mode === 'manual') return 'manual'
  const startHelper = runtime.startHelper ?? ((command: RelaunchCommand) => startRelaunchHelper(command))
  const schedule = runtime.schedule ?? ((run: () => void, delayMs: number) => { setTimeout(run, delayMs) })
  const exit = runtime.exit ?? (() => { process.exit(0) })
  if (plan.mode === 'relaunch') {
    if (plan.command === undefined || !startHelper(plan.command)) return 'manual'
  }
  // The response must reach the browser before this process disappears.
  schedule(exit, RESTART_EXIT_DELAY_MS)
  return plan.mode
```

</details>

#### 缺口

- expectedVersion 和跨重启验收方案无实验
  **影响**：不能断言减少误判或维护成本
  **进一步探讨**：记录相同任务的版本漂移、误报和恢复总时间并保留反例。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
