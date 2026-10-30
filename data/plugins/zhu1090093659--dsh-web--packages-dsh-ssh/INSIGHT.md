# SSH

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh)

<!-- BEGIN META -->
[![GitHub ★ 9,728](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=9%2C728&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/zhu1090093659/dsh-web) [![npm 30d 102,864](https://img.shields.io/static/v1?label=npm+30d&message=102%2C864&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@linxin666/dsh-ssh)
<!-- END META -->

> **功能**：DSH远程SSH插件，为开发运维用户统一管理主机、Web终端、文件传输、隧道与按选择器执行的集群命令，并提供六个模型工具。

> **亮点**：DSH配置/连接/GUI工具共享与可追踪逐主机结果有实际接线，alias变更清池/隧道、PTY重附着和SFTP channel释放有用；范围不扩成全运维平台。见[Q01](#research-q01)、[Q02](#research-q02)。

> **主要限制**：断线可重放，实际exec未将signal再给池，alias重连目标未冻结；工具文件不经workspace门卫，默认主机key未pin，配置禁用与完整资源停止不同。见[Q03](#research-q03)。

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
  - [Q01 · 它为谁完成哪种远端工作，本子包贡献和验收对象是什么？](#detail-section-11)
  - [Q02 · GUI和模型如何共用连接，授权、目标身份和执行返回实际怎样传递？](#detail-section-12)
  - [Q03 · 重试、取消、配置变更、凭据和传输存在哪些关键失败边界？](#detail-section-13)
  - [Q04 · 怎样限定采用，依赖、步骤、现金人工与效果分别是什么？](#detail-section-14)
  - [Q05 · 可证伪改进方向是什么，什么时候小补丁已足够？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：为熟悉SSH的DSH用户集中远端排障/文件/隧道；验收真实主机及业务状态，不以连接或exit0代替。见[Q01](#research-q01)。

对照OpenSSH、独立终端/传输客户端及既有远端作业ID/日志；SSH协议和SDK/共享helper非本组件独创。见[Q01](#research-q01)。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
|---|---|---|
| 主机配置与GUI | 共用alias与连接配置、导入入口 | 同home共用；非逐会话主机授权 |
| exec/cluster | 命令与逐host结果、非空selector | broken可重放；非业务事务/目标冻结 |
| Web PTY | 交互shell与重附着 | 独立连接；detach不是立即停止 |
| SFTP | GUI staging或工具本机/远端文件 | 工具host任意路径，无整批回滚保证 |
| 本地隧道 | 127.0.0.1转发远端服务 | 长连接/pinned需显式清理 |

**流程与依赖**

兼容宿主/Node、受控测试机与独立home/专用凭据是前提；key pin/路径沙箱等要求未满足者先观察。条件与遥测表见[Q04](#research-q04)。

只一测试alias→GUI确认后只读对照→逐主机核实际结果→显式关资源/撤测试key，未知不重放；新profile不等新store。步骤见[Q04](#research-q04)。

**效果与成本**

远端/网络/临时磁盘、模型与人工对账恢复成本分列；连接/stream限时、idle与workers不是总费用或副作用上限。表见[Q04](#research-q04)。

配置和操作入口复用、局部生命周期有源码支持；净节时、主机key校验、完整取消和业务终态正确未实测/未保障。效果表见[Q04](#research-q04)。

> **思考**：断线可重放，实际exec未将signal再给池，alias重连目标未冻结；工具文件不经workspace门卫，默认主机key未pin，配置禁用与完整资源停止不同。见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：DSH配置/连接/GUI工具共享与可追踪逐主机结果有实际接线，alias变更清池/隧道、PTY重附着和SFTP channel释放有用；范围不扩成全运维平台。见[Q01](#research-q01)、[Q02](#research-q02)。

单engine、池重连条件、配置变更失效、SFTP finally和独立PTY重附着可复用；取消与重试必须核caller，配置/路由撤下不当所有资源回滚。见[Q02](#research-q02)、[Q03](#research-q03)。

<a id="detail-section-5"></a>

### 1.4 主要限制

断线可重放，实际exec未将signal再给池，alias重连目标未冻结；工具文件不经workspace门卫，默认主机key未pin，配置禁用与完整资源停止不同。见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

有SSH经验且有隔离测试机的用户，可用独立可弃置DSH_HOME、唯一测试alias和临时低权限key，保持无模型轮次，GUI执行一条审核后的只读命令；不用生产凭据、forwardAgent或ProxyCommand。身份/目标/结果、取消或存量资源不明时停操作并人工对账，勿重放写命令；有主机key pin、加密或文件沙箱硬要求时保持观察并用既有方案。见[Q04](#research-q04)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子包核心GUI/工具、连接/命令/集群、PTY、SFTP和隧道重要失败支路已核；额外锁定ssh2官方依赖文档，非完整SSH/OS/宿主安全审计，未运行。只推荐独立DSH_HOME、隔离测试机及临时低权限凭据、无模型轮次的单alias GUI只读小样，不能当生产/非幂等无人运维验收。

- 已检查：作者 README、包清单、源码路径 packages/dsh-ssh/README.zh.md、packages/dsh-ssh/package.json、packages/dsh-ssh/src/client/api.ts、packages/dsh-ssh/src/client/index.ts、packages/dsh-ssh/src/client/native-panel.tsx、packages/dsh-ssh/src/client/panel/ClusterTab.tsx、packages/dsh-ssh/src/client/panel/TerminalTab.tsx、packages/dsh-ssh/src/client/telemetry.ts、packages/dsh-ssh/src/engine.ts、packages/dsh-ssh/src/engine/cluster.ts、packages/dsh-ssh/src/engine/connection-pool.ts、packages/dsh-ssh/src/engine/proxy-command.ts、packages/dsh-ssh/src/engine/pty.ts、packages/dsh-ssh/src/engine/sftp.ts、packages/dsh-ssh/src/engine/terminal-sessions.ts、packages/dsh-ssh/src/engine/tunnel.ts、packages/dsh-ssh/src/index.ts、packages/dsh-ssh/src/loopback.ts、packages/dsh-ssh/src/routes.ts、packages/dsh-ssh/src/store.ts、packages/dsh-ssh/src/tool-surface.ts、packages/dsh-ssh/src/tools.ts、pnpm-lock.yaml 及固定范围 inventory；组件：packages/dsh-ssh。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：定向核本子包manifest/bundle、host/client实际注册与GUI/API、工具到engine、pool/config/auth构造及exec/集群失败、PTY独立会话/重附着、SFTP和tunnel核心调用/清理、store和共享loopback/遥测；必要锁文件及固定ssh2默认主机key契约。未完整审所有认证/多跳/导入解析、SSH密码学、全UI、宿主工具授权与OS/远端进程策略，不执行目标。
- 下一步：授权后隔离测试机对照普通SSH与GUI，注入执行后丢exit、取消回调/队列、alias变更及配置禁用；核真实两端状态与监听/进程，记录重复/错目标、未知保留、恢复人工和总资源，未满足信任/权限条件不试生产。

**分析版本**

- **仓库**：[zhu1090093659/dsh-web](https://github.com/zhu1090093659/dsh-web)
- **版本号**：0.4.12（[固定提交 de02a7f](https://github.com/zhu1090093659/dsh-web/tree/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1)）
- **版本日期**：2026-10-29（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

候选是受验证真实目标/配置版本绑定、取消前置和未知副作用结果对账；先比普通SSH作业ID/日志及几处上游补丁，不凭风险造独立需求。见[Q05](#research-q05)。

授权后隔离测试机对照普通SSH与GUI，注入执行后丢exit、取消回调/队列、alias变更及配置禁用；核真实两端状态与监听/进程，记录重复/错目标、未知保留、恢复人工和总资源，未满足信任/权限条件不试生产。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 3 | 292 | — | — | 6017 |
| .ts | source | 29 | 6515 | 4523 | 1664 | — |
| .tsx | source | 8 | 1972 | 1570 | 305 | — |
| .ts | test | 23 | 5058 | 3901 | 645 | — |
| .tsx | test | 7 | 1881 | 1417 | 242 | — |

</details>

**活跃度**

[![Issue 未关闭 3](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=3&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 183](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=183&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+created%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z) [![近30天关闭 182](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=182&color=737b86&logo=github)](https://github.com/zhu1090093659/dsh-web/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-29T05%3A28%3A58.410Z..2026-10-29T05%3A28%3A58.410Z)



统计日期：2026-10-29。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定SSH子包实际GUI/工具到远端链及失败边界能否支持受控采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 它为谁完成哪种远端工作，本子包贡献和验收对象是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

本项是dsh-web子包@linxin666/dsh-ssh 0.4.12，Apache-2.0，manifest声明DSH>=0.2.1-rc.3、Node ^22.19或>=24、host/client双入口与bundle。它为熟悉SSH的DSH开发/运维用户，把主机配置、交互终端、文件传输、端口转发和集群命令接在一个GUI与六个模型工具上；不是SSH协议、独立Agent或已经完成部署验收的运维平台。对照是OpenSSH、独立终端/文件传输客户端或既有远程作业工具；合格交付是正确主机的预期远端状态，连接ready、echo或退出码0只支持对应操作。

实际host apply创建HostStore与SshEngine，makeRoutes后注册HTTP/WS，tools.register注册ssh_list/exec/upload/download/tunnel/cluster，生命周期由effect持有。client apply创建SshApi并registerSshPanel，原生sidebar.panellist与main slots接同一api/controller；ClusterTab确认框后实际api.cluster→JSON fetch，TerminalTab调用openTerminal/attachTerminal，API创建WebSocket，server升级后打开真实SSH PTY。slot缺失或注册失败会降级不显示界面，不据host注册就断言GUI可用。

增量是DSH中的共享主机配置、alias连接池、PTY重附着、进度/逐主机结果、配置变更后池/隧道失效及模型入口；SSH握手、SFTP等基础能力来自ssh2，xterm/WS/SDK以及共享loopback/遥测不全算原创。这里不把远程Web配对、Git、Skill或插件管理组件的能力归给SSH子包，尤其不能因为同属全家桶就认为paired手机可直接用SSH接口。

旧正式6b984b10950f78f1f4a5b5adf4c16636b5e6113d原稿五题、findings及自代码依赖已完整读取。当前独立复核发现旧“取消signal直接防所有重试”“配置变化清所有连接”需收窄到真实caller与池/隧道；不沿用旧结论当本轮证据。当前没有连接任何远端、执行命令/测试或安装，用户频次、兼容、节时及恢复质量仍未知。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:1-41](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/package.json#L1-L41)

版本、入口和基础运行声明。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "@linxin666/dsh-ssh",
  "description": "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable — mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
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
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/package.json:54-54](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/package.json#L54-L54)

ssh2范围依赖。

```text
    "ssh2": "^1.17.0",
```

**依据 3 · 源码核查**：[packages/dsh-ssh/package.json:101-101](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/package.json#L101-L101)

Apache-2.0。

```text
  "license": "Apache-2.0",
```

**依据 4 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-180](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L148-L180)

共享store/engine和实际六工具构造。

<details>
<summary>查看原文（33行）</summary>

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')

  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
  }

  // The /api/dsh-ssh route family + terminal upgrade.
  const { routes, upgrade, terminalSessions } = makeRoutes({ store, engine })
  let disposeRoutes: (() => void) | undefined

  // Agent tools + their prompt sections.
  const tools = [
    sshListTool(engine),
    sshExecTool(engine),
    sshUploadTool(engine),
    sshDownloadTool(engine),
    sshTunnelTool(engine),
    sshClusterTool(engine),
  ]
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/index.ts:219-238](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L219-L238)

实际HTTP/WS和tools.register。

<details>
<summary>查看原文（20行）</summary>

```text
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-ssh: tools',
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/client/index.ts:106-122](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/index.ts#L106-L122)

SshApi与原生面板实际接线。

<details>
<summary>查看原文（17行）</summary>

```text
  const api = new SshApi()
  // Live terminal-font preference (issue #577): the field lives in this
  // plugin's own profile entry, whose settings page the Host generates from
  // the plugin Config schema; the panel re-applies a change to open terminals
  // without a reconnect.
  const settings = bindSettingsReader<SshClientSettings>(ctx, SETTINGS_NS, TERMINAL_FONT_FIELD)
  const terminalFont: TerminalFontSource = {
    get: () => {
      const snapshot = settings.getSnapshot()
      return snapshot.status === 'ready' ? snapshot.value?.terminalFontFamily : undefined
    },
    subscribe: (listener) => settings.subscribe(listener),
  }
  ctx.effect(() => () => { settings.dispose() }, 'dsh-ssh: settings binding')
  const disposers: Array<() => void> = []
  try {
    disposers.push(registerSshPanel(ctx, controller, api, terminalFont))
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/client/native-panel.tsx:111-140](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/native-panel.tsx#L111-L140)

原生sidebar/main两座注册和释放。

<details>
<summary>查看原文（30行）</summary>

```text
export function registerSshPanel(
  ctx: ClientContext,
  controller: PanelController,
  api: SshApi,
  terminalFont?: TerminalFontSource,
): () => void {
  const slots = ctx.slots as {
    inject(key: string, callback: () => () => void): () => void
    register(options: Record<string, unknown>, component: unknown): () => void
  }
  const disposers: Array<() => void> = []

  disposers.push(slots.inject('sidebar.panellist', () => slots.register({
    name: 'sidebar.panellist',
    id: SSH_PANEL_ID,
    order: PANEL_ORDER,
    // The shell resolves this through resolveSlotLabel on every locale change,
    // so the module-level translate reads the active language at call time.
    label: () => tt('entry.label'),
  }, SshPanelIcon)))

  disposers.push(slots.inject('main', () => slots.register({
    name: 'main',
    key: SSH_PANEL_ID,
    inject: (): PanelFace => ({ controller, api, terminalFont }),
  }, SshPanelPage as never)))

  return () => {
    for (const dispose of disposers.splice(0)) dispose()
  }
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/client/panel/ClusterTab.tsx:32-45](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/panel/ClusterTab.tsx#L32-L45)

GUI确认后实际cluster调用。

<details>
<summary>查看原文（14行）</summary>

```text
  const run = async (): Promise<void> => {
    if (command.trim() === '' || running) return
    if (!window.confirm(tt('cluster.confirm'))) return
    setRunning(true)
    setError(null)
    try {
      const aliasList = splitList(aliases)
      const tagList = splitList(tags)
      const outcome = await api.cluster({
        command: command.trim(),
        aliases: aliasList.length > 0 ? aliasList : undefined,
        environment: environment.trim() === '' ? undefined : environment.trim(),
        tags: tagList.length > 0 ? tagList : undefined,
      })
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/client/api.ts:286-310](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/api.ts#L286-L310)

浏览器exec/cluster真实fetch。

<details>
<summary>查看原文（25行）</summary>

```text
  async exec(alias: string, command: string, timeoutMs?: number): Promise<ExecResult> {
    const response = await fetch(SSH_API.exec, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ alias, command, timeoutMs }),
    })
    const body = await readJson<{ result: ExecResult }>(response)
    return body.result
  }

  async cluster(options: {
    command: string
    aliases?: string[]
    environment?: string
    tags?: string[]
    timeoutMs?: number
    maxWorkers?: number
  }): Promise<ClusterResult[]> {
    const response = await fetch(SSH_API.cluster, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(options),
    })
    const body = await readJson<{ results: ClusterResult[] }>(response)
    return body.results
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/client/panel/TerminalTab.tsx:330-346](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/panel/TerminalTab.tsx#L330-L346)

打开和重附着API的实际caller。

<details>
<summary>查看原文（17行）</summary>

```text
      // A tab that opens a socket starts from a blank screen: without this the
      // previous tab's output stays on the one terminal until the host speaks.
      drawRetained(view.term, tab.id, '')
      controller.clearTerminalOutput(tab.id)
      bindConnection(tab, api.openTerminal(tab.alias, view.term.cols, view.term.rows))
      return
    }
    if (tab.status === 'connected' && tab.sessionId !== undefined) {
      const sessionId = tab.sessionId
      if (needsScreenClear(tab.id)) {
        // The host replays its scrollback on attach, so the screen starts empty
        // and the retained copy is replaced by that replay.
        view.term.reset()
        controller.clearTerminalOutput(tab.id)
        renderedRef.current = tab.id
      }
      bindConnection(tab, api.attachTerminal(sessionId, view.term.cols, view.term.rows))
```

</details>

**依据 11 · 源码核查**：[packages/dsh-ssh/src/routes.ts:456-492](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L456-L492)

WS升级实际open/attach到SSH shell。

<details>
<summary>查看原文（37行）</summary>

```text
  const terminalSessions = new TerminalSessionRegistry({
    openShell: (alias, size, onKeyboardInteractive) => engine.openShell(alias, size, onKeyboardInteractive),
  })
  const upgrade: WebUpgradeRoute = {
    path: SSH_API.terminal,
    handler: (req, socket, head) => {
      if (!isLoopbackRequest(req)) {
        socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const url = new URL(req.url ?? '/', 'http://localhost')
      const alias = queryParam(url, 'alias')
      const sessionId = queryParam(url, 'session')
      if (alias === undefined && sessionId === undefined) {
        socket.write('HTTP/1.1 400 Bad Request\r\nConnection: close\r\n\r\n')
        socket.destroy()
        return
      }
      const cols = Number.parseInt(queryParam(url, 'cols') ?? '80', 10)
      const rows = Number.parseInt(queryParam(url, 'rows') ?? '24', 10)
      const size = {
        cols: Number.isFinite(cols) ? cols : 80,
        rows: Number.isFinite(rows) ? rows : 24,
      }
      terminalWss.handleUpgrade(req, socket, head, (ws) => {
        if (sessionId !== undefined) {
          if (terminalSessions.attach(ws, sessionId, size)) return
          // The session was reaped or the host restarted: tell the view so it
          // can fall back to a fresh connect instead of sitting blank.
          const expired: TerminalServerFrame = { type: 'exit', code: null, error: 'terminal session expired' }
          try { ws.send(JSON.stringify(expired)) } catch { /* socket raced away */ }
          try { ws.close(1000) } catch { /* already closed */ }
          return
        }
        void terminalSessions.open(ws, alias as string, size)
      })
```

</details>

#### 缺口

- 真实宿主/OS兼容与用户同任务收益未实测
  **影响**：不能用工具数/协议成熟度代替生产运维和业务结果证明
  **进一步探讨**：后续只在隔离测试机、专用凭据与独立DSH_HOME对照同一单主机只读任务，记录目标、远端结果与切换/恢复工时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · GUI和模型如何共用连接，授权、目标身份和执行返回实际怎样传递？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

配置默认在$DSH_HOME/dsh-ssh.json，按该home共享而不是按会话/工作区隔离；新profile若沿用同一DSH_HOME也会看见原主机。enabled默认true会注册六工具，announceToAgent默认false只关引导段，不关工具。resolve还有兼容分支：effective enabled=false、profile原始entry未显式声明enabled且store非空时改成true。显式profile配置false不满足该分支，但不能把任意来源的false或提示隐藏当撤权。系统提示按scope查询工具可见性，是提示联动而不是逐主机授权；具体宿主scope/审批未全审。

HTTP及WS升级均调用本包isLoopbackRequest：要求直接loopback socket/Host、拒绝代理转发标记和cross-site，若有Origin要求其host匹配；这里没有Git/Skill子包的paired-cookie额外放行接线。它约束本机浏览器入口，不等于模型工具逐次真人批准，也不是远端主机身份核验。ClusterTab有GUI确认框；模型execute直接转engine，不能把那个浏览器确认推给模型调用。主机增删改和ProxyCommand配置入口在GUI/API；这六工具没有主机写接口，但不能据此推同宿主的其他文件工具永远无权改配置。

engine.exec→execCommand→withClient→acquire/doAcquire，以alias为池键，find当前store记录，经buildConnectConfig/每跳connectChain→ssh2.connect，实际client.exec(command)。认证支持密钥文件、密码或agent端点；forwardAgent仅entry显式true才启用，未解析到端点会拒绝；地址形式ProxyJump会复用目标认证，配置alias跳点用自己记录，不能假设每跳凭据独立。ProxyCommand是本机shell命令：POSIX用用户shell -c、Windows用cmd，startProxyCommand为SSH提供stdio流，并非仅执行远端命令。

默认单连接pre-ready预算30秒，exec stream预算60秒、有限输出捕获且标截断，池空闲30分钟扫描关闭但跳过pinned/inFlight；集群默认最多8 worker。exec timer在client.exec回调拿到stream后安装，连接、开channel等待、多跳和多次尝试不合成一个总deadline。取消从ssh_exec/cluster工具传到engine/execCommand；真正到池重试函数的差异见Q03。工具返回stdout/stderr、exitCode/timedOut/duration；集群每alias捕获成功/错误，不是所有主机原子成功，exit0不证明部署符合业务要求。

PTY用独立connectChain和client.shell，不是池连接；host registry保存随机sessionId，断开socket是detach，可重附着回放，默认无人附着10分钟清理、已退出宽限60秒。显式close和registry.dispose关闭shell/hops；不要把关面板当命令已终止。隧道经pool client.forwardOut桥接，只listen 127.0.0.1，跟踪活跃socket/链关闭；同记录多个隧道共享，最后一个停止才释放其连接，非一停就拆所有兄弟隧道。

GUI上传先限量写host私有staging再SFTP并发进度，下载先到host私有临时文件再HTTP给浏览器并finally unlink；这与模型传输不同。ssh_upload/download直接把localPath交engine→SFTP的resolvePath/fastPut/fastGet，没有本组件workspace门卫或bash沙箱接线，使用host权限；传输工具未接exec.signal。普通API路径的临时文件保护和上传cap不能推成全部工具路径/字节/取消限制。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/store.ts:20-22](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/store.ts#L20-L22)

home级全局store路径。

```text
/** Store file location: $DSH_HOME/dsh-ssh.json (defaults to ~/.dsh). */
export function storePath(): string {
  return join(dshHome(), 'dsh-ssh.json')
```

**依据 2 · 源码核查**：[packages/dsh-ssh/src/index.ts:92-102](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L92-L102)

enabled/announce默认。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config = z.object({
  announceToAgent: z.boolean().default(false).volatile(),
  enabled: z.boolean().default(true).volatile(),
  terminalFontFamily: z.string().default('').volatile(),
  connectTimeoutMs: z.number().step(1).min(1_000).max(600_000).default(DEFAULT_CONNECT_TIMEOUT_MS).volatile()
    .description('TCP connect, SSH key exchange and user authentication timeout in milliseconds; raise it for hosts whose authentication is slow.'),
})

/** Schema defaults, re-read for hand-built test contexts (the loader applies them normally). */
const DEFAULT_ANNOUNCE = false
const DEFAULT_ENABLED = true
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:153-165](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L153-L165)

非空store兼容启用分支。

<details>
<summary>查看原文（13行）</summary>

```text
  const resolve = (): { announceToAgent: boolean; enabled: boolean } => {
    let enabled = readConfigField(config?.enabled, DEFAULT_ENABLED)
    // When dsh-ssh was seeded with enabled: false (e.g. from an aggregate profile
    // line), but the profile's own entry config never set the switch AND the user
    // already has active host records in dsh-ssh.json, keep the plugin enabled so
    // existing users are not broken upon upgrade (#1250).
    if (enabled === false && profileConfig(ctx)?.enabled === undefined && store.list().length > 0) {
      enabled = true
    }
    return {
      announceToAgent: readConfigField(config?.announceToAgent, DEFAULT_ANNOUNCE),
      enabled,
    }
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/index.ts:207-238](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L207-L238)

宣告与工具/路由注册区分。

<details>
<summary>查看原文（32行）</summary>

```text
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        // The announcement names the ssh_* tools, so it renders only while at
        // least one of them is reachable: a restriction that removes the tool
        // surface must take the guidance with it, instead of telling the model
        // to call tools this session cannot see.
        text: visibleToolText(ctx.tools, SSH_TOOL_NAMES, SSH_GUIDANCE),
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-ssh: tools',
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/tool-surface.ts:33-63](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/tool-surface.ts#L33-L63)

可见性提示provider非授权。

<details>
<summary>查看原文（31行）</summary>

```text
  ssh: 150,
  'task-board': 200,
  agents: 220,
} as const

/** One plugin id keyed by {@link PLUGIN_TOOL_SECTION_ORDERS}. */
export type PluginToolSectionId = keyof typeof PLUGIN_TOOL_SECTION_ORDERS

/**
 * Order of an external provider extension's own guidance section, right after
 * the band of the plugin it extends.
 *
 * An extension names itself, not the plugin it plugs into, so its order stays
 * out of {@link PLUGIN_TOOL_SECTION_ORDERS}: every package's copy of this module
 * then carries no provider id. The slot still has one owner and cannot collide
 * with a host plugin's band.
 */
export const EXTENSION_TOOL_SECTION_ORDER = 210

/**
 * The scoped tool lookup a section provider needs: the registry read for one
 * assembly's scope. Matches `ctx.tools.get(name, scope)`.
 */
export interface ScopedToolLookup {
  get(name: string, scope?: unknown): unknown
}

/** One assembly context carrying the scope the section is rendered for. */
export interface SectionScopeContext {
  scope?: unknown
}
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/routes.ts:68-98](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L68-L98)

HTTP仅loopback直接门卫。

<details>
<summary>查看原文（31行）</summary>

```text
  /** Guard helper: fence + method check. */
  const guard = (req: IncomingMessage, res: ServerResponse, method: string): boolean => {
    if (!isLoopbackRequest(req)) {
      writeJson(res, 403, { error: 'forbidden: loopback-only' })
      return false
    }
    if (req.method !== method) {
      writeJson(res, 405, { error: `method not allowed: ${req.method}` })
      return false
    }
    return true
  }

  const routes: WebRoute[] = [
    // ------------------------------------------------------------ hosts
    {
      kind: 'exact',
      path: SSH_API.hosts,
      handler: async (req, res) => {
        // One handler per path (the webserver keyed route registry rejects
        // duplicate (kind, path)); dispatch by HTTP method here.
        const method = req.method ?? 'GET'
        if (!isLoopbackRequest(req)) {
          writeJson(res, 403, { error: 'forbidden: loopback-only' })
          return
        }
        const url = new URL(req.url ?? '/', 'http://localhost')
        if (method === 'GET') {
          writeJson(res, 200, { hosts: engine.list(queryParam(url, 'query')) })
          return
        }
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/loopback.ts:72-91](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/loopback.ts#L72-L91)

真实socket/host/forward/origin条件。

<details>
<summary>查看原文（20行）</summary>

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
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/tools.ts:170-184](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/tools.ts#L170-L184)

exec signal实际caller。

<details>
<summary>查看原文（15行）</summary>

```text
    async execute(args, exec) {
      try {
        // Forward the caller's cancellation: aborting closes the remote channel
        // instead of leaving the command running on the host.
        return await engine.exec(args.alias, args.command, args.timeoutMs, exec.signal)
      } catch (error) {
        return {
          success: false,
          exitCode: null,
          timedOut: false,
          stdout: '',
          stderr: '',
          durationMs: 0,
          error: error instanceof Error ? error.message : String(error),
        }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/engine.ts:84-88](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine.ts#L84-L88)

engine.exec实际转核心。

```text
  // ------------------------------------------------------------ exec

  /** Run one command on `alias` (reusing the pooled connection). */
  async exec(alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
    return execCommand(this, alias, command, timeoutMs, signal)
```

**依据 10 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:77-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L77-L125)

认证构造/forwardAgent显式分支。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock: ConnectConfig['sock'] | undefined, opts: Required<EngineOptions>): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: opts.connectTimeoutMs,
    keepaliveInterval: opts.keepaliveIntervalMs,
    keepaliveCountMax: 3,
    tryKeyboard: true,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
  } else if (entry.auth.kind === 'agent') {
    const agentPath = resolveAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      throw new Error('ssh-agent is not available: set SSH_AUTH_SOCK or configure an agent path (use \'pageant\' for PuTTY Pageant on Windows)')
    }
    config.agent = agentPath
  } else {
    const keyPath = entry.auth.keyPath === undefined ? undefined : expandHome(entry.auth.keyPath)
    if (keyPath === undefined || !existsSync(keyPath)) {
      throw new Error('private key not found: ' + (entry.auth.keyPath ?? '(unset)'))
    }
    config.privateKey = readFileSync(keyPath, 'utf8')
    if (entry.auth.passphrase !== undefined && entry.auth.passphrase !== '') {
      config.passphrase = entry.auth.passphrase
    }
  }
  // Agent forwarding is additive: it never changes how the host
  // authenticates, it only lets this connection broker signatures from the
  // local agent for the remote side (OpenSSH ForwardAgent / ssh -A).
  if (entry.forwardAgent === true) {
    // Agent auth already resolved an endpoint, and reusing it keeps the
    // forwarded agent identical to the one that authenticated.
    const agentPath = typeof config.agent === 'string'
      ? config.agent
      : resolveForwardAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      // ssh2's own message for this case ("You must set a valid agent path to
      // allow agent forwarding") names neither the host nor a way out, so the
      // engine refuses first with an actionable one.
      throw new Error('agent forwarding is enabled for this host but no ssh-agent endpoint is available: '
        + 'set SSH_AUTH_SOCK, start Pageant on Windows, or configure an agent path')
    }
    config.agent = agentPath
    config.agentForward = true
  }
  return config
```

</details>

**依据 11 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:324-342](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L324-L342)

地址跳点与alias凭据区别。

<details>
<summary>查看原文（19行）</summary>

```text
export function resolveHop(engine: PoolEngine, entry: SshHostEntry, spec: string): SshHostEntry {
  const configured = engine.store.find(spec)
  if (configured !== undefined) return configured
  const parsed = parseJumpSpec(spec)
  if (parsed === undefined) {
    throw new Error('proxyJump \'' + spec + '\' is neither a configured alias nor a [user@]host[:port] address')
  }
  const now = Date.now()
  return {
    alias: spec,
    host: parsed.host,
    port: parsed.port ?? 22,
    user: parsed.user ?? process.env.USER ?? entry.user,
    auth: entry.auth,
    proxyJump: [],
    tags: [],
    createdAt: now,
    updatedAt: now,
  }
```

</details>

**依据 12 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:354-450](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L354-L450)

真实多跳/目标connect与按alias获取。

<details>
<summary>查看原文（97行）</summary>

```text
export async function connectChain(
  engine: PoolEngine,
  entry: SshHostEntry,
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<{ client: Client; hops: Client[] }> {
  const hops: Client[] = []
  const chain = entry.proxyJump
  // The store rejects both transports on one entry; a hand-edited store file
  // can still carry both, and silently picking one would hide the mistake.
  if (chain.length > 0 && entry.proxyCommand !== undefined) {
    throw new Error('entry \'' + entry.alias + '\' declares both proxyCommand and proxyJump — pick one transport per host')
  }
  /** Transports this call started; destroyed on every failure path. */
  const transports: Duplex[] = []
  const startTransport = (owner: SshHostEntry): ConnectConfig['sock'] => {
    const { stream } = startProxyCommand(owner.proxyCommand as string, proxyTargetOf(owner))
    transports.push(stream)
    return stream
  }
  let sock: ConnectConfig['sock'] = entry.proxyCommand !== undefined ? startTransport(entry) : undefined
  try {
    for (let index = 0; index < chain.length; index += 1) {
      const spec = chain[index]
      const hop = resolveHop(engine, entry, spec)
      if (index > 0 && hop.proxyCommand !== undefined) {
        throw new Error('proxyJump hop \'' + spec + '\' declares a proxyCommand, which is only supported on the first hop')
      }
      const hopSock = index === 0 && hop.proxyCommand !== undefined ? startTransport(hop) : sock
      let hopClient: Client
      try {
        hopClient = await connectClient(buildConnectConfig(hop, hopSock, engine.opts), onKeyboardInteractive)
      } catch (error) {
        // Name the hop: an address hop (or a typo'd alias) must stay
        // diagnosable from the error alone.
        throw new Error('proxyJump hop \'' + spec + '\' (' + hop.user + '@' + hop.host + ':' + hop.port + '): '
          + (error instanceof Error ? error.message : String(error)))
      }
      hops.push(hopClient)
      const next = index + 1 < chain.length ? resolveHop(engine, entry, chain[index + 1]) : undefined
      const nextHost = next !== undefined ? next.host : entry.host
      const nextPort = next !== undefined ? next.port : entry.port
      sock = await new Promise<ConnectConfig['sock']>((resolve, reject) => {
        hopClient.forwardOut('127.0.0.1', 0, nextHost, nextPort, (error, stream) => {
          if (error !== undefined) {
            reject(new Error('proxyJump hop \'' + spec + '\' could not forward to ' + nextHost + ':' + nextPort + ': ' + error.message))
          } else {
            resolve(stream)
          }
        })
      })
    }
  } catch (error) {
    // A missing alias, a failed hop connect, or a failed forwardOut must all
    // close the hops already connected — and the proxy commands behind them —
    // so a failed ProxyJump never leaks either.
    for (const client of hops) client.end()
    for (const stream of transports) {
      try { stream.destroy() } catch { /* already closed */ }
    }
    throw error
  }
  let target: Client | undefined
  try {
    target = await connectClient(buildConnectConfig(entry, sock, engine.opts), onKeyboardInteractive)
    return { client: target, hops }
  } catch (error) {
    for (const client of hops) client.end()
    for (const stream of transports) {
      try { stream.destroy() } catch { /* already closed */ }
    }
    // connectClient already destroys the failed target on its own failure
    // path; destroy defensively only when a reference leaked through, and
    // guard it so a second destroy is never an issue.
    if (target !== undefined) {
      try { target.destroy() } catch { /* already destroyed */ }
    }
    throw error
  }
}

/** Connect (or reuse) the pooled chain for one alias; pins nothing. */
export async function acquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const pending = engine.acquireQueue.get(alias)
  if (pending !== undefined) return pending
  const task = doAcquire(engine, alias)
  engine.acquireQueue.set(alias, task)
  try {
    return await task
  } finally {
    if (engine.acquireQueue.get(alias) === task) engine.acquireQueue.delete(alias)
  }
}

async function doAcquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry)
```

</details>

**依据 13 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:526-590](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L526-L590)

client.exec实际执行及stream timer。

<details>
<summary>查看原文（65行）</summary>

```text
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      // Caller cancellation is cooperative and quiescent: aborting closes the
      // remote channel and settles this call like a timeout does, so the
      // command stops without the pool replaying it. The channel is captured
      // in a mutable slot because abort may fire before client.exec calls back.
      let aborted = signal !== undefined && signal.aborted
      let kill = (): void => { /* channel not open yet */ }
      const onAbort = (): void => {
        aborted = true
        kill()
      }
      if (signal !== undefined && !signal.aborted) signal.addEventListener('abort', onAbort, { once: true })
      client.exec(command, (error, stream) => {
        if (error !== undefined) {
          signal?.removeEventListener('abort', onAbort)
          reject(error)
          return
        }
        kill = (): void => {
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
        }
        // The abort may already have arrived while this channel opened.
        if (aborted) kill()
        const stdout = { text: '', truncated: false }
        const stderr = { text: '', truncated: false }
        let timedOut = false
        let settled = false
        /** One cancelled outcome: the remote channel was killed on caller request. */
        const cancelledResult = (): ExecResult => ({
          success: false,
          exitCode: null,
          timedOut: false,
          stdout: stdout.text,
          stderr: stderr.text,
          durationMs: Date.now() - started,
          error: 'command cancelled by the caller',
        })
        const finish = (): void => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          resolve({
            success: false,
            exitCode: null,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
            error: timedOut ? 'command timed out after ' + budget + ' ms' : undefined,
          })
        }
        const timer = setTimeout(() => {
          timedOut = true
          try { stream.signal('KILL') } catch { /* channel gone */ }
          try { stream.close() } catch { /* channel gone */ }
          // Hard deadline: settle now even if the peer never acks the
          // channel close (the stream 'close' handler is then a no-op).
          finish()
        }, budget)
```

</details>

**依据 14 · 源码核查**：[packages/dsh-ssh/src/engine/proxy-command.ts:54-90](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/proxy-command.ts#L54-L90)

本机shell实际spawn caller。

<details>
<summary>查看原文（37行）</summary>

```text
function spawnSpec(command: string): SpawnSpec {
  if (process.platform === 'win32') {
    return {
      file: process.env.ComSpec ?? 'cmd.exe',
      args: ['/d', '/s', '/c', '"' + command + '"'],
      windowsVerbatimArguments: true,
    }
  }
  return { file: process.env.SHELL ?? '/bin/sh', args: ['-c', command] }
}

/** One running proxy command: its transport plus the process behind it. */
export interface ProxyCommandProcess {
  /** The duplex transport handed to ssh2 as `sock`. */
  stream: Duplex
  /** The spawned shell; killing the stream kills it (and its process group). */
  child: ChildProcess
}

/**
 * Start one ProxyCommand and bridge its stdio into a Duplex.
 *
 * Failure modes are reported through the stream: a spawn error, or an exit
 * before the SSH handshake finished, destroys it with the exit status and the
 * tail of the command's stderr instead of letting ssh2 wait for its own
 * `readyTimeout`.
 */
export function startProxyCommand(rawCommand: string, target: ProxyTarget): ProxyCommandProcess {
  const command = expandProxyTokens(rawCommand, target)
  const spec = spawnSpec(command)
  const child = spawn(spec.file, spec.args, {
    stdio: ['pipe', 'pipe', 'pipe'],
    windowsHide: true,
    ...(spec.windowsVerbatimArguments === true ? { windowsVerbatimArguments: true } : {}),
    // POSIX only: own process group, so a chained client
    // (`ssh -W %h:%p bastion`) dies with the transport instead of leaking.
    ...(process.platform === 'win32' ? {} : { detached: true }),
```

</details>

**依据 15 · 源码核查**：[packages/dsh-ssh/src/engine/pty.ts:32-61](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/pty.ts#L32-L61)

独立连接client.shell与close。

<details>
<summary>查看原文（30行）</summary>

```text
export async function openShell(
  engine: PoolEngine,
  alias: string,
  size: { cols: number; rows: number },
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<ShellSession> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry, onKeyboardInteractive)
  return await new Promise<ShellSession>((resolve, reject) => {
    client.shell({ term: 'xterm-256color', cols: size.cols, rows: size.rows }, (error, stream) => {
      if (error !== undefined) {
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
        reject(error)
        return
      }
      let tornDown = false
      const teardown = (): void => {
        if (tornDown) return
        tornDown = true
        try { client.end() } catch { /* closed */ }
        for (const hop of hops) { try { hop.end() } catch { /* closed */ } }
      }
      const session: ShellSession = {
        send: (data) => { try { stream.write(data) } catch { /* channel gone */ } },
        resize: (cols, rows) => { try { stream.setWindow(rows, cols, rows, cols) } catch { /* channel gone */ } },
        close: () => {
          try { stream.close() } catch { /* channel gone */ }
          teardown()
```

</details>

**依据 16 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:81-133](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/terminal-sessions.ts#L81-L133)

真实PTY open/attach/dispose。

<details>
<summary>查看原文（53行）</summary>

```text
  async open(ws: WebSocket, alias: string, size: { cols: number; rows: number }): Promise<void> {
    const session: HostedTerminal = {
      id: randomBytes(9).toString('hex'),
      alias,
      sockets: new Set(),
      buffer: [],
      bufferBytes: 0,
      exited: false,
    }
    this.sessions.set(session.id, session)
    this.bind(ws, session)
    try {
      const shell = await this.deps.openShell(alias, size, this.keyboardInteractive(session))
      if (!this.sessions.has(session.id)) {
        // The session was ended (or the host torn down) while it connected.
        shell.close()
        return
      }
      session.shell = shell
      shell.onData = data => { this.pushOutput(session, data.toString('utf8')) }
      shell.onExit = (code, error) => { this.finish(session, code, error) }
      this.send(session, { type: 'ready', alias, sessionId: session.id })
    } catch (error) {
      this.sessions.delete(session.id)
      this.send(session, { type: 'exit', code: null, error: error instanceof Error ? error.message : String(error) })
    }
  }

  /**
   * Attach a socket to an existing session, replaying its scrollback first.
   * @returns false when the session is unknown (expired or already reaped).
   */
  attach(ws: WebSocket, sessionId: string, size: { cols: number; rows: number }): boolean {
    const session = this.sessions.get(sessionId)
    if (session === undefined) return false
    this.bind(ws, session)
    this.clearReap(session)
    for (const chunk of session.buffer) this.sendTo(session, ws, { type: 'output', data: chunk })
    this.sendTo(session, ws, { type: 'ready', alias: session.alias, sessionId: session.id })
    if (session.exited) {
      this.sendTo(session, ws, { type: 'exit', code: session.exit?.code ?? null, error: session.exit?.error })
      // Re-arm the grace window: this socket now holds the exited session open.
      this.scheduleReap(session, this.exitGraceMs)
    } else {
      session.shell?.resize(Math.max(2, size.cols), Math.max(1, size.rows))
      session.shell?.resume()
    }
    return true
  }

  /** End every session (host teardown, plugin dispose). */
  dispose(): void {
    for (const session of [...this.sessions.values()]) this.end(session, false)
```

</details>

**依据 17 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:74-142](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/tunnel.ts#L74-L142)

真实forwardOut/loopback listener及断链处理。

<details>
<summary>查看原文（69行）</summary>

```text
  const existing = engine.pool.get(alias)
  if (existing !== undefined && existing.broken) disposeRecord(engine, alias, existing)
  const record = engine.pool.get(alias) ?? (await acquire(engine, alias))
  const client = record.client
  const sockets = new Set<Socket>()
  // A tunnel whose SSH link died can only refuse what it is handed, so every
  // path that learns the link is gone tears the tunnel down as well instead
  // of leaving a listener alive on a connection that forwards nothing.
  const onLinkClosed = (): void => { abortTunnel(engine, id) }
  const detachLink = (): void => { client.off('close', onLinkClosed) }
  const server = createServer((socket) => {
    sockets.add(socket)
    socket.on('close', () => { sockets.delete(socket) })
    // The link can die between taking the record above and this connection.
    if (record.broken) {
      destroyQuietly(socket)
      abortTunnel(engine, id)
      return
    }
    try {
      client.forwardOut('127.0.0.1', 0, remoteHost, options.remotePort, (error, stream) => {
        if (error !== undefined) {
          // A refused remote channel is the remote service's answer, not a
          // dead SSH link: the tunnel itself stays up for the next attempt.
          destroyQuietly(socket)
          return
        }
        // Both ends of the pipe can die independently; destroy the pair so an
        // unhandled 'error' event can never crash the host process.
        const destroy = (): void => {
          destroyQuietly(socket)
          try { stream.close() } catch { /* gone */ }
        }
        stream.on('error', destroy)
        socket.on('error', destroy)
        stream.on('close', destroy)
        socket.on('close', destroy)
        stream.pipe(socket).pipe(stream)
      })
    } catch {
      // ssh2 reports 'Not connected' by throwing out of forwardOut rather than
      // through the callback; an exception escaping this connection handler
      // is an uncaught exception that takes the host process down with it.
      destroyQuietly(socket)
      abortTunnel(engine, id)
    }
  })
  try {
    await new Promise<void>((resolve, reject) => {
      server.once('error', reject)
      server.listen(options.localPort ?? 0, '127.0.0.1', () => {
        server.removeListener('error', reject)
        resolve()
      })
    })
  } catch (error) {
    // Roll back: never leave an unpinned orphan connection behind.
    if (!record.pinned && record.inFlight === 0) disposeRecord(engine, alias, record)
    throw error
  }
  record.pinned = true
  const address = server.address()
  info.localPort = typeof address === 'object' && address !== null ? address.port : 0
  info.state = 'forwarding'
  engine.tunnels.set(id, { info, server, alias, record, sockets, detachLink })
  // A dead link must not keep a listener alive: without this hook the tunnel
  // outlives its connection and every later local connection hits the dead
  // forwardOut path above.
  client.once('close', onLinkClosed)
```

</details>

**依据 18 · 源码核查**：[packages/dsh-ssh/src/engine/tunnel.ts:161-180](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/tunnel.ts#L161-L180)

兄弟隧道共享释放。

<details>
<summary>查看原文（20行）</summary>

```text
export function stopTunnel(engine: TunnelEngine, id: string): boolean {
  const tunnel = engine.tunnels.get(id)
  if (tunnel === undefined) return false
  engine.tunnels.delete(id)
  // Drop the link-death hook first: a stop is never the link's death, and a
  // long-lived pooled client outlives many tunnels.
  try { tunnel.detachLink?.() } catch { /* already detached */ }
  try { tunnel.server.close() } catch { /* already closed */ }
  for (const socket of tunnel.sockets) {
    destroyQuietly(socket)
  }
  tunnel.sockets.clear()
  // Sibling tunnels on the same alias share the pinned connection: release it
  // only once the last tunnel using it is gone. A record the pool has since
  // replaced (e.g. after a broken-connection recycle) is ended directly.
  const shared = [...engine.tunnels.values()].some(candidate => candidate.record === tunnel.record)
  if (!shared) {
    if (engine.pool.get(tunnel.alias) === tunnel.record) disposeRecord(engine, tunnel.alias, tunnel.record)
    else endRecordChain(tunnel.record)
  }
```

</details>

**依据 19 · 源码核查**：[packages/dsh-ssh/src/tools.ts:215-255](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/tools.ts#L215-L255)

工具传输直接localPath且未取exec.signal。

<details>
<summary>查看原文（41行）</summary>

```text
    async execute(args) {
      try {
        const outcome = await engine.upload(args.alias, args.localPath, args.remotePath, false)
        return { ok: true, transferredBytes: outcome.bytes, files: outcome.files }
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
      }
    },
  })
}

/** The download tool. */
export function sshDownloadTool(engine: SshEngine) {
  return defineTool({
    name: 'ssh_download',
    description: 'Copy a remote FILE from a configured SSH host to this machine (the dsh host). Use this only when the source is on the remote host; files already on this machine are read with the local file tools (read / write / edit), not ssh_download. Directory download is not supported — download files individually.',
    parameters: {
      alias: { type: 'string', required: true, description: 'Host alias from ssh_list.' },
      remotePath: { type: 'string', required: true, description: 'Absolute path of the source file on the remote SSH host.' },
      localPath: { type: 'string', required: true, description: 'Absolute destination path on THIS machine (the dsh host).' },
    },
    output: {
      schema: {
        type: 'object',
        additionalProperties: false,
        properties: {
          ok: { type: 'boolean', required: true },
          bytes: { type: 'integer' },
          error: { type: 'string' },
        },
      },
      render: (_args, value: { ok: boolean; bytes?: number; error?: string }) => text(value.ok
        ? `downloaded ${value.bytes ?? 0} bytes`
        : `download failed: ${value.error ?? 'unknown error'}`),
    },
    async execute(args) {
      try {
        const outcome = await engine.download(args.alias, args.remotePath, args.localPath)
        return { ok: true, bytes: outcome.bytes }
      } catch (error) {
        return { ok: false, error: error instanceof Error ? error.message : String(error) }
```

</details>

**依据 20 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:33-91](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/sftp.ts#L33-L91)

host resolvePath与实际SFTP传输。

<details>
<summary>查看原文（59行）</summary>

```text
export async function upload(
  engine: PoolEngine,
  alias: string,
  localPath: string,
  remotePath: string,
  recursive: boolean,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number; files: number }> {
  // Remote paths must be absolute: the mkdir chain and fastPut must agree
  // on one resolution (relative paths previously created dirs at the root).
  if (!remotePath.startsWith('/')) {
    throw new Error('remotePath must be an absolute path (got \'' + remotePath + '\')')
  }
  const local = resolvePath(localPath)
  if (!existsSync(local)) throw new Error('local path not found: \'' + localPath + '\'')
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = statSync(local)
    let files: string[]
    if (stat.isDirectory()) {
      if (!recursive) throw new Error('\'' + localPath + '\' is a directory — enable recursive upload')
      files = walkLocalDir(local)
      await ensureRemoteDir(sftp, remotePath)
    } else {
      files = ['']
      await ensureRemoteDir(sftp, dirname(remotePath))
    }
    let bytes = 0
    for (const rel of files) {
      const src = rel === '' ? local : join(local, rel)
      // Remote paths always use forward slashes; normalize any OS separators.
      const remoteRel = rel.split(/[\\/]/).join('/')
      const dst = rel === '' ? remotePath : remotePath.replace(/\/$/, '') + '/' + remoteRel
      await fastPut(sftp, src, dst, engine.opts.sftpConcurrency, onProgress)
      bytes += statSync(src).size
    }
    return { bytes, files: files.length }
  }))
}

/** Download one remote file to a local path. */
export async function download(
  engine: PoolEngine,
  alias: string,
  remotePath: string,
  localPath: string,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number }> {
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = await new Promise<{ isDirectory: () => boolean }>((resolve, reject) => {
      sftp.stat(remotePath, (error, stats) => error !== undefined ? reject(error) : resolve(stats))
    })
    if (stat.isDirectory()) {
      throw new Error('\'' + remotePath + '\' is a directory — directory download is not supported yet (download individual files)')
    }
    const local = resolvePath(localPath)
    if (!existsSync(dirname(local))) mkdirSync(dirname(local), { recursive: true })
    await fastGet(sftp, remotePath, local, engine.opts.sftpConcurrency, onProgress)
    return { bytes: statSync(local).size }
  }))
```

</details>

**依据 21 · 源码核查**：[packages/dsh-ssh/src/routes.ts:387-446](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L387-L446)

GUI staging传输及unlink。

<details>
<summary>查看原文（60行）</summary>

```text
          }
        })
        req.pipe(sink)
        sink.on('finish', async () => {
          if (settled) return
          emit({ type: 'progress', progress: { phase: 'connecting', file: remotePath, transferred: 0, total: 0, percent: 0 } })
          try {
            const outcome = await engine.upload(alias, tmp, remotePath, false, progress => emit({ type: 'progress', progress }))
            emit({ type: 'result', ok: true, transferredBytes: outcome.bytes })
          } catch (error) {
            emit({ type: 'result', ok: false, error: error instanceof Error ? error.message : String(error) })
          } finally {
            await unlink(tmp).catch(() => undefined)
            done()
          }
        })
      },
    },
    // ------------------------------------------------------- download
    {
      kind: 'exact',
      path: SSH_API.download,
      handler: async (req, res) => {
        if (!guard(req, res, 'GET')) return
        const url = new URL(req.url ?? '/', 'http://localhost')
        const alias = queryParam(url, 'alias')
        const remotePath = queryParam(url, 'remotePath')
        if (alias === undefined || remotePath === undefined) {
          writeJson(res, 400, { error: 'alias and remotePath query parameters are required' })
          return
        }
        const tmp = join(staging, `download-${randomBytes(6).toString('hex')}`)
        try {
          // Pre-create with 0600: ssh2's fastGet opens the destination with
          // umask-default permissions and a pre-created file keeps the mode.
          closeSync(openSync(tmp, 'w', 0o600))
          const outcome = await engine.download(alias, remotePath, tmp)
          res.writeHead(200, {
            'content-type': 'application/octet-stream',
            'content-length': String(outcome.bytes),
            'content-disposition': `attachment; filename="${basename(remotePath).replace(/"/g, '')}"`,
            'referrer-policy': 'no-referrer',
          })
          await new Promise<void>((resolve, reject) => {
            const source = createReadStream(tmp)
            source.on('error', reject)
            res.on('error', reject)
            source.pipe(res)
            source.on('end', resolve)
          })
        } catch (error) {
          if (!res.headersSent) {
            writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          } else {
            // Mid-stream failure after headers: destroy so the browser does
            // not hang waiting for the promised content-length bytes.
            res.destroy()
          }
        } finally {
          await unlink(tmp).catch(() => undefined)
```

</details>

#### 缺口

- 宿主逐会话工具限制/审批、实际OS与SSH server取消行为未全审/运行
  **影响**：默认提示或loopback门卫不足以宣称完整授权、路径沙箱和远端停止
  **进一步探讨**：独立home仅一台测试机、无模型轮次先GUI；如需模型工具，另核宿主scope/审批/本机文件权限，并对照工具执行身份与真实目标。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 重试、取消、配置变更、凭据和传输存在哪些关键失败边界？

**研究主题**：缺陷与关键质疑

#### 完整回答

withClient默认最多3次，只在fn抛错且record.broken时回收连接重试；健康连接逻辑错误不重放，acquire自身位于这个try外也不是任何建连失败都自动三次。exec的stream无数字退出状态且未超时会reject；若连接已broken便可能重连执行同一command。远端可能已经写入而退出状态丢失，因此不是at-most-once，stdout/退出码不能补成业务事务回执。README已有非幂等重放提醒，不能当作者完全未说明。

取消保护必须按caller收窄：工具传signal到execCommand，流close/error在aborted时会resolve取消结果，通常避免那条流失败进入重试，timer也有本地收敛。可是execCommand:529→634调用withClient时未传其第五参数signal，因而不能直接拿helper中signal.aborted抛出分支当整链保证；client.exec回调error路径直接reject，已经取消的调用也先acquire/发exec再尝试kill。cluster的while队列没有abort前置守卫，后续目标仍会进入execCommand。具体竞态是否重放/远端启动取决于事件顺序与server，未实测；只能说当前caller不足以保证取消后不再发新命令或所有路径不重放。SSH KILL/close是尽力动作，不证明远端进程树、后台任务或先前副作用撤销。GUI exec/cluster的路由调用没有传engine的signal，也未在该调用链把浏览器断连接为取消；关闭页面/取消fetch不能当远端命令已停。

目标也未冻结到一次操作的连接身份：每次acquire按alias读当前store，PATCH连接字段后dropAlias断旧池/隧道。若命令正在执行时同alias目标被改动、旧连接broken并进入重试，后续attempt可能重新解析到新host/凭据；是否发生取决于配置变更与断链时序，非已复现实例。配置信息热更新的优点仍成立，但不等操作跨重试绑定同一真实主机。PTY又是独立连接，PATCH/DELETE只调用engine.dropAlias，未调用terminal registry按alias关闭，所以旧PTY不能据删/改主机行推为断开。

enabled配置开关的sync会撤路由/工具并dispose终端registry，但该路径没有engine.dispose；engine.dispose挂在整个插件effect卸载，才遍历池和隧道。故配置开关false不证明存量隧道/池连接全停，pinned隧道也不受普通idle sweep回收；应先显式关闭并核监听/远端状态。关闭WS只是detach；默认10分钟reap仅限无附着socket，不能把面板关闭当立即停止。连接/流超时、默认8 workers和截断输出都不是总体远端资源、会话数或费用上限。

主机信任需补旧稿未核的依赖事实：本包buildConnectConfig未传hostVerifier/hostHash，组件内也未见known_hosts验证入口；pnpm-lock中此importer锁ssh2 1.17.0。[该固定依赖官方文档](https://github.com/mscdex/ssh2/blob/844f1edfc41589737671f96a4f4e76afdf46abd4/README.md#L953-L955)说明未设hostVerifier时默认自动接受主机key，原始文档/tag→commit/内容SHA保存在DEPENDENCY-SSH2.json。本判断是源码配置与库契约的合并解释，未跑握手或MITM实验；不能声称已有OpenSSH known_hosts或指纹变化拒绝保护，也不由loopback HTTP围栏补足远端身份。生产链路若要求pin，应先用已有严格主机核验的SSH方案或修补后验证。

store以临时文件+rename、POSIX mode参数0600保存，坏JSON旁移供人工恢复；这些不是凭据加密或Windows ACL验证。密码/密钥口令及可能带凭据的ProxyCommand可落明文，ssh_list特意把ProxyCommand原文投影成boolean、summary不返回密码，但命令原始stdout/stderr仍可带敏感输出入模型。GUI预配置不是逐次审批，模型没有本工具主机写方法也不等于其他host文件工具不可访问配置。

SFTP在结算时finally end channel、有价值；但工具上传/下载没有取消signal或本组件总byte/deadline，host路径无workspace约束，relative localPath按host process resolve而不是会话cwd，不能把描述里的absolute当运行时门卫。GUI上传有实际4GiB接收cap/0600 staging和清理，这个cap不覆盖模型文件传输或GUI下载。普通fastPut/fastGet直接用最终目标，本组件无整批回滚、temp+rename验收、内容哈希/续传证明；报错/断线可能留下部分文件，重试经withClient可能重做。目录walk跳过内部symlink，但入口stat/resolve和单文件传输不构成所有链接/外部路径沙箱。本轮不推断已发生覆盖或泄露，失败先查真实两端文件而非重发。

范围是核心活动和重要失败支路，不是全协议/所有认证多跳、文件系统与host审批审计；没有执行目标、建立SSH连接或故障测试。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-522](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L522)

最多3次且只broken fn错误重试；可选signal保护。

<details>
<summary>查看原文（30行）</summary>

```text
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:526-545](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L526-L545)

caller未给池signal，取消前仍发exec，回调error直接reject。

<details>
<summary>查看原文（20行）</summary>

```text
export async function execCommand(engine: PoolEngine, alias: string, command: string, timeoutMs?: number, signal?: AbortSignal): Promise<ExecResult> {
  const started = Date.now()
  const budget = timeoutMs !== undefined && timeoutMs > 0 ? timeoutMs : engine.opts.defaultExecTimeoutMs
  return withClient(engine, alias, async (client) => {
    return await new Promise<ExecResult>((resolve, reject) => {
      // Caller cancellation is cooperative and quiescent: aborting closes the
      // remote channel and settles this call like a timeout does, so the
      // command stops without the pool replaying it. The channel is captured
      // in a mutable slot because abort may fire before client.exec calls back.
      let aborted = signal !== undefined && signal.aborted
      let kill = (): void => { /* channel not open yet */ }
      const onAbort = (): void => {
        aborted = true
        kill()
      }
      if (signal !== undefined && !signal.aborted) signal.addEventListener('abort', onAbort, { once: true })
      client.exec(command, (error, stream) => {
        if (error !== undefined) {
          signal?.removeEventListener('abort', onAbort)
          reject(error)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:598-634](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L598-L634)

取消结果分支、无exit状态拒绝及withClient末尾未传signal。

<details>
<summary>查看原文（37行）</summary>

```text
          // A caller cancellation settles as cancelled, never as a broken
          // connection: the latter would send withClient into a retry that
          // re-runs a command the caller asked to stop.
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          if (typeof code !== 'number' && !timedOut) {
            // The channel closed without an exit status: the connection
            // dropped mid-flight. Reject so withClient can reconnect and
            // retry within the attempt budget.
            reject(new Error('ssh: connection lost mid-flight (channel closed without an exit status)'))
            return
          }
          resolve({
            success: code === 0,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
        })
        stream.on('error', (streamError: Error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          reject(streamError)
        })
      })
    })
  })
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:40-59](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/cluster.ts#L40-L59)

worker数量与无abort前置的任务队列。

<details>
<summary>查看原文（20行）</summary>

```text
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs, options.signal)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/routes.ts:128-150](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L128-L150)

修改后dropAlias/删除路径。

<details>
<summary>查看原文（23行）</summary>

```text
          try {
            const entry = store.update(alias, body as unknown as Partial<HostPayload>)
            // Connection-relevant changes invalidate the pooled connection:
            // without this the pool would keep running commands on the old
            // host/credentials until the idle sweep (up to 30 min later).
            // Agent forwarding belongs here too: it is fixed per connection
            // (ssh2 negotiates it when the channel opens), so toggling it must
            // reconnect or the new setting silently never takes effect.
            const patch = body as Record<string, unknown>
            if (['host', 'port', 'user', 'auth', 'proxyJump', 'proxyCommand', 'forwardAgent'].some(key => patch[key] !== undefined)) {
              engine.dropAlias(alias)
            }
            writeJson(res, 200, { host: store.summarize(entry) })
          } catch (error) {
            writeJson(res, 400, { error: error instanceof Error ? error.message : String(error) })
          }
          return
        }
        if (method === 'DELETE') {
          try {
            engine.dropAlias(alias)
            store.delete(alias)
            writeJson(res, 200, { ok: true })
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:435-450](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L435-L450)

重连每次查当前alias配置。

<details>
<summary>查看原文（16行）</summary>

```text
export async function acquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const pending = engine.acquireQueue.get(alias)
  if (pending !== undefined) return pending
  const task = doAcquire(engine, alias)
  engine.acquireQueue.set(alias, task)
  try {
    return await task
  } finally {
    if (engine.acquireQueue.get(alias) === task) engine.acquireQueue.delete(alias)
  }
}

async function doAcquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry)
```

</details>

**依据 7 · 源码核查**：[packages/dsh-ssh/src/engine/pty.ts:32-40](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/pty.ts#L32-L40)

PTY独立连接不归池。

```text
export async function openShell(
  engine: PoolEngine,
  alias: string,
  size: { cols: number; rows: number },
  onKeyboardInteractive?: KeyboardInteractiveHandler,
): Promise<ShellSession> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry, onKeyboardInteractive)
```

**依据 8 · 源码核查**：[packages/dsh-ssh/src/engine.ts:154-163](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine.ts#L154-L163)

dropAlias仅停隧道/池。

<details>
<summary>查看原文（10行）</summary>

```text
  /**
   * Drop every live artifact bound to one alias: stop its tunnels and close
   * the pooled connection. Host entries that are deleted or whose connection
   * fields change must never keep serving a stale, previously authenticated
   * connection — the next operation re-connects from the current config.
   */
  dropAlias(alias: string): void {
    stopAllTunnels(this, alias)
    disposeRecord(this, alias)
  }
```

</details>

**依据 9 · 源码核查**：[packages/dsh-ssh/src/index.ts:199-238](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L199-L238)

enabled=false前撤注册/终端，无engine.dispose。

<details>
<summary>查看原文（40行）</summary>

```text
    if (disposeRoutes !== undefined) {
      disposeRoutes()
      disposeRoutes = undefined
    }
    if (disposeTools !== undefined) {
      disposeTools()
      disposeTools = undefined
    }
    if (!value.enabled) return
    if (value.announceToAgent) {
      disposeSection = ctx.systemPrompt.section({
        name: 'plugin:dsh-ssh',
        order: SECTION_ORDER,
        // The announcement names the ssh_* tools, so it renders only while at
        // least one of them is reachable: a restriction that removes the tool
        // surface must take the guidance with it, instead of telling the model
        // to call tools this session cannot see.
        text: visibleToolText(ctx.tools, SSH_TOOL_NAMES, SSH_GUIDANCE),
      })
    }
    disposeRoutes = ctx.effect(
      () => {
        const disposers = routes.map(route => ctx.webServer.register(route))
        const upgradeDisposer = ctx.webServer.registerUpgrade(upgrade)
        return () => {
          for (const dispose of disposers) dispose()
          upgradeDisposer()
          // Dropping the routes also ends the terminal sessions they served:
          // a live shell must not outlive the surface that can reach it.
          terminalSessions.dispose()
        }
      },
      'dsh-ssh: routes',
    )
    disposeTools = ctx.effect(
      () => {
        const disposers = tools.map(tool => ctx.tools.register(tool))
        return () => { for (const dispose of disposers) dispose() }
      },
      'dsh-ssh: tools',
```

</details>

**依据 10 · 源码核查**：[packages/dsh-ssh/src/index.ts:148-151](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L148-L151)

真正插件effect卸载dispose engine。

```text
function applyImpl(ctx: Context, config?: ResolvedConfig): void {
  const store = new HostStore()
  const engine = new SshEngine(store, { connectTimeoutMs: readConfigField(config?.connectTimeoutMs, DEFAULT_CONNECT_TIMEOUT_MS) })
  ctx.effect(() => () => { engine.dispose() }, 'dsh-ssh: engine')
```

**依据 11 · 源码核查**：[packages/dsh-ssh/src/engine.ts:180-185](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine.ts#L180-L185)

engine dispose具体池和隧道清理。

```text
  /** Close every pooled connection and tunnel. */
  dispose(): void {
    if (this.sweepTimer !== undefined) clearInterval(this.sweepTimer)
    for (const id of [...this.tunnels.keys()]) stopTunnel(this, id)
    for (const alias of [...this.pool.keys()]) disposeRecord(this, alias)
  }
```

**依据 12 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:169-195](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/terminal-sessions.ts#L169-L195)

detach保留，显式end关闭。

<details>
<summary>查看原文（27行）</summary>

```text

  /** Remove a socket from its session, keeping the shell alive. */
  private detach(ws: WebSocket): void {
    for (const session of this.sessions.values()) {
      if (!session.sockets.delete(ws)) continue
      if (session.sockets.size === 0) {
        // Nobody is watching: give the view a window to come back before the
        // remote shell is torn down (or, for an exited one, before its final
        // screen is dropped).
        this.scheduleReap(session, session.exited ? this.exitGraceMs : this.idleMs)
      }
      return
    }
  }

  /** End the session a socket is attached to (explicit close from the view). */
  private end(session: HostedTerminal, notify: boolean): void {
    this.clearReap(session)
    if (this.sessions.delete(session.id) && notify) {
      if (session.pendingAuthFinish !== undefined) {
        const finish = session.pendingAuthFinish
        session.pendingAuthFinish = undefined
        try { finish([]) } catch { /* the connect already failed */ }
      }
    }
    try { session.shell?.close() } catch { /* channel gone */ }
  }
```

</details>

**依据 13 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:77-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L77-L125)

没有hostVerifier配置的完整构造。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock: ConnectConfig['sock'] | undefined, opts: Required<EngineOptions>): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: opts.connectTimeoutMs,
    keepaliveInterval: opts.keepaliveIntervalMs,
    keepaliveCountMax: 3,
    tryKeyboard: true,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
  } else if (entry.auth.kind === 'agent') {
    const agentPath = resolveAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      throw new Error('ssh-agent is not available: set SSH_AUTH_SOCK or configure an agent path (use \'pageant\' for PuTTY Pageant on Windows)')
    }
    config.agent = agentPath
  } else {
    const keyPath = entry.auth.keyPath === undefined ? undefined : expandHome(entry.auth.keyPath)
    if (keyPath === undefined || !existsSync(keyPath)) {
      throw new Error('private key not found: ' + (entry.auth.keyPath ?? '(unset)'))
    }
    config.privateKey = readFileSync(keyPath, 'utf8')
    if (entry.auth.passphrase !== undefined && entry.auth.passphrase !== '') {
      config.passphrase = entry.auth.passphrase
    }
  }
  // Agent forwarding is additive: it never changes how the host
  // authenticates, it only lets this connection broker signatures from the
  // local agent for the remote side (OpenSSH ForwardAgent / ssh -A).
  if (entry.forwardAgent === true) {
    // Agent auth already resolved an endpoint, and reusing it keeps the
    // forwarded agent identical to the one that authenticated.
    const agentPath = typeof config.agent === 'string'
      ? config.agent
      : resolveForwardAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      // ssh2's own message for this case ("You must set a valid agent path to
      // allow agent forwarding") names neither the host nor a way out, so the
      // engine refuses first with an actionable one.
      throw new Error('agent forwarding is enabled for this host but no ssh-agent endpoint is available: '
        + 'set SSH_AUTH_SOCK, start Pageant on Windows, or configure an agent path')
    }
    config.agent = agentPath
    config.agentForward = true
  }
  return config
```

</details>

**依据 14 · 源码核查**：[pnpm-lock.yaml:1071-1084](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/pnpm-lock.yaml#L1071-L1084)

此importer锁ssh2 1.17.0；默认hostVerifier语义另保固定依赖官方文档。

<details>
<summary>查看原文（14行）</summary>

```text
  packages/dsh-ssh:
    dependencies:
      '@deepseek-ai/schemastery':
        specifier: ^3.18.5
        version: 3.18.5
      '@xterm/addon-fit':
        specifier: ^0.11.0
        version: 0.11.0
      '@xterm/xterm':
        specifier: ^6.0.0
        version: 6.0.0
      ssh2:
        specifier: ^1.17.0
        version: 1.17.0
```

</details>

**依据 15 · 源码核查**：[packages/dsh-ssh/src/store.ts:365-403](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/store.ts#L365-L403)

坏文件旁移及0600临时文件rename，不是加密。

<details>
<summary>查看原文（39行）</summary>

```text
  private load(): StoreFile {
    let stats: { mtimeMs: number; size: number }
    try {
      stats = statSync(this.path)
    } catch {
      this.cache = undefined
      return { version: FORMAT_VERSION, hosts: [] }
    }
    if (this.cache !== undefined && this.cache.mtimeMs === stats.mtimeMs && this.cache.size === stats.size) {
      return this.cache.file
    }
    try {
      const parsed = JSON.parse(readFileSync(this.path, 'utf8')) as StoreFile
      if (typeof parsed !== 'object' || parsed === null || !Array.isArray(parsed.hosts)) {
        throw new Error('store file shape invalid')
      }
      this.cache = { mtimeMs: stats.mtimeMs, size: stats.size, file: parsed }
      return parsed
    } catch {
      // A corrupt store must not brick the plugin — and must not be silently
      // overwritten by the next save: rename it aside for manual recovery
      // (the plugin then starts from an empty list).
      this.cache = undefined
      try {
        renameSync(this.path, `${this.path}.corrupt-${Date.now()}`)
      } catch { /* best effort */ }
      return { version: FORMAT_VERSION, hosts: [] }
    }
  }

  private save(file: StoreFile): void {
    const dir = dirname(this.path)
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true, mode: 0o700 })
    const tmp = this.path + '.tmp'
    // Secrets live in this file: keep it readable by the owner only. The
    // tmp file carries the 0600 mode through the rename.
    writeFileSync(tmp, JSON.stringify(file, null, 2) + '\n', { encoding: 'utf8', mode: 0o600 })
    renameSync(tmp, this.path)
    this.cache = undefined
```

</details>

**依据 16 · 源码核查**：[packages/dsh-ssh/src/tools.ts:17-43](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/tools.ts#L17-L43)

模型host投影去ProxyCommand原文。

<details>
<summary>查看原文（27行）</summary>

```text
/**
 * One host row for the agent surface. The ProxyCommand STRING is deliberately
 * projected to a boolean: the command may embed credentials for a bastion
 * client, and the model only needs to know that the host goes through one.
 */
export interface AgentHostRow {
  alias: string
  host: string
  port: number
  user: string
  auth: SshAuthKind
  keyReady: boolean
  proxyJump: string[]
  proxyCommandConfigured: boolean
  forwardAgent: boolean
  description?: string
  environment?: string
  tags: string[]
  location?: string
  createdAt: number
  updatedAt: number
}

/** Project one summary onto the agent-facing row shape. */
export function toAgentHostRow(host: SshHostSummary): AgentHostRow {
  const { proxyCommand, ...rest } = host
  return { ...rest, proxyCommandConfigured: proxyCommand !== undefined }
```

</details>

**依据 17 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:33-91](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/sftp.ts#L33-L91)

传输最终路径/重试/无signal，resolvePath非会话cwd。

<details>
<summary>查看原文（59行）</summary>

```text
export async function upload(
  engine: PoolEngine,
  alias: string,
  localPath: string,
  remotePath: string,
  recursive: boolean,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number; files: number }> {
  // Remote paths must be absolute: the mkdir chain and fastPut must agree
  // on one resolution (relative paths previously created dirs at the root).
  if (!remotePath.startsWith('/')) {
    throw new Error('remotePath must be an absolute path (got \'' + remotePath + '\')')
  }
  const local = resolvePath(localPath)
  if (!existsSync(local)) throw new Error('local path not found: \'' + localPath + '\'')
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = statSync(local)
    let files: string[]
    if (stat.isDirectory()) {
      if (!recursive) throw new Error('\'' + localPath + '\' is a directory — enable recursive upload')
      files = walkLocalDir(local)
      await ensureRemoteDir(sftp, remotePath)
    } else {
      files = ['']
      await ensureRemoteDir(sftp, dirname(remotePath))
    }
    let bytes = 0
    for (const rel of files) {
      const src = rel === '' ? local : join(local, rel)
      // Remote paths always use forward slashes; normalize any OS separators.
      const remoteRel = rel.split(/[\\/]/).join('/')
      const dst = rel === '' ? remotePath : remotePath.replace(/\/$/, '') + '/' + remoteRel
      await fastPut(sftp, src, dst, engine.opts.sftpConcurrency, onProgress)
      bytes += statSync(src).size
    }
    return { bytes, files: files.length }
  }))
}

/** Download one remote file to a local path. */
export async function download(
  engine: PoolEngine,
  alias: string,
  remotePath: string,
  localPath: string,
  onProgress?: (progress: TransferProgress) => void,
): Promise<{ bytes: number }> {
  return withClient(engine, alias, (client) => withSftp(client, async (sftp) => {
    const stat = await new Promise<{ isDirectory: () => boolean }>((resolve, reject) => {
      sftp.stat(remotePath, (error, stats) => error !== undefined ? reject(error) : resolve(stats))
    })
    if (stat.isDirectory()) {
      throw new Error('\'' + remotePath + '\' is a directory — directory download is not supported yet (download individual files)')
    }
    const local = resolvePath(localPath)
    if (!existsSync(dirname(local))) mkdirSync(dirname(local), { recursive: true })
    await fastGet(sftp, remotePath, local, engine.opts.sftpConcurrency, onProgress)
    return { bytes: statSync(local).size }
  }))
```

</details>

**依据 18 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:122-137](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/sftp.ts#L122-L137)

SFTP channel finally释放。

<details>
<summary>查看原文（16行）</summary>

```text
async function withSftp<T>(client: Client, run: (sftp: SFTPWrapper) => Promise<T>): Promise<T> {
  const sftp = await sftpChannel(client)
  let ended = false
  const endOnce = (): void => {
    if (ended) return
    ended = true
    try { sftp.end() } catch { /* channel already closed */ }
  }
  // The channel can also close underneath us (peer reset, timeout); the
  // guard makes the finally below a no-op instead of ending it twice.
  sftp.once('close', endOnce)
  try {
    return await run(sftp)
  } finally {
    endOnce()
  }
```

</details>

**依据 19 · 源码核查**：[packages/dsh-ssh/src/engine/sftp.ts:177-216](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/sftp.ts#L177-L216)

fastGet/Put直接最终目标，无hash/temp事务。

<details>
<summary>查看原文（40行）</summary>

```text
function fastTransfer(sftp: SFTPWrapper, kind: 'put' | 'get', src: string, dst: string, concurrency: number, onProgress?: (progress: TransferProgress) => void): Promise<void> {
  return new Promise((resolve, reject) => {
    // Progress frames name the destination on upload, the source on download;
    // the final size comes from the local side of the transfer.
    const file = kind === 'put' ? dst : src
    const finalSize = (): number => statSync(kind === 'put' ? src : dst).size
    let last = 0
    let lastEmit = 0
    const started = Date.now()
    if (kind === 'put') {
      onProgress?.({ phase: 'transferring', file, transferred: 0, total: statSync(src).size, percent: 0 })
    }
    const step = (transferred: number, _chunk: number, total: number): void => {
      const now = Date.now()
      // Throttle: high-speed links fire one callback per chunk; the UI only
      // needs ~10 frames per second.
      if (now - lastEmit < 100 && transferred < total) return
      lastEmit = now
      const elapsed = (now - started) / 1000
      onProgress?.({
        phase: 'transferring',
        file,
        transferred,
        total,
        percent: total > 0 ? Math.round((transferred / total) * 1000) / 10 : 0,
        speedBps: elapsed > 0 ? Math.round((transferred - last) / elapsed) : undefined,
      })
      last = transferred
    }
    const done = (error: unknown): void => {
      if (error !== undefined) {
        onProgress?.({ phase: 'error', file, transferred: 0, total: 0, percent: 0, error: String(error) })
        reject(error)
      } else {
        onProgress?.({ phase: 'done', file, transferred: finalSize(), total: finalSize(), percent: 100 })
        resolve()
      }
    }
    if (kind === 'put') sftp.fastPut(src, dst, { concurrency, step }, done)
    else sftp.fastGet(src, dst, { concurrency, step }, done)
```

</details>

**依据 20 · 源码核查**：[packages/dsh-ssh/src/routes.ts:24-26](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L24-L26)

GUI上传接收cap，与工具不同。

```text

/** Cap on declared upload bodies (staged to disk before SFTP). */
const MAX_UPLOAD_BYTES = 4 * 1024 * 1024 * 1024
```

**依据 21 · 源码核查**：[packages/dsh-ssh/README.zh.md:38-50](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/README.zh.md#L38-L50)

作者明示凭据、转发、本机路径与输出风险。

<details>
<summary>查看原文（13行）</summary>

```text

- 所有 `/api/dsh-ssh/*` 路由仅限 loopback 访问（含同源校验）——对远程服务器执行命令的接口不会暴露给局域网。
- 密码 / 密钥口令以明文保存在 `~/.dsh/dsh-ssh.json`，文件权限 0600、目录 0700（与 ssh-skill 把密码写进 ssh-config 注释同一信任模型）。
- ssh-agent 认证仅保存 agent socket 路径（或 `pageant` 特殊值），不读取也不保存任何私钥材料。空的 agent 路径不是机密，任何时候都会提交：它表示自动检测（`SSH_AUTH_SOCK`，Windows 上再退到原生 OpenSSH 命名管道），因此把主机改成 SSH Agent 后即使路径留空也会生效。
- Agent 转发是按主机选择性启用的能力，默认关闭。启用 `forwardAgent` 后，该主机上的每个 exec 与 PTY 会话都会向服务端请求 `auth-agent-req@openssh.com`，这意味着远端主机可以用你本机的密钥以这台机器的身份完成认证。只为你信任的主机启用，并记住这类主机上的每个会话都能使用被转发的 agent。本地端点（主机配置的 agent 路径、`SSH_AUTH_SOCK`、Windows 上的原生 OpenSSH 命名管道）解析不出来时连接直接失败，而不是什么都不转发；服务端拒绝该请求时，其错误原样呈现。
- 隧道只监听 `127.0.0.1`。
- 删除主机或修改其连接字段（host / port / user / auth / proxyJump / proxyCommand / forwardAgent）会立即断开该别名的池化连接与隧道，后续操作按新配置重新建连，不会复用旧凭据的已认证连接。
- 隧道背后的 SSH 连接一旦断开，隧道会自行退役：本地端口不再接受连接，隧道从列表中消失；断开期间到达的连接被直接关闭且没有流量，不会打断宿主进程。
- `proxyCommand` 是一条由 DSH 宿主进程以其自身权限执行的 shell 命令——与 `ssh(1)` 执行 `~/.ssh/config` 里同一行的信任模型一致。它只能来自用户自己的 0600 配置文件：Agent 无法创建或修改主机，`ssh_list` 只报告该主机是否配置了 ProxyCommand，不返回命令原文。
- Agent 使用工具前，主机需先在 GUI 中配置（或从 ~/.ssh/config 导入）。
- `ssh_upload` / `ssh_download` 以宿主进程权限直接读写本机任意路径（不经 bash 沙箱）——与 ssh-skill 的宿主本地路径语义一致，注意该权限面。
- Agent 传输工具只在本机与远程 SSH 主机之间移动文件；本机文件的读写一律使用本地文件工具（read / write / edit / bash），不要使用 `ssh_*` 工具。
- exec / cluster 的远程输出原样返回（不脱敏），命令如 `env` 可能把远端环境中的密钥带回对话记录。
```

</details>

**依据 22 · 源码核查**：[packages/dsh-ssh/src/routes.ts:192-234](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L192-L234)

GUI exec/cluster调用没有传engine.signal，不能用模型caller局部取消推GUI断连停止。

<details>
<summary>查看原文（43行）</summary>

```text
      path: SSH_API.exec,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = (await readJsonBody(req)) as Record<string, unknown> | null
        const alias = typeof body?.alias === 'string' ? body.alias : ''
        const command = typeof body?.command === 'string' ? body.command : ''
        if (alias === '' || command === '') {
          writeJson(res, 400, { error: 'alias and command are required' })
          return
        }
        const timeoutMs = typeof body?.timeoutMs === 'number' ? body.timeoutMs : undefined
        try {
          writeJson(res, 200, { result: await engine.exec(alias, command, timeoutMs) })
        } catch (error) {
          writeJson(res, 500, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    },
    {
      kind: 'exact',
      path: SSH_API.cluster,
      handler: async (req, res) => {
        if (!guard(req, res, 'POST')) return
        const body = (await readJsonBody(req)) as Record<string, unknown> | null
        const command = typeof body?.command === 'string' ? body.command : ''
        if (command === '') {
          writeJson(res, 400, { error: 'command is required' })
          return
        }
        const aliases = Array.isArray(body?.aliases) ? body.aliases.filter((x): x is string => typeof x === 'string') : undefined
        const tags = Array.isArray(body?.tags) ? body.tags.filter((x): x is string => typeof x === 'string') : undefined
        const environment = typeof body?.environment === 'string' ? body.environment : undefined
        const timeoutMs = typeof body?.timeoutMs === 'number' ? body.timeoutMs : undefined
        const maxWorkers = typeof body?.maxWorkers === 'number' ? body.maxWorkers : undefined
        const hasAliases = aliases?.some(alias => alias.trim() !== '') === true
        const hasEnvironment = typeof environment === 'string' && environment.trim() !== ''
        const hasTags = tags?.some(tag => tag.trim() !== '') === true
        if (!hasAliases && !hasEnvironment && !hasTags) {
          writeJson(res, 400, { error: 'ssh_cluster requires aliases, environment, or tags to limit the target set' })
          return
        }
        try {
          writeJson(res, 200, { results: await engine.cluster({ command, aliases, environment, tags, timeoutMs, maxWorkers }) })
```

</details>

#### 缺口

- 取消/断链竞态、alias变更重试与远端残留未复现，身份pin/OS策略不受本组件保障
  **影响**：不能推荐生产变更、非幂等自动重试或无人监督运维；仅受控链路一次性测试凭据的无模型轮次只读小样
  **进一步探讨**：授权后测试执行后断网、exec回调报错同时取消、队列取消、alias变更及禁用后监听/PTY，逐层核真实远端与本机状态；身份验证/路径权限要求不满足则停用。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样限定采用，依赖、步骤、现金人工与效果分别是什么？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

当前只建议有SSH经验的人，在独立可弃置DSH_HOME、仅一台本机隔离VM或受控隔离链路测试机、短期专用低权限密钥、无转发/ProxyCommand/多跳/生产凭据的条件下试GUI单alias只读命令；不启动模型轮次，不把announce=false当工具关闭。若需要known_hosts/指纹强校验、凭据加密或工作区文件沙箱，先观察并用既有满足条件的SSH方案；本轮未安装或执行这一方案。

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 宿主/Node/客户端 | 启动及GUI必需 | DSH>=0.2.1-rc.3、Node ^22.19或>=24、webServer/tools/systemPrompt与client原生slots/layout等 | 清单声明与接线已读，真实兼容未测；GUI座缺失可不显示，不能据声明当可用 |
| 远端身份与认证 | 远端操作必需；本小样限隔离测试机 | 独立确认的隔离测试机、专用低权限临时key及受控链路 | ssh2默认自动接受key，插件未pin；不能据OpenSSH已有known_hosts认定本连接已验，身份/链路不满足即不试 |
| 配置/本机权限 | 本项可控小样必需；模型限制在调用模型时必需 | 独立DSH_HOME仅一测试alias；不导入真实~/.ssh/config、不用真实agent/forwardAgent/ProxyCommand | 同home跨profile共用store；模型工具面需宿主另限，隐藏提示不能撤权，条件不满足不扩大采用 |
| 远端/传输/端口 | 各对应操作必需 | 目标账号权限、网络、host临时磁盘；大文件/隧道后续另审 | 缺权限/网络/空间对应操作不能完成；GUI staging与工具任意host路径不同，非完整沙箱/资源配额 |
| 遥测网络与浏览器偏好 | 心跳非SSH核心功能必需；可选外发 | client apply调用共享helper，随机visitor/包名/可选baked版本发dsh-market.com | DNT/opt-out与storage等门槛、成功日标记；失败静默/可能重试，未核服务端IP存储 |

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 建独立home和一测试主机 | 具SSH经验的用户准备独立可弃置DSH_HOME、专用临时key和唯一测试alias，检查无真实别名/转发配置 | 核真实host/user/port与key；沿用原home/凭据或身份不明即停，不靠GUI分组隔离权限 |
| 只读对照 | 用户在GUI cluster页只填该alias和已审核只读命令并确认；插件执行并显示逐alias结果，用户以OpenSSH对照 | 核输出与远端状态；不用默认全服务器目标，未匹配/部分失败/输出截断不当整项成功 |
| 故障边界复核 | 用户在后续获授权、确认没有写任务时复核取消/连接重试及目标，保留远端日志/任务ID | 核目标是否一致；结果未知不重复写操作，人工对账 |
| 退出/撤权 | 用户显式关闭PTY/隧道并核监听、池/远端状态；管理员卸载插件、撤测试key，确认后人工移除隔离home | enabled配置或关面板不证明所有资源已停，远端副作用不靠卸载回滚 |

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次使用 | 插件/宿主、隔离VM与网络；费用和许可适配支出未获取 | 版本兼容、目标身份/权限、独立home与凭据配置，工时未测 | 本轮未安装或运行，真实兼容与配置耗时未知 |
| 持续使用：命令 | 每跳连接、最多3次条件重试、名义有限输出、每主机/cluster真实远端资源 | 审命令/选择器和输出脱敏需人，频次与总工时未知 | 30秒单连接与60秒stream预算非任务总deadline；同alias池可分摊建连，但净成本/节时未测 |
| 持续使用：传输/隧道/PTY | 临时磁盘、文件流量、长连接与127.0.0.1 listener；总体配额/费用未知 | 本机路径审查、中断/残留和资源清理，恢复耗时未知 | 默认idle只覆盖条件内资源，不能当所有存量资源已停 |
| 持续使用：若调用模型 | 后续token/价格/并发及远端消耗另计 | 真实生产工具scope/审批另核 | 本轮小样无模型轮次，不声称模型费用被timeout封顶 |
| 失败恢复 | 可能重复请求/文件、留部分状态；额外消耗未知 | 远端结果对账、撤重复副作用与多阶段清理，工时未知 | 没有已测自动恢复承诺，不能从可重连推已恢复 |


| 效果 | 当前材料支持 | 不能据此证明 |
|---|---|---|
| 配置复用 | GUI/工具同store/engine、池与独立PTY路径真实 | 总工时/切换成本下降或生产部署完成 |
| 目标范围 | cluster非空selector、组合过滤及逐alias结果、默认最多8 worker | 选择器即逐机授权、原子回滚或重试目标冻结 |
| 生命周期 | 连接字段变更清池/隧道，PTY可重附着、channel finally释放 | 删alias/关enabled/关面板必停所有资源；远端进程已停止 |
| 执行回报 | exit/output/timeout、有限捕获截断及错误 | at-most-once、完整输出、已验主机key和业务终态正确 |

预期便利须和终端/既有SSH管理器同任务比较错目标、重复操作、恢复分钟与后续使用意愿。上述条件过重、存在未知结果或恢复负担抵消便利时停止扩展，保留成熟原流程。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/package.json:1-41](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/package.json#L1-L41)

基础运行与宿主入口声明。

<details>
<summary>查看原文（41行）</summary>

```text
{
  "name": "@linxin666/dsh-ssh",
  "description": "Remote SSH operations for the dsh web GUI: host config store (~/.dsh/dsh-ssh.json, import from ~/.ssh/config), a persistent ssh2 connection pool with jump-host support, exec / PTY web terminal / SFTP transfer / local port-forward tunnels / cluster execution, plus agent tools (ssh_list, ssh_exec, ssh_upload, ssh_download, ssh_tunnel, ssh_cluster). Hot-pluggable — mounted via ~/.dsh/cordis.patch.yml + a profile node_modules symlink, no dsh source changes.",
  "version": "0.4.12",
  "icon": "icon.svg",
  "type": "module",
  "packageManager": "pnpm@11.7.0",
  "engines": {
    "node": "^22.19.0 || >=24.0.0"
  },
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
    "./package.json": "./package.json"
  },
  "dsh": {
    "engines": {
      "dsh": ">=0.2.1-rc.3"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-renderer",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/store.ts:20-22](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/store.ts#L20-L22)

DSH_HOME级配置，不按profile隔离。

```text
/** Store file location: $DSH_HOME/dsh-ssh.json (defaults to ~/.dsh). */
export function storePath(): string {
  return join(dshHome(), 'dsh-ssh.json')
```

**依据 3 · 源码核查**：[packages/dsh-ssh/src/index.ts:92-102](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/index.ts#L92-L102)

提示关闭不关默认enabled。

<details>
<summary>查看原文（11行）</summary>

```text
export const Config = z.object({
  announceToAgent: z.boolean().default(false).volatile(),
  enabled: z.boolean().default(true).volatile(),
  terminalFontFamily: z.string().default('').volatile(),
  connectTimeoutMs: z.number().step(1).min(1_000).max(600_000).default(DEFAULT_CONNECT_TIMEOUT_MS).volatile()
    .description('TCP connect, SSH key exchange and user authentication timeout in milliseconds; raise it for hosts whose authentication is slow.'),
})

/** Schema defaults, re-read for hand-built test contexts (the loader applies them normally). */
const DEFAULT_ANNOUNCE = false
const DEFAULT_ENABLED = true
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/client/panel/ClusterTab.tsx:32-45](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/panel/ClusterTab.tsx#L32-L45)

当前GUI单alias只读小样可走实际调用。

<details>
<summary>查看原文（14行）</summary>

```text
  const run = async (): Promise<void> => {
    if (command.trim() === '' || running) return
    if (!window.confirm(tt('cluster.confirm'))) return
    setRunning(true)
    setError(null)
    try {
      const aliasList = splitList(aliases)
      const tagList = splitList(tags)
      const outcome = await api.cluster({
        command: command.trim(),
        aliases: aliasList.length > 0 ? aliasList : undefined,
        environment: environment.trim() === '' ? undefined : environment.trim(),
        tags: tagList.length > 0 ? tagList : undefined,
      })
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:20-59](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/cluster.ts#L20-L59)

selector、逐host结果和worker上限。

<details>
<summary>查看原文（40行）</summary>

```text
/** Run one command against many hosts concurrently. */
export async function cluster(engine: PoolEngine, options: ClusterOptions): Promise<ClusterResult[]> {
  const hasAliases = Array.isArray(options.aliases) && options.aliases.some(alias => typeof alias === 'string' && alias.trim() !== '')
  const hasEnvironment = typeof options.environment === 'string' && options.environment.trim() !== ''
  const hasTags = Array.isArray(options.tags) && options.tags.some(tag => typeof tag === 'string' && tag.trim() !== '')
  if (!hasAliases && !hasEnvironment && !hasTags) {
    throw new Error('ssh_cluster requires aliases, environment, or tags to limit the target set')
  }

  let targets = engine.store.list()
  if (options.aliases !== undefined && options.aliases.length > 0) {
    targets = targets.filter(entry => options.aliases!.includes(entry.alias))
  }
  if (options.environment !== undefined && options.environment !== '') {
    targets = targets.filter(entry => entry.environment === options.environment)
  }
  if (options.tags !== undefined && options.tags.length > 0) {
    // ALL semantics (matches the ssh_cluster tool description).
    targets = targets.filter(entry => options.tags!.every(tag => entry.tags.includes(tag)))
  }
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs, options.signal)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:42-49](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L42-L49)

默认池/连接/exec/输出参数。

```text
export const DEFAULTS: Required<EngineOptions> = {
  idleTimeoutMs: 30 * 60_000,
  connectTimeoutMs: DEFAULT_CONNECT_TIMEOUT_MS,
  keepaliveIntervalMs: 15_000,
  maxOutputBytes: 2 * 1024 * 1024,
  defaultExecTimeoutMs: 60_000,
  defaultMaxWorkers: 8,
  sftpConcurrency: 8,
```

**依据 7 · 源码核查**：[packages/dsh-ssh/src/engine/terminal-sessions.ts:17-30](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/terminal-sessions.ts#L17-L30)

PTY名义buffer和detach/exit时间，与总资源不同。

<details>
<summary>查看原文（14行）</summary>

```text
/** Pause the shell when an attached socket's send buffer exceeds this… */
const BACKPRESSURE_HIGH_WATER = 1024 * 1024

/** …and resume once every attached socket drains below this. */
const BACKPRESSURE_LOW_WATER = 512 * 1024

/** Scrollback retained for a reattaching view (bytes of UTF-8 output). */
const DEFAULT_MAX_BUFFER_BYTES = 256 * 1024

/** A detached session is reaped after this long. */
const DEFAULT_IDLE_MS = 10 * 60 * 1000

/** An exited session is kept this long for a reattaching view. */
const DEFAULT_EXIT_GRACE_MS = 60 * 1000
```

</details>

**依据 8 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:479-485](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L479-L485)

idle sweep跳过pinned/inFlight。

```text
/** Close connections idle beyond the threshold (skips pinned and in-flight). */
export function sweepPool(engine: PoolEngine): void {
  const cutoff = Date.now() - engine.opts.idleTimeoutMs
  for (const [alias, record] of engine.pool) {
    if (!record.pinned && record.inFlight === 0 && record.idleAt < cutoff) {
      disposeRecord(engine, alias, record)
    }
```

**依据 9 · 源码核查**：[packages/dsh-ssh/src/client/index.ts:74-77](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/index.ts#L74-L77)

客户端心跳实际caller。

```text
export function apply(ctx: ClientContext): void {
  // Anonymous install heartbeat (docs/telemetry.md): one beat per browser per
  // UTC day, package name only, silent failure.
  reportDailyHeartbeat([{ name: '@linxin666/dsh-ssh' }])
```

**依据 10 · 源码核查**：[packages/dsh-ssh/src/client/telemetry.ts:117-150](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/client/telemetry.ts#L117-L150)

抑制、实际payload、日标记与失败处理。

<details>
<summary>查看原文（34行）</summary>

```text
export function reportDailyHeartbeat(items: readonly TelemetryItem[]): void {
  try {
    // First guard: a stored opt-out or the browser's Do Not Track stops every
    // read below from minting an id, marking the day, or reaching the network.
    if (isTelemetrySuppressed()) return
    if (items.length === 0) return
    const today = new Date().toISOString().slice(0, 10)
    // Automation contexts (CDP-driven QA browsers, fresh isolated profiles)
    // mint a new visitor id per run and would inflate instance counts.
    if (navigator.webdriver) return
    if (localStorage.getItem(DAY_KEY_PREFIX + today) !== null) return
    const visitor = visitorId()
    if (visitor === null) return
    pruneDayKeys(today)
    const payloadItems = items.map((item) => {
      const out: Record<string, string> = { name: item.name }
      const version = item.version ?? bakedVersion()
      if (version !== undefined) out.version = version
      if (item.channel !== undefined) out.channel = item.channel
      return out
    })
    const body = JSON.stringify({ kind: 'heartbeat', visitor, items: payloadItems })
    void fetch(ENDPOINT, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body,
      keepalive: true,
    }).then((response) => {
      // Mark the day only after an accepted send, so offline browsers retry
      // on a later mount instead of going dark until tomorrow.
      if (response.ok) localStorage.setItem(DAY_KEY_PREFIX + today, '1')
    }).catch(() => { /* unreachable endpoint: stay silent */ })
  } catch { /* never break the host UI over telemetry */ }
}
```

</details>

#### 缺口

- 费用/工时/峰值、兼容及真实用户需求没有数据
  **影响**：可控实验方案而非生产采用证明，恢复和主机信任负担阻止高成本可控分
  **进一步探讨**：独立测试机保只读，量同任务工时、错误/恢复与资源；若须生产凭据/主机key pin或文件沙箱则先保持观察/改用既有方案。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 可证伪改进方向是什么，什么时候小补丁已足够？

**研究主题**：新假设与验证

#### 完整回答

候选是绑定真实目标的远端操作结果对账，而不是更激进重连。当前已有逐alias结果、exit/output/timeout、broken才重试、部分取消结果保护、连接字段失效与PTY重附着；不能假装没有这些机制。增量只针对副作用完成后失去exit状态的不确定性、重试重新解析alias的目标变化、取消后仍进队列/开channel以及资源清理与业务回滚不同。

最小补丁可冻结一次操作的解析目标、受验证的主机key/账号与配置版本，在发channel前和取队列任务前检查取消；不可只依赖可变alias名。命令的只读/幂等策略应由用户明确核定，不能让模型自称幂等就放行。非幂等任务失败后先unknown，若远端能提供操作ID、持久记录和可靠结果探针则对账，否则保留未知由人决定，不在没有exitCode时认定没执行。远端记录与授权/主机key验证本身有部署成本，不是目前已实现能力。

对照同一可弃置测试机和写入副本任务，在远端副作用完成而exit未回时断网，另测同时改alias、取消队列和channel回调错误；比较当前插件、普通OpenSSH/明确作业ID+日志的人工清单、最小补丁三种。数重复/错目标写入、未知结果正确保留、远端探针误判、恢复人工分钟和正常路径开销，不能拿重连率/绿勾数计收益。现有逐主机结果与清理应保留，不为了新产品拆掉局部保护。

若原插件几处signal/queue/目标冻结修补与普通远端作业日志已足够，或用户低频只读且人工清单无漏项，应只上游修复、不做独立插件。只有真实用户频繁遇到跨目标/未知副作用恢复且对账持续少错、工时收益超过部署维护才继续；没有对照、实际需求或付费材料，不把源码风险推成商业需求。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:493-522](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L493-L522)

已有条件重试及可选signal保护。

<details>
<summary>查看原文（30行）</summary>

```text
export async function withClient<T>(engine: PoolEngine, alias: string, fn: (client: Client) => Promise<T>, attempts = 3, signal?: AbortSignal): Promise<T> {
  let lastError: unknown
  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    let record = engine.pool.get(alias)
    if (record === undefined || record.broken) {
      if (record !== undefined) disposeRecord(engine, alias, record)
      record = await acquire(engine, alias)
    }
    record.idleAt = Date.now()
    record.inFlight += 1
    try {
      const result = await fn(record.client)
      record.idleAt = Date.now()
      return result
    } catch (error) {
      lastError = error
      // A cancelled call is never replayed: the caller asked for it to stop,
      // and a retry would re-run a command that may not be idempotent.
      if (signal?.aborted === true) throw error
      // Retry only when the connection actually broke mid-flight: drop the
      // corpse and let the next attempt reconnect (a reconnect may replay a
      // non-idempotent command — the documented trade-off). A failure on a
      // healthy connection is a logic error and is rethrown, not replayed.
      if (!record.broken) throw error
      disposeRecord(engine, alias, record)
    } finally {
      record.inFlight -= 1
    }
  }
  throw lastError instanceof Error ? lastError : new Error(String(lastError))
```

</details>

**依据 2 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:605-634](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L605-L634)

丢exit状态与实际未传池signal的caller。

<details>
<summary>查看原文（30行）</summary>

```text
          if (typeof code !== 'number' && !timedOut) {
            // The channel closed without an exit status: the connection
            // dropped mid-flight. Reject so withClient can reconnect and
            // retry within the attempt budget.
            reject(new Error('ssh: connection lost mid-flight (channel closed without an exit status)'))
            return
          }
          resolve({
            success: code === 0,
            exitCode: code,
            timedOut,
            stdout: stdout.text,
            stderr: stderr.text,
            durationMs: Date.now() - started,
          })
        })
        stream.on('error', (streamError: Error) => {
          if (settled) return
          settled = true
          clearTimeout(timer)
          signal?.removeEventListener('abort', onAbort)
          if (aborted) {
            resolve(cancelledResult())
            return
          }
          reject(streamError)
        })
      })
    })
  })
```

</details>

**依据 3 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:435-450](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L435-L450)

每次按alias读配置需区分操作绑定。

<details>
<summary>查看原文（16行）</summary>

```text
export async function acquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const pending = engine.acquireQueue.get(alias)
  if (pending !== undefined) return pending
  const task = doAcquire(engine, alias)
  engine.acquireQueue.set(alias, task)
  try {
    return await task
  } finally {
    if (engine.acquireQueue.get(alias) === task) engine.acquireQueue.delete(alias)
  }
}

async function doAcquire(engine: PoolEngine, alias: string): Promise<PoolRecord> {
  const entry = engine.store.find(alias)
  if (entry === undefined) throw new Error('alias \'' + alias + '\' not found — add it first')
  const { client, hops } = await connectChain(engine, entry)
```

</details>

**依据 4 · 源码核查**：[packages/dsh-ssh/src/routes.ts:128-139](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/routes.ts#L128-L139)

变更配置使池失效。

<details>
<summary>查看原文（12行）</summary>

```text
          try {
            const entry = store.update(alias, body as unknown as Partial<HostPayload>)
            // Connection-relevant changes invalidate the pooled connection:
            // without this the pool would keep running commands on the old
            // host/credentials until the idle sweep (up to 30 min later).
            // Agent forwarding belongs here too: it is fixed per connection
            // (ssh2 negotiates it when the channel opens), so toggling it must
            // reconnect or the new setting silently never takes effect.
            const patch = body as Record<string, unknown>
            if (['host', 'port', 'user', 'auth', 'proxyJump', 'proxyCommand', 'forwardAgent'].some(key => patch[key] !== undefined)) {
              engine.dropAlias(alias)
            }
```

</details>

**依据 5 · 源码核查**：[packages/dsh-ssh/src/engine/cluster.ts:40-59](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/cluster.ts#L40-L59)

现有逐host结果/队列取消改进点。

<details>
<summary>查看原文（20行）</summary>

```text
  if (targets.length === 0) return []
  if (options.maxWorkers !== undefined && (!Number.isInteger(options.maxWorkers) || options.maxWorkers < 1)) {
    throw new Error('maxWorkers must be a positive integer')
  }
  const workers = Math.min(engine.opts.defaultMaxWorkers, options.maxWorkers ?? engine.opts.defaultMaxWorkers, targets.length)
  const results: ClusterResult[] = []
  const queue = [...targets]
  const run = async (): Promise<void> => {
    while (queue.length > 0) {
      const entry = queue.shift()!
      try {
        const result = await execCommand(engine, entry.alias, options.command, options.timeoutMs, options.signal)
        results.push({ alias: entry.alias, ok: result.success, exitCode: result.exitCode, timedOut: result.timedOut, stdout: result.stdout, stderr: result.stderr, durationMs: result.durationMs })
      } catch (error) {
        results.push({ alias: entry.alias, ok: false, error: error instanceof Error ? error.message : String(error) })
      }
    }
  }
  await Promise.all(Array.from({ length: workers }, () => run()))
  return results
```

</details>

**依据 6 · 源码核查**：[packages/dsh-ssh/src/engine/connection-pool.ts:77-125](https://github.com/zhu1090093659/dsh-web/blob/de02a7fc92a34ec4e565592e6a2cfa85ecae18b1/packages/dsh-ssh/src/engine/connection-pool.ts#L77-L125)

当前目标认证构造没有主机key验证接线。

<details>
<summary>查看原文（49行）</summary>

```text
export function buildConnectConfig(entry: SshHostEntry, sock: ConnectConfig['sock'] | undefined, opts: Required<EngineOptions>): ConnectConfig {
  const config: ConnectConfig = {
    host: entry.host,
    port: entry.port,
    username: entry.user,
    readyTimeout: opts.connectTimeoutMs,
    keepaliveInterval: opts.keepaliveIntervalMs,
    keepaliveCountMax: 3,
    tryKeyboard: true,
  }
  if (sock !== undefined) config.sock = sock
  if (entry.auth.kind === 'password') {
    config.password = entry.auth.password
  } else if (entry.auth.kind === 'agent') {
    const agentPath = resolveAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      throw new Error('ssh-agent is not available: set SSH_AUTH_SOCK or configure an agent path (use \'pageant\' for PuTTY Pageant on Windows)')
    }
    config.agent = agentPath
  } else {
    const keyPath = entry.auth.keyPath === undefined ? undefined : expandHome(entry.auth.keyPath)
    if (keyPath === undefined || !existsSync(keyPath)) {
      throw new Error('private key not found: ' + (entry.auth.keyPath ?? '(unset)'))
    }
    config.privateKey = readFileSync(keyPath, 'utf8')
    if (entry.auth.passphrase !== undefined && entry.auth.passphrase !== '') {
      config.passphrase = entry.auth.passphrase
    }
  }
  // Agent forwarding is additive: it never changes how the host
  // authenticates, it only lets this connection broker signatures from the
  // local agent for the remote side (OpenSSH ForwardAgent / ssh -A).
  if (entry.forwardAgent === true) {
    // Agent auth already resolved an endpoint, and reusing it keeps the
    // forwarded agent identical to the one that authenticated.
    const agentPath = typeof config.agent === 'string'
      ? config.agent
      : resolveForwardAgentPath(entry.auth.agentPath)
    if (agentPath === undefined) {
      // ssh2's own message for this case ("You must set a valid agent path to
      // allow agent forwarding") names neither the host nor a way out, so the
      // engine refuses first with an actionable one.
      throw new Error('agent forwarding is enabled for this host but no ssh-agent endpoint is available: '
        + 'set SSH_AUTH_SOCK, start Pageant on Windows, or configure an agent path')
    }
    config.agent = agentPath
    config.agentForward = true
  }
  return config
```

</details>

#### 缺口

- 结果对账补丁/远端探针未实现，也无用户对照或商业数据
  **影响**：只能作为待验证改进，不宣称已防重复、降成本或有独立插件市场
  **进一步探讨**：先与简单修补/人工作业ID清单比较，若无频繁实际故障或收益不足则否定独立方向。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
