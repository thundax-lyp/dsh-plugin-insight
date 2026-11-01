# EduWork OIDC

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)

源码版本：[8d05453](https://github.com/ECNU/EduWork/tree/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc)

<!-- BEGIN META -->
[![GitHub ★ 264](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=264&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/ECNU/EduWork) [![npm 30d 1,987](https://img.shields.io/static/v1?label=npm+30d&message=1%2C987&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-oidc) [![最新发布 2026-10-24](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-24&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@eduwork/dsh-oidc)
<!-- END META -->

> **功能**：为 DSH 提供机构身份登录与授权模型接入。

> **亮点**：把机构认证、会话和授权模型目录接入宿主。[Q01](#research-q01)

> **主要限制**：本地凭据清除不证明远端 access token 已失效；不同网关协议需分别验收。[Q03](#research-q03)

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
  - [Q01 · 机构登录插件面向谁，与手工配置个人密钥相比怎样？](#detail-section-11)
  - [Q02 · OIDC 登录如何绑定请求并校验令牌？](#detail-section-12)
  - [Q03 · 并发刷新和退出是否保证服务端令牌立即无效？](#detail-section-13)
  - [Q04 · 机构应如何试用并处理登录或撤销失败？](#detail-section-14)
  - [Q05 · 已有本地清理和尽力撤销之外，如何帮助用户理解退出结果？](#detail-section-15)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：希望通过机构身份访问 DSH 的用户；基线是独立管理身份及模型凭据。[Q01](#research-q01)

用户分别配置个人凭据和机构服务。[Q01](#research-q01)

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 登录 | 机构身份认证 | 依赖提供方配置 |
| 模型 | 注册授权对话模型 | 仅 llm 类型 |
| 退出 | 清理本地并尝试撤销 | 远端结果不可保证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失时 |
| --- | --- | --- | --- |
| 兼容 DSH 与凭据服务 | 必需 | 账户及凭据 | 不启用 |
| 机构 OIDC 提供方及网络 | OIDC 登录需要 | 发现、授权和刷新 | 登录失败 |
| 企业网关与模型类型 | 企业模型需要 | 提供授权模型 | 仅身份或不可用 |
| 管理员测试和服务端核验 | 试用必需 | 确认互通和撤销 | 停止启用 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 配置 | 管理员核对 issuer、客户端及回调 | 配置不明停止 |
| 登录 | 测试账号完成授权并核验模型类型 | 校验失败检查提供方 |
| 退出 | 检查本地清理和服务端撤销 | 远端不明由管理员核查 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 身份提供方和宿主 | 注册客户端及测试 | 机构费用未知 |
| 持续 | 网络与模型服务 | 权限及密钥轮换管理 | 互通率未测 |
| 恢复 | 可能需管理员介入 | 检查远端令牌 | 撤销不保证成功 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 登录 | PKCE、签名与 claims 校验 | 指定提供方互通 |
| 退出 | 本地清理与撤销尝试 | 服务端即时失效 |

> **思考**：本地凭据清除不证明远端 access token 已失效；不同网关协议需分别验收。[Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：把机构认证、会话和授权模型目录接入宿主。[Q01](#research-q01)

Web OIDC 校验签名及 claims，刷新合并并用 epoch 防旧写；远端撤销为尽力而非确认。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

本地凭据清除不证明远端 access token 已失效；不同网关协议需分别验收。[Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先用隔离身份测试登录、模型类型及撤销失败，状态不明由管理员核查。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

固定子组件源码支持 Web OIDC 校验与本地退出路径；未运行身份提供方或网关。

- 已检查：作者 README、包清单、源码路径 packages/dsh-oidc/README.md、packages/dsh-oidc/src/host/oidc.js、packages/dsh-oidc/src/host/model-types.js 及固定范围 inventory；组件：packages/dsh-oidc。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定子组件 inventory 129 文件、无排除与解析错误；静态检查 Web OIDC 路径，未运行目标或身份服务。
- 下一步：固定机构测试提供方，验证 PKCE、并发刷新、退出及远端撤销失败。

**分析版本**

- **仓库**：[ECNU/EduWork](https://github.com/ECNU/EduWork)
- **版本号**：0.3.2（[固定提交 8d05453](https://github.com/ECNU/EduWork/tree/8d05453f5095ee979666f8a7f5c910892f2fbbd5)）
- **版本日期**：2026-11-01（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

未验证假设：明确展示本地清理与远端撤销的确认状态可减少用户误解，须对照现有清理和日志。[Q05](#research-q05)

固定机构测试提供方，验证 PKCE、并发刷新、退出及远端撤销失败。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .md | source | 68 | 3539 | — | — | 50105 |
| .mjs | source | 11 | 578 | 529 | 18 | — |
| .ts | source | 8 | 901 | 866 | 3 | — |
| .js | source | 25 | 3306 | 2996 | 97 | — |
| .js | test | 17 | 2724 | 2537 | 98 | — |

</details>

**活跃度**

[![Issue 未关闭 17](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=17&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 28](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=28&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+created%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z) [![近30天关闭 13](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=13&color=737b86&logo=github)](https://github.com/ECNU/EduWork/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-02T12%3A37%3A53.293Z..2026-11-01T12%3A37%3A53.293Z)



统计日期：2026-11-01。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：机构 OIDC 登录、刷新和退出如何实现，服务端撤销与模型目录边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 机构登录插件面向谁，与手工配置个人密钥相比怎样？

**研究主题**：场景与需求、贡献与相对优势

#### 完整回答

机构希望用户使用统一身份访问 DSH 和授权模型时，可配置 OIDC 身份与提供方；基线是分别配置账户和模型凭据。作者描述也支持仅身份模式及不同网关协议；需要机构正确配置身份服务、客户端和模型类型，不能认为安装即可获得企业模型。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-oidc/README.md:13-24](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/README.md#L13-L24)

作者说明机构配置、身份模式及模型类型。

<details>
<summary>查看原文（12行）</summary>

````text
```

启动 DSH 前，将 `EDUWORK_OIDC_PROFILE` 设为 Profile JSON 文件的绝对路径。默认 bundle 使用 Web 后端；EduWork 桌面用户继续使用发行配置。旧 Key Binding 配置需要先[迁移](docs/key-binding-protocol.md)。

## 开始接入

1. 根据服务端选择 [LiteLLM 接入指南](docs/gateway-auth/litellm-setup.md) 或 [oidc-llm 实验接入](docs/gateway-auth/experimental-oidc-llm.md)。
2. 复制对应的[LiteLLM 示例](examples/litellm.enterprise-profile.example.json)或[OIDC Token 示例](examples/oidc-llm.enterprise-profile.example.json)，填写完整发现地址与所需公开配置。
3. 在桌面 Host 使用 backend: desktop，本机 Web 使用 backend: web。仅身份登录仍可使用[纯身份示例](examples/identity-only.example.json)；该模式不提供企业模型。
4. 登录后自动读取当前授权的模型目录。账户刷新不应覆盖用户后来选择的个人模型。

当前源码按模型 `type` 注册，仅 `llm` 进入对话。服务器只返回 ID 时，升级前须按实际模型 ID 补充 `provider.models[].type`；服务端类型优先，专用及类型未知的模型不进入对话。仅返回 ID 的服务端需同时补齐配置中的模型类型。详见[模型说明](docs/enterprise-profile.md)。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-oidc/src/host/model-types.js:1-7](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/model-types.js#L1-L7)

仅 llm 类型判作对话模型。

```text
// Purpose is independent of input modalities: a vision LLM is still an LLM.
// Unknown (including future server types) is never registered for conversation.
export const MODEL_TYPES = Object.freeze(['llm', 'embedding', 'rerank', 'image', 'tts', 'unknown'])

export function isLLM(model) {
  return model.type === 'llm'
}
```

#### 缺口

- 未运行身份提供方、DSH、企业网关或真实凭据
  **影响**：不能证明互通、撤销生效或所有部署安全
  **进一步探讨**：固定宿主和测试身份提供方，验证登录、并发刷新、退出与撤销失败

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OIDC 登录如何绑定请求并校验令牌？

**研究主题**：功能与机制、工程质量与复用

#### 完整回答

发现文档 issuer 必须精确匹配并支持 PKCE S256；授权生成随机 state、nonce 和 verifier，交换 code 后校验 ID Token 和 UserInfo subject。ID Token 要求 RS256、唯一匹配 RSA JWK 并验签，再检查发行者、受众、nonce 和时间；这是固定 Web OIDC 代码路径，其他 native/gateway 模式不能自动套用。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:225-247](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L225-L247)

发现和 PKCE/算法约束。

<details>
<summary>查看原文（23行）</summary>

```text
    let response
    try {
      response = await this.fetch(discoveryURL(profile.oidc.issuer), {
        headers: { accept: 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(20_000),
      })
    } catch (cause) {
      throw publicError('oidc_discovery_failed', 'unable to read OIDC discovery metadata', cause)
    }
    const raw = await responseJSON(response, 'oidc_discovery_failed')
    if (raw.issuer !== profile.oidc.issuer) throw publicError('oidc_discovery_invalid', 'OIDC issuer does not exactly match the configured profile')
    if (!Array.isArray(raw.code_challenge_methods_supported) || !raw.code_challenge_methods_supported.includes('S256')) {
      throw publicError('oidc_discovery_invalid', 'OIDC provider does not advertise PKCE S256')
    }
    if (Array.isArray(raw.id_token_signing_alg_values_supported) && !raw.id_token_signing_alg_values_supported.includes('RS256')) {
      throw publicError('oidc_discovery_invalid', 'OIDC provider does not advertise RS256 ID Tokens')
    }
    const result = Object.freeze({
      issuer: raw.issuer,
      requireResponseIssuer: raw.authorization_response_iss_parameter_supported === true,
      authorizationEndpoint: discoveredEndpoint(raw.authorization_endpoint, profile, 'authorization_endpoint'),
      tokenEndpoint: discoveredEndpoint(raw.token_endpoint, profile, 'token_endpoint'),
      userInfoEndpoint: discoveredEndpoint(raw.userinfo_endpoint, profile, 'userinfo_endpoint'),
      jwksURI: discoveredEndpoint(raw.jwks_uri, profile, 'jwks_uri'),
```

</details>

**依据 2 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:263-275](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L263-L275)

随机 state、nonce 和 PKCE。

<details>
<summary>查看原文（13行）</summary>

```text
  createAuthorization(profile, discovery, redirectURI) {
    const state = base64url(randomBytes(32))
    const nonce = base64url(randomBytes(32))
    const verifier = base64url(randomBytes(48))
    const challenge = base64url(createHash('sha256').update(verifier).digest())
    const flow = { profileID: profile.id, nonce, verifier, redirectURI, createdAt: this.now(), epoch: this.accountEpoch(profile) }
    this.flows.set(state, flow)
    const target = new URL(discovery.authorizationEndpoint)
    for (const [key, value] of Object.entries({
      response_type: 'code', client_id: profile.oidc.clientId, redirect_uri: redirectURI,
      scope: profile.oidc.scopes.join(' '), state, nonce, code_challenge: challenge,
      code_challenge_method: 'S256',
    })) target.searchParams.set(key, value)
```

</details>

**依据 3 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:324-342](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L324-L342)

授权码交换与 subject 对比。

<details>
<summary>查看原文（19行）</summary>

```text
  async exchangeCode(profile, discovery, code, verifier, nonce, redirectURI = this.redirectURI) {
    const body = new URLSearchParams({
      grant_type: 'authorization_code', client_id: profile.oidc.clientId,
      code, redirect_uri: redirectURI, code_verifier: verifier,
    })
    const response = await this.fetch(discovery.tokenEndpoint, {
      method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded', accept: 'application/json' },
      body, redirect: 'error', signal: AbortSignal.timeout(20_000),
    })
    const token = await responseJSON(response, 'oidc_token_request_failed')
    if (typeof token.access_token !== 'string' || typeof token.id_token !== 'string' || token.token_type?.toLowerCase() !== 'bearer') {
      throw publicError('oidc_token_invalid', 'OIDC token response is incomplete')
    }
    const expiresIn = token.expires_in === undefined ? 3600 : Number(token.expires_in)
    if (!Number.isFinite(expiresIn) || expiresIn <= 0) throw publicError('oidc_token_invalid', 'OIDC token expiry is invalid')
    const timing = accessTokenTiming(expiresIn, this.now)
    const claims = await this.verifyIDToken(profile, discovery, token.id_token, nonce, token.access_token)
    const userInfo = await this.userInfo(discovery.userInfoEndpoint, token.access_token)
    if (!equalText(userInfo.sub, claims.sub)) throw publicError('oidc_userinfo_invalid', 'OIDC UserInfo subject does not match ID Token')
```

</details>

**依据 4 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:360-399](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L360-L399)

签名及 claims 校验。

<details>
<summary>查看原文（40行）</summary>

```text
  async verifyIDToken(profile, discovery, raw, expectedNonce, accessToken, { refresh = false } = {}) {
    if (typeof raw !== 'string') throw publicError('oidc_id_token_invalid', 'OIDC ID Token is missing')
    const parts = raw.split('.')
    if (parts.length !== 3) throw publicError('oidc_id_token_invalid', 'OIDC ID Token is malformed')
    const header = decodePart(parts[0], 'ID Token header')
    const claims = decodePart(parts[1], 'ID Token claims')
    if (header.alg !== 'RS256' || typeof header.kid !== 'string' || header.kid === '') throw publicError('oidc_id_token_invalid', 'OIDC ID Token must use RS256 with kid')
    const keysResponse = await this.fetch(discovery.jwksURI, { headers: { accept: 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(20_000) })
    const jwks = await responseJSON(keysResponse, 'oidc_jwks_failed')
    const candidates = Array.isArray(jwks.keys) ? jwks.keys.filter(key => (
      key.kid === header.kid && key.kty === 'RSA' && (key.use === undefined || key.use === 'sig')
      && (key.alg === undefined || key.alg === 'RS256')
    )) : []
    if (candidates.length !== 1) throw publicError('oidc_id_token_invalid', 'OIDC signing key was not uniquely identified')
    let key
    try { key = createPublicKey({ key: candidates[0], format: 'jwk' }) }
    catch (cause) { throw publicError('oidc_id_token_invalid', 'OIDC signing key is invalid', cause) }
    const valid = verifySignature('RSA-SHA256', Buffer.from(`${parts[0]}.${parts[1]}`), key, Buffer.from(parts[2], 'base64url'))
    if (!valid) throw publicError('oidc_id_token_invalid', 'OIDC ID Token signature is invalid')
    const now = nowSeconds(this.now)
    const audience = Array.isArray(claims.aud) ? claims.aud : [claims.aud]
    const audienceValid = audience.includes(profile.oidc.clientId)
      && audience.every(value => typeof value === 'string' && value !== '')
      && new Set(audience).size === audience.length
      && (audience.length === 1 || claims.azp === profile.oidc.clientId)
      && (claims.azp === undefined || claims.azp === profile.oidc.clientId)
    const nonceValid = refresh && claims.nonce === undefined || equalText(claims.nonce, expectedNonce)
    if (claims.iss !== profile.oidc.issuer || !audienceValid || typeof claims.sub !== 'string' || claims.sub === '' || !nonceValid) {
      throw publicError('oidc_id_token_invalid', 'OIDC ID Token identity claims are invalid')
    }
    if (!Number.isFinite(claims.exp) || !Number.isFinite(claims.iat)
      || (claims.nbf !== undefined && !Number.isFinite(claims.nbf))) {
      throw publicError('oidc_id_token_invalid', 'OIDC ID Token time claims are malformed')
    }
    if (claims.exp < now - CLOCK_SKEW_SECONDS || claims.iat > now + CLOCK_SKEW_SECONDS
      || (claims.nbf !== undefined && claims.nbf > now + CLOCK_SKEW_SECONDS)) {
      throw publicError('oidc_id_token_time_invalid', 'OIDC ID Token time claims are invalid')
    }
    if (claims.at_hash !== undefined && (typeof claims.at_hash !== 'string' || !verifyAccessTokenHash(accessToken, claims.at_hash))) {
      throw publicError('oidc_id_token_invalid', 'OIDC ID Token access-token hash is invalid')
```

</details>

#### 缺口

- 未运行身份提供方、DSH、企业网关或真实凭据
  **影响**：不能证明互通、撤销生效或所有部署安全
  **进一步探讨**：固定宿主和测试身份提供方，验证登录、并发刷新、退出与撤销失败

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 并发刷新和退出是否保证服务端令牌立即无效？

**研究主题**：缺陷与关键质疑、功能与机制

#### 完整回答

不能。每 profile 的刷新 promise 合并，凭据写入串行并检查账户 epoch，以防退出后旧操作恢复本地状态；logout 清除本地凭据并尝试调用发现到的撤销端点，异常仅记录日志。该代码未把远端撤销确认返回给调用者，已签发 access token 的有效性依赖身份服务，不能把本地退出称作服务端即时撤销。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:429-459](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L429-L459)

序列化凭据写入和合并刷新。

<details>
<summary>查看原文（31行）</summary>

```text
  }

  accountEpoch(profile) { return this.accountEpochs.get(profile.id) ?? 0 }

  writeCredentials(profile, epoch, operation) {
    // Serialize vault writes so logout clears even a write already in progress.
    // Network requests do not hold this queue; late replies cannot restore keys.
    const queue = sessionRef(profile)
    const write = (this.credentialWrites.get(queue) ?? Promise.resolve()).catch(() => {}).then(() => {
      if (epoch !== this.accountEpoch(profile)) throw publicError('oidc_login_cancelled', '账户状态已改变，请重新登录。')
      return operation()
    })
    this.credentialWrites.set(queue, write)
    void write.finally(() => { if (this.credentialWrites.get(queue) === write) this.credentialWrites.delete(queue) }).catch(() => {})
    return write
  }

  clearCredentials(profile, epoch) {
    return this.writeCredentials(profile, epoch, () => this.ctx.credentials.unset(sessionRef(profile)))
  }

  saveSession(profile, session, epoch = this.accountEpoch(profile)) {
    return this.writeCredentials(profile, epoch, () => this.ctx.credentials.set(sessionRef(profile), JSON.stringify(session)))
  }

  refresh(profile, session) {
    if (!this.refreshFlights.has(profile.id)) {
      const flight = this.performRefresh(profile, session).finally(() => { if (this.refreshFlights.get(profile.id) === flight) this.refreshFlights.delete(profile.id) })
      this.refreshFlights.set(profile.id, flight)
    }
    return this.refreshFlights.get(profile.id)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:592-615](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L592-L615)

本地清理、尽力远端撤销及返回。

<details>
<summary>查看原文（24行）</summary>

```text
  async logout(profileID) {
    const profile = this.profile(profileID)
    const epoch = this.accountEpoch(profile) + 1
    this.accountEpochs.set(profileID, epoch)
    this.refreshFlights.delete(profileID)
    this.resourceFlights.delete(profileID)
    const session = await this.loadSession(profile)
    await this.clearCredentials(profile, epoch)
    this.resourceStates.delete(profileID)
    for (const [state, flow] of this.flows) if (flow.profileID === profileID) this.flows.delete(state)
    if (session) {
      try {
        const discovery = await this.discover(profile)
        if (discovery.revocationEndpoint) {
          const token = session.refreshToken || session.accessToken
          await this.fetch(discovery.revocationEndpoint, {
            method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token, client_id: profile.oidc.clientId }), redirect: 'error', signal: AbortSignal.timeout(10_000),
          })
        }
      } catch (cause) { this.ctx.logger.warn(cause instanceof Error ? cause : new Error(String(cause))) }
    }
    return account(profile, undefined, false)
  }
```

</details>

**依据 3 · 作者声明**：[packages/dsh-oidc/README.md:38-40](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/README.md#L38-L40)

作者说明 access token 服务端有效期。

```text
- OIDC 模式验证 ID Token 签名、issuer、audience、nonce 与 UserInfo subject。LiteLLM native 按其自身契约处理，不猜测 Token 类型或降级协议。
- 请求前检查 Token 有效期；临近到期自动刷新，并发刷新合并为一次。
- 退出清理本地授权并取消在途模型请求，尽力撤销 Refresh Token。已签发 Access Token 的服务端有效期由服务端管理。
```

#### 缺口

- 未运行身份提供方、DSH、企业网关或真实凭据
  **影响**：不能证明互通、撤销生效或所有部署安全
  **进一步探讨**：固定宿主和测试身份提供方，验证登录、并发刷新、退出与撤销失败

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 机构应如何试用并处理登录或撤销失败？

**研究主题**：依赖、兼容与流程、效果与总成本、采用判断

#### 完整回答

需要兼容 DSH、机构身份提供方、公开客户端配置与网络；企业模型还需要网关和正确模型类型。先用隔离测试账号和本机环境确认 issuer、回调、密钥轮换、授权范围与模型目录；测试退出、并发刷新及远端撤销失败时的本地状态。遇认证或撤销状态不明应停止使用并由机构管理员检查服务端，不在日志中暴露令牌。

#### 证据与依据

**依据 1 · 作者声明**：[packages/dsh-oidc/README.md:13-24](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/README.md#L13-L24)

作者说明配置与模型类型。

<details>
<summary>查看原文（12行）</summary>

````text
```

启动 DSH 前，将 `EDUWORK_OIDC_PROFILE` 设为 Profile JSON 文件的绝对路径。默认 bundle 使用 Web 后端；EduWork 桌面用户继续使用发行配置。旧 Key Binding 配置需要先[迁移](docs/key-binding-protocol.md)。

## 开始接入

1. 根据服务端选择 [LiteLLM 接入指南](docs/gateway-auth/litellm-setup.md) 或 [oidc-llm 实验接入](docs/gateway-auth/experimental-oidc-llm.md)。
2. 复制对应的[LiteLLM 示例](examples/litellm.enterprise-profile.example.json)或[OIDC Token 示例](examples/oidc-llm.enterprise-profile.example.json)，填写完整发现地址与所需公开配置。
3. 在桌面 Host 使用 backend: desktop，本机 Web 使用 backend: web。仅身份登录仍可使用[纯身份示例](examples/identity-only.example.json)；该模式不提供企业模型。
4. 登录后自动读取当前授权的模型目录。账户刷新不应覆盖用户后来选择的个人模型。

当前源码按模型 `type` 注册，仅 `llm` 进入对话。服务器只返回 ID 时，升级前须按实际模型 ID 补充 `provider.models[].type`；服务端类型优先，专用及类型未知的模型不进入对话。仅返回 ID 的服务端需同时补齐配置中的模型类型。详见[模型说明](docs/enterprise-profile.md)。
````

</details>

**依据 2 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:225-247](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L225-L247)

发现与发行者验证。

<details>
<summary>查看原文（23行）</summary>

```text
    let response
    try {
      response = await this.fetch(discoveryURL(profile.oidc.issuer), {
        headers: { accept: 'application/json' }, redirect: 'error', signal: AbortSignal.timeout(20_000),
      })
    } catch (cause) {
      throw publicError('oidc_discovery_failed', 'unable to read OIDC discovery metadata', cause)
    }
    const raw = await responseJSON(response, 'oidc_discovery_failed')
    if (raw.issuer !== profile.oidc.issuer) throw publicError('oidc_discovery_invalid', 'OIDC issuer does not exactly match the configured profile')
    if (!Array.isArray(raw.code_challenge_methods_supported) || !raw.code_challenge_methods_supported.includes('S256')) {
      throw publicError('oidc_discovery_invalid', 'OIDC provider does not advertise PKCE S256')
    }
    if (Array.isArray(raw.id_token_signing_alg_values_supported) && !raw.id_token_signing_alg_values_supported.includes('RS256')) {
      throw publicError('oidc_discovery_invalid', 'OIDC provider does not advertise RS256 ID Tokens')
    }
    const result = Object.freeze({
      issuer: raw.issuer,
      requireResponseIssuer: raw.authorization_response_iss_parameter_supported === true,
      authorizationEndpoint: discoveredEndpoint(raw.authorization_endpoint, profile, 'authorization_endpoint'),
      tokenEndpoint: discoveredEndpoint(raw.token_endpoint, profile, 'token_endpoint'),
      userInfoEndpoint: discoveredEndpoint(raw.userinfo_endpoint, profile, 'userinfo_endpoint'),
      jwksURI: discoveredEndpoint(raw.jwks_uri, profile, 'jwks_uri'),
```

</details>

**依据 3 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:592-615](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L592-L615)

退出与撤销路径。

<details>
<summary>查看原文（24行）</summary>

```text
  async logout(profileID) {
    const profile = this.profile(profileID)
    const epoch = this.accountEpoch(profile) + 1
    this.accountEpochs.set(profileID, epoch)
    this.refreshFlights.delete(profileID)
    this.resourceFlights.delete(profileID)
    const session = await this.loadSession(profile)
    await this.clearCredentials(profile, epoch)
    this.resourceStates.delete(profileID)
    for (const [state, flow] of this.flows) if (flow.profileID === profileID) this.flows.delete(state)
    if (session) {
      try {
        const discovery = await this.discover(profile)
        if (discovery.revocationEndpoint) {
          const token = session.refreshToken || session.accessToken
          await this.fetch(discovery.revocationEndpoint, {
            method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token, client_id: profile.oidc.clientId }), redirect: 'error', signal: AbortSignal.timeout(10_000),
          })
        }
      } catch (cause) { this.ctx.logger.warn(cause instanceof Error ? cause : new Error(String(cause))) }
    }
    return account(profile, undefined, false)
  }
```

</details>

#### 缺口

- 未运行身份提供方、DSH、企业网关或真实凭据
  **影响**：不能证明互通、撤销生效或所有部署安全
  **进一步探讨**：固定宿主和测试身份提供方，验证登录、并发刷新、退出与撤销失败

<a id="research-q05"></a>

<a id="detail-section-15"></a>

### Q05 · 已有本地清理和尽力撤销之外，如何帮助用户理解退出结果？

**研究主题**：新假设与验证、工程质量与复用

#### 完整回答

未验证假设：以不包含令牌的状态明确区分本地凭据已清除、远端撤销已确认和不可确认，可能减少用户把本地退出误解为服务端即时失效。已有 epoch 防旧写、凭据清理和撤销尝试；不能把这些当新增机制，也未穷尽其他网关的已有日志或状态。模拟撤销成功、端点缺失、网络超时及并发刷新，对照现有 UI 测误解率、误报和泄露；无改善或可能暴露敏感数据则否定。

#### 证据与依据

**依据 1 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:429-459](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L429-L459)

已有写入序列化、epoch 和并发刷新。

<details>
<summary>查看原文（31行）</summary>

```text
  }

  accountEpoch(profile) { return this.accountEpochs.get(profile.id) ?? 0 }

  writeCredentials(profile, epoch, operation) {
    // Serialize vault writes so logout clears even a write already in progress.
    // Network requests do not hold this queue; late replies cannot restore keys.
    const queue = sessionRef(profile)
    const write = (this.credentialWrites.get(queue) ?? Promise.resolve()).catch(() => {}).then(() => {
      if (epoch !== this.accountEpoch(profile)) throw publicError('oidc_login_cancelled', '账户状态已改变，请重新登录。')
      return operation()
    })
    this.credentialWrites.set(queue, write)
    void write.finally(() => { if (this.credentialWrites.get(queue) === write) this.credentialWrites.delete(queue) }).catch(() => {})
    return write
  }

  clearCredentials(profile, epoch) {
    return this.writeCredentials(profile, epoch, () => this.ctx.credentials.unset(sessionRef(profile)))
  }

  saveSession(profile, session, epoch = this.accountEpoch(profile)) {
    return this.writeCredentials(profile, epoch, () => this.ctx.credentials.set(sessionRef(profile), JSON.stringify(session)))
  }

  refresh(profile, session) {
    if (!this.refreshFlights.has(profile.id)) {
      const flight = this.performRefresh(profile, session).finally(() => { if (this.refreshFlights.get(profile.id) === flight) this.refreshFlights.delete(profile.id) })
      this.refreshFlights.set(profile.id, flight)
    }
    return this.refreshFlights.get(profile.id)
```

</details>

**依据 2 · 源码核查**：[packages/dsh-oidc/src/host/oidc.js:592-615](https://github.com/ECNU/EduWork/blob/8d05453f5095ee979666f8a7f5c910892f2fbbd5/packages/dsh-oidc/src/host/oidc.js#L592-L615)

已有清理和尽力撤销。

<details>
<summary>查看原文（24行）</summary>

```text
  async logout(profileID) {
    const profile = this.profile(profileID)
    const epoch = this.accountEpoch(profile) + 1
    this.accountEpochs.set(profileID, epoch)
    this.refreshFlights.delete(profileID)
    this.resourceFlights.delete(profileID)
    const session = await this.loadSession(profile)
    await this.clearCredentials(profile, epoch)
    this.resourceStates.delete(profileID)
    for (const [state, flow] of this.flows) if (flow.profileID === profileID) this.flows.delete(state)
    if (session) {
      try {
        const discovery = await this.discover(profile)
        if (discovery.revocationEndpoint) {
          const token = session.refreshToken || session.accessToken
          await this.fetch(discovery.revocationEndpoint, {
            method: 'POST', headers: { 'content-type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({ token, client_id: profile.oidc.clientId }), redirect: 'error', signal: AbortSignal.timeout(10_000),
          })
        }
      } catch (cause) { this.ctx.logger.warn(cause instanceof Error ? cause : new Error(String(cause))) }
    }
    return account(profile, undefined, false)
  }
```

</details>

#### 缺口

- 未运行身份提供方、DSH、企业网关或真实凭据
  **影响**：不能证明互通、撤销生效或所有部署安全
  **进一步探讨**：固定宿主和测试身份提供方，验证登录、并发刷新、退出与撤销失败

[返回分类](../../views/categories/OFFICE-OPERATIONS.md) · [返回首页](../../../README.md)
