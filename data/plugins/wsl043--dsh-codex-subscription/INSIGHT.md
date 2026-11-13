# dsh-codex-subscription

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[03f3170](https://github.com/WSL043/dsh-codex-subscription/tree/03f3170dfca10f12499f4a0e43d6b62b4dc44b68)

<!-- BEGIN META -->
[![GitHub ★ 448](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=448&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/WSL043/dsh-codex-subscription) [![npm 30d 37,894](https://img.shields.io/static/v1?label=npm+30d&message=37%2C894&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription) [![最新发布 2026-11-11](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-11-11&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-codex-subscription)
<!-- END META -->

> **功能**：在 DeepSeek Harness 中接入 ChatGPT 订阅模型、额度和可选连接器。

> **亮点**：[Q01](#research-q01) 固定版本把订阅模型适配和账号接入原 DSH 会话，[Q02](#research-q02) 显示账号库能在非活跃额度读取时将按 ID 的令牌更新和当前选择分开，主 provider 仍跟随当前账号。

> **主要限制**：[Q03](#research-q03) 远端工具注解决定读写分支，write 跳过逐次批准；手机桥可经宿主修改权限预设。开启这些可选能力前需要独立验证。[Q02](#research-q02) 活跃额度仍复用共享 reader，切换后的额度行归属需要独立对账。

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
  - [Q01 · DSH 如何接到订阅模型，出现目录刷新失败时能从源码确认什么？](#detail-section-11)
  - [Q02 · 账号选择和刷新如何避开把旧 token 写入另一账号？](#detail-section-12)
  - [Q03 · 在连接器和手机桥内，用户可见的模式限制对应哪些实际路径？](#detail-section-13)
  - [Q04 · 单模型试用需要哪些前置，账号归属回执值得验证吗？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有适用账号的 DSH 用户希望在原会话调用订阅模型并检查工具回执。

直接在独立客户端运行对应模型，再将任务或输出移回 DSH。订阅资格与推理能力由上游提供。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 订阅适配 | 在原会话请求模型 | 依赖实际账号权益 |
| 连接器 | 查询或调用已连接工具 | 按注解和配置区分读写 |
| 手机桥 | 传递会话和审批事件 | 可更改会话权限预设 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 Node、DSH 与凭据服务 | 必需 | 装配与登录 | 回独立客户端 |
| 已授权账号与网络 | 请求需要 | 获取模型及结果 | 核对当前账号与服务回执 |
| 宿主批准服务 | ask 写操作需要 | 逐次确认 | 缺失时拒绝执行 |

| 步骤 | 谁操作 | 操作与结果 | 失败处理 |
| --- | --- | --- | --- |
| 准备 | 用户 | 隔离 profile，关闭连接器和远控 | 无法隔离则停止 |
| 核对 | 用户 | 固定模型发出一个可验收任务 | 核对实际账号及目录 |
| 退出 | 用户 | 禁用并核查测试凭据 | 回独立客户端 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 兼容宿主及账号资源 | 准备 profile、核版本 | 权益未知 |
| 持续 | 模型额度与网络 | 核对目录与权限 | 单位合格任务成本未测 |
| 恢复 | 重试资源未知 | 对照凭据与远端回执 | 不能凭超时重复写 |
| 退出 | 测试凭据残留未知 | 检查宿主存储及外部连接 | 未运行退出验证 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型路由 | 宿主适配器注册 | 同账号真实可用性 |
| 连接器 | 设置与批准判断 | 远端只读注解准确性 |
| 远控 | 会话和审批接线 | 真实权限边界 |

> **思考**：[Q03](#research-q03) 远端工具注解决定读写分支，write 跳过逐次批准；手机桥可经宿主修改权限预设。开启这些可选能力前需要独立验证。[Q02](#research-q02) 活跃额度仍复用共享 reader，切换后的额度行归属需要独立对账。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 固定版本把订阅模型适配和账号接入原 DSH 会话，[Q02](#research-q02) 显示账号库能在非活跃额度读取时将按 ID 的令牌更新和当前选择分开，主 provider 仍跟随当前账号。

[Q02](#research-q02) 同实例队列和非活跃额度按 ID 修改提供明确范围，活跃额度行要复核切换竞争；[Q03](#research-q03) 宿主批准输入有展示裁剪，外部调用仍使用原参数。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 远端工具注解决定读写分支，write 跳过逐次批准；手机桥可经宿主修改权限预设。开启这些可选能力前需要独立验证。[Q02](#research-q02) 活跃额度仍复用共享 reader，切换后的额度行归属需要独立对账。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 用隔离 profile 单模型调用对照独立客户端。仅在能核实账号、模型和回执后继续，可选连接器与手机控制保持关闭。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定源码确认订阅适配注册、账号库和连接器分支。实际服务权益、运行兼容和跨进程凭据一致性待核。账号代次回执是研究假设。

- 已检查：作者 README、包清单、源码路径 README.md、cordis.patch.yml、package.json、src/account-usage.js、src/account-vault.js、src/connectors.js、src/credential-store.js、src/index.js、src/remote-control-dsh.js、src/subagent-auth.js、src/subscription-credentials.js、src/subscription-rpc.js、tsdown.config.mjs 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：抽读账号库、目录注册、连接器批准及手机权限映射，图片、语音和独立子任务不纳入采用判断。未运行宿主、服务或测试。
- 下一步：隔离 profile 先做单模型请求，再用替身对照晚到刷新及连接器权限。仅在具备对应授权后验证真实账号。

**分析版本**

- **仓库**：[WSL043/dsh-codex-subscription](https://github.com/WSL043/dsh-codex-subscription)
- **版本号**：3.2.14（[固定提交 03f3170](https://github.com/WSL043/dsh-codex-subscription/tree/03f3170dfca10f12499f4a0e43d6b62b4dc44b68)）
- **版本日期**：2026-11-12（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q04](#research-q04) 探索将模型回执绑定到经确认的账号代次，以晚到回复对照归属误判和等待时间。该方案仍待验证。

隔离 profile 先做单模型请求，再用替身对照晚到刷新及连接器权限。仅在具备对应授权后验证真实账号。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 32 | 2239 | 1983 | 145 | — |
| .md | source | 64 | 7458 | — | — | 115510 |
| .js | source | 186 | 75113 | 71348 | 4393 | — |
| .jsx | source | 47 | 6573 | 6291 | 116 | — |
| .mjs | test | 177 | 26033 | 23982 | 541 | — |
| .jsx | test | 1 | 234 | 229 | 2 | — |
| .md | example | 1 | 12 | — | — | 106 |
| .mjs | example | 1 | 96 | 88 | 3 | — |
| .md | test | 1 | 22 | — | — | 313 |

</details>

**活跃度**

[![Issue 未关闭 1](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=1&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 51](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=51&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+created%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z) [![近30天关闭 52](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=52&color=737b86&logo=github)](https://github.com/WSL043/dsh-codex-subscription/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-14T07%3A23%3A12.079Z..2026-11-13T07%3A23%3A12.079Z)



统计日期：2026-11-13。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：已有适用账号的用户如何在 DSH 中选择并调用订阅模型，账号、连接器与远控状态中哪些边界会改变采用判断？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · DSH 如何接到订阅模型，出现目录刷新失败时能从源码确认什么？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

插件让用户在原 DSH 会话使用订阅模型，避免把任务再交给独立客户端。补丁从包名载入宿主模块，构建入口映射到 src/index.js。apply 使用宿主 credentials 建立账号库和凭据存储，包装上游 provider；最后向 ctx.llm 注册经过重试、推理、上下文整理和目录准备包装的适配器。目录刷新异步启动，出错只在存活期间打 debug，卸载时取消并释放注册。注册动作能说明模型机制进入宿主，目录实际内容和权益仍需账号返回。作者另称官方桌面端经过实机验证，本轮没有复用为研究者的运行结论。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:29-44](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/package.json#L29-L44)

清单绑定 Cordis 补丁和 Web 注入。

<details>
<summary>查看原文（16行）</summary>

```text
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-api-remotes",
        "@deepseek-ai/dsh-client-connection",
        "@deepseek-ai/dsh-client-locale",
        "@deepseek-ai/dsh-client-ui-conversation",
        "@deepseek-ai/dsh-client-ui-model-selection",
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-ui-tool"
      ],
      "platform": "web"
    }
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:4-6](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/cordis.patch.yml#L4-L6)

补丁按包名挂载。

```text
- insert:
    - id: codex-subscription
      name: 'dsh-codex-subscription'
```

**依据 3 · 源码核查**：[tsdown.config.mjs:158-167](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/tsdown.config.mjs#L158-L167)

入口映射明确。

<details>
<summary>查看原文（10行）</summary>

```text
export default defineConfig([
  {
    name: id,
    entry: { index: 'src/index.js' },
    outDir: 'lib', format: ['esm'], platform: 'node', target: 'es2024',
    fixedExtension: false, dts: false, clean: true,
    deps: { neverBundle: hostExternal },
  },
  clientBundle('src/client.jsx', 'client.js', false),
  ...clientFeatures.map(feature => clientBundle(feature.entry, feature.fileName, true)),
```

</details>

**依据 4 · 源码核查**：[src/index.js:155-175](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L155-L175)

凭据库、存储与上游 provider 接入。

<details>
<summary>查看原文（21行）</summary>

```text
export function apply(ctx, config = {}) {
  const settings = createSettingsAdapter(ctx, config)
  const searchProvider = createSearchProviderSwitcher(ctx.loader)
  if (!process.env.NODE_TEST_CONTEXT) diagnosticLog.attach(dshHomePath('state', 'codex-subscription', 'diagnostic-log.jsonl'))
  diagnosticLog.info('plugin', `loaded ${PACKAGE_VERSION}`, `DSH ${hostDshVersion() ?? 'unknown'}, node ${process.version}, ${process.platform}`)
  setAuthFailureLogger((message, detail) => diagnosticLog.error('auth', message, detail))
  const network = createCodexNetworkTransport()
  const diagnosticOperations = createDiagnosticOperations()
  ctx.effect(() => ctx.on?.('tools/result', (exec, result) => diagnosticOperations.tool(exec, result)), 'codex-subscription: operation evidence')
  const originalImages = new OriginalImageStore()
  const accountVault = new DshOAuthAccountVault(ctx.credentials, {
    key: ACCOUNT_VAULT_KEY,
    legacyRef: CREDENTIAL_REF,
    legacyRefs: [LEGACY_CREDENTIAL_REF],
  })
  const store = new DshOAuthCredentialStore(ctx.credentials, CREDENTIAL_REF, [LEGACY_CREDENTIAL_REF], {
    expirySkewMs: OAUTH_EXPIRY_SKEW_MS,
    vault: accountVault,
  })
  const baseProvider = openaiCodexProvider()
  let resolveAuth = async () => undefined
```

</details>

**依据 5 · 源码核查**：[src/index.js:501-514](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L501-L514)

注册后异步更新目录，并绑定卸载生命周期。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.effect(() => {
    const lifetime = new AbortController()
    const defaults = withDefaultReasoningEffort(ultra.wrapAdapter(observeAdapter(reasoning.wrapAdapter(compaction.wrapAdapter(provider.wrapRetryAdapter(adapter))), provider)), {
      preference: () => settings.get()[DEFAULT_REASONING_EFFORT_FIELD],
      modelDefault: id => modelCatalog.metadata(id)?.defaultReasoningEffort,
    })
    const readyAdapter = withModelCatalogReady(hiddenDirectory.wrap(defaults), modelCatalog, { signal: lifetime.signal })
    const disposeAdapter = ctx.llm.registerAdapter([PROVIDER], readyAdapter)
    // Defer credential work until the synchronous apply() has installed resolveAuth.
    void Promise.resolve().then(() => modelCatalog.refresh({ signal: lifetime.signal }))
      .catch(error => { if (!lifetime.signal.aborted) ctx.logger?.debug?.('could not refresh Codex model catalog (%s)', error?.code ?? error?.name ?? 'unknown error') })
    return () => {
      lifetime.abort()
      disposeAdapter?.()
```

</details>

**依据 6 · 作者声明**：[README.md:48-54](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/README.md#L48-L54)

作者的版本兼容与实机声明。

```text
## 准备 DSH

已验证兼容 DSH `0.2.2-rc.1`，继续支持 `0.2.1-rc.3` 和 `0.2.1-rc.2`，最低支持 `0.1.7-rc.2`；更早的 DSH 请先升级。

官方 DSH Desktop `0.2.2-rc.2` 已通过实机验证。

DSH `0.2.2-rc.1` 的 CLI/Web 模式需要 Node.js **24.9 或更高版本**；官方桌面版使用自带的运行时。
```

#### 缺口

- 未获得当前账号的模型目录与权益
  **影响**：无法判断可见模型是否实际可请求
  **进一步探讨**：隔离 profile 用已授权账号核对选择与请求回执

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 账号选择和刷新如何避开把旧 token 写入另一账号？

**研究主题**：工程质量与复用、依赖、兼容与流程

#### 完整回答

普通 provider 将同一个 store 传给 authModels，resolveAuth 走 getAuth；宿主凭据服务外的模型库内部刷新条件未复现。store.modify 的确走 modifyActive，按修改开始时 vault 的 activeId 读取并在同一修改回调更新对应条目。Vault 的 select 和 modifyActive 共用同实例队列，选 B 后新进入的刷新作用于 B，队列中已开始的 A 修改可以先完成后切换，不能把切换看作取消旧请求。独立子任务在初始读取后绑定 accountId，实际调用 store.modify 前后均核对，切换到另一个账号时拒绝而不拿错账号继续。所有账号额度页另有两条路线，非活跃账号走 readerFor(id)，其刷新写 modifyAccount(id)，不会改变 activeId；列表中当时活跃的账号却用 baseUsageReader，仍跟随共享 active store。该读取器比较两次取得的 access，最多再试一次，能避免将一个 token 与另一个账号 ID 拼接，但如果快照之后已切成 B，readAll 仍按最初 A 的 id 装入 usage，这一显示归属竞争尚未复现。选择后清理共享缓存也需要核对在途请求行为。宿主 modifyRecord 的多进程语义待验。凭据库提交后旧槽镜像可能失败，只报辅助故障，主记录仍权威。

#### 证据与依据

**依据 1 · 源码核查**：[src/index.js:335-340](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L335-L340)

普通 provider 的 authModels 绑定共享 store。

```text
  const authModels = createModels({ credentials: store })
  authModels.setProvider(provider)
  const profile = Object.freeze({
    provider: PROVIDER,
    displayName: 'ChatGPT subscription',
    piProvider: provider,
```

**依据 2 · 源码核查**：[src/index.js:375-382](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L375-L382)

resolveAuth 走 getAuth，独立子任务也取得共享 store。

```text
  resolveAuth = () => authModels.getAuth(PROVIDER)
  ctx.inject(['subagents', 'subprocess', 'sandboxPolicy'], scoped => {
    const instance = createSubscriptionSubagent({
      ctx: scoped, nativeHome: dshHomePath('state', 'codex-subscription', 'native-subagent'),
      resolveAuth, store,
      refresh: provider.auth.oauth.refresh,
      loadRuntime: () => loadSubagentRuntime({ cli: subagentCli }),
      maintenance: runtimeManagement.blocked,
```

**依据 3 · 源码核查**：[src/credential-store.js:113-124](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/credential-store.js#L113-L124)

实际 store.modify 委派 vault.modifyActive。

<details>
<summary>查看原文（12行）</summary>

```text
  modify(providerId, update, options) {
    return this.#enqueue(providerId, async () => {
      if (this.vault !== undefined) {
        const next = await this.vault.modifyActive(async current => {
          const visible = current === undefined || this.expirySkewMs === 0
            ? current
            : { ...current, expires: current.expires - this.expirySkewMs }
          const updated = await update(clone(visible))
          return updated === undefined ? undefined : assertOAuthCredential(updated)
        })
        abortIfNeeded(options)
        return clone(next)
```

</details>

**依据 4 · 源码核查**：[src/account-vault.js:167-170](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-vault.js#L167-L170)

账号选择和修改共用 vault 实例队列。

```text
  #enqueue(operation) {
    const current = this.#tail.catch(() => undefined).then(operation)
    this.#tail = current.catch(() => undefined)
    return current
```

**依据 5 · 源码核查**：[src/account-vault.js:255-275](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-vault.js#L255-L275)

按 ID 更新，不改变 activeId。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Update one account's credential (a token refresh) without changing which account is active. */
  modifyAccount(id, update) {
    return this.#enqueue(async () => {
      let result
      await this.#modifyPayload(async current => {
        const index = current.accounts.findIndex(account => account.id === id)
        if (index < 0) throw new Error('Unknown Codex account')
        const previous = clone(current.accounts[index].credential)
        const next = await update(previous)
        if (next === undefined) {
          result = previous
          return current
        }
        const credential = sanitizeOAuthCredential(next)
        if (credential.email === undefined && previous.email !== undefined) credential.email = previous.email
        const accounts = [...current.accounts]
        accounts[index] = { ...accounts[index], credential }
        result = clone(credential)
        return { ...current, accounts }
      })
      return result
```

</details>

**依据 6 · 源码核查**：[src/account-vault.js:318-352](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-vault.js#L318-L352)

选择改 activeId，当前账号修改按当时 activeId。

<details>
<summary>查看原文（35行）</summary>

```text
  select(id) {
    return this.#enqueue(async () => {
      await this.#modifyPayload(current => {
        if (!current.accounts.some(account => account.id === id)) throw new Error('Unknown Codex account')
        return { ...current, activeId: id }
      })
    })
  }

  modifyActive(update) {
    return this.#enqueue(async () => {
      const existing = await this.#ensurePayload()
      if (existing === undefined) {
        const initial = await update(undefined)
        if (initial === undefined) return undefined
        const credential = sanitizeOAuthCredential(initial)
        await this.credentials.set(this.legacyRef, JSON.stringify(credential))
        await this.#ensurePayload()
        return clone(credential)
      }
      let result
      await this.#modifyPayload(async current => {
        const index = current.accounts.findIndex(account => account.id === current.activeId)
        const previous = clone(current.accounts[index].credential)
        const next = await update(previous)
        if (next === undefined) {
          result = previous
          return current
        }
        const credential = sanitizeOAuthCredential(next)
        if (credential.email === undefined && previous.email !== undefined) credential.email = previous.email
        const accounts = [...current.accounts]
        accounts[index] = { ...accounts[index], credential }
        result = clone(credential)
        return { ...current, accounts }
```

</details>

**依据 7 · 源码核查**：[src/account-vault.js:200-221](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-vault.js#L200-L221)

修改委派宿主记录，旧槽镜像单独处理。

<details>
<summary>查看原文（22行）</summary>

```text
  async #modifyPayload(update) {
    await this.#ensurePayload()
    let previousLegacy
    const nextRecord = await this.credentials.modifyRecord(this.key, async current => {
      if (current === undefined) throw new Error('Codex account vault is not signed in')
      const payload = assertVaultRecord(current)
      previousLegacy = payload.accounts.find(account => account.id === payload.legacyAccountId)?.credential
      const next = await update(clone(payload))
      return grant(next)
    })
    const payload = assertVaultRecord(nextRecord)
    const legacy = payload.accounts.find(account => account.id === payload.legacyAccountId)?.credential
    try {
      if (legacy === undefined) {
        if (previousLegacy !== undefined) await this.credentials.unset(this.legacyRef)
      } else if (JSON.stringify(legacy) !== JSON.stringify(previousLegacy)) {
        await this.credentials.set(this.legacyRef, JSON.stringify(legacy))
      }
    } catch {
      // The atomic grant record is authoritative. A read-only legacy source may
      // prevent rollback mirroring, but must not make a committed switch look failed.
      this.onLegacySyncFailure()
```

</details>

**依据 8 · 源码核查**：[src/subagent-auth.js:14-38](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/subagent-auth.js#L14-L38)

独立子任务固定初始账号，刷新前后不匹配则拒绝。

<details>
<summary>查看原文（25行）</summary>

```text
export async function createSubagentTokens({ resolveAuth, store, refresh, signal }) {
  signal.throwIfAborted()
  await resolveAuth()
  const initial = await store.read('openai-codex', { signal })
  if (initial?.type !== 'oauth' || !initial.accountId || !initial.access) throw new Error(AUTH_ERROR)
  const accountId = initial.accountId
  let access = initial.access
  return async (previousAccountId, forceRefresh = false) => {
    signal.throwIfAborted()
    if (previousAccountId !== undefined && previousAccountId !== accountId) throw new Error(AUTH_ERROR)
    let credential
    if (previousAccountId !== undefined || forceRefresh) {
      const rejectedAccess = access
      credential = await store.modify('openai-codex', async current => {
        if (current?.accountId !== accountId) throw new Error(AUTH_ERROR)
        if (current.access !== rejectedAccess) return current
        const next = await refresh(current)
        if (next?.accountId !== accountId) throw new Error(AUTH_ERROR)
        return next
      }, { signal })
    } else credential = await store.read('openai-codex', { signal })
    signal.throwIfAborted()
    if (credential?.accountId !== accountId || !credential.access) throw new Error(AUTH_ERROR)
    access = credential.access
    return { accessToken: access, chatgptAccountId: accountId }
```

</details>

**依据 9 · 源码核查**：[src/index.js:714-718](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L714-L718)

活跃额度 reader 使用共享 resolveAuth 和 store。

```text
  const baseUsageReader = createCodexUsageReader({
    getAuth: resolveAuth,
    readCredential: options => store.read(PROVIDER, options),
    fetch: (input, init) => network.fetch('quota', input, init),
  })
```

**依据 10 · 源码核查**：[src/index.js:801-811](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L801-L811)

所有账号读取器接入 per-account models 与 activeReader。

<details>
<summary>查看原文（11行）</summary>

```text
  const accountUsageReader = createAccountUsageReader({
    vault: accountVault,
    createModels: credentials => {
      const accountModels = createModels({ credentials })
      accountModels.setProvider(provider)
      return accountModels
    },
    fetch: (input, init) => network.fetch('quota', input, init),
    expirySkewMs: OAUTH_EXPIRY_SKEW_MS,
    activeReader: baseUsageReader,
  })
```

</details>

**依据 11 · 源码核查**：[src/account-usage.js:14-28](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-usage.js#L14-L28)

按 ID 的独立 store 实际调用 modifyAccount。

<details>
<summary>查看原文（15行）</summary>

```text
/** pi-ai's OAuth credential store, bound to one account of the vault. */
export function accountCredentialStore(vault, id, expirySkewMs = 0) {
  const shift = credential => credential === undefined || expirySkewMs === 0 ? credential : { ...credential, expires: credential.expires - expirySkewMs }
  return {
    async read(providerId) {
      assertProvider(providerId)
      return shift(await vault.readAccount(id))
    },
    async list() {
      return (await vault.readAccount(id)) === undefined ? [] : [{ providerId: PROVIDER, type: 'oauth' }]
    },
    async modify(providerId, update) {
      assertProvider(providerId)
      return vault.modifyAccount(id, async current => update(shift(current)))
    },
```

</details>

**依据 12 · 源码核查**：[src/account-usage.js:43-51](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-usage.js#L43-L51)

readerFor(id) 同时按 ID 绑定 auth 和凭据读取。

```text
  const readerFor = id => {
    let reader = readers.get(id)
    if (reader === undefined) {
      const models = createModels(accountCredentialStore(vault, id, expirySkewMs))
      reader = createCodexUsageReader({
        getAuth: () => models.getAuth(PROVIDER),
        readCredential: () => vault.readAccount(id).then(credential => credential),
        fetch,
        now,
```

**依据 13 · 源码核查**：[src/account-usage.js:65-84](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-usage.js#L65-L84)

readAll 用列表快照标注账号 ID，旧 active 条目用共享 reader。

<details>
<summary>查看原文（20行）</summary>

```text
  return Object.freeze({
    /** One entry per account: its usage reading, or the reason it could not be read. */
    async readAll({ force = false, signal } = {}) {
      const accounts = await vault.list()
      for (const id of [...readers.keys()]) if (!accounts.some(account => account.id === id)) readers.delete(id)
      const entries = new Array(accounts.length)
      let next = 0
      const worker = async () => {
        while (next < accounts.length) {
          const index = next++
          const account = accounts[index]
          try {
            const reader = account.active && activeReader !== undefined ? activeReader : readerFor(account.id)
            entries[index] = { id: account.id, usage: await reader.read({ force, signal }) }
          } catch (error) {
            entries[index] = { id: account.id, error: summarize(error, signal) }
          }
        }
      }
      await Promise.all(Array.from({ length: Math.min(MAX_PARALLEL, accounts.length) }, worker))
```

</details>

**依据 14 · 源码核查**：[src/subscription-credentials.js:10-22](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/subscription-credentials.js#L10-L22)

读取时核对 token 是否与同一份凭据匹配。

<details>
<summary>查看原文（13行）</summary>

```text
// Refresh first, then take token and account ID from the same vault snapshot.
// A switch between the awaits must never combine two different accounts.
export async function readSubscriptionCredentials(getAuth, readCredential, signal) {
  for (let attempt = 0; attempt < 2; attempt++) {
    const auth = await getAuth({ signal })
    signal?.throwIfAborted()
    if (typeof auth?.auth?.apiKey !== 'string' || !auth.auth.apiKey) break
    const credential = await readCredential({ signal })
    signal?.throwIfAborted()
    if (credential?.type !== 'oauth') break
    if (credential.access === auth.auth.apiKey) return { access: credential.access, accountId: credential.accountId }
  }
  return { access: undefined, accountId: undefined }
```

</details>

**依据 15 · 源码核查**：[src/subscription-rpc.js:375-385](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/subscription-rpc.js#L375-L385)

选择提交后才清理缓存及连接，辅助错误独立。

<details>
<summary>查看原文（11行）</summary>

```text
    const result = await authHandler(endpoint, payload, signal)
    if (result.ok === true && (endpoint === 'logout' || endpoint === 'account/select' || endpoint === 'account/remove'
      || (endpoint === 'login/status' && result.value?.authenticated === true))) {
      // The account transaction has committed. Auxiliary cache failures must not
      // misreport that transaction or prevent the remaining invalidations.
      const tasks = [() => closeConnections?.(), () => usageReader.clearCache(), () => planHistoryReader?.clear(), () => usageProfileReader?.clear(),
        () => resetCreditService.clear(), () => modelCatalog?.clear(), () => onAccountChanged?.()]
      if (endpoint === 'logout') tasks.push(() => usageReader.clear(), () => accountUsageReader?.clear())
      if (endpoint === 'login/status') tasks.push(() => accountUsageReader?.clear())
      if (endpoint === 'account/remove' && typeof payload?.id === 'string') tasks.push(() => usageReader.clearScope(payload.id))
      const outcomes = await Promise.allSettled(tasks.map(task => Promise.resolve().then(task)))
```

</details>

#### 缺口

- 未运行跨进程与切换时活跃额度请求
  **影响**：待确认 A 行能否显示 B 额度以及已发请求是否继续
  **进一步探讨**：在读取账号清单后挂起活跃额度请求，切 B，再比对行 ID、请求账号头、凭据落点和结果；分别验证非活跃额度及子任务刷新

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 在连接器和手机桥内，用户可见的模式限制对应哪些实际路径？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

插件从工具目录的 readOnlyHint 推断只读。read 拒绝未标只读的操作；ask 请求宿主 approval，只有 allowed-once 后发送；write 跳过这段批准。显示给审批人的参数字符串最多 400 字符，执行仍传完整 input。手机桥另接管审批和会话事件，能将某些手机请求的 sandbox 名称映射为 DSH 会话的 workspace-write 或 danger-full-access。手机显示的配置应对照宿主实际权限，连接器模式和手机权限是两条不同的边界。

#### 证据与依据

**依据 1 · 源码核查**：[src/connectors.js:25-36](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/connectors.js#L25-L36)

远端工具注解决定 readOnly。

<details>
<summary>查看原文（12行）</summary>

```text
  if (!record(result) || !Array.isArray(result.tools)) throw new Error('ChatGPT returned a malformed connector list')
  const tools = []
  for (const raw of result.tools) {
    if (!record(raw) || typeof raw.name !== 'string' || raw.name.length === 0 || raw.name.length > 128) continue
    if (BLOCKED_PREFIXES.some(prefix => raw.name.startsWith(prefix))) continue
    const meta = record(raw._meta) ? raw._meta : {}
    tools.push({
      name: raw.name,
      connector: clip(oneLine(meta.connector_name) || raw.name.split('.')[0], 80),
      description: clip(oneLine(raw.description), 600),
      readOnly: record(raw.annotations) && raw.annotations.readOnlyHint === true,
      inputSchema: record(raw.inputSchema) ? raw.inputSchema : { type: 'object' },
```

</details>

**依据 2 · 源码核查**：[src/connectors.js:220-235](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/connectors.js#L220-L235)

执行前分支判断，摘要裁剪而调用参数完整。

<details>
<summary>查看原文（16行）</summary>

```text
    async execute(args, exec) {
      guard()
      const mode = getMode()
      if (mode !== 'read' && mode !== 'ask' && mode !== 'write') throw new Error('ChatGPT connectors are turned off in the plugin settings')
      const tool = await find(args.name, exec.signal)
      const input = record(args.arguments) ? args.arguments : {}
      if (!tool.readOnly && mode !== 'write') {
        if (mode !== 'ask') throw new Error(`${tool.name} changes data and connectors are set to read-only; ask the user to allow writes in the plugin settings`)
        const approval = getApproval?.()
        if (typeof approval?.request !== 'function') throw new Error('DSH approval is unavailable in this session. The connector did not write.')
        const outcome = await approval.request({ agent: exec.agent, toolName: tool.name, callId: exec.callId, reason: `${tool.connector}: ${clip(oneLine(tool.description), 160)} Arguments: ${clip(JSON.stringify(input), 400)}`, signal: exec.signal })
        if (outcome === 'cancelled') throw new Error('DSH cancelled the approval request. The connector did not write.')
        if (outcome === 'unavailable') throw new Error('DSH approval is unavailable in this session. The connector did not write.')
        if (outcome !== 'allowed-once') throw new Error('DSH did not grant approval. If no prompt appeared, check the current session’s permissions in the composer or with /permission. The connector did not write.')
      }
      return resultOf(await client.callTool(tool.name, input, exec.signal))
```

</details>

**依据 3 · 源码核查**：[src/index.js:681-704](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L681-L704)

远控对象、会话、审批及启用条件接线。

<details>
<summary>查看原文（24行）</summary>

```text
  ctx.effect(() => () => remoteBridge.close())
  const remoteControl = createRemoteControl({
    credentials: signal => readSubscriptionCredentials(resolveAuth, options => store.read(PROVIDER, { ...options, signal }), signal),
    WebSocket,
    fetch: (input, init) => network.fetch('remote', input, init),
    stateFile: dshHomePath('state', 'codex-subscription', 'remote-control.json'),
    debugFile: dshHomePath('state', 'codex-subscription', 'remote-debug.jsonl'),
    hostName: `DSH (${hostname()})`,
    userAgent: USER_AGENT,
    // Only for acceptance runs against a local stand-in relay; anything but chatgpt.com or a loopback address is refused.
    base: process.env.DSH_CODEX_REMOTE_BASE || undefined,
    methods: remoteBridge.methods,
    onActive: (_client, notify) => remoteBridge.adopt(notify),
    onClose: (_client, notify) => remoteBridge.forget(notify),
  })
  ctx.on('agent/assistant-stream', ({ agent, frame }) => { try { remoteBridge.onStream(agent?.session, frame) } catch { /* the phone view must never disturb the session */ } })
  ctx.on('session/event', (session, event) => { try { remoteBridge.onSessionEvent(session, event) } catch { /* the phone view must never disturb the session */ } })
  // Prepended: the DSH window answers these too and would otherwise claim them before the phone sees them.
  ctx.on('approval/request', (request, next) => { try { return remoteBridge.onApproval(request, next) } catch { return next() } }, true)
  ctx.on('user-questions/request', (request, next) => { try { return remoteBridge.onQuestion(request, next) } catch { return next() } }, true)
  ctx.effect(() => {
    // Remote Control stays off until the user switches it on; then it follows the setting.
    let wanted = false
    const follow = value => {
```

</details>

**依据 4 · 源码核查**：[src/remote-control-dsh.js:634-644](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/remote-control-dsh.js#L634-L644)

手机参数能经宿主 permissions.set 改会话预设。

<details>
<summary>查看原文（11行）</summary>

```text
  // DSH permission presets <-> Codex sandbox/approval: workspace-write and full access.
  const presetOf = session => { try { return permissions()?.current?.(session) } catch { return undefined } }
  const sandboxFor = (preset, cwd) => preset === 'danger-full-access' || preset === 'auto'
    ? { type: 'dangerFullAccess' }
    : { type: 'workspaceWrite', writableRoots: cwd ? [cwd] : [], networkAccess: false, excludeTmpdirEnvVar: false, excludeSlashTmp: false }
  const applyPermissions = (agent, params) => {
    const type = params?.sandboxPolicy?.type ?? (typeof params?.sandbox === 'string' ? params.sandbox : undefined)
    const preset = type === 'dangerFullAccess' || type === 'danger-full-access' ? 'danger-full-access'
      : type === 'workspaceWrite' || type === 'workspace-write' ? 'workspace-write' : undefined
    if (!preset || !agent?.session || presetOf(agent.session) === preset) return
    permissions()?.set?.(agent.session, preset)
```

</details>

#### 缺口

- 外部工具注解语义与手机实际权限映射未验证
  **影响**：不能判断是否能完全阻止意外写入
  **进一步探讨**：用替身 RPC 注入错标工具与两种 sandbox 参数，对比真实调用及宿主权限

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 单模型试用需要哪些前置，账号归属回执值得验证吗？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

先限定到独立 profile 的单一会话和模型请求，关闭连接器、手机配对和可选子任务。参照为独立客户端执行同一任务再人工回填结果。首次额外准备兼容宿主和账号，持续要核查目录、权限与额度，失败时核对当前账号和服务回执；现金与人工时间分别计量，现无单位合格任务收益。可试在模型回执上显示经确认的账号代次，在模拟账号切换与晚到回复时比较归属误判与等待开销。若现有账号提示已等价，或误判不降且维护成本增加，放弃方案。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:84-100](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/package.json#L84-L100)

明确 Node、DSH 与服务版本范围。

<details>
<summary>查看原文（17行）</summary>

```text
  "engines": {
    "node": "^22.19.0 || >=24.0.0",
    "dsh": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0"
  },
  "peerDependencies": {
    "@deepseek-ai/cordis": "4.0.4 || 4.0.5-alpha.1 || 4.0.5-alpha.2 || 4.0.5 || 4.0.6-alpha.1 || 4.0.6-alpha.2 || 4.1.0",
    "@deepseek-ai/dsh-api-remotes": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-connection": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-locale": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-conversation": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-model-selection": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-settings": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-slots": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-client-ui-tool": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-credentials": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-llm": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
    "@deepseek-ai/dsh-llm-pi-ai": "0.1.7-rc.2 || 0.2.0-rc.1 || 0.2.0-rc.2 || 0.2.1-alpha.1 || 0.2.1-alpha.2 || 0.2.1-alpha.3 || 0.2.1-alpha.4 || 0.2.1-alpha.5 || 0.2.1-rc.1 || 0.2.1-rc.2 || 0.2.1-rc.3 || 0.2.1-rc.4 || 0.2.1-rc.5 || 0.2.2-alpha.2 || 0.2.2-alpha.3 || >=0.2.2-rc.1 <0.2.3-0",
```

</details>

**依据 2 · 源码核查**：[src/account-vault.js:255-275](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/account-vault.js#L255-L275)

按账号更新提供可比较的归属信息。

<details>
<summary>查看原文（21行）</summary>

```text
  /** Update one account's credential (a token refresh) without changing which account is active. */
  modifyAccount(id, update) {
    return this.#enqueue(async () => {
      let result
      await this.#modifyPayload(async current => {
        const index = current.accounts.findIndex(account => account.id === id)
        if (index < 0) throw new Error('Unknown Codex account')
        const previous = clone(current.accounts[index].credential)
        const next = await update(previous)
        if (next === undefined) {
          result = previous
          return current
        }
        const credential = sanitizeOAuthCredential(next)
        if (credential.email === undefined && previous.email !== undefined) credential.email = previous.email
        const accounts = [...current.accounts]
        accounts[index] = { ...accounts[index], credential }
        result = clone(credential)
        return { ...current, accounts }
      })
      return result
```

</details>

**依据 3 · 源码核查**：[src/index.js:501-514](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/src/index.js#L501-L514)

用注册和目录刷新作为最小调用观测点。

<details>
<summary>查看原文（14行）</summary>

```text
  ctx.effect(() => {
    const lifetime = new AbortController()
    const defaults = withDefaultReasoningEffort(ultra.wrapAdapter(observeAdapter(reasoning.wrapAdapter(compaction.wrapAdapter(provider.wrapRetryAdapter(adapter))), provider)), {
      preference: () => settings.get()[DEFAULT_REASONING_EFFORT_FIELD],
      modelDefault: id => modelCatalog.metadata(id)?.defaultReasoningEffort,
    })
    const readyAdapter = withModelCatalogReady(hiddenDirectory.wrap(defaults), modelCatalog, { signal: lifetime.signal })
    const disposeAdapter = ctx.llm.registerAdapter([PROVIDER], readyAdapter)
    // Defer credential work until the synchronous apply() has installed resolveAuth.
    void Promise.resolve().then(() => modelCatalog.refresh({ signal: lifetime.signal }))
      .catch(error => { if (!lifetime.signal.aborted) ctx.logger?.debug?.('could not refresh Codex model catalog (%s)', error?.code ?? error?.name ?? 'unknown error') })
    return () => {
      lifetime.abort()
      disposeAdapter?.()
```

</details>

**依据 4 · 作者声明**：[README.md:32-42](https://github.com/WSL043/dsh-codex-subscription/blob/03f3170dfca10f12499f4a0e43d6b62b4dc44b68/README.md#L32-L42)

账号返回决定模型与额度；可选连接器和远控由用户控制。

<details>
<summary>查看原文（11行）</summary>

```text
| **在手机上继续操作** | 用 ChatGPT 手机 App 配对电脑上的 DSH，DeepSeek 等其他模型也能用。[Beta，默认关闭 →](#手机远程控制beta) |
| **使用已连接的应用** | 让 DSH 模型使用 ChatGPT 中已连接的 GitHub、Gmail、云端硬盘、日历等；写操作默认逐次询问。 |

模型和额度以账号实际返回为准。[查看完整功能清单 →](#全部功能)

<details>
<summary>让 DeepSeek 等模型使用订阅能力</summary>

让 DeepSeek 等任意 DSH 模型使用你在 ChatGPT 里连接的应用：GitHub、Gmail、Google 云端硬盘、日历等。模型先搜索再调用，写入审批取决于所选模式和当前 DSH 会话权限。默认关闭，在“联网与工具”里开启。

联网搜索与网页读取来源、ChatGPT 连接器和官方 Codex 独立子任务在 **设置 → Codex 订阅 → 联网与工具**，页首一个总开关：关闭后，用 DeepSeek 等非 Codex 模型对话时不再使用订阅的联网搜索（改用 DSH 搜索）、图片生成和 ChatGPT 连接器，Codex 订阅模型不受影响。默认开启。
```

</details>

#### 缺口

- 服务权益、计费与真实退出行为未知
  **影响**：无法作常用环境成本承诺
  **进一步探讨**：在已授权账号下记录一个可接受结果的费用、排障耗时和凭据退出回执

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
