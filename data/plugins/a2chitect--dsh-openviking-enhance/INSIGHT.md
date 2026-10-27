# dsh-openviking-enhance

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[20f5474](https://github.com/A2chitect/dsh-openviking-enhance/tree/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267)

<!-- BEGIN META -->
[![GitHub ★ 6](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=6&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/A2chitect/dsh-openviking-enhance) [![npm 30d 969](https://img.shields.io/static/v1?label=npm+30d&message=969&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance) [![最新发布 2026-10-18](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-18&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-openviking-enhance)
<!-- END META -->

> **功能**：把 OpenViking Studio、会话记忆提交状态与当前召回详情接入 DSH 界面。

> **亮点**：把分散的Studio、归档差异和检索查询组织到DSH同会话观察流程，增量在诊断集成而非检索算法。详见[Q01](#research-q01)。

> **主要限制**：当前重检索不能证明历史模型注入；loopback来源防线也不构成用户或会话授权，仅适合可信单机边界。详见[Q03](#research-q03)。

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
  - [Q01 · 谁需要内联观察记忆，相比直接使用 Studio/API 增加什么？](#detail-section-11)
  - [Q02 · 提交与召回信息如何产生，能否证明历史模型实际注入？](#detail-section-12)
  - [Q03 · 本地 HTTP 防线是否等同会话内容授权？](#detail-section-13)
  - [Q04 · 配置、缓存与失败恢复把什么负担交给用户？](#detail-section-14)
  - [Q05 · 哪些有试用和可证伪的新设计由上述机制推出？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已部署 DSH 与本地 OpenViking 的维护者可核对一次会话的记忆归档与当前召回。

直接在OpenViking Studio查看库并人工调用session/history/search，是本次明确基线；没有实测与原生最新版本全面能力对照。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| Studio面板 | 在DSH浏览OV服务界面 | 依赖服务Studio及浏览器加载条件 |
| 提交状态与diff | 观察会话归档和记忆改动 | 取服务状态，不写记忆 |
| 当前召回 | 搜索并查看命中正文 | 不是历史注入凭证；内容权限依OV身份 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH webServer与客户端slots | 必需 | API及观察界面 | 无法提供对应入口；作者版本声明需实核 |
| 本地OpenViking与有效身份 | 必需 | 会话、归档、检索 | 返回不可用或错误内容范围 |
| dsh-memory-plugin | 可选 | 会话ID/peer/阈值 | 回退命名；阈值未知 |
| 可信单机隔离 | 本次试用必需 | 限制私有记忆读取面 | 不适用于共享或转发场景 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 准备 | 用户核OV服务与读取身份 | 直接API健康且数据空间正确 |
| 加载 | 用户安装预构建包并重启DSH | Configure及观察入口出现；失败看日志或移除 |
| 核查 | 用户打开非敏感会话，核归档与search | URI、peer与直接API一致 |
| 退出 | 用户遇身份或连接不符停止判断 | 回到Studio/API；按作者卸载流程移除 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | DSH/OV服务、存储与包产物；金额未知 | 配置身份、安装并重启；耗时未知 | 需匹配服务及宿主版本 |
| 持续使用 | 状态轮询、search和缓存；消耗未知 | 核当前检索时间与身份；工时未知 | 未测诊断净收益 |
| 失败恢复 | 重新查询与日志资源；金额未知 | 核endpoint、重启或移除，回到Studio/API | 热连接生效及共享机器权限范围未知 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 提交观察 | 服务元数据、history与diff聚合 | 真实服务准确性、诊断节时 |
| 召回解释 | 当前query分目标search | 历史真正注入内容、回答质量 |
| 减少切换 | DSH内三个观察入口 | 相比Studio/API的总负担 |

> **思考**：当前重检索不能证明历史模型注入；loopback来源防线也不构成用户或会话授权，仅适合可信单机边界。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把分散的Studio、归档差异和检索查询组织到DSH同会话观察流程，增量在诊断集成而非检索算法。详见[Q01](#research-q01)。

配置引用解包和主/客户端失败隔离值得复用，移植需适配volatile语义、插槽卸载生命周期与服务协议。归档diff永久缓存依赖其不可变假设；可借鉴缺失diff延迟重探，但应独立核对状态授权与连接重建，见[Q04](#research-q04)。

<a id="detail-section-5"></a>

### 1.4 主要限制

当前重检索不能证明历史模型注入；loopback来源防线也不构成用户或会话授权，仅适合可信单机边界。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

在可信个人单机和非敏感会话受控试用，先把一份归档差异与直接API核对；身份或连接不符立即退回直接查询。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

会话观察与当前重检索机制有源码支持；诊断效率未实测，轮次历史快照属于未验证设计。

- 已检查：作者 README、包清单、源码路径 README.zh.md、src/host/index.ts、src/host/trust-fence.ts、src/host/config.ts、src/host/recall-service.ts、src/host/commit-service.ts、src/client/index.tsx 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：只读固定提交README、host关键链路与client入口；未执行安装、目标测试或宿主。真实授权与诊断效益保留未知。
- 下一步：将相同故障案例分给内联界面和直接API流程，记录定位正确率、人工时间；历史快照假设以提交后修改记忆的双视角对照检验，无法绑定轮次或没有误判改善则停止。

**分析版本**

- **仓库**：[A2chitect/dsh-openviking-enhance](https://github.com/A2chitect/dsh-openviking-enhance)
- **版本号**：0.2.2（[固定提交 20f5474](https://github.com/A2chitect/dsh-openviking-enhance/tree/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267)）
- **版本日期**：2026-10-27（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设是在注入边界保存轮次命中快照，与当前重检索并列解释；须以修改记忆后的前后对照证明差异，同时核对敏感数据保留代价。详见[Q05](#research-q05)。

将相同故障案例分给内联界面和直接API流程，记录定位正确率、人工时间；历史快照假设以提交后修改记忆的双视角对照检验，无法绑定轮次或没有误判改善则停止。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 7 | 2268 | 1702 | 452 | — |
| .md | source | 4 | 735 | — | — | 8216 |
| .tsx | source | 6 | 1755 | 1243 | 413 | — |
| .ts | source | 15 | 3361 | 2169 | 971 | — |
| .mjs | test | 7 | 1784 | 1414 | 271 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A2chitect/dsh-openviking-enhance/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/A2chitect/dsh-openviking-enhance/issues?q=is%3Aissue+created%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/A2chitect/dsh-openviking-enhance/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-27T01%3A50%3A27.819Z..2026-10-27T01%3A50%3A27.819Z)



统计日期：2026-10-27。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本的会话观察界面能否支持可信单机用户诊断记忆，其结果与历史真实注入有什么边界？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 谁需要内联观察记忆，相比直接使用 Studio/API 增加什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

目标用户是已部署 DSH 和本地 OpenViking、需要解释一次会话的记忆写入与召回结果的维护者。合格结果是能指出会话对应的归档、增删改条目和当前检索依据，而不是仅看到服务健康。作者提供 Studio 面板、输入框提交胶囊和会话侧栏召回页，源码把会话状态从服务端读取并结合可选记忆插件的会话ID与peer。相对另开 Studio 和手工调用多个 API，贡献是把分散的读取操作组织为同一会话的观察视角，属于诊断流程集成，不能归为新检索算法或更好的记忆质量。用户本来只偶尔浏览知识库时，直接 Studio 已能完成主要工作，不必承担宿主适配成本。

#### 证据与依据

**依据 1 · 作者声明**：[README.zh.md:7-44](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/README.zh.md#L7-L44)

作者说明三个观察入口及只读定位

<details>
<summary>查看原文（38行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/host/commit-service.ts:90-125](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/commit-service.ts#L90-L125)

会话与peer解析后从服务端取状态，支持会话观察增量

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

#### 缺口

- 没有相同故障任务下的诊断时间和误判率对照
  **影响**：只能确认减少跨入口组织动作，不能确认净节时
  **进一步探讨**：将相同记忆缺失案例分给面板与Studio/API两种流程，记录定位正确率和人工时间

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 提交与召回信息如何产生，能否证明历史模型实际注入？

**研究主题**：功能与机制、缺陷与关键质疑

#### 完整回答

提交链先从可选 runtime 取得 OpenViking 会话ID和peer，缺失时回退 dsh-会话ID，再读会话元数据和其 canonical URI 下的 history。归档数大于提交计数时，会进一步探查 memory_diff.json 避免一直显示抽取中；任务记录仅辅助标注，因为服务会清理任务。召回链与之不同，它从当前 messages.jsonl 找最近用户提问，或使用人工查询，分别搜索记忆、资源、技能目标并按URI去重、分数排序。返回值有 searchedAt，证明的是现在执行的一次检索，不是模型在历史轮次真正接收的上下文。归档后日志重置、库内容变化、人工查询或缓存均可使当前结果与当时注入不同。因此面板适合重检索诊断，不能充当历史审计凭证。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/commit-service.ts:113-148](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/commit-service.ts#L113-L148)

canonical history和diff探测支持提交解释

<details>
<summary>查看原文（36行）</summary>

```text
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

    const pendingTokens = meta.result?.pending_tokens ?? 0
    const commitCount = meta.result?.commit_count ?? 0
    const threshold = this.threshold(sessionId)
    const archives = (history.result ?? [])
      .filter((entry) => entry.isDir)
      .map<CommitArchive>((entry) => ({
        archiveId: entry.uri.split('/').pop() ?? entry.uri,
        archiveUri: entry.uri,
        modTime: entry.modTime ?? null,
      }))
      .sort((a, b) => a.archiveId.localeCompare(b.archiveId))

    let phase = derivePhase({ metaOk: meta.ok, commitCount, pendingTokens, archiveCount: archives.length })
    if (phase === 'extracting') {
      // The counter lags an archive in two different situations: extraction is
      // still running, or its task failed and the counter will never catch up
      // (the operations are written to the archive regardless). Ask the archive
      // itself: `memory_diff.json` appears exactly when extraction finished, so
      // this settles the ambiguity instead of leaving the pill spinning forever.
      const newest = archives[archives.length - 1]
      const probe = await this.options.api.readText(`${newest?.archiveUri}/memory_diff.json`, request)
      phase = probe.ok && probe.result !== null ? 'done' : 'extracting'
```

</details>

**依据 2 · 源码核查**：[src/host/recall-service.ts:84-141](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/recall-service.ts#L84-L141)

当前提问或人工query重新执行search

<details>
<summary>查看原文（58行）</summary>

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
    if (queryText.length === 0) {
      return {
        sessionId,
        ovSessionId,
        sessionUri,
        peer,
        query: { text: '', source: querySource },
        buckets: emptyBuckets(),
        plan: null,
        targets: targets.map((target) => target.uri),
        total: 0,
        latencyMs: this.now() - started,
        searchedAt: new Date().toISOString(),
        warnings,
      }
    }

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
```

</details>

**依据 3 · 源码核查**：[src/host/recall-service.ts:249-255](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/recall-service.ts#L249-L255)

注释明确日志归档后重置，限制历史解释

```text
/**
 * The last user turn in a session's `messages.jsonl`.
 *
 * The file is the memory plugin's capture of the conversation and is reset when
 * the session is archived, so it holds the turns since the last commit — exactly
 * the window a "what would be recalled now" question is about. Lines are JSON
 * objects with a `role` and `parts`; anything unparseable is skipped rather than
```

#### 缺口

- 缺少模型轮次绑定的真实注入快照
  **影响**：不能核验历史回答究竟用过哪些记忆
  **进一步探讨**：在记忆注入边界记录轮次ID、查询、命中URI和内容摘要，比较面板重检索与历史快照

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本地 HTTP 防线是否等同会话内容授权？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑

#### 完整回答

不能等同。host将所有读取路由置于GET及trust fence之后，拒绝非loopback socket、非loopback Host和跨站浏览器请求；Origin存在时必须与Host的authority相同。无Origin的本机进程仍可通过，这是一条网络和浏览器来源边界，并非用户身份鉴权。diff还要求URI中含当前会话history片段并拒绝双点，但URI由请求提供，sessionId也不由登录身份绑定；content方法仅检查viking协议然后读取全文，没有要求先属于该会话的检索命中。实际可读范围仍由OpenViking配置的account/user/key决定。只读仍可能披露私有记忆，因此可信个人单机可作为试用前提，多用户、转发或共享机器不能从loopback检查推出隔离安全。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/trust-fence.ts:81-99](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/trust-fence.ts#L81-L99)

无Origin本地请求允许，表明并非身份授权

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:255-268](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/index.ts#L255-L268)

路由统一GET与本地来源guard

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

**依据 3 · 源码核查**：[src/host/recall-service.ts:203-210](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/recall-service.ts#L203-L210)

content只校验URI协议，不绑定会话命中

```text
  /** One entry's full text, for the panel's detail view. */
  async content(uri: string): Promise<RecallContent | { error: string }> {
    if (!uri.startsWith('viking://')) {
      return { error: 'not-a-viking-path' }
    }
    const read = await this.options.api.readText(uri, { timeoutMs: 10000 })
    if (!read.ok || read.result === null) {
      return { error: read.error ?? `HTTP ${read.status}` }
```

**依据 4 · 源码核查**：[src/host/commit-service.ts:226-234](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/commit-service.ts#L226-L234)

diff的路径限制并非会话权限主体

```text
/**
 * Guard for the `archive` parameter of the diff route: the browser half may only
 * ask for a diff under this session's own history tree. Anything else is refused,
 * so the route cannot be turned into a generic `viking://` file reader.
 */
export function isArchiveUriForSession(uri: string, ovSessionId: string): boolean {
  if (!uri.startsWith('viking://')) return false
  const marker = `/sessions/${ovSessionId}/history/archive_`
  return uri.includes(marker) && !uri.includes('..')
```

#### 缺口

- 同机不同用户和不同会话的服务端授权结果未知
  **影响**：共享环境可能读取超出预期的内容，限制采用范围
  **进一步探讨**：使用无敏感数据的两身份隔离样例检查服务权限与路由可读边界

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 配置、缓存与失败恢复把什么负担交给用户？

**研究主题**：效果与总成本、工程质量与复用

#### 完整回答

配置解析有清楚的优先级，显式值、环境和CLI文件依次回退，日志省略密钥；volatile引用经configField.get读取，避免将引用当字符串。host在start时构造connection、API及两个service，后续路由闭包复用它们，本次没有看到连接修改时重构服务的订阅，因此连接字段保存不能仅凭volatile声明认定即时换连接。客户端三个显示开关则有独立挂载/卸载设计，Configure始终保留。状态TTL、召回TTL和缺失diff重探减少轮询压力，但成功diff假设永久不变，调用方需要区分缓存与服务现状。启动异常被记录并停止提供插件能力，保护宿主启动同时要求用户看日志识别无界面原因。首次需要服务、包产物与重启；持续需维护身份配置、解释检索时间；失败需核实际endpoint、重启或移除并回到Studio/API。现金、人工耗时和故障频率均无测量，不能以只读推断零成本。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/index.ts:108-125](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/index.ts#L108-L125)

读取volatile引用的适配

<details>
<summary>查看原文（18行）</summary>

```text
/** The value behind a field, whether it is a reference or the value itself. */
export function configField<T>(value: ConfigField<T> | undefined): T | undefined {
  if (value === null || value === undefined) return undefined
  if (typeof value === 'object' && typeof (value as { get?: unknown }).get === 'function') {
    return (value as { get(): T }).get()
  }
  return value as T
}

/** A string field, or `''` for anything that is not one. */
function configText(value: ConfigField<string> | undefined): string {
  const plain = configField(value)
  return typeof plain === 'string' ? plain : ''
}

/** A numeric field, or the fallback. */
function configNumber(value: ConfigField<number> | undefined, fallback: number): number {
  const plain = configField(value)
```

</details>

**依据 2 · 源码核查**：[src/host/index.ts:191-234](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/index.ts#L191-L234)

启动异常边界与服务构造时点

<details>
<summary>查看原文（44行）</summary>

```text
export function apply(ctx: Context, config: EnhanceConfigInput = {}): void {
  try {
    start(ctx, config)
  } catch (error) {
    const logger = (ctx as unknown as { logger?: { error?: (line: string) => void } }).logger
    const detail = error instanceof Error ? (error.stack ?? error.message) : String(error)
    logger?.error?.(`[openviking-enhance] failed to activate, so the plugin provides nothing: ${detail}`)
  }
}

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

**依据 3 · 源码核查**：[src/host/config.ts:77-114](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/config.ts#L77-L114)

连接配置优先级

<details>
<summary>查看原文（38行）</summary>

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
```

</details>

**依据 4 · 源码核查**：[src/host/commit-service.ts:67-87](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/commit-service.ts#L67-L87)

缓存的生命周期与缺失diff重探

<details>
<summary>查看原文（21行）</summary>

```text
export class CommitService {
  private readonly cache = new Map<string, { at: number; value: CommitStatus }>()
  /**
   * `memory_diff.json` is immutable once written, so a read result is cached for
   * the process lifetime. `diffRetryAt` is the other half: an archive whose diff
   * does not exist yet (extraction still running, or failed) must be re-probed
   * later, just not on every five-second poll.
   */
  private readonly diffCache = new Map<string, MemoryDiff>()
  private readonly diffRetryAt = new Map<string, number>()
  private readonly options: CommitServiceOptions
  private readonly cacheTtlMs: number
  private readonly missingDiffRetryMs: number

  // Plain field assignment rather than a constructor parameter property: the
  // latter is TypeScript-only syntax that Node's type stripping cannot erase,
  // which would make this module unimportable from the unit tests.
  constructor(options: CommitServiceOptions) {
    this.options = options
    this.cacheTtlMs = options.cacheTtlMs ?? 2500
    this.missingDiffRetryMs = options.missingDiffRetryMs ?? MISSING_DIFF_RETRY_MS
```

</details>

**依据 5 · 源码核查**：[src/client/index.tsx:25-38](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/client/index.tsx#L25-L38)

显示开关挂载/卸载与始终保留配置入口

<details>
<summary>查看原文（14行）</summary>

```text
 * The three surfaces are switchable from the plugin's own settings form
 * (`showSidebarEntry` / `showCommitStatus` / `showRecallPanel`). `feature-toggles.ts`
 * reads the live values from `ctx.configForms`; this file owns the mount/unmount
 * pairs and the order they run in:
 *
 *  - mount: main panel before the sidebar row that opens it, because a row whose
 *    `main` key is not registered throws when selected;
 *  - unmount: the row before the main panel (the layout notices the key vanish
 *    and returns to the conversation by itself); the recall tab drops its body
 *    and then its type, while the switch additionally closes an open recall page
 *    (immediately when a surface is mounted, otherwise on its return);
 *  - `plugins.row.config` is registered unconditionally: the Configure form is
 *    the only way back after a surface has been hidden, so it must never be
 *    behind a switch itself.
```

</details>

#### 缺口

- 连接字段保存后的实际生效时点未获宿主证据
  **影响**：可能继续读取旧endpoint或身份，增加诊断误差
  **进一步探讨**：以两个可区分的本地测试服务保存endpoint并回读config，明确何时需重启

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 哪些有条件试用和可证伪的新设计由上述机制推出？

**研究主题**：新假设与验证、采用判断

#### 完整回答

可信单机维护者可以在非敏感会话试用归档差异和当前召回观察，先将面板显示的会话ID、peer及一份diff与直接API逐项核对。它相对人工多入口查询提供有条件的诊断便利，但应将当前检索明确当作当前状态。出现会话/身份不符、配置后仍连旧服务或无法解释条目来源时，停止用面板作决策并回到Studio/API核对。由时间语义缺口可推导未验证设计：在真正注入时保存轮次绑定的不可变命中清单和内容摘要，界面并列展示历史快照与当前重检索差异。这会增加存储和敏感信息生命周期负担，需要沿用服务权限并提供保留策略。最小验证是在固定库上执行一轮后修改一条记忆，再比较两视角是否准确区分；若历史快照缺条目、无法与轮次绑定或对原本就只关心当前检索的用户没有改善，则否定其作为默认功能的必要性。

#### 证据与依据

**依据 1 · 源码核查**：[src/host/recall-service.ts:177-189](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/recall-service.ts#L177-L189)

searchedAt与当前返回结构是历史/当前分离的推导起点

<details>
<summary>查看原文（13行）</summary>

```text
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
```

</details>

**依据 2 · 源码核查**：[src/host/trust-fence.ts:81-99](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/src/host/trust-fence.ts#L81-L99)

可信单机条件的依据

<details>
<summary>查看原文（19行）</summary>

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
```

</details>

**依据 3 · 作者声明**：[README.zh.md:77-81](https://github.com/A2chitect/dsh-openviking-enhance/blob/20f547490c9a4c0c2cf7d6bb24f4bc2bfe50e267/README.zh.md#L77-L81)

可退出到移除插件

````text
安装后**重启一次 DSH 应用**（宿主部分在启动时加载）。卸载：

```bash
dsh plugin --profile desktop remove dsh-openviking-enhance
```
````

#### 缺口

- 历史快照设计尚未实现，用户是否需要该审计流程也未知
  **影响**：只能作为研究假设，不能计入现有贡献和创新分
  **进一步探讨**：先以真实记忆误判案例检验是否需要历史/当前对照，再评估存储与权限代价

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
