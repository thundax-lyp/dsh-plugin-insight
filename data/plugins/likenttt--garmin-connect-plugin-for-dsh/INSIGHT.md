# Garmin Connect

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)

源码版本：[71bb609](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/tree/71bb6095899f22b49ec3c405dd12d4cc4793b8ba)

<!-- BEGIN META -->
[![GitHub ★ 53](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=53&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Likenttt/garmin-connect-plugin-for-dsh) [![npm 30d 4,700](https://img.shields.io/static/v1?label=npm+30d&message=4%2C700&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-garmin-connect) [![最新发布 2026-11-06](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-06&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-plugin-garmin-connect)
<!-- END META -->

> **功能**：在 DSH 与 MCP 中查询 Garmin 健身健康数据，并支持本地 FIT 导出及预览确认后的训练管理。

> **亮点**：把多账号健身数据经本地认证、能力分流与共享workspace提供给DSH/MCP；训练写把参数预览和部分成功/未知显式返回，但不证明人类批准或设备接收，见 [Q02](#research-q02)至 [Q04](#research-q04)。

> **主要限制**：训练确认是调用方布尔+句柄，不是独立批准；超时不回滚，通用Retry可掩盖写未知；健康数据会进入所选模型，SDK/真实认证兼容未验，见 [Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · 插件交付了什么，哪些来自Garmin或SDK？](#detail-section-11)
  - [Q02 · 账号怎样路由到真实查询，状态变化会不会串用？](#detail-section-12)
  - [Q03 · 登录票据和会话凭据如何保留，取消边界在哪？](#detail-section-13)
  - [Q04 · 训练写入的确认、部分成功和未知结果是否被真实执行？](#detail-section-14)
  - [Q05 · 查询缓存和FIT本地导出哪些是真正边界？](#detail-section-15)
  - [Q06 · 值得如何试用，完整负担与退出是什么？](#detail-section-16)
  - [Q07 · 能推导什么可证伪方向？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有Garmin记录、接受数据进入所选模型的用户，可小范围读历史并与官方应用核对，见 [Q01](#research-q01)。

官方应用逐项看、导出后手工给模型；指标采集/推算继承Garmin，网络能力继承SDK，本插件集中账号/认证/工具与结果解释。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 条件与边界 |
| --- | --- | --- |
| 数据查询 | 供Agent解释记录 | 稳定账号/provider覆盖 |
| 浏览器认证 | 本地会话 | 官方页/身份核对/私有目录 |
| 训练管理 | 创建/排期/删除 | 句柄约束非可信人批，未知先查 |
| FIT导出 | 本地文件 | 是本地写，限额非下载前总量 |
| 共享workspace | DSH/MCP同账号状态 | 单前端退出不等全部停止 |

**流程与依赖**

#### 依赖

| 条件 | 用途 | 缺失或边界 |
| --- | --- | --- |
| Node ^20.19或>=22.13 | Host/MCP进程 | 与部署实际版本核 |
| Cordis/DSH connection/ui peers或MCP | 接入面 | 未验Host兼容 |
| Garmin账号/区域/Personal key或浏览器MFA | 查询凭据 | provider能力不同 |
| 精确维护SDK1.7.0及Personal适配 | 数据接口 | 外部SDK完整实现未审 |
| 私有目录/本地workspace凭据 | 会话/共享服务 | 同用户进程信任另核 |
| 所选模型/隐私同意 | 数据解释 | 插件本身不保证分析效果 |

#### 步骤

| 步骤 | 动作 | 判据与退路 |
| --- | --- | --- |
| 准备 | 专用profile，确认数据去向 | 无法隔离写工具就停 |
| 登录 | 已有权限或官方页受控认证 | 核真实身份/区域 |
| 查询 | 稳定ID、少量历史 | 对官方日期/单位/缺失 |
| 失败 | 分认证/限流/无数据 | 不把空当0，不盲重试写 |
| 退出 | 停适配/owner，另撤凭据 | 共享MCP仍持有时继续核 |

**效果与成本**

#### 成本

| 阶段 | 现金/资源 | 人工时间 | 边界 |
| --- | --- | --- | --- |
| 首次 | 已有账号设备/Node/浏览器 | peers/区域/登录配置 | 不为试用购订阅 |
| 持续 | Garmin API与模型usage | 过期重登/数据核对 | 真实费用未知 |
| 失败 | 读请求/可能远端写 | 认证或结果未知排查 | 写不可自动重复 |
| 退出 | 会话/FIT/教练材料 | 停共享服务/撤key | 已给模型数据不可收回 |

#### 效果

| 效果 | 支持 | 未确认 |
| --- | --- | --- |
| 数据接入 | 实际provider/账号调用链 | 指标覆盖/实时性 |
| 训练管理 | 预览/部分成功/未知状态 | 可信人批/设备同步 |
| FIT导出 | 有界归档与独占本地写 | SDK下载流/Windows权限 |
| 健身建议 | 工具/本地知识材料 | 健康/训练净效果 |

> **思考**：训练确认是调用方布尔+句柄，不是独立批准；超时不回滚，通用Retry可掩盖写未知；健康数据会进入所选模型，SDK/真实认证兼容未验，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把多账号健身数据经本地认证、能力分流与共享workspace提供给DSH/MCP；训练写把参数预览和部分成功/未知显式返回，但不证明人类批准或设备接收，见 [Q02](#research-q02)至 [Q04](#research-q04)。

有身份代际、一次性预览、结果未知和本地文件防御的实际实现；需区分同用户信任、外部SDK、客户端取消/远端完成与共享owner退出，见 [Q02](#research-q02)至 [Q05](#research-q05)。

<a id="detail-section-5"></a>

### 1.4 主要限制

训练确认是调用方布尔+句柄，不是独立批准；超时不回滚，通用Retry可掩盖写未知；健康数据会进入所选模型，SDK/真实认证兼容未验，见 [Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

试用仅限已有账号的少量历史查询，专用profile隔离写/导出，稳定ID与官方应用核对。无法确认数据去向/写权限就停止，回官方应用/手工导出，见 [Q06](#research-q06)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定Host/MCP/shared workspace、账号选择、认证持久、训练写与缓存/FIT关键路径已查；未运行或用真实账号，外部Connect SDK未完整绑定，完整UI/租约/教练存储未全审。只建议隔离查询小样本试用。

- 已检查：作者 README、包清单、源码路径 package.json、src/account-registry.ts、src/browser-auth-canary.ts、src/client-factory.ts、src/client.ts、src/client/index.tsx、src/embedded-auth-flow.ts、src/embedded-auth-runtime.ts、src/embedded-auth-server.ts、src/fit-export.ts、src/index.ts、src/mcp.ts、src/personal-client.ts、src/session-store.ts、src/tool-service.ts、src/tools/index.ts、src/utils/cache.ts、src/workspace-harness.ts、src/workspace-server.ts、src/workspace-service.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：包/Host入口、workspace Host/server/service与MCP转发、工具账号选择/registry代理、Connect查询/写deadline、Personal adapter、browser auth持久接线/flow/server、session store、tool service训练/FIT、cache与fit exporter关键路径；未执行，未完整审外部SDK、UI/租约/教练持久层和所有健康指标。
- 下一步：- 最小下一步：隔离只读查询与官方小样本对照，核账号/日期/单位和数据去向。
- 写入先用模拟上游核句柄/断回包和宿主批准，真实设备另验。
- 未进行安装、真实MFA、账户查询、写入或运动效果实验。

**分析版本**

- **仓库**：[Likenttt/garmin-connect-plugin-for-dsh](https://github.com/Likenttt/garmin-connect-plugin-for-dsh)
- **版本号**：0.1.21（[固定提交 71bb609](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/tree/71bb6095899f22b49ec3c405dd12d4cc4793b8ba)）
- **版本日期**：2026-11-06（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证方向是可信批准加阶段收据，先用三个故障/身份样本测误重试和误认完成，已有机制足够则放弃，见 [Q07](#research-q07)。

- 最小下一步：隔离只读查询与官方小样本对照，核账号/日期/单位和数据去向。
- 写入先用模拟上游核句柄/断回包和宿主批准，真实设备另验。
- 未进行安装、真实MFA、账户查询、写入或运动效果实验。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 27 | 6293 | — | — | 87792 |
| .js | source | 1 | 19 | 18 | 1 | — |
| .mjs | source | 1 | 46 | 43 | 0 | — |
| .cjs | source | 6 | 953 | 848 | 52 | — |
| .ts | source | 66 | 22529 | 20013 | 944 | — |
| .tsx | source | 5 | 2360 | 2276 | 12 | — |
| .ts | test | 64 | 24206 | 21962 | 311 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-11-06），可前往 [GitHub Issues](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核账号/认证到查询与训练写结果、共享workspace和本地导出边界，判断查询试用条件。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件交付了什么，哪些来自Garmin或SDK？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

这是0.1.21原生DSH Host/Web插件，兼有MCP/auth/workspace命令；不是Garmin客户端本身或仅Skill。面向已有Garmin数据、愿意把指定健身记录交给所选Agent解释的人，参照是官方应用逐项查/手工导出贴给模型，增量是稳定账号选择、查询格式化、浏览器登录与跨DSH/MCP共享本地workspace，以及受预览约束的训练写入。数据采集、设备指标和上游请求主要继承Garmin及SDK；把工具数量或SDK维护算自身原创不成立。读、下载本地FIT、修改训练/日历是三种权限面，不能统称只读。作者报告MFA和工具数量未在本轮运行验证；训练建议是材料/提示指导，不是已证运动效果或医疗判断。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-34](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/package.json#L1-L34)

实际包版本、导出与分发面。

<details>
<summary>查看原文（34行）</summary>

```text
{
  "name": "dsh-plugin-garmin-connect",
  "version": "0.1.21",
  "description": "A Garmin Connect plugin and MCP server with official Personal API and secure browser-based MFA for DeepSeek Harness and other AI agents",
  "main": "lib/index.js",
  "types": "lib/index.d.ts",
  "exports": {
    ".": {
      "types": "./lib/index.d.ts",
      "default": "./lib/index.js"
    },
    "./client": {
      "types": "./lib/types/client/index.d.ts",
      "default": "./lib/dsh-client.js"
    },
    "./package.json": "./package.json"
  },
  "bin": {
    "garmin-connect-mcp": "lib/mcp.js",
    "garmin-connect-auth": "lib/auth-cli.js",
    "garmin-connect-workspace": "lib/workspace-cli.js"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-ui-layout"
      ]
    }
  },
```

</details>

**依据 2 · 源码核查**：[src/index.ts:75-84](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/index.ts#L75-L84)

Host注册工具、认证RPC和面板。

<details>
<summary>查看原文（10行）</summary>

```text
    const accounts = createAccountRegistry({
      legacySeeds, baseConfig, scopeId,
      createClient: accountConfig => createGarminClient(scopeCtx, accountConfig, { allowUnconfigured: true }),
    })
    // Every consumer waits for catalog readiness and selects a current account.
    // Neither registration nor a local member list constructs/logs in SDK clients.
    registerTools(scopeCtx, accounts)
    registerEmbeddedAuthRpcAccounts(scopeCtx, accounts)
    registerCoachPanel(scopeCtx, accounts, { scopeId })
    scopeCtx.effect(() => () => accounts.close(), 'garmin-connect: account registry')
```

</details>

**依据 3 · 源码核查**：[src/client/index.tsx:86-125](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client/index.tsx#L86-L125)

Web实际注册面板/登录overlay和设置表单。

<details>
<summary>查看原文（40行）</summary>

```text
export function apply(ctx: GarminClientContext): void {
  const loginRequests = createLoginRequests()
  let openWorkspace: (() => boolean) | undefined
  let revealWorkspace: (() => void) | undefined
  const coachInjector = ctx as unknown as {
    inject(dependencies: string[], callback: (value: Parameters<typeof registerGarminCoachPanel>[0] & {
      layout: { selectPanel(id: string | null): void }
    }) => void): unknown
  }
  if (typeof coachInjector.inject === 'function') {
    coachInjector.inject(['sidebarRight', 'sidebarRightTabs', 'layout'], panelCtx => {
      openWorkspace = registerGarminCoachPanel(panelCtx, { onLogin: request => loginRequests.request(request) })
      revealWorkspace = () => {
        panelCtx.layout.selectPanel(null)
        requestAnimationFrame(() => { openWorkspace?.() })
      }
    })
  }
  ctx.slots.inject('shell.overlay', () => ctx.slots.register({
    name: 'shell.overlay',
    id: 'garmin-connect-auth',
    order: 90,
    registrant: 'dsh-plugin-garmin-connect',
  }, () => <GarminAuthOverlay ctx={ctx} loginRequests={loginRequests} />))

  // The settings service is optional on older Harness versions. Cordis runs
  // this child only once the protected config-form service is available.
  const settingsInjector = ctx as unknown as SettingsInjector
  if (typeof settingsInjector.inject === 'function') {
    settingsInjector.inject(['configForms'], settingsCtx => {
      const configSlots = settingsCtx.slots as unknown as ConfigSlotRegistry
      const refreshSettings = async () => {
        await settingsCtx.configForms.describe().ensure()
      }
      configSlots.inject('plugins.bundle.config', () => configSlots.register({
        name: 'plugins.bundle.config',
        key: 'dsh-plugin-garmin-connect',
      }, () => <GarminSettingsForm
        connection={settingsCtx.connection}
        form={settingsCtx.configForms.get('garmin-connect')}
```

</details>

**依据 4 · 源码核查**：[src/client-factory.ts:6-14](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client-factory.ts#L6-L14)

Personal与Connect提供者分流。

```text
export function createGarminClient(
  ctx: Context,
  config: Config,
  options: GarminClientOptions = {},
): GarminClientLike {
  return config.provider === 'personal'
    ? new GarminPersonalClient(config)
    : new GarminClient(ctx, config, options)
}
```

**依据 5 · 源码核查**：[src/client.ts:804-807](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L804-L807)

活动数据来自继承SDK。

```text
  /** Return the most recent activities. */
  async getActivities(start = 0, limit = 10): Promise<unknown[]> {
    const key = `activities:${start}:${limit}`
    return this.getCachedForCurrentAuth(key, () => this.gc.getActivities(start, limit))
```

**依据 6 · 源码核查**：[src/tool-service.ts:768-804](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L768-L804)

写工具实际可创建训练。

<details>
<summary>查看原文（37行）</summary>

```text
  async createWorkout(args: CreateWorkoutArgs): Promise<Record<string, unknown>> {
    const { confirmed, confirmationId, scheduleDate, ...definition } = args
    if (this.options.provider === 'personal') {
      throw new PublicToolError('Workout creation is not available through the read-only Garmin Personal API. Select a Connect web-session account.')
    }
    if (scheduleDate !== undefined) {
      validateWorkoutScheduleDate(scheduleDate, 'scheduleDate')
      this.requireWorkoutScheduling()
    }
    const validationError = validateWorkoutDef(definition)
    if (validationError) {
      throw new PublicToolError(`Invalid workout definition: ${validationError}`)
    }

    if (confirmed !== true) {
      const issuedConfirmationId = this.issueWorkoutConfirmation(definition, scheduleDate)
      return {
        requiresConfirmation: true,
        confirmationId: issuedConfirmationId,
        workoutName: definition.name,
        sport: definition.sport ?? 'running',
        stepCount: definition.steps.length,
        accountRegion: this.options.accountRegion,
        ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
        preview: { ...definition, ...(scheduleDate !== undefined ? { scheduleDate } : {}) },
        ...(scheduleDate !== undefined ? { scheduleDate } : {}),
        message:
          'Review this workout' + (scheduleDate !== undefined ? ', account and scheduled date' : '') +
          ' with the user, then call create_garmin_workout again ' +
          'with the same definition' + (scheduleDate !== undefined ? ' and scheduleDate' : '') +
          ', confirmed=true, and this confirmationId.',
      }
    }

    this.consumeWorkoutConfirmation(confirmationId, definition, scheduleDate)

    const result = await this.client.addWorkout(buildGarminWorkout(definition))
```

</details>

#### 缺口

- 没有真实Host/Garmin设备/运动效果验收。
  **影响**：功能接线不证明数据覆盖、建议正确或改善训练。
  **进一步探讨**：用一个已有账号的一小段历史数据，与官方应用核日期/单位/缺失和解释准确性。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 账号怎样路由到真实查询，状态变化会不会串用？

**研究主题**：功能与机制、依赖、兼容与流程、工程质量与复用

#### 完整回答

apply从Host baseUrl派生scope；有scope走共享workspace，无scope才直接建registry。workspace租约持有者建account registry和service，其他适配器连接它；Host定义execute转发invokeTool，MCP的accountId转换为account传入同服务。service从真实registerTools收集定义再execute，不是只有接口。账号选择等catalog ready，显式稳定ID优先，多账号缺ID拒绝，不随便默认第一位；只剩一个可自动选。每账号service缓存关联client与revision，变更订阅移除旧service，确认句柄因此不跨新实例沿用。

registry代理执行前后检查closed/enabled，返回前换代可拒绝，底层请求已发出则拒绝不等远端未发生。Connect getActivities实际调维护SDK；Personal另有API key、缓存与SDK，读前连接核settings。Personal 401/403/404清连接状态，429与526分别报告；不是用空数据代错误。Connect主要SDK是外部精确alias依赖，本轮未取得其完整固定原件，不把SDK内部正确性算已审；只支持插件边界机制。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:58-84](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/index.ts#L58-L84)

按scope选择共享/直接路径。

<details>
<summary>查看原文（27行）</summary>

```text
  // Scope local coaching records to the Host configuration, independently of
  // account additions/removals or the transient plugin fiber instance.
  ctx.inject(['loader'], scopeCtx => {
    const loader = (scopeCtx as unknown as {
      loader?: { config?: { baseUrl?: string | URL } }
    }).loader
    // Desktop may set baseUrl on the loading context before constructing the
    // Loader, leaving its optional config.baseUrl unset.
    const baseUrl = loader?.config?.baseUrl
      ?? (scopeCtx as unknown as { baseUrl?: string | URL }).baseUrl
    const scopeId = baseUrl
      ? createHash('sha256').update(String(baseUrl)).digest('hex')
      : undefined
    if (scopeId) {
      registerHarnessWorkspace(scopeCtx, { scopeId, legacySeeds, baseConfig })
      return
    }
    const accounts = createAccountRegistry({
      legacySeeds, baseConfig, scopeId,
      createClient: accountConfig => createGarminClient(scopeCtx, accountConfig, { allowUnconfigured: true }),
    })
    // Every consumer waits for catalog readiness and selects a current account.
    // Neither registration nor a local member list constructs/logs in SDK clients.
    registerTools(scopeCtx, accounts)
    registerEmbeddedAuthRpcAccounts(scopeCtx, accounts)
    registerCoachPanel(scopeCtx, accounts, { scopeId })
    scopeCtx.effect(() => () => accounts.close(), 'garmin-connect: account registry')
```

</details>

**依据 2 · 源码核查**：[src/workspace-harness.ts:37-71](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-harness.ts#L37-L71)

租约或连接、真实registry/service。

<details>
<summary>查看原文（35行）</summary>

```text
  async function initialize(): Promise<Adapter> {
    await registered
    const lease = await acquireWorkspaceLease(descriptor)
    if (!lease) {
      const remote = await connectWorkspace(descriptor)
      const applied = await remote.configure({
        cacheTtl: options.baseConfig.cacheTtl, requestTimeoutMs: options.baseConfig.requestTimeoutMs ?? 15_000,
        logLevel: options.baseConfig.logLevel, authVerbose: options.baseConfig.authVerbose === true,
        activityDetail: options.baseConfig.activityDetail, fitDownloadDir: options.baseConfig.fitDownloadDir,
      }) as { success?: boolean }
      if (applied?.success !== true) { await remote.close(); throw new Error('Could not synchronize Garmin workspace settings') }
      cleanup = () => remote.close()
      if (disposed) { await cleanup(); throw new Error('Garmin workspace is closed') }
      return remote
    }
    const accounts = createAccountRegistry({ ...options, dataDirectory: descriptor.dataDirectory,
      createClient: config => createGarminClient(ctx, config, { allowUnconfigured: true }),
    })
    let service: WorkspaceService | undefined
    let server: Awaited<ReturnType<typeof startWorkspaceServer>> | undefined
    try {
      service = createWorkspaceService(accounts, { ...descriptor, logger: ctx.logger })
      await accounts.ready()
      const accessToken = randomBytes(24).toString('hex')
      server = await startWorkspaceServer({ service, accessToken, instanceId: lease.instanceId })
      await lease.publish({ origin: server.origin, accessToken })
      cleanup = async () => {
        try { await server!.close() }
        finally {
          try { await service!.close() }
          finally { accounts.close(); await lease.close() }
        }
      }
      if (disposed) { await cleanup(); throw new Error('Garmin workspace is closed') }
      return service
```

</details>

**依据 3 · 源码核查**：[src/workspace-harness.ts:81-102](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-harness.ts#L81-L102)

Host工具转发与清理。

<details>
<summary>查看原文（22行）</summary>

```text
  // Capture the existing definitions and renderers; only execution is forwarded.
  const empty: AccountSource = { ready: async () => undefined, list: () => [], subscribe: () => () => undefined }
  const toolContext = {
    logger: ctx.logger,
    effect: (callback: () => () => void, label?: string) => ctx.effect(callback, label),
    tools: { register: (definition: WorkspaceToolDefinition) => (ctx as any).tools.register({
      ...definition, execute: async (args: unknown) => {
        try { return await (await getOwner()).invokeTool(definition.name, args) }
        catch { return { error: true, message: 'The local Garmin workspace is unavailable. Retry the request.' } }
      },
    }) },
  }
  registerTools(toolContext as unknown as Context, empty)
  registerRoutes(ctx, getOwner)
  // Finish the one-time legacy import before a separate MCP adapter can create
  // an empty catalog. Opening a browser page still requires an explicit action.
  void getOwner().catch(() => ctx.logger.error('[garmin] Could not start the shared local workspace'))
  ctx.effect(() => async () => {
    disposed = true
    await owner?.catch(() => undefined)
    await cleanup?.()
  }, 'garmin-connect: shared workspace owner')
```

</details>

**依据 4 · 源码核查**：[src/workspace-service.ts:40-69](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-service.ts#L40-L69)

定义收集与实际execute。

<details>
<summary>查看原文（30行）</summary>

```text
  registerTools(context, accounts)
  registerEmbeddedAuthRpcAccounts(context, accounts)
  const panel = new CoachPanelService(accounts, options)
  const byName = new Map(tools.map(tool => [tool.name, tool]))
  let closed = false
  return {
    tools,
    async configure(config) {
      if (closed || !runtimeConfig(config)) return { success: false, code: 'invalid' }
      await accounts.ready()
      await (accounts as Partial<MutableAccountRegistry>).reconfigure?.(config)
      return { success: true }
    },
    call: (endpoint, payload, signal) => panel.handle(endpoint, payload, signal),
    async auth(endpoint, payload, signal) {
      if (closed || !authHandler) return { success: false, code: 'unavailable' }
      const result = await authHandler(endpoint, payload, signal ?? new AbortController().signal)
      return result?.ok === true ? result.value : { success: false, code: 'unavailable' }
    },
    async invokeTool(name, args) {
      if (closed) return { error: true, message: 'Garmin workspace is unavailable. Retry the request.' }
      const tool = byName.get(name)
      if (!tool) return { error: true, message: 'Unknown Garmin tool.' }
      return tool.execute(args)
    },
    async close() {
      if (closed) return
      closed = true
      panel.close()
      await Promise.allSettled(disposers.reverse().map(dispose => Promise.resolve().then(dispose)))
```

</details>

**依据 5 · 源码核查**：[src/mcp.ts:229-244](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/mcp.ts#L229-L244)

MCP共享workspace参数映射。

<details>
<summary>查看原文（16行）</summary>

```text
    ;(server as any).registerTool(name, {
      description,
      inputSchema,
      annotations,
    }, options.workspace ? (args: Record<string, unknown>) => invokeTool(async () => {
      const { accountId, ...parameters } = args ?? {}
      const result = await options.workspace!.invokeTool(name, {
        ...parameters,
        ...(accountId === undefined ? {} : { account: accountId }),
      })
      if (result && typeof result === 'object' && (result as { error?: unknown }).error === true) {
        const message = (result as { message?: unknown }).message
        throw new PublicToolError(typeof message === 'string' ? message : 'Garmin request failed')
      }
      return result
    }) : handler)
```

</details>

**依据 6 · 源码核查**：[src/tools/index.ts:66-153](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tools/index.ts#L66-L153)

service/revision缓存与严格账号选择。

<details>
<summary>查看原文（88行）</summary>

```text
export function registerTools(ctx: Context, accountsOrSource: readonly GarminToolAccount[] | AccountSource): void {
  const registry = (ctx as any).tools
  const source = Array.isArray(accountsOrSource) ? undefined : accountsOrSource as AccountSource
  const listAccounts = (): readonly GarminToolAccount[] => source
    ? source.list() : accountsOrSource as readonly GarminToolAccount[]
  let registeredCount = 0
  const accounts = listAccounts()
  // A live registry can gain a Connect account later. Its tool catalog must
  // remain stable; the selected provider enforces the actual capability.
  const personalOnly = !source && accounts.length > 0 && accounts.every(account => account.config.provider === 'personal')
  const tools = { register: (definition: { name: string; [key: string]: unknown }) => {
    if (!personalOnly || PERSONAL_TOOL_NAMES.has(definition.name)) {
      registry.register(definition)
      registeredCount += 1
    }
  } }
  const services = new Map<string, {
    client: GarminClientLike
    revision: string | undefined
    service: GarminToolService
  }>()
  const serviceFor = (account: GarminToolAccount): GarminToolService => {
    const cached = services.get(account.accountId)
    if (cached?.client === account.client && cached.revision === account.revision) return cached.service
    const { accountId, alias, region, client, config } = account
    const service = new GarminToolService(client, {
      accountId, accountAlias: alias, provider: config.provider,
      activityDetail: config.activityDetail, fitDownloadDir: config.fitDownloadDir,
      accountUsername: config.provider === 'personal' ? `personal:${accountId}` : config.username,
      accountRegion: region,
    })
    services.set(accountId, { client, revision: account.revision, service })
    return service
  }
  if (source) {
    ctx.effect(() => {
      const unsubscribe = source.subscribe(() => {
        const current = new Map(listAccounts().map(account => [account.accountId, account]))
        for (const [id, cached] of services) {
          const account = current.get(id)
          if (!account || account.client !== cached.client || account.revision !== cached.revision) services.delete(id)
        }
      })
      return () => { unsubscribe(); services.clear() }
    }, 'garmin-connect: dynamic tool accounts')
  }
  const selectService = async (accountId?: string): Promise<GarminToolService> => {
    // Do not choose a temporary "only account" while the persisted catalog is
    // still loading. Knowledge-only calls below deliberately skip this gate.
    await source?.ready()
    const accounts = listAccounts()
    const configuredAccounts = accounts.filter(account => account.configured)
    if (accountId !== undefined && !/^[a-z][a-z0-9_-]{0,31}$/.test(accountId)) {
      throw new PublicToolError('account must be a valid Garmin account ID')
    }
    if (accountId) {
      const exact = configuredAccounts.find(account => account.accountId === accountId)
      if (exact) return serviceFor(exact)
      if (accountId === 'cn' || accountId === 'global') {
        const regional = configuredAccounts.filter(account => account.region === accountId)
        if (regional.length === 1) return serviceFor(regional[0])
        if (regional.length > 1) {
          throw new PublicToolError(`Multiple Garmin ${accountId} accounts are configured. Select a specific account ID.`)
        }
        throw new PublicToolError(`No Garmin ${accountId} account is configured. Add it in the plugin settings.`)
      }
      if (accounts.some(account => account.accountId === accountId)) {
        const selected = accounts.find(account => account.accountId === accountId)
        throw new PublicToolError(selected?.config.provider === 'personal'
          ? `Garmin account ${accountId} has no Personal API Key configured. Add it in the plugin settings.`
          : `Garmin account ${accountId} has no email configured. Add it in the plugin settings.`)
      }
      throw new PublicToolError(`Garmin account ${accountId} is not configured. Select an account ID from the plugin settings.`)
    }
    if (configuredAccounts.length === 1) return serviceFor(configuredAccounts[0])
    if (configuredAccounts.length === 0) {
      throw new PublicToolError('No Garmin account is configured. Add an account in the plugin settings.')
    }
    if (source) {
      throw new PublicToolError('Multiple Garmin accounts are configured. Call list_garmin_accounts and set account to a specific account ID.')
    }
    if (configuredAccounts.length > 5) {
      throw new PublicToolError('Multiple Garmin accounts are configured. Set account to a specific account ID from the plugin settings.')
    }
    const ids = configuredAccounts.map(account => account.alias
      ? `${account.accountId} (${JSON.stringify(account.alias)})`
      : account.accountId).join(', ')
    throw new PublicToolError(`Multiple Garmin accounts are configured. Set account to an account ID: ${ids}.`)
```

</details>

**依据 7 · 源码核查**：[src/account-registry.ts:271-290](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/account-registry.ts#L271-L290)

代理前后换代检查。

<details>
<summary>查看原文（20行）</summary>

```text
  private async invoke(holder: Holder, key: string, args: unknown[]): Promise<unknown> {
    if (this.closed || !holder.enabled) throw changedAccountError()
    await this.acquire()
    try {
      if (this.closed || !holder.enabled) throw changedAccountError()
      const client = holder.client ?? this.createPooledClient(holder)
      holder.inFlight += 1
      holder.lastUsed = Date.now()
      try {
        const method = (client as unknown as Record<string, unknown>)[key]
        if (typeof method !== 'function') throw new PublicToolError('This Garmin operation is not available for the selected account')
        const result = await method.apply(client, args)
        if (this.closed || !holder.enabled) throw changedAccountError()
        return result
      } finally {
        holder.requirement = client.getAuthenticationRequirement()
        holder.inFlight -= 1
        holder.lastUsed = Date.now()
      }
    } finally { this.release() }
```

</details>

**依据 8 · 源码核查**：[src/personal-client.ts:21-63](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/personal-client.ts#L21-L63)

Personal独立客户端与连接验证。

<details>
<summary>查看原文（43行）</summary>

```text
  constructor(private readonly config: Config, sdk?: PersonalSdk) {
    this.cache = new MemoryCache(config.cacheTtl)
    this.sdk = sdk ?? new GarminPersonalApiClient({
      apiKey: () => readPersonalApiKey(config),
      region: config.region,
      timeoutMs: config.requestTimeoutMs ?? 15_000,
      maxDownloadBytes: MAX_ZIP_BYTES,
    })
  }

  deactivate(): void {
    this.active = false
    this.connected = false
    this.lastVerifiedSettings = undefined
    this.cache.clear()
    this.sdk?.clearToken()
    this.sdk = undefined
  }

  personalApiConnected(): boolean { return this.active && this.connected }
  // Personal settings do not establish an email identity for the SSO UI.
  getAuthenticatedAccount(): undefined { return undefined }
  getAuthenticationRequirement(): undefined { return undefined }

  async connect(): Promise<void> {
    this.assertActive()
    if (!this.connecting) {
      const request = this.request(sdk => sdk.getUserProfileSettings()).then(profile => {
        if (!isRecord(profile) || !['displayName', 'measurementSystem', 'timeZone'].some(key => Object.hasOwn(profile, key))) {
          throw new PublicToolError('Garmin Personal API did not return valid account settings')
        }
        this.assertActive()
        this.connected = true
        this.lastVerifiedSettings = profile
        this.cache.invalidate('profile')
      })
      let tracked: Promise<void>
      tracked = request.catch(error => { this.connected = false; throw error }).finally(() => {
        if (this.connecting === tracked) this.connecting = undefined
      })
      this.connecting = tracked
    }
    return this.connecting
```

</details>

**依据 9 · 源码核查**：[src/personal-client.ts:77-107](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/personal-client.ts#L77-L107)

Personal错误及读缓存入口。

<details>
<summary>查看原文（31行）</summary>

```text
  private async request<T>(action: (sdk: PersonalSdk) => Promise<T>): Promise<T> {
    this.assertActive()
    try {
      const result = await action(this.sdk!)
      this.assertActive()
      return result
    } catch (error) {
      this.assertActive()
      if (error instanceof PublicToolError) throw error
      if (error instanceof PersonalApiError) {
        if (error.status === 401 || error.status === 403 || error.status === 404) this.connected = false
        if (error.status === 404) {
          throw new PublicToolError('Garmin Personal API did not recognize the API Key or resource (HTTP 404). Check the key and account availability in plugin settings.')
        }
        if (error.status === 401 || error.status === 403) {
          throw new PublicToolError(`Garmin Personal API access failed (HTTP ${error.status}). Check the API Key, expiration, and account permissions in plugin settings.`)
        }
        if (error.status === 429) throw new PublicToolError('Garmin Personal API rate limit reached; wait before retrying')
        if (error.status === 526) throw new PublicToolError('Garmin Personal API endpoint is currently unavailable (HTTP 526). Keep the selected region and retry later.')
        throw new PublicToolError(`Garmin Personal API: ${error.message}`)
      }
      throw new PublicToolError('Garmin Personal API request failed; check the local API Key configuration and connection')
    }
  }

  private async read<T>(key: string, action: (sdk: PersonalSdk) => Promise<T>): Promise<T> {
    this.assertActive()
    if (!this.connected) await this.connect()
    const result = await this.cache.getOrSet(key, () => this.request(action))
    this.assertActive()
    return result
```

</details>

**依据 10 · 源码核查**：[src/client.ts:804-807](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L804-L807)

Connect SDK活动查询。

```text
  /** Return the most recent activities. */
  async getActivities(start = 0, limit = 10): Promise<unknown[]> {
    const key = `activities:${start}:${limit}`
    return this.getCachedForCurrentAuth(key, () => this.gc.getActivities(start, limit))
```

**依据 11 · 源码核查**：[package.json:111-124](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/package.json#L111-L124)

依赖含精确维护SDK alias。

<details>
<summary>查看原文（14行）</summary>

```text
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.19.0",
    "@modelcontextprotocol/sdk": "1.30.0",
    "axios": "1.19.0",
    "axios-cookiejar-support": "5.0.5",
    "dotenv": "^16.4.0",
    "fflate": "0.8.3",
    "garmin-connect": "npm:@likenttt/garmin-connect@1.7.0",
    "tough-cookie": "5.1.2",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.1.0",
    "@deepseek-ai/dsh-client-connection": "0.2.2-rc.1",
```

</details>

#### 缺口

- 外部Connect SDK完整源码与实际兼容未绑定验收。
  **影响**：不能称所有请求/认证/指标实现已独立核完。
  **进一步探讨**：若要扩大到Connect生产使用，先绑定精确SDK归档与依赖树，核请求/刷新/错误语义，再在隔离账号环境验收。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 登录票据和会话凭据如何保留，取消边界在哪？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

浏览器流程是官方页面产生service ticket后由本地flow交换/核profile、请求身份确认，再写会话；本地runtime把confirmIdentity和writeSession真实接到认证setup。profile确认拒绝或取消在写前停止；开始saving后flow拒绝cancel，写会话提交必须await结束才报终态，不能把窗口取消等同撤销既装凭据。密码/MFA不需要作为模型工具参数，仍需信任本地插件/浏览器/Host。bridge监听loopback，Host/Origin/JSON/CSRF检查；共享workspace机器面还要求无Origin且Bearer token，浏览器面另cookie+同源+CSRF。本轮未全审租约文件权限与所有UI消息，不声称对恶意同用户进程隔离。

session文件写先限制体积、验证私有父目录、独占600临时文件、sync再rename；Windows另DACL helper，未跨平台实测。DI会话绑定用户名/区域哈希和profileId哈希；legacy无account字段时sessionFileMatchesAccount返回true，不能把所有旧文件都说成严格绑定。会话是可用凭据，并非加密保险箱；本地账号/目录权限和设备撤销策略仍重要。父目录fsync/崩溃持久性未实测，不把rename等于全平台断电安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/embedded-auth-runtime.ts:55-88](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/embedded-auth-runtime.ts#L55-L88)

认证setup与真正持久函数接线。

<details>
<summary>查看原文（34行）</summary>

```text
  const http = options.http ?? createAxiosCanaryHttpAdapter()
  const persistSession = options.writeSession ?? writeSessionTokenFile
  const prepareDestination = options.prepareDestination
    ?? prepareSessionTokenWriteDestination
  const flows = new EmbeddedAuthFlowManager({
    authenticate: async (input) => {
      await runCapturedServiceTicketDiAuthSetup(
        {
          region: input.region,
          username: input.username,
          sessionTokenFile: input.sessionTokenFile,
          serviceTicket: input.ticket.serviceTicket,
          serviceUrl: input.ticket.serviceUrl,
          loopbackOrigin: input.loopbackOrigin,
          signal: input.signal,
          confirmIdentity: input.confirmIdentity,
          onStage: stage => {
            // The flow manager owns the ticket transition so it is reported
            // once. The DI/profile stages come from this credential-free seam.
            if (stage !== 'ticket_captured') {
              reportAuthDiagnostic(options.diagnostics, stage)
            }
          },
        } satisfies CapturedServiceTicketDiAuthSetupOptions,
        {
          http,
          writeSession: (path, session) => {
            const commit = () => persistSession(path, session)
            return options.replaceSession
              ? options.replaceSession(commit)
              : commit()
          },
        },
      )
```

</details>

**依据 2 · 源码核查**：[src/browser-auth-canary.ts:360-401](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/browser-auth-canary.ts#L360-L401)

profile确认、绑定会话与提交前取消/写入。

<details>
<summary>查看原文（42行）</summary>

```text
  return async (exchanged, profile, observedAtMs) => {
    let verifiedProfile: VerifiedProfileIdentity
    let session: GarminDiSessionFile
    try {
      verifiedProfile = verifiedProfileIdentity(profile)
    } catch {
      throw new PublicToolError(SESSION_FAILED_MESSAGE)
    }

    throwIfAborted(options.signal)
    let confirmed: boolean
    try {
      confirmed = await options.confirmIdentity(verifiedProfile.publicIdentity)
    } catch {
      throwIfAborted(options.signal)
      throw new PublicToolError(IDENTITY_CONFIRMATION_FAILED_MESSAGE)
    }
    throwIfAborted(options.signal)
    if (confirmed !== true) {
      throw new PublicToolError(IDENTITY_CONFIRMATION_DECLINED_MESSAGE)
    }

    try {
      session = bindDiSessionTokensToAccount(
        sessionTokensFromExchange(exchanged, observedAtMs),
        options.username,
        options.region,
        verifiedProfile.profileId,
      )
    } catch {
      throw new PublicToolError(SESSION_FAILED_MESSAGE)
    }

    // The atomic writer is the commit point. Honour cancellation before it
    // starts, then await it fully so callers cannot report cancellation while
    // a complete session has actually been installed.
    throwIfAborted(options.signal)
    try {
      await dependencies.writeSession(options.sessionTokenFile, session)
    } catch {
      throw new PublicToolError(SESSION_WRITE_FAILED_MESSAGE)
    }
```

</details>

**依据 3 · 源码核查**：[src/embedded-auth-flow.ts:287-313](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/embedded-auth-flow.ts#L287-L313)

saving后拒绝取消。

<details>
<summary>查看原文（27行）</summary>

```text
  confirm(flowId: string, csrf: string, accepted: boolean): void {
    const flow = this.authorize(flowId, csrf)
    if (
      flow.state !== 'waiting_confirmation'
      || typeof accepted !== 'boolean'
      || !flow.confirmation
      || flow.confirmation.settled
    ) {
      throw rejection()
    }

    if (accepted) {
      flow.state = 'saving'
      reportAuthDiagnostic(this.diagnostics, 'identity_confirmation_accepted')
      reportAuthDiagnostic(this.diagnostics, 'session_persist_started')
      clearFlowTimer(flow)
      settleConfirmation(flow, true)
      return
    }
    reportAuthDiagnostic(this.diagnostics, 'identity_confirmation_declined')
    this.cancelFlow(flow)
  }

  cancel(flowId: string, csrf: string): void {
    const flow = this.authorize(flowId, csrf)
    if (flow.state === 'saving' || isTerminal(flow.state)) throw rejection()
    this.cancelFlow(flow)
```

</details>

**依据 4 · 源码核查**：[src/embedded-auth-flow.ts:392-413](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/embedded-auth-flow.ts#L392-L413)

完成与失败状态。

<details>
<summary>查看原文（22行）</summary>

```text
  private completeAuthentication(flow: EmbeddedAuthFlowRecord): void {
    if (isTerminal(flow.state)) return
    if (flow.state !== 'saving') {
      this.failFlow(flow)
      return
    }
    flow.state = 'succeeded'
    reportAuthDiagnostic(this.diagnostics, 'session_persist_succeeded')
    reportAuthDiagnostic(this.diagnostics, 'auth_flow_succeeded')
    scrubFlow(flow)
  }

  private failFlow(flow: EmbeddedAuthFlowRecord): void {
    if (isTerminal(flow.state)) return
    if (flow.state === 'saving') {
      reportAuthDiagnostic(this.diagnostics, 'session_persist_failed')
    }
    flow.state = 'failed'
    reportAuthDiagnostic(this.diagnostics, 'auth_flow_failed', 'authentication_failed')
    flow.controller.abort()
    settleConfirmation(flow, false)
    scrubFlow(flow)
```

</details>

**依据 5 · 源码核查**：[src/embedded-auth-server.ts:144-177](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/embedded-auth-server.ts#L144-L177)

真实loopback监听。

<details>
<summary>查看原文（34行）</summary>

```text
  private listen(): Promise<string> {
    return new Promise((resolve, rejectListen) => {
      const server = http.createServer((request, response) => {
        void this.handleRequest(request, response).catch(() => {
          if (!response.headersSent) {
            sendRejected(response, 400)
          } else {
            response.destroy()
          }
        })
      })
      server.maxHeadersCount = 32
      server.headersTimeout = 5_000
      server.requestTimeout = 10_000
      server.keepAliveTimeout = 1_000

      const fail = () => {
        server.close()
        rejectListen(rejection())
      }
      server.once('error', fail)
      server.listen({ host: LOOPBACK_HOST, port: 0, exclusive: true }, () => {
        server.off('error', fail)
        const address = server.address()
        if (!isLoopbackAddress(address)) {
          server.close()
          rejectListen(rejection())
          return
        }
        const hostHeader = `${LOOPBACK_HOST}:${address.port}`
        this.server = server
        this.hostHeaderValue = hostHeader
        this.originValue = `http://${hostHeader}`
        resolve(this.originValue)
```

</details>

**依据 6 · 源码核查**：[src/embedded-auth-server.ts:183-235](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/embedded-auth-server.ts#L183-L235)

Host/Origin/内容类型/CSRF要求。

<details>
<summary>查看原文（53行）</summary>

```text
    request: IncomingMessage,
    response: ServerResponse,
  ): Promise<void> {
    const origin = this.originValue
    const expectedHost = this.hostHeaderValue
    if (!origin || !expectedHost || request.headers.host !== expectedHost) {
      request.resume()
      sendRejected(response, 403)
      return
    }

    const route = parseRoute(request.url)
    if (!route) {
      request.resume()
      sendRejected(response, 404)
      return
    }

    if (!route.action) {
      if (request.method !== 'GET') {
        request.resume()
        sendRejected(response, 405)
        return
      }
      const bootstrap = normalizeBootstrap(
        await this.adapter.bridgeBootstrap(route.flowId),
        origin,
      )
      sendBridgePage(response, bootstrap, origin)
      return
    }

    if (request.method !== 'POST') {
      request.resume()
      sendRejected(response, 405)
      return
    }
    if (request.headers.origin !== origin) {
      request.resume()
      sendRejected(response, 403)
      return
    }
    if (!hasJsonContentType(request.headers['content-type'])) {
      request.resume()
      sendRejected(response, 415)
      return
    }

    const csrfHeader = request.headers['x-garmin-auth-csrf']
    if (typeof csrfHeader !== 'string') {
      request.resume()
      sendRejected(response, 403)
      return
```

</details>

**依据 7 · 源码核查**：[src/workspace-server.ts:64-85](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-server.ts#L64-L85)

机器面loopback/Host/Bearer与工具调用。

<details>
<summary>查看原文（22行）</summary>

```text
    if (!isCoachLoopback(req.socket.remoteAddress) || req.headers.host !== new URL(origin).host) return denied(res)
    let path: string
    try { path = new URL(req.url ?? '/', origin).pathname } catch { return denied(res, 400) }
    active += 1
    try {
      // Never accept browser cookies or browser-origin requests on the machine API.
      if (path.startsWith('/internal/')) {
        if (req.headers.origin || !equal(req.headers.authorization, `Bearer ${options.accessToken}`)) return denied(res)
        lastActivity = Date.now()
        if (path === '/internal/health' && req.method === 'GET') {
          return json(res, { success: true, instanceId: options.instanceId })
        }
        if (req.method !== 'POST') return denied(res, 405)
        const payload = await readJson(req)
        if (path === '/internal/open') return json(res, openPage())
        if (path === '/internal/configure') return json(res, await options.service.configure?.(payload) ?? { success: false, code: 'unavailable' })
        const match = /^\/internal\/(coach|auth|tool)\/([a-z0-9_-]+)$/.exec(path)
        if (!match) return denied(res, 404)
        const signal = requestSignal(req, res)
        const result = match[1] === 'coach' ? await options.service.call(match[2], payload, signal)
          : match[1] === 'auth' ? await options.service.auth(match[2], payload, signal)
            : await options.service.invokeTool(match[2], payload)
```

</details>

**依据 8 · 源码核查**：[src/workspace-server.ts:117-125](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-server.ts#L117-L125)

浏览器面同源/会话/CSRF。

```text
      if (!session || req.method !== 'POST' || req.headers.origin !== origin
        || !equal(req.headers['x-workspace-csrf'], session.csrf)) return denied(res)
      lastActivity = Date.now()
      const payload = await readJson(req)
      const signal = requestSignal(req, res)
      const coach = /^\/api\/garmin-coach\/([a-z-]+)$/.exec(path)
      if (coach) return json(res, { ok: true, value: await options.service.call(coach[1], payload, signal) })
      const login = /^\/api\/workspace\/login(?:\/(status|cancel|verify))?$/.exec(path)
      if (!login || !isRecord(payload) || typeof payload.accountId !== 'string' || typeof payload.expectedRevision !== 'string') return denied(res, 400)
```

**依据 9 · 源码核查**：[src/session-store.ts:210-291](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/session-store.ts#L210-L291)

实际私有文件提交/失败清理。

<details>
<summary>查看原文（82行）</summary>

```text
export async function writeSessionTokenFile(
  path: string,
  tokens: unknown,
): Promise<void> {
  if (!isSessionFile(tokens)) {
    throw new PublicToolError('Garmin session token file is invalid')
  }

  let serialized: string
  try {
    serialized = JSON.stringify(tokens)
  } catch {
    throw new PublicToolError('Garmin session token file is invalid')
  }
  if (Buffer.byteLength(serialized, 'utf8') > MAX_SESSION_FILE_BYTES) {
    throw new PublicToolError('Garmin session token file is too large')
  }

  let destination = resolve(path)
  let parent = dirname(destination)
  let temporaryPath: string | undefined
  let temporaryFile: FileHandle | undefined
  try {
    let windowsAcl: WindowsPrivateAcl | undefined
    if (process.platform === 'win32') {
      windowsAcl = await createWindowsPrivateAcl()
      // Existing directories are verified without mutation. Missing parents
      // are created by Directory.CreateDirectory(path, DirectorySecurity), so
      // the exact DACL exists atomically from the first observable instant.
      await windowsAcl.prepareDirectory(parent)
    } else {
      const prepared = await preparePosixSessionWriteDestination(destination)
      destination = prepared.destination
      parent = prepared.parent
    }

    temporaryPath = join(
      parent,
      `.${basename(destination)}.${process.pid}.${randomUUID()}.tmp`,
    )
    const parentInfo = await lstat(parent)
    if (!parentInfo.isDirectory() || parentInfo.isSymbolicLink()) {
      throw new Error('Unsafe session directory')
    }
    if (process.platform !== 'win32') {
      await verifyPrivatePosixParent(parent)
    }

    const temporaryFlags = process.platform === 'win32'
      ? 'wx'
      : constants.O_WRONLY
        | constants.O_CREAT
        | constants.O_EXCL
        | constants.O_NOFOLLOW
    temporaryFile = await open(temporaryPath, temporaryFlags, 0o600)
    // Windows ignores POSIX mode bits. Secure the still-empty file before any
    // credential bytes are written; the same-directory rename then preserves
    // this DACL on the final session file.
    await windowsAcl?.secureFile(temporaryPath)
    if (process.platform !== 'win32') {
      await verifyPrivatePosixFileHandle(temporaryFile, temporaryPath)
    }
    await temporaryFile.writeFile(serialized, { encoding: 'utf8' })
    await temporaryFile.sync()
    await temporaryFile.close()
    temporaryFile = undefined
    if (process.platform !== 'win32') {
      await verifyPrivatePosixParent(parent)
      await verifySafeExistingPosixDestination(destination)
    }
    await rename(temporaryPath, destination)
  } catch {
    await temporaryFile?.close().catch(() => undefined)
    if (temporaryPath !== undefined) {
      try {
        await unlink(temporaryPath)
      } catch {
        // The temporary file may not exist yet or may already have been renamed.
      }
    }
    throw new PublicToolError('Garmin session token file could not be written')
  }
```

</details>

**依据 10 · 源码核查**：[src/session-store.ts:562-604](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/session-store.ts#L562-L604)

DI绑定与legacy无account兼容例外。

<details>
<summary>查看原文（43行）</summary>

```text
export function bindDiSessionTokensToAccount(
  tokens: GarminDiSessionTokens,
  username: string,
  region: 'global' | 'cn',
  profileId: number,
): GarminDiSessionFile {
  if (!isValidProfileId(profileId)) {
    throw new PublicToolError('Garmin session account identity is invalid')
  }
  return {
    kind: 'di-oauth',
    schemaVersion: 2,
    clientId: tokens.clientId,
    tokens: {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      accessExpiresAtMs: tokens.accessExpiresAtMs,
      refreshExpiresAtMs: tokens.refreshExpiresAtMs,
    },
    account: {
      ...sessionAccountBinding(username, region),
      profileIdHash: profileIdHash(profileId),
    },
  }
}

export function sessionFileMatchesAccount(
  session: GarminSessionFile,
  username: string,
  region: 'global' | 'cn',
): boolean {
  if (!session.account) return true
  const expected = sessionAccountBinding(username, region)
  return session.account.usernameHash === expected.usernameHash
    && session.account.region === expected.region
}

export function sessionFileMatchesProfile(
  session: GarminSessionFile,
  profileId: number,
): boolean {
  if (!isDiSessionFile(session) || !isValidProfileId(profileId)) return false
  return session.account.profileIdHash === profileIdHash(profileId)
```

</details>

#### 缺口

- 没有真实MFA/浏览器政策、跨平台ACL或租约存储审计。
  **影响**：作者成功自述不代同版本部署保证，不能称整个本地系统安全。
  **进一步探讨**：隔离profile核身份错配/取消前后/写盘失败与实际会话文件；扩大共享workspace前补审descriptor/token文件和UI消息。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 训练写入的确认、部分成功和未知结果是否被真实执行？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

create先校验定义，未confirmed返回预览UUID；再次须同定义/日期、同账号身份的未过期一次性句柄，消费发生在远端写之前。schedule还重读训练详情哈希防预览后变化；delete/unschedule也核当前详情再写。Personal provider明确拒这些写。这个协议约束参数/账号和重放，confirmed布尔仍来自调用方，提示“和用户确认”不是独立可信的人类批准状态；Host或模型若自行回传句柄并不能由本插件证明批准发生，需宿主另管。

创建与排期是两次远端动作：已创建但无workoutId会报partialSuccess且排期not_attempted；排期失败报unconfirmed/outcomeUnknown并要求先读日历，不重复create。success排期只代表Connect日历接受，deviceSync=pending，未证手表接收。Connect写路径不做认证/限流/超时后自动重放，清列表缓存让复查走新读；超时是Promise.race，本地截止不必终止SDK网络。句柄内存保存、schedule同目标并行集也是进程内，非持久幂等；重启/新预览不能保证远端只写一次。共享Host转发catch笼统建议Retry在写失败时尤其不能机械照做，需先官方库/日历确认。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool-service.ts:768-865](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L768-L865)

创建预览与真实写、两阶段部分成功/未知/设备待同步。

<details>
<summary>查看原文（98行）</summary>

```text
  async createWorkout(args: CreateWorkoutArgs): Promise<Record<string, unknown>> {
    const { confirmed, confirmationId, scheduleDate, ...definition } = args
    if (this.options.provider === 'personal') {
      throw new PublicToolError('Workout creation is not available through the read-only Garmin Personal API. Select a Connect web-session account.')
    }
    if (scheduleDate !== undefined) {
      validateWorkoutScheduleDate(scheduleDate, 'scheduleDate')
      this.requireWorkoutScheduling()
    }
    const validationError = validateWorkoutDef(definition)
    if (validationError) {
      throw new PublicToolError(`Invalid workout definition: ${validationError}`)
    }

    if (confirmed !== true) {
      const issuedConfirmationId = this.issueWorkoutConfirmation(definition, scheduleDate)
      return {
        requiresConfirmation: true,
        confirmationId: issuedConfirmationId,
        workoutName: definition.name,
        sport: definition.sport ?? 'running',
        stepCount: definition.steps.length,
        accountRegion: this.options.accountRegion,
        ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
        preview: { ...definition, ...(scheduleDate !== undefined ? { scheduleDate } : {}) },
        ...(scheduleDate !== undefined ? { scheduleDate } : {}),
        message:
          'Review this workout' + (scheduleDate !== undefined ? ', account and scheduled date' : '') +
          ' with the user, then call create_garmin_workout again ' +
          'with the same definition' + (scheduleDate !== undefined ? ' and scheduleDate' : '') +
          ', confirmed=true, and this confirmationId.',
      }
    }

    this.consumeWorkoutConfirmation(confirmationId, definition, scheduleDate)

    const result = await this.client.addWorkout(buildGarminWorkout(definition))
    if (scheduleDate !== undefined) {
      let workoutId: string
      try {
        workoutId = canonicalGarminResourceId(result?.workoutId, 'workoutId')
      } catch {
        return {
          success: false,
          partialSuccess: true,
          workoutCreated: true,
          workoutId: null,
          workoutName: definition.name,
          scheduleDate,
          accountRegion: this.options.accountRegion,
          ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
          scheduling: { status: 'not_attempted', outcomeUnknown: false },
          message: 'The workout creation request succeeded, but Garmin did not return a usable workoutId. Scheduling was not attempted. Read get_garmin_workouts to find the created workout; do not repeat create_garmin_workout. Then use schedule_garmin_workout with a new preview and confirmation.',
        }
      }
      try {
        const scheduled = await this.writeWorkoutSchedule(workoutId, scheduleDate)
        return {
          success: true,
          workoutCreated: true,
          workoutId,
          workoutName: definition.name,
          scheduleDate,
          accountRegion: this.options.accountRegion,
          ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
          ...workoutScheduleIdentity(scheduled),
          scheduling: { status: 'scheduled', date: scheduleDate },
          deviceSync: 'pending',
          message: `Workout "${definition.name}" was created and scheduled for ${scheduleDate} in Garmin Connect. Waiting for the compatible device's next normal Garmin Connect sync; delivery to the watch has not been verified.`,
        }
      } catch (error) {
        return {
          success: false,
          partialSuccess: true,
          workoutCreated: true,
          workoutId,
          workoutName: definition.name,
          scheduleDate,
          accountRegion: this.options.accountRegion,
          ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
          scheduling: { status: 'unconfirmed', outcomeUnknown: true },
          error: publicErrorMessage(error, 'Garmin scheduling failed; the calendar write outcome is unknown.'),
          recovery: {
            tool: 'get_garmin_scheduled_workouts',
            arguments: { startDate: scheduleDate, endDate: scheduleDate },
            nextToolIfMissing: 'schedule_garmin_workout',
            nextArguments: { workoutId, date: scheduleDate },
          },
          message: 'The workout was created, but scheduling could not be confirmed. Do not repeat create_garmin_workout. First read the calendar for the requested date; if the entry is absent, use schedule_garmin_workout for this workoutId with a new preview and user confirmation.',
        }
      }
    }
    return {
      success: true,
      workoutId: result.workoutId ?? null,
      workoutName: definition.name,
      message: `Workout "${definition.name}" was created in the Garmin workout library.`,
    }
```

</details>

**依据 2 · 源码核查**：[src/tool-service.ts:868-919](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L868-L919)

句柄绑定、一次消费与过期。

<details>
<summary>查看原文（52行）</summary>

```text
  private issueWorkoutConfirmation(definition: WorkoutDef, scheduleDate?: string): string {
    this.pruneWorkoutConfirmations()
    while (this.workoutConfirmations.size >= MAX_PENDING_CONFIRMATIONS) {
      const oldest = this.workoutConfirmations.keys().next().value
      if (oldest === undefined) break
      this.workoutConfirmations.delete(oldest)
    }

    const confirmationId = randomUUID()
    this.workoutConfirmations.set(confirmationId, {
      definitionHash: workoutDefinitionHash({ ...definition, ...(scheduleDate !== undefined ? { scheduleDate } : {}) }),
      accountUsername: this.options.accountUsername,
      accountRegion: this.options.accountRegion,
      accountId: this.options.accountId,
      expiresAt: Date.now() + CONFIRMATION_TTL_MS,
    })
    return confirmationId
  }

  private consumeWorkoutConfirmation(
    confirmationId: string | undefined,
    definition: WorkoutDef,
    scheduleDate?: string,
  ): void {
    this.pruneWorkoutConfirmations()
    if (!confirmationId) {
      throw new PublicToolError(
        'Invalid workout confirmation: request a preview and provide its confirmationId',
      )
    }

    const pending = this.workoutConfirmations.get(confirmationId)
    this.workoutConfirmations.delete(confirmationId)
    if (!pending || !this.workoutConfirmationMatchesAccount(pending)
      || pending.definitionHash !== workoutDefinitionHash({ ...definition, ...(scheduleDate !== undefined ? { scheduleDate } : {}) })) {
      throw new PublicToolError(
        'Invalid workout confirmation: the preview is missing, expired, already used, or changed',
      )
    }
  }

  private workoutConfirmationMatchesAccount(pending: PendingWorkoutConfirmation): boolean {
    return pending.accountUsername === this.options.accountUsername
      && pending.accountRegion === this.options.accountRegion
      && pending.accountId === this.options.accountId
  }

  private pruneWorkoutConfirmations(): void {
    const now = Date.now()
    for (const [id, confirmation] of this.workoutConfirmations) {
      if (confirmation.expiresAt <= now) this.workoutConfirmations.delete(id)
    }
```

</details>

**依据 3 · 源码核查**：[src/tool-service.ts:408-501](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L408-L501)

排期重读/哈希、进程内并行集。

<details>
<summary>查看原文（94行）</summary>

```text
  async scheduleWorkout(args: ScheduleWorkoutArgs): Promise<Record<string, unknown>> {
    validateWorkoutManagementArgs(args, ['workoutId', 'date', 'confirmed', 'confirmationId'])
    if (args.confirmed !== undefined && typeof args.confirmed !== 'boolean') {
      throw new PublicToolError('confirmed must be a boolean')
    }
    if (args.confirmationId !== undefined
      && (typeof args.confirmationId !== 'string' || args.confirmationId.trim().length === 0)) {
      throw new PublicToolError('confirmationId must be a non-empty string')
    }
    if (args.confirmed !== true && args.confirmationId !== undefined) {
      throw new PublicToolError('A confirmationId can only be used with confirmed=true')
    }
    const pending = args.confirmed === true && args.confirmationId !== undefined
      ? this.workoutScheduleConfirmations.get(args.confirmationId)
      : undefined
    if (args.confirmed === true && args.confirmationId !== undefined) {
      this.workoutScheduleConfirmations.delete(args.confirmationId)
    }
    const workoutId = canonicalGarminResourceId(args.workoutId, 'workoutId')
    validateWorkoutScheduleDate(args.date)
    this.requireWorkoutScheduling()
    const read = this.client.getWorkoutDetail
    if (typeof read !== 'function') throw unsupportedWorkoutManagement()

    if (args.confirmed === true
      && (!pending || pending.expiresAt <= Date.now()
        || pending.workoutId !== workoutId || pending.date !== args.date
        || !this.workoutConfirmationMatchesAccount(pending))) {
      throw invalidWorkoutRemovalConfirmation()
    }
    const detail = validateWorkoutRemovalDetail(await read.call(this.client, workoutId), 'deleteWorkout', workoutId)
    const definitionHash = workoutRemovalDetailHash(detail)
    const preview = {
      ...workoutRemovalPreview(detail, 'deleteWorkout', workoutId, this.options.accountRegion),
      action: 'schedule_workout',
      date: args.date,
      ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
    }
    if (args.confirmed === true) {
      if (!this.workoutConfirmationMatchesAccount(pending!)) {
        throw invalidWorkoutRemovalConfirmation()
      }
      if (pending!.definitionHash !== definitionHash) {
        throw new PublicToolError('The workout changed after the preview; request a new preview and user confirmation')
      }
      const result = await this.writeWorkoutSchedule(workoutId, args.date)
      return {
        success: true,
        ...preview,
        ...workoutScheduleIdentity(result),
        deviceSync: 'pending',
        message: 'The workout was scheduled in the Garmin Connect calendar. It will be downloaded by a compatible device on its next normal Garmin Connect sync; delivery to the watch has not been verified.',
      }
    }

    pruneWorkoutConfirmationMap(this.workoutScheduleConfirmations)
    const confirmationId = randomUUID()
    this.workoutScheduleConfirmations.set(confirmationId, {
      workoutId,
      date: args.date,
      definitionHash,
      accountUsername: this.options.accountUsername,
      accountRegion: this.options.accountRegion,
      accountId: this.options.accountId,
      expiresAt: Date.now() + CONFIRMATION_TTL_MS,
    })
    return {
      requiresConfirmation: true,
      confirmationId,
      expiresInSeconds: CONFIRMATION_TTL_MS / 1000,
      preview,
      message: 'Review this workout, account and date with the user. Only after explicit approval, call schedule_garmin_workout with the same workoutId and date, confirmed=true, and this confirmationId. This adds one calendar entry and does not move or cancel existing entries.',
    }
  }

  private requireWorkoutScheduling(): void {
    if (this.options.provider === 'personal') {
      throw new PublicToolError('Calendar scheduling is not available through the read-only Garmin Personal API. Select a Connect web-session account.')
    }
    if (typeof this.client.scheduleWorkout !== 'function') throw unsupportedWorkoutManagement()
  }

  private async writeWorkoutSchedule(workoutId: string, date: string): Promise<unknown> {
    this.requireWorkoutScheduling()
    const key = `${workoutId}:${date}`
    if (this.workoutScheduleWrites.has(key)) {
      throw new PublicToolError('Scheduling for this workout and date is already in progress; verify the calendar with a read-only query before requesting another preview')
    }
    this.workoutScheduleWrites.add(key)
    try {
      return await this.client.scheduleWorkout!(workoutId, date)
    } finally {
      this.workoutScheduleWrites.delete(key)
    }
```

</details>

**依据 4 · 源码核查**：[src/tool-service.ts:547-573](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L547-L573)

删除/取消读后核hash再实际写。

<details>
<summary>查看原文（27行）</summary>

```text
    if (args.confirmed === true) {
      if (!pending
        || pending.expiresAt <= Date.now()
        || pending.operation !== operation
        || pending.targetId !== targetId
        || pending.accountUsername !== this.options.accountUsername
        || pending.accountRegion !== this.options.accountRegion
        || pending.accountId !== this.options.accountId) {
        throw invalidWorkoutRemovalConfirmation()
      }
      const detail = validateWorkoutRemovalDetail(await read.call(this.client, targetId), operation, targetId)
      if (pending.detailHash !== workoutRemovalDetailHash(detail)) {
        throw new PublicToolError('The workout changed after the preview; request a new preview and user confirmation')
      }
      // A resolved 204/empty response is success. Never retry a destructive request.
      await write.call(this.client, targetId)
      return {
        success: true,
        [idField]: targetId,
        accountRegion: this.options.accountRegion,
        ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
        action: operation === 'deleteWorkout' ? 'delete_workout' : 'cancel_scheduled_workout',
        ...(operation === 'unscheduleWorkout' ? { workoutTemplatePreserved: true } : {}),
        message: operation === 'deleteWorkout'
          ? 'The workout was deleted from the Garmin workout library.'
          : 'The workout calendar entry was cancelled; the workout library template was preserved.',
      }
```

</details>

**依据 5 · 源码核查**：[src/client.ts:1050-1075](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L1050-L1075)

远端写不重放、缓存失效与deadline。

<details>
<summary>查看原文（26行）</summary>

```text
  /** Never replay a write after authentication, rate-limit or timeout errors. */
  private async mutateWorkoutResource<T>(
    operation: string,
    factory: () => Promise<T>,
    verificationTarget: string,
  ): Promise<T> {
    await this.ensureConnected()
    const attemptEpoch = this.authEpoch
    const unknownOutcome = `outcome is unknown; check ${verificationTarget} with a read-only query before retrying`
    const authChangedMessage = `Garmin authentication changed during ${operation}; ${unknownOutcome}`
    const timeoutMessage = `Garmin ${operation} timed out after ${this.requestTimeoutMs}ms; ${unknownOutcome}`
    this.invalidateWorkoutLists()
    try {
      const result = await this.withRequestTimeout(async () => {
        try {
          return await factory()
        } finally {
          // A request may finish after the caller's deadline. Detach any list
          // fetched while the remote mutation was still pending as well.
          this.invalidateWorkoutLists()
        }
      }, timeoutMessage)
      if (attemptEpoch !== this.authEpoch) {
        throw new PublicToolError(authChangedMessage)
      }
      return result
```

</details>

**依据 6 · 源码核查**：[src/client.ts:1114-1133](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L1114-L1133)

创建deadline未知说明。

<details>
<summary>查看原文（20行）</summary>

```text
  async addWorkout(workout: Record<string, unknown>): Promise<Record<string, unknown>> {
    await this.ensureConnected()
    const attemptEpoch = this.authEpoch
    // A timed-out POST may still have reached Garmin. Force any subsequent
    // verification query to bypass a previously cached workout list.
    this.cache.invalidatePrefix('workouts:')
    try {
      const result = await this.withRequestTimeout(
        () => (this.gc as any).addWorkout(workout),
        `Garmin workout creation timed out after ${this.requestTimeoutMs}ms; ` +
          'outcome is unknown; check the Garmin workout library before retrying',
      )
      if (attemptEpoch !== this.authEpoch) {
        throw new PublicToolError(
          'Garmin authentication changed during workout creation; outcome is unknown; ' +
          'check the Garmin workout library before retrying',
        )
      }
      this.log('info', '[garmin] ✅ Workout created successfully.')
      return result as Record<string, unknown>
```

</details>

**依据 7 · 源码核查**：[src/client.ts:714-732](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L714-L732)

本地Promise.race没有外部取消协议。

<details>
<summary>查看原文（19行）</summary>

```text
    timeoutMessage = `Garmin request timed out after ${this.requestTimeoutMs}ms`,
  ): Promise<T> {
    let timer: ReturnType<typeof setTimeout> | undefined
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(() => {
        reject(new PublicToolError(timeoutMessage))
      }, this.requestTimeoutMs)
    })

    try {
      return await Promise.race([factory(), timeout])
    } catch (error) {
      if (isRecord(error) && error.timedOut === true) {
        throw new PublicToolError(timeoutMessage)
      }
      throw error
    } finally {
      if (timer) clearTimeout(timer)
    }
```

</details>

**依据 8 · 源码核查**：[src/workspace-harness.ts:85-90](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-harness.ts#L85-L90)

Host工具转发异常通用Retry文字。

```text
    effect: (callback: () => () => void, label?: string) => ctx.effect(callback, label),
    tools: { register: (definition: WorkspaceToolDefinition) => (ctx as any).tools.register({
      ...definition, execute: async (args: unknown) => {
        try { return await (await getOwner()).invokeTool(definition.name, args) }
        catch { return { error: true, message: 'The local Garmin workspace is unavailable. Retry the request.' } }
      },
```

#### 缺口

- 未做真实远端写/超时/重启/设备同步实验。
  **影响**：不能承诺不重复写或确认等于人类授权；本轮试用排除写工具。
  **进一步探讨**：用可丢弃账号/模拟上游先测句柄换参、重启、写已落地断回包，并要求宿主独立批准；任何未知先读再决定。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 查询缓存和FIT本地导出哪些是真正边界？

**研究主题**：工程质量与复用、缺陷与关键质疑

#### 完整回答

查询cache为TTL/LRU与每key共享刷新；过期等新值，失效时脱离旧pending，旧结果不能重新填当前key，但旧await者仍可能得到其结果，不能用缓存说明身份隔离，身份另靠registry/auth代际。Connect客户端本身每账号一cache，withRequestTimeout在cache factory内让超时不钉住pending。

FIT下载不是远端只读就无本地副作用。service要求正整数activityId与配置父目录、按账号区域派生输出，临时私有目录下载后只读固定activityId.zip，不信SDK返回路径，finally尽力清临时目录。导出包最多50MiB、FIT25MiB、entry1024，要求唯一FIT；不是把zip路径直接解到宿主。validateFitIntegrity核header/签名/声明长度，输出使用固定id.fit、wx600、sync并返回hash；已存在拒绝覆盖，失败清理新文件。此处限额发生在ZIP下载后读取，不能保证Connect SDK下载网络量在50MiB内；SDK实现未绑定，异常在飞请求结束后临时目录清理竞态未验证。Windows FIT输出未见同session一样的DACL路径，本轮不作跨平台等价保证。

#### 证据与依据

**依据 1 · 源码核查**：[src/utils/cache.ts:25-58](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/utils/cache.ts#L25-L58)

TTL刷新和pending代际填充。

<details>
<summary>查看原文（34行）</summary>

```text
  async getOrSet<T>(key: string, factory: () => Promise<T>): Promise<T> {
    if (this.ttlMs <= 0 || this.maxSize <= 0) {
      // Cache disabled
      return factory()
    }

    const entry = this.store.get(key)
    const isExpired = !entry || Date.now() >= entry.expiresAt

    if (entry && !isExpired) {
      // 1. Fresh data, just return it
      this.refreshLRU(key, entry)
      return entry.value as T
    }

    // 2. Data is stale or absent. We need to fetch.
    // Ensure only one background fetch per key.
    if (!this.pending.has(key)) {
      let fetchPromise: Promise<T>
      fetchPromise = factory()
        .then((value) => {
          // Invalidating a key detaches its old request. Only the currently
          // registered request may populate the cache.
          if (this.pending.get(key) === fetchPromise) this.set(key, value)
          return value
        })
        .finally(() => {
          if (this.pending.get(key) === fetchPromise) this.pending.delete(key)
        })
      this.pending.set(key, fetchPromise)
    }

    // Expired and missing entries both wait for the shared refresh.
    return this.pending.get(key) as Promise<T>
```

</details>

**依据 2 · 源码核查**：[src/utils/cache.ts:84-104](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/utils/cache.ts#L84-L104)

失效与清理。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Manually invalidate a single key. */
  invalidate(key: string): void {
    this.store.delete(key)
    this.pending.delete(key)
  }

  /** Invalidate all keys that start with the given prefix. */
  invalidatePrefix(prefix: string): void {
    for (const key of [...this.store.keys()]) {
      if (key.startsWith(prefix)) this.store.delete(key)
    }
    for (const key of [...this.pending.keys()]) {
      if (key.startsWith(prefix)) this.pending.delete(key)
    }
  }

  /** Drop everything. */
  clear(): void {
    this.store.clear()
    this.pending.clear()
  }
```

</details>

**依据 3 · 源码核查**：[src/client.ts:744-754](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/client.ts#L744-L754)

Connect缓存factory内deadline。

<details>
<summary>查看原文（11行）</summary>

```text
  private async getCachedForCurrentAuth<T>(
    key: string,
    factory: () => Promise<T>,
  ): Promise<T> {
    // Keep retry/auth-epoch handling outside the cache. This protects both
    // network responses and fresh cache hits with one state machine, while a
    // token-to-password transition clears/detaches the old cache generation.
    // Put the deadline inside the cache factory so a timeout rejects and
    // removes that pending entry instead of pinning a hung request forever.
    return this.withRetry(() =>
      this.cache.getOrSet(key, () => this.withRequestTimeout(factory)))
```

</details>

**依据 4 · 源码核查**：[src/tool-service.ts:290-342](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L290-L342)

临时下载、固定ZIP与清理。

<details>
<summary>查看原文（53行）</summary>

```text
  async downloadActivityFit(
    args: DownloadActivityFitArgs,
  ): Promise<DownloadActivityFitResult> {
    if (!Number.isSafeInteger(args.activityId) || args.activityId <= 0) {
      throw new PublicToolError('Invalid activityId: expected a positive integer')
    }
    if (
      typeof this.options.fitDownloadDir !== 'string'
      || !this.options.fitDownloadDir.trim()
    ) {
      throw new PublicToolError(
        'FIT download directory is not configured; set GARMIN_FIT_DOWNLOAD_DIR',
      )
    }
    const accountOutputDirectory = fitAccountOutputDirectory(
      this.options.fitDownloadDir,
      this.options.accountUsername,
      this.options.accountRegion,
    )

    let temporaryDirectory: string | undefined
    try {
      temporaryDirectory = await mkdtemp(join(tmpdir(), 'garmin-connect-fit-'))
      if (process.platform !== 'win32') await chmod(temporaryDirectory, 0o700)

      await this.client.downloadOriginalActivityZip(
        args.activityId,
        temporaryDirectory,
      )
      const metadata = await exportFitFromZip({
        activityId: args.activityId,
        outputDir: accountOutputDirectory,
        // Never trust an upstream-returned path; the SDK contract writes this
        // fixed file name inside the private directory we just created.
        zipPath: join(temporaryDirectory, `${args.activityId}.zip`),
      })

      return {
        success: true,
        activityId: args.activityId,
        fileName: metadata.fileName,
        sizeBytes: metadata.sizeBytes,
        sha256: metadata.sha256,
      }
    } finally {
      if (temporaryDirectory) {
        // The FIT file is already committed with exclusive-create semantics.
        // A rare best-effort temp cleanup failure must not turn that success
        // into an error that encourages an unsafe duplicate retry.
        await rm(temporaryDirectory, { recursive: true, force: true })
          .catch(() => undefined)
      }
    }
```

</details>

**依据 5 · 源码核查**：[src/fit-export.ts:16-19](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/fit-export.ts#L16-L19)

明确大小/条目限额。

```text
export const MAX_ZIP_BYTES = 50 * 1024 * 1024
export const MAX_FIT_BYTES = 25 * 1024 * 1024
const ZIP_STREAM_CHUNK_BYTES = 1024
const MAX_ZIP_ENTRIES = 1024
```

**依据 6 · 源码核查**：[src/fit-export.ts:134-155](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/fit-export.ts#L134-L155)

下载后读取ZIP检查。

<details>
<summary>查看原文（22行）</summary>

```text
async function readZipFile(zipPath: string): Promise<Uint8Array> {
  if (zipPath.trim().length === 0) {
    throw new FitExportError('INVALID_ZIP_SOURCE', 'The ZIP file path is invalid.')
  }

  let file: FileHandle | undefined
  try {
    // O_NOFOLLOW keeps a caller-controlled final path component from resolving
    // through a symlink. The archive is still treated as untrusted afterwards.
    file = await open(zipPath, constants.O_RDONLY | constants.O_NOFOLLOW)
    const info = await file.stat()
    if (!info.isFile()) {
      throw new FitExportError('INVALID_ZIP_SOURCE', 'The ZIP source must be a regular file.')
    }
    if (info.size > MAX_ZIP_BYTES) {
      throw new FitExportError('ZIP_TOO_LARGE', 'The ZIP archive exceeds the 50 MiB limit.')
    }

    const data = await file.readFile()
    if (data.byteLength > MAX_ZIP_BYTES) {
      throw new FitExportError('ZIP_TOO_LARGE', 'The ZIP archive exceeds the 50 MiB limit.')
    }
```

</details>

**依据 7 · 源码核查**：[src/fit-export.ts:200-248](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/fit-export.ts#L200-L248)

唯一FIT/条目与解压限额。

<details>
<summary>查看原文（49行）</summary>

```text
function extractUniqueFit(zipData: Uint8Array): Buffer {
  let totalEntryCount = 0
  let entryCount = 0
  let extractedSize = 0
  let extractionFinished = false
  let abortError: FitExportError | undefined
  const chunks: Buffer[] = []

  const unzipper = new Unzip((file) => {
    totalEntryCount += 1
    if (totalEntryCount > MAX_ZIP_ENTRIES) {
      abortError = new FitExportError(
        'TOO_MANY_ZIP_ENTRIES',
        'The ZIP archive contains too many entries.',
      )
      return
    }
    if (abortError || !isFitEntryName(file.name)) return

    entryCount += 1
    if (entryCount > 1) {
      abortError = new FitExportError(
        'MULTIPLE_FIT_ENTRIES',
        'The ZIP archive contains more than one FIT file.',
      )
      return
    }
    if (file.originalSize !== undefined && file.originalSize > MAX_FIT_BYTES) {
      abortError = new FitExportError(
        'FIT_TOO_LARGE',
        'The extracted FIT file exceeds the 25 MiB limit.',
      )
      return
    }

    file.ondata = (error, data, final) => {
      if (abortError) return
      if (error) {
        abortError = new FitExportError(
          'INVALID_ZIP',
          'The FIT entry could not be decompressed.',
        )
        return
      }

      if (data.byteLength > MAX_FIT_BYTES - extractedSize) {
        abortError = new FitExportError(
          'FIT_TOO_LARGE',
          'The extracted FIT file exceeds the 25 MiB limit.',
```

</details>

**依据 8 · 源码核查**：[src/fit-export.ts:312-336](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/fit-export.ts#L312-L336)

FIT头与长度核查。

<details>
<summary>查看原文（25行）</summary>

```text
function validateFitIntegrity(fitData: Uint8Array): void {
  if (fitData.byteLength < 12) {
    throw new FitExportError('INVALID_FIT_HEADER', 'The extracted file has an invalid FIT header.')
  }

  const headerSize = fitData[0]
  const isStandardHeader = headerSize === 12 || headerSize === 14
  const hasCompleteHeader = fitData.byteLength >= headerSize
  const hasFitSignature = fitData[8] === 0x2e
    && fitData[9] === 0x46
    && fitData[10] === 0x49
    && fitData[11] === 0x54
  const dataSize = fitData[4]
    | (fitData[5] << 8)
    | (fitData[6] << 16)
    | (fitData[7] << 24 >>> 0)
  const hasExactDeclaredLength = headerSize + (dataSize >>> 0) + 2 === fitData.byteLength

  if (
    !isStandardHeader
    || !hasCompleteHeader
    || !hasFitSignature
    || !hasExactDeclaredLength
  ) {
    throw new FitExportError('INVALID_FIT_HEADER', 'The extracted file has an invalid FIT header.')
```

</details>

**依据 9 · 源码核查**：[src/fit-export.ts:396-447](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/fit-export.ts#L396-L447)

固定目的文件、独占写与结果。

<details>
<summary>查看原文（52行）</summary>

```text
async function writeExclusive(outputPath: string, fitData: Uint8Array): Promise<void> {
  let file: FileHandle | undefined
  let created = false

  try {
    file = await open(outputPath, 'wx', 0o600)
    created = true
    if (process.platform !== 'win32') await file.chmod(0o600)
    await file.writeFile(fitData)
    await file.sync()
    await file.close()
    file = undefined
  } catch (error) {
    await file?.close().catch(() => undefined)
    if (created) await unlink(outputPath).catch(() => undefined)

    if (!created && isNodeErrorWithCode(error, ['EEXIST', 'EISDIR'])) {
      throw new FitExportError('OUTPUT_EXISTS', 'The FIT output file already exists.')
    }
    throw new FitExportError('OUTPUT_WRITE_FAILED', 'The FIT output file could not be saved.')
  }
}

/**
 * Extract one Garmin FIT file from a bounded ZIP archive and save it locally.
 * ZIP entry names are never used for the destination path, and existing files
 * (including symlinks) are never followed or overwritten.
 */
export async function exportFitFromZip(
  options: ExportFitFromZipOptions,
): Promise<FitExportMetadata> {
  if (!Number.isSafeInteger(options.activityId) || options.activityId <= 0) {
    throw new FitExportError('INVALID_ACTIVITY_ID', 'The Garmin activity ID must be a positive integer.')
  }

  const zipData = await loadZip(options)
  const fitData = extractUniqueFit(zipData)
  validateFitIntegrity(fitData)
  const sha256 = createHash('sha256').update(fitData).digest('hex')

  const privateOutputDir = await preparePrivateDirectory(options.outputDir)
  const fileName = `${options.activityId}.fit`
  const savedPath = resolve(privateOutputDir, fileName)
  await writeExclusive(savedPath, fitData)

  return {
    fileName,
    savedPath,
    sizeBytes: fitData.byteLength,
    sha256,
  }
}
```

</details>

#### 缺口

- 未测试ZIP/路径/磁盘故障、Windows FIT权限及SDK下载限额。
  **影响**：不把防御代码说成已验所有恶意归档安全；首试不导出。
  **进一步探讨**：先在临时目录用现成固定测试归档检查超额/多FIT/已有文件和失败清理，另核SDK流式下载边界。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 值得如何试用，完整负担与退出是什么？

**研究主题**：效果与总成本、采用判断

#### 完整回答

建议已有Garmin账号、接受指定历史健身数据进入所选模型的用户，用专用profile先只读一个日期/少量活动，稳定accountId核官方应用日期/单位/设备来源及缺失；先用已具备的Personal权限或受控浏览器认证，不为试用新建收费订阅。关闭/不调用训练写、FIT导出和自动扩抓，宿主允许时只暴露查询工具；如不能隔离写工具或无法确认数据去向，则停止在本地文档/离线演示。现有登录不意味着全部指标可用，空结果不等0。

首次需匹配Node20.19/22.13+、DSH peers或MCP客户端、区域/账号配置、API key或浏览器/MFA与私有目录。持续有会话过期/浏览器策略/外部SDK服务变更、数据解释和模型token/API费用；Garmin设备/权限成本因已有条件不同未知，不推断免费或节时收益。失败分认证、限流/不可用、数据缺失、本地写和远端结果未知；涉及写先查库/日历，不照通用Retry。退出停适配/共享workspace和认证流程，备份所需教练记录/FIT，另撤凭据/删本地目录并核其他MCP是否仍持有owner；单卸载一个前端不代表共享服务已停，已进入模型的数据不能回收。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:94-124](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/package.json#L94-L124)

Host/Web peers和SDK依赖。

<details>
<summary>查看原文（31行）</summary>

```text
  "peerDependencies": {
    "@deepseek-ai/cordis": "^4.0.1",
    "@deepseek-ai/dsh-client-connection": "^0.1.0-rc.6 || ^0.1.1-rc.1 || 0.2.0-rc.1 || 0.2.0-rc.2 || >=0.2.1-rc.1 <1.0.0-0 || ^0.2.2-rc.1",
    "@deepseek-ai/dsh-client-ui-layout": "^0.1.0-rc.6 || ^0.1.1-rc.1 || 0.2.0-rc.1 || 0.2.0-rc.2 || >=0.2.1-rc.1 <1.0.0-0 || ^0.2.2-rc.1",
    "react": "^18.2.0"
  },
  "peerDependenciesMeta": {
    "@deepseek-ai/dsh-client-connection": {
      "optional": true
    },
    "@deepseek-ai/dsh-client-ui-layout": {
      "optional": true
    },
    "react": {
      "optional": true
    }
  },
  "dependencies": {
    "@deepseek-ai/schemastery": "^3.19.0",
    "@modelcontextprotocol/sdk": "1.30.0",
    "axios": "1.19.0",
    "axios-cookiejar-support": "5.0.5",
    "dotenv": "^16.4.0",
    "fflate": "0.8.3",
    "garmin-connect": "npm:@likenttt/garmin-connect@1.7.0",
    "tough-cookie": "5.1.2",
    "zod": "^3.25.76"
  },
  "devDependencies": {
    "@deepseek-ai/cordis": "~4.1.0",
    "@deepseek-ai/dsh-client-connection": "0.2.2-rc.1",
```

</details>

**依据 2 · 源码核查**：[package.json:140-146](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/package.json#L140-L146)

Node与可选浏览器依赖。

```text
  "engines": {
    "node": "^20.19.0 || >=22.13.0"
  },
  "optionalDependencies": {
    "playwright-core": "1.62.1"
  }
}
```

**依据 3 · 源码核查**：[src/tools/index.ts:112-153](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tools/index.ts#L112-L153)

账号明确选择。

<details>
<summary>查看原文（42行）</summary>

```text
  const selectService = async (accountId?: string): Promise<GarminToolService> => {
    // Do not choose a temporary "only account" while the persisted catalog is
    // still loading. Knowledge-only calls below deliberately skip this gate.
    await source?.ready()
    const accounts = listAccounts()
    const configuredAccounts = accounts.filter(account => account.configured)
    if (accountId !== undefined && !/^[a-z][a-z0-9_-]{0,31}$/.test(accountId)) {
      throw new PublicToolError('account must be a valid Garmin account ID')
    }
    if (accountId) {
      const exact = configuredAccounts.find(account => account.accountId === accountId)
      if (exact) return serviceFor(exact)
      if (accountId === 'cn' || accountId === 'global') {
        const regional = configuredAccounts.filter(account => account.region === accountId)
        if (regional.length === 1) return serviceFor(regional[0])
        if (regional.length > 1) {
          throw new PublicToolError(`Multiple Garmin ${accountId} accounts are configured. Select a specific account ID.`)
        }
        throw new PublicToolError(`No Garmin ${accountId} account is configured. Add it in the plugin settings.`)
      }
      if (accounts.some(account => account.accountId === accountId)) {
        const selected = accounts.find(account => account.accountId === accountId)
        throw new PublicToolError(selected?.config.provider === 'personal'
          ? `Garmin account ${accountId} has no Personal API Key configured. Add it in the plugin settings.`
          : `Garmin account ${accountId} has no email configured. Add it in the plugin settings.`)
      }
      throw new PublicToolError(`Garmin account ${accountId} is not configured. Select an account ID from the plugin settings.`)
    }
    if (configuredAccounts.length === 1) return serviceFor(configuredAccounts[0])
    if (configuredAccounts.length === 0) {
      throw new PublicToolError('No Garmin account is configured. Add an account in the plugin settings.')
    }
    if (source) {
      throw new PublicToolError('Multiple Garmin accounts are configured. Call list_garmin_accounts and set account to a specific account ID.')
    }
    if (configuredAccounts.length > 5) {
      throw new PublicToolError('Multiple Garmin accounts are configured. Set account to a specific account ID from the plugin settings.')
    }
    const ids = configuredAccounts.map(account => account.alias
      ? `${account.accountId} (${JSON.stringify(account.alias)})`
      : account.accountId).join(', ')
    throw new PublicToolError(`Multiple Garmin accounts are configured. Set account to an account ID: ${ids}.`)
```

</details>

**依据 4 · 源码核查**：[src/workspace-harness.ts:39-71](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-harness.ts#L39-L71)

owner与远端连接可共享。

<details>
<summary>查看原文（33行）</summary>

```text
    const lease = await acquireWorkspaceLease(descriptor)
    if (!lease) {
      const remote = await connectWorkspace(descriptor)
      const applied = await remote.configure({
        cacheTtl: options.baseConfig.cacheTtl, requestTimeoutMs: options.baseConfig.requestTimeoutMs ?? 15_000,
        logLevel: options.baseConfig.logLevel, authVerbose: options.baseConfig.authVerbose === true,
        activityDetail: options.baseConfig.activityDetail, fitDownloadDir: options.baseConfig.fitDownloadDir,
      }) as { success?: boolean }
      if (applied?.success !== true) { await remote.close(); throw new Error('Could not synchronize Garmin workspace settings') }
      cleanup = () => remote.close()
      if (disposed) { await cleanup(); throw new Error('Garmin workspace is closed') }
      return remote
    }
    const accounts = createAccountRegistry({ ...options, dataDirectory: descriptor.dataDirectory,
      createClient: config => createGarminClient(ctx, config, { allowUnconfigured: true }),
    })
    let service: WorkspaceService | undefined
    let server: Awaited<ReturnType<typeof startWorkspaceServer>> | undefined
    try {
      service = createWorkspaceService(accounts, { ...descriptor, logger: ctx.logger })
      await accounts.ready()
      const accessToken = randomBytes(24).toString('hex')
      server = await startWorkspaceServer({ service, accessToken, instanceId: lease.instanceId })
      await lease.publish({ origin: server.origin, accessToken })
      cleanup = async () => {
        try { await server!.close() }
        finally {
          try { await service!.close() }
          finally { accounts.close(); await lease.close() }
        }
      }
      if (disposed) { await cleanup(); throw new Error('Garmin workspace is closed') }
      return service
```

</details>

**依据 5 · 源码核查**：[src/personal-client.ts:83-98](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/personal-client.ts#L83-L98)

认证/限流/不可用分辨。

<details>
<summary>查看原文（16行）</summary>

```text
    } catch (error) {
      this.assertActive()
      if (error instanceof PublicToolError) throw error
      if (error instanceof PersonalApiError) {
        if (error.status === 401 || error.status === 403 || error.status === 404) this.connected = false
        if (error.status === 404) {
          throw new PublicToolError('Garmin Personal API did not recognize the API Key or resource (HTTP 404). Check the key and account availability in plugin settings.')
        }
        if (error.status === 401 || error.status === 403) {
          throw new PublicToolError(`Garmin Personal API access failed (HTTP ${error.status}). Check the API Key, expiration, and account permissions in plugin settings.`)
        }
        if (error.status === 429) throw new PublicToolError('Garmin Personal API rate limit reached; wait before retrying')
        if (error.status === 526) throw new PublicToolError('Garmin Personal API endpoint is currently unavailable (HTTP 526). Keep the selected region and retry later.')
        throw new PublicToolError(`Garmin Personal API: ${error.message}`)
      }
      throw new PublicToolError('Garmin Personal API request failed; check the local API Key configuration and connection')
```

</details>

**依据 6 · 源码核查**：[src/tool-service.ts:848-856](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L848-L856)

写未知先读恢复。

```text
          scheduling: { status: 'unconfirmed', outcomeUnknown: true },
          error: publicErrorMessage(error, 'Garmin scheduling failed; the calendar write outcome is unknown.'),
          recovery: {
            tool: 'get_garmin_scheduled_workouts',
            arguments: { startDate: scheduleDate, endDate: scheduleDate },
            nextToolIfMissing: 'schedule_garmin_workout',
            nextArguments: { workoutId, date: scheduleDate },
          },
          message: 'The workout was created, but scheduling could not be confirmed. Do not repeat create_garmin_workout. First read the calendar for the requested date; if the entry is absent, use schedule_garmin_workout for this workoutId with a new preview and user confirmation.',
```

**依据 7 · 源码核查**：[src/index.ts:81-84](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/index.ts#L81-L84)

停止注册scope时关闭registry。

```text
    registerTools(scopeCtx, accounts)
    registerEmbeddedAuthRpcAccounts(scopeCtx, accounts)
    registerCoachPanel(scopeCtx, accounts, { scopeId })
    scopeCtx.effect(() => () => accounts.close(), 'garmin-connect: account registry')
```

#### 缺口

- 没有安装/读取/退出真实验收或成本对照。
  **影响**：只能限定查询试用，不给持续训练自动化背书。
  **进一步探讨**：记录一小段历史核对错误、配置/重认证时间、实际模型usage及退出后进程/凭据，再决定是否保留。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 能推导什么可证伪方向？

**研究主题**：新假设与验证

#### 完整回答

候选是将远端写的结果未知和通用workspace错误拆开，绑定账号/请求/预览摘要的操作收据，并由宿主可信交互提供人类批准凭据。依据是一次性句柄只证明参数承接、共享转发catch泛化为Retry、底层已承认timeout未知。相对当前布尔confirmed/文本提示，先以只读模拟展示测试用户能否区分批准、请求已发、创建已成、排期待核、设备未同步，测误重试/误认完成，不执行真Garmin写。若现有结果与宿主确认机制已能稳定区分，或收据无法跨账号/重启核对，则推翻这个方向；不把它算本版能力或商业价值。

#### 证据与依据

**依据 1 · 源码核查**：[src/tool-service.ts:899-913](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L899-L913)

消费句柄仅检参数/账号。

<details>
<summary>查看原文（15行）</summary>

```text
    const pending = this.workoutConfirmations.get(confirmationId)
    this.workoutConfirmations.delete(confirmationId)
    if (!pending || !this.workoutConfirmationMatchesAccount(pending)
      || pending.definitionHash !== workoutDefinitionHash({ ...definition, ...(scheduleDate !== undefined ? { scheduleDate } : {}) })) {
      throw new PublicToolError(
        'Invalid workout confirmation: the preview is missing, expired, already used, or changed',
      )
    }
  }

  private workoutConfirmationMatchesAccount(pending: PendingWorkoutConfirmation): boolean {
    return pending.accountUsername === this.options.accountUsername
      && pending.accountRegion === this.options.accountRegion
      && pending.accountId === this.options.accountId
  }
```

</details>

**依据 2 · 源码核查**：[src/workspace-harness.ts:85-90](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/workspace-harness.ts#L85-L90)

共享转发泛化错误。

```text
    effect: (callback: () => () => void, label?: string) => ctx.effect(callback, label),
    tools: { register: (definition: WorkspaceToolDefinition) => (ctx as any).tools.register({
      ...definition, execute: async (args: unknown) => {
        try { return await (await getOwner()).invokeTool(definition.name, args) }
        catch { return { error: true, message: 'The local Garmin workspace is unavailable. Retry the request.' } }
      },
```

**依据 3 · 源码核查**：[src/tool-service.ts:838-856](https://github.com/Likenttt/garmin-connect-plugin-for-dsh/blob/71bb6095899f22b49ec3c405dd12d4cc4793b8ba/src/tool-service.ts#L838-L856)

部分成功/未知细节已存在。

<details>
<summary>查看原文（19行）</summary>

```text
      } catch (error) {
        return {
          success: false,
          partialSuccess: true,
          workoutCreated: true,
          workoutId,
          workoutName: definition.name,
          scheduleDate,
          accountRegion: this.options.accountRegion,
          ...(this.options.accountId ? { accountId: this.options.accountId } : {}),
          scheduling: { status: 'unconfirmed', outcomeUnknown: true },
          error: publicErrorMessage(error, 'Garmin scheduling failed; the calendar write outcome is unknown.'),
          recovery: {
            tool: 'get_garmin_scheduled_workouts',
            arguments: { startDate: scheduleDate, endDate: scheduleDate },
            nextToolIfMissing: 'schedule_garmin_workout',
            nextArguments: { workoutId, date: scheduleDate },
          },
          message: 'The workout was created, but scheduling could not be confirmed. Do not repeat create_garmin_workout. First read the calendar for the requested date; if the entry is absent, use schedule_garmin_workout for this workoutId with a new preview and user confirmation.',
```

</details>

#### 缺口

- 宿主可信批准对接与收据需求未验证。
  **影响**：仅机会推演。
  **进一步探讨**：先绑定具体Host确认API，在三个断回包/换账号/重启样本中比较现有与收据判读，之后再谈实现。

[返回分类](../../views/categories/PERSONAL-PRODUCTIVITY.md) · [返回首页](../../../README.md)
