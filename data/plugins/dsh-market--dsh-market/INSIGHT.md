# DSH Market

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4c33068](https://github.com/dsh-market/dsh-market/tree/4c330686ee5d761f9e05637820532d8c080947d5)

<!-- BEGIN META -->
[![GitHub ★ 12,007](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=12%2C007&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dsh-market/dsh-market) [![npm 30d 1,164,845](https://img.shields.io/static/v1?label=npm+30d&message=1%2C164%2C845&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket) [![最新发布 2026-11-10](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-10&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dshmarket)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中浏览、搜索、安装和管理社区插件。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，市场把搜索结果、操作进度、目标 profile 和宿主包管理接在一起。[Q03](#research-q03) 进一步确认了官方桌面移除再装过程的中断日志。现有机制依赖宿主管理器与目录，具体贡献是把多处状态连到操作者的同一个管理任务。

> **主要限制**：[Q03](#research-q03) 与 [Q04](#research-q04) 指出，日志结清可对应旧版或目标版，集合操作还允许部分成功。恢复后应在实际 profile 核对版本、加载和业务状态，关键数据需要独立备份。 超时后包管理器可能仍在写入，此时继续提交可能增加恢复负担。

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
  - [Q01 · 对已经可以用 Discover 或 CLI 的用户，市场为何仍有价值？](#detail-section-11)
  - [Q02 · 点击安装或更新后，变更怎样落入当前宿主的正确 profile？](#detail-section-12)
  - [Q03 · 更新中断时，恢复能覆盖哪些状态，哪些需要人工处理？](#detail-section-13)
  - [Q04 · 如何用一个可逆试用衡量合格任务的总成本？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：经常维护 DSH profile 的使用者可以在市场界面选包、发起安装或更新，查看进度并回到宿主页面核对结果。

作者在 README 说明同一目录可供新版宿主 Discover 搜索。已知准确包名和 profile 时，宿主原生插件管理页或 CLI 足以完成普通安装。市场的额外价值主要在有进度、排队和恢复需求的重复管理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 市场标签及进度面板 | 从目录选择包，跟踪操作状态 | 取决于客户端插槽与原语 |
| 安装路由 | 校验来源并提交活动 profile 的包操作 | 需可信包和可用宿主管理器 |
| 更新中断修复 | 桌面启动后尝试恢复被卸载的包 | 仅适用于相关官方桌面分支，依赖日志和管理器 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH Web 的 webServer、loader 与客户端插槽及原语 | 核心界面必需 | 挂载路由与市场界面 | 宿主缺少 UI 原语时跳过注册 |
| 目标 profile 与包管理器 | 安装和更新必需 | 写入活动 profile | 官方桌面 manager 缺接口时明确拒绝 |
| 可解析的安全 profile 目录 | 官方桌面日志修复必需 | 持久保存待重装记录 | 该修复路径无法建立 |
| 目录和目标包网络访问 | 获取条目和包时必需 | 解析来源并下载 | 访问失败可能阻断任务 |
| 宿主 Agent 服务 | 活动任务感知所需 | 协调市场变更与 Agent 活动 | 缺少服务时不会提供活动任务保护 |
| 宿主请求 gate 与登录 | 依赖宿主鉴权的 Web 部署所需 | 在市场路由前复用宿主请求拒绝 | 缺 gate 时透传，desktopHost 不经该 wrapper，需核对实际保护 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 使用者建立隔离 profile，记录目标版本并备份 | 备份能独立读取，目标包来源可核 |
| 加载 | 在宿主原生管理中装入市场，打开插件页或设置入口 | 市场可见且诊断显示目标 profile |
| 安装 | 在市场发起一个可逆的包安装，查看进度 | 宿主页显示正确包和版本 |
| 验收与退出 | 使用者验证一次核心功能，再移除并核对状态 | 错装、部分加载或移除失败时停止并按备份恢复 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | 包下载、缓存与备份占用，金额和规模未知 | 准备 profile、核对包源和宿主版本 | 用时未知 |
| 持续使用 | 目录更新及包下载流量未知 | 检查选定版本、加载与当前任务状态 | 每次所需核对耗时未知 |
| 失败恢复 | 重新下载与重新安装可能增加资源，金额未知 | 识别落盘与组合状态，必要时人工恢复 | 可恢复范围及实际时长待演练 |
| 退出 | 保存备份占用空间，大小未知 | 移除市场与测试包，再查 profile | 其他包与自有数据需独立处理 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 进度反馈 | 源码将 202 操作投影为排队并进入操作面板 | 与原生管理相比能减少多少重复操作 |
| 定位安装结果 | 源码检查新增组件与宿主加载状态 | 真实宿主的成功率 |
| 中断修复 | 特定桌面路径保存记录，启动后有条件重装 | 实际恢复时长及业务数据完整性 |

> **思考**：[Q03](#research-q03) 与 [Q04](#research-q04) 指出，日志结清可对应旧版或目标版，集合操作还允许部分成功。恢复后应在实际 profile 核对版本、加载和业务状态，关键数据需要独立备份。 超时后包管理器可能仍在写入，此时继续提交可能增加恢复负担。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 显示，市场把搜索结果、操作进度、目标 profile 和宿主包管理接在一起。[Q03](#research-q03) 进一步确认了官方桌面移除再装过程的中断日志。现有机制依赖宿主管理器与目录，具体贡献是把多处状态连到操作者的同一个管理任务。

每 profile 的待更新日志与包管理调用分开，启动时查版本和组合状态后决定重装。源码另有安装后的新增组件验证和针对部分失败的回滚分支。市场变更锁只覆盖自身管理路径；执行排队操作时会在锁内重新核对活动任务。宿主未暴露 agents 服务时，普通市场变更缺少活动任务保护。复杂宿主分流及恢复分支增加维护负担。 官方桌面更新等待截止通过竞速返回，不能据此确认管理器已停止，修复需要下次启动读取日志并核对盘面。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 与 [Q04](#research-q04) 指出，日志结清可对应旧版或目标版，集合操作还允许部分成功。恢复后应在实际 profile 核对版本、加载和业务状态，关键数据需要独立备份。 超时后包管理器可能仍在写入，此时继续提交可能增加恢复负担。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 建议先在隔离 profile 验收一个非关键包。记录宿主与包版本，在宿主原生管理页核对加载，确认能移除后再考虑扩大范围。若目标目录、加载结果或退出状态不一致，停止继续更新并从独立备份恢复。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持市场挂载、安装目标校验及官方桌面的有条件中断修复。试用建议基于源码。任务效果与各宿主的兼容性待实测，返工假设尚未验证。

- 已检查：作者 README、包清单、源码路径 src/index.ts、src/client/index.ts、cordis.patch.yml、package.json、tsconfig.json、tsdown.config.ts、src/client/MarketSection.tsx、src/routes.ts、src/http.ts、src/official-desktop.ts、src/pending-updates.ts、src/snapshot.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定提交根组件，包清单版本 1.73.18。覆盖宿主挂载、安装入口、请求边界、profile 路由、官方桌面中断修复与使用成本。主题、评论、云备份、完整兼容矩阵及全部更新 API 路径未展开。
- 下一步：在同一宿主、固定包、同一初始 profile 对照原生管理与市场路径，分别记录操作耗时、误重试、加载、故障恢复和卸载后状态。先在隔离环境验证中断，再决定是否用于常用 profile。

**分析版本**

- **仓库**：[dsh-market/dsh-market](https://github.com/dsh-market/dsh-market)
- **版本号**：1.73.18（[固定提交 4c33068](https://github.com/dsh-market/dsh-market/tree/4c330686ee5d761f9e05637820532d8c080947d5)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 提出的待验证假设是，分开显示排队、落盘与加载结果，能减少用户误以为失败而再次提交的次数。用同一隔离 profile 比较原生管理与市场路径，若误重试没有下降或额外维护耗时抵消节约，就放弃这一假设。

在同一宿主、固定包、同一初始 profile 对照原生管理与市场路径，分别记录操作耗时、误重试、加载、故障恢复和卸载后状态。先在隔离环境验证中断，再决定是否用于常用 profile。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 8 | 1214 | — | — | 19780 |
| .js | source | 1 | 19131 | 16782 | 3648 | — |
| .mjs | source | 14 | 2076 | 1435 | 525 | — |
| .ts | source | 78 | 42225 | 25683 | 14929 | — |
| .tsx | source | 13 | 13498 | 10439 | 2793 | — |
| .ts | test | 109 | 50791 | 38324 | 9068 | — |
| .tsx | test | 11 | 13563 | 11038 | 1643 | — |
| .md | test | 1 | 15 | — | — | 120 |
| .js | example | 4 | 244 | 72 | 155 | — |

</details>

**活跃度**

[![Issue 未关闭 98](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=98&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 195](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=195&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+created%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z) [![近30天关闭 134](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=134&color=737b86&logo=github)](https://github.com/dsh-market/dsh-market/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-13T01%3A48%3A39.164Z..2026-11-12T01%3A48%3A39.164Z)



统计日期：2026-11-12。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：在正确的宿主 profile 中安装或更新一个社区插件时，市场界面能改善哪些环节，出错后用户还能保留什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 对已经可以用 Discover 或 CLI 的用户，市场为何仍有价值？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

经常在同一 DSH profile 中选包、观察安装进度、处理更新失败的用户，能在市场页连续完成这些操作。市场在有对应插槽的宿主注册独立标签，并使用自己的安装状态和操作列表。作者文档同时给出了宿主 Discover 接入同一索引的办法。因此，若任务只是搜索已知包，Discover 或已知包名的 CLI 路径已经足够。

市场的增量集中在交接处：从条目发起操作、看到请求是否排队，再回到宿主已安装页核对组件。合格结果应是目标包在预期 profile 可用并达到任务所需的加载状态。市场卡片提供入口和过程反馈，宿主页面仍承担部分逐项启停工作。这个分工使收益更可能出现在反复管理插件的人群，偶发检索用户要承担额外插件自身的维护。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:12-14](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/README.md#L12-L14)

作者说明同一索引也可交给宿主 Discover，提供可比的检索替代。

```text
The plugin market inside DeepSeek Harness. On dsh 0.2.1+ it is a tab on the **Plugins** page, right next to **Installed**; on older hosts open Settings → **Plugin Market**. Browse, search, one-click install.

> 📡 **The same catalog is also a plugin market index.** On dsh 0.2.1+, open **Plugins → Discover → Index sources** and add `https://cdn.jsdelivr.net/npm/dsh-plugin-catalog/index.json`. That is this list as a format-1 index, served from npm so it loads quickly everywhere — dsh gives a source 15 seconds, and the GitHub Pages copies (`https://awesome-dsh-plugin.com/index.json` and `https://dshmarket.com/index.json`) can exceed that from some networks. The host's Discover tab and the `plugin_market` agent tool then search it.
```

**依据 2 · 作者声明**：[README.md:48-59](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/README.md#L48-L59)

作者说明三种入口和原生页逐行启停的边界。

<details>
<summary>查看原文（12行）</summary>

```text
Once it is installed, open the **Plugins** page and pick the **Plugin Market**
tab next to **Installed** (dsh 0.2.1 and newer — plain `dsh web` included, no
desktop app needed). The market is also still a section of **Settings → Plugin
Market**: on dsh 0.2.0 and older that is the only way in, and from 0.2.1 the
Settings dialog lives in the account menu. If you would rather reach it in one
click from anywhere, the market can also put its own **Plugin Market** row in
the sidebar; turn it on from the market's card under **Plugins**. All three
entries can be switched individually under **Advanced** in that card, and the
market refuses to close the last one. Going the
other way, an installed plugin's **···** menu offers **View in Plugins** on
dsh 0.2.1+: it opens the host's own page for that plugin, which is the only
place its individual rows can be switched one by one.
```

</details>

**依据 3 · 源码核查**：[src/client/index.ts:263-279](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/client/index.ts#L263-L279)

注册独立插件页标签并保留市场自己的进度、任务和取消界面。

<details>
<summary>查看原文（17行）</summary>

```text
  // props this slot hands over (`install`, `openPackage`) drive the host's own
  // install dialog and Installed list; the market brings both of its own, so
  // they are deliberately not used — routing installs through the host would
  // take the progress, the task list and the cancel with them.
  //
  // The gate (#1015): this entry is now the user's to keep or hide, but only
  // where the slot exists — on older hosts there is nothing to gate.
  const pluginsTabGate = createSectionGate(() => {
    const off = ctx.slots.register({
      name: 'plugins.tab',
      id: NS,
      order: -1,
      label: () => t('nav'),
      locale: NS,
      inject: () => ({ t }),
    }, () => buildMarketElement({ surface: 'plugins' }))
    return typeof off === 'function' ? off as () => void : () => {}
```

</details>

**依据 4 · 源码核查**：[src/client/MarketSection.tsx:4543-4561](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/client/MarketSection.tsx#L4543-L4561)

客户端把服务端 202 响应投影为排队并打开操作面板。

<details>
<summary>查看原文（19行）</summary>

```text
      .then(res => res.json().then(body => ({ status: res.status, body })))
      .then(({ status, body }) => {
        setBusyUrl(null)
        sessionStorage.removeItem('dshm-pending')
        if (status === 202 && typeof body.operationId === 'string') {
          const operation = body.operation as DrainOperationWire | undefined
          setRecords(list => patchRecord(withoutHostProjection(list, body.operationId, recordId), recordId, {
            state: 'queued',
            hostOperationId: body.operationId,
            ...(operation?.wait === null || operation?.wait === undefined
              ? {}
              : { blockedBy: operation.wait.activeAgentIds, waitSince: operation.wait.since }),
            reason: operation?.wait === null || operation?.wait === undefined
              ? t('agentBusyQueued')
              : t('agentDrainWaiting').replace('{0}', String(operation.wait.activeCount)),
          }))
          rememberDrainMarker({ operationId: body.operationId, kind: 'install', name: plugin.name, url: plugin.url })
          setOperationsOpen(true)
          return
```

</details>

#### 缺口

- 缺同一版本上用户操作路径的直接比较
  **影响**：无法量化持续管理的实际省时或减少误操作
  **进一步探讨**：在同一宿主以原生 Discover 加管理页和市场界面各完成同一包的安装与回查

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 点击安装或更新后，变更怎样落入当前宿主的正确 profile？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

市场页发送条目 URL 和可选固定版本，后端校验 POST、请求来源与目录匹配，随后在共享变更锁内解析目标。普通 Web 优先采用显式 profile 配置，其次采用 launcher 给出的 profile，再依次用启动参数和 web 默认值；只有选中 launcher 的 profile 时才同时用其目录。官方桌面分支委托运行时获取 pluginManager 并按目标 profile 校验，缺少安装、移除或取消接口就返回错误。第三方桌面按 desktopProfiles 与 desktopPnpm 绑定当前活动目录。

请求来源检查会拒绝不受信任的 Host 和明确的跨站请求，同时允许满足 Host 检查的无 Origin 调用，以兼容桌面代理。这条检查是请求来源约束，部署时仍须核对宿主的访问控制。目录命中也是选包约束，包来源和安装脚本仍需由使用方确认。客户端缺少必要的 UI 原语时会直接跳过注册，因此只看安装命令成功无法确认入口出现。

普通 Web 路由统一先调用宿主 connection.requestRejection。该接口由宿主决定请求围栏及登录拒绝，插件只转交拒绝结果，接口抛异常时返回 403。若宿主未提供该接口，插件 wrapper 直接放行到路由。desktopHost 分支跳过该 wrapper，仍会在安装路由检查来源。无 Origin 的非浏览器调用依然可能经过宿主 gate，但当前固定仓库无法确认任一具体宿主对该类请求的认证策略，不能以 Host/Origin 检查代替认证。

#### 证据与依据

**依据 1 · 源码核查**：[src/client/MarketSection.tsx:4517-4541](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/client/MarketSection.tsx#L4517-L4541)

发起安装 POST 并传入目录 URL、选定版本与可选排队策略。

<details>
<summary>查看原文（25行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7645-7698](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/routes.ts#L7645-L7698)

检查请求方法和来源，在锁内核对目录并拒绝不支持来源。

<details>
<summary>查看原文（54行）</summary>

```text
      path: '/dsh-market/install',
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
        // Set once the package is on disk, so a failure after that point is not reported as a failed install.
        let installLanded = false
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

**依据 3 · 源码核查**：[src/http.ts:224-249](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/http.ts#L224-L249)

来源防护检查及无 Origin 兼容分支。

<details>
<summary>查看原文（26行）</summary>

```text
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
```

</details>

**依据 4 · 源码核查**：[src/index.ts:392-401](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/index.ts#L392-L401)

普通 Web 的 profile 名称和目录优先级。

<details>
<summary>查看原文（10行）</summary>

```text
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
```

</details>

**依据 5 · 源码核查**：[src/index.ts:331-346](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/index.ts#L331-L346)

官方桌面绑定 profile 与 manager 查找。

<details>
<summary>查看原文（16行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[src/index.ts:434-445](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/index.ts#L434-L445)

第三方桌面绑定当前 profile 与 pnpm 服务。

<details>
<summary>查看原文（12行）</summary>

```text
    hostCtx.inject(['desktopPnpm'], (desktopCtx: Context) => {
      const current = desktopProfiles.current
      const service = (desktopCtx as unknown as { desktopPnpm: DesktopPnpmLike }).desktopPnpm
      const runtime = createDesktopPluginRuntime(service, current.dir)
      const resolved: MarketConfig = {
        profile: current.name,
        profileDirectory: current.dir,
        origin: {
          profileSource: 'desktop shell (desktopProfiles)',
          launcherAtStart: describeProfileContext(ctx.get('profileContext')),
          launcherNow: () => describeProfileContext(ctx.get('profileContext')),
        },
```

</details>

**依据 7 · 源码核查**：[src/official-desktop.ts:528-540](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/official-desktop.ts#L528-L540)

官方运行时拒绝改错 profile，manager 缺失则返回提示。

<details>
<summary>查看原文（13行）</summary>

```text
  const runPlugin: DesktopPluginRuntime['runPlugin'] = (profile, argv) => {
    if (disposed) return Promise.resolve(failure('official desktop plugin runtime is disposed', 127))
    if (profile !== profileName) return Promise.resolve(failure('refusing to change a different profile', 127))
    // A repair uses the same manager; overlapping the two would race the
    // profile's write lock and the route's single-operation rule.
    if (busy()) return Promise.resolve({ ...failure('another plugin operation is running', 127), busy: true })
    const manager = managerLookup()
    if (manager === undefined
      || typeof manager.installBundle !== 'function'
      || typeof manager.removeBundle !== 'function'
      || typeof manager.cancelInstall !== 'function') {
      return Promise.resolve(failure(OFFICIAL_PAGE_HINT, 127))
    }
```

</details>

**依据 8 · 源码核查**：[src/client/index.ts:122-135](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/client/index.ts#L122-L135)

客户端在原语缺失时提前退出。

<details>
<summary>查看原文（14行）</summary>

```text
export const inject = ['slots', 'locale', 'theme']
export function apply(ctx: MarketClientContext): void {
  // Older hosts resolve the primitives module but lack the rc.6 exports the
  // market renders with. Skip registration (market simply absent from the
  // settings list) rather than throwing mid-render and blanking the dialog.
  // Icons are different (#671): 0.1.7 renamed …14/…16 to weight names with no
  // alias. icons.ts accepts either spelling and skips a missing glyph so the
  // next rename costs one icon, not the whole page — do not fold icon gaps
  // into this hard disable.
  const mod = primitives as unknown as Record<string, unknown>
  const gaps = missingPrimitives(mod)
  if (gaps.length > 0) {
    console.warn('[dsh-market] host ui-primitives missing ' + gaps.join(', ') + ' — market section disabled (dsh web >= 0.1.0-rc.6 required)')
    return
```

</details>

**依据 9 · 源码核查**：[src/index.ts:242-251](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/index.ts#L242-L251)

按请求读取宿主 connection 服务暴露的 requestRejection。

<details>
<summary>查看原文（10行）</summary>

```text
  // The same service carries the host's request gate (#603): its fence plus
  // its browser login, the check its own API runs. Read per request for the
  // same reason as the authorities above.
  const previousGate = setRequestGateSource(() => {
    const connection = ctx.get('connection') as { requestRejection?: unknown } | undefined
    const gate = connection?.requestRejection
    return typeof gate === 'function'
      ? (request => (gate as (request: unknown) => number | undefined).call(connection, request))
      : undefined
  })
```

</details>

**依据 10 · 源码核查**：[src/routes.ts:2649-2672](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/routes.ts#L2649-L2672)

普通 Web 注册统一 wrapper，desktopHost 直接注册。

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

**依据 11 · 源码核查**：[src/http.ts:70-87](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/http.ts#L70-L87)

gate 缺失时透传，抛异常按拒绝处理，宿主拒绝则返回错误。

<details>
<summary>查看原文（18行）</summary>

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
```

</details>

#### 缺口

- 当前资料未验证各宿主版本的服务供给、代理透传与实际目录
  **影响**：不能保证每种桌面封装都出现相同入口及能完成安装
  **进一步探讨**：在实际试用宿主比对市场诊断、宿主原生页与测试 profile 的安装结果
- 未验证反向代理或桌面协议处理器对无 Origin 请求的实际会话约束
  **影响**：不能认定缺少宿主 gate 或跳过 wrapper 的部署具备管理鉴权
  **进一步探讨**：在隔离部署对 Web 无会话 POST、同源有会话 POST 及桌面协议请求分别核验实际拒绝和落盘结果

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 更新中断时，恢复能覆盖哪些状态，哪些需要人工处理？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

官方桌面 manager 返回已安装时，普通包的更新会先把旧版、目标 spec 和 profile 写入本地日志，然后移除旧包并尝试安装，安装失败保留待修复记录。市场自身更新另走覆盖路径，以免更新逻辑随卸载一起消失。日志依赖可解析的安全 profile 目录。启动修复会等之前仍在 manager 内的操作结算，有活动操作或关键依赖不可用时先退出。

修复先看磁盘安装版本和 profile 组合是否一致。已恢复到旧版或目标版时可能结清日志，所以日志消失后还要核对实际版本。缺失或未组合时会尝试目标 spec；若目标为范围，下一次解析可能和最初不同。重装失败累积到上限后需要人工处理。另有 profile 快照保护特定组成文件，业务数据、依赖文件与已执行脚本副作用超出所核查的快照范围。故障恢复的价值是减少包从活动 profile 消失后的处置步骤，使用方仍需独立备份重要状态。

截止由 Promise.race 实现，结束的是市场等待，底层 manager 可能继续写入。官方桌面更新的超时结果可标记 repairOnRestart，更新路由因此跳过对同一个 manager 的即时回滚，并等待下次启动用日志对账。操作者遇到超时应先核验宿主和目标 profile 的实际状态，避免立即重复提交。重启后仍缺包、版本偏离目标或超过自动恢复上限时，应在宿主原生管理页按已备份状态手动恢复。

#### 证据与依据

**依据 1 · 源码核查**：[src/official-desktop.ts:389-433](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/official-desktop.ts#L389-L433)

区分市场自身覆盖更新和带日志的移除再装；失败后保留记录。

<details>
<summary>查看原文（45行）</summary>

```text
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
      return installed
    }
    if (record !== undefined) context?.journal.finish(record.id)
    return installed
  } catch (error) {
    if (error instanceof DeadlineExceeded) return interrupted()
```

</details>

**依据 2 · 源码核查**：[src/official-desktop.ts:514-522](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/official-desktop.ts#L514-L522)

安全目录缺失时不创建更新日志。

```text
  const directory = safeProfileDirectory(profileName, _profileDirectory)
  const journal = directory === undefined ? undefined : PendingUpdateJournal.forProfile(directory)
  const updateContext: UpdateContext | undefined = directory === undefined || journal === undefined
    ? undefined
    : {
      profile: profileName,
      profileDirectory: directory,
      journal,
      packageManager,
```

**依据 3 · 源码核查**：[src/official-desktop.ts:672-685](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/official-desktop.ts#L672-L685)

启动修复等待上次操作，并检查 manager、目录和日志。

<details>
<summary>查看原文（14行）</summary>

```text
  const repairPendingUpdates = async (): Promise<RepairReport> => {
    const empty: RepairReport = { reinstalled: [], finished: [], failed: [], abandoned: [] }
    // An operation a previous instance started is still inside the manager:
    // its journal record is in progress, not interrupted. Let it settle first
    // — it finishes its own record on success, and a failure leaves the
    // record for exactly this repair. The operation is bounded by its own
    // deadline, so this wait is too.
    if (active === undefined) await runningOperation()?.done.catch(() => {})
    if (disposed || repairing || active !== undefined) return empty
    const manager = managerLookup()
    if (manager === undefined || directory === undefined || journal === undefined) return empty
    repairing = true
    try {
      return await repairInterruptedUpdates({ profile: profileName, profileDirectory: directory, manager, journal })
```

</details>

**依据 4 · 源码核查**：[src/pending-updates.ts:240-244](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/pending-updates.ts#L240-L244)

定义自动重装尝试上限。

```text
 * reinstalls on every boot, all of it invisible). The record is kept, so the
 * package is not forgotten; only the automatic attempt stops, and the user is
 * told where to act.
 */
export const MAX_AUTO_REPAIR_ATTEMPTS = 3
```

**依据 5 · 源码核查**：[src/pending-updates.ts:333-373](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/pending-updates.ts#L333-L373)

先检查磁盘与组合状态，再依据日志和次数决定重装。

<details>
<summary>查看原文（41行）</summary>

```text
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
```

</details>

**依据 6 · 源码核查**：[src/snapshot.ts:7-13](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/snapshot.ts#L7-L13)

列出快照的组成文件和恢复方式。

```text
 * A snapshot is a single JSON document under `<profile>/.dsh-market/
 * snapshots/<timestamp>-<seq>.json` describing the files that define the
 * profile's composition: package.json (dependency + bundle list),
 * cordis.patch.yml (the user patch layer) and state.json (market disable
 * list + groups). Version 2 records optional-file absence explicitly;
 * restoring validates every path, reconciles writes and deletions, and rolls
 * completed actions back if a later action fails.
```

**依据 7 · 源码核查**：[src/pending-updates.ts:179-201](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/pending-updates.ts#L179-L201)

Promise.race 只结束调用方等待，未对 manager 注入取消。

<details>
<summary>查看原文（23行）</summary>

```text
/**
 * Bound a manager call that the host should answer but may never do.
 *
 * The host's reconciliation has no deadline of its own, so a plugin whose
 * lifecycle never settles takes the promise with it: the route waits forever
 * and the UI keeps saying "updating". A deadline cannot cancel the host, but
 * it ends the market's wait, and the journal makes the next start finish the
 * job.
 */
export async function withDeadline<T>(work: Promise<T>, ms: number, label: string): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  try {
    return await Promise.race([
      work,
      new Promise<never>((_resolve, reject) => {
        timer = setTimeout(() => reject(new DeadlineExceeded(label, ms)), ms)
        // Never keep a finished process alive just to reject a promise.
        ;(timer as { unref?: () => void }).unref?.()
      }),
    ])
  } finally {
    if (timer !== undefined) clearTimeout(timer)
  }
```

</details>

**依据 8 · 源码核查**：[src/official-desktop.ts:590-607](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/official-desktop.ts#L590-L607)

超时标记需要重启对账，底层调用可能已写入。

<details>
<summary>查看原文（18行）</summary>

```text
      // ordinary install or uninstall needs the same bound.
      const deadline = command === 'remove' ? REMOVE_DEADLINE_MS : OPERATION_DEADLINE_MS
      operation = withDeadline(
        command === 'remove'
          ? manager.removeBundle(target)
          : installOrReinstall(manager, spec, options, updateContext),
        deadline,
        `${command} ${target}`,
      ).catch((error: unknown) => {
        if (!(error instanceof DeadlineExceeded)) throw error
        return {
          application: 'failed' as const,
          // Neither "nothing happened" nor "undo it": the manager may have
          // written the change already. The next start reconciles against
          // disk instead of the market inventing an answer here.
          repairOnRestart: true,
          error: { code: 'operation-incomplete' },
        }
```

</details>

**依据 9 · 源码核查**：[src/routes.ts:6038-6052](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/routes.ts#L6038-L6052)

更新路由遇 repairOnRestart 则跳过即时回滚。

<details>
<summary>查看原文（15行）</summary>

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
```

</details>

#### 缺口

- 未复现实机崩溃、未验证第三方插件自有数据恢复
  **影响**：不能估计中断后的可用性及人工修复时长
  **进一步探讨**：在隔离桌面 profile 试验移除完成后终止宿主，再对照启动后的版本、组合状态及独立备份
- 未验证 manager 超时后迟到写入与下一次启动修复的重叠情形
  **影响**：不能确定任何超时后的实际包状态，不能保证立即重试安全
  **进一步探讨**：隔离 profile 模拟底层调用晚于截止返回，再记录磁盘版本、组合记录、日志与启动修复是否冲突

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 如何用一个可逆试用衡量合格任务的总成本？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

建议常做插件维护且能建立隔离 profile 的用户先试一个来源已核实、可移除的非关键包。安装前记下宿主版本、目标 profile、目标包版本与备份位置，随后在市场提交操作，回到宿主已安装页核对包和版本，执行一个最低限度的功能检查，再移除并核对 profile 状态。若市场提示包已落盘但加载失败，或只完成集合的部分子项，按未达到测试目标处理。若 profile 不符或宿主服务拒绝，停止在市场继续提交，改用宿主原生管理页和独立备份恢复。

可验证的假设是，对经常安装更新的人，把排队、落盘和加载结果分开核对，会降低因错误重试带来的返工。用同一宿主版本、同一包与同一 profile 初始状态，比较市场和原生管理路径。分别计入初装市场、每次操作与人工检查、失败恢复三段耗时和资源。成功单位限定为包在目标 profile 加载并通过功能检查且可退出的任务。若耗时和错误重试未减少，或新增兼容成本超过节约，放弃假设。现有源码能说明为何该差异有可能出现，现金与实际时长仍未知。

#### 证据与依据

**依据 1 · 源码核查**：[src/routes.ts:8020-8053](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/routes.ts#L8020-L8053)

成功路径再查新增项目，集合允许部分成功并随后读已安装及准备验证加载。

<details>
<summary>查看原文（34行）</summary>

```text
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
            const conflictGroups = groupConflictsByOwner(conflicts)
            const installed = readInstalled(config.profile, activeProfileDir)
            let hot = false
            let activation: Record<string, ReturnType<typeof verifyActivation>> | undefined
```

</details>

**依据 2 · 源码核查**：[src/routes.ts:7994-8012](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/routes.ts#L7994-L8012)

某些命令错误后尝试恢复 manifest 和锁文件，端口冲突后可将已落盘视为成功。

<details>
<summary>查看原文（19行）</summary>

```text
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
```

</details>

**依据 3 · 源码核查**：[src/snapshot.ts:425-443](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/snapshot.ts#L425-L443)

快照恢复约束及失败时回滚已写文件的设计。

<details>
<summary>查看原文（19行）</summary>

```text
 * each write uses a same-directory temp + rename, and a failure mid-restore
 * rolls completed writes/deletions back to their pre-restore contents.
 * @returns the paths restored; an error result when the snapshot is unsafe,
 * unknown, or a write failed (with any partial writes rolled back).
 */
export function restoreSnapshot(profileDir: string, id: string): { ok: boolean; restored: string[]; error?: string } {
  if (!validSnapshotId(id)) {
    return { ok: false, restored: [], error: 'invalid snapshot id / 无效的快照 id' }
  }
  let parsed: unknown
  try {
    parsed = JSON.parse(readFileSync(snapshotFile(profileDir, id), 'utf8')) as unknown
  } catch {
    return { ok: false, restored: [], error: 'snapshot not found / 快照不存在' }
  }
  const validated = validateSnapshotDocument(parsed)
  if (!validated.ok) return { ok: false, restored: [], error: validated.error }
  if (validated.value.snapshot.id !== id) {
    return { ok: false, restored: [], error: 'snapshot id does not match its filename / 快照 id 与文件名不匹配' }
```

</details>

**依据 4 · 源码核查**：[src/client/MarketSection.tsx:4543-4561](https://github.com/dsh-market/dsh-market/blob/4c330686ee5d761f9e05637820532d8c080947d5/src/client/MarketSection.tsx#L4543-L4561)

单独展示排队请求，适合作为比较中识别状态的观察点。

<details>
<summary>查看原文（19行）</summary>

```text
      .then(res => res.json().then(body => ({ status: res.status, body })))
      .then(({ status, body }) => {
        setBusyUrl(null)
        sessionStorage.removeItem('dshm-pending')
        if (status === 202 && typeof body.operationId === 'string') {
          const operation = body.operation as DrainOperationWire | undefined
          setRecords(list => patchRecord(withoutHostProjection(list, body.operationId, recordId), recordId, {
            state: 'queued',
            hostOperationId: body.operationId,
            ...(operation?.wait === null || operation?.wait === undefined
              ? {}
              : { blockedBy: operation.wait.activeAgentIds, waitSince: operation.wait.since }),
            reason: operation?.wait === null || operation?.wait === undefined
              ? t('agentBusyQueued')
              : t('agentDrainWaiting').replace('{0}', String(operation.wait.activeCount)),
          }))
          rememberDrainMarker({ operationId: body.operationId, kind: 'install', name: plugin.name, url: plugin.url })
          setOperationsOpen(true)
          return
```

</details>

#### 缺口

- 缺同条件的任务实测与完整退出成本数据
  **影响**：只能提出隔离试用方案，无法确认持续采用收益
  **进一步探讨**：记录首次配置、重复操作、故障恢复各环节的用时与实际结果

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
