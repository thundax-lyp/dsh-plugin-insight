# DSH Codex Auth

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin)

<!-- BEGIN META -->
[![GitHub ★ 87](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=87&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/FNOSP/fnos-dsh) [![npm 30d 9,655](https://img.shields.io/static/v1?label=npm+30d&message=9%2C655&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-codex-auth) [![最新发布 2026-10-30](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-30&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@tnnevol/dsh-codex-auth)
<!-- END META -->

> **功能**：在 DSH 中管理 Codex 授权、模型目录和用量状态

> **亮点**：[Q01](#research-q01) 集中授权、镜像和模型使用状态。

> **主要限制**：[Q03](#research-q03) 明文文件权限、双份凭据和代理部署需核查。

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
  - [Q01 · 本组件增加了什么？](#detail-section-11)
  - [Q02 · 授权凭据怎样成为模型可用？](#detail-section-12)
  - [Q03 · 本机文件和路由的限制？](#detail-section-13)
  - [Q04 · 怎样采用、核对成本和退出？](#detail-section-14)
  - [Q05 · 怎样证伪这条集成链？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有订阅用户需在DSH完成登录、目录选择和退出。

独立配置凭据与模型目录。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| OAuth授权 | 从DSH发起账号登录 | 需要可授权账号和匹配宿主 |
| 凭据镜像 | 将插件token同步到宿主引用 | 本机明文权限和并发退出需核对 |
| 模型目录及默认选择 | 设置模型和思考档位 | 端点实际支持仍待验 |
| 用量显示 | 呈现账号余额与重置状态 | 以服务响应为准，非账单证明 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| DSH rc.2及llm-pi-ai | 必需 | 消费patch和凭据引用 | 其他组合不宣称兼容 |
| 可授权账号 | 必需 | provider-native OAuth | 配额与权限需外部核查 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 登录 | 用户在隔离profile授权 | 同时核对文件及宿主状态 |
| 请求 | 选模型发送无敏内容 | 不能用目录显示代替请求通过 |
| 退出 | logout后核对镜像并恢复覆盖 | 重启后不得继续残留授权 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 授权和配置资源未知 | 账号与兼容核对耗时未知 | 限定本机测试 |
| 持续 | 订阅和模型资源未知 | 刷新与目录维护耗时未知 | 额度和权限由服务决定 |
| 恢复 | 凭据清理资源未知 | 核对双份状态及恢复设置耗时未知 | 登出和卸载不同 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 授权接线 | 源码调用OAuth并写文件及镜像 | 闭环运行未验 |
| 模型目录 | patch明确配置能力 | 实际端点接受程度未知 |
| 退出 | store删除及mirror清除存在 | 并发刷新一致性未知 |

> **思考**：[Q03](#research-q03) 明文文件权限、双份凭据和代理部署需核查。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 集中授权、镜像和模型使用状态。

文件锁、原子写、周期同步和路由源检查可见。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q03](#research-q03) 明文文件权限、双份凭据和代理部署需核查。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q04](#research-q04) 限定本机profile测试登录请求退出闭环。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核查固定提交的让用户通过可核查的授权与退出流程使用订阅模型。未执行目标代码或实际宿主验证。

- 已检查：作者 README、包清单、源码路径 plugins/dsh-codex-auth-plugin/README.md、plugins/dsh-codex-auth-plugin/src/index.ts、plugins/dsh-codex-auth-plugin/cordis.patch.yml、plugins/dsh-codex-auth-plugin/src/host/auth.ts、plugins/dsh-codex-auth-plugin/src/host/store.ts、plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts、plugins/dsh-codex-auth-plugin/src/host/auth-routes.ts 及固定范围 inventory；组件：plugins/dsh-codex-auth-plugin。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：静态核查固定提交的让用户通过可核查的授权与退出流程使用订阅模型。未执行目标代码或实际宿主验证。
- 下一步：以隔离环境核对实际请求、镜像与错误。

**分析版本**

- **仓库**：[FNOSP/fnos-dsh](https://github.com/FNOSP/fnos-dsh)
- **版本号**：7.0.16（[固定提交 4058fee](https://github.com/FNOSP/fnos-dsh/tree/4058feee0fa16d34e123f917978abe47c205f830)）
- **版本日期**：2026-11-04（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q05](#research-q05) 可减少配置步骤并保持退出状态可追溯。

以隔离环境核对实际请求、镜像与错误。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 1 | 22 | — | — | 199 |
| .tsx | source | 4 | 988 | 756 | 167 | — |
| .ts | source | 22 | 2468 | 1751 | 525 | — |
| .ts | test | 22 | 2055 | 1460 | 373 | — |

</details>

**活跃度**

[![近30天新建 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=17&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 14](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=14&color=737b86&logo=github)](https://github.com/FNOSP/fnos-dsh/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)

暂未获取：Issue 未关闭。

统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：让用户通过可核查的授权与退出流程使用订阅模型

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 本组件增加了什么？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

用户原先需要单独配置模型凭据和目录，现在可从 DSH 设置发起 OAuth 并查看账号状态。其具体贡献是授权界面、凭据存储及镜像、模型设置和用量呈现。推理仍依赖 pi-ai 与宿主模型插件，不能把适配器已有模型能力算成本组件原创。验收须从登录追到一个无敏请求成功，并验证退出后不能再使用残余镜像。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-codex-auth-plugin/README.md:15-20](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/README.md#L15-L20)

作者描述授权与目录界面

```text
## 功能

- 浏览器授权登录 ChatGPT / Codex，不需要选工作空间，也不用手填 Key
- 设置全局默认模型和思考强度，新建会话自动采用
- 对话输入区右侧显示当前 Codex 模型的用量状态，可展开看剩余额度和重置时间
- 读取并在模型选择器里展示 Codex 模型目录
```

**依据 2 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/index.ts:54-70](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/index.ts#L54-L70)

存储镜像和实际路由接线

<details>
<summary>查看原文（17行）</summary>

```text
export function apply(ctx: Context): void {
  const store = new CodexCredentialStore()
  const mirror = new CodexCredentialMirror(ctx.credentials, store)
  const syncMirror = (): void => {
    void mirror.sync().catch(error => {
      ctx.logger.warn('dsh-codex-auth: failed to synchronize the Codex credential with dsh', error)
    })
  }
  ctx.effect(() => {
    syncMirror()
    const timer = setInterval(syncMirror, 60_000)
    return () => { clearInterval(timer) }
  }, 'dsh-codex-auth: credential mirror')
  registerCodexAuthRoutes(ctx, store, mirror)
  registerCodexModelRefreshRoute(ctx, store, { update: (ns, patch) => ctx.settings.update(ns, patch) })
  registerCodexGlobalModelRoute(ctx, ctx.agentDefaultModel, ctx.llm)
  scheduleCodexCapabilityHeal(ctx)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-codex-auth-plugin/cordis.patch.yml:26-32](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/cordis.patch.yml#L26-L32)

真实patch配置宿主pi-ai

```text
- id: llm-pi-ai
  config:
    providers:
      openai-codex:
        displayName: OpenAI Codex
        apiKeyEnv: OPENAI_CODEX_AUTH_TOKEN
        models:
```

#### 缺口

- 实际订阅权限与端点可用性未在本次执行。
  **影响**：登录成功提示不能证明请求成功或所选模型可用。
  **进一步探讨**：隔离账号以无敏消息验收请求和退出。

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 授权凭据怎样成为模型可用？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

loginCodex 复用 pi-ai provider-native OAuth，结果写入插件文件。根入口建立 mirror 并每分钟同步，mirror 通过 getAuth 解析 token 后写入宿主凭据引用，patch 的 llm-pi-ai 指向该引用。store 修改在文件锁内做验证和0600原子写。export 的 createCodexAdapter 是额外工厂，不能代替已核查的patch路径。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/auth.ts:13-27](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/auth.ts#L13-L27)

登录与删除入口

<details>
<summary>查看原文（15行）</summary>

```text
/** Start provider-native ChatGPT OAuth and persist its credential. */
export async function loginCodex(
  interaction: AuthInteraction,
  store: CodexCredentialStore = new CodexCredentialStore(),
): Promise<void> {
  const models = createModels({ credentials: store })
  models.setProvider(openaiCodexProvider())
  await models.login(CODEX_PROVIDER, 'oauth', interaction)
}

/** Delete the plugin-owned Codex credential. */
export async function logoutCodex(
  store: CodexCredentialStore = new CodexCredentialStore(),
): Promise<void> {
  await store.delete(CODEX_PROVIDER)
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/store.ts:115-139](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/store.ts#L115-L139)

文件锁与原子写删除

<details>
<summary>查看原文（25行）</summary>

```text
  async modify(
    providerId: string,
    fn: (current: Credential | undefined) => Promise<Credential | undefined>,
  ): Promise<Credential | undefined> {
    if (providerId !== CODEX_PROVIDER) {
      throw new Error(`codex-auth: credential store does not own provider "${providerId}"`)
    }
    await mkdir(dirname(this.filename), { recursive: true, mode: 0o700 })
    return withFileLock(this.filename, async () => {
      const current = await this.readCurrent()
      const candidate = await fn(current)
      if (candidate === undefined) return current
      const document = parseDocument(JSON.stringify({ version: AUTH_FORMAT_VERSION, credential: candidate }), this.filename)
      await writeFileAtomic(this.filename, `${JSON.stringify(document, null, 2)}\n`, {
        mode: 0o600,
        dirMode: 0o700,
      })
      return structuredClone(document.credential)
    })
  }

  async delete(providerId: string): Promise<void> {
    if (providerId !== CODEX_PROVIDER) return
    await mkdir(dirname(this.filename), { recursive: true, mode: 0o700 })
    await withFileLock(this.filename, () => rm(this.filename, { force: true }))
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts:46-59](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts#L46-L59)

清除和同步宿主引用

<details>
<summary>查看原文（14行）</summary>

```text
  /** Remove the mirrored token after the plugin-owned account signs out. */
  async clear(): Promise<void> {
    await this.operation?.catch(() => undefined)
    await this.credentials.unset(CODEX_API_KEY_REF)
  }

  private async syncNow(): Promise<void> {
    const resolved = await this.models.getAuth(CODEX_PROVIDER)
    const accessToken = resolved?.auth.apiKey
    if (accessToken !== undefined && accessToken.length > 0) {
      await this.credentials.set(CODEX_API_KEY_REF, accessToken)
      return
    }
    await this.credentials.unset(CODEX_API_KEY_REF)
```

</details>

**依据 4 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/index.ts:54-69](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/index.ts#L54-L69)

根入口周期同步

<details>
<summary>查看原文（16行）</summary>

```text
export function apply(ctx: Context): void {
  const store = new CodexCredentialStore()
  const mirror = new CodexCredentialMirror(ctx.credentials, store)
  const syncMirror = (): void => {
    void mirror.sync().catch(error => {
      ctx.logger.warn('dsh-codex-auth: failed to synchronize the Codex credential with dsh', error)
    })
  }
  ctx.effect(() => {
    syncMirror()
    const timer = setInterval(syncMirror, 60_000)
    return () => { clearInterval(timer) }
  }, 'dsh-codex-auth: credential mirror')
  registerCodexAuthRoutes(ctx, store, mirror)
  registerCodexModelRefreshRoute(ctx, store, { update: (ns, patch) => ctx.settings.update(ns, patch) })
  registerCodexGlobalModelRoute(ctx, ctx.agentDefaultModel, ctx.llm)
```

</details>

#### 缺口

- 刷新失败后镜像一致性和并发登录未验。
  **影响**：过期token可能留在宿主导致错误或登出后仍请求。
  **进一步探讨**：同时触发刷新与退出并核查两份状态。

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 本机文件和路由的限制？

**研究主题**：缺陷与关键质疑

#### 完整回答

OAuth 凭据以JSON文件落盘，0600限制普通权限但未见加密存储。路由有可信源检查和错误脱敏，源检查并不能证明远端部署反向代理组合安全。删除插件文件和清除宿主镜像是两个动作，退出验收必须覆盖两者。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/store.ts:122-139](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/store.ts#L122-L139)

JSON明文及权限模式

<details>
<summary>查看原文（18行）</summary>

```text
    await mkdir(dirname(this.filename), { recursive: true, mode: 0o700 })
    return withFileLock(this.filename, async () => {
      const current = await this.readCurrent()
      const candidate = await fn(current)
      if (candidate === undefined) return current
      const document = parseDocument(JSON.stringify({ version: AUTH_FORMAT_VERSION, credential: candidate }), this.filename)
      await writeFileAtomic(this.filename, `${JSON.stringify(document, null, 2)}\n`, {
        mode: 0o600,
        dirMode: 0o700,
      })
      return structuredClone(document.credential)
    })
  }

  async delete(providerId: string): Promise<void> {
    if (providerId !== CODEX_PROVIDER) return
    await mkdir(dirname(this.filename), { recursive: true, mode: 0o700 })
    await withFileLock(this.filename, () => rm(this.filename, { force: true }))
```

</details>

**依据 2 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/auth-routes.ts:250-280](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/auth-routes.ts#L250-L280)

请求origin判断

<details>
<summary>查看原文（31行）</summary>

```text
function requestOrigin(req: IncomingMessage): string | undefined {
  const host = firstForwarded(header(req, 'x-forwarded-host')) ?? header(req, 'host')
  if (host === undefined) return undefined
  const proto = firstForwarded(header(req, 'x-forwarded-proto'))
    ?? ((req.socket as IncomingMessage['socket'] & { encrypted?: boolean }).encrypted === true ? 'https' : 'http')
  try {
    return new URL(`${proto}://${host}`).origin
  } catch {
    return undefined
  }
}

function normalizeOrigin(raw: string): string | undefined {
  try {
    return new URL(raw).origin
  } catch {
    return undefined
  }
}

function localPeer(req: IncomingMessage): boolean {
  const remote = req.socket.remoteAddress
  return remote === '127.0.0.1' || remote === '::1' || remote === '::ffff:127.0.0.1'
}

/** Protect mutating routes while allowing the NAS app's loopback proxy. */
export function trustedRequest(req: IncomingMessage): boolean {
  const fetchSite = header(req, 'sec-fetch-site')?.trim().toLowerCase()
  if (fetchSite === 'cross-site') return false
  const origin = header(req, 'origin')
  if (origin !== undefined) return requestOrigin(req) === normalizeOrigin(origin)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts:46-59](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts#L46-L59)

镜像删除与同步

<details>
<summary>查看原文（14行）</summary>

```text
  /** Remove the mirrored token after the plugin-owned account signs out. */
  async clear(): Promise<void> {
    await this.operation?.catch(() => undefined)
    await this.credentials.unset(CODEX_API_KEY_REF)
  }

  private async syncNow(): Promise<void> {
    const resolved = await this.models.getAuth(CODEX_PROVIDER)
    const accessToken = resolved?.auth.apiKey
    if (accessToken !== undefined && accessToken.length > 0) {
      await this.credentials.set(CODEX_API_KEY_REF, accessToken)
      return
    }
    await this.credentials.unset(CODEX_API_KEY_REF)
```

</details>

#### 缺口

- 跨平台ACL及代理部署未验证。
  **影响**：共享机器或代理访问可能改变凭据与路由暴露范围。
  **进一步探讨**：仅本机隔离profile，记录文件权限和拒绝请求。

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 怎样采用、核对成本和退出？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

作者指定rc.2与npm子包。先备份模型设置，在隔离profile登录，确认目录、思考档位和用量能正确显示。首次成本来自账号授权和兼容核对，持续有订阅配额和请求处理，退出先logout并核查store与宿主引用，再移除bundle及不需要的模型覆盖。

#### 证据与依据

**依据 1 · 作者声明**：[plugins/dsh-codex-auth-plugin/README.md:5-13](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/README.md#L5-L13)

作者说明固定安装版本

````text
## 安装

插件发布在 npm，要求 DSH `0.2.0-rc.2` 。安装命令：

```sh
dsh plugin --profile web add @tnnevol/dsh-codex-auth@7.0.16
```

装完重启 Web profile 即可。如果提示 `cannot resolve profile bundle`，重新跑一次上面的安装命令，别只在 `package.json` 里手动补 bundle。
````

**依据 2 · 源码核查**：[plugins/dsh-codex-auth-plugin/cordis.patch.yml:5-18](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/cordis.patch.yml#L5-L18)

模型覆盖的能力影响

<details>
<summary>查看原文（14行）</summary>

```text
# Use the official pi-ai settings family so the DSH Models page renders the
# provider's credential status and its standard model-catalog editor. The
# access token is mirrored to this reference by the plugin after OAuth login.
#
# Every entry states its full capability set on purpose. A configured `models`
# list replaces the installed catalog wholesale, so an entry that only names an
# id keeps nothing but whatever the installed catalog happens to describe for
# that id — and silently loses reasoning levels and image input when the id is
# newer than that catalog, which is exactly what happened to `gpt-6-sol` and
# `gpt-6-luna` (both absent from the codex catalog in pi-ai through 0.87.0,
# added in 0.87.1). The fields below mirror the catalog's own values, so
# clearing the DSH settings override ("恢复默认模型") lands on each model's real
# capabilities again — context window, image input, and its actual thinking
# levels — instead of on `reasoning: false` plus llm-pi-ai's defaults
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/auth.ts:23-37](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/auth.ts#L23-L37)

退出和只读状态

<details>
<summary>查看原文（15行）</summary>

```text
/** Delete the plugin-owned Codex credential. */
export async function logoutCodex(
  store: CodexCredentialStore = new CodexCredentialStore(),
): Promise<void> {
  await store.delete(CODEX_PROVIDER)
}

/** Read login state without refreshing the token. */
export async function codexAuthStatus(
  store: CodexCredentialStore = new CodexCredentialStore(),
): Promise<CodexAuthStatus> {
  const credential = await store.read(CODEX_PROVIDER)
  return credential?.type === 'oauth'
    ? { authenticated: true, expiresAt: new Date(credential.expires) }
    : { authenticated: false }
```

</details>

#### 缺口

- 实际配额、订阅条款与多设备行为未在本次核查。
  **影响**：无法承诺固定可用模型、成本或持续授权。
  **进一步探讨**：后续核查官方授权条件并记录目标环境。

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 怎样证伪这条集成链？

**研究主题**：新假设与验证

#### 完整回答

用一次登录、请求、刷新、登出和重启作为闭环，比较宿主普通配置的模型结果及错误。加入过期token、拒绝origin、同时登出刷新。若退出后镜像仍可调用、目录声称的图像或思考能力被静默降级，或状态与请求不一致，则先停用并恢复原模型设置。

#### 证据与依据

**依据 1 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/index.ts:62-70](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/index.ts#L62-L70)

同步和能力修复接线

```text
  ctx.effect(() => {
    syncMirror()
    const timer = setInterval(syncMirror, 60_000)
    return () => { clearInterval(timer) }
  }, 'dsh-codex-auth: credential mirror')
  registerCodexAuthRoutes(ctx, store, mirror)
  registerCodexModelRefreshRoute(ctx, store, { update: (ns, patch) => ctx.settings.update(ns, patch) })
  registerCodexGlobalModelRoute(ctx, ctx.agentDefaultModel, ctx.llm)
  scheduleCodexCapabilityHeal(ctx)
```

**依据 2 · 源码核查**：[plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts:46-59](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/src/host/credential-mirror.ts#L46-L59)

退出同步可测

<details>
<summary>查看原文（14行）</summary>

```text
  /** Remove the mirrored token after the plugin-owned account signs out. */
  async clear(): Promise<void> {
    await this.operation?.catch(() => undefined)
    await this.credentials.unset(CODEX_API_KEY_REF)
  }

  private async syncNow(): Promise<void> {
    const resolved = await this.models.getAuth(CODEX_PROVIDER)
    const accessToken = resolved?.auth.apiKey
    if (accessToken !== undefined && accessToken.length > 0) {
      await this.credentials.set(CODEX_API_KEY_REF, accessToken)
      return
    }
    await this.credentials.unset(CODEX_API_KEY_REF)
```

</details>

**依据 3 · 源码核查**：[plugins/dsh-codex-auth-plugin/cordis.patch.yml:9-18](https://github.com/FNOSP/fnos-dsh/blob/4058feee0fa16d34e123f917978abe47c205f830/plugins/dsh-codex-auth-plugin/cordis.patch.yml#L9-L18)

能力字段与目录覆盖语义

<details>
<summary>查看原文（10行）</summary>

```text
# Every entry states its full capability set on purpose. A configured `models`
# list replaces the installed catalog wholesale, so an entry that only names an
# id keeps nothing but whatever the installed catalog happens to describe for
# that id — and silently loses reasoning levels and image input when the id is
# newer than that catalog, which is exactly what happened to `gpt-6-sol` and
# `gpt-6-luna` (both absent from the codex catalog in pi-ai through 0.87.0,
# added in 0.87.1). The fields below mirror the catalog's own values, so
# clearing the DSH settings override ("恢复默认模型") lands on each model's real
# capabilities again — context window, image input, and its actual thinking
# levels — instead of on `reasoning: false` plus llm-pi-ai's defaults
```

</details>

#### 缺口

- 本轮未执行账号或真实模型请求。
  **影响**：仅能判断接线和保护机制，不能确认授权闭环可用。
  **进一步探讨**：以隔离环境核对实际请求、镜像与错误。

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
