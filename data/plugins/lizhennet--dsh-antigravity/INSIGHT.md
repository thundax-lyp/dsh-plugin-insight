# DSH Antigravity

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[9495776](https://github.com/LiZhenNet/dsh-antigravity/tree/94957767c5e247d86cec8833fb1b67f659078af6)

<!-- BEGIN META -->
[![GitHub ★ 33](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=33&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/LiZhenNet/dsh-antigravity) [![npm 30d 1,213](https://img.shields.io/static/v1?label=npm+30d&message=1%2C213&color=4f769b&logo=npm&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-antigravity) [![最新发布 2026-09-29](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-09-29&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/dsh-antigravity)
<!-- END META -->

> **功能**：为 DSH Web 接入 Google Antigravity 模型适配器，提供 OAuth 登录、模型选择和配额显示。

> **亮点**：插件在 DSH 的请求链上加入登录、模型选择与 SSE 适配，让已授权环境的用户有机会在原会话中使用另一模型服务。[Q01](#research-q01)

> **主要限制**：注册成功不保证实际账户可用。OAuth 接入为非官方，使用权限、回调范围、凭据管理与运行时模型回退都影响采用。[Q02](#research-q02) [Q03](#research-q03)

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
  - [Q01 · 已具备授权账号的 DSH 用户如何在 Host 中将请求交给该模型适配器？](#detail-section-11)
  - [Q02 · OAuth 登录、凭据落盘与退出在哪些边界内成立？](#detail-section-12)
  - [Q03 · 界面显示的模型、实际采用的模型及重试结果是否总是同一件事？](#detail-section-13)
  - [Q04 · 为什么先观察，怎样验证它的调用回执比现有设置更可复查？](#detail-section-14)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已获有关服务授权的 DSH Web 用户，可以评估是否将模型选择和调用保留在 DSH 会话中。

已有受支持的模型供应商或官方客户端可承担实际任务。这里把模型请求交回 DSH 工具和会话入口。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型适配器 | 向 DSH 注册第三方模型提供方 | 依赖 OAuth 和远端接口 |
| 设置与配额 | 配置模型并查看账号状态 | 服务未响应时数据可能缺失 |
| 错误与回退 | 处理部分模型、端点或空流失败 | 回退结果仍需验证 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 宿主 llm 及 Web 设置服务 | llm 必需，Web 设置按需 | 模型接线与配置 | 适配器或设置无法挂载 |
| 授权 OAuth 账户及可达回调 | 是 | 交换令牌、取得 API 访问 | 缺凭据时返回 AUTH |
| Cloud Code Assist 路由 | 请求需要 | 发送推理请求和读取流 | HTTP 错误、配额或超时 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 确认条件 | 用户核对允许的账户和接口 | 没有明确许可时保持观察 |
| 检查模型 | 在合规隔离环境检查适配器注册 | 列表可见仍需实际核对授权和调用 |
| 检查输出 | 只使用无敏感输入，核对实际候选和错误 | 接口不通时换回既有供应商 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 联网安装和授权成本未测 | 核对 OAuth 与宿主 | 授权未验证 |
| 持续 | 模型配额、重试和请求金额未知 | 排查过期、候选和路由问题 | 模型实际可用性未知 |
| 退出 | 未量化 | 解除本地配置，必要时到提供方撤销 | 源码只清除本地凭据 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 会话内聚合调用 | 适配器接入 llm 并转换 SSE | 任务效率与外部接口可用 |
| 模型与端点诊断 | 部分失败状态记录且允许回退 | 远端实际模型和稳定性 |

> **思考**：注册成功不保证实际账户可用。OAuth 接入为非官方，使用权限、回调范围、凭据管理与运行时模型回退都影响采用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：插件在 DSH 的请求链上加入登录、模型选择与 SSE 适配，让已授权环境的用户有机会在原会话中使用另一模型服务。[Q01](#research-q01)

OAuth 有 state 和 PKCE；本地明文文件写入后 rename，退路范围是本地清理。请求端限于受控候选与状态重试。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-5"></a>

### 1.4 主要限制

注册成功不保证实际账户可用。OAuth 接入为非官方，使用权限、回调范围、凭据管理与运行时模型回退都影响采用。[Q02](#research-q02) [Q03](#research-q03)

<a id="detail-section-6"></a>

### 1.5 使用建议

先确认服务与账号授权及凭据隔离，再研究目标宿主下的请求结果。此前继续使用已有合法供应商。[Q04](#research-q04)

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

已核查固定源码的 llm 接线、OAuth 和流处理。外部服务权限、可用性、配额与接口兼容未验证。

- 已检查：作者 README、包清单、源码路径 package.json、cordis.patch.yml、lib/index.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定仓库的已提交 JS 入口、授权和网络请求链。未验证实际账户、服务许可、模型身份、账单或运行。
- 下一步：先在不使用真实凭据的环境模拟登录失败、配额、404 与空流，明确输出及候选切换，再单独确认合法账户和接口。

**分析版本**

- **仓库**：[LiZhenNet/dsh-antigravity](https://github.com/LiZhenNet/dsh-antigravity)
- **版本号**：0.0.4（[固定提交 9495776](https://github.com/LiZhenNet/dsh-antigravity/tree/94957767c5e247d86cec8833fb1b67f659078af6)）
- **版本日期**：2026-08-19（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

可给每轮请求保留去凭据的模型落点和回退原因，用模拟配额耗尽与 404 测试能否缩短诊断。[Q04](#research-q04)

先在不使用真实凭据的环境模拟登录失败、配额、404 与空流，明确输出及候选切换，再单独确认合法账户和接口。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .mjs | source | 1 | 34 | 31 | 0 | — |
| .js | source | 2 | 3695 | 3418 | 24 | — |
| .md | source | 2 | 236 | — | — | 1404 |

</details>

**活跃度**

[![Issue 未关闭 4](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=4&color=737b86&logo=github)](https://github.com/LiZhenNet/dsh-antigravity/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=0&color=737b86&logo=github)](https://github.com/LiZhenNet/dsh-antigravity/issues?q=is%3Aissue+created%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/LiZhenNet/dsh-antigravity/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-15T11%3A35%3A36.890Z..2026-11-14T11%3A35%3A36.890Z)



统计日期：2026-11-14。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：DSH Web 用户如何接入 Antigravity 模型，授权、模型路由及失败边界是什么？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 已具备授权账号的 DSH 用户如何在 Host 中将请求交给该模型适配器？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

安装为 Web profile bundle 后，根补丁挂载 dsh-antigravity。apply 在 llm 服务注册 AntigravityAdapter，并且在注入到 webServer 时注册设置相关 HTTP 路由。适配器按设置解析模型及是否支持图像，然后组装带项目和 runtime model 的请求，经远端流接口读取响应并转换为 DSH 的 chunks。相较在独立客户端重复建立和复制上下文，接线让请求继续由 DSH 发起并进现有工具链。收益依赖授权和远端接口可用。显示模型或可解析配置不能证明特定账户真的能调用对应模型。

#### 证据与依据

**依据 1 · 源码核查**：[package.json:2-21](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/package.json#L2-L21)

根入口、profile patch 与客户端能力。

<details>
<summary>查看原文（20行）</summary>

```text
  "name": "dsh-antigravity",
  "version": "0.0.4",
  "description": "Google Antigravity / Cloud Code Assist model provider for DeepSeek Harness",
  "type": "module",
  "main": "lib/index.js",
  "exports": {
    ".": "./lib/index.js",
    "./client": "./lib/client.js",
    "./cordis.patch.yml": "./cordis.patch.yml",
    "./package.json": "./package.json"
  },
  "dsh": {
    "bundle": {
      "patch": "./cordis.patch.yml"
    },
    "client": {
      "inject": [
        "@deepseek-ai/dsh-client-ui-settings",
        "@deepseek-ai/dsh-client-locale"
      ],
```

</details>

**依据 2 · 源码核查**：[cordis.patch.yml:1-3](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/cordis.patch.yml#L1-L3)

挂载固定包名。

```text
- insert:
    - id: dsh-antigravity
      name: dsh-antigravity
```

**依据 3 · 源码核查**：[lib/index.js:2691-2714](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2691-L2714)

模型信息解析和流迭代器入口。

<details>
<summary>查看原文（24行）</summary>

```text
  async resolveModel(provider, modelId, signal) {
    if (signal?.aborted) return Promise.reject(new LlmError("antigravity model resolution aborted", "ABORTED"));
    const settings = await this.#modelSettings.read();
    const model = modelFromSettings(settings, modelId);
    return {
      provider,
      id: model.id,
      name: model.name,
      inputModalities: model.inputModalities,
      context: { contextWindow: model.contextWindow },
      defaultMaxTokens: model.maxTokens,
      ...reasoningInfo(model),
    };
  }

  async *stream(options) {
    const settings = await this.#modelSettings.read();
    const model = modelFromSettings(settings, options.model);

    const consumer = new AbortController();
    const upstream =
      options.signal === undefined ? consumer.signal : AbortSignal.any([options.signal, consumer.signal]);
    const watchdog = idleWatchdog(upstream, STREAM_IDLE_TIMEOUT_MS, STREAM_IDLE_TIMEOUT_CODE);
    const iterator = requestAntigravityChunks(options, model, watchdog.signal, this.#store)[Symbol.asyncIterator]();
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2586-2613](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2586-L2613)

远端流 POST、图像限制和凭据读取。

<details>
<summary>查看原文（28行）</summary>

```text
async function fetchStreamResponse(endpoint, headers, body, signal) {
  try {
    return await fetch(`${endpoint}/v1internal:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers,
      body,
      signal,
    });
  } catch (error) {
    setLastError(error);
    if (signal?.aborted) throw new LlmError("antigravity request aborted by caller", "ABORTED", { cause: error });
    throw error;
  }
}

async function* requestAntigravityChunks(options, model, signal, store) {
  if (hasImages(options.messages) && !model.inputModalities.includes("image")) {
    throw new LlmError(`antigravity model "${model.id}" does not support image content`, "UNSUPPORTED_CONTENT");
  }

  const { token, projectId } = await ensureApiKey(store);
  const effort = resolveReasoning(model, options.reasoningEffort);
  const runtimeCandidates = await resolveRuntimeCandidates(token, projectId, model, effort);
  const requestHeaders = {
    ...antigravityHeaders(token),
    ...attributionHeaderBag(),
    ...(model.id.startsWith("claude-") ? { "anthropic-beta": "interleaved-thinking-2025-05-14" } : {}),
  };
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3024-3032](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L3024-L3032)

真实宿主适配器注册和可选 Web 路由。

```text
export function apply(ctx) {
  const store = new FileCredentialStore(credentialPath());
  const modelSettings = new FileModelSettingsStore(modelSettingsPath());
  const adapter = new AntigravityAdapter(store, modelSettings);
  ctx.llm.registerAdapter([PROVIDER], adapter);
  registerWebApi(ctx, store, modelSettings);
}

apply.inject = ["llm"];
```

#### 缺口

- 本轮没用任何实际账户运行 provider
  **影响**：无法确认服务兼容和具体模型可用
  **进一步探讨**：维护方先确认接口的使用授权，再以无敏感任务核对目标模型和响应

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · OAuth 登录、凭据落盘与退出在哪些边界内成立？

**研究主题**：依赖、兼容与流程、缺陷与关键质疑、工程质量与复用

#### 完整回答

Web 登录为待完成流程复用同一授权过程，构造 PKCE 的 verifier/challenge 和随机 state，请求 offline 访问。回调到达后比对 state，再交换并保存令牌。凭据以 JSON 写临时文件，指定 0600 后重命名；refresh 在一个 store 内用 Promise 链串行，但不能推定不同进程共享同一锁，模式标志也不是加密。Web logout 删除本地文件和缓存，代码没有向远端撤销授权。插件提供默认客户端凭据以及环境覆盖路径，项目 README 自述为非官方。若用于共享 DSH Home，必须先核对谁能读取凭据文件、访问登录与设置 HTTP 接口、以及账号是否授权使用这些 OAuth scope。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:47-57](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L47-L57)

预置授权范围包含云平台等项目。

<details>
<summary>查看原文（11行）</summary>

```text
const REDIRECT_PATH = "/oauth-callback";
const AUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const TOKEN_URL = "https://oauth2.googleapis.com/token";
const SCOPES = [
  "https://www.googleapis.com/auth/aicode",
  "https://www.googleapis.com/auth/cloud-platform",
  "https://www.googleapis.com/auth/userinfo.email",
  "https://www.googleapis.com/auth/userinfo.profile",
  "https://www.googleapis.com/auth/cclog",
  "https://www.googleapis.com/auth/experimentsandconfigs",
];
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2286-2334](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2286-L2334)

浏览器授权 state、PKCE、offline、写凭据与服务器清理。

<details>
<summary>查看原文（49行）</summary>

```text
export async function beginWebLogin(store) {
  if (webLoginFlow?.status === "pending") {
    return {
      status: webLoginFlow.status,
      authUrl: webLoginFlow.authUrl,
      startedAt: webLoginFlow.startedAt,
    };
  }

  const { verifier, challenge } = generatePKCE();
  const state = base64Url(randomBytes(32));
  const { server, waitForCode } = await startCallbackServer(state);
  const callbackUrl = redirectUri();
  const authParams = new URLSearchParams({
    client_id: clientId(),
    response_type: "code",
    redirect_uri: callbackUrl,
    scope: SCOPES.join(" "),
    code_challenge: challenge,
    code_challenge_method: "S256",
    state,
    access_type: "offline",
    prompt: "consent",
  });
  const flow = {
    status: "pending",
    authUrl: `${AUTH_URL}?${authParams.toString()}`,
    startedAt: Date.now(),
    error: "",
  };
  webLoginFlow = flow;

  void (async () => {
    try {
      const { code, state: returnedState } = await waitForCode();
      if (returnedState !== state) throw new Error("OAuth state mismatch");
      const credentials = await exchangeOAuthCode(code, verifier, callbackUrl);
      await store.write(credentials);
      flow.status = "complete";
      flow.email = credentialEmail(credentials);
      flow.completedAt = Date.now();
      cachedQuota = undefined;
    } catch (error) {
      flow.status = "error";
      flow.error = safeError(error);
      flow.completedAt = Date.now();
    } finally {
      server.close();
    }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2406-2454](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2406-L2454)

明文 JSON 临时落盘、0600、本地串行及删除。

<details>
<summary>查看原文（49行）</summary>

```text
export class FileCredentialStore {
  #file;
  #chain = Promise.resolve();

  constructor(file = credentialPath()) {
    this.#file = file;
  }

  path() {
    return this.#file;
  }

  async read() {
    try {
      const parsed = JSON.parse(await readFile(this.#file, "utf8"));
      return isRecord(parsed) ? parsed : undefined;
    } catch (error) {
      if (error && error.code === "ENOENT") return undefined;
      throw error;
    }
  }

  async write(credentials) {
    await mkdir(dirname(this.#file), { recursive: true });
    const tempFile = `${this.#file}.tmp`;
    await writeFile(tempFile, JSON.stringify(credentials, null, 2), { mode: 0o600 });
    await rename(tempFile, this.#file);
  }

  modify(fn) {
    const next = (async () => {
      await this.#chain.catch(() => {});
      const current = await this.read();
      const updated = await fn(current);
      if (updated !== undefined) await this.write(updated);
      return updated ?? current;
    })();
    this.#chain = next.catch(() => {});
    return next;
  }

  async delete() {
    await this.#chain.catch(() => {});
    try {
      await unlink(this.#file);
    } catch (error) {
      if (!error || error.code !== "ENOENT") throw error;
    }
  }
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2950-2967](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2950-L2967)

Web 侧状态与登录端点接线。

<details>
<summary>查看原文（18行）</summary>

```text
  ctx.inject(["webServer"], (webCtx) => {
    webCtx.effect(
      () =>
        webCtx.webServer.register({
          kind: "prefix",
          path: "/antigravity/api",
          handler: async (request, response) => {
            const url = new URL(request.url || "/", "http://dsh.local");
            const path = url.pathname.replace(/^\/antigravity\/api\/?/, "");
            try {
              if (path === "status" || path === "") {
                if (request.method !== "GET") return sendMethodNotAllowed(response);
                return sendJson(response, 200, { ok: true, value: await webStatus(store, modelSettings) });
              }
              if (path === "login") {
                if (request.method !== "POST") return sendMethodNotAllowed(response);
                const value = await beginWebLogin(store);
                return sendJson(response, 200, { ok: true, value });
```

</details>

**依据 5 · 源码核查**：[lib/index.js:3005-3015](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L3005-L3015)

退出仅本地删除，未见远端撤销。

<details>
<summary>查看原文（11行）</summary>

```text
                return sendMethodNotAllowed(response);
              }
              if (path === "logout") {
                if (request.method !== "POST") return sendMethodNotAllowed(response);
                await store.delete();
                cachedQuota = undefined;
                return sendJson(response, 200, { ok: true, value: await webStatus(store, modelSettings) });
              }
              return sendJson(response, 404, { ok: false, error: "not-found" });
            } catch (error) {
              return sendJson(response, 500, { ok: false, error: safeError(error) });
```

</details>

**依据 6 · 作者声明**：[README.md:12-17](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/README.md#L12-L17)

作者声明是非官方接入。

```text
This is a DSH Web plugin. It registers a DSH `LlmAdapter`
under provider route `antigravity`, stores OAuth credentials under DSH home,
talks to the Cloud Code Assist streaming API directly, and provides full bilingual (English & Simplified Chinese) i18n support in the Web settings page.

> Unofficial integration. This project is not affiliated with or endorsed by
> Google. Use it only with accounts and services you are authorized to access.
```

#### 缺口

- 账号授权、回调可达范围、部署路由权限和多进程刷新未实测
  **影响**：不能保证共享环境或远程设置的隔离
  **进一步探讨**：核对隔离环境的路由访问与流转；用模拟凭据做双进程冲突验证

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 界面显示的模型、实际采用的模型及重试结果是否总是同一件事？

**研究主题**：功能与机制、缺陷与关键质疑、工程质量与复用

#### 完整回答

先读取已有凭据，缺凭据抛 AUTH；临近过期刷新，无项目配置时尝试发现。请求按模型需要决定 runtime 候选及端点。403/404/429/5xx 中指定状态会尝试下个端点，识别个人配额用尽后停止该端点轮换；最终 404 可切换下一个 runtime 候选。成功但未产生内容时允许额外两次尝试并退避。外层 watchdog 和 AbortSignal 控制请求消费，异常转换为诊断或取消错误。调用者可能选同一个显示模型而命中不同候选和端点，固定源码没有证明线上可获模型或一致响应。默认支持名单也不能证明账号最终配额。

#### 证据与依据

**依据 1 · 源码核查**：[lib/index.js:2545-2572](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2545-L2572)

读取、刷新和发现项目。

<details>
<summary>查看原文（28行）</summary>

```text

async function ensureApiKey(store) {
  let credentials = await store.read();
  if (!credentials) {
    throw new LlmError("No Antigravity OAuth credentials. Run /antigravity-login.", "AUTH");
  }
  if (needsRefresh(credentials)) {
    credentials = await store.modify(async (current) => {
      if (!current) throw new LlmError("No Antigravity OAuth credentials. Run /antigravity-login.", "AUTH");
      if (!needsRefresh(current)) return current;
      return refreshAntigravityToken(current);
    });
  }
  let warmedProject = null;
  if (!credentialProjectId(credentials) && !antigravityEnv("PROJECT_ID")) {
    warmedProject = await loadCodeAssist(credentials.access);
    if (warmedProject) {
      await store.modify(async (current) => (current ? { ...current, projectId: warmedProject } : current));
    }
  }
  const projectId = resolveProjectId({
    credentialProjectId: credentialProjectId(credentials),
    email: credentialEmail(credentials),
    warmedProject,
  });
  setLastProjectId(projectId);
  return { token: credentials.access, projectId, email: credentialEmail(credentials) };
}
```

</details>

**依据 2 · 源码核查**：[lib/index.js:2580-2598](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2580-L2598)

候选模型及网络异常处理。

<details>
<summary>查看原文（19行）</summary>

```text
  const runtimeCandidates = [initialRuntimeModel];
  const fallback = getFallbackRuntimeModel(initialRuntimeModel, effort);
  if (fallback && fallback !== initialRuntimeModel) runtimeCandidates.push(fallback);
  return runtimeCandidates;
}

async function fetchStreamResponse(endpoint, headers, body, signal) {
  try {
    return await fetch(`${endpoint}/v1internal:streamGenerateContent?alt=sse`, {
      method: "POST",
      headers,
      body,
      signal,
    });
  } catch (error) {
    setLastError(error);
    if (signal?.aborted) throw new LlmError("antigravity request aborted by caller", "ABORTED", { cause: error });
    throw error;
  }
```

</details>

**依据 3 · 源码核查**：[lib/index.js:2615-2661](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2615-L2661)

实际 HTTP 状态、模型回退及空响应重试。

<details>
<summary>查看原文（47行）</summary>

```text
  let response;
  let lastText = "";
  let runtimeModel = runtimeCandidates[0];

  for (let emptyAttempt = 0; emptyAttempt <= 2; emptyAttempt++) {
    if (signal?.aborted) throw new LlmError("antigravity request aborted by caller", "ABORTED");
    if (emptyAttempt > 0) {
      const delay = 500 * 2 ** (emptyAttempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    for (let candidateIndex = 0; candidateIndex < runtimeCandidates.length; candidateIndex++) {
      runtimeModel = runtimeCandidates[candidateIndex];
      setLastResolvedRuntimeModel(runtimeModel);
      const body = JSON.stringify(buildRequest(options, model, projectId, runtimeModel, effort));

      for (const endpoint of endpointCandidates()) {
        setLastEndpoint(endpoint);
        response = await fetchStreamResponse(endpoint, requestHeaders, body, signal);
        setLastStatus(response.status);
        if (response.ok) break;
        lastText = await response.text();
        if (response.status === 429 && /Individual quota reached/i.test(lastText)) break;
        if (![403, 404, 429, 500, 502, 503, 504].includes(response.status)) break;
      }

      if (response?.ok) break;
      if (response?.status === 404 && candidateIndex + 1 < runtimeCandidates.length) continue;
      break;
    }

    if (!response || !response.ok) {
      const friendly = friendlyAntigravityError(response?.status, lastText);
      throw new LlmError(
        `Antigravity API error (${response?.status ?? "no response"}, ${formatRequestDiagnostics({ projectId, runtimeModel })}): ${friendly}`,
        classifyAntigravityError(friendly),
      );
    }

    const state = createStreamState();
    for await (const chunk of streamResponseToChunks(response, model, runtimeModel, state)) {
      yield chunk;
    }
    if (state.hasContent) return;
  }

  throw new LlmError("Antigravity API returned an empty response", EMPTY_RESPONSE_CODE);
```

</details>

**依据 4 · 源码核查**：[lib/index.js:2706-2744](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2706-L2744)

流空闲超时、停止和迭代器回收。

<details>
<summary>查看原文（39行）</summary>

```text
  async *stream(options) {
    const settings = await this.#modelSettings.read();
    const model = modelFromSettings(settings, options.model);

    const consumer = new AbortController();
    const upstream =
      options.signal === undefined ? consumer.signal : AbortSignal.any([options.signal, consumer.signal]);
    const watchdog = idleWatchdog(upstream, STREAM_IDLE_TIMEOUT_MS, STREAM_IDLE_TIMEOUT_CODE);
    const iterator = requestAntigravityChunks(options, model, watchdog.signal, this.#store)[Symbol.asyncIterator]();

    let exhausted = false;
    try {
      while (true) {
        const result = await watchdog.next(iterator);
        if (timeoutOf(watchdog.signal, STREAM_IDLE_TIMEOUT_CODE) !== undefined) {
          throw new LlmError(`antigravity stream idle timeout after ${STREAM_IDLE_TIMEOUT_MS}ms`, "TIMEOUT");
        }
        if (result.done) {
          exhausted = true;
          return;
        }
        yield result.value;
      }
    } catch (error) {
      if (timeoutOf(watchdog.signal, STREAM_IDLE_TIMEOUT_CODE) !== undefined) {
        throw new LlmError(`antigravity stream idle timeout after ${STREAM_IDLE_TIMEOUT_MS}ms`, "TIMEOUT", { cause: error });
      }
      if (options.signal?.aborted) throw new LlmError("antigravity request aborted by caller", "ABORTED", { cause: error });
      throw error;
    } finally {
      consumer.abort("antigravity stream consumer stopped");
      if (!exhausted) {
        try {
          await iterator.return(undefined);
        } catch {
          // Ignore upstream cleanup failure after consumer cancellation.
        }
      }
      watchdog[Symbol.dispose]();
```

</details>

#### 缺口

- 未验证外部 API 返回的不同错误及配额策略
  **影响**：不能将本地 diag 或模型选项当实时可用性证明
  **进一步探讨**：用已有授权测试环境或模拟响应，对照 404、配额和空响应实际显示

<a id="research-q04"></a>

<a id="detail-section-14"></a>

### Q04 · 为什么先观察，怎样验证它的调用回执比现有设置更可复查？

**研究主题**：效果与总成本、采用判断、新假设与验证

#### 完整回答

适合有 DSH Web 和已获授权服务的用户研究现有工作流能否少切客户端，实际采用先核对授权及配置要求。首次成本为安装、核对可用模型和处理 OAuth；持续成本包括远端请求配额、网络延迟、令牌更新和失败排查，金额与效率没有测量。相对较少不确定的已获准调用途径是保留组织现有模型供应商或外部官方客户端。可将每次请求的可公开标识、选择模型、实际 runtime 和退路原因形成去凭据回执，让用户检查默认选择是否匹配真实调用。以模拟 404 后换模型、正常调用与个人配额耗尽考察诊断时间。若回执暴露项目或凭据、或已有诊断已足以完成复核，则不采用这一设计。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:58-88](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/README.md#L58-L88)

作者说明 OAuth、配额和凭据位置。

<details>
<summary>查看原文（31行）</summary>

````text
## Login

Open **Settings > Antigravity** and click **Login**. The settings page starts
Google OAuth and refreshes quota after login completes.

![Antigravity Settings - Not Signed In](./assets/images/settings-not-signed-in.png)

After login, the settings page displays account information, quota grouped by model family, reset times, and model selector options:

- **Gemini Models** — Gemini Flash / Pro variants share one quota pool (green bars).
- **Claude and GPT models** — Claude Opus, Claude Sonnet, and GPT-OSS share a separate 3P quota pool (cyan bars).

Each group shows a **5-hour limit** (smooths short-term demand) and a **weekly limit** (tied to your subscription tier) with a live countdown to reset.

![Antigravity Settings - Signed In with Quota](./assets/images/settings-signed-in.png)

The plugin starts a loopback OAuth callback server at
`http://localhost:51121/oauth-callback`. If the Web service cannot open a
browser, run the terminal helper on the same machine:

```sh
node "$DSH_HOME/profiles/web/node_modules/dsh-antigravity/bin/antigravity-login.mjs"
```

Credentials are stored at:

```text
$DSH_HOME/storages/antigravity-oauth.json
```

Keep that file private. It contains access and refresh tokens.
````

</details>

**依据 2 · 源码核查**：[lib/index.js:2619-2651](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L2619-L2651)

实际记录最后候选与 HTTP 状态，作为回执设计的出发点。

<details>
<summary>查看原文（33行）</summary>

```text
  for (let emptyAttempt = 0; emptyAttempt <= 2; emptyAttempt++) {
    if (signal?.aborted) throw new LlmError("antigravity request aborted by caller", "ABORTED");
    if (emptyAttempt > 0) {
      const delay = 500 * 2 ** (emptyAttempt - 1);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }

    for (let candidateIndex = 0; candidateIndex < runtimeCandidates.length; candidateIndex++) {
      runtimeModel = runtimeCandidates[candidateIndex];
      setLastResolvedRuntimeModel(runtimeModel);
      const body = JSON.stringify(buildRequest(options, model, projectId, runtimeModel, effort));

      for (const endpoint of endpointCandidates()) {
        setLastEndpoint(endpoint);
        response = await fetchStreamResponse(endpoint, requestHeaders, body, signal);
        setLastStatus(response.status);
        if (response.ok) break;
        lastText = await response.text();
        if (response.status === 429 && /Individual quota reached/i.test(lastText)) break;
        if (![403, 404, 429, 500, 502, 503, 504].includes(response.status)) break;
      }

      if (response?.ok) break;
      if (response?.status === 404 && candidateIndex + 1 < runtimeCandidates.length) continue;
      break;
    }

    if (!response || !response.ok) {
      const friendly = friendlyAntigravityError(response?.status, lastText);
      throw new LlmError(
        `Antigravity API error (${response?.status ?? "no response"}, ${formatRequestDiagnostics({ projectId, runtimeModel })}): ${friendly}`,
        classifyAntigravityError(friendly),
      );
```

</details>

**依据 3 · 源码核查**：[lib/index.js:400-414](https://github.com/LiZhenNet/dsh-antigravity/blob/94957767c5e247d86cec8833fb1b67f659078af6/lib/index.js#L400-L414)

诊断已有敏感字段清理器。

<details>
<summary>查看原文（15行）</summary>

```text
    .replace(/\b1\/[A-Za-z0-9_-]{20,}/g, "[redacted-refresh-token]")
    .replace(/\bBearer\s+[A-Za-z0-9._~+/-]+=*/gi, "Bearer [redacted]")
    .replace(
      /("?(?:access_token|refresh_token|id_token|token|client_secret|code_verifier|authorization)"?\s*[:=]\s*")[^"]*(")/gi,
      "$1[redacted]$2",
    )
    .replace(
      /("?(?:access_token|refresh_token|id_token|token|client_secret|code_verifier|authorization)"?\s*[:=]\s*)[^\s&,}]+/gi,
      "$1[redacted]",
    );
}

function safeError(error) {
  const raw = error instanceof Error ? error.message : String(error);
  return redactSecrets(raw);
```

</details>

#### 缺口

- 没有已获明确许可的账号与测试环境
  **影响**：无法验证外部接口、账单或配额对采用的影响
  **进一步探讨**：先通过使用套餐和许可确认，再模拟可重放的无凭据响应

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
