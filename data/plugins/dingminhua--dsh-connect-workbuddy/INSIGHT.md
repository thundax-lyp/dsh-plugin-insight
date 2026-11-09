# DSH Connect WorkBuddy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[893785e](https://github.com/dingminhua/dsh-connect-workbuddy/tree/893785eac560fdf5fc9e61f4d3fa264dad882eec)

<!-- BEGIN META -->
[![GitHub ★ 1,336](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=1%2C336&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/dingminhua/dsh-connect-workbuddy) [![npm 30d 86,218](https://img.shields.io/static/v1?label=npm+30d&message=86%2C218&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy) [![最新发布 2026-11-08](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-08&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-connect-workbuddy)
<!-- END META -->

> **功能**：把 WorkBuddy 国内和国际账号接入 DSH 的模型供应商插件，提供目录和可选账号池。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 核对了两个区域的独立 Host adapter、凭据与模型发现。对已有 DSH 工作流的人，它将区域模型和切换入口放到同一宿主。

> **主要限制**：[Q03](#research-q03) 单段 SSE 可能对应多次上游调用且终止帧可能由本地补出。[Q04](#research-q04) 渠道恢复会修改消息，账号池和改写开关分别控制不同路径。

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
  - [Q01 · 统一模型入口怎样替代反复切换账号或客户端？](#detail-section-11)
  - [Q02 · 本机登录与模型目录如何进入 DSH？](#detail-section-12)
  - [Q03 · 换号重试如何处理无输出、已输出与未知计费？](#detail-section-13)
  - [Q04 · 拒绝恢复与关闭开关的实际边界是什么？](#detail-section-14)
  - [Q05 · 能否对账区分重复上游执行和一次用户输出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 WorkBuddy 登录且经常在 DSH 编码的用户，希望保留同一宿主交互并按区域选择模型和管理账号。

使用官方 WorkBuddy 客户端，切换区域或账号后手动继续任务，单独核对回答和积分。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

- **界面**：DSH Web 模型选择与账号配置
- **用户命令**：manifest 声明 dsh-connect-workbuddy CLI
- **Host 路由**：DSH 国内、国际模型供应商

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| Node 22.19 所在 22 系或 24 及以上及相应 DSH peer | 启动必需 | 装载 bundle 和供应商 | 安装或注册结果待具体版本验证 |
| 相应区域的有效 WorkBuddy 凭据及网络 | 聊天必需 | 获取目录与调用模型 | 目录及调用可能失败 |
| 同区域多个可用账号 | 自动换号才需 | 提供下一个候选 | 退回原选择或向用户返回错误 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户在 DSH 检测已有 WorkBuddy 登录 | 核对目标区域及选定账户 |
| 加载 | Host 装载两路供应商并发现模型 | 目标区域的预期模型可见 |
| 执行 | 用户先用短文本请求 | 核对输出完整、请求数及余额 |
| 退出 | 用户关闭该区域并切回已有供应商 | 模型列表撤回，后续任务转原入口 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH、WorkBuddy 账号和网络 | 配置并核对区域、目录及账户 | 上游费用和初始化耗时未知 |
| 持续使用 | 上游请求、可能的额外积分与流延迟 | 审查重试、输出和账号账单 | 实际扣分取决于上游，频率未知 |
| 失败恢复 | 已验证的替代供应商或官方客户端 | 停用区域、核对账单并人工重跑 | 停用控制后续入口，已发送请求效果未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 区域模型入口 | 固定源码分别注册两路供应商和发现回调 | 当前账号和宿主能否访问所需模型 |
| 账号失败恢复 | 代码可用同区候选发起重试 | 合格任务延迟、重发及积分变化 |
| 流输出与改写 | 存在交付前重发、渠道改写与本地结束帧 | 内容保真、上游接受及客户端实际状态 |

> **思考**：[Q03](#research-q03) 单段 SSE 可能对应多次上游调用且终止帧可能由本地补出。[Q04](#research-q04) 渠道恢复会修改消息，账号池和改写开关分别控制不同路径。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 核对了两个区域的独立 Host adapter、凭据与模型发现。对已有 DSH 工作流的人，它将区域模型和切换入口放到同一宿主。

模型目录、凭据与账号排序按地区隔离。账号换路、同账号请求改写、只见标记时重发与已交付流异常由不同条件决定。客户端 SSE 终止和上游执行、收费应独立观察。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 单段 SSE 可能对应多次上游调用且终止帧可能由本地补出。[Q04](#research-q04) 渠道恢复会修改消息，账号池和改写开关分别控制不同路径。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q01](#research-q01) 已有 WorkBuddy 登录并日常使用 DSH 的用户，先核对单一区域模型与一个无敏感内容的短文本回复。[Q03](#research-q03) 发现异常扣分、缺失输出、重复调用或上游拒绝即停止，关闭该区域供应商并恢复官方客户端或原有供应商。[Q04](#research-q04) 对固定请求字节的任务先留在既有入口。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码确认双区域供应商接线、同区域换号和独立渠道恢复。实际模型访问、内容效果、积分及规则适用边界未知。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、src/index.ts、src/auth.ts、package.json、src/shim.ts、src/upstream.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根 DSH 插件的模型注册、桌面登录发现、文本代理和相关恢复路径。模型效果、媒体、签到、真实费用和市场可用性另需验证。
- 下一步：本轮为固定源码检查。下一步用两个模拟凭据和记录上游请求的假网关，比较传输断开、政策拒绝、正常文本中断、仅工具标记四种输入，分别记录每次请求和 DSH 端输出。真实账号计费需独立授权及上游账单对照。

**分析版本**

- **仓库**：[dingminhua/dsh-connect-workbuddy](https://github.com/dingminhua/dsh-connect-workbuddy)
- **版本号**：5.21.2（[固定提交 893785e](https://github.com/dingminhua/dsh-connect-workbuddy/tree/893785eac560fdf5fc9e61f4d3fa264dad882eec)）
- **版本日期**：2026-11-09（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 用逐次请求 ID 和上游账单对照客户端输出，可以定位重发和完整性问题，需先用假网关验证观测方法。

本轮为固定源码检查。下一步用两个模拟凭据和记录上游请求的假网关，比较传输断开、政策拒绝、正常文本中断、仅工具标记四种输入，分别记录每次请求和 DSH 端输出。真实账号计费需独立授权及上游账单对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 59 | 23331 | — | — | 544869 |
| .mjs | source | 17 | 3673 | 2563 | 854 | — |
| .cjs | source | 1 | 140 | 95 | 34 | — |
| .ts | source | 89 | 51207 | 23288 | 25874 | — |
| .tsx | source | 17 | 13309 | 7059 | 5960 | — |
| .ts | test | 156 | 52002 | 35217 | 12767 | — |
| .tsx | test | 47 | 13786 | 8749 | 4084 | — |

</details>

**活跃度**

[![Issue 未关闭 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=7&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 149](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=149&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+created%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z) [![近30天关闭 145](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=145&color=737b86&logo=github)](https://github.com/dingminhua/dsh-connect-workbuddy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-10T02%3A22%3A10.023Z..2026-11-09T02%3A22%3A10.023Z)



统计日期：2026-11-09。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：判断已有 WorkBuddy 账号的 DSH 用户能否用统一模型入口完成任务，且能识别自动重试的账户、上游调用和输出边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 统一模型入口怎样替代反复切换账号或客户端？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有 WorkBuddy 登录态又以 DSH 完成日常任务的人，可通过模型选择器选区域与模型。作者描述多账号切换和积分显示，固定代码确实注册两条 adapter 与配置入口。基线是保留官方客户端，遇到积分或会话问题手动选账号和迁移上下文。新入口把选择移到同一会话界面；是否减少可接受回答的等待、重做和人时仍未实测。只在官方客户端工作，或只需单个稳定账号的人，额外接入的价值较小。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:27-27](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/README.md#L27-L27)

作者描述的用户和功能

```text
一个独立的 [DeepSeek Harness (DSH)](https://github.com/deepseek-ai/deepseek-harness) bundle 插件。它把本机已登录的 WorkBuddy 账号（**国内版与国际版 WorkBuddy AI 均支持**）接到 DSH 的模型选择器，同时提供账号池、可勾选的模型管理，以及一套围绕积分的只读能力：**每次刷新按上游目录自动读取每个模型的积分倍率**（`x0.79` 这种，倍率完全由上游给出，插件不写死也不猜）、逐模型开关图片输入、多账号切换与账号池自动换号、每日签到、以及卡片与输入框里胶囊式的只读积分读数。**国内版与国际版是两个并行的供应商（`workbuddy` / `workbuddy-global`），可同时使用**；插件设置页以 tab 区分两者，方便统一管理。只需本机 WorkBuddy 的登录态，**或在浏览器里登录一次**即可。
```

**依据 2 · 作者声明**：[README.md:136-149](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/README.md#L136-L149)

作者描述的多账号操作及失败摩擦

<details>
<summary>查看原文（14行）</summary>

```text
一台机器上往往登录过多个 WorkBuddy 账号。**账号池**把这件事收成一次点击：把要用的账号勾进池子，然后「签到勾选的账号」或「测试勾选的账号」；再打开**启用账号池**，插件就会在请求失败时自动换号接着跑。

**每个区域（国内版 / 国际版）各有独立的一池**：成员与目标模型互不影响——两边的账号本来就属于不同的上游栈。**签到只有国内版有**：海外区域不显示签到按钮，也没有那一列。

> **窄栏下这张表会变成堆叠卡片。** 配置页住在设置面板里，内容列只有 **564px**（800px 面板减去 188px 导航）——五列表格塞不进去，所以窗口宽度小于 700px（量的是**表格自己**的宽度，不是视口）时，每一行改成三行：账号与操作各占一行，中间三个事实共享一行。窄栏下实测单行 **96px**（此前 157px，账号名被压成「用户75」），账号名不再截断。宽栏形态一行未改。

### 自动换号（开启账号池即生效）

- **谁来服务由排序决定**：开启账号池后，**每一次请求**都发给池子里排序最靠前的可用账号——所以「当前使用」显示的是排序的结果，不一定是你手动选的那个。排序规则见下一节。
- **失败时继续往下试**：某个请求在上游失败时，插件会**依次**用池内其他可用账号重试，直到有一个接手、或全部不可用为止；全部失败才把错误报出来（并在错误里注明尝试过几个账号）。
- **哪些失败会换号**：429 限流、402 无积分、401 凭据失效、502 网关/网络——这些都是**某个账号**的状态，换一个账号很可能就过了。
- **哪些不会**：请求本身不合法（HTTP 400）。同一个请求体换哪个账号都是同样的 400，重试只是让用户多等几轮才看到同一个错误。**流中途断开也不会重试**——字节已经发出去了，重放会让客户端看到两段拼接的回答。
- **已知不可用的账号会被跳过**：正在限流冷却期内、或凭据已被上游拒绝的成员不会参与（这也是「一键测试」的意义：测试结果直接决定谁能被选中）。**从没测试过的账号按「默认可用」参与**——刚发现的登录不该因为「还没测」就被排除。
- **手动选择不会被改写**：池子通过运行时覆盖决定「谁服务」，**从不写回你保存的选择**；关闭账号池，你选定的账号立刻完全恢复生效。这也是为什么卡片要显示「当前使用」——它可能不是你在上面选的那个，而你应该看得出来。
```

</details>

**依据 3 · 源码核查**：[cordis.patch.yml:1-6](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/cordis.patch.yml#L1-L6)

根 bundle 装载，未声明修改默认模型

```text
# Register the WorkBuddy provider without changing the profile's default
# model. The plugin reuses the WorkBuddy desktop app's sign-in; no separate
# OAuth flow is started.
- insert:
    - id: dsh-connect-workbuddy
      name: dsh-connect-workbuddy
```

**依据 4 · 源码核查**：[src/index.ts:4549-4572](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L4549-L4572)

国内、国际两条 adapter 与设置入口注册

<details>
<summary>查看原文（24行）</summary>

```text
        try {
          // Always register the route first: an empty INITIAL registration is
          // invalid (`INVALID_ADAPTER`), while `replace([])` on a live one is
          // explicitly legal. `syncRegionRegistration` below then withdraws the
          // route for a region the user has switched off, in the same synchronous
          // section, so nothing observes the transient route.
          releaseAdapterCn = registration.cn.adapter = ctx.llm.registerAdapter([WORKBUDDY_PROVIDER], adapters.cn.adapter)
          releaseAdapterGlobal = registration.global.adapter = ctx.llm.registerAdapter([WORKBUDDY_GLOBAL_PROVIDER], adapters.global.adapter)
          releaseDirectory = registration.cn.directory = ctx.llm.registerConfigurableProviders([
            {
              provider: WORKBUDDY_PROVIDER,
              displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES.cn,
              settingsNs,
              settingsPath: [],
              declared: false,
            },
            {
              provider: WORKBUDDY_GLOBAL_PROVIDER,
              displayName: WORKBUDDY_PROVIDER_DISPLAY_NAMES.global,
              settingsNs,
              settingsPath: [],
              declared: false,
            },
          ])
```

</details>

#### 缺口

- 未取得与官方客户端的同任务实际对照。
  **影响**：不能量化切换摩擦、上下文迁移或回答质量。
  **进一步探讨**：记录同一无副作用短文本任务的切换次数与合格答复。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本机登录与模型目录如何进入 DSH？

**研究主题**：功能与机制、依赖、兼容与流程

#### 完整回答

插件为每个区域构造凭据存储、目录和 shim，区域内可探测显式路径或已知桌面认证文件及其邻接备份。Host 注册两条 adapter，发现回调按 provider 取本区域凭据和上游模型，关闭区域时直接返回空目录，再从发现结果派生模型元数据。此链依赖可解析和有效的区域凭据、上游及 DSH 对应服务。固定 package 给出 Node 与宿主接口范围；账号可读、模型可列出和聊天可用是三个核对点。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1743-1759](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L1743-L1759)

每个区域独立凭据与目录

<details>
<summary>查看原文（17行）</summary>

```text
  const stacks = {} as Record<WorkBuddyRegion, WorkBuddyRegionStack>
  for (const region of REGION_KEYS) {
    // `authFile` is volatile on the 0.1.7 line: the raw config value is a live
    // cosmokit reference, and passing it through would hand the store a
    // reference object instead of a path.
    const authFile = unwrapVolatile(config.authFile)
    const store = new WorkBuddyCredentialStore({
      region,
      ...authFile === undefined ? {} : { desktopPath: authFile },
      refresh: credential => client.refreshToken(credential),
    })
    const catalog = new WorkBuddyCatalog(region)
    // This region's OWN first-sighting history, the source of the composer
    // pill's "· N 新模型". Region-scoped like the credential and pool copies:
    // the two catalogs are separate, so a CN first-sighting says nothing about
    // the international roster, and they must never overwrite each other.
    const rosterSeen = createFileRosterSeenStore(region)
```

</details>

**依据 2 · 源码核查**：[src/auth.ts:1524-1562](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/auth.ts#L1524-L1562)

显式与默认认证文件发现范围

<details>
<summary>查看原文（39行）</summary>

```text
  private async candidateFiles(): Promise<string[]> {
    const explicitPath = this.desktopPathOverride
      ?? ((process.env[WORKBUDDY_AUTH_FILE_ENV] ?? '').trim() !== ''
        ? (process.env[WORKBUDDY_AUTH_FILE_ENV] as string)
        : undefined)

    const files: string[] = []
    if (explicitPath !== undefined) {
      files.push(explicitPath)
      for (const backup of await this.backupsBeside(explicitPath)) files.push(backup)
      return files
    }

    const dirs = this.authDirs ?? defaultDesktopAuthDirs()
    const seen = new Set<string>()
    for (const dir of dirs) {
      // EVERY known live basename, not just the canonical one (issue #174): the
      // 5.7.x app writes `workbuddy-desktop-ai.info`, so probing only
      // `workbuddy-desktop.info` found the backups but never the live file.
      //
      // `backupsBeside` answers "the other .info files in this directory", so
      // running it once per live name would return the OTHER live file as a
      // backup — each file would then be scanned twice, and the second read
      // would overwrite the first's rank. The set collapses that, and the live
      // names are pushed first so their rank is decided by `fileRank`, not by
      // which branch happened to reach them.
      for (const name of WORKBUDDY_LIVE_FILENAMES) {
        const live = join(dir, name)
        if (!seen.has(live)) { seen.add(live); files.push(live) }
      }
      for (const name of WORKBUDDY_LIVE_FILENAMES) {
        for (const backup of await this.backupsBeside(join(dir, name))) {
          if (seen.has(backup)) continue
          seen.add(backup)
          files.push(backup)
        }
      }
    }
    return files
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2239-2253](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L2239-L2253)

区域凭据请求上游模型目录

<details>
<summary>查看原文（15行）</summary>

```text
  const discoverModels = async (
    region: WorkBuddyRegion,
    signal?: AbortSignal,
  ): Promise<readonly WorkBuddyModelInfo[]> => {
    const credential = await stacks[region].store.resolve()
    // The user's own selection rides along with the refresh. The upstream
    // roster may drop a model the user is running (the app channel's `cli`
    // roster dropped `minimax-m2.7` on 2026-10-21), and the runtime catalog
    // filters the roster by that selection — so without the kept ids a
    // refresh would silently withdraw the model the user is on, which is the
    // exact failure issue #32 was filed for. The document still publishes it
    // and the chat endpoint still answers for it, so it stays in the roster.
    const keep = regionStateOf(current(), region).enabledModelIds ?? []
    return client.fetchModels(credential, signal, keep)
  }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:4601-4629](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L4601-L4629)

模型发现与关闭分支接到 Host

<details>
<summary>查看原文（29行）</summary>

```text
        ctx.llm.registerModelDiscovery(settingsNs, async (request, signal) => {
          const region = regionOfProvider(request.provider ?? '')
          if (region === undefined) return []
          // A switched-off region advertises nothing: its route is withdrawn, so
          // this is defence in depth against a stale model-picker refresh.
          if (!regionEnabled(current(), region)) return []
          const discovered = await discoverModels(region, signal)
          // Load levels are stamped on the RUNTIME roster only — see
          // `withBusyLevels` for why the settings draft stays free of them.
          const live = await withBusyLevels(region, discovered, signal)
          const state = regionStateOf(current(), region)
          const next = withImageSelection(
            deriveCatalog(
              live,
              new Set(state.enabledModelIds ?? []),
              state.contextBudgets ?? {},
            ),
            // #168: a discovery read is exactly the path that reveals a NEW
            // model, so an unedited region must be seeded from the table here
            // rather than from the array a previous refresh wrote.
            effectiveImageIds(state, live),
          )
          return next.map(model => ({
            id: model.id,
            name: workBuddyDisplayName(model),
            contextWindow: model.contextWindow,
            maxTokens: model.maxTokens,
            inputModalities: workBuddyModelInput(model),
          }))
```

</details>

**依据 5 · 源码核查**：[package.json:89-108](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/package.json#L89-L108)

宿主及可选 pi-ai peer 条件

<details>
<summary>查看原文（20行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": ">=4.0.1-rc.1 <5.0.0 || >=4.0.2 <5.0.0",
    "@deepseek-ai/dsh-atomic-write": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-attachment": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-primitives": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-renderer": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-client-ui-settings": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-home-paths": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-host-webserver": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-llm-pi-ai": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/dsh-settings": ">=0.1.7-rc.1 <0.3.0-0",
    "@deepseek-ai/schemastery": ">=3.18.1-rc.1 <4.0.0 || >=3.18.2 <4.0.0",
    "@earendil-works/pi-ai": ">=0.85.0 <0.88.0 || >=1.0.0-0 <2.0.0",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@earendil-works/pi-ai": {
      "optional": true
    }
```

</details>

#### 缺口

- 区域凭据当前能否通过网关及真实 DSH picker 取决于环境。
  **影响**：源码无法确认同一个目录条目此时能够完成聊天。
  **进一步探讨**：同一次隔离验收分别检查选区、目录出现、短请求以及关闭区域后撤出。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 换号重试如何处理无输出、已输出与未知计费？

**研究主题**：缺陷与关键质疑、工程质量与复用

#### 完整回答

开启账号池时区域内按运行时排名选择，候选为空时可回退到已保存的账号。正常换号循环只在 shim 尚未开始转发结果时处理 `!ok`，跳过重复候选和客户端已取消，并排除 client、model_busy、channel_reject、model_queue。分类器另产出 `policy_reject`，它没有在这个排除列表中，因而同区域有可用候选时也可能换号，后面的策略拒绝呈现分支本身无法阻止已发生的尝试。上游 fetch 的传输异常被投影为 `server`，只能证明本机未拿到响应。普通流中断记录警告，finish 可能合成 `[DONE]`。另一分支允许仅有工具标记残留且尚未交付内容时重发，即使上游初次已返回成功响应。用户只看到一段输出并不能据此知道上游执行次数、完整性或积分。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:3969-3982](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L3969-L3982)

关闭时清空运行时覆盖，无候选时恢复保存选择

<details>
<summary>查看原文（14行）</summary>

```text
  const applyPoolSelection = async (region: WorkBuddyRegion): Promise<void> => {
    const store = stacks[region].store
    if (!poolPreferencesOf(current(), region).enabled) {
      store.setRotatedAccount(undefined)
      return
    }
    const winner = rankPool(await localPoolMembers(region), Date.now(), poolPreferencesOf(current(), region).orderAccountIds)
      .find(row => row.excludedBy === undefined)
    // Nobody usable is NOT "no account": clearing the override hands the REQUEST
    // to the saved selection, and the failure is then reported honestly instead of
    // being masked by a pool with nothing better to offer. (The card does not
    // present that fallback as healthy — see `servingAccountIsExcluded`.)
    store.setRotatedAccount(winner?.account.id)
  }
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:1658-1667](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L1658-L1667)

明确换号排除集合

<details>
<summary>查看原文（10行）</summary>

```text
    // `model_queue` joins them for a different reason: the queue is a fact about
    // the MODEL and the platform-wide line in front of it, not about this
    // credential. The next account is put in the SAME queue with the SAME
    // position, so rotating spends one real request per account to learn nothing.
    // Before it was its own kind a queue fell through to `server`/`soft_rate`
    // (the status it rides on), both of which fail over — so one queued request
    // walked the whole pool before the user was told their position.
    return kind !== 'client' && kind !== 'model_busy' && kind !== 'channel_reject'
      && kind !== 'model_queue'
  }
```

</details>

**依据 3 · 源码核查**：[src/upstream.ts:1373-1389](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/upstream.ts#L1373-L1389)

内容拒绝、账号受限与渠道拒绝独立分类

<details>
<summary>查看原文（17行）</summary>

```text
  // equivalent for real `11140` bodies while a 402, 401 or 500 that merely
  // quotes the phrase cannot reach this line at all.
  if (isAccountRestrictedBody(body)) return 'account_restricted'
  if (isContentPolicyBody(body)) return 'policy_reject'
  // AFTER the policy markers so a body that really is a content refusal keeps
  // that (more specific) reply, and BEFORE the plain 400 fallback so the channel
  // gate stops being filed as `client` — the misclassification that sent issues
  // #87–#90's reporters through account swaps that could not help.
  //
  // ISSUE #113: the whole `11128` FAMILY is classified here, by code. The old
  // rule excluded a body carrying the conversation-id wording, on the theory
  // that it must be a header problem — but that wording is not reliable (a
  // content refusal was measured carrying it), and the exclusion pushed such
  // bodies into `client`, which skips the plugin's retry ladder entirely.
  // Which member it actually is now decides the reply's ADVICE only
  // (`channelGateMemberOf`), never whether the rescue path runs.
  if (isChannelRejectBody(body)) return 'channel_reject'
```

</details>

**依据 4 · 源码核查**：[src/upstream.ts:4322-4340](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/upstream.ts#L4322-L4340)

上游发送与无响应错误分类

<details>
<summary>查看原文（19行）</summary>

```text
      const headers = {
        ...chatHeaders(credential, await this.wireIdentity(credential)),
        'Authorization': `Bearer ${credential.accessToken}`,
      }
      if (signal?.aborted === true) {
        return { ok: false, status: 0, kind: 'server', message: 'cancelled before send' }
      }
      response = await fetch(`${chatBase(credential, this.cnBaseOf())}/v2/chat/completions`, {
        method: 'POST',
        headers,
        body: bodyJson,
        ...signal === undefined ? {} : { signal },
      })
    } catch (error: unknown) {
      return { ok: false, status: 0, kind: 'server', message: `transport error: ${String(error)}` }
    }
    if (response.ok) return { ok: true, response }
    const text = (await response.text()).slice(0, ERROR_BODY_LIMIT)
    const kind = classifyUpstreamError(response.status, text)
```

</details>

**依据 5 · 源码核查**：[src/shim.ts:1899-1938](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L1899-L1938)

候选去重、取消和重复上游调用

<details>
<summary>查看原文（40行）</summary>

```text
    while (!result.ok && isFailoverWorthy(result.kind) && failoverAccount !== undefined) {
      // A client that hung up is not waiting for a better account.
      if (controller.signal.aborted) break
      recordAttempt(credential, result)
      triedAccountIds.push(workbuddyAccountId(credential))
      const next = await failoverAccount(triedAccountIds).catch(() => undefined)
      if (next === undefined) break
      // The policy is expected to skip what was already tried, and the shim does
      // not rely on it: a candidate that repeats one of them would re-send the
      // same request to the same account forever, spending real quota in a loop
      // with no upper bound. `triedAccountIds` is the only brake there is, so
      // the identity check lives here as well as in the policy.
      if (triedAccountIds.includes(workbuddyAccountId(next))) break
      // Wait before hitting another account: the upstream's rate limit (6004)
      // fires on request volume, so hammering it with zero-gap retries makes
      // every candidate hit the same wall — 4 accounts can fail in under a
      // second. The batch test already waits 400ms between accounts for exactly
      // this reason; the failover loop used to wait nothing. The wait is
      // abortable: if the client hung up we stop instead of sleeping on, and the
      // check AFTER it ends the loop rather than spending the remaining accounts
      // on requests whose signal is already dead.
      if (controller.signal.aborted) break
      await new Promise<void>(resolve => {
        if (controller.signal.aborted) return resolve()
        const timer = setTimeout(resolve, FAILOVER_ACCOUNT_GAP_MS)
        controller.signal.addEventListener('abort', () => { clearTimeout(timer); resolve() }, { once: true })
      })
      if (controller.signal.aborted) break
      logger?.warn(
        `dsh-connect-workbuddy: retrying chat on another pool account after ${result.kind} (http ${result.status})`,
      )
      // Remember WHY the switch happened and FROM which account, so the answer
      // can carry one line saying so. Recorded here rather than only logged: the
      // log is invisible to the person reading the reply, and a silent failover
      // is indistinguishable from the account they chose having answered.
      switchedFrom ??= describeAccount(credential)
      switchedBecause ??= failoverReasonText(result)
      credential = next
      result = await client.chatStream(credential, prepared, controller.signal)
    }
```

</details>

**依据 6 · 源码核查**：[src/shim.ts:689-700](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L689-L700)

流中断记录到日志

<details>
<summary>查看原文（12行）</summary>

```text
  async consume(body: ReadableStream<Uint8Array> | null): Promise<void> {
    if (body === null) return
    const source = Readable.fromWeb(body as Parameters<typeof Readable.fromWeb>[0])
    try {
      for await (const chunk of source) {
        this.push(this.decoder.decode(chunk as Buffer, { stream: true }))
      }
    } catch (error: unknown) {
      // The old pass-through logged the same way and let the response end with
      // a synthesized terminator; that behaviour is preserved by `finish()`.
      this.logger?.warn('dsh-connect-workbuddy: upstream stream failed mid-flight', error)
    }
```

</details>

**依据 7 · 源码核查**：[src/shim.ts:724-737](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L724-L737)

终止帧可能由本地补出

<details>
<summary>查看原文（14行）</summary>

```text
  /**
   * Close the response: emit the block still unfinished at end-of-stream, then
   * everything held, then the terminator.
   */
  finish(): void {
    const flushed = this.buffer?.flush()
    if (flushed !== undefined && flushed.text !== '') {
      this.noteResidue(!flushed.prose)
      this.emitContent(flushed.text)
    }
    this.closeWindow()
    if (!this.sawDone && this.res.writable) this.emitFrame('data: [DONE]\n\n')
    if (this.res.writable) this.res.end()
  }
```

</details>

**依据 8 · 源码核查**：[src/shim.ts:2294-2327](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L2294-L2327)

已接收上游成功响应后仍有无交付工具残留的重试

<details>
<summary>查看原文（34行）</summary>

```text
    const writer = new RecoveryStream(res, gate, logger, notice, onUpstreamUsage)
    await writer.consume(result.response.body)

    // The one outcome that can only be recognised AFTER the stream: the turn
    // wrote markup and nothing else, so there was never any answer to show.
    // Retrying is safe here for exactly one reason — nothing has been written,
    // because a turn that is still only markup is still being held. That is why
    // the hold exists, and why an ordinary answer never pays for it.
    if (gate !== undefined && !writer.delivered && writer.residueSeen && !controller.signal.aborted) {
      logger?.warn('dsh-connect-workbuddy: the turn produced DSML markup only; retrying it once')
      const retryTried = [...triedAccountIds, workbuddyAccountId(credential)]
      let retryCredential = credential
      for (;;) {
        const attempt = await client.chatStream(retryCredential, prepared, controller.signal)
        if (attempt.ok) {
          // The first attempt's held bytes are dropped, not shown: showing them
          // and then the retry would be the two-answers-spliced-together failure
          // the failover loop refuses to risk.
          writer.discard()
          const retried = new RecoveryStream(res, gate, logger)
          await retried.consume(attempt.response.body)
          retried.finish()
          reportFailures()
          return
        }
        recordAttempt(retryCredential, attempt)
        if (!isFailoverWorthy(attempt.kind) || failoverAccount === undefined) break
        if (controller.signal.aborted) break
        const next = await failoverAccount(retryTried).catch(() => undefined)
        if (next === undefined) break
        if (retryTried.includes(workbuddyAccountId(next))) break
        retryTried.push(workbuddyAccountId(next))
        retryCredential = next
      }
```

</details>

#### 缺口

- 缺逐次请求与上游积分对账。
  **影响**：无法由 SSE 成功、终止帧或成功换号判断上游尝试次数和费用。
  **进一步探讨**：以固定假网关验证传输断开、策略拒绝、流中断和标记残留，单独记录请求号和每次积分。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 拒绝恢复与关闭开关的实际边界是什么？

**研究主题**：工程质量与复用、效果与总成本、采用判断

#### 完整回答

配置中 `off` 仍允许收到渠道拒绝后同一账号恢复。shim 可能修改消息前缀及插入不可见字符，再发上游。更窄的实现差异是稀疏改写一旦成功，会无条件写入进程内 learned 标记，后续首发可选改写路径，因而 `off` 也无法保证后续首发始终用原字节。账号池 off 能清除轮换，但这个同账号路径独立。要保留原始请求、拒绝语义或明确定价的用户可退出该 provider，改回可信的官方客户端或已验收供应商。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:1220-1224](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L1220-L1224)

配置声明的 off、failure、always

```text
  channelPerturbation: asVolatile(
    z.union([z.const('off'), z.const('failure'), z.const('always')])
      .default('failure')
      .description('When to perturb scanned messages with invisible characters: "off" only rescues after a channel-gate refusal, "failure" (default) learns from a successful rescue and starts later requests perturbed, "always" starts every request with the dense rescue for a gateway whose plain attempt is guaranteed to fail.'),
  ) as unknown as z<'off' | 'failure' | 'always'>,
```

**依据 2 · 源码核查**：[src/shim.ts:1747-1759](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L1747-L1759)

首发由配置或 learned 标记决定

<details>
<summary>查看原文（13行）</summary>

```text
    const startPerturbed = channelPerturbation === 'always' || channelNeedsPerturbation
    const preferred = startPerturbed
      ? perturbChannelFingerprints(prepared, channelPerturbation === 'always') ?? prepared
      : prepared
    let result = await client.chatStream(credential, preferred, controller.signal)
    // A refused PERTURBED body means the rule changed under us: fall back to the
    // plain ladder and let it rediscover what works. Without this the plugin
    // could keep sending a shape that no longer helps, forever. `always` is the
    // user's explicit choice, so it is not cleared by one refusal.
    if (channelNeedsPerturbation && !result.ok && result.kind === 'channel_reject') {
      channelNeedsPerturbation = false
      logger?.warn('dsh-connect-workbuddy: a perturbed body was refused too; clearing the learned preference and retrying from the plain form')
      result = await client.chatStream(credential, prepared, controller.signal)
```

</details>

**依据 3 · 源码核查**：[src/shim.ts:1794-1832](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L1794-L1832)

渠道拒绝在同一凭据上依次恢复，稀疏成功标记无配置条件

<details>
<summary>查看原文（39行）</summary>

```text
    let retriedWithForcedHead = false
    let retriedWithPerturbation = false
    let retriedWithDensePerturbation = false
    if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
      const forced = forceNeutralHead(prepared)
      if (forced !== undefined) {
        logger?.warn('dsh-connect-workbuddy: the channel gate refused the body; retrying once with the neutral head forced in front of every opening')
        result = await client.chatStream(credential, forced, controller.signal)
        retriedWithForcedHead = true
      }
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const rescued = perturbChannelFingerprints(forced ?? prepared)
        if (rescued !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the body again; retrying once with an invisible perturbation of the scanned text')
          result = await client.chatStream(credential, rescued, controller.signal)
          retriedWithPerturbation = true
          // THE PERTURBATION IS WHAT WORKED, so remember it: the next request
          // in this process starts perturbed and skips both doomed attempts.
          // Only set on SUCCESS — a perturbation that is also refused teaches
          // nothing about what the gateway wants.
          if (result.ok) channelNeedsPerturbation = true
        }
      }
      // The dense rescue is deliberately last: it is the least byte-conservative
      // form, and the gateway's own wording gives no hint that it would be needed.
      // It exists because both measured rungs are punctuation-dependent and a
      // fingerprinted prose span can contain no punctuation at all.
      if (!result.ok && result.kind === 'channel_reject' && !controller.signal.aborted) {
        const dense = perturbChannelFingerprints(forced ?? prepared, true)
        if (dense !== undefined) {
          logger?.warn('dsh-connect-workbuddy: the channel gate refused the sparse perturbation too; retrying once with a dense word-boundary perturbation')
          result = await client.chatStream(credential, dense, controller.signal)
          retriedWithDensePerturbation = true
          // Dense is the strongest form; remembering it is safe only for the
          // `failure` policy, which exists to learn from a successful rescue.
          if (result.ok && channelPerturbation === 'failure') channelNeedsPerturbation = true
        }
      }
    }
```

</details>

**依据 4 · 源码核查**：[src/index.ts:3723-3742](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L3723-L3742)

账号池关闭时不提供换号候选

<details>
<summary>查看原文（20行）</summary>

```text
  const failoverAccountFor = async (
    region: WorkBuddyRegion,
    triedAccountIds: readonly string[],
  ): Promise<WorkBuddyCredential | undefined> => {
    if (!poolPreferencesOf(current(), region).enabled) return undefined
    const tried = new Set(triedAccountIds)
    // The saved manual order, so failover honors the user's preference order
    // (issue #70's expiry guard still outranks it, inside `rankPool`).
    const order = poolPreferencesOf(current(), region).orderAccountIds
    for (const row of rankPool(await localPoolMembers(region), Date.now(), order)) {
      // `excludedBy` carries the reason a measurement rules an account out.
      // Skipping on it is what makes "try until none is usable" mean usable
      // rather than merely "not yet tried": re-hitting an account the upstream
      // just limited would burn a round trip to learn what we already recorded.
      if (row.excludedBy !== undefined) continue
      if (tried.has(row.account.id)) continue
      const credential = await stacks[region].store.credentialFor(row.account.id)
      if (credential !== undefined) return credential
    }
    return undefined
```

</details>

**依据 5 · 源码核查**：[src/index.ts:4595-4607](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/index.ts#L4595-L4607)

区域关闭与发现限制

<details>
<summary>查看原文（13行）</summary>

```text
        // Converge both regions on the saved on/off state: a region switched off
        // while the harness was down is withdrawn here, before the startup seed
        // below. `syncRegionRegistration` is a no-op for the freshly registered
        // routes until this very call populates their handles.
        syncRegionRegistration(current())

        ctx.llm.registerModelDiscovery(settingsNs, async (request, signal) => {
          const region = regionOfProvider(request.provider ?? '')
          if (region === undefined) return []
          // A switched-off region advertises nothing: its route is withdrawn, so
          // this is defence in depth against a stale model-picker refresh.
          if (!regionEnabled(current(), region)) return []
          const discovered = await discoverModels(region, signal)
```

</details>

#### 缺口

- 改写对具体模型语义及上游对渠道的接受政策未知。
  **影响**：内容敏感、固定字节或严格对账任务的适用性无法确认。
  **进一步探讨**：在不访问实际限制渠道的假网关记录两次请求的文本差异和 off 切换效果。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 能否对账区分重复上游执行和一次用户输出？

**研究主题**：新假设与验证

#### 完整回答

固定一个无副作用纯文本任务，先用记录每次请求的模拟上游将首次应答设为处理成功后断开，然后分别让账号池关闭、开启，记录客户端可见输出及两凭据调用次数。再设响应只含未交付工具标记和正常输出后断流两个对照，比较是否再次请求。若输出可见次数与上游调用始终一致，关于输出不足以判断重发的假设未获得该样本支持。真正计费须在授权的沙盒账号独立核对上游账单，模拟计数不能替代。

#### 证据与依据

**依据 1 · 源码核查**：[src/shim.ts:1899-1938](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L1899-L1938)

正常账号轮换发送次数由失败决定

<details>
<summary>查看原文（40行）</summary>

```text
    while (!result.ok && isFailoverWorthy(result.kind) && failoverAccount !== undefined) {
      // A client that hung up is not waiting for a better account.
      if (controller.signal.aborted) break
      recordAttempt(credential, result)
      triedAccountIds.push(workbuddyAccountId(credential))
      const next = await failoverAccount(triedAccountIds).catch(() => undefined)
      if (next === undefined) break
      // The policy is expected to skip what was already tried, and the shim does
      // not rely on it: a candidate that repeats one of them would re-send the
      // same request to the same account forever, spending real quota in a loop
      // with no upper bound. `triedAccountIds` is the only brake there is, so
      // the identity check lives here as well as in the policy.
      if (triedAccountIds.includes(workbuddyAccountId(next))) break
      // Wait before hitting another account: the upstream's rate limit (6004)
      // fires on request volume, so hammering it with zero-gap retries makes
      // every candidate hit the same wall — 4 accounts can fail in under a
      // second. The batch test already waits 400ms between accounts for exactly
      // this reason; the failover loop used to wait nothing. The wait is
      // abortable: if the client hung up we stop instead of sleeping on, and the
      // check AFTER it ends the loop rather than spending the remaining accounts
      // on requests whose signal is already dead.
      if (controller.signal.aborted) break
      await new Promise<void>(resolve => {
        if (controller.signal.aborted) return resolve()
        const timer = setTimeout(resolve, FAILOVER_ACCOUNT_GAP_MS)
        controller.signal.addEventListener('abort', () => { clearTimeout(timer); resolve() }, { once: true })
      })
      if (controller.signal.aborted) break
      logger?.warn(
        `dsh-connect-workbuddy: retrying chat on another pool account after ${result.kind} (http ${result.status})`,
      )
      // Remember WHY the switch happened and FROM which account, so the answer
      // can carry one line saying so. Recorded here rather than only logged: the
      // log is invisible to the person reading the reply, and a silent failover
      // is indistinguishable from the account they chose having answered.
      switchedFrom ??= describeAccount(credential)
      switchedBecause ??= failoverReasonText(result)
      credential = next
      result = await client.chatStream(credential, prepared, controller.signal)
    }
```

</details>

**依据 2 · 源码核查**：[src/shim.ts:2294-2327](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/shim.ts#L2294-L2327)

标记未交付时的重发入口

<details>
<summary>查看原文（34行）</summary>

```text
    const writer = new RecoveryStream(res, gate, logger, notice, onUpstreamUsage)
    await writer.consume(result.response.body)

    // The one outcome that can only be recognised AFTER the stream: the turn
    // wrote markup and nothing else, so there was never any answer to show.
    // Retrying is safe here for exactly one reason — nothing has been written,
    // because a turn that is still only markup is still being held. That is why
    // the hold exists, and why an ordinary answer never pays for it.
    if (gate !== undefined && !writer.delivered && writer.residueSeen && !controller.signal.aborted) {
      logger?.warn('dsh-connect-workbuddy: the turn produced DSML markup only; retrying it once')
      const retryTried = [...triedAccountIds, workbuddyAccountId(credential)]
      let retryCredential = credential
      for (;;) {
        const attempt = await client.chatStream(retryCredential, prepared, controller.signal)
        if (attempt.ok) {
          // The first attempt's held bytes are dropped, not shown: showing them
          // and then the retry would be the two-answers-spliced-together failure
          // the failover loop refuses to risk.
          writer.discard()
          const retried = new RecoveryStream(res, gate, logger)
          await retried.consume(attempt.response.body)
          retried.finish()
          reportFailures()
          return
        }
        recordAttempt(retryCredential, attempt)
        if (!isFailoverWorthy(attempt.kind) || failoverAccount === undefined) break
        if (controller.signal.aborted) break
        const next = await failoverAccount(retryTried).catch(() => undefined)
        if (next === undefined) break
        if (retryTried.includes(workbuddyAccountId(next))) break
        retryTried.push(workbuddyAccountId(next))
        retryCredential = next
      }
```

</details>

**依据 3 · 源码核查**：[src/upstream.ts:4326-4338](https://github.com/dingminhua/dsh-connect-workbuddy/blob/893785eac560fdf5fc9e61f4d3fa264dad882eec/src/upstream.ts#L4326-L4338)

传输异常丢失上游结果信息

<details>
<summary>查看原文（13行）</summary>

```text
      if (signal?.aborted === true) {
        return { ok: false, status: 0, kind: 'server', message: 'cancelled before send' }
      }
      response = await fetch(`${chatBase(credential, this.cnBaseOf())}/v2/chat/completions`, {
        method: 'POST',
        headers,
        body: bodyJson,
        ...signal === undefined ? {} : { signal },
      })
    } catch (error: unknown) {
      return { ok: false, status: 0, kind: 'server', message: `transport error: ${String(error)}` }
    }
    if (response.ok) return { ok: true, response }
```

</details>

#### 缺口

- 没有实际对账样本。
  **影响**：只能确定可能再次发请求，无法推断记账结果。
  **进一步探讨**：先用两个模拟凭据与可计数的确定性假网关对照，记录请求 ID、客户端终止和重发。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
