# dsh-m 插件市场

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6cb4d21](https://github.com/iasiv5/dsh-m/tree/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/iasiv5/dsh-m) [![npm 30d 48,707](https://img.shields.io/static/v1?label=npm+30d&message=48%2C707&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-m) [![最新发布 2026-11-15](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-15&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-m)
<!-- END META -->

> **功能**：为 DSH Web 提供社区与精选插件目录、安装管理、Agent 工具和独立 CLI。

> **亮点**：将多来源目录浏览、风险提示与 profile 管理集中到 DSH 面板/工具/CLI；安全审核仍由使用者承担。[Q01](#research-q01) [Q03](#research-q03)

> **主要限制**：目录可信、peer 入参、安装后保护及恢复分别有条件。预检不可用可继续，回滚核对 profile 与依赖收敛，无法据此证明第三方安装脚本的外部状态已撤销。[Q02](#research-q02) [Q04](#research-q04)

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
  - [Q01 · 哪些 DSH 用户会从 dsh-m 得益，它提供的增量和发行边界是什么？](#detail-section-11)
  - [Q02 · 市场请求、配置与安装操作如何从 DSH Host 到生效 profile？](#detail-section-12)
  - [Q03 · 采用 dsh-m 的兼容、信任和目录风险由哪些前提约束？](#detail-section-13)
  - [Q04 · 它如何处理操作失败和运维成本，哪些收益仍无证据？](#detail-section-14)
  - [Q05 · 什么最小验证能决定是否采用市场插件？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：管理 DSH Web 插件目录与 profile 操作的用户，可由统一面板查询与维护；是否减负须实测。[Q01](#research-q01)

替代方式是官方 CLI 配置 profile、逐项查目录并自行核对插件版本和兼容性。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 主要用途 | 条件 |
| --- | --- | --- |
| 目录查找 | 筛选候选与查看安装状态 | 目录收录不证明安全 |
| 精确安装 | 以确定版本和 integrity 维护目标 profile | 需可核查、可自动恢复的原状态 |
| 回滚回执 | 区分已恢复与需人工修复 | 只证明被校验的文件和依赖收敛范围 |

**流程与依赖**

| 依赖或条件 | 用途与边界 |
| --- | --- |
| 兼容的 DSH Web 与 Node | 挂载宿主工具和市场槽位，实际宿主范围待验 |
| 可信来源与测试 profile | 查询目录和执行插件变更，确定真实目标再写 |
| 可恢复式依赖状态 | 不明、别名或链接来源可能拒绝自动安装 |

| 阶段 | 操作与核查点 |
| --- | --- |
| 选择 | 记录来源、包名及兼容条件，隔离目标 profile |
| 安装 | 核对计划的版本与锁信息，校验测试包真实可用 |
| 失败 | 区分回滚通过与需要人工修复，检查 profile 和外部副作用 |

**效果与成本**

| 阶段 | 资源与人工投入 |
| --- | --- |
| 首次 | 审查来源并备份测试 profile，耗时未测 |
| 持续 | 保留版本和兼容核对，清单、依赖和安装都涉及网络 |
| 恢复 | 确认 profile 字节及依赖是否收敛，必要时人工修复 |

| 效果 | 固定源码依据 | 未验证 |
| --- | --- | --- |
| 发现与管理 | 读取和 mutation 分层，用同一 profile | 目标部署的权限与兼容 |
| 恢复 | 字节回读及 frozen 校验 | 第三方脚本外部副作用和故障成功率 |

> **思考**：目录可信、peer 入参、安装后保护及恢复分别有条件。预检不可用可继续，回滚核对 profile 与依赖收敛，无法据此证明第三方安装脚本的外部状态已撤销。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将多来源目录浏览、风险提示与 profile 管理集中到 DSH 面板/工具/CLI；安全审核仍由使用者承担。[Q01](#research-q01) [Q03](#research-q03)

profile 名和目录在同一调用中绑定，npm 分发身份与安装后锁文件分开核查。回滚还原字节之后要求 frozen 收敛，保留人工修复状态。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-5"></a>

### 1.4 主要限制

目录可信、peer 入参、安装后保护及恢复分别有条件。预检不可用可继续，回滚核对 profile 与依赖收敛，无法据此证明第三方安装脚本的外部状态已撤销。[Q02](#research-q02) [Q04](#research-q04)

<a id="detail-section-6"></a>

### 1.5 使用建议

在可丢弃的 Web profile 只试一个可信小包，记录 origin、精确版本、锁完整性及安装前状态，再验证卸载和失败回执。假如依赖不收敛或写到了预期目录外，停用市场并手工修复测试 profile。[Q04](#research-q04) [Q05](#research-q05)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持市场查询、profile 管理入口及多种用户界面。目录收录不等于安全审查；没有本轮实际安装、故障注入或用户成本数据。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、host.js、src/host.ts、src/tools.ts、src/core/market.ts、src/core/profile-transaction.ts、src/core/doctor.ts、src/core/market-mutation.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定根组件源码研究。重点检查 host.js 重导出目标 src/host.ts、清单/操作层与 README；没有运行插件或审核社区全量条目。
- 下一步：在可丢弃 profile 用可信样例验证版本、完整性、取消和故障回执，检查 profile 外的实际状态。

**分析版本**

- **仓库**：[iasiv5/dsh-m](https://github.com/iasiv5/dsh-m)
- **版本号**：0.12.19（[固定提交 6cb4d21](https://github.com/iasiv5/dsh-m/tree/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50)）
- **版本日期**：2026-11-15（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

假设来源/版本固定与事务操作可减少错误更新；用隔离 profile 发生网络和写入故障时对比手工流程验证。[Q05](#research-q05)

在可丢弃 profile 用可信样例验证版本、完整性、取消和故障回执，检查 profile 外的实际状态。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 126 | 25165 | — | — | 613865 |
| .mjs | source | 24 | 3244 | 2502 | 600 | — |
| .js | source | 32 | 4324 | 2888 | 1255 | — |
| .ts | source | 54 | 19796 | 15241 | 3338 | — |
| .jsx | source | 12 | 4108 | 3324 | 690 | — |
| .mjs | test | 126 | 34705 | 30180 | 2294 | — |
| .mjs | example | 4 | 123 | 80 | 40 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/iasiv5/dsh-m/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=35&color=737b86&logo=github)](https://github.com/iasiv5/dsh-m/issues?q=is%3Aissue+created%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z) [![近30天关闭 35](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=35&color=737b86&logo=github)](https://github.com/iasiv5/dsh-m/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-17T02%3A08%3A04.910Z..2026-11-16T02%3A08%3A04.910Z)



统计日期：2026-11-16。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：团队能否用 dsh-m 在既有 DSH profile 中安全发现和管理插件，并维持清单可信、操作可回退与宿主兼容？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 哪些 DSH 用户会从 dsh-m 得益，它提供的增量和发行边界是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

使用 DSH Web、需要从社区与精选目录发现插件并管理 profile 的用户最直接受益。README 描述同一市场提供搜索、安装状态、更新、卸载、收藏及 Agent 工具；直用 `dsh plugin` 和手工维护 profile 是较小依赖的替代。该插件自身不是市场服务器：作者称无需额外服务或账号，具体目录仍依赖远端/本地清单。独立 `dshm` CLI 只安装为命令行工具，不等于注册 DSH 市场插件。当前 npm 包 main 指向 host.js，而 host.js 转出 `src/host.ts` 构建出的 lib 实现，因此入口论证以实际被重导出的源文件为准。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:10-20](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L10-L20)

定位插件市场、面板、工具和 CLI 的使用场景及安装边界。

<details>
<summary>查看原文（11行）</summary>

```text
dsh-m 把 DeepSeek Harness（DSH）的插件**发现、安装、管理与更新**放进同一个界面。社区目录与人工精选同时可搜；侧栏面板、8 个 Agent 工具和 `dshm` CLI 共用一套市场数据。无需额外的市场服务器或账号，插件操作仍由本机 DSH 宿主管理。

![侧栏插件市场：精选分区、分类与插件卡片](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/marketplace.webp)

## 30 秒上手

在 DSH 官方「插件管理 → 添加插件」中输入 `dsh-m`，选择可用的安装源并安装。**Web 重启服务并刷新页面；Desktop 退出并重新打开应用**。随后从侧栏底部进入「插件市场」。

![在 DSH 官方插件管理界面安装 dsh-m](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/official-plugin-install.webp)

无图形界面的 Web 宿主也可执行 `dsh plugin --profile web add dsh-m`（**桌面应用请勿使用**——该命令写死 `web` profile，装进去不会被加载；桌面插件请走上方官方插件管理页）。Node.js 需 ≥ 22.19.0；支持的 DSH 代际见[兼容表](#兼容与常见问题)。`npm install -g dsh-m` **仅安装独立 `dshm` CLI**，不会把市场插件注册到 DSH profile。
```

</details>

**依据 2 · 作者声明**：[README.md:26-42](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L26-L42)

社区/精选市场、已装管理和社区不等于安全审查。

<details>
<summary>查看原文（17行）</summary>

```text
- **社区 + 精选**：社区目录默认开启，收录 6,000+ 个条目（随上游目录持续增长，实际以面板计数为准）；精选清单按「装机必备 / 崔添翼精选 / 宝玉专区 / 歸藏专区 / iasi自研 / 腾讯轻量云专区 / 观察区」七桶策展。重名条目以精选为准：跨区搜索只呈现精选版本，社区浏览则会保留这类条目并以「精选」徽章标注。
- **分区浏览、全局搜索**：分类、排序（社区区可按下载量 / Stars / 收录日期）和分页在各区独立保留；输入中文或英文关键词时，同时搜索社区与精选，并分别展示命中数。收藏保存在浏览器本地（localStorage），不进 profile、不上服务端。
- **安装前先看详情**：卡片显示来源、安装状态与版本，图标优先取目录或包内声明、缺失时回退 GitHub 头像或首字母占位；详情展示说明、兼容信息和可用的安装入口。「作者自用」「版本无关」等徽章是受众与适配提示，不代表安全或质量背书。npm 包锁定**精确版本并校验 integrity**，GitHub 来源锁定 **commit SHA**；peer 不兼容时先提示风险，未经确认不强行安装。

| 社区分类 | 精选策展 |
|---|---|
| ![社区目录与开放分类筛选](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/community-catalog.webp) | ![精选清单的七桶策展分区](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/curated-registry.webp) |

![跨区搜索「皮肤」：精选命中置顶，社区命中分组呈现](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/search-results.webp)

![插件详情：分类、版本、来源、安装命令和安装入口](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/plugin-detail.webp)

> **社区收录不是安全审查。** 6,000+ 条目录来源广泛，安装前请核对作者、代码与所需能力；能力字段缺失表示「未扫描」，不表示「未发现风险」。

## 已装插件与设置

「**已装**」只反映当前宿主 profile 的实际插件：区分市场/非市场来源，显示运行相位与可用更新，并提供开关、升级、「全部更新」和确认后卸载——批量更新逐项串行执行、遇真实失败即停，dsh-m 自身固定最后升级。相关操作进度与结果会统一记录。开关可能即时生效或需要重启，应以操作结果为准。卸载只移除插件引用，不会默默删除用户数据，疑似残留路径会单独报告。
```

</details>

**依据 3 · 源码核查**：[package.json:6-14](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/package.json#L6-L14)

包 main/export 指向 host.js 与 client 入口。

```text
  "license": "MIT",
  "type": "module",
  "main": "./host.js",
  "bin": {
    "dshm": "lib/cli.js"
  },
  "exports": {
    ".": "./host.js",
    "./client": "./lib/client.js",
```

**依据 4 · 源码核查**：[host.js:1-1](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/host.js#L1-L1)

host.js 将 name/inject/Config/apply 重导出自编译 host。

```text
export { name, inject, Config, apply } from './lib/host.js'
```

**依据 5 · 源码核查**：[src/host.ts:18-21](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/host.ts#L18-L21)

源码 Host 注册名为 dshm，声明注入 tools。

```text
export const name = 'dshm'

// dshm_* 八个工具（src/tools.ts）
export const inject: string[] = ['tools']
```

#### 缺口

- 没有独立用户流程、安装成功率及事故记录。
  **影响**：不能断言统一市场降低了维护时间或安装风险。
  **进一步探讨**：用隔离 profile 完成搜索、兼容检查、安装、升级与卸载，记录人工步骤及失败恢复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 市场请求、配置与安装操作如何从 DSH Host 到生效 profile？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

宿主初始化同一 profile 的 registry controller，工具和 /dshm HTTP 共用它。面板请求经新建的宿主信任检查分发，经批准进入 market-mutation，读目录不会直接进入安装。以 npm 为例，mutation 读取原 profile 状态，若捕获失败、旧来源无法还原或身份歧义便拒绝变更。接着解析具体版本及 dist integrity；缺完整性值时停止。peer 不兼容需要显式覆盖，预检请求失败则当作未知并进入后续事务，所以缺警告不足以确认兼容。安装事务按同一 profile 名与目录执行，写后重新核对锁文件及完整性，必要时恢复丢失的 manifest 顶层键并做 frozen 复验。

#### 证据与依据

**依据 1 · 源码核查**：[src/host.ts:55-109](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/host.ts#L55-L109)

apply 解析 profile、构造共享 registry controller 并注册 dshm 工具。

<details>
<summary>查看原文（55行）</summary>

```text
export function apply(ctx: Context, config: Config): void {
  // 卸载前的 live-disable 依赖 loader（skillhub 同款）
  bindLoaderHost(ctx as unknown as LoaderHost)

  // 0.9.0 双 profile（ADR-0005）：宿主当前 profile 单一事实源——apply 期解析一次，
  // host 生命周期内不可变；GUI/工具/HTTP/缓存分段全部消费同一对象。
  const profile = resolveActiveProfile(ctx)
  ctx.logger?.info?.('dsh-m: active profile %s (dir=%s, source=%s)', profile.name, profile.dir, profile.source)

  // registry controller：active config / configured / pending / rejected 分离 + generation fence；
  // tools 与 Host API 共用同一 active config object（apply 原地更新字段，live 生效）。
  // unwrapConfig：0.1.7 上 volatile 字段是 cosmokit Volatile 引用，先解包成 plain 值再进 controller。
  const controller = createRegistryController(unwrapConfig(config), { profile: profile.name })
  // DSH 0.1.2-rc.1 / 0.1.5-rc.1 / 0.1.7-rc.1 / 0.1.7-rc.2 都经 dsh-cmdline 暴露 appExit；
  // using it avoids guessing the service unit from release-specific cgroups.
  const appExit = appExitFromContext(ctx)
  const restart = (port: number | null = null, channel?: OperationChannel) => scheduleRestart(port, { appExit, channel })

  // 开关委派的官方服务探测（ADR-0001）：运行时按服务存在性探测，不判 DSH 版本号。
  // 0.9.8 与 dsh-market 同源修正（Windows 实机 2026-10-01）：pluginManager 是惰性服务，
  // 外层 apply ctx 的一次性 get 在本机探不到；改为双上下文探测（webServer 注入回调的
  // hostCtx 优先——dshmarket 即此路径，两轮覆盖安装实证）+ inject 惰性拉起兜底。
  let serviceCtx: unknown = undefined
  const getService = (): PluginManagerLike | undefined => {
    for (const c of [serviceCtx, ctx]) {
      const svc = (c as unknown as { get?: (name: string) => unknown } | null)?.get?.('pluginManager') as
        | PluginManagerLike
        | undefined
      if (svc !== undefined && svc !== null) return svc
    }
    return undefined
  }
  // 惰性拉起：get 缺席时经 cordis inject 等官方服务实例化（短超时，仍缺席由调用方 fail-closed）
  const ensureService = (timeoutMs = 5_000): Promise<PluginManagerLike | undefined> =>
    new Promise((resolve) => {
      const immediate = getService()
      if (immediate !== undefined) {
        resolve(immediate)
        return
      }
      let settled = false
      const finish = () => {
        if (settled) return
        settled = true
        clearTimeout(timer)
        resolve(getService())
      }
      const timer = setTimeout(finish, timeoutMs)
      try {
        ;(ctx as unknown as { inject?: (deps: string[], cb: (c: unknown) => void) => unknown }).inject?.(['pluginManager'], () => finish())
      } catch {
        finish()
      }
    })
  registerTools(ctx, controller.config, { restart, getService, ensureService }, profile)
```

</details>

**依据 2 · 源码核查**：[src/host.ts:139-175](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/host.ts#L139-L175)

Host 通过受信任请求检查创建并注册 /dshm 路由。

<details>
<summary>查看原文（37行）</summary>

```text
  // 本地 API：单路由 + method 分发（信任检查与状态映射在 core/host-api.ts）。
  // 0.9.0（ADR-0005）：入口信任检查全量委派官方 connection.requestRejection——
  // Desktop 桥剥 Origin 的请求按官方语义（trustedHosts/loopback/cross-site/Origin:null）判定，
  // 服务缺席或抛错一律 fail-closed 403（warn 一次）。
  ctx.inject(['webServer'], (c) => {
    const server = (
      c as unknown as {
        webServer: {
          register: (route: {
            kind: string
            path: string
            handler: (req: IncomingMessage, res: ServerResponse) => void | Promise<void>
          }) => void
        }
      }
    ).webServer
    serviceCtx = c // 0.9.8：webServer 注入回调的 hostCtx 是 pluginManager 的可见上下文（dsh-market 同款）
    const rejectRequest = createRequestRejection(ctx)
    const handleApi = createApiDispatcher({
      controller,
      pkg,
      profile,
      deps: {
        scheduleRestart: restart,
        getService,
        ensureService,
        rejectRequest,
      },
    })
    server.register({
      kind: 'exact',
      path: '/dshm',
      handler: (req, res) => {
        void handleApi(req, res)
      },
    })
  })
```

</details>

**依据 3 · 源码核查**：[src/host.ts:111-137](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/host.ts#L111-L137)

设置服务兼容失败时记录告警并保留配置文件路径。

<details>
<summary>查看原文（27行）</summary>

```text
  // 设置页接线（双代兼容，详见 core/settings-compat.ts）：
  // - ≤0.1.5：settings.register('dshm', …) scope（get/update/watch）；
  // - 0.1.7-rc.1 / rc.2：Config `.volatile()` 字段自动生成设置页（autoGenerate 默认开，无需 configure），
  //   读 = loader 解析的 Config 引用，写 = settings.update(ns, patch)，通知 = loader/volatile-update；
  // - 其他形态：降级 cordis 配置文件通路。任何失败只 warn，不拖垮 webServer / tools。
  ctx.inject(['settings'], (c) => {
    const settings = (
      c as unknown as { settings?: unknown }
    ).settings
    try {
      const outcome = wireRegistrySettings({
        ctx,
        settings,
        schema: Config,
        parsedConfig: config,
        packageName: pkg.name,
        logger: ctx.logger,
        attachStore: (store: RegistrySettingsStore) => controller.attachStore(store),
      })
      if (outcome === 'legacy' || outcome === 'forms') {
        ctx.logger?.debug?.('dsh-m: settings store attached (%s)', outcome)
      }
    } catch (err) {
      ctx.logger?.warn?.('dsh-m: settings 集成失败，registry 地址走 cordis 配置文件')
      ctx.logger?.warn?.(err)
    }
  })
```

</details>

**依据 4 · 源码核查**：[src/core/market.ts:1-11](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/market.ts#L1-L11)

市场读查询与 mutation 写路径拆分。

<details>
<summary>查看原文（11行）</summary>

```text
/**
 * 市场查询层（读侧）：registry × profile × 最新版本 → 市场列表（服务端分页）/ 已装列表。
 * 安装语义见 DESIGN.md §3（npm 精确锁定、GitHub 锁 SHA）。
 * Task 3：服务端 query/category/offset/limit 过滤；只对当前页查 latest（并发 ≤8、
 * TTL cache、共享全局 deadline）；unavailable 返回结构化空页；host/cli namespace 贯穿。
 * 2026-09-05 回滚缺陷加固：B1 成功路径保留 manifest 顶层未知键（如 pnpm.overrides）、
 * 失败路径字节级回滚后 frozen 自愈阶梯（overrides 对齐 → no-frozen 重建，B2）、
 * 新发布后 NO_MATCHING_VERSION 的退避重试 + packument 预热（B3）。
 * 2026-10-24（ADR-0024）：安装/卸载/升级/自升级写侧整段迁出 src/core/market-mutation.ts，
 * 本文件只留读侧查询与探测缓存；mutation 成功后的定向失效经本文件导出的
 * invalidateLatestForEntry（只失效不回写）。
```

</details>

**依据 5 · 源码核查**：[src/core/market-mutation.ts:596-652](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/market-mutation.ts#L596-L652)

安装前状态、来源、完整性及 peer 门槛，并绑定目标 profile。

<details>
<summary>查看原文（57行）</summary>

```text
  if (entry.source === 'npm' && entry.npm) {
    const pkg = entry.npm
    // 变更前全量快照（unavailable → fail-closed，零写入）
    const pre = await capturePreMutationState(profileDir)
    if (pre.kind === 'unavailable') {
      throw new Error(`变更前状态捕获失败：${pre.reason}；拒绝安装（fail-closed）`)
    }
    // npm key 事务前已知：prior 派生与 restorable 检查在事务前完成
    // （issue #6 修法 B：投影形态包不受 lock integrity 判据约束，见 derivePrior 注）
    const prior = derivePrior(pre.snapshot, pkg, { generationProjected: isGenerationProjectionPkg(profileDir, pkg) })
    if (prior.kind === 'unavailable') {
      throw new Error(`prior 关联歧义：${prior.reason}；拒绝安装（fail-closed）`)
    }
    if (prior.kind === 'dependency' && !prior.state.restorable) {
      throw guardManualRequired(
        `「${pkg}」的原安装形态（${prior.state.sourceKind === 'other' ? 'link/file 等非 registry 来源' : 'pnpm-lock.yaml 未解析出该依赖的 integrity（键缺失或为别名/URL 等非 registry 写法）'}）无法自动回退，请先手动处理（卸载或修复后重试）；也可在官方宿主插件管理界面（Settings → Plugins）操作该插件`,
        [{ pkg, code: 'NO_DSH_MARKER', detail: `prior restorable:false（sourceKind=${prior.state.sourceKind}）` }],
      )
    }
    // npm：无论 latest 还是用户指定 exact，都先读取该精确版本的 dist metadata（事务外解析）
    let version: string
    let expectedIntegrity: string | undefined
    if (opts.version) {
      const meta = await d.npmVersion(pkg, opts.version, timeoutMs, opts.signal)
      version = meta.version
      expectedIntegrity = meta.integrity
    } else {
      const latest = await d.npmLatest(pkg, timeoutMs, opts.signal)
      version = latest.version
      expectedIntegrity = latest.integrity
    }
    if (!expectedIntegrity) throw new Error(`npm metadata 缺少 dist integrity：${pkg}@${version}，拒绝安装`)
    // peer 兼容预检（Task 11，事务外 metadata 阶段；force = 用户已确认风险）。
    // 预检自身的元数据读取失败（网络错/404）不拦安装——视为未检，安装事务自有失败语义。
    let compat: CompatIssue | null = null
    try {
      compat = await (deps?.precheck ?? precheckNpmCompat)(pkg, version, {
        timeoutMs,
        signal: opts.signal,
      })
    } catch {
      compat = null
    }
    if (compat !== null && opts.forceIncompatible !== true) throw new IncompatibleError(compat)
    // 生产预热绑定：未注入时 B3 用 makeNpmWarmPackument（保留 timeout/signal、失败吞错）
    const result = await runProfileTransaction(
      { kind: 'install-npm', pkg, version, integrity: expectedIntegrity, signal: opts.signal },
      {
        ...deps?.transaction,
        // ADR-0030 / 评审 F1：profileDir 必须与 profileName 一并并入——只并名字会让事务
        // 快照/回滚落 webProfileDir() 而 dsh 子进程按 --profile 写目标目录（跨目录原子性破碎）。
        profileDir,
        profileName,
        warmPackument: deps?.transaction?.warmPackument ?? makeNpmWarmPackument(timeoutMs),
      },
    )
    if (!result.ok) throw new TransactionError(result)
```

</details>

**依据 6 · 源码核查**：[src/core/profile-transaction.ts:770-785](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/profile-transaction.ts#L770-L785)

读锁文件核对实际 integrity，缺失或不一致回失败。

<details>
<summary>查看原文（16行）</summary>

```text
  let lockText: string
  try {
    lockText = await readFile(join(d.profileDir, 'pnpm-lock.yaml'), 'utf8')
  } catch {
    throw new DomainFailure({ code: 'LOCKFILE_MISSING', note: '安装后未找到 pnpm-lock.yaml，无法核对 integrity' })
  }
  let actual: string | null
  try {
    actual = readPnpmLockIntegrity(lockText, req.pkg, req.version)
  } catch (err) {
    throw new DomainFailure({ code: 'LOCK_INTEGRITY_MISMATCH', note: errText(err) })
  }
  try {
    assertNpmIntegrity(req.integrity, actual, req.pkg, req.version)
  } catch (err) {
    throw new DomainFailure({ code: 'LOCK_INTEGRITY_MISMATCH', note: errText(err) })
```

</details>

**依据 7 · 源码核查**：[src/core/profile-transaction.ts:794-849](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/profile-transaction.ts#L794-L849)

运行期取消、安装失败和校验错误均进入回滚。

<details>
<summary>查看原文（56行）</summary>

```text
async function installNpm(
  req: Extract<TransactionRequest, { kind: 'install-npm' }>,
  d: ResolvedDeps,
  snapshots: ProfileFileSnapshot[],
): Promise<TransactionResult> {
  const heal: HealAction[] = []
  const spec = `${req.pkg}@${req.version}`
  try {
    const addOut = await addWithLagRetry(req, spec, d, heal)
    if (req.signal?.aborted) {
      return await rollbackAndConverge(d, req.kind, abortedFailure('安装过程中已取消'), heal, snapshots, req.pkg)
    }
    if (addOut.class !== 'ok') {
      const failure: TransactionFailure = req.signal?.aborted
        ? { code: 'ABORTED', note: addOut.output }
        : addOut.class === 'retryable-lag'
          ? { code: 'ADD_RETRY_EXHAUSTED', note: addOut.output }
          : { code: 'ADD_FAILED', note: addOut.output }
      return await rollbackAndConverge(d, req.kind, failure, heal, snapshots, req.pkg)
    }

    // verify 相（严格读取；首次）
    await verifyNpmCommitState(req, d, heal, true)

    // B1（成功路径）：安装链丢 manifest 顶层键 → 快照找回 + frozen 复验（复验失败 fail-closed 进回滚）
    const restoredKeys = await restoreManifestKeys(d.profileDir, snapshots[0])
    if (restoredKeys) {
      heal.push({ code: 'B1_MANIFEST_KEYS_RESTORED', note: `安装链丢失了 manifest 顶层键（${restoredKeys.join(', ')}），已从安装前快照找回` })
      const conv = await frozenConvergeLadder(d, heal)
      if (conv.class !== 'ok') {
        heal.push({ code: 'B1_FROZEN_REVERIFY_FAILED', note: `frozen 复验未通过：${conv.output}` })
        throw new DomainFailure({ code: 'POST_MUTATION_CONVERGENCE_FAILED', note: `B1 找回 manifest 键后 frozen 复验失败：${conv.output}` })
      }
      // R3：B1/B2 可能受控改写了 manifest/lockfile——提交前对最终状态重新执行完整验证
      await verifyNpmCommitState(req, d, heal, false)
    }

    if (req.signal?.aborted) {
      return await rollbackAndConverge(d, req.kind, abortedFailure('提交前已取消'), heal, snapshots, req.pkg)
    }
    return committed(req.kind, heal, addOut.output, {
      pkg: req.pkg,
      spec,
      version: req.version,
      buildApprovals: addOut.buildApprovals ?? [],
      fallbackAllBuilds: addOut.fallbackAllBuilds === true,
      ...(await bundleIdentityWarning(d.profileDir, req.pkg)) ? { bundleWarning: 'no-patch-layer' as const } : {},
    })
  } catch (err) {
    if (err instanceof DomainFailure) {
      return await rollbackAndConverge(d, req.kind, err.failure, heal, snapshots, req.pkg)
    }
    const failure: TransactionFailure = isAbortish(err, req.signal)
      ? { code: 'ABORTED', note: errText(err) }
      : { code: 'INTERNAL_ERROR', note: errText(err) }
    return await rollbackAndConverge(d, req.kind, failure, heal, snapshots, req.pkg)
```

</details>

#### 缺口

- 没有在目标 DSH 版本中实际追踪 HTTP、工具与宿主服务调用。
  **影响**：不能证明所声明的 profile 一致性及 fail-closed 行为在真实宿主实现。
  **进一步探讨**：固定目标 DSH 版本，分别从 GUI、Agent 工具和 CLI 发起只读查询与受控写入，核对 profile、路由和错误结果。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 采用 dsh-m 的兼容、信任和目录风险由哪些前提约束？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

安装需要兼容的 DSH Web/API、Node ≥22.19、可用的清单来源和宿主 profile。作者特别指出社区收录不是安全审查，条目可缺少能力扫描数据；因此目录曝光不能等同安全背书。包清单锁定依赖范围并声明 peer 接口，README 列出过往宿主代际验证时间，但这些属于作者记录，不能代表所有当前部署。桌面应用的安装路径与 Web CLI 不同；用 web profile 命令不能证明 desktop 插件已加载。若清单不可用，部分搜索/registry 操作显式失败，已装清单仍可本地显示。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:20-22](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L20-L22)

Node 版本、Web/Desktop 安装路径及卸载数据边界。

```text
无图形界面的 Web 宿主也可执行 `dsh plugin --profile web add dsh-m`（**桌面应用请勿使用**——该命令写死 `web` profile，装进去不会被加载；桌面插件请走上方官方插件管理页）。Node.js 需 ≥ 22.19.0；支持的 DSH 代际见[兼容表](#兼容与常见问题)。`npm install -g dsh-m` **仅安装独立 `dshm` CLI**，不会把市场插件注册到 DSH profile。

> 官方插件管理界面的就地更新能力以宿主版本和界面提示为准；如果明确提示不支持，请按提示卸载旧版后重新安装。卸载不会自动清除插件数据。
```

**依据 2 · 作者声明**：[README.md:38-50](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L38-L50)

社区目录不等于安全审核，自定义清单具有整体替换及缓存边界。

<details>
<summary>查看原文（13行）</summary>

```text
> **社区收录不是安全审查。** 6,000+ 条目录来源广泛，安装前请核对作者、代码与所需能力；能力字段缺失表示「未扫描」，不表示「未发现风险」。

## 已装插件与设置

「**已装**」只反映当前宿主 profile 的实际插件：区分市场/非市场来源，显示运行相位与可用更新，并提供开关、升级、「全部更新」和确认后卸载——批量更新逐项串行执行、遇真实失败即停，dsh-m 自身固定最后升级。相关操作进度与结果会统一记录。开关可能即时生效或需要重启，应以操作结果为准。卸载只移除插件引用，不会默默删除用户数据，疑似残留路径会单独报告。

![已装页：版本、来源、运行状态与开关；截图已隐藏本机 profile 路径](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/installed.webp)

「**设置**」可查看社区目录的版本、获取线路和缓存状态，开关或锁定社区目录版本；也可下载默认精选清单、填入自定义地址并**校验后整体替换精选区**（社区区不变）。校验失败不改当前生效配置；恢复默认或成功应用均无需重启。

![设置页：社区目录状态与精选清单配置](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/settings.webp)

自定义地址支持 HTTPS、本机绝对路径或 `file://`（HTTP 仅限 loopback 调试），清单大小 ≤ 2 MiB、条目 ≤ 1,000。自定义源是独立快照，**不会自动同步默认精选**；源失效时保留该源最近的成功缓存，不会暗中切回默认。添加精选条目或了解完整校验规则，请看 [清单文案指南](https://github.com/iasiv5/dsh-m/blob/main/docs/registry-copy-guide.md)与[设计文档](https://github.com/iasiv5/dsh-m/blob/main/docs/DESIGN.md)。
```

</details>

**依据 3 · 作者声明**：[README.md:109-124](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L109-L124)

兼容表注明不同 DSH 代际的验证时间与范围。

<details>
<summary>查看原文（16行）</summary>

```text
## 兼容与常见问题

| DSH Web 代际 | 设置通路 | 核验情况 |
|---|---|---|
| `0.1.2-rc.1` | cordis 配置降级 | 契约核对 |
| `0.1.5-rc.1 / rc.2` | `register()` scope | 已核对；rc.1 另有页面实测 |
| `0.1.7-rc.1 / rc.2` | `.volatile()` + `settings.update` | 已核对 |
| `0.2.0-rc.1 / rc.2` | 同 0.1.7 通路 | rc.2 与重启链路实测 |
| `0.2.1-rc.2` | 同 0.2.0 通路 | 装机/升级与 D3 自升级 dogfood 实测（0.10.x 线） |
| `0.2.1-rc.3` | 同 0.2.0 通路 | 最后完整实测于 dsh-m 0.10.11（link 装机：测试 1719/1719 零失败 + 七项兼容清单）；后续版本未复测 |
| `0.2.1-rc.4` | 同 0.2.0 通路 | 0.11.x 线 dogfood 宿主（本机 web 档 dsh-m 0.11.0 常驻运行）；0.11.1 发版（全量测试 1841/1841 + 发版门禁全绿）；官方契约核对取自 rc.3/rc.4 双版（ADR-0027） |
| `0.2.1-rc.5` | 同 0.2.0 通路 | 契约面等价重发布（宿主 web-app patch 相对 rc.4 零 diff）；rc.4 的核验结论按等价口径承接；0.11.x 线 dogfood 宿主已随宿主升级运行于 rc.5 |
| `0.2.2-rc.1` | 同 0.2.0 通路 | 新 minor 线首轮（宿主 web-app patch 含 UI bundle 行增删，非等价重发布）；0.12.x 线 dogfood 宿主已随宿主升级运行于 rc.1（2026-11-04 实机验收：市场面板、设置通路与全量客户端产物下发均正常） |
| `0.2.2-rc.2 / rc.3` | 同 0.2.0 通路 | 0.12.x 线 dogfood 宿主已随宿主升级常驻运行于 rc.3（dsh-m 0.12.17 实机常驻；2026-11-14 发版轮实机核验 + 全量门禁全绿） |

> 表中各代核验对应其时点的 dsh-m 版本：0.10.x 线的完整实测仅覆盖 DSH 0.2.1-rc.2 / rc.3，0.11.x 线覆盖 0.2.1-rc.4（rc.5 为契约面等价重发布，核验结论按等价口径外推），0.12.x 线覆盖 0.2.2-rc.1（2026-11-04 起）与 rc.2/rc.3（随宿主升级，2026-11-14 实机核验）；更老代际未经当前版本复测，不代表当前 dsh-m 可在其上运行。
```

</details>

**依据 4 · 源码核查**：[package.json:37-39](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/package.json#L37-L39)

包要求 Node 22.19.0 以上。

```text
  "engines": {
    "node": ">=22.19.0"
  },
```

**依据 5 · 源码核查**：[package.json:72-77](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/package.json#L72-L77)

声明 DSH peer 依赖范围。

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "*",
    "@deepseek-ai/dsh-tools": "^0.1.7-rc.2 || ^0.2.0-rc.1 || >=0.2.0",
    "@deepseek-ai/schemastery": "*",
    "react": "^18.2.0 || ^19.0.0"
  },
```

#### 缺口

- 本轮未对任意目录条目做审计，也未现场验证所有 DSH 兼容代际。
  **影响**：对特定插件的权限、安全性和目标宿主支持仍未知。
  **进一步探讨**：只在隔离 profile 安装已审阅的单一插件，验证 peer 兼容、来源完整性及卸载后的数据保留。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 它如何处理操作失败和运维成本，哪些收益仍无证据？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

安装已开始后，取消、子进程失败或锁文件不匹配都会进入回滚。实现先按快照还原三个 profile 文件并重新读取比较，再运行 frozen 收敛确认依赖可用；两步均通过才返回 rolled-back。收敛失败时只对原来不存在的目标尝试补移除，并需要再次核对；恢复和收敛仍失败则返回 manual-repair。它没有给出安装脚本曾写到其他路径的撤销保证。首次需要已验证清单、包身份和可恢复的 profile，持续要核对版本、来源和 peer。失败要检查实际 profile 与宿主加载状态并准备人工修复，资源与节时均未量化。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:26-28](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L26-L28)

安装来源锁定版本或 commit，并在 peer 不兼容时提示。

```text
- **社区 + 精选**：社区目录默认开启，收录 6,000+ 个条目（随上游目录持续增长，实际以面板计数为准）；精选清单按「装机必备 / 崔添翼精选 / 宝玉专区 / 歸藏专区 / iasi自研 / 腾讯轻量云专区 / 观察区」七桶策展。重名条目以精选为准：跨区搜索只呈现精选版本，社区浏览则会保留这类条目并以「精选」徽章标注。
- **分区浏览、全局搜索**：分类、排序（社区区可按下载量 / Stars / 收录日期）和分页在各区独立保留；输入中文或英文关键词时，同时搜索社区与精选，并分别展示命中数。收藏保存在浏览器本地（localStorage），不进 profile、不上服务端。
- **安装前先看详情**：卡片显示来源、安装状态与版本，图标优先取目录或包内声明、缺失时回退 GitHub 头像或首字母占位；详情展示说明、兼容信息和可用的安装入口。「作者自用」「版本无关」等徽章是受众与适配提示，不代表安全或质量背书。npm 包锁定**精确版本并校验 integrity**，GitHub 来源锁定 **commit SHA**；peer 不兼容时先提示风险，未经确认不强行安装。
```

**依据 2 · 作者声明**：[README.md:40-46](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L40-L46)

批量更新串行、失败停止及配置维护功能。

```text
## 已装插件与设置

「**已装**」只反映当前宿主 profile 的实际插件：区分市场/非市场来源，显示运行相位与可用更新，并提供开关、升级、「全部更新」和确认后卸载——批量更新逐项串行执行、遇真实失败即停，dsh-m 自身固定最后升级。相关操作进度与结果会统一记录。开关可能即时生效或需要重启，应以操作结果为准。卸载只移除插件引用，不会默默删除用户数据，疑似残留路径会单独报告。

![已装页：版本、来源、运行状态与开关；截图已隐藏本机 profile 路径](https://raw.githubusercontent.com/iasiv5/dsh-m/main/docs/images/installed.webp)

「**设置**」可查看社区目录的版本、获取线路和缓存状态，开关或锁定社区目录版本；也可下载默认精选清单、填入自定义地址并**校验后整体替换精选区**（社区区不变）。校验失败不改当前生效配置；恢复默认或成功应用均无需重启。
```

**依据 3 · 源码核查**：[src/core/profile-transaction.ts:1-35](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/profile-transaction.ts#L1-L35)

存在针对 profile 的事务性写入实现。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * Profile 变更事务（Profile Transaction）——深模块。
 * 设计语义见 docs/DESIGN.md §3.1；执行计划（含四轮评审处置）见
 * docs/plans/2026-09-07-profile-transaction-implementation-plan.md。
 *
 * 模块契约（「类型之外的契约」）：
 * 1. 前置：request 必须已解析到底（版本/SHA/integrity 均已定）；模块内除 `warmPackument` 外零网络。
 * 2. throw 政策与未预期异常（phase-aware）：预期的领域失败一律返回 TransactionResult；仅畸形
 *    request 抛 TypeError（isSafePkgName/isSafePluginTarget 不通过、github repo 非 owner/repo 形状、
 *    SHA 非 40 位十六进制、integrity 空白）——校验先于 runner factory 调用与任何读写，零写入。
 *    未预期异常由顶层 catch 按阶段分流：快照完成前且无写入 → rejected + INTERNAL_ERROR；
 *    快照后或 mutation 已开始 → failure code 保留 INTERNAL_ERROR，照常执行不可取消的统一
 *    回滚/收敛/live 补偿——回滚成功 → rolled-back；失败 → manual-repair。
 * 3. 四态语义与证据来源：`snapshotRestoreVerified` = 还原后重读比对的历史事实（committed 恒
 *    false，未发生还原）；`profileConverged` = committed 门专属 verify 成功 / rolled-back 收敛
 *    阶梯通过；rejected、manual-repair 恒 false。不声称 node_modules 字节级回滚。
 * 4. signal 语义：`req.signal` 贯通 PnpmRunner 四操作、warmPackument 与 B3 退避 sleep
 *    （abort 即醒）；排队期或 mutate 前 abort → rejected + ABORTED；mutate 已开始后 abort →
 *    中止在途调用并执行不可取消的回滚（failure code 保留 ABORTED，终态 rolled-back 或
 *    manual-repair）；回滚/收敛阶段不传外部 signal（不变量优先于取消）。
 * 5. 串行：模块级 FIFO promise 链，进程内互斥；不得在 runner 回调里再调
 *    runProfileTransaction；跨进程并发不在覆盖范围。
 * 6. uninstall 定序固定：validate（严格读取）→ 快照 → live-disable → 摘补丁 → remove →
 *    verify gone；失败回滚时 live 尽力反向。
 * 7. 事务内 verify 相 profile 读取用严格读取器（模块私有）：manifest 读异常 →
 *    PROFILE_MANIFEST_UNREADABLE、JSON 非法 → PROFILE_MANIFEST_INVALID、插件元数据不可读 →
 *    PLUGIN_METADATA_UNREADABLE；宽容读取只属列表页。B1/B2 自愈阶梯内部的 best-effort
 *    读取保持宽容（阶梯失败本身会进失败路径）。
 * 8. github 校验：存在键 k 使 depsNow[k] === spec 且 snapshotDeps[k] !== spec（相对前态
 *    变化，防旧依赖误命中）；无 → GITHUB_SPEC_MISMATCH。
 * 9. 拒绝的假想 seam：FsPort、时钟 port、锁 port、每 doorway 一模块、版本解析 port。
 *    npm-integrity.ts 的可注入 fs 操作是内部 seam（仅供其自测）。
 */
import { Buffer } from 'node:buffer'
import { readFile, stat } from 'node:fs/promises'
```

</details>

**依据 4 · 源码核查**：[src/core/doctor.ts:1-35](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/doctor.ts#L1-L35)

存在只读诊断实现。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * 体检（Doctor，ADR-0010）：对单个 profile 的只读健康检查。
 *
 * 纪律（照 dsh-market check.ts 学习所得，详见对比报告 §4）：
 * - 纯文件系统分析：无进程派生、无网络请求、无文件写入/删除——任意时刻可安全调用。
 *   版本解析只用 readLauncherPackageVersion 纯 FS 通路；resolveDshVersion 的
 *   spawn `dsh --version` 回退为 doctor 禁区（CLI 下解析为 null 即降级，绝不 spawn）。
 * - 三级严重度：error（断链或必然阻断启动）/ warning（确认异常但不阻止启动）/
 *   结构化清单（只列不警，零告警渲染）；unknown≠broken——看不见的对象显式标
 *   unknown 并沉默，不推断为损坏。
 * - 每条 error/warning 必须含三要素：发生了什么（title）/ 为什么（detail）/ 现在怎么办（hint）。
 * - 密钥红线：绝不读取或转储 cordis.patch.yml 等含密钥配置文件内容；报告只含
 *   包名、路径、版本号等结构化事实（链接目标目录 package.json 的 version 字段
 *   属包元数据，不在禁令内）。
 * - 修复责任外移：doctor 永不写不删，修复建议以文字形态给出（ADR-0010 决定 5）。
 */
import { readdir, readFile, lstat, stat, readlink } from 'node:fs/promises'
import { basename, dirname, join, resolve } from 'node:path'
import { parseDocument } from 'yaml'
import { satisfies, validRange } from 'semver'
import { dshHome } from './env.js'
import { readProfileDeps, resolvePluginDir, readPkgJson } from './installed.js'

// ---------- 报告类型（Task 1 契约；schema 版本化，后续检查项扩展 finding 枚举不破坏消费方） ----------

export type Severity = 'error' | 'warning'

export interface DoctorFinding {
  check: 'farm-liveness' | 'residue' | 'account-reality' | 'meta' | 'install-restorability'
  severity: Severity
  /** 发生了什么（含包名/路径等结构化事实） */
  title: string
  /** 为什么这是问题 */
  detail: string
  /** 现在怎么办（只给建议，doctor 不代执行） */
```

</details>

**依据 5 · 源码核查**：[src/core/profile-transaction.ts:524-585](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/profile-transaction.ts#L524-L585)

回滚先恢复并校验字节，之后 frozen；补移除只对原来不存在的依赖再验证。

<details>
<summary>查看原文（62行）</summary>

```text
async function rollbackAndConverge(
  d: ResolvedDeps,
  kind: TransactionRequest['kind'],
  failure: TransactionFailure,
  heal: HealAction[],
  snapshots: ProfileFileSnapshot[],
  fallbackRemovePkg?: string,
): Promise<FailedTransactionResult> {
  const healSuffixNote = (detail: string): TransactionFailure => ({
    code: failure.code,
    note: `${failure.note}；依赖回滚也失败（${detail}）`,
  })
  // 阶段一：字节还原 + 重读比对验证
  let restoreVerified = false
  let restoreErr: unknown = null
  let restoreMismatch = false
  try {
    await restoreSnapshots(snapshots)
    await assertRestoredBytes(snapshots)
    restoreVerified = true
    heal.push({ code: 'ROLLBACK_BYTES_RESTORED', note: '三文件已按快照逐字节还原并重读复验' })
  } catch (err) {
    restoreErr = err
    restoreMismatch = err instanceof RestoreVerifyMismatch
    if (restoreMismatch) {
      heal.push({ code: 'ROLLBACK_VERIFY_FAILED', note: `还原后重读比对不一致：${errText(err)}` })
    }
  }

  // 阶段二：frozen 收敛阶梯（仅在字节还原验证通过后才有意义；R2：异常→manual-repair）
  if (restoreVerified) {
    let conv: RunnerOutcome
    try {
      conv = await frozenConvergeLadder(d, heal)
    } catch (err) {
      return manualRepair(kind, healSuffixNote(`回滚收敛异常：${errText(err)}`), heal, errText(err), true)
    }
    if (conv.class === 'ok') {
      heal.push({ code: 'ROLLBACK_CONVERGED_FROZEN', note: '回滚后 frozen 校验一致' })
      return rolledBack(kind, failure, heal, conv.output)
    }
    // 收敛失败 → originallyAbsent 补移除兜底（移除成功 ≠ 收敛已证，需复验）
    if (fallbackRemovePkg !== undefined && originallyAbsent(fallbackRemovePkg, snapshots)) {
      let rm: RunnerOutcome
      try {
        rm = await d.runner.remove(fallbackRemovePkg)
      } catch (rmErr) {
        return manualRepair(kind, healSuffixNote(`${conv.output}；移除 ${fallbackRemovePkg} 也失败（${errText(rmErr)}）`), heal, conv.output, true)
      }
      if (rm.class !== 'ok') {
        return manualRepair(kind, healSuffixNote(`${conv.output}；移除 ${fallbackRemovePkg} 也失败（${rm.output}）`), heal, conv.output, true)
      }
      heal.push({ code: 'ROLLBACK_FALLBACK_REMOVED', note: `恢复安装失败，已补移除原不存在的依赖 ${fallbackRemovePkg}` })
      // R1：严格 verify gone + 再跑一次 frozen 收敛，通过才允许 rolled-back
      try {
        const depsNow = await strictReadDeps(d)
        if (fallbackRemovePkg in depsNow) {
          return manualRepair(kind, healSuffixNote(`${conv.output}；补移除 ${fallbackRemovePkg} 后依赖仍存在`), heal, conv.output, true)
        }
        const reconverge = await frozenConvergeLadder(d, heal)
        if (reconverge.class === 'ok') {
          heal.push({ code: 'ROLLBACK_CONVERGED_FROZEN', note: '补移除后 frozen 校验一致' })
```

</details>

#### 缺口

- 没有安装/升级失败注入、操作耗时和真实维护工时数据。
  **影响**：不能量化其相对手工 CLI 的总成本或恢复成功率。
  **进一步探讨**：在临时 profile 对比人工 CLI 与 dsh-m 操作，覆盖 peer 拒绝、网络中断及写入失败并记录耗时和文件差异。
- 安装脚本与 hook 的外部副作用没有运行记录
  **影响**：不能以三文件和依赖收敛回执推断全盘恢复
  **进一步探讨**：仅用可丢弃 profile 与可信样例注入安装失败，另核对 profile 外写入

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么最小验证能决定是否采用市场插件？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可检验假设：当团队在 DSH profile 中管理多个来源各异的插件时，先呈现版本/来源/peer 风险，再以事务方式执行操作，可能减少错误安装与人工恢复。推导依据是其读写分层、来源锁定提示和 profile 事务设计；当前没有用户结果，假设不能当作已兑现贡献。建议只在临时 Web profile 对一项可信插件试用，核验来源和 peer 后安装，再升级或卸载并确认默认配置无意外变更；任一步目录、权限或恢复结果异常即停止推广。

#### 证据与依据

**依据 1 · 源码核查**：[src/core/market.ts:1-5](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/market.ts#L1-L5)

查询层声明服务端分页、当前页最新版本查询及结构化不可用结果。

```text
/**
 * 市场查询层（读侧）：registry × profile × 最新版本 → 市场列表（服务端分页）/ 已装列表。
 * 安装语义见 DESIGN.md §3（npm 精确锁定、GitHub 锁 SHA）。
 * Task 3：服务端 query/category/offset/limit 过滤；只对当前页查 latest（并发 ≤8、
 * TTL cache、共享全局 deadline）；unavailable 返回结构化空页；host/cli namespace 贯穿。
```

**依据 2 · 源码核查**：[src/core/profile-transaction.ts:1-35](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/src/core/profile-transaction.ts#L1-L35)

事务模块是减少部分写入风险的机制依据。

<details>
<summary>查看原文（35行）</summary>

```text
/**
 * Profile 变更事务（Profile Transaction）——深模块。
 * 设计语义见 docs/DESIGN.md §3.1；执行计划（含四轮评审处置）见
 * docs/plans/2026-09-07-profile-transaction-implementation-plan.md。
 *
 * 模块契约（「类型之外的契约」）：
 * 1. 前置：request 必须已解析到底（版本/SHA/integrity 均已定）；模块内除 `warmPackument` 外零网络。
 * 2. throw 政策与未预期异常（phase-aware）：预期的领域失败一律返回 TransactionResult；仅畸形
 *    request 抛 TypeError（isSafePkgName/isSafePluginTarget 不通过、github repo 非 owner/repo 形状、
 *    SHA 非 40 位十六进制、integrity 空白）——校验先于 runner factory 调用与任何读写，零写入。
 *    未预期异常由顶层 catch 按阶段分流：快照完成前且无写入 → rejected + INTERNAL_ERROR；
 *    快照后或 mutation 已开始 → failure code 保留 INTERNAL_ERROR，照常执行不可取消的统一
 *    回滚/收敛/live 补偿——回滚成功 → rolled-back；失败 → manual-repair。
 * 3. 四态语义与证据来源：`snapshotRestoreVerified` = 还原后重读比对的历史事实（committed 恒
 *    false，未发生还原）；`profileConverged` = committed 门专属 verify 成功 / rolled-back 收敛
 *    阶梯通过；rejected、manual-repair 恒 false。不声称 node_modules 字节级回滚。
 * 4. signal 语义：`req.signal` 贯通 PnpmRunner 四操作、warmPackument 与 B3 退避 sleep
 *    （abort 即醒）；排队期或 mutate 前 abort → rejected + ABORTED；mutate 已开始后 abort →
 *    中止在途调用并执行不可取消的回滚（failure code 保留 ABORTED，终态 rolled-back 或
 *    manual-repair）；回滚/收敛阶段不传外部 signal（不变量优先于取消）。
 * 5. 串行：模块级 FIFO promise 链，进程内互斥；不得在 runner 回调里再调
 *    runProfileTransaction；跨进程并发不在覆盖范围。
 * 6. uninstall 定序固定：validate（严格读取）→ 快照 → live-disable → 摘补丁 → remove →
 *    verify gone；失败回滚时 live 尽力反向。
 * 7. 事务内 verify 相 profile 读取用严格读取器（模块私有）：manifest 读异常 →
 *    PROFILE_MANIFEST_UNREADABLE、JSON 非法 → PROFILE_MANIFEST_INVALID、插件元数据不可读 →
 *    PLUGIN_METADATA_UNREADABLE；宽容读取只属列表页。B1/B2 自愈阶梯内部的 best-effort
 *    读取保持宽容（阶梯失败本身会进失败路径）。
 * 8. github 校验：存在键 k 使 depsNow[k] === spec 且 snapshotDeps[k] !== spec（相对前态
 *    变化，防旧依赖误命中）；无 → GITHUB_SPEC_MISMATCH。
 * 9. 拒绝的假想 seam：FsPort、时钟 port、锁 port、每 doorway 一模块、版本解析 port。
 *    npm-integrity.ts 的可注入 fs 操作是内部 seam（仅供其自测）。
 */
import { Buffer } from 'node:buffer'
import { readFile, stat } from 'node:fs/promises'
```

</details>

**依据 3 · 作者声明**：[README.md:38-42](https://github.com/iasiv5/dsh-m/blob/6cb4d214dcecc4fffe6ebf6f9afa9cd6038e6d50/README.md#L38-L42)

作者要求将社区收录与安全审查区分，并说明卸载语义。

```text
> **社区收录不是安全审查。** 6,000+ 条目录来源广泛，安装前请核对作者、代码与所需能力；能力字段缺失表示「未扫描」，不表示「未发现风险」。

## 已装插件与设置

「**已装**」只反映当前宿主 profile 的实际插件：区分市场/非市场来源，显示运行相位与可用更新，并提供开关、升级、「全部更新」和确认后卸载——批量更新逐项串行执行、遇真实失败即停，dsh-m 自身固定最后升级。相关操作进度与结果会统一记录。开关可能即时生效或需要重启，应以操作结果为准。卸载只移除插件引用，不会默默删除用户数据，疑似残留路径会单独报告。
```

#### 缺口

- 无独立采用反馈和真实恢复验证。
  **影响**：是否适合团队持续采用取决于误操作率、维护负担和兼容覆盖。
  **进一步探讨**：先做上述单插件沙盒演练，再由管理员复核写入差异及权限需求后决定扩大范围。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
