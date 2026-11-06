# DSH Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[19641d2](https://github.com/dsh-market/dsh-market/tree/19641d22a69b63063bb9b67a5f67a0dcb72703a0)

<!-- BEGIN META -->
[![GitHub ★ 10,983](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10%2C983&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 907,321](https://img.shields.io/static/v1?label=npm+30d&message=907%2C321&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-11-05](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-05&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览社区插件，并管理安装、更新和配置。

> **亮点**：[Q02](#research-q02) 的精确目标重比、manifest/可加载入口/冲突后验，与[Q04](#research-q04) 实际Agent排空和有条件恢复构成可检查的插件维护组合。它比只信CLI退出码多给盘面和失败信息，但继承包管理器/Host能力，没有证明全事务恢复或实测节时。

> **主要限制**：[Q02](#research-q02) 集合部分成功、可覆盖的活动Agent确认和取消残留，[Q03](#research-q03) 未知兼容与缺gate放行，以及[Q04](#research-q04) 逐文件/部分恢复与重试上限，意味着一个成功标志不能证明整个profile已恢复且安全。集中操作是否值得，要看用户能否承担这些核对与救援成本。

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
  - [Q01 · 谁需要额外市场，真实入口和原生 Discover 的边界是什么？](#detail-section-11)
  - [Q02 · 从选目录条目到安装、更新和卸载，实际写入与成功判据是什么？](#detail-section-12)
  - [Q03 · 目录、兼容性和请求身份怎样限制执行，哪些情况仍会通过？](#detail-section-13)
  - [Q04 · 并发、取消、备份恢复和重启后修复能覆盖到哪一层？](#detail-section-14)
  - [Q05 · 维护者在什么条件下值得先试用，成本和退出怎样承担？](#detail-section-15)
  - [Q06 · 哪些贡献已成立，什么后续方向可被推翻？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向重复维护多插件且能备份/修复profile的使用者；合格结果是目标插件与profile可加载，正在执行的任务不被变更破坏。

[Q01](#research-q01) 原生Discover可使用同一目录，CLI也能安装更新；本项额外价值应比较实际变更检查与恢复，而不是目录独占或GUI低门槛。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 目录选择与安装 | 将条目送宿主包操作并核新增包 | 仅目录成员；不是代码安全审计 |
| 更新与卸载 | 管理活动profile中的插件版本/移除 | 部分成功、取消及宿主差异需核盘 |
| Agent排空 | 等待并持有兼容Agent后变更 | 依赖事件/maintenance；disposed有例外 |
| 本地恢复与特定修复 | 从备份/中断记录整理profile | 逐文件/部分恢复，非全局事务 |

**流程与依赖**

| 依赖 | 作用 | 版本或条件 |
|---|---|---|
| dshmarket | 本组件 | 1.73.12，MIT |
| DSH webServer/loader | 挂载服务 | README声明web>=0.1.0-rc.6，实际需验证 |
| Cordis/settings/schema | 宿主服务与配置 | Cordis^4.0.1；settings peer列rc.7/0.1.1/0.1.2/0.2系列且optional；schema^3.18.1 optional |
| js-yaml/undici | 配置/网络 | ^4.3.2 / ^7.29.1 |
| CLI/pnpm或Desktop manager | 真正包执行 | 正确profile目录、可用能力与下载网络 |
| Agent服务与事件 | 排空 | 可列举并订阅created/disposed、兼容maintenance |

| 步骤 | 操作 | 核对与失败处理 |
|---|---|---|
| 首次 | 核Host/profile/路径并备份 | 不能把web安装当Desktop已安装 |
| 选择 | 比较原生Discover、来源和兼容 | unknown不当通过证明 |
| 单包变更 | 安装/更新/卸载并看盘面/激活 | 集合ok不等于每包成功 |
| 有任务时 | 停重要任务或用受支持drain | 普通确认字段不能当隔离 |
| 恢复退出 | 核差异、备份和patch | 自动修复放弃即人工救援 |

**效果与成本**

| 阶段 | 现金与资源 | 人工与状态负担 |
|---|---|---|
| 首次 | 下载/存储费未知 | profile与包信任核对、备份，分钟未知 |
| 持续 | 来源网络及目标包服务费未知 | 版本/兼容/凭据维护 |
| 失败恢复 | 重试资源及额外包费用未知 | 取消残留、部分恢复、重启修复上限需核 |
| 退出 | 退款/第三方用量另核 | 市场移除不等于其他包/禁用patch/凭据清理 |

| 效果项 | 当前支持 | 未确认 |
|---|---|---|
| 安装结果 | 新增manifest/入口/冲突后验 | 同Host合格率与安全 |
| 活动任务维护 | 有条件Agent屏障 | 全宿主并发/外部CLI安全 |
| 故障状态 | 明确部分差异、终态日志、特定重试 | 原子恢复或全部自动自愈 |
| 采用收益 | 可控范围的隔离试用计划 | 节时、净收益与持续维护成本 |

> **思考**：[Q02](#research-q02) 集合部分成功、可覆盖的活动Agent确认和取消残留，[Q03](#research-q03) 未知兼容与缺gate放行，以及[Q04](#research-q04) 逐文件/部分恢复与重试上限，意味着一个成功标志不能证明整个profile已恢复且安全。集中操作是否值得，要看用户能否承担这些核对与救援成本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q02](#research-q02) 的精确目标重比、manifest/可加载入口/冲突后验，与[Q04](#research-q04) 实际Agent排空和有条件恢复构成可检查的插件维护组合。它比只信CLI退出码多给盘面和失败信息，但继承包管理器/Host能力，没有证明全事务恢复或实测节时。

[Q02](#research-q02) 不只信退出码，按盘面后验；[Q03](#research-q03)兼容/请求门存在条件；[Q04](#research-q04)disposed例外、mutation前重claim、终态日志与Desktop特定持久修复不能混淆。复杂恢复分支也带来维护与未验证风险，不以测试文件数或源码复杂度加分。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 集合部分成功、可覆盖的活动Agent确认和取消残留，[Q03](#research-q03) 未知兼容与缺gate放行，以及[Q04](#research-q04) 逐文件/部分恢复与重试上限，意味着一个成功标志不能证明整个profile已恢复且安全。集中操作是否值得，要看用户能否承担这些核对与救援成本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 在独立profile单包完成安装、更新、卸载和恢复，再与原生Discover/CLI比较；核来源、目录、实际激活和errors而非总ok。只在备份与手工救援可行时扩大；[Q06](#research-q06)的变更收据另作实验。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持有条件的变更治理组合；建议有备份和排障能力者隔离试用，未安装运行或真实宿主验收；变更收据方向未验证。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/backup.ts、src/client/MarketSection.tsx、src/drain-journal.ts、src/drain.ts、src/dsh-cli.ts、src/http.ts、src/index.ts、src/install.ts、src/official-desktop.ts、src/pending-updates.ts、src/registry.ts、src/routes.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根原生插件，实际读取客户端安装、入口/运行时、安装及代表更新卸载、目录/请求/兼容门、排空/取消、本地restore及Desktop中断更新修复。未全审主题/收藏/分组/排序、公共更新API、云备份/Gist讨论和detach重启页面。旧七题与全部findings已逐项重核。
- 下一步：仅源码核查，未运行目标代码/测试、安装包、宿主/模型/浏览器或真实账号。未来隔离故障矩阵应核目标漂移、部分安装、disposed/hold丢失、取消、磁盘中断及恢复上限；需求/成本对照仍为明确缺口。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.73.12（[固定提交 19641d2](https://github.com/dsh-market/dsh-market/tree/19641d22a69b63063bb9b67a5f67a0dcb72703a0)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 候选是将批准目标、真实盘面/激活差异与可执行恢复组合成变更收据，在独立profile演练后审查迁移；以当前市场+备份作对照，若遗漏原环境故障、目标不可复现或人工恢复更多就推翻，尚未验证。

仅源码核查，未运行目标代码/测试、安装包、宿主/模型/浏览器或真实账号。未来隔离故障矩阵应核目标漂移、部分安装、disposed/hold丢失、取消、磁盘中断及恢复上限；需求/成本对照仍为明确缺口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1214 | — | — | 19780 |
| .js | source | 1 | 18857 | 16561 | 3586 | — |
| .mjs | source | 12 | 1652 | 1063 | 490 | — |
| .ts | source | 76 | 40773 | 24912 | 14282 | — |
| .tsx | source | 13 | 13235 | 10279 | 2692 | — |
| .ts | test | 103 | 48336 | 36486 | 8623 | — |
| .tsx | test | 11 | 13119 | 10671 | 1588 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 4 | 244 | 72 | 155 | — |

</details>

**活跃度**

[![Issue 未关闭 79](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=79&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 189](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=189&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+created%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z) [![近30天关闭 174](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=174&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-07T06%3A50%3A45.128Z..2026-11-06T06%3A50%3A45.128Z)



统计日期：2026-11-06。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：重复维护插件者何时能通过市场安全改变活动profile，何时应退回原生Discover/CLI？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要额外市场，真实入口和原生 Discover 的边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

DSH Market 是原生 DSH 插件，根 dshmarket 版本 1.73.12、MIT；导出服务入口、bundle patch 与 web 客户端。apply 真正 inject webServer/loader 并挂载路由，不是独立桌面客户端。官方 Desktop 分支使用宿主 pluginManager，普通宿主则按显式配置、launcher、argv 再默认 web 选择 profile；同机安装到 web 不表示装到 Desktop。README 声明 web 最低 0.1.0-rc.6，package 的 settings peer 从 rc.7 等系列且 optional，不能把两个不同约束混成最低实际兼容证明。

目标是经常维护多插件、需要安装后核可加载入口并能恢复 profile 的用户，合格结果是目标包及活动 profile 可加载、任务未被中途文件修改破坏。基本搜索并非独占：作者明确同一目录索引能接进 DSH 0.2.1+ Discover；偶发安装可以使用原生 Discover 和 CLI，不能只因多一个市场页就认定任务组织发生创新。实际增量须落到以下各题的包变更、盘面后验、排空和恢复，而不是目录数量或受欢迎程度。

本轮完整复核正式前稿七题与全部 findings，检查当前入口、安装/代表更新/卸载、目录与请求门、Agent 排空、本地备份恢复及 Desktop 中断更新修复代表链。收藏/分组/主题、负载顺序、全部快照/同步/WebDAV/Gist、讨论外部账户、脱离宿主的重启恢复页面和公共更新 API 不在完整机制验收范围；作者列举这些功能不能自动当本轮已验证能力。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-12](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/package.json#L1-L12)

根名称、版本、服务入口与MIT声明。

<details>
<summary>查看原文（12行）</summary>

```text
{
  "name": "dshmarket",
  "description": "Visual plugin market inside DeepSeek Harness — browse, search, and one-click install community plugins. · DSH 可视化插件市场：逛一逛，点一下，装好。",
  "version": "1.73.12",
  "icon": "assets/logo.svg",
  "type": "module",
  "main": "lib/index.js",
  "types": "lib/types/index.d.ts",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "git+https://github.com/dsh-market/dsh-market.git"
```

</details>

**依据 2 · 源码核查**：[package.json:43-74](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/package.json#L43-L74)

具体peers、web客户端注入、bundle与导出。

<details>
<summary>查看原文（32行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.7 || ^0.1.1-rc.2 || ^0.1.2-alpha.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.1-rc.1",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-theme"
      ],
      "platform": "web"
    }
  },
  "exports": {
    ".": {
      "types": "./lib/types/index.d.ts",
      "default": "./lib/index.js"
    },
    "./update-api-v1": {
      "types": "./lib/types/update-api-v1.d.ts",
      "default": "./lib/update-api-v1.js"
    },
    "./client": "./client/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json",
    "./locale/*.json": "./locale/*.json"
  },
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-4](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/cordis.patch.yml#L1-L4)

实际插入dsh-market插件入口。

```text
# dsh bundle patch: inserts this plugin into a profile's layer stack.
- insert:
    - id: dsh-market
      name: 'dshmarket'
```

**依据 4 · 源码核查**：[src/index.ts:250-263](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/index.ts#L250-L263)

实际inject服务与profile选择起点。

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

**依据 5 · 源码核查**：[src/index.ts:290-328](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/index.ts#L290-L328)

官方Desktop实际构建专用runtime并传profile目录。

<details>
<summary>查看原文（39行）</summary>

```text
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
          // manager (#702). The market itself is the one exception (#982).
          hostPackageManagerOf(profileContext),
        )
        const resolved: MarketConfig = {
          profile: profileName,
          ...(profileDirectory === undefined ? {} : { profileDirectory }),
          origin: {
            profileSource: configured !== undefined ? 'configured (cordis.yml), official desktop branch' : 'launcher profileContext, official desktop branch',
            launcherAtStart: describeProfileContext(profileContext),
            launcherNow: () => describeProfileContext(ctx.get('profileContext')),
          },
          desktopHost: true,
          allowRestart: false,
          maxSnapshots: config?.maxSnapshots,
          // The third construction site, and the one #527's review caught
          // missing: a `buildEnv` configured in cordis.yml was silently
          // dropped on the official desktop host — the very host the feature
          // exists for (a GUI launch inherits no shell environment).
          buildEnv: config?.buildEnv,
          ...(typeof profileContext?.installAnchor === 'string' && isAbsolute(profileContext.installAnchor)
            ? { dshInstallDir: dirname(profileContext.installAnchor) } : {}),
        }
        installDesktopMarketSettings(ctx)
        host.effect(() => {
```

</details>

**依据 6 · 源码核查**：[src/index.ts:349-378](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/index.ts#L349-L378)

普通宿主profile优先级、目录与设置接线。

<details>
<summary>查看原文（30行）</summary>

```text
      }
      // The launcher's own package manager, when it publishes one. Registering
      // it here covers both the pnpm probe and every install spawn, since the
      // invocation's environment reaches both through spawnEnv (#653).
      setHostPackageManager(hostPackageManagerOf(profileContext))
      const useLaunchedDir = config?.profile === undefined && launched !== undefined
      const resolved: MarketConfig = {
        profile: config?.profile ?? launched?.name ?? argvProfile() ?? 'web',
        ...(useLaunchedDir ? { profileDirectory: launched.dir } : {}),
        origin: {
          profileSource: config?.profile !== undefined ? 'configured (cordis.yml)'
            : launched !== undefined ? 'launcher profileContext'
            : argvProfile() !== undefined ? '--profile flag'
            : 'default (no configured profile, no launcher profileContext, no --profile flag)',
          launcherAtStart: describeProfileContext(profileContext),
          launcherNow: () => describeProfileContext(ctx.get('profileContext')),
        },
        // Left UNDEFINED when unconfigured, deliberately: `?? true` here
        // would turn "the operator said nothing" into "the operator said
        // yes", and restartAllowed() could no longer tell them apart — which
        // is exactly the distinction supervisor detection needs (#229).
        allowRestart: config?.allowRestart,
        maxSnapshots: config?.maxSnapshots,
        // Build-time environment (#336); undefined means "inherit", and the
        // settings wiring below is what makes it editable at runtime.
        buildEnv: config?.buildEnv,
      }
      // Web settings may control restart; Desktop only registers the card's
      // namespace below. Both no-op on a host without a settings service.
      installMarketSettings(ctx, resolved)
```

</details>

**依据 7 · 作者声明**：[README.md:12-14](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/README.md#L12-L14)

同一目录可作为原生Discover索引，基本查找不是独占。

```text
The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 8 · 作者声明**：[README.md:60-65](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/README.md#L60-L65)

作者最低web版本声明不等于真实宿主验收。

```text

**Requires dsh web 0.1.0-rc.6 or newer.** On an older host the market
disables itself and says so in the browser console rather than rendering
against primitives that are not there — if the Plugin Market entry never
appears, that is usually why. Worth checking when a desktop build bundles
its own dsh: it may be older than the one `npm` would give you (#139).
```

#### 缺口

- 没有同版本维护者访谈或原生Discover/CLI同任务对照。
  **影响**：重复摩擦与收益成立程度依使用者承担恢复责任的条件，不能保证普遍值得安装。
  **进一步探讨**：固定相同插件组比较安装、禁用、更新与故障恢复的完成率及人工分钟。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 从选目录条目到安装、更新和卸载，实际写入与成功判据是什么？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

客户端 doInstall 真正 POST url、可选 force/version 和 busyPolicy 到安装路由。路由要求 POST/sameOrigin，持有变更锁后重新 loadRegistry，按 URL 找条目并解析目标，目录外或来源不支持即拒绝；不是浏览器直接任意执行包命令。延迟排空的 probe/execute 对精确目标生成意图，无法固定或等待后变化会拒绝；普通即时安装有自己的版本/来源回退，不能把延迟路径的精确目标保证外推所有安装。

普通宿主的 commands 默认 runDshPlugin，经恢复 wrapper 后实际 spawn dsh plugin --profile … add，带 env/cwd、输出和超时/取消跟踪。安装失败且非取消/非已落盘端口碰撞时恢复 manifest/锁文件；特定缺 tarball integrity 的即时路径可退源码，延迟固定制品不允许这样换目标。成功后还按新增包差异验证 DSH manifest、可加载入口和既有 entry ID 冲突，不可用项触发 removeAndReconcile。集合只要仍有可保留项就可返回成功，故须核 removedBroken/conflicts 和实际激活，不把总 ok 当每个组件通过。移除清理也可能失败：盘上已消失则清悬空声明，仍存在则保留声明供重试。

代表更新路径先卸载已有热挂载，执行 addArgs，失败按已捕获回滚来源、锁文件与可加载入口分支处理；Desktop manager 未结束时不继续抢锁恢复，而安排重启修复。卸载路径检查用户 patch insert 引用，确切引用不能 force 跳过；但“有 Agent 运行”在普通路径允许 confirmAgentsRunning:true 覆盖，这个字段不是安全隔离。卸载实际先记行日志再 remove，非取消失败且包已不在盘上会按磁盘修 manifest；取消仍保留差异。这些变更会执行第三方包代码并改 profile，目录成员和可加载入口不是代码安全审计。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MarketSection.tsx:4302-4328](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/client/MarketSection.tsx#L4302-L4328)

真实安装POST与url/force/version/drain参数。

<details>
<summary>查看原文（27行）</summary>

```text
  const doInstall = useCallback((plugin: RegistryPlugin, force = false, version?: string, preferReject = false) => {
    setBuildsSkipped(null)
    setConfirming(null)
    setInstallError(null)
    setActivationWarnings([])
    setBusyUrl(plugin.url)
    // One record per attempt. A retry appends rather than reusing the old
    // one, so the card resolves to the newest and its Install button returns.
    const recordId = nextRecordId()
    setRecords(list => enqueue(list, {
      id: recordId, kind: 'install', name: plugin.name, url: plugin.url, state: 'running',
    }))
    sessionStorage.setItem('dshm-pending', JSON.stringify({ url: plugin.url, name: plugin.name }))
    fetch(api('/dsh-market/install'), {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      // `version` when the refusal dialog found a release this host supports:
      // the route pins THAT release instead of resolving the newest one —
      // which is the release that was just refused (#581).
      body: JSON.stringify({
        url: plugin.url,
        ...(force ? { force: true } : {}),
        ...(version !== undefined ? { version } : {}),
        ...(statusRef.current.agentDrain && !preferReject ? { busyPolicy: 'drain' } : {}),
      }),
    })
      .then(res => res.json().then(body => ({ status: res.status, body })))
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7480-7530](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7480-L7530)

安装method/origin、锁与重新读取目录和来源。

<details>
<summary>查看原文（51行）</summary>

```text
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }
        try {
          const body = (await readJsonBody(request)) as {
            url?: unknown
            force?: unknown
            version?: unknown
            busyPolicy?: unknown
          }
          const drainCall = drainCallOf(request)
          if (drainCall === undefined && body.busyPolicy === 'drain') {
            const requestedUrl = typeof body.url === 'string' ? body.url : ''
            await handleDrainRequest(
              response,
              request,
              'install',
              body as Record<string, unknown>,
              requestedUrl === '' ? 'install' : requestedUrl,
              requestedUrl === '' ? undefined : requestedUrl,
            )
            return
          }
          await withMutationLock(response, 'install', async () => {
            const force = body.force === true
            const url = typeof body.url === 'string' ? body.url : ''
            // A release the user picked from the refusal dialog's own search
            // (#581): it was confirmed compatible by /dsh-market/find-compatible,
            // so it is pinned below instead of resolving `latest` again.
            const requestedVersion = typeof body.version === 'string' && /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(body.version)
              ? body.version
              : null
            const registry = await loadRegistry()
            const entry = registry.plugins.find(p => p.url.toLowerCase() === url.toLowerCase())
            if (entry === undefined) {
              logEvent('warn', 'install-rejected', `not in curated registry: ${url.slice(0, 120)}`)
              sendJson(response, 400, { error: 'plugin is not in the curated registry' })
              return
            }
            const plainTarget = installTargetFor(entry)
            if (plainTarget === null) {
              sendJson(response, 400, { error: 'unsupported source url' })
              return
            }
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:7682-7737](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7682-L7737)

延迟精确意图重比、快照与实际add。

<details>
<summary>查看原文（56行）</summary>

```text
              // Only a deferred operation needs an immutable target. The
              // inline path runs immediately, exactly like an ordinary
              // install, so a registry that cannot pin a version must not
              // turn into a refusal there.
              if (drainCall.role === 'probe' || drainCall.expected !== null) {
                const exact = NPM_NAME_RE.test(plainTarget)
                  ? requestedVersion !== null || registryLatest !== null
                  : /^https?:|^file:/i.test(target)
                    || githubCommitOfTarget(target) !== null
                    || gitCommitOfTarget(target) !== null
                if (!exact) {
                  sendJson(response, 409, {
                    targetChanged: true,
                    error: '无法确认这次要装的精确版本，因此不会在等待后执行。请刷新市场后重新选择。 / The exact release could not be verified, so it will not run after waiting. Refresh the market and choose again.',
                  })
                  return
                }
              }
              const intent: DrainIntent = { kind: 'install', name: entry.name, url, expected: { target } }
              if (drainCall.role === 'probe') {
                drainCall.onIntent(intent)
                sendJson(response, 200, { ok: true, drainPreflight: true })
                return
              }
              if (drainCall.expected !== null && !drainIntentMatches(drainCall.expected, intent)) {
                sendJson(response, 409, {
                  targetChanged: true,
                  error: '等待期间要安装的版本或来源变了，没有执行安装。请重新确认后再试。 / The release or source to install changed while waiting; nothing was installed. Confirm it again and retry.',
                })
                return
              }
            }
            pendingRollbacks.clear()
            const compatibilityBefore = assessProfile(config.profile, activeProfileDir)
            // pnpm re-extracts the whole tree on any operation, so a plugin
            // nobody touched can come back pristine-and-broken, or lose a
            // patch that was holding it together (#222). Only what THIS run
            // broke is attributable to it, so the profile is swept before as
            // well as after.
            const bundlesBefore = brokenClientBundles(config.profile, activeProfileDir)
            // Exact manifest snapshot for failure rollback (#65, #339): the
            // host writes dependencies and dsh.profile.bundles before the
            // build-script check / registry fetches run. Either residue can
            // break every later operation or the next boot. Cancelled runs
            // keep their partial state on purpose (the user sees the diff
            // and decides).
            const manifestBefore = readProfileManifestSnapshot(config.profile, activeProfileDir)
            // The lockfile too (#701): pnpm writes it before it links, so a
            // run that dies in between — a native crash, a kill — leaves a
            // lock that names a package the manifest never got. The update
            // route has always restored both; a fresh install restored only
            // the manifest and left the half for the next pnpm run to trip on.
            const lockfileBefore = captureProfileLockfile()
            const pinned = target === pinnedTarget && pinnedTarget !== plainTarget
            if (!assertDrainMutation(request, response)) return
            let result = await (pinned ? runPluginKeepingReleaseAge : runPlugin)(config.profile, ['add', target])
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:1480-1487](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L1480-L1487)

实际commands.runPlugin包装，不仅声明接口。

```text
  const runPlugin = (profile: string, args: string[], preserveProfilePolicy = false) =>
    withHoistRecovery(commands.runPlugin, profile, args, activeProfileDir, { marketFlags, preserveProfilePolicy, ...(preserveProfilePolicy ? { releaseAgeBypass: false } : {}) })
  /** The same, minus the release-age bypass: for a fresh install pinned to a young release (#594). */
  const runPluginKeepingReleaseAge = (profile: string, args: string[]) =>
    withHoistRecovery(commands.runPlugin, profile, args, activeProfileDir, { releaseAgeBypass: false, marketFlags })
  /** Mature npm updates must preserve both release-age enforcement and profile policy files. */
  const runMaturePluginUpdate = (profile: string, args: string[]) =>
    withHoistRecovery(commands.runPlugin, profile, args, activeProfileDir, { releaseAgeBypass: false, marketFlags, preserveProfilePolicy: true })
```

**依据 5 · 源码核查**：[src/routes.ts:564-567](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L564-L567)

普通宿主commands默认runDshPlugin。

```text
  // re-applies the same choice on every boot (ported from dsh-plugin-hub).
  const userPatchPath = findUserPatchPath(host, activeProfileDir)
  const commands: PluginCommandRuntime = commandRuntime ?? { runPlugin: runDshPlugin, probePnpm, provisionPnpm, cancelActive }

```

**依据 6 · 源码核查**：[src/dsh-cli.ts:1345-1381](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/dsh-cli.ts#L1345-L1381)

真实spawn dsh plugin/profile参数与进程超时。

<details>
<summary>查看原文（37行）</summary>

```text
/** Run one `dsh plugin --profile <p> …` command with timeout and progress tracking. */
export function runDshPlugin(profile: string, pluginArgs: string[]): Promise<InstallResult> {
  const { file, args, cwd, viaShell } = dshArgv()
  if (viaShell && !isCmdSafeProfileName(profile)) {
    const error = `dsh-market: profile name ${JSON.stringify(profile)} cannot cross the Windows cmd.exe fallback safely; relaunch DSH through its Node entry point, or use a profile name containing only letters, numbers, spaces, dots, underscores, and hyphens`
    logEvent('error', 'install', error)
    return Promise.resolve({ exitCode: 1, timedOut: false, stdout: '', stderr: error, cancelled: false })
  }
  const prepared = preparePluginArgs(profileDir(profile), pluginArgs)
  if ('error' in prepared) {
    logEvent('error', 'install', prepared.error)
    return Promise.resolve({ exitCode: 1, timedOut: false, stdout: '', stderr: prepared.error, cancelled: false })
  }
  pluginArgs = prepared.args
  const tracker = beginProgress(prepared.target)
  const feed = makeProgressFeeder(tracker)
  return new Promise((resolvePromise) => {
    const child = spawnShim(file, [...args, 'plugin', '--profile', profile, ...pluginArgs], {
      cwd,
      // pnpm v10 blocks forever on a silent interactive prompt without a TTY
      // (observed on re-add over a pinned git spec); CI mode forces it to act
      // or fail instead of asking.
      env: { ...spawnEnv(), ...pnpmConfigEnvForArgs(pluginArgs) },
      stdio: ['ignore', 'pipe', 'pipe'],
      viaShell,
      // Own process group on POSIX so cancel/timeout can kill the whole
      // tree (dsh wrapper + pnpm grandchild) with one group signal.
      detached: process.platform !== 'win32',
    })
    activeChild = child
    cancelRequested = false
    let stdout = ''
    let stderr = ''
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      killTree(child)
```

</details>

**依据 7 · 源码核查**：[src/routes.ts:7807-7881](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7807-L7881)

固定延迟制品不换来源、失败恢复、盘面校验和部分成功。

<details>
<summary>查看原文（75行）</summary>

```text
            // A deferred drain operation approved one exact artifact. Falling
            // back to the repository source would install a different one
            // after the wait. An inline drain (no Agent was running) is the
            // ordinary install path and keeps the fallback.
            const deferredArtifact = drainCall?.role === 'execute' && drainCall.expected !== null
            if ((result.exitCode !== 0 || result.timedOut) && !result.cancelled && !deferredArtifact) {
              const sourceTarget = sourceFallbackFor(entry, target)
              const failure = sourceTarget === null
                ? null
                : classifyPnpmFailure(`${result.stderr}\n${result.stdout}`, result.exitCode)
              if (sourceTarget !== null && failure?.code === 'missing-tarball-integrity') {
                logEvent('warn', 'install', `${entry.name}: pnpm could not verify the prebuilt release archive (no integrity recorded) — installing from the GitHub source instead (#797)`)
                restoreProfileManifest(config.profile, manifestBefore, activeProfileDir)
                if (lockfileBefore.ok) restoreProfileLockfile(lockfileBefore.snapshot)
                target = await acceleratedTarget(sourceTarget, region)
                if (!assertDrainMutation(request, response)) return
                result = await runPlugin(config.profile, ['add', target])
              }
            }
            drainPhaseOf(request)?.('verifying')
            const cancelled = result.cancelled
            const portCollisionLanded = !cancelled
              && isHostPortCollision(result)
              && installApplied(config.profile, before, activeProfileDir)
            if ((result.exitCode !== 0 || result.timedOut) && !cancelled && !portCollisionLanded) {
              const rolledBack = restoreProfileManifest(config.profile, manifestBefore, activeProfileDir)
              if (rolledBack.length > 0) logEvent('warn', 'install', `${target}: rolled back manifest residue of the failed run: ${rolledBack.join(', ')}`)
              if (lockfileBefore.ok) {
                const lock = restoreProfileLockfile(lockfileBefore.snapshot)
                if (!lock.ok) logEvent('warn', 'install', `${target}: could not restore pnpm-lock.yaml after the failed run: ${lock.detail ?? 'unknown'}`)
              }
            }
            let ok = (result.exitCode === 0 && !result.timedOut && !cancelled) || portCollisionLanded
            if (portCollisionLanded && result.exitCode !== 0) {
              logEvent('info', 'install', `${target}: command exited after the host port was already in use; the new plugin is on disk, treating as success (#975)`)
            }
            const cancelDiff = cancelled ? changedSince(beforeSpecs) : null
            if (ok) invalidateUpdates()
            if (ok) {
              // Collection repos (e.g. skin monorepos) install as a junk
              // fileset with no root package.json; retarget to the real
              // plugin subdirectories via pnpm's #path: selector.
              if (!assertDrainMutation(request, response)) return
              ok = await retargetCollections(runPlugin, config.profile, before, target, activeProfileDir)
            }
            // Fake-success guard (#18): a clean exit that added nothing
            // installable must not read as success. Runs even when
            // retargeting partially failed — a broken piece that slipped in
            // must never survive to brick the next boot.
            let notAPlugin = false
            // pnpm exited 0 and the profile did not change at all — a
            // different failure from "what it added was unusable" (#258).
            let addedNothing = false
            let removedBroken: string[] = []
            let conflicts: { name: string; id: string; owner: string }[] = []
            if ((result.exitCode === 0 || portCollisionLanded) && !cancelled) {
              if (!assertDrainMutation(request, response)) return
              const validated = await validateAddedPlugins(runPlugin, config.profile, before, activeProfileDir)
              removedBroken = validated.removedBroken
              conflicts = validated.conflicts
              if (removedBroken.length > 0) {
                logEvent('warn', 'install', `${target}: removed uninstallable pieces (no dsh manifest or missing build artifacts): ${removedBroken.join(', ')}`)
              }
              if (validated.keep.length === 0) {
                ok = false
                notAPlugin = true
                addedNothing = validated.added.length === 0
                logEvent('error', 'install', addedNothing
                  ? `${target}: the plugin command reported success but added nothing to the profile`
                  : `${target}: nothing installable survived validation (added: ${validated.added.join(', ')})`)
              } else {
                // Partial success across a collection still counts as success.
                ok = true
              }
            }
```

</details>

**依据 8 · 源码核查**：[src/install.ts:843-879](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/install.ts#L843-L879)

真实新增包manifest/入口/冲突验证及删除调用。

<details>
<summary>查看原文（37行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
}
```

</details>

**依据 9 · 源码核查**：[src/install.ts:903-923](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/install.ts#L903-L923)

实际删除后按磁盘存在性修manifest，失败仍可留包。

<details>
<summary>查看原文（21行）</summary>

```text
  const result = await run(profile, ['remove', name])
  const gone = !existsSync(join(dir, 'node_modules', name, 'package.json'))
  if (gone) {
    removeDanglingHostBridge(name, dir, hostDirectory)
    if (dropFromManifest(profile, name, dir)) {
      logEvent('error', 'install',
        `${name}: remove ${result.exitCode === 0 ? 'skipped the manifest reconcile' : `failed (exit ${String(result.exitCode)})`} but the package is gone from disk — dropped its dependency/bundle rows so the next boot stays loadable`)
    }
    return
  }
  if (result.exitCode !== 0 || result.timedOut || result.cancelled) {
    logEvent('error', 'install',
      `${name}: remove failed (exit ${String(result.exitCode)})${result.timedOut ? ' timed out' : ''}${result.cancelled ? ' cancelled' : ''} and the package is still installed — its rows stay in the manifest; retry the uninstall`)
  }
}

/**
 * The node_modules root of the DSH host deployment `directory` belongs to.
 *
 * CLI layouts install the host as `<prefix>/node_modules/@deepseek-ai/dsh`,
 * so the shared root is two dirname steps up; a flat Desktop layout keeps
```

</details>

**依据 10 · 源码核查**：[src/routes.ts:5728-5768](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L5728-L5768)

更新先处理热挂载再执行add，回滚helper按快照处理。

<details>
<summary>查看原文（41行）</summary>

```text
            // dropped: that is the one whose mount comes back on the next
            // start, and the one the report is about — the market re-adds a
            // newly enabled plugin to that list itself (#696). A mount with no
            // durable row behind it is the only thing keeping such a package
            // running, so this leaves it alone.
            if (listHotMounts().includes(name) && readProfileBundles(activeProfileDir).includes(name)) {
              const dropped = await hotUnmount(name)
              logEvent('info', 'update', `${name}: hot mount dropped before the files are replaced (#1022)${dropped ? '' : ' (no live handle)'}`)
            }
            // Even when a candidate was mature during validation, pnpm may
            // reject the operation because another lockfile entry is young or
            // the registry changes. Never retry this update with an age bypass.
            if (!assertDrainMutation(request, response)) return
            const result = await (enforceMatureReleaseAge ? runMaturePluginUpdate : runPlugin)(config.profile, addArgs)
            drainPhaseOf(request)?.('verifying')
            const cancelled = result.cancelled
            // The pin above is the market's own write, so it is undone whenever
            // pnpm did not replace it. Measured on pnpm 11.7.0 and 12.4.1, a
            // bare `add` of a floating git URL rewrites the manifest back to
            // the floating specifier as it re-resolves, which makes this a
            // no-op on every normal run. It is the safety net for the runs that
            // do not: a declaration left pinned to the old commit would
            // silently freeze a plugin the user believes is floating. Only that
            // one dependency is touched, so a bundle row the run legitimately
            // added is left alone.
            if (pinnedForIdentification
              && readProfileManifestSnapshot(config.profile, activeProfileDir).dependencies[name] === pinValue) {
              declareProfileDependency(config.profile, name, spec, activeProfileDir)
            }
            const rollbackAttemptBuild = async (): Promise<{ ok: boolean; detail: string | null }> => {
              if (rollbackPlan.available) {
                return executeUpdateRollback(name, manifestBefore, rollbackPlan.source, enforceMatureReleaseAge)
              }
              restoreProfileManifest(config.profile, manifestBefore, activeProfileDir)
              const lockRestore = rollbackPlan.lockfileBefore === undefined
                ? { ok: true, detail: null }
                : restoreProfileLockfile(rollbackPlan.lockfileBefore)
              return {
                ok: false,
                detail: lockRestore.ok ? rollbackPlan.detail : `${rollbackPlan.detail}; ${lockRestore.detail ?? 'the lockfile could not be restored'}`,
              }
```

</details>

**依据 11 · 源码核查**：[src/routes.ts:5872-5908](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L5872-L5908)

未结束manager及错误/忙/未写/取消等分支不能统一恢复。

<details>
<summary>查看原文（37行）</summary>

```text
            if (result.repairOnRestart === true) {
              // The manager stopped answering and may already have removed the
              // package. Restoring through it would block on the profile lock
              // it still holds, so the journal repairs the profile on the next
              // start instead (#928).
              logEvent('warn', 'update',
                `${name}: the desktop manager did not settle; the removal will be finished or undone on the next start`)
            }
            if ((result.exitCode !== 0 || result.timedOut) && !cancelled && result.busy !== true
              && !pnpmNeverStarted(result)
              // The manager never settled (#928): the profile may be
              // half-updated, and its write lock is still held by whatever
              // stopped answering. Nothing the route can do here can restore
              // it; the market's journal does that on the next start.
              && result.repairOnRestart !== true
              // The host refused before running pnpm (#897): nothing was
              // written, so there is nothing to restore — and the "could not
              // verify restoration, inspect this profile" warning this block
              // raises on a failed rollback would be alarm about an untouched
              // profile.
              && result.wroteNothing !== true
              // pnpm ran, then refused a too-young release without writing
              // (#919). Same untouched profile; skipping the rollback keeps
              // the release-age reason visible instead of covering it with a
              // false "restoration could not be verified" alarm.
              && !pnpmRefusedYoungRelease(result)
              // The child booted the profile again and lost the host port
              // AFTER pnpm wrote this update (#975). Rolling back would
              // undo a build that is already on disk.
              && !(isHostPortCollision(result) && updateApplied({
                profile: config.profile,
                name,
                isGit,
                beforeVersion,
                beforeCommit,
                spec,
                explicitDir: activeProfileDir,
```

</details>

**依据 12 · 源码核查**：[src/routes.ts:7175-7194](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7175-L7194)

用户patch insert拒绝卸载，而活动Agent确认字段可覆盖普通拒绝。

<details>
<summary>查看原文（20行）</summary>

```text
            if (userPatchReferences !== null && userPatchReferences.length > 0) {
              const listed = userPatchReferences.join(', ')
              logEvent('warn', 'uninstall-blocked', `${name}: user cordis.patch.yml still inserts ${listed}`)
              sendJson(response, 409, {
                error: `无法卸载 ${name}：当前 profile 的 cordis.patch.yml 仍通过 insert 引用 ${listed}。请先移除这些用户补丁引用再重试；市场不会自动改写用户补丁。 / Cannot uninstall ${name}: this profile's cordis.patch.yml still inserts ${listed}. Remove those user-owned patch references first and retry; the market will not rewrite the user patch automatically.`,
                userPatchReferenced: true,
                patchReferences: userPatchReferences,
              })
              return
            }
            const busyAgents = runningAgentsForGuard()
            if (busyAgents.length > 0 && body.confirmAgentsRunning !== true) {
              logEvent('warn', 'uninstall-blocked', `${name}: refused while agents are running — ${busyAgents.join(', ')}`)
              sendJson(response, 409, {
                error: `有 agent 正在运行（${busyAgents.join(', ')}）。卸载会修改插件文件，正在工作的 agent 可能在中途报错；请等它完成或取消后再卸载。 / ${busyAgents.length === 1 ? 'An agent is running' : 'Agents are running'} (${busyAgents.join(', ')}). Uninstalling changes plugin files, so a working agent can fail mid-turn; wait for it to finish (or cancel it) before uninstalling.`,
                agentsBusy: true,
                runningAgents: busyAgents,
              })
              return
            }
```

</details>

**依据 13 · 源码核查**：[src/routes.ts:7250-7288](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7250-L7288)

卸载真实journal→remove→磁盘半删除修复。

<details>
<summary>查看原文（39行）</summary>

```text
            // #987: the rows are journaled BEFORE the remove for the same
            // reason they are read before it — and because this process can be
            // unloaded in between (the official Desktop replays its plugin set
            // after a profile change), which used to leave an insert naming a
            // package that is no longer installed.
            const rowJournal = PendingRowJournal.forProfile(activeProfileDir)
            rowJournal.begin({ profile: config.profile, name, patchPath: userPatchPath, rows: ownedRows })
            if (!assertDrainMutation(request, response)) return
            const result = await runPlugin(config.profile, ['remove', name])
            drainPhaseOf(request)?.('verifying')
            const cancelled = result.cancelled
            let ok = result.exitCode === 0 && !result.timedOut && !cancelled
            const cancelDiff = cancelled ? changedSince(beforeInstalled) : null
            // Half-uninstall guard: pnpm can fail a remove AFTER deleting
            // node_modules but BEFORE saving package.json (#65's write-order
            // mirror image — a file locked mid-unlink aborts the run). The
            // manifest would then reference a package that no longer exists,
            // and the next boot fails to activate the ghost dependency.
            // Reconcile from disk truth: when the package is gone, finish
            // the removal the CLI could not; when it is intact, keep the
            // manifest so the user can simply retry.
            const halfGone = !ok && !cancelled
              && !existsSync(join(activeProfileDir, 'node_modules', name, 'package.json'))
            let reconciled = false
            if (halfGone) {
              reconciled = dropFromManifest(config.profile, name, activeProfileDir)
              logEvent('warn', 'uninstall', `${name}: remove failed (exit ${String(result.exitCode)}) but the package is gone from disk; ${reconciled ? 'reconciled manifest lists to match' : 'manifest lists already clean'}`)
              // Same disk truth, but the failure is the host port collision
              // after a successful remove (#975): report success so the
              // client does not treat a finished uninstall as a failure.
              if (isHostPortCollision(result)) ok = true
            }
            // The remove did not land and nothing half-gone was found: the
            // package (and its rows) are exactly as they were.
            if (!ok && !halfGone && !cancelled) rowJournal.finish(config.profile, name)
            let hot = false
            if (ok || halfGone) {
              invalidateUpdates()
              // #662: the removal is final (confirmed exit or reconciled
```

</details>

**依据 14 · 源码核查**：[src/dsh-cli.ts:1383-1425](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/dsh-cli.ts#L1383-L1425)

实际输出、error/close与timeout/cancelled结果返回。

````text
    child.stdout?.on('data', (chunk: Buffer) => {
      const text = chunk.toString()
      stdout = (stdout + text).slice(-256 * 1024)
      feed(text)
      syncProgress(tracker)
    })
    child.stderr?.on('data', (chunk: Buffer) => {
      const text = chunk.toString()
      stderr = (stderr + text).slice(-64 * 1024)
      feed(text)
      syncProgress(tracker)
    })
    child.on('error', (error) => {
      clearTimeout(timer)
      progress.active = false
      progress.cancelling = false
      if (activeChild === child) activeChild = null
      resolvePromise({ exitCode: 127, timedOut: false, stdout, stderr: `${stderr}\n${error.message}`, cancelled: false })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      // A timed-out run was killed hard, so the host's lock release in the
      // child's `finally` never ran. Clear only OUR child's lock (#914).
      if (timedOut) clearOwnedProfileLock(profile, child.pid)
      progress.active = false
      progress.cancelling = false
      if (activeChild === child) activeChild = null
      const failed = code !== 0 || timedOut
      if (failed) progress.error = tracker.snapshot.error
      const ignoredBuilds = tracker.snapshot.ignoredBuilds
      const { error: pnpmError, errorCode: pnpmErrorCode } = tracker.snapshot
      resolvePromise({
        exitCode: code,
        timedOut,
        stdout,
        stderr,
        cancelled: cancelRequested,
        ...(pnpmError !== null ? { pnpmError } : {}),
        ...(pnpmErrorCode !== null ? { pnpmErrorCode } : {}),
        ...(ignoredBuilds.length > 0 ? { ignoredBuilds } : {}),
      })
    })
  })
````

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 目录、兼容性和请求身份怎样限制执行，哪些情况仍会通过？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

目录 loadRegistry 逐源尝试，HTTP 路径仅同源 validator 可复用 304，npm 目录仅确认版本未变时复用数据；所有源失败会抛聚合错误，没有用打包老目录冒充新请求成功。但前端可以保留已有列表，不能从服务抛错推定旧 UI 已清空。安装再次查目录缩小了来源范围，不能证明收录者可信、仓库没变或构建脚本安全。

兼容拒绝明确只针对读到且不满足的声明；未声明、读取失败或未知宿主版本会继续，force 也有例外。因此卡片未知兼容不能当绿色保证，具体目标仍须固定版本核源码和宿主。依赖网络、目录镜像、包管理器与宿主的 profile 布局，不因作者说明支持 Desktop 就假定实际服务齐全。

普通宿主 registerRoute 统一先调用宿主 request gate；gate 抛错拒绝，但宿主没提供 gate 时 pass-through。Desktop 此包装刻意不套 gate，源码说真实会话行为未测。sameOrigin 另外检查 Host 在 loopback或信任列表、拒绝 sec-fetch-site:cross-site，但允许缺 Origin，且非浏览器可自己设置头，它不是调用者身份认证。普通路径与 Desktop 的外部请求保护必须按实际部署确认，不能将一个接口存在等同所有配置已强认证，也不能在隧道/公网环境只依赖市场自己的同源条件。

#### 证据与依据

**依据 1 · 源码核查**：[src/registry.ts:299-330](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/registry.ts#L299-L330)

来源绑定缓存；npm只有确认同版本才复用。

<details>
<summary>查看原文（32行）</summary>

```text
    // Two attempts each. A catalog fetch crossing a long, lossy path fails
    // transiently often enough that one retry is worth more than the second
    // or two it costs — and with nothing behind this call any more, a
    // transient failure is a market with no plugins in it.
    for (let attempt = 0; attempt < 2; attempt++) {
      attempts += 1
      try {
        // A validator only ever goes back to the source that issued it.
        // Carried across a region switch it could earn a "not modified" from
        // an origin whose body we have never seen.
        const reusable = served?.key === key ? served : null
        if (source.kind === 'npm') {
          const { version, data } = await catalogFromPackage(
            source.registry, source.pkg, reusable?.version ?? undefined,
          )
          // `data === null` means the published version is the one in hand.
          if (data === null && reusable !== null) return servedBy(reusable.data)
          if (data === null) throw new Error('the catalog package reported no change with nothing to reuse')
          const parsed = asRegistry(data)
          served = { key, etag: null, modified: null, version, data: parsed }
          return servedBy(parsed)
        }
        // ETag first: it is exact, while a date has one-second resolution and
        // a catalog republished twice within the same second would validate
        // as unchanged. Only one is sent — an origin given both must satisfy
        // both, which turns a weak ETag match into an unnecessary 200.
        const headers: Record<string, string> = {}
        if (reusable?.etag != null) headers['if-none-match'] = reusable.etag
        else if (reusable?.modified != null) headers['if-modified-since'] = reusable.modified

        // Headers and body run on different clocks. The fixed budget covers
        // only the wait for the response to START; the body itself is read
```

</details>

**依据 2 · 源码核查**：[src/registry.ts:344-372](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/registry.ts#L344-L372)

HTTP304条件、解析和全部源失败抛错。

<details>
<summary>查看原文（29行）</summary>

```text
        } finally {
          clearTimeout(headersDeadline)
        }
        if (res.status === 304) {
          // Only reachable when we sent a validator, so `reusable` is present.
          // Guarded anyway: answering a 304 with nothing to reuse would
          // otherwise surface as a confusing parse error on an empty body.
          if (reusable === null) throw new Error('the catalog answered "not modified" with nothing to revalidate')
          return servedBy(reusable.data)
        }
        if (!res.ok) throw new Error(`HTTP ${String(res.status)}`)
        const data = asRegistry(JSON.parse(new TextDecoder().decode(
          await readBodyWhileProgressing(res, BODY_STALL_TIMEOUT_MS),
        )))
        served = {
          key, etag: res.headers.get('etag'), modified: res.headers.get('last-modified'), version: null, data,
        }
        return servedBy(data)
      } catch (error) {
        last = error
        failures.push({
          source: sourceKey(source),
          reason: error instanceof Error ? error.message : String(error),
        })
      }
    }
  }
  throw new Error(describeFetchFailure(last, Date.now() - started, attempts, failures))
}
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:2482-2499](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2482-L2499)

只拒绝确认不满足的声明，unknown和force边界。

<details>
<summary>查看原文（18行）</summary>

```text
  /**
   * Pre-install host compatibility refusal, shared by the update route and
   * the fresh-install route (#404/#473 convention, extended to installs).
   *
   * Only a declaration that was READ and is not SATISFIED stops the
   * operation: undeclared, unreadable, and unknown host versions all pass
   * through (absence of a claim is not a verdict). `force` is the way past
   * a bundled host that misreports its version, exactly like the update
   * route. Returns true when a 400 has been sent and the caller must return.
   */
  async function refuseHostIncompatible(
    npmName: string | null,
    displayName: string,
    version: string | null,
    force: boolean,
    response: ServerResponse,
    region: Region,
    event: 'update-compat' | 'install-compat',
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:2553-2580](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2553-L2580)

统一请求gate和Desktop例外真实接线。

<details>
<summary>查看原文（28行）</summary>

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
  }

  const disposers = [
    registerRoute({
```

</details>

**依据 5 · 源码核查**：[src/http.ts:70-89](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/http.ts#L70-L89)

宿主未提供gate时不拒绝，gate异常403。

<details>
<summary>查看原文（20行）</summary>

```text
export function refuseUnadmitted(request: IncomingMessage, response: ServerResponse): boolean {
  const gate = requestGateSource()
  if (gate === undefined) return false
  let status: number | undefined
  try {
    status = gate(request)
  } catch {
    // A gate that throws has not admitted anything. Failing open here would
    // turn a host bug into the exposure this exists to close.
    status = 403
  }
  if (status === undefined) return false
  sendJson(response, status, {
    error: status === 401
      ? '需要先登录 DSH：请重新打开 dsh web 启动时打印的那个网址。 / DSH login required: reopen the URL dsh web printed at startup.'
      : '这个请求来自不受信任的地址，已拒绝。 / This request came from an untrusted origin and was refused.',
  })
  return true
}

```

</details>

**依据 6 · 源码核查**：[src/http.ts:213-248](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/http.ts#L213-L248)

Host/跨站/缺Origin处理，不等于非浏览器身份验证。

<details>
<summary>查看原文（36行）</summary>

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
```

</details>

**依据 7 · 源码核查**：[src/official-desktop.ts:484-500](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/official-desktop.ts#L484-L500)

运行时限定profile、并发，manager能力缺失即失败。

<details>
<summary>查看原文（17行）</summary>

```text
  const runPlugin: DesktopPluginRuntime['runPlugin'] = (profile, argv) => {
    if (disposed) return Promise.resolve(failure('official desktop plugin runtime is disposed', 127))
    if (profile !== profileName) return Promise.resolve(failure('refusing to change a different profile', 127))
    // A repair uses the same manager; overlapping the two would race the
    // profile's write lock and the route's single-operation rule.
    if (active !== undefined || repairing) return Promise.resolve({ ...failure('another plugin operation is running', 127), busy: true })
    const manager = managerLookup()
    if (manager === undefined
      || typeof manager.installBundle !== 'function'
      || typeof manager.removeBundle !== 'function'
      || typeof manager.cancelInstall !== 'function') {
      return Promise.resolve(failure(OFFICIAL_PAGE_HINT, 127))
    }

    // Market sends pnpm argv. Only operations representable by the official
    // manager are accepted; silently dropping pnpm flags would change intent.
    const [command, target, ...extra] = argv
```

</details>

**依据 8 · 源码核查**：[src/routes.ts:2500-2530](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2500-L2530)

实际force/未知host放行、读取manifest并仅incompatible拒绝。

<details>
<summary>查看原文（31行）</summary>

```text
  ): Promise<boolean> {
    if (force || npmName === null) return false
    const host = dshHostInfo()
    // No host version means nothing to compare against: deriveHostCompatibility
    // would answer `unknown` and pass anyway, so skip the manifest fetch
    // entirely (one less network round-trip, identical verdict).
    if (host?.version == null) return false
    // Advisory only: this runs before the operation is allowed to proceed, so
    // it must not seed the index the diagnostics panel reads from (#619). A
    // lookup that recorded here decided the panel's next verdict for it — a
    // failed pre-flight left a failure cooldown behind, and a successful one
    // pinned the version being installed, so the panel answered "unknown" or
    // the wrong version for a package it had never actually asked about.
    // Judge the release being installed, not `latest` (#581): a `latest` read
    // refuses the very version the compatibility dialog just resolved for this
    // host, and it would equally pass a pinned release that is itself
    // incompatible. `registryLatest` is fetched once here because the index
    // answer is also what tells us whether the pin IS the latest release — in
    // which case there is nothing extra to ask for.
    const registry = routesFor(region).npmRegistry
    const latest = (await discoveryManifests.lookup([npmName], registry, { record: false }))[npmName] ?? null
    const facts = version === null || latest?.version === version
      ? latest
      : await discoveryManifests.lookupVersion(npmName, version, registry)
    const verdict = deriveHostCompatibility(
      facts,
      host?.version ?? null,
      corePackageNames(host?.directory ?? null),
    )
    if (verdict.status !== 'incompatible') return false
    version = version ?? facts?.version ?? null
```

</details>

**依据 9 · 源码核查**：[src/client/MarketSection.tsx:3483-3516](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/client/MarketSection.tsx#L3483-L3516)

真实加载失败只设error，成功才更新cachedRegistry/data，不能推定错误清空旧列表。

````text
  const loadCatalog = useCallback(() => {
    setLoadError(null)
    return fetch(api('/dsh-market/registry'), { cache: 'no-store' })
      .then(async (res) => {
        const body = (await res.json().catch(() => ({}))) as {
          registry?: Registry
          hostVersion?: string | null
          error?: string
        }
        if (res.status === 404) {
          noteMarketGone()
          throw new Error(t('marketGoneTitle'))
        }
        if (!res.ok) throw new Error(typeof body.error === 'string' ? body.error : `HTTP ${String(res.status)}`)
        return body
      })
      .then((body) => {
        if (body.registry === undefined) throw new Error('the catalog response carried no data')
        if (body.registry.updated !== cachedRegistry?.updated) {
          resetScreenshotsCache()
          resetThemePreviewCache()
        }
        cachedRegistry = body.registry
        setData(body.registry)
        const catalogDate = body.registry.updated
        setCatalogUpdated(typeof catalogDate === 'string' && catalogDate.trim() !== '' ? catalogDate : null)
        setHostVersion(typeof body.hostVersion === 'string' ? body.hostVersion : null)
        setLoadError(null)
      })
      // Report WHY. An unreachable catalog used to be answered with a
      // bundled copy, so "cannot reach the registry" and "the catalog is
      // smaller today" looked identical on screen — and the second reading
      // is the one users reached.
      .catch((error: unknown) => { setLoadError(error instanceof Error ? error.message : String(error)) })
````

#### 缺口

- 未验证真实宿主gate、Desktop代理会话、联网目录和包来源的独立安全性。
  **影响**：只支持本地隔离试用；公网/隧道与高信任包操作不应由这些静态条件直接推荐。
  **进一步探讨**：在不含凭据的测试宿主核请求拒绝矩阵，另独立审计拟装包；需额外运行授权。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 并发、取消、备份恢复和重启后修复能覆盖到哪一层？

**研究主题**：功能与机制、工程质量与复用、缺陷与关键质疑

#### 完整回答

变更锁在市场进程内串行 mutation，drain 通过 WeakMap 保存内部 probe/execute 身份，客户端不能在普通 body 中冒充。排空协调器实际接 Agent created/disposed/status 和 commands.cancelActive；要求两种生命周期订阅都可用，在每次实际包命令前再枚举/claim Agent，存在 unheld、取消、服务不可用或 barrier broken 就拒绝。这不等于跨进程锁，也不限制用户外部终端同时改同一 profile。

维护 hold 丢失有条件处理：若 signal.reason.kind 为 disposed，代表会话关闭，删除hold并唤醒等待，不误取消包操作；其他丢失在 running/verifying 时打破 barrier 并请求取消。不能沿用“任何 hold 丢失都取消”的泛化。取消普通CLI会 killTree，Desktop交给 manager cancel；本地状态可能已经改变，安装/更新的取消故意让人看差异，不承诺事务回滚。

本地 restore 路由确实受同源与变更锁保护，调用 restoreBackup 后先逐文件恢复，再把目标既有依赖与备份合并、执行 install；restoreProfileBackup 验路径/父目录并 temp+rename，一旦异常按 previous 还原。这是每文件替换与补偿，非整个profile崩溃原子，也不备份任意外部插件副作用或保全所有凭据。restoreBackup 首次 install 失败后还会清空依赖逐个重装，部分成功时返回 errors 并保留可装项，全部失败才回滚；因此HTTP ok或文件恢复完成也不等于备份全部恢复。本轮不审云上传备份链。

drain.ndjson 明确只存终态报告，等待操作不跨宿主重启复活。它与另一条 Desktop interrupted-update journal 不同：当前入口启动定时调用 repairPendingUpdates，runtime 确实交给 repairInterruptedUpdates；后者按实际安装版本判断，三次尝试后放弃自动修复，需要人工处理，不能写成所有操作没有持久恢复，也不能承诺任意重启都自愈。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:568-584](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L568-L584)

内部probe/execute只绑定真实request对象的WeakMap。

<details>
<summary>查看原文（17行）</summary>

```text
  /**
   * Internal roles for one in-memory replay of a mutating route.
   *
   * `probe` runs the route's ordinary validation only, ending at the boundary
   * just before the first destructive step; it must not mutate anything.
   * `execute` runs that same route for real. The role lives on the replay
   * request object, so a public request can never claim either role.
   */
  type DrainCall =
    | { role: 'probe'; onIntent: (intent: DrainIntent) => void }
    | { role: 'execute'; expected: DrainIntent | null; onPhase?: (phase: 'verifying') => void }
  const drainCalls = new WeakMap<IncomingMessage, DrainCall>()
  const drainCallOf = (request: IncomingMessage): DrainCall | undefined => drainCalls.get(request)
  const drainPhaseOf = (request: IncomingMessage): ((phase: 'verifying') => void) | undefined => {
    const call = drainCallOf(request)
    return call?.role === 'execute' ? call.onPhase : undefined
  }
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:590-620](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L590-L620)

排空实际Agent事件与cancelActive接线。

<details>
<summary>查看原文（31行）</summary>

```text
  const drainJournal = new DrainJournal(join(activeProfileDir, '.dsh-market', 'drain.ndjson'))
  const drainCoordinator = new DrainCoordinator({
    host: {
      list: () => {
        const service = agentsLookup?.()
        if (service === undefined) return null
        try {
          const listed = service.list()
          return Array.isArray(listed) ? listed : null
        } catch {
          return null
        }
      },
      onCreated: listener => host.on?.('agent/created', payload => {
        const agent = agentFromEvent(payload)
        if (agent !== undefined) listener(agent)
      }) ?? null,
      onDisposed: listener => host.on?.('agent/disposed', payload => {
        const agent = agentFromEvent(payload)
        if (agent !== undefined) listener(agent)
      }) ?? null,
      onStatus: listener => host.on?.('agent/status', payload => {
        const agent = agentFromEvent(payload)
        if (agent !== undefined) listener(agent, (payload as { status?: unknown }).status)
      }) ?? null,
    },
    journal: drainJournal,
    bootId: BOOT_ID,
    log: (level, event, detail) => logEvent(level, event, detail),
    abortMutation: () => commands.cancelActive(),
  })
```

</details>

**依据 3 · 源码核查**：[src/routes.ts:950-990](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L950-L990)

实际变更锁和排空保留lane，不是UI busy标记。

<details>
<summary>查看原文（41行）</summary>

```text
  async function withMutationLock<T>(
    response: ServerResponse,
    kind: 'install' | 'write',
    fn: () => Promise<T> | T,
    request?: IncomingMessage,
  ): Promise<T | null> {
    const drainCall = request === undefined ? undefined : drainCallOf(request)
    // A probe runs the ordinary validation without touching the mutation
    // lane: it will not mutate, and the operator it is probing for has not
    // been accepted yet. It still reports `/status.busy`: a registry or Git
    // resolution can take seconds, and an idle-looking Host would let the
    // client declare the install dead and send a second request.
    if (drainCall?.role === 'probe') {
      preflightActive += 1
      try {
        return await fn()
      } finally {
        preflightActive -= 1
      }
    }
    const drainReserved = drainCoordinator.hasActive() && drainCall?.role !== 'execute'
    if (mutationBusy || drainReserved) {
      sendJson(response, 409, {
        // The long-standing lock response stays byte-identical for ordinary
        // contention; the drain reservation is the one callers can tell apart.
        ...(drainReserved ? { failureCode: 'OPERATION_BUSY' } : {}),
        error: kind === 'install' ? 'another install is already running' : 'another plugin operation is running',
      })
      return null
    }
    mutationBusy = true
    if (kind === 'install') installing = true
    else writing = true
    try {
      // FR-5: the lock is the serialization boundary, not the admission
      // barrier. Re-enumerate once more while holding it, before the executor
      // can start, so an Agent created without a delivered event is either
      // claimed now or stops the operation with no file change.
      if (drainCall?.role === 'execute') {
        const gate = drainCoordinator.assertCanMutate()
        if (!gate.ok) {
```

</details>

**依据 4 · 源码核查**：[src/drain.ts:307-322](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain.ts#L307-L322)

创建/销毁订阅先建立且两者必须存在。

<details>
<summary>查看原文（16行）</summary>

```text
    this.log = options.log ?? (() => {})
    this.abortMutation = options.abortMutation
    // Subscribe before the first inventory snapshot (FR-4). A host without
    // both events cannot close the creation race, so drain stays unsupported.
    const created = this.host.onCreated(agent => this.onAgentCreated(agent))
    const disposed = this.host.onDisposed(agent => this.onAgentDisposed(agent))
    if (created !== null) this.subscriptions.push(created)
    if (disposed !== null) this.subscriptions.push(disposed)
    this.subscribed = created !== null && disposed !== null
    const status = this.host.onStatus?.((agent, next) => this.onAgentStatus(agent, next)) ?? null
    if (status !== null) this.subscriptions.push(status)
  }

  /** Whether one deferred or running operation owns the lane. */
  hasActive(): boolean {
    return this.active !== null && !this.active.settled
```

</details>

**依据 5 · 源码核查**：[src/drain.ts:337-357](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain.ts#L337-L357)

实际mutation前重枚举、claim与拒绝条件。

<details>
<summary>查看原文（21行）</summary>

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

```

</details>

**依据 6 · 源码核查**：[src/drain.ts:865-885](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain.ts#L865-L885)

disposed例外和真正hold丢失时abortMutation。

<details>
<summary>查看原文（21行）</summary>

```text
  private onHoldLost(hold: Hold, reason?: unknown): void {
    if (this.holds.get(hold.id) === hold) this.holds.delete(hold.id)
    // A session being closed is not a session starting work (#1111). Its hold
    // ends here; the disposal event that follows finds nothing left to release.
    if (reason !== null && typeof reason === 'object'
      && (reason as { kind?: unknown }).kind === 'disposed') {
      this.notifyActivity()
      return
    }
    const active = this.active
    if (active === null || active.settled) {
      this.notifyActivity()
      return
    }
    if (active.state === 'running' || active.state === 'verifying') {
      // The package command is already replacing files. Stop it rather than
      // leaving a turn running against them; the operation reports failure.
      this.barrierBroken = true
      this.abortMutation?.()
      this.log('error', 'drain', 'maintenance hold was lost during the package operation; aborting it')
    }
```

</details>

**依据 7 · 源码核查**：[src/dsh-cli.ts:816-827](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/dsh-cli.ts#L816-L827)

真实取消Desktop或子进程；不是文件回滚。

<details>
<summary>查看原文（12行）</summary>

```text
export function cancelActive(): boolean {
  if (activeDesktopOperation !== null) {
    activeDesktopOperation.userCancelled = true
    progress.cancelling = true
    activeDesktopOperation.cancel()
    return true
  }
  if (activeChild === null) return false
  cancelRequested = true
  progress.cancelling = true
  killTree(activeChild)
  return true
```

</details>

**依据 8 · 源码核查**：[src/routes.ts:3057-3077](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L3057-L3077)

本地restore的method/origin/锁和restoreBackup真实caller。

<details>
<summary>查看原文（21行）</summary>

```text
    registerRoute({
      kind: 'exact',
      path: '/dsh-market/restore',
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) return sendJson(response, 403, { error: 'untrusted origin' })
        try {
          const body = await readJsonBody(request, MAX_BACKUP_BYTES + 4096) as { backup?: unknown }
          await withMutationLock(response, 'install', async () => {
            pendingRollbacks.clear()
            sendJson(response, 200, { ok: true, ...await restoreBackup(body.backup) })
          })
        } catch (error) {
          sendJson(response, 400, { error: error instanceof Error ? error.message : String(error) })
        }
      },
    }),
```

</details>

**依据 9 · 源码核查**：[src/routes.ts:2102-2131](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2102-L2131)

restore先写再合并原manifest并执行install。

<details>
<summary>查看原文（30行）</summary>

```text
  async function restoreBackup(value: unknown): Promise<{ files: number; errors: { name: string; error: string }[]; unportable?: Array<{ name: string; spec: string }>; bootErrors?: string[] }> {
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
```

</details>

**依据 10 · 源码核查**：[src/backup.ts:212-247](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/backup.ts#L212-L247)

逐文件路径检查、temp rename和异常补偿。

<details>
<summary>查看原文（36行）</summary>

```text
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
  }
}

/** Create missing parents one level at a time and refuse existing symlinks. */
function ensureSafeParent(root: string, parent: string, backupPath: string): void {
  const relativeParent = relative(root, parent)
```

</details>

**依据 11 · 源码核查**：[src/drain-journal.ts:1-10](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain-journal.ts#L1-L10)

仅终态journal，不持久重放等待操作。

<details>
<summary>查看原文（10行）</summary>

```text
/**
 * Terminal-only journal for deferred plugin operations (#411).
 *
 * A deferred mutation is deliberately not durable across a Host restart: the
 * maintenance holds and the package command die with the process. What has to
 * survive is the *report* — "the install you started last time failed" — so a
 * user coming back after a restart is not left guessing. This file stores
 * exactly the bounded terminal facts: id, kind, package name, state, Agent
 * counts and time. No prompts, transcripts, tool input, environment values, or
 * paths.
```

</details>

**依据 12 · 源码核查**：[src/drain-journal.ts:95-115](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain-journal.ts#L95-L115)

实际append字段和磁盘写。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Append one terminal record; the in-memory copy survives a write failure. */
  append(record: DrainJournalRecord): void {
    const cleaned: DrainJournalRecord = {
      at: record.at,
      id: clean(record.id) ?? 'drain',
      kind: record.kind,
      name: clean(record.name) ?? 'plugin',
      state: record.state,
      agentsAtStart: Number.isFinite(record.agentsAtStart) ? record.agentsAtStart : 0,
      agentsAtEnd: Number.isFinite(record.agentsAtEnd) ? record.agentsAtEnd : 0,
    }
    this.records.push(cleaned)
    if (this.records.length > MAX_RECORDS) this.records.splice(0, this.records.length - MAX_RECORDS)
    mkdirSync(dirname(this.file), { recursive: true })
    // An interrupted write leaves a tail without its newline. Appending to it
    // would glue this record onto the damaged one, so the file would carry a
    // single unparseable line and BOTH would be lost on reopen — the record
    // this append just completed included (#1084). The damaged tail is
    // dropped by load() on its own; this only keeps the next record separate.
    appendFileSync(this.file, `${endsWithNewline(this.file) ? '' : '\n'}${JSON.stringify(cleaned)}\n`)
    if (existsSync(this.file) && statSync(this.file).size > this.maxBytes) this.trim()
```

</details>

**依据 13 · 源码核查**：[src/index.ts:328-339](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/index.ts#L328-L339)

Desktop入口实际定时启动中断更新修复。

<details>
<summary>查看原文（12行）</summary>

```text
        host.effect(() => {
          const restoreTrustedHosts = useTrustedHosts(ctx)
          const disposeRoutes = mountMarketRoutes(host, resolved, runtime, agentsLookupOf(ctx))
          const repairTimer = setTimeout(() => {
            void runtime.repairPendingUpdates().then(report => {
              if (report.reinstalled.length === 0 && report.failed.length === 0) return
              const abandoned = report.abandoned.length === 0
                ? ''
                : `, ${String(report.abandoned.length)} given up on after ${String(MAX_AUTO_REPAIR_ATTEMPTS)} starts — reinstall from Settings → Plugins: ${report.abandoned.join(', ')}`
              console.warn(`dsh-market: ${String(report.reinstalled.length)} interrupted update(s) reinstalled, ${String(report.failed.length)} still pending${abandoned}`)
            })
          }, PENDING_UPDATE_REPAIR_DELAY_MS)
```

</details>

**依据 14 · 源码核查**：[src/official-desktop.ts:624-637](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/official-desktop.ts#L624-L637)

实际runtime调用repairInterruptedUpdates。

<details>
<summary>查看原文（14行）</summary>

```text
  const repairPendingUpdates = async (): Promise<RepairReport> => {
    const empty: RepairReport = { reinstalled: [], finished: [], failed: [], abandoned: [] }
    if (disposed || repairing || active !== undefined) return empty
    const manager = managerLookup()
    if (manager === undefined || directory === undefined || journal === undefined) return empty
    repairing = true
    try {
      return await repairInterruptedUpdates({ profile: profileName, profileDirectory: directory, manager, journal })
    } catch (error) {
      console.warn('dsh-market: could not repair an interrupted update', error)
      return empty
    } finally {
      repairing = false
    }
```

</details>

**依据 15 · 源码核查**：[src/pending-updates.ts:353-374](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/pending-updates.ts#L353-L374)

达到上限放弃，否则按journal目标再调用manager。

<details>
<summary>查看原文（22行）</summary>

```text
    if (entry.attempts >= MAX_AUTO_REPAIR_ATTEMPTS) {
      // Not bumped: the count is already the reason this start does nothing,
      // and growing it would re-log the same sentence on every boot.
      if (entry.attempts === MAX_AUTO_REPAIR_ATTEMPTS) {
        logEvent('error', 'update-repair', gaveUpCopy(entry.name, entry.attempts))
      }
      report.failed.push({ name: entry.name, reason: gaveUpCopy(entry.name, entry.attempts) })
      report.abandoned.push(entry.name)
      continue
    }
    const spec = entry.to === '' ? entry.spec : `${entry.name}@${entry.to}`
    try {
      // The interrupted update may have died holding the profile lock; its
      // owner is gone by now, and without this the install below waits out
      // the whole timeout on every start.
      clearStaleProfileLock(options.profileDirectory)
      const result = await withDeadline(
        options.manager.installBundle(spec, { requestId: randomUUID() }),
        options.timeoutMs ?? REPAIR_INSTALL_TIMEOUT_MS,
        `reinstall ${spec}`,
      )
      if (!managerSucceeded(result)) {
```

</details>

**依据 16 · 源码核查**：[src/routes.ts:2136-2167](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2136-L2167)

恢复首次install失败后清空依赖并逐个add，可能保留部分成功。

<details>
<summary>查看原文（32行）</summary>

```text

      // A bad dependency makes pnpm abort the whole install. Retry from an
      // empty dependency list so one broken plugin cannot block the rest.
      // activeProfileDir, NOT profileDir(config.profile): in DSH Desktop the
      // profile directory is host-authoritative (#72) and the ambient
      // derivation would edit the WRONG profile's manifest.
      const manifestFile = join(activeProfileDir, 'package.json')
      const manifest = JSON.parse(readFileSync(manifestFile, 'utf8')) as {
        dependencies?: Record<string, string>
        dsh?: { profile?: { bundles?: string[] } }
      }
      const dependencies = Object.entries(manifest.dependencies ?? {})
      const desiredBundles = [...(manifest.dsh?.profile?.bundles ?? [])]
      const dependencyNames = new Set(dependencies.map(([name]) => name))
      manifest.dependencies = {}
      if (Array.isArray(manifest.dsh?.profile?.bundles)) {
        manifest.dsh.profile.bundles = desiredBundles.filter(bundle => !dependencyNames.has(bundle))
      }
      writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)
      const errors: { name: string; error: string }[] = []
      let installed = 0
      for (const [name, spec] of dependencies) {
        const target = /^(?:file|link|github|git\+|https?):/.test(spec) ? spec : `${name}@${spec}`
        try {
          const item = await runPlugin(config.profile, ['add', target])
          if (item.exitCode === 0 && !item.timedOut && !item.cancelled
            && existsSync(join(activeProfileDir, 'node_modules', name, 'package.json'))) {
            installed += 1
            if (desiredBundles.includes(name)) {
              const current = JSON.parse(readFileSync(manifestFile, 'utf8')) as typeof manifest
              current.dsh ??= {}
              current.dsh.profile ??= {}
```

</details>

**依据 17 · 源码核查**：[src/routes.ts:2178-2198](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L2178-L2198)

全部依赖失败才补偿回滚，返回errors/bootErrors；不能仅看HTTP ok。

<details>
<summary>查看原文（21行）</summary>

```text
        const current = JSON.parse(readFileSync(manifestFile, 'utf8')) as typeof manifest
        if (current.dependencies !== undefined) delete current.dependencies[name]
        writeFileSync(manifestFile, `${JSON.stringify(current, null, 2)}\n`)
      }
      if (installed === 0 && dependencies.length > 0) {
        restored.rollback()
      }
      invalidateUpdates()
      const bootErrors = restoredBootErrors()
      if (bootErrors.length > 0) {
        logEvent('warn', 'restore', `restored profile will not boot as-is — ${bootErrors.join('; ')}`)
      }
      return {
        files: restored.files,
        errors,
        unportable: unportableDeps(manifest.dependencies),
        ...(bootErrors.length > 0 ? { bootErrors } : {}),
      }
    } catch (error) {
      restored.rollback()
      throw error
```

</details>

**依据 18 · 源码核查**：[src/official-desktop.ts:380-424](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/official-desktop.ts#L380-L424)

Desktop已安装目标的remove-then-install与先记journal真实链。

<details>
<summary>查看原文（45行）</summary>

```text
  try {
    first = await install()
  } catch (error) {
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
    removed = await withDeadline(manager.removeBundle(name), REMOVE_DEADLINE_MS, `remove ${name}`)
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
    if (record !== undefined) context?.journal.finish(record.id)
    throw error
  }
  if (removed.application === 'failed' || removed.application === 'cancelled') {
    // Nothing was unloaded, so there is nothing for a later start to repair.
    if (record !== undefined) context?.journal.finish(record.id)
    return removed
  }
  if (record !== undefined) context?.journal.mark(record.id, 'installing')
  progress.lastLine = '正在安装新版本 / Installing the new version'
  try {
    const installed = await withDeadline(install(), INSTALL_DEADLINE_MS, `install ${spec}`)
    if (installed.application === 'failed' || installed.application === 'cancelled') {
      // The replacement did not land; the record stays so the next start can
      // put it back rather than leaving the package gone.
```

</details>

**依据 19 · 源码核查**：[src/pending-updates.ts:328-342](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/pending-updates.ts#L328-L342)

修复先按盘面版本与composed判断已完成，不一律覆盖。

<details>
<summary>查看原文（15行）</summary>

```text
 */
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
```

</details>

**依据 20 · 源码核查**：[src/pending-updates.ts:244-244](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/pending-updates.ts#L244-L244)

自动修复尝试上限实际常量为3。

````text
export const MAX_AUTO_REPAIR_ATTEMPTS = 3
````

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 维护者在什么条件下值得先试用，成本和退出怎样承担？

**研究主题**：效果与总成本、采用判断、依赖、兼容与流程

#### 完整回答

建议仅反复维护多个插件、能区分 Desktop/web 与备份 profile 的用户，在独立 profile 或可还原副本试一组非关键包。先确认宿主版本/真实路径、webServer/loader、所需 manager 或 CLI/pnpm、目录与包源可达；Drain 另需兼容 Agent 服务/事件。根包依赖 js-yaml/undici 和 Cordis，settings/schemastery为所列peer；这不是无需运行环境的纯网页。

首次成本包括装对profile、选择可信包、保存配置/锁/凭据和验证备份；持续要跟进目录/包/宿主变动、看兼容未知及部分激活结果。网络/磁盘和包自身模型或远端服务费未知，市场维护者的人工分钟也未知，不能把开源MIT理解为采用总成本零。不要在唯一本地生产profile、正在执行重要任务时直接批量升级。

试用顺序是单包安装→核来源/实际目录/激活→一次更新→一次卸载→故障恢复，再比较Discover/CLI。取消、部分成功、自动修复放弃或请求门不清时停止并人工核盘；退出市场前保留所装包清单/禁用patch及备份，移除市场不自动卸载其他插件、撤销凭据或证明恢复。收益未对照，当前只推荐有备份和修复能力者试用，不作持续安装推荐。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:39-60](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/package.json#L39-L60)

具体运行依赖、peer与web注入。

<details>
<summary>查看原文（22行）</summary>

```text
  "dependencies": {
    "js-yaml": "^4.3.2",
    "undici": "^7.29.1"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-settings": "^0.1.0-rc.7 || ^0.1.1-rc.2 || ^0.1.2-alpha.2 || ^0.2.0-rc.1 || ^0.2.1-alpha.3 || ^0.2.1-rc.1",
    "@deepseek-ai/schemastery": "^3.18.1"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-theme"
      ],
      "platform": "web"
    }
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:250-263](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/index.ts#L250-L263)

实际宿主服务前提。

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

**依据 3 · 源码核查**：[src/official-desktop.ts:484-500](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/official-desktop.ts#L484-L500)

Desktop缺能力或并发即拒绝。

<details>
<summary>查看原文（17行）</summary>

```text
  const runPlugin: DesktopPluginRuntime['runPlugin'] = (profile, argv) => {
    if (disposed) return Promise.resolve(failure('official desktop plugin runtime is disposed', 127))
    if (profile !== profileName) return Promise.resolve(failure('refusing to change a different profile', 127))
    // A repair uses the same manager; overlapping the two would race the
    // profile's write lock and the route's single-operation rule.
    if (active !== undefined || repairing) return Promise.resolve({ ...failure('another plugin operation is running', 127), busy: true })
    const manager = managerLookup()
    if (manager === undefined
      || typeof manager.installBundle !== 'function'
      || typeof manager.removeBundle !== 'function'
      || typeof manager.cancelInstall !== 'function') {
      return Promise.resolve(failure(OFFICIAL_PAGE_HINT, 127))
    }

    // Market sends pnpm argv. Only operations representable by the official
    // manager are accepted; silently dropping pnpm flags would change intent.
    const [command, target, ...extra] = argv
```

</details>

**依据 4 · 源码核查**：[src/routes.ts:7722-7737](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7722-L7737)

安装实际改profile并捕获manifest和lock。

<details>
<summary>查看原文（16行）</summary>

```text
            // Exact manifest snapshot for failure rollback (#65, #339): the
            // host writes dependencies and dsh.profile.bundles before the
            // build-script check / registry fetches run. Either residue can
            // break every later operation or the next boot. Cancelled runs
            // keep their partial state on purpose (the user sees the diff
            // and decides).
            const manifestBefore = readProfileManifestSnapshot(config.profile, activeProfileDir)
            // The lockfile too (#701): pnpm writes it before it links, so a
            // run that dies in between — a native crash, a kill — leaves a
            // lock that names a package the manifest never got. The update
            // route has always restored both; a fresh install restored only
            // the manifest and left the half for the next pnpm run to trip on.
            const lockfileBefore = captureProfileLockfile()
            const pinned = target === pinnedTarget && pinnedTarget !== plainTarget
            if (!assertDrainMutation(request, response)) return
            let result = await (pinned ? runPluginKeepingReleaseAge : runPlugin)(config.profile, ['add', target])
```

</details>

**依据 5 · 源码核查**：[src/routes.ts:7112-7144](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7112-L7144)

普通卸载不能用此入口删市场自身，仍有专门退出路径边界。

<details>
<summary>查看原文（33行）</summary>

```text
      path: '/dsh-market/uninstall',
      handler: async (request, response) => {
        if (request.method !== 'POST') {
          response.writeHead(405, { allow: 'POST' })
          response.end()
          return
        }
        if (!sameOrigin(request)) {
          sendJson(response, 403, { error: 'untrusted origin' })
          return
        }
        try {
          const body = (await readJsonBody(request)) as {
            name?: unknown
            force?: unknown
            confirmAgentsRunning?: unknown
            busyPolicy?: unknown
          }
          const name = typeof body.name === 'string' ? body.name : ''
          if (drainCallOf(request) === undefined && body.busyPolicy === 'drain') {
            await handleDrainRequest(response, request, 'uninstall', body as Record<string, unknown>, name)
            return
          }
          await withMutationLock(response, 'install', async () => {
            // Only the INDETERMINATE patch case is forceable, below. A patch
            // that definitely names the package stays refused: there the user
            // has a concrete thing to go fix, so an override would only help
            // them break their next boot.
            const force = body.force === true
            if (name === 'dsh-market' || name === 'dshmarket') {
              sendJson(response, 400, { error: 'the market cannot uninstall itself; use the dsh CLI' })
              return
            }
```

</details>

**依据 6 · 作者声明**：[README.md:100-106](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/README.md#L100-L106)

作者声明备份可能含凭据，不能把上传/保管成本省略。

```text
- Installs are restricted to sources listed in the curated [awesome-dsh-plugin](https://awesome-dsh-plugin.com) registry — anything else is rejected
- Build scripts stay blocked by default (pnpm ≥10); allowing one is your explicit per-package choice
- Terminal/CLI-surface plugins are flagged before you install them into the web profile
- The install endpoint accepts same-origin POST only; the market never phones home
- Backups can contain credentials from your profile config — the UI warns before export and upload; WebDAV sync is https-only, refuses private-network targets, and never stores your password in the browser
- Authenticated Gist requests always go directly to `api.github.com`; bearer tokens are never sent to a public GitHub acceleration service. GitHub source archives also stay on canonical codeload URLs so pnpm's integrity policy remains in force
- The restart endpoint additionally requires a direct loopback client (forwarded requests are rejected) and relaunches the exact DSH entry, arguments, environment, and working directory
```

#### 缺口

- 没有实际安装/禁用/卸载验收、同任务人工与现金成本、失败恢复计时。
  **影响**：采用收益和全周期负担仍不明确，不能推荐唯一生产profile持续安装。
  **进一步探讨**：记录相同插件组各步骤/修复分钟、网络存储和真实第三方费用，退出后核patch与运行状态。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 哪些贡献已成立，什么后续方向可被推翻？

**研究主题**：贡献与相对优势、新假设与验证

#### 完整回答

已成立的是源码层的操作治理组合：目录选择与实际变更相连，执行前后核profile/精确目标/盘面，部分失败和hold边界显式化，而不是只返回包管理器退出码。对比原生Discover同目录+CLI，这些检查可减少人重建状态的需要，但没有实际合格率/工时数据，不能声称已省时或改变团队分工。兼容unknown、显式活动Agent确认、取消残留和Desktop差异均限制增量。

候选生产方向是对一次插件变更提供可审查的“前状态→批准的精确目标→实际包/激活/配置差异→可执行恢复”收据，先在独立profile演练再让用户决定迁移。不是把已有离线composition trial、snapshot或Desktop修复换名当新功能，也未在本轮确认整套跨profile迁移已经实现。

最小比较：相同包组和缺入口、ID冲突、源版本漂移、取消、磁盘半删/manifest残留故障，使用当前市场+备份作为对照。核正确目标、可启动性、与原运行配置一致性、遗留状态和人工恢复分钟。若演练漏掉生产profile依赖、恢复源不可复现、自动收据比手工备份更误导或额外维护费超过减少的救援，就推翻，不扩大到自动批量治理。

#### 证据与依据

**依据 1 · 源码核查**：[src/install.ts:843-879](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/install.ts#L843-L879)

现有真实新增校验是候选基线而非未来发明。

<details>
<summary>查看原文（37行）</summary>

```text
export async function validateAddedPlugins(
  run: PluginRunner, profile: string, before: Set<string>, explicitDir?: string, hostDirectory?: string | null,
): Promise<{ added: string[]; keep: string[]; removedBroken: string[]; conflicts: { name: string; id: string; owner: string }[] }> {
  const dir = profileDir(profile, explicitDir)
  const addedNow = Object.keys(readInstalled(profile, dir)).filter(n => !before.has(n))
  const keep: string[] = []
  const removedBroken: string[] = []
  const conflicts: { name: string; id: string; owner: string }[] = []
  // Compare against what the profile already loads, minus this install's own
  // additions — two pieces of one plugin are not "already installed".
  const existingBundles = readProfileBundles(dir).filter(name => !addedNow.includes(name))
  for (const n of addedNow) {
    const packageDir = join(dir, 'node_modules', n)
    // hasLoadableEntry, not entryArtifactExists: carrier bundles legitimately
    // ship no entry of their own (#103) and must not be uninstalled here.
    // The host install tree is passed too (#906): a carrier mounting only
    // in-box packages resolves nowhere under the profile, and judging it by
    // that alone deleted a package the host had just installed correctly.
    if (!hasDshManifest(packageDir) || !hasLoadableEntry(dir, n, hostDirectory ?? findDshInstallDir())) {
      removedBroken.push(n)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    const clash = conflictingEntryIds(dir, n, existingBundles)
    if (clash.length > 0) {
      // Keeping it would make the NEXT BOOT fail outright (#122).
      conflicts.push(...clash.map(hit => ({ name: n, ...hit })))
      removedBroken.push(n)
      logEvent('error', 'install',
        `${n}: loader entry id conflict with ${clash[0].owner} (${clash.map(hit => hit.id).join(', ')}) — removing, it would break the next boot`)
      await removeAndReconcile(run, profile, dir, n, hostDirectory)
      continue
    }
    keep.push(n)
  }
  return { added: addedNow, keep, removedBroken, conflicts }
}
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7682-7719](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/routes.ts#L7682-L7719)

既有精确目标批准与等待后重比可作为变更收据基础。

<details>
<summary>查看原文（38行）</summary>

```text
              // Only a deferred operation needs an immutable target. The
              // inline path runs immediately, exactly like an ordinary
              // install, so a registry that cannot pin a version must not
              // turn into a refusal there.
              if (drainCall.role === 'probe' || drainCall.expected !== null) {
                const exact = NPM_NAME_RE.test(plainTarget)
                  ? requestedVersion !== null || registryLatest !== null
                  : /^https?:|^file:/i.test(target)
                    || githubCommitOfTarget(target) !== null
                    || gitCommitOfTarget(target) !== null
                if (!exact) {
                  sendJson(response, 409, {
                    targetChanged: true,
                    error: '无法确认这次要装的精确版本，因此不会在等待后执行。请刷新市场后重新选择。 / The exact release could not be verified, so it will not run after waiting. Refresh the market and choose again.',
                  })
                  return
                }
              }
              const intent: DrainIntent = { kind: 'install', name: entry.name, url, expected: { target } }
              if (drainCall.role === 'probe') {
                drainCall.onIntent(intent)
                sendJson(response, 200, { ok: true, drainPreflight: true })
                return
              }
              if (drainCall.expected !== null && !drainIntentMatches(drainCall.expected, intent)) {
                sendJson(response, 409, {
                  targetChanged: true,
                  error: '等待期间要安装的版本或来源变了，没有执行安装。请重新确认后再试。 / The release or source to install changed while waiting; nothing was installed. Confirm it again and retry.',
                })
                return
              }
            }
            pendingRollbacks.clear()
            const compatibilityBefore = assessProfile(config.profile, activeProfileDir)
            // pnpm re-extracts the whole tree on any operation, so a plugin
            // nobody touched can come back pristine-and-broken, or lose a
            // patch that was holding it together (#222). Only what THIS run
            // broke is attributable to it, so the profile is swept before as
```

</details>

**依据 3 · 源码核查**：[src/backup.ts:212-247](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/backup.ts#L212-L247)

当前逐文件补偿边界提供可证伪的恢复任务。

<details>
<summary>查看原文（36行）</summary>

```text
export function restoreProfileBackup(profile: string, value: unknown, explicitDir?: string): { files: number; rollback(): void } {
  const backup = validatedBackup(value)
  const root = resolve(explicitDir ?? profileDir(profile))
  const previous = new Map<string, Buffer | null>()
  mkdirSync(root, { recursive: true })
  const rollback = (): void => {
    for (const [target, content] of previous) {
      if (content === null) rmSync(target, { force: true })
      else writeFileSync(target, content)
    }
  }
  try {
    for (const file of backup.files) {
      const { path } = file
      const target = resolve(root, path)
      if (!target.startsWith(root + sep)) throw new Error(`unsafe backup path: ${path}`)
      ensureSafeParent(root, dirname(target), path)
      if (existsSync(target) && !lstatSync(target).isFile()) throw new Error(`backup path is not a file: ${path}`)
      previous.set(target, existsSync(target) ? readFileSync(target) : null)
      const temp = `${target}.dsh-restore-${String(process.pid)}`
      writeFileSync(temp, 'json' in file ? `${JSON.stringify(file.json, null, 2)}\n` : file.lines.join('\n'), 'utf8')
      renameSync(temp, target)
    }
  } catch (error) {
    rollback()
    throw error
  }
  return {
    files: previous.size,
    rollback,
  }
}

/** Create missing parents one level at a time and refuse existing symlinks. */
function ensureSafeParent(root: string, parent: string, backupPath: string): void {
  const relativeParent = relative(root, parent)
```

</details>

**依据 4 · 源码核查**：[src/drain.ts:865-885](https://github.com/dsh-market/dsh-market/blob/19641d22a69b63063bb9b67a5f67a0dcb72703a0/src/drain.ts#L865-L885)

有条件的hold丢失保护是必须保留的对照机制。

<details>
<summary>查看原文（21行）</summary>

```text
  private onHoldLost(hold: Hold, reason?: unknown): void {
    if (this.holds.get(hold.id) === hold) this.holds.delete(hold.id)
    // A session being closed is not a session starting work (#1111). Its hold
    // ends here; the disposal event that follows finds nothing left to release.
    if (reason !== null && typeof reason === 'object'
      && (reason as { kind?: unknown }).kind === 'disposed') {
      this.notifyActivity()
      return
    }
    const active = this.active
    if (active === null || active.settled) {
      this.notifyActivity()
      return
    }
    if (active.state === 'running' || active.state === 'verifying') {
      // The package command is already replacing files. Stop it rather than
      // leaving a turn running against them; the operation reports failure.
      this.barrierBroken = true
      this.abortMutation?.()
      this.log('error', 'drain', 'maintenance hold was lost during the package operation; aborting it')
    }
```

</details>

#### 缺口

- 未实现或运行整套跨profile变更收据/迁移对照。
  **影响**：这是未验证方向，不能计现有创新收益。
  **进一步探讨**：先以非敏感固定包故障集核收据与恢复是否更可靠，再决定是否实现。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
