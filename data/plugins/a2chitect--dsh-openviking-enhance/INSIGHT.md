# dsh-openviking-enhance

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[6cdb5f8](https://github.com/A2chitect/dsh-openviking-enhance/tree/6cdb5f8fc95151291519809024b8290a8758661b)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 1,656](https://img.shields.io/static/v1?label=npm+30d&message=1%2C656&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-27](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-27&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance)
<!-- END META -->

> **功能**：在 DSH Web 界面展示 OpenViking Studio、会话记忆提交状态和当前召回结果。

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将 Studio、归档状态和差异组织进 DSH 界面；增量在诊断集成，未证明改变底层检索能力或节时。

> **主要限制**：[Q03](#research-q03) 是当前重检索而非历史输入；[Q04](#research-q04) 的本地来源限制不核验独立用户和会话授权，不能将其当作多用户权限边界。

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
  - [Q01 · 谁需要该插件，它比独立 Studio 或 API 增加什么？](#detail-section-11)
  - [Q02 · 提交时间线如何对应会话和归档，缓存有哪些前提？](#detail-section-12)
  - [Q03 · 召回面板能否证明过去那一轮模型实际拿到了什么记忆？](#detail-section-13)
  - [Q04 · 哪些调用可读取记忆，配置保存后连接是否必然更新？](#detail-section-14)
  - [Q05 · 什么条件下可以试用，什么现象要求停止？](#detail-section-15)
  - [Q06 · 保存历史注入快照能否改善诊断？](#detail-section-16)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已运行 DSH 与 OpenViking 的维护者可在当前会话附近查看记忆归档与检索状态。

独立 OpenViking Studio 和直接 API 可分别查看会话、归档及搜索；集成减少界面切换的潜力尚无同任务对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
|---|---|---|
| Studio 面板 | 在 DSH 内打开服务界面 | 依赖可达服务及对应权限 |
| 归档状态 | 查看会话提交和差异 | 依赖 session 映射与终态缓存假设 |
| 当前召回 | 按最新或手动查询搜索记忆 | 不证明历史模型输入 |
| 本地路由 | 读取查询与记忆内容 | 回环来源不等于用户或会话认证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
|---|---|---|---|
| 兼容 DSH 和 Node | 启动需要 | 提供宿主与 Web 插槽 | 不能假定插件加载 |
| OpenViking 服务 | 诊断需要 | 提供会话、归档、内容与搜索 | 服务不可达时结果不可用 |
| 内存插件 | 相关身份和阈值需要 | 提供会话 ID、peer 和阈值 | 回退身份或阈值未知 |
| 可信本机和服务权限 | 读取敏感内容需要 | 限定请求者和数据 | 本地来源检查不等于用户授权 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
|---|---|---|
| 准备 | 用户核对宿主、服务与身份 | 使用非敏感测试会话 |
| 加载 | 用户安装后重启并确认端点 | 无法连接则核查服务配置 |
| 诊断 | 用户查看归档与当前搜索 | 与服务 API 核对会话与查询时间 |
| 退出 | 用户发现身份或权限不符 | 停止使用面板，回服务端 API 核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
|---|---|---|---|
| 首次 | 本地服务、存储和网络费用未知 | 安装、重启及配置身份，耗时未知 | 需兼容宿主和服务 |
| 持续 | 状态轮询与搜索资源未知 | 检查会话、查询及警告 | 无同任务效率对照 |
| 恢复 | 重新查询和日志资源未知 | 确认端点并返回 API 核查 | 连接重建及权限行为未实测 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
|---|---|---|
| 归档观察 | 会话 URI、终态和差异查询已接线 | 服务端数据准确性与净节时 |
| 召回诊断 | 当前消息驱动分目标搜索 | 过去实际注入内容 |
| 访问限制 | 回环和来源检查已实现 | 本机用户和会话授权 |

> **思考**：[Q03](#research-q03) 是当前重检索而非历史输入；[Q04](#research-q04) 的本地来源限制不核验独立用户和会话授权，不能将其当作多用户权限边界。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 与 [Q02](#research-q02) 将 Studio、归档状态和差异组织进 DSH 界面；增量在诊断集成，未证明改变底层检索能力或节时。

[Q02](#research-q02) 对终态与待定归档采用不同缓存策略；[Q04](#research-q04) 的来源围栏有明确范围，终态不可变和本机信任仍是部署假设。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 是当前重检索而非历史输入；[Q04](#research-q04) 的本地来源限制不核验独立用户和会话授权，不能将其当作多用户权限边界。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q05](#research-q05) 建议可信个人单机以非敏感会话对照一条归档和当前搜索；身份、端点或权限不符时停止并回服务端核查。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持条件性的观察与查询机制；真实服务、权限和诊断收益未经本次运行验证。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/client/index.tsx、src/host/index.ts、src/host/commit-service.ts、src/host/recall-service.ts、src/host/trust-fence.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：核查客户端注册、Host 会话与归档、重搜索、来源防线和连接建立；未审计 OpenViking 服务或全部 UI，不执行目标代码、测试或宿主。
- 下一步：在隔离单机固定服务与会话，比较 API 与界面、测试端点变更与回环请求，并对照真实模型输入而非仅重查。

**分析版本**

- **仓库**：[A2chitect/dsh-openviking-enhance](https://github.com/A2chitect/dsh-openviking-enhance)
- **版本号**：0.2.3（[固定提交 6cdb5f8](https://github.com/A2chitect/dsh-openviking-enhance/tree/6cdb5f8fc95151291519809024b8290a8758661b)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q06](#research-q06) 提出把真实注入收据与当前搜索并列的未验证方案；须先比较宿主日志并评估敏感信息保留。

在隔离单机固定服务与会话，比较 API 与界面、测试端点变更与回环请求，并对照真实模型输入而非仅重查。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 2281 | 1713 | 454 | — |
| .md | source | 4 | 778 | — | — | 8860 |
| .tsx | source | 6 | 1937 | 1395 | 429 | — |
| .ts | source | 16 | 3686 | 2350 | 1093 | — |
| .mjs | test | 8 | 2023 | 1625 | 295 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A2chitect/dsh-openviking-enhance/issues?q=is%3Aissue+is%3Aopen)

暂未获取：近30天新建、近30天关闭。

统计日期：2026-11-04。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：核查 OpenViking 归档与当前召回诊断的接线、身份和可信边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要该插件，它比独立 Studio 或 API 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

已使用 DSH 和 OpenViking 的维护者可在会话附近查看归档、记忆差异与当前检索结果。原办法是切到 OpenViking Studio 或手动查询会话、文件和搜索 API。README 将 Studio、提交状态和召回列为目标；package 声明 bundle 与 Web 客户端，客户端实际注册 Studio 和会话状态插槽。其贡献是把现有服务的观察入口组织进 DSH，不是新的记忆写入或检索算法；源码不能证明用户需求、诊断准确度或净节时。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:5-18](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/README.md#L5-L18)

作者描述工作场景。

<details>
<summary>查看原文（14行）</summary>

```text
**v0.2.3** · [Changelog](CHANGELOG.md)

Brings your local [OpenViking](https://docs.openviking.ai) memory server into the
DeepSeek Harness (DSH) Web GUI: a Studio panel in the left sidebar, and a commit
status pill under the message box that shows what each session commit did to your
memories.

Nothing needs to be patched in DSH or in the OpenViking plugin — it mounts as an
ordinary DSH bundle.

## What you get

**OpenViking Studio, inside DSH.** A new row at the bottom of the left sidebar
opens the OpenViking server's own Studio UI in the main area, so you can browse
```

</details>

**依据 2 · 源码核查**：[package.json:1-13](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/package.json#L1-L13)

名称、描述和入口。

<details>
<summary>查看原文（13行）</summary>

```text
{
  "name": "dsh-openviking-enhance",
  "version": "0.2.3",
  "description": "OpenViking in the DSH web GUI: a Studio panel, a per-session memory-commit status pill with its commit timeline, and a right-sidebar tab showing what the current session retrieves.",
  "type": "module",
  "icon": "./icon.svg",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
```

</details>

**依据 3 · 源码核查**：[package.json:21-39](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/package.json#L21-L39)

bundle 和 Web 注入声明。

<details>
<summary>查看原文（19行）</summary>

```text
    "LICENSE"
  ],
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
```

</details>

**依据 4 · 源码核查**：[src/client/index.tsx:305-318](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/client/index.tsx#L305-L318)

注册 Studio 面板与侧栏入口。

<details>
<summary>查看原文（14行）</summary>

```text
  function mountSidebarEntry(): () => void {
    const disposeMain = slots.inject('main', () =>
      slots.register({ name: 'main', key: PANEL_ID }, StudioPanel),
    )
    const disposeRow = slots.inject('sidebar.panellist', () =>
      slots.register(
        {
          name: 'sidebar.panellist',
          id: PANEL_ID,
          order: SIDEBAR_ORDER,
          label: () => 'OpenViking',
        },
        SidebarIcon,
      ),
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:329-340](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/client/index.tsx#L329-L340)

注册会话状态插槽。

<details>
<summary>查看原文（12行）</summary>

```text
  /**
   * The session footer status pill. The inject factory receives the session id
   * because the slot is session-scoped. `order: 1` places it after the shell's
   * stats pills and the context meter; the row keeps its own centring.
   */
  function mountCommitStatus(): () => void {
    return slots.inject('conversation.composer.dock', () =>
      slots.register(
        {
          name: 'conversation.composer.dock',
          id: 'openviking-commit',
          order: 1,
```

</details>

#### 缺口

- 没有独立用户及同任务对照
  **影响**：不能量化收益与需求持续性
  **进一步探讨**：以相同服务、会话与诊断任务对照 Studio 与 API。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提交时间线如何对应会话和归档，缓存有哪些前提？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

Host 优先从 OpenViking 内存插件运行态取得对应会话 ID 与 peer，缺少 ID 时按 dsh-前缀回退。状态读取先请求该会话元数据，再以返回的 session URI 决定 history 路径；同会话短期缓存和在途请求合并减少重复查询。归档探测读取完成标记、差异和失败标记，终态缓存至进程结束，未完成或未知稍后重试；该缓存依赖终态不可变的假设。差异路由检查请求的归档 URI 是否与所选 session ID 的路径匹配，缺失差异作为 pending 返回。路径匹配并不证明调用者有权读取该会话，也不证明服务端结果完整；上游失败与身份回退必须结合显示和日志核对。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/commit-service.ts:117-137](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/commit-service.ts#L117-L137)

会话 ID 与 peer 的来源和缺省。

<details>
<summary>查看原文（21行）</summary>

```text
  /** OpenViking session key for a DSH session. */
  ovSessionId(sessionId: string): string {
    const fromPlugin = this.options.memoryRuntime()?.states?.get(sessionId)?.ovSessionId
    return typeof fromPlugin === 'string' && fromPlugin.length > 0 ? fromPlugin : `dsh-${sessionId}`
  }

  /**
   * Actor peer, when the OpenViking plugin knows it.
   *
   * Public because peer-scoped routing is not a commit concern: the recall
   * service needs the same identity to search the same peer's memories.
   */
  actorPeer(sessionId: string): string | undefined {
    const peer = this.options.memoryRuntime()?.states?.get(sessionId)?.config?.peerId
    return typeof peer === 'string' && peer.length > 0 ? peer : undefined
  }

  /** Effective commit threshold; null when the OpenViking plugin is not mounted. */
  private threshold(sessionId: string): number | null {
    const value = this.options.memoryRuntime()?.states?.get(sessionId)?.config?.commitTokenThreshold
    return typeof value === 'number' && Number.isFinite(value) ? value : null
```

</details>

**依据 2 · 源码核查**：[src/host/commit-service.ts:140-171](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/commit-service.ts#L140-L171)

缓存、合并请求和从元数据解析 history。

<details>
<summary>查看原文（32行）</summary>

```text
  async status(sessionId: string, options: { fresh?: boolean } = {}): Promise<CommitStatus> {
    const cached = this.cache.get(sessionId)
    if (!options.fresh && cached && Date.now() - cached.at < this.cacheTtlMs) return cached.value

    // One upstream read per session at a time. Several GUI tabs, or a poll and a
    // user-triggered refresh, then share one round trip instead of multiplying it.
    const running = this.inflight.get(sessionId)
    if (running) return running

    const work = this.readStatus(sessionId, options.fresh === true)
      .then((value) => {
        this.cache.set(sessionId, { at: Date.now(), value })
        return value
      })
      .finally(() => {
        this.inflight.delete(sessionId)
      })
    this.inflight.set(sessionId, work)
    return work
  }

  /** One uncached upstream read; `status()` owns caching and in-flight sharing. */
  private async readStatus(sessionId: string, fresh: boolean): Promise<CommitStatus> {
    const ovSessionId = this.ovSessionId(sessionId)
    const request = { actorPeerId: this.actorPeer(sessionId) }
    // Sequential, not parallel: the history path must be derived from the
    // session's own `uri`, which only the first call can answer. It costs one
    // round trip (~7 ms) and removes a whole class of "never committed" lies for
    // sessions owned by another user or peer.
    const meta = await this.options.api.getSession(ovSessionId, request)
    const historyUri = resolveSessionUri(meta.result, ovSessionId, this.options.api.user)
    const history = await this.options.api.listHistory(historyUri, request)
```

</details>

**依据 3 · 源码核查**：[src/host/commit-service.ts:289-336](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/commit-service.ts#L289-L336)

标记、差异、终态缓存和重试。

<details>
<summary>查看原文（48行）</summary>

```text
  private async probeArchive(
    sessionId: string,
    archiveUri: string,
    options: { fresh?: boolean } = {},
  ): Promise<ArchiveProbe> {
    const cached = this.probes.get(archiveUri)
    if (cached) return cached
    if (!options.fresh && (this.probeRetryAt.get(archiveUri) ?? 0) > Date.now()) {
      return { state: 'pending', failure: null, diff: null, markers: false }
    }

    const request = { actorPeerId: this.actorPeer(sessionId) }
    const base = archiveUri.replace(/\/+$/, '')
    const done = await this.options.api.readText(`${base}/.done`, request)
    const donePresent = done.ok && done.result !== null
    const doneUnreadable = !done.ok && done.status !== 404
    const [diffResponse, failedResponse] = await Promise.all([
      this.options.api.readJson<RawMemoryDiff>(`${base}/memory_diff.json`, request),
      donePresent || doneUnreadable
        ? Promise.resolve(null)
        : this.options.api.readJson<RawFailedMarker>(`${base}/.failed.json`, request),
    ])

    const diff = diffResponse.ok && diffResponse.result ? normalizeDiff(archiveUri, diffResponse.result) : null
    const failure =
      failedResponse !== null && failedResponse.ok && failedResponse.result
        ? normalizeFailure(failedResponse.result)
        : null
    const diffUnreadable = !diffResponse.ok && diffResponse.status !== 404
    const failedUnreadable = failedResponse !== null && !failedResponse.ok && failedResponse.status !== 404

    let state: ArchiveState
    if (donePresent) state = 'done'
    else if (failure !== null) state = 'failed'
    else if (doneUnreadable || diffUnreadable || failedUnreadable) state = 'unknown'
    // Legacy servers without terminal markers only wrote memory_diff.json; a
    // readable diff is the only success signal they offer.
    else if (diff !== null) state = 'done'
    else state = 'pending'

    const probe: ArchiveProbe = { state, failure, diff, markers: donePresent || failure !== null }
    if (state === 'done' || state === 'failed') {
      this.probes.set(archiveUri, probe)
      this.probeRetryAt.delete(archiveUri)
      return probe
    }
    this.probeRetryAt.set(archiveUri, Date.now() + this.pendingRetryMs)
    return probe
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:353-376](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L353-L376)

路由检查归档属于指定会话并返回差异。

<details>
<summary>查看原文（24行）</summary>

```text
      path: `${API_PREFIX}/diff`,
      handler: async (req, res) => {
        if (!guard(req, res)) return
        const params = query(req)
        const sessionId = params.get('sessionId') ?? ''
        const archiveUri = params.get('archive') ?? ''
        if (!sessionId || !archiveUri) {
          writeJson(res, 400, { ok: false, error: 'sessionId and archive are required' } satisfies ApiResult<never>)
          return
        }
        const ovSessionId = service.ovSessionId(sessionId)
        if (!isArchiveUriForSession(archiveUri, ovSessionId)) {
          writeJson(res, 400, { ok: false, error: 'archive is not part of this session history' } satisfies ApiResult<never>)
          return
        }
        try {
          const diff = await service.diff(sessionId, archiveUri)
          if (!diff) {
            // Not an error: the archive exists but extraction has not written
            // the diff yet. The UI shows this as "extracting…".
            writeJson(res, 200, { ok: true, diff: null, pending: true })
            return
          }
          writeJson(res, 200, { ok: true, diff, pending: false })
```

</details>

#### 缺口

- 没有真实服务、身份迁移或标记更新实验
  **影响**：不能证明归档完整、旧缓存永远正确或诊断结果准确
  **进一步探讨**：在隔离服务核对 session URI、终态标记、差异和刷新。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 召回面板能否证明过去那一轮模型实际拿到了什么记忆？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

不能。Host 取调用方手动 query，未提供时读取该 OpenViking 会话 messages.jsonl 中最近一条用户消息；然后按当前 session ID 和 peer 对多个目标发起新的 search，并汇总结果及搜索时间。搜索失败会产生 warning；同 query 的短期缓存也可能复用已有结果。该流程没有读取当时模型输入或持久化的历史注入快照，记忆、索引或筛选条件改变后当前重查结果可能不同；即使搜索内容一致也不能证明当时模型实际看见它。诊断历史注入应另查实际请求或可靠日志。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/recall-service.ts:60-80](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L60-L80)

请求、query 与缓存。

<details>
<summary>查看原文（21行）</summary>

```text
   * Retrieve for one session.
   *
   * `query` overrides the session's own last prompt: an empty string asks the
   * session, whitespace-only is treated as absent.
   */
  async recall(
    sessionId: string,
    query?: string,
    limit = RECALL_DEFAULT_LIMIT,
    options: { fresh?: boolean } = {},
  ): Promise<RecallPayload> {
    const capped = Math.min(Math.max(Math.trunc(limit) || RECALL_DEFAULT_LIMIT, 1), RECALL_MAX_LIMIT)
    const explicit = (query ?? '').trim().slice(0, MAX_QUERY_CHARS)
    const cacheKey = `${sessionId}\u0000${explicit}\u0000${capped}`
    const cached = this.cache.get(cacheKey)
    if (!options.fresh && cached && this.now() - cached.at < this.cacheTtlMs) return cached.value

    const value = await this.collect(sessionId, explicit, capped)
    // Only successful, non-empty answers are worth reusing: an error is cheap to
    // retry and caching it would pin a dead server into the panel.
    if (value.query.text.length > 0) this.cache.set(cacheKey, { at: this.now(), value })
```

</details>

**依据 2 · 源码核查**：[src/host/recall-service.ts:84-108](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L84-L108)

定位会话并获取当前查询。

<details>
<summary>查看原文（25行）</summary>

```text
  private async collect(sessionId: string, explicitQuery: string, limit: number): Promise<RecallPayload> {
    const started = this.now()
    const warnings: PluginNotice[] = []
    const { api, commit } = this.options

    const ovSessionId = commit.ovSessionId(sessionId)
    const peer = commit.actorPeer(sessionId) ?? null
    const request = peer === null ? {} : { actorPeerId: peer }

    const meta = await api.getSession(ovSessionId, request)
    const sessionUri = meta.ok && meta.result ? resolveSessionUri(meta.result, ovSessionId, api.user) : null
    if (!meta.ok) warnings.push({ code: 'sessionFailed', params: { error: meta.error ?? `HTTP ${meta.status}` } })

    let queryText = explicitQuery
    let querySource: RecallQuerySource = 'manual'
    if (queryText.length === 0 && sessionUri !== null) {
      const prompt = await this.sessionPrompt(sessionUri, request)
      if (prompt === null) warnings.push({ code: 'noPrompt' })
      else {
        queryText = prompt
        querySource = 'session'
      }
    }

    const targets = searchTargets(sessionUri, api.user, peer)
```

</details>

**依据 3 · 源码核查**：[src/host/recall-service.ts:126-150](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L126-L150)

向当前目标发起搜索并记录失败。

<details>
<summary>查看原文（25行）</summary>

```text
    const replies = await Promise.all(
      targets.map((target) =>
        api
          .search(
            {
              query: queryText,
              target_uri: target.uri,
              limit,
              score_threshold: 0,
              session_id: ovSessionId,
            },
            request,
          )
          .then((reply) => ({ target, reply })),
      ),
    )

    const merged = new Map<string, Map<string, RecallItem>>(
      RECALL_BUCKETS.map((bucket) => [bucket, new Map<string, RecallItem>()] as const),
    )
    let plan: string | null = null
    let total = 0
    for (const { target, reply } of replies) {
      if (!reply.ok || reply.result === null) {
        warnings.push({ code: 'targetFailed', params: { target: target.uri, error: reply.error ?? `HTTP ${reply.status}` } })
```

</details>

**依据 4 · 源码核查**：[src/host/recall-service.ts:193-200](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L193-L200)

从当前会话消息日志取得最近提示。

```text
  /** The session's most recent user prompt, from the plugin's own capture log. */
  private async sessionPrompt(
    sessionUri: string,
    request: { actorPeerId?: string },
  ): Promise<string | null> {
    const log = await this.options.api.readText(`${sessionUri}/messages.jsonl`, request)
    if (!log.ok || log.result === null) return null
    return latestUserPrompt(log.result)
```

#### 缺口

- 没有历史注入记录及对照重放
  **影响**：不能将当前搜索结果用于证明过去模型上下文
  **进一步探讨**：对照服务及宿主的实际请求日志，修改记忆后比较前后查询。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 哪些调用可读取记忆，配置保存后连接是否必然更新？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程、工程质量与复用

#### 完整回答

Host 对路由要求 GET、回环 socket 和 Host、非跨站标志以及存在时一致的 Origin；Origin 缺省时允许，代码明确说明这些路由不受 DSH Web 认证门保护。这个围栏约束网络来源，但没有在所查路径中验证调用者用户身份或会话归属，本机可访问进程仍属于需要信任的边界；diff 的 session 路径校验与用户授权是不同条件。连接配置在 start 时解析一次并构建 API 与服务对象；界面设置可编辑不等于此 Host 已重建连接，应核对当前 config 返回的 endpoint 与实际服务，必要时重启。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:201-234](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L201-L234)

启动时解析连接并实例化服务。

<details>
<summary>查看原文（34行）</summary>

```text
function start(ctx: Context, config: EnhanceConfigInput): void {
  const host = ctx as unknown as HostContext
  const connection = resolveConnection({
    endpoint: configText(config.endpoint),
    apiKey: configText(config.apiKey),
    account: configText(config.account),
    user: configText(config.user),
  })
  const logger = host.logger
  logger?.info?.(`[openviking-enhance] ${JSON.stringify(describeConnection(connection))}`)

  const api = new OpenVikingApi(connection)
  const studioPath = normalizeStudioPath(configText(config.studioPath))

  const memoryRuntime = (): OpenVikingMemoryRuntime | null => {
    try {
      const value = host.get('openvikingMemory')
      return value && typeof value === 'object' ? (value as OpenVikingMemoryRuntime) : null
    } catch {
      return null
    }
  }

  const service = new CommitService({
    api,
    memoryRuntime,
    cacheTtlMs: configNumber(config.cacheTtlMs, 2500),
  })

  const recall = new RecallService({
    api,
    commit: service,
    cacheTtlMs: configNumber(config.recallCacheTtlMs, 15000),
  })
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:255-268](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L255-L268)

路由 GET 和本地来源防线。

<details>
<summary>查看原文（14行）</summary>

```text
  /**
   * Refuse anything that is not a same-origin request from the loopback
   * interface. These routes are not covered by the DSH web auth gate, and
   * `/diff` returns memory bodies — see `trust-fence.ts` for what each check
   * buys. Read-only is not a reason to skip this: the payload is private.
   */
  const guard = (req: IncomingMessage, res: ServerResponse): boolean => {
    if (req.method !== 'GET') {
      writeJson(res, 405, { ok: false, error: 'method-not-allowed' } satisfies ApiResult<never>)
      return false
    }
    if (isTrustedLocalRequest(req)) return true
    writeJson(res, 403, { ok: false, error: 'forbidden' } satisfies ApiResult<never>)
    return false
```

</details>

**依据 3 · 源码核查**：[src/host/trust-fence.ts:76-100](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/trust-fence.ts#L76-L100)

socket、Host、跨站与可缺省 Origin。

<details>
<summary>查看原文（25行）</summary>

```text
/**
 * The fence itself: a loopback socket on a loopback authority, without a
 * cross-site fetch marker, and with `Origin` — when the browser sends one —
 * naming that same authority.
 */
export function isTrustedLocalRequest(request: IncomingMessage): boolean {
  if (!isLoopbackAddress(request.socket?.remoteAddress)) return false

  const authority = hostUrl(request.headers.host)
  if (authority === null) return false
  if (!isLoopbackHostname(authority.hostname)) return false

  if (request.headers['sec-fetch-site'] === 'cross-site') return false

  const origin = request.headers.origin
  if (origin === undefined) return true
  try {
    const parsed = new URL(origin)
    // A sandboxed iframe sends the literal `null`; it is not this document's
    // origin, so it fails here rather than falling through to trust.
    return parsed.host === authority.host
  } catch {
    return false
  }
}
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:353-369](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L353-L369)

归档路径与所选会话的限制。

<details>
<summary>查看原文（17行）</summary>

```text
      path: `${API_PREFIX}/diff`,
      handler: async (req, res) => {
        if (!guard(req, res)) return
        const params = query(req)
        const sessionId = params.get('sessionId') ?? ''
        const archiveUri = params.get('archive') ?? ''
        if (!sessionId || !archiveUri) {
          writeJson(res, 400, { ok: false, error: 'sessionId and archive are required' } satisfies ApiResult<never>)
          return
        }
        const ovSessionId = service.ovSessionId(sessionId)
        if (!isArchiveUriForSession(archiveUri, ovSessionId)) {
          writeJson(res, 400, { ok: false, error: 'archive is not part of this session history' } satisfies ApiResult<never>)
          return
        }
        try {
          const diff = await service.diff(sessionId, archiveUri)
```

</details>

**依据 5 · 源码核查**：[src/host/index.ts:383-401](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L383-L401)

召回读取指定 session。

<details>
<summary>查看原文（19行）</summary>

```text
      kind: 'exact',
      path: `${API_PREFIX}/recall`,
      handler: async (req, res) => {
        if (!guard(req, res)) return
        const params = query(req)
        const sessionId = params.get('sessionId') ?? ''
        if (!sessionId) {
          writeJson(res, 400, { ok: false, error: 'sessionId is required' } satisfies ApiResult<never>)
          return
        }
        try {
          // `query` is absent for the session's own last prompt; `limit` bounds
          // each bucket, so a crafted request cannot ask for the whole library.
          const requested = Number(params.get('limit') ?? RECALL_DEFAULT_LIMIT)
          const limit = Number.isFinite(requested) ? requested : RECALL_DEFAULT_LIMIT
          const payload = await recall.recall(sessionId, params.get('query') ?? undefined, limit, {
            fresh: params.get('fresh') === '1',
          })
          writeJson(res, 200, { ok: true, recall: payload })
```

</details>

#### 缺口

- 没有多用户、本机进程或实际热更新实验
  **影响**：不能确认目标部署中的访问隔离与设置生效
  **进一步探讨**：隔离环境测试不同来源请求、连接变更后实际响应并核对服务日志。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 什么条件下可以试用，什么现象要求停止？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

源码包声明 Node ^22.19 或 >=24、DSH 相关版本和 Web 客户端依赖；README 要求本地 OpenViking，推荐安装负责提交的内存插件，并要求安装后重启。服务身份、会话绑定、端点和凭据须匹配，服务缺失时面板无法支持真实诊断；没有内存插件时部分阈值或身份退化。个人可信单机可用非敏感测试会话先把一条归档及一次当前搜索与服务 API 对照。若 session 不符、保存配置后仍连接旧端点、路由能被不应信任的本机调用方访问，或把当前搜索当成过去注入，应停止依赖面板并回到服务端 API 核对。现金费用、查询次数、人时和净收益均未知。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:21-39](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/package.json#L21-L39)

宿主与 Web 客户端声明。

<details>
<summary>查看原文（19行）</summary>

```text
    "LICENSE"
  ],
  "dsh": {
    "manifestVersion": 1,
    "engines": {
      "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2"
    },
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "platform": "web",
      "inject": [
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-slots",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-layout",
        "@deepseek-ai/dsh-client-ui-sidebar",
        "@deepseek-ai/dsh-client-ui-sidebar-right",
```

</details>

**依据 2 · 源码核查**：[package.json:73-81](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/package.json#L73-L81)

Node 和 DSH 版本声明。

```text
    "typescript": "~5.7.2"
  },
  "peerDependencies": {
    "@deepseek-ai/dsh": "^0.2.0-rc.1 || ^0.2.1-rc.2",
    "react": "^18.2.0"
  },
  "engines": {
    "node": "^22.19.0 || >=24",
    "dsh": ">=0.2.0-rc.2 || >=0.2.1-rc.2"
```

**依据 3 · 作者声明**：[README.md:67-96](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/README.md#L67-L96)

依赖、安装与重启为作者声明。

<details>
<summary>查看原文（30行）</summary>

````text
| | |
| --- | --- |
| DSH | 0.2.0-rc.2 or newer (desktop or web profile; verified on 0.2.1-rc.3) |
| OpenViking | A local server; 0.5.1.1 tested. Studio is served at `/studio/` on the same port |
| Memory plugin | `@openviking/dsh-memory-plugin` recommended — it is what commits sessions. Without it the panel still works, but pending-token thresholds are unknown |

## Install

Install it from the Plugins page (Add plugin → package name or tarball), or:

```bash
# from npm
dsh plugin --profile desktop add dsh-openviking-enhance

# or the prebuilt tarball from the latest release
dsh plugin --profile desktop add https://github.com/A2chitect/dsh-openviking-enhance/releases/latest/download/dsh-openviking-enhance.tgz
```

Installing straight from a Git URL is refused by pnpm — the package asks to run a
build script and pnpm blocks those until they are allowed — so a source checkout is
installed as a tarball instead. The client half is a prebuilt bundle: a source
install would have nothing to load.

```bash
pnpm pack && dsh plugin --profile desktop add ./dsh-openviking-enhance-<version>.tgz
```

Then restart the DSH app once: the host half is loaded at startup. To remove it:

```bash
````

</details>

**依据 4 · 源码核查**：[src/host/commit-service.ts:117-137](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/commit-service.ts#L117-L137)

身份和阈值依赖。

<details>
<summary>查看原文（21行）</summary>

```text
  /** OpenViking session key for a DSH session. */
  ovSessionId(sessionId: string): string {
    const fromPlugin = this.options.memoryRuntime()?.states?.get(sessionId)?.ovSessionId
    return typeof fromPlugin === 'string' && fromPlugin.length > 0 ? fromPlugin : `dsh-${sessionId}`
  }

  /**
   * Actor peer, when the OpenViking plugin knows it.
   *
   * Public because peer-scoped routing is not a commit concern: the recall
   * service needs the same identity to search the same peer's memories.
   */
  actorPeer(sessionId: string): string | undefined {
    const peer = this.options.memoryRuntime()?.states?.get(sessionId)?.config?.peerId
    return typeof peer === 'string' && peer.length > 0 ? peer : undefined
  }

  /** Effective commit threshold; null when the OpenViking plugin is not mounted. */
  private threshold(sessionId: string): number | null {
    const value = this.options.memoryRuntime()?.states?.get(sessionId)?.config?.commitTokenThreshold
    return typeof value === 'number' && Number.isFinite(value) ? value : null
```

</details>

**依据 5 · 源码核查**：[src/host/index.ts:201-234](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/index.ts#L201-L234)

连接在启动中解析。

<details>
<summary>查看原文（34行）</summary>

```text
function start(ctx: Context, config: EnhanceConfigInput): void {
  const host = ctx as unknown as HostContext
  const connection = resolveConnection({
    endpoint: configText(config.endpoint),
    apiKey: configText(config.apiKey),
    account: configText(config.account),
    user: configText(config.user),
  })
  const logger = host.logger
  logger?.info?.(`[openviking-enhance] ${JSON.stringify(describeConnection(connection))}`)

  const api = new OpenVikingApi(connection)
  const studioPath = normalizeStudioPath(configText(config.studioPath))

  const memoryRuntime = (): OpenVikingMemoryRuntime | null => {
    try {
      const value = host.get('openvikingMemory')
      return value && typeof value === 'object' ? (value as OpenVikingMemoryRuntime) : null
    } catch {
      return null
    }
  }

  const service = new CommitService({
    api,
    memoryRuntime,
    cacheTtlMs: configNumber(config.cacheTtlMs, 2500),
  })

  const recall = new RecallService({
    api,
    commit: service,
    cacheTtlMs: configNumber(config.recallCacheTtlMs, 15000),
  })
```

</details>

#### 缺口

- 服务兼容、运行成本与真实诊断收益未测
  **影响**：无法计算净收益或确认实际配置行为
  **进一步探讨**：在隔离单机记录真实连接、状态、搜索及对照操作时间。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 保存历史注入快照能否改善诊断？

**研究主题**：新假设与验证、贡献与相对优势

#### 完整回答

未验证的设计假设是在记忆注入边界保存带会话、轮次、查询、命中版本及时间的最小收据，再把当时命中与当前重新检索并列展示。相对当前重查，潜在增量是区分当时模型输入与后来索引变化；但需要准确接入宿主真实注入路径、处理敏感记忆、权限与保留期限，否则会制造新的隐私和存储负担。用同一会话在改变记忆前后比较真实请求日志、收据和当前检索；如果现有宿主日志已能可靠提供同等证据，或收据泄露风险及维护成本更高，就不引入。当前没有实现和实验。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/recall-service.ts:84-108](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L84-L108)

当前 query 的来源。

<details>
<summary>查看原文（25行）</summary>

```text
  private async collect(sessionId: string, explicitQuery: string, limit: number): Promise<RecallPayload> {
    const started = this.now()
    const warnings: PluginNotice[] = []
    const { api, commit } = this.options

    const ovSessionId = commit.ovSessionId(sessionId)
    const peer = commit.actorPeer(sessionId) ?? null
    const request = peer === null ? {} : { actorPeerId: peer }

    const meta = await api.getSession(ovSessionId, request)
    const sessionUri = meta.ok && meta.result ? resolveSessionUri(meta.result, ovSessionId, api.user) : null
    if (!meta.ok) warnings.push({ code: 'sessionFailed', params: { error: meta.error ?? `HTTP ${meta.status}` } })

    let queryText = explicitQuery
    let querySource: RecallQuerySource = 'manual'
    if (queryText.length === 0 && sessionUri !== null) {
      const prompt = await this.sessionPrompt(sessionUri, request)
      if (prompt === null) warnings.push({ code: 'noPrompt' })
      else {
        queryText = prompt
        querySource = 'session'
      }
    }

    const targets = searchTargets(sessionUri, api.user, peer)
```

</details>

**依据 2 · 源码核查**：[src/host/recall-service.ts:126-139](https://github.com/A2chitect/dsh-openviking-enhance/blob/6cdb5f8fc95151291519809024b8290a8758661b/src/host/recall-service.ts#L126-L139)

当前按目标重新搜索。

<details>
<summary>查看原文（14行）</summary>

```text
    const replies = await Promise.all(
      targets.map((target) =>
        api
          .search(
            {
              query: queryText,
              target_uri: target.uri,
              limit,
              score_threshold: 0,
              session_id: ovSessionId,
            },
            request,
          )
          .then((reply) => ({ target, reply })),
```

</details>

#### 缺口

- 没有注入边界接入、隐私模型和对照结果
  **影响**：无法确认能可靠复现历史上下文或值得保存
  **进一步探讨**：在隔离会话对照真实模型请求、快照和现有日志并测试删除。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
