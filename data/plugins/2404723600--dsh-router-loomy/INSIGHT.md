# dsh-router-loomy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[ccabca3](https://github.com/2404723600/dsh-router-loomy/tree/ccabca348ca2194287f0770ce348283fdb8bf3d8)

<!-- BEGIN META -->

<!-- END META -->

> **实现功能**：将 Loomy 云端 Chat Completions 通道接入 dsh-router，自动读本机客户端登录态。

> **核心亮点**：将客户端会话/追踪头和流式截断判据封装成 router 供应商。详见[Q02](#research-q02)。

> **风险与缺陷**：截断触发整段重试会消耗积分，且状态昵称原样带 phone，README 脱敏示例与代码不一致。详见[Q03](#research-q03)、[Q04](#research-q04)。

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
  - [Q01 · Loomy 供应商解决何种路由接入，达成条件是什么？](#detail-section-11)
  - [Q02 · 本机登录态、模型与上游请求如何接合？](#detail-section-12)
  - [Q03 · 流尾守卫与重试如何处理截断和成本？](#detail-section-13)
  - [Q04 · 状态页与账户展示有什么边界？](#detail-section-14)
  - [Q05 · 应如何做小范围采用试验？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已使用 dsh-router 的用户希望调用 Loomy 模型；需要有效客户端会话和上游可用。

手工管理 session 并直接调用兼容 API；本包增加 router 账号和流尾处理。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

**能力**

| 能力 | 用途 | 边界 |
| --- | --- | --- |
| session | Bearer 上游 | 文件/缓存 |
| stream | SSE 透传/守卫 | 重试积分 |
| client page | 状态/启动/手填 | 外层鉴权 |

**流程与依赖**

| 条件 | 用途 | 失败时 |
| --- | --- | --- |
| dsh-router/cordis | 装配和轮转 | 无供应商 |
| Loomy 客户端文件 | 自动会话 | 手填或不可用 |
| 上游 Chat API | 模型/对话 | 错误或积分损失 |

| 步骤 | 动作 | 判据 |
| --- | --- | --- |
| 装配 | 固定包与核心 | suppliers 注册 |
| 模拟 | 错误/流尾矩阵 | 无误判重试 |
| 试用 | 授权账户计费对账 | 可控积分 |

**效果与成本**

| 阶段 | 投入 | 未知 |
| --- | --- | --- |
| 安装 | 宿主 bundle/客户端登录 | 核心契约版本 |
| 使用 | 上游积分和重试 | 误判率 |
| 治理 | 会话、手机号、页面权限 | 外层鉴权 |

| 结果 | 源码支持 | 未证实 |
| --- | --- | --- |
| 自动账号 | 读客户端文件 | 真实文件格式 |
| 流式完整性 | DONE 守卫 | 上游异常分布 |
| 积分 | 显示最近使用量 | 独立计费对账 |

> **思考**：截断触发整段重试会消耗积分，且状态昵称原样带 phone，README 脱敏示例与代码不一致。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：将客户端会话/追踪头和流式截断判据封装成 router 供应商。详见[Q02](#research-q02)。

将客户端会话/追踪头和流式截断判据封装成 router 供应商。详见[Q02](#research-q02)。

文件缓存读错时回退旧 session；缺尾判截断诱导核心重试，进程内次数限制；状态页 token 仅防 CSRF，号码未代码脱敏。

<a id="detail-section-5"></a>

### 1.4 主要限制

截断触发整段重试会消耗积分，且状态昵称原样带 phone，README 脱敏示例与代码不一致。详见[Q03](#research-q03)、[Q04](#research-q04)。

<a id="detail-section-6"></a>

### 1.5 使用建议

隔离 profile/模拟上游完成协议和脱敏验证，再以授权账户小流量试用。详见[Q05](#research-q05)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

源码可确认注册与请求流程；上游兼容性和积分成本仍属作者记录，状态昵称存在未脱敏 phone 风险。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、src/index.ts、src/accounts.ts、src/provider.ts、src/client-page.ts、src/api/sse.ts 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：审阅固定提交的 README、package、核心 TypeScript；未运行 Loomy、dsh-router 或目标测试。
- 下一步：模拟登录文件和上游响应；记录正常/截断/封顶的 retry、积分与状态页敏感字段。

**分析版本**

- **仓库**：[2404723600/dsh-router-loomy](https://github.com/2404723600/dsh-router-loomy)
- **版本号**：0.2.0（[固定提交 ccabca3](https://github.com/2404723600/dsh-router-loomy/tree/ccabca348ca2194287f0770ce348283fdb8bf3d8)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

持久重试预算和敏感字段统一脱敏可降低积分与展示风险；尚未实现。详见[Q05](#research-q05)。

模拟登录文件和上游响应；记录正常/截断/封顶的 retry、积分与状态页敏感字段。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 2 | 321 | — | — | 3040 |
| .mjs | source | 1 | 109 | 87 | 14 | — |
| .ts | source | 16 | 3185 | 2180 | 779 | — |
| .ts | test | 6 | 771 | 618 | 85 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2404723600/dsh-router-loomy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=grey&logo=github&style=flat)](https://github.com/2404723600/dsh-router-loomy/issues?q=is%3Aissue+created%3A2026-09-22T05%3A56%3A33.145Z..2026-10-22T05%3A56%3A33.145Z) [![近30天关闭 0](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/2404723600/dsh-router-loomy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T05%3A56%3A33.145Z..2026-10-22T05%3A56%3A33.145Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：审查 Loomy 供应商的登录态、流式完整性、成本及状态页边界。

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · Loomy 供应商解决何种路由接入，达成条件是什么？

**研究主题**：场景与需求

#### 完整回答

插件把 Loomy 客户端会话用作 Bearer 令牌，将 Chat Completions 通道挂到 dsh-router 的 suppliers 聚合表；本机登录文件或面板手填 session 形成账号，核心承担选号/冷却。成功需宿主核心契约匹配、客户端有效登录态、上游协议/账户可用，不能把 README 的完全兼容和实测记录当本轮独立验证。相对于手工调用上游 API，其增量是路由器内的账号、模型和流式错误适配。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:7-15](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/README.md#L7-L15)

作者描述定位。

```text
把 **Loomy（讯飞 Loomy 办公助手云端通道）** 作为供应商接入 [dsh-router](https://www.npmjs.com/package/dsh-router-core)，
供 dsh 使用的插件。参照 `dsh-router-traework` 的同构范式编写。

- 上游通道对 OpenAI **Chat Completions 完全兼容**（单一端点 `POST {baseUrl}/chat/completions`，SSE 流式）；
- 鉴权为 `Authorization: Bearer <session>`，session **自动取自本机 Loomy 客户端**登录后落盘的
  `userData/auth-session.json`，无需手动粘贴；
- 插件只暴露差异化逻辑（`status` / `listModels` / `chatOnce` / `dispose` /
  `generateLoginUrl` / `pollLogin` / `completeLogin` / `removeLink`），
  选号、冷却、换号、别名、模型启用状态、积分缓存等通用能力全部由 dsh-router 核心统一管理。
```

**依据 2 · 源码核查**：[src/index.ts:65-79](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/index.ts#L65-L79)

注册 suppliers 工厂。

<details>
<summary>查看原文（15行）</summary>

```text
export function apply(ctx: ContextLike): void {
  // 等核心把聚合表 provide 出来后再追加（顺序无关：inject 延迟到服务可用才触发）。
  ctx.inject(['router.suppliers'], (sctx) => {
    const c = sctx as ContextLike & { router?: { suppliers?: RouterSuppliersService } }
    const suppliers = (c.get?.('router.suppliers') ?? c.router?.suppliers) as RouterSuppliersService | undefined
    if (!suppliers) return undefined
    if (!suppliers.loomy) {
      suppliers.loomy = factory
      ctx.emit('internal/service', 'router.suppliers', suppliers)
      log(ctx, '[dsh-router-loomy] registered router.suppliers: loomy')
    }
    return () => {
      delete suppliers.loomy
    }
  })
```

</details>

**依据 3 · 源码核查**：[src/provider.ts:355-396](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L355-L396)

单账号调用。

<details>
<summary>查看原文（42行）</summary>

```text
  async chatOnce(uid: string, lv: string, req: ChatRequest): Promise<ChatOnceResult> {
    const accountUid = uid === '' ? '' : uid
    const modelId = this.resolveModelId(req.model)
    if (modelId === undefined) {
      // 不是本供应商的模型：交给下一个供应商（绝不能记在账号头上）
      return { ok: false, state: 'no_such_model', message: `unknown model ${JSON.stringify(req.model)}` }
    }
    if (this.store().disabled.includes(modelId)) {
      return { ok: false, state: 'no_such_model', message: `model ${JSON.stringify(modelId)} is disabled` }
    }

    const resolved = this.registry.resolve(accountUid)
    if (resolved === undefined) {
      const message =
        accountUid === '' || accountUid === AUTO_UID
          ? `未找到 Loomy 登录态（期望 ${this.cfg.publicDir}\\<安装ID>\\userData\\${AUTH_SESSION_FILE}）—— 在面板点「添加链接」打开客户端登录，或访问客户端页手动填入会话串`
          : `unknown account ${JSON.stringify(accountUid)}`
      const state: AccountState = accountUid === '' || accountUid === AUTO_UID ? 'session_dead' : 'no_such_model'
      this.setHealth(accountUid, state, message)
      return { ok: false, state, message }
    }

    const bodyObj = this.prepareBody(req, modelId, lv)
    const body = JSON.stringify(bodyObj)
    const maxTokens = typeof bodyObj.max_tokens === 'number' ? bodyObj.max_tokens : undefined
    const headers = this.buildHeaders(resolved.session)
    const url = `${this.cfg.baseUrl.replace(/\/+$/, '')}/chat/completions`

    let response: Response
    try {
      response = await sendRequest({
        url,
        method: 'POST',
        headers,
        body,
        headerTimeoutMs: this.cfg.timeoutMs,
      })
      await assertResponseOk(response)
    } catch (err) {
      const { state, message } = toStateAndMessage(err)
      this.setHealth(resolved.uid, state, message)
      return { ok: false, state, message }
```

</details>

#### 缺口

- 未接目标宿主或上游。
  **影响**：真实可用性与兼容范围未知。
  **进一步探讨**：隔离环境用模拟上游及受控账户验证。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 本机登录态、模型与上游请求如何接合？

**研究主题**：功能与机制、贡献与相对优势

#### 完整回答

AccountRegistry 扫公共目录按 auth-session.json mtime 选文件，读 session 并缓存；另有宿主凭证库 Key 账号。provider 从核心模型名解析上游 id，附 Bearer 及追踪头，填缺省 max_tokens，按流式或非流式处理响应。/models 探测有 TTL，状态余额固定 -1 代表未知。文件 JSON 读取异常时回退上次成功缓存，故轮换/损坏期间可继续用旧 token，直到上游否决。

#### 证据与依据

**依据 1 · 源码核查**：[src/accounts.ts:58-112](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/accounts.ts#L58-L112)

文件定位、TTL 和故障回退。

<details>
<summary>查看原文（55行）</summary>

```text
  /** 本机登录态文件路径（找不到返回 undefined）。 */
  locateSessionFile(): string | undefined {
    if (this.userDataDir !== undefined) {
      const candidate = join(this.userDataDir, AUTH_SESSION_FILE)
      try {
        if (statSync(candidate).isFile()) return candidate
      } catch {
        this.userDataDir = undefined
      }
    }
    let entries: string[]
    try {
      entries = readdirSync(this.opts.publicDir)
    } catch {
      return undefined
    }
    const found: Array<{ dir: string; path: string; time: number }> = []
    for (const entry of entries) {
      const dir = join(this.opts.publicDir, entry, 'userData')
      const path = join(dir, AUTH_SESSION_FILE)
      try {
        const st = statSync(path)
        if (!st.isFile()) continue
        found.push({ dir, path, time: st.mtimeMs })
      } catch {
        // 该安装目录没有登录态文件
      }
    }
    found.sort((a, b) => b.time - a.time)
    const best = found[0]
    if (best === undefined) return undefined
    this.userDataDir = best.dir
    return best.path
  }

  /** 读取本机登录态（带 TTL 缓存；文件读坏时返回上一次成功值）。 */
  readSessionFile(force = false): { path: string; data: LoomySessionFile } | undefined {
    const now = Date.now()
    if (!force && this.fileCache !== undefined && now - this.fileCache.at <= this.opts.sessionTtlMs) {
      return { path: this.fileCache.path, data: this.fileCache.data }
    }
    const path = this.locateSessionFile()
    if (path === undefined) return undefined
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf-8')) as LoomySessionFile
      if (typeof parsed.session !== 'string' || parsed.session.trim() === '') {
        this.opts.log(`loomy: 登录态文件缺少 session 字段：${path}`)
        return undefined
      }
      this.fileCache = { path, data: parsed, at: now }
      return { path, data: parsed }
    } catch (err) {
      this.opts.log(`loomy: 登录态文件读取失败（${path}）：${(err as Error).message}`)
      return this.fileCache === undefined ? undefined : { path: this.fileCache.path, data: this.fileCache.data }
    }
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:121-165](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/accounts.ts#L121-L165)

多账号来源。

<details>
<summary>查看原文（45行）</summary>

```text
  /** 面板添加的 Key 账号（按 uid 排序，保证面板顺序稳定）。 */
  keyEntries(): Array<{ uid: string; blob: LoomyKeyAccount }> {
    const out: Array<{ uid: string; blob: LoomyKeyAccount }> = []
    for (const uid of this.opts.credentials.list(this.opts.supplierId)) {
      if (!uid.startsWith(KEY_UID_PREFIX)) continue
      const blob = this.opts.credentials.get<LoomyKeyAccount>(this.opts.supplierId, uid)
      if (blob === undefined || typeof blob.apiKey !== 'string' || blob.apiKey.trim() === '') continue
      out.push({ uid, blob })
    }
    out.sort((a, b) => a.uid.localeCompare(b.uid, undefined, { numeric: true }))
    return out
  }

  /** 账号列表：本机登录态在前，其后是面板 Key。 */
  list(): AccountEntry[] {
    const out: AccountEntry[] = []
    const file = this.readSessionFile()
    if (file !== undefined) {
      out.push({ uid: AUTO_UID, nickname: this.localNickname(file.data), source: 'file', file: file.path })
    }
    for (const { uid, blob } of this.keyEntries()) {
      out.push({ uid, nickname: blob.name !== '' ? blob.name : `Loomy Key ${uid.slice(KEY_UID_PREFIX.length)}`, source: 'key' })
    }
    return out
  }

  /** 解析某个 uid 对应的会话串。 */
  resolve(uid: string): ResolvedSession | undefined {
    if (uid === '' || uid === AUTO_UID) {
      const file = this.readSessionFile()
      if (file === undefined) return undefined
      return {
        session: file.data.session.trim(),
        uid: AUTO_UID,
        nickname: this.localNickname(file.data),
        source: 'file',
        file: file.path,
      }
    }
    const blob = this.opts.credentials.get<LoomyKeyAccount>(this.opts.supplierId, uid)
    if (blob === undefined || typeof blob.apiKey !== 'string' || blob.apiKey.trim() === '') return undefined
    return {
      session: blob.apiKey.trim(),
      uid,
      nickname: blob.name !== '' ? blob.name : `Loomy Key ${uid.slice(KEY_UID_PREFIX.length)}`,
```

</details>

**依据 3 · 源码核查**：[src/provider.ts:199-231](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L199-L231)

状态/未知积分。

<details>
<summary>查看原文（33行）</summary>

```text
  status(): SupplierStatusNow {
    this.touchProbe()
    const accounts = this.registry.list().map((entry) => {
      const h = this.health.get(entry.uid)
      const resolved = this.registry.resolve(entry.uid)
      const bits: string[] = []
      if (resolved !== undefined) {
        bits.push(`会话 ${maskSession(resolved.session)}`)
        if (entry.source === 'file' && entry.file !== undefined) bits.push(entry.file)
        else bits.push('面板添加')
      } else {
        bits.push('会话缺失')
      }
      if (entry.uid === '' || entry.source === 'file') {
        // 本机登录态账号：把「客户端在不在跑」一并报出来 —— 这是用户最关心的
        // 「是否已加载」信号（登录态文件在、但客户端没开 = 会话可能已过期）。
        const running = this.client.runningNow()
        bits.push(running === true ? '客户端运行中' : running === false ? '客户端未运行' : '客户端状态未知')
        if (this.lastUsage !== undefined) {
          bits.push(`最近一次调用消耗 ${this.lastUsage.points} 积分（${this.lastUsage.model}）`)
        }
      }
      return {
        uid: entry.uid,
        nickname: entry.nickname,
        // Loomy 无公开的积分查询端点：**报 -1（未知）**，不能报 0——
        // 0 是真值「用完了」，核心会把它当成一次有效读数写进缓存。
        credits: -1,
        state: h?.state ?? ('ok' as AccountState),
        message: h?.message !== undefined ? `${h.message}（${bits.join(' · ')}）` : bits.join(' · '),
      }
    })
    return { id: this.id, name: this.name, accounts }
```

</details>

**依据 4 · 源码核查**：[src/provider.ts:484-541](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L484-L541)

请求体与认证头。

<details>
<summary>查看原文（58行）</summary>

```text
  /**
   * 请求体改写：只动插件必须动的字段，其余原样透传（含 messages / tools / 采样参数）。
   *
   *   - `model` 换成本供应商解析出的上游 id
   *   - `max_tokens` 缺省时补默认值（客户端实测为 32000）
   *   - 非流式路径强制 `stream:false` 并去掉 `stream_options`（否则拿不到单体 JSON）
   *   - `lv` 有具体档位且模型声明支持时写入 `reasoning_effort`
   *
   * 返回**对象**而不是字符串：调用方要用 `max_tokens` 去区分「上游截断」与
   * 「撞上上限」（见 guardUpstreamStream）。
   */
  private prepareBody(req: ChatRequest, modelId: string, lv: string): Record<string, unknown> {
    let obj: Record<string, unknown>
    try {
      const parsed: unknown = JSON.parse(req.rawBody)
      obj = parsed !== null && typeof parsed === 'object' ? (parsed as Record<string, unknown>) : {}
    } catch {
      obj = {}
    }
    obj.model = modelId
    if (typeof obj.max_tokens !== 'number') obj.max_tokens = this.cfg.defaultMaxTokens
    if (req.stream) {
      obj.stream = true
      if (typeof obj.stream_options !== 'object' || obj.stream_options === null) {
        obj.stream_options = { include_usage: true }
      }
    } else {
      obj.stream = false
      delete obj.stream_options
    }
    const catalog = this.catalog.snapshot()
    const info = catalog?.models.find((m) => m.id === modelId)
    const lvNormalized = lv.trim().toLowerCase()
    if (lvNormalized !== '' && lvNormalized !== 'auto' && lvNormalized !== 'off' && lvNormalized !== 'none') {
      if (info?.reasoning_efforts?.includes(lvNormalized) === true) obj.reasoning_effort = lvNormalized
      // 模型未声明 reasoning_efforts 时不硬塞：上游对未知参数可能直接 400
    } else {
      delete obj.reasoning_effort
    }
    return obj
  }

  /**
   * 构造请求头：鉴权 + 四个必带追踪头。
   * `traceparent` 缺失会让上游连接挂死（实测结论），故每次请求都新生成。
   */
  private buildHeaders(session: string): Record<string, string> {
    return {
      authorization: `Bearer ${session}`,
      'content-type': 'application/json',
      accept: 'text/event-stream, application/json, */*',
      'user-agent': USER_AGENT,
      ...buildTracingHeaders({
        version: this.cfg.loomyVersion,
        invokeOrigin: this.cfg.invokeOrigin,
        sessionAffinity: this.cfg.sessionAffinity,
      }),
    }
```

</details>

#### 缺口

- 未验证上游必要追踪头与模型目录。
  **影响**：参数兼容只是作者实测与源码实现。
  **进一步探讨**：模拟上游覆盖不同协议返回。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 流尾守卫与重试如何处理截断和成本？

**研究主题**：缺陷与关键质疑、工程质量与复用、效果与总成本

#### 完整回答

流式分支用 guardUpstreamStream 统计 finish_reason、正文、推理与 usage。缺 finish_reason 且未撞 max_tokens 判截断，扣住 [DONE] 诱导核心按 TRANSPORT 重试；同一账号模型连续达到上限后改补 length，避免持续重发整个上下文。对上游中途错误另上报 late failure。该判据依赖作者对上游尾帧和核心重试语义的记录；误判可导致重复积分、重复工具动作或错误结束，且计数只是进程内 Map，重启清零。

#### 证据与依据

**依据 1 · 源码核查**：[src/api/sse.ts:124-155](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/api/sse.ts#L124-L155)

截断判据。

<details>
<summary>查看原文（32行）</summary>

```text
/**
 * 判定收尾形态。
 *
 * 判据来自实测（2026-10-16）：
 *   - 正常完成**一定**带 `finish_reason`（`stop` / `tool_calls`）；
 *   - 上游截断时仍会发 `data: [DONE]`，**只是不给 `finish_reason`**；
 *   - 撞 max_tokens 时同样不给 `finish_reason`，末帧是 `choices:[] + usage`，
 *     故用 `completion_tokens >= maxTokens` 把「撞上限」摘出来单独处置。
 *
 * 另补一条：给了 `finish_reason` 但**只有推理、没有正文也没有工具调用**，
 * 对 agent 来说同样是「没产出可用回答」，归入截断。
 */
export function verdictOf(stats: StreamStats): StreamVerdict {
  if (!stats.sawFinishReason) {
    const capped =
      stats.maxTokens !== undefined &&
      stats.maxTokens > 0 &&
      stats.completionTokens !== undefined &&
      stats.completionTokens >= stats.maxTokens
    return capped ? 'capped' : 'truncated'
  }
  if (stats.contentChars === 0 && !stats.sawToolCall && stats.reasoningChars > 0) return 'truncated'
  return 'ok'
}

/** 补齐 length 终止标记的合成帧（核心 mapFinishReason('length') → max-tokens）。 */
const LENGTH_FRAME = new TextEncoder().encode(
  `data: ${JSON.stringify({ choices: [{ index: 0, delta: {}, finish_reason: 'length' }] })}\n\n`,
)
const DONE_FRAME = new TextEncoder().encode('data: [DONE]')
/** 输出侧保留的尾部字节数：够覆盖 `data: [DONE]` 被切在两个 chunk 之间的情形。 */
const OUT_CARRY = 32
```

</details>

**依据 2 · 源码核查**：[src/api/sse.ts:177-192](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/api/sse.ts#L177-L192)

扣住 DONE 机制与作者解释。

<details>
<summary>查看原文（16行）</summary>

```text
/**
 * 流式透传 + 迟到失败嗅探 + **收尾完整性守卫**。
 *
 * 为什么需要收尾校验：上游（讯飞网关）会在生成没结束时就发 `[DONE]`，
 * 只是不给 `finish_reason`。core 的适配器在 `[DONE]` 处若没见到
 * `finish_reason` 就默认按 `stop` 收尾，于是**截断被当成正常完成**——
 * 表现是「助手说要做却什么都没做，本轮就结束了」，且不报任何错。
 * 唯一能发现这件事的地方就是这里（插件是唯一和上游对话的一方）。
 *
 * 处置手段是**扣住 `[DONE]` 不放**：core 见流结束却没有 `[DONE]`，会抛
 * `SSE payload stream ended without [DONE]`（码 `TRANSPORT`），而 TRANSPORT
 * 在 dsh-llm 的可重试白名单里，于是这一轮被自动重试而不是静默截断。
 *
 * 正常路径**字节级原样透传**（仅尾部保留 ≤32 字节再吐，用于识别跨 chunk 的
 * `[DONE]`）；只有判定异常时才会改写收尾。
 */
```

</details>

**依据 3 · 源码核查**：[src/provider.ts:130-140](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L130-L140)

重发成本与 Map。

<details>
<summary>查看原文（11行）</summary>

```text
  /**
   * 「同一 (账号, 模型) 连续被上游截断」的计数。
   *
   * 截断时我们会扣住 `[DONE]` 逼核心按 TRANSPORT 重试，而重试会重发整段上下文
   * （实测动辄 10 万 prompt token，按积分计费）。所以连续截断到上限后就**不再逼
   * 重试**，改成补一个 `length` 收尾标记放行，让这一轮以「被长度截断」结束——
   * 至少界面能看出来，而不是无限烧积分。任一正常收尾都会把计数清零。
   */
  private readonly truncations = new Map<string, number>()
  /** 最近一次上游 usage（面板展示 points_consumed，上游按积分计费）。 */
  private lastUsage: { points: number; model: string; at: number } | undefined
```

</details>

**依据 4 · 源码核查**：[src/provider.ts:403-437](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L403-L437)

守卫决策与计数。

<details>
<summary>查看原文（35行）</summary>

```text
    if (requestedStream(req) && isEventStream(response)) {
      if (response.body === null) {
        return { ok: false, state: 'transport', message: 'loomy upstream: empty stream body' }
      }
      const key = `${resolved.uid}|${modelId}`
      const stream = guardUpstreamStream(response.body, {
        maxTokens,
        onLateFailure: (state, message) => {
          this.setHealth(resolved.uid, state, message)
          this.reportLateFailure(resolved.uid, modelId, state, message)
        },
        decide: (verdict: StreamVerdict): GuardAction => {
          if (verdict === 'ok') return 'pass'
          if (verdict === 'capped') return 'mark-length'
          // 截断：默认扣住 [DONE] 逼核心重试；连续截断到上限后改为标记放行
          return (this.truncations.get(key) ?? 0) >= MAX_TRUNCATION_RETRIES ? 'mark-length' : 'fail'
        },
        onVerdict: (verdict: StreamVerdict, stats: StreamStats): void => {
          if (verdict === 'ok') {
            this.truncations.delete(key)
            return
          }
          if (verdict === 'truncated') {
            const n = (this.truncations.get(key) ?? 0) + 1
            this.truncations.set(key, n)
            this.log(
              `loomy: 上游收尾异常（${verdict}，连续第 ${n} 次）${describeStreamStats(stats)}` +
                (n >= MAX_TRUNCATION_RETRIES ? ' —— 已达重试上限，本次不再触发重试' : ' —— 已扣住 [DONE]，交给核心重试'),
            )
            return
          }
          this.log(`loomy: 上游撞上 max_tokens 上限${describeStreamStats(stats)}`)
        },
      })
      return { ok: true, stream }
```

</details>

#### 缺口

- 未运行真实上游或核心重试。
  **影响**：误判率、积分成本与工具调用副作用未知。
  **进一步探讨**：用中途断流/长度耗尽/推理-only 流做对照。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 状态页与账户展示有什么边界？

**研究主题**：缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

客户端状态页自带进程级随机 token，open/session 变更检查 token；然而源代码注释说明 /router/api/* 同源无鉴权，页面 GET 展示客户端路径、登录时间与脱敏 session。更具体的显示风险：README 示例手机号已脱敏，但 localNickname 直接拼接 auth-session.json 的 phone 字段，status 把 nickname 原样返回。若该字段是完整号码且 Web 面板可被非授权主体访问，将泄露完整号码；实际字段格式和外层鉴权须核。服务的 CSRF token 不等于访问控制。

#### 证据与依据

**依据 1 · 源码核查**：[src/client-page.ts:13-31](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/client-page.ts#L13-L31)

页面作者标注无鉴权并设随机 token。

<details>
<summary>查看原文（19行）</summary>

```text
 * 安全：`/router/api/*` 是**同源无鉴权**的（core 的约定），所以任何网页都能
 * 发 GET/POST 过来。查看页面本身无所谓，但「启动进程」「写入凭证」必须防 CSRF ——
 * 用每次进程启动时随机生成的令牌：令牌只出现在页面 HTML 里，跨源读不到，
 * 于是第三方页面无法构造合法请求。
 */
import { randomBytes } from 'node:crypto'
import type { IncomingMessage, ServerResponse } from 'node:http'
import { CLIENT_PAGE_PATH } from './api/constants.ts'
import type { LoomySupplier } from './provider.ts'
import type { LoomyClientSnapshot } from './types.ts'

export interface ClientPageDeps {
  /** 取当前供应商实例（核心尚未构造时 undefined）。 */
  supplier: () => LoomySupplier | undefined
  log: (msg: string) => void
}

/** 进程级 CSRF 令牌（重启即换）。 */
const TOKEN = randomBytes(16).toString('hex')
```

</details>

**依据 2 · 源码核查**：[src/client-page.ts:214-273](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/client-page.ts#L214-L273)

动作检查。

<details>
<summary>查看原文（60行）</summary>

```text
/** 路由处理器（宿主半注册；见 src/index.ts）。 */
export async function handleClientPage(
  req: IncomingMessage,
  res: ServerResponse,
  deps: ClientPageDeps,
): Promise<void> {
  try {
    const url = new URL(req.url ?? CLIENT_PAGE_PATH, 'http://127.0.0.1')
    let action = url.searchParams.get('action') ?? ''
    let token = url.searchParams.get('t') ?? ''
    let session = ''
    let name = ''

    if (req.method === 'POST') {
      const body = new URLSearchParams(await readBody(req))
      action = body.get('action') ?? action
      token = body.get('t') ?? token
      session = body.get('session') ?? ''
      name = body.get('name') ?? ''
    }

    const supplier = deps.supplier()
    let notice: Notice | undefined
    let error = ''

    // 变更类动作（启动进程 / 写凭证）必须带对令牌
    if (action !== '' && token !== TOKEN) {
      notice = { kind: 'bad', text: '操作令牌不匹配（页面可能已过期，请刷新后重试）' }
    } else if (action === 'open') {
      if (supplier === undefined) {
        notice = { kind: 'warn', text: '供应商尚未加载，无法启动客户端' }
      } else {
        const result = await supplier.openClient()
        notice = result.ok
          ? {
              kind: 'ok',
              text: result.already === true ? '客户端已经在运行' : `已启动客户端：${result.exe ?? ''}`,
            }
          : { kind: 'bad', text: result.error ?? '启动失败' }
      }
    } else if (action === 'session') {
      if (supplier === undefined) {
        notice = { kind: 'warn', text: '供应商尚未加载，无法保存会话串' }
      } else {
        try {
          const account = await supplier.adoptSession({ name, session })
          notice = { kind: 'ok', text: `已保存账号 ${account.nickname}（${account.uid}）` }
        } catch (err) {
          error = (err as Error).message
        }
      }
    }

    let snapshot: LoomyClientSnapshot | undefined
    if (supplier === undefined) {
      deps.log('loomy: 客户端状态页被访问，但供应商实例尚未构造')
    } else {
      snapshot = await supplier.refreshClientSnapshot()
    }
    sendHtml(res, 200, renderPage(snapshot, notice, error))
```

</details>

**依据 3 · 源码核查**：[src/accounts.ts:115-119](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/accounts.ts#L115-L119)

phone 原样入昵称。

```text
  /** 本机登录态账号的展示名（含脱敏手机号，便于多账号辨认）。 */
  localNickname(data: LoomySessionFile): string {
    const phone = typeof data.phone === 'string' && data.phone !== '' ? data.phone : ''
    return phone !== '' ? `本机客户端 · ${phone}` : '本机客户端'
  }
```

**依据 4 · 源码核查**：[src/provider.ts:199-229](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L199-L229)

昵称进入状态。

<details>
<summary>查看原文（31行）</summary>

```text
  status(): SupplierStatusNow {
    this.touchProbe()
    const accounts = this.registry.list().map((entry) => {
      const h = this.health.get(entry.uid)
      const resolved = this.registry.resolve(entry.uid)
      const bits: string[] = []
      if (resolved !== undefined) {
        bits.push(`会话 ${maskSession(resolved.session)}`)
        if (entry.source === 'file' && entry.file !== undefined) bits.push(entry.file)
        else bits.push('面板添加')
      } else {
        bits.push('会话缺失')
      }
      if (entry.uid === '' || entry.source === 'file') {
        // 本机登录态账号：把「客户端在不在跑」一并报出来 —— 这是用户最关心的
        // 「是否已加载」信号（登录态文件在、但客户端没开 = 会话可能已过期）。
        const running = this.client.runningNow()
        bits.push(running === true ? '客户端运行中' : running === false ? '客户端未运行' : '客户端状态未知')
        if (this.lastUsage !== undefined) {
          bits.push(`最近一次调用消耗 ${this.lastUsage.points} 积分（${this.lastUsage.model}）`)
        }
      }
      return {
        uid: entry.uid,
        nickname: entry.nickname,
        // Loomy 无公开的积分查询端点：**报 -1（未知）**，不能报 0——
        // 0 是真值「用完了」，核心会把它当成一次有效读数写进缓存。
        credits: -1,
        state: h?.state ?? ('ok' as AccountState),
        message: h?.message !== undefined ? `${h.message}（${bits.join(' · ')}）` : bits.join(' · '),
      }
```

</details>

**依据 5 · 作者声明**：[README.md:84-96](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/README.md#L84-L96)

README 脱敏展示及 CSRF 声明。

<details>
<summary>查看原文（13行）</summary>

```text
平时（客户端已登录过）**不需要任何操作**：插件每次读状态时都会自动扫描登录态文件，
面板上会直接出现账号 `本机客户端 · 132****3519`，状态列还会带出「客户端运行中 / 未运行」。

### 客户端状态页

`http://127.0.0.1:<面板端口>/router/api/loomy/client`

显示客户端可执行文件路径、是否在运行、登录态是否已加载、脱敏会话串与登录时间，
并提供「打开客户端」按钮。自动识别不可用时（客户端装在探测不到的位置），
也可以在这个页面手动填入会话串作为兜底。

> 该页面由 host half 注册，需要 `webServer` 服务（正常 dsh 环境都有）。
> 变更类操作带进程级 CSRF 令牌，第三方网页无法构造合法请求。
```

</details>

#### 缺口

- 未见真实登录文件和宿主外层鉴权。
  **影响**：号码泄露可达性尚未验证。
  **进一步探讨**：用脱敏测试号码检查 API/页面响应和反代权限。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 应如何做小范围采用试验？

**研究主题**：采用判断、新假设与验证

#### 完整回答

先在隔离 profile 加载固定版 dsh-router core 与本包，使用模拟上游验证模型发现、401/429、正常/缺尾/撞 token 上限流和会话轮换；再用授权测试账户观察积分与重试。上线前遮盖 localNickname 中 phone、明确状态页外层鉴权，避免将 CSRF 当登录。未来可把重试限制持久化并为含工具调用的流保守处理，但这是假设，不是现有能力。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:65-106](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/index.ts#L65-L106)

核心与页面注册。

<details>
<summary>查看原文（42行）</summary>

```text
export function apply(ctx: ContextLike): void {
  // 等核心把聚合表 provide 出来后再追加（顺序无关：inject 延迟到服务可用才触发）。
  ctx.inject(['router.suppliers'], (sctx) => {
    const c = sctx as ContextLike & { router?: { suppliers?: RouterSuppliersService } }
    const suppliers = (c.get?.('router.suppliers') ?? c.router?.suppliers) as RouterSuppliersService | undefined
    if (!suppliers) return undefined
    if (!suppliers.loomy) {
      suppliers.loomy = factory
      ctx.emit('internal/service', 'router.suppliers', suppliers)
      log(ctx, '[dsh-router-loomy] registered router.suppliers: loomy')
    }
    return () => {
      delete suppliers.loomy
    }
  })

  // 客户端状态页：拿不到 webServer 就静默跳过（只影响这个页面，不影响供应商本身；
  // generateLoginUrl 返回的链接此时会 404，但「打开客户端」已经直接执行过了）。
  ctx.inject(['webServer'], (sctx) => {
    // 注入回调里**绝不能让异常逃出去**：cordis 的加载期异常会升级成
    // fatal load failure 打挂整个 dsh（本工程在 http.ts 上已经踩过一次）。
    try {
      const c = sctx as ContextLike
      const server = (c.get?.('webServer') ?? c.webServer) as WebServerLike | undefined
      if (server === undefined || typeof server.register !== 'function') {
        log(ctx, '[dsh-router-loomy] 未取得 webServer 服务，跳过客户端状态页注册')
        return undefined
      }
      const off = server.register({
        kind: 'exact',
        path: CLIENT_PAGE_PATH,
        handler: (req, res) => handleClientPage(req, res, { supplier: currentSupplier, log: (msg) => log(ctx, msg) }),
      })
      log(ctx, `[dsh-router-loomy] 已注册客户端状态页 ${CLIENT_PAGE_PATH}`)
      return () => {
        off()
      }
    } catch (err) {
      log(ctx, `[dsh-router-loomy] 注册客户端状态页失败（不影响供应商本身）：${(err as Error).message}`)
      return undefined
    }
  })
```

</details>

**依据 2 · 源码核查**：[src/accounts.ts:93-119](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/accounts.ts#L93-L119)

缓存/号码字段。

<details>
<summary>查看原文（27行）</summary>

```text
  /** 读取本机登录态（带 TTL 缓存；文件读坏时返回上一次成功值）。 */
  readSessionFile(force = false): { path: string; data: LoomySessionFile } | undefined {
    const now = Date.now()
    if (!force && this.fileCache !== undefined && now - this.fileCache.at <= this.opts.sessionTtlMs) {
      return { path: this.fileCache.path, data: this.fileCache.data }
    }
    const path = this.locateSessionFile()
    if (path === undefined) return undefined
    try {
      const parsed = JSON.parse(readFileSync(path, 'utf-8')) as LoomySessionFile
      if (typeof parsed.session !== 'string' || parsed.session.trim() === '') {
        this.opts.log(`loomy: 登录态文件缺少 session 字段：${path}`)
        return undefined
      }
      this.fileCache = { path, data: parsed, at: now }
      return { path, data: parsed }
    } catch (err) {
      this.opts.log(`loomy: 登录态文件读取失败（${path}）：${(err as Error).message}`)
      return this.fileCache === undefined ? undefined : { path: this.fileCache.path, data: this.fileCache.data }
    }
  }

  /** 本机登录态账号的展示名（含脱敏手机号，便于多账号辨认）。 */
  localNickname(data: LoomySessionFile): string {
    const phone = typeof data.phone === 'string' && data.phone !== '' ? data.phone : ''
    return phone !== '' ? `本机客户端 · ${phone}` : '本机客户端'
  }
```

</details>

**依据 3 · 源码核查**：[src/provider.ts:403-437](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/provider.ts#L403-L437)

流式决策。

<details>
<summary>查看原文（35行）</summary>

```text
    if (requestedStream(req) && isEventStream(response)) {
      if (response.body === null) {
        return { ok: false, state: 'transport', message: 'loomy upstream: empty stream body' }
      }
      const key = `${resolved.uid}|${modelId}`
      const stream = guardUpstreamStream(response.body, {
        maxTokens,
        onLateFailure: (state, message) => {
          this.setHealth(resolved.uid, state, message)
          this.reportLateFailure(resolved.uid, modelId, state, message)
        },
        decide: (verdict: StreamVerdict): GuardAction => {
          if (verdict === 'ok') return 'pass'
          if (verdict === 'capped') return 'mark-length'
          // 截断：默认扣住 [DONE] 逼核心重试；连续截断到上限后改为标记放行
          return (this.truncations.get(key) ?? 0) >= MAX_TRUNCATION_RETRIES ? 'mark-length' : 'fail'
        },
        onVerdict: (verdict: StreamVerdict, stats: StreamStats): void => {
          if (verdict === 'ok') {
            this.truncations.delete(key)
            return
          }
          if (verdict === 'truncated') {
            const n = (this.truncations.get(key) ?? 0) + 1
            this.truncations.set(key, n)
            this.log(
              `loomy: 上游收尾异常（${verdict}，连续第 ${n} 次）${describeStreamStats(stats)}` +
                (n >= MAX_TRUNCATION_RETRIES ? ' —— 已达重试上限，本次不再触发重试' : ' —— 已扣住 [DONE]，交给核心重试'),
            )
            return
          }
          this.log(`loomy: 上游撞上 max_tokens 上限${describeStreamStats(stats)}`)
        },
      })
      return { ok: true, stream }
```

</details>

**依据 4 · 源码核查**：[src/client-page.ts:239-265](https://github.com/2404723600/dsh-router-loomy/blob/ccabca348ca2194287f0770ce348283fdb8bf3d8/src/client-page.ts#L239-L265)

动作 token 检查。

<details>
<summary>查看原文（27行）</summary>

```text
    // 变更类动作（启动进程 / 写凭证）必须带对令牌
    if (action !== '' && token !== TOKEN) {
      notice = { kind: 'bad', text: '操作令牌不匹配（页面可能已过期，请刷新后重试）' }
    } else if (action === 'open') {
      if (supplier === undefined) {
        notice = { kind: 'warn', text: '供应商尚未加载，无法启动客户端' }
      } else {
        const result = await supplier.openClient()
        notice = result.ok
          ? {
              kind: 'ok',
              text: result.already === true ? '客户端已经在运行' : `已启动客户端：${result.exe ?? ''}`,
            }
          : { kind: 'bad', text: result.error ?? '启动失败' }
      }
    } else if (action === 'session') {
      if (supplier === undefined) {
        notice = { kind: 'warn', text: '供应商尚未加载，无法保存会话串' }
      } else {
        try {
          const account = await supplier.adoptSession({ name, session })
          notice = { kind: 'ok', text: `已保存账号 ${account.nickname}（${account.uid}）` }
        } catch (err) {
          error = (err as Error).message
        }
      }
    }
```

</details>

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
