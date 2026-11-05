# dsh-llm-workbuddy

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)

源码版本：[8bbc778](https://github.com/Axiaohungry/dsh-llm-workbuddy/tree/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e)

<!-- BEGIN META -->
[![GitHub ★ 92](https://img.shields.io/static/v1?label=GitHub+%E2%98%85&message=92&color=9a742f&logo=github&style=flat&labelColor=555555&logoColor=white)](https://github.com/Axiaohungry/dsh-llm-workbuddy) [![最新发布 2026-10-28](https://img.shields.io/static/v1?label=%E6%9C%80%E6%96%B0%E5%8F%91%E5%B8%83&message=2026-10-28&color=557c63&style=flat&labelColor=555555&logoColor=white)](https://www.npmjs.com/package/@axiaohungry/dsh-llm-workbuddy)
<!-- END META -->

> **功能**：为 DSH 提供 WorkBuddy API Key、账号登录和会话独立凭据选择。

> **亮点**：[Q01](#research-q01) 将账号模型带入 DSH 并支持会话选择。

> **主要限制**：[Q02](#research-q02) 刷新调用未传取消信号，会话上下文也不等于服务侧独立账本。

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
  - [Q01 · 账号和模型如何一路变成出站请求？](#detail-section-11)
  - [Q02 · 会话选择、刷新和取消分别能保证什么？](#detail-section-12)
  - [Q03 · 怎样验证值得把工作搬到这条路由？](#detail-section-13)

<a id="detail-section-1"></a>

## 1 插件分析

<a id="detail-section-2"></a>

### 1.1 用途与适用场景

> **用途**：已有 WorkBuddy 权限的 DSH 用户需要按会话分配账号。

在 WorkBuddy 原入口工作或全局单 Key 配置。

<a id="detail-section-3"></a>

### 1.2 能力、流程与成本

#### 能力

| 能力 | 主要用途 | 使用条件与边界 |
| --- | --- | --- |
| 模型发现 | 按当前凭据读取在线目录并解析模型 | 需账号许可；目录信号支持取消，实际模型以服务为准 |
| 会话凭据选择 | 异步上下文为请求绑定账号或 Key | 失效显式 Key 报错；不代表服务侧独立账本 |
| 生成与兼容 | streamSimple 与 fetch 包装，改写系统身份并保留流式迭代 | 用户消息不改；底层取消和真实工具结果待验 |
| 登录刷新设置 | 选择已存登录、按账号合并刷新并保存新凭据 | 同进程 promise；刷新调用未传 signal，双写非原子 |

#### 启动与依赖

| 依赖或条件 | 是否必需 | 用途 | 缺失或不满足时 |
| --- | --- | --- | --- |
| 兼容 DSH 与合法账号/Key | 必需 | 模型调用 | 模型与配额由服务决定 |

#### 启动步骤

| 步骤 | 执行者与动作 | 成功判据或失败处理 |
| --- | --- | --- |
| 单号 | 在独立 profile 添加合法 Key，做目录发现、文本和工具任务 | 对照实际服务返回及原入口 |
| 双号 | 两会话交错绑定，清除一方 Key 并测试刷新拒绝 | 只对应会话失败，核对服务端请求归属 |
| 取消与退出 | 分别观察生成 fetch 和刷新请求，关插件回原 Provider | 不要将 UI 等待结束当作服务未执行，不重发未知请求 |

#### 成本

| 阶段 | 现金与资源成本 | 人工与时间投入 | 已知条件与未知项 |
| --- | --- | --- | --- |
| 首次 | 模型费用和配置工时未知 | 建立合法账号/Key、匹配 Host、核对系统提示兼容改写 | 不要求本机 WorkBuddy CLI |
| 持续 | 积分与模型费用由服务决定，未测 | 维护目录、账号权限、刷新和版本兼容 | 多个会话用同账号仍共享额度 |
| 失败 | 已消费额度和恢复工时未知 | 核查两份凭据记录、账号归因及迟到请求，再回原入口 | 取消当前流不保证刷新被取消，禁止盲重试 |

#### 效果

| 效果项 | 当前证据支持 | 尚不能确定 |
| --- | --- | --- |
| 模型路由 | 源码将 streamSimple 请求指向 WorkBuddy 并包装 headers | 真实账号授权与工具输出 |
| 会话选择 | 源码在迭代时恢复 sessionId 并拒绝无效显式 Key | 跨 Host 并发、服务侧归因和独立计费 |
| 效率 | 尚无入口对照数据 | 切换次数、完成时间和调用成本 |

> **思考**：[Q02](#research-q02) 刷新调用未传取消信号，会话上下文也不等于服务侧独立账本。

<a id="detail-section-4"></a>

### 1.3 工程亮点

> **亮点**：[Q01](#research-q01) 将账号模型带入 DSH 并支持会话选择。

[Q02](#research-q02) 显式凭据失效抛错，流式保留上下文。

<a id="detail-section-5"></a>

### 1.4 主要限制

[Q02](#research-q02) 刷新调用未传取消信号，会话上下文也不等于服务侧独立账本。

<a id="detail-section-6"></a>

### 1.5 使用建议

[Q03](#research-q03) 单号验收后测试双号并发。

<a id="detail-section-7"></a>

### 1.6 核查说明与分析版本

**核查状态**：已检查源码。

静态核对注册和绑定，未授权或调用。

- 已检查：作者 README、包清单、源码路径 index.js、workbuddy-auth.js、README.md 及固定范围 inventory；组件：仓库根。抽读不冒充完整审计，来源和原文嵌入正式快照时保留。
- 未执行：插件安装、目标代码与测试、真实宿主及模型任务。源码存在不等于运行通过。
- 边界：固定 Provider 与 stream 源码，未运行。
- 下一步：文本、工具、失效凭据和并发归因。

**分析版本**

- **仓库**：[Axiaohungry/dsh-llm-workbuddy](https://github.com/Axiaohungry/dsh-llm-workbuddy)
- **版本号**：1.3.27（[固定提交 8bbc778](https://github.com/Axiaohungry/dsh-llm-workbuddy/tree/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e)）
- **版本日期**：2026-10-28（固定提交日期，北京时间；不是包发布日期）

<a id="detail-section-8"></a>

## 2 未来设计假设（未验证）

<a id="innovation"></a>

[Q03](#research-q03) 双账号对照错误归因与配置成本。

文本、工具、失效凭据和并发归因。

<a id="detail-section-9"></a>

## 3 辅助信息

<details>
<summary>工程统计</summary>

仅统计 Markdown 和指定的 JavaScript／TypeScript 扩展名；Python 等其他语言不纳入，表格不代表全语言代码规模。

| 扩展名 | 范围 | 文件数 | 总行 | 代码行 | 注释行 | 字数 |
|---|---|---:|---:|---:|---:|---:|
| .js | source | 8 | 5398 | 5082 | 81 | — |
| .md | source | 3 | 829 | — | — | 6382 |

</details>

**活跃度**

[![Issue 未关闭 9](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=Issue+%E6%9C%AA%E5%85%B3%E9%97%AD&message=9&color=737b86&logo=github)](https://github.com/Axiaohungry/dsh-llm-workbuddy/issues?q=is%3Aissue+is%3Aopen) [![近30天新建 7](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E6%96%B0%E5%BB%BA&message=7&color=737b86&logo=github)](https://github.com/Axiaohungry/dsh-llm-workbuddy/issues?q=is%3Aissue+created%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z) [![近30天关闭 0](https://img.shields.io/static/v1?style=flat&labelColor=555555&logoColor=white&label=%E8%BF%9130%E5%A4%A9%E5%85%B3%E9%97%AD&message=0&color=737b86&logo=github)](https://github.com/Axiaohungry/dsh-llm-workbuddy/issues?q=is%3Aissue+is%3Aclosed+closed%3A2026-10-06T05%3A36%3A35.976Z..2026-11-05T05%3A36%3A35.976Z)



统计日期：2026-11-05。

<a id="detail-section-10"></a>

## 4 研究问题与完整回答

**插件研究总目标**：会话独立账号能否接入 WorkBuddy 模型？

<a id="research-q01"></a>

<a id="detail-section-11"></a>

### Q01 · 账号和模型如何一路变成出站请求？

**研究主题**：场景与需求、功能与机制、贡献与相对优势

#### 完整回答

有 WorkBuddy 中国区账号或 API Key 的用户，可在 DSH 设置中维护多个凭据并为会话选定。adapter 注册本地 Provider，resolveModel 会在本地目录缺模型时按当前凭据重新发现；发现请求本身接收 signal。实际生成调用 openAICompletionsApi.streamSimple，workBuddyRequestOptions 保留 options 并替换 fetch，出站先 sanitize 请求再附客户端兼容 headers。模型描述的 baseUrl 指向 copilot.tencent.com/v2，协议标为 openai-completions。sanitize 只改 system/developer 中的身份句、DeepSeek Harness 品牌文字和路径指导，用户消息不改。因此这不是原样转发：插件在复用 DSH 工具与会话的同时，调整给服务的系统身份以满足兼容要求。它还提供旧/新 adapter 的 prepareCall 分支，弥合宿主接口变化。真实服务是否接受这些兼容声明、返回哪些模型和额度，仍由账号许可和后端决定，源码不能证实。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:70-96](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L70-L96)

系统提示兼容改写。

<details>
<summary>查看原文（27行）</summary>

```text
function sanitizeWorkBuddyRequest(init) {
  if (typeof init?.body !== "string") return init;
  let body;
  try { body = JSON.parse(init.body); } catch { return init; }
  if (!Array.isArray(body?.messages)) return init;
  // Upstream also checks runtime branding outside the introductory identity sentence.
  const rewrite = (text) => text.replace(IDENTITY_SENTENCE_RE, "You are CodeBuddy, an AI coding assistant.")
    .replace(/\bDeepSeek Harness\b/gi, "CodeBuddy")
    .replaceAll(PATH_REFERENCE_GUIDANCE, COMPATIBLE_PATH_REFERENCE_GUIDANCE);
  let changed = false;
  const messages = body.messages.map((message) => {
    if (!["system", "developer"].includes(message?.role)) return message;
    let content = message.content;
    if (typeof content === "string") content = rewrite(content);
    else if (Array.isArray(content)) {
      const parts = content.map((part) => {
        if (part?.type !== "text" || typeof part.text !== "string") return part;
        const text = rewrite(part.text);
        return text === part.text ? part : { ...part, text };
      });
      if (parts.some((part, index) => part !== content[index])) content = parts;
    }
    if (content === message.content) return message;
    changed = true;
    return { ...message, content };
  });
  return changed ? { ...init, body: JSON.stringify({ ...body, messages }) } : init;
```

</details>

**依据 2 · 源码核查**：[index.js:161-181](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L161-L181)

出站 fetch 包装。

<details>
<summary>查看原文（21行）</summary>

```text
function workBuddyRequestOptions(options) {
  const trace = traceContext.getStore();
  const fetchImpl = options?.fetch ?? globalThis.fetch;
  return {
    ...options,
    timeoutMs: options?.timeoutMs ?? STREAM_IDLE_TIMEOUT_MS,
    headers: codeBuddyHeaders(options?.headers),
    fetch: async (input, init) => {
      const started = Date.now();
      traceEvent(trace, "http.start");
      try {
        const prepared = sanitizeWorkBuddyRequest(init);
        const headers = codeBuddyHeaders(prepared?.headers ?? options?.headers);
        traceEvent(trace, "http.request", workBuddyRequestSummary(prepared, headers, prepared?.body !== init?.body));
        const response = await fetchImpl(input, { ...prepared, headers });
        traceEvent(trace, "http.headers", { elapsedMs: Date.now() - started, status: response.status });
        return await normalizeWorkBuddyError(response, trace);
      } catch (error) {
        traceEvent(trace, "http.error", { elapsedMs: Date.now() - started, ...errorFields(error) });
        throw error;
      }
```

</details>

**依据 3 · 源码核查**：[index.js:200-224](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L200-L224)

streamSimple 实际调用。

<details>
<summary>查看原文（25行）</summary>

```text
function observedWorkBuddyStream(model, context, options) {
  const trace = traceContext.getStore();
  const started = Date.now();
  const stream = openAICompletionsApi.streamSimple(model, normalizeContext(context), workBuddyRequestOptions(options));
  return (async function* () {
    traceEvent(trace, "model.start");
    let first = true;
    let completed = false;
    let failed = false;
    try {
      for await (const chunk of stream) {
        if (first) {
          first = false;
          traceEvent(trace, "model.first-chunk", { elapsedMs: Date.now() - started });
        }
        yield chunk;
      }
      completed = true;
      traceEvent(trace, "model.done", { elapsedMs: Date.now() - started });
    } catch (error) {
      failed = true;
      traceEvent(trace, "model.error", { elapsedMs: Date.now() - started, ...errorFields(error) });
      throw error;
    } finally {
      if (!completed && !failed) traceEvent(trace, "model.cancelled", { elapsedMs: Date.now() - started });
```

</details>

**依据 4 · 源码核查**：[index.js:251-265](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L251-L265)

模型协议与基址。

<details>
<summary>查看原文（15行）</summary>

```text
function workBuddyModel({ provider = PROVIDER, id, name: modelName, contextWindow, maxTokens, images, reasoning = true, thinkingLevelMap = { off: null }, defaultReasoningEffort, thinkingFormat }) {
  return {
    id,
    name: modelName,
    api: "openai-completions",
    provider,
    baseUrl: BASE_URL,
    reasoning,
    ...(reasoning ? { thinkingLevelMap: { ...thinkingLevelMap } } : {}),
    ...(defaultReasoningEffort ? { defaultReasoningEffort } : {}),
    input: images ? ["text", "image"] : ["text"],
    cost: { ...NO_COST },
    contextWindow,
    maxTokens,
    compat: { ...COMPAT, ...(thinkingFormat ? { thinkingFormat } : {}) },
```

</details>

**依据 5 · 源码核查**：[index.js:977-1000](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L977-L1000)

新旧 prepareCall 和模型解析。

<details>
<summary>查看原文（24行）</summary>

```text
  // newer hosts, whose runtime dispatches through the returned stream handle.
  if (!legacyAdapter) {
    const adapterPrepareCall = adapter.prepareCall.bind(adapter);
    adapter.prepareCall = async (...args) => {
      await ensureWorkBuddyModel(args[0], args[1], args[2]);
      const prepared = await adapterPrepareCall(...args);
      return {
        ...prepared,
        stream: (options) => sessionScopedStream((preparedOptions) => prepared.stream(prepareWorkBuddyOptions(preparedOptions, false)), options),
      };
    };
  } else {
    // DSH 0.1.5 calls prepareCall unconditionally, while the rc.6 pi-ai
    // adapter shipped without it. Keep that older adapter usable by exposing
    // the same prepared-call shape from its existing methods.
    adapter.prepareCall = async (provider, model, signal) => ({
      model: await adapter.resolveModel(provider, model, signal),
      stream: (options) => sessionScopedStream(invokeAdapterStream, options),
    });
  }
  const resolveModel = adapter.resolveModel.bind(adapter);
  adapter.resolveModel = async (provider, model, signal) => {
    await ensureWorkBuddyModel(provider, model, signal);
    const resolved = await resolveModel(provider, model, signal);
```

</details>

#### 缺口

- 实际后端请求、条款与工具输出未验证
  **影响**：不能证明兼容请求成功或模型范围可靠
  **进一步探讨**：单账号最小任务记录服务响应与工具结果，核对用户授权范围

<a id="research-q02"></a>

<a id="detail-section-12"></a>

### Q02 · 会话选择、刷新和取消分别能保证什么？

**研究主题**：工程质量与复用、缺陷与关键质疑、依赖、兼容与流程

#### 完整回答

sessionScopedStream 把 sessionId、headers 和 trace 绑定到异步本地上下文，并在 next/return/throw 时重新进入上下文。显式绑定 Key 无法解析时抛错，没有默默换全局 Key。登录账号按 requestedId 或 active 选择，并以账号键合并同进程刷新 promise；过期时 refreshWorkBuddySession 发带 refresh token 的 POST，成功写新 sessions store 和活跃旧兼容引用。此处调用 refreshWorkBuddySession(session) 未传 signal，尽管底层函数支持，故取消当前生成不证明刷新 HTTP 已取消。普通生成 fetch 保留 init 中的信号，目录发现也传 signal，但底层 openAI 库如何终止网络与服务工作未运行。刷新的两次凭据写是分步的，部分失败和跨 Host 并发需要额外核查。这些机制支持请求选对账号，不等于不同会话拥有独立账本：用同账号的两会话自然共用服务额度，账目需要对照服务侧统计。

#### 证据与依据

**依据 1 · 源码核查**：[index.js:772-830](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L772-L830)

账号选择、同进程 promise 和分步保存。

<details>
<summary>查看原文（59行）</summary>

```text
  const resolveLoginSession = async (requestedId) => {
    const key = typeof requestedId === "string" && requestedId ? requestedId : "active";
    let promise = loginSessionPromises.get(key);
    if (!promise) {
      promise = (async () => {
        const credentials = ctx.get("credentials");
        const env = launchEnvironmentOf(ctx);
        const sessionsRef = credentialRef(WORKBUDDY_SESSIONS_REF);
        const sessionRefs = [sessionsRef, credentialRef(LEGACY_SESSIONS_REF)];
        let sessionsValue;
        for (const ref of sessionRefs) {
          const storedSessions = await credentials?.resolve(ref);
          sessionsValue = storedSessions?.value ?? env.get(ref)?.value;
          if (sessionsValue) break;
        }
        let store;
        if (sessionsValue) {
          store = parseWorkBuddySessions(sessionsValue);
        } else {
          const legacyRefs = [credentialRef(WORKBUDDY_SESSION_REF), credentialRef(LEGACY_SESSION_REF)];
          let legacyValue;
          for (const ref of legacyRefs) {
            const storedLegacy = await credentials?.resolve(ref);
            legacyValue = storedLegacy?.value ?? env.get(ref)?.value;
            if (legacyValue) break;
          }
          if (!legacyValue) throw new Error("未找到 WorkBuddy 登录凭据");
          store = createWorkBuddySessionStore([parseWorkBuddySession(legacyValue)]);
        }
        const active = typeof requestedId === "string" && requestedId
          ? store.sessions.find((entry) => entry.id === requestedId)
          : activeWorkBuddySession(store);
        if (!active) throw new Error("未找到 WorkBuddy 登录账号");
        let session = active;
        if (sessionNeedsRefresh(session)) {
          const trace = traceContext.getStore();
          const started = Date.now();
          traceEvent(trace, "auth.refresh-start");
          try {
            session = { ...session, ...(await refreshWorkBuddySession(session)), updatedAt: Date.now() };
            traceEvent(trace, "auth.refresh-done", { elapsedMs: Date.now() - started });
          } catch (error) {
            traceEvent(trace, "auth.refresh-error", { elapsedMs: Date.now() - started, ...errorFields(error) });
            throw error;
          }
          const nextStore = {
            ...store,
            sessions: store.sessions.map((entry) => entry.id === session.id ? session : entry),
          };
          await credentials?.set(sessionsRef, serializeWorkBuddySessions(nextStore));
          if (nextStore.activeId === session.id) await credentials?.set(credentialRef(WORKBUDDY_SESSION_REF), serializeWorkBuddySession(session));
        }
        return { ...session, sessionId: active.id, expiresAt: sessionCacheDeadline(session) };
      })().finally(() => {
        loginSessionPromises.delete(key);
      });
      loginSessionPromises.set(key, promise);
    }
    return promise;
```

</details>

**依据 2 · 源码核查**：[workbuddy-auth.js:371-387](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/workbuddy-auth.js#L371-L387)

刷新请求及信号入口。

<details>
<summary>查看原文（17行）</summary>

```text
export async function refreshWorkBuddySession(session, signal) {
  if (!session?.auth?.refreshToken) throw new Error("WorkBuddy 登录会话缺少刷新令牌，请重新登录");
  const auth = await request("/auth/token/refresh", {
    method: "POST",
    headers: {
      ...REQUEST_HEADERS,
      ...enterpriseHeaders(session),
      "X-Refresh-Token": session.auth.refreshToken,
      "X-Auth-Refresh-Source": "plugin",
    },
    body: "{}",
    signal,
  }, "刷新 WorkBuddy 登录令牌");
  const fresh = calculateExpiresAt(auth);
  const merged = { ...session.auth, ...fresh, refreshToken: fresh?.refreshToken ?? session.auth.refreshToken };
  if (!merged.accessToken) throw new Error("WorkBuddy 刷新接口没有返回访问令牌");
  return { auth: merged, account: normalizeAccount(session.account, merged) };
```

</details>

**依据 3 · 源码核查**：[index.js:873-893](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L873-L893)

显式 Key 失败。

<details>
<summary>查看原文（21行）</summary>

```text
    if (WORKBUDDY_PROVIDERS.has(provider) && binding?.mode === "api-key") {
      const bindingRef = binding.apiKeyRef;
      if (!bindingRef) throw new LlmError(`${name}: 当前会话绑定的 API Key 引用无效`, "MISSING_CREDENTIAL");
      const stored = await ctx.get("credentials")?.resolve(credentialRef(bindingRef));
      const value = stored?.value ?? launchEnvironmentOf(ctx).get(credentialRef(bindingRef))?.value;
      if (value) return { value: assertUsableApiKey(value, name, bindingRef), kind: "api-key", ref: bindingRef };
      throw new LlmError(`${name}: 当前会话绑定的 API Key 不可用`, "MISSING_CREDENTIAL");
    }
    if (!ref && WORKBUDDY_PROVIDERS.has(provider)) {
      let session;
      try {
        session = await resolveLoginSession();
      } catch (error) {
        throw new LlmError(`${name}: 未找到可用的 WorkBuddy 登录令牌，请运行 dsh-llm-workbuddy login`, "MISSING_CREDENTIAL", { cause: error });
      }
      context.headers = {
        ...(session.account.userId ? { "X-User-Id": session.account.userId } : {}),
        ...(session.account.enterpriseId ? { "X-Enterprise-Id": session.account.enterpriseId, "X-Tenant-Id": session.account.enterpriseId } : {}),
        ...(session.auth.domain ? { "X-Domain": session.auth.domain } : {}),
      };
      return { value: assertUsableApiKey(session.auth.accessToken, name, "WorkBuddy login session"), kind: "bearer", sessionId: session.sessionId };
```

</details>

**依据 4 · 源码核查**：[index.js:952-974](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L952-L974)

流式上下文和取消迭代方法。

<details>
<summary>查看原文（23行）</summary>

```text
  const sessionScopedStream = (stream, options) => {
    const context = { sessionId: options?.sessionId === undefined ? undefined : String(options.sessionId), headers: {}, id: ++nextTraceId };
    const run = (action) => traceContext.run(context, () => requestContext.run(context, action));
    const source = run(() => stream(options));
    const iterator = source[Symbol.asyncIterator]();
    return {
      [Symbol.asyncIterator]() { return this; },
      async next(value) {
        const result = await run(() => iterator.next(value));
        const chunk = result.value;
        if (context.modelRateLimited && chunk?.type === "finish" && chunk.reason?.kind === "error") {
          return { ...result, value: { ...chunk, reason: { ...chunk.reason, failure: { ...chunk.reason.failure, code: "WORKBUDDY_MODEL_RATE_LIMIT" } } } };
        }
        return result;
      },
      return(value) { return run(() => iterator.return?.(value) ?? Promise.resolve({ done: true, value })); },
      throw(error) { return run(() => iterator.throw?.(error) ?? Promise.reject(error)); },
    };
  };
  const adapterStream = adapter.stream.bind(adapter);
  const legacyAdapter = typeof adapter.prepareCall !== "function";
  const invokeAdapterStream = (options) => adapterStream(prepareWorkBuddyOptions(options, legacyAdapter));
  adapter.stream = (options) => sessionScopedStream(invokeAdapterStream, options);
```

</details>

**依据 5 · 源码核查**：[index.js:168-181](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L168-L181)

出站保留 init。

<details>
<summary>查看原文（14行）</summary>

```text
    fetch: async (input, init) => {
      const started = Date.now();
      traceEvent(trace, "http.start");
      try {
        const prepared = sanitizeWorkBuddyRequest(init);
        const headers = codeBuddyHeaders(prepared?.headers ?? options?.headers);
        traceEvent(trace, "http.request", workBuddyRequestSummary(prepared, headers, prepared?.body !== init?.body));
        const response = await fetchImpl(input, { ...prepared, headers });
        traceEvent(trace, "http.headers", { elapsedMs: Date.now() - started, status: response.status });
        return await normalizeWorkBuddyError(response, trace);
      } catch (error) {
        traceEvent(trace, "http.error", { elapsedMs: Date.now() - started, ...errorFields(error) });
        throw error;
      }
```

</details>

#### 缺口

- 真实刷新竞争、取消后服务侧执行及账单未测
  **影响**：不能承诺跨 Host 原子刷新、即时取消或会话独立计费
  **进一步探讨**：双账号并发与失效测试，取消时观察生成和刷新分别结束，核对服务请求计数

<a id="research-q03"></a>

<a id="detail-section-13"></a>

### Q03 · 怎样验证值得把工作搬到这条路由？

**研究主题**：采用判断、效果与总成本、新假设与验证

#### 完整回答

先在独立 profile 用单 API Key 完成一个有工具调用的短任务，保留原入口对照。合格结果包括模型目录可解析、出站账号正确、工具参数和最终文本可用，取消后 DSH 能退出等待且迟到请求被单独标明。再建两个测试会话分别绑定两个有权限的账号，交错调用，清除其中一个凭据时要求仅该绑定失败，另一个继续；并分别测试登录刷新拒绝、写凭据失败和用户取消，确认没有自动切换身份。每项用后端请求日志或服务用量作归因依据，不能只看本地 sessionId。比较原入口与插件的配置步骤、模型 token、完成时间和排障负担；假设是减少切换且不增加身份错误，若工具流丢失、归因不清或刷新破坏另一账号则停止多账号扩围。退出可关插件并回原 Provider，但已发请求与已消费积分不会撤销；停用前保留合法的账户状态核对，避免盲目重复任务。

#### 证据与依据

**依据 1 · 作者声明**：[README.md:21-27](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/README.md#L21-L27)

版本与平台前置。

```text
## 环境要求

- 已安装 DSH，支持已声明兼容的旧版和 `0.2.x` 系列。
- Node.js `>= 22.19.0`。
- 支持 Windows、Linux、macOS。

DSH 升级到新版本系列后，请先确认插件兼容性。
```

**依据 2 · 作者声明**：[README.md:59-78](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/README.md#L59-L78)

重启和 Key 路径。

<details>
<summary>查看原文（20行）</summary>

```text
**安装或更新后，完整退出并重新启动 DSH。** 只刷新页面不会完成更新。
更新可保留已有模型、账号和 Key 配置。

## 使用方法

### 1. 打开配置

桌面端进入 **设置 → 插件 → WorkBuddy 插件详情**。
WebUI 进入 **设置 → 模型**，添加或编辑 **WorkBuddy 中国区**。
具体入口可能随 DSH 版本略有不同。

### 2. 选择认证方式

**API Key**

1. 选择 `API Key` 模式。
2. 在“新增 API Key”中粘贴 Key，可填写便于识别的名称。
3. 点击“添加并使用”，或从下拉列表中选择已有 Key。

也可选择环境变量 `WORKBUDDY_API_KEY`；兼容已有的 `CODEBUDDY_API_KEY`。
```

</details>

**依据 3 · 源码核查**：[index.js:873-893](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L873-L893)

失效验收点。

<details>
<summary>查看原文（21行）</summary>

```text
    if (WORKBUDDY_PROVIDERS.has(provider) && binding?.mode === "api-key") {
      const bindingRef = binding.apiKeyRef;
      if (!bindingRef) throw new LlmError(`${name}: 当前会话绑定的 API Key 引用无效`, "MISSING_CREDENTIAL");
      const stored = await ctx.get("credentials")?.resolve(credentialRef(bindingRef));
      const value = stored?.value ?? launchEnvironmentOf(ctx).get(credentialRef(bindingRef))?.value;
      if (value) return { value: assertUsableApiKey(value, name, bindingRef), kind: "api-key", ref: bindingRef };
      throw new LlmError(`${name}: 当前会话绑定的 API Key 不可用`, "MISSING_CREDENTIAL");
    }
    if (!ref && WORKBUDDY_PROVIDERS.has(provider)) {
      let session;
      try {
        session = await resolveLoginSession();
      } catch (error) {
        throw new LlmError(`${name}: 未找到可用的 WorkBuddy 登录令牌，请运行 dsh-llm-workbuddy login`, "MISSING_CREDENTIAL", { cause: error });
      }
      context.headers = {
        ...(session.account.userId ? { "X-User-Id": session.account.userId } : {}),
        ...(session.account.enterpriseId ? { "X-Enterprise-Id": session.account.enterpriseId, "X-Tenant-Id": session.account.enterpriseId } : {}),
        ...(session.auth.domain ? { "X-Domain": session.auth.domain } : {}),
      };
      return { value: assertUsableApiKey(session.auth.accessToken, name, "WorkBuddy login session"), kind: "bearer", sessionId: session.sessionId };
```

</details>

**依据 4 · 源码核查**：[index.js:952-974](https://github.com/Axiaohungry/dsh-llm-workbuddy/blob/8bbc7788981602edb35ecd7c75cddb8dfbdfe31e/index.js#L952-L974)

并发及返回边界。

<details>
<summary>查看原文（23行）</summary>

```text
  const sessionScopedStream = (stream, options) => {
    const context = { sessionId: options?.sessionId === undefined ? undefined : String(options.sessionId), headers: {}, id: ++nextTraceId };
    const run = (action) => traceContext.run(context, () => requestContext.run(context, action));
    const source = run(() => stream(options));
    const iterator = source[Symbol.asyncIterator]();
    return {
      [Symbol.asyncIterator]() { return this; },
      async next(value) {
        const result = await run(() => iterator.next(value));
        const chunk = result.value;
        if (context.modelRateLimited && chunk?.type === "finish" && chunk.reason?.kind === "error") {
          return { ...result, value: { ...chunk, reason: { ...chunk.reason, failure: { ...chunk.reason.failure, code: "WORKBUDDY_MODEL_RATE_LIMIT" } } } };
        }
        return result;
      },
      return(value) { return run(() => iterator.return?.(value) ?? Promise.resolve({ done: true, value })); },
      throw(error) { return run(() => iterator.throw?.(error) ?? Promise.reject(error)); },
    };
  };
  const adapterStream = adapter.stream.bind(adapter);
  const legacyAdapter = typeof adapter.prepareCall !== "function";
  const invokeAdapterStream = (options) => adapterStream(prepareWorkBuddyOptions(options, legacyAdapter));
  adapter.stream = (options) => sessionScopedStream(invokeAdapterStream, options);
```

</details>

#### 缺口

- 无服务许可验收和真实成本对照
  **影响**：只支持有限测试，不能推荐持续替代原入口
  **进一步探讨**：固定任务对照并保存取消、刷新与归因证据

[返回分类](../../views/categories/INFRASTRUCTURE.md) · [返回首页](../../../README.md)
