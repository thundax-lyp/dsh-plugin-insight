# dsh-openviking-enhance

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[72a24cc](https://github.com/A2chitect/dsh-openviking-enhance/tree/72a24cc6755010df25b4cef39f3710290c911ec0)

<!-- BEGIN META -->
[![GitHub ★ 3](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=3&color=yellow&logo=github&style=flat)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 631](https://img.shields.io/static/v1?label=npm+30d&message=631&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-openviking-enhance)
<!-- END META -->

> **实现功能**：把本地 OpenViking Studio、会话提交状态与记忆召回详情接入 DSH 的只读观察插件。

> **核心亮点**：在 DSH UI 直接追踪 commit 进度、archive diff 和当前召回证据，减少跨应用诊断。详见[Q01](#research-q01)。

> **风险与缺陷**：当前召回不是历史注入记录；HTTP 防线是 loopback 而非用户身份授权；volatile 保存后的 host 重构需验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

**本文目录**

- [1 插件分析](#detail-section-1)
  - [1.1 用途与适用场景](#detail-section-2)
  - [1.2 能力、流程与成本](#detail-section-3)
  - [1.3 工程贡献](#detail-section-4)
  - [1.4 主要限制](#detail-section-5)
  - [1.5 使用建议](#detail-section-6)
  - [1.6 核查说明与分析版本](#detail-section-7)
- [2 未来设计假设（未验证）](#detail-section-8)
- [3 辅助信息](#detail-section-9)
- [4 研究问题与完整回答](#detail-section-10)
  - [Q01 · 插件实际补充了 OpenViking 的什么可见性？](#detail-section-11)
  - [Q02 · commit 与 recall 怎样形成会话解释？](#detail-section-12)
  - [Q03 · 本地 HTTP 防线与会话/内容边界是什么？](#detail-section-13)
  - [Q04 · 设置和密钥更改是否即时生效？](#detail-section-14)
  - [Q05 · 适用场景与接入边界如何验证？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：适合可信单机的 OpenViking 记忆调试与会话解释。详见[Q01](#research-q01)。

直接打开 OpenViking Studio 或调用原生 API 可获取数据；本插件将会话解释整合在 DSH，但增加本机读权限面。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| Studio | 查看 OV | 目标认证未测 |
| Commit | 追踪 archive | 服务状态依赖 |
| Recall | 展示来源 | 当前重新检索 |

**流程与依赖**

#### 启动与依赖

| 依赖 | 必需 | 用途 | 缺失后果 |
| --- | --- | --- | --- |
| DSH 0.2.0-rc.2+ | 作者声明 | UI/路由宿主 | 未验兼容 |
| OpenViking 服务 | 必需 | 记忆 API | 展示失败 |
| memory-plugin runtime | 可选 | 准确 ID/peer/阈值 | 使用回退或缺进度 |

#### 使用步骤

| 步骤 | 动作 | 判据/恢复 |
| --- | --- | --- |
| 配置 | 指向本机 OV | /config 健康 |
| 对照 | session/history/search | 核来源与 peer |
| 查看 | Studio/状态/recall | 解释当前检索 |
| 复核 | 保存配置后重新查 | 警惕旧连接 |

**效果与成本**

#### 成本

| 阶段 | 本插件动作 | 现金/资源 | 人工/时间 | 未知与失败恢复 |
| --- | --- | --- | --- | --- |
| 首次 | 部署 DSH/OV、配置 endpoint/key/peer 与可选 memoryRuntime | 本机服务/存储与安装资源；许可或订阅金额未见，未知 | 身份、版本和隔离网络设置工时未知 | 配错需核 /config、重启/重载与回退 |
| 持续 | 加载 Studio、session/history/search、缓存刷新 | API 请求/本机 CPU/缓存；现金和实际延迟未知 | 核当前召回和历史注入差别，工时未知 | 多会话/多 peer 的负载未知 |
| 失败恢复 | 处理旧 key/endpoint、跨会话内容泄露或错误解释 | 重新检索/日志与潜在隐私损失，现金未知 | 轮换 key、核同机进程、纠正审查记录，工时未知 | 同机多用户暴露范围及恢复频率未测 |

#### 效果

| 效果项 | 源码支持 | 未证实 |
| --- | --- | --- |
| 会话状态 | 元数据与 archive | 目标服务准确性 |
| 召回解释 | 当前 session-aware 搜索 | 历史注入一致性 |
| Studio | iframe URL | 浏览器权限/认证 |

> **思考**：当前召回不是历史注入记录；HTTP 防线是 loopback 而非用户身份授权；volatile 保存后的 host 重构需验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：在 DSH UI 直接追踪 commit 进度、archive diff 和当前召回证据，减少跨应用诊断。详见[Q01](#research-q01)。

在 DSH UI 直接追踪 commit 进度、archive diff 和当前召回证据，减少跨应用诊断。详见[Q01](#research-q01)。

异步 API 包装、失败 envelope、缓存和本地路由 fence 值得参考；会话授权与热配置需补验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

当前召回不是历史注入记录；HTTP 防线是 loopback 而非用户身份授权；volatile 保存后的 host 重构需验证。详见[Q02](#research-q02)至[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

仅在可信单机试用；核服务、身份、会话与原生 API 一致性，配置保存后重查实际连接。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码支持只读展示；本机 curl 可访问未受 DSH 文档认证覆盖的路由，内容读取未绑会话；配置即时生效取决宿主重激活。目标系统未测。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/host/index.ts、src/host/trust-fence.ts、src/host/config.ts、src/host/commit-service.ts、src/host/recall-service.ts、src/host/openviking-api.ts、src/client/config-page.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读核固定提交 README.zh.md、src/host 与 src/client 的关键实现；不运行目标插件或外部服务。旧 META 仅复用。
- 下一步：在目标 DSH/OV 版本核配置保存/重载、跨会话内容读取、同机 curl、代理访问与历史注入对照。

**分析版本**

- **仓库**：[A2chitect/dsh-openviking-enhance](https://github.com/A2chitect/dsh-openviking-enhance)
- **版本号**：0.2.1（[固定提交 72a24cc](https://github.com/A2chitect/dsh-openviking-enhance/tree/72a24cc6755010df25b4cef39f3710290c911ec0)）
- **版本日期**：2026-10-18（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证改进是路由授权/会话绑定、历史注入痕迹与配置热重建。详见[Q05](#research-q05)。

在目标 DSH/OV 版本核配置保存/重载、跨会话内容读取、同机 curl、代理访问与历史注入对照。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 1488 | 1102 | 303 | — |
| .md | source | 4 | 634 | — | — | 6559 |
| .tsx | source | 6 | 1391 | 1015 | 291 | — |
| .ts | source | 14 | 3085 | 2026 | 856 | — |
| .mjs | test | 6 | 1312 | 1045 | 203 | — |

</details>

**活跃度**

Issue 活跃度数据暂未获取（查询日期：2026-10-21），可前往 [GitHub Issues](https://github.com/A2chitect/dsh-openviking-enhance/issues) 查看。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标：**OpenViking 记忆可见性在会话解释、配置生命周期和本地读权限上的真实边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 插件实际补充了 OpenViking 的什么可见性？

**研究主题：**场景与需求、贡献与相对优势

#### 完整回答

这是 DSH 内的只读观察层：侧栏嵌入 OpenViking Studio，按会话显示 commit 状态、历史 archive/diff 和召回结果。状态通过服务端 session 元数据与 history 构建，而不是监听记忆插件内部事件；缺失 @openviking/dsh-memory-plugin 时仍可打开 Studio，但会话 ID 与 peer 回退可能影响展示。作者称在 DSH 0.2.0-rc.2/OpenViking 0.4.22 验证，本文未重放。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:1-62](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/README.zh.md#L1-L62)

作者功能与兼容声明

<details>
<summary>查看原文（62行）</summary>

````text
# dsh-openviking-enhance

[English](README.md) | 中文

**v0.2.1** · [更新记录](CHANGELOG.md)

把本地 [OpenViking](https://docs.openviking.ai) 记忆服务接进 DeepSeek Harness
（DSH）的 Web 界面：左侧边栏多一个 OpenViking Studio 面板，输入框下方多一个
commit 状态胶囊，随时能看到每次提交对本会话记忆做了什么。

不需要给 DSH 或 OpenViking 插件打补丁——它就是一个普通的 DSH bundle。

## 功能

**在 DSH 里用 OpenViking Studio。** 左侧边栏最后一行点开，主区域直接加载
OpenViking 服务自带的 Studio 界面，浏览记忆、会话、检索都不用离开 DSH 或另开浏览器。

**每个会话的 commit 状态。** OpenViking 是按「提交（commit）」写入记忆的：会话的
对话轮次累积到 token 阈值（或会话结束）时归档一次，并抽取其中的记忆。输入框下方的
胶囊告诉你当前会话处在哪一步：

| 胶囊 | 含义 |
| --- | --- |
| `OV · 未提交` | 本会话还没有内容被提交 |
| `OV · 12.3k/20k` | 正在累积，接近提交阈值 |
| `OV · 抽取中…` | 正在归档并抽取记忆 |
| `OV · 3 次提交` | 已提交 3 次 |
| `OV · 抽取失败` | 归档了，但记忆抽取失败 |
| `OV · 不可用` | 连不上本地 OpenViking 服务 |

点开胶囊可以看到：

- **时间线**：最近 3 次提交分别发生在什么时候、各新增/更新/删除了多少条记忆
  （其余一次点击展开）；
- 点某一次提交，列出它**具体改了哪些记忆**，含 `viking://` 路径；
- **抽取失败**的时间、耗时，以及服务端给出的原因。

面板和胶囊都只读——本插件不会向 OpenViking 提交、写入或删除任何东西。

**这个会话检索到了什么。** 右侧边栏多一个「记忆召回」tab：显示当前会话会被
OpenViking 拉进上下文的记忆——检索用的那句话（默认是本会话最近一次提问，也可以自己输入）、
三个来源（记忆 / 资源 / 技能）里每条命中的分数（按高低从红到橙到绿分级）、文件名、
类型（`entity`、`event` 等）与摘要——完整 `viking://` 路径悬停可见，点开任意一条可看全文——
以及服务端给出的检索计划。从右侧边栏的 `+` 引导页打开，和该栏本身一样是按会话的。

![嵌在 DSH 界面里的 OpenViking Studio 面板](assets/studio-panel.png)

Studio 面板、打开它的侧边栏行，以及输入框下方的提交状态胶囊。

## 前置条件

| | |
| --- | --- |
| DSH | 0.2.0-rc.2 或更新（desktop / web profile 均可；已在 0.2.1-rc.2 实测） |
| OpenViking | 需要一个本地服务，实测 0.4.22。Studio 由同一端口的 `/studio/` 提供 |
| 记忆插件 | 建议装 `@openviking/dsh-memory-plugin`——会话提交由它完成。不装也能用，只是看不到提交阈值进度 |

## 安装

从 Plugins 页安装（Add plugin → 填包名或 tarball），或：

```bash
````

</details>

**依据 2 · 源码核查**：[src/host/commit-service.ts:1-16](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/commit-service.ts#L1-L16)

服务端数据与可选 memoryRuntime

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * Per-session commit state, assembled from OpenViking rather than from DSH.
 *
 * Why not read the state from `@openviking/dsh-memory-plugin`? It exposes
 * `openvikingMemory` (a plain `ctx.provide` value), but that object carries no
 * commit status, no history and no emitter, and the plugin drops the commit
 * response's `task_id`/`archive_uri` while logging only at `debug` — which the
 * desktop app filters out. Every fact below therefore comes from the server,
 * which also makes this half immune to plugin upgrades.
 *
 * Two seams into the plugin are still used, both optional:
 *   - `states.get(sessionId).ovSessionId` — the authoritative OpenViking
 *     session key (falls back to `dsh-<sessionId>`);
 *   - `states.get(sessionId).config.peerId` — the actor peer, required for
 *     peer-scoped (git-repo) workspaces, else the memory listing comes back
 *     empty.
```

</details>

**依据 3 · 源码核查**：[src/host/index.ts:200-237](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L200-L237)

服务创建与健康警告

<details>
<summary>查看原文（38行）</summary>

```text
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

  const configPayload = async (): Promise<ApiResult<EnhanceConfig>> => {
    const health = await api.health()
    const warnings: PluginNotice[] = []
    if (!health.ok) warnings.push({ code: 'unreachable', params: { endpoint: connection.endpoint, error: health.error ?? 'unknown' } })
    if (!memoryRuntime()) {
      warnings.push({ code: 'noMemoryPlugin' })
    }
    return {
      ok: true,
      endpoint: connection.endpoint,
      studioUrl: `${connection.endpoint}${studioPath}`,
      version: health.version,
      healthy: health.ok,
      account: connection.account,
      user: connection.user,
      warnings,
    }
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · commit 与 recall 怎样形成会话解释？

**研究主题：**功能与机制、工程质量与复用

#### 完整回答

CommitService 以 memoryRuntime 的 ovSessionId/peer 或 dsh-<sessionId> 回退，先读 session 再按服务返回 URI 查 history；archive 是持久依据，任务表仅辅助标注。RecallService 读取会话 messages.jsonl 最后用户 prompt 或显式 query，分别对 memory/skills/resources target_uri 发 session-aware 搜索，按桶去重最高分并截断；会话状态缓存与召回缓存分别由配置 TTL 驱动。汇总是当前重新检索的结果，不等同历史那一轮模型实际注入的上下文。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/commit-service.ts:90-125](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/commit-service.ts#L90-L125)

身份回退与 history

<details>
<summary>查看原文（36行）</summary>

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
  }

  async status(sessionId: string, options: { fresh?: boolean } = {}): Promise<CommitStatus> {
    const cached = this.cache.get(sessionId)
    if (!options.fresh && cached && Date.now() - cached.at < this.cacheTtlMs) return cached.value

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

**依据 2 · 源码核查**：[src/host/commit-service.ts:166-181](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/commit-service.ts#L166-L181)

archive 与 tasks

<details>
<summary>查看原文（16行）</summary>

```text
  /**
   * Commit records for a session: one per archive, oldest first.
   *
   * Archives are the durable record — task records are pruned by the server, so
   * they are only consulted to label a commit that is still being extracted.
   */
  async commits(
    sessionId: string,
    summaryLimit: number,
  ): Promise<{ status: CommitStatus; tasks: OvCommitTask[]; summaries: ArchiveSummary[] }> {
    const status = await this.status(sessionId)
    const tasks = await this.options.api.listCommitTasks(status.ovSessionId, {
      actorPeerId: this.actorPeer(sessionId),
    })
    const summaries = await this.summaries(sessionId, status.archives, summaryLimit)
    return { status, tasks: tasks.result ?? [], summaries }
```

</details>

**依据 3 · 源码核查**：[src/host/recall-service.ts:59-109](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/recall-service.ts#L59-L109)

query 来源与 cache

<details>
<summary>查看原文（51行）</summary>

```text
  /**
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
    return value
  }

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
    if (queryText.length === 0) {
```

</details>

**依据 4 · 源码核查**：[src/host/recall-service.ts:126-190](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/recall-service.ts#L126-L190)

分桶搜索与去重

<details>
<summary>查看原文（65行）</summary>

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
        continue
      }
      plan ??= reasoningOf(reply.result)
      for (const bucket of RECALL_BUCKETS) {
        const items = reply.result[bucket]
        if (!Array.isArray(items)) continue
        const into = merged.get(bucket)
        if (into === undefined) continue
        for (const item of items) {
          if (typeof item?.uri !== 'string' || item.uri.length === 0) continue
          total += 1
          // The same memory can be reached from two targets; keep the better
          // score rather than showing it twice.
          const existing = into.get(item.uri)
          if (existing === undefined || item.score > existing.score) into.set(item.uri, toRecallItem(item))
        }
      }
    }

    const buckets: RecallBucket[] = RECALL_BUCKETS.map((bucket) => ({
      bucket,
      items: [...(merged.get(bucket)?.values() ?? [])]
        .sort((left, right) => right.score - left.score)
        .slice(0, limit),
    }))

    return {
      sessionId,
      ovSessionId,
      sessionUri,
      peer,
      query: { text: queryText, source: querySource },
      buckets,
      plan,
      targets: targets.map((target) => target.uri),
      total,
      latencyMs: this.now() - started,
      searchedAt: new Date().toISOString(),
      warnings,
    }
```

</details>

#### 缺口

- 回放历史原始注入上下文未见
  **影响：**可能误把当前检索解释成历史执行事实
  **进一步探讨：**对照原记忆插件调用记录和 UI

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地 HTTP 防线与会话/内容边界是什么？

**研究主题：**缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

插件路由只允许GET，直接核到的代码会检查socket远端和Host为loopback、拒cross-site标记、比较可选Origin，无Origin请求可通过插件自己的这一层围栏。作者注释报告其所查宿主中主文档认证不覆盖插件路由，本轮没有独立核对相应宿主鉴权实现，不能推广为所有DSH版本或部署事实。

因此插件自身围栏是本机来源限制，不提供用户身份鉴别。只有同时通过宿主外层准入且OpenViking授权允许时，本机调用方才可取得diff/recall内容；是否已发生未授权读取未验证。/recall/content只检viking://前缀，没有绑定当前session或peer，实际可读范围还取决于OpenViking授权。部署前需明确本机进程信任、宿主外层准入与内容作用域，不能据插件注释推断实际公网开放。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:240-253](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L240-L253)

插件路由未受主认证 gate

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

**依据 2 · 源码核查**：[src/host/trust-fence.ts:1-39](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/trust-fence.ts#L1-L39)

防线与 curl 例外

<details>
<summary>查看原文（39行）</summary>

```text
/**
 * Trust fence for this plugin's HTTP routes.
 *
 * ## Why this exists
 *
 * The DSH web server's authentication gate covers the application document, not
 * plugin routes: `GET /` answers 401 without the launch token, while
 * `GET /api/openviking-enhance/config` answers 200 to a bare `curl`. That is fine
 * while the UI is only reachable on loopback — anything on the machine can read
 * `~/.openviking` directly anyway — but the whole point of these routes is that
 * they return memory metadata, and `/diff` returns memory *bodies*. The moment
 * this UI is bound to a non-loopback interface or reached through a tunnel or
 * reverse proxy, they become an unauthenticated read API over a personal memory
 * store.
 *
 * So every route requires the request to look like what it actually is: a
 * same-origin document on the loopback interface. There is no token to leak and
 * nothing to configure.
 *
 * ## What each check buys
 *
 * | Check | Blocks |
 * | --- | --- |
 * | socket remote address is loopback | any off-machine connection, including through a proxy on another host |
 * | `Host` header names loopback | a proxy or tunnel that reaches us over loopback but fronts a public name |
 * | `sec-fetch-site` is not `cross-site` | a page on another site issuing a cross-site request to a loopback port (DNS-rebinding class) |
 * | `Origin`, when present, equals `Host` | a same-site-but-different-port caller, and any cross-origin browser fetch |
 *
 * `X-Forwarded-For` is deliberately never consulted: this service is not behind a
 * trusted proxy, so a client-settable header must not be able to assert its own
 * trustworthiness. A reverse proxy that needs to reach these routes has to be
 * allowlisted explicitly, which is a deliberate code change rather than a config
 * toggle.
 *
 * Deliberately *not* enforced: the browser-presence marker some plugins add (a
 * custom header). It would block `curl` too, and a forged `Origin` slips past that
 * kind of tripwire regardless — while the socket/Host/origin checks above carry
 * the authority. Keeping plain `curl` working on loopback is worth more here: the
 * documented smoke harness depends on it.
```

</details>

**依据 3 · 源码核查**：[src/host/trust-fence.ts:81-100](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/trust-fence.ts#L81-L100)

实际条件

<details>
<summary>查看原文（20行）</summary>

```text
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

**依据 4 · 源码核查**：[src/host/index.ts:390-408](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L390-L408)

content 不绑定 session

<details>
<summary>查看原文（19行）</summary>

```text
      kind: 'exact',
      path: `${API_PREFIX}/recall/content`,
      handler: async (req, res) => {
        if (!guard(req, res)) return
        const uri = query(req).get('uri') ?? ''
        if (!uri) {
          writeJson(res, 400, { ok: false, error: 'uri is required' } satisfies ApiResult<never>)
          return
        }
        try {
          // The reader refuses anything that is not a `viking://` path, so this
          // route cannot be turned into a file read of the host.
          const content = await recall.content(uri)
          if ('error' in content) {
            writeJson(res, 200, { ok: false, error: content.error })
            return
          }
          writeJson(res, 200, { ok: true, content })
        } catch (error) {
```

</details>

**依据 5 · 源码核查**：[src/host/recall-service.ts:203-217](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/recall-service.ts#L203-L217)

只限制 scheme

<details>
<summary>查看原文（15行）</summary>

```text
  /** One entry's full text, for the panel's detail view. */
  async content(uri: string): Promise<RecallContent | { error: string }> {
    if (!uri.startsWith('viking://')) {
      return { error: 'not-a-viking-path' }
    }
    const read = await this.options.api.readText(uri, { timeoutMs: 10000 })
    if (!read.ok || read.result === null) {
      return { error: read.error ?? `HTTP ${read.status}` }
    }
    const text = read.result
    return {
      uri,
      text: text.slice(0, RECALL_CONTENT_MAX_CHARS),
      truncated: text.length > RECALL_CONTENT_MAX_CHARS,
    }
```

</details>

**依据 6 · 作者声明**：[src/host/trust-fence.ts:6-14](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/trust-fence.ts#L6-L14)

作者关于特定宿主鉴权范围的注释，不作为本轮独立核实的宿主事实。

```text
 * The DSH web server's authentication gate covers the application document, not
 * plugin routes: `GET /` answers 401 without the launch token, while
 * `GET /api/openviking-enhance/config` answers 200 to a bare `curl`. That is fine
 * while the UI is only reachable on loopback — anything on the machine can read
 * `~/.openviking` directly anyway — but the whole point of these routes is that
 * they return memory metadata, and `/diff` returns memory *bodies*. The moment
 * this UI is bound to a non-loopback interface or reached through a tunnel or
 * reverse proxy, they become an unauthenticated read API over a personal memory
 * store.
```

#### 缺口

- 本机多用户进程和 OV 授权配置未测
  **影响：**私有记忆可能被同机调用者读取
  **进一步探讨：**在目标环境核登录/同机权限模型

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 设置和密钥更改是否即时生效？

**研究主题：**缺陷与关键质疑、效果与总成本

#### 完整回答

七个字段标 volatile 并可在插件页修改，配置界面把 apiKey 显示为 password；但 host.start 只在激活时解析连接和 Studio URL，构造持有该连接的 API 客户端、状态/召回缓存和路由。源码没有设置订阅或重新构造路径。若宿主不重新激活插件，保存 volatile 值只改变引用，现有服务仍用旧 endpoint/key/TTL；其即时生效依赖 DSH 插件生命周期，需实测。apiKey 字段未标 secret 角色；前端只在 user override 存在时显示占位符，设置服务如何投影基础密钥未核。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:51-65](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L51-L65)

七个 volatile，apiKey 无 secret role

<details>
<summary>查看原文（15行）</summary>

```text
export const Config = z.object({
  /** Override the OpenViking base URL; default comes from `~/.openviking/ovcli.conf`. */
  endpoint: z.string().default('').volatile(),
  /** Override the API key (prefer the config file; this is for unusual setups). */
  apiKey: z.string().default('').volatile(),
  /** Override the identity the panel reads under. */
  account: z.string().default('').volatile(),
  user: z.string().default('').volatile(),
  /** Studio path appended to the endpoint when building the iframe URL. */
  studioPath: z.string().default('/studio/').volatile(),
  /** Status cache TTL in milliseconds. */
  cacheTtlMs: z.number().default(2500).volatile(),
  /** How long one retrieval answer is reused, in milliseconds. */
  recallCacheTtlMs: z.number().default(15000).volatile(),
})
```

</details>

**依据 2 · 源码核查**：[src/client/config-page.tsx:41-56](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/client/config-page.tsx#L41-L56)

UI password 字段

<details>
<summary>查看原文（16行）</summary>

```text
const FIELDS: readonly FieldSpec[] = [
  {
    key: 'endpoint',
    label: 'config.endpoint',
    hint: 'config.endpointHint',
    placeholder: 'http://127.0.0.1:1933',
  },
  { key: 'apiKey', label: 'config.apiKey', hint: 'config.apiKeyHint', secret: true },
  { key: 'account', label: 'config.account', hint: 'config.accountHint' },
  { key: 'user', label: 'config.user', hint: 'config.userHint' },
  { key: 'studioPath', label: 'config.studioPath', hint: 'config.studioPathHint', placeholder: '/studio/' },
  { key: 'cacheTtlMs', label: 'config.cacheTtl', hint: 'config.cacheTtlHint', numeric: true, placeholder: '2500' },
  { key: 'recallCacheTtlMs', label: 'config.recallCacheTtl', hint: 'config.recallCacheTtlHint', numeric: true, placeholder: '15000' },
]

const SECRET_PLACEHOLDER = '••••••••'
```

</details>

**依据 3 · 源码核查**：[src/client/config-page.tsx:87-95](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/client/config-page.tsx#L87-L95)

仅 override 时显示占位符

```text
  const state = form?.state
  const resolved = (state?.value ?? {}) as Record<string, unknown>
  const overrides = (state?.user ?? {}) as Record<string, unknown>
  const base = (state?.base ?? {}) as Record<string, unknown>
  const writable = state?.writable === true

  const valueOf = useCallback(
    (field: FieldSpec): string => draft[field.key] ?? (field.secret && field.key in overrides ? SECRET_PLACEHOLDER : asText(resolved[field.key])),
    [draft, overrides, resolved],
```

**依据 4 · 源码核查**：[src/host/index.ts:186-219](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L186-L219)

激活时解析与构造

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

- DSH volatile 更新是否重启插件未验证
  **影响：**可能保存后仍访问旧端点或密钥
  **进一步探讨：**目标宿主编辑配置后检查 /config 与抓包

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 适用场景与接入边界如何验证？

**研究主题：**采用判断、新假设与验证、效果与总成本

#### 完整回答

适合受信任单机上调试 OpenViking 会话记忆：先确认服务/账号/用户、memoryRuntime 挂载及 peer 作用域，再对照原生 OpenViking API 的 session/history/search 输出，最后验证 Studio、diff、召回详情。只读接口降低写入风险，却返回私有记忆全文；投产需确认宿主监听地址、同机信任边界和内容授权。未知安装/维护与隐私代价应在目标 DSH、OV 版本实测。可考虑在宿主层为路由增加身份授权并绑定 session，但这尚未实现。 假设推导：当前源码把 session/history/search 投影成只读 UI，但 /recall/content 只检 viking://，允许同机无 Origin 请求且不绑定 session；当前重检索也不等于历史注入事实。相对固定版，宿主身份校验加 session/peer 作用域绑定、并显示“当前重检索”标签和可审计的历史注入痕迹，可能在保留单机诊断便利时减少跨会话误读与私有记忆泄露。条件是 DSH 能向插件路由传可验证身份、OpenViking 能按 session/peer 授权且历史注入记录可取得；代价是授权映射/日志存储与更复杂的缓存失效。最小对照用两个账号、两个 peer、两个 session 的受控记忆，比较固定版/原型对本机无 Origin curl、跨 session URI、前端普通读取以及历史与当前召回差异的结果和延迟。若无身份请求仍读到内容、跨作用域未拒绝，或历史标签仍让人误判当轮注入，则假设被推翻；该方案未在固定版实现。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:35-110](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/README.zh.md#L35-L110)

作者安装与配置

<details>
<summary>查看原文（76行）</summary>

````text
- 点某一次提交，列出它**具体改了哪些记忆**，含 `viking://` 路径；
- **抽取失败**的时间、耗时，以及服务端给出的原因。

面板和胶囊都只读——本插件不会向 OpenViking 提交、写入或删除任何东西。

**这个会话检索到了什么。** 右侧边栏多一个「记忆召回」tab：显示当前会话会被
OpenViking 拉进上下文的记忆——检索用的那句话（默认是本会话最近一次提问，也可以自己输入）、
三个来源（记忆 / 资源 / 技能）里每条命中的分数（按高低从红到橙到绿分级）、文件名、
类型（`entity`、`event` 等）与摘要——完整 `viking://` 路径悬停可见，点开任意一条可看全文——
以及服务端给出的检索计划。从右侧边栏的 `+` 引导页打开，和该栏本身一样是按会话的。

![嵌在 DSH 界面里的 OpenViking Studio 面板](assets/studio-panel.png)

Studio 面板、打开它的侧边栏行，以及输入框下方的提交状态胶囊。

## 前置条件

| | |
| --- | --- |
| DSH | 0.2.0-rc.2 或更新（desktop / web profile 均可；已在 0.2.1-rc.2 实测） |
| OpenViking | 需要一个本地服务，实测 0.4.22。Studio 由同一端口的 `/studio/` 提供 |
| 记忆插件 | 建议装 `@openviking/dsh-memory-plugin`——会话提交由它完成。不装也能用，只是看不到提交阈值进度 |

## 安装

从 Plugins 页安装（Add plugin → 填包名或 tarball），或：

```bash
# 从 npm 装
dsh plugin --profile desktop add dsh-openviking-enhance

# 或从最新 release 装预构建 tarball
dsh plugin --profile desktop add https://github.com/A2chitect/dsh-openviking-enhance/releases/latest/download/dsh-openviking-enhance.tgz
```

直接用 Git 地址安装会被 pnpm 拒绝（这个包声明了构建脚本，pnpm 在得到允许前一律不放行），
所以源码目录要打成 tarball 再装——客户端半部分是**预构建产物**，源码安装等于装了个没东西可加载的壳：

```bash
pnpm pack && dsh plugin --profile desktop add ./dsh-openviking-enhance-<版本>.tgz
```

安装后**重启一次 DSH 应用**（宿主部分在启动时加载）。卸载：

```bash
dsh plugin --profile desktop remove dsh-openviking-enhance
```

## 配置

默认值适配标准本地环境，**开箱无需配置**。要改的话，打开侧边栏的 **Plugins** 页，找到本插件，
点它那一行的 **Configure**：表单包含下表的全部字段，地址旁边有 **检测** 按钮可以在保存前先试连，
每个字段还有 **默认** 按钮——它是清除覆盖、恢复继承，而不是写入一个空值。

同样的设置也仍然可以手写在 profile 的 patch 文件
（`~/.dsh/profiles/desktop/cordis.patch.yml`）里 `openviking-enhance` 这一行下面：

```yaml
- id: openviking-enhance
  name: 'dsh-openviking-enhance'
  config:
    endpoint: http://127.0.0.1:1933
```

| 字段 | 默认值 | 说明 |
| --- | --- | --- |
| `endpoint` | 读 `~/.openviking/ovcli.conf`，否则 `http://127.0.0.1:1933` | OpenViking 地址 |
| `apiKey` | 读 `ovcli.conf` | 仅在服务端开启鉴权时需要 |
| `account` / `user` | `default` / `default` | 读取记忆所用的身份 |
| `studioPath` | `/studio/` | Studio 在该地址下的路径 |
| `cacheTtlMs` | `2500` | 状态结果的缓存时长 |

## 常见问题

**侧边栏没有 OpenViking 行，或输入框下方没有胶囊。**
客户端部分是页面加载时取用的资源文件，重载窗口（⌘R）即可。仍然没有就重启应用。
````

</details>

**依据 2 · 源码核查**：[src/host/config.ts:77-124](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/config.ts#L77-L124)

连接解析与 key 不入日志

<details>
<summary>查看原文（48行）</summary>

```text
export function resolveConnection(
  overrides: ConnectionOverrides = {},
  env: NodeJS.ProcessEnv = process.env,
): OvConnection {
  const cli = readJsonFile(join(ovHome(), 'ovcli.conf'))
  const cliLocal = readJsonFile(join(ovHome(), 'ovcli.conf.local'))

  const endpoint = normalizeEndpoint(
    firstNonEmpty(
      overrides.endpoint,
      str(env.OPENVIKING_URL),
      str(env.OPENVIKING_BASE_URL),
      str(cli.url),
      DEFAULT_ENDPOINT,
    ),
  )
  const apiKey = firstNonEmpty(
    overrides.apiKey,
    str(env.OPENVIKING_BEARER_TOKEN),
    str(env.OPENVIKING_API_KEY),
    str(cli.api_key),
  )
  const account = firstNonEmpty(
    overrides.account,
    str(env.OPENVIKING_ACCOUNT),
    str(cliLocal.account),
    str(cli.account),
    DEFAULT_ACCOUNT,
  )
  const user = firstNonEmpty(
    overrides.user,
    str(env.OPENVIKING_USER),
    str(cliLocal.user),
    str(cli.user),
    DEFAULT_USER,
  )

  return { endpoint, apiKey, account, user }
}

/** Diagnostic view: everything except the key. */
export function describeConnection(connection: OvConnection): Record<string, string> {
  return {
    endpoint: connection.endpoint,
    account: connection.account,
    user: connection.user,
    auth: connection.apiKey ? 'bearer' : 'none',
  }
```

</details>

**依据 3 · 源码核查**：[src/host/openviking-api.ts:80-124](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/openviking-api.ts#L80-L124)

授权头与超时

<details>
<summary>查看原文（45行）</summary>

```text
  private headers(options: RequestOptions): Record<string, string> {
    const headers: Record<string, string> = { 'Content-Type': 'application/json' }
    if (this.connection.apiKey) headers.Authorization = `Bearer ${this.connection.apiKey}`
    if (this.connection.account) headers['X-OpenViking-Account'] = this.connection.account
    if (this.connection.user) headers['X-OpenViking-User'] = this.connection.user
    if (options.actorPeerId) headers['X-OpenViking-Actor-Peer'] = options.actorPeerId
    return headers
  }

  /** One request; resolves to a result envelope and never throws. */
  private async request<T>(
    path: string,
    options: RequestOptions = {},
    init: { method?: string; body?: unknown } = {},
  ): Promise<OvResult<T>> {
    const controller = new AbortController()
    const timer = setTimeout(() => controller.abort(), options.timeoutMs ?? DEFAULT_TIMEOUT_MS)
    try {
      const response = await fetch(`${this.connection.endpoint}${path}`, {
        method: init.method ?? 'GET',
        headers: this.headers(options),
        signal: controller.signal,
        ...(init.body === undefined ? {} : { body: JSON.stringify(init.body) }),
      })
      const body: unknown = await response.json().catch(() => null)
      if (!response.ok) {
        return {
          ok: false,
          status: response.status,
          result: null,
          error: extractError(body) ?? `HTTP ${response.status}`,
        }
      }
      return { ok: true, status: response.status, result: unwrap<T>(body), error: null }
    } catch (error) {
      return {
        ok: false,
        status: 0,
        result: null,
        error: error instanceof Error ? error.message : String(error),
      }
    } finally {
      clearTimeout(timer)
    }
  }
```

</details>

**依据 4 · 源码核查**：[src/host/index.ts:240-253](https://github.com/A2chitect/dsh-openviking-enhance/blob/72a24cc6755010df25b4cef39f3710290c911ec0/src/host/index.ts#L240-L253)

路由读取隐私内容

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

#### 缺口

- 目标延迟、兼容性和权限未测
  **影响：**不能直接视为多用户安全服务
  **进一步探讨：**单机隔离试用和权限矩阵

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
