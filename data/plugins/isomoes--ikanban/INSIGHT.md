# iKanban

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)

源码版本：[77b76a7](https://github.com/isomoes/ikanban/tree/77b76a737ef07478cc95b0e341a88f027716c66b)

<!-- BEGIN META -->
[![GitHub ★ 15](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=15&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/isomoes/ikanban)
<!-- END META -->

> **功能**：面向 OpenCode V2 的独立静态浏览器前端，提供项目、会话、审查、终端与多服务器管理。

> **亮点**：[Q01](#research-q01) 独立静态部署与多服务器交互组织，加上 [Q02](#research-q02) 的连接/缓存owner分层，为浏览器管理提供集成价值；任务节时和跨端可靠性未实测。

> **主要限制**：[Q03](#research-q03) 自动批准是全局客户端偏好，可能应答所有连接/会话和重连挂起请求，不能当当前标签的局部授权；scope键只隔开本地状态，不是后端租户权限。

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
  - [Q01 · 独立前端服务谁，相比上游增加什么？](#detail-section-11)
  - [Q02 · 输入和事件如何绑定服务器与会话？](#detail-section-12)
  - [Q03 · 多服务器自动授权和使用负担怎样影响采用？](#detail-section-13)
  - [Q04 · 授权作用域预览是否能减少意外放行？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：[Q01](#research-q01) 面向已有OpenCode V2后端、需要浏览器/PWA和多服务器的开发者；以正确后端/会话投递和任务结果为验收。

上游Web/桌面或终端入口是基线；本包采用共享应用和OpenCode客户端，原生DSH兼容未成立，不把上游工具当原创。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| 多服务器controller | 管理各后端状态 | 前端scope非服务端租户授权 |
| prompt输入 | 发送会话/模型/交付意图 | 同ID重试需后端幂等契约 |
| 事件工作台 | 显示实时会话资源 | 断流查询标陈旧，非任务已停止 |
| 自动批准 | 应答permission请求 | 开启时跨所有服务器/会话，非只当前标签 |
| 浏览器访问 | 跨端使用静态前端 | 需OpenCode V2后端和受控认证网络 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| OpenCode V2兼容后端 | 完成任务必需 | Agent、文件和执行 | 独立前端不提供执行沙箱，非DSH插件 |
| 浏览器、静态站点 | 访问必需 | 加载工作台/PWA | 前端存在不证明后端连接成立 |
| 密码、HTTPS/CORS | 远程连接必需 | 认证与受控来源 | Basic不是传输加密；实际部署未验收 |
| 后端项目权限与模型 | 任务必需 | 访问目录和推理 | UI scope不能替代服务端授权 |
| Bun/Node与前端依赖 | 源码构建必需 | 生成静态产物 | 版本/patch需维护，未执行构建 |
| 浏览器本地存储 | 本地偏好/草稿需要 | 保存服务器/布局等 | 不等于服务器会话或加密保险箱 |

边界见 [Q02](#research-q02)、[Q03](#research-q03)。

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户固定后端与前端，隔离项目、认证/网络 | 明确执行机器与访问目录 |
| 连接 | 浏览器添加后端并核当前server/session | 事件与项目相符，不能只看站点加载 |
| 输入/审查 | 用户核模型和自动批准范围后提交 | API admission与最终文件都核验 |
| 断流 | 用户停重发、检查后端与同ID结果 | 不把关闭标签当取消 |
| 退出 | 停自动批准并移除连接/停后端按需求 | 前端解绑不承诺后端任务停止 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 后端/静态托管/存储金额未知 | 部署、认证、CORS和版本核对耗时未知 | 浏览器免桌面安装不等于免后端 |
| 持续 | 模型、服务器、网络与浏览器资源未知 | 多服务器/授权/兼容维护 | 无节时或节费对照 |
| 失败恢复 | 重试和后端副作用成本未知 | 断流/ID/文件对账耗时未知 | 同ID前端重试不证明服务端精确一次 |
| 退出迁移 | 本地草稿/配置存储量未知 | 关闭自动批准并核后端任务 | 关页不是取消 |

以一项在正确后端完成的合格修改为单位，无尝试/合格数不算单位成本。

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 浏览器工作台 | 静态前端与OpenCode客户端接线 | 跨端便利和任务净收益 |
| 多服务器状态 | controller与scope命名空间 | 后端隔离/权限保证 |
| 发送恢复 | 稳定admission与失败路径 | 后端去重和断流最终结果 |
| 自动批准 | 全局设置实际reply once | 用户理解与误放行影响 |

> **思考**：[Q03](#research-q03) 自动批准是全局客户端偏好，可能应答所有连接/会话和重连挂起请求，不能当当前标签的局部授权；scope键只隔开本地状态，不是后端租户权限。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 独立静态部署与多服务器交互组织，加上 [Q02](#research-q02) 的连接/缓存owner分层，为浏览器管理提供集成价值；任务节时和跨端可靠性未实测。

[Q02](#research-q02) 每连接controller、scope键和Data单owner值得复用，迁移需事件/缓存契约；[Q03](#research-q03) 有界自动批准重试/生命周期守卫可借鉴，但作用域必须向用户解释，客户端状态不是权限边界。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 自动批准是全局客户端偏好，可能应答所有连接/会话和重连挂起请求，不能当当前标签的局部授权；scope键只隔开本地状态，不是后端租户权限。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 适合有OpenCode后端和网络配置能力者在可丢弃项目小范围试，先核当前服务器/会话及全局自动批准。错位、意外授权或结果不明就停发送并回后端核日志/文件，不把关页当取消。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已检查独立客户端定位、连接/controller/Data、prompt、断流缓存和自动批准源码；未运行前后端或浏览器。授权预览为未验证设计。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、packages/web/package.json、packages/web/src/composer/submit.ts、packages/web/src/runtime/server/api.ts、packages/web/src/runtime/server/client.tsx、packages/web/src/runtime/server/persistence.ts、packages/web/src/runtime/server/runtime.tsx、packages/web/src/runtime/server/scope.ts、packages/web/src/runtime/server/sync.tsx、packages/web/src/session/requests/auto-approve.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：根组件完整inventory，人工定向核README/package、server controller/transport/scope、composer admission、断流query与全局自动批准；未全审UI、终端实现、存储安全或OpenCode后端。
- 下一步：未运行目标代码、构建、测试、浏览器、后端或模型；后续优先双服务器/同ID断流/授权范围任务与文件验收，作者功能描述不作本地通过证据。

**分析版本**

- **仓库**：[isomoes/ikanban](https://github.com/isomoes/ikanban)
- **版本号**：0.6.14（[固定提交 77b76a7](https://github.com/isomoes/ikanban/tree/77b76a737ef07478cc95b0e341a88f027716c66b)）
- **版本日期**：2026-11-02（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 试验自动批准范围预览和按服务器限定能否减少误放行，已有设置/守卫和未知请求覆盖需保留，当前未验证。

未运行目标代码、构建、测试、浏览器、后端或模型；后续优先双服务器/同ID断流/授权范围任务与文件验收，作者功能描述不作本地通过证据。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 15 | 2094 | — | — | 23481 |
| .ts | source | 281 | 34169 | 30932 | 624 | — |
| .ts | test | 191 | 20466 | 18225 | 431 | — |
| .tsx | source | 265 | 49699 | 46201 | 583 | — |
| .tsx | test | 2 | 146 | 138 | 0 | — |
| .js | source | 2 | 122 | 101 | 9 | — |
| .ts | example | 1 | 508 | 475 | 2 | — |
| .mjs | source | 2 | 33 | 31 | 0 | — |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/isomoes/ikanban/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/isomoes/ikanban/issues?q=is%3Aissue+created%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/isomoes/ikanban/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-04T02%3A00%3A13.357Z..2026-11-03T02%3A00%3A13.357Z)



统计日期：2026-11-03。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：浏览器前端能否把多服务器任务、事件和授权范围表达清楚，何种条件下相对原入口值得探索？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 独立前端服务谁，相比上游增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已有OpenCode V2后端、希望从浏览器或移动PWA管理项目/会话、审查文件与终端的开发者是直接对象。原办法是使用上游Web/桌面界面或终端入口；本项目复用上游共享应用并增加独立静态部署、多服务器与本地交互组织。合格结果应是提示到达预期服务器/会话、流式与文件变化一致、审查后输出可验收，而不是仅打开界面或看到指标。

根package明确standalone frontend，Web依赖@opencode/client/schema2.0.26，没有本次核查到的DSH Cordis装配入口。因此真实类型是client，不是可装入DSH的原生插件，也不能从目录收录推断DSH协议兼容。Agent、工具执行和项目访问发生在外部OpenCode后端，浏览器本身不提供隔离执行环境。

贡献可归为客户端集成与状态组织，不能把上游模型/工具、共享UI和服务器能力都归为本项目原创。多服务器视图和PWA可能降低需要桌面客户端的门槛，但相对上游前端的功能差异、任务效益和真实用户偏好未做完整对照，不作竞品排名。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-21](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/README.md#L5-L21)

作者独立静态OpenCode V2定位和功能声明。

<details>
<summary>查看原文（17行）</summary>

```text
iKanban 是面向 **OpenCode V2** 的独立静态前端，直接采用上游共享的桌面 / Web 应用。浏览器直连后端，无需安装桌面客户端。

<img width="900" alt="iKanban 界面截图" src="https://github.com/user-attachments/assets/034542d2-c944-4821-ab2d-8085bcdf45b2" />

## 功能

| 模块 | 说明 |
| --- | --- |
| 项目与会话 | 最近项目、worktree 工作区、按时间分组的会话、项目和会话搜索、多标签页。 |
| 会话工作台 | 流式消息、待办、提问、权限请求、后台任务、消息搜索，以及实时会话指标（tok/s、轮次、步数、工具调用、耗时和 Token）。 |
| 输入框 | 拖入图片、PDF 或文本文件，`@` 引用文件，`/` 执行命令，切换模型、智能体与 MCP，支持 Shell 模式。 |
| 审查与文件 | 基于 Git 的 Diff 审查、文件树和文件预览、手动刷新，以及将选中行加入上下文；未初始化 Git 时可一键创建仓库。 |
| 终端 | 侧边或底部布局、多标签，通过 WebSocket 直连后端。 |
| 提供商与模型 | OAuth 或 API 密钥连接，并提示认证失败；支持模型收藏、最近使用和按提供商批量隐藏。 |
| 多服务器 | 运行时添加、编辑和切换服务器，无需重新构建。 |
| Web / PWA | 响应式移动布局、安装到桌面或主屏幕、深浅色与色盲主题、通知与音效、中英文界面。 |
| 效率 | 命令面板、可自定义快捷键、撤销/重做、Fork、压缩会话和导出 JSON。 |
```

</details>

**依据 2 · 源码核查**：[package.json:1-9](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/package.json#L1-L9)

根包描述与独立workspaces。

```text
{
  "name": "ikanban",
  "version": "0.6.14",
  "description": "iKanban standalone frontend for OpenCode V2",
  "private": true,
  "license": "MIT",
  "type": "module",
  "packageManager": "bun@1.3.12",
  "workspaces": {
```

**依据 3 · 源码核查**：[packages/web/package.json:48-62](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/package.json#L48-L62)

实际依赖OpenCode客户端/Schema与本地UI。

<details>
<summary>查看原文（15行）</summary>

```text
    "@kobalte/core": "catalog:",
    "@opencode/client": "2.0.26",
    "@opencode/schema": "2.0.26",
    "@ikanban/session-ui": "workspace:*",
    "@ikanban/ui": "workspace:*",
    "@opencode/util": "2.0.22",
    "@pierre/trees": "1.0.0-beta.4",
    "@sentry/solid": "catalog:",
    "@solid-primitives/event-bus": "1.1.2",
    "@solid-primitives/event-listener": "catalog:",
    "@solid-primitives/i18n": "2.2.1",
    "@solid-primitives/keyed": "1.5.3",
    "@solid-primitives/media": "catalog:",
    "@solid-primitives/resize-observer": "catalog:",
    "@solid-primitives/scheduled": "1.5.3",
```

</details>

#### 缺口

- 未完整对照上游同版Web界面和真实用户流程。
  **影响**：不确定哪些交互改善是独立增量及净收益。
  **进一步探讨**：固定同一后端、模型和任务，对比上游前端与本前端的正确投递、审查/终端操作和耗时。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 输入和事件如何绑定服务器与会话？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

GlobalProvider按ServerConnection key缓存独立controller，移除连接时dispose；controller建立sdk和上游createData，事件进入Data并派生sync。scope用服务器key与分隔符组成会话/持久键，避免仅凭相同sessionID混同前端状态。这是客户端命名空间与生命周期设计，不是服务器端租户授权。

输入提交先捕获状态/附件/选择，普通prompt形成带admission id、sessionID、delivery与模型metadata的请求；失败会以同一个admission再次调用一次。steer立即应用当前选择，而queue保留metadata并按交付时的session选择处理。源码支持防重复所需的稳定ID，但最终去重/幂等语义仍由外部client/backend承担，不能因为catch重试就保证只执行一次。发送返回也不等于最终代码任务完成。

事件断连会将对应scope的request/response查询标陈旧而不立即refetch，后续使用再读；源事件由上游连接/Data处理。这个设计比各组件复制状态更清楚，移植需要同样的事件覆盖、缓存owner与后端契约。浏览器草稿、标签、终端scrollback不是服务器会话事实，关闭页面不证明后端任务停止，断流时应回源核状态再重发。

#### 证据与依据

**依据 1 · 源码核查**：[packages/web/src/runtime/server/runtime.tsx:33-64](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/runtime.tsx#L33-L64)

按连接创建和释放controller。

<details>
<summary>查看原文（32行）</summary>

```text
    const serverCtxs = new Map<ServerConnection.Key, ReturnType<typeof createServerController>>()
    const serverCtxDisposers = new Map<ServerConnection.Key, () => void>()

    const owner = getOwner()
    if (!owner) throw new Error("Global provider requires a Solid owner")

    const ensureServerCtx = (conn: ServerConnection.Http) => {
      const key = ServerConnection.key(conn)
      const existing = serverCtxs.get(key)
      if (existing) return existing
      const serverCtx = createRoot((dispose) => {
        serverCtxDisposers.set(key, dispose)
        return createServerController(conn, server.scope(key), server.projects.forServer(key), notificationCoordinator)
      }, owner)
      serverCtxs.set(key, serverCtx)
      return serverCtx
    }

    createMemo(() => {
      for (const conn of server.list) {
        ensureServerCtx(conn)
      }
    })

    createEffect(() => {
      for (const [key] of serverCtxs) {
        if (!server.list.find((conn) => ServerConnection.key(conn) === key)) {
          serverCtxDisposers.get(key)?.()
          serverCtxDisposers.delete(key)
          serverCtxs.delete(key)
        }
      }
```

</details>

**依据 2 · 源码核查**：[packages/web/src/runtime/server/runtime.tsx:112-137](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/runtime.tsx#L112-L137)

真实SDK/createData/权限处理接线。

<details>
<summary>查看原文（26行）</summary>

```text
  const connKey = ServerConnection.key(conn)
  const sdk = createServerSdkContext(conn, scope)
  const source = createData({
    api: () => sdk.api,
    initialMessageLimit: () => (timelinePreset(settings.general.timelineDetail())?.id === "compact" ? 40 : 20),
    event: {
      on: sdk.event.on,
      listen: (handler) => sdk.event.listen((event) => handler({ name: event.type, details: event })),
    },
    connection: sdk.connection,
    directory: "",
    onError(error) {
      showToast({
        variant: "error",
        title: language.t("common.requestFailed"),
        description: formatServerError(error, language.t),
      })
    },
  })
  const data = createAppData({
    data: source,
    remove: (sessionID) => sdk.api.session.remove({ sessionID }),
  })
  const sync = createServerSyncContext(sdk, data)
  createPermissionAutoApprover({ sdk, data })
  const notification = createServerNotificationState({ sdk, data, key: connKey, coordinator: notificationCoordinator })
```

</details>

**依据 3 · 源码核查**：[packages/web/src/runtime/server/client.tsx:73-115](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/client.tsx#L73-L115)

事件流和HTTP/PTY transport。

<details>
<summary>查看原文（43行）</summary>

```text
function createServerSdkContextBase(server: ServerConnection.Http, scope: ServerScope): ServerSDKBase {
  const transport = createServerTransport({ http: server.http })
  const events = createOpenCodeEventSource()

  const connection = createClientConnection(transport.api, {
    flushInterval: 16,
    pageLifecycle: true,
    onEvent(event) {
      events.publish(event)
    },
    log: {
      info(message, data) {
        if (message !== "event stream disconnected") return
        console.info("[global-sdk] event stream disconnected", { url: transport.url, ...data })
      },
    },
  })

  return {
    server,
    scope,
    get url() {
      return transport.url
    },
    get api() {
      return transport.api
    },
    get pty() {
      return transport.pty
    },
    connection,
    event: events.event,
  }
}

export function createServerTransport(input: { http: ServerConnection.HttpBase }): {
  readonly url: string
  readonly api: ServerApi
  readonly pty: ReturnType<typeof createPtyClient>
} {
  const queue = createRequestQueue({ fetch: globalThis.fetch })
  const api = createApiForServer({ server: input.http, fetch: queue.fetch })
  return { url: input.http.url, api, pty: createPtyClient(api, { url: input.http.url }) }
```

</details>

**依据 4 · 源码核查**：[packages/web/src/runtime/server/scope.ts:15-38](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/scope.ts#L15-L38)

scope与会话键组合。

<details>
<summary>查看原文（24行）</summary>

```text
function compose(scope: ServerScope, parts: string[]) {
  return [fragment("Server scope", scope), ...parts.map((part) => fragment("Scoped key part", part))].join(separator)
}

export const ServerScope = {
  local: "local" as ServerScope,
  fromServerKey(key: ServerConnection.Key, canonicalLocalServer?: ServerConnection.Key) {
    return fragment("Server scope", key === canonicalLocalServer ? ServerScope.local : key) as ServerScope
  },
}

export const SessionRouteKey = {
  fromRoute(dir: string | undefined, sessionID?: string) {
    return fragment("Session route", `${dir ?? ""}${sessionID ? "/" + sessionID : ""}`) as SessionRouteKey
  },
}

export const SessionStateKey = {
  is(key: string): key is SessionStateKey {
    return key.includes(separator)
  },
  from(scope: ServerScope, route: SessionRouteKey) {
    return compose(scope, [route]) as SessionStateKey
  },
```

</details>

**依据 5 · 源码核查**：[packages/web/src/composer/submit.ts:377-414](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/composer/submit.ts#L377-L414)

真实prompt admission、steer/queue及同ID一次重试。

<details>
<summary>查看原文（38行）</summary>

```text
async function sendPrompt(
  session: ComposerSession,
  value: ComposerSubmission,
  track: ModelSelection["trackSessionCommit"] | undefined,
  onAdmit: () => void,
) {
  const request = await buildSubmissionRequest(session, value)
  // Switching agent or model reconfigures the session immediately, and with it
  // the remainder of a running turn. A steer targets that turn, so its
  // selection applies now; a queued follow-up must not reconfigure the turn it
  // waits behind, so it runs with the session selection at delivery time (the
  // intended selection stays recorded in its metadata).
  if (value.delivery === "steer") {
    await applySelection(session, value.selection, track)
  }

  const admission = {
    id: value.id,
    sessionID: session.id,
    delivery: value.delivery,
    text: request.text,
    files: request.files.map((file) => ({ uri: file.uri, name: file.name, mention: file.mention })),
    agents: request.agents,
    skills: request.skills,
    metadata: {
      displayText: request.displayText,
      comments: request.comments,
      attachments: request.attachments,
      agent: value.selection.agent,
      model: {
        ...value.selection.model,
        ...(value.selection.variant ? { variant: value.selection.variant } : {}),
      },
    },
  }
  const sending = session.data.session.prompt(admission).catch(() => session.data.session.prompt(admission))
  onAdmit()
  await sending
```

</details>

**依据 6 · 源码核查**：[packages/web/src/runtime/server/sync.tsx:33-39](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/sync.tsx#L33-L39)

断流标scope查询stale。

```text
  // Cached request/response queries are stale once the event stream drops; refetch them on next use.
  createEffect(() => {
    if (serverSDK.connection.status() === "connected") return
    void queryClient.invalidateQueries({
      predicate: (query) => query.queryKey[0] === serverSDK.scope,
      refetchType: "none",
    })
```

#### 缺口

- 外部OpenCode后端admission去重、断流重连及最终执行未验证。
  **影响**：不能将前端稳定ID和缓存作用域当作精确一次或后端隔离证明。
  **进一步探讨**：固定后端版本，断开响应并重试同ID，再核服务端操作数、会话和文件副作用。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 多服务器自动授权和使用负担怎样影响采用？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

最需要用户理解的边界是autoApprove为客户端全局设置，适用于所有会话、标签和服务器；每个server controller都会创建autoApprover。启用后permission.asked、当前store和重连sweep都会调用permission.reply once；它不只作用于当前可见标签，且重连后会处理此前挂起请求。这里不推断默认已启用，也不说客户端绕过了后端所有权限；事实是用户开启该模式会扩大自动应答覆盖，后端授权仍是上限。

已有enabled/disposed/generation检查、去重集合和有界重试，是避免停用后继续应答/无限重试的反证。它们不把全局偏好变成每个项目授权；后端上的shell和文件权限仍需另外约束。静态前端直连后端时使用Basic密码头，远程HTTPS/CORS与可信浏览器来源很关键；持久schema包含password，未将它视作加密保险箱或已完成浏览器存储安全审计。

适合有OpenCode后端和运维能力的人在可丢弃项目试输入、审查、取消和重连，先确认全局自动批准处于自己接受的状态。首次需部署/连接/认证，持续要维护后端和模型、浏览器本地状态及前后端兼容；现金、耗时、内存和节省都未知。遇到服务器/会话错位、意外批准或断流结果不明，应停止发送、关闭自动批准并回后端日志/文件核对，不能凭关页当取消。

#### 证据与依据

**依据 1 · 源码核查**：[packages/web/src/session/requests/auto-approve.ts:11-43](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/session/requests/auto-approve.ts#L11-L43)

全局设置覆盖所有会话/服务器，重连和本地pending扫过。

<details>
<summary>查看原文（33行）</summary>

```text
// Auto-approves permission requests on one server connection whenever the
// app-level auto-approve setting is on. The setting lives in the client-local
// settings store, so it applies to every session, tab, and server at once.
export function createPermissionAutoApprover(input: { sdk: ServerSDK; data: Data }) {
  const enabled = useSettings().permissions.autoApprove
  const state = { disposed: false, generation: 0, responded: new Set<string>() }

  const unsubscribe = input.sdk.event.on("permission.asked", (event) => {
    if (enabled()) approve(event.data)
  })
  onCleanup(() => {
    state.disposed = true
    unsubscribe()
  })

  // The event stream does not replay requests asked while this client was
  // disconnected, and requests may already be pending before the setting turns
  // on, so sweep on every connect while the setting is on.
  createEffect(() => {
    if (!enabled() || input.sdk.connection.status() !== "connected") return
    const generation = ++state.generation
    void sweepWithRetry(generation, 0)
  })

  // Approves pending requests that reach the local store, which is how a
  // previously unknown idle session's requests surface when its view opens
  // and syncs them. Store changes cannot re-trigger the network sweep: it
  // deliberately reads them after an await, outside Solid tracking.
  createEffect(() => {
    if (!enabled()) return
    for (const session of input.data.session.list()) {
      for (const request of input.data.session.permission.list(session.id) ?? []) approve(request)
    }
```

</details>

**依据 2 · 源码核查**：[packages/web/src/session/requests/auto-approve.ts:112-135](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/session/requests/auto-approve.ts#L112-L135)

实际once应答和有限重试。

<details>
<summary>查看原文（24行）</summary>

```text
  function approve(permission: PermissionRequest, attempt = 0) {
    // enabled() guards the retry timer path: the user may disable the setting
    // between a failed reply and its scheduled retry.
    if (state.disposed || !enabled() || state.responded.has(permission.id)) return
    remember(permission.id)
    input.sdk.api.permission
      .reply({ sessionID: permission.sessionID, requestID: permission.id, decision: "once" })
      .catch(() => {
        // A reply failure leaves the request pending but invisible (the UI
        // hides prompts while auto-approve is on), so retry a bounded number
        // of times. Later sweeps retry it after that.
        state.responded.delete(permission.id)
        if (state.disposed || attempt >= retryLimit) return
        setTimeout(() => approve(permission, attempt + 1), retryDelayMs * (attempt + 1))
      })
  }

  function remember(id: string) {
    state.responded.add(id)
    for (const oldest of state.responded) {
      if (state.responded.size <= respondedLimit) break
      state.responded.delete(oldest)
    }
  }
```

</details>

**依据 3 · 源码核查**：[packages/web/src/runtime/server/runtime.tsx:131-137](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/runtime.tsx#L131-L137)

每server controller实际创建autoApprover。

```text
  const data = createAppData({
    data: source,
    remove: (sessionID) => sdk.api.session.remove({ sessionID }),
  })
  const sync = createServerSyncContext(sdk, data)
  createPermissionAutoApprover({ sdk, data })
  const notification = createServerNotificationState({ sdk, data, key: connKey, coordinator: notificationCoordinator })
```

**依据 4 · 源码核查**：[packages/web/src/runtime/server/api.ts:19-33](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/api.ts#L19-L33)

Basic认证头真实构造。

<details>
<summary>查看原文（15行）</summary>

```text
export function createApiForServer(input: {
  server: ServerConnection.HttpBase
  fetch?: typeof globalThis.fetch
}): OpenCodeClient {
  return OpenCode.make({
    baseUrl: input.server.url,
    fetch: input.fetch,
    headers: input.server.password
      ? {
          Authorization: `Basic ${authTokenFromCredentials({
            password: input.server.password,
          })}`,
        }
      : undefined,
  })
```

</details>

**依据 5 · 源码核查**：[packages/web/src/runtime/server/persistence.ts:6-16](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/runtime/server/persistence.ts#L6-L16)

持久schema含password。

<details>
<summary>查看原文（11行）</summary>

```text
export const ServerHttpBase = Persistence.struct({
  url: Schema.String,
  password: Schema.optional(Schema.String),
})

export const ServerHttp = Persistence.struct({
  type: Schema.Literal("http"),
  http: ServerHttpBase,
  authToken: Schema.optional(Schema.Boolean),
  displayName: Schema.optional(Schema.String),
  label: Schema.optional(Schema.String),
```

</details>

**依据 6 · 作者声明**：[README.md:25-38](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/README.md#L25-L38)

作者要求后端、远程HTTPS/CORS与项目目录。

<details>
<summary>查看原文（14行）</summary>

````text
1. **启动 OpenCode V2 后端**。在能访问项目目录的机器上运行：

   ```sh
   opencode serve --hostname 127.0.0.1 --port 4096 --cors https://isomoes.github.io
   ```

   记下服务输出的密码。远程访问还需要 HTTPS 和正确的 CORS。

2. **连接 iKanban**。打开 <https://isomoes.github.io/ikanban/>，填写 OpenCode V2 服务地址和密码。
   也可以运行 `opencode pair`，在连接页面扫码配对；之后可在“设置 > 服务器”中管理多个后端。

3. **添加项目**。在主页点击“添加项目”，选择 OpenCode 后端上的项目目录。

4. **新建会话**。选择项目和工作区（主分支或新建 worktree），确认模型与智能体，输入提示词并发送。
````

</details>

#### 缺口

- 真实远程部署、浏览器存储与权限交互未运行，缺全周期成本对照。
  **影响**：不能保证跨端可靠、安全或减少合格任务成本。
  **进一步探讨**：固定前后端与隔离项目，核认证/重连/自动批准范围，记录失败与复核投入。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 授权作用域预览是否能减少意外放行？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

假设在开启全局自动批准前预览将受影响的服务器、会话及挂起请求，并提供按服务器限定的选择，可以减少用户把“当前任务授权”误解成“所有连接自动应答”。推导来自Q03重连扫描和全局设置，而不是认定作者没有权限界面；已有设置、enabled检查和scope命名是重要反证。

这项方案不替代后端权限，不能用前端列表完整性承诺覆盖未知闲置session。现有autoApprover注释也明确未加载闲置会话上的detached request可能未覆盖；因此预览必须表示已知范围与未确认范围，不能把数量当全量。

最小验证在两后端多会话安排可见/后台pending、断流重连和切换设置，比较现有开关与范围预览。观察用户对会被放行请求的预测正确率、误放行、判断时间和额外操作；若现有UI已足够、预览滞后误导或确认负担更大，则否定。没有实测前它只是设计假设，不算本项现有创新。

#### 证据与依据

**依据 1 · 源码核查**：[packages/web/src/session/requests/auto-approve.ts:11-33](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/session/requests/auto-approve.ts#L11-L33)

全局范围与重连sweep依据。

<details>
<summary>查看原文（23行）</summary>

```text
// Auto-approves permission requests on one server connection whenever the
// app-level auto-approve setting is on. The setting lives in the client-local
// settings store, so it applies to every session, tab, and server at once.
export function createPermissionAutoApprover(input: { sdk: ServerSDK; data: Data }) {
  const enabled = useSettings().permissions.autoApprove
  const state = { disposed: false, generation: 0, responded: new Set<string>() }

  const unsubscribe = input.sdk.event.on("permission.asked", (event) => {
    if (enabled()) approve(event.data)
  })
  onCleanup(() => {
    state.disposed = true
    unsubscribe()
  })

  // The event stream does not replay requests asked while this client was
  // disconnected, and requests may already be pending before the setting turns
  // on, so sweep on every connect while the setting is on.
  createEffect(() => {
    if (!enabled() || input.sdk.connection.status() !== "connected") return
    const generation = ++state.generation
    void sweepWithRetry(generation, 0)
  })
```

</details>

**依据 2 · 源码核查**：[packages/web/src/session/requests/auto-approve.ts:74-80](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/session/requests/auto-approve.ts#L74-L80)

已有覆盖限制，预览不能声称全量。

```text
  // Active sessions are the primary inventory: session.active is server-wide,
  // so it covers sessions no tab has loaded, and a request blocking a tool
  // call always belongs to one (Permission.assert clears its entry when the
  // awaiting fiber dies). Locally known sessions are swept too because the
  // external session.permission.create API can park a request on an idle
  // session. A detached request on a session this client never loaded is the
  // one case that stays uncovered.
```

**依据 3 · 源码核查**：[packages/web/src/session/requests/auto-approve.ts:112-125](https://github.com/isomoes/ikanban/blob/77b76a737ef07478cc95b0e341a88f027716c66b/packages/web/src/session/requests/auto-approve.ts#L112-L125)

已有停用和重试守卫，作为反证。

<details>
<summary>查看原文（14行）</summary>

```text
  function approve(permission: PermissionRequest, attempt = 0) {
    // enabled() guards the retry timer path: the user may disable the setting
    // between a failed reply and its scheduled retry.
    if (state.disposed || !enabled() || state.responded.has(permission.id)) return
    remember(permission.id)
    input.sdk.api.permission
      .reply({ sessionID: permission.sessionID, requestID: permission.id, decision: "once" })
      .catch(() => {
        // A reply failure leaves the request pending but invisible (the UI
        // hides prompts while auto-approve is on), so retry a bounded number
        // of times. Later sweeps retry it after that.
        state.responded.delete(permission.id)
        if (state.disposed || attempt >= retryLimit) return
        setTimeout(() => approve(permission, attempt + 1), retryDelayMs * (attempt + 1))
```

</details>

#### 缺口

- 未完整查当前设置UI说明，也无范围预览用户实验。
  **影响**：不能认定误解普遍存在或新增展示有价值。
  **进一步探讨**：先核实际设置页，再交叉测试范围预测与误放行，保留负结果。

[返回分类](../../views/categories/SOFTWARE-DELIVERY.md) · [返回首页](../../../README.md)
