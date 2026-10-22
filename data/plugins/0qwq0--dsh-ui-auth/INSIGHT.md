# dsh-ui-auth

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

分析版本：[6c5e87b](https://github.com/0QwQ0/dsh-ui-auth/tree/6c5e87b44be4e973b092910968001916bb97d22e)

<!-- BEGIN META -->
[![GitHub ★ 10](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=10&color=yellow&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth) [![npm 30d 1,561](https://img.shields.io/static/v1?label=npm+30d&message=1%2C561&color=blue&logo=npm&style=flat)](https://www.npmjs.com/package/dsh-ui-auth) [![最新发布 2026-10-16](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-16&labelColor=668a73&color=grey&style=flat)](https://www.npmjs.com/package/dsh-ui-auth)
<!-- END META -->

> **实现功能**：为 DSH Web 提供账户登录、用户管理、TOTP/Passkey、会话授权及按用户模型配置。

> **核心亮点**：将账户主体、对象归属、端点/结果/流帧策略和用户模型配置接入原宿主，超出单纯外部登录门，但属于应用层组合而非系统级租户隔离。详见[Q01](#research-q01)。

> **风险与缺陷**：多用户隔离是否覆盖所有传输面是核心前提，mux排障退避可直接转发；本轮也未核查全部端点和底层工具共享，不能以登录页或作者测试计数替代完整隔离结论。详见[Q03](#research-q03)。

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
  - [Q01 · 登录之外的业务增量是什么？](#detail-section-11)
  - [Q02 · 请求和WS怎样从登录态进入端点策略？](#detail-section-12)
  - [Q03 · 哪些配置与信任前提会改变隔离结论？](#detail-section-13)
  - [Q04 · 部署、密钥、升级与恢复依赖什么？](#detail-section-14)
  - [Q05 · 各阶段成本及结果怎样判断？](#detail-section-15)
  - [Q06 · 工程与测试有什么价值，可推导何种改进？](#detail-section-16)
  - [Q07 · 当前应如何采用？](#detail-section-17)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：多人共用DSH Web时需要登录与按对象授权，合格结果涵盖未登录拒绝、跨用户不可见和管理员可恢复访问。详见[Q01](#research-q01)。

外部反代认证提供入口门，独立DSH实例提供更直观的租户边界；本插件提供对象级应用权限，但新增协议适配与身份恢复成本。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 账户与二因素 | Web登录和身份管理 | 域名、秘密与恢复责任 |
| 端点/mux授权 | 按用户裁剪数据 | modern宿主和完整策略覆盖 |
| 用户模型配置 | 私有/分享Key及模型可见 | 用户口令和托管边界 |

**流程与依赖**

#### 启动与依赖

| 条件 | 必要性与用途 | 失效影响 |
| --- | --- | --- |
| modern DSH及authorizeIndex/webServer | 网关硬前提 | 缺失503/断开upgrade |
| credentials与归属/模型服务 | 账号、密文和授权 | 状态/恢复及可用性受影响 |
| HTTPS/受控代理与域名 | 远程登录与Passkey | 需正确origin/RP及代理信任 |
| 用户口令及恢复计划 | 私有Key解锁 | 丢失可能无法恢复密文 |

#### 启动步骤

| 步骤 | 执行者 | 判断标准 |
| --- | --- | --- |
| 备份并固定宿主/插件 | 部署者 | modern能力与状态清单清楚 |
| 初始化管理员并处理引导秘密 | 管理员 | 改密、删除文件并控制日志访问 |
| 配置用户/模型/二因素 | 管理员和用户 | 按对象授权与Key责任明确 |
| 核查未登录及跨用户反例 | 部署者 | HTTP/WS全部拒绝越权 |
| 升级/退出先收敛暴露面 | 部署者 | 不因停用暴露原生面板 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次使用 | HTTPS/反代与宿主资源 | 固定版本、引导、备份、用户和二因素 | 没有订阅金额说明；开源许可不等总成本为零 |
| 持续使用 | 登录派生、mux代理过滤、审计 | 权限维护、密钥解锁和升级核查 | 模型费仍依用户/分享配置；认证额外延迟未量化 |
| 失败恢复 | 可能需重建账号或模型配置 | 管理员恢复、存储回滚和私有Key丢失处理 | 账号/二因素/私有Key恢复时间与数据可访问性影响未量化 |


#### 效果

| 目标 | 源码支持 | 边界 |
| --- | --- | --- |
| 登录门禁 | 主体与Cookie、HTTP/upgrade包装 | 配置和完整路由须核对 |
| 按用户数据可见 | 对象归属及mux策略 | 不等于OS级隔离 |
| 模型配置分离 | 用户KDF与授权目录接线 | 私有口令丢失影响恢复 |

> **思考**：多用户隔离是否覆盖所有传输面是核心前提，mux排障退避可直接转发；本轮也未核查全部端点和底层工具共享，不能以登录页或作者测试计数替代完整隔离结论。详见[Q03](#research-q03)。

<a id="detail-section-4"></a>

### 1.3 工程贡献

> **亮点**：将账户主体、对象归属、端点/结果/流帧策略和用户模型配置接入原宿主，超出单纯外部登录门，但属于应用层组合而非系统级租户隔离。详见[Q01](#research-q01)。

将账户主体、对象归属、端点/结果/流帧策略和用户模型配置接入原宿主，超出单纯外部登录门，但属于应用层组合而非系统级租户隔离。详见[Q01](#research-q01)。

网关与策略拆分、未知能力闭锁、跨用户fixture可借鉴；主入口职责集中且协议面大，测试源码不替代真实安全可达面核查。详见[Q06](#research-q06)。

<a id="detail-section-5"></a>

### 1.4 主要限制

多用户隔离是否覆盖所有传输面是核心前提，mux排障退避可直接转发；本轮也未核查全部端点和底层工具共享，不能以登录页或作者测试计数替代完整隔离结论。详见[Q03](#research-q03)。

<a id="detail-section-6"></a>

### 1.5 使用建议

建议观察，先固定目标宿主完成可达面和状态恢复核查；互不信任用户还需独立系统权限边界，不能把登录页当隔离验收。详见[Q07](#research-q07)。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

网关、默认拒绝和mux过滤有源码支持；本轮未完成完整安全可达面与恢复闭包，不给隔离保证。策略覆盖映射为未验证方向。

- 已检查：作者 README、包清单、源码路径 README.md、package.json、docs/OPERATIONS.md、src/index.ts、src/modern-gateway.ts、src/modern-policy.ts、src/profile-kek.ts、test/modern-policy.test.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定版本关键源码核查，重点HTTP/WS接线、策略接口、初始账号、代理配置与KDF结构；未完整核查全部端点、认证算法和客户端UI，不作安全认证。
- 下一步：进一步探讨应从固定宿主端点/帧清单、mux退避配置、实际持久化路径和管理员/私有Key恢复四条线入手，先明确安全边界再判断采用。

**分析版本**

- **仓库**：[0QwQ0/dsh-ui-auth](https://github.com/0QwQ0/dsh-ui-auth)
- **版本号**：0.7.1（[固定提交 6c5e87b](https://github.com/0QwQ0/dsh-ui-auth/tree/6c5e87b44be4e973b092910968001916bb97d22e)）
- **版本日期**：2026-10-16（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可探讨固定宿主端点/流帧与策略语义覆盖映射，升级遇未知项先拒绝并报告，再用跨用户反例比较漏放、误拒和维护成本。当前未验证。详见[Q06](#research-q06)。

进一步探讨应从固定宿主端点/帧清单、mux退避配置、实际持久化路径和管理员/私有Key恢复四条线入手，先明确安全边界再判断采用。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计与口径</summary>

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 14 | 3381 | — | — | 58130 |
| .js | source | 12 | 9818 | 8996 | 849 | — |
| .ts | source | 12 | 8122 | 6639 | 1044 | — |
| .cjs | test | 2 | 288 | 244 | 19 | — |
| .mjs | test | 35 | 6084 | 4406 | 1302 | — |

</details>

**活跃度**

[![Issue 未关闭 0](https://img.shields.io/static/v1?label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=0&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=3&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+created%3A2026-09-22T04%3A55%3A17.996Z..2026-10-22T04%3A55%3A17.996Z) [![近30天关闭 3](https://img.shields.io/static/v1?label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=3&color=grey&logo=github&style=flat)](https://github.com/0QwQ0/dsh-ui-auth/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-09-22T04%3A55%3A17.996Z..2026-10-22T04%3A55%3A17.996Z)



统计日期：2026-10-22。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：固定版本认证网关如何在DSH提供应用层用户隔离，哪些协议、密钥和部署前提限制采用？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 登录之外的业务增量是什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

面向希望多人访问同一DSH Web面板的部署者，既要登录门，也要限制普通用户读取他人会话、全局设置和模型密钥。合格结果应同时涵盖未登录请求被拒、登录后只访问所属对象、WS推送也按归属过滤，以及管理员能管理用户和恢复访问。只出现登录页并不足以证明多用户隔离成立。

简单替代是反向代理认证或每人独立DSH实例。外部门禁擅长接入，但不天然理解sessionId归属；独立实例隔离更直观，却增加部署和维护成本。插件增量是将用户主体、端点授权、结果投影、mux流过滤与用户模型配置接入宿主。密码/TOTP/WebAuthn和加密依赖既有技术，贡献在单用户语义宿主上的应用权限组合，不是新的认证算法，也不证明操作系统文件或工具执行已互相隔离。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-26](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/README.md#L21-L26)

作者提出登录、用户与会话隔离场景。

```text
给 DeepSeek Harness（DSH）的 Web UI 加一道**用户名 / 密码登录门**：未登录时无法访问任何页面、
API 或 WebSocket 通道；登录后可管理用户、邀请码、两步验证（TOTP）与**通行密钥（Passkey）**，
并按登录用户隔离会话数据。

适用场景：把 DSH 面板暴露到内网或公网时，需要一个前置认证层，并希望不同使用者之间互不可见。

```

**依据 2 · 源码核查**：[src/modern-policy.ts:55-66](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-policy.ts#L55-L66)

会话、工作区、全局元数据与交互端点分组。

<details>
<summary>查看原文（12行）</summary>

```text
/** Own-session session methods addressed by `request.sessionId`. */
const SESSION_BY_ID = new Set(['prompt', 'attachment', 'cancel', 'rename', 'selectModel', 'updateQueue', 'fork'])
/** Own-workspace workspace methods addressed by `request.workspaceId`. */
const WORKSPACE_BY_ID = new Set(['rename', 'delete', 'insertBefore', 'insertSessionBefore'])
/** Read-only, owner-filtered session endpoints. */
const SESSION_READ = new Set(['list', 'search', 'modelCatalog', 'canOpenWorkspacePath'])
/** Flat read-only global metadata an ordinary user may see (redacted by the host). */
const SHARED_READ = new Set(['settings/describe', 'llm/listProviders', 'llm/listConfigurableProviders'])
/** Plugin-manager reads the settings page performs on load; its write verbs stay administrator-only. */
const PLUGIN_MANAGER_READ = new Set(['listPlugins', 'listBundles', 'registries', 'inspect'])
/** Interactive question endpoints: agent-scoped or session-scoped, both are ownership proofs. */
const SESSION_INTERACTIVE = new Set(['userQuestions/answer', 'userQuestions/attachWait'])
```

</details>

**依据 3 · 源码核查**：[test/modern-policy.test.mjs:10-30](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/test/modern-policy.test.mjs#L10-L30)

测试预期区分所属和他人session并拒绝未审端点。

<details>
<summary>查看原文（21行）</summary>

```text
test('current unary and logical-stream session access uses the nested request', async () => {
  for (const method of ['prompt', 'attachment', 'cancel', 'fork']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'a' })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'b' })), false)
  }
  for (const method of ['page', 'follow']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'a' } })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'b' } })), false)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'subagent', parentSessionId: 'b', childSessionId: 'a' } })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/page', { sessionId: 'a' }), false)
  // 0.1.5: session/follow is a stream endpoint; the same address check must hold with the stream flag.
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'a' } }), true), true)
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'b' } }), true), false)
})

test('unreviewed endpoints, global settings and arbitrary paths are refused', async () => {
  for (const method of ['session/futureRead', 'settings/update', 'credentials/set', 'workspace/create', 'commands/execute', 'reports/runs']) {
    assert.equal(await policy.authorize(alice, method, request({ sessionId: 'a' })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/create', request({ workspaceId: 'wa', cwd: '/bob' })), false)
```

</details>

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 请求和WS怎样从登录态进入端点策略？

**研究主题**：功能与机制

#### 完整回答

入口取得Node server原request与upgrade监听器，并在缺少connection.authorizeIndex时移除原监听器、改为503和断开upgrade，卸载effect恢复旧监听器。现代能力存在则建立ModernGateway，principal由登录cookie解析到当前用户，session/workspace通过ownership lookup提供归属，模型授权范围由用户配置和分享元数据生成。普通HTTP先过门禁，/auth页面和RPC自行处理；业务端点交给策略authorize及result投影。

WS mux不能仅靠握手登录，因为一条连接可以打开多个不同对象的流。网关为open帧记录streamId/endpoint并先authorize，下行按policy.frame裁剪或丢弃，代理上游回到宿主mux以保留广播语义。未知流和归属不明需要闭锁。它不只是添加UI登录框，而是承担一部分宿主Remote协议适配责任；宿主协议变化会直接影响安全和可用性。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:2899-2929](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2899-L2929)

缺现代能力的显式闭锁和监听恢复。

<details>
<summary>查看原文（31行）</summary>

```text
    const origReq = server.listeners('request') as ((req: IncomingMessage, res: ServerResponse) => void)[]
    const origUp = server.listeners('upgrade') as ((req: IncomingMessage, socket: Duplex, head: Buffer) => void)[]
    // ============ 宿主线别硬前置（v0.7.0：仅支持 DSH 0.2.0-rc.2 线） ============
    // 旧传输线（0.1.1-rc.2 的 dotted `/api/<a>.<b>` 与 apiProxy 事件流）已在 v0.7.0 移除。
    // 缺少现代网关所需的 `connection.authorizeIndex` 时认证网关无法建立：此时移除宿主监听器
    // 并改为**明确拒绝**，而不是放行——宁可面板不可访问，也不能无门暴露。
    const hostAuthorizeIndex = ctx.get('connection')?.authorizeIndex
    if (typeof hostAuthorizeIndex !== 'function') {
      console.error('[dsh-ui-auth] 不支持的 DSH 宿主：未提供 connection.authorizeIndex。'
        + ' v0.7.0 起仅支持 DSH 0.2.0-rc.2 传输线（legacy 0.1.1-rc.2 支持已移除）。'
        + ' 认证网关已 fail-closed：面板将不可访问，请升级 DSH 后重启。')
      server.removeAllListeners('request')
      server.removeAllListeners('upgrade')
      const denyRequest = (_req: IncomingMessage, res: ServerResponse): void => {
        try {
          res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
          res.end('dsh-ui-auth: 不支持的 DSH 版本（需要 0.2.0-rc.2 传输线）。认证网关已 fail-closed，面板不可访问。')
        } catch (err) { try { res.destroy() } catch (e) { /* ignore */ } }
      }
      const denyUpgrade = (_req: IncomingMessage, socket: Duplex): void => {
        try { socket.destroy() } catch (e) { /* ignore */ }
      }
      server.on('request', denyRequest)
      server.on('upgrade', denyUpgrade)
      ctx.effect(() => () => {
        server.removeListener('request', denyRequest)
        server.removeListener('upgrade', denyUpgrade)
        for (const fn of origReq) server.on('request', fn)
        for (const fn of origUp) server.on('upgrade', fn)
      }, 'dsh-ui-auth: 不支持宿主时的 fail-closed 监听器')
      return
```

</details>

**依据 2 · 源码核查**：[src/index.ts:2932-2974](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2932-L2974)

主体、归属与用户模型授权接线。

<details>
<summary>查看原文（43行）</summary>

```text
    const modern: ModernGateway = createModernGateway(ctx, {
          ready: initialized,
          user(username) {
            const user = state.users.get(username)
            return state.ready && user !== undefined ? Object.freeze({ username, role: user.role }) : undefined
          },
          principal(req) {
            if (!state.ready) return undefined
            const username = resolveSession(readCookie(req, COOKIE_NAME), false)
            const user = state.users.get(username as string)
            return user === undefined ? undefined : Object.freeze({ username: username as string, role: user.role })
          },
          loginKey: req => hashToken(readCookie(req, COOKIE_NAME) ?? ''),
          session: ownerOfSession,
          workspace: ownerOfWorkspace,
          async sessionExists(id) {
            if (state.owners.sessions.has(id) || ctx.get('sessions')?.get(id) !== undefined) return true
            const persistence = ctx.get('sessionPersistence')
            // A caller-supplied id cannot be adopted without checking cold state too.
            if (persistence?.inspect === undefined) return true
            try { return (await persistence.inspect(id)) !== undefined }
            catch (error: any) {
              if (error?.name === 'SessionPersistenceNotFoundError') return false
              throw error
            }
          },
          claimSession: setSessionOwner,
          claimWorkspace: setWorkspaceOwner,
          // R2：普通用户可见的模型 = 自有配置 + 收到的分享。管理员由策略层直接绕过。
          // 从未配置任何模型的用户得到空授权（目录为空、切换模型被拒）——这就是 Q2 的"阻断使用"。
          // 这里只读元数据（provider/model），不需要解锁，也不接触任何 Key。
          async entitlement(principal: Principal) {
            const service = profileService()
            if (service === undefined || store === null) return undefined
            const uid = await new ProfileStore(store).uidOf(principal.username)
            if (uid === undefined) return { providers: [], models: [] }
            const profiles = await service.listProfiles(uid)
            // provider 必须是**宿主里的路由 id**（R1-ii：每条配置一条路由）；收到的分享形如 ownerUid/profileId。
            const routeOf = (meta: { profileId: string }) => routeIdOf(String(meta.profileId).split('/').pop() ?? meta.profileId)
            return {
              providers: [...new Set(profiles.map(routeOf))],
              models: profiles.map(meta => ({ provider: routeOf(meta), model: meta.model })),
            }
```

</details>

**依据 3 · 源码核查**：[src/modern-gateway.ts:458-465](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-gateway.ts#L458-L465)

mux逐帧授权和投影设计说明。

```text
  //   **上行**：记录 `open` 的 streamId → endpoint，并先 `policy.authorize(...)`；未授权不转发（宿主是单用户语义，
  //            会照单服务任何 sessionId，只过滤下行不够）。上游未连上时上行帧排队，不丢首帧。
  //   **下行**：逐帧 `policy.frame()`（丢弃/裁剪/投影，未知流 fail-closed），并记录已投递的 waterfall eventId —— 
  //            让 `$events/result` 保持严格属主绑定（Issue #2 的正解）。
  // 之所以用代理而不自己实现 mux：旧实现要重放 mux 语义，与 0.2.0 客户端协议不兼容（界面会无限「重新连接中」）；
  // 代理**不碰语义**，只按 JSON 里的归属字段与策略层裁决，协议无关。
  // 递归防护：代理自己的上游连接会再次经过本闸门，必须能被识别并直通，否则无限自我连接（进程耗尽静默退出）。
  const MUX_PROXY_HEADER = 'x-dsh-ui-auth-mux-proxy'
```

**依据 4 · 源码核查**：[src/modern-policy.ts:87-92](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-policy.ts#L87-L92)

authorize/result/frame三种策略接口。

```text
export interface ModernPolicy {
  session(principal: Principal, id: unknown): boolean
  workspace(principal: Principal, id: unknown): boolean
  authorize(principal: Principal, endpoint: string, payload: unknown, stream?: boolean): Promise<boolean>
  result(principal: Principal, endpoint: string, value: unknown): Promise<unknown>
  frame(principal: Principal, endpoint: string, value: unknown, correlation: StreamCorrelation): unknown
```

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 哪些配置与信任前提会改变隔离结论？

**研究主题**：缺陷与关键质疑

#### 完整回答

最影响多用户贡献的是mux过滤是否始终启用。源码在DSH_AUTH_MUX_PROXY=0时直接转发，作者也明确这是会重现跨用户泄漏的排障退避。因此部署不能只看登录成功，必须确认关键配置和逐流所有权；默认路径有过滤不等于所有部署都安全。入口全局替换server监听器也使插件成为全站访问可用性的关键依赖，缺宿主能力主动停摆是设计取舍而非兼容保证。

初始admin随机口令同时打印console并写bootstrap文件，安全操作还包括日志接触权限、改密和删除文件。trustProxy只应在受控代理之后开启，实际代码取XFF最右非空项；这并不能独立验证代理链可信。策略层按session/workspace裁剪不等于文件系统、网络或工具子进程的强租户隔离；本轮未核查全部provider、Passkey、TOTP和所有端点的完整实现，故不能把已有测试声明升级为安全审计结论。

#### 证据与依据

**依据 1 · 源码核查**：[src/modern-gateway.ts:428-429](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-gateway.ts#L428-L429)

排障变量直接退避转发。

```text
      // ② `DSH_AUTH_MUX_PROXY=0` 的排障退避（退避后跨用户泄漏会重现）。
      if (process.env.DSH_AUTH_MUX_PROXY === '0' || isOwnMuxProxyRequest(req)) { forward(req, socket, head); return }
```

**依据 2 · 源码核查**：[src/index.ts:2821-2854](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2821-L2854)

初始管理员与明文口令两个输出位置。

<details>
<summary>查看原文（34行）</summary>

```text
    async function bootstrap(): Promise<void> {
      if (state.users.size > 0) return
      if (store === null) {
        console.log('[dsh-ui-auth] 检测到 credentials 服务缺失，用户数据仅保存在内存中，重启后将丢失')
      }
      const username = 'admin'
      const password = randomPassword(16)
      const rec = newPasswordRecord(password)
      const now = Date.now()
      const ok = await storeCreate({ v: 1, username, role: 'admin', ...rec, displayName: '管理员', email: '', createdAt: now, updatedAt: now })
      if (!ok) {
        console.error('[dsh-ui-auth] 引导创建管理员失败（用户名已存在？）')
        return
      }
      console.log('[dsh-ui-auth] ================================================')
      console.log('[dsh-ui-auth] 首次启动：已创建管理员账号')
      console.log('[dsh-ui-auth]   用户名: ' + username)
      console.log('[dsh-ui-auth]   密码:   ' + password)
      console.log('[dsh-ui-auth] 请立即登录并修改密码。')
      console.log('[dsh-ui-auth] ================================================')
      try {
        const fsSvc: FsService | undefined = ctx.get('fs')
        if (fsSvc !== undefined) {
          const lines = [
            'DeepSeek Harness UI 认证插件 - 初始管理员账号',
            '================================================',
            '用户名: ' + username,
            '密码:   ' + password,
            '',
            '请在登录后立即修改该密码，然后删除本文件。',
          ]
          const target = await fsSvc.resolve('dsh-ui-auth-bootstrap.txt')
          await fsSvc.writeText(target, lines.join('\n'))
          console.log('[dsh-ui-auth] 初始账号已写入文件 dsh-ui-auth-bootstrap.txt（进程工作目录）')
```

</details>

**依据 3 · 源码核查**：[src/index.ts:370-398](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L370-L398)

代理信任开关与实际IP读取。

<details>
<summary>查看原文（29行）</summary>

```text
/** 从环境变量解析限流配置（DSH_AUTH_MAX_FAILS / DSH_AUTH_LOCK_MS / DSH_AUTH_TRUST_PROXY）。 */
export function readLockConfig(env?: Record<string, string | undefined> | null): LockConfig {
  const e = env !== undefined && env !== null ? env : {}
  const num = (v: unknown, d: number): number => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : d }
  return {
    maxFails: num(e.DSH_AUTH_MAX_FAILS, 5),
    lockMs: num(e.DSH_AUTH_LOCK_MS, 30 * 1000),
    trustProxy: ['1', 'true', 'yes', 'on'].includes(String(e.DSH_AUTH_TRUST_PROXY || '').trim().toLowerCase()),
  }
}

/**
 * 客户端来源 IP：默认取 socket.remoteAddress；仅当显式配置 DSH_AUTH_TRUST_PROXY=1
 * 时才信任 X-Forwarded-For（取最左，反代按 客户端→代理 顺序追加）。默认不信任，
 * 防止未配置反代时伪造 XFF 绕过/污染限流计数。
 */
export function clientIp(req: ClientIpRequest | undefined, trustProxy: boolean): string {
  try {
    const addr = req !== undefined && req.socket !== undefined ? req.socket.remoteAddress : undefined
    if (trustProxy && req !== undefined && req.headers !== undefined && typeof req.headers['x-forwarded-for'] === 'string') {
      // 取最右（最近受信反代追加的地址，客户端无法伪造）；从右向左跳过空段
      const parts = req.headers['x-forwarded-for'].split(',')
      for (let i = parts.length - 1; i >= 0; i--) {
        const p = parts[i].trim()
        if (p !== '') return p
      }
    }
    return typeof addr === 'string' ? addr : 'unknown'
  } catch (err) { return 'unknown' }
```

</details>

**依据 4 · 源码核查**：[test/modern-policy.test.mjs:26-30](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/test/modern-policy.test.mjs#L26-L30)

默认拒绝全局设置和任意路径的测试预期。

```text
test('unreviewed endpoints, global settings and arbitrary paths are refused', async () => {
  for (const method of ['session/futureRead', 'settings/update', 'credentials/set', 'workspace/create', 'commands/execute', 'reports/runs']) {
    assert.equal(await policy.authorize(alice, method, request({ sessionId: 'a' })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/create', request({ workspaceId: 'wa', cwd: '/bob' })), false)
```

#### 缺口

- 所有可达HTTP端点、mux帧及底层工具执行与主体的对应关系未完成全量闭包核查。
  **影响**：不能为互不信任多用户生产部署提供隔离保证。
  **进一步探讨**：固定目标宿主端点清单，逐一映射用户权限和结果/帧投影，并将未知入口保持拒绝；另核查文件与进程层共享。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 部署、密钥、升级与恢复依赖什么？

**研究主题**：依赖、兼容与流程

#### 完整回答

manifest要求Node ^22.19.0或>=24，目标DSH modern线>=0.2.0-rc.2且<0.3.0，运行依赖simplewebauthn/server、qrcode和ws。宿主webServer、connection.authorizeIndex、credentials以及session/workspace归属服务是核心条件。客户端提供账户、模型和分享面板，Passkey还受浏览器安全上下文、域名/RP ID与origin配置约束，不能单靠包安装满足。

私有模型配置采用用户KDF参数和口令派生KEK包裹DEK的设计，uid/profileId进入AAD；分享采用不同托管责任。口令丢失可能使私有Key不可恢复，备份密文不等于拥有解密能力。运维文档同时出现会话文件/凭据文档等位置说明，实际备份应逐项核对所部署版本写入路径，不能只复制一份文件便承诺恢复完整。升级需备份、重启并检查存储兼容，关闭认证插件前必须先把面板暴露范围收回安全部署边界。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:1-18](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/package.json#L1-L18)

版本和已构建入口。

<details>
<summary>查看原文（18行）</summary>

```text
{
  "name": "dsh-ui-auth",
  "version": "0.7.1",
  "description": "DSH Web UI 认证网关：登录保护全部 HTTP/WS 接口；用户管理、邀请码注册、TOTP 两步验证与通行密钥（Passkey/WebAuthn）登录。",
  "type": "module",
  "main": "./lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./package.json": "./package.json"
  },
  "files": [
    "lib",
    "src",
    "docs",
    "assets",
    "cordis.patch.yml",
    "LICENSE",
```

</details>

**依据 2 · 源码核查**：[src/profile-kek.ts:37-61](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/profile-kek.ts#L37-L61)

用户KDF参数及稳定身份绑定。

<details>
<summary>查看原文（25行）</summary>

```text
const aadOf = (uid: string, profileId: string): string => `${uid}/${profileId}`

/** 读取（必要时创建）用户级 KDF 参数。每人一份，改密时沿用同一 salt 亦可重新生成。 */
export async function ensureUserKdf(
  seam: ProfileSeam, uid: string, iterations = DEFAULT_KDF_ITERATIONS,
): Promise<{ salt: string; iterations: number }> {
  const raw = await seam.readRaw(keyKdf(uid))
  if (raw !== undefined) {
    const parsed = JSON.parse(raw) as Partial<KdfDoc>
    if (parsed.v === 1 && typeof parsed.salt === 'string' && typeof parsed.iterations === 'number') {
      return { salt: parsed.salt, iterations: parsed.iterations }
    }
  }
  const salt = toBase64(randomSalt())
  await seam.writeRaw(keyKdf(uid), JSON.stringify({ v: 1, salt, iterations } satisfies KdfDoc))
  return { salt, iterations }
}

/** 读取用户级 KDF 参数（不存在则 undefined，用于判断该用户是否已启用私有配置）。 */
export async function readUserKdf(seam: ProfileSeam, uid: string): Promise<{ salt: string; iterations: number } | undefined> {
  const raw = await seam.readRaw(keyKdf(uid))
  if (raw === undefined) return undefined
  const parsed = JSON.parse(raw) as Partial<KdfDoc>
  return parsed.v === 1 && typeof parsed.salt === 'string' && typeof parsed.iterations === 'number'
    ? { salt: parsed.salt, iterations: parsed.iterations }
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2901-2929](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2901-L2929)

现代宿主能力为硬前提。

<details>
<summary>查看原文（29行）</summary>

```text
    // ============ 宿主线别硬前置（v0.7.0：仅支持 DSH 0.2.0-rc.2 线） ============
    // 旧传输线（0.1.1-rc.2 的 dotted `/api/<a>.<b>` 与 apiProxy 事件流）已在 v0.7.0 移除。
    // 缺少现代网关所需的 `connection.authorizeIndex` 时认证网关无法建立：此时移除宿主监听器
    // 并改为**明确拒绝**，而不是放行——宁可面板不可访问，也不能无门暴露。
    const hostAuthorizeIndex = ctx.get('connection')?.authorizeIndex
    if (typeof hostAuthorizeIndex !== 'function') {
      console.error('[dsh-ui-auth] 不支持的 DSH 宿主：未提供 connection.authorizeIndex。'
        + ' v0.7.0 起仅支持 DSH 0.2.0-rc.2 传输线（legacy 0.1.1-rc.2 支持已移除）。'
        + ' 认证网关已 fail-closed：面板将不可访问，请升级 DSH 后重启。')
      server.removeAllListeners('request')
      server.removeAllListeners('upgrade')
      const denyRequest = (_req: IncomingMessage, res: ServerResponse): void => {
        try {
          res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
          res.end('dsh-ui-auth: 不支持的 DSH 版本（需要 0.2.0-rc.2 传输线）。认证网关已 fail-closed，面板不可访问。')
        } catch (err) { try { res.destroy() } catch (e) { /* ignore */ } }
      }
      const denyUpgrade = (_req: IncomingMessage, socket: Duplex): void => {
        try { socket.destroy() } catch (e) { /* ignore */ }
      }
      server.on('request', denyRequest)
      server.on('upgrade', denyUpgrade)
      ctx.effect(() => () => {
        server.removeListener('request', denyRequest)
        server.removeListener('upgrade', denyUpgrade)
        for (const fn of origReq) server.on('request', fn)
        for (const fn of origUp) server.on('upgrade', fn)
      }, 'dsh-ui-auth: 不支持宿主时的 fail-closed 监听器')
      return
```

</details>

**依据 4 · 作者声明**：[docs/OPERATIONS.md:35-65](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/docs/OPERATIONS.md#L35-L65)

作者持久化和备份恢复说明，需按实际版本核对。

<details>
<summary>查看原文（31行）</summary>

````text
```bash
export DSH_AUTH_MAX_FAILS=10 DSH_AUTH_LOCK_MS=60000 DSH_AUTH_TRUST_PROXY=1
```

## 3. 数据与持久化

| 内容 | 位置 | 说明 |
|---|---|---|
| 用户、角色、资料、密码哈希、TOTP 密钥、通行密钥（公钥）、邀请码 | DSH 凭据库 `~/.dsh/.credentials.yaml` 中的 `dsh-auth/*` 记录 | 重启后保留；**不保存明文密码，也不保存通行密钥私钥**（私钥只存在于用户设备） |
| 登录会话 | 面板进程工作目录下的 `dsh-ui-auth-sessions.json` | 只存 Token 的 SHA-256 哈希；未过期会话重启后免登录恢复 |
| 审计日志 | 面板进程工作目录下的 `dsh-ui-auth-audit.jsonl` | JSONL，每行含时间、操作者、动作、目标等字段 |
| 首次启动引导文件 | 面板进程工作目录下的 `dsh-ui-auth-bootstrap.txt` | 任一用户改密成功后自动删除 |

**备份**：备份 `~/.dsh/.credentials.yaml` 即可保留全部账号数据。

**彻底清空**：删除 `~/.dsh/.credentials.yaml` 中 `dsh-auth:` 下的记录，并删除上述工作目录里的
`dsh-ui-auth-sessions.json`、`dsh-ui-auth-audit.jsonl` 与 `dsh-ui-auth-bootstrap.txt`，然后重启面板
（用户表为空时会重新生成新的管理员与随机密码）。

### 落盘位置一览（便于备份与审计）

| 内容 | 位置 | 敏感度 |
|---|---|---|
| 用户、会话、邀请码、审计记录 | 宿主 `DSH_HOME` 的**凭据文档**（`<scope>/<id>` 键） | 高（密文与掩码，无明文口令） |
| 私有模型配置（密文 + 掩码） | 同上，键 `dsh-auth/profile-private-<uid>` 等 | 高（**无口令无法解密**） |
| 分享配置（服务端主密钥托管） | 同上，键 `dsh-auth/profile-shared-<uid>` | 高 |
| 初始管理员口令 | 进程工作目录 `dsh-ui-auth-bootstrap.txt` | **极高，用后即删** |
| 会话恢复 | 会话文件（登出即失效） | 高 |

## 4. 备份与恢复

````

</details>

#### 缺口

- 本轮没有完成所有账号、会话、审计和模型密文的持久化路径与备份闭包。
  **影响**：不能给出已验证的一键备份/恢复承诺。
  **进一步探讨**：沿store/session/audit写入链生成部署版本状态清单，再在隔离环境独立制定恢复验收；本轮不执行恢复。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 各阶段成本及结果怎样判断？

**研究主题**：效果与总成本

#### 完整回答

首次投入包括固定宿主版本、备份状态、管理员引导、HTTPS/反代、用户邀请以及可选TOTP/Passkey。插件本身没有订阅费用说明，但需要维护账号和网络入口，不能把开源许可等同零总成本。持续成本在登录派生计算、HTTP端点校验、mux本地代理与逐帧过滤、用户模型配置解锁和审计；底层模型调用费用仍由用户/分享配置承担，不因认证插件减少。

失败恢复包括被锁管理员恢复、丢失二因素、口令丢失的私有Key处理、升级后的路由拒绝和会话失效。密钥和账号恢复可能改变用户数据可访问性，不能只按重启时间计成本。效果标准应是混合授权/未授权任务下正确允许、正确拒绝、无跨用户数据及正常核心任务完成，同时观察额外延迟和人工运维；作者测试计数没有给出本轮独立工作负载成本，不填写金额、耗时和安全成功率。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.ts:370-378](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L370-L378)

限流和锁定是可调运行负担。

```text
/** 从环境变量解析限流配置（DSH_AUTH_MAX_FAILS / DSH_AUTH_LOCK_MS / DSH_AUTH_TRUST_PROXY）。 */
export function readLockConfig(env?: Record<string, string | undefined> | null): LockConfig {
  const e = env !== undefined && env !== null ? env : {}
  const num = (v: unknown, d: number): number => { const n = Number(v); return Number.isInteger(n) && n > 0 ? n : d }
  return {
    maxFails: num(e.DSH_AUTH_MAX_FAILS, 5),
    lockMs: num(e.DSH_AUTH_LOCK_MS, 30 * 1000),
    trustProxy: ['1', 'true', 'yes', 'on'].includes(String(e.DSH_AUTH_TRUST_PROXY || '').trim().toLowerCase()),
  }
```

**依据 2 · 源码核查**：[src/index.ts:2821-2854](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2821-L2854)

管理员引导产生人工秘密管理责任。

<details>
<summary>查看原文（34行）</summary>

```text
    async function bootstrap(): Promise<void> {
      if (state.users.size > 0) return
      if (store === null) {
        console.log('[dsh-ui-auth] 检测到 credentials 服务缺失，用户数据仅保存在内存中，重启后将丢失')
      }
      const username = 'admin'
      const password = randomPassword(16)
      const rec = newPasswordRecord(password)
      const now = Date.now()
      const ok = await storeCreate({ v: 1, username, role: 'admin', ...rec, displayName: '管理员', email: '', createdAt: now, updatedAt: now })
      if (!ok) {
        console.error('[dsh-ui-auth] 引导创建管理员失败（用户名已存在？）')
        return
      }
      console.log('[dsh-ui-auth] ================================================')
      console.log('[dsh-ui-auth] 首次启动：已创建管理员账号')
      console.log('[dsh-ui-auth]   用户名: ' + username)
      console.log('[dsh-ui-auth]   密码:   ' + password)
      console.log('[dsh-ui-auth] 请立即登录并修改密码。')
      console.log('[dsh-ui-auth] ================================================')
      try {
        const fsSvc: FsService | undefined = ctx.get('fs')
        if (fsSvc !== undefined) {
          const lines = [
            'DeepSeek Harness UI 认证插件 - 初始管理员账号',
            '================================================',
            '用户名: ' + username,
            '密码:   ' + password,
            '',
            '请在登录后立即修改该密码，然后删除本文件。',
          ]
          const target = await fsSvc.resolve('dsh-ui-auth-bootstrap.txt')
          await fsSvc.writeText(target, lines.join('\n'))
          console.log('[dsh-ui-auth] 初始账号已写入文件 dsh-ui-auth-bootstrap.txt（进程工作目录）')
```

</details>

**依据 3 · 作者声明**：[docs/OPERATIONS.md:66-90](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/docs/OPERATIONS.md#L66-L90)

作者恢复、迁移和升级说明。

<details>
<summary>查看原文（25行）</summary>

```text
1. **备份**：停止面板（或至少停止写入）后，复制 `DSH_HOME` 与插件工作目录下的状态文件。
   私有配置的**密文**可安全备份——离开用户口令无法解密，但这意味着**口令丢失 = 私有 Key 丢失**。
2. **恢复**：把备份放回原位后重启；会话若已过期需要重新登录。
3. **迁移机器**：整目录搬迁即可（Cookie 名按 `DSH_HOME` 派生，换路径等于换实例，用户需重新登录）。
4. **改密后的影响**：改密会**重包裹**私有配置的 DEK（不需要重新录入 Key）。

## 5. 升级与回滚

1. 阅读 [CHANGELOG](../CHANGELOG.md) 中目标版本的**破坏性变更**；
2. 备份（见 §4）；
3. 升级插件并重启面板；
4. 回滚：装回旧版本并重启——**注意**跨大版本的存储布局可能不同，回滚前务必先备份。

**0.6.x → 0.7.0 的特别注意**：v0.7.0 移除了 legacy 传输线，且模型/密钥改为**按用户隔离**；
若你在 0.6.x 用过部署级模型配置，升级后普通用户**不会**继承它（这是设计，见 [SECURITY](SECURITY.md) §6）。

## 6. 排障

| 现象 | 可能原因 | 处理 |
|---|---|---|
| 面板打不开、日志出现 **fail-closed** | 宿主未提供 `connection.authorizeIndex`（版本不匹配） | 升级 DSH 到 0.2.0 线后重启 |
| 设置页一直「重新连接中」 | 直播通道被中间层拦截（升级请求需可达宿主） | 检查反代是否透传 WebSocket；确认未被额外网关改写 |
| 普通用户看不到「模型」页 | 版本不匹配（该页为 v0.7.0 能力） | 确认插件与 DSH 版本 |
| 查余额显示「需先解锁」 | 私有 Key 用口令派生密钥加密，未解锁时服务端无法解密 | **预期行为**：先在【模型】页解锁 |
| 普通用户被拒（403）但界面正常 | deny-by-default | 见 [SECURITY](SECURITY.md) §6 权限矩阵 |
```

</details>

#### 缺口

- 缺少目标部署的并发mux开销和账号恢复人工成本。
  **影响**：无法量化共享实例便利是否覆盖权限维护与排障负担。
  **进一步探讨**：固定用户数、流数和核心任务，比较原生/外部门禁/插件的延迟、内存、授权结果与恢复投入。

<a id="research-q06"></a>

<a id="detail-section-16"></a>

### Q06 · 工程与测试有什么价值，可推导何种改进？

**研究主题**：工程质量与复用、新假设与验证

#### 完整回答

可借鉴的是将网关传输和端点策略分离，authorize/result/frame共享主体与对象归属；未知能力拒绝、缺modern接口闭锁，避免“兼容失败自动放行”。策略回归明确构造alice/bob所有权和畸形payload，能表达安全不变量，但本轮只阅读未运行，也不能用unit通过推导真实mux广播安全。主入口仍承载大量登录、存储、路由与HTML职责，改变一处可能影响多种路径，维护需要完整协议清单。

未验证方向是把宿主端点清单、流帧种类与插件策略生成可核对覆盖映射，在升级时对未登记项先拒绝并向管理员报告，减少漏审和静默功能损失。推导来自默认拒绝与宿主API演进的矛盾，不是建议放宽权限。最小验证以旧/新固定宿主清单和跨用户反例驱动映射，比较未知入口漏放、合法页误拒及维护时间；若映射只检查名字而不能绑定参数/结果语义，或误拒负担没有下降，就不能称该方案有效。

#### 证据与依据

**依据 1 · 源码核查**：[src/modern-policy.ts:55-92](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-policy.ts#L55-L92)

端点分组和三种策略表面。

<details>
<summary>查看原文（38行）</summary>

```text
/** Own-session session methods addressed by `request.sessionId`. */
const SESSION_BY_ID = new Set(['prompt', 'attachment', 'cancel', 'rename', 'selectModel', 'updateQueue', 'fork'])
/** Own-workspace workspace methods addressed by `request.workspaceId`. */
const WORKSPACE_BY_ID = new Set(['rename', 'delete', 'insertBefore', 'insertSessionBefore'])
/** Read-only, owner-filtered session endpoints. */
const SESSION_READ = new Set(['list', 'search', 'modelCatalog', 'canOpenWorkspacePath'])
/** Flat read-only global metadata an ordinary user may see (redacted by the host). */
const SHARED_READ = new Set(['settings/describe', 'llm/listProviders', 'llm/listConfigurableProviders'])
/** Plugin-manager reads the settings page performs on load; its write verbs stay administrator-only. */
const PLUGIN_MANAGER_READ = new Set(['listPlugins', 'listBundles', 'registries', 'inspect'])
/** Interactive question endpoints: agent-scoped or session-scoped, both are ownership proofs. */
const SESSION_INTERACTIVE = new Set(['userQuestions/answer', 'userQuestions/attachWait'])
/** Office-to-PDF carries positional args `(workspaceFileScopeId, path, priority)`. */
const OFFICE_TO_PDF_SCOPE_INDEX = 0

/** The raw `args` value of a Remote payload (an object, or a positional array). */
function rawArgs(payload: unknown): unknown {
  return object(payload) ? payload.args : undefined
}

/** The single `args` object of a Remote payload, or undefined when malformed. */
export function remoteArgs(payload: unknown): JsonObject | undefined {
  if (!object(payload) || Object.keys(payload).length !== 1 || !object(payload.args)) return undefined
  return payload.args
}

/** Normalize one endpoint's args into its request object (nested or flat). */
function requestOf(args: JsonObject): JsonObject {
  if (object(args.request)) return args.request
  return args
}

export interface ModernPolicy {
  session(principal: Principal, id: unknown): boolean
  workspace(principal: Principal, id: unknown): boolean
  authorize(principal: Principal, endpoint: string, payload: unknown, stream?: boolean): Promise<boolean>
  result(principal: Principal, endpoint: string, value: unknown): Promise<unknown>
  frame(principal: Principal, endpoint: string, value: unknown, correlation: StreamCorrelation): unknown
```

</details>

**依据 2 · 源码核查**：[test/modern-policy.test.mjs:10-30](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/test/modern-policy.test.mjs#L10-L30)

跨用户与未登记端点反例。

<details>
<summary>查看原文（21行）</summary>

```text
test('current unary and logical-stream session access uses the nested request', async () => {
  for (const method of ['prompt', 'attachment', 'cancel', 'fork']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'a' })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'b' })), false)
  }
  for (const method of ['page', 'follow']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'a' } })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'b' } })), false)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'subagent', parentSessionId: 'b', childSessionId: 'a' } })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/page', { sessionId: 'a' }), false)
  // 0.1.5: session/follow is a stream endpoint; the same address check must hold with the stream flag.
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'a' } }), true), true)
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'b' } }), true), false)
})

test('unreviewed endpoints, global settings and arbitrary paths are refused', async () => {
  for (const method of ['session/futureRead', 'settings/update', 'credentials/set', 'workspace/create', 'commands/execute', 'reports/runs']) {
    assert.equal(await policy.authorize(alice, method, request({ sessionId: 'a' })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/create', request({ workspaceId: 'wa', cwd: '/bob' })), false)
```

</details>

**依据 3 · 源码核查**：[src/index.ts:2901-2929](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2901-L2929)

缺现代接口的显式闭锁。

<details>
<summary>查看原文（29行）</summary>

```text
    // ============ 宿主线别硬前置（v0.7.0：仅支持 DSH 0.2.0-rc.2 线） ============
    // 旧传输线（0.1.1-rc.2 的 dotted `/api/<a>.<b>` 与 apiProxy 事件流）已在 v0.7.0 移除。
    // 缺少现代网关所需的 `connection.authorizeIndex` 时认证网关无法建立：此时移除宿主监听器
    // 并改为**明确拒绝**，而不是放行——宁可面板不可访问，也不能无门暴露。
    const hostAuthorizeIndex = ctx.get('connection')?.authorizeIndex
    if (typeof hostAuthorizeIndex !== 'function') {
      console.error('[dsh-ui-auth] 不支持的 DSH 宿主：未提供 connection.authorizeIndex。'
        + ' v0.7.0 起仅支持 DSH 0.2.0-rc.2 传输线（legacy 0.1.1-rc.2 支持已移除）。'
        + ' 认证网关已 fail-closed：面板将不可访问，请升级 DSH 后重启。')
      server.removeAllListeners('request')
      server.removeAllListeners('upgrade')
      const denyRequest = (_req: IncomingMessage, res: ServerResponse): void => {
        try {
          res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
          res.end('dsh-ui-auth: 不支持的 DSH 版本（需要 0.2.0-rc.2 传输线）。认证网关已 fail-closed，面板不可访问。')
        } catch (err) { try { res.destroy() } catch (e) { /* ignore */ } }
      }
      const denyUpgrade = (_req: IncomingMessage, socket: Duplex): void => {
        try { socket.destroy() } catch (e) { /* ignore */ }
      }
      server.on('request', denyRequest)
      server.on('upgrade', denyUpgrade)
      ctx.effect(() => () => {
        server.removeListener('request', denyRequest)
        server.removeListener('upgrade', denyUpgrade)
        for (const fn of origReq) server.on('request', fn)
        for (const fn of origUp) server.on('upgrade', fn)
      }, 'dsh-ui-auth: 不支持宿主时的 fail-closed 监听器')
      return
```

</details>

#### 缺口

- 升级策略覆盖映射尚未实现，无法判断漏审与误拒改善。
  **影响**：保持未验证研究方向，不能计入贡献评分。
  **进一步探讨**：先固定端点与参数/结果语义快照，再用相同跨用户反例评估。

<a id="research-q07"></a>

<a id="detail-section-17"></a>

### Q07 · 当前应如何采用？

**研究主题**：采用判断

#### 完整回答

建议观察，适合有能力固定DSH版本、核查协议和维护身份/密钥的部署者继续研究。登录、权限投影和mux过滤提供了比外层登录门更明确的应用层贡献，但其安全价值高度依赖完整入口覆盖、部署配置和宿主语义；本轮局部源码核查不足以把互不信任多用户直接当作可控生产试用。普通个人本地DSH通常没有承担这套账号系统的必要。

继续讨论应先锁定目标宿主和状态清单，确认mux退避关闭、未登录/跨用户/未知流均拒绝，管理员恢复和私有Key丢失边界清楚，再由部署者确定隔离验证范围。若需要OS级租户隔离，采用独立实例/权限边界而不是用登录页替代。没有同版本安装、核心任务和禁用验收，不能给值得安装，也不从作者兼容矩阵自动升为trial。

#### 证据与依据

**依据 1 · 源码核查**：[src/modern-gateway.ts:428-429](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/modern-gateway.ts#L428-L429)

关键退避开关影响采用边界。

```text
      // ② `DSH_AUTH_MUX_PROXY=0` 的排障退避（退避后跨用户泄漏会重现）。
      if (process.env.DSH_AUTH_MUX_PROXY === '0' || isOwnMuxProxyRequest(req)) { forward(req, socket, head); return }
```

**依据 2 · 源码核查**：[src/index.ts:2899-2929](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/src/index.ts#L2899-L2929)

强宿主耦合和闭锁影响可用性。

<details>
<summary>查看原文（31行）</summary>

```text
    const origReq = server.listeners('request') as ((req: IncomingMessage, res: ServerResponse) => void)[]
    const origUp = server.listeners('upgrade') as ((req: IncomingMessage, socket: Duplex, head: Buffer) => void)[]
    // ============ 宿主线别硬前置（v0.7.0：仅支持 DSH 0.2.0-rc.2 线） ============
    // 旧传输线（0.1.1-rc.2 的 dotted `/api/<a>.<b>` 与 apiProxy 事件流）已在 v0.7.0 移除。
    // 缺少现代网关所需的 `connection.authorizeIndex` 时认证网关无法建立：此时移除宿主监听器
    // 并改为**明确拒绝**，而不是放行——宁可面板不可访问，也不能无门暴露。
    const hostAuthorizeIndex = ctx.get('connection')?.authorizeIndex
    if (typeof hostAuthorizeIndex !== 'function') {
      console.error('[dsh-ui-auth] 不支持的 DSH 宿主：未提供 connection.authorizeIndex。'
        + ' v0.7.0 起仅支持 DSH 0.2.0-rc.2 传输线（legacy 0.1.1-rc.2 支持已移除）。'
        + ' 认证网关已 fail-closed：面板将不可访问，请升级 DSH 后重启。')
      server.removeAllListeners('request')
      server.removeAllListeners('upgrade')
      const denyRequest = (_req: IncomingMessage, res: ServerResponse): void => {
        try {
          res.writeHead(503, { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' })
          res.end('dsh-ui-auth: 不支持的 DSH 版本（需要 0.2.0-rc.2 传输线）。认证网关已 fail-closed，面板不可访问。')
        } catch (err) { try { res.destroy() } catch (e) { /* ignore */ } }
      }
      const denyUpgrade = (_req: IncomingMessage, socket: Duplex): void => {
        try { socket.destroy() } catch (e) { /* ignore */ }
      }
      server.on('request', denyRequest)
      server.on('upgrade', denyUpgrade)
      ctx.effect(() => () => {
        server.removeListener('request', denyRequest)
        server.removeListener('upgrade', denyUpgrade)
        for (const fn of origReq) server.on('request', fn)
        for (const fn of origUp) server.on('upgrade', fn)
      }, 'dsh-ui-auth: 不支持宿主时的 fail-closed 监听器')
      return
```

</details>

**依据 3 · 源码核查**：[test/modern-policy.test.mjs:10-30](https://github.com/0QwQ0/dsh-ui-auth/blob/6c5e87b44be4e973b092910968001916bb97d22e/test/modern-policy.test.mjs#L10-L30)

必要授权反例的源码依据。

<details>
<summary>查看原文（21行）</summary>

```text
test('current unary and logical-stream session access uses the nested request', async () => {
  for (const method of ['prompt', 'attachment', 'cancel', 'fork']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'a' })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ sessionId: 'b' })), false)
  }
  for (const method of ['page', 'follow']) {
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'a' } })), true)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'session', sessionId: 'b' } })), false)
    assert.equal(await policy.authorize(alice, `session/${method}`, request({ address: { kind: 'subagent', parentSessionId: 'b', childSessionId: 'a' } })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/page', { sessionId: 'a' }), false)
  // 0.1.5: session/follow is a stream endpoint; the same address check must hold with the stream flag.
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'a' } }), true), true)
  assert.equal(await policy.authorize(alice, 'session/follow', request({ address: { kind: 'session', sessionId: 'b' } }), true), false)
})

test('unreviewed endpoints, global settings and arbitrary paths are refused', async () => {
  for (const method of ['session/futureRead', 'settings/update', 'credentials/set', 'workspace/create', 'commands/execute', 'reports/runs']) {
    assert.equal(await policy.authorize(alice, method, request({ sessionId: 'a' })), false)
  }
  assert.equal(await policy.authorize(alice, 'session/create', request({ workspaceId: 'wa', cwd: '/bob' })), false)
```

</details>

#### 缺口

- 目标宿主完整端点/帧与状态恢复闭包仍待核查。
  **影响**：阻碍当前升级为可控多用户试用。
  **进一步探讨**：先按固定版本完成可达面映射，形成明确拒绝和恢复条件后再判断试用范围。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
